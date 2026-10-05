import type {
  ContentAuditRecord,
  ContentReference,
  LanguagePackReleaseCandidate
} from "../../packages/content-validation/src/index.js";
import type { SourceRecord } from "../../packages/content-schema/src/index.js";
import {
  finalizeMigrationReadiness,
  normalizeFrameworkLevel,
  type LanguageAdapterOutput,
  type LegacyInventory,
  type MigrationIssue
} from "../../packages/adapter-sdk/src/index.js";
import { japaneseLanguagePack } from "./manifest.js";
import { japaneseLearningProfile } from "./learning.js";
import { japaneseProficiencyPolicy } from "./proficiency.js";
import { japaneseQualityPolicy } from "./quality.js";
import type {
  JapaneseLegacySource,
  JapaneseRepositoryAdapterInput,
  JapaneseSeedPackage
} from "./adapter-types.js";

export function assembleJapaneseRuntimeContent(
  input: JapaneseRepositoryAdapterInput
): JapaneseSeedPackage {
  const base = input.baseSeed;
  const lexicon = input.c1Lexicon;
  const language = input.c1Language;
  const course = input.c1Course;

  const version =
    input.assembledVersion ??
    course?.version ??
    language?.version ??
    lexicon?.version ??
    base.version;

  return {
    schemaVersion: Math.max(
      base.schemaVersion ?? 0,
      lexicon?.schemaVersion ?? 0,
      language?.schemaVersion ?? 0,
      course?.schemaVersion ?? 0
    ),
    ...(version ? { version } : {}),
    sourceIds: unique([
      ...(base.sourceIds ?? []),
      ...(lexicon?.sourceIds ?? []),
      ...(language?.sourceIds ?? []),
      ...(course?.sourceIds ?? [])
    ]),
    lexemes: [...(base.lexemes ?? []), ...(lexicon?.lexemes ?? [])],
    senses: [...(base.senses ?? []), ...(lexicon?.senses ?? [])],
    kanji: [...(base.kanji ?? [])],
    grammar: [...(base.grammar ?? []), ...(language?.grammar ?? [])],
    sentences: [...(base.sentences ?? []), ...(language?.sentences ?? [])],
    audioAssets: [...(base.audioAssets ?? [])],
    canDos: [...(base.canDos ?? []), ...(course?.canDos ?? [])],
    courseUnits: [...(base.courseUnits ?? []), ...(course?.courseUnits ?? [])],
    readingTexts: [...(base.readingTexts ?? []), ...(course?.readingTexts ?? [])],
    productiveTasks: [
      ...(base.productiveTasks ?? []),
      ...(course?.productiveTasks ?? [])
    ],
    lexicalChunks: [
      ...(base.lexicalChunks ?? []),
      ...(language?.lexicalChunks ?? [])
    ]
  };
}

