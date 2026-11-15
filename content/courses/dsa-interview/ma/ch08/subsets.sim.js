// Subsets of [1,2,3]: the state-space tree. Each node is the current path; the number above it is the
// order in which it was recorded. Green edge = choose, the edge turns back = unchoose.
const g = new GraphTracer('State-space tree of subsets([1,2,3])  (number = recording order)', true);
const log = new LogTracer('choose -> explore -> unchoose');
const nums = [1, 2, 3];
const name = (p) => (p.length ? p.join('') : '{}');
// Lay out the tree first (pre-order x, depth y) so the picture is stable.
const order = [];
(function lay(start, p) {
  order.push(p.slice());
  for (let i = start; i < nums.length; i++) { p.push(nums[i]); lay(i + 1, p); p.pop(); }
})(0, []);
order.forEach(function (p, k) { g.addNode(name(p), null, 0.06 + 0.88 * k / (order.length - 1), 0.12 + 0.25 * p.length); });
order.forEach(function (p) { if (p.length) g.addEdge(name(p.slice(0, -1)), name(p)); });
log.println('Every node of this tree is one subset. We start at {} with nothing chosen.');
Tracer.delay();
const path = [];
let rec = 0;
function backtrack(start, parent) {
  g.visit(name(path), parent);
  rec++;
  g.updateNode(name(path), rec);
  log.println('record #' + rec + ': [' + path.join(',') + ']   choices left: [' + nums.slice(start).join(',') + ']');
  Tracer.delay();
  for (let i = start; i < nums.length; i++) {
    const me = name(path);
    path.push(nums[i]);
    log.println('  choose ' + nums[i] + ' -> path [' + path.join(',') + ']');
    backtrack(i + 1, me);
    path.pop();
    log.println('  unchoose ' + nums[i] + ' -> back to [' + path.join(',') + ']');
    Tracer.delay();
  }
  g.leave(name(path), parent);
}
backtrack(0, null);
log.println('8 nodes = 2^3 subsets. Each was copied once: O(2^n * n) in total.');
Tracer.delay();
