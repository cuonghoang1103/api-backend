// @java: HcEditDistance.java
// LC 72 Edit Distance: table, the list of edits (follow-up), two rows.

// #region bang
function minDistance(a: string, b: string): number {
  const n = a.length, m = b.length;
  // dp[i][j] = fewest edits turning a[0..i) into b[0..j)
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = 0; i <= n; i++) dp[i][0] = i;           // delete all i chars
  for (let j = 0; j <= m; j++) dp[0][j] = j;           // insert all j chars
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];       // last chars equal: free
      else dp[i][j] = 1 + Math.min(
        dp[i - 1][j - 1],                                          // replace a[i-1] by b[j-1]   ↖
        dp[i - 1][j],                                              // delete a[i-1]              ↑
        dp[i][j - 1],                                              // insert b[j-1]              ←
      );
    }
  }
  return dp[n][m];
}
// #endregion

// #region cac-phep
// Follow-up: "return the edits, not just the count" — walk back from dp[n][m].
function editScript(a: string, b: string): string[] {
  const n = a.length, m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, (_, i) => Array.from({ length: m + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  for (let i = 1; i <= n; i++)
    for (let j = 1; j <= m; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
  const ops: string[] = [];
  let i = n, j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) { i--; j--; }
    else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) { ops.push(`replace ${a[i - 1]}->${b[j - 1]} at ${i - 1}`); i--; j--; }
    else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) { ops.push(`delete ${a[i - 1]} at ${i - 1}`); i--; }
    else { ops.push(`insert ${b[j - 1]} at ${i}`); j--; }
  }
  return ops.reverse();
}
// #endregion

// #region hai-hang
function minDistanceTwoRows(a: string, b: string): number {
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);   // row i = 0
  let cur = new Array(b.length + 1).fill(0);
  for (let i = 1; i <= a.length; i++) {
    cur[0] = i;                                                  // column 0 of THIS row
    for (let j = 1; j <= b.length; j++)
      cur[j] = a[i - 1] === b[j - 1] ? prev[j - 1] : 1 + Math.min(prev[j - 1], prev[j], cur[j - 1]);
    [prev, cur] = [cur, prev];
  }
  return prev[b.length];
}
// #endregion

for (const [a, b] of [['horse', 'ros'], ['intention', 'execution'], ['', 'abc'], ['kitten', 'sitting'], ['nha', 'nhaf'], ['Bgu', 'Bug']]) {
  console.log(`minDistance("${a}", "${b}") = ${minDistance(a, b)}  two-rows = ${minDistanceTwoRows(a, b)}  edits = ${JSON.stringify(editScript(a, b))}`);
}
