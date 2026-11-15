// @thoi-gian
// Linear scan vs binary search on a sorted array, n = 10^3 ... 10^7.
// Q queries per n (all present in the array). We COUNT comparisons (exact) and time the whole batch.
function linear(a: number[], x: number, c: { n: number }): number {
  let i = 0;
  while (true) { c.n++; if (i === a.length || a[i] >= x) return i; i++; }
}
function lower(a: number[], x: number, c: { n: number }): number {
  let lo = 0, hi = a.length;
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    c.n++;
    if (a[mid] >= x) hi = mid; else lo = mid + 1;
  }
  return lo;
}
function best(f: () => void, lap: number): number {
  let b = Infinity;
  for (let k = 0; k < lap; k++) { const t = performance.now(); f(); b = Math.min(b, performance.now() - t); }
  return b;
}
const Q = 200;
const pad = (s: string | number, w: number) => String(s).padStart(w);
console.log(`Q = ${Q} queries per row`);
console.log(`${pad('n', 12)} | ${pad('linear cmp/query', 16)} | ${pad('binary cmp/query', 16)} | ${pad('log2(n)', 7)} | ${pad('linear Q', 11)} | ${pad('binary Q', 9)}`);
for (const n of [1_000, 10_000, 100_000, 1_000_000, 10_000_000]) {
  const a = Array.from({ length: n }, (_, i) => 2 * i);
  let seed = 7;
  const qs = Array.from({ length: Q }, () => { seed = (seed * 48271) % 2147483647; return 2 * (seed % n); });
  const cl = { n: 0 }, cb = { n: 0 };
  let s1 = 0, s2 = 0;
  for (const x of qs) { s1 += linear(a, x, cl); s2 += lower(a, x, cb); }
  if (s1 !== s2) throw new Error('linear and binary disagree');
  const lap = n >= 1_000_000 ? 1 : 3;
  const tl = best(() => { const c = { n: 0 }; for (const x of qs) linear(a, x, c); }, lap);
  const tb = best(() => { const c = { n: 0 }; for (const x of qs) lower(a, x, c); }, 5);
  console.log(`${pad(n.toLocaleString('en-US'), 12)} | ${pad(Math.round(cl.n / Q).toLocaleString('en-US'), 16)} | ${pad((cb.n / Q).toFixed(1), 16)} | ${pad(Math.log2(n).toFixed(1), 7)} | ${pad(tl.toFixed(1) + ' ms', 11)} | ${pad(tb.toFixed(3) + ' ms', 9)}`);
}
console.log(`node ${process.version} · ${process.arch}`);
