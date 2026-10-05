import { describe, expect, it } from "vitest";
import {
  createPromotionMilestone,
  evaluateLevelPromotion,
  mapExternalFrameworkResult,
  remediationSignal,
  validateProficiencyPolicy,
  type AssessmentEvidence
} from "../packages/proficiency/src/index.js";
import {
  frenchProficiencyPolicy
} from "../languages/french/proficiency.js";
import {
  japaneseExternalFrameworks,
  japaneseProficiencyPolicy
} from "../languages/japanese/proficiency.js";

function coverageFor(
  level: string,
  language: "french" | "japanese"
): Record<string, number> {
  if (language === "french") {
    return {
      [`vocabulary:${level}`]: 100,
      [`transfer:${level}`]: 20,
      [`reading:${level}`]: 3,
      [`listening:${level}`]: 3,
      [`speaking:${level}`]: 3,
      [`interaction:${level}`]: 3,
      [`missions:${level}`]: 1
    };
  }

  return {
    [`vocabulary:${level}`]: 100,
    [`script:${level}`]: 20,
    [`reading:${level}`]: 3,
    [`listening:${level}`]: 3,
    [`speaking:${level}`]: 3,
    [`interaction:${level}`]: 3,
    [`writing:${level}`]: 2,
    [`can-do:${level}`]: 1
  };
}

function evidenceForAllGates(
  languageId: string,
  frameworkId: string,
  level: string,
  gateIds: readonly string[],
  coverage: Readonly<Record<string, number>>,
  score = 0.9,
  confidence = 0.8
): AssessmentEvidence[] {
  return gateIds.map((gateId, index) => ({
    id: `${languageId}-${level}-${gateId}`,
    accountId: "user-1",
    languageId,
    frameworkId,
    level,
    gateId,
    score,
    confidence,
    evidenceCount: 8,
    independentEvidenceCount: 5,
    coverageKeys: Object.keys(coverage),
    assessedAt: `2026-01-${String(index + 1).padStart(2, "0")}T10:00:00.000Z`,
    source: "internal_checkpoint"
  }));
}

