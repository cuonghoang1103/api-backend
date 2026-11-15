// @thoi-gian
// A plain BST is only as fast as its HEIGHT. Insert n keys in sorted order (height n) vs shuffled (height ~ log n).
class Node { key: number; left: Node | null = null; right: Node | null = null; constructor(k: number) { this.key = k; } }

// #region chen-lap
function insert(root: Node | null, key: number): Node {     // iterative, so a chain cannot overflow the stack
  const fresh = new Node(key);
  if (root === null) return fresh;
  let cur = root;
  for (;;) {
    if (key < cur.key) { if (cur.left === null) { cur.left = fresh; break; } cur = cur.left; }
    else { if (cur.right === null) { cur.right = fresh; break; } cur = cur.right; }
  }
  return root;
}
// #endregion
function height(root: Node | null): number {                // BFS by levels (no recursion)
  let h = 0, level = root ? [root] : [];
  while (level.length) { h++; const next: Node[] = []; for (const n of level) { if (n.left) next.push(n.left); if (n.right) next.push(n.right); } level = next; }
  return h;
}
function shuffled(n: number): number[] {                    // deterministic Fisher-Yates (Park-Miller generator, same as Java)
  const a = Array.from({ length: n }, (_, i) => i);
  let s = 12345;
  for (let i = n - 1; i > 0; i--) { s = (s * 48271) % 2147483647; const j = s % (i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function run(keys: number[]): { ms: number; h: number } {
  let best = Infinity, root: Node | null = null;
  for (let k = 0; k < 2; k++) {
    const t = performance.now();
    root = null;
    for (const x of keys) root = insert(root, x);
    best = Math.min(best, performance.now() - t);
  }
  return { ms: best, h: height(root) };
}
const pad = (s: string | number, w: number) => String(s).padStart(w);
console.log(`${pad('n', 9)} | ${pad('sorted: time', 13)} ${pad('height', 7)} | ${pad('shuffled: time', 15)} ${pad('height', 7)}`);
for (const n of [1_000, 10_000, 50_000, 1_000_000]) {
  const s = n <= 50_000 ? run(Array.from({ length: n }, (_, i) => i)) : null;
  const r = run(shuffled(n));
  console.log(`${pad(n.toLocaleString('en-US'), 9)} | ${pad(s ? s.ms.toFixed(1) + ' ms' : 'skipped', 13)} ${pad(s ? s.h.toLocaleString('en-US') : '-', 7)} | ${pad(r.ms.toFixed(1) + ' ms', 15)} ${pad(r.h, 7)}`);
}
console.log(`node ${process.version} · ${process.arch}`);
