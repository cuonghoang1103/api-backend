/**
 * 12.1 — Ghi log PostgreSQL (soạn 24/11/2026, agent lgz).
 * Output thật: OUT['s12/pglog'] — PostgreSQL 17.12 (ảnh lgz-pg12:1 = postgres:17 + pgaudit + pgbadger) trong container --network none;
 * máy khách là psql nối TCP tới IP giả gắn lên lo (10.20.0.50 = máy chủ ứng dụng). Dựng: _demo/s12/cong-cu/dung-pg.bash.
 * Chạy lại: bash _demo/s12/chay-s12.bash <thư mục> ⇒ giờ/PID đổi: soát số trong lời ("PID 92/100/108", "1000.068 / 2504.779 ms", "tiến trình 155", "10|12|3", "line 128").
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '12.1 — PostgreSQL logging: collector, destinations, prefix, connections, lock waits, errors|||12.1 — Ghi log PostgreSQL: logging_collector, log_destination (stderr/csvlog/jsonlog), log_line_prefix, kết nối, chờ khoá, lỗi',
  slug: 'log-12-1-postgres-log',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Tìm log PostgreSQL ở mọi kiểu cài (Docker, apt, dnf, systemd, cloud), bật logging_collector + jsonlog, viết log_line_prefix có %m %p %u %d %a %h, đọc vòng đời một kết nối, ERROR/FATAL/PANIC và SQLSTATE, chờ khoá và deadlock, hết slot kết nối — tất cả trên output thật của PostgreSQL 17.12.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.1</span>
<h2>PostgreSQL logs: find them, make them useful, read them</h2>
<p class="lead">When an API returns 500 and the stack trace says "database error", the next stop is the database server's own log. PostgreSQL writes very good logs — but its defaults hide who connected, from where and with which app. This lesson finds the log on any install, turns on the settings every team should have, and reads the six situations you will meet most: wrong password, wrong database, broken SQL, lock waits, deadlocks and running out of connections.</p>

<h3>The everyday picture: the hotel front desk logbook</h3>
<p>A hotel receptionist keeps a logbook: <em>14:02 guest arrived, room 301, showed ID</em>; <em>14:05 guest in 207 complained, the key does not work</em>; <em>14:30 guest left</em>. If the book only said "complaint", the manager could do nothing with it. The value is in the columns: <strong>time, who, which room, which door</strong>. <code>log_line_prefix</code> is exactly those columns for PostgreSQL. The default prints only the time and a process number.</p>

<h3>Where is the log? It depends on how PostgreSQL was installed</h3>
<table>
<thead><tr><th>Install</th><th>Where the log goes by default</th><th>How to read it</th></tr></thead>
<tbody>
<tr><td>Official Docker image</td><td>stderr of the container (<code>logging_collector=off</code>)</td><td><code>docker logs &lt;db&gt;</code> (lesson 13.1)</td></tr>
<tr><td>Debian/Ubuntu (apt, <code>pg_ctlcluster</code>)</td><td><code>/var/log/postgresql/postgresql-17-main.log</code></td><td><code>sudo tail -f</code>, rotated by logrotate</td></tr>
<tr><td>RHEL/Fedora (dnf, PGDG packages)</td><td>usually <code>$PGDATA/log/</code> with the collector on</td><td><code>sudo -u postgres ls /var/lib/pgsql/17/data/log</code></td></tr>
<tr><td>systemd unit without collector</td><td>journald</td><td><code>journalctl -u postgresql-17</code> (Chapter 7)</td></tr>
<tr><td>Managed cloud (RDS, Cloud SQL, Azure)</td><td>the provider's log service</td><td>console / CloudWatch Logs (lesson 13.4)</td></tr>
</tbody></table>
<p>Do not memorise the table. On any server you can <strong>ask PostgreSQL itself</strong>: <code>SHOW data_directory;</code>, <code>SHOW log_directory;</code> and <code>SELECT pg_current_logfile();</code>.</p>

<h3>Step 1 — the defaults of the official Docker image</h3>
${lenh('s12/pglog', 0)}
${lenh('s12/pglog', 1)}
${lenh('s12/pglog', 2)}
<p>What you get out of the box: everything to <strong>stderr</strong>, a prefix of only <code>%m [%p]</code> (time with milliseconds, PID), <strong>no</strong> connection logging and <strong>no</strong> lock-wait logging. Three settings decide <em>which</em> lines are written at all:</p>
<ul>
<li><code>log_min_messages = warning</code> — server messages below WARNING are dropped.</li>
<li><code>log_min_error_statement = error</code> — when a statement fails, its <strong>SQL text</strong> is written as a <code>STATEMENT:</code> line. Useful, and dangerous (lesson 12.3: passwords).</li>
<li><code>log_rotation_age = 1440</code> minutes and <code>log_rotation_size = 10240</code> kB — only matter when the collector writes files.</li>
</ul>
<p>Note <code>log_timezone = Asia/Ho_Chi_Minh</code>: this image took it from the <code>TZ</code> variable, so timestamps end with <code>+07</code>. Many servers run with UTC. Always read the offset at the end of the timestamp before you line the DB log up with the app log (lesson 1.5).</p>

<h3>Step 2 — turn on what a team actually needs</h3>
${lenh('s12/pglog', 3)}
${lenh('s12/pglog', 4)}
${lenh('s12/pglog', 5)}
<ul>
<li><code>ALTER SYSTEM</code> only writes <code>postgresql.auto.conf</code> (which overrides <code>postgresql.conf</code>). It applies <strong>nothing</strong> yet — the last query still shows the old prefix.</li>
<li>Most logging settings apply on <code>SELECT pg_reload_conf()</code>. Three in this list need a <strong>restart</strong>: <code>logging_collector</code>, <code>max_connections</code> and (lesson 12.2) <code>shared_preload_libraries</code>. Plan the restart in a maintenance window on a real server.</li>
<li><code>max_connections = 12</code> is only for this lab, so we can run out of connections in step 7.</li>
</ul>
<p>After the restart, look at the Docker log again:</p>
${lenh('s12/pglog', 6)}
<div class="pitfall co-tieu-de"><p><strong>"docker logs of the DB went silent."</strong> With <code>logging_collector = on</code>, PostgreSQL redirects its own stderr into files under <code>$PGDATA/log</code>. The two lines above are the last ones Docker will ever see. If your team reads the DB through <code>docker logs</code> or a log shipper that tails stderr, turning the collector on makes the log disappear from there. Pick one path on purpose.</p></div>
${lenh('s12/pglog', 7)}
${lenh('s12/pglog', 8)}
<p><code>log_destination = 'stderr,jsonlog'</code> writes the same events twice: a human-readable <code>.log</code> and a JSON-lines <code>.json</code> (PostgreSQL 15+; <code>csvlog</code> also exists since 8.3). Files are readable only by the <code>postgres</code> user (<code>-rw-------</code>) — good, because they contain data.</p>

<h3>Step 3 — log_line_prefix, the columns of the logbook</h3>
<p>Our prefix is <code>'%m [%p] %q%u@%d app=%a client=%h '</code>:</p>
<table>
<thead><tr><th>Escape</th><th>Meaning</th><th>Why you want it</th></tr></thead>
<tbody>
<tr><td><code>%m</code></td><td>time with milliseconds and zone</td><td>line up with app logs</td></tr>
<tr><td><code>%p</code></td><td>backend PID</td><td>group all lines of one session; match <code>pg_stat_activity.pid</code></td></tr>
<tr><td><code>%q</code></td><td>stop here for non-session processes</td><td>checkpointer/autovacuum lines stay short</td></tr>
<tr><td><code>%u@%d</code></td><td>user @ database</td><td>who, and where</td></tr>
<tr><td><code>%a</code></td><td><code>application_name</code></td><td>which service: <code>shop-api</code>, <code>report-job</code>, DBeaver…</td></tr>
<tr><td><code>%h</code></td><td>client host</td><td>which machine (brute force, "who ran DROP")</td></tr>
<tr><td><code>%e</code>, <code>%l</code>, <code>%c</code>, <code>%x</code>, <code>%Q</code></td><td>SQLSTATE, line no. in session, session id, transaction id, query id</td><td>add when you need them; <code>%Q</code> pairs with pg_stat_statements (12.2)</td></tr>
</tbody></table>
<p><code>%a</code> only works if the application <strong>sets</strong> <code>application_name</code>: <code>?application_name=shop-api</code> in a Postgres URL, <code>application_name</code> in node-postgres' Pool, <code>spring.datasource.hikari.data-source-properties.ApplicationName</code> in Spring Boot. Ask for it in code review: it costs nothing and saves hours.</p>

<h3>Step 4 — four mistakes, and how the server tells the story</h3>
${lenh('s12/pglog', 9)}
${lenh('s12/pglog', 10)}
${lenh('s12/pglog', 11)}
${lenh('s12/pglog', 12)}
<p>That is what the <em>client</em> sees. Now the server's side:</p>
${lenh('s12/pglog', 13)}
<p>Read it by PID — every line with <code>[108]</code> is one session:</p>
<ol>
<li><code>connection received: host=10.20.0.50 port=46544</code> — a TCP connection arrived. User, database and app are still <code>[unknown]</code>: nothing has been authenticated yet.</li>
<li><code>connection authenticated: identity="app" method=scram-sha-256 (pg_hba.conf:128)</code> — the password was right, and you learn <strong>which pg_hba rule</strong> let it in.</li>
<li><code>connection authorized: … application_name=shop-api</code> — from here on, <code>app=</code> is filled in.</li>
<li><code>ERROR … HINT … STATEMENT</code> — the failure, the server's suggestion ("Perhaps you meant… accounts.owner") and the SQL that failed.</li>
<li><code>disconnection: session time: 0:00:00.012</code> — how long the session lived.</li>
</ol>
<p>Two details the client never sees: the failed password attempt (PID 92) shows <code>DETAIL: Connection matched file … line 128: "host all all all scram-sha-256"</code> — so you know which rule was tried. And the wrong-database session (PID 100) <em>authenticated successfully</em> before failing — the password was right, only the database name was wrong. A ticket that says "cannot log in" has two very different causes; the log separates them.</p>

<h3>Severity: ERROR is not FATAL</h3>
<table>
<thead><tr><th>Level</th><th>What happened</th><th>Example above</th></tr></thead>
<tbody>
<tr><td><code>LOG</code></td><td>information the admin asked for (connections, durations, checkpoints)</td><td><code>connection authorized</code></td></tr>
<tr><td><code>WARNING</code> / <code>NOTICE</code></td><td>something odd, work continues</td><td>"there is no transaction in progress"</td></tr>
<tr><td><code>ERROR</code></td><td>this <strong>statement/transaction</strong> failed; the session lives on</td><td>column does not exist, duplicate key, deadlock</td></tr>
<tr><td><code>FATAL</code></td><td>this <strong>session</strong> ends</td><td>wrong password, missing database, too many clients</td></tr>
<tr><td><code>PANIC</code></td><td>the <strong>whole server</strong> resets all sessions</td><td>should never appear; open an incident</td></tr>
</tbody></table>
<p>Each error also has a five-character <strong>SQLSTATE</strong>, which your application receives too (node-postgres <code>err.code</code>, JDBC <code>getSQLState()</code>). The ones in this lesson: <code>28P01</code> wrong password, <code>3D000</code> unknown database, <code>42703</code> unknown column, <code>23505</code> unique violation, <code>40P01</code> deadlock, <code>53300</code> too many connections, <code>57P03</code> server starting up. Log the code in your app, and you can grep both sides with the same five characters.</p>

<h3>Step 5 — lock waits: who is blocking whom</h3>
<p>Session A (<code>shop-api</code>) updates account 1 and keeps the transaction open for 3 seconds. Session B (<code>report-job</code>) wants the same row:</p>
${lenh('s12/pglog', 14)}
<p>With <code>log_lock_waits = on</code>, PostgreSQL writes a line when a wait passes <code>deadlock_timeout</code> (1 s here): who waits (137), on what (<code>ShareLock on transaction 754</code> = "until that transaction ends"), <strong>who holds it</strong> (<code>Process holding the lock</code>) and, later, how long it really waited (2504.779 ms). Next step in a real incident: grep the holder's PID (<code>grep '\\[HOLDERPID\\]' …</code>) to see what it was doing — very often an <code>idle in transaction</code> session that someone forgot to commit, or a long migration.</p>

<h3>Step 6 — deadlock: the log contains both sides</h3>
${lenh('s12/pglog', 15)}
<p>A locks row 1 and wants row 2; B locks row 2 and wants row 1. Nobody can move, so after <code>deadlock_timeout</code> PostgreSQL picks a victim (here process 155, <code>chuyen-tien-A</code>), aborts its transaction with <code>40P01</code>, and the other one finishes. The <code>DETAIL</code> lists <strong>both</strong> processes and <strong>both</strong> statements; <code>CONTEXT</code> names the table. The fix is never "retry harder" alone: make every code path lock rows in the same order (for example, always the smaller account id first), and retry the victim transaction in the app.</p>

<h3>Step 7 — running out of connections</h3>
<p>Nine background workers hold <code>SELECT pg_sleep(4)</code> open. Then the API tries to connect:</p>
${lenh('s12/pglog', 16)}
${lenh('s12/pglog', 17)}
${lenh('s12/pglog', 18)}
${lenh('s12/pglog', 19)}
<p>Count: <code>max_connections = 12</code>, of which <code>superuser_reserved_connections = 3</code> are kept for superusers. Nine normal sessions fill the rest, so the tenth normal user gets <code>remaining connection slots are reserved…</code>. When superusers also fill the reserved slots, <strong>even the DBA</strong> gets <code>sorry, too many clients already</code>. Both are <code>53300</code>. Typical causes on a real project: pool size × number of app instances &gt; <code>max_connections</code> (four pods × pool 20 = 80 connections before anyone else connects), a connection leak (code that never releases a client), or a slow query that makes every request hold its connection longer.</p>

<h3>Step 8 — get the overview with grep, then jq</h3>
${lenh('s12/pglog', 20)}
<p>A first pass on an unknown log: count lines by level and first words. Most lines are <code>LOG</code> from connection logging — that is the price of <code>log_connections</code> (four lines per session). Then go to the JSON file, where every field has a name:</p>
${lenh('s12/pglog', 21)}
${lenh('s12/pglog', 22)}
${lenh('s12/pglog', 23)}
<ul>
<li><code>error_severity</code>, <code>state_code</code>, <code>remote_host</code>, <code>user</code>, <code>dbname</code>: filter without regex. No more guessing where the user name ends.</li>
<li><code>application_name</code> is <code>null</code> on FATAL lines: the session died before the startup packet was processed — same as <code>app=[unknown]</code> in the text log.</li>
<li>Multi-line messages (the deadlock DETAIL, auto_explain plans in 12.2) stay <strong>one</strong> JSON object. In the text log they are several lines starting with a tab — the reason jsonlog is so much easier to ship to Loki/Elasticsearch (Chapter 15).</li>
<li><code>disconnection … session time</code> tells you how long sessions live. Thousands of sessions of a few milliseconds = the app opens a new connection per request (no pool). Sessions of days = pools, or leaks.</li>
</ul>
<p>One more line from step 1 is worth knowing: <code>FATAL: the database system is starting up</code> (<code>57P03</code>) right after a restart is harmless — a client connected one second too early. Seeing it <em>repeatedly</em> in the middle of the day means the server keeps crashing and recovering: look for <code>server process … was terminated by signal</code> and <code>all server processes terminated; reinitializing</code> just before it.</p>

<h3>Hacker's corner: the log is also a copy of your data</h3>
<p>Look again at step 4: <code>DETAIL: Key (email)=(an@example.com) already exists.</code> and the <code>STATEMENT</code> line with name and phone number. Without anyone deciding it, personal data went into a file that is rotated, backed up and maybe shipped to a third-party log service. An attacker who reads the log directory (a misconfigured backup bucket, a log shipper with weak access) reads data, without ever touching the tables. Two habits: keep <code>$PGDATA/log</code> at <code>0600</code> owned by <code>postgres</code> (as it is here) and give the log pipeline the same protection as the database. Lesson 12.3 continues with passwords in logs; lesson 16.3 with masking.</p>

<h3>Real-life situations</h3>
<ul>
<li><strong>OJT, "API returns 500 at 14:03":</strong> open the DB log at 14:02–14:04, filter <code>app=shop-api</code> and <code>ERROR|FATAL</code>, write down the SQLSTATE. <code>23505</code> = a bug in the app (no check before insert), <code>53300</code> = capacity, <code>40P01</code> = locking order, <code>57P03</code> = DB was restarting.</li>
<li><strong>Outsourcing, the customer's DBA sends you a zip of logs:</strong> first <code>SHOW log_line_prefix</code> on their side (ask for it). Without <code>%u %d %a %h</code> you cannot separate your app's lines from everyone else's — ask them to add it before the next test.</li>
<li><strong>"Cannot connect" after you scale from 2 to 6 pods:</strong> count <code>53300</code> lines and compute pool × pods. Increasing <code>max_connections</code> is the last resort (each connection is a process with its own memory); use a smaller pool or PgBouncer first.</li>
</ul>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok"><ol>
<li>Start <code>postgres:17</code> in Docker, find the log with <code>SHOW</code>/<code>pg_current_logfile()</code> and see that <code>docker logs</code> is the log.</li>
<li>Set the same <code>log_line_prefix</code>, connection logging and jsonlog as step 2; restart; connect with <code>PGAPPNAME=bai-tap</code> and run a query with a typo.</li>
<li>Reproduce a lock wait with two <code>psql</code> windows (<code>BEGIN; UPDATE …</code> in the first, the same <code>UPDATE</code> in the second, wait 2 s, <code>COMMIT</code> the first).</li>
<li>With jq, list every FATAL with <code>state_code</code> and <code>remote_host</code>.</li>
</ol>
<p><strong>Done when:</strong> your typo shows up as <code>ERROR … STATEMENT</code> with <code>app=bai-tap</code>; you see <code>still waiting … after 1000</code> then <code>acquired … after</code> ≈ the time you waited; and you can explain why <code>application_name</code> is null on FATAL lines.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['logging_collector', 'Background process that captures stderr into files under log_directory; needs a restart to change.'],
  ['log_destination', 'stderr, csvlog, jsonlog (15+), syslog, eventlog — several at once is allowed.'],
  ['log_line_prefix', 'Columns added to every line: %m time, %p PID, %u user, %d database, %a app, %h client, %e SQLSTATE.'],
  ['ALTER SYSTEM', 'Writes postgresql.auto.conf; apply with pg_reload_conf() or a restart.'],
  ['SQLSTATE', 'Five-character error code shared by server log and client driver (28P01, 23505, 40P01, 53300…).'],
  ['log_lock_waits / deadlock_timeout', 'Log a lock wait that lasts longer than deadlock_timeout, with the holder\'s PID.'],
  ['ERROR vs FATAL vs PANIC', 'Statement fails · session ends · whole server resets.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Ask PostgreSQL where its log is: <code>pg_current_logfile()</code>.</li>
<li>Default prefix is too thin; add <code>%u@%d app=%a client=%h</code> and make apps set <code>application_name</code>.</li>
<li>Collector on ⇒ <code>docker logs</code> goes silent.</li>
<li>Read a session by PID: received → authenticated → authorized → ERROR/STATEMENT → disconnection.</li>
<li>Lock waits name the holder; deadlocks list both statements; <code>53300</code> = out of slots.</li>
<li>jsonlog keeps multi-line messages in one object — use it for tools.</li>
</ul>
${nguon('📘', 'PostgreSQL 17 — Error Reporting and Logging', 'log_destination, logging_collector, log_line_prefix escapes, jsonlog keys', 'https://www.postgresql.org/docs/17/runtime-config-logging.html')}
${nguon('📘', 'PostgreSQL 17 — Error codes (Appendix A)', 'Every SQLSTATE: 28P01, 3D000, 23505, 40P01, 53300, 57P03…', 'https://www.postgresql.org/docs/17/errcodes-appendix.html')}
${nguon('📘', 'PostgreSQL 17 — ALTER SYSTEM', 'postgresql.auto.conf, reload vs restart', 'https://www.postgresql.org/docs/17/sql-altersystem.html')}
${lienKet({ khoa: 'postgresql', bai: 'postgresql-14-4-giam-sat', title: 'PostgreSQL 14.4 — Monitoring', sub: 'pg_stat_activity, idle in transaction, the dashboards beside the log', cta: 'Open lesson' })}
${lienKet({ khoa: 'postgresql', bai: 'postgresql-11-4-khoa-deadlock', title: 'PostgreSQL 11.4 — Locks and deadlocks', sub: 'Why lock order matters, how to design it away', cta: 'Open lesson' })}
${lienKet({ khoa: 'postgresql', bai: 'postgresql-14-2-pool-pgbouncer', title: 'PostgreSQL 14.2 — Pools and PgBouncer', sub: 'The fix for 53300 that is not "raise max_connections"', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.1</span>
<h2>Log PostgreSQL: tìm ra, làm cho có ích, và đọc được</h2>
<p class="lead">Khi API trả 500 và stack trace ghi "database error", điểm dừng tiếp theo là log của chính máy chủ CSDL. PostgreSQL ghi log rất tốt — nhưng cấu hình mặc định giấu mất ai kết nối, từ đâu, bằng ứng dụng nào. Bài này tìm log ở mọi kiểu cài, bật những thiết lập đội nào cũng nên có, rồi đọc sáu tình huống gặp nhiều nhất: sai mật khẩu, sai tên CSDL, SQL hỏng, chờ khoá, deadlock và hết kết nối.</p>

<h3>Liên tưởng đời thường: sổ trực của lễ tân khách sạn</h3>
<p>Lễ tân khách sạn giữ một cuốn sổ: <em>14:02 khách đến, phòng 301, đã xem CCCD</em>; <em>14:05 khách phòng 207 phàn nàn thẻ từ không mở được</em>; <em>14:30 khách trả phòng</em>. Nếu sổ chỉ ghi "có phàn nàn" thì quản lý chẳng làm được gì. Giá trị nằm ở các cột: <strong>giờ, ai, phòng nào, cửa nào</strong>. <code>log_line_prefix</code> chính là các cột ấy của PostgreSQL. Mặc định nó chỉ in giờ và một số tiến trình.</p>

<h3>Log nằm đâu? Tuỳ cách cài PostgreSQL</h3>
<table>
<thead><tr><th>Kiểu cài</th><th>Mặc định log đi đâu</th><th>Đọc thế nào</th></tr></thead>
<tbody>
<tr><td>Ảnh Docker chính thức</td><td>stderr của container (<code>logging_collector=off</code>)</td><td><code>docker logs &lt;db&gt;</code> (bài 13.1)</td></tr>
<tr><td>Debian/Ubuntu (apt, <code>pg_ctlcluster</code>)</td><td><code>/var/log/postgresql/postgresql-17-main.log</code></td><td><code>sudo tail -f</code>, logrotate xoay vòng</td></tr>
<tr><td>RHEL/Fedora (dnf, gói PGDG)</td><td>thường là <code>$PGDATA/log/</code>, collector bật sẵn</td><td><code>sudo -u postgres ls /var/lib/pgsql/17/data/log</code></td></tr>
<tr><td>Unit systemd không bật collector</td><td>journald</td><td><code>journalctl -u postgresql-17</code> (Chương 7)</td></tr>
<tr><td>Cloud có quản lý (RDS, Cloud SQL, Azure)</td><td>dịch vụ log của nhà cung cấp</td><td>console / CloudWatch Logs (bài 13.4)</td></tr>
</tbody></table>
<p>Đừng học thuộc bảng. Trên máy chủ nào bạn cũng có thể <strong>hỏi thẳng PostgreSQL</strong>: <code>SHOW data_directory;</code>, <code>SHOW log_directory;</code> và <code>SELECT pg_current_logfile();</code>.</p>

<h3>Bước 1 — mặc định của ảnh Docker chính thức</h3>
${lenh('s12/pglog', 0)}
${lenh('s12/pglog', 1)}
${lenh('s12/pglog', 2)}
<p>Thứ bạn có sẵn: mọi thứ ra <strong>stderr</strong>, tiền tố chỉ có <code>%m [%p]</code> (giờ tới mili giây, PID), <strong>không</strong> ghi kết nối và <strong>không</strong> ghi chờ khoá. Ba thiết lập quyết định dòng <em>nào</em> được ghi:</p>
<ul>
<li><code>log_min_messages = warning</code> — thông báo của máy chủ dưới mức WARNING bị bỏ.</li>
<li><code>log_min_error_statement = error</code> — khi một câu lệnh lỗi, <strong>chữ SQL</strong> của nó được ghi thành dòng <code>STATEMENT:</code>. Có ích, và nguy hiểm (bài 12.3: mật khẩu).</li>
<li><code>log_rotation_age = 1440</code> phút và <code>log_rotation_size = 10240</code> kB — chỉ có tác dụng khi collector ghi ra tệp.</li>
</ul>
<p>Để ý <code>log_timezone = Asia/Ho_Chi_Minh</code>: ảnh này lấy từ biến <code>TZ</code>, nên giờ kết thúc bằng <code>+07</code>. Nhiều máy chủ chạy UTC. Luôn đọc phần lệch múi ở cuối giờ trước khi xếp log CSDL cạnh log ứng dụng (bài 1.5).</p>

<h3>Bước 2 — bật thứ một đội thật sự cần</h3>
${lenh('s12/pglog', 3)}
${lenh('s12/pglog', 4)}
${lenh('s12/pglog', 5)}
<ul>
<li><code>ALTER SYSTEM</code> chỉ ghi vào <code>postgresql.auto.conf</code> (tệp này đè lên <code>postgresql.conf</code>). Nó <strong>chưa áp dụng gì</strong> — câu truy vấn cuối vẫn thấy tiền tố cũ.</li>
<li>Phần lớn thiết lập log áp dụng khi <code>SELECT pg_reload_conf()</code>. Ba cái trong danh sách cần <strong>khởi động lại</strong>: <code>logging_collector</code>, <code>max_connections</code> và (bài 12.2) <code>shared_preload_libraries</code>. Trên máy chủ thật, hãy lên lịch khởi động lại trong giờ bảo trì.</li>
<li><code>max_connections = 12</code> chỉ để lab này hết kết nối ở bước 7.</li>
</ul>
<p>Sau khi khởi động lại, xem lại log của Docker:</p>
${lenh('s12/pglog', 6)}
<div class="pitfall co-tieu-de"><p><strong>"docker logs của CSDL bỗng im bặt."</strong> Khi <code>logging_collector = on</code>, PostgreSQL chuyển stderr của chính nó vào các tệp trong <code>$PGDATA/log</code>. Hai dòng trên là hai dòng cuối cùng Docker còn thấy. Nếu đội bạn đọc CSDL qua <code>docker logs</code> hay một bộ gom log bám stderr, bật collector là log biến mất khỏi đó. Hãy chọn một đường, có chủ đích.</p></div>
${lenh('s12/pglog', 7)}
${lenh('s12/pglog', 8)}
<p><code>log_destination = 'stderr,jsonlog'</code> ghi cùng một sự kiện hai lần: tệp <code>.log</code> cho người đọc và tệp <code>.json</code> dạng JSON từng dòng (PostgreSQL 15 trở lên; <code>csvlog</code> có từ 8.3). Tệp chỉ người dùng <code>postgres</code> đọc được (<code>-rw-------</code>) — tốt, vì trong đó có dữ liệu.</p>

<h3>Bước 3 — log_line_prefix, các cột của cuốn sổ</h3>
<p>Tiền tố của ta là <code>'%m [%p] %q%u@%d app=%a client=%h '</code>:</p>
<table>
<thead><tr><th>Mã</th><th>Nghĩa</th><th>Vì sao cần</th></tr></thead>
<tbody>
<tr><td><code>%m</code></td><td>giờ tới mili giây kèm múi</td><td>xếp cạnh log ứng dụng</td></tr>
<tr><td><code>%p</code></td><td>PID của backend</td><td>gom mọi dòng của một phiên; khớp <code>pg_stat_activity.pid</code></td></tr>
<tr><td><code>%q</code></td><td>dừng ở đây với tiến trình không thuộc phiên</td><td>dòng của checkpointer/autovacuum gọn lại</td></tr>
<tr><td><code>%u@%d</code></td><td>người dùng @ CSDL</td><td>ai, và ở đâu</td></tr>
<tr><td><code>%a</code></td><td><code>application_name</code></td><td>dịch vụ nào: <code>shop-api</code>, <code>report-job</code>, DBeaver…</td></tr>
<tr><td><code>%h</code></td><td>máy khách</td><td>máy nào (dò mật khẩu, "ai chạy DROP")</td></tr>
<tr><td><code>%e</code>, <code>%l</code>, <code>%c</code>, <code>%x</code>, <code>%Q</code></td><td>SQLSTATE, số dòng trong phiên, mã phiên, mã giao dịch, mã truy vấn</td><td>thêm khi cần; <code>%Q</code> đi cặp với pg_stat_statements (12.2)</td></tr>
</tbody></table>
<p><code>%a</code> chỉ có giá trị khi ứng dụng <strong>đặt</strong> <code>application_name</code>: <code>?application_name=shop-api</code> trong URL Postgres, tuỳ chọn <code>application_name</code> trong Pool của node-postgres, <code>spring.datasource.hikari.data-source-properties.ApplicationName</code> trong Spring Boot. Hãy đòi nó lúc review mã: không tốn gì mà cứu được hàng giờ.</p>

<h3>Bước 4 — bốn lỗi, và máy chủ kể lại thế nào</h3>
${lenh('s12/pglog', 9)}
${lenh('s12/pglog', 10)}
${lenh('s12/pglog', 11)}
${lenh('s12/pglog', 12)}
<p>Đó là thứ <em>máy khách</em> thấy. Giờ đến phía máy chủ:</p>
${lenh('s12/pglog', 13)}
<p>Đọc theo PID — mọi dòng có <code>[108]</code> là một phiên:</p>
<ol>
<li><code>connection received: host=10.20.0.50 port=46544</code> — một kết nối TCP tới. Người dùng, CSDL, ứng dụng vẫn là <code>[unknown]</code>: chưa xác thực gì cả.</li>
<li><code>connection authenticated: identity="app" method=scram-sha-256 (pg_hba.conf:128)</code> — mật khẩu đúng, và bạn biết <strong>luật pg_hba nào</strong> đã cho vào.</li>
<li><code>connection authorized: … application_name=shop-api</code> — từ đây <code>app=</code> mới có giá trị.</li>
<li><code>ERROR … HINT … STATEMENT</code> — lỗi, gợi ý của máy chủ ("Perhaps you meant… accounts.owner") và câu SQL đã hỏng.</li>
<li><code>disconnection: session time: 0:00:00.012</code> — phiên sống bao lâu.</li>
</ol>
<p>Hai chi tiết máy khách không bao giờ thấy: lần sai mật khẩu (PID 92) có <code>DETAIL: Connection matched file … line 128: "host all all all scram-sha-256"</code> — biết luật nào đã được thử. Còn phiên sai tên CSDL (PID 100) đã <em>xác thực thành công</em> rồi mới hỏng — mật khẩu đúng, chỉ sai tên CSDL. Một ticket ghi "không đăng nhập được" có hai nguyên nhân rất khác nhau; log tách chúng ra.</p>

<h3>Mức độ: ERROR không phải FATAL</h3>
<table>
<thead><tr><th>Mức</th><th>Chuyện gì xảy ra</th><th>Ví dụ ở trên</th></tr></thead>
<tbody>
<tr><td><code>LOG</code></td><td>thông tin quản trị viên yêu cầu (kết nối, thời gian chạy, checkpoint)</td><td><code>connection authorized</code></td></tr>
<tr><td><code>WARNING</code> / <code>NOTICE</code></td><td>có gì đó lạ, việc vẫn tiếp tục</td><td>"there is no transaction in progress"</td></tr>
<tr><td><code>ERROR</code></td><td><strong>câu lệnh/giao dịch</strong> này hỏng; phiên vẫn sống</td><td>cột không tồn tại, trùng khoá, deadlock</td></tr>
<tr><td><code>FATAL</code></td><td><strong>phiên</strong> này kết thúc</td><td>sai mật khẩu, không có CSDL, quá nhiều kết nối</td></tr>
<tr><td><code>PANIC</code></td><td><strong>cả máy chủ</strong> khởi động lại mọi phiên</td><td>không bao giờ nên thấy; mở sự cố ngay</td></tr>
</tbody></table>
<p>Mỗi lỗi còn có một <strong>SQLSTATE</strong> năm ký tự, mà ứng dụng cũng nhận được (node-postgres <code>err.code</code>, JDBC <code>getSQLState()</code>). Các mã trong bài: <code>28P01</code> sai mật khẩu, <code>3D000</code> không có CSDL, <code>42703</code> không có cột, <code>23505</code> vi phạm unique, <code>40P01</code> deadlock, <code>53300</code> quá nhiều kết nối, <code>57P03</code> máy chủ đang khởi động. Ghi mã này vào log ứng dụng, là bạn grep được cả hai phía bằng cùng năm ký tự.</p>

<h3>Bước 5 — chờ khoá: ai đang chặn ai</h3>
<p>Phiên A (<code>shop-api</code>) cập nhật tài khoản 1 và giữ giao dịch mở 3 giây. Phiên B (<code>report-job</code>) muốn đúng dòng đó:</p>
${lenh('s12/pglog', 14)}
<p>Với <code>log_lock_waits = on</code>, PostgreSQL ghi một dòng khi việc chờ vượt <code>deadlock_timeout</code> (ở đây 1 giây): ai chờ (137), chờ cái gì (<code>ShareLock on transaction 754</code> = "chờ tới khi giao dịch kia kết thúc"), <strong>ai đang giữ</strong> (<code>Process holding the lock</code>) và sau đó, thực sự đã chờ bao lâu (2504.779 ms). Bước tiếp theo trong sự cố thật: grep PID của bên giữ khoá (<code>grep '\\[PIDBENGIU\\]' …</code>) để xem nó đang làm gì — rất hay là một phiên <code>idle in transaction</code> ai đó quên commit, hoặc một migration dài.</p>

<h3>Bước 6 — deadlock: log ghi cả hai phía</h3>
${lenh('s12/pglog', 15)}
<p>A khoá dòng 1 rồi muốn dòng 2; B khoá dòng 2 rồi muốn dòng 1. Không ai đi tiếp được, nên sau <code>deadlock_timeout</code> PostgreSQL chọn một nạn nhân (ở đây tiến trình 155, <code>chuyen-tien-A</code>), huỷ giao dịch của nó với mã <code>40P01</code>, và bên kia chạy xong. <code>DETAIL</code> liệt kê <strong>cả hai</strong> tiến trình và <strong>cả hai</strong> câu lệnh; <code>CONTEXT</code> chỉ ra bảng. Cách sửa không bao giờ chỉ là "thử lại mạnh hơn": cho mọi đường mã khoá dòng theo cùng một thứ tự (ví dụ luôn khoá tài khoản có id nhỏ hơn trước), và thử lại giao dịch bị huỷ ở ứng dụng.</p>

<h3>Bước 7 — hết kết nối</h3>
<p>Chín worker chạy nền đang giữ <code>SELECT pg_sleep(4)</code>. Rồi API thử kết nối:</p>
${lenh('s12/pglog', 16)}
${lenh('s12/pglog', 17)}
${lenh('s12/pglog', 18)}
${lenh('s12/pglog', 19)}
<p>Tính: <code>max_connections = 12</code>, trong đó <code>superuser_reserved_connections = 3</code> để dành cho siêu người dùng. Chín phiên thường lấp phần còn lại, nên người dùng thường thứ mười nhận <code>remaining connection slots are reserved…</code>. Khi siêu người dùng cũng lấp nốt chỗ dành riêng, thì <strong>cả DBA</strong> cũng nhận <code>sorry, too many clients already</code>. Cả hai đều là <code>53300</code>. Nguyên nhân hay gặp trong dự án thật: kích thước pool × số bản chạy ứng dụng &gt; <code>max_connections</code> (bốn pod × pool 20 = 80 kết nối trước khi ai khác vào), rò kết nối (mã không bao giờ trả client), hoặc một truy vấn chậm làm mỗi request giữ kết nối lâu hơn.</p>

<h3>Bước 8 — nhìn tổng quan bằng grep, rồi jq</h3>
${lenh('s12/pglog', 20)}
<p>Lượt đầu trên một log lạ: đếm dòng theo mức và mấy chữ đầu. Phần lớn là <code>LOG</code> của việc ghi kết nối — đó là cái giá của <code>log_connections</code> (bốn dòng mỗi phiên). Rồi sang tệp JSON, nơi trường nào cũng có tên:</p>
${lenh('s12/pglog', 21)}
${lenh('s12/pglog', 22)}
${lenh('s12/pglog', 23)}
<ul>
<li><code>error_severity</code>, <code>state_code</code>, <code>remote_host</code>, <code>user</code>, <code>dbname</code>: lọc không cần regex. Hết cảnh đoán tên người dùng kết thúc ở đâu.</li>
<li><code>application_name</code> là <code>null</code> ở các dòng FATAL: phiên chết trước khi gói khởi động được xử lý — giống <code>app=[unknown]</code> trong log chữ.</li>
<li>Thông báo nhiều dòng (DETAIL của deadlock, kế hoạch auto_explain ở 12.2) vẫn là <strong>một</strong> đối tượng JSON. Trong log chữ chúng là nhiều dòng bắt đầu bằng tab — lý do jsonlog dễ gửi sang Loki/Elasticsearch hơn hẳn (Chương 15).</li>
<li><code>disconnection … session time</code> cho biết phiên sống bao lâu. Hàng nghìn phiên vài mili giây = ứng dụng mở kết nối mới cho mỗi request (không có pool). Phiên sống nhiều ngày = pool, hoặc rò.</li>
</ul>
<p>Thêm một dòng ở bước 1 đáng biết: <code>FATAL: the database system is starting up</code> (<code>57P03</code>) ngay sau khi khởi động lại là vô hại — một máy khách vào sớm một giây. Thấy nó <em>lặp đi lặp lại</em> giữa ngày nghĩa là máy chủ cứ sập rồi phục hồi: tìm <code>server process … was terminated by signal</code> và <code>all server processes terminated; reinitializing</code> ngay trước đó.</p>

<h3>Góc hacker: log cũng là một bản sao dữ liệu của bạn</h3>
<p>Nhìn lại bước 4: <code>DETAIL: Key (email)=(an@example.com) already exists.</code> và dòng <code>STATEMENT</code> có cả họ tên, số điện thoại. Không ai quyết định cả, dữ liệu cá nhân đã nằm trong một tệp được xoay vòng, sao lưu, có khi còn gửi sang dịch vụ log bên thứ ba. Kẻ tấn công đọc được thư mục log (bucket sao lưu cấu hình sai, bộ gom log phân quyền lỏng) là đọc được dữ liệu, chẳng cần chạm vào bảng. Hai thói quen: giữ <code>$PGDATA/log</code> ở quyền <code>0600</code> của <code>postgres</code> (như ở đây) và bảo vệ đường ống log ngang với CSDL. Bài 12.3 nói tiếp về mật khẩu trong log; bài 16.3 về che dữ liệu.</p>

<h3>Tình huống đời thật</h3>
<ul>
<li><strong>OJT, "API trả 500 lúc 14:03":</strong> mở log CSDL từ 14:02–14:04, lọc <code>app=shop-api</code> và <code>ERROR|FATAL</code>, ghi lại SQLSTATE. <code>23505</code> = lỗi ứng dụng (không kiểm trước khi insert), <code>53300</code> = năng lực, <code>40P01</code> = thứ tự khoá, <code>57P03</code> = CSDL đang khởi động lại.</li>
<li><strong>Outsourcing, DBA của khách gửi bạn một tệp zip log:</strong> trước hết hỏi <code>SHOW log_line_prefix</code> bên họ. Không có <code>%u %d %a %h</code> thì bạn không tách được dòng của ứng dụng mình khỏi của người khác — đề nghị họ thêm vào trước đợt test sau.</li>
<li><strong>"Không kết nối được" sau khi tăng từ 2 lên 6 pod:</strong> đếm dòng <code>53300</code> và tính pool × số pod. Tăng <code>max_connections</code> là cách cuối cùng (mỗi kết nối là một tiến trình có bộ nhớ riêng); hãy giảm pool hoặc dùng PgBouncer trước.</li>
</ul>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
<li>Chạy <code>postgres:17</code> bằng Docker, tìm log bằng <code>SHOW</code>/<code>pg_current_logfile()</code> và thấy rằng <code>docker logs</code> chính là log.</li>
<li>Đặt <code>log_line_prefix</code>, ghi kết nối và jsonlog như bước 2; khởi động lại; kết nối với <code>PGAPPNAME=bai-tap</code> và chạy một câu gõ sai.</li>
<li>Tái hiện chờ khoá bằng hai cửa sổ <code>psql</code> (<code>BEGIN; UPDATE …</code> ở cửa sổ đầu, cùng câu <code>UPDATE</code> ở cửa sổ hai, đợi 2 giây, <code>COMMIT</code> cửa sổ đầu).</li>
<li>Dùng jq liệt kê mọi FATAL kèm <code>state_code</code> và <code>remote_host</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> câu gõ sai hiện thành <code>ERROR … STATEMENT</code> với <code>app=bai-tap</code>; bạn thấy <code>still waiting … after 1000</code> rồi <code>acquired … after</code> ≈ thời gian bạn đã đợi; và giải thích được vì sao <code>application_name</code> là null ở dòng FATAL.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['logging_collector', 'Tiến trình nền thu stderr vào tệp trong log_directory; đổi phải khởi động lại.'],
  ['log_destination', 'stderr, csvlog, jsonlog (từ 15), syslog, eventlog — được bật nhiều cái cùng lúc.'],
  ['log_line_prefix', 'Các cột thêm vào mỗi dòng: %m giờ, %p PID, %u người dùng, %d CSDL, %a ứng dụng, %h máy khách, %e SQLSTATE.'],
  ['ALTER SYSTEM', 'Ghi postgresql.auto.conf; áp dụng bằng pg_reload_conf() hoặc khởi động lại.'],
  ['SQLSTATE', 'Mã lỗi năm ký tự dùng chung giữa log máy chủ và driver (28P01, 23505, 40P01, 53300…).'],
  ['log_lock_waits / deadlock_timeout', 'Ghi việc chờ khoá lâu hơn deadlock_timeout, kèm PID bên đang giữ.'],
  ['ERROR / FATAL / PANIC', 'Câu lệnh hỏng · phiên kết thúc · cả máy chủ khởi động lại.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Hỏi PostgreSQL log nằm đâu: <code>pg_current_logfile()</code>.</li>
<li>Tiền tố mặc định quá mỏng; thêm <code>%u@%d app=%a client=%h</code> và bắt ứng dụng đặt <code>application_name</code>.</li>
<li>Bật collector ⇒ <code>docker logs</code> im lặng.</li>
<li>Đọc một phiên theo PID: received → authenticated → authorized → ERROR/STATEMENT → disconnection.</li>
<li>Chờ khoá chỉ ra bên giữ; deadlock liệt kê cả hai câu; <code>53300</code> = hết chỗ.</li>
<li>jsonlog giữ thông báo nhiều dòng trong một đối tượng — dùng nó cho công cụ.</li>
</ul>
${nguon('📘', 'PostgreSQL 17 — Error Reporting and Logging', 'log_destination, logging_collector, mã của log_line_prefix, các khoá jsonlog', 'https://www.postgresql.org/docs/17/runtime-config-logging.html')}
${nguon('📘', 'PostgreSQL 17 — Error codes (Phụ lục A)', 'Mọi SQLSTATE: 28P01, 3D000, 23505, 40P01, 53300, 57P03…', 'https://www.postgresql.org/docs/17/errcodes-appendix.html')}
${nguon('📘', 'PostgreSQL 17 — ALTER SYSTEM', 'postgresql.auto.conf, reload hay khởi động lại', 'https://www.postgresql.org/docs/17/sql-altersystem.html')}
${lienKet({ khoa: 'postgresql', bai: 'postgresql-14-4-giam-sat', title: 'PostgreSQL 14.4 — Giám sát', sub: 'pg_stat_activity, idle in transaction, bảng theo dõi đặt cạnh log', cta: 'Mở bài' })}
${lienKet({ khoa: 'postgresql', bai: 'postgresql-11-4-khoa-deadlock', title: 'PostgreSQL 11.4 — Khoá và deadlock', sub: 'Vì sao thứ tự khoá quan trọng, thiết kế để tránh', cta: 'Mở bài' })}
${lienKet({ khoa: 'postgresql', bai: 'postgresql-14-2-pool-pgbouncer', title: 'PostgreSQL 14.2 — Pool và PgBouncer', sub: 'Cách chữa 53300 không phải là "tăng max_connections"', cta: 'Mở bài' })}
</div>
`,
};
