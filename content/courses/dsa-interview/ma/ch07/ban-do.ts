// @java: BanDo.java
// A small "maps app": Dijkstra + the parent array to print the route, then a traffic jam changes one weight.
// Places around FPTU HCMC; travel minutes are MADE UP for the example (not real traffic data).
const PLACES = ['Nha tro', 'Nga tu Thu Duc', 'Suoi Tien', 'FPTU', 'Vincom LVV', 'Nga ba Man Thien'];
const ROADS = [[0, 1, 7], [0, 4, 4], [4, 5, 3], [5, 3, 6], [1, 2, 5], [2, 3, 4], [4, 1, 2], [5, 2, 5]];   // two-way, minutes

// #region duong
function route(n: number, roads: number[][], s: number, t: number): { minutes: number; path: string[] } {
  const adj: [number, number][][] = Array.from({ length: n }, () => []);
  for (const [u, v, w] of roads) { adj[u].push([v, w]); adj[v].push([u, w]); }
  const dist = new Array<number>(n).fill(Infinity);
  const parent = new Array<number>(n).fill(-1);
  const done = new Array<boolean>(n).fill(false);
  dist[s] = 0;
  for (let round = 0; round < n; round++) {         // n = 6: the O(V²) array version is fine and short
    let u = -1;
    for (let x = 0; x < n; x++) if (!done[x] && (u === -1 || dist[x] < dist[u])) u = x;
    if (dist[u] === Infinity) break;
    done[u] = true;                                  // the closest unsettled place is now final
    for (const [v, w] of adj[u]) if (dist[u] + w < dist[v]) { dist[v] = dist[u] + w; parent[v] = u; }
  }
  const path: string[] = [];
  for (let v = t; v !== -1; v = parent[v]) path.unshift(PLACES[v]);
  return { minutes: dist[t], path };
}
// #endregion

const a = route(6, ROADS, 0, 3);
console.log(`normal : ${a.minutes} min  ${a.path.join(' -> ')}`);
const jam = ROADS.map((r) => (r[0] === 5 && r[1] === 3 ? [5, 3, 15] : r));   // traffic jam on Man Thien -> FPTU
const b = route(6, jam, 0, 3);
console.log(`jam    : ${b.minutes} min  ${b.path.join(' -> ')}`);
