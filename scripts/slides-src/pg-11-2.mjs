/**
 * pg-11-2 — PostgreSQL · Chapter 11 · Lesson 11.2 "MVCC: why readers never block writers" (slide EN, kiểu FU, 25/10/2026, agent c11).
 * Nguồn: content/courses/postgresql/s11-giao-dich.mjs › postgresql-11-2-mvcc. Output = chạy thật PostgreSQL 17.11 (pgcourse17, schema ch11):
 * video-bai-giang/src/khung/pg/that/pg-11-2.out.txt (xmin/xmax/ctid, bloat, VACUUM, VACUUM FULL) · pg-11-2b.out.txt (pageinspect — DB nháp pgc11) ·
 * pg-11-2a.out.txt (HAI phiên: người ghi dở không chặn người đọc) · pg-11-2c.out.txt (giao dịch dài ⇒ "dead but not yet removable") ·
 * pg-11-2e.out.txt (ảnh chụp 69067:69069:69067 có giao dịch đang chạy) · pg-11-2d.out.txt (bài tập).
 * Bổ sung so với web: bảng đen vs phiên bản (đời thường), nhìn tận trang bằng pageinspect, DELETE rồi ROLLBACK (xmax ≠ 0 mà dòng vẫn sống),
 * ảnh chụp xmin:xmax:xip đọc thế nào, B thấy được bản cũ mang xmax = mã giao dịch của A, sau VACUUM: con trỏ redirect + ô trống dùng lại,
 * UPDATE lần ba không làm file to thêm, VACUUM FULL 5024 kB, giao dịch dài chạy thật (backend_xmin), UPDATE giữ nguyên giá trị vẫn sinh phiên bản mới.
 */
import { lamDeck, sql, psql, run, two, box, kw, cards, steps } from './_pg-chung.mjs';
import { haiPsql, boardPic, pagePic, snapshotPic, twoEyesPic, bloatBars, pinPic } from './pg-11-hinh.mjs';

const zm = (h, z = 1.2) => `<div style="zoom:${z}">${h}</div>`;
export const deck = { key: 'pg-11-2', code: 'PG 11.2', title: 'MVCC: why readers never block writers', sub: 'xmin · xmax · ctid · snapshots · VACUUM' };

