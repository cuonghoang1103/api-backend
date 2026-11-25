/**
 * 5.2 — Network: mã trạng thái, header, lỗi CORS, cache, mạng chậm, HAR (soạn 24/11/2026).
 * Output THẬT: Chrome 150 headless + CDP (Network.requestWillBeSent / responseReceived(ExtraInfo) / loadingFailed.corsErrorStatus,
 * setCacheDisabled, emulateNetworkConditions), log API node:http, curl 8 trên Fedora, HAR do Playwright 1.65.1 ghi.
 * Ứng dụng mẫu: s05/_ma-5.mjs (App.52.jsx = App.jsx đã sửa lỗi trang trắng của bài 5.1). Tập lệnh: scratchpad/dbg/lab/ch5/tools/c52-*.mjs.
 */
import { nguon, lienKet } from '../_chung.mjs';
import { CHE_HAR } from './_ma-5.mjs';

const ma = (s, lang = 'js') => `<pre><code class="language-${lang}">${s}</code></pre>`;

const OUT_PREFLIGHT = `<div class="out"># click "Lưu" (web localhost:41511 → API 127.0.0.1:41510). Network panel, filter "dat-cho":
Method   Name           Status    Type
OPTIONS  /api/dat-cho   404       preflight   ▸ Access-Control-Request-Method: POST
                                              ▸ Access-Control-Request-Headers: content-type
                                              ▸ Origin: http://localhost:41511
POST     /api/dat-cho   (failed)  fetch   ✗ net::ERR_FAILED · CORS error: PreflightInvalidStatus

Console:
Access to fetch at 'http://127.0.0.1:41510/api/dat-cho' from origin 'http://localhost:41511' has been blocked by CORS policy:
Response to preflight request doesn't pass access control check: It does not have HTTP ok status.

API log (server side):
04:39:20 OPTIONS /api/dat-cho origin=http://localhost:41511 cookie=không
                                          ← and nothing else: the POST never left the browser</div>`;

const OUT_ORIGIN = `<div class="out"># same app, but the API was configured for the front end on port 3000 (WEB=http://localhost:3000)
GET  /api/phong   (failed)  fetch   ✗ net::ERR_FAILED · CORS error: AllowOriginMismatch    [on the wire: 200]
     ◂ Access-Control-Allow-Origin: http://localhost:3000

Console:
Access to fetch at 'http://127.0.0.1:41510/api/phong' from origin 'http://localhost:41511' has been blocked by CORS policy:
The 'Access-Control-Allow-Origin' header has a value 'http://localhost:3000' that is not equal to the supplied origin.
Have the server send the header with a valid value.

API log:
04:40:55 GET /api/phong origin=http://localhost:41511 cookie=không
         → 200 GET /api/phong                 ← the server answered 200; the BROWSER refused to give it to your JavaScript</div>`;

const OUT_CURL = `<div class="out">$ curl 'http://127.0.0.1:41510/api/dat-cho' \\
  -H 'Content-Type: application/json' -H 'Origin: http://localhost:41511' \\
  -H 'Referer: http://localhost:41511/' --data-raw '{"phong":401,"nguoiDat":"SE1804","batDau":"2026-11-25T15:00:00+07:00"}' -i
HTTP/1.1 201 Created
Access-Control-Allow-Origin: http://localhost:41511
Access-Control-Allow-Credentials: true
Vary: Origin
Content-Type: application/json; charset=utf-8

{"id":4,"phong":401,"nguoiDat":"SE1804","batDau":"2026-11-25T15:00:00+07:00"}      ← curl does not do CORS: the API works

$ curl -i -X OPTIONS 'http://127.0.0.1:41510/api/dat-cho' -H 'Origin: http://localhost:41511' \\
  -H 'Access-Control-Request-Method: POST' -H 'Access-Control-Request-Headers: content-type'
HTTP/1.1 404 Not Found                      ← the preflight the browser sends, reproduced in one line
Access-Control-Allow-Origin: http://localhost:41511

# after the fix (route for OPTIONS):
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: http://localhost:41511
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET,POST,DELETE
Access-Control-Allow-Headers: Content-Type
Access-Control-Max-Age: 600</div>`;

