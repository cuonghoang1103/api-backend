// LC 560 Subarray Sum Equals K — prefix sums + a map of how many times each prefix appeared.
const arr = new Array1DTracer('nums');
const pre = new Array1DTracer('prefix sums P (P[0] = 0 is the empty prefix)');
const log = new LogTracer('seen: prefix sum -> count');
const D = [1, 2, -1, 3, -2, 2];
const k = 3;
const P = [0];
for (let i = 0; i < D.length; i++) P.push(P[i] + D[i]);
arr.set(D); pre.set(P);
log.println('k = ' + k + '. A subarray nums[j..i] sums to k  <=>  P[i+1] - P[j] = k  <=>  P[j] = P[i+1] - k.');
log.println('So at each step: how many EARLIER prefixes equal (current sum - k)? Start with seen = {0:1}.');
Tracer.delay();
const seen = new Map([[0, 1]]);
let sum = 0, count = 0;
pre.patch(0);
for (let i = 0; i < D.length; i++) {
  arr.select(i); pre.select(i + 1);
  sum += D[i];
  const need = sum - k;
  const hit = seen.get(need) || 0;
  log.println('i=' + i + '  nums[i]=' + D[i] + '  sum=' + sum + '  need=' + sum + '-' + k + '=' + need + '  -> seen[' + need + '] = ' + hit);
  Tracer.delay();
  if (hit > 0) {
    for (let j = 0; j <= i; j++) if (P[j] === need) { arr.select(j, i); log.println('   subarray nums[' + j + '..' + i + '] sums to ' + k); Tracer.delay(); arr.deselect(j, i); }
  }
  count += hit;
  seen.set(sum, (seen.get(sum) || 0) + 1);
  log.println('   count = ' + count + '; store sum ' + sum + ' -> seen = {' + Array.from(seen).map(function (e) { return e[0] + ':' + e[1]; }).join(', ') + '}');
  arr.deselect(i); pre.deselect(i + 1); pre.patch(i + 1);
  Tracer.delay();
}
log.println('answer = ' + count + ' subarrays, in one pass. Brute force would try ' + (D.length * (D.length + 1) / 2) + ' subarrays.');
Tracer.delay();
