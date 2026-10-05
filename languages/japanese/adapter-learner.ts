import type { StudyEvent } from "../../packages/domain/src/index.js";
import {
  finalizeMigrationReadiness,
  languageDimension,
  languageEntity,
  supportLevelFromHints,
  type EventMigrationResult,
  type MigrationIssue,
  type MigrationReadiness
} from "../../packages/adapter-sdk/src/index.js";
import {
  memoryTraceKey,
  type FsrsMemoryTrace
} from "../../packages/scheduler/src/index.js";
import type {
  JapaneseLegacyMemoryTrace,
  JapaneseLegacyStudyEvent
} from "./adapter-types.js";

export interface MemoryMigrationResult {
  readonly traces: readonly FsrsMemoryTrace[];
  readonly dropped: number;
  readonly readiness: MigrationReadiness;
}

export function adaptJapaneseStudyEvents(
  events: readonly JapaneseLegacyStudyEvent[]
): EventMigrationResult {
  const issues: MigrationIssue[] = [];
  const migrated: StudyEvent[] = [];
  let dropped = 0;

  for (const event of events) {
    if (!event.id || !event.userId || !event.deviceId || !event.occurredAt) {
      dropped++;
      continue;
    }

    const dimension = languageDimension(event.skillDimension);
    migrated.push({
      id: event.id,
      accountId: event.userId,
      deviceId: event.deviceId,
      languageId: "japanese",
      occurredAt: event.occurredAt,
      ...(event.receivedAt ? { receivedAt: event.receivedAt } : {}),
      activity: event.activity,
      ...(event.primaryTarget
        ? { primaryTarget: languageEntity("japanese", event.primaryTarget) }
        : {}),
      ...(event.secondaryTargets
        ? {
            secondaryTargets: event.secondaryTargets.map((target) =>
              languageEntity("japanese", target)
            )
          }
        : {}),
      ...(dimension ? { skillDimension: dimension } : {}),
      ...(event.promptFamily ? { promptFamily: event.promptFamily } : {}),
      ...(event.responseMode ? { responseMode: event.responseMode } : {}),
      ...(event.result ? { result: event.result } : {}),
      supportLevel: supportLevelFromHints(event.hintsUsed),
      ...(event.responseTimeMs !== undefined
        ? { responseTimeMs: event.responseTimeMs }
        : {}),
      ...(event.attempts !== undefined ? { attempts: event.attempts } : {}),
      ...(event.confidence !== undefined
        ? { confidence: event.confidence }
        : {}),
      ...(event.contextId ? { contextId: event.contextId } : {}),
      ...(event.sourceId ? { sourceId: event.sourceId } : {}),
      ...(event.schedulerVersion
        ? { schedulerVersion: event.schedulerVersion }
        : {}),
      ...(event.contentVersion ? { contentVersion: event.contentVersion } : {}),
      ...(event.learnerModelVersion
        ? { learnerModelVersion: event.learnerModelVersion }
        : {}),
      ...(event.baseRevision !== undefined
        ? { baseRevision: event.baseRevision }
        : {}),
      ...(event.metadata ? { metadata: event.metadata } : {})
    });
  }

  if (dropped > 0) {
    issues.push({
      severity: "warning",
      domain: "learner-data",
      code: "japanese-events-dropped",
      message:
        dropped +
        " Japanese StudyEvents were missing required identity/timestamp fields and were not migrated."
    });
  }

  issues.push({
    severity: "info",
    domain: "memory",
    code: "japanese-event-memory-boundary",
    message:
      "Legacy Japanese StudyEvents do not encode explicit memory-review transitions. P6 does not invent memoryReview signals; persisted FSRS traces migrate separately."
  });

  return {
    events: migrated,
    dropped,
    readiness: finalizeMigrationReadiness(issues)
  };
}

export function adaptJapaneseMemoryTraces(
  traces: readonly JapaneseLegacyMemoryTrace[]
): MemoryMigrationResult {
  const issues: MigrationIssue[] = [];
  const migrated: FsrsMemoryTrace[] = [];
  let dropped = 0;

  for (const trace of traces) {
    if (
      trace.schedulerFamily !== "fsrs" ||
      !trace.userId ||
      !trace.entity?.id ||
      !trace.skillDimension ||
      !trace.cueFamily ||
      !trace.card?.due
    ) {
      dropped++;
      continue;
    }

    const entity = languageEntity("japanese", trace.entity);
    const identity = {
      accountId: trace.userId,
      entity,
      dimension: trace.skillDimension,
      cueFamily: trace.cueFamily
    };

    migrated.push({
      id: memoryTraceKey(identity),
      accountId: trace.userId,
      languageId: "japanese",
      entity,
      dimension: trace.skillDimension,
      cueFamily: trace.cueFamily,
      dueAt: trace.card.due,
      ...(trace.card.lastReviewAt
        ? { lastReviewAt: trace.card.lastReviewAt }
        : {}),
      stability: trace.card.stability,
      difficulty: trace.card.difficulty,
      schedulerFamily: "fsrs",
      schedulerVersion: trace.schedulerVersion,
      revision: trace.revision,
      data: trace.card
    });

    if (trace.schedulerVersion !== "ts-fsrs-5.4.2") {
      issues.push({
        severity: "warning",
        domain: "memory",
        code: "japanese-fsrs-version-drift",
        message:
          "Memory trace " +
          trace.id +
          " uses " +
          trace.schedulerVersion +
          "; shared baseline currently uses ts-fsrs-5.4.2."
      });
    }
  }

  if (dropped > 0) {
    issues.push({
      severity: "warning",
      domain: "memory",
      code: "japanese-memory-traces-dropped",
      message:
        dropped +
        " Japanese memory traces were not valid FSRS traces and were not migrated."
    });
  }

  return {
    traces: migrated,
    dropped,
    readiness: finalizeMigrationReadiness(issues)
  };
}
