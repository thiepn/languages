export class LanguagesAiError extends Error {
  constructor(code, message, requestId) {
    super(message);
    this.name = "LanguagesAiError";
    this.code = code;
    this.requestId = requestId;
  }
}

const routes = {
  "languages.correct": "/v1/languages/ai/correct",
  "languages.explain": "/v1/languages/ai/explain",
  "languages.generateExercise": "/v1/languages/ai/exercises",
  "languages.conversation": "/v1/languages/ai/conversation"
};

function origin(value) {
  const url = new URL(value);
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== "/"
  ) {
    throw new TypeError("coreBaseUrl must be an HTTP(S) origin");
  }
  return url;
}

export function createLanguagesAiClient(options) {
  const base = origin(options.coreBaseUrl);
  const transport = options.fetch ?? globalThis.fetch;
  const timeoutMs = options.timeoutMs ?? 20000;

  if (typeof transport !== "function") throw new TypeError("fetch required");
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0)
    throw new TypeError("timeoutMs must be positive");

  async function run(capability, input) {
    const token = await options.getAccessToken();
    if (!token)
      throw new LanguagesAiError(
        "AUTH_REQUIRED",
        "Sign in to use AI language features."
      );

    let response;
    try {
      response = await transport(new URL(routes[capability], base), {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({ input }),
        credentials: "omit",
        redirect: "error",
        signal: AbortSignal.timeout(timeoutMs)
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "TimeoutError")
        throw new LanguagesAiError("TIMEOUT", "AI request timed out.");
      throw new LanguagesAiError("UNAVAILABLE", "AI service is unavailable.");
    }

    let payload;
    try {
      payload = await response.json();
    } catch {
      throw new LanguagesAiError("INVALID_RESPONSE", "AI returned invalid data.");
    }

    if (!response.ok) {
      const code = payload?.error?.code;
      const requestId = payload?.error?.requestId;
      if (response.status === 401)
        throw new LanguagesAiError(
          "AUTH_REQUIRED",
          "Sign in again to use AI language features.",
          requestId
        );
      if (response.status === 400 || response.status === 413)
        throw new LanguagesAiError(
          "INVALID_REQUEST",
          payload?.error?.message ?? "Invalid AI request.",
          requestId
        );
      if (response.status === 429 || code === "CORE_LANGUAGES_AI_LIMITED")
        throw new LanguagesAiError(
          "LIMITED",
          "AI usage limit reached. Try again later.",
          requestId
        );
      throw new LanguagesAiError(
        "UNAVAILABLE",
        "AI language features are temporarily unavailable.",
        requestId
      );
    }

    if (
      payload?.ok !== true ||
      payload?.data?.capability !== capability ||
      typeof payload?.data?.version !== "number" ||
      payload?.data?.model !== "gpt-6-luna" ||
      typeof payload?.meta?.requestId !== "string"
    ) {
      throw new LanguagesAiError(
        "INVALID_RESPONSE",
        "AI response did not match the expected contract."
      );
    }

    return {
      data: payload.data.data,
      meta: {
        capability,
        version: payload.data.version,
        model: "gpt-6-luna",
        requestId: payload.meta.requestId
      }
    };
  }

  return Object.freeze({
    run,
    correct: input => run("languages.correct", input),
    explain: input => run("languages.explain", input),
    generateExercise: input => run("languages.generateExercise", input),
    conversation: input => run("languages.conversation", input)
  });
}
