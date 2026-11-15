// @java: L6ConnectPoints.java
// LC 1584 · Min Cost to Connect All Points — minimum spanning tree, Kruskal: sort all pairs by Manhattan
// distance, add an edge whenever union-find says its two points are not yet connected.

// #region giai
function minCostConnectPoints(points: number[][]): number {
  const n = points.length;
  const edges: [number, number, number][] = [];
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++)
      edges.push([Math.abs(points[i][0] - points[j][0]) + Math.abs(points[i][1] - points[j][1]), i, j]);
  edges.sort((a, b) => a[0] - b[0]);
  const parent = Array.from({ length: n }, (_, i) => i), size = new Array<number>(n).fill(1);
  const find = (x: number): number => { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; };
  let cost = 0, used = 0;
  for (const [w, i, j] of edges) {
    let a = find(i), b = find(j);
    if (a === b) continue;                     // would close a cycle: skip
    if (size[a] < size[b]) [a, b] = [b, a];
    parent[b] = a; size[a] += size[b];
    cost += w;
    if (++used === n - 1) break;               // a tree on n points has n − 1 edges
  }
  return cost;
}
// #endregion

console.log(minCostConnectPoints([[0, 0], [2, 2], [3, 10], [5, 2], [7, 0]]));
console.log(minCostConnectPoints([[3, 12], [-2, 5], [-4, 1]]));
console.log(minCostConnectPoints([[0, 0]]));
