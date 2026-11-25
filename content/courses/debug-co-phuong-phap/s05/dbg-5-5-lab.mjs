/**
 * 5.5 — Lab: Năm lỗi giao diện trong ứng dụng React mẫu (soạn 24/11/2026).
 * Repo lab THẬT: vbg-dp/scratchpad/dbg/lab/ch5/lab (API node:http 41520 + dịch vụ báo cáo 41522 + Vite/React 41521), bản sửa lab-sua, lab-sua.diff.
 * Đáp án = output THẬT của tools/lab5.mjs (Chrome 150 headless + CDP) trên bản lỗi (o-lab5-loi.txt), bản sửa (o-lab5-sua.txt)
 * và đường nâng cấp service worker (o-lab5-nang-cap.txt). Đáp án nằm cuối bài, che bằng <details>.
 */
import { nguon, lienKet } from '../_chung.mjs';
import { L_API, L_APP, L_MAIN, L_API_JS, L_SW, L_VITE, L_PKG, L_INDEX, L_CHAY, L_DUNG, L_DIFF, L_KIEM, MO } from './_ma-5.mjs';

const ma = (s, lang = 'js') => `<pre><code class="language-${lang}">${s}</code></pre>`;

const OUT_LOI = `<div class="out">── open the page
[Console error] Access to fetch at 'http://127.0.0.1:41522/bao-cao/tuan' from origin 'http://localhost:41521' has been blocked by CORS policy:
                Request header field x-lop is not allowed by Access-Control-Allow-Headers in preflight response.
[Network] OPTIONS /bao-cao/tuan → 204
[Network] GET /bao-cao/tuan → (failed)  CORS error: HeaderDisallowedByPreflightResponse x-lop
page: "LabFlow — Đăng nhập Lab 401 Lab 402 Lịch phòng 401 #1 phòng 401 · 08:00 — SE1801 #2 phòng 401 · 13:00 — SE1802 Lưu Không tải được báo cáo"
── click Đăng nhập
[Network] POST /api/auth/dang-nhap → 200
[Network] GET /api/toi → 401 (from service worker)
h1: "LabFlow — Đăng nhập"
[Application › Cookies] sid Path=/api/auth SameSite=Lax HttpOnly=true
── type 17:00, press Enter
[Network] POST /api/dat-cho → 409  ⚠ cookie not sent: sid: NotOnPath
             initiator: luu App.jsx:28 ← DatChoForm App.jsx:34 ← App App.jsx:67
[Network] POST /api/dat-cho → 201
             initiator: luu App.jsx:28 ← onKeyDown App.jsx:35 ← DatChoForm App.jsx:35 ← App App.jsx:67
message: "Đã đặt lượt #4"
── choose Lab 402, wait 4 s
[Network] GET /api/dat-cho?phong=402 → 200 (from service worker)
             initiator: tai App.jsx:7 ← (anonymous) App.jsx:9 ← App App.jsx:66
after 0.5 s: ["#3 phòng 402 · 09:00 — SE1803"]
[Network] GET /api/dat-cho?phong=401 → 200 (from service worker)
             initiator: tai App.jsx:7 ← (anonymous) App.jsx:11 ← (anonymous) App.jsx:11 ← App App.jsx:66
after 4 s:   ["#1 phòng 401 · 08:00 — SE1801","#2 phòng 401 · 13:00 — SE1802","#4 phòng 401 · 17:00 — SE1804"]  (h2: "Lịch phòng 402")
── reload
[Network] GET /api/toi → 401 (from service worker)
h1: "LabFlow — Đăng nhập"</div>`;

