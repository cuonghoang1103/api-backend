/**
 * pg-04-4 — PostgreSQL · Chapter 4 · Lesson 4.4 "UPDATE & DELETE — safely" (slide EN, kiểu FU, 25/10/2026).
 * Nguồn: content/courses/postgresql/s04-chen-truy-van.mjs › postgresql-4-4-update-delete. Output psql = chạy thật PostgreSQL 17.11
 * (video-bai-giang/src/khung/pg/that/pg-04-4.out.txt). Bổ sung: bảng trắng + vòi nước (WHERE là "chỉ đúng chỗ"), giải phẫu UPDATE, nghi thức ghi an toàn
 * (SELECT trước → BEGIN → xem số dòng → COMMIT/ROLLBACK), điều kiện nằm trong WHERE (balance >= 30) + CHECK, UPDATE … FROM, DELETE … USING, xoá mềm,
 * WITH moved AS (DELETE … RETURNING) INSERT, TRUNCATE trong giao dịch (PostgreSQL rollback được), đối chiếu SQL Server (UPDATE FROM, OUTPUT, @@ROWCOUNT, BEGIN TRAN),
 * psql an toàn, ví dụ thật: messages.deleted_at + Prisma increment, CT Shop 2.000 đơn (quên WHERE rồi ROLLBACK).
 */
import { lamDeck, sql, psql, sh, run, tbl, two, box, steps, cards, kw, vsd, c } from './_pg-chung.mjs';
import { anatomy, luoiDon } from './pg-04-hinh.mjs';

const zm = (h, z = 1.3) => `<div style="zoom:${z}">${h}</div>`;
export const deck = { key: 'pg-04-4', code: 'PG 4.4', title: 'UPDATE & DELETE — safely', sub: 'Change and remove rows without disasters' };

const legend = `<div style="display:flex;gap:18px;font-size:19px;margin-top:6px"><span><b style="color:#2f7d4f">■</b> paid</span><span><b style="color:#336791">■</b> shipped</span><span><b style="color:#e08a1e">■</b> pending</span><span><b style="color:#9aa0a6">■</b> cancelled</span><span><b style="color:#c0392b">■</b> changed</span></div>`;

