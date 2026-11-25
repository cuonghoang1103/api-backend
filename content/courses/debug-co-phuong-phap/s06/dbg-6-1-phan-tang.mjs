/**
 * 6.1 — Tầng nào sai: DNS, TLS, proxy, ứng dụng — và mỗi mã trạng thái thật sự nói gì (soạn 24/11/2026, máy nhà Linux).
 * Output THẬT: curl 8.18 + nginx 1.27.5 (container dbg-c6-nginx) + API node:http (Node 22.22) — scratchpad/dbg/lab/ch6
 * (tools/c61-tang.sh, c61-502.sh, node-tls.mjs; o-61-*.txt). Mã: s06/_ma-6.mjs.
 */
import { nguon, lienKet } from '../_chung.mjs';
import { API, NGINX, NODE_TLS } from './_ma-6.mjs';

const ma = (s, lang = 'js') => `<pre><code class="language-${lang}">${s}</code></pre>`;

const OUT_TANG = `<div class="out">$ curl -sS http://labflow.khong-ton-tai.test/api/phong
curl: (6) Could not resolve host: labflow.khong-ton-tai.test                         [exit 6]   ← DNS

$ curl -sS http://127.0.0.1:41619/api/phong
curl: (7) Failed to connect to 127.0.0.1 port 41619 after 0 ms: Could not connect to server   [exit 7]   ← TCP: refused

$ curl -sS -m 3 http://192.0.2.1/api/phong
curl: (28) Connection timed out after 3002 milliseconds                               [exit 28]  ← TCP: no answer

$ curl -sS --resolve labflow.test:41643:127.0.0.1 https://labflow.test:41643/api/phong
curl: (60) SSL certificate OpenSSL verify result: unable to get local issuer certificate (20)   [exit 60]  ← TLS: unknown CA

$ curl -sS --cacert nginx/tls/ca.pem https://127.0.0.1:41643/api/phong
curl: (60) SSL: no alternative certificate subject name matches target ipv4 address '127.0.0.1'   [exit 60]  ← TLS: wrong name

$ curl -sS --cacert nginx/tls/ca.pem --resolve labflow.test:41644:127.0.0.1 https://labflow.test:41644/
curl: (60) SSL certificate OpenSSL verify result: certificate has expired (10)        [exit 60]  ← TLS: expired

$ curl -sS --cacert nginx/tls/ca.pem --resolve labflow.test:41643:127.0.0.1 https://labflow.test:41643/api/phong
[{"id":401,"ten":"Lab 401","choNgoi":30},{"id":402,"ten":"Lab 402","choNgoi":24}]   [exit 0]   ← all layers OK

$ curl -sS http://127.0.0.1:41643/api/phong
&lt;head&gt;&lt;title&gt;400 The plain HTTP request was sent to HTTPS port&lt;/title&gt;&lt;/head&gt;   …   &lt;center&gt;nginx/1.27.5&lt;/center&gt;</div>`;

const OUT_NODE_TLS = `<div class="out">$ node tools/node-tls.mjs
UNABLE_TO_VERIFY_LEAF_SIGNATURE: unable to verify the first certificate

$ NODE_TLS_REJECT_UNAUTHORIZED=0 node tools/node-tls.mjs           # the WRONG "fix"
(node:2839847) Warning: Setting the NODE_TLS_REJECT_UNAUTHORIZED environment variable to '0' makes TLS connections
and HTTPS requests insecure by disabling certificate verification.
200 [{"id":401,"ten":"Lab 401","choNgoi":30},{"id":402,"ten":"Lab 402","choNgoi":24}]

$ NODE_EXTRA_CA_CERTS=nginx/tls/ca.pem node tools/node-tls.mjs     # the right fix: trust exactly one more CA
200 [{"id":401,"ten":"Lab 401","choNgoi":30},{"id":402,"ten":"Lab 402","choNgoi":24}]</div>`;

const OUT_AI_NOI = `<div class="out">$ curl -s -i 127.0.0.1:41610/api/phong/999
HTTP/1.1 404 Not Found
Server: nginx/1.27.5
Content-Type: application/json; charset=utf-8
{"loi":"Không có phòng 999"}                       ← the APP answered: route exists, the DATA does not

$ curl -s -i 127.0.0.1:41610/api/phongg
HTTP/1.1 404 Not Found
Server: nginx/1.27.5
Content-Type: application/json; charset=utf-8
{"loi":"Không có tuyến GET /api/phongg"}           ← the APP answered: no such ROUTE (typo in the URL)

$ curl -s -i 127.0.0.1:41610/khong-co
HTTP/1.1 404 Not Found
Server: nginx/1.27.5
Content-Type: text/html
&lt;head&gt;&lt;title&gt;404 Not Found&lt;/title&gt;&lt;/head&gt;           ← NGINX answered: the request never reached the app

$ curl -s -i 127.0.0.1:41610/api/toi
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer realm="labflow"
{"loi":"Chưa đăng nhập hoặc token sai"}             ← who are you? (no/invalid token)

$ curl -s -i -H 'Authorization: Bearer sv-gia' 127.0.0.1:41610/api/bao-cao
HTTP/1.1 403 Forbidden
{"loi":"Vai trò SV không được xem báo cáo"}         ← I know who you are; you may not

$ head -c 70000 /dev/zero | tr '\\0' a | curl -s -i -X POST --data-binary @- -H 'Content-Type: application/json' 127.0.0.1:41610/api/dat-cho
HTTP/1.1 413 Request Entity Too Large
Server: nginx/1.27.5
&lt;head&gt;&lt;title&gt;413 Request Entity Too Large&lt;/title&gt;&lt;/head&gt;   ← nginx: client_max_body_size 64k; the app never saw it</div>`;

