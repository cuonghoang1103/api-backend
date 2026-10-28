// grow.js — làm phình HEAP của V8 (đối tượng JS, không phải Buffer) và in heapUsed (Chương 8).
//   node [--max-old-space-size=N] grow.js
// Ai giết nó trước — trần heap của V8 (exit 134) hay giới hạn bộ nhớ của container (exit 137)?
const v8 = require('v8');
const limit = Math.round(v8.getHeapStatistics().heap_size_limit / 1048576);
console.log(`heap_size_limit ${limit} MB`);
const keep = [];
for (let i = 1; ; i++) {
  keep.push(Array.from({ length: 1 << 16 }, (_, k) => ({ k, s: 'x' + k })));
  if (i % 8 === 0) {
    const m = process.memoryUsage();
    console.log(`heapUsed ${Math.round(m.heapUsed / 1048576)} MB  rss ${Math.round(m.rss / 1048576)} MB`);
  }
}
