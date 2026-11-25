// Bài 1.4 — so ba kiểu nén của WiredTiger trên CÙNG 50.000 dòng log (tất định). Chạy: mongosh --quiet /demo/nen-thu.js
const t = db.getSiblingDB('wt');
t.dropDatabase();
let seed = 7;
const r = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
const docs = [];
for (let i = 0; i < 50000; i++) docs.push({
  _id: i, at: new Date(Date.UTC(2026, 10, 1) + i * 60000),
  level: ['INFO', 'INFO', 'WARN', 'ERROR'][Math.floor(r() * 4)],
  path: '/api/v1/orders/' + Math.floor(r() * 2000), ms: Math.floor(r() * 900),
  ua: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/131.0 Safari/537.36',
});
for (const nen of ['none', 'snappy', 'zstd']) {
  t.createCollection('log_' + nen, { storageEngine: { wiredTiger: { configString: 'block_compressor=' + nen } } });
  t['log_' + nen].insertMany(docs);
}
db.adminCommand({ fsync: 1 });   // ép checkpoint để storageSize là cỡ thật trên đĩa
for (const nen of ['none', 'snappy', 'zstd']) {
  const s = t['log_' + nen].stats();
  print(nen.padEnd(7), 'dữ liệu', (s.size / 1048576).toFixed(2), 'MB | trên đĩa', (s.storageSize / 1048576).toFixed(2), 'MB | nén', (s.size / s.storageSize).toFixed(2) + '×');
}
