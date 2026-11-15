// @java: MaxPathSum.java
// LC 124 · Binary Tree Maximum Path Sum — the diameter template with values instead of edge counts.

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

// #region gain
function maxPathSum(root: TreeNode | null): number {
  let best = -Infinity;                         // NOT 0: every value may be negative
  const gain = (node: TreeNode | null): number => {
    if (node === null) return 0;
    const l = Math.max(0, gain(node.left));     // a negative branch is better left out
    const r = Math.max(0, gain(node.right));
    best = Math.max(best, node.val + l + r);    // path that bends here (may use both sides)
    return node.val + Math.max(l, r);           // path the parent can extend (one side only)
  };
  gain(root);
  return best;
}
// #endregion

for (const a of [[1, 2, 3], [-10, 9, 20, null, null, 15, 7], [-3], [2, -1, -2], [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1]] as (number | null)[][]) {
  console.log(`maxPathSum(${JSON.stringify(a)}) = ${maxPathSum(build(a))}`);
}
