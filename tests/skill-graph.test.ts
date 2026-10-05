import { describe, expect, it } from "vitest";
import {
  deriveSkillProfilesFromMastery,
  validateSkillGraph
} from "../packages/skill-graph/src/index.js";
import { frenchLearningProfile } from "../languages/french/learning.js";
import { japaneseLearningProfile } from "../languages/japanese/learning.js";
import type { MasteryProjection } from "../packages/domain/src/index.js";

function projection(
  languageId: string,
  dimension: string,
  estimate: number,
  confidence: number,
  evidenceCount = 8
): MasteryProjection {
  return {
    accountId: "user-1",
    languageId,
    entity: { languageId, kind: "lexeme", id: `${dimension}-item` },
    dimension,
    estimate,
    confidence,
    evidenceCount,
    independentSuccesses: 3,
    supportedSuccesses: 0,
    failures: 0,
    delayedSuccesses7d: 0,
    delayedFailures7d: 0,
    lapses: 0,
    distinctEvidenceDays: 3,
    modelVersion: "test"
  };
}

describe("language-specific skill graphs", () => {
  it("validates French and Japanese without forcing the same graph", () => {
    expect(validateSkillGraph(frenchLearningProfile.graph)).toEqual([]);
    expect(validateSkillGraph(japaneseLearningProfile.graph)).toEqual([]);

    const frenchIds = frenchLearningProfile.graph.nodes.map((node) => node.id);
    const japaneseIds = japaneseLearningProfile.graph.nodes.map((node) => node.id);

    expect(frenchIds).toContain("missions");
    expect(frenchIds).not.toContain("kana");
    expect(japaneseIds).toContain("kana");
    expect(japaneseIds).toContain("kanji");
    expect(japaneseIds).not.toContain("missions");
  });

  it("derives evidence-limited skill profiles from P2 mastery projections", () => {
    const mastery = {
      a: projection("french", "meaning_recognition", 0.9, 0.8, 10),
      b: projection("french", "meaning_recall", 0.7, 0.7, 8)
    };

    const profiles = deriveSkillProfilesFromMastery(
      frenchLearningProfile.graph,
      mastery
    );
    const vocabulary = profiles.find((profile) => profile.skillId === "vocabulary");

    expect(vocabulary?.strength).toBeCloseTo(0.7);
    expect(vocabulary?.confidence ?? 0).toBeGreaterThan(0);
    expect(vocabulary?.evidenceCount).toBe(18);
  });

  it("does not treat absent skill evidence as measured failure", () => {
    const profiles = deriveSkillProfilesFromMastery(
      japaneseLearningProfile.graph,
      {}
    );
    const interaction = profiles.find((profile) => profile.skillId === "interaction");

    expect(interaction).toMatchObject({
      strength: 0,
      confidence: 0,
      state: "unseen"
    });
  });
});
