export type CurriculumNodeKind = "unit" | "objective" | "can_do" | "concept";

export interface CurriculumNode {
  readonly id: string;
  readonly kind: CurriculumNodeKind;
  readonly prerequisiteIds: readonly string[];
  readonly level?: string;
  readonly tags?: readonly string[];
}

export interface CurriculumIssue {
  readonly severity: "error" | "warning";
  readonly code: "duplicate-id" | "missing-prerequisite" | "cycle";
  readonly nodeId: string;
  readonly relatedId?: string;
  readonly message: string;
}

export function validateCurriculumGraph(nodes: readonly CurriculumNode[]): CurriculumIssue[] {
  const issues: CurriculumIssue[] = [];
  const byId = new Map<string, CurriculumNode>();

  for (const node of nodes) {
    if (byId.has(node.id)) {
      issues.push({
        severity: "error",
        code: "duplicate-id",
        nodeId: node.id,
        message: `Duplicate curriculum node id: ${node.id}`
      });
    } else {
      byId.set(node.id, node);
    }
  }

  for (const node of nodes) {
    for (const prerequisiteId of node.prerequisiteIds) {
      if (!byId.has(prerequisiteId)) {
        issues.push({
          severity: "error",
          code: "missing-prerequisite",
          nodeId: node.id,
          relatedId: prerequisiteId,
          message: `${node.id} depends on missing node ${prerequisiteId}`
        });
      }
    }
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();

  function visit(nodeId: string, trail: readonly string[]): void {
    if (visiting.has(nodeId)) {
      issues.push({
        severity: "error",
        code: "cycle",
        nodeId,
        message: `Curriculum dependency cycle: ${[...trail, nodeId].join(" -> ")}`
      });
      return;
    }
    if (visited.has(nodeId)) return;

    const node = byId.get(nodeId);
    if (!node) return;

    visiting.add(nodeId);
    for (const prerequisiteId of node.prerequisiteIds) {
      if (byId.has(prerequisiteId)) visit(prerequisiteId, [...trail, nodeId]);
    }
    visiting.delete(nodeId);
    visited.add(nodeId);
  }

  for (const node of nodes) visit(node.id, []);

  return issues;
}

export function topologicalCurriculumOrder(nodes: readonly CurriculumNode[]): readonly CurriculumNode[] {
  const issues = validateCurriculumGraph(nodes);
  if (issues.some((issue) => issue.severity === "error")) {
    throw new Error("Cannot order an invalid curriculum graph");
  }

  const byId = new Map(nodes.map((node) => [node.id, node] as const));
  const visited = new Set<string>();
  const ordered: CurriculumNode[] = [];

  function visit(node: CurriculumNode): void {
    if (visited.has(node.id)) return;
    for (const prerequisiteId of node.prerequisiteIds) {
      const prerequisite = byId.get(prerequisiteId);
      if (prerequisite) visit(prerequisite);
    }
    visited.add(node.id);
    ordered.push(node);
  }

  for (const node of nodes) visit(node);
  return ordered;
}