const MA_CORS = ma(`if (req.method === 'OPTIONS') {
  res.writeHead(204, {
    'Access-Control-Allow-Methods': 'GET,POST,DELETE',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '600',          // browser may cache this answer for 10 minutes
  });
  res.end(); return;
}`);

const OUT_DUP = `<div class="out"># CORS fixed. Type 17:00, click "Lưu" once. Network, with the Initiator column:
+ 1740ms [console.count] bấm Lưu: 1                       App.52.jsx:39     ← one click…
+ 1744ms OPTIONS /api/dat-cho   204   preflight
+ 1744ms OPTIONS /api/dat-cho   204   preflight
+ 1751ms POST    /api/dat-cho   409   fetch    8 ms       initiator: goi api.js:5 ← luu App.52.jsx:25 ← DatChoForm App.52.jsx:37
+ 2048ms POST    /api/dat-cho   201   fetch  305 ms       initiator: goi api.js:5 ← luu App.52.jsx:25 ← onClick App.52.jsx:39
                                                                             ← …two POSTs, from two different lines
.loi on the page at +1805 ms … +1995 ms: "Trùng lượt #4"      at +2057 ms: null   (the later 201 cleared it)</div>`;

const MA_DUP = ma(`&lt;form onSubmit={luu}&gt;                                                   {/* line 37 */}
  &lt;input value={gio} onChange={(e) =&gt; setGio(e.target.value)} /&gt;
  &lt;button type="submit" onClick={() =&gt; { console.count('bấm Lưu'); luu(); }}&gt;Lưu&lt;/button&gt;   {/* line 39 */}`, 'jsx');

const OUT_CACHE = `<div class="out"># Disable cache OFF — reload the page
GET  /api/phong   200            ◂ ETag: "phong-v1"   ◂ Cache-Control: no-cache
— reload —
GET  /api/phong   200 (wire 304) ▸ If-None-Match: "phong-v1"
                                 ← browser revalidated; server said 304 Not Modified, body came from the HTTP cache
                                   (DevTools Status column shows 304; your JavaScript sees res.status === 200)

# Disable cache ON (DevTools adds these request headers itself)
GET  /api/phong   200            ▸ Cache-Control: no-cache   ▸ Pragma: no-cache     (no If-None-Match any more)</div>`;

const OUT_CHAM = `<div class="out">normal network                     : list visible after 0.3 s · 18 resources
slow network (2000 ms, 400 kbit/s) : list visible after 85.2 s · 18 resources     ← Vite dev = many unbundled modules
   reload, after 3 s: "LabFlow — Đăng nhập Lab 401 Lab 402 Lịch phòng 401 #1 08:00 — SE1801 …"    ← fast: HTTP cache</div>`;

const OUT_HAR = `<div class="out">$ node tools/c52-har.mjs            # record a HAR while logging in (fixed app, same-origin through the Vite proxy)
tiêu đề sau đăng nhập: LabFlow — xin chào SE1804
$ ls -la phien.har
-rw-r--r--. 1 … 3868662 Nov 24 04:41 phien.har        ← 3.9 MB: every response body is embedded
$ (list the /api entries)
POST /api/dang-nhap 200  set-cookie: sid=0093700021ce3856b5db3c15; HttpOnly; SameSite=None; Secure; Path=/  body: {"ten":"SE1804"}
GET  /api/toi       200  cookie: sid=0093700021ce3856b5db3c15

$ curl -s -H 'Cookie: sid=0093700021ce3856b5db3c15' 127.0.0.1:41510/api/toi      # another machine, no browser, no password
{"ten":"SE1804"}                                                              ← whoever has the HAR IS the user

$ node tools/che-har.mjs phien.har phien-da-che.har
đã che 3 giá trị; ghi phien-da-che.har
$ grep -c 'sid=' phien-da-che.har
0</div>`;

