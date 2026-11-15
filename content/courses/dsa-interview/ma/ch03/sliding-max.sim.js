// Sliding Window Maximum with a monotonic deque. Window = selected cells; the deque keeps indices whose values decrease.
const A = [1, 3, -1, -3, 5, 3, 6, 7];
const K = 3;
const arr = new Array1DTracer('nums (window selected)');
const dqT = new Array1DTracer('deque: indices, values decreasing front -> back');
const outT = new Array1DTracer('maximum of each window');
const log = new LogTracer('log');
arr.set(A);
dqT.set([]);
outT.set([]);
log.println('k = ' + K + '. The front of the deque is always the index of the window maximum.');
Tracer.delay();
const dq = [];
const out = [];
for (let i = 0; i < A.length; i++) {
  arr.select(Math.max(0, i - K + 1), i);
  log.println('i=' + i + '  value ' + A[i]);
  if (dq.length && dq[0] <= i - K) {
    const g = dq.shift();
    dqT.set(dq);
    log.println('   front index ' + g + ' is outside the window -> remove from FRONT');
    Tracer.delay();
  }
  while (dq.length && A[dq[dq.length - 1]] <= A[i]) {
    const b = dq.pop();
    dqT.set(dq);
    log.println('   ' + A[b] + ' (index ' + b + ') <= ' + A[i] + ' -> it can never be a maximum again, remove from BACK');
    Tracer.delay();
  }
  dq.push(i);
  dqT.set(dq);
  log.println('   push ' + i + ' at the back. deque values: [' + dq.map(function (j) { return A[j]; }).join(', ') + ']');
  if (i >= K - 1) {
    out.push(A[dq[0]]);
    outT.set(out);
    outT.patch(out.length - 1);
    log.println('   window [' + (i - K + 1) + '..' + i + '] max = ' + A[dq[0]]);
  }
  Tracer.delay();
  if (i >= K - 1) outT.depatch(out.length - 1);
  arr.deselect(Math.max(0, i - K + 1), i);
}
log.println('answer: [' + out.join(', ') + ']');
Tracer.delay();
