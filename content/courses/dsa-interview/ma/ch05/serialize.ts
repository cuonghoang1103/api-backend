// @java: Serialize.java
// LC 297 · Serialize and Deserialize Binary Tree — pre-order with an explicit marker for every null.

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

// #region codec
function serialize(root: TreeNode | null): string {
  const out: string[] = [];
  const go = (node: TreeNode | null): void => {
    if (node === null) { out.push('#'); return; }    // the null markers are what make it reversible
    out.push(String(node.val));
    go(node.left);
    go(node.right);
  };
  go(root);
  return out.join(',');
}

function deserialize(data: string): TreeNode | null {
  const tokens = data.split(',');
  let i = 0;                                          // shared cursor: each call consumes its own tokens
  const go = (): TreeNode | null => {
    const t = tokens[i++];
    if (t === '#') return null;
    const node = new TreeNode(Number(t));
    node.left = go();                                 // same order as serialize: root, left, right
    node.right = go();
    return node;
  };
  return go();
}
// #endregion

for (const a of [[1, 2, 3, null, null, 4, 5], [1, null, 2, 3], [-7], []] as (number | null)[][]) {
  const s = serialize(build(a));
  const back = toArr(deserialize(s));
  console.log(`${JSON.stringify(a)} -> "${s}" -> ${JSON.stringify(back)}  round-trip ok: ${JSON.stringify(back) === JSON.stringify(a)}`);
}
