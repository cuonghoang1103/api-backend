// @java: PrefixRangeSum.java
// LC 303 · Range Sum Query - Immutable — build the prefix array once, answer every query in O(1).

// #region lop
class NumArray {
  private pre: number[]; // pre[i] = nums[0] + ... + nums[i-1]; pre[0] = 0

  constructor(nums: number[]) {
    this.pre = new Array(nums.length + 1).fill(0);
    for (let i = 0; i < nums.length; i++) this.pre[i + 1] = this.pre[i] + nums[i];
  }

  sumRange(left: number, right: number): number { // inclusive [left, right]
    return this.pre[right + 1] - this.pre[left];
  }
}
// #endregion

const nums = [-2, 0, 3, -5, 2, -1];
const na = new NumArray(nums);
console.log('nums =', JSON.stringify(nums));
console.log('pre  =', JSON.stringify((na as any).pre));
for (const [l, r] of [[0, 2], [2, 5], [0, 5], [3, 3]]) {
  console.log(`sumRange(${l}, ${r}) = pre[${r + 1}] - pre[${l}] = ${na.sumRange(l, r)}`);
}
