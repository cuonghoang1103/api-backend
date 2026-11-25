/**
 * 12.2 — Truy vấn chậm (soạn 24/11/2026, agent lgz).
 * Output thật: OUT['s12/cham'] — tiếp nối máy chủ lgz-pg12 của 12.1; bảng orders 2 triệu dòng (_demo/s12/du-lieu-orders.sql, 327 MB,
 * không có chỉ mục trên customer_email); pgbench 17.12; pgBadger 13.3. Ngưỡng lab 50 ms vì bảng nhỏ (production: vài trăm ms).
 * Chạy lại ⇒ ms/tps đổi: soát số trong lời ("72.117 / 77.067 / 87.906 ms", "666653", "600 lần, 15.796 ms, 0 dòng, 9016 ms",
 * "64960 → 40874 tps, 9 + 9 MiB", "239ms - 3", "877K").
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '12.2 — Slow queries: log_min_duration_statement, auto_explain, pg_stat_statements, pgBadger|||12.2 — Truy vấn chậm: log_min_duration_statement, auto_explain, pg_stat_statements, pgBadger',
  slug: 'log-12-2-slow-query',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bắt câu SQL chậm bằng log: đặt ngưỡng log_min_duration_statement, đọc dòng duration (cả dạng execute + Parameters), bật auto_explain để log ghi luôn kế hoạch Seq Scan, so log với pg_stat_statements ("nghìn vết cắt nhỏ" mà log không thấy), đo thật cái giá của ngưỡng 0 (tps giảm 37%, 18 MiB log trong 10 giây), và gom báo cáo bằng pgBadger.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.2</span>
<h2>Slow queries: let the database tell you which SQL is slow, and why</h2>
<p class="lead">In Chapter 10 you found the slow <em>endpoint</em> from the access log. This lesson goes one floor down: which <strong>SQL statement</strong> inside that endpoint is slow, with which parameters, and what plan PostgreSQL used. Four tools, each answering a different question: the slow-query log (each slow execution), auto_explain (the plan of that execution), pg_stat_statements (the total over all executions) and pgBadger (a report you can send to the team).</p>

<h3>The everyday picture: the speed camera and the toll statistics</h3>
<p>A speed camera photographs every car above 80 km/h: plate, time, speed — one photo per offence (<code>log_min_duration_statement</code>). The photo can include the driver's face and the road condition (<code>auto_explain</code>: the plan). But the camera never notices ten thousand cars at 70 km/h that together jam the highway — for that you need the toll station's daily totals (<code>pg_stat_statements</code>). And the monthly report to the city council is a summary of all photos (<code>pgBadger</code>).</p>

<h3>The setup</h3>
<p>Same server as 12.1, now with a table <code>orders</code> of 2 million rows (327 MB) and — the classic bug — <strong>no index</strong> on <code>customer_email</code>:</p>
${ma('sql', 's12/du-lieu-orders.sql')}
${lenh('s12/cham', 0)}

<h3>Step 1 — the threshold: log every statement slower than X</h3>
${lenh('s12/cham', 1)}
${lenh('s12/cham', 2)}
${lenh('s12/cham', 3)}
<p>Exactly one line: the lookup by e-mail took 72 ms and crossed the 50 ms threshold; the lookup by primary key (0.38 ms) did not. The line has everything you need to find the culprit: time, PID, <code>app@shop</code>, <code>app=shop-api</code>, client, <code>duration</code> and the full SQL. Note <code>log_min_duration_statement</code> is applied with a reload — no restart.</p>
<div class="pitfall co-tieu-de"><p><strong>Why 50 ms here?</strong> This lab table is small and sits in RAM, so the bad query "only" takes ~70–90 ms. On production tables the same mistake costs seconds. Typical thresholds: 200–500 ms for a web API, 1–5 s for a reporting database. Pick a value such that the log gets a few hundred lines per day, not millions.</p></div>

<h3>Step 2 — real apps use parameters: "execute" lines and the Parameters DETAIL</h3>
<p>Your ORM never sends <code>WHERE customer_email = 'khach4242@…'</code>. It sends <code>WHERE customer_email = $1</code> and the value separately (extended protocol). psql 16+ can do the same with <code>\\bind</code>:</p>
${lenh('s12/cham', 4)}
${lenh('s12/cham', 5)}
<ul>
<li>The line now says <code>execute &lt;unnamed&gt;:</code> (an unnamed prepared statement), the SQL keeps <code>$1</code>, and the value is on the next line: <code>DETAIL: Parameters: $1 = 'khach777@example.com'</code>.</li>
<li>That is what you will see for queries from Prisma, node-postgres, JDBC/Hibernate. Grep for the SQL text, then read the next line for the values — you need them to reproduce the slowness (lesson 12.5).</li>
<li>The values are <strong>customer data</strong>. <code>log_parameter_max_length</code> (default −1 = all) and <code>log_parameter_max_length_on_error</code> limit or turn this off (0). Decide it as a team (lesson 12.3, 16.3).</li>
</ul>

<h3>Step 3 — auto_explain: the plan goes into the log</h3>
<p>The duration tells you <em>that</em> a query is slow. The plan tells you <em>why</em>. <code>auto_explain</code> runs EXPLAIN on every statement slower than its own threshold and writes the plan into the log. It must be loaded at server start, together with pg_stat_statements:</p>
${lenh('s12/cham', 6)}
${lenh('s12/cham', 7)}
<div class="pitfall co-tieu-de"><p><strong>A real trap from preparing this lab:</strong> the first attempt was <code>ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements,auto_explain'</code> (one quoted string). ALTER SYSTEM accepted it, and on restart PostgreSQL <strong>refused to start</strong>: <code>FATAL: could not access file "pg_stat_statements,auto_explain": No such file or directory</code> — it looked for one library with a comma in its name. Write the list unquoted (<code>= pg_stat_statements, auto_explain</code>) or as separate quoted items, and run <code>SHOW shared_preload_libraries</code> after the restart. On a real server, test this kind of change on staging first: a typo here is downtime.</p></div>
${lenh('s12/cham', 8)}
${lenh('s12/cham', 9)}
<p>How to read this plan from the bottom up (the full method is in the PostgreSQL course, lesson 10.1):</p>
<ol>
<li><code>Parallel Seq Scan on orders</code> — read the <strong>whole</strong> table, split across 3 processes (leader + 2 workers, <code>loops=3</code>).</li>
<li><code>Filter: (customer_email = …)</code> + <code>Rows Removed by Filter: 666653</code> per process — about 2 million rows read and thrown away to keep 40. That ratio is the smoking gun for a missing index.</li>
<li><code>Buffers: shared hit=74 read=36364</code> — 36 364 pages of 8 kB ≈ 284 MB read for 3 rows of output.</li>
<li><code>Sort … top-N heapsort</code> then <code>Limit</code> — cheap; the cost is entirely the scan.</li>
</ol>
<p>Settings used: <code>log_analyze = on</code> (real row counts, not estimates), <code>log_buffers = on</code>, and <code>log_timing = off</code> — per-node timing is the expensive part of ANALYZE, and the row counts are enough to diagnose. With <code>log_analyze</code> on, every statement pays some instrumentation overhead; on a busy production server keep <code>auto_explain.log_min_duration</code> high and consider <code>auto_explain.sample_rate</code>.</p>

<h3>Step 4 — what the log cannot see: a thousand small cuts</h3>
<p>A "revenue report" job runs a range query 600 times, each about 15 ms — under the threshold:</p>
${ma('sql', 's12/nghin-vet-cat.sql')}
${lenh('s12/cham', 10)}
${lenh('s12/cham', 11)}
${lenh('s12/cham', 12)}
<p>The log has <strong>0</strong> lines for <code>bao-cao-doanh-thu</code>. pg_stat_statements says this query cost <strong>9 016 ms</strong> of database time — about a hundred times more than the "slow" e-mail lookup (88 ms, 1 call). If you only tune what the slow log shows, you fix the loud problem and miss the big one. Use both:</p>
<table>
<thead><tr><th></th><th>Slow-query log + auto_explain</th><th>pg_stat_statements</th></tr></thead>
<tbody>
<tr><td>Unit</td><td>one execution</td><td>one normalised query (constants → <code>$1</code>), summed</td></tr>
<tr><td>Answers</td><td>"which request at 14:03 was slow, with which values, which plan"</td><td>"which query costs the most time in total, since the last reset"</td></tr>
<tr><td>Sees fast-but-frequent queries</td><td>no</td><td>yes</td></tr>
<tr><td>Has time of day, client, parameters</td><td>yes</td><td>no (only counters)</td></tr>
<tr><td>Cost</td><td>disk, grows with traffic</td><td>small fixed memory</td></tr>
</tbody></table>
<p>To join them: <code>compute_query_id</code> (on automatically when pg_stat_statements is loaded) gives every statement a <code>query_id</code>; put <code>%Q</code> in <code>log_line_prefix</code> and the same id appears in the log line and in <code>pg_stat_statements.queryid</code>.</p>

<h3>Step 5 — the price of logging everything (threshold 0), measured</h3>
<p>"Just set it to 0 so we see everything" is a suggestion you will hear. Measured on this machine with pgbench (4 clients, read-only, 10 seconds):</p>
${lenh('s12/cham', 13)}
${lenh('s12/cham', 14)}
${lenh('s12/cham', 15)}
${lenh('s12/cham', 16)}
<ul>
<li>Throughput fell from <strong>64 960 to 40 874</strong> transactions per second (−37%). Every statement now formats a line, takes a lock on the log pipe and writes twice (text + JSON).</li>
<li>The log grew <strong>9 MiB + 9 MiB in 10 seconds</strong>. At that rate that is about 150 GB per day — for lines that say "0.023 ms".</li>
</ul>
<p>If you need a picture of all traffic, PostgreSQL has sampling: <code>log_min_duration_sample</code> + <code>log_statement_sample_rate</code> (log, say, 1% of statements above a lower threshold), and <code>log_transaction_sample_rate</code> (log every statement of 1% of transactions). Turn the full log on only briefly, and turn it off again — the same rule as MySQL's general log in 12.4.</p>

<h3>Step 6 — pgBadger: one report from the whole log</h3>
${lenh('s12/cham', 18)}
${lenh('s12/cham', 19)}
${lenh('s12/cham', 20)}
<ul>
<li><code>-f jsonlog</code> reads the JSON log directly; for text logs pass your prefix with <code>--prefix '%m [%p] %q%u@%d app=%a client=%h '</code> so pgBadger can split the fields.</li>
<li><code>-d shop -u app</code> keeps only the application's traffic — without it, the top of "slowest" was our own <code>ALTER SYSTEM</code> commands.</li>
<li>"Queries that took up the most time" <strong>normalises</strong> the SQL (<code>customer_email = ?</code>) and adds up executions: 3 executions, 239 ms in total, with examples you can click in the HTML report (877 kB, one self-contained file: charts per hour, connections per host/app, lock waits, errors).</li>
<li>Note rank 2: pgBadger counted the auto_explain plan entry as a separate "query". Read totals with that in mind (or exclude with <code>--exclude-query '^Query Text'</code>).</li>
</ul>
<p>In practice: run pgBadger daily or weekly on the log of the previous period (it reads <code>.gz</code> too, and has an incremental mode with <code>-I</code>), send the HTML to the team, and keep the top 10 "most time" queries as a backlog.</p>

<h3>From the slow endpoint (Chapter 10) to the SQL line</h3>
<p>The missing link between the app log and the DB log is an identifier present in both. Three options, from simplest:</p>
<ol>
<li><strong>application_name per service</strong> (<code>app=shop-api</code>) — tells you which service, not which request.</li>
<li><strong>Time + PID</strong> — line up the app's slow request time with DB lines of that second; fragile when traffic is high.</li>
<li><strong>A comment in the SQL</strong> carrying the request id / trace id: <code>/* rid=725b2f74,route=/api/orders */ SELECT …</code>. The comment is logged with the statement, ignored by the planner, and ignored by pg_stat_statements when grouping. This is the idea of Google's <em>sqlcommenter</em> (W3C <code>traceparent</code> in a comment); Lab 12 does it by hand in 3 lines of code.</li>
</ol>

