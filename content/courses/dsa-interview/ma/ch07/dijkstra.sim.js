// Dijkstra with a min-heap on the (made-up) map around FPTU: settle the closest place, relax its roads.
const graph = new GraphTracer('Minutes between places (made-up)', false);
const log = new LogTracer('heap = [minutes, place]');
const N = ['Tro', 'ThuDuc', 'SuoiTien', 'FPTU', 'Vincom', 'ManThien'];
const P = [[0.08, 0.50], [0.40, 0.12], [0.70, 0.15], [0.94, 0.50], [0.35, 0.80], [0.66, 0.85]];
for (let i = 0; i < N.length; i++) graph.addNode(N[i], null, P[i][0], P[i][1]);
const R = [[0, 1, 7], [0, 4, 4], [4, 5, 3], [5, 3, 6], [1, 2, 5], [2, 3, 4], [4, 1, 2], [5, 2, 5]];
const adj = [[], [], [], [], [], []];
for (const [u, v, w] of R) { graph.addEdge(N[u], N[v], w); adj[u].push([v, w]); adj[v].push([u, w]); }
const dist = [0, Infinity, Infinity, Infinity, Infinity, Infinity];
let heap = [[0, 0]];
graph.updateNode(N[0], 0);
log.println('Start at Tro, distance 0. Every other place: infinity.');
Tracer.delay();
const show = function () { return heap.slice().sort(function (a, b) { return a[0] - b[0]; }).map(function (x) { return '[' + x[0] + ',' + N[x[1]] + ']'; }).join(' '); };
while (heap.length) {
  heap.sort(function (a, b) { return a[0] - b[0]; });
  const top = heap.shift();
  const d = top[0], u = top[1];
  if (d > dist[u]) { log.println('pop [' + d + ',' + N[u] + '] is STALE (already ' + dist[u] + ') -> skip'); Tracer.delay(); continue; }
  graph.select(N[u]);
  log.println('settle ' + N[u] + ' at ' + d + ' min. heap: ' + show());
  Tracer.delay();
  for (const [v, w] of adj[u]) {
    if (d + w < dist[v]) {
      dist[v] = d + w;
      heap.push([dist[v], v]);
      graph.visit(N[v], N[u], dist[v]);
      log.println('   relax ' + N[u] + ' -> ' + N[v] + ': ' + d + ' + ' + w + ' = ' + dist[v]);
      Tracer.delay();
      graph.leave(N[v], N[u]);
    }
  }
  graph.deselect(N[u]);
}
log.println('FPTU in ' + dist[3] + ' minutes. Each place was settled once, in increasing order of distance.');
Tracer.delay();
