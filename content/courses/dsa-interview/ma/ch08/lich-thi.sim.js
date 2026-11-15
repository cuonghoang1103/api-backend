// Exam timetable as graph colouring: an edge = two exams share a student; the number above a node = its slot.
// Backtracking tries slot 1, 2, 3 for each exam in turn, skipping slots a neighbour already uses.
const exams = ['SWT301', 'FER202', 'SWR302', 'JPD123', 'LAB211', 'MAS291'];
const edges = [[0, 1], [0, 2], [1, 2], [1, 3], [2, 3], [3, 4], [4, 0], [5, 0], [5, 2], [4, 5]];
const SLOTS = 3;
const g = new GraphTracer('Exams (edge = shared student), number = slot', false);
const log = new LogTracer('assign / clash / undo');
exams.forEach(function (e, i) {
  const a = Math.PI * 2 * i / exams.length - Math.PI / 2;
  g.addNode(e, null, 0.5 + 0.38 * Math.cos(a), 0.5 + 0.38 * Math.sin(a));
});
edges.forEach(function (e) { g.addEdge(exams[e[0]], exams[e[1]]); });
log.println(exams.length + ' exams, ' + SLOTS + ' slots. Rule: two exams joined by an edge cannot share a slot.');
Tracer.delay();
const adj = exams.map(function () { return []; });
edges.forEach(function (e) { adj[e[0]].push(e[1]); adj[e[1]].push(e[0]); });
const slot = exams.map(function () { return -1; });
function bt(i) {
  if (i === exams.length) { log.println('Every exam has a slot. Done.'); Tracer.delay(); return true; }
  g.select(exams[i]);
  for (let s = 0; s < SLOTS; s++) {
    const clash = adj[i].filter(function (o) { return slot[o] === s; });
    if (clash.length) {
      log.println(exams[i] + ': slot ' + (s + 1) + ' clashes with ' + clash.map(function (o) { return exams[o]; }).join(', ') + ' -> skip');
      Tracer.delay();
      continue;
    }
    slot[i] = s;
    g.updateNode(exams[i], s + 1);
    log.println(exams[i] + ' -> slot ' + (s + 1));
    Tracer.delay();
    if (bt(i + 1)) return true;
    slot[i] = -1;
    g.updateNode(exams[i], null);
    log.println('undo ' + exams[i] + ' (slot ' + (s + 1) + ' led to a dead end)');
    Tracer.delay();
  }
  g.deselect(exams[i]);
  log.println(exams[i] + ': no slot fits -> go back to ' + (i ? exams[i - 1] : 'the start'));
  Tracer.delay();
  return false;
}
bt(0);
