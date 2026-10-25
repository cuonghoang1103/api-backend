/**
 * pg-12-1 — PostgreSQL · Chapter 12 · Lesson 12.1 "Functions: SQL, PL/pgSQL and volatility" (slide EN, kiểu FU, 26/10/2026, agent c12).
 * Nguồn: content/courses/postgresql/s12-ham-trigger-view.mjs › postgresql-12-1-ham. Output = chạy thật PostgreSQL 17.11 (container pgcourse17,
 * schema ch12): video-bai-giang/src/khung/pg/that/pg-12-1.sql + pg-12-1.out.txt (psql -X -a).
 * Bổ sung so với web: máy bán hàng (đời thường), một chuyến đi-về thay N chuyến, bản vẽ CREATE FUNCTION, nội tuyến (inline) CHỈ với thân
 * biểu thức hoặc hàm trả bảng (note_count có SELECT … FROM KHÔNG nội tuyến), STABLE gọi 6 lần (1 lần ước lượng + 5), chỉ mục biểu thức đòi IMMUTABLE,
 * hàm IMMUTABLE nói dối (chỉ mục trả 0 dòng, quét bảng trả 25), RETURNS TABLE/SETOF + LATERAL, RAISE/EXCEPTION/ERRCODE, PROCEDURE + COMMIT
 * (và lỗi invalid transaction termination), SECURITY DEFINER + search_path (hijack thật), đo 1 triệu dòng, ô SQL Server, migration tay của CuongThai.
 */
import { lamDeck, sql, psql, run, tbl, two, box, kw, cards, steps, vsd, c } from './_pg-chung.mjs';
import { XANH, hamHopPic, volPic, callsPic, lePic, thanhPic, definerPic, spPic } from './pg-12-hinh.mjs';

const zm = (h, z = 1.2) => `<div style="zoom:${z}">${h}</div>`;
export const deck = { key: 'pg-12-1', code: 'PG 12.1', title: 'Functions: SQL, PL/pgSQL and volatility', sub: 'CREATE FUNCTION · RAISE · PROCEDURE · SECURITY DEFINER' };

