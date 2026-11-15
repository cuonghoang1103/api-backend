// @java: LongestConsecutive.java
// LC 128 · Longest Consecutive Sequence — O(n) with a Set: only START counting at the beginning of a run.

// #region giai
function longestConsecutive(nums: number[]): number {
  const s = new Set(nums);
  let best = 0;
  for (const x of s) {
    if (s.has(x - 1)) continue;        // x is not the start of a run: someone smaller will count it
    let len = 1;
    while (s.has(x + len)) len++;      // walk the run x, x+1, x+2, ...
    best = Math.max(best, len);
  }
  return best;
}
// #endregion

console.log(longestConsecutive([100, 4, 200, 1, 3, 2]));          // 1,2,3,4
console.log(longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1]));  // 0..8
console.log(longestConsecutive([]));
