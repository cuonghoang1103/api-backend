/**
 * 9.6 — Lab 9: chẩn đoán trang hỏng từ tệp HAR người khác gửi (soạn 24/11/2026, agent lgz).
 * Dữ liệu: _demo/s09/lab9/ (lab9.har + api.log + app.log cùng một lượt chạy, request id khớp nhau) — sinh bằng _demo/s09/lab9-tao.bash.
 * Lời giải chạy thật: OUT['s09/lab9'] (jq 1.7, base64, grep). Không có bí mật thật: token/mật khẩu/cookie là chuỗi GIA_TOKEN·VIDU.
 */
import { lenh, ma, lienKet, kv } from '../_chung.mjs';

export default {
  title: 'Lab 9 — Diagnose a broken page from a HAR file someone sent you|||Lab 9 — Chẩn đoán một trang hỏng từ tệp HAR người khác gửi cho bạn',
  slug: 'log-9-6-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Ticket từ QA phía khách hàng: "đăng nhập xong không thấy tài khoản, không thấy đơn hàng, báo cáo không tải" kèm một tệp HAR; đội backend gửi trích api.log và app.log. Chỉ dùng jq/grep/base64: tìm đúng ba request gây lỗi, chứng minh nguyên nhân gốc của từng cái bằng một dòng HAR và một dòng log máy chủ nối qua request id (token cũ sau khi đăng nhập, lỗi 500 đội lốt CORS, cổng hết 2 giây chờ dịch vụ báo cáo), phát hiện thêm lỗi bảo mật (token trên URL lọt vào access log), làm sạch HAR về 0 mẫu bí mật, rồi viết trả lời ticket 5 dòng bằng tiếng Anh. Có rubric, câu hỏi phỏng vấn và mốc dự án.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lab 9</span>
<h2>Lab 9 — A HAR file, two server logs, three bugs, one reply</h2>
<p class="lead">This is the most common log task of a junior on an outsourcing project: a customer's tester reports a broken page and attaches a HAR; you cannot see their screen. Your job is to point at the exact requests, prove each cause from two sides (browser and server), clean the file you were sent, and reply in a way the customer can act on.</p>

<h3>The ticket</h3>
<div class="callout"><p><strong>SHOP-231 · Priority: High · From: customer QA</strong><br>"After logging in, the account page shows nothing, the order list is empty and the report never loads. Reproduced 23/11 around 23:33 UTC on Chrome. HAR attached."<br><strong>Backend team:</strong> "Here are <code>api.log</code> and <code>app.log</code> for that minute."</p></div>

<h3>Get the files</h3>
<p>Either use the copies shipped with the course (<code>_demo/s09/lab9/</code>: <code>lab9.har</code>, <code>api.log</code>, <code>app.log</code>), or make your own from the Lab 9 app of Lesson 9.1 — the ids and times will differ, the bugs will not:</p>
${ma('bash', 's09/lab9-tao.bash')}
<p>Tools allowed: <code>jq</code>, <code>grep</code>, <code>base64</code>, <code>date</code>, and the two helpers from 9.3 (<code>tim-bi-mat.bash</code>, <code>che-har.jq</code>). No browser, no access to the server.</p>

<h3>Tasks</h3>
<ol>
<li><strong>Inventory.</strong> One line per request: status, failure text, time, method, URL without query. Which rows are failures? Which one is noise for this ticket?</li>
<li><strong>Bug A — "account page shows nothing".</strong> Explain the 401 with the token itself. Hint: there are two tokens in the file.</li>
<li><strong>Bug B — "order list empty".</strong> The HAR has no status for it. Prove what actually happened on the server.</li>
<li><strong>Bug C — "report never loads".</strong> Which component timed out, after how long, and waiting for whom?</li>
<li><strong>Security finding.</strong> Count the secrets in the HAR. Is anything sensitive also in the <em>server</em> log you were given?</li>
<li><strong>Clean</strong> the HAR before attaching it anywhere else; prove 0 remaining patterns.</li>
<li><strong>Reply</strong> to the ticket in English, 5 lines max: per bug the request id, cause, owner, fix; plus what you did with their file.</li>
</ol>

<details><summary>Hint for 2</summary><p>Decode the middle part of the <code>Authorization</code> header of <code>/api/me</code>, then the token in the <em>response body</em> of <code>/api/login</code>. Compare <code>exp</code> with the login time (<code>date -u -d @…</code>).</p></details>
<details><summary>Hint for 3</summary><p>Status <code>-1</code>, zero headers, <code>net::ERR_FAILED</code> = the browser got no readable response (Lesson 9.1). Look for the same path in <code>api.log</code>, take its <code>rid=</code>, look for it in <code>app.log</code>.</p></details>
<details><summary>Hint for 4</summary><p>Compare <code>time</code> and <code>timings.wait</code> in the HAR with <code>rt=</code> in the access log and the message in the app log.</p></details>

<details><summary>✅ Solution, run for real (open after you finish)</summary>
<p><strong>1 — Inventory</strong></p>
${lenh('s09/lab9', 0)}
<p>Failures: 401 <code>/api/me</code>, -1 <code>/api/orders</code>, 504 <code>/api/report</code>. The 404 <code>logo-moi.png</code> is real but unrelated to the ticket — mention it in one line, do not let it distract.</p>
<p><strong>2 — Bug A: the app keeps using the old token</strong></p>
${lenh('s09/lab9', 1)}
${lenh('s09/lab9', 2)}
${lenh('s09/lab9', 12)}
${lenh('s09/lab9', 3)}
<p>The login at 23:33:33 UTC returned a fresh token (<code>exp</code> 1795477713 = 23:48:33, 15 minutes), but <code>/api/me</code> was called with a token whose <code>exp</code> is 1795392000 = 23/11 00:00 UTC — the token from a previous session, still in <code>localStorage</code>. The server says it plainly: <em>The access token expired</em>. Owner: front-end. Fix: store the token returned by login (and on 401, refresh or send the user to login instead of rendering an empty page).</p>
<p><strong>3 — Bug B: a 500 hidden by CORS</strong></p>
${lenh('s09/lab9', 4)}
${lenh('s09/lab9', 5)}
${lenh('s09/lab9', 6)}
<p>The preflight passed (204); the real GET returned <strong>500</strong> (<code>rid=ac6daedcbd098e1f</code>), and the app log for that id has the cause: <code>TypeError: Cannot read properties of undefined (reading 'userId')</code>. The error response carried no CORS headers, so the browser hid it. Owner: backend — two fixes: the null user in the orders handler, and CORS headers on error responses (otherwise the next 500 will again look like CORS).</p>
<p><strong>4 — Bug C: gateway timeout waiting for the report service</strong></p>
${lenh('s09/lab9', 7)}
${lenh('s09/lab9', 8)}
<p>Browser: 2004 ms, of which 2002 ms waiting for the first byte. Access log: 504, <code>rt=2.001</code>, same id. App log: <em>upstream timed out (2000 ms) calling report-svc</em>. The API's own 2-second timeout fired because the report service did not answer in time. Owner: whoever runs report-svc; options: make it faster, make the report asynchronous (start job → poll), or — only with evidence of normal duration — raise the timeout.</p>
<p><strong>5 — Security finding</strong></p>
${lenh('s09/lab9', 10)}
${lenh('s09/lab9', 9)}
<p>The HAR holds the tester's password, session cookie and live tokens. Worse, the app sends the token in the URL of <code>/api/search</code>, so it is now also written in the <strong>server access log</strong> — readable by anyone with log access, kept for months, shipped to the log platform. Report it as a separate security bug: never put tokens in URLs (use the <code>Authorization</code> header), and ask the customer's tester to change the test account password and log out.</p>
<p><strong>6 — Clean</strong></p>
${lenh('s09/lab9', 11)}
<p><strong>7 — Reply (example)</strong></p>
<pre><code class="language-text">SHOP-231 — 3 causes found from your HAR + our logs (times UTC, 23/11):
A) GET /api/me 401 (rid caa75cb6623e3ea9): UI sends the token of a previous session; login's new token is not saved. Owner FE — fix in next build.
B) GET /api/orders shown as CORS error is a server 500 (rid ac6daedcbd098e1f, TypeError userId). Owner BE — fix handler + CORS on errors.
C) GET /api/report 504 after 2.0 s (rid 771cc35e8d510a86): report-svc slower than the API's 2 s timeout. Owner report team — investigating.
Security: your HAR contained a password/session; please change that test account's password. We deleted the original and keep only a sanitised copy.</code></pre>
</details>

