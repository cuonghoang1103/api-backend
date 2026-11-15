// @thoi-gian
// The promise of lesson 0.1, kept: naive recursive Fibonacci vs the three DP versions, n = 10 … 45.
// Calls are COUNTED (exact). Time = best of several laps (naive n >= 40: one lap, it is slow on purpose).
let calls = 0;
function naive(n: number): number { calls++; return n < 2 ? n : naive(n - 1) + naive(n - 2); }

function memoFib(n: number, memo: number[]): number {
  calls++;
  if (n < 2) return n;
  if (memo[n] !== undefined) return memo[n];          // already solved: answer from the notebook
  return (memo[n] = memoFib(n - 1, memo) + memoFib(n - 2, memo));
}
function table(n: number): number {
  const dp = new Array<number>(n + 1).fill(0);
  if (n >= 1) dp[1] = 1;
  for (let i = 2; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];
  return dp[n];
}
function twoVars(n: number): number {
  let a = 0, b = 1;                                    // a = fib(i), b = fib(i + 1)
  for (let i = 0; i < n; i++) [a, b] = [b, a + b];
  return a;
}

function best(f: () => void, lap: number): number {
  let b = Infinity;
  for (let k = 0; k < lap; k++) { const t = performance.now(); f(); b = Math.min(b, performance.now() - t); }
  return b;
}
const REP = 10_000;                                    // fast versions: time REP runs, report per run in µs
const perRunUs = (f: () => void) => (best(() => { for (let r = 0; r < REP; r++) f(); }, 5) * 1000) / REP;
const pad = (s: string | number, w: number) => String(s).padStart(w);
const fmt = (x: number) => x.toLocaleString('en-US');

console.log(`${pad('n', 3)} | ${pad('fib(n)', 13)} | ${pad('naive calls', 13)} | ${pad('naive', 10)} | ${pad('memo calls', 10)} | ${pad('memo', 8)} | ${pad('table', 8)} | ${pad('2 vars', 8)}`);
let sink = 0;
for (const n of [10, 20, 25, 30, 35, 40, 45]) {
  let v = 0;
  const tn = best(() => { calls = 0; v = naive(n); }, n >= 40 ? 1 : 3);   // the timed run is also the counted run
  const nc = calls;
  calls = 0; const vm = memoFib(n, []); const mc = calls;
  if (vm !== v || table(n) !== v || twoVars(n) !== v) throw new Error('versions disagree at n=' + n);
  const tm = perRunUs(() => { sink += memoFib(n, []); });
  const tt = perRunUs(() => { sink += table(n); });
  const t2 = perRunUs(() => { sink += twoVars(n); });
  console.log(`${pad(n, 3)} | ${pad(fmt(v), 13)} | ${pad(fmt(nc), 13)} | ${pad(tn.toFixed(1) + ' ms', 10)} | ${pad(mc, 10)} | ${pad(tm.toFixed(2) + ' µs', 8)} | ${pad(tt.toFixed(2) + ' µs', 8)} | ${pad(t2.toFixed(2) + ' µs', 8)}`);
}
console.log(`(sink ${sink > 0 ? 'ok' : '?'}) node ${process.version} · ${process.arch}`);
