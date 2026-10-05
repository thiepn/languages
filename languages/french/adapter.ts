import type { StudyEvent, StudyResult } from "../../packages/domain/src/index.js";
import type {
  ContentAuditRecord,
  ContentReference,
  LanguagePackReleaseCandidate
} from "../../packages/content-validation/src/index.js";
import type { SourceRecord } from "../../packages/content-schema/src/index.js";
import {
  expandFrameworkLevels,
  finalizeMigrationReadiness,
  isoFromLegacyTimestamp,
  legacyEventId,
  mergeCoverage,
  normalizeFrameworkLevel,
  supportLevelFromLegacyCode,
  type EventMigrationResult,
  type LanguageAdapterOutput,
  type LegacyInventory,
  type MigrationIssue
} from "../../packages/adapter-sdk/src/index.js";
import { frenchLanguagePack } from "./manifest.js";
import { frenchLearningProfile } from "./learning.js";
import { frenchProficiencyPolicy } from "./proficiency.js";
import { frenchQualityPolicy } from "./quality.js";

const ORIGINAL_SOURCE_ID = "thiepn-french-original";

export const FRENCH_CURRENT_REPOSITORY_BASELINE = {
  repositoryRevision: "28a39ce1c59ab02301b408f016522dbddc28d0c0",
  indexBlobSha: "dee1b5108054aab8a5d42ab5ee733a0697e026f5",
  appVersion: "5.18.0",
  pinnedVocabularyBlobSha: "14beb3f21e908a471fe213c99ebc776bd11a5222",
  externalVocabularyDeclaredCount: 12000,
  externalVocabularyArrayCount: 12001,
  embedded: {
    verifiedUsageRows: 67,
    sentenceExercises: 36,
    readings: 19,
    listeningItems: 19,
    conversationScenarios: 14,
    missions: 5,
    communicativeFunctions: 25
  }
} as const;

export interface FrenchCatalogCard {
  readonly id: string;
  readonly fr: string;
  readonly en: string;
  readonly ipa?: string;
  readonly pos?: string;
  readonly level: string;
  readonly sourceLevel?: string;
  readonly order?: number;
  readonly lemma?: string;
  readonly core?: boolean;
  readonly exampleFr?: string;
  readonly exampleEn?: string;
  readonly article?: string;
  readonly gender?: string;
  readonly plural?: string;
  readonly auxiliary?: string;
  readonly pastParticiple?: string;
}

export interface FrenchCatalogSnapshot {
  readonly app?: string;
  readonly kind?: string;
  readonly version: string;
  readonly schema: number;
  readonly fingerprint: string;
  readonly cards: readonly FrenchCatalogCard[];
  readonly meta?: Readonly<Record<string, unknown>>;
}

export interface FrenchVocabularySource {
  readonly name: string;
  readonly url?: string;
  readonly license: string;
  readonly usedFor?: string;
}

export interface FrenchVocabularyWord {
  readonly id?: string;
  readonly word?: string;
  readonly meaning?: string;
  readonly ipa?: string;
  readonly pos?: string;
  readonly level?: string;
  readonly order?: number;
  readonly sentences?: readonly {
    readonly text?: string;
    readonly translation?: string;
  }[];
}

export interface FrenchVocabularyPayload {
  readonly language?: string;
  readonly version?: number | string;
  readonly generatedAt?: string;
  readonly count?: number;
  readonly sources?: readonly FrenchVocabularySource[];
  readonly words?: readonly FrenchVocabularyWord[];
}

export interface FrenchRuntimeCoverageSnapshot {
  readonly coverage: Readonly<Record<string, number>>;
  readonly qualityMetrics?: Readonly<Record<string, number>>;
}

export interface FrenchRepositoryAdapterInput {
  readonly indexHtml: string;
  readonly catalogSnapshot?: FrenchCatalogSnapshot;
  readonly vocabularyPayload?: FrenchVocabularyPayload;
  readonly runtimeCoverage?: FrenchRuntimeCoverageSnapshot;
  readonly repositoryRevision?: string;
}