export function adaptJapaneseRepository(
  input: JapaneseRepositoryAdapterInput
): LanguageAdapterOutput {
  const issues: MigrationIssue[] = [];
  const missingSupplements = [
    !input.c1Lexicon ? "jp-c1-lexicon.json" : "",
    !input.c1Language ? "jp-c1-language.json" : "",
    !input.c1Course ? "jp-c1-course.json" : ""
  ].filter(Boolean);

  if (missingSupplements.length) {
    issues.push({
      severity: "blocker",
      domain: "content",
      code: "japanese-runtime-supplements-missing",
      message:
        "Current Japanese runtime assembly requires all C1 supplements. Missing: " +
        missingSupplements.join(", ")
    });
  }

  const seed = assembleJapaneseRuntimeContent(input);
  const sources = input.sourceRegistry.sources.map((source) =>
    mapJapaneseSource(source, issues)
  );
  const knownSources = new Set(sources.map((source) => source.id));

  for (const sourceId of seed.sourceIds ?? []) {
    if (!knownSources.has(sourceId)) {
      issues.push({
        severity: "blocker",
        domain: "provenance",
        code: "japanese-package-source-missing",
        message: "Assembled Japanese package declares unknown source " + sourceId + "."
      });
    }
  }

  const records: ContentAuditRecord[] = [];
  const references: ContentReference[] = [];
  appendJapaneseRecords(seed, records, references, issues, knownSources);

  const coverage = japaneseCoverage(seed);
  const qualityMetrics = japaneseQualityMetrics(seed);

  const releaseCandidate: LanguagePackReleaseCandidate = {
    manifest: japaneseLanguagePack,
    learningProfile: japaneseLearningProfile,
    proficiencyPolicy: japaneseProficiencyPolicy,
    qualityPolicy: japaneseQualityPolicy,
    sources,
    records,
    references,
    coverage,
    qualityMetrics
  };

  const baseReadings = input.baseSeed.readingTexts ?? [];
  if (
    baseReadings.length > 0 &&
    baseReadings.every((reading) => reading.audioMode === "speech_synthesis")
  ) {
    issues.push({
      severity: "warning",
      domain: "coverage",
      code: "japanese-reading-audio-synthetic",
      message:
        "Current base Japanese connected-reading/listening inventory uses speech synthesis. Native pronunciation assets remain separate."
    });
  }

  if (
    ["speaking:A1", "speaking:A2", "interaction:A1", "interaction:A2"].some(
      (key) => (coverage[key] ?? 0) === 0
    )
  ) {
    issues.push({
      severity: "warning",
      domain: "fidelity",
      code: "japanese-generated-prompt-coverage-not-materialized",
      message:
        "Japanese TypeScript generates additional productive and assessment prompts. The canonical seed does not materialize every prompt, so P6 does not invent release coverage."
    });
  }

  const inventory: LegacyInventory = {
    appId: "japanese",
    languageId: "japanese",
    ...(input.repositoryRevision
      ? { repositoryRevision: input.repositoryRevision }
      : {}),
    ...(seed.version ? { contentVersion: seed.version } : {}),
    contentCounts: {
      lexemes: seed.lexemes?.length ?? 0,
      senses: seed.senses?.length ?? 0,
      kanji: seed.kanji?.length ?? 0,
      grammar: seed.grammar?.length ?? 0,
      sentences: seed.sentences?.length ?? 0,
      audioAssets: seed.audioAssets?.length ?? 0,
      canDos: seed.canDos?.length ?? 0,
      courseUnits: seed.courseUnits?.length ?? 0,
      readingTexts: seed.readingTexts?.length ?? 0,
      productiveTasks: seed.productiveTasks?.length ?? 0,
      lexicalChunks: seed.lexicalChunks?.length ?? 0
    },
    coverage,
    externalDependencies: [
      "content/seed/jp-core.json",
      "content/seed/jp-c1-lexicon.json",
      "content/seed/jp-c1-language.json",
      "content/seed/jp-c1-course.json",
      "content/sources/registry.json"
    ],
    learnerStores: [
      "study_events",
      "memory_traces",
      "sync_outbox",
      "sync_meta",
      "private_documents",
      "private_vocabulary",
      "private_sentences",
      "private_media_reviews"
    ],
    notes: [
      "Runtime canonical content is base seed plus three C1 supplements.",
      "StudyEvents and FSRS traces are close to Language Core and migrate separately.",
      "Private learner content is excluded from the public release candidate."
    ]
  };

  return {
    inventory,
    readiness: finalizeMigrationReadiness(issues),
    releaseCandidate
  };
}

function mapJapaneseSource(
  source: JapaneseLegacySource,
  issues: MigrationIssue[]
): SourceRecord {
  const licenseName = source.licenseName ?? source.license ?? "";
  const normalized = licenseName.toLowerCase();
  const owned = normalized.includes("thiepn-owned");
  const ccBy = normalized.includes("cc by");
  const shareAlike = normalized.includes("by-sa");
  const apache = normalized.includes("apache");
  const mixedPerItem = source.id === "tatoeba";
  const reusable =
    source.publicExport === true && (owned || ccBy || apache) && !mixedPerItem;

  if (mixedPerItem) {
    issues.push({
      severity: "warning",
      domain: "licensing",
      code: "japanese-tatoeba-per-item-rights",
      message:
        "Tatoeba rights vary by item/audio. P6 keeps the registry source non-redistributable unless item-level rights are verified."
    });
  }

  return {
    id: source.id,
    title: source.title,
    roles: [...(source.roles ?? source.role ?? [])],
    ...(source.version ? { version: source.version } : {}),
    ...(licenseName ? { licenseName } : {}),
    ...(source.canonicalUrl ? { canonicalUrl: source.canonicalUrl } : {}),
    ...(source.attribution ? { attribution: source.attribution } : {}),
    policy: {
      canStore: reusable || source.publicExport === true,
      canTransform: reusable,
      canRedistributeRaw: reusable,
      canRedistributeDerived: reusable,
      canUseCommercially: reusable ? true : null,
      requiresAttribution: ccBy,
      requiresShareAlike: shareAlike,
      privateOnly: !reusable
    }
  };
}

