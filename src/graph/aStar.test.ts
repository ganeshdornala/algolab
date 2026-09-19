import { describe, expect, it } from "vitest";
import {
    aStar,
    sampleHeuristic,
} from "./aStar";
import { sampleWeightedGraph } from "./dijkstra";
import type { WeightedGraph } from "./dijkstra";

describe("aStar", () => {
    it("finds a path from the start node to the goal", () => {
        const steps = aStar(
            sampleWeightedGraph,
            0,
            5,
            sampleHeuristic,
        );

        const finalStep = steps[steps.length - 1];

        expect(finalStep.current).toBe(5);
        expect(finalStep.path[0]).toBe(0);
        expect(finalStep.path[finalStep.path.length - 1]).toBe(5);
    });

    it("finds the expected shortest path in the sample graph", () => {
        const steps = aStar(
            sampleWeightedGraph,
            0,
            5,
            sampleHeuristic,
        );

        const finalStep = steps[steps.length - 1];

        expect(finalStep.path).toEqual([0, 2, 1, 3, 4, 5]);
        expect(finalStep.gScores[5]).toBe(13);  
    });

    it("returns a path containing only the start when start equals goal", () => {
        const steps = aStar(
            sampleWeightedGraph,
            0,
            0,
            sampleHeuristic,
        );

        expect(steps[steps.length - 1].path).toEqual([0]);
    });

    it("returns no path when the goal is unreachable", () => {
        const graph: WeightedGraph = {
            0: [{ node: 1, weight: 2 }],
            1: [{ node: 0, weight: 2 }],
            2: [],
        };

        const heuristic = {
            0: 2,
            1: 1,
            2: 0,
        };

        const steps = aStar(graph, 0, 2, heuristic);

        expect(steps[steps.length - 1].path).toEqual([]);
        expect(steps[steps.length - 1].gScores[2]).toBe(Infinity);
    });

    it("throws when the start node does not exist", () => {
        expect(() =>
            aStar(sampleWeightedGraph, 10, 5, sampleHeuristic),
        ).toThrow("Start node 10 does not exist");
    });

    it("throws when the goal node does not exist", () => {
        expect(() =>
            aStar(sampleWeightedGraph, 0, 10, sampleHeuristic),
        ).toThrow("Goal node 10 does not exist");
    });

    it("throws when a heuristic value is missing", () => {
        const heuristic = {
            0: 10,
            1: 8,
            2: 8,
            3: 4,
            4: 2,
        };

        expect(() =>
            aStar(sampleWeightedGraph, 0, 5, heuristic),
        ).toThrow("Missing heuristic for node 5");
    });

    it("throws when a heuristic value is negative", () => {
        const heuristic = {
            ...sampleHeuristic,
            2: -1,
        };

        expect(() =>
            aStar(sampleWeightedGraph, 0, 5, heuristic),
        ).toThrow("Heuristic values must be non-negative");
    });

    it("throws when an edge has a negative weight", () => {
        const graph: WeightedGraph = {
            0: [{ node: 1, weight: -1 }],
            1: [{ node: 0, weight: -1 }],
        };

        const heuristic = {
            0: 1,
            1: 0,
        };

        expect(() => aStar(graph, 0, 1, heuristic))
            .toThrow("A* requires non-negative edge weights");
    });
});