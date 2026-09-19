import type { SortStep } from "./bubbleSort";

export function quickSort(input: number[]): SortStep[] {
    const array = [...input];
    const steps: SortStep[] = [];

    function partition(low: number, high: number): number {
        const pivot = array[high];
        let i = low;

        for (let j = low; j < high; j++) {
            steps.push({
                array: [...array],
                comparing: [j, high],
                operation: "compare",
            });

            if (array[j] < pivot) {
                [array[i], array[j]] = [array[j], array[i]];

                steps.push({
                    array: [...array],
                    comparing: [i, j],
                    operation: "swap",
                });

                i++;
            }
        }

        [array[i], array[high]] = [array[high], array[i]];

        steps.push({
            array: [...array],
            comparing: [i, high],
            operation: "swap",
        });

        return i;
    }

    function sort(low: number, high: number) {
        if (low >= high) {
            return;
        }

        const pivotIndex = partition(low, high);

        sort(low, pivotIndex - 1);
        sort(pivotIndex + 1, high);
    }

    sort(0, array.length - 1);

    return steps;
}