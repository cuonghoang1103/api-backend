// @java: SameInvert.java
// LC 100 · Same Tree, LC 101 idea, LC 226 · Invert Binary Tree — recursion on TWO trees, and recursion that rebuilds.

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

// Tree -> LeetCode array (level order, trailing nulls trimmed), to print results.
function toArr(root: TreeNode | null): (number | null)[] {
  const out: (number | null)[] = [];
  const q: (TreeNode | null)[] = [root];
  for (let h = 0; h < q.length; h++) {
    const n = q[h];
    if (n) { out.push(n.val); q.push(n.left, n.right); } else out.push(null);
  }
  while (out.length && out[out.length - 1] === null) out.pop();
  return out;
}

// #region same
function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
  if (p === null || q === null) return p === q;          // both empty: same; one empty: different
  return p.val === q.val && isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}
// #endregion

// #region invert
function invertTree(root: TreeNode | null): TreeNode | null {
  if (root === null) return null;
  const left = invertTree(root.left);
  const right = invertTree(root.right);
  root.left = right;                                     // swap AFTER both sides are inverted
  root.right = left;
  return root;
}
// #endregion

console.log(`isSameTree([1,2,3], [1,2,3]) = ${isSameTree(build([1, 2, 3]), build([1, 2, 3]))}`);
console.log(`isSameTree([1,2], [1,null,2]) = ${isSameTree(build([1, 2]), build([1, null, 2]))}`);
console.log(`isSameTree([], []) = ${isSameTree(build([]), build([]))}`);
for (const a of [[4, 2, 7, 1, 3, 6, 9], [2, 1, 3], [1, 2], []] as (number | null)[][]) {
  console.log(`invertTree(${JSON.stringify(a)}) = ${JSON.stringify(toArr(invertTree(build(a))))}`);
}
