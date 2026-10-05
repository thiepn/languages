import type { SourceRecord } from "../../content-schema/src/index.js";
import {
  validateLanguageDefinition,
  type LanguagePackManifest
} from "../../language-registry/src/index.js";
import {
  validateLearningProfile,
  type LanguageLearningProfile
} from "../../orchestrator/src/index.js";
import {
  validateProficiencyPolicy,
  type ProficiencyPolicy
} from "../../proficiency/src/index.js";
import { validateSkillGraph } from "../../skill-graph/src/index.js";

export type AuditSeverity = "fail" | "warning";
export type AuditCategory =
  | "component"
  | "structure"
  | "reference"
  | "provenance"
  | "licensing"
  | "coverage"
  | "quality";

export interface ContentAuditRecord {
  readonly type: string;
  readonly id: string;
  readonly level?: string;
  readonly sourceIds: readonly string[];
  readonly visibility: "public" | "private";
  readonly derivation: "raw" | "derived";
}

export interface ContentReference {
  readonly fromType: string;
  readonly fromId: string;
  readonly field: string;
  readonly toType: string;
  readonly toId: string;
  readonly required?: boolean;
}

export interface CoverageRequirement {
  readonly key: string;
  readonly minimumCount: number;
  readonly level?: string;
  readonly label?: string;
  readonly promotionCritical: boolean;
  readonly severity: AuditSeverity;
}

export interface QualityMetricRequirement {
  readonly id: string;
  readonly label: string;
  readonly minimum: number;
  readonly severity: AuditSeverity;
}

export interface LanguageQualityPolicy {
  readonly schemaVersion: 1;
  readonly languageId: string;
  readonly additionalCoverageRequirements: readonly CoverageRequirement[];
  readonly qualityMetrics: readonly QualityMetricRequirement[];
}

export interface LanguagePackReleaseCandidate {
  readonly manifest: LanguagePackManifest;
  readonly learningProfile: LanguageLearningProfile;
  readonly proficiencyPolicy: ProficiencyPolicy;
  readonly qualityPolicy: LanguageQualityPolicy;
  readonly sources: readonly SourceRecord[];
  readonly records: readonly ContentAuditRecord[];
  readonly references: readonly ContentReference[];
  readonly coverage: Readonly<Record<string, number>>;
  readonly qualityMetrics: Readonly<Record<string, number>>;
}

export interface AuditIssue {
  readonly severity: AuditSeverity;
  readonly category: AuditCategory;
  readonly code: string;
  readonly message: string;
  readonly level?: string;
  readonly recordKey?: string;
  readonly promotionBlocking?: boolean;
}

export interface LevelCoverageCell {
  readonly key: string;
  readonly minimumCount: number;
  readonly actualCount: number;
  readonly complete: boolean;
  readonly promotionCritical: boolean;
}

export interface LevelCoverageReport {
  readonly level: string;
  readonly readyForPromotionEvidence: boolean;
  readonly cells: readonly LevelCoverageCell[];
}

export type ReleaseCertificationStatus =
  | "blocked"
  | "certified_with_warnings"
  | "certified";

export interface ReleaseCertification {
  readonly languageId: string;
  readonly status: ReleaseCertificationStatus;
  readonly publicReleaseReady: boolean;
  readonly promotionReadyLevels: readonly string[];
  readonly issues: readonly AuditIssue[];
  readonly coverageByLevel: readonly LevelCoverageReport[];
  readonly summary: {
    readonly failures: number;
    readonly warnings: number;
    readonly publicRecords: number;
    readonly privateRecords: number;
    readonly sources: number;
    readonly references: number;
  };
}

