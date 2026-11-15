// @java: BuildPreIn.java
// LC 105 · Construct Binary Tree from Preorder and Inorder Traversal — preorder gives the root, inorder splits the sides.

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

// #region giai
function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
  const pos = new Map<number, number>();
  inorder.forEach((v, i) => pos.set(v, i));        // value -> index in inorder: O(1) instead of indexOf O(n)
  let next = 0;                                     // cursor into preorder: the next root to create
  const make = (lo: number, hi: number): TreeNode | null => {   // build from inorder[lo..hi]
    if (lo > hi) return null;
    const val = preorder[next++];
    const mid = pos.get(val)!;
    const node = new TreeNode(val);
    node.left = make(lo, mid - 1);                  // LEFT first: preorder lists the whole left subtree next
    node.right = make(mid + 1, hi);
    return node;
  };
  return make(0, inorder.length - 1);
}
// #endregion

const cases: [number[], number[]][] = [[[3, 9, 20, 15, 7], [9, 3, 15, 20, 7]], [[-1], [-1]], [[1, 2, 3], [3, 2, 1]], [[1, 2, 4, 5, 3, 6], [4, 2, 5, 1, 3, 6]]];
for (const [p, i] of cases) console.log(`buildTree(${JSON.stringify(p)}, ${JSON.stringify(i)}) = ${JSON.stringify(toArr(buildTree(p, i)))}`);
