// Skeleton first: the main function is written against helpers that are still stubs. It already runs, so the
// interviewer sees the plan working; then each helper is filled in and re-run — one change at a time.
// #region khung
function summaryRanges(nums: number[]): string[] {
  const ranges: string[] = [];
  let start = 0;
  while (start < nums.length) {
    const end = extendRun(nums, start);
    ranges.push(formatRange(nums[start], nums[end]));
    start = end + 1;
  }
  return ranges;
}

function extendRun(nums: number[], start: number): number {
  return start;                       // TODO: walk right while the next number is +1
}

function formatRange(first: number, last: number): string {
  return `${first}..${last}`;         // TODO: "a" when first === last, "a->b" otherwise
}
// #endregion
console.log('stage 1 (both helpers stubbed):', JSON.stringify(summaryRanges([0, 1, 2, 4, 5, 7])));
