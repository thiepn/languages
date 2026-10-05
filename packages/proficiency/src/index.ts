import type { AccountId } from "../../domain/src/index.js";

export type AssessmentSource =
  | "internal_task"
  | "internal_checkpoint"
  | "external_exam"
  | "self_report";

export type FrameworkCompetence =
  | "lexical"
  | "grammar"
  | "reading"
  | "listening"
  | "spoken_production"
  | "spoken_interaction"
  | "writing"
  | "mediation"
  | "functional";

export interface AssessmentEvidence {
  readonly id: string;
  readonly accountId: AccountId;
  readonly languageId: string;
  readonly frameworkId: string;
  readonly level: string;
  readonly gateId: string;
  readonly score: number;
  readonly confidence: number;
  readonly evidenceCount: number;
  readonly independentEvidenceCount: number;
  readonly coverageKeys: readonly string[];
  readonly assessedAt: string;
  readonly source: AssessmentSource;
}

export interface CoverageRequirement {
  readonly key: string;
  readonly minimumCount: number;
}

export interface PromotionGateDefinition {
  readonly id: string;
  readonly label: string;
  readonly competence: FrameworkCompetence;
  readonly scoreThreshold: number;
  readonly confidenceThreshold: number;
  readonly minimumEvidenceCount: number;
  readonly minimumIndependentEvidenceCount?: number;
  readonly coverageRequirements: readonly CoverageRequirement[];
  readonly remediationSkillId?: string;
  readonly remediationActivityId?: string;
}

export interface LevelPromotionDefinition {
  readonly level: string;
  readonly prerequisiteLevel?: string;
  readonly gates: readonly PromotionGateDefinition[];
}

export interface ProficiencyPolicy {
  readonly schemaVersion: 1;
  readonly languageId: string;
  readonly frameworkId: string;
  readonly levels: readonly LevelPromotionDefinition[];
}

export interface PromotionMilestone {
  readonly languageId: string;
  readonly frameworkId: string;
  readonly level: string;
  readonly firstEarnedAt: string;
  readonly gateCountAtPromotion: number;
  readonly meanGateScoreAtPromotion: number;
}

export type GateEvaluationStatus =
  | "pass"
  | "coverage_incomplete"
  | "insufficient_evidence"
  | "below_threshold";

export interface GateEvaluation {
  readonly gateId: string;
  readonly label: string;
  readonly status: GateEvaluationStatus;
  readonly score: number;
  readonly confidence: number;
  readonly evidenceCount: number;
  readonly independentEvidenceCount: number;
  readonly coverageComplete: boolean;
  readonly missingCoverage: readonly CoverageRequirement[];
  readonly scoreThreshold: number;
  readonly confidenceThreshold: number;
  readonly minimumEvidenceCount: number;
  readonly minimumIndependentEvidenceCount: number;
}

export type PromotionStatus =
  | "promoted"
  | "promoted_maintenance_needed"
  | "eligible"
  | "blocked_prerequisite"
  | "coverage_incomplete"
  | "not_ready";

export interface LevelPromotionEvaluation {
  readonly languageId: string;
  readonly frameworkId: string;
  readonly level: string;
  readonly status: PromotionStatus;
  readonly gates: readonly GateEvaluation[];
  readonly gatesPassed: number;
  readonly meanGateScore: number;
  readonly meanConfidence: number;
  readonly weakestGateId?: string;
  readonly prerequisiteLevel?: string;
}

export interface ExternalFrameworkDefinition {
  readonly frameworkId: string;
  readonly role: "exam_overlay" | "mapping";
  readonly coveredCompetences: readonly FrameworkCompetence[];
  readonly excludedCompetences?: readonly FrameworkCompetence[];
}

export interface FrameworkLevelMapping {
  readonly fromFrameworkId: string;
  readonly fromLevel: string;
  readonly toFrameworkId: string;
  readonly toLevel: string;
  readonly scope: "full" | "partial";
  readonly competences: readonly FrameworkCompetence[];
  readonly note?: string;
}

export interface ExternalFrameworkResult {
  readonly accountId: AccountId;
  readonly languageId: string;
  readonly frameworkId: string;
  readonly level: string;
  readonly assessedAt: string;
  readonly issuer?: string;
  readonly verified: boolean;
}

