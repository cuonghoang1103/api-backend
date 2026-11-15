// @java: FindDuplicate.java
// LC 287 · Find the Duplicate Number — n + 1 numbers in 1..n: read i -> nums[i] as a linked list; the duplicate is the cycle entry.

// #region floyd
function findDuplicate(nums: number[]): number {
  let slow = nums[0], fast = nums[0];
  do {                                   // phase 1: start together, so use do/while
    slow = nums[slow];                   // one step:  i -> nums[i]
    fast = nums[nums[fast]];             // two steps
  } while (slow !== fast);
  let p = nums[0];                       // phase 2: p from the start (index 0 -> nums[0]), slow from the meeting point
  while (p !== slow) {
    p = nums[p];
    slow = nums[slow];
  }
  return p;                              // two different indices point to this value => it is the duplicate
}
// #endregion

for (const a of [[1, 3, 4, 2, 2], [3, 1, 3, 4, 2], [3, 3, 3, 3, 3], [2, 5, 9, 6, 9, 3, 8, 9, 7, 1]]) {
  console.log(`findDuplicate(${JSON.stringify(a)}) = ${findDuplicate(a)}`);
}
