// Floyd's tortoise and hare on a linked list shaped like the digit 6: a tail 0 -> 1, then a cycle 2 -> 3 -> ... -> 7 -> 2.
const g = new GraphTracer('linked list (tail 0-1, cycle 2..7)', true);
const log = new LogTracer('slow moves 1, fast moves 2');
const N = 8, POS = 2;
const next = function (i) { return i + 1 < N ? i + 1 : POS; };
const xy = [[0.06, 0.5], [0.22, 0.5]];
for (let k = 0; k < N - POS; k++) {
  const a = Math.PI - (2 * Math.PI * k) / (N - POS);
  xy.push([0.62 + 0.25 * Math.cos(a), 0.5 - 0.36 * Math.sin(a)]);
}
for (let i = 0; i < N; i++) g.addNode(i, null, xy[i][0], xy[i][1]);
for (let i = 0; i < N; i++) g.addEdge(i, next(i));
log.println('Tail length a = ' + POS + ', cycle length L = ' + (N - POS) + '. Both pointers start at node 0.');
Tracer.delay();
let slow = 0, fast = 0, step = 0;
g.select(0);
Tracer.delay();
do {
  g.deselect(slow); g.deselect(fast);
  slow = next(slow);
  fast = next(next(fast));
  step++;
  g.select(slow); g.visit(fast);
  log.println('step ' + step + ': slow at ' + slow + ', fast at ' + fast + (slow === fast ? '   -> SAME NODE: there is a cycle' : ''));
  Tracer.delay();
} while (slow !== fast);
log.println('Phase 2: put one pointer back at node 0, keep the other at ' + slow + ', move both ONE step at a time.');
Tracer.delay();
let p = 0, q = slow;
g.leave(q);
while (p !== q) {
  g.deselect(p); g.deselect(q);
  p = next(p); q = next(q);
  g.select(p); g.select(q);
  log.println('   p at ' + p + ', q at ' + q + (p === q ? '   -> they meet at the ENTRY of the cycle: node ' + p : ''));
  Tracer.delay();
}
g.visit(p);
log.println('Entry = ' + p + ' (= pos). Extra memory used: two variables.');
Tracer.delay();
