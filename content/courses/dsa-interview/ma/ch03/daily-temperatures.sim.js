// Daily Temperatures with a monotonic stack — each day waits in the stack until a warmer day pops it.
const T = [73, 74, 75, 71, 69, 72, 76, 73];
const temps = new Array1DTracer('temperatures');
const st = new Array1DTracer('stack of waiting day indices (temps decrease bottom -> top)');
const ans = new Array1DTracer('answer: days until warmer');
const log = new LogTracer('log');
temps.set(T);
st.set([]);
const A = T.map(function () { return 0; });
ans.set(A);
log.println('Rule: before pushing day i, pop every waiting day that is COLDER than day i — day i is their answer.');
Tracer.delay();
const stack = [];
let pops = 0;
for (let i = 0; i < T.length; i++) {
  temps.select(i);
  log.println('day ' + i + ' (' + T[i] + '°)');
  Tracer.delay();
  while (stack.length && T[i] > T[stack[stack.length - 1]]) {
    const j = stack.pop();
    pops++;
    A[j] = i - j;
    ans.set(A);
    ans.patch(j);
    st.set(stack);
    log.println('   ' + T[i] + ' > ' + T[j] + ' (day ' + j + ') -> pop ' + j + ', answer[' + j + '] = ' + i + ' - ' + j + ' = ' + (i - j));
    Tracer.delay();
    ans.depatch(j);
  }
  stack.push(i);
  st.set(stack);
  log.println('   push ' + i + '. waiting: [' + stack.join(', ') + ']');
  Tracer.delay();
  temps.deselect(i);
}
log.println('Done. ' + T.length + ' pushes + ' + pops + ' pops: every index enters and leaves at most once => O(n).');
Tracer.delay();
