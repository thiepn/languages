import type {
  MasteryProjection,
  SkillDimension
} from "../../domain/src/index.js";

export type SkillAggregation = "weighted_mean" | "weakest_link";
export type SkillEdgeKind = "prerequisite" | "transfer";
export type SkillEvidenceState = "unseen" | "emerging" | "developing" | "functional" | "secure";

export interface SkillNode {
  readonly id: string;
  readonly label: string;
  readonly evidenceDimensions: readonly SkillDimension[];
  readonly aggregation?: SkillAggregation;
  readonly minimumEvidenceCount?: number;
  readonly tags?: readonly string[];
}

export interface SkillEdge {
  readonly from: string;
  readonly to: string;
  readonly kind: SkillEdgeKind;
  readonly weight: number;
}

export interface LanguageSkillGraph {
  readonly schemaVersion: 1;
  readonly languageId: string;
  readonly nodes: readonly SkillNode[];
  readonly edges: readonly SkillEdge[];
}

export interface SkillProfile {
  readonly skillId: string;
  readonly strength: number;
  readonly confidence: number;
  readonly evidenceCount: number;
  readonly state: SkillEvidenceState;
}

export interface SkillGraphIssue {
  readonly severity: "error" | "warning";
  readonly code:
    | "duplicate-node"
    | "missing-edge-source"
    | "missing-edge-target"
    | "invalid-edge-weight"
    | "duplicate-edge"
    | "prerequisite-cycle"
    | "missing-evidence-dimension"
    | "invalid-minimum-evidence";
  readonly message: string;
  readonly nodeId?: string;
}

export function validateSkillGraph(graph: LanguageSkillGraph): SkillGraphIssue[] {
  const issues: SkillGraphIssue[] = [];
  const byId = new Map<string, SkillNode>();

  for (const node of graph.nodes) {
    if (byId.has(node.id)) {
      issues.push({
        severity: "error",
        code: "duplicate-node",
        nodeId: node.id,
        message: `Duplicate skill node: ${node.id}`
      });
      continue;
    }
    byId.set(node.id, node);

    if (node.evidenceDimensions.length === 0) {
      issues.push({
        severity: "error",
        code: "missing-evidence-dimension",
        nodeId: node.id,
        message: `Skill ${node.id} must declare at least one evidence dimension`
      });
    }

    if (
      node.minimumEvidenceCount !== undefined &&
      (!Number.isFinite(node.minimumEvidenceCount) || node.minimumEvidenceCount <= 0)
    ) {
      issues.push({
        severity: "error",
        code: "invalid-minimum-evidence",
        nodeId: node.id,
        message: `Skill ${node.id} has an invalid minimumEvidenceCount`
      });
    }
  }

  const seenEdges = new Set<string>();
  for (const edge of graph.edges) {
    if (!byId.has(edge.from)) {
      issues.push({
        severity: "error",
        code: "missing-edge-source",
        message: `Edge source does not exist: ${edge.from}`
      });
    }
    if (!byId.has(edge.to)) {
      issues.push({
        severity: "error",
        code: "missing-edge-target",
        message: `Edge target does not exist: ${edge.to}`
      });
    }
    if (!Number.isFinite(edge.weight) || edge.weight <= 0 || edge.weight > 1) {
      issues.push({
        severity: "error",
        code: "invalid-edge-weight",
        message: `Edge ${edge.from} -> ${edge.to} must have weight in (0, 1]`
      });
    }

    const key = `${edge.kind}:${edge.from}:${edge.to}`;
    if (seenEdges.has(key)) {
      issues.push({
        severity: "error",
        code: "duplicate-edge",
        message: `Duplicate ${edge.kind} edge: ${edge.from} -> ${edge.to}`
      });
    }
    seenEdges.add(key);
  }

  const prerequisites = graph.edges.filter(
    (edge) => edge.kind === "prerequisite" && byId.has(edge.from) && byId.has(edge.to)
  );
  const visiting = new Set<string>();
  const visited = new Set<string>();

  function visit(nodeId: string, trail: readonly string[]): void {
    if (visiting.has(nodeId)) {
      issues.push({
        severity: "error",
        code: "prerequisite-cycle",
        nodeId,
        message: `Prerequisite cycle: ${[...trail, nodeId].join(" -> ")}`
      });
      return;
    }
    if (visited.has(nodeId)) return;

    visiting.add(nodeId);
    for (const edge of prerequisites.filter((candidate) => candidate.to === nodeId)) {
      visit(edge.from, [...trail, nodeId]);
    }
    visiting.delete(nodeId);
    visited.add(nodeId);
  }

  for (const node of graph.nodes) visit(node.id, []);
  return issues;
}

