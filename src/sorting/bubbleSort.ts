export type SortStep = {
    array: number[];
    comparing: number[];
    operation: "compare" | "swap" | "write";
};

export function bubbleSort(input: number[]): SortStep[] {
    const array = [...input];
    const steps: SortStep[] = [];

    for (let i = 0; i < array.length - 1; i++) {
        let swapped = false;

        for (let j = 0; j < array.length - 1 - i; j++) {
            const comparing = [j, j + 1];

            steps.push({
                array: [...array],
                comparing,
                operation: "compare",
            });

            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];

                swapped = true;

                steps.push({
                    array: [...array],
                    comparing,
                    operation: "swap",
                });
            }
        }

        if (!swapped) {
            break;
        }
    }

    return steps;
}