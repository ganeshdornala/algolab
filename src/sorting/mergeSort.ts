import type { SortStep } from "./bubbleSort";

export function mergeSort(input: number[]): SortStep[] {
    const array = [...input];
    const steps: SortStep[] = [];

    function merge(left: number, middle: number, right: number) {
        const leftPart = array.slice(left, middle + 1);
        const rightPart = array.slice(middle + 1, right + 1);

        let i = 0;
        let j = 0;
        let k = left;

        while (i < leftPart.length && j < rightPart.length) {
            steps.push({
                array: [...array],
                comparing: [left + i, middle + 1 + j],
                operation: "compare",
            });

            if (leftPart[i] <= rightPart[j]) {
                array[k] = leftPart[i];
                i++;
            } else {
                array[k] = rightPart[j];
                j++;
            }

            steps.push({
                array: [...array],
                comparing: [k],
                operation: "write",
            });

            k++;
        }

        while (i < leftPart.length) {
            array[k] = leftPart[i];

            steps.push({
                array: [...array],
                comparing: [k],
                operation: "write",
            });

            i++;
            k++;
        }

        while (j < rightPart.length) {
            array[k] = rightPart[j];

            steps.push({
                array: [...array],
                comparing: [k],
                operation: "write",
            });

            j++;
            k++;
        }
    }

    function sort(left: number, right: number) {
        if (left >= right) {
            return;
        }

        const middle = Math.floor((left + right) / 2);

        sort(left, middle);
        sort(middle + 1, right);
        merge(left, middle, right);
    }

    sort(0, array.length - 1);

    return steps;
}