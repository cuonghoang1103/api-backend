// @thoi-gian
// Does a helper function make code slower? For every cell of a grid, count how many of its 4 neighbours lie inside
// the grid. Three versions do EXACTLY the same comparisons:
//   inline      — the bounds check copy-pasted four times
//   helper      — the same four checks, each a call to inBounds()
//   DIRECTIONS  — inBounds() inside a loop over a DIRECTIONS constant (the version most people write)
// #region inline
function countInline(rows: number, cols: number): number {
  let total = 0;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      if (r - 1 >= 0 && r - 1 < rows && c >= 0 && c < cols) total++;
      if (r + 1 >= 0 && r + 1 < rows && c >= 0 && c < cols) total++;
      if (r >= 0 && r < rows && c - 1 >= 0 && c - 1 < cols) total++;
      if (r >= 0 && r < rows && c + 1 >= 0 && c + 1 < cols) total++;
    }
  return total;
}
// #endregion
// #region helper
function inBounds(row: number, col: number, rows: number, cols: number): boolean {
  return row >= 0 && row < rows && col >= 0 && col < cols;
}

function countHelper(rows: number, cols: number): number {
  let total = 0;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      if (inBounds(r - 1, c, rows, cols)) total++;
      if (inBounds(r + 1, c, rows, cols)) total++;
      if (inBounds(r, c - 1, rows, cols)) total++;
      if (inBounds(r, c + 1, rows, cols)) total++;
    }
  return total;
}
// #endregion
// #region huong
const DIRECTIONS = [[-1, 0], [1, 0], [0, -1], [0, 1]];

function countDirections(rows: number, cols: number): number {
  let total = 0;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      for (const [dr, dc] of DIRECTIONS)
        if (inBounds(r + dr, c + dc, rows, cols)) total++;
  return total;
}
// #endregion
function best(f: () => number, laps = 7): [number, number] {
  let ms = Infinity, out = 0;
  for (let k = 0; k < laps; k++) {
    const t = performance.now();
    out = f();
    ms = Math.min(ms, performance.now() - t);
  }
  return [ms, out];
}
const COLS = 1000;
const pad = (s: string | number, w: number) => String(s).padStart(w);
console.log(`${pad('cells', 12)} | ${pad('inline', 10)} | ${pad('helper', 10)} | ${pad('DIRECTIONS', 10)}`);
for (const cells of [100_000, 1_000_000, 10_000_000]) {
  const rows = cells / COLS;
  const [a, x] = best(() => countInline(rows, COLS));
  const [b, y] = best(() => countHelper(rows, COLS));
  const [c, z] = best(() => countDirections(rows, COLS));
  if (x !== y || y !== z) throw new Error('different answers');
  console.log(`${pad(cells.toLocaleString('en-US'), 12)} | ${pad(a.toFixed(2) + ' ms', 10)} | ${pad(b.toFixed(2) + ' ms', 10)} | ${pad(c.toFixed(2) + ' ms', 10)}`);
}
console.log(`node ${process.version} · ${process.arch}`);
