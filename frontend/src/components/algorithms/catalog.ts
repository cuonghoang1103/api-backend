/**
 * Algorithm catalog — original, tracer-instrumented implementations.
 * Each entry's `code` is executed by the engine (Array1DTracer / LogTracer / Tracer
 * are injected). Users can edit the code freely and re-run.
 */
export interface AlgoDef {
  id: string;
  name: string;
  category: string;
  description: string;
  code: string;
}

const bubble = `// Bubble Sort — repeatedly swap adjacent out-of-order pairs.
const array = new Array1DTracer('Array');
const log = new LogTracer('Console');
const D = [5, 2, 9, 1, 7, 3, 8, 4, 6];
array.set(D);
Tracer.delay();

for (let i = 0; i < D.length - 1; i++) {
  let swapped = false;
  for (let j = 0; j < D.length - 1 - i; j++) {
    array.select(j, j + 1);
    Tracer.delay();
    if (D[j] > D[j + 1]) {
      const t = D[j]; D[j] = D[j + 1]; D[j + 1] = t;
      array.set(D);
      array.patch(j); array.patch(j + 1);
      Tracer.delay();
      array.depatch(j); array.depatch(j + 1);
      swapped = true;
    }
    array.deselect(j, j + 1);
  }
  if (!swapped) break;
}
log.println('Sorted!');
Tracer.delay();`;

const selection = `// Selection Sort — pick the minimum of the rest, place it in front.
const array = new Array1DTracer('Array');
const log = new LogTracer('Console');
const D = [5, 2, 9, 1, 7, 3, 8, 4, 6];
array.set(D);
Tracer.delay();

for (let i = 0; i < D.length - 1; i++) {
  let min = i;
  array.select(i);
  for (let j = i + 1; j < D.length; j++) {
    array.select(j);
    Tracer.delay();
    if (D[j] < D[min]) { if (min !== i) array.deselect(min); min = j; }
    else array.deselect(j);
  }
  if (min !== i) {
    const t = D[i]; D[i] = D[min]; D[min] = t;
    array.set(D); array.patch(i); array.patch(min);
    Tracer.delay();
    array.depatch(i); array.depatch(min);
  }
  array.deselect(min); array.deselect(i);
}
log.println('Sorted!');
Tracer.delay();`;

const insertion = `// Insertion Sort — grow a sorted prefix, insert each next element.
const array = new Array1DTracer('Array');
const log = new LogTracer('Console');
const D = [5, 2, 9, 1, 7, 3, 8, 4, 6];
array.set(D);
Tracer.delay();

for (let i = 1; i < D.length; i++) {
  const key = D[i];
  let j = i - 1;
  array.select(i);
  Tracer.delay();
  while (j >= 0 && D[j] > key) {
    D[j + 1] = D[j];
    array.set(D); array.patch(j + 1);
    Tracer.delay();
    array.depatch(j + 1);
    j--;
  }
  D[j + 1] = key;
  array.set(D); array.patch(j + 1);
  Tracer.delay();
  array.depatch(j + 1); array.deselect(i);
}
log.println('Sorted!');
Tracer.delay();`;

const quick = `// Quick Sort — partition around a pivot, recurse on each side.
const array = new Array1DTracer('Array');
const log = new LogTracer('Console');
const D = [5, 2, 9, 1, 7, 3, 8, 4, 6];
array.set(D);
Tracer.delay();

function partition(lo, hi) {
  const pivot = D[hi];
  array.select(hi); // pivot
  let i = lo - 1;
  for (let j = lo; j < hi; j++) {
    array.select(j);
    Tracer.delay();
    if (D[j] < pivot) {
      i++;
      const t = D[i]; D[i] = D[j]; D[j] = t;
      array.set(D); array.patch(i); array.patch(j);
      Tracer.delay();
      array.depatch(i); array.depatch(j);
    }
    array.deselect(j);
  }
  const t = D[i + 1]; D[i + 1] = D[hi]; D[hi] = t;
  array.set(D); array.patch(i + 1); array.patch(hi);
  Tracer.delay();
  array.depatch(i + 1); array.depatch(hi);
  array.deselect(hi);
  return i + 1;
}
function quicksort(lo, hi) {
  if (lo < hi) {
    const p = partition(lo, hi);
    quicksort(lo, p - 1);
    quicksort(p + 1, hi);
  }
}
quicksort(0, D.length - 1);
log.println('Sorted!');
Tracer.delay();`;

const merge = `// Merge Sort — split, sort halves, merge them back.
const array = new Array1DTracer('Array');
const log = new LogTracer('Console');
const D = [5, 2, 9, 1, 7, 3, 8, 4, 6];
array.set(D);
Tracer.delay();

function mergesort(lo, hi) {
  if (hi - lo < 1) return;
  const mid = (lo + hi) >> 1;
  mergesort(lo, mid);
  mergesort(mid + 1, hi);
  const merged = [];
  let i = lo, j = mid + 1;
  while (i <= mid && j <= hi) {
    array.select(i); array.select(j);
    Tracer.delay();
    array.deselect(i); array.deselect(j);
    if (D[i] <= D[j]) merged.push(D[i++]); else merged.push(D[j++]);
  }
  while (i <= mid) merged.push(D[i++]);
  while (j <= hi) merged.push(D[j++]);
  for (let k = 0; k < merged.length; k++) {
    D[lo + k] = merged[k];
    array.set(D); array.patch(lo + k);
    Tracer.delay();
    array.depatch(lo + k);
  }
}
mergesort(0, D.length - 1);
log.println('Sorted!');
Tracer.delay();`;

const binarySearch = `// Binary Search — find a target in a SORTED array by halving.
const array = new Array1DTracer('Sorted array');
const log = new LogTracer('Console');
const D = [1, 3, 4, 6, 8, 9, 11, 14, 17, 20];
const target = 14;
array.set(D);
log.println('Searching for ' + target);
Tracer.delay();

let lo = 0, hi = D.length - 1, found = -1;
while (lo <= hi) {
  const mid = (lo + hi) >> 1;
  array.select(mid);
  Tracer.delay();
  if (D[mid] === target) { found = mid; array.patch(mid); Tracer.delay(); break; }
  array.deselect(mid);
  if (D[mid] < target) lo = mid + 1; else hi = mid - 1;
}
log.println(found >= 0 ? 'Found at index ' + found : 'Not found');
Tracer.delay();`;

// ─── Graph algorithms ───────────────────────────────────────────────────────
const GRAPH_SETUP = `
const graph = new GraphTracer('Graph');
const log = new LogTracer('Console');
const P = { A:[0.10,0.50], B:[0.35,0.18], C:[0.35,0.82], D:[0.62,0.18], E:[0.62,0.82], F:[0.88,0.50] };
for (const k in P) graph.addNode(k, null, P[k][0], P[k][1]);
const adj = { A:['B','C'], B:['A','D','E'], C:['A','E'], D:['B','F'], E:['B','C','F'], F:['D','E'] };
const seenEdge = new Set();
for (const u in adj) for (const v of adj[u]) { const key=[u,v].sort().join('-'); if(!seenEdge.has(key)){ seenEdge.add(key); graph.addEdge(u, v); } }
Tracer.delay();`;

const bfs = `// Breadth-First Search — explore level by level from a start node.
${GRAPH_SETUP}
const start = 'A';
const visited = new Set([start]);
const queue = [start];
graph.visit(start);
log.println('Start BFS at ' + start);
Tracer.delay();
while (queue.length) {
  const u = queue.shift();
  graph.select(u);
  Tracer.delay();
  for (const v of adj[u]) {
    if (!visited.has(v)) {
      visited.add(v);
      queue.push(v);
      graph.visit(v, u);
      log.println('Visit ' + v + ' from ' + u);
      Tracer.delay();
    }
  }
  graph.deselect(u);
}
log.println('BFS complete');
Tracer.delay();`;

const dfs = `// Depth-First Search — go as deep as possible, then backtrack.
${GRAPH_SETUP}
const start = 'A';
const visited = new Set();
log.println('Start DFS at ' + start);
function dfs(u, parent) {
  visited.add(u);
  graph.visit(u, parent);
  graph.select(u);
  log.println('Enter ' + u);
  Tracer.delay();
  for (const v of adj[u]) if (!visited.has(v)) dfs(v, u);
  graph.deselect(u);
  Tracer.delay();
}
dfs(start, null);
log.println('DFS complete');
Tracer.delay();`;

