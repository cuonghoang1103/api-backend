/**
 * pg-15-3 — PostgreSQL · Chapter 15 · Lesson 15.3 "Streaming replication, built for real" (slide EN, kiểu FU, 26/10/2026, agent c15).
 * Nguồn: s15-sao-luu-nhan-ban.mjs › postgresql-15-3-nhan-ban. Output = chạy thật PostgreSQL 17.11 trong HAI container tạm (pgc15-pri primary +
 * pgc15-std standby, mạng docker riêng) và hai container logical (pgc15-pub / pgc15-sub): video-bai-giang/src/khung/pg/that/pg-15-3.out.txt.
 * Bổ sung so với web (web cũ chạy 16.13 trên hai cụm cổng 5433/5434): chính tả (đời thường), sơ đồ walsender → walreceiver → startup,
 * pg_basebackup đợi checkpoint 100 s (-c fast), mật khẩu nằm trong postgresql.auto.conf, bốn LSN, độ trễ NHÌN THẤY (68 MB, 18 s),
 * replay_lag đánh lừa, async 0,520 s vs sync 0,955 s / 1000 commit, sync treo 68 s mặc statement_timeout, xung đột recovery thật,
 * failover pg_promote + timeline 2, SPLIT BRAIN thật + pg_rewind cần checksums/wal_log_hints, logical replication thật (xung đột khoá, DDL).
 */
import { lamDeck, sql, psql, sh, run, two, box, kw, cards, steps, c, tbl } from './_pg-chung.mjs';
import { dictationPic, streamPic, lsnBarPic, syncPic, splitPic } from './pg-15-hinh.mjs';

const zm = (h, z = 1.2) => `<div style="zoom:${z}">${h}</div>`;
const P = (t, fs = 22) => `<p style="font-size:${fs}px;margin:0">${t}</p>`;
export const deck = { key: 'pg-15-3', code: 'PG 15.3', title: 'Streaming replication, built for real', sub: 'primary · standby · lag · failover · logical' };

