// @java: Rob3.java
// LC 337 · House Robber III — each node returns a PAIR to its parent: [best if I am robbed, best if I am not].

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
function rob(root: TreeNode | null): number {
  const go = (node: TreeNode | null): [number, number] => {
    if (node === null) return [0, 0];
    const [lRob, lSkip] = go(node.left);
    const [rRob, rSkip] = go(node.right);
    const robMe = node.val + lSkip + rSkip;                              // robbed: children must be skipped
    const skipMe = Math.max(lRob, lSkip) + Math.max(rRob, rSkip);        // skipped: each child chooses freely
    return [robMe, skipMe];
  };
  return Math.max(...go(root));
}
// #endregion

for (const a of [[3, 2, 3, null, 3, null, 1], [3, 4, 5, 1, 3, null, 1], [4, 1, null, 2, null, 3], []] as (number | null)[][]) {
  console.log(`rob(${JSON.stringify(a)}) = ${rob(build(a))}`);
}
