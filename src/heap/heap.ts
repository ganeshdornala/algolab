export type HeapType = "min" | "max";

export type HeapStep = {
    heap: number[];
    action: string;
    activeIndices: number[];
};

function hasHigherPriority(
    first: number,
    second: number,
    type: HeapType,
): boolean {
    return type === "min" ? first < second : first > second;
}

function swap(array: number[], first: number, second: number): void {
    [array[first], array[second]] = [array[second], array[first]];
}

function recordStep(
    steps: HeapStep[] | undefined,
    heap: number[],
    action: string,
    activeIndices: number[] = [],
): void {
    if (!steps) {
        return;
    }

    steps.push({
        heap: [...heap],
        action,
        activeIndices: [...activeIndices],
    });
}

function siftDown(
    heap: number[],
    index: number,
    type: HeapType,
    steps?: HeapStep[],
): void {
    const size = heap.length;

    while (true) {
        let priorityIndex = index;
        const left = 2 * index + 1;
        const right = 2 * index + 2;

        if (
            left < size &&
            hasHigherPriority(heap[left], heap[priorityIndex], type)
        ) {
            priorityIndex = left;
        }

        if (
            right < size &&
            hasHigherPriority(heap[right], heap[priorityIndex], type)
        ) {
            priorityIndex = right;
        }

        if (priorityIndex === index) {
            break;
        }

        swap(heap, index, priorityIndex);

        recordStep(
            steps,
            heap,
            `Swap ${heap[priorityIndex]} and ${heap[index]} to restore the heap property.`,
            [index, priorityIndex],
        );

        index = priorityIndex;
    }
}

function siftUp(
    heap: number[],
    index: number,
    type: HeapType,
    steps?: HeapStep[],
): void {
    while (index > 0) {
        const parent = Math.floor((index - 1) / 2);

        if (!hasHigherPriority(heap[index], heap[parent], type)) {
            break;
        }

        swap(heap, index, parent);

        recordStep(
            steps,
            heap,
            `Swap ${heap[parent]} and ${heap[index]} to restore the heap property.`,
            [parent, index],
        );

        index = parent;
    }
}

export function buildHeap(values: number[], type: HeapType): number[] {
    const heap = [...values];

    for (let index = Math.floor(heap.length / 2) - 1; index >= 0; index--) {
        siftDown(heap, index, type);
    }

    return heap;
}

export function insertHeap(
    values: number[],
    value: number,
    type: HeapType,
): number[] {
    const heap = [...values];
    heap.push(value);
    siftUp(heap, heap.length - 1, type);
    return heap;
}

export function extractRoot(
    values: number[],
    type: HeapType,
): { root: number | null; heap: number[] } {
    const heap = [...values];

    if (heap.length === 0) {
        return { root: null, heap };
    }

    const root = heap[0];
    const last = heap.pop()!;

    if (heap.length > 0) {
        heap[0] = last;
        siftDown(heap, 0, type);
    }

    return { root, heap };
}

/**
 * Records the snapshots produced while building a heap.
 */
export function buildHeapSteps(
    values: number[],
    type: HeapType,
): HeapStep[] {
    const heap = [...values];
    const steps: HeapStep[] = [];

    recordStep(steps, heap, "Start with the original array.");

    for (let index = Math.floor(heap.length / 2) - 1; index >= 0; index--) {
        recordStep(
            steps,
            heap,
            `Sift down from index ${index}.`,
            [index],
        );

        siftDown(heap, index, type, steps);
    }

    recordStep(steps, heap, "Heap construction is complete.");

    return steps;
}

/**
 * Records the snapshots produced while inserting a value.
 */
export function insertHeapSteps(
    values: number[],
    value: number,
    type: HeapType,
): HeapStep[] {
    const heap = [...values];
    const steps: HeapStep[] = [];

    recordStep(steps, heap, "Start with the existing heap.");

    heap.push(value);

    const insertedIndex = heap.length - 1;

    recordStep(
        steps,
        heap,
        `Insert ${value} at the end of the heap.`,
        [insertedIndex],
    );

    siftUp(heap, insertedIndex, type, steps);

    recordStep(steps, heap, "Insertion is complete.");

    return steps;
}

/**
 * Records the snapshots produced while extracting the root.
 */
export function extractRootSteps(
    values: number[],
    type: HeapType,
): HeapStep[] {
    const heap = [...values];
    const steps: HeapStep[] = [];

    recordStep(steps, heap, "Start with the current heap.");

    if (heap.length === 0) {
        recordStep(steps, heap, "The heap is empty. There is no root to extract.");
        return steps;
    }

    const root = heap[0];
    const last = heap.pop()!;

    if (heap.length === 0) {
        recordStep(steps, heap, `Extract root ${root}. The heap is now empty.`);
        return steps;
    }

    heap[0] = last;

    recordStep(
        steps,
        heap,
        `Extract root ${root} and move ${last} to the root.`,
        [0],
    );

    siftDown(heap, 0, type, steps);

    recordStep(steps, heap, "Root extraction is complete.");

    return steps;
}