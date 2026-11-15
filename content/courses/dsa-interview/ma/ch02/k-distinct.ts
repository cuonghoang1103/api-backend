// @java: KDistinct.java
// "At most k distinct" windows: LC 904 Fruit Into Baskets (k = 2) and LC 992 Subarrays with K Different Integers.

// #region atmost
function longestAtMostK(nums: number[], k: number): number {
  const cnt = new Map<number, number>();
  let l = 0, best = 0;
  for (let r = 0; r < nums.length; r++) {
    cnt.set(nums[r], (cnt.get(nums[r]) ?? 0) + 1);
    while (cnt.size > k) {                       // too many kinds: shrink until valid again
      const x = nums[l++];
      const c = cnt.get(x)! - 1;
      if (c === 0) cnt.delete(x); else cnt.set(x, c);   // delete at 0, or size lies
    }
    best = Math.max(best, r - l + 1);
  }
  return best;
}
const totalFruit = (fruits: number[]) => longestAtMostK(fruits, 2);
// #endregion

// #region exactly
function countAtMostK(nums: number[], k: number): number {
  const cnt = new Map<number, number>();
  let l = 0, total = 0;
  for (let r = 0; r < nums.length; r++) {
    cnt.set(nums[r], (cnt.get(nums[r]) ?? 0) + 1);
    while (cnt.size > k) {
      const x = nums[l++];
      const c = cnt.get(x)! - 1;
      if (c === 0) cnt.delete(x); else cnt.set(x, c);
    }
    total += r - l + 1;                          // every subarray ENDING at r and starting in [l..r] is valid
  }
  return total;
}
function subarraysWithKDistinct(nums: number[], k: number): number {
  return countAtMostK(nums, k) - countAtMostK(nums, k - 1);   // exactly k = at most k − at most (k − 1)
}
// #endregion

for (const f of [[1, 2, 1], [0, 1, 2, 2], [1, 2, 3, 2, 2], [3, 3, 3, 1, 2, 1, 1, 2, 3, 3, 4]]) {
  console.log(`totalFruit(${JSON.stringify(f)}) = ${totalFruit(f)}`);
}
for (const [nums, k] of [[[1, 2, 1, 2, 3], 2], [[1, 2, 1, 3, 4], 3]] as [number[], number][]) {
  console.log(`subarraysWithKDistinct(${JSON.stringify(nums)}, ${k}) = ${subarraysWithKDistinct(nums, k)}  (at most ${k}: ${countAtMostK(nums, k)}, at most ${k - 1}: ${countAtMostK(nums, k - 1)})`);
}
