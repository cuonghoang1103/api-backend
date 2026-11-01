/**
 * api-12-5 — API Design · Chapter 12 · Lesson 12.5 "Cache, outbox, notification queue" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: s12-du-an-cuoi-khoa.mjs › api-12-3-mo-rong. Output = chạy thật perf/event-lag.mjs, perf/notify-cost.mjs, RELAY_CRASH, Server-Timing.
 */
import { lamDeck, sql, http, two, box, vsd, flow } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 12 — Capstone', bai: '12.5' };

export const deck = { key: 'api-12-5', code: 'API 12.5', title: 'Making it scale', sub: 'A cache, a transactional outbox and a notification queue' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Making it scale', sub: 'Read less from the database.<br>Never make a student wait for an email.' },

  { t: 'A cache that can never take the API down', giua: true, body: two(http(`$ for i in 1 2 3; do curl … :4200/v2/labs …; done   # Redis cache
LabFlow-Cache: MISS Server-Timing: validate;dur=1.01, cache;dur=1.69, db;dur=13.80, total;dur=22.98
LabFlow-Cache: HIT Server-Timing: validate;dur=0.04, cache;dur=2.35, total;dur=8.38
LabFlow-Cache: HIT Server-Timing: validate;dur=0.04, cache;dur=0.58, total;dur=1.96
$ … LABFLOW_CACHE_MODE=none
Server-Timing: validate;dur=0.04, db;dur=1.01, total;dur=1.87`, { sm: true, wrap: true }), box('Be honest about the numbers', 'On one laptop a hit (1.96 ms) is no faster than PostgreSQL (1.87 ms) — both are a localhost hop. The win is <b>load kept off the database</b> at 07:00.', 'lam') + box('Two rules', 'Key = every filter + a version (<code class="i">labflow:labs:v1:…</code>). Any Redis error = a miss: 12.4’s outage answered BYPASS with 200.', 'xanh'), 'r64') },

  { t: 'The outbox: an event exists iff the booking does', body: flow([
    { t: 'BEGIN', s: 'INSERT booking' }, { t: 'outbox row', s: 'same transaction' }, { t: 'COMMIT', s: 'pg_notify fires' },
    { t: 'relay', s: 'SKIP LOCKED · XADD', mau: '#2e7d32' }, { t: 'stream', s: 'SSE · WS · email', mau: '#2e7d32' }]) + two(sql(`// c = the booking's transaction
async function outbox(c, kind, b) {
  await c.query(\`INSERT INTO outbox
      (type, subject, data) VALUES ($1, $2, $3)\`,
    [\`labflow.booking.\${kind}.v1\`, b.id,
     bookingEvent(b)]);
  await c.query(
    "SELECT pg_notify('labflow_outbox', '')");
}`, { lang: 'javascript', sm: true }), sql(`BEGIN;
SELECT * FROM outbox WHERE published_at IS NULL
  ORDER BY id LIMIT 100 FOR UPDATE SKIP LOCKED;
-- each row: XADD labflow:events …
UPDATE outbox SET published_at = now() WHERE id = ANY($1);
COMMIT;`, { lang: 'plaintext', sm: true }), 'r46') + box('Dual write measured in 10.3: 342 events lost', 'Now a rolled-back booking leaves no event and a committed one always has one — test/capstone.test.mjs checks both.', 'lam') },

  { t: 'Wake the relay, don’t poll it', giua: true, body: http(`$ N=20 node perf/event-lag.mjs                 # LISTEN/NOTIFY
20 lượt đặt: từ 201 tới sự kiện SSE — p50 1.0 ms · p90 3.1 ms · chậm nhất 6.6 ms · nhanh nhất 0.5 ms
$ … worker with RELAY_LISTEN=0                 # poll every 1 s only
20 lượt đặt: từ 201 tới sự kiện SSE — p50 946.0 ms · p90 967.0 ms · chậm nhất 982.6 ms · nhanh nhất 889.1 ms`, { wrap: true }) + two(box('NOTIFY is delivered at COMMIT', 'Rolled back ⇒ never delivered. The relay sleeps until woken, with a 1 s poll as a safety net.', 'xanh'), box('Path of one event', 'API 201 ⇒ relay ⇒ XADD ⇒ the instance holding the SSE stream ⇒ the browser. p50 1 ms on one machine.', 'lam')) },

  { t: 'Email in the request, or in a queue?', body: two(http(`$ … LABFLOW_NOTIFY=sync
20 lượt POST /v2/bookings: p50 311.0 ms · chậm nhất 327.4 ms · mã 201 ×20
lượt đặt trong bảng: 20
$ touch mail-down; … N=5
5 lượt POST /v2/bookings: p50 311.1 ms · … · mã 500 INTERNAL ×5
lượt đặt trong bảng: 25
$ … retry the first one
1 lượt POST /v2/bookings: … mã 409 BOOKING_CONFLICT ×1`, { sm: true, wrap: true, title: 'sync — inside the request' }), http(`$ … default: outbox ⇒ stream ⇒ BullMQ labflow-notify
20 lượt POST /v2/bookings: p50 3.6 ms · chậm nhất 6.4 ms · mã 201 ×20
$ touch mail-down; … N=5
5 lượt POST /v2/bookings: p50 6.4 ms · … · mã 201 ×5
thư ntf_bk_1_v1 hỏng lần 1: MAIL_PROVIDER_DOWN …
thư ntf_bk_1_v1 hỏng lần 3: MAIL_PROVIDER_DOWN …
thư ntf_bk_1_v1 → lan@…: đã gửi (lần 4, 302 ms)`, { sm: true, wrap: true, title: 'queued — after the commit' })) + vsd('<p>+300 ms for every booking; provider down ⇒ the student sees 500 while the booking exists, retries, and gets 409 on their own booking.</p>', '<p>Booking answers in ~4 ms; a failed email retries with exponential backoff (2 s × 2ⁿ ± 50%) and is delivered after recovery.</p>', '✗ side effect in the request', '✓ outbox + queue') },

  { t: 'At least once in, exactly one email out', body: http(`$ … worker with RELAY_CRASH=0.15; N=20 node perf/notify-cost.mjs
20 lượt POST /v2/bookings: p50 4.3 ms · chậm nhất 19.8 ms · mã 201 ×20
04:09:58.114 [w1] relay "chết" sau XADD outbox #5 (RELAY_CRASH)
outbox: 20 dòng, chưa phát 16
$ node src/worker.js                     # restarted, no RELAY_CRASH
đủ thư sau khi khởi động lại: 30 s
outbox: 20 dòng, chưa phát 0
sự kiện trong stream: 21 · thư đã gửi: 20 · thư trùng: 0`, { sm: true, wrap: true }) + two(box('Three layers of dedupe', 'Job id <code class="i">ntf_bk_5_v1</code> (BullMQ ignores a duplicate) · the same id as the provider’s idempotency key · re-read pending stream entries (id 0) before new ones (<code class="i">&gt;</code>).', 'lam'), box('Summary · next', 'Cache = fewer queries, never a dependency. Outbox = no lost events. Queue = fast bookings, retried email. Next (12.6): re-measure the whole load.', 'xanh')) },
]);
