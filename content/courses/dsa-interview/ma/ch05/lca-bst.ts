// @java: LcaBst.java
// LC 235 · Lowest Common Ancestor of a Binary Search Tree — walk down until p and q are on different sides.

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

function find(root: TreeNode | null, v: number): TreeNode {
  let n = root;
  while (n !== null && n.val !== v) n = v < n.val ? n.left : n.right;
  return n!;
}

// #region lca
function lowestCommonAncestor(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {
  let node = root;
  while (node !== null) {
    if (p.val < node.val && q.val < node.val) node = node.left;          // both on the left
    else if (p.val > node.val && q.val > node.val) node = node.right;    // both on the right
    else return node;                                                     // they split here (or one IS here)
  }
  return null;
}
// #endregion

const t = build([6, 2, 8, 0, 4, 7, 9, null, null, 3, 5]);
for (const [p, q] of [[2, 8], [2, 4], [3, 5], [7, 9], [0, 5]]) {
  console.log(`lca(${p}, ${q}) = ${lowestCommonAncestor(t, find(t, p), find(t, q))!.val}`);
}