const dijkstra = `// Dijkstra — shortest paths from a source in a weighted graph.
const graph = new GraphTracer('Weighted graph');
const log = new LogTracer('Console');
const P = { A:[0.10,0.50], B:[0.35,0.18], C:[0.35,0.82], D:[0.62,0.18], E:[0.62,0.82], F:[0.88,0.50] };
for (const k in P) graph.addNode(k, null, P[k][0], P[k][1]);
const E = [['A','B',4],['A','C',2],['B','D',5],['C','B',1],['C','E',8],['D','F',3],['E','D',2],['E','F',6]];
for (const [u,v,w] of E) graph.addEdge(u, v, w);
const adj = {}; for (const k in P) adj[k]=[];
for (const [u,v,w] of E) adj[u].push([v,w]);
Tracer.delay();

const dist = {}; for (const k in P) dist[k] = Infinity;
const src = 'A'; dist[src] = 0;
graph.updateNode(src, 0);
const done = new Set();
log.println('Source ' + src);
Tracer.delay();
while (done.size < Object.keys(P).length) {
  let u = null, best = Infinity;
  for (const k in P) if (!done.has(k) && dist[k] < best) { best = dist[k]; u = k; }
  if (u == null) break;
  done.add(u);
  graph.visit(u); graph.select(u);
  Tracer.delay();
  for (const [v,w] of adj[u]) {
    if (dist[u] + w < dist[v]) {
      dist[v] = dist[u] + w;
      graph.visit(v, u, dist[v]);
      log.println('dist[' + v + '] = ' + dist[v]);
      Tracer.delay();
    }
  }
  graph.deselect(u);
}
log.println('Shortest distances: ' + JSON.stringify(dist));
Tracer.delay();`;

// ─── Dynamic programming (2-D tables) ───────────────────────────────────────
const knapsack = `// 0/1 Knapsack — max value within a weight capacity (DP table).
const table = new Array2DTracer('dp[item][capacity]');
const log = new LogTracer('Console');
const weights = [1, 3, 4, 5];
const values  = [1, 4, 5, 7];
const W = 7, n = weights.length;
const dp = Array.from({length: n + 1}, () => new Array(W + 1).fill(0));
table.set(dp);
log.println('Items w=' + JSON.stringify(weights) + ' v=' + JSON.stringify(values) + ', cap=' + W);
Tracer.delay();
for (let i = 1; i <= n; i++) {
  for (let c = 0; c <= W; c++) {
    table.select(i, c);
    if (weights[i - 1] <= c) {
      dp[i][c] = Math.max(dp[i - 1][c], values[i - 1] + dp[i - 1][c - weights[i - 1]]);
    } else {
      dp[i][c] = dp[i - 1][c];
    }
    table.set(dp); table.patch(i, c);
    Tracer.delay();
    table.deselect(i, c); table.depatch(i, c);
  }
}
log.println('Best value = ' + dp[n][W]);
Tracer.delay();`;

const lcs = `// Longest Common Subsequence — DP over two strings.
const table = new Array2DTracer('dp');
const log = new LogTracer('Console');
const a = 'AGCAT', b = 'GAC';
const dp = Array.from({length: a.length + 1}, () => new Array(b.length + 1).fill(0));
table.set(dp);
log.println('a="' + a + '"  b="' + b + '"');
Tracer.delay();
for (let i = 1; i <= a.length; i++) {
  for (let j = 1; j <= b.length; j++) {
    table.select(i, j);
    if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
    else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    table.set(dp); table.patch(i, j);
    Tracer.delay();
    table.deselect(i, j); table.depatch(i, j);
  }
}
log.println('LCS length = ' + dp[a.length][b.length]);
Tracer.delay();`;

const editDistance = `// Edit Distance (Levenshtein) — min edits to transform a → b.
const table = new Array2DTracer('dp');
const log = new LogTracer('Console');
const a = 'kitten', b = 'sitting';
const dp = Array.from({length: a.length + 1}, () => new Array(b.length + 1).fill(0));
for (let i = 0; i <= a.length; i++) dp[i][0] = i;
for (let j = 0; j <= b.length; j++) dp[0][j] = j;
table.set(dp);
log.println('a="' + a + '"  b="' + b + '"');
Tracer.delay();
for (let i = 1; i <= a.length; i++) {
  for (let j = 1; j <= b.length; j++) {
    table.select(i, j);
    if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];
    else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    table.set(dp); table.patch(i, j);
    Tracer.delay();
    table.deselect(i, j); table.depatch(i, j);
  }
}
log.println('Edit distance = ' + dp[a.length][b.length]);
Tracer.delay();`;

const heapSort = `// Heap Sort — build a max-heap, then repeatedly extract the max.
const array = new Array1DTracer('Array');
const log = new LogTracer('Console');
const D = [5, 2, 9, 1, 7, 3, 8, 4, 6];
array.set(D);
Tracer.delay();
const n = D.length;
function heapify(size, i) {
  let largest = i; const l = 2 * i + 1, r = 2 * i + 2;
  array.select(i);
  if (l < size) { array.select(l); if (D[l] > D[largest]) largest = l; }
  if (r < size) { array.select(r); if (D[r] > D[largest]) largest = r; }
  Tracer.delay();
  array.deselect(i); if (l < size) array.deselect(l); if (r < size) array.deselect(r);
  if (largest !== i) {
    const t = D[i]; D[i] = D[largest]; D[largest] = t;
    array.set(D); array.patch(i); array.patch(largest);
    Tracer.delay();
    array.depatch(i); array.depatch(largest);
    heapify(size, largest);
  }
}
for (let i = (n >> 1) - 1; i >= 0; i--) heapify(n, i);
for (let i = n - 1; i > 0; i--) {
  const t = D[0]; D[0] = D[i]; D[i] = t;
  array.set(D); array.patch(0); array.patch(i);
  Tracer.delay();
  array.depatch(0); array.depatch(i);
  heapify(i, 0);
}
log.println('Sorted!');
Tracer.delay();`;

const countingSort = `// Counting Sort — count occurrences, then rebuild in order.
const array = new Array1DTracer('Array');
const log = new LogTracer('Console');
const D = [4, 2, 2, 8, 3, 3, 1, 5];
array.set(D);
Tracer.delay();
const max = Math.max.apply(null, D);
const count = new Array(max + 1).fill(0);
for (let i = 0; i < D.length; i++) { array.select(i); Tracer.delay(); count[D[i]]++; array.deselect(i); }
log.println('Counts: ' + JSON.stringify(count));
let idx = 0;
for (let v = 0; v <= max; v++) {
  while (count[v] > 0) {
    D[idx] = v; count[v]--;
    array.set(D); array.patch(idx);
    Tracer.delay();
    array.depatch(idx); idx++;
  }
}
log.println('Sorted!');
Tracer.delay();`;

const topoSort = `// Topological Sort (Kahn's algorithm) — order a DAG by dependencies.
const graph = new GraphTracer('DAG', true);
const log = new LogTracer('Console');
const P = { A:[0.10,0.30], B:[0.10,0.70], C:[0.40,0.50], D:[0.40,0.85], E:[0.70,0.30], F:[0.90,0.60] };
for (const k in P) graph.addNode(k, null, P[k][0], P[k][1]);
const E = [['A','C'],['B','C'],['B','D'],['C','E'],['D','F'],['E','F']];
for (const [u,v] of E) graph.addEdge(u, v);
const adj = {}, indeg = {}; for (const k in P) { adj[k] = []; indeg[k] = 0; }
for (const [u,v] of E) { adj[u].push(v); indeg[v]++; }
Tracer.delay();
const queue = []; for (const k in P) if (indeg[k] === 0) queue.push(k);
const order = [];
while (queue.length) {
  const u = queue.shift();
  graph.visit(u); graph.select(u);
  order.push(u);
  log.println('Output ' + u);
  Tracer.delay();
  for (const v of adj[u]) { indeg[v]--; graph.select(v, u); if (indeg[v] === 0) queue.push(v); }
  graph.deselect(u);
}
log.println('Topological order: ' + order.join(' → '));
Tracer.delay();`;

const nQueens = `// N-Queens — place N queens so none attack; backtracking on the board.
const board = new Array2DTracer('Board (1 = queen)');
const log = new LogTracer('Console');
const N = 6;
const grid = Array.from({length: N}, () => new Array(N).fill(0));
board.set(grid);
Tracer.delay();
const cols = new Set(), d1 = new Set(), d2 = new Set();
let solved = false;
function place(row) {
  if (solved) return;
  if (row === N) { solved = true; log.println('Solution found!'); Tracer.delay(); return; }
  for (let c = 0; c < N; c++) {
    board.select(row, c);
    Tracer.delay();
    board.deselect(row, c);
    if (!cols.has(c) && !d1.has(row - c) && !d2.has(row + c)) {
      grid[row][c] = 1; cols.add(c); d1.add(row - c); d2.add(row + c);
      board.set(grid); board.patch(row, c);
      Tracer.delay();
      place(row + 1);
      if (solved) return;
      grid[row][c] = 0; cols.delete(c); d1.delete(row - c); d2.delete(row + c);
      board.set(grid); board.depatch(row, c);
      Tracer.delay();
    }
  }
}
place(0);
Tracer.delay();`;

const coinChange = `// Coin Change — fewest coins to make an amount (bottom-up DP).
const array = new Array1DTracer('dp[amount] = min coins');
const log = new LogTracer('Console');
const coins = [1, 3, 4];
const amount = 8;
const BIG = amount + 1;
const dp = new Array(amount + 1).fill(BIG);
dp[0] = 0;
array.set(dp);
log.println('Coins ' + JSON.stringify(coins) + ', target ' + amount);
Tracer.delay();
for (let a = 1; a <= amount; a++) {
  array.select(a);
  for (const c of coins) if (a - c >= 0 && dp[a - c] + 1 < dp[a]) dp[a] = dp[a - c] + 1;
  array.set(dp); array.patch(a);
  Tracer.delay();
  array.deselect(a); array.depatch(a);
}
log.println(dp[amount] >= BIG ? 'Impossible' : 'Min coins = ' + dp[amount]);
Tracer.delay();`;

