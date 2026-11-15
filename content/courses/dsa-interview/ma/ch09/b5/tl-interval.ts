// @java: TlInterval.java
// LC 435 Non-overlapping Intervals = keep as many as possible, remove the rest.
// Three "obvious" greedy keys; only one is right. Touching ([1,2] and [2,3]) does NOT count as overlapping.

// #region lc435
function eraseOverlapIntervals(intervals: number[][]): number {
  const a = [...intervals].sort((p, q) => p[1] - q[1]);   // by END time
  let kept = 0, lastEnd = -Infinity;
  for (const [s, e] of a) {
    if (s >= lastEnd) { kept++; lastEnd = e; }             // fits after the last kept one: keep it
  }                                                          // otherwise: drop it (it ends later — sorted)
  return intervals.length - kept;
}
// #endregion

// #region sai
// Same loop, different sort key. by = 'start' | 'length'.
function eraseWrong(intervals: number[][], by: string): number {
  const a = [...intervals].sort((p, q) => by === 'start' ? p[0] - q[0] : (p[1] - p[0]) - (q[1] - q[0]));
  let kept = 0;
  const chosen: number[][] = [];
  for (const iv of a) {
    // a correct "fits" test for an arbitrary order: no overlap with ANY chosen interval
    if (chosen.every(([s, e]) => iv[1] <= s || iv[0] >= e)) { chosen.push(iv); kept++; }
  }
  return intervals.length - kept;
}
// #endregion

// Brute force: try every subset (n <= 8), keep the largest pairwise non-overlapping one.
function brute(iv: number[][]): number {
  const n = iv.length;
  let best = 0;
  for (let mask = 0; mask < (1 << n); mask++) {
    const pick = iv.filter((_, i) => mask & (1 << i)).sort((p, q) => p[0] - q[0]);
    let ok = true;
    for (let k = 1; k < pick.length; k++) if (pick[k][0] < pick[k - 1][1]) ok = false;
    if (ok) best = Math.max(best, pick.length);
  }
  return n - best;
}

const ex = [[1, 2], [2, 3], [3, 4], [1, 3]];
console.log(`${JSON.stringify(ex)} -> remove ${eraseOverlapIntervals(ex)}`);
const longFirst = [[1, 10], [2, 3], [4, 5], [6, 7]];
console.log(`${JSON.stringify(longFirst)}: by end ${eraseOverlapIntervals(longFirst)}, by start ${eraseWrong(longFirst, 'start')}, brute ${brute(longFirst)}`);
const shortMiddle = [[1, 5], [4, 7], [6, 10]];
console.log(`${JSON.stringify(shortMiddle)}: by end ${eraseOverlapIntervals(shortMiddle)}, by length ${eraseWrong(shortMiddle, 'length')}, brute ${brute(shortMiddle)}`);

let seed = 3;
const rnd = (m: number) => { seed = (seed * 48271) % 2147483647; return seed % m; };
const fails = { end: 0, start: 0, length: 0 };
for (let t = 0; t < 2000; t++) {
  const iv = Array.from({ length: 1 + rnd(8) }, () => { const s = rnd(12); return [s, s + 1 + rnd(6)]; });
  const b = brute(iv);
  if (eraseOverlapIntervals(iv) !== b) fails.end++;
  if (eraseWrong(iv, 'start') !== b) fails.start++;
  if (eraseWrong(iv, 'length') !== b) fails.length++;
}
console.log(`2000 random cases vs brute force -> wrong answers: by end ${fails.end}, by start ${fails.start}, by length ${fails.length}`);
