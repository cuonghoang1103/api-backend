// gc.js — what V8 does with your memory.
//   node gc.js limits          heap limit and the heap spaces
//   node gc.js grow            keep allocating until the heap limit is hit
//   node gc.js snapshot        write a heap snapshot and summarise what is in it
const v8 = require('node:v8');
const fs = require('node:fs');
const mb = (n) => (n / 1048576).toFixed(1).padStart(7) + ' MB';
const mode = process.argv[2];

if (mode === 'limits') {
  console.log('heap_size_limit', mb(v8.getHeapStatistics().heap_size_limit));
  for (const s of v8.getHeapSpaceStatistics())
    console.log(s.space_name.padEnd(26), 'size', mb(s.space_size), '  used', mb(s.space_used_size));
}

if (mode === 'grow') {
  const keep = [];
  for (let i = 1; ; i++) {
    keep.push({ id: i, payload: 'x'.repeat(1000) + i });    // ~1 KB per object, never released
    if (i % 20000 === 0) {
      const m = process.memoryUsage();
      console.log(`${String(i).padStart(7)} objects  heapUsed ${mb(m.heapUsed)}  heapTotal ${mb(m.heapTotal)}  rss ${mb(m.rss)}`);
    }
  }
}

if (mode === 'snapshot') {
  class Session { constructor(i) { this.id = i; this.user = 'user' + i; this.cart = [i, i + 1]; } }
  const sessions = new Map();
  for (let i = 0; i < 100000; i++) sessions.set(i, new Session(i));
  const file = v8.writeHeapSnapshot('/tmp/app.heapsnapshot');
  const snap = JSON.parse(fs.readFileSync(file, 'utf8'));
  const f = snap.snapshot.meta.node_fields, nf = f.length, nodes = snap.nodes, strings = snap.strings;
  const iName = f.indexOf('name'), iSize = f.indexOf('self_size'), iType = f.indexOf('type');
  const types = snap.snapshot.meta.node_types[0], by = new Map();
  for (let i = 0; i < nodes.length; i += nf) {
    const key = types[nodes[i + iType]] === 'object' ? strings[nodes[i + iName]] : '(' + types[nodes[i + iType]] + ')';
    const e = by.get(key) || { n: 0, size: 0 }; e.n++; e.size += nodes[i + iSize]; by.set(key, e);
  }
  console.log(`snapshot ${mb(fs.statSync(file).size)} on disk, ${nodes.length / nf} heap objects; top 5 by retained-in-place (self) size:`);
  for (const [k, e] of [...by].sort((a, b) => b[1].size - a[1].size).slice(0, 5))
    console.log('  ' + k.padEnd(18), String(e.n).padStart(7), 'objects', mb(e.size));
  fs.unlinkSync(file);
}
