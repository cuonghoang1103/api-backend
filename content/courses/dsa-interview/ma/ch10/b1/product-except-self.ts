// @java: ProductExceptSelf.java
// LC 238 — Product of Array Except Self, the problem of the "stuck, then a good hint" conversation in lesson 10.1.
// #region giai
function productExceptSelf(nums: number[]): number[] {
  const n = nums.length;
  const answer = new Array<number>(n).fill(1);
  let left = 1;                          // product of everything to the LEFT of i
  for (let i = 0; i < n; i++) {
    answer[i] = left;
    left *= nums[i];
  }
  let right = 1;                         // product of everything to the RIGHT of i
  for (let i = n - 1; i >= 0; i--) {
    answer[i] *= right;
    right *= nums[i];
  }
  return answer;
}
// #endregion

const CASES: number[][] = [[1, 2, 3, 4], [-1, 1, 0, -3, 3], [2, 3], [0, 0], [5, 0, 2]];
for (const c of CASES) {
  const r = productExceptSelf(c).map((x) => (x === 0 ? 0 : x));   // print -0 as 0, like Java ints
  console.log(`${JSON.stringify(c)} -> ${JSON.stringify(r)}`);
}
