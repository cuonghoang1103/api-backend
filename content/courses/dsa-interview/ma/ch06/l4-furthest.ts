// @java: L4Furthest.java
// LC 1642 · Furthest Building You Can Reach — ladders go to the biggest climbs: a min-heap of size = ladders.

class MinHeap<T> {
  a: T[] = [];
  constructor(private cmp: (x: T, y: T) => number) {}
  get size() { return this.a.length; }
  peek() { return this.a[0]; }
  push(x: T) {
    const a = this.a; a.push(x);
    for (let i = a.length - 1; i > 0; ) {
      const p = (i - 1) >> 1;
      if (this.cmp(a[i], a[p]) >= 0) break;
      [a[i], a[p]] = [a[p], a[i]]; i = p;
    }
  }
  pop() {
    const a = this.a, top = a[0], last = a.pop()!;
    if (a.length === 0) return top;
    a[0] = last;
    for (let i = 0; ; ) {
      const l = 2 * i + 1, r = l + 1; let m = i;
      if (l < a.length && this.cmp(a[l], a[m]) < 0) m = l;
      if (r < a.length && this.cmp(a[r], a[m]) < 0) m = r;
      if (m === i) return top;
      [a[i], a[m]] = [a[m], a[i]]; i = m;
    }
  }
}

// #region giai
function furthestBuilding(heights: number[], bricks: number, ladders: number): number {
  const onLadder = new MinHeap<number>((a, b) => a - b);  // climbs currently covered by a ladder
  for (let i = 0; i + 1 < heights.length; i++) {
    const climb = heights[i + 1] - heights[i];
    if (climb <= 0) continue;                             // going down is free
    onLadder.push(climb);                                 // tentatively use a ladder
    if (onLadder.size > ladders) bricks -= onLadder.pop()!; // too many: the SMALLEST climb pays bricks instead
    if (bricks < 0) return i;                             // cannot pay: stuck on building i
  }
  return heights.length - 1;
}
// #endregion

console.log(`[3,8,6,12,13,9,15,20] bricks=6 ladders=1 -> ${furthestBuilding([3, 8, 6, 12, 13, 9, 15, 20], 6, 1)}`);
console.log(`[3,8,6,12,13,9,15,20] bricks=12 ladders=1 -> ${furthestBuilding([3, 8, 6, 12, 13, 9, 15, 20], 12, 1)}`);
console.log(`[5,4,3,2] bricks=0 ladders=0 -> ${furthestBuilding([5, 4, 3, 2], 0, 0)}`);
console.log(`[1,100] bricks=0 ladders=0 -> ${furthestBuilding([1, 100], 0, 0)}`);