const kruskal = `// Kruskal's MST — sort edges by weight, add if they don't form a cycle (union-find).
const graph = new GraphTracer('Graph', false);
const log = new LogTracer('Console');
const P = { A:[0.15,0.20], B:[0.50,0.10], C:[0.85,0.25], D:[0.20,0.75], E:[0.55,0.85], F:[0.88,0.70] };
for (const k in P) graph.addNode(k, null, P[k][0], P[k][1]);
const edges = [['A','B',4],['A','D',3],['B','C',5],['B','D',6],['C','F',4],['D','E',7],['E','F',2],['B','E',8]];
for (const [u,v,w] of edges) graph.addEdge(u, v, w);
Tracer.delay();
const parent = {}; for (const k in P) parent[k] = k;
function find(x) { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; }
const sorted = edges.slice().sort((a, b) => a[2] - b[2]);
let total = 0, count = 0; const need = Object.keys(P).length - 1;
for (const [u, v, w] of sorted) {
  graph.select(u); graph.select(v);
  Tracer.delay();
  const ru = find(u), rv = find(v);
  if (ru !== rv) {
    parent[ru] = rv; graph.visit(v, u);
    total += w; count++;
    log.println('Add ' + u + '-' + v + ' (w=' + w + ')');
  } else {
    log.println('Skip ' + u + '-' + v + ' — would make a cycle');
  }
  Tracer.delay();
  graph.deselect(u); graph.deselect(v);
  if (count === need) break;
}
log.println('MST total weight = ' + total);
Tracer.delay();`;

const aStar = `// A* Search — greedy best-first guided by g (cost so far) + h (heuristic to goal).
const graph = new GraphTracer('Graph', false);
const log = new LogTracer('Console');
const P = { A:[0.10,0.50], B:[0.35,0.20], C:[0.35,0.80], D:[0.65,0.20], E:[0.65,0.80], G:[0.90,0.50] };
for (const k in P) graph.addNode(k, null, P[k][0], P[k][1]);
const edges = [['A','B',2],['A','C',3],['B','D',4],['C','E',2],['D','G',3],['E','G',5],['B','E',6]];
const adj = {}; for (const k in P) adj[k] = [];
for (const [u,v,w] of edges) { graph.addEdge(u, v, w); adj[u].push([v,w]); adj[v].push([u,w]); }
Tracer.delay();
const goal = 'G';
function h(n) { const dx = P[n][0]-P[goal][0], dy = P[n][1]-P[goal][1]; return Math.round(Math.sqrt(dx*dx+dy*dy)*10); }
const g = { A: 0 }, came = {}; const open = ['A']; const closed = {};
while (open.length) {
  open.sort((a, b) => (g[a]+h(a)) - (g[b]+h(b)));
  const cur = open.shift();
  graph.visit(cur, came[cur]);
  log.println('Visit ' + cur + '  g=' + g[cur] + '  f=' + (g[cur]+h(cur)));
  Tracer.delay();
  if (cur === goal) { log.println('Reached goal ' + goal + '!'); break; }
  closed[cur] = true;
  for (const [nb, w] of adj[cur]) {
    if (closed[nb]) continue;
    const ng = g[cur] + w;
    if (g[nb] === undefined || ng < g[nb]) { g[nb] = ng; came[nb] = cur; if (open.indexOf(nb) < 0) open.push(nb); graph.select(nb); }
  }
  Tracer.delay();
  for (const [nb] of adj[cur]) if (!closed[nb]) graph.deselect(nb);
}
Tracer.delay();`;

const bellmanFord = `// Bellman-Ford — shortest paths from A, relaxing every edge V-1 times (handles negatives).
const graph = new GraphTracer('Directed graph', true);
const log = new LogTracer('Console');
const P = { A:[0.10,0.30], B:[0.40,0.15], C:[0.40,0.70], D:[0.75,0.30], E:[0.90,0.70] };
for (const k in P) graph.addNode(k, 0, P[k][0], P[k][1]);
const edges = [['A','B',6],['A','C',7],['B','C',8],['B','D',5],['B','E',-4],['C','D',-3],['C','E',9],['D','B',-2],['E','D',7]];
for (const [u,v,w] of edges) graph.addEdge(u, v, w);
const dist = {}; for (const k in P) dist[k] = Infinity; dist.A = 0;
graph.updateNode('A', 0);
Tracer.delay();
const V = Object.keys(P).length;
for (let i = 1; i < V; i++) {
  log.println('Pass ' + i);
  for (const [u, v, w] of edges) {
    if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
      dist[v] = dist[u] + w;
      graph.visit(v, u); graph.updateNode(v, dist[v]);
      Tracer.delay();
      graph.leave(v, u);
    }
  }
}
log.println('Distances from A: ' + JSON.stringify(dist));
Tracer.delay();`;

const sudoku = `// Sudoku Solver — backtracking: fill each empty cell with a valid digit, undo on dead ends.
const board = new Array2DTracer('Sudoku (0 = empty)');
const log = new LogTracer('Console');
const grid = [
  [5,3,0,6,7,8,9,0,2],
  [6,7,2,1,0,5,3,4,8],
  [0,9,8,3,4,2,5,6,7],
  [8,5,9,7,6,0,4,2,3],
  [4,2,6,0,0,3,7,9,1],
  [7,1,3,9,2,4,8,0,6],
  [9,0,1,5,3,7,2,8,4],
  [2,8,7,4,1,9,0,3,5],
  [0,4,5,2,0,6,1,7,9],
];
board.set(grid);
Tracer.delay();
function ok(r, c, v) {
  for (let i = 0; i < 9; i++) if (grid[r][i] === v || grid[i][c] === v) return false;
  const br = r - r % 3, bc = c - c % 3;
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (grid[br+i][bc+j] === v) return false;
  return true;
}
function solve() {
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
    if (grid[r][c] === 0) {
      board.select(r, c); Tracer.delay();
      for (let v = 1; v <= 9; v++) {
        if (ok(r, c, v)) {
          grid[r][c] = v; board.set(grid); board.patch(r, c); board.deselect(r, c);
          Tracer.delay();
          if (solve()) return true;
          grid[r][c] = 0; board.set(grid); board.depatch(r, c); board.select(r, c);
          Tracer.delay();
        }
      }
      board.deselect(r, c);
      return false;
    }
  }
  return true;
}
solve();
log.println('Solved!');
Tracer.delay();`;

const fibonacci = `// Fibonacci (tabulation) — build dp[i] = dp[i-1] + dp[i-2] from the bottom up.
const array = new Array1DTracer('dp (Fibonacci)');
const log = new LogTracer('Console');
const N = 12;
const dp = new Array(N + 1).fill(0);
dp[1] = 1;
array.set(dp);
Tracer.delay();
for (let i = 2; i <= N; i++) {
  array.select(i - 1); array.select(i - 2);
  Tracer.delay();
  dp[i] = dp[i - 1] + dp[i - 2];
  array.set(dp); array.patch(i);
  Tracer.delay();
  array.deselect(i - 1); array.deselect(i - 2); array.depatch(i);
}
log.println('fib(' + N + ') = ' + dp[N]);
Tracer.delay();`;

const kadane = `// Kadane's Algorithm — largest-sum contiguous subarray, shown on a ChartTracer.
const chart = new ChartTracer('Array (max subarray)');
const log = new LogTracer('Console');
const A = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
chart.set(A);
Tracer.delay();
let best = A[0], cur = A[0], s = 0, bi = 0, bj = 0;
for (let i = 1; i < A.length; i++) {
  chart.select(i);
  Tracer.delay();
  if (cur + A[i] < A[i]) { cur = A[i]; s = i; } else { cur += A[i]; }
  if (cur > best) { best = cur; bi = s; bj = i; }
  chart.deselect(i);
}
for (let k = bi; k <= bj; k++) chart.patch(k);
log.println('Max subarray sum = ' + best + '  (indices ' + bi + '..' + bj + ')');
Tracer.delay();`;

const MAZE_SETUP = `const MAZE = [
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,1,0,1,1,1,1,1,0],
  [0,0,0,0,1,0,0,0,0,0,1,0],
  [1,1,1,0,1,1,1,1,1,0,1,0],
  [0,0,1,0,0,0,0,0,1,0,0,0],
  [0,1,1,1,1,1,1,0,1,1,1,0],
  [0,0,0,0,0,0,1,0,0,0,0,0],
  [1,1,1,1,1,0,1,1,1,1,1,0],
];
const R = MAZE.length, C = MAZE[0].length;
const S = [0, 0], G = [R - 1, C - 1];
function key(r, c) { return r + ',' + c; }
function neighbors(r, c) { return [[r-1,c],[r+1,c],[r,c-1],[r,c+1]].filter(([nr,nc]) => nr>=0 && nc>=0 && nr<R && nc<C && MAZE[nr][nc]===0); }
function drawPath(grid, came) {
  let cur = [G[0], G[1]]; const path = [];
  while (cur) { path.push(cur); cur = came[key(cur[0], cur[1])]; }
  for (let i = path.length - 1; i >= 0; i--) { const [r, c] = path[i]; if (!(r===S[0]&&c===S[1]) && !(r===G[0]&&c===G[1])) grid.path(r, c); Tracer.delay(); }
  return path.length - 1;
}`;

