// @java: Xoay.java
// Rotated sorted arrays with the SAME firstTrue template: LC 153 (find min) and LC 33 (search), two passes.
function firstTrue(lo: number, hi: number, ok: (i: number) => boolean): number {
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (ok(mid)) hi = mid; else lo = mid + 1;
  }
  return lo;
}

// #region lc153
// [6,8,9,12,1,3,4]: "is nums[i] <= the LAST element?" -> F F F F T T T. The first T is the minimum.
function minIndex(nums: number[]): number {
  const last = nums[nums.length - 1];
  return firstTrue(0, nums.length, (i) => nums[i] <= last);
}
function findMin(nums: number[]): number {            // LC 153
  return nums[minIndex(nums)];
}
// #endregion

// #region lc33
function search(nums: number[], target: number): number {   // LC 33
  const n = nums.length, p = minIndex(nums);          // [p, n) and [0, p) are both sorted
  // target <= last element  =>  it can only be in the right part [p, n); otherwise in the left part [0, p)
  const [lo, hi] = target <= nums[n - 1] ? [p, n] : [0, p];
  const i = firstTrue(lo, hi, (k) => nums[k] >= target);   // lowerBound inside that part
  return i < hi && nums[i] === target ? i : -1;
}
// #endregion

const a = [6, 8, 9, 12, 1, 3, 4];
console.log(`nums = ${JSON.stringify(a)}  minIndex = ${minIndex(a)}  findMin = ${findMin(a)}  (rotated ${minIndex(a)} times)`);
console.log(`search for [1,3,4,6,8,9,12,5,13] -> ${JSON.stringify([1, 3, 4, 6, 8, 9, 12, 5, 13].map((t) => search(a, t)))}`);
for (const b of [[1], [2, 1], [1, 2, 3], [3, 1, 2]]) {
  console.log(`nums = ${JSON.stringify(b)}  findMin = ${findMin(b)}  search(2) = ${search(b, 2)}`);
}

// A ring buffer of log timestamps: the writer wrapped around, so the oldest entry is the rotation point.
const ring = [1005, 1009, 1012, 1020, 980, 991, 997, 1001];
const oldest = minIndex(ring);
console.log(`ring buffer: oldest entry at slot ${oldest} (t=${ring[oldest]}), newest at slot ${(oldest - 1 + ring.length) % ring.length} (t=${ring[(oldest - 1 + ring.length) % ring.length]})`);

// Self-test: every rotation of random sorted distinct arrays, every target in range.
let seed = 99;
const rnd = (m: number) => { seed = (seed * 48271) % 2147483647; return seed % m; };
let cases = 0, bad = 0;
for (let t = 0; t < 400; t++) {
  const n = 1 + rnd(9);
  const s = new Set<number>(); while (s.size < n) s.add(rnd(30));
  const sorted = [...s].sort((x, y) => x - y);
  for (let r = 0; r < n; r++) {
    const arr = [...sorted.slice(r), ...sorted.slice(0, r)];
    for (let x = -1; x <= 31; x++) {
      cases++;
      if (search(arr, x) !== arr.indexOf(x)) bad++;
    }
    if (findMin(arr) !== sorted[0]) bad++;
  }
}
console.log(`self-test vs indexOf: ${cases} searches, ${bad} mismatches`);
