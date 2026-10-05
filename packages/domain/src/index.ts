export type LanguageId = string;
export type AccountId = string;
export type DeviceId = string;

export type CoreEntityKind =
  | "lexeme"
  | "sense"
  | "grammar"
  | "sentence"
  | "lexical_chunk"
  | "writing_unit"
  | "text"
  | "document"
  | "production_task"
  | "can_do"
  | "curriculum_unit";

export type EntityKind = CoreEntityKind | (string & {});

export interface EntityRef {
  readonly languageId: LanguageId;
  readonly kind: EntityKind;
  readonly id: string;
}

export type CoreSkillDimension =
  | "meaning_recognition"
  | "meaning_recall"
  | "form_recall"
  | "reading"
  | "listening"
  | "spoken_production"
  | "spoken_interaction"
  | "writing"
  | "pronunciation"
  | "orthography"
  | "grammar_recognition"
  | "grammar_production"
  | "comprehension"
  | "fluency";

export type SkillDimension = CoreSkillDimension | (string & {});

export type ActivityType =
  | "lesson"
  | "review"
  | "reading"
  | "listening"
  | "speaking"
  | "writing"
  | "assessment"
  | "lookup"
  | "mining"
  | "mission";

export type StudyResult = "correct" | "partial" | "incorrect" | "revealed" | "skipped";
export type SupportLevel = "independent" | "assisted" | "hinted" | "revealed";
export type ReviewGrade = "again" | "hard" | "good" | "easy";

export interface MemoryReviewSignal {
  readonly cueFamily: string;
  readonly grade: ReviewGrade;
}

export interface StudyEvent {
  readonly id: string;
  readonly accountId: AccountId;
  readonly deviceId: DeviceId;
  readonly languageId: LanguageId;
  readonly occurredAt: string;
  readonly receivedAt?: string;
  readonly activity: ActivityType;
  readonly primaryTarget?: EntityRef;
  readonly secondaryTargets?: readonly EntityRef[];
  readonly skillDimension?: SkillDimension;
  readonly promptFamily?: string;
  readonly responseMode?: string;
  readonly result?: StudyResult;
  readonly supportLevel?: SupportLevel;
  readonly responseTimeMs?: number;
  readonly attempts?: number;
  readonly confidence?: number;
  readonly contextId?: string;
  readonly sourceId?: string;
  readonly memoryReview?: MemoryReviewSignal;
  readonly schedulerVersion?: string;
  readonly contentVersion?: string;
  readonly learnerModelVersion?: string;
  readonly baseRevision?: number;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface MasteryProjection {
  readonly accountId: AccountId;
  readonly languageId: LanguageId;
  readonly entity: EntityRef;
  readonly dimension: SkillDimension;
  readonly estimate: number;
  readonly confidence: number;
  readonly evidenceCount: number;
  readonly independentSuccesses: number;
  readonly supportedSuccesses: number;
  readonly failures: number;
  readonly delayedSuccesses7d: number;
  readonly delayedFailures7d: number;
  readonly lapses: number;
  readonly distinctEvidenceDays: number;
  readonly firstEvidenceAt?: string;
  readonly lastEvidenceAt?: string;
  readonly modelVersion: string;
}

export interface MemoryState {
  readonly id: string;
  readonly accountId: AccountId;
  readonly languageId: LanguageId;
  readonly entity: EntityRef;
  readonly dimension: SkillDimension;
  readonly cueFamily: string;
  readonly dueAt: string;
  readonly lastReviewAt?: string;
  readonly stability?: number;
  readonly difficulty?: number;
  readonly retrievability?: number;
  readonly schedulerFamily: string;
  readonly schedulerVersion: string;
  readonly revision: number;
}

export type CefrLevel = "pre-A1" | "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface ProficiencyEvidence {
  readonly frameworkId: string;
  readonly level: string;
  readonly languageId: LanguageId;
  readonly dimensions: Readonly<Record<string, number>>;
  readonly confidence: number;
  readonly assessedAt: string;
  readonly claimType: "internal" | "external_exam" | "self_report";
}

export interface LanguageEnrollment {
  readonly accountId: AccountId;
  readonly languageId: LanguageId;
  readonly status: "active" | "paused" | "archived";
  readonly startedAt: string;
  readonly primaryGoal?: string;
  readonly targetFrameworkId?: string;
  readonly targetLevel?: string;
}

export type LongitudinalMasteryState =
  | "unseen"
  | "seen"
  | "learned"
  | "retrievable"
  | "usable"
  | "durable";

export interface RetentionForecast {
  readonly oneDay: number;
  readonly sevenDay: number;
  readonly thirtyDay: number;
  readonly ninetyDay: number;
}

export interface EntityMasterySummary {
  readonly accountId: AccountId;
  readonly entity: EntityRef;
  readonly state: LongitudinalMasteryState;
  readonly confidence: number;
  readonly dimensions: readonly MasteryProjection[];
  readonly weakestDimension?: SkillDimension;
  readonly retention?: RetentionForecast;
  readonly fragile: boolean;
  readonly evidenceSpanDays: number;
  readonly delayedSuccesses7d: number;
  readonly delayedFailures7d: number;
  readonly lapses: number;
}

export function entityKey(entity: EntityRef, dimension?: SkillDimension): string {
  const base = `${entity.languageId}:${entity.kind}:${entity.id}`;
  return dimension ? `${base}:${dimension}` : base;
}

export function assertEventLanguageConsistency(event: StudyEvent): void {
  const targets = [event.primaryTarget, ...(event.secondaryTargets ?? [])].filter(
    (target): target is EntityRef => target !== undefined
  );
  for (const target of targets) {
    if (target.languageId !== event.languageId) {
      throw new Error(
        `StudyEvent ${event.id} targets ${target.languageId} content while event language is ${event.languageId}`
      );
    }
  }
}
