// @java: L6Gold.java
// LC 1219 · Path with Maximum Gold — Word Search's grid DFS, but we want the BEST path, not any path.

// #region giai
function getMaximumGold(grid: number[][]): number {
  const m = grid.length, n = grid[0].length;
  function dfs(r: number, c: number): number {
    if (r < 0 || c < 0 || r === m || c === n || grid[r][c] === 0) return 0;
    const g = grid[r][c];
    grid[r][c] = 0;                                   // mark: cannot step here again on this path
    const best = Math.max(dfs(r + 1, c), dfs(r - 1, c), dfs(r, c + 1), dfs(r, c - 1));
    grid[r][c] = g;                                   // restore for other paths
    return g + best;
  }
  let ans = 0;
  for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) if (grid[r][c] > 0) ans = Math.max(ans, dfs(r, c));
  return ans;
}
// #endregion

console.log(getMaximumGold([[0, 6, 0], [5, 8, 7], [0, 9, 0]]));
console.log(getMaximumGold([[1, 0, 7], [2, 0, 6], [3, 4, 5], [0, 3, 0], [9, 0, 20]]));
console.log(getMaximumGold([[0, 0], [0, 0]]));
