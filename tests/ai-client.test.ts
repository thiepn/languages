import { describe, expect, it, vi } from "vitest";
import {
  createLanguagesAiClient,
  LanguagesAiError,
} from "../packages/ai-client/src/index";

const input = {
  languageId: "french",
  text: "Bonjour.",
  proficiency: {
    framework: "cefr" as const,
    level: "A1",
  },
};

describe("Languages AI browser client", () => {
  it("calls Core rather than the AI service directly", async () => {
    const fetch = vi.fn(async (request: RequestInfo | URL, init?: RequestInit) => {
      expect(String(request)).toBe(
        "https://api.thiepn.dev/v1/languages/ai/correct",
      );
      const headers = new Headers(init?.headers);
      expect(headers.get("Authorization")).toBe("Bearer account-token");
      expect(JSON.parse(String(init?.body))).toEqual({ input });

      return Response.json({
        ok: true,
        data: {
          capability: "languages.correct",
          version: 1,
          model: "gpt-6-luna",
          data: {
            status: "correct",
            correctedText: "Bonjour.",
            summary: "Correct.",
            errors: [],
            suggestions: [],
            naturalVersion: null,
          },
        },
        meta: { requestId: "core-request-1" },
      });
    });

    const client = createLanguagesAiClient({
      coreBaseUrl: "https://api.thiepn.dev",
      getAccessToken: () => "account-token",
      fetch,
    });

    const result = await client.correct(input);
    expect(result.data.status).toBe("correct");
    expect(result.meta.requestId).toBe("core-request-1");
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("fails locally when the learner is signed out", async () => {
    const fetch = vi.fn();
    const client = createLanguagesAiClient({
      coreBaseUrl: "https://api.thiepn.dev",
      getAccessToken: () => null,
      fetch,
    });

    await expect(client.correct(input)).rejects.toMatchObject({
      code: "AUTH_REQUIRED",
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("maps Core usage limits to a stable learner-facing error", async () => {
    const client = createLanguagesAiClient({
      coreBaseUrl: "https://api.thiepn.dev",
      getAccessToken: () => "account-token",
      fetch: async () =>
        Response.json(
          {
            ok: false,
            error: {
              code: "CORE_LANGUAGES_AI_LIMITED",
              message: "limit",
              requestId: "req-limit",
            },
          },
          { status: 429 },
        ),
    });

    try {
      await client.correct(input);
      throw new Error("expected failure");
    } catch (error) {
      expect(error).toBeInstanceOf(LanguagesAiError);
      expect(error).toMatchObject({
        code: "LIMITED",
        requestId: "req-limit",
      });
    }
  });

  it("rejects a mismatched capability response", async () => {
    const client = createLanguagesAiClient({
      coreBaseUrl: "https://api.thiepn.dev",
      getAccessToken: () => "account-token",
      fetch: async () =>
        Response.json({
          ok: true,
          data: {
            capability: "languages.explain",
            version: 1,
            model: "gpt-6-luna",
            data: {},
          },
          meta: { requestId: "req-wrong" },
        }),
    });

    await expect(client.correct(input)).rejects.toMatchObject({
      code: "INVALID_RESPONSE",
    });
  });

  it("never accepts an AI-service URL with a path or credentials", () => {
    expect(() =>
      createLanguagesAiClient({
        coreBaseUrl: "https://user:pass@api.thiepn.dev/v1",
        getAccessToken: () => "account-token",
      }),
    ).toThrow(TypeError);
  });
});
