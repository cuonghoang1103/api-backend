// Bảng vết 7.5: Kruskal trên LC 1584 — từng cạnh theo thứ tự chi phí, nhận hay bỏ.
export function vetKruskal(points) {
  const n = points.length;
  const edges = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++)
    edges.push([Math.abs(points[i][0] - points[j][0]) + Math.abs(points[i][1] - points[j][1]), i, j]);
  edges.sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x) => { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; };
  const hang = [];
  let cost = 0, used = 0;
  for (const [w, i, j] of edges) {
    if (used === n - 1) break;
    const a = find(i), b = find(j);
    const nhan = a !== b;
    if (nhan) { parent[b] = a; cost += w; used++; }
    hang.push({ w, i, j, nhan, cost, used });
  }
  return hang;
}
