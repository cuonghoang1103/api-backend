// buf.js — Buffer nằm NGOÀI heap V8: heapUsed đứng yên trong khi rss leo (Chương 8).
//   node [--max-old-space-size=N] buf.js
const held = [];
const mb = (x) => Math.round(x / 1048576);
for (let i = 1; ; i++) {
  held.push(Buffer.alloc(32 << 20, 1));
  const m = process.memoryUsage();
  console.log(`${i * 32} MB of Buffers  rss ${mb(m.rss)}  heapUsed ${mb(m.heapUsed)}  external ${mb(m.external)}`);
}
