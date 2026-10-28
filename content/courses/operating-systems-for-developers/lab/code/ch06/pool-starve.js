// pool-starve.js — không deadlock, nhưng ĐÓI: pool 2 kết nối, 4 báo cáo nặng (mỗi cái giữ kết nối 1 giây) đến trước,
// rồi /health (cần kết nối 5 ms) đến lúc 100 ms. Nó chờ bao lâu?
//   node pool-starve.js shared     một pool chung cho mọi thứ
//   node pool-starve.js bulkhead   báo cáo dùng pool riêng 1 kết nối, /health + API thường dùng pool 1 kết nối khác
const { Pool } = require('./pool');
const mode = process.argv[2] || 'shared';
const shared = new Pool({ max: 2 });
const reports = mode === 'bulkhead' ? new Pool({ max: 1 }) : shared;
const api = mode === 'bulkhead' ? new Pool({ max: 1 }) : shared;
const t0 = Date.now();
for (let i = 1; i <= 4; i++) reports.query(1000).then(() => console.log(`${String(Date.now() - t0).padStart(5)} ms  report ${i} done`));
setTimeout(async () => {
  const s = Date.now();
  await api.query(5);
  console.log(`${String(Date.now() - t0).padStart(5)} ms  /health answered after waiting ${Date.now() - s} ms (${mode})`);
}, 100);
