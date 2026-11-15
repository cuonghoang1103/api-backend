// @java: BayMotChieu.java
// Undirected graph stored as an edge list (like a friendships table: ONE row per pair).
// Forgetting the reverse arc makes reachability depend on which end you start from.
function reach(n: number, edges: number[][], s: number, t: number, both: boolean): boolean {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    // #region sai
    if (both) adj[v].push(u);           // the line people forget
    // #endregion
  }
  const seen = new Array<boolean>(n).fill(false);
  const st = [s];
  seen[s] = true;
  while (st.length) {
    const u = st.pop()!;
    if (u === t) return true;
    for (const v of adj[u]) if (!seen[v]) { seen[v] = true; st.push(v); }
  }
  return false;
}
const friendships = [[0, 1], [1, 2]];   // requester → addressee, stored once
console.log('one arc  : 0 → 2 ?', reach(3, friendships, 0, 2, false), '  2 → 0 ?', reach(3, friendships, 2, 0, false));
console.log('two arcs : 0 → 2 ?', reach(3, friendships, 0, 2, true), '  2 → 0 ?', reach(3, friendships, 2, 0, true));
