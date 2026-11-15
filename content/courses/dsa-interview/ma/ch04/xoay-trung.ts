// @java: XoayTrung.java
// Duplicates break the F...F T...T row of a rotated array. Fix = trim, then the same template. Worst case O(n).
let steps = 0;
function firstTrue(lo: number, hi: number, ok: (i: number) => boolean): number {
  while (lo < hi) {
    steps++;
    const mid = lo + Math.floor((hi - lo) / 2);
    if (ok(mid)) hi = mid; else lo = mid + 1;
  }
  return lo;
}
const row = (nums: number[], last: number) => nums.map((v) => (v <= last ? 'T' : 'F')).join('');

// #region lc154
function minIndexDup(nums: number[]): number {        // LC 154 (and the first half of LC 81)
  let hi = nums.length;
  // While the last element equals the first, it tells us nothing: drop it. This is the O(n) part.
  while (hi > 1 && nums[hi - 1] === nums[0]) { hi--; steps++; }
  const last = nums[hi - 1];
  return firstTrue(0, hi, (i) => nums[i] <= last);    // now the row is F...F T...T again
}
// #endregion

// #region lc81
function searchDup(nums: number[], target: number): boolean {   // LC 81
  let end = nums.length;
  while (end > 1 && nums[end - 1] === nums[0]) end--;  // same trim; the dropped copies equal nums[0]
  const p = minIndexDup(nums.slice(0, end));
  const [lo, hi] = target <= nums[end - 1] ? [p, end] : [0, p];
  const i = firstTrue(lo, hi, (k) => nums[k] >= target);
  return i < hi && nums[i] === target;
}
// #endregion

const bad = [1, 1, 1, 0, 1, 1];
const naive = firstTrue(0, bad.length, (i) => bad[i] <= bad[bad.length - 1]);
console.log(`nums = ${JSON.stringify(bad)}  row "<= last" = ${row(bad, bad[bad.length - 1])}  naive template -> index ${naive}, value ${bad[naive]} (WRONG, min is 0)`);
console.log(`trimmed: minIndexDup = ${minIndexDup(bad)}, value ${bad[minIndexDup(bad)]}`);
for (const b of [[2, 2, 2, 0, 1, 2], [3, 3, 3], [1, 1, 2, 3, 1], [2, 5, 6, 0, 0, 1, 2]]) {
  console.log(`nums = ${JSON.stringify(b)}  min = ${b[minIndexDup(b)]}  search(0) = ${searchDup(b, 0)}  search(3) = ${searchDup(b, 3)}`);
}
// Adversarial input: n ones with a single 0. Any algorithm must look everywhere; we count our steps.
for (const n of [1_000, 100_000]) {
  const zeroAt = 1;                          // [1, 0, 1, 1, ..., 1]
  const arr = Array.from({ length: n }, (_, i) => (i === zeroAt ? 0 : 1));
  steps = 0; const m = minIndexDup(arr);
  const distinct = Array.from({ length: n }, (_, i) => (i + 3) % n);   // a rotation without duplicates
  const s1 = steps; steps = 0; minIndexDup(distinct);
  console.log(`n=${n}: ones + one 0 -> min at ${m}, ${s1} steps | distinct rotated -> ${steps} steps`);
}
// Self-test with duplicates.
let seed = 5;
const rnd = (k: number) => { seed = (seed * 48271) % 2147483647; return seed % k; };
let cases = 0, wrong = 0;
for (let t = 0; t < 2000; t++) {
  const n = 1 + rnd(8);
  const sorted = Array.from({ length: n }, () => rnd(4)).sort((x, y) => x - y);
  const r = rnd(n);
  const arr = [...sorted.slice(r), ...sorted.slice(0, r)];
  if (arr[minIndexDup(arr)] !== sorted[0]) wrong++;
  for (let x = -1; x <= 4; x++) { cases++; if (searchDup(arr, x) !== arr.includes(x)) wrong++; }
}
console.log(`self-test with duplicates: ${cases} searches + 2000 mins, ${wrong} mismatches`);
