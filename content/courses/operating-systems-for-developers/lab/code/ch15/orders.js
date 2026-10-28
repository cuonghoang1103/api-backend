// orders.js — dịch vụ "báo cáo đơn hàng" CHẬM có chủ đích (bài 15.2, 15.4). Cùng logic với Orders.java, orders.py.
//   node orders.js [cổng]          FIX=1 node orders.js   ⇒ bản đã sửa (Set thay cho mảng)
// GET /report?n=4000 : lấy n đơn đầu, đếm khách hàng KHÁC NHAU, tổng tiền, 5 khách mua nhiều nhất ⇒ JSON.
// GET /health        : trả "ok" ngay (không tính gì) — nhưng vẫn phải chờ chung một event loop.
const http = require('node:http');
const FIX = process.env.FIX === '1';
const ORDERS = [];
for (let i = 0; i < 20000; i++) ORDERS.push({ id: i, customer: 'C-' + String((i * 7919) % 2500).padStart(5, '0'), cents: 1000 + ((i * 104729) % 90000) });

function uniqueCustomers(list) {
  if (FIX) return [...new Set(list.map((o) => o.customer))];
  const seen = [];                                   // ⚠ mảng: includes() quét lại từ đầu mỗi lần ⇒ O(n²)
  for (const o of list) if (!seen.includes(o.customer)) seen.push(o.customer);
  return seen;
}
function totals(list) {
  const t = new Map();
  for (const o of list) t.set(o.customer, (t.get(o.customer) || 0) + o.cents);
  return t;
}
function money(c) { return (c / 100).toFixed(2); }
function report(n) {
  const list = ORDERS.slice(0, n);
  const customers = uniqueCustomers(list);
  const t = totals(list);
  const top = [...t.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([c, v]) => ({ customer: c, total: money(v) }));
  return JSON.stringify({ n, customers: customers.length, total: money(list.reduce((s, o) => s + o.cents, 0)), top });
}

const port = +(process.argv[2] || 8080);
// thoát êm khi Ctrl+C / kill ⇒ node --cpu-prof kịp ghi tệp .cpuprofile (chết vì tín hiệu thì không ghi)
for (const s of ['SIGINT', 'SIGTERM']) process.on(s, () => process.exit(0));
const access = process.env.ACCESS_LOG ? require('node:fs').createWriteStream(process.env.ACCESS_LOG, { flags: 'a' }) : null;
http.createServer((req, res) => {
  const t0 = process.hrtime.bigint();
  const u = new URL(req.url, 'http://x');
  // nhật ký truy cập (ACCESS_LOG=tệp): "thời điểm đường-dẫn mã-trạng-thái ms" — nguyên liệu cho RED (bài 15.1)
  if (access) res.on('finish', () => access.write(`${Date.now()} ${u.pathname} ${res.statusCode} ${(Number(process.hrtime.bigint() - t0) / 1e6).toFixed(2)}\n`));
  if (u.pathname === '/report') {
    const body = report(Math.min(20000, +(u.searchParams.get('n') || 4000)));
    res.writeHead(200, { 'content-type': 'application/json' }).end(body);
  } else if (u.pathname === '/health') res.end('ok\n');
  else res.writeHead(404).end();
}).listen(port, () => console.log(`orders.js pid ${process.pid} on :${port}${FIX ? ' (FIX=1: Set)' : ' (array includes)'}`));
