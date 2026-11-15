// @java: BfsDfsThuTu.java
// The same graph, two orders. BFS visits by distance (and gives shortest paths); DFS dives first.
//    0 — 1 — 3 — 4 — 5
//     \     /
//      2 ——
//      |
//      6
const adj = [[1, 2], [0, 3], [0, 3, 6], [1, 2, 4], [3, 5], [4], [2]];

// #region bfs
function bfs(adj: number[][], s: number): { order: number[]; dist: number[]; parent: number[] } {
  const n = adj.length;
  const dist = new Array<number>(n).fill(-1);       // -1 = not reached yet (doubles as "visited")
  const parent = new Array<number>(n).fill(-1);
  const order: number[] = [];
  const q = [s];
  dist[s] = 0;
  for (let head = 0; head < q.length; head++) {
    const u = q[head];
    order.push(u);
    for (const v of adj[u]) {
      if (dist[v] === -1) { dist[v] = dist[u] + 1; parent[v] = u; q.push(v); }
    }
  }
  return { order, dist, parent };
}
function pathTo(parent: number[], t: number): number[] {
  const p: number[] = [];
  for (let v = t; v !== -1; v = parent[v]) p.push(v);   // walk back to the source, then reverse
  return p.reverse();
}
// #endregion

// #region dfs
function dfs(adj: number[][], u: number, seen: boolean[], order: number[]): void {
  seen[u] = true;
  order.push(u);
  for (const v of adj[u]) if (!seen[v]) dfs(adj, v, seen, order);
}
// #endregion

const r = bfs(adj, 0);
console.log('BFS order :', JSON.stringify(r.order));
console.log('dist      :', JSON.stringify(r.dist));
console.log('path 0->5 :', JSON.stringify(pathTo(r.parent, 5)), ' length', r.dist[5]);
const order: number[] = [];
dfs(adj, 0, new Array(adj.length).fill(false), order);
console.log('DFS order :', JSON.stringify(order));
