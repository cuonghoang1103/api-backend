// @thoi-gian
// Measure cycle detection on a list of n nodes whose tail points back to the middle: Set of nodes vs Floyd.
class ListNode { next: ListNode | null = null; }
function build(n: number): ListNode {
  const nodes = Array.from({ length: n }, () => new ListNode());
  for (let i = 0; i + 1 < n; i++) nodes[i].next = nodes[i + 1];
  nodes[n - 1].next = nodes[n >> 1];
  return nodes[0];
}
function withSet(h: ListNode): number {          // returns how many entries the Set had to hold
  const seen = new Set<ListNode>();
  for (let p: ListNode | null = h; p !== null; p = p.next) { if (seen.has(p)) return seen.size; seen.add(p); }
  return -1;
}
function floyd(h: ListNode): number {            // returns how many steps slow made before meeting fast
  let slow: ListNode | null = h, fast: ListNode | null = h, steps = 0;
  while (fast !== null && fast.next !== null) {
    slow = slow!.next; fast = fast.next.next; steps++;
    if (slow === fast) return steps;
  }
  return -1;
}
function ms(f: () => unknown, lap = 5): number {
  let best = Infinity;
  for (let k = 0; k < lap; k++) { const t = performance.now(); f(); best = Math.min(best, performance.now() - t); }
  return best;
}
const pad = (s: string | number, w: number) => String(s).padStart(w);
console.log(`${pad('n', 10)} | ${pad('Set', 10)} | ${pad('Set entries', 12)} | ${pad('Floyd', 10)} | ${pad('slow steps', 11)} | Floyd extra memory`);
for (const n of [1_000, 10_000, 100_000, 1_000_000]) {
  const h = build(n);
  const a = ms(() => withSet(h)).toFixed(2) + ' ms';
  const b = ms(() => floyd(h)).toFixed(2) + ' ms';
  console.log(`${pad(n.toLocaleString('en-US'), 10)} | ${pad(a, 10)} | ${pad(withSet(h).toLocaleString('en-US'), 12)} | ${pad(b, 10)} | ${pad(floyd(h).toLocaleString('en-US'), 11)} | 2 references`);
}
console.log(`node ${process.version} · ${process.arch}`);
