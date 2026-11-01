// events/redelivery.mjs — bài 10.3: đo giao trùng. Đổ N sự kiện vào stream, chạy notifier.mjs; nó chết thì khởi động lại
// (như systemd/Kubernetes làm) cho tới khi hết việc; rồi đếm: bao nhiêu thông báo đã gửi cho N sự kiện?
//   MODE=none|mark-first|same-tx CRASH=0.02 N=1000 node events/redelivery.mjs
import { spawnSync } from 'node:child_process';
import { createClient } from 'redis';
import pg from 'pg';

const N = Number(process.env.N ?? 1000), STREAM = 'labflow:events-demo';
const redis = createClient({ url: process.env.LABFLOW_REDIS ?? 'redis://localhost:6390' });
const db = new pg.Pool({ connectionString: process.env.PGURL ?? 'postgres://labflow@localhost:55432/labflow' });
await redis.connect();
await db.query('CREATE TABLE IF NOT EXISTS notifications (id bigserial PRIMARY KEY, event_id text NOT NULL, booking_id text, sent_at timestamptz DEFAULT now())');
await db.query('CREATE TABLE IF NOT EXISTS processed_events (consumer text, event_id text, PRIMARY KEY (consumer, event_id))');
await db.query('TRUNCATE notifications, processed_events');
await redis.del(STREAM);
for (let i = 1; i <= N; i++)
  await redis.xAdd(STREAM, '*', { e: JSON.stringify({ id: `evt_${i}`, type: 'labflow.booking.created.v1', subject: `bk_${i}` }) });
await redis.xGroupCreate(STREAM, 'notifier', '0');
let runs = 0, crashes = 0;
for (;;) {
  runs++;
  const r = spawnSync(process.execPath, [new URL('./notifier.mjs', import.meta.url).pathname], { env: process.env, stdio: 'inherit' });
  if (r.status === 0) break;
  crashes++;
}
const { rows: [c] } = await db.query('SELECT count(*)::int AS sent, count(DISTINCT event_id)::int AS distinct_events FROM notifications');
const pending = (await redis.xPending(STREAM, 'notifier')).pending;
console.log(`MODE=${process.env.MODE ?? 'none'} CRASH=${process.env.CRASH ?? 0}: ${N} sự kiện · consumer chết ${crashes} lần · ${runs} lần chạy`);
console.log(`⇒ đã gửi ${c.sent} thông báo cho ${c.distinct_events} sự kiện khác nhau · trùng ${c.sent - c.distinct_events} · MẤT ${N - c.distinct_events} · còn pending ${pending}`);
await redis.quit(); await db.end();
