// LC 121 — one pass: remember the cheapest day so far, try selling today.
const arr = new Array1DTracer('prices');
const chart = new ChartTracer('prices (chart)');
const log = new LogTracer('minSoFar / best');
const P = [7, 1, 5, 3, 6, 4];
arr.set(P); chart.set(P);
log.println('Walk left to right. Keep the cheapest price seen so far; each day ask: what if I sold today?');
Tracer.delay();
let minSoFar = Infinity, best = 0, buy = -1, sell = -1, minIdx = -1;
for (let i = 0; i < P.length; i++) {
  arr.select(i); chart.select(i);
  if (minIdx >= 0) { arr.patch(minIdx); chart.patch(minIdx); }
  const profit = minSoFar === Infinity ? 0 : P[i] - minSoFar;
  if (profit > best) { best = profit; buy = minIdx; sell = i; }
  log.println('day ' + i + ': price ' + P[i] + ', minSoFar ' + (minSoFar === Infinity ? 'none' : minSoFar) + ', sell today = ' + profit + ', best = ' + best);
  Tracer.delay();
  if (P[i] < minSoFar) { if (minIdx >= 0) { arr.depatch(minIdx); chart.depatch(minIdx); } minSoFar = P[i]; minIdx = i; log.println('   new cheapest day: ' + i); }
  arr.deselect(i); chart.deselect(i);
  Tracer.delay();
}
log.println('answer: buy day ' + buy + ', sell day ' + sell + ', profit ' + best);
arr.patch(buy); arr.patch(sell);
Tracer.delay();
