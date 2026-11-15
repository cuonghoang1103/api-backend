// @thoi-gian
// Measure Two Sum II (sorted input): brute O(n^2) vs binary search O(n log n) vs two pointers O(n).
// Worst case for all three: nums = 0..n-1 and the only pair is the last two numbers.
function brute(a: number[], t: number): number[] {
  for (let i = 0; i < a.length; i++)
    for (let j = i + 1; j < a.length; j++)
      if (a[i] + a[j] === t) return [i + 1, j + 1];
  return [];
}
function binary(a: number[], t: number): number[] {
  for (let i = 0; i < a.length; i++) {
    const need = t - a[i];
    let lo = i + 1, hi = a.length - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (a[mid] === need) return [i + 1, mid + 1];
      if (a[mid] < need) lo = mid + 1; else hi = mid - 1;
    }
  }
  return [];
}
function two(a: number[], t: number): number[] {
  let l = 0, r = a.length - 1;
  while (l < r) {
    const s = a[l] + a[r];
    if (s === t) return [l + 1, r + 1];
    if (s < t) l++; else r--;
  }
  return [];
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
console.log(`${pad('n', 10)} | ${pad('brute O(n^2)', 14)} | ${pad('binary O(n log n)', 18)} | ${pad('two ptr O(n)', 13)}`);
for (const n of [1_000, 10_000, 100_000, 1_000_000]) {
  const a = Array.from({ length: n }, (_, i) => i);
  const t = (n - 2) + (n - 1);
  const b = n <= 100_000 ? ms(() => brute(a, t), n === 100_000 ? 1 : 3).toFixed(1) + ' ms' : 'skipped';
  const s = ms(() => binary(a, t)).toFixed(2) + ' ms';
  const p = ms(() => two(a, t), 5).toFixed(2) + ' ms';
  console.log(`${pad(n.toLocaleString('en-US'), 10)} | ${pad(b, 14)} | ${pad(s, 18)} | ${pad(p, 13)}`);
}
console.log(`node ${process.version} · ${process.arch}`);
