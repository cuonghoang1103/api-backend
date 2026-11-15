// Climbing Stairs (LC 70), n = 5: the naive recursion tree, then the same question asked with a memo.
const log = new LogTracer('what happens');
const N = 5;
function draw(title, useMemo) {
  const g = new GraphTracer(title, true);
  const nodes = [], memo = {};
  let id = 0, leaf = 0;
  function build(n, d) {
    const me = { id: 'v' + id++, n: n, d: d, kids: [], hit: false };
    nodes.push(me);
    if (n > 1 && useMemo && memo[n]) me.hit = true;
    else if (n > 1) { me.kids.push(build(n - 1, d + 1), build(n - 2, d + 1)); memo[n] = true; }
    me.x = me.kids.length ? (me.kids[0].x + me.kids[1].x) / 2 : leaf++;
    return me;
  }
  const root = build(N, 0);
  let maxD = 0;
  nodes.forEach(function (v) { if (v.d > maxD) maxD = v.d; });
  nodes.forEach(function (v) { g.addNode(v.id, v.n, 0.05 + 0.9 * v.x / Math.max(1, leaf - 1), 0.08 + 0.84 * v.d / maxD); });
  nodes.forEach(function (v) { v.kids.forEach(function (k) { g.addEdge(v.id, k.id); }); });
  const seen = {};
  function walk(v, p) {
    seen[v.n] = (seen[v.n] || 0) + 1;
    if (v.hit) { g.select(v.id, p.id); log.println('climb(' + v.n + ') -> already in the memo, answer read in O(1), no children'); }
    else {
      g.visit(v.id, p ? p.id : null);
      log.println('climb(' + v.n + ')' + (seen[v.n] > 1 ? '   <- computing it AGAIN (time #' + seen[v.n] + ')' : ''));
    }
    Tracer.delay();
    v.kids.forEach(function (k) { walk(k, v); });
  }
  walk(root, null);
  log.println(title.split(':')[0] + ': ' + nodes.length + ' calls for n = ' + N);
  Tracer.delay();
}
log.println('Each node is one call climb(n); the number on it is n. Its children are climb(n-1) and climb(n-2).');
Tracer.delay();
draw('naive: the same n is solved again and again', false);
draw('memo: each n is solved once, a repeat is a lookup', true);
log.println('n = 30: naive 2,692,537 calls, memo 59. That is the whole idea of dynamic programming.');
Tracer.delay();
