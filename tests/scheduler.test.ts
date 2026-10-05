import { describe, expect, it } from "vitest";
import { createFsrsScheduler } from "../packages/scheduler/src/index.js";

describe("shared memory scheduler boundary", () => {
  it("creates and reviews a language-aware FSRS trace", () => {
    const scheduler = createFsrsScheduler();
    const identity = {
      accountId: "user-1",
      entity: { languageId: "japanese", kind: "lexeme", id: "猫" },
      dimension: "meaning_recognition",
      cueFamily: "jp-meaning"
    } as const;

    const created = scheduler.create(identity, "2026-01-01T10:00:00.000Z");
    const reviewed = scheduler.review(created, {
      grade: "good",
      reviewedAt: "2026-01-01T10:00:00.000Z"
    });

    expect(reviewed.revision).toBe(1);
    expect(reviewed.entity.languageId).toBe("japanese");
    expect(reviewed.schedulerFamily).toBe("fsrs");

    const retrievability = scheduler.retrievability(
      reviewed,
      "2026-01-02T10:00:00.000Z"
    );
    expect(retrievability).toBeGreaterThanOrEqual(0);
    expect(retrievability).toBeLessThanOrEqual(1);
  });
});
