// @thoi-gian
// Flood fill on a 1000 × 1000 grid that is ALL land (think: a big blank image and a paint-bucket click).
// Recursive DFS goes one call deeper per cell; the snake-shaped walk makes the depth reach ~10⁶.
const N = 1000;
const fresh = () => Array.from({ length: N }, () => new Uint8Array(N).fill(1));

// #region de-quy
let depth = 0, deepest = 0;
function fillRec(g: Uint8Array[], r: number, c: number): void {
  if (r < 0 || r >= N || c < 0 || c >= N || g[r][c] !== 1) return;
  g[r][c] = 2;
  depth++; if (depth > deepest) deepest = depth;     // instrumentation: how deep did we get?
  fillRec(g, r + 1, c); fillRec(g, r - 1, c); fillRec(g, r, c + 1); fillRec(g, r, c - 1);
  depth--;
}
// #endregion

// #region lap
function fillIter(g: Uint8Array[], r0: number, c0: number): number {
  const stack = [r0 * N + c0];                       // explicit stack on the HEAP: no call-stack limit
  g[r0][c0] = 2;
  let count = 0;
  while (stack.length > 0) {
    const cell = stack.pop()!;
    const r = Math.floor(cell / N), c = cell % N;
    count++;
    if (r + 1 < N && g[r + 1][c] === 1) { g[r + 1][c] = 2; stack.push(cell + N); }
    if (r - 1 >= 0 && g[r - 1][c] === 1) { g[r - 1][c] = 2; stack.push(cell - N); }
    if (c + 1 < N && g[r][c + 1] === 1) { g[r][c + 1] = 2; stack.push(cell + 1); }
    if (c - 1 >= 0 && g[r][c - 1] === 1) { g[r][c - 1] = 2; stack.push(cell - 1); }
  }
  return count;
}
// #endregion

function bfs(g: Uint8Array[]): number {
  const q = new Int32Array(N * N);
  let head = 0, tail = 0;
  q[tail++] = 0; g[0][0] = 2;
  while (head < tail) {
    const cell = q[head++], r = Math.floor(cell / N), c = cell % N;
    if (r + 1 < N && g[r + 1][c] === 1) { g[r + 1][c] = 2; q[tail++] = cell + N; }
    if (r - 1 >= 0 && g[r - 1][c] === 1) { g[r - 1][c] = 2; q[tail++] = cell - N; }
    if (c + 1 < N && g[r][c + 1] === 1) { g[r][c + 1] = 2; q[tail++] = cell + 1; }
    if (c - 1 >= 0 && g[r][c - 1] === 1) { g[r][c - 1] = 2; q[tail++] = cell - 1; }
  }
  return tail;
}
const fmt = (x: number) => x.toLocaleString('en-US');
console.log(`grid ${N} x ${N} = ${fmt(N * N)} land cells`);
for (const label of ['recursive DFS, 1st call', 'recursive DFS, 2nd call']) {
  depth = 0; deepest = 0;
  try { fillRec(fresh(), 0, 0); console.log(`${label}: ok, depth ${fmt(deepest)}`); }
  catch (e) { console.log(`${label}: ${(e as Error).constructor.name} at depth ${fmt(deepest)}`); }
}
let best = Infinity, cnt = 0;
for (let k = 0; k < 3; k++) { const g = fresh(); const t = performance.now(); cnt = fillIter(g, 0, 0); best = Math.min(best, performance.now() - t); }
console.log(`iterative DFS (own stack): ${fmt(cnt)} cells in ${best.toFixed(1)} ms`);
best = Infinity;
for (let k = 0; k < 3; k++) { const g = fresh(); const t = performance.now(); cnt = bfs(g); best = Math.min(best, performance.now() - t); }
console.log(`BFS (head index)         : ${fmt(cnt)} cells in ${best.toFixed(1)} ms`);
console.log(`node ${process.version} · ${process.arch}`);
