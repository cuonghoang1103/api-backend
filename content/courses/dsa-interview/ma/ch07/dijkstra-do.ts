// @thoi-gian
// Dijkstra two ways on a SPARSE weighted graph (E = 4V, weights 1..100):
//   array version: pick the closest unsettled node by scanning all V  ⇒ O(V² + E)
//   heap version : binary min-heap with lazy deletion                  ⇒ O((V + E) log V)
class MinHeap {                                   // JS has no heap: ~20 lines you can write in an interview
  private a: [number, number][] = [];             // [distance, node]
  get size(): number { return this.a.length; }
  push(x: [number, number]): void {
    const a = this.a; a.push(x);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (a[p][0] <= a[i][0]) break;
      [a[p], a[i]] = [a[i], a[p]]; i = p;
    }
  }
  pop(): [number, number] {
    const a = this.a, top = a[0], last = a.pop()!;
    if (a.length > 0) {
      a[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1, r = l + 1;
        let m = i;
        if (l < a.length && a[l][0] < a[m][0]) m = l;
        if (r < a.length && a[r][0] < a[m][0]) m = r;
        if (m === i) break;
        [a[m], a[i]] = [a[i], a[m]]; i = m;
      }
    }
    return top;
  }
}

function graph(V: number): [number, number][][] {
  const adj: [number, number][][] = Array.from({ length: V }, () => []);
  let x = 2024;
  const rnd = () => (x = (Math.imul(x, 1103515245) + 12345) & 0x7fffffff);
  for (let u = 0; u < V; u++) {
    adj[u].push([(u + 1) % V, 1 + (rnd() % 100)]);
    for (let k = 1; k < 4; k++) adj[u].push([rnd() % V, 1 + (rnd() % 100)]);
  }
  return adj;
}
function viaArray(adj: [number, number][][]): number {
  const V = adj.length, dist = new Float64Array(V).fill(Infinity), done = new Uint8Array(V);
  dist[0] = 0;
  for (let k = 0; k < V; k++) {
    let u = -1;
    for (let x = 0; x < V; x++) if (!done[x] && (u === -1 || dist[x] < dist[u])) u = x;   // O(V) scan
    if (dist[u] === Infinity) break;
    done[u] = 1;
    for (const [v, w] of adj[u]) if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;
  }
  let s = 0; for (let i = 0; i < V; i++) s += dist[i];
  return s;
}
function viaHeap(adj: [number, number][][]): number {
  const V = adj.length, dist = new Float64Array(V).fill(Infinity);
  dist[0] = 0;
  const h = new MinHeap();
  h.push([0, 0]);
  while (h.size > 0) {
    const [d, u] = h.pop();
    if (d > dist[u]) continue;
    for (const [v, w] of adj[u]) if (d + w < dist[v]) { dist[v] = d + w; h.push([dist[v], v]); }
  }
  let s = 0; for (let i = 0; i < V; i++) s += dist[i];
  return s;
}
function ms(f: () => number, lap: number): [number, number] {
  let best = Infinity, r = 0;
  for (let k = 0; k < lap; k++) { const t = performance.now(); r = f(); best = Math.min(best, performance.now() - t); }
  return [best, r];
}
const pad = (s: string | number, w: number) => String(s).padStart(w);
console.log(`${pad('V', 9)} | ${pad('array O(V^2)', 13)} | ${pad('heap O(E log V)', 15)}`);
for (const V of [1_000, 10_000, 30_000, 100_000, 1_000_000]) {
  const adj = graph(V);
  const a = V <= 30_000 ? ms(() => viaArray(adj), V <= 10_000 ? 3 : 1) : null;
  const h = ms(() => viaHeap(adj), 3);
  if (a && a[1] !== h[1]) throw new Error('different answers');
  console.log(`${pad(V.toLocaleString('en-US'), 9)} | ${pad(a ? a[0].toFixed(1) + ' ms' : 'skipped', 13)} | ${pad(h[0].toFixed(1) + ' ms', 15)}`);
}
console.log(`node ${process.version} · ${process.arch}`);
