// Binary min-heap: the SAME data shown twice — as the array we store, and as the tree it means.
// Node label = position in the array; the number inside = the value. Parent of i = (i - 1) >> 1.
const arr = new Array1DTracer('heap array a[]');
const tree = new GraphTracer('the same heap as a tree', false);
const log = new LogTracer('log');
const OPS = [5, 3, 8, 1, 9, 2, 7, 'pop', 'pop'];
const POS = [[0.5, 0.12], [0.27, 0.42], [0.73, 0.42], [0.14, 0.75], [0.4, 0.75], [0.6, 0.75], [0.86, 0.75]];
const a = [];
let shown = 0;
function draw() {
  arr.set(a);
  while (shown < a.length) {
    tree.addNode(shown, a[shown], POS[shown][0], POS[shown][1]);
    if (shown > 0) tree.addEdge((shown - 1) >> 1, shown);
    shown++;
  }
  for (let i = 0; i < shown; i++) tree.updateNode(i, i < a.length ? a[i] : null);
}
function swap(i, j) { const t = a[i]; a[i] = a[j]; a[j] = t; }
log.println('Rule: every parent is <= its children, so the smallest value is always a[0].');
log.println('Children of i are 2i+1 and 2i+2. No pointers needed: the array IS the tree.');
draw();
Tracer.delay();
for (const op of OPS) {
  if (op !== 'pop') {
    a.push(op);
    let i = a.length - 1;
    draw();
    arr.select(i); tree.select(i);
    log.println('push ' + op + ': append at index ' + i + ' (the next free leaf).');
    Tracer.delay();
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (a[i] >= a[p]) {
        log.println('  parent a[' + p + ']=' + a[p] + ' <= ' + a[i] + '  -> stop.');
        arr.deselect(i); tree.deselect(i);
        Tracer.delay();
        break;
      }
      swap(i, p);
      draw();
      arr.deselect(i); tree.deselect(i);
      arr.patch(p); arr.patch(i);
      log.println('  ' + a[p] + ' < parent ' + a[i] + '  -> swap index ' + i + ' and ' + p + ' (sift up).');
      Tracer.delay();
      arr.depatch(p); arr.depatch(i);
      i = p;
      arr.select(i); tree.select(i);
    }
    if (i === 0) { arr.deselect(0); tree.deselect(0); }
  } else {
    const top = a[0];
    const last = a.pop();
    log.println('pop: answer = root ' + top + '. Move the last leaf ' + last + ' to the root, then sift down.');
    if (a.length > 0) a[0] = last;
    draw();
    arr.select(0); tree.select(0);
    Tracer.delay();
    let i = 0;
    for (;;) {
      const l = 2 * i + 1, r = l + 1;
      let m = i;
      if (l < a.length && a[l] < a[m]) m = l;
      if (r < a.length && a[r] < a[m]) m = r;
      if (m === i) {
        log.println('  ' + a[i] + ' is not bigger than its children -> stop. Heap size ' + a.length + '.');
        arr.deselect(i); tree.deselect(i);
        Tracer.delay();
        break;
      }
      swap(i, m);
      draw();
      arr.deselect(i); tree.deselect(i);
      arr.patch(i); arr.patch(m);
      log.println('  ' + a[m] + ' > smaller child ' + a[i] + '  -> swap index ' + i + ' and ' + m + ' (sift down).');
      Tracer.delay();
      arr.depatch(i); arr.depatch(m);
      i = m;
      arr.select(i); tree.select(i);
    }
  }
}
log.println('Each push/pop walks ONE root-to-leaf path: at most log2(n) swaps. That is the whole trick.');
Tracer.delay();
