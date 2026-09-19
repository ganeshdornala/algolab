import { describe, expect, it } from "vitest";

import { bfs, dfs, sampleGraph } from "./graphTraversal";

describe("BFS", () => {
    it("visits nodes level by level", () => {
        const steps = bfs(sampleGraph, 0);
        const traversalOrder = steps.map((step) => step.current);

        expect(traversalOrder).toEqual([0, 1, 2, 3, 4, 5]);
    });

    it("visits each node only once", () => {
        const steps = bfs(sampleGraph, 0);
        const visited = steps.flatMap((step) => step.current);

        expect(new Set(visited).size).toBe(visited.length);
    });

    it("records the visited nodes in each step", () => {
        const steps = bfs(sampleGraph, 0);

        expect(steps[0].visited).toEqual([0]);
        expect(steps[1].visited).toEqual([0, 1]);
        expect(steps[2].visited).toEqual([0, 1, 2]);
    });

    it("handles a starting node with no neighbors", () => {
        const steps = bfs({}, 7);

        expect(steps).toEqual([
            {
                visited: [7],
                current: 7,
                frontier: [],
                traversedEdges: [],
            },
        ]);
    });
});

describe("DFS", () => {
    it("explores depth-first using the defined neighbor order", () => {
        const steps = dfs(sampleGraph, 0);
        const traversalOrder = steps.map((step) => step.current);

        expect(traversalOrder).toEqual([0, 1, 3, 4, 5, 2]);
    });

    it("visits each node only once", () => {
        const steps = dfs(sampleGraph, 0);
        const visited = steps.map((step) => step.current);

        expect(new Set(visited).size).toBe(visited.length);
    });

    it("records the visited nodes in each step", () => {
        const steps = dfs(sampleGraph, 0);

        expect(steps[0].visited).toEqual([0]);
        expect(steps[1].visited).toEqual([0, 1]);
        expect(steps[2].visited).toEqual([0, 1, 3]);
    });

    it("handles a starting node with no neighbors", () => {
        const steps = dfs({}, 7);

        expect(steps).toEqual([
            {
                visited: [7],
                current: 7,
                frontier: [],
                traversedEdges: [],
            },
        ]);
    });
});