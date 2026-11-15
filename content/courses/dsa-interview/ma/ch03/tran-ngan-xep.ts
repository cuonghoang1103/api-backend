// Stack overflow, on purpose: a RECURSIVE nesting-depth checker vs the same logic with an explicit counter/stack.
// Input: a string of n '(' followed by n ')' — perfectly valid, just deeply nested (an attacker can send this).

// #region dequy
function depthRec(s: string, i = 0, depth = 0): number {     // returns max depth, one call per character
  if (i === s.length) return depth === 0 ? 0 : -1;
  if (s[i] === '(') { const d = depthRec(s, i + 1, depth + 1); return d < 0 ? -1 : Math.max(d, depth + 1); }
  return depth === 0 ? -1 : depthRec(s, i + 1, depth - 1);
}
// #endregion

// #region lap
function depthIter(s: string): number {
  let depth = 0, max = 0;                                     // for ONE bracket type a counter is the whole stack
  for (const c of s) {
    if (c === '(') max = Math.max(max, ++depth);
    else if (--depth < 0) return -1;
  }
  return depth === 0 ? max : -1;
}
// #endregion

for (const n of [10, 1_000, 100_000]) {
  const s = '('.repeat(n) + ')'.repeat(n);
  let rec: string;
  try { rec = String(depthRec(s)); } catch (e) { rec = `${(e as Error).name}: ${(e as Error).message}`; }
  console.log(`n = ${n.toLocaleString('en-US')}  recursive -> ${rec}   iterative -> ${depthIter(s)}`);
}
