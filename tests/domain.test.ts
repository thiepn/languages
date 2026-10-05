import { describe, expect, it } from "vitest";
import {
  assertEventLanguageConsistency,
  entityKey,
  type StudyEvent
} from "../packages/domain/src/index.js";

describe("language-aware learner evidence", () => {
  it("namespaces entity identities by language", () => {
    expect(entityKey({ languageId: "french", kind: "lexeme", id: "chat" }, "meaning_recognition"))
      .toBe("french:lexeme:chat:meaning_recognition");
  });

  it("rejects cross-language targets inside a single-language study event", () => {
    const event: StudyEvent = {
      id: "event-1",
      accountId: "user-1",
      deviceId: "device-1",
      languageId: "french",
      occurredAt: "2026-10-05T10:00:00Z",
      activity: "review",
      primaryTarget: { languageId: "japanese", kind: "lexeme", id: "猫" },
      result: "correct"
    };

    expect(() => assertEventLanguageConsistency(event)).toThrow(/targets japanese content/);
  });
});
