// Pitfall: the level loop reads queue.length while the queue is changing.

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
function levelOrderWrong(root: TreeNode | null): number[][] {
  const res: number[][] = [];
  const queue: TreeNode[] = root ? [root] : [];
  while (queue.length > 0) {
    const level: number[] = [];
    for (let k = 0; k < queue.length; k++) {   // BUG: queue.length shrinks (shift) AND grows (push)
      const node = queue.shift()!;
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    res.push(level);
  }
  return res;
}
// #endregion

// #region dung
function levelOrderRight(root: TreeNode | null): number[][] {
  const res: number[][] = [];
  const queue: TreeNode[] = root ? [root] : [];
  while (queue.length > 0) {
    const size = queue.length;                  // frozen BEFORE the loop
    const level: number[] = [];
    for (let k = 0; k < size; k++) {
      const node = queue.shift()!;              // fine for interviews with small n; see lesson 3.2 for the O(n) cost
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    res.push(level);
  }
  return res;
}
// #endregion

for (const a of [[1, 2, 3, 4, 5, null, 6], [3, 9, 20, null, null, 15, 7], [1, 2, 3]] as (number | null)[][]) {
  const t = build(a);
  console.log(`tree ${JSON.stringify(a)}`);
  console.log(`  wrong = ${JSON.stringify(levelOrderWrong(t))}`);
  console.log(`  right = ${JSON.stringify(levelOrderRight(t))}`);
}
