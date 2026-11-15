// @java: BitMissing.java
// LC 268 · Missing Number — the numbers 0..n with one missing, in any order.

// #region xor
function missingNumber(nums: number[]): number {
  let acc = nums.length;                 // the index n has no slot in the loop, add it here
  for (let i = 0; i < nums.length; i++) {
    acc ^= i ^ nums[i];                  // every value that is present meets its own index and cancels
  }
  return acc;
}
// #endregion

// #region sum
function missingNumberSum(nums: number[]): number {
  const n = nums.length;
  let s = (n * (n + 1)) / 2;             // 0 + 1 + ... + n
  for (const x of nums) s -= x;
  return s;
}
// #endregion

for (const c of [[3, 0, 1], [0, 1], [9, 6, 4, 2, 3, 5, 7, 0, 1], [0]]) {
  console.log(`${JSON.stringify(c)} -> xor ${missingNumber(c)}, sum ${missingNumberSum(c)}`);
}
