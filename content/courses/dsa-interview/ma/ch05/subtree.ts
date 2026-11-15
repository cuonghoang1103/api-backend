// @java: Subtree.java
// LC 572 · Subtree of Another Tree — isSame at every node; and the serialize trick, with its delimiter trap.

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
function isSame(p: TreeNode | null, q: TreeNode | null): boolean {
  if (p === null || q === null) return p === q;
  return p.val === q.val && isSame(p.left, q.left) && isSame(p.right, q.right);
}
function isSubtree(root: TreeNode | null, subRoot: TreeNode | null): boolean {
  if (root === null) return subRoot === null;
  return isSame(root, subRoot) || isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}
// #endregion

// #region chuoi
function ser(n: TreeNode | null, out: string[], sep: boolean): void {
  if (n === null) { out.push(sep ? ',#' : '#'); return; }
  out.push(sep ? ',' + n.val : String(n.val));       // the leading ',' is what stops "12" from containing "2"
  ser(n.left, out, sep);
  ser(n.right, out, sep);
}
const key = (n: TreeNode | null, sep: boolean) => { const o: string[] = []; ser(n, o, sep); return o.join(sep ? '' : ','); };
function isSubtreeByString(root: TreeNode | null, sub: TreeNode | null, sep: boolean): boolean {
  return key(root, sep).includes(key(sub, sep));
}
// #endregion

const cases: [(number | null)[], (number | null)[]][] = [
  [[3, 4, 5, 1, 2], [4, 1, 2]],
  [[3, 4, 5, 1, 2, null, null, null, null, 0], [4, 1, 2]],
  [[1, 1], [1]],
  [[12], [2]],
];
for (const [a, b] of cases) {
  const r = build(a), s = build(b);
  console.log(`isSubtree(${JSON.stringify(a)}, ${JSON.stringify(b)}) = ${isSubtree(r, s)}   string, no delimiter = ${isSubtreeByString(r, s, false)}   string, delimiter = ${isSubtreeByString(r, s, true)}`);
}
