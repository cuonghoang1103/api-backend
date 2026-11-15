// @java: SortedSquares.java
// LC 977 · Squares of a Sorted Array — the biggest square is at one of the two ENDS; fill the answer from the back.

// #region giai
function sortedSquares(nums: number[]): number[] {
  const n = nums.length, res = new Array<number>(n);
  let l = 0, r = n - 1;
  for (let w = n - 1; w >= 0; w--) {             // w = where the next LARGEST square goes
    if (Math.abs(nums[l]) > Math.abs(nums[r])) { res[w] = nums[l] * nums[l]; l++; }
    else { res[w] = nums[r] * nums[r]; r--; }
  }
  return res;
}
// #endregion

for (const a of [[-4, -1, 0, 3, 10], [-7, -3, 2, 3, 11], [-5, -3, -2], [1, 2, 3], [0]]) {
  console.log(`sortedSquares(${JSON.stringify(a)}) = ${JSON.stringify(sortedSquares(a))}`);
}
