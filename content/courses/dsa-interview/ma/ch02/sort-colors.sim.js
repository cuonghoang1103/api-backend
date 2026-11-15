// Sort Colors (Dutch national flag): lo / mid / hi split the array into 0s | 1s | unseen | 2s.
const arr = new Array1DTracer('colors (0, 1, 2)');
const log = new LogTracer('lo, mid, hi');
const A = [1, 2, 0, 2, 1, 0, 1];
arr.set(A);
log.println('[0, lo) = 0s · [lo, mid) = 1s · [mid, hi] = unseen · (hi, end] = 2s. Everything starts unseen.');
Tracer.delay();
let lo = 0, mid = 0, hi = A.length - 1;
while (mid <= hi) {
  arr.select(mid);
  const x = A[mid];
  if (x === 0) {
    const t = A[lo]; A[lo] = A[mid]; A[mid] = t;
    log.println('mid=' + mid + ' is 0: swap with lo=' + lo + ', then lo++ and mid++');
    arr.set(A); arr.patch(lo);
    lo++; mid++;
  } else if (x === 1) {
    log.println('mid=' + mid + ' is 1: already in the middle zone, mid++');
    mid++;
  } else {
    const t = A[mid]; A[mid] = A[hi]; A[hi] = t;
    log.println('mid=' + mid + ' is 2: swap with hi=' + hi + ', hi-- (mid stays: the value that came in is unseen)');
    arr.set(A); arr.patch(hi);
    hi--;
  }
  Tracer.delay();
}
log.println('done in one pass: ' + A.join(', '));
Tracer.delay();
