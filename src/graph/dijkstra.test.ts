import { describe, expect, it } from "vitest";

import {
    dijkstra,
    sampleWeightedGraph,
    type WeightedGraph,
} from "./dijkstra";

describe("Dijkstra's algorithm", () => {
    it("visits reachable nodes in increasing order of shortest distance", () => {
        const steps = dijkstra(sampleWeightedGraph, 0);

        const traversalOrder = steps.map((step) => step.current);

        expect(traversalOrder).toEqual([0, 2, 1, 3, 4, 5]);
    });

    it("calculates the correct shortest distances from the starting node", () => {
        const steps = dijkstra(sampleWeightedGraph, 0);
        const finalStep = steps[steps.length - 1];

        expect(finalStep.distances).toEqual({
            0: 0,
            1: 3,
            2: 2,
            3: 8,
            4: 10,
            5: 13,
        });
    });

    it("records the predecessors along the shortest paths", () => {
        const steps = dijkstra(sampleWeightedGraph, 0);
        const finalStep = steps[steps.length - 1];

        expect(finalStep.previous).toEqual({
            0: null,
            1: 2,
            2: 0,
            3: 1,
            4: 3,
            5: 4,
        });
    });

    it("records the visited nodes after each step", () => {
        const steps = dijkstra(sampleWeightedGraph, 0);

        expect(steps[0].visited).toEqual([0]);
        expect(steps[1].visited).toEqual([0, 2]);
        expect(steps[2].visited).toEqual([0, 2, 1]);
    });

    it("records edges that improve the known distances", () => {
        const steps = dijkstra(sampleWeightedGraph, 0);
        const finalStep = steps[steps.length - 1];

        expect(finalStep.traversedEdges).toContainEqual([0, 2]);
        expect(finalStep.traversedEdges).toContainEqual([2, 1]);
        expect(finalStep.traversedEdges).toContainEqual([3, 4]);
    });

    it("keeps unreachable nodes at Infinity", () => {
        const graph: WeightedGraph = {
            0: [{ node: 1, weight: 2 }],
            1: [{ node: 0, weight: 2 }],
            2: [],
        };

        const steps = dijkstra(graph, 0);
        const finalStep = steps[steps.length - 1];

        expect(finalStep.distances[0]).toBe(0);
        expect(finalStep.distances[1]).toBe(2);
        expect(finalStep.distances[2]).toBe(Infinity);

        expect(finalStep.visited).toEqual([0, 1]);
    });

    it("handles a graph containing only the starting node", () => {
        const graph: WeightedGraph = {
            7: [],
        };

        const steps = dijkstra(graph, 7);

        expect(steps).toHaveLength(1);
        expect(steps[0].current).toBe(7);
        expect(steps[0].distances[7]).toBe(0);
        expect(steps[0].visited).toEqual([7]);
    });

    it("throws an error if the starting node does not exist", () => {
        expect(() => dijkstra(sampleWeightedGraph, 99)).toThrow(
            "Starting node 99 does not exist in the graph.",
        );
    });

    it("throws an error if the graph contains a negative edge weight", () => {
        const graph: WeightedGraph = {
            0: [{ node: 1, weight: -3 }],
            1: [],
        };

        expect(() => dijkstra(graph, 0)).toThrow(
            "Dijkstra's algorithm requires non-negative edge weights.",
        );
    });
});