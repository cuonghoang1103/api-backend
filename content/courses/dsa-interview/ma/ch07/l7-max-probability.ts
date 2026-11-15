// @java: L7MaxProbability.java
// LC 1514 · Path with Maximum Probability — Dijkstra where "better" means a LARGER product of probabilities.
// Probabilities are ≤ 1, so extending a path never makes it better: the settle-the-best argument still holds.
// The MinHeap from lesson 7.4 is reused with the key NEGATED (-probability) to get a max-heap.
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

// #region giai
function maxProbability(n: number, edges: number[][], succProb: number[], start: number, end: number): number {
  const adj: [number, number][][] = Array.from({ length: n }, () => []);
  edges.forEach(([u, v], i) => { adj[u].push([v, succProb[i]]); adj[v].push([u, succProb[i]]); });
  const best = new Array<number>(n).fill(0);
  best[start] = 1;
  const heap = new MinHeap();
  heap.push([-1, start]);                              // max-heap via negative keys
  while (heap.size > 0) {
    const [negP, u] = heap.pop();
    const p = -negP;
    if (p < best[u]) continue;                         // stale
    if (u === end) return p;                           // the first time end is popped, p is optimal
    for (const [v, w] of adj[u]) {
      if (p * w > best[v]) { best[v] = p * w; heap.push([-best[v], v]); }
    }
  }
  return 0;
}
// #endregion

console.log(maxProbability(3, [[0, 1], [1, 2], [0, 2]], [0.5, 0.5, 0.2], 0, 2).toFixed(5));
console.log(maxProbability(3, [[0, 1], [1, 2], [0, 2]], [0.5, 0.5, 0.3], 0, 2).toFixed(5));
console.log(maxProbability(3, [[0, 1]], [0.5], 0, 2).toFixed(5));
