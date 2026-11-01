// webhooks/receiver.mjs — bài 10.6: BÊN NHẬN webhook (hệ thống của phòng đào tạo), cổng 4005. Mỗi biến bật/tắt MỘT thói quen:
//   WEBHOOK_SECRET=whsec_…   khoá nhận được lúc đăng ký (bắt buộc)
//   VERIFY=0       không kiểm chữ ký (SAI)          TOLERANCE_SEC=300  cửa sổ chống phát lại
//   DEDUPE=0       không bỏ thông điệp trùng (SAI)  ORDER=0            không so version, cứ ghi đè (SAI)
//   FAIL_FIRST=n   trả 503 cho n lần đầu (giả lập bên nhận đang bảo trì)
//   SLOW_MS=n      xử lý n ms TRƯỚC khi trả lời (SAI) — ASYNC=1 thì trả 202 ngay, xử lý sau (ĐÚNG)
//   DUMP=tệp       ghi request hợp lệ cuối cùng (header + body) ra tệp — để thử phát lại bằng webhooks/replay.mjs
import { writeFileSync } from 'node:fs';
import express from 'express';
import { verify } from '../src/webhooks.js';

const env = (k, d) => process.env[k] ?? d;
const SECRET = env('WEBHOOK_SECRET'), VERIFY = env('VERIFY', '1') === '1', DEDUPE = env('DEDUPE', '1') === '1';
const ORDER = env('ORDER', '1') === '1', ASYNC = env('ASYNC', '0') === '1';
let failFirst = Number(env('FAIL_FIRST', 0));
const SLOW_MS = Number(env('SLOW_MS', 0)), TOLERANCE = Number(env('TOLERANCE_SEC', 300));
const seen = new Set();                                       // webhook-id đã xử lý (thật: bảng có khoá duy nhất, có hạn)
const bookings = {};                                          // trạng thái của bên nhận: bookingId ⇒ { status, version }
const stats = { received: 0, rejected: 0, duplicates: 0, emails: 0, processed: 0, stale: 0, failedOnPurpose: 0 };
const sleep = (ms) => new Promise((ok) => setTimeout(ok, ms));

async function handle(event) {
  stats.emails++;                                             // tác dụng phụ không rút lại được: gửi email cho giảng viên
  if (SLOW_MS) await sleep(SLOW_MS);                          // gọi API khác, gửi email, ghi CSDL…
  const b = event.data;
  if (b?.id?.startsWith('bk_')) {
    const cur = bookings[b.id];
    if (ORDER && cur && cur.version >= b.version) { stats.stale++; return; }   // sự kiện CŨ tới muộn ⇒ bỏ
    bookings[b.id] = { status: b.status, version: b.version };
  }
  stats.processed++;
}

const app = express();
app.post('/hooks', express.raw({ type: 'application/json' }), async (req, res) => {
  stats.received++;
  const body = req.body.toString('utf8');                    // ĐÚNG chuỗi byte đã ký
  if (VERIFY) {
    const v = verify(SECRET, req.headers, body, { toleranceSec: TOLERANCE });
    if (!v.ok) { stats.rejected++; console.log(`✗ từ chối: ${v.reason}`); return res.status(401).json({ error: v.reason }); }
  }
  if (failFirst > 0) { failFirst--; stats.failedOnPurpose++; return res.status(503).end(); }
  const id = req.get('webhook-id');
  if (process.env.DUMP) writeFileSync(process.env.DUMP, JSON.stringify({ headers: req.headers, body }));
  if (DEDUPE && seen.has(id)) { stats.duplicates++; return res.status(200).json({ duplicate: true }); }   // trùng ⇒ vẫn 2xx
  if (DEDUPE) seen.add(id);
  const event = JSON.parse(body);
  console.log(`✓ ${id.slice(0, 28)}… ${event.type} ${event.subject ?? ''} v${event.data?.version ?? '-'}`);
  if (ASYNC) { setImmediate(() => handle(event).catch(console.error)); return res.status(202).end(); }   // nhận trước, làm sau
  await handle(event);
  res.status(204).end();
});
app.get('/state', (req, res) => res.json({ stats, bookings }));
app.listen(Number(env('PORT', 4005)), () => console.log(`bên nhận webhook ở :${env('PORT', 4005)}`, { VERIFY, DEDUPE, ORDER, ASYNC, SLOW_MS, failFirst }));
