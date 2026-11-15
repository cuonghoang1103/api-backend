// @java: PathExists.java
// LC 1971 · Find if Path Exists in Graph — build an adjacency list from the edge list, then an ITERATIVE DFS.

// #region giai
function validPath(n: number, edges: number[][], source: number, destination: number): boolean {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
  const seen = new Array<boolean>(n).fill(false);
  const stack = [source];
  seen[source] = true;                       // mark when PUSHED, so nothing is pushed twice
  while (stack.length > 0) {
    const u = stack.pop()!;
    if (u === destination) return true;
    for (const v of adj[u]) {
      if (!seen[v]) { seen[v] = true; stack.push(v); }
    }
  }
  return false;
}
// #endregion

console.log(validPath(3, [[0, 1], [1, 2], [2, 0]], 0, 2));
console.log(validPath(6, [[0, 1], [0, 2], [3, 5], [5, 4], [4, 3]], 0, 5));
console.log(validPath(1, [], 0, 0));
console.log(validPath(5, [[0, 1], [1, 2], [2, 3], [3, 4]], 4, 0));
