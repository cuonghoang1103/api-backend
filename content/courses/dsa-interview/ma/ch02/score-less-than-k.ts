// @java: ScoreLessThanK.java
// LC 2302 · Count Subarrays With Score Less Than K — score = sum × length; positive numbers ⇒ the score only grows with
// the window, so the "at most" window works, and every valid window [l..r] contributes r - l + 1 subarrays ending at r.

// #region giai
function countSubarrays(nums: number[], k: number): number {
  let l = 0, sum = 0, total = 0;
  for (let r = 0; r < nums.length; r++) {
    sum += nums[r];
    while (sum * (r - l + 1) >= k) {   // too big: shrink (max ~1e10 × 1e5 = 1e15 < 2^53, safe as a JS number)
      sum -= nums[l];
      l++;
    }
    total += r - l + 1;                // [l..r], [l+1..r], …, [r..r] all score < k
  }
  return total;
}
// #endregion

for (const [a, k] of [[[2, 1, 4, 3, 5], 10], [[1, 1, 1], 5], [[10], 5], [[1, 2, 3, 4], 100]] as [number[], number][]) {
  console.log(`countSubarrays(${JSON.stringify(a)}, ${k}) = ${countSubarrays(a, k)}`);
}
