/**
 * pg-14-4 — PostgreSQL · Chapter 14 · Lesson 14.4 "Monitoring: answering 'why is it slow?'" (slide EN, kiểu FU, 26/10/2026, agent c14).
 * Nguồn: content/courses/postgresql/s14-ket-noi-van-hanh.mjs › postgresql-14-4-giam-sat. Output = chạy thật PostgreSQL 17.11 trên máy nháp pgc14tmp
 * (shared_preload_libraries = pg_stat_statements, log_min_duration_statement = 200, log_lock_waits = on):
 * video-bai-giang/src/khung/pg/that/pg-14-4.out.txt (tải 8 câu ⇒ top theo total_exec_time: LIKE 2 lượt 103,3 ms) · pg-14-4b (thêm 20.000 lượt câu rẻ ⇒ 1048,5 ms
 * đứng đầu) · pg-14-4c (chỉ mục không dùng 56 MB, cache 76,43% → 92,72%) · pg-14-4d (pg_stat_activity 5 phiên thật: active/idle in transaction/aborted/idle/Lock,
 * pg_blocking_pids, cancel vs terminate) · pg-14-4e (log: still waiting… 22967.735 ms) · pg-14-4f (một câu kiểm sức khoẻ) · pg-14-4g (postgres_exporter v0.16.0 /metrics).
 * Bổ sung so với web: wait_event đọc thế nào, query_start vs xact_start, màn hình client khi bị cancel/terminate, câu rẻ gọi nhiều vượt câu chậm,
 * tỉ lệ cache là số CỘNG DỒN, exporter chạy thật, bảng điều khiển mô phỏng.
 */
import { lamDeck, sql, psql, run, two, box, kw, cards, steps, vsd, flow } from './_pg-chung.mjs';
import { dashPic, cancelPic, callsTotalPic, exporterPic, dashMock } from './pg-14-hinh.mjs';

const zm = (h, z = 1.2) => `<div style="zoom:${z}">${h}</div>`;
export const deck = { key: 'pg-14-4', code: 'PG 14.4', title: 'Monitoring: answering “why is it slow?”', sub: 'pg_stat_activity · pg_stat_statements · index & cache stats · logs · alarms' };

