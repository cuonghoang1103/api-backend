// Validate a BST with ranges: every node inherits (lo, hi) from ALL its ancestors, not just its parent.
const graph = new GraphTracer('Tree [5,4,6,null,null,3,7]', true);
const log = new LogTracer('ranges');
const A = [5, 4, 6, null, null, 3, 7];
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
  graph.addNode(n.v, null, 0.1 + 0.8 * n.x / Math.max(1, col - 1), 0.14 + 0.74 * n.d / Math.max(1, maxD));
  if (p) graph.addEdge(p.v, n.v);
  place(n.l, n); place(n.r, n);
}
place(root, null);
log.println('Children-only check: 4 < 5 < 6 and 3 < 6 < 7 -> it says VALID. Now the range check:');
Tracer.delay();
const show = function (x, inf) { return x === null ? inf : String(x); };
function ok(n, p, lo, hi) {
  if (!n) return true;
  graph.visit(n.v, p ? p.v : null);
  const pass = (lo === null || n.v > lo) && (hi === null || n.v < hi);
  log.println('node ' + n.v + ' must be in (' + show(lo, '-inf') + ', ' + show(hi, '+inf') + ')  -> ' + (pass ? 'ok' : 'FAILS'));
  Tracer.delay();
  if (!pass) {
    log.println(n.v + ' sits in the RIGHT subtree of 5, so it must be > 5. Not a valid BST.');
    Tracer.delay();
    return false;
  }
  const res = ok(n.l, n, lo, n.v) && ok(n.r, n, n.v, hi);
  graph.leave(n.v, p ? p.v : null);
  return res;
}
const valid = ok(root, null, null, null);
log.println('isValidBST = ' + valid);
Tracer.delay();
