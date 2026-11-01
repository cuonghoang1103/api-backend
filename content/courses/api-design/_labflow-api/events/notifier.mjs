// events/notifier.mjs — bài 10.3: MỘT consumer trong consumer group "notifier" đọc Redis Stream, "gửi thông báo" cho mỗi sự kiện.
// Giao "ít nhất một lần" (at-least-once): chết sau khi làm mà trước khi XACK ⇒ sự kiện được giao LẠI cho lần chạy sau.
//   MODE = none       làm rồi ack — không chống trùng
//        | mark-first ghi "đã xử lý" (tự commit) rồi mới làm — chống trùng nhưng có thể MẤT việc
//        | same-tx    ghi "đã xử lý" + làm trong CÙNG một transaction — đúng
//   CRASH = xác suất chết ở mỗi điểm nguy hiểm (0.02 = 2%)
import { createClient } from 'redis';
import pg from 'pg';

const STREAM = process.env.STREAM ?? 'labflow:events-demo', GROUP = 'notifier', ME = `c${process.pid}`;
const MODE = process.env.MODE ?? 'none', CRASH = Number(process.env.CRASH ?? 0);
const redis = createClient({ url: process.env.LABFLOW_REDIS ?? 'redis://localhost:6390' });
const db = new pg.Pool({ connectionString: process.env.PGURL ?? 'postgres://labflow@localhost:55432/labflow', max: 2 });
await redis.connect();
const maybeCrash = () => { if (Math.random() < CRASH) process.exit(3); };   // mất điện, OOM, deploy giữa chừng…

async function handle(m) {
  const e = JSON.parse(m.message.e);
  const send = (c) => c.query('INSERT INTO notifications (event_id, booking_id) VALUES ($1, $2)', [e.id, e.subject]);   // "gửi email"
  if (MODE === 'none') { await send(db); maybeCrash(); }
  if (MODE === 'mark-first') {
    const { rowCount } = await db.query('INSERT INTO processed_events VALUES ($1, $2) ON CONFLICT DO NOTHING', [GROUP, e.id]);
    if (rowCount === 1) { maybeCrash(); await send(db); }                 // chết ở giữa ⇒ đã đánh dấu mà chưa gửi
    maybeCrash();
  }
  if (MODE === 'same-tx') {
    const c = await db.connect();
    try {
      await c.query('BEGIN');
      const { rowCount } = await c.query('INSERT INTO processed_events VALUES ($1, $2) ON CONFLICT DO NOTHING', [GROUP, e.id]);
      if (rowCount === 1) await send(c);                                   // trùng ⇒ bỏ qua, nhưng vẫn ack bên dưới
      await c.query('COMMIT');
    } finally { c.release(); }
    maybeCrash();
  }
  await redis.xAck(STREAM, GROUP, m.id);
}

// Lần chạy trước chết ⇒ thông điệp đã đọc mà chưa ack nằm ở "pending" — nhận lại chúng trước (XAUTOCLAIM)
for (let cursor = '0-0'; ;) {
  const r = await redis.xAutoClaim(STREAM, GROUP, ME, 0, cursor, { COUNT: 100 });
  for (const m of r.messages) if (m) await handle(m);
  cursor = r.nextId;
  if (cursor === '0-0') break;
}
for (;;) {
  const r = await redis.xReadGroup(GROUP, ME, { key: STREAM, id: '>' }, { COUNT: 20, BLOCK: 300 });
  if (!r) break;                                                           // hết việc
  for (const m of r[0].messages) await handle(m);
}
await redis.quit(); await db.end();
