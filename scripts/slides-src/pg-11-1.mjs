/**
 * pg-11-1 — PostgreSQL · Chapter 11 · Lesson 11.1 "Transactions: all of it, or none of it" (slide EN, kiểu FU, 25/10/2026, agent c11).
 * Nguồn: content/courses/postgresql/s11-giao-dich.mjs › postgresql-11-1-giao-dich. Output = chạy thật PostgreSQL 17.11 (container pgcourse17,
 * schema ch11): video-bai-giang/src/khung/pg/that/pg-11-1.out.txt (một phiên), pg-11-1a/b.out.txt (HAI phiên psql thật, c11-scripts/hai-phien.mjs),
 * pg-11-1c.out.txt (psql tương tác qua pty — dấu nhắc =# =*# =!#), pg-11-1.prisma.txt (Prisma 5.22 $transaction thật).
 * Bổ sung so với web: chuyển tiền mất điện (đời thường), autocommit chạy thật (5 dòng, dòng cuối vi phạm ⇒ không dòng nào đổi),
 * hai phiên thật (B không bao giờ thấy "nửa vời"), thói quen BEGIN…xem…ROLLBACK (xoá đơn huỷ), sơ đồ trạng thái + dấu nhắc psql,
 * RELEASE SAVEPOINT, ALTER lùi được, CREATE DATABASE không chạy trong giao dịch, idle in transaction thật + idle_in_transaction_session_timeout,
 * Prisma mảng vs tương tác (log BEGIN/COMMIT/ROLLBACK thật), ví điểm CuongThai (points.service.ts).
 */
import { lamDeck, sql, psql, run, two, box, kw, cards, steps, c } from './_pg-chung.mjs';
import { haiPsql, transferPic, autocommitPic, statesPic, savepointPic } from './pg-11-hinh.mjs';

const zm = (h, z = 1.2) => `<div style="zoom:${z}">${h}</div>`;
export const deck = { key: 'pg-11-1', code: 'PG 11.1', title: 'Transactions: all of it, or none of it', sub: 'BEGIN · COMMIT · ROLLBACK · SAVEPOINT' };

