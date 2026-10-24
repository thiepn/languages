import type {
  AnswerNormalizationV1,
  ExerciseV1,
  LessonBundleV1,
  LessonStepV1
} from "../../../packages/content-schema/src/lesson-v1.js";

export interface LearningFrame {
  readonly id: string;
  readonly stage: LessonStepV1["type"];
  readonly type: "teaching" | "exercise";
  readonly step?: LessonStepV1;
  readonly exercise?: ExerciseV1;
}

export type AnswerResult =
  | {readonly kind: "correct"; readonly explanation: string}
  | {readonly kind: "incorrect"; readonly explanation: string}
  | {readonly kind: "revealed"; readonly explanation: string; readonly expected: readonly string[]}
  | {readonly kind: "ungraded"; readonly explanation: string; readonly rubric: readonly string[]};

export function framesFor(bundle: LessonBundleV1): readonly LearningFrame[] {
  const exercises = new Map(bundle.exercises.map(exercise => [exercise.id, exercise]));
  const frames: LearningFrame[] = [];
  for (const step of bundle.lesson.steps) {
    if (step.type === "guided" || step.type === "independent") {
      for (const id of step.exerciseIds) {
        const exercise = exercises.get(id);
        if (!exercise) throw new Error("Unresolved exercise source: " + id);
        frames.push({id: exercise.id, stage: step.type, type:"exercise", exercise});
      }
    } else {
      frames.push({id: step.id, stage:step.type, type:"teaching", step});
    }
  }
  return frames;
}

/** Exact-only demo grading; do not interpret this as a scheduler or CEFR/HSK/JLPT grade. */
export function normalizeAnswer(value: string, policy: AnswerNormalizationV1): string {
  if (policy === "unicode-nfc") return value.normalize("NFC");
  if (policy === "trim-whitespace") return value.trim().replace(/\s+/gu, " ");
  if (policy === "french-apostrophe") return value.normalize("NFC").trim().replace(/\s+/gu," ").replace(/[\u2018\u2019]/gu,"'");
  if (policy === "japanese-terminal-punctuation") return value.normalize("NFC").trim().replace(/\s*。$/u,"");
  if (policy === "pinyin-tone-marked") return value.normalize("NFC").trim().replace(/\s+/gu," ");
  return value;
}

export function evaluateExercise(exercise: ExerciseV1, rawAnswer: string): AnswerResult {
  if (exercise.kind === "free-production") {
    return {kind:"ungraded",explanation:exercise.explanation,rubric:exercise.rubric};
  }
  const answer = normalizeAnswer(rawAnswer, exercise.normalization);
  const correct = exercise.acceptedAnswers.some(expected => normalizeAnswer(expected, exercise.normalization) === answer);
  if(correct)return {kind:"correct",explanation:exercise.explanation};
  const correction=exercise.misconceptions?.find(item=>
    normalizeAnswer(item.answer,exercise.normalization)===answer);
  return {kind:"incorrect",explanation:correction?.feedback??exercise.explanation};
}

/** A comma-separated list of original token indices is the only ordering draft representation. */
export function parseOrderingDraft(value:string,tokenCount:number):number[] {
  if(!value)return [];
  const parts=value.split(",");
  if(parts.length>tokenCount||parts.some(p=>! /^(0|[1-9][0-9]*)$/.test(p)))return [];
  const indices=parts.map(Number);
  return indices.every(i=>i<tokenCount)&&new Set(indices).size===indices.length?indices:[];
}

/** Readable reveal, not opaque zero-based index IDs. */
export function revealExercise(exercise: ExerciseV1):AnswerResult {
  if(exercise.kind==="free-production")return evaluateExercise(exercise,"");
  const expected=exercise.kind==="ordering"
    ?exercise.acceptedAnswers.map(key=>key.split(",").map(i=>exercise.tokens[Number(i)]).join(" "))
    :exercise.acceptedAnswers;
  return {kind:"revealed",explanation:exercise.explanation,expected};
}

export function canContinueAfterAnswer(result:AnswerResult|undefined):boolean {
  return result!==undefined&&result.kind!=="incorrect";
}

export interface DemoCheckpoint {
  readonly version: 1;
  readonly positions: Readonly<Record<string, number>>;
}
export const DEMO_CHECKPOINT_KEY = "thiepn-languages-phase03-preview-v1";
/** Records only fixed fixture IDs and frame indices. No answers, account IDs, grade or learner evidence. */
export function parseDemoCheckpoint(input: string | null, bundles: readonly LessonBundleV1[]): Record<string, number> {
  const allowed = new Map(bundles.map(bundle => [bundle.lesson.id + "@" + bundle.lesson.contentVersion, framesFor(bundle).length]));
  const clean: Record<string, number> = {};
  if (!input || input.length > 2048) return clean;
  try {
    const raw: unknown = JSON.parse(input);
    if (!raw || typeof raw !== "object" || !("version" in raw) || raw.version !== 1 ||
        !("positions" in raw) || !raw.positions || typeof raw.positions !== "object" || Array.isArray(raw.positions)) return clean;
    for (const [key, index] of Object.entries(raw.positions)) {
      const max = allowed.get(key);
      if (max !== undefined && typeof index === "number" && Number.isSafeInteger(index) && index >= 0 && index <= max) clean[key] = index;
    }
    return clean;
  } catch {
    return clean;
  }
}
export function serializeDemoCheckpoint(positions: Readonly<Record<string, number>>, bundles: readonly LessonBundleV1[]): string {
  const cleaned = parseDemoCheckpoint(JSON.stringify({version:1,positions}),bundles);
  return JSON.stringify({version:1,positions:cleaned} satisfies DemoCheckpoint);
}
export function checkpointId(bundle:LessonBundleV1):string {
  return bundle.lesson.id + "@" + bundle.lesson.contentVersion;
}
