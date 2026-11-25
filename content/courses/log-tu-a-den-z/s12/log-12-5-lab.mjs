/**
 * 12.5 — Lab 12: tìm câu truy vấn làm ứng dụng chậm (soạn 24/11/2026, agent lgz).
 * Lab: ./_demo/s12/lab12 (compose.yaml: db = lgz-pg12:1 network_mode none, api = node:22-alpine network_mode service:db; app/server.mjs + tai.mjs,
 * pg 8.16.3; sql/01-shop.sql tạo orders 2 triệu dòng thiếu chỉ mục). Không tạo mạng docker.
 * Đáp án chạy thật: CODE['s12/lab12.bash'] + OUT['s12/lab12']. Chạy lại ⇒ rid/ms đổi: soát số trong lời
 * ("405/585 ms → 1,3/3,5 ms", "725b2f74, 701 ms", "200 + 3", "83 482 ms, 417,4 ms", "Rows Removed 999980", "5855 ms, PID 482", "0,07 ms").
 */
import { ma, ra, lenh, kv } from '../_chung.mjs';

export default {
  title: 'Lab 12 — Find the query that made the app slow, using PostgreSQL logs and pgBadger|||Lab 12 — Tìm câu truy vấn làm app chậm bằng log PostgreSQL và pgBadger',
  slug: 'log-12-5-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Một API Node + PostgreSQL chạy chậm giờ cao điểm. Đi từ log ứng dụng (p50/p95 theo route) → request id chậm nhất → đúng dòng log PostgreSQL có câu SQL, tham số và kế hoạch auto_explain → pgBadger và pg_stat_statements để chọn đúng câu cần sửa → tạo chỉ mục CONCURRENTLY (và đọc log chờ khoá của chính nó) → đo lại. Đáp án chạy thật, che trong mục mở.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lab 12</span>
<h2>The order page is slow at peak hours — prove which SQL, fix it, measure it</h2>
<p class="lead">Thursday, 11:40. The customer's PM writes: "Customers say looking up their orders takes forever around lunchtime. The rest of the site is fine." You have the stack's logs and a read/write account on the database. Your job: name the slow SQL with evidence from both the app log and the database log, decide what to fix first, fix it without blocking the shop, and show before/after numbers.</p>

<h3>Rules</h3>
<ul>
<li>Start from the <strong>app log</strong>, not from guessing in the code. Every conclusion quotes a line (app log, DB log, report, plan).</li>
<li>Do not restart the database and do not change logging settings during the investigation — they are already on (look at <code>compose.yaml</code>).</li>
<li>The fix must not lock the <code>orders</code> table for writes.</li>
</ul>

<h3>Setup (10 min)</h3>
<p>The lab files are in the course repository folder <code>_demo/s12/lab12/</code>:</p>
${ma('yaml', 's12/lab12/compose.yaml')}
${ma('js', 's12/lab12/app/server.mjs')}
<ul>
<li>The API logs one JSON line per request with a request id (<code>rid</code>), route, status and duration (<code>ms</code>) — the pino style of lesson 10.4.</li>
<li>Every SQL statement starts with a comment <code>/* rid=…,route=… */</code>: the request id travels into the database log (lesson 12.2, sqlcommenter).</li>
<li>PostgreSQL logs statements slower than 100 ms, with auto_explain plans, as text and jsonlog; pg_stat_statements is installed.</li>
<li>No Docker network is created: the DB has <code>network_mode: none</code>, the API shares its network namespace (<code>service:db</code>) and talks to <code>localhost:5432</code>.</li>
</ul>
<p>Start it (<code>cd lab12/app && npm i</code> once, then <code>mkdir -p app/logs && docker compose up -d</code>; the first start loads 2 million rows, about 20 seconds), then simulate lunchtime: <code>docker exec lgz-lab12api node tai.mjs</code> — 200 order lookups by e-mail, 300 single-order views and 3 daily-stats calls, 4 at a time.</p>
${ma('js', 's12/lab12/app/tai.mjs')}

<h3>The questions</h3>
<ol>
<li>Which route is slow? Give n, p50 and p95 per route from the app log.</li>
<li>Take the slowest request of that route. What is its <code>rid</code>, and what does the <strong>database</strong> log say about it: SQL, parameter value, duration?</li>
<li>Which plan did PostgreSQL use for it, and how many rows were read and thrown away?</li>
<li><code>/api/stats/today</code> is also slow — slower per call than some order lookups. Which one do you fix first? Prove it with pgBadger <em>and</em> pg_stat_statements.</li>
<li>Write the fix. Apply it without blocking writes. What did the database log write <em>while</em> you applied it, and why?</li>
<li>Run the same load again. Give before/after p50/p95, the new plan, and what is left in the slow log. Is the remaining item worth fixing now?</li>
</ol>

<h3>Hints (open one at a time)</h3>
<details><summary>Hint for 1</summary><p><code>jq -s</code> reads the whole file as one array; <code>group_by(.route)</code>, then sort the <code>ms</code> values and pick the element at <code>length * 0.95</code>. Lesson 2.4 has the pattern.</p></details>
<details><summary>Hint for 2 and 3</summary><p><code>grep 'rid=&lt;id&gt;'</code> on <code>log/postgresql-*.log</code> inside the DB container, with <code>-A 18</code> to see the plan that follows. The value is on the <code>DETAIL: Parameters</code> line (12.2 step 2). Plans read bottom-up; look for <code>Seq Scan</code> and <code>Rows Removed by Filter</code>.</p></details>
<details><summary>Hint for 4</summary><p>Per call vs total: count × average. pgBadger's "Queries that took up the most time" and <code>pg_stat_statements ORDER BY total_exec_time</code> answer the same question from two sources (12.2 step 4).</p></details>
<details><summary>Hint for 5 and 6</summary><p><code>CREATE INDEX CONCURRENTLY</code> on the column in <code>WHERE</code> plus the column in <code>ORDER BY</code>. It must wait for transactions already running on the table — with <code>log_lock_waits</code> on, that wait is logged. Reset pg_stat_statements before the second run so the numbers are clean.</p></details>

<h3>Answer key (run for real — open after you finish)</h3>
<details><summary>Show the commands and output</summary>
${ma('bash', 's12/lab12.bash')}
${ra('s12/lab12')}
</details>

<h3>Reading the answers</h3>
<details><summary>Show the explanation</summary>
<ol>
<li><strong>Slow route:</strong> <code>/api/orders</code> — n=200, p50 ≈ 405 ms, p95 ≈ 585 ms, max ≈ 707 ms. <code>/api/orders/:id</code> is fine (p95 ≈ 7 ms). <code>/api/stats/today</code> ≈ 330 ms but n=3.
${lenh('s12/lab12', 3)}</li>
<li><strong>The slowest request</strong> is <code>rid=725b2f74</code> (706.5 ms in the app). In the DB log the same rid appears in the comment: <code>duration: 701.443 ms execute &lt;unnamed&gt;: /* rid=725b2f74,route=/api/orders */ SELECT … WHERE customer_email = $1 ORDER BY created_at DESC LIMIT 20</code>, <code>Parameters: $1 = 'khach34903@example.com'</code>. App 706 ms − DB 701 ms ≈ 5 ms of network, pool and JSON — the time is in the database.</li>
<li><strong>Plan:</strong> <code>Parallel Seq Scan on orders</code>, <code>Rows Removed by Filter: 999980</code> per process (2 loops ≈ 2 million rows read for 20 returned), ~36 000 buffers. Classic missing index on <code>customer_email</code>; the <code>ORDER BY created_at DESC LIMIT 20</code> then sorts the survivors.</li>
<li><strong>Priority:</strong> the DB log has 409 <code>duration</code> lines; by route, 200 are <code>/api/orders</code> and 3 are <code>/api/stats/today</code>. pgBadger: the normalised order query took <strong>1m23s</strong> in total over 200 executions (avg 417 ms). pg_stat_statements agrees: 200 calls, 83 482 ms total, 417.4 ms mean — versus 3 calls and 923 ms for the stats query. Fix the order lookup first: it is ~90× more database time and it is what customers wait for. Note pg_stat_statements shows one example text with a rid comment, yet groups all 200 calls — comments do not split the statistics.</li>
<li><strong>Fix:</strong> <code>CREATE INDEX CONCURRENTLY orders_email_created_idx ON orders (customer_email, created_at DESC)</code> — equality column first, then the sort column in the same direction, so the index returns rows already ordered and <code>LIMIT 20</code> stops early. <code>CONCURRENTLY</code> builds without blocking INSERT/UPDATE (it takes longer and cannot run inside a transaction). While it ran the log said <code>process 511 still waiting for ShareUpdateExclusiveLock … after 1000.067 ms</code>, <code>Process holding the lock: 482</code>: it had to wait for a transaction already using the table, then <code>duration: 5855.478 ms</code>. On a real system, that wait can be long if someone keeps a transaction open — check <code>pg_stat_activity</code> first.</li>
<li><strong>After:</strong> plan <code>Index Scan using orders_email_created_idx</code>, 0.187 ms instead of 79 ms. Same load: 503 requests in 0.9 s instead of 22.0 s; <code>/api/orders</code> p50 1.3 ms, p95 3.5 ms (from 405/585). pg_stat_statements: 200 calls, mean 0.07 ms. The slow log gained only 6 lines, all from <code>/api/stats/today</code> (statement + plan × 3). That query scans by <code>created_at</code>; it runs 3 times per "lunch" — write it in the backlog with numbers (≈ 270 ms × calls/day), do not fix it under pressure.</li>
</ol>
</details>

<h3>Write the report (5 lines)</h3>
<div class="callout ok"><ol>
<li><strong>Symptom:</strong> <code>/api/orders</code> p95 585 ms at peak (app log, 200 requests); other routes &lt; 10 ms.</li>
<li><strong>Cause:</strong> <code>SELECT … FROM orders WHERE customer_email = $1 ORDER BY created_at DESC LIMIT 20</code> does a parallel seq scan of 2M rows (auto_explain, rid 725b2f74, 701 ms).</li>
<li><strong>Impact:</strong> 83.5 s of DB time per 200 lookups — 98% of DB time in the test (pg_stat_statements, pgBadger).</li>
<li><strong>Fix:</strong> index <code>(customer_email, created_at DESC)</code> built CONCURRENTLY in 5.9 s, no write lock.</li>
<li><strong>Result:</strong> p95 585 → 3.5 ms; remaining slow item <code>/api/stats/today</code> (≈ 280 ms, 3 calls) in backlog.</li>
</ol></div>

<h3>🎤 Interviewers will ask</h3>
<ul>
<li><em>An API endpoint is slow. How do you find the SQL responsible?</em> — App log/APM for the route and a request id → DB slow log for that request (application_name, time, ideally the id in a SQL comment) → plan with EXPLAIN (ANALYZE, BUFFERS) or auto_explain → confirm the total cost in pg_stat_statements before fixing.</li>
<li><em>What is the difference between the slow-query log and pg_stat_statements?</em> — The log records individual slow executions with time, client and parameters; pg_stat_statements aggregates all executions of a normalised query and catches frequent fast queries that never reach the log.</li>
<li><em>Why not set log_min_duration_statement = 0 in production?</em> — Measurable throughput loss (−37% in our test) and huge volume (~150 GB/day), plus every parameter value — personal data — copied into logs. Sample or use pg_stat_statements.</li>
<li><em>How do you add an index to a big table in production?</em> — <code>CREATE INDEX CONCURRENTLY</code> (no write lock, slower, outside a transaction; check for an INVALID index if it fails), during low traffic, after checking long-running transactions.</li>
<li><em>Somebody dropped a table. How do you find who?</em> — <code>log_statement = 'ddl'</code> or pgAudit lines with user, client IP and application_name; if a shared account was used, follow the IP outside the DB (DHCP/VPN) — and fix the shared account afterwards.</li>
</ul>

<h3>🛠 Project milestone</h3>
<p>In your own project (Spring Boot + PostgreSQL or Node + Prisma/pg): (1) set <code>application_name</code> per service; (2) add <code>%u@%d app=%a client=%h</code> to <code>log_line_prefix</code> and a slow threshold (200 ms) in your Compose/DB config; (3) put the request id into the SQL — a comment like this lab, or at least into <code>application_name</code> per request for background jobs; (4) run one load test, produce one pgBadger report and one pg_stat_statements top-5, and commit both (without personal data) to the docs folder.</p>

<h3>Done when</h3>
<div class="callout ok"><p>All six answers quote evidence (app log line or table, DB log line, plan line, report line); the fix is created CONCURRENTLY and you can explain the lock wait it logged; before/after p95 and the remaining slow query are in a 5-line report. Clean up with <code>docker compose down -v</code>.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['p50 / p95', 'Median and 95th percentile latency per route — computed from the app log with jq.'],
  ['request id in SQL comment', '/* rid=… */ prefix so a DB log line points back to exactly one request.'],
  ['CREATE INDEX CONCURRENTLY', 'Builds an index without blocking writes; waits for existing transactions; cannot run in a transaction block.'],
  ['composite index (a, b DESC)', 'Equality column first, then the ORDER BY column — rows come out sorted, LIMIT stops early.'],
  ['total vs per-call cost', 'Fix what costs the most total DB time and user waiting, not the single slowest line.'],
])}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Lab 12</span>
<h2>Trang đơn hàng chậm giờ cao điểm — chứng minh câu SQL nào, sửa, rồi đo</h2>
<p class="lead">Thứ Năm, 11:40. PM bên khách nhắn: "Khách kêu tra đơn hàng lâu kinh khủng tầm giờ trưa. Phần còn lại của web vẫn ổn." Bạn có log của stack và một tài khoản đọc/ghi CSDL. Nhiệm vụ: gọi tên câu SQL chậm với bằng chứng từ cả log ứng dụng lẫn log CSDL, quyết định sửa cái gì trước, sửa mà không chặn cửa hàng, và đưa ra số trước/sau.</p>