export interface FrenchLegacyReviewEntry {
  readonly t?: number | string;
  readonly id?: string;
  readonly noteId?: string;
  readonly rating?: "again" | "hard" | "good" | "easy";
  readonly responseMs?: number;
  readonly direction?: string;
  readonly typed?: boolean;
  readonly typedQuality?: string;
  readonly level?: string;
  readonly practice?: string;
  readonly correct?: boolean;
  readonly mixedReview?: boolean;
  readonly mixedLane?: string;
  readonly mixedModality?: string;
  readonly mixedKind?: string;
  readonly mixedSupportLevel?: number;
  readonly mixedFirstAttempt?: boolean;
  readonly mixedRecoveryStep?: string;
  readonly remediationPractice?: boolean;
  readonly remediationCause?: string;
  readonly remediationStage?: string;
  readonly sentenceDiagnosis?: string;
  readonly transferDiagnosis?: string;
}

export interface FrenchSourceInspection {
  readonly appVersion?: string;
  readonly pinnedVocabularyBlobSha?: string;
  readonly readings: readonly EmbeddedRow[];
  readonly scenarios: readonly EmbeddedRow[];
  readonly missions: readonly EmbeddedRow[];
  readonly sentenceExercises: readonly EmbeddedRow[];
  readonly verifiedUsageRows: number;
  readonly listeningDerivedFromReadings: boolean;
  readonly communicativeFunctionCount: number;
}

interface EmbeddedRow {
  readonly id: string;
  readonly level?: string;
  readonly title?: string;
  readonly topic?: string;
  readonly sourceLabel?: string;
  readonly license?: string;
  readonly scenarios?: readonly string[];
}

