// One DFS walk, three moments: pre-order emits on ENTER, in-order BETWEEN the children, post-order on LEAVE.
const graph = new GraphTracer('Tree [1,2,3,4,5,null,6]', true);
const log = new LogTracer('pre / in / post');
const A = [1, 2, 3, 4, 5, null, 6];
// build from the LeetCode array
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
// layout: x = in-order position, y = depth (coordinates 0..1)
let col = 0, maxD = 0;
function lay(n, d) { if (!n) return; if (d > maxD) maxD = d; lay(n.l, d + 1); n.x = col++; n.d = d; lay(n.r, d + 1); }
lay(root, 0);
function place(n, p) {
  if (!n) return;
  graph.addNode(n.v, null, 0.08 + 0.84 * n.x / Math.max(1, col - 1), 0.12 + 0.76 * n.d / Math.max(1, maxD));
  if (p) graph.addEdge(p.v, n.v);
  place(n.l, n); place(n.r, n);
}
place(root, null);
log.println('Tree built from [1,2,3,4,5,null,6]. One recursive walk; watch WHEN each node is written down.');
Tracer.delay();
const pre = [], ino = [], post = [];
function dfs(n, p) {
  if (!n) return;
  graph.visit(n.v, p ? p.v : null);
  pre.push(n.v);
  log.println('enter ' + n.v + '   -> pre-order writes ' + n.v + '   pre = [' + pre.join(',') + ']');
  Tracer.delay();
  dfs(n.l, n);
  graph.select(n.v);
  ino.push(n.v);
  log.println('back at ' + n.v + ' from the left -> in-order writes ' + n.v + '   in = [' + ino.join(',') + ']');
  Tracer.delay();
  dfs(n.r, n);
  post.push(n.v);
  graph.leave(n.v, p ? p.v : null);
  log.println('leave ' + n.v + '   -> post-order writes ' + n.v + '   post = [' + post.join(',') + ']');
  Tracer.delay();
}
dfs(root, null);
log.println('pre  = [' + pre.join(',') + ']   (root first: copy a folder)');
log.println('in   = [' + ino.join(',') + ']   (left, root, right: sorted order in a BST)');
log.println('post = [' + post.join(',') + ']   (children first: folder sizes, rm -rf)');
Tracer.delay();
