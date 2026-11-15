// @java: L4Spells.java
// LC 2300 · Successful Pairs of Spells and Potions: sort once, then one lowerBound per spell.
function firstTrue(lo: number, hi: number, ok: (i: number) => boolean): number {
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (ok(mid)) hi = mid; else lo = mid + 1;
  }
  return lo;
}
// #region giai
function successfulPairs(spells: number[], potions: number[], success: number): number[] {
  const p = [...potions].sort((a, b) => a - b);                 // O(m log m), once
  return spells.map((s) => p.length - firstTrue(0, p.length, (j) => s * p[j] >= success));   // O(log m) each
}
// #endregion
const spells = [4, 1, 7], potions = [2, 9, 5, 1, 6], success = 20;
console.log(`spells=${JSON.stringify(spells)} potions=${JSON.stringify(potions)} success=${success} -> ${JSON.stringify(successfulPairs(spells, potions, success))}`);
console.log(`brute force                                  -> ${JSON.stringify(spells.map((s) => potions.filter((q) => s * q >= success).length))}`);
console.log(`big values: spell 100000, potion 100000, success 10000000000 -> ${JSON.stringify(successfulPairs([100000], [100000, 99999], 10000000000))}`);
