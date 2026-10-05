import {
  assertEventLanguageConsistency,
  entityKey,
  type AccountId,
  type EntityMasterySummary,
  type EntityRef,
  type LongitudinalMasteryState,
  type MasteryProjection,
  type RetentionForecast,
  type SkillDimension,
  type StudyEvent,
  type SupportLevel
} from "../../domain/src/index.js";
import {
  memoryTraceKey,
  type MemoryScheduler,
  type MemoryTrace,
  type MemoryTraceIdentity
} from "../../scheduler/src/index.js";

export const LEARNER_MODEL_VERSION = "language-core-p2.0";

const DAY_MS = 86_400_000;
const PRIOR_WEIGHT = 1.25;
const PRIOR_SCORE = 0.25;

const PRODUCTIVE_DIMENSIONS = new Set<string>([
  "meaning_recall",
  "form_recall",
  "spoken_production",
  "spoken_interaction",
  "writing",
  "grammar_production",
  "fluency"
]);

export interface EvidenceAggregate {
  readonly scoreTotal: number;
  readonly weightTotal: number;
  readonly evidenceCount: number;
  readonly independentSuccesses: number;
  readonly supportedSuccesses: number;
  readonly failures: number;
  readonly delayedSuccesses7d: number;
  readonly delayedFailures7d: number;
  readonly lapses: number;
  readonly evidenceDays: readonly string[];
  readonly firstEvidenceAt?: string;
  readonly lastEvidenceAt?: string;
  readonly lastRetrievalAt?: string;
}

export interface ForgettingCalibrationState {
  readonly samples: number;
  readonly predictedTotal: number;
  readonly observedTotal: number;
  readonly correction: number;
}

export interface LearnerState<TTrace extends MemoryTrace = MemoryTrace> {
  readonly accountId?: AccountId;
  readonly mastery: Readonly<Record<string, MasteryProjection>>;
  readonly evidence: Readonly<Record<string, EvidenceAggregate>>;
  readonly memory: Readonly<Record<string, TTrace>>;
  readonly calibrationByLanguage: Readonly<Record<string, ForgettingCalibrationState>>;
  readonly eventCount: number;
  readonly lastEventAt?: string;
}

export interface LongitudinalClassificationInput {
  readonly hasEvidence: boolean;
  readonly learned: boolean;
  readonly retrievable: boolean;
  readonly usable: boolean;
  readonly confidence: number;
  readonly retention7?: number;
  readonly retention30?: number;
  readonly delayedSuccesses7d: number;
  readonly delayedFailures7d: number;
  readonly evidenceSpanDays: number;
  readonly lapses: number;
}

export interface LongitudinalClassification {
  readonly state: LongitudinalMasteryState;
  readonly fragile: boolean;
}

export function createInitialLearnerState<TTrace extends MemoryTrace>(): LearnerState<TTrace> {
  return {
    mastery: {},
    evidence: {},
    memory: {},
    calibrationByLanguage: {},
    eventCount: 0
  };
}

export function replayStudyEvents<TTrace extends MemoryTrace>(
  events: readonly StudyEvent[],
  scheduler: MemoryScheduler<TTrace>
): LearnerState<TTrace> {
  const ordered = [...events].sort(
    (a, b) => a.occurredAt.localeCompare(b.occurredAt) || a.id.localeCompare(b.id)
  );

  return ordered.reduce<LearnerState<TTrace>>(
    (state, event) => reduceStudyEvent(state, event, scheduler),
    createInitialLearnerState<TTrace>()
  );
}

