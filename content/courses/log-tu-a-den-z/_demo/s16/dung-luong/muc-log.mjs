// muc-log.mjs — cùng 1000 request giả lập, đo số byte log ở mức info và mức debug (pino 9). LOG_LEVEL=info|debug node muc-log.mjs | wc -c
import pino from 'pino';
const log = pino({ level: process.env.LOG_LEVEL || 'info' });
for (let i = 0; i < 1000; i++) {
  const r = log.child({ reqId: `r-${i}`, route: '/api/don-hang/:id' });
  r.debug({ headers: { 'user-agent': 'Mozilla/5.0 (X11; Linux x86_64)', accept: 'application/json', 'accept-language': 'vi-VN,vi;q=0.9' } }, 'nhận request');
  r.debug({ sql: 'SELECT id, user_id, tong_tien, trang_thai FROM don_hang WHERE id = $1', params: [1000 + i] }, 'truy vấn');
  r.debug({ rows: 1, ms: 3 }, 'truy vấn xong');
  r.debug({ cache: 'miss', key: `don-hang:${1000 + i}` }, 'đọc cache');
  r.info({ status: 200, ms: 12 + (i % 40) }, 'request completed');
}
