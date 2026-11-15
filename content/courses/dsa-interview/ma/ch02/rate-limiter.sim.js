// Rate limiter: 3 requests per 10 s. The array holds request times (seconds).
// Sliding window log = the selected range [head..i]; fixed window = the 10-second bucket floor(t / 10).
const arr = new Array1DTracer('request time (s)');
const log = new LogTracer('decision: sliding log vs fixed window');
const T = [1, 2, 3, 9, 10, 11, 12, 13, 21, 22];
const LIMIT = 3, W = 10;
arr.set(T);
log.println('Rule: at most ' + LIMIT + ' requests in any ' + W + ' s. Sliding log keeps ACCEPTED times; fixed window resets every ' + W + ' s.');
Tracer.delay();
const kept = [];
let head = 0, bucket = -1, count = 0;
for (let i = 0; i < T.length; i++) {
  const t = T[i];
  while (head < kept.length && t - kept[head] >= W) head++;
  const slidingOk = kept.length - head < LIMIT;
  if (slidingOk) kept.push(t);
  const b = Math.floor(t / W);
  if (b !== bucket) { bucket = b; count = 0; }
  count++;
  const fixedOk = count <= LIMIT;
  arr.select(i);
  log.println('t=' + t + 's  log window has ' + (kept.length - head - (slidingOk ? 1 : 0)) + ' -> sliding ' + (slidingOk ? 'ALLOW' : 'REJECT') + '   |   bucket ' + b + ' count ' + count + ' -> fixed ' + (fixedOk ? 'ALLOW' : 'REJECT'));
  if (slidingOk) arr.patch(i);
  Tracer.delay();
  if (fixedOk && !slidingOk) { log.println('   ^ fixed window lets this one through: the counter reset at ' + (b * W) + 's, but the last 10 s already had ' + LIMIT + ' requests.'); Tracer.delay(); }
  arr.deselect(i);
}
log.println('Accepted by sliding log (green): ' + kept.join(', ') + ' s.');
Tracer.delay();
