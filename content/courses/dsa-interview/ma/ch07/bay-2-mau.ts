// @java: Bay2Mau.java
// The trap: detecting a cycle in a DIRECTED graph with a plain visited set (two colours).
// Diamond 0 → 1 → 3 and 0 → 2 → 3 has NO cycle, but 3 is reached twice.
function hasCycleWrong(n: number, edges: number[][]): boolean {
  const out: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) out[u].push(v);
  const visited = new Array<boolean>(n).fill(false);
  // #region sai
  const dfs = (u: number): boolean => {
    if (visited[u]) return true;           // "seen before ⇒ cycle" — WRONG for directed graphs
    visited[u] = true;
    for (const v of out[u]) if (dfs(v)) return true;
    return false;
  };
  // #endregion
  for (let u = 0; u < n; u++) if (!visited[u] && dfs(u)) return true;
  return false;
}
function hasCycleRight(n: number, edges: number[][]): boolean {
  const out: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) out[u].push(v);
  const color = new Array<number>(n).fill(0);   // 0 white, 1 gray (on the path), 2 black (done)
  const dfs = (u: number): boolean => {
    color[u] = 1;
    for (const v of out[u]) {
      if (color[v] === 1) return true;          // only a GRAY node closes a cycle
      if (color[v] === 0 && dfs(v)) return true;
    }
    color[u] = 2;
    return false;
  };
  for (let u = 0; u < n; u++) if (color[u] === 0 && dfs(u)) return true;
  return false;
}
const diamond = [[0, 1], [0, 2], [1, 3], [2, 3]];
const ring = [[0, 1], [1, 2], [2, 0]];
console.log('diamond: two-colour says', hasCycleWrong(4, diamond), '| three-colour says', hasCycleRight(4, diamond));
console.log('ring   : two-colour says', hasCycleWrong(3, ring), '| three-colour says', hasCycleRight(3, ring));