export const slides = lamDeck({ chuong: 'Chapter 11 — Transactions & concurrency', bai: '11.2' }, [
  { cover: true, t: 'MVCC: why readers<br>never block writers', sub: 'Row versions, xmin / xmax / ctid, snapshots,<br>dead tuples and VACUUM' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The one design decision behind most of PostgreSQL: <b>UPDATE never overwrites</b></li>
<li>See it: the hidden columns <code class="i">xmin</code>, <code class="i">xmax</code>, <code class="i">ctid</code> — and the page itself</li>
<li>Snapshots: how each transaction decides <b>which version</b> it sees</li>
<li>Two real sessions: a writer mid-transaction does <b>not</b> block a reader</li>
<li>The price — dead tuples, bloat, VACUUM — and the long-transaction trap</li>
</ul>
${box('Remember from 11.1', 'Session B read the old balance while A was half-way through a transfer — instantly, without waiting. This lesson is <b>how</b>.', 'lam')}` },

  { t: 'Everyday example: erase the board, or add a version?', giua: true, body: `
${boardPic()}
<p style="font-size:22px;margin:0">Erasing and rewriting forces readers to wait. Writing a <b>new version</b> lets the reader keep reading the old line while the writer works on the new one. PostgreSQL does the second: <b>M</b>ulti-<b>V</b>ersion <b>C</b>oncurrency <b>C</b>ontrol.</p>` },

  { t: 'MVCC in one sentence — and its golden rule', to: true, giua: true, body: `
${box('One sentence', 'An <b>UPDATE</b> does not overwrite a row: it writes a <b>new version</b> and marks the old one as expired. Old readers keep reading the old version; new readers get the new one.', 'lam')}
${cards([
    ['Readers never block writers', 'A SELECT takes no lock that stops an UPDATE.'],
    ['Writers never block readers', 'An UPDATE in progress does not stop a SELECT.'],
    ['Writers DO block writers', 'Two UPDATEs of the same row take turns — lesson 11.4.'],
  ])}
${box('Word', `${kw('MVCC', 'Multi-Version Concurrency Control — many versions of a row, chosen by snapshot')}`, '')}` },

  { t: 'Hidden columns every table has', giua: true, body: `
${cards([
    ['xmin', 'ID of the transaction that <b>created</b> this row version.'],
    ['xmax', 'ID of the transaction that <b>ended</b> it (UPDATE/DELETE). <b>0</b> = still current.'],
    ['ctid', 'Physical address of the version: <b>(page, slot)</b> in the table file.'],
  ])}
${zm(run(`CREATE TABLE mvcc_demo (id int PRIMARY KEY, val text);
INSERT INTO mvcc_demo VALUES (1, 'first');
SELECT ctid, xmin, xmax, * FROM mvcc_demo;`, ` ctid  | xmin  | xmax | id |  val
-------+-------+------+----+-------
 (0,1) | 68621 |    0 |  1 | first
(1 row)`, { hl: [3], hlOut: [3] }), 1.2)}
<p style="font-size:20px;margin:0">They do not appear in <code class="i">SELECT *</code>; you have to name them. Transaction IDs are just a counter — yours will be different numbers.</p>` },

  { t: 'UPDATE writes a NEW row version', giua: true, body: `
${zm(run(`UPDATE mvcc_demo SET val = 'second' WHERE id = 1;
SELECT ctid, xmin, xmax, * FROM mvcc_demo;`, `UPDATE 1
 ctid  | xmin  | xmax | id |  val
-------+-------+------+----+--------
 (0,2) | 68622 |    0 |  1 | second
(1 row)`, { hl: [1], hlOut: [4] }), 1.3)}
${two(box('ctid moved', '<b>(0,1) → (0,2)</b>: slot 2 of the same page. The row you see now is a <b>different physical row</b> from a moment ago.', 'lam'),
  box('xmin changed', '<b>68621 → 68622</b>: this version was created by the UPDATE’s transaction. The old version still sits in slot 1, now stamped <b>xmax = 68622</b>.', 'xanh'))}` },

  { t: 'Look inside the page (pageinspect, real)', giua: true, body: `
${zm(run(`CREATE EXTENSION pageinspect;            -- ships with PostgreSQL
UPDATE mvcc_demo SET val = 'third' WHERE id = 1;   -- a second UPDATE
SELECT lp, t_xmin, t_xmax, t_ctid
FROM heap_page_items(get_raw_page('mvcc_demo', 0));`, ` lp | t_xmin | t_xmax | t_ctid
----+--------+--------+--------
  1 |  68634 |  68635 | (0,2)
  2 |  68635 |  68636 | (0,3)
  3 |  68636 |      0 | (0,3)
(3 rows)`, { hl: [3, 4], hlOut: [3, 4, 5], title: 'psql (17.11) — scratch DB pgc11' }), 1.15)}
<p style="font-size:21px;margin:0">One logical row, <b>three physical versions</b> on page 0. Each old version points (<code class="i">t_ctid</code>) to its successor; only the last has <code class="i">xmax = 0</code>. (Run in a scratch database, hence different IDs.)</p>` },

  { t: 'Picture it: a chain of versions on one page', giua: true, body: `
${pagePic()}
${steps([
    '<b>INSERT</b> writes a version with xmin = its transaction, xmax = 0.',
    '<b>UPDATE</b> = INSERT a new version <b>+</b> stamp xmax on the old one. Both stay on disk.',
    '<b>DELETE</b> = only the stamp — no new version.',
  ])}` },

  { t: 'DELETE, then ROLLBACK: xmax is set, the row lives', giua: true, body: `
${two(zm(run(`BEGIN;
DELETE FROM mvcc_demo WHERE id = 1;
SELECT pg_current_xact_id() AS gd_xoa;
ROLLBACK;
SELECT ctid, xmin, xmax, * FROM mvcc_demo;`, `BEGIN
DELETE 1
 gd_xoa
--------
  68624
(1 row)

ROLLBACK
 ctid  | xmin  | xmax  | id |  val
-------+-------+-------+----+-------
 (0,3) | 68623 | 68624 |  1 | third
(1 row)`, { hl: [4], hlOut: [12] }), 1.0),
  `<div>${box('Surprise', 'xmax is <b>68624</b> — the deleting transaction — yet the row is still there. A stamp only counts if its transaction <b>committed</b>.', 'bad')}
${box('How PostgreSQL knows', 'It keeps a tiny commit log (<code class="i">pg_xact</code>): 2 bits per transaction — in progress, committed, aborted. ROLLBACK just flips 68624 to “aborted”; nothing on the page is undone. That is why ROLLBACK is instant even for a million rows.', 'lam')}</div>`)}` },

  { t: 'Snapshots: which versions does a transaction see?', body: `
${snapshotPic()}
${two(zm(psql(` pg_current_snapshot
---------------------
 69067:69069:69067
(1 row)

 xmin  | xmax  | id | balance
-------+-------+----+---------
 69065 | 69067 | A  |   60.00
 69068 |     0 | B  |   45.00`, { sm: true, title: 'session B — while A (69067) is running, C (69068) committed', hl: [3, 8, 9] }), 1.0),
  box('The rule', 'A version is visible if its <b>xmin committed before my snapshot</b> and its <b>xmax did not</b>. Row A: xmax 69067 is still running ⇒ old version visible (60.00). Row B: C’s 69068 committed ⇒ new version visible (45.00).', 'xanh'))}` },

  { t: 'Two sessions: writing does not block reading', body: `
${haiPsql([
    ['+0.00s', '> BEGIN;\nBEGIN', ''],
    ['+0.02s', "> UPDATE accounts SET balance = balance - 10 WHERE id = 'A';\nUPDATE 1", ''],
    ['+0.04s', '> SELECT pg_current_xact_id() AS ma_gd_A;\n   68646', ''],
    ['+0.05s', '', "> SELECT ctid, xmin, xmax, id, balance\n  FROM accounts WHERE id = 'A';\n  ctid  | xmin  | xmax  | id | balance\n (0,31) | 68645 | 68646 | A  |   50.00"],
    ['+0.09s', "> SELECT ctid, xmin, xmax, id, balance\n  FROM accounts WHERE id = 'A';\n  ctid  | xmin  | xmax | id | balance\n (0,32) | 68646 |    0 | A  |   40.00", ''],
    ['+0.11s', '> COMMIT;\nCOMMIT', ''],
    ['+0.14s', '', "> SELECT ctid, xmin, xmax, id, balance …;\n (0,32) | 68646 |    0 | A  |   40.00"],
  ], { fs: 13, hl: [3, 6] })}
<p style="font-size:19px;margin:0">B answered in 20 ms with the <b>old</b> version (0,31) — whose xmax is A’s still-running 68646. A sees its own new version (0,32). After COMMIT, B’s next snapshot sees (0,32).</p>` },

  { t: 'Picture it: two sessions, two versions, no waiting', giua: true, body: `
${twoEyesPic()}
${box('What you feel on a live site', 'A long report query cannot freeze the checkout page; a slow write cannot freeze the dashboard. On cuongthai.com the feed keeps scrolling while someone is posting — no reader ever takes a lock to read. <b>Writers still queue behind writers</b> — that is lesson 11.4.', 'lam')}` },

  { t: 'The price: dead tuples and bloat (measured)', giua: true, body: `
${two(zm(sql(`CREATE TABLE bloat_demo AS
  SELECT g AS id, 'row '||g AS val
  FROM generate_series(1, 100000) g;
SELECT pg_size_pretty(pg_relation_size('bloat_demo'))
       AS ban_dau;
UPDATE bloat_demo SET val = val || '!';   -- #1
SELECT pg_size_pretty(…) AS sau_lan_1;
UPDATE bloat_demo SET val = val || '!';   -- #2
SELECT pg_size_pretty(…) AS sau_lan_2;
SELECT n_live_tup, n_dead_tup FROM pg_stat_user_tables
WHERE relname = 'bloat_demo';`, { sm: true, hl: [6, 8] }), 1.0),
  zm(psql(` ban_dau
---------
 4608 kB
 sau_lan_1
-----------
 8928 kB
 sau_lan_2
-----------
 13 MB
 n_live_tup | n_dead_tup
------------+------------
     100000 |     199915`, { sm: true, hl: [3, 6, 9, 12], title: 'psql (17.11) — pgcourse (excerpt)' }), 1.0))}
<p style="font-size:21px;margin:0">Still exactly 100,000 live rows — but the file is almost <b>3×</b> bigger and holds <b>199,915 dead tuples</b> (two full-table updates minus the few that page pruning already cleaned).</p>` },

  { t: 'VACUUM cleans — but does not shrink the file', giua: true, body: `
${bloatBars({ rh: 44 })}
${two(zm(psql(`VACUUM bloat_demo;
 n_live_tup | n_dead_tup
     100000 |          0
 sau_vacuum → 13 MB
UPDATE bloat_demo SET val = val || '!';
 cap_nhat_lai → 13 MB
VACUUM FULL bloat_demo;
 sau_vacuum_full → 5024 kB`, { sm: true, hl: [3, 6, 8], title: 'psql (17.11) — pgcourse (excerpt)' }), 1.0),
  box('Read it carefully', 'VACUUM marks dead space <b>reusable by this table</b> (the 3rd UPDATE fit inside 13 MB). Only <b>VACUUM FULL</b> rewrites the table smaller — and it takes an <b>ACCESS EXCLUSIVE</b> lock, blocking everything. Autovacuum and bloat in depth: Chapter 14.', 'bad'))}` },

  { t: 'After VACUUM, inside the page again', giua: true, body: `
${two(zm(run(`VACUUM mvcc_demo;
SELECT lp, lp_flags, t_xmin, t_xmax, t_ctid
FROM heap_page_items(get_raw_page('mvcc_demo', 0));
INSERT INTO mvcc_demo VALUES (2, 'new row');
SELECT ctid, xmin, xmax, * FROM mvcc_demo ORDER BY id;`, ` lp | lp_flags | t_xmin | t_xmax | t_ctid
----+----------+--------+--------+--------
  1 |        2 |        |        |
  2 |        0 |        |        |
  3 |        1 |  68636 |  68637 | (0,3)
(3 rows)

INSERT 0 1
 ctid  | xmin  | xmax  | id |   val
-------+-------+-------+----+---------
 (0,3) | 68636 | 68637 |  1 | third
 (0,2) | 68638 |     0 |  2 | new row
(2 rows)`, { hl: [4], hlOut: [3, 4, 13] }), 0.98),
  `<div>${cards([
    ['lp_flags 2 = redirect', 'Slot 1 became a signpost to slot 3 — the index still points at slot 1.'],
    ['lp_flags 0 = unused', 'Slot 2’s dead version is gone; the slot is free…'],
    ['…and reused', 'The next INSERT landed in <b>(0,2)</b>. Same page, no growth.'],
  ], 1)}</div>`)}` },

  { t: 'Trap: a long transaction blocks ALL cleanup', body: `
${pinPic()}
${haiPsql([
    ['+0.00s', '> BEGIN ISOLATION LEVEL REPEATABLE READ;\n> SELECT count(*) FROM accounts;  -- snapshot', ''],
    ['+0.04s', '', '> UPDATE hot_table SET views = views + 1;\nUPDATE 1000\n> VACUUM (VERBOSE) hot_table;\ntuples: 0 removed, 2000 remain, 1000 are dead but not yet removable'],
    ['+0.09s', '', '> SELECT pid, application_name AS app, state, backend_xmin …;\n 6139 | A   | idle in transaction |        68653'],
    ['+0.10s', '> COMMIT;\nCOMMIT', ''],
    ['+1.12s', '', '> VACUUM (VERBOSE) hot_table;\ntuples: 1000 removed, 1000 remain, 0 are dead but not yet removable'],
  ], { fs: 13, hl: [1, 4], ab: '0.8fr 1.45fr' })}` },

  { t: 'Find the culprit before anything clever', giua: true, body: `
${zm(sql(`SELECT pid, now() - xact_start AS age, state, left(query, 50) AS query
FROM pg_stat_activity
WHERE xact_start IS NOT NULL
ORDER BY age DESC;`, { hl: [1] }), 1.3)}
${two(box('Symptoms look unrelated', 'A hot table that the long transaction <b>never touched</b> swells and slows down — because VACUUM may only remove versions that <b>no snapshot</b> could still need, across the whole database.', 'bad'),
  box('Fix', 'End it (COMMIT/ROLLBACK, or <code class="i">pg_terminate_backend(pid)</code>), set <code class="i">idle_in_transaction_session_timeout</code> (11.1), and never keep a transaction open across a user’s think-time or an HTTP call.', 'xanh'))}` },

  { t: 'In an app: the transaction that waits on the network', giua: true, body: `
${zm(`<div class="vsd" style="grid-template-columns:1fr;gap:10px"><div class="sai"><div class="h">✗ Snapshot pinned for seconds</div>${sql(`await prisma.$transaction(async (tx) => {
  const order = await tx.order.findUnique({ where: { id } });
  await sendInvoiceEmail(order);      // HTTP call: 2–10 s
  await tx.order.update({ where: { id },
    data: { invoicedAt: new Date() } });
});`, { sm: true, lang: 'typescript', hl: [3] })}</div><div class="dung"><div class="h">✓ Transaction only around the writes</div>${sql(`const order = await prisma.order.findUnique({ where: { id } });
await sendInvoiceEmail(order);        // outside any transaction
await prisma.order.update({ where: { id },
  data: { invoicedAt: new Date() } });`, { sm: true, lang: 'typescript', hl: [2] })}</div></div>`, 0.98)}
<p style="font-size:21px;margin:0">Every second the left version waits on the mail server, its snapshot holds back VACUUM for the <b>whole database</b> — and it holds any row locks it took. Do slow I/O <b>outside</b> the transaction.</p>` },

  { t: 'Exercise — with the answer from a real run', body: `
${two(`<div>${steps([
    'Create <code class="i">ex_mvcc(id, v)</code>, insert one row, and print <code class="i">ctid, xmin, xmax</code>.',
    'Run <code class="i">UPDATE … SET v = v + 1</code>, then <code class="i">UPDATE … SET v = v</code> (same value!). Print ctid after each.',
    'Predict: how many dead tuples does <code class="i">pg_stat_user_tables</code> report?',
  ])}</div>`,
  zm(psql(` ctid  | xmin  | xmax | id | v
 (0,1) | 69061 |    0 |  1 | 10
UPDATE 1                      -- v = v + 1
 (0,2) | 69062 |    0 |  1 | 11
UPDATE 1                      -- v = v (unchanged)
 (0,3) | 69063 |    0 |  1 | 11
 n_live_tup | n_dead_tup | n_tup_upd | n_tup_hot_upd
          1 |          2 |         2 |             2`, { sm: true, title: 'answer — psql 17.11 (real run)', hl: [6, 8] }), 0.95))}
${box('The lesson', 'Even an UPDATE that changes <b>nothing</b> writes a new version and leaves a dead one. Bulk “touch” updates (<code class="i">SET col = col</code>) are pure bloat. (<b>HOT</b> = the new version stayed on the same page and no index changed — cheaper, but still a dead tuple.)', 'lam')}` },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>After an UPDATE, which hidden column tells you the row moved, and which tells you who wrote it?</li>
<li>B reads a row whose xmax is A’s <b>still-running</b> transaction. Does B see that version? Does B wait?</li>
<li>VACUUM reported 0 dead tuples but the table is still 13 MB. Bug?</li>
</ol>
${box('Answers', '1) <b>ctid</b> moved; <b>xmin</b> = the writer. 2) <b>Yes</b> it sees the old version, and <b>no</b>, it never waits. 3) <b>No</b> — VACUUM makes space reusable inside the table; only VACUUM FULL (exclusive lock) gives it back to the OS.', 'xanh')}` },

  { t: 'Summary & next', to: true, giua: true, body: `
<ul>
<li>UPDATE = new version + xmax stamp on the old; DELETE = stamp only; ROLLBACK = flip a bit in pg_xact</li>
<li><code class="i">xmin</code> / <code class="i">xmax</code> / <code class="i">ctid</code> make it visible; pageinspect shows the page</li>
<li>A snapshot (xmin:xmax:running list) decides which version you see — readers never wait</li>
<li>The price: dead tuples ⇒ VACUUM (reuse) vs VACUUM FULL (shrink, exclusive lock)</li>
<li>One long transaction pins a snapshot and blocks cleanup everywhere</li>
</ul>
${box('Next — 11.3 Isolation levels', 'WHEN is the snapshot taken — per statement or once per transaction? That single choice is the difference between Read Committed, Repeatable Read and Serializable.', 'lam')}` },
]);
