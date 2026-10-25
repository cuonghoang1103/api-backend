/**
 * pg-12-2 — PostgreSQL · Chapter 12 · Lesson 12.2 "Triggers: automation the application cannot forget" (slide EN, kiểu FU, 26/10/2026, agent c12).
 * Nguồn: content/courses/postgresql/s12-ham-trigger-view.mjs › postgresql-12-2-trigger. Output = chạy thật PostgreSQL 17.11 (container pgcourse17,
 * schema ch12): video-bai-giang/src/khung/pg/that/pg-12-2.sql + pg-12-2.out.txt (psql -X -a).
 * Bổ sung so với web: chuông cửa (đời thường), giải phẫu CREATE TRIGGER, NEW/OLD theo sự kiện, thứ tự bắn 4 trigger (AFTER ROW chỉ chạy CUỐI câu lệnh),
 * <> với NULL vs IS DISTINCT FROM, WHEN + UPDATE OF, transition table (REFERENCING NEW TABLE) vs inserted/deleted của SQL Server, BEFORE trả NULL
 * (INSERT 0 0) và trigger chặn có chủ đích, đệ quy (stack depth limit exceeded, hai cách sửa), trừ kho trong cùng giao dịch, đo 200.000 dòng
 * (312 ms vs 1.888 ms), DISABLE TRIGGER / pg_trigger, @updatedAt của Prisma do client điền.
 */
import { lamDeck, sql, psql, run, tbl, two, box, kw, cards, steps, vsd } from './_pg-chung.mjs';
import { XANH, DO, CAM, PG, chuongPic, giaiPhauPic, newOldPic, thuTuPic, dequyPic, khoPic, thanhPic } from './pg-12-hinh.mjs';

const zm = (h, z = 1.2) => `<div style="zoom:${z}">${h}</div>`;
export const deck = { key: 'pg-12-2', code: 'PG 12.2', title: 'Triggers: automation the application cannot forget', sub: 'BEFORE · AFTER · NEW · OLD · WHEN · recursion' };

