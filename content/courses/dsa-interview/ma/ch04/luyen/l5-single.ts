// @java: L5Single.java
// LC 540 · Single Element in a Sorted Array. Search over PAIR indices p: before the single element every pair
// (2p, 2p + 1) is equal; from the single element on, it is not. F...F T...T over p.
function firstTrue(lo: number, hi: number, ok: (i: number) => boolean): number {
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (ok(mid)) hi = mid; else lo = mid + 1;
  }
  return lo;
}
// #region giai
function singleNonDuplicate(nums: number[]): number {
  const pairs = (nums.length - 1) / 2;                       // n is odd; the last pair index is "known T"
  const p = firstTrue(0, pairs, (q) => nums[2 * q] !== nums[2 * q + 1]);
  return nums[2 * p];
}
// #endregion
for (const a of [[2, 2, 5, 6, 6, 9, 9, 12, 12], [4, 4, 8, 8, 13, 15, 15], [5], [1, 1, 2], [0, 1, 1], [1, 1, 2, 2, 3]]) {
  const row = Array.from({ length: (a.length - 1) / 2 }, (_, q) => (a[2 * q] !== a[2 * q + 1] ? 'T' : 'F')).join('');
  console.log(`nums = ${JSON.stringify(a)}  pair row = ${row || '(none)'}  single = ${singleNonDuplicate(a)}`);
}
