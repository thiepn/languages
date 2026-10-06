export type LanguageProficiency = {
  readonly framework: "cefr" | "jlpt" | "custom";
  readonly level: string;
};

export type LanguageCorrectionCategory =
  | "grammar"
  | "tense_aspect"
  | "agreement"
  | "conjugation"
  | "word_order"
  | "article_determiner"
  | "preposition"
  | "pronoun"
  | "vocabulary"
  | "collocation"
  | "idiom_naturalness"
  | "spelling"
  | "punctuation"
  | "register"
  | "script"
  | "other";

export interface LanguageCorrectionError {
  readonly id: string;
  readonly category: LanguageCorrectionCategory;
  readonly severity: "minor" | "major";
  readonly original: string;
  readonly correction: string;
  readonly explanation: string;
  readonly confidence: "high" | "medium" | "low";
}

export interface LanguagesAiCapabilityMap {
  "languages.correct": {
    input: {
      languageId: string;
      text: string;
      proficiency: LanguageProficiency;
      explanationLanguage?: string;
      focus?: "accuracy" | "accuracy_and_naturalness";
      context?: string;
    };
    output: {
      status: "correct" | "needs_correction";
      correctedText: string;
      summary: string;
      errors: LanguageCorrectionError[];
      suggestions: {
        original: string;
        suggestion: string;
        reason: string;
      }[];
      naturalVersion: string | null;
    };
  };
  "languages.explain": {
    input: {
      languageId: string;
      proficiency: LanguageProficiency;
      sourceText: string;
      correctedText: string;
      focus: {
        type: "error" | "suggestion" | "general";
        original: string;
        correction: string;
        category: LanguageCorrectionCategory | null;
      };
      explanationLanguage?: string;
      question?: string;
    };
    output: {
      headline: string;
      explanation: string;
      rule: string;
      levelFit: "core" | "useful_next_step" | "advanced_detail";
      examples: {
        target: string;
        meaning: string | null;
        note: string | null;
      }[];
      memoryTip: string | null;
      nuance: string | null;
    };
  };
  "languages.generateExercise": {
    input: {
      languageId: string;
      proficiency: LanguageProficiency;
      targets: {
        skillIds: string[];
        correctionCategories: LanguageCorrectionCategory[];
        learnerNotes?: string[];
      };
      count?: number;
      exerciseTypes?: (
        | "fill_blank"
        | "rewrite"
        | "translation"
        | "multiple_choice"
        | "short_response"
        | "sentence_build"
      )[];
      topic?: string;
      explanationLanguage?: string;
    };
    output: {
      title: string;
      learnerInstructions: string;
      exercises: {
        id: string;
        type:
          | "fill_blank"
          | "rewrite"
          | "translation"
          | "multiple_choice"
          | "short_response"
          | "sentence_build";
        prompt: string;
        choices: string[] | null;
        expectedAnswer: string;
        acceptedAnswers: string[];
        explanation: string;
        targetSkillIds: string[];
        categories: LanguageCorrectionCategory[];
        difficulty: "on_level" | "stretch";
      }[];
    };
  };
  "languages.conversation": {
    input: {
      languageId: string;
      proficiency: LanguageProficiency;
      scenario: {
        title: string;
        setting: string;
        learnerRole: string;
        partnerRole: string;
        objective: string;
      };
      history: {
        role: "learner" | "partner";
        text: string;
      }[];
      learnerMessage: string;
      targets?: {
        skillIds: string[];
        correctionCategories: LanguageCorrectionCategory[];
        vocabulary: string[];
      };
      supportMode?: "immersion" | "balanced" | "supported";
      correctionMode?: "minimal" | "balanced" | "coach";
      explanationLanguage?: string;
    };
    output: {
      reply: string;
      supportHint: string | null;
      feedback: {
        summary: string | null;
        errors: LanguageCorrectionError[];
        suggestions: {
          original: string;
          suggestion: string;
          reason: string;
        }[];
      };
      turnSignal: {
        difficulty:
          | "comfortable"
          | "productive_struggle"
          | "too_hard"
          | "unclear";
        nextDifficulty: "easier" | "same" | "harder";
        objective: "not_yet" | "progressing" | "appears_achieved";
        rationale: string;
      };
    };
  };
}

export type LanguagesAiCapability = keyof LanguagesAiCapabilityMap;
export type LanguagesAiInput<K extends LanguagesAiCapability> =
  LanguagesAiCapabilityMap[K]["input"];
export type LanguagesAiOutput<K extends LanguagesAiCapability> =
  LanguagesAiCapabilityMap[K]["output"];

