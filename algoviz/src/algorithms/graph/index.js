// Graph algorithms operating on adjacency list
// Returns steps array for visualization

export function graphBFS(adjList, start) {
  const steps = [];
  const visited = new Set();
  const queue = [start];
  visited.add(start);
  const order = [];

  while (queue.length) {
    const node = queue.shift();
    order.push(node);
    steps.push({ visited: new Set(visited), current: node, queue: [...queue], order: [...order] });
    for (const neighbor of (adjList[node] || [])) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return steps;
}

export function graphDFS(adjList, start) {
  const steps = [];
  const visited = new Set();
  const order = [];
  const stack = [];

  function dfs(node) {
    visited.add(node);
    stack.push(node);
    order.push(node);
    steps.push({ visited: new Set(visited), current: node, stack: [...stack], order: [...order] });
    for (const neighbor of (adjList[node] || [])) {
      if (!visited.has(neighbor)) dfs(neighbor);
    }
    stack.pop();
  }

  dfs(start);
  return steps;
}

export function topologicalSort(adjList, nodes) {
  const steps = [];
  const visited = new Set();
  const result = [];
  const inStack = new Set();

  function dfs(node) {
    visited.add(node);
    inStack.add(node);
    steps.push({ visited: new Set(visited), current: node, result: [...result], inStack: new Set(inStack) });
    for (const neighbor of (adjList[node] || [])) {
      if (!visited.has(neighbor)) dfs(neighbor);
    }
    inStack.delete(node);
    result.unshift(node);
    steps.push({ visited: new Set(visited), current: node, result: [...result], inStack: new Set(inStack) });
  }

  for (const node of nodes) {
    if (!visited.has(node)) dfs(node);
  }
  return steps;
}

export function detectCycle(adjList, nodes) {
  const steps = [];
  const visited = new Set();
  const inStack = new Set();
  let cycleFound = false;

  function dfs(node) {
    if (cycleFound) return;
    visited.add(node);
    inStack.add(node);
    steps.push({ visited: new Set(visited), current: node, inStack: new Set(inStack), cycleFound });
    for (const neighbor of (adjList[node] || [])) {
      if (inStack.has(neighbor)) {
        cycleFound = true;
        steps.push({ visited: new Set(visited), current: node, inStack: new Set(inStack), cycleFound, cycleNode: neighbor });
        return;
      }
      if (!visited.has(neighbor)) dfs(neighbor);
    }
    inStack.delete(node);
  }

  for (const node of nodes) {
    if (!visited.has(node)) dfs(node);
  }
  return steps;
}

export const GRAPH_ALGORITHMS = {
  bfs: { name: 'Graph BFS', fn: graphBFS, time: 'O(V+E)', space: 'O(V)', description: 'Level-by-level traversal using a queue. Finds shortest path in unweighted graphs.', pseudocode: ['queue = [start]', 'visited = {start}', 'while queue:', '  node = queue.dequeue()', '  process(node)', '  for neighbor in adj[node]:', '    if neighbor not visited:', '      queue.enqueue(neighbor)'] },
  dfs: { name: 'Graph DFS', fn: graphDFS, time: 'O(V+E)', space: 'O(V)', description: 'Deep traversal using recursion or a stack. Used for cycle detection, topological sort, connectivity.', pseudocode: ['dfs(node):', '  visited.add(node)', '  process(node)', '  for neighbor in adj[node]:', '    if neighbor not visited:', '      dfs(neighbor)'] },
  topological: { name: 'Topological Sort', fn: topologicalSort, time: 'O(V+E)', space: 'O(V)', description: 'Linear ordering of vertices in a DAG. Used for dependency resolution and scheduling.', pseudocode: ['for each unvisited node:', '  dfs(node)', 'dfs(node):', '  mark visited', '  recurse on neighbors', '  prepend node to result'] },
  cycle: { name: 'Cycle Detection', fn: detectCycle, time: 'O(V+E)', space: 'O(V)', description: 'Detects if a directed graph contains a cycle using DFS with a recursion stack.', pseudocode: ['dfs(node):', '  add to visited + stack', '  for neighbor:', '    if in stack: CYCLE!', '    if unvisited: dfs(neighbor)', '  remove from stack'] },
};
