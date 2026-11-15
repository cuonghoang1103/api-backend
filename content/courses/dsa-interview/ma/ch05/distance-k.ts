// @java: DistanceK.java
// LC 863 · All Nodes Distance K in Binary Tree — add parent links, then the tree is a graph: BFS from the target.

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

function find(root: TreeNode | null, v: number): TreeNode | null {
  if (root === null || root.val === v) return root;
  return find(root.left, v) ?? find(root.right, v);
}

// #region giai
function distanceK(root: TreeNode | null, target: TreeNode, k: number): number[] {
  const parent = new Map<TreeNode, TreeNode | null>();
  const stack: [TreeNode, TreeNode | null][] = root ? [[root, null]] : [];
  while (stack.length) {                                   // 1. remember every node's parent (iterative DFS)
    const [n, p] = stack.pop()!;
    parent.set(n, p);
    if (n.left) stack.push([n.left, n]);
    if (n.right) stack.push([n.right, n]);
  }
  const seen = new Set<TreeNode>([target]);                // 2. BFS in three directions: left, right, up
  let level: TreeNode[] = [target];
  for (let d = 0; d < k && level.length; d++) {
    const next: TreeNode[] = [];
    for (const n of level) {
      for (const m of [n.left, n.right, parent.get(n) ?? null]) {
        if (m && !seen.has(m)) { seen.add(m); next.push(m); }   // seen: a graph has cycles (child <-> parent)
      }
    }
    level = next;
  }
  return level.map((n) => n.val).sort((a, b) => a - b);   // sorted only to print a stable answer
}
// #endregion

const t = build([3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]);
for (const [target, k] of [[5, 2], [5, 0], [7, 3], [3, 3], [8, 5]]) {
  console.log(`distanceK(target=${target}, k=${k}) = ${JSON.stringify(distanceK(t, find(t, target)!, k))}`);
}
