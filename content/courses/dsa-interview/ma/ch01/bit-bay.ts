// Traps: JavaScript bitwise operators work on 32-bit SIGNED integers, not on Numbers.

// #region bay
console.log('2 ** 31 | 0       =', 2 ** 31 | 0);            // 2147483648 does not fit in int32
console.log('(2 ** 32 + 5) | 0 =', (2 ** 32 + 5) | 0);      // the high bits are simply thrown away
console.log('1 << 31           =', 1 << 31);                // the 1 lands on the sign bit
console.log('1 << 32           =', 1 << 32);                // shift count is taken mod 32: 1 << 0
console.log('-1 >>> 0          =', -1 >>> 0);               // same 32 bits, read as unsigned
console.log('(2 ** 32 + 4) >> 1 =', (2 ** 32 + 4) >> 1, ' vs Math.floor((2 ** 32 + 4) / 2) =', Math.floor((2 ** 32 + 4) / 2));
// #endregion

// #region vo-han
function popcountSigned(n: number, cap = 100): string {
  let c = 0, loops = 0;
  while (n !== 0 && loops < cap) { c += n & 1; n >>= 1; loops++; } // >> copies the sign bit
  return loops === cap ? 'still running after ' + cap + ' loops, n = ' + n : c + ' (' + loops + ' loops)';
}
function popcountUnsigned(n: number): string {
  let c = 0, loops = 0;
  while (n !== 0) { c += n & 1; n >>>= 1; loops++; }               // >>> brings in zeros
  return c + ' (' + loops + ' loops)';
}
// #endregion
console.log('popcount with >>  on 11 :', popcountSigned(11));
console.log('popcount with >>  on -1 :', popcountSigned(-1));
console.log('popcount with >>> on -1 :', popcountUnsigned(-1));

// #region swap
function swapXor(a: number[], i: number, j: number): void {
  a[i] ^= a[j];
  a[j] ^= a[i];
  a[i] ^= a[j];
}
// #endregion
const p = [5, 9];
swapXor(p, 0, 1);
console.log('swapXor([5, 9], 0, 1) ->', JSON.stringify(p));
const q = [5, 9];
swapXor(q, 0, 0);
console.log('swapXor([5, 9], 0, 0) ->', JSON.stringify(q), ' (i === j: the value XORs itself to 0)');
