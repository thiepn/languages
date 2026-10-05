import {
  incomingEdges,
  outgoingEdges,
  profileMap,
  type LanguageSkillGraph,
  type SkillProfile
} from "../../skill-graph/src/index.js";

export interface ActivityDefinition {
  readonly id: string;
  readonly label: string;
  readonly targetSkillIds: readonly string[];
  readonly estimatedMinutes: number;
  readonly basePriority?: number;
  readonly category?: string;
}

export interface LanguageLearningProfile {
  readonly schemaVersion: 1;
  readonly languageId: string;
  readonly graph: LanguageSkillGraph;
  readonly activities: readonly ActivityDefinition[];
}

export interface ActivityRuntimeSignal {
  readonly activityId: string;
  readonly available?: boolean;
  readonly urgency?: number;
  readonly recentLaunches?: number;
  readonly calibrationBonus?: number;
  readonly resume?: boolean;
}

export interface RankingFactors {
  readonly confirmedNeed: number;
  readonly uncertainty: number;
  readonly transferGap: number;
  readonly prerequisiteReadiness: number;
  readonly urgency: number;
  readonly novelty: number;
  readonly basePriority: number;
  readonly repetitionPenalty: number;
  readonly calibrationBonus: number;
}

export interface RankedActivity {
  readonly activity: ActivityDefinition;
  readonly score: number;
  readonly factors: RankingFactors;
  readonly reason: string;
  readonly resume: boolean;
}

export interface ActivityObservation {
  readonly activityId: string;
  readonly completedAt: string;
  readonly observation: number;
}

export interface AdaptiveBlockStep {
  readonly activityId: string;
  readonly label: string;
  readonly estimatedMinutes: number;
  readonly role: "prerequisite_support" | "anchor" | "downstream_transfer" | "complement";
}

export interface AdaptiveBlock {
  readonly anchorActivityId: string;
  readonly steps: readonly AdaptiveBlockStep[];
  readonly estimatedMinutes: number;
  readonly targetSkillIds: readonly string[];
  readonly reason: string;
}

export interface OrchestrationIssue {
  readonly severity: "error" | "warning";
  readonly code:
    | "language-mismatch"
    | "duplicate-activity"
    | "missing-target-skill"
    | "invalid-duration"
    | "invalid-base-priority"
    | "empty-targets";
  readonly message: string;
}

export function validateLearningProfile(
  profile: LanguageLearningProfile
): OrchestrationIssue[] {
  const issues: OrchestrationIssue[] = [];
  const skillIds = new Set(profile.graph.nodes.map((node) => node.id));
  const activities = new Set<string>();

  if (profile.languageId !== profile.graph.languageId) {
    issues.push({
      severity: "error",
      code: "language-mismatch",
      message: `Learning profile ${profile.languageId} contains graph for ${profile.graph.languageId}`
    });
  }

  for (const activity of profile.activities) {
    if (activities.has(activity.id)) {
      issues.push({
        severity: "error",
        code: "duplicate-activity",
        message: `Duplicate activity: ${activity.id}`
      });
    }
    activities.add(activity.id);

    if (activity.targetSkillIds.length === 0) {
      issues.push({
        severity: "error",
        code: "empty-targets",
        message: `Activity ${activity.id} must target at least one skill`
      });
    }

    for (const targetSkillId of activity.targetSkillIds) {
      if (!skillIds.has(targetSkillId)) {
        issues.push({
          severity: "error",
          code: "missing-target-skill",
          message: `Activity ${activity.id} targets missing skill ${targetSkillId}`
        });
      }
    }

    if (!Number.isFinite(activity.estimatedMinutes) || activity.estimatedMinutes <= 0) {
      issues.push({
        severity: "error",
        code: "invalid-duration",
        message: `Activity ${activity.id} must have positive estimatedMinutes`
      });
    }

    if (
      activity.basePriority !== undefined &&
      (!Number.isFinite(activity.basePriority) ||
        activity.basePriority < 0 ||
        activity.basePriority > 1)
    ) {
      issues.push({
        severity: "error",
        code: "invalid-base-priority",
        message: `Activity ${activity.id} basePriority must be in [0, 1]`
      });
    }
  }

  return issues;
}

