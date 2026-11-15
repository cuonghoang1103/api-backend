// LC 347 Top K Frequent — count, then drop each value into the bucket of its frequency; scan buckets from the top.
const arr = new Array1DTracer('nums');
const cnt = new ChartTracer('frequency of each distinct value');
const log = new LogTracer('buckets: frequency -> values');
const D = [5, 3, 5, 7, 3, 5, 9, 3, 7, 5];
const k = 2;
arr.set(D);
log.println('Goal: the k = ' + k + ' most frequent values. Step 1: count with a map (one pass).');
Tracer.delay();
const count = new Map();
const keys = [];
for (let i = 0; i < D.length; i++) {
  arr.select(i);
  if (!count.has(D[i])) keys.push(D[i]);
  count.set(D[i], (count.get(D[i]) || 0) + 1);
  cnt.set(keys.map(function (x) { return count.get(x); }));
  cnt.select(keys.indexOf(D[i]));
  log.println('nums[' + i + '] = ' + D[i] + '  -> count ' + count.get(D[i]));
  Tracer.delay();
  arr.deselect(i); cnt.deselect(keys.indexOf(D[i]));
}
log.println('distinct values (chart order): ' + keys.join(', ') + '. A frequency is between 1 and n = ' + D.length + ', so it can be an array index.');
Tracer.delay();
const bucket = [];
for (let f = 0; f <= D.length; f++) bucket.push([]);
for (let j = 0; j < keys.length; j++) {
  bucket[count.get(keys[j])].push(keys[j]);
  cnt.select(j);
  log.println('bucket[' + count.get(keys[j]) + '] <- ' + keys[j]);
  Tracer.delay();
  cnt.deselect(j);
}
const out = [];
for (let f = D.length; f >= 1 && out.length < k; f--) {
  if (!bucket[f].length) continue;
  for (let t = 0; t < bucket[f].length && out.length < k; t++) { out.push(bucket[f][t]); cnt.patch(keys.indexOf(bucket[f][t])); }
  log.println('scan bucket[' + f + '] = [' + bucket[f].join(', ') + ']  -> answer so far [' + out.join(', ') + ']');
  Tracer.delay();
}
log.println('answer = [' + out.join(', ') + ']. No comparison sort at all: O(n) time.');
Tracer.delay();
