// @java: MaTran.java
// LC 74: a row-major sorted matrix IS one sorted array of m*n cells -> the same lowerBound.
// LC 240: rows and columns sorted separately -> NOT one sorted array; the staircase walk is O(m + n).
let probes = 0;
function firstTrue(lo: number, hi: number, ok: (i: number) => boolean): number {
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (ok(mid)) hi = mid; else lo = mid + 1;
  }
  return lo;
}

// #region lc74
function searchMatrix(M: number[][], target: number): boolean {   // LC 74
  const m = M.length, n = M[0].length;
  const cell = (k: number) => { probes++; return M[Math.floor(k / n)][k % n]; };   // index k -> row k / n, column k % n
  const k = firstTrue(0, m * n, (i) => cell(i) >= target);
  return k < m * n && M[Math.floor(k / n)][k % n] === target;
}
// #endregion

// #region lc240
function searchMatrixII(M: number[][], target: number): boolean { // LC 240
  let r = 0, c = M[0].length - 1;          // start top-right: left is smaller, down is bigger
  while (r < M.length && c >= 0) {
    probes++;
    if (M[r][c] === target) return true;
    if (M[r][c] > target) c--;             // the whole column below is even bigger: drop it
    else r++;                              // the whole row to the left is even smaller: drop it
  }
  return false;
}
// #endregion

const A = [[2, 4, 7, 9], [12, 15, 18, 21], [25, 31, 40, 44]];
for (const t of [7, 13, 44, 0, 50]) { probes = 0; const r = searchMatrix(A, t); console.log(`LC 74  target=${t}: ${r} (${probes} probes of 12 cells)`); }
const B = [[1, 5, 9, 14], [3, 6, 11, 17], [4, 8, 13, 20], [10, 15, 19, 25]];
for (const t of [8, 12, 25, 1]) { probes = 0; const r = searchMatrixII(B, t); console.log(`LC 240 target=${t}: ${r} (${probes} steps of 16 cells)`); }
const flat = B.flat();
console.log(`LC 240 matrix read row by row = ${JSON.stringify(flat)}  -> sorted? ${flat.every((v, i) => i === 0 || flat[i - 1] <= v)}`);
