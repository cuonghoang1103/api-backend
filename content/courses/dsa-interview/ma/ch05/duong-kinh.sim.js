// Diameter of a binary tree: each call returns its HEIGHT to the parent (shown above the node), and updates the
// best path that BENDS at the node (left height + right height).
const graph = new GraphTracer('Tree [1,2,3,4,5,null,6]  (number = height returned)', true);
const log = new LogTracer('returns, bottom-up');
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
function place(n, p) {
  if (!n) return;
  graph.addNode(n.v, null, 0.08 + 0.84 * n.x / Math.max(1, col - 1), 0.14 + 0.74 * n.d / Math.max(1, maxD));
  if (p) graph.addEdge(p.v, n.v);
  place(n.l, n); place(n.r, n);
}
place(root, null);
log.println('height(null) = 0. Each node returns 1 + max(left, right) and tries left + right as a bent path.');
Tracer.delay();
let best = 0;
const path = [];
function height(n, p) {
  if (!n) return 0;
  graph.visit(n.v, p ? p.v : null);
  path.push(n.v);
  log.println('call height(' + n.v + ')   call stack: ' + path.join(' > '));
  Tracer.delay();
  const l = height(n.l, n);
  const r = height(n.r, n);
  const h = 1 + Math.max(l, r);
  if (l + r > best) { best = l + r; log.println('  at ' + n.v + ': left ' + l + ' + right ' + r + ' = ' + (l + r) + '  -> NEW best ' + best); }
  else log.println('  at ' + n.v + ': left ' + l + ' + right ' + r + ' = ' + (l + r) + '  (best stays ' + best + ')');
  graph.updateNode(n.v, h);
  graph.leave(n.v, p ? p.v : null);
  path.pop();
  log.println('  return ' + h + ' to ' + (p ? p.v : 'the caller'));
  Tracer.delay();
  return h;
}
height(root, null);
log.println('diameter = ' + best + ' edges');
Tracer.delay();
