// @java: LevelOrder.java
// LC 102 · Binary Tree Level Order Traversal — BFS with a queue, one inner loop per level.

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
function levelOrder(root: TreeNode | null): number[][] {
  const res: number[][] = [];
  if (root === null) return res;
  const queue: TreeNode[] = [root];
  let head = 0;                          // index of the front: O(1) dequeue (no Array.shift)
  while (head < queue.length) {
    const size = queue.length - head;    // FREEZE the size of this level before adding children
    const level: number[] = [];
    for (let k = 0; k < size; k++) {
      const node = queue[head++];
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    res.push(level);
  }
  return res;
}
// #endregion

for (const a of [[3, 9, 20, null, null, 15, 7], [1, 2, 3, 4, 5, null, 6], [1], []] as (number | null)[][]) {
  console.log(`levelOrder(${JSON.stringify(a)}) = ${JSON.stringify(levelOrder(build(a)))}`);
}
