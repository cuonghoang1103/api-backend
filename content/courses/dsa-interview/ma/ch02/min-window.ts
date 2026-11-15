// @java: MinWindow.java
// LC 76 · Minimum Window Substring — counts of what we still NEED, and how many characters are still missing.

// #region window
function minWindow(s: string, t: string): string {
  const need = new Array(128).fill(0);
  for (const c of t) need[c.charCodeAt(0)]++;
  let missing = t.length;                  // characters of t not yet covered by the window
  let l = 0, bestL = 0, bestLen = Infinity;
  for (let r = 0; r < s.length; r++) {
    const c = s.charCodeAt(r);
    if (need[c] > 0) missing--;            // this character was still needed
    need[c]--;                             // negative = the window has a surplus of c
    while (missing === 0) {                // window covers t: record, then try to shrink
      if (r - l + 1 < bestLen) { bestLen = r - l + 1; bestL = l; }
      const d = s.charCodeAt(l);
      need[d]++;
      if (need[d] > 0) missing++;          // we just gave away a character we needed
      l++;
    }
  }
  return bestLen === Infinity ? '' : s.slice(bestL, bestL + bestLen);
}
// #endregion

for (const [s, t] of [['ADOBECODEBANC', 'ABC'], ['a', 'a'], ['a', 'aa'], ['aaflslflsldkalskaaa', 'aaa']]) {
  console.log(`minWindow(${JSON.stringify(s)}, ${JSON.stringify(t)}) = ${JSON.stringify(minWindow(s, t))}`);
}
