// Running median with two heaps. lo = max-heap (smaller half), hi = min-heap (larger half).
// Shown sorted for reading: lo's top is its FIRST cell, hi's top is its FIRST cell. Median = lo top, or the average of both tops.
const all = new Array1DTracer('stream (blue = arriving now)');
const L = new Array1DTracer('lo: max-heap, smaller half (top first)');
const H = new Array1DTracer('hi: min-heap, larger half (top first)');
const log = new LogTracer('log');
const S = [5, 15, 1, 3, 8, 7, 9, 10];
const lo = [], hi = [];
const show = function () { L.set(lo.slice().sort(function (a, b) { return b - a; })); H.set(hi.slice().sort(function (a, b) { return a - b; })); };
const loTop = function () { return Math.max.apply(null, lo); };
const hiTop = function () { return Math.min.apply(null, hi); };
all.set(S);
show();
log.println('Invariant 1: every value in lo <= every value in hi.');
log.println('Invariant 2: size(lo) == size(hi) or size(hi) + 1.');
Tracer.delay();
for (let i = 0; i < S.length; i++) {
  const x = S[i];
  all.select(i);
  if (lo.length === 0 || x <= loTop()) {
    lo.push(x);
    log.println('add ' + x + ': ' + (lo.length === 1 ? 'lo is empty' : x + ' <= lo top ' + loTop()) + ' -> goes to lo');
  } else {
    hi.push(x);
    log.println('add ' + x + ': ' + x + ' > lo top ' + loTop() + ' -> goes to hi');
  }
  show();
  Tracer.delay();
  if (lo.length > hi.length + 1) {
    const t = loTop(); lo.splice(lo.indexOf(t), 1); hi.push(t); show(); H.patch(0);
    log.println('  lo has 2 more than hi -> move lo top ' + t + ' to hi');
    Tracer.delay(); H.depatch(0);
  } else if (hi.length > lo.length) {
    const t = hiTop(); hi.splice(hi.indexOf(t), 1); lo.push(t); show(); L.patch(0);
    log.println('  hi is bigger than lo -> move hi top ' + t + ' to lo');
    Tracer.delay(); L.depatch(0);
  }
  const med = lo.length > hi.length ? loTop() : (loTop() + hiTop()) / 2;
  L.select(0);
  if (lo.length === hi.length) H.select(0);
  log.println('  sizes ' + lo.length + '/' + hi.length + ' -> median = ' + med);
  Tracer.delay();
  L.deselect(0); H.deselect(0); all.deselect(i);
}
log.println('Each add = at most 3 heap operations = O(log n). Median is read from the tops in O(1).');
Tracer.delay();
