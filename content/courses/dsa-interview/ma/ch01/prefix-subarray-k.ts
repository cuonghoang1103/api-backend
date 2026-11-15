// @java: PrefixSubarrayK.java
// LC 560 · Subarray Sum Equals K — brute force O(n^2) vs prefix sum + hash map O(n).

// #region brute
function subarraySumBrute(nums: number[], k: number): number {
  let count = 0;
  for (let i = 0; i < nums.length; i++) {
    let sum = 0;                         // running sum of nums[i..j]
    for (let j = i; j < nums.length; j++) {
      sum += nums[j];
      if (sum === k) count++;
    }
  }
  return count;
}
// #endregion

// #region map
function subarraySum(nums: number[], k: number): number {
  const seen = new Map<number, number>([[0, 1]]); // prefix sum -> how many times; the EMPTY prefix counts once
  let sum = 0, count = 0;
  for (const x of nums) {
    sum += x;                                   // sum = prefix ending here
    count += seen.get(sum - k) ?? 0;            // every earlier prefix equal to sum - k closes a subarray
    seen.set(sum, (seen.get(sum) ?? 0) + 1);    // record AFTER counting (same reason as Two Sum)
  }
  return count;
}
// #endregion

const cases: [number[], number][] = [
  [[1, 2, -1, 3, -2, 2], 3],
  [[1, 1, 1], 2],
  [[1, 2, 3], 3],
  [[0, 0, 0], 0],
  [[5], 7],
];
for (const [nums, k] of cases) {
  console.log(`subarraySum(${JSON.stringify(nums)}, ${k}) = ${subarraySum(nums, k)}   brute = ${subarraySumBrute(nums, k)}`);
}