export const slides = lamDeck({ chuong: 'Chapter 4 — Inserting & querying data', bai: '4.4' }, [
  { cover: true, t: 'UPDATE & DELETE —<br>safely', sub: 'WHERE, RETURNING, BEGIN / ROLLBACK — and the “forgot WHERE” nightmare.' },

  { t: 'What you will get from this lesson', to: true, body: `
<ul>
<li><code class="i">UPDATE … WHERE … RETURNING</code> and <code class="i">DELETE … WHERE … RETURNING</code></li>
<li>The disaster: <b>no WHERE = every row</b> — and how <code class="i">BEGIN … ROLLBACK</code> saves you</li>
<li>A <b>safe-write ritual</b> you can repeat for every manual change</li>
<li><code class="i">UPDATE … FROM</code>, <code class="i">DELETE … USING</code>, soft delete, archive in one statement</li>
<li>Real examples: this website's <code class="i">deleted_at</code> and CT Shop's 2,000 orders</li>
</ul>
${box('SQL Server developer?', 'Watch for: <code class="i">UPDATE … FROM</code> does <b>not</b> repeat the target table, <code class="i">OUTPUT</code> → <code class="i">RETURNING</code>, and <code class="i">@@ROWCOUNT</code> → the command tag (<code class="i">UPDATE 3</code>).', 'lam')}` },

  { t: 'Everyday example first: the whiteboard', giua: true, body: `
<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;align-items:start">
<div><div class="tcap">orders today (200 shown)</div><div style="zoom:.62">${luoiDon('ok', { cols: 20, rows: 10 })}</div></div>
<div><div class="tcap">UPDATE … WHERE (some rows)</div><div style="zoom:.62">${luoiDon('few', { cols: 20, rows: 10 })}</div></div>
<div><div class="tcap" style="color:#c0392b">UPDATE with NO WHERE</div><div style="zoom:.62">${luoiDon('red', { cols: 20, rows: 10 })}</div></div>
</div>
${legend}
<p style="font-size:23px;margin:0">UPDATE and DELETE do <b>exactly</b> what you say. <code class="i">WHERE</code> is the finger pointing at <i>which</i> rows; leave it out and the finger points at the <b>whole whiteboard</b>. Nothing asks “are you sure?”.</p>` },

  { t: 'UPDATE … WHERE … RETURNING', body: `
${zm(run(`UPDATE note SET views = views + 1 WHERE id = 1
RETURNING id, title, views;`, ` id |    title     | views
----+--------------+-------
  1 | Intro to SQL |   121
(1 row)

UPDATE 1`, { hlOut: [3] }), 1.3)}
${anatomy([['UPDATE note', 'which table'], ['SET views = views + 1', 'new values (may use the old ones)'], ['WHERE id = 1', 'which rows'], ['RETURNING …', 'show the result']], { fs: 21 })}` },

  { t: 'One statement, many rows', body: `
${zm(run(`UPDATE note SET pinned = false
WHERE author = 'Cuong'
RETURNING id, title, pinned;`, ` id |       title       | pinned
----+-------------------+--------
  2 | Indexes deep dive | f
  6 | Backup strategy   | f
  1 | Intro to SQL      | f
(3 rows)

UPDATE 3`, { hlOut: [3, 4, 5, 8] }), 1.2)}
${two(box('The WHERE decides how many', 'Three rows changed in one statement. <code class="i">RETURNING</code> proves it hit Cuong\'s notes and nobody else\'s — your “blast radius”.', 'info'),
box('Command tag = count', '<code class="i">UPDATE 3</code> is the affected-row count. If you expected 3 and see 3000, <b>stop</b>.', 'xanh'))}` },

  { t: 'The disaster: forgetting WHERE', body: `
${zm(run(`BEGIN;
UPDATE note SET views = 0;             -- NO WHERE: every row!
SELECT count(*) AS rows_hit, sum(views) AS total_views FROM note;
ROLLBACK;                              -- throw it all away
SELECT count(*) AS rows, sum(views) AS total_views FROM note;`, `UPDATE 7

 rows_hit | total_views
----------+-------------
        7 |           0
(1 row)

 rows | total_views
------+-------------
    7 |         306
(1 row)`, { hlOut: [1, 5, 11] }), 1.0)}
<p style="font-size:21px;margin:0">Inside the transaction all <b>7</b> rows were set to 0 (<code class="i">UPDATE 7</code>, total views 0). Because we did not commit, <code class="i">ROLLBACK</code> threw the change away: after it, the original <b>306</b> views are back.</p>` },

  { t: 'The safe-write ritual', body: `
${steps([
    '<b>SELECT first</b> — run <code class="i">SELECT … WHERE …</code> with the <i>same</i> condition and look at the rows.',
    '<b>BEGIN;</b> — open a transaction you can undo.',
    '<b>Change the verb</b> to UPDATE / DELETE, add <code class="i">RETURNING</code>, run it, read the <b>row count</b>.',
    '<b>Looks right?</b> <code class="i">COMMIT;</code> &nbsp;·&nbsp; <b>Surprised?</b> <code class="i">ROLLBACK;</code>',
  ])}
${zm(run(`SELECT id, title FROM note WHERE author = 'Minh' AND views < 10;
BEGIN;
UPDATE note SET tag = 'misc' WHERE author = 'Minh' AND views < 10 RETURNING id, title, tag;
ROLLBACK;`, ` id |      title
----+-----------------
  5 | My reading list
  7 | Quick draft
(2 rows)

 id |      title      | tag
----+-----------------+------
  5 | My reading list | misc
  7 | Quick draft     | misc
(2 rows)`, { hlOut: [3, 4, 11, 12] }), 0.92)}` },

  { t: 'Let the condition do the work', body: `
${zm(run(`UPDATE account SET balance = balance - 30
WHERE id = 1 AND balance >= 30 RETURNING id, balance;

UPDATE account SET balance = balance - 90
WHERE id = 1 AND balance >= 90 RETURNING id, balance;`, ` id | balance
----+---------
  1 |      70
(1 row)

 id | balance
----+---------
(0 rows)`, { hlOut: [3, 9] }), 1.05)}
${two(box('Check inside the WHERE', 'Balance is 100, then 70. The second withdrawal of 90 matches <b>0 rows</b> — nothing is changed and your code sees “0 rows”. Safe even when two requests run at once.', 'xanh'),
box('Last line of defence', 'A <code class="i">CHECK (balance >= 0)</code> constraint rejects the bad write too: <code class="i">ERROR: new row … violates check constraint "account_balance_check"</code>.', 'info'))}` },

  { t: 'UPDATE … FROM: change rows using another table', body: `
${two(tbl(['id', 'title', 'views'], [['1', 'Intro to SQL', '120'], ['2', 'Indexes deep dive', '90'], ['3', 'Timezones done right', '45']], { cap: 'note (target)', hl: [1, 2] }),
tbl(['id', 'new_views'], [['2', '500'], ['3', '600'], ['777', '1']], { cap: 'price_fix (source)', hl: [0, 1], mo: [2] }), 'r46')}
${zm(run(`UPDATE note n SET views = f.new_views
FROM price_fix f WHERE n.id = f.id
RETURNING n.id, n.title, n.views;`, ` id |        title         | views
----+----------------------+-------
  2 | Indexes deep dive    |   500
  3 | Timezones done right |   600
(2 rows)`, { hlOut: [3, 4] }), 1.1)}
<p style="font-size:20px;margin:0">Rows 2 and 3 match; id 777 matches nothing and is ignored. The target table is <b>not</b> repeated in FROM (T-SQL repeats it).</p>` },

  { t: 'DELETE … WHERE … RETURNING', body: `
${zm(run(`DELETE FROM note WHERE title = 'Quick draft' RETURNING id, title;
SELECT count(*) AS remaining FROM note;`, ` id |    title
----+-------------
  7 | Quick draft
(1 row)

DELETE 1

 remaining
-----------
         6
(1 row)`, { hlOut: [3, 6, 11] }), 1.1)}
<p style="font-size:21px;margin:0">One row removed; six remain. <code class="i">DELETE</code> follows the same rules: <b>always WHERE</b>, and <code class="i">RETURNING</code> shows what went. A real DELETE can also be <b>blocked</b> or <b>cascade</b> through foreign keys (Chapter 3: <code class="i">ON DELETE</code>).</p>` },

  { t: 'DELETE … USING: delete by another table', body: `
${zm(run(`CREATE TABLE banned (author text);
INSERT INTO banned VALUES ('Lan');

DELETE FROM note n USING banned b
WHERE n.author = b.author
RETURNING n.id, n.title, n.author;`, ` id |        title         | author
----+----------------------+--------
  3 | Timezones done right | Lan
  4 | JSONB in practice    | Lan
(2 rows)

DELETE 2`, { hlOut: [3, 4, 7] }), 1.1)}
${two(box('USING = the other table', 'The DELETE counterpart of <code class="i">UPDATE … FROM</code>: join <code class="i">note</code> to <code class="i">banned</code> in WHERE, delete the matching <code class="i">note</code> rows.', 'info'),
box('T-SQL difference', 'SQL Server: <code class="i">DELETE n FROM note n JOIN banned b ON …</code>. PostgreSQL: <code class="i">DELETE FROM note n USING banned b WHERE …</code>.', 'lam'))}` },

  { t: 'Soft delete: keep the row, hide it', body: `
${zm(run(`ALTER TABLE note ADD COLUMN deleted_at timestamptz;
UPDATE note SET deleted_at = now() WHERE id = 5
RETURNING id, title, deleted_at IS NOT NULL AS is_deleted;
SELECT id, title FROM note WHERE deleted_at IS NULL ORDER BY id;
UPDATE note SET deleted_at = NULL WHERE id = 5 RETURNING id, deleted_at;`, ` id |      title      | is_deleted
----+-----------------+------------
  5 | My reading list | t
(1 row)

 id |       title
----+-------------------
  1 | Intro to SQL
  2 | Indexes deep dive
  6 | Backup strategy
(3 rows)

 id | deleted_at
----+------------
  5 |
(1 row)`, { hlOut: [3, 15] }), 0.82)}
<p style="font-size:19px;margin:0">“Delete” = set a timestamp; every read adds <code class="i">WHERE deleted_at IS NULL</code>; “undo” = set it back to NULL. Prefer it for anything a human might want back.</p>` },

  { t: 'Archive in ONE statement', body: `
${zm(run(`CREATE TABLE note_archive (LIKE note INCLUDING DEFAULTS);

WITH moved AS (
  DELETE FROM note WHERE created_at < '2026-03-01' RETURNING *
)
INSERT INTO note_archive SELECT * FROM moved RETURNING id, title;`, ` id |       title
----+-------------------
  1 | Intro to SQL
  2 | Indexes deep dive
(2 rows)

INSERT 0 2`, { hl: [4, 5, 6], hlOut: [3, 4, 5] }), 1.2)}
<p style="font-size:21px;margin:0">The <code class="i">DELETE … RETURNING *</code> inside the <code class="i">WITH</code> hands its rows straight to the <code class="i">INSERT</code>. It is <b>atomic</b>: either the rows move completely or not at all — no “deleted but not copied”.</p>` },

  { t: 'TRUNCATE vs DELETE', body: `
${zm(run(`BEGIN;
TRUNCATE note_archive;
SELECT count(*) AS inside_tx FROM note_archive;
ROLLBACK;
SELECT count(*) AS after_rollback FROM note_archive;`, ` inside_tx
-----------
         0
(1 row)

 after_rollback
----------------
              2
(1 row)`, { hlOut: [3, 9] }), 1.0)}
${two(box('TRUNCATE', 'Empties the <b>whole</b> table instantly — no WHERE. It is <b>transactional</b> in PostgreSQL: ROLLBACK brought the 2 rows back.', 'info'),
box('DELETE', 'Row by row, can filter with WHERE, fires row triggers. Use TRUNCATE to reset a scratch table, DELETE for “some rows”.', 'xanh'))}` },

  { t: 'Coming from SQL Server?', body: `
<div style="zoom:1.05"><table class="t">
<tr><th style="width:210px">Task</th><th>SQL Server (T-SQL)</th><th>PostgreSQL</th></tr>
<tr><td>Update with a join</td><td><code class="i">UPDATE n SET … FROM note n JOIN src s ON …</code></td><td><code class="i">UPDATE note n SET … FROM src s WHERE n.id = s.id</code></td></tr>
<tr><td>Delete with a join</td><td><code class="i">DELETE n FROM note n JOIN …</code></td><td><code class="i">DELETE FROM note n USING … WHERE …</code></td></tr>
<tr><td>See changed rows</td><td><code class="i">OUTPUT inserted.*, deleted.*</code></td><td><code class="i">RETURNING *</code> (the <b>new</b> values; PostgreSQL 18 adds OLD/NEW)</td></tr>
<tr><td>Affected-row count</td><td><code class="i">@@ROWCOUNT</code></td><td>command tag <code class="i">UPDATE 3</code> · driver's <code class="i">rowCount</code></td></tr>
<tr><td>Transaction</td><td><code class="i">BEGIN TRAN … COMMIT</code></td><td><code class="i">BEGIN; … COMMIT;</code></td></tr>
<tr><td>TRUNCATE in a transaction</td><td>can be rolled back (minimal logging aside)</td><td>can be rolled back</td></tr>
</table></div>
${box('Same discipline, same traps', 'A missing WHERE is just as deadly in both. The ritual (SELECT first → transaction → check count) is identical.', 'lam')}` },

  { t: 'psql habits that save weekends', body: `
${zm(sh(`$ psql -d pgcourse --single-transaction -f fix.sql   # whole file = one transaction

pgcourse=# \\set ON_ERROR_STOP on        -- stop at the first error
pgcourse=# BEGIN;                       -- before EVERY manual write
pgcourse=# UPDATE …  -- check the "UPDATE n" count, then COMMIT or ROLLBACK`, { sm: true }), 1.15)}
${two(box('Why', 'Nothing in SQL asks for confirmation: <code class="i">DELETE FROM orders;</code> is valid and empties the table. If you highlight half a statement in a GUI and press run, the row count is your <b>only</b> warning.', 'do2'),
box('Cheap insurance', 'One <code class="i">BEGIN;</code> turns a disaster into a <code class="i">ROLLBACK</code>. The alternative is restoring last night\'s backup (Chapter 15).', 'xanh'))}` },

  { t: 'Real world (1): “delete” on cuongthai.com', body: `
${two(sql(`-- soft delete of a chat message
UPDATE messages
SET    deleted_at = now()
WHERE  id = $1 AND sender_id = $2
RETURNING id;`, { sm: true }) + `<p style="font-size:19px;margin:8px 0 0">The row stays for audit; every read adds <code class="i">deleted_at IS NULL</code>.</p>`,
sql(`// Prisma: a view counter
await prisma.post.update({
  where: { id },
  data: { viewCount: { increment: 1 } },
});
// UPDATE posts
// SET view_count = view_count + 1
// WHERE id = $1`, { sm: true, lang: 'typescript' }), 'r46')}
${box('Why soft delete here', 'Deleting or unsending a chat message sets <code class="i">deleted_at</code> instead of removing the row — that is why a “Deleted” tab can <b>restore</b> it. A real DELETE is for data nobody will miss; anything a human may regret losing is a soft delete.', 'xanh')}` },

  { t: 'Real world (2): 2,000 orders, one missing WHERE', body: `
${zm(run(`BEGIN;
UPDATE orders SET status = 'cancelled';
SELECT status, count(*) FROM orders GROUP BY status ORDER BY status;
ROLLBACK;
SELECT status, count(*) FROM orders GROUP BY status ORDER BY status;`, `UPDATE 2000

  status   | count
-----------+-------
 cancelled |  2000
(1 row)

  status   | count
-----------+-------
 cancelled |   155
 paid      |   755
 pending   |   181
 shipped   |   909
(4 rows)`, { hlOut: [1, 5] }), 0.95)}
<p style="font-size:20px;margin:0">CT Shop: <code class="i">UPDATE 2000</code> — <b>every</b> order, paid and shipped included, is now cancelled. <code class="i">ROLLBACK</code> restores the 155 / 755 / 181 / 909 split. Without BEGIN it would be a backup restore.</p>` },

  { t: 'Your turn: cancel the old pending orders', body: `
<p style="margin:0">Cancel the <b>pending</b> orders created <b>before 2025-10-01</b> — safely: preview the count, change inside a transaction, then undo.</p>
${zm(run(`SELECT count(*) FROM orders WHERE status = 'pending' AND created_at < '2025-10-01';
BEGIN;
UPDATE orders SET status = 'cancelled'
WHERE status = 'pending' AND created_at < '2025-10-01';
ROLLBACK;`, ` count
-------
    71
(1 row)

UPDATE 71`, { hlOut: [3, 7] }), 1.2)}
<p class="nho">Try it first. Checks: the preview count (71) must equal the <code class="i">UPDATE</code> count (71). Replace <code class="i">ROLLBACK</code> with <code class="i">COMMIT</code> only when they match.</p>` },

  { t: 'Self-check — pause the video and answer', to: true, body: `
${steps([
    'What happens with <code class="i">UPDATE note SET views = 0;</code> — and how do you undo it?',
    'Why is <code class="i">UPDATE account SET balance = balance - 30 WHERE id = 1 AND balance >= 30</code> safer than read-then-write?',
    'When do you choose a <b>soft delete</b> instead of DELETE?',
  ])}
${box('Answers', `<ol style="margin:0;font-size:21px"><li>It changes <b>every</b> row (<code class="i">UPDATE 7</code>). Inside <code class="i">BEGIN;</code> you <code class="i">ROLLBACK;</code>; otherwise only a backup helps.</li>
<li>The check and the write are <b>one</b> atomic statement; a second request matches 0 rows instead of overdrawing.</li>
<li>When a human may want it back (messages, notes, orders): set <code class="i">deleted_at</code>, filter reads with <code class="i">IS NULL</code>.</li></ol>`, 'xanh')}` },

  { t: 'Summary', to: true, body: `
<ul>
<li><b>Always WHERE</b> — unless you truly mean “every row” — and use <code class="i">RETURNING</code> to see the blast radius</li>
<li><b>Ritual:</b> SELECT first → <code class="i">BEGIN</code> → run → check count → <code class="i">COMMIT</code> / <code class="i">ROLLBACK</code></li>
<li><code class="i">UPDATE … FROM</code> · <code class="i">DELETE … USING</code> · <code class="i">WITH … DELETE … RETURNING</code> · soft delete</li>
<li>Put the check <b>inside</b> the WHERE (<code class="i">balance &gt;= 30</code>) for safe concurrent writes</li>
</ul>
${box('Next: Chapter 5 — JOIN', 'You can now read and write one table. Next: combining tables. First do <b>Lab 2</b> and the exercises on Code Lab → PostgreSQL.', 'lam')}` },
]);