const NGUON = [
  nguon('🌐', 'Chrome DevTools — Network features reference', 'Cột Initiator, Disable cache, throttling, Copy as cURL, Export HAR, Preserve log.', 'https://developer.chrome.com/docs/devtools/network/reference'),
  nguon('📜', 'MDN — Cross-Origin Resource Sharing (CORS)', 'Request "đơn giản" và preflight, Access-Control-*, credentials.', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS'),
  nguon('🔐', 'Okta — Unauthorized access to Okta\'s support case management system (10/2023)', 'Kẻ tấn công lấy HAR khách hàng tải lên, dùng lại token phiên.', 'https://sec.okta.com/harfiles'),
  nguon('🛡', 'Cloudflare — How Cloudflare mitigated yet another Okta compromise (10/2023)', 'Phát hiện token lấy từ HAR được dùng lại trên hệ thống của họ.', 'https://blog.cloudflare.com/how-cloudflare-mitigated-yet-another-okta-compromise/'),
  lienKet({ khoa: 'api-design', bai: 'api-6-4-cors', title: 'API Design 6.4 — CORS', sub: 'Thiết kế chính sách CORS phía server: origin, credentials, preflight cache.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-9-3-har', title: 'Log từ A đến Z 9.3 — HAR', sub: 'HAR như một tệp log: đọc, lọc, chia sẻ an toàn.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '5.2 — Network: status, headers, CORS errors, cache, throttling, HAR|||5.2 — Network: mã trạng thái, header, lỗi CORS, cache, mạng chậm, HAR',
  slug: 'dbg-5-2-network',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lỗi CORS thật: preflight OPTIONS 404 (POST không rời trình duyệt) và AllowOriginMismatch (server trả 200, trình duyệt chặn) — đọc cột Status, header, log server; Copy as cURL tái hiện ngoài trình duyệt; cột Initiator chỉ ra một lần bấm gửi hai POST (onClick + onSubmit); ETag/304 và Disable cache; mạng chậm 85 giây với Vite dev; HAR chứa cookie phiên dùng lại được bằng curl, công cụ che HAR; vụ Okta 2023.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>Every request, its answer, and who sent it</h2>
<p class="lead">The Network panel is the flight recorder of the page: each request, the exact headers that went out, the status and headers that came back, timing, and the line of code that started it. Most "the API is broken" tickets are settled here in two minutes — often in favour of the API.</p>

<h3>An everyday picture: a building's security desk</h3>
<p>Your JavaScript is a visitor; the API is an office upstairs; the browser is the security desk in the lobby. For a risky visit (a POST with JSON) the guard first phones upstairs: "someone from localhost:41511 wants to bring a JSON package, OK?" — that phone call is the <strong>preflight</strong>. If upstairs does not answer properly, the visitor never goes up. Sometimes the office does hand over a package, but the label says it is for someone else, so the guard refuses to give it to the visitor. In both cases the office (server) is fine — the guard (browser) applied the rules.</p>

<h3>Reading one row</h3>
<p>Useful columns (right-click the header to add them): <em>Status</em>, <em>Type</em> (fetch, preflight, document…), <em>Initiator</em> (which script and line), <em>Size</em> ("(disk cache)", "(ServiceWorker)" tell you it never hit the server), <em>Time</em> and the <em>Waterfall</em>. Click a row: <em>Headers</em> (general, request, response), <em>Payload</em>, <em>Preview</em>/<em>Response</em>, <em>Initiator</em> (full call stack), <em>Timing</em>. Filter box: <code>dat-cho</code>, <code>method:POST</code>, <code>status-code:404</code>, <code>-domain:localhost</code>. The tables below are rebuilt from the CDP events the Network panel itself draws from.</p>

<h3>1. CORS, case 1: the preflight fails</h3>
${OUT_PREFLIGHT}
<p><strong>CORS is the browser blocking, not the server crashing.</strong> A cross-origin <code>fetch</code> with <code>Content-Type: application/json</code> (or a custom header, or PUT/DELETE) is not a "simple request", so the browser first sends <code>OPTIONS</code> with <code>Access-Control-Request-*</code>. Our API has no route for OPTIONS ⇒ 404 ⇒ "It does not have HTTP ok status" ⇒ the real POST is never sent. The server log proves it: one OPTIONS, no POST. CDP names it <code>PreflightInvalidStatus</code>; DevTools shows "CORS error" in Status and the reason in the Issues panel.</p>
${MA_CORS}

<h3>2. CORS, case 2: the server answered — the browser hid it</h3>
${OUT_ORIGIN}
<p>This one fools people: the server log says 200, Postman says 200, "it works on my machine". But the API's <code>Access-Control-Allow-Origin</code> is for port 3000 (a leftover from Create React App days), so the browser refuses to hand the response to your code. Rule: compare the request's <code>Origin</code> with the response's <code>Access-Control-Allow-Origin</code> character by character — scheme, host, port. <code>localhost</code> ≠ <code>127.0.0.1</code>; <code>:5173</code> ≠ <code>:41511</code>. With cookies (<code>credentials: 'include'</code>) the value cannot be <code>*</code> and <code>Access-Control-Allow-Credentials: true</code> is required.</p>
<p>Important consequence for <strong>security</strong>: CORS protects the <em>user's browser</em> from other websites reading responses. It does not protect your API — curl, Postman and attackers ignore it. Do not "fix" CORS with <code>*</code> + credentials-like hacks, and never rely on it as access control.</p>

<h3>3. Copy as cURL: take the request out of the browser</h3>
<p>Right-click the failing row → Copy → <strong>Copy as cURL (bash)</strong>. You get every header the browser sent. Strip what is not needed until the request is minimal, and run it:</p>
${OUT_CURL}
<p>In one minute you have split the problem: the POST itself works (201), the preflight does not (404). The curl line also goes straight into the bug ticket — your backend colleague can reproduce without your browser, your account or your machine. On Windows choose "Copy as cURL (cmd)" or "(PowerShell)" — quoting differs.</p>

<h3>4. Initiator: one click, two POSTs</h3>
<p>With CORS fixed, testers report: "Click Lưu, sometimes 'Trùng lượt' flashes, but the booking is created".</p>
${OUT_DUP}
${MA_DUP}
<p>Two POSTs with two different initiators: <code>DatChoForm App.52.jsx:37</code> (the form's <code>onSubmit</code>) and <code>onClick App.52.jsx:39</code>. Someone added analytics to the button click and called <code>luu()</code> from there too — without <code>preventDefault</code> on the click, the click also submits the form. Whichever POST arrives second gets 409. The UI shows the error for ~300 ms, then the slower 201 overwrites it. That flicker is the kind of bug you can only explain from the Network timeline. Fix: one entry point (<code>onSubmit</code>), disable the button while sending. Lesson 5.3 catches the same bug with a fetch breakpoint.</p>

<h3>5. Cache: 304, Disable cache, and "I already fixed it"</h3>
${OUT_CACHE}
<p>Our API sends <code>ETag</code> + <code>Cache-Control: no-cache</code> ("you may store it, but ask me before using it"). On reload the browser sends <code>If-None-Match</code>, the server says 304 and no body travels. DevTools shows 304; <code>fetch</code> gives your code a normal 200 with the cached body. <strong>Disable cache</strong> (Network toolbar, only while DevTools is open) makes the browser skip its HTTP cache and add <code>Cache-Control: no-cache</code> / <code>Pragma: no-cache</code>. When "the fix is deployed but I still see the old thing", tick it first; if it is still old, the cache is elsewhere — CDN, service worker (5.4), or an old build (chapter 8.3).</p>

<h3>6. Throttling: the bug that only exists on a slow network</h3>
${OUT_CHAM}
<p>Network → No throttling → choose a preset or add a custom profile (we used 2000 ms latency, 400 kbit/s). On a slow network you see what your users see: the double-POST window grows from 8 ms to seconds, buttons are clickable before data arrives, spinners are missing. The 85 s here is also a lesson: the Vite <em>dev</em> server serves hundreds of kilobytes of unbundled modules; always judge performance on a production build (<code>vite build &amp;&amp; vite preview</code>). Throttling also exists for CPU (Performance panel) — mid-range Android phones are much slower than your laptop.</p>

<h3>7. HAR: the whole recording in one file — and why it is dangerous</h3>
<p>"Export HAR" (the ⤓ icon) saves every request and response as JSON so a colleague can open it in their own DevTools (drag the file into Network) or in a HAR viewer. Support teams ask for HAR files all the time. Look at what is inside:</p>
${OUT_HAR}
<p>The session cookie (and in other apps the <code>Authorization: Bearer …</code> header, API keys in URLs, passwords in request bodies) is in the HAR. Anyone who gets the file can be you until the session expires. Newer Chrome versions can export a HAR without sensitive data — do not count on it: other tools (Playwright, Firefox, proxies, older browsers, the "with sensitive data" option) write everything. Before sending a HAR: log out afterwards (kills the session), and redact:</p>
${ma(CHE_HAR)}

<h3>Hacker corner: the Okta HAR breach (October 2023)</h3>
<p>Okta's support system let customers upload HAR files to troubleshoot. An attacker who got into that system downloaded HAR files and extracted live session tokens, then used them to hijack sessions at Okta customers. 1Password, BeyondTrust and Cloudflare detected the activity in their own systems; Okta published its investigation on 20 October 2023. The lesson for you: a HAR is a credential. Sanitize, share through the ticket system (not chat), delete after use, and when you receive one, treat it like a password.</p>

<h3>On the job</h3>
<p>Client writes: "Your API returns CORS error, please fix the server". Before touching the server: open Network, find the preflight, compare <code>Origin</code> and <code>Access-Control-Allow-Origin</code>, reproduce with curl. Reply with facts: "OPTIONS /api/dat-cho returns 404 on staging — our router has no OPTIONS route; fix in PR #…" or, just as often, "Your new domain https://admin.client.vn is not in our allowed origins; please confirm it so we can add it". Facts end the ping-pong.</p>

<h3>🧪 Practice (40 min)</h3>
<div class="callout ok">
<ol>
<li>Reproduce both CORS errors (start the API with and without <code>WEB=http://localhost:3000</code>); for each, write the Network row, the Console line and the server log line.</li>
<li>Copy as cURL, minimise the command, and reproduce the preflight with <code>curl -X OPTIONS</code>; fix the API.</li>
<li>Show the two initiators of the double POST; fix it so one click = one POST, also on a throttled network.</li>
<li>Find 304 responses; tick Disable cache and explain the header difference.</li>
<li>Export a HAR after logging in, prove it contains the session, redact it with <code>che-har.mjs</code>, and check with <code>grep</code>.</li>
</ol>
<p><strong>Done when:</strong> for any failed request you can say in one sentence whether the server, the browser policy or the front-end code is at fault — with the evidence.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Origin</span><span class="v">scheme + host + port of the page — localhost:41511 ≠ 127.0.0.1:41511.</span></div>
  <div class="kv"><span class="k">CORS</span><span class="v">Browser rule: page JS may read a cross-origin response only if the server allows that origin.</span></div>
  <div class="kv"><span class="k">Preflight</span><span class="v">OPTIONS request the browser sends before a non-simple cross-origin request.</span></div>
  <div class="kv"><span class="k">Initiator</span><span class="v">Script, line and call stack that started a request.</span></div>
  <div class="kv"><span class="k">ETag / 304</span><span class="v">Version tag of a response; "Not Modified" lets the browser reuse its cached copy.</span></div>
  <div class="kv"><span class="k">Throttling</span><span class="v">Simulated slow network/CPU in DevTools.</span></div>
  <div class="kv"><span class="k">HAR</span><span class="v">HTTP Archive — JSON recording of all requests and responses, including secrets.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>CORS errors are the browser refusing; check the server log and curl before blaming the API.</li>
<li>Preflight failed ⇒ the real request never left; AllowOriginMismatch ⇒ the server answered but JS cannot read it.</li>
<li>Copy as cURL turns a browser bug into a reproducible one-liner for the ticket.</li>
<li>The Initiator column explains duplicate requests; throttling makes timing bugs visible.</li>
<li>304 and Disable cache explain "still old"; a HAR contains credentials — sanitize it.</li>
</ul>
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Mỗi request, câu trả lời của nó, và ai đã gửi nó</h2>
<p class="lead">Tab Network là hộp đen của trang: từng request, đúng các header đã gửi đi, mã trạng thái và header nhận về, thời gian, và dòng mã đã khởi động nó. Phần lớn ticket "API hỏng rồi" được phân xử ở đây trong hai phút — và nhiều khi API vô tội.</p>

<h3>Liên tưởng đời thường: quầy bảo vệ toà nhà</h3>
<p>JavaScript của bạn là khách; API là văn phòng trên lầu; trình duyệt là quầy bảo vệ dưới sảnh. Với lượt thăm "rủi ro" (POST kèm JSON), bảo vệ gọi điện lên trước: "có người từ localhost:41511 muốn mang gói JSON lên, được không?" — cuộc gọi đó là <strong>preflight</strong>. Văn phòng không trả lời đúng thì khách không được lên. Có khi văn phòng đã đưa gói hàng xuống, nhưng nhãn ghi cho người khác, nên bảo vệ không giao cho khách. Cả hai trường hợp văn phòng (server) vẫn ổn — bảo vệ (trình duyệt) chỉ làm đúng luật.</p>

<h3>Đọc một dòng</h3>
<p>Các cột đáng bật (chuột phải vào tiêu đề cột): <em>Status</em>, <em>Type</em> (fetch, preflight, document…), <em>Initiator</em> (script và dòng nào), <em>Size</em> ("(disk cache)", "(ServiceWorker)" nghĩa là không hề tới server), <em>Time</em> và <em>Waterfall</em>. Bấm một dòng: <em>Headers</em> (chung, request, response), <em>Payload</em>, <em>Preview</em>/<em>Response</em>, <em>Initiator</em> (cả call stack), <em>Timing</em>. Ô lọc: <code>dat-cho</code>, <code>method:POST</code>, <code>status-code:404</code>, <code>-domain:localhost</code>. Các bảng dưới đây dựng lại từ chính sự kiện CDP mà tab Network dùng để vẽ.</p>

<h3>1. CORS, trường hợp 1: preflight thất bại</h3>
${OUT_PREFLIGHT}
<p><strong>CORS là trình duyệt chặn, không phải server sập.</strong> Một <code>fetch</code> khác origin với <code>Content-Type: application/json</code> (hoặc header tự đặt, hoặc PUT/DELETE) không phải "request đơn giản", nên trình duyệt gửi <code>OPTIONS</code> kèm <code>Access-Control-Request-*</code> trước. API của mình không có tuyến OPTIONS ⇒ 404 ⇒ "It does not have HTTP ok status" ⇒ POST thật không bao giờ được gửi. Log server chứng minh: một OPTIONS, không có POST. CDP gọi nó là <code>PreflightInvalidStatus</code>; DevTools hiện "CORS error" ở cột Status và lý do trong tab Issues.</p>
${MA_CORS}

<h3>2. CORS, trường hợp 2: server đã trả lời — trình duyệt giấu đi</h3>
${OUT_ORIGIN}
<p>Trường hợp này lừa được nhiều người: log server ghi 200, Postman ra 200, "máy em chạy mà". Nhưng <code>Access-Control-Allow-Origin</code> của API ghi cổng 3000 (sót lại từ thời Create React App), nên trình duyệt không chịu đưa response cho mã của bạn. Quy tắc: so <code>Origin</code> của request với <code>Access-Control-Allow-Origin</code> của response từng ký tự — scheme, host, cổng. <code>localhost</code> ≠ <code>127.0.0.1</code>; <code>:5173</code> ≠ <code>:41511</code>. Có gửi cookie (<code>credentials: 'include'</code>) thì giá trị không được là <code>*</code> và bắt buộc có <code>Access-Control-Allow-Credentials: true</code>.</p>
<p>Hệ quả quan trọng về <strong>bảo mật</strong>: CORS bảo vệ <em>trình duyệt của người dùng</em> khỏi trang web khác đọc trộm response. Nó không bảo vệ API của bạn — curl, Postman và kẻ tấn công đều phớt lờ nó. Đừng "sửa" CORS bằng các mẹo kiểu <code>*</code>, và đừng bao giờ coi nó là cơ chế phân quyền.</p>

<h3>3. Copy as cURL: đem request ra khỏi trình duyệt</h3>
<p>Chuột phải dòng bị lỗi → Copy → <strong>Copy as cURL (bash)</strong>. Bạn có đủ mọi header trình duyệt đã gửi. Bỏ dần thứ không cần cho tới khi lệnh tối giản, rồi chạy:</p>
${OUT_CURL}
<p>Trong một phút bạn đã tách đôi vấn đề: bản thân POST chạy được (201), preflight thì không (404). Dòng curl đó đưa thẳng vào ticket — đồng nghiệp backend tái hiện được mà không cần trình duyệt, tài khoản hay máy của bạn. Trên Windows chọn "Copy as cURL (cmd)" hoặc "(PowerShell)" — cách đặt nháy khác nhau.</p>

<h3>4. Initiator: một lần bấm, hai POST</h3>
<p>Sửa xong CORS, tester báo: "Bấm Lưu, thỉnh thoảng chớp chữ 'Trùng lượt', nhưng lượt vẫn được tạo".</p>
${OUT_DUP}
${MA_DUP}
<p>Hai POST với hai initiator khác nhau: <code>DatChoForm App.52.jsx:37</code> (<code>onSubmit</code> của form) và <code>onClick App.52.jsx:39</code>. Ai đó thêm đếm lượt bấm vào nút và gọi luôn <code>luu()</code> ở đó — click không có <code>preventDefault</code> nên click cũng gửi form. POST nào tới sau thì nhận 409. Giao diện hiện lỗi khoảng 300 ms, rồi cái 201 chậm hơn ghi đè. Kiểu nhấp nháy đó chỉ giải thích được bằng dòng thời gian của Network. Sửa: một lối vào duy nhất (<code>onSubmit</code>), khoá nút trong lúc gửi. Bài 5.3 bắt lại đúng lỗi này bằng breakpoint fetch.</p>

<h3>5. Cache: 304, Disable cache, và "em sửa rồi mà"</h3>
${OUT_CACHE}
<p>API của mình gửi <code>ETag</code> + <code>Cache-Control: no-cache</code> ("được cất, nhưng hỏi tôi trước khi dùng"). Khi tải lại, trình duyệt gửi <code>If-None-Match</code>, server trả 304 và không có body nào chạy trên dây. DevTools hiện 304; còn <code>fetch</code> đưa cho mã của bạn một response 200 bình thường với body lấy từ cache. <strong>Disable cache</strong> (thanh công cụ Network, chỉ có tác dụng khi DevTools đang mở) bắt trình duyệt bỏ qua HTTP cache và tự thêm <code>Cache-Control: no-cache</code> / <code>Pragma: no-cache</code>. Khi "đã deploy bản sửa mà vẫn thấy cái cũ", tích nó trước; vẫn cũ thì cache nằm chỗ khác — CDN, service worker (5.4), hoặc bản build cũ (bài 8.3).</p>

<h3>6. Throttling: lỗi chỉ tồn tại trên mạng chậm</h3>
${OUT_CHAM}
<p>Network → No throttling → chọn preset hoặc thêm cấu hình riêng (chúng tôi dùng độ trễ 2000 ms, 400 kbit/s). Trên mạng chậm bạn thấy đúng thứ người dùng thấy: khe hở của lỗi hai POST giãn từ 8 ms thành vài giây, nút bấm được trước khi dữ liệu về, thiếu vòng xoay chờ. Con số 85 giây cũng là một bài học: Vite <em>dev</em> server trả hàng trăm KB module chưa gộp; luôn đánh giá tốc độ trên bản build production (<code>vite build &amp;&amp; vite preview</code>). Throttling còn có cho CPU (tab Performance) — điện thoại Android tầm trung chậm hơn laptop của bạn nhiều.</p>

<h3>7. HAR: cả cuộn băng trong một tệp — và vì sao nó nguy hiểm</h3>
<p>"Export HAR" (biểu tượng ⤓) lưu mọi request và response thành JSON để đồng nghiệp mở trong DevTools của họ (kéo tệp vào Network) hoặc trình xem HAR. Đội hỗ trợ hay xin tệp HAR. Nhìn xem bên trong có gì:</p>
${OUT_HAR}
<p>Cookie phiên (ở ứng dụng khác là header <code>Authorization: Bearer …</code>, API key trong URL, mật khẩu trong body) nằm ngay trong HAR. Ai có tệp đều thành bạn cho tới khi phiên hết hạn. Chrome bản mới có thể xuất HAR không kèm dữ liệu nhạy cảm — đừng trông vào đó: công cụ khác (Playwright, Firefox, proxy, trình duyệt cũ, mục "with sensitive data") ghi tất cả. Trước khi gửi HAR: đăng xuất sau khi ghi (huỷ phiên), và che:</p>
${ma(CHE_HAR)}

<h3>Góc hacker: vụ lộ HAR của Okta (tháng 10/2023)</h3>
<p>Hệ thống hỗ trợ của Okta cho khách tải tệp HAR lên để gỡ lỗi. Kẻ tấn công lọt được vào hệ thống đó, tải các tệp HAR, rút ra token phiên còn sống rồi dùng để chiếm phiên ở các khách hàng của Okta. 1Password, BeyondTrust và Cloudflare phát hiện hoạt động lạ trên hệ thống của chính họ; Okta công bố điều tra ngày 20/10/2023. Bài học cho bạn: HAR là một thứ giấy tờ đăng nhập. Che dữ liệu, gửi qua hệ thống ticket (không qua chat), xoá sau khi dùng, và khi nhận HAR thì giữ như giữ mật khẩu.</p>

<h3>Tình huống đi làm</h3>
<p>Khách viết: "API của bên em báo lỗi CORS, sửa server giúp anh". Trước khi đụng vào server: mở Network, tìm preflight, so <code>Origin</code> với <code>Access-Control-Allow-Origin</code>, tái hiện bằng curl. Trả lời bằng sự thật: "OPTIONS /api/dat-cho trả 404 trên staging — router bên em thiếu tuyến OPTIONS; sửa ở PR #…" hoặc, cũng thường gặp không kém, "Tên miền mới https://admin.client.vn của anh chưa có trong danh sách origin cho phép; anh xác nhận giúp để bên em thêm". Có bằng chứng là hết đá bóng qua lại.</p>

<h3>🧪 Thực hành (40 phút)</h3>
<div class="callout ok">
<ol>
<li>Tái hiện cả hai lỗi CORS (chạy API có và không có <code>WEB=http://localhost:3000</code>); với mỗi lỗi, ghi dòng Network, dòng Console và dòng log server.</li>
<li>Copy as cURL, rút gọn lệnh, tái hiện preflight bằng <code>curl -X OPTIONS</code>; sửa API.</li>
<li>Chỉ ra hai initiator của lỗi hai POST; sửa để một lần bấm = một POST, kể cả khi bật throttling.</li>
<li>Tìm response 304; tích Disable cache và giải thích header khác nhau thế nào.</li>
<li>Xuất HAR sau khi đăng nhập, chứng minh nó chứa phiên, che bằng <code>che-har.mjs</code>, kiểm lại bằng <code>grep</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> với bất kỳ request thất bại nào, bạn nói được trong một câu lỗi do server, do chính sách của trình duyệt hay do mã front-end — kèm bằng chứng.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Origin</span><span class="v">scheme + host + cổng của trang — localhost:41511 ≠ 127.0.0.1:41511.</span></div>
  <div class="kv"><span class="k">CORS</span><span class="v">Luật của trình duyệt: JS của trang chỉ đọc được response khác origin nếu server cho phép origin đó.</span></div>
  <div class="kv"><span class="k">Preflight</span><span class="v">Request OPTIONS trình duyệt gửi trước một request khác origin không đơn giản.</span></div>
  <div class="kv"><span class="k">Initiator</span><span class="v">Script, dòng và call stack đã khởi động request.</span></div>
  <div class="kv"><span class="k">ETag / 304</span><span class="v">Nhãn phiên bản của response; "Not Modified" cho trình duyệt dùng lại bản đã cất.</span></div>
  <div class="kv"><span class="k">Throttling</span><span class="v">Giả lập mạng/CPU chậm trong DevTools.</span></div>
  <div class="kv"><span class="k">HAR</span><span class="v">HTTP Archive — bản ghi JSON mọi request và response, kể cả bí mật.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Lỗi CORS là trình duyệt từ chối; xem log server và curl trước khi đổ cho API.</li>
<li>Preflight hỏng ⇒ request thật chưa hề đi; AllowOriginMismatch ⇒ server đã trả lời nhưng JS không đọc được.</li>
<li>Copy as cURL biến lỗi trên trình duyệt thành một dòng lệnh tái hiện được cho ticket.</li>
<li>Cột Initiator giải thích request bị trùng; throttling làm lộ lỗi thời gian.</li>
<li>304 và Disable cache giải thích "vẫn bản cũ"; HAR chứa giấy tờ đăng nhập — che trước khi gửi.</li>
</ul>
${NGUON}
</div>
`,
};