const aStarGrid = `// A* Pathfinding on a grid — f = g (steps) + h (Manhattan distance to goal).
${MAZE_SETUP}
const grid = new GridTracer('A* pathfinding');
const log = new LogTracer('Console');
grid.set(MAZE); grid.start(S[0], S[1]); grid.goal(G[0], G[1]);
Tracer.delay();
function h(r, c) { return Math.abs(r - G[0]) + Math.abs(c - G[1]); }
const g = {}; g[key(S[0], S[1])] = 0;
const came = {}; const open = [[S[0], S[1]]]; const closed = {};
let found = false;
while (open.length) {
  open.sort((a, b) => (g[key(a[0],a[1])]+h(a[0],a[1])) - (g[key(b[0],b[1])]+h(b[0],b[1])));
  const [r, c] = open.shift();
  if (closed[key(r, c)]) continue;
  closed[key(r, c)] = true;
  if (!(r===S[0]&&c===S[1]) && !(r===G[0]&&c===G[1])) grid.visit(r, c);
  Tracer.delay();
  if (r===G[0] && c===G[1]) { found = true; break; }
  for (const [nr, nc] of neighbors(r, c)) {
    if (closed[key(nr, nc)]) continue;
    const ng = g[key(r, c)] + 1;
    if (g[key(nr, nc)] === undefined || ng < g[key(nr, nc)]) {
      g[key(nr, nc)] = ng; came[key(nr, nc)] = [r, c];
      open.push([nr, nc]);
      if (!(nr===G[0]&&nc===G[1])) grid.frontier(nr, nc);
    }
  }
  Tracer.delay();
}
log.println(found ? 'Path found! length ' + drawPath(grid, came) : 'No path.');
Tracer.delay();`;

const bfsGrid = `// BFS on a grid — explores in expanding rings; finds the shortest unweighted path.
${MAZE_SETUP}
const grid = new GridTracer('BFS flood-fill');
const log = new LogTracer('Console');
grid.set(MAZE); grid.start(S[0], S[1]); grid.goal(G[0], G[1]);
Tracer.delay();
const came = {}; const seen = {}; seen[key(S[0], S[1])] = true;
const queue = [[S[0], S[1]]];
let found = false;
while (queue.length) {
  const [r, c] = queue.shift();
  if (!(r===S[0]&&c===S[1]) && !(r===G[0]&&c===G[1])) grid.visit(r, c);
  Tracer.delay();
  if (r===G[0] && c===G[1]) { found = true; break; }
  for (const [nr, nc] of neighbors(r, c)) {
    if (seen[key(nr, nc)]) continue;
    seen[key(nr, nc)] = true; came[key(nr, nc)] = [r, c];
    queue.push([nr, nc]);
    if (!(nr===G[0]&&nc===G[1])) grid.frontier(nr, nc);
  }
  Tracer.delay();
}
log.println(found ? 'Path found! length ' + drawPath(grid, came) : 'No path.');
Tracer.delay();`;

const greedyGrid = `// Greedy Best-First — always expand the cell that *looks* closest (heuristic only).
${MAZE_SETUP}
const grid = new GridTracer('Greedy Best-First');
const log = new LogTracer('Console');
grid.set(MAZE); grid.start(S[0], S[1]); grid.goal(G[0], G[1]);
Tracer.delay();
function h(r, c) { return Math.abs(r - G[0]) + Math.abs(c - G[1]); }
const came = {}, seen = {}; seen[key(S[0], S[1])] = true;
const open = [[S[0], S[1]]];
let found = false;
while (open.length) {
  open.sort((a, b) => h(a[0], a[1]) - h(b[0], b[1]));
  const [r, c] = open.shift();
  if (!(r===S[0]&&c===S[1]) && !(r===G[0]&&c===G[1])) grid.visit(r, c);
  Tracer.delay();
  if (r===G[0] && c===G[1]) { found = true; break; }
  for (const [nr, nc] of neighbors(r, c)) {
    if (seen[key(nr, nc)]) continue;
    seen[key(nr, nc)] = true; came[key(nr, nc)] = [r, c]; open.push([nr, nc]);
    if (!(nr===G[0]&&nc===G[1])) grid.frontier(nr, nc);
  }
  Tracer.delay();
}
log.println(found ? 'Path found! length ' + drawPath(grid, came) + ' (not guaranteed shortest)' : 'No path.');
Tracer.delay();`;

const dfsGrid = `// DFS Maze — dive deep along one branch, backtrack at dead ends (path not shortest).
${MAZE_SETUP}
const grid = new GridTracer('DFS maze');
const log = new LogTracer('Console');
grid.set(MAZE); grid.start(S[0], S[1]); grid.goal(G[0], G[1]);
Tracer.delay();
const came = {}, seen = {}; seen[key(S[0], S[1])] = true;
const stack = [[S[0], S[1]]];
let found = false;
while (stack.length) {
  const [r, c] = stack.pop();
  if (!(r===S[0]&&c===S[1]) && !(r===G[0]&&c===G[1])) grid.visit(r, c);
  Tracer.delay();
  if (r===G[0] && c===G[1]) { found = true; break; }
  for (const [nr, nc] of neighbors(r, c)) {
    if (seen[key(nr, nc)]) continue;
    seen[key(nr, nc)] = true; came[key(nr, nc)] = [r, c]; stack.push([nr, nc]);
    if (!(nr===G[0]&&nc===G[1])) grid.frontier(nr, nc);
  }
  Tracer.delay();
}
log.println(found ? 'Path found! length ' + drawPath(grid, came) : 'No path.');
Tracer.delay();`;

const prim = `// Prim's MST — grow the tree from A, repeatedly adding the cheapest edge to a new node.
const graph = new GraphTracer('Graph', false);
const log = new LogTracer('Console');
const P = { A:[0.15,0.20], B:[0.50,0.10], C:[0.85,0.25], D:[0.20,0.75], E:[0.55,0.85], F:[0.88,0.70] };
for (const k in P) graph.addNode(k, null, P[k][0], P[k][1]);
const edges = [['A','B',4],['A','D',3],['B','C',5],['B','D',6],['C','F',4],['D','E',7],['E','F',2],['B','E',8]];
const adj = {}; for (const k in P) adj[k] = [];
for (const [u,v,w] of edges) { graph.addEdge(u, v, w); adj[u].push([v,w]); adj[v].push([u,w]); }
Tracer.delay();
const inTree = { A: true }; graph.visit('A');
const count = Object.keys(P).length; let total = 0;
for (let step = 1; step < count; step++) {
  let best = null;
  for (const u in inTree) {
    for (const [v, w] of adj[u]) { if (inTree[v]) continue; if (best === null || w < best[2]) best = [u, v, w]; }
  }
  if (!best) break;
  const [u, v, w] = best;
  graph.select(v); Tracer.delay();
  inTree[v] = true; graph.visit(v, u); total += w;
  log.println('Add ' + u + '-' + v + ' (w=' + w + ')');
  Tracer.delay(); graph.deselect(v);
}
log.println('MST total weight = ' + total);
Tracer.delay();`;

const floydWarshall = `// Floyd-Warshall — all-pairs shortest paths; relax dp[i][j] through each intermediate k.
const mat = new Array2DTracer('Distance matrix dp[i][j] (99 = ∞)');
const log = new LogTracer('Console');
const INF = 99;
const dist = [
  [0, 3, INF, 7, INF],
  [8, 0, 2, INF, INF],
  [5, INF, 0, 1, INF],
  [2, INF, INF, 0, 3],
  [INF, INF, 4, INF, 0],
];
const n = dist.length;
mat.set(dist);
Tracer.delay();
for (let k = 0; k < n; k++) {
  log.println('Route via node ' + k);
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    if (dist[i][k] + dist[k][j] < dist[i][j]) {
      dist[i][j] = dist[i][k] + dist[k][j];
      mat.set(dist); mat.patch(i, j);
      Tracer.delay();
      mat.depatch(i, j);
    }
  }
}
log.println('All-pairs done. dist[0][2] = ' + dist[0][2]);
Tracer.delay();`;

