// events/outbox.mjs — bài 10.3: ghi kép (dual write) so với transactional outbox, khi Redis "rớt" 1,5 giây giữa chừng.
//   MODE=dual   INSERT lượt đặt (commit) rồi XADD sự kiện — XADD hỏng thì sự kiện MẤT (lượt đặt vẫn còn)
//   MODE=outbox INSERT lượt đặt + INSERT outbox trong CÙNG transaction; "relay" đọc outbox, XADD, đánh dấu đã phát
//   RELAY_CRASH=1 ⇒ relay "chết" một lần ngay sau XADD, trước khi COMMIT việc đánh dấu ⇒ phát TRÙNG (at-least-once)
import net from 'node:net';
import { createClient } from 'redis';
import pg from 'pg';

const MODE = process.env.MODE ?? 'dual', N = Number(process.env.N ?? 1000), STREAM = 'labflow:outbox-demo';
const db = new pg.Pool({ connectionString: process.env.PGURL ?? 'postgres://labflow@localhost:55432/labflow', max: 5 });
await db.query(`CREATE TABLE IF NOT EXISTS ev_bookings (id bigserial PRIMARY KEY, lab_id text NOT NULL, created_at timestamptz NOT NULL DEFAULT now())`);
await db.query(`CREATE TABLE IF NOT EXISTS outbox (id bigserial PRIMARY KEY, type text NOT NULL, payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(), published_at timestamptz)`);
await db.query('CREATE INDEX IF NOT EXISTS outbox_unpublished ON outbox (id) WHERE published_at IS NULL');
await db.query('TRUNCATE ev_bookings, outbox RESTART IDENTITY');

// Redis đi qua một proxy TCP mà ta "rút dây" được — giả lập broker/mạng rớt
let down = false; const socks = new Set();
net.createServer((c) => {
  if (down) return c.destroy();
  const u = net.connect(6390, 'localhost'); socks.add(c); socks.add(u);
  c.pipe(u).pipe(c); for (const s of [c, u]) s.on('error', () => {}).on('close', () => socks.delete(s));
}).listen(6392);
const cut = (ms) => { down = true; for (const s of socks) s.destroy(); setTimeout(() => { down = false; }, ms); };
const redis = createClient({ url: 'redis://localhost:6392', disableOfflineQueue: true, socket: { reconnectStrategy: () => 100 } });
redis.on('error', () => {});
await redis.connect();
await redis.del(STREAM);

let lost = 0, relayCrashed = false;
const sleep = (ms) => new Promise((ok) => setTimeout(ok, ms));
async function relay() {                                          // chạy mỗi 100 ms; thật ra là một tiến trình riêng
  const c = await db.connect();
  try {
    await c.query('BEGIN');
    const { rows } = await c.query('SELECT id, type, payload FROM outbox WHERE published_at IS NULL ORDER BY id LIMIT 100 FOR UPDATE SKIP LOCKED');
    for (const r of rows) await redis.xAdd(STREAM, '*', { e: JSON.stringify({ id: `evt_${r.id}`, type: r.type, data: r.payload }) });
    if (process.env.RELAY_CRASH && !relayCrashed && rows.length) { relayCrashed = true; throw new Error('relay chết trước COMMIT'); }
    await c.query('UPDATE outbox SET published_at = clock_timestamp() WHERE id = ANY($1)', [rows.map((r) => r.id)]);
    await c.query('COMMIT');
  } catch { await c.query('ROLLBACK'); } finally { c.release(); }   // Redis rớt ⇒ không đánh dấu ⇒ lần sau phát lại
}
let relaying = MODE === 'outbox';
const loop = (async () => { while (relaying) { await relay(); await sleep(100); } })();

const t0 = Date.now();
setTimeout(() => cut(1500), 1500);                                // giây 1,5: Redis rớt 1,5 giây
for (let i = 1; i <= N; i++) {
  const lab = `lab_${(i % 50) + 1}`;
  if (MODE === 'dual') {
    const { rows: [b] } = await db.query('INSERT INTO ev_bookings (lab_id) VALUES ($1) RETURNING id', [lab]);
    try { await redis.xAdd(STREAM, '*', { e: JSON.stringify({ id: `evt_${b.id}`, type: 'labflow.booking.created.v1', data: { id: `bk_${b.id}`, labId: lab } }) }); }
    catch { lost++; }                                              // trả 500 cho người dùng? lượt đặt ĐÃ lưu rồi. Bỏ qua? sự kiện MẤT.
  } else {
    const c = await db.connect();
    await c.query('BEGIN');
    const { rows: [b] } = await c.query('INSERT INTO ev_bookings (lab_id) VALUES ($1) RETURNING id', [lab]);
    await c.query('INSERT INTO outbox (type, payload) VALUES ($1, $2)', ['labflow.booking.created.v1', { id: `bk_${b.id}`, labId: lab }]);
    await c.query('COMMIT'); c.release();
  }
  await sleep(3);
}
const tWrite = Date.now() - t0;
if (MODE === 'outbox') {
  while ((await db.query('SELECT count(*)::int AS n FROM outbox WHERE published_at IS NULL')).rows[0].n > 0) await sleep(50);
  relaying = false; await loop;
}
const inStream = await redis.xLen(STREAM);
const ids = new Set((await redis.xRange(STREAM, '-', '+')).map((m) => JSON.parse(m.message.e).id));
const { rows: [b] } = await db.query('SELECT count(*)::int AS n FROM ev_bookings');
console.log(`MODE=${MODE}${process.env.RELAY_CRASH ? ' RELAY_CRASH=1' : ''}: ghi ${b.n} lượt đặt trong ${(tWrite / 1000).toFixed(1)} s (Redis rớt 1,5 s ở giây 1,5)`);
console.log(`⇒ stream có ${inStream} sự kiện cho ${ids.size} lượt đặt khác nhau · MẤT ${b.n - ids.size} · trùng ${inStream - ids.size}` + (MODE === 'dual' ? ` · XADD hỏng ${lost} lần` : ''));
if (MODE === 'outbox') {
  const { rows: [l] } = await db.query(`SELECT round(percentile_cont(0.5) WITHIN GROUP (ORDER BY ms))::int AS p50, round(percentile_cont(0.99) WITHIN GROUP (ORDER BY ms))::int AS p99, max(ms)::int AS max
    FROM (SELECT extract(epoch FROM published_at - created_at) * 1000 AS ms FROM outbox) x`);
  console.log(`⇒ độ trễ từ COMMIT tới khi lên stream: p50 ${l.p50} ms · p99 ${l.p99} ms · max ${l.max} ms`);
}
process.exit(0);
