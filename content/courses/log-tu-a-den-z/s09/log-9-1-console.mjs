/**
 * 9.1 — DevTools Console đọc như một tệp log (soạn 24/11/2026, agent lgz).
 * Output thật: OUT['s09/console'] — Google Chrome 150 headless mở trang Lab 9 qua Playwright + CDP (Runtime.consoleAPICalled,
 * Runtime.exceptionThrown, Log.entryAdded: đúng các sự kiện bảng Console của DevTools nhận); app nén bằng esbuild 0.28 + source map.
 * Mã lab: _demo/s09/lab/ (server.mjs, src/app.js, src/bat-loi.js), công cụ: _demo/s09/cong-cu/ (mo.mjs, console.mjs).
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '9.1 — DevTools Console as a log: levels, sources, filters, stack traces, source maps, CORS/CSP errors|||9.1 — DevTools Console đọc như một tệp log: mức, nguồn, bộ lọc, stack trace, source map, lỗi CORS/CSP',
  slug: 'log-9-1-console',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bảng Console là tệp log của trang web trên máy người dùng — máy chủ không bao giờ thấy nó. Dựng Lab 9 (shop + API + bộ thu lỗi), mở bằng Chrome thật và đọc từng dòng: bốn mức Verbose/Info/Warning/Error, dòng do mã của bạn ghi với dòng do chính trình duyệt ghi (network, security, javascript), bộ lọc chữ/regex/url:/-url:, đọc dòng đỏ, stack trace nén và source map, lỗi CSP, lỗi CORS che một lỗi 500 thật, Uncaught (in promise). Góc hacker: source map để công khai làm lộ cả mã nguồn (App Store web của Apple, 11/2025).',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>The Console is the page's own log file — and only the user has it</h2>
<p class="lead">Everything in Chapters 7–8 and 10 lives on a server you control. The Console lives in the user's browser: when a button "does nothing", the server log is silent, and the only evidence is a red line on someone else's screen. This lesson treats the Console as a log file: who writes each line, how to filter it, how to read a stack trace from minified code, and which errors the browser writes on its own. Using the Console as a REPL and pausing on exceptions is taught in the debugging course — here we read.</p>

<h3>The everyday picture: the bus driver's notebook</h3>
<p>The bus company's head office keeps records of tickets and routes (the server log). But the notes "the door jammed at stop 4", "the air-con failed" are written in the driver's notebook, inside the bus. If no one asks the driver, head office never knows. The Console is that notebook: it stays inside one browser tab, and it is wiped when the bus changes route (page navigation) unless you ask to keep it (<em>Preserve log</em>).</p>

<h3>Set up Lab 9 (used in all of Chapter 9)</h3>
<p>Lab 9 is a small shop on two origins — the page on <code>shop.lgz.test:41901</code>, the API on <code>api.lgz.test:41902</code> — with real bugs planted: an expired token, a route that crashes, a slow report service behind a gateway with a 2-second timeout, a missing image, an inline script blocked by CSP. You need Node 22, Google Chrome, <code>jq</code>, <code>curl</code>, <code>openssl</code>.</p>
${ma('bash', 's09/lab/dung.bash')}
<pre><code class="language-bash">mkdir lab9 && cd lab9
npm i playwright-core esbuild          # driver for your installed Chrome + the bundler
bash /path/to/_demo/s09/lab/dung.bash   # copy, build app.min.js + source map, make a self-signed cert
cp /path/to/_demo/s09/cong-cu/* .
node server.mjs &                        # 41901 shop · 41902 api · 41903 https · 41904 report-svc</code></pre>
<p>In your own Chrome, add the two names to your hosts file (<code>127.0.0.1 shop.lgz.test api.lgz.test</code>) and open <code>http://shop.lgz.test:41901/?kb=me,warn</code>, then <kbd>F12</kbd> → Console. In this course the output comes from <code>console.mjs</code>, which opens the same Chrome headless and prints exactly the events the Console panel receives over the DevTools protocol (CDP). The format is ours; the content is Chrome's.</p>

<h3>Step 1 — levels, and who wrote each line</h3>
${lenh('s09/console', 0)}
<ul>
<li><strong>Four levels.</strong> DevTools sorts every message into <strong>Verbose, Info, Warning, Error</strong>. <code>console.log</code> and <code>console.info</code> are Info, <code>console.debug</code> is <strong>Verbose — hidden by default</strong> ("Default levels" = Info + Warning + Error). A colleague's "I log it with console.debug and it never shows" is that.</li>
<li><strong>Two authors.</strong> Lines with a location like <code>app.js:27</code> were written by <em>your code</em>. Lines tagged <code>(network)</code>, <code>(security)</code>, <code>(javascript)</code> were written by <strong>the browser itself</strong>: "Failed to load resource … 404" is Chrome reporting that <code>logo-moi.png</code> does not exist; no line of your JavaScript said that. When you read a Console, first split the two authors.</li>
<li><strong>Order is time, not importance.</strong> The 404 and CSP lines come first because the HTML parser hit the image and the inline script before <code>app.min.js</code> ran.</li>
</ul>
<p>Filters you will use daily: plain text (<code>[api]</code>), a regex between slashes (<code>/40[13]/</code>), a minus to hide (<code>-[boot]</code>), <code>url:</code> to keep messages from one script or domain, <code>-url:</code> to hide a noisy extension or chat widget. Settings worth knowing: <em>Hide network</em>, <em>Preserve log</em>, <em>Selected context only</em> (iframes), <em>Group similar messages</em>, <em>Log XMLHttpRequests</em>. Right-click → <strong>Save as…</strong> writes every message to a plain <code>.log</code> file — that is what you ask a tester to send, not a cropped screenshot.</p>

<h3>Step 2 — reading a red line: minified code vs source map</h3>
<p>Click "Thanh toán" (pay). With source maps disabled, this is what you get:</p>
${lenh('s09/console', 1)}
<p>Every frame is <code>app.min.js:1</code> — the whole app is one line, and <code>m</code>, <code>d</code> are names the minifier invented. Column numbers (<code>:939</code>, <code>:1041</code>) are the only clue. Now the same click with the source map that esbuild produced:</p>
${lenh('s09/console', 2)}
<p>Read it the way you read the Node stack in 10.4: message first (<code>Cannot read properties of undefined (reading 'items')</code> — something was <code>undefined</code> and we asked for <code>.items</code>), then the first frame in your file: <code>app.js:8</code> inside <code>tongTien</code>, called from <code>app.js:13</code> in <code>thanhToan</code>, called from the click handler at <code>app.js:45</code>. Line 13 passes <code>gio.chiTiet</code>, which does not exist. (Real DevTools also maps function names back; our printer keeps the minified names so you see what the map changes.)</p>
${lenh('s09/console', 6)}
${lenh('s09/console', 7)}
<p>A source map (version 3) is a JSON file: <code>sources</code> = original files, <code>names</code> = original identifiers, <code>mappings</code> = an encoded table "column X of the minified line ↔ file:line:column of the source", and optionally <code>sourcesContent</code> = <strong>the full original source code</strong>. The last line of <code>app.min.js</code> says <code>//# sourceMappingURL=app.min.js.map</code>; DevTools downloads it when you open DevTools.</p>

<h3>Step 3 — errors the browser writes for you: CSP and CORS</h3>
<p><strong>CSP</strong> (from Step 1): <em>Executing inline script violates the following Content Security Policy directive 'script-src 'self' 'nonce-lab9''… The action has been blocked.</em> Read it in three parts: the action (inline script), the rule that blocked it (<code>script-src</code> of the header our server sends), and the ways out (a hash, a nonce — or <code>'unsafe-inline'</code>, which would switch the protection off). The chat widget is not "broken"; the policy is doing its job, and the fix is to give that script a nonce/hash, not to weaken CSP. Lesson 9.5 collects these violations on the server.</p>
<p><strong>CORS</strong> — run the scenario with the orders call:</p>
${lenh('s09/console', 3)}
<p>The Console says <em>blocked by CORS policy: No 'Access-Control-Allow-Origin' header</em>, then <code>net::ERR_FAILED</code>, and our code only sees <code>Failed to fetch</code>. Many juniors now spend an hour adding CORS settings. Look at the server instead:</p>
${lenh('s09/console', 4)}
${lenh('s09/console', 5)}
<div class="pitfall co-tieu-de"><p><strong>A CORS error is often a 500 in disguise.</strong> The API crashed (<code>TypeError … 'userId'</code>), and its error path did not add the CORS headers, so the browser hid the 500 from the page. The access log says 500; the app log has the cause; the request id <code>b4f0f52c…</code> joins them. Rule: when the Console says CORS on a request that <em>usually works</em>, read the server log for that request before touching CORS config. A missing preflight, wrong origin or forbidden header are the other cases — the debugging course walks through them.</p></div>
<p>In the same run: <code>504 (Gateway Timeout)</code> on <code>/api/report</code> (Lesson 9.2 measures it), and <strong><code>Uncaught (in promise) TypeError: Cannot read properties of null (reading 'ma')</code></strong> — <code>/api/coupon</code> returned 404, our helper returned <code>null</code>, and <code>.then((c) =&gt; c.ma…)</code> was chained without a <code>.catch</code>. In a browser an unhandled rejection does not kill the page as it kills Node (10.4), so these pile up silently — unless you collect them (9.5).</p>
<p>Other browser-written lines you will meet: <strong>Mixed Content</strong> (an <code>https</code> page loading an <code>http</code> script/image — blocked or upgraded), <strong>deprecation</strong> and <strong>intervention</strong> warnings (Chrome changed or blocked a behaviour), and <code>net::ERR_…</code> codes (Lesson 9.4 reads them at the network level).</p>

<h3>Step 4 — when the Console is empty: Preserve log</h3>
<p>The Console is cleared on every navigation. Login forms that redirect, payment pages that bounce to a bank and back, "the error flashes then disappears" — tick <strong>Preserve log</strong> (Console and Network each have their own) before reproducing. The debugging course has a full demo of this.</p>

<h3>Hacker's corner: your source map is your source code</h3>
${lenh('s09/console', 8)}
<p>Our server hands <code>app.min.js.map</code> to anyone: 8 kB of JSON containing <code>sourcesContent</code> — every comment, every function name, every "TODO remove before prod". On <strong>4 November 2025</strong> Apple launched its new App Store website with source maps left enabled; within hours a developer rebuilt the entire front-end source from them in Chrome DevTools and published it on GitHub, until takedown notices removed the repository and thousands of forks (9to5Mac, 5/11/2025). No customer data leaked — but internal API routes, feature flags and comments became public reading, which is exactly the map an attacker draws before probing an API. Prevention you can do on your own project:</p>
<ul>
<li>Build "hidden" source maps (no <code>sourceMappingURL</code> comment) and upload them only to your error tracker, or do not deploy <code>*.map</code> at all; check with <code>curl -I https://your.site/assets/x.js.map</code> after each deploy.</li>
<li>Never put secrets in front-end code at all — minified or not, anything shipped to a browser is public. API keys there must be public-by-design keys with limits.</li>
<li>Do not <code>console.log</code> tokens, user objects or API responses in production builds: anyone on the same computer, any browser extension and any screen-share sees the Console. Our app logs <code>coToken: true</code>, not the token.</li>
</ul>

<h3>Real-life situations</h3>
<ul>
<li><strong>"I click Pay and nothing happens."</strong> No request in Network, nothing in the server log. Console → one <code>Uncaught TypeError</code> per click, in the click handler. Five seconds, if you ask for the Console.</li>
<li><strong>Tester sends a screenshot of the Console with the top cut off.</strong> Ask for right-click → Save as…, with Preserve log on and Verbose shown; the first error is usually the cause and the rest are consequences.</li>
<li><strong>At an outsourcing company</strong> the customer's QA reports "page white on Safari only" from abroad. You cannot open their machine; you send them a short guide (open Console, Save as, plus a HAR from 9.3, sanitised). Writing that guide well is a real skill — Lab 9 makes you do it.</li>
<li><strong>What if</strong> the Console is full of red from extensions (password managers, ad blockers)? Use <code>-url:chrome-extension://</code> or an Incognito window without extensions before concluding anything.</li>
</ul>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok"><ol>
<li>Open <code>?kb=me,warn</code> in your Chrome. Make the <code>[boot] cấu hình</code> line appear, then hide every line written by the browser itself.</li>
<li>Write one filter that keeps only lines from our code that contain an HTTP status code.</li>
<li>In DevTools Settings → Preferences → Sources, untick "JavaScript source maps", click Pay, and copy the stack. Turn it back on and copy again. Which line of <code>src/app.js</code> must change?</li>
<li>Open <code>?kb=orders</code>. Without looking at this page, prove from <code>logs/api.log</code> + <code>logs/app.log</code> that the CORS error is a 500.</li>
<li>Run <code>curl -s http://127.0.0.1:41901/app.min.js.map | jq -r '.sourcesContent[1]' | head</code>. What could an attacker learn about the API from it?</li>
</ol>
<p><strong>Done when:</strong> 1 uses the Verbose level and <em>Hide network</em> (or <code>-url:</code>/regex); 2 is a regex like <code>/→ [0-9]{3}/</code>; 3 names line 13 (<code>gio.chiTiet</code>); 4 shows the same request id in both server logs; 5 lists at least the API base URL and the route names.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Verbose / Info / Warning / Error', 'The four Console levels; Verbose (console.debug) is hidden by default.'],
  ['browser-written message', 'A line logged by Chrome itself (network, security, javascript…), not by your code.'],
  ['source map', 'JSON mapping minified positions back to original file:line; may embed the full source (sourcesContent).'],
  ['CSP violation', 'The browser blocked something the Content-Security-Policy header did not allow.'],
  ['CORS error', 'The browser hid a cross-origin response from the page because the allow headers were missing — the request may still have reached the server.'],
  ['Uncaught (in promise)', 'A rejected promise nobody caught; does not stop the page, so it is easy to miss.'],
  ['Preserve log', 'Keep Console/Network entries across navigations.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>The Console is a client-side log the server never sees — ask for it, as a saved text file.</li>
<li>Split authors: lines with <code>file:line</code> are your code; <code>(network)/(security)/(javascript)</code> are the browser.</li>
<li>Verbose is hidden by default; filter with text, <code>/regex/</code>, <code>-</code>, <code>url:</code>, <code>-url:</code>.</li>
<li>Minified stack → source map → message, then first frame in your file.</li>
<li>CSP lines tell you the rule and the fix; a CORS error on a normally-working call is often a server 500 — read the server log by request id.</li>
<li>Source maps on production servers publish your source code.</li>
</ul>
${nguon('📘', 'Chrome DevTools — Console features reference', 'Levels, filters (url:, -url:), Preserve log, Save as…', 'https://developer.chrome.com/docs/devtools/console/reference')}
${nguon('📰', '9to5Mac — Web App Store front-end source code ends up on GitHub (4/11/2025)', 'Source maps left enabled on the new apps.apple.com', 'https://9to5mac.com/2025/11/04/web-app-store-front-end-source-code-github/')}
${lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-5-1-console', title: 'Debugging 5.1 — Console beyond console.log', sub: 'REPL, $0, Preserve log, pause on exceptions', cta: 'Open' })}
${lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-2-3-javascript', title: 'Debugging 2.3 — JavaScript and Node traces', sub: 'Async stack traces, source maps in depth', cta: 'Open' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>Console là tệp log riêng của trang web — và chỉ người dùng có nó</h2>
<p class="lead">Mọi thứ ở Chương 7–8 và 10 nằm trên máy chủ bạn quản lý. Console thì nằm trong trình duyệt của người dùng: khi một nút "bấm không ăn", log máy chủ im lặng, và bằng chứng duy nhất là một dòng đỏ trên màn hình của người khác. Bài này coi Console là một tệp log: ai viết từng dòng, lọc thế nào, đọc stack trace của mã đã nén ra sao, và những lỗi nào trình duyệt tự ghi. Dùng Console làm REPL và dừng ở ngoại lệ đã dạy trong khoá gỡ lỗi — ở đây ta ĐỌC.</p>

<h3>Liên tưởng đời thường: cuốn sổ của tài xế xe buýt</h3>
<p>Văn phòng công ty xe buýt giữ sổ vé và lộ trình (log máy chủ). Nhưng ghi chú "cửa kẹt ở trạm 4", "điều hoà hỏng" lại nằm trong cuốn sổ của tài xế, ở trên xe. Không ai hỏi tài xế thì văn phòng không bao giờ biết. Console là cuốn sổ đó: nó ở trong một tab trình duyệt, và bị xoá khi xe đổi tuyến (trang chuyển hướng) — trừ khi bạn dặn giữ lại (<em>Preserve log</em>).</p>

<h3>Dựng Lab 9 (dùng cho cả Chương 9)</h3>
<p>Lab 9 là một cửa hàng nhỏ trên hai origin — trang ở <code>shop.lgz.test:41901</code>, API ở <code>api.lgz.test:41902</code> — cài sẵn lỗi thật: token hết hạn, một route bị sập, dịch vụ báo cáo chậm nằm sau một cổng có timeout 2 giây, một ảnh không tồn tại, một script nội tuyến bị CSP chặn. Cần Node 22, Google Chrome, <code>jq</code>, <code>curl</code>, <code>openssl</code>.</p>
${ma('bash', 's09/lab/dung.bash')}
<pre><code class="language-bash">mkdir lab9 && cd lab9
npm i playwright-core esbuild          # bộ điều khiển Chrome đã cài + công cụ đóng gói
bash /đường/tới/_demo/s09/lab/dung.bash # chép, build app.min.js + source map, tạo chứng chỉ tự ký
cp /đường/tới/_demo/s09/cong-cu/* .
node server.mjs &                        # 41901 shop · 41902 api · 41903 https · 41904 report-svc</code></pre>
<p>Trên Chrome của bạn, thêm hai tên vào tệp hosts (<code>127.0.0.1 shop.lgz.test api.lgz.test</code>), mở <code>http://shop.lgz.test:41901/?kb=me,warn</code>, rồi <kbd>F12</kbd> → Console. Trong khoá này output lấy từ <code>console.mjs</code>: nó mở chính Chrome đó ở chế độ headless và in đúng những sự kiện bảng Console nhận qua giao thức DevTools (CDP). Cách trình bày là của ta; nội dung là của Chrome.</p>

<h3>Bước 1 — các mức, và ai đã viết từng dòng</h3>
${lenh('s09/console', 0)}
<ul>
<li><strong>Bốn mức.</strong> DevTools xếp mọi thông điệp vào <strong>Verbose, Info, Warning, Error</strong>. <code>console.log</code> và <code>console.info</code> là Info, <code>console.debug</code> là <strong>Verbose — mặc định bị ẩn</strong> ("Default levels" = Info + Warning + Error). Câu than của đồng nghiệp "mình log bằng console.debug mà chẳng thấy gì" chính là vì thế.</li>
<li><strong>Hai tác giả.</strong> Dòng có vị trí kiểu <code>app.js:27</code> là do <em>mã của bạn</em> viết. Dòng gắn <code>(network)</code>, <code>(security)</code>, <code>(javascript)</code> là do <strong>chính trình duyệt</strong> viết: "Failed to load resource … 404" là Chrome báo <code>logo-moi.png</code> không tồn tại; không dòng JavaScript nào của bạn nói câu đó. Đọc Console, việc đầu tiên là tách hai tác giả này.</li>
<li><strong>Thứ tự là thời gian, không phải mức quan trọng.</strong> Dòng 404 và dòng CSP đứng đầu vì bộ phân tích HTML gặp ảnh và script nội tuyến trước khi <code>app.min.js</code> chạy.</li>
</ul>
<p>Bộ lọc dùng hằng ngày: chữ thường (<code>[api]</code>), regex trong hai dấu gạch chéo (<code>/40[13]/</code>), dấu trừ để ẩn (<code>-[boot]</code>), <code>url:</code> để chỉ giữ thông điệp từ một script hay tên miền, <code>-url:</code> để ẩn một extension hay widget chat ồn ào. Thiết lập nên biết: <em>Hide network</em>, <em>Preserve log</em>, <em>Selected context only</em> (iframe), <em>Group similar messages</em>, <em>Log XMLHttpRequests</em>. Chuột phải → <strong>Save as…</strong> ghi mọi thông điệp ra một tệp <code>.log</code> văn bản — đó là thứ bạn xin tester gửi, chứ không phải ảnh chụp bị cắt.</p>

<h3>Bước 2 — đọc một dòng đỏ: mã nén và source map</h3>
<p>Bấm "Thanh toán". Khi tắt source map, bạn nhận được:</p>
${lenh('s09/console', 1)}
<p>Khung nào cũng là <code>app.min.js:1</code> — cả ứng dụng nằm trên một dòng, còn <code>m</code>, <code>d</code> là tên do công cụ nén tự đặt. Số cột (<code>:939</code>, <code>:1041</code>) là manh mối duy nhất. Giờ cùng cú bấm đó, có source map do esbuild sinh ra:</p>
${lenh('s09/console', 2)}
<p>Đọc như đọc stack Node ở bài 10.4: thông điệp trước (<code>Cannot read properties of undefined (reading 'items')</code> — có thứ đang là <code>undefined</code> mà ta lại hỏi <code>.items</code>), rồi khung đầu tiên trong tệp của bạn: <code>app.js:8</code> trong <code>tongTien</code>, được gọi từ <code>app.js:13</code> trong <code>thanhToan</code>, được gọi từ hàm xử lý cú bấm ở <code>app.js:45</code>. Dòng 13 truyền <code>gio.chiTiet</code> — thuộc tính không tồn tại. (DevTools thật còn dịch ngược cả tên hàm; bộ in của ta giữ tên đã nén để bạn thấy source map đổi những gì.)</p>
${lenh('s09/console', 6)}
${lenh('s09/console', 7)}
<p>Source map (phiên bản 3) là một tệp JSON: <code>sources</code> = các tệp gốc, <code>names</code> = các tên gốc, <code>mappings</code> = một bảng mã hoá "cột X của dòng đã nén ↔ tệp:dòng:cột trong mã gốc", và có thể có <code>sourcesContent</code> = <strong>toàn bộ mã nguồn gốc</strong>. Dòng cuối của <code>app.min.js</code> ghi <code>//# sourceMappingURL=app.min.js.map</code>; DevTools tải tệp này khi bạn mở DevTools.</p>

<h3>Bước 3 — những lỗi trình duyệt tự ghi giúp bạn: CSP và CORS</h3>
<p><strong>CSP</strong> (từ Bước 1): <em>Executing inline script violates the following Content Security Policy directive 'script-src 'self' 'nonce-lab9''… The action has been blocked.</em> Đọc thành ba phần: hành động (script nội tuyến), quy tắc đã chặn (<code>script-src</code> trong header máy chủ ta gửi), và lối ra (một hash, một nonce — hoặc <code>'unsafe-inline'</code>, tức là tắt luôn lớp bảo vệ). Widget chat không "hỏng"; chính sách đang làm đúng việc, và cách sửa là cấp nonce/hash cho script đó, không phải nới CSP. Bài 9.5 thu các vi phạm này về máy chủ.</p>
<p><strong>CORS</strong> — chạy kịch bản có lời gọi đơn hàng:</p>
${lenh('s09/console', 3)}
<p>Console báo <em>blocked by CORS policy: No 'Access-Control-Allow-Origin' header</em>, rồi <code>net::ERR_FAILED</code>, và mã của ta chỉ thấy <code>Failed to fetch</code>. Nhiều bạn mới đi làm sẽ mất một giờ thêm cấu hình CORS. Hãy nhìn sang máy chủ:</p>
${lenh('s09/console', 4)}
${lenh('s09/console', 5)}
<div class="pitfall co-tieu-de"><p><strong>Lỗi CORS thường là một lỗi 500 đội lốt.</strong> API bị sập (<code>TypeError … 'userId'</code>), nhánh xử lý lỗi quên gắn header CORS, nên trình duyệt giấu lỗi 500 khỏi trang. Access log ghi 500; log ứng dụng có nguyên nhân; request id <code>b4f0f52c…</code> nối hai bên. Quy tắc: khi Console báo CORS ở một request <em>bình thường vẫn chạy</em>, hãy đọc log máy chủ của request đó trước khi động vào cấu hình CORS. Thiếu preflight, sai origin, header bị cấm là các trường hợp khác — khoá gỡ lỗi đi qua từng cái.</p></div>
<p>Cùng lượt chạy: <code>504 (Gateway Timeout)</code> ở <code>/api/report</code> (bài 9.2 đo nó), và <strong><code>Uncaught (in promise) TypeError: Cannot read properties of null (reading 'ma')</code></strong> — <code>/api/coupon</code> trả 404, hàm phụ của ta trả <code>null</code>, và <code>.then((c) =&gt; c.ma…)</code> được nối mà không có <code>.catch</code>. Trong trình duyệt, Promise bị từ chối không làm chết cả trang như nó làm chết Node (10.4), nên chúng chồng chất trong im lặng — trừ khi bạn thu chúng về (9.5).</p>
<p>Các dòng trình duyệt tự ghi khác bạn sẽ gặp: <strong>Mixed Content</strong> (trang <code>https</code> tải script/ảnh qua <code>http</code> — bị chặn hoặc bị nâng lên https), cảnh báo <strong>deprecation</strong> và <strong>intervention</strong> (Chrome đã đổi hoặc chặn một hành vi), và các mã <code>net::ERR_…</code> (bài 9.4 đọc chúng ở tầng mạng).</p>

<h3>Bước 4 — khi Console trống trơn: Preserve log</h3>
<p>Console bị xoá ở mỗi lần chuyển trang. Form đăng nhập có chuyển hướng, trang thanh toán nhảy sang ngân hàng rồi quay lại, "lỗi hiện lên rồi biến mất" — tích <strong>Preserve log</strong> (Console và Network mỗi bên có một ô riêng) trước khi tái hiện. Khoá gỡ lỗi có demo đầy đủ phần này.</p>

<h3>Góc hacker: source map của bạn chính là mã nguồn của bạn</h3>
${lenh('s09/console', 8)}
<p>Máy chủ của ta đưa <code>app.min.js.map</code> cho bất kỳ ai: 8 kB JSON có <code>sourcesContent</code> — mọi chú thích, mọi tên hàm, mọi dòng "TODO xoá trước khi lên prod". Ngày <strong>4/11/2025</strong> Apple ra mắt trang App Store trên web mới mà quên tắt source map; chỉ vài giờ sau, một lập trình viên dùng Chrome DevTools dựng lại toàn bộ mã nguồn giao diện từ chúng và đăng lên GitHub, tới khi yêu cầu gỡ bỏ xoá kho đó cùng hàng nghìn bản fork (9to5Mac, 5/11/2025). Không có dữ liệu khách hàng nào bị lộ — nhưng các route API nội bộ, cờ tính năng và chú thích thành tài liệu công khai, đúng tấm bản đồ kẻ tấn công vẽ trước khi dò một API. Cách phòng bạn tự làm được trên dự án của mình:</p>
<ul>
<li>Build source map "ẩn" (không có chú thích <code>sourceMappingURL</code>) và chỉ tải chúng lên công cụ theo dõi lỗi, hoặc đừng deploy tệp <code>*.map</code>; sau mỗi lần deploy kiểm bằng <code>curl -I https://trang.cua.ban/assets/x.js.map</code>.</li>
<li>Không bao giờ đặt bí mật trong mã giao diện — nén hay không, thứ gì đã gửi xuống trình duyệt đều là công khai. Khoá API ở đó phải là loại thiết kế để công khai, có giới hạn.</li>
<li>Đừng <code>console.log</code> token, đối tượng người dùng hay phản hồi API trong bản production: ai ngồi cùng máy, extension nào, buổi chia sẻ màn hình nào cũng thấy Console. Ứng dụng của ta chỉ log <code>coToken: true</code>, không log token.</li>
</ul>

<h3>Tình huống đời thật</h3>
<ul>
<li><strong>"Em bấm Thanh toán mà không có gì xảy ra."</strong> Network không có request nào, log máy chủ trống. Console → mỗi cú bấm một dòng <code>Uncaught TypeError</code> trong hàm xử lý cú bấm. Năm giây, nếu bạn biết xin Console.</li>
<li><strong>Tester gửi ảnh chụp Console bị cắt mất phần đầu.</strong> Xin họ chuột phải → Save as…, bật Preserve log và hiện mức Verbose; lỗi đầu tiên thường là nguyên nhân, các lỗi sau là hậu quả.</li>
<li><strong>Ở công ty outsourcing</strong>, QA của khách hàng nước ngoài báo "trang trắng, chỉ trên Safari". Bạn không mở được máy họ; bạn gửi một hướng dẫn ngắn (mở Console, Save as, kèm tệp HAR ở bài 9.3, đã làm sạch). Viết hướng dẫn đó cho tốt là một kỹ năng thật — Lab 9 bắt bạn làm.</li>
<li><strong>Nếu</strong> Console đỏ rực vì các extension (trình quản lý mật khẩu, chặn quảng cáo) thì sao? Dùng <code>-url:chrome-extension://</code> hoặc cửa sổ ẩn danh không có extension trước khi kết luận gì.</li>
</ul>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
<li>Mở <code>?kb=me,warn</code> trên Chrome của bạn. Làm cho dòng <code>[boot] cấu hình</code> hiện ra, rồi ẩn mọi dòng do chính trình duyệt viết.</li>
<li>Viết một bộ lọc chỉ giữ những dòng do mã của ta ghi có chứa mã trạng thái HTTP.</li>
<li>Trong DevTools Settings → Preferences → Sources, bỏ tích "JavaScript source maps", bấm Thanh toán, chép stack. Bật lại rồi chép lần nữa. Dòng nào của <code>src/app.js</code> phải sửa?</li>
<li>Mở <code>?kb=orders</code>. Không nhìn trang này, chứng minh bằng <code>logs/api.log</code> + <code>logs/app.log</code> rằng lỗi CORS là một lỗi 500.</li>
<li>Chạy <code>curl -s http://127.0.0.1:41901/app.min.js.map | jq -r '.sourcesContent[1]' | head</code>. Kẻ tấn công học được gì về API từ đó?</li>
</ol>
<p><strong>Đạt khi:</strong> câu 1 dùng mức Verbose và <em>Hide network</em> (hoặc <code>-url:</code>/regex); câu 2 là một regex kiểu <code>/→ [0-9]{3}/</code>; câu 3 chỉ ra dòng 13 (<code>gio.chiTiet</code>); câu 4 cho thấy cùng một request id trong cả hai log máy chủ; câu 5 kể ra ít nhất địa chỉ gốc của API và tên các route.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Verbose / Info / Warning / Error', 'Bốn mức của Console; Verbose (console.debug) mặc định bị ẩn.'],
  ['thông điệp do trình duyệt ghi', 'Dòng do chính Chrome ghi (network, security, javascript…), không phải do mã của bạn.'],
  ['source map', 'Tệp JSON ánh xạ vị trí trong mã nén về tệp:dòng gốc; có thể nhúng cả mã nguồn (sourcesContent).'],
  ['vi phạm CSP', 'Trình duyệt chặn một thứ mà header Content-Security-Policy không cho phép.'],
  ['lỗi CORS', 'Trình duyệt giấu phản hồi khác origin khỏi trang vì thiếu header cho phép — request có thể vẫn đã tới máy chủ.'],
  ['Uncaught (in promise)', 'Promise bị từ chối mà không ai bắt; không làm dừng trang nên rất dễ bị bỏ qua.'],
  ['Preserve log', 'Giữ các dòng Console/Network qua các lần chuyển trang.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Console là log phía người dùng mà máy chủ không bao giờ thấy — hãy xin nó, dưới dạng tệp văn bản đã lưu.</li>
<li>Tách tác giả: dòng có <code>tệp:dòng</code> là mã của bạn; <code>(network)/(security)/(javascript)</code> là trình duyệt.</li>
<li>Verbose mặc định bị ẩn; lọc bằng chữ, <code>/regex/</code>, <code>-</code>, <code>url:</code>, <code>-url:</code>.</li>
<li>Stack đã nén → source map → thông điệp, rồi khung đầu tiên trong tệp của bạn.</li>
<li>Dòng CSP cho biết quy tắc và cách sửa; lỗi CORS ở một lời gọi vốn vẫn chạy thường là lỗi 500 của máy chủ — đọc log máy chủ theo request id.</li>
<li>Source map để trên máy chủ production là công bố mã nguồn của bạn.</li>
</ul>
${nguon('📘', 'Chrome DevTools — Console features reference', 'Các mức, bộ lọc (url:, -url:), Preserve log, Save as…', 'https://developer.chrome.com/docs/devtools/console/reference')}
${nguon('📰', '9to5Mac — Mã nguồn giao diện App Store web lên GitHub (4/11/2025)', 'Source map bị để bật trên apps.apple.com mới', 'https://9to5mac.com/2025/11/04/web-app-store-front-end-source-code-github/')}
${lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-5-1-console', title: 'Gỡ lỗi 5.1 — Console hơn cả console.log', sub: 'REPL, $0, Preserve log, dừng ở ngoại lệ', cta: 'Mở bài' })}
${lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-2-3-javascript', title: 'Gỡ lỗi 2.3 — Trace JavaScript và Node', sub: 'Stack trace bất đồng bộ, source map chuyên sâu', cta: 'Mở bài' })}
</div>
`,
};
