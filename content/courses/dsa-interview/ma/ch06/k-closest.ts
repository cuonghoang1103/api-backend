// @java: KClosest.java
// LC 973 · K Closest Points to Origin — a MAX-heap of size k on squared distance.

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
function kClosest(points: number[][], k: number): number[][] {
  const d = (p: number[]) => p[0] * p[0] + p[1] * p[1];        // squared distance: no sqrt needed
  const h = new MinHeap<number[]>((a, b) => d(b) - d(a));       // max-heap: the FARTHEST of the k is on top
  for (const p of points) {
    h.push(p);
    if (h.size > k) h.pop();                                     // evict the farthest
  }
  const out: number[][] = [];
  while (h.size > 0) out.push(h.pop()!);
  return out.reverse();                                          // closest first (LeetCode accepts any order)
}
// #endregion

const cases: [number[][], number][] = [
  [[[3, 3], [5, -1], [-2, 4], [1, 1], [0, -2], [2, 2]], 3],
  [[[2, 3], [-1, 2]], 1],
  [[[0, 1], [1, 0], [2, 2]], 2],
  [[[10000, 10000], [-10000, -10000], [1, -1]], 1],
];
for (const [pts, k] of cases) console.log(`k=${k}: ${JSON.stringify(kClosest(pts, k))}`);
