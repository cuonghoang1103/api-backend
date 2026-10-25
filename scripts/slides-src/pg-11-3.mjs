/**
 * pg-11-3 — PostgreSQL · Chapter 11 · Lesson 11.3 "Isolation levels and the anomalies they stop" (slide EN, kiểu FU, 25/10/2026, agent c11).
 * Nguồn: content/courses/postgresql/s11-giao-dich.mjs › postgresql-11-3-muc-co-lap. Output = chạy thật PostgreSQL 17.11 (pgcourse17, schema ch11),
 * HAI phiên psql thật (c11-scripts/hai-phien.mjs): that/pg-11-3a…h.out.txt · một phiên: pg-11-3.out.txt · Prisma 5.22: pg-11-3.prisma.txt, pg-11-3b.prisma.txt.
 * Bổ sung so với web: bảng tỉ số (đời thường), bảng bốn hiện tượng chuẩn SQL vs PostgreSQL, phantom chạy thật ở RC (count 2 → 3) và RR (giữ 2),
 * ảnh chụp lấy ở câu ĐẦU TIÊN chứ không phải BEGIN (thấy 555), RR + cập nhật trùng dòng ⇒ 40001 chạy thật, READ UNCOMMITTED = RC chạy thật,
 * cách SSI phát hiện vòng, vòng thử lại Prisma chạy thật (P2010 + meta 40001 với $queryRaw; P2034 với API model), SET TRANSACTION phải đứng đầu,
 * READ ONLY, bài tập hai vợ chồng rút tiền (RR ⇒ tổng −100; SERIALIZABLE ⇒ một bên bị huỷ).
 */
import { lamDeck, sql, psql, run, two, box, kw, cards, steps } from './_pg-chung.mjs';
import { haiPsql, scorePic, whenSnapPic, skewPic, ssiPic } from './pg-11-hinh.mjs';

const zm = (h, z = 1.2) => `<div style="zoom:${z}">${h}</div>`;
export const deck = { key: 'pg-11-3', code: 'PG 11.3', title: 'Isolation levels and the anomalies they stop', sub: 'Read Committed · Repeatable Read · Serializable' };

