// @java: L1XorSubsets.java
// LC 1863 · Sum of All Subset XOR Totals — take / skip, carrying the running XOR down the tree.

// #region giai
function subsetXORSum(nums: number[]): number {
  function go(i: number, x: number): number {
    if (i === nums.length) return x;                      // a leaf = one subset, its XOR total is x
    return go(i + 1, x ^ nums[i]) + go(i + 1, x);         // take nums[i]  +  skip nums[i]
  }
  return go(0, 0);
}
// #endregion

// #region meo-bit
function subsetXORSumBits(nums: number[]): number {
  let or = 0;
  for (const v of nums) or |= v;
  return or * 2 ** (nums.length - 1);                    // every set bit is "on" in exactly half the subsets
}
// #endregion

for (const a of [[1, 3], [5, 1, 6], [3, 4, 5, 6, 7, 8], [7]]) {
  console.log(JSON.stringify(a) + ' -> ' + subsetXORSum(a) + '   (bit trick: ' + subsetXORSumBits(a) + ')');
}
