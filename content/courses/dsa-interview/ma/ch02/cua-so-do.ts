// @thoi-gian
// Measure LC 209 (shortest subarray with sum >= target, positive numbers): brute O(n^2) vs sliding window O(n).
// Worst case: all ones, target = n / 2  => every start has to scan about n / 2 numbers.
function brute(target: number, a: number[]): number {
  let best = Infinity;
  for (let i = 0; i < a.length; i++) {
    let s = 0;
    for (let j = i; j < a.length; j++) {
      s += a[j];
      if (s >= target) { best = Math.min(best, j - i + 1); break; }
    }
  }
  return best === Infinity ? 0 : best;
}
function windowLen(target: number, a: number[]): number {
  let l = 0, s = 0, best = Infinity;
  for (let r = 0; r < a.length; r++) {
    s += a[r];
    while (s >= target) { best = Math.min(best, r - l + 1); s -= a[l++]; }
  }
  return best === Infinity ? 0 : best;
}
function ms(f: () => unknown, lap = 3): number {
  let best = Infinity;
  for (let k = 0; k < lap; k++) {
    const t = performance.now();
    f();
    best = Math.min(best, performance.now() - t);
  }
  return best;
}
const pad = (s: string | number, w: number) => String(s).padStart(w);
console.log(`${pad('n', 10)} | ${pad('brute O(n^2)', 14)} | ${pad('window O(n)', 12)} | answer`);
for (const n of [1_000, 10_000, 100_000, 1_000_000]) {
  const a = new Array(n).fill(1);
  const target = n / 2;
  const b = n <= 100_000 ? ms(() => brute(target, a), n === 100_000 ? 1 : 3).toFixed(1) + ' ms' : 'skipped';
  const w = ms(() => windowLen(target, a), 5).toFixed(2) + ' ms';
  console.log(`${pad(n.toLocaleString('en-US'), 10)} | ${pad(b, 14)} | ${pad(w, 12)} | ${windowLen(target, a)}`);
}
console.log(`node ${process.version} · ${process.arch}`);
