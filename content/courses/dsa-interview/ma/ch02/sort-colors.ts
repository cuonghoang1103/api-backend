// @java: SortColors.java
// LC 75 · Sort Colors — Dutch national flag: three pointers, one pass, in place.

// #region giai
function sortColors(nums: number[]): void {
  let lo = 0, mid = 0, hi = nums.length - 1;
  // invariant: [0, lo) = 0s · [lo, mid) = 1s · [mid, hi] = not yet seen · (hi, end] = 2s
  while (mid <= hi) {
    if (nums[mid] === 0) { [nums[lo], nums[mid]] = [nums[mid], nums[lo]]; lo++; mid++; }
    else if (nums[mid] === 1) mid++;
    else { [nums[mid], nums[hi]] = [nums[hi], nums[mid]]; hi--; }   // do NOT mid++: the value swapped in is unseen
  }
}
// #endregion

for (const a of [[2, 0, 2, 1, 1, 0], [2, 0, 1], [0], [2, 2, 0, 0], [1, 2, 0, 2, 1, 0, 1]]) {
  const b = [...a];
  sortColors(b);
  console.log(`sortColors(${JSON.stringify(a)}) -> ${JSON.stringify(b)}`);
}
