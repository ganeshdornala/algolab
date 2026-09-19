import { useState, type ChangeEvent } from "react";
import {
    buildHeap,
    buildHeapSteps,
    insertHeapSteps,
    extractRootSteps,
    type HeapType,
    type HeapStep,
} from "./heap";

const initialValues = [5, 3, 8, 1, 4, 7, 2];

type HeapOperation = "build" | "insert" | "extract";

function HeapVisualizer() {
    const [heapType, setHeapType] = useState<HeapType>("min");
    const [operation, setOperation] = useState<HeapOperation>("build");
    const [insertValue, setInsertValue] = useState("6");

    const [steps, setSteps] = useState<HeapStep[]>(() =>
        buildHeapSteps(initialValues, "min"),
    );

    const [stepIndex, setStepIndex] = useState(0);

    const currentStep = steps[stepIndex];
    const heap = currentStep?.heap ?? [];

    function handleHeapTypeChange(event: ChangeEvent<HTMLSelectElement>) {
        const newType = event.target.value as HeapType;

        setHeapType(newType);

        // Rebuild the steps for the newly selected heap type.
        setOperation("build");
        setSteps(buildHeapSteps(initialValues, newType));
        setStepIndex(0);
    }

    function handleOperationChange(event: ChangeEvent<HTMLSelectElement>) {
        setOperation(event.target.value as HeapOperation);
    }

    function handleRunOperation() {
        const startingHeap = buildHeap(initialValues, heapType);
        let newSteps: HeapStep[];

        if (operation === "build") {
            newSteps = buildHeapSteps(initialValues, heapType);
        } else if (operation === "insert") {
            const value = Number(insertValue);

            if (insertValue.trim() === "" || !Number.isFinite(value)) {
                return;
            }

            newSteps = insertHeapSteps(startingHeap, value, heapType);
        } else {
            newSteps = extractRootSteps(startingHeap, heapType);
        }

        setSteps(newSteps);
        setStepIndex(0);
    }

    function handleReset() {
        setStepIndex(0);
    }

    const levels = heap.length > 0 ? Math.ceil(Math.log2(heap.length + 1)) : 1;
    const svgHeight = Math.max(180, levels * 100 + 30);
    const svgWidth = 600;

    function getNodePosition(index: number) {
        const level = Math.floor(Math.log2(index + 1));
        const positionInLevel = index - (2 ** level - 1);
        const nodesInLevel = 2 ** level;

        const spacing = svgWidth / nodesInLevel;
        const x = spacing * (positionInLevel + 0.5);
        const y = 45 + level * 100;

        return { x, y };
    }

    const activeIndices = currentStep?.activeIndices ?? [];

    return (
        <section className="heap-visualizer">
            <h2>Heap Visualizer</h2>

            <div className="algorithm-select">
                <label htmlFor="heap-type">Heap type: </label>

                <select
                    id="heap-type"
                    value={heapType}
                    onChange={handleHeapTypeChange}
                >
                    <option value="min">Min-Heap</option>
                    <option value="max">Max-Heap</option>
                </select>
            </div>

            <p className="graph-description">
                {heapType === "min"
                    ? "A min-heap keeps the smallest value at the root."
                    : "A max-heap keeps the largest value at the root."}
            </p>

            <div className="heap-operation-controls">
                <label htmlFor="heap-operation">Operation: </label>

                <select
                    id="heap-operation"
                    value={operation}
                    onChange={handleOperationChange}
                >
                    <option value="build">Build Heap</option>
                    <option value="insert">Insert</option>
                    <option value="extract">Extract Root</option>
                </select>

                {operation === "insert" && (
                    <label>
                        Value to insert:{" "}
                        <input
                            type="number"
                            value={insertValue}
                            onChange={(event) => setInsertValue(event.target.value)}
                        />
                    </label>
                )}

                <button onClick={handleRunOperation}>
                    Run Operation
                </button>
            </div>

            <div className="heap-step-controls">
                <button onClick={handleReset}>
                    Reset
                </button>

                <button
                    onClick={() => setStepIndex((index) => index - 1)}
                    disabled={stepIndex === 0}
                >
                    Previous
                </button>

                <button
                    onClick={() =>
                        setStepIndex((index) =>
                            Math.min(index + 1, steps.length - 1),
                        )
                    }
                    disabled={stepIndex >= steps.length - 1}
                >
                    Next
                </button>

                <span>
                    Step {stepIndex + 1} of {steps.length}
                </span>
            </div>

            <p className="heap-step-description" aria-live="polite">
                {currentStep?.action}
            </p>

            <div className="heap-tree">
                <h3>Binary Tree</h3>

                {heap.length === 0 ? (
                    <p>The heap is empty.</p>
                ) : (
                    <svg
                        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                        role="img"
                        aria-label={`${heapType === "min" ? "Min" : "Max"} heap tree`}
                    >
                        {/* Draw parent-child edges */}
                        {heap.map((_, index) => {
                            if (index === 0) {
                                return null;
                            }

                            const parentIndex = Math.floor((index - 1) / 2);
                            const parent = getNodePosition(parentIndex);
                            const child = getNodePosition(index);

                            const edgeIsActive =
                                activeIndices.includes(parentIndex) &&
                                activeIndices.includes(index);

                            return (
                                <line
                                    key={`edge-${index}`}
                                    x1={parent.x}
                                    y1={parent.y}
                                    x2={child.x}
                                    y2={child.y}
                                    className={
                                        edgeIsActive
                                            ? "graph-edge heap-active-edge"
                                            : "graph-edge"
                                    }
                                />
                            );
                        })}

                        {/* Draw heap nodes */}
                        {heap.map((value, index) => {
                            const position = getNodePosition(index);
                            const isActive = activeIndices.includes(index);

                            return (
                                <g key={`node-${index}`}>
                                    <circle
                                        cx={position.x}
                                        cy={position.y}
                                        r="22"
                                        className={
                                            isActive
                                                ? "graph-node heap-active-node"
                                                : "graph-node"
                                        }
                                    />

                                    <text
                                        x={position.x}
                                        y={position.y}
                                        className="graph-node-label"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                    >
                                        {value}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                )}
            </div>

            <div className="heap-array">
                <h3>Array Representation</h3>

                <div className="heap-array-values">
                    {heap.map((value, index) => (
                        <div
                            className={
                                activeIndices.includes(index)
                                    ? "heap-array-item heap-active-item"
                                    : "heap-array-item"
                            }
                            key={index}
                        >
                            <span className="heap-array-index">
                                {index}
                            </span>

                            <strong>{value}</strong>
                        </div>
                    ))}
                </div>
            </div>

            <div className="complexity-info">
                <h3>Heap Operations — Complexity</h3>

                <p>
                    <strong>Build heap:</strong> O(n)
                </p>

                <p>
                    <strong>Insert:</strong> O(log n)
                </p>

                <p>
                    <strong>Extract root:</strong> O(log n)
                </p>

                <p>
                    <strong>Peek root:</strong> O(1)
                </p>
            </div>
        </section>
    );
}

export default HeapVisualizer;