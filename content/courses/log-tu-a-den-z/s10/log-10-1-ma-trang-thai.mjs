/**
 * 10.1 — Mã trạng thái HTTP cho người đọc log (soạn 24/11/2026).
 * Dựng Lab 10 (nginx 1.27 trước app Node 22 + pino) — dùng chung cả chương. Output thật: OUT['s10/trang-thai']
 * (log sinh bởi _demo/s10/web-lab/tao-luu-luong.py lúc 03:34 giờ VN 24/11/2026 = 20:34 UTC 23/11; nginx trong container ghi giờ UTC).
 */
import { ma, lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '10.1 — HTTP status codes for log readers: 2xx–5xx, and what 401/403/404/429/499/500/502/503/504 mean in practice|||10.1 — Mã trạng thái HTTP cho người đọc log: 2xx–5xx, và 401/403/404/429/499/500/502/503/504 thực tế nghĩa là gì',
  slug: 'log-10-1-ma-trang-thai',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Dựng Lab 10 (nginx đứng trước app Node.js, ghi log thật) rồi đọc mười mấy mã trạng thái do chính bạn gây ra: 400 do request sai cú pháp, 401/403/404, 413 body quá lớn, 429 bị giới hạn tốc độ, 499 khách tự bỏ đi, 500 lỗi app, 502 app sập, 504 app quá chậm. Với mỗi mã: ai sinh ra nó (nginx hay app), dòng error log đi kèm, và câu hỏi tiếp theo phải hỏi.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>Status codes for log readers: who said it, and what to ask next</h2>
<p class="lead">Every line of a web access log carries a three-digit number. Developers learn the numbers to <em>send</em> them; log readers need something else: for each code, <strong>which component produced it</strong> (the proxy, the app, a CDN) and <strong>what to look at next</strong>. In this lesson you build a small but real stack — nginx in front of a Node.js API — make it produce a dozen different codes, and read each one.</p>

<h3>The everyday picture: the receptionist and the back office</h3>
<p>You phone a company. The receptionist (nginx) answers. Some questions she handles herself: "wrong number" (404 for a file that does not exist), "you are not on the list" (403), "you have called five times this minute, call back later" (429), "your letter is too thick" (413). Everything else she forwards to the back office (the app). If the back office says "we lost your file" — that is a 500, the app's own error. If nobody picks up in the back office — 502. If they pick up but take forever and she gives up — 504. If <em>you</em> hang up before she answers — nginx writes 499. The code tells you <em>where in the building</em> the problem is.</p>

<h3>Step 0 — build Lab 10 once (used by the whole chapter)</h3>
<p>Three small files, no frameworks: an API written with Node's built-in <code>http</code> module and the <strong>pino</strong> logger, an nginx config with two access log formats, and a script that starts both containers. The two containers share one network namespace, so nginx reaches the app at <code>127.0.0.1:3000</code> and you do not create any Docker network.</p>
${ma('javascript', 's10/web-lab/app.js')}
${ma('nginx', 's10/web-lab/nginx.conf')}
${ma('bash', 's10/web-lab/lab-up.bash')}
<pre><code class="language-bash"># in an empty folder with the three files above + tao-luu-luong.py:
docker run --rm --user "$(id -u):$(id -g)" -e npm_config_cache=/tmp/nc -v "$PWD":/w -w /w node:22-alpine \\
  sh -c 'npm init -y &gt;/dev/null &amp;&amp; npm i pino@9 pino-http@10 pino-pretty@13 winston@3'
bash lab-up.bash                         # prints: nginx -&gt; app: 200
python3 tao-luu-luong.py               # ~2 minutes of "night traffic"; prints: xong
ls logs/                               # access.log  access.json  app.log  error.log</code></pre>
<p>The traffic script (<code>tao-luu-luong.py</code>, shown in lesson 10.10) plays normal users, a scanner, a password-guessing script, one impatient client, one export that takes too long, and one request that crashes the app. Clients pretend to come from documentation-only IP ranges (RFC 5737) through <code>X-Forwarded-For</code>, exactly as if the lab sat behind a CDN (Chapter 13). The output below is what this run produced at 03:34 Vietnam time — nginx inside the container writes UTC, so the log says 20:34 the previous day. Your times will differ; the shape will not.</p>

<h3>Step 1 — the census: which codes, how many</h3>
${lenh('s10/trang-thai', 0)}
<p>Column 9 of the "main" format is the status (lesson 2.3). 375 of 458 requests were fine. Everything else is a story. The classes: <strong>2xx</strong> success, <strong>3xx</strong> "look elsewhere" (redirects, 304 Not Modified), <strong>4xx</strong> "the request is the problem" (client side — but read on), <strong>5xx</strong> "the server is the problem".</p>

<h3>Step 2 — the codes nginx produces on its own</h3>
<p>The quickest test: was the upstream (the app) involved? Our format writes <code>urt=</code> (upstream response time). <code>urt=-</code> means nginx answered alone.</p>
${lenh('s10/trang-thai', 1)}
<p><strong>400 Bad Request</strong> — the request line itself is broken; here a path-traversal probe with an encoded <code>../</code> that nginx refuses to parse. Note two oddities: the user agent is <code>-</code> and the client IP is the Docker gateway, not the scanner's IP. nginx rejected the request before it even read the headers, so the real-IP rule (<code>X-Forwarded-For</code>) never ran. A 400 line can lie about who sent it.</p>
${lenh('s10/trang-thai', 3)}
${lenh('s10/trang-thai', 14)}
<p><strong>403 Forbidden</strong> — "I know who you are (or I do not care), and you may not have this". Here a <code>deny all</code> rule. The error log names the reason: <em>access forbidden by rule</em>. In apps, 403 means "logged in but lacking permission" — a frequent bug report when roles are misconfigured.</p>
${lenh('s10/trang-thai', 4)}
${lenh('s10/trang-thai', 13)}
<p><strong>413 Content Too Large</strong> — <code>client_max_body_size 1k</code> and a 2024-byte body. In real life: users cannot upload an avatar, and the app team swears "our code has no limit". The answer is in the <em>proxy's</em> error log.</p>
${lenh('s10/trang-thai', 5)}
${lenh('s10/trang-thai', 12)}
<p><strong>429 Too Many Requests</strong> — the rate limit on <code>/api/login</code> (5 per minute, burst 3). By default nginx's <code>limit_req</code> answers <strong>503</strong>; we set <code>limit_req_status 429</code> because 503 would be misread as "server down". When you see a burst of 503s with <code>urt=-</code>, check for a rate limit before you wake anyone up.</p>
${lenh('s10/trang-thai', 15)}
<p><strong>404 Not Found</strong> — can come from either side. Here all eight 404s came from nginx itself (static root, no such file) — a scanner looking for <code>.env</code>, <code>.git/config</code>, backups. A 404 from the <em>app</em> (<code>urt</code> has a number) is a different question: a wrong route, a deleted resource, or a client calling an old API version.</p>

<h3>Step 3 — 401 and 499: the client's side of the story</h3>
${lenh('s10/trang-thai', 2)}
<p><strong>401 Unauthorized</strong> really means "unauthenticated": no valid credentials. One 401 is a typo; 12 from <code>python-requests</code> in a few seconds is a password-guessing script (lesson 10.9). Also check <em>who</em> issued it — here the app (<code>urt=0.001</code>); a 401 can also come from an API gateway or from nginx <code>auth_basic</code>.</p>
${lenh('s10/trang-thai', 6)}
<p><strong>499</strong> is not in any RFC — it is nginx's private code for "client closed the connection before I could answer". The client here gave up after 0.5 s on <code>/api/report</code>, which normally takes 1.2–1.8 s. One 499 is noise; many 499s on one endpoint mean users (or a mobile app's timeout) are abandoning a slow page — a performance bug that never shows up as an error in the app.</p>

