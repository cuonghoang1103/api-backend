// @java: L4SafeStates.java
// LC 802 · Find Eventual Safe States — a node is safe iff no path from it reaches a cycle.
// Kahn on the REVERSED graph: terminal nodes (out-degree 0) are safe; peel backwards.

// #region giai
function eventualSafeNodes(graph: number[][]): number[] {
  const n = graph.length;
  const rev: number[][] = Array.from({ length: n }, () => []);
  const out = new Array<number>(n).fill(0);
  for (let u = 0; u < n; u++) { out[u] = graph[u].length; for (const v of graph[u]) rev[v].push(u); }
  const q: number[] = [];
  for (let u = 0; u < n; u++) if (out[u] === 0) q.push(u);       // terminal nodes
  const safe = new Array<boolean>(n).fill(false);
  for (let head = 0; head < q.length; head++) {
    const v = q[head];
    safe[v] = true;
    for (const u of rev[v]) if (--out[u] === 0) q.push(u);        // every exit of u leads to safe nodes
  }
  const res: number[] = [];
  for (let u = 0; u < n; u++) if (safe[u]) res.push(u);          // sorted, as the problem asks
  return res;
}
// #endregion

console.log(JSON.stringify(eventualSafeNodes([[1, 2], [2, 3], [5], [0], [5], [], []])));
console.log(JSON.stringify(eventualSafeNodes([[1, 2, 3, 4], [1, 2], [3, 4], [0, 4], []])));
console.log(JSON.stringify(eventualSafeNodes([[0]])));
