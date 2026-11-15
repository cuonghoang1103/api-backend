// @java: HcLcs.java
// LC 1143 Longest Common Subsequence: table, reconstruction, two rows.

// #region bang
function longestCommonSubsequence(a: string, b: string): number {
  const n = a.length, m = b.length;
  // dp[i][j] = LCS length of the PREFIXES a[0..i) and b[0..j)  — row 0 / column 0 = empty prefix = 0
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;      // same last char: take it, both step back
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);            // drop the last char of a, or of b
    }
  }
  return dp[n][m];
}
// #endregion

// #region truy-vet
// Walk back from dp[n][m]: diagonal on a match, otherwise towards the larger neighbour.
function lcsString(a: string, b: string): string {
  const n = a.length, m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++)
    for (let j = 1; j <= m; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  const out: string[] = [];
  let i = n, j = m;
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) { out.push(a[i - 1]); i--; j--; }       // ↖ part of the answer
    else if (dp[i - 1][j] >= dp[i][j - 1]) i--;                       // ↑
    else j--;                                                        // ←
  }
  return out.reverse().join('');
}
// #endregion

// #region hai-hang
function lcsTwoRows(a: string, b: string): number {
  let prev = new Array(b.length + 1).fill(0), cur = new Array(b.length + 1).fill(0);
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++)
      cur[j] = a[i - 1] === b[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], cur[j - 1]);
    [prev, cur] = [cur, prev];                                         // swap, do not allocate
  }
  return prev[b.length];
}
// #endregion

for (const [a, b] of [['ABCBDA', 'BDCABA'], ['abcde', 'ace'], ['abc', 'def'], ['', 'abc'], ['dynamic', 'dynamo']]) {
  console.log(`lcs("${a}", "${b}") = ${longestCommonSubsequence(a, b)}  one answer = "${lcsString(a, b)}"  two-rows = ${lcsTwoRows(a, b)}`);
}