export function reduceStudyEvent<TTrace extends MemoryTrace>(
  state: LearnerState<TTrace>,
  event: StudyEvent,
  scheduler: MemoryScheduler<TTrace>
): LearnerState<TTrace> {
  assertEventLanguageConsistency(event);

  if (state.accountId && state.accountId !== event.accountId) {
    throw new Error(
      `LearnerState belongs to account ${state.accountId}; cannot replay event for ${event.accountId}`
    );
  }

  let mastery = state.mastery;
  let evidence = state.evidence;
  let memory = state.memory;
  let calibrationByLanguage = state.calibrationByLanguage;

  if (event.primaryTarget && event.skillDimension) {
    const updated = applyMasteryEvidence(state, event);
    mastery = updated.mastery;
    evidence = updated.evidence;

    if (event.memoryReview) {
      const identity: MemoryTraceIdentity = {
        accountId: event.accountId,
        entity: event.primaryTarget,
        dimension: event.skillDimension,
        cueFamily: event.memoryReview.cueFamily
      };
      const key = memoryTraceKey(identity);
      const previous = state.memory[key];

      if (previous) {
        calibrationByLanguage = addCalibrationObservation(
          calibrationByLanguage,
          event.languageId,
          previous,
          event,
          scheduler
        );
      }

      const base = previous ?? scheduler.create(identity, event.occurredAt);
      const next = scheduler.review(base, {
        grade: event.memoryReview.grade,
        reviewedAt: event.occurredAt
      });

      memory = { ...state.memory, [key]: next };
    }
  }

  return {
    accountId: state.accountId ?? event.accountId,
    mastery,
    evidence,
    memory,
    calibrationByLanguage,
    eventCount: state.eventCount + 1,
    lastEventAt: event.occurredAt
  };
}

function applyMasteryEvidence<TTrace extends MemoryTrace>(
  state: LearnerState<TTrace>,
  event: StudyEvent
): Pick<LearnerState<TTrace>, "mastery" | "evidence"> {
  if (!event.primaryTarget || !event.skillDimension) {
    return { mastery: state.mastery, evidence: state.evidence };
  }

  const observation = masteryObservation(event);
  if (!observation) {
    return { mastery: state.mastery, evidence: state.evidence };
  }

  const key = entityKey(event.primaryTarget, event.skillDimension);
  const previousAggregate = state.evidence[key] ?? emptyAggregate();
  const previousProjection = state.mastery[key];
  const retrievalGapDays = previousAggregate.lastRetrievalAt
    ? daysBetween(previousAggregate.lastRetrievalAt, event.occurredAt)
    : 0;

  const independentSuccess = event.result === "correct" && normalizedSupport(event) === "independent";
  const supportedSuccess = event.result === "correct" && normalizedSupport(event) !== "independent";
  const failure = event.result === "incorrect" || event.result === "revealed";
  const delayed = retrievalGapDays >= 7 && isRetrievalAttempt(event);
  const evidenceDay = event.occurredAt.slice(0, 10);
  const evidenceDays = previousAggregate.evidenceDays.includes(evidenceDay)
    ? previousAggregate.evidenceDays
    : [...previousAggregate.evidenceDays, evidenceDay];

  const aggregate: EvidenceAggregate = {
    scoreTotal: previousAggregate.scoreTotal + observation.quality * observation.weight,
    weightTotal: previousAggregate.weightTotal + observation.weight,
    evidenceCount: previousAggregate.evidenceCount + 1,
    independentSuccesses: previousAggregate.independentSuccesses + (independentSuccess ? 1 : 0),
    supportedSuccesses: previousAggregate.supportedSuccesses + (supportedSuccess ? 1 : 0),
    failures: previousAggregate.failures + (failure ? 1 : 0),
    delayedSuccesses7d:
      previousAggregate.delayedSuccesses7d + (delayed && independentSuccess ? 1 : 0),
    delayedFailures7d:
      previousAggregate.delayedFailures7d + (delayed && failure ? 1 : 0),
    lapses:
      previousAggregate.lapses +
      (event.result === "incorrect" && (previousProjection?.estimate ?? 0) >= 0.6 ? 1 : 0),
    evidenceDays,
    firstEvidenceAt: previousAggregate.firstEvidenceAt ?? event.occurredAt,
    lastEvidenceAt: event.occurredAt,
    ...(isRetrievalAttempt(event) ? { lastRetrievalAt: event.occurredAt } : previousAggregate.lastRetrievalAt
      ? { lastRetrievalAt: previousAggregate.lastRetrievalAt }
      : {})
  };

  const estimate = clamp01(
    (PRIOR_WEIGHT * PRIOR_SCORE + aggregate.scoreTotal) /
      (PRIOR_WEIGHT + aggregate.weightTotal)
  );
  const confidence = evidenceConfidence(aggregate);

  const projection: MasteryProjection = {
    accountId: event.accountId,
    languageId: event.languageId,
    entity: event.primaryTarget,
    dimension: event.skillDimension,
    estimate,
    confidence,
    evidenceCount: aggregate.evidenceCount,
    independentSuccesses: aggregate.independentSuccesses,
    supportedSuccesses: aggregate.supportedSuccesses,
    failures: aggregate.failures,
    delayedSuccesses7d: aggregate.delayedSuccesses7d,
    delayedFailures7d: aggregate.delayedFailures7d,
    lapses: aggregate.lapses,
    distinctEvidenceDays: aggregate.evidenceDays.length,
    ...(aggregate.firstEvidenceAt ? { firstEvidenceAt: aggregate.firstEvidenceAt } : {}),
    ...(aggregate.lastEvidenceAt ? { lastEvidenceAt: aggregate.lastEvidenceAt } : {}),
    modelVersion: LEARNER_MODEL_VERSION
  };

  return {
    mastery: { ...state.mastery, [key]: projection },
    evidence: { ...state.evidence, [key]: aggregate }
  };
}

