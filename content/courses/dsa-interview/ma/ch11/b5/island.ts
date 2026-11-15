// @java: PvIsland.java
// LC 695 · Max Area of Island — every land cell belongs to exactly one island; flood each island once and count it.
// Recursive DFS is the shortest to write; an explicit stack is the safe version when the grid can be large
// (see island-sau.ts: recursion depth = island size). Both O(rows·cols) time.

// #region dfs-de-quy
function maxAreaRecursive(grid: number[][]): number {
  const R = grid.length, C = grid[0].length;
  const g = grid.map((row) => [...row]);               // copy: ask before mutating the caller's grid
  const area = (r: number, c: number): number => {
    if (r < 0 || r >= R || c < 0 || c >= C || g[r][c] !== 1) return 0;
    g[r][c] = 0;                                        // mark visited BEFORE recursing (no double count)
    return 1 + area(r + 1, c) + area(r - 1, c) + area(r, c + 1) + area(r, c - 1);
  };
  let best = 0;
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (g[r][c] === 1) best = Math.max(best, area(r, c));
  return best;
}
// #endregion

// #region dfs-ngan-xep
function maxAreaIterative(grid: number[][]): number {
  const R = grid.length, C = grid[0].length;
  const g = grid.map((row) => [...row]);
  const DR = [1, -1, 0, 0], DC = [0, 0, 1, -1];
  let best = 0;
  for (let r0 = 0; r0 < R; r0++) {
    for (let c0 = 0; c0 < C; c0++) {
      if (g[r0][c0] !== 1) continue;
      g[r0][c0] = 0;
      const stack: number[] = [r0 * C + c0];             // one number per cell: r * C + c
      let size = 0;
      while (stack.length) {
        const cell = stack.pop()!;
        size++;
        const r = Math.floor(cell / C), c = cell % C;
        for (let d = 0; d < 4; d++) {
          const nr = r + DR[d], nc = c + DC[d];
          if (nr >= 0 && nr < R && nc >= 0 && nc < C && g[nr][nc] === 1) {
            g[nr][nc] = 0;                              // mark when PUSHED, not when popped
            stack.push(nr * C + nc);
          }
        }
      }
      best = Math.max(best, size);
    }
  }
  return best;
}
// #endregion

const grids: number[][][] = [
  [[1, 1, 0, 0, 0], [1, 1, 0, 1, 1], [0, 0, 0, 1, 0], [0, 1, 0, 1, 1]],
  [[0, 0, 0], [0, 0, 0]],
  [[1]],
  [[1, 0, 1], [0, 1, 0], [1, 0, 1]],
  [[1, 1, 1], [1, 0, 1], [1, 1, 1]],
];
for (const g of grids) {
  console.log(`${JSON.stringify(g)} -> recursive=${maxAreaRecursive(g)} iterative=${maxAreaIterative(g)}`);
}
const full = Array.from({ length: 50 }, () => new Array(50).fill(1));   // LeetCode's limit is 50 x 50
console.log(`50x50 all land -> recursive=${maxAreaRecursive(full)} iterative=${maxAreaIterative(full)}`);
