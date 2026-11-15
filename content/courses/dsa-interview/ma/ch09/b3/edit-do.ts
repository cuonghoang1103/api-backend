// @thoi-gian
// Edit distance three ways: plain recursion (no memory) vs memo (top-down) vs table (bottom-up).
// Plain recursion is run on the WORST case (the two words share no letter, so every call branches three ways).
let calls = 0;
function plain(a: string, b: string, i: number, j: number): number {   // edits for a[0..i) -> b[0..j)
  calls++;
  if (i === 0) return j;
  if (j === 0) return i;
  if (a[i - 1] === b[j - 1]) return plain(a, b, i - 1, j - 1);
  return 1 + Math.min(plain(a, b, i - 1, j - 1), plain(a, b, i - 1, j), plain(a, b, i, j - 1));
}
function memo(a: string, b: string): number {
  const m: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(-1));
  const go = (i: number, j: number): number => {
    if (i === 0) return j;
    if (j === 0) return i;
    if (m[i][j] >= 0) return m[i][j];
    const r = a[i - 1] === b[j - 1] ? go(i - 1, j - 1) : 1 + Math.min(go(i - 1, j - 1), go(i - 1, j), go(i, j - 1));
    return (m[i][j] = r);
  };
  return go(a.length, b.length);
}
function table(a: string, b: string): number {
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j), cur = new Array(b.length + 1).fill(0);
  for (let i = 1; i <= a.length; i++) {
    cur[0] = i;
    for (let j = 1; j <= b.length; j++)
      cur[j] = a[i - 1] === b[j - 1] ? prev[j - 1] : 1 + Math.min(prev[j - 1], prev[j], cur[j - 1]);
    [prev, cur] = [cur, prev];
  }
  return prev[b.length];
}
function best(f: () => void, lap: number): number {
  let t = Infinity;
  for (let k = 0; k < lap; k++) { const s = performance.now(); f(); t = Math.min(t, performance.now() - s); }
  return t;
}
let seed = 20261115;
const rnd = (m: number) => { seed = (seed * 48271) % 2147483647; return seed % m; };
const word = (n: number, alpha: string) => Array.from({ length: n }, () => alpha[rnd(alpha.length)]).join('');
const pad = (s: string | number, w: number) => String(s).padStart(w);

console.log('Worst case for plain recursion: a uses letters "abcd", b uses "wxyz" (no common letter). Length n = |a| = |b|.');
console.log(`${pad('n', 3)} | ${pad('plain calls', 15)} | ${pad('plain', 11)} | ${pad('memo', 9)} | ${pad('table', 9)} | answer`);
const counted: number[] = [];
for (let n = 6; n <= 13; n++) {
  const a = word(n, 'abcd'), b = word(n, 'wxyz');
  calls = 0;
  const r1 = plain(a, b, n, n);
  counted.push(calls);
  const tp = best(() => plain(a, b, n, n), n >= 12 ? 1 : 3);
  const r2 = memo(a, b), r3 = table(a, b);
  if (r1 !== r2 || r2 !== r3) throw new Error('disagree');
  const tm = best(() => memo(a, b), 5), tt = best(() => table(a, b), 5);
  console.log(`${pad(n, 3)} | ${pad(counted[counted.length - 1].toLocaleString('en-US'), 15)} | ${pad(tp.toFixed(1) + ' ms', 11)} | ${pad(tm.toFixed(3) + ' ms', 9)} | ${pad(tt.toFixed(3) + ' ms', 9)} | ${r3}`);
}
// The exact call count for n = 14 from the same recurrence the recursion follows (not run: too slow).
const C: number[][] = Array.from({ length: 15 }, () => new Array(15).fill(0));
for (let i = 0; i <= 14; i++) for (let j = 0; j <= 14; j++) C[i][j] = i === 0 || j === 0 ? 1 : 1 + C[i - 1][j] + C[i][j - 1] + C[i - 1][j - 1];
console.log(` 14 | ${pad(C[14][14].toLocaleString('en-US'), 15)} | not run (×${(C[14][14] / C[13][13]).toFixed(1)} the calls of n = 13)`);
console.log(`counted calls match the recurrence for n = 6..13: ${counted.every((c, k) => c === C[k + 6][k + 6])}`);

console.log('Random words over "acgt" (like DNA), table only (memo shown while recursion depth allows):');
for (const n of [100, 1_000, 2_000, 5_000]) {
  const a = word(n, 'acgt'), b = word(n, 'acgt');
  const tt = best(() => table(a, b), n >= 2000 ? 2 : 5);
  let tm = '';
  try { tm = best(() => memo(a, b), 2).toFixed(1) + ' ms'; } catch (e) { tm = (e as Error).constructor.name; }
  console.log(`n = ${pad(n.toLocaleString('en-US'), 5)}  cells = ${pad((n * n).toLocaleString('en-US'), 10)}  table ${pad(tt.toFixed(1) + ' ms', 9)}  memo ${tm}  answer = ${table(a, b)}`);
}
console.log(`node ${process.version} · ${process.arch}`);
