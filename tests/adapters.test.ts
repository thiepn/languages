import { describe, expect, it } from "vitest";
import { certifyLanguagePack } from "../packages/content-validation/src/index.js";
import type { SourceRecord } from "../packages/content-schema/src/index.js";
import {
  adaptFrenchRepository,
  adaptFrenchReviewLog,
  inspectFrenchAppSource
} from "../languages/french/adapter.js";
import { japaneseLanguagePack } from "../languages/japanese/manifest.js";
import { japaneseLearningProfile } from "../languages/japanese/learning.js";
import { japaneseProficiencyPolicy } from "../languages/japanese/proficiency.js";
import { japaneseQualityPolicy } from "../languages/japanese/quality.js";
import {
  adaptJapaneseRepository,
  assembleJapaneseRuntimeContent
} from "../languages/japanese/adapter-content.js";
import {
  adaptJapaneseMemoryTraces,
  adaptJapaneseStudyEvents
} from "../languages/japanese/adapter-learner.js";

const frenchFixture = [
  "const APP_VERSION='5.18.0';",
  "const PINNED_BLOB_SHA='abc123';",
  "const V510_CORPUS_ROWS=Object.freeze([['a'],['b']]);",
  "const V530_SENTENCE_EXERCISES=Object.freeze([{id:'p12-1'}]);",
  "const V550_READINGS=Object.freeze([",
  "{id:'read-a1-one',level:'A1',title:'One',topic:'home'},",
  "{id:'read-b1-one',level:'B1',title:'Two',topic:'work-study'}",
  "]);",
  "const V560_LISTENING_ITEMS=Object.freeze(V550_READINGS.map(function(reading){return reading;}));",
  "const V580_SCENARIOS=Object.freeze([{id:'scenario-a1',level:'A1'}]);",
  "const V590_MISSIONS=Object.freeze([{id:'mission-a1',level:'A1',scenarios:['scenario-a1']}]);",
  "const V5110_FUNCTION_META=Object.freeze({request:{label:'Request'},confirm:{label:'Confirm'}});"
].join("\n");