<h3>Luật chơi</h3>
<ul>
<li>Bắt đầu từ <strong>log ứng dụng</strong>, không đoán trong mã. Mọi kết luận đều trích một dòng (log ứng dụng, log CSDL, báo cáo, kế hoạch).</li>
<li>Không khởi động lại CSDL và không đổi thiết lập log trong lúc điều tra — chúng đã được bật sẵn (xem <code>compose.yaml</code>).</li>
<li>Cách sửa không được khoá ghi bảng <code>orders</code>.</li>
</ul>

<h3>Chuẩn bị (10 phút)</h3>
<p>Tệp lab nằm trong thư mục <code>_demo/s12/lab12/</code> của kho khoá học:</p>
${ma('yaml', 's12/lab12/compose.yaml')}
${ma('js', 's12/lab12/app/server.mjs')}
<ul>
<li>API ghi mỗi request một dòng JSON có request id (<code>rid</code>), route, status và thời gian (<code>ms</code>) — kiểu pino của bài 10.4.</li>
<li>Mọi câu SQL bắt đầu bằng chú thích <code>/* rid=…,route=… */</code>: request id đi theo vào tận log CSDL (bài 12.2, sqlcommenter).</li>
<li>PostgreSQL ghi các câu chậm hơn 100 ms, kèm kế hoạch auto_explain, ra cả log chữ lẫn jsonlog; pg_stat_statements đã cài.</li>
<li>Không tạo mạng Docker nào: CSDL dùng <code>network_mode: none</code>, API dùng chung network namespace của nó (<code>service:db</code>) và nói chuyện qua <code>localhost:5432</code>.</li>
</ul>
<p>Khởi động (<code>cd lab12/app && npm i</code> một lần, rồi <code>mkdir -p app/logs && docker compose up -d</code>; lần đầu nạp 2 triệu dòng, khoảng 20 giây), rồi giả lập giờ trưa: <code>docker exec lgz-lab12api node tai.mjs</code> — 200 lần tra đơn theo email, 300 lần xem một đơn và 3 lần gọi thống kê ngày, 4 request cùng lúc.</p>
${ma('js', 's12/lab12/app/tai.mjs')}