<h3>Hacker's corner: the slow log as a free data export</h3>
<p>Step 2 showed that the parameters of slow queries — e-mails, phone numbers, sometimes tokens in a <code>WHERE token = $1</code> — land in the log. Turning the threshold down "to debug" on production and forgetting it means months of customer data copied into log files and into whatever collects them. And a slow-query log sent to a log SaaS is a data transfer that your privacy policy probably does not mention. Before lowering the threshold, decide <code>log_parameter_max_length</code>; after debugging, set it back and write the change in the ticket.</p>

<h3>Real-life situations</h3>
<ul>
<li><strong>OJT, "the order list page is slow since yesterday":</strong> grep the DB log for <code>duration:</code> with <code>app=</code> of that service in the time window, take the slowest line with its <code>Parameters</code>, run <code>EXPLAIN (ANALYZE, BUFFERS)</code> with those values on staging. Attach the plan to the ticket.</li>
<li><strong>Outsourcing, the customer forbids touching production config:</strong> ask for <code>pg_stat_statements</code> output (a single SELECT, read-only) — often already installed on RDS/Cloud SQL. It does not need a restart to read, and contains no parameters.</li>
<li><strong>"Can you just log all queries for a day?"</strong> Answer with numbers: on our lab −37% throughput and ~150 GB/day. Propose sampling or pg_stat_statements instead.</li>
</ul>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok"><ol>
<li>Create the <code>orders</code> table from the setup above. Set <code>log_min_duration_statement = '50ms'</code>, reload, run the e-mail lookup and the primary-key lookup.</li>
<li>Run the same lookup through <code>\\bind</code> and find the <code>Parameters</code> line.</li>
<li>Load auto_explain + pg_stat_statements (unquoted list!), restart, check with <code>SHOW</code>, and get the plan into the log.</li>
<li>Run the 600-execution pgbench job and compare the log with pg_stat_statements.</li>
</ol>
<p><strong>Done when:</strong> the log has a <code>duration</code> line only for the e-mail lookup; the <code>execute &lt;unnamed&gt;</code> line is followed by <code>Parameters: $1 = …</code>; the plan shows <code>Seq Scan</code> and <code>Rows Removed by Filter</code> in the hundreds of thousands; and pg_stat_statements ranks the range query above the e-mail lookup by <code>total_exec_time</code> although the log shows nothing for it.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['log_min_duration_statement', 'Log every completed statement slower than this (ms); -1 off, 0 everything. Reload only.'],
  ['execute <unnamed> + Parameters', 'How a parameterised (ORM/driver) statement appears; values are in the DETAIL line.'],
  ['auto_explain', 'Preloaded module that logs the plan of slow statements (log_analyze, log_buffers, log_timing).'],
  ['shared_preload_libraries', 'Libraries loaded at server start; a list, not one quoted string; restart required.'],
  ['pg_stat_statements', 'Per-normalised-query counters: calls, total/mean/max time; sees frequent fast queries.'],
  ['sampling', 'log_min_duration_sample + log_statement_sample_rate, log_transaction_sample_rate.'],
  ['pgBadger', 'Perl tool that turns PostgreSQL logs into an HTML/text report; normalises queries.'],
  ['sqlcommenter', 'Putting request/trace ids in a SQL comment so DB lines link back to requests.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Slow log = one line per slow execution, with app, client, SQL and parameters.</li>
<li>auto_explain adds the plan; <code>Rows Removed by Filter</code> huge ⇒ missing index.</li>
<li>pg_stat_statements finds the "thousand small cuts" the log never shows.</li>
<li>Threshold 0 is measurably expensive (−37% tps, ~150 GB/day here): sample instead.</li>
<li>pgBadger turns the log into a report; filter to your app's db/user.</li>
<li>Link app ↔ DB with application_name and a request id in a SQL comment.</li>
</ul>
${nguon('📘', 'PostgreSQL 17 — auto_explain', 'log_min_duration, log_analyze, log_buffers, log_timing, sample_rate', 'https://www.postgresql.org/docs/17/auto-explain.html')}
${nguon('📘', 'PostgreSQL 17 — pg_stat_statements', 'Normalisation, queryid, compute_query_id, columns', 'https://www.postgresql.org/docs/17/pgstatstatements.html')}
${nguon('🧰', 'pgBadger (GitHub)', 'Log formats, --prefix, incremental mode, report sections', 'https://github.com/darold/pgbadger')}
${nguon('🧰', 'sqlcommenter', 'Request/trace context in SQL comments', 'https://google.github.io/sqlcommenter/')}
${lienKet({ khoa: 'postgresql', bai: 'postgresql-10-1-doc-explain', title: 'PostgreSQL 10.1 — Reading EXPLAIN', sub: 'Nodes, rows, loops — read a plan from the bottom up', cta: 'Open lesson' })}
${lienKet({ khoa: 'postgresql', bai: 'postgresql-10-4-buffers-tinh-chinh', title: 'PostgreSQL 10.4 — BUFFERS and tuning', sub: 'auto_explain and a real Prisma query fixed by one index', cta: 'Open lesson' })}
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-3-4-trace-context', title: 'Observability 3.4 — Trace context', sub: 'traceparent across services — the same idea as the SQL comment', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.2</span>
<h2>Truy vấn chậm: để CSDL tự nói câu SQL nào chậm, và vì sao</h2>
<p class="lead">Ở Chương 10 bạn tìm ra <em>endpoint</em> chậm từ access log. Bài này xuống thêm một tầng: <strong>câu SQL</strong> nào trong endpoint đó chậm, với tham số nào, và PostgreSQL đã dùng kế hoạch gì. Bốn công cụ, mỗi cái trả lời một câu hỏi khác nhau: log truy vấn chậm (từng lần chạy chậm), auto_explain (kế hoạch của lần chạy ấy), pg_stat_statements (tổng trên mọi lần chạy) và pgBadger (báo cáo gửi được cho cả đội).</p>

<h3>Liên tưởng đời thường: camera bắn tốc độ và thống kê trạm thu phí</h3>
<p>Camera bắn tốc độ chụp mọi xe chạy trên 80 km/h: biển số, giờ, tốc độ — mỗi lỗi một tấm ảnh (<code>log_min_duration_statement</code>). Ảnh có thể kèm mặt tài xế và tình trạng đường (<code>auto_explain</code>: kế hoạch). Nhưng camera không bao giờ để ý mười nghìn xe chạy 70 km/h cùng nhau làm tắc cao tốc — muốn thấy cái đó cần số tổng mỗi ngày của trạm thu phí (<code>pg_stat_statements</code>). Còn báo cáo tháng gửi thành phố là bản tổng hợp mọi tấm ảnh (<code>pgBadger</code>).</p>

<h3>Chuẩn bị</h3>
<p>Cùng máy chủ với 12.1, giờ có bảng <code>orders</code> 2 triệu dòng (327 MB) và — lỗi kinh điển — <strong>không có chỉ mục</strong> trên <code>customer_email</code>:</p>
${ma('sql', 's12/du-lieu-orders.sql')}
${lenh('s12/cham', 0)}

<h3>Bước 1 — ngưỡng: ghi mọi câu chậm hơn X</h3>
${lenh('s12/cham', 1)}
${lenh('s12/cham', 2)}
${lenh('s12/cham', 3)}
<p>Đúng một dòng: câu tra theo email mất 72 ms, vượt ngưỡng 50 ms; câu tra theo khoá chính (0,38 ms) thì không. Dòng đó có đủ thứ để tìm thủ phạm: giờ, PID, <code>app@shop</code>, <code>app=shop-api</code>, máy khách, <code>duration</code> và nguyên câu SQL. Để ý <code>log_min_duration_statement</code> áp dụng bằng reload — không cần khởi động lại.</p>
<div class="pitfall co-tieu-de"><p><strong>Sao ở đây lại là 50 ms?</strong> Bảng lab này nhỏ và nằm gọn trong RAM, nên câu tệ "chỉ" mất khoảng 70–90 ms. Trên bảng production, cùng lỗi ấy tốn vài giây. Ngưỡng hay dùng: 200–500 ms cho API web, 1–5 giây cho CSDL báo cáo. Chọn giá trị sao cho log có vài trăm dòng mỗi ngày, không phải hàng triệu.</p></div>

<h3>Bước 2 — ứng dụng thật dùng tham số: dòng "execute" và DETAIL Parameters</h3>
<p>ORM của bạn không bao giờ gửi <code>WHERE customer_email = 'khach4242@…'</code>. Nó gửi <code>WHERE customer_email = $1</code> và giá trị đi riêng (extended protocol). psql 16 trở lên làm được y hệt bằng <code>\\bind</code>:</p>
${lenh('s12/cham', 4)}
${lenh('s12/cham', 5)}
<ul>
<li>Dòng log giờ ghi <code>execute &lt;unnamed&gt;:</code> (một prepared statement không tên), câu SQL giữ nguyên <code>$1</code>, còn giá trị nằm ở dòng kế: <code>DETAIL: Parameters: $1 = 'khach777@example.com'</code>.</li>
<li>Đó là thứ bạn sẽ thấy với truy vấn từ Prisma, node-postgres, JDBC/Hibernate. Grep theo chữ SQL, rồi đọc dòng kế để lấy giá trị — cần chúng để tái hiện độ chậm (bài 12.5).</li>
<li>Các giá trị ấy là <strong>dữ liệu khách hàng</strong>. <code>log_parameter_max_length</code> (mặc định −1 = ghi hết) và <code>log_parameter_max_length_on_error</code> giới hạn hoặc tắt hẳn (0). Hãy quyết cùng cả đội (bài 12.3, 16.3).</li>
</ul>

<h3>Bước 3 — auto_explain: kế hoạch đi vào log</h3>
<p>Thời gian chạy cho biết <em>có</em> chậm. Kế hoạch cho biết <em>vì sao</em>. <code>auto_explain</code> chạy EXPLAIN cho mọi câu chậm hơn ngưỡng của nó và ghi kế hoạch vào log. Nó phải được nạp lúc máy chủ khởi động, cùng với pg_stat_statements:</p>
${lenh('s12/cham', 6)}
${lenh('s12/cham', 7)}
<div class="pitfall co-tieu-de"><p><strong>Một cái bẫy có thật lúc dựng lab này:</strong> lần đầu tôi viết <code>ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements,auto_explain'</code> (một chuỗi trong một cặp nháy). ALTER SYSTEM nhận, và lúc khởi động lại PostgreSQL <strong>không chịu chạy</strong>: <code>FATAL: could not access file "pg_stat_statements,auto_explain": No such file or directory</code> — nó tìm một thư viện có dấu phẩy trong tên. Hãy viết danh sách không nháy (<code>= pg_stat_statements, auto_explain</code>) hoặc mỗi mục một cặp nháy, và chạy <code>SHOW shared_preload_libraries</code> sau khi khởi động lại. Trên máy chủ thật, thử loại thay đổi này ở staging trước: gõ sai ở đây là ngừng dịch vụ.</p></div>
${lenh('s12/cham', 8)}
${lenh('s12/cham', 9)}
<p>Đọc kế hoạch này từ dưới lên (cách đọc đầy đủ ở khoá PostgreSQL, bài 10.1):</p>
<ol>
<li><code>Parallel Seq Scan on orders</code> — đọc <strong>cả</strong> bảng, chia cho 3 tiến trình (leader + 2 worker, <code>loops=3</code>).</li>
<li><code>Filter: (customer_email = …)</code> + <code>Rows Removed by Filter: 666653</code> mỗi tiến trình — khoảng 2 triệu dòng bị đọc rồi vứt để giữ 40. Tỉ lệ đó là bằng chứng rõ nhất của việc thiếu chỉ mục.</li>
<li><code>Buffers: shared hit=74 read=36364</code> — 36 364 trang 8 kB ≈ 284 MB đọc ra để trả 3 dòng.</li>
<li><code>Sort … top-N heapsort</code> rồi <code>Limit</code> — rẻ; toàn bộ chi phí nằm ở lượt quét.</li>
</ol>
<p>Thiết lập đã dùng: <code>log_analyze = on</code> (số dòng thật, không phải ước lượng), <code>log_buffers = on</code>, và <code>log_timing = off</code> — đo giờ từng nút là phần đắt của ANALYZE, mà số dòng đã đủ để chẩn đoán. Khi bật <code>log_analyze</code>, mọi câu lệnh đều trả một ít chi phí đo đạc; trên máy chủ production bận rộn, hãy để <code>auto_explain.log_min_duration</code> cao và cân nhắc <code>auto_explain.sample_rate</code>.</p>

<h3>Bước 4 — thứ log không thấy: nghìn vết cắt nhỏ</h3>
<p>Một job "báo cáo doanh thu" chạy truy vấn theo khoảng 600 lần, mỗi lần khoảng 15 ms — dưới ngưỡng:</p>
${ma('sql', 's12/nghin-vet-cat.sql')}
${lenh('s12/cham', 10)}
${lenh('s12/cham', 11)}
${lenh('s12/cham', 12)}
<p>Log có <strong>0</strong> dòng cho <code>bao-cao-doanh-thu</code>. pg_stat_statements nói câu này tốn <strong>9 016 ms</strong> thời gian CSDL — gấp khoảng một trăm lần câu tra email "chậm" (88 ms, 1 lần). Nếu chỉ tối ưu thứ log truy vấn chậm cho thấy, bạn sửa được cái ồn ào mà bỏ sót cái lớn. Dùng cả hai:</p>
<table>
<thead><tr><th></th><th>Log truy vấn chậm + auto_explain</th><th>pg_stat_statements</th></tr></thead>
<tbody>
<tr><td>Đơn vị</td><td>một lần chạy</td><td>một câu đã chuẩn hoá (hằng số → <code>$1</code>), cộng dồn</td></tr>
<tr><td>Trả lời</td><td>"request lúc 14:03 nào chậm, giá trị gì, kế hoạch gì"</td><td>"câu nào tốn nhiều thời gian nhất tính tổng, từ lần reset trước"</td></tr>
<tr><td>Thấy câu nhanh nhưng chạy nhiều</td><td>không</td><td>có</td></tr>
<tr><td>Có giờ, máy khách, tham số</td><td>có</td><td>không (chỉ bộ đếm)</td></tr>
<tr><td>Chi phí</td><td>đĩa, tăng theo lưu lượng</td><td>bộ nhớ nhỏ, cố định</td></tr>
</tbody></table>
<p>Để nối hai bên: <code>compute_query_id</code> (tự bật khi nạp pg_stat_statements) gán cho mỗi câu một <code>query_id</code>; thêm <code>%Q</code> vào <code>log_line_prefix</code> là cùng mã ấy xuất hiện ở dòng log và ở <code>pg_stat_statements.queryid</code>.</p>

<h3>Bước 5 — cái giá của việc ghi tất cả (ngưỡng 0), đo thật</h3>
<p>"Cứ đặt 0 cho thấy hết" là đề nghị bạn sẽ nghe. Đo trên máy này bằng pgbench (4 máy khách, chỉ đọc, 10 giây):</p>
${lenh('s12/cham', 13)}
${lenh('s12/cham', 14)}
${lenh('s12/cham', 15)}
${lenh('s12/cham', 16)}
<ul>
<li>Thông lượng giảm từ <strong>64 960 xuống 40 874</strong> giao dịch mỗi giây (−37%). Giờ câu nào cũng phải định dạng một dòng, giành khoá ống log và ghi hai lần (chữ + JSON).</li>
<li>Log tăng <strong>9 MiB + 9 MiB trong 10 giây</strong>. Cứ đà ấy là khoảng 150 GB mỗi ngày — cho những dòng ghi "0.023 ms".</li>
</ul>
<p>Nếu cần bức tranh về toàn bộ lưu lượng, PostgreSQL có lấy mẫu: <code>log_min_duration_sample</code> + <code>log_statement_sample_rate</code> (ghi, chẳng hạn, 1% số câu vượt một ngưỡng thấp hơn), và <code>log_transaction_sample_rate</code> (ghi mọi câu của 1% số giao dịch). Chỉ bật log đầy đủ trong thời gian ngắn, rồi tắt lại — cùng luật với general log của MySQL ở 12.4.</p>

<h3>Bước 6 — pgBadger: một báo cáo từ cả tệp log</h3>
${lenh('s12/cham', 18)}
${lenh('s12/cham', 19)}
${lenh('s12/cham', 20)}
<ul>
<li><code>-f jsonlog</code> đọc thẳng log JSON; với log chữ, truyền tiền tố của bạn bằng <code>--prefix '%m [%p] %q%u@%d app=%a client=%h '</code> để pgBadger tách được trường.</li>
<li><code>-d shop -u app</code> chỉ giữ lưu lượng của ứng dụng — thiếu nó, đầu bảng "chậm nhất" toàn là lệnh <code>ALTER SYSTEM</code> của chính ta.</li>
<li>"Queries that took up the most time" <strong>chuẩn hoá</strong> câu SQL (<code>customer_email = ?</code>) và cộng dồn các lần chạy: 3 lần, tổng 239 ms, kèm ví dụ bấm được trong báo cáo HTML (877 kB, một tệp tự chứa: biểu đồ theo giờ, kết nối theo máy/ứng dụng, chờ khoá, lỗi).</li>
<li>Để ý hạng 2: pgBadger đếm mục kế hoạch của auto_explain như một "câu" riêng. Đọc số tổng có tính tới điều đó (hoặc loại bằng <code>--exclude-query '^Query Text'</code>).</li>
</ul>
<p>Thực tế: chạy pgBadger hằng ngày hoặc hằng tuần trên log của kỳ trước (nó đọc được cả <code>.gz</code>, có chế độ cộng dồn <code>-I</code>), gửi HTML cho đội, giữ top 10 câu "tốn thời gian nhất" làm backlog.</p>

<h3>Từ endpoint chậm (Chương 10) xuống dòng SQL</h3>
<p>Mắt xích còn thiếu giữa log ứng dụng và log CSDL là một mã có mặt ở cả hai. Ba cách, từ đơn giản nhất:</p>
<ol>
<li><strong>application_name cho mỗi dịch vụ</strong> (<code>app=shop-api</code>) — biết dịch vụ nào, không biết request nào.</li>
<li><strong>Giờ + PID</strong> — xếp giờ của request chậm cạnh các dòng CSDL cùng giây; dễ gãy khi lưu lượng cao.</li>
<li><strong>Một chú thích trong câu SQL</strong> mang request id / trace id: <code>/* rid=725b2f74,route=/api/orders */ SELECT …</code>. Chú thích được ghi cùng câu lệnh, bộ lập kế hoạch bỏ qua, và pg_stat_statements cũng bỏ qua khi gom nhóm. Đó là ý tưởng <em>sqlcommenter</em> của Google (W3C <code>traceparent</code> trong chú thích); Lab 12 làm tay bằng 3 dòng mã.</li>
</ol>

<h3>Góc hacker: log truy vấn chậm là một bản xuất dữ liệu miễn phí</h3>
<p>Bước 2 cho thấy tham số của các câu chậm — email, số điện thoại, có khi cả token trong <code>WHERE token = $1</code> — rơi vào log. Hạ ngưỡng trên production "để debug" rồi quên nghĩa là hàng tháng trời dữ liệu khách hàng bị chép vào tệp log và vào mọi thứ gom log ấy. Còn log truy vấn chậm gửi lên một dịch vụ log SaaS là một lần chuyển dữ liệu mà chính sách quyền riêng tư của bạn có lẽ không nhắc tới. Trước khi hạ ngưỡng, quyết <code>log_parameter_max_length</code>; debug xong, đặt lại và ghi thay đổi vào ticket.</p>

<h3>Tình huống đời thật</h3>
<ul>
<li><strong>OJT, "trang danh sách đơn chậm từ hôm qua":</strong> grep log CSDL tìm <code>duration:</code> với <code>app=</code> của dịch vụ đó trong khung giờ, lấy dòng chậm nhất kèm <code>Parameters</code>, chạy <code>EXPLAIN (ANALYZE, BUFFERS)</code> với đúng giá trị đó trên staging. Đính kèm kế hoạch vào ticket.</li>
<li><strong>Outsourcing, khách cấm đụng cấu hình production:</strong> xin output của <code>pg_stat_statements</code> (một câu SELECT, chỉ đọc) — trên RDS/Cloud SQL thường đã cài sẵn. Đọc nó không cần khởi động lại, và không chứa tham số.</li>
<li><strong>"Bật log mọi truy vấn một ngày được không?"</strong> Trả lời bằng số: trên lab của ta −37% thông lượng và ~150 GB/ngày. Đề xuất lấy mẫu hoặc pg_stat_statements thay thế.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Tạo bảng <code>orders</code> như phần chuẩn bị. Đặt <code>log_min_duration_statement = '50ms'</code>, reload, chạy câu tra email và câu tra khoá chính.</li>
<li>Chạy cùng câu tra qua <code>\\bind</code> và tìm dòng <code>Parameters</code>.</li>
<li>Nạp auto_explain + pg_stat_statements (danh sách không nháy!), khởi động lại, kiểm bằng <code>SHOW</code>, và lấy được kế hoạch vào log.</li>
<li>Chạy job pgbench 600 lần và so log với pg_stat_statements.</li>
</ol>
<p><strong>Đạt khi:</strong> log chỉ có dòng <code>duration</code> cho câu tra email; dòng <code>execute &lt;unnamed&gt;</code> có dòng <code>Parameters: $1 = …</code> theo sau; kế hoạch có <code>Seq Scan</code> và <code>Rows Removed by Filter</code> cỡ hàng trăm nghìn; và pg_stat_statements xếp câu theo khoảng lên trên câu tra email theo <code>total_exec_time</code> dù log không có dòng nào cho nó.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['log_min_duration_statement', 'Ghi mọi câu đã chạy xong chậm hơn ngưỡng (ms); -1 tắt, 0 ghi hết. Chỉ cần reload.'],
  ['execute <unnamed> + Parameters', 'Cách một câu có tham số (ORM/driver) hiện trong log; giá trị nằm ở dòng DETAIL.'],
  ['auto_explain', 'Module nạp sẵn, ghi kế hoạch của câu chậm (log_analyze, log_buffers, log_timing).'],
  ['shared_preload_libraries', 'Thư viện nạp lúc khởi động; là danh sách, không phải một chuỗi trong nháy; phải khởi động lại.'],
  ['pg_stat_statements', 'Bộ đếm theo từng câu đã chuẩn hoá: số lần, tổng/trung bình/lớn nhất; thấy câu nhanh nhưng chạy nhiều.'],
  ['lấy mẫu (sampling)', 'log_min_duration_sample + log_statement_sample_rate, log_transaction_sample_rate.'],
  ['pgBadger', 'Công cụ Perl biến log PostgreSQL thành báo cáo HTML/chữ; chuẩn hoá câu truy vấn.'],
  ['sqlcommenter', 'Đặt request id/trace id trong chú thích SQL để dòng log CSDL nối ngược về request.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Log chậm = một dòng cho mỗi lần chạy chậm, kèm ứng dụng, máy khách, SQL và tham số.</li>
<li>auto_explain thêm kế hoạch; <code>Rows Removed by Filter</code> khổng lồ ⇒ thiếu chỉ mục.</li>
<li>pg_stat_statements tìm ra "nghìn vết cắt nhỏ" mà log không bao giờ thấy.</li>
<li>Ngưỡng 0 đắt đo được (−37% tps, ~150 GB/ngày ở đây): hãy lấy mẫu.</li>
<li>pgBadger biến log thành báo cáo; lọc theo db/user của ứng dụng.</li>
<li>Nối ứng dụng ↔ CSDL bằng application_name và request id trong chú thích SQL.</li>
</ul>
${nguon('📘', 'PostgreSQL 17 — auto_explain', 'log_min_duration, log_analyze, log_buffers, log_timing, sample_rate', 'https://www.postgresql.org/docs/17/auto-explain.html')}
${nguon('📘', 'PostgreSQL 17 — pg_stat_statements', 'Chuẩn hoá, queryid, compute_query_id, các cột', 'https://www.postgresql.org/docs/17/pgstatstatements.html')}
${nguon('🧰', 'pgBadger (GitHub)', 'Định dạng log, --prefix, chế độ cộng dồn, các mục báo cáo', 'https://github.com/darold/pgbadger')}
${nguon('🧰', 'sqlcommenter', 'Ngữ cảnh request/trace trong chú thích SQL', 'https://google.github.io/sqlcommenter/')}
${lienKet({ khoa: 'postgresql', bai: 'postgresql-10-1-doc-explain', title: 'PostgreSQL 10.1 — Đọc EXPLAIN', sub: 'Nút, rows, loops — đọc kế hoạch từ dưới lên', cta: 'Mở bài' })}
${lienKet({ khoa: 'postgresql', bai: 'postgresql-10-4-buffers-tinh-chinh', title: 'PostgreSQL 10.4 — BUFFERS và tinh chỉnh', sub: 'auto_explain và một truy vấn Prisma thật sửa bằng một chỉ mục', cta: 'Mở bài' })}
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-3-4-trace-context', title: 'Observability 3.4 — Trace context', sub: 'traceparent qua các dịch vụ — cùng ý tưởng với chú thích SQL', cta: 'Mở bài' })}
</div>
`,
};
