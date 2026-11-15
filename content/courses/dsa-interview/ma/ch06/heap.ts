// @java: HeapDemo.java
// A binary min-heap you can rewrite from memory in an interview (JavaScript has no built-in heap).
// cmp works like a Java Comparator: negative = "a comes out first".

// #region heap
class MinHeap<T> {
  a: T[] = [];                                       // the tree, stored level by level
  constructor(private cmp: (x: T, y: T) => number) {}
  get size() { return this.a.length; }
  peek() { return this.a[0]; }
  push(x: T) {
    const a = this.a; a.push(x);                     // add as the last leaf
    for (let i = a.length - 1; i > 0; ) {            // sift up
      const p = (i - 1) >> 1;
      if (this.cmp(a[i], a[p]) >= 0) break;          // parent already first: stop
      [a[i], a[p]] = [a[p], a[i]]; i = p;
    }
  }
  pop() {
    const a = this.a, top = a[0], last = a.pop()!;   // remove the last leaf
    if (a.length === 0) return top;                  // it was the only one (or empty)
    a[0] = last;                                     // last leaf takes the root…
    for (let i = 0; ; ) {                            // …and sifts down
      const l = 2 * i + 1, r = l + 1; let m = i;
      if (l < a.length && this.cmp(a[l], a[m]) < 0) m = l;
      if (r < a.length && this.cmp(a[r], a[m]) < 0) m = r;
      if (m === i) return top;                       // both children are not smaller: stop
      [a[i], a[m]] = [a[m], a[i]]; i = m;
    }
  }
}
// #endregion

// #region dung
const minH = new MinHeap<number>((a, b) => a - b);        // min-heap of numbers
const maxH = new MinHeap<number>((a, b) => b - a);        // flip the comparator = max-heap
type Task = { name: string; prio: number };
const tasks = new MinHeap<Task>((a, b) => a.prio - b.prio || a.name.localeCompare(b.name));
// #endregion

for (const x of [5, 3, 8, 1, 9, 2]) {
  minH.push(x);
  console.log(`push ${x} -> array ${JSON.stringify(minH.a)}`);
}
console.log(`peek = ${minH.peek()}, size = ${minH.size}`);
const out: number[] = [];
while (minH.size > 0) {
  out.push(minH.pop() as number);
  if (out.length <= 2) console.log(`pop ${out[out.length - 1]} -> array ${JSON.stringify(minH.a)}`);
}
console.log(`all pops = ${JSON.stringify(out)}`);
for (const x of [5, 3, 8, 1, 9, 2]) maxH.push(x);
const outMax: number[] = [];
while (maxH.size > 0) outMax.push(maxH.pop() as number);
console.log(`max-heap pops = ${JSON.stringify(outMax)}`);
for (const [name, prio] of [['deploy', 2], ['backup', 3], ['alert', 1], ['report', 3], ['build', 2]] as [string, number][]) tasks.push({ name, prio });
const order: string[] = [];
while (tasks.size > 0) { const t = tasks.pop() as Task; order.push(`${t.name}:${t.prio}`); }
console.log(`tasks = ${JSON.stringify(order)}`);
console.log(`pop on empty = ${String(minH.pop() ?? null)}`);
