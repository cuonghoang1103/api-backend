// @java: DapAn.java
// Three more "binary search on the answer" problems, each = firstTrue + a greedy O(n) check.
let checks = 0;
function firstTrue(lo: number, hi: number, ok: (i: number) => boolean): number {
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    checks++;
    if (ok(mid)) hi = mid; else lo = mid + 1;
  }
  return lo;
}

// #region lc1011
function shipWithinDays(weights: number[], days: number): number {           // LC 1011
  const daysNeeded = (cap: number) => {      // greedy: load in order, start a new day when the next box does not fit
    let d = 1, load = 0;
    for (const w of weights) {
      if (load + w > cap) { d++; load = 0; }
      load += w;
    }
    return d;
  };
  const lo = Math.max(...weights);           // smaller than the heaviest box: impossible
  const hi = weights.reduce((s, w) => s + w, 0);   // everything in one day: always possible
  return firstTrue(lo, hi, (cap) => daysNeeded(cap) <= days);
}
// #endregion

// #region lc1482
function minDays(bloomDay: number[], m: number, k: number): number {        // LC 1482
  if (m * k > bloomDay.length) return -1;    // not enough flowers at all (in Java: m * k overflows int!)
  const bouquetsOn = (day: number) => {      // greedy: count runs of k adjacent bloomed flowers
    let made = 0, run = 0;
    for (const b of bloomDay) {
      run = b <= day ? run + 1 : 0;
      if (run === k) { made++; run = 0; }
    }
    return made;
  };
  return firstTrue(Math.min(...bloomDay), Math.max(...bloomDay), (day) => bouquetsOn(day) >= m);
}
// #endregion

// #region lc410
function splitArray(nums: number[], k: number): number {                    // LC 410
  const piecesNeeded = (limit: number) => {  // greedy: cut as late as possible so no piece sum exceeds limit
    let pieces = 1, sum = 0;
    for (const x of nums) {
      if (sum + x > limit) { pieces++; sum = 0; }
      sum += x;
    }
    return pieces;
  };
  return firstTrue(Math.max(...nums), nums.reduce((s, x) => s + x, 0), (limit) => piecesNeeded(limit) <= k);
}
// #endregion

const w = [3, 8, 2, 7, 5, 4, 6, 1];
for (const d of [1, 3, 4, 8]) { checks = 0; console.log(`ship ${JSON.stringify(w)} in ${d} days -> capacity ${shipWithinDays(w, d)} (${checks} checks)`); }
const bloom = [7, 2, 9, 3, 3, 8, 1, 4];
for (const [m, k] of [[2, 2], [3, 2], [1, 8], [5, 2]]) { checks = 0; console.log(`bouquets m=${m} k=${k} from ${JSON.stringify(bloom)} -> day ${minDays(bloom, m, k)} (${checks} checks)`); }
const a = [9, 2, 6, 4, 11, 3, 5];
for (const k of [1, 2, 3, 7]) { checks = 0; console.log(`split ${JSON.stringify(a)} into ${k} -> largest piece ${splitArray(a, k)} (${checks} checks)`); }

// Self-test against brute force (try every answer from the lower bound up).
let seed = 11;
const rnd = (q: number) => { seed = (seed * 48271) % 2147483647; return seed % q; };
let bad = 0;
for (let t = 0; t < 500; t++) {
  const n = 1 + rnd(7);
  const arr = Array.from({ length: n }, () => 1 + rnd(9));
  const k = 1 + rnd(n);
  let slow = Math.max(...arr);
  const pieces = (lim: number) => { let p = 1, s = 0; for (const x of arr) { if (s + x > lim) { p++; s = 0; } s += x; } return p; };
  while (pieces(slow) > k) slow++;
  if (splitArray(arr, k) !== slow || shipWithinDays(arr, k) !== slow) bad++;
}
console.log(`self-test split/ship vs brute force: 500 cases, ${bad} mismatches`);
