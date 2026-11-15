// @java: SlidingMax.java
// LC 239 · Sliding Window Maximum — brute O(n·k) vs monotonic deque O(n).

// #region brute
function maxSlidingWindowBrute(nums: number[], k: number): number[] {
  const out: number[] = [];
  for (let i = 0; i + k <= nums.length; i++) {
    let m = -Infinity;
    for (let j = i; j < i + k; j++) m = Math.max(m, nums[j]);   // rescans k elements every time
    out.push(m);
  }
  return out;
}
// #endregion

// #region deque
function maxSlidingWindow(nums: number[], k: number): number[] {
  const dq = new Array<number>(nums.length);      // indices; values DECREASING from head to tail
  let head = 0, tail = 0;                          // dq[head..tail-1] is the live deque (no shift()!)
  const out: number[] = [];
  for (let i = 0; i < nums.length; i++) {
    if (head < tail && dq[head] <= i - k) head++;              // 1. front left the window -> drop it
    while (head < tail && nums[dq[tail - 1]] <= nums[i]) tail--; // 2. smaller-or-equal at the back can never win again
    dq[tail++] = i;                                             // 3. push i at the back
    if (i >= k - 1) out.push(nums[dq[head]]);                   // 4. the front is the max of the window
  }
  return out;
}
// #endregion

for (const [nums, k] of [[[1, 3, -1, -3, 5, 3, 6, 7], 3], [[9, 8, 7, 6], 2], [[4], 1], [[1, -1], 1]] as [number[], number][]) {
  console.log(`${JSON.stringify(nums)}, k=${k} -> ${JSON.stringify(maxSlidingWindow(nums, k))}   brute = ${JSON.stringify(maxSlidingWindowBrute(nums, k))}`);
}
