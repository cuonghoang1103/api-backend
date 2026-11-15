// @thoi-gian
// Word Break on an attacker-chosen input: s = "aaa...a" + "b", dictionary [a, aa, aaa].
// The answer is always false (nothing ends with "b"), so plain recursion tries EVERY way to cut the a's.
const DICT = ['a', 'aa', 'aaa'];
let calls = 0;

// #region ngay-tho
function canBreakNaive(s: string, i: number): boolean {     // no memory: the same i is solved again and again
  calls++;
  if (i === s.length) return true;
  for (const w of DICT) if (s.startsWith(w, i) && canBreakNaive(s, i + w.length)) return true;
  return false;
}
// #endregion

// #region nho
function canBreakMemo(s: string, i: number, memo: Int8Array): boolean {   // memo[i]: 0 unknown, 1 yes, 2 no
  calls++;
  if (i === s.length) return true;
  if (memo[i]) return memo[i] === 1;
  let ok = false;
  for (const w of DICT) if (s.startsWith(w, i) && canBreakMemo(s, i + w.length, memo)) { ok = true; break; }
  memo[i] = ok ? 1 : 2;
  return ok;
}
// #endregion

const pad = (x: string | number, w: number) => String(x).padStart(w);
console.log(`${pad('n', 3)} | ${pad('naive calls', 13)} | ${pad('naive ms', 9)} | ${pad('memo calls', 10)} | ${pad('memo ms', 8)}`);
for (const n of [10, 14, 18, 22, 26, 28, 30]) {
  const s = 'a'.repeat(n) + 'b';
  calls = 0;
  let t = performance.now();
  const r1 = canBreakNaive(s, 0);
  const tn = performance.now() - t;
  const cn = calls;
  calls = 0;
  t = performance.now();
  const r2 = canBreakMemo(s, 0, new Int8Array(s.length + 1));
  const tm = performance.now() - t;
  if (r1 !== r2) throw new Error('disagree');
  console.log(`${pad(n, 3)} | ${pad(cn.toLocaleString('en-US'), 13)} | ${pad(tn.toFixed(1), 9)} | ${pad(calls, 10)} | ${pad(tm.toFixed(3), 8)}`);
}
console.log(`node ${process.version} · ${process.arch}`);
