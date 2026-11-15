// @thoi-gian
// Measure: q range-SUM queries (naive O(n·q) vs prefix O(n+q)) and q range-ADD updates (naive O(n·q) vs difference array O(n+q)).
let seed = 12345;
const rnd = (m: number) => { seed = (seed * 48271) % 2147483647; return seed % m; }; // Park–Miller: exact in doubles AND in Java long ⇒ same ranges
function ms(f: () => number, lap = 3): [number, number] {
  let best = Infinity, out = 0;
  for (let k = 0; k < lap; k++) { const t = performance.now(); out = f(); best = Math.min(best, performance.now() - t); }
  return [best, out];
}
const pad = (s: string | number, w: number) => String(s).padStart(w);
console.log(`${pad('n = q', 10)} | ${pad('sum naive', 11)} | ${pad('sum prefix', 10)} | ${pad('add naive', 11)} | ${pad('add diff', 9)}`);
for (const n of [1_000, 10_000, 100_000, 1_000_000]) {
  const q = n;
  seed = 12345;
  const a = Array.from({ length: n }, () => rnd(1000));
  const L: number[] = [], R: number[] = [];
  for (let i = 0; i < q; i++) { const x = rnd(n), y = rnd(n); L.push(Math.min(x, y)); R.push(Math.max(x, y)); }
  const sumNaive = () => { let chk = 0; for (let i = 0; i < q; i++) { let s = 0; for (let j = L[i]; j <= R[i]; j++) s += a[j]; chk += s; } return chk; };
  const sumPrefix = () => {
    const P = new Array(n + 1).fill(0);
    for (let i = 0; i < n; i++) P[i + 1] = P[i] + a[i];
    let chk = 0; for (let i = 0; i < q; i++) chk += P[R[i] + 1] - P[L[i]]; return chk;
  };
  const addNaive = () => { const b = new Array(n).fill(0); for (let i = 0; i < q; i++) for (let j = L[i]; j <= R[i]; j++) b[j] += 1; return b[n >> 1]; };
  const addDiff = () => {
    const d = new Array(n + 1).fill(0);
    for (let i = 0; i < q; i++) { d[L[i]] += 1; d[R[i] + 1] -= 1; }
    const b = new Array(n).fill(0); let run = 0; for (let j = 0; j < n; j++) { run += d[j]; b[j] = run; } return b[n >> 1];
  };
  const big = n >= 1_000_000;
  const [t1, c1] = big ? [NaN, NaN] : ms(sumNaive, n === 100_000 ? 1 : 3);
  const [t2, c2] = ms(sumPrefix);
  const [t3, c3] = big ? [NaN, NaN] : ms(addNaive, n === 100_000 ? 1 : 3);
  const [t4, c4] = ms(addDiff);
  if (!big && (c1 !== c2 || c3 !== c4)) throw new Error('results differ');
  const f = (t: number, d: number) => (Number.isNaN(t) ? 'skipped' : t.toFixed(d) + ' ms');
  console.log(`${pad(n.toLocaleString('en-US'), 10)} | ${pad(f(t1, 1), 11)} | ${pad(f(t2, 2), 10)} | ${pad(f(t3, 1), 11)} | ${pad(f(t4, 2), 9)}`);
}
console.log(`node ${process.version} · ${process.arch}`);
