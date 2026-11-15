// @java: L1LastStone.java
// LC 1046 · Last Stone Weight — a max-heap, nothing else.

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
function lastStoneWeight(stones: number[]): number {
  const h = new MinHeap<number>((a, b) => b - a);     // max-heap
  for (const s of stones) h.push(s);
  while (h.size > 1) {
    const y = h.pop()!, x = h.pop()!;                 // y >= x: the two heaviest
    if (y !== x) h.push(y - x);                        // equal stones both vanish
  }
  return h.size ? h.peek()! : 0;
}
// #endregion

for (const s of [[6, 9, 4, 1, 7], [4, 4, 3, 2, 1], [10, 3], [5], [2, 2]]) console.log(`${JSON.stringify(s)} -> ${lastStoneWeight(s)}`);
