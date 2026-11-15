// @java: Koko.java
// LC 875 · Koko Eating Bananas — binary search on the ANSWER (the speed), not on the array.
let checks = 0;
function firstTrue(lo: number, hi: number, ok: (i: number) => boolean): number {
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (ok(mid)) hi = mid; else lo = mid + 1;
  }
  return lo;
}

// #region lc875
function hoursAt(piles: number[], k: number): number {       // O(n): one pass over the piles
  let h = 0;
  for (const p of piles) h += Math.ceil(p / k);               // a pile of p at speed k takes ceil(p / k) hours
  return h;
}
function minEatingSpeed(piles: number[], h: number): number { // LC 875
  const canFinish = (k: number) => { checks++; return hoursAt(piles, k) <= h; };   // F...F T...T over k
  return firstTrue(1, Math.max(...piles), canFinish);         // speed = max pile always works (h >= n)
}
// #endregion

const piles = [4, 11, 20, 23, 30], H = 8;
const row = Array.from({ length: 30 }, (_, i) => (hoursAt(piles, i + 1) <= H ? 'T' : 'F')).join('');
console.log(`piles = ${JSON.stringify(piles)}, h = ${H}`);
console.log(`row canFinish(k), k = 1..30: ${row}`);
console.log(`hours at k = 14, 15, 16: ${hoursAt(piles, 14)}, ${hoursAt(piles, 15)}, ${hoursAt(piles, 16)}`);
checks = 0;
console.log(`minEatingSpeed = ${minEatingSpeed(piles, H)} after ${checks} checks (trying k = 1, 2, 3, ... would need 15)`);
for (const [p, h] of [[[5, 9, 13, 2], 7], [[25, 7, 18], 3], [[25, 7, 18], 4], [[1000000000], 2], [[312884470], 312884469]] as [number[], number][]) {
  checks = 0;
  const r = minEatingSpeed(p, h);
  console.log(`piles=${JSON.stringify(p)} h=${h} -> ${r} (${checks} checks)`);
}
