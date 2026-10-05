import { describe, expect, it } from "vitest";
import {
  activityCalibrationBonus,
  composeAdaptiveBlock,
  rankActivities,
  validateLearningProfile
} from "../packages/orchestrator/src/index.js";
import type { SkillProfile } from "../packages/skill-graph/src/index.js";
import { frenchLearningProfile } from "../languages/french/learning.js";
import { japaneseLearningProfile } from "../languages/japanese/learning.js";

function skill(
  skillId: string,
  strength: number,
  confidence = 0.8
): SkillProfile {
  return {
    skillId,
    strength,
    confidence,
    evidenceCount: 12,
    state: strength >= 0.8 ? "secure" : strength >= 0.55 ? "functional" : "developing"
  };
}

describe("shared adaptive orchestrator", () => {
  it("validates both language learning profiles", () => {
    expect(validateLearningProfile(frenchLearningProfile)).toEqual([]);
    expect(validateLearningProfile(japaneseLearningProfile)).toEqual([]);
  });

  it("detects an evidence-backed downstream transfer gap", () => {
    const ranked = rankActivities(
      frenchLearningProfile,
      [
        skill("vocabulary", 0.9),
        skill("natural-usage", 0.85),
        skill("phrase-transfer", 0.82),
        skill("sentence-transfer", 0.8),
        skill("reading", 0.75),
        skill("listening", 0.78),
        skill("speaking", 0.35),
        skill("conversation", 0.3),
        skill("missions", 0.2)
      ],
      [
        { activityId: "speaking", urgency: 0.3 },
        { activityId: "mixed-review", recentLaunches: 2 }
      ]
    );

    const speaking = ranked.find((candidate) => candidate.activity.id === "speaking");
    expect(speaking?.factors.transferGap ?? 0).toBeGreaterThan(0);
    expect(speaking?.reason).toMatch(/Upstream|weakness/);
  });

  it("treats missing evidence as uncertainty rather than confirmed weakness", () => {
    const ranked = rankActivities(
      japaneseLearningProfile,
      japaneseLearningProfile.graph.nodes.map((node) => ({
        skillId: node.id,
        strength: 0,
        confidence: 0,
        evidenceCount: 0,
        state: "unseen" as const
      }))
    );

    const interaction = ranked.find((candidate) => candidate.activity.id === "interaction");
    expect(interaction?.factors.confirmedNeed).toBe(0);
    expect(interaction?.factors.uncertainty).toBe(1);
    expect(interaction?.factors.prerequisiteReadiness).toBe(0);
  });

  it("keeps resumable work above new recommendations", () => {
    const profiles = frenchLearningProfile.graph.nodes.map((node) =>
      skill(node.id, 0.5, 0.6)
    );

    const ranked = rankActivities(frenchLearningProfile, profiles, [
      { activityId: "reading", resume: true }
    ]);

    expect(ranked[0]?.activity.id).toBe("reading");
    expect(ranked[0]?.score).toBe(100);
  });

  it("requires repeated observations before applying bounded calibration", () => {
    expect(
      activityCalibrationBonus("speaking", [
        { activityId: "speaking", completedAt: "2026-01-01", observation: 0.5 },
        { activityId: "speaking", completedAt: "2026-01-02", observation: 0.5 }
      ])
    ).toBe(0);

    const bonus = activityCalibrationBonus(
      "speaking",
      Array.from({ length: 6 }, (_, index) => ({
        activityId: "speaking",
        completedAt: `2026-01-${String(index + 1).padStart(2, "0")}`,
        observation: 0.5
      }))
    );

    expect(bonus).toBe(6);
  });

  it("places prerequisite support before an under-ready anchor and respects block limits", () => {
    const profiles = [
      skill("kana", 0.25, 0.8),
      skill("vocabulary", 0.3, 0.8),
      skill("kanji", 0.2, 0.8),
      skill("word-reading", 0.25, 0.8),
      skill("sentence-reading", 0.4, 0.6),
      skill("listening", 0.5, 0.6),
      skill("spoken-production", 0.4, 0.6),
      skill("interaction", 0.2, 0.6)
    ];

    const ranked = rankActivities(japaneseLearningProfile, profiles, [
      { activityId: "word-reading", urgency: 1 },
      { activityId: "vocabulary-review", urgency: 0.7 }
    ]);
    const block = composeAdaptiveBlock(japaneseLearningProfile, ranked);

    expect(block).toBeDefined();
    expect(block?.steps.length ?? 0).toBeLessThanOrEqual(3);
    expect(block?.estimatedMinutes ?? 99).toBeLessThanOrEqual(26);

    if (block?.anchorActivityId === "word-reading") {
      expect(block.steps[0]?.role).toBe("prerequisite_support");
      expect(block.steps[1]?.role).toBe("anchor");
    }
  });
});
