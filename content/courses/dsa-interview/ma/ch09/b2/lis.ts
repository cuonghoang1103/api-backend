// @java: McLis.java
// LC 300 Longest Increasing Subsequence: O(n²) DP, then O(n log n) with Chapter 4's firstTrue.

// #region n2
// dp[i] = length of the longest strictly increasing subsequence that ENDS at index i.
function lengthOfLISQuadratic(nums: number[]): number {
  const n = nums.length;
  const dp = new Array<number>(n).fill(1);          // base: nums[i] alone
  let best = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);   // extend a run ending at j
    }
    best = Math.max(best, dp[i]);
  }
  return best;
}
// #endregion

// #region khuon
// Chapter 4's ONE template (unchanged): first index in [lo, hi) where ok is true.
function firstTrue(lo: number, hi: number, ok: (i: number) => boolean): number {
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (ok(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}
// #endregion

// #region nlogn
// tails[k] = the SMALLEST possible last value of an increasing subsequence of length k + 1.
// tails is always sorted, so "where does x go?" is a binary search.
function lengthOfLIS(nums: number[]): number {
  const tails: number[] = [];
  for (const x of nums) {
    const k = firstTrue(0, tails.length, (i) => tails[i] >= x);   // lowerBound: first tail >= x
    if (k === tails.length) tails.push(x);           // x extends the longest run
    else tails[k] = x;                               // x is a smaller ending for length k + 1
  }
  return tails.length;
}
// #endregion

for (const a of [[10, 9, 2, 5, 3, 7, 101, 18], [0, 1, 0, 3, 2, 3], [7, 7, 7, 7], [5], [1, 2, 3, 4, 5], [5, 4, 3, 2, 1], [3, 5, 6, 2, 5, 4, 19, 5, 6, 7, 12]]) {
  console.log(`LIS(${JSON.stringify(a)}) = ${lengthOfLISQuadratic(a)} (O(n²))  ${lengthOfLIS(a)} (O(n log n))`);
}

// Self-test: both versions on random arrays (same pseudo-random numbers as the Java file).
let seed = 20261115;
const rnd = (m: number) => { seed = (seed * 48271) % 2147483647; return seed % m; };
let bad = 0;
for (let t = 0; t < 2000; t++) {
  const n = rnd(15);
  const a = Array.from({ length: n }, () => rnd(10));
  if (lengthOfLIS(a) !== lengthOfLISQuadratic(a)) bad++;
}
console.log(`random self-test O(n log n) vs O(n²): 2000 cases, ${bad} mismatches`);