<h3>Các câu hỏi</h3>
<ol>
<li>Route nào chậm? Cho n, p50 và p95 theo từng route từ log ứng dụng.</li>
<li>Lấy request chậm nhất của route đó. <code>rid</code> của nó là gì, và log <strong>CSDL</strong> nói gì về nó: câu SQL, giá trị tham số, thời gian?</li>
<li>PostgreSQL đã dùng kế hoạch nào cho nó, đọc rồi vứt bao nhiêu dòng?</li>
<li><code>/api/stats/today</code> cũng chậm — mỗi lần còn chậm hơn vài lần tra đơn. Sửa cái nào trước? Chứng minh bằng pgBadger <em>và</em> pg_stat_statements.</li>
<li>Viết cách sửa. Áp dụng mà không chặn ghi. Log CSDL đã ghi gì <em>trong lúc</em> bạn áp dụng, và vì sao?</li>
<li>Chạy lại đúng tải đó. Cho p50/p95 trước/sau, kế hoạch mới, và slow log còn lại gì. Thứ còn lại có đáng sửa ngay không?</li>
</ol>

<h3>Gợi ý (mở từng cái một)</h3>
<details><summary>Gợi ý câu 1</summary><p><code>jq -s</code> đọc cả tệp thành một mảng; <code>group_by(.route)</code>, rồi sắp các giá trị <code>ms</code> và lấy phần tử ở vị trí <code>length * 0.95</code>. Bài 2.4 có mẫu này.</p></details>
<details><summary>Gợi ý câu 2 và 3</summary><p><code>grep 'rid=&lt;id&gt;'</code> trên <code>log/postgresql-*.log</code> trong container CSDL, kèm <code>-A 18</code> để thấy kế hoạch theo sau. Giá trị nằm ở dòng <code>DETAIL: Parameters</code> (12.2 bước 2). Kế hoạch đọc từ dưới lên; tìm <code>Seq Scan</code> và <code>Rows Removed by Filter</code>.</p></details>
<details><summary>Gợi ý câu 4</summary><p>Mỗi lần so với tổng: số lần × trung bình. Mục "Queries that took up the most time" của pgBadger và <code>pg_stat_statements ORDER BY total_exec_time</code> trả lời cùng câu hỏi từ hai nguồn (12.2 bước 4).</p></details>
<details><summary>Gợi ý câu 5 và 6</summary><p><code>CREATE INDEX CONCURRENTLY</code> trên cột trong <code>WHERE</code> cộng cột trong <code>ORDER BY</code>. Nó phải chờ các giao dịch đang chạy trên bảng — với <code>log_lock_waits</code> bật, việc chờ đó được ghi. Reset pg_stat_statements trước lượt thứ hai cho số liệu sạch.</p></details>

