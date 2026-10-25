/**
 * pg-12-3 — PostgreSQL · Chapter 12 · Lesson 12.3 "Views: a query with a name" (slide EN, kiểu FU, 26/10/2026, agent c12).
 * Nguồn: content/courses/postgresql/s12-ham-trigger-view.mjs › postgresql-12-3-view. Output = chạy thật PostgreSQL 17.11 (container pgcourse17,
 * schema ch12): video-bai-giang/src/khung/pg/that/pg-12-3.sql + pg-12-3.out.txt (psql -X -a) + pg-12-3.prisma.txt (Prisma 5.22 validate).
 * Bổ sung so với web: cửa sổ (đời thường), view không có dữ liệu (0 bytes vs 88 kB, pg_views), planner "mở" view (EXPLAIN không có nút View),
 * trượt khỏi view khi thiếu CHECK OPTION (UPDATE 1 rồi mất dòng), view JOIN + INSTEAD OF, view che cột (users_public), security_invoker (PG15+),
 * security_barrier và hàm rò rỉ (4 NOTICE ↔ 2 NOTICE), SELECT * bị đóng băng cột, CREATE OR REPLACE giới hạn, DROP phụ thuộc, Prisma `views` preview,
 * bài tập viral_notes. Số liệu 17.11 thay các số cũ trong bài web (khối output thay nguyên).
 */
import { lamDeck, sql, psql, run, tbl, two, box, kw, cards, steps, vsd } from './_pg-chung.mjs';
import { XANH, DO, CAM, PG, cuaSoPic, moViewPic, quyenViewPic, barrierPic } from './pg-12-hinh.mjs';

const zm = (h, z = 1.2) => `<div style="zoom:${z}">${h}</div>`;
export const deck = { key: 'pg-12-3', code: 'PG 12.3', title: 'Views: a query with a name', sub: 'CREATE VIEW · updatable views · CHECK OPTION · security' };

