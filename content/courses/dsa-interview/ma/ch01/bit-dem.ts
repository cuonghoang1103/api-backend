// @java: BitDem.java
// LC 191 Number of 1 Bits · LC 231 Power of Two · LC 338 Counting Bits — all built on n & (n - 1).

// #region kernighan
function hammingWeight(n: number): number {     // LC 191 (Brian Kernighan's trick)
  let count = 0;
  while (n !== 0) {
    n &= n - 1;            // n - 1 turns the lowest 1 into 0 and the 0s below it into 1s; AND keeps neither
    count++;
  }
  return count;            // the loop runs once per 1-bit, not once per bit
}
// #endregion

// #region shift
function hammingWeightShift(n: number): number { // the obvious version: look at every bit
  let count = 0;
  while (n !== 0) {
    count += n & 1;
    n >>>= 1;              // >>> (unsigned), see the trap section
  }
  return count;
}
// #endregion

// #region pow2
function isPowerOfTwo(n: number): boolean {     // LC 231
  return n > 0 && (n & (n - 1)) === 0;          // a power of two has exactly one 1-bit
}
// #endregion

// #region count-bits
function countBits(n: number): number[] {       // LC 338: answers for 0..n in O(n)
  const ans = new Array<number>(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    ans[i] = ans[i >> 1] + (i & 1);             // i = (i >> 1) followed by one more bit
  }
  return ans;
}
// #endregion

function loops(n: number, kernighan: boolean): number {
  let c = 0;
  while (n !== 0) { n = kernighan ? n & (n - 1) : n >>> 1; c++; }
  return c;
}

for (const n of [11, 128, 2147483645]) console.log(`hammingWeight(${n}) = ${hammingWeight(n)} = ${hammingWeightShift(n)}`);
console.log(`isPowerOfTwo [1, 16, 6, 0, -8] = ${JSON.stringify([1, 16, 6, 0, -8].map(isPowerOfTwo))}`);
console.log(`countBits(5) = ${JSON.stringify(countBits(5))}`);
console.log(`countBits(16) = ${JSON.stringify(countBits(16))}`);
for (const n of [52, 1 << 30, 2147483647]) console.log(`loops for ${n}: kernighan ${loops(n, true)}, shift ${loops(n, false)}`);
