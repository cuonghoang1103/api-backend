// @java: Dinh.java
// Peaks without a sorted array: LC 162 (any peak), LC 852 (mountain), and a real-life use — tuning concurrency.
function firstTrue(lo: number, hi: number, ok: (i: number) => boolean): number {
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (ok(mid)) hi = mid; else lo = mid + 1;
  }
  return lo;
}

// #region lc162
// ok(i) = "going down after i?" on [0, n-1). The loop keeps: (lo == 0 or we came UP into lo) and
// (hi == n-1 or we go DOWN after hi). When lo == hi, that index is a peak.
function findPeakElement(nums: number[]): number {     // LC 162 (and LC 852 for a mountain)
  return firstTrue(0, nums.length - 1, (i) => nums[i] > nums[i + 1]);
}
// #endregion

const isPeak = (a: number[], i: number) => (i === 0 || a[i - 1] < a[i]) && (i === a.length - 1 || a[i] > a[i + 1]);
for (const a of [[2, 4, 3, 1, 5, 7, 6], [1, 3, 2, 4, 1], [5], [1, 2], [2, 1], [1, 2, 3, 4], [0, 3, 8, 9, 6, 2]]) {
  const p = findPeakElement(a);
  const all = a.map((_, i) => i).filter((i) => isPeak(a, i));
  console.log(`nums = ${JSON.stringify(a)}  peak index = ${p}  (all peaks: ${JSON.stringify(all)})  ok row = ${a.slice(0, -1).map((v, i) => (v > a[i + 1] ? 'T' : 'F')).join('')}`);
}

// #region tune
// Throughput (requests/s) of a service at c concurrent workers: rises, then falls (contention).
// One "measurement" = one load test. Find the best c in 1..64 with a slope comparison.
let tests = 0;
const throughput = (c: number) => { tests++; return Math.round((1000 * c) / (1 + 0.004 * c * c)); };
const best = 1 + firstTrue(0, 63, (i) => throughput(i + 1) > throughput(i + 2));   // index i <-> c = i + 1
// #endregion
console.log(`best concurrency = ${best} (${throughput(best)} req/s) after ${tests - 1} load tests instead of 64`);
let arg = 1; for (let c = 1; c <= 64; c++) if (throughput(c) > throughput(arg)) arg = c;
console.log(`check by trying all 64: best = ${arg}`);

let seed = 3;
const rnd = (m: number) => { seed = (seed * 48271) % 2147483647; return seed % m; };
let bad = 0;
for (let t = 0; t < 3000; t++) {
  const n = 1 + rnd(10);
  const a: number[] = [rnd(5)];
  for (let i = 1; i < n; i++) a.push(a[i - 1] + (rnd(2) ? 1 + rnd(3) : -1 - rnd(3)));   // neighbours never equal
  if (!isPeak(a, findPeakElement(a))) bad++;
}
console.log(`self-test: 3000 random arrays (neighbours distinct), ${bad} non-peaks returned`);