export const slides = lamDeck({ chuong: 'Chapter 15 — Backup, replication & scaling', bai: '15.3' }, [
  { cover: true, t: 'Streaming replication,<br>built for real', sub: 'two real servers: a primary and a standby —<br>lag you can see, failover, split brain, logical replication' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>How a <b>standby</b> follows a primary by replaying its WAL — built with two real containers</li>
<li>Reading <code class="i">pg_stat_replication</code>: four LSNs and how to <b>see lag</b></li>
<li><b>async vs sync</b>: what each costs, and how sync can freeze every commit</li>
<li><b>Failover</b> with <code class="i">pg_promote()</code> — and the split brain that follows a careless one</li>
<li><b>Logical</b> replication: one table, to a server that stays writable</li>
</ul>
${box('From 15.2', 'A replica is the same WAL as PITR — just streamed <b>live</b> instead of archived and replayed later.', 'lam')}` },

  { t: 'Everyday example first: a dictation', giua: true, body: `
${dictationPic()}
${P('The teacher (primary) reads every sentence (WAL record); the student (standby) writes it down a moment later. The student can read the copy to others — read queries — but never adds a sentence of their own. And if the teacher loses her voice, the student can take over.')}` },

  { t: 'How streaming replication works', giua: true, body: `
${streamPic()}
${steps([
    'The primary writes WAL as usual. A <b>walsender</b> process streams it to each standby over a replication connection.',
    'On the standby a <b>walreceiver</b> writes and flushes the same bytes into its own <code class="i">pg_wal</code>; the <b>startup process</b> replays them into the data files — forever “in recovery”.',
    'A <b>replication slot</b> on the primary keeps WAL the standby has not confirmed yet (15.2: and the danger of forgetting one).',
  ])}` },

  { t: 'Build it — 1: prepare the primary', giua: true, body: `
${two(zm(sql(`-- pg_hba.conf: allow the replication connection
host  replication  replicator  all  scram-sha-256

SELECT pg_reload_conf();
CREATE ROLE replicator WITH REPLICATION LOGIN
  PASSWORD '…';
SELECT * FROM
  pg_create_physical_replication_slot('ban_sao_1');`, { sm: true, hl: [2, 5, 8] }), 1.12),
  zm(psql(`CREATE ROLE
 slot_name | lsn
-----------+-----
 ban_sao_1 |
CREATE DATABASE blog; …
INSERT 0 1000      -- 1000 notes`, { sm: true, title: 'psql (17.11) — pgc15-pri' }), 1.15))}
${steps([
    'A dedicated role with the <code class="i">REPLICATION</code> attribute — never let the standby log in as <code class="i">postgres</code>.',
    'A line in <code class="i">pg_hba.conf</code>: replication connections are a separate “database” called <code class="i">replication</code>.',
    'A slot, so the primary keeps WAL while the standby is being built.',
  ])}` },

  { t: 'Build it — 2: pg_basebackup -R', body: `
${zm(sh(`$ pg_basebackup -h pgc15-pri -U replicator -D /var/lib/postgresql/data \\
      -S ban_sao_1 -R -X stream -P
waiting for checkpoint
   71/31135 kB (0%), 0/1 tablespace
31146/31146 kB (100%), 1/1 tablespace
real 99.988s
$ ls /var/lib/postgresql/data/standby.signal
-rw------- 1 postgres postgres 0 Oct 25 19:53 standby.signal
$ cat /var/lib/postgresql/data/postgresql.auto.conf
primary_conninfo = 'user=replicator password=… host=''pgc15-pri'' port=5432 …'
primary_slot_name = 'ban_sao_1'`, { sm: true, hl: [3, 6, 8, 10, 11] }), 1.05)}
${two(box('Two flags do the magic', '<code class="i">-R</code> writes <code class="i">primary_conninfo</code> + creates the empty <code class="i">standby.signal</code> — its presence makes this a standby. <code class="i">-X stream</code> copies the WAL written during the copy.', 'xanh'),
  box('Two surprises', '100 s of “waiting for checkpoint” for 31 MB: by default it waits for a <b>spread</b> checkpoint — add <code class="i">-c fast</code>. And the password sits in plain text in <code class="i">postgresql.auto.conf</code> — prefer a <code class="i">.pgpass</code> file.', 'bad'))}` },

  { t: 'Start it and confirm what it is', body: `
${zm(sh(`$ docker logs pgc15-std
LOG:  starting backup recovery with redo LSN 0/2000028, checkpoint LSN 0/2046DF8, on timeline ID 1
LOG:  entering standby mode
LOG:  redo starts at 0/2000028
LOG:  consistent recovery state reached at 0/2046E98
LOG:  database system is ready to accept read-only connections
LOG:  started streaming WAL from primary at 0/3000000 on timeline 1`, { sm: true, hl: [3, 6, 7] }), 1.0)}
${two(zm(psql(`SELECT pg_is_in_recovery() AS la_ban_sao;
 la_ban_sao
------------
 t
SELECT count(*) FROM note;
 count
-------
  1000`, { sm: true, title: 'psql (17.11) — pgc15-std', hl: [4, 8] }), 1.1),
  box('“in recovery”, permanently', '<code class="i">pg_is_in_recovery() = t</code> is the definitive test. Replaying WAL is not a start-up phase for a standby — it is its whole job. The 1000 notes arrived with the base backup.', 'lam'))}` },

  { t: 'Write on one, read on the other', giua: true, body: `
${two(zm(psql(`-- primary
INSERT INTO note (title, body)
VALUES ('Từ primary', 'ghi lúc ' || now());
INSERT 0 1
--- primary
1001 dòng · mới nhất: Từ primary
--- standby
1001 dòng · mới nhất: Từ primary`, { sm: true, hl: [6, 8], title: 'psql (17.11) — pgc15-pri' }), 1.08),
  zm(psql(`-- standby
INSERT INTO note (title, body)
VALUES ('thử ghi', 'x');
ERROR:  cannot execute INSERT in a read-only transaction`, { sm: true, title: 'psql (17.11) — pgc15-std', hl: [4] }), 1.0))}
${P('The row reached the standby within a second, with no application code involved. Writing to the standby is refused: a physical replica is a <b>byte-identical</b> copy, so it cannot accept independent writes — a structural limit, not a setting.')}` },

  { t: 'pg_stat_replication: four LSNs', giua: true, body: `
${two(zm(psql(`-- primary, \\x: SELECT application_name, … FROM pg_stat_replication;
application_name | walreceiver
client_addr      | 172.24.0.3
state            | streaming
sent_lsn         | 0/3005660
write_lsn        | 0/3005660
flush_lsn        | 0/3005660
replay_lsn       | 0/3005660
write_lag        | 00:00:00.000949
flush_lag        | 00:00:00.003371
replay_lag       | 00:00:00.003628
sync_state       | async`, { sm: true, hl: [5, 6, 7, 8, 12], title: 'psql (17.11) — pgc15-pri' }), 1.0),
  `<div>${steps([
    '<b>sent</b>: the primary has sent it.',
    '<b>write</b>: the standby has written it (OS cache).',
    '<b>flush</b>: the standby has fsynced it — survives a standby crash.',
    '<b>replay</b>: queries on the standby can now see it.',
  ])}${box('Healthy', '<code class="i">streaming</code>, all four equal, a few milliseconds of lag.', 'xanh')}</div>`, 'r46')}
${lsnBarPic({ vals: [['sent', 1], ['write', 1], ['flush', 1], ['replay', 1]], h: 152 })}` },

  { t: 'Make lag visible: pause the replay', giua: true, body: `
${two(zm(psql(`-- standby
SELECT pg_wal_replay_pause();
-- primary
INSERT INTO note … FROM generate_series(1, 200000) g;
INSERT 0 200000
SELECT application_name, state,
  pg_size_pretty(pg_wal_lsn_diff(sent_lsn, replay_lsn)) AS tre_byte,
  pg_wal_lsn_diff(sent_lsn, flush_lsn) AS chua_flush, replay_lag
FROM pg_stat_replication;
 walreceiver | streaming | 68 MB | 0 | 00:00:00.661019
-- primary 201001 rows · standby 1001 rows
SELECT now() - pg_last_xact_replay_timestamp();   -- standby
 00:00:18.340312`, { sm: true, hl: [10, 11, 13], title: 'psql (17.11) — pgc15-pri / pgc15-std' }), 0.98),
  `<div>${lsnBarPic({ w: 520, h: 152, vals: [['sent', 1], ['write', 1], ['flush', 1], ['replay', 0.08]] })}
${box('Measure lag in bytes (and seconds)', '68 MB behind, 18 s old, yet <code class="i">replay_lag</code> said 0.66 s: it reports the last <b>reply</b>, not the current backlog. Alert on <code class="i">pg_wal_lsn_diff(sent_lsn, replay_lsn)</code>. After <code class="i">pg_wal_replay_resume()</code>: 0 bytes, 201001 rows.', 'bad')}</div>`, 'r64')}` },

  { t: 'async vs sync: who waits for whom', giua: true, body: `
${syncPic()}
${two(zm(sh(`$ time psql -q -d blog -f k1000.sql    # 1000 commits, async
real 0.520s
ALTER SYSTEM SET synchronous_standby_names = 'walreceiver';
SELECT application_name, sync_state FROM pg_stat_replication;
 walreceiver      | sync
$ time psql -q -d blog -f k1000.sql    # same, sync
real 0.955s`, { sm: true, hl: [2, 5, 7] }), 1.0),
  box('The trade', '<b>async</b> (default): commit does not wait — fast, but a primary dying <i>now</i> can lose its last transactions. <b>sync</b>: commit waits until the standby flushed — no loss, but a network round trip inside <b>every</b> commit (here 1.8× on one host; far more across data centres).', ''), 'r64')}` },

  { t: 'Trap: a sync standby dies — every commit freezes', giua: true, body: `
${zm(psql(`-- synchronous_standby_names = 'walreceiver' · the standby is stopped
SET statement_timeout = '5s';
INSERT INTO note (title, body) VALUES ('khi bản sao chết', 'x');       -- hangs …
-- from another session, 68 s later:
 pid | wait_event_type | wait_event |       cho       | q
 213 | IPC             | SyncRep    | 00:01:08.178545 | INSERT INTO note …
SELECT pg_cancel_backend(213);
WARNING:  canceling wait for synchronous replication due to user request
DETAIL:  The transaction has already committed locally, but might not have been replicated to the standby.
INSERT 0 1`, { sm: true, hl: [2, 6, 8, 9], title: 'psql (17.11) — pgc15-pri' }), 1.0)}
${two(box('What you just saw', '<code class="i">statement_timeout</code> did <b>not</b> stop the wait. Cancelling did not undo the row either: it was already committed locally, just not confirmed by anyone.', 'bad'),
  box('So in production', 'Never one sync standby alone: use two and <code class="i">synchronous_standby_names = \'ANY 1 (s1, s2)\'</code>, and alert on <code class="i">wait_event = \'SyncRep\'</code>.', 'xanh'))}` },

  { t: 'What a replica does — and does not — solve', to: true, giua: true, body: `
${cards([
    ['✓ Read capacity', 'Reports, analytics, dashboards and <code class="i">pg_dump</code> (15.1) run on the standby; the primary keeps the writes.'],
    ['✓ Failover', 'Primary lost ⇒ promote the standby in seconds (next slides). Tools like <b>Patroni</b> or <b>repmgr</b> automate it.'],
    ['✗ Write capacity', 'Every write still goes through one primary; each standby even adds a little work. Writes scale with partitioning (15.4) or sharding.'],
    ['✗ Protection from mistakes', 'A replica copies your <code class="i">DROP TABLE</code> faithfully, within milliseconds. It is <b>not</b> a backup — PITR (15.2) is.'],
  ], 2)}
${box('One line to remember', 'Replication is the answer to <b>hardware</b> failure. Backups + PITR are the answer to <b>human</b> error. Production needs both.', 'lam')}` },

  { t: 'Trap: reading from a replica without thinking', giua: true, body: `
${two(`<div>${steps([
    '<b>Stale reads.</b> A user saves a form (primary), the redirect reads the standby (async, behind) — their change is “missing”, they submit again. Route reads that follow a write to the primary: <b>read your own writes</b>.',
    '<b>Cancelled queries.</b> A long query on the standby needs old row versions that VACUUM on the primary removes; replay must wait, then cancels you.',
  ])}</div>`,
  zm(psql(`-- standby, max_standby_streaming_delay = 2s
BEGIN ISOLATION LEVEL REPEATABLE READ;
SELECT count(*) AS lan_1 FROM note;
 lan_1
--------
 203002
SELECT pg_sleep(10);
-- meanwhile primary: DELETE 200000 rows; VACUUM
ERROR:  canceling statement due to conflict with recovery
DETAIL:  User query might have needed to see
  row versions that must be removed.`, { sm: true, title: 'psql (17.11) — pgc15-std', hl: [9, 10] }), 1.0))}
${box('Pick deliberately', '<code class="i">hot_standby_feedback = on</code> stops the cancellations — by making the standby hold back the primary’s VACUUM, i.e. bloat (14.3). A bigger <code class="i">max_standby_streaming_delay</code> lets replay fall behind instead. No setting gives you both.', '')}` },

  { t: 'Failover: pg_promote()', giua: true, body: `
${zm(sh(`$ docker stop pgc15-pri                       # the primary dies at 02:56:42
LOG:  replication terminated by primary server
DETAIL:  End of WAL reached on timeline 1 at 0/823E220.
FATAL:  could not connect to the primary server: … server closed the connection unexpectedly
LOG:  waiting for WAL to become available at 0/823E238
$ psql -c "SELECT pg_promote()"                -- on the standby
LOG:  received promote request
LOG:  selected new timeline ID: 2
LOG:  archive recovery complete
LOG:  database system is ready to accept connections
SELECT pg_is_in_recovery();   →  f
INSERT INTO note … ('sau failover');  →  INSERT 0 1`, { sm: true, hl: [3, 7, 8, 11, 12] }), 1.0)}
${P('Three seconds after the primary vanished, the standby was a writable primary on <b>timeline 2</b> (15.2). Then the hard part begins: every application must now connect to the new address — and the old primary must <b>never</b> come back as a primary.', 21)}` },

  { t: 'Trap: split brain — the old primary comes back', giua: true, body: `
${splitPic()}
${two(zm(sh(`$ docker start pgc15-pri                 # "it was just a reboot"
SELECT pg_is_in_recovery();  →  f
INSERT … ('ghi vào máy CŨ')  →  INSERT 0 1
$ pg_rewind --target-pgdata=… \\
    --source-server="host=pgc15-std …" --dry-run
pg_rewind: error: target server needs to use either
  data checksums or "wal_log_hints = on"`, { sm: true, hl: [3, 6, 7] }), 1.0),
  box('Prevention, not repair', '<b>Fence</b> the old primary (stop it for good, or remove it from the network) <i>before</i> promoting. To turn it back into a standby later, <code class="i">pg_rewind</code> needs <code class="i">initdb --data-checksums</code> or <code class="i">wal_log_hints = on</code> — set at creation, not after the incident. Patroni does the fencing for you.', 'bad'), 'r64')}` },

  { t: 'Logical replication: one table, row by row', giua: true, body: `
${two(zm(sql(`-- publisher (wal_level = logical)
CREATE PUBLICATION pub_products
  FOR TABLE products;

-- subscriber (a normal, writable server)
CREATE TABLE products (id int PRIMARY KEY,
  sku text NOT NULL, price numeric(12,2) NOT NULL);
CREATE SUBSCRIPTION sub_products
  CONNECTION 'host=pgc15-pub dbname=shop …'
  PUBLICATION pub_products;`, { sm: true, hl: [2, 8] }), 1.05),
  zm(psql(`NOTICE:  created replication slot "sub_products" on publisher
CREATE SUBSCRIPTION
SELECT count(*), max(price) FROM products;
 count |  max
-------+--------
   500 | 600.00
-- publisher: UPDATE id 1 (price × 2), INSERT 501
 id  |   sku   | price
-----+---------+--------
   1 | SKU-1   | 202.00
 501 | SKU-501 | 999.00
SELECT * FROM orders;
ERROR:  relation "orders" does not exist`, { sm: true, title: 'psql (17.11) — pgc15-sub', hl: [6, 10, 11, 13] }), 1.0))}
${P('Instead of bytes, the publisher decodes WAL into <b>row changes</b> for the tables you choose (orders was not published, so it never arrives). The initial copy took the 500 existing rows, then every change streams.', 21)}` },

  { t: 'Logical replication: writable, and therefore fragile', giua: true, body: `
${two(zm(psql(`-- subscriber: writable! (pg_is_in_recovery = f)
INSERT INTO products VALUES (9001, 'chi-o-sub', 1);
-- publisher: INSERT INTO products VALUES (9001, 'tu-pub', 2);
ERROR:  duplicate key value violates unique constraint
  "products_pkey"
DETAIL:  Key (id)=(9001) already exists.
SELECT subname, apply_error_count FROM pg_stat_subscription_stats;
 sub_products |                 4
-- fixed by DELETE 9001 on the subscriber ⇒ 'tu-pub' applied`, { sm: true, title: 'psql (17.11) — pgc15-sub', hl: [4, 6, 8] }), 1.0),
  zm(psql(`-- publisher: a schema change
ALTER TABLE products ADD COLUMN stock int DEFAULT 0;
INSERT INTO products VALUES (502, 'SKU-502', 5, 7);
-- subscriber log:
ERROR:  logical replication target relation
  "public.products" is missing replicated column: "stock"
-- subscriber: ALTER TABLE products ADD COLUMN stock …
 id  |   sku   | price | stock
-----+---------+-------+-------
 502 | SKU-502 |  5.00 |     7`, { sm: true, title: 'psql (17.11) — pgc15-sub', hl: [5, 6, 10] }), 1.0))}
${box('Two rules', 'A conflicting row <b>stops</b> the whole subscription (retrying forever while the publisher’s slot keeps WAL — 15.2’s trap again). And <b>DDL is not replicated</b>: change the subscriber’s schema first, then the publisher’s.', 'bad')}` },

  { t: 'Physical vs logical replication', giua: true, body: `
<table class="t">
<tr><th style="width:250px"></th><th>Physical (streaming)</th><th>Logical (publication / subscription)</th></tr>
<tr><td><b>Copies</b></td><td>the whole cluster, byte for byte</td><td>chosen tables, as row changes</td></tr>
<tr><td><b>Replica writable?</b></td><td><span class="do">✗ read-only</span></td><td><span class="xanh">✓ yes</span> — and conflicts are possible</td></tr>
<tr><td><b>Versions</b></td><td>same major version</td><td><span class="xanh">16 → 17 works</span> — near-zero-downtime upgrades</td></tr>
<tr><td><b>DDL, sequences</b></td><td>everything follows</td><td><span class="do">not replicated</span> — do it by hand</td></tr>
<tr><td><b>Needs</b></td><td><code class="i">wal_level = replica</code></td><td><code class="i">wal_level = logical</code> (restart)</td></tr>
<tr><td><b>Use it for</b></td><td>failover, read replicas</td><td>upgrades, feeding a reporting DB, change-data-capture</td></tr>
</table>` },

  { t: 'Real example: CuongThai and a replica', giua: true, body: `
${two(`<div>${steps([
    'Today: <b>one</b> PostgreSQL 16 container on <b>one</b> VPS (<code class="i">docker-compose.yml</code>), with nightly dumps to R2 (15.1). The VPS dies ⇒ the site is down until a restore finishes.',
    'A standby on a <b>second</b> machine (same Docker image, <code class="i">pg_basebackup -R</code>) turns that into a promote: minutes, not hours.',
    'Heavy read-only pages (feeds, reports, admin stats) could read from it — Prisma has an official <code class="i">@prisma/extension-read-replicas</code> for this — but only the ones that tolerate a little staleness.',
  ])}</div>`,
  `<div>${box('Costs to plan for', 'A second machine; monitoring of <b>bytes behind</b> and <b>slot size</b>; a written, rehearsed failover procedure (who promotes, how the app finds the new primary, how the old one is fenced).', '')}${box('Not a substitute', 'Keep the dumps and add WAL archiving (15.2): the replica would have copied a <code class="i">DROP TABLE</code> within milliseconds.', 'bad')}</div>`, 'r64')}` },

  { t: 'Exercise — measure replication lag', giua: true, body: `
${two(`<div>${steps([
    'On the <b>primary</b>, write one query that shows, per standby: name, state, how many <b>bytes</b> behind the replay is, and <code class="i">replay_lag</code>.',
    'On the standby, pause replay; insert 200,000 rows on the primary; run your query again.',
    'Resume and run it once more.',
  ])}${box('Hint', '<code class="i">pg_wal_lsn_diff(sent_lsn, replay_lsn)</code> · <code class="i">pg_wal_replay_pause()</code> / <code class="i">_resume()</code>.', '')}</div>`,
  zm(psql(`SELECT application_name, state,
  pg_size_pretty(pg_wal_lsn_diff(sent_lsn,
    replay_lsn)) AS tre_byte, replay_lag
FROM pg_stat_replication;
-- paused, after 200,000 rows:
 walreceiver | streaming | 68 MB   | 00:00:00.661019
-- resumed:
 walreceiver | streaming | 0 bytes | 00:00:02.670041`, { sm: true, hl: [6, 8], title: 'psql (17.11) — pgc15-pri' }), 1.05), 'r46')}
${P('Bytes tell the truth (68 MB → 0); the <code class="i">replay_lag</code> column lags behind reality in both directions.', 21)}` },

  { t: 'Self-check & summary', giua: true, body: `
${two(`<ol style="font-size:23px;margin:0;padding-left:26px">
<li>Which file makes a data directory a standby?</li>
<li>Async replication, primary dies. What can be lost?</li>
<li>Why is a replica not a backup?</li>
</ol>
${box('Answers', '1 · <code class="i">standby.signal</code> (written by <code class="i">pg_basebackup -R</code>). &nbsp;2 · The last transactions not yet received by the standby. &nbsp;3 · It replays mistakes too: <code class="i">DROP TABLE</code> arrives in milliseconds.', 'xanh')}`,
  `<ul style="font-size:23px;margin:0">
<li>Standby = WAL streamed live and replayed; read-only</li>
<li>Watch <b>bytes behind</b>, not just <code class="i">replay_lag</code></li>
<li>sync = no loss, slower, and can freeze commits</li>
<li>Failover: <b>fence</b>, then <code class="i">pg_promote()</code></li>
<li>Logical: chosen tables, writable, no DDL</li>
</ul>
${box('Next — 15.4', 'When one table gets too big: partitioning.', 'lam')}`)}` },
]);
