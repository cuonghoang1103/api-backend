// @thoi-gian
// How deep can recursion go before Node throws RangeError? A "tree" that is one long chain (each node has only a
// right child) makes the recursion depth equal to n. Compare with an iterative height on the same chain.
class TreeNode {
  val: number; left: TreeNode | null; right: TreeNode | null;
  constructor(val = 0) { this.val = val; this.left = null; this.right = null; }
}
const N = 1_000_000;
const root = new TreeNode(0);
let cur = root;
for (let i = 1; i < N; i++) { cur.right = new TreeNode(i); cur = cur.right; }

// #region de-quy
let deepest = 0;
function height(node: TreeNode | null, depth: number): number {
  if (depth > deepest) deepest = depth;          // instrumentation only: how far did we get?
  if (node === null) return 0;
  return 1 + Math.max(height(node.left, depth + 1), height(node.right, depth + 1));
}
// #endregion

// #region lap
function heightIter(root: TreeNode | null): number {
  let levels = 0;
  let level: TreeNode[] = root ? [root] : [];
  while (level.length > 0) {                     // BFS: one array per level, no recursion at all
    levels++;
    const next: TreeNode[] = [];
    for (const n of level) {
      if (n.left) next.push(n.left);
      if (n.right) next.push(n.right);
    }
    level = next;
  }
  return levels;
}
// #endregion

function tryRecursive(label: string): void {
  deepest = 0;
  try {
    const h = height(root, 0);
    console.log(`${label}: ok, height = ${h}`);
  } catch (e) {
    console.log(`${label}: ${(e as Error).constructor.name} at depth ${deepest.toLocaleString('en-US')}`);
  }
}
console.log(`chain of ${N.toLocaleString('en-US')} nodes`);
tryRecursive('recursive height, 1st call (cold)');
tryRecursive('recursive height, 2nd call       ');
// warm-up: let the JIT compile height() on a short chain, then try again
const short = new TreeNode(0);
let c2 = short;
for (let i = 1; i < 2000; i++) { c2.right = new TreeNode(i); c2 = c2.right; }
for (let k = 0; k < 20000; k++) height(short, 0);
tryRecursive('recursive height, after warm-up  ');
let best = Infinity, h = 0;
for (let k = 0; k < 5; k++) {
  const t = performance.now();
  h = heightIter(root);
  best = Math.min(best, performance.now() - t);
}
console.log(`iterative height: ${h.toLocaleString('en-US')} in ${best.toFixed(1)} ms`);
console.log(`node ${process.version} · ${process.arch}`);
