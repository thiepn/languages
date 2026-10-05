import { describe, expect, it } from "vitest";
import {
  calibrationCorrection,
  classifyLongitudinalMastery,
  replayStudyEvents,
  summarizeEntityMastery
} from "../packages/learner-engine/src/index.js";
import { createFsrsScheduler } from "../packages/scheduler/src/index.js";
import type { StudyEvent } from "../packages/domain/src/index.js";

const entity = { languageId: "french", kind: "lexeme", id: "prendre" } as const;

function event(
  id: string,
  occurredAt: string,
  overrides: Partial<StudyEvent> = {}
): StudyEvent {
  return {
    id,
    accountId: "user-1",
    deviceId: "device-1",
    languageId: "french",
    occurredAt,
    activity: "review",
    primaryTarget: entity,
    skillDimension: "meaning_recall",
    result: "correct",
    supportLevel: "independent",
    ...overrides
  };
}

describe("shared learner evidence engine", () => {
  it("replays events deterministically regardless of input order", () => {
    const scheduler = createFsrsScheduler();
    const events = [
      event("b", "2026-01-02T10:00:00.000Z"),
      event("a", "2026-01-01T10:00:00.000Z")
    ];

    const forward = replayStudyEvents(events, scheduler);
    const reverse = replayStudyEvents([...events].reverse(), scheduler);

    expect(forward.mastery).toEqual(reverse.mastery);
    expect(forward.evidence).toEqual(reverse.evidence);
  });

  it("values independent retrieval more strongly than hinted success", () => {
    const scheduler = createFsrsScheduler();

    const independent = replayStudyEvents(
      [event("independent", "2026-01-01T10:00:00.000Z")],
      scheduler
    );
    const hinted = replayStudyEvents(
      [
        event("hinted", "2026-01-01T10:00:00.000Z", {
          supportLevel: "hinted"
        })
      ],
      scheduler
    );

    const independentProjection = Object.values(independent.mastery)[0];
    const hintedProjection = Object.values(hinted.mastery)[0];

    expect(independentProjection?.estimate).toBeGreaterThan(hintedProjection?.estimate ?? 0);
    expect(independentProjection?.independentSuccesses).toBe(1);
    expect(hintedProjection?.supportedSuccesses).toBe(1);
  });

  it("does not create a memory schedule unless the event explicitly carries a memory review", () => {
    const scheduler = createFsrsScheduler();
    const withoutMemory = replayStudyEvents(
      [event("plain", "2026-01-01T10:00:00.000Z")],
      scheduler
    );
    const withMemory = replayStudyEvents(
      [
        event("scheduled", "2026-01-01T10:00:00.000Z", {
          memoryReview: { cueFamily: "fr-active-recall", grade: "good" }
        })
      ],
      scheduler
    );

    expect(Object.keys(withoutMemory.memory)).toHaveLength(0);
    expect(Object.keys(withMemory.memory)).toHaveLength(1);
  });

  it("cannot become durable from same-day success alone", () => {
    const classification = classifyLongitudinalMastery({
      hasEvidence: true,
      learned: true,
      retrievable: true,
      usable: true,
      confidence: 0.95,
      retention7: 0.95,
      retention30: 0.9,
      delayedSuccesses7d: 0,
      delayedFailures7d: 0,
      evidenceSpanDays: 0,
      lapses: 0
    });

    expect(classification.state).toBe("usable");
  });

  it("allows durable classification only after spacing, retention and confidence gates", () => {
    const classification = classifyLongitudinalMastery({
      hasEvidence: true,
      learned: true,
      retrievable: true,
      usable: true,
      confidence: 0.6,
      retention7: 0.82,
      retention30: 0.7,
      delayedSuccesses7d: 2,
      delayedFailures7d: 0,
      evidenceSpanDays: 28,
      lapses: 0
    });

    expect(classification.state).toBe("durable");
    expect(classification.fragile).toBe(false);
  });

  it("keeps forgetting calibration inactive until enough delayed observations exist", () => {
    expect(calibrationCorrection(11, 8, 10)).toBe(0);
    expect(calibrationCorrection(20, 2, 20)).toBeLessThanOrEqual(0.08);
    expect(calibrationCorrection(20, 18, 0)).toBeGreaterThanOrEqual(-0.08);
  });

  it("produces an entity summary without conflating it with a proficiency claim", () => {
    const scheduler = createFsrsScheduler();
    const state = replayStudyEvents(
      [
        event("a", "2026-01-01T10:00:00.000Z", {
          memoryReview: { cueFamily: "fr-active-recall", grade: "good" }
        }),
        event("b", "2026-01-10T10:00:00.000Z", {
          memoryReview: { cueFamily: "fr-active-recall", grade: "good" }
        })
      ],
      scheduler
    );

    const summary = summarizeEntityMastery(
      state,
      entity,
      scheduler,
      "2026-01-10T10:00:00.000Z"
    );

    expect(summary.entity).toEqual(entity);
    expect(summary.state).not.toBe("durable");
    expect(summary.retention?.oneDay ?? 0).toBeGreaterThanOrEqual(
      summary.retention?.thirtyDay ?? 0
    );
  });
});
