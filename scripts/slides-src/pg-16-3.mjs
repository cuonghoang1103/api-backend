/**
 * pg-16-3 — PostgreSQL · Chapter 16 · Lesson 16.3 "The production checklist" (slide EN, kiểu FU, 26/10/2026, agent c16).
 * Nguồn: content/courses/postgresql/s16-production-capstone.mjs › postgresql-16-3-checklist.
 * Output = chạy thật (video-bai-giang/src/khung/pg/that/pg-16-3.out.txt + that/c16/ck/*): PostgreSQL 17.11 (pgcourse17: c16, c16_prod, bản sao c16_shop
 * của CT Shop) và PostgreSQL 16.15 container nháp pgc16tmp dựng từ ảnh giống production (cấu hình mặc định của ảnh). Kịch bản kiem-tra.sql = 12 mục đo được.
 * Sự cố thật lấy từ CLAUDE.md của repo (Known Error Patterns + Docker & Deploy): P3009 29/06, schema trễ ảnh 03/07, seed 08/08, đĩa đầy 18/08, …
 */
import { lamDeck, sql, psql, sh, run, tbl, two, box, kw, cards, steps, vsd, c } from './_pg-chung.mjs';
import { pilotPic, decayPic } from './pg-16-hinh.mjs';

const zm = (h, z = 1.2) => `<div style="zoom:${z}">${h}</div>`;
const P = (t) => `<p style="font-size:21px;margin:0">${t}</p>`;
const su = (h, t) => box(`Real incident · ${h}`, t, 'bad');
export const deck = { key: 'pg-16-3', code: 'PG 16.3', title: 'The production checklist', sub: 'every chapter as something you can verify in an afternoon' };

