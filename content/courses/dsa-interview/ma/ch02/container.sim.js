// Container With Most Water — bars are wall heights; the two selected bars are the current container.
const chart = new ChartTracer('heights');
const log = new LogTracer('area = min(h[l], h[r]) * (r - l)');
const H = [1, 8, 6, 2, 5, 4, 8, 3, 7];
chart.set(H);
log.println('Start with the WIDEST container: l = 0, r = ' + (H.length - 1) + '.');
Tracer.delay();
let l = 0, r = H.length - 1, best = 0, bl = -1, br = -1;
while (l < r) {
  chart.select(l); chart.select(r);
  const area = Math.min(H[l], H[r]) * (r - l);
  if (area > best) { best = area; bl = l; br = r; }
  log.println('l=' + l + ' (h=' + H[l] + ')  r=' + r + ' (h=' + H[r] + ')  area=' + Math.min(H[l], H[r]) + '*' + (r - l) + '=' + area + '  best=' + best);
  Tracer.delay();
  if (H[l] < H[r]) {
    log.println('   left wall is shorter: every narrower container with it is worse -> l++');
    chart.deselect(l); l++;
  } else {
    log.println('   right wall is shorter (or equal) -> r--');
    chart.deselect(r); r--;
  }
  Tracer.delay();
}
chart.patch(bl); chart.patch(br);
log.println('Best = ' + best + ' between index ' + bl + ' and ' + br + ', found in ' + (H.length - 1) + ' moves instead of ' + (H.length * (H.length - 1) / 2) + ' pairs.');
Tracer.delay();
