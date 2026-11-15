// Trap demo for LC 523: two "small" changes that break the answer.
// #region dung
function correct(nums: number[], k: number): boolean {
  const first = new Map<number, number>([[0, -1]]);
  let rem = 0;
  for (let i = 0; i < nums.length; i++) {
    rem = (rem + nums[i]) % k;
    const j = first.get(rem);
    if (j === undefined) first.set(rem, i);
    else if (i - j >= 2) return true;
  }
  return false;
}
// #endregion

// #region ghi-de
// Bug 1: overwrite the index every time (the habit from LC 219).
function overwrite(nums: number[], k: number): boolean {
  const last = new Map<number, number>([[0, -1]]);
  let rem = 0;
  for (let i = 0; i < nums.length; i++) {
    rem = (rem + nums[i]) % k;
    const j = last.get(rem);
    if (j !== undefined && i - j >= 2) return true;
    last.set(rem, i);                 // <- moves the "start" forward, the long subarray is lost
  }
  return false;
}
// #endregion

// #region thieu-0
// Bug 2: forget the empty prefix {0: -1}.
function noEmptyPrefix(nums: number[], k: number): boolean {
  const first = new Map<number, number>(); // <- no [0, -1]
  let rem = 0;
  for (let i = 0; i < nums.length; i++) {
    rem = (rem + nums[i]) % k;
    const j = first.get(rem);
    if (j === undefined) first.set(rem, i);
    else if (i - j >= 2) return true;
  }
  return false;
}
// #endregion

const cases: [number[], number][] = [[[5, 0, 0, 0], 3], [[2, 4], 6], [[1, 2, 3], 6], [[2, 5, 3, 0, 4], 6]];
console.log('input            | correct | overwrite | no {0:-1}');
for (const [nums, k] of cases) {
  const name = `${JSON.stringify(nums)} k=${k}`.padEnd(16);
  console.log(`${name} | ${String(correct(nums, k)).padEnd(7)} | ${String(overwrite(nums, k)).padEnd(9)} | ${noEmptyPrefix(nums, k)}`);
}
