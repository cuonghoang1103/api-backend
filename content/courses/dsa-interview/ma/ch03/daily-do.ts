// @thoi-gian
// Measure Daily Temperatures: brute force O(n^2) vs monotonic stack O(n).
// Worst case for brute force: strictly DECREASING temperatures — nobody ever finds a warmer day, every inner loop runs to the end.
function brute(t: number[]): number[] {
  const ans = new Array(t.length).fill(0);
  for (let i = 0; i < t.length; i++)
    for (let j = i + 1; j < t.length; j++)
      if (t[j] > t[i]) { ans[i] = j - i; break; }
  return ans;
}
function mono(t: number[]): number[] {
  const ans = new Array(t.length).fill(0);
  const st: number[] = [];
  for (let i = 0; i < t.length; i++) {
    while (st.length && t[i] > t[st[st.length - 1]]) { const j = st.pop()!; ans[j] = i - j; }
    st.push(i);
  }
  return ans;
}
function ms(f: () => unknown, lap = 3): number {
  let best = Infinity;
  for (let k = 0; k < lap; k++) { const t = performance.now(); f(); best = Math.min(best, performance.now() - t); }
  return best;
}
const pad = (s: string | number, w: number) => String(s).padStart(w);
console.log(`${pad('n', 10)} | ${pad('brute O(n^2)', 14)} | ${pad('stack O(n)', 11)}`);
for (const n of [1_000, 10_000, 100_000, 1_000_000]) {
  const t = Array.from({ length: n }, (_, i) => n - i);   // decreasing
  const b = n <= 100_000 ? ms(() => brute(t), n === 100_000 ? 1 : 3).toFixed(1) + ' ms' : 'skipped';
  const s = ms(() => mono(t)).toFixed(2) + ' ms';
  console.log(`${pad(n.toLocaleString('en-US'), 10)} | ${pad(b, 14)} | ${pad(s, 11)}`);
}
console.log(`node ${process.version} · ${process.arch}`);
