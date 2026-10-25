/**
 * pg-15-2 — PostgreSQL · Chapter 15 · Lesson 15.2 "WAL and point-in-time recovery" (slide EN, kiểu FU, 26/10/2026, agent c15).
 * Nguồn: s15-sao-luu-nhan-ban.mjs › postgresql-15-2-wal-pitr. Output = chạy thật PostgreSQL 17.11 trong container tạm pgc15-pitr (archive_mode=on)
 * + pgc15-pitr2/3 (khôi phục): video-bai-giang/src/khung/pg/that/pg-15-2.out.txt (+ .sql). Log máy chủ = docker logs thật.
 * Bổ sung so với web: sổ thu ngân (đời thường), thứ tự ghi WAL, tên tệp WAL, crash kill -9 thật (500 commit còn, 300 chưa commit mất),
 * checkpoint thật + cấu hình compose thật của CuongThai, MỘT VÒNG PITR THẬT (base backup → 2.000 đơn → DROP TABLE 02:15:17.659 → khôi phục
 * về 02:15:16 ⇒ 12.500 đơn trở lại), bẫy tạm dừng giữ khoá (pg_locks thật), pg_waldump + recovery_target_lsn, timeline 2 + .history,
 * slot bỏ quên 406 MB ⇒ max_slot_wal_keep_size ⇒ lost, archive_command hỏng (.ready dồn), tham số -c thắng ALTER SYSTEM.
 */
import { lamDeck, sql, psql, sh, run, two, box, kw, cards, steps, c, tbl } from './_pg-chung.mjs';
import { ledgerPic, walFlowPic, walNamePic, pitrPic, timelinePic } from './pg-15-hinh.mjs';

const zm = (h, z = 1.2) => `<div style="zoom:${z}">${h}</div>`;
const P = (t, fs = 22) => `<p style="font-size:${fs}px;margin:0">${t}</p>`;
export const deck = { key: 'pg-15-2', code: 'PG 15.2', title: 'WAL and point-in-time recovery', sub: 'LSN · checkpoint · archiving · PITR' };