export function deriveSkillProfilesFromMastery(
  graph: LanguageSkillGraph,
  mastery: Readonly<Record<string, MasteryProjection>>
): readonly SkillProfile[] {
  const languageProjections = Object.values(mastery).filter(
    (projection) => projection.languageId === graph.languageId
  );

  return graph.nodes.map((node) => {
    const dimensions = new Set<string>(node.evidenceDimensions);
    const relevant = languageProjections.filter((projection) =>
      dimensions.has(projection.dimension)
    );

    if (relevant.length === 0) {
      return {
        skillId: node.id,
        strength: 0,
        confidence: 0,
        evidenceCount: 0,
        state: "unseen"
      };
    }

    const totalEvidence = relevant.reduce(
      (sum, projection) => sum + projection.evidenceCount,
      0
    );
    const minimumEvidenceCount = node.minimumEvidenceCount ?? 8;
    const coverage = clamp01(totalEvidence / minimumEvidenceCount);
    const confidenceWeight = relevant.reduce(
      (sum, projection) => sum + Math.max(0.05, projection.confidence),
      0
    );

    const meanStrength =
      relevant.reduce(
        (sum, projection) =>
          sum + projection.estimate * Math.max(0.05, projection.confidence),
        0
      ) / confidenceWeight;

    const weakestStrength = Math.min(...relevant.map((projection) => projection.estimate));
    const strength =
      (node.aggregation ?? "weighted_mean") === "weakest_link"
        ? weakestStrength
        : meanStrength;

    const meanConfidence =
      relevant.reduce(
        (sum, projection) =>
          sum + projection.confidence * Math.max(1, projection.evidenceCount),
        0
      ) /
      relevant.reduce(
        (sum, projection) => sum + Math.max(1, projection.evidenceCount),
        0
      );

    const confidence = clamp01(meanConfidence * coverage);

    return {
      skillId: node.id,
      strength: clamp01(strength),
      confidence,
      evidenceCount: totalEvidence,
      state: evidenceState(strength, confidence)
    };
  });
}

export function profileMap(
  profiles: readonly SkillProfile[]
): Readonly<Record<string, SkillProfile>> {
  return Object.fromEntries(profiles.map((profile) => [profile.skillId, profile]));
}

export function incomingEdges(
  graph: LanguageSkillGraph,
  skillId: string,
  kind?: SkillEdgeKind
): readonly SkillEdge[] {
  return graph.edges.filter(
    (edge) => edge.to === skillId && (kind === undefined || edge.kind === kind)
  );
}

export function outgoingEdges(
  graph: LanguageSkillGraph,
  skillId: string,
  kind?: SkillEdgeKind
): readonly SkillEdge[] {
  return graph.edges.filter(
    (edge) => edge.from === skillId && (kind === undefined || edge.kind === kind)
  );
}

function evidenceState(strength: number, confidence: number): SkillEvidenceState {
  if (confidence <= 0) return "unseen";
  if (confidence < 0.25) return "emerging";
  if (confidence < 0.5 || strength < 0.55) return "developing";
  if (confidence < 0.75 || strength < 0.8) return "functional";
  return "secure";
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}
