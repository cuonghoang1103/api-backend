// @java: PvCards.java
// LC 1423 · Maximum Points You Can Obtain from Cards — take exactly k cards, each from the left or the right end.
// Brute force (try both ends recursively) is O(2^k). Key observation: whatever you take, you take i cards from the
// left and k - i from the right ⇒ only k + 1 possibilities ⇒ slide one card from the left end to the right end, O(k).
// Equivalent view: the cards you LEAVE form one contiguous window of n - k cards ⇒ minimise that window's sum.

// #region vet-can
function maxScoreBrute(cards: number[], k: number): number {
  const go = (l: number, r: number, left: number): number => {
    if (left === 0) return 0;
    return Math.max(cards[l] + go(l + 1, r, left - 1), cards[r] + go(l, r - 1, left - 1));
  };
  return go(0, cards.length - 1, k);
}
// #endregion

// #region truot
function maxScore(cards: number[], k: number): number {
  const n = cards.length;
  let sum = 0;
  for (let i = 0; i < k; i++) sum += cards[i];   // start: all k cards from the left
  let best = sum;
  for (let i = 1; i <= k; i++) {                 // move one card at a time from the left end to the right end
    sum += cards[n - i] - cards[k - i];
    best = Math.max(best, sum);
  }
  return best;
}
// #endregion

// #region cua-so-bo-lai
function maxScoreWindow(cards: number[], k: number): number {
  const n = cards.length, w = n - k;            // the window of cards we leave behind
  let total = 0;
  for (const c of cards) total += c;
  if (w === 0) return total;
  let win = 0;
  for (let i = 0; i < w; i++) win += cards[i];
  let minWin = win;
  for (let i = w; i < n; i++) {
    win += cards[i] - cards[i - w];
    minWin = Math.min(minWin, win);
  }
  return total - minWin;
}
// #endregion

// #region tham-lam-sai
function maxScoreGreedyWrong(cards: number[], k: number): number {
  let l = 0, r = cards.length - 1, s = 0;
  for (let t = 0; t < k; t++) s += cards[l] >= cards[r] ? cards[l++] : cards[r--];   // always take the bigger end
  return s;
}
// #endregion

const cases: [number[], number][] = [
  [[1, 2, 3, 4, 5, 6, 1], 3],
  [[2, 2, 2], 2],
  [[9, 7, 7, 9, 7, 7, 9], 7],
  [[1, 1000, 1], 1],
  [[1, 79, 80, 1, 1, 1, 200, 1], 3],
  [[5], 1],
  [[1, 100, 1, 1, 1, 2], 2],
];
for (const [c, k] of cases) {
  console.log(`${JSON.stringify(c)} k=${k} -> slide=${maxScore(c, k)} window=${maxScoreWindow(c, k)} brute=${maxScoreBrute(c, k)} greedy=${maxScoreGreedyWrong(c, k)}`);
}
// random cross-check against brute force (deterministic LCG so TS and Java see the same inputs)
let seed = 12345;
const rnd = (m: number) => { seed = (Math.imul(seed, 1103515245) + 12345) >>> 0; return (seed >>> 8) % m; };
let ok = 0, greedyWrong = 0;
for (let t = 0; t < 300; t++) {
  const n = 1 + rnd(12);
  const c = Array.from({ length: n }, () => 1 + rnd(50));
  const k = 1 + rnd(n);
  const b = maxScoreBrute(c, k);
  if (maxScore(c, k) === b && maxScoreWindow(c, k) === b) ok++;
  if (maxScoreGreedyWrong(c, k) !== b) greedyWrong++;
}
console.log(`random: ${ok}/300 match brute force; greedy wrong on ${greedyWrong}/300`);
