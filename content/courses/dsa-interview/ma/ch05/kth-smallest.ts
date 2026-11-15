// @java: KthSmallest.java
// LC 230 · Kth Smallest Element in a BST — iterative in-order that stops after k pops.

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

// #region kth
function kthSmallest(root: TreeNode | null, k: number): number {
  const stack: TreeNode[] = [];
  let cur = root;
  while (cur !== null || stack.length > 0) {
    while (cur !== null) { stack.push(cur); cur = cur.left; }
    cur = stack.pop()!;
    k--;                                  // one more value in increasing order
    if (k === 0) return cur.val;          // stop: no need to visit the rest of the tree
    cur = cur.right;
  }
  return -1;                              // k > number of nodes (the problem promises it never happens)
}
// #endregion

const cases: [(number | null)[], number][] = [[[3, 1, 4, null, 2], 1], [[5, 3, 6, 2, 4, null, null, 1], 3], [[5, 3, 6, 2, 4, null, null, 1], 6], [[1], 1]];
for (const [a, k] of cases) console.log(`kthSmallest(${JSON.stringify(a)}, k=${k}) = ${kthSmallest(build(a), k)}`);
