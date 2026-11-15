// @java: CuaSo.java
// Max sum of k consecutive elements (1 <= k <= n). Three versions: the buggy one we "finish" in the interview,
// the fixed one, and a brute force we trust. Run the normal example first, then the edge cases.

// #region loi
function maxWindowBuggy(nums: number[], k: number): number {
  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];   // window starting at 0
  let best = sum;
  for (let s = 1; s < nums.length - k; s++) {   // BUG: the last start is n - k, so this must be <=
    sum += nums[s + k - 1] - nums[s - 1];       // slide: add the new right end, drop the old left end
    best = Math.max(best, sum);
  }
  return best;
}
// #endregion

// #region dung
function maxWindow(nums: number[], k: number): number {
  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];
  let best = sum;                               // not 0: every window may be negative
  for (let s = 1; s <= nums.length - k; s++) {  // starts 1 .. n - k, inclusive
    sum += nums[s + k - 1] - nums[s - 1];
    best = Math.max(best, sum);
  }
  return best;
}
// #endregion

// #region brute
function maxWindowBrute(nums: number[], k: number): number {
  let best = -Infinity;
  for (let s = 0; s + k <= nums.length; s++) {  // every start, sum the window from scratch: O(n·k)
    let sum = 0;
    for (let i = s; i < s + k; i++) sum += nums[i];
    best = Math.max(best, sum);
  }
  return best;
}
// #endregion

const cases: [string, number[], number][] = [
  ['normal example', [2, 1, 5, 1, 3, 2], 3],
  ['best window is the LAST one', [1, 2, 3], 2],
  ['one element', [7], 1],
  ['k = n (one window)', [4, -1, 2], 3],
  ['all negative', [-3, -1, -2], 2],
  ['all equal', [5, 5, 5, 5], 2],
];
for (const [name, nums, k] of cases) {
  const b = maxWindowBuggy(nums, k), f = maxWindow(nums, k), r = maxWindowBrute(nums, k);
  const verdict = b === r ? 'ok' : 'BUGGY WRONG';
  console.log(`${name}: ${JSON.stringify(nums)} k=${k} -> buggy ${b} | fixed ${f} | brute ${r} | ${verdict}`);
}
