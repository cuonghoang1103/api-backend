// @java: HcUniquePaths.java
// LC 62 Unique Paths (2D table, then one row) + LC 63 Unique Paths II (obstacles).

// #region bang
function uniquePaths(m: number, n: number): number {
  // dp[r][c] = number of ways to reach cell (r, c) moving only right or down
  const dp: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (r === 0 || c === 0) dp[r][c] = 1;          // base: first row / first column, one straight way
      else dp[r][c] = dp[r - 1][c] + dp[r][c - 1];   // came from above + came from the left
    }
  }
  return dp[m - 1][n - 1];
}
// #endregion

// #region mot-hang
function uniquePaths1Row(m: number, n: number): number {
  const row = new Array(n).fill(1);                  // row 0: all ones
  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) row[c] += row[c - 1]; // row[c] (old = above) + row[c-1] (new = left)
  }
  return row[n - 1];
}
// #endregion

// #region vat-can
function uniquePathsWithObstacles(g: number[][]): number {
  const n = g[0].length;
  const row = new Array(n).fill(0);
  row[0] = g[0][0] === 1 ? 0 : 1;
  for (let r = 0; r < g.length; r++) {
    for (let c = 0; c < n; c++) {
      if (g[r][c] === 1) row[c] = 0;                 // a rock: nobody gets through this cell
      else if (c > 0) row[c] += row[c - 1];
    }
  }
  return row[n - 1];
}
// #endregion

console.log(`uniquePaths(3, 7) = ${uniquePaths(3, 7)}   one-row = ${uniquePaths1Row(3, 7)}`);
console.log(`uniquePaths(3, 4) = ${uniquePaths(3, 4)}   one-row = ${uniquePaths1Row(3, 4)}`);
console.log(`uniquePaths(1, 1) = ${uniquePaths(1, 1)}   uniquePaths(10, 10) = ${uniquePaths(10, 10)}`);
console.log(`withObstacles([[0,0,0],[0,1,0],[0,0,0]]) = ${uniquePathsWithObstacles([[0, 0, 0], [0, 1, 0], [0, 0, 0]])}`);
console.log(`withObstacles([[0,1],[0,0]]) = ${uniquePathsWithObstacles([[0, 1], [0, 0]])}   withObstacles([[1]]) = ${uniquePathsWithObstacles([[1]])}`);