export const slides = lamDeck({ chuong: 'Chapter 16 — PostgreSQL in production & capstone', bai: '16.3' }, [
  { cover: true, t: 'The production checklist', sub: 'Every chapter, restated as something you can verify<br>in an afternoon — with the incidents this site really had' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Ten checks, each tied to the chapter that taught it</li>
<li>For each one: the command that <b>proves</b> it, run for real</li>
<li>The real incident behind it — most from this site’s own history</li>
<li>A checklist <b>script</b> you can run on any database (12 measured items)</li>
<li>Why a checklist run once is almost worthless</li>
</ul>
${box('Nothing new here', 'Every item is a chapter you have read. The reason to have it as a <b>list</b>: these failures do not announce themselves — each is invisible until the day it is total.', 'lam')}` },

  { t: 'Everyday example: the pilot’s pre-flight checklist', giua: true, body: `
${pilotPic()}
${P('Pilots with 30 years of flying still read the checklist aloud before every take-off, because each line is there since something once went wrong. A database before launch — and every quarter after — deserves the same discipline.')}` },

  { t: 'The checklist at a glance', body: `
${tbl(['#', 'check', 'proves it', 'chapter'], [
    ['1', 'a backup you have <b>restored</b>', '<code class="i">pg_restore</code> + row counts', '15'],
    ['2', 'connections add up', '<code class="i">pg_stat_activity</code> vs <code class="i">max_connections</code>', '14'],
    ['3', 'timeouts on every app role', '<code class="i">statement_timeout</code>, <code class="i">idle_in_transaction_session_timeout</code>', '11 · 14'],
    ['4', 'least privilege', 'app role cannot DROP / TRUNCATE / ALTER', '— (this lesson)'],
    ['5', 'observability on before you need it', '<code class="i">pg_stat_statements</code>, slow-query + lock-wait log', '14'],
    ['6', 'vacuum keeps up', 'dead-tuple %, per-table autovacuum, slots', '14 · 15'],
    ['7', 'migrations cannot take the site down', '<code class="i">lock_timeout</code>, CONCURRENTLY, <code class="i">migrate deploy</code>', '16.1'],
    ['8', 'FK indexes + the slow queries', 'catalog query, <code class="i">EXPLAIN (ANALYZE, BUFFERS)</code>', '9 · 10 · 16.2'],
    ['9', 'correct under concurrency', 'no read-modify-write; lock order; 40001 retry', '11'],
    ['10', 'the host itself', 'disk space, <code class="i">/dev/shm</code>, memory', '14 · 16.2'],
  ], { hl: [0, 1, 4] })}` },

  { t: '① A backup you have actually restored (real)', giua: true, body: `
${two(zm(sh(`$ pg_dump -Fc -d c16_prod -f c16_prod.dump; echo "exit=$?"
exit=0
-rw-r--r-- 1 root root 11359 Oct 26 04:02 /tmp/c16_prod.dump
$ createdb c16_restore && pg_restore -d c16_restore c16_prod.dump
$ psql -d c16_prod    -c "SELECT count(*) …"
    db    | customer | orders | migrations
----------+----------+--------+------------
 c16_prod |        3 |   1000 |          4
$ psql -d c16_restore -c "SELECT count(*) …"
     db      | customer | orders | migrations
-------------+----------+--------+------------
 c16_restore |        3 |   1000 |          4`, { sm: true, title: 'terminal — PostgreSQL 17.11 (trimmed)', hl: [8, 12] }), 1.0),
  `<div>${steps(['A dump runs on a schedule — and its <b>exit code is checked</b>', 'It is stored <b>away</b> from the database disk', 'A <b>full restore</b> is rehearsed, row counts compared', 'You know your worst case in <b>minutes</b> of lost data'])}
${su('Ch 15', '<code class="i">pg_dump … | gzip &gt; f</code> “succeeded” with exit 0 and a 20-byte file: the pipe reported gzip’s status, not pg_dump’s. Until a restore works, you have a <b>file</b>, not a backup.')}</div>`, 'r46')}` },

  { t: '② Connections add up (real)', giua: true, body: `
${two(zm(psql(`SELECT count(*) AS dang_dung,
  (SELECT setting::int FROM pg_settings
    WHERE name = 'max_connections') AS max_connections,
  (SELECT setting::int FROM pg_settings
    WHERE name = 'superuser_reserved_connections')
    AS danh_cho_superuser
FROM pg_stat_activity WHERE backend_type = 'client backend';
 dang_dung | max_connections | danh_cho_superuser
-----------+-----------------+--------------------
         1 |             100 |                  3`, { sm: true, title: 'psql 16.15 — production-like image', hl: [10] }), 1.0),
  `<div>${box('The rule', '(processes × pool size) &lt; max_connections, with room to spare. Count <b>every</b> process: web, workers, cron, migrate, exporter, your own psql. Size pools by the <b>server</b> (~cores × 2 + disks), never raise <code class="i">max_connections</code> to fix it.', 'lam')}
${su('Ch 0 / Ch 14', '12 app instances × a pool of 10 = 120 connections against a limit of 100 — <code class="i">FATAL: sorry, too many clients already</code>, and the migration, connecting last, failed first.')}</div>`, 'r46')}` },

  { t: '③ Timeouts on every app role (real)', giua: true, body: `
${two(zm(psql(`SET statement_timeout = '1s';
SELECT pg_sleep(2);
ERROR:  canceling statement due to statement timeout

SET idle_in_transaction_session_timeout = '1s';
BEGIN;
SELECT count(*) FROM customer;
 count
-------
     3
-- (the client now sits idle for 2 s…)
FATAL:  terminating connection due to idle-in-transaction timeout`, { sm: true, title: 'psql 17.11 — c16 (trimmed)', hl: [3, 11] }), 1.0),
  `<div>${sql(`-- set it on the ROLE, so every connection gets it
ALTER ROLE ctshop_app SET statement_timeout = '5s';
ALTER ROLE ctshop_app
  SET idle_in_transaction_session_timeout = '30s';`, { sm: true })}
${box('Why both', '<code class="i">statement_timeout</code> stops one runaway query from holding a connection and locks forever. <code class="i">idle_in_transaction_session_timeout</code> kills the forgotten <code class="i">BEGIN</code> that pins the xmin horizon and blocks vacuum everywhere (Ch 11, 14).', 'lam')}
${box('Default on the production image', 'Both are <b>0 = off</b> (measured on PostgreSQL 16.15, slide 15).', '')}</div>`, 'r46')}` },

  { t: '④ Least privilege: the app is not the owner (real)', giua: true, body: `
${two(sql(`CREATE ROLE ctshop_app LOGIN PASSWORD '…';
GRANT CONNECT ON DATABASE c16 TO ctshop_app;
GRANT USAGE ON SCHEMA public TO ctshop_app;
GRANT SELECT, INSERT, UPDATE, DELETE
  ON ALL TABLES IN SCHEMA public TO ctshop_app;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public
  TO ctshop_app;`, { sm: true }),
  zm(psql(`c16=> SELECT current_user, count(*) FROM customer;
 current_user | count
--------------+-------
 ctshop_app   |     3
c16=> INSERT INTO orders (customer_id, shipping_fee)
        VALUES (1, 30000) RETURNING id;
 id
----
  8
c16=> DROP TABLE orders;
ERROR:  must be owner of table orders
c16=> TRUNCATE customer;
ERROR:  permission denied for table customer
c16=> ALTER TABLE customer ADD COLUMN hack text;
ERROR:  must be owner of table customer`, { sm: true, title: 'psql 17.11 — logged in as ctshop_app', hl: [11, 13, 15] }), 1.0))}
${box('Two roles, two URLs', 'The <b>app</b> reads and writes rows. A separate <b>migrator</b> role owns the schema and is used only by <code class="i">migrate deploy</code>. A bug — or an SQL injection — in the app can then delete rows, but cannot drop your tables.', 'xanh')}` },

  { t: '⑤ Observability switched on before you need it', giua: true, body: `
${two(zm(psql(`SHOW shared_preload_libraries;
 shared_preload_libraries
--------------------------

SHOW log_min_duration_statement;
 log_min_duration_statement
----------------------------
 -1
SHOW log_lock_waits;
 log_lock_waits
----------------
 off`, { sm: true, title: 'psql 16.15 — the production-like image, defaults', hl: [4, 8, 12] }), 1.0),
  `<div>${sql(`# docker-compose.yml — postgres: command: (add)
- -c
- shared_preload_libraries=pg_stat_statements
- -c
- log_min_duration_statement=500ms
- -c
- log_lock_waits=on`, { sm: true, lang: 'yaml' })}</div>`)}
${two(box('Why “before”', '<code class="i">shared_preload_libraries</code> needs a <b>restart</b>, and every statistic starts from zero when you turn it on — so it cannot be added in the middle of an incident.', 'lam'),
  box('This repository, today', 'The compose file sets ten <code class="i">-c</code> tuning flags for the 2 GB container; none of these three is among them. Worth checking on the real server with <code class="i">SHOW</code>.', ''))}` },

  { t: '⑥ Vacuum keeps up (real)', giua: true, body: `
${two(zm(psql(`SELECT relname, n_live_tup, n_dead_tup,
  round(100.0 * n_dead_tup
    / greatest(n_live_tup + n_dead_tup, 1), 1) AS pct_chet,
  last_autovacuum
FROM pg_stat_user_tables
WHERE relname IN ('orders', 'customer');
 relname  | n_live_tup | n_dead_tup | pct_chet | last_autovacuum
----------+------------+------------+----------+-----------------
 customer |          3 |          3 |     50.0 |
 orders   |       1000 |          0 |      0.0 | 2026-10-26 04:03:55…`, { sm: true, title: 'psql 17.11 — c16_prod, after UPDATE 333 rows', hl: [11] }), 0.98),
  `<div>${sql(`-- the 2–3 hot tables get their own thresholds
ALTER TABLE orders SET (
  autovacuum_vacuum_scale_factor  = 0.02,
  autovacuum_analyze_scale_factor = 0.01);
-- a slot nobody reads keeps WAL forever
SELECT slot_name, active FROM pg_replication_slots
 WHERE NOT active;            -- (0 rows) ✓`, { sm: true })}
${box('What to watch', 'Dead-tuple % on big hot tables (Ch 14), <code class="i">age(datfrozenxid)</code> (wraparound), and inactive replication slots — they fill the disk <b>and</b> block vacuum (Ch 15).', 'lam')}</div>`, 'r46')}` },

  { t: '⑦ Migrations that cannot take the site down', body: `
${two(steps([
    '<code class="i">SET lock_timeout</code> before DDL — fail fast, retry later (16.1: a 1-row SELECT waited 6 s → 0.97 s)',
    '<code class="i">CREATE INDEX CONCURRENTLY</code> — alone in its own migration file',
    'Tested on <b>production-sized</b> data, never an empty dev DB',
    '<code class="i">migrate deploy</code> only; never <code class="i">migrate dev</code> or <code class="i">db push</code>; never auto-<code class="i">resolve</code>',
    'Expand/contract when old code may still be running',
  ]),
  `<div>${su('2026-06-29', 'A migration failed with “table already exists”, then <b>P3009 blocked every deploy</b>: the database had drifted from the migration history.')}
${su('2026-07-03', 'Feed returned <b>500</b> while the schema lagged behind the new image — two deploy workflows raced each other.')}
${su('2026-08-08', 'Enum renamed, all checks green — and the <b>seed broke on production</b> (16.1).')}</div>`, 'r46')}` },

  { t: '⑧ FK indexes, and the costliest queries', giua: true, body: `
${two(`<div>${zm(psql(` fk_total | fk_no_index
----------+-------------
      873 |         189`, { sm: true, title: 'the real cuongthai.com schema (16.2)', hl: [3] }), 1.2)}
${box('Not every one needs an index', 'Index the FK when parent rows are deleted/updated or you filter by it. A 12-row lookup table can live without — decide, don’t just count.', 'lam')}</div>`,
  `<div>${sql(`-- which queries cost the most IN TOTAL (Ch 14)
SELECT calls, round(total_exec_time) AS total_ms,
       round(mean_exec_time::numeric, 2) AS mean_ms,
       left(query, 60) AS query
FROM pg_stat_statements
ORDER BY total_exec_time DESC LIMIT 5;`, { sm: true })}
${box('Then EXPLAIN only those', '<code class="i">EXPLAIN (ANALYZE, BUFFERS)</code> on the top lines. 16.2: songs read 711 pages per request — 22 after one index.', 'xanh')}</div>`)}` },

  { t: '⑨ Correct under concurrency (real)', giua: true, body: `
${two(zm(psql(`-- two requests, read-modify-write in the app
A đọc|100.00
B đọc|100.00
-- A writes 100 - 10, then B writes 100 - 20
cuối cùng|80.00
-- ↑ should be 70.00 — and no error anywhere

-- the same two changes as ONE atomic statement each
UPDATE thu.accounts SET balance = balance - 10 WHERE id = 1;
UPDATE thu.accounts SET balance = balance - 20 WHERE id = 1;
cuối cùng|70.00`, { sm: true, title: 'psql 17.11 — two real sessions (lu.sh, trimmed)', hl: [5, 11] }), 1.0),
  steps(['<b>No read-modify-write</b> on shared counters or balances — one atomic <code class="i">UPDATE … SET x = x - $1</code>, or <code class="i">SELECT … FOR UPDATE</code> first', 'When locking several rows, always in the <b>same order</b> — that is the whole deadlock fix', 'If anything runs <code class="i">SERIALIZABLE</code>, a retry loop on <code class="i">40001</code> (Prisma: <code class="i">P2034</code>)']), 'r46')}
${box('Silent by construction', 'Lost updates never raise an error, so logs stay clean while money disappears (Ch 11). Only reading the code finds them.', 'bad')}` },

  { t: '⑩ The host itself: disk and shared memory', giua: true, body: `
${two(`<div>${su('2026-08-18', 'Docker build cache grew to <b>7.6 GB on the same disk as PostgreSQL</b>; a deploy died with <code class="i">no space left on device</code> (disk down to 1.8 GB during <code class="i">next build</code>). Builds moved off the server; a <b>weekly cleanup job</b> now guards the disk that once killed Postgres.')}
${box('Check', '<code class="i">df -h</code> on the data volume, alarm well before 80 %. WAL, slots, logs and build caches all compete for it.', 'lam')}</div>`,
  `<div>${zm(psql(`CREATE INDEX … USING hnsw (…);
ERROR:  could not resize shared memory segment
  "/PostgreSQL.2819730712" to 63999360 bytes:
  No space left on device
$ df -h /dev/shm
shm  64M  3.1M  61M  5% /dev/shm`, { sm: true, title: 'psql 16.15 — Docker defaults (16.2)', hl: [2, 6] }), 1.05)}
${box('Check', 'A Postgres container needs <code class="i">shm_size</code> large enough for parallel index builds and big sorts — Docker’s default is 64 MB.', 'lam')}</div>`)}` },

  { t: 'The checklist as a script: kiem-tra.sql (real)', giua: true, body: `
${two(zm(psql(`                  muc                   |   gia_tri    | dat
----------------------------------------+--------------+-----
 1 kết nối đang dùng / max              | 1 / 100      | ✓
 2 giao dịch già nhất                   | không có     | ✓
 3 idle_in_transaction_session_timeout  | 0            | ✗
 4 statement_timeout (máy chủ / role)   | 0 / chưa đặt | ✗
 5 pg_stat_statements đã nạp            | (trống)      | ✗
 6 log_min_duration_statement (ms)      | -1           | ✗
 7 log_lock_waits                       | off          | ✗
 8 khoá ngoại không có chỉ mục          | 187          | ✗
 9 bảng có > 20% dòng chết              | 0            | ✓
 10 replication slot bỏ rơi             | 0            | ✓
 11 age(datfrozenxid) lớn nhất          | 4618         | ✓
 12 chỉ mục INVALID (CONCURRENTLY hỏng) | 0            | ✓`, { sm: true, title: 'BEFORE — replica of the real schema, PostgreSQL 16.15 image defaults', hl: [5, 6, 7, 8, 9] }), 0.95),
  zm(psql(`                  muc                   |         gia_tri          | dat
----------------------------------------+--------------------------+-----
 3 idle_in_transaction_session_timeout  | 60000                    | ✓
 4 statement_timeout (máy chủ / role)   | 0 / statement_timeout=5s | ✓
 5 pg_stat_statements đã nạp            | pg_stat_statements       | ✓
 6 log_min_duration_statement (ms)      | 500                      | ✓
 7 log_lock_waits                       | on                       | ✓
 8 khoá ngoại không có chỉ mục          | 187                      | ✗`, { sm: true, title: 'AFTER — 4 settings + 1 role setting + restart (trimmed)', hl: [3, 4, 5, 6, 7] }), 0.86))}
${P('Item 8 stays ✗ on purpose (187 = the 189 of 16.2 minus the two indexes added there): each foreign key needs a <b>decision</b> — delete patterns, table sizes — not a blind <code class="i">CREATE INDEX</code> loop.')}` },

  { t: 'If you can only do four', to: true, giua: true, body: `
${cards([
    ['1 · Rehearse a restore', 'end to end, row counts compared — the only proof a backup exists'],
    ['2 · Count connections', 'processes × pools &lt; max_connections, with headroom'],
    ['3 · Turn on pg_stat_statements', 'plus the slow-query and lock-wait logs — before the incident'],
    ['4 · Remove read-modify-write', 'atomic UPDATEs; the silent data-loss bug'],
  ], 2)}
${box('Why these four', 'They cover the four failures that most often take down a small production database — and none takes more than an afternoon.', 'xanh')}` },

  { t: 'Trap: a launch checklist instead of a recurring one', giua: true, body: `
${decayPic()}
${P('Every item decays: the pool math is right until someone adds a worker; the backup runs until a key rotates; autovacuum keeps up until the table grows tenfold. The most dangerous state is when everything was verified long enough ago that everyone <b>remembers</b> it being verified.')}` },

  { t: 'Exercise: run the script on CT Shop', body: `
${two(`<div>${zm(psql(` 8 khoá ngoại không có chỉ mục | 7 | ✗
-- which ones?
        bang         |            conname
---------------------+--------------------------------
 shop.category       | category_parent_id_fkey
 shop.product        | product_category_id_fkey
 shop.orders         | orders_customer_id_fkey
 shop.order_item     | order_item_product_id_fkey
 shop.stock_movement | stock_movement_product_id_fkey
 shop.stock_movement | stock_movement_order_id_fkey
 shop.review         | review_customer_id_fkey`, { sm: true, title: 'psql 17.11 — ctshop (read-only run)', hl: [1] }), 1.0)}
${box('Task', 'Decide which of the 7 deserve an index, create them without blocking writes, re-run the script.', '')}</div>`,
  `<div>${sql(`-- solution, on a copy (c16_shop)
SET lock_timeout = '3s';
CREATE INDEX CONCURRENTLY orders_customer_id_idx
  ON shop.orders (customer_id);
CREATE INDEX CONCURRENTLY order_item_product_id_idx
  ON shop.order_item (product_id);
CREATE INDEX CONCURRENTLY review_customer_id_idx
  ON shop.review (customer_id);
CREATE INDEX CONCURRENTLY stock_movement_product_id_idx
  ON shop.stock_movement (product_id);
CREATE INDEX CONCURRENTLY stock_movement_order_id_idx
  ON shop.stock_movement (order_id);
-- category / product.category_id: 12 rows, never deleted`, { sm: true })}
${zm(psql(` 8 khoá ngoại không có chỉ mục          | 2 | ✗`, { sm: true, title: 'kiem-tra.sql after — 2 left on purpose', hl: [1] }), 1.0)}</div>`)}` },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>Your nightly dump job has reported success for a year. Name two things you still do not know.</li>
<li>Why must <code class="i">pg_stat_statements</code> be on <i>before</i> the incident, not during it?</li>
<li>The app role can run <code class="i">DELETE</code> but not <code class="i">DROP TABLE</code>. Why is that split worth the trouble?</li>
</ol>
${box('Answers', '① whether a restore works, and how many minutes of data you would lose (and whether the exit code was even checked) · ② it needs a restart and starts counting from zero · ③ a bug or SQL injection in the app can damage rows but not the schema; migrations use a separate owner role.', 'xanh')}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Ten checks, each one a chapter: restore, connections, timeouts, privileges, observability</li>
<li>…vacuum, safe migrations, FK indexes + top queries, concurrency, the host</li>
<li>Each check has a command that <b>proves</b> it — put them in one script</li>
<li>If only four: restore drill, connection math, pg_stat_statements, atomic updates</li>
<li>Run it every quarter; automate the restore drill</li>
</ul>
${box('Next — 16.4', 'Capstone: four real failures diagnosed from statistics alone — and the brief for Lab 9, where you wire a Node + Prisma app to CT Shop.', 'lam')}` },
]);
