// Growth of step counts as n goes 1..16: watch O(n), O(n log n), O(n^2) and O(2^n) pull apart.
const c1 = new ChartTracer('O(n) steps');
const c2 = new ChartTracer('O(n log n) steps');
const c3 = new ChartTracer('O(n^2) steps');
const c4 = new ChartTracer('O(2^n) steps');
const log = new LogTracer('n -> steps');
const a = [], b = [], c = [], d = [];
log.println('Each step adds n = 1, 2, 3, ... Compare the last bar of each chart.');
Tracer.delay();
for (let n = 1; n <= 16; n++) {
  a.push(n); b.push(Math.round(n * Math.log2(Math.max(n, 2)))); c.push(n * n); d.push(Math.pow(2, n));
  c1.set(a); c2.set(b); c3.set(c); c4.set(d);
  c1.select(n - 1); c2.select(n - 1); c3.select(n - 1); c4.select(n - 1);
  log.println('n=' + n + ':  n=' + n + '   n log n=' + b[n - 1] + '   n^2=' + (n * n) + '   2^n=' + Math.pow(2, n));
  Tracer.delay();
}
log.println('At n=16: 16 vs 64 vs 256 vs 65,536. At n=40, 2^n would be about 1.1 trillion.');
Tracer.delay();
