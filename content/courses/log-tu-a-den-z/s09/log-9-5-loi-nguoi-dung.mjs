/**
 * 9.5 — Thu lỗi phía giao diện từ người dùng thật (soạn 24/11/2026, agent lgz).
 * Output thật: OUT['s09/rum'] — Chrome 150 headless chạy trang Lab 9 với src/bat-loi.js (gửi bằng sendBeacon) → server.mjs ghi
 * logs/rum.log (giải mã vị trí bằng source map phía máy chủ) và logs/csp.log (report-uri). curl 8.18 cho phần thử lạm dụng.
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '9.5 — Collecting front-end errors from real users: error and unhandledrejection, resource errors, CSP reports|||9.5 — Thu lỗi phía giao diện từ người dùng thật: error và unhandledrejection, lỗi tải tài nguyên, báo cáo CSP',
  slug: 'log-9-5-loi-nguoi-dung',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lỗi chỉ người dùng thấy thì máy chủ không bao giờ biết — trừ khi trang tự gửi về. Viết một bộ thu lỗi nhỏ mà đủ: nghe error (cả lỗi tải tài nguyên) và unhandledrejection, khử trùng theo chữ ký, giới hạn 10 báo cáo mỗi trang, che email/token/JWT, gửi bằng sendBeacon; máy chủ giới hạn kích thước và dịch vị trí bằng source map giữ kín. Chạy thật: 50 lỗi giống nhau thành 3 báo cáo, stack đã dịch về src/app.js, báo cáo CSP đọc từng trường, và lỗi xảy ra trước khi bộ thu tải xong bị mất. Góc hacker: điểm thu lỗi là cửa công khai — báo cáo giả, và nghiên cứu Princeton 2017 về script ghi lại phiên chụp cả mật khẩu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.5</span>
<h2>Bringing the user's Console home: front-end error collection</h2>
<p class="lead">Lessons 9.1–9.4 assume someone opens DevTools for you. Real users do not: they see a blank page, close the tab and leave. The only way to know is to make the page report its own errors to a server you control. This lesson builds a small collector, runs it, and shows what it catches, what it misses and how it can be abused. Production tools (Sentry, OpenTelemetry for the browser) do the same with more features — the observability course covers them; knowing the mechanics lets you read their data and set them up safely.</p>

<h3>The everyday picture: the complaint box by the door</h3>
<p>A restaurant only hears about the cold soup if a customer drops a note in the box. A good box has a short form (no essays), refuses the same note fifty times, and does not ask for your ID card. A bad one is overflowing with spam. Our collector is the box; the rules below are the form.</p>

<h3>Step 1 — what the page listens to</h3>
${ma('js', 's09/lab/src/bat-loi.js')}
<ul>
<li><code>window.addEventListener('error', …, true)</code> — uncaught exceptions <strong>and</strong>, thanks to the capture flag <code>true</code>, failed resource loads (<code>&lt;img&gt;</code>, <code>&lt;script&gt;</code>), which do not bubble.</li>
<li><code>unhandledrejection</code> — the <code>Uncaught (in promise)</code> lines of 9.1.</li>
<li>De-duplicate by signature (type + message + file:line) and cap at 10 reports per page load — one broken loop must not send thousands of requests.</li>
<li><code>che()</code> masks JWTs, <code>?token=</code>-style parameters and email addresses <em>before</em> anything leaves the browser.</li>
<li><code>navigator.sendBeacon</code> — a small POST the browser delivers even if the page is closing (shows as type <code>ping</code> in Network, 9.2).</li>
</ul>
<p>The server side (in <code>server.mjs</code>): refuse bodies over 8 kB (413), parse JSON, translate <code>app.min.js:1:939</code> into <code>src/app.js:8</code> with the source map <strong>kept on the server</strong> (so you can stop publishing it, 9.1), write one JSON line per report to <code>logs/rum.log</code>. CSP violations go to a second endpoint, <code>/csp</code>, declared in the policy header: <code>script-src 'self' 'nonce-lab9'; report-uri /csp</code>.</p>

<h3>Step 2 — run it: a storm, a crash, a rejection, a secret</h3>
${lenh('s09/rum', 1)}
${lenh('s09/rum', 2)}
<p>The page threw <strong>50</strong> render errors (three different messages), one promise rejection, one click crash and one error containing an email and a token. The log has <strong>6</strong> lines: de-duplication turned 50 into 3. The rejection has <code>vitri: null</code> — rejections carry no file/line of their own; the location is in the stack.</p>
${lenh('s09/rum', 3)}
<p>The stack arrives minified and is translated on the server: <code>src/app.js:8:14</code> ← <code>:13:16</code> ← the click handler at <code>:45</code> — the same answer DevTools gave in 9.1, but now for every user, without asking anyone to open DevTools.</p>
${lenh('s09/rum', 4)}
<p>The original message was <em>không tải được hồ sơ sv.lab9@example.com (…/ho-so?token=eyJ…)</em>. What reached the server: <code>[EMAIL]</code> and <code>token=[CHE]</code>. Error messages often contain user input, URLs and IDs; masking on the client is the only place where it is guaranteed to happen before storage.</p>

<h3>Step 3 — reading a CSP report</h3>
${lenh('s09/rum', 5)}
<p>Five fields answer "what was blocked and where": <code>violated-directive</code> (<code>script-src-elem</code> — a <code>&lt;script&gt;</code> element), <code>blocked-uri</code> (<code>inline</code> — not a URL but inline code; for external files you see the URL, which reveals injected third-party scripts), <code>source-file</code> + <code>line-number</code> (line 9 of the page — the chat widget), and <code>disposition</code> (<code>enforce</code> = blocked; with the <code>Content-Security-Policy-Report-Only</code> header it would be <code>report</code> = only reported). The standard way to roll out a new CSP: ship it as Report-Only, read these reports for a week, fix or allow, then enforce. <code>report-uri</code> is the older mechanism; the newer one is <code>report-to</code> with a <code>Reporting-Endpoints</code> header, which batches reports (they arrive with a delay, as <code>application/reports+json</code>). The same Reporting API also delivers deprecation and intervention reports.</p>

<h3>Step 4 — what the collector misses</h3>
${lenh('s09/rum', 6)}
<div class="pitfall co-tieu-de"><p><strong>The broken logo never reached rum.log — 0 reports — but the web server logged the 404.</strong> The image failed while the HTML was still being parsed, <em>before</em> <code>app.min.js</code> had installed the listener. Every collector has a blind spot at page start. Fixes: put a tiny inline listener (with the nonce) at the top of <code>&lt;head&gt;</code> that buffers errors until the real one loads; and keep reading server logs — for static files the access log is the better witness.</p></div>
<p>Two more blind spots to know: errors thrown in a script from <strong>another origin</strong> arrive only as <code>"Script error."</code> with no details unless that script is loaded with <code>crossorigin</code> and served with CORS headers; and users with ad blockers or strict privacy settings may block your endpoint (pick a first-party path like <code>/rum</code>, not a tracker domain).</p>

<h3>Step 5 — the endpoint is public: abuse it yourself first</h3>
${lenh('s09/rum', 7)}
${lenh('s09/rum', 8)}
<p>The size cap works (413). But anyone can POST a fake report: our "error" says <em>Lỗi nghiêm trọng! Gọi ngay 0900 000 000…</em> ("Critical error! Call now…") and it is stored like the real ones — only <code>ua: null</code> gives it away. If a dashboard later shows these messages to support staff, it is a phishing channel; if it renders them as HTML, it is stored XSS into your admin panel; if it trusts the volume, a script can flood your log bill. Defend like any public input (Lesson 10.9): fixed schema and length per field, rate limit per IP/session, drop reports whose file is not your own bundle, display as text only, and alert on volume spikes.</p>

<h3>Hacker's corner: when telemetry records too much — session replay, 2017</h3>
<p>Some tools go further than error reports and record the whole session (clicks, keystrokes, page content) for "replay". In November 2017 researchers at Princeton (Freedom to Tinker, "No boundaries") studied seven such services found on <strong>482 of the top 50 000 websites</strong>, and showed recordings capturing data the sites never meant to share: medical details, credit-card data and <strong>passwords</strong> — the services masked <code>type="password"</code> fields, but mobile-friendly login boxes that store the password in a plain text input were recorded in clear. The lesson for any client-side collector, including the one you build: <strong>allow-list what you send</strong> (type, message, stack, page path, version) instead of block-listing what you hope to hide; never capture form values or page content by default; mask on the client; keep reports in your own storage with a retention limit (Chapter 16).</p>

<h3>Real-life situations</h3>
<ul>
<li><strong>After a release, error reports jump from 5 to 900 per hour</strong>, all one signature, all version 1.4.2. That is your rollback signal — before the first support call. (Alerting on log volume: Chapter 15.)</li>
<li><strong>Your team installs Sentry/OTel</strong>: check the settings for sending request bodies, cookies and user IP, the source-map upload (private) and the sample rate. The data you collect is now personal data you are responsible for.</li>
<li><strong>Outsourcing</strong>: a customer's contract may forbid sending any user data to third-party SaaS. A small self-hosted collector like this one, writing JSON lines into the logs you already ship (Chapter 15), is an accepted answer.</li>
<li><strong>What if</strong> you get "Script error." only? A third-party script (chat, analytics) is failing; load it with <code>crossorigin="anonymous"</code> if the vendor sends CORS headers, or ask the vendor.</li>
</ul>

<h3>🎤 Interviewers will ask</h3>
<ul>
<li><em>How do you know about JavaScript errors your users hit?</em> — Global <code>error</code> + <code>unhandledrejection</code> handlers that send small, de-duplicated, scrubbed reports (sendBeacon) to a collector or an error tracker; symbolicate with private source maps.</li>
<li><em>What is <code>Content-Security-Policy-Report-Only</code> for?</em> — Testing a policy: violations are reported, nothing is blocked.</li>
<li><em>Why might an error tracker show "Script error." without a stack?</em> — Cross-origin script without <code>crossorigin</code>/CORS; the browser hides the details.</li>
</ul>

<h3>🧪 Practice (35 min)</h3>
<div class="callout ok"><ol>
<li>Add a 6-line inline snippet (with <code>nonce="lab9"</code>) at the top of <code>index.html</code> that buffers <code>error</code> events until <code>bat-loi.js</code> loads, then flushes them. Prove that <code>logo-moi.png</code> now reaches rum.log.</li>
<li>Add a per-IP limit to <code>/rum</code> on the server (e.g. 30 reports/minute → 429). Show it with a curl loop.</li>
<li>Change the policy header to <code>Content-Security-Policy-Report-Only</code>. What changes in the Console, in csp.log, and for the chat widget?</li>
<li>Write a jq query over rum.log that prints the top error signatures with counts and the first time each was seen.</li>
</ol>
<p><strong>Done when:</strong> 1 shows a <code>ResourceError … logo-moi.png</code> line; 2 prints 204 then 429 in the loop; 3: the widget's <code>console.log</code> runs, the Console message says "[Report Only]", csp.log shows <code>"disposition": "report"</code>; 4 uses <code>group_by(.tin)</code> with <code>length</code> and <code>min_by(.nhan)</code>.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['error event (capture)', 'Window-level event for uncaught exceptions; with capture it also sees failed resource loads.'],
  ['unhandledrejection', 'Event fired when a promise is rejected and nobody handles it.'],
  ['sendBeacon', 'Small asynchronous POST that survives page unload; shows as "ping".'],
  ['symbolication', 'Turning minified positions into source file:line using a (private) source map.'],
  ['CSP report / Report-Only', 'JSON sent by the browser for each violation; Report-Only reports without blocking.'],
  ['Script error.', 'What you get for errors in cross-origin scripts without CORS — no message, no stack.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Users do not open DevTools — make the page report its own errors.</li>
<li>Listen to error (capture) + unhandledrejection; de-duplicate, cap, scrub, sendBeacon.</li>
<li>Symbolicate on the server with private source maps.</li>
<li>CSP reports name the directive, the blocked thing and the line; roll out with Report-Only.</li>
<li>Collectors miss errors before they load and cross-origin details; server logs fill the gap.</li>
<li>The endpoint is public input: limit, validate, render as text; collect by allow-list, never form contents.</li>
</ul>
${nguon('📘', 'MDN — Window: error event', 'Uncaught errors and resource load errors (capture)', 'https://developer.mozilla.org/en-US/docs/Web/API/Window/error_event')}
${nguon('📘', 'MDN — Content-Security-Policy-Report-Only', 'Test a policy without enforcing it; report-to / Reporting-Endpoints', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy-Report-Only')}
${nguon('🔬', 'Freedom to Tinker — No boundaries: exfiltration of personal data by session-replay scripts (11/2017)', '482 of the top 50 000 sites; passwords in text inputs recorded', 'https://freedom-to-tinker.com/2017/11/15/no-boundaries-exfiltration-of-personal-data-by-session-replay-scripts/')}
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-7-1-loi-khong-phai-log', title: 'Observability 7.1 — Errors are not logs', sub: 'Error tracking in depth: grouping, releases, alerts', cta: 'Open' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.5</span>
<h2>Mang Console của người dùng về nhà: thu lỗi phía giao diện</h2>
<p class="lead">Các bài 9.1–9.4 giả định có ai đó mở DevTools giúp bạn. Người dùng thật thì không: họ thấy trang trắng, đóng tab và bỏ đi. Cách duy nhất để biết là cho trang tự báo lỗi của nó về một máy chủ bạn quản lý. Bài này dựng một bộ thu lỗi nhỏ, chạy nó, và cho thấy nó bắt được gì, sót gì, bị lạm dụng ra sao. Công cụ production (Sentry, OpenTelemetry cho trình duyệt) làm đúng việc này với nhiều tính năng hơn — khoá observability dạy chúng; hiểu cơ chế giúp bạn đọc dữ liệu của chúng và cài đặt an toàn.</p>

<h3>Liên tưởng đời thường: hộp thư góp ý cạnh cửa</h3>
<p>Nhà hàng chỉ biết bát canh nguội nếu khách bỏ một mẩu giấy vào hộp. Hộp tốt có mẫu ngắn (không viết văn), không nhận cùng một mẩu giấy năm mươi lần, và không đòi số căn cước. Hộp tồi thì đầy thư rác. Bộ thu của ta là cái hộp; các quy tắc dưới đây là tờ mẫu.</p>

<h3>Bước 1 — trang lắng nghe những gì</h3>
${ma('js', 's09/lab/src/bat-loi.js')}
<ul>
<li><code>window.addEventListener('error', …, true)</code> — ngoại lệ không ai bắt <strong>và</strong>, nhờ cờ capture <code>true</code>, cả lỗi tải tài nguyên (<code>&lt;img&gt;</code>, <code>&lt;script&gt;</code>) vốn không nổi bọt lên window.</li>
<li><code>unhandledrejection</code> — chính các dòng <code>Uncaught (in promise)</code> ở bài 9.1.</li>
<li>Khử trùng theo chữ ký (loại + thông điệp + tệp:dòng) và giới hạn 10 báo cáo mỗi lần tải trang — một vòng lặp hỏng không được gửi đi hàng nghìn request.</li>
<li><code>che()</code> che JWT, các tham số kiểu <code>?token=</code> và địa chỉ email <em>trước khi</em> bất cứ thứ gì rời trình duyệt.</li>
<li><code>navigator.sendBeacon</code> — một POST nhỏ trình duyệt vẫn giao đi kể cả khi trang đang đóng (hiện kiểu <code>ping</code> trong Network, bài 9.2).</li>
</ul>
<p>Phía máy chủ (trong <code>server.mjs</code>): từ chối thân lớn hơn 8 kB (413), đọc JSON, dịch <code>app.min.js:1:939</code> thành <code>src/app.js:8</code> bằng source map <strong>giữ trên máy chủ</strong> (nhờ vậy bạn thôi công khai nó, bài 9.1), ghi mỗi báo cáo một dòng JSON vào <code>logs/rum.log</code>. Vi phạm CSP đi về điểm thứ hai, <code>/csp</code>, khai báo trong header chính sách: <code>script-src 'self' 'nonce-lab9'; report-uri /csp</code>.</p>

<h3>Bước 2 — chạy thử: một cơn bão, một cú sập, một Promise bị từ chối, một bí mật</h3>
${lenh('s09/rum', 1)}
${lenh('s09/rum', 2)}
<p>Trang đã ném <strong>50</strong> lỗi vẽ giao diện (ba thông điệp khác nhau), một Promise bị từ chối, một cú sập khi bấm và một lỗi chứa email với token. Log có <strong>6</strong> dòng: khử trùng biến 50 thành 3. Dòng Promise có <code>vitri: null</code> — Promise bị từ chối không mang tệp/dòng riêng; vị trí nằm trong stack.</p>
${lenh('s09/rum', 3)}
<p>Stack tới nơi ở dạng nén và được dịch trên máy chủ: <code>src/app.js:8:14</code> ← <code>:13:16</code> ← hàm xử lý cú bấm ở <code>:45</code> — đúng câu trả lời DevTools cho ở bài 9.1, nhưng giờ là cho mọi người dùng, không cần nhờ ai mở DevTools.</p>
${lenh('s09/rum', 4)}
<p>Thông điệp gốc là <em>không tải được hồ sơ sv.lab9@example.com (…/ho-so?token=eyJ…)</em>. Thứ tới máy chủ: <code>[EMAIL]</code> và <code>token=[CHE]</code>. Thông điệp lỗi hay chứa dữ liệu người dùng nhập, URL và mã định danh; che ở phía máy khách là chỗ duy nhất bảo đảm việc che xảy ra trước khi lưu.</p>

<h3>Bước 3 — đọc một báo cáo CSP</h3>
${lenh('s09/rum', 5)}
<p>Năm trường trả lời "cái gì bị chặn và ở đâu": <code>violated-directive</code> (<code>script-src-elem</code> — một phần tử <code>&lt;script&gt;</code>), <code>blocked-uri</code> (<code>inline</code> — không phải URL mà là mã nội tuyến; với tệp ngoài bạn sẽ thấy URL, thứ lộ ra script bên thứ ba bị chèn vào), <code>source-file</code> + <code>line-number</code> (dòng 9 của trang — widget chat), và <code>disposition</code> (<code>enforce</code> = đã chặn; với header <code>Content-Security-Policy-Report-Only</code> sẽ là <code>report</code> = chỉ báo). Cách chuẩn để triển khai một CSP mới: đưa lên dạng Report-Only, đọc các báo cáo này một tuần, sửa hoặc cho phép, rồi mới bật chặn. <code>report-uri</code> là cơ chế cũ; cơ chế mới là <code>report-to</code> kèm header <code>Reporting-Endpoints</code>, gom báo cáo thành lô (tới chậm hơn, dạng <code>application/reports+json</code>). Cùng Reporting API đó còn gửi cả báo cáo deprecation và intervention.</p>

<h3>Bước 4 — bộ thu bỏ sót những gì</h3>
${lenh('s09/rum', 6)}
<div class="pitfall co-tieu-de"><p><strong>Ảnh logo hỏng không bao giờ tới rum.log — 0 báo cáo — nhưng máy chủ web đã ghi lỗi 404.</strong> Ảnh lỗi lúc HTML còn đang được phân tích, <em>trước khi</em> <code>app.min.js</code> kịp cài bộ nghe. Bộ thu nào cũng có điểm mù lúc trang vừa mở. Cách sửa: đặt một đoạn nghe nội tuyến nhỏ (có nonce) ở đầu <code>&lt;head&gt;</code> để giữ tạm các lỗi tới khi bộ thu thật tải xong; và vẫn đọc log máy chủ — với tệp tĩnh, access log là nhân chứng tốt hơn.</p></div>
<p>Hai điểm mù nữa nên biết: lỗi ném ra trong script từ <strong>origin khác</strong> chỉ tới dưới dạng <code>"Script error."</code> không có chi tiết, trừ khi script đó được nạp với <code>crossorigin</code> và phục vụ kèm header CORS; và người dùng có trình chặn quảng cáo hay thiết lập riêng tư chặt có thể chặn điểm thu của bạn (chọn một đường dẫn cùng nhà như <code>/rum</code>, đừng dùng tên miền kiểu tracker).</p>

<h3>Bước 5 — điểm thu là cửa công khai: tự lạm dụng nó trước</h3>
${lenh('s09/rum', 7)}
${lenh('s09/rum', 8)}
<p>Giới hạn kích thước hoạt động (413). Nhưng ai cũng POST được một báo cáo giả: "lỗi" của ta ghi <em>Lỗi nghiêm trọng! Gọi ngay 0900 000 000…</em> và được lưu y như lỗi thật — chỉ có <code>ua: null</code> làm lộ nó. Nếu sau này một dashboard hiện các thông điệp đó cho nhân viên hỗ trợ, đó là một kênh lừa đảo; nếu dashboard hiển thị chúng dạng HTML, đó là stored XSS vào trang quản trị của bạn; nếu nó tin vào số lượng, một script có thể làm phình hoá đơn lưu log. Phòng như mọi đầu vào công khai (bài 10.9): lược đồ cố định và độ dài tối đa cho từng trường, giới hạn tốc độ theo IP/phiên, bỏ báo cáo có tệp không phải gói mã của bạn, chỉ hiển thị dạng chữ, và cảnh báo khi số lượng tăng vọt.</p>

<h3>Góc hacker: khi công cụ đo đạc ghi quá nhiều — session replay, 2017</h3>
<p>Một số công cụ đi xa hơn báo cáo lỗi: ghi lại cả phiên (cú bấm, phím gõ, nội dung trang) để "phát lại". Tháng 11/2017, các nhà nghiên cứu ở Princeton (Freedom to Tinker, "No boundaries") khảo sát bảy dịch vụ như vậy có mặt trên <strong>482 trong 50 000 trang web hàng đầu</strong>, và cho thấy bản ghi chụp cả dữ liệu mà các trang không hề định chia sẻ: thông tin y tế, dữ liệu thẻ tín dụng và <strong>mật khẩu</strong> — các dịch vụ có che ô <code>type="password"</code>, nhưng những ô đăng nhập "thân thiện với di động" lưu mật khẩu trong ô chữ thường thì bị ghi rõ. Bài học cho mọi bộ thu phía máy khách, kể cả cái bạn tự viết: <strong>liệt kê thứ được phép gửi</strong> (loại, thông điệp, stack, đường dẫn trang, phiên bản) thay vì liệt kê thứ mong giấu; không bao giờ mặc định thu giá trị form hay nội dung trang; che ở phía máy khách; giữ báo cáo trong kho của mình với thời hạn lưu (Chương 16).</p>

<h3>Tình huống đời thật</h3>
<ul>
<li><strong>Sau một bản phát hành, báo cáo lỗi nhảy từ 5 lên 900 mỗi giờ</strong>, cùng một chữ ký, cùng phiên bản 1.4.2. Đó là tín hiệu rollback — trước cả cuộc gọi hỗ trợ đầu tiên. (Cảnh báo theo khối lượng log: Chương 15.)</li>
<li><strong>Đội bạn cài Sentry/OTel</strong>: kiểm các thiết lập gửi thân request, cookie và IP người dùng, việc tải source map (kín) và tỉ lệ lấy mẫu. Dữ liệu bạn thu giờ là dữ liệu cá nhân bạn chịu trách nhiệm.</li>
<li><strong>Outsourcing</strong>: hợp đồng của khách có thể cấm gửi bất kỳ dữ liệu người dùng nào sang SaaS bên thứ ba. Một bộ thu tự dựng nhỏ như cái này, ghi dòng JSON vào chính kho log bạn đã gom (Chương 15), là câu trả lời được chấp nhận.</li>
<li><strong>Nếu</strong> chỉ nhận được "Script error."? Một script bên thứ ba (chat, analytics) đang lỗi; nạp nó với <code>crossorigin="anonymous"</code> nếu nhà cung cấp có gửi header CORS, hoặc hỏi nhà cung cấp.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><em>Làm sao bạn biết lỗi JavaScript người dùng gặp?</em> — Bộ bắt <code>error</code> + <code>unhandledrejection</code> toàn cục, gửi báo cáo nhỏ, đã khử trùng, đã che (sendBeacon) về bộ thu hoặc công cụ theo dõi lỗi; dịch vị trí bằng source map giữ kín.</li>
<li><em><code>Content-Security-Policy-Report-Only</code> dùng để làm gì?</em> — Thử một chính sách: vi phạm được báo, không có gì bị chặn.</li>
<li><em>Vì sao công cụ theo dõi lỗi có thể chỉ hiện "Script error." không có stack?</em> — Script khác origin không có <code>crossorigin</code>/CORS; trình duyệt giấu chi tiết.</li>
</ul>

<h3>🧪 Thực hành (35 phút)</h3>
<div class="callout ok"><ol>
<li>Thêm một đoạn nội tuyến 6 dòng (có <code>nonce="lab9"</code>) ở đầu <code>index.html</code> để giữ tạm các sự kiện <code>error</code> tới khi <code>bat-loi.js</code> tải xong, rồi gửi chúng đi. Chứng minh <code>logo-moi.png</code> giờ đã tới rum.log.</li>
<li>Thêm giới hạn theo IP cho <code>/rum</code> trên máy chủ (ví dụ 30 báo cáo/phút → 429). Cho thấy bằng một vòng curl.</li>
<li>Đổi header chính sách thành <code>Content-Security-Policy-Report-Only</code>. Console, csp.log và widget chat thay đổi thế nào?</li>
<li>Viết một truy vấn jq trên rum.log in ra các chữ ký lỗi nhiều nhất kèm số lần và lần đầu xuất hiện.</li>
</ol>
<p><strong>Đạt khi:</strong> câu 1 có dòng <code>ResourceError … logo-moi.png</code>; câu 2 in 204 rồi 429 trong vòng lặp; câu 3: <code>console.log</code> của widget chạy, thông điệp Console có "[Report Only]", csp.log có <code>"disposition": "report"</code>; câu 4 dùng <code>group_by(.tin)</code> với <code>length</code> và <code>min_by(.nhan)</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['sự kiện error (capture)', 'Sự kiện cấp window cho ngoại lệ không ai bắt; khi dùng capture còn thấy cả lỗi tải tài nguyên.'],
  ['unhandledrejection', 'Sự kiện xảy ra khi một Promise bị từ chối mà không ai xử lý.'],
  ['sendBeacon', 'POST nhỏ bất đồng bộ, vẫn được gửi khi trang đóng; hiện kiểu "ping".'],
  ['symbolication (dịch vị trí)', 'Đổi vị trí trong mã nén thành tệp:dòng gốc nhờ source map (giữ kín).'],
  ['báo cáo CSP / Report-Only', 'JSON trình duyệt gửi cho mỗi vi phạm; Report-Only chỉ báo, không chặn.'],
  ['Script error.', 'Thứ bạn nhận được với lỗi trong script khác origin không có CORS — không thông điệp, không stack.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Người dùng không mở DevTools — hãy cho trang tự báo lỗi.</li>
<li>Nghe error (capture) + unhandledrejection; khử trùng, giới hạn, che, gửi bằng sendBeacon.</li>
<li>Dịch vị trí trên máy chủ bằng source map giữ kín.</li>
<li>Báo cáo CSP nêu chỉ thị, thứ bị chặn và dòng; triển khai bằng Report-Only.</li>
<li>Bộ thu sót lỗi xảy ra trước khi nó tải và chi tiết của script khác origin; log máy chủ lấp chỗ trống.</li>
<li>Điểm thu là đầu vào công khai: giới hạn, kiểm, hiển thị dạng chữ; thu theo danh sách cho phép, không bao giờ thu nội dung form.</li>
</ul>
${nguon('📘', 'MDN — Window: error event', 'Lỗi không ai bắt và lỗi tải tài nguyên (capture)', 'https://developer.mozilla.org/en-US/docs/Web/API/Window/error_event')}
${nguon('📘', 'MDN — Content-Security-Policy-Report-Only', 'Thử chính sách mà không chặn; report-to / Reporting-Endpoints', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy-Report-Only')}
${nguon('🔬', 'Freedom to Tinker — No boundaries: exfiltration of personal data by session-replay scripts (11/2017)', '482 trong 50 000 trang hàng đầu; mật khẩu trong ô chữ thường bị ghi lại', 'https://freedom-to-tinker.com/2017/11/15/no-boundaries-exfiltration-of-personal-data-by-session-replay-scripts/')}
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-7-1-loi-khong-phai-log', title: 'Observability 7.1 — Lỗi không phải log', sub: 'Theo dõi lỗi chuyên sâu: gom nhóm, phiên bản phát hành, cảnh báo', cta: 'Mở bài' })}
</div>
`,
};
