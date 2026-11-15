// LCS table, cell by cell. Row i = prefix of A with i letters, column j = prefix of B with j letters.
const A = 'ABCBDA', B = 'BDCABA';
const n = A.length, m = B.length;
const dp = [];
for (let i = 0; i <= n; i++) { dp.push([]); for (let j = 0; j <= m; j++) dp[i].push(0); }
const t = new Array2DTracer('dp[i][j] = LCS of A[0..i) and B[0..j)   A = ' + A + ' (rows), B = ' + B + ' (columns)');
const log = new LogTracer('what each cell looks at');
t.set(dp);
log.println('Row 0 and column 0 are empty prefixes: LCS = 0. Fill row by row, left to right.');
Tracer.delay();
for (let i = 1; i <= n; i++) {
  for (let j = 1; j <= m; j++) {
    t.select(i, j);
    if (A[i - 1] === B[j - 1]) {
      dp[i][j] = dp[i - 1][j - 1] + 1;
      t.patch(i - 1, j - 1);
      log.println('(' + i + ',' + j + ') ' + A[i - 1] + ' = ' + B[j - 1] + ' -> diagonal ' + dp[i - 1][j - 1] + ' + 1 = ' + dp[i][j]);
    } else {
      dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      t.patch(i - 1, j); t.patch(i, j - 1);
      log.println('(' + i + ',' + j + ') ' + A[i - 1] + ' != ' + B[j - 1] + ' -> max(up ' + dp[i - 1][j] + ', left ' + dp[i][j - 1] + ') = ' + dp[i][j]);
    }
    t.set(dp);
    Tracer.delay();
    t.depatch(i - 1, j - 1); t.depatch(i - 1, j); t.depatch(i, j - 1); t.deselect(i, j);
  }
}
let i = n, j = m, s = '';
log.println('Walk back from the corner: diagonal on a match, else towards the larger neighbour.');
while (i > 0 && j > 0) {
  t.patch(i, j);
  if (A[i - 1] === B[j - 1]) { s = A[i - 1] + s; i--; j--; }
  else if (dp[i - 1][j] >= dp[i][j - 1]) i--;
  else j--;
}
Tracer.delay();
log.println('LCS length = ' + dp[n][m] + ', one common subsequence = ' + s);
Tracer.delay();