export function rankActivities(
  profile: LanguageLearningProfile,
  profiles: readonly SkillProfile[],
  runtimeSignals: readonly ActivityRuntimeSignal[] = []
): readonly RankedActivity[] {
  const skillProfiles = profileMap(profiles);
  const signals = new Map(runtimeSignals.map((signal) => [signal.activityId, signal]));

  const ranked = profile.activities
    .filter((activity) => signals.get(activity.id)?.available !== false)
    .map((activity) => {
      const signal = signals.get(activity.id);
      const resume = signal?.resume === true;
      const factors = rankingFactors(
        profile.graph,
        skillProfiles,
        activity,
        signal
      );

      const rawScore =
        35 * factors.confirmedNeed +
        12 * factors.uncertainty +
        20 * factors.transferGap +
        13 * factors.urgency +
        10 * factors.novelty +
        10 * factors.basePriority;

      const readinessAdjusted =
        rawScore * (0.25 + 0.75 * factors.prerequisiteReadiness);

      const score = resume
        ? 100
        : clamp(
            readinessAdjusted -
              factors.repetitionPenalty +
              factors.calibrationBonus,
            0,
            99
          );

      return {
        activity,
        score,
        factors,
        reason: resume ? "Resume existing work" : primaryReason(factors),
        resume
      };
    });

  return ranked.sort(
    (a, b) =>
      Number(b.resume) - Number(a.resume) ||
      b.score - a.score ||
      a.activity.id.localeCompare(b.activity.id)
  );
}

function rankingFactors(
  graph: LanguageSkillGraph,
  skillProfiles: Readonly<Record<string, SkillProfile>>,
  activity: ActivityDefinition,
  signal?: ActivityRuntimeSignal
): RankingFactors {
  const targets = activity.targetSkillIds.map(
    (skillId) =>
      skillProfiles[skillId] ?? {
        skillId,
        strength: 0,
        confidence: 0,
        evidenceCount: 0,
        state: "unseen" as const
      }
  );

  const confirmedNeed = average(
    targets.map((target) => (1 - target.strength) * target.confidence)
  );
  const uncertainty = average(targets.map((target) => 1 - target.confidence));
  const transferGap = average(
    activity.targetSkillIds.map((skillId) =>
      incomingTransferGap(graph, skillProfiles, skillId)
    )
  );
  const prerequisiteReadiness = average(
    activity.targetSkillIds.map((skillId) =>
      prerequisiteReadinessForSkill(graph, skillProfiles, skillId)
    )
  );

  const urgency = clamp01(signal?.urgency ?? 0);
  const recentLaunches = Math.max(0, signal?.recentLaunches ?? 0);
  const novelty = 1 - Math.min(1, recentLaunches / 3);
  const repetitionPenalty = Math.min(15, recentLaunches * 5);
  const calibrationBonus = clamp(signal?.calibrationBonus ?? 0, -6, 6);

  return {
    confirmedNeed,
    uncertainty,
    transferGap,
    prerequisiteReadiness,
    urgency,
    novelty,
    basePriority: clamp01(activity.basePriority ?? 0.5),
    repetitionPenalty,
    calibrationBonus
  };
}

export function prerequisiteReadinessForSkill(
  graph: LanguageSkillGraph,
  profiles: Readonly<Record<string, SkillProfile>>,
  skillId: string
): number {
  const edges = incomingEdges(graph, skillId, "prerequisite");
  if (edges.length === 0) return 1;

  const weighted = edges.map((edge) => {
    const source = profiles[edge.from];
    if (!source) return { value: 0, weight: edge.weight };
    return {
      value: source.strength * source.confidence,
      weight: edge.weight
    };
  });

  return weightedAverage(weighted);
}

export function incomingTransferGap(
  graph: LanguageSkillGraph,
  profiles: Readonly<Record<string, SkillProfile>>,
  skillId: string
): number {
  const target = profiles[skillId];
  if (!target) return 0;

  const gaps = incomingEdges(graph, skillId, "transfer").map((edge) => {
    const source = profiles[edge.from];
    if (!source) return 0;

    return (
      Math.max(0, source.strength - target.strength) *
      Math.min(source.confidence, target.confidence) *
      edge.weight
    );
  });

  return gaps.length === 0 ? 0 : Math.max(...gaps);
}

export function activityCalibrationBonus(
  activityId: string,
  observations: readonly ActivityObservation[]
): number {
  const relevant = observations
    .filter((observation) => observation.activityId === activityId)
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt))
    .slice(0, 12);

  if (relevant.length < 3) return 0;

  const mean =
    relevant.reduce(
      (sum, observation) => sum + clamp(observation.observation, -0.5, 0.5),
      0
    ) / relevant.length;

  return clamp(mean * 12, -6, 6);
}

