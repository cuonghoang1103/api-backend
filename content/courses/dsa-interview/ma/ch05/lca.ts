// @java: Lca.java
// LC 236 · Lowest Common Ancestor of a Binary Tree — post-order: "what did you find below you?"

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

function find(root: TreeNode | null, v: number): TreeNode | null {
  if (root === null || root.val === v) return root;
  return find(root.left, v) ?? find(root.right, v);
}

// #region giai
function lowestCommonAncestor(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {
  if (root === null || root === p || root === q) return root;   // found one (or nothing) here
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  if (left !== null && right !== null) return root;             // one on each side: I am the split point
  return left ?? right;                                         // pass up whatever was found
}
// #endregion

const t = build([3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]);
for (const [p, q] of [[5, 1], [5, 4], [7, 8], [6, 4], [7, 7]]) {
  console.log(`lca(${p}, ${q}) = ${lowestCommonAncestor(t, find(t, p)!, find(t, q)!)!.val}`);
}
