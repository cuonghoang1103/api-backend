// @java: PvJobs.java
// LC 1235 · Maximum Profit in Job Scheduling — weighted interval scheduling.
// Sort jobs by END time. dp[i] = best profit using only the first i jobs (in that order).
//   skip job i-1:  dp[i-1]
//   take job i-1:  profit + dp[j], j = number of jobs whose end <= this job's start  (binary search, Chapter 4)
// O(n log n) time, O(n) memory. A job ending at time X is compatible with one starting at X.

// #region dp-nhi-phan
function jobScheduling(start: number[], end: number[], profit: number[]): number {
  const n = start.length;
  const idx = Array.from({ length: n }, (_, i) => i).sort((a, b) => end[a] - end[b]);
  const ends = idx.map((i) => end[i]);              // sorted end times
  const dp = new Array<number>(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    const job = idx[i - 1];
    let lo = 0, hi = i - 1;                          // first position in ends[0..i-1) with end > start[job]
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (ends[mid] > start[job]) hi = mid; else lo = mid + 1;
    }
    dp[i] = Math.max(dp[i - 1], profit[job] + dp[lo]);   // lo = how many earlier jobs end by start[job]
  }
  return dp[n];
}
// #endregion

// #region truy-vet
function chosenJobs(start: number[], end: number[], profit: number[]): number[] {
  const n = start.length;
  const idx = Array.from({ length: n }, (_, i) => i).sort((a, b) => end[a] - end[b]);
  const ends = idx.map((i) => end[i]);
  const dp = new Array<number>(n + 1).fill(0);
  const prev = new Array<number>(n + 1).fill(0);   // prev[i] = the "lo" used when job i-1 is taken
  for (let i = 1; i <= n; i++) {
    const job = idx[i - 1];
    let lo = 0, hi = i - 1;
    while (lo < hi) { const mid = (lo + hi) >>> 1; if (ends[mid] > start[job]) hi = mid; else lo = mid + 1; }
    prev[i] = lo;
    dp[i] = Math.max(dp[i - 1], profit[job] + dp[lo]);
  }
  const picked: number[] = [];
  for (let i = n; i > 0;) {                          // walk back: did dp[i] come from "take"?
    if (dp[i] === dp[i - 1]) i--;
    else { picked.push(idx[i - 1]); i = prev[i]; }
  }
  return picked.reverse();
}
// #endregion

// brute force over all subsets (n <= 12) — only to cross-check
function brute(start: number[], end: number[], profit: number[]): number {
  const n = start.length;
  let best = 0;
  for (let mask = 0; mask < 1 << n; mask++) {
    const js = [];
    for (let i = 0; i < n; i++) if (mask & (1 << i)) js.push(i);
    js.sort((a, b) => start[a] - start[b]);
    let ok = true, s = 0;
    for (let t = 0; t < js.length; t++) {
      if (t > 0 && start[js[t]] < end[js[t - 1]]) { ok = false; break; }
      s += profit[js[t]];
    }
    if (ok) best = Math.max(best, s);
  }
  return best;
}

const cases: [number[], number[], number[]][] = [
  [[8, 9, 13, 10], [10, 12, 15, 14], [3, 5, 4, 6]],
  [[1, 3, 3, 6, 2], [4, 5, 7, 8, 9], [20, 10, 30, 25, 40]],
  [[1], [2], [5]],
  [[1, 1, 1], [5, 5, 5], [4, 9, 2]],
  [[1, 2, 3], [2, 3, 4], [1, 1, 1]],
  [[1, 2, 2, 3], [3, 3, 5, 6], [10, 1, 1, 100]],
];
for (const [s, e, p] of cases) {
  console.log(`start=${JSON.stringify(s)} end=${JSON.stringify(e)} profit=${JSON.stringify(p)} -> ${jobScheduling(s, e, p)} jobs=${JSON.stringify(chosenJobs(s, e, p))} brute=${brute(s, e, p)}`);
}
let seed = 2026;
const rnd = (m: number) => { seed = (Math.imul(seed, 1103515245) + 12345) >>> 0; return (seed >>> 8) % m; };
let ok = 0;
for (let t = 0; t < 300; t++) {
  const n = 1 + rnd(10);
  const s: number[] = [], e: number[] = [], p: number[] = [];
  for (let i = 0; i < n; i++) { const a = 1 + rnd(20); s.push(a); e.push(a + 1 + rnd(6)); p.push(1 + rnd(30)); }
  if (jobScheduling(s, e, p) === brute(s, e, p)) ok++;
}
console.log(`random: ${ok}/300 match brute force`);
