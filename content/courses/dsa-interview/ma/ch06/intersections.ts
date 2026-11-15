// @java: Intersections.java
// LC 986 · Interval List Intersections — two sorted, disjoint lists; two pointers, O(m + n).

// #region giai
function intervalIntersection(A: number[][], B: number[][]): number[][] {
  const out: number[][] = [];
  let i = 0, j = 0;
  while (i < A.length && j < B.length) {
    const lo = Math.max(A[i][0], B[j][0]);       // the later start
    const hi = Math.min(A[i][1], B[j][1]);       // the earlier end
    if (lo <= hi) out.push([lo, hi]);            // closed intervals: [5,5] is a real (one-point) overlap
    if (A[i][1] < B[j][1]) i++; else j++;        // drop the one that ends first: it cannot meet anything else
  }
  return out;
}
// #endregion

console.log(JSON.stringify(intervalIntersection([[1, 4], [6, 9], [12, 15]], [[2, 6], [9, 13], [15, 18]])));
console.log(JSON.stringify(intervalIntersection([[1, 3], [5, 9]], [])));
console.log(JSON.stringify(intervalIntersection([[1, 7]], [[3, 10]])));
