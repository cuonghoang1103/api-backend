// tai.mjs — tải giả lập "giờ cao điểm": 4 luồng song song; 200 lần tra đơn theo email, 300 lần xem một đơn, 3 lần thống kê.
// Tất định: email/id sinh từ số thứ tự (không random) để chạy lại ra cùng tập request.
const base = 'http://localhost:41201';
const viec = [];
for (let i = 0; i < 200; i++) viec.push(`/api/orders?email=khach${(i * 7919) % 50000}@example.com`);
for (let i = 0; i < 300; i++) viec.push(`/api/orders/${(i * 104729) % 2000000 + 1}`);
for (let i = 0; i < 3; i++) viec.push('/api/stats/today');
viec.sort((a, b) => (a.length * 31 + a.charCodeAt(a.length - 1)) % 7 - (b.length * 31 + b.charCodeAt(b.length - 1)) % 7);
let k = 0, loi = 0;
const t0 = Date.now();
await Promise.all([0, 1, 2, 3].map(async () => {
  while (k < viec.length) { const r = await fetch(base + viec[k++]); if (!r.ok) loi++; await r.arrayBuffer(); }
}));
console.log(`${viec.length} request, ${loi} lỗi, ${((Date.now() - t0) / 1000).toFixed(1)} s`);