export const slides = lamDeck({ chuong: 'Chapter 12 — Functions, triggers & views', bai: '12.1' }, [
  { cover: true, t: 'Functions:<br>logic that lives next to the data', sub: 'SQL and PL/pgSQL functions, volatility,<br>procedures, SECURITY DEFINER' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Write a <b>SQL function</b> and a <b>PL/pgSQL function</b> — and know which to reach for first</li>
<li><b>Volatility</b>: <code class="i">IMMUTABLE</code> / <code class="i">STABLE</code> / <code class="i">VOLATILE</code> decide how often PostgreSQL really calls you</li>
<li>Return rows: <code class="i">RETURNS TABLE</code>, <code class="i">SETOF</code>, errors with <code class="i">RAISE EXCEPTION</code></li>
<li><b>Procedures</b> (<code class="i">CALL</code>, <code class="i">COMMIT</code> inside) and <b>SECURITY DEFINER</b> with a safe <code class="i">search_path</code></li>
<li>And — honestly — <b>when NOT</b> to put logic in the database</li>
</ul>
${box('Remember from Chapter 9', 'An <b>expression index</b> such as <code class="i">ON t (lower(email))</code> only works if the function is promised never to change its mind. Today you learn what that promise is.', 'lam')}` },

  { t: 'Everyday example first: a function is a machine', giua: true, body: `
${hamHopPic()}
<p style="font-size:21px;margin:0">Put a coin in, press a button, get a snack — you never see inside. A <b>function</b> is the same: <b>arguments</b> go in, <b>one result</b> comes out, and the recipe is stored in the database. Anyone who connects can use it, not only the one app that installed it.</p>` },

  { t: 'The data for the whole lesson', giua: true, body: `
${two(zm(sql(`CREATE TABLE users (
  id serial PRIMARY KEY,
  email text UNIQUE NOT NULL);
CREATE TABLE notes (
  id serial PRIMARY KEY,
  user_id int NOT NULL REFERENCES users(id),
  title text NOT NULL, body text NOT NULL,
  views int NOT NULL DEFAULT 0, ...);
-- 20 users, 500 notes, views = (id*37) % 101
UPDATE notes SET views = (id * 37) % 101;`, { sm: true, hl: [10] }), 1.0),
  zm(psql(`UPDATE 500
 users
-------
    20
(1 row)

 notes | tong_views
-------+------------
   500 |      25014
(1 row)`, { sm: true }), 1.2))}
<p style="font-size:21px;margin:0">Views are <b>deterministic</b> (<code class="i">(id × 37) mod 101</code>), so every number in this chapter can be reproduced exactly. All output was run on PostgreSQL 17.11.</p>` },

  { t: 'The simplest kind: a SQL function', body: `
${two(zm(sql(`CREATE FUNCTION note_count(uid int)
  RETURNS bigint
  LANGUAGE sql STABLE
  AS $$ SELECT count(*)
        FROM notes
        WHERE user_id = uid $$;

SELECT u.email, note_count(u.id)
FROM users u ORDER BY u.id LIMIT 3;`, { sm: true, hl: [1, 3, 5] }), 1.12),
  zm(psql(`CREATE FUNCTION
       email       | note_count
-------------------+------------
 user1@example.com |         25
 user2@example.com |         25
 user3@example.com |         25
(3 rows)`, { sm: true }), 1.25))}
${steps([
    '<b>name + parameters</b> — <code class="i">note_count(uid int)</code>',
    '<b>RETURNS</b> — the type of the single result; <b>LANGUAGE</b> — how the body is read (<code class="i">sql</code>)',
    '<b>volatility</b> — <code class="i">STABLE</code> (more on this soon) · body between <code class="i">$$ … $$</code> (dollar quoting: no escaping of inner quotes)',
  ])}` },

  { t: 'Inlining: when a SQL function disappears', body: `
${two(zm(run(`-- body is ONE expression
CREATE FUNCTION gia_sau_giam(gia numeric, pct int)
  RETURNS numeric LANGUAGE sql IMMUTABLE
  AS $$ SELECT round(gia*(100-pct)/100.0, 0) $$;
EXPLAIN (VERBOSE, COSTS OFF)
SELECT gia_sau_giam(views*1000, 10)
FROM notes WHERE id = 7;`, ` Index Scan using notes_pkey on ch12.notes
   Output: round(((((views * 1000))::numeric
     * '90'::numeric) / 100.0), 0)
   Index Cond: (notes.id = 7)`, { sm: true, hl: [3], hlOut: [2] }), 1.1),
  zm(run(`-- body has SELECT ... FROM a table
EXPLAIN (VERBOSE, COSTS OFF)
SELECT * FROM users u
WHERE note_count(u.id) > 24;`, ` Seq Scan on ch12.users u
   Output: id, email
   Filter: (note_count(u.id) > 24)`, { sm: true, hlOut: [3] }), 1.1))}
${box('Reading the two plans', 'In the left plan the function <b>vanished</b>: its expression was pasted into the query, so the planner can optimise everything together. On the right <code class="i">note_count(u.id)</code> stays a <b>black-box call per row</b> — a scalar function whose body reads a table is not pasted in. A PL/pgSQL body is <b>never</b> inlined.', 'lam')}` },

  { t: 'PL/pgSQL: when you need variables and branches', body: `
${two(zm(sql(`CREATE FUNCTION xep_hang(v int) RETURNS text
  LANGUAGE plpgsql IMMUTABLE AS $$
DECLARE nhan text;
BEGIN
  IF v >= 80 THEN nhan := 'viral';
  ELSIF v >= 40 THEN nhan := 'popular';
  ELSIF v > 0 THEN nhan := 'seen';
  ELSE nhan := 'unread';
  END IF;
  RETURN nhan;
END; $$;

SELECT xep_hang(views) AS hang, count(*)
FROM notes GROUP BY 1 ORDER BY 2 DESC;`, { sm: true, hl: [4, 5] }), 1.1),
  zm(psql(`CREATE FUNCTION
  hang   | count
---------+-------
 popular |   198
 seen    |   194
 viral   |   104
 unread  |     4
(4 rows)`, { sm: true }), 1.3))}
<p style="font-size:21px;margin:0"><b>PL/pgSQL</b> = SQL plus real programming: <code class="i">DECLARE</code> variables, <code class="i">IF</code>, loops, exceptions. Use <code class="i">LANGUAGE sql</code> first; switch to PL/pgSQL only when you truly need those. <code class="i">:=</code> assigns.</p>` },

  { t: 'PL/pgSQL toolbox — and what BEGIN is NOT', body: `
${two(zm(run(`CREATE FUNCTION tong_ba_note_dau(uid int)
RETURNS int LANGUAGE plpgsql STABLE AS $$
DECLARE r record; tong int := 0; i int := 0;
BEGIN
  FOR r IN SELECT id, views FROM notes
    WHERE user_id = uid
    ORDER BY views DESC LIMIT 3 LOOP
    i := i + 1;  tong := tong + r.views;
    RAISE NOTICE 'vong % : note % co % luot xem',
                 i, r.id, r.views;
  END LOOP;
  RETURN tong;
END; $$;
SELECT tong_ba_note_dau(1);`, `NOTICE:  vong 1 : note 60 co 99 luot xem
NOTICE:  vong 2 : note 120 co 97 luot xem
NOTICE:  vong 3 : note 180 co 95 luot xem
 tong_ba_note_dau
------------------
              291`, { sm: true, hl: [5, 9] }), 0.95),
  `<div>${box('BEGIN … END is not a transaction', 'In PL/pgSQL it only marks a <b>block of statements</b>. A function always runs inside the <b>caller’s</b> transaction.', 'do2')}
${zm(run(`CREATE FUNCTION thu_commit()
 RETURNS void LANGUAGE plpgsql
 AS $$ BEGIN COMMIT; END $$;
SELECT thu_commit();`, `ERROR:  invalid transaction termination
CONTEXT:  PL/pgSQL function thu_commit()
  line 1 at COMMIT`, { sm: true, hlOut: [1] }), 1.0)}
<p style="font-size:19px;margin:6px 0 0"><code class="i">RAISE NOTICE</code> prints a message to the client — your <code class="i">printf</code> for debugging.</p></div>`)}` },

  { t: 'Volatility: a promise you make to the planner', giua: true, body: `
${volPic()}
<p style="font-size:21px;margin:0">Every function carries one of three labels. It is <b>not documentation</b>: the planner <b>acts</b> on it. The default is <code class="i">VOLATILE</code> — the most expensive label — so a function you forgot to label is treated as the worst case.</p>` },

  { t: 'Measure it: how many times is the function called?', body: `
${zm(sql(`-- three twins: same body, RAISE NOTICE 'goi …', only the label differs
SELECT count(*) FROM (SELECT * FROM notes LIMIT 5) t WHERE id > dem_goi_volatile(0);
SELECT count(*) FROM (SELECT * FROM notes LIMIT 5) t WHERE id > dem_goi_stable(0);
SELECT count(*) FROM (SELECT * FROM notes LIMIT 5) t WHERE id > dem_goi_immutable(0);`, { sm: true }), 0.82)}
${callsPic()}
${box('Why STABLE is 6, not 5', 'The planner calls a STABLE function <b>once while estimating</b> how many rows will match, then the executor calls it for each of the 5 rows. IMMUTABLE collapses to a constant at planning time: <b>1 call</b> instead of 5.', 'lam')}` },

  { t: 'Only IMMUTABLE may sit inside an index', body: `
${two(zm(run(`CREATE INDEX notes_hang_bad
  ON notes (dem_goi_volatile(views));
CREATE INDEX notes_hang_bad2
  ON notes (dem_goi_stable(views));
CREATE INDEX notes_hang_idx
  ON notes (xep_hang(views));`, `ERROR:  functions in index expression must be marked IMMUTABLE
ERROR:  functions in index expression must be marked IMMUTABLE
CREATE INDEX`, { sm: true, hlOut: [1, 2] }), 1.1),
  zm(run(`EXPLAIN (COSTS OFF) SELECT count(*)
FROM notes WHERE xep_hang(views) = 'unread';`, ` Aggregate
   ->  Bitmap Heap Scan on notes
         Recheck Cond: (xep_hang(views) = 'unread'::text)
         ->  Bitmap Index Scan on notes_hang_idx
               Index Cond: (xep_hang(views) = 'unread'::text)`, { sm: true, hlOut: [4, 5] }), 1.0))}
<p style="font-size:21px;margin:0">An index stores answers <b>computed once</b>, so the function must give the same answer tomorrow. PostgreSQL enforces the <b>label</b>, not the <b>truth</b> — the next slide shows what happens when the label lies.</p>` },

  { t: 'The trap: an IMMUTABLE function that lies', giua: true, body: `
${lePic()}
${two(zm(psql(`SET enable_seqscan = off;    -- force the index
SELECT count(*) AS qua_chi_muc ...
 qua_chi_muc
-------------
           0`, { sm: true, hl: [4, 5] }), 1.1), zm(psql(`SET enable_indexscan = off;   -- force a table scan
SELECT count(*) AS qua_quet_bang ...
 qua_quet_bang
---------------
            25`, { sm: true, hl: [4, 5] }), 1.1))}` },

  { t: 'Returning rows: RETURNS TABLE and SETOF', body: `
${two(zm(sql(`CREATE FUNCTION top_note(uid int, n int DEFAULT 3)
RETURNS TABLE (id int, title text, views int)
LANGUAGE sql STABLE AS $$
  SELECT id, title, views FROM notes
  WHERE user_id = uid
  ORDER BY views DESC, id LIMIT n $$;

SELECT * FROM top_note(1);
SELECT u.email, t.title, t.views
FROM users u CROSS JOIN LATERAL top_note(u.id, 1) t
WHERE u.id <= 3 ORDER BY u.id;`, { sm: true, hl: [2, 8] }), 1.05),
  zm(psql(` id  |  title   | views
-----+----------+-------
  60 | Note 60  |    99
 120 | Note 120 |    97
 180 | Note 180 |    95
(3 rows)

       email       |  title   | views
-------------------+----------+-------
 user1@example.com | Note 60  |    99
 user2@example.com | Note 161 |    99
 user3@example.com | Note 262 |    99`, { sm: true }), 1.12))}
<p style="font-size:20px;margin:0">The function behaves like a <b>table</b> in <code class="i">FROM</code>. <code class="i">LATERAL</code> lets it use columns of the table to its left. <code class="i">RETURNS SETOF notes</code> returns whole rows of an existing table. A SQL function used this way is <b>inlined</b> — <code class="i">EXPLAIN</code> shows <code class="i">Limit → Sort → Seq Scan</code>, no function node.</p>` },

  { t: 'Errors you raise yourself: RAISE and EXCEPTION', body: `
${two(zm(sql(`CREATE FUNCTION tru_kho(pid int, qty int) RETURNS int
LANGUAGE plpgsql AS $$
DECLARE con int;
BEGIN
  IF qty <= 0 THEN
    RAISE EXCEPTION 'qty phai duong, nhan %', qty
      USING ERRCODE = '22023';
  END IF;
  UPDATE product SET stock = stock - qty
    WHERE id = pid RETURNING stock INTO con;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'khong co san pham %', pid; END IF;
  RETURN con;
EXCEPTION WHEN check_violation THEN
  RAISE EXCEPTION 'khong du hang (san pham %, can %)',
    pid, qty USING HINT = 'kiem tra ton kho truoc';
END; $$;`, { sm: true, hl: [6, 14] }), 0.9),
  zm(psql(`SELECT tru_kho(1, 4);
 con_lai
---------
       6
SELECT tru_kho(2, 5);
ERROR:  khong du hang (san pham 2, can 5)
HINT:  kiem tra ton kho truoc
SELECT tru_kho(99, 1);
ERROR:  khong co san pham 99
SELECT tru_kho(1, 0);
ERROR:  qty phai duong, nhan 0`, { sm: true }), 1.2))}
<p style="font-size:19px;margin:0"><code class="i">RAISE EXCEPTION</code> aborts the statement; <code class="i">FOUND</code> tells whether the last <code class="i">UPDATE</code> touched a row; the <code class="i">CHECK (stock &gt;= 0)</code> from Chapter 3 is caught by name in <code class="i">EXCEPTION WHEN</code>. ⚠ A block with <code class="i">EXCEPTION</code> opens a hidden <b>sub-transaction</b> — fine once, costly in a tight loop.</p>` },

  { t: 'PROCEDURE: the one that may COMMIT', body: `
${two(zm(sql(`CREATE PROCEDURE chuyen_kho_note(batch int)
LANGUAGE plpgsql AS $$
DECLARE n int;
BEGIN
  LOOP
    WITH d AS (DELETE FROM notes WHERE id IN (
      SELECT id FROM notes WHERE views = 0
      ORDER BY id LIMIT batch) RETURNING *)
    INSERT INTO note_archive SELECT * FROM d;
    GET DIAGNOSTICS n = ROW_COUNT;
    EXIT WHEN n = 0;
    RAISE NOTICE 'da chuyen % note', n;
    COMMIT;
  END LOOP;
END $$;`, { sm: true, hl: [13] }), 1.0),
  zm(psql(`BEGIN;
CALL chuyen_kho_note(3);
NOTICE:  da chuyen 3 note
ERROR:  invalid transaction termination
CONTEXT:  ... line 10 at COMMIT
ROLLBACK;

CALL chuyen_kho_note(3);
NOTICE:  da chuyen 3 note
NOTICE:  da chuyen 1 note
CALL
 notes | archive
-------+---------
   496 |       4`, { sm: true, hl: [4, 5] }), 1.1))}
<p style="font-size:19px;margin:0">A <b>procedure</b> is called with <code class="i">CALL</code>, returns no value, and — alone among functions — may <code class="i">COMMIT</code>/<code class="i">ROLLBACK</code> inside. Perfect for long batch jobs that must not hold one huge transaction. Inside an <b>outer</b> <code class="i">BEGIN</code> it refuses: <i>invalid transaction termination</i>.</p>` },

  { t: 'SECURITY DEFINER: a controlled doorway', giua: true, body: `
${definerPic()}
${zm(sql(`CREATE FUNCTION dem_user_an_toan() RETURNS bigint LANGUAGE sql SECURITY DEFINER
  SET search_path = ch12, pg_temp AS $$ SELECT count(*) FROM users $$;
REVOKE ALL ON FUNCTION dem_user_an_toan() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION dem_user_an_toan() TO ch12_reader;`, { sm: true }), 0.9)}
${zm(psql(`SET ROLE ch12_reader;
SELECT * FROM users LIMIT 1;
ERROR:  permission denied for table users
SELECT dem_user_an_toan();
 dem_user_an_toan
------------------
               20`, { sm: true, hl: [3] }), 0.9)}` },

  { t: 'The search_path trap of SECURITY DEFINER', giua: true, body: `
${spPic()}
${zm(psql(`SET ROLE ch12_reader;  SET search_path = ch12_xau, ch12;
SELECT dem_user_lo();       -- unqualified "users"      ⇒  3
SELECT dem_user_an_toan();  -- search_path pinned        ⇒  20`, { sm: true, hl: [2] }), 1.1)}` },

  { t: 'Speed: what a function call costs per row', body: `
${thanhPic([['plain expression', 51, XANH, 'th-a'], ['SQL function (inlined)', 48, XANH, 'th-b'], ['PL/pgSQL function', 325, '#c0392b', 'th-c']], { titleTxt: 'sum(…) over 1,000,000 rows — EXPLAIN ANALYZE, parallel off', max: 360 })}
<div style="zoom:1.12">${two(box('Use a function when…', 'the logic is a <b>reusable rule</b> (a price, a status label), must be the <b>same for every client</b>, or lets you <b>keep a batch next to the data</b> instead of 1000 round trips.', 'ok'),
    box('Think twice when…', 'it hides <b>business rules</b> nobody can find from the app code, needs <b>per-row PL/pgSQL on millions of rows</b> (6× slower above), or makes debugging, versioning and testing harder than plain app code.', 'do2'))}</div>` },

  { t: 'Coming from SQL Server? T-SQL vs PL/pgSQL', body: `
<div style="zoom:1.1"><table class="t">
<tr><th>Idea</th><th>SQL Server (T-SQL)</th><th>PostgreSQL</th></tr>
<tr><td>Return a result set</td><td>stored procedure: <code class="i">SELECT …</code> inside it</td><td><b>function</b> <code class="i">RETURNS TABLE</code> / <code class="i">SETOF</code></td></tr>
<tr><td>Call it</td><td><code class="i">EXEC usp_x @a = 1</code></td><td><code class="i">SELECT * FROM f(1)</code> · <code class="i">CALL p(1)</code></td></tr>
<tr><td>Variables</td><td><code class="i">DECLARE @x int; SET @x = 1</code></td><td><code class="i">DECLARE x int; x := 1;</code></td></tr>
<tr><td>Error</td><td><code class="i">RAISERROR</code> · <code class="i">THROW</code> · <code class="i">TRY…CATCH</code></td><td><code class="i">RAISE EXCEPTION</code> · <code class="i">EXCEPTION WHEN …</code></td></tr>
<tr><td>Rows affected</td><td><code class="i">@@ROWCOUNT</code></td><td><code class="i">GET DIAGNOSTICS n = ROW_COUNT</code> · <code class="i">FOUND</code></td></tr>
<tr><td>Commit in the body</td><td>procedures can <code class="i">BEGIN TRAN</code>/<code class="i">COMMIT</code></td><td>only <b>procedures</b> (<code class="i">CALL</code>), never functions</td></tr>
</table></div>
${box('The biggest mental switch', 'In T-SQL a <b>stored procedure</b> does most things. In PostgreSQL, <b>functions</b> are the workhorse (they compose inside queries), and <b>procedures</b> exist mainly for transaction control.', 'lam')}` },

  { t: 'In a real project: CuongThai + Prisma', body: `
${two(`<div>${sql(`-- prisma/migrations/20260623120000_add_project_search_index/migration.sql
CREATE OR REPLACE FUNCTION projects_touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updated_at" = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;`, { sm: true })}
<p style="font-size:19px;margin:8px 0 0">Prisma’s schema has <b>no syntax</b> for functions or triggers. You write them as <b>hand-made SQL</b> inside a migration file, and <code class="i">prisma migrate deploy</code> applies it like any other.</p></div>`,
    `<div>${sql(`// calling a database function from Node
const rows = await prisma.$queryRaw\`
  SELECT * FROM top_note(\${userId}, 3)\`;`, { sm: true, lang: 'typescript' })}
${box('A real finding', 'That CuongThai migration defines <code class="i">projects_touch_updated_at()</code> — but <b>no trigger uses it</b>: the file never runs <code class="i">CREATE TRIGGER</code>. The 316 <code class="i">@updatedAt</code> fields are filled by the <b>Prisma client</b>, not by the database. Lesson 12.2 shows the difference.', 'do2')}</div>`)}` },

  { t: 'Your turn: viral_pct(uid)', body: `
<p style="font-size:22px;margin:0">Write a function <code class="i">viral_pct(uid)</code>: the <b>percentage of a user’s notes with 80+ views</b>, one decimal. Pick the right <b>language</b> and <b>volatility</b>. Then ask: what does it return for a user that does not exist?</p>
${two(zm(run(`CREATE FUNCTION viral_pct(uid int)
  RETURNS numeric LANGUAGE sql STABLE AS $$
  SELECT round(100.0 * count(*)
    FILTER (WHERE views >= 80)
    / count(*), 1)
  FROM notes WHERE user_id = uid $$;
SELECT u.id, viral_pct(u.id) FROM users u
WHERE u.id <= 4 ORDER BY u.id;
SELECT viral_pct(99);`, ` id | viral_pct
----+-----------
  1 |      32.0
  2 |      24.0
  3 |      16.0
  4 |      12.0

ERROR:  division by zero
CONTEXT:  SQL function "viral_pct" statement 1`, { sm: true, hlOut: [10] }), 0.85),
  zm(run(`-- fix: NULLIF turns 0 into NULL
CREATE OR REPLACE FUNCTION viral_pct(uid int)
  RETURNS numeric LANGUAGE sql STABLE AS $$
  SELECT round(100.0 * count(*)
    FILTER (WHERE views >= 80)
    / NULLIF(count(*), 0), 1)
  FROM notes WHERE user_id = uid $$;
SELECT viral_pct(99) AS khong_co_user;`, ` khong_co_user
---------------

(1 row)`, { sm: true, hl: [6] }), 0.85))}
<p style="font-size:18px;margin:0">Why <code class="i">LANGUAGE sql</code>? One query, no branching. Why <code class="i">STABLE</code>? It reads a table but never writes. The <code class="i">NULLIF(…, 0)</code> trick was in Chapter 6: it avoids dividing by zero.</p>` },

  { t: 'Self-check', to: true, giua: true, body: `
<ol>
<li>A function reads a table and gives the same value for the same argument inside one query. Which label is honest — and which is the <b>dangerous lie</b>?</li>
<li>Why can <code class="i">CALL some_procedure()</code> run <code class="i">COMMIT</code> but <code class="i">SELECT some_function()</code> cannot?</li>
<li>A <code class="i">SECURITY DEFINER</code> function forgets <code class="i">SET search_path</code>. How could a caller make it read the wrong table?</li>
</ol>
${box('Answers', '1) <b>STABLE</b> is honest; <b>IMMUTABLE</b> is the lie (an index on it can go stale). 2) A function always runs inside the caller’s transaction; a procedure is allowed to end/start transactions. 3) The caller puts their own schema first in <code class="i">search_path</code>; an unqualified name then resolves to their look-alike table, read with the owner’s rights.', 'ok')}` },

  { t: 'Summary — and what comes next', to: true, giua: true, body: `
<ul>
<li><b>SQL function</b> first (can be inlined); <b>PL/pgSQL</b> for variables, loops, errors — never inlined.</li>
<li><b>IMMUTABLE ⊂ STABLE ⊂ VOLATILE</b>: the planner trusts the label. Unsure ⇒ the less strict one.</li>
<li><code class="i">RETURNS TABLE</code> / <code class="i">SETOF</code> make a function a table in <code class="i">FROM</code>; <code class="i">RAISE EXCEPTION</code> raises your own errors.</li>
<li><b>Procedures</b> may COMMIT; <b>SECURITY DEFINER</b> always pins <code class="i">search_path</code>.</li>
</ul>
${box('Next: lesson 12.2 — Triggers', 'A trigger is a function the database calls <b>for you</b> when a row changes — the doorbell that rings no matter who pushes it.', 'lam')}` },
]);