const OUT_502 = `<div class="out">### 502 (1): API không chạy
$ curl -s -o /dev/null -w '%{http_code} %{time_total}s\\n'  127.0.0.1:41610/api/phong
502 0.000342s
--- nginx error.log
[error] 30#30: *37 connect() failed (111: Connection refused) while connecting to upstream,
        request: "GET /api/phong HTTP/1.1", upstream: "http://127.0.0.1:41611/api/phong"
--- nginx access.log
2026-11-23T22:18:09+00:00 rid=97ee8caea13ddfe15ec50b20f506c8ff "GET /api/phong HTTP/1.1" 502 rt=0.001 urt=0.001 us=502 ua=127.0.0.1:41611
--- api.log
(empty)

### 502 (2): API chết giữa chừng khi đang trả lời
$ curl -s -o /dev/null -w '%{http_code} %{time_total}s\\n'  127.0.0.1:41610/api/sap
502 0.001423s
--- nginx error.log
[error] 30#30: *39 upstream prematurely closed connection while reading response header from upstream,
        request: "GET /api/sap HTTP/1.1", upstream: "http://127.0.0.1:41611/api/sap"
--- nginx access.log
2026-11-23T22:18:10+00:00 rid=dc37431b6c5b9a29dca450f2750c8ef2 "GET /api/sap HTTP/1.1" 502 rt=0.002 urt=0.002 us=502 ua=127.0.0.1:41611
--- api.log
{"lvl":"warn","svc":"api-node","msg":"bên kia đóng kết nối trước khi trả lời xong","rid":"b37acd15","method":"GET","path":"/api/sap","ms":1}

### 502 (3): API trả header quá to
$ curl -s -o /dev/null -w '%{http_code} %{time_total}s\\n'  127.0.0.1:41610/api/header-to
502 0.001368s
--- nginx error.log
[error] 30#30: *41 upstream sent too big header while reading response header from upstream,
        request: "GET /api/header-to HTTP/1.1", upstream: "http://127.0.0.1:41611/api/header-to"
--- nginx access.log
2026-11-23T22:18:11+00:00 rid=45e2565ec7729c6aa0c1c839b186313f "GET /api/header-to HTTP/1.1" 502 rt=0.001 urt=0.001 us=502 ua=127.0.0.1:41611
--- api.log
{"lvl":"info","svc":"api-node","rid":"e908d5c3","msg":"xong","method":"GET","path":"/api/header-to","status":200,"ms":0}
                                                               ← the APP logged 200. The user got 502.</div>`;

const OUT_504 = `<div class="out">### 504: API trả lời chậm hơn proxy_read_timeout 3s
$ curl -s -o /dev/null -w '%{http_code} %{time_total}s\\n'  127.0.0.1:41610/api/cham?ms=5000
504 3.003219s
--- nginx error.log
[error] 30#30: *43 upstream timed out (110: Operation timed out) while reading response header from upstream,
        request: "GET /api/cham?ms=5000 HTTP/1.1", upstream: "http://127.0.0.1:41611/api/cham?ms=5000"
--- nginx access.log
2026-11-23T22:18:14+00:00 rid=0254b6e4e4e97c288118e48800cc9c21 "GET /api/cham?ms=5000 HTTP/1.1" 504 rt=3.003 urt=3.004 us=504 ua=127.0.0.1:41611
--- api.log
{"lvl":"warn","svc":"api-node","msg":"bên kia đóng kết nối trước khi trả lời xong","rid":"be3e47b0","method":"GET","path":"/api/cham","ms":3003}

### 499: client bỏ đi trước (curl -m 1)
$ curl -s -o /dev/null -w '%{http_code} %{time_total}s\\n' -m 1 127.0.0.1:41610/api/cham?ms=2500
000 1.000768s                                            ← curl has no status: it hung up
--- nginx error.log
(empty)
--- nginx access.log
2026-11-23T22:18:16+00:00 rid=86ab047e2cb94666d9b05141828bf400 "GET /api/cham?ms=2500 HTTP/1.1" 499 rt=1.000 urt=1.001 us=- ua=127.0.0.1:41611
--- api.log
{"lvl":"warn","svc":"api-node","msg":"bên kia đóng kết nối trước khi trả lời xong","rid":"aa41de17","method":"GET","path":"/api/cham","ms":1001}</div>`;

const BANG_EN = `<table>
<thead><tr><th>What you see</th><th>Layer</th><th>Who said it</th><th>Look next</th></tr></thead>
<tbody>
<tr><td>curl (6) / ENOTFOUND / ERR_NAME_NOT_RESOLVED</td><td>DNS</td><td>your resolver</td><td>spelling, /etc/hosts, VPN, <code>dig</code>, <code>getent hosts</code></td></tr>
<tr><td>curl (7) / ECONNREFUSED</td><td>TCP</td><td>the target machine's kernel: nobody listens</td><td>process up? right port? bound to 127.0.0.1 only?</td></tr>
<tr><td>curl (28) / ETIMEDOUT</td><td>TCP / network</td><td>nobody — packets vanish</td><td>firewall, security group, wrong IP, VPN</td></tr>
<tr><td>curl (60) / UNABLE_TO_VERIFY… / CERT_HAS_EXPIRED</td><td>TLS</td><td>your client refused the certificate</td><td>CA, name (SAN), dates, missing intermediate</td></tr>
<tr><td>HTML error page "nginx" (400/404/413/502/504)</td><td>proxy</td><td>nginx</td><td>nginx <code>error.log</code>, then the app</td></tr>
<tr><td>JSON error in your app's format</td><td>application</td><td>your code</td><td>app log for that request</td></tr>
</tbody></table>`;

