// @java: LuLps.java
// LC 516 Longest Palindromic Subsequence — interval DP by length, and the LCS(s, reverse(s)) shortcut.

// #region giai
function longestPalindromeSubseq(s: string): number {
  const n = s.length;
  const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0)); // dp[i][j] = answer for s[i..j]
  for (let i = n - 1; i >= 0; i--) {             // i goes DOWN so row i+1 is ready
    dp[i][i] = 1;                                // base: one char is a palindrome
    for (let j = i + 1; j < n; j++) {            // j goes UP so dp[i][j-1] is ready
      dp[i][j] = s[i] === s[j]
        ? dp[i + 1][j - 1] + 2                   // both ends join the palindrome (inside = 0 when j = i+1)
        : Math.max(dp[i + 1][j], dp[i][j - 1]);  // drop one end
    }
  }
  return dp[0][n - 1];
}
// #endregion

// #region lcs
function lcs(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  return dp[a.length][b.length];
}
const viaLcs = (s: string) => lcs(s, [...s].reverse().join(''));
// #endregion

for (const s of ['agbcba', 'banana', 'aabaa', 'abcd', 'a']) {
  console.log(`"${s}": interval DP = ${longestPalindromeSubseq(s)}   LCS(s, reverse) = ${viaLcs(s)}`);
}
// Brute force: every subset of positions (2^n), keep the longest palindrome.
function brute(s: string): number {
  let best = 0;
  for (let mask = 1; mask < 1 << s.length; mask++) {
    let t = '';
    for (let i = 0; i < s.length; i++) if (mask & (1 << i)) t += s[i];
    if (t === [...t].reverse().join('')) best = Math.max(best, t.length);
  }
  return best;
}
let seed = 20261115;
const rnd = (m: number) => { seed = (seed * 48271) % 2147483647; return seed % m; };
let bad = 0;
for (let t = 0; t < 1500; t++) {
  const s = Array.from({ length: 1 + rnd(10) }, () => 'abc'[rnd(3)]).join('');
  const d = longestPalindromeSubseq(s);
  if (d !== viaLcs(s) || d !== brute(s)) bad++;
}
console.log(`random self-test (interval DP = LCS trick = 2^n brute force): 1500 strings, ${bad} mismatches`);
