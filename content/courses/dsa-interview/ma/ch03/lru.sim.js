// LRU cache, capacity 3. The row is the recency list: index 0 = most recently used, last = next to be evicted.
const CAP = 3;
const OPS = [['put', 1], ['put', 2], ['put', 3], ['get', 1], ['put', 4], ['get', 2], ['get', 3], ['put', 5], ['get', 1]];
const list = new Array1DTracer('recency list (left = most recent, right = evicted next)');
const log = new LogTracer('log');
const ds = [];
list.set(ds);
log.println('capacity ' + CAP + '. A map finds a key\'s node in O(1); the doubly linked list moves it in O(1).');
Tracer.delay();
let hits = 0;
for (let s = 0; s < OPS.length; s++) {
  const op = OPS[s][0], k = OPS[s][1];
  const at = ds.indexOf(k);
  if (op === 'get') {
    if (at < 0) { log.println('get(' + k + ') -> miss (-1)'); Tracer.delay(); continue; }
    hits++;
    list.select(at);
    log.println('get(' + k + ') -> hit at position ' + at + ', unlink it ...');
    Tracer.delay();
    ds.splice(at, 1); ds.unshift(k);
    list.set(ds); list.patch(0);
    log.println('   ... and re-insert at the front');
    Tracer.delay();
    list.depatch(0);
  } else {
    if (at >= 0) ds.splice(at, 1);
    else if (ds.length === CAP) {
      list.select(ds.length - 1);
      log.println('put(' + k + ') but the cache is full -> evict ' + ds[ds.length - 1] + ' (least recently used)');
      Tracer.delay();
      ds.pop();
    }
    ds.unshift(k);
    list.set(ds); list.patch(0);
    log.println('put(' + k + ') -> front. list = [' + ds.join(', ') + ']');
    Tracer.delay();
    list.depatch(0);
  }
}
log.println('hits = ' + hits + '. Every step touched O(1) nodes — no scanning.');
Tracer.delay();