describe("shared proficiency and promotion architecture", () => {
  it("validates French and Japanese through the same policy contract", () => {
    expect(validateProficiencyPolicy(frenchProficiencyPolicy)).toEqual([]);
    expect(validateProficiencyPolicy(japaneseProficiencyPolicy)).toEqual([]);
  });

  it("requires every gate; a strong average cannot compensate for one failed skill", () => {
    const level = frenchProficiencyPolicy.levels[0]!;
    const coverage = coverageFor("A1", "french");
    const evidence = evidenceForAllGates(
      "french",
      "cefr",
      "A1",
      level.gates.map((gate) => gate.id),
      coverage
    ).map((item) =>
      item.gateId === "speaking"
        ? { ...item, score: 0.1 }
        : item
    );

    const result = evaluateLevelPromotion(
      frenchProficiencyPolicy,
      "A1",
      evidence,
      coverage
    );

    expect(result.meanGateScore).toBeGreaterThan(0.7);
    expect(result.status).toBe("not_ready");
    expect(result.gates.find((gate) => gate.gateId === "speaking")?.status)
      .toBe("below_threshold");
  });

  it("blocks promotion when the product lacks required assessment coverage", () => {
    const level = frenchProficiencyPolicy.levels[3]!;
    const coverage = coverageFor("B2", "french");
    coverage["reading:B2"] = 0;

    const evidence = evidenceForAllGates(
      "french",
      "cefr",
      "B2",
      level.gates.map((gate) => gate.id),
      coverage
    );

    const result = evaluateLevelPromotion(
      frenchProficiencyPolicy,
      "B2",
      evidence,
      coverage,
      [
        {
          languageId: "french",
          frameworkId: "cefr",
          level: "B1",
          firstEarnedAt: "2026-01-01T00:00:00.000Z",
          gateCountAtPromotion: 7,
          meanGateScoreAtPromotion: 0.8
        }
      ]
    );

    expect(result.status).toBe("coverage_incomplete");
    expect(result.gates.find((gate) => gate.gateId === "reading")?.status)
      .toBe("coverage_incomplete");
  });

  it("enforces sequential promotion prerequisites", () => {
    const level = frenchProficiencyPolicy.levels[1]!;
    const coverage = coverageFor("A2", "french");
    const evidence = evidenceForAllGates(
      "french",
      "cefr",
      "A2",
      level.gates.map((gate) => gate.id),
      coverage
    );

    const result = evaluateLevelPromotion(
      frenchProficiencyPolicy,
      "A2",
      evidence,
      coverage
    );

    expect(result.gates.every((gate) => gate.status === "pass")).toBe(true);
    expect(result.status).toBe("blocked_prerequisite");
  });

  it("preserves earned milestones while surfacing maintenance need", () => {
    const level = frenchProficiencyPolicy.levels[0]!;
    const coverage = coverageFor("A1", "french");
    const strong = evidenceForAllGates(
      "french",
      "cefr",
      "A1",
      level.gates.map((gate) => gate.id),
      coverage
    );
    const eligible = evaluateLevelPromotion(
      frenchProficiencyPolicy,
      "A1",
      strong,
      coverage
    );
    const milestone = createPromotionMilestone(
      eligible,
      "2026-02-01T00:00:00.000Z"
    );

    const weakened = strong.map((item) =>
      item.gateId === "listening" ? { ...item, score: 0.2 } : item
    );
    const reevaluated = evaluateLevelPromotion(
      frenchProficiencyPolicy,
      "A1",
      weakened,
      coverage,
      [milestone]
    );

    expect(reevaluated.status).toBe("promoted_maintenance_needed");
  });

  it("never turns a partial external-framework mapping into a global promotion claim", () => {
    const mapped = mapExternalFrameworkResult(
      {
        accountId: "user-1",
        languageId: "japanese",
        frameworkId: "jlpt",
        level: "N3",
        assessedAt: "2026-03-01T00:00:00.000Z",
        verified: true
      },
      [
        {
          fromFrameworkId: "jlpt",
          fromLevel: "N3",
          toFrameworkId: "cefr",
          toLevel: "B1",
          scope: "partial",
          competences: ["lexical", "grammar", "reading", "listening"],
          note: "Illustrative scoped mapping fixture"
        }
      ],
      "cefr"
    );

    expect(mapped?.scope).toBe("partial");
    expect(mapped?.canSupportGlobalPromotion).toBe(false);
    expect(mapped?.competences).not.toContain("spoken_production");
  });

  it("declares JLPT as a scoped exam overlay rather than a full four-skill substitute", () => {
    const jlpt = japaneseExternalFrameworks.find(
      (framework) => framework.frameworkId === "jlpt"
    );

    expect(jlpt?.coveredCompetences).toContain("reading");
    expect(jlpt?.coveredCompetences).toContain("listening");
    expect(jlpt?.excludedCompetences).toContain("spoken_production");
    expect(jlpt?.excludedCompetences).toContain("writing");
  });

  it("provides a bounded remediation signal only for learner-remediable gate failures", () => {
    const level = frenchProficiencyPolicy.levels[0]!;
    const coverage = coverageFor("A1", "french");
    const evidence = evidenceForAllGates(
      "french",
      "cefr",
      "A1",
      level.gates.map((gate) => gate.id),
      coverage
    ).map((item) =>
      item.gateId === "listening"
        ? { ...item, score: 0.2, confidence: 0.5 }
        : item
    );

    const result = evaluateLevelPromotion(
      frenchProficiencyPolicy,
      "A1",
      evidence,
      coverage
    );
    const signal = remediationSignal(
      frenchProficiencyPolicy,
      result,
      999
    );

    expect(signal?.activityId).toBe("listening");
    expect(signal?.boost ?? 0).toBeLessThanOrEqual(16);

    const brokenCoverage = { ...coverage, "listening:A1": 0 };
    const blocked = evaluateLevelPromotion(
      frenchProficiencyPolicy,
      "A1",
      evidence,
      brokenCoverage
    );

    expect(remediationSignal(frenchProficiencyPolicy, blocked)).toBeUndefined();
  });
});
