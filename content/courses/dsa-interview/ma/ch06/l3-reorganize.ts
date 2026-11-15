// @java: L3Reorganize.java
// LC 767 · Reorganize String — greedy with a max-heap of counts; hold the last letter back for one step.

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
function reorganizeString(s: string): string {
  const cnt = new Map<string, number>();
  for (const c of s) cnt.set(c, (cnt.get(c) ?? 0) + 1);
  type E = { c: string; n: number };
  const h = new MinHeap<E>((a, b) => b.n - a.n || (a.c < b.c ? -1 : a.c > b.c ? 1 : 0)); // most left first, ties by letter
  for (const [c, n] of cnt) h.push({ c, n });
  let out = '';
  let held: E | null = null;                          // the letter just written: not allowed next
  while (h.size > 0) {
    const cur = h.pop()!;
    out += cur.c;
    cur.n--;
    if (held && held.n > 0) h.push(held);             // the previous letter may come back now
    held = cur;
  }
  return out.length === s.length ? out : '';          // something was left in "held" ⇒ impossible
}
// #endregion

for (const s of ['aaabc', 'aaab', 'vvvlo', 'aabbcc', 'z']) console.log(`"${s}" -> "${reorganizeString(s)}"`);
