/**
 * api-12-3 — API Design · Chapter 12 · Lesson 12.3 "Building on PostgreSQL" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: s12-du-an-cuoi-khoa.mjs › api-12-2-xay-dung. Output = chạy thật npm run test:pg, perf/pool.mjs, perf/race-api.mjs (2 instance), EXPLAIN.
 */
import { lamDeck, sql, http, two, box, flow } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 12 — Capstone', bai: '12.3' };

export const deck = { key: 'api-12-3', code: 'API 12.3', title: 'Building on PostgreSQL', sub: 'One pool, transactions, rules the database enforces' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Building on PostgreSQL', sub: 'Same contract, same tests —<br>a database underneath.' },

  { t: 'One interface, two stores, the same tests', giua: true, body: flow([
    { t: 'route', s: 'validate · authorize · view' }, { t: 'store', s: '39 async functions' },
    { t: 'memory.js', s: 'arrays · npm test', mau: '#6b6b6b' }, { t: 'pg.js', s: 'SQL · LABFLOW_STORE=pg', mau: '#2e7d32' }]) + http(`$ DATABASE_URL=…/labflow_test npm run -s test:pg
seed labflow_test: users 3 · labs 4 · devices 3 · bookings 0 · issues 0 (20 ms)
✔ 12.3: 20 request cùng đặt MỘT khung giờ ⇒ đúng 1 lượt 201, 19 lượt 409 kèm conflictWith
✔ 12.3: một sinh viên bấm 6 lượt song song ⇒ chỉ 3 lượt được (TOO_MANY_ACTIVE_BOOKINGS)
✔ 12.4: hai quản lý cùng sửa MỘT thiết bị với cùng If-Match ⇒ một 200, một 412
✔ 12.5: lượt đặt bị 409 KHÔNG để lại sự kiện; lượt 201 có đúng một sự kiện …
ℹ tests 18   ℹ pass 18   ℹ fail 0`, { sm: true, wrap: true }) + box('The sentence that makes a capstone credible', '“We moved from memory to PostgreSQL and the same 18 tests stayed green.” (RAM store: 17 + 1 skipped — the outbox test.)', 'xanh') },

  { t: 'Seven pools ⇒ one, sized on purpose', body: two(http(`$ grep -rn "new pg.Pool" src   # Chapter 11
src/worker.js:52:  … max: 3
src/idempotency-pg.js:7: … max: 5
src/exportTask.js:6: … max: 5
src/routes/notes.js:11: … max: 5
src/routes/notes.js:12: … max: 5
src/routes/webhooks.js:12: … max: 3
src/routes/stats.js:7: … max: 10`, { sm: true, title: 'before' }), sql(`export const pool = new pg.Pool({
  max: 10,                        // × instances ≤ max_connections
  connectionTimeoutMillis: 2000,  // pg default 0 = wait forever
  statement_timeout: 5000,
  application_name: 'labflow-api-A',
});
pool.on('error', (e) => …);      // idle connection died ≠ crash`, { lang: 'javascript', sm: true, hl: [3] }), 'r46') + http(`$ MAX=2 WAIT=0 node perf/pool.mjs
max=2 chờ tối đa ∞ ms · 20 truy vấn 100 ms: xong 20 (nhanh nhất 103 ms, chậm nhất 1028 ms) · lỗi 0 · tổng 1028 ms
$ MAX=2 WAIT=500 node perf/pool.mjs
max=2 chờ tối đa 500 ms · 20 truy vấn 100 ms: xong 10 (…, chậm nhất 517 ms) · lỗi 10 sau ~502 ms: "timeout exceeded when trying to connect"
$ MAX=10 WAIT=500 node perf/pool.mjs
max=10 chờ tối đa 500 ms · 20 truy vấn 100 ms: xong 20 (nhanh nhất 103 ms, chậm nhất 207 ms) · lỗi 0 · tổng 207 ms`, { sm: true, wrap: true, title: 'a pool is a queue' }) },

  { t: 'How many connections may you open?', giua: true, body: two(http(`$ psql … -Atc "SHOW max_connections" -c "SHOW superuser_reserved_connections"
100
3
$ psql … -c "SELECT application_name, state, count(*) FROM pg_stat_activity …"
 application_name | state  | count
 labflow-api-A    | idle   |     2
 labflow-api-B    | idle   |     3
 labflow-relay    | idle   |     1
 labflow-worker   | idle   |     1`, { sm: true, wrap: true }), `<table class="t"><tr><th>Who</th><th>At most</th></tr>
<tr><td>API A + API B (max 10 each)</td><td>20</td></tr><tr><td>worker pool</td><td>10</td></tr>
<tr><td>relay LISTEN + migration runner</td><td>2</td></tr><tr><td><b>total</b></td><td><b>32 of 97</b></td></tr>
<tr><td>8 instances</td><td>82 — time for PgBouncer</td></tr></table>`, 'r46') + box('Empty pool ⇒ 503, not a hang', 'src/pg.js turns “timeout exceeded when trying to connect” into 503 DEPENDENCY_DOWN + Retry-After: the client retries; a hung request only holds a socket.', 'lam') },

  { t: 'A booking is a transaction: fifty at once', body: http(`$ node perf/race-api.mjs slot 50      # RAM store, 2 instances behind the proxy
50 request cùng đặt lab_1 2027-06-01 07:00–09:00: 201@A×1  201@B×1  409@A×24  409@B×24
$ node perf/race-api.mjs slot 50      # PostgreSQL store
50 request cùng đặt lab_1 2027-06-01 07:00–09:00: 409@B×25  409@A×24  201@A×1
GET /v2/bookings khung giờ đó (qua proxy): 1 lượt PENDING`, { sm: true, wrap: true }) + two(sql(`b = await tx(async (c) => {
  …SELECT 1 FROM labs WHERE id = $1 AND retired_at IS NULL…
  if (role === 'STUDENT') {
    await c.query('SELECT 1 FROM users WHERE id = $1 FOR UPDATE', [userId]);
    …count active ⇒ 422 TOO_MANY_ACTIVE_BOOKINGS
  }
  …INSERT … RETURNING *…   // EXCLUDE ⇒ 23P01 ⇒ 409 + conflictWith
  await outbox(c, 'created', row);
});`, { lang: 'javascript', sm: true, hl: [4, 7] }), box('An presses 10 at once (201s)', 'no row lock, 3 runs: <b class="do">8 · 6 · 5</b><br>FOR UPDATE on her row: <b class="xanh">3 · 3 · 3</b>', 'do2') + box('A lock as narrow as the rule', 'One student’s requests queue; other students never wait.', 'xanh'), 'r64') },

  { t: 'Errors mapped once, pages from an index', body: two(`<table class="t"><tr><th>PostgreSQL</th><th>LabFlow answers</th></tr>
<tr><td>23P01 exclusion_violation</td><td>409 BOOKING_CONFLICT + conflictWith</td></tr>
<tr><td>23505 unique_violation</td><td>409 DUPLICATE_SERIAL</td></tr>
<tr><td>ECONNREFUSED · 57P01 · pool timeout</td><td>503 DEPENDENCY_DOWN, Retry-After 5</td></tr>
<tr><td>57014 statement timeout</td><td>503, Retry-After 1</td></tr>
<tr><td>anything else</td><td>500, details in the log</td></tr></table>`, http(`$ psql … EXPLAIN (ANALYZE …) SELECT * FROM bookings
  WHERE user_id = 'usr_1' ORDER BY created_at DESC, seq DESC LIMIT 21
 Limit (actual rows=21.00 loops=1)
   ->  Index Scan using bookings_user_newest on bookings
         Index Cond: (user_id = 'usr_1'::text)
 Execution Time: 0.028 ms`, { sm: true, wrap: true }), 'r46') + box('Summary · next', 'Store interface · one pool sized from max_connections · fail fast as 503 · a booking is one transaction (EXCLUDE + row lock) · keyset from an index. Next (12.4): the state two instances must share.', 'xanh') },
]);
