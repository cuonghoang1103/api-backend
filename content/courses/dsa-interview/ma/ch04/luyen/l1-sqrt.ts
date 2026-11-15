// @java: L1Sqrt.java
// LC 69 · Sqrt(x): the largest r with r*r <= x  =  (first r with r*r > x) - 1.
function firstTrue(lo: number, hi: number, ok: (i: number) => boolean): number {
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (ok(mid)) hi = mid; else lo = mid + 1;
  }
  return lo;
}
// #region giai
function mySqrt(x: number): number {
  const hi = Math.min(x, 46340) + 1;                  // 46340^2 <= 2^31 - 1 < 46341^2: no answer is bigger
  return firstTrue(0, hi, (r) => r * r > x) - 1;      // last r with r*r <= x
}
// #endregion
const xs = [0, 1, 2, 3, 4, 8, 15, 16, 17, 99, 2147395599, 2147483647];
console.log(`x    = ${JSON.stringify(xs)}`);
console.log(`sqrt = ${JSON.stringify(xs.map(mySqrt))}`);
let bad = 0;
for (let x = 0; x <= 20000; x++) if (mySqrt(x) !== Math.floor(Math.sqrt(x))) bad++;
console.log(`x = 0..20000 vs Math.floor(Math.sqrt(x)): ${bad} mismatches`);
