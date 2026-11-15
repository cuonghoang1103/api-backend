// @thoi-gian
// Measure three JavaScript queues on the same BFS-like workload: n/2 elements waiting, then n rounds of (enqueue 1, dequeue 1).
//   A. array + shift()       — what most people write
//   B. array + head index    — never remove from the front, just move an index
//   C. ring-buffer Deque     — fixed array that wraps around, grows by doubling (O(1) at both ends)

// #region deque
class Deque<T> {
  private a: (T | undefined)[] = new Array(16);
  private head = 0;
  size = 0;
  private grow(): void {                           // copy into an array twice as big, front at index 0
    const b = new Array<T | undefined>(this.a.length * 2);
    for (let i = 0; i < this.size; i++) b[i] = this.a[(this.head + i) % this.a.length];
    this.a = b; this.head = 0;
  }
  pushBack(x: T): void { if (this.size === this.a.length) this.grow(); this.a[(this.head + this.size++) % this.a.length] = x; }
  pushFront(x: T): void { if (this.size === this.a.length) this.grow(); this.head = (this.head - 1 + this.a.length) % this.a.length; this.a[this.head] = x; this.size++; }
  popFront(): T | undefined { if (!this.size) return undefined; const x = this.a[this.head]; this.a[this.head] = undefined; this.head = (this.head + 1) % this.a.length; this.size--; return x; }
  popBack(): T | undefined { if (!this.size) return undefined; const i = (this.head + --this.size) % this.a.length; const x = this.a[i]; this.a[i] = undefined; return x; }
  peekFront(): T | undefined { return this.size ? this.a[this.head] : undefined; }
}
// #endregion

function withShift(n: number): number {
  const q: number[] = [];
  for (let i = 0; i < n / 2; i++) q.push(i);
  let s = 0;
  for (let i = 0; i < n; i++) { q.push(i); s += q.shift()!; }
  return s;
}
function withHead(n: number): number {
  const q: number[] = [];
  let head = 0, s = 0;
  for (let i = 0; i < n / 2; i++) q.push(i);
  for (let i = 0; i < n; i++) { q.push(i); s += q[head++]; }
  return s;
}
function withDeque(n: number): number {
  const q = new Deque<number>();
  let s = 0;
  for (let i = 0; i < n / 2; i++) q.pushBack(i);
  for (let i = 0; i < n; i++) { q.pushBack(i); s += q.popFront()!; }
  return s;
}
function ms(f: () => unknown, lap = 3): number {
  let best = Infinity;
  for (let k = 0; k < lap; k++) { const t = performance.now(); f(); best = Math.min(best, performance.now() - t); }
  return best;
}
const pad = (s: string | number, w: number) => String(s).padStart(w);
console.log(`${pad('n', 10)} | ${pad('A shift()', 12)} | ${pad('B head index', 12)} | ${pad('C ring deque', 12)}`);
for (const n of [1_000, 10_000, 20_000, 100_000, 200_000, 1_000_000]) {
  const a = n <= 200_000 ? ms(() => withShift(n), n >= 100_000 ? 1 : 3).toFixed(2) + ' ms' : 'skipped';
  console.log(`${pad(n.toLocaleString('en-US'), 10)} | ${pad(a, 12)} | ${pad(ms(() => withHead(n)).toFixed(2) + ' ms', 12)} | ${pad(ms(() => withDeque(n)).toFixed(2) + ' ms', 12)}`);
}
console.log(`node ${process.version} · ${process.arch}`);
