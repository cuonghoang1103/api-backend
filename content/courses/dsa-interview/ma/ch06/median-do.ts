// @thoi-gian
// Running median after EVERY insertion, three ways:
//  (a) copy + sort when asked — what a one-off percentile() does, repeated: O(n log n) per query
//  (b) sorted array + binary search + splice: O(log n) to find, O(n) to shift      ⇒ O(n^2) total
//  (c) two heaps: O(log n) per insertion                                            ⇒ O(n log n) total
class Heap {
  a: number[] = [];
  constructor(private max: boolean) {}
  get size() { return this.a.length; }
  peek() { return this.a[0]; }
  private lt(x: number, y: number) { return this.max ? x > y : x < y; }
  push(x: number) {
    const a = this.a; a.push(x);
    for (let i = a.length - 1; i > 0; ) { const p = (i - 1) >> 1; if (!this.lt(a[i], a[p])) break; [a[i], a[p]] = [a[p], a[i]]; i = p; }
  }
  pop() {
    const a = this.a, top = a[0], last = a.pop()!;
    if (a.length === 0) return top;
    a[0] = last;
    for (let i = 0; ; ) {
      const l = 2 * i + 1, r = l + 1; let m = i;
      if (l < a.length && this.lt(a[l], a[m])) m = l;
      if (r < a.length && this.lt(a[r], a[m])) m = r;
      if (m === i) return top;
      [a[i], a[m]] = [a[m], a[i]]; i = m;
    }
  }
}
let seed = 11;
const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648);
function viaSortCopy(xs: number[]) {
  const seen: number[] = []; let sum = 0;
  for (const x of xs) {
    seen.push(x);
    const s = [...seen].sort((a, b) => a - b), n = s.length;
    sum += n % 2 ? s[n >> 1] : (s[n / 2 - 1] + s[n / 2]) / 2;
  }
  return sum;
}
function viaSplice(xs: number[]) {
  const s: number[] = []; let sum = 0;
  for (const x of xs) {
    let lo = 0, hi = s.length;
    while (lo < hi) { const m = (lo + hi) >> 1; if (s[m] < x) lo = m + 1; else hi = m; }
    s.splice(lo, 0, x);
    const n = s.length;
    sum += n % 2 ? s[n >> 1] : (s[n / 2 - 1] + s[n / 2]) / 2;
  }
  return sum;
}
function viaHeaps(xs: number[]) {
  const lo = new Heap(true), hi = new Heap(false); let sum = 0;
  for (const x of xs) {
    if (lo.size === 0 || x <= lo.peek()) lo.push(x); else hi.push(x);
    if (lo.size > hi.size + 1) hi.push(lo.pop()); else if (hi.size > lo.size) lo.push(hi.pop());
    sum += lo.size > hi.size ? lo.peek() : (lo.peek() + hi.peek()) / 2;
  }
  return sum;
}
function ms(f: () => number, lap: number): [number, number] {
  let best = Infinity, v = 0;
  for (let i = 0; i < lap; i++) { const t0 = performance.now(); v = f(); best = Math.min(best, performance.now() - t0); }
  return [best, v];
}
const pad = (s: string | number, w: number) => String(s).padStart(w);
console.log(`${pad('n', 9)} | ${pad('copy+sort each time', 19)} | ${pad('sorted array+splice', 19)} | ${pad('two heaps', 10)}`);
for (const n of [1_000, 10_000, 100_000, 1_000_000]) {
  const xs = Array.from({ length: n }, () => rnd() % 1_000_000);
  const [th, vh] = ms(() => viaHeaps(xs), 3);
  let a = 'skipped', b = 'skipped';
  if (n <= 10_000) { const [t, v] = ms(() => viaSortCopy(xs), n <= 1_000 ? 3 : 1); if (v !== vh) throw new Error('mismatch'); a = t.toFixed(1) + ' ms'; }
  if (n <= 100_000) { const [t, v] = ms(() => viaSplice(xs), 3); if (v !== vh) throw new Error('mismatch'); b = t.toFixed(1) + ' ms'; }
  console.log(`${pad(n.toLocaleString('en-US'), 9)} | ${pad(a, 19)} | ${pad(b, 19)} | ${pad(th.toFixed(1) + ' ms', 10)}`);
}
console.log(`node ${process.version} · ${process.arch}`);
