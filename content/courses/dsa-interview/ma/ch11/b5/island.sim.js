// Max Area of Island — flood each island once with an explicit stack; every land cell is visited exactly once.
const grid = new Array2DTracer('grid (1 = land)');
const log = new LogTracer('island sizes');
const G = [
  [1, 1, 0, 0, 0],
  [1, 1, 0, 1, 1],
  [0, 0, 0, 1, 0],
  [0, 1, 0, 1, 1],
];
const R = G.length, C = G[0].length;
const g = G.map(function (row) { return row.slice(); });
grid.set(G);
log.println('Scan row by row. A 1 that is not yet visited starts a new island.');
Tracer.delay();
let best = 0;
for (let r0 = 0; r0 < R; r0++) {
  for (let c0 = 0; c0 < C; c0++) {
    if (g[r0][c0] !== 1) continue;
    log.println('new island at (' + r0 + ',' + c0 + ')');
    g[r0][c0] = 0;
    const stack = [[r0, c0]];
    let size = 0;
    while (stack.length) {
      const cell = stack.pop();
      const r = cell[0], c = cell[1];
      size++;
      grid.select(r, c);
      Tracer.delay();
      grid.deselect(r, c);
      grid.patch(r, c);
      const nb = [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]];
      for (let k = 0; k < 4; k++) {
        const nr = nb[k][0], nc = nb[k][1];
        if (nr >= 0 && nr < R && nc >= 0 && nc < C && g[nr][nc] === 1) { g[nr][nc] = 0; stack.push([nr, nc]); }
      }
    }
    log.println('  island size = ' + size + (size > best ? '  (new best)' : ''));
    if (size > best) best = size;
    Tracer.delay();
  }
}
log.println('max area = ' + best + '. Each cell was pushed at most once: O(rows x cols).');
Tracer.delay();
