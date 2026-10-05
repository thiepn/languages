import type {
  EntityRef,
  SkillDimension,
  StudyEvent,
  SupportLevel
} from "../../domain/src/index.js";
import type { LanguagePackReleaseCandidate } from "../../content-validation/src/index.js";

export type MigrationIssueSeverity = "blocker" | "warning" | "info";
export type MigrationIssueDomain =
  | "content"
  | "coverage"
  | "learner-data"
  | "memory"
  | "provenance"
  | "licensing"
  | "source-drift"
  | "fidelity";

export interface MigrationIssue {
  readonly severity: MigrationIssueSeverity;
  readonly domain: MigrationIssueDomain;
  readonly code: string;
  readonly message: string;
  readonly path?: string;
}

export type MigrationReadinessStatus = "blocked" | "needs_review" | "ready";

export interface MigrationReadiness {
  readonly status: MigrationReadinessStatus;
  readonly blockers: number;
  readonly warnings: number;
  readonly information: number;
  readonly issues: readonly MigrationIssue[];
}

export interface LegacyInventory {
  readonly appId: string;
  readonly languageId: string;
  readonly appVersion?: string;
  readonly repositoryRevision?: string;
  readonly contentVersion?: string;
  readonly fingerprint?: string;
  readonly contentCounts: Readonly<Record<string, number>>;
  readonly coverage: Readonly<Record<string, number>>;
  readonly externalDependencies: readonly string[];
  readonly learnerStores: readonly string[];
  readonly notes: readonly string[];
}

export interface LanguageAdapterOutput {
  readonly inventory: LegacyInventory;
  readonly readiness: MigrationReadiness;
  readonly releaseCandidate?: LanguagePackReleaseCandidate;
}

export interface EventMigrationResult {
  readonly events: readonly StudyEvent[];
  readonly dropped: number;
  readonly readiness: MigrationReadiness;
}

export function finalizeMigrationReadiness(
  issues: readonly MigrationIssue[]
): MigrationReadiness {
  const blockers = issues.filter((issue) => issue.severity === "blocker").length;
  const warnings = issues.filter((issue) => issue.severity === "warning").length;
  const information = issues.filter((issue) => issue.severity === "info").length;

  return {
    status: blockers > 0 ? "blocked" : warnings > 0 ? "needs_review" : "ready",
    blockers,
    warnings,
    information,
    issues
  };
}

export function normalizeFrameworkLevel(value: unknown): string | undefined {
  const text = String(value ?? "").trim();
  if (!text) return undefined;

  const match = text.match(/(?:^|[^A-Za-z0-9])(pre-A1|A1|A2|B1|B2|C1|C2)(?:$|[^A-Za-z0-9])/i)
    ?? text.match(/^(pre-A1|A1|A2|B1|B2|C1|C2)/i);

  if (!match?.[1]) return undefined;
  const raw = match[1];
  return /^pre-/i.test(raw) ? "pre-A1" : raw.toUpperCase();
}

export function expandFrameworkLevels(value: unknown): readonly string[] {
  const text = String(value ?? "");
  const matches = [...text.matchAll(/pre-A1|A1|A2|B1|B2|C1|C2/gi)]
    .map((match) => /^pre-/i.test(match[0]) ? "pre-A1" : match[0].toUpperCase());

  return [...new Set(matches)];
}

export function supportLevelFromHints(hintsUsed: unknown): SupportLevel {
  const hints = finiteNonNegativeInteger(hintsUsed);
  return hints > 0 ? "hinted" : "independent";
}

export function supportLevelFromLegacyCode(value: unknown): SupportLevel {
  const code = finiteNonNegativeInteger(value);
  if (code <= 0) return "independent";
  if (code === 1) return "assisted";
  if (code === 2) return "hinted";
  return "revealed";
}

export function legacyEventId(
  namespace: string,
  ...parts: readonly unknown[]
): string {
  const body = parts
    .map((part) => String(part ?? "").trim())
    .filter(Boolean)
    .join("|")
    .replace(/[^A-Za-z0-9:_|.-]+/g, "_")
    .slice(0, 420);

  return `${namespace}:${body || "event"}`;
}

export function languageEntity(
  languageId: string,
  entity: { readonly kind: string; readonly id: string }
): EntityRef {
  return {
    languageId,
    kind: entity.kind,
    id: entity.id
  };
}

export function languageDimension(value: unknown): SkillDimension | undefined {
  const text = String(value ?? "").trim();
  return text || undefined;
}

export function isoFromLegacyTimestamp(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) {
    const date = new Date(value);
    if (Number.isFinite(date.getTime())) return date.toISOString();
  }

  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) return undefined;

  const date = new Date(numeric);
  if (!Number.isFinite(date.getTime())) return undefined;
  return date.toISOString();
}

export function finiteNonNegativeInteger(value: unknown): number {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) return 0;
  return Math.floor(numeric);
}

export function safeString(value: unknown, maximumLength = 400): string {
  return String(value ?? "").trim().slice(0, maximumLength);
}

export function asRecord(value: unknown): Readonly<Record<string, unknown>> | undefined {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Readonly<Record<string, unknown>>
    : undefined;
}

export function asArray<T = unknown>(value: unknown): readonly T[] {
  return Array.isArray(value) ? value as readonly T[] : [];
}

export function mergeCoverage(
  ...sources: readonly Readonly<Record<string, number>>[]
): Readonly<Record<string, number>> {
  const result: Record<string, number> = {};
  for (const source of sources) {
    for (const [key, value] of Object.entries(source)) {
      if (!Number.isFinite(value) || value < 0) continue;
      result[key] = Math.max(result[key] ?? 0, value);
    }
  }
  return result;
}
