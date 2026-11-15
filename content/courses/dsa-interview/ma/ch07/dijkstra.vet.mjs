// Bảng vết 7.4: (1) Dijkstra với heap + xoá lười (LC 743); (2) union-find nhận từng cạnh (LC 684).
export function vetDijkstra(n, times, k) {
  const adj = Array.from({ length: n + 1 }, () => []);
  for (const [u, v, w] of times) adj[u].push([v, w]);
  const dist = new Array(n + 1).fill(Infinity);
  dist[k] = 0;
  let heap = [[0, k]];
  const hang = [];
  while (heap.length) {
    heap.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const [d, u] = heap.shift();
    if (d > dist[u]) { hang.push({ d, u, cu: true, nhe: [], dist: dist.slice(1), heap: heap.map((x) => [...x]) }); continue; }
    const nhe = [];
    for (const [v, w] of adj[u]) if (d + w < dist[v]) { nhe.push(`${v}: ${dist[v] === Infinity ? '∞' : dist[v]} → ${d + w}`); dist[v] = d + w; heap.push([dist[v], v]); }
    hang.push({ d, u, cu: false, nhe, dist: dist.slice(1), heap: [...heap].sort((a, b) => a[0] - b[0] || a[1] - b[1]).map((x) => [...x]) });
  }
  return hang;
}

export function vetDsu(n, edges) {
  const parent = Array.from({ length: n + 1 }, (_, i) => i), size = new Array(n + 1).fill(1);
  const find = (x) => { let r = x; while (parent[r] !== r) r = parent[r]; while (parent[x] !== r) { const nx = parent[x]; parent[x] = r; x = nx; } return r; };
  const hang = [];
  let sets = n;
  for (const [a, b] of edges) {
    const ra = find(a), rb = find(b);
    let viec;
    if (ra === rb) viec = { thua: true, txt: `find(${a}) = find(${b}) = ${ra} ⇒ already connected ⇒ redundant` };
    else {
      let big = ra, small = rb;
      if (size[big] < size[small]) [big, small] = [small, big];
      parent[small] = big; size[big] += size[small]; sets--;
      viec = { thua: false, txt: `roots ${ra}, ${rb} ⇒ parent[${small}] = ${big} (size ${size[big]})` };
    }
    hang.push({ canh: [a, b], ...viec, parent: parent.slice(1), sets });
  }
  return hang;
}
