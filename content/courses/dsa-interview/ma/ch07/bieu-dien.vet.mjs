// Bảng vết 7.1: (1) dựng danh sách kề từ danh sách cạnh, từng cạnh một; (2) DFS lặp bằng stack (LC 1971).
export function vetKe(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  return edges.map(([u, v], k) => {
    adj[u].push(v); adj[v].push(u);
    return { k, u, v, adj: adj.map((a) => [...a]) };
  });
}

export function vetDfsLap(n, edges, s, t) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
  const seen = new Array(n).fill(false);
  const stack = [s];
  seen[s] = true;
  const hang = [{ buoc: 0, pop: null, day: [], stack: [...stack], seen: [...seen], xong: false }];
  let buoc = 0;
  while (stack.length) {
    const u = stack.pop();
    buoc++;
    if (u === t) { hang.push({ buoc, pop: u, day: [], stack: [...stack], seen: [...seen], xong: true }); return hang; }
    const day = [];
    for (const v of adj[u]) if (!seen[v]) { seen[v] = true; stack.push(v); day.push(v); }
    hang.push({ buoc, pop: u, ke: [...adj[u]], day, stack: [...stack], seen: [...seen], xong: false });
  }
  return hang;
}
