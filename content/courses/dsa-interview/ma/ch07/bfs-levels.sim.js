// BFS visits by distance (levels); DFS dives. Same 7-node graph, source 0.
const graph = new GraphTracer('Undirected graph', false);
const log = new LogTracer('queue / stack');
const P = [[0.08, 0.35], [0.30, 0.15], [0.30, 0.60], [0.55, 0.35], [0.75, 0.35], [0.94, 0.35], [0.30, 0.92]];
for (let i = 0; i < P.length; i++) graph.addNode(i, null, P[i][0], P[i][1]);
const adj = [[1, 2], [0, 3], [0, 3, 6], [1, 2, 4], [3, 5], [4], [2]];
const E = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [4, 5], [2, 6]];
for (const [u, v] of E) graph.addEdge(u, v);
log.println('BFS from 0. dist = -1 means not discovered. The number on a node = its distance.');
Tracer.delay();
const dist = [-1, -1, -1, -1, -1, -1, -1];
const q = [0];
dist[0] = 0;
graph.visit(0, null, 0);
Tracer.delay();
for (let head = 0; head < q.length; head++) {
  const u = q[head];
  graph.select(u);
  log.println('dequeue ' + u + ' (distance ' + dist[u] + ')   waiting: [' + q.slice(head + 1).join(', ') + ']');
  Tracer.delay();
  for (const v of adj[u]) {
    if (dist[v] !== -1) continue;
    dist[v] = dist[u] + 1;
    q.push(v);
    graph.visit(v, u, dist[v]);
    log.println('   discover ' + v + ' -> distance ' + dist[v] + ', enqueue');
    Tracer.delay();
  }
  graph.deselect(u);
}
log.println('BFS order ' + q.join(' ') + ' — never visits a distance-3 node before every distance-2 node.');
Tracer.delay();
const g2 = new GraphTracer('Same graph, recursive DFS', false);
for (let i = 0; i < P.length; i++) g2.addNode(i, null, P[i][0], P[i][1]);
for (const [u, v] of E) g2.addEdge(u, v);
const seen = [false, false, false, false, false, false, false];
const order = [];
function dfs(u, from) {
  seen[u] = true; order.push(u);
  g2.visit(u, from);
  log.println('DFS enters ' + u + '   order so far: ' + order.join(' '));
  Tracer.delay();
  for (const v of adj[u]) if (!seen[v]) dfs(v, u);
  g2.leave(u);
}
dfs(0, null);
log.println('DFS order ' + order.join(' ') + ' — it went 0 -> 1 -> 3 -> 2 deep before ever touching 4.');
Tracer.delay();
