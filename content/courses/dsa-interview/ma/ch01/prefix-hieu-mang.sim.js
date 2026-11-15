// Difference array: students booking the lab. Each booking touches only TWO cells; one prefix pass gives every hour.
const dt = new Array1DTracer('diff (+1 at enter, -1 at leave)');
const occ = new ChartTracer('students in the lab per hour (7:00 .. 16:00)');
const log = new LogTracer('bookings [enter, leave)');
const H = 10;
const B = [[0, 3], [1, 4], [2, 6], [5, 9], [6, 10], [6, 8]];
const diff = new Array(H + 1).fill(0);
dt.set(diff); occ.set(new Array(H).fill(0));
log.println('Naive: for each booking, add 1 to every hour it covers (up to 10 cells). Difference array: touch 2 cells.');
Tracer.delay();
for (let b = 0; b < B.length; b++) {
  const e = B[b][0], l = B[b][1];
  diff[e] += 1; diff[l] -= 1;
  dt.set(diff); dt.select(e); dt.select(l);
  log.println('booking ' + b + ': [' + e + ', ' + l + ')  ->  diff[' + e + '] += 1, diff[' + l + '] -= 1');
  Tracer.delay();
  dt.deselect(e); dt.deselect(l);
}
log.println('Now one pass: running += diff[h] is the number of students in the lab at hour h.');
Tracer.delay();
const inLab = new Array(H).fill(0);
let running = 0;
for (let h = 0; h < H; h++) {
  running += diff[h];
  inLab[h] = running;
  dt.select(h); occ.set(inLab); occ.select(h);
  log.println('hour ' + (7 + h) + ':00  diff=' + diff[h] + '  running=' + running);
  Tracer.delay();
  dt.deselect(h); occ.deselect(h);
}
let peak = 0, at = 0;
for (let h = 0; h < H; h++) if (inLab[h] > peak) { peak = inLab[h]; at = h; }
occ.patch(at);
log.println('peak = ' + peak + ' students at ' + (7 + at) + ':00. Work: 2 per booking + 1 per hour.');
Tracer.delay();
