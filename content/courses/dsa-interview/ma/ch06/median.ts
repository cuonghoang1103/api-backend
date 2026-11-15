// @java: MedianFinder.java
// LC 295 · Find Median from Data Stream — two heaps: lo = max-heap (smaller half), hi = min-heap (larger half).

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
class MedianFinder {
  lo = new MinHeap<number>((a, b) => b - a);   // max-heap: the smaller half, its top = biggest of the small
  hi = new MinHeap<number>((a, b) => a - b);   // min-heap: the larger half, its top = smallest of the big
  addNum(x: number): void {
    if (this.lo.size === 0 || x <= this.lo.peek()!) this.lo.push(x);  // 1. route by value
    else this.hi.push(x);
    if (this.lo.size > this.hi.size + 1) this.hi.push(this.lo.pop()!); // 2. rebalance sizes:
    else if (this.hi.size > this.lo.size) this.lo.push(this.hi.pop()!); //    lo = hi or hi + 1
  }
  findMedian(): number {
    if (this.lo.size > this.hi.size) return this.lo.peek()!;           // odd count: middle is lo's top
    return (this.lo.peek()! + this.hi.peek()!) / 2;                    // even: average of both tops
  }
}
// #endregion

const mf = new MedianFinder();
const stream = [5, 15, 1, 3, 8, 7, 9, 10];
const res: string[] = [];
for (const x of stream) { mf.addNum(x); res.push(mf.findMedian().toFixed(1)); }
console.log(`stream  ${JSON.stringify(stream)}`);
console.log(`medians ${res.join(' ')}`);
const neg = new MedianFinder();
for (const x of [-4, -4, -4, 2]) neg.addNum(x);
console.log(`[-4,-4,-4,2] -> ${neg.findMedian().toFixed(1)}`);