<h3>Rubric (self-check)</h3>
<table>
<thead><tr><th>Criterion</th><th>Pass</th></tr></thead>
<tbody>
<tr><td>Three failing requests identified, including the -1 one</td><td>All three, with path and request id</td></tr>
<tr><td>Each cause proven from two sides</td><td>One HAR field + one server log line per bug, joined by request id or decoded token</td></tr>
<tr><td>Correct owner per bug</td><td>FE / BE / report service</td></tr>
<tr><td>Security finding</td><td>Password + tokens in HAR <em>and</em> token in the access log</td></tr>
<tr><td>Sanitised file</td><td><code>tim-bi-mat.bash</code> prints nothing</td></tr>
<tr><td>Reply</td><td>≤ 5 lines, English, ids, UTC, owners, no secrets pasted</td></tr>
</tbody></table>

<h3>🎤 Interviewers will ask</h3>
<ul>
<li><em>A user says "it doesn't work". What do you ask for, in what order?</em> — Steps + time (with time zone), a screenshot, the Console saved as text, a sanitised HAR; then the request id(s) to search server logs.</li>
<li><em>The HAR shows status 0 / -1 for a request. What does it mean?</em> — No usable response reached the page: CORS block, network failure, cancellation; read <code>_failureText</code> and the server log.</li>
<li><em>How do you prove a timeout is in the backend, not the network?</em> — TTFB ≈ total time, connection reused, server <code>rt=</code> equals it, and a log line names the timed-out dependency.</li>
<li><em>Why is a token in a URL worse than in a header?</em> — URLs are written to access logs, proxies, browser history and Referer headers.</li>
<li><em>What do you do with a customer's HAR after the ticket?</em> — Delete it or keep only a sanitised copy; never paste it into chat.</li>
</ul>

