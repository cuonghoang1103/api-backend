// Two Sum with a hash map — watch the map grow and the lookup hit.
const arr = new Array1DTracer('nums');
const log = new LogTracer('seen: value -> index');
const D = [3, 8, 11, 2, 7, 15];
const target = 9;
arr.set(D);
log.println('target = ' + target + '. For each nums[i], ask the map: have I seen target - nums[i]?');
Tracer.delay();
const seen = new Map();
for (let i = 0; i < D.length; i++) {
  arr.select(i);
  const need = target - D[i];
  if (seen.has(need)) {
    log.println('i=' + i + '  nums[i]=' + D[i] + '  need=' + need + '  -> FOUND at index ' + seen.get(need));
    arr.patch(seen.get(need)); arr.patch(i);
    Tracer.delay();
    log.println('answer = [' + seen.get(need) + ', ' + i + ']  after ' + (i + 1) + ' steps, not ' + (D.length * (D.length - 1) / 2) + ' pairs');
    Tracer.delay();
    break;
  }
  log.println('i=' + i + '  nums[i]=' + D[i] + '  need=' + need + '  -> not in map, store ' + D[i] + ':' + i);
  seen.set(D[i], i);
  Tracer.delay();
  log.println('   seen = {' + Array.from(seen).map(function (e) { return e[0] + ':' + e[1]; }).join(', ') + '}');
  arr.deselect(i);
  Tracer.delay();
}
