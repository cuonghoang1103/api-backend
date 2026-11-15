// Fixed window of size k: watch the BUGGY loop (s < n - k) skip the last window, then the fixed loop (s <= n - k) reach it.
// Change D and K and run again: put the biggest numbers at the END to make the bug show.
const D = [1, 2, 3, 4];
const K = 2;
const arr = new Array1DTracer('nums');
const log = new LogTracer('window sums');
arr.set(D);
const n = D.length;
log.println('n = ' + n + ', k = ' + K + '. Valid window starts: 0 .. n - k = 0 .. ' + (n - K) + ' (' + (n - K + 1) + ' windows).');
Tracer.delay();

function run(label, buggy) {
  log.println('--- ' + label + ' ---');
  let sum = 0;
  for (let i = 0; i < K; i++) sum += D[i];
  let best = sum;
  arr.select(0, K - 1);
  log.println('start 0: window [0..' + (K - 1) + '], sum = ' + sum + ', best = ' + best);
  Tracer.delay();
  arr.deselect(0, K - 1);
  for (let s = 1; ; s++) {
    const ok = buggy ? s < n - K : s <= n - K;
    if (!ok) {
      log.println('check ' + s + (buggy ? ' < ' : ' <= ') + (n - K) + ' -> false, loop stops. best = ' + best);
      Tracer.delay();
      break;
    }
    sum += D[s + K - 1] - D[s - 1];
    best = Math.max(best, sum);
    arr.select(s, s + K - 1);
    log.println('start ' + s + ': add ' + D[s + K - 1] + ', drop ' + D[s - 1] + ' -> sum = ' + sum + ', best = ' + best);
    Tracer.delay();
    arr.deselect(s, s + K - 1);
  }
  return best;
}

let truth = -Infinity;                       // brute force: sum every window from scratch
for (let s = 0; s + K <= n; s++) { let t = 0; for (let i = s; i < s + K; i++) t += D[i]; truth = Math.max(truth, t); }
const b = run('BUGGY: s < n - k', true);
arr.patch(n - K); arr.patch(n - 1);
log.println('The window starting at ' + (n - K) + ' was never visited. Buggy answer ' + b + ', brute force says ' + truth + (b === truth ? ' (lucky: same).' : ' -> WRONG.'));
Tracer.delay();
arr.depatch(n - K); arr.depatch(n - 1);
const f = run('FIXED: s <= n - k', false);
arr.patch(n - K); arr.patch(n - 1);
log.println('Fixed answer ' + f + '. The normal example [2,1,5,1,3,2], k=3 hides this bug: its best window is not the last one.');
Tracer.delay();
