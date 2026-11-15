// @java: Dfs3Mau.java
// Topological order with DFS and THREE colours: WHITE = not visited, GRAY = on the current path, BLACK = finished.
// An edge into a GRAY node closes a cycle. Reverse of the finishing order = a valid topological order.
const WHITE = 0, GRAY = 1, BLACK = 2;

// #region dfs3
function topoDfs(n: number, edges: number[][]): { order: number[] } | { cycle: number[] } {
  const out: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) out[u].push(v);              // here edges are already u → v
  const color = new Array<number>(n).fill(WHITE);
  const path: number[] = [];                               // the GRAY nodes, in order
  const finished: number[] = [];
  let cycle: number[] | null = null;
  const visit = (u: number): void => {
    color[u] = GRAY; path.push(u);
    for (const v of out[u]) {
      if (cycle) return;
      if (color[v] === GRAY) { cycle = [...path.slice(path.indexOf(v)), v]; return; }   // back edge
      if (color[v] === WHITE) visit(v);
      // BLACK: already finished, safe to skip — NOT a cycle
    }
    color[u] = BLACK; path.pop();
    finished.push(u);                                      // u is done after everything it points to
  };
  for (let u = 0; u < n && !cycle; u++) if (color[u] === WHITE) visit(u);
  return cycle ? { cycle } : { order: finished.reverse() };
}
// #endregion

console.log(JSON.stringify(topoDfs(4, [[0, 1], [0, 2], [1, 3], [2, 3]])));
console.log(JSON.stringify(topoDfs(5, [[0, 1], [1, 2], [2, 3], [3, 1], [0, 4]])));
console.log(JSON.stringify(topoDfs(3, [[2, 1], [1, 0]])));
