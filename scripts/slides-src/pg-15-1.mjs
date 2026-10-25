/**
 * pg-15-1 — PostgreSQL · Chapter 15 · Lesson 15.1 "Logical backups with pg_dump" (slide EN, kiểu FU, 26/10/2026, agent c15).
 * Nguồn: content/courses/postgresql/s15-sao-luu-nhan-ban.mjs › postgresql-15-1-pg-dump. Output = chạy thật PostgreSQL 17.11 trong container tạm
 * pgc15-a (CSDL ctshop 49 MB: 20k khách, 1k sản phẩm, 300k đơn, 1k note) + pgc15-b (máy chủ mới tinh) + client postgres:16 (16.14):
 * video-bai-giang/src/khung/pg/that/pg-15-1.out.txt (+ .sql).
 * Bổ sung so với web: ảnh chụp vs camera (đời thường), bên trong plain.sql (\restrict của 17.6+, COPY trước, chỉ mục sau), thời gian thật
 * (plain nhanh nhất vì không nén), BẪY pg_restore -t (thiếu schema, mất PK/identity) + "errors ignored" exit=1, role không nằm trong dump
 * (pg_dumpall --globals-only), lệch phiên bản (16 ↔ 17, cả hai chiều), nâng 16 → 17 bằng pg_dump 17 (CuongThai chạy 16), giao dịch mở của
 * pg_dump (pg_stat_activity thật, 1000 vs 1001), ống | gzip nuốt lỗi (exit=0, tệp 20 byte) — đúng mẫu script backup thật của CuongThai.
 */
import { lamDeck, sql, psql, sh, run, two, box, kw, cards, steps, c, tbl } from './_pg-chung.mjs';
import { photoPic, formatsPic, rpoPic, ctBackupPic } from './pg-15-hinh.mjs';

const zm = (h, z = 1.2) => `<div style="zoom:${z}">${h}</div>`;
const P = (t, fs = 22) => `<p style="font-size:${fs}px;margin:0">${t}</p>`;
export const deck = { key: 'pg-15-1', code: 'PG 15.1', title: 'Logical backups with pg_dump', sub: 'plain · custom · directory · pg_restore' };

