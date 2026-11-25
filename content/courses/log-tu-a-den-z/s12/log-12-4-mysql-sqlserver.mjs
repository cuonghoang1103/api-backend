/**
 * 12.4 — MySQL/MariaDB và SQL Server ở mức nhận biết (soạn 24/11/2026, agent lgz).
 * Output thật: OUT['s12/mysql'] — MySQL 8.4.13 (ảnh mysql:8.4, cấu hình mặc định, bảng orders 600 000 dòng);
 * OUT['s12/mssql'] — SQL Server 2022 RTM-CU28 16.0.4325.4 bản Developer trên Linux (ảnh mcr.microsoft.com/mssql/server:2022-latest).
 * Cả hai --network none, --memory 2g; máy khách chạy trong container qua 127.0.0.1. MariaDB không chạy — chỉ ghi khác biệt.
 * Chạy lại ⇒ giờ đổi: soát số trong lời ("0.035382 / 144318", "0.250901", "State 8/5/38, 18470 State 1").
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '12.4 — MySQL/MariaDB and SQL Server logs at recognition level|||12.4 — MySQL/MariaDB và SQL Server ở mức nhận biết: error/general/slow log; ERRORLOG, Log Viewer, lỗi 18456 và các state',
  slug: 'log-12-4-mysql-sqlserver',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Đủ để không bỡ ngỡ khi dự án dùng MySQL hay SQL Server: ba loại log của MySQL (error, slow, general), vì sao "Access denied" không có trong error log mặc định, slow log ghi cả câu nhanh mà không dùng chỉ mục, giờ UTC trong log; ERRORLOG của SQL Server, sp_readerrorlog, và đọc state của lỗi 18456 để biết sai mật khẩu, sai tên đăng nhập hay sai CSDL — trên output thật của MySQL 8.4 và SQL Server 2022.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.4</span>
<h2>MySQL and SQL Server: the same questions, different files</h2>
<p class="lead">Many outsourcing projects run on MySQL (web shops, PHP/Laravel, WordPress) or SQL Server (.NET, banking, Japanese enterprise customers). You do not need to administer them to read their logs. This lesson maps what you learned for PostgreSQL onto both: where the error log is, how to catch slow queries, and how to read a failed login — the most common ticket of all.</p>

<h3>The map</h3>
<table>
<thead><tr><th>Question</th><th>PostgreSQL</th><th>MySQL / MariaDB</th><th>SQL Server</th></tr></thead>
<tbody>
<tr><td>Server errors, startup, crashes</td><td>server log (12.1)</td><td><strong>error log</strong> (<code>log_error</code>)</td><td><strong>ERRORLOG</strong> (+ Windows Application log)</td></tr>
<tr><td>Slow statements</td><td><code>log_min_duration_statement</code></td><td><strong>slow query log</strong> (<code>long_query_time</code>)</td><td>Query Store, Extended Events</td></tr>
<tr><td>Every statement</td><td><code>log_statement = all</code></td><td><strong>general query log</strong></td><td>Extended Events / SQL Server Audit</td></tr>
<tr><td>Failed logins</td><td><code>FATAL 28P01</code></td><td>error log, only at verbosity 3</td><td>ERRORLOG <code>18456</code> + state</td></tr>
<tr><td>Audit</td><td>pgAudit (12.3)</td><td>audit plugin (Enterprise, Percona, MariaDB plugin)</td><td>SQL Server Audit</td></tr>
</tbody></table>

<h3>Part A — MySQL 8.4</h3>
<h4>A1. Where the three logs are</h4>
${lenh('s12/mysql', 0)}
${lenh('s12/mysql', 1)}
<ul>
<li><code>log_error = stderr</code> in the Docker image ⇒ <code>docker logs</code>. On an apt/dnf install it is usually <code>/var/log/mysql/error.log</code> or <code>/var/log/mysqld.log</code> — ask the server: <code>SELECT @@log_error</code>.</li>
<li>Slow log and general log are <strong>off</strong>; <code>long_query_time = 10</code> seconds — so by default nothing slower than "very slow" is ever logged.</li>
<li><code>log_timestamps = UTC</code> while <code>system_time_zone = +07</code>: MySQL writes log times in <strong>UTC</strong> by default (the <code>Z</code> at the end). PostgreSQL in 12.1 wrote <code>+07</code>. Line them up carefully.</li>
</ul>

<h4>A2. "Access denied" is not in the error log — until you ask</h4>
${lenh('s12/mysql', 2)}
${lenh('s12/mysql', 3)}
${lenh('s12/mysql', 4)}
${lenh('s12/mysql', 5)}
${lenh('s12/mysql', 6)}
<p>With the default <code>log_error_verbosity = 2</code> (errors + warnings) a wrong password leaves <strong>no trace</strong> on the server. Failed logins are written as <code>[Note]</code>, which needs verbosity 3. After <code>SET PERSIST</code> (survives restarts, stored in <code>mysqld-auto.cnf</code>), each attempt is a line with code <code>MY-010926</code>, the user and the client: <code>'app'@'127.0.0.1'</code> exists, <code>'ghost'@'127.0.0.1'</code> does not — but the line looks the same for both. Notice also the client's own warning: <em>Using a password on the command line interface can be insecure</em> — the password is visible in <code>ps</code> and in shell history (that is why the lab uses <code>~/.my.cnf</code> for root).</p>

<h4>A3. The slow query log</h4>
${lenh('s12/mysql', 7)}
${lenh('s12/mysql', 8)}
${lenh('s12/mysql', 9)}
<p>Each entry is a small block, not one line:</p>
<ul>
<li><code># Time:</code> (UTC) · <code># User@Host: app[app] @ [127.0.0.1] Id: 15</code> — who and from where.</li>
<li><code># Query_time: 0.035382 Lock_time: 0.000002 Rows_sent: 3 Rows_examined: 144318</code> — the most useful line. <strong>Rows_examined ÷ Rows_sent</strong> is the same signal as PostgreSQL's <code>Rows Removed by Filter</code>: 144 318 rows read to return 3.</li>
<li><code>SET timestamp=…; </code> then the SQL.</li>
</ul>
<p>Why is a 35 ms query in a log whose threshold is 0.2 s? Because we also turned on <code>log_queries_not_using_indexes</code>: a full table scan is logged whatever its duration. That catches tomorrow's slow query while the table is still small — and on a busy server it can flood the log; <code>log_throttle_queries_not_using_indexes</code> limits it. The <code>SLEEP(0.25)</code> was logged by the threshold, with <code>Rows_examined: 1</code>: slow, but not because of a scan.</p>
${lenh('s12/mysql', 10)}
${lenh('s12/mysql', 11)}
<p>The summary tools — <code>mysqldumpslow</code> (ships with MySQL server packages) and Percona's <code>pt-query-digest</code> (the pgBadger of MySQL) — are not in the Docker image; install them on your workstation and copy the slow log there. Until then, awk over <code># Query_time</code> lines gets you far.</p>

<h4>A4. The general log: everything, briefly</h4>
${lenh('s12/mysql', 12)}
${lenh('s12/mysql', 13)}
<p>Every connect, every query, every quit, with a thread id — and the queries of the person who turned it off. It is the MySQL equivalent of <code>log_statement = all</code>: switch it on for a few minutes to see what an ORM really sends, then off. Left on, it fills the disk and contains every value your users ever typed.</p>

<h4>MariaDB in one paragraph</h4>
<p>MariaDB (a fork of MySQL, default on many Linux distributions) has the same three logs. Differences you will notice: newer versions also accept the names <code>log_slow_query</code> / <code>log_slow_query_time</code> beside the old ones; the slow log can add the plan with <code>log_slow_verbosity = query_plan,explain</code>; the error log's level of detail is set by <code>log_warnings</code> (MariaDB has no <code>log_error_verbosity</code>); and MariaDB ships an audit plugin (<code>server_audit</code>) in the community version.</p>

<h3>Part B — SQL Server 2022</h3>
<h4>B1. ERRORLOG and its friends</h4>
${lenh('s12/mssql', 0)}
${lenh('s12/mssql', 1)}
<ul>
<li><code>errorlog</code> is the current server log; <code>errorlog.1</code>, <code>.2</code>… are previous ones (a new file at every restart, or with <code>sp_cycle_errorlog</code>; six kept by default). On Windows the path is like <code>C:\\Program Files\\Microsoft SQL Server\\MSSQL16.MSSQLSERVER\\MSSQL\\Log\\ERRORLOG</code>.</li>
<li>The <code>.xel</code> files are <strong>Extended Events</strong> sessions running by default — <code>system_health</code> records deadlocks, severe errors and long waits without you configuring anything. Read them in SSMS (Management → Extended Events) or with <code>sys.fn_xe_file_target_read_file</code>.</li>
<li>On Windows, SQL Server also writes these messages to the <strong>Application</strong> event log (source <code>MSSQLSERVER</code>) — so failed logins show up in Event Viewer and in a Windows log collector (lesson 15.4). On Linux, only the file.</li>
</ul>

<h4>B2. Error 18456: the client sees one message, the server sees the reason</h4>
${lenh('s12/mssql', 2)}
${lenh('s12/mssql', 3)}
${lenh('s12/mssql', 4)}
${lenh('s12/mssql', 5)}
<p>Wrong password and non-existent login give the client <strong>exactly the same</strong> message — on purpose, so an attacker cannot learn which login names exist. The reason is written only on the server:</p>
${lenh('s12/mssql', 6)}
${lenh('s12/mssql', 7)}
<table>
<thead><tr><th>Error, State</th><th>Reason in ERRORLOG</th><th>What to do</th></tr></thead>
<tbody>
<tr><td>18456, <strong>8</strong></td><td>Password did not match</td><td>wrong password (or changed and the app was not updated); many in a row from one client = guessing</td></tr>
<tr><td>18456, <strong>5</strong></td><td>Could not find a login matching the name</td><td>typo in the user name, wrong environment, or a scanner trying <code>sa</code>/<code>admin</code></td></tr>
<tr><td>18456, <strong>38</strong></td><td>Failed to open the explicitly specified database</td><td>the login is fine; the database in the connection string is wrong or missing, or the login has no user in it</td></tr>
<tr><td>18470, 1</td><td>The account is disabled</td><td>someone disabled the login (offboarding?) — a different error number, easy to miss if you grep only 18456</td></tr>
</tbody></table>
<p>Other states you will meet: <strong>7</strong> (disabled <em>and</em> wrong password), <strong>18</strong> (password must be changed), <strong>58</strong> (SQL login used while the server allows only Windows authentication). Microsoft's page for MSSQLSERVER_18456 lists them all.</p>

<h4>B3. Reading ERRORLOG from T-SQL</h4>
${lenh('s12/mssql', 8)}
${lenh('s12/mssql', 9)}
<p><code>sp_readerrorlog 0, 1, N'Login failed'</code> = current log (0), SQL Server log (1; 2 would be the Agent log), filtered by a string. It is how you read the log when you only have a SQL connection (managed instances, a customer's server through a jump host). In SSMS the same data is under <strong>Management → SQL Server Logs</strong> (Log Viewer), which can also merge Windows and Agent logs in one view.</p>

<h3>Hacker's corner: what a failed-login log tells an attacker, and what it tells you</h3>
<p>SQL Server and PostgreSQL both refuse to tell the <em>client</em> whether a login exists — a defence against user-name enumeration. The server log, on the other hand, separates them precisely (State 5 vs 8, <code>Role "admin" does not exist</code> in 12.3). That makes the log valuable to defenders and sensitive: whoever can read it learns which accounts exist and which ones are being targeted. A burst of State 5 for <code>sa</code>, <code>admin</code>, <code>backup</code> from one address is a scanner; a burst of State 8 for a single real login is a targeted guess, and is worth an alert (Chapter 15). Internet-facing instances are routinely brute-forced through <code>sa</code>; renaming or disabling <code>sa</code> turns that noise into State 5 and makes the targeted attempts stand out.</p>

<h3>Real-life situations</h3>
<ul>
<li><strong>Outsourcing .NET project, "the app cannot connect after deploy":</strong> ask the DBA for the ERRORLOG lines around the deploy time. State 38 = the connection string names a database that does not exist on that environment; State 8 = the password in the new appsettings is wrong; 18470 = the login was disabled.</li>
<li><strong>Laravel/WordPress on MySQL is slow:</strong> turn on the slow log with <code>long_query_time = 0.5</code> for an hour, then sort by <code>Rows_examined</code>. Turn on the general log only to see what the ORM sends, for minutes.</li>
<li><strong>"There is nothing in the MySQL log about failed logins":</strong> check <code>log_error_verbosity</code> before concluding there were none.</li>
</ul>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok"><ol>
<li>Run <code>mysql:8.4</code>, try a wrong password, check the error log; raise <code>log_error_verbosity</code> to 3 and try again.</li>
<li>Enable the slow log with <code>long_query_time = 0.2</code> and <code>log_queries_not_using_indexes = ON</code>; run one query on an unindexed column and one <code>SELECT SLEEP(0.3)</code>.</li>
<li>Run SQL Server 2022 in Docker (needs 2 GB RAM), produce States 8, 5 and 38 and a disabled login, then read them with <code>sp_readerrorlog</code>.</li>
</ol>
<p><strong>Done when:</strong> you can explain why step 1 shows nothing the first time; the slow log contains your scan with <code>Rows_examined</code> far above <code>Rows_sent</code>; and you can name the cause of each failed login from its State alone.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['log_error / log_error_verbosity', 'MySQL error log location; 1 errors, 2 + warnings, 3 + notes (failed logins).'],
  ['slow query log', 'MySQL: slow_query_log, long_query_time, log_queries_not_using_indexes; blocks with Query_time and Rows_examined.'],
  ['general query log', 'MySQL: every connect/query/quit; on only for minutes.'],
  ['log_timestamps', 'MySQL default UTC — log times differ from the server\'s local time.'],
  ['ERRORLOG', 'SQL Server log file; new file per restart; errorlog.1… older ones.'],
  ['18456 + State', '8 wrong password · 5 unknown login · 38 cannot open database; 18470 = disabled.'],
  ['sp_readerrorlog', 'Read/filter ERRORLOG from T-SQL; SSMS Log Viewer shows the same.'],
  ['Extended Events', 'SQL Server tracing; system_health session runs by default (.xel files).'],
])}

<h3>📌 Summary</h3>
<ul>
<li>MySQL has three logs: error (on), slow (off, 10 s), general (off). Times in UTC.</li>
<li>Failed MySQL logins need verbosity 3.</li>
<li>Rows_examined ÷ Rows_sent is MySQL's "missing index" signal.</li>
<li>SQL Server: ERRORLOG (+ Application log on Windows), sp_readerrorlog, Extended Events.</li>
<li>18456: the client sees one message, the State in ERRORLOG gives the reason.</li>
</ul>
${nguon('📘', 'MySQL 8.4 — The Slow Query Log', 'long_query_time, log_queries_not_using_indexes, log format', 'https://dev.mysql.com/doc/refman/8.4/en/slow-query-log.html')}
${nguon('📘', 'MariaDB — Slow Query Log Overview', 'log_slow_query, log_slow_verbosity', 'https://mariadb.com/kb/en/slow-query-log-overview/')}
${nguon('📘', 'Microsoft Learn — MSSQLSERVER_18456', 'Every state of error 18456 and what it means', 'https://learn.microsoft.com/en-us/sql/relational-databases/errors-events/mssqlserver-18456-database-engine-error')}
${nguon('📘', 'Microsoft Learn — sp_readerrorlog', 'Parameters: log number, log type, search strings', 'https://learn.microsoft.com/en-us/sql/relational-databases/system-stored-procedures/sp-readerrorlog-transact-sql')}
${nguon('📘', 'Microsoft Learn — Extended Events overview', 'Sessions, system_health, reading .xel', 'https://learn.microsoft.com/en-us/sql/relational-databases/extended-events/extended-events')}
${lienKet({ khoa: 'postgresql', bai: 'postgresql-17-1-bon-he-csdl', title: 'PostgreSQL 17.1 — Four database systems', sub: 'Where MySQL, SQL Server, MongoDB differ from PostgreSQL', cta: 'Open lesson' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-15-4-windows-ve-trung-tam', title: 'Lesson 15.4 — Windows logs to the centre', sub: 'Ship the Application log (and 18456) to your SIEM', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.4</span>
<h2>MySQL và SQL Server: cùng câu hỏi, khác tệp</h2>
<p class="lead">Nhiều dự án outsourcing chạy MySQL (web bán hàng, PHP/Laravel, WordPress) hoặc SQL Server (.NET, ngân hàng, khách doanh nghiệp Nhật). Bạn không cần quản trị chúng mới đọc được log. Bài này đặt những gì đã học với PostgreSQL lên cả hai: error log nằm đâu, bắt truy vấn chậm thế nào, và đọc một lần đăng nhập hỏng — loại ticket phổ biến nhất.</p>

<h3>Bản đồ</h3>
<table>
<thead><tr><th>Câu hỏi</th><th>PostgreSQL</th><th>MySQL / MariaDB</th><th>SQL Server</th></tr></thead>
<tbody>
<tr><td>Lỗi máy chủ, khởi động, sập</td><td>log máy chủ (12.1)</td><td><strong>error log</strong> (<code>log_error</code>)</td><td><strong>ERRORLOG</strong> (+ Application log của Windows)</td></tr>
<tr><td>Câu chậm</td><td><code>log_min_duration_statement</code></td><td><strong>slow query log</strong> (<code>long_query_time</code>)</td><td>Query Store, Extended Events</td></tr>
<tr><td>Mọi câu</td><td><code>log_statement = all</code></td><td><strong>general query log</strong></td><td>Extended Events / SQL Server Audit</td></tr>
<tr><td>Đăng nhập hỏng</td><td><code>FATAL 28P01</code></td><td>error log, chỉ ở verbosity 3</td><td>ERRORLOG <code>18456</code> + state</td></tr>
<tr><td>Kiểm toán</td><td>pgAudit (12.3)</td><td>plugin audit (Enterprise, Percona, plugin của MariaDB)</td><td>SQL Server Audit</td></tr>
</tbody></table>

<h3>Phần A — MySQL 8.4</h3>
<h4>A1. Ba loại log nằm đâu</h4>
${lenh('s12/mysql', 0)}
${lenh('s12/mysql', 1)}
<ul>
<li><code>log_error = stderr</code> trong ảnh Docker ⇒ <code>docker logs</code>. Cài bằng apt/dnf thì thường là <code>/var/log/mysql/error.log</code> hoặc <code>/var/log/mysqld.log</code> — hỏi máy chủ: <code>SELECT @@log_error</code>.</li>
<li>Slow log và general log đang <strong>tắt</strong>; <code>long_query_time = 10</code> giây — nên mặc định chẳng có gì dưới mức "cực chậm" được ghi.</li>
<li><code>log_timestamps = UTC</code> trong khi <code>system_time_zone = +07</code>: MySQL mặc định ghi giờ trong log theo <strong>UTC</strong> (chữ <code>Z</code> ở cuối). PostgreSQL ở 12.1 ghi <code>+07</code>. Xếp chúng cạnh nhau cho cẩn thận.</li>
</ul>

<h4>A2. "Access denied" không có trong error log — tới khi bạn yêu cầu</h4>
${lenh('s12/mysql', 2)}
${lenh('s12/mysql', 3)}
${lenh('s12/mysql', 4)}
${lenh('s12/mysql', 5)}
${lenh('s12/mysql', 6)}
<p>Với mặc định <code>log_error_verbosity = 2</code> (lỗi + cảnh báo), sai mật khẩu <strong>không để lại dấu vết</strong> nào trên máy chủ. Đăng nhập hỏng được ghi ở mức <code>[Note]</code>, cần verbosity 3. Sau <code>SET PERSIST</code> (giữ qua khởi động lại, lưu ở <code>mysqld-auto.cnf</code>), mỗi lần thử là một dòng mã <code>MY-010926</code>, kèm người dùng và máy khách: <code>'app'@'127.0.0.1'</code> có tồn tại, <code>'ghost'@'127.0.0.1'</code> thì không — nhưng dòng log trông y hệt nhau. Để ý cả cảnh báo của chính máy khách: <em>Using a password on the command line interface can be insecure</em> — mật khẩu hiện trong <code>ps</code> và trong lịch sử shell (vì thế lab dùng <code>~/.my.cnf</code> cho root).</p>

<h4>A3. Slow query log</h4>
${lenh('s12/mysql', 7)}
${lenh('s12/mysql', 8)}
${lenh('s12/mysql', 9)}
<p>Mỗi mục là một khối nhỏ, không phải một dòng:</p>
<ul>
<li><code># Time:</code> (UTC) · <code># User@Host: app[app] @ [127.0.0.1] Id: 15</code> — ai và từ đâu.</li>
<li><code># Query_time: 0.035382 Lock_time: 0.000002 Rows_sent: 3 Rows_examined: 144318</code> — dòng có ích nhất. <strong>Rows_examined ÷ Rows_sent</strong> là cùng tín hiệu với <code>Rows Removed by Filter</code> của PostgreSQL: đọc 144 318 dòng để trả 3.</li>
<li><code>SET timestamp=…;</code> rồi tới câu SQL.</li>
</ul>
<p>Vì sao một câu 35 ms lại nằm trong log có ngưỡng 0,2 giây? Vì ta bật thêm <code>log_queries_not_using_indexes</code>: quét toàn bảng là bị ghi, bất kể chạy bao lâu. Nó bắt được câu chậm của ngày mai khi bảng còn nhỏ — và trên máy chủ bận có thể làm ngập log; <code>log_throttle_queries_not_using_indexes</code> giới hạn lại. Còn <code>SLEEP(0.25)</code> bị ghi vì vượt ngưỡng, với <code>Rows_examined: 1</code>: chậm, nhưng không phải do quét.</p>
${lenh('s12/mysql', 10)}
${lenh('s12/mysql', 11)}
<p>Các công cụ tổng hợp — <code>mysqldumpslow</code> (đi kèm gói MySQL server) và <code>pt-query-digest</code> của Percona (pgBadger của MySQL) — không có trong ảnh Docker; cài trên máy bạn rồi chép slow log về. Trong lúc chờ, awk trên các dòng <code># Query_time</code> đã đi được khá xa.</p>

<h4>A4. General log: tất cả, trong thời gian ngắn</h4>
${lenh('s12/mysql', 12)}
${lenh('s12/mysql', 13)}
<p>Mọi lần kết nối, mọi câu truy vấn, mọi lần thoát, kèm thread id — và cả các câu của người tắt nó đi. Đây là bản MySQL của <code>log_statement = all</code>: bật vài phút để xem ORM thực sự gửi gì, rồi tắt. Để bật mãi thì đầy đĩa, và chứa mọi giá trị người dùng từng gõ.</p>

<h4>MariaDB trong một đoạn</h4>
<p>MariaDB (nhánh tách từ MySQL, mặc định trên nhiều bản phân phối Linux) có đủ ba loại log ấy. Khác biệt bạn sẽ thấy: bản mới nhận thêm tên <code>log_slow_query</code> / <code>log_slow_query_time</code> bên cạnh tên cũ; slow log thêm được kế hoạch bằng <code>log_slow_verbosity = query_plan,explain</code>; mức chi tiết của error log do <code>log_warnings</code> đặt (MariaDB không có <code>log_error_verbosity</code>); và MariaDB kèm sẵn plugin kiểm toán (<code>server_audit</code>) trong bản cộng đồng.</p>

<h3>Phần B — SQL Server 2022</h3>
<h4>B1. ERRORLOG và những người bạn</h4>
${lenh('s12/mssql', 0)}
${lenh('s12/mssql', 1)}
<ul>
<li><code>errorlog</code> là log máy chủ hiện tại; <code>errorlog.1</code>, <code>.2</code>… là các bản trước (mỗi lần khởi động lại sinh tệp mới, hoặc bằng <code>sp_cycle_errorlog</code>; mặc định giữ sáu bản). Trên Windows đường dẫn kiểu <code>C:\\Program Files\\Microsoft SQL Server\\MSSQL16.MSSQLSERVER\\MSSQL\\Log\\ERRORLOG</code>.</li>
<li>Các tệp <code>.xel</code> là phiên <strong>Extended Events</strong> chạy sẵn — <code>system_health</code> ghi deadlock, lỗi nặng và các lần chờ lâu mà bạn không cần cấu hình gì. Đọc trong SSMS (Management → Extended Events) hoặc bằng <code>sys.fn_xe_file_target_read_file</code>.</li>
<li>Trên Windows, SQL Server còn ghi các thông báo này vào event log <strong>Application</strong> (nguồn <code>MSSQLSERVER</code>) — nên đăng nhập hỏng hiện trong Event Viewer và trong bộ gom log Windows (bài 15.4). Trên Linux thì chỉ có tệp.</li>
</ul>

<h4>B2. Lỗi 18456: máy khách thấy một câu, máy chủ thấy lý do</h4>
${lenh('s12/mssql', 2)}
${lenh('s12/mssql', 3)}
${lenh('s12/mssql', 4)}
${lenh('s12/mssql', 5)}
<p>Sai mật khẩu và tên đăng nhập không tồn tại cho máy khách <strong>đúng một</strong> thông báo — cố ý, để kẻ tấn công không biết tên đăng nhập nào có thật. Lý do chỉ được ghi ở máy chủ:</p>
${lenh('s12/mssql', 6)}
${lenh('s12/mssql', 7)}
<table>
<thead><tr><th>Lỗi, State</th><th>Lý do trong ERRORLOG</th><th>Làm gì</th></tr></thead>
<tbody>
<tr><td>18456, <strong>8</strong></td><td>Password did not match</td><td>sai mật khẩu (hoặc đã đổi mà ứng dụng chưa cập nhật); nhiều lần liền từ một máy = đang đoán</td></tr>
<tr><td>18456, <strong>5</strong></td><td>Could not find a login matching the name</td><td>gõ sai tên, nhầm môi trường, hoặc máy quét đang thử <code>sa</code>/<code>admin</code></td></tr>
<tr><td>18456, <strong>38</strong></td><td>Failed to open the explicitly specified database</td><td>tên đăng nhập ổn; CSDL trong chuỗi kết nối sai hoặc không có, hoặc login chưa có user trong CSDL đó</td></tr>
<tr><td>18470, 1</td><td>The account is disabled</td><td>có người đã vô hiệu hoá login (người nghỉ việc?) — một mã lỗi khác, dễ sót nếu chỉ grep 18456</td></tr>
</tbody></table>
<p>Vài state khác sẽ gặp: <strong>7</strong> (bị vô hiệu hoá <em>và</em> sai mật khẩu), <strong>18</strong> (phải đổi mật khẩu), <strong>58</strong> (dùng login SQL trong khi máy chủ chỉ cho xác thực Windows). Trang MSSQLSERVER_18456 của Microsoft liệt kê đủ.</p>

<h4>B3. Đọc ERRORLOG từ T-SQL</h4>
${lenh('s12/mssql', 8)}
${lenh('s12/mssql', 9)}
<p><code>sp_readerrorlog 0, 1, N'Login failed'</code> = log hiện tại (0), log của SQL Server (1; 2 là log của Agent), lọc theo một chuỗi. Đây là cách đọc log khi bạn chỉ có kết nối SQL (instance có quản lý, máy chủ của khách qua máy nhảy). Trong SSMS, cùng dữ liệu nằm ở <strong>Management → SQL Server Logs</strong> (Log Viewer), có thể gộp cả log Windows và Agent vào một màn hình.</p>

<h3>Góc hacker: log đăng nhập hỏng nói gì với kẻ tấn công, và nói gì với bạn</h3>
<p>SQL Server và PostgreSQL đều từ chối cho <em>máy khách</em> biết tên đăng nhập có tồn tại không — một cách chống dò tên người dùng. Còn log máy chủ thì tách bạch chính xác (State 5 khác 8, <code>Role "admin" does not exist</code> ở 12.3). Điều đó làm log quý với bên phòng thủ và cũng nhạy cảm: ai đọc được nó là biết tài khoản nào có thật và tài khoản nào đang bị nhắm. Một tràng State 5 cho <code>sa</code>, <code>admin</code>, <code>backup</code> từ một địa chỉ là máy quét; một tràng State 8 cho đúng một login có thật là đoán có chủ đích, đáng một cảnh báo (Chương 15). Instance mở ra Internet thường xuyên bị dò mật khẩu qua <code>sa</code>; đổi tên hoặc vô hiệu hoá <code>sa</code> biến tiếng ồn đó thành State 5 và làm các lần thử có chủ đích nổi bật lên.</p>

<h3>Tình huống đời thật</h3>
<ul>
<li><strong>Dự án .NET outsourcing, "deploy xong ứng dụng không kết nối được":</strong> xin DBA các dòng ERRORLOG quanh giờ deploy. State 38 = chuỗi kết nối trỏ tới CSDL không có ở môi trường đó; State 8 = mật khẩu trong appsettings mới bị sai; 18470 = login đã bị vô hiệu hoá.</li>
<li><strong>Laravel/WordPress trên MySQL chạy chậm:</strong> bật slow log với <code>long_query_time = 0.5</code> trong một giờ, rồi sắp theo <code>Rows_examined</code>. Chỉ bật general log để xem ORM gửi gì, trong vài phút.</li>
<li><strong>"Log MySQL không có gì về đăng nhập hỏng":</strong> kiểm <code>log_error_verbosity</code> trước khi kết luận là không có lần nào.</li>
</ul>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
<li>Chạy <code>mysql:8.4</code>, thử sai mật khẩu, xem error log; nâng <code>log_error_verbosity</code> lên 3 rồi thử lại.</li>
<li>Bật slow log với <code>long_query_time = 0.2</code> và <code>log_queries_not_using_indexes = ON</code>; chạy một câu trên cột không có chỉ mục và một <code>SELECT SLEEP(0.3)</code>.</li>
<li>Chạy SQL Server 2022 bằng Docker (cần 2 GB RAM), tạo ra State 8, 5, 38 và một login bị vô hiệu hoá, rồi đọc chúng bằng <code>sp_readerrorlog</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn giải thích được vì sao lần đầu ở bước 1 không thấy gì; slow log có câu quét của bạn với <code>Rows_examined</code> lớn hơn hẳn <code>Rows_sent</code>; và bạn gọi đúng nguyên nhân của từng lần đăng nhập hỏng chỉ từ State.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['log_error / log_error_verbosity', 'Vị trí error log MySQL; 1 lỗi, 2 + cảnh báo, 3 + ghi chú (đăng nhập hỏng).'],
  ['slow query log', 'MySQL: slow_query_log, long_query_time, log_queries_not_using_indexes; khối có Query_time và Rows_examined.'],
  ['general query log', 'MySQL: mọi kết nối/truy vấn/thoát; chỉ bật vài phút.'],
  ['log_timestamps', 'MySQL mặc định UTC — giờ trong log khác giờ địa phương của máy chủ.'],
  ['ERRORLOG', 'Tệp log của SQL Server; mỗi lần khởi động một tệp mới; errorlog.1… là bản cũ.'],
  ['18456 + State', '8 sai mật khẩu · 5 không có login · 38 không mở được CSDL; 18470 = bị vô hiệu hoá.'],
  ['sp_readerrorlog', 'Đọc/lọc ERRORLOG từ T-SQL; Log Viewer của SSMS hiện cùng dữ liệu.'],
  ['Extended Events', 'Cơ chế dò vết của SQL Server; phiên system_health chạy sẵn (tệp .xel).'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>MySQL có ba log: error (bật), slow (tắt, 10 giây), general (tắt). Giờ theo UTC.</li>
<li>Đăng nhập MySQL hỏng cần verbosity 3 mới được ghi.</li>
<li>Rows_examined ÷ Rows_sent là tín hiệu "thiếu chỉ mục" của MySQL.</li>
<li>SQL Server: ERRORLOG (+ Application log trên Windows), sp_readerrorlog, Extended Events.</li>
<li>18456: máy khách thấy một câu, State trong ERRORLOG cho biết lý do.</li>
</ul>
${nguon('📘', 'MySQL 8.4 — The Slow Query Log', 'long_query_time, log_queries_not_using_indexes, định dạng log', 'https://dev.mysql.com/doc/refman/8.4/en/slow-query-log.html')}
${nguon('📘', 'MariaDB — Slow Query Log Overview', 'log_slow_query, log_slow_verbosity', 'https://mariadb.com/kb/en/slow-query-log-overview/')}
${nguon('📘', 'Microsoft Learn — MSSQLSERVER_18456', 'Mọi state của lỗi 18456 và ý nghĩa', 'https://learn.microsoft.com/en-us/sql/relational-databases/errors-events/mssqlserver-18456-database-engine-error')}
${nguon('📘', 'Microsoft Learn — sp_readerrorlog', 'Tham số: số thứ tự log, loại log, chuỗi tìm', 'https://learn.microsoft.com/en-us/sql/relational-databases/system-stored-procedures/sp-readerrorlog-transact-sql')}
${nguon('📘', 'Microsoft Learn — Extended Events', 'Phiên, system_health, đọc .xel', 'https://learn.microsoft.com/en-us/sql/relational-databases/extended-events/extended-events')}
${lienKet({ khoa: 'postgresql', bai: 'postgresql-17-1-bon-he-csdl', title: 'PostgreSQL 17.1 — Bốn hệ CSDL', sub: 'MySQL, SQL Server, MongoDB khác PostgreSQL ở đâu', cta: 'Mở bài' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-15-4-windows-ve-trung-tam', title: 'Bài 15.4 — Log Windows về trung tâm', sub: 'Gửi Application log (và 18456) về SIEM', cta: 'Mở bài' })}
</div>
`,
};
