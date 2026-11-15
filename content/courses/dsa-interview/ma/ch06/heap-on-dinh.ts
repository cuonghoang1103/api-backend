// @java: HeapOnDinh.java
// A heap is NOT stable: equal priorities do not come out in arrival order — unless you add a sequence number.

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

// #region ondinh
type Req = { who: string; prio: number; seq: number };   // seq = arrival counter
const arrivals: [string, number][] = [['u1', 2], ['u2', 1], ['u3', 2], ['u4', 2], ['u5', 1], ['u6', 2], ['u7', 2]];
const noSeq = new MinHeap<Req>((a, b) => a.prio - b.prio);
const withSeq = new MinHeap<Req>((a, b) => a.prio - b.prio || a.seq - b.seq);   // tie ⇒ earlier arrival first
let seq = 0;
for (const [who, prio] of arrivals) { const r = { who, prio, seq: seq++ }; noSeq.push(r); withSeq.push(r); }
// #endregion
const drain = (h: MinHeap<Req>) => { const o: string[] = []; while (h.size) o.push(h.pop()!.who); return o; };
console.log(`arrival order          : ${JSON.stringify(arrivals.map((x) => x[0]))}`);
console.log(`prio only (unstable)   : ${JSON.stringify(drain(noSeq))}`);
console.log(`prio, then seq (FIFO)  : ${JSON.stringify(drain(withSeq))}`);
