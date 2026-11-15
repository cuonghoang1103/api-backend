// N-Queens (n = 5) — one queen per row. Selected cell = the square being tried; 1 = a queen.
// Three Sets answer "attacked?" in O(1): cols, diag (r - c), anti (r + c).
const N = 5;
const board = [];
for (let r = 0; r < N; r++) { const row = []; for (let c = 0; c < N; c++) row.push(0); board.push(row); }
const t = new Array2DTracer('Board ' + N + ' x ' + N + '  (1 = queen)');
const log = new LogTracer('try / prune / place / backtrack');
t.set(board);
log.println('Row by row. A square is skipped as soon as a queen attacks it: that is the pruning.');
Tracer.delay();
const cols = new Set(), diag = new Set(), anti = new Set();
let found = 0;
function bt(r) {
  if (r === N) {
    found++;
    log.println('SOLUTION #' + found + ' — all ' + N + ' rows have a queen.');
    Tracer.delay();
    return found >= 2;                       // stop after two solutions to keep the replay short
  }
  for (let c = 0; c < N; c++) {
    t.select(r, c);
    const why = cols.has(c) ? 'column ' + c : diag.has(r - c) ? '"\\" diagonal (r-c=' + (r - c) + ')' : anti.has(r + c) ? '"/" diagonal (r+c=' + (r + c) + ')' : '';
    if (why) {
      log.println('(' + r + ',' + c + ') attacked via ' + why + ' -> prune');
      Tracer.delay();
      t.deselect(r, c);
      continue;
    }
    board[r][c] = 1; t.set(board); t.patch(r, c);
    cols.add(c); diag.add(r - c); anti.add(r + c);
    log.println('(' + r + ',' + c + ') safe -> place queen, go to row ' + (r + 1));
    Tracer.delay();
    t.deselect(r, c);
    if (bt(r + 1)) return true;
    board[r][c] = 0; t.set(board); t.depatch(r, c);
    cols.delete(c); diag.delete(r - c); anti.delete(r + c);
    log.println('back in row ' + r + ': remove queen at (' + r + ',' + c + '), try the next column');
    Tracer.delay();
  }
  log.println('row ' + r + ': every column is attacked -> dead end, return to row ' + (r - 1));
  Tracer.delay();
  return false;
}
bt(0);
