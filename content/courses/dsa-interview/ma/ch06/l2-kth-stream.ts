// @java: L2KthStream.java
// LC 703 · Kth Largest Element in a Stream — a min-heap that never holds more than k numbers.

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
class KthLargest {
  private h = new MinHeap<number>((a, b) => a - b);
  constructor(private k: number, nums: number[]) {
    for (const x of nums) this.add(x);
  }
  add(val: number): number {
    this.h.push(val);
    if (this.h.size > this.k) this.h.pop();   // keep only the k largest
    return this.h.peek()!;                     // the smallest of them = k-th largest
  }
}
// #endregion

const kl = new KthLargest(3, [5, 1, 9]);
console.log(`k=3 start [5,1,9]: add(4)=${kl.add(4)} add(10)=${kl.add(10)} add(2)=${kl.add(2)} add(7)=${kl.add(7)}`);
const k1 = new KthLargest(1, []);
console.log(`k=1 start []: add(-3)=${k1.add(-3)} add(-8)=${k1.add(-8)} add(0)=${k1.add(0)}`);
