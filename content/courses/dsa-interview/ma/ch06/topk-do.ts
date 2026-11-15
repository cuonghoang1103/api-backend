// @thoi-gian
// Measure the k-th largest three ways: sort O(n log n) · min-heap of size k O(n log k) · quickselect O(n) average.
// Then the trap: a 2-way (Lomuto) quickselect on an array of EQUAL values degrades to O(n^2); the 3-way split does not.
class MinHeap {
  a: number[] = [];
  get size() { return this.a.length; }
  push(x: number) {
    const a = this.a; a.push(x);
    for (let i = a.length - 1; i > 0; ) { const p = (i - 1) >> 1; if (a[i] >= a[p]) break; [a[i], a[p]] = [a[p], a[i]]; i = p; }
  }
  pop() {
    const a = this.a, top = a[0], last = a.pop()!;
    if (a.length === 0) return top;
    a[0] = last;
    for (let i = 0; ; ) {
      const l = 2 * i + 1, r = l + 1; let m = i;
      if (l < a.length && a[l] < a[m]) m = l;
      if (r < a.length && a[r] < a[m]) m = r;
      if (m === i) return top;
      [a[i], a[m]] = [a[m], a[i]]; i = m;
    }
  }
}
let seed = 7;
const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648);
const kthSort = (nums: number[], k: number) => [...nums].sort((a, b) => b - a)[k - 1];
function kthHeap(nums: number[], k: number) {
  const h = new MinHeap();
  for (const x of nums) { h.push(x); if (h.size > k) h.pop(); }
  return h.a[0];
}
function kthSelect3(nums: number[], k: number) {
  const a = [...nums]; const t = a.length - k; let lo = 0, hi = a.length - 1;
  for (;;) {
    const pivot = a[lo + (rnd() % (hi - lo + 1))]; let lt = lo, i = lo, gt = hi;
    while (i <= gt) {
      if (a[i] < pivot) { [a[lt], a[i]] = [a[i], a[lt]]; lt++; i++; }
      else if (a[i] > pivot) { [a[i], a[gt]] = [a[gt], a[i]]; gt--; }
      else i++;
    }
    if (t < lt) hi = lt - 1; else if (t > gt) lo = gt + 1; else return pivot;
  }
}
function kthSelect2(nums: number[], k: number) {           // Lomuto: "< pivot" left, everything else right
  const a = [...nums]; const t = a.length - k; let lo = 0, hi = a.length - 1;
  for (;;) {
    const r = lo + (rnd() % (hi - lo + 1)); [a[r], a[hi]] = [a[hi], a[r]];
    const pivot = a[hi]; let s = lo;
    for (let i = lo; i < hi; i++) if (a[i] < pivot) { [a[s], a[i]] = [a[i], a[s]]; s++; }
    [a[s], a[hi]] = [a[hi], a[s]];
    if (s === t) return a[s]; if (t < s) hi = s - 1; else lo = s + 1;
  }
}
function ms(f: () => unknown, lap = 3): number {
  let best = Infinity;
  for (let i = 0; i < lap; i++) { const t0 = performance.now(); f(); best = Math.min(best, performance.now() - t0); }
  return best;
}
const pad = (s: string | number, w: number) => String(s).padStart(w);
const f = (x: number) => x.toFixed(1) + ' ms';
console.log(`${pad('n', 9)} | ${pad('k', 7)} | ${pad('sort', 10)} | ${pad('heap of k', 10)} | ${pad('quickselect', 11)}`);
for (const n of [10_000, 100_000, 1_000_000]) {
  const nums = Array.from({ length: n }, () => rnd() % 1_000_000_000);
  for (const k of [10, n / 2]) {
    const want = kthSort(nums, k);
    if (kthHeap(nums, k) !== want || kthSelect3(nums, k) !== want) throw new Error('mismatch');
    console.log(`${pad(n.toLocaleString('en-US'), 9)} | ${pad(k.toLocaleString('en-US'), 7)} | ${pad(f(ms(() => kthSort(nums, k))), 10)} | ${pad(f(ms(() => kthHeap(nums, k))), 10)} | ${pad(f(ms(() => kthSelect3(nums, k))), 11)}`);
  }
}
console.log('all values equal (k = n/2):');
for (const n of [10_000, 20_000, 40_000]) {
  const same = new Array(n).fill(42);
  console.log(`${pad(n.toLocaleString('en-US'), 9)} | 2-way Lomuto ${pad(f(ms(() => kthSelect2(same, n / 2), 1)), 10)} | 3-way ${pad(f(ms(() => kthSelect3(same, n / 2))), 8)}`);
}
console.log(`node ${process.version} · ${process.arch}`);
