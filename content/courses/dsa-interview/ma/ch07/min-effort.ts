// @java: MinEffort.java
// LC 1631 · Path With Minimum Effort — Dijkstra where a path's cost is its BIGGEST step, not the sum.
// The same 25-line binary heap as network-delay.ts (lesson files run standalone, so it is repeated here).
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
function minimumEffortPath(h: number[][]): number {
  const R = h.length, C = h[0].length;
  const best = Array.from({ length: R }, () => new Array<number>(C).fill(Infinity));
  best[0][0] = 0;
  const pq = new MinHeap();
  pq.push([0, 0]);                                              // [effort, cell = r * C + c]
  while (pq.size > 0) {
    const [e, cell] = pq.pop();
    const r = Math.floor(cell / C), c = cell % C;
    if (e > best[r][c]) continue;
    if (r === R - 1 && c === C - 1) return e;
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= R || nc < 0 || nc >= C) continue;
      // #region max
      const ne = Math.max(e, Math.abs(h[nr][nc] - h[r][c]));   // max instead of + : still monotone ⇒ Dijkstra works
      // #endregion
      if (ne < best[nr][nc]) { best[nr][nc] = ne; pq.push([ne, nr * C + nc]); }
    }
  }
  return 0;
}
// #endregion

console.log(minimumEffortPath([[1, 2, 2], [3, 8, 2], [5, 3, 5]]));
console.log(minimumEffortPath([[1, 2, 3], [3, 8, 4], [5, 3, 5]]));
console.log(minimumEffortPath([[1, 2, 1, 1, 1], [1, 2, 1, 2, 1], [1, 2, 1, 2, 1], [1, 2, 1, 2, 1], [1, 1, 1, 2, 1]]));
