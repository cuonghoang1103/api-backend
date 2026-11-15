// Binary search on the ANSWER: the "array" is every possible speed k = 1..max, and each cell shows hours(k).
// We never build this array in the real solution — it is drawn here only so you can SEE the F...F T...T row.
const PILES = [4, 11, 20, 23, 30];
const H = 8;
const MAX = Math.max.apply(null, PILES);
function hours(k) { let s = 0; for (let i = 0; i < PILES.length; i++) s += Math.ceil(PILES[i] / k); return s; }
const speeds = new Array1DTracer('hours(k) for k = 1..' + MAX + '   (cell i = speed i + 1)');
const log = new LogTracer('lo / mid / hi over SPEEDS');
const H_ROW = [];
for (let k = 1; k <= MAX; k++) H_ROW.push(hours(k));
speeds.set(H_ROW);
log.println('piles = [' + PILES.join(', ') + '], h = ' + H + '. Question for speed k: hours(k) <= ' + H + ' ?');
log.println('Slow speeds need too many hours (F); from some speed on, every faster speed also works (T).');
Tracer.delay();
let lo = 1, hi = MAX, round = 0;
while (lo < hi) {
  round++;
  speeds.select(lo - 1, hi - 1);
  const mid = lo + Math.floor((hi - lo) / 2);
  speeds.patch(mid - 1);
  const h = hours(mid), ok = h <= H;
  log.println('round ' + round + ': speeds [' + lo + ', ' + hi + ') mid=' + mid + ' -> ' + h + ' hours ' + (ok ? '<= ' + H + ' T, hi = mid' : '> ' + H + ' F, lo = mid + 1'));
  Tracer.delay();
  speeds.depatch(mid - 1);
  speeds.deselect(lo - 1, hi - 1);
  if (ok) hi = mid; else lo = mid + 1;
}
speeds.patch(lo - 1);
log.println('slowest speed that finishes in time = ' + lo + ' (' + hours(lo) + ' hours). ' + round + ' checks instead of ' + lo + '.');
Tracer.delay();
