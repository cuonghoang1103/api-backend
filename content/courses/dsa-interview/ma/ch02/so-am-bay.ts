// Trap: a variable sliding window assumes that growing the window never DECREASES the sum.
// With negative numbers that is false. LC 560 (count subarrays with sum k) needs prefix sums + a map.
function windowCount(nums: number[], k: number): number {   // WRONG when nums has negatives
  let l = 0, sum = 0, count = 0;
  for (let r = 0; r < nums.length; r++) {
    sum += nums[r];
    while (sum > k && l <= r) sum -= nums[l++];
    if (sum === k) count++;
  }
  return count;
}
function prefixCount(nums: number[], k: number): number {   // correct for any integers
  const seen = new Map<number, number>([[0, 1]]);           // prefix sum -> how many times seen
  let pre = 0, count = 0;
  for (const x of nums) {
    pre += x;
    count += seen.get(pre - k) ?? 0;                         // a previous prefix p with pre - p = k
    seen.set(pre, (seen.get(pre) ?? 0) + 1);
  }
  return count;
}
for (const [nums, k] of [[[1, 1, 1], 2], [[1, 2, 3], 3], [[1, -1, 1, 1], 2], [[3, 4, -7, 3, 1, 3, 1, -4, -2, -2], 7]] as [number[], number][]) {
  console.log(`${JSON.stringify(nums)}, k=${k}: window = ${windowCount(nums, k)}, prefix sums = ${prefixCount(nums, k)}`);
}
