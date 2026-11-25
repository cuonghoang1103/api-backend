/**
 * 6.5 — Lab: Một API chỉ lỗi khi gọi từ giao diện (soạn 24/11/2026, máy nhà Linux).
 * Repo lab: scratchpad/dbg/lab/ch6/lab (web tĩnh + nginx 1.27.5 container dbg-c6-lab 127.0.0.1:41620 + API node:http TZ=UTC 41621),
 * bản sửa lab-sua/ + lab-sua.diff. Output THẬT: Google Chrome 150 headless + CDP qua Playwright 1.65.1 (tools/lab6.mjs, timezone
 * Asia/Ho_Chi_Minh), curl 8.18 (tools/c65-curl.sh), đường nâng cấp cookie (tools/lab6-nang-cap.mjs). Đáp án che bằng <details>.
 */
import { L_API, L_APP, L_HTML, L_NGINX, L_CHAY, L_DIFF, L_KIEM, L_NANG_CAP, MO } from './_ma-6.mjs';

const ma = (s, lang = 'js') => `<pre><code class="language-${lang}">${s}</code></pre>`;

const TEP = (en) => `<details><summary>${en ? 'Lab files (copy into lab/ — or take them from the course repo folder ch6/lab)' : 'Các tệp của lab (chép vào lab/ — hoặc lấy ở thư mục ch6/lab của repo khoá)'}</summary>
<p><code>lab/api.mjs</code></p>${ma(L_API)}
<p><code>lab/web/index.html</code></p>${ma(L_HTML, 'html')}
<p><code>lab/web/app.js</code></p>${ma(L_APP)}
<p><code>lab/nginx.conf</code></p>${ma(L_NGINX, 'nginx')}
<p><code>lab/chay.sh</code></p>${ma(L_CHAY, 'bash')}
</details>`;

const OUT_LOI = `<div class="out">$ node tools/lab6.mjs            # Chrome 150 headless, timezone Asia/Ho_Chi_Minh, buggy version
## BUG-601 + BUG-602: đặt lượt Lab 401, 26/11/2026 08:00
   GET   /  → 200
   GET   /api/dat-cho  → 200   ▸ Cookie: 57 byte
   POST  /api/dat-cho  → 400   ▸ Content-Type: text/plain;charset=UTF-8   ▸ body: {"phong":"401","nguoiDat":"SE1809","batDau":"2026-11-26T08:00"}   ▸ Cookie: 57 byte
   giao diện: "Lỗi: Thiếu trường phong/nguoiDat/batDau"
## BUG-603: ghi chú "mang theo laptop" cho lượt #1
   POST  /api/dat-cho/1/ghi-chu/  → 301  Location: http://localhost:41620/api/dat-cho/1/ghi-chu
   GET   /api/dat-cho/1/ghi-chu  → 200   ▸ Cookie: 57 byte
   GET   /api/dat-cho  → 200   ▸ Cookie: 57 byte
   giao diện: "Đã lưu ghi chú cho lượt #1"
   ghi chú hiện trong lịch: ""
## BUG-604: người dùng đã mở trang 160 lần trong 3 tháng
   GET   /  → 400   ▸ Cookie: 9650 byte
   tiêu đề trang: "400 Request Header Or Cookie Too Large" — "400 Bad Request"
## Kết quả
   BUG-601: CHƯA
   BUG-602: CHƯA          (cannot be checked while BUG-601 blocks every booking)
   BUG-603: CHƯA
   BUG-604: CHƯA

$ tail -1 lab/log/api.log      # API side of BUG-601
{"t":"2026-11-23T22:24:26.200Z","rid":"601cd9c63d6cc6189268834f8387ec96","method":"POST","path":"/api/dat-cho","status":400,"ct":"text/plain;charset=UTF-8"}
$ docker exec dbg-c6-lab grep 'too long' /var/log/nginx/error.log | cut -c1-120     # BUG-604 — logged at level INFO only
2026/11/23 22:24:27 [info] 30#30: *3 client sent too long header line: "Cookie: _lf_v1=1795472665806.426ab979-c14b-4cc5-9a0f-…</div>`;

