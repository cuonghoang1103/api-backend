/**
 * pg-11-4 — PostgreSQL · Chapter 11 · Lesson 11.4 "Row locks, lost updates & deadlocks" (slide EN, kiểu FU, 25/10/2026, agent c11).
 * Nguồn: content/courses/postgresql/s11-giao-dich.mjs › postgresql-11-4-khoa-deadlock. Output = chạy thật PostgreSQL 17.11 (pgcourse17, schema ch11),
 * HAI/BA phiên psql thật (c11-scripts/hai-phien.mjs): that/pg-11-4a (người ghi chặn người ghi + pg_blocking_pids + pg_locks) · 4b (lost update ⇒ 80) ·
 * 4c (UPDATE nguyên tử ⇒ 70) · 4d (FOR UPDATE, B đọc lại 90) · 4e (NOWAIT, lock_timeout, statement_timeout) · 4f (SKIP LOCKED) · 4g (deadlock thật +
 * pg-11-4g.serverlog.txt) · 4h (thứ tự khoá cố định ⇒ không deadlock) · 4i (CT Shop bán vượt kho vs UPDATE có điều kiện) · 4j (khoá tư vấn) · pg-11-4x (bài tập).
 * Bổ sung so với web: sổ quỹ lớp (đời thường), soi ai chặn ai bằng pg_blocking_pids/pg_locks, CT Shop "cái cuối cùng" (CHECK không cứu được), ví điểm
 * CuongThai (UPDATE có điều kiện), statement_timeout, log máy chủ của deadlock, khoá tư vấn (pg_advisory_xact_lock — mã CT Work thật), bài tập RETURNING.
 */
import { lamDeck, sql, psql, run, two, box, kw, cards, steps } from './_pg-chung.mjs';
import { haiPsql, fundPic, lockQueuePic, lostPic, skipPic, deadlockPic } from './pg-11-hinh.mjs';

const zm = (h, z = 1.2) => `<div style="zoom:${z}">${h}</div>`;
export const deck = { key: 'pg-11-4', code: 'PG 11.4', title: 'Row locks, lost updates & deadlocks', sub: 'FOR UPDATE · SKIP LOCKED · deadlock' };

