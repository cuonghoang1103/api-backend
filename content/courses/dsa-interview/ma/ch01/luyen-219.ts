// @java: Luyen219.java
// LC 219 · Contains Duplicate II — map value -> most recent index.

// #region giai
function containsNearbyDuplicate(nums: number[], k: number): boolean {
  const last = new Map<number, number>(); // value -> most recent index where we saw it
  for (let i = 0; i < nums.length; i++) {
    const j = last.get(nums[i]);
    if (j !== undefined && i - j <= k) return true; // same value, close enough
    last.set(nums[i], i);                           // overwrite: the newest index is the best partner for later
  }
  return false;
}
// #endregion

const cases: [number[], number][] = [
  [[4, 9, 2, 4], 3],
  [[4, 9, 2, 4], 2],
  [[7, 1, 7, 7], 1],
  [[1, 2, 1, 3, 1], 1],
  [[5], 0],
  [[6, 6], 0],
];
for (const [nums, k] of cases) {
  console.log(`containsNearbyDuplicate(${JSON.stringify(nums)}, ${k}) = ${containsNearbyDuplicate(nums, k)}`);
}
