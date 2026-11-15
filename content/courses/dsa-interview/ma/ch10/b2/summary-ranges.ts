// @java: SummaryRanges.java
// LC 228 Summary Ranges — the SAME algorithm written twice: once the way it comes out under pressure, once clean.
// Both are run on the same inputs and must print the same answers.

// #region ban
function f(a: number[]): string[] {
  let r: string[] = [];
  let x1 = a[0];
  let x2 = a[0];
  for (let i = 1; i < a.length; i++) {
    if (a[i] != x2 + 1) {
      if (x1 == x2) {
        r.push('' + x1);
      } else {
        r.push(x1 + '->' + x2);
      }
      x1 = a[i];
      x2 = a[i];
    } else {
      x2 = a[i];
    }
  }
  if (x1 == x2) {
    r.push('' + x1);
  } else {
    r.push(x1 + '->' + x2);
  }
  return r;
}
// #endregion

// #region sach
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

/** Last index of the run of consecutive numbers that begins at `start`. */
function extendRun(nums: number[], start: number): number {
  let end = start;
  while (end + 1 < nums.length && nums[end + 1] === nums[end] + 1) end++;
  return end;
}

function formatRange(first: number, last: number): string {
  return first === last ? String(first) : `${first}->${last}`;
}
// #endregion

const tests: number[][] = [
  [0, 1, 2, 4, 5, 7],
  [0, 2, 3, 4, 6, 8, 9],
  [-3, -2, -1, 4, 6, 7, 8, 10],
  [5],
  [-2147483648, 2147483647],
];
for (const t of tests) {
  const dirty = f(t);
  const clean = summaryRanges(t);
  console.log(JSON.stringify(t), '->', JSON.stringify(clean), JSON.stringify(dirty) === JSON.stringify(clean) ? 'same' : 'DIFFERENT');
}
console.log('[] -> clean:', JSON.stringify(summaryRanges([])));