export const slides = lamDeck({ chuong: 'Chapter 11 — Transactions & concurrency', bai: '11.4' }, [
  { cover: true, t: 'Row locks, lost updates<br>& deadlocks', sub: 'Writers DO block writers — the bug that steals money,<br>three ways to fix it, job queues and a real deadlock' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>See a writer <b>wait</b> for another writer — and find out <b>who blocks whom</b></li>
<li>The <b>lost update</b>: read → compute in the app → write back, and three fixes</li>
<li>Selling the last item twice in CT Shop — and the one-line fix</li>
<li>Don’t wait forever: <code class="i">NOWAIT</code>, <code class="i">lock_timeout</code>, <code class="i">statement_timeout</code>; job queues with <code class="i">SKIP LOCKED</code></li>
<li>A real <b>deadlock</b>, how to read it, and why the fix is <b>ordering</b>; advisory locks</li>
</ul>
${box('Remember from 11.2', 'Readers never block writers and writers never block readers. The other half is the expensive one: <b>writers DO block writers</b>.', 'lam')}` },

  { t: 'Everyday example first: the class fund notebook', giua: true, body: `
${fundPic()}
<p style="font-size:22px;margin:0">Each student read the balance, did the maths in their head, and wrote down <b>their own result</b>. Both believed they were right; the book is wrong. Applications do exactly this when they read a row, compute in code, and write the number back.</p>` },

  { t: 'A writer waits for a writer (real, with timings)', body: `
${haiPsql([
    ['+0.00s', "> BEGIN;\n> UPDATE accounts SET balance = balance - 10\n  WHERE id = 'A';\nUPDATE 1", ''],
    ['+0.05s', '', "> BEGIN;\n> UPDATE accounts SET balance = balance - 20\n  WHERE id = 'A';\n⏳ (no output — waiting for A’s row lock)"],
    ['+2.61s', '> COMMIT;\nCOMMIT', 'UPDATE 1      ← only now'],
    ['+2.62s', '', '> COMMIT;\nCOMMIT'],
  ], { fs: 14, hl: [1, 2] })}
${zm(lockQueuePic(), 0.72)}
<p style="font-size:19px;margin:0">B’s <code class="i">UPDATE 1</code> appeared <b>2.6 s later</b> — the instant A committed (final balance 70.00).</p>` },

  { t: 'Who is blocking whom? Ask the server (real)', giua: true, body: `
${zm(run(`SELECT pid, application_name AS app, state, wait_event_type, wait_event,
       pg_blocking_pids(pid) AS blocked_by
FROM pg_stat_activity WHERE application_name IN ('A','B') ORDER BY app;`, `  pid  | app |        state        | wait_event_type |  wait_event   | blocked_by
------+-----+---------------------+-----------------+---------------+------------
 6445 | A   | idle in transaction | Client          | ClientRead    | {}
 6444 | B   | active              | Lock            | transactionid | {6445}`, { hl: [2], hlOut: [4], title: 'psql (17.11) — third session C, while B waits' }), 0.95)}
${two(box('How to read it', '<code class="i">pg_blocking_pids(pid)</code> = the PIDs holding the lock this session waits for: B (6444) is blocked by <b>{6445}</b> = A, which is <i>idle in transaction</i> — it finished its UPDATE and is just sitting there. In <code class="i">pg_locks</code>, a waiting lock has <b>granted = f</b>: B wants a ShareLock on A’s <b>transaction ID</b>, i.e. “wake me when A ends”.', 'lam'),
  zm(psql(` app |   locktype    |     mode      | granted
-----+---------------+---------------+---------
 A   | transactionid | ExclusiveLock | t
 B   | transactionid | ExclusiveLock | t
 B   | tuple         | ExclusiveLock | t
 B   | transactionid | ShareLock     | f`, { sm: true, title: 'pg_locks (real) — B waits on A’s transaction', hl: [6] }), 1.0))}` },

  { t: 'The lost update — the bug that steals money (real)', body: `
${haiPsql([
    ['+0.04s', "> SELECT balance FROM accounts WHERE id = 'A';\n  100.00", ''],
    ['+0.05s', '', "> SELECT balance FROM accounts WHERE id = 'A';\n  100.00"],
    ['+0.08s', "> UPDATE accounts SET balance = 100 - 10 WHERE id = 'A';\nUPDATE 1", ''],
    ['+0.10s', '', "> UPDATE accounts SET balance = 100 - 20 WHERE id = 'A';\n⏳ (waits for A)"],
    ['+1.10s', '> COMMIT;\nCOMMIT', 'UPDATE 1\n> COMMIT;\nCOMMIT'],
  ], { fs: 15, hl: [3] })}
${two(zm(psql(` balance
---------
   80.00
(1 row)`, { sm: true, title: 'SELECT balance … afterwards', hl: [3] }), 1.1),
  box('100 − 10 − 20 should be 70.00', 'A’s 10 <b>evaporated</b>. No error, no warning, no deadlock — both transactions reported success. B computed 80 from a value that was already stale. It is the most common serious concurrency bug in app code, because with one test user everything looks fine.', 'bad'))}` },

  { t: 'Picture it: two reads, two writes, one gap', giua: true, body: `
${lostPic()}
${box('Why no isolation level helps', 'The read and the write are separated by a round trip through <b>your application</b>. Read Committed lets it happen silently; Repeatable Read would turn it into a 40001 you still have to handle (11.3). The real fix is to close the gap.', 'lam')}` },

  { t: 'Fix 1 — never read a value just to write it back', giua: true, body: `
${haiPsql([
    ['+0.03s', "> UPDATE accounts SET balance = balance - 10\n  WHERE id = 'A';\nUPDATE 1", ''],
    ['+0.05s', '', "> UPDATE accounts SET balance = balance - 20\n  WHERE id = 'A';\n⏳ (waits for A)"],
    ['+1.05s', '> COMMIT;\nCOMMIT', 'UPDATE 1\n> COMMIT;\nCOMMIT'],
  ], { fs: 15 })}
${two(zm(psql(` balance
---------
   70.00
(1 row)`, { sm: true, title: 'afterwards', hl: [3] }), 1.1),
  box('Correct — and the simplest', '<code class="i">balance = balance - 10</code> reads and writes <b>atomically, under the row lock</b>: B waits, then re-evaluates against the committed 90. No lock code, no retry, no level change. Think of it <b>first</b>: counters, balances, stock, view counts.', 'xanh'))}` },

  { t: 'CT Shop: two customers, the last pen (real)', giua: true, body: `
${two(`<div><div class="tcap">✗ read stock → check in the app → write the computed number</div>${haiPsql([
    ['', "> SELECT name, stock …;\n stock = 1", "> SELECT name, stock …;\n stock = 1"],
    ['', "> UPDATE product SET stock = 0\n  WHERE id = 2;\n> INSERT INTO order_line …;", "> UPDATE product SET stock = 0\n  WHERE id = 2;\n⏳ … UPDATE 1 after A commits\n> INSERT INTO order_line …;"],
  ], { fs: 13, wt: 8 })}${psql(` ton_kho | so_don_da_ban
---------+---------------
       0 |             2`, { sm: true, title: 'afterwards: 2 orders for 1 pen', hl: [3] })}</div>`,
  `<div><div class="tcap">✓ the rule inside the UPDATE</div>${haiPsql([
    ['', "> UPDATE product\n  SET stock = stock - 1\n  WHERE id = 2 AND stock >= 1;\nUPDATE 1", "> UPDATE product\n  SET stock = stock - 1\n  WHERE id = 2 AND stock >= 1;\n⏳ …"],
    ['', '> INSERT INTO order_line …;\n> COMMIT;', 'UPDATE 0   ← sold out\n> ROLLBACK;'],
  ], { fs: 13, wt: 8 })}${psql(` ton_kho | so_don_da_ban
---------+---------------
       0 |             1`, { sm: true, title: 'afterwards: 1 order, no oversell', hl: [3] })}</div>`)}
<p style="font-size:18px;margin:0">Product 2 = “Bút bi Thiên Long TL-079 (hộp 20 cây)”, stock set to 1. <code class="i">CHECK (stock &gt;= 0)</code> did <b>not</b> help on the left: both wrote 0, which is legal. Row count 0 is how the app learns “sold out”.</p>` },

  { t: 'Real code: the CuongThai wallet does exactly this', giua: true, body: `
${two(zm(sql(`// src/services/points.service.ts — spend points
const hit = await tx.pointAccount.updateMany({
  where: { userId, balance: { gte: cost } },   // rule IN the UPDATE
  data:  { balance: { decrement: cost },
           totalSpent: { increment: cost } },
});
if (hit.count === 0) {
  throw new BadRequestError('Không đủ điểm …');  // = UPDATE 0
}`, { sm: true, lang: 'typescript', hl: [3, 7] }), 1.0),
  box('Their comment, rule 2', '“Spending uses <code class="i">updateMany</code> with <code class="i">balance &gt;= amount</code> — NOT read-then-write. Read-then-write loses the race: two tabs click Buy, both read enough money, both deduct, the balance goes negative. With the condition inside the UPDATE, Postgres locks the row and one of the two gets <b>0 rows</b> — that is the rejected one.”', 'lam'))}` },

  { t: 'Fix 2 — SELECT … FOR UPDATE (read first)', body: `
${haiPsql([
    ['+0.04s', "> BEGIN;\n> SELECT balance FROM accounts WHERE id = 'A' FOR UPDATE;\n  100.00", ''],
    ['+0.05s', '', "> BEGIN;\n> SELECT balance FROM accounts WHERE id = 'A' FOR UPDATE;\n⏳ (blocked by A’s FOR UPDATE)"],
    ['+1.06s', "> UPDATE accounts SET balance = 100 - 10 WHERE id = 'A';\n> COMMIT;", ''],
    ['+1.09s', '', "   90.00     ← B re-reads the COMMITTED value\n> UPDATE accounts SET balance = 90 - 20 WHERE id = 'A';\n> COMMIT;"],
  ], { fs: 15, hl: [3] })}
${two(zm(psql(` balance
---------
   70.00`, { sm: true, title: 'afterwards', hl: [3] }), 1.1),
  box('Why it works', 'When B finally gets the lock (Read Committed) it does <b>not</b> return the old 100.00 — it <b>re-reads</b> the row: 90.00. Use it when the new value needs real business logic, not a formula.', 'xanh'))}` },

  { t: 'Don’t wait forever: NOWAIT & timeouts', giua: true, body: `
${zm(psql(`-- A holds the row with SELECT … FOR UPDATE; session B:
SELECT balance FROM accounts WHERE id = 'A' FOR UPDATE NOWAIT;
ERROR:  could not obtain lock on row in relation "accounts"
SET lock_timeout = '250ms';
SELECT balance FROM accounts WHERE id = 'A' FOR UPDATE;
ERROR:  canceling statement due to lock timeout
CONTEXT:  while locking tuple (0,56) in relation "accounts"
SET statement_timeout = '500ms';
SELECT pg_sleep(2);
ERROR:  canceling statement due to statement timeout`, { title: 'psql (17.11) — session B (real, 0.04 s → 0.87 s)', hl: [3, 6, 10] }), 1.05)}
${box('In a web request', '<b>NOWAIT</b> fails at once; <b>lock_timeout</b> gives the lock a bounded chance (0.25 s here, measured 0.33 − 0.08); <b>statement_timeout</b> caps the whole statement. A sane lock_timeout turns “the site hangs” into a fast, catchable error you can retry or report.', 'lam')}` },

  { t: 'SKIP LOCKED — a job queue in one query (real)', body: `
${haiPsql([
    ['+0.00s', "> BEGIN;\n> SELECT id, payload FROM job WHERE state = 'queued'\n  ORDER BY id FOR UPDATE SKIP LOCKED LIMIT 2;\n  1 | job-1\n  2 | job-2", ''],
    ['+0.05s', '', "> BEGIN;\n> SELECT id, payload FROM job WHERE state = 'queued'\n  ORDER BY id FOR UPDATE SKIP LOCKED LIMIT 2;\n  3 | job-3\n  4 | job-4"],
    ['+0.08s', "> UPDATE job SET state = 'done' WHERE id IN (1, 2);\n> COMMIT;", "> UPDATE job SET state = 'done' WHERE id IN (3, 4);\n> COMMIT;"],
  ], { fs: 14, hl: [1] })}
${skipPic({ w: 1110, h: 200 }).replace('height="200"', 'height="170"').replace('viewBox="0 0 1110 200"', 'viewBox="0 20 1110 200"')}` },

  { t: 'A real deadlock — and how to read it', body: `
${haiPsql([
    ['+0.04s', "> UPDATE accounts SET balance = balance - 1 WHERE id = 'A';\nUPDATE 1", ''],
    ['+0.05s', '', "> UPDATE accounts SET balance = balance - 1 WHERE id = 'B';\nUPDATE 1"],
    ['+0.07s', "> UPDATE … WHERE id = 'B';   ⏳ A waits for B", ''],
    ['+0.47s', '', "> UPDATE … WHERE id = 'A';   ⏳ B waits for A"],
    ['+1.08s', 'ERROR:  deadlock detected\nDETAIL:  Process 6690 waits for ShareLock on transaction 68724;\n        blocked by process 6691.\nProcess 6691 waits for ShareLock on transaction 68723;\n        blocked by process 6690.\nHINT:  See server log for query details.\nCONTEXT:  while updating tuple (0,69) in relation "accounts"', 'UPDATE 1'],
    ['+1.10s', '> COMMIT;\nROLLBACK      ← the victim was already dead', '> COMMIT;\nCOMMIT'],
  ], { fs: 13, hl: [4] })}
${zm(psql(`[6690] DETAIL:  … Process 6690: UPDATE accounts SET balance = balance - 1 WHERE id = 'B';
              Process 6691: UPDATE accounts SET balance = balance - 1 WHERE id = 'A';`, { sm: true, title: 'docker logs pgcourse17 — the server log names both statements' }), 0.95)}` },

  { t: 'Picture it: each holds what the other needs', giua: true, body: `
${deadlockPic()}
${steps([
    'A locks row A, B locks row B — both granted, nothing looks wrong yet.',
    'A asks for row B, B asks for row A: the cycle <b>closes</b>, nobody can move.',
    'After <code class="i">deadlock_timeout</code> (1 s, measured: 0.07 → 1.08 s) PostgreSQL picks a victim, cancels it, lets the other finish.',
  ])}` },

  { t: 'The fix is ORDER: always lock in one order', body: `
${haiPsql([
    ['+0.03s', "> SELECT id FROM accounts WHERE id IN ('A','B')\n  ORDER BY id FOR UPDATE;\n A\n B", ''],
    ['+0.05s', '', "> SELECT id FROM accounts WHERE id IN ('B','A')\n  ORDER BY id FOR UPDATE;\n⏳ (waits — no cycle can form)"],
    ['+1.25s', "> UPDATE … 'A'; > UPDATE … 'B';\n> COMMIT;", ''],
    ['+1.32s', '', " A\n B\n> UPDATE … 'B'; > UPDATE … 'A';\n> COMMIT;    COMMIT"],
  ], { fs: 14, hl: [1] })}
${box('Rule', 'If every transaction takes its locks in the same order — e.g. ascending primary key — step 2 of the cycle can never happen. Sort the IDs before updating several rows; one <code class="i">ORDER BY id</code> in the <code class="i">SELECT … FOR UPDATE</code> is often the whole fix. Both transfers succeeded: A 98.00, B 98.00.', 'xanh')}` },

  { t: 'Advisory locks: lock an idea, not a row (real)', giua: true, body: `
${haiPsql([
    ['+0.00s', '> BEGIN;\n> SELECT pg_advisory_xact_lock(31005, 7);', ''],
    ['+0.03s', '', '> SELECT pg_try_advisory_xact_lock(31005, 7) AS lay_duoc;\n f'],
    ['+0.07s', '', '> BEGIN;\n> SELECT pg_advisory_xact_lock(31005, 7);\n⏳ waits — pg_locks: advisory · 31005 · 7 · granted f'],
    ['+1.11s', '> COMMIT;', '(granted)\n> COMMIT;'],
  ], { fs: 15 })}
${two(zm(sql(`// CT Work — one report number per project at a time
await prisma.$transaction(async (tx) => {
  await tx.$executeRaw\`SELECT pg_advisory_xact_lock(
    31005::int, \${projectId}::int)\`;
  // read max(no) + 1, insert … safely
});`, { sm: true, lang: 'typescript', hl: [3] }), 1.0),
  box('When', 'The thing to protect is not one existing row: “the next report number of project 7”, “only one cron run at a time”. Two numbers name the lock; <code class="i">_xact_</code> releases it at COMMIT/ROLLBACK; <code class="i">pg_try_…</code> answers at once.', 'lam'))}` },

  { t: 'Trap: treating a deadlock as a database bug', giua: true, to: true, body: `
${box('It is the server doing the RIGHT thing', 'A deadlock is not corruption and not a PostgreSQL bug: the server refuses to hang forever, and the message names both processes and the exact tuple — enough to find two code paths that take the same locks in <b>opposite</b> order.', 'lam')}
${cards([
    ['✗ Blind retry', 'Retrying without fixing the order: the deadlock returns at peak load, just less predictably.'],
    ['✗ Raise deadlock_timeout', 'The server only waits LONGER before noticing — both transactions stay stuck longer.'],
    ['✓ Fix the order', 'Sort IDs, lock in one consistent order; keep a retry loop as a safety net, not the plan.'],
  ])}` },

  { t: 'Exercise — buy N items safely (real answer)', giua: true, body: `
${two(`<div>${steps([
    'Set product 3 (“Bút bi Pentel BK77 0.7mm”) stock to 4.',
    'Write ONE statement that buys <b>N</b> items only if enough stock is left, and returns the new stock.',
    'Try N = 5, then N = 3, then N = 3 again. What does each print?',
  ])}</div>`,
  zm(run(`UPDATE product SET stock = stock - 5
WHERE id = 3 AND stock >= 5 RETURNING stock;   -- N = 5
UPDATE product SET stock = stock - 3
WHERE id = 3 AND stock >= 3 RETURNING stock;   -- N = 3
UPDATE product SET stock = stock - 3
WHERE id = 3 AND stock >= 3 RETURNING stock;   -- N = 3 again`, ` stock
-------
(0 rows)

UPDATE 0
 stock
-------
     1
(1 row)

UPDATE 1
 stock
-------
(0 rows)

UPDATE 0`, { hlOut: [5, 8, 16], title: 'answer — psql 17.11 (real run)' }), 0.85))}` },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>Two sessions run <code class="i">SET balance = 100 - 10</code> and <code class="i">SET balance = 100 - 20</code> after both read 100. Final balance — and the one-line fix?</li>
<li>What does <code class="i">pg_blocking_pids(pid)</code> tell you, and which column of <code class="i">pg_locks</code> shows a waiting lock?</li>
<li>Two code paths update rows A,B and B,A and sometimes deadlock. Fix?</li>
</ol>
${box('Answers', '1) <b>80.00</b> (lost update); write <code class="i">SET balance = balance - 10</code>, or a conditional UPDATE. 2) The PIDs holding the lock it waits for; <code class="i">granted = f</code>. 3) Lock in one order — <code class="i">ORDER BY id … FOR UPDATE</code> — and keep a retry as a safety net.', 'xanh')}` },

  { t: 'Summary of Chapter 11 & next', to: true, giua: true, body: `
<ul>
<li>Writers block writers; locks last until the <b>transaction</b> ends — find blockers with <code class="i">pg_blocking_pids</code></li>
<li>Lost update = read → compute in the app → write back. Fix 1: one atomic/conditional UPDATE; Fix 2: <code class="i">FOR UPDATE</code></li>
<li>Bound waiting: NOWAIT, lock_timeout, statement_timeout; queues: <code class="i">SKIP LOCKED</code>; non-row locks: advisory</li>
<li>Deadlock = a cycle; fix with a consistent lock order, retry only as a safety net</li>
</ul>
${box('Next', 'The Chapter 11 quiz, then Chapter 12 — functions, triggers and views; Lab 6 puts it together: placing a CT Shop order in one transaction that locks stock with FOR UPDATE.', 'lam')}` },
]);
