// @java: Alien.java
// LC 269 · Alien Dictionary (Premium) — free twin: LintCode 892, which asks for the SMALLEST order in normal
// alphabetical order when several are valid ⇒ Kahn with a min-priority queue instead of a FIFO queue.

// #region giai
function alienOrder(words: string[]): string {
  const letters = [...new Set(words.join(''))].sort();
  const out = new Map<string, Set<string>>(letters.map((c) => [c, new Set<string>()]));
  const indeg = new Map<string, number>(letters.map((c) => [c, 0]));
  for (let i = 0; i + 1 < words.length; i++) {
    const a = words[i], b = words[i + 1];
    let j = 0;
    while (j < a.length && j < b.length && a[j] === b[j]) j++;
    if (j === Math.min(a.length, b.length)) {
      if (a.length > b.length) return '';                 // "abc" before "ab": impossible in ANY alphabet
      continue;                                           // a prefix: no information
    }
    if (!out.get(a[j])!.has(b[j])) { out.get(a[j])!.add(b[j]); indeg.set(b[j], indeg.get(b[j])! + 1); }   // only the FIRST difference counts
  }
  const ready = letters.filter((c) => indeg.get(c) === 0);   // kept sorted = a tiny priority queue
  let order = '';
  while (ready.length > 0) {
    const u = ready.shift()!;                              // smallest available letter (≤ 26 letters: shift is fine)
    order += u;
    for (const v of out.get(u)!) {
      indeg.set(v, indeg.get(v)! - 1);
      if (indeg.get(v) === 0) { ready.push(v); ready.sort(); }
    }
  }
  return order.length === letters.length ? order : '';   // a cycle ⇒ no valid alphabet
}
// #endregion

console.log(JSON.stringify(alienOrder(['wrt', 'wrf', 'er', 'ett', 'rftt'])));
console.log(JSON.stringify(alienOrder(['z', 'x'])));
console.log(JSON.stringify(alienOrder(['z', 'x', 'z'])));
console.log(JSON.stringify(alienOrder(['abc', 'ab'])));
