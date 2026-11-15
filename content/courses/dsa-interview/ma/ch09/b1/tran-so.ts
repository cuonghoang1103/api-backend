// Pitfall: numbers that grow like 1.6^n leave your number type fast.
// JavaScript has no int overflow, but a Number is exact only up to 2^53 − 1. BigInt is exact forever.
// #region bay
let a = 0, b = 1;                      // Number
let A = 0n, B = 1n;                    // BigInt
let firstWrong = -1;
for (let n = 0; n <= 100; n++) {
  if (firstWrong < 0 && BigInt(a) !== A) firstWrong = n;
  if (n === 78 || n === 79 || n === 100) console.log(`fib(${n}): Number ${a}  BigInt ${A}`);
  [a, b] = [b, a + b];
  [A, B] = [B, A + B];
}
console.log(`Number.MAX_SAFE_INTEGER = ${Number.MAX_SAFE_INTEGER}`);
console.log(`first n where the Number answer is wrong: ${firstWrong}`);
// #endregion
// LeetCode-style "return the answer modulo 1e9+7" keeps every intermediate value small — and exact.
const MOD = 1_000_000_007;
let x = 0, y = 1;
for (let n = 0; n < 1000; n++) [x, y] = [y, (x + y) % MOD];
console.log(`fib(1000) mod 1e9+7 = ${x}`);
