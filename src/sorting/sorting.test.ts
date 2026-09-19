import { describe, expect, it } from "vitest";

import { bubbleSort } from "./bubbleSort";
import { selectionSort } from "./selectionSort";
import { insertionSort } from "./insertionSort";
import { mergeSort } from "./mergeSort";
import { quickSort } from "./quickSort";

const sortingAlgorithms = [
    ["Bubble Sort", bubbleSort],
    ["Selection Sort", selectionSort],
    ["Insertion Sort", insertionSort],
    ["Merge Sort", mergeSort],
    ["Quick Sort", quickSort],
] as const;

describe("Sorting algorithms", () => {
    it.each(sortingAlgorithms)(
        "%s should sort an array correctly",
        (_name, sort) => {
            const input = [5, 2, 8, 1, 4];

            const steps = sort(input);
            const finalArray = steps[steps.length - 1]?.array ?? input;

            expect(finalArray).toEqual([1, 2, 4, 5, 8]);
        },
    );

    it.each(sortingAlgorithms)(
        "%s should handle an empty array",
        (_name, sort) => {
            const input: number[] = [];

            const steps = sort(input);

            expect(steps).toEqual([]);
        },
    );

    it.each(sortingAlgorithms)(
        "%s should handle a single-element array",
        (_name, sort) => {
            const input = [7];

            const steps = sort(input);

            expect(steps).toEqual([]);
        },
    );

    it.each(sortingAlgorithms)(
        "%s should handle an already sorted array",
        (_name, sort) => {
            const input = [1, 2, 3, 4, 5];

            const steps = sort(input);
            const finalArray = steps[steps.length - 1]?.array ?? input;

            expect(finalArray).toEqual([1, 2, 3, 4, 5]);
        },
    );

    it.each(sortingAlgorithms)(
        "%s should handle a reverse-sorted array",
        (_name, sort) => {
            const input = [5, 4, 3, 2, 1];

            const steps = sort(input);
            const finalArray = steps[steps.length - 1]?.array ?? input;

            expect(finalArray).toEqual([1, 2, 3, 4, 5]);
        },
    );

    it.each(sortingAlgorithms)(
        "%s should handle duplicate values",
        (_name, sort) => {
            const input = [5, 1, 5, 2, 1];

            const steps = sort(input);
            const finalArray = steps[steps.length - 1]?.array ?? input;

            expect(finalArray).toEqual([1, 1, 2, 5, 5]);
        },
    );

    it.each(sortingAlgorithms)(
        "%s should not mutate the input array",
        (_name, sort) => {
            const input = [5, 2, 8, 1, 4];
            const original = [...input];

            sort(input);

            expect(input).toEqual(original);
        },
    );
});

describe("SortStep structure", () => {
    it.each(sortingAlgorithms)(
        "%s should produce valid visualization steps",
        (_name, sort) => {
            const input = [5, 2, 8, 1, 4];
            const steps = sort(input);

            for (const step of steps) {
                expect(step.array).toHaveLength(input.length);

                expect(["compare", "swap", "write"]).toContain(step.operation);

                for (const index of step.comparing) {
                    expect(index).toBeGreaterThanOrEqual(0);
                    expect(index).toBeLessThan(input.length);
                }
            }
        },
    );
});