export function inspectFrenchAppSource(indexHtml: string): FrenchSourceInspection {
  const readings = extractObjectRows(indexHtml, "V550_READINGS");
  const scenarios = extractObjectRows(indexHtml, "V580_SCENARIOS");
  const missions = extractObjectRows(indexHtml, "V590_MISSIONS");
  const sentenceExercises = extractObjectRows(indexHtml, "V530_SENTENCE_EXERCISES");
  const verifiedUsageRows = extractArrayElements(indexHtml, "V510_CORPUS_ROWS").length;
  const functionObject = extractNamedLiteral(indexHtml, "V5110_FUNCTION_META", "{");
  const communicativeFunctionCount = functionObject
    ? splitTopLevel(functionObject).filter((row) => /:\s*\{/.test(row)).length
    : 0;

  return {
    appVersion: matchConstString(indexHtml, "APP_VERSION"),
    pinnedVocabularyBlobSha: matchConstString(indexHtml, "PINNED_BLOB_SHA"),
    readings,
    scenarios,
    missions,
    sentenceExercises,
    verifiedUsageRows,
    listeningDerivedFromReadings:
      indexHtml.includes("V560_LISTENING_ITEMS=Object.freeze(V550_READINGS.map"),
    communicativeFunctionCount
  };
}

export function adaptFrenchRepository(
  input: FrenchRepositoryAdapterInput
): LanguageAdapterOutput {
  const issues: MigrationIssue[] = [];
  const inspection = inspectFrenchAppSource(input.indexHtml);
  const expectedFingerprint = inspection.pinnedVocabularyBlobSha;

  if (!inspection.appVersion) {
    issues.push({
      severity: "blocker",
      domain: "source-drift",
      code: "french-app-version-missing",
      message: "Could not locate APP_VERSION in the French single-file application."
    });
  }
  if (!expectedFingerprint) {
    issues.push({
      severity: "blocker",
      domain: "source-drift",
      code: "french-vocabulary-fingerprint-missing",
      message: "Could not locate the pinned French vocabulary blob SHA."
    });
  }

  const cards = resolveFrenchCards(input, expectedFingerprint, issues);
  const vocabularySources = sourceRecordsFromVocabularyPayload(
    input.vocabularyPayload,
    issues
  );

  if (cards.length > 0 && vocabularySources.length === 0) {
    issues.push({
      severity: "blocker",
      domain: "provenance",
      code: "french-vocabulary-source-registry-missing",
      message:
        "French vocabulary records are available, but their external source registry is not. Supply the pinned vocabulary payload alongside the prepared catalog."
    });
  }

  const originalSource: SourceRecord = {
    id: ORIGINAL_SOURCE_ID,
    title: "THIEPN French bundled curriculum content",
    roles: ["pedagogy", "bundled_curriculum"],
    licenseName: "THIEPN-owned original content",
    attribution: "THIEPN",
    policy: {
      canStore: true,
      canTransform: true,
      canRedistributeRaw: true,
      canRedistributeDerived: true,
      canUseCommercially: true,
      requiresAttribution: false,
      requiresShareAlike: false,
      privateOnly: false
    }
  };

  issues.push({
    severity: "info",
    domain: "provenance",
    code: "french-bundled-origin-assumption",
    message:
      "Embedded readings, scenarios, missions and exercises are treated as THIEPN-owned bundled curriculum. P6 preserves this assumption explicitly so it can be editorially verified before migration."
  });

  const vocabularySourceIds = vocabularySources.map((source) => source.id);
  const records: ContentAuditRecord[] = cards.map((card) => {
    const level = normalizeFrameworkLevel(card.level);
    return {
      type: "lexeme",
      id: card.id,
      ...(level ? { level } : {}),
      sourceIds: vocabularySourceIds,
      visibility: "public",
      derivation: "derived"
    };
  });

  const references: ContentReference[] = [];
  appendEmbeddedRecords(records, references, inspection);

  const coverage = mergeCoverage(
    frenchCoverage(cards, inspection),
    input.runtimeCoverage?.coverage ?? {}
  );
  const qualityMetrics = {
    ...frenchQualityMetrics(cards),
    ...(input.runtimeCoverage?.qualityMetrics ?? {})
  };

  const releaseCandidate: LanguagePackReleaseCandidate | undefined =
    records.length > 0 && vocabularySources.length > 0
      ? {
          manifest: frenchLanguagePack,
          learningProfile: frenchLearningProfile,
          proficiencyPolicy: frenchProficiencyPolicy,
          qualityPolicy: frenchQualityPolicy,
          sources: [originalSource, ...vocabularySources],
          records,
          references,
          coverage,
          qualityMetrics
        }
      : undefined;

  if (!input.runtimeCoverage) {
    issues.push({
      severity: "warning",
      domain: "coverage",
      code: "french-runtime-coverage-not-exported",
      message:
        "The repository alone cannot reproduce French level-mapped transfer, speaking and theme coverage because those are derived after runtime card preparation. Supply a runtime coverage snapshot for promotion-readiness parity."
    });
  }

  const inventory: LegacyInventory = {
    appId: "french",
    languageId: "french",
    ...(inspection.appVersion ? { appVersion: inspection.appVersion } : {}),
    ...(input.repositoryRevision
      ? { repositoryRevision: input.repositoryRevision }
      : {}),
    ...(input.catalogSnapshot?.version
      ? { contentVersion: input.catalogSnapshot.version }
      : input.vocabularyPayload?.version !== undefined
        ? { contentVersion: String(input.vocabularyPayload.version) }
        : {}),
    ...(expectedFingerprint ? { fingerprint: expectedFingerprint } : {}),
    contentCounts: {
      vocabularyCards: cards.length,
      verifiedUsageRows: inspection.verifiedUsageRows,
      sentenceExercises: inspection.sentenceExercises.length,
      readings: inspection.readings.length,
      listeningItems: inspection.listeningDerivedFromReadings
        ? inspection.readings.length
        : 0,
      conversationScenarios: inspection.scenarios.length,
      missions: inspection.missions.length,
      communicativeFunctions: inspection.communicativeFunctionCount
    },
    coverage,
    externalDependencies: expectedFingerprint
      ? [
          "kooruhana/sakanaVocab blob " + expectedFingerprint,
          "runtime French catalog preparation/curation"
        ]
      : ["runtime French catalog preparation/curation"],
    learnerStores: [
      "french3000-progress-v2",
      "french3000-review-log-v3",
      "french3000-study-days-v3",
      "french3000-profile-v1",
      "french3000-adaptive-session-composer-v1",
      "french-longitudinal-mastery-v1",
      "french-cefr-progression-v1"
    ],
    notes: [
      "Core vocabulary is pinned externally and then transformed by French-specific curation.",
      "Listening inventory is derived one-to-one from bundled reading texts in v5.18.0.",
      "P27 coverage is partly runtime-derived from prepared cards rather than fully encoded as repository data."
    ]
  };

  return {
    inventory,
    readiness: finalizeMigrationReadiness(issues),
    ...(releaseCandidate ? { releaseCandidate } : {})
  };
}

function resolveFrenchCards(
  input: FrenchRepositoryAdapterInput,
  expectedFingerprint: string | undefined,
  issues: MigrationIssue[]
): readonly FrenchCatalogCard[] {
  if (input.catalogSnapshot) {
    if (
      expectedFingerprint &&
      input.catalogSnapshot.fingerprint !== expectedFingerprint
    ) {
      issues.push({
        severity: "blocker",
        domain: "source-drift",
        code: "french-catalog-fingerprint-mismatch",
        message:
          "Prepared French catalog fingerprint " +
          input.catalogSnapshot.fingerprint +
          " does not match app pin " +
          expectedFingerprint +
          "."
      });
    }
    return input.catalogSnapshot.cards.filter(
      (card) =>
        Boolean(card.id && card.fr && card.en) &&
        normalizeFrameworkLevel(card.level) !== undefined
    );
  }

  const words = input.vocabularyPayload?.words ?? [];
  if (words.length === 0) {
    issues.push({
      severity: "blocker",
      domain: "content",
      code: "french-prepared-catalog-missing",
      message:
        "Neither a French prepared catalog export nor the pinned vocabulary payload was supplied."
    });
    return [];
  }

  issues.push({
    severity: "warning",
    domain: "fidelity",
    code: "french-raw-vocabulary-fallback",
    message:
      "P6 is using the raw pinned vocabulary payload. This preserves inventory but cannot reproduce all French-specific lexical overrides, grammar metadata and core/supplemental filtering. A catalogSnapshot() export is required for exact migration."
  });

  if (
    input.vocabularyPayload?.count !== undefined &&
    input.vocabularyPayload.count !== words.length
  ) {
    issues.push({
      severity: "warning",
      domain: "source-drift",
      code: "french-vocabulary-count-mismatch",
      message:
        "Pinned vocabulary declares " +
        input.vocabularyPayload.count +
        " words but contains " +
        words.length +
        " array entries."
    });
  }

  return words
    .map((word, index): FrenchCatalogCard | undefined => {
      const level = normalizeFrameworkLevel(word.level);
      const fr = String(word.word ?? "").trim();
      const en = String(word.meaning ?? "").trim();
      if (!level || !["A1", "A2", "B1", "B2"].includes(level) || !fr || !en) {
        return undefined;
      }
      return {
        id: String(word.id ?? "fr:" + fr),
        fr,
        en,
        ...(word.ipa ? { ipa: word.ipa } : {}),
        ...(word.pos ? { pos: word.pos } : {}),
        level,
        sourceLevel: level,
        order: Number.isFinite(Number(word.order))
          ? Number(word.order)
          : index + 1,
        core: true,
        exampleFr: String(word.sentences?.[0]?.text ?? ""),
        exampleEn: String(word.sentences?.[0]?.translation ?? "")
      };
    })
    .filter((card): card is FrenchCatalogCard => card !== undefined)
    .slice(0, 3000);
}

function sourceRecordsFromVocabularyPayload(
  payload: FrenchVocabularyPayload | undefined,
  issues: MigrationIssue[]
): readonly SourceRecord[] {
  const sources = payload?.sources ?? [];
  return sources.map((source, index) => {
    const policy = policyForFrenchLicense(source.license);
    if (source.license.toLowerCase().includes("open word lists")) {
      issues.push({
        severity: "warning",
        domain: "licensing",
        code: "french-open-word-list-license-review",
        message:
          'French source "' +
          source.name +
          '" uses the non-specific declaration "' +
          source.license +
          '". Preserve it, but verify the exact upstream terms before a new canonical release.'
      });
    }
    return {
      id:
        "french-vocab-source-" +
        (index + 1) +
        "-" +
        slug(source.name),
      title: source.name,
      roles: [source.usedFor || "vocabulary_source"],
      ...(source.url ? { canonicalUrl: source.url } : {}),
      licenseName: source.license,
      attribution: source.name,
      policy
    };
  });
}

function policyForFrenchLicense(license: string): SourceRecord["policy"] {
  const normalized = license.toLowerCase();
  const nonCommercial = normalized.includes("by-nc");
  const shareAlike =
    normalized.includes("by-sa") ||
    normalized.includes("gfdl") ||
    normalized.includes("sharealike");
  const permissive =
    normalized.includes("mit") ||
    normalized.includes("cc by") ||
    normalized.includes("gfdl") ||
    normalized.includes("open word");

  return {
    canStore: permissive,
    canTransform: permissive,
    canRedistributeRaw: permissive,
    canRedistributeDerived: permissive,
    canUseCommercially: permissive ? !nonCommercial : null,
    requiresAttribution:
      normalized.includes("cc by") || normalized.includes("gfdl"),
    requiresShareAlike: shareAlike,
    privateOnly: !permissive
  };
}

function appendEmbeddedRecords(
  records: ContentAuditRecord[],
  references: ContentReference[],
  inspection: FrenchSourceInspection
): void {
  const sourceIds = [ORIGINAL_SOURCE_ID];

  for (const row of inspection.readings) {
    const level = normalizeFrameworkLevel(row.level);
    records.push({
      type: "reading",
      id: row.id,
      ...(level ? { level } : {}),
      sourceIds,
      visibility: "public",
      derivation: "raw"
    });

    if (inspection.listeningDerivedFromReadings) {
      const listeningId = "listen-" + row.id.replace(/^read-/, "");
      records.push({
        type: "listening",
        id: listeningId,
        ...(level ? { level } : {}),
        sourceIds,
        visibility: "public",
        derivation: "derived"
      });
      references.push({
        fromType: "listening",
        fromId: listeningId,
        field: "readingId",
        toType: "reading",
        toId: row.id
      });
    }
  }

  for (const row of inspection.scenarios) {
    const level = normalizeFrameworkLevel(row.level);
    records.push({
      type: "scenario",
      id: row.id,
      ...(level ? { level } : {}),
      sourceIds,
      visibility: "public",
      derivation: "raw"
    });
  }

  for (const row of inspection.missions) {
    const level = normalizeFrameworkLevel(row.level);
    records.push({
      type: "mission",
      id: row.id,
      ...(level ? { level } : {}),
      sourceIds,
      visibility: "public",
      derivation: "raw"
    });

    for (const scenarioId of row.scenarios ?? []) {
      references.push({
        fromType: "mission",
        fromId: row.id,
        field: "scenarios",
        toType: "scenario",
        toId: scenarioId
      });
    }
  }

  for (const row of inspection.sentenceExercises) {
    records.push({
      type: "sentence-exercise",
      id: row.id,
      sourceIds,
      visibility: "public",
      derivation: "raw"
    });
  }
}

function frenchCoverage(
  cards: readonly FrenchCatalogCard[],
  inspection: FrenchSourceInspection
): Readonly<Record<string, number>> {
  const coverage: Record<string, number> = {};

  for (const level of ["A1", "A2", "B1", "B2"]) {
    coverage["vocabulary:" + level] = cards.filter(
      (card) =>
        card.core !== false &&
        normalizeFrameworkLevel(card.level) === level
    ).length;
    coverage["reading:" + level] = inspection.readings.filter(
      (row) => normalizeFrameworkLevel(row.level) === level
    ).length;
    coverage["listening:" + level] = inspection.listeningDerivedFromReadings
      ? coverage["reading:" + level] ?? 0
      : 0;
    coverage["interaction:" + level] = inspection.scenarios.filter(
      (row) => normalizeFrameworkLevel(row.level) === level
    ).length;
    coverage["missions:" + level] = inspection.missions.filter((row) =>
      expandFrameworkLevels(row.level).includes(level)
    ).length;
    coverage["transfer:" + level] = 0;
    coverage["speaking:" + level] = 0;
  }

  for (const requirement of frenchQualityPolicy.additionalCoverageRequirements) {
    coverage[requirement.key] ??= 0;
  }
  return coverage;
}

function frenchQualityMetrics(
  cards: readonly FrenchCatalogCard[]
): Readonly<Record<string, number>> {
  const core = cards.filter((card) => card.core !== false);
  const denominator = Math.max(1, core.length);
  const nouns = core.filter((card) => /noun/i.test(String(card.pos ?? "")));
  const nounDenominator = Math.max(1, nouns.length);

  return {
    "example-pair-coverage":
      core.filter((card) => card.exampleFr && card.exampleEn).length /
      denominator,
    "ipa-coverage":
      core.filter((card) => card.ipa).length / denominator,
    "noun-article-coverage":
      nouns.filter((card) => card.article).length / nounDenominator,
    "noun-gender-coverage":
      nouns.filter((card) => card.gender).length / nounDenominator
  };
}

export function adaptFrenchReviewLog(
  entries: readonly FrenchLegacyReviewEntry[],
  accountId: string,
  deviceId: string
): EventMigrationResult {
  const issues: MigrationIssue[] = [];
  const events: StudyEvent[] = [];
  let dropped = 0;

  for (const [index, entry] of entries.entries()) {
    const occurredAt = isoFromLegacyTimestamp(entry.t);
    const targetId = String(entry.noteId ?? entry.id ?? "").trim();
    if (!occurredAt || !targetId || !entry.rating) {
      dropped++;
      continue;
    }

    const modality = String(entry.mixedModality ?? "").trim();
    const result: StudyResult =
      entry.correct === false || entry.rating === "again"
        ? "incorrect"
        : entry.typedQuality === "review"
          ? "partial"
          : "correct";
    const practiceOnly =
      entry.remediationPractice === true ||
      (entry.mixedReview === true && entry.mixedLane !== "overdue");

    events.push({
      id: legacyEventId("french-review", entry.t, targetId, index),
      accountId,
      deviceId,
      languageId: "french",
      occurredAt,
      activity:
        modality === "listening" || entry.practice === "listening"
          ? "listening"
          : "review",
      primaryTarget: {
        languageId: "french",
        kind: "lexeme",
        id: targetId
      },
      skillDimension: frenchDimension(entry),
      promptFamily:
        entry.mixedKind ||
        entry.practice ||
        entry.direction ||
        "legacy-review",
      responseMode: entry.typed ? "typed" : "legacy-review",
      result,
      supportLevel: supportLevelFromLegacyCode(entry.mixedSupportLevel),
      ...(Number.isFinite(Number(entry.responseMs))
        ? { responseTimeMs: Math.max(0, Number(entry.responseMs)) }
        : {}),
      ...(!practiceOnly
        ? {
            memoryReview: {
              cueFamily:
                entry.mixedKind ||
                entry.direction ||
                entry.practice ||
                "french-legacy-review",
              grade: entry.rating
            }
          }
        : {}),
      metadata: {
        legacySource: "french3000-review-log-v3",
        mixedReview: entry.mixedReview === true,
        mixedLane: entry.mixedLane ?? "",
        mixedFirstAttempt: entry.mixedFirstAttempt !== false,
        mixedRecoveryStep: entry.mixedRecoveryStep ?? "",
        remediationPractice: entry.remediationPractice === true,
        remediationCause: entry.remediationCause ?? "",
        remediationStage: entry.remediationStage ?? "",
        sentenceDiagnosis: entry.sentenceDiagnosis ?? "",
        transferDiagnosis: entry.transferDiagnosis ?? "",
        legacyLevel: entry.level ?? ""
      }
    });
  }

  if (dropped > 0) {
    issues.push({
      severity: "warning",
      domain: "learner-data",
      code: "french-review-entries-dropped",
      message:
        dropped +
        " legacy French review entries lacked a valid timestamp, target or rating and were not migrated."
    });
  }

  issues.push({
    severity: "info",
    domain: "memory",
    code: "french-practice-srs-separation",
    message:
      "P6 only emits memoryReview for ordinary/scheduled review evidence. Mixed supplemental and remediation practice remains mastery evidence without silently modifying the shared SRS."
  });

  return {
    events,
    dropped,
    readiness: finalizeMigrationReadiness(issues)
  };
}

function frenchDimension(entry: FrenchLegacyReviewEntry): string {
  const modality = String(entry.mixedModality ?? "").toLowerCase();
  if (modality === "listening" || entry.practice === "listening")
    return "listening";
  if (modality === "sentence" || modality === "transfer")
    return "grammar_production";
  if (modality === "phrase" || modality === "recall")
    return "form_recall";
  if (modality === "recognition") return "meaning_recognition";
  if (entry.practice === "cloze") return "grammar_recognition";
  if (entry.direction === "en-fr")
    return entry.typed ? "form_recall" : "meaning_recall";
  return "meaning_recognition";
}

function extractObjectRows(
  source: string,
  name: string
): readonly EmbeddedRow[] {
  return extractArrayElements(source, name)
    .map((row) => {
      const id = quotedField(row, "id");
      if (!id) return undefined;
      const level = quotedField(row, "level");
      const title = quotedField(row, "title");
      const topic = quotedField(row, "topic");
      const sourceLabel = quotedField(row, "sourceLabel");
      const license = quotedField(row, "license");
      const scenarios = stringArrayField(row, "scenarios");
      return {
        id,
        ...(level ? { level } : {}),
        ...(title ? { title } : {}),
        ...(topic ? { topic } : {}),
        ...(sourceLabel ? { sourceLabel } : {}),
        ...(license ? { license } : {}),
        ...(scenarios.length ? { scenarios } : {})
      };
    })
    .filter((row): row is EmbeddedRow => row !== undefined);
}

function extractArrayElements(
  source: string,
  name: string
): readonly string[] {
  const literal = extractNamedLiteral(source, name, "[");
  return literal ? splitTopLevel(literal) : [];
}

function extractNamedLiteral(
  source: string,
  name: string,
  openChar: "[" | "{"
): string | undefined {
  const declaration = source.indexOf("const " + name);
  if (declaration < 0) return undefined;
  const open = source.indexOf(openChar, declaration);
  if (open < 0) return undefined;
  const closeChar = openChar === "[" ? "]" : "}";

  let depth = 0;
  let quote: string | undefined;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (let index = open; index < source.length; index++) {
    const character = source[index]!;
    const next = source[index + 1];

    if (lineComment) {
      if (character === "\n") lineComment = false;
      continue;
    }
    if (blockComment) {
      if (character === "*" && next === "/") {
        blockComment = false;
        index++;
      }
      continue;
    }
    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (character === "\\") {
        escaped = true;
        continue;
      }
      if (character === quote) quote = undefined;
      continue;
    }
    if (character === "/" && next === "/") {
      lineComment = true;
      index++;
      continue;
    }
    if (character === "/" && next === "*") {
      blockComment = true;
      index++;
      continue;
    }
    if (character === "'" || character === '"' || character === "\x60") {
      quote = character;
      continue;
    }

    if (character === openChar) depth++;
    if (character === closeChar) {
      depth--;
      if (depth === 0) return source.slice(open, index + 1);
    }
  }
  return undefined;
}

