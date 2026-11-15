// @java: MinSubarray.java
// LC 209 · Minimum Size Subarray Sum — SHORTEST window: grow right, and shrink left WHILE the window is still valid.

// #region window
function minSubArrayLen(target: number, nums: number[]): number {
  let l = 0, sum = 0, best = Infinity;
  for (let r = 0; r < nums.length; r++) {
    sum += nums[r];                       // grow: nums[r] enters
    while (sum >= target) {               // valid => try to make it shorter
      best = Math.min(best, r - l + 1);   // record BEFORE shrinking: this window is valid
      sum -= nums[l];
      l++;
    }
  }
  return best === Infinity ? 0 : best;
}
// #endregion

for (const [t, nums] of [[7, [2, 3, 1, 2, 4, 3]], [4, [1, 4, 4]], [11, [1, 1, 1, 1, 1, 1, 1, 1]], [15, [1, 2, 3, 4, 5]]] as [number, number[]][]) {
  console.log(`minSubArrayLen(${t}, ${JSON.stringify(nums)}) = ${minSubArrayLen(t, nums)}`);
}
