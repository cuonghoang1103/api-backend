// LC 1074 — fix a band of rows [top..bottom], squash it into column sums, then run LC 560 on that 1-D array.
const grid = new Array2DTracer('matrix (selected = current band of rows)');
const colT = new Array1DTracer('col = column sums of the band');
const log = new LogTracer('band -> LC 560 on col');
const M = [[1, 2, -1], [-1, 0, 2], [3, -2, 1]];
const target = 2;
const m = M.length, n = M[0].length;
grid.set(M);
colT.set([0, 0, 0]);
log.println('target = ' + target + '. A submatrix = a band of rows + a range of columns.');
log.println('For each band, col[c] = sum of the band in column c. Then count column ranges with sum = target (LC 560).');
Tracer.delay();
let count = 0;
for (let top = 0; top < m; top++) {
  const col = [0, 0, 0];
  for (let bottom = top; bottom < m; bottom++) {
    for (let c = 0; c < n; c++) { col[c] += M[bottom][c]; }
    for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) grid.deselect(r, c);
    for (let r = top; r <= bottom; r++) for (let c = 0; c < n; c++) grid.select(r, c);
    colT.set(col);
    log.println('rows ' + top + '..' + bottom + ':  col = [' + col.join(', ') + ']');
    Tracer.delay();
    const seen = new Map([[0, 1]]);
    let sum = 0, here = 0;
    for (let c = 0; c < n; c++) {
      sum += col[c];
      const hit = seen.get(sum - target) || 0;
      if (hit > 0) { colT.patch(c); }
      here += hit;
      seen.set(sum, (seen.get(sum) || 0) + 1);
    }
    count += here;
    log.println('   prefix sums of col hit target ' + here + ' time(s)  -> total = ' + count);
    Tracer.delay();
    for (let c = 0; c < n; c++) colT.depatch(c);
  }
}
log.println('answer = ' + count + ' submatrices, using ' + (m * (m + 1) / 2) + ' bands x O(n) each = O(m^2 n).');
Tracer.delay();
