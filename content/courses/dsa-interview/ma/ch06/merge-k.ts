// @java: MergeK.java
// LC 23 · Merge k Sorted Lists — a min-heap holding the current HEAD of each list.

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

class ListNode { constructor(public val: number, public next: ListNode | null = null) {} }
const fromArray = (xs: number[]) => xs.reduceRight<ListNode | null>((nx, v) => new ListNode(v, nx), null);
const toArray = (h: ListNode | null) => { const o: number[] = []; for (; h; h = h.next) o.push(h.val); return o; };

// #region giai
function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
  const h = new MinHeap<ListNode>((a, b) => a.val - b.val);
  for (const node of lists) if (node) h.push(node);       // k heads (skip empty lists)
  const dummy = new ListNode(0);
  let tail = dummy;
  while (h.size > 0) {
    const node = h.pop()!;                                  // smallest head overall
    tail.next = node;
    tail = node;
    if (node.next) h.push(node.next);                       // its successor becomes that list's head
  }
  return dummy.next;
}
// #endregion

const cases = [
  [[2, 6, 9], [1, 7], [3, 4, 8]],
  [[1, 5, 6], [1, 2, 5], [3, 8]],
  [[], [0]],
  [],
];
for (const c of cases) console.log(`${JSON.stringify(c)} -> ${JSON.stringify(toArray(mergeKLists(c.map(fromArray))))}`);
