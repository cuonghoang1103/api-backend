/**
 * 1.2 — Giải phẫu một dòng log (soạn 22/11/2026).
 * Output: OUT['s01/giai-phau'] — năm dòng thật từ thư mục incident/ của gói log mẫu (Windows CSV, journald, nginx error, PostgreSQL, Node JSON).
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '1.2 — Anatomy of a log line: timestamp, host, source, level, message, context|||1.2 — Giải phẫu một dòng log: thời điểm, máy, nguồn, mức, thông điệp, ngữ cảnh',
  slug: 'log-1-2-giai-phau',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mổ năm dòng thật từ năm nguồn (Windows, journald, nginx, PostgreSQL, Node.js) ra sáu trường chung: thời điểm, máy, nguồn, mức, thông điệp, ngữ cảnh; câu hỏi 5W (ai, làm gì, lúc nào, ở đâu, kết quả); trường "ẩn" như PID, mã kết nối nginx, request id, correlation id dùng để nối các dòng; bài tập tự tách trường bằng mắt trước khi dùng công cụ.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>Anatomy of a log line: six fields that every source has, in different clothes</h2>
<p class="lead">Five programs, five formats, one outage. The lines below all describe the same afternoon in the sample pack — a database server that lost power. They look nothing alike, yet each one carries the same six pieces of information. Once you can see those six pieces in any line, a format you have never met before stops being scary.</p>

<h3>The everyday picture: a parcel label</h3>
<p>Every delivery company prints its label differently — different colours, different order, different barcodes. But you always find the same things: date, sender, receiver, address, weight, tracking number. A log line is a label for one event. Learn the fields, not the layout.</p>

<h3>The six fields</h3>
<table>
<thead><tr><th>Field</th><th>Question it answers</th><th>Typical names</th></tr></thead>
<tbody>
<tr><td><strong>Timestamp</strong></td><td>When?</td><td><code>time</code>, <code>@timestamp</code>, <code>TimeCreated</code>, the first column</td></tr>
<tr><td><strong>Host</strong></td><td>On which machine?</td><td><code>hostname</code>, <code>host</code>, <code>Computer</code></td></tr>
<tr><td><strong>Source</strong></td><td>Which program or component?</td><td><code>systemd[1]</code>, <code>sshd</code>, <code>ProviderName</code>, logger name</td></tr>
<tr><td><strong>Level</strong></td><td>How serious?</td><td><code>[error]</code>, <code>LOG:</code>, <code>level: 50</code>, Level = Error</td></tr>
<tr><td><strong>Message</strong></td><td>What happened, in words?</td><td><code>msg</code>, <code>message</code>, the rest of the line</td></tr>
<tr><td><strong>Context</strong></td><td>Details to act on and to connect lines</td><td>PID, user, client IP, request, error code, request id</td></tr>
</tbody></table>

<h3>Line 1 — Windows (exported with PowerShell to CSV)</h3>
${lenh('s01/giai-phau', 0)}
<ul>
<li><strong>Timestamp:</strong> <code>11/20/2026 2:07:30 PM</code> — US month/day order, 12-hour clock, and <em>no time zone</em>. Lesson 1.5 shows why that is dangerous.</li>
<li><strong>Host:</strong> not in this export at all — you must know which machine you exported from. Write it in your notes.</li>
<li><strong>Source:</strong> <code>Microsoft-Windows-Kernel-General</code> (the "provider"). <strong>Event ID</strong> <code>12</code> identifies the kind of event within that provider.</li>
<li><strong>Level:</strong> not exported here (it is Information). Exports lose fields: always check what was kept.</li>
<li><strong>Message:</strong> "The operating system started at system time 2026-11-20T07:07:28.5Z" — and the message itself contains a second, more precise timestamp, in UTC.</li>
</ul>

<h3>Line 2 — Linux journal (printed with <code>journalctl -o short-iso</code>)</h3>
${lenh('s01/giai-phau', 1)}
<ul>
<li><strong>Timestamp:</strong> <code>2026-11-20T14:09:02+07:00</code> — ISO 8601 with an offset. Unambiguous (but is the clock right? lesson 1.5).</li>
<li><strong>Host:</strong> <code>api-01</code> (the machine that runs the API). <strong>Source:</strong> <code>systemd[1]</code> — the program <code>systemd</code> with PID 1.</li>
<li><strong>Message:</strong> the unit <code>ctw-api.service</code> exited with <code>status=1/FAILURE</code>. The <em>subject</em> of the message (the API service) is not the source (systemd) — systemd is reporting about someone else.</li>
<li><strong>Level:</strong> hidden in this text form; the journal stores a numeric priority you can filter with <code>journalctl -p</code> (Chapter 7).</li>
</ul>

<h3>Line 3 — nginx error log</h3>
${lenh('s01/giai-phau', 2)}
<ul>
<li><strong>Timestamp:</strong> <code>2026/11/20 14:08:15</code> — the proxy server’s local time, no offset (and lesson 1.7 shows this clock is wrong).</li>
<li><strong>Level:</strong> <code>[error]</code>. <strong>Source:</strong> worker process <code>811#811</code> (PID#thread).</li>
<li><strong>Context — the part that matters:</strong> <code>*48213</code> is nginx's connection number (all lines about the same connection share it), <code>client: 192.0.2.31</code>, the <code>request</code>, and the <code>upstream</code> nginx was waiting for: the app on <code>10.0.0.30:4000</code> (api-01).</li>
<li><strong>Message:</strong> "upstream timed out (110: Connection timed out) while reading response header" — nginx is fine, <em>the app behind it</em> did not answer in time. That is how you know to look at the app next.</li>
</ul>

<h3>Line 4 — PostgreSQL</h3>
${lenh('s01/giai-phau', 3)}
<ul>
<li><strong>Timestamp:</strong> <code>2026-11-20 07:03:58.114 UTC</code> — milliseconds and an explicit zone, controlled by the server setting <code>log_timezone</code>.</li>
<li><strong>Source/context:</strong> <code>[1880]</code> is the backend process ID. The prefix of each line is configurable (<code>log_line_prefix</code>), so two PostgreSQL servers may print different prefixes.</li>
<li><strong>Level:</strong> <code>LOG</code> (PostgreSQL's own levels: DEBUG, INFO, NOTICE, WARNING, ERROR, LOG, FATAL, PANIC — lesson 1.3).</li>
</ul>

<h3>Line 5 — a Node.js app's JSON log (pretty-printed with <code>jq .</code>)</h3>
${lenh('s01/giai-phau', 4)}
<ul>
<li><strong>Timestamp:</strong> <code>1795158253088</code> — milliseconds since 1970 UTC (an "epoch"). Precise, but a human cannot read it — lesson 1.5 converts it.</li>
<li><strong>Level:</strong> <code>50</code> — the pino library's number for <em>error</em> (30 info, 40 warn, 60 fatal).</li>
<li><strong>Context:</strong> a nested <code>err</code> object with <code>code: ECONNREFUSED</code> and the address <code>10.0.0.20:5432</code> — the database's port. This one field connects the app's error to the PostgreSQL server in line 4.</li>
</ul>

<h3>The 5W questions — read every line with them</h3>
<table>
<thead><tr><th>Who?</th><th>Did what?</th><th>When?</th><th>Where?</th><th>Result?</th></tr></thead>
<tbody>
<tr><td>Client 192.0.2.31</td><td>GET /api/v1/feed</td><td>14:08:15 (proxy-01 local clock)</td><td>nginx on proxy-01 → app on api-01 :4000</td><td>Timed out</td></tr>
<tr><td>The API service</td><td>Exited</td><td>14:06:02+07:00</td><td>api-01</td><td>status 1, failure</td></tr>
<tr><td>The app (PID 2318)</td><td>Queried the database</td><td>epoch 1795158253088</td><td>api-01 → 10.0.0.20:5432</td><td>Connection refused</td></tr>
</tbody></table>
<p>If a line cannot answer "who" or "where", note that as a gap — gaps are findings too ("the export lost the host name").</p>

<h3>Hidden fields that connect lines</h3>
<ul>
<li><strong>PID</strong> — the same process across lines; a new PID after a crash tells you it restarted (the sample app goes from PID 2318 to 2741).</li>
<li><strong>Connection or session number</strong> — nginx's <code>*48213</code>, an SSH session, a database backend PID.</li>
<li><strong>Request id</strong> — one id per incoming request, printed by every line handling it (<code>reqId</code> in the sample <code>app/app.jsonl</code>).</li>
<li><strong>Correlation / trace id</strong> — the same id passed from service to service, so one search finds a request everywhere (Chapter 10 and the observability course).</li>
</ul>
<div class="pitfall co-tieu-de"><p><strong>The source is not always the subject.</strong> "systemd: ctw-api.service: Main process exited" is written by systemd about the API. "nginx: upstream timed out" is written by nginx about the app. Beginners blame the program in the source field; experienced readers ask "who is this line <em>about</em>?"</p></div>

<h3>🧪 Practice (20 min)</h3>
<div class="callout ok"><ol>
<li>In the pack, open <code>incident/postgresql.log</code> and <code>incident/journal-api01.txt</code> with <code>cat</code>. Without any tool, copy into your notebook a six-column table (timestamp, host, source, level, message, context) and fill it for every line of both files. Leave a cell empty with "—" when the field is missing.</li>
<li>Do the same for the three lines of <code>incident/nginx-error.log</code>, and circle the connection numbers.</li>
<li>Answer: which field in the app log points to the PostgreSQL server, and what is its value?</li>
</ol>
<p><strong>Done when:</strong> your table has 12 rows (5 + 4 + 3) with no field you could have filled left empty, and you answered <code>err.message</code> → <code>10.0.0.20:5432</code>.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['timestamp', 'The moment the event was recorded.'],
  ['host / hostname', 'The machine that produced the line.'],
  ['provider / source', 'The program or component that wrote the line.'],
  ['PID', 'Process ID — identifies one running process.'],
  ['upstream', 'The server behind a proxy (for nginx: your app).'],
  ['request id / correlation id', 'An id that ties all lines of one request together, even across services.'],
  ['epoch', 'Time as seconds or milliseconds since 1 January 1970 UTC.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Every log line carries timestamp, host, source, level, message and context — in different clothes.</li>
<li>Exports and text views can drop fields (host, level): note what is missing.</li>
<li>Read each line with 5W: who, did what, when, where, result.</li>
<li>PIDs, connection numbers, request ids and correlation ids are how you join lines into a story.</li>
<li>The source writes the line; the subject is who the line is about.</li>
</ul>
${nguon('📘', 'nginx — error_log and the format of error lines', 'Core module docs: error_log, levels', 'https://nginx.org/en/docs/ngx_core_module.html#error_log')}
${nguon('📘', 'PostgreSQL — Error Reporting and Logging', 'log_line_prefix, log_timezone, message severity levels', 'https://www.postgresql.org/docs/current/runtime-config-logging.html')}
${nguon('📗', 'pino — API (levels)', 'Numeric levels: trace 10, debug 20, info 30, warn 40, error 50, fatal 60', 'https://getpino.io/#/docs/api')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-15-2-request-id', title: 'Node.js 15.2 — request id', sub: 'How an app writes the request id you will search for here', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Giải phẫu một dòng log: sáu trường nguồn nào cũng có, chỉ khác áo</h2>
<p class="lead">Năm chương trình, năm định dạng, một sự cố. Các dòng dưới đây đều mô tả cùng một buổi chiều trong gói log mẫu — một máy chủ cơ sở dữ liệu bị mất điện. Chúng trông chẳng giống nhau chút nào, nhưng dòng nào cũng mang đúng sáu mẩu thông tin. Khi đã nhìn ra sáu mẩu đó trong một dòng bất kỳ, một định dạng chưa gặp bao giờ cũng hết đáng sợ.</p>

<h3>Liên tưởng đời thường: nhãn bưu kiện</h3>
<p>Mỗi hãng giao hàng in nhãn một kiểu — màu khác, thứ tự khác, mã vạch khác. Nhưng bao giờ cũng thấy cùng những thứ: ngày gửi, người gửi, người nhận, địa chỉ, cân nặng, mã vận đơn. Một dòng log là nhãn của một sự kiện. Học các trường, đừng học bố cục.</p>

<h3>Sáu trường</h3>
<table>
<thead><tr><th>Trường</th><th>Trả lời câu</th><th>Tên thường gặp</th></tr></thead>
<tbody>
<tr><td><strong>Timestamp (thời điểm)</strong></td><td>Lúc nào?</td><td><code>time</code>, <code>@timestamp</code>, <code>TimeCreated</code>, cột đầu tiên</td></tr>
<tr><td><strong>Host (máy)</strong></td><td>Trên máy nào?</td><td><code>hostname</code>, <code>host</code>, <code>Computer</code></td></tr>
<tr><td><strong>Source (nguồn)</strong></td><td>Chương trình hay thành phần nào?</td><td><code>systemd[1]</code>, <code>sshd</code>, <code>ProviderName</code>, tên logger</td></tr>
<tr><td><strong>Level (mức)</strong></td><td>Nghiêm trọng tới đâu?</td><td><code>[error]</code>, <code>LOG:</code>, <code>level: 50</code>, Level = Error</td></tr>
<tr><td><strong>Message (thông điệp)</strong></td><td>Chuyện gì xảy ra, nói bằng lời?</td><td><code>msg</code>, <code>message</code>, phần còn lại của dòng</td></tr>
<tr><td><strong>Context (ngữ cảnh)</strong></td><td>Chi tiết để hành động và để nối các dòng</td><td>PID, người dùng, IP máy khách, request, mã lỗi, request id</td></tr>
</tbody></table>

<h3>Dòng 1 — Windows (xuất bằng PowerShell ra CSV)</h3>
${lenh('s01/giai-phau', 0)}
<ul>
<li><strong>Thời điểm:</strong> <code>11/20/2026 2:07:30 PM</code> — kiểu Mỹ tháng/ngày, đồng hồ 12 giờ, và <em>không có múi giờ</em>. Bài 1.5 cho thấy vì sao điều đó nguy hiểm.</li>
<li><strong>Máy:</strong> không có trong bản xuất này — bạn phải tự biết đã xuất từ máy nào. Ghi vào sổ.</li>
<li><strong>Nguồn:</strong> <code>Microsoft-Windows-Kernel-General</code> ("provider" — nhà cung cấp sự kiện). <strong>Event ID</strong> <code>12</code> cho biết loại sự kiện bên trong provider đó.</li>
<li><strong>Mức:</strong> không được xuất ra ở đây (nó là Information). Xuất ra là mất trường: luôn kiểm xem cái gì còn giữ lại.</li>
<li><strong>Thông điệp:</strong> "The operating system started at system time 2026-11-20T07:07:28.5Z" — bản thân thông điệp chứa một mốc giờ thứ hai, chính xác hơn, theo UTC.</li>
</ul>

<h3>Dòng 2 — journal của Linux (in bằng <code>journalctl -o short-iso</code>)</h3>
${lenh('s01/giai-phau', 1)}
<ul>
<li><strong>Thời điểm:</strong> <code>2026-11-20T14:09:02+07:00</code> — ISO 8601 kèm độ lệch múi giờ. Không thể hiểu nhầm (nhưng đồng hồ có đúng không? bài 1.5).</li>
<li><strong>Máy:</strong> <code>api-01</code> (máy chạy API). <strong>Nguồn:</strong> <code>systemd[1]</code> — chương trình <code>systemd</code> có PID 1.</li>
<li><strong>Thông điệp:</strong> unit <code>ctw-api.service</code> đã thoát với <code>status=1/FAILURE</code>. <em>Chủ thể</em> của thông điệp (dịch vụ API) không phải nguồn (systemd) — systemd đang báo cáo về một chương trình khác.</li>
<li><strong>Mức:</strong> bị giấu trong dạng chữ này; journal lưu một mức ưu tiên dạng số mà bạn lọc được bằng <code>journalctl -p</code> (Chương 7).</li>
</ul>

<h3>Dòng 3 — error log của nginx</h3>
${lenh('s01/giai-phau', 2)}
<ul>
<li><strong>Thời điểm:</strong> <code>2026/11/20 14:08:15</code> — giờ địa phương của server proxy, không có độ lệch (và Lab 1.7 cho thấy đồng hồ này sai).</li>
<li><strong>Mức:</strong> <code>[error]</code>. <strong>Nguồn:</strong> tiến trình worker <code>811#811</code> (PID#luồng).</li>
<li><strong>Ngữ cảnh — phần đáng giá nhất:</strong> <code>*48213</code> là số thứ tự kết nối của nginx (mọi dòng về cùng một kết nối dùng chung số này), <code>client: 192.0.2.31</code>, <code>request</code>, và <code>upstream</code> (máy phía sau) mà nginx đang chờ: app ở <code>10.0.0.30:4000</code> (api-01).</li>
<li><strong>Thông điệp:</strong> "upstream timed out (110: Connection timed out) while reading response header" — nginx không sao, <em>app phía sau</em> không trả lời kịp. Nhờ thế bạn biết bước tiếp theo là xem app.</li>
</ul>

<h3>Dòng 4 — PostgreSQL</h3>
${lenh('s01/giai-phau', 3)}
<ul>
<li><strong>Thời điểm:</strong> <code>2026-11-20 07:03:58.114 UTC</code> — có mili giây và ghi rõ múi giờ, do tham số <code>log_timezone</code> của server quyết định.</li>
<li><strong>Nguồn/ngữ cảnh:</strong> <code>[1880]</code> là PID của tiến trình backend. Phần đầu mỗi dòng cấu hình được (<code>log_line_prefix</code>), nên hai server PostgreSQL có thể in phần đầu khác nhau.</li>
<li><strong>Mức:</strong> <code>LOG</code> (bộ mức riêng của PostgreSQL: DEBUG, INFO, NOTICE, WARNING, ERROR, LOG, FATAL, PANIC — bài 1.3).</li>
</ul>

<h3>Dòng 5 — log JSON của một app Node.js (in đẹp bằng <code>jq .</code>)</h3>
${lenh('s01/giai-phau', 4)}
<ul>
<li><strong>Thời điểm:</strong> <code>1795158253088</code> — số mili giây kể từ năm 1970 theo UTC (gọi là "epoch"). Chính xác, nhưng người không đọc được — bài 1.5 sẽ đổi nó.</li>
<li><strong>Mức:</strong> <code>50</code> — con số thư viện pino dùng cho <em>error</em> (30 info, 40 warn, 60 fatal).</li>
<li><strong>Ngữ cảnh:</strong> một đối tượng lồng <code>err</code> có <code>code: ECONNREFUSED</code> và địa chỉ <code>10.0.0.20:5432</code> — cổng của cơ sở dữ liệu. Chính trường này nối lỗi của app với server PostgreSQL ở dòng 4.</li>
</ul>

<h3>Bộ câu hỏi 5W — đọc dòng nào cũng hỏi</h3>
<table>
<thead><tr><th>Ai?</th><th>Làm gì?</th><th>Lúc nào?</th><th>Ở đâu?</th><th>Kết quả?</th></tr></thead>
<tbody>
<tr><td>Máy khách 192.0.2.31</td><td>GET /api/v1/feed</td><td>14:08:15 (đồng hồ của proxy-01)</td><td>nginx trên proxy-01 → app trên api-01 :4000</td><td>Hết thời gian chờ</td></tr>
<tr><td>Dịch vụ API</td><td>Thoát</td><td>14:06:02+07:00</td><td>api-01</td><td>status 1, thất bại</td></tr>
<tr><td>App (PID 2318)</td><td>Truy vấn CSDL</td><td>epoch 1795158253088</td><td>api-01 → 10.0.0.20:5432</td><td>Bị từ chối kết nối</td></tr>
</tbody></table>
<p>Dòng nào không trả lời được "ai" hay "ở đâu" thì ghi lại thành một lỗ hổng — lỗ hổng cũng là phát hiện ("bản xuất đã mất tên máy").</p>

<h3>Những trường ẩn dùng để nối các dòng</h3>
<ul>
<li><strong>PID</strong> — cùng một tiến trình qua nhiều dòng; PID mới sau một lần sập cho biết nó đã khởi động lại (app mẫu đi từ PID 2318 sang 2741).</li>
<li><strong>Số kết nối hay phiên</strong> — <code>*48213</code> của nginx, một phiên SSH, PID backend của CSDL.</li>
<li><strong>Request id</strong> — mỗi request đi vào có một mã, mọi dòng xử lý nó đều in ra (<code>reqId</code> trong <code>app/app.jsonl</code> của gói mẫu).</li>
<li><strong>Correlation id / trace id (mã liên kết)</strong> — cùng một mã truyền từ dịch vụ này sang dịch vụ khác, nên một lần tìm là thấy request ấy ở mọi nơi (Chương 10 và khoá observability).</li>
</ul>
<div class="pitfall co-tieu-de"><p><strong>Nguồn chưa chắc là chủ thể.</strong> "systemd: ctw-api.service: Main process exited" do systemd viết về API. "nginx: upstream timed out" do nginx viết về app. Người mới đổ lỗi cho chương trình ở trường nguồn; người có kinh nghiệm hỏi "dòng này nói <em>về</em> ai?".</p></div>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
<li>Trong gói mẫu, mở <code>incident/postgresql.log</code> và <code>incident/journal-api01.txt</code> bằng <code>cat</code>. Không dùng công cụ nào, chép vào sổ một bảng sáu cột (thời điểm, máy, nguồn, mức, thông điệp, ngữ cảnh) và điền cho mọi dòng của cả hai tệp. Trường nào không có thì ghi "—".</li>
<li>Làm tương tự với ba dòng của <code>incident/nginx-error.log</code>, và khoanh tròn các số kết nối.</li>
<li>Trả lời: trường nào trong log của app chỉ tới server PostgreSQL, và giá trị là gì?</li>
</ol>
<p><strong>Đạt khi:</strong> bảng của bạn có 12 hàng (5 + 4 + 3) và không bỏ trống trường nào lẽ ra điền được, và bạn trả lời được <code>err.message</code> → <code>10.0.0.20:5432</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['timestamp (thời điểm)', 'Lúc sự kiện được ghi lại.'],
  ['host / hostname (máy)', 'Máy đã sinh ra dòng log.'],
  ['provider / source (nguồn)', 'Chương trình hay thành phần đã viết dòng log.'],
  ['PID (mã tiến trình)', 'Số định danh một tiến trình đang chạy.'],
  ['upstream (máy phía sau)', 'Server đứng sau một proxy (với nginx: chính là app của bạn).'],
  ['request id / correlation id', 'Mã gắn mọi dòng của cùng một request với nhau, kể cả qua nhiều dịch vụ.'],
  ['epoch', 'Thời gian tính bằng giây hoặc mili giây kể từ 01/01/1970 UTC.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Dòng log nào cũng mang thời điểm, máy, nguồn, mức, thông điệp và ngữ cảnh — chỉ khác áo.</li>
<li>Bản xuất và dạng hiển thị chữ có thể làm rơi trường (máy, mức): ghi lại cái gì bị thiếu.</li>
<li>Đọc dòng nào cũng hỏi 5W: ai, làm gì, lúc nào, ở đâu, kết quả.</li>
<li>PID, số kết nối, request id và correlation id là cách nối các dòng thành một câu chuyện.</li>
<li>Nguồn là người viết dòng; chủ thể là người mà dòng nói tới.</li>
</ul>
${nguon('📘', 'nginx — error_log và dạng dòng lỗi', 'Tài liệu module: error_log, các mức', 'https://nginx.org/en/docs/ngx_core_module.html#error_log')}
${nguon('📘', 'PostgreSQL — Error Reporting and Logging', 'log_line_prefix, log_timezone, các mức nghiêm trọng', 'https://www.postgresql.org/docs/current/runtime-config-logging.html')}
${nguon('📗', 'pino — API (các mức)', 'Mức dạng số: trace 10, debug 20, info 30, warn 40, error 50, fatal 60', 'https://getpino.io/#/docs/api')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-15-2-request-id', title: 'Node.js 15.2 — request id', sub: 'App ghi request id thế nào để ở đây bạn tìm theo nó' })}
</div>
`,
};
