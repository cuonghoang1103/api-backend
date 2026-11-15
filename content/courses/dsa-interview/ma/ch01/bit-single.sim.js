// LC 136 Single Number — watch XOR cancel the pairs, bit by bit.
const arr = new Array1DTracer('nums');
const xb = new Array1DTracer('bits of nums[i]  (8 4 2 1)');
const ab = new Array1DTracer('bits of acc      (8 4 2 1)');
const log = new LogTracer('acc ^= nums[i]');
const D = [5, 9, 3, 9, 5];
const bits = function (x) { return [(x >> 3) & 1, (x >> 2) & 1, (x >> 1) & 1, x & 1]; };
arr.set(D); xb.set([0, 0, 0, 0]); ab.set([0, 0, 0, 0]);
log.println('acc starts at 0. XOR flips a bit of acc wherever nums[i] has a 1.');
Tracer.delay();
let acc = 0;
for (let i = 0; i < D.length; i++) {
  arr.select(i);
  const xbits = bits(D[i]);
  xb.set(xbits);
  for (let k = 0; k < 4; k++) if (xbits[k]) { xb.select(k); ab.select(k); }
  log.println('i=' + i + ': nums[i]=' + D[i] + ' = ' + xbits.join('') + '. Highlighted bits of acc will flip.');
  Tracer.delay();
  const before = acc;
  acc ^= D[i];
  ab.set(bits(acc));
  log.println('   acc: ' + bits(before).join('') + ' (' + before + ') ^ ' + xbits.join('') + ' = ' + bits(acc).join('') + ' (' + acc + ')');
  arr.deselect(i);
  Tracer.delay();
}
log.println('Both 9s and both 5s flipped the same bits twice, so they cancelled. What is left: ' + acc);
arr.patch(D.indexOf(acc));
Tracer.delay();
