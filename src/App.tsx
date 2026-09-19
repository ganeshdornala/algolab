import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";

import { bubbleSort, type SortStep } from "./sorting/bubbleSort";
import { selectionSort } from "./sorting/selectionSort";
import { insertionSort } from "./sorting/insertionSort";
import { mergeSort } from "./sorting/mergeSort";
import { quickSort } from "./sorting/quickSort";

import { binarySearch, type SearchStep } from "./searching/binarySearch";

const initialArray = [5, 2, 8, 1, 4];
const initialSearchArray = [1, 2, 3, 4, 5];

const algorithmInfo: Record<string, { time: string; space: string }> = {
  bubble: {
    time: "Best: O(n) · Average/Worst: O(n²)",
    space: "O(1) auxiliary space",
  },
  selection: {
    time: "O(n²) in all cases",
    space: "O(1) auxiliary space",
  },
  insertion: {
    time: "Best: O(n) · Average/Worst: O(n²)",
    space: "O(1) auxiliary space",
  },
  merge: {
    time: "O(n log n) in all cases",
    space: "O(n) auxiliary space",
  },
  quick: {
    time: "Best/Average: O(n log n) · Worst: O(n²)",
    space: "Average: O(log n) · Worst: O(n) recursion stack",
  },
};

function App() {
  const [mode, setMode] = useState<"sorting" | "searching">("sorting");

  const [algorithm, setAlgorithm] = useState("bubble");
  const [steps, setSteps] = useState<SortStep[]>(() => bubbleSort(initialArray));
  const [stepIndex, setStepIndex] = useState(-1);

  const [searchTarget, setSearchTarget] = useState(4);
  const [searchSteps, setSearchSteps] = useState<SearchStep[]>(() =>
    binarySearch(initialSearchArray, 4),
  );
  const [searchStepIndex, setSearchStepIndex] = useState(-1);

  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);

  // Sorting visualization state
  const currentArray =stepIndex === -1 ? initialArray : steps[stepIndex].array;

  const comparing =stepIndex === -1 ? [] : steps[stepIndex].comparing;

  // Binary Search visualization state
  const currentSearchStep =searchStepIndex === -1 ? null : searchSteps[searchStepIndex];

  const searchLow = currentSearchStep?.low ?? 0;
  const searchHigh = currentSearchStep?.high ?? initialSearchArray.length - 1;
  const searchMid = currentSearchStep?.mid ?? -1;

  function handleAlgorithmChange(event: ChangeEvent<HTMLSelectElement>) {
    const selectedAlgorithm = event.target.value;

    setAlgorithm(selectedAlgorithm);

    const newSteps =
      selectedAlgorithm === "bubble"
        ? bubbleSort(initialArray)
        : selectedAlgorithm === "selection"
          ? selectionSort(initialArray)
          : selectedAlgorithm === "insertion"
            ? insertionSort(initialArray)
            : selectedAlgorithm === "merge"
              ? mergeSort(initialArray)
              : quickSort(initialArray);

    setSteps(newSteps);
    setStepIndex(-1);
    setIsPlaying(false);
  }

  function handleNext() {
    if (stepIndex < steps.length - 1) {
      setStepIndex((current) => current + 1);
    }
  }

  function handlePrevious() {
    if (stepIndex >= 0) {
      setStepIndex((current) => current - 1);
    }
  }

  function handleReset() {
    setIsPlaying(false);
    setStepIndex(-1);
  }

  function handleSearchNext() {
    if (searchStepIndex < searchSteps.length - 1) {
      setSearchStepIndex((current) => current + 1);
    }
  }

  function handleSearchPrevious() {
    if (searchStepIndex >= 0) {
      setSearchStepIndex((current) => current - 1);
    }
  }

  function handleSearchReset() {
    setIsPlaying(false);
    setSearchStepIndex(-1);
  }

  function handleSearchTargetChange(event: ChangeEvent<HTMLInputElement>) {
    const target = Number(event.target.value);

    setSearchTarget(target);
    setSearchSteps(binarySearch(initialSearchArray, target));
    setSearchStepIndex(-1);
    setIsPlaying(false);
  }

  useEffect(() => {
    if (!isPlaying || mode !== "sorting") {
      return;
    }

    if (stepIndex >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setStepIndex((current) => current + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [isPlaying, mode, stepIndex, steps.length, speed]);

  return (
    <div className="app">
      <header className="header">
        <h1>AlgoLab</h1>
        <p>Algorithm Visualizer</p>
      </header>

      <main className="main">
        {/* Choose between Sorting and Binary Search */}
        <div className="mode-select">
          <button
            onClick={() => {
              setMode("sorting");
              setIsPlaying(false);
            }}
            disabled={mode === "sorting"}
          >
            Sorting
          </button>

          <button
            onClick={() => {
              setMode("searching");
              setIsPlaying(false);
            }}
            disabled={mode === "searching"}
          >
            Binary Search
          </button>
        </div>

        {/* Sorting mode */}
        {mode === "sorting" && (
          <>
            <div className="algorithm-select">
              <label htmlFor="algorithm">Algorithm: </label>

              <select
                id="algorithm"
                value={algorithm}
                onChange={handleAlgorithmChange}
                disabled={isPlaying}
              >
                <option value="bubble">Bubble Sort</option>
                <option value="selection">Selection Sort</option>
                <option value="insertion">Insertion Sort</option>
                <option value="merge">Merge Sort</option>
                <option value="quick">Quick Sort</option>
              </select>
            </div>

            <div className="complexity-info">
              <h2>Complexity</h2>

              <p>
                <strong>Time:</strong> {algorithmInfo[algorithm].time}
              </p>

              <p>
                <strong>Space:</strong> {algorithmInfo[algorithm].space}
              </p>
            </div>

            <div className="visualizer">
              {currentArray.map((value, index) => {
                const isComparing = comparing.includes(index);

                return (
                  <div className="bar-container" key={index}>
                    <div
                      className={`bar ${isComparing ? "comparing" : ""}`}
                      style={{ height: `${value * 30}px` }}
                    >
                      {value}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="controls">
              <button
                onClick={handlePrevious}
                disabled={stepIndex === -1 || isPlaying}
              >
                Previous Step
              </button>

              <button
                onClick={() => setIsPlaying((current) => !current)}
                disabled={stepIndex === steps.length - 1}
              >
                {isPlaying ? "Pause" : "Play"}
              </button>

              <button
                onClick={handleNext}
                disabled={stepIndex === steps.length - 1 || isPlaying}
              >
                Next Step
              </button>

              <button onClick={handleReset} disabled={isPlaying}>
                Reset
              </button>

              <label>
                Speed:{" "}
                <select
                  value={speed}
                  onChange={(event) => setSpeed(Number(event.target.value))}
                  disabled={isPlaying}
                >
                  <option value={1000}>Slow</option>
                  <option value={500}>Normal</option>
                  <option value={200}>Fast</option>
                </select>
              </label>
            </div>

            <p className="step-info">
              Step: {stepIndex + 1}/{steps.length}
            </p>
          </>
        )}

        {/* Binary Search mode */}
        {mode === "searching" && (
          <>
            <div className="search-info">
              <h2>Binary Search</h2>

              <p>
                Binary Search requires the array to be sorted in ascending
                order.
              </p>

              <p>
                <strong>Time:</strong> Best: O(1) · Average/Worst: O(log n)
              </p>

              <p>
                <strong>Space:</strong> O(1) auxiliary space for the iterative
                algorithm
              </p>
            </div>

            <div className="search-target">
              <label htmlFor="search-target">Target: </label>

              <input
                id="search-target"
                type="number"
                value={searchTarget}
                onChange={handleSearchTargetChange}
              />
            </div>

            <div className="visualizer">
              {initialSearchArray.map((value, index) => {
                const isMid = searchMid === index;
                const isInRange = index >= searchLow && index <= searchHigh;
                const isDiscarded =
                  currentSearchStep !== null &&
                  currentSearchStep.status !== "found" &&
                  !isInRange;

                let barClass = "bar";

                if (isMid) {
                  barClass += " comparing";
                }

                if (isDiscarded) {
                  barClass += " discarded";
                }

                return (
                  <div className="bar-container" key={index}>
                    <div
                      className={barClass}
                      style={{ height: `${value * 30}px` }}
                    >
                      {value}
                    </div>

                    <span className="index-label">{index}</span>

                    {isMid && (
                      <span className="mid-label">
                        {currentSearchStep?.status === "found"
                          ? "Found"
                          : "Mid"}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="search-range">
              <p>
                <strong>Low:</strong> {searchLow} &nbsp;|&nbsp;
                <strong>High:</strong> {searchHigh} &nbsp;|&nbsp;
                <strong>Mid:</strong> {searchMid === -1 ? "—" : searchMid}
              </p>

              {currentSearchStep?.status === "found" && (
                <p className="search-result">
                  Target {currentSearchStep.target} found at index{" "}
                  {currentSearchStep.mid}.
                </p>
              )}

              {currentSearchStep?.status === "not-found" && (
                <p className="search-result">
                  Target {currentSearchStep.target} was not found.
                </p>
              )}
            </div>

            <div className="controls">
              <button
                onClick={handleSearchPrevious}
                disabled={searchStepIndex === -1}
              >
                Previous Step
              </button>

              <button
                onClick={handleSearchNext}
                disabled={searchStepIndex === searchSteps.length - 1}
              >
                Next Step
              </button>

              <button
                onClick={handleSearchReset}
                disabled={searchStepIndex === -1}
              >
                Reset
              </button>
            </div>

            <p className="step-info">
              Step: {searchStepIndex + 1}/{searchSteps.length}
            </p>
          </>
        )}
      </main>
    </div>
  );
}

export default App;