export function promotionCoverageRequirements(
  policy: ProficiencyPolicy
): readonly CoverageRequirement[] {
  const byKey = new Map<string, CoverageRequirement>();

  for (const level of policy.levels) {
    for (const gate of level.gates) {
      for (const requirement of gate.coverageRequirements) {
        const mapKey = `${level.level}::${requirement.key}`;
        const existing = byKey.get(mapKey);
        const next: CoverageRequirement = {
          key: requirement.key,
          minimumCount: requirement.minimumCount,
          level: level.level,
          label: `${level.level} · ${gate.label}`,
          promotionCritical: true,
          severity: "warning"
        };
        if (!existing || existing.minimumCount < next.minimumCount) {
          byKey.set(mapKey, next);
        }
      }
    }
  }

  return [...byKey.values()];
}

export function certifyLanguagePack(
  candidate: LanguagePackReleaseCandidate
): ReleaseCertification {
  const languageId = candidate.manifest.definition.id;
  const issues: AuditIssue[] = [];

  auditComponentContracts(candidate, issues);
  auditRecords(candidate, issues);
  auditReferences(candidate, issues);
  auditSources(candidate, issues);
  auditQualityMetrics(candidate, issues);

  const requirements = [
    ...promotionCoverageRequirements(candidate.proficiencyPolicy),
    ...candidate.qualityPolicy.additionalCoverageRequirements
  ];
  const coverageByLevel = auditCoverage(candidate, requirements, issues);

  const failures = issues.filter((issue) => issue.severity === "fail").length;
  const warnings = issues.filter((issue) => issue.severity === "warning").length;
  const status: ReleaseCertificationStatus =
    failures > 0
      ? "blocked"
      : warnings > 0
        ? "certified_with_warnings"
        : "certified";

  const hasGlobalFailure = issues.some(
    (issue) => issue.severity === "fail" && issue.level === undefined
  );
  const promotionReadyLevels = coverageByLevel
    .filter((report) => {
      const levelFailure = issues.some(
        (issue) =>
          issue.severity === "fail" &&
          (issue.level === undefined || issue.level === report.level)
      );
      return !hasGlobalFailure && !levelFailure && report.readyForPromotionEvidence;
    })
    .map((report) => report.level);

  return {
    languageId,
    status,
    publicReleaseReady: failures === 0,
    promotionReadyLevels,
    issues,
    coverageByLevel,
    summary: {
      failures,
      warnings,
      publicRecords: candidate.records.filter((record) => record.visibility === "public").length,
      privateRecords: candidate.records.filter((record) => record.visibility === "private").length,
      sources: candidate.sources.length,
      references: candidate.references.length
    }
  };
}

function auditComponentContracts(
  candidate: LanguagePackReleaseCandidate,
  issues: AuditIssue[]
): void {
  const expected = candidate.manifest.definition.id;
  const identities = [
    ["learning-profile", candidate.learningProfile.languageId],
    ["skill-graph", candidate.learningProfile.graph.languageId],
    ["proficiency-policy", candidate.proficiencyPolicy.languageId],
    ["quality-policy", candidate.qualityPolicy.languageId]
  ] as const;

  for (const [component, actual] of identities) {
    if (actual !== expected) {
      issues.push({
        severity: "fail",
        category: "component",
        code: "language-mismatch",
        message: `${component} declares ${actual}; expected ${expected}`
      });
    }
  }

  for (const issue of validateLanguageDefinition(candidate.manifest.definition)) {
    issues.push({
      severity: issue.severity === "error" ? "fail" : "warning",
      category: "component",
      code: `manifest:${issue.code}`,
      message: issue.message
    });
  }

  for (const issue of validateSkillGraph(candidate.learningProfile.graph)) {
    issues.push({
      severity: issue.severity === "error" ? "fail" : "warning",
      category: "component",
      code: `skill-graph:${issue.code}`,
      message: issue.message
    });
  }

  for (const issue of validateLearningProfile(candidate.learningProfile)) {
    issues.push({
      severity: issue.severity === "error" ? "fail" : "warning",
      category: "component",
      code: `learning-profile:${issue.code}`,
      message: issue.message
    });
  }

  for (const issue of validateProficiencyPolicy(candidate.proficiencyPolicy)) {
    issues.push({
      severity: issue.severity === "error" ? "fail" : "warning",
      category: "component",
      code: `proficiency:${issue.code}`,
      message: issue.message
    });
  }
}

