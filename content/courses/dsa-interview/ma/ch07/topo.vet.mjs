// Bảng vết 7.3: (1) Kahn trên LC 210 (prerequisites [a, b] = b → a); (2) DFS ba màu, ghi từng sự kiện vào/ra.
export function vetKahn(n, prerequisites) {
  const out = Array.from({ length: n }, () => []);
  const indeg = new Array(n).fill(0);
  for (const [a, b] of prerequisites) { out[b].push(a); indeg[a]++; }
  const q = [];
  for (let v = 0; v < n; v++) if (indeg[v] === 0) q.push(v);
  const hang = [{ u: null, giam: [], mo: [...q], indeg: [...indeg], cho: [...q], order: [] }];
  const order = [];
  for (let head = 0; head < q.length; head++) {
    const u = q[head];
    order.push(u);
    const giam = [], mo = [];
    for (const v of out[u]) { indeg[v]--; giam.push(v); if (indeg[v] === 0) { q.push(v); mo.push(v); } }
    hang.push({ u, giam, mo, indeg: [...indeg], cho: q.slice(head + 1), order: [...order] });
  }
  return hang;
}

export function vetDfs3(n, edges) {
  const out = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) out[u].push(v);
  const color = new Array(n).fill(0);
  const path = [], finished = [], hang = [];
  let cycle = null;
  const ghi = (viec) => hang.push({ viec, color: [...color], path: [...path], finished: [...finished] });
  const visit = (u) => {
    color[u] = 1; path.push(u);
    ghi(`enter ${u}`);
    for (const v of out[u]) {
      if (cycle) return;
      if (color[v] === 1) { cycle = [...path.slice(path.indexOf(v)), v]; ghi(`edge ${u}→${v}: ${v} is GRAY ⇒ cycle ${cycle.join('→')}`); return; }
      if (color[v] === 2) ghi(`edge ${u}→${v}: ${v} is BLACK ⇒ skip`);
      if (color[v] === 0) visit(v);
    }
    if (cycle) return;
    color[u] = 2; path.pop(); finished.push(u);
    ghi(`leave ${u} (finished)`);
  };
  for (let u = 0; u < n && !cycle; u++) if (color[u] === 0) visit(u);
  return { hang, cycle, order: cycle ? null : [...finished].reverse() };
}