<h3>Step 4 — 500, 502, 504: the back office</h3>
${lenh('s10/trang-thai', 7)}
<p><strong>500 Internal Server Error</strong> — the app answered, and the answer was "I failed". <code>urt=0.030</code>: the app was reachable and fast. The cause is <em>inside</em> the app, so the next stop is the app log with the same request id (lesson 10.4 follows this exact line).</p>
${lenh('s10/trang-thai', 8)}
${lenh('s10/trang-thai', 11)}
<p><strong>502 Bad Gateway</strong> — nginx could not get a valid answer from the app at all. Two error-log flavours: <em>upstream prematurely closed connection</em> (the app died while answering — the very first 502 here, 0.191 s into a request) and <em>connect() failed (111: Connection refused)</em> (nothing listening on the port — the app is down or restarting). A burst of 502s = the app crashed or is redeploying. Next stop: the app's own output just before the first 502.</p>
${lenh('s10/trang-thai', 9)}
${lenh('s10/trang-thai', 10)}
<p><strong>504 Gateway Timeout</strong> — the app accepted the request but did not answer within <code>proxy_read_timeout</code> (5 s). <code>rt=5.000</code> is the giveaway: suspiciously round. The app may still be working on it (and may finish the export after the user got an error!). Next stop: what is slow — a query (Chapter 12), an external API, a lock.</p>
<p><strong>503 Service Unavailable</strong> did not happen here, but you will see it: the app saying "I am overloaded / in maintenance", a load balancer with no healthy targets, or — as above — nginx's default rate-limit answer.</p>

