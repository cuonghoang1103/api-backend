// @java: CanBang.java
// LC 110 · Balanced Binary Tree — naive O(n^2) vs one post-order pass with a -1 "already unbalanced" signal.

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

// #region ngay-tho
function height(node: TreeNode | null): number {
  return node === null ? 0 : 1 + Math.max(height(node.left), height(node.right));
}
function isBalancedNaive(root: TreeNode | null): boolean {
  if (root === null) return true;
  return Math.abs(height(root.left) - height(root.right)) <= 1    // height() re-walks the whole subtree
    && isBalancedNaive(root.left) && isBalancedNaive(root.right);
}
// #endregion

// #region mot-luot
function isBalanced(root: TreeNode | null): boolean {
  // Returns the height, or -1 meaning "somewhere below me is unbalanced".
  const check = (node: TreeNode | null): number => {
    if (node === null) return 0;
    const l = check(node.left);
    if (l === -1) return -1;                    // stop early: no need to look right
    const r = check(node.right);
    if (r === -1) return -1;
    if (Math.abs(l - r) > 1) return -1;
    return 1 + Math.max(l, r);
  };
  return check(root) !== -1;
}
// #endregion

const cases: (number | null)[][] = [
  [3, 9, 20, null, null, 15, 7],
  [1, 2, 2, 3, 3, null, null, 4, 4],
  [1, 2, 2, 3, null, null, 3, 4, null, null, 4],
  [],
];
for (const a of cases) {
  const t = build(a);
  console.log(`isBalanced(${JSON.stringify(a)}) = ${isBalanced(t)}   naive = ${isBalancedNaive(t)}`);
}
