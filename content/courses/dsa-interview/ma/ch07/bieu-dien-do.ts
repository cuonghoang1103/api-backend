// @thoi-gian
// Adjacency MATRIX vs adjacency LIST on a SPARSE graph (every node has 4 out-arcs, E = 4V):
// build the structure, then BFS from node 0 and count reachable nodes. Matrix BFS scans a whole row per node: O(V²).
function arcs(V: number): Int32Array {
  const a = new Int32Array(V * 4);
  let x = 12345;
  const rnd = () => (x = (Math.imul(x, 1103515245) + 12345) & 0x7fffffff);
  for (let u = 0; u < V; u++) {
    a[u * 4] = (u + 1) % V;                          // a ring keeps everything reachable
    for (let k = 1; k < 4; k++) a[u * 4 + k] = rnd() % V;
  }
  return a;
}
function viaMatrix(V: number, A: Int32Array): number {
  const m = new Uint8Array(V * V);                   // V² cells, almost all zero
  for (let u = 0; u < V; u++) for (let k = 0; k < 4; k++) m[u * V + A[u * 4 + k]] = 1;
  const seen = new Uint8Array(V), q = new Int32Array(V);
  let head = 0, tail = 0, cnt = 1;
  q[tail++] = 0; seen[0] = 1;
  while (head < tail) {
    const u = q[head++];
    for (let v = 0; v < V; v++) if (m[u * V + v] && !seen[v]) { seen[v] = 1; cnt++; q[tail++] = v; }
  }
  return cnt;
}
function viaList(V: number, A: Int32Array): number {
  const adj: number[][] = Array.from({ length: V }, () => []);
  for (let u = 0; u < V; u++) for (let k = 0; k < 4; k++) adj[u].push(A[u * 4 + k]);
  const seen = new Uint8Array(V), q: number[] = [0];
  seen[0] = 1;
  let head = 0;
  while (head < q.length) {
    const u = q[head++];
    for (const v of adj[u]) if (!seen[v]) { seen[v] = 1; q.push(v); }
  }
  return q.length;
}
function ms(f: () => number, lap: number): [number, number] {
  let best = Infinity, r = 0;
  for (let k = 0; k < lap; k++) { const t = performance.now(); r = f(); best = Math.min(best, performance.now() - t); }
  return [best, r];
}
const pad = (s: string | number, w: number) => String(s).padStart(w);
const cells = (x: number) => { const e = Math.floor(Math.log10(x) + 1e-9); return (x / 10 ** e).toFixed(1) + 'e' + e; };   // 2.6e8 = 260 million
console.log(`${pad('V', 9)} | ${pad('matrix cells', 12)} | ${pad('list cells', 10)} | ${pad('matrix', 11)} | ${pad('list', 9)}`);
for (const V of [1_000, 4_000, 16_000, 100_000, 1_000_000]) {
  const A = arcs(V);
  const mat = V <= 16_000 ? ms(() => viaMatrix(V, A), V <= 4_000 ? 3 : 1) : null;
  const lst = ms(() => viaList(V, A), 3);
  if (mat && mat[1] !== lst[1]) throw new Error('mismatch');
  console.log(`${pad(V.toLocaleString('en-US'), 9)} | ${pad(cells(V * V), 12)} | ${pad(cells(V + 4 * V), 10)} | ${pad(mat ? mat[0].toFixed(1) + ' ms' : 'skipped', 11)} | ${pad(lst[0].toFixed(1) + ' ms', 9)}`);
}
console.log(`node ${process.version} · ${process.arch}`);
