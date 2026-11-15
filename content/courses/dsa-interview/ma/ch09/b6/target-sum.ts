// @java: LuTargetSum.java
// LC 494 Target Sum — algebra turns "+/- signs" into "count subsets with sum P", a 0/1 knapsack that COUNTS.

// #region giai
function findTargetSumWays(nums: number[], target: number): number {
  const S = nums.reduce((a, b) => a + b, 0);
  // plus-group P and minus-group M:  P + M = S,  P - M = target  =>  P = (S + target) / 2
  if (Math.abs(target) > S || (S + target) % 2 !== 0) return 0;
  const P = (S + target) / 2;
  const dp: number[] = new Array(P + 1).fill(0);   // dp[j] = number of subsets (of items seen so far) with sum j
  dp[0] = 1;                                       // base: the empty subset
  for (const x of nums) {
    for (let j = P; j >= x; j--) dp[j] += dp[j - x]; // j goes DOWN: each item used at most once
  }
  return dp[P];
}
// #endregion

// #region sai
// WRONG: j goes UP, so dp[j - x] may already include x — the same item gets reused.
function waysAscending(nums: number[], target: number): number {
  const S = nums.reduce((a, b) => a + b, 0);
  if (Math.abs(target) > S || (S + target) % 2 !== 0) return 0;
  const P = (S + target) / 2;
  const dp: number[] = new Array(P + 1).fill(0); dp[0] = 1;
  for (const x of nums) for (let j = x; j <= P; j++) dp[j] += dp[j - x];
  return dp[P];
}
// #endregion

// Brute force: try all 2^n sign patterns.
function brute(nums: number[], target: number): number {
  let c = 0;
  for (let mask = 0; mask < 1 << nums.length; mask++) {
    let s = 0;
    for (let i = 0; i < nums.length; i++) s += mask & (1 << i) ? nums[i] : -nums[i];
    if (s === target) c++;
  }
  return c;
}

const cases: Array<[number[], number]> = [[[1, 1, 1, 1, 1], 3], [[2, 1, 3], 0], [[0, 0, 1], 1], [[1, 2], 4], [[1, 2], 2], [[7], -7]];
for (const [a, t] of cases) {
  console.log(`${JSON.stringify(a)} target ${t}: dp = ${findTargetSumWays(a, t)}   brute = ${brute(a, t)}   ascending-j bug = ${waysAscending(a, t)}`);
}
let seed = 20261115;
const rnd = (m: number) => { seed = (seed * 48271) % 2147483647; return seed % m; };
let bad = 0;
for (let k = 0; k < 2000; k++) {
  const n = 1 + rnd(10);
  const a = Array.from({ length: n }, () => rnd(6));
  const t = rnd(13) - 6;
  if (findTargetSumWays(a, t) !== brute(a, t)) bad++;
}
console.log(`random self-test vs 2^n brute force: 2000 cases, ${bad} mismatches`);
