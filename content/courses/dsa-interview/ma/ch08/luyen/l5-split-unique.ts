// @java: L5SplitUnique.java
// LC 1593 · Split a String Into the Max Number of Unique Substrings — partition + a Set + a bound.

// #region giai
function maxUniqueSplit(s: string): number {
  const seen = new Set<string>();
  let best = 0;
  function bt(start: number): void {
    if (seen.size + (s.length - start) <= best) return;   // bound: even 1 char per piece cannot beat best
    if (start === s.length) { best = seen.size; return; }
    for (let end = start + 1; end <= s.length; end++) {
      const piece = s.slice(start, end);
      if (seen.has(piece)) continue;                       // pieces must be distinct
      seen.add(piece);
      bt(end);
      seen.delete(piece);
    }
  }
  bt(0);
  return best;
}
// #endregion

let calls = 0;
function noBound(s: string): number {
  const seen = new Set<string>(); let best = 0;
  const bt = (start: number): void => {
    calls++;
    if (start === s.length) { best = Math.max(best, seen.size); return; }
    for (let end = start + 1; end <= s.length; end++) {
      const p = s.slice(start, end);
      if (seen.has(p)) continue;
      seen.add(p); bt(end); seen.delete(p);
    }
  };
  bt(0); return best;
}
let callsB = 0;
function withBound(s: string): number {
  const seen = new Set<string>(); let best = 0;
  const bt = (start: number): void => {
    callsB++;
    if (seen.size + (s.length - start) <= best) return;
    if (start === s.length) { best = seen.size; return; }
    for (let end = start + 1; end <= s.length; end++) {
      const p = s.slice(start, end);
      if (seen.has(p)) continue;
      seen.add(p); bt(end); seen.delete(p);
    }
  };
  bt(0); return best;
}

for (const s of ['ababccc', 'aba', 'aa', 'wwwzfvedwfvhsww']) console.log('"' + s + '" -> ' + maxUniqueSplit(s));
const big = 'abcdefghijklmnop';
calls = 0; callsB = 0;
console.log('"' + big + '": answer ' + noBound(big) + ' | calls without bound = ' + calls + ' | with bound = ' + (withBound(big), callsB));
