// Trap demo for LC 137 in JavaScript: the sign bit (bit 31).
const nums = [4, -1, 4, 4]; // the single number is -1 = all 32 bits set

// #region bay
function only31Bits(a: number[]): number {     // Bug A: loop stops at bit 30
  let ans = 0;
  for (let b = 0; b < 31; b++) {
    let cnt = 0;
    for (const x of a) cnt += (x >> b) & 1;
    if (cnt % 3 !== 0) ans |= 1 << b;
  }
  return ans;
}
function plusPowerOfTwo(a: number[]): number {  // Bug B: builds the answer with + 2 ** b (a 64-bit float, not int32)
  let ans = 0;
  for (let b = 0; b < 32; b++) {
    let cnt = 0;
    for (const x of a) cnt += (x >> b) & 1;
    if (cnt % 3 !== 0) ans += 2 ** b;
  }
  return ans;
}
// #endregion

console.log('31 bits only      :', only31Bits(nums));
console.log('ans += 2 ** b     :', plusPowerOfTwo(nums));
console.log('fix with | 0      :', plusPowerOfTwo(nums) | 0);
console.log('1 << 31           :', 1 << 31, '  2 ** 31 :', 2 ** 31);
