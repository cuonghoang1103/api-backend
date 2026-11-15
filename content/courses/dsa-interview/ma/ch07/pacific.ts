// @java: Pacific.java
// LC 417 · Pacific Atlantic Water Flow — run the flow BACKWARDS: from each ocean, climb to cells at least as high.

// #region giai
function pacificAtlantic(h: number[][]): number[][] {
  const R = h.length, C = h[0].length;
  const climb = (starts: number[][]): boolean[][] => {
    const seen = Array.from({ length: R }, () => new Array<boolean>(C).fill(false));
    const q: number[][] = [];
    for (const [r, c] of starts) if (!seen[r][c]) { seen[r][c] = true; q.push([r, c]); }
    for (let head = 0; head < q.length; head++) {
      const [r, c] = q[head];
      for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= R || nc < 0 || nc >= C || seen[nr][nc]) continue;
        if (h[nr][nc] < h[r][c]) continue;            // water cannot flow UP from (nr,nc) to (r,c)
        seen[nr][nc] = true; q.push([nr, nc]);
      }
    }
    return seen;
  };
  const pac: number[][] = [], atl: number[][] = [];
  for (let r = 0; r < R; r++) { pac.push([r, 0]); atl.push([r, C - 1]); }
  for (let c = 0; c < C; c++) { pac.push([0, c]); atl.push([R - 1, c]); }
  const P = climb(pac), A = climb(atl);
  const out: number[][] = [];
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (P[r][c] && A[r][c]) out.push([r, c]);
  return out;
}
// #endregion

console.log(JSON.stringify(pacificAtlantic([[1, 2, 2, 3, 5], [3, 2, 3, 4, 4], [2, 4, 5, 3, 1], [6, 7, 1, 4, 5], [5, 1, 1, 2, 4]])));
console.log(JSON.stringify(pacificAtlantic([[1]])));
console.log(JSON.stringify(pacificAtlantic([[3, 3, 3], [3, 1, 3], [3, 3, 3]])));
