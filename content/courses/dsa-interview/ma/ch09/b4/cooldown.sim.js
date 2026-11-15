// LC 309 with cooldown: three states per day. Row 0 = hold, row 1 = sold, row 2 = rest; column d = day d.
const prices = [1, 2, 3, 0, 2];
const NONE = -9;   // stands for "impossible" (minus infinity) in the picture
const t = new Array2DTracer('rows: hold / sold / rest   columns: days');
const log = new LogTracer('one day at a time');
const m = [[], [], []];
for (let d = 0; d < prices.length; d++) { m[0].push(0); m[1].push(0); m[2].push(0); }
t.set(m);
log.println('prices = [' + prices.join(', ') + ']. -9 in the table means "impossible" (minus infinity).');
Tracer.delay();
let hold = -Infinity, sold = -Infinity, rest = 0;
for (let d = 0; d < prices.length; d++) {
  const p = prices[d];
  const h = Math.max(hold, rest - p), s = hold + p, r = Math.max(rest, sold);
  m[0][d] = h; m[1][d] = s === -Infinity ? NONE : s; m[2][d] = r;
  t.set(m);
  if (d > 0) { t.patch(0, d - 1); t.patch(2, d - 1); }
  t.select(0, d); t.select(1, d); t.select(2, d);
  log.println('day ' + d + ' price ' + p + ': hold = max(keep ' + (hold === -Infinity ? '-inf' : hold) + ', buy from rest ' + (rest - p) + ') = ' + h);
  log.println('        sold = hold yesterday + ' + p + ' = ' + (s === -Infinity ? '-inf' : s) + ';  rest = max(rest, sold yesterday) = ' + r);
  Tracer.delay();
  if (d > 0) { t.depatch(0, d - 1); t.depatch(2, d - 1); }
  t.deselect(0, d); t.deselect(1, d); t.deselect(2, d);
  hold = h; sold = s; rest = r;
}
log.println('answer = max(sold, rest) on the last day = ' + Math.max(sold, rest) + '  (buy 1, sell 2, cool down, buy 0, sell 2)');
Tracer.delay();