function splitTopLevel(literal: string): readonly string[] {
  const body = literal.slice(1, -1);
  const result: string[] = [];
  let start = 0;
  let depth = 0;
  let quote: string | undefined;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (let index = 0; index < body.length; index++) {
    const character = body[index]!;
    const next = body[index + 1];

    if (lineComment) {
      if (character === "\n") lineComment = false;
      continue;
    }
    if (blockComment) {
      if (character === "*" && next === "/") {
        blockComment = false;
        index++;
      }
      continue;
    }
    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (character === "\\") {
        escaped = true;
        continue;
      }
      if (character === quote) quote = undefined;
      continue;
    }
    if (character === "/" && next === "/") {
      lineComment = true;
      index++;
      continue;
    }
    if (character === "/" && next === "*") {
      blockComment = true;
      index++;
      continue;
    }
    if (character === "'" || character === '"' || character === "\x60") {
      quote = character;
      continue;
    }

    if ("([{".includes(character)) depth++;
    else if (")]}".includes(character)) depth--;
    else if (character === "," && depth === 0) {
      const part = body.slice(start, index).trim();
      if (part) result.push(part);
      start = index + 1;
    }
  }

  const tail = body.slice(start).trim();
  if (tail) result.push(tail);
  return result;
}

function quotedField(source: string, key: string): string | undefined {
  const escapedKey = key.replace(/[.*+?^$()|[\]\\{}]/g, "\\$&");
  const match = source.match(
    new RegExp("\\b" + escapedKey + "\\s*:\\s*(['\"])(.*?)\\1", "s")
  );
  return match?.[2];
}

function stringArrayField(
  source: string,
  key: string
): readonly string[] {
  const escapedKey = key.replace(/[.*+?^$()|[\]\\{}]/g, "\\$&");
  const match = source.match(
    new RegExp("\\b" + escapedKey + "\\s*:\\s*\\[([^\\]]*)\\]", "s")
  );
  if (!match?.[1]) return [];
  return [...match[1].matchAll(/(['"])(.*?)\1/g)].map(
    (item) => item[2]!
  );
}

function matchConstString(
  source: string,
  name: string
): string | undefined {
  const escapedName = name.replace(/[.*+?^$()|[\]\\{}]/g, "\\$&");
  const match = source.match(
    new RegExp("\\bconst\\s+" + escapedName + "\\s*=\\s*(['\"])(.*?)\\1")
  );
  return match?.[2];
}

function slug(value: string): string {
  return (
    value
      .normalize("NFKD")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "source"
  );
}
