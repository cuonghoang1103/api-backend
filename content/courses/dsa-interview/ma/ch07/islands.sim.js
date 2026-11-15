// Number of Islands: scan the grid; every '1' not yet sunk starts a new island, a DFS sinks the whole island.
const grid = new Array2DTracer('grid (1 = land, 0 = water; red = sunk)');
const log = new LogTracer('islands');
const G = [[1, 1, 0, 0, 0], [1, 1, 0, 0, 0], [0, 0, 1, 0, 0], [0, 0, 0, 1, 1]];
const R = G.length, C = G[0].length;
grid.set(G);
log.println('Scan row by row. A 1 that is still land = the first cell of a NEW island.');
Tracer.delay();
let islands = 0;
for (let r = 0; r < R; r++) {
  for (let c = 0; c < C; c++) {
    grid.select(r, c);
    Tracer.delay();
    if (G[r][c] !== 1) { grid.deselect(r, c); continue; }
    islands++;
    log.println('(' + r + ',' + c + ') is land -> island #' + islands + '. Sink everything connected to it:');
    const stack = [[r, c]];
    G[r][c] = 0;
    while (stack.length) {
      const cur = stack.pop();
      grid.patch(cur[0], cur[1]);
      log.println('   sink (' + cur[0] + ',' + cur[1] + ')');
      Tracer.delay();
      const D = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      for (let k = 0; k < 4; k++) {
        const nr = cur[0] + D[k][0], nc = cur[1] + D[k][1];
        if (nr >= 0 && nr < R && nc >= 0 && nc < C && G[nr][nc] === 1) { G[nr][nc] = 0; stack.push([nr, nc]); }
      }
    }
    grid.deselect(r, c);
  }
}
log.println('Done: ' + islands + ' islands. Each cell was sunk once and looked at a constant number of times: O(rows x cols).');
Tracer.delay();