describe("P6 existing-app adapter SDK", () => {
  it("statically inventories the current French single-file shape without eval", () => {
    const inspection = inspectFrenchAppSource(frenchFixture);

    expect(inspection.appVersion).toBe("5.18.0");
    expect(inspection.pinnedVocabularyBlobSha).toBe("abc123");
    expect(inspection.verifiedUsageRows).toBe(2);
    expect(inspection.readings).toHaveLength(2);
    expect(inspection.scenarios).toHaveLength(1);
    expect(inspection.missions).toHaveLength(1);
    expect(inspection.listeningDerivedFromReadings).toBe(true);
    expect(inspection.communicativeFunctionCount).toBe(2);
  });

  it("marks raw French vocabulary as a lossy fallback rather than claiming exact migration", () => {
    const result = adaptFrenchRepository({
      indexHtml: frenchFixture,
      vocabularyPayload: {
        version: 8,
        count: 2,
        sources: [
          {
            name: "Fixture vocabulary",
            license: "MIT",
            usedFor: "test"
          }
        ],
        words: [
          {
            id: "fr:bonjour",
            word: "bonjour",
            meaning: "hello",
            level: "starter",
            ipa: "/test/",
            pos: "interj",
            sentences: [{ text: "Bonjour.", translation: "Hello." }]
          },
          {
            id: "fr:maison",
            word: "maison",
            meaning: "house",
            level: "A1",
            pos: "noun"
          }
        ]
      }
    });

    expect(result.inventory.contentCounts.vocabularyCards).toBe(2);
    expect(result.releaseCandidate).toBeDefined();
    expect(
      result.readiness.issues.some(
        (issue) => issue.code === "french-raw-vocabulary-fallback"
      )
    ).toBe(true);
    expect(result.readiness.status).toBe("needs_review");
  });

  it("keeps French supplemental/remediation practice out of shared SRS transitions", () => {
    const migrated = adaptFrenchReviewLog(
      [
        {
          t: 1_760_000_000_000,
          id: "fr:bonjour",
          rating: "good",
          correct: true,
          practice: "classic"
        },
        {
          t: 1_760_000_100_000,
          id: "fr:bonjour",
          rating: "good",
          correct: true,
          mixedReview: true,
          mixedLane: "repair",
          mixedModality: "recall",
          mixedSupportLevel: 2,
          remediationPractice: true
        }
      ],
      "user-1",
      "device-1"
    );

    expect(migrated.events).toHaveLength(2);
    expect(migrated.events[0]?.memoryReview?.grade).toBe("good");
    expect(migrated.events[1]?.memoryReview).toBeUndefined();
    expect(migrated.events[1]?.supportLevel).toBe("hinted");
  });

  it("assembles Japanese base plus all three current C1 supplements", () => {
    const assembled = assembleJapaneseRuntimeContent({
      baseSeed: {
        schemaVersion: 10,
        version: "0.9.0",
        sourceIds: ["thiepn-original"],
        lexemes: [{ id: "lex-base", sourceIds: ["thiepn-original"] }],
        senses: [{ id: "sense-base", lexemeId: "lex-base", sourceIds: ["thiepn-original"] }],
        grammar: [{ id: "grammar-base", level: "A1", sourceIds: ["thiepn-original"] }]
      },
      c1Lexicon: {
        schemaVersion: 1,
        version: "0.10.0",
        sourceIds: ["thiepn-original"],
        lexemes: [{ id: "lex-c1", sourceIds: ["thiepn-original"] }],
        senses: [{ id: "sense-c1", lexemeId: "lex-c1", sourceIds: ["thiepn-original"] }]
      },
      c1Language: {
        schemaVersion: 1,
        version: "0.10.0",
        sourceIds: ["thiepn-original"],
        grammar: [{ id: "grammar-c1", level: "C1", sourceIds: ["thiepn-original"] }]
      },
      c1Course: {
        schemaVersion: 1,
        version: "0.10.0",
        sourceIds: ["thiepn-original"],
        readingTexts: [{ id: "read-c1", level: "C1", sourceIds: ["thiepn-original"] }]
      },
      sourceRegistry: { sources: [] }
    });

    expect(assembled.version).toBe("0.10.0");
    expect(assembled.lexemes?.map((row) => row.id)).toEqual([
      "lex-base",
      "lex-c1"
    ]);
    expect(assembled.grammar?.map((row) => row.id)).toEqual([
      "grammar-base",
      "grammar-c1"
    ]);
    expect(assembled.readingTexts?.[0]?.level).toBe("C1");
  });

  it("builds a Japanese migration inventory without silently publishing private learner stores", () => {
    const result = adaptJapaneseRepository({
      baseSeed: {
        schemaVersion: 10,
        version: "0.9.0",
        sourceIds: ["thiepn-original"],
        lexemes: [
          {
            id: "lex-a",
            senseIds: ["sense-a"],
            sourceIds: ["thiepn-original"]
          }
        ],
        senses: [
          {
            id: "sense-a",
            lexemeId: "lex-a",
            sourceIds: ["thiepn-original"]
          }
        ]
      },
      c1Lexicon: { sourceIds: ["thiepn-original"] },
      c1Language: { sourceIds: ["thiepn-original"] },
      c1Course: { sourceIds: ["thiepn-original"] },
      sourceRegistry: {
        sources: [
          {
            id: "thiepn-original",
            title: "THIEPN Japanese Original Content",
            role: ["seed_content"],
            publicExport: true,
            license: "THIEPN-owned original content"
          }
        ]
      }
    });

    expect(result.readiness.blockers).toBe(0);
    expect(result.inventory.contentCounts.lexemes).toBe(1);
    expect(result.inventory.learnerStores).toContain("private_documents");
    expect(
      result.releaseCandidate?.records.some(
        (record) => record.type === "document"
      )
    ).toBe(false);
  });

  it("maps Japanese StudyEvents while keeping memory scheduling separate", () => {
    const migrated = adaptJapaneseStudyEvents([
      {
        id: "event-1",
        userId: "user-1",
        deviceId: "device-1",
        occurredAt: "2026-10-05T10:00:00.000Z",
        activity: "review",
        primaryTarget: { kind: "lexeme", id: "lex-a" },
        skillDimension: "meaning_recognition",
        result: "correct",
        hintsUsed: 1,
        metadata: { promptId: "prompt-1" }
      }
    ]);

    expect(migrated.events[0]?.accountId).toBe("user-1");
    expect(migrated.events[0]?.primaryTarget?.languageId).toBe("japanese");
    expect(migrated.events[0]?.supportLevel).toBe("hinted");
    expect(migrated.events[0]?.memoryReview).toBeUndefined();
  });

  it("maps persisted Japanese FSRS traces without replay reconstruction", () => {
    const migrated = adaptJapaneseMemoryTraces([
      {
        id: "legacy-trace",
        userId: "user-1",
        entity: { kind: "lexeme", id: "lex-a" },
        skillDimension: "meaning_recognition",
        cueFamily: "meaning",
        schedulerFamily: "fsrs",
        schedulerVersion: "ts-fsrs-5.4.2",
        revision: 7,
        card: {
          due: "2026-10-10T10:00:00.000Z",
          stability: 8,
          difficulty: 5,
          elapsedDays: 4,
          scheduledDays: 5,
          learningSteps: 0,
          reps: 6,
          lapses: 1,
          state: 2,
          lastReviewAt: "2026-10-05T10:00:00.000Z"
        }
      }
    ]);

    expect(migrated.traces).toHaveLength(1);
    expect(migrated.traces[0]?.languageId).toBe("japanese");
    expect(migrated.traces[0]?.revision).toBe(7);
    expect(migrated.traces[0]?.data.stability).toBe(8);
    expect(migrated.readiness.blockers).toBe(0);
  });

  it("allows valid C1 canonical content even when promotion gates currently stop at B2", () => {
    const source: SourceRecord = {
      id: "owned",
      title: "Owned",
      roles: ["test"],
      licenseName: "THIEPN-owned original content",
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

    const certification = certifyLanguagePack({
      manifest: japaneseLanguagePack,
      learningProfile: japaneseLearningProfile,
      proficiencyPolicy: japaneseProficiencyPolicy,
      qualityPolicy: japaneseQualityPolicy,
      sources: [source],
      records: [
        {
          type: "grammar",
          id: "grammar-c1",
          level: "C1",
          sourceIds: ["owned"],
          visibility: "public",
          derivation: "raw"
        }
      ],
      references: [],
      coverage: {},
      qualityMetrics: {
        "native-audio-metadata-coverage": 1
      }
    });

    expect(certification.publicReleaseReady).toBe(true);
    expect(
      certification.issues.some((issue) => issue.code === "invalid-level")
    ).toBe(false);
  });
});
