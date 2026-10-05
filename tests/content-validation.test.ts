import { describe, expect, it } from "vitest";
import {
  certifyLanguagePack,
  promotionCoverageRequirements,
  type LanguagePackReleaseCandidate
} from "../packages/content-validation/src/index.js";
import type { SourceRecord } from "../packages/content-schema/src/index.js";
import { frenchLanguagePack } from "../languages/french/manifest.js";
import { frenchLearningProfile } from "../languages/french/learning.js";
import { frenchProficiencyPolicy } from "../languages/french/proficiency.js";
import { frenchQualityPolicy } from "../languages/french/quality.js";
import { japaneseLanguagePack } from "../languages/japanese/manifest.js";
import { japaneseLearningProfile } from "../languages/japanese/learning.js";
import { japaneseProficiencyPolicy } from "../languages/japanese/proficiency.js";
import { japaneseQualityPolicy } from "../languages/japanese/quality.js";

const redistributableSource: SourceRecord = {
  id: "source-1",
  title: "Test source",
  roles: ["course"],
  licenseName: "CC BY 4.0",
  canonicalUrl: "https://example.com/source",
  attribution: "Example Author",
  policy: {
    canStore: true,
    canTransform: true,
    canRedistributeRaw: true,
    canRedistributeDerived: true,
    canUseCommercially: true,
    requiresAttribution: true,
    requiresShareAlike: false,
    privateOnly: false
  }
};

function completeCoverage(
  proficiencyPolicy: typeof frenchProficiencyPolicy | typeof japaneseProficiencyPolicy,
  extra: readonly { key: string; minimumCount: number }[]
): Record<string, number> {
  const coverage: Record<string, number> = {};
  for (const requirement of promotionCoverageRequirements(proficiencyPolicy)) {
    coverage[requirement.key] = Math.max(
      coverage[requirement.key] ?? 0,
      requirement.minimumCount
    );
  }
  for (const requirement of extra) {
    coverage[requirement.key] = Math.max(
      coverage[requirement.key] ?? 0,
      requirement.minimumCount
    );
  }
  return coverage;
}

function frenchCandidate(): LanguagePackReleaseCandidate {
  return {
    manifest: frenchLanguagePack,
    learningProfile: frenchLearningProfile,
    proficiencyPolicy: frenchProficiencyPolicy,
    qualityPolicy: frenchQualityPolicy,
    sources: [redistributableSource],
    records: [
      {
        type: "lexeme",
        id: "bonjour",
        level: "A1",
        sourceIds: ["source-1"],
        visibility: "public",
        derivation: "derived"
      },
      {
        type: "sentence",
        id: "hello-sentence",
        level: "A1",
        sourceIds: ["source-1"],
        visibility: "public",
        derivation: "derived"
      }
    ],
    references: [
      {
        fromType: "sentence",
        fromId: "hello-sentence",
        field: "lexemeIds",
        toType: "lexeme",
        toId: "bonjour"
      }
    ],
    coverage: completeCoverage(
      frenchProficiencyPolicy,
      frenchQualityPolicy.additionalCoverageRequirements
    ),
    qualityMetrics: Object.fromEntries(
      frenchQualityPolicy.qualityMetrics.map((metric) => [metric.id, 1])
    )
  };
}

function japaneseCandidate(): LanguagePackReleaseCandidate {
  return {
    manifest: japaneseLanguagePack,
    learningProfile: japaneseLearningProfile,
    proficiencyPolicy: japaneseProficiencyPolicy,
    qualityPolicy: japaneseQualityPolicy,
    sources: [redistributableSource],
    records: [
      {
        type: "lexeme",
        id: "neko",
        level: "A1",
        sourceIds: ["source-1"],
        visibility: "public",
        derivation: "derived"
      }
    ],
    references: [],
    coverage: completeCoverage(
      japaneseProficiencyPolicy,
      japaneseQualityPolicy.additionalCoverageRequirements
    ),
    qualityMetrics: Object.fromEntries(
      japaneseQualityPolicy.qualityMetrics.map((metric) => [metric.id, 1])
    )
  };
}

