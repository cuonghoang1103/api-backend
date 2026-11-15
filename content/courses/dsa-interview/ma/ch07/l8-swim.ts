// @java: L8Swim.java
// LC 778 · Swim in Rising Water — the time to reach a cell = the HIGHEST elevation on the best route to it.
// Dijkstra with max instead of + (like LC 1631). Alternatives: binary search on t + BFS, or union-find by elevation.
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
function swimInWater(grid: number[][]): number {
  const n = grid.length;
  const best = Array.from({ length: n }, () => new Array<number>(n).fill(Infinity));
  best[0][0] = grid[0][0];
  const heap = new MinHeap();
  heap.push([grid[0][0], 0]);                          // [time, cell = r * n + c]
  while (heap.size > 0) {
    const [t, cell] = heap.pop();
    const r = Math.floor(cell / n), c = cell % n;
    if (t > best[r][c]) continue;
    if (r === n - 1 && c === n - 1) return t;
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= n || nc < 0 || nc >= n) continue;
      const nt = Math.max(t, grid[nr][nc]);
      if (nt < best[nr][nc]) { best[nr][nc] = nt; heap.push([nt, nr * n + nc]); }
    }
  }
  return -1;
}
// #endregion

console.log(swimInWater([[0, 2], [1, 3]]));
console.log(swimInWater([[0, 1, 2, 3, 4], [24, 23, 22, 21, 5], [12, 13, 14, 15, 16], [11, 17, 18, 19, 20], [10, 9, 8, 7, 6]]));
console.log(swimInWater([[3, 2], [0, 1]]));
