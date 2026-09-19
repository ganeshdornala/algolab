export type WeightedEdge = {
    node: number;
    weight: number;
};

export type WeightedGraph = Record<number, WeightedEdge[]>;

export type DijkstraStep = {
    current: number;
    distances: Record<number, number>;
    visited: number[];
    previous: Record<number, number | null>;
    traversedEdges: [number, number][];
};

export const sampleWeightedGraph: WeightedGraph = {
    0: [
        { node: 1, weight: 4 },
        { node: 2, weight: 2 },
    ],
    1: [
        { node: 0, weight: 4 },
        { node: 2, weight: 1 },
        { node: 3, weight: 5 },
    ],
    2: [
        { node: 0, weight: 2 },
        { node: 1, weight: 1 },
        { node: 3, weight: 8 },
        { node: 4, weight: 10 },
    ],
    3: [
        { node: 1, weight: 5 },
        { node: 2, weight: 8 },
        { node: 4, weight: 2 },
        { node: 5, weight: 6 },
    ],
    4: [
        { node: 2, weight: 10 },
        { node: 3, weight: 2 },
        { node: 5, weight: 3 },
    ],
    5: [
        { node: 3, weight: 6 },
        { node: 4, weight: 3 },
    ],
};

/**
 * Dijkstra's shortest-path algorithm.
 *
 * Uses a simple linear scan to select the unvisited node
 * with the smallest known distance.
 *
 * Assumes all edge weights are non-negative.
 */
export function dijkstra(
    graph: WeightedGraph,
    start: number,
): DijkstraStep[] {
    const nodes = Object.keys(graph).map(Number);

    if (!nodes.includes(start)) {
        throw new Error(`Starting node ${start} does not exist in the graph.`);
    }

    for (const edges of Object.values(graph)) {
        for (const edge of edges) {
            if (edge.weight < 0) {
                throw new Error("Dijkstra's algorithm requires non-negative edge weights.");
            }
        }
    }

    const distances: Record<number, number> = {};
    const previous: Record<number, number | null> = {};

    for (const node of nodes) {
        distances[node] = Infinity;
        previous[node] = null;
    }

    distances[start] = 0;

    const visited = new Set<number>();
    const visitedOrder: number[] = [];
    const traversedEdges: [number, number][] = [];
    const steps: DijkstraStep[] = [];

    while (visited.size < nodes.length) {
        let current = -1;
        let smallestDistance = Infinity;

        // Select the unvisited node with the smallest distance.
        for (const node of nodes) {
            if (
                !visited.has(node) &&
                distances[node] < smallestDistance
            ) {
                smallestDistance = distances[node];
                current = node;
            }
        }

        // No remaining reachable nodes.
        if (current === -1) {
            break;
        }

        visited.add(current);
        visitedOrder.push(current);

        // Relax the current node's outgoing edges.
        for (const edge of graph[current] ?? []) {
            const neighbor = edge.node;

            if (visited.has(neighbor)) {
                continue;
            }

            const newDistance = distances[current] + edge.weight;

            if (newDistance < distances[neighbor]) {
                distances[neighbor] = newDistance;
                previous[neighbor] = current;
                traversedEdges.push([current, neighbor]);
            }
        }

        steps.push({
            current,
            distances: { ...distances },
            visited: [...visitedOrder],
            previous: { ...previous },
            traversedEdges: [...traversedEdges],
        });
    }

    return steps;
}