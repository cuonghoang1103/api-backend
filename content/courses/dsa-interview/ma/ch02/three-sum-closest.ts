// @java: ThreeSumClosest.java
// LC 16 · 3Sum Closest — sort, fix one, two pointers; keep the sum with the smallest |sum - target|.

// #region giai
function threeSumClosest(nums: number[], target: number): number {
  const a = [...nums].sort((x, y) => x - y);
  let best = a[0] + a[1] + a[2];
  for (let i = 0; i < a.length - 2; i++) {
    let l = i + 1, r = a.length - 1;
    while (l < r) {
      const s = a[i] + a[l] + a[r];
      if (Math.abs(s - target) < Math.abs(best - target)) best = s;
      if (s === target) return s;          // cannot get closer than 0
      if (s < target) l++; else r--;       // same elimination argument as Two Sum II
    }
  }
  return best;
}
// #endregion

for (const [a, t] of [[[-1, 2, 1, -4], 1], [[0, 0, 0], 1], [[1, 1, 1, 0], -100], [[4, 0, 5, -5, 3, 3, 0, -4, -5], -2]] as [number[], number][]) {
  console.log(`threeSumClosest(${JSON.stringify(a)}, ${t}) = ${threeSumClosest(a, t)}`);
}
