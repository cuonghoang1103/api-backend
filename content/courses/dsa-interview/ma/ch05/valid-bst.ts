// @java: ValidBst.java
// LC 98 · Validate Binary Search Tree — the "compare with children" trap, the range fix, and the in-order check.

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

// #region sai
function isValidBSTWrong(root: TreeNode | null): boolean {
  if (root === null) return true;
  if (root.left && root.left.val >= root.val) return false;     // only looks ONE level down
  if (root.right && root.right.val <= root.val) return false;
  return isValidBSTWrong(root.left) && isValidBSTWrong(root.right);
}
// #endregion

// #region khoang
function isValidBST(root: TreeNode | null): boolean {
  // Every node must lie strictly inside the open interval (lo, hi) inherited from ALL its ancestors.
  const ok = (node: TreeNode | null, lo: number | null, hi: number | null): boolean => {
    if (node === null) return true;
    if (lo !== null && node.val <= lo) return false;
    if (hi !== null && node.val >= hi) return false;
    return ok(node.left, lo, node.val) && ok(node.right, node.val, hi);   // going left tightens hi, right tightens lo
  };
  return ok(root, null, null);                  // null = "no bound yet", safer than ±2^31
}
// #endregion

// #region trung-thu-tu
function isValidBSTInorder(root: TreeNode | null): boolean {
  const stack: TreeNode[] = [];
  let cur = root;
  let prev: number | null = null;
  while (cur !== null || stack.length > 0) {
    while (cur !== null) { stack.push(cur); cur = cur.left; }
    cur = stack.pop()!;
    if (prev !== null && cur.val <= prev) return false;   // in-order of a BST is STRICTLY increasing
    prev = cur.val;
    cur = cur.right;
  }
  return true;
}
// #endregion

const cases: (number | null)[][] = [
  [2, 1, 3],
  [5, 1, 4, null, null, 3, 6],
  [5, 4, 6, null, null, 3, 7],
  [2, 2, 2],
  [2147483647],
  [-2147483648, null, 2147483647],
];
for (const a of cases) {
  const t = build(a);
  console.log(`${JSON.stringify(a)}: range = ${isValidBST(t)}, inorder = ${isValidBSTInorder(t)}, children-only = ${isValidBSTWrong(t)}`);
}
