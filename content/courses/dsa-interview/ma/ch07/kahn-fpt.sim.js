// Kahn's algorithm on real FPTU SE prerequisites (from the syllabi). Number on a node = unmet prerequisites.
const graph = new GraphTracer('Prerequisites (arrow = must come before)', true);
const log = new LogTracer('terms');
const P = {
  PRF192: [0.06, 0.20], DBI202: [0.06, 0.55], WED201c: [0.06, 0.85], JPD113: [0.06, 0.04],
  PRO192: [0.30, 0.20], FER202: [0.30, 0.85], JPD123: [0.30, 0.04],
  CSD201: [0.55, 0.06], LAB211: [0.55, 0.22], SWE201c: [0.55, 0.40], PRJ301: [0.55, 0.56], PRN212: [0.55, 0.70], SDN302: [0.55, 0.84], MMA301: [0.55, 0.97],
  SWP391: [0.86, 0.38], SWT301: [0.86, 0.56], SWR302: [0.86, 0.72],
};
const E = [['PRF192', 'PRO192'], ['PRO192', 'CSD201'], ['PRO192', 'LAB211'], ['PRO192', 'PRJ301'], ['DBI202', 'PRJ301'],
  ['PRO192', 'SWE201c'], ['PRJ301', 'SWP391'], ['SWE201c', 'SWP391'], ['LAB211', 'SWP391'], ['WED201c', 'FER202'],
  ['FER202', 'SDN302'], ['DBI202', 'SDN302'], ['FER202', 'MMA301'], ['PRO192', 'PRN212'], ['DBI202', 'PRN212'],
  ['SWE201c', 'SWT301'], ['SWE201c', 'SWR302'], ['JPD113', 'JPD123']];
const out = {}, indeg = {};
for (const k in P) { out[k] = []; indeg[k] = 0; }
for (const [a, b] of E) { out[a].push(b); indeg[b]++; }
for (const k in P) graph.addNode(k, indeg[k], P[k][0], P[k][1]);
for (const [a, b] of E) graph.addEdge(a, b);
log.println('Each number = how many prerequisites are still missing. 0 = can be taken now.');
Tracer.delay();
let level = Object.keys(P).filter(function (k) { return indeg[k] === 0; }).sort();
let term = 0;
while (level.length) {
  term++;
  log.println('Term ' + term + ': ' + level.join(', '));
  for (const u of level) graph.select(u);
  Tracer.delay();
  const next = [];
  for (const u of level) {
    graph.visit(u);
    for (const v of out[u]) {
      indeg[v]--;
      graph.visit(v, u, indeg[v]);
      graph.leave(v);
      if (indeg[v] === 0) next.push(v);
    }
    Tracer.delay();
  }
  for (const u of level) graph.deselect(u);
  level = next.sort();
}
log.println('All 17 subjects placed in ' + term + ' terms: the longest prerequisite chain PRF192 -> PRO192 -> PRJ301 -> SWP391 has 4 subjects.');
Tracer.delay();
