// @java: RightSide.java
// LC 199 · Binary Tree Right Side View — BFS (last node of each level) and DFS (right child first).

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

// #region bfs
function rightSideView(root: TreeNode | null): number[] {
  const res: number[] = [];
  const queue: TreeNode[] = root ? [root] : [];
  let head = 0;
  while (head < queue.length) {
    const size = queue.length - head;
    for (let k = 0; k < size; k++) {
      const node = queue[head++];
      if (k === size - 1) res.push(node.val);   // the LAST node of the level is the one you see
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }
  return res;
}
// #endregion

// #region dfs
function rightSideViewDfs(root: TreeNode | null): number[] {
  const res: number[] = [];
  const go = (node: TreeNode | null, depth: number): void => {
    if (node === null) return;
    if (depth === res.length) res.push(node.val);  // first node we reach at a new depth
    go(node.right, depth + 1);                      // right first, so "first" = rightmost
    go(node.left, depth + 1);
  };
  go(root, 0);
  return res;
}
// #endregion

for (const a of [[1, 2, 3, null, 5, null, 4], [1, 2, 3, 4], [1, null, 3], []] as (number | null)[][]) {
  const t = build(a);
  console.log(`rightSideView(${JSON.stringify(a)}) = ${JSON.stringify(rightSideView(t))}   dfs = ${JSON.stringify(rightSideViewDfs(t))}`);
}