const OUT_CURL = `<div class="out">$ curl -s -H 'Content-Type: text/plain;charset=UTF-8' -d '{"phong":"401","nguoiDat":"SE1809","batDau":"2026-11-26T08:00"}' localhost:41620/api/dat-cho   # like the browser
{"loi":"Thiếu trường phong/nguoiDat/batDau"}
$ curl -s --json '{"phong":"401","nguoiDat":"SE1809","batDau":"2026-11-26T08:00"}' localhost:41620/api/dat-cho                # like Postman (raw JSON)
{"id":3,"phong":401,"nguoiDat":"SE1809","batDau":"2026-11-26T08:00:00.000Z","ghiChu":""}
                         ↑ accepted — and stored as 08:00 UTC = 15:00 in Vietnam: BUG-602 hides behind BUG-601

$ curl -s -o /dev/null -w '%{http_code} %{redirect_url}\\n' --json '{"ghiChu":"x"}' localhost:41620/api/dat-cho/1/ghi-chu/
301 http://localhost:41620/api/dat-cho/1/ghi-chu
$ curl -s -L --json '{"ghiChu":"mang theo laptop"}' localhost:41620/api/dat-cho/1/ghi-chu/ -v 2&gt;&amp;1 | grep -E '^&gt; (POST|GET)|^&lt; HTTP|^\\{"'
&gt; POST /api/dat-cho/1/ghi-chu/ HTTP/1.1
&lt; HTTP/1.1 301 Moved Permanently
&gt; GET /api/dat-cho/1/ghi-chu HTTP/1.1            ← after 301, POST became GET (browsers and curl -L do this)
&lt; HTTP/1.1 200 OK
{"id":1,"ghiChu":""}                                ← 200, nothing saved

$ C=$(for i in $(seq 160); do printf '_lf_v%d=1795472665806.%s; ' $i $(cat /proc/sys/kernel/random/uuid); done); echo "\${#C} byte"
9652 byte
$ curl -s -o /dev/null -w '%{http_code}\\n' -H "Cookie: $C" localhost:41620/
400
$ curl -s -o /dev/null -w '%{http_code}\\n' localhost:41620/
200                                                 ← Postman has no browser cookies: "works for me"</div>`;

const OUT_SUA = `<div class="out">$ bash lab/dung.sh; bash lab-sua/chay.sh; node tools/lab6.mjs
## BUG-601 + BUG-602: đặt lượt Lab 401, 26/11/2026 08:00
   GET   /  → 200
   GET   /api/dat-cho  → 200
   POST  /api/dat-cho  → 201   ▸ Content-Type: application/json   ▸ body: {"phong":401,"nguoiDat":"SE1809","batDau":"2026-11-26T01:00:00.000Z"}
   GET   /api/dat-cho  → 200
   giao diện: "Đã đặt lượt #3"
   dòng mới trong lịch: "#3 Lab 401 — 08:00:00 26/11/2026 — SE1809"
## BUG-603: ghi chú "mang theo laptop" cho lượt #1
   POST  /api/dat-cho/1/ghi-chu  → 200   ▸ Content-Type: application/json   ▸ body: {"ghiChu":"mang theo laptop"}
   GET   /api/dat-cho  → 200
   giao diện: "Đã lưu ghi chú cho lượt #1"
   ghi chú hiện trong lịch: "mang theo laptop"
## BUG-604: người dùng đã mở trang 160 lần trong 3 tháng
   GET   /  → 200
   GET   /api/dat-cho  → 200
   tiêu đề trang: "LabFlow — Đặt phòng lab" — "LabFlow — Đặt phòng lab"
## Kết quả
   BUG-601: ĐẠT
   BUG-602: ĐẠT
   BUG-603: ĐẠT
   BUG-604: ĐẠT</div>`;

