// @java: Luyen1029.java
// LC 1029 · Two City Scheduling — sort by (costA - costB), first half goes to A.

// #region giai
function twoCitySchedCost(costs: number[][]): number {
  // Most "A-friendly" first: the more negative a - b, the more we save by sending that person to A.
  const s = [...costs].sort((x, y) => (x[0] - x[1]) - (y[0] - y[1]));
  const n = s.length / 2;
  let total = 0;
  for (let i = 0; i < n; i++) total += s[i][0] + s[i + n][1]; // first half -> A, second half -> B
  return total;
}
// #endregion

// Brute force for checking: every subset of exactly n people sent to A (bitmask, lesson 1.4).
// #region vet-can
function twoCityBrute(costs: number[][]): number {
  const m = costs.length, n = m / 2;
  let best = Infinity;
  for (let mask = 0; mask < (1 << m); mask++) {
    let bits = 0;
    for (let v = mask; v; v &= v - 1) bits++;          // popcount: n & (n - 1) drops one set bit
    if (bits !== n) continue;
    let t = 0;
    for (let i = 0; i < m; i++) t += (mask >> i) & 1 ? costs[i][0] : costs[i][1];
    best = Math.min(best, t);
  }
  return best;
}
// #endregion

const cases: number[][][] = [
  [[50, 30], [20, 80], [60, 70], [40, 10]],
  [[5, 9], [8, 2], [7, 7], [1, 6], [4, 4], [9, 3]],
  [[100, 1], [100, 2], [3, 100], [4, 100]],
  [[10, 10], [10, 10]],
];
for (const c of cases) {
  console.log(`twoCitySchedCost(${JSON.stringify(c)}) = ${twoCitySchedCost(c)}   brute = ${twoCityBrute(c)}`);
}
const order = [...cases[0]].sort((x, y) => (x[0] - x[1]) - (y[0] - y[1]));
console.log(`sorted by a-b: ${JSON.stringify(order)}  diffs = ${JSON.stringify(order.map((p) => p[0] - p[1]))}`);
