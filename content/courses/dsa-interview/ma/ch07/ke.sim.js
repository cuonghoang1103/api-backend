// Edge list -> adjacency list, one edge at a time. Then: who are the neighbours of node 1?
const graph = new GraphTracer('Undirected graph (5 nodes)', false);
const log = new LogTracer('adjacency list');
const P = [[0.12, 0.30], [0.42, 0.30], [0.27, 0.78], [0.70, 0.30], [0.92, 0.65]];
for (let i = 0; i < P.length; i++) graph.addNode(i, null, P[i][0], P[i][1]);
const edges = [[0, 1], [0, 2], [1, 2], [1, 3], [3, 4]];
const adj = [[], [], [], [], []];
const show = function () { return adj.map(function (a, i) { return i + ': [' + a.join(', ') + ']'; }).join('   '); };
log.println('Start: 5 nodes, 0 edges. adj = five SEPARATE empty lists.');
Tracer.delay();
for (const [u, v] of edges) {
  graph.addEdge(u, v);
  graph.select(u); graph.select(v);
  adj[u].push(v); adj[v].push(u);
  log.println('edge ' + u + '-' + v + ': push ' + v + ' into adj[' + u + '] AND ' + u + ' into adj[' + v + ']');
  Tracer.delay();
  log.println('   ' + show());
  graph.deselect(u); graph.deselect(v);
  Tracer.delay();
}
log.println('Neighbours of 1 = adj[1] = [' + adj[1].join(', ') + ']  (degree ' + adj[1].length + ')');
graph.visit(1);
for (const v of adj[1]) { graph.visit(v, 1); Tracer.delay(); }
log.println('Sum of all list lengths = ' + adj.reduce(function (s, a) { return s + a.length; }, 0) + ' = 2 x 5 edges: each undirected edge is stored twice.');
Tracer.delay();