export const slides = lamDeck({ chuong: 'Chapter 14 — Connections, pooling & operating', bai: '14.4' }, [
  { cover: true, t: 'Monitoring: answering<br>“why is it slow?”', sub: 'Three views, the server log, and the five numbers<br>worth an alarm' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li><code class="i">pg_stat_activity</code>: what is happening <b>right now</b> — states, waits, blockers</li>
<li><code class="i">pg_cancel_backend</code> vs <code class="i">pg_terminate_backend</code>, seen from both sides</li>
<li>The server log: slow queries and lock waits written down for you</li>
<li><code class="i">pg_stat_statements</code>: what has been expensive <b>over time</b></li>
<li>Index and cache statistics, five alarm numbers, and Prometheus + Grafana</li>
</ul>
${box('Everything in 14.1–14.3 ends here', 'Connections in use (14.1), waiting in a pool (14.2), dead tuples and wraparound (14.3) — each becomes one number you watch.', 'lam')}` },

  { t: 'Everyday example: a car dashboard', giua: true, body: `
${dashPic()}
<p style="font-size:21px;margin:0">“The site is slow” is not a diagnosis. Like a car, PostgreSQL has a speedometer (now), a trip computer (history) and gauges per part (tables, indexes, cache). The whole skill is knowing <b>which view answers which question</b>.</p>` },

  { t: 'pg_stat_activity: five real sessions, one snapshot', giua: true, body: `
${zm(run(`SELECT pid, application_name AS app, state,
       wait_event_type AS loai_cho, wait_event AS cho,
       round(extract(epoch FROM now() - query_start)::numeric, 1) AS giay,
       left(query, 30) AS query
FROM pg_stat_activity
WHERE backend_type = 'client backend' AND pid <> pg_backend_pid()
ORDER BY giay DESC;`, ` pid |   app    |             state             | loai_cho |      cho      | giay |             query
-----+----------+-------------------------------+----------+---------------+------+--------------------------------
 232 | bao-cao  | active                        | Timeout  | PgSleep       |  6.3 | SELECT pg_sleep(90) AS bao_cao
 240 | web-quen | idle in transaction           | Client   | ClientRead    |  6.2 | UPDATE hang SET n = n + 1 WHER
 250 | loi      | idle in transaction (aborted) | Client   | ClientRead    |  5.2 | SELECT 1/0;
 260 | pool     | idle                          | Client   | ClientRead    |  5.1 | SELECT 1;
 270 | web-2    | active                        | Lock     | transactionid |  4.1 | UPDATE hang SET n = n + 1 WHER
(5 rows)`, { hlOut: [4, 7], title: 'psql (17.11) — scratch server pgc14tmp, db shop' }), 0.98)}
<p style="font-size:20px;margin:0">One row per connection. <code class="i">query</code> is the <b>last</b> statement — for an idle session it already finished. <code class="i">loai_cho/cho</code> = wait_event_type / wait_event: what the backend is waiting for <i>right now</i>.</p>` },

  { t: 'Read the state column first', giua: true, body: `
${cards([
    ['active', 'Running a statement now. Several slow ones? Read <code class="i">wait_event</code>: <b>Lock</b> = contention (Chapter 11), <b>IO</b> = disk, empty = using CPU.'],
    ['idle', 'Connected, doing nothing, holding nothing. Harmless — a healthy pool at rest looks like this.'],
    ['idle in transaction', 'The dangerous one: an open transaction doing nothing — holding locks, pinning the xmin horizon (14.3). Older than a few minutes = a bug.'],
    ['idle in transaction (aborted)', 'Same, and the transaction already failed (11.1): every command is refused until ROLLBACK. The app is not handling an error.'],
  ], 2)}
${box('In our snapshot', 'web-quen opened a transaction, updated a row and went quiet ⇒ web-2’s UPDATE of the same row waits on <b>Lock / transactionid</b>.', 'lam')}` },

  { t: 'Who blocks whom — and for how long', giua: true, body: `
${two(zm(run(`SELECT pid, application_name AS app,
       pg_blocking_pids(pid) AS bi_chan_boi
FROM pg_stat_activity
WHERE cardinality(pg_blocking_pids(pid)) > 0;`, ` pid |  app  | bi_chan_boi
-----+-------+-------------
 270 | web-2 | {240}
(1 row)`, { hlOut: [3], title: 'psql (17.11) — shop' }), 1.0),
  zm(run(`SELECT application_name AS app, state,
  round(extract(epoch FROM now() - xact_start)::numeric, 1)   AS tuoi_gd,
  round(extract(epoch FROM now() - state_change)::numeric, 1) AS o_trang_thai
FROM pg_stat_activity
WHERE xact_start IS NOT NULL AND pid <> pg_backend_pid()
ORDER BY tuoi_gd DESC;`, `   app    |        state        | tuoi_gd | o_trang_thai
----------+---------------------+---------+--------------
 bao-cao  | active              |    15.4 |         15.4
 web-quen | idle in transaction |    15.4 |         15.4
 web-2    | active              |    13.2 |         13.2`, { hlOut: [4], title: 'psql (17.11) — shop' }), 0.86), 'r46')}
${box('Which clock?', '<code class="i">query_start</code> = when the last statement began. <code class="i">xact_start</code> = when the <b>transaction</b> began — use it to find the oldest transaction. <code class="i">state_change</code> = how long it has been in its current state. <code class="i">bi_chan_boi</code> = “blocked by”: 270 waits for 240.', 'lam')}` },

  { t: 'Cancel or terminate (real, both sides)', giua: true, body: `
${two(zm(psql(`shop=# SELECT pg_cancel_backend(232);    -- bao-cao
 t
shop=# SELECT pg_terminate_backend(240); -- web-quen
 t

--- bao-cao’s screen ---
SELECT pg_sleep(90) AS bao_cao_thang;
ERROR:  canceling statement due to user request

--- web-2’s screen (was waiting 23 s) ---
UPDATE hang SET n = n + 1 WHERE id = 1;
UPDATE 1`, { sm: true, title: 'psql (17.11) — admin and client sessions (excerpt)', hl: [8, 12] }), 1.05),
  zm(psql(`--- web-quen’s screen, at its next command ---
COMMIT;
FATAL:  terminating connection due to administrator command
server closed the connection unexpectedly
	This probably means the server terminated abnormally
	before or while processing the request.
error: connection to server was lost`, { sm: true, title: 'psql — the terminated client (excerpt)', hl: [3] }), 1.0))}
${box('What happened', 'Cancel stopped bao-cao’s query; its connection lived on. Terminate closed web-quen’s connection ⇒ its open transaction <b>rolled back</b> ⇒ the row lock was freed ⇒ web-2 finished immediately.', 'xanh')}` },

  { t: 'Picture it: stop the dish vs walk the guest out', giua: true, body: `
${cancelPic()}
${two(box('Rule of thumb', 'Cancel first. Terminate when cancel is not enough, and for <b>idle in transaction</b> sessions (there is no running query to cancel).', 'lam'),
  box('Never', '<code class="i">kill -9</code> a backend process from the shell: the postmaster must then restart <b>every</b> connection to protect shared memory. Use the SQL functions.', 'bad'))}` },

  { t: 'Let the server log tell you (real)', giua: true, body: `
${zm(sql(`# postgresql.conf — set on day one
log_min_duration_statement = 200    # log every statement slower than 200 ms
log_lock_waits = on                  # log waits longer than deadlock_timeout (1 s)
log_autovacuum_min_duration = 0      # log every autovacuum run (14.3)`, { sm: true, lang: 'bash' }), 1.15)}
${zm(psql(`[270] LOG:  process 270 still waiting for ShareLock on transaction 768 after 1000.440 ms
[270] DETAIL:  Process holding the lock: 240. Wait queue: 270.
[270] CONTEXT:  while updating tuple (4,97) in relation "hang"
[232] ERROR:  canceling statement due to user request
[240] FATAL:  terminating connection due to administrator command
[270] LOG:  process 270 acquired ShareLock on transaction 768 after 22965.348 ms
[270] LOG:  duration: 22967.735 ms  statement: UPDATE hang SET n = n + 1 WHERE id = 1;`, { sm: true, title: 'docker logs pgc14tmp (timestamps trimmed)', hl: [1, 7] }), 1.0)}
<p style="font-size:20px;margin:0">A one-row UPDATE took <b>23 seconds</b> — and the log already says why: it waited for process 240’s lock. You can read this the next morning, long after pg_stat_activity forgot.</p>` },

  { t: 'pg_stat_statements: set it up before you need it', to: true, giua: true, body: `
${zm(sql(`# postgresql.conf
shared_preload_libraries = 'pg_stat_statements'   # needs a RESTART
-- then, in each database you want to query it from:
CREATE EXTENSION pg_stat_statements;
SELECT pg_stat_statements_reset();               -- start a fresh measurement`, { sm: true, lang: 'bash' }), 1.2)}
${cards([
    ['What it records', 'For every <b>query shape</b>: calls, total and mean time, rows, buffer hits/reads, WAL — since the last reset.'],
    ['Query shape', 'Literals become <code class="i">$1</code>, so <code class="i">bucket = 7</code> and <code class="i">bucket = 42</code> are one row.'],
    ['Cost', 'A few percent of CPU at most. Production databases run it permanently.'],
  ])}` },

  { t: 'Top queries by total time (real)', giua: true, body: `
${zm(run(`SELECT calls,
       round(total_exec_time::numeric, 1) AS tong_ms,
       round(mean_exec_time::numeric, 2)  AS tb_ms,
       rows, left(query, 44) AS truy_van
FROM pg_stat_statements
WHERE query LIKE '%FROM big%' AND query NOT LIKE '%pg_stat%'
ORDER BY total_exec_time DESC LIMIT 5;`, ` calls | tong_ms | tb_ms | rows |                  truy_van
-------+---------+-------+------+--------------------------------------------
     2 |   103.3 | 51.65 |    2 | SELECT count(*) FROM big WHERE val LIKE $1
     1 |    34.5 | 34.48 |    1 | SELECT sum(id) FROM big
     5 |     0.5 |  0.10 |    5 | SELECT count(*) FROM big WHERE bucket = $1
(3 rows)`, { hlOut: [3, 5], title: 'psql (17.11) — after 8 queries on a 1,000,000-row table' }), 1.05)}
<p style="font-size:20px;margin:0">Workload: five cheap indexed lookups, two <code class="i">LIKE '%…%'</code> scans, one sum. The LIKE ran <b>twice</b> and cost <b>103.3 ms</b>; the indexed query ran five times for 0.5 ms. <code class="i">tong_ms</code> = total, <code class="i">tb_ms</code> = mean.</p>` },

  { t: 'Twist: the cheap query called 20,000 times (real)', giua: true, body: `
${zm(psql(`$ pgbench -n -f bucket.sql -c 10 -j 2 -t 2000 shop     # the "orders by group" page, opened 20,000 times
tps = 19958.984287 (without initial connection time)
 calls | tong_ms | tb_ms | rows  |                  truy_van
-------+---------+-------+-------+--------------------------------------------
 20005 |  1048.5 |  0.05 | 20005 | SELECT count(*) FROM big WHERE bucket = $1
     2 |   103.3 | 51.65 |     2 | SELECT count(*) FROM big WHERE val LIKE $1
     1 |    34.5 | 34.48 |     1 | SELECT sum(id) FROM big`, { sm: true, title: 'the same pg_stat_statements query, a minute later', hl: [5] }), 1.05)}
${callsTotalPic()}` },

  { t: 'Always order by total_exec_time', to: true, giua: true, body: `
${two(box('Why total', '<b>total = calls × mean</b> — the only column that measures the load a query puts on the server. A 0.05 ms query called 20,005 times cost 10× more than the 51 ms LIKE.', 'xanh'),
  box('What each order misleads you into', 'By <b>calls</b>: you see harmless cheap queries. By <b>mean</b>: you optimise the nightly report nobody waits for. Look at both <i>after</i> sorting by total.', 'bad'))}
${steps([
    'Sort by <code class="i">total_exec_time</code>, take the top 5–10.',
    'For each: EXPLAIN (ANALYZE, BUFFERS) it (Chapter 10) — or ask why the app calls it so often (N+1 queries, missing cache).',
    'Fix, then <code class="i">pg_stat_statements_reset()</code> and measure again.',
  ])}` },

  { t: 'Cache hit ratio (real) — and why it is cumulative', giua: true, body: `
${two(zm(run(`SELECT datname, blks_hit, blks_read,
  round(100.0 * blks_hit
        / nullif(blks_hit + blks_read, 0), 2) AS ti_le_cache
FROM pg_stat_database WHERE datname = 'shop';`, ` datname | blks_hit | blks_read | ti_le_cache
---------+----------+-----------+-------------
 shop    |   164241 |     50660 |       76.43
-- after 100,000 more "orders by group" page views:
 shop    |   644972 |     50660 |       92.72`, { hlOut: [3, 5], title: 'psql (17.11) — shop' }), 1.0),
  `<div>${box('Read it', '<code class="i">blks_hit</code> = page found in shared_buffers, <code class="i">blks_read</code> = fetched from the OS/disk. Right after loading 1,000,000 rows: <b>76%</b>. Once the hot data stayed in memory, every new read was a hit.', 'lam')}
${box('Cumulative!', 'The counters add up since the last reset, so the ratio moves slowly. Alarm on the <b>change over the last minutes</b> (Prometheus does that). Healthy OLTP: <b>&gt; 99%</b>.', 'bad')}</div>`)}` },

  { t: 'Indexes nobody uses (real)', giua: true, body: `
${zm(run(`SELECT relname, indexrelname, idx_scan,
       pg_size_pretty(pg_relation_size(indexrelid)) AS kich_thuoc
FROM pg_stat_user_indexes
ORDER BY idx_scan, pg_relation_size(indexrelid) DESC;`, ` relname |  indexrelname  | idx_scan | kich_thuoc
---------+----------------+----------+------------
 big     | big_val_idx    |        0 | 56 MB
 hang    | hang_pkey      |        0 | 64 kB
 big     | big_bucket_idx |    20005 | 7168 kB
(3 rows)`, { hlOut: [3], title: 'psql (17.11) — shop' }), 1.15)}
${two(box('56 MB of pure cost', '<code class="i">big_val_idx</code> was created “just in case”: never scanned, yet updated on every write and kept in memory and backups (Chapter 9). Note: the <code class="i">LIKE \'%…%\'</code> queries could not use it.', 'bad'),
  box('Before you DROP', 'Counters restart after <code class="i">pg_stat_reset()</code> or a restore — check <code class="i">stats_reset</code> in pg_stat_database. A primary key or UNIQUE index enforces a rule even with 0 scans. Replicas keep their own counters.', 'lam'))}` },

  { t: 'One health-check query, five numbers (real)', giua: true, body: `
${zm(sql(`SELECT
 (SELECT count(*) FROM pg_stat_activity WHERE backend_type = 'client backend')
   || ' / ' || current_setting('max_connections')                     AS ket_noi,
 (SELECT coalesce(max(now() - xact_start), '0')::interval(0)
    FROM pg_stat_activity WHERE pid <> pg_backend_pid())              AS gd_lau_nhat,
 (SELECT max(round(100.0 * n_dead_tup / greatest(n_live_tup, 1), 1))
    FROM pg_stat_user_tables)                                         AS chet_max_pct,
 (SELECT max(age(datfrozenxid)) FROM pg_database)                     AS tuoi_xid,
 (SELECT round(100.0 * sum(blks_hit) / sum(blks_hit + blks_read), 2)
    FROM pg_stat_database)                                            AS cache_pct;`, { sm: true }), 1.08)}
${two(zm(psql(` ket_noi | gd_lau_nhat | chet_max_pct | tuoi_xid | cache_pct
---------+-------------+--------------+----------+-----------
 1 / 100 | 00:00:00    |        100.0 |       39 |     93.57`, { sm: true, title: 'psql (17.11) — shop' }), 1.0),
  box('Alarm on', 'connections &gt; 80% · oldest transaction &gt; 5 min · dead ratio &gt; 20% on a hot table · xid age &gt; 500 M · cache &lt; 99%. On our scratch server two would fire: <b>100%</b> dead on <code class="i">hang</code> (autovacuum off) and <b>93.57%</b> cache.', 'bad'))}` },

  { t: 'Prometheus + postgres_exporter + Grafana', giua: true, body: `
${exporterPic()}
${zm(psql(`$ curl -s localhost:9187/metrics | grep -E "^pg_(up|settings_max_connections|stat_activity_count|stat_database_blks)"
pg_settings_max_connections{server="pgc14tmp:5432"} 100
pg_stat_activity_count{application_name="",datname="shop",state="active",usename="postgres"} 2
pg_stat_activity_count{application_name="",datname="shop",state="idle in transaction",usename=""} 0
pg_stat_database_blks_hit{datid="16384",datname="shop"} 652008
pg_stat_database_blks_read{datid="16384",datname="shop"} 50660
pg_up 1`, { sm: true, title: 'prometheuscommunity/postgres-exporter:v0.16.0 — real output (excerpt)' }), 0.98)}` },

  { t: 'A dashboard you can glance at', giua: true, body: `
${dashMock()}
<p style="font-size:20px;margin:0">Five panels, the same five numbers, with history. Alerts go to Telegram or e-mail through Alertmanager. (Mock-up drawn with the real values from the health-check query on the scratch server.)</p>
${box('Start small', 'No Prometheus yet? Run the health-check query from cron every minute and send yourself a message when a number crosses its line. The numbers matter more than the tool.', 'lam')}` },

  { t: 'Trap: switching on observability during the fire', giua: true, body: `
${zm(vsd(`<p style="margin:0;font-size:21px">The site is slow <b>now</b>; you set <code class="i">shared_preload_libraries = 'pg_stat_statements'</code>…</p>
<ul style="font-size:20px"><li>it needs a <b>restart</b> — every connection drops, in the middle of the incident</li>
<li>after the restart the view is <b>empty</b>: nothing about the last hour was recorded</li>
<li>same for <code class="i">log_min_duration_statement</code> and <code class="i">log_lock_waits</code>: they only describe the <i>next</i> fire</li></ul>`,
  `<p style="margin:0;font-size:21px">On <b>day one</b>, when a restart costs nothing:</p>
<ul style="font-size:20px"><li><code class="i">pg_stat_statements</code> preloaded and created</li>
<li><code class="i">log_min_duration_statement</code> (e.g. 200–500 ms), <code class="i">log_lock_waits = on</code>, <code class="i">log_autovacuum_min_duration</code></li>
<li><code class="i">application_name</code> in every connection string (14.1)</li>
<li>the five alarms on a dashboard</li></ul>`), 1.12)}` },

  { t: 'Exercise — with the answer', giua: true, to: true, body: `
${two(`<div>${steps([
    'Users report checkout “hangs”. pg_stat_activity shows six <code class="i">active</code> rows waiting on <b>Lock / transactionid</b>, all blocked by pid 4711, which is <b>idle in transaction</b> since 9 minutes. What do you do, in order?',
    'pg_stat_statements top line: <code class="i">calls 1,200,000 · mean 0.8 ms</code>. Second: <code class="i">calls 3 · mean 4,000 ms</code>. Which first?',
  ])}</div>`,
  `<div>${box('Answer', '1) <code class="i">pg_terminate_backend(4711)</code> (nothing to cancel — it is idle), watch the six finish, then find the app code that leaves a transaction open; set <code class="i">idle_in_transaction_session_timeout</code>.<br>2) The first: 1,200,000 × 0.8 ms = <b>960 s</b> of server time vs 12 s.', 'xanh')}</div>`)}` },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>What is the difference between <code class="i">idle</code> and <code class="i">idle in transaction</code>, and which one should page you?</li>
<li>Why is <code class="i">total_exec_time</code> the right column to sort by?</li>
<li>Name two settings to enable on day one, and why not during an incident.</li>
</ol>
${box('Answers', '1) idle holds nothing; <b>idle in transaction</b> holds locks and the xmin horizon — alarm on it. 2) It is calls × mean = the real load. 3) <code class="i">pg_stat_statements</code> (needs a restart, starts empty) and <code class="i">log_min_duration_statement</code> / <code class="i">log_lock_waits</code> — they only record from now on.', 'xanh')}` },

  { t: 'Summary & next', giua: true, body: `
<ul>
<li><code class="i">pg_stat_activity</code>: state + wait_event + <code class="i">pg_blocking_pids</code> ⇒ who waits for whom, right now</li>
<li>Cancel first (query ends, connection stays); terminate idle-in-transaction sessions (transaction rolls back)</li>
<li>The log keeps the story: slow statements, lock waits, autovacuum</li>
<li><code class="i">pg_stat_statements</code> ordered by <b>total</b> time; unused indexes; cumulative cache ratio</li>
<li>Five alarms: connections, oldest transaction, dead ratio, xid age, cache — enabled on day one</li>
</ul>
${box('Next — Chapter 15: Backup, replication & scaling', 'pg_dump and restore, WAL and point-in-time recovery, streaming replicas — the part of operations that saves you when everything above failed.', 'lam')}` },
]);
