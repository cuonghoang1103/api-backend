// @java: Ipo.java
// LC 502 · IPO — two heaps of DIFFERENT kinds: "not affordable yet" by capital, "affordable" by profit.

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
function findMaximizedCapital(k: number, w: number, profits: number[], capital: number[]): number {
  const locked = new MinHeap<number>((a, b) => capital[a] - capital[b]);  // project ids by capital needed
  const open = new MinHeap<number>((a, b) => profits[b] - profits[a]);    // affordable ids, best profit on top
  for (let i = 0; i < profits.length; i++) locked.push(i);
  for (let round = 0; round < k; round++) {
    while (locked.size && capital[locked.peek()!] <= w) open.push(locked.pop()!);  // unlock what we can afford
    if (open.size === 0) break;                                                  // nothing affordable: stop early
    w += profits[open.pop()!];                                                   // greedy: most profitable now
  }
  return w;
}
// #endregion

console.log(`k=3 w=1 profits=[3,1,5,2] capital=[0,1,4,2] -> ${findMaximizedCapital(3, 1, [3, 1, 5, 2], [0, 1, 4, 2])}`);
console.log(`k=2 w=0 profits=[2,4] capital=[1,0] -> ${findMaximizedCapital(2, 0, [2, 4], [1, 0])}`);
console.log(`k=3 w=0 profits=[5] capital=[1] -> ${findMaximizedCapital(3, 0, [5], [1])}`);
