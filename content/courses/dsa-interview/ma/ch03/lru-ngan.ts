// @java: LruNgan.java
// The SHORT LRU: a JavaScript Map remembers insertion order, so "delete + set" moves a key to the newest end.
// This is exactly what src/services/sachRieng/ielts.ts › anhTrangIelts does on cuongthai.com (cap 40 pages).

// #region giai
class LRUShort {
  private m = new Map<number, number>();
  constructor(private cap: number) {}
  get(k: number): number {
    if (!this.m.has(k)) return -1;
    const v = this.m.get(k)!;
    this.m.delete(k); this.m.set(k, v);            // re-insert => now the NEWEST
    return v;
  }
  put(k: number, v: number): void {
    this.m.delete(k);
    this.m.set(k, v);
    if (this.m.size > this.cap) this.m.delete(this.m.keys().next().value!); // first key = OLDEST
  }
  keys(): string { return [...this.m.keys()].join(' '); }
}
// #endregion

const c = new LRUShort(2);
c.put(1, 1); c.put(2, 2);
const g1 = c.get(1);
c.put(3, 3);
console.log(`get(1)=${g1} then put(3): keys oldest->newest = [${c.keys()}], get(2)=${c.get(2)}`);