function auditRecords(
  candidate: LanguagePackReleaseCandidate,
  issues: AuditIssue[]
): void {
  if (candidate.records.length === 0) {
    issues.push({
      severity: "fail",
      category: "structure",
      code: "empty-content",
      message: "Release candidate contains no canonical content records"
    });
    return;
  }

  if (!candidate.records.some((record) => record.visibility === "public")) {
    issues.push({
      severity: "fail",
      category: "structure",
      code: "no-public-content",
      message: "Public language-pack release contains no public canonical content"
    });
  }

  const seen = new Set<string>();
  const validLevels = new Set(candidate.proficiencyPolicy.levels.map((level) => level.level));

  for (const record of candidate.records) {
    const key = recordKey(record.type, record.id);
    if (seen.has(key)) {
      issues.push({
        severity: "fail",
        category: "structure",
        code: "duplicate-content-id",
        message: `Duplicate content record: ${key}`,
        ...(record.level ? { level: record.level } : {}),
        recordKey: key
      });
    }
    seen.add(key);

    if (record.level && !validLevels.has(record.level)) {
      issues.push({
        severity: "fail",
        category: "structure",
        code: "invalid-level",
        message: `${key} uses level ${record.level}, which is not declared by the proficiency policy`,
        level: record.level,
        recordKey: key
      });
    }

    if (record.visibility === "public" && record.sourceIds.length === 0) {
      issues.push({
        severity: "fail",
        category: "provenance",
        code: "missing-provenance",
        message: `Public content ${key} has no source provenance`,
        ...(record.level ? { level: record.level } : {}),
        recordKey: key
      });
    }
  }
}

function auditReferences(
  candidate: LanguagePackReleaseCandidate,
  issues: AuditIssue[]
): void {
  const records = new Set(
    candidate.records.map((record) => recordKey(record.type, record.id))
  );

  for (const reference of candidate.references) {
    const from = recordKey(reference.fromType, reference.fromId);
    const to = recordKey(reference.toType, reference.toId);

    if (!records.has(from)) {
      issues.push({
        severity: "fail",
        category: "reference",
        code: "missing-reference-source",
        message: `Reference source ${from} does not exist`,
        recordKey: from
      });
      continue;
    }

    if (!records.has(to)) {
      const sourceRecord = candidate.records.find(
        (record) => recordKey(record.type, record.id) === from
      );
      issues.push({
        severity: reference.required === false ? "warning" : "fail",
        category: "reference",
        code: "broken-reference",
        message: `${from}.${reference.field} points to missing ${to}`,
        ...(sourceRecord?.level ? { level: sourceRecord.level } : {}),
        recordKey: from
      });
    }
  }
}

function auditSources(
  candidate: LanguagePackReleaseCandidate,
  issues: AuditIssue[]
): void {
  const sourceById = new Map<string, SourceRecord>();

  for (const source of candidate.sources) {
    if (sourceById.has(source.id)) {
      issues.push({
        severity: "fail",
        category: "provenance",
        code: "duplicate-source-id",
        message: `Duplicate source record: ${source.id}`
      });
    }
    sourceById.set(source.id, source);
  }

  for (const record of candidate.records) {
    if (record.visibility !== "public") continue;
    const key = recordKey(record.type, record.id);

    for (const sourceId of record.sourceIds) {
      const source = sourceById.get(sourceId);
      if (!source) {
        issues.push({
          severity: "fail",
          category: "provenance",
          code: "unknown-source",
          message: `${key} references unknown source ${sourceId}`,
          ...(record.level ? { level: record.level } : {}),
          recordKey: key
        });
        continue;
      }

      if (source.policy.privateOnly) {
        issues.push({
          severity: "fail",
          category: "licensing",
          code: "private-source-published",
          message: `${key} uses private-only source ${source.id}`,
          ...(record.level ? { level: record.level } : {}),
          recordKey: key
        });
      }

      if (!source.licenseName?.trim()) {
        issues.push({
          severity: "fail",
          category: "licensing",
          code: "missing-license",
          message: `Public source ${source.id} has no explicit license/public-domain declaration`,
          ...(record.level ? { level: record.level } : {}),
          recordKey: key
        });
      }

      const redistributable =
        record.derivation === "raw"
          ? source.policy.canRedistributeRaw
          : source.policy.canRedistributeDerived;

      if (!redistributable) {
        issues.push({
          severity: "fail",
          category: "licensing",
          code: "redistribution-not-permitted",
          message: `${key} cannot be publicly redistributed as ${record.derivation} content under source ${source.id}`,
          ...(record.level ? { level: record.level } : {}),
          recordKey: key
        });
      }

      if (source.policy.requiresAttribution && !source.attribution?.trim()) {
        issues.push({
          severity: "fail",
          category: "licensing",
          code: "missing-attribution",
          message: `Source ${source.id} requires attribution but no attribution text is recorded`,
          ...(record.level ? { level: record.level } : {}),
          recordKey: key
        });
      }
    }
  }
}