<h3>Đáp án (chạy thật — mở sau khi làm xong)</h3>
<details><summary>Xem lệnh và output</summary>
${ma('bash', 's12/lab12.bash')}
${ra('s12/lab12')}
</details>

<h3>Đọc đáp án</h3>
<details><summary>Xem giải thích</summary>
<ol>
<li><strong>Route chậm:</strong> <code>/api/orders</code> — n=200, p50 ≈ 405 ms, p95 ≈ 585 ms, max ≈ 707 ms. <code>/api/orders/:id</code> ổn (p95 ≈ 7 ms). <code>/api/stats/today</code> ≈ 330 ms nhưng n=3.
${lenh('s12/lab12', 3)}</li>
<li><strong>Request chậm nhất</strong> là <code>rid=725b2f74</code> (706,5 ms ở ứng dụng). Trong log CSDL, đúng rid đó nằm trong chú thích: <code>duration: 701.443 ms execute &lt;unnamed&gt;: /* rid=725b2f74,route=/api/orders */ SELECT … WHERE customer_email = $1 ORDER BY created_at DESC LIMIT 20</code>, <code>Parameters: $1 = 'khach34903@example.com'</code>. Ứng dụng 706 ms − CSDL 701 ms ≈ 5 ms cho mạng, pool và JSON — thời gian nằm ở CSDL.</li>
<li><strong>Kế hoạch:</strong> <code>Parallel Seq Scan on orders</code>, <code>Rows Removed by Filter: 999980</code> mỗi tiến trình (2 vòng ≈ đọc 2 triệu dòng để trả 20), khoảng 36 000 buffer. Kinh điển: thiếu chỉ mục trên <code>customer_email</code>; <code>ORDER BY created_at DESC LIMIT 20</code> sau đó sắp những dòng còn lại.</li>
<li><strong>Ưu tiên:</strong> log CSDL có 409 dòng <code>duration</code>; theo route, 200 dòng là <code>/api/orders</code> và 3 dòng là <code>/api/stats/today</code>. pgBadger: câu tra đơn đã chuẩn hoá tốn tổng <strong>1m23s</strong> qua 200 lần chạy (trung bình 417 ms). pg_stat_statements khớp: 200 lần, tổng 83 482 ms, trung bình 417,4 ms — so với 3 lần và 923 ms của câu thống kê. Sửa câu tra đơn trước: nó tốn thời gian CSDL gấp khoảng 90 lần và là thứ khách đang phải chờ. Để ý pg_stat_statements hiện một văn bản mẫu có chú thích rid, nhưng vẫn gom cả 200 lần — chú thích không làm tách thống kê.</li>
<li><strong>Sửa:</strong> <code>CREATE INDEX CONCURRENTLY orders_email_created_idx ON orders (customer_email, created_at DESC)</code> — cột so bằng đứng trước, rồi cột sắp xếp cùng chiều, để chỉ mục trả dòng đã đúng thứ tự và <code>LIMIT 20</code> dừng sớm. <code>CONCURRENTLY</code> dựng mà không chặn INSERT/UPDATE (lâu hơn và không chạy được trong giao dịch). Trong lúc chạy, log ghi <code>process 511 still waiting for ShareUpdateExclusiveLock … after 1000.067 ms</code>, <code>Process holding the lock: 482</code>: nó phải chờ một giao dịch đang dùng bảng, rồi <code>duration: 5855.478 ms</code>. Trên hệ thống thật, lần chờ đó có thể rất lâu nếu ai đó giữ giao dịch mở — kiểm <code>pg_stat_activity</code> trước.</li>
<li><strong>Sau khi sửa:</strong> kế hoạch <code>Index Scan using orders_email_created_idx</code>, 0,187 ms thay vì 79 ms. Cùng tải: 503 request trong 0,9 giây thay vì 22,0 giây; <code>/api/orders</code> p50 1,3 ms, p95 3,5 ms (từ 405/585). pg_stat_statements: 200 lần, trung bình 0,07 ms. Slow log chỉ thêm 6 dòng, đều từ <code>/api/stats/today</code> (câu lệnh + kế hoạch × 3). Câu đó quét theo <code>created_at</code>; mỗi "bữa trưa" chạy 3 lần — ghi vào backlog kèm số (≈ 270 ms × số lần/ngày), đừng sửa trong lúc gấp.</li>
</ol>
</details>

