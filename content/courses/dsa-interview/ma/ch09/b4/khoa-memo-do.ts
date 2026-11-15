// @thoi-gian
// Same memoised LCS (two random strings of length L), four ways to store the memo:
// string key "i,j" in a Map · numeric key i*(m+1)+j in a Map · flat Int32Array · bottom-up table (no recursion).
function rand(L: number, seed: number): string {
  let s = seed, out = '';
  for (let k = 0; k < L; k++) { s = (s * 48271) % 2147483647; out += 'ACGT'[s % 4]; }
  return out;
}
function lcsStringKey(a: string, b: string): number {
  const memo = new Map<string, number>();
  const f = (i: number, j: number): number => {
    if (i === a.length || j === b.length) return 0;
    const k = `${i},${j}`;                                   // builds a new string on EVERY call
    const hit = memo.get(k);
    if (hit !== undefined) return hit;
    const v = a[i] === b[j] ? 1 + f(i + 1, j + 1) : Math.max(f(i + 1, j), f(i, j + 1));
    memo.set(k, v);
    return v;
  };
  return f(0, 0);
}
function lcsNumberKey(a: string, b: string): number {
  const W = b.length + 1, memo = new Map<number, number>();
  const f = (i: number, j: number): number => {
    if (i === a.length || j === b.length) return 0;
    const k = i * W + j;                                     // one multiplication, no allocation
    const hit = memo.get(k);
    if (hit !== undefined) return hit;
    const v = a[i] === b[j] ? 1 + f(i + 1, j + 1) : Math.max(f(i + 1, j), f(i, j + 1));
    memo.set(k, v);
    return v;
  };
  return f(0, 0);
}
function lcsArray(a: string, b: string): number {
  const W = b.length + 1, memo = new Int32Array((a.length + 1) * W).fill(-1);
  const f = (i: number, j: number): number => {
    if (i === a.length || j === b.length) return 0;
    const k = i * W + j;
    if (memo[k] !== -1) return memo[k];                      // −1 = not solved (an LCS length is never −1)
    const v = a[i] === b[j] ? 1 + f(i + 1, j + 1) : Math.max(f(i + 1, j), f(i, j + 1));
    return (memo[k] = v);
  };
  return f(0, 0);
}
function lcsTable(a: string, b: string): number {
  const n = a.length, m = b.length;
  let next = new Int32Array(m + 1), cur = new Int32Array(m + 1);
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) cur[j] = a[i] === b[j] ? 1 + next[j + 1] : Math.max(next[j], cur[j + 1]);
    [next, cur] = [cur, next];
  }
  return next[0];
}
function best(f: () => number, lap: number): [number, number] {
  let t = Infinity, v = 0;
  for (let k = 0; k < lap; k++) { const s = performance.now(); v = f(); t = Math.min(t, performance.now() - s); }
  return [t, v];
}
const pad = (s: string | number, w: number) => String(s).padStart(w);
console.log(`${pad('L', 5)} | ${pad('states', 9)} | ${pad('Map<string>', 12)} | ${pad('Map<number>', 12)} | ${pad('Int32Array', 11)} | ${pad('table', 9)} | LCS`);
for (const L of [250, 500, 1000]) {
  const a = rand(L, 7), b = rand(L, 11);
  const r = [best(() => lcsStringKey(a, b), 3), best(() => lcsNumberKey(a, b), 3), best(() => lcsArray(a, b), 3), best(() => lcsTable(a, b), 3)];
  if (new Set(r.map((x) => x[1])).size !== 1) throw new Error('versions disagree');
  console.log(`${pad(L, 5)} | ${pad(((L + 1) ** 2).toLocaleString('en-US'), 9)} | ${r.map((x, i) => pad(x[0].toFixed(1) + ' ms', [12, 12, 11, 9][i])).join(' | ')} | ${r[0][1]}`);
}
console.log(`node ${process.version} · ${process.arch}`);