<h3>The one-table summary</h3>
<table>
<thead><tr><th>Code</th><th>Usually produced by</th><th>Error log hint (nginx)</th><th>Ask next</th></tr></thead>
<tbody>
<tr><td>400</td><td>proxy (bad syntax) or app (validation)</td><td>— (often none)</td><td>Scanner? Broken client release?</td></tr>
<tr><td>401</td><td>app / gateway</td><td>—</td><td>Many from one source? Token expired after a deploy?</td></tr>
<tr><td>403</td><td>proxy rule, WAF, or app permission</td><td>access forbidden by rule</td><td>Which rule or role?</td></tr>
<tr><td>404</td><td>either (check <code>urt</code>)</td><td>open() … failed</td><td>Scanner, dead link, or old API version?</td></tr>
<tr><td>413</td><td>proxy</td><td>client intended to send too large body</td><td>Limit too small for the feature?</td></tr>
<tr><td>429 / 503</td><td>proxy rate limit, gateway, app</td><td>limiting requests</td><td>Attack, or a legitimate burst?</td></tr>
<tr><td>499</td><td>nginx only (client left)</td><td>—</td><td>Which endpoint is so slow people give up?</td></tr>
<tr><td>500</td><td>app</td><td>— (proxy was fine)</td><td>App log with the same request id</td></tr>
<tr><td>502</td><td>proxy (app unreachable/died)</td><td>connect() failed (111) / prematurely closed</td><td>Did the app crash or restart? When exactly?</td></tr>
<tr><td>504</td><td>proxy (app too slow)</td><td>upstream timed out (110)</td><td>What is the app waiting for?</td></tr>
</tbody></table>

<div class="pitfall co-tieu-de"><p><strong>"4xx is the client's fault" is a trap.</strong> A deploy that changes a route turns thousands of good requests into 404s; an expired signing key turns every user into a 401; a too-small upload limit produces 413s. Count 4xx per endpoint over time: a sudden jump right after a deploy is a server-side bug wearing a client-side code.</p></div>

