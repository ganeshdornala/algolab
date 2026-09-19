export type Graph = Record<number, number[]>;

export type GraphEdge = [number, number];

export type TraversalStep = {
    visited: number[];
    current: number;
    frontier: number[];
    traversedEdges: GraphEdge[];
};

export const sampleGraph: Graph = {
    0: [1, 2],
    1: [0, 3, 4],
    2: [0, 5],
    3: [1],
    4: [1, 5],
    5: [2, 4],
};

/**
 * Breadth-First Search.
 * Uses a queue and explores nodes level by level.
 */
export function bfs(graph: Graph, start: number): TraversalStep[] {
    const steps: TraversalStep[] = [];
    const discovered = new Set<number>([start]);
    const visitedOrder: number[] = [];
    const queue: number[] = [start];
    const traversedEdges: GraphEdge[] = [];

    while (queue.length > 0) {
        const current = queue.shift()!;
        visitedOrder.push(current);

        for (const neighbor of graph[current] ?? []) {
            if (!discovered.has(neighbor)) {
                discovered.add(neighbor);
                queue.push(neighbor);
                traversedEdges.push([current, neighbor]);
            }
        }

        steps.push({
            visited: [...visitedOrder],
            current,
            frontier: [...queue],
            traversedEdges: [...traversedEdges],
        });
    }

    return steps;
}

/**
 * Depth-First Search.
 * Uses a stack to explore as far as possible along each branch.
 */
export function dfs(graph: Graph, start: number): TraversalStep[] {
    const steps: TraversalStep[] = [];
    const discovered = new Set<number>([start]);
    const visitedOrder: number[] = [];
    const stack: number[] = [start];
    const traversedEdges: GraphEdge[] = [];

    while (stack.length > 0) {
        const current = stack.pop()!;
        visitedOrder.push(current);

        const neighbors = graph[current] ?? [];

        // Reverse the neighbor order so the lower-numbered neighbor
        // is processed first when using the stack.
        for (let i = neighbors.length - 1; i >= 0; i--) {
            const neighbor = neighbors[i];

            if (!discovered.has(neighbor)) {
                discovered.add(neighbor);
                stack.push(neighbor);
                traversedEdges.push([current, neighbor]);
            }
        }

        steps.push({
            visited: [...visitedOrder],
            current,
            frontier: [...stack],
            traversedEdges: [...traversedEdges],
        });
    }

    return steps;
}