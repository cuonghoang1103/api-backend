// DFS with three colours finds the cycle 1 -> 2 -> 3 -> 1. Selected (highlighted) = GRAY (on the current path).
const graph = new GraphTracer('Directed graph with a cycle', true);
const log = new LogTracer('colours');
const P = [[0.08, 0.50], [0.35, 0.20], [0.65, 0.20], [0.50, 0.75], [0.30, 0.85]];
for (let i = 0; i < P.length; i++) graph.addNode(i, null, P[i][0], P[i][1]);
const E = [[0, 1], [1, 2], [2, 3], [3, 1], [0, 4]];
const out = [[], [], [], [], []];
for (const [u, v] of E) { graph.addEdge(u, v); out[u].push(v); }
log.println('WHITE = not visited, GRAY = on the current path, BLACK = finished.');
Tracer.delay();
const color = [0, 0, 0, 0, 0];
const path = [];
let found = null;
function visit(u, from) {
  color[u] = 1; path.push(u);
  graph.visit(u, from);
  log.println('enter ' + u + ' -> GRAY. path = ' + path.join(' -> '));
  Tracer.delay();
  for (const v of out[u]) {
    if (found) return;
    if (color[v] === 1) {
      found = path.slice(path.indexOf(v)).concat([v]);
      graph.select(v, u);
      log.println('edge ' + u + ' -> ' + v + ': ' + v + ' is GRAY (still on the path) => CYCLE ' + found.join(' -> '));
      Tracer.delay();
      return;
    }
    if (color[v] === 0) visit(v, u);
  }
  if (found) return;
  color[u] = 2; path.pop();
  graph.leave(u, from);
  log.println('leave ' + u + ' -> BLACK');
  Tracer.delay();
}
visit(0, null);
log.println(found ? 'No topological order exists: 1, 2, 3 each wait for another.' : 'No cycle.');
Tracer.delay();
