// perf/migration-locks.mjs — bài 12.2: migration nào KHOÁ bảng production, khoá bao lâu?
// Dựng bảng giả 1.000.000 lượt đặt trong schema riêng "mig" (bị XOÁ và dựng lại), rồi với mỗi câu ALTER/CREATE INDEX:
// một phiên khác INSERT ngay sau đó 100 ms — đo lượt INSERT đó phải CHỜ bao lâu (người dùng thấy đúng con số này).
//   DATABASE_URL=postgres://… node perf/migration-locks.mjs
import pg from 'pg';

const url = process.env.DATABASE_URL ?? 'postgres://labflow@localhost:55432/labflow_demo';
const a = new pg.Client(url), b = new pg.Client(url);
await a.connect(); await b.connect();
await a.query(`DROP SCHEMA IF EXISTS mig CASCADE; CREATE SCHEMA mig;
  CREATE TABLE mig.bookings (id bigint PRIMARY KEY, lab_id text NOT NULL, user_id text NOT NULL, start_at timestamptz NOT NULL, status text NOT NULL);
  INSERT INTO mig.bookings SELECT i, 'lab_' || (i % 50 + 1), 'usr_' || (i % 5000 + 1), now() + i * interval '1 minute', 'PENDING'
    FROM generate_series(1, 1000000) i; ANALYZE mig.bookings;`);
let next = 2000000;
async function measure(label, ddl) {
  const t0 = performance.now();
  const run = a.query(ddl).then(() => performance.now() - t0);
  await new Promise((r) => setTimeout(r, 100));
  const t1 = performance.now();
  await b.query("INSERT INTO mig.bookings VALUES ($1, 'lab_1', 'usr_1', now(), 'PENDING')", [next++]);
  const wait = performance.now() - t1;
  const ms = await run;
  console.log(`${label.padEnd(58)} migration ${String(Math.round(ms)).padStart(5)} ms · INSERT của người dùng chờ ${String(Math.round(wait)).padStart(5)} ms`);
}
await measure('ADD COLUMN seats int NOT NULL DEFAULT 1', 'ALTER TABLE mig.bookings ADD COLUMN seats int NOT NULL DEFAULT 1');
await measure('ADD COLUMN token text DEFAULT md5(random()::text)', 'ALTER TABLE mig.bookings ADD COLUMN token text DEFAULT md5(random()::text)');
await measure('CREATE INDEX ON (user_id, start_at)', 'CREATE INDEX bk_user_a ON mig.bookings (user_id, start_at)');
await measure('CREATE INDEX CONCURRENTLY ON (user_id, start_at)', 'CREATE INDEX CONCURRENTLY bk_user_b ON mig.bookings (user_id, start_at)');
await a.query('DROP SCHEMA mig CASCADE');
await a.end(); await b.end();
