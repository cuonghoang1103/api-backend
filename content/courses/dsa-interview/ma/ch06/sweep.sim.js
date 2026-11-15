// Sweep line for "how many rooms": every meeting is two events, +1 at its start and -1 at its end.
// Sort the events (same time: -1 first, because [start, end) is half-open) and keep a running count.
const evT = new Array1DTracer('event times (sorted)');
const chart = new ChartTracer('rooms in use after each event');
const log = new LogTracer('log');
const M = [[9, 11], [10, 12], [11, 13], [13, 14], [9, 10]];
const ev = [];
for (let k = 0; k < M.length; k++) { ev.push([M[k][0], 1, k]); ev.push([M[k][1], -1, k]); }
ev.sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
evT.set(ev.map(function (e) { return e[0]; }));
log.println('Lab bookings (hours): ' + M.map(function (m) { return '[' + m[0] + ',' + m[1] + ')'; }).join(' '));
log.println('10 events after sorting. Ties: an END (-1) is processed before a START (+1).');
Tracer.delay();
let cur = 0, best = 0;
const counts = [];
for (let i = 0; i < ev.length; i++) {
  const e = ev[i];
  evT.select(i);
  cur += e[1];
  counts.push(cur);
  chart.set(counts);
  chart.select(i);
  const m = M[e[2]];
  if (cur > best) { best = cur; chart.patch(i); }
  log.println('t=' + e[0] + ': ' + (e[1] > 0 ? 'START' : 'END  ') + ' of [' + m[0] + ',' + m[1] + ')  -> rooms in use = ' + cur + ', max = ' + best);
  Tracer.delay();
  chart.deselect(i); chart.depatch(i); evT.deselect(i);
}
log.println('Answer: ' + best + ' rooms. Swap the tie rule (START before END) and t=10, t=11 would count 3 — the closed-interval answer.');
Tracer.delay();
