// BFS level order: the queue holds the "frontier"; freeze its size to know where a level ends.
const graph = new GraphTracer('Tree [1,2,3,4,5,null,6]', true);
const qt = new Array1DTracer('queue (front on the left)');
const log = new LogTracer('levels');
const A = [1, 2, 3, 4, 5, null, 6];
function build(a) {
  if (!a.length || a[0] === null) return null;
  const root = { v: a[0], l: null, r: null }; const q = [root]; let h = 0, i = 1;
  while (i < a.length) {
    const n = q[h++];
    if (a[i] !== null) { n.l = { v: a[i], l: null, r: null }; q.push(n.l); } i++;
    if (i < a.length && a[i] !== null) { n.r = { v: a[i], l: null, r: null }; q.push(n.r); } i++;
  }
  return root;
}
const root = build(A);
let col = 0, maxD = 0;
function lay(n, d) { if (!n) return; if (d > maxD) maxD = d; lay(n.l, d + 1); n.x = col++; n.d = d; lay(n.r, d + 1); }
lay(root, 0);
const parent = {};
function place(n, p) {
  if (!n) return;
  graph.addNode(n.v, null, 0.08 + 0.84 * n.x / Math.max(1, col - 1), 0.12 + 0.76 * n.d / Math.max(1, maxD));
  if (p) { graph.addEdge(p.v, n.v); parent[n.v] = p.v; }
  place(n.l, n); place(n.r, n);
}
place(root, null);
const queue = [root];
let head = 0, lv = 0;
qt.set(queue.slice(head).map(function (n) { return n.v; }));
log.println('Start: queue = [1]. Each round: size = items in the queue NOW = one whole level.');
Tracer.delay();
const res = [];
while (head < queue.length) {
  const size = queue.length - head;
  log.println('level ' + lv + ': size frozen at ' + size);
  Tracer.delay();
  const level = [];
  for (let k = 0; k < size; k++) {
    const n = queue[head++];
    graph.visit(n.v, parent[n.v] === undefined ? null : parent[n.v], lv);
    level.push(n.v);
    if (n.l) queue.push(n.l);
    if (n.r) queue.push(n.r);
    qt.set(queue.slice(head).map(function (x) { return x.v; }));
    log.println('  dequeue ' + n.v + ', enqueue its children -> queue = [' + queue.slice(head).map(function (x) { return x.v; }).join(',') + ']');
    Tracer.delay();
  }
  res.push(level);
  log.println('level ' + lv + ' done: [' + level.join(',') + ']');
  Tracer.delay();
  lv++;
}
log.println('result = ' + JSON.stringify(res));
Tracer.delay();
