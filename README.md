# AlgoLab — Algorithm Visualizer

AlgoLab is an interactive algorithm visualizer built with React, TypeScript, and Vite. It helps learners understand how algorithms work by displaying their operations step by step.

## Features

### Sorting Algorithms
Visualize the following sorting algorithms:

- Bubble Sort
- Selection Sort
- Insertion Sort
- Merge Sort
- Quick Sort

Features include step-by-step visualization, playback controls, speed controls, and a step counter.

### Binary Search
- Visualize Binary Search on a fixed, sorted array.
- Enter a target value to search for.
- Step through the search process using Previous and Next controls.
- View the current search range and result.

**Note:** Binary Search requires the array to be sorted in ascending order.

### Graph Traversal
Visualize:

- Breadth-First Search (BFS)
- Depth-First Search (DFS)

Follow the traversal process through the graph, including visited nodes, the current node, and the frontier.

### Shortest-Path Algorithms
Visualize:

- Dijkstra's Algorithm
- A* Search

Explore how the algorithms process a weighted graph and update distance or score information.

### Heap Operations
Explore both Min-Heaps and Max-Heaps.

Supported operations:

- Build Heap
- Insert
- Extract Root

Step through the operations and observe changes in the binary tree and array representations.

## Tech Stack

- React
- TypeScript
- Vite
- CSS
- Vitest

## Getting Started

### Prerequisites

Install the following:

- Node.js
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/ganeshdornala/algolab.git
```

Navigate to the project directory:

```bash
cd algolab
```

Install dependencies:

```bash
npm install
```

### Run the Development Server

```bash
npm run dev
```

Open the local URL displayed in the terminal.

### Run Tests

```bash
npm test
```

Vitest runs in watch mode by default. Press `q` to exit.

### Create a Production Build

```bash
npm run build
```

## Project Structure

```text
src/
├── graph/
│   ├── aStar.ts
│   ├── aStar.test.ts
│   ├── dijkstra.ts
│   ├── dijkstra.test.ts
│   ├── graphTraversal.ts
│   ├── graphTraversal.test.ts
│   └── GraphVisualizer.tsx
├── heap/
│   ├── heap.ts
│   ├── heap.test.ts
│   └── HeapVisualizer.tsx
├── searching/
│   └── binarySearch.ts
├── sorting/
│   └── sorting.ts
├── App.tsx
└── index.css
```

## Testing

The project includes automated tests for its algorithm implementations.

At the time of this README update, the test suite contains **96 passing tests across 6 test files**.

## Project Goals

AlgoLab is a learning-focused project intended to make core algorithms easier to explore and understand through visual representations.

The project is designed to remain lightweight and free to develop and use.

## License

No license has been specified yet.