function appendJapaneseRecords(
  seed: JapaneseSeedPackage,
  records: ContentAuditRecord[],
  references: ContentReference[],
  issues: MigrationIssue[],
  knownSources: ReadonlySet<string>
): void {
  const pushRecord = (
    type: string,
    row: {
      readonly id: string;
      readonly level?: string;
      readonly sourceIds?: readonly string[];
    },
    derivation: "raw" | "derived" = "raw"
  ) => {
    const level = normalizeFrameworkLevel(row.level);
    const sourceIds = [...(row.sourceIds ?? [])];

    for (const sourceId of sourceIds) {
      if (!knownSources.has(sourceId)) {
        issues.push({
          severity: "blocker",
          domain: "provenance",
          code: "japanese-record-source-missing",
          message: type + ":" + row.id + " references unknown source " + sourceId + "."
        });
      }
    }

    records.push({
      type,
      id: row.id,
      ...(level ? { level } : {}),
      sourceIds,
      visibility: "public",
      derivation
    });
  };

  for (const row of seed.lexemes ?? []) pushRecord("lexeme", row);
  for (const row of seed.senses ?? []) pushRecord("sense", row);
  for (const row of seed.kanji ?? []) pushRecord("kanji", row);
  for (const row of seed.grammar ?? []) pushRecord("grammar", row);
  for (const row of seed.sentences ?? []) pushRecord("sentence", row);
  for (const row of seed.audioAssets ?? []) pushRecord("audio", row);
  for (const row of seed.canDos ?? []) pushRecord("can-do", row);
  for (const row of seed.courseUnits ?? []) pushRecord("curriculum-unit", row);
  for (const row of seed.readingTexts ?? []) pushRecord("reading", row);
  for (const row of seed.productiveTasks ?? []) pushRecord("production-task", row);
  for (const row of seed.lexicalChunks ?? []) pushRecord("lexical-chunk", row);

  const ref = (
    fromType: string, fromId: string, field: string,
    toType: string, toId: string, required = true
  ) => {
    if (!toId) return;
    references.push({
      fromType, fromId, field, toType, toId,
      ...(required ? {} : { required: false })
    });
  };

  for (const row of seed.lexemes ?? []) {
    for (const id of row.senseIds ?? []) ref("lexeme", row.id, "senseIds", "sense", id);
    for (const link of row.kanjiLinks ?? []) ref("lexeme", row.id, "kanjiLinks", "kanji", link.kanjiId);
    for (const id of row.audioIds ?? []) ref("lexeme", row.id, "audioIds", "audio", id);
  }
  for (const row of seed.senses ?? []) ref("sense", row.id, "lexemeId", "lexeme", row.lexemeId);
  for (const row of seed.grammar ?? []) {
    for (const id of row.prerequisiteIds ?? []) ref("grammar", row.id, "prerequisiteIds", "grammar", id);
    for (const id of row.contrastIds ?? []) ref("grammar", row.id, "contrastIds", "grammar", id);
  }
  for (const row of seed.sentences ?? []) {
    for (const id of row.grammarIds ?? []) ref("sentence", row.id, "grammarIds", "grammar", id);
    for (const entity of row.entityRefs ?? []) {
      const type = recordTypeForEntityKind(entity.kind);
      if (type) ref("sentence", row.id, "entityRefs", type, entity.id, false);
    }
  }
  for (const row of seed.lexicalChunks ?? []) {
    for (const id of row.lexemeIds ?? []) ref("lexical-chunk", row.id, "lexemeIds", "lexeme", id);
    for (const id of row.grammarIds ?? []) ref("lexical-chunk", row.id, "grammarIds", "grammar", id);
    for (const id of row.exampleSentenceIds ?? []) ref("lexical-chunk", row.id, "exampleSentenceIds", "sentence", id);
  }
  for (const row of seed.canDos ?? []) {
    for (const id of row.grammarIds ?? []) ref("can-do", row.id, "grammarIds", "grammar", id);
    for (const id of row.sentenceIds ?? []) ref("can-do", row.id, "sentenceIds", "sentence", id);
    for (const id of row.prerequisiteIds ?? []) ref("can-do", row.id, "prerequisiteIds", "can-do", id);
  }
  for (const row of seed.courseUnits ?? []) {
    if (row.canDoId) ref("curriculum-unit", row.id, "canDoId", "can-do", row.canDoId);
    for (const id of row.prerequisiteUnitIds ?? []) ref("curriculum-unit", row.id, "prerequisiteUnitIds", "curriculum-unit", id);
    for (const id of row.grammarIds ?? []) ref("curriculum-unit", row.id, "grammarIds", "grammar", id);
    for (const id of row.sentenceIds ?? []) ref("curriculum-unit", row.id, "sentenceIds", "sentence", id);
    for (const id of row.vocabularyIds ?? []) ref("curriculum-unit", row.id, "vocabularyIds", "lexeme", id);
    for (const id of row.conjugationLexemeIds ?? []) ref("curriculum-unit", row.id, "conjugationLexemeIds", "lexeme", id);
  }
  for (const row of seed.readingTexts ?? []) {
    for (const id of row.sentenceIds ?? []) ref("reading", row.id, "sentenceIds", "sentence", id);
    for (const id of row.targetLexemeIds ?? []) ref("reading", row.id, "targetLexemeIds", "lexeme", id);
    for (const id of row.grammarIds ?? []) ref("reading", row.id, "grammarIds", "grammar", id);
    if (row.audioAssetId) ref("reading", row.id, "audioAssetId", "audio", row.audioAssetId);
  }
  for (const row of seed.productiveTasks ?? []) {
    for (const id of row.targetGrammarIds ?? []) ref("production-task", row.id, "targetGrammarIds", "grammar", id);
    for (const id of row.targetLexemeIds ?? []) ref("production-task", row.id, "targetLexemeIds", "lexeme", id);
    for (const id of row.targetChunkIds ?? []) ref("production-task", row.id, "targetChunkIds", "lexical-chunk", id);
  }
}