const OUT_NANG_CAP = `<div class="out">$ node tools/lab6-nang-cap.mjs      # an EXISTING user who already carries 160 _lf_v* cookies opens the fixed version
## lần mở đầu tiên sau khi deploy bản sửa
   GET / → 200   ▸ Cookie: 9650 byte          ← accepted only thanks to the temporary large_client_header_buffers 4 16k
   GET /api/dat-cho → 200   ▸ Cookie: 0 byte   ← the new app.js already deleted them
   cookie _lf_v* còn lại: 0
## lần mở thứ hai
   GET / → 200   ▸ Cookie: 0 byte
   GET /api/dat-cho → 200   ▸ Cookie: 0 byte</div>`;

const HOI_EN = `<ol>
<li>"The API works in Postman but fails from the web page." How do you approach it?</li>
<li>What is the difference between a 502 and a 504, and where do you look for the cause of each?</li>
<li>A Java service returns an id that becomes different in the browser. Why, and how do you fix the contract?</li>
<li>How would you trace one user's failed request across three services? What do you need in place beforehand?</li>
<li>A colleague "fixed" a TLS error with <code>NODE_TLS_REJECT_UNAUTHORIZED=0</code>. What do you say in code review?</li>
</ol>`;
const HOI_VI = `<ol>
<li>"API chạy trong Postman nhưng hỏng khi gọi từ trang web." Bạn tiếp cận thế nào?</li>
<li>502 khác 504 ở đâu, và bạn tìm nguyên nhân của mỗi loại ở đâu?</li>
<li>Một dịch vụ Java trả về id mà tới trình duyệt thì thành số khác. Vì sao, và sửa hợp đồng ra sao?</li>
<li>Bạn lần theo một request hỏng của một người dùng qua ba dịch vụ thế nào? Cần chuẩn bị sẵn gì từ trước?</li>
<li>Một đồng nghiệp "sửa" lỗi TLS bằng <code>NODE_TLS_REJECT_UNAUTHORIZED=0</code>. Bạn nói gì khi review mã?</li>
</ol>`;
const DAN_Y_EN = `<ol>
<li>Capture the browser's request (Copy as cURL), capture the Postman one, diff them header by header; reduce to the one difference that flips the result (Content-Type, cookie, Origin, URL slash, time-zone format). Mention a concrete case.</li>
<li>Both come from a proxy. 502 = no valid answer (refused, closed early, bad/too-big header) — read the proxy error log line; 504 = timeout — the app is slow or stuck; compare <code>rt</code> with <code>urt</code>, then the app's logs/traces. The app may log 200 for a 502.</li>
<li>JS numbers are exact to 2^53; a 64-bit id is rounded by <code>JSON.parse</code>. Send ids as strings (like Twitter's <code>id_str</code>); as a consumer, read the source text. Add a contract test with an id above 2^53.</li>
<li>A correlation id generated at the edge, forwarded on every hop (HTTP, queues, jobs), logged as a field, returned to the user; then one search in the log platform. Mention MDC/AsyncLocalStorage and W3C traceparent.</li>
<li>It disables verification for the whole process — man-in-the-middle risk, and it tends to reach production. Fix the cause: add the internal CA (<code>NODE_EXTRA_CA_CERTS</code>/truststore), correct host name, renew certificate.</li>
</ol>`;
const DAN_Y_VI = `<ol>
<li>Chụp request của trình duyệt (Copy as cURL), chụp request của Postman, so từng header; rút gọn tới đúng một khác biệt làm đổi kết quả (Content-Type, cookie, Origin, dấu / cuối URL, định dạng múi giờ). Kể một ca cụ thể.</li>
<li>Cả hai đều do proxy nói. 502 = không có trả lời hợp lệ (từ chối, đóng sớm, header hỏng/quá to) — đọc dòng error log của proxy; 504 = hết giờ — app chậm hoặc treo; so <code>rt</code> với <code>urt</code>, rồi xem log/trace của app. App có thể ghi 200 cho một lỗi 502.</li>
<li>Số JS chính xác tới 2^53; id 64 bit bị <code>JSON.parse</code> làm tròn. Gửi id dạng chuỗi (như <code>id_str</code> của Twitter); ở phía dùng, đọc nguyên văn chữ số. Thêm test hợp đồng với một id lớn hơn 2^53.</li>
<li>Correlation id tạo ở cổng vào, chuyền qua mọi chặng (HTTP, hàng đợi, job), ghi thành trường log, trả cho người dùng; rồi một lần tìm trên nền tảng log. Nhắc MDC/AsyncLocalStorage và traceparent của W3C.</li>
<li>Nó tắt kiểm chứng chỉ cho cả tiến trình — rủi ro người đứng giữa, và hay lọt lên production. Sửa nguyên nhân: thêm CA nội bộ (<code>NODE_EXTRA_CA_CERTS</code>/truststore), đúng tên máy, gia hạn chứng chỉ.</li>
</ol>`;