const OUT_SUA = `<div class="out">── open the page
[Network] OPTIONS /bao-cao/tuan → 204
[Network] GET /bao-cao/tuan → 200
page: "… Lưu Tuần này: 3 lượt, 6 giờ"
── click Đăng nhập
[Network] POST /api/auth/dang-nhap → 200
[Network] GET /api/toi → 200
h1: "LabFlow — xin chào SE1804"
[Application › Cookies] sid Path=/ SameSite=Lax HttpOnly=true
── type 17:00, press Enter
[Network] POST /api/dat-cho → 201                   ← one POST
message: "Đã đặt lượt #4"
── choose Lab 402, wait 4 s
after 0.5 s: ["#3 phòng 402 · 09:00 — SE1803"]
[Network] GET /api/dat-cho?phong=402 → 200          ← the 3-second refresh asks for the CURRENT room
after 4 s:   ["#3 phòng 402 · 09:00 — SE1803"]  (h2: "Lịch phòng 402")
── reload
[Network] GET /api/toi → 200                        ← from the server, not from a service worker
h1: "LabFlow — xin chào SE1804"</div>`;

const OUT_NANGCAP = `<div class="out"># a user visited the BUGGY version (old sw.js active), then we deployed the FIXED version on the same port
buggy version — Cache storage: ["labflow"]
— deploy fixed version —
  /api/toi → 401 (from service worker)
reload 1: Cache storage ["labflow"]          ← the old worker still answered this load; the browser fetched the new sw.js meanwhile
  /api/toi → 401 (from service worker)
reload 2: Cache storage []                   ← new worker activated, deleted "labflow"
  /api/toi → 200
logged in, reload: h1 "LabFlow — xin chào SE1804"</div>`;

const NGUON = [
  nguon('📋', 'Mẫu nhật ký gỡ lỗi — Lab 1.5', 'Triệu chứng → tái hiện → giả thuyết → bằng chứng → nguyên nhân → sửa → kiểm.', '/courses/debug-co-phuong-phap/learn?lessonSlug=dbg-1-5-lab'),
  nguon('🌐', 'Chrome DevTools — Network features reference', 'Initiator, Cookies tab, "show filtered out request cookies".', 'https://developer.chrome.com/docs/devtools/network/reference'),
  nguon('⚙️', 'web.dev — Service worker lifecycle', 'install / waiting / activate, skipWaiting, clients.claim, cập nhật sw.js.', 'https://web.dev/articles/service-worker-lifecycle'),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-11-1-bug-report', title: 'Bài 11.1 — bug report người khác làm được ngay', sub: 'Viết lại 5 bug report của lab này cho chuẩn.', cta: 'Mở bài →' }),
].join('\n');

const BAI = (en) => `
<details><summary>${en ? 'App files (copy into lab/ — or take them from the course repo folder ch5/lab)' : 'Các tệp của ứng dụng (chép vào lab/ — hoặc lấy ở thư mục ch5/lab của repo khoá)'}</summary>
<p><code>lab/api.mjs</code></p>${ma(L_API)}
<p><code>lab/web/src/App.jsx</code></p>${ma(L_APP, 'jsx')}
<p><code>lab/web/src/main.jsx</code> · <code>lab/web/src/api.js</code> · <code>lab/web/public/sw.js</code></p>${ma(L_MAIN, 'jsx')}${ma(L_API_JS)}${ma(L_SW)}
<p><code>lab/web/vite.config.mjs</code> · <code>lab/web/package.json</code> · <code>lab/web/index.html</code> · <code>lab/chay.sh</code> · <code>lab/dung.sh</code></p>${ma(L_VITE)}${ma(L_PKG, 'json')}${ma(L_INDEX, 'html')}${ma(L_CHAY, 'bash')}${ma(L_DUNG, 'bash')}
</details>`;

