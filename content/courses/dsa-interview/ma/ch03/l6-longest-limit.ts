// @java: L6LongestLimit.java
// LC 1438 · Longest Continuous Subarray With Absolute Diff <= Limit — sliding window + TWO monotonic deques (max and min).

// #region giai
function longestSubarray(nums: number[], limit: number): number {
  const mx: number[] = [], mn: number[] = [];   // values; mx decreasing, mn increasing
  let hx = 0, hn = 0;                           // head indices (no shift)
  let left = 0, best = 0;
  for (let r = 0; r < nums.length; r++) {
    const x = nums[r];
    while (mx.length > hx && mx[mx.length - 1] < x) mx.pop();
    mx.push(x);
    while (mn.length > hn && mn[mn.length - 1] > x) mn.pop();
    mn.push(x);
    while (mx[hx] - mn[hn] > limit) {           // window too wide: shrink from the left
      if (mx[hx] === nums[left]) hx++;          // the leaving value was the current max
      if (mn[hn] === nums[left]) hn++;          // ... or the current min
      left++;
    }
    best = Math.max(best, r - left + 1);
  }
  return best;
}
// #endregion

console.log(longestSubarray([8, 2, 4, 7], 4));
console.log(longestSubarray([10, 1, 2, 4, 7, 2], 5));
console.log(longestSubarray([4, 2, 2, 2, 4, 4, 2, 2], 0));
console.log(longestSubarray([1, 5, 6, 7, 8, 10, 6, 5, 6], 4));
