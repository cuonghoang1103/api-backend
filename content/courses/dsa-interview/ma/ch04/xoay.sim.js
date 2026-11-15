// Rotated sorted array, two passes with ONE template:
// pass 1 finds the rotation point (first nums[i] <= last), pass 2 runs lowerBound in the right half.
const arr = new Array1DTracer('nums (rotated)');
const log = new LogTracer('lo / mid / hi');
const A = [6, 8, 9, 12, 1, 3, 4];
const TARGET = 3;
arr.set(A);
log.println('Row "nums[i] <= last (' + A[A.length - 1] + ')?" = ' + A.map(function (v) { return v <= A[A.length - 1] ? 'T' : 'F'; }).join(' '));
Tracer.delay();

function firstTrue(lo, hi, ok, why) {
  let round = 0;
  while (lo < hi) {
    round++;
    arr.select(lo, hi - 1);
    const mid = lo + Math.floor((hi - lo) / 2);
    arr.patch(mid);
    const t = ok(mid);
    log.println('  round ' + round + ': [' + lo + ', ' + hi + ') mid=' + mid + ' nums[mid]=' + A[mid] + ' ' + why + ' -> ' + (t ? 'T, hi = mid' : 'F, lo = mid + 1'));
    Tracer.delay();
    arr.depatch(mid);
    arr.deselect(lo, hi - 1);
    if (t) hi = mid; else lo = mid + 1;
  }
  return lo;
}

log.println('Pass 1: where is the minimum?');
const last = A[A.length - 1];
const p = firstTrue(0, A.length, function (i) { return A[i] <= last; }, '<= ' + last + '?');
arr.patch(p);
log.println('minimum at index ' + p + ' (value ' + A[p] + '). [0, ' + p + ') and [' + p + ', ' + A.length + ') are both sorted.');
Tracer.delay();
arr.depatch(p);

const lo0 = TARGET <= last ? p : 0, hi0 = TARGET <= last ? A.length : p;
log.println('Pass 2: target ' + TARGET + (TARGET <= last ? ' <= ' : ' > ') + last + ' so it can only be in [' + lo0 + ', ' + hi0 + ')');
Tracer.delay();
const i = firstTrue(lo0, hi0, function (k) { return A[k] >= TARGET; }, '>= ' + TARGET + '?');
if (i < hi0 && A[i] === TARGET) { arr.patch(i); log.println('found ' + TARGET + ' at index ' + i); }
else log.println(TARGET + ' is not in the array');
Tracer.delay();
