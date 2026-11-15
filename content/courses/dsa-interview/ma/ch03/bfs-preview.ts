// @java: BfsPreview.java
// LC 1091 · Shortest Path in Binary Matrix — BFS: a queue visits cells in order of distance (8 directions).

// #region giai
function shortestPathBinaryMatrix(g: number[][]): number {
  const n = g.length;
  if (g[0][0] === 1 || g[n - 1][n - 1] === 1) return -1;
  const q: [number, number, number][] = [[0, 0, 1]];  // [row, col, path length so far]
  let head = 0;
  g[0][0] = 1;                                     // mark visited WHEN ENQUEUED, not when dequeued
  while (head < q.length) {
    const [r, c, d] = q[head++];
    if (r === n - 1 && c === n - 1) return d;      // the first time we reach it is the shortest
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nc >= 0 && nr < n && nc < n && g[nr][nc] === 0) { g[nr][nc] = 1; q.push([nr, nc, d + 1]); }
    }
  }
  return -1;
}
// #endregion

console.log(shortestPathBinaryMatrix([[0, 1], [1, 0]]));
console.log(shortestPathBinaryMatrix([[0, 0, 0], [1, 1, 0], [1, 1, 0]]));
console.log(shortestPathBinaryMatrix([[1, 0, 0], [1, 1, 0], [1, 1, 0]]));
console.log(shortestPathBinaryMatrix([[0, 0, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 1, 1, 0]]));