export const slides = lamDeck({ chuong: 'Chapter 12 — Functions, triggers & views', bai: '12.3' }, [
  { cover: true, t: 'Views:<br>a query with a name', sub: 'a window onto your data — updatable views,<br>WITH CHECK OPTION and permissions' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>What a <b>view</b> is — and what it is <b>not</b>: it stores a <b>query</b>, never rows</li>
<li>Why reading a view costs nothing extra: the planner <b>opens the window</b> (<code class="i">EXPLAIN</code>)</li>
<li><b>Writable views</b>, the escape trap and <code class="i">WITH CHECK OPTION</code>; <code class="i">INSTEAD OF</code> triggers for the rest</li>
<li>Views as a <b>permission boundary</b>: hide columns, <code class="i">security_invoker</code>, <code class="i">security_barrier</code></li>
<li>Traps (<code class="i">SELECT *</code>, <code class="i">CREATE OR REPLACE</code>, dependencies) and views with Prisma</li>
</ul>
${box('Remember from Chapter 7', 'A CTE gives a query a name <b>for one statement</b>. A view gives it a name <b>for the whole database</b>, saved until you drop it.', 'lam')}` },

  { t: 'Everyday example first: a window', giua: true, body: `
${cuaSoPic()}` },

  { t: 'The data for the whole lesson', giua: true, body: `
${two(zm(sql(`CREATE TABLE users (
  id serial PRIMARY KEY,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL DEFAULT '…');
CREATE TABLE notes (
  id serial PRIMARY KEY,
  user_id int NOT NULL REFERENCES users(id),
  title text NOT NULL, body text NOT NULL,
  views int NOT NULL DEFAULT 0, …);
-- 20 users · 500 notes · views = (id*37) % 101`, { sm: true, hl: [3] }), 1.0),
  `<div>${box('Same schema as 12.1 — plus a secret', 'Now <code class="i">users</code> has a <b>password_hash</b> column. Today’s views will show only what is safe to show.', 'lam')}
${box('Everything is reproducible', 'All output is real PostgreSQL 17.11. Numbers such as 25 notes per user and 1433 total views come from the deterministic <code class="i">(id × 37) mod 101</code> rule.', 'ok')}</div>`)}` },

  { t: 'CREATE VIEW: save the query, not the answer', giua: true, body: `
${two(zm(sql(`CREATE VIEW note_summary AS
  SELECT u.id AS user_id, u.email,
         count(n.id) AS so_note,
         coalesce(sum(n.views),0) AS tong_views
  FROM users u LEFT JOIN notes n
       ON n.user_id = u.id
  GROUP BY u.id, u.email;

SELECT * FROM note_summary
ORDER BY tong_views DESC LIMIT 3;`, { sm: true, hl: [1] }), 1.12),
  zm(psql(`CREATE VIEW
 user_id |       email       | so_note | tong_views
---------+-------------------+---------+------------
      11 | user11@example.com |      25 |       1475
       1 | user1@example.com  |      25 |       1433
      20 | user20@example.com |      25 |       1417
(3 rows)`, { sm: true }), 1.2))}
<p style="font-size:22px;margin:0">A join and an aggregate you would paste in six places now live in <b>one definition</b>. Fix it once, and all six callers are fixed.</p>` },

  { t: 'Always fresh — because there is nothing to refresh', giua: true, body: `
${two(zm(run(`INSERT INTO notes (user_id, title, body, views)
VALUES (1, 'Note moi', 'x', 2000);
SELECT * FROM note_summary WHERE user_id = 1;`, ` user_id |       email       | so_note | tong_views
---------+-------------------+---------+------------
       1 | user1@example.com |      26 |       3433
(1 row)`, { sm: true, hlOut: [3] }), 1.1),
  zm(run(`SELECT c.relname, c.relkind,
  pg_size_pretty(pg_relation_size(c.oid)) AS size_on_disk
FROM pg_class c WHERE … IN ('notes','note_summary');`, `   relname    | relkind | size_on_disk
--------------+---------+--------------
 note_summary | v       | 0 bytes
 notes        | r       | 88 kB`, { sm: true, hlOut: [3] }), 1.1))}
<p style="font-size:22px;margin:0">User 1 went from <b>25</b> notes / 1433 views to <b>26</b> / <b>3433</b> — no refresh command, no cache to invalidate. The view has <b>0 bytes</b> on disk: <code class="i">relkind = 'v'</code> means <i>view</i>, and what is stored is only the <b>definition</b> (see it in <code class="i">pg_views</code>).</p>` },

  { t: 'The planner opens the window', body: `
${moViewPic()}
${two(zm(sql(`EXPLAIN (COSTS OFF)
SELECT title FROM note_cua_user1
WHERE views > 90;`, { sm: true }), 1.0),
  zm(sql(`EXPLAIN (COSTS OFF)
SELECT title FROM notes
WHERE user_id = 1 AND views > 90;`, { sm: true }), 1.0))}
${zm(psql(` Seq Scan on notes
   Filter: ((views > 90) AND (user_id = 1))      -- identical for both`, { sm: true, hl: [2] }), 1.05)}` },

  { t: 'View, table, materialized view… which one?', to: true, giua: true, body: `
${cards([
    ['Table', 'Stores <b>rows</b>. Always current, costs disk, and everything else is built from it.'],
    ['View', 'Stores a <b>query</b>. Always fresh, costs nothing to keep — and the full cost of the query <b>every time</b>.'],
    ['Materialized view', 'Stores the <b>rows a query produced</b>. Fast to read, <b>stale</b> until REFRESH (lesson 12.4).'],
    ['Summary table + trigger', 'Rows kept in sync by an AFTER trigger (12.2). Fresh <b>and</b> fast — paid for in write cost and complexity.'],
  ], 2)}` },

  { t: 'Some views are writable', giua: true, body: `
${two(zm(run(`CREATE VIEW note_cua_user1 AS
  SELECT id, user_id, title, views
  FROM notes WHERE user_id = 1;

UPDATE note_cua_user1 SET views = 5
WHERE id = 20;
SELECT id, user_id, views FROM notes
WHERE id = 20;`, `CREATE VIEW
UPDATE 1
 id | user_id | views
----+---------+-------
 20 |       1 |     5
(1 row)`, { sm: true, hl: [5], hlOut: [2] }), 1.12),
  `<div>${box('Automatically updatable', 'A view over <b>one table</b> with no <code class="i">GROUP BY</code>, <code class="i">DISTINCT</code>, aggregate, window function, <code class="i">LIMIT</code> or set operation: PostgreSQL translates <code class="i">INSERT/UPDATE/DELETE</code> back to the base table.', 'ok')}
${box('Your WHERE still applies', 'The UPDATE above could only touch rows <b>inside</b> the view (user 1). It is a real change to <code class="i">notes</code>.', 'lam')}</div>`)}` },

  { t: 'The escape trap: a row slips out of its own view', giua: true, body: `
${two(zm(run(`UPDATE note_cua_user1
SET user_id = 2 WHERE id = 40;
SELECT id, user_id FROM notes WHERE id = 40;
SELECT count(*) AS con_trong_view
FROM note_cua_user1 WHERE id = 40;`, `UPDATE 1
 id | user_id
----+---------
 40 |       2
(1 row)

 con_trong_view
----------------
              0
(1 row)`, { sm: true, hl: [2], hlOut: [1, 10] }), 1.12),
  `<div>${box('It SUCCEEDED — and the row vanished', 'Without a guard you may update a row <b>out of</b> the view’s own <code class="i">WHERE</code>. Note 40 now belongs to user 2: it silently disappeared from the very view you wrote through.', 'do2')}
${box('Who would be hurt?', 'A <b>per-tenant</b> view that lets a customer “edit their rows”: they could hand a row to <b>another tenant</b>. Next slide: the guard.', 'lam')}</div>`)}` },

  { t: 'WITH CHECK OPTION: the guard', giua: true, body: `
${two(zm(sql(`CREATE VIEW note_user1_check AS
  SELECT id, user_id, title, body
  FROM notes WHERE user_id = 1
  WITH CHECK OPTION;

UPDATE note_user1_check
SET user_id = 2 WHERE id = 20;
INSERT INTO note_user1_check
  (user_id, title, body)
VALUES (2, 'lac cua nguoi khac', 'x');
INSERT INTO note_user1_check
  (user_id, title, body)
VALUES (1, 'dung cua toi', 'x');`, { sm: true, hl: [4] }), 1.05),
  zm(psql(`ERROR:  new row violates check option
        for view "note_user1_check"
DETAIL:  Failing row contains (20, 2, Note 20, …)

ERROR:  new row violates check option
        for view "note_user1_check"
DETAIL:  Failing row contains (502, 2, …)

INSERT 0 1`, { sm: true, hl: [1, 5, 9] }), 1.1))}
<p style="font-size:21px;margin:0"><code class="i">WITH CHECK OPTION</code> checks every <b>new row version</b> against the view’s <code class="i">WHERE</code>: leaving the view (UPDATE) or never entering it (INSERT) is refused. For a writable per-tenant view it is <b>not optional</b>.</p>` },

  { t: 'Not writable by itself: GROUP BY and JOIN', giua: true, body: `
${two(zm(run(`UPDATE note_summary
SET so_note = 0 WHERE user_id = 1;`, `ERROR:  cannot update view "note_summary"
DETAIL:  Views containing GROUP BY are not
  automatically updatable.
HINT:  To enable updating the view, provide
  an INSTEAD OF UPDATE trigger or an
  unconditional ON UPDATE DO INSTEAD rule.`, { sm: true, hlOut: [1, 5] }), 1.12),
  zm(run(`CREATE VIEW note_email AS
  SELECT n.id, n.title, u.email
  FROM notes n JOIN users u ON u.id = n.user_id;
UPDATE note_email SET title = 'x' WHERE id = 7;`, `ERROR:  cannot update view "note_email"
DETAIL:  Views that do not select from a single
  table or view are not automatically updatable.
HINT:  To enable updating the view, provide an
  INSTEAD OF UPDATE trigger …`, { sm: true, hlOut: [1] }), 1.12))}
<p style="font-size:20px;margin:0">An aggregate row (<code class="i">so_note</code>) has no single base row to change; a join does not say <b>which table</b> to write. The error is precise and even names the way out: an <b>INSTEAD OF trigger</b>.</p>` },

  { t: 'INSTEAD OF trigger: you define what the write means', giua: true, body: `
${two(zm(sql(`CREATE FUNCTION note_email_upd()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  UPDATE notes SET title = NEW.title
  WHERE id = OLD.id;
  RETURN NEW;
END $$;

CREATE TRIGGER note_email_ins_of
  INSTEAD OF UPDATE ON note_email
  FOR EACH ROW
  EXECUTE FUNCTION note_email_upd();`, { sm: true, hl: [4, 5, 10] }), 1.12),
  `<div>${zm(psql(`UPDATE note_email SET title = 'doi tieu de'
WHERE id = 7;
UPDATE 1
SELECT id, title FROM notes WHERE id = 7;
 id |    title
----+-------------
  7 | doi tieu de`, { sm: true, hl: [3, 7] }), 1.2)}
<p style="font-size:20px;margin:6px 0 0"><code class="i">INSTEAD OF</code> triggers exist <b>only on views</b>. The write never reaches the view; the function receives <code class="i">NEW</code>/<code class="i">OLD</code> and does the real work wherever it wants (here: only <code class="i">title</code>, in <code class="i">notes</code>).</p></div>`)}` },

  { t: 'A view as a permission boundary', body: `
${quyenViewPic()}
${two(zm(psql(`SET ROLE ch12_reader;
SELECT * FROM users LIMIT 1;
ERROR:  permission denied for table users
SELECT * FROM users_public WHERE id <= 2 ORDER BY id;
 id |       email
----+-------------------
  1 | user1@example.com
  2 | user2@example.com`, { sm: true, hl: [3] }), 1.0),
  zm(psql(`SELECT password_hash FROM users_public LIMIT 1;
ERROR:  column "password_hash" does not exist
LINE 1: SELECT password_hash FROM users_public …`, { sm: true, hl: [2] }), 1.0))}` },

  { t: 'security_invoker: whose rights does the view use?', body: `
${two(zm(sql(`-- default: the view runs with the
-- rights of its OWNER
SELECT * FROM users_public;   -- ✓ works

ALTER VIEW users_public
  SET (security_invoker = true);
-- now: the rights of the CALLER`, { sm: true, hl: [3, 6] }), 1.0),
  zm(psql(`SET ROLE ch12_reader;
SELECT * FROM users_public
WHERE id <= 2 ORDER BY id;
ERROR:  permission denied for table users`, { sm: true, hl: [4] }), 1.15))}
${cards([
    ['Default (owner’s rights)', 'The view is a <b>controlled doorway</b> — like <code class="i">SECURITY DEFINER</code> (12.1). Great for exposing a safe slice.'],
    ['security_invoker = true (PG 15+)', 'The view <b>respects the caller’s</b> permissions (and row-level security). Use it when the view is only a convenience, not a gate.'],
  ], 2)}` },

  { t: 'security_barrier: stop functions peeking', body: `
${barrierPic()}
${two(zm(sql(`CREATE VIEW luong_cua_me AS
  SELECT id, ghi_chu FROM luong
  WHERE chu = 'me';
-- caller adds a cheap function to HIS where:
SELECT id FROM luong_cua_me
WHERE ro_ri(ghi_chu);   -- RAISE NOTICE inside`, { sm: true, hl: [6] }), 0.95),
  box('Why it matters', 'Without <code class="i">security_barrier</code> the planner may run the caller’s <b>cheap</b> function <b>before</b> the view’s filter — so it sees rows the view was meant to hide (“salary 5000”). <code class="i">ALTER VIEW … SET (security_barrier = true)</code> forces the view’s <code class="i">WHERE</code> first.', 'do2'))}` },

  { t: 'Three view traps', body: `
${cards([
    ['SELECT * is frozen', '<code class="i">CREATE VIEW v AS SELECT * FROM t</code> stores the column list <b>of that day</b>. Add column <code class="i">c</code> to <code class="i">t</code> and <code class="i">v</code> still shows <b>a, b</b> only.'],
    ['CREATE OR REPLACE is strict', 'You may <b>add</b> columns at the end — not rename, reorder or drop. <i>“cannot drop columns from view”</i>. Otherwise: <code class="i">DROP VIEW</code> + recreate.'],
    ['Dependencies bite', '<code class="i">DROP TABLE t</code> fails while a view uses it; <code class="i">DROP VIEW v</code> fails while another view uses <code class="i">v</code>. <code class="i">CASCADE</code> drops them all.'],
  ])}
${two(zm(psql(`SELECT * FROM t_demo;   → a | b | c
SELECT * FROM v_demo;   → a | b`, { sm: true, hl: [2] }), 1.3),
  zm(psql(`CREATE OR REPLACE VIEW v_demo AS SELECT a, b FROM t_demo;
ERROR:  cannot drop columns from view
DROP TABLE t_demo;
ERROR:  cannot drop table t_demo because other objects depend on it
DETAIL:  view v_demo depends on table t_demo`, { sm: true, hl: [2, 4] }), 1.05))}` },

  { t: 'Coming from SQL Server? Views compared', body: `
<div style="zoom:1.0"><table class="t">
<tr><th>Idea</th><th>SQL Server</th><th>PostgreSQL</th></tr>
<tr><td>Basic view</td><td><code class="i">CREATE VIEW … AS SELECT</code></td><td>the same</td></tr>
<tr><td>Guard against escape</td><td><code class="i">WITH CHECK OPTION</code></td><td>the same</td></tr>
<tr><td>Write through a join view</td><td><code class="i">INSTEAD OF</code> trigger</td><td>the same (view-only trigger)</td></tr>
<tr><td>Stored result (fast)</td><td><b>indexed view</b> (<code class="i">SCHEMABINDING</code> + unique clustered index), kept <b>fresh</b> automatically</td><td><b>materialized view</b>: stale until <code class="i">REFRESH</code> (12.4)</td></tr>
<tr><td>Hide the definition</td><td><code class="i">WITH ENCRYPTION</code></td><td>no — use roles and column privileges</td></tr>
<tr><td>Caller’s vs owner’s rights</td><td>ownership chaining</td><td><code class="i">security_invoker</code> option</td></tr>
</table></div>
${box('Biggest difference', 'SQL Server’s indexed view is updated <b>with every write</b>; PostgreSQL’s materialized view is a <b>snapshot</b> you refresh yourself.', 'lam')}` },

  { t: 'In a real project: CuongThai + Prisma', body: `
${two(`<div>${sql(`generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["views"]
}

view NoteSummary {
  userId    Int    @unique @map("user_id")
  email     String
  soNote    BigInt @map("so_note")
  tongViews BigInt @map("tong_views")
  @@map("note_summary")
}`, { sm: true, lang: 'typescript', hl: [3] })}
${zm(psql(`$ npx prisma validate
The schema … is valid 🚀   (Prisma 5.22.0)`, { sm: true }), 1.1)}</div>`,
    `<div>${box('How Prisma sees views', 'A <code class="i">view</code> block is <b>read-only</b> and is an opt-in <b>preview</b> feature (<code class="i">previewFeatures = ["views"]</code>, checked on Prisma 5.22). You still create the view with <b>hand-written SQL</b> in a migration.', 'lam')}
${box('A real finding', 'CuongThai’s <code class="i">prisma/migrations</code> contain <b>no <code class="i">CREATE VIEW</code> at all</b> today. Reports use Prisma <code class="i">include</code>/<code class="i">groupBy</code> or <code class="i">$queryRaw</code>. A view such as <code class="i">note_summary</code> would be a clean fit for a dashboard query used in several places.', 'ok')}</div>`)}` },

  { t: 'Your turn: viral_notes with a guard', body: `
<p style="font-size:22px;margin:0">Create a view <code class="i">viral_notes</code> of notes with <b>80+ views</b>. Make it writable, but so that nobody can <b>lower</b> a note below 80 through it. Test: raise note 60, then try to set it to 10.</p>
${two(zm(run(`CREATE VIEW viral_notes AS
  SELECT id, user_id, title, body, views
  FROM notes WHERE views >= 80
  WITH CHECK OPTION;
SELECT count(*) AS so_note_viral FROM viral_notes;
UPDATE viral_notes SET views = views + 1 WHERE id = 60;
UPDATE viral_notes SET views = 10 WHERE id = 60;`, ` so_note_viral
---------------
           105
UPDATE 1
ERROR:  new row violates check option for view
        "viral_notes"`, { sm: true, hl: [4], hlOut: [4, 5] }), 1.0),
  zm(psql(`SELECT id, views FROM viral_notes WHERE id = 60;
 id | views
----+-------
 60 |   100

SELECT id, views FROM notes WHERE id = 60;
 id | views
----+-------
 60 |   100`, { sm: true, hl: [4, 8] }), 1.15))}
<p style="font-size:19px;margin:0">99 → 100 is accepted (still viral). 100 → 10 would take the row <b>out</b> of the view: <code class="i">CHECK OPTION</code> refuses, and the table keeps 100.</p>` },

  { t: 'Self-check', to: true, giua: true, body: `
<ol>
<li>How many bytes does a view occupy on disk, and why is it always fresh?</li>
<li>You update a row through a writable view and it <b>disappears</b> from the view. What happened, and what prevents it?</li>
<li>A role has <code class="i">SELECT</code> on a view but not on the base table. When can it still read the data — and what flips that?</li>
</ol>
${box('Answers', '1) <b>0 bytes</b>: it stores the definition, and each read re-runs it on the current tables. 2) The new row no longer satisfies the view’s <code class="i">WHERE</code>; add <code class="i">WITH CHECK OPTION</code>. 3) By default the view runs with its <b>owner’s</b> rights, so yes; <code class="i">security_invoker = true</code> makes it use the <b>caller’s</b> rights, so no.', 'ok')}` },

  { t: 'Summary — and what comes next', to: true, giua: true, body: `
<ul>
<li>A <b>view</b> = a saved query: <b>0 bytes</b>, always fresh, planned <b>together</b> with your query.</li>
<li><b>Writable</b> when it is one simple table; add <code class="i">WITH CHECK OPTION</code> so rows cannot escape; <code class="i">INSTEAD OF</code> for the rest.</li>
<li>Views <b>hide columns</b> and rows; mind <code class="i">security_invoker</code> and <code class="i">security_barrier</code>.</li>
<li>Traps: frozen <code class="i">SELECT *</code>, strict <code class="i">CREATE OR REPLACE</code>, dependencies.</li>
</ul>
${box('Next: lesson 12.4 — Materialized views', 'When the query is <b>expensive</b> and the answer may be a little old: store the rows, and decide <b>when to refresh</b>.', 'lam')}` },
]);
