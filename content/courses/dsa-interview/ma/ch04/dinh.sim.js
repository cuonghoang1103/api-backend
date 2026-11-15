// Find a peak by walking UPHILL with binary search (LC 162). The bars are the array; no sorting anywhere.
const chart = new ChartTracer('nums');
const log = new LogTracer('compare nums[mid] with nums[mid + 1]');
const A = [2, 4, 3, 1, 5, 7, 6, 2];
chart.set(A);
log.println('ok(i) = "nums[i] > nums[i + 1]" (going down after i?) on [0, n - 1).');
log.println('Invariant: we entered lo going UP (or lo = 0), we leave hi going DOWN (or hi = n - 1).');
Tracer.delay();
let lo = 0, hi = A.length - 1, round = 0;
while (lo < hi) {
  round++;
  chart.select(lo, hi);
  const mid = lo + Math.floor((hi - lo) / 2);
  chart.patch(mid); chart.patch(mid + 1);
  const down = A[mid] > A[mid + 1];
  log.println('round ' + round + ': [' + lo + ', ' + hi + '] mid=' + mid + '  ' + A[mid] + (down ? ' > ' : ' < ') + A[mid + 1] +
    (down ? '  downhill: a peak is at mid or LEFT -> hi = mid' : '  uphill: a peak is RIGHT of mid -> lo = mid + 1'));
  Tracer.delay();
  chart.depatch(mid); chart.depatch(mid + 1);
  chart.deselect(lo, hi);
  if (down) hi = mid; else lo = mid + 1;
}
chart.patch(lo);
log.println('lo == hi = ' + lo + ': nums[' + lo + '] = ' + A[lo] + ' is a peak (bigger than both neighbours). ' + round + ' comparisons.');
Tracer.delay();
