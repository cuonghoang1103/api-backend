// @java: TaskScheduler.java
// LC 621 · Task Scheduler — (a) simulate with a max-heap + a cooldown queue, (b) the counting formula.

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
function leastIntervalHeap(tasks: string[], n: number): number {
  const count = new Map<string, number>();
  for (const t of tasks) count.set(t, (count.get(t) ?? 0) + 1);
  const ready = new MinHeap<number>((a, b) => b - a);        // max-heap of remaining counts
  for (const c of count.values()) ready.push(c);
  const cooling: [number, number][] = [];                     // [remaining count, time it is ready again]
  let head = 0, time = 0;
  while (ready.size > 0 || head < cooling.length) {
    time++;
    if (ready.size > 0) {
      const c = ready.pop()! - 1;                             // run the most frequent ready task
      if (c > 0) cooling.push([c, time + n]);                 // it may run again after n more slots
    }                                                         // else: an idle slot
    if (head < cooling.length && cooling[head][1] === time) ready.push(cooling[head++][0]);
  }
  return time;
}
// #endregion

// #region congthuc
function leastIntervalFormula(tasks: string[], n: number): number {
  const count = new Array(26).fill(0);
  for (const t of tasks) count[t.charCodeAt(0) - 65]++;
  const maxC = Math.max(...count);
  const numMax = count.filter((c) => c === maxC).length;      // how many letters tie for the max
  return Math.max(tasks.length, (maxC - 1) * (n + 1) + numMax);
}
// #endregion

const cases: [string, number][] = [['AAABBC', 2], ['AAAABBBB', 1], ['CCCDD', 0], ['ABCDEFA', 2], ['AAAAAABCDEFG', 2]];
for (const [s, n] of cases) {
  const tasks = s.split('');
  console.log(`tasks=${s} n=${n}: heap=${leastIntervalHeap(tasks, n)} formula=${leastIntervalFormula(tasks, n)}`);
}
