// Three traps around prefix sums, run for real.
const nums = [1, 2, -1, 3, -2, 2];
const k = 3;

// #region quen
function subarraySumForgot(nums: number[], k: number): number {
  const seen = new Map<number, number>();        // BUG: no [0, 1] — the empty prefix is missing
  let sum = 0, count = 0;
  for (const x of nums) {
    sum += x;
    count += seen.get(sum - k) ?? 0;
    seen.set(sum, (seen.get(sum) ?? 0) + 1);
  }
  return count;
}
// #endregion

// #region cuaso
function subarraySumWindow(nums: number[], k: number): number {
  let left = 0, sum = 0, count = 0;              // "grow right, shrink left while sum > k"
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum > k && left <= right) sum -= nums[left++];
    if (sum === k) count++;
  }
  return count;                                   // only correct when every number is >= 0 (and even then, not with zeros)
}
// #endregion

function correct(nums: number[], k: number): number {
  const seen = new Map<number, number>([[0, 1]]);
  let sum = 0, count = 0;
  for (const x of nums) { sum += x; count += seen.get(sum - k) ?? 0; seen.set(sum, (seen.get(sum) ?? 0) + 1); }
  return count;
}

console.log(`nums = ${JSON.stringify(nums)}, k = ${k}`);
console.log(`correct (seen starts {0:1})  = ${correct(nums, k)}`);
console.log(`forgot {0:1}                 = ${subarraySumForgot(nums, k)}   <- misses every subarray that starts at index 0`);
console.log(`sliding window               = ${subarraySumWindow(nums, k)}   <- a negative number breaks "shrinking only lowers the sum"`);
console.log(`sliding window on [1,0,1], k=1 = ${subarraySumWindow([1, 0, 1], 1)}, correct = ${correct([1, 0, 1], 1)}   <- zeros break it too`);

// #region mod
console.log('-7 % 5               =', -7 % 5);              // JS keeps the sign of the dividend
console.log('((-7 % 5) + 5) % 5   =', ((-7 % 5) + 5) % 5); // the remainder you actually want
// #endregion
console.log('2**53 + 1 === 2**53  =', 2 ** 53 + 1 === 2 ** 53, '  <- a prefix sum above 2^53 silently loses precision');
