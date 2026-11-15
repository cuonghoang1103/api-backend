// @java: PrefixBienThe.java
// Three variants of the same idea: LC 724 Find Pivot Index · LC 525 Contiguous Array · LC 974 Subarray Sums Divisible by K.

// #region pivot
function pivotIndex(nums: number[]): number {
  const total = nums.reduce((a, b) => a + b, 0);
  let left = 0;                                        // sum of nums[0..i-1]
  for (let i = 0; i < nums.length; i++) {
    if (left === total - left - nums[i]) return i;     // right sum = total - left - nums[i]
    left += nums[i];
  }
  return -1;
}
// #endregion

// #region contiguous
function findMaxLength(nums: number[]): number {
  const first = new Map<number, number>([[0, -1]]);  // balance -> FIRST index where it appeared
  let balance = 0, best = 0;
  for (let i = 0; i < nums.length; i++) {
    balance += nums[i] === 1 ? 1 : -1;                // a 0 counts as -1: "equal 0s and 1s" = "sum 0"
    const j = first.get(balance);
    if (j !== undefined) best = Math.max(best, i - j); // same balance at j and i => nums[j+1..i] is balanced
    else first.set(balance, i);                        // keep the earliest: longest subarray
  }
  return best;
}
// #endregion

// #region chiahet
function subarraysDivByK(nums: number[], k: number): number {
  const seen = new Map<number, number>([[0, 1]]);   // remainder of prefix sum -> count
  let sum = 0, count = 0;
  for (const x of nums) {
    sum += x;
    const r = ((sum % k) + k) % k;                     // JS % can be negative: -1 % 5 === -1
    count += seen.get(r) ?? 0;                         // same remainder => the difference is divisible by k
    seen.set(r, (seen.get(r) ?? 0) + 1);
  }
  return count;
}
// #endregion

console.log('pivotIndex([1,7,3,6,5,6]) =', pivotIndex([1, 7, 3, 6, 5, 6]));
console.log('pivotIndex([1,2,3]) =', pivotIndex([1, 2, 3]));
console.log('pivotIndex([2,1,-1]) =', pivotIndex([2, 1, -1]));
console.log('findMaxLength([0,1,1,1,0,0,1]) =', findMaxLength([0, 1, 1, 1, 0, 0, 1]));
console.log('findMaxLength([0,0,0]) =', findMaxLength([0, 0, 0]));
console.log('subarraysDivByK([4,5,0,-2,-3,1], 5) =', subarraysDivByK([4, 5, 0, -2, -3, 1], 5));
console.log('subarraysDivByK([-1,2,9], 2) =', subarraysDivByK([-1, 2, 9], 2));
