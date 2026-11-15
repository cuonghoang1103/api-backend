// @java: L6TimeMap.java
// LC 981 · Time Based Key-Value Store. set() arrives with increasing timestamps, so each key's history is
// already sorted: get(key, t) = the last entry with timestamp <= t = upperBound - 1.
function firstTrue(lo: number, hi: number, ok: (i: number) => boolean): number {
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (ok(mid)) hi = mid; else lo = mid + 1;
  }
  return lo;
}
// #region giai
class TimeMap {
  private h = new Map<string, { t: number[]; v: string[] }>();
  set(key: string, value: string, timestamp: number): void {     // O(1): append (timestamps only grow)
    let e = this.h.get(key);
    if (!e) { e = { t: [], v: [] }; this.h.set(key, e); }
    e.t.push(timestamp); e.v.push(value);
  }
  get(key: string, timestamp: number): string {                  // O(log n)
    const e = this.h.get(key);
    if (!e) return '';
    const i = firstTrue(0, e.t.length, (k) => e.t[k] > timestamp) - 1;
    return i >= 0 ? e.v[i] : '';
  }
}
// #endregion
const m = new TimeMap();
m.set('price', '100k', 10); m.set('price', '120k', 20); m.set('price', '90k', 35);
const asks: [string, number][] = [['price', 5], ['price', 10], ['price', 19], ['price', 20], ['price', 34], ['price', 99], ['stock', 50]];
console.log(asks.map(([k, t]) => `get(${k}, ${t}) = "${m.get(k, t)}"`).join('\n'));