const BANG_VI = `<table>
<thead><tr><th>Bạn thấy</th><th>Tầng</th><th>Ai nói</th><th>Xem tiếp ở đâu</th></tr></thead>
<tbody>
<tr><td>curl (6) / ENOTFOUND / ERR_NAME_NOT_RESOLVED</td><td>DNS</td><td>bộ phân giải tên của máy bạn</td><td>chính tả, /etc/hosts, VPN, <code>dig</code>, <code>getent hosts</code></td></tr>
<tr><td>curl (7) / ECONNREFUSED</td><td>TCP</td><td>nhân hệ điều hành máy đích: không ai nghe cổng đó</td><td>tiến trình có chạy? đúng cổng? chỉ nghe 127.0.0.1?</td></tr>
<tr><td>curl (28) / ETIMEDOUT</td><td>TCP / mạng</td><td>không ai cả — gói tin biến mất</td><td>tường lửa, security group, sai IP, VPN</td></tr>
<tr><td>curl (60) / UNABLE_TO_VERIFY… / CERT_HAS_EXPIRED</td><td>TLS</td><td>chính client của bạn từ chối chứng chỉ</td><td>CA, tên (SAN), ngày hiệu lực, thiếu chứng chỉ trung gian</td></tr>
<tr><td>Trang lỗi HTML có chữ "nginx" (400/404/413/502/504)</td><td>proxy</td><td>nginx</td><td><code>error.log</code> của nginx, rồi mới tới app</td></tr>
<tr><td>Lỗi JSON đúng định dạng app của bạn</td><td>ứng dụng</td><td>mã của bạn</td><td>log app của đúng request đó</td></tr>
</tbody></table>`;

const MA_TRA = `<table>
<thead><tr><th>Code</th><th>EN — what it really says</th><th>VI — thật sự nói gì</th></tr></thead>
<tbody>
<tr><td>400</td><td>I could not understand the request (syntax, missing field, cookie too large…)</td><td>Tôi không hiểu request (sai cú pháp, thiếu trường, cookie quá to…)</td></tr>
<tr><td>401</td><td>Who are you? No or invalid credentials. Comes with <code>WWW-Authenticate</code>.</td><td>Bạn là ai? Thiếu hoặc sai giấy tờ. Đi kèm <code>WWW-Authenticate</code>.</td></tr>
<tr><td>403</td><td>I know who you are; you are not allowed.</td><td>Tôi biết bạn là ai; bạn không được phép.</td></tr>
<tr><td>404</td><td>Not found — the route, or the record. Read the body to tell which.</td><td>Không thấy — tuyến, hoặc bản ghi. Đọc body mới biết cái nào.</td></tr>
<tr><td>405 / 415</td><td>Wrong method / wrong Content-Type for this route.</td><td>Sai method / sai Content-Type cho tuyến này.</td></tr>
<tr><td>409 / 422</td><td>Conflicts with current state / understood but invalid.</td><td>Xung đột với trạng thái hiện tại / hiểu nhưng dữ liệu không hợp lệ.</td></tr>
<tr><td>413 / 431</td><td>Body too large / headers too large (often said by the proxy).</td><td>Body quá to / header quá to (thường do proxy nói).</td></tr>
<tr><td>499</td><td>nginx only: the client hung up before the answer.</td><td>Chỉ nginx có: client cúp máy trước khi có trả lời.</td></tr>
<tr><td>500</td><td>The app crashed or threw. The app said it.</td><td>App lỗi hoặc ném ngoại lệ. Do app nói.</td></tr>
<tr><td>502</td><td>The proxy got no valid answer from upstream (refused, closed early, garbage header).</td><td>Proxy không nhận được câu trả lời hợp lệ từ upstream (từ chối, đóng sớm, header hỏng).</td></tr>
<tr><td>503</td><td>Deliberately unavailable: overload, maintenance, no healthy upstream.</td><td>Cố ý không phục vụ: quá tải, bảo trì, không còn upstream khoẻ.</td></tr>
<tr><td>504</td><td>The proxy waited for upstream and gave up (timeout).</td><td>Proxy chờ upstream rồi bỏ cuộc (hết giờ).</td></tr>
</tbody></table>`;

