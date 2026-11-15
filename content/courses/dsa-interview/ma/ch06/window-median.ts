// @java: WindowMedian.java
// LC 480 · Sliding Window Median — two heaps + LAZY deletion (a heap cannot delete from the middle cheaply).

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
function medianSlidingWindow(nums: number[], k: number): number[] {
  const lo = new MinHeap<number>((a, b) => b - a), hi = new MinHeap<number>((a, b) => a - b);
  const late = new Map<number, number>();         // value -> how many copies are "deleted but still inside"
  let loN = 0, hiN = 0;                           // sizes counting only LIVE elements
  const prune = (h: MinHeap<number>) => {         // throw away dead tops (keeps every top alive)
    while (h.size && (late.get(h.peek()!) ?? 0) > 0) { const v = h.pop()!; late.set(v, late.get(v)! - 1); }
  };
  const balance = () => {
    if (loN > hiN + 1) { hi.push(lo.pop()!); loN--; hiN++; prune(lo); }
    else if (hiN > loN) { lo.push(hi.pop()!); hiN--; loN++; prune(hi); }
  };
  const add = (x: number) => {
    if (loN === 0 || x <= lo.peek()!) { lo.push(x); loN++; } else { hi.push(x); hiN++; }
    balance();
  };
  const remove = (x: number) => {
    late.set(x, (late.get(x) ?? 0) + 1);          // mark now, physically remove when it reaches a top
    if (x <= lo.peek()!) { loN--; if (x === lo.peek()) prune(lo); }
    else { hiN--; if (x === hi.peek()) prune(hi); }
    balance();
  };
  const out: number[] = [];
  for (let i = 0; i < nums.length; i++) {
    add(nums[i]);
    if (i >= k) remove(nums[i - k]);
    if (i >= k - 1) out.push(k % 2 ? lo.peek()! : lo.peek()! / 2 + hi.peek()! / 2);
  }
  return out;
}
// #endregion

function brute(nums: number[], k: number): number[] {
  const out: number[] = [];
  for (let i = 0; i + k <= nums.length; i++) {
    const w = nums.slice(i, i + k).sort((a, b) => a - b);
    out.push(k % 2 ? w[k >> 1] : w[k / 2 - 1] / 2 + w[k / 2] / 2);
  }
  return out;
}
const fmt = (xs: number[]) => xs.map((x) => x.toFixed(1)).join(' ');
console.log(`k=3 [4,1,7,1,8,7,8,7,7,4] -> ${fmt(medianSlidingWindow([4, 1, 7, 1, 8, 7, 8, 7, 7, 4], 3))}`);
console.log(`k=4 [4,1,7,1,8,7,8,7,7,4] -> ${fmt(medianSlidingWindow([4, 1, 7, 1, 8, 7, 8, 7, 7, 4], 4))}`);
console.log(`k=2 [2147483647,2147483647] -> ${fmt(medianSlidingWindow([2147483647, 2147483647], 2))}`);
let seed = 3, ok = 0;
const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648);
for (let t = 0; t < 300; t++) {
  const n = 1 + (rnd() % 30), k = 1 + (rnd() % n);
  const nums = Array.from({ length: n }, () => (rnd() % 7) - 3);      // tiny range ⇒ many duplicates
  if (fmt(medianSlidingWindow(nums, k)) === fmt(brute(nums, k))) ok++;
}
console.log(`random tests that agree with brute force: ${ok}/300`);
