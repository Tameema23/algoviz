// BST operations and traversals with step generation

export class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
    this.id = Math.random().toString(36).slice(2);
  }
}

export function insertBST(root, val, steps = []) {
  if (!root) {
    const node = new TreeNode(val);
    steps.push({ action: 'insert', node: val, message: `Inserted ${val} as new node` });
    return { root: node, steps };
  }
  steps.push({ action: 'compare', node: root.val, target: val, message: `Compare ${val} with ${root.val}` });
  if (val < root.val) {
    steps.push({ action: 'goLeft', node: root.val, message: `${val} < ${root.val}, go left` });
    root.left = insertBSTHelper(root.left, val, steps);
  } else if (val > root.val) {
    steps.push({ action: 'goRight', node: root.val, message: `${val} > ${root.val}, go right` });
    root.right = insertBSTHelper(root.right, val, steps);
  } else {
    steps.push({ action: 'duplicate', node: root.val, message: `${val} already exists` });
  }
  return { root, steps };
}

export function insertBSTHelper(root, val, steps) {
  if (!root) {
    steps.push({ action: 'insert', node: val, message: `Inserted ${val}` });
    return new TreeNode(val);
  }
  steps.push({ action: 'compare', node: root.val, target: val, message: `Compare ${val} with ${root.val}` });
  if (val < root.val) {
    steps.push({ action: 'goLeft', node: root.val, message: `${val} < ${root.val}, go left` });
    root.left = insertBSTHelper(root.left, val, steps);
  } else if (val > root.val) {
    steps.push({ action: 'goRight', node: root.val, message: `${val} > ${root.val}, go right` });
    root.right = insertBSTHelper(root.right, val, steps);
  }
  return root;
}

export function searchBST(root, val) {
  const steps = [];
  let cur = root;
  while (cur) {
    steps.push({ action: 'compare', node: cur.val, target: val, message: `Compare ${val} with ${cur.val}` });
    if (val === cur.val) { steps.push({ action: 'found', node: cur.val, message: `Found ${val}!` }); break; }
    else if (val < cur.val) { steps.push({ action: 'goLeft', node: cur.val, message: `${val} < ${cur.val}, go left` }); cur = cur.left; }
    else { steps.push({ action: 'goRight', node: cur.val, message: `${val} > ${cur.val}, go right` }); cur = cur.right; }
  }
  if (!cur) steps.push({ action: 'notFound', message: `${val} not found` });
  return steps;
}

export function inorder(root) {
  const steps = [];
  function traverse(node) {
    if (!node) return;
    traverse(node.left);
    steps.push({ action: 'visit', node: node.val, message: `Visit ${node.val}` });
    traverse(node.right);
  }
  traverse(root);
  return steps;
}

export function preorder(root) {
  const steps = [];
  function traverse(node) {
    if (!node) return;
    steps.push({ action: 'visit', node: node.val, message: `Visit ${node.val}` });
    traverse(node.left);
    traverse(node.right);
  }
  traverse(root);
  return steps;
}

export function postorder(root) {
  const steps = [];
  function traverse(node) {
    if (!node) return;
    traverse(node.left);
    traverse(node.right);
    steps.push({ action: 'visit', node: node.val, message: `Visit ${node.val}` });
  }
  traverse(root);
  return steps;
}

export function buildDefaultTree() {
  const vals = [50, 30, 70, 20, 40, 60, 80];
  let root = null;
  const steps = [];
  for (const v of vals) {
    if (!root) { root = new TreeNode(v); }
    else { const r = insertBSTHelper(root, v, steps); }
  }
  return root;
}

// Convert tree to layout for rendering
export function treeToLayout(root) {
  if (!root) return { nodes: [], edges: [] };
  const nodes = [];
  const edges = [];

  function assign(node, x, y, spread) {
    if (!node) return;
    nodes.push({ id: node.id, val: node.val, x, y });
    if (node.left) {
      edges.push({ from: node.id, to: node.left.id, fx: x, fy: y, tx: x - spread, ty: y + 80 });
      assign(node.left, x - spread, y + 80, spread / 2);
    }
    if (node.right) {
      edges.push({ from: node.id, to: node.right.id, fx: x, fy: y, tx: x + spread, ty: y + 80 });
      assign(node.right, x + spread, y + 80, spread / 2);
    }
  }

  assign(root, 0, 0, 160);
  return { nodes, edges };
}

export const TREE_ALGORITHMS = {
  insert: { name: 'BST Insert', time: 'O(h)', space: 'O(1)', description: 'Inserts a value into a BST by comparing at each node and going left or right.', pseudocode: ['insert(node, val):', '  if node is null:', '    return new Node(val)', '  if val < node.val:', '    node.left = insert(node.left, val)', '  elif val > node.val:', '    node.right = insert(node.right, val)', '  return node'] },
  search: { name: 'BST Search', time: 'O(h)', space: 'O(1)', description: 'Searches for a value by comparing and navigating left/right.', pseudocode: ['search(node, val):', '  if node is null: return false', '  if val == node.val: return true', '  if val < node.val:', '    return search(node.left, val)', '  return search(node.right, val)'] },
  inorder: { name: 'Inorder', time: 'O(n)', space: 'O(h)', description: 'Left -> Root -> Right. Produces sorted output for BST.', pseudocode: ['inorder(node):', '  if node is null: return', '  inorder(node.left)', '  visit(node)', '  inorder(node.right)'] },
  preorder: { name: 'Preorder', time: 'O(n)', space: 'O(h)', description: 'Root -> Left -> Right. Used for tree serialization.', pseudocode: ['preorder(node):', '  if node is null: return', '  visit(node)', '  preorder(node.left)', '  preorder(node.right)'] },
  postorder: { name: 'Postorder', time: 'O(n)', space: 'O(h)', description: 'Left -> Right -> Root. Used for tree deletion.', pseudocode: ['postorder(node):', '  if node is null: return', '  postorder(node.left)', '  postorder(node.right)', '  visit(node)'] },
};