const dijkstraGrid = `// Dijkstra on a weighted grid — orange cells cost 5 to enter; find the cheapest path.
${MAZE_SETUP}
const grid = new GridTracer('Dijkstra (weighted terrain)');
const log = new LogTracer('Console');
grid.set(MAZE); grid.start(S[0], S[1]); grid.goal(G[0], G[1]);
const HEAVY = [[2,5],[2,6],[2,7],[4,5],[4,6],[4,7],[5,7],[6,7]];
const cost = {};
for (const [r, c] of HEAVY) if (MAZE[r][c] === 0) { cost[key(r, c)] = 5; grid.weight(r, c, 5); }
function w(r, c) { return cost[key(r, c)] || 1; }
Tracer.delay();
const dist = {}; dist[key(S[0], S[1])] = 0;
const came = {}; const pq = [[S[0], S[1]]]; const done = {};
let found = false;
while (pq.length) {
  pq.sort((a, b) => dist[key(a[0],a[1])] - dist[key(b[0],b[1])]);
  const [r, c] = pq.shift();
  if (done[key(r, c)]) continue;
  done[key(r, c)] = true;
  if (!(r===S[0]&&c===S[1]) && !(r===G[0]&&c===G[1])) grid.visit(r, c);
  Tracer.delay();
  if (r===G[0] && c===G[1]) { found = true; break; }
  for (const [nr, nc] of neighbors(r, c)) {
    if (done[key(nr, nc)]) continue;
    const nd = dist[key(r, c)] + w(nr, nc);
    if (dist[key(nr, nc)] === undefined || nd < dist[key(nr, nc)]) {
      dist[key(nr, nc)] = nd; came[key(nr, nc)] = [r, c]; pq.push([nr, nc]);
      if (!(nr===G[0]&&nc===G[1])) grid.frontier(nr, nc);
    }
  }
  Tracer.delay();
}
log.println(found ? 'Cheapest cost ' + dist[key(G[0],G[1])] + ' (path length ' + drawPath(grid, came) + ')' : 'No path.');
Tracer.delay();`;

const trie = `// Trie (prefix tree) — insert words, then search. Each node is labeled by its prefix.
const graph = new GraphTracer('Trie (prefix tree)', true);
const log = new LogTracer('Console');
const words = ['cat', 'car', 'can', 'dog', 'do'];
const root = { id: '·', children: {}, end: false };
function insert(word) {
  let node = root, pfx = '';
  for (const ch of word) {
    pfx += ch;
    if (!node.children[ch]) node.children[ch] = { id: pfx, children: {}, end: false };
    node = node.children[ch];
  }
  node.end = true;
}
for (const wd of words) insert(wd);
let col = 0, maxDepth = 0;
function layout(node, depth) {
  if (depth > maxDepth) maxDepth = depth;
  const kids = Object.keys(node.children).sort();
  if (kids.length === 0) { node.col = col++; node.depth = depth; return; }
  for (const k of kids) layout(node.children[k], depth + 1);
  const cs = kids.map((k) => node.children[k].col);
  node.col = cs.reduce((a, b) => a + b, 0) / cs.length;
  node.depth = depth;
}
layout(root, 0);
const maxCol = Math.max(1, col - 1); maxDepth = Math.max(1, maxDepth);
function place(node, parent) {
  graph.addNode(node.id, null, 0.06 + 0.88 * (node.col / maxCol), 0.12 + 0.78 * (node.depth / maxDepth));
  if (parent) graph.addEdge(parent.id, node.id);
  for (const k in node.children) place(node.children[k], node);
}
place(root, null);
Tracer.delay();
for (const wd of words) {
  let node = root; graph.select(root.id); Tracer.delay();
  for (const ch of wd) { const child = node.children[ch]; graph.visit(child.id, node.id); Tracer.delay(); node = child; }
  graph.deselect(root.id);
  log.println('Inserted "' + wd + '"' + (node.end ? ' (word end)' : ''));
}
function search(word) {
  let node = root;
  for (const ch of word) { if (!node.children[ch]) { log.println('search "' + word + '" → not found'); return; } node = node.children[ch]; graph.select(node.id); }
  log.println('search "' + word + '" → ' + (node.end ? 'FOUND' : 'prefix only'));
  Tracer.delay();
}
search('car');
search('cow');
Tracer.delay();`;

// ─── Wave 1 additions ───────────────────────────────────────────────────────
const shellSort = `// Shell Sort — gapped insertion sort; shrink the gap toward 1.
const array = new Array1DTracer('Array');
const log = new LogTracer('Console');
const D = [23, 12, 1, 8, 34, 54, 2, 3, 45];
array.set(D);
Tracer.delay();
for (let gap = D.length >> 1; gap > 0; gap = gap >> 1) {
  log.println('gap = ' + gap);
  for (let i = gap; i < D.length; i++) {
    const temp = D[i]; let j = i;
    array.select(i); Tracer.delay();
    while (j >= gap && D[j - gap] > temp) { D[j] = D[j - gap]; array.set(D); array.patch(j); Tracer.delay(); array.depatch(j); j -= gap; }
    D[j] = temp; array.set(D); array.patch(j); Tracer.delay(); array.depatch(j); array.deselect(i);
  }
}
log.println('Sorted!');
Tracer.delay();`;

const radixSort = `// Radix Sort (LSD, base 10) — stable-sort by each digit from least significant.
const array = new Array1DTracer('Array');
const log = new LogTracer('Console');
let D = [170, 45, 75, 90, 2, 802, 24, 66];
array.set(D);
Tracer.delay();
const max = Math.max.apply(null, D);
for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
  log.println('Bucket by digit (exp = ' + exp + ')');
  const output = new Array(D.length); const count = new Array(10).fill(0);
  for (let i = 0; i < D.length; i++) { array.select(i); count[Math.floor(D[i] / exp) % 10]++; }
  Tracer.delay();
  for (let i = 0; i < D.length; i++) array.deselect(i);
  for (let i = 1; i < 10; i++) count[i] += count[i - 1];
  for (let i = D.length - 1; i >= 0; i--) { const d = Math.floor(D[i] / exp) % 10; output[--count[d]] = D[i]; }
  D = output; array.set(D);
  for (let i = 0; i < D.length; i++) array.patch(i);
  Tracer.delay();
  for (let i = 0; i < D.length; i++) array.depatch(i);
}
log.println('Sorted!');
Tracer.delay();`;

const bucketSort = `// Bucket Sort — scatter values into buckets, sort each, then concatenate.
const array = new Array1DTracer('Array');
const log = new LogTracer('Console');
const D = [29, 25, 3, 49, 9, 37, 21, 43];
array.set(D);
Tracer.delay();
const n = D.length; const buckets = Array.from({ length: n }, () => []);
const max = Math.max.apply(null, D) + 1;
for (let i = 0; i < n; i++) { array.select(i); buckets[Math.floor(n * D[i] / max)].push(D[i]); Tracer.delay(); array.deselect(i); }
let idx = 0;
for (let b = 0; b < n; b++) {
  buckets[b].sort((x, y) => x - y);
  for (const v of buckets[b]) { D[idx] = v; array.set(D); array.patch(idx); Tracer.delay(); array.depatch(idx); idx++; }
}
log.println('Sorted!');
Tracer.delay();`;

const linearSearch = `// Linear Search — scan left to right until the target is found.
const array = new Array1DTracer('Array');
const log = new LogTracer('Console');
const D = [10, 3, 7, 1, 9, 4, 8, 6, 2, 5];
const target = 9;
array.set(D); log.println('Search ' + target);
Tracer.delay();
let found = -1;
for (let i = 0; i < D.length; i++) {
  array.select(i); Tracer.delay();
  if (D[i] === target) { array.patch(i); found = i; break; }
  array.deselect(i);
}
log.println(found >= 0 ? 'Found at index ' + found : 'Not found');
Tracer.delay();`;

const jumpSearch = `// Jump Search — leap by √n blocks on a sorted array, then scan the block.
const array = new Array1DTracer('Array (sorted)');
const log = new LogTracer('Console');
const D = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25];
const target = 17;
array.set(D);
Tracer.delay();
const n = D.length; const step = Math.max(1, Math.floor(Math.sqrt(n)));
let prev = 0, jump = step;
while (Math.min(jump, n) - 1 < n && D[Math.min(jump, n) - 1] < target) {
  array.select(Math.min(jump, n) - 1); Tracer.delay(); array.deselect(Math.min(jump, n) - 1);
  prev = jump; jump += step; if (prev >= n) break;
}
let found = -1;
for (let i = prev; i < Math.min(jump, n); i++) { array.select(i); Tracer.delay(); if (D[i] === target) { array.patch(i); found = i; break; } array.deselect(i); }
log.println(found >= 0 ? 'Found at ' + found : 'Not found');
Tracer.delay();`;

const interpolationSearch = `// Interpolation Search — probe where the value likely is (uniform data).
const array = new Array1DTracer('Array (sorted, uniform)');
const log = new LogTracer('Console');
const D = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const target = 70;
array.set(D);
Tracer.delay();
let lo = 0, hi = D.length - 1, found = -1;
while (lo <= hi && target >= D[lo] && target <= D[hi]) {
  const pos = lo + Math.floor((target - D[lo]) * (hi - lo) / (D[hi] - D[lo]));
  array.select(pos); Tracer.delay();
  if (D[pos] === target) { array.patch(pos); found = pos; break; }
  array.deselect(pos);
  if (D[pos] < target) lo = pos + 1; else hi = pos - 1;
}
log.println(found >= 0 ? 'Found at ' + found : 'Not found');
Tracer.delay();`;

const exponentialSearch = `// Exponential Search — double the range until it overshoots, then binary search.
const array = new Array1DTracer('Array (sorted)');
const log = new LogTracer('Console');
const D = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];
const target = 18;
array.set(D);
Tracer.delay();
const n = D.length; let bound = 1;
while (bound < n && D[bound] < target) { array.select(bound); Tracer.delay(); array.deselect(bound); bound *= 2; }
let lo = Math.floor(bound / 2), hi = Math.min(bound, n - 1), found = -1;
while (lo <= hi) { const mid = (lo + hi) >> 1; array.select(mid); Tracer.delay(); if (D[mid] === target) { array.patch(mid); found = mid; break; } array.deselect(mid); if (D[mid] < target) lo = mid + 1; else hi = mid - 1; }
log.println(found >= 0 ? 'Found at ' + found : 'Not found');
Tracer.delay();`;

