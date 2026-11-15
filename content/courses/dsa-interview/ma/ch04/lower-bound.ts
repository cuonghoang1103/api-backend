// @java: LowerBound.java
// ONE binary-search template for the whole chapter + lower/upper bound + LC 704, LC 35, LC 34.

// #region khuon
// ok(i) must look like  F F ... F T T ... T  on the half-open range [lo, hi).
// Invariant: every i < lo is F, every i >= hi is T. Returns the first T (hi if there is none).
function firstTrue(lo: number, hi: number, ok: (i: number) => boolean): number {
  while (lo < hi) {                            // [lo, hi) is the part we do not know yet
    const mid = lo + Math.floor((hi - lo) / 2); // lo <= mid < hi, no overflow
    if (ok(mid)) hi = mid;                     // mid is T: the first T is mid or left of it
    else lo = mid + 1;                         // mid is F: the first T is right of mid
  }
  return lo;                                   // lo === hi: the boundary between F and T
}
// #endregion

// #region bounds
// lowerBound: first index with a[i] >= x  (= where x would be inserted, before equal values)
const lowerBound = (a: number[], x: number) => firstTrue(0, a.length, (i) => a[i] >= x);
// upperBound: first index with a[i] > x   (= insert position after equal values)
const upperBound = (a: number[], x: number) => firstTrue(0, a.length, (i) => a[i] > x);
// #endregion

// #region lc704
function search(nums: number[], target: number): number {          // LC 704
  const i = lowerBound(nums, target);
  return i < nums.length && nums[i] === target ? i : -1;
}
// #endregion

// #region lc35
function searchInsert(nums: number[], target: number): number {    // LC 35
  return lowerBound(nums, target);
}
// #endregion

// #region lc34
function searchRange(nums: number[], target: number): number[] {   // LC 34
  const first = lowerBound(nums, target);
  if (first === nums.length || nums[first] !== target) return [-1, -1];
  return [first, upperBound(nums, target) - 1];
}
// #endregion

const a = [1, 3, 3, 3, 5, 8, 8, 10];
console.log(`a = ${JSON.stringify(a)}`);
for (const x of [3, 4, 8, 0, 10, 11]) {
  const lb = lowerBound(a, x), ub = upperBound(a, x);
  console.log(`x=${x}  lowerBound=${lb}  upperBound=${ub}  count=${ub - lb}  search=${search(a, x)}  searchRange=${JSON.stringify(searchRange(a, x))}`);
}
const b = [1, 3, 5, 6];
console.log(`searchInsert(${JSON.stringify(b)}, x) for x = 5, 2, 7, 0 -> ${JSON.stringify([5, 2, 7, 0].map((x) => searchInsert(b, x)))}`);
console.log(`searchRange([], 0) = ${JSON.stringify(searchRange([], 0))}   search([5], 5) = ${search([5], 5)}   search([5], -5) = ${search([5], -5)}`);

// Self-test against a slow but obviously correct linear scan (same pseudo-random numbers as the Java file).
let seed = 20261115;
const rnd = (m: number) => { seed = (seed * 48271) % 2147483647; return seed % m; };
let tests = 0, bad = 0;
for (let t = 0; t < 3000; t++) {
  const n = rnd(12);
  const arr = Array.from({ length: n }, () => rnd(10) - 3).sort((p, q) => p - q);
  const x = rnd(14) - 5;
  let slowLb = 0; while (slowLb < n && arr[slowLb] < x) slowLb++;
  let slowUb = 0; while (slowUb < n && arr[slowUb] <= x) slowUb++;
  tests++;
  if (lowerBound(arr, x) !== slowLb || upperBound(arr, x) !== slowUb) bad++;
}
console.log(`random self-test vs linear scan: ${tests} cases, ${bad} mismatches`);