describe("shared language-pack release certification", () => {
  it("certifies structurally different French and Japanese candidates through one engine", () => {
    const french = certifyLanguagePack(frenchCandidate());
    const japanese = certifyLanguagePack(japaneseCandidate());

    expect(french.status).toBe("certified");
    expect(japanese.status).toBe("certified");
    expect(french.promotionReadyLevels).toEqual(["A1", "A2", "B1", "B2"]);
    expect(japanese.promotionReadyLevels).toEqual(["A1", "A2", "B1", "B2"]);
  });

  it("blocks release on broken required references", () => {
    const candidate = frenchCandidate();
    const certification = certifyLanguagePack({
      ...candidate,
      references: [
        {
          fromType: "sentence",
          fromId: "hello-sentence",
          field: "lexemeIds",
          toType: "lexeme",
          toId: "missing"
        }
      ]
    });

    expect(certification.status).toBe("blocked");
    expect(certification.issues.some((issue) => issue.code === "broken-reference"))
      .toBe(true);
  });

  it("blocks public release when licensing does not permit redistribution", () => {
    const candidate = japaneseCandidate();
    const blockedSource: SourceRecord = {
      ...redistributableSource,
      id: "blocked",
      licenseName: "All rights reserved",
      policy: {
        ...redistributableSource.policy,
        canRedistributeRaw: false,
        canRedistributeDerived: false
      }
    };

    const certification = certifyLanguagePack({
      ...candidate,
      sources: [blockedSource],
      records: candidate.records.map((record) => ({
        ...record,
        sourceIds: ["blocked"]
      }))
    });

    expect(certification.publicReleaseReady).toBe(false);
    expect(
      certification.issues.some(
        (issue) => issue.code === "redistribution-not-permitted"
      )
    ).toBe(true);
  });

  it("requires explicit attribution when the source policy requires it", () => {
    const candidate = frenchCandidate();
    const { attribution: _attribution, ...sourceWithoutAttribution } = redistributableSource;
    const source: SourceRecord = sourceWithoutAttribution;

    const certification = certifyLanguagePack({
      ...candidate,
      sources: [source]
    });

    expect(certification.status).toBe("blocked");
    expect(
      certification.issues.some((issue) => issue.code === "missing-attribution")
    ).toBe(true);
  });

  it("keeps product coverage gaps separate from structural release defects", () => {
    const candidate = frenchCandidate();
    const certification = certifyLanguagePack({
      ...candidate,
      coverage: {
        ...candidate.coverage,
        "reading:B2": 0
      }
    });

    expect(certification.status).toBe("certified_with_warnings");
    expect(certification.publicReleaseReady).toBe(true);
    expect(certification.promotionReadyLevels).not.toContain("B2");
    expect(
      certification.issues.some(
        (issue) =>
          issue.code === "coverage-gap" &&
          issue.level === "B2" &&
          issue.promotionBlocking === true
      )
    ).toBe(true);
  });

  it("blocks a release candidate whose shared components disagree on language identity", () => {
    const candidate = frenchCandidate();
    const certification = certifyLanguagePack({
      ...candidate,
      qualityPolicy: japaneseQualityPolicy
    });

    expect(certification.status).toBe("blocked");
    expect(
      certification.issues.some(
        (issue) =>
          issue.code === "language-mismatch" &&
          issue.message.includes("quality-policy")
      )
    ).toBe(true);
  });

  it("surfaces editorial thresholds as warnings without rewriting content", () => {
    const candidate = frenchCandidate();
    const certification = certifyLanguagePack({
      ...candidate,
      qualityMetrics: {
        ...candidate.qualityMetrics,
        "ipa-coverage": 0.5
      }
    });

    expect(certification.status).toBe("certified_with_warnings");
    expect(
      certification.issues.some(
        (issue) =>
          issue.code === "quality-below-threshold" &&
          issue.message.includes("IPA")
      )
    ).toBe(true);
  });

  it("does not apply public redistribution rules to private learner content", () => {
    const candidate = japaneseCandidate();
    const privateSource: SourceRecord = {
      id: "private-book",
      title: "Learner-owned book",
      roles: ["private-source"],
      policy: {
        canStore: true,
        canTransform: false,
        canRedistributeRaw: false,
        canRedistributeDerived: false,
        canUseCommercially: null,
        requiresAttribution: false,
        requiresShareAlike: false,
        privateOnly: true
      }
    };

    const certification = certifyLanguagePack({
      ...candidate,
      sources: [...candidate.sources, privateSource],
      records: [
        ...candidate.records,
        {
          type: "document",
          id: "private-book-1",
          sourceIds: ["private-book"],
          visibility: "private",
          derivation: "raw"
        }
      ]
    });

    expect(certification.status).toBe("certified");
  });

  it("rejects duplicate canonical IDs within the same content type", () => {
    const candidate = frenchCandidate();
    const duplicate = candidate.records[0]!;

    const certification = certifyLanguagePack({
      ...candidate,
      records: [...candidate.records, duplicate]
    });

    expect(certification.status).toBe("blocked");
    expect(
      certification.issues.some(
        (issue) => issue.code === "duplicate-content-id"
      )
    ).toBe(true);
  });
});
