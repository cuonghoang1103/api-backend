// Longest palindromic substring: the table is filled DIAGONAL by diagonal (length 1, then 2, then 3 ...),
// because is[i][j] needs is[i+1][j-1] — the cell down-left, which belongs to a SHORTER substring.
const S = 'cabbad';
const n = S.length;
const is = [];
for (let i = 0; i < n; i++) { is.push([]); for (let j = 0; j < n; j++) is[i].push(0); }
const t = new Array2DTracer('is[i][j] = 1 when S[i..j] is a palindrome   S = ' + S + ' (row i = start, column j = end)');
const log = new LogTracer('order of computation');
t.set(is);
log.println('Only the upper triangle (i <= j) is used. We go by LENGTH, not row by row.');
Tracer.delay();
let best = 'c';
for (let len = 1; len <= n; len++) {
  log.println('--- length ' + len + ' ---');
  for (let i = 0; i + len - 1 < n; i++) {
    const j = i + len - 1;
    t.select(i, j);
    if (len > 2) t.patch(i + 1, j - 1);
    const ok = S[i] === S[j] && (len <= 2 || is[i + 1][j - 1] === 1);
    is[i][j] = ok ? 1 : 0;
    t.set(is);
    log.println('"' + S.slice(i, j + 1) + '": ends ' + S[i] + (S[i] === S[j] ? '=' : '!=') + S[j] + (len > 2 ? ', inside "' + S.slice(i + 1, j) + '" = ' + is[i + 1][j - 1] : '') + ' -> ' + is[i][j]);
    if (ok && len > best.length) best = S.slice(i, j + 1);
    Tracer.delay();
    if (len > 2) t.depatch(i + 1, j - 1);
    t.deselect(i, j);
  }
}
log.println('longest palindrome = "' + best + '"');
Tracer.delay();