export function composeAdaptiveBlock(
  profile: LanguageLearningProfile,
  ranked: readonly RankedActivity[],
  options: { readonly timeBudgetMinutes?: number; readonly maxSteps?: number } = {}
): AdaptiveBlock | undefined {
  const available = ranked.filter((candidate) => candidate.score > 0);
  if (available.length === 0) return undefined;

  const anchor = available[0]!;
  if (anchor.resume) {
    return {
      anchorActivityId: anchor.activity.id,
      steps: [toStep(anchor.activity, "anchor")],
      estimatedMinutes: anchor.activity.estimatedMinutes,
      targetSkillIds: anchor.activity.targetSkillIds,
      reason: "Resume existing work before composing new study."
    };
  }

  const budget = options.timeBudgetMinutes ?? 26;
  const maxSteps = Math.max(1, Math.min(3, options.maxSteps ?? 3));
  const steps: AdaptiveBlockStep[] = [];
  const used = new Set<string>();

  const prerequisiteSkillIds = new Set(
    anchor.activity.targetSkillIds.flatMap((skillId) =>
      incomingEdges(profile.graph, skillId, "prerequisite").map((edge) => edge.from)
    )
  );

  if (anchor.factors.prerequisiteReadiness < 0.6) {
    const support = available.find(
      (candidate) =>
        candidate.activity.id !== anchor.activity.id &&
        candidate.activity.targetSkillIds.some((skillId) =>
          prerequisiteSkillIds.has(skillId)
        ) &&
        candidate.activity.estimatedMinutes + anchor.activity.estimatedMinutes <= budget
    );

    if (support) {
      steps.push(toStep(support.activity, "prerequisite_support"));
      used.add(support.activity.id);
    }
  }

  steps.push(toStep(anchor.activity, "anchor"));
  used.add(anchor.activity.id);

  if (steps.length < maxSteps && anchor.factors.prerequisiteReadiness >= 0.6) {
    const downstreamSkillIds = new Set(
      anchor.activity.targetSkillIds.flatMap((skillId) =>
        outgoingEdges(profile.graph, skillId)
          .filter((edge) => edge.kind === "transfer")
          .map((edge) => edge.to)
      )
    );

    const downstream = available.find(
      (candidate) =>
        !used.has(candidate.activity.id) &&
        candidate.activity.targetSkillIds.some((skillId) =>
          downstreamSkillIds.has(skillId)
        ) &&
        fitsBudget(steps, candidate.activity, budget)
    );

    if (downstream) {
      steps.push(toStep(downstream.activity, "downstream_transfer"));
      used.add(downstream.activity.id);
    }
  }

  for (const candidate of available) {
    if (steps.length >= maxSteps) break;
    if (used.has(candidate.activity.id)) continue;
    if (!fitsBudget(steps, candidate.activity, budget)) continue;
    if (
      steps.length > 0 &&
      candidate.activity.category &&
      candidate.activity.category ===
        profile.activities.find((activity) => activity.id === steps.at(-1)?.activityId)?.category
    ) {
      continue;
    }

    steps.push(toStep(candidate.activity, "complement"));
    used.add(candidate.activity.id);
  }

  return {
    anchorActivityId: anchor.activity.id,
    steps,
    estimatedMinutes: steps.reduce((sum, step) => sum + step.estimatedMinutes, 0),
    targetSkillIds: anchor.activity.targetSkillIds,
    reason:
      anchor.factors.prerequisiteReadiness < 0.6
        ? "Support prerequisites before the current highest-value target."
        : "Practice the current bottleneck, then transfer or complement it."
  };
}

function toStep(
  activity: ActivityDefinition,
  role: AdaptiveBlockStep["role"]
): AdaptiveBlockStep {
  return {
    activityId: activity.id,
    label: activity.label,
    estimatedMinutes: activity.estimatedMinutes,
    role
  };
}

function fitsBudget(
  steps: readonly AdaptiveBlockStep[],
  activity: ActivityDefinition,
  budget: number
): boolean {
  return (
    steps.reduce((sum, step) => sum + step.estimatedMinutes, 0) +
      activity.estimatedMinutes <=
    budget
  );
}

function primaryReason(factors: RankingFactors): string {
  const candidates = [
    ["Confirmed weakness", factors.confirmedNeed],
    ["Upstream skill is ahead", factors.transferGap],
    ["More evidence is needed", factors.uncertainty * 0.6],
    ["Time-sensitive review or task pressure", factors.urgency],
    ["Useful variety", factors.novelty * 0.4]
  ] as const;

  const [label] = [...candidates].sort((a, b) => b[1] - a[1])[0]!;
  return factors.prerequisiteReadiness < 0.5
    ? `${label}; prerequisite readiness is low`
    : label;
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

function clamp01(value: number): number {
  return clamp(value, 0, 1);
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(min, Math.min(max, value));
}
