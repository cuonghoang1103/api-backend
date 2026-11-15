// Pitfall: "if (memo[n])" treats a stored 0 as "not computed yet".
// Ways to climb n steps using only 2-step and 4-step moves: every ODD n has 0 ways — so the memo is full of zeros.
let calls = 0;

// #region sai
function waysWrong(n: number, memo: number[]): number {
  calls++;
  if (n === 0) return 1;
  if (n < 0) return 0;
  if (memo[n]) return memo[n];                       // BUG: a stored 0 is falsy ⇒ recomputed every time
  return (memo[n] = waysWrong(n - 2, memo) + waysWrong(n - 4, memo));
}
// #endregion

// #region dung
function waysRight(n: number, memo: number[]): number {
  calls++;
  if (n === 0) return 1;
  if (n < 0) return 0;
  if (memo[n] !== undefined) return memo[n];         // "solved already?" is not the same question as "non-zero?"
  return (memo[n] = waysRight(n - 2, memo) + waysRight(n - 4, memo));
}
// #endregion

for (const n of [21, 41, 61, 60]) {
  calls = 0; const a = waysWrong(n, []); const cw = calls;
  calls = 0; const b = waysRight(n, []); const cr = calls;
  console.log(`n=${n}: answer ${a} / ${b}   calls: if (memo[n]) -> ${cw.toLocaleString('en-US')}   !== undefined -> ${cr}`);
}
