// Reverse a linked list: nodes stay where they are in memory, only the NEXT arrows turn around.
// Top row = node values (position = node id). Second row = next[] (id of the next node, -1 = null).
const V = [1, 2, 3, 4, 5];
const n = V.length;
const vals = new Array1DTracer('node values (id 0..4)');
const nxt = new Array1DTracer('next[id]  (-1 = null)');
const log = new LogTracer('log');
const next = [];
for (let i = 0; i < n; i++) next.push(i + 1 < n ? i + 1 : -1);
vals.set(V);
nxt.set(next);
log.println('List: 1 -> 2 -> 3 -> 4 -> 5. prev = null, curr = node 0.');
Tracer.delay();
let prev = -1, curr = 0, step = 0;
while (curr !== -1) {
  step++;
  vals.select(curr);
  if (prev !== -1) vals.patch(prev);
  const save = next[curr];
  log.println('step ' + step + ': save next = ' + (save === -1 ? 'null' : V[save]) + ', point ' + V[curr] + ' back to ' + (prev === -1 ? 'null' : V[prev]));
  Tracer.delay();
  next[curr] = prev;
  nxt.set(next);
  nxt.select(curr);
  Tracer.delay();
  nxt.deselect(curr);
  vals.deselect(curr);
  if (prev !== -1) vals.depatch(prev);
  prev = curr;
  curr = save;
}
let s = [];
for (let p = prev; p !== -1; p = next[p]) s.push(V[p]);
log.println('curr is null, prev = node ' + V[prev] + ' = new head. List now: ' + s.join(' -> '));
Tracer.delay();
