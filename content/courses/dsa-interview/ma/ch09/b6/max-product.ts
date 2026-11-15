// @java: LuMaxProduct.java
// LC 152 Maximum Product Subarray — Kadane with TWO states: the largest and the smallest product ending here.

// #region giai
function maxProduct(nums: number[]): number {
  let hi = nums[0], lo = nums[0], best = nums[0];   // products of the best/worst subarray ENDING at i
  for (let i = 1; i < nums.length; i++) {
    const x = nums[i];
    const a = hi * x, b = lo * x;                   // extend the best, or extend the worst
    hi = Math.max(x, a, b);                         // ...or start fresh at x
    lo = Math.min(x, a, b);                         // a negative x turns the worst into the best
    best = Math.max(best, hi);
  }
  return best;
}
// #endregion

// #region sai
// WRONG: plain Kadane that only remembers the maximum.
function maxProductOnlyMax(nums: number[]): number {
  let hi = nums[0], best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    hi = Math.max(nums[i], hi * nums[i]);
    best = Math.max(best, hi);
  }
  return best;
}
// #endregion

const clean = (v: number) => (v === 0 ? 0 : v);     // print -0 as 0 (JS quirk), same as Java
for (const a of [[2, 3, -2, 4], [-2, 3, -4], [-2, 0, -1], [-3], [-1, -2, -3, 0, 2], [0, 2]]) {
  console.log(`${JSON.stringify(a).padEnd(20)} maxProduct = ${clean(maxProduct(a))}   only-max version = ${clean(maxProductOnlyMax(a))}`);
}

// Self-test vs brute force O(n^2) on random small arrays (fixed seed, same as the Java file).
let seed = 20261115;
const rnd = (m: number) => { seed = (seed * 48271) % 2147483647; return seed % m; };
let bad = 0, wrongOnlyMax = 0;
for (let t = 0; t < 3000; t++) {
  const n = 1 + rnd(8);
  const a = Array.from({ length: n }, () => rnd(7) - 3);
  let slow = -Infinity;
  for (let i = 0; i < n; i++) { let p = 1; for (let j = i; j < n; j++) { p *= a[j]; slow = Math.max(slow, p); } }
  if (clean(maxProduct(a)) !== clean(slow)) bad++;
  if (clean(maxProductOnlyMax(a)) !== clean(slow)) wrongOnlyMax++;
}
console.log(`random self-test: 3000 arrays, two-state ${bad} mismatches, only-max ${wrongOnlyMax} mismatches`);
