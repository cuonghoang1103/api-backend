// Minimum Size Subarray Sum — the window [l..r] grows on the right and shrinks on the left.
const arr = new Array1DTracer('nums (window = selected range)');
const log = new LogTracer('sum of window, best length');
const D = [2, 3, 1, 2, 4, 3];
const target = 7;
arr.set(D);
log.println('target = ' + target + '. Grow r; while sum >= target, record the length and shrink l.');
Tracer.delay();
let l = 0, sum = 0, best = Infinity;
for (let r = 0; r < D.length; r++) {
  sum += D[r];
  arr.select(l, r);
  log.println('grow:   r=' + r + ' (+' + D[r] + ')  window [' + l + '..' + r + ']  sum=' + sum);
  Tracer.delay();
  while (sum >= target) {
    if (r - l + 1 < best) { best = r - l + 1; log.println('   valid, length ' + best + ' is a new best'); }
    else log.println('   valid, length ' + (r - l + 1) + ' (best stays ' + best + ')');
    arr.deselect(l);
    sum -= D[l];
    log.println('shrink: drop nums[' + l + ']=' + D[l] + '  sum=' + sum);
    l++;
    Tracer.delay();
  }
}
log.println('answer = ' + (best === Infinity ? 0 : best) + '. Each index entered once and left at most once: O(n).');
Tracer.delay();
