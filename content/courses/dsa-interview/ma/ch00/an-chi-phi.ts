// @thoi-gian
// Hidden O(n^2): a loop that looks linear, with an O(n) call inside.
// #region an
function dedupeIncludes(a: number[]): number[] {
  const out: number[] = [];
  for (const x of a) if (!out.includes(x)) out.push(x);   // includes() scans out: O(n) each time
  return out;
}
function dedupeSet(a: number[]): number[] {
  const seen = new Set<number>();
  const out: number[] = [];
  for (const x of a) if (!seen.has(x)) { seen.add(x); out.push(x); }   // O(1) average each time
  return out;
}
function drainShift(a: number[]): number { const q = a.slice(); let s = 0; while (q.length) s += q.shift()!; return s; }   // shift() moves every element
function drainIndex(a: number[]): number { let s = 0; for (let head = 0; head < a.length; head++) s += a[head]; return s; } // just move a pointer
// #endregion
function ms(f: () => unknown): number { let best = Infinity; for (let k = 0; k < 3; k++) { const t = performance.now(); f(); best = Math.min(best, performance.now() - t); } return best; }
const pad = (s: string, w: number) => s.padStart(w);
console.log(`${pad('n', 9)} | ${pad('includes', 10)} | ${pad('Set', 8)} | ${pad('shift()', 10)} | ${pad('head++', 8)}`);
for (const n of [1_000, 10_000, 50_000, 100_000]) {
  const a = Array.from({ length: n }, (_, i) => i);          // all distinct: worst case for includes
  console.log(`${pad(n.toLocaleString('en-US'), 9)} | ${pad(ms(() => dedupeIncludes(a)).toFixed(1) + ' ms', 10)} | ${pad(ms(() => dedupeSet(a)).toFixed(2) + ' ms', 8)} | ${pad(ms(() => drainShift(a)).toFixed(1) + ' ms', 10)} | ${pad(ms(() => drainIndex(a)).toFixed(2) + ' ms', 8)}`);
}
console.log(`node ${process.version} · ${process.arch}`);