export const slides = lamDeck({ chuong: 'Chapter 11 — Transactions & concurrency', bai: '11.3' }, [
  { cover: true, t: 'Isolation levels<br>and the anomalies they stop', sub: 'Read Committed · Repeatable Read · Serializable —<br>and the retry loop Serializable demands' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>What an <b>isolation level</b> really changes: <b>when</b> the snapshot is taken</li>
<li>The anomalies — dirty read, non-repeatable read, phantom, <b>write skew</b> — each run for real in two sessions</li>
<li>Read Committed (default), Repeatable Read, Serializable — and why PostgreSQL has no dirty read</li>
<li>Error <b>40001</b> and the <b>retry loop</b> it demands (with Prisma)</li>
<li>Choosing a level in practice — and what NO level can fix</li>
</ul>
${box('Remember from 11.2', 'Every transaction reads through a <b>snapshot</b>. Today: is it one snapshot per <b>statement</b>, or one per <b>transaction</b>?', 'lam')}` },

  { t: 'Everyday example first: a live scoreboard', giua: true, body: `${scorePic()}
<p style="font-size:22px;margin:0">Writing a match report while the game goes on: either you glance at the board for every sentence (fresh but inconsistent), or you take one photo and write the whole report from it (consistent but frozen). Databases face the same choice for every transaction.</p>` },

  { t: 'Four anomalies — and which ones PostgreSQL allows', body: `
${cards([
    ['Dirty read', 'You read a change another transaction has <b>not committed</b> yet (and may roll back).'],
    ['Non-repeatable read', 'Same row, read twice in one transaction, <b>different values</b>.'],
    ['Phantom', 'Same filter, run twice, <b>new rows appear</b> (or vanish).'],
    ['Write skew', 'Two transactions each check a rule, each write a <b>different</b> row ⇒ the rule breaks.'],
  ], 2)}
<table class="t" style="font-size:19px;margin-top:4px"><tr><th>Level (PostgreSQL 17)</th><th>Dirty read</th><th>Non-repeatable</th><th>Phantom</th><th>Write skew</th></tr>
<tr><td><b>Read Uncommitted</b> (= Read Committed)</td><td class="xanh">never</td><td class="do">possible</td><td class="do">possible</td><td class="do">possible</td></tr>
<tr><td><b>Read Committed</b> — default</td><td class="xanh">never</td><td class="do">possible</td><td class="do">possible</td><td class="do">possible</td></tr>
<tr><td><b>Repeatable Read</b></td><td class="xanh">never</td><td class="xanh">never</td><td class="xanh">never*</td><td class="do">possible</td></tr>
<tr><td><b>Serializable</b></td><td class="xanh">never</td><td class="xanh">never</td><td class="xanh">never</td><td class="xanh">never</td></tr></table>
<p class="nho" style="margin:0">* the SQL standard allows phantoms at Repeatable Read; PostgreSQL’s snapshot blocks them too. Every anomaly on the next slides is a real two-session run.</p>` },

  { t: 'The one knob: when is the snapshot taken?', giua: true, body: `
${whenSnapPic()}
${two(box('Read Committed', 'A <b>new snapshot for every statement</b>: you always see what is committed right now — so two identical SELECTs can disagree.', 'lam'),
  box('Repeatable Read / Serializable', '<b>One snapshot</b> for the whole transaction, taken at its first statement: every query describes the same instant.', 'xanh'))}` },

  { t: 'Read Committed: answers change mid-transaction', giua: true, body: `
${haiPsql([
    ['+0.00s', '> BEGIN;   -- Read Committed (default)\nBEGIN', ''],
    ['+0.01s', "> SELECT balance FROM accounts WHERE id = 'A';\n  100.00\n> SELECT count(*) FROM booking WHERE room = 101;\n      2", ''],
    ['+0.05s', '', "> UPDATE accounts SET balance = 999 WHERE id = 'A';\nUPDATE 1\n> INSERT INTO booking (room, guest) VALUES (101, 'Chi');\nINSERT 0 1"],
    ['+0.10s', "> SELECT balance FROM accounts WHERE id = 'A';\n  999.00\n> SELECT count(*) FROM booking WHERE room = 101;\n      3", ''],
    ['+0.13s', '> COMMIT;\nCOMMIT', ''],
  ], { fs: 14, hl: [3] })}
<p style="font-size:20px;margin:0">Same transaction, same queries, different answers: <b>999.00</b> (non-repeatable read) and <b>3</b> bookings (phantom). At Read Committed this is <b>expected</b>, not a bug — and for most web requests (read a row, render, answer) it is fine.</p>` },

  { t: 'The default, and the level that does not exist', giua: true, body: `
${two(zm(psql(`SHOW default_transaction_isolation;
 default_transaction_isolation
-------------------------------
 read committed
(1 row)`, { sm: true, hl: [4] }), 1.1),
  box('Read Uncommitted', 'The parser accepts it and even reports it — then behaves exactly like Read Committed. PostgreSQL <b>never</b> dirty-reads. Copied from SQL Server (<code class="i">NOLOCK</code>)? Here it does nothing.', 'lam'))}
${haiPsql([
    ['+0.00s', "> BEGIN;\n> UPDATE accounts SET balance = 0 WHERE id = 'A';\nUPDATE 1", ''],
    ['+0.06s', '', '> BEGIN ISOLATION LEVEL READ UNCOMMITTED;\n> SHOW transaction_isolation;\n read uncommitted'],
    ['+0.10s', '', "> SELECT balance FROM accounts WHERE id = 'A';\n  100.00          ← not 0: no dirty read"],
    ['+0.13s', '> ROLLBACK;', '> COMMIT;'],
  ], { fs: 15, hl: [2] })}` },

  { t: 'Repeatable Read: one snapshot per transaction', giua: true, body: `
${haiPsql([
    ['+0.00s', '> BEGIN ISOLATION LEVEL REPEATABLE READ;\nBEGIN', ''],
    ['+0.04s', "> SELECT balance FROM accounts WHERE id = 'A';\n  100.00\n> SELECT count(*) FROM booking WHERE room = 101;\n      2", ''],
    ['+0.07s', '', "> UPDATE accounts SET balance = 777 WHERE id = 'A';\nUPDATE 1\n> INSERT INTO booking (room, guest) VALUES (101, 'Chi');\nINSERT 0 1"],
    ['+0.11s', "> SELECT balance FROM accounts WHERE id = 'A';\n  100.00\n> SELECT count(*) FROM booking WHERE room = 101;\n      2", ''],
    ['+0.16s', "> COMMIT;\n> SELECT balance FROM accounts WHERE id = 'A';\n  777.00", ''],
  ], { fs: 14, hl: [3] })}
<p style="font-size:20px;margin:0">A keeps seeing <b>100.00</b> and <b>2</b> for its whole life, although B committed. Only a new transaction (after COMMIT) sees 777.00. Use it for <b>multi-query reports and exports</b>: every number describes the same instant, so totals add up.</p>` },

  { t: 'Trap: snapshot at the first query, not BEGIN', giua: true, body: `
${haiPsql([
    ['+0.00s', '> BEGIN ISOLATION LEVEL REPEATABLE READ;\nBEGIN       (no snapshot yet)', ''],
    ['+0.01s', '', "> UPDATE accounts SET balance = 555 WHERE id = 'A';\nUPDATE 1"],
    ['+0.03s', "> SELECT balance FROM accounts WHERE id = 'A';\n  555.00     ← snapshot taken HERE", ''],
    ['+0.05s', '', "> UPDATE accounts SET balance = 666 WHERE id = 'A';\nUPDATE 1"],
    ['+0.06s', "> SELECT balance FROM accounts WHERE id = 'A';\n  555.00     ← frozen from now on", ''],
  ], { fs: 15, hl: [2] })}
${box('Why it matters', 'If you BEGIN, then do slow work in the app, then run the first query, your “consistent view” starts at that query — not when the request began.', 'bad')}` },

  { t: 'Repeatable Read + same-row update ⇒ 40001', giua: true, body: `
${haiPsql([
    ['+0.00s', "> BEGIN ISOLATION LEVEL REPEATABLE READ;\n> SELECT balance FROM accounts WHERE id = 'A';\n  100.00", ''],
    ['+0.03s', '', "> BEGIN;\n> UPDATE accounts SET balance = balance - 20\n  WHERE id = 'A';\nUPDATE 1"],
    ['+0.07s', "> UPDATE accounts SET balance = balance - 10\n  WHERE id = 'A';\n⏳ (waits for B’s row lock …)", ''],
    ['+1.58s', 'ERROR:  could not serialize access due to\n        concurrent update', '> COMMIT;\nCOMMIT'],
    ['+1.60s', "> SELECT 'còn sống không?' AS thu;\nERROR:  current transaction is aborted, …\n> ROLLBACK;", ''],
  ], { fs: 14, hl: [3] })}
<p style="font-size:20px;margin:0">A’s snapshot says 100, but the row was changed and committed after it — A cannot safely “subtract 10 from 100”. Instead of a silent lost update, PostgreSQL raises <b>SQLSTATE 40001</b>; final balance <b>80.00</b> (B’s write). A must retry the whole transaction.</p>` },

  { t: 'Write skew: the bug Repeatable Read cannot see', giua: true, body: `
${zm(sql(`CREATE TABLE oncall (name text PRIMARY KEY, on_call boolean NOT NULL);
INSERT INTO oncall VALUES ('Cuong', true), ('Mai', true);
-- business rule: at least ONE person must stay on call`, { sm: true, hl: [3] }), 1.0)}
${haiPsql([
    ['+0.00s', '> BEGIN ISOLATION LEVEL REPEATABLE READ;', '> BEGIN ISOLATION LEVEL REPEATABLE READ;'],
    ['+0.03s', '> SELECT count(*) FROM oncall WHERE on_call;\n      2', '> SELECT count(*) FROM oncall WHERE on_call;\n      2'],
    ['+0.07s', "> UPDATE oncall SET on_call = false WHERE name = 'Cuong';\nUPDATE 1", "> UPDATE oncall SET on_call = false WHERE name = 'Mai';\nUPDATE 1"],
    ['+0.10s', '> COMMIT;\nCOMMIT', '> COMMIT;\nCOMMIT'],
  ], { fs: 14 })}
${zm(psql(` name  | on_call
-------+---------
 Cuong | f
 Mai   | f`, { sm: true, title: 'SELECT * FROM oncall ORDER BY name;  — afterwards', hl: [3, 4] }), 1.0)}` },

  { t: 'Picture it: each check true, the sum wrong', giua: true, body: `
${skewPic()}
<p style="font-size:21px;margin:0">No constraint violated, no row overwritten, no lock conflict: the two transactions <b>never touched the same row</b>, so Repeatable Read has nothing to detect. The damage is in the <b>combination</b>. Real cases: on-call rosters, two people withdrawing from a joint account, double-booking a room by two different inserts.</p>` },

  { t: 'Serializable: same scenario, one refused', giua: true, body: `
${haiPsql([
    ['+0.00s', '> BEGIN ISOLATION LEVEL SERIALIZABLE;', '> BEGIN ISOLATION LEVEL SERIALIZABLE;'],
    ['+0.04s', '> SELECT count(*) FROM oncall WHERE on_call;\n      2', '> SELECT count(*) FROM oncall WHERE on_call;\n      2'],
    ['+0.07s', "> UPDATE oncall SET on_call = false WHERE name = 'Cuong';\nUPDATE 1", "> UPDATE oncall SET on_call = false WHERE name = 'Mai';\nUPDATE 1"],
    ['+0.11s', '> COMMIT;\nCOMMIT', '> COMMIT;\nERROR:  could not serialize access due to read/write\n        dependencies among transactions\nDETAIL:  Reason code: Canceled on identification\n         as a pivot, during commit attempt.\nHINT:  The transaction might succeed if retried.'],
  ], { fs: 14, hl: [3] })}
${zm(psql(` name  | on_call
-------+---------
 Cuong | f
 Mai   | t`, { sm: true, title: 'afterwards — the rule holds', hl: [4] }), 1.0)}` },

  { t: 'How Serializable decides: detection, not locks', giua: true, body: `
${ssiPic()}
${two(box('SSI — Serializable Snapshot Isolation', 'Transactions still run on snapshots and never wait for each other’s reads. PostgreSQL <b>tracks</b> who read what the other later wrote. If those dependencies could not happen in <b>any</b> one-after-the-other order, it cancels one transaction.', 'lam'),
  box('The cost', 'Some bookkeeping, and <b>false positives</b>: it may cancel a transaction that would have been fine. That is why retrying is not optional — it is part of the design.', 'bad'))}` },

  { t: '“might succeed if retried” = a requirement', giua: true, body: `
${zm(sql(`async function withRetry(work, tries = 3) {
  for (let i = 1; ; i++) {
    try {
      return await work();                 // the WHOLE transaction, from BEGIN
    } catch (e) {
      const conflict = e.code === 'P2034'            // Prisma model API
                    || e.meta?.code === '40001';     // raw SQL (P2010)
      if (!conflict || i === tries) throw e;
      await sleep(50 * i);                 // small back-off, then retry
    }
  }
}`, { sm: true, lang: 'typescript', hl: [4, 6, 7] }), 1.15)}
${box('Rules', 'Retry the <b>whole</b> transaction (re-read everything — the world changed). Never retry a single statement. Without a retry loop, Serializable turns a rare wrong answer into a <b>frequent error</b>, exactly at peak load.', 'xanh')}` },

  { t: 'Real run: Prisma, two doctors at once, with retry', giua: true, body: `
${two(zm(sql(`prisma.$transaction(async (tx) => {
  const [{ n }] = await tx.$queryRaw\`
    SELECT count(*)::int AS n
    FROM oncall WHERE on_call\`;
  if (n < 2) throw new Error('phải còn ít nhất 1 người trực');
  await tx.$executeRaw\`SELECT pg_sleep(0.3)\`;
  await tx.$executeRaw\`
    UPDATE oncall SET on_call = false
    WHERE name = \${ten}\`;
}, { isolationLevel: 'Serializable' })`, { sm: true, lang: 'typescript', hl: [5, 10] }), 0.95),
  zm(psql(`+ 480ms Cuong lần 1: thấy 2 người đang trực
+ 515ms Mai lần 1: thấy 2 người đang trực
+ 912ms Mai lần 1: P2010 (xung đột tuần tự) ⇒ thử lại
+ 997ms Mai lần 2: thấy 1 người đang trực
+1012ms Mai lần 2: lỗi: phải còn ít nhất 1 người trực — từ chối
+1012ms kết quả: được nghỉ · không được nghỉ
bảng: Cuong false, Mai true

-- same conflict through the model API (tx.appSetting.*):
Cuong: P2034 — Transaction failed due to a write
       conflict or a deadlock. Please retry your transaction
Mai: được nghỉ`, { sm: true, title: 'Prisma 5.22 → PostgreSQL 17.11 (real)', hl: [3, 5, 10] }), 0.92))}
<p style="font-size:19px;margin:0">The retry <b>re-read</b> the table, saw only 1 on call, and the business rule refused — exactly the serial outcome. Note the codes: raw SQL surfaces as <b>P2010</b> with <code class="i">meta.code = '40001'</code>, the model API as <b>P2034</b> — check both.</p>` },

  { t: 'Setting the level — three ways', giua: true, body: `
${two(zm(run(`BEGIN;
SELECT 1;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;   -- too late
ROLLBACK;
START TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY;
UPDATE accounts SET balance = 1 WHERE id = 'A';
ROLLBACK;`, `ERROR:  SET TRANSACTION ISOLATION LEVEL must be
        called before any query
…
START TRANSACTION
ERROR:  cannot execute UPDATE in a read-only transaction`, { hl: [3, 5], hlOut: [1, 5] }), 0.95),
  `<div>${steps([
    '<code class="i">BEGIN ISOLATION LEVEL SERIALIZABLE;</code> — per transaction (most common).',
    '<code class="i">SET TRANSACTION …</code> right after BEGIN, <b>before any query</b>.',
    '<code class="i">SET default_transaction_isolation = \'serializable\';</code> — for the session (or role / database).',
    'Prisma: <code class="i">$transaction(fn, { isolationLevel: \'Serializable\' })</code>.',
  ])}${box('READ ONLY', 'A report transaction can say so: PostgreSQL refuses writes inside it — a cheap safety net.', 'lam')}</div>`)}` },

  { t: 'The three levels at a glance', giua: true, to: true, body: `
${cards([
    ['Read Committed — default', 'Snapshot per <b>statement</b>. No dirty read; non-repeatable read and phantoms possible. Cheapest, <b>never</b> aborts for isolation reasons. Right for ordinary web requests.'],
    ['Repeatable Read', 'Snapshot per <b>transaction</b>. Also blocks non-repeatable read and phantoms. May abort with 40001 when two transactions update the same row. Use for multi-query reports and consistent exports.'],
    ['Serializable', 'All of the above <b>plus write skew</b>: tracks read/write dependencies and aborts transactions that could not happen in any serial order. <b>Retry loop mandatory.</b> For the few invariants that truly matter: seats, stock, rosters.'],
    ['Read Uncommitted', 'Accepted, then treated as Read Committed. PostgreSQL never dirty-reads.'],
  ], 2)}` },

  { t: 'Choosing in practice — and what NO level fixes', giua: true, body: `
${steps([
    'Do <b>not</b> switch the whole app to Serializable. Most code is already correct at Read Committed because it does the safe thing: <code class="i">UPDATE … SET balance = balance - 10</code> reads and writes in <b>one</b> statement — nothing to skew.',
    'Raise the level for <b>the one transaction</b> that guards a rule spanning <b>several rows</b> — with a retry loop.',
    'CuongThai’s points wallet stays at Read Committed: the spend rule lives inside the UPDATE (<code class="i">balance &gt;= cost</code>), so two clicks cannot both pass.',
  ])}
${box('Trap — isolation does not cover your app’s gap', 'If your code reads a value, thinks in Node.js for 50 ms, and writes back a number <b>it computed</b>, those are two separate steps with a gap — no level saves you. That is the <b>lost update</b> of lesson 11.4; the fix there is a lock or a single atomic statement, not a level.', 'bad')}` },

  { t: 'Exercise: a joint account, two withdrawals', giua: true, body: `
${two(`<div>${steps([
    'Table <code class="i">joint(owner, balance)</code>: chong 100, vo 100. Rule: the <b>sum</b> must stay ≥ 0.',
    'Two sessions at <b>Repeatable Read</b>: each checks <code class="i">SELECT sum(balance)</code> (200), each withdraws 150 from <b>its own</b> row, both COMMIT. Sum?',
    'Reset and repeat at <b>Serializable</b>. What happens to the second COMMIT, and what must the app do?',
  ])}</div>`,
  zm(psql(`-- Repeatable Read
A: SELECT sum(balance) → 200   B: … → 200
A: UPDATE … chong −150  B: UPDATE … vo −150
A: COMMIT               B: COMMIT
SELECT sum(balance) AS tong → -100    ✗ rule broken

-- Serializable
A: COMMIT
B: COMMIT
ERROR:  could not serialize access due to read/write
        dependencies among transactions
HINT:  The transaction might succeed if retried.
 owner | balance
 chong |     -50
 vo    |     100     ✓ sum 50 ≥ 0`, { sm: true, title: 'answer — two real sessions (excerpt)', hl: [5, 10, 15] }), 0.95))}` },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>In one Read Committed transaction you run the same SELECT twice and get different values. Bug?</li>
<li>A Repeatable Read report starts with BEGIN at 09:00, runs its first query at 09:05. Which instant does it describe?</li>
<li>Serializable cancelled your transaction with 40001. What exactly do you retry?</li>
</ol>
${box('Answers', '1) No — Read Committed takes a new snapshot per statement (non-repeatable read is expected). 2) <b>09:05</b> — the snapshot is taken at the first query. 3) The <b>whole</b> transaction from BEGIN, re-reading everything; never just the failed statement.', 'xanh')}` },

  { t: 'Summary & next', to: true, giua: true, body: `
<ul>
<li>Isolation level = <b>when</b> the snapshot is taken (+ how strictly results are checked)</li>
<li>Read Committed (default): per statement — non-repeatable reads and phantoms are normal</li>
<li>Repeatable Read: one snapshot — consistent reports; same-row conflict ⇒ 40001</li>
<li>Serializable: also stops write skew by detection ⇒ 40001 + <b>retry loop</b> (P2034 / P2010)</li>
<li>No level fixes a read–compute–write gap in your app</li>
</ul>
${box('Next — 11.4 Locks, lost updates & deadlocks', 'Writers DO block writers. The bug that steals money, three ways to fix it, SKIP LOCKED job queues, and a real deadlock.', 'lam')}` },
]);