const sieve = `// Sieve of Eratosthenes — cross out multiples of each prime up to √N.
const array = new Array1DTracer('is-prime (1 = candidate)');
const log = new LogTracer('Console');
const N = 30;
const prime = new Array(N + 1).fill(1); prime[0] = 0; prime[1] = 0;
array.set(prime);
Tracer.delay();
for (let p = 2; p * p <= N; p++) {
  if (prime[p]) {
    array.select(p); Tracer.delay();
    for (let m = p * p; m <= N; m += p) if (prime[m]) { prime[m] = 0; array.set(prime); array.patch(m); Tracer.delay(); array.depatch(m); }
    array.deselect(p);
  }
}
const primes = []; for (let i = 2; i <= N; i++) if (prime[i]) primes.push(i);
log.println('Primes ≤ ' + N + ': ' + primes.join(', '));
Tracer.delay();`;

const gcdEuclid = `// Euclidean Algorithm — gcd(a,b) = gcd(b, a mod b) until the remainder is 0.
const log = new LogTracer('Euclidean GCD');
let a = 1071, b = 462;
log.println('gcd(' + a + ', ' + b + ')');
Tracer.delay();
while (b !== 0) { const r = a % b; log.println(a + ' = ' + Math.floor(a / b) + '·' + b + ' + ' + r); Tracer.delay(); a = b; b = r; }
log.println('GCD = ' + a);
Tracer.delay();`;

const fastPow = `// Fast Exponentiation — a^b mod m by squaring, using b's binary digits.
const log = new LogTracer('Fast Exponentiation (a^b mod m)');
const a = 3, b = 13, m = 1000000007;
log.println(a + '^' + b + ' mod ' + m);
let result = 1, base = a % m, e = b;
Tracer.delay();
while (e > 0) {
  if (e & 1) { result = (result * base) % m; log.println('bit set → result = ' + result); Tracer.delay(); }
  base = (base * base) % m; e = e >> 1;
  log.println('square: base = ' + base + ', e = ' + e); Tracer.delay();
}
log.println('Answer = ' + result);
Tracer.delay();`;

const countBits = `// Count Set Bits (Brian Kernighan) — n & (n-1) clears the lowest set bit.
const log = new LogTracer('Count set bits');
let n = 156;
log.println(n + ' = 0b' + n.toString(2));
let count = 0;
Tracer.delay();
while (n) { const before = n; n = n & (n - 1); count++; log.println('0b' + before.toString(2) + ' → 0b' + n.toString(2) + '  (count = ' + count + ')'); Tracer.delay(); }
log.println('Set bits = ' + count);
Tracer.delay();`;

const xorUnique = `// Find the Unique Number — XOR cancels every value that appears twice.
const array = new Array1DTracer('Array (each value twice, except one)');
const log = new LogTracer('Console');
const D = [4, 1, 2, 1, 2, 4, 7];
array.set(D);
Tracer.delay();
let x = 0;
for (let i = 0; i < D.length; i++) { array.select(i); x ^= D[i]; log.println('xor so far = ' + x); Tracer.delay(); array.deselect(i); }
log.println('Unique element = ' + x);
Tracer.delay();`;

const subsetBitmask = `// Subset Enumeration via Bitmask — bit i set ⇒ element i is in the subset.
const log = new LogTracer('Subsets via bitmask');
const S = ['a', 'b', 'c'];
const n = S.length;
log.println('Set = {' + S.join(', ') + '} → ' + (1 << n) + ' subsets');
Tracer.delay();
for (let mask = 0; mask < (1 << n); mask++) {
  const sub = [];
  for (let i = 0; i < n; i++) if (mask & (1 << i)) sub.push(S[i]);
  log.println('0b' + mask.toString(2).padStart(n, '0') + ' → {' + sub.join(', ') + '}');
  Tracer.delay();
}
Tracer.delay();`;

const twoSumSorted = `// Two Sum (two pointers) — shrink from both ends of a sorted array.
const array = new Array1DTracer('Array (sorted)');
const log = new LogTracer('Console');
const D = [1, 3, 4, 5, 7, 10, 11];
const target = 9;
array.set(D); log.println('Find two numbers summing to ' + target);
Tracer.delay();
let lo = 0, hi = D.length - 1, found = false;
while (lo < hi) {
  array.select(lo); array.select(hi); Tracer.delay();
  const s = D[lo] + D[hi];
  log.println(D[lo] + ' + ' + D[hi] + ' = ' + s);
  if (s === target) { array.patch(lo); array.patch(hi); found = true; break; }
  array.deselect(lo); array.deselect(hi);
  if (s < target) lo++; else hi--;
}
log.println(found ? 'Found the pair!' : 'No pair');
Tracer.delay();`;

const slidingWindowMax = `// Sliding Window Maximum — a monotonic deque keeps the window's max at front.
const array = new Array1DTracer('Array');
const log = new LogTracer('Console');
const D = [1, 3, -1, -3, 5, 3, 6, 7];
const k = 3;
array.set(D); log.println('Max of each window of size ' + k);
Tracer.delay();
const dq = []; const res = [];
for (let i = 0; i < D.length; i++) {
  while (dq.length && dq[0] <= i - k) dq.shift();
  while (dq.length && D[dq[dq.length - 1]] <= D[i]) dq.pop();
  dq.push(i);
  for (let j = 0; j < D.length; j++) array.deselect(j);
  for (let j = Math.max(0, i - k + 1); j <= i; j++) array.select(j);
  array.patch(dq[0]); Tracer.delay(); array.depatch(dq[0]);
  if (i >= k - 1) { res.push(D[dq[0]]); log.println('window [' + (i - k + 1) + '..' + i + '] max = ' + D[dq[0]]); }
}
log.println('Maxima: ' + res.join(', '));
Tracer.delay();`;

const activitySelection = `// Activity Selection — greedily pick the activity that finishes earliest.
const log = new LogTracer('Activity Selection (max non-overlapping)');
const acts = [[1,3],[2,5],[4,7],[1,8],[5,9],[8,10],[9,11],[11,14],[13,16]];
acts.sort((a, b) => a[1] - b[1]);
Tracer.delay();
let lastEnd = -1, taken = 0;
for (const [s, f] of acts) {
  if (s >= lastEnd) { taken++; lastEnd = f; log.println('take (' + s + ', ' + f + ')'); }
  else log.println('skip (' + s + ', ' + f + ') — overlaps');
  Tracer.delay();
}
log.println('Selected ' + taken + ' activities');
Tracer.delay();`;

const fractionalKnapsack = `// Fractional Knapsack — greedily take highest value/weight, splitting the last.
const log = new LogTracer('Fractional Knapsack');
const items = [[60, 10], [100, 20], [120, 30]];
const cap = 50;
items.sort((a, b) => b[0] / b[1] - a[0] / a[1]);
Tracer.delay();
let total = 0, w = cap;
for (const [v, wt] of items) {
  if (w <= 0) break;
  if (wt <= w) { total += v; w -= wt; log.println('take all (' + v + ', ' + wt + ') → value ' + total); }
  else { total += v * w / wt; log.println('take ' + w + '/' + wt + ' of (' + v + ', ' + wt + ') → value ' + total.toFixed(1)); w = 0; }
  Tracer.delay();
}
log.println('Max value = ' + total.toFixed(1));
Tracer.delay();`;

const jobSequencing = `// Job Sequencing with Deadlines — take jobs by profit into the latest free slot.
const log = new LogTracer('Job Sequencing');
const jobs = [['a', 2, 100], ['b', 1, 19], ['c', 2, 27], ['d', 1, 25], ['e', 3, 15]];
jobs.sort((x, y) => y[2] - x[2]);
const maxD = Math.max.apply(null, jobs.map((j) => j[1]));
const slot = new Array(maxD + 1).fill(null);
Tracer.delay();
let profit = 0;
for (const [id, d, p] of jobs) {
  for (let t = d; t > 0; t--) { if (!slot[t]) { slot[t] = id; profit += p; log.println('schedule ' + id + ' at slot ' + t + ' (+' + p + ')'); break; } }
  Tracer.delay();
}
log.println('Sequence: ' + slot.filter(Boolean).join(' → ') + '  | profit ' + profit);
Tracer.delay();`;

const kmp = `// KMP — precompute the longest prefix-suffix table to skip re-comparisons.
const log = new LogTracer('KMP string matching');
const text = 'ababcabcabababd';
const pat = 'ababd';
log.println('text: ' + text);
log.println('pat:  ' + pat);
const lps = new Array(pat.length).fill(0);
{ let len = 0, i = 1; while (i < pat.length) { if (pat[i] === pat[len]) { len++; lps[i] = len; i++; } else if (len > 0) { len = lps[len - 1]; } else { lps[i] = 0; i++; } } }
log.println('LPS = [' + lps.join(',') + ']');
Tracer.delay();
let i = 0, j = 0;
while (i < text.length) {
  log.println(' '.repeat(Math.max(0, i - j)) + pat + '   (i=' + i + ', j=' + j + ')');
  Tracer.delay();
  if (text[i] === pat[j]) { i++; j++; if (j === pat.length) { log.println('MATCH at index ' + (i - j)); j = lps[j - 1]; } }
  else if (j > 0) j = lps[j - 1];
  else i++;
}
Tracer.delay();`;

