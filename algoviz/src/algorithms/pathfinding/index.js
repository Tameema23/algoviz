// Grid pathfinding algorithms
// Each returns { visited: [[r,c],...], path: [[r,c],...] }

const DIRS = [[0,1],[1,0],[0,-1],[-1,0]];

export function bfsPath(grid, start, end) {
  const rows = grid.length, cols = grid[0].length;
  const visited = [];
  const queue = [[...start]];
  const seen = Array.from({length: rows}, () => Array(cols).fill(false));
  const prev = Array.from({length: rows}, () => Array(cols).fill(null));
  seen[start[0]][start[1]] = true;

  while (queue.length) {
    const [r, c] = queue.shift();
    visited.push([r, c]);
    if (r === end[0] && c === end[1]) break;
    for (const [dr, dc] of DIRS) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !seen[nr][nc] && grid[nr][nc] !== 1) {
        seen[nr][nc] = true;
        prev[nr][nc] = [r, c];
        queue.push([nr, nc]);
      }
    }
  }

  const path = [];
  let cur = [...end];
  while (cur && !(cur[0] === start[0] && cur[1] === start[1])) {
    path.unshift(cur);
    cur = prev[cur[0]][cur[1]];
  }
  if (cur) path.unshift(start);
  return { visited, path: path.length > 1 ? path : [] };
}

export function dfsPath(grid, start, end) {
  const rows = grid.length, cols = grid[0].length;
  const visited = [];
  const seen = Array.from({length: rows}, () => Array(cols).fill(false));
  const prev = Array.from({length: rows}, () => Array(cols).fill(null));
  let found = false;

  function dfs(r, c) {
    if (found) return;
    if (r < 0 || r >= rows || c < 0 || c >= cols || seen[r][c] || grid[r][c] === 1) return;
    seen[r][c] = true;
    visited.push([r, c]);
    if (r === end[0] && c === end[1]) { found = true; return; }
    for (const [dr, dc] of DIRS) {
      const nr = r + dr, nc = c + dc;
      if (!seen[nr] || seen[nr][nc] === undefined || !seen[nr][nc]) {
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !seen[nr][nc] && grid[nr][nc] !== 1) {
          prev[nr][nc] = [r, c];
          dfs(nr, nc);
        }
      }
    }
  }

  dfs(start[0], start[1]);

  const path = [];
  let cur = [...end];
  while (cur && !(cur[0] === start[0] && cur[1] === start[1])) {
    path.unshift(cur);
    const p = prev[cur[0]][cur[1]];
    if (!p) break;
    cur = p;
  }
  if (cur && cur[0] === start[0] && cur[1] === start[1]) path.unshift(start);
  return { visited, path: path.length > 1 ? path : [] };
}

export function dijkstra(grid, start, end) {
  const rows = grid.length, cols = grid[0].length;
  const visited = [];
  const dist = Array.from({length: rows}, () => Array(cols).fill(Infinity));
  const prev = Array.from({length: rows}, () => Array(cols).fill(null));
  dist[start[0]][start[1]] = 0;

  // Simple priority queue using array
  const pq = [[0, start[0], start[1]]];

  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, r, c] = pq.shift();
    if (d > dist[r][c]) continue;
    visited.push([r, c]);
    if (r === end[0] && c === end[1]) break;
    for (const [dr, dc] of DIRS) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] !== 1) {
        const nd = d + 1;
        if (nd < dist[nr][nc]) {
          dist[nr][nc] = nd;
          prev[nr][nc] = [r, c];
          pq.push([nd, nr, nc]);
        }
      }
    }
  }

  const path = [];
  let cur = [...end];
  while (cur && !(cur[0] === start[0] && cur[1] === start[1])) {
    path.unshift(cur);
    cur = prev[cur[0]][cur[1]];
  }
  if (cur) path.unshift(start);
  return { visited, path: path.length > 1 ? path : [] };
}

export function aStar(grid, start, end) {
  const rows = grid.length, cols = grid[0].length;
  const visited = [];
  const heuristic = (r, c) => Math.abs(r - end[0]) + Math.abs(c - end[1]);
  const g = Array.from({length: rows}, () => Array(cols).fill(Infinity));
  const f = Array.from({length: rows}, () => Array(cols).fill(Infinity));
  const prev = Array.from({length: rows}, () => Array(cols).fill(null));
  const open = new Set();

  g[start[0]][start[1]] = 0;
  f[start[0]][start[1]] = heuristic(start[0], start[1]);
  open.add(`${start[0]},${start[1]}`);

  while (open.size) {
    let cur = null, minF = Infinity;
    for (const key of open) {
      const [r, c] = key.split(',').map(Number);
      if (f[r][c] < minF) { minF = f[r][c]; cur = [r, c]; }
    }
    if (!cur) break;
    const [r, c] = cur;
    open.delete(`${r},${c}`);
    visited.push([r, c]);
    if (r === end[0] && c === end[1]) break;
    for (const [dr, dc] of DIRS) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] !== 1) {
        const ng = g[r][c] + 1;
        if (ng < g[nr][nc]) {
          g[nr][nc] = ng;
          f[nr][nc] = ng + heuristic(nr, nc);
          prev[nr][nc] = [r, c];
          open.add(`${nr},${nc}`);
        }
      }
    }
  }

  const path = [];
  let node = [...end];
  while (node && !(node[0] === start[0] && node[1] === start[1])) {
    path.unshift(node);
    node = prev[node[0]][node[1]];
  }
  if (node) path.unshift(start);
  return { visited, path: path.length > 1 ? path : [] };
}

export const PATHFINDING_ALGORITHMS = {
  bfs: { name: 'BFS', fn: bfsPath, time: 'O(V+E)', space: 'O(V)', description: 'Explores all neighbors at current depth before going deeper. Guarantees shortest path on unweighted graphs.', pseudocode: ['queue = [start]', 'while queue not empty', '  node = queue.dequeue()', '  for each neighbor', '    if not visited', '      queue.enqueue(neighbor)'] },
  dfs: { name: 'DFS', fn: dfsPath, time: 'O(V+E)', space: 'O(V)', description: 'Explores as far as possible before backtracking. Does not guarantee shortest path.', pseudocode: ['dfs(node)', '  mark visited', '  for each neighbor', '    if not visited', '      dfs(neighbor)'] },
  dijkstra: { name: "Dijkstra's", fn: dijkstra, time: 'O((V+E) log V)', space: 'O(V)', description: 'Finds shortest path using a priority queue. Guarantees optimal path on weighted graphs.', pseudocode: ['dist[start] = 0', 'pq = [(0, start)]', 'while pq not empty', '  (d, u) = pq.pop_min()', '  for each neighbor v', '    if d + w < dist[v]', '      dist[v] = d + w', '      pq.push((dist[v], v))'] },
  astar: { name: 'A*', fn: aStar, time: 'O(E)', space: 'O(V)', description: 'Uses heuristic (Manhattan distance) to guide search. Faster than Dijkstra on grids.', pseudocode: ['f(n) = g(n) + h(n)', 'open = {start}', 'while open not empty', '  n = lowest f in open', '  if n == end: return path', '  for each neighbor', '    update g, f if better'] },
};