export default {
  title: '5.5 — Lab: Five front-end bugs in the sample React app|||5.5 — Lab: Năm lỗi giao diện trong ứng dụng React mẫu',
  slug: 'dbg-5-5-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Repo React + API chạy thật với 5 bug report kiểu QA: báo cáo tuần luôn lỗi (CORS chặn header X-Lop ở preflight), đăng nhập không giữ (cookie Path=/api/auth), nhấn Enter tạo trùng lượt (onKeyDown + onSubmit), danh sách tự nhảy về phòng cũ (closure cũ trong setInterval), đăng nhập mất sau tải lại (service worker cache cả /api). Mỗi lỗi phải có bằng chứng DevTools; gợi ý 3 bậc, rubric 100 điểm, 5 câu phỏng vấn, đáp án output thật + diff + đường nâng cấp SW.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lab</span>
<h2>Five tickets, five DevTools panels, evidence for each</h2>
<p class="lead">A new LabFlow page, "Lịch của tôi", came back from QA with five tickets. The code is short and every bug is real — we reproduced each one in Chrome 150. Your job is the one you will have on your first OJT sprint: for each ticket, <strong>prove the cause with DevTools evidence before you edit any code</strong>, fix it, and show the ticket's steps now pass. Answers with our real outputs are at the end — do not open them before you have written your own.</p>

<h3>Rules</h3>
<ul>
<li>No guessing in the code first. For each ticket the first artefact is a DevTools observation (a Network row, a Console line, a cookie with ⚠, a paused stack, a component's props/state, a Cache storage entry).</li>
<li>No <code>console.log</code> added before you have that observation. Breakpoints, filters and the panels of lessons 5.1–5.4 are enough.</li>
<li>One fix per ticket, smallest change that removes the cause. Re-run the ticket's steps after each fix — some tickets only appear after another is fixed.</li>
</ul>

<h3>Setup (10 min)</h3>
<ol>
<li>Node 22. Folder <code>lab/</code> with the files below; <code>cd lab/web &amp;&amp; npm install</code>.</li>
<li><code>bash lab/chay.sh</code> → API on <code>127.0.0.1:41520</code>, report service on <code>127.0.0.1:41522</code>, web on <code>http://localhost:41521</code> (the web calls <code>/api</code> through the Vite proxy, and the report service directly).</li>
<li>Open Chrome with a <em>fresh profile</em> (or a Guest window) so no old service worker or cookie interferes. DevTools open, Preserve log on.</li>
<li>Data resets each time you restart the API. Stop everything with <code>bash lab/dung.sh</code>.</li>
</ol>
${BAI(true)}

<h3>The five tickets (as QA wrote them)</h3>
<div class="callout">
<p><strong>BUG-501 — "Tuần này" box always says "Không tải được báo cáo".</strong> Every browser, every user. The report team says their service is up and "curl works".</p>
<p><strong>BUG-502 — Login does not stick.</strong> Click Đăng nhập: no error, but the header still shows the Đăng nhập button.</p>
<p><strong>BUG-503 — Enter creates a duplicate.</strong> Type a time, press Enter: the booking is created, but sometimes "Trùng lượt #…" appears. Clicking Lưu with the mouse works fine.</p>
<p><strong>BUG-504 — The list jumps back to the old room.</strong> Choose Lab 402: the list is right, then a few seconds later it shows Lab 401's bookings while the title still says "Lịch phòng 402".</p>
<p><strong>BUG-505 — Logged out after reload.</strong> (Appears once BUG-502 is fixed.) Log in, it works; reload the page: the Đăng nhập button is back. Clearing site data "fixes it" until the next visit.</p>
</div>

<h3>Hints (open one level at a time)</h3>
<details><summary>BUG-501 — level 1 / 2 / 3</summary>
<p>1. Which panel tells you whether the browser even let your code read the response? 2. Look for a preflight row before the GET, and read the Console line word by word: which header does it name? 3. Compare the request's <code>Access-Control-Request-Headers</code> with the response's <code>Access-Control-Allow-Headers</code>. The report team's curl does not send a preflight.</p></details>
<details><summary>BUG-502 — level 1 / 2 / 3</summary>
<p>1. The login response is 200; is the cookie stored? Application › Cookies. 2. It is stored — so is it <em>sent</em> on <code>/api/toi</code>? Network → that request → Cookies → "show filtered out request cookies". 3. Read the cookie's <em>Path</em> column, then the URL of <code>/api/toi</code>.</p></details>
<details><summary>BUG-503 — level 1 / 2 / 3</summary>
<p>1. Count the POSTs in Network when you press Enter, then when you click. 2. Initiator column, or a fetch breakpoint on <code>/api/dat-cho</code>: compare the two stacks. 3. What does the browser already do when you press Enter in the only text input of a form?</p></details>
<details><summary>BUG-504 — level 1 / 2 / 3</summary>
<p>1. Filter Network on <code>dat-cho</code> and watch the query string every 3 seconds after choosing 402. 2. Open the Initiator of the wrong request: which line? Set a breakpoint there and read <code>phong</code> in Scope — which closure is it in? 3. Which effect created that interval, and what are its dependencies?</p></details>
<details><summary>BUG-505 — level 1 / 2 / 3</summary>
<p>1. Look at the Size column of <code>/api/toi</code> after the reload. 2. Application › Service workers and Cache storage: what is stored, under which name? 3. Read <code>sw.js</code>: which requests does it answer from the cache, and does it ever delete anything? After your fix, how many reloads does an <em>existing</em> user need?</p></details>

<h3>What to hand in</h3>
<ul>
<li>For each ticket, a debugging log in the lesson 1.5 format, whose "evidence" line names the DevTools panel and quotes what you saw.</li>
<li>One diff (all fixes), and the five ticket steps re-run on the fixed version (a short screen recording or the Network list is fine).</li>
<li>BUG-505 only: a note "what happens to users who already have the old worker", measured, not guessed.</li>
<li>Optional: run the automated check <code>node tools/lab5.mjs 41521</code> (needs <code>npm i playwright-core</code> and Chrome) on your fixed version — its output should match the "fixed" output below.</li>
</ul>
<details><summary>tools/lab5.mjs + tools/mo.mjs — the automated check we used</summary>${ma(L_KIEM)}${ma(MO)}</details>

<h3>Rubric (100 points)</h3>
<ul>
<li>Evidence before code, for all five (5 × 8 = 40): panel named, observation quoted, cause stated in one sentence.</li>
<li>Correct, minimal fixes (5 × 6 = 30): the cause removed, not the symptom hidden (e.g. disabling the service worker entirely, or a <code>setTimeout</code> to "wait for the cookie", earns 0 for that ticket).</li>
<li>Verification (15): every ticket's steps re-run after the last fix; BUG-505 upgrade path measured.</li>
<li>Write-up quality (15): a reviewer who never saw the code understands each cause from your logs.</li>
</ul>

<h3>🎤 What an interviewer will ask</h3>
<ol>
<li>"A user says our API has a CORS error. Where do you look, and how do you show it is not the server crashing?"</li>
<li>"Login returns 200 but the user is not logged in. Name three cookie attributes that can cause it and how you see each in DevTools."</li>
<li>"What is the difference between a site and an origin? Give an example where it matters."</li>
<li>"Why can a React component show data from an old prop? How do you see it, and how do you fix it?"</li>
<li>"After a deploy some users still see the old version. List the caches between your server and their screen, and how you check each."</li>
</ol>
<details><summary>Answer outlines</summary>
<p>1. Network: preflight row and the blocked request's "CORS error"; Console message; compare Origin/Allow-* headers; server log shows the request (or only the OPTIONS); curl reproduces. CORS is enforced by the browser. 2. SameSite (⚠ SameSiteLax on Set-Cookie or on the request), Secure (SameSiteNoneInsecure / not sent over http), Domain/Path (NotOnPath, not sent) — Network › Cookies with filtered-out cookies, Application › Cookies. 3. Origin = scheme+host+port; site = scheme+eTLD+1; localhost:41521 → 127.0.0.1:41522 is cross-site; app.x.com → api.x.com is cross-origin but same-site. 4. State copied from props, or a closure captured in an effect/interval with stale deps; React DevTools props vs hooks, breakpoint + Scope; fix deps / derive from props / cleanup. 5. Browser HTTP cache, service worker caches, CDN/proxy, the build itself (old bundle), API-level caches; Disable cache, Size column "(ServiceWorker)/(disk cache)", Application, response headers (Age, cf-cache-status), version endpoint.</p></details>

<h3>🛠 Project milestone</h3>
<p>Add to your course project (the LabFlow you are debugging through this course) a short <code>DEBUGGING.md</code> section "Front-end": how to open the app with a clean profile, the DevTools settings the team uses (Preserve log, Disable cache, Ignore list <code>/node_modules/</code>), how to export a sanitized HAR, and how to unregister the service worker. The final project (chapter 12) includes a CORS bug and a stale-cache bug — this checklist will save you there.</p>

<h3>Answers (check only after writing yours)</h3>
<details><summary>Our real run on the buggy version (Chrome 150, CDP)</summary>${OUT_LOI}
<ul>
<li><strong>BUG-501:</strong> preflight is 204 but its <code>Access-Control-Allow-Headers: Content-Type</code> does not include <code>x-lop</code> ⇒ <code>HeaderDisallowedByPreflightResponse</code>. Fix the report service: <code>'Content-Type, X-Lop'</code>.</li>
<li><strong>BUG-502:</strong> cookie stored with <code>Path=/api/auth</code>; <code>/api/toi</code> is outside that path ⇒ not sent (<code>NotOnPath</code>, visible on the next requests). Fix: <code>Path=/</code>.</li>
<li><strong>BUG-503:</strong> two POSTs: one from <code>onKeyDown</code> (App.jsx:35) calling <code>luu()</code>, one from the form's <code>onSubmit</code> (implicit submission: Enter in the only input submits the form). Fix: remove <code>onKeyDown</code>.</li>
<li><strong>BUG-504:</strong> the wrong request's initiator is App.jsx:11, the interval created by an effect with <code>[]</code>: its closure holds <code>phong = 401</code> forever. Fix: one effect with <code>[phong]</code>, clear the interval in cleanup, ignore late answers.</li>
<li><strong>BUG-505:</strong> <code>/api/toi → 401 (from service worker)</code>: the worker answers every GET from cache "labflow" first, including API calls, and never deletes anything. Fix: never cache <code>/api/</code>, network-first for files, versioned cache deleted on activate.</li>
</ul></details>
<details><summary>The fix (diff) and the run on the fixed version</summary>${ma(L_DIFF, 'diff')}${OUT_SUA}</details>
<details><summary>BUG-505: users who already have the old worker</summary>${OUT_NANGCAP}
<p>The first load after the deploy is still served by the old worker; the new worker installs, activates (it calls <code>skipWaiting</code> + <code>clients.claim</code>) and deletes the old cache, so the second load is clean. Tell support: "if a customer still sees the old version, one more reload fixes it; Clear site data if not".</p></details>
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Lab</span>
<h2>Năm ticket, năm tab DevTools, mỗi ticket một bằng chứng</h2>
<p class="lead">Một trang LabFlow mới, "Lịch của tôi", bị QA trả về với năm ticket. Mã ngắn và mọi lỗi đều thật — chúng tôi đã tái hiện từng lỗi trên Chrome 150. Việc của bạn đúng là việc bạn sẽ làm ở sprint OJT đầu tiên: với mỗi ticket, <strong>chứng minh nguyên nhân bằng bằng chứng DevTools trước khi sửa dòng mã nào</strong>, sửa, rồi cho thấy các bước của ticket giờ đã qua. Đáp án kèm output thật ở cuối bài — đừng mở trước khi đã viết câu trả lời của mình.</p>

<h3>Luật</h3>
<ul>
<li>Không đoán trong mã trước. Với mỗi ticket, sản phẩm đầu tiên là một quan sát DevTools (một dòng Network, một dòng Console, một cookie có ⚠, một stack đang dừng, props/state của một component, một mục trong Cache storage).</li>
<li>Không thêm <code>console.log</code> trước khi có quan sát đó. Breakpoint, bộ lọc và các tab của bài 5.1–5.4 là đủ.</li>
<li>Mỗi ticket một bản sửa, thay đổi nhỏ nhất gỡ được nguyên nhân. Chạy lại các bước của ticket sau mỗi lần sửa — có ticket chỉ lộ ra khi ticket khác đã sửa.</li>
</ul>

<h3>Chuẩn bị (10 phút)</h3>
<ol>
<li>Node 22. Thư mục <code>lab/</code> chứa các tệp dưới đây; <code>cd lab/web &amp;&amp; npm install</code>.</li>
<li><code>bash lab/chay.sh</code> → API ở <code>127.0.0.1:41520</code>, dịch vụ báo cáo ở <code>127.0.0.1:41522</code>, web ở <code>http://localhost:41521</code> (web gọi <code>/api</code> qua proxy của Vite, còn dịch vụ báo cáo thì gọi thẳng).</li>
<li>Mở Chrome bằng <em>hồ sơ mới</em> (hoặc cửa sổ Khách) để không có service worker hay cookie cũ chen vào. Mở DevTools, bật Preserve log.</li>
<li>Dữ liệu về lại ban đầu mỗi lần khởi động lại API. Dừng tất cả bằng <code>bash lab/dung.sh</code>.</li>
</ol>
${BAI(false)}

<h3>Năm ticket (nguyên văn QA viết)</h3>
<div class="callout">
<p><strong>BUG-501 — Ô "Tuần này" luôn ghi "Không tải được báo cáo".</strong> Mọi trình duyệt, mọi người dùng. Đội báo cáo nói dịch vụ của họ vẫn chạy và "curl được".</p>
<p><strong>BUG-502 — Đăng nhập không giữ được.</strong> Bấm Đăng nhập: không báo lỗi, nhưng đầu trang vẫn hiện nút Đăng nhập.</p>
<p><strong>BUG-503 — Nhấn Enter tạo trùng.</strong> Gõ giờ, nhấn Enter: lượt được tạo, nhưng thỉnh thoảng hiện "Trùng lượt #…". Bấm chuột vào Lưu thì bình thường.</p>
<p><strong>BUG-504 — Danh sách nhảy về phòng cũ.</strong> Chọn Lab 402: danh sách đúng, vài giây sau lại hiện lượt của Lab 401 trong khi tiêu đề vẫn ghi "Lịch phòng 402".</p>
<p><strong>BUG-505 — Tải lại là mất đăng nhập.</strong> (Lộ ra sau khi sửa BUG-502.) Đăng nhập được; tải lại trang: nút Đăng nhập quay lại. Xoá dữ liệu trang thì "hết" cho tới lần vào sau.</p>
</div>

<h3>Gợi ý (mở từng bậc một)</h3>
<details><summary>BUG-501 — bậc 1 / 2 / 3</summary>
<p>1. Tab nào cho biết trình duyệt có cho mã của bạn đọc response hay không? 2. Tìm dòng preflight trước GET, và đọc từng chữ của dòng Console: nó gọi tên header nào? 3. So <code>Access-Control-Request-Headers</code> của request với <code>Access-Control-Allow-Headers</code> của response. curl của đội báo cáo không gửi preflight.</p></details>
<details><summary>BUG-502 — bậc 1 / 2 / 3</summary>
<p>1. Response đăng nhập là 200; cookie có được lưu không? Application › Cookies. 2. Có lưu — vậy nó có được <em>gửi</em> kèm <code>/api/toi</code> không? Network → request đó → Cookies → "show filtered out request cookies". 3. Đọc cột <em>Path</em> của cookie, rồi nhìn URL của <code>/api/toi</code>.</p></details>
<details><summary>BUG-503 — bậc 1 / 2 / 3</summary>
<p>1. Đếm số POST ở Network khi nhấn Enter, rồi khi bấm chuột. 2. Cột Initiator, hoặc breakpoint fetch cho <code>/api/dat-cho</code>: so hai stack. 3. Trình duyệt vốn đã làm gì khi bạn nhấn Enter trong ô nhập duy nhất của một form?</p></details>
<details><summary>BUG-504 — bậc 1 / 2 / 3</summary>
<p>1. Lọc Network theo <code>dat-cho</code> và nhìn query string mỗi 3 giây sau khi chọn 402. 2. Mở Initiator của request sai: dòng nào? Đặt breakpoint ở đó và đọc <code>phong</code> trong Scope — nó thuộc closure nào? 3. Effect nào tạo ra interval đó, dependency của nó là gì?</p></details>
<details><summary>BUG-505 — bậc 1 / 2 / 3</summary>
<p>1. Nhìn cột Size của <code>/api/toi</code> sau khi tải lại. 2. Application › Service workers và Cache storage: cất gì, dưới tên nào? 3. Đọc <code>sw.js</code>: nó trả lời những request nào từ bộ đệm, và có bao giờ xoá gì không? Sau khi sửa, một người dùng <em>đang có</em> worker cũ cần tải lại mấy lần?</p></details>

<h3>Nộp gì</h3>
<ul>
<li>Với mỗi ticket, một nhật ký gỡ lỗi theo mẫu bài 1.5, dòng "bằng chứng" nêu tên tab DevTools và trích đúng điều bạn thấy.</li>
<li>Một diff (gồm mọi bản sửa), và năm bộ bước của ticket chạy lại trên bản đã sửa (quay màn hình ngắn hoặc danh sách Network là được).</li>
<li>Riêng BUG-505: một ghi chú "người dùng đã có worker cũ thì sao", có đo, không đoán.</li>
<li>Tuỳ chọn: chạy bộ kiểm tự động <code>node tools/lab5.mjs 41521</code> (cần <code>npm i playwright-core</code> và Chrome) trên bản đã sửa — output phải khớp phần "bản sửa" bên dưới.</li>
</ul>
<details><summary>tools/lab5.mjs + tools/mo.mjs — bộ kiểm tự động chúng tôi đã dùng</summary>${ma(L_KIEM)}${ma(MO)}</details>

<h3>Rubric (100 điểm)</h3>
<ul>
<li>Bằng chứng trước mã, đủ cả năm (5 × 8 = 40): nêu tên tab, trích quan sát, nói nguyên nhân trong một câu.</li>
<li>Sửa đúng và nhỏ nhất (5 × 6 = 30): gỡ nguyên nhân chứ không giấu triệu chứng (ví dụ tắt hẳn service worker, hay thêm <code>setTimeout</code> để "chờ cookie", được 0 điểm cho ticket đó).</li>
<li>Kiểm lại (15): chạy lại bước của mọi ticket sau lần sửa cuối; đo đường nâng cấp của BUG-505.</li>
<li>Chất lượng bài viết (15): người duyệt chưa từng thấy mã vẫn hiểu từng nguyên nhân qua nhật ký của bạn.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li>"Người dùng nói API của mình lỗi CORS. Em nhìn ở đâu, và chứng minh thế nào là server không hề sập?"</li>
<li>"Đăng nhập trả 200 mà người dùng vẫn chưa đăng nhập. Kể ba thuộc tính cookie có thể gây ra, và xem mỗi cái ở đâu trong DevTools."</li>
<li>"Site khác origin thế nào? Cho một ví dụ mà sự khác nhau đó quan trọng."</li>
<li>"Vì sao một component React có thể hiện dữ liệu của prop cũ? Em nhìn thấy nó thế nào, và sửa ra sao?"</li>
<li>"Sau khi deploy, vài người dùng vẫn thấy bản cũ. Kể các tầng cache giữa server và màn hình của họ, và cách kiểm từng tầng."</li>
</ol>
<details><summary>Dàn ý trả lời</summary>
<p>1. Network: dòng preflight và "CORS error" ở request bị chặn; dòng Console; so header Origin/Allow-*; log server thấy request (hoặc chỉ thấy OPTIONS); curl tái hiện. CORS do trình duyệt thực thi. 2. SameSite (⚠ SameSiteLax trên Set-Cookie hoặc trên request), Secure (SameSiteNoneInsecure / không gửi qua http), Domain/Path (NotOnPath, không gửi) — Network › Cookies kèm cookie bị lọc, Application › Cookies. 3. Origin = scheme+host+cổng; site = scheme+eTLD+1; localhost:41521 → 127.0.0.1:41522 là cross-site; app.x.com → api.x.com khác origin nhưng cùng site. 4. State chép từ props, hoặc closure bị giữ trong effect/interval với dependency cũ; React DevTools so props với hooks, breakpoint + Scope; sửa dependency / tính từ props / dọn trong cleanup. 5. HTTP cache của trình duyệt, bộ đệm service worker, CDN/proxy, chính bản build (bundle cũ), cache tầng API; Disable cache, cột Size "(ServiceWorker)/(disk cache)", tab Application, header response (Age, cf-cache-status), endpoint phiên bản.</p></details>

<h3>🛠 Mốc dự án</h3>
<p>Thêm vào dự án của khoá (LabFlow mà bạn gỡ lỗi suốt khoá này) một mục <code>DEBUGGING.md</code> "Front-end": cách mở ứng dụng bằng hồ sơ sạch, các thiết lập DevTools cả nhóm dùng (Preserve log, Disable cache, Ignore list <code>/node_modules/</code>), cách xuất HAR đã che, và cách gỡ đăng ký service worker. Dự án cuối khoá (chương 12) có một lỗi CORS và một lỗi cache cũ — danh sách này sẽ cứu bạn ở đó.</p>

<h3>Đáp án (chỉ xem sau khi đã viết câu trả lời của mình)</h3>
<details><summary>Lần chạy thật của chúng tôi trên bản lỗi (Chrome 150, CDP)</summary>${OUT_LOI}
<ul>
<li><strong>BUG-501:</strong> preflight trả 204 nhưng <code>Access-Control-Allow-Headers: Content-Type</code> không có <code>x-lop</code> ⇒ <code>HeaderDisallowedByPreflightResponse</code>. Sửa ở dịch vụ báo cáo: <code>'Content-Type, X-Lop'</code>.</li>
<li><strong>BUG-502:</strong> cookie được lưu với <code>Path=/api/auth</code>; <code>/api/toi</code> nằm ngoài đường dẫn đó ⇒ không được gửi (<code>NotOnPath</code>, thấy ở các request sau). Sửa: <code>Path=/</code>.</li>
<li><strong>BUG-503:</strong> hai POST: một từ <code>onKeyDown</code> (App.jsx:35) gọi <code>luu()</code>, một từ <code>onSubmit</code> của form (gửi ngầm định: Enter trong ô nhập duy nhất sẽ gửi form). Sửa: bỏ <code>onKeyDown</code>.</li>
<li><strong>BUG-504:</strong> initiator của request sai là App.jsx:11, interval do một effect với <code>[]</code> tạo ra: closure của nó giữ <code>phong = 401</code> mãi mãi. Sửa: một effect với <code>[phong]</code>, xoá interval trong cleanup, bỏ qua câu trả lời đến muộn.</li>
<li><strong>BUG-505:</strong> <code>/api/toi → 401 (from service worker)</code>: worker trả mọi GET từ bộ đệm "labflow" trước, kể cả lời gọi API, và không bao giờ xoá gì. Sửa: không bao giờ cache <code>/api/</code>, tệp tĩnh thì mạng trước, bộ đệm có phiên bản và được xoá khi activate.</li>
</ul></details>
<details><summary>Bản sửa (diff) và lần chạy trên bản đã sửa</summary>${ma(L_DIFF, 'diff')}${OUT_SUA}</details>
<details><summary>BUG-505: người dùng đã có worker cũ</summary>${OUT_NANGCAP}
<p>Lần tải đầu tiên sau deploy vẫn do worker cũ trả lời; worker mới cài đặt, kích hoạt (nó gọi <code>skipWaiting</code> + <code>clients.claim</code>) và xoá bộ đệm cũ, nên lần tải thứ hai sạch. Dặn đội hỗ trợ: "khách còn thấy bản cũ thì tải lại thêm một lần; chưa được thì Clear site data".</p></details>
${NGUON}
</div>
`,
};