const rabinKarp = `// Rabin-Karp — compare a rolling hash of each window to the pattern's hash.
const log = new LogTracer('Rabin-Karp (rolling hash)');
const text = 'abcdeabcabc';
const pat = 'abc';
const B = 256, M = 101, m = pat.length;
let ph = 0, th = 0, h = 1;
for (let i = 0; i < m - 1; i++) h = (h * B) % M;
for (let i = 0; i < m; i++) { ph = (B * ph + pat.charCodeAt(i)) % M; th = (B * th + text.charCodeAt(i)) % M; }
log.println('pattern hash = ' + ph);
Tracer.delay();
for (let i = 0; i + m <= text.length; i++) {
  log.println('window "' + text.substr(i, m) + '"  hash = ' + th);
  if (th === ph && text.substr(i, m) === pat) log.println('  → MATCH at index ' + i);
  Tracer.delay();
  if (i + m < text.length) { th = (B * (th - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % M; if (th < 0) th += M; }
}
Tracer.delay();`;

const zAlgorithm = `// Z-Algorithm — z[i] = length of the longest prefix starting at i.
const array = new Array1DTracer('Z-array');
const log = new LogTracer('Console');
const s = 'aabxaabxcaabxaabxay';
log.println('s = ' + s);
const n = s.length; const z = new Array(n).fill(0);
array.set(z);
Tracer.delay();
let l = 0, r = 0;
for (let i = 1; i < n; i++) {
  if (i < r) z[i] = Math.min(r - i, z[i - l]);
  while (i + z[i] < n && s[z[i]] === s[i + z[i]]) z[i]++;
  if (i + z[i] > r) { l = i; r = i + z[i]; }
  array.set(z); array.patch(i); Tracer.delay(); array.depatch(i);
}
log.println('Z = [' + z.join(',') + ']');
Tracer.delay();`;

const lis = `// Longest Increasing Subsequence (O(n²) DP) — dp[i] = best LIS ending at i.
const arr = new Array1DTracer('Array');
const array = new Array1DTracer('dp[i] = LIS ending at i');
const log = new LogTracer('Console');
const A = [10, 9, 2, 5, 3, 7, 101, 18];
arr.set(A);
const dp = new Array(A.length).fill(1);
array.set(dp);
Tracer.delay();
for (let i = 1; i < A.length; i++) {
  arr.select(i);
  for (let j = 0; j < i; j++) if (A[j] < A[i] && dp[j] + 1 > dp[i]) dp[i] = dp[j] + 1;
  array.set(dp); array.patch(i); Tracer.delay(); array.depatch(i); arr.deselect(i);
}
log.println('LIS length = ' + Math.max.apply(null, dp));
Tracer.delay();`;

const subsetSum = `// Subset Sum (DP) — dp[i][s] = can the first i items reach sum s?
const mat = new Array2DTracer('dp[i][s]  (1 = reachable)');
const log = new LogTracer('Console');
const items = [3, 34, 4, 12, 5, 2];
const target = 9;
const n = items.length;
const dp = Array.from({ length: n + 1 }, () => new Array(target + 1).fill(0));
for (let i = 0; i <= n; i++) dp[i][0] = 1;
mat.set(dp);
Tracer.delay();
for (let i = 1; i <= n; i++) for (let s = 1; s <= target; s++) {
  dp[i][s] = dp[i - 1][s];
  if (s >= items[i - 1] && dp[i - 1][s - items[i - 1]]) dp[i][s] = 1;
  if (dp[i][s]) { mat.set(dp); mat.patch(i, s); Tracer.delay(); mat.depatch(i, s); }
}
log.println('Subset summing to ' + target + '? ' + (dp[n][target] ? 'YES' : 'NO'));
Tracer.delay();`;

const ratInMaze = `// Rat in a Maze — backtracking: try Down/Right/Up/Left, undo at dead ends.
const grid = new GridTracer('Rat in a Maze');
const log = new LogTracer('Console');
const MAZE = [
  [0,0,1,0,0],
  [0,1,0,0,1],
  [0,0,0,1,0],
  [1,0,1,0,0],
  [0,0,0,0,0],
];
const R = MAZE.length, C = MAZE[0].length;
grid.set(MAZE); grid.start(0, 0); grid.goal(R - 1, C - 1);
Tracer.delay();
const vis = Array.from({ length: R }, () => new Array(C).fill(false));
let solved = false;
function solve(r, c) {
  if (r < 0 || c < 0 || r >= R || c >= C || MAZE[r][c] === 1 || vis[r][c]) return false;
  vis[r][c] = true;
  const end = r === R - 1 && c === C - 1;
  if (!(r === 0 && c === 0) && !end) grid.visit(r, c);
  Tracer.delay();
  if (end) { grid.path(r, c); solved = true; return true; }
  const dirs = [[1,0],[0,1],[-1,0],[0,-1]];
  for (const [dr, dc] of dirs) if (solve(r + dr, c + dc)) { if (!(r === 0 && c === 0)) grid.path(r, c); return true; }
  return false;
}
solve(0, 0);
log.println(solved ? 'Path found!' : 'No path');
Tracer.delay();`;

const permutations = `// Permutations — backtracking: pick an unused element at each position.
const log = new LogTracer('Generate permutations');
const items = ['A', 'B', 'C'];
const used = new Array(items.length).fill(false);
const cur = [];
let n = 0;
function backtrack() {
  if (cur.length === items.length) { n++; log.println(n + ': [' + cur.join(', ') + ']'); Tracer.delay(); return; }
  for (let i = 0; i < items.length; i++) {
    if (used[i]) continue;
    used[i] = true; cur.push(items[i]);
    backtrack();
    cur.pop(); used[i] = false;
  }
}
backtrack();
log.println('Total ' + n + ' permutations');
Tracer.delay();`;

const bstAlgo = `// Binary Search Tree — build by inserts, then search a value down the tree.
const graph = new GraphTracer('Binary Search Tree', true);
const log = new LogTracer('Console');
const values = [50, 30, 70, 20, 40, 60, 80];
let root = null;
function insert(node, v) { if (!node) return { v: v, l: null, r: null }; if (v < node.v) node.l = insert(node.l, v); else node.r = insert(node.r, v); return node; }
for (const v of values) root = insert(root, v);
let col = 0, maxDepth = 0;
function layout(node, depth) { if (!node) return; if (depth > maxDepth) maxDepth = depth; layout(node.l, depth + 1); node.col = col++; node.depth = depth; layout(node.r, depth + 1); }
layout(root, 0);
const maxCol = Math.max(1, col - 1); maxDepth = Math.max(1, maxDepth);
function place(node, parent) { if (!node) return; graph.addNode(String(node.v), null, 0.06 + 0.88 * (node.col / maxCol), 0.12 + 0.78 * (node.depth / maxDepth)); if (parent) graph.addEdge(String(parent.v), String(node.v)); place(node.l, node); place(node.r, node); }
place(root, null);
Tracer.delay();
function search(v) { let node = root; while (node) { graph.visit(String(node.v)); log.println('visit ' + node.v); Tracer.delay(); if (v === node.v) { log.println('Found ' + v + '!'); return; } node = v < node.v ? node.l : node.r; } log.println(v + ' not found'); }
log.println('Searching for 40...');
search(40);
Tracer.delay();`;

const treeTraversal = `// Tree Traversals — pre / in / post (DFS) and level order (BFS).
const graph = new GraphTracer('Tree Traversals', true);
const log = new LogTracer('Console');
const kids = { A:['B','C'], B:['D','E'], C:['F','G'], D:[null,null], E:[null,null], F:[null,null], G:[null,null] };
const pos = { A:[0.5,0.1], B:[0.25,0.42], C:[0.75,0.42], D:[0.12,0.78], E:[0.38,0.78], F:[0.62,0.78], G:[0.88,0.78] };
for (const k in pos) graph.addNode(k, null, pos[k][0], pos[k][1]);
for (const k in kids) for (const c of kids[k]) if (c) graph.addEdge(k, c);
Tracer.delay();
const pre = [], ino = [], post = [];
function dfs(n) { if (!n) return; pre.push(n); dfs(kids[n][0]); ino.push(n); dfs(kids[n][1]); post.push(n); }
dfs('A');
log.println('Pre-order:  ' + pre.join(' '));
for (const n of pre) { graph.visit(n); Tracer.delay(); }
log.println('In-order:   ' + ino.join(' '));
log.println('Post-order: ' + post.join(' '));
const q = ['A'], lvl = [];
while (q.length) { const n = q.shift(); lvl.push(n); for (const c of kids[n]) if (c) q.push(c); }
log.println('Level-order: ' + lvl.join(' '));
Tracer.delay();`;

