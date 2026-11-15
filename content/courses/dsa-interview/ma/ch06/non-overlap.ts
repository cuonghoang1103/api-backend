// @java: NonOverlap.java
// LC 435 · Non-overlapping Intervals and LC 452 · Minimum Number of Arrows — the same greedy: sort by END.

// #region erase
function eraseOverlapIntervals(intervals: number[][]): number {
  const s = [...intervals].sort((a, b) => a[1] - b[1]);   // earliest finish first
  let removed = 0, lastEnd = -Infinity;
  for (const [start, end] of s) {
    if (start >= lastEnd) lastEnd = end;                  // fits after the last kept one (touching is fine)
    else removed++;                                       // clashes: drop it (it ends later than the kept one)
  }
  return removed;
}
// #endregion

// #region arrows
function findMinArrowShots(points: number[][]): number {
  const s = [...points].sort((a, b) => a[1] - b[1]);
  let arrows = 0, shotAt = -Infinity;
  for (const [start, end] of s) {
    if (start > shotAt) { arrows++; shotAt = end; }       // not hit by the last arrow: shoot at its END
  }                                                       // (closed: start === shotAt is hit)
  return arrows;
}
// #endregion

const a: number[][][] = [[[1, 3], [2, 4], [3, 5], [1, 2]], [[1, 5], [1, 5], [1, 5]], [[2, 4], [4, 7]], [[1, 10], [2, 3], [4, 5], [6, 7]]];
for (const iv of a) console.log(`erase ${JSON.stringify(iv)} = ${eraseOverlapIntervals(iv)}   arrows = ${findMinArrowShots(iv)}`);
