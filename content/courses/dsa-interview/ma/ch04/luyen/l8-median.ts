// @java: L8Median.java
// LC 4 · Median of Two Sorted Arrays in O(log min(m, n)) — STILL the same template.
// Take i elements from A and j = half - i from B for the left half. ok(i) = "A[i] >= B[j - 1]" is F...F T...T in i
// (A[i] grows, B[j - 1] shrinks as i grows). The first T is the split where every left element <= every right one.
function firstTrue(lo: number, hi: number, ok: (i: number) => boolean): number {
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (ok(mid)) hi = mid; else lo = mid + 1;
  }
  return lo;
}
// #region giai
function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
  const [A, B] = nums1.length <= nums2.length ? [nums1, nums2] : [nums2, nums1];   // search the shorter one
  const m = A.length, n = B.length, half = Math.floor((m + n + 1) / 2);
  const a = (i: number) => (i < 0 ? -Infinity : i >= m ? Infinity : A[i]);         // outside = -inf / +inf
  const b = (j: number) => (j < 0 ? -Infinity : j >= n ? Infinity : B[j]);
  const i = firstTrue(0, m, (k) => a(k) >= b(half - k - 1));                       // i = m is a known T
  const j = half - i;
  const leftMax = Math.max(a(i - 1), b(j - 1));
  if ((m + n) % 2 === 1) return leftMax;
  return (leftMax + Math.min(a(i), b(j))) / 2;
}
// #endregion
const fmt = (x: number) => x.toFixed(1);
for (const [x, y] of [[[1, 4, 9], [2, 3]], [[1, 4], [2, 3]], [[], [5]], [[7, 8, 9], [1, 2]], [[-5, 3, 6, 12, 15], [-12, -10, -6, -3, 4, 10]]]) {
  console.log(`median(${JSON.stringify(x)}, ${JSON.stringify(y)}) = ${fmt(findMedianSortedArrays(x, y))}`);
}
let seed = 17;
const rnd = (q: number) => { seed = (seed * 48271) % 2147483647; return seed % q; };
let bad = 0;
for (let t = 0; t < 3000; t++) {
  const x = Array.from({ length: rnd(6) }, () => rnd(20) - 10).sort((p, q) => p - q);
  const y = Array.from({ length: 1 + rnd(6) }, () => rnd(20) - 10).sort((p, q) => p - q);
  const all = [...x, ...y].sort((p, q) => p - q), L = all.length;
  const slow = L % 2 ? all[(L - 1) / 2] : (all[L / 2 - 1] + all[L / 2]) / 2;
  if (fmt(findMedianSortedArrays(x, y)) !== fmt(slow)) bad++;
}
console.log(`self-test vs merge-and-sort: 3000 cases, ${bad} mismatches`);
