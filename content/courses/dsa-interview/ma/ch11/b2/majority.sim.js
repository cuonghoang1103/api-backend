// Boyer–Moore majority vote — watch the candidate change and the counter cancel out.
const arr = new Array1DTracer('nums');
const log = new LogTracer('candidate / count');
const D = [2, 2, 1, 1, 1, 2, 2];
arr.set(D);
log.println('Idea: pair each vote for the candidate with one vote against it. The majority cannot be cancelled out.');
Tracer.delay();
let candidate = null;
let count = 0;
for (let i = 0; i < D.length; i++) {
  arr.select(i);
  if (count === 0) {
    candidate = D[i];
    log.println('i=' + i + '  count is 0 -> new candidate = ' + candidate);
    Tracer.delay();
  }
  if (D[i] === candidate) {
    count++;
    log.println('i=' + i + '  x=' + D[i] + ' votes FOR ' + candidate + '  -> count=' + count);
  } else {
    count--;
    log.println('i=' + i + '  x=' + D[i] + ' votes AGAINST ' + candidate + ' -> count=' + count + ' (one pair cancelled)');
  }
  Tracer.delay();
  arr.deselect(i);
}
for (let i = 0; i < D.length; i++) if (D[i] === candidate) arr.patch(i);
log.println('Finished: candidate = ' + candidate + ', count = ' + count + '. O(n) time, two variables of memory.');
Tracer.delay();
log.println('If a majority is NOT guaranteed, count the candidate in a second pass before trusting it.');
Tracer.delay();
