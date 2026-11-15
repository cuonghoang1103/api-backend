// @java: InsertInterval.java
// LC 57 · Insert Interval — the list is already sorted and disjoint: three phases, one pass, O(n).

// #region giai
function insert(intervals: number[][], newInterval: number[]): number[][] {
  const out: number[][] = [];
  let [s, e] = newInterval;
  let i = 0;
  while (i < intervals.length && intervals[i][1] < s) out.push(intervals[i++]);   // 1. entirely before
  while (i < intervals.length && intervals[i][0] <= e) {                          // 2. overlaps (touching merges)
    s = Math.min(s, intervals[i][0]);
    e = Math.max(e, intervals[i][1]);
    i++;
  }
  out.push([s, e]);
  while (i < intervals.length) out.push(intervals[i++]);                           // 3. entirely after
  return out;
}
// #endregion

const cases: [number[][], number[]][] = [
  [[[1, 2], [4, 5], [7, 9], [12, 14]], [3, 8]],
  [[[1, 2], [4, 5]], [6, 7]],
  [[[3, 5], [8, 9]], [1, 2]],
  [[[1, 3], [6, 9]], [3, 6]],
  [[], [4, 8]],
];
for (const [iv, n] of cases) console.log(`insert ${JSON.stringify(n)} into ${JSON.stringify(iv)} = ${JSON.stringify(insert(iv, n))}`);
