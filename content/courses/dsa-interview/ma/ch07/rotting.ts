// @java: Rotting.java
// LC 994 · Rotting Oranges — MULTI-SOURCE BFS: every rotten orange starts in the queue at minute 0.

// #region giai
function orangesRotting(grid: number[][]): number {
  const R = grid.length, C = grid[0].length;
  let q: number[][] = [];
  let fresh = 0;
  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++) {
      if (grid[r][c] === 2) q.push([r, c]);       // all sources at once
      else if (grid[r][c] === 1) fresh++;
    }
  let minutes = 0;
  while (q.length > 0 && fresh > 0) {             // one loop turn = one minute = one BFS level
    const next: number[][] = [];
    for (const [r, c] of q) {
      for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] === 1) {
          grid[nr][nc] = 2; fresh--; next.push([nr, nc]);
        }
      }
    }
    q = next;
    minutes++;
  }
  return fresh === 0 ? minutes : -1;              // someone was never reached
}
// #endregion

console.log(orangesRotting([[2, 1, 1], [1, 1, 0], [0, 1, 1]]));
console.log(orangesRotting([[2, 1, 1], [0, 1, 1], [1, 0, 1]]));
console.log(orangesRotting([[0, 2]]));
console.log(orangesRotting([[2, 1, 1, 1, 1, 1, 2]]));
