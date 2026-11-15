// @java: Prefix2D.java
// LC 304 · Range Sum Query 2D - Immutable — a (m+1) x (n+1) prefix table, inclusion-exclusion per query.

// #region lop
class NumMatrix {
  private P: number[][]; // P[r][c] = sum of the rectangle rows 0..r-1, cols 0..c-1

  constructor(matrix: number[][]) {
    const m = matrix.length, n = matrix[0].length;
    this.P = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let r = 0; r < m; r++)
      for (let c = 0; c < n; c++)
        this.P[r + 1][c + 1] = matrix[r][c] + this.P[r][c + 1] + this.P[r + 1][c] - this.P[r][c];
  }

  sumRegion(r1: number, c1: number, r2: number, c2: number): number {
    const P = this.P;
    return P[r2 + 1][c2 + 1] - P[r1][c2 + 1] - P[r2 + 1][c1] + P[r1][c1];
  }
}
// #endregion

const M = [
  [3, 0, 1, 4],
  [5, 6, 3, 2],
  [1, 2, 0, 1],
  [4, 1, 0, 1],
];
const nm = new NumMatrix(M);
console.log('P =');
for (const row of (nm as any).P) console.log('  ' + JSON.stringify(row));
for (const q of [[1, 1, 2, 2], [0, 0, 3, 3], [2, 1, 3, 3], [0, 3, 0, 3]]) {
  console.log(`sumRegion(${q.join(', ')}) = ${nm.sumRegion(q[0], q[1], q[2], q[3])}`);
}
