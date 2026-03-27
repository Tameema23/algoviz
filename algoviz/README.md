# AlgoViz -- Algorithm Visualizer

An interactive 3D algorithm visualization platform covering sorting, pathfinding, graph, tree, and searching algorithms. Built with React, Three.js, and Framer Motion.

**Live:** [your-url-here.vercel.app](https://your-url-here.vercel.app)

---

## Algorithms Covered

**Sorting (3D Three.js bars):** Bubble, Selection, Insertion, Merge, Quick, Heap

**Pathfinding (interactive grid):** BFS, DFS, Dijkstra, A*

**Graph:** BFS, DFS, Topological Sort, Cycle Detection

**Trees (BST):** Insert, Search, Inorder, Preorder, Postorder

**Searching:** Linear Search, Binary Search

---

## Features

- 3D animated sorting bars via React Three Fiber
- Interactive pathfinding grid with drawable walls and draggable nodes
- Interactive graph editor -- add nodes, shift+click to connect edges
- BST live insert and traversal with step-by-step animation
- Play, pause, step forward/back, and speed controls on every visualizer
- Pseudocode panel highlighting the active line at each step
- Time and space complexity shown for every algorithm

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

## Deploying to Vercel
```bash
npm install -g vercel
vercel
```

Vercel auto-detects Vite. The included `vercel.json` handles client-side routing so direct URL navigation works correctly.

---

## Project Structure
```
src/
  algorithms/
    sorting/        -- Step generators for all 6 sorting algorithms
    pathfinding/    -- BFS, DFS, Dijkstra, A* on a grid
    graph/          -- BFS, DFS, Topological Sort, Cycle Detection
    tree/           -- BST operations and traversals
    searching/      -- Linear and Binary Search
  components/
    sorting/        -- 3D Three.js visualizer
    pathfinding/    -- Interactive grid visualizer
    graph/          -- SVG graph editor
    tree/           -- SVG BST visualizer
    searching/      -- Bar chart visualizer
    ui/             -- Controls, PseudoCode, AlgoInfo, Layout, StepMessage
  pages/
    Landing.jsx     -- 3D animated hero landing page
  store/
    index.js        -- Zustand global playback state
  hooks/
    usePlayback.js  -- Animation interval hook
```

---

## Author

Tameem Aboueldahab -- [github.com/Tameema23](https://github.com/Tameema23)
```

---

After adding those three files your folder structure looks like this:
```
algoviz/
  .gitignore          <-- add this
  vercel.json         <-- add this
  README.md           <-- add this
  package.json
  vite.config.js
  tailwind.config.js
  index.html
  src/
  public/