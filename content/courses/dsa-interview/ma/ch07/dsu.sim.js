// Union-find on LC 684's example: edges arrive one by one; the parent array shows the trees.
const graph = new GraphTracer('Edges accepted so far', false);
const par = new Array1DTracer('parent[1..5]');
const log = new LogTracer('union-find');
const P = [[0.15, 0.25], [0.45, 0.10], [0.75, 0.25], [0.60, 0.70], [0.20, 0.75]];
for (let i = 1; i <= 5; i++) graph.addNode(i, null, P[i - 1][0], P[i - 1][1]);
const parent = [0, 1, 2, 3, 4, 5], size = [0, 1, 1, 1, 1, 1];
const showPar = function () { par.set(parent.slice(1)); };
showPar();
log.println('Everyone is their own root: parent[i] = i.');
Tracer.delay();
function find(x) {
  let r = x;
  while (parent[r] !== r) r = parent[r];
  while (parent[x] !== r) { const nx = parent[x]; parent[x] = r; x = nx; }
  return r;
}
const E = [[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]];
for (const [a, b] of E) {
  graph.select(a); graph.select(b);
  const ra = find(a), rb = find(b);
  showPar();
  log.println('edge ' + a + '-' + b + ': find(' + a + ') = ' + ra + ', find(' + b + ') = ' + rb);
  Tracer.delay();
  if (ra === rb) {
    log.println('   same root -> ' + a + ' and ' + b + ' are ALREADY connected: edge [' + a + ', ' + b + '] closes a cycle (the answer).');
    par.patch(a - 1); par.patch(b - 1);
    Tracer.delay();
    par.depatch(a - 1); par.depatch(b - 1);
  } else {
    let big = ra, small = rb;
    if (size[big] < size[small]) { big = rb; small = ra; }
    parent[small] = big; size[big] += size[small];
    graph.addEdge(a, b); graph.visit(b, a);
    showPar();
    par.select(small - 1);
    log.println('   different roots -> parent[' + small + '] = ' + big + ' (the smaller tree hangs under the bigger)');
    Tracer.delay();
    par.deselect(small - 1);
  }
  graph.deselect(a); graph.deselect(b);
}
log.println('Near-O(1) per edge: path compression + union by size keep every tree almost flat.');
Tracer.delay();
