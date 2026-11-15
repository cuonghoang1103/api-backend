// @java: L2MaxArea.java
// LC 695 · Max Area of Island — the traversal of Number of Islands, but it RETURNS the size it sank.

// #region giai
function maxAreaOfIsland(grid: number[][]): number {
  const R = grid.length, C = grid[0].length;
  let best = 0;
  for (let r0 = 0; r0 < R; r0++)
    for (let c0 = 0; c0 < C; c0++) {
      if (grid[r0][c0] !== 1) continue;
      let area = 0;
      const stack = [[r0, c0]];
      grid[r0][c0] = 0;
      while (stack.length > 0) {
        const [r, c] = stack.pop()!;
        area++;
        for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] === 1) { grid[nr][nc] = 0; stack.push([nr, nc]); }
        }
      }
      best = Math.max(best, area);
    }
  return best;
}
// #endregion

console.log(maxAreaOfIsland([[1, 1, 0, 0, 0], [1, 1, 0, 0, 0], [0, 0, 0, 1, 1], [0, 0, 0, 1, 1]]));
console.log(maxAreaOfIsland([[0, 1, 1], [1, 1, 0], [0, 0, 1]]));
console.log(maxAreaOfIsland([[0, 0, 0, 0]]));
