/**
 * os-05-4 — khoá "Operating Systems for Developers", bài 5.4 "The same bugs in backend code" (28/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c54-node, c54-db (postgres:17), c54-redis (redis:7) — chạy thật trong
 * container vứt đi — qua grab(). Nhúng vào bài bằng giang/os-05-4.mjs.
 */
import { lamDeck, sql, psql, sh, two as two0, box, vsd, hai_phien } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-05-4', code: 'OS 5.4', title: 'The same bugs in backend code', sub: 'Operating Systems · Chapter 5' };

const big = (t, o = {}) => sh(t, { ...o });
/* Dòng lệnh quá dài cho khung ⇒ cắt hiển thị bằng “…” (output giữ nguyên văn). */
const cut = (t, n) => t.split('\n').map((l) => (l.startsWith('$ ') && l.length > n ? l.slice(0, n - 1) + '…' : l)).join('\n');
const db = (pre, n = 1, w = 96, o = {}) => psql(cut(grab('c54-db', pre, n), w), { title: 'psql 17 — two sessions in parallel', ...o });
const rd = (pre, n = 1, w = 96) => sh(cut(grab('c54-redis', pre, n), w), { title: 'redis-cli 7' });
const col = (h) => `<div style="display:flex;flex-direction:column;gap:10px;min-width:0">${h}</div>`;
const two = (a, b, ti = '') => two0(col(a), col(b), ti);
const RD = '#fdecea', OK = '#eaf6ee';

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 5 — Synchronization', bai: '5.4',
}, [
  { cover: true, t: 'The same bugs<br>in backend code', sub: 'Double booking, double charging —<br>FOR UPDATE, Redis locks, idempotency keys' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Why single-threaded Node still <b>sells one seat twice</b></li>
<li>Double booking reproduced in <b>PostgreSQL 17</b> — and two fixes</li>
<li>A customer <b>charged twice</b> — and the idempotency key that stops it</li>
<li>A <b>Redis lock</b> that two workers hold at once — and fencing tokens</li>
</ul>` },

  { t: 'Requests are threads, rows are shared memory', giua: true, body: `
<table class="t" style="font-size:23px">
<tr><th style="width:36%">Lessons 5.1–5.3</th><th>Your backend</th></tr>
<tr><td>thread</td><td>request (event-loop task, pool thread, container)</td></tr>
<tr><td>shared variable</td><td>a row in PostgreSQL, a key in Redis</td></tr>
<tr><td>load – add – store</td><td><code class="i">SELECT</code> – check in the app – <code class="i">UPDATE</code></td></tr>
<tr><td>mutex</td><td><code class="i">SELECT … FOR UPDATE</code> (a row lock)</td></tr>
<tr><td>compare-and-swap</td><td><code class="i">UPDATE … WHERE still-valid</code></td></tr>
</table>
${box('The rule from 5.1 still holds', 'If two requests can read the same row and then write it based on what they read, you have a race.', 'lam')}` },

  { t: 'Node: one thread, and still two bookings', giua: true, body: two(
    sql(`async function book(user) {
  const left = await query(() => db.seatsLeft);
  if (left <= 0) return 'sold out';
  // <- another request runs here
  await query(() => { db.seatsLeft = left - 1; });
  return 'booked';
}`, { lang: 'javascript' }),
    `${big(grab('c54-node', 'node async-race.js', 2))}
<p style="margin:0;font-size:20px">Every <code class="i">await</code> lets other requests run. An in-process lock works — for <b>one</b> process only.</p>`) },

  { t: 'PostgreSQL: read, check, write — both “booked”', giua: true, body: two(
    sql(`BEGIN;
SELECT booked_by IS NULL AS free
  FROM seats WHERE show_id=1 AND seat='A7' \\gset
-- app does other work for 0.5 s
\\if :free
  UPDATE seats SET booked_by = :'who' WHERE ...;
\\endif
COMMIT;`, { lang: 'pgsql' }),
    db('psql -qX -v who=alice -f book-naive.sql', 2, 46)) },

  { t: 'What happened, step by step', giua: true, body: hai_phien([
    ['t0', 'BEGIN; SELECT … → free = true', '', 'plain SELECT takes no lock'],
    ['t1', '', 'BEGIN; SELECT … → free = true', 'MVCC: readers never block', RD],
    ['t2', 'UPDATE … SET booked_by = alice', '', ''],
    ['t3', 'COMMIT', '', 'alice gets an e-mail'],
    ['t4', '', 'UPDATE … SET booked_by = bob', 'overwrites alice', RD],
    ['t5', '', 'COMMIT', 'bob gets an e-mail too', RD],
  ], { a: 'Session alice', b: 'Session bob', fs: 18 }) },

  { t: 'Fix 1: SELECT … FOR UPDATE — bob waits', giua: true, body: `
${db('psql -qX -v who=alice -f book-lock.sql', 2)}
<p style="margin:0;font-size:21px">While alice holds the row, bob’s read shows <code class="i">wait_event_type = Lock</code>. After her COMMIT he re-reads the <b>latest</b> row and refuses.</p>` },

  { t: 'FOR UPDATE is a mutex whose name is a row', giua: true, body: hai_phien([
    ['t0', 'SELECT … FOR UPDATE → free', '', 'row locked'],
    ['t1', '', 'SELECT … FOR UPDATE', 'waits (sleeps, no CPU)', '#fff4e5'],
    ['t2', 'UPDATE … alice; COMMIT', '', 'lock released'],
    ['t3', '', '→ re-reads: booked_by = alice', 'free = false', OK],
    ['t4', '', '“sorry, A7 is taken”; COMMIT', 'correct', OK],
  ], { a: 'Session alice', b: 'Session bob', fs: 18 }) +
    box('Same rules as lesson 5.2', 'Keep the critical section short — never call a payment API or send e-mail while holding a row lock. Lock several rows in a fixed order (Chapter 6: deadlock).', 'lam') },

  { t: 'Fix 2: put the check inside the write', giua: true, body: two(
    sql(`UPDATE seats SET booked_by = :'who'
 WHERE show_id = 1 AND seat = 'A7'
   AND booked_by IS NULL;     -- still free?
-- psql :ROW_COUNT — 1 = you got it, 0 = you lost`, { lang: 'pgsql' }),
    `${db('psql -qX -v who=alice -f book-cond.sql', 2, 46)}
${box('The database’s CAS', 'One statement, no window. Back it with <code>PRIMARY KEY (show_id, seat)</code> on a bookings table as the last line of defence.', 'xanh')}`) },

  { t: 'Charged twice: the same request, delivered twice', giua: true, body: `
${db('psql -qX -v who=request -f pay.sql', 2)}
<p style="margin:0;font-size:21px">App timeout + retry, a double click, a queue redelivering: each copy is valid. 100 − 30 − 30 = 40. <b>No lock helps</b> — even one after the other, both charge.</p>` },

  { t: 'Fix: an idempotency key under a unique constraint', giua: true, body: two(
    sql(`BEGIN;
INSERT INTO idempotency_keys (key, order_id)
  VALUES (:'key', 42)
  ON CONFLICT (key) DO NOTHING;
\\if :ROW_COUNT        -- first time
  UPDATE wallets ...;
  INSERT INTO payments ...;
  UPDATE idempotency_keys SET response ...;
\\else                 -- seen: replay
  SELECT response FROM idempotency_keys ...;
\\endif
COMMIT;`, { lang: 'pgsql', sm: true }),
    db('psql -qX -v who=request -v key', 2, 62, { sm: true }), 'r46') },

  { t: 'A Redis lock with a TTL is a lease', giua: true, body: two(
    rd('redis-cli SET lock:seat:A7 worker-A', 2, 46) + rd('sleep 2.5', 5, 46),
    `<ul style="font-size:21px">
<li>A gets the lock (2 s), B is refused</li>
<li>A <b>pauses 2.5 s</b> (GC, slow query) — the lease expires (<code class="i">PTTL -2</code>)</li>
<li>B takes it, legitimately</li>
<li>A wakes and <code class="i">DEL</code>s — <b>B’s</b> lock</li>
<li>C takes it: <b>B and C both hold it</b></li>
</ul>`) },

  { t: 'Release by token; fence the resource', giua: true, body: two(
    rd('redis-cli EVAL "$(cat unlock.lua)" 1 lock:seat:A7 worker-A', 3, 46),
    rd('redis-cli INCR fence', 5, 46)) +
    `<p style="margin:0;font-size:21px">Token-checked unlock: A can no longer delete C’s lock. Fencing token: the storage rejects the late writer (token 1 after token 2). In SQL: <code class="i">UPDATE … WHERE fence &lt; $token</code>.</p>` },

  { t: 'Redis locks for efficiency, the database for correctness', giua: true, body: vsd(
    `<ul style="font-size:22px"><li>“A Redis lock is a mutex across servers”</li><li>Protect money, seats, stock with <code class="i">SET NX PX</code> alone</li><li>Bigger TTL “to be safe” — pauses have no upper bound</li></ul>`,
    `<ul style="font-size:22px"><li>Redis lock: avoid <b>duplicate work</b> (cron on 3 instances)</li><li>Correctness: row locks, conditional updates, unique constraints, idempotency keys, fencing tokens</li></ul>`,
    '✗ The trap', '✓ The rule') },

  { t: 'Cheat sheet — backend concurrency', giua: true, body: `
<table class="t" style="font-size:21px">
<tr><th style="width:38%">Bug</th><th>Fix</th></tr>
<tr><td>Read-check-write on one row</td><td><code class="i">SELECT … FOR UPDATE</code> or <code class="i">UPDATE … WHERE still-valid</code> + row count</td></tr>
<tr><td>Two inserts of the same thing</td><td><code class="i">UNIQUE</code>/<code class="i">PRIMARY KEY</code> — let the DB refuse</td></tr>
<tr><td>Retries / double clicks / redelivery</td><td>idempotency key, same transaction, replay response</td></tr>
<tr><td>Only one instance may run a job</td><td>Redis <code class="i">SET NX PX</code> + token unlock (efficiency)</td></tr>
<tr><td>Stale lock holder writes late</td><td>fencing token checked by the storage</td></tr>
<tr><td>See who is waiting on a lock</td><td><code class="i">pg_stat_activity WHERE wait_event_type = 'Lock'</code></td></tr>
</table>
${box('Next', 'Chapter 6 — deadlock: when two of these locks are taken in opposite orders.', 'lam')}` },
]);