export const slides = lamDeck({ chuong: 'Chapter 15 — Backup, replication & scaling', bai: '15.1' }, [
  { cover: true, t: 'Logical backups<br>with pg_dump', sub: 'plain · custom · directory, pg_restore,<br>roles, versions — and where a dump stops being enough' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The two <b>families</b> of backup — logical vs physical — and when each one wins</li>
<li><code class="i">pg_dump</code> in three formats, <b>measured</b>: size, time, what restores what</li>
<li><code class="i">pg_restore</code>: the table of contents, one schema, one table, in parallel</li>
<li>Four traps: <b>-t</b> loses the PK, <b>roles</b> are not in the dump, <b>versions</b>, a pipe that hides failure</li>
<li>Why a nightly dump is <b>not</b> a backup strategy — and CuongThai’s real backup script</li>
</ul>
${box('Chapter 15 answers three questions', 'Can we <b>restore</b>? (15.1–15.2) · Can we survive losing a <b>machine</b>? (15.3) · What when one table gets <b>too big</b>? (15.4). This is the chapter where real data is lost — or saved.', 'lam')}` },

  { t: 'Everyday example first: a photo vs a camera', giua: true, body: `
${photoPic()}
${P('A <b>dump</b> is a photo: the whole database exactly as it was at one moment. Anything that happens after the click is not in it. To rewind to <i>any</i> second you need the camera — the write-ahead log of lesson 15.2.')}` },

  { t: 'Two families of backup', giua: true, body: `
<table class="t">
<tr><th style="width:230px"></th><th>Logical — <code class="i">pg_dump</code></th><th>Physical — <code class="i">pg_basebackup</code> + WAL</th></tr>
<tr><td><b>Copies</b></td><td>the data as SQL / rows</td><td>the data <b>files</b>, byte for byte</td></tr>
<tr><td><b>One table / schema?</b></td><td><span class="xanh">✓ yes</span></td><td><span class="do">✗ whole cluster only</span></td></tr>
<tr><td><b>Across major versions?</b></td><td><span class="xanh">✓ 16 → 17 works</span></td><td><span class="do">✗ same major version</span></td></tr>
<tr><td><b>Point-in-time?</b></td><td><span class="do">✗ only the moment of the dump</span></td><td><span class="xanh">✓ any second (15.2)</span></td></tr>
<tr><td><b>Big database</b></td><td>slow to dump, slower to restore</td><td>fast — files + replay</td></tr>
<tr><td><b>Best for</b></td><td>upgrades · prod → laptop · a net before a migration</td><td>disaster recovery · replicas (15.3)</td></tr>
</table>
${box('Rule of thumb', 'Production needs <b>both</b>: physical + WAL for “restore to 14:31:59”, and logical dumps for moving data and upgrading.', 'xanh')}` },

  { t: 'The database for this lesson', giua: true, body: `
${two(zm(sql(`-- container pgc15-a · PostgreSQL 17.11
CREATE ROLE app_ro LOGIN PASSWORD '…';
CREATE DATABASE ctshop;
-- schema shop: customers · products · orders
-- schema blog: note
GRANT SELECT ON ALL TABLES IN SCHEMA shop
  TO app_ro;
SELECT 'orders', count(*) FROM shop.orders …;
SELECT pg_size_pretty(
  pg_database_size('ctshop'));`, { sm: true, hl: [2, 6] }), 1.1),
  zm(psql(`   bang    | count
-----------+--------
 customers |  20000
 products  |   1000
 orders    | 300000
 note      |   1000
(4 rows)

 kich_thuoc_db
---------------
 49 MB
(1 row)`, { sm: true, title: 'psql (17.11) — ctshop' }), 1.15))}
${P('A small CT Shop: 300,000 orders, one read-only role <code class="i">app_ro</code>, two schemas. 49 MB — big enough to time, small enough to run on a laptop. Every command in this lesson ran for real against it.')}` },

  { t: 'pg_dump writes SQL — look inside plain.sql', body: `
${two(zm(sh(`$ pg_dump -d ctshop -f plain.sql
$ sed -n 1,20p plain.sql
--
-- PostgreSQL database dump
--

\\restrict Z77wI2R3V2Nj0nQu0ffBEJodZk49Cu…

-- Dumped from database version 17.11
-- Dumped by pg_dump version 17.11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SELECT pg_catalog.set_config('search_path', '', false);
SET row_security = off;`, { sm: true, hl: [7, 9, 10] }), 1.0),
  zm(sh(`$ grep -n -E "^(CREATE|COPY|GRANT)" plain.sql
26:CREATE SCHEMA blog;
35:CREATE SCHEMA shop;
48:CREATE TABLE blog.note (
103:CREATE TABLE shop.orders (
163:COPY blog.note (id, title, body) FROM stdin;
21179:COPY shop.orders (id, customer_id, …) FROM stdin;
322223:ALTER TABLE ONLY blog.note   ← PK
322271:CREATE INDEX orders_customer_created_idx …
322294:GRANT USAGE ON SCHEMA shop TO app_ro;
$ wc -l plain.sql
322323 plain.sql`, { sm: true, hl: [6, 7, 8, 9] }), 1.0))}
${box('Read the order', 'Tables first, then <b>COPY</b> all the rows, and only then primary keys and indexes — loading into a table <b>without</b> indexes is much faster. <code class="i">\\restrict</code> (new in 17.6) is a safety line only <code class="i">psql</code> understands.', 'lam')}` },

  { t: 'Three formats, measured', giua: true, body: `
${zm(sh(`$ time pg_dump -d ctshop -f plain.sql
real 0.264s
$ time pg_dump -d ctshop -Fc -f custom.dump
real 0.595s
$ time pg_dump -d ctshop -Fd -j 4 -f dir
real 0.655s
$ du -sh plain.sql custom.dump dir
16M	plain.sql
3.9M	custom.dump
3.9M	dir`, { hl: [8, 9, 10] }), 1.15)}
${two(box('Size', '<b>custom</b> and <b>directory</b> are ~4× smaller (16M → 3.9M): they compress with gzip.', 'xanh'),
  box('Time', '<b>plain</b> was fastest here — no compression. Compressing costs CPU; on a slow disk or network it pays back.', ''))}` },

  { t: 'Picture it: what each format is on disk', giua: true, body: `
${formatsPic()}
${P('<b>plain</b>: one text file of SQL. <b>custom</b>: one compressed file that carries a <b>table of contents</b> (TOC). <b>directory</b>: a folder — <code class="i">toc.dat</code> plus one compressed file per table, which is why it can be dumped and restored in <b>parallel</b> (<code class="i">-j</code>).', 21)}` },

  { t: 'Restoring: createdb, then pg_restore', giua: true, body: `
${two(zm(sh(`$ createdb ctshop_restore
$ time pg_restore -d ctshop_restore custom.dump
real 0.997s
$ psql -d ctshop_restore -c "SELECT count(*)
      AS so_don FROM shop.orders"
 so_don
--------
 300000
(1 row)`, { sm: true, hl: [8] }), 1.12),
  zm(sh(`$ createdb ctshop_j4
$ time pg_restore -d ctshop_j4 -j 4 dir
real 0.794s

$ createdb ctshop_plain
$ time psql -q -d ctshop_plain -f plain.sql
 setval
--------
 300000
real 0.940s`, { sm: true, hl: [3, 10] }), 1.12))}
${box('Two tools', 'A <b>plain</b> dump is just SQL — you replay it with <code class="i">psql -f</code>. <b>custom</b> and <b>directory</b> need <code class="i">pg_restore</code>, and that is what unlocks everything on the next two slides. Restore is slower than dump: it rebuilds every index.', 'lam')}` },

  { t: 'pg_restore -l: the table of contents', body: `
${zm(sh(`$ pg_restore -l custom.dump
; Archive created at 2026-10-26 01:37:23 +07
;     dbname: ctshop
;     TOC Entries: 35
;     Compression: gzip
;     Dump Version: 1.16-0
;     Format: CUSTOM
;     Dumped from database version: 17.11 (Debian 17.11-1.pgdg13+2)
;     Dumped by pg_dump version: 17.11 (Debian 17.11-1.pgdg13+2)
6; 2615 16448 SCHEMA - blog postgres
226; 1259 16491 TABLE blog note postgres
224; 1259 16471 TABLE shop orders postgres
3469; 0 0 ACL shop TABLE orders postgres
3458; 0 16471 TABLE DATA shop orders postgres
3305; 2606 16497 CONSTRAINT blog note note_pkey postgres`, { sm: true, hl: [4, 13, 14] }), 1.0)}
${P('Every object is one line: schema, table, its <b>DATA</b>, its <b>ACL</b> (grants), its constraints. You can save this list, delete lines, and restore only what is left: <code class="i">pg_restore -l f &gt; list</code> → edit → <code class="i">pg_restore -L list -d db f</code>.', 21)}` },

  { t: 'Taking only the pieces you need', giua: true, body: `
${two(zm(sh(`$ pg_dump -d ctshop -n blog -Fc -f blog.dump
-rw-r--r-- 1 root root   12387 blog.dump
$ pg_dump -d ctshop -t shop.orders -Fc -f orders.dump
-rw-r--r-- 1 root root 3763056 orders.dump
$ pg_dump -d ctshop -T shop.orders -Fc -f khong_orders.dump
-rw-r--r-- 1 root root  242231 khong_orders.dump`, { sm: true }), 1.0),
  `<table class="t" style="font-size:19px">
<tr><th>flag</th><th>means</th></tr>
<tr><td><code class="i">pg_dump -n blog</code></td><td>only schema <b>blog</b></td></tr>
<tr><td><code class="i">pg_dump -t shop.orders</code></td><td>only that table</td></tr>
<tr><td><code class="i">pg_dump -T shop.orders</code></td><td>everything <b>except</b> it</td></tr>
<tr><td><code class="i">pg_restore --data-only</code></td><td>rows, no CREATE</td></tr>
<tr><td><code class="i">pg_restore -j 4</code></td><td>4 workers in parallel</td></tr>
</table>`)}
${box('Choose at dump time when you can', 'Filtering in <code class="i">pg_dump</code> gives a self-contained file. Filtering later in <code class="i">pg_restore</code> has sharp edges — next slide.', '')}` },

  { t: 'Trap: pg_restore -t gives you a table, not its schema or its key', body: `
${two(zm(sh(`$ createdb chi_note
$ pg_restore -d chi_note -t note custom.dump
pg_restore: error: could not execute query:
  ERROR:  schema "blog" does not exist
…
pg_restore: warning: errors ignored on restore: 3
$ psql -d chi_note -c "CREATE SCHEMA blog"
$ pg_restore -d chi_note -t note custom.dump
$ psql -d chi_note -c "\\d blog.note"
 Column |  Type  | Nullable | Default
--------+--------+----------+---------
 id     | bigint | not null |
 title  | text   | not null |
 body   | text   | not null |`, { sm: true, hl: [4, 6, 12] }), 1.0),
  zm(sh(`$ pg_dump -d ctshop -n blog -Fc -f blog.dump
$ createdb chi_blog
$ pg_restore -d chi_blog blog.dump
$ psql -d chi_blog -c "\\d blog.note"
 Column | Type   | Default
--------+--------+------------------------------
 id     | bigint | generated always as identity
 title  | text   |
 body   | text   |
Indexes:
    "note_pkey" PRIMARY KEY, btree (id)`, { sm: true, hl: [7, 11] }), 1.0))}
${box('What -t really restores', '<code class="i">pg_restore -t note</code> = the table definition + its rows. <b>No</b> schema, <b>no</b> primary key, <b>no</b> identity, no indexes. Even <code class="i">pg_restore -n blog</code> skipped <code class="i">CREATE SCHEMA</code> (6 errors). Dump the schema you need with <code class="i">pg_dump -n</code> instead.', 'bad')}` },

  { t: 'pg_restore keeps going — and says so only in its exit code', giua: true, body: `
${zm(sh(`$ pg_restore -d chi_note -t note custom.dump; echo "exit=$?"
exit=1
$ pg_restore -d thu1 -1 --exit-on-error -t note custom.dump; echo exit=$?
pg_restore: error: could not execute query: ERROR:  schema "blog" does not exist
LINE 1: CREATE TABLE blog.note (
exit=1`, { hl: [2, 6] }), 1.12)}
${steps([
    'By default <code class="i">pg_restore</code> <b>skips</b> a failing object and carries on: you get a database that is <i>almost</i> right, plus “errors ignored on restore: N”.',
    '<code class="i">--exit-on-error</code> stops at the first error; <code class="i">-1</code> (single transaction) makes the restore all-or-nothing (Chapter 11).',
    'In a script, <b>always check the exit code</b>. 0 = clean. Anything else = do not trust the result.',
  ])}` },

  { t: 'Trap: roles are not in the dump', body: `
${two(zm(sh(`# a brand-new PostgreSQL 17 server (pgc15-b)
$ createdb ctshop; pg_restore -d ctshop custom.dump
pg_restore: error: could not execute query:
  ERROR:  role "app_ro" does not exist
Command was: GRANT USAGE ON SCHEMA shop TO app_ro;
… (GRANT on customers, orders, products)
pg_restore: warning: errors ignored on restore: 4
exit=1
$ psql -d ctshop -c "\\dp shop.orders"
 Schema |  Name  | Access privileges
--------+--------+-------------------
 shop   | orders |`, { sm: true, hl: [4, 8, 12] }), 1.0),
  zm(sh(`# on the OLD server
$ pg_dumpall --globals-only -f globals.sql
CREATE ROLE app_ro;
ALTER ROLE app_ro WITH … LOGIN … PASSWORD 'SCRAM-SHA-256$4096:…';
# on the NEW server
$ psql -q -f globals.sql
psql:globals.sql:18: ERROR:  role "postgres" already exists
$ dropdb ctshop; createdb ctshop
$ pg_restore -d ctshop custom.dump; echo exit=$?
exit=0
 shop | orders | postgres=arwdDxtm/postgres+
      |        | app_ro=r/postgres`, { sm: true, hl: [3, 10, 12] }), 1.0))}
${box('Why', 'Roles (users, passwords) belong to the whole <b>cluster</b>, not to one database — so <code class="i">pg_dump</code> never contains them. Back up <code class="i">pg_dumpall --globals-only</code> next to every dump. (The “postgres already exists” error is harmless.)', 'bad')}
${steps(['On the new server: <code class="i">psql -f globals.sql</code> → <code class="i">createdb</code> → <code class="i">pg_restore</code> → check <code class="i">exit=0</code> → spot-check grants with <code class="i">\\dp</code>.'])}` },

  { t: 'Trap: pg_dump and the server must agree on versions', body: `
${zm(sh(`$ pg_dump --version
pg_dump (PostgreSQL) 16.14
$ pg_dump -h pgc15-a -d ctshop -Fc -f x.dump        # server is 17.11
pg_dump: error: aborting because of server version mismatch
pg_dump: detail: server version: 17.11 (Debian 17.11-1.pgdg13+2); pg_dump version: 16.14 (Debian 16.14-1.pgdg13+1)
$ pg_restore -l custom.dump                          # pg_restore 16, file from 17
pg_restore: error: unsupported version (1.16) in file header`, { sm: true, hl: [4, 7] }), 1.05)}
${two(zm(sh(`# pg_dump 17 → server 16 → restore into 17
$ pg_dump -h pgc15-v16 -d cu16 -Fc -f tu16.dump
exit=0
;  Dumped from database version: 16.14
;  Dumped by pg_dump version: 17.11
     may_chu      | so_user
------------------+---------
 17.11 (Debian…)  |    5000`, { sm: true, hl: [4, 5, 8] }), 1.0),
  box('Rule', 'Older tools refuse newer servers and newer files. Use the <b>newest</b> pg_dump — the one of the <b>target</b> version. That is exactly how you upgrade: CuongThai’s production runs <b>PostgreSQL 16</b>; moving it to 17 = pg_dump <b>17</b> against 16, restore into 17.', 'xanh'))}` },

  { t: 'A dump is a snapshot — and an open transaction', giua: true, body: `
${two(zm(sh(`# while pg_dump runs (slowed to ~4 s):
$ psql -d ctshop -c "INSERT INTO blog.note …"
INSERT 0 1
$ psql -d ctshop -x -c "SELECT … FROM pg_stat_activity
      WHERE application_name = 'pg_dump'"
application_name | pg_dump
state            | active
mo_giao_dich     | 00:00:01.017461
backend_xmin     | 1016
query            | COPY shop.customers (id, …
$ … restore the dump into snap …
$ psql -d ctshop -Atc "SELECT count(*) FROM blog.note"
1001
$ psql -d snap   -Atc "SELECT count(*) FROM blog.note"
1000`, { sm: true, hl: [8, 9, 13, 15] }), 1.0),
  `<div>${steps([
    'pg_dump reads everything inside <b>one</b> transaction (MVCC, 11.2): a consistent photo, and writers are <b>not</b> blocked.',
    'The row inserted during the dump is in the live table (1001) but <b>not</b> in the dump (1000). Correct — and the reason 15.2 exists.',
    'The price: <code class="i">backend_xmin</code> pins old row versions for the whole run, so VACUUM cannot clean them (14.3). Dump a big database from a <b>replica</b> (15.3).',
  ])}</div>`, 'r46')}` },

  { t: 'Where a nightly dump stops being enough', giua: true, body: `
${rpoPic()}
${two(box('RPO — Recovery Point Objective', 'how much <b>data</b> you may lose. Nightly dump ⇒ up to <b>24 hours</b>.', 'bad'),
  box('RTO — Recovery Time Objective', 'how long you may be <b>down</b> while restoring. Grows with the size of the dump.', 'lam'))}
${P('Dumping more often does not fix it: every dump is a full read of the database. The fix is continuous — WAL archiving, lesson 15.2.', 21)}` },

  { t: 'Trap: a backup you have never restored is just a file', body: `
${zm(sh(`$ pg_dump -d ctshop_sai_ten | gzip > dem_qua.sql.gz; echo "exit=$?"
pg_dump: error: connection to server on socket "/var/run/postgresql/.s.PGSQL.5432" failed:
  FATAL:  database "ctshop_sai_ten" does not exist
exit=0
$ ls -l dem_qua.sql.gz
-rw-r--r-- 1 root root 20 Oct 26 01:39 dem_qua.sql.gz
$ [ -s dem_qua.sql.gz ] && echo "không rỗng ⇒ script báo Backup completed"
không rỗng ⇒ script báo Backup completed
$ set -o pipefail
$ pg_dump -d ctshop_sai_ten | gzip > dem_qua.sql.gz; echo "exit=$?"
exit=1`, { sm: true, hl: [4, 6, 8, 11] }), 1.0)}
${box('Read it twice', 'In a pipe, the shell reports the exit code of the <b>last</b> command — <code class="i">gzip</code>, which happily compressed nothing into a <b>20-byte</b> file. A “not empty” check passes. And <b>schedule a restore</b>, not just a dump.', 'bad')}
${two(sql(`set -euo pipefail              # a failing pipe fails
pg_dump -d ctshop -Fc -f "$F"  # no pipe: -Fc compresses
pg_dumpall --globals-only -f "$G"`, { sm: true, lang: 'bash' }), box('Safer', 'Then <b>alert</b> when the file is much smaller than yesterday’s.', 'xanh'), 'r64')}` },

  { t: 'Real example: how CuongThai backs up today', giua: true, body: `
${ctBackupPic()}
${P('From the repo (<code class="i">scripts/backup-cron.sh</code>, <code class="i">restore-test.sh</code>): a nightly plain dump through <code class="i">| gzip</code>, kept 30 days on the VPS and copied to a <b>private</b> R2 bucket, plus a script that restores into a throwaway container and counts rows. Solid basics — and an RPO of 24 hours, a pipe without <code class="i">pipefail</code>, no globals. 15.2 shows the next step.', 20)}` },

  { t: 'Exercise — dump one schema, restore it, prove it', body: `
${two(`<div>${steps([
    'Dump only schema <code class="i">blog</code> of <code class="i">ctshop</code>, custom format.',
    'Restore it into a new database <code class="i">bt_blog</code>; print the exit code.',
    'Prove it: row count of <code class="i">blog.note</code> + number of indexes in schema blog.',
  ])}${box('Hint', 'Filter at <b>dump</b> time (<code class="i">-n</code>), not with <code class="i">pg_restore -t</code> — you saw why.', '')}</div>`,
  zm(sh(`$ pg_dump -d ctshop -n blog -Fc -f blog.dump
$ createdb bt_blog && pg_restore -d bt_blog blog.dump
$ echo "exit=$?"
exit=0
$ psql -d bt_blog -c "SELECT count(*) AS so_note,
    (SELECT count(*) FROM pg_indexes
      WHERE schemaname = 'blog') AS so_chi_muc
    FROM blog.note"
 so_note | so_chi_muc
---------+------------
    1001 |          1
(1 row)`, { sm: true, hl: [4, 11] }), 1.08), 'r46')}
${P('1001 rows = the live table today (one row was added during the snapshot demo), and <b>1</b> index = <code class="i">note_pkey</code> came back.', 20)}` },

  { t: 'Self-check', to: true, giua: true, body: `
<ol>
<li>Why prefer <code class="i">pg_dump -Fc</code> over the default plain format?</li>
<li>You restore a dump on a new server and get <i>role "app_ro" does not exist</i>. What was missing?</li>
<li>Backups run nightly at 02:00. The disk dies at 01:59. How much data is lost, and what fixes it?</li>
</ol>
${box('Answers', '1 · Compressed (16M → 3.9M here) <b>and</b> it has a table of contents: list, pick, reorder, restore in parallel. &nbsp; 2 · Roles live in the cluster, not in a database — restore <code class="i">pg_dumpall --globals-only</code> first. &nbsp; 3 · Almost 24 hours (the RPO you chose). WAL archiving + PITR (15.2).', 'xanh')}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li><b>Logical</b> = a photo in SQL: portable, selective, crosses versions. <b>Physical</b> = files + WAL: any second.</li>
<li><code class="i">-Fc</code> by default · <code class="i">-Fd -j</code> for big databases · plain only to read or diff</li>
<li>Filter with <code class="i">pg_dump -n/-t</code>; check <code class="i">pg_restore</code>’s exit code; dump <b>globals</b> too</li>
<li>Use the <b>newest</b> pg_dump · a dump is a snapshot holding one transaction</li>
<li>A backup is only real once you have <b>restored</b> it</li>
</ul>
${box('Next — 15.2', 'WAL and point-in-time recovery: we drop a table on purpose, then bring it back to one second before the mistake.', 'lam')}` },
]);
