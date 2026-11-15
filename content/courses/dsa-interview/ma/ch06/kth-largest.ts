// @java: KthLargest.java
// LC 215 · Kth Largest Element in an Array — three answers: sort, a min-heap of size k, quickselect.

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

// #region sort
function kthSort(nums: number[], k: number): number {
  const s = [...nums].sort((a, b) => b - a);    // copy, largest first: O(n log n)
  return s[k - 1];
}
// #endregion

// #region heap
function kthHeap(nums: number[], k: number): number {
  const h = new MinHeap<number>((a, b) => a - b); // keeps the k LARGEST seen so far
  for (const x of nums) {
    h.push(x);
    if (h.size > k) h.pop();                      // throw away the smallest of k+1
  }
  return h.peek()!;                               // smallest of the top k = k-th largest
}
// #endregion

// #region quickselect
function kthQuickselect(nums: number[], k: number): number {
  const a = [...nums];
  const target = a.length - k;                    // k-th largest = index n-k in ascending order
  let lo = 0, hi = a.length - 1;
  let seed = 12345;                               // tiny deterministic random (LCG) for the pivot
  const rand = (n: number) => (seed = (seed * 1103515245 + 12345) % 2147483648) % n;
  while (true) {
    const pivot = a[lo + rand(hi - lo + 1)];
    let lt = lo, i = lo, gt = hi;                 // 3-way split: [< pivot | = pivot | > pivot]
    while (i <= gt) {
      if (a[i] < pivot) { [a[lt], a[i]] = [a[i], a[lt]]; lt++; i++; }
      else if (a[i] > pivot) { [a[i], a[gt]] = [a[gt], a[i]]; gt--; }
      else i++;
    }
    if (target < lt) hi = lt - 1;                 // answer is in the "<" part
    else if (target > gt) lo = gt + 1;            // answer is in the ">" part
    else return pivot;                            // target lands inside the "=" block
  }
}
// #endregion

const cases: [number[], number][] = [
  [[7, 2, 9, 4, 1, 8, 3], 3],
  [[5, 5, 1, 5, 2], 2],
  [[4], 1],
  [[-3, -1, -2], 1],
  [[6, 6, 6, 6], 4],
];
for (const [nums, k] of cases) {
  console.log(`k=${k} ${JSON.stringify(nums)}: sort=${kthSort(nums, k)} heap=${kthHeap(nums, k)} quickselect=${kthQuickselect(nums, k)}`);
}
