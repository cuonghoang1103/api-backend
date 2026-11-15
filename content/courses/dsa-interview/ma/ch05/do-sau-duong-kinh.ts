// @java: DoSauDuongKinh.java
// LC 104 · Maximum Depth of Binary Tree (bottom-up and top-down) and LC 543 · Diameter of Binary Tree.

class TreeNode {
  val: number; left: TreeNode | null; right: TreeNode | null;
  constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val; this.left = left; this.right = right;
  }
}
function build(a: (number | null)[]): TreeNode | null {
  if (a.length === 0 || a[0] === null) return null;
  const root = new TreeNode(a[0]);
  const q: TreeNode[] = [root];
  let head = 0, i = 1;
  while (i < a.length) {
    const node = q[head++];
    if (a[i] !== null) { node.left = new TreeNode(a[i] as number); q.push(node.left); }
    i++;
    if (i < a.length && a[i] !== null) { node.right = new TreeNode(a[i] as number); q.push(node.right); }
    i++;
  }
  return root;
}

// #region duoi-len
// Bottom-up: "what do I return to my parent?" — the height of my subtree.
function maxDepth(root: TreeNode | null): number {
  if (root === null) return 0;                       // empty tree has height 0
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
// #endregion

// #region tren-xuong
// Top-down: "what do I receive from my parent?" — my depth; leaves report it to a shared answer.
function maxDepthTopDown(root: TreeNode | null): number {
  let best = 0;
  const go = (node: TreeNode | null, depth: number): void => {
    if (node === null) return;
    if (node.left === null && node.right === null) best = Math.max(best, depth);
    go(node.left, depth + 1);
    go(node.right, depth + 1);
  };
  go(root, 1);
  return best;
}
// #endregion

// #region duong-kinh
function diameterOfBinaryTree(root: TreeNode | null): number {
  let best = 0;                                  // longest path seen so far, in EDGES
  const height = (node: TreeNode | null): number => {
    if (node === null) return 0;
    const l = height(node.left);
    const r = height(node.right);
    best = Math.max(best, l + r);                // path that BENDS at this node
    return 1 + Math.max(l, r);                   // path my parent can EXTEND: one side only
  };
  height(root);
  return best;
}
// #endregion

const cases: (number | null)[][] = [
  [3, 9, 20, null, null, 15, 7],
  [1, 2, 3, 4, 5, null, 6],
  [1, 2],
  [1, 2, null, 3, 4, 5, null, null, 6, 7, null, null, 8],
  [],
];
for (const a of cases) {
  const t = build(a);
  console.log(`${JSON.stringify(a)}: maxDepth = ${maxDepth(t)} (top-down ${maxDepthTopDown(t)}), diameter = ${diameterOfBinaryTree(t)}`);
}