function masteryObservation(event: StudyEvent): { quality: number; weight: number } | undefined {
  if (!event.result || event.result === "skipped") return undefined;

  const activityWeight = activityEvidenceWeight(event.activity);
  if (activityWeight <= 0) return undefined;

  const support = normalizedSupport(event);
  const supportWeight: Record<SupportLevel, number> = {
    independent: 1,
    assisted: 0.75,
    hinted: 0.45,
    revealed: 0.2
  };

  const resultQuality = {
    correct: 1,
    partial: 0.5,
    incorrect: 0,
    revealed: 0,
    skipped: 0
  }[event.result];

  return {
    quality: resultQuality,
    weight: activityWeight * supportWeight[support]
  };
}

function normalizedSupport(event: StudyEvent): SupportLevel {
  if (event.supportLevel) return event.supportLevel;
  if (event.result === "revealed") return "revealed";
  return "independent";
}

function activityEvidenceWeight(activity: StudyEvent["activity"]): number {
  switch (activity) {
    case "review":
    case "assessment":
    case "mission":
      return 1;
    case "reading":
    case "listening":
    case "speaking":
    case "writing":
      return 0.9;
    case "lesson":
      return 0.7;
    case "mining":
    case "lookup":
      return 0;
  }
}

function isRetrievalAttempt(event: StudyEvent): boolean {
  return (
    event.result !== undefined &&
    event.result !== "skipped" &&
    event.activity !== "lookup" &&
    event.activity !== "mining" &&
    event.activity !== "lesson"
  );
}

function emptyAggregate(): EvidenceAggregate {
  return {
    scoreTotal: 0,
    weightTotal: 0,
    evidenceCount: 0,
    independentSuccesses: 0,
    supportedSuccesses: 0,
    failures: 0,
    delayedSuccesses7d: 0,
    delayedFailures7d: 0,
    lapses: 0,
    evidenceDays: []
  };
}

function evidenceConfidence(aggregate: EvidenceAggregate): number {
  const countTerm = 1 - Math.exp(-aggregate.weightTotal / 4);
  const dayTerm = Math.min(1, aggregate.evidenceDays.length / 6);
  const spanTerm =
    aggregate.firstEvidenceAt && aggregate.lastEvidenceAt
      ? Math.min(1, daysBetween(aggregate.firstEvidenceAt, aggregate.lastEvidenceAt) / 30)
      : 0;

  return clamp01(0.08 + 0.55 * countTerm + 0.22 * dayTerm + 0.15 * spanTerm);
}