export const slides = lamDeck({ chuong: 'Chapter 15 — Backup, replication & scaling', bai: '15.2' }, [
  { cover: true, t: 'WAL and<br>point-in-time recovery', sub: 'the write-ahead log, LSN, checkpoints, archiving —<br>and bringing back a dropped table, for real' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>What the <b>write-ahead log</b> is, and why it makes <code class="i">COMMIT</code> survive a power cut</li>
<li><b>LSN</b>, WAL segments, checkpoints — measured, and a real <code class="i">kill -9</code></li>
<li><b>Archiving</b> WAL with <code class="i">archive_mode</code> / <code class="i">archive_command</code></li>
<li>One full <b>PITR</b> run: base backup → <code class="i">DROP TABLE</code> → back to one second before</li>
<li>Two outages waiting to happen: a forgotten <b>slot</b>, a broken <b>archive_command</b></li>
</ul>
${box('From 15.1', 'A nightly dump loses up to 24 hours. This lesson turns that into <b>seconds</b> — the camera, not the photo.', 'lam')}` },

  { t: 'Everyday example first: the cashier’s ledger', giua: true, body: `
${ledgerPic()}
${P('A careful cashier writes every sale in the ledger <b>first</b>, says “done”, and tidies the cash drawer later. Appending one line is fast; tidying is slow. If the power fails, the ledger tells exactly what to redo. PostgreSQL works the same way — the ledger is the <b>WAL</b>.')}` },

  { t: 'The write-ahead log: log first, data later', giua: true, body: `
${walFlowPic()}
${steps([
    'Every change becomes a WAL <b>record</b>. At <code class="i">COMMIT</code> the record is written to <code class="i">pg_wal/</code> and <b>fsync</b>ed — only then does the client hear “COMMIT”.',
    'The changed data page stays in memory (<code class="i">shared_buffers</code>) and reaches the data files <b>later</b>, in big efficient batches.',
    'After a crash, replaying the WAL rebuilds every committed change. That is ACID’s <b>D</b> (1.2) — and the raw material for replicas (15.3) and PITR.',
  ])}` },

  { t: 'Look at it: wal_level, segments, LSN', body: `
${two(zm(psql(`SHOW wal_level;
 wal_level
-----------
 replica
SHOW wal_segment_size;
 wal_segment_size
------------------
 16MB
SELECT pg_current_wal_lsn(),
       pg_walfile_name(pg_current_wal_lsn());
 pg_current_wal_lsn |     pg_walfile_name
--------------------+--------------------------
 0/20000A0          | 000000010000000000000002`, { sm: true, hl: [4, 8, 13] }), 1.0),
  `<div>${box('LSN — Log Sequence Number', 'A <b>byte position</b> in the WAL stream: <code class="i">0/20000A0</code>. Every change has one; replicas report how far they replayed as one; recovery targets can be one. The clock the whole system runs on.', 'lam')}
<table class="t" style="font-size:18px;margin-top:10px"><tr><th>wal_level</th><th>enough for</th></tr>
<tr><td><code class="i">minimal</code></td><td>crash recovery only</td></tr>
<tr><td><code class="i">replica</code> (default)</td><td>+ replicas, archiving, PITR</td></tr>
<tr><td><code class="i">logical</code></td><td>+ logical replication (15.3)</td></tr></table></div>`, 'r46')}
${walNamePic()}` },

  { t: 'Watch the LSN move as you write', giua: true, body: `
${two(zm(run(`SELECT pg_current_wal_lsn() AS truoc \\gset
INSERT INTO orders (customer, total)
SELECT 'kh' || g, (g % 500) + 0.99
FROM generate_series(1, 10000) g;
SELECT :'truoc' AS lsn_truoc,
       pg_current_wal_lsn() AS lsn_sau,
       pg_size_pretty(pg_wal_lsn_diff(
         pg_current_wal_lsn(), :'truoc')) AS wal_sinh_ra;`, `INSERT 0 10000
 lsn_truoc |  lsn_sau  | wal_sinh_ra
-----------+-----------+-------------
 0/247EE48 | 0/25FFE68 | 1540 kB
(1 row)`, { hlOut: [4] }), 1.05),
  `<div>${zm(sh(`$ ls -l $PGDATA/pg_wal
16777216 000000010000000000000002
16777216 000000010000000000000003
archive_status/
$ psql -c "SELECT pg_size_pretty(
    pg_total_relation_size('orders'))"
 864 kB`, { sm: true, hl: [7] }), 1.05)}</div>`, 'r64')}
${box('Read the numbers', '10,000 rows produced <b>1540 kB</b> of WAL — more than the table + index themselves (<b>864 kB</b>): the log also records index changes and whole pages written for the first time after a checkpoint. WAL volume is a real cost.', '')}` },

  { t: 'A real crash: kill -9 in the middle of a transaction', body: `
${zm(sh(`# 500 rows committed · another session: BEGIN; INSERT 300 rows; pg_sleep(60) …
$ docker kill -s KILL pgc15-pitr; docker start pgc15-pitr
LOG:  database system was interrupted; last known up at 2026-10-26 02:12:39 +07
LOG:  database system was not properly shut down; automatic recovery in progress
LOG:  redo starts at 0/20000A0
LOG:  redo done at 0/2620400 system usage: CPU: user: 0.01 s, system: 0.00 s, elapsed: 0.04 s
LOG:  checkpoint complete: wrote 1094 buffers (6.7%); … lsn=0/2620448, redo lsn=0/2620448
LOG:  database system is ready to accept connections
 da_commit | chua_commit | tong
-----------+-------------+-------
       500 |           0 | 10500`, { sm: true, hl: [5, 6, 11] }), 1.0)}
${two(box('What you just saw', 'No shutdown, no warning — and PostgreSQL replayed the WAL from the last checkpoint in <b>0.04 s</b>. All 500 committed rows are there.', 'xanh'),
  box('And the other 300?', 'They were never committed, so recovery leaves them invisible: <b>0</b>. Durability for COMMIT, atomicity for everything else.', 'lam'))}` },

  { t: 'Checkpoints: how far back recovery must start', giua: true, body: `
${two(zm(psql(`SELECT checkpoint_lsn, redo_lsn, checkpoint_time
FROM pg_control_checkpoint();
 checkpoint_lsn | redo_lsn  |    checkpoint_time
----------------+-----------+------------------------
 0/2620448      | 0/2620448 | 2026-10-26 02:14:05+07
CHECKPOINT;
 checkpoint_lsn | redo_lsn  |    checkpoint_time
----------------+-----------+------------------------
 0/2620550      | 0/26204F8 | 2026-10-26 02:14:34+07`, { sm: true, hl: [5, 9] }), 1.0),
  `<div>${steps([
    'A <b>checkpoint</b> writes every dirty page to the data files and records “WAL before this point is no longer needed for crash recovery”.',
    'Crash recovery starts at the <b>redo LSN</b> of the last checkpoint — that is the “last known up at” in the log.',
    'Old segments are then recycled — unless something still needs them: an archive, a replica, a slot.',
  ])}</div>`, 'r46')}
${box('CuongThai’s real settings (docker-compose.yml)', '<code class="i">max_wal_size=2GB</code> · <code class="i">min_wal_size=256MB</code> · <code class="i">checkpoint_completion_target=0.9</code> · <code class="i">wal_buffers=16MB</code> — fewer, smoother checkpoints on a small VPS.', 'lam')}` },

  { t: 'Archiving: keep WAL beyond its own lifetime', giua: true, body: `
${two(zm(sql(`# postgresql.conf (here: docker run … -c)
archive_mode    = on
archive_command = 'test ! -f /archive/%f
                   && cp %p /archive/%f'
#   %p = path of the segment, %f = its file name`, { sm: true, lang: 'bash', hl: [2, 3] }), 1.1),
  zm(psql(`SELECT archived_count, last_archived_wal,
       last_archived_time, failed_count
FROM pg_stat_archiver;
 archived_count |    last_archived_wal     | failed_count
----------------+--------------------------+--------------
              4 | 000000010000000000000004 |            0
$ ls /archive
000000010000000000000001  …02  …03  …04
000000010000000000000003.00000028.backup`, { sm: true, hl: [5] }), 1.0))}
${steps([
    'Every finished 16 MB segment is handed to <code class="i">archive_command</code>. Exit code 0 = safely stored; anything else = PostgreSQL <b>keeps</b> the file and retries.',
    'In production the target is <b>another machine</b> or object storage (S3, R2) — an archive on the same disk dies with it.',
  ])}` },

  { t: 'PITR = base backup + every WAL segment since + a target', giua: true, body: `
${pitrPic()}
${P('The real run of this lesson: a base backup at 02:14:35, then 2,000 orders committed at 02:15:14, then someone runs <code class="i">DROP TABLE orders</code> at 02:15:17.659. Goal: replay the archive and stop at <b>02:15:16</b> — one second before the mistake.', 21)}` },

  { t: 'Step 1 — the base backup: pg_basebackup', body: `
${zm(sh(`$ time pg_basebackup -D /backup/base -X stream -P -v
pg_basebackup: initiating base backup, waiting for checkpoint to complete
pg_basebackup: checkpoint completed
pg_basebackup: write-ahead log start point: 0/3000028 on timeline 1
pg_basebackup: created temporary replication slot "pg_basebackup_58"
31810/31810 kB (100%), 1/1 tablespace
pg_basebackup: write-ahead log end point: 0/3000120
pg_basebackup: base backup completed
real 3.057s
$ cat /backup/base/backup_label
START WAL LOCATION: 0/3000028 (file 000000010000000000000003)
CHECKPOINT LOCATION: 0/3000080
START TIME: 2026-10-26 02:14:35 +07`, { sm: true, hl: [4, 7, 11] }), 1.02)}
${two(box('A copy of the files, taken live', 'The server kept serving while the 47 MB data directory was copied. <code class="i">-X stream</code> also copies the WAL written <b>during</b> the copy, so the backup is consistent on its own.', 'xanh'),
  box('backup_label', 'Remembers where replay must begin: <b>0/3000028</b>, in segment …03. Without it a copy of a running server is just a pile of half-written files.', 'lam'))}` },

  { t: 'Step 2 — the accident', giua: true, body: `
${two(zm(psql(`INSERT INTO orders (customer, total)
SELECT 'sau-backup-' || g, 19.99
FROM generate_series(1,2000) g;
INSERT 0 2000
SELECT count(*) AS so_don FROM orders;
 so_don
--------
  12500
DROP TABLE orders;
DROP TABLE
SELECT count(*) FROM orders;
ERROR:  relation "orders" does not exist`, { sm: true, hl: [8, 9, 12] }), 1.05),
  zm(sh(`# when exactly? ask the server log
# (log_statement = ddl)
$ docker logs pgc15-pitr | grep "DROP TABLE"
2026-10-26 02:15:17.658 +07 [80] LOG:
  statement: DROP TABLE orders;
$ psql -c "SELECT pg_switch_wal()"
 0/405EBB0
 archived_count | last_archived_wal
----------------+--------------------------
              4 | 000000010000000000000004`, { sm: true, hl: [4, 10] }), 1.05))}
${P('2,000 orders exist <b>only</b> in the WAL — the base backup is older. <code class="i">pg_switch_wal()</code> closes the current segment so it reaches the archive; in a real outage you also copy whatever is left in the old <code class="i">pg_wal/</code>.', 21)}` },

  { t: 'Step 3 — restore: base backup + recovery settings', giua: true, body: `
${two(zm(sh(`# new, empty data directory ← the base backup
$ cp -a /backup/base/. /data/
$ cat >> /data/postgresql.auto.conf
restore_command = 'cp /archive/%f %p'
recovery_target_time = '2026-10-26 02:15:16+07'
$ touch /data/recovery.signal
$ docker run … -v pgc15-data2:/var/lib/postgresql/data postgres:17`, { sm: true, hl: [4, 5, 6] }), 1.05),
  `<div>${steps([
    'Never restore over the broken server — use a <b>new</b> data directory (here: a new volume + container).',
    '<code class="i">restore_command</code>: how to fetch an archived segment (the mirror of archive_command).',
    '<code class="i">recovery_target_time</code>: where to stop. <code class="i">recovery.signal</code>: an empty file that means “start in recovery”.',
  ])}</div>`, 'r46')}
${box('What the server does on start', 'Sees <code class="i">recovery.signal</code> → fetches each segment with <code class="i">restore_command</code> → replays → stops at the target → <b>pauses</b> (<code class="i">recovery_target_action = pause</code>, the default), so you can look before you commit to it.', 'lam')}` },

  { t: 'Step 4 — read the recovery log', body: `
${zm(sh(`LOG:  starting backup recovery with redo LSN 0/3000028, checkpoint LSN 0/3000080, on timeline ID 1
LOG:  restored log file "000000010000000000000003" from archive
LOG:  starting point-in-time recovery to 2026-10-26 02:15:16+07
LOG:  redo starts at 0/3000028
LOG:  restored log file "000000010000000000000004" from archive
LOG:  consistent recovery state reached at 0/3000120
LOG:  database system is ready to accept read-only connections
LOG:  restored log file "000000010000000000000005" from archive
cp: cannot stat '/archive/000000010000000000000006': No such file or directory
LOG:  recovery stopping before commit of transaction 756, time 2026-10-26 02:15:17.659619+07
LOG:  pausing at the end of recovery
HINT:  Execute pg_wal_replay_resume() to promote.`, { sm: true, title: 'docker logs pgc15-pitr2 (real)', hl: [3, 10, 11] }), 1.0)}
${two(box('It stopped exactly in the right place', '“before commit of transaction 756, time 02:15:17.659619” — the DROP. Everything committed before it was replayed.', 'xanh'),
  box('The “cannot stat” lines are normal', 'Recovery asks the archive for the next file until there is none. A missing file is how it learns it has reached the end.', 'lam'))}` },

  { t: 'Paused at the target — and a trap', giua: true, body: `
${two(zm(psql(`SELECT pg_is_in_recovery(), pg_get_wal_replay_pause_state();
 pg_is_in_recovery | pg_get_wal_replay_pause_state
-------------------+-------------------------------
 t                 | paused
SELECT count(*) FROM orders;      -- hangs …
SELECT relation::regclass, mode, granted, pid FROM pg_locks …;
 relation |        mode         | granted | pid
----------+---------------------+---------+-----
 orders   | AccessShareLock     | f       |  47
 orders   | AccessExclusiveLock | t       |  30   ← startup`, { sm: true, hl: [4, 5, 10] }), 1.0),
  zm(psql(`SELECT pg_wal_replay_resume();
LOG:  selected new timeline ID: 2
LOG:  archive recovery complete
LOG:  database system is ready to accept connections
SELECT pg_is_in_recovery();          -- f
SELECT count(*) AS so_don,
  count(*) FILTER (WHERE customer
    LIKE 'sau-backup-%') AS ghi_sau_backup
FROM orders;
 so_don | ghi_sau_backup
--------+----------------
  12500 |           2000`, { sm: true, hl: [2, 12] }), 1.0))}
${box('Why the SELECT hung', 'Recovery stopped <i>before the DROP commits</i>, but the DROP had already taken its lock in the WAL — so the startup process still holds <b>AccessExclusiveLock</b> on orders. After <code class="i">pg_wal_replay_resume()</code> transaction 756 never commits: the table is back, all <b>12,500</b> rows, including the 2,000 written after the backup.', '')}` },

  { t: 'More precise: find the LSN with pg_waldump', body: `
${zm(sh(`$ pg_waldump /archive/000000010000000000000004      # excerpt: tx 755, 756
rmgr: Transaction … tx: 755, lsn: 0/040525A8 … desc: COMMIT 2026-10-26 02:15:14.539429 +07
rmgr: Standby     … tx: 756, lsn: 0/040525D0 … desc: LOCK xid 756 db 16388 rel 16390
rmgr: Heap        … tx: 756, lsn: 0/040526C0 … desc: DELETE xmax: 756 … rel 1663/16388/2610
rmgr: Transaction … tx: 756, lsn: 0/0405E4B0 … desc: COMMIT 2026-10-26 02:15:17.659619 +07; rels: …
# recovery_target_lsn = '0/040525D0' · recovery_target_inclusive = off
LOG:  recovery stopping before WAL location (LSN) "0/40525D0"
 pg_is_in_recovery | pg_get_wal_replay_pause_state
 t                 | paused
 so_don | ghi_sau_backup
  12500 |           2000          ← readable while paused`, { sm: true, hl: [3, 6, 7, 11] }), 1.0)}
<table class="t" style="font-size:18px"><tr><th>recovery_target_…</th><th>stops at</th><th>also</th></tr>
<tr><td><code class="i">_time</code></td><td>a commit after this time</td><td rowspan="2"><code class="i">_inclusive</code> on/off · <code class="i">_action</code> = pause (default) / promote / shutdown</td></tr>
<tr><td><code class="i">_lsn</code> · <code class="i">_xid</code> · <code class="i">_name</code></td><td>a WAL position · a transaction · <code class="i">pg_create_restore_point('truoc_migration')</code></td></tr></table>` },

  { t: 'After recovery: a new timeline', giua: true, body: `
${timelinePic()}
${two(zm(sh(`$ ls /archive
000000010000000000000004
000000010000000000000005
00000002.history
$ cat /archive/00000002.history
1	0/405E4B0	before 2026-10-26 02:15:17.659619+07
$ psql -Atc "SELECT pg_walfile_name(pg_current_wal_lsn())"
000000020000000000000004`, { sm: true, hl: [4, 6, 8] }), 1.0),
  box('Why a timeline', 'The restored server writes new history that <b>differs</b> from the old one after 0/405E4B0. Its WAL files start with <code class="i">00000002</code>, so they never overwrite timeline 1 in the archive — you could even recover again to a different point.', 'lam'), 'r64')}` },

  { t: 'Trap: a forgotten replication slot fills the disk', giua: true, body: `
${two(zm(psql(`SELECT * FROM pg_create_physical_replication_slot(
  'ban_sao_bo_quen', true);
-- nobody ever connects to it … the app keeps writing
SELECT slot_name, active, wal_status,
  pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(),
    restart_lsn)) AS giu_lai FROM pg_replication_slots;
    slot_name    | active | wal_status | giu_lai
-----------------+--------+------------+---------
 ban_sao_bo_quen | f      | reserved   | 406 MB
 pg_wal | so_tep
--------+--------
 432 MB |     28`, { sm: true, hl: [9, 12] }), 1.0),
  zm(psql(`ALTER SYSTEM SET max_slot_wal_keep_size = '64MB';
SELECT pg_reload_conf();  CHECKPOINT;
LOG:  invalidating obsolete replication slot "ban_sao_bo_quen"
DETAIL:  The slot's restart_lsn 0/405E4B0 exceeds
  the limit by 351935312 bytes.
    slot_name    | active | wal_status
-----------------+--------+------------
 ban_sao_bo_quen | f      | lost
 pg_wal | so_tep
--------+--------
 112 MB |      8`, { sm: true, hl: [3, 8, 11] }), 1.0))}
${box('An outage nobody caused', 'A slot promises to keep <b>every</b> segment its consumer has not confirmed. Consumer gone ⇒ WAL grows forever ⇒ disk full ⇒ PostgreSQL cannot write WAL ⇒ cannot commit anything. Set <code class="i">max_slot_wal_keep_size</code>, and alert on <code class="i">active = f</code> with a growing size.', 'bad')}` },

  { t: 'Trap: an archive_command that fails quietly', giua: true, body: `
${two(zm(sh(`# the archive target becomes unwritable …
LOG:  archive command failed with exit code 1
DETAIL:  The failed archive command was: test ! -f
  /archive/0…020 && cp pg_wal/0…020 /archive/0…020
cp: cannot create regular file '/archive/…020':
  Permission denied
$ ls pg_wal/archive_status | grep ready
000000020000000000000020.ready
000000020000000000000021.ready
000000020000000000000022.ready`, { sm: true, hl: [2, 8, 9, 10] }), 1.0),
  zm(psql(`SELECT archived_count, failed_count,
       last_failed_wal FROM pg_stat_archiver;
 archived_count | failed_count | last_failed_wal
----------------+--------------+------------------
             29 |            6 | 0…020
-- fixed; ~1 minute later the backlog drains:
 archived_count | failed_count | last_archived_wal
----------------+--------------+------------------
             32 |            6 | 0…022`, { sm: true, hl: [5, 9] }), 1.0))}
${box('Same disease, slower', 'Failed segments wait as <code class="i">.ready</code> files and are retried — correct, and also how a broken target fills <code class="i">pg_wal</code>. Watch <code class="i">failed_count</code>. Side lesson from this run: a setting passed with <code class="i">-c</code> on the command line (as CuongThai’s compose does) <b>beats</b> <code class="i">ALTER SYSTEM</code> — <code class="i">pg_settings.source = command line</code>.', 'bad')}` },

  { t: 'In practice: use a tool — and CuongThai’s next step', giua: true, body: `
${cards([
    ['pgBackRest', 'Full / differential / incremental backups, parallel, compressed, encrypted, S3-compatible, and it <b>verifies</b> what it stores.'],
    ['WAL-G', 'Base backups + continuous WAL push to object storage (S3 / R2 / GCS). Small, a good fit for one VPS.'],
    ['Rehearsal', 'A scheduled restore into a throwaway server, with a row count — like CuongThai’s <code class="i">restore-test.sh</code>, but to a point in time.'],
  ])}
${two(box('CuongThai today (15.1)', 'Nightly <code class="i">pg_dump</code> → R2 private bucket. RPO ≈ <b>24 h</b>.', 'bad'),
  box('Next step', '<code class="i">archive_mode=on</code> + WAL-G pushing every segment to the private R2 bucket + a weekly base backup. RPO ≈ <b>one segment / a few minutes</b>.', 'xanh'))}` },

  { t: 'Exercise — read your own LSN advance', giua: true, body: `
${two(`<div>${steps([
    'Remember the current LSN in a psql variable.',
    'Insert 1,000 rows into <code class="i">orders</code>.',
    'Print: LSN before, LSN after, how many <b>bytes</b> of WAL, and which <b>WAL file</b> you are in now.',
  ])}${box('Hint', '<code class="i">\\gset</code>, <code class="i">pg_wal_lsn_diff()</code>, <code class="i">pg_walfile_name()</code>.', '')}</div>`,
  zm(run(`SELECT pg_current_wal_lsn() AS a \\gset
INSERT INTO orders (customer, total)
SELECT 'bt-' || g, 5
FROM generate_series(1, 1000) g;
SELECT :'a' AS truoc, pg_current_wal_lsn() AS sau,
  pg_wal_lsn_diff(pg_current_wal_lsn(), :'a') AS so_byte,
  pg_walfile_name(pg_current_wal_lsn()) AS tep_wal;`, `INSERT 0 1000
   truoc    |    sau     | so_byte |         tep_wal
------------+------------+---------+--------------------------
 0/230000B8 | 0/2302AB98 |  174816 | 000000020000000000000023
(1 row)`, { hlOut: [4] }), 1.0), 'r46')}
${P('≈ 171 kB of WAL for 1,000 rows — and the file name starts with <b>00000002</b>: this server is on timeline 2, after the recovery.', 20)}` },

  { t: 'Self-check & summary', giua: true, body: `
${two(`<ol style="font-size:23px;margin:0;padding-left:26px">
<li>Why can PostgreSQL answer “COMMIT” before the data file is written?</li>
<li>What three things does PITR need?</li>
<li>A slot shows <code class="i">active = f</code> and grows every day. What happens next?</li>
</ol>
${box('Answers', '1 · The WAL record is fsynced first; replay rebuilds the page. &nbsp;2 · A base backup, every WAL segment since, a target. &nbsp;3 · <code class="i">pg_wal</code> fills the disk and the server stops committing — drop the slot or cap it.', 'xanh')}`,
  `<ul style="font-size:23px;margin:0">
<li><b>WAL</b>: log first (fsync at COMMIT), data later</li>
<li><b>LSN</b> = a byte position; 16 MB segments; checkpoints bound crash recovery</li>
<li><b>Archive</b> every segment to another machine</li>
<li><b>PITR</b> = base backup + WAL + target; check the log, then resume</li>
<li>Watch <b>slots</b> and <code class="i">failed_count</code></li>
</ul>
${box('Next — 15.3', 'The same WAL, streamed live to a second server: replication.', 'lam')}`)}` },
]);
