// @java: L7Magnetic.java
// LC 1552 · Magnetic Force Between Two Balls — "maximise the minimum gap".
// canPlace(g) is T...T F...F, so the answer is (first g that is IMPOSSIBLE) - 1. Same template, no second one.
let checks = 0;
function firstTrue(lo: number, hi: number, ok: (i: number) => boolean): number {
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (ok(mid)) hi = mid; else lo = mid + 1;
  }
  return lo;
}
// #region giai
function maxDistance(position: number[], m: number): number {
  const p = [...position].sort((a, b) => a - b);
  const canPlace = (g: number) => {          // greedy: put a ball in the first basket, then the next one >= g away
    checks++;
    let count = 1, last = p[0];
    for (let i = 1; i < p.length && count < m; i++) if (p[i] - last >= g) { count++; last = p[i]; }
    return count >= m;
  };
  const span = p[p.length - 1] - p[0];
  return firstTrue(1, span + 1, (g) => !canPlace(g)) - 1;   // span + 1 is surely impossible for m >= 2
}
// #endregion
for (const [pos, m] of [[[2, 3, 5, 9, 10], 3], [[10, 1, 6, 15, 3], 2], [[10, 1, 6, 15, 3], 3], [[10, 1, 6, 15, 3], 5], [[1, 1000000000], 2]] as [number[], number][]) {
  checks = 0;
  const r = maxDistance(pos, m);
  console.log(`positions=${JSON.stringify(pos)} m=${m} -> ${r} (${checks} checks)`);
}
