export type SearchStep = {
    low: number
    high: number
    mid: number
    target: number
    status: 'checking' | 'found' | 'not-found'
}

export function binarySearch(
    array: number[],
    target: number
): SearchStep[] {
    const steps: SearchStep[] = []

    let low = 0
    let high = array.length - 1

    while (low <= high) {
        const mid = Math.floor((low + high) / 2)

        if (array[mid] === target) {
            steps.push({
                low,
                high,
                mid,
                target,
                status: 'found',
            })

            return steps
        }

        steps.push({
            low,
            high,
            mid,
            target,
            status: 'checking',
        })

        if (target < array[mid]) {
            high = mid - 1
        } else {
            low = mid + 1
        }
    }

    // The search range is empty, so the target was not found.
    steps.push({
        low,
        high,
        mid: -1,
        target,
        status: 'not-found',
    })

    return steps
}