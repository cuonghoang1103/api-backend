// @java: Luyen1074.java
// LC 1074 · Number of Submatrices That Sum to Target — fix a band of rows, then it is LC 560 on column sums.

// #region giai
function numSubmatrixSumTarget(matrix: number[][], target: number): number {
  const m = matrix.length, n = matrix[0].length;
  let count = 0;
  for (let top = 0; top < m; top++) {
    const col = new Array(n).fill(0);              // col[c] = matrix[top][c] + ... + matrix[bottom][c]
    for (let bottom = top; bottom < m; bottom++) {
      for (let c = 0; c < n; c++) col[c] += matrix[bottom][c]; // grow the band by one row: O(n)
      // LC 560 on col: how many column ranges [l..r] have sum == target
      const seen = new Map<number, number>([[0, 1]]);          // {0: 1} = the empty prefix
      let sum = 0;
      for (let c = 0; c < n; c++) {
        sum += col[c];
        count += seen.get(sum - target) ?? 0;
        seen.set(sum, (seen.get(sum) ?? 0) + 1);
      }
    }
  }
  return count;
}
// #endregion

// Check with the 2-D prefix sum of lesson 1.2: every rectangle in O(1), O(m^2 n^2) rectangles.
// #region vet-can
function bruteWith2D(matrix: number[][], target: number): number {
  const m = matrix.length, n = matrix[0].length;
  const P = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let r = 0; r < m; r++)
    for (let c = 0; c < n; c++) P[r + 1][c + 1] = matrix[r][c] + P[r][c + 1] + P[r + 1][c] - P[r][c];
  let count = 0;
  for (let r1 = 0; r1 < m; r1++)
    for (let r2 = r1; r2 < m; r2++)
      for (let c1 = 0; c1 < n; c1++)
        for (let c2 = c1; c2 < n; c2++)
          if (P[r2 + 1][c2 + 1] - P[r1][c2 + 1] - P[r2 + 1][c1] + P[r1][c1] === target) count++;
  return count;
}
// #endregion

const cases: [number[][], number][] = [
  [[[1, 2, -1], [-1, 0, 2], [3, -2, 1]], 2],
  [[[2, -2], [-2, 2]], 0],
  [[[5]], 5],
  [[[1, 1, 1], [1, 1, 1]], 2],
];
for (const [mat, t] of cases) {
  console.log(`numSubmatrixSumTarget(${JSON.stringify(mat)}, ${t}) = ${numSubmatrixSumTarget(mat, t)}   brute = ${bruteWith2D(mat, t)}`);
}
