// app.js — dịch vụ "orders" thu nhỏ cho Chương 13: log JSON ra stdout, cảnh báo ra stderr, thiếu DB_URL thì thoát 1.
const log = (level, msg, extra = {}) =>
  console.log(JSON.stringify({ time: new Date().toISOString(), level, svc: 'orders', msg, ...extra }));
if (!process.env.DB_URL) {
  console.error('FATAL: thiếu biến môi trường DB_URL');
  console.error(new Error('config: DB_URL is required').stack);
  process.exit(1);
}
log('info', 'started', { pid: process.pid, node: process.version });
let n = 0;
const t = setInterval(() => {
  n++;
  if (n % 4 === 0) console.error(`WARN slow query ${n * 37} ms`);
  else log('info', 'order created', { orderId: 1000 + n });
  if (n === 12) {
    clearInterval(t); log('info', 'idle');
    if (process.env.KEEP_ALIVE) setInterval(() => log('info', 'heartbeat'), 20000); // trong Deployment: đừng tự thoát
  }
}, 300);
process.on('SIGTERM', () => { log('info', 'SIGTERM received, shutting down'); process.exit(0); });
