// @java: UnionFind.java
// Union-find (disjoint set union, DSU) with path compression + union by size, then two LeetCode problems.

// #region dsu
class DSU {
  parent: number[];
  size: number[];
  sets: number;
  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);   // everyone starts as their own root
    this.size = new Array<number>(n).fill(1);
    this.sets = n;
  }
  find(x: number): number {
    let root = x;
    while (this.parent[root] !== root) root = this.parent[root];      // 1st pass: climb to the root
    while (this.parent[x] !== root) { const nx = this.parent[x]; this.parent[x] = root; x = nx; }   // 2nd: compress
    return root;
  }
  union(a: number, b: number): boolean {
    let ra = this.find(a), rb = this.find(b);
    if (ra === rb) return false;                                      // already together: this edge closes a cycle
    if (this.size[ra] < this.size[rb]) [ra, rb] = [rb, ra];
    this.parent[rb] = ra;                                             // smaller tree goes under the bigger one
    this.size[ra] += this.size[rb];
    this.sets--;
    return true;
  }
}
// #endregion

// #region provinces
function findCircleNum(isConnected: number[][]): number {            // LC 547: input is an adjacency MATRIX
  const d = new DSU(isConnected.length);
  for (let i = 0; i < isConnected.length; i++)
    for (let j = i + 1; j < isConnected.length; j++) if (isConnected[i][j] === 1) d.union(i, j);
  return d.sets;
}
// #endregion

// #region redundant
function findRedundantConnection(edges: number[][]): number[] {     // LC 684: nodes 1..n, n edges, one too many
  const d = new DSU(edges.length + 1);
  for (const [u, v] of edges) if (!d.union(u, v)) return [u, v];    // first edge whose ends are already connected
  return [];
}
// #endregion

console.log(findCircleNum([[1, 1, 0], [1, 1, 0], [0, 0, 1]]), findCircleNum([[1, 0, 0], [0, 1, 0], [0, 0, 1]]));
console.log(JSON.stringify(findRedundantConnection([[1, 2], [1, 3], [2, 3]])), JSON.stringify(findRedundantConnection([[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]])));