<h3>🧭 Project milestone</h3>
<p>In your own project (SWP, LabFlow or the course project): (1) return an <code>X-Request-Id</code> on every API response and expose it to the front-end; (2) add the 9.5 collector (or the error tracker you use) with scrubbing and source maps kept private; (3) write a one-page "how to send us a bug report" guide for testers: Console Save as, sanitised HAR, time in UTC. These three make every future ticket on your project like this lab instead of a guessing game.</p>

${kv([
  ['two-sided evidence', 'One fact from the browser (HAR) and one from the server (log), linked by request id.'],
  ['owner', 'The team or component that must change something to fix the bug.'],
  ['token in URL', 'Credential written into access logs, history and Referer — never do it.'],
])}
${lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-6-5-lab', title: 'Debugging Lab 6 — An API that fails only from the front end', sub: 'The same skills, from the debugging side', cta: 'Open' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Lab 9</span>
<h2>Lab 9 — Một tệp HAR, hai log máy chủ, ba lỗi, một câu trả lời</h2>
<p class="lead">Đây là việc đọc log hay gặp nhất của một bạn mới vào dự án outsourcing: tester phía khách báo một trang hỏng và đính kèm tệp HAR; bạn không nhìn được màn hình của họ. Việc của bạn là chỉ đúng các request, chứng minh từng nguyên nhân từ hai phía (trình duyệt và máy chủ), làm sạch tệp được gửi, và trả lời sao cho khách làm theo được.</p>

<h3>Ticket</h3>
<div class="callout"><p><strong>SHOP-231 · Ưu tiên: Cao · Từ: QA phía khách hàng</strong><br>"After logging in, the account page shows nothing, the order list is empty and the report never loads. Reproduced 23/11 around 23:33 UTC on Chrome. HAR attached." (Đăng nhập xong, trang tài khoản trống, danh sách đơn trống, báo cáo không bao giờ tải xong.)<br><strong>Đội backend:</strong> "Đây là <code>api.log</code> và <code>app.log</code> của phút đó."</p></div>

<h3>Lấy tệp</h3>
<p>Dùng bản đi kèm khoá (<code>_demo/s09/lab9/</code>: <code>lab9.har</code>, <code>api.log</code>, <code>app.log</code>), hoặc tự tạo từ ứng dụng Lab 9 ở bài 9.1 — mã và giờ sẽ khác, lỗi thì không:</p>
${ma('bash', 's09/lab9-tao.bash')}
<p>Được dùng: <code>jq</code>, <code>grep</code>, <code>base64</code>, <code>date</code>, và hai công cụ ở bài 9.3 (<code>tim-bi-mat.bash</code>, <code>che-har.jq</code>). Không trình duyệt, không vào được máy chủ.</p>

<h3>Nhiệm vụ</h3>
<ol>
<li><strong>Kiểm kê.</strong> Mỗi request một dòng: trạng thái, lý do lỗi, thời gian, phương thức, URL bỏ query. Hàng nào là lỗi? Hàng nào là nhiễu với ticket này?</li>
<li><strong>Lỗi A — "trang tài khoản trống".</strong> Giải thích lỗi 401 bằng chính token. Gợi ý: trong tệp có hai token.</li>
<li><strong>Lỗi B — "danh sách đơn trống".</strong> HAR không có mã trạng thái cho nó. Chứng minh điều thực sự đã xảy ra trên máy chủ.</li>
<li><strong>Lỗi C — "báo cáo không bao giờ tải xong".</strong> Thành phần nào hết thời gian chờ, sau bao lâu, và đang chờ ai?</li>
<li><strong>Phát hiện bảo mật.</strong> Đếm bí mật trong HAR. Có thứ gì nhạy cảm nằm cả trong log <em>máy chủ</em> bạn được đưa không?</li>
<li><strong>Làm sạch</strong> HAR trước khi đính kèm ở bất kỳ đâu khác; chứng minh còn 0 mẫu.</li>
<li><strong>Trả lời</strong> ticket bằng tiếng Anh, tối đa 5 dòng: mỗi lỗi có request id, nguyên nhân, ai phụ trách, cách sửa; cộng việc bạn đã làm với tệp của họ.</li>
</ol>

<details><summary>Gợi ý câu 2</summary><p>Giải mã phần giữa của header <code>Authorization</code> ở <code>/api/me</code>, rồi token trong <em>thân phản hồi</em> của <code>/api/login</code>. So <code>exp</code> với giờ đăng nhập (<code>date -u -d @…</code>).</p></details>
<details><summary>Gợi ý câu 3</summary><p>Trạng thái <code>-1</code>, không header nào, <code>net::ERR_FAILED</code> = trình duyệt không nhận được phản hồi đọc được (bài 9.1). Tìm cùng đường dẫn trong <code>api.log</code>, lấy <code>rid=</code>, tìm nó trong <code>app.log</code>.</p></details>
<details><summary>Gợi ý câu 4</summary><p>So <code>time</code> và <code>timings.wait</code> trong HAR với <code>rt=</code> trong access log và thông điệp trong log ứng dụng.</p></details>

<details><summary>✅ Lời giải, chạy thật (mở sau khi làm xong)</summary>
<p><strong>1 — Kiểm kê</strong></p>
${lenh('s09/lab9', 0)}
<p>Lỗi: 401 <code>/api/me</code>, -1 <code>/api/orders</code>, 504 <code>/api/report</code>. Lỗi 404 <code>logo-moi.png</code> có thật nhưng không liên quan ticket — nhắc một dòng, đừng để nó làm lạc hướng.</p>
<p><strong>2 — Lỗi A: ứng dụng vẫn dùng token cũ</strong></p>
${lenh('s09/lab9', 1)}
${lenh('s09/lab9', 2)}
${lenh('s09/lab9', 12)}
${lenh('s09/lab9', 3)}
<p>Lần đăng nhập lúc 23:33:33 UTC trả về token mới (<code>exp</code> 1795477713 = 23:48:33, sống 15 phút), nhưng <code>/api/me</code> lại được gọi bằng token có <code>exp</code> 1795392000 = 00:00 UTC ngày 23/11 — token của một phiên trước, còn nằm trong <code>localStorage</code>. Máy chủ nói rõ: <em>The access token expired</em>. Phụ trách: giao diện. Sửa: lưu token mà lần đăng nhập trả về (và khi gặp 401 thì làm mới token hoặc đưa người dùng về trang đăng nhập, thay vì vẽ một trang trống).</p>
<p><strong>3 — Lỗi B: lỗi 500 bị CORS che</strong></p>
${lenh('s09/lab9', 4)}
${lenh('s09/lab9', 5)}
${lenh('s09/lab9', 6)}
<p>Preflight qua (204); GET thật trả <strong>500</strong> (<code>rid=ac6daedcbd098e1f</code>), và log ứng dụng của mã đó có nguyên nhân: <code>TypeError: Cannot read properties of undefined (reading 'userId')</code>. Phản hồi lỗi không mang header CORS nên trình duyệt giấu nó đi. Phụ trách: backend — hai chỗ sửa: người dùng null trong hàm xử lý đơn hàng, và header CORS trên phản hồi lỗi (nếu không, lỗi 500 lần sau lại trông như lỗi CORS).</p>
<p><strong>4 — Lỗi C: cổng hết thời gian chờ dịch vụ báo cáo</strong></p>
${lenh('s09/lab9', 7)}
${lenh('s09/lab9', 8)}
<p>Trình duyệt: 2004 ms, trong đó 2002 ms chờ byte đầu tiên. Access log: 504, <code>rt=2.001</code>, cùng mã. Log ứng dụng: <em>upstream timed out (2000 ms) calling report-svc</em>. Timeout 2 giây của chính API đã cắt vì dịch vụ báo cáo không trả lời kịp. Phụ trách: đội vận hành report-svc; hướng xử lý: làm nó nhanh hơn, chuyển báo cáo sang chạy nền (tạo việc → hỏi lại kết quả), hoặc — chỉ khi có bằng chứng về thời gian chạy bình thường — tăng timeout.</p>
<p><strong>5 — Phát hiện bảo mật</strong></p>
${lenh('s09/lab9', 10)}
${lenh('s09/lab9', 9)}
<p>Tệp HAR chứa mật khẩu của tester, cookie phiên và token còn sống. Tệ hơn, ứng dụng gửi token trên URL của <code>/api/search</code>, nên nó giờ cũng nằm trong <strong>access log của máy chủ</strong> — ai có quyền đọc log cũng đọc được, giữ hàng tháng, đẩy sang nền tảng log. Báo thành một lỗi bảo mật riêng: không bao giờ để token trên URL (dùng header <code>Authorization</code>), và nhờ tester phía khách đổi mật khẩu tài khoản thử nghiệm rồi đăng xuất.</p>
<p><strong>6 — Làm sạch</strong></p>
${lenh('s09/lab9', 11)}
<p><strong>7 — Trả lời (mẫu)</strong></p>
<pre><code class="language-text">SHOP-231 — 3 causes found from your HAR + our logs (times UTC, 23/11):
A) GET /api/me 401 (rid caa75cb6623e3ea9): UI sends the token of a previous session; login's new token is not saved. Owner FE — fix in next build.
B) GET /api/orders shown as CORS error is a server 500 (rid ac6daedcbd098e1f, TypeError userId). Owner BE — fix handler + CORS on errors.
C) GET /api/report 504 after 2.0 s (rid 771cc35e8d510a86): report-svc slower than the API's 2 s timeout. Owner report team — investigating.
Security: your HAR contained a password/session; please change that test account's password. We deleted the original and keep only a sanitised copy.</code></pre>
</details>

