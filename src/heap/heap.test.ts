import { describe, expect, it } from "vitest";
import { buildHeap, insertHeap, extractRoot } from "./heap";
import {
    buildHeapSteps,
    insertHeapSteps,
    extractRootSteps,
} from "./heap";

describe("buildHeap", () => {
    it("builds a valid min-heap", () => {
        const heap = buildHeap([5, 3, 8, 1, 4], "min");

        expect(heap[0]).toBe(1);
        expect(heap).toHaveLength(5);

        for (let i = 0; i < heap.length; i++) {
            const left = 2 * i + 1;
            const right = 2 * i + 2;

            if (left < heap.length) {
                expect(heap[i]).toBeLessThanOrEqual(heap[left]);
            }

            if (right < heap.length) {
                expect(heap[i]).toBeLessThanOrEqual(heap[right]);
            }
        }
    });

    it("builds a valid max-heap", () => {
        const heap = buildHeap([5, 3, 8, 1, 4], "max");

        expect(heap[0]).toBe(8);
        expect(heap).toHaveLength(5);

        for (let i = 0; i < heap.length; i++) {
            const left = 2 * i + 1;
            const right = 2 * i + 2;

            if (left < heap.length) {
                expect(heap[i]).toBeGreaterThanOrEqual(heap[left]);
            }

            if (right < heap.length) {
                expect(heap[i]).toBeGreaterThanOrEqual(heap[right]);
            }
        }
    });

    it("handles an empty array", () => {
        expect(buildHeap([], "min")).toEqual([]);
    });

    it("handles a single element", () => {
        expect(buildHeap([7], "min")).toEqual([7]);
    });
});

describe("insertHeap", () => {
    it("inserts a value into a min-heap", () => {
        const heap = insertHeap([2, 5, 3], 1, "min");

        expect(heap[0]).toBe(1);
        expect(heap).toHaveLength(4);
    });

    it("inserts a value into a max-heap", () => {
        const heap = insertHeap([8, 5, 3], 10, "max");

        expect(heap[0]).toBe(10);
        expect(heap).toHaveLength(4);
    });

    it("does not mutate the original array", () => {
        const original = [2, 5, 3];

        insertHeap(original, 1, "min");

        expect(original).toEqual([2, 5, 3]);
    });
});

describe("extractRoot", () => {
    it("extracts the minimum from a min-heap", () => {
        const result = extractRoot([1, 3, 2, 7, 5], "min");

        expect(result.root).toBe(1);
        expect(result.heap[0]).toBe(2);
        expect(result.heap).toHaveLength(4);
    });

    it("extracts the maximum from a max-heap", () => {
        const result = extractRoot([8, 5, 3, 1, 4], "max");

        expect(result.root).toBe(8);
        expect(result.heap[0]).toBe(5);
        expect(result.heap).toHaveLength(4);
    });

    it("returns null when extracting from an empty heap", () => {
        expect(extractRoot([], "min")).toEqual({
            root: null,
            heap: [],
        });
    });

    it("does not mutate the original array", () => {
        const original = [1, 3, 2];

        extractRoot(original, "min");

        expect(original).toEqual([1, 3, 2]);
    });
});

describe("heap operation steps", () => {
    it("records the initial and final states when building a min-heap", () => {
        const steps = buildHeapSteps([5, 3, 8, 1], "min");

        expect(steps.length).toBeGreaterThan(1);
        expect(steps[0].heap).toEqual([5, 3, 8, 1]);
        expect(steps.at(-1)?.heap).toEqual([1, 3, 8, 5]);
    });

    it("records the initial and final states when building a max-heap", () => {
        const steps = buildHeapSteps([5, 3, 8, 1], "max");

        expect(steps.length).toBeGreaterThan(1);
        expect(steps[0].heap).toEqual([5, 3, 8, 1]);
        expect(steps.at(-1)?.heap).toEqual([8, 3, 5, 1]);
    });

    it("records insertion steps for a min-heap", () => {
        const steps = insertHeapSteps([2, 4, 3], 1, "min");

        expect(steps[0].heap).toEqual([2, 4, 3]);
        expect(steps.some((step) => step.heap.includes(1))).toBe(true);
        expect(steps.at(-1)?.heap).toEqual([1, 2, 3, 4]);
    });

    it("records insertion steps for a max-heap", () => {
        const steps = insertHeapSteps([6, 4, 5], 9, "max");

        expect(steps[0].heap).toEqual([6, 4, 5]);
        expect(steps.at(-1)?.heap).toEqual([9, 6, 5, 4]);
    });

    it("records root extraction steps for a min-heap", () => {
        const steps = extractRootSteps([1, 3, 2, 5, 4], "min");

        expect(steps[0].heap).toEqual([1, 3, 2, 5, 4]);
        expect(steps.at(-1)?.heap).toEqual([2, 3, 4, 5]);
    });

    it("records root extraction steps for a max-heap", () => {
        const steps = extractRootSteps([9, 6, 8, 2, 4], "max");

        expect(steps[0].heap).toEqual([9, 6, 8, 2, 4]);
        expect(steps.at(-1)?.heap).toEqual([8, 6, 4, 2]);
    });

    it("handles extracting from an empty heap", () => {
        const steps = extractRootSteps([], "min");

        expect(steps.at(-1)?.heap).toEqual([]);
        expect(steps.at(-1)?.action).toContain("empty");
    });
});