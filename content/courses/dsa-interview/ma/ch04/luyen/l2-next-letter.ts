// @java: L2NextLetter.java
// LC 744 · Find Smallest Letter Greater Than Target: upperBound, and wrap around to index 0.
function firstTrue(lo: number, hi: number, ok: (i: number) => boolean): number {
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (ok(mid)) hi = mid; else lo = mid + 1;
  }
  return lo;
}
// #region giai
function nextGreatestLetter(letters: string[], target: string): string {
  const i = firstTrue(0, letters.length, (k) => letters[k] > target);   // first letter strictly greater
  return letters[i % letters.length];                                   // none greater -> wrap to the first
}
// #endregion
const L = ['b', 'e', 'e', 'h', 'q'];
console.log(`letters = ${JSON.stringify(L)}`);
for (const t of ['a', 'b', 'd', 'e', 'p', 'q', 'z']) console.log(`target '${t}' -> '${nextGreatestLetter(L, t)}'`);
