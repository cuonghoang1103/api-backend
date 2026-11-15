// @java: MinGroups.java
// "How many rooms?" two ways. LC 2406 (closed [l, r]: sharing an endpoint clashes) and the meeting-room
// version (half-open [s, e): one may start when another ends — LC 253, Premium). Heap of end times, or sweep.

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

// #region heap
function minRoomsHeap(intervals: number[][], closed: boolean): number {
  const s = [...intervals].sort((a, b) => a[0] - b[0]);             // by start
  const ends = new MinHeap<number>((a, b) => a - b);                 // one entry per room: when it frees up
  for (const [start, end] of s) {
    const free = ends.size > 0 && (closed ? ends.peek()! < start : ends.peek()! <= start);
    if (free) ends.pop();                                            // reuse the room that frees up first
    ends.push(end);
  }
  return ends.size;                                                  // rooms ever opened = rooms needed
}
// #endregion

// #region sweep
function minRoomsSweep(intervals: number[][], closed: boolean): number {
  const ev: [number, number][] = [];
  for (const [start, end] of intervals) {
    ev.push([start, +1]);
    ev.push([closed ? end + 1 : end, -1]);                           // closed: free only AFTER the end point
  }
  ev.sort((a, b) => a[0] - b[0] || a[1] - b[1]);                     // same time: -1 before +1
  let cur = 0, best = 0;
  for (const [, d] of ev) { cur += d; best = Math.max(best, cur); }
  return best;
}
// #endregion

const labs = [[9, 11], [10, 12], [11, 13], [13, 14], [9, 10]];
console.log(`lab bookings ${JSON.stringify(labs)}`);
console.log(`  half-open (meeting rooms): heap=${minRoomsHeap(labs, false)} sweep=${minRoomsSweep(labs, false)}`);
console.log(`  closed (LC 2406 groups)  : heap=${minRoomsHeap(labs, true)} sweep=${minRoomsSweep(labs, true)}`);
for (const iv of [[[1, 3], [5, 6], [8, 10], [11, 13]], [[1, 5], [2, 6], [3, 7]], [[4, 4], [4, 4]]]) {
  console.log(`${JSON.stringify(iv)}: closed heap=${minRoomsHeap(iv, true)} sweep=${minRoomsSweep(iv, true)}`);
}
