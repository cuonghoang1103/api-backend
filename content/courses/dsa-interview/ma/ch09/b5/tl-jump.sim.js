// Jump Game (LC 55) greedy: keep only ONE number, the farthest index you can reach so far.
const A = [1, 3, 0, 0, 2, 0, 1];
const arr = new Array1DTracer('nums (cell value = max jump length)');
const reach = new Array1DTracer('reachable? 1 = yes');
const log = new LogTracer('farthest reach');
arr.set(A);
const R = A.map(function () { return 0; });
R[0] = 1;
reach.set(R);
log.println('Start at index 0. far = 0. Question: can we stand on the last index ' + (A.length - 1) + '?');
Tracer.delay();
let far = 0;
for (let i = 0; i < A.length; i++) {
  arr.select(i);
  if (i > far) {
    log.println('i=' + i + ' > far=' + far + ' -> this cell is unreachable: answer false');
    Tracer.delay();
    break;
  }
  const old = far;
  far = Math.max(far, i + A[i]);
  for (let k = 0; k <= Math.min(far, A.length - 1); k++) R[k] = 1;
  reach.set(R);
  reach.select(Math.min(far, A.length - 1));
  log.println('i=' + i + ': i + nums[i] = ' + (i + A[i]) + ', far = max(' + old + ', ' + (i + A[i]) + ') = ' + far);
  Tracer.delay();
  reach.deselect(Math.min(far, A.length - 1));
  if (far >= A.length - 1) {
    arr.patch(A.length - 1);
    log.println('far >= ' + (A.length - 1) + ' -> the end is reachable: answer true after ' + (i + 1) + ' cells. The zeros at 2, 3 and 5 did not trap us: far was already beyond each of them.');
    Tracer.delay();
    break;
  }
  arr.deselect(i);
}
