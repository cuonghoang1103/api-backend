// @java: L3Matrix01.java
// LC 542 · 01 Matrix — distance from every cell to the nearest 0 = ONE multi-source BFS started from all zeros.

// #region giai
function updateMatrix(mat: number[][]): number[][] {
  const R = mat.length, C = mat[0].length;
  const dist = Array.from({ length: R }, () => new Array<number>(C).fill(-1));
  const q: number[] = [];
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (mat[r][c] === 0) { dist[r][c] = 0; q.push(r * C + c); }
  for (let head = 0; head < q.length; head++) {
    const r = Math.floor(q[head] / C), c = q[head] % C;
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < R && nc >= 0 && nc < C && dist[nr][nc] === -1) {
        dist[nr][nc] = dist[r][c] + 1;
        q.push(nr * C + nc);
      }
    }
  }
  return dist;
}
// #endregion

console.log(JSON.stringify(updateMatrix([[0, 0, 0], [0, 1, 0], [0, 0, 0]])));
console.log(JSON.stringify(updateMatrix([[0, 0, 0], [0, 1, 0], [1, 1, 1]])));
console.log(JSON.stringify(updateMatrix([[1, 1, 1, 1, 0]])));