function recordTypeForEntityKind(kind: string): string | undefined {
  const map: Readonly<Record<string, string>> = {
    lexeme: "lexeme", sense: "sense", kanji: "kanji", grammar: "grammar",
    sentence: "sentence", lexical_chunk: "lexical-chunk", can_do: "can-do",
    production_task: "production-task"
  };
  return map[kind];
}

function japaneseCoverage(seed: JapaneseSeedPackage): Readonly<Record<string, number>> {
  const coverage: Record<string, number> = {};
  const lexemeById = new Map((seed.lexemes ?? []).map((row) => [row.id, row] as const));
  const audioById = new Map((seed.audioAssets ?? []).map((row) => [row.id, row] as const));

  for (const level of ["A1", "A2", "B1", "B2"]) {
    const units = (seed.courseUnits ?? []).filter(
      (row) => normalizeFrameworkLevel(row.level) === level
    );
    const vocabularyIds = unique(units.flatMap((row) => row.vocabularyIds ?? []));
    const scriptIds = unique(vocabularyIds.flatMap((id) =>
      (lexemeById.get(id)?.kanjiLinks ?? []).map((link) => link.kanjiId)
    ));
    const readings = (seed.readingTexts ?? []).filter(
      (row) => normalizeFrameworkLevel(row.level) === level
    );
    const tasks = (seed.productiveTasks ?? []).filter(
      (row) => normalizeFrameworkLevel(row.level) === level
    );
    const canDos = (seed.canDos ?? []).filter(
      (row) => normalizeFrameworkLevel(row.level) === level
    );
    const audioIds = unique(vocabularyIds.flatMap(
      (id) => lexemeById.get(id)?.audioIds ?? []
    ));

    coverage["vocabulary:" + level] = vocabularyIds.length;
    coverage["script:" + level] = scriptIds.length;
    coverage["reading:" + level] = readings.length;
    coverage["listening:" + level] = readings.filter(
      (row) => row.audioMode !== "none"
    ).length;
    coverage["speaking:" + level] = tasks.filter((row) => row.mode === "speaking").length;
    coverage["interaction:" + level] = canDos.filter(
      (row) => row.languageActivity === "spoken_interaction"
    ).length;
    coverage["writing:" + level] = tasks.filter((row) => row.mode === "writing").length;
    coverage["can-do:" + level] = canDos.length;
    coverage["native-audio:" + level] = audioIds.filter(
      (id) => audioById.get(id)?.nativeSpeaker === true
    ).length;
  }
  return coverage;
}

function japaneseQualityMetrics(seed: JapaneseSeedPackage): Readonly<Record<string, number>> {
  const audio = seed.audioAssets ?? [];
  if (!audio.length) return { "native-audio-metadata-coverage": 0 };
  const complete = audio.filter((asset) =>
    asset.nativeSpeaker === true &&
    Boolean(asset.credit?.trim()) &&
    Boolean(asset.licenseName?.trim()) &&
    (asset.sourceIds?.length ?? 0) > 0
  ).length;
  return { "native-audio-metadata-coverage": complete / audio.length };
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}
