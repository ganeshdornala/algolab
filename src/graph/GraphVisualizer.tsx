import { useState } from "react";
import type { ChangeEvent } from "react";

import {
    bfs,
    dfs,
    sampleGraph,
} from "./graphTraversal";

import {
    dijkstra,
    sampleWeightedGraph,
} from "./dijkstra";

import {
    aStar,
    sampleHeuristic,
} from "./aStar";

type GraphAlgorithm = "bfs" | "dfs" | "dijkstra" | "astar";

const nodePositions: Record<number, { x: number; y: number }> = {
    0: { x: 250, y: 50 },
    1: { x: 130, y: 150 },
    2: { x: 370, y: 150 },
    3: { x: 70, y: 280 },
    4: { x: 250, y: 280 },
    5: { x: 430, y: 280 },
};

const edges: [number, number][] = [
    [0, 1],
    [0, 2],
    [1, 2],
    [1, 3],
    [2, 3],
    [2, 4],
    [3, 4],
    [3, 5],
    [4, 5],
];

const traversalEdges: [number, number][] = [
    [0, 1],
    [0, 2],
    [1, 3],
    [1, 4],
    [2, 5],
    [4, 5],
];

/*
 * The graph data is fixed, so calculate the algorithm steps once.
 * This avoids repeating the calculations whenever React re-renders
 * the visualizer.
 */
const traversalSteps = {
    bfs: bfs(sampleGraph, 0),
    dfs: dfs(sampleGraph, 0),
};

const dijkstraSteps = dijkstra(sampleWeightedGraph, 0);

const aStarSteps = aStar(
    sampleWeightedGraph,
    0,
    5,
    sampleHeuristic,
);