<h3>Rubric (tự chấm)</h3>
<table>
<thead><tr><th>Tiêu chí</th><th>Đạt</th></tr></thead>
<tbody>
<tr><td>Tìm ra ba request lỗi, kể cả hàng -1</td><td>Đủ ba, có đường dẫn và request id</td></tr>
<tr><td>Mỗi nguyên nhân chứng minh từ hai phía</td><td>Một trường HAR + một dòng log máy chủ cho mỗi lỗi, nối bằng request id hoặc token đã giải mã</td></tr>
<tr><td>Đúng bên phụ trách</td><td>Giao diện / backend / dịch vụ báo cáo</td></tr>
<tr><td>Phát hiện bảo mật</td><td>Mật khẩu + token trong HAR <em>và</em> token trong access log</td></tr>
<tr><td>Tệp đã làm sạch</td><td><code>tim-bi-mat.bash</code> không in gì</td></tr>
<tr><td>Câu trả lời</td><td>≤ 5 dòng, tiếng Anh, có mã, giờ UTC, bên phụ trách, không dán bí mật</td></tr>
</tbody></table>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><em>Người dùng nói "nó không chạy". Bạn xin gì, theo thứ tự nào?</em> — Các bước + thời điểm (kèm múi giờ), ảnh chụp, Console lưu dạng chữ, HAR đã làm sạch; rồi tới request id để tìm trong log máy chủ.</li>
<li><em>HAR cho trạng thái 0 / -1 ở một request. Nghĩa là gì?</em> — Không có phản hồi dùng được tới trang: bị CORS chặn, lỗi mạng, bị huỷ; đọc <code>_failureText</code> và log máy chủ.</li>
<li><em>Làm sao chứng minh timeout nằm ở backend chứ không phải mạng?</em> — TTFB ≈ tổng thời gian, kết nối được dùng lại, <code>rt=</code> phía máy chủ bằng đúng số đó, và có dòng log nêu tên dịch vụ phụ thuộc bị hết giờ.</li>
<li><em>Vì sao token trên URL tệ hơn trong header?</em> — URL bị ghi vào access log, proxy, lịch sử trình duyệt và header Referer.</li>
<li><em>Xong ticket rồi bạn làm gì với tệp HAR của khách?</em> — Xoá, hoặc chỉ giữ bản đã làm sạch; không bao giờ dán vào chat.</li>
</ul>

