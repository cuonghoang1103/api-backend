/**
 * api-11-6 — API Design · Chapter 11 · Lesson 11.6 "Interview: a booking system" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s11-phong-van.mjs › api-11-4-dat-lich. Output = chạy thật interview/booking/race.mjs trên PostgreSQL 18.4.
 */
import { lamDeck, sql, http, two, box, vsd } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 11 — The API design interview', bai: '11.6' };

export const deck = { key: 'api-11-6', code: 'API 11.6', title: 'A booking system', sub: 'LabFlow is the answer — bring evidence' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Interview: a booking system', sub: 'LabFlow is the answer —<br>and fifty students press “Book” at once.' },

  { t: 'Bring evidence, not features', body: `<table class="t"><tr><th>Claim in the interview</th><th>Evidence you measured</th><th>Lesson</th></tr>
<tr><td>Cursor pages, not OFFSET</td><td>row 900,000: OFFSET 78 ms, keyset 0.064 ms</td><td>3.1–3.2</td></tr>
<tr><td>Idempotency-Key on POST /bookings</td><td>lost response + retry ⇒ misleading 409 on your own booking</td><td>5.1</td></tr>
<tr><td>Rate limit, trust proxy right</td><td>5 / 60 s per user; wrong trust proxy ⇒ 8/8 spoofed passed</td><td>5.3</td></tr>
<tr><td>Object-level checks, 404</td><td>authorization matrix: 8 wrong cells ⇒ 0</td><td>6.2</td></tr>
<tr><td>Hashing off the event loop</td><td>logins 30 ⇒ 114/s; lab list p99 463 ⇒ 8 ms</td><td>8.2</td></tr>
<tr><td>Shared state for 2 instances</td><td>two bk_1, 8/8 past a limit of 5, same key ⇒ two 201s</td><td>8.4</td></tr>
<tr><td>Shed load at 07:00</td><td>goodput 136 ⇒ 12/s without; 123/s with 503 + Retry-After</td><td>8.5</td></tr>
<tr><td>Exports as jobs · events via outbox</td><td>524 at 100 s ⇒ 202 in 17 ms · dual write lost 342, outbox 0</td><td>10.1 · 10.3</td></tr></table>` + box('Use two or three', '“Have you actually seen this happen?” — “Yes, here is the number” ends the question.', 'xanh') },

  { t: 'Fifty students, one slot, one moment', body: sql(`async naive(c, user) {                       // check, then insert — two statements
  await c.query('BEGIN');
  const { rowCount } = await c.query(overlap, ['lab_1', SLOT]);
  if (rowCount) { await c.query('ROLLBACK'); return 409; }
  await pause(5);                             // 5 ms of other checks in a real handler
  await c.query(insert, ['lab_1', SLOT, user]);
  await c.query('COMMIT'); return 201;
},`, { lang: 'javascript', sm: true, hl: [3, 6] }) + http(`$ for m in naive naive naive lock serializable constraint constraint; do node interview/booking/race.mjs $m; done
naive        201: 50  409:  0  40001:  0  lượt đặt trong bảng: 50  p50 22.9 ms  chậm nhất 24.8 ms  tổng 25 ms
naive        201: 50  409:  0  40001:  0  lượt đặt trong bảng: 50  p50 20.7 ms  chậm nhất 21.5 ms  tổng 22 ms
naive        201: 50  409:  0  40001:  0  lượt đặt trong bảng: 50  p50 27.6 ms  chậm nhất 28.3 ms  tổng 29 ms
lock         201:  1  409: 49  40001:  0  lượt đặt trong bảng:  1  p50 65.5 ms  chậm nhất 104.2 ms  tổng 106 ms
serializable 201:  1  409: 12  40001: 37  lượt đặt trong bảng:  1  p50 22.7 ms  chậm nhất 38.1 ms  tổng 39 ms
constraint   201:  1  409: 49  40001:  0  lượt đặt trong bảng:  1  p50 27.8 ms  chậm nhất 44.7 ms  tổng 45 ms
constraint   201:  1  409: 49  40001:  0  lượt đặt trong bảng:  1  p50 31.0 ms  chậm nhất 34.2 ms  tổng 34 ms`, { sm: true, wrap: true, title: 'PostgreSQL 18.4 · 50 connections opened first, then all at once' }) },

  { t: 'Four handlers, compared', body: `<table class="t"><tr><th>Handler</th><th>Bookings</th><th>Losers get</th><th>Cost</th></tr>
<tr><td>check, then insert (Read Committed)</td><td><b>50</b></td><td>—</td><td>each SELECT sees only rows committed before it began</td></tr>
<tr><td><code class="i">SELECT … FOR UPDATE</code> on the lab row</td><td>1</td><td>409</td><td>everyone queues on one row (slowest 104 ms), for any time</td></tr>
<tr><td>SERIALIZABLE</td><td>1</td><td>40001 (37) or 409 (12)</td><td>the API must retry 40001 or map it to 409 — never 500</td></tr>
<tr><td>exclusion constraint</td><td>1</td><td>409 from 23P01</td><td>one INSERT; holds for every instance and code path</td></tr></table>` + sql(`CREATE TABLE iv.bookings (id serial PRIMARY KEY, lab_id text NOT NULL, slot tstzrange NOT NULL,
  user_id text NOT NULL, status text NOT NULL, hold_expires_at timestamptz,
  CONSTRAINT no_overlap EXCLUDE USING gist (lab_id WITH =, slot WITH &&)
    WHERE (status IN ('HELD', 'CONFIRMED')));     -- needs CREATE EXTENSION btree_gist`, { lang: 'plaintext', sm: true }) + box('tstzrange + &&', 'A booking’s time is a range [14:00, 16:00); && means “overlaps”. The database refuses the second overlapping active booking.', 'lam') },

  { t: 'Holds that expire — and the trap', body: http(`$ node interview/booking/race.mjs holds
An giữ chỗ #1 (HELD, hết hạn sau 2 s) rồi đi đóng tiền… và quên
Bình giữ chỗ sau 2,5 s: 23P01 conflicting key value violates exclusion constraint "no_overlap"
dọn 1 chỗ giữ hết hạn trong cùng transaction ⇒ Bình giữ chỗ #3: được
An quay lại xác nhận #1: 0 dòng đổi ⇒ 409 HOLD_EXPIRED
Bình xác nhận #3: 1 dòng đổi ⇒ 200 CONFIRMED`, { sm: true, wrap: true }) + vsd('<p>The constraint cannot read the clock (<code class="i">now()</code> is not allowed in an index predicate): an expired hold still blocks. A cron job makes correctness depend on its timing.</p>', '<p>In the inserting transaction: mark that lab’s expired holds EXPIRED, then insert. Confirm with <code class="i">UPDATE … WHERE status = \'HELD\' AND hold_expires_at &gt; now()</code> — 0 rows ⇒ 409 HOLD_EXPIRED.</p>', '✗ expired, still blocking', '✓ expire where you insert') + box('Bình got #3, not #2', 'The failed insert consumed id 2 — sequences never go back. Ids count nothing.', 'lam') },

  { t: 'Follow-ups and summary', giua: true, body: two(box('07:00, 5,000 students in a minute', '~80 bookings/s; the constraint answers conflicts in ms. Reads cached with ETags; logins shed with 503 + Retry-After (8.5); clients retry with jitter (5.2); a waiting room is a product decision.', 'lam'), box('When does my slot free up?', 'Waitlist from Lab 7; cancel ⇒ <code class="i">booking.cancelled</code> through the outbox (10.3) ⇒ offer to the first in line. Position computed when read.', 'lam')) + `<ul><li>Check-then-insert: <b>50 of 50</b> succeeded; FOR UPDATE, SERIALIZABLE and EXCLUDE: <b>1</b></li><li>SERIALIZABLE losers get <b>40001</b> — retry or 409, never 500</li><li>Expired holds still block: expire them in the inserting transaction; confirm with a conditional UPDATE</li></ul>` + box('Next', 'Lab 11 — your own mock interview: club events, a waitlist, check-in on bad Wi-Fi.', 'xanh') },
]);
