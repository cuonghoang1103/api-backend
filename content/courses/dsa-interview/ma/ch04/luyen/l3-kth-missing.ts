// @java: L3KthMissing.java
// LC 1539 · Kth Missing Positive Number. missing(i) = arr[i] - (i + 1) never decreases (computed array).
function firstTrue(lo: number, hi: number, ok: (i: number) => boolean): number {
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (ok(mid)) hi = mid; else lo = mid + 1;
  }
  return lo;
}
// #region giai
function findKthPositive(arr: number[], k: number): number {
  // first i where at least k numbers are missing BEFORE arr[i]
  const i = firstTrue(0, arr.length, (j) => arr[j] - (j + 1) >= k);
  return i + k;        // i numbers of arr are below the answer, plus k missing ones
}
// #endregion
function slow(arr: number[], k: number): number {
  const s = new Set(arr); let x = 0;
  while (k > 0) { x++; if (!s.has(x)) k--; }
  return x;
}
const a = [3, 4, 7, 12, 13];
console.log(`arr = ${JSON.stringify(a)}  missing(i) = ${JSON.stringify(a.map((v, i) => v - (i + 1)))}`);
console.log(`k = 1..9 -> ${JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => findKthPositive(a, k)))}`);
console.log(`slow    -> ${JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => slow(a, k)))}`);
console.log(`arr = [1,2,3], k = 2 -> ${findKthPositive([1, 2, 3], 2)}`);
