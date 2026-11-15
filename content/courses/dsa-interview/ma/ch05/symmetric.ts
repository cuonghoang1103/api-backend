// @java: Symmetric.java
// LC 101 · Symmetric Tree — "same tree" between a subtree and the MIRROR of the other.

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

// #region giai
function isSymmetric(root: TreeNode | null): boolean {
  const mirror = (a: TreeNode | null, b: TreeNode | null): boolean => {
    if (a === null || b === null) return a === b;
    return a.val === b.val && mirror(a.left, b.right) && mirror(a.right, b.left);   // outer pair, inner pair
  };
  return root === null || mirror(root.left, root.right);
}
// #endregion

for (const a of [[1, 2, 2, 3, 4, 4, 3], [1, 2, 2, null, 3, null, 3], [1], [1, 2, 2, 2, null, 2]] as (number | null)[][]) {
  console.log(`isSymmetric(${JSON.stringify(a)}) = ${isSymmetric(build(a))}`);
}