const NGUON = [
  nguon('📘', 'curl — exit codes (man curl, "EXIT CODES")', 'Danh sách đầy đủ mã thoát 6, 7, 28, 35, 60… và ý nghĩa.', 'https://curl.se/docs/manpage.html#EXIT'),
  nguon('📗', 'nginx — ngx_http_proxy_module', 'proxy_connect_timeout, proxy_read_timeout, proxy_buffer_size và các thông báo lỗi upstream.', 'https://nginx.org/en/docs/http/ngx_http_proxy_module.html'),
  nguon('📜', 'RFC 9110 — HTTP Semantics, §15 Status Codes', 'Định nghĩa chuẩn của 401/403/404/502/503/504.', 'https://www.rfc-editor.org/rfc/rfc9110#name-status-codes'),
  nguon('🔐', 'Georgiev et al. — The Most Dangerous Code in the World (ACM CCS 2012)', 'Nghiên cứu: kiểm chứng chỉ SSL bị tắt/sai trong rất nhiều thư viện và ứng dụng ngoài trình duyệt.', 'https://crypto.stanford.edu/~dabo/pubs/abstracts/ssl-client-bugs.html'),
  nguon('📅', 'Let\'s Encrypt — DST Root CA X3 Expiration (30/09/2021)', 'Gốc cũ hết hạn: thiết bị/OpenSSL cũ đồng loạt lỗi chứng chỉ dù trang web không đổi gì.', 'https://letsencrypt.org/docs/dst-root-ca-x3-expiration-september-2021/'),
  lienKet({ khoa: 'networking-for-developers', bai: 'netdev-10-4-ma-loi-gateway', title: 'Mạng cho developer 10.4 — Đọc đúng 502, 503, 504 và 524', sub: 'Mã lỗi cổng vào ở mức hạ tầng (Cloudflare, load balancer).', cta: 'Mở bài →' }),
  lienKet({ khoa: 'networking-for-developers', bai: 'netdev-6-4-loi-tls', title: 'Mạng cho developer 6.4 — Chẩn đoán lỗi TLS', sub: 'openssl s_client, chuỗi chứng chỉ, SNI — chi tiết hơn bài này.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'api-design', bai: 'api-1-3-status', title: 'API Design 1.3 — Mã trạng thái có ý nghĩa', sub: 'Phía người thiết kế API: chọn 400/422, 401/403, 404/410, 409.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '6.1 — Which layer is wrong: DNS, TLS, proxy, app — and what each status code really says|||6.1 — Tầng nào sai: DNS, TLS, proxy, ứng dụng — và mỗi mã trạng thái thật sự nói gì',
  slug: 'dbg-6-1-phan-tang',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Một request đi qua DNS → TCP → TLS → proxy → ứng dụng; mỗi tầng hỏng có chữ ký riêng (curl exit 6/7/28/60, lỗi Node ENOTFOUND/ECONNREFUSED/UNABLE_TO_VERIFY). Chạy thật với nginx 1.27 trước API Node: 404 do tuyến vs do dữ liệu vs do nginx, 401 vs 403, 413 do proxy; ba lỗi 502 khác nguyên nhân (app tắt, app đóng sớm, header quá to — app vẫn ghi 200), 504 và 499. Góc hacker: tắt kiểm chứng chỉ (NODE_TLS_REJECT_UNAUTHORIZED=0) và nghiên cứu năm 2012.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Before blaming the API, find the layer</h2>
<p class="lead">"The API is broken" is the most common sentence in a team chat, and one of the least useful. A request crosses at least five layers before your code runs: name lookup, TCP connection, TLS, one or more proxies, then the application. Each layer fails with its own signature. Learn the signatures and you will name the broken layer from one line of output — before opening any code.</p>

<h3>An everyday picture: sending a parcel through several stations</h3>
<p>You write an address (DNS turns it into coordinates), the courier drives to the building (TCP), the guard checks the courier's ID card (TLS certificate), the mailroom on the ground floor sorts parcels (reverse proxy — nginx), and finally the person upstairs opens it (your app). When a parcel comes back, look at <em>who wrote the return note</em>: "address does not exist" is not the recipient's fault; "the mailroom waited 3 seconds and nobody upstairs answered" is a different story from "the recipient read it and refused".</p>

<h3>The setup for this chapter</h3>
<p>All outputs below are real runs on the course machine: <strong>nginx 1.27.5</strong> in a container (<code>dbg-c6-nginx</code>, listening on 127.0.0.1:41610 for HTTP and :41643 for HTTPS) in front of the LabFlow API (plain <code>node:http</code>, Node 22, 127.0.0.1:41611). The TLS certificate is for <code>labflow.test</code>, signed by our own "LabFlow Dev CA"; port 41644 serves an expired one. Code is at the end of the lesson; the API has a few deliberately broken routes (<code>/api/sap</code>, <code>/api/header-to</code>, <code>/api/cham?ms=</code>).</p>

<h3>1. Below HTTP: no status code at all</h3>
<p>If the failure is below HTTP, there is <strong>no status code</strong>. Do not invent one ("it returns 500") — read the client's error.</p>
${OUT_TANG}
${BANG_EN}
<p>Three details people miss. <strong>Refused vs timeout</strong>: refused (7) is fast and means the machine is reachable but nothing listens on that port — usually the process is down or bound to 127.0.0.1 inside a container. Timeout (28) is slow and means packets disappear — firewall, wrong IP, security group. <strong>TLS errors come from your own client</strong>: the server did answer; your side rejected the certificate. <strong>The name matters</strong>: the same CA, same server, same port fails when you connect by IP, because the certificate says <code>labflow.test</code>. That is why <code>curl --resolve labflow.test:41643:127.0.0.1</code> exists: it keeps the right name (for SNI, certificate check and the Host header) while forcing the IP.</p>
<p>Node shows the same layers with different names: <code>ENOTFOUND</code>, <code>ECONNREFUSED</code>, <code>ETIMEDOUT</code>, <code>UNABLE_TO_VERIFY_LEAF_SIGNATURE</code>, <code>CERT_HAS_EXPIRED</code>, <code>ERR_TLS_CERT_ALTNAME_INVALID</code>. Inside <code>fetch</code> they hide behind "TypeError: fetch failed" — always log <code>err.cause</code>, which holds the real code.</p>
${OUT_NODE_TLS}

<h3>2. Who wrote this error? Read the body, not the Server header</h3>
${OUT_AI_NOI}
<p>Every response above carries <code>Server: nginx/1.27.5</code>, even the ones your app wrote — the proxy adds it to everything that passes through. So the <code>Server</code> header does not tell you who answered. The <strong>body</strong> does: an HTML page with "nginx" at the bottom was written by nginx; JSON in your app's format was written by your app. Three 404s here mean three different things: a missing record (fix the data or the id), a wrong route (fix the URL — often a typo or a missing <code>/api</code> prefix), and a path the proxy does not forward at all (fix the proxy config).</p>
<p><strong>401 vs 403</strong> is the same split: 401 = "who are you?" (no token, expired token, the token was not sent at all — check the request headers before the code); 403 = "I know you, and no" (role, ownership, CSRF in Spring). Real tickets often say "403" for both; your first job is to check which one.</p>
${MA_TRA}

<h3>3. One 502, three different causes</h3>
<p>502 Bad Gateway always means the same sentence — "the proxy did not get a valid answer from upstream" — but the reason is in the <strong>proxy's error log</strong>, never in the browser. Here is the same <code>502</code> produced three ways:</p>
${OUT_502}
<p>Learn these three nginx lines by heart:</p>
<ul>
<li><code>connect() failed (111: Connection refused)</code> — the app is not listening: crashed, restarting, wrong port in <code>proxy_pass</code>, or the container is up but the process inside is not. App log: nothing.</li>
<li><code>upstream prematurely closed connection</code> — the app accepted the request, then the connection died: process killed (OOM, crash, deploy), socket destroyed, a keep-alive timeout on the app shorter than nginx's. App log: maybe a warning, maybe nothing.</li>
<li><code>upstream sent too big header</code> — the app answered, but its headers exceed <code>proxy_buffer_size</code> (4k/8k by default). Classic triggers: a huge <code>Set-Cookie</code>, a JWT in a header, debug headers. <strong>The app log says 200</strong> — the most confusing case of all, and the reason you never close a 502 ticket by reading only the app log.</li>
</ul>

<h3>4. 504 and 499: somebody stopped waiting</h3>
${OUT_504}
<p><strong>504</strong>: nginx waited <code>proxy_read_timeout</code> (here 3 s, default 60 s) and gave up — look at <code>rt=3.003</code>: exactly the timeout. The app was still working; when it finally finished, nobody was listening. If the operation had side effects (sent an email, charged a card) it still happened — users who retry create duplicates. <strong>499</strong> exists only in nginx logs: the client hung up first (user closed the tab, mobile app timeout, a front-end <code>AbortController</code>). Many 499s on one endpoint = the client's timeout is shorter than the server's real duration.</p>
<p>Notice the access log fields we added: <code>urt</code> (upstream response time) and <code>us</code> (upstream status). <code>rt</code> ≈ <code>urt</code> ⇒ the time was spent in the app; <code>rt</code> ≫ <code>urt</code> ⇒ the time was spent sending to a slow client. <code>us=-</code> ⇒ the upstream never answered.</p>

<h3>The layer checklist (in this order)</h3>
<ol>
<li>Is there an HTTP status at all? No ⇒ DNS / TCP / TLS — read the client error code.</li>
<li>Who wrote the body? HTML from the proxy ⇒ proxy error log; app's JSON ⇒ app log.</li>
<li>For 502/504: proxy error log line ⇒ which of refused / closed early / too big header / timed out.</li>
<li>Only then open the code — at the line the app log points to.</li>
</ol>

<h3>Hacker corner: "just turn off certificate checking"</h3>
<p>The quickest way to "fix" error 60 or <code>UNABLE_TO_VERIFY_LEAF_SIGNATURE</code> is <code>curl -k</code>, <code>NODE_TLS_REJECT_UNAUTHORIZED=0</code>, <code>rejectUnauthorized: false</code>, or Java's "trust all" <code>TrustManager</code>. It works — and from that moment anyone on the network path (café Wi-Fi, a compromised router) can impersonate the server and read every token. In 2012, Georgiev et al. ("The Most Dangerous Code in the World", ACM CCS) showed certificate validation broken in payment SDKs, cloud clients and mobile apps — mostly because developers disabled it to get past a test error and shipped it. Fix the real cause instead: add the internal CA (<code>NODE_EXTRA_CA_CERTS</code>, <code>--cacert</code>, a Java truststore), use the right host name, renew the certificate. If you ever must use <code>-k</code> to investigate, never let it reach a commit. When Let's Encrypt's old root (DST Root CA X3) expired on 30/09/2021, many old devices and OpenSSL 1.0.2 clients failed overnight with no change on the server side — the classic "nothing changed, but TLS broke" ticket.</p>

<h3>On the job</h3>
<p>In an outsourcing team the front end, the API and the infrastructure often belong to different people — sometimes different companies. A ticket like "Login returns 502 on UAT" bounces for days if nobody names the layer. Your reply should be one paragraph with evidence: "502 is from nginx on UAT; its error log at 10:42 says <code>upstream timed out … /api/auth/login</code>; the auth service takes 65 s because the LDAP call hangs. The front end and the API code are fine; please check the LDAP connection from the UAT server." That is a ticket that gets closed.</p>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok">
<ol>
<li>Start the chapter setup (code below). Reproduce exit codes 6, 7, 28 and 60 with curl; for each, write one sentence naming the layer.</li>
<li>Call the same HTTPS endpoint from Node: once failing, once with <code>NODE_EXTRA_CA_CERTS</code>. Print <code>err.cause.code</code> when you use <code>fetch</code>.</li>
<li>Produce the three 502s and the 504; paste the nginx <code>error.log</code> line for each next to the app log line.</li>
<li>Make a 499 with <code>curl -m 1</code>. Explain the difference between <code>rt</code> and <code>urt</code> in the access log.</li>
</ol>
<p><strong>Done when:</strong> given any failing request, you name the layer and who wrote the error in under a minute, with the log line as proof.</p>
</div>
<details><summary>Chapter setup: API (api/api.mjs), nginx.conf, node-tls.mjs</summary>${ma(API)}${ma(NGINX, 'nginx')}${ma(NODE_TLS)}</details>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Upstream</span><span class="v">The server a proxy forwards to (here: the Node API behind nginx).</span></div>
  <div class="kv"><span class="k">Reverse proxy</span><span class="v">Server in front of your app: TLS, routing, limits, timeouts (nginx, a load balancer, API gateway).</span></div>
  <div class="kv"><span class="k">SNI</span><span class="v">The host name the client sends inside the TLS handshake so the server picks the right certificate.</span></div>
  <div class="kv"><span class="k">SAN</span><span class="v">Subject Alternative Name — the names a certificate is valid for.</span></div>
  <div class="kv"><span class="k">502 / 504</span><span class="v">Proxy got no valid answer / proxy gave up waiting.</span></div>
  <div class="kv"><span class="k">499</span><span class="v">nginx-only: the client closed the connection before the response.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>No status code ⇒ the failure is below HTTP: read curl's exit code or Node's <code>err.cause.code</code>.</li>
<li>The body tells who answered; the <code>Server</code> header does not.</li>
<li>404, 401/403 each hide different causes — read the body and the request headers.</li>
<li>502 has many causes; the proxy's error log names it. The app may even have logged 200.</li>
<li>504 = proxy timeout, the work may still complete; 499 = the client gave up.</li>
<li>Never "fix" TLS by disabling verification.</li>
</ul>
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Trước khi đổ cho API, hãy tìm tầng</h2>
<p class="lead">"API hỏng rồi" là câu hay gặp nhất trong nhóm chat của dự án, và cũng là câu ít giá trị nhất. Một request đi qua ít nhất năm tầng trước khi tới mã của bạn: tra tên, kết nối TCP, TLS, một hay nhiều proxy, rồi mới tới ứng dụng. Mỗi tầng hỏng theo một chữ ký riêng. Thuộc các chữ ký đó, bạn gọi tên được tầng hỏng chỉ từ một dòng output — trước khi mở bất kỳ dòng mã nào.</p>

<h3>Liên tưởng đời thường: gửi bưu phẩm qua nhiều trạm</h3>
<p>Bạn ghi địa chỉ (DNS đổi nó thành toạ độ), shipper chạy tới toà nhà (TCP), bảo vệ kiểm thẻ của shipper (chứng chỉ TLS), phòng thư ở tầng trệt phân loại (reverse proxy — nginx), cuối cùng người ở tầng trên mới mở gói (app của bạn). Khi gói bị trả về, hãy xem <em>ai viết tờ giấy báo</em>: "địa chỉ không tồn tại" không phải lỗi người nhận; "phòng thư chờ 3 giây mà tầng trên không ai trả lời" là chuyện khác hẳn "người nhận đọc rồi từ chối".</p>

<h3>Môi trường của chương này</h3>
<p>Mọi output dưới đây là lần chạy thật trên máy soạn bài: <strong>nginx 1.27.5</strong> trong container (<code>dbg-c6-nginx</code>, nghe 127.0.0.1:41610 cho HTTP và :41643 cho HTTPS) đứng trước API LabFlow (<code>node:http</code> thuần, Node 22, 127.0.0.1:41611). Chứng chỉ TLS cấp cho tên <code>labflow.test</code>, do "LabFlow Dev CA" của chính mình ký; cổng 41644 dùng một chứng chỉ đã hết hạn. Mã ở cuối bài; API có vài tuyến cố ý hỏng (<code>/api/sap</code>, <code>/api/header-to</code>, <code>/api/cham?ms=</code>).</p>

<h3>1. Dưới tầng HTTP: chẳng có mã trạng thái nào</h3>
<p>Nếu lỗi nằm dưới HTTP thì <strong>không có mã trạng thái</strong>. Đừng bịa ra ("nó trả 500") — hãy đọc lỗi của client.</p>
${OUT_TANG}
${BANG_VI}
<p>Ba chi tiết hay bị bỏ qua. <strong>Bị từ chối khác hết giờ</strong>: từ chối (7) đến ngay và nghĩa là tới được máy nhưng không ai nghe cổng đó — thường do tiến trình đã chết, hoặc trong container nó chỉ nghe 127.0.0.1. Hết giờ (28) thì chậm và nghĩa là gói tin biến mất — tường lửa, sai IP, security group. <strong>Lỗi TLS do chính client của bạn nói</strong>: server có trả lời; phía bạn từ chối chứng chỉ. <strong>Tên rất quan trọng</strong>: cùng CA, cùng server, cùng cổng mà gọi bằng IP là hỏng, vì chứng chỉ ghi <code>labflow.test</code>. Vì vậy mới có <code>curl --resolve labflow.test:41643:127.0.0.1</code>: giữ đúng tên (cho SNI, cho việc kiểm chứng chỉ và header Host) mà vẫn ép đi tới IP mình muốn.</p>
<p>Node báo đúng các tầng đó bằng tên khác: <code>ENOTFOUND</code>, <code>ECONNREFUSED</code>, <code>ETIMEDOUT</code>, <code>UNABLE_TO_VERIFY_LEAF_SIGNATURE</code>, <code>CERT_HAS_EXPIRED</code>, <code>ERR_TLS_CERT_ALTNAME_INVALID</code>. Bên trong <code>fetch</code> chúng nấp sau "TypeError: fetch failed" — luôn log <code>err.cause</code>, nơi chứa mã thật.</p>
${OUT_NODE_TLS}

<h3>2. Ai viết lỗi này? Đọc body, đừng đọc header Server</h3>
${OUT_AI_NOI}
<p>Mọi response ở trên đều có <code>Server: nginx/1.27.5</code>, kể cả cái do app của bạn viết — proxy gắn nó cho mọi thứ đi qua. Vậy header <code>Server</code> không cho biết ai trả lời. <strong>Body</strong> mới cho biết: trang HTML có chữ "nginx" ở đáy là nginx viết; JSON đúng kiểu của app là app viết. Ba lỗi 404 ở đây mang ba nghĩa: thiếu bản ghi (sửa dữ liệu hoặc id), sai tuyến (sửa URL — thường gõ nhầm hoặc thiếu tiền tố <code>/api</code>), và đường dẫn proxy không hề chuyển vào (sửa cấu hình proxy).</p>
<p><strong>401 với 403</strong> cũng tách đôi như vậy: 401 = "bạn là ai?" (thiếu token, token hết hạn, token không hề được gửi — xem header request trước khi xem mã); 403 = "tôi biết bạn, và không" (vai trò, quyền sở hữu, CSRF trong Spring). Ticket thật hay ghi "403" cho cả hai; việc đầu tiên của bạn là xem đúng là mã nào.</p>
${MA_TRA}

<h3>3. Một lỗi 502, ba nguyên nhân khác nhau</h3>
<p>502 Bad Gateway lúc nào cũng nói cùng một câu — "proxy không nhận được câu trả lời hợp lệ từ upstream" — nhưng lý do nằm ở <strong>error log của proxy</strong>, không bao giờ ở trình duyệt. Đây là cùng một mã <code>502</code> tạo ra bằng ba cách:</p>
${OUT_502}
<p>Thuộc lòng ba dòng nginx này:</p>
<ul>
<li><code>connect() failed (111: Connection refused)</code> — app không nghe: đã chết, đang khởi động lại, sai cổng trong <code>proxy_pass</code>, hoặc container vẫn chạy mà tiến trình bên trong thì không. Log app: trống trơn.</li>
<li><code>upstream prematurely closed connection</code> — app đã nhận request rồi kết nối chết: tiến trình bị giết (hết bộ nhớ, crash, deploy), socket bị huỷ, keep-alive timeout của app ngắn hơn của nginx. Log app: có thể một cảnh báo, có thể không gì cả.</li>
<li><code>upstream sent too big header</code> — app có trả lời, nhưng header vượt <code>proxy_buffer_size</code> (mặc định 4k/8k). Thủ phạm quen: <code>Set-Cookie</code> khổng lồ, JWT nhét trong header, header gỡ lỗi. <strong>Log app ghi 200</strong> — ca khó hiểu nhất, và là lý do không bao giờ đóng ticket 502 chỉ bằng việc đọc log app.</li>
</ul>

<h3>4. 504 và 499: có người đã thôi chờ</h3>
${OUT_504}
<p><strong>504</strong>: nginx chờ <code>proxy_read_timeout</code> (ở đây 3 s, mặc định 60 s) rồi bỏ cuộc — nhìn <code>rt=3.003</code>: đúng bằng thời hạn. App vẫn đang làm; khi nó làm xong thì chẳng còn ai nghe. Nếu thao tác có tác dụng phụ (gửi email, trừ tiền) thì nó vẫn xảy ra — người dùng bấm lại sẽ tạo bản trùng. <strong>499</strong> chỉ có trong log nginx: client cúp máy trước (người dùng đóng tab, app di động hết giờ, front-end gọi <code>AbortController</code>). Một endpoint có nhiều 499 ⇒ thời hạn của client ngắn hơn thời gian thật server cần.</p>
<p>Để ý các trường mình thêm vào access log: <code>urt</code> (thời gian upstream trả lời) và <code>us</code> (mã của upstream). <code>rt</code> ≈ <code>urt</code> ⇒ thời gian nằm trong app; <code>rt</code> ≫ <code>urt</code> ⇒ thời gian nằm ở việc gửi cho một client chậm. <code>us=-</code> ⇒ upstream chưa hề trả lời.</p>

<h3>Danh sách soát theo tầng (đúng thứ tự này)</h3>
<ol>
<li>Có mã trạng thái HTTP không? Không ⇒ DNS / TCP / TLS — đọc mã lỗi của client.</li>
<li>Ai viết body? HTML của proxy ⇒ error log của proxy; JSON của app ⇒ log app.</li>
<li>Với 502/504: dòng error log của proxy ⇒ là từ chối, đóng sớm, header quá to, hay hết giờ.</li>
<li>Chỉ khi đó mới mở mã — ở đúng dòng mà log app chỉ tới.</li>
</ol>

<h3>Góc hacker: "cứ tắt kiểm chứng chỉ đi cho nhanh"</h3>
<p>Cách nhanh nhất để "sửa" lỗi 60 hay <code>UNABLE_TO_VERIFY_LEAF_SIGNATURE</code> là <code>curl -k</code>, <code>NODE_TLS_REJECT_UNAUTHORIZED=0</code>, <code>rejectUnauthorized: false</code>, hay một <code>TrustManager</code> "tin tất cả" trong Java. Nó chạy được — và từ lúc đó bất kỳ ai nằm trên đường đi (Wi-Fi quán cà phê, router bị chiếm) đều giả được server và đọc hết token. Năm 2012, nhóm Georgiev ("The Most Dangerous Code in the World", hội nghị ACM CCS) chỉ ra việc kiểm chứng chỉ bị hỏng trong SDK thanh toán, client đám mây và ứng dụng di động — phần lớn vì lập trình viên tắt nó để qua lỗi lúc thử rồi để nguyên khi phát hành. Hãy sửa nguyên nhân thật: thêm CA nội bộ (<code>NODE_EXTRA_CA_CERTS</code>, <code>--cacert</code>, truststore của Java), gọi đúng tên, gia hạn chứng chỉ. Nếu buộc phải dùng <code>-k</code> để điều tra, đừng bao giờ để nó lọt vào commit. Khi gốc cũ của Let's Encrypt (DST Root CA X3) hết hạn ngày 30/09/2021, nhiều thiết bị cũ và client OpenSSL 1.0.2 hỏng chỉ sau một đêm dù server không đổi gì — đúng kiểu ticket "không ai sửa gì mà TLS hỏng".</p>

<h3>Tình huống đi làm</h3>
<p>Trong dự án outsourcing, front-end, API và hạ tầng thường thuộc người khác nhau — có khi thuộc công ty khác nhau. Ticket kiểu "Đăng nhập trả 502 trên UAT" bị đá qua đá lại nhiều ngày nếu không ai gọi tên tầng. Câu trả lời của bạn nên là một đoạn có bằng chứng: "502 do nginx trên UAT trả; error log lúc 10:42 ghi <code>upstream timed out … /api/auth/login</code>; dịch vụ auth mất 65 s vì lời gọi LDAP bị treo. Front-end và mã API không sai; nhờ anh kiểm kết nối LDAP từ server UAT." Ticket như thế mới được đóng.</p>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok">
<ol>
<li>Dựng môi trường của chương (mã bên dưới). Tái hiện mã thoát 6, 7, 28 và 60 bằng curl; mỗi cái viết một câu gọi tên tầng.</li>
<li>Gọi cùng endpoint HTTPS từ Node: một lần hỏng, một lần với <code>NODE_EXTRA_CA_CERTS</code>. Khi dùng <code>fetch</code>, in ra <code>err.cause.code</code>.</li>
<li>Tạo ba lỗi 502 và một 504; dán dòng <code>error.log</code> của nginx cạnh dòng log app cho từng ca.</li>
<li>Tạo một 499 bằng <code>curl -m 1</code>. Giải thích khác biệt giữa <code>rt</code> và <code>urt</code> trong access log.</li>
</ol>
<p><strong>Đạt khi:</strong> với bất kỳ request hỏng nào, bạn gọi tên tầng và ai đã viết lỗi trong vòng một phút, kèm dòng log làm bằng chứng.</p>
</div>
<details><summary>Môi trường của chương: API (api/api.mjs), nginx.conf, node-tls.mjs</summary>${ma(API)}${ma(NGINX, 'nginx')}${ma(NODE_TLS)}</details>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Upstream</span><span class="v">Server mà proxy chuyển request vào (ở đây: API Node đứng sau nginx).</span></div>
  <div class="kv"><span class="k">Reverse proxy</span><span class="v">Server đứng trước app: TLS, định tuyến, giới hạn, thời hạn (nginx, load balancer, API gateway).</span></div>
  <div class="kv"><span class="k">SNI</span><span class="v">Tên máy client gửi trong lúc bắt tay TLS để server chọn đúng chứng chỉ.</span></div>
  <div class="kv"><span class="k">SAN</span><span class="v">Subject Alternative Name — danh sách tên mà chứng chỉ có hiệu lực.</span></div>
  <div class="kv"><span class="k">502 / 504</span><span class="v">Proxy không nhận được trả lời hợp lệ / proxy thôi chờ.</span></div>
  <div class="kv"><span class="k">499</span><span class="v">Chỉ nginx có: client đóng kết nối trước khi có response.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Không có mã trạng thái ⇒ lỗi nằm dưới HTTP: đọc mã thoát của curl hoặc <code>err.cause.code</code> của Node.</li>
<li>Body cho biết ai trả lời; header <code>Server</code> thì không.</li>
<li>404, 401/403 mỗi mã giấu nhiều nguyên nhân — đọc body và header của request.</li>
<li>502 có nhiều nguyên nhân; error log của proxy gọi tên nó. App thậm chí có thể đã ghi 200.</li>
<li>504 = proxy hết giờ, việc có thể vẫn hoàn tất; 499 = client bỏ cuộc.</li>
<li>Không bao giờ "sửa" TLS bằng cách tắt kiểm chứng chỉ.</li>
</ul>
${NGUON}
</div>
`,
};
