// @java: PhuDe.java
// "Which subtitle line is on screen at second s?" = the LAST cue with start <= s
// = (first cue with start > s) - 1  = upperBound - 1. Same template, no new loop to memorise.
const starts = [0, 2.5, 6, 9.2, 15, 15, 21.4];   // cue start times in seconds (sorted; two cues may share a start)

// #region cue
function cueAt(starts: number[], s: number): number {
  let lo = 0, hi = starts.length;
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (starts[mid] > s) hi = mid; else lo = mid + 1;   // ok(i) = starts[i] > s
  }
  return lo - 1;                                         // -1 = before the first cue
}
// #endregion

function slow(starts: number[], s: number): number {
  let r = -1;
  for (let i = 0; i < starts.length; i++) if (starts[i] <= s) r = i;
  return r;
}
const qs = [-1, 0, 2.4, 2.5, 7, 15, 20, 99];
console.log(`starts = ${JSON.stringify(starts)}`);
console.log(`cueAt  = ${JSON.stringify(qs.map((s) => cueAt(starts, s)))}  for s = ${JSON.stringify(qs)}`);
console.log(`slow   = ${JSON.stringify(qs.map((s) => slow(starts, s)))}`);
