// @java: Luyen1413.java
// LC 1413 · Minimum Value to Get Positive Step by Step Sum — the lowest prefix sum decides everything.

// #region giai
function minStartValue(nums: number[]): number {
  let sum = 0;
  let minSum = 0;                  // 0 = the empty prefix (before the first step)
  for (const x of nums) {
    sum += x;                      // running prefix sum
    minSum = Math.min(minSum, sum);
  }
  return 1 - minSum;               // start + minSum >= 1  <=>  start >= 1 - minSum (and minSum <= 0)
}
// #endregion

// Brute force for comparison: try start = 1, 2, 3, ... and simulate.
// #region vet-can
function minStartValueBrute(nums: number[]): number {
  for (let start = 1; ; start++) {
    let cur = start, ok = true;
    for (const x of nums) {
      cur += x;
      if (cur < 1) { ok = false; break; }
    }
    if (ok) return start;
  }
}
// #endregion

for (const nums of [[-3, 2, -3, 4, 2], [2, 3], [1, -2, -3], [-5], [0, 0, 0]]) {
  console.log(`minStartValue(${JSON.stringify(nums)}) = ${minStartValue(nums)}   brute = ${minStartValueBrute(nums)}`);
}
