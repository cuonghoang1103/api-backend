// @java: TwoSumII.java
// LC 167 · Two Sum II - Input Array Is Sorted — brute O(n^2), binary search O(n log n), two pointers O(n).
// The problem uses 1-based indices: answer [i+1, j+1].

// #region brute
function twoSumBrute(nums: number[], target: number): number[] {
  for (let i = 0; i < nums.length; i++)
    for (let j = i + 1; j < nums.length; j++)
      if (nums[i] + nums[j] === target) return [i + 1, j + 1];
  return [];
}
// #endregion

// #region binary
function twoSumBinary(nums: number[], target: number): number[] {
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    let lo = i + 1, hi = nums.length - 1;     // search only to the RIGHT of i
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (nums[mid] === need) return [i + 1, mid + 1];
      if (nums[mid] < need) lo = mid + 1; else hi = mid - 1;
    }
  }
  return [];
}
// #endregion

// #region two
function twoSum(nums: number[], target: number): number[] {
  let l = 0, r = nums.length - 1;
  while (l < r) {                         // two DIFFERENT elements => strict <
    const sum = nums[l] + nums[r];
    if (sum === target) return [l + 1, r + 1];
    if (sum < target) l++;                // too small: nums[l] is too small for EVERY partner left
    else r--;                             // too big: nums[r] is too big for EVERY partner left
  }
  return [];
}
// #endregion

const cases: [number[], number][] = [
  [[2, 7, 11, 15], 9],
  [[2, 3, 4], 6],
  [[-1, 0], -1],
  [[1, 3, 4, 6, 8, 11], 10],
  [[1, 2, 3], 100],
];
for (const [nums, t] of cases) {
  console.log(`twoSum(${JSON.stringify(nums)}, ${t}) = ${JSON.stringify(twoSum(nums, t))}` +
    `   binary = ${JSON.stringify(twoSumBinary(nums, t))}   brute = ${JSON.stringify(twoSumBrute(nums, t))}`);
}
