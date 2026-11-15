// @java: TwoSum.java
// LC 1 · Two Sum — brute force O(n^2) vs one-pass hash map O(n).

// #region brute
function twoSumBrute(nums: number[], target: number): number[] {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
  return [];
}
// #endregion

// #region hash
function twoSum(nums: number[], target: number): number[] {
  const seen = new Map<number, number>(); // value -> index where we saw it
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];        // the partner we are looking for
    const j = seen.get(need);
    if (j !== undefined) return [j, i];   // partner was seen earlier
    seen.set(nums[i], i);                 // remember AFTER checking (no self-pair)
  }
  return [];
}
// #endregion

const cases: [number[], number][] = [
  [[2, 7, 11, 15], 9],
  [[3, 2, 4], 6],
  [[3, 3], 6],
  [[1, 2, 3], 100],
];
for (const [nums, t] of cases) {
  console.log(`twoSum(${JSON.stringify(nums)}, ${t}) = ${JSON.stringify(twoSum(nums, t))}   brute = ${JSON.stringify(twoSumBrute(nums, t))}`);
}
