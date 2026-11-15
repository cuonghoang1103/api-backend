// @java: LuPerfectSquares.java
// LC 279 Perfect Squares — Coin Change in disguise: the "coins" are 1, 4, 9, 16, ... up to n.

// #region giai
function numSquares(n: number): number {
  const dp: number[] = new Array(n + 1).fill(n + 1);   // n + 1 = "impossible" (n ones always works)
  dp[0] = 0;                                           // base: 0 needs zero squares
  for (let i = 1; i <= n; i++) {                       // order: small amounts first
    for (let s = 1; s * s <= i; s++) {                 // last square used = s*s
      dp[i] = Math.min(dp[i], dp[i - s * s] + 1);
    }
  }
  return dp[n];
}
// #endregion

// #region tham
// Greedy "take the biggest square that fits" — looks right, is not.
function greedySquares(n: number): number {
  let k = 0;
  while (n > 0) { const s = Math.floor(Math.sqrt(n)); n -= s * s; k++; }
  return k;
}
// #endregion

for (const n of [12, 13, 1, 43, 7, 10000]) console.log(`numSquares(${n}) = ${numSquares(n)}   greedy = ${greedySquares(n)}`);

// Self-test with number theory (Legendre): n needs 4 squares  <=>  n = 4^a * (8b + 7).
const N = 10000;
const dpAll: number[] = new Array(N + 1).fill(N + 1); dpAll[0] = 0;
for (let i = 1; i <= N; i++) for (let s = 1; s * s <= i; s++) dpAll[i] = Math.min(dpAll[i], dpAll[i - s * s] + 1);
let bad = 0, four = 0, greedyWrong = 0;
for (let n = 1; n <= N; n++) {
  let m = n; while (m % 4 === 0) m /= 4;
  const legendre = m % 8 === 7;
  if (dpAll[n] === 4) four++;
  if ((dpAll[n] === 4) !== legendre || dpAll[n] > 4) bad++;
  if (greedySquares(n) !== dpAll[n]) greedyWrong++;
}
console.log(`n = 1..${N}: ${four} numbers need 4 squares, ${bad} disagree with Legendre, greedy wrong on ${greedyWrong}`);
