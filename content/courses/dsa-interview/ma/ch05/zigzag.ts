// @java: Zigzag.java
// LC 103 · Binary Tree Zigzag Level Order Traversal — same BFS, only the WRITE position changes.

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

// #region bfs
function zigzagLevelOrder(root: TreeNode | null): number[][] {
  const res: number[][] = [];
  const queue: TreeNode[] = root ? [root] : [];
  let head = 0;
  let leftToRight = true;
  while (head < queue.length) {
    const size = queue.length - head;
    const level: number[] = new Array(size);
    for (let k = 0; k < size; k++) {
      const node = queue[head++];
      level[leftToRight ? k : size - 1 - k] = node.val;   // queue order never changes; we write mirrored
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    res.push(level);
    leftToRight = !leftToRight;
  }
  return res;
}
// #endregion

for (const a of [[3, 9, 20, null, null, 15, 7], [1, 2, 3, 4, 5, null, 6], [1], []] as (number | null)[][]) {
  console.log(`zigzag(${JSON.stringify(a)}) = ${JSON.stringify(zigzagLevelOrder(build(a)))}`);
}
