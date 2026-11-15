// @java: SortMergeIntervals.java
// LC 56 · Merge Intervals — sort by start, then one scan.

// #region merge
function merge(intervals: number[][]): number[][] {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);   // copy: do not reorder the caller's array
  const out: number[][] = [];
  for (const [start, end] of sorted) {
    const last = out[out.length - 1];
    if (last && start <= last[1]) {
      last[1] = Math.max(last[1], end);                         // overlaps (or touches): extend
    } else {
      out.push([start, end]);                                   // gap: a new merged interval
    }
  }
  return out;
}
// #endregion

const cases = [
  [[1, 3], [8, 10], [2, 6], [15, 18], [9, 12], [10, 11]],
  [[1, 4], [4, 5]],
  [[1, 10], [2, 3], [4, 5]],
  [[5, 7]],
];
for (const c of cases) console.log(`merge(${JSON.stringify(c)}) = ${JSON.stringify(merge(c))}`);
