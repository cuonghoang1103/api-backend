// @java: SortTopK.java
// LC 347 · Top K Frequent Elements — count, then (a) sort by frequency O(n log n) or (b) bucket by frequency O(n).

// #region sort
function topKSort(nums: number[], k: number): number[] {
  const count = new Map<number, number>();
  for (const x of nums) count.set(x, (count.get(x) ?? 0) + 1);
  return [...count.entries()]
    .sort((a, b) => b[1] - a[1])          // most frequent first (stable: ties keep first-seen order)
    .slice(0, k)
    .map(([value]) => value);
}
// #endregion

// #region bucket
function topKBucket(nums: number[], k: number): number[] {
  const count = new Map<number, number>();
  for (const x of nums) count.set(x, (count.get(x) ?? 0) + 1);
  const bucket: number[][] = Array.from({ length: nums.length + 1 }, () => []);
  for (const [value, c] of count) bucket[c].push(value);   // a frequency is at most n: index = frequency
  const out: number[] = [];
  for (let f = nums.length; f >= 1 && out.length < k; f--) {
    for (const v of bucket[f]) {
      out.push(v);
      if (out.length === k) break;
    }
  }
  return out;
}
// #endregion

const cases: [number[], number][] = [
  [[5, 3, 5, 7, 3, 5, 9, 3, 7, 5], 2],
  [[4, 4, 1, 2, 2, 3], 1],
  [[8], 1],
  [[1, 2, 3, 1, 2, 3], 3],
];
for (const [nums, k] of cases) {
  console.log(`k=${k} ${JSON.stringify(nums)}: sort = ${JSON.stringify(topKSort(nums, k))}   bucket = ${JSON.stringify(topKBucket(nums, k))}`);
}
