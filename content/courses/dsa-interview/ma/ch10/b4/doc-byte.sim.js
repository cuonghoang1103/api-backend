// The fast Java reader (DocNhanh.nextLong) on the bytes of "12 -3\r\n45": watch each byte, the number being built,
// and the tokens produced. Spaces, \r and \n are all just "not a digit" — that is why layout never breaks it.
const text = '12 -3\r\n45';
const show = function (ch) { return ch === ' ' ? '␠' : ch === '\r' ? '\\r' : ch === '\n' ? '\\n' : ch; };
const cells = text.split('').map(show);
const arr = new Array1DTracer('stdin bytes');
const out = new Array1DTracer('numbers read');
const log = new LogTracer('nextLong()');
arr.set(cells);
const got = ['?', '?', '?'];
out.set(got);
log.println('Input bytes: ' + cells.join(' ') + '. Rule: skip anything that is not "-" or a digit.');
Tracer.delay();
let p = 0;
let k = 0;
while (p < text.length) {
  while (p < text.length && text[p] !== '-' && (text[p] < '0' || text[p] > '9')) {
    arr.select(p);
    log.println('byte ' + p + ' = ' + show(text[p]) + ' -> not a digit, skip');
    Tracer.delay();
    arr.deselect(p);
    p++;
  }
  if (p >= text.length) break;
  let neg = false;
  if (text[p] === '-') {
    neg = true;
    arr.select(p);
    log.println('byte ' + p + ' = "-" -> remember the sign');
    Tracer.delay();
    arr.deselect(p);
    p++;
  }
  let x = 0;
  while (p < text.length && text[p] >= '0' && text[p] <= '9') {
    arr.select(p);
    x = x * 10 + (text.charCodeAt(p) - 48);
    log.println('byte ' + p + ' = ' + text[p] + ' -> x = x*10 + ' + text[p] + ' = ' + x);
    Tracer.delay();
    arr.patch(p);
    p++;
  }
  const v = neg ? -x : x;
  got[k] = v;
  out.set(got);
  out.patch(k);
  log.println('-> number ' + (k + 1) + ' = ' + v + ' (next byte ends it)');
  k++;
  Tracer.delay();
}
log.println('Done: 12, -3, 45. Same answer whether the numbers are separated by one space, two spaces, \\r\\n or \\n.');
Tracer.delay();
