// @bo-qua
// Unit tests with Node's built-in runner (no library to install). Run: node --test cua-so.test.ts
// (Node 23.6+ strips TypeScript types by itself; older Node: npx tsx --test cua-so.test.ts).
// BAN=loi node --test cua-so.test.ts  runs the SAME tests against the buggy version.
import { test } from 'node:test';
import assert from 'node:assert/strict';

function maxWindowBuggy(nums: number[], k: number): number {
  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];
  let best = sum;
  for (let s = 1; s < nums.length - k; s++) { sum += nums[s + k - 1] - nums[s - 1]; best = Math.max(best, sum); }
  return best;
}
function maxWindow(nums: number[], k: number): number {
  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];
  let best = sum;
  for (let s = 1; s <= nums.length - k; s++) { sum += nums[s + k - 1] - nums[s - 1]; best = Math.max(best, sum); }
  return best;
}
const impl = process.env.BAN === 'loi' ? maxWindowBuggy : maxWindow;

// #region tests
test('normal example: [2,1,5,1,3,2], k=3 -> 9', () => {
  assert.equal(impl([2, 1, 5, 1, 3, 2], 3), 9);
});
test('edge: the best window is the last one', () => {
  assert.equal(impl([1, 2, 3], 2), 5);
});
test('edge: one element, k = 1', () => {
  assert.equal(impl([7], 1), 7);
});
test('edge: k = n, a single window', () => {
  assert.equal(impl([4, -1, 2], 3), 5);
});
test('edge: every window is negative (best must not start at 0)', () => {
  assert.equal(impl([-3, -1, -2], 2), -3);
});
test('edge: all equal', () => {
  assert.equal(impl([5, 5, 5, 5], 2), 10);
});
// #endregion