function addCalibrationObservation<TTrace extends MemoryTrace>(
  calibrationByLanguage: Readonly<Record<string, ForgettingCalibrationState>>,
  languageId: string,
  previous: TTrace,
  event: StudyEvent,
  scheduler: MemoryScheduler<TTrace>
): Readonly<Record<string, ForgettingCalibrationState>> {
  if (!previous.lastReviewAt) return calibrationByLanguage;
  if (daysBetween(previous.lastReviewAt, event.occurredAt) < 1) return calibrationByLanguage;

  const predicted = scheduler.retrievability(previous, event.occurredAt);
  const observed = event.memoryReview?.grade === "again" ? 0 : 1;
  const current = calibrationByLanguage[languageId] ?? {
    samples: 0,
    predictedTotal: 0,
    observedTotal: 0,
    correction: 0
  };

  const samples = current.samples + 1;
  const predictedTotal = current.predictedTotal + predicted;
  const observedTotal = current.observedTotal + observed;

  const next: ForgettingCalibrationState = {
    samples,
    predictedTotal,
    observedTotal,
    correction: calibrationCorrection(samples, predictedTotal, observedTotal)
  };

  return { ...calibrationByLanguage, [languageId]: next };
}

export function calibrationCorrection(
  samples: number,
  predictedTotal: number,
  observedTotal: number
): number {
  if (samples < 12) return 0;
  const predictedMean = predictedTotal / samples;
  const observedMean = observedTotal / samples;
  return clamp(observedMean - predictedMean, -0.08 / 0.45, 0.08 / 0.45) * 0.45;
}

export function summarizeEntityMastery<TTrace extends MemoryTrace>(
  state: LearnerState<TTrace>,
  entity: EntityRef,
  scheduler: MemoryScheduler<TTrace>,
  now: string
): EntityMasterySummary {
  if (!state.accountId) {
    throw new Error("Cannot summarize an empty learner state");
  }

  const dimensions = Object.values(state.mastery).filter((projection) =>
    sameEntity(projection.entity, entity)
  );

  const retention = retentionForecastForEntity(state, entity, scheduler, now);
  const confidence = weightedConfidence(dimensions);
  const evidenceCount = dimensions.reduce((sum, projection) => sum + projection.evidenceCount, 0);
  const maxEstimate = dimensions.reduce((max, projection) => Math.max(max, projection.estimate), 0);
  const retrievable = dimensions.some(
    (projection) =>
      projection.estimate >= 0.6 &&
      projection.confidence >= 0.25 &&
      projection.independentSuccesses >= 1
  );
  const usable = dimensions.some(
    (projection) =>
      PRODUCTIVE_DIMENSIONS.has(projection.dimension) &&
      projection.estimate >= 0.6 &&
      projection.confidence >= 0.25 &&
      projection.independentSuccesses >= 2
  );

  const delayedSuccesses7d = dimensions.reduce(
    (sum, projection) => sum + projection.delayedSuccesses7d,
    0
  );
  const delayedFailures7d = dimensions.reduce(
    (sum, projection) => sum + projection.delayedFailures7d,
    0
  );
  const lapses = dimensions.reduce((sum, projection) => sum + projection.lapses, 0);
  const firstEvidenceAt = earliest(
    dimensions.flatMap((projection) => (projection.firstEvidenceAt ? [projection.firstEvidenceAt] : []))
  );
  const lastEvidenceAt = latest(
    dimensions.flatMap((projection) => (projection.lastEvidenceAt ? [projection.lastEvidenceAt] : []))
  );
  const evidenceSpanDays =
    firstEvidenceAt && lastEvidenceAt ? daysBetween(firstEvidenceAt, lastEvidenceAt) : 0;

  const classification = classifyLongitudinalMastery({
    hasEvidence: evidenceCount > 0,
    learned: evidenceCount >= 2 && maxEstimate >= 0.45,
    retrievable,
    usable,
    confidence,
    ...(retention ? { retention7: retention.sevenDay, retention30: retention.thirtyDay } : {}),
    delayedSuccesses7d,
    delayedFailures7d,
    evidenceSpanDays,
    lapses
  });

  const weakest = [...dimensions].sort((a, b) => a.estimate - b.estimate)[0];

  return {
    accountId: state.accountId,
    entity,
    state: classification.state,
    confidence,
    dimensions,
    ...(weakest ? { weakestDimension: weakest.dimension } : {}),
    ...(retention ? { retention } : {}),
    fragile: classification.fragile,
    evidenceSpanDays,
    delayedSuccesses7d,
    delayedFailures7d,
    lapses
  };
}

