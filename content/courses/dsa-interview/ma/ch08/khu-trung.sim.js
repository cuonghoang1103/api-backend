// Subsets II on [1,2,2]: the tree WITH the branches that the "i > start && a[i] == a[i-1]" rule cuts.
// 2' is the second copy of 2. A node whose name ends in "x" is a branch that was skipped (never explored).
const g = new GraphTracer('Subsets II [1,2,2] — x = twin skipped at the same level', true);
const log = new LogTracer('record / skip');
const a = [1, 2, 2];
const lab = ['1', '2', "2'"];
const nodes = [['{}', 0.5, 0.1], ['1', 0.25, 0.37], ['1,2', 0.14, 0.63], ["1,2,2'", 0.14, 0.9], ["1,2'x", 0.36, 0.63],
  ['2', 0.62, 0.37], ["2,2'", 0.62, 0.63], ["2'x", 0.88, 0.37]];
nodes.forEach(function (n) { g.addNode(n[0], null, n[1], n[2]); });
[['{}', '1'], ['1', '1,2'], ['1,2', "1,2,2'"], ['1', "1,2'x"], ['{}', '2'], ['2', "2,2'"], ['{}', "2'x"]].forEach(function (e) { g.addEdge(e[0], e[1]); });
log.println('Sorted: [1, 2, 2\']. Rule: at one level, do not start a second branch with a value already tried there.');
Tracer.delay();
const path = [];
let rec = 0;
function nm(p) { return p.length ? p.map(function (i) { return lab[i]; }).join(',') : '{}'; }
function bt(start, parent) {
  const me = nm(path);
  g.visit(me, parent);
  rec++;
  g.updateNode(me, rec);
  log.println('record #' + rec + ': [' + path.map(function (i) { return a[i]; }).join(',') + ']');
  Tracer.delay();
  for (let i = start; i < a.length; i++) {
    if (i > start && a[i] === a[i - 1]) {
      const sk = nm(path.concat([i])) + 'x';
      g.select(sk, me);
      log.println('  SKIP ' + lab[i] + ' under [' + path.map(function (j) { return a[j]; }).join(',') + ']: a 2 was already tried at this level -> its whole subtree would repeat');
      Tracer.delay();
      g.deselect(sk, me);
      continue;
    }
    path.push(i);
    bt(i + 1, me);
    path.pop();
  }
  g.leave(me, parent);
}
bt(0, null);
log.println('6 answers instead of 8; the two skipped branches were the duplicates [1,2] and [2].');
Tracer.delay();
