// The same 7 keys, two insertion orders: sorted -> a chain of height 7; middle-first -> a balanced tree of height 3.
const g1 = new GraphTracer('insert 1,2,3,4,5,6,7 (sorted)', true);
const g2 = new GraphTracer('insert 4,2,6,1,3,5,7 (middle first)', true);
const log = new LogTracer('height = number of comparisons for the worst search');
function insert(root, v) { const nd = { v: v, l: null, r: null }; if (!root) return { root: nd, parent: null }; let c = root, p = null; while (c) { p = c; c = v < c.v ? c.l : c.r; } if (v < p.v) p.l = nd; else p.r = nd; return { root: root, parent: p }; }
function layout(order) {
  let root = null;
  for (const v of order) root = insert(root, v).root;
  const pos = {}; let col = 0, maxD = 0;
  (function lay(n, d) { if (!n) return; if (d > maxD) maxD = d; lay(n.l, d + 1); pos[n.v] = [col++, d]; lay(n.r, d + 1); })(root, 0);
  return { pos: pos, cols: col, maxD: maxD };
}
function play(g, order) {
  const L = layout(order);
  let root = null, h = 0;
  for (const v of order) {
    const r = insert(root, v); root = r.root;
    const p = L.pos[v];
    g.addNode(v, null, 0.08 + 0.84 * p[0] / Math.max(1, L.cols - 1), 0.1 + 0.8 * p[1] / Math.max(1, L.maxD));
    if (r.parent) { g.addEdge(r.parent.v, v); g.visit(v, r.parent.v); } else g.visit(v);
    h = Math.max(h, p[1] + 1);
    log.println('insert ' + v + '  -> height ' + h);
    Tracer.delay();
  }
  return h;
}
const h1 = play(g1, [1, 2, 3, 4, 5, 6, 7]);
log.println('sorted input: every key goes RIGHT; the "tree" is a linked list, height ' + h1 + ' = n');
Tracer.delay();
const h2 = play(g2, [4, 2, 6, 1, 3, 5, 7]);
log.println('middle first: height ' + h2 + ' = log2(n+1). Same keys, ' + h1 + ' vs ' + h2 + ' steps per search.');
Tracer.delay();
