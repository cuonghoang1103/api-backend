// @java: NextGreater.java
// LC 496 · Next Greater Element I · LC 503 · Next Greater Element II (circular) · LC 901 · Online Stock Span

// #region nge1
function nextGreaterElement(nums1: number[], nums2: number[]): number[] {
  const next = new Map<number, number>();          // value -> next greater value in nums2
  const st: number[] = [];                         // VALUES (they are distinct), decreasing
  for (const x of nums2) {
    while (st.length && x > st[st.length - 1]) next.set(st.pop()!, x);
    st.push(x);
  }
  return nums1.map((x) => next.get(x) ?? -1);
}
// #endregion

// #region nge2
function nextGreaterElements(nums: number[]): number[] {
  const n = nums.length;
  const ans = new Array(n).fill(-1);
  const st: number[] = [];                         // indices
  for (let k = 0; k < 2 * n; k++) {                // walk the array TWICE to simulate the wrap-around
    const i = k % n;
    while (st.length && nums[i] > nums[st[st.length - 1]]) ans[st.pop()!] = nums[i];
    if (k < n) st.push(i);                         // only the first lap pushes
  }
  return ans;
}
// #endregion

// #region span
class StockSpanner {
  private st: [number, number][] = [];             // [price, span] — prices strictly decreasing
  next(price: number): number {
    let span = 1;
    while (this.st.length && this.st[this.st.length - 1][0] <= price) span += this.st.pop()![1]; // absorb smaller days
    this.st.push([price, span]);
    return span;
  }
}
// #endregion

console.log('nextGreaterElement([4,1,2],[1,3,4,2]) =', JSON.stringify(nextGreaterElement([4, 1, 2], [1, 3, 4, 2])));
console.log('nextGreaterElements([1,2,1]) =', JSON.stringify(nextGreaterElements([1, 2, 1])));
console.log('nextGreaterElements([5,4,3,2,1]) =', JSON.stringify(nextGreaterElements([5, 4, 3, 2, 1])));
const sp = new StockSpanner();
console.log('spans for [100,80,60,70,60,75,85] =', JSON.stringify([100, 80, 60, 70, 60, 75, 85].map((p) => sp.next(p))));
