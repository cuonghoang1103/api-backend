// @java: BayAm.java
// The trap: Dijkstra (textbook version with a "done" set) on a graph with a NEGATIVE edge. Bellman-Ford is right.
const N = 4;
const E = [[0, 1, 2], [0, 2, 5], [2, 1, -4], [1, 3, 1]];   // 0→2→1 costs 1, cheaper than 0→1 = 2

// #region sai
function dijkstraDone(n: number, edges: number[][], s: number): number[] {
  const adj: number[][][] = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) adj[u].push([v, w]);
  const dist = new Array<number>(n).fill(Infinity), done = new Array<boolean>(n).fill(false);
  dist[s] = 0;
  for (let k = 0; k < n; k++) {
    let u = -1;
    for (let x = 0; x < n; x++) if (!done[x] && (u === -1 || dist[x] < dist[u])) u = x;
    done[u] = true;                                    // "final" — but a negative edge can still improve it
    for (const [v, w] of adj[u]) if (!done[v] && dist[u] + w < dist[v]) dist[v] = dist[u] + w;
  }
  return dist;
}
// #endregion

function bellmanFord(n: number, edges: number[][], s: number): number[] {
  const dist = new Array<number>(n).fill(Infinity);
  dist[s] = 0;
  for (let i = 0; i < n - 1; i++)                     // n − 1 rounds: a shortest path has at most n − 1 edges
    for (const [u, v, w] of edges) if (dist[u] !== Infinity && dist[u] + w < dist[v]) dist[v] = dist[u] + w;
  return dist;
}
console.log('Dijkstra    :', JSON.stringify(dijkstraDone(N, E, 0)));
console.log('Bellman-Ford:', JSON.stringify(bellmanFord(N, E, 0)));
