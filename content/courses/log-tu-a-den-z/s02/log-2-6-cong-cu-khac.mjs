/**
 * 2.6 — Công cụ đáng biết khác (soạn 22/11/2026).
 * Output: OUT['s02/cong-cu'] — SQL trên log bằng SQLite có sẵn trong Python (CODE['s02/sql-log.py']), chạy thật.
 * lnav, GoAccess, DuckDB là công cụ tương tác/cài thêm ⇒ chỉ ghi lệnh + mô tả theo tài liệu chính thức, KHÔNG in output giả.
 * Nguồn: lnav.org, goaccess.io (man page: --log-format=COMBINED, -o report.html), duckdb.org (read_csv, regexp_extract).
 */
import { ma, lenh, nguon, kv } from '../_chung.mjs';

export default {
  title: '2.6 — Other tools worth knowing: lnav, GoAccess, DuckDB/SQLite over logs, spreadsheets|||2.6 — Công cụ đáng biết khác: lnav, GoAccess, DuckDB/SQLite trên log, bảng tính',
  slug: 'log-2-6-cong-cu-khac',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Khi lệnh một dòng không còn đủ: lnav tự nhận định dạng và gộp nhiều tệp theo thời gian; GoAccess ra báo cáo access log trong một lệnh; hỏi log bằng SQL — chạy thật với SQLite có sẵn trong Python (số request và lỗi theo phút lúc sự cố), cách làm tương tự với DuckDB; pivot trong Excel/Sheets cho người không dùng terminal; bảng chọn công cụ theo tình huống.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.6</span>
<h2>Other tools worth knowing: when one-liners stop being enough</h2>
<p class="lead">grep, awk and jq answer quick questions. Some situations need more: several log files interleaved by time, a report a manager can read, a question that is easier as SQL, or a teammate who will never open a terminal. This lesson shows four tools for those moments and one rule for choosing.</p>

<h3>The everyday picture: a toolbox, not a single hammer</h3>
<p>You can hang a picture with a shoe, but a hammer is easier — and for a hundred pictures you want a nail gun. One-liners are the hammer. The tools below are the nail gun (lnav), the photo report (GoAccess), the measuring table (SQL) and the whiteboard you show everyone (a spreadsheet).</p>

<h3>lnav — a log viewer that understands formats</h3>
<p><a href="https://lnav.org/">lnav</a> (Logfile Navigator) opens many files at once, recognises common formats (syslog, access logs, JSON lines…), colours levels, and — most useful in investigations — <strong>merges all files into one timeline</strong>. Typical use:</p>
<pre><code class="language-bash">sudo apt install lnav          # or: brew install lnav
lnav web/access.log incident/ linux/auth.log</code></pre>
<ul>
<li>Press <code>e</code> / <code>E</code> to jump to the next / previous error, <code>/</code> to search, <code>i</code> for a histogram of messages over time.</li>
<li>Type <code>:filter-in 203.0.113.66</code> to keep only matching lines.</li>
<li>It also offers SQL over recognised logs (<code>;SELECT …</code>).</li>
</ul>
<p>It is interactive, so there is no "output" to print here — try it on the pack and compare with Lab 1, where you merged five sources by hand.</p>

<h3>GoAccess — a web traffic report in one command</h3>
<p><a href="https://goaccess.io/">GoAccess</a> reads nginx/Apache access logs and produces a dashboard in the terminal or a single HTML file: top URLs, visitors, status codes, operating systems, browsers, 404 pages.</p>
<pre><code class="language-bash">sudo apt install goaccess      # or: brew install goaccess
goaccess web/access.log --log-format=COMBINED                     # in the terminal
goaccess web/access.log --log-format=COMBINED -o /tmp/bao-cao.html  # one HTML file</code></pre>
<p>Use it for "how was traffic this week?" — not for an investigation, where you need the exact lines.</p>

<h3>SQL over logs — tried for real with SQLite</h3>
<p>Questions like "per minute, how many requests and how many of them were errors?" are natural in SQL. Python ships with SQLite, so this works on any machine with Python — no installation. The script parses each line with one regular expression, loads a table, and asks four questions:</p>
${ma('python', 's02/sql-log.py')}
${lenh('s02/cong-cu', 0)}
<p>The third query is the one that would take a long awk line: in 14:04–14:08 almost every request failed (27 of 30, 29 of 31…), and traffic jumped tenfold because users kept reloading. The fourth gives the password-guessing window in one row: 420 failures from 02:10:03 to 02:41:21.</p>
<p><a href="https://duckdb.org/">DuckDB</a> does the same without a script and is very fast on big files and Parquet. After installing it, one session might look like this (a sketch, check the DuckDB docs for your version):</p>
<pre><code class="language-sql">CREATE TABLE req AS
  SELECT regexp_extract(line, '^(\\S+)', 1) AS ip,
         regexp_extract(line, '" (\\d{3}) ', 1)::INT AS status
  FROM read_csv('web/access.log', columns = {'line': 'VARCHAR'}, delim = '\\t', header = false);
SELECT status, count(*) FROM req GROUP BY status ORDER BY 2 DESC;</code></pre>

<h3>Spreadsheets — for people who do not use a terminal</h3>
<p>Your manager or a teacher may want "errors per hour" as a chart. Export with the tools you know, then pivot:</p>
<pre><code class="language-bash">echo "time,status,url" &gt; /tmp/req.csv
awk '{print substr($4, 2, 20) "," $9 "," $7}' web/access.log &gt;&gt; /tmp/req.csv</code></pre>
<p>Open the CSV in Excel or Google Sheets → <em>Insert → PivotTable</em>, rows = hour, columns = status, values = count. Keep exports small and masked (lesson 0.2): a spreadsheet is easy to forward.</p>

<h3>Which tool when?</h3>
<table>
<thead><tr><th>Situation</th><th>Reach for</th></tr></thead>
<tbody>
<tr><td>A quick yes/no or a count, right now, on a server</td><td>grep, awk, jq, Select-String</td></tr>
<tr><td>Several files, need them interleaved by time, interactively</td><td>lnav</td></tr>
<tr><td>A traffic overview to share</td><td>GoAccess HTML report</td></tr>
<tr><td>A question with grouping, joins or several conditions</td><td>SQL (SQLite in Python, DuckDB, lnav SQL)</td></tr>
<tr><td>Someone else will look at it</td><td>CSV → spreadsheet pivot / chart</td></tr>
<tr><td>Every day, many servers, alerts</td><td>Central logging (Chapter 15) — not a laptop tool</td></tr>
</tbody></table>

<h3>🧪 Practice (20 min)</h3>
<div class="callout ok"><ol>
<li>Save <code>sql-log.py</code> in your home folder, run it in <code>log-lab</code>, and check your numbers match.</li>
<li>Add a fifth query: the 5 URLs with the most 5xx responses. Compare with lesson 2.3's awk answer.</li>
<li>If you can install software: open the pack in lnav and find the 02:41:07 successful login with a search; or build the GoAccess HTML report and find the 401 count in it. If you cannot install: build <code>/tmp/req.csv</code> and a pivot of status by hour in a spreadsheet.</li>
</ol>
<p><strong>Done when:</strong> your SQL results equal the output above, your 5xx query agrees with awk (<code>/api/v1/feed</code> first with 65), and you used one of lnav, GoAccess or a spreadsheet pivot on the pack.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['lnav', 'Interactive log viewer that merges files by time and recognises formats.'],
  ['GoAccess', 'Access-log analyser producing terminal or HTML reports.'],
  ['SQLite', 'A small SQL database built into Python — no server needed.'],
  ['DuckDB', 'An in-process analytical SQL engine, fast on large files.'],
  ['pivot table', 'A spreadsheet summary that groups rows by columns and counts or sums.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>lnav: many files, one timeline, jump between errors.</li>
<li>GoAccess: a shareable traffic report in one command.</li>
<li>SQL over logs: SQLite in Python works everywhere; DuckDB for big data.</li>
<li>Spreadsheets for non-terminal readers — export small, masked CSVs.</li>
<li>Pick the tool by the question and the audience, not by habit.</li>
</ul>
${nguon('📗', 'lnav — The Logfile Navigator', 'Formats, timeline merge, filters, SQL', 'https://lnav.org/')}
${nguon('📗', 'GoAccess', 'Real-time web log analyser, terminal and HTML output', 'https://goaccess.io/')}
${nguon('📘', 'DuckDB — CSV import', 'read_csv options used in the sketch', 'https://duckdb.org/docs/stable/data/csv/overview')}
${nguon('📘', 'Python — sqlite3', 'The standard-library module used by sql-log.py', 'https://docs.python.org/3/library/sqlite3.html')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.6</span>
<h2>Công cụ đáng biết khác: khi lệnh một dòng không còn đủ</h2>
<p class="lead">grep, awk, jq trả lời nhanh những câu ngắn. Có lúc cần hơn thế: nhiều tệp log xen kẽ theo thời gian, một bản báo cáo sếp đọc được, một câu hỏi viết bằng SQL dễ hơn, hay một bạn cùng nhóm sẽ chẳng bao giờ mở terminal. Bài này giới thiệu bốn công cụ cho những lúc đó và một nguyên tắc để chọn.</p>

<h3>Liên tưởng đời thường: hộp đồ nghề, không phải một cây búa</h3>
<p>Treo một bức tranh thì dùng chiếc giày cũng được, nhưng búa dễ hơn — còn treo một trăm bức thì bạn muốn súng bắn đinh. Lệnh một dòng là cây búa. Các công cụ dưới đây là súng bắn đinh (lnav), tấm ảnh báo cáo (GoAccess), bàn đo đạc (SQL) và tấm bảng trắng đưa cho mọi người xem (bảng tính).</p>

<h3>lnav — trình xem log hiểu được định dạng</h3>
<p><a href="https://lnav.org/">lnav</a> (Logfile Navigator) mở nhiều tệp một lúc, nhận ra các định dạng phổ biến (syslog, access log, JSON lines…), tô màu theo mức, và — hữu ích nhất khi điều tra — <strong>gộp mọi tệp thành một dòng thời gian</strong>. Cách dùng thường gặp:</p>
<pre><code class="language-bash">sudo apt install lnav          # hoặc: brew install lnav
lnav web/access.log incident/ linux/auth.log</code></pre>
<ul>
<li>Bấm <code>e</code> / <code>E</code> để nhảy tới lỗi kế tiếp / trước đó, <code>/</code> để tìm, <code>i</code> để xem biểu đồ thông điệp theo thời gian.</li>
<li>Gõ <code>:filter-in 203.0.113.66</code> để chỉ giữ dòng khớp.</li>
<li>Nó còn cho chạy SQL trên log đã nhận dạng (<code>;SELECT …</code>).</li>
</ul>
<p>Đây là công cụ tương tác, nên không có "output" để in ở đây — hãy thử trên gói mẫu và so với Lab 1, nơi bạn đã tự tay gộp năm nguồn.</p>

<h3>GoAccess — báo cáo lưu lượng web trong một lệnh</h3>
<p><a href="https://goaccess.io/">GoAccess</a> đọc access log của nginx/Apache và dựng bảng điều khiển ngay trong terminal hoặc thành một tệp HTML: URL nhiều nhất, khách truy cập, mã trạng thái, hệ điều hành, trình duyệt, trang 404.</p>
<pre><code class="language-bash">sudo apt install goaccess      # hoặc: brew install goaccess
goaccess web/access.log --log-format=COMBINED                     # trong terminal
goaccess web/access.log --log-format=COMBINED -o /tmp/bao-cao.html  # một tệp HTML</code></pre>
<p>Dùng nó cho câu "tuần này lưu lượng thế nào?" — không phải cho điều tra, vì khi điều tra bạn cần đúng từng dòng.</p>

<h3>SQL trên log — chạy thật với SQLite</h3>
<p>Câu như "mỗi phút có bao nhiêu request và bao nhiêu trong số đó lỗi?" viết bằng SQL rất tự nhiên. Python có sẵn SQLite, nên cách này chạy trên mọi máy có Python — không cần cài gì. Script tách mỗi dòng bằng một biểu thức chính quy, nạp vào một bảng, rồi hỏi bốn câu:</p>
${ma('python', 's02/sql-log.py')}
${lenh('s02/cong-cu', 0)}
<p>Câu thứ ba là câu sẽ thành một dòng awk rất dài: từ 14:04 tới 14:08 gần như request nào cũng lỗi (27 trên 30, 29 trên 31…), và lưu lượng vọt lên gấp mười vì người dùng cứ tải lại. Câu thứ tư cho cả cửa sổ dò mật khẩu trong một hàng: 420 lần sai từ 02:10:03 tới 02:41:21.</p>
<p><a href="https://duckdb.org/">DuckDB</a> làm được y như vậy mà không cần script, và rất nhanh với tệp lớn và Parquet. Sau khi cài, một phiên làm việc có thể trông như sau (phác thảo, kiểm lại tài liệu DuckDB theo phiên bản của bạn):</p>
<pre><code class="language-sql">CREATE TABLE req AS
  SELECT regexp_extract(line, '^(\\S+)', 1) AS ip,
         regexp_extract(line, '" (\\d{3}) ', 1)::INT AS status
  FROM read_csv('web/access.log', columns = {'line': 'VARCHAR'}, delim = '\\t', header = false);
SELECT status, count(*) FROM req GROUP BY status ORDER BY 2 DESC;</code></pre>

<h3>Bảng tính — cho người không dùng terminal</h3>
<p>Sếp hay thầy cô có thể muốn "lỗi theo giờ" dạng biểu đồ. Xuất ra bằng công cụ bạn đã biết, rồi pivot:</p>
<pre><code class="language-bash">echo "time,status,url" &gt; /tmp/req.csv
awk '{print substr($4, 2, 20) "," $9 "," $7}' web/access.log &gt;&gt; /tmp/req.csv</code></pre>
<p>Mở tệp CSV bằng Excel hoặc Google Sheets → <em>Insert → PivotTable</em>, hàng = giờ, cột = mã trạng thái, giá trị = số đếm. Giữ bản xuất nhỏ và đã che (bài 0.2): bảng tính rất dễ bị chuyển tiếp.</p>

<h3>Lúc nào dùng công cụ nào?</h3>
<table>
<thead><tr><th>Tình huống</th><th>Dùng</th></tr></thead>
<tbody>
<tr><td>Một câu có/không hay một con số, ngay bây giờ, trên server</td><td>grep, awk, jq, Select-String</td></tr>
<tr><td>Nhiều tệp, cần xen kẽ theo thời gian, xem tương tác</td><td>lnav</td></tr>
<tr><td>Bức tranh lưu lượng để chia sẻ</td><td>Báo cáo HTML của GoAccess</td></tr>
<tr><td>Câu hỏi có gom nhóm, nối bảng hay nhiều điều kiện</td><td>SQL (SQLite trong Python, DuckDB, SQL của lnav)</td></tr>
<tr><td>Người khác sẽ xem</td><td>CSV → pivot / biểu đồ trong bảng tính</td></tr>
<tr><td>Hằng ngày, nhiều server, có cảnh báo</td><td>Gom log tập trung (Chương 15) — không phải công cụ trên laptop</td></tr>
</tbody></table>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
<li>Lưu <code>sql-log.py</code> vào thư mục nhà, chạy trong <code>log-lab</code>, và kiểm các con số có khớp không.</li>
<li>Thêm câu truy vấn thứ năm: 5 URL có nhiều phản hồi 5xx nhất. So với đáp án awk ở bài 2.3.</li>
<li>Nếu cài được phần mềm: mở gói mẫu bằng lnav và tìm lần đăng nhập thành công lúc 02:41:07; hoặc dựng báo cáo HTML của GoAccess và tìm số 401 trong đó. Nếu không cài được: dựng <code>/tmp/req.csv</code> và một bảng pivot mã trạng thái theo giờ trong bảng tính.</li>
</ol>
<p><strong>Đạt khi:</strong> kết quả SQL của bạn trùng với output ở trên, câu 5xx khớp với awk (<code>/api/v1/feed</code> đứng đầu với 65), và bạn đã dùng một trong lnav, GoAccess hoặc pivot bảng tính trên gói mẫu.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['lnav', 'Trình xem log tương tác, gộp tệp theo thời gian và nhận ra định dạng.'],
  ['GoAccess', 'Công cụ phân tích access log, ra báo cáo trong terminal hoặc HTML.'],
  ['SQLite', 'CSDL SQL nhỏ có sẵn trong Python — không cần server.'],
  ['DuckDB', 'Bộ máy SQL phân tích chạy ngay trong tiến trình, nhanh với tệp lớn.'],
  ['pivot table (bảng tổng hợp)', 'Bảng tóm tắt trong bảng tính, gom hàng theo cột rồi đếm hay cộng.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>lnav: nhiều tệp, một dòng thời gian, nhảy giữa các lỗi.</li>
<li>GoAccess: báo cáo lưu lượng chia sẻ được trong một lệnh.</li>
<li>SQL trên log: SQLite trong Python chạy được mọi nơi; DuckDB cho dữ liệu lớn.</li>
<li>Bảng tính cho người không dùng terminal — xuất CSV nhỏ, đã che.</li>
<li>Chọn công cụ theo câu hỏi và người đọc, không theo thói quen.</li>
</ul>
${nguon('📗', 'lnav — The Logfile Navigator', 'Định dạng, gộp dòng thời gian, bộ lọc, SQL', 'https://lnav.org/')}
${nguon('📗', 'GoAccess', 'Phân tích log web thời gian thực, output terminal và HTML', 'https://goaccess.io/')}
${nguon('📘', 'DuckDB — nhập CSV', 'Các tuỳ chọn read_csv dùng trong phác thảo', 'https://duckdb.org/docs/stable/data/csv/overview')}
${nguon('📘', 'Python — sqlite3', 'Mô-đun thư viện chuẩn mà sql-log.py dùng', 'https://docs.python.org/3/library/sqlite3.html')}
</div>
`,
};
