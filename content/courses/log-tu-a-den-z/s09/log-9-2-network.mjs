/**
 * 9.2 — Bảng Network đọc như access log phía người dùng (soạn 24/11/2026, agent lgz).
 * Output thật: OUT['s09/network'] — Chrome 150 headless + CDP Network.* (requestWillBeSent, responseReceived, loadingFinished/Failed:
 * đúng dữ liệu bảng Network vẽ ra), curl 8.18 -w, log máy chủ Lab 9 (logs/api.log, logs/app.log).
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '9.2 — The Network panel as a client-side access log: status, waterfall, timing phases, initiator, headers, Copy as cURL|||9.2 — Bảng Network là access log phía người dùng: mã trạng thái, thác thời gian, các pha thời gian, initiator, header, Copy as cURL',
  slug: 'log-9-2-network',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mỗi hàng trong bảng Network là một dòng access log nhìn từ phía trình duyệt. Đọc bảng thật của Lab 9: dòng preflight OPTIONS, "CORS error", initiator trỏ về dòng mã, kiểu ping của sendBeacon; thác thời gian lộ ra các lời gọi nối đuôi nhau; bộ lọc status-code:/larger-than:/domain:/method:; các pha Queueing–DNS–Initial connection–SSL–TTFB–Content Download và pha nào lớn thì nghi ai; header kể chuyện (X-Request-Id, WWW-Authenticate); Copy as cURL để tái hiện ngoài trình duyệt rồi lần request id sang log máy chủ; lần một lỗi 504 tới đúng dịch vụ chậm.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>Network: the access log, seen from the user's side</h2>
<p class="lead">Put a row of the Network panel next to a line of the nginx access log from Lesson 10.2 and you will see the same fields: method, URL, status, size, time, referer, user agent. The difference is the point of view. The server logs what <em>arrived</em>; the browser logs what it <em>tried</em> — including requests that never reached the server, requests it hid from the page, and how long each stage of the trip took. Diagnosing CORS, cache and throttling in depth is in the debugging course; this lesson reads the panel as a log.</p>

<h3>The everyday picture: a parcel's tracking page</h3>
<p>A courier's tracking page lists every leg: picked up 08:01, at sorting hub 08:40, out for delivery 13:10, delivered 13:55. If the parcel was late, you can see <em>which</em> leg was slow — the hub, not the truck. The Network panel's timing tab is that page for one HTTP request.</p>

<h3>Step 1 — read the table (Lab 9, same page as 9.1)</h3>
${lenh('s09/network', 0)}
<ul>
<li><strong>Name / Status / Type.</strong> <code>document</code> is the page, <code>script</code> and <code>image</code> come from the HTML parser (Initiator <code>(index)</code>), <code>fetch</code> rows come from our JavaScript, <code>ping</code> is <code>navigator.sendBeacon</code> (9.5). Status <code>CORS error</code> is not an HTTP code — it is DevTools telling you the browser blocked the response (9.1).</li>
<li><strong>OPTIONS rows.</strong> Every API call has a twin: a <strong>preflight</strong>. Our calls carry an <code>Authorization</code> header across origins, so the browser first asks the API "may I?" with <code>OPTIONS</code>. In the server's access log you will see twice as many lines as fetches; that is normal, not an attack.</li>
<li><strong>Initiator</strong> <code>app.js:18</code> = the <code>fetch</code> inside our <code>goi()</code> helper. Clicking it in DevTools jumps to the code; hovering shows the full call stack ("who asked for this request?").</li>
<li><strong>Size and Time.</strong> Size is bytes over the wire (headers + compressed body); Time is from start to last byte.</li>
<li><strong>Waterfall.</strong> <code>slow</code> starts only after <code>report</code> finished: the code <code>await</code>s each call in turn. Two seconds of waiting that the user feels, visible at a glance — the fix (start independent calls together with <code>Promise.all</code>) comes straight from this column.</li>
</ul>
<p>Filters (type in the filter box; several properties = AND, no OR): <code>status-code:504</code>, <code>larger-than:1000</code> (bytes; <code>1k</code> works), <code>domain:api.lgz.test</code>, <code>method:POST</code>, <code>-method:OPTIONS</code> to hide preflights, <code>mime-type:application/json</code>, <code>has-response-header:set-cookie</code>, <code>is:running</code> for open WebSockets; and the type buttons <em>Fetch/XHR, JS, CSS, Img…</em>. Keep <strong>Preserve log</strong> and <strong>Disable cache</strong> in mind: without the first, a redirect wipes the rows; without the second, repeat visits come from cache and hide the bug.</p>

<h3>Step 2 — the timing phases, and whom to suspect</h3>
${lenh('s09/network', 2)}
<p>802 ms waiting for the first byte, 1 ms downloading, connection reused: the network is innocent, the <strong>server</strong> took 0.8 s to think. A brand-new HTTPS connection shows the other phases; curl measures the same legs on our self-signed HTTPS port:</p>
${lenh('s09/network', 1)}
<table>
<thead><tr><th>Phase (DevTools Timing tab)</th><th>What happens</th><th>Large ⇒ suspect</th></tr></thead>
<tbody>
<tr><td>Queueing / Stalled</td><td>Waiting before a connection is free</td><td>HTTP/1.1 limit of 6 connections per origin, many requests at once, low priority</td></tr>
<tr><td>DNS Lookup</td><td>Name → IP</td><td>Slow resolver, VPN/corporate DNS, first visit</td></tr>
<tr><td>Initial connection / SSL</td><td>TCP handshake, TLS handshake</td><td>Far server, packet loss, a TLS-inspecting proxy or antivirus</td></tr>
<tr><td>Request sent</td><td>Uploading the request</td><td>Big upload on a slow link</td></tr>
<tr><td>Waiting for server response (TTFB)</td><td>Server working</td><td>The backend: slow query, slow dependency, timeouts — go to the server log (<code>rt=</code>, Lesson 10.2)</td></tr>
<tr><td>Content Download</td><td>Receiving the body</td><td>Large response, no compression, slow link</td></tr>
</tbody></table>
<p>Our numbers: DNS 12 µs (the name is mapped locally), TCP 0.1 ms, TLS done at 3.2 ms, first byte at 3.7 ms — on a real site across the Internet each leg is tens of milliseconds, and the table tells you which one to attack.</p>

<h3>Step 3 — headers that tell a story</h3>
<p>In the request headers of Step 2: <code>Authorization</code> (who the browser claims to be), <code>Origin</code> and <code>Referer</code> (which page asked). In the response: <code>X-Request-Id</code> — the server's tracking number, readable by our page only because the API sends <code>Access-Control-Expose-Headers: X-Request-Id</code>. On real sites also look for <code>Server</code>, <code>Via</code>, <code>X-Cache</code>, <code>CF-Ray</code> (which CDN/proxy answered — Lesson 13.3), <code>Cache-Control</code>/<code>Age</code> (was this from a cache?) and <code>WWW-Authenticate</code> (why authentication failed).</p>

<h3>Step 4 — Copy as cURL: take the request out of the browser</h3>
${lenh('s09/network', 3)}
<p>Right-click a row → Copy → <strong>Copy as cURL (bash)</strong> gives you this. Now you can replay the exact request in a terminal, change one thing at a time, and send it to the backend team. First, look inside the token — a JWT's middle part is just base64:</p>
${lenh('s09/network', 4)}
<p><code>exp: 1795392000</code> is 23/11/2026 00:00 UTC — yesterday. Replay:</p>
${lenh('s09/network', 5)}
<p>The page only showed "401". The full response says why: <code>WWW-Authenticate: Bearer error="invalid_token", error_description="The access token expired"</code>. And it carries the tracking number. Take it to the server:</p>
${lenh('s09/network', 6)}
<p>One id, two server logs: access line (401, from curl) and the app's warning <em>token hết hạn</em>. This is the handover you do every week at work: "request id <code>0efc4682…</code>, 23:30:53 UTC, 401 invalid_token" is a ticket a backend developer can solve in a minute; "login is broken" is not.</p>

<h3>Step 5 — following the 504 to the slow service</h3>
${lenh('s09/network', 7)}
<p>Browser: 504 after 2005 ms. Access log: 504 with <code>rt=2.003</code>. App log: <em>upstream timed out (2000 ms) calling report-svc</em>. A 2-second timeout fired in the gateway because the service behind it needs 5 s. Who to call is now obvious — the report service, not the front-end and not the network. (What 502/503/504 mean on each side: Lesson 10.1.)</p>

<h3>Hacker's corner: Copy as cURL copies your identity</h3>
<p>Look at Step 4 again: the copied command contains the bearer token. With cookies it would also contain the session cookie. Paste it in a group chat, a ticket or a Stack Overflow question and whoever reads it can act as you until the token expires — no password needed. That is the same mechanism as the Okta support breach of 2023 (session tokens inside files sent to support), told in full in Lesson 9.3. Habit: before you share a cURL, replace the <code>Authorization</code>/<code>Cookie</code> values with <code>&lt;REDACTED&gt;</code>, or log out first so the token dies.</p>

<h3>Real-life situations</h3>
<ul>
<li><strong>"The page is slow."</strong> Sort by Time, then look at the waterfall shape: one long bar (one slow backend — read its TTFB), a staircase (serial awaits), a wide wall of short bars (too many requests — bundle/cache).</li>
<li><strong>"It fails only on the customer's machine."</strong> Compare their Timing tab with yours. Large "Initial connection/SSL" only for them points at their proxy/antivirus — Lesson 9.4 records the proof.</li>
<li><strong>Outsourcing / OJT</strong>: front-end and back-end teams often sit in different companies. A screenshot of the Network row + Headers tab + the <code>X-Request-Id</code> ends 90 % of "your API is broken" / "no, your UI is" arguments.</li>
<li><strong>What if</strong> the response has no request id? Propose adding one (Lesson 10.4, and the observability course): it is a one-line middleware and it changes every future investigation.</li>
</ul>

<h3>🎤 Interviewers will ask</h3>
<ul>
<li><em>What is TTFB and what does a large value tell you?</em> — Time to first byte: from request sent to first response byte; mostly server work, so read the server log for that request.</li>
<li><em>Why does every API call appear twice in the server log?</em> — CORS preflight (<code>OPTIONS</code>) for non-simple cross-origin requests, e.g. with an <code>Authorization</code> header.</li>
<li><em>The Console says CORS error. Is it always a CORS configuration problem?</em> — No; the server may have errored (500) on a path that forgets the CORS headers. Check the server log by request id.</li>
</ul>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok"><ol>
<li>Open <code>?kb=me,orders,report,slow</code> with DevTools open. Write the filter that shows only failed API calls and no preflights.</li>
<li>Click <code>report</code> → Timing. Which phase holds the 2 s? Explain in one sentence whom you would call.</li>
<li>Copy <code>/api/me</code> as cURL, remove one header at a time and replay. Which headers can you drop without changing the answer, and what does the API say when there is no token at all?</li>
<li>Change <code>src/app.js</code> so <code>report</code> and <code>slow</code> start together; rebuild (<code>bash dung.bash</code>) and show the new waterfall.</li>
</ol>
<p><strong>Done when:</strong> 1 is something like <code>domain:api.lgz.test -method:OPTIONS</code> + looking at Status (no OR in filters, so 4xx/5xx need the status column or two filters); 2 says "Waiting for server response — the report service behind the gateway"; 3 finds that only <code>Authorization</code> matters — and that with no token at all the lab API still says <em>The access token expired</em>: a misleading message worth its own bug report; 4 shows both bars starting at the same time and the total dropping by ~0.8 s.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['preflight', 'An OPTIONS request the browser sends before a non-simple cross-origin request to ask permission.'],
  ['initiator', 'What caused a request: parser, script (with file:line and call stack), redirect, preflight, other.'],
  ['waterfall', 'Bars showing when each request started and how long it took; reveals serial and parallel calls.'],
  ['TTFB', 'Time to first byte — Waiting for server response; mostly backend time.'],
  ['Copy as cURL', 'Export a request with all headers (including tokens/cookies) as a curl command.'],
  ['X-Request-Id', 'Tracking number returned by the server; joins the browser row to server log lines.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Network = access log from the client side, including requests the server never saw.</li>
<li>Preflights double the API lines; <code>CORS error</code> is not an HTTP status.</li>
<li>Waterfall shape → serial calls, one slow backend, or too many requests.</li>
<li>Big TTFB ⇒ server; big connection/SSL ⇒ network/proxy; big download ⇒ size.</li>
<li>Copy as cURL + request id = a reproducible ticket; redact tokens before sharing.</li>
</ul>
${nguon('📘', 'Chrome DevTools — Network features reference', 'Filters, Initiator, Timing breakdown phases, Copy as cURL', 'https://developer.chrome.com/docs/devtools/network/reference')}
${lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-5-2-network', title: 'Debugging 5.2 — Network: CORS, cache, throttling', sub: 'Debugging the cases this lesson only reads', cta: 'Open' })}
${lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-6-2-curl-postman', title: 'Debugging 6.2 — Reproducing requests', sub: 'curl -v, --resolve, Postman/Bruno environments', cta: 'Open' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>Network: access log, nhìn từ phía người dùng</h2>
<p class="lead">Đặt một hàng của bảng Network cạnh một dòng access log của nginx ở bài 10.2, bạn sẽ thấy cùng các trường: phương thức, URL, mã trạng thái, kích thước, thời gian, referer, user agent. Khác nhau ở góc nhìn. Máy chủ ghi cái đã <em>tới nơi</em>; trình duyệt ghi cái nó đã <em>thử gửi</em> — gồm cả request chưa bao giờ tới máy chủ, request nó giấu khỏi trang, và từng chặng của chuyến đi mất bao lâu. Gỡ CORS, cache, mô phỏng mạng chậm chuyên sâu nằm ở khoá gỡ lỗi; bài này đọc bảng Network như đọc một tệp log.</p>

<h3>Liên tưởng đời thường: trang tra cứu vận đơn</h3>
<p>Trang tra cứu của hãng giao hàng liệt kê từng chặng: lấy hàng 08:01, tới kho phân loại 08:40, bắt đầu giao 13:10, đã giao 13:55. Hàng tới trễ thì bạn thấy được chặng <em>nào</em> chậm — ở kho, không phải trên xe. Tab Timing của bảng Network chính là trang đó cho một request HTTP.</p>

<h3>Bước 1 — đọc bảng (Lab 9, cùng trang ở bài 9.1)</h3>
${lenh('s09/network', 0)}
<ul>
<li><strong>Name / Status / Type.</strong> <code>document</code> là trang, <code>script</code> và <code>image</code> do bộ phân tích HTML yêu cầu (Initiator <code>(index)</code>), các hàng <code>fetch</code> do JavaScript của ta gọi, <code>ping</code> là <code>navigator.sendBeacon</code> (9.5). Status <code>CORS error</code> không phải mã HTTP — đó là DevTools báo trình duyệt đã chặn phản hồi (9.1).</li>
<li><strong>Các hàng OPTIONS.</strong> Mỗi lời gọi API có một "anh em sinh đôi": <strong>preflight</strong>. Lời gọi của ta mang header <code>Authorization</code> sang origin khác, nên trình duyệt hỏi API trước "tôi gửi được không?" bằng <code>OPTIONS</code>. Trong access log của máy chủ bạn sẽ thấy số dòng gấp đôi số lần fetch; chuyện bình thường, không phải tấn công.</li>
<li><strong>Initiator</strong> <code>app.js:18</code> = lệnh <code>fetch</code> trong hàm phụ <code>goi()</code> của ta. Bấm vào trong DevTools sẽ nhảy tới dòng mã; rê chuột cho xem cả chuỗi lời gọi ("ai đã đòi request này?").</li>
<li><strong>Size và Time.</strong> Size là số byte đi trên dây (header + thân đã nén); Time tính từ lúc bắt đầu tới byte cuối.</li>
<li><strong>Waterfall (thác thời gian).</strong> <code>slow</code> chỉ bắt đầu sau khi <code>report</code> xong: mã <code>await</code> lần lượt từng lời gọi. Hai giây người dùng phải chờ, nhìn là thấy — cách sửa (cho các lời gọi độc lập chạy cùng lúc bằng <code>Promise.all</code>) đến thẳng từ cột này.</li>
</ul>
<p>Bộ lọc (gõ vào ô lọc; nhiều thuộc tính = VÀ, không có HOẶC): <code>status-code:504</code>, <code>larger-than:1000</code> (byte; viết <code>1k</code> cũng được), <code>domain:api.lgz.test</code>, <code>method:POST</code>, <code>-method:OPTIONS</code> để ẩn preflight, <code>mime-type:application/json</code>, <code>has-response-header:set-cookie</code>, <code>is:running</code> cho WebSocket đang mở; và các nút loại <em>Fetch/XHR, JS, CSS, Img…</em>. Nhớ <strong>Preserve log</strong> và <strong>Disable cache</strong>: thiếu cái đầu, một lần chuyển hướng xoá sạch các hàng; thiếu cái sau, lần truy cập lại lấy từ cache và giấu mất lỗi.</p>

<h3>Bước 2 — các pha thời gian, và nghi ai</h3>
${lenh('s09/network', 2)}
<p>802 ms chờ byte đầu tiên, 1 ms tải về, dùng lại kết nối cũ: mạng vô can, <strong>máy chủ</strong> mất 0,8 giây để nghĩ. Một kết nối HTTPS mới tinh mới hiện các pha còn lại; curl đo đúng các chặng đó trên cổng HTTPS tự ký của ta:</p>
${lenh('s09/network', 1)}
<table>
<thead><tr><th>Pha (tab Timing của DevTools)</th><th>Chuyện gì xảy ra</th><th>Lớn ⇒ nghi</th></tr></thead>
<tbody>
<tr><td>Queueing / Stalled</td><td>Chờ trước khi có kết nối rảnh</td><td>Giới hạn 6 kết nối mỗi origin của HTTP/1.1, quá nhiều request cùng lúc, độ ưu tiên thấp</td></tr>
<tr><td>DNS Lookup</td><td>Tên → IP</td><td>Máy phân giải chậm, DNS của VPN/công ty, lần truy cập đầu</td></tr>
<tr><td>Initial connection / SSL</td><td>Bắt tay TCP, bắt tay TLS</td><td>Máy chủ ở xa, mất gói, proxy hay phần mềm diệt virus soi TLS</td></tr>
<tr><td>Request sent</td><td>Gửi request lên</td><td>Tải lên nhiều trên đường truyền chậm</td></tr>
<tr><td>Waiting for server response (TTFB)</td><td>Máy chủ đang làm việc</td><td>Backend: truy vấn chậm, dịch vụ phụ thuộc chậm, timeout — sang log máy chủ (<code>rt=</code>, bài 10.2)</td></tr>
<tr><td>Content Download</td><td>Nhận phần thân</td><td>Phản hồi lớn, không nén, đường truyền chậm</td></tr>
</tbody></table>
<p>Số của ta: DNS 12 micro giây (tên được ánh xạ ngay trên máy), TCP 0,1 ms, TLS xong lúc 3,2 ms, byte đầu lúc 3,7 ms — với một trang thật qua Internet, mỗi chặng là hàng chục mili giây, và bảng trên cho biết nên xử chặng nào.</p>

<h3>Bước 3 — những header biết kể chuyện</h3>
<p>Trong header request ở Bước 2: <code>Authorization</code> (trình duyệt tự nhận là ai), <code>Origin</code> và <code>Referer</code> (trang nào đã hỏi). Trong phản hồi: <code>X-Request-Id</code> — mã vận đơn của máy chủ, trang của ta đọc được chỉ vì API gửi <code>Access-Control-Expose-Headers: X-Request-Id</code>. Ở trang thật, tìm thêm <code>Server</code>, <code>Via</code>, <code>X-Cache</code>, <code>CF-Ray</code> (CDN/proxy nào đã trả lời — bài 13.3), <code>Cache-Control</code>/<code>Age</code> (có phải lấy từ cache?) và <code>WWW-Authenticate</code> (vì sao xác thực thất bại).</p>

<h3>Bước 4 — Copy as cURL: mang request ra khỏi trình duyệt</h3>
${lenh('s09/network', 3)}
<p>Chuột phải một hàng → Copy → <strong>Copy as cURL (bash)</strong> cho bạn đúng thứ này. Giờ bạn phát lại được chính xác request đó trong terminal, đổi từng thứ một, và gửi cho đội backend. Trước hết, nhìn vào trong token — phần giữa của JWT chỉ là base64:</p>
${lenh('s09/network', 4)}
<p><code>exp: 1795392000</code> là 00:00 UTC ngày 23/11/2026 — tức là hôm qua. Phát lại:</p>
${lenh('s09/network', 5)}
<p>Trang chỉ hiện "401". Phản hồi đầy đủ nói rõ lý do: <code>WWW-Authenticate: Bearer error="invalid_token", error_description="The access token expired"</code>. Và nó mang theo mã vận đơn. Mang mã đó sang máy chủ:</p>
${lenh('s09/network', 6)}
<p>Một mã, hai log máy chủ: dòng access (401, từ curl) và cảnh báo <em>token hết hạn</em> của ứng dụng. Đây là cú bàn giao bạn làm hằng tuần khi đi làm: "request id <code>0efc4682…</code>, 23:30:53 UTC, 401 invalid_token" là một ticket mà dev backend giải trong một phút; "đăng nhập hỏng rồi" thì không.</p>

<h3>Bước 5 — lần theo lỗi 504 tới đúng dịch vụ chậm</h3>
${lenh('s09/network', 7)}
<p>Trình duyệt: 504 sau 2005 ms. Access log: 504 với <code>rt=2.003</code>. Log ứng dụng: <em>upstream timed out (2000 ms) calling report-svc</em>. Cổng có timeout 2 giây đã cắt vì dịch vụ phía sau cần 5 giây. Gọi ai giờ đã rõ — dịch vụ báo cáo, không phải giao diện, cũng không phải mạng. (502/503/504 nghĩa là gì ở mỗi phía: bài 10.1.)</p>

<h3>Góc hacker: Copy as cURL chép luôn danh tính của bạn</h3>
<p>Nhìn lại Bước 4: lệnh vừa chép chứa nguyên bearer token. Nếu dùng cookie, nó còn chứa cookie phiên. Dán vào nhóm chat, ticket hay câu hỏi trên Stack Overflow là ai đọc cũng đóng vai bạn được tới khi token hết hạn — không cần mật khẩu. Đó cũng là cơ chế của vụ lộ hệ thống hỗ trợ Okta năm 2023 (token phiên nằm trong tệp gửi cho bộ phận hỗ trợ), kể đầy đủ ở bài 9.3. Thói quen: trước khi chia sẻ một lệnh cURL, thay giá trị <code>Authorization</code>/<code>Cookie</code> bằng <code>&lt;DA-CHE&gt;</code>, hoặc đăng xuất trước để token chết.</p>

<h3>Tình huống đời thật</h3>
<ul>
<li><strong>"Trang chậm quá."</strong> Xếp theo Time, rồi nhìn hình dạng thác: một thanh dài (một backend chậm — đọc TTFB của nó), hình bậc thang (await nối đuôi), một bức tường thanh ngắn (quá nhiều request — gộp tệp/cache).</li>
<li><strong>"Chỉ lỗi trên máy khách hàng."</strong> So tab Timing của họ với của bạn. "Initial connection/SSL" lớn chỉ ở máy họ thì nghi proxy/phần mềm diệt virus của họ — bài 9.4 ghi lại bằng chứng.</li>
<li><strong>Outsourcing / OJT</strong>: đội giao diện và đội backend nhiều khi ở hai công ty khác nhau. Ảnh chụp hàng Network + tab Headers + <code>X-Request-Id</code> kết thúc 90 % cuộc cãi "API bên anh hỏng" / "không, giao diện bên em hỏng".</li>
<li><strong>Nếu</strong> phản hồi không có request id thì sao? Đề xuất thêm vào (bài 10.4 và khoá observability): chỉ một middleware một dòng, mà thay đổi mọi cuộc điều tra sau này.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><em>TTFB là gì, giá trị lớn nói lên điều gì?</em> — Thời gian tới byte đầu tiên: từ lúc gửi xong request tới byte phản hồi đầu tiên; phần lớn là thời gian máy chủ làm việc, nên đọc log máy chủ của request đó.</li>
<li><em>Vì sao mỗi lời gọi API xuất hiện hai lần trong log máy chủ?</em> — Preflight CORS (<code>OPTIONS</code>) cho request khác origin không "đơn giản", ví dụ có header <code>Authorization</code>.</li>
<li><em>Console báo lỗi CORS. Có phải lúc nào cũng do cấu hình CORS?</em> — Không; máy chủ có thể đã lỗi (500) ở một nhánh quên gắn header CORS. Kiểm log máy chủ theo request id.</li>
</ul>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
<li>Mở <code>?kb=me,orders,report,slow</code> khi DevTools đang mở. Viết bộ lọc chỉ hiện các lời gọi API và không có preflight.</li>
<li>Bấm <code>report</code> → Timing. Pha nào chứa 2 giây? Giải thích trong một câu bạn sẽ gọi ai.</li>
<li>Chép <code>/api/me</code> dạng cURL, bỏ từng header rồi phát lại. Bỏ được những header nào mà câu trả lời không đổi, và khi không có token nào thì API nói gì?</li>
<li>Sửa <code>src/app.js</code> cho <code>report</code> và <code>slow</code> chạy cùng lúc; build lại (<code>bash dung.bash</code>) và cho xem thác mới.</li>
</ol>
<p><strong>Đạt khi:</strong> câu 1 kiểu <code>domain:api.lgz.test -method:OPTIONS</code> rồi nhìn cột Status (bộ lọc không có HOẶC, nên 4xx/5xx phải nhìn cột trạng thái hoặc dùng hai bộ lọc); câu 2 nói "Waiting for server response — dịch vụ báo cáo sau cổng"; câu 3 thấy chỉ <code>Authorization</code> là quan trọng — và khi không có token nào, API của lab vẫn báo <em>The access token expired</em>: một thông báo gây hiểu nhầm, đáng một bug report riêng; câu 4 cho thấy hai thanh bắt đầu cùng lúc và tổng thời gian giảm khoảng 0,8 giây.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['preflight', 'Request OPTIONS trình duyệt gửi trước một request khác origin không "đơn giản" để xin phép.'],
  ['initiator', 'Cái gây ra request: bộ phân tích HTML, script (kèm tệp:dòng và chuỗi lời gọi), chuyển hướng, preflight, khác.'],
  ['waterfall (thác)', 'Các thanh cho biết mỗi request bắt đầu khi nào và kéo dài bao lâu; lộ ra lời gọi nối đuôi hay song song.'],
  ['TTFB', 'Time to first byte — Waiting for server response; phần lớn là thời gian của backend.'],
  ['Copy as cURL', 'Xuất một request với đủ header (cả token/cookie) thành lệnh curl.'],
  ['X-Request-Id', 'Mã vận đơn máy chủ trả về; nối hàng trong trình duyệt với các dòng log máy chủ.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Network = access log nhìn từ phía người dùng, gồm cả request máy chủ chưa bao giờ thấy.</li>
<li>Preflight làm số dòng API gấp đôi; <code>CORS error</code> không phải mã HTTP.</li>
<li>Hình dạng thác → lời gọi nối đuôi, một backend chậm, hay quá nhiều request.</li>
<li>TTFB lớn ⇒ máy chủ; kết nối/SSL lớn ⇒ mạng/proxy; tải về lớn ⇒ kích thước.</li>
<li>Copy as cURL + request id = một ticket tái hiện được; che token trước khi chia sẻ.</li>
</ul>
${nguon('📘', 'Chrome DevTools — Network features reference', 'Bộ lọc, Initiator, các pha thời gian, Copy as cURL', 'https://developer.chrome.com/docs/devtools/network/reference')}
${lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-5-2-network', title: 'Gỡ lỗi 5.2 — Network: CORS, cache, mạng chậm', sub: 'Gỡ những ca bài này chỉ đọc', cta: 'Mở bài' })}
${lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-6-2-curl-postman', title: 'Gỡ lỗi 6.2 — Tái hiện request', sub: 'curl -v, --resolve, môi trường Postman/Bruno', cta: 'Mở bài' })}
</div>
`,
};
