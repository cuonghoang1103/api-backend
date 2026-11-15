// LC 56 Merge Intervals — after sorting by start, one scan decides "extend" or "new".
const st = new Array1DTracer('start (sorted)');
const en = new Array1DTracer('end');
const log = new LogTracer('merged so far');
const raw = [[1, 3], [8, 10], [2, 6], [15, 18], [9, 12], [10, 11]];
log.println('Input (unsorted): ' + JSON.stringify(raw));
st.set(raw.map(function (x) { return x[0]; })); en.set(raw.map(function (x) { return x[1]; }));
Tracer.delay();
const I = raw.slice().sort(function (a, b) { return a[0] - b[0]; });
st.set(I.map(function (x) { return x[0]; })); en.set(I.map(function (x) { return x[1]; }));
log.println('Step 1: sort by start, O(n log n). Now any interval that overlaps the current one comes right after it.');
Tracer.delay();
const out = [];
for (let i = 0; i < I.length; i++) {
  st.select(i); en.select(i);
  const last = out[out.length - 1];
  if (last && I[i][0] <= last[1]) {
    const old = last[1];
    last[1] = Math.max(last[1], I[i][1]);
    log.println('[' + I[i][0] + ', ' + I[i][1] + ']: start ' + I[i][0] + ' <= last end ' + old + (I[i][1] > old ? '  -> extend, end = ' + last[1] : '  -> fully inside, end stays ' + old + ' (that is why we take max)'));
  } else {
    out.push([I[i][0], I[i][1]]);
    log.println('[' + I[i][0] + ', ' + I[i][1] + ']: ' + (last ? 'start ' + I[i][0] + ' > last end ' + last[1] : 'first interval') + '  -> new interval');
    st.patch(i);
  }
  Tracer.delay();
  log.println('   merged = ' + JSON.stringify(out));
  st.deselect(i); en.deselect(i);
  Tracer.delay();
}
log.println('Done in one scan after the sort: O(n log n) total. Chapter 6 goes deeper (insert, meeting rooms).');
Tracer.delay();
