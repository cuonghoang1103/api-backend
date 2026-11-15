// @java: L5Covered.java
// LC 1288 · Remove Covered Intervals — sort by start ASC, and for equal starts by end DESC.

// #region giai
function removeCoveredIntervals(intervals: number[][]): number {
  const s = [...intervals].sort((a, b) => a[0] - b[0] || b[1] - a[1]);  // the longer one first on a tie
  let kept = 0, maxEnd = -Infinity;
  for (const [, end] of s) {
    if (end > maxEnd) { kept++; maxEnd = end; }   // not inside anything seen so far
  }                                               // else: start >= earlier start and end <= maxEnd ⇒ covered
  return kept;
}
// #endregion

for (const iv of [[[1, 4], [2, 3], [3, 6], [2, 8], [5, 7]], [[1, 2], [1, 5]], [[3, 9], [1, 4], [5, 7]], [[2, 2], [2, 2]]]) {
  console.log(`${JSON.stringify(iv)} -> ${removeCoveredIntervals(iv)}`);
}
