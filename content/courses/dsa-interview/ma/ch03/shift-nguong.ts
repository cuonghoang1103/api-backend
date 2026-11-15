// @thoi-gian
// Where does V8's cheap shift() stop? Fill an array with n numbers, then empty it with shift(). Best of 3 runs.
function drain(n: number): number {
  const q: number[] = [];
  for (let i = 0; i < n; i++) q.push(i);
  let s = 0;
  while (q.length) s += q.shift()!;
  return s;
}
function ms(f: () => unknown, lap = 3): number {
  let best = Infinity;
  for (let k = 0; k < lap; k++) { const t = performance.now(); f(); best = Math.min(best, performance.now() - t); }
  return best;
}
for (const n of [4_000, 8_000, 12_000, 16_000, 20_000, 40_000]) {
  const t = ms(() => drain(n));
  console.log(`${String(n.toLocaleString('en-US')).padStart(7)} elements: ${t.toFixed(2).padStart(7)} ms total, ${(t * 1e6 / n).toFixed(0).padStart(5)} ns per shift()`);
}
console.log(`node ${process.version} · ${process.arch}`);
