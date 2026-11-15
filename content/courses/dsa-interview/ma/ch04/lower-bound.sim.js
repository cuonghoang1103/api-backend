// One template, two questions: lowerBound (first a[i] >= x) and upperBound (first a[i] > x).
// Highlighted range = [lo, hi), the part still unknown. Red cell = mid.
const arr = new Array1DTracer('a (sorted)');
const log = new LogTracer('lo / mid / hi');
const A = [1, 3, 3, 3, 5, 8, 8, 10];
const X = 3;
arr.set(A);
log.println('Invariant: every i < lo is F, every i >= hi is T. hi starts at n = ' + A.length + ' (one past the end).');
Tracer.delay();

function firstTrue(name, ok) {
  let lo = 0, hi = A.length, round = 0;
  log.println('--- ' + name + ' ---');
  while (lo < hi) {
    round++;
    arr.select(lo, hi - 1);
    const mid = lo + Math.floor((hi - lo) / 2);
    arr.patch(mid);
    const t = ok(mid);
    log.println('round ' + round + ': lo=' + lo + ' hi=' + hi + ' mid=' + mid + ' a[mid]=' + A[mid] + ' -> ' + (t ? 'T, hi = mid' : 'F, lo = mid + 1'));
    Tracer.delay();
    arr.depatch(mid);
    arr.deselect(lo, hi - 1);
    if (t) hi = mid; else lo = mid + 1;
  }
  log.println(name + ' = ' + lo + '  (lo == hi, ' + round + ' rounds)');
  if (lo < A.length) { arr.patch(lo); Tracer.delay(); arr.depatch(lo); } else Tracer.delay();
  return lo;
}

const lb = firstTrue('lowerBound(a, ' + X + '): ok(i) = a[i] >= ' + X, function (i) { return A[i] >= X; });
const ub = firstTrue('upperBound(a, ' + X + '): ok(i) = a[i] > ' + X, function (i) { return A[i] > X; });
arr.select(lb, ub - 1);
log.println('Every ' + X + ' sits in [' + lb + ', ' + ub + ')  ->  count = ' + (ub - lb) + ', first = ' + lb + ', last = ' + (ub - 1));
Tracer.delay();
