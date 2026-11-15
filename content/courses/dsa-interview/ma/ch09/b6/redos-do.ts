// @thoi-gian
// ReDoS, measured: a backtracking regex engine (V8 irregexp) vs the O(n·m) DP of LC 10, on inputs an attacker would send.
const best = (f: () => unknown, lap: number) => {
  let b = Infinity;
  for (let k = 0; k < lap; k++) { const t = performance.now(); f(); b = Math.min(b, performance.now() - t); }
  return b;
};
const pad = (s: string | number, w: number) => String(s).padStart(w);

// Part A — the textbook evil pattern: nested quantifier (a+)+ on "aaa…a!" (cannot match, so the engine tries EVERY split).
console.log('A) /^(a+)+$/.test("a".repeat(n) + "!")  — V8 backtracking engine');
let prev = 0;
for (let n = 18; n <= 27; n++) {
  const s = 'a'.repeat(n) + '!';
  const t = best(() => /^(a+)+$/.test(s), n <= 24 ? 3 : 1);
  console.log(`  n = ${pad(n, 2)}  ${pad(t.toFixed(1), 8)} ms${prev ? '   x' + (t / prev).toFixed(1) + ' vs n-1' : ''}`);
  prev = t;
}

// Part B — the same idea in LC 10 syntax: p = "a*a*a*a*a*a*a*a*b" on s = "aaa…a" (no b, so no match).
// #region naive
function naive(s: string, p: string, i: number, j: number, c: { n: number }): boolean {
  c.n++;
  if (j === p.length) return i === s.length;
  const first = i < s.length && (p[j] === '.' || p[j] === s[i]);
  if (j + 1 < p.length && p[j + 1] === '*') return naive(s, p, i, j + 2, c) || (first && naive(s, p, i + 1, j, c));
  return first && naive(s, p, i + 1, j + 1, c);
}
// #endregion
function isMatch(s: string, p: string): boolean {
  const n = s.length, m = p.length;
  const dp: boolean[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(false));
  dp[0][0] = true;
  for (let j = 2; j <= m; j++) if (p[j - 1] === '*') dp[0][j] = dp[0][j - 2];
  for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) {
    if (p[j - 1] === '*') dp[i][j] = dp[i][j - 2] || ((p[j - 2] === '.' || p[j - 2] === s[i - 1]) && dp[i - 1][j]);
    else dp[i][j] = (p[j - 1] === '.' || p[j - 1] === s[i - 1]) && dp[i - 1][j - 1];
  }
  return dp[n][m];
}
const P = 'a*'.repeat(8) + 'b';
console.log(`B) LC 10, p = "${P}", s = "a".repeat(n)`);
console.log(`  ${pad('n', 4)} | ${pad('naive calls', 12)} | ${pad('naive ms', 9)} | ${pad('DP cells', 8)} | ${pad('DP ms', 7)}`);
for (const n of [10, 15, 20, 25, 30]) {
  const s = 'a'.repeat(n);
  const c = { n: 0 };
  const r1 = naive(s, P, 0, 0, c);
  if (r1 !== isMatch(s, P)) throw new Error('naive and DP disagree');
  const tn = best(() => naive(s, P, 0, 0, { n: 0 }), n >= 25 ? 1 : 3);
  const td = best(() => isMatch(s, P), 5);
  console.log(`  ${pad(n, 4)} | ${pad(c.n.toLocaleString('en-US'), 12)} | ${pad(tn.toFixed(1), 9)} | ${pad((n + 1) * (P.length + 1), 8)} | ${pad(td.toFixed(3), 7)}`);
}
console.log(`node ${process.version} · ${process.arch}`);
