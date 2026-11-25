/**
 * 10.4 — Log ứng dụng Node.js từ phía người đọc (soạn 24/11/2026).
 * Output thật: OUT['s10/node-doc'] (jq 1.7 trên logs/app.log của Lab 10 — pino 9 + pino-http 10, Node 22) và OUT['s10/node-host']
 * (chạy trong container lgz-node: pino-pretty 13, winston 3.19, lỗi EADDRINUSE / ECONNREFUSED / ENOTFOUND / connect timeout thật).
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '10.4 — Node.js application logs from the reader side: pino/winston JSON, stack traces, unhandled errors, request id|||10.4 — Log ứng dụng Node.js từ phía người đọc: JSON của pino/winston, stack trace, lỗi không bắt, request id',
  slug: 'log-10-4-log-node',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Đọc log thật của app Node.js trong Lab 10: mức số của pino (30/40/50) và mức chữ của winston, vì sao jq dừng giữa chừng khi tệp trộn JSON với stack trace, đọc stack trace Node (dòng đầu, tệp của bạn vs node:internal, "caused by"), tiến trình sập vì Promise bị từ chối không ai bắt, các mã lỗi hệ thống EADDRINUSE/ECONNREFUSED/ENOTFOUND/timeout, lần theo một request id từ nginx sang app, đọc bằng pino-pretty.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.4</span>
<h2>Node.js logs: from "500" in nginx to the exact line of code</h2>
<p class="lead">In 10.1 nginx told you <em>that</em> requests failed (500, 502). The app log tells you <em>why</em>. Modern Node apps log JSON through <strong>pino</strong> or <strong>winston</strong>; when they crash, Node itself prints a plain-text stack trace into the same stream. This lesson reads both, on the app log the Lab 10 traffic produced. Writing good logs in Node is taught in the Node.js course; here we read.</p>

<h3>The everyday picture: the parcel tracking number</h3>
<p>You order a parcel. The shop, the warehouse, the truck and the post office each write their own notes, but every note carries the same tracking number. When the parcel is lost, you type that number once and see the whole journey. A <strong>request id</strong> is the tracking number of one web request: nginx creates it, passes it to the app, and both logs carry it.</p>

<h3>Step 1 — the shape of a pino line, and the numeric levels</h3>
${lenh('s10/node-doc', 0)}
${lenh('s10/node-doc', 3)}
<p>pino writes levels as numbers: <strong>10 trace, 20 debug, 30 info, 40 warn, 50 error, 60 fatal</strong>. <code>time</code> is epoch milliseconds (lesson 1.5). Numbers let you filter "warn and above" with <code>.level &gt;= 40</code>. Here: 351 info, 26 warn (13 failed logins × 2 lines), 58 error. winston writes the same event with text levels — compare:</p>
${lenh('s10/node-host', 1)}
${lenh('s10/node-host', 2)}
<p>Same facts, different names: <code>level</code> 50 vs <code>"error"</code>, <code>msg</code> vs <code>message</code>, <code>time</code> (epoch ms) vs <code>timestamp</code> (ISO string). Before writing a query on a project, look at one line and learn its dialect. Lesson 10.8 shows how teams agree on one dialect.</p>

<h3>Step 2 — why jq stops halfway</h3>
${lenh('s10/node-doc', 1)}
${lenh('s10/node-doc', 2)}
<p>jq found 8 error messages, then died at line 109: <em>Invalid numeric literal</em>. Line 109 is not JSON — it is part of a crash report Node printed in plain text (13 such lines). If you trust the first command, you miss everything after the crash. The fix from lesson 2.4: read lines raw and parse only what parses.</p>
${lenh('s10/node-doc', 4)}

<h3>Step 3 — reading a Node stack trace</h3>
${lenh('s10/node-doc', 5)}
<ul>
<li><strong>First line = type + message</strong>: <code>TypeError: fetch failed</code>. Vague on purpose — the real reason is in the <strong><code>caused by:</code></strong> part: <code>connect ECONNREFUSED 127.0.0.1:41999</code> (the inventory service is not running).</li>
<li><strong>Frames</strong> (<code>at …</code>) go from where the error was thrown outward. Skip frames in <code>node:internal/…</code> and <code>node_modules/…</code>; the first frame in <em>your</em> file is where to look: <code>at async route (/w/app.js:36:17)</code> = file <code>app.js</code>, line 36, column 17 — the <code>fetch</code> call.</li>
<li><code>async</code> in a frame means Node stitched the call chain across an <code>await</code>; without async/await, stack traces of callbacks often stop at the event loop and never reach your code.</li>
</ul>

<h3>Step 4 — the crash: an unhandled promise rejection</h3>
${lenh('s10/node-doc', 6)}
<p>This is not JSON because it was not written by pino — Node printed it to stderr while dying. Read it top-down: the file and line (<code>/w/app.js:44</code>), the source line with a caret under the problem, the error, its stack, and the Node version. The bug: <code>Promise.reject(...)</code> with no <code>await</code> and no <code>.catch</code>. Since Node 15, an <strong>unhandled rejection crashes the whole process</strong> by default — one forgotten <code>await</code> on one route took down every route. The next line comes from the supervisor (our <code>while true</code> loop; in production systemd, Docker <code>restart:</code> or pm2):</p>
${lenh('s10/node-doc', 9)}
${lenh('s10/node-doc', 10)}
<p>Crash at 20:35:01, back at 20:35:04 — and nginx logged 20 × 502 in exactly those four seconds. Three logs, one story: app.log (why), supervisor line (when it restarted), access.log (who was hurt).</p>
<div class="pitfall co-tieu-de"><p><strong>"It restarted by itself, so it is fine."</strong> No. Every crash drops all in-flight requests (the first 502 died mid-answer) and the bug is still there. Count supervisor lines per day; a restart loop shows up as hundreds of them.</p></div>

<h3>Step 5 — follow one request across nginx and the app</h3>
${lenh('s10/node-doc', 7)}
${lenh('s10/node-doc', 8)}
<p>nginx generated <code>$request_id</code>, sent it as <code>X-Request-Id</code>, and <code>pino-http</code> used it as <code>req.id</code> (<code>genReqId</code> in <code>app.js</code>). So one grep finds the access line (500, 30 ms) and the two app lines: the cause (<em>inventory call failed</em>, ECONNREFUSED) and pino-http's summary (<em>request errored</em>, 500, 29 ms). Without a shared id you would match by timestamp and hope. Across several services the same idea is called trace context — taught in the observability course.</p>

<h3>Step 6 — pino-pretty, for human eyes only</h3>
${lenh('s10/node-host', 0)}
<p><code>pino-pretty</code> turns JSON into readable blocks — great in a terminal while you develop or debug. Never write logs <em>to files</em> in pretty format in production: you lose one-line-per-event and every tool in this course stops working. Store JSON; prettify when reading.</p>

<h3>Step 7 — the system error codes you must recognise</h3>
${lenh('s10/node-host', 3)}
${lenh('s10/node-host', 5)}
${lenh('s10/node-host', 6)}
${lenh('s10/node-host', 4)}
<table>
<thead><tr><th>Code</th><th>Means</th><th>Typical cause at work</th></tr></thead>
<tbody>
<tr><td><code>EADDRINUSE</code></td><td>The port is already taken</td><td>Old process still running; two instances; another app on 3000</td></tr>
<tr><td><code>ECONNREFUSED</code></td><td>Host reachable, nothing listening on that port</td><td>DB/Redis/other service down; wrong port; <code>localhost</code> inside a container means the container itself</td></tr>
<tr><td><code>ENOTFOUND</code></td><td>DNS name does not resolve</td><td>Typo in host name; missing env variable; service name only exists inside Docker network</td></tr>
<tr><td><code>ETIMEDOUT</code> / <code>UND_ERR_CONNECT_TIMEOUT</code></td><td>No answer at all within the time limit</td><td>Firewall dropping packets, wrong IP, security group</td></tr>
<tr><td><code>ECONNRESET</code></td><td>The other side closed the connection abruptly</td><td>Upstream crashed, proxy timeout, keep-alive mismatch</td></tr>
<tr><td><code>EACCES</code> / <code>EPERM</code></td><td>Permission denied</td><td>Port &lt; 1024 without root; file owned by another user</td></tr>
<tr><td><code>EMFILE</code></td><td>Too many open files</td><td>Leaking sockets/files; ulimit too low</td></tr>
</tbody></table>
<p>"Refused" vs "timeout" is the most useful distinction: refused = something answered "no" fast (the host is there, the service is not); timeout = silence (network, firewall, wrong address).</p>

<h3>Hacker's corner: what an attacker hopes your Node logs contain</h3>
<p>Look at <code>app.js</code>: pino's <code>redact</code> removes <code>authorization</code> and <code>cookie</code> headers, and the login route logs only the <code>user</code>, never the body. pino-http logs request headers by default — without redaction every bearer token and session cookie would land in the log file, and anyone who can read logs (a support tool, a log SaaS, a leaked backup) could impersonate users. Twitter (May 2018) had to ask all of its roughly 330 million users to change passwords because a bug wrote passwords to an internal log before hashing them. Full story and the rules: lesson 16.3.</p>

<h3>Real-life situations</h3>
<ul>
<li><strong>OJT, first on-call week:</strong> Slack alert "502 spike 20:35". You open the app log, grep <code>supervisor</code> (or <code>docker inspect --format '{{.RestartCount}}'</code>), find the crash and the stack frame <code>app.js:44</code>, and post: "unhandled rejection in route X, crash-restarted at 20:35:01, 20 failed requests over 4 s, fix: add await/catch; PR coming". That message is the whole job.</li>
<li><strong>Your own project:</strong> "works on my machine, ECONNREFUSED in Docker". Inside a container, <code>localhost:5432</code> is the container itself, not your PostgreSQL. Use the service name (<code>db:5432</code>).</li>
<li><strong>What if</strong> the app logs nothing at all while nginx shows 500s? Check the log level (<code>LOG_LEVEL=error</code> hides info), whether stdout is redirected anywhere, and whether the process is the one you think (<code>EADDRINUSE</code> on the new one, the old one still serving).</li>
</ul>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok"><ol>
<li>Pick any 502 from your <code>access.log</code>; find its request id in <code>app.log</code>. Explain why there is (or is not) a matching app line.</li>
<li>Count error records per <code>req.url</code> pattern (use <code>fromjson?</code>, <code>sub("[0-9]+$"; ":id")</code>).</li>
<li>Run <code>docker exec lgz-node node -e "require('net').connect(5432, 'db')"</code> and classify the error with the table.</li>
<li>Remove <code>'req.headers.authorization'</code> from <code>redact</code>, restart, call <code>curl -H 'Authorization: Bearer GIA_TOKEN·VIDU' http://127.0.0.1:41080/api/products</code> and find the token in the log. Then put the redaction back.</li>
</ol>
<p><strong>Done when:</strong> 1 explains that a 502 has no app line: the app was dead or died before pino-http could write the summary; 2 gives 58 error lines for <code>/api/orders/:id</code> — 29 failed requests × 2 lines (the cause + pino-http's summary); keep only <code>msg == "request errored"</code> to count 29 requests; 3 is ENOTFOUND; 4 shows the token in clear text and then <code>"[Redacted]"</code>.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['pino levels', '10 trace, 20 debug, 30 info, 40 warn, 50 error, 60 fatal.'],
  ['stack trace', 'List of call frames from where an error was thrown outward; read your own first frame.'],
  ['caused by', 'Nested original error (Error.cause); usually holds the real reason.'],
  ['unhandled rejection', 'A rejected Promise nobody awaited or caught; crashes Node ≥ 15 by default.'],
  ['request id', 'Id carried by every log line of one request across proxy and app (X-Request-Id).'],
  ['redaction', 'Replacing sensitive fields (tokens, cookies) before the line is written.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Learn the dialect: pino = numeric level + <code>msg</code> + epoch ms; winston = text level + <code>message</code> + ISO time.</li>
<li>Log files mix JSON and crash text — use <code>jq -R 'fromjson?'</code> and count what was skipped.</li>
<li>Stack trace: message, then <code>caused by</code>, then the first frame in your own file.</li>
<li>Unhandled rejection = whole process dies = burst of 502; supervisor restart is not a fix.</li>
<li>Same request id in nginx and app turns guessing into one grep.</li>
<li>REFUSED = nobody listening; TIMEOUT = silence; NOTFOUND = DNS; ADDRINUSE = port taken.</li>
</ul>
${nguon('📘', 'pino documentation', 'Levels, redaction, child loggers, pino-http, pino-pretty', 'https://getpino.io/')}
${nguon('📘', 'winston on GitHub', 'Formats, transports, levels', 'https://github.com/winstonjs/winston')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-15-1-log-co-cau-truc', title: 'Node.js 15.1 — Structured logging', sub: 'Writing these logs in your own app', cta: 'Open lesson' })}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-15-2-request-id', title: 'Node.js 15.2 — Request id', sub: 'AsyncLocalStorage and passing the id everywhere', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.4</span>
<h2>Log Node.js: từ cái "500" trong nginx tới đúng dòng mã</h2>
<p class="lead">Ở bài 10.1, nginx cho bạn biết <em>rằng</em> request đã hỏng (500, 502). Log của app cho bạn biết <em>vì sao</em>. App Node đời mới ghi log JSON qua <strong>pino</strong> hoặc <strong>winston</strong>; khi sập, chính Node in một stack trace dạng chữ thường vào cùng luồng đó. Bài này đọc cả hai, trên log app mà lưu lượng Lab 10 đã sinh ra. Cách viết log tốt trong Node được dạy ở khoá Node.js; ở đây ta đọc.</p>

<h3>Liên tưởng đời thường: mã vận đơn</h3>
<p>Bạn đặt một món hàng. Cửa hàng, kho, xe tải và bưu cục ghi chép riêng, nhưng ghi chép nào cũng có cùng mã vận đơn. Khi hàng thất lạc, bạn gõ mã đó một lần là thấy cả hành trình. <strong>Request id</strong> là mã vận đơn của một request web: nginx tạo ra, chuyển cho app, và cả hai log đều mang nó.</p>

<h3>Bước 1 — hình dạng một dòng pino, và mức bằng số</h3>
${lenh('s10/node-doc', 0)}
${lenh('s10/node-doc', 3)}
<p>pino ghi mức bằng số: <strong>10 trace, 20 debug, 30 info, 40 warn, 50 error, 60 fatal</strong>. <code>time</code> là epoch mili giây (bài 1.5). Dùng số thì lọc "từ warn trở lên" bằng <code>.level &gt;= 40</code>. Ở đây: 351 info, 26 warn (13 lần đăng nhập hỏng × 2 dòng), 58 error. winston ghi cùng sự kiện bằng mức chữ — so sánh:</p>
${lenh('s10/node-host', 1)}
${lenh('s10/node-host', 2)}
<p>Cùng sự thật, khác tên: <code>level</code> 50 so với <code>"error"</code>, <code>msg</code> so với <code>message</code>, <code>time</code> (epoch ms) so với <code>timestamp</code> (chuỗi ISO). Trước khi viết truy vấn cho một dự án, nhìn một dòng và học phương ngữ của nó. Bài 10.8 cho thấy các đội thống nhất một phương ngữ thế nào.</p>

<h3>Bước 2 — vì sao jq dừng giữa chừng</h3>
${lenh('s10/node-doc', 1)}
${lenh('s10/node-doc', 2)}
<p>jq tìm thấy 8 thông điệp lỗi, rồi chết ở dòng 109: <em>Invalid numeric literal</em>. Dòng 109 không phải JSON — nó là một phần báo cáo sập mà Node in ra dạng chữ thường (13 dòng như vậy). Nếu tin lệnh đầu, bạn bỏ lỡ mọi thứ sau cú sập. Cách sửa từ bài 2.4: đọc dòng thô và chỉ phân tích những dòng phân tích được.</p>
${lenh('s10/node-doc', 4)}

<h3>Bước 3 — đọc stack trace của Node</h3>
${lenh('s10/node-doc', 5)}
<ul>
<li><strong>Dòng đầu = loại + thông điệp</strong>: <code>TypeError: fetch failed</code>. Mơ hồ có chủ ý — lý do thật nằm ở phần <strong><code>caused by:</code></strong>: <code>connect ECONNREFUSED 127.0.0.1:41999</code> (dịch vụ kho không chạy).</li>
<li><strong>Các khung</strong> (<code>at …</code>) đi từ chỗ lỗi bị ném ra phía ngoài. Bỏ qua khung trong <code>node:internal/…</code> và <code>node_modules/…</code>; khung đầu tiên thuộc tệp <em>của bạn</em> là chỗ cần nhìn: <code>at async route (/w/app.js:36:17)</code> = tệp <code>app.js</code>, dòng 36, cột 17 — lời gọi <code>fetch</code>.</li>
<li>Chữ <code>async</code> trong khung nghĩa là Node đã nối chuỗi lời gọi qua một <code>await</code>; không dùng async/await thì stack trace của callback thường dừng ở vòng lặp sự kiện và không bao giờ chạm tới mã của bạn.</li>
</ul>

<h3>Bước 4 — cú sập: Promise bị từ chối không ai bắt</h3>
${lenh('s10/node-doc', 6)}
<p>Đây không phải JSON vì pino không viết nó — Node in ra stderr lúc đang chết. Đọc từ trên xuống: tệp và dòng (<code>/w/app.js:44</code>), dòng mã nguồn có dấu mũ chỉ vào chỗ hỏng, lỗi, stack của nó, và phiên bản Node. Lỗi: <code>Promise.reject(...)</code> không có <code>await</code> cũng không có <code>.catch</code>. Từ Node 15, <strong>một rejection không ai xử lý làm sập cả tiến trình</strong> theo mặc định — một chữ <code>await</code> bị quên ở một route kéo sập mọi route. Dòng kế tiếp đến từ bộ giám sát (vòng <code>while true</code> của ta; ngoài thực tế là systemd, <code>restart:</code> của Docker hay pm2):</p>
${lenh('s10/node-doc', 9)}
${lenh('s10/node-doc', 10)}
<p>Sập lúc 20:35:01, sống lại lúc 20:35:04 — và nginx ghi 20 lần 502 đúng trong bốn giây đó. Ba log, một câu chuyện: app.log (vì sao), dòng supervisor (khi nào khởi động lại), access.log (ai bị ảnh hưởng).</p>
<div class="pitfall co-tieu-de"><p><strong>"Nó tự khởi động lại rồi, ổn mà."</strong> Không. Mỗi lần sập đánh rơi mọi request đang xử lý (cái 502 đầu tiên chết giữa lúc trả lời) và lỗi vẫn còn đó. Đếm số dòng supervisor mỗi ngày; một vòng lặp khởi động lại sẽ hiện thành hàng trăm dòng.</p></div>

<h3>Bước 5 — lần theo một request qua nginx và app</h3>
${lenh('s10/node-doc', 7)}
${lenh('s10/node-doc', 8)}
<p>nginx sinh <code>$request_id</code>, gửi đi dưới dạng <code>X-Request-Id</code>, và <code>pino-http</code> dùng nó làm <code>req.id</code> (<code>genReqId</code> trong <code>app.js</code>). Thế là một lệnh grep tìm được dòng access (500, 30 ms) và hai dòng của app: nguyên nhân (<em>inventory call failed</em>, ECONNREFUSED) và bản tóm tắt của pino-http (<em>request errored</em>, 500, 29 ms). Không có id chung thì bạn phải ghép theo giờ rồi cầu may. Qua nhiều dịch vụ, cùng ý tưởng này được gọi là trace context — dạy ở khoá observability.</p>

<h3>Bước 6 — pino-pretty, chỉ dành cho mắt người</h3>
${lenh('s10/node-host', 0)}
<p><code>pino-pretty</code> biến JSON thành khối dễ đọc — rất tiện trong terminal lúc phát triển hay gỡ lỗi. Đừng bao giờ ghi log <em>vào tệp</em> ở dạng pretty trên production: bạn mất "mỗi sự kiện một dòng" và mọi công cụ trong khoá này ngừng hoạt động. Lưu JSON; làm đẹp khi đọc.</p>

<h3>Bước 7 — các mã lỗi hệ thống phải nhận ra ngay</h3>
${lenh('s10/node-host', 3)}
${lenh('s10/node-host', 5)}
${lenh('s10/node-host', 6)}
${lenh('s10/node-host', 4)}
<table>
<thead><tr><th>Mã</th><th>Nghĩa</th><th>Nguyên nhân hay gặp khi đi làm</th></tr></thead>
<tbody>
<tr><td><code>EADDRINUSE</code></td><td>Cổng đã có người dùng</td><td>Tiến trình cũ chưa tắt; chạy hai bản; app khác đang chiếm 3000</td></tr>
<tr><td><code>ECONNREFUSED</code></td><td>Tới được máy, nhưng không có gì lắng nghe ở cổng đó</td><td>DB/Redis/dịch vụ khác đang tắt; sai cổng; <code>localhost</code> trong container là chính container đó</td></tr>
<tr><td><code>ENOTFOUND</code></td><td>Tên miền không phân giải được</td><td>Gõ sai tên máy; thiếu biến môi trường; tên dịch vụ chỉ tồn tại trong mạng Docker</td></tr>
<tr><td><code>ETIMEDOUT</code> / <code>UND_ERR_CONNECT_TIMEOUT</code></td><td>Hoàn toàn không có trả lời trong thời hạn</td><td>Tường lửa bỏ gói, sai IP, security group</td></tr>
<tr><td><code>ECONNRESET</code></td><td>Phía bên kia đóng kết nối đột ngột</td><td>Upstream sập, proxy hết giờ, lệch keep-alive</td></tr>
<tr><td><code>EACCES</code> / <code>EPERM</code></td><td>Không đủ quyền</td><td>Cổng &lt; 1024 mà không phải root; tệp thuộc người dùng khác</td></tr>
<tr><td><code>EMFILE</code></td><td>Mở quá nhiều tệp</td><td>Rò socket/tệp; ulimit quá thấp</td></tr>
</tbody></table>
<p>"Refused" khác "timeout" là phân biệt có ích nhất: refused = có cái gì đó trả lời "không" rất nhanh (máy có đó, dịch vụ thì không); timeout = im lặng (mạng, tường lửa, sai địa chỉ).</p>

<h3>Góc hacker: kẻ tấn công mong log Node của bạn chứa gì</h3>
<p>Nhìn <code>app.js</code>: <code>redact</code> của pino xoá header <code>authorization</code> và <code>cookie</code>, còn route đăng nhập chỉ log <code>user</code>, không bao giờ log body. pino-http mặc định ghi cả header của request — không che thì mọi bearer token và cookie phiên đều rơi vào tệp log, và bất kỳ ai đọc được log (công cụ hỗ trợ khách hàng, dịch vụ log thuê ngoài, bản sao lưu bị lộ) đều mạo danh được người dùng. Twitter (tháng 5/2018) đã phải khuyên toàn bộ khoảng 330 triệu người dùng đổi mật khẩu vì một lỗi ghi mật khẩu vào log nội bộ trước khi băm. Câu chuyện đầy đủ và các quy tắc: bài 16.3.</p>

<h3>Tình huống đời thật</h3>
<ul>
<li><strong>OJT, tuần trực đầu tiên:</strong> Slack báo "502 tăng vọt lúc 20:35". Bạn mở log app, grep <code>supervisor</code> (hoặc <code>docker inspect --format '{{.RestartCount}}'</code>), tìm ra cú sập và khung <code>app.js:44</code>, rồi đăng: "unhandled rejection ở route X, sập và khởi động lại lúc 20:35:01, 20 request hỏng trong 4 giây, cách sửa: thêm await/catch; PR đang tới". Tin nhắn đó chính là cả công việc.</li>
<li><strong>Dự án của bạn:</strong> "máy em chạy được, vào Docker thì ECONNREFUSED". Trong container, <code>localhost:5432</code> là chính container chứ không phải PostgreSQL của bạn. Dùng tên dịch vụ (<code>db:5432</code>).</li>
<li><strong>Nếu</strong> app không log gì cả trong khi nginx báo 500? Kiểm tra mức log (<code>LOG_LEVEL=error</code> giấu info), stdout có bị chuyển đi đâu không, và tiến trình đang chạy có đúng là cái bạn nghĩ không (bản mới bị <code>EADDRINUSE</code>, bản cũ vẫn đang phục vụ).</li>
</ul>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
<li>Chọn một dòng 502 bất kỳ trong <code>access.log</code>; tìm request id của nó trong <code>app.log</code>. Giải thích vì sao có (hoặc không có) dòng app tương ứng.</li>
<li>Đếm bản ghi lỗi theo mẫu <code>req.url</code> (dùng <code>fromjson?</code>, <code>sub("[0-9]+$"; ":id")</code>).</li>
<li>Chạy <code>docker exec lgz-node node -e "require('net').connect(5432, 'db')"</code> và phân loại lỗi bằng bảng trên.</li>
<li>Bỏ <code>'req.headers.authorization'</code> khỏi <code>redact</code>, khởi động lại, gọi <code>curl -H 'Authorization: Bearer GIA_TOKEN·VIDU' http://127.0.0.1:41080/api/products</code> và tìm token trong log. Sau đó trả lại dòng che.</li>
</ol>
<p><strong>Đạt khi:</strong> câu 1 giải thích được 502 không có dòng app: app đang chết, hoặc chết trước khi pino-http kịp ghi dòng tóm tắt; câu 2 ra 58 dòng lỗi cho <code>/api/orders/:id</code> — 29 request hỏng × 2 dòng (nguyên nhân + dòng tóm tắt của pino-http); chỉ giữ <code>msg == "request errored"</code> thì đếm ra 29 request; câu 3 là ENOTFOUND; câu 4 thấy token ở dạng rõ rồi sau đó là <code>"[Redacted]"</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['mức của pino', '10 trace, 20 debug, 30 info, 40 warn, 50 error, 60 fatal.'],
  ['stack trace', 'Danh sách khung lời gọi từ chỗ lỗi bị ném ra phía ngoài; đọc khung đầu tiên thuộc mã của bạn.'],
  ['caused by', 'Lỗi gốc lồng bên trong (Error.cause); thường chứa lý do thật.'],
  ['unhandled rejection', 'Promise bị từ chối mà không ai await hay catch; làm sập Node ≥ 15 theo mặc định.'],
  ['request id', 'Mã mà mọi dòng log của một request mang theo qua proxy và app (X-Request-Id).'],
  ['redaction (che)', 'Thay các trường nhạy cảm (token, cookie) trước khi dòng log được ghi.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Học phương ngữ: pino = mức số + <code>msg</code> + epoch ms; winston = mức chữ + <code>message</code> + giờ ISO.</li>
<li>Tệp log trộn JSON với chữ của cú sập — dùng <code>jq -R 'fromjson?'</code> và đếm số dòng bị bỏ qua.</li>
<li>Stack trace: thông điệp, rồi <code>caused by</code>, rồi khung đầu tiên trong tệp của bạn.</li>
<li>Unhandled rejection = cả tiến trình chết = một loạt 502; tự khởi động lại không phải là sửa lỗi.</li>
<li>Cùng request id ở nginx và app biến đoán mò thành một lệnh grep.</li>
<li>REFUSED = không ai lắng nghe; TIMEOUT = im lặng; NOTFOUND = DNS; ADDRINUSE = cổng bị chiếm.</li>
</ul>
${nguon('📘', 'Tài liệu pino', 'Mức log, redaction, child logger, pino-http, pino-pretty', 'https://getpino.io/')}
${nguon('📘', 'winston trên GitHub', 'Format, transport, mức log', 'https://github.com/winstonjs/winston')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-15-1-log-co-cau-truc', title: 'Node.js 15.1 — Log có cấu trúc', sub: 'Tự viết những log này trong app của bạn', cta: 'Mở bài' })}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-15-2-request-id', title: 'Node.js 15.2 — Request id', sub: 'AsyncLocalStorage và chuyền id đi khắp nơi', cta: 'Mở bài' })}
</div>
`,
};