<h3>Real-life situations</h3>
<ul>
<li><strong>At an outsourcing company:</strong> the client's tester reports "the site shows 502 every morning around 07:00". You grep the error log: <em>connect() failed (111)</em> at 07:00–07:01, daily. The cron job that redeploys the app at 07:00 is the answer — not a bug in the code. Your reply quotes two log lines and proposes a rolling restart.</li>
<li><strong>Your SWP391 project:</strong> the front end shows "Network Error" and the backend log is empty. If the proxy log says 413 or 504, the request never produced a log line in your Spring/Node app — look one layer earlier.</li>
<li><strong>What if…</strong> the access log shows 200 but the user sees an error page? Some apps return 200 with <code>{"error": …}</code> in the body. The status code is only as honest as the developer who chose it — another reason to log structured error fields (lesson 10.8).</li>
</ul>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok"><ol>
<li>Build Lab 10 and run the traffic script. Produce the census of Step 1 on <em>your</em> logs.</li>
<li>For each code you got, find one line in <code>access.log</code> and, where it exists, its partner in <code>error.log</code> (same second, same client).</li>
<li>Write one sentence per code in the form "produced by …, because …, next I would check …".</li>
<li>Change <code>limit_req_status 429;</code> to a comment, restart nginx (<code>docker restart lgz-nginx</code>), send 6 quick logins with <code>curl -X POST</code>, and see which code appears instead.</li>
</ol>
<p><strong>Done when:</strong> your census has at least 400, 401, 403, 404, 413, 429, 499, 500, 502 and 504; each has a sentence naming who produced it; and step 4 shows 503 with <code>urt=-</code>.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['status code', 'Three-digit result of an HTTP request; first digit = class (2xx success … 5xx server error).'],
  ['upstream', 'The server a proxy forwards to (here the Node app on 127.0.0.1:3000).'],
  ['$upstream_response_time (urt)', 'Time the upstream took; "-" means the proxy answered alone.'],
  ['499', 'nginx-only code: the client closed the connection before the response.'],
  ['502 vs 504', 'Upstream unreachable or died vs upstream too slow (timeout).'],
  ['rate limit', 'Cap on requests per client per time window; nginx limit_req answers 503 unless told otherwise.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>For every code ask: who produced it (proxy, app, CDN), and what log do I open next.</li>
<li><code>urt=-</code> in nginx = nginx answered alone (400/403/404 static/413/429).</li>
<li>500 → app log by request id; 502 → did the app crash/restart (connect() failed, prematurely closed); 504 → what is the app waiting for.</li>
<li>499 = users giving up on something slow; 503 may be a rate limit, not an outage.</li>
<li>A jump in 4xx after a deploy is a server bug.</li>
</ul>
${nguon('📘', 'MDN — HTTP response status codes', 'Official meaning of every code, including 413, 429, 502, 503, 504', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status')}
${nguon('📘', 'nginx — ngx_http_log_module', 'log_format variables: $status, $request_time, $upstream_response_time, $request_id', 'https://nginx.org/en/docs/http/ngx_http_log_module.html')}
${lienKet({ khoa: 'web-foundations', bai: 'wf-6-3-status-codes', title: 'Web Foundations 6.3 — Status codes', sub: 'Choosing the right code when you build an API', cta: 'Open lesson' })}
${lienKet({ khoa: 'nginx', bai: 'nginx-11-4-tu-ma-trang-thai-toi-nguyen-nhan', title: 'nginx 11.4 — From status code to root cause', sub: 'Deeper diagnosis on the nginx side', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>Mã trạng thái cho người đọc log: ai nói ra nó, và hỏi gì tiếp theo</h2>
<p class="lead">Dòng nào trong access log của web cũng mang một con số ba chữ số. Lập trình viên học các con số để <em>trả về</em>; người đọc log cần thứ khác: với mỗi mã, <strong>thành phần nào sinh ra nó</strong> (proxy, app hay CDN) và <strong>phải nhìn vào đâu tiếp theo</strong>. Trong bài này bạn dựng một hệ nhỏ nhưng thật — nginx đứng trước một API Node.js — bắt nó sinh ra cả chục mã khác nhau, rồi đọc từng mã.</p>

<h3>Liên tưởng đời thường: lễ tân và phòng nghiệp vụ</h3>
<p>Bạn gọi điện tới một công ty. Lễ tân (nginx) nhấc máy. Có những câu cô ấy tự trả lời: "nhầm số rồi" (404 với tệp không tồn tại), "anh không có tên trong danh sách" (403), "anh gọi năm lần trong một phút rồi, lát gọi lại" (429), "thư của anh dày quá" (413). Còn lại cô ấy chuyển vào phòng nghiệp vụ (app). Nếu phòng nghiệp vụ nói "bọn tôi làm mất hồ sơ của anh rồi" — đó là 500, lỗi của chính app. Nếu trong phòng không ai nhấc máy — 502. Nếu có người nhấc nhưng loay hoay mãi và lễ tân đành bỏ cuộc — 504. Nếu chính <em>bạn</em> cúp máy trước khi lễ tân kịp trả lời — nginx ghi 499. Mã trạng thái cho bạn biết sự cố nằm <em>ở chỗ nào trong toà nhà</em>.</p>

<h3>Bước 0 — dựng Lab 10 một lần (dùng cho cả chương)</h3>
<p>Ba tệp nhỏ, không framework: một API viết bằng module <code>http</code> có sẵn của Node và thư viện log <strong>pino</strong>, một cấu hình nginx ghi hai kiểu access log, và một script khởi động cả hai container. Hai container dùng chung một không gian mạng, nên nginx gọi app ở <code>127.0.0.1:3000</code> và bạn không phải tạo mạng Docker nào.</p>
${ma('javascript', 's10/web-lab/app.js')}
${ma('nginx', 's10/web-lab/nginx.conf')}
${ma('bash', 's10/web-lab/lab-up.bash')}
<pre><code class="language-bash"># trong một thư mục trống có ba tệp trên + tao-luu-luong.py:
docker run --rm --user "$(id -u):$(id -g)" -e npm_config_cache=/tmp/nc -v "$PWD":/w -w /w node:22-alpine \\
  sh -c 'npm init -y &gt;/dev/null &amp;&amp; npm i pino@9 pino-http@10 pino-pretty@13 winston@3'
bash lab-up.bash                         # in ra: nginx -&gt; app: 200
python3 tao-luu-luong.py               # ~2 phút "lưu lượng ban đêm"; in ra: xong
ls logs/                               # access.log  access.json  app.log  error.log</code></pre>
<p>Script lưu lượng (<code>tao-luu-luong.py</code>, xem ở bài 10.10) đóng vai người dùng bình thường, một máy quét, một script dò mật khẩu, một khách thiếu kiên nhẫn, một lần xuất báo cáo quá lâu, và một request làm sập app. Các khách giả vờ đến từ dải IP chỉ dùng cho tài liệu (RFC 5737) qua <code>X-Forwarded-For</code>, y như lab đang đứng sau một CDN (Chương 13). Output dưới đây là của lần chạy lúc 03:34 giờ Việt Nam — nginx trong container ghi giờ UTC nên log ghi 20:34 ngày hôm trước. Giờ của bạn sẽ khác; hình dạng thì không.</p>

<h3>Bước 1 — điều tra dân số: có những mã nào, bao nhiêu</h3>
${lenh('s10/trang-thai', 0)}
<p>Cột 9 của định dạng "main" là mã trạng thái (bài 2.3). 375 trên 458 request là ổn. Mọi thứ còn lại là một câu chuyện. Các lớp: <strong>2xx</strong> thành công, <strong>3xx</strong> "tìm chỗ khác" (chuyển hướng, 304 Not Modified), <strong>4xx</strong> "request có vấn đề" (phía khách — nhưng đọc tiếp đã), <strong>5xx</strong> "server có vấn đề".</p>

<h3>Bước 2 — những mã nginx tự trả lời</h3>
<p>Cách thử nhanh nhất: upstream (app) có tham gia không? Định dạng của ta ghi <code>urt=</code> (thời gian phản hồi của upstream). <code>urt=-</code> nghĩa là nginx tự trả lời một mình.</p>
${lenh('s10/trang-thai', 1)}
<p><strong>400 Bad Request</strong> — chính dòng request bị hỏng; ở đây là một phát dò path traversal có <code>../</code> mã hoá mà nginx từ chối phân tích. Để ý hai điều lạ: user agent là <code>-</code> và IP khách là cổng Docker chứ không phải IP của máy quét. nginx từ chối request trước cả khi đọc header, nên luật lấy IP thật (<code>X-Forwarded-For</code>) chưa kịp chạy. Một dòng 400 có thể nói sai ai là người gửi.</p>
${lenh('s10/trang-thai', 3)}
${lenh('s10/trang-thai', 14)}
<p><strong>403 Forbidden</strong> — "tôi biết anh là ai (hoặc chẳng quan tâm), và anh không được lấy thứ này". Ở đây là luật <code>deny all</code>. Error log nói rõ lý do: <em>access forbidden by rule</em>. Trong app, 403 nghĩa là "đã đăng nhập nhưng không đủ quyền" — một kiểu báo lỗi rất hay gặp khi cấu hình vai trò sai.</p>
${lenh('s10/trang-thai', 4)}
${lenh('s10/trang-thai', 13)}
<p><strong>413 Content Too Large</strong> — <code>client_max_body_size 1k</code> mà body 2024 byte. Ngoài đời: người dùng không tải được ảnh đại diện lên, đội app thề "mã của bọn tôi không giới hạn gì cả". Câu trả lời nằm trong error log của <em>proxy</em>.</p>
${lenh('s10/trang-thai', 5)}
${lenh('s10/trang-thai', 12)}
<p><strong>429 Too Many Requests</strong> — giới hạn tốc độ trên <code>/api/login</code> (5 lần mỗi phút, cho vượt 3). Mặc định <code>limit_req</code> của nginx trả <strong>503</strong>; ta đặt <code>limit_req_status 429</code> vì 503 dễ bị hiểu nhầm là "server sập". Khi thấy một loạt 503 với <code>urt=-</code>, kiểm tra giới hạn tốc độ trước khi gọi ai dậy.</p>
${lenh('s10/trang-thai', 15)}
<p><strong>404 Not Found</strong> — có thể đến từ bên nào cũng được. Ở đây cả tám 404 đều do nginx tự trả (thư mục tĩnh, không có tệp đó) — một máy quét đang đi tìm <code>.env</code>, <code>.git/config</code>, tệp sao lưu. Một 404 do <em>app</em> trả (<code>urt</code> có số) là câu hỏi khác: sai route, tài nguyên đã xoá, hay khách đang gọi phiên bản API cũ.</p>

<h3>Bước 3 — 401 và 499: câu chuyện phía khách</h3>
${lenh('s10/trang-thai', 2)}
<p><strong>401 Unauthorized</strong> thực ra nghĩa là "chưa xác thực": không có thông tin đăng nhập hợp lệ. Một 401 là gõ nhầm; 12 cái từ <code>python-requests</code> trong vài giây là một script dò mật khẩu (bài 10.9). Cũng phải xem <em>ai</em> trả nó — ở đây là app (<code>urt=0.001</code>); 401 còn có thể do API gateway hay <code>auth_basic</code> của nginx trả.</p>
${lenh('s10/trang-thai', 6)}
<p><strong>499</strong> không có trong RFC nào — đó là mã riêng của nginx, nghĩa là "khách đóng kết nối trước khi tôi kịp trả lời". Khách ở đây bỏ cuộc sau 0,5 giây với <code>/api/report</code>, vốn thường mất 1,2–1,8 giây. Một cái 499 là nhiễu; nhiều 499 trên cùng một endpoint nghĩa là người dùng (hoặc timeout của app di động) đang bỏ một trang chậm — một lỗi hiệu năng không bao giờ hiện thành lỗi trong app.</p>

<h3>Bước 4 — 500, 502, 504: phòng nghiệp vụ</h3>
${lenh('s10/trang-thai', 7)}
<p><strong>500 Internal Server Error</strong> — app đã trả lời, và câu trả lời là "tôi hỏng rồi". <code>urt=0.030</code>: app vẫn với tới được và nhanh. Nguyên nhân nằm <em>bên trong</em> app, nên trạm tiếp theo là log của app với cùng request id (bài 10.4 lần theo đúng dòng này).</p>
${lenh('s10/trang-thai', 8)}
${lenh('s10/trang-thai', 11)}
<p><strong>502 Bad Gateway</strong> — nginx hoàn toàn không lấy được câu trả lời hợp lệ từ app. Hai kiểu dòng error log: <em>upstream prematurely closed connection</em> (app chết giữa lúc đang trả lời — chính là cái 502 đầu tiên ở đây, request đã chạy được 0,191 giây) và <em>connect() failed (111: Connection refused)</em> (không có gì lắng nghe ở cổng — app đang tắt hoặc đang khởi động lại). Một loạt 502 = app sập hoặc đang deploy lại. Trạm tiếp theo: output của chính app ngay trước cái 502 đầu tiên.</p>
${lenh('s10/trang-thai', 9)}
${lenh('s10/trang-thai', 10)}
<p><strong>504 Gateway Timeout</strong> — app đã nhận request nhưng không trả lời trong <code>proxy_read_timeout</code> (5 giây). <code>rt=5.000</code> là dấu hiệu: tròn một cách đáng ngờ. App có thể vẫn đang làm (và có thể xuất xong báo cáo sau khi người dùng đã nhận lỗi!). Trạm tiếp theo: cái gì chậm — một câu truy vấn (Chương 12), một API bên ngoài, hay một khoá.</p>
<p><strong>503 Service Unavailable</strong> không xảy ra ở đây, nhưng bạn sẽ gặp: app nói "tôi quá tải / đang bảo trì", load balancer không còn đích nào khoẻ, hoặc — như trên — câu trả lời mặc định của giới hạn tốc độ nginx.</p>

<h3>Tóm tắt trong một bảng</h3>
<table>
<thead><tr><th>Mã</th><th>Thường do ai sinh</th><th>Gợi ý trong error log (nginx)</th><th>Hỏi tiếp</th></tr></thead>
<tbody>
<tr><td>400</td><td>proxy (sai cú pháp) hoặc app (kiểm tra dữ liệu)</td><td>— (thường không có)</td><td>Máy quét? Bản client mới bị lỗi?</td></tr>
<tr><td>401</td><td>app / gateway</td><td>—</td><td>Nhiều từ một nguồn? Token hết hạn sau khi deploy?</td></tr>
<tr><td>403</td><td>luật proxy, WAF, hoặc phân quyền app</td><td>access forbidden by rule</td><td>Luật nào hay vai trò nào?</td></tr>
<tr><td>404</td><td>bên nào cũng được (xem <code>urt</code>)</td><td>open() … failed</td><td>Máy quét, liên kết chết, hay API cũ?</td></tr>
<tr><td>413</td><td>proxy</td><td>client intended to send too large body</td><td>Giới hạn quá nhỏ cho tính năng?</td></tr>
<tr><td>429 / 503</td><td>giới hạn tốc độ ở proxy, gateway, app</td><td>limiting requests</td><td>Tấn công, hay lưu lượng hợp lệ dồn lên?</td></tr>
<tr><td>499</td><td>chỉ nginx (khách bỏ đi)</td><td>—</td><td>Endpoint nào chậm tới mức người ta bỏ cuộc?</td></tr>
<tr><td>500</td><td>app</td><td>— (proxy vẫn ổn)</td><td>Log app với cùng request id</td></tr>
<tr><td>502</td><td>proxy (không với tới app / app chết)</td><td>connect() failed (111) / prematurely closed</td><td>App sập hay khởi động lại? Chính xác lúc nào?</td></tr>
<tr><td>504</td><td>proxy (app quá chậm)</td><td>upstream timed out (110)</td><td>App đang chờ cái gì?</td></tr>
</tbody></table>

<div class="pitfall co-tieu-de"><p><strong>"4xx là lỗi của khách" là một cái bẫy.</strong> Một lần deploy đổi route biến hàng nghìn request tốt thành 404; một khoá ký token hết hạn biến mọi người dùng thành 401; giới hạn tải lên quá nhỏ sinh ra 413. Hãy đếm 4xx theo endpoint theo thời gian: một cú nhảy vọt ngay sau deploy là lỗi phía server khoác áo mã phía khách.</p></div>

<h3>Tình huống đời thật</h3>
<ul>
<li><strong>Ở công ty outsourcing:</strong> tester phía khách hàng báo "sáng nào khoảng 07:00 web cũng hiện 502". Bạn grep error log: <em>connect() failed (111)</em> lúc 07:00–07:01, ngày nào cũng vậy. Cron job deploy lại app lúc 07:00 là câu trả lời — không phải lỗi trong mã. Thư trả lời của bạn trích hai dòng log và đề xuất khởi động lại cuốn chiếu.</li>
<li><strong>Đồ án SWP391 của bạn:</strong> giao diện báo "Network Error" mà log backend trống trơn. Nếu log proxy ghi 413 hoặc 504, request chưa bao giờ sinh ra dòng log nào trong app Spring/Node của bạn — hãy nhìn sớm hơn một lớp.</li>
<li><strong>Nếu…</strong> access log ghi 200 mà người dùng lại thấy trang lỗi? Có app trả 200 kèm <code>{"error": …}</code> trong body. Mã trạng thái chỉ trung thực bằng người lập trình chọn nó — thêm một lý do để log các trường lỗi có cấu trúc (bài 10.8).</li>
</ul>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
<li>Dựng Lab 10 và chạy script lưu lượng. Làm bảng điều tra dân số ở Bước 1 trên log <em>của bạn</em>.</li>
<li>Với mỗi mã bạn có, tìm một dòng trong <code>access.log</code> và, nếu có, dòng đi kèm trong <code>error.log</code> (cùng giây, cùng khách).</li>
<li>Viết cho mỗi mã một câu theo mẫu "do … sinh ra, vì …, tiếp theo tôi sẽ kiểm tra …".</li>
<li>Biến dòng <code>limit_req_status 429;</code> thành chú thích, khởi động lại nginx (<code>docker restart lgz-nginx</code>), gửi 6 lần đăng nhập liên tiếp bằng <code>curl -X POST</code>, xem mã nào xuất hiện thay thế.</li>
</ol>
<p><strong>Đạt khi:</strong> bảng của bạn có ít nhất 400, 401, 403, 404, 413, 429, 499, 500, 502 và 504; mỗi mã có một câu nói rõ ai sinh ra nó; và bước 4 cho ra 503 với <code>urt=-</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['status code (mã trạng thái)', 'Kết quả ba chữ số của một request HTTP; chữ số đầu = lớp (2xx thành công … 5xx lỗi server).'],
  ['upstream', 'Máy chủ mà proxy chuyển request tới (ở đây là app Node ở 127.0.0.1:3000).'],
  ['$upstream_response_time (urt)', 'Thời gian upstream xử lý; "-" nghĩa là proxy tự trả lời.'],
  ['499', 'Mã riêng của nginx: khách đóng kết nối trước khi có phản hồi.'],
  ['502 vs 504', 'Không với tới upstream hoặc upstream chết, so với upstream quá chậm (hết giờ chờ).'],
  ['rate limit (giới hạn tốc độ)', 'Trần số request của mỗi khách trong một khoảng thời gian; limit_req của nginx trả 503 nếu không đặt khác.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Với mỗi mã hỏi: ai sinh ra nó (proxy, app, CDN), và log nào phải mở tiếp.</li>
<li><code>urt=-</code> trong nginx = nginx tự trả lời (400/403/404 tĩnh/413/429).</li>
<li>500 → log app theo request id; 502 → app có sập/khởi động lại không (connect() failed, prematurely closed); 504 → app đang chờ cái gì.</li>
<li>499 = người dùng bỏ cuộc vì thứ gì đó chậm; 503 có thể là giới hạn tốc độ chứ không phải sập.</li>
<li>4xx tăng vọt sau deploy là lỗi phía server.</li>
</ul>
${nguon('📘', 'MDN — HTTP response status codes', 'Ý nghĩa chính thức của mọi mã, kể cả 413, 429, 502, 503, 504', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status')}
${nguon('📘', 'nginx — ngx_http_log_module', 'Biến của log_format: $status, $request_time, $upstream_response_time, $request_id', 'https://nginx.org/en/docs/http/ngx_http_log_module.html')}
${lienKet({ khoa: 'web-foundations', bai: 'wf-6-3-status-codes', title: 'Web Foundations 6.3 — Mã trạng thái', sub: 'Chọn đúng mã khi bạn viết API', cta: 'Mở bài' })}
${lienKet({ khoa: 'nginx', bai: 'nginx-11-4-tu-ma-trang-thai-toi-nguyen-nhan', title: 'nginx 11.4 — Từ mã trạng thái tới nguyên nhân', sub: 'Chẩn đoán sâu hơn ở phía nginx', cta: 'Mở bài' })}
</div>
`,
};
