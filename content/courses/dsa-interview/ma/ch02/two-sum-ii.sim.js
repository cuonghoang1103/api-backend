// Two Sum II on a SORTED array — two pointers walk toward each other.
const arr = new Array1DTracer('nums (sorted)');
const log = new LogTracer('l, r, sum');
const D = [1, 3, 4, 6, 8, 11, 14];
const target = 10;
arr.set(D);
log.println('target = ' + target + '. l starts at the smallest, r at the largest value.');
Tracer.delay();
let l = 0, r = D.length - 1, steps = 0;
while (l < r) {
  arr.select(l); arr.select(r);
  const sum = D[l] + D[r];
  steps++;
  if (sum === target) {
    log.println('l=' + l + ' r=' + r + '  ' + D[l] + ' + ' + D[r] + ' = ' + sum + '  -> FOUND [' + (l + 1) + ', ' + (r + 1) + '] (1-based)');
    arr.patch(l); arr.patch(r);
    Tracer.delay();
    log.println(steps + ' checks instead of ' + (D.length * (D.length - 1) / 2) + ' pairs.');
    Tracer.delay();
    break;
  }
  if (sum < target) {
    log.println('l=' + l + ' r=' + r + '  sum ' + sum + ' < ' + target + ': ' + D[l] + ' is too small even with the BIGGEST partner -> drop it, l++');
    Tracer.delay();
    arr.deselect(l);
    l++;
  } else {
    log.println('l=' + l + ' r=' + r + '  sum ' + sum + ' > ' + target + ': ' + D[r] + ' is too big even with the SMALLEST partner -> drop it, r--');
    Tracer.delay();
    arr.deselect(r);
    r--;
  }
}
