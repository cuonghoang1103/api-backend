// @java: NetworkDelay.java
// LC 743 · Network Delay Time — Dijkstra with a binary min-heap and "lazy deletion" (skip stale heap entries).

// #region heap
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
// #endregion

// #region dijkstra
function networkDelayTime(times: number[][], n: number, k: number): number {
  const adj: [number, number][][] = Array.from({ length: n + 1 }, () => []);
  for (const [u, v, w] of times) adj[u].push([v, w]);
  const dist = new Array<number>(n + 1).fill(Infinity);
  dist[k] = 0;
  const heap = new MinHeap();
  heap.push([0, k]);
  while (heap.size > 0) {
    const [d, u] = heap.pop();
    if (d > dist[u]) continue;                    // stale entry: u was already settled with a smaller d
    for (const [v, w] of adj[u]) {
      if (d + w < dist[v]) { dist[v] = d + w; heap.push([dist[v], v]); }   // relax: a better way to v
    }
  }
  let worst = 0;
  for (let v = 1; v <= n; v++) worst = Math.max(worst, dist[v]);
  return worst === Infinity ? -1 : worst;
}
// #endregion

console.log(networkDelayTime([[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2));
console.log(networkDelayTime([[1, 2, 1]], 2, 1));
console.log(networkDelayTime([[1, 2, 1]], 2, 2));
console.log(networkDelayTime([[1, 2, 4], [1, 3, 1], [3, 2, 1], [2, 4, 1]], 4, 1));