<h3>Viết báo cáo (5 dòng)</h3>
<div class="callout ok"><ol>
<li><strong>Triệu chứng:</strong> <code>/api/orders</code> p95 585 ms giờ cao điểm (log ứng dụng, 200 request); route khác &lt; 10 ms.</li>
<li><strong>Nguyên nhân:</strong> <code>SELECT … FROM orders WHERE customer_email = $1 ORDER BY created_at DESC LIMIT 20</code> quét song song 2 triệu dòng (auto_explain, rid 725b2f74, 701 ms).</li>
<li><strong>Ảnh hưởng:</strong> 83,5 giây thời gian CSDL cho 200 lần tra — 98% thời gian CSDL trong bài test (pg_stat_statements, pgBadger).</li>
<li><strong>Sửa:</strong> chỉ mục <code>(customer_email, created_at DESC)</code> dựng CONCURRENTLY trong 5,9 giây, không khoá ghi.</li>
<li><strong>Kết quả:</strong> p95 585 → 3,5 ms; còn lại <code>/api/stats/today</code> (≈ 280 ms, 3 lần) đưa vào backlog.</li>
</ol></div>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><em>Một endpoint API chậm. Bạn tìm câu SQL chịu trách nhiệm thế nào?</em> — Log ứng dụng/APM để có route và request id → slow log CSDL của request đó (application_name, giờ, tốt nhất là id trong chú thích SQL) → kế hoạch bằng EXPLAIN (ANALYZE, BUFFERS) hoặc auto_explain → xác nhận tổng chi phí ở pg_stat_statements rồi mới sửa.</li>
<li><em>Slow-query log và pg_stat_statements khác nhau thế nào?</em> — Log ghi từng lần chạy chậm kèm giờ, máy khách và tham số; pg_stat_statements cộng dồn mọi lần chạy của một câu đã chuẩn hoá và bắt được câu nhanh mà chạy nhiều, thứ không bao giờ vào log.</li>
<li><em>Sao không đặt log_min_duration_statement = 0 trên production?</em> — Mất thông lượng đo được (−37% trong bài test của ta) và khối lượng khổng lồ (~150 GB/ngày), cộng thêm mọi giá trị tham số — dữ liệu cá nhân — bị chép vào log. Hãy lấy mẫu hoặc dùng pg_stat_statements.</li>
<li><em>Thêm chỉ mục cho bảng lớn trên production thế nào?</em> — <code>CREATE INDEX CONCURRENTLY</code> (không khoá ghi, chậm hơn, ngoài giao dịch; nếu hỏng thì kiểm chỉ mục INVALID), vào giờ thấp điểm, sau khi kiểm các giao dịch chạy lâu.</li>
<li><em>Có người đã xoá một bảng. Tìm ai thế nào?</em> — Dòng của <code>log_statement = 'ddl'</code> hoặc pgAudit có người dùng, IP máy khách và application_name; nếu dùng tài khoản chung, lần theo IP ra ngoài CSDL (DHCP/VPN) — và sau đó dẹp tài khoản chung.</li>
</ul>

