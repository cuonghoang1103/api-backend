// @java: MaxAverage.java
// LC 643 · Maximum Average Subarray I — FIXED window of size k: add the element that enters, subtract the one that leaves.

// #region brute
function findMaxAverageBrute(nums: number[], k: number): number {
  let best = -Infinity;
  for (let i = 0; i + k <= nums.length; i++) {
    let sum = 0;
    for (let j = i; j < i + k; j++) sum += nums[j];   // re-adds k - 1 numbers it already added last time
    best = Math.max(best, sum);
  }
  return best / k;
}
// #endregion

// #region window
function findMaxAverage(nums: number[], k: number): number {
  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];        // the first window
  let best = sum;
  for (let r = k; r < nums.length; r++) {
    sum += nums[r] - nums[r - k];                     // nums[r] enters, nums[r - k] leaves
    best = Math.max(best, sum);
  }
  return best / k;                                    // divide ONCE at the end
}
// #endregion

const cases: [number[], number][] = [[[1, 12, -5, -6, 50, 3], 4], [[5], 1], [[0, 4, 0, 3, 2], 1], [[-1, -2, -3], 2]];
for (const [nums, k] of cases) {
  console.log(`findMaxAverage(${JSON.stringify(nums)}, ${k}) = ${findMaxAverage(nums, k).toFixed(5)}   brute = ${findMaxAverageBrute(nums, k).toFixed(5)}`);
}