export const slides = lamDeck({ chuong: 'Chapter 11 — Transactions & concurrency', bai: '11.1' }, [
  { cover: true, t: 'Transactions:<br>all of it, or none of it', sub: 'BEGIN · COMMIT · ROLLBACK, the “aborted” state,<br>SAVEPOINT and DDL inside a transaction' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>What a <b>transaction</b> is, and why every bare statement is <b>already</b> one</li>
<li><code class="i">BEGIN</code> / <code class="i">COMMIT</code> / <code class="i">ROLLBACK</code> — and the safest habit in this course</li>
<li>The <b>aborted</b> state: <i>“current transaction is aborted…”</i> and why COMMIT prints ROLLBACK</li>
<li><code class="i">SAVEPOINT</code>: let one step fail without losing the rest</li>
<li>DDL inside a transaction, the <b>idle in transaction</b> trap, Prisma <code class="i">$transaction</code></li>
</ul>
${box('Remember from 1.2', 'ACID’s <b>A</b> = Atomicity: all or nothing. Chapter 1 showed it; this chapter is where you learn to <b>control</b> it — and where most hard-to-reproduce bugs of a multi-user app live.', 'lam')}` },

  { t: 'Everyday example first: a transfer is TWO steps', giua: true, body: `
${transferPic()}
<p style="font-size:22px;margin:0">Moving 100 from A to B is two writes: take 100 from A, add 100 to B. If the power dies between them, the money is gone. A <b>transaction</b> glues the two writes together: either both happen, or neither does.</p>` },

  { t: 'A transaction = a group that succeeds or fails as ONE', giua: true, body: `
${cards([
    ['BEGIN', 'Open a transaction. Everything after it is one unit.'],
    ['COMMIT', 'Make every change of the unit <b>permanent</b> and visible to others.'],
    ['ROLLBACK', 'Throw every change of the unit away, as if it never happened.'],
  ])}
${zm(sql(`BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 'A';
UPDATE accounts SET balance = balance + 100 WHERE id = 'B';
COMMIT;   -- or ROLLBACK;`, { sm: true, hl: [1, 4] }), 1.25)}
${box('Words', `${kw('transaction', 'a unit of work')} ${kw('commit', 'make permanent')} ${kw('rollback', 'undo everything')} — the standard spells it <code class="i">START TRANSACTION</code>; <code class="i">BEGIN</code> is PostgreSQL’s short form.`, 'lam')}` },

  { t: 'The table for the whole lesson', giua: true, body: `
${two(zm(sql(`CREATE TABLE accounts (
  id      text PRIMARY KEY,
  owner   text NOT NULL,
  balance numeric(12,2) NOT NULL
          CHECK (balance >= 0)
);
INSERT INTO accounts VALUES
  ('A','Cuong', 100.00),
  ('B','Mai',     0.00);
SELECT * FROM accounts ORDER BY id;`, { sm: true, hl: [5] }), 1.12),
  zm(psql(`CREATE TABLE
INSERT 0 2
 id | owner | balance
----+-------+---------
 A  | Cuong |  100.00
 B  | Mai   |    0.00
(2 rows)`, { sm: true }), 1.2))}
<p style="font-size:22px;margin:0">Two accounts and one rule from Chapter 3: <b>a balance can never go negative</b> (<code class="i">CHECK (balance &gt;= 0)</code>). That rule is what makes the failures in this lesson happen for real.</p>` },

  { t: 'You have used transactions all along: autocommit', giua: true, body: `
${two(zm(sql(`-- 5 wallets: 500, 400, 300, 200, 100
UPDATE wallet SET balance = balance - 150;
-- 350 ✓  250 ✓  150 ✓  50 ✓  −50 ✗ CHECK
SELECT * FROM wallet ORDER BY id;`, { sm: true, hl: [2] }), 1.15),
  `<p style="font-size:22px;margin:0">The 5th row breaks the CHECK, so the <b>whole</b> UPDATE is undone — the four rows that were fine are untouched too. A single statement can <b>never</b> apply half-way: PostgreSQL wraps every bare statement in its own transaction — <b>autocommit</b>.</p>`, 'r64')}
${zm(psql(`UPDATE wallet SET balance = balance - 150;
ERROR:  new row for relation "wallet" violates check constraint "wallet_balance_check"
DETAIL:  Failing row contains (5, -50).
SELECT * FROM wallet ORDER BY id;
 id | balance
----+---------
  1 |     500
  2 |     400
  3 |     300
  4 |     200
  5 |     100
(5 rows)`, { sm: true, hl: [2, 3] }), 1.1)}` },

  { t: 'Picture it: the invisible BEGIN and COMMIT', giua: true, body: `
${autocommitPic()}
${box('So what is BEGIN for?', 'Not to make one statement atomic — it already is. <code class="i">BEGIN</code> lets you make <b>several</b> statements atomic <b>together</b>: the two halves of a transfer, an order and its order lines, a stock update and its log row.', 'xanh')}` },

  { t: 'ROLLBACK: a clean undo, as if it never happened', giua: true, body: `
${two(`<div>${zm(sql(`BEGIN;
UPDATE accounts SET balance = balance - 100
  WHERE id = 'A';
UPDATE accounts SET balance = balance + 100
  WHERE id = 'B';
SELECT * FROM accounts ORDER BY id;
ROLLBACK;
SELECT * FROM accounts ORDER BY id;`, { sm: true, hl: [7] }), 1.08)}
<p style="font-size:21px;margin:12px 0 0">Inside the transaction the money has moved — and <b>your own session sees it</b>. After ROLLBACK everything is exactly as before. <code class="i">COMMIT</code> does the opposite: a committed 30 transfer left <b>A 70.00 · B 30.00</b> for good.</p></div>`,
  zm(psql(`BEGIN
UPDATE 1
UPDATE 1
 id | owner | balance
----+-------+---------
 A  | Cuong |    0.00
 B  | Mai   |  100.00
(2 rows)

ROLLBACK
 id | owner | balance
----+-------+---------
 A  | Cuong |  100.00
 B  | Mai   |    0.00
(2 rows)`, { sm: true, hl: [6, 7, 13, 14] }), 1.05))}` },

  { t: 'Two real sessions: no one sees half a transfer', body: `
${haiPsql([
    ['+0.00s', "> BEGIN;\nBEGIN\n> UPDATE accounts SET balance = balance - 100 WHERE id = 'A';\nUPDATE 1", ''],
    ['+0.03s', '', '> SELECT id, balance FROM accounts ORDER BY id;\n A  |  100.00\n B  |    0.00'],
    ['+0.05s', "> UPDATE accounts SET balance = balance + 100 WHERE id = 'B';\nUPDATE 1\n> SELECT id, balance FROM accounts ORDER BY id;\n A  |    0.00\n B  |  100.00", ''],
    ['+0.08s', '', '> SELECT id, balance FROM accounts ORDER BY id;\n A  |  100.00\n B  |    0.00'],
    ['+0.10s', '> COMMIT;\nCOMMIT', ''],
    ['+0.12s', '', '> SELECT id, balance FROM accounts ORDER BY id;\n A  |    0.00\n B  |  100.00'],
  ], { fs: 13, hl: [3, 5] })}
<p style="font-size:19px;margin:0">Times are real: two psql processes driven in exactly this order. Inside A the money has moved; B keeps seeing the <b>old</b> state until the instant A commits, then the <b>whole</b> new state — never “A already 0, B still 0”.</p>` },

  { t: 'The safest habit: BEGIN … look … decide', body: `
${two(zm(run(`BEGIN;
DELETE FROM orders WHERE status = 'cancelled';
SELECT count(*) AS con_lai FROM orders;
ROLLBACK;     -- 3 rows? I meant only old ones!`, `BEGIN
DELETE 3
 con_lai
---------
       2
(1 row)

ROLLBACK`, { hl: [4], hlOut: [2] }), 1.0),
  zm(run(`BEGIN;
DELETE FROM orders WHERE status = 'cancelled'
  AND created < '2026-06-01';
SELECT id, status, created FROM orders ORDER BY id;
COMMIT;`, `BEGIN
DELETE 2
 id |  status   |  created
----+-----------+------------
  2 | paid      | 2026-01-04
  4 | cancelled | 2026-10-20
  5 | paid      | 2026-10-21
(3 rows)

COMMIT`, { hl: [5], hlOut: [2] }), 1.0))}
${box('Habit', 'Before any UPDATE or DELETE you are not 100% sure of: wrap it in <code class="i">BEGIN</code>, read the row count (<b>DELETE 3</b>?!) and one SELECT, then choose COMMIT or ROLLBACK. One extra line — it has saved more data than any backup.', 'xanh')}` },

  { t: 'The aborted state — the most confusing one', giua: true, body: `
${zm(run(`BEGIN;
UPDATE accounts SET balance = balance - 500 WHERE id = 'A';   -- breaks the CHECK
SELECT 'câu này có chạy không?' AS thu;                       -- does this run?
COMMIT;`, `BEGIN
ERROR:  new row for relation "accounts" violates check constraint "accounts_balance_check"
DETAIL:  Failing row contains (A, Cuong, -400.00).
ERROR:  current transaction is aborted, commands ignored until end of transaction block
ROLLBACK`, { hl: [4], hlOut: [4, 5] }), 1.12)}
<p style="font-size:22px;margin:0">One error does not just fail that statement — it <b>poisons the whole transaction</b>. Everything after it is refused until the transaction ends, and the COMMIT you typed comes back as <b>ROLLBACK</b>.</p>` },

  { t: 'Three things to read in that output', body: `
${steps([
    '<b>The CHECK did its job.</b> The rule from Chapter 3 refused a negative balance. The database protected its invariant — exactly as designed.',
    '<b>The SELECT never ran.</b> <code class="i">current transaction is aborted, commands ignored until end of transaction block</code>: an aborted transaction accepts nothing but <code class="i">ROLLBACK</code> (or <code class="i">ROLLBACK TO SAVEPOINT</code>). This is the line people read at 2 a.m. as “the database is broken”.',
    '<b>COMMIT printed ROLLBACK.</b> PostgreSQL <b>cannot</b> commit an aborted transaction, so committing one is really a rollback. If your code logs “commit succeeded” here, the log is lying to you.',
  ])}
${box('In application code', 'A driver usually throws on the first error. Catch it, <b>ROLLBACK</b>, then decide (retry, report). Never keep sending statements on the same transaction after an error.', 'bad')}` },

  { t: 'Picture it: the states of a transaction', body: `
${zm(statesPic(), 0.82)}
${two(zm(psql(`pgcourse=# BEGIN;
BEGIN
pgcourse=*# UPDATE accounts SET balance = balance - 500 WHERE id = 'A';
ERROR:  new row for relation "accounts" violates check constraint …
pgcourse=!# SELECT 1;
ERROR:  current transaction is aborted, commands ignored until end …
pgcourse=!# ROLLBACK;
ROLLBACK
pgcourse=# `, { sm: true, title: 'psql 17.11 — interactive (real prompts)', hl: [3, 5, 7] }), 0.98),
  `<p style="font-size:21px;margin:0">Watch the prompt in an interactive psql: <code class="i">=#</code> no transaction, <code class="i">=*#</code> inside one, <code class="i">=!#</code> aborted. A star you did not expect means a forgotten <code class="i">BEGIN</code>.</p>`)}` },

  { t: 'SAVEPOINT: a checkpoint inside a transaction', giua: true, body: `
${zm(run(`BEGIN;
UPDATE accounts SET balance = balance - 40 WHERE id = 'A';
SAVEPOINT sp1;
UPDATE accounts SET balance = balance - 500 WHERE id = 'A';   -- will fail
ROLLBACK TO SAVEPOINT sp1;
UPDATE accounts SET balance = balance + 40 WHERE id = 'B';
COMMIT;
SELECT * FROM accounts ORDER BY id;`, `BEGIN
UPDATE 1
SAVEPOINT
ERROR:  new row for relation "accounts" violates check constraint "accounts_balance_check"
DETAIL:  Failing row contains (A, Cuong, -440.00).
ROLLBACK
UPDATE 1
COMMIT
 id | owner | balance
----+-------+---------
 A  | Cuong |   60.00
 B  | Mai   |   40.00`, { hl: [3, 5], hlOut: [6, 11, 12] }), 0.98)}` },

  { t: 'Picture it: back to the flag, not back to the start', body: `
${savepointPic()}
${two(zm(run(`BEGIN;
SAVEPOINT a;
UPDATE accounts SET balance = balance + 1 WHERE id = 'B';
RELEASE SAVEPOINT a;      -- keep the work, drop the flag
ROLLBACK TO SAVEPOINT a;
ROLLBACK;`, `BEGIN
SAVEPOINT
UPDATE 1
RELEASE
ERROR:  savepoint "a" does not exist
ROLLBACK`, { hl: [4], hlOut: [5] }), 0.92),
  box('Not free', 'Each savepoint is a <b>subtransaction</b> with its own ID. A loop creating thousands of them in ONE transaction is a known way to make a busy server crawl. Use them for a few genuinely optional steps — not as a try/catch around every row.', 'bad'))}` },

  { t: 'DDL is transactional too — and that is rare', body: `
${two(zm(run(`BEGIN;
CREATE TABLE thu_ddl (id int);
INSERT INTO thu_ddl VALUES (1);
SELECT count(*) FROM thu_ddl;
ROLLBACK;
SELECT count(*) FROM thu_ddl;`, `BEGIN
CREATE TABLE
INSERT 0 1
 count
-------
     1
(1 row)

ROLLBACK
ERROR:  relation "thu_ddl" does not exist
LINE 1: SELECT count(*) FROM thu_ddl;
                             ^`, { hl: [5], hlOut: [9] }), 0.86),
  zm(run(`BEGIN;
ALTER TABLE accounts ADD COLUMN note text;
ALTER TABLE accounts DROP COLUMN owner;
ROLLBACK;            -- owner is back
BEGIN;
CREATE DATABASE thu_trong_gd;`, `ALTER TABLE
ALTER TABLE
ROLLBACK
BEGIN
ERROR:  CREATE DATABASE cannot run inside a transaction block`, { hl: [4], hlOut: [5] }), 0.86))}
${box('Why it matters', 'MySQL commits DDL implicitly — a migration that dies half-way leaves half a schema. PostgreSQL can run a whole migration as ONE transaction: all of it or none (Prisma, Chapter 16). Exceptions: CREATE DATABASE, VACUUM, CREATE INDEX CONCURRENTLY.', 'lam')}` },

  { t: 'Trap: a transaction left open — “idle in transaction”', body: `
${haiPsql([
    ['+0.00s', '> BEGIN;\nBEGIN', ''],
    ['+0.02s', "> UPDATE accounts SET balance = balance - 1\n>   WHERE id = 'A';\nUPDATE 1\n(… the developer goes for coffee)", ''],
    ['+2.04s', '', "> SELECT pid, application_name AS app, state, …\n  FROM pg_stat_activity\n  WHERE state = 'idle in transaction';\n 5987 | A | idle in transaction | 00:00:02"],
    ['+2.07s', '', "> SET lock_timeout = '1s';\n> UPDATE accounts SET balance = balance + 5\n>   WHERE id = 'A';"],
    ['+3.07s', '', 'ERROR:  canceling statement due to lock timeout\nCONTEXT:  while updating tuple (0,20) in relation "accounts"'],
  ], { fs: 14 })}
<p style="font-size:19px;margin:0">An open BEGIN <b>holds its locks</b> (B cannot touch row A) and <b>pins a snapshot</b> so VACUUM cannot clean up (11.2). Server-side guard: <code class="i">SET idle_in_transaction_session_timeout = '1s'</code> ⇒ after 2 s idle: <code class="i">FATAL:  terminating connection due to idle-in-transaction timeout</code>.</p>` },

  { t: 'In an app: Prisma $transaction — array vs interactive', body: `
${zm(sql(`// 1) array (batch): a fixed list of statements, sent together
await prisma.$transaction([
  prisma.$executeRaw\`UPDATE accounts SET balance = balance - 30 WHERE id = 'A'\`,
  prisma.$executeRaw\`UPDATE accounts SET balance = balance + 30 WHERE id = 'B'\`,
]);
// 2) interactive: YOUR code runs between the statements
await prisma.$transaction(async (tx) => {
  await tx.$executeRaw\`UPDATE accounts SET balance = balance - 50 WHERE id = 'A'\`;
  const [a] = await tx.$queryRaw\`SELECT balance::text FROM accounts WHERE id = 'A'\`;
  if (Number(a.balance) < 60) throw new Error('Số dư còn ' + a.balance + ' < 60: huỷ');
  await tx.$executeRaw\`UPDATE accounts SET balance = balance + 50 WHERE id = 'B'\`;
});`, { sm: true, lang: 'typescript', hl: [2, 7, 10] }), 0.98)}
${two(zm(psql(`SQL> BEGIN
SQL> UPDATE … - 30 WHERE id = 'A'
SQL> UPDATE … + 30 WHERE id = 'B'
SQL> COMMIT
=> A 70.00 · B 30.00`, { sm: true, title: '1) Prisma 5.22 query log — real run', hl: [1, 4] }), 1.0),
  zm(psql(`SQL> BEGIN
SQL> UPDATE … - 50 WHERE id = 'A'
SQL> SELECT balance::text … WHERE id = 'A'
SQL> ROLLBACK
lỗi: Số dư còn 20.00 < 60: huỷ   => A 70.00 · B 30.00`, { sm: true, title: '2) throws half-way ⇒ ROLLBACK — real run', hl: [1, 4] }), 1.0))}
<p style="font-size:19px;margin:0">Both run on <b>one</b> connection between a real BEGIN and COMMIT; a throw inside the callback = ROLLBACK. Keep the callback short — no HTTP calls, no waiting for a user (that is <b>idle in transaction</b> again).</p>` },

  { t: 'Real code: the CuongThai points wallet', giua: true, body: `
${two(zm(sql(`// src/services/points.service.ts (simplified)
await prisma.$transaction(async (tx) => {
  // 1) take the points — the rule lives IN the UPDATE
  const hit = await tx.pointAccount.updateMany({
    where: { userId, balance: { gte: cost } },
    data:  { balance: { decrement: cost } },
  });
  if (hit.count === 0) throw new BadRequestError('Không đủ điểm');
  // 2) the ledger row goes LAST, in the SAME transaction
  await tx.pointTransaction.create({ data: {
    userId, amount: -cost, kind: 'SPEND', idempotencyKey } });
});`, { sm: true, lang: 'typescript', hl: [5, 10] }), 0.98),
  `<div>${box('Rule 1 of the wallet', '<code class="i">balance</code> NEVER changes without a <code class="i">PointTransaction</code> row written in the <b>same</b> transaction. If the ledger insert fails (duplicate idempotency key ⇒ P2002), the balance change rolls back with it.', 'lam')}
${box('Their own comment', '“A failing statement makes Postgres cancel the WHOLE transaction (<i>current transaction is aborted</i>) — catching the error and carrying on means answering politely for a transaction that is already dead.”', '')}</div>`, 'r64')}` },

  { t: 'Exercise — with the answer from a real run', body: `
${two(`<div>${steps([
    'Reset A = 100, B = 0. In ONE transaction move <b>30</b> from A to B, COMMIT, check.',
    'New transaction: take <b>10</b> from A, set <code class="i">SAVEPOINT sp1</code>, try taking <b>500</b> (fails), go back to sp1, add 10 to B, COMMIT.',
    'Do step 2 again but <b>forget</b> the ROLLBACK TO SAVEPOINT. Predict what COMMIT prints and the balances.',
  ])}</div>`,
  zm(psql(`-- 1) after COMMIT
 A  |   70.00
 B  |   30.00
-- 2) the 500 fails, back to sp1, +10 to B
ERROR:  new row for relation "accounts" violates check constraint …
ROLLBACK
UPDATE 1
COMMIT
 A  |   60.00
 B  |   40.00
-- 3) no ROLLBACK TO SAVEPOINT
ERROR:  new row for relation "accounts" violates check constraint …
UPDATE accounts SET balance = balance + 10 WHERE id = 'B';
ERROR:  current transaction is aborted, commands ignored until end …
COMMIT;
ROLLBACK
 A  |   60.00
 B  |   40.00`, { sm: true, title: 'answer — psql 17.11 (real run)', hl: [9, 10, 16, 17, 18] }), 0.9))}` },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>An UPDATE touches 40,000 rows and row 39,999 breaks a CHECK. How many rows change?</li>
<li>After an error inside BEGIN, you type COMMIT. What does psql print — and why?</li>
<li>Why is a forgotten <code class="i">BEGIN</code> in a psql tab dangerous for other users?</li>
</ol>
${box('Answers', '1) <b>None</b> — a bare statement is its own transaction (autocommit). 2) <b>ROLLBACK</b> — an aborted transaction cannot commit. 3) It stays <b>idle in transaction</b>: it holds locks (others wait) and pins a snapshot (VACUUM cannot clean, tables bloat).', 'xanh')}` },

  { t: 'Summary & next', to: true, giua: true, body: `
<ul>
<li>A transaction = statements that succeed or fail <b>as one</b>; every bare statement is already one (autocommit)</li>
<li><code class="i">BEGIN … look … COMMIT / ROLLBACK</code> before any risky UPDATE/DELETE</li>
<li>One error ⇒ <b>aborted</b>: only ROLLBACK works; COMMIT becomes ROLLBACK</li>
<li><code class="i">SAVEPOINT</code> rescues one optional step; DDL rolls back too (rare outside PostgreSQL)</li>
<li>Never leave a transaction open: locks + a pinned snapshot</li>
</ul>
${box('Next — 11.2 MVCC', 'B saw the old balance while A was mid-transfer — without waiting. How? PostgreSQL keeps <b>several versions</b> of a row. Next lesson: xmin, xmax, ctid, snapshots and VACUUM.', 'lam')}` },
]);
