// @java: CungChieu.java
// Same-direction pointers: a READ pointer scans everything, a WRITE pointer marks where the next kept element goes.

// #region dup
// LC 26 · Remove Duplicates from Sorted Array — returns k; nums[0..k-1] holds the unique values in order.
function removeDuplicates(nums: number[]): number {
  if (nums.length === 0) return 0;
  let w = 1;                                   // nums[0] is always kept
  for (let r = 1; r < nums.length; r++) {
    if (nums[r] !== nums[w - 1]) nums[w++] = nums[r];   // new value: write it, advance the writer
  }
  return w;
}
// #endregion

// #region zero
// LC 283 · Move Zeroes — keep the order of non-zeros, push zeros to the end, in place.
function moveZeroes(nums: number[]): void {
  let w = 0;
  for (let r = 0; r < nums.length; r++) {
    if (nums[r] !== 0) {
      [nums[w], nums[r]] = [nums[r], nums[w]];   // swap, so zeros drift right without a second pass
      w++;
    }
  }
}
// #endregion

// #region merge
// LC 88 · Merge Sorted Array — nums1 has room for n more; fill from the BACK so nothing is overwritten.
function merge(nums1: number[], m: number, nums2: number[], n: number): void {
  let i = m - 1, j = n - 1, w = m + n - 1;
  while (j >= 0) {                             // when nums2 is used up, the rest of nums1 is already in place
    if (i >= 0 && nums1[i] > nums2[j]) nums1[w--] = nums1[i--];
    else nums1[w--] = nums2[j--];
  }
}
// #endregion

const a = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4];
const k = removeDuplicates(a);
console.log(`removeDuplicates -> k = ${k}, first k = ${JSON.stringify(a.slice(0, k))}`);
const z = [0, 1, 0, 3, 12];
moveZeroes(z);
console.log(`moveZeroes -> ${JSON.stringify(z)}`);
const m1 = [1, 2, 3, 0, 0, 0];
merge(m1, 3, [2, 5, 6], 3);
console.log(`merge -> ${JSON.stringify(m1)}`);
const m2 = [4, 5, 6, 0, 0, 0];
merge(m2, 3, [1, 2, 3], 3);
console.log(`merge -> ${JSON.stringify(m2)}`);
