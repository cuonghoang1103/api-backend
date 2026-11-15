// @java: L7MeetingRoomsIII.java
// LC 2402 · Meeting Rooms III — two heaps: free rooms by number, busy rooms by (free time, number).

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
function mostBooked(n: number, meetings: number[][]): number {
  const s = [...meetings].sort((a, b) => a[0] - b[0]);
  const free = new MinHeap<number>((a, b) => a - b);                    // room numbers
  for (let r = 0; r < n; r++) free.push(r);
  const busy = new MinHeap<[number, number]>((a, b) => a[0] - b[0] || a[1] - b[1]); // [free at, room]
  const used = new Array(n).fill(0);
  for (const [start, end] of s) {
    while (busy.size && busy.peek()![0] <= start) free.push(busy.pop()![1]); // rooms that freed up in time
    if (free.size) {
      const r = free.pop()!;                                              // lowest-numbered free room
      busy.push([end, r]); used[r]++;
    } else {
      const [t, r] = busy.pop()!;                                         // wait for the earliest room
      busy.push([t + (end - start), r]); used[r]++;                       // delayed, same duration
    }
  }
  let best = 0;
  for (let r = 1; r < n; r++) if (used[r] > used[best]) best = r;         // ties: lowest number
  return best;
}
// #endregion

console.log(`n=3 [[1,20],[2,10],[3,5],[4,9],[6,8]] -> room ${mostBooked(3, [[1, 20], [2, 10], [3, 5], [4, 9], [6, 8]])}`);
console.log(`n=2 [[0,5],[1,2],[2,3],[3,4],[4,9]] -> room ${mostBooked(2, [[0, 5], [1, 2], [2, 3], [3, 4], [4, 9]])}`);
console.log(`n=1 [[5,6],[1,3]] -> room ${mostBooked(1, [[5, 6], [1, 3]])}`);
