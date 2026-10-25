/**
 * pg-14-3 — PostgreSQL · Chapter 14 · Lesson 14.3 "VACUUM, autovacuum and bloat" (slide EN, kiểu FU, 26/10/2026, agent c14).
 * Nguồn: content/courses/postgresql/s14-ket-noi-van-hanh.mjs › postgresql-14-3-vacuum-bloat. Output = chạy thật PostgreSQL 17.11:
 * video-bai-giang/src/khung/pg/that/pg-14-3.out.txt (200.000 đơn: 11 MB + 7208 kB → 23 MB + 14 MB, VACUUM VERBOSE, dùng lại chỗ, VACUUM FULL) ·
 * pg-14-3a (ba phiên: VACUUM FULL giữ AccessExclusiveLock, SELECT chờ) · pg-14-3b (14 tham số autovacuum%) · pg-14-3c (autovacuum tự chạy sau ~50 s) ·
 * pg-14-3d (truy vấn tìm bảng phình) · pg-14-3e (prepared transaction bị quên ⇒ "dead but not yet removable") · pg-14-3f/3g (máy nháp: đẩy XID tới
 * 2,14 tỉ ⇒ WARNING ⇒ ERROR không nhận lệnh ghi ⇒ ROLLBACK PREPARED + vacuumdb --all --freeze chữa ở chế độ thường) · pg-14-3h (age(datfrozenxid)).
 * Bổ sung so với web: HOT vs không HOT (chỉ mục cũng phình), VACUUM FULL chặn cả SELECT (chạy thật), ngưỡng chèn (insert threshold, PG13+),
 * ba thứ giữ đường chân trời xmin, wraparound chạy thật tới lúc PostgreSQL từ chối ghi, và cách chữa ở PG17 (không cần single-user mode).
 */
import { lamDeck, sql, psql, run, two, box, kw, cards, steps, vsd, tbl } from './_pg-chung.mjs';
import { haiPsql } from './pg-11-hinh.mjs';
import { dishesPic, hotPic, size5, thresholdPic, horizonPic, xidCircle } from './pg-14-hinh.mjs';

const zm = (h, z = 1.2) => `<div style="zoom:${z}">${h}</div>`;
export const deck = { key: 'pg-14-3', code: 'PG 14.3', title: 'VACUUM, autovacuum and bloat', sub: 'dead tuples · autovacuum thresholds · xmin horizon · wraparound' };

