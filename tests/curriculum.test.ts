import { describe, expect, it } from "vitest";
import {
  topologicalCurriculumOrder,
  validateCurriculumGraph,
  type CurriculumNode
} from "../packages/curriculum/src/index.js";

describe("curriculum dependency graph", () => {
  it("orders prerequisites before dependants", () => {
    const graph: CurriculumNode[] = [
      { id: "restaurant-order", kind: "can_do", prerequisiteIds: ["polite-request", "food-core"] },
      { id: "food-core", kind: "concept", prerequisiteIds: [] },
      { id: "polite-request", kind: "concept", prerequisiteIds: [] }
    ];

    const ordered = topologicalCurriculumOrder(graph).map((node) => node.id);
    expect(ordered.indexOf("food-core")).toBeLessThan(ordered.indexOf("restaurant-order"));
    expect(ordered.indexOf("polite-request")).toBeLessThan(ordered.indexOf("restaurant-order"));
  });

  it("detects missing prerequisites and cycles", () => {
    const graph: CurriculumNode[] = [
      { id: "a", kind: "unit", prerequisiteIds: ["b", "missing"] },
      { id: "b", kind: "unit", prerequisiteIds: ["a"] }
    ];

    const codes = validateCurriculumGraph(graph).map((issue) => issue.code);
    expect(codes).toContain("missing-prerequisite");
    expect(codes).toContain("cycle");
  });
});
