// @thoi-gian
// Combination Sum: how many calls does sort + break save? Same answers, three ways of rejecting "too big".
//  A. no sort, reject on entry   : call bt(), then `if (remain < 0) return`
//  B. sorted, `continue`          : reject before calling, but keep scanning the (bigger) rest
//  C. sorted, `break`             : reject before calling and stop the loop
function run(cands: number[], target: number, mode: 'A' | 'B' | 'C'): [number, number, number] {
  const a = mode === 'A' ? cands : [...cands].sort((x, y) => x - y);
  let calls = 0, checks = 0, answers = 0;
  const bt = (start: number, remain: number): void => {
    calls++;
    if (remain < 0) return;
    if (remain === 0) { answers++; return; }
    for (let i = start; i < a.length; i++) {
      checks++;
      if (mode !== 'A' && a[i] > remain) { if (mode === 'C') break; continue; }
      bt(i, remain - a[i]);
    }
  };
  bt(0, target);
  return [answers, calls, checks];
}
function ms(f: () => unknown, lap = 3): number {
  let best = Infinity;
  for (let k = 0; k < lap; k++) { const t = performance.now(); f(); best = Math.min(best, performance.now() - t); }
  return best;
}
// Candidates 40, 39, …, 3 (unsorted on purpose: big first), target T.
const cands = Array.from({ length: 38 }, (_, i) => 40 - i);
console.log('candidates = 40, 39, ..., 3 (38 numbers)');
console.log('  T | answers |  mode | calls (nodes) | loop checks |      time');
for (const T of [40, 60, 80]) {
  for (const mode of ['A', 'B', 'C'] as const) {
    const [ans, calls, checks] = run(cands, T, mode);
    const t = ms(() => run(cands, T, mode), T >= 80 ? 1 : 3);
    console.log(`${String(T).padStart(3)} | ${String(ans).padStart(7)} | ${mode.padStart(5)} | ${calls.toLocaleString('en-US').padStart(13)} | ${checks.toLocaleString('en-US').padStart(11)} | ${t.toFixed(1).padStart(6)} ms`);
  }
}
console.log(`node ${process.version} · ${process.arch}`);