export const slides = lamDeck({ chuong: 'Chapter 14 — Connections, pooling & operating', bai: '14.3' }, [
  { cover: true, t: 'VACUUM, autovacuum<br>and bloat', sub: 'Who cleans up after MVCC, when they decide to,<br>and what happens when they cannot' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Measure bloat on a real table — and see why its <b>indexes</b> bloat too</li>
<li>VACUUM vs VACUUM FULL, with the lock that blocks even a SELECT</li>
<li>Autovacuum’s threshold formula, and tuning it <b>per table</b></li>
<li>The <b>xmin horizon</b>: three things that stop all cleanup</li>
<li><b>Transaction ID wraparound</b> — run for real until PostgreSQL refuses to write, then fixed</li>
</ul>
${box('Remember from 11.2', 'UPDATE never overwrites: it writes a new row version and leaves the old one as a <b>dead tuple</b>. VACUUM makes that space reusable; a long transaction can stop it.', 'lam')}` },

  { t: 'Everyday example: dirty tables in a restaurant', giua: true, body: `
${dishesPic()}
<p style="font-size:21px;margin:0">Every UPDATE leaves a used dish behind. The <b>busboy</b> (autovacuum) clears tables while the restaurant stays open, so new guests reuse them. Shrinking the building (VACUUM FULL) means closing it — nobody gets in while it happens.</p>` },

  { t: '200,000 orders, one UPDATE of every row (real)', giua: true, body: `
${two(zm(sql(`CREATE TABLE don_hang (
  id bigint PRIMARY KEY, khach_id int NOT NULL,
  trang_thai text NOT NULL, tong numeric(12,0) NOT NULL
) WITH (autovacuum_enabled = off);   -- measure by hand
-- 200,000 rows, + indexes on khach_id and trang_thai
UPDATE don_hang SET trang_thai = 'da_giao';
SELECT n_live_tup, n_dead_tup, n_tup_upd, n_tup_hot_upd
FROM pg_stat_user_tables WHERE relname = 'don_hang';`, { sm: true, hl: [6] }), 1.0),
  zm(psql(` bang  | chi_muc            -- before
-------+---------
 11 MB | 7208 kB
UPDATE 200000
 n_live_tup | n_dead_tup | n_tup_upd | n_tup_hot_upd
------------+------------+-----------+---------------
     200000 |     200000 |    200000 |             0
 bang  | chi_muc            -- after
-------+---------
 23 MB | 14 MB`, { sm: true, title: 'psql (17.11) — pgcourse, schema ch14 (excerpt)', hl: [3, 7, 10] }), 1.0))}
${box('Read it', 'Same 200,000 live rows, but <b>200,000 dead</b> ones too: the table doubled (11 → 23 MB) <i>and</i> the indexes doubled (7208 kB → 14 MB). <code class="i">bang</code> = table, <code class="i">chi_muc</code> = its indexes.', 'bad')}` },

  { t: 'Why the indexes bloated too: HOT vs non-HOT', giua: true, body: `
${hotPic()}
<p style="font-size:20px;margin:0">${kw('HOT', 'Heap-Only Tuple: new version on the same page, no index change')} is only possible when <b>no indexed column changes</b> and the page has room. We updated <code class="i">trang_thai</code>, which is indexed ⇒ <code class="i">n_tup_hot_upd = 0</code>. Tip: don’t index columns that change all the time unless you query by them; <code class="i">fillfactor</code> &lt; 100 leaves room for HOT.</p>` },

  { t: 'VACUUM (VERBOSE): what it did (real)', giua: true, body: `
${zm(psql(`pgcourse=# VACUUM (VERBOSE) don_hang;
INFO:  vacuuming "pgcourse.ch14.don_hang"
INFO:  launched 2 parallel vacuum workers for index vacuuming (planned: 2)
pages: 0 removed, 2942 remain, 2942 scanned (100.00% of total)
tuples: 200000 removed, 200000 remain, 0 are dead but not yet removable
removable cutoff: 70696, which was 0 XIDs old when operation ended
index scan needed: 1471 pages from table (50.00% of total) had 200000 dead item identifiers removed
index "don_hang_trang_thai_idx": pages: 332 in total, 172 newly deleted, 172 currently deleted, 0 reusable
system usage: CPU: user: 0.15 s, system: 0.00 s, elapsed: 0.15 s
 n_live_tup | n_dead_tup | da_vacuum         bang  | chi_muc
     200000 |          0 | t                 23 MB | 14 MB`, { sm: true, title: 'psql (17.11) — pgcourse (excerpt)', hl: [5, 11] }), 1.04)}
${two(box('Cleaned', '200,000 dead tuples removed, index entries pointing to them removed (2 parallel workers did the indexes). <b>0.15 s</b>, no lock that blocks reads or writes.', 'xanh'),
  box('But not smaller', 'Still <b>23 MB + 14 MB</b>: VACUUM marks space <b>reusable by this table</b>; it does not give it back to the operating system.', 'lam'))}` },

  { t: 'Reuse vs shrink: the five measurements', giua: true, body: `
${size5()}
${two(box('The 2nd UPDATE fit', 'After VACUUM, another full-table UPDATE stayed at <b>23 MB</b> — it reused the freed space. (Indexes 14 → 16 MB: index pages are reused less perfectly.)', 'xanh'),
  box('VACUUM FULL', 'Rewrote table and indexes: back to <b>11 MB + 7208 kB</b>. The price is on the next slide.', 'bad'))}` },

  { t: 'VACUUM FULL blocks even a SELECT (real)', giua: true, body: `
${haiPsql([
    ['+0.00s', '> VACUUM FULL lon;\n… rewriting 3,000,000 rows …', ''],
    ['+0.40s', '', '> SELECT count(*) FROM lon;\n⏳ waiting…'],
    ['+1.00s', '', '', 'C: <code>SELECT app, mode, granted FROM pg_locks …</code><br>A · AccessExclusiveLock · <b>t</b><br>B · AccessShareLock · <b style="color:#c0392b">f</b>'],
    ['+1.41s', 'VACUUM', ''],
    ['+1.47s', '', '  count\n 3000000'],
  ], { fs: 15, hl: [1, 2], wn: 380 })}
${two(box('ACCESS EXCLUSIVE', 'The strongest table lock: conflicts with <b>everything</b>, even plain reads. On a busy table every query queues behind it (11.4).', 'bad'),
  box('In production', 'Use the <code class="i">pg_repack</code> extension: rebuilds online, exclusive lock only for a moment at the end. Or accept some bloat — reused space is fine.', 'xanh'))}` },

  { t: 'Four maintenance commands, four jobs', to: true, giua: true, body: `
${cards([
    ['VACUUM', 'Removes dead tuples, makes space reusable, updates the visibility map, <b>freezes</b> old rows. No blocking lock. What autovacuum runs.'],
    ['VACUUM FULL', 'Rewrites the table smaller. <b>ACCESS EXCLUSIVE</b> lock, needs disk for a second copy. Never routine.'],
    ['pg_repack', 'Extension: the result of VACUUM FULL, online. The tool for a bloated busy table.'],
    ['ANALYZE', 'Refreshes planner statistics (Chapter 10). Autovacuum does this too. Bad plans after a bulk load = missing ANALYZE.'],
  ], 2)}` },

  { t: 'Autovacuum: the settings (PostgreSQL 17, real)', giua: true, body: `
${two(zm(psql(`                 name                  |  setting  | unit
---------------------------------------+-----------+------
 autovacuum                            | on        |
 autovacuum_analyze_scale_factor       | 0.1       |
 autovacuum_analyze_threshold          | 50        |
 autovacuum_freeze_max_age             | 200000000 |
 autovacuum_max_workers                | 3         |
 autovacuum_multixact_freeze_max_age   | 400000000 |
 autovacuum_naptime                    | 60        | s
 autovacuum_vacuum_cost_delay          | 2         | ms
 autovacuum_vacuum_cost_limit          | -1        |
 autovacuum_vacuum_insert_scale_factor | 0.2       |
 autovacuum_vacuum_insert_threshold    | 1000      |
 autovacuum_vacuum_scale_factor        | 0.2       |
 autovacuum_vacuum_threshold           | 50        |
 autovacuum_work_mem                   | -1        | kB
(14 rows)`, { sm: true, title: "SELECT name, setting, unit FROM pg_settings WHERE name LIKE 'autovacuum%'", hl: [9, 14, 15] }), 1.0),
  `<div>${cards([
    ['launcher + workers', 'A launcher wakes every <b>naptime</b> (60 s) and starts up to <b>3 workers</b>, each vacuuming one table at a time.'],
    ['threshold + scale_factor', 'When a table counts as “dirty enough” — next slide.'],
    ['cost_delay / cost_limit', 'Throttling, so vacuum I/O does not starve your queries.'],
  ], 1)}</div>`, 'r64')}` },

  { t: 'The threshold, worked out', giua: true, body: `
${zm(psql(`vacuum when  n_dead_tup  >  autovacuum_vacuum_threshold + autovacuum_vacuum_scale_factor × n_live
                         =  50 + 0.2 × rows

1,000 rows         →  50 + 200        =      250 dead tuples
1,000,000 rows     →  50 + 200,000    =  200,050 dead tuples   ← 20% of the table may be dead first`, { title: 'the rule (inserts have their own: 1000 + 0.2 × rows, since PostgreSQL 13)', sm: false }), 1.0)}
${thresholdPic()}` },

  { t: 'Watch autovacuum fire (real)', giua: true, body: `
${two(zm(sql(`CREATE TABLE av_demo AS
  SELECT g AS id, 'v' || g AS v
  FROM generate_series(1, 1000) g;
ALTER TABLE av_demo SET (
  autovacuum_vacuum_threshold = 100,
  autovacuum_vacuum_scale_factor = 0);
UPDATE av_demo SET v = v || '!';   -- 1000 dead`, { sm: true, hl: [4, 5, 6] }), 1.05),
  zm(psql(`[0s]  autovacuum_count=0 · n_dead_tup=1000 · last=chưa
[5s]  autovacuum_count=0 · n_dead_tup=1000 · last=chưa
[11s] autovacuum_count=0 · n_dead_tup=1000 · last=chưa
 …    (still 0 at 16, 21, 26, 34, 39, 45 s)
[50s] autovacuum_count=1 · n_dead_tup=0    · last=01:15:43

 n_live_tup | n_dead_tup | autovacuum_count
       1000 |          0 |                1`, { sm: true, title: 'polled every 5 s — PostgreSQL 17.11 (chưa = not yet)', hl: [5] }), 1.0))}
${two(box('Not instant — on purpose', 'The launcher checks every <code class="i">autovacuum_naptime</code> (60 s), so a table waits <b>0–60 s</b>. In this run: about 50 s.', 'lam'),
  box('Tune per table', '<code class="i">ALTER TABLE … SET (…)</code> changes only that table — far better than changing the global default for tables that were fine.', 'xanh'))}` },

  { t: 'Tuning the tables that churn', giua: true, body: `
${zm(sql(`-- CuongThai example: AI agents send a heartbeat every few seconds,
-- updating heartbeat_at / expires_at — and expires_at is indexed (no HOT)
ALTER TABLE work_agent_leases SET (
  autovacuum_vacuum_scale_factor = 0.01,   -- 1 % churn instead of 20 %
  autovacuum_vacuum_threshold    = 200
);
-- check what a table has been given
SELECT relname, reloptions FROM pg_class WHERE relname = 'av_demo';`, { sm: true, hl: [3, 4, 5] }), 1.2)}
${two(box('Smaller, more frequent passes', 'A pass over 1% dead rows is short and cheap; a pass over 20% is long, does more I/O, and holds back more. Set it on the 2–3 tables that really churn; leave the rest at the defaults.', 'xanh'),
  box('If autovacuum still loses', 'Raise <code class="i">autovacuum_vacuum_cost_limit</code> (throttle less) or <code class="i">autovacuum_max_workers</code> — but first look for something <b>blocking</b> it (two slides on).', 'lam'))}` },

  { t: 'Finding what is bloated (real)', giua: true, body: `
${two(zm(sql(`SELECT relname, n_live_tup, n_dead_tup,
  CASE WHEN n_live_tup > 0
       THEN round(100.0 * n_dead_tup / n_live_tup, 1)
       ELSE 0 END AS phan_tram_chet,
  pg_size_pretty(pg_relation_size(relid)) AS kich_thuoc,
  last_autovacuum
FROM pg_stat_user_tables
WHERE schemaname = 'ch14' AND n_dead_tup > 0
ORDER BY n_dead_tup DESC LIMIT 5;`, { sm: true }), 1.05),
  `<div>${box('Read it', '<code class="i">phan_tram_chet</code> = dead as % of live. Sustained high values mean autovacuum is not keeping up — threshold too high for the churn, or something blocks cleanup.', 'lam')}
${box('Counters are estimates', 'They reset on a server crash. Here a <code class="i">VACUUM FULL</code> did <b>not</b> reset <code class="i">n_dead_tup</code> (it showed 250,000 on a freshly rewritten table) — run a plain VACUUM or ANALYZE to refresh it.', '')}</div>`)}
${zm(psql(` relname  | n_live_tup | n_dead_tup | phan_tram_chet | kich_thuoc |        last_autovacuum
----------+------------+------------+----------------+------------+-------------------------------
 don_hang |     200000 |      50000 |           25.0 | 14 MB      |
 av_demo  |       1000 |        300 |           30.0 | 104 kB     | 2026-10-26 01:15:43.772259+07`, { sm: true, title: 'psql (17.11) — pgcourse' }), 1.05)}` },

  { t: 'What stops VACUUM: the xmin horizon', giua: true, body: `
${horizonPic()}
<p style="font-size:20px;margin:0">VACUUM may only remove a dead version that <b>no snapshot can still see</b>. The oldest snapshot anywhere in the cluster sets that line — the ${kw('xmin horizon', 'oldest transaction ID someone may still need')}. Lesson 11.2 showed the first holder (a long transaction). Here is the second, run for real.</p>` },

  { t: 'A forgotten prepared transaction (real)', giua: true, body: `
${two(zm(psql(`shop=# BEGIN;
shop=*# INSERT INTO nhat_ky (ghi) VALUES ('chuyển khoản bước 1');
shop=*# PREPARE TRANSACTION 'quen-commit';    -- nobody commits it
shop=# UPDATE hang SET n = n + 1;             -- another table
UPDATE 1000
shop=# VACUUM (VERBOSE) hang;
tuples: 0 removed, 2000 remain, 1000 are dead but not yet removable
removable cutoff: 754, which was 2 XIDs old when operation ended
shop=# -- the horizon query on the right ⇒
 prepared transaction | quen-commit |    2
shop=# ROLLBACK PREPARED 'quen-commit';
shop=# VACUUM (VERBOSE) hang;
tuples: 1000 removed, 1000 remain, 0 are dead but not yet removable`, { sm: true, title: 'psql (17.11) — scratch server pgc14tmp, max_prepared_transactions = 5 (excerpt)', hl: [7, 10, 13] }), 1.0),
  zm(sql(`-- who pins the horizon? (run on any server)
SELECT 'open transaction' AS source,
       pid::text AS who, age(backend_xmin) AS age
FROM pg_stat_activity
WHERE backend_xmin IS NOT NULL
  AND pid <> pg_backend_pid()
UNION ALL
SELECT 'prepared transaction', gid,
       age(transaction) FROM pg_prepared_xacts
UNION ALL
SELECT 'replication slot', slot_name::text,
       age(xmin) FROM pg_replication_slots
WHERE xmin IS NOT NULL
ORDER BY age DESC;`, { sm: true, hl: [8, 9] }), 1.0))}
${box('Read it', 'A <code class="i">PREPARE TRANSACTION</code> (two-phase commit) survives disconnects and even restarts. Forgotten, it pins the horizon for <b>every</b> table — here <code class="i">hang</code>, which it never touched. The horizon query (right) names it.', 'bad')}` },

  { t: 'Wraparound: why VACUUM must also freeze', giua: true, body: `
${xidCircle()}
<p style="font-size:20px;margin:0">Transaction IDs are a 32-bit counter. Any row is judged by comparing its xmin with “now”: half the circle is the past, half the future. A row left un-frozen for ~2.1 billion transactions would suddenly look like it comes <b>from the future</b> — invisible. So VACUUM also <b>freezes</b> old rows (marks them “visible to everyone, forever”).</p>` },

  { t: 'Wraparound for real: writes are refused', giua: true, body: `
${zm(psql(`-- scratch server: prepared transaction "quen-commit" (xid 740) forgotten, XID counter pushed to 2,144,404,377
shop=# SELECT datname, age(datfrozenxid) FROM pg_database ORDER BY 2 DESC;
 postgres  | 2144403647        (… same for shop, template1, template0)
shop=# INSERT INTO nhat_ky (ghi) VALUES ('đơn mới');
WARNING:  database "template1" must be vacuumed within 3080000 transactions
HINT:  To avoid transaction ID assignment failures, execute a database-wide VACUUM in that database.
INSERT 0 1
-- … ~80,000 more transactions (pgbench) …
shop=# INSERT INTO nhat_ky (ghi) VALUES ('đơn mới');
ERROR:  database is not accepting commands that assign new transaction IDs to avoid wraparound data loss in database "shop"
HINT:  Execute a database-wide VACUUM in that database.
You might also need to commit or roll back old prepared transactions, or drop stale replication slots.
shop=# SELECT count(*) FROM nhat_ky;          -- READS still work
     1`, { sm: true, title: 'psql (17.11) — throw-away container pgc14wrap (excerpt)', hl: [5, 10, 14] }), 0.97)}
${box('Meanwhile in the server log', 'Autovacuum ran “aggressive vacuum to prevent wraparound” on every table — and every time reported <code class="i">removable cutoff: 740, which was 2144403638 XIDs old</code>. It worked hard and could not move: the forgotten transaction held the line.', 'bad')}` },

  { t: 'Recovery in PostgreSQL 17 — and prevention', giua: true, body: `
${two(zm(psql(`shop=# SELECT gid, age(transaction) FROM pg_prepared_xacts;
     gid     |    age
-------------+------------
 quen-commit | 2144483638
shop=# ROLLBACK PREPARED 'quen-commit';
$ vacuumdb --all --freeze      # normal multi-user mode
(… 187 "bypassing nonessential maintenance … as a failsafe" warnings …)
shop=# SELECT datname, age(datfrozenxid) FROM pg_database;
 postgres | 0   shop | 0   template1 | 0   template0 | 0
shop=# INSERT INTO nhat_ky (ghi) VALUES ('đơn mới');
INSERT 0 1`, { sm: true, title: 'psql (17.11) — the same scratch server (excerpt)', hl: [4, 9, 11] }), 0.98),
  `<div>${steps([
    'Find and end the holder: old transaction, <b>prepared transaction</b>, or stale replication slot.',
    'Run <code class="i">VACUUM</code> in each affected database (<code class="i">vacuumdb --all</code>). Since PostgreSQL 16 the docs say: do it in normal mode — single-user mode is <b>no longer recommended</b>.',
    'Monitor so it never happens: <code class="i">age(datfrozenxid)</code> on a dashboard (14.4). Our course server reads <b>69,982</b> — healthy, far below 200,000,000.',
  ])}</div>`)}` },

  { t: 'Exercise — with the answer', giua: true, to: true, body: `
${two(`<div>${steps([
    'A 5,000,000-row table with default settings: how many dead tuples before autovacuum starts? And with <code class="i">scale_factor = 0.01</code>, <code class="i">threshold = 1000</code>?',
    'VACUUM VERBOSE prints <i>“30000 are dead but not yet removable”</i>. What do you run first?',
  ])}</div>`,
  `<div>${box('Answer', '1) 50 + 0.2 × 5,000,000 = <b>1,000,050</b>. Tuned: 1000 + 0.01 × 5,000,000 = <b>51,000</b>.<br>2) The <b>horizon query</b> (open transactions, prepared transactions, replication slots) — then end the oldest holder. Bigger <i>settings</i> will not help while something pins the horizon.', 'xanh')}</div>`)}` },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>After VACUUM a table reports 0 dead tuples but is still 23 MB. Bug?</li>
<li>Why did updating <code class="i">trang_thai</code> make the indexes bloat, when the primary key never changed?</li>
<li>Writes fail with “not accepting commands … to avoid wraparound”. Can you still read? Do you need single-user mode in PostgreSQL 17?</li>
</ol>
${box('Answers', '1) <b>No</b> — the space is reusable by the table; only VACUUM FULL / pg_repack shrink the file. 2) <code class="i">trang_thai</code> is indexed ⇒ no HOT ⇒ every index got an entry for the new version. 3) <b>Yes</b>, reads work. <b>No</b>: end the holder, then VACUUM in normal mode.', 'xanh')}` },

  { t: 'Summary & next', giua: true, body: `
<ul>
<li>Every UPDATE/DELETE leaves dead tuples; updating an indexed column bloats indexes too (no HOT)</li>
<li>VACUUM = reuse, no blocking lock · VACUUM FULL = shrink, ACCESS EXCLUSIVE (pg_repack online)</li>
<li>Autovacuum fires at 50 + 0.2 × rows — too late for big tables ⇒ tune per table</li>
<li>Nothing is cleaned past the xmin horizon: long transactions, prepared transactions, replication slots</li>
<li>VACUUM also freezes; ignore it for ~2 billion transactions and writes stop — watch <code class="i">age(datfrozenxid)</code></li>
</ul>
${box('Next — 14.4 Monitoring', '“The site is slow” → a diagnosis: pg_stat_activity for now, pg_stat_statements for over time, index and cache statistics, logs, and alarms.', 'lam')}` },
]);
