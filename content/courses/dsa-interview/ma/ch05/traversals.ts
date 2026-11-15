// @java: Traversals.java
// LC 144 / 94 / 145 · Binary Tree Preorder / Inorder / Postorder Traversal — recursive and iterative.

// #region dung
class TreeNode {
  val: number; left: TreeNode | null; right: TreeNode | null;
  constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val; this.left = left; this.right = right;
  }
}
// LeetCode gives trees as a level-order array: [1,2,3,4,5,null,6].
// Read it with a queue: each node in the queue takes the next two slots as its left and right child.
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
// #endregion

// #region de-quy
function preorder(root: TreeNode | null, out: number[] = []): number[] {
  if (root === null) return out;
  out.push(root.val);              // visit BEFORE the children
  preorder(root.left, out);
  preorder(root.right, out);
  return out;
}
function inorder(root: TreeNode | null, out: number[] = []): number[] {
  if (root === null) return out;
  inorder(root.left, out);
  out.push(root.val);              // visit BETWEEN the children
  inorder(root.right, out);
  return out;
}
function postorder(root: TreeNode | null, out: number[] = []): number[] {
  if (root === null) return out;
  postorder(root.left, out);
  postorder(root.right, out);
  out.push(root.val);              // visit AFTER the children
  return out;
}
// #endregion

// #region pre-lap
function preorderIter(root: TreeNode | null): number[] {
  const out: number[] = [];
  const stack: TreeNode[] = root ? [root] : [];
  while (stack.length > 0) {
    const node = stack.pop()!;
    out.push(node.val);
    if (node.right) stack.push(node.right);   // push RIGHT first ...
    if (node.left) stack.push(node.left);     // ... so LEFT is popped first
  }
  return out;
}
// #endregion

// #region in-lap
function inorderIter(root: TreeNode | null): number[] {
  const out: number[] = [];
  const stack: TreeNode[] = [];
  let cur = root;
  while (cur !== null || stack.length > 0) {
    while (cur !== null) {        // 1. slide down-left, remembering the path
      stack.push(cur);
      cur = cur.left;
    }
    cur = stack.pop()!;           // 2. leftmost unvisited node
    out.push(cur.val);
    cur = cur.right;              // 3. then its right subtree
  }
  return out;
}
// #endregion

// #region post-lap
function postorderIter(root: TreeNode | null): number[] {
  // Post-order (L, R, root) is the REVERSE of (root, R, L) — a preorder that pushes left first.
  const out: number[] = [];
  const stack: TreeNode[] = root ? [root] : [];
  while (stack.length > 0) {
    const node = stack.pop()!;
    out.push(node.val);
    if (node.left) stack.push(node.left);
    if (node.right) stack.push(node.right);
  }
  return out.reverse();
}
// #endregion

for (const a of [[1, 2, 3, 4, 5, null, 6], [3, 9, 20, null, null, 15, 7], [1], []] as (number | null)[][]) {
  const t = build(a);
  console.log(`tree ${JSON.stringify(a)}`);
  console.log(`  preorder  = ${JSON.stringify(preorder(t))}  iterative = ${JSON.stringify(preorderIter(t))}`);
  console.log(`  inorder   = ${JSON.stringify(inorder(t))}  iterative = ${JSON.stringify(inorderIter(t))}`);
  console.log(`  postorder = ${JSON.stringify(postorder(t))}  iterative = ${JSON.stringify(postorderIter(t))}`);
}
