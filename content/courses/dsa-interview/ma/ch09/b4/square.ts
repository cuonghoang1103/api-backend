// @java: NdSquare.java
// LC 221 Maximal Square (state "ending here") and LC 120 Triangle (choose the order that makes the base trivial).

// #region square
function maximalSquare(matrix: string[][]): number {
  const R = matrix.length, C = matrix[0].length;
  // dp[r + 1][c + 1] = side of the largest all-'1' square whose BOTTOM-RIGHT corner is (r, c).
  // One extra row and column of zeros: the borders need no special case.
  const dp = Array.from({ length: R + 1 }, () => new Array<number>(C + 1).fill(0));
  let best = 0;
  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      if (matrix[r][c] !== '1') continue;                         // a '0' corner: no square ends here
      dp[r + 1][c + 1] = 1 + Math.min(dp[r][c + 1], dp[r + 1][c], dp[r][c]);   // up, left, up-left
      best = Math.max(best, dp[r + 1][c + 1]);
    }
  }
  return best * best;                                             // the problem asks for the AREA
}
// #endregion

// #region triangle
function minimumTotal(triangle: number[][]): number {
  // Bottom-up: below[c] = cheapest path from row r + 1, column c, down to the bottom. The last row is its own answer.
  let below = [...triangle[triangle.length - 1]];
  for (let r = triangle.length - 2; r >= 0; r--) {
    const cur = triangle[r].map((x, c) => x + Math.min(below[c], below[c + 1]));
    below = cur;
  }
  return below[0];                                                // the apex: no "pick the min of the last row"
}
// #endregion

const grid = ['1101', '1111', '0111', '1111'].map((s) => s.split(''));
console.log(`maximalSquare(${JSON.stringify(grid.map((r) => r.join('')))}) = ${maximalSquare(grid)}`);
console.log(`maximalSquare(["01","10"]) = ${maximalSquare([['0', '1'], ['1', '0']])}   maximalSquare(["0"]) = ${maximalSquare([['0']])}`);
const tri = [[5], [9, 6], [4, 6, 8], [0, 7, 1, 5]];
console.log(`minimumTotal(${JSON.stringify(tri)}) = ${minimumTotal(tri)}`);
console.log(`minimumTotal([[-3],[2,-1],[4,1,-9]]) = ${minimumTotal([[-3], [2, -1], [4, 1, -9]])}`);
