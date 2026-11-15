// @java: Luoi.java
// A grid is a graph you never build: cell (r, c) is a node, its neighbours are computed on the fly.

// #region huong
const DIR4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];                       // down, up, right, left
const DIR8 = [...DIR4, [1, 1], [1, -1], [-1, 1], [-1, -1]];          // + the four diagonals

function neighbours(grid: number[][], r: number, c: number, dirs: number[][]): number[][] {
  const out: number[][] = [];
  for (const [dr, dc] of dirs) {
    const nr = r + dr, nc = c + dc;
    if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length) out.push([nr, nc]);  // bounds FIRST
  }
  return out;
}
// #endregion

// #region chu-vi
// LC 463 · Island Perimeter: every land cell has 4 sides; each side that touches water or the border counts.
function islandPerimeter(grid: number[][]): number {
  let p = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] !== 1) continue;
      for (const [dr, dc] of DIR4) {
        const nr = r + dr, nc = c + dc;
        const water = nr < 0 || nr >= grid.length || nc < 0 || nc >= grid[0].length || grid[nr][nc] === 0;
        if (water) p++;
      }
    }
  }
  return p;
}
// #endregion

const g = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
console.log('4-dir neighbours of (0,0):', JSON.stringify(neighbours(g, 0, 0, DIR4)));
console.log('8-dir neighbours of (0,0):', JSON.stringify(neighbours(g, 0, 0, DIR8)));
console.log('8-dir neighbours of (1,1):', neighbours(g, 1, 1, DIR8).length);
const cols = 3;
console.log('cell (2,1) as a node id r*cols+c =', 2 * cols + 1, ' back: r =', Math.floor(7 / cols), 'c =', 7 % cols);
console.log('perimeter =', islandPerimeter([[0, 1, 0, 0], [1, 1, 1, 0], [0, 1, 0, 0], [1, 1, 0, 0]]));
console.log('perimeter =', islandPerimeter([[1]]));
console.log('perimeter =', islandPerimeter([[1, 0]]));
