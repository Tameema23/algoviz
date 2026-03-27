# Algorithm Visualizer

An interactive 3D algorithm visualization platform covering sorting, pathfinding, graph, tree, and searching algorithms. Built with React and Three.js.

**Live:** [your-url.vercel.app](https://your-url.vercel.app)

![Algorithm Visualizer Demo](demo.gif)

---

## Algorithms Covered

**Sorting (3D animated bars via Three.js)**
Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort, Heap Sort

**Pathfinding (interactive grid — draw walls, drag nodes)**
BFS, DFS, Dijkstra's Algorithm, A*

**Graph**
BFS, DFS, Topological Sort, Cycle Detection

**Trees (Binary Search Tree)**
Insert, Search, Inorder, Preorder, Postorder Traversal

**Searching**
Linear Search, Binary Search

---

## Features

- 3D sorting bars rendered with Three.js via React Three Fiber — color-coded for comparing, swapping, pivot, and sorted states
- Interactive pathfinding grid — click and drag to draw walls, drag start/end nodes
- Interactive graph editor — add nodes, shift+click to connect edges, drag to reposition
- BST live insert and search with step-by-step animation and traversal order display
- Play, pause, step forward/back, speed control, and jump to end on every visualizer
- Pseudocode panel highlighting the exact line executing at each step
- Side-by-side comparison mode — run two sorting algorithms simultaneously on the same array
- Time and space complexity displayed for every algorithm

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18, Vite |
| 3D Rendering | Three.js, React Three Fiber, Drei |
| Animation | Framer Motion |
| State | Zustand |
| Routing | React Router v6 |
| Styling | Tailwind CSS v3 |
| Fonts | Syne, DM Sans, JetBrains Mono |
| Deployment | Vercel |

---

## Running Locally
```bash
git clone https://github.com/Tameema23/algorithm-visualizer.git
cd algorithm-visualizer
npm install
npm run dev
```

Open `http://localhost:5173`

---

## Deploying
```bash
npm install -g vercel
vercel
```

Vercel auto-detects Vite. The included `vercel.json` handles client-side routing.

---

## Author

Tameem Aboueldahab — [github.com/Tameema23](https://github.com/Tameema23)