export function classifyLongitudinalMastery(
  input: LongitudinalClassificationInput
): LongitudinalClassification {
  const durable =
    input.usable &&
    (input.retention30 ?? 0) >= 0.62 &&
    input.delayedSuccesses7d >= 2 &&
    input.evidenceSpanDays >= 21 &&
    input.confidence >= 0.42;

  let state: LongitudinalMasteryState = "unseen";
  if (input.hasEvidence) state = "seen";
  if (input.learned) state = "learned";
  if (input.retrievable) state = "retrievable";
  if (input.usable) state = "usable";
  if (durable) state = "durable";

  const fragile =
    input.learned &&
    (((input.retention7 ?? 0) >= 0.7 && (input.retention30 ?? 0) < 0.62) ||
      input.delayedFailures7d >= 2 ||
      input.lapses >= 3);

  return { state, fragile };
}

export function retentionForecastForEntity<TTrace extends MemoryTrace>(
  state: LearnerState<TTrace>,
  entity: EntityRef,
  scheduler: MemoryScheduler<TTrace>,
  now: string
): RetentionForecast | undefined {
  const traces = Object.values(state.memory).filter((trace) => sameEntity(trace.entity, entity));
  if (traces.length === 0) return undefined;

  const correction = state.calibrationByLanguage[entity.languageId]?.correction ?? 0;
  const forecastAt = (days: number): number => {
    const at = new Date(new Date(now).getTime() + days * DAY_MS).toISOString();
    const average =
      traces.reduce((sum, trace) => sum + scheduler.retrievability(trace, at), 0) / traces.length;
    return clamp01(average + correction);
  };

  const oneDay = forecastAt(1);
  const sevenDay = Math.min(oneDay, forecastAt(7));
  const thirtyDay = Math.min(sevenDay, forecastAt(30));
  const ninetyDay = Math.min(thirtyDay, forecastAt(90));

  return { oneDay, sevenDay, thirtyDay, ninetyDay };
}

function weightedConfidence(dimensions: readonly MasteryProjection[]): number {
  if (dimensions.length === 0) return 0;
  const totalEvidence = dimensions.reduce(
    (sum, projection) => sum + Math.max(1, projection.evidenceCount),
    0
  );
  return clamp01(
    dimensions.reduce(
      (sum, projection) =>
        sum + projection.confidence * Math.max(1, projection.evidenceCount),
      0
    ) / totalEvidence
  );
}

function sameEntity(a: EntityRef, b: EntityRef): boolean {
  return a.languageId === b.languageId && a.kind === b.kind && a.id === b.id;
}

function earliest(values: readonly string[]): string | undefined {
  return [...values].sort()[0];
}

function latest(values: readonly string[]): string | undefined {
  return [...values].sort().at(-1);
}

function daysBetween(a: string, b: string): number {
  return Math.max(0, (new Date(b).getTime() - new Date(a).getTime()) / DAY_MS);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return clamp(value, 0, 1);
}
