import { useState } from "react";

import {
    bfs,
    dfs,
    sampleGraph,
    type TraversalStep,
} from "./graphTraversal";

type TraversalAlgorithm = "bfs" | "dfs";

const nodePositions: Record<number, { x: number; y: number }> = {
    0: { x: 250, y: 50 },
    1: { x: 130, y: 150 },
    2: { x: 370, y: 150 },
    3: { x: 70, y: 280 },
    4: { x: 190, y: 280 },
    5: { x: 430, y: 280 },
};

const edges: [number, number][] = [
    [0, 1],
    [0, 2],
    [1, 3],
    [1, 4],
    [2, 5],
    [4, 5],
];

function GraphVisualizer() {
    const [algorithm, setAlgorithm] = useState<TraversalAlgorithm>("bfs");
    const [steps, setSteps] = useState<TraversalStep[]>(() =>
        bfs(sampleGraph, 0),
    );
    const [stepIndex, setStepIndex] = useState(-1);

    const currentStep = stepIndex === -1 ? null : steps[stepIndex];

    const visitedNodes = currentStep?.visited ?? [];
    const currentNode = currentStep?.current ?? -1;
    const frontier = currentStep?.frontier ?? [];

    const complexity =
        algorithm === "bfs"
            ? {
                time: "O(V + E)",
                space: "O(V) auxiliary space",
            }
            : {
                time: "O(V + E)",
                space: "O(V) auxiliary space",
            };

    function handleAlgorithmChange(
        event: React.ChangeEvent<HTMLSelectElement>,
    ) {
        const selected = event.target.value as TraversalAlgorithm;

        setAlgorithm(selected);

        const newSteps =
            selected === "bfs" ? bfs(sampleGraph, 0) : dfs(sampleGraph, 0);

        setSteps(newSteps);
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

    return (
        <section className="graph-visualizer">
            <h2>Graph Traversal</h2>

            <div className="algorithm-select">
                <label htmlFor="traversal-algorithm">Algorithm: </label>

                <select
                    id="traversal-algorithm"
                    value={algorithm}
                    onChange={handleAlgorithmChange}
                >
                    <option value="bfs">Breadth-First Search (BFS)</option>
                    <option value="dfs">Depth-First Search (DFS)</option>
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

            <div className="graph-canvas">
                <svg
                    viewBox="0 0 500 340"
                    role="img"
                    aria-label={`Graph showing ${algorithm.toUpperCase()} traversal`}
                >
                    {/* Draw graph edges */}
                    {edges.map(([from, to]) => {
                        const start = nodePositions[from];
                        const end = nodePositions[to];

                        const isTraversed =
                            currentStep?.traversedEdges.some(
                                ([edgeFrom, edgeTo]) =>
                                    (edgeFrom === from && edgeTo === to) ||
                                    (edgeFrom === to && edgeTo === from),
                            ) ?? false;

                        return (
                            <line
                                key={`${from}-${to}`}
                                x1={start.x}
                                y1={start.y}
                                x2={end.x}
                                y2={end.y}
                                className={`graph-edge ${isTraversed ? "traversed" : ""}`}
                            />
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
                            </g>
                        );
                    })}
                </svg>
            </div>

            <div className="graph-legend">
                <span>
                    <span className="legend-dot unvisited-dot" /> Unvisited
                </span>
                <span>
                    <span className="legend-dot visited-dot" /> Visited
                </span>
                <span>
                    <span className="legend-dot current-dot" /> Current node
                </span>
            </div>

            <div className="frontier-info">
                <p>
                    <strong>{algorithm === "bfs" ? "Queue" : "Stack"}:</strong>{" "}
                    {frontier.length > 0 ? frontier.join(", ") : "Empty"}
                </p>

                <p>
                    <strong>Visited:</strong>{" "}
                    {visitedNodes.length > 0 ? visitedNodes.join(", ") : "None"}
                </p>
            </div>

            {currentStep && (
                <p className="current-node-info">
                    Exploring node {currentStep.current}
                </p>
            )}

            <div className="controls">
                <button onClick={handlePrevious} disabled={stepIndex === -1}>
                    Previous Step
                </button>

                <button
                    onClick={handleNext}
                    disabled={stepIndex === steps.length - 1}
                >
                    Next Step
                </button>

                <button onClick={handleReset} disabled={stepIndex === -1}>
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