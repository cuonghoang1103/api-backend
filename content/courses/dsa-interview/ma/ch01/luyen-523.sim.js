// LC 523 — prefix remainders mod k, and the FIRST index where each remainder appeared.
const arr = new Array1DTracer('nums');
const rems = new Array1DTracer('prefix remainder after i');
const log = new LogTracer('first: remainder -> first index');
const D = [2, 5, 3, 0, 4];
const k = 6;
arr.set(D);
rems.set(D.map(function () { return 0; }));
log.println('k = ' + k + '. Two prefixes with the SAME remainder => the part between them is a multiple of k.');
log.println('Start with {0: -1}: the empty prefix, "before index 0".');
Tracer.delay();
const first = new Map([[0, -1]]);
let rem = 0;
const shown = [];
for (let i = 0; i < D.length; i++) {
  arr.select(i);
  rem = (rem + D[i]) % k;
  shown.push(rem);
  rems.set(shown.concat(D.slice(i + 1).map(function () { return 0; })));
  rems.select(i);
  const j = first.get(rem);
  if (j === undefined) {
    first.set(rem, i);
    log.println('i=' + i + '  nums[i]=' + D[i] + '  remainder=' + rem + '  -> new, remember ' + rem + ':' + i);
    Tracer.delay();
  } else if (i - j >= 2) {
    log.println('i=' + i + '  nums[i]=' + D[i] + '  remainder=' + rem + '  -> first seen at ' + j + ', length ' + (i - j) + ' >= 2: FOUND');
    for (let t = j + 1; t <= i; t++) arr.patch(t);
    Tracer.delay();
    let s = 0;
    for (let t = j + 1; t <= i; t++) s += D[t];
    log.println('subarray [' + (j + 1) + '..' + i + '] = ' + D.slice(j + 1, i + 1).join(' + ') + ' = ' + s + ' = ' + (s / k) + ' x ' + k);
    Tracer.delay();
    break;
  } else {
    log.println('i=' + i + '  nums[i]=' + D[i] + '  remainder=' + rem + '  -> seen at ' + j + ' but length ' + (i - j) + ' < 2: keep the OLD index');
    Tracer.delay();
  }
  log.println('   first = {' + Array.from(first).map(function (e) { return e[0] + ':' + e[1]; }).join(', ') + '}');
  arr.deselect(i);
  rems.deselect(i);
  Tracer.delay();
}