export const CATALOG: AlgoDef[] = [
  { id: 'bubble-sort', name: 'Bubble Sort', category: 'Sorting', description: 'Swap adjacent out-of-order pairs until sorted.', code: bubble },
  { id: 'selection-sort', name: 'Selection Sort', category: 'Sorting', description: 'Repeatedly select the minimum of the remainder.', code: selection },
  { id: 'insertion-sort', name: 'Insertion Sort', category: 'Sorting', description: 'Insert each element into a growing sorted prefix.', code: insertion },
  { id: 'quick-sort', name: 'Quick Sort', category: 'Sorting', description: 'Partition around a pivot and recurse.', code: quick },
  { id: 'merge-sort', name: 'Merge Sort', category: 'Sorting', description: 'Divide, sort halves, and merge.', code: merge },
  { id: 'binary-search', name: 'Binary Search', category: 'Searching', description: 'Halve a sorted range to locate a target.', code: binarySearch },
  { id: 'bfs', name: 'Breadth-First Search', category: 'Graph', description: 'Explore a graph level by level from a start node.', code: bfs },
  { id: 'dfs', name: 'Depth-First Search', category: 'Graph', description: 'Explore as deep as possible, then backtrack.', code: dfs },
  { id: 'dijkstra', name: "Dijkstra's Shortest Path", category: 'Graph', description: 'Shortest paths from a source in a weighted graph.', code: dijkstra },
  { id: 'knapsack', name: '0/1 Knapsack', category: 'Dynamic Programming', description: 'Maximize value within a weight capacity.', code: knapsack },
  { id: 'lcs', name: 'Longest Common Subsequence', category: 'Dynamic Programming', description: 'DP over two strings to find the LCS length.', code: lcs },
  { id: 'edit-distance', name: 'Edit Distance', category: 'Dynamic Programming', description: 'Minimum edits to transform one string into another.', code: editDistance },
  { id: 'coin-change', name: 'Coin Change', category: 'Dynamic Programming', description: 'Fewest coins to make a target amount.', code: coinChange },
  { id: 'heap-sort', name: 'Heap Sort', category: 'Sorting', description: 'Build a max-heap and extract the maximum repeatedly.', code: heapSort },
  { id: 'counting-sort', name: 'Counting Sort', category: 'Sorting', description: 'Count occurrences and rebuild in order (no comparisons).', code: countingSort },
  { id: 'topological-sort', name: 'Topological Sort', category: 'Graph', description: "Order a DAG by dependencies (Kahn's algorithm).", code: topoSort },
  { id: 'n-queens', name: 'N-Queens', category: 'Backtracking', description: 'Place N non-attacking queens via backtracking.', code: nQueens },
  { id: 'sudoku', name: 'Sudoku Solver', category: 'Backtracking', description: 'Fill a 9×9 grid by backtracking over valid digits.', code: sudoku },
  { id: 'kruskal', name: "Kruskal's MST", category: 'Graph', description: 'Minimum spanning tree via sorted edges + union-find.', code: kruskal },
  { id: 'a-star', name: 'A* Search', category: 'Graph', description: 'Shortest path guided by a cost + heuristic estimate.', code: aStar },
  { id: 'bellman-ford', name: 'Bellman-Ford', category: 'Graph', description: 'Shortest paths that tolerate negative edge weights.', code: bellmanFord },
  { id: 'fibonacci', name: 'Fibonacci (DP)', category: 'Dynamic Programming', description: 'Bottom-up tabulation of the Fibonacci sequence.', code: fibonacci },
  { id: 'kadane', name: 'Kadane (Max Subarray)', category: 'Dynamic Programming', description: 'Largest contiguous sum, visualized on a chart.', code: kadane },
  { id: 'astar-grid', name: 'A* Pathfinding', category: 'Pathfinding', description: 'Shortest path through a maze, guided by a heuristic.', code: aStarGrid },
  { id: 'bfs-grid', name: 'BFS Maze', category: 'Pathfinding', description: 'Breadth-first flood-fill through a grid maze.', code: bfsGrid },
  { id: 'greedy-grid', name: 'Greedy Best-First', category: 'Pathfinding', description: 'Follows the heuristic only — fast but not always shortest.', code: greedyGrid },
  { id: 'dfs-grid', name: 'DFS Maze', category: 'Pathfinding', description: 'Depth-first exploration; backtracks at dead ends.', code: dfsGrid },
  { id: 'prim', name: "Prim's MST", category: 'Graph', description: 'Minimum spanning tree grown from a single node.', code: prim },
  { id: 'floyd-warshall', name: 'Floyd-Warshall', category: 'Graph', description: 'All-pairs shortest paths over a distance matrix.', code: floydWarshall },
  { id: 'dijkstra-grid', name: 'Dijkstra (Weighted Grid)', category: 'Pathfinding', description: 'Cheapest path when cells have different entry costs.', code: dijkstraGrid },
  { id: 'trie', name: 'Trie (Prefix Tree)', category: 'Trees', description: 'Insert and search words in a character-by-character tree.', code: trie },
  { id: 'bst', name: 'Binary Search Tree', category: 'Trees', description: 'Build by insertion, then search down the ordered tree.', code: bstAlgo },
  { id: 'tree-traversal', name: 'Tree Traversals', category: 'Trees', description: 'Pre-, in-, post-order (DFS) and level order (BFS).', code: treeTraversal },
  { id: 'shell-sort', name: 'Shell Sort', category: 'Sorting', description: 'Gapped insertion sort; the gap shrinks toward 1.', code: shellSort },
  { id: 'radix-sort', name: 'Radix Sort', category: 'Sorting', description: 'Stable-sort by each digit, least significant first.', code: radixSort },
  { id: 'bucket-sort', name: 'Bucket Sort', category: 'Sorting', description: 'Scatter into buckets, sort each, then concatenate.', code: bucketSort },
  { id: 'linear-search', name: 'Linear Search', category: 'Searching', description: 'Scan every element until the target is found.', code: linearSearch },
  { id: 'jump-search', name: 'Jump Search', category: 'Searching', description: 'Leap by √n blocks on a sorted array, then scan.', code: jumpSearch },
  { id: 'interpolation-search', name: 'Interpolation Search', category: 'Searching', description: 'Probe where the value likely is in uniform data.', code: interpolationSearch },
  { id: 'exponential-search', name: 'Exponential Search', category: 'Searching', description: 'Double the range, then binary search inside it.', code: exponentialSearch },
  { id: 'lis', name: 'Longest Increasing Subsequence', category: 'Dynamic Programming', description: 'O(n²) DP for the longest increasing subsequence.', code: lis },
  { id: 'subset-sum', name: 'Subset Sum', category: 'Dynamic Programming', description: 'Can a subset reach a target sum? Boolean DP table.', code: subsetSum },
  { id: 'rat-in-maze', name: 'Rat in a Maze', category: 'Backtracking', description: 'Find a path through a grid by backtracking.', code: ratInMaze },
  { id: 'permutations', name: 'Permutations', category: 'Backtracking', description: 'Generate all orderings by backtracking.', code: permutations },
  { id: 'kmp', name: 'KMP', category: 'String', description: 'Knuth-Morris-Pratt matching with a prefix table.', code: kmp },
  { id: 'rabin-karp', name: 'Rabin-Karp', category: 'String', description: 'Rolling-hash substring search.', code: rabinKarp },
  { id: 'z-algorithm', name: 'Z-Algorithm', category: 'String', description: 'Prefix-match lengths for pattern matching.', code: zAlgorithm },
  { id: 'sieve', name: 'Sieve of Eratosthenes', category: 'Math', description: 'Find all primes up to N by crossing out multiples.', code: sieve },
  { id: 'gcd-euclid', name: 'Euclidean GCD', category: 'Math', description: 'Greatest common divisor via repeated remainders.', code: gcdEuclid },
  { id: 'fast-pow', name: 'Fast Exponentiation', category: 'Math', description: 'Modular a^b in O(log b) by squaring.', code: fastPow },
  { id: 'count-bits', name: 'Count Set Bits', category: 'Bit Manipulation', description: "Brian Kernighan's n & (n-1) trick.", code: countBits },
  { id: 'xor-unique', name: 'Find Unique (XOR)', category: 'Bit Manipulation', description: 'XOR cancels paired values, leaving the unique one.', code: xorUnique },
  { id: 'subset-bitmask', name: 'Subsets via Bitmask', category: 'Bit Manipulation', description: 'Enumerate every subset with binary masks.', code: subsetBitmask },
  { id: 'two-sum', name: 'Two Sum (Two Pointers)', category: 'Two Pointers', description: 'Find a pair summing to a target on a sorted array.', code: twoSumSorted },
  { id: 'sliding-window-max', name: 'Sliding Window Maximum', category: 'Two Pointers', description: 'Monotonic deque tracks each window maximum.', code: slidingWindowMax },
  { id: 'activity-selection', name: 'Activity Selection', category: 'Greedy', description: 'Pick the most non-overlapping intervals.', code: activitySelection },
  { id: 'fractional-knapsack', name: 'Fractional Knapsack', category: 'Greedy', description: 'Maximize value by taking highest value/weight first.', code: fractionalKnapsack },
  { id: 'job-sequencing', name: 'Job Sequencing', category: 'Greedy', description: 'Schedule jobs by profit into deadline slots.', code: jobSequencing },
];

export const CATEGORIES = Array.from(new Set(CATALOG.map((a) => a.category)));
