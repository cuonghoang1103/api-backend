// @java: McHouseRobber.java
// LC 198 House Robber + LC 213 House Robber II (houses in a circle).

// #region rob
// dp[i] = the most money you can take from houses 0..i (state).
// At house i you either skip it (keep dp[i-1]) or rob it (nums[i] + dp[i-2]) (transition).
function rob(nums: number[]): number {
  const n = nums.length;
  if (n === 1) return nums[0];
  const dp = new Array<number>(n).fill(0);
  dp[0] = nums[0];                                   // base: one house
  dp[1] = Math.max(nums[0], nums[1]);                // base: two houses, take the richer one
  for (let i = 2; i < n; i++) {                      // order: left to right, dp[i] needs i-1 and i-2
    dp[i] = Math.max(dp[i - 1], nums[i] + dp[i - 2]);
  }
  return dp[n - 1];
}
// #endregion

// #region rob2bien
// Same recurrence, but only the last two values are ever read: keep two variables.
function robLine(nums: number[], from: number, to: number): number {   // houses from..to inclusive
  let prev2 = 0, prev1 = 0;                          // best up to i-2, best up to i-1
  for (let i = from; i <= to; i++) {
    const cur = Math.max(prev1, nums[i] + prev2);
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}
// #endregion

// #region rob2
// LC 213: first and last house are neighbours. They can never BOTH be robbed,
// so solve two straight streets: without the last house, and without the first house.
function robCircle(nums: number[]): number {
  const n = nums.length;
  if (n === 1) return nums[0];                       // one house: no neighbour at all
  return Math.max(robLine(nums, 0, n - 2), robLine(nums, 1, n - 1));
}
// #endregion

for (const a of [[2, 7, 9, 3, 1], [1, 2, 3, 1], [5, 1, 1, 5], [2, 1, 1, 2], [4], [3, 10]]) {
  console.log(`rob(${JSON.stringify(a)}) = ${rob(a)}   robLine = ${robLine(a, 0, a.length - 1)}`);
}
for (const a of [[2, 3, 2], [1, 2, 3, 1], [1, 2, 3], [5, 1, 1, 5], [4], [200, 3, 140, 20, 10]]) {
  console.log(`robCircle(${JSON.stringify(a)}) = ${robCircle(a)}`);
}
