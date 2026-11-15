// @java: BitSingle.java
// LC 136 · Single Number — three solutions: count map, sort, XOR.

// #region map
function singleNumberMap(nums: number[]): number {     // O(n) time, O(n) extra memory
  const count = new Map<number, number>();
  for (const x of nums) count.set(x, (count.get(x) ?? 0) + 1);
  for (const [x, c] of count) if (c === 1) return x;
  return -1;
}
// #endregion

// #region sort
function singleNumberSort(nums: number[]): number {    // O(n log n) time
  const a = [...nums].sort((p, q) => p - q);
  for (let i = 0; i < a.length; i += 2) {
    if (i + 1 === a.length || a[i] !== a[i + 1]) return a[i]; // pairs sit side by side
  }
  return -1;
}
// #endregion

// #region xor
function singleNumber(nums: number[]): number {        // O(n) time, O(1) extra memory
  let acc = 0;
  for (const x of nums) acc ^= x;   // x ^ x = 0 and 0 ^ y = y: every pair cancels out
  return acc;
}
// #endregion

const cases = [[2, 2, 1], [4, 1, 2, 1, 2], [1], [-3, 7, -3], [5, 9, 3, 9, 5]];
for (const c of cases) {
  console.log(`${JSON.stringify(c)} -> map ${singleNumberMap(c)}, sort ${singleNumberSort(c)}, xor ${singleNumber(c)}`);
}