export const slides = lamDeck({ chuong: 'Chapter 12 — Functions, triggers & views', bai: '12.2' }, [
  { cover: true, t: 'Triggers:<br>the doorbell that rings for you', sub: 'BEFORE / AFTER, NEW and OLD, audit logs,<br>and the traps that bite' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>What a <b>trigger</b> is: a function the database calls <b>for you</b> when a row changes</li>
<li><code class="i">BEFORE</code> vs <code class="i">AFTER</code>, <code class="i">FOR EACH ROW</code> vs <code class="i">FOR EACH STATEMENT</code> — and the <b>real order</b> they fire in</li>
<li><code class="i">NEW</code> and <code class="i">OLD</code>, an <b>updated_at</b> stamp and an <b>audit log</b> that only records real changes</li>
<li><code class="i">WHEN</code>, transition tables, and how it compares with SQL Server’s <code class="i">inserted</code>/<code class="i">deleted</code></li>
<li>The traps: <b>BEFORE returning NULL</b>, <b>recursion</b>, <b>hidden cost</b> — and when a trigger is the wrong tool</li>
</ul>
${box('Remember from 12.1', 'A trigger is a <b>function</b> with a special return type. Everything you learned about PL/pgSQL, <code class="i">RAISE</code> and volatility applies — plus two new variables, <code class="i">NEW</code> and <code class="i">OLD</code>.', 'lam')}` },

  { t: 'Everyday example first: a doorbell', giua: true, body: `
${chuongPic()}` },

  { t: 'Anatomy: two objects make a trigger', giua: true, body: `
${giaiPhauPic()}
<p style="font-size:21px;margin:0">First you write a function that <b>RETURNS trigger</b>; then <code class="i">CREATE TRIGGER</code> glues it to a table and an event. Inside the function PostgreSQL gives you <code class="i">NEW</code>, <code class="i">OLD</code> and information variables such as <code class="i">TG_OP</code>.</p>` },

  { t: 'Why a trigger? Because nothing else is bulletproof', giua: true, body: `
${two(zm(run(`-- no trigger yet: a quick fix typed in psql
UPDATE notes SET title = 'Note 1 (da sua)'
WHERE id = 1;
SELECT id, title,
  updated_at = created_at AS chua_doi
FROM notes WHERE id = 1;`, ` id |      title      | chua_doi
----+-----------------+----------
  1 | Note 1 (da sua) | t
(1 row)`, { sm: true, hlOut: [3] }), 1.2),
  `<div>${box('The stamp that nobody updated', 'The title changed, but <code class="i">updated_at</code> still equals <code class="i">created_at</code> (<b>t</b> = still unchanged). The app might remember; a <b>psql fix</b>, a migration script or an admin tool will not.', 'do2')}
${box('A trigger sits BELOW every client', 'It cannot be bypassed by a forgetful writer — that is the whole reason to use one: <b>completeness</b>, not convenience.', 'ok')}</div>`)}` },

  { t: 'The classic: updated_at in four lines', giua: true, body: `
${two(zm(sql(`CREATE FUNCTION set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END; $$;

CREATE TRIGGER notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();`, { sm: true, hl: [4, 5, 8, 9] }), 1.2),
  `<div>${zm(psql(`UPDATE notes SET title = 'Note 1 (đã sửa)'
WHERE id = 1;
UPDATE 1
 id |      title      | bang_nhau | moi_hon
----+-----------------+-----------+---------
  1 | Note 1 (đã sửa) | f         | t
(1 row)`, { sm: true, hl: [6] }), 1.2)}
<p style="font-size:21px;margin:6px 0 0">We never mentioned <code class="i">updated_at</code> in the UPDATE — the trigger stamped it. It must be <b>BEFORE</b>: only a BEFORE row trigger can <b>change the row</b> by assigning to <code class="i">NEW</code>.</p></div>`)}` },

  { t: 'NEW and OLD: which exist when', giua: true, body: `
${newOldPic()}
<p style="font-size:21px;margin:0"><code class="i">TG_OP</code> tells you which event fired: <code class="i">'INSERT'</code>, <code class="i">'UPDATE'</code>, <code class="i">'DELETE'</code>. For UPDATE you compare the two versions of the row — that is how an audit trigger knows what really changed.</p>` },

  { t: 'BEFORE or AFTER? A decision, not a style', to: true, giua: true, body: `
${two(box('BEFORE … FOR EACH ROW', 'Runs <b>before</b> the row is written. Can <b>change</b> the row (assign to <code class="i">NEW</code>) or <b>cancel</b> it (<code class="i">RETURN NULL</code>). Use for: stamps, defaults, validation, normalising values.', 'lam'),
    box('AFTER … FOR EACH ROW', 'Runs <b>after</b> the row is written. The row is final; you can only cause <b>side effects</b>. Use for: audit rows, counters elsewhere, notifications.', 'ok'))}
${box('Statement-level', '<code class="i">FOR EACH STATEMENT</code> fires <b>once per command</b>, even when 0 or 10,000 rows change — and has no <code class="i">NEW</code>/<code class="i">OLD</code> row (but see transition tables).', '')}` },

  { t: 'The real firing order (UPDATE of 2 rows)', body: `
${thuTuPic()}
${zm(psql(`UPDATE thu SET v = v + 1 WHERE id <= 2;
NOTICE:  1  | BEFORE STATEMENT | UPDATE | id=-
NOTICE:  2  | BEFORE ROW | UPDATE | id=1
NOTICE:  2  | BEFORE ROW | UPDATE | id=2
NOTICE:  3  | AFTER ROW | UPDATE | id=1
NOTICE:  3  | AFTER ROW | UPDATE | id=2
NOTICE:  4  | AFTER STATEMENT | UPDATE | id=-
UPDATE 2`, { sm: true, hl: [4, 5, 6] }), 1.05)}` },

  { t: 'An audit log that records only REAL changes', body: `
${two(zm(sql(`CREATE FUNCTION audit_notes() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'UPDATE'
     AND NEW.views IS DISTINCT FROM OLD.views THEN
    INSERT INTO note_audit (note_id, hanh_dong,
                            views_cu, views_moi)
    VALUES (OLD.id, TG_OP, OLD.views, NEW.views);
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO note_audit (note_id, hanh_dong, views_cu)
    VALUES (OLD.id, TG_OP, OLD.views);
    RETURN OLD;
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER notes_audit AFTER UPDATE OR DELETE ON notes
  FOR EACH ROW EXECUTE FUNCTION audit_notes();`, { sm: true, hl: [4, 5, 9] }), 0.95),
  `<div>${box('Why AFTER?', 'The audit row must describe a change that really <b>happened</b>. And it is in the <b>same transaction</b>: if the INSERT into <code class="i">note_audit</code> fails, the original UPDATE fails too.', 'lam')}
${box('Why IS DISTINCT FROM?', 'It is the NULL-safe “not equal”. See next slide.', 'ok')}
<p style="font-size:20px;margin:6px 0 0">A <code class="i">DELETE</code> trigger returns <code class="i">OLD</code>; an <code class="i">UPDATE</code>/<code class="i">INSERT</code> trigger returns <code class="i">NEW</code>.</p></div>`)}` },

  { t: 'Three statements, THREE audit rows — not four', body: `
${two(zm(run(`UPDATE notes SET views = views + 5
  WHERE id IN (1, 2);
UPDATE notes SET title = title WHERE id = 3;
DELETE FROM notes WHERE id = 500;
SELECT note_id, hanh_dong, views_cu, views_moi
FROM note_audit ORDER BY id;`, `UPDATE 2
UPDATE 1
DELETE 1
 note_id | hanh_dong | views_cu | views_moi
---------+-----------+----------+-----------
       1 | UPDATE    |       37 |        42
       2 | UPDATE    |       74 |        79
     500 | DELETE    |       17 |
(3 rows)`, { sm: true, hlOut: [5, 6, 7] }), 1.08),
  `<div>${zm(run(`SELECT NULL <> 5 AS khac_ne,
  NULL IS DISTINCT FROM 5 AS khac_idf,
  NULL IS DISTINCT FROM NULL AS null_null;`, ` khac_ne | khac_idf | null_null
---------+----------+-----------
         | t        | f
(1 row)`, { sm: true, hlOut: [3] }), 1.0)}
<p style="font-size:20px;margin:8px 0 0">The pointless <code class="i">SET title = title</code> <b>still fires</b> the trigger (PostgreSQL does not compare rows for you) — but the guard sees no change, so nothing is logged. With <code class="i">&lt;&gt;</code> a NULL on either side gives <b>NULL</b>, not true: a change to or from NULL would be <b>silently missed</b>.</p></div>`)}` },

  { t: 'WHEN and UPDATE OF: filter before the function runs', body: `
${two(zm(sql(`CREATE TRIGGER notes_viral
  AFTER UPDATE OF views ON notes
  FOR EACH ROW
  WHEN (OLD.views < 80 AND NEW.views >= 80)
  EXECUTE FUNCTION canh_bao_viral();

UPDATE notes SET views = 85 WHERE id = 10;
UPDATE notes SET views = 90 WHERE id = 10;
UPDATE notes SET views = 50 WHERE id = 11;`, { sm: true, hl: [2, 4] }), 1.1),
  zm(psql(`UPDATE notes SET views = 85 WHERE id = 10;
NOTICE:  note 10 vua len viral (67 -> 85)
UPDATE 1
UPDATE notes SET views = 90 WHERE id = 10;
UPDATE 1
UPDATE notes SET views = 50 WHERE id = 11;
UPDATE 1`, { sm: true, hl: [2] }), 1.2))}
${cards([
    ['UPDATE OF views', 'Only fires when the <b>views</b> column appears in the SET list.'],
    ['WHEN (…)', 'Evaluated <b>before</b> calling the function: false ⇒ the function is never called. Cheaper than an <code class="i">IF</code> inside it.'],
    ['Result', '67 → 85 crosses 80 ⇒ alert. 85 → 90 and 50 do not ⇒ silence.'],
  ])}` },

  { t: 'Statement-level + transition tables', giua: true, body: `
${two(zm(sql(`CREATE FUNCTION log_bulk() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO bulk_log (so_dong, tong_view_moi)
  SELECT count(*), sum(views) FROM moi;
  RETURN NULL;
END $$;
CREATE TRIGGER notes_bulk AFTER UPDATE ON notes
  REFERENCING NEW TABLE AS moi
  FOR EACH STATEMENT EXECUTE FUNCTION log_bulk();

UPDATE notes SET views = views + 1
 WHERE user_id = 7;`, { sm: true, hl: [5, 9] }), 1.05),
  `<div>${zm(psql(`UPDATE 25
 so_dong | tong_view_moi
---------+---------------
      25 |          1133
(1 row)`, { sm: true }), 1.3)}
${box('One log row for 25 changed rows', '<code class="i">REFERENCING NEW TABLE AS moi</code> gives a statement trigger a <b>virtual table</b> of all new row versions. One INSERT for the whole command instead of 25 row triggers.', 'lam')}</div>`)}
<p style="font-size:20px;margin:0"><b>Coming from SQL Server?</b> This is exactly its <code class="i">inserted</code>/<code class="i">deleted</code> pseudo-tables — which always exist and are always per statement. In PostgreSQL you choose: per <b>row</b> with <code class="i">NEW</code>/<code class="i">OLD</code>, or per <b>statement</b> with transition tables.</p>` },

  { t: 'Trap 1: BEFORE returning NULL swallows the row', giua: true, body: `
${two(zm(run(`CREATE FUNCTION nuot() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN RETURN NULL; END; $$;
CREATE TRIGGER bay_before BEFORE INSERT ON bay
  FOR EACH ROW EXECUTE FUNCTION nuot();

INSERT INTO bay VALUES (1,'a');
SELECT count(*) AS so_dong_thuc_te FROM bay;`, `INSERT 0 0
 so_dong_thuc_te
-----------------
               0
(1 row)`, { sm: true, hl: [3], hlOut: [1] }), 1.12),
  `<div>${box('No error — the row never existed', 'Look at <code class="i">INSERT 0 0</code>: the second number is the row count. A BEFORE row trigger that <b>RETURNs NULL</b> tells PostgreSQL to skip the operation silently.', 'do2')}
${box('Rule', 'Every code path of a BEFORE trigger must end with <code class="i">RETURN NEW</code> (or <code class="i">OLD</code> for DELETE) — unless you <b>mean</b> to drop the row.', 'ok')}</div>`)}` },

  { t: 'On purpose: a trigger that guards a locked row', giua: true, body: `
${two(zm(sql(`CREATE FUNCTION chan_sua_hoa_don()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.da_chot THEN
    RAISE EXCEPTION 'hoa don % da chot, khong duoc sua',
      OLD.id
      USING ERRCODE = 'integrity_constraint_violation';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER hoa_don_chan
  BEFORE UPDATE OR DELETE ON hoa_don
  FOR EACH ROW EXECUTE FUNCTION chan_sua_hoa_don();`, { sm: true, hl: [4, 5, 9] }), 1.0),
  zm(psql(`UPDATE hoa_don SET tong = 300 WHERE id = 1;
UPDATE 1
UPDATE hoa_don SET tong = 300 WHERE id = 2;
ERROR:  hoa don 2 da chot, khong duoc sua
DELETE FROM hoa_don WHERE id = 2;
ERROR:  hoa don 2 da chot, khong duoc sua
 id | tong | da_chot
----+------+---------
  1 |  300 | f
  2 |  250 | t`, { sm: true, hl: [4, 6] }), 1.18))}
<p style="font-size:20px;margin:0">Invoice 1 (open) can change; invoice 2 (<b>da_chot</b> = closed) is protected against <b>every</b> client — an invariant that holds no matter who writes. Raising an <b>error</b> is louder and safer than silently returning NULL.</p>` },

  { t: 'Trap 2: a trigger that updates its own table', body: `
${dequyPic()}
${two(zm(psql(`UPDATE dem SET n = 10 WHERE id = 1;
ERROR:  stack depth limit exceeded
SELECT * FROM dem;   -- nothing saved
 id | n
----+---
  1 | 0`, { sm: true, hl: [2] }), 1.05),
  zm(psql(`-- BEFORE + assign to NEW
UPDATE dem SET n = 10 WHERE id = 1;
 id | n
----+----
  1 | 11
-- guard with pg_trigger_depth() > 1
UPDATE dem SET n = 100 WHERE id = 1;
  1 | 101`, { sm: true, hl: [4, 8] }), 1.05))}` },

  { t: 'A trigger runs INSIDE the transaction: stock control', body: `
${khoPic()}
${zm(sql(`CREATE FUNCTION tru_kho_khi_ban() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  UPDATE product SET stock = stock - NEW.qty WHERE id = NEW.product_id;
  INSERT INTO stock_movement (product_id, change, reason, order_id)
    VALUES (NEW.product_id, -NEW.qty, 'sale', NEW.order_id);
  RETURN NULL;   -- AFTER trigger: the return value is ignored
END $$;
CREATE TRIGGER order_item_kho AFTER INSERT ON order_item
  FOR EACH ROW EXECUTE FUNCTION tru_kho_khi_ban();`, { sm: true, hl: [3, 4] }), 0.95)}` },

  { t: 'The hidden cost of triggers', giua: true, body: `
${thanhPic([['plain INSERT', 312, XANH, 'th-a'], ['with AFTER trigger', 1888, DO, 'th-b']], { titleTxt: 'INSERT 200,000 rows — EXPLAIN ANALYZE, same machine', max: 1900 })}
${two(zm(psql(` Insert on ghi_cham (actual rows=0 loops=1)
   ->  Function Scan on generate_series g
 Trigger ghi_cham_t: calls=200000
 Execution Time: 1887.749 ms`, { sm: true, hl: [3] }), 1.15),
  box('Triggers are invisible… and add up', '<b>200,000 calls</b> of a PL/pgSQL function, each doing its own INSERT: <b>6× slower</b>. A trigger also hides inside every write — slow loads, odd errors, a column that “changes by itself”. <code class="i">EXPLAIN ANALYZE</code> shows it as <code class="i">Trigger …: calls=N</code>.', 'do2'))}` },

  { t: 'Finding, disabling and listing triggers', giua: true, body: `
${two(zm(psql(`ALTER TABLE ghi_cham DISABLE TRIGGER ghi_cham_t;
   tgname   | tgenabled
------------+-----------
 ghi_cham_t | D
ALTER TABLE ghi_cham ENABLE TRIGGER ghi_cham_t;
   tgname   | tgenabled
------------+-----------
 ghi_cham_t | O`, { sm: true, hl: [4, 8] }), 1.22),
  zm(psql(`SELECT c.relname AS bang, t.tgname, khi, cap …
    bang    |      tgname      |  khi   | cap
------------+------------------+--------+-----
 bay        | bay_before       | BEFORE | ROW
 dem        | dem_tang         | AFTER  | ROW
 hoa_don    | hoa_don_chan     | BEFORE | ROW
 notes      | notes_audit      | AFTER  | ROW
 notes      | notes_updated_at | BEFORE | ROW
 notes      | notes_viral      | AFTER  | ROW
 order_item | order_item_kho   | AFTER  | ROW`, { sm: true }), 1.05))}
<p style="font-size:20px;margin:0"><code class="i">tgenabled</code>: <b>O</b> = enabled (origin), <b>D</b> = disabled. Disable only for a bulk load you control, and <b>always</b> re-enable; <code class="i">\\d notes</code> in psql also lists a table’s triggers. When something “changes by itself”, query <code class="i">pg_trigger</code> first.</p>` },

  { t: 'Coming from SQL Server? Triggers compared', body: `
<div style="zoom:1.2"><table class="t">
<tr><th>Idea</th><th>SQL Server (T-SQL)</th><th>PostgreSQL</th></tr>
<tr><td>Timing</td><td><code class="i">AFTER</code> or <code class="i">INSTEAD OF</code> (no BEFORE)</td><td><code class="i">BEFORE</code> · <code class="i">AFTER</code> · <code class="i">INSTEAD OF</code> (views)</td></tr>
<tr><td>Granularity</td><td>always per <b>statement</b></td><td>per <b>row</b> or per <b>statement</b></td></tr>
<tr><td>Changed rows</td><td><code class="i">inserted</code> / <code class="i">deleted</code> tables</td><td><code class="i">NEW</code> / <code class="i">OLD</code> (row) · <code class="i">REFERENCING NEW TABLE</code></td></tr>
<tr><td>Body</td><td>trigger holds the code</td><td><b>function</b> + <code class="i">CREATE TRIGGER</code></td></tr>
<tr><td>Modify the row</td><td><code class="i">UPDATE</code> from <code class="i">inserted</code> (AFTER)</td><td>assign to <code class="i">NEW</code> in a BEFORE trigger</td></tr>
<tr><td>Cancel the write</td><td><code class="i">ROLLBACK</code> / <code class="i">THROW</code></td><td><code class="i">RETURN NULL</code> or <code class="i">RAISE EXCEPTION</code></td></tr>
</table></div>
${box('Mental switch', 'In SQL Server you write one statement-wide trigger and loop with <code class="i">inserted</code>. In PostgreSQL the usual trigger sees <b>one row at a time</b> — simpler code, but the cost scales with the number of rows.', 'lam')}` },

  { t: 'In a real project: CuongThai + Prisma', body: `
${two(`<div>${sql(`-- prisma/migrations/…_add_project_search_index/migration.sql
CREATE OR REPLACE FUNCTION projects_touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updated_at" = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- …and then? no CREATE TRIGGER anywhere in prisma/`, { sm: true, hl: [2, 9] })}
${box('What the finding means', 'The function exists but <b>nothing calls it</b>. The 316 <code class="i">@updatedAt</code> fields are set by the <b>Prisma client</b> in JavaScript — a raw <code class="i">$executeRaw</code> or a psql fix leaves them stale.', 'do2')}</div>`,
    `<div>${sql(`-- what a complete migration would add
CREATE TRIGGER projects_touch
  BEFORE UPDATE ON "projects"
  FOR EACH ROW
  EXECUTE FUNCTION projects_touch_updated_at();`, { sm: true })}
${box('How to ship a trigger with Prisma', 'Prisma’s schema cannot express triggers. Write the <code class="i">CREATE FUNCTION</code> + <code class="i">CREATE TRIGGER</code> by hand in a migration file; <code class="i">migrate deploy</code> applies it. Keep the app in sync: <b>one</b> place should own <code class="i">updated_at</code>.', 'ok')}</div>`)}` },

  { t: 'Your turn: views never go backwards', giua: true, body: `
<p style="font-size:22px;margin:0">Write a trigger so that an <code class="i">UPDATE</code> can <b>raise</b> <code class="i">views</code> but never <b>lower</b> it — silently keeping the old value. Which timing? BEFORE or AFTER? What do you return?</p>
${two(zm(run(`CREATE FUNCTION views_khong_lui()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.views := GREATEST(OLD.views, NEW.views);
  RETURN NEW;
END $$;
CREATE TRIGGER notes_views_khong_lui
  BEFORE UPDATE OF views ON notes
  FOR EACH ROW EXECUTE FUNCTION views_khong_lui();`, `CREATE FUNCTION
CREATE TRIGGER`, { sm: true, hl: [4, 8] }), 1.1),
  zm(psql(`SELECT views FROM notes WHERE id = 3;    10
UPDATE notes SET views = 1 WHERE id = 3;
SELECT views FROM notes WHERE id = 3;    10
UPDATE notes SET views = 99 WHERE id = 3;
NOTICE:  note 3 vua len viral (10 -> 99)
SELECT views FROM notes WHERE id = 3;    99`, { sm: true, hl: [3, 6] }), 1.15))}
<p style="font-size:19px;margin:0"><b>BEFORE</b>, because we <b>change</b> the row by assigning to <code class="i">NEW</code>; return <code class="i">NEW</code>. Setting views to 1 is ignored (stays 10); 99 goes through — and the <b>viral trigger</b> from before still fires: triggers on one table cooperate (BEFORE ones run in <b>alphabetical order</b> of name).</p>` },

  { t: 'Self-check', to: true, giua: true, body: `
<ol>
<li>You want to stamp <code class="i">updated_at</code> on every UPDATE. <b>BEFORE</b> or <b>AFTER</b> — and why?</li>
<li>A BEFORE INSERT trigger ends with <code class="i">RETURN NULL</code>. What does <code class="i">INSERT</code> report, and what is in the table?</li>
<li>An AFTER UPDATE trigger on <code class="i">dem</code> runs <code class="i">UPDATE dem SET n = n + 1</code>. What happens, and give <b>two</b> fixes.</li>
</ol>
${box('Answers', '1) <b>BEFORE</b>: only a BEFORE row trigger can change the row (assign to <code class="i">NEW</code>). 2) <code class="i">INSERT 0 0</code> and no row — silently dropped. 3) Infinite recursion → <i>stack depth limit exceeded</i>. Fix: BEFORE trigger assigning to <code class="i">NEW</code>, or guard with <code class="i">pg_trigger_depth()</code> / a <code class="i">WHEN</code> condition.', 'ok')}` },

  { t: 'Summary — and what comes next', to: true, giua: true, body: `
<ul>
<li>A trigger = a function <b>RETURNS trigger</b> + <code class="i">CREATE TRIGGER</code>; it runs for <b>every</b> writer.</li>
<li><b>BEFORE</b> can change/cancel the row; <b>AFTER</b> is for side effects. Row triggers see <code class="i">NEW</code>/<code class="i">OLD</code>; <b>AFTER ROW fires at the end</b> of the statement.</li>
<li>Guard with <code class="i">IS DISTINCT FROM</code> and <code class="i">WHEN</code>; use transition tables for statement-wide logs.</li>
<li>Traps: <b>RETURN NULL</b> in BEFORE, <b>recursion</b>, <b>hidden cost</b> — and keep business rules where people can find them.</li>
</ul>
${box('Next: lesson 12.3 — Views', 'A view is a <b>window</b> onto a query: it stores no data, it gives a name — and a safe frame — to one.', 'lam')}` },
]);
