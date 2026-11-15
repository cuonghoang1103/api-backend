// @java: BieuDien.java
// Three ways to store the SAME undirected graph: edge list, adjacency list, adjacency matrix. Then a directed version.
//   0 — 1 — 3 — 4
//    \ /
//     2

// #region ke
function buildAdj(n: number, edges: number[][], directed = false): number[][] {
  const adj: number[][] = Array.from({ length: n }, () => []);   // n SEPARATE empty lists
  for (const [u, v] of edges) {
    adj[u].push(v);
    if (!directed) adj[v].push(u);                               // undirected = two arcs
  }
  return adj;
}
// #endregion

// #region ma-tran
function buildMatrix(n: number, edges: number[][]): number[][] {
  const m: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  for (const [u, v] of edges) { m[u][v] = 1; m[v][u] = 1; }
  return m;
}
// #endregion

const n = 5;
const edges = [[0, 1], [0, 2], [1, 2], [1, 3], [3, 4]];
console.log('edge list   :', JSON.stringify(edges));
const adj = buildAdj(n, edges);
console.log('adj list    :', JSON.stringify(adj));
console.log('degree      :', JSON.stringify(adj.map((a) => a.length)), ' sum =', adj.reduce((s, a) => s + a.length, 0), '= 2·E');
const m = buildMatrix(n, edges);
m.forEach((row, i) => console.log(`matrix row ${i}:`, JSON.stringify(row)));
console.log('is 1-3 an edge? list:', adj[1].includes(3), ' matrix:', m[1][3] === 1);
const d = buildAdj(n, edges, true);
console.log('directed adj:', JSON.stringify(d));
const indeg = new Array(n).fill(0);
for (const [, v] of edges) indeg[v]++;
console.log('out-degree  :', JSON.stringify(d.map((a) => a.length)), ' in-degree:', JSON.stringify(indeg));