function auditQualityMetrics(
  candidate: LanguagePackReleaseCandidate,
  issues: AuditIssue[]
): void {
  for (const requirement of candidate.qualityPolicy.qualityMetrics) {
    const observed = candidate.qualityMetrics[requirement.id];

    if (observed === undefined) {
      issues.push({
        severity: requirement.severity,
        category: "quality",
        code: "missing-quality-metric",
        message: `Quality metric ${requirement.label} was not supplied`
      });
      continue;
    }

    if (!Number.isFinite(observed) || observed < 0 || observed > 1) {
      issues.push({
        severity: "fail",
        category: "quality",
        code: "invalid-quality-metric",
        message: `Quality metric ${requirement.label} must be in [0,1]`
      });
      continue;
    }

    if (observed < requirement.minimum) {
      issues.push({
        severity: requirement.severity,
        category: "quality",
        code: "quality-below-threshold",
        message: `${requirement.label} is ${formatPercent(observed)}; minimum is ${formatPercent(requirement.minimum)}`
      });
    }
  }
}

function auditCoverage(
  candidate: LanguagePackReleaseCandidate,
  requirements: readonly CoverageRequirement[],
  issues: AuditIssue[]
): readonly LevelCoverageReport[] {
  const levels = candidate.proficiencyPolicy.levels.map((level) => level.level);
  const byLevel = new Map<string, LevelCoverageCell[]>(
    levels.map((level) => [level, []])
  );

  for (const requirement of requirements) {
    const actual = candidate.coverage[requirement.key] ?? 0;

    if (!Number.isFinite(actual) || actual < 0) {
      issues.push({
        severity: "fail",
        category: "coverage",
        code: "invalid-coverage-count",
        message: `Coverage ${requirement.key} must be a non-negative finite number`,
        ...(requirement.level ? { level: requirement.level } : {})
      });
      continue;
    }

    const complete = actual >= requirement.minimumCount;
    if (!complete) {
      issues.push({
        severity: requirement.severity,
        category: "coverage",
        code: "coverage-gap",
        message: `${requirement.label ?? requirement.key}: ${actual}/${requirement.minimumCount}`,
        ...(requirement.level ? { level: requirement.level } : {}),
        ...(requirement.promotionCritical ? { promotionBlocking: true } : {})
      });
    }

    if (requirement.level && byLevel.has(requirement.level)) {
      byLevel.get(requirement.level)!.push({
        key: requirement.key,
        minimumCount: requirement.minimumCount,
        actualCount: actual,
        complete,
        promotionCritical: requirement.promotionCritical
      });
    }
  }

  return levels.map((level) => {
    const cells = byLevel.get(level) ?? [];
    return {
      level,
      readyForPromotionEvidence: cells
        .filter((cell) => cell.promotionCritical)
        .every((cell) => cell.complete),
      cells
    };
  });
}

function recordKey(type: string, id: string): string {
  return `${type}:${id}`;
}

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}
