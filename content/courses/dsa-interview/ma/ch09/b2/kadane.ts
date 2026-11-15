// @java: McKadane.java
// LC 53 Maximum Subarray, written as DP: state = best sum of a subarray that ENDS at i.

// #region kadane
function maxSubArray(nums: number[]): number {
  let endHere = nums[0];                     // dp[i]: best sum of a subarray ending exactly at i
  let best = nums[0];                        // answer: max over all dp[i]
  for (let i = 1; i < nums.length; i++) {
    endHere = Math.max(nums[i], endHere + nums[i]);   // start fresh at i, or extend the run ending at i-1
    best = Math.max(best, endHere);
  }
  return best;
}
// #endregion

// #region sai
// A classic wrong start: best = 0. It returns 0 for an all-negative array (the empty subarray is not allowed).
function maxSubArrayWrong(nums: number[]): number {
  let endHere = 0, best = 0;
  for (const x of nums) { endHere = Math.max(0, endHere + x); best = Math.max(best, endHere); }
  return best;
}
// #endregion

for (const a of [[-2, 1, -3, 4, -1, 2, 1, -5, 4], [1], [5, 4, -1, 7, 8], [-3, -1, -2], [-5]]) {
  console.log(`maxSubArray(${JSON.stringify(a)}) = ${maxSubArray(a)}   (wrong version: ${maxSubArrayWrong(a)})`);
}
