// Bảng vết 7.2: BFS trên đồ thị (hàng đợi + dist), đếm đảo (mỗi đảo một hàng), cam thối (mỗi phút một hàng).
export function vetBfs(adj, s) {
  const dist = new Array(adj.length).fill(-1);
  const q = [s];
  dist[s] = 0;
  const hang = [];
  for (let head = 0; head < q.length; head++) {
    const u = q[head];
    const moi = [];
    for (const v of adj[u]) if (dist[v] === -1) { dist[v] = dist[u] + 1; q.push(v); moi.push(v); }
    hang.push({ head, u, moi, cho: q.slice(head + 1), dist: [...dist] });
  }
  return hang;
}

export function vetIslands(rows) {
  const g = rows.map((r) => r.split(''));
  const R = g.length, C = g[0].length;
  const hang = [];
  let dem = 0;
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
    if (g[r][c] !== '1') continue;
    dem++;
    const chim = [];
    const st = [[r, c]];
    g[r][c] = '0';
    while (st.length) {
      const [a, b] = st.pop();
      chim.push(`${a},${b}`);
      for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const x = a + dr, y = b + dc;
        if (x >= 0 && x < R && y >= 0 && y < C && g[x][y] === '1') { g[x][y] = '0'; st.push([x, y]); }
      }
    }
    hang.push({ dem, bd: `${r},${c}`, chim, luoi: g.map((row) => [...row]) });
  }
  return hang;
}

export function vetRotting(grid) {
  const g = grid.map((r) => [...r]);
  const R = g.length, C = g[0].length;
  let q = [], fresh = 0;
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) { if (g[r][c] === 2) q.push([r, c]); else if (g[r][c] === 1) fresh++; }
  const hang = [{ phut: 0, moi: q.map(([r, c]) => `${r},${c}`), luoi: g.map((r) => [...r]), fresh }];
  let phut = 0;
  while (q.length && fresh > 0) {
    const next = [];
    for (const [r, c] of q) for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const x = r + dr, y = c + dc;
      if (x >= 0 && x < R && y >= 0 && y < C && g[x][y] === 1) { g[x][y] = 2; fresh--; next.push([x, y]); }
    }
    q = next;
    phut++;
    hang.push({ phut, moi: q.map(([r, c]) => `${r},${c}`), luoi: g.map((r) => [...r]), fresh });
  }
  return hang;
}
