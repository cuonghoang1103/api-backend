// @java: PathSum.java
// LC 112 · Path Sum (top-down: pass the remaining sum) and LC 113 · Path Sum II (collect paths, undo on the way back).

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

// #region co-khong
function hasPathSum(root: TreeNode | null, targetSum: number): boolean {
  if (root === null) return false;                              // an empty tree has NO root-to-leaf path
  const rest = targetSum - root.val;
  if (root.left === null && root.right === null) return rest === 0;   // only a LEAF may end the path
  return hasPathSum(root.left, rest) || hasPathSum(root.right, rest);
}
// #endregion

// #region liet-ke
function pathSum(root: TreeNode | null, targetSum: number): number[][] {
  const res: number[][] = [];
  const path: number[] = [];
  const go = (node: TreeNode | null, rest: number): void => {
    if (node === null) return;
    path.push(node.val);                                         // choose
    rest -= node.val;
    if (node.left === null && node.right === null && rest === 0) res.push([...path]);   // COPY the path
    go(node.left, rest);
    go(node.right, rest);
    path.pop();                                                  // un-choose before returning to the parent
  };
  go(root, targetSum);
  return res;
}
// #endregion

const big = [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1];
const cases: [(number | null)[], number][] = [[big, 22], [[1, 2, 3], 5], [[1, 2], 1], [[], 0]];
for (const [a, s] of cases) {
  const t = build(a);
  console.log(`target ${s} on ${JSON.stringify(a)}: hasPathSum = ${hasPathSum(t, s)}, paths = ${JSON.stringify(pathSum(t, s))}`);
}
