// @java: L8SmallestRange.java
// LC 632 · Smallest Range Covering Elements from K Lists — merge-k heap + the current maximum.

class MinHeap<T> {
  a: T[] = [];
  constructor(private cmp: (x: T, y: T) => number) {}
  get size() { return this.a.length; }
  peek() { return this.a[0]; }
  push(x: T) {
    const a = this.a; a.push(x);
    for (let i = a.length - 1; i > 0; ) {
      const p = (i - 1) >> 1;
      if (this.cmp(a[i], a[p]) >= 0) break;
      [a[i], a[p]] = [a[p], a[i]]; i = p;
    }
  }
  pop() {
    const a = this.a, top = a[0], last = a.pop()!;
    if (a.length === 0) return top;
    a[0] = last;
    for (let i = 0; ; ) {
      const l = 2 * i + 1, r = l + 1; let m = i;
      if (l < a.length && this.cmp(a[l], a[m]) < 0) m = l;
      if (r < a.length && this.cmp(a[r], a[m]) < 0) m = r;
      if (m === i) return top;
      [a[i], a[m]] = [a[m], a[i]]; i = m;
    }
  }
}

// #region giai
function smallestRange(nums: number[][]): number[] {
  const h = new MinHeap<[number, number, number]>((a, b) => a[0] - b[0]);  // [value, list, index]
  let curMax = -Infinity;
  nums.forEach((list, k) => { h.push([list[0], k, 0]); curMax = Math.max(curMax, list[0]); });
  let best = [h.peek()![0], curMax];                // the heap always holds ONE value from EACH list
  for (;;) {
    const [v, k, i] = h.pop()!;                     // the smallest of the k chosen values
    if (curMax - v < best[1] - best[0]) best = [v, curMax];
    if (i + 1 === nums[k].length) break;            // list k is exhausted: no range can cover it any more
    const nx = nums[k][i + 1];
    h.push([nx, k, i + 1]);
    curMax = Math.max(curMax, nx);
  }
  return best;
}
// #endregion

for (const c of [[[1, 9, 17], [4, 10, 22], [6, 11, 20]], [[1, 2, 3], [1, 2, 3], [1, 2, 3]], [[10], [3, 11], [5, 12, 30]]]) {
  console.log(`${JSON.stringify(c)} -> ${JSON.stringify(smallestRange(c))}`);
}