export interface MappedFrameworkResult {
  readonly source: ExternalFrameworkResult;
  readonly targetFrameworkId: string;
  readonly targetLevel: string;
  readonly scope: "full" | "partial";
  readonly competences: readonly FrameworkCompetence[];
  readonly canSupportGlobalPromotion: boolean;
  readonly note?: string;
}

export interface ProficiencyPolicyIssue {
  readonly severity: "error" | "warning";
  readonly code:
    | "duplicate-level"
    | "missing-prerequisite-level"
    | "prerequisite-cycle"
    | "duplicate-gate"
    | "invalid-threshold"
    | "invalid-evidence-minimum"
    | "invalid-coverage-minimum";
  readonly message: string;
}

export function validateProficiencyPolicy(
  policy: ProficiencyPolicy
): ProficiencyPolicyIssue[] {
  const issues: ProficiencyPolicyIssue[] = [];
  const levels = new Map<string, LevelPromotionDefinition>();

  for (const level of policy.levels) {
    if (levels.has(level.level)) {
      issues.push({
        severity: "error",
        code: "duplicate-level",
        message: `Duplicate promotion level: ${level.level}`
      });
      continue;
    }
    levels.set(level.level, level);

    const gateIds = new Set<string>();
    for (const gate of level.gates) {
      if (gateIds.has(gate.id)) {
        issues.push({
          severity: "error",
          code: "duplicate-gate",
          message: `Duplicate gate ${gate.id} in level ${level.level}`
        });
      }
      gateIds.add(gate.id);

      if (
        !inUnitInterval(gate.scoreThreshold) ||
        !inUnitInterval(gate.confidenceThreshold)
      ) {
        issues.push({
          severity: "error",
          code: "invalid-threshold",
          message: `Gate ${level.level}/${gate.id} thresholds must be in [0,1]`
        });
      }

      if (
        !Number.isInteger(gate.minimumEvidenceCount) ||
        gate.minimumEvidenceCount < 1 ||
        (gate.minimumIndependentEvidenceCount !== undefined &&
          (!Number.isInteger(gate.minimumIndependentEvidenceCount) ||
            gate.minimumIndependentEvidenceCount < 0))
      ) {
        issues.push({
          severity: "error",
          code: "invalid-evidence-minimum",
          message: `Gate ${level.level}/${gate.id} has invalid evidence minimums`
        });
      }

      for (const requirement of gate.coverageRequirements) {
        if (
          !Number.isInteger(requirement.minimumCount) ||
          requirement.minimumCount < 1
        ) {
          issues.push({
            severity: "error",
            code: "invalid-coverage-minimum",
            message: `Coverage ${requirement.key} must require at least one item`
          });
        }
      }
    }
  }

  for (const level of policy.levels) {
    if (level.prerequisiteLevel && !levels.has(level.prerequisiteLevel)) {
      issues.push({
        severity: "error",
        code: "missing-prerequisite-level",
        message: `${level.level} depends on missing level ${level.prerequisiteLevel}`
      });
    }
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();
  function visit(levelId: string, trail: readonly string[]): void {
    if (visiting.has(levelId)) {
      issues.push({
        severity: "error",
        code: "prerequisite-cycle",
        message: `Promotion prerequisite cycle: ${[...trail, levelId].join(" -> ")}`
      });
      return;
    }
    if (visited.has(levelId)) return;

    const level = levels.get(levelId);
    if (!level) return;

    visiting.add(levelId);
    if (level.prerequisiteLevel) {
      visit(level.prerequisiteLevel, [...trail, levelId]);
    }
    visiting.delete(levelId);
    visited.add(levelId);
  }

  for (const level of policy.levels) visit(level.level, []);
  return issues;
}

export function evaluateLevelPromotion(
  policy: ProficiencyPolicy,
  levelId: string,
  evidence: readonly AssessmentEvidence[],
  coverage: Readonly<Record<string, number>>,
  milestones: readonly PromotionMilestone[] = []
): LevelPromotionEvaluation {
  const level = policy.levels.find((candidate) => candidate.level === levelId);
  if (!level) throw new Error(`Unknown promotion level: ${levelId}`);

  const gates = level.gates.map((gate) =>
    evaluateGate(policy, level, gate, evidence, coverage)
  );

  const prerequisiteEarned =
    !level.prerequisiteLevel ||
    milestones.some(
      (milestone) =>
        milestone.languageId === policy.languageId &&
        milestone.frameworkId === policy.frameworkId &&
        milestone.level === level.prerequisiteLevel
    );

  const existingMilestone = milestones.find(
    (milestone) =>
      milestone.languageId === policy.languageId &&
      milestone.frameworkId === policy.frameworkId &&
      milestone.level === level.level
  );

  const allPass = gates.every((gate) => gate.status === "pass");
  const hasCoverageGap = gates.some(
    (gate) => gate.status === "coverage_incomplete"
  );

  let status: PromotionStatus;
  if (existingMilestone) {
    status = allPass ? "promoted" : "promoted_maintenance_needed";
  } else if (!prerequisiteEarned) {
    status = "blocked_prerequisite";
  } else if (hasCoverageGap) {
    status = "coverage_incomplete";
  } else if (allPass) {
    status = "eligible";
  } else {
    status = "not_ready";
  }

  const weakest = [...gates]
    .filter((gate) => gate.status !== "pass")
    .sort((a, b) => gateReadiness(a) - gateReadiness(b))[0];

  return {
    languageId: policy.languageId,
    frameworkId: policy.frameworkId,
    level: level.level,
    status,
    gates,
    gatesPassed: gates.filter((gate) => gate.status === "pass").length,
    meanGateScore: average(gates.map((gate) => gate.score)),
    meanConfidence: average(gates.map((gate) => gate.confidence)),
    ...(weakest ? { weakestGateId: weakest.gateId } : {}),
    ...(level.prerequisiteLevel
      ? { prerequisiteLevel: level.prerequisiteLevel }
      : {})
  };
}

export function createPromotionMilestone(
  evaluation: LevelPromotionEvaluation,
  earnedAt: string
): PromotionMilestone {
  if (evaluation.status !== "eligible") {
    throw new Error(
      `Cannot create promotion milestone from status ${evaluation.status}`
    );
  }

  return {
    languageId: evaluation.languageId,
    frameworkId: evaluation.frameworkId,
    level: evaluation.level,
    firstEarnedAt: earnedAt,
    gateCountAtPromotion: evaluation.gates.length,
    meanGateScoreAtPromotion: evaluation.meanGateScore
  };
}

export function remediationSignal(
  policy: ProficiencyPolicy,
  evaluation: LevelPromotionEvaluation,
  maxBoost = 16
): { readonly activityId: string; readonly boost: number; readonly gateId: string } | undefined {
  if (
    evaluation.status === "eligible" ||
    evaluation.status === "promoted" ||
    evaluation.status === "coverage_incomplete" ||
    evaluation.status === "blocked_prerequisite"
  ) {
    return undefined;
  }

  const level = policy.levels.find((candidate) => candidate.level === evaluation.level);
  const gateEvaluation = evaluation.gates
    .filter(
      (gate) =>
        gate.status === "below_threshold" ||
        gate.status === "insufficient_evidence"
    )
    .sort((a, b) => gateReadiness(a) - gateReadiness(b))[0];

  if (!level || !gateEvaluation) return undefined;

  const gate = level.gates.find(
    (candidate) => candidate.id === gateEvaluation.gateId
  );
  if (!gate?.remediationActivityId) return undefined;

  const boundedMax = Math.max(0, Math.min(16, maxBoost));
  return {
    activityId: gate.remediationActivityId,
    boost: Math.round((1 - gateReadiness(gateEvaluation)) * boundedMax),
    gateId: gate.id
  };
}

export function mapExternalFrameworkResult(
  result: ExternalFrameworkResult,
  mappings: readonly FrameworkLevelMapping[],
  targetFrameworkId: string
): MappedFrameworkResult | undefined {
  const mapping = mappings.find(
    (candidate) =>
      candidate.fromFrameworkId === result.frameworkId &&
      candidate.fromLevel === result.level &&
      candidate.toFrameworkId === targetFrameworkId
  );

  if (!mapping) return undefined;

  return {
    source: result,
    targetFrameworkId: mapping.toFrameworkId,
    targetLevel: mapping.toLevel,
    scope: mapping.scope,
    competences: mapping.competences,
    canSupportGlobalPromotion: mapping.scope === "full",
    ...(mapping.note ? { note: mapping.note } : {})
  };
}

function evaluateGate(
  policy: ProficiencyPolicy,
  level: LevelPromotionDefinition,
  gate: PromotionGateDefinition,
  evidence: readonly AssessmentEvidence[],
  coverage: Readonly<Record<string, number>>
): GateEvaluation {
  const relevant = evidence.filter(
    (item) =>
      item.languageId === policy.languageId &&
      item.frameworkId === policy.frameworkId &&
      item.level === level.level &&
      item.gateId === gate.id &&
      item.source !== "self_report"
  );

  const score = weightedAverage(
    relevant.map((item) => ({
      value: clamp01(item.score),
      weight: Math.max(1, item.evidenceCount) * Math.max(0.05, clamp01(item.confidence))
    }))
  );
  const confidence = weightedAverage(
    relevant.map((item) => ({
      value: clamp01(item.confidence),
      weight: Math.max(1, item.evidenceCount)
    }))
  );
  const evidenceCount = relevant.reduce(
    (sum, item) => sum + Math.max(0, item.evidenceCount),
    0
  );
  const independentEvidenceCount = relevant.reduce(
    (sum, item) => sum + Math.max(0, item.independentEvidenceCount),
    0
  );

  const evidenceCoverage = new Set(
    relevant.flatMap((item) => item.coverageKeys)
  );
  const missingCoverage = gate.coverageRequirements.filter(
    (requirement) =>
      (coverage[requirement.key] ?? 0) < requirement.minimumCount ||
      !evidenceCoverage.has(requirement.key)
  );
  const coverageComplete = missingCoverage.length === 0;
  const minimumIndependentEvidenceCount =
    gate.minimumIndependentEvidenceCount ?? 0;

  let status: GateEvaluationStatus = "pass";
  if (!coverageComplete) {
    status = "coverage_incomplete";
  } else if (
    evidenceCount < gate.minimumEvidenceCount ||
    independentEvidenceCount < minimumIndependentEvidenceCount
  ) {
    status = "insufficient_evidence";
  } else if (
    score < gate.scoreThreshold ||
    confidence < gate.confidenceThreshold
  ) {
    status = "below_threshold";
  }

  return {
    gateId: gate.id,
    label: gate.label,
    status,
    score,
    confidence,
    evidenceCount,
    independentEvidenceCount,
    coverageComplete,
    missingCoverage,
    scoreThreshold: gate.scoreThreshold,
    confidenceThreshold: gate.confidenceThreshold,
    minimumEvidenceCount: gate.minimumEvidenceCount,
    minimumIndependentEvidenceCount
  };
}

function gateReadiness(gate: GateEvaluation): number {
  if (gate.status === "coverage_incomplete") return 0;
  const scoreRatio =
    gate.scoreThreshold <= 0 ? 1 : Math.min(1, gate.score / gate.scoreThreshold);
  const confidenceRatio =
    gate.confidenceThreshold <= 0
      ? 1
      : Math.min(1, gate.confidence / gate.confidenceThreshold);
  const evidenceRatio = Math.min(
    1,
    gate.evidenceCount / Math.max(1, gate.minimumEvidenceCount)
  );
  const independentRatio =
    gate.minimumIndependentEvidenceCount <= 0
      ? 1
      : Math.min(
          1,
          gate.independentEvidenceCount /
            gate.minimumIndependentEvidenceCount
        );

  return Math.min(
    scoreRatio,
    confidenceRatio,
    evidenceRatio,
    independentRatio
  );
}

function weightedAverage(
  values: readonly { readonly value: number; readonly weight: number }[]
): number {
  const totalWeight = values.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight <= 0) return 0;
  return clamp01(
    values.reduce((sum, item) => sum + item.value * item.weight, 0) /
      totalWeight
  );
}

function average(values: readonly number[]): number {
  if (values.length === 0) return 0;
  return clamp01(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function inUnitInterval(value: number): boolean {
  return Number.isFinite(value) && value >= 0 && value <= 1;
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}
