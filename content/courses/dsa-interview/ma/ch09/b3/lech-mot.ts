// Off-by-one in a 2D DP: the table is (n+1)×(m+1) but the strings are 0-based.
// #region sai
function lcsOffByOne(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = a[i] === b[j] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]); // a[i], should be a[i - 1]
  return dp[a.length][b.length];
}
// #endregion
for (const [a, b] of [['abcde', 'ace'], ['abc', 'def'], ['xa', 'ya']]) {
  console.log(`lcsOffByOne("${a}", "${b}") = ${lcsOffByOne(a, b)}`);
}
console.log(`why: "abc"[3] = ${"abc"[3]}, "def"[3] = ${"def"[3]}, and undefined === undefined is ${undefined === undefined}`);
