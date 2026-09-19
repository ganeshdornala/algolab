import {
    sampleWeightedGraph,
    type WeightedGraph,
} from "./dijkstra";

export type AStarStep = {
    current: number;
    gScores: Record<number, number>;
    fScores: Record<number, number>;
    visited: number[];
    openSet: number[];
    previous: Record<number, number | null>;
    traversedEdges: [number, number][];
    path: number[];
};

function reconstructPath(
    previous: Record<number, number | null>,
    start: number,
    goal: number,
): number[] {
    const path: number[] = [];
    let current: number | null = goal;

    while (current !== null) {
        path.unshift(current);

        if (current === start) {
            return path;
        }

        current = previous[current] ?? null;
    }

    return [];
}

export function aStar(
    graph: WeightedGraph,
    start: number,
    goal: number,
    heuristic: Record<number, number>,
): AStarStep[] {
    if (!(start in graph)) {
        throw new Error(`Start node ${start} does not exist`);
    }

    if (!(goal in graph)) {
        throw new Error(`Goal node ${goal} does not exist`);
    }

    for (const [node, neighbors] of Object.entries(graph)) {
        if (heuristic[Number(node)] === undefined) {
            throw new Error(`Missing heuristic for node ${node}`);
        }

        if (heuristic[Number(node)] < 0) {
            throw new Error("Heuristic values must be non-negative");
        }

        for (const edge of neighbors) {
            if (edge.weight < 0) {
                throw new Error("A* requires non-negative edge weights");
            }
        }
    }

    const gScores: Record<number, number> = {};
    const fScores: Record<number, number> = {};
    const previous: Record<number, number | null> = {};

    for (const node of Object.keys(graph).map(Number)) {
        gScores[node] = Infinity;
        fScores[node] = Infinity;
        previous[node] = null;
    }

    gScores[start] = 0;
    fScores[start] = heuristic[start];

    const openSet = new Set<number>([start]);
    const visited = new Set<number>();
    const traversedEdges: [number, number][] = [];
    const steps: AStarStep[] = [];

    while (openSet.size > 0) {
        let current = -1;
        let lowestFScore = Infinity;

        for (const node of openSet) {
            if (fScores[node] < lowestFScore) {
                lowestFScore = fScores[node];
                current = node;
            }
        }

        if (current === -1) {
            break;
        }

        openSet.delete(current);
        visited.add(current);

        if (current === goal) {
            steps.push({
                current,
                gScores: { ...gScores },
                fScores: { ...fScores },
                visited: [...visited],
                openSet: [...openSet],
                previous: { ...previous },
                traversedEdges: [...traversedEdges],
                path: reconstructPath(previous, start, goal),
            });

            break;
        }

        for (const edge of graph[current]) {
            const neighbor = edge.node;

            if (visited.has(neighbor)) {
                continue;
            }

            const tentativeGScore = gScores[current] + edge.weight;

            if (tentativeGScore < gScores[neighbor]) {
                previous[neighbor] = current;
                gScores[neighbor] = tentativeGScore;
                fScores[neighbor] =
                    tentativeGScore + heuristic[neighbor];

                openSet.add(neighbor);
                traversedEdges.push([current, neighbor]);
            }
        }

        steps.push({
            current,
            gScores: { ...gScores },
            fScores: { ...fScores },
            visited: [...visited],
            openSet: [...openSet],
            previous: { ...previous },
            traversedEdges: [...traversedEdges],
            path: [],
        });
    }

    return steps;
}

// Heuristic estimates for the sample graph when searching toward node 5.
// These are non-negative estimates and do not exceed the actual
// shortest-path cost to node 5.
export const sampleHeuristic: Record<number, number> = {
    0: 10,
    1: 8,
    2: 8,
    3: 4,
    4: 2,
    5: 0,
};

export const sampleAStarSteps = aStar(
    sampleWeightedGraph,
    0,
    5,
    sampleHeuristic,
);