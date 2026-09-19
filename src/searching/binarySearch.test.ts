import { describe, expect, it } from 'vitest'
import { binarySearch } from './binarySearch'

describe('binarySearch', () => {
    it('finds a target at the beginning', () => {
        const steps = binarySearch([1, 2, 3, 4, 5], 1)

        expect(steps[steps.length - 1].status).toBe('found')
        expect(steps[steps.length - 1].mid).toBe(0)
        expect([1, 2, 3, 4, 5][steps[steps.length - 1].mid]).toBe(1)
    })

    it('finds a target in the middle', () => {
        const steps = binarySearch([1, 2, 3, 4, 5], 3)

        expect(steps).toHaveLength(1)
        expect(steps[0].status).toBe('found')
        expect(steps[0].mid).toBe(2)
    })

    it('finds a target at the end', () => {
        const steps = binarySearch([1, 2, 3, 4, 5], 5)

        expect(steps[steps.length - 1].status).toBe('found')
        expect(steps[steps.length - 1].mid).toBe(4)
    })

    it('reports not-found when the target is smaller than all elements', () => {
        const steps = binarySearch([1, 2, 3, 4, 5], 0)

        expect(steps[steps.length - 1].status).toBe('not-found')
        expect(steps[steps.length - 1].mid).toBe(-1)
    })

    it('reports not-found when the target is larger than all elements', () => {
        const steps = binarySearch([1, 2, 3, 4, 5], 6)

        expect(steps[steps.length - 1].status).toBe('not-found')
        expect(steps[steps.length - 1].mid).toBe(-1)
    })

    it('reports not-found when the target is between elements', () => {
        const steps = binarySearch([1, 3, 5, 7], 4)

        expect(steps[steps.length - 1].status).toBe('not-found')
    })

    it('handles an empty array', () => {
        const steps = binarySearch([], 5)

        expect(steps).toHaveLength(1)
        expect(steps[0].status).toBe('not-found')
    })

    it('handles a single-element array when the target is found', () => {
        const steps = binarySearch([7], 7)

        expect(steps).toHaveLength(1)
        expect(steps[0].status).toBe('found')
        expect(steps[0].mid).toBe(0)
    })

    it('handles a single-element array when the target is absent', () => {
        const steps = binarySearch([7], 3)

        expect(steps[steps.length - 1].status).toBe('not-found')
    })

    it('finds a target in an array containing duplicates', () => {
        const array = [1, 2, 2, 2, 3]
        const steps = binarySearch(array, 2)
        const result = steps[steps.length - 1]

        expect(result.status).toBe('found')
        expect(array[result.mid]).toBe(2)
    })

    it('does not modify the original array', () => {
        const array = [1, 2, 3, 4, 5]
        const original = [...array]

        binarySearch(array, 4)

        expect(array).toEqual(original)
    })

    it('records valid indices and statuses in its steps', () => {
        const array = [1, 2, 3, 4, 5]
        const steps = binarySearch(array, 4)

        for (const step of steps) {
            expect(step.target).toBe(4)
            expect(['checking', 'found', 'not-found']).toContain(step.status)

            if (step.status === 'not-found') {
                expect(step.mid).toBe(-1)
            } else {
                expect(step.low).toBeGreaterThanOrEqual(0)
                expect(step.high).toBeLessThan(array.length)
                expect(step.mid).toBeGreaterThanOrEqual(step.low)
                expect(step.mid).toBeLessThanOrEqual(step.high)
                if (step.status === 'found') {
                    expect(array[step.mid]).toBe(4)
                } else {
                    expect(typeof array[step.mid]).toBe('number')
                }
            }
        }
    })
})