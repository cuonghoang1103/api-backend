// @java: BitCoBan.java
// The bitwise operators on small numbers, printed in binary.
const b8 = (x: number) => (x & 0xff).toString(2).padStart(8, '0');   // the low 8 bits
const b32 = (x: number) => (x >>> 0).toString(2).padStart(32, '0'); // all 32 bits, as the CPU stores them

// #region toan-tu
const a = 12, b = 10;                          // 00001100 and 00001010
console.log('a      =', b8(a), a);
console.log('b      =', b8(b), b);
console.log('a & b  =', b8(a & b), a & b);     // AND: 1 only where BOTH bits are 1
console.log('a | b  =', b8(a | b), a | b);     // OR:  1 where AT LEAST ONE bit is 1
console.log('a ^ b  =', b8(a ^ b), a ^ b);     // XOR: 1 where the bits DIFFER
console.log('~a     =', b8(~a), ~a);           // NOT: flip every bit; ~a === -a - 1
console.log('a << 2 =', b8(a << 2), a << 2);   // shift left by k  = multiply by 2^k
console.log('a >> 2 =', b8(a >> 2), a >> 2);   // shift right by k = floor(divide by 2^k)
// #endregion

// #region am
console.log('12 (32 bits) =', b32(12));
console.log('-12 (32 bits) =', b32(-12));      // two's complement: flip 12, then add 1
console.log('-7 >> 1 =', -7 >> 1);             // floor(-3.5) = -4: the sign bit is copied in
console.log('-7 / 2 (truncated) =', Math.trunc(-7 / 2)); // Java's -7 / 2 is -3
console.log('-1 >>> 28 =', -1 >>> 28);         // unsigned shift: zeros come in from the left
console.log('1 << 10 =', 1 << 10);             // 2^10
console.log('7 & 1 =', 7 & 1, ' 8 & 1 =', 8 & 1); // the last bit: odd or even
// #endregion

// #region meo
const x = 52;                                  // 00110100
console.log('x            =', b8(x), x);
console.log('x & 1        =', x & 1);                        // last bit: 0 = even
console.log('(x >> 2) & 1 =', (x >> 2) & 1);                 // read bit 2
console.log('x | (1 << 0) =', b8(x | (1 << 0)), x | (1 << 0)); // set bit 0
console.log('x & ~(1 << 2)=', b8(x & ~(1 << 2)), x & ~(1 << 2)); // clear bit 2
console.log('x ^ (1 << 5) =', b8(x ^ (1 << 5)), x ^ (1 << 5)); // toggle bit 5
console.log('x & (x - 1)  =', b8(x & (x - 1)), x & (x - 1));   // drop the lowest 1-bit
console.log('x & -x       =', b8(x & -x), x & -x);             // keep ONLY the lowest 1-bit
// #endregion