export class LanguagesAiError extends Error {
  constructor(
    public readonly code:
      | "AUTH_REQUIRED"
      | "INVALID_REQUEST"
      | "LIMITED"
      | "UNAVAILABLE"
      | "INVALID_RESPONSE"
      | "TIMEOUT",
    message: string,
    public readonly requestId?: string,
  ) {
    super(message);
    this.name = "LanguagesAiError";
  }
}

export interface LanguagesAiClientOptions {
  readonly coreBaseUrl: string;
  readonly getAccessToken: () => string | null | Promise<string | null>;
  readonly fetch?: typeof globalThis.fetch;
  readonly timeoutMs?: number;
}

const routes: Record<LanguagesAiCapability, string> = {
  "languages.correct": "/v1/languages/ai/correct",
  "languages.explain": "/v1/languages/ai/explain",
  "languages.generateExercise": "/v1/languages/ai/exercises",
  "languages.conversation": "/v1/languages/ai/conversation",
};

function origin(value: string): URL {
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

export function createLanguagesAiClient(options: LanguagesAiClientOptions) {
  const base = origin(options.coreBaseUrl);
  const transport = options.fetch ?? globalThis.fetch;
  const timeoutMs = options.timeoutMs ?? 20_000;

  if (typeof transport !== "function") throw new TypeError("fetch required");
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0)
    throw new TypeError("timeoutMs must be positive");

  async function run<K extends LanguagesAiCapability>(
    capability: K,
    input: LanguagesAiInput<K>,
  ): Promise<{
    readonly data: LanguagesAiOutput<K>;
    readonly meta: {
      readonly capability: K;
      readonly version: number;
      readonly model: "gpt-6-luna";
      readonly requestId: string;
    };
  }> {
    const token = await options.getAccessToken();
    if (!token) {
      throw new LanguagesAiError(
        "AUTH_REQUIRED",
        "Sign in to use AI language features.",
      );
    }

    let response: Response;
    try {
      response = await transport(new URL(routes[capability], base), {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ input }),
        credentials: "omit",
        redirect: "error",
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "TimeoutError") {
        throw new LanguagesAiError("TIMEOUT", "AI request timed out.");
      }
      throw new LanguagesAiError("UNAVAILABLE", "AI service is unavailable.");
    }

    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      throw new LanguagesAiError("INVALID_RESPONSE", "AI returned invalid data.");
    }

    if (!response.ok) {
      const row = payload as {
        error?: { code?: string; message?: string; requestId?: string };
      };
      const code = row?.error?.code;
      const requestId = row?.error?.requestId;

      if (response.status === 401)
        throw new LanguagesAiError(
          "AUTH_REQUIRED",
          "Sign in again to use AI language features.",
          requestId,
        );
      if (response.status === 400 || response.status === 413)
        throw new LanguagesAiError(
          "INVALID_REQUEST",
          row?.error?.message ?? "Invalid AI request.",
          requestId,
        );
      if (response.status === 429 || code === "CORE_LANGUAGES_AI_LIMITED")
        throw new LanguagesAiError(
          "LIMITED",
          "AI usage limit reached. Try again later.",
          requestId,
        );

      throw new LanguagesAiError(
        "UNAVAILABLE",
        "AI language features are temporarily unavailable.",
        requestId,
      );
    }

    const row = payload as {
      ok?: unknown;
      data?: {
        capability?: unknown;
        version?: unknown;
        model?: unknown;
        data?: unknown;
      };
      meta?: { requestId?: unknown };
    };

    if (
      row?.ok !== true ||
      row.data?.capability !== capability ||
      typeof row.data?.version !== "number" ||
      row.data?.model !== "gpt-6-luna" ||
      typeof row.meta?.requestId !== "string"
    ) {
      throw new LanguagesAiError(
        "INVALID_RESPONSE",
        "AI response did not match the expected contract.",
      );
    }

    return {
      data: row.data.data as LanguagesAiOutput<K>,
      meta: {
        capability,
        version: row.data.version,
        model: "gpt-6-luna",
        requestId: row.meta.requestId,
      },
    };
  }

  return Object.freeze({
    run,
    correct: (input: LanguagesAiInput<"languages.correct">) =>
      run("languages.correct", input),
    explain: (input: LanguagesAiInput<"languages.explain">) =>
      run("languages.explain", input),
    generateExercise: (
      input: LanguagesAiInput<"languages.generateExercise">,
    ) => run("languages.generateExercise", input),
    conversation: (input: LanguagesAiInput<"languages.conversation">) =>
      run("languages.conversation", input),
  });
}
