// @thoi-gian
// How many simple steps per second can this machine do? And how long do O(n), O(n log n), O(n^2) take for real n?
function ms(f: () => number, lap = 3): [number, number] {
  let best = Infinity, r = 0;
  for (let k = 0; k < lap; k++) { const t = performance.now(); r = f(); best = Math.min(best, performance.now() - t); }
  return [best, r];
}
// #region do
const linear = (n: number) => { let s = 0; for (let i = 0; i < n; i++) s = (s + i * 7) % 1000003; return s; };
const nlogn = (n: number) => { const a = Array.from({ length: n }, (_, i) => (i * 2654435761) % 1000003); a.sort((x, y) => x - y); return a[0]; };
const quad = (n: number) => { let s = 0; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) s = (s + i * j) % 1000003; return s; };
// #endregion
const [t8] = ms(() => linear(100_000_000), 1);
console.log(`10^8 simple loop steps: ${t8.toFixed(0)} ms  => about ${(1e8 / t8 * 1000 / 1e6).toFixed(0)} million steps/second`);
const pad = (s: string, w: number) => s.padStart(w);
console.log(`${pad('n', 11)} | ${pad('O(n)', 10)} | ${pad('O(n log n) sort', 16)} | ${pad('O(n^2)', 12)}`);
for (const n of [1_000, 10_000, 100_000, 1_000_000]) {
  const a = ms(() => linear(n))[0].toFixed(2) + ' ms';
  const b = ms(() => nlogn(n))[0].toFixed(1) + ' ms';
  const c = n <= 30_000 ? ms(() => quad(n), 1)[0].toFixed(0) + ' ms' : `~${((n / 10_000) ** 2 * ms(() => quad(10_000), 1)[0] / 1000).toFixed(0)} s (est.)`;
  console.log(`${pad(n.toLocaleString('en-US'), 11)} | ${pad(a, 10)} | ${pad(b, 16)} | ${pad(c, 12)}`);
}
console.log(`node ${process.version} · ${process.arch}`);
