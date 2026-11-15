// Maximum Points from Cards — start with k cards from the left, then move one card at a time to the right end.
const arr = new Array1DTracer('cards');
const log = new LogTracer('sum of the k cards you hold');
const D = [1, 79, 80, 1, 1, 1, 200, 1];
const k = 3;
const n = D.length;
arr.set(D);
log.println('Take exactly k=' + k + ' cards from the two ends. Any choice = i from the left + (k-i) from the right.');
Tracer.delay();
let sum = 0;
for (let i = 0; i < k; i++) { sum += D[i]; arr.select(i); }
let best = sum;
log.println('i=0 from the right: hold cards 0..' + (k - 1) + ', sum=' + sum);
Tracer.delay();
for (let i = 1; i <= k; i++) {
  arr.deselect(k - i);
  arr.select(n - i);
  sum += D[n - i] - D[k - i];
  log.println('give back card ' + (k - i) + ' (' + D[k - i] + '), take card ' + (n - i) + ' (' + D[n - i] + ')  -> sum=' + sum + (sum > best ? '  new best' : ''));
  if (sum > best) best = sum;
  Tracer.delay();
}
log.println('best = ' + best + ' after k+1 = ' + (k + 1) + ' sums, not 2^k = ' + Math.pow(2, k) + ' choice sequences.');
Tracer.delay();
