// Priorities that arrive as STRINGS (query string, JSON from a form) compare as text: "10" < "9".

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

// #region tran
type Ticket = { id: string; prio: string };            // came from ?prio=… : always a string
const fromQuery: Ticket[] = [{ id: 'A', prio: '9' }, { id: 'B', prio: '10' }, { id: 'C', prio: '2' }, { id: 'D', prio: '100' }];

const wrong = new MinHeap<Ticket>((a, b) => (a.prio < b.prio ? -1 : a.prio > b.prio ? 1 : 0));   // text order
const right = new MinHeap<Ticket>((a, b) => Number(a.prio) - Number(b.prio));                      // number order
for (const t of fromQuery) { wrong.push(t); right.push(t); }
const drain = (h: MinHeap<Ticket>) => { const o: string[] = []; while (h.size) { const t = h.pop()!; o.push(`${t.id}(${t.prio})`); } return o.join(' '); };
console.log(`compare as strings : ${drain(wrong)}`);
console.log(`compare as numbers : ${drain(right)}`);
// #endregion
console.log(`"10" < "9" is ${'10' < '9'};  Number("1e3") = ${Number('1e3')};  Number("abc") = ${Number('abc')}`);
