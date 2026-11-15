// @java: L6MaxEvents.java
// LC 1353 · Maximum Number of Events That Can Be Attended — day by day, attend the open event that ends soonest.

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
function maxEvents(events: number[][]): number {
  const s = [...events].sort((a, b) => a[0] - b[0]);
  const ends = new MinHeap<number>((a, b) => a - b);   // end days of events that have started
  const lastDay = Math.max(...s.map((e) => e[1]));
  let i = 0, attended = 0;
  for (let day = 1; day <= lastDay; day++) {
    while (i < s.length && s[i][0] === day) ends.push(s[i++][1]);   // events opening today
    while (ends.size && ends.peek()! < day) ends.pop();              // events already over: too late
    if (ends.size) { ends.pop(); attended++; }                       // go to the one that closes first
  }
  return attended;
}
// #endregion

for (const ev of [[[1, 3], [1, 3], [1, 3], [2, 2], [4, 4]], [[1, 1], [1, 1], [1, 1]], [[1, 5], [1, 1], [2, 2], [2, 3]], [[3, 4], [1, 2]]]) {
  console.log(`${JSON.stringify(ev)} -> ${maxEvents(ev)}`);
}
