// The JavaScript version of the overflow trap: numbers are doubles, so (lo + hi) / 2 is fine...
// but the bit operators (>>, |, &) first squeeze the number into a 32-bit signed int.
const lo = 1_500_000_000, hi = 2_000_000_000;
console.log(`lo = ${lo}, hi = ${hi}, 2^31 - 1 = ${2 ** 31 - 1}`);
console.log(`(lo + hi) >> 1             = ${(lo + hi) >> 1}`);
console.log(`(lo + hi) >>> 1            = ${(lo + hi) >>> 1}`);
console.log(`Math.floor((lo + hi) / 2)  = ${Math.floor((lo + hi) / 2)}`);
console.log(`lo + Math.floor((hi-lo)/2) = ${lo + Math.floor((hi - lo) / 2)}`);

const BAD = 2_000_000_000;
let calls = 0;
const isBadVersion = (v: number) => { calls++; return v >= BAD; };

// #region tran
function firstBad(n: number, half: (lo: number, hi: number) => number): string {
  let lo = 1, hi = n, loops = 0;
  while (lo < hi) {
    if (++loops > 100) return `STUCK after 100 loops, lo=${lo} hi=${hi}`;
    const mid = half(lo, hi);
    if (isBadVersion(mid)) hi = mid; else lo = mid + 1;
  }
  return String(lo);
}
// #endregion
const n = 2 ** 31 - 1;
console.log(`LC 278, n = 2^31 - 1, first bad = ${BAD}`);
const ways: [string, (lo: number, hi: number) => number][] = [
  ['lo + Math.floor((hi - lo) / 2)', (l, h) => l + Math.floor((h - l) / 2)],
  ['(lo + hi) >> 1', (l, h) => (l + h) >> 1],
  ['(lo + hi) >>> 1', (l, h) => (l + h) >>> 1],
];
for (const [name, f] of ways) {
  calls = 0;
  const r = firstBad(n, f);
  console.log(`  ${name.padEnd(31)}: ${r} (${calls} calls)`);
}
