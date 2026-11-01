// relay.js — bài 12.5: chuyển sự kiện từ bảng outbox (PostgreSQL) sang Redis Stream "labflow:events".
// Chạy trong worker (src/worker.js). Nhiều worker cùng chạy vẫn an toàn: FOR UPDATE SKIP LOCKED chia các dòng cho nhau.
// Không có Redis (dev, npm run test:pg): app.js chạy relay NGAY TRONG tiến trình API, phát vào bus trong RAM (events.js).
// Giao ÍT NHẤT MỘT LẦN: XADD xong mà chết trước khi đánh dấu published ⇒ lần sau phát lại ⇒ bên nhận chống trùng (bài 10.3).
import pg from 'pg';
import { pool } from './pg.js';
import { config } from './config.js';
import { STREAM } from './events.js';

const BATCH = 100;
const POLL_MS = Number(process.env.RELAY_POLL_MS ?? 1000);       // lưới an toàn nếu lỡ một NOTIFY
const CRASH = Number(process.env.RELAY_CRASH ?? 0);               // CHỈ để học: xác suất "chết" ngay sau XADD, trước khi đánh dấu
const KEEP = Number(process.env.EVENTS_KEEP ?? 1000);

// publish(row) — đẩy MỘT sự kiện đi (XADD vào Redis, hoặc events.publish trong RAM)
export async function startRelay(publish, log, { unref = false } = {}) {
  const listener = new pg.Client({ connectionString: config.databaseUrl, application_name: 'labflow-relay' });
  await listener.connect();
  if (process.env.RELAY_LISTEN !== '0') await listener.query('LISTEN labflow_outbox');   // RELAY_LISTEN=0: chỉ hỏi vòng (để so độ trễ)
  if (unref) listener.connection.stream.unref();                 // relay trong tiến trình API: không giữ tiến trình sống khi mọi thứ khác đã xong
  let wake = null;
  listener.on('notification', () => wake?.());
  listener.on('error', (e) => { log('relay LISTEN mất kết nối:', e.message); process.exit(1); });   // để trình quản lý tiến trình khởi động lại
  const stats = { published: 0 };
  (async () => {
    for (;;) {
      const n = await once().catch((e) => { log('relay lỗi:', e.message); return 0; });
      if (n === BATCH) continue;                                  // còn hàng ⇒ làm tiếp ngay
      await new Promise((r) => { wake = r; const t = setTimeout(r, POLL_MS); if (unref) t.unref(); });
    }
  })();
  async function once() {
    const c = await pool.connect();
    try {
      await c.query('BEGIN');
      const { rows } = await c.query(`SELECT * FROM outbox WHERE published_at IS NULL ORDER BY id LIMIT ${BATCH} FOR UPDATE SKIP LOCKED`);
      for (const r of rows) {
        await publish(r);
        if (CRASH && Math.random() < CRASH) { log(`relay "chết" sau XADD outbox #${r.id} (RELAY_CRASH)`); process.exit(1); }
      }
      if (rows.length) await c.query('UPDATE outbox SET published_at = now() WHERE id = ANY($1)', [rows.map((r) => r.id)]);
      await c.query('COMMIT');
      stats.published += rows.length;
      return rows.length;
    } catch (e) {
      await c.query('ROLLBACK').catch(() => {});
      throw e;
    } finally { c.release(); }
  }
  return stats;
}

// Phong bì CloudEvents (bài 10.3) cho một dòng outbox; outboxid = khoá chống trùng cho bên nhận
export const toEnvelope = (r) => ({ specversion: '1.0', type: r.type, source: '/labflow/v2', subject: r.subject, time: r.created_at.toISOString(),
  datacontenttype: 'application/json', outboxid: String(r.id), data: r.data });
export const xaddPublisher = (redis) => (r) =>
  redis.xAdd(STREAM, '*', { e: JSON.stringify(toEnvelope(r)) }, { TRIM: { strategy: 'MAXLEN', strategyModifier: '~', threshold: KEEP } });