<h3>🧭 Mốc dự án</h3>
<p>Trong dự án của bạn (SWP, LabFlow hay dự án của khoá): (1) trả <code>X-Request-Id</code> ở mọi phản hồi API và cho giao diện đọc được; (2) thêm bộ thu ở bài 9.5 (hoặc công cụ theo dõi lỗi bạn dùng), có che dữ liệu và giữ kín source map; (3) viết một trang hướng dẫn "gửi bug report cho chúng tôi thế nào" cho tester: Console Save as, HAR đã làm sạch, giờ theo UTC. Ba việc này biến mọi ticket sau này của dự án thành giống lab này, thay vì một trò đoán mò.</p>

${kv([
  ['bằng chứng hai phía', 'Một sự thật từ trình duyệt (HAR) và một từ máy chủ (log), nối bằng request id.'],
  ['bên phụ trách (owner)', 'Đội hay thành phần phải thay đổi gì đó để sửa lỗi.'],
  ['token trên URL', 'Thông tin đăng nhập bị ghi vào access log, lịch sử, Referer — không bao giờ làm.'],
])}
${lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-6-5-lab', title: 'Gỡ lỗi Lab 6 — Một API chỉ lỗi khi gọi từ giao diện', sub: 'Cùng kỹ năng, nhìn từ phía gỡ lỗi', cta: 'Mở bài' })}
</div>
`,
};
