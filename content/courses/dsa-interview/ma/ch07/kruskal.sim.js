// Kruskal on LC 1584's example: cheapest edge first; union-find rejects any edge that would close a cycle.
const graph = new GraphTracer('Points (Manhattan distance)', false);
const log = new LogTracer('Kruskal');
const pts = [[0, 0], [2, 2], [3, 10], [5, 2], [7, 0]];
for (let i = 0; i < pts.length; i++) graph.addNode(i, null, 0.08 + pts[i][0] / 8.5, 0.92 - pts[i][1] / 11.5);
const edges = [];
for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++)
  edges.push([Math.abs(pts[i][0] - pts[j][0]) + Math.abs(pts[i][1] - pts[j][1]), i, j]);
edges.sort(function (a, b) { return a[0] - b[0] || a[1] - b[1] || a[2] - b[2]; });
log.println(edges.length + ' candidate edges, sorted by cost. A tree on 5 points needs 4 of them.');
Tracer.delay();
const parent = [0, 1, 2, 3, 4];
function find(x) { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; }
let cost = 0, used = 0;
for (const [w, i, j] of edges) {
  if (used === 4) break;
  graph.select(i); graph.select(j);
  const a = find(i), b = find(j);
  if (a === b) {
    log.println('edge ' + i + '-' + j + ' (' + w + '): ' + i + ' and ' + j + ' already connected -> SKIP (would close a cycle)');
  } else {
    parent[b] = a; cost += w; used++;
    graph.addEdge(i, j, w); graph.visit(j, i);
    log.println('edge ' + i + '-' + j + ' (' + w + '): different groups -> TAKE. total = ' + cost);
  }
  Tracer.delay();
  graph.deselect(i); graph.deselect(j);
}
log.println('Minimum total cost = ' + cost + ' with ' + used + ' edges.');
Tracer.delay();
