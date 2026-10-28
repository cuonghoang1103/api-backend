// leak.js — the classic Node leak: a module-level cache that only ever grows.
//   node --expose-gc leak.js bug      cache every response forever
//   node --expose-gc leak.js fixed    keep only the 1,000 most recent (a tiny LRU)
const cache = new Map();
const mode = process.argv[2];

function handle(req) {                       // pretend request handler
  const body = JSON.stringify({ id: req, text: 'hello '.repeat(20) });
  cache.set('resp:' + req, body);           // BUG: key is unique per request, nothing is ever deleted
  if (mode === 'fixed' && cache.size > 1000) cache.delete(cache.keys().next().value);   // evict oldest
  return body;
}

for (let req = 1; req <= 200000; req++) {
  handle(req);
  if (req % 50000 === 0) {
    global.gc();                             // collect garbage first: what remains is really kept
    const m = process.memoryUsage();
    console.log(`${mode.padEnd(5)} after ${String(req).padStart(6)} requests: heapUsed ${(m.heapUsed / 1048576).toFixed(1).padStart(5)} MB, cache size ${cache.size}`);
  }
}
