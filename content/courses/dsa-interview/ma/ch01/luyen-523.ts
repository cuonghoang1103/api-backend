// @java: Luyen523.java
// LC 523 · Continuous Subarray Sum — prefix remainders + the FIRST index of each remainder.

// #region giai
function checkSubarraySum(nums: number[], k: number): boolean {
  const first = new Map<number, number>([[0, -1]]); // remainder -> FIRST prefix index; empty prefix sits at -1
  let rem = 0;
  for (let i = 0; i < nums.length; i++) {
    rem = (rem + nums[i]) % k;        // keep only the remainder: same answer, no overflow
    const j = first.get(rem);
    if (j === undefined) first.set(rem, i); // first time: remember, and NEVER overwrite later
    else if (i - j >= 2) return true;       // nums[j+1..i] has length i - j and sum divisible by k
  }
  return false;
}
// #endregion

const cases: [number[], number][] = [
  [[2, 5, 3, 0, 4], 6],
  [[2, 4], 6],
  [[5, 0, 0, 0], 3],
  [[0], 1],
  [[1, 0], 2],
  [[7, 3, 1], 5],
];
for (const [nums, k] of cases) {
  console.log(`checkSubarraySum(${JSON.stringify(nums)}, ${k}) = ${checkSubarraySum(nums, k)}`);
}
