// @java: GoodNodes.java
// LC 1448 · Count Good Nodes in Binary Tree — top-down: pass the maximum seen on the path from the root.

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
function goodNodes(root: TreeNode | null): number {
  const go = (node: TreeNode | null, maxSoFar: number): number => {
    if (node === null) return 0;
    const good = node.val >= maxSoFar ? 1 : 0;          // >= : equal to the max still counts
    const m = Math.max(maxSoFar, node.val);
    return good + go(node.left, m) + go(node.right, m);  // down: the max; up: the count
  };
  return go(root, -Infinity);
}
// #endregion

for (const a of [[3, 1, 4, 3, null, 1, 5], [3, 3, null, 4, 2], [1], [-1, -2, -3]] as (number | null)[][]) {
  console.log(`goodNodes(${JSON.stringify(a)}) = ${goodNodes(build(a))}`);
}
