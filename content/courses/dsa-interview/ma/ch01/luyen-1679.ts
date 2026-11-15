// @java: Luyen1679.java
// LC 1679 · Max Number of K-Sum Pairs — Two Sum with counts (each number can be used once).

// #region map
function maxOperations(nums: number[], k: number): number {
  const waiting = new Map<number, number>(); // value -> how many copies are still unpaired
  let ops = 0;
  for (const x of nums) {
    const need = k - x;
    const c = waiting.get(need) ?? 0;
    if (c > 0) {                             // a partner is waiting: pair them, use it up
      waiting.set(need, c - 1);
      ops++;
    } else {                                 // nobody to pair with: x starts waiting
      waiting.set(x, (waiting.get(x) ?? 0) + 1);
    }
  }
  return ops;
}
// #endregion

// #region sort
function maxOperationsSorted(nums: number[], k: number): number {
  const a = [...nums].sort((x, y) => x - y); // numeric comparator (lesson 1.3), copy: do not mutate input
  let lo = 0, hi = a.length - 1, ops = 0;
  while (lo < hi) {
    const s = a[lo] + a[hi];
    if (s === k) { ops++; lo++; hi--; }
    else if (s < k) lo++;                    // need a bigger sum
    else hi--;                               // need a smaller sum
  }
  return ops;
}
// #endregion

const cases: [number[], number][] = [
  [[2, 7, 4, 5, 3], 9],
  [[3, 3, 3, 1, 4], 6],
  [[2, 2, 2, 2, 2], 4],
  [[1, 1], 3],
  [[10, 1, 9, 2, 8, 3], 11],
];
for (const [nums, k] of cases) {
  console.log(`maxOperations(${JSON.stringify(nums)}, ${k}) = ${maxOperations(nums, k)}   sorted = ${maxOperationsSorted(nums, k)}`);
}
