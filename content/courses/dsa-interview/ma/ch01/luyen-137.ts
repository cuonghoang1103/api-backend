// @java: Luyen137.java
// LC 137 · Single Number II — count each bit position mod 3.

// #region giai
function singleNumber(nums: number[]): number {
  let ans = 0;
  for (let b = 0; b < 32; b++) {              // ALL 32 positions, including bit 31 (the sign bit)
    let cnt = 0;
    for (const x of nums) cnt += (x >> b) & 1; // bit b of x (works for negatives: two's complement)
    if (cnt % 3 !== 0) ans |= 1 << b;          // the single number owns this bit; | keeps a signed 32-bit int
  }
  return ans;
}
// #endregion

// #region fsm
// Bonus O(1)-per-element version: two bitmasks remember "seen once" and "seen twice" (mod 3) for every bit.
function singleNumberFsm(nums: number[]): number {
  let ones = 0, twos = 0;
  for (const x of nums) {
    ones = (ones ^ x) & ~twos;
    twos = (twos ^ x) & ~ones;
  }
  return ones;
}
// #endregion

const cases = [[6, 1, 6, 6], [4, -1, 4, 4], [-2, -2, 7, -2], [-2147483648, 3, 3, 3], [0, 5, 0, 0]];
for (const nums of cases) {
  console.log(`singleNumber(${JSON.stringify(nums)}) = ${singleNumber(nums)}   fsm = ${singleNumberFsm(nums)}`);
}