<h3>🛠 Mốc dự án</h3>
<p>Trong dự án của chính bạn (Spring Boot + PostgreSQL hoặc Node + Prisma/pg): (1) đặt <code>application_name</code> cho từng dịch vụ; (2) thêm <code>%u@%d app=%a client=%h</code> vào <code>log_line_prefix</code> và một ngưỡng chậm (200 ms) trong cấu hình Compose/CSDL; (3) đưa request id vào câu SQL — chú thích như lab này, hoặc ít nhất là vào <code>application_name</code> cho từng job nền; (4) chạy một lượt test tải, xuất một báo cáo pgBadger và một top-5 pg_stat_statements, commit cả hai (không có dữ liệu cá nhân) vào thư mục docs.</p>

<h3>Đạt khi</h3>
<div class="callout ok"><p>Cả sáu câu trả lời đều trích bằng chứng (dòng hoặc bảng của log ứng dụng, dòng log CSDL, dòng kế hoạch, dòng báo cáo); chỉ mục được tạo CONCURRENTLY và bạn giải thích được lần chờ khoá mà nó đã ghi; p95 trước/sau và câu chậm còn lại nằm trong báo cáo 5 dòng. Dọn bằng <code>docker compose down -v</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['p50 / p95', 'Trung vị và phân vị 95 của thời gian theo route — tính từ log ứng dụng bằng jq.'],
  ['request id trong chú thích SQL', 'Tiền tố /* rid=… */ để một dòng log CSDL chỉ ngược về đúng một request.'],
  ['CREATE INDEX CONCURRENTLY', 'Dựng chỉ mục không chặn ghi; chờ các giao dịch đang có; không chạy trong khối giao dịch.'],
  ['chỉ mục ghép (a, b DESC)', 'Cột so bằng trước, rồi cột ORDER BY — dòng ra đã đúng thứ tự, LIMIT dừng sớm.'],
  ['chi phí tổng và mỗi lần', 'Sửa thứ tốn nhiều thời gian CSDL tổng và thời gian chờ của người dùng, không phải dòng chậm nhất đơn lẻ.'],
])}
</div>
`,
};
