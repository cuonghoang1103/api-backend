// The first idea people say out loud for LC 238: "total product, then divide by nums[i]".
// The problem forbids division — and even if it did not, a zero breaks it. Watch what JavaScript does.
// #region chia
function byDivision(nums: number[]): number[] {
  const total = nums.reduce((a, b) => a * b, 1);
  return nums.map((x) => total / x);
}
// #endregion
for (const c of [[1, 2, 3, 4], [1, 2, 0, 4], [0, 2, 0]]) {
  console.log(`${JSON.stringify(c)} -> [${byDivision(c).join(', ')}]`);
}
console.log('expected for [1,2,0,4]: [0, 0, 8, 0]');
