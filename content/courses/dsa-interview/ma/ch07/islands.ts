// @java: Islands.java
// LC 200 · Number of Islands — every unvisited '1' starts a new island; a traversal "sinks" the whole island.

// #region dfs
function numIslandsDfs(grid: string[][]): number {
  const R = grid.length, C = grid[0].length;
  const sink = (r: number, c: number): void => {
    if (r < 0 || r >= R || c < 0 || c >= C || grid[r][c] !== '1') return;   // bounds, then value
    grid[r][c] = '0';                                                    // mark visited by sinking
    sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1);
  };
  let islands = 0;
  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++)
      if (grid[r][c] === '1') { islands++; sink(r, c); }
  return islands;
}
// #endregion

// #region bfs
function numIslandsBfs(grid: string[][]): number {
  const R = grid.length, C = grid[0].length;
  const D = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  let islands = 0;
  for (let r0 = 0; r0 < R; r0++)
    for (let c0 = 0; c0 < C; c0++) {
      if (grid[r0][c0] !== '1') continue;
      islands++;
      grid[r0][c0] = '0';
      const q: number[] = [r0 * C + c0];                  // a cell as one integer
      for (let head = 0; head < q.length; head++) {       // head index, never shift()
        const r = Math.floor(q[head] / C), c = q[head] % C;
        for (const [dr, dc] of D) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] === '1') {
            grid[nr][nc] = '0';                           // mark when ENQUEUED
            q.push(nr * C + nc);
          }
        }
      }
    }
  return islands;
}
// #endregion

const grids = [
  ['11110', '11010', '11000', '00000'],
  ['11000', '11000', '00100', '00011'],
  ['101', '010', '101'],
  ['0'],
];
for (const g of grids) {
  const a = g.map((row) => row.split(''));
  const b = g.map((row) => row.split(''));
  console.log(`${JSON.stringify(g)} -> dfs ${numIslandsDfs(a)}, bfs ${numIslandsBfs(b)}`);
}