export default {
  title: '6.5 — Lab: An API that fails only from the front end|||6.5 — Lab: Một API chỉ lỗi khi gọi từ giao diện',
  slug: 'dbg-6-5-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Repo thật (web JS thuần + nginx + API Node, máy chủ TZ=UTC) với 4 ticket kiểu QA, ticket nào cũng "Postman thì được": đặt lượt báo thiếu trường (fetch gửi text/plain), giờ lệch 7 tiếng (datetime-local không múi giờ), lưu ghi chú báo thành công mà không lưu (dấu / cuối URL ⇒ 301 biến POST thành GET), người dùng lâu năm không mở được trang (cookie 9,6 KB ⇒ nginx 400, chỉ log ở mức info). Phải tái hiện bằng curl tối giản; gợi ý 3 bậc, rubric 100, 5 câu phỏng vấn, đáp án output Chrome thật + diff + đường nâng cấp cookie.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lab</span>
<h2>"It works in Postman"</h2>
<p class="lead">The most common sentence in front-end/back-end disputes. Your job in this lab: prove, for four tickets, exactly which difference between the browser's request and the tester's request causes the failure — with a minimal curl that reproduces it — then fix it on the right side.</p>

<h3>Rules</h3>
<ul>
<li>For every ticket, first reproduce with a <strong>minimal curl</strong> (lesson 6.2), then fix. A fix without a reproduction scores zero.</li>
<li>Evidence comes from DevTools Network (or the CDP script), nginx and API logs — not from reading the code first.</li>
<li>Fix on the side that broke the contract; if both sides are involved, say which part belongs to whom.</li>
<li>Allowed: everything from Chapters 5 and 6. Time: 2–3 hours.</li>
</ul>

<h3>Setup (10 min)</h3>
<ol>
<li>Requirements: Node 22, Docker (image <code>nginx:1.27-alpine</code>), Chrome. Copy the files below into <code>lab/</code>.</li>
<li><code>bash lab/chay.sh</code> → open <code>http://localhost:41620</code>. The API runs with <code>TZ=UTC</code>, like a real server.</li>
<li>Logs: <code>lab/log/api.log</code> (one JSON line per request, with <code>ct</code> = received Content-Type), nginx in <code>lab/log/access.log</code> and <code>error.log</code>.</li>
<li>Optional automated check: <code>node tools/lab6.mjs</code> (needs <code>playwright-core</code> and Chrome) prints a Network-style table and ĐẠT/CHƯA per ticket.</li>
</ol>
${TEP(true)}

<h3>The four tickets (as QA wrote them)</h3>
<div class="callout">
<p><strong>BUG-601</strong> — "Đặt lượt trên web luôn báo <em>Lỗi: Thiếu trường phong/nguoiDat/batDau</em>, dù đã điền đủ. Gọi API bằng Postman thì tạo được." (Booking from the web always says fields are missing; Postman works.)</p>
<p><strong>BUG-602</strong> — "Chọn 08:00 ngày 26/11 thì lịch hiện 15:00. Test bằng Postman với <code>2026-11-26T08:00:00+07:00</code> thì đúng. Máy dev của bạn Nam cũng đúng." (Times are 7 hours off — only from the web, not on the developer's laptop.)</p>
<p><strong>BUG-603</strong> — "Bấm Ghi chú, nhập nội dung, hiện <em>Đã lưu ghi chú</em> nhưng tải lại thì vẫn trống. Postman POST thì lưu được." (Saving a note says success, nothing is saved.)</p>
<p><strong>BUG-604</strong> — "Một số bạn dùng lâu (từ đầu kỳ) mở trang thì thấy <em>400 Bad Request — Request Header Or Cookie Too Large</em>. Máy mới, tab ẩn danh, Postman đều bình thường." (Long-time users get 400 on the page; incognito works.)</p>
</div>

<h3>Hints (open one level at a time)</h3>
<details><summary>BUG-601 — level 1 / 2 / 3</summary><p>1: Compare the request headers of the browser POST and a Postman POST. 2: Look at <code>ct</code> in <code>api.log</code>. What does <code>fetch</code> send when <code>body</code> is a string and you gave no headers? 3: <code>text/plain;charset=UTF-8</code>; the API treats non-JSON as an empty object. Fix the client header; make the API answer 415 with the received type.</p></details>
<details><summary>BUG-602 — level 1 / 2 / 3</summary><p>1: Fix BUG-601 first, or the request never gets this far. 2: What does <code>&lt;input type="datetime-local"&gt;</code> give you, and what time zone does the server run in? 3: <code>"2026-11-26T08:00"</code> has no offset; the server parses it as UTC. Convert with <code>new Date(value).toISOString()</code> in the browser; reject offset-less strings in the API (lesson 6.3).</p></details>
<details><summary>BUG-603 — level 1 / 2 / 3</summary><p>1: Count the requests in Network after one click. 2: There is a 301. What does a browser do with a POST after a 301? 3: The SEO rule <code>rewrite ^/(.+)/$ /$1 permanent</code> also hits <code>/api/…/ghi-chu/</code>; the redirected request is a GET, which returns the note with 200. Remove the trailing slash in <code>app.js</code> and limit the rewrite to pages.</p></details>
<details><summary>BUG-604 — level 1 / 2 / 3</summary><p>1: Who wrote the 400 page (lesson 6.1)? Which request header differs between an old profile and incognito? 2: Look at the Cookie header size; nginx's default <code>large_client_header_buffers</code> is 4 × 8k. Why is there nothing in <code>error.log</code> at level warn? 3: <code>ghiLuotXem()</code> adds a new cookie on every visit. Stop writing cookies (localStorage is enough), delete the old ones from JS — and think: can the new JS even run for a user whose very first request is rejected?</p></details>

<h3>What to hand in</h3>
<ul>
<li>Per ticket: the minimal curl that reproduces it (bug version) + the same curl on the fixed version; the log line(s) that prove the cause; the diff.</li>
<li>For BUG-604: your rollout plan for users who already carry the cookies.</li>
<li>A short note per ticket: which side broke which contract.</li>
<li><code>node tools/lab6.mjs</code> output showing four ĐẠT (or equivalent screenshots of Network).</li>
</ul>
<details><summary>tools/lab6.mjs + tools/mo.mjs — the automated check we used</summary>${ma(L_KIEM)}${ma(MO)}</details>

<h3>Rubric (100 points)</h3>
<table>
<thead><tr><th>Item</th><th>Points</th></tr></thead>
<tbody>
<tr><td>Four minimal curl reproductions (each ≤ 2 headers beyond the essentials)</td><td>4 × 8 = 32</td></tr>
<tr><td>Log evidence per ticket (API <code>ct</code>, nginx 301/400, error.log at the right level)</td><td>4 × 5 = 20</td></tr>
<tr><td>Correct fixes on the right side (client and/or server), no "raise all limits"</td><td>4 × 6 = 24</td></tr>
<tr><td>BUG-604 rollout plan that works for existing users</td><td>10</td></tr>
<tr><td>Contract notes (Content-Type, offset, method after redirect, cookie budget)</td><td>8</td></tr>
<tr><td>Clear write-up a QA engineer can verify alone</td><td>6</td></tr>
</tbody></table>

<h3>🎤 What an interviewer will ask</h3>
${HOI_EN}
<details><summary>Answer outlines</summary>${DAN_Y_EN}</details>

<h3>🛠 Project milestone</h3>
<p>In your own project (or the course capstone): put a correlation id at the edge and show it on error screens; add one Bruno/Postman request per endpoint with an assertion; add a contract test with an id above 2<sup>53</sup> and a time with an offset. These three changes turn every future "it fails from the UI" ticket into a 10-minute job.</p>

<h3>Answers (check only after writing yours)</h3>
<details><summary>Our real run on the buggy version (Chrome 150, CDP)</summary>${OUT_LOI}
<p>Note how BUG-602 cannot even be observed while BUG-601 rejects every booking — fix in order, re-run everything after each fix. And BUG-604 leaves no trace at nginx's default <code>error_log … warn</code>: the line "client sent too long header line" is logged at <code>info</code>. We set <code>info</code> in this lab; in many real servers you will find nothing at all and must reproduce with curl.</p></details>
<details><summary>Minimal curl reproductions</summary>${OUT_CURL}</details>
<details><summary>The fix (diff) and the run on the fixed version</summary>${ma(L_DIFF, 'diff')}${OUT_SUA}
<p>Contracts restored: the client labels JSON as JSON and the API refuses anything else with 415; times leave the browser as UTC instants and the API rejects offset-less strings; API URLs never get SEO rewrites (and a POST must never be answered with 301/302 — if a redirect is really needed, 307/308 keep the method and body); no cookie grows per visit — every cookie is sent on <em>every</em> request, including images and API calls.</p></details>
<details><summary>BUG-604: users who already carry the cookies</summary>${OUT_NANG_CAP}${ma(L_NANG_CAP)}
<p>The fixed JavaScript can only clean up if the page loads, and the page cannot load while nginx rejects the header. Hence two steps: temporarily raise the limit (<code>large_client_header_buffers 4 16k</code>) and ship the cleaning JS; after most users have visited (watch the Cookie size in logs), go back to the default. Alternative for a total reset: a response header <code>Clear-Site-Data: "cookies"</code> on a page that still loads. Raising the limit forever just moves the cliff.</p></details>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Lab</span>
<h2>"Postman thì chạy mà"</h2>
<p class="lead">Câu hay gặp nhất trong mọi cuộc cãi nhau giữa front-end và back-end. Việc của bạn trong lab này: với bốn ticket, chứng minh chính xác khác biệt nào giữa request của trình duyệt và request của tester gây ra lỗi — bằng một lệnh curl tối giản tái hiện được — rồi sửa ở đúng phía.</p>

<h3>Luật</h3>
<ul>
<li>Với mỗi ticket, trước hết tái hiện bằng <strong>curl tối giản</strong> (bài 6.2), rồi mới sửa. Sửa mà không có bản tái hiện thì được 0 điểm.</li>
<li>Bằng chứng lấy từ Network của DevTools (hoặc script CDP), log nginx và log API — không phải từ việc đọc mã trước.</li>
<li>Sửa ở phía đã phá hợp đồng; nếu cả hai phía liên quan, nói rõ phần nào thuộc về ai.</li>
<li>Được dùng: mọi thứ của Chương 5 và 6. Thời gian: 2–3 giờ.</li>
</ul>

<h3>Chuẩn bị (10 phút)</h3>
<ol>
<li>Cần: Node 22, Docker (image <code>nginx:1.27-alpine</code>), Chrome. Chép các tệp bên dưới vào <code>lab/</code>.</li>
<li><code>bash lab/chay.sh</code> → mở <code>http://localhost:41620</code>. API chạy với <code>TZ=UTC</code>, giống máy chủ thật.</li>
<li>Log: <code>lab/log/api.log</code> (mỗi request một dòng JSON, có <code>ct</code> = Content-Type nhận được), nginx ở <code>lab/log/access.log</code> và <code>error.log</code>.</li>
<li>Kiểm tự động (không bắt buộc): <code>node tools/lab6.mjs</code> (cần <code>playwright-core</code> và Chrome) in bảng kiểu Network và ĐẠT/CHƯA cho từng ticket.</li>
</ol>
${TEP(false)}

<h3>Bốn ticket (nguyên văn QA viết)</h3>
<div class="callout">
<p><strong>BUG-601</strong> — "Đặt lượt trên web luôn báo <em>Lỗi: Thiếu trường phong/nguoiDat/batDau</em>, dù đã điền đủ. Gọi API bằng Postman thì tạo được."</p>
<p><strong>BUG-602</strong> — "Chọn 08:00 ngày 26/11 thì lịch hiện 15:00. Test bằng Postman với <code>2026-11-26T08:00:00+07:00</code> thì đúng. Máy dev của bạn Nam cũng đúng."</p>
<p><strong>BUG-603</strong> — "Bấm Ghi chú, nhập nội dung, hiện <em>Đã lưu ghi chú</em> nhưng tải lại thì vẫn trống. Postman POST thì lưu được."</p>
<p><strong>BUG-604</strong> — "Một số bạn dùng lâu (từ đầu kỳ) mở trang thì thấy <em>400 Bad Request — Request Header Or Cookie Too Large</em>. Máy mới, tab ẩn danh, Postman đều bình thường."</p>
</div>

<h3>Gợi ý (mở từng bậc một)</h3>
<details><summary>BUG-601 — bậc 1 / 2 / 3</summary><p>1: So header của request POST từ trình duyệt với request POST từ Postman. 2: Xem trường <code>ct</code> trong <code>api.log</code>. <code>fetch</code> gửi gì khi <code>body</code> là chuỗi mà bạn không đưa header nào? 3: <code>text/plain;charset=UTF-8</code>; API coi mọi thứ không phải JSON là đối tượng rỗng. Sửa header ở client; cho API trả 415 kèm kiểu đã nhận.</p></details>
<details><summary>BUG-602 — bậc 1 / 2 / 3</summary><p>1: Sửa BUG-601 trước, không thì request chẳng bao giờ tới được chỗ này. 2: <code>&lt;input type="datetime-local"&gt;</code> trả cho bạn cái gì, và server chạy ở múi giờ nào? 3: <code>"2026-11-26T08:00"</code> không có độ lệch; server hiểu nó là UTC. Đổi bằng <code>new Date(value).toISOString()</code> ở trình duyệt; API từ chối chuỗi không có độ lệch (bài 6.3).</p></details>
<details><summary>BUG-603 — bậc 1 / 2 / 3</summary><p>1: Đếm số request trong Network sau một lần bấm. 2: Có một 301. Trình duyệt làm gì với một POST sau 301? 3: Quy tắc SEO <code>rewrite ^/(.+)/$ /$1 permanent</code> trúng luôn cả <code>/api/…/ghi-chu/</code>; request sau chuyển hướng là GET, và GET trả về ghi chú với mã 200. Bỏ dấu / cuối trong <code>app.js</code> và giới hạn rewrite cho các trang.</p></details>
<details><summary>BUG-604 — bậc 1 / 2 / 3</summary><p>1: Ai viết trang 400 (bài 6.1)? Header nào của request khác nhau giữa hồ sơ trình duyệt cũ và tab ẩn danh? 2: Xem độ lớn header Cookie; mặc định <code>large_client_header_buffers</code> của nginx là 4 × 8k. Vì sao ở mức warn thì <code>error.log</code> chẳng có gì? 3: <code>ghiLuotXem()</code> thêm một cookie mới mỗi lần mở trang. Thôi ghi cookie (localStorage là đủ), xoá cookie cũ bằng JS — và nghĩ xem: JS mới có chạy nổi không với một người dùng mà ngay request đầu tiên đã bị từ chối?</p></details>

<h3>Nộp gì</h3>
<ul>
<li>Mỗi ticket: lệnh curl tối giản tái hiện được (bản lỗi) + cùng lệnh đó trên bản đã sửa; (các) dòng log chứng minh nguyên nhân; diff.</li>
<li>Riêng BUG-604: kế hoạch triển khai cho những người dùng đang mang sẵn đống cookie.</li>
<li>Mỗi ticket một ghi chú ngắn: phía nào đã phá hợp đồng nào.</li>
<li>Output <code>node tools/lab6.mjs</code> có bốn dòng ĐẠT (hoặc ảnh chụp Network tương đương).</li>
</ul>
<details><summary>tools/lab6.mjs + tools/mo.mjs — bộ kiểm tự động chúng tôi đã dùng</summary>${ma(L_KIEM)}${ma(MO)}</details>

<h3>Rubric (100 điểm)</h3>
<table>
<thead><tr><th>Mục</th><th>Điểm</th></tr></thead>
<tbody>
<tr><td>Bốn bản tái hiện curl tối giản (mỗi bản ≤ 2 header ngoài phần thiết yếu)</td><td>4 × 8 = 32</td></tr>
<tr><td>Bằng chứng log cho từng ticket (<code>ct</code> của API, nginx 301/400, error.log đúng mức)</td><td>4 × 5 = 20</td></tr>
<tr><td>Sửa đúng ở đúng phía (client và/hoặc server), không "nới hết giới hạn"</td><td>4 × 6 = 24</td></tr>
<tr><td>Kế hoạch triển khai BUG-604 chạy được với người dùng hiện có</td><td>10</td></tr>
<tr><td>Ghi chú hợp đồng (Content-Type, độ lệch múi giờ, method sau chuyển hướng, ngân sách cookie)</td><td>8</td></tr>
<tr><td>Bản viết rõ ràng, QA tự kiểm lại được một mình</td><td>6</td></tr>
</tbody></table>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
${HOI_VI}
<details><summary>Dàn ý trả lời</summary>${DAN_Y_VI}</details>

<h3>🛠 Mốc dự án</h3>
<p>Trong dự án của chính bạn (hoặc dự án cuối khoá): đặt correlation id ở cổng vào và hiện nó trên màn hình lỗi; thêm mỗi endpoint một request Bruno/Postman có phép kiểm; thêm một test hợp đồng với id lớn hơn 2<sup>53</sup> và một thời điểm có độ lệch múi giờ. Ba thay đổi này biến mọi ticket "gọi từ giao diện thì lỗi" sau này thành việc 10 phút.</p>

<h3>Đáp án (chỉ xem sau khi đã viết câu trả lời của mình)</h3>
<details><summary>Lần chạy thật của chúng tôi trên bản lỗi (Chrome 150, CDP)</summary>${OUT_LOI}
<p>Để ý BUG-602 còn không quan sát được khi BUG-601 đang chặn mọi lượt đặt — sửa theo thứ tự, và chạy lại tất cả sau mỗi lần sửa. Còn BUG-604 không để lại dấu vết nào ở mức mặc định <code>error_log … warn</code> của nginx: dòng "client sent too long header line" được ghi ở mức <code>info</code>. Lab này đặt <code>info</code>; trên nhiều server thật bạn sẽ chẳng thấy gì và phải tái hiện bằng curl.</p></details>
<details><summary>Các bản tái hiện curl tối giản</summary>${OUT_CURL}</details>
<details><summary>Bản sửa (diff) và lần chạy trên bản đã sửa</summary>${ma(L_DIFF, 'diff')}${OUT_SUA}
<p>Các hợp đồng được khôi phục: client dán nhãn JSON là JSON và API từ chối mọi thứ khác bằng 415; thời gian rời trình duyệt dưới dạng thời điểm UTC và API từ chối chuỗi không có độ lệch; URL của API không bao giờ bị rewrite kiểu SEO (và không bao giờ trả 301/302 cho một POST — nếu thật sự cần chuyển hướng, 307/308 giữ nguyên method và body); không cookie nào phình theo số lần mở trang — mọi cookie đều bị gửi kèm <em>mọi</em> request, kể cả ảnh và lời gọi API.</p></details>
<details><summary>BUG-604: người dùng đang mang sẵn đống cookie</summary>${OUT_NANG_CAP}${ma(L_NANG_CAP)}
<p>JavaScript đã sửa chỉ dọn được khi trang tải được, mà trang không tải được khi nginx còn từ chối header. Vì vậy cần hai bước: tạm nâng giới hạn (<code>large_client_header_buffers 4 16k</code>) và phát hành JS biết dọn; khi phần lớn người dùng đã ghé lại (theo dõi độ lớn Cookie trong log), trả về mặc định. Cách khác để xoá sạch: header response <code>Clear-Site-Data: "cookies"</code> trên một trang vẫn tải được. Nâng giới hạn vĩnh viễn chỉ dời vách đá ra xa hơn.</p></details>
</div>
`,
};