function GraphVisualizer() {
    const [algorithm, setAlgorithm] = useState<GraphAlgorithm>("bfs");
    const [stepIndex, setStepIndex] = useState(-1);

    const visibleEdges =
        algorithm === "dijkstra" || algorithm === "astar"
            ? edges
            : traversalEdges;

    const steps =
        algorithm === "dijkstra"
            ? dijkstraSteps
            : algorithm === "astar"
                ? aStarSteps
                : algorithm === "bfs"
                    ? traversalSteps.bfs
                    : traversalSteps.dfs;

    const currentStep =
        stepIndex === -1 ? null : steps[stepIndex];

    const visitedNodes = currentStep?.visited ?? [];

    const currentNode = currentStep?.current ?? -1;

    const traversedEdges = currentStep?.traversedEdges ?? [];

    const complexity =
        algorithm === "dijkstra" || algorithm === "astar"
            ? {
                time: "O(V² + E) — linear scan implementation",
                space: "O(V) auxiliary space",
            }
            : {
                time: "O(V + E)",
                space: "O(V) auxiliary space",
            };

    function handleAlgorithmChange(event: ChangeEvent<HTMLSelectElement>) {
        const selected = event.target.value as GraphAlgorithm;

        setAlgorithm(selected);
        setStepIndex(-1);
    }

    function handlePrevious() {
        if (stepIndex >= 0) {
            setStepIndex((current) => current - 1);
        }
    }

    function handleNext() {
        if (stepIndex < steps.length - 1) {
            setStepIndex((current) => current + 1);
        }
    }

    function handleReset() {
        setStepIndex(-1);
    }

    function isTraversedEdge(from: number, to: number) {
        return traversedEdges.some(
            ([edgeFrom, edgeTo]) =>
                (edgeFrom === from && edgeTo === to) ||
                (edgeFrom === to && edgeTo === from),
        );
    }

    function getEdgeWeight(from: number, to: number) {
        const edge = sampleWeightedGraph[from]?.find(
            (item) => item.node === to,
        );

        return edge?.weight ?? "";
    }

    function getDistance(node: number) {
        if (algorithm === "astar") {
            if (!currentStep || !("gScores" in currentStep)) {
                return node === 0 ? 0 : Infinity;
            }

            return currentStep.gScores[node] ?? Infinity;
        }

        if (algorithm !== "dijkstra") {
            return null;
        }

        if (!currentStep || !("distances" in currentStep)) {
            return node === 0 ? 0 : Infinity;
        }

        return currentStep.distances[node] ?? Infinity;
    }

    return (
        <section className="graph-visualizer">
            <h2>Graph Traversal</h2>

            <div className="algorithm-select">
                <label htmlFor="traversal-algorithm">
                    Algorithm:
                </label>

                <select
                    id="traversal-algorithm"
                    value={algorithm}
                    onChange={handleAlgorithmChange}
                >
                    <option value="bfs">
                        Breadth-First Search (BFS)
                    </option>

                    <option value="dfs">
                        Depth-First Search (DFS)
                    </option>

                    <option value="dijkstra">
                        Dijkstra's Algorithm
                    </option>

                    <option value="astar">
                        A* Search
                    </option>
                </select>
            </div>

            <div className="complexity-info">
                <h3>Complexity</h3>

                <p>
                    <strong>Time:</strong> {complexity.time}
                </p>

                <p>
                    <strong>Space:</strong> {complexity.space}
                </p>
            </div>

            {algorithm === "dijkstra" && (
                <p className="graph-description">
                    Dijkstra finds shortest distances from node 0.
                    All edge weights are non-negative.
                </p>
            )}

            {algorithm === "astar" && (
                <p className="graph-description">
                    A* searches for a path from node 0 to node 5 using
                    the path cost (g-score) and heuristic estimate (h-score).
                    All edge weights are non-negative.
                </p>
            )}

            <div className="graph-canvas">
                <svg
                    viewBox="0 0 500 340"
                    role="img"
                    aria-label={`${algorithm.toUpperCase()} graph visualization`}
                >
                    {/* Draw graph edges and their weights */}
                    {visibleEdges.map(([from, to]) => {
                        const start = nodePositions[from];
                        const end = nodePositions[to];
                        const isTraversed = isTraversedEdge(from, to);

                        const midX = (start.x + end.x) / 2;
                        const midY = (start.y + end.y) / 2;

                        return (
                            <g key={`${from}-${to}`}>
                                <line
                                    x1={start.x}
                                    y1={start.y}
                                    x2={end.x}
                                    y2={end.y}
                                    className={`graph-edge ${isTraversed ? "traversed" : ""
                                        }`}
                                />

                                {(algorithm === "dijkstra" ||
                                    algorithm === "astar") && (
                                        <text
                                            x={midX}
                                            y={midY - 8}
                                            className="edge-weight"
                                            textAnchor="middle"
                                        >
                                            {getEdgeWeight(from, to)}
                                        </text>
                                    )}
                            </g>
                        );
                    })}

                    {/* Draw graph nodes */}
                    {Object.entries(nodePositions).map(([node, position]) => {
                        const nodeNumber = Number(node);
                        const isCurrent = currentNode === nodeNumber;
                        const isVisited = visitedNodes.includes(nodeNumber);

                        let nodeClass = "graph-node";

                        if (isVisited) {
                            nodeClass += " visited";
                        }

                        if (isCurrent) {
                            nodeClass += " current";
                        }

                        const distance = getDistance(nodeNumber);

                        return (
                            <g key={nodeNumber}>
                                <circle
                                    cx={position.x}
                                    cy={position.y}
                                    r="25"
                                    className={nodeClass}
                                />

                                <text
                                    x={position.x}
                                    y={position.y}
                                    className="graph-node-label"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                >
                                    {nodeNumber}
                                </text>

                                {(algorithm === "dijkstra" ||
                                    algorithm === "astar") && (
                                        <text
                                            x={position.x}
                                            y={position.y + 43}
                                            className="distance-label"
                                            textAnchor="middle"
                                        >
                                            {algorithm === "astar" ? "g" : "d"}:{" "}
                                            {distance === Infinity ? "∞" : distance}
                                        </text>
                                    )}
                            </g>
                        );
                    })}
                </svg>
            </div>

            <div className="graph-legend">
                <span>
                    <span className="legend-dot unvisited-dot" />
                    Unvisited
                </span>

                <span>
                    <span className="legend-dot visited-dot" />
                    Visited
                </span>

                <span>
                    <span className="legend-dot current-dot" />
                    Current node
                </span>
            </div>

            {algorithm === "bfs" || algorithm === "dfs" ? (
                <div className="frontier-info">
                    <p>
                        <strong>
                            {algorithm === "bfs" ? "Queue" : "Stack"}:
                        </strong>{" "}

                        {currentStep &&
                            "frontier" in currentStep &&
                            currentStep.frontier.length > 0
                            ? currentStep.frontier.join(", ")
                            : "Empty"}
                    </p>

                    <p>
                        <strong>Visited:</strong>{" "}
                        {visitedNodes.length > 0
                            ? visitedNodes.join(", ")
                            : "None"}
                    </p>
                </div>
            ) : algorithm === "dijkstra" ? (
                <div className="frontier-info">
                    <p>
                        <strong>Visited:</strong>{" "}
                        {visitedNodes.length > 0
                            ? visitedNodes.join(", ")
                            : "None"}
                    </p>

                    <p>
                        <strong>Current node:</strong>{" "}
                        {currentNode === -1 ? "None" : currentNode}
                    </p>
                </div>
            ) : (
                <div className="frontier-info">
                    <p>
                        <strong>Open set:</strong>{" "}

                        {currentStep &&
                            "openSet" in currentStep &&
                            currentStep.openSet.length > 0
                            ? currentStep.openSet.join(", ")
                            : "Empty"}
                    </p>

                    <p>
                        <strong>Visited:</strong>{" "}
                        {visitedNodes.length > 0
                            ? visitedNodes.join(", ")
                            : "None"}
                    </p>

                    <p>
                        <strong>Current node:</strong>{" "}
                        {currentNode === -1 ? "None" : currentNode}
                    </p>

                    <p>
                        <strong>Scores (g, f):</strong>{" "}

                        {currentStep && "gScores" in currentStep
                            ? Object.keys(currentStep.gScores)
                                .map(Number)
                                .map((node) => {
                                    const g = currentStep.gScores[node];
                                    const f = currentStep.fScores[node];

                                    return `${node}: (${g === Infinity ? "∞" : g
                                        }, ${f === Infinity ? "∞" : f
                                        })`;
                                })
                                .join(" | ")
                            : "Not available"}
                    </p>
                </div>
            )}

            {currentStep && (
                <p className="current-node-info">
                    Exploring node {currentStep.current}
                </p>
            )}

            <div className="controls">
                <button
                    onClick={handlePrevious}
                    disabled={stepIndex === -1}
                >
                    Previous Step
                </button>

                <button
                    onClick={handleNext}
                    disabled={stepIndex === steps.length - 1}
                >
                    Next Step
                </button>

                <button
                    onClick={handleReset}
                    disabled={stepIndex === -1}
                >
                    Reset
                </button>
            </div>

            <p className="step-info">
                Step: {stepIndex + 1}/{steps.length}
            </p>
        </section>
    );
}

export default GraphVisualizer;