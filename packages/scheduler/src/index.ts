import { createEmptyCard, fsrs, Rating, type CardInput, type Grade } from "ts-fsrs";
import {
  entityKey,
  type AccountId,
  type EntityRef,
  type MemoryState,
  type ReviewGrade,
  type SkillDimension
} from "../../domain/src/index.js";

export interface MemoryTraceIdentity {
  readonly accountId: AccountId;
  readonly entity: EntityRef;
  readonly dimension: SkillDimension;
  readonly cueFamily: string;
}

export interface MemoryReviewEvidence {
  readonly grade: ReviewGrade;
  readonly reviewedAt: string;
}

export interface MemoryTrace<TData = unknown> extends MemoryState {
  readonly data: TData;
}

export interface MemoryScheduler<TTrace extends MemoryTrace = MemoryTrace> {
  readonly family: string;
  readonly version: string;
  create(identity: MemoryTraceIdentity, now: string): TTrace;
  review(previous: TTrace, evidence: MemoryReviewEvidence): TTrace;
  retrievability(trace: TTrace, at: string): number;
}

export interface FsrsCardSnapshot {
  readonly due: string;
  readonly stability: number;
  readonly difficulty: number;
  readonly elapsedDays: number;
  readonly scheduledDays: number;
  readonly learningSteps: number;
  readonly reps: number;
  readonly lapses: number;
  readonly state: number;
  readonly lastReviewAt?: string;
}

export type FsrsMemoryTrace = MemoryTrace<FsrsCardSnapshot>;

export const FSRS_ADAPTER_VERSION = "ts-fsrs-5.4.2";

export function memoryTraceKey(identity: MemoryTraceIdentity): string {
  return `${identity.accountId}:${entityKey(identity.entity, identity.dimension)}:${identity.cueFamily}`;
}

export function createFsrsScheduler(requestRetention = 0.9): MemoryScheduler<FsrsMemoryTrace> {
  const scheduler = fsrs({ request_retention: requestRetention });

  return {
    family: "fsrs",
    version: FSRS_ADAPTER_VERSION,

    create(identity, now) {
      const card = createEmptyCard(new Date(now));
      return traceFromCard(identity, card, 0);
    },

    review(previous, evidence) {
      const result = scheduler.next(
        toCardInput(previous.data),
        new Date(evidence.reviewedAt),
        toRating(evidence.grade)
      );
      return traceFromCard(previous, result.card, previous.revision + 1);
    },

    retrievability(trace, at) {
      const value = scheduler.get_retrievability(toCardInput(trace.data), new Date(at), false);
      return clamp01(Number(value));
    }
  };
}

function traceFromCard(
  identity: MemoryTraceIdentity | FsrsMemoryTrace,
  card: {
    due: Date;
    stability: number;
    difficulty: number;
    elapsed_days: number;
    scheduled_days: number;
    learning_steps: number;
    reps: number;
    lapses: number;
    state: number;
    last_review?: Date;
  },
  revision: number
): FsrsMemoryTrace {
  const data = snapshot(card);
  return {
    id: memoryTraceKey(identity),
    accountId: identity.accountId,
    languageId: identity.entity.languageId,
    entity: identity.entity,
    dimension: identity.dimension,
    cueFamily: identity.cueFamily,
    dueAt: data.due,
    ...(data.lastReviewAt ? { lastReviewAt: data.lastReviewAt } : {}),
    stability: data.stability,
    difficulty: data.difficulty,
    schedulerFamily: "fsrs",
    schedulerVersion: FSRS_ADAPTER_VERSION,
    revision,
    data
  };
}

function toRating(grade: ReviewGrade): Grade {
  switch (grade) {
    case "again":
      return Rating.Again as Grade;
    case "hard":
      return Rating.Hard as Grade;
    case "good":
      return Rating.Good as Grade;
    case "easy":
      return Rating.Easy as Grade;
  }
}

function toCardInput(card: FsrsCardSnapshot): CardInput {
  return {
    due: card.due,
    stability: card.stability,
    difficulty: card.difficulty,
    elapsed_days: card.elapsedDays,
    scheduled_days: card.scheduledDays,
    learning_steps: card.learningSteps,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state as CardInput["state"],
    last_review: card.lastReviewAt ?? null
  };
}

function snapshot(card: {
  due: Date;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  learning_steps: number;
  reps: number;
  lapses: number;
  state: number;
  last_review?: Date;
}): FsrsCardSnapshot {
  const base = {
    due: card.due.toISOString(),
    stability: card.stability,
    difficulty: card.difficulty,
    elapsedDays: card.elapsed_days,
    scheduledDays: card.scheduled_days,
    learningSteps: card.learning_steps,
    reps: card.reps,
    lapses: card.lapses,
    state: Number(card.state)
  };
  return card.last_review ? { ...base, lastReviewAt: card.last_review.toISOString() } : base;
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}
