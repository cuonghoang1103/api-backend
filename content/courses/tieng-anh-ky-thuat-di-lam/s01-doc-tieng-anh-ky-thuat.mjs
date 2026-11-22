/**
 * Tiếng Anh kỹ thuật khi đi làm — Chương 1: Đọc tiếng Anh kỹ thuật (soạn 22/11/2026).
 * Slug + title chương khớp khung trong ../tieng-anh-ky-thuat-di-lam.mjs (tak-1-1 … tak-1-5).
 * Đoạn tài liệu/issue/release notes/spec mẫu là mẫu DỰNG LẠI theo cấu trúc thật (thư viện "labflow-client" và dự án LabFlow là hư cấu,
 * ghi rõ trong bài); thông báo lỗi Java/JS/Spring Boot/Git/npm là câu chữ thật của công cụ. Định nghĩa MUST/SHOULD/MAY trích RFC 2119
 * (S. Bradner, 3/1997, BCP 14) và RFC 8174 (B. Leiba, 5/2017). Khung tài liệu bốn loại: Diátaxis (diataxis.fr, D. Procida).
 */
import { mau, saiDung, tuVung, Q } from './_chung.mjs';

/* ═════════════ 1.1 — Đọc tài liệu ═════════════ */
const MAU_DOC = mau(`
Configuring timeouts

By default, the client waits up to 30 seconds for a response. You can override
this per request or globally.

  client.get("/loans", { timeoutMs: 5000 });     // per request

Note: Timeouts apply to the whole request, i.e. connecting AND reading the body.
If you only want to limit the connection phase, use connectTimeoutMs instead.

Retries are disabled unless you set retry.enabled to true. Requests that are not
idempotent (e.g. POST) are never retried, even when retries are enabled.

Deprecated: the "timeout" option (in seconds) is deprecated since 2.0 and will be
removed in 3.0. Use timeoutMs.
`, 'Mẫu dựng lại theo văn phong tài liệu thật — thư viện "labflow-client" là hư cấu.');

const L11 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 1 · Reading' : 'Chương 1 · Đọc'}</span>
<h2>${en ? '1.1 — Reading documentation: structure, skimming, tutorial vs reference' : '1.1 — Đọc tài liệu: cấu trúc, đọc lướt, tutorial và reference'}</h2>
<p class="lead">${en
    ? 'At work nobody reads documentation from top to bottom. You arrive with a question — "how do I enable CORS?", "why is my request retried?" — and you need the answer in five minutes. The trick is not better English; it is knowing <strong>which kind of page</strong> holds the answer and <strong>which sentences</strong> on that page carry the meaning.'
    : 'Đi làm không ai đọc tài liệu từ đầu tới cuối. Bạn tới với một câu hỏi — "bật CORS thế nào?", "sao request của mình bị gửi lại?" — và cần câu trả lời trong năm phút. Mẹo không nằm ở tiếng Anh giỏi hơn; nó nằm ở việc biết <strong>loại trang nào</strong> chứa câu trả lời và <strong>những câu nào</strong> trên trang mang nghĩa.'}</p>

<h3>${en ? 'Situation' : 'Tình huống'}</h3>
<p>${en
    ? 'Week two of your OJT. The React team says: "The browser blocks our calls to your API — CORS error. Can you allow localhost:5173?" Your lead is in a meeting. You open the Spring documentation, which has hundreds of pages. Where do you look?'
    : 'Tuần thứ hai OJT. Nhóm React nhắn: "The browser blocks our calls to your API — CORS error. Can you allow localhost:5173?" Trưởng nhóm đang họp. Bạn mở tài liệu Spring, có hàng trăm trang. Tìm ở đâu?'}</p>

<h3>${en ? 'Four kinds of documentation page' : 'Bốn loại trang tài liệu'}</h3>
<p>${en
    ? 'Most good documentation sets — Spring, React, Django, Kubernetes — are organised, explicitly or not, into the four kinds described by the <strong>Diátaxis</strong> framework (diataxis.fr). Recognising the kind tells you how to read the page.'
    : 'Hầu hết bộ tài liệu tốt — Spring, React, Django, Kubernetes — được chia, nói rõ hay không, thành bốn loại mà khung <strong>Diátaxis</strong> (diataxis.fr) mô tả. Nhận ra loại trang là biết cách đọc trang đó.'}</p>
<table>
<thead><tr><th>${en ? 'Kind' : 'Loại'}</th><th>${en ? 'Answers' : 'Trả lời câu'}</th><th>${en ? 'Typical words' : 'Chữ hay gặp'}</th><th>${en ? 'How to read it' : 'Đọc thế nào'}</th></tr></thead>
<tbody>
<tr><td><strong>Tutorial</strong></td><td>${en ? '"Teach me from zero"' : '"Dạy tôi từ số 0"'}</td><td>Getting started, Quickstart, "In this guide you will build…"</td><td>${en ? 'Follow every step in order; do not skip.' : 'Làm theo từng bước, đúng thứ tự, không nhảy cóc.'}</td></tr>
<tr><td><strong>How-to guide</strong></td><td>${en ? '"How do I do X?"' : '"Làm X thế nào?"'}</td><td>How to…, Configuring…, Enabling…</td><td>${en ? 'Jump straight to the section that matches your task.' : 'Nhảy thẳng tới mục khớp việc của bạn.'}</td></tr>
<tr><td><strong>Reference</strong></td><td>${en ? '"What exactly does this option do?"' : '"Tuỳ chọn này chính xác làm gì?"'}</td><td>API, Javadoc, Properties, Options, Parameters, Returns, Throws</td><td>${en ? 'Search (Ctrl+F) for the exact name; read the one entry.' : 'Tìm (Ctrl+F) đúng tên; đọc đúng một mục.'}</td></tr>
<tr><td><strong>Explanation</strong></td><td>${en ? '"Why does it work this way?"' : '"Vì sao nó chạy như vậy?"'}</td><td>Concepts, Architecture, Overview, "Understanding…"</td><td>${en ? 'Read slowly, once, when you have time — not during a bug.' : 'Đọc chậm, một lần, khi rảnh — không phải lúc đang sửa bug.'}</td></tr>
</tbody>
</table>
<p>${en
    ? 'For the CORS question: it is a "how do I" question, so you look for a how-to page or a "CORS" section in the reference guide, not a tutorial. In Spring you would find it in the Spring Framework reference (Web MVC → CORS), in the Spring Security reference (because Security has its own CORS integration), and as a short Spring guide "Enabling Cross Origin Requests for a RESTful Web Service".'
    : 'Câu hỏi CORS là câu "làm thế nào", nên bạn tìm trang how-to hoặc mục "CORS" trong reference, không phải tutorial. Với Spring bạn sẽ thấy nó trong Spring Framework reference (Web MVC → CORS), trong Spring Security reference (vì Security có phần tích hợp CORS riêng), và trong một guide ngắn "Enabling Cross Origin Requests for a RESTful Web Service".'}</p>

<h3>${en ? 'Skimming: the seven places meaning hides' : 'Đọc lướt: bảy chỗ nghĩa hay nằm'}</h3>
<ol>
<li>${en ? '<strong>The version selector</strong> — check it first. Half of "the docs are wrong" is reading docs for another version.' : '<strong>Ô chọn phiên bản</strong> — xem đầu tiên. Một nửa số lần "tài liệu sai" là đọc tài liệu của phiên bản khác.'}</li>
<li>${en ? '<strong>Headings</strong> — they are the table of contents of your question.' : '<strong>Tiêu đề mục</strong> — chúng là mục lục cho câu hỏi của bạn.'}</li>
<li>${en ? '<strong>Code blocks</strong> — read the code first, then only the sentence just before and just after it.' : '<strong>Khối code</strong> — đọc code trước, rồi chỉ đọc câu ngay trước và ngay sau nó.'}</li>
<li>${en ? '<strong>Note / Tip / Warning / Important / Caution</strong> boxes — the exceptions live there.' : 'Hộp <strong>Note / Tip / Warning / Important / Caution</strong> — các ngoại lệ nằm ở đó.'}</li>
<li>${en ? '<strong>"By default"</strong> — tells you what happens if you do nothing.' : '<strong>"By default"</strong> — cho biết chuyện gì xảy ra nếu bạn không làm gì.'}</li>
<li>${en ? '<strong>Condition words</strong>: <em>if, unless, only if, as long as, even when, otherwise</em>. One of them can reverse the sentence.' : '<strong>Chữ điều kiện</strong>: <em>if, unless, only if, as long as, even when, otherwise</em>. Một chữ trong số đó có thể lật ngược cả câu.'}</li>
<li>${en ? '<strong>Deprecated / Since / Removed in</strong> — tells you whether the example you copied from Stack Overflow is still valid.' : '<strong>Deprecated / Since / Removed in</strong> — cho biết đoạn bạn chép từ Stack Overflow còn dùng được không.'}</li>
</ol>

<h3>${en ? 'Try it on a real-style page' : 'Thử trên một trang kiểu thật'}</h3>
${MAU_DOC}
<p>${en ? 'Five questions — answer only from the text:' : 'Năm câu hỏi — chỉ trả lời dựa vào đoạn trên:'}</p>
<ol>
<li>${en ? 'You set nothing. How long does the client wait?' : 'Bạn không đặt gì. Client chờ bao lâu?'}</li>
<li>${en ? 'Does <code>timeoutMs</code> include reading the response body?' : '<code>timeoutMs</code> có tính cả thời gian đọc body không?'}</li>
<li>${en ? 'Are failed GET requests retried if you change nothing?' : 'Request GET lỗi có được gửi lại nếu bạn không đổi gì không?'}</li>
<li>${en ? 'You enabled retries. Will a failed POST be retried?' : 'Bạn đã bật retry. POST lỗi có được gửi lại không?'}</li>
<li>${en ? 'Your old code uses <code>timeout: 10</code>. What should you change, and how urgent is it?' : 'Code cũ dùng <code>timeout: 10</code>. Cần đổi gì, gấp tới mức nào?'}</li>
</ol>
<details><summary>${en ? 'Answers and the word that decides each one' : 'Đáp án và chữ quyết định từng câu'}</summary>
<ol>
<li>${en ? '30 seconds — "<strong>By default</strong>".' : '30 giây — "<strong>By default</strong>".'}</li>
<li>${en ? 'Yes — "<strong>i.e.</strong> connecting AND reading the body" (i.e. = "that is", it explains; e.g. = "for example", it gives one case).' : 'Có — "<strong>i.e.</strong> connecting AND reading the body" (i.e. = "tức là", để giải thích; e.g. = "ví dụ", đưa một trường hợp).'}</li>
<li>${en ? 'No — "disabled <strong>unless</strong> you set…". "Unless" = "if not".' : 'Không — "disabled <strong>unless</strong> you set…". "Unless" = "trừ khi / nếu không".'}</li>
<li>${en ? 'No — "<strong>never</strong> retried, <strong>even when</strong> retries are enabled".' : 'Không — "<strong>never</strong> retried, <strong>even when</strong> retries are enabled".'}</li>
<li>${en ? 'Change to <code>timeoutMs: 10000</code> (seconds → milliseconds!). It still works in 2.x; it breaks when you upgrade to 3.0.' : 'Đổi thành <code>timeoutMs: 10000</code> (giây → mili giây!). Ở 2.x vẫn chạy; nâng lên 3.0 thì hỏng.'}</li>
</ol></details>

<h3>${en ? 'Unknown word? Guess before you look it up' : 'Gặp từ lạ? Đoán trước khi tra'}</h3>
<p>${en
    ? 'Stopping at every unknown word kills your speed. Use three clues first, and look a word up only if the sentence still makes no sense — or if the word appears three times.'
    : 'Dừng ở mọi từ lạ là giết tốc độ đọc. Dùng ba manh mối trước, và chỉ tra khi câu vẫn vô nghĩa — hoặc khi từ đó xuất hiện tới ba lần.'}</p>
<div class="kv-grid">
  <div class="kv"><span class="k">${en ? 'Word parts' : 'Thành phần từ'}</span><span class="v"><em>re-</em> (again: retry, rebuild) · <em>un-/in-/non-</em> (not: unset, invalid, non-blocking) · <em>de-</em> (undo: deserialize, decrypt) · <em>pre-/post-</em> (before/after: precondition, post-processing) · <em>-able</em> (can be: configurable) · <em>-less</em> (without: stateless, serverless) · <em>over-</em> (above/replace: override, overhead).</span></div>
  <div class="kv"><span class="k">${en ? 'The code next to it' : 'Đoạn code cạnh nó'}</span><span class="v">${en ? 'If the sentence says "pass an idempotency key" and the code shows a header <code>Idempotency-Key</code>, you already know what to do, even before you know the word.' : 'Câu nói "pass an idempotency key" mà code có header <code>Idempotency-Key</code> thì bạn đã biết phải làm gì, kể cả khi chưa biết nghĩa từ.'}</span></div>
  <div class="kv"><span class="k">${en ? 'Signal words' : 'Chữ báo hiệu'}</span><span class="v"><em>however, but</em> (${en ? 'contrast' : 'trái ý'}) · <em>therefore, as a result</em> (${en ? 'consequence' : 'hệ quả'}) · <em>instead</em> (${en ? 'the alternative to use' : 'cái nên dùng thay'}) · <em>for example, e.g.</em> (${en ? 'one case' : 'một trường hợp'}) · <em>that is, i.e.</em> (${en ? 'the same thing, explained' : 'cùng ý, giải thích lại'}).</span></div>
</div>

<h3>${en ? 'Mistakes Vietnamese developers make when reading docs' : 'Lỗi dev Việt hay mắc khi đọc tài liệu'}</h3>
${saiDung([
    [en ? 'Translating the whole page with a machine translator' : 'Dịch cả trang bằng máy dịch', en ? 'Read in English; translate only one sentence you are stuck on' : 'Đọc bằng tiếng Anh; chỉ dịch đúng câu đang kẹt', en ? 'Machines translate terms as normal words: "thread" → "chủ đề", "deprecated" → "bị phản đối", "token" → "mã thông báo". Your team says these words in English anyway.' : 'Máy dịch thuật ngữ như từ thường: "thread" → "chủ đề", "deprecated" → "bị phản đối", "token" → "mã thông báo". Đằng nào cả nhóm cũng nói các từ này bằng tiếng Anh.'],
    [en ? 'Reading "unless" as "if"' : 'Đọc "unless" thành "if"', en ? '"unless X" = "if not X"' : '"unless X" = "nếu không X"', en ? 'It reverses the condition — the most expensive word to misread.' : 'Nó đảo ngược điều kiện — chữ đọc sai tốn kém nhất.'],
    [en ? 'Skipping the Note box' : 'Bỏ qua hộp Note', en ? 'Read every Note/Warning near the code you copy' : 'Đọc mọi Note/Warning quanh đoạn code bạn chép', en ? 'Exceptions and gotchas are almost always there.' : 'Ngoại lệ và bẫy gần như luôn nằm ở đó.'],
    [en ? 'Using the first Google result' : 'Dùng kết quả Google đầu tiên', en ? 'Check the version in the URL or the selector' : 'Kiểm phiên bản trên URL hoặc ô chọn', en ? 'Spring Boot 2 and 3 docs both rank well; javax vs jakarta breaks your build.' : 'Tài liệu Spring Boot 2 và 3 đều lên top; javax hay jakarta là hỏng build.'],
    [en ? 'Confusing e.g. and i.e.' : 'Lẫn e.g. và i.e.', 'e.g. = for example · i.e. = that is', en ? '"Use a secure protocol, i.e. HTTPS" means only HTTPS; "e.g. HTTPS" means HTTPS is one option.' : '"Use a secure protocol, i.e. HTTPS" nghĩa là chỉ HTTPS; "e.g. HTTPS" nghĩa là HTTPS là một lựa chọn.'],
  ], en)}

${tuVung(en ? [
    ['by default', 'what happens if you do nothing', 'Retries are disabled by default.'],
    ['out of the box', 'works without configuration', 'CORS is not enabled out of the box.'],
    ['opt in / opt out', 'turn on / turn off something optional', 'You must opt in to retries.'],
    ['deprecated', 'still works, but will be removed; stop using it', 'The timeout option is deprecated since 2.0.'],
    ['under the hood', 'internally, how it really works', 'Under the hood, it uses a connection pool.'],
    ['boilerplate', 'repetitive code you must write every time', 'The starter removes most of the boilerplate.'],
    ['caveat', 'a warning or limitation', 'One caveat: POST is never retried.'],
  ] : [
    ['by default', 'mặc định, khi bạn không làm gì', 'Retries are disabled by default.'],
    ['out of the box', 'chạy được ngay, không cần cấu hình', 'CORS is not enabled out of the box.'],
    ['opt in / opt out', 'chủ động bật / tắt một thứ tuỳ chọn', 'You must opt in to retries.'],
    ['deprecated', 'vẫn chạy nhưng sẽ bị bỏ; đừng dùng nữa', 'The timeout option is deprecated since 2.0.'],
    ['under the hood', 'bên dưới, cách nó chạy thật', 'Under the hood, it uses a connection pool.'],
    ['boilerplate', 'code lặp lại phải viết lần nào cũng như nhau', 'The starter removes most of the boilerplate.'],
    ['caveat', 'lưu ý, giới hạn', 'One caveat: POST is never retried.'],
  ], en)}

<h3>🧪 ${en ? 'Practice (5 + 10 minutes)' : 'Thực hành (5 + 10 phút)'}</h3>
<div class="callout ok"><p><strong>${en ? 'Exercise 1 — the 5-minute CORS hunt.' : 'Bài 1 — săn CORS trong 5 phút.'}</strong> ${en ? 'Start a timer. In the official Spring documentation (docs.spring.io), find (a) the annotation that enables CORS on one controller, (b) how to configure CORS globally for all endpoints, (c) what you must add when Spring Security is on the classpath. Write the page titles you used.' : 'Bấm giờ. Trong tài liệu Spring chính thức (docs.spring.io), tìm (a) annotation bật CORS cho một controller, (b) cách cấu hình CORS cho mọi endpoint, (c) phải thêm gì khi có Spring Security. Ghi tên các trang bạn đã dùng.'}</p>
<details><summary>${en ? 'Suggested answer' : 'Đáp án gợi ý'}</summary>
<ul>
<li>(a) <code>@CrossOrigin</code> ${en ? 'on the controller class or method — Spring Framework reference, Web MVC, "CORS".' : 'trên class hoặc method controller — Spring Framework reference, Web MVC, mục "CORS".'}</li>
<li>(b) ${en ? 'Global configuration: implement <code>WebMvcConfigurer</code> and override <code>addCorsMappings</code> — same "CORS" section, "Global Configuration".' : 'Cấu hình toàn cục: cài <code>WebMvcConfigurer</code> và ghi đè <code>addCorsMappings</code> — cùng mục "CORS", phần "Global Configuration".'}</li>
<li>(c) ${en ? 'Spring Security reference, "CORS": enable it in the filter chain (<code>http.cors(...)</code>) and provide a <code>CorsConfigurationSource</code>, because Security processes the request before Spring MVC.' : 'Spring Security reference, mục "CORS": bật trong filter chain (<code>http.cors(...)</code>) và cung cấp một <code>CorsConfigurationSource</code>, vì Security xử lý request trước Spring MVC.'}</li>
</ul></details>
<p><strong>${en ? 'Exercise 2 — sort six pages.' : 'Bài 2 — xếp sáu trang.'}</strong> ${en ? 'Classify each as tutorial / how-to / reference / explanation: (1) "Building a RESTful Web Service" (2) "Common Application Properties" (3) "How to configure a DataSource" (4) "Understanding the Spring Bean lifecycle" (5) Javadoc of <code>ResponseEntity</code> (6) "React Quick Start".' : 'Xếp mỗi trang vào tutorial / how-to / reference / explanation: (1) "Building a RESTful Web Service" (2) "Common Application Properties" (3) "How to configure a DataSource" (4) "Understanding the Spring Bean lifecycle" (5) Javadoc của <code>ResponseEntity</code> (6) "React Quick Start".'}</p>
<details><summary>${en ? 'Answer' : 'Đáp án'}</summary><p>1 tutorial · 2 reference · 3 how-to · 4 explanation · 5 reference · 6 tutorial.</p></details>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'you found all three CORS answers within 5 minutes using the docs only (no AI, no Stack Overflow) and sorted the six pages with at most one mistake.' : 'bạn tìm đủ ba ý CORS trong 5 phút chỉ bằng tài liệu (không AI, không Stack Overflow) và xếp sáu trang sai tối đa một.'}</p></div>
</div>
`;

/* ═════════════ 1.2 — Thông báo lỗi, log, issue, release notes ═════════════ */
const MAU_SPRING = mau(`
***************************
APPLICATION FAILED TO START
***************************

Description:

Web server failed to start. Port 8080 was already in use.

Action:

Identify and stop the process that's listening on port 8080 or configure this application to listen on another port.
`, 'Spring Boot — câu chữ thật của FailureAnalyzer.');

const MAU_STACK = mau(`
org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'entityManagerFactory' ...
    at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.initializeBean(...)
    ... 25 more
Caused by: org.hibernate.exception.JDBCConnectionException: Unable to open JDBC Connection for DDL execution
    ... 40 more
Caused by: org.postgresql.util.PSQLException: Connection to localhost:5432 refused. Check that the hostname
and port are correct and that the postmaster is accepting TCP/IP connections.
`, 'Stack trace Spring Boot + PostgreSQL, đã rút gọn các dòng "at …".');

const MAU_ISSUE = mau(`
#1482  Requests time out after upgrading to 2.3.0          [bug] [regression] [status: confirmed]

@dev-anna  (opened)
  After upgrading from 2.2.4 to 2.3.0, every request with a body larger than 1 MB
  times out after exactly 5 seconds. Downgrading fixes it.
  Environment: Node 22.11, macOS 15. Minimal repro: https://github.com/…/repro-1482

@user-b    +1, same here
@user-c    Any update on this? We are blocked.

@maint-li  [Member]
  Thanks for the repro, I can reproduce it. 2.3.0 accidentally applies connectTimeoutMs
  to the whole upload. As a workaround, set connectTimeoutMs to 30000 until the fix is released.

@user-d    I think you should switch to axios.

@maint-li  [Member]
  Fixed in #1490. The fix will be backported to 2.3.x and released in 2.3.1.

  -- maint-li closed this as completed in #1490
`, 'Luồng issue mẫu dựng lại theo GitHub — thư viện hư cấu.');

const MAU_RELEASE = mau(`
labflow-client 3.0.0

⚠ Breaking changes
- Node.js 18 is no longer supported. The minimum version is now Node.js 20.
- The "timeout" option (seconds), deprecated since 2.0, has been removed. Use "timeoutMs".
- client.request() now rejects on HTTP 4xx/5xx by default. Set throwOnError: false to restore the old behaviour.

✨ New features
- Added support for AbortSignal in every method (#1501).

🐞 Bug fixes
- Fixed a regression where large uploads timed out (#1482). Also backported to 2.3.1.

📔 Deprecations
- client.setHeader() is deprecated in favour of the "headers" option and will be removed in 4.0.

⬆ Dependency upgrades
- Upgrade to undici 7.2.0
`, 'Release notes mẫu dựng lại theo cấu trúc thật (Spring Boot, Node, React đều chia mục gần như vậy).');

const L12 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 1 · Reading' : 'Chương 1 · Đọc'}</span>
<h2>${en ? '1.2 — Error messages, logs, GitHub issues, release notes and changelogs' : '1.2 — Thông báo lỗi, log, issue GitHub, release notes và changelog'}</h2>
<p class="lead">${en
    ? 'The English you read most often at work is not documentation — it is error messages. They are short, repetitive and written in a tiny vocabulary. Then come GitHub issues (someone already had your bug) and release notes (should we upgrade?). This lesson teaches you to read all three fast and to find the <strong>one line that matters</strong>.'
    : 'Thứ tiếng Anh bạn đọc nhiều nhất khi đi làm không phải tài liệu — mà là thông báo lỗi. Chúng ngắn, lặp lại và dùng một vốn từ rất nhỏ. Kế tiếp là issue GitHub (ai đó đã gặp đúng lỗi của bạn) và release notes (có nên nâng phiên bản không?). Bài này dạy bạn đọc nhanh cả ba và tìm ra <strong>đúng một dòng quan trọng</strong>.'}</p>

<h3>${en ? 'The grammar of error messages' : 'Ngữ pháp của thông báo lỗi'}</h3>
<p>${en ? 'Almost every error message is one of these patterns. Learn the pattern and you can read errors from tools you have never used.' : 'Gần như mọi thông báo lỗi rơi vào một trong các mẫu dưới đây. Thuộc mẫu là đọc được lỗi của cả những công cụ chưa từng dùng.'}</p>
<table>
<thead><tr><th>${en ? 'Pattern' : 'Mẫu'}</th><th>${en ? 'Meaning' : 'Nghĩa'}</th><th>${en ? 'Real example' : 'Ví dụ thật'}</th></tr></thead>
<tbody>
<tr><td>Failed to / Could not / Unable to + <em>verb</em></td><td>${en ? 'the action that did not happen' : 'hành động không làm được'}</td><td><code>Unable to open JDBC Connection for DDL execution</code></td></tr>
<tr><td>Cannot + <em>verb</em> … because …</td><td>${en ? 'action + the reason' : 'hành động + lý do'}</td><td><code>Cannot invoke "String.length()" because "name" is null</code> (Java 14+)</td></tr>
<tr><td>… is not defined / not found / does not exist</td><td>${en ? 'a name the tool cannot find' : 'một cái tên công cụ không tìm thấy'}</td><td><code>ReferenceError: process is not defined</code></td></tr>
<tr><td>Cannot read properties of undefined (reading 'x')</td><td>${en ? 'the thing before .x is undefined' : 'thứ đứng trước .x đang là undefined'}</td><td><code>TypeError: Cannot read properties of undefined (reading 'map')</code></td></tr>
<tr><td>Type 'A' is not assignable to type 'B'</td><td>${en ? 'you gave A where B is expected' : 'bạn đưa A vào chỗ cần B'}</td><td>TypeScript</td></tr>
<tr><td>refused / denied / rejected</td><td>${en ? 'the other side said no' : 'phía bên kia từ chối'}</td><td><code>Connection to localhost:5432 refused</code>, <code>Permission denied (publickey)</code></td></tr>
<tr><td>already in use / already exists</td><td>${en ? 'a conflict with something existing' : 'đụng với thứ đã có'}</td><td><code>Port 8080 was already in use</code></td></tr>
<tr><td>refusing to …</td><td>${en ? 'the tool stops you on purpose, for safety' : 'công cụ cố ý chặn bạn cho an toàn'}</td><td><code>fatal: refusing to merge unrelated histories</code></td></tr>
<tr><td>unable to resolve / conflicting</td><td>${en ? 'versions that do not fit together' : 'các phiên bản không khớp nhau'}</td><td><code>npm error ERESOLVE unable to resolve dependency tree</code></td></tr>
</tbody>
</table>

<h3>${en ? 'Some tools tell you exactly what to do' : 'Có công cụ nói thẳng bạn phải làm gì'}</h3>
${MAU_SPRING}
<p>${en ? 'Read <strong>Description</strong> (what) and <strong>Action</strong> (what to do). "Identify and stop the process … <strong>or</strong> configure this application to listen on another port" offers two fixes; choose one. Git does the same with lines starting with <code>hint:</code>.' : 'Đọc <strong>Description</strong> (chuyện gì) và <strong>Action</strong> (làm gì). "Identify and stop the process … <strong>or</strong> configure this application to listen on another port" đưa hai cách sửa; chọn một. Git cũng vậy với các dòng bắt đầu bằng <code>hint:</code>.'}</p>

<h3>${en ? 'Stack traces: the truth is in the last "Caused by"' : 'Stack trace: sự thật nằm ở dòng "Caused by" cuối cùng'}</h3>
${MAU_STACK}
<p>${en
    ? 'The first line says a bean could not be created — that is only the symptom at the top. Read downwards through each <strong>Caused by</strong>; the last one is the root cause: PostgreSQL refused the connection on port 5432. The database is not running (or not on that port). Nothing in your entity code is wrong.'
    : 'Dòng đầu nói không tạo được bean — đó chỉ là triệu chứng ở tầng trên cùng. Đọc xuống qua từng <strong>Caused by</strong>; dòng cuối là nguyên nhân gốc: PostgreSQL từ chối kết nối ở cổng 5432. CSDL chưa chạy (hoặc không ở cổng đó). Code entity của bạn không sai gì cả.'}</p>
<p>${en ? '<strong>Log levels</strong> — <code>TRACE &lt; DEBUG &lt; INFO &lt; WARN &lt; ERROR</code>. A <code>WARN</code> means "this may be a problem later", not "it failed". When asked "any errors in the log?", count <code>ERROR</code> lines.' : '<strong>Mức log</strong> — <code>TRACE &lt; DEBUG &lt; INFO &lt; WARN &lt; ERROR</code>. <code>WARN</code> là "có thể thành vấn đề sau này", không phải "đã hỏng". Khi được hỏi "log có lỗi không?", hãy đếm dòng <code>ERROR</code>.'}</p>

<h3>${en ? 'GitHub issues: separating the answer from the noise' : 'Issue GitHub: tách câu trả lời khỏi tiếng ồn'}</h3>
${MAU_ISSUE}
<p>${en ? 'A long issue has four kinds of comment. Learn to tell them apart:' : 'Một issue dài có bốn loại bình luận. Tập phân biệt chúng:'}</p>
<div class="kv-grid">
  <div class="kv"><span class="k">${en ? 'Report' : 'Báo lỗi'}</span><span class="v">${en ? 'The first post: versions, steps, a "minimal repro". Check whether your versions match.' : 'Bài đầu: phiên bản, các bước, một "minimal repro" (ví dụ tái hiện tối giản). Kiểm xem phiên bản có khớp bạn không.'}</span></div>
  <div class="kv"><span class="k">${en ? 'Noise' : 'Tiếng ồn'}</span><span class="v">${en ? '"+1", "same here", "any update?", opinions ("switch to axios"). Skip them. (And do not write them yourself — use the 👍 reaction instead.)' : '"+1", "same here", "any update?", ý kiến cá nhân ("switch to axios"). Bỏ qua. (Và đừng tự viết những câu này — bấm 👍 là đủ.)'}</span></div>
  <div class="kv"><span class="k">${en ? 'Workaround' : 'Cách tạm'}</span><span class="v">${en ? 'Usually from a <strong>Member/Maintainer</strong> badge: "As a workaround, …". Use it now, remove it after upgrading.' : 'Thường từ người có huy hiệu <strong>Member/Maintainer</strong>: "As a workaround, …". Dùng ngay, gỡ khi đã nâng bản.'}</span></div>
  <div class="kv"><span class="k">${en ? 'Resolution' : 'Kết luận'}</span><span class="v">"Fixed in #1490", "released in 2.3.1", "closed as completed" — ${en ? 'or "closed as not planned", "works as designed / expected behavior" (it is not a bug), "duplicate of #…" (go to the other issue).' : 'hoặc "closed as not planned", "works as designed / expected behavior" (không phải lỗi), "duplicate of #…" (sang issue kia mà đọc).'}</span></div>
</div>

<h3>${en ? 'Release notes and changelogs: should we upgrade?' : 'Release notes và changelog: có nên nâng bản không?'}</h3>
${MAU_RELEASE}
<p>${en
    ? 'Version numbers usually follow <strong>semantic versioning</strong> (semver.org): MAJOR.MINOR.PATCH. A new MAJOR (2 → 3) may contain <strong>breaking changes</strong>; MINOR adds features without breaking; PATCH only fixes bugs. Many projects also follow keepachangelog.com, with the sections <em>Added, Changed, Deprecated, Removed, Fixed, Security</em>. Pre-release labels: <em>SNAPSHOT</em> (daily build), <em>M1, M2</em> (milestone), <em>RC</em> (release candidate), <em>GA</em> (general availability — the real release). <em>EOL</em> (end of life) means no more fixes, including security fixes.'
    : 'Số phiên bản thường theo <strong>semantic versioning</strong> (semver.org): MAJOR.MINOR.PATCH. Lên MAJOR (2 → 3) có thể có <strong>breaking change</strong> (thay đổi làm hỏng code cũ); MINOR thêm tính năng mà không phá; PATCH chỉ sửa lỗi. Nhiều dự án theo keepachangelog.com với các mục <em>Added, Changed, Deprecated, Removed, Fixed, Security</em>. Nhãn trước phát hành: <em>SNAPSHOT</em> (bản dựng hằng ngày), <em>M1, M2</em> (milestone), <em>RC</em> (release candidate — ứng viên phát hành), <em>GA</em> (general availability — bản chính thức). <em>EOL</em> (end of life) là hết được vá, kể cả vá bảo mật.'}</p>
<p><strong>${en ? 'A 5-line summary of these notes (model answer):' : 'Tóm tắt 5 dòng (đáp án mẫu):'}</strong></p>
${mau(`
1. Major release with 3 breaking changes — needs code changes before upgrading.
2. Requires Node.js 20+ (we run 22, OK).
3. "timeout" removed: replace with "timeoutMs" (x1000!) — 4 places in our code.
4. request() now throws on 4xx/5xx: check our error handling, or set throwOnError: false.
5. The upload timeout bug (#1482) is fixed; it is also in 2.3.1 if we want a safe patch upgrade first.
`)}

<h3>${en ? 'Mistakes Vietnamese developers make' : 'Lỗi dev Việt hay mắc'}</h3>
${saiDung([
    [en ? 'Googling the first line of the stack trace' : 'Google dòng đầu của stack trace', en ? 'Search the last "Caused by" message, without your own class names and paths' : 'Tìm câu của "Caused by" cuối cùng, bỏ tên class và đường dẫn riêng của bạn', en ? 'The top line is generic; the root cause is specific.' : 'Dòng đầu chung chung; nguyên nhân gốc mới cụ thể.'],
    [en ? 'Pasting 300 lines of log in the team chat: "help"' : 'Dán 300 dòng log vào chat nhóm: "help"', 'App fails to start: "Connection to localhost:5432 refused". DB container is up. What else should I check?', en ? 'Give the key line, what you tried, and a question (lesson 4.5).' : 'Đưa dòng quan trọng, đã thử gì, và một câu hỏi (bài 4.5).'],
    [en ? 'Writing "+1, any update?" on an issue' : 'Viết "+1, any update?" trên issue', en ? 'Add 👍, or add new information: "Also happens on Windows 11, Node 22.11."' : 'Bấm 👍, hoặc thêm thông tin mới: "Also happens on Windows 11, Node 22.11."', en ? 'Maintainers get notified for every comment.' : 'Maintainer nhận thông báo cho mọi bình luận.'],
    [en ? 'Reading "regression" as "a new feature"' : 'Hiểu "regression" là "tính năng mới"', en ? 'regression = something that used to work and is broken now' : 'regression = thứ trước đây chạy được, giờ hỏng', en ? 'It is often the most urgent label.' : 'Đây thường là nhãn gấp nhất.'],
    [en ? 'Upgrading a major version because it is "the latest"' : 'Lên bản major vì "mới nhất"', en ? 'Read "Breaking changes" first; estimate the work' : 'Đọc mục "Breaking changes" trước; ước lượng công sửa', en ? 'Major = your code may break.' : 'Major = code của bạn có thể hỏng.'],
  ], en)}

${tuVung(en ? [
    ['workaround', 'a temporary way around a problem', 'As a workaround, set connectTimeoutMs to 30000.'],
    ['breaking change', 'a change that makes old code stop working', 'Version 3.0 contains three breaking changes.'],
    ['regression', 'a bug in something that used to work', 'This is a regression introduced in 2.3.0.'],
    ['to backport', 'to apply a fix to an older release line', 'The fix will be backported to 2.3.x.'],
    ['root cause', 'the real, original reason', 'The root cause is that the database is not running.'],
    ['minimal reproducible example (repro)', 'the smallest code that shows the bug', 'Could you share a minimal repro?'],
    ['in favour of', 'replaced by (the thing to use instead)', 'setHeader() is deprecated in favour of the headers option.'],
  ] : [
    ['workaround', 'cách lách tạm thời', 'As a workaround, set connectTimeoutMs to 30000.'],
    ['breaking change', 'thay đổi làm code cũ hết chạy', 'Version 3.0 contains three breaking changes.'],
    ['regression', 'lỗi ở thứ trước đây vẫn chạy', 'This is a regression introduced in 2.3.0.'],
    ['to backport', 'đưa bản sửa về nhánh phát hành cũ', 'The fix will be backported to 2.3.x.'],
    ['root cause', 'nguyên nhân gốc', 'The root cause is that the database is not running.'],
    ['minimal reproducible example (repro)', 'đoạn code nhỏ nhất tái hiện được lỗi', 'Could you share a minimal repro?'],
    ['in favour of', 'được thay bằng (thứ nên dùng)', 'setHeader() is deprecated in favour of the headers option.'],
  ], en)}

<h3>🧪 ${en ? 'Practice (15 minutes)' : 'Thực hành (15 phút)'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'In the issue thread above: which comment do you act on today, and which one tells you when you can remove it? Quote the lines.' : 'Trong luồng issue trên: bình luận nào bạn làm theo ngay hôm nay, bình luận nào cho biết khi nào được gỡ nó? Trích đúng dòng.'}</li>
<li>${en ? 'Open github.com/spring-projects/spring-boot/releases. Choose the latest release of the version line your project uses. Write a 5-line summary for your team, in the style of the model answer: what kind of release, anything that breaks, anything that affects you, recommendation.' : 'Mở github.com/spring-projects/spring-boot/releases. Chọn bản mới nhất của dòng phiên bản dự án bạn đang dùng. Viết tóm tắt 5 dòng cho nhóm, theo kiểu đáp án mẫu: loại bản phát hành, có gì phá vỡ, có gì ảnh hưởng mình, khuyến nghị.'}</li>
<li>${en ? 'Take the last error that annoyed you in your own project. Write: the pattern it matches (table above), the root cause line, and one sentence you would post in the team chat.' : 'Lấy lỗi gần nhất làm bạn bực trong dự án của mình. Ghi: nó khớp mẫu nào (bảng trên), dòng nguyên nhân gốc, và một câu bạn sẽ đăng vào chat nhóm.'}</li>
</ol>
<details><summary>${en ? 'Answer for 1' : 'Đáp án câu 1'}</summary><p>${en ? 'Act on: "As a workaround, set connectTimeoutMs to 30000 until the fix is released." Remove it after: "The fix will be backported to 2.3.x and released in 2.3.1." — so upgrade to 2.3.1 and delete the workaround. Ignore "+1", "Any update?" and "switch to axios".' : 'Làm theo: "As a workaround, set connectTimeoutMs to 30000 until the fix is released." Gỡ khi: "The fix will be backported to 2.3.x and released in 2.3.1." — tức là nâng lên 2.3.1 rồi xoá cách tạm. Bỏ qua "+1", "Any update?" và "switch to axios".'}</p></details>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'your release summary fits in 5 lines, names every breaking change (or says "none"), and ends with a recommendation; your chat sentence contains the root-cause line and what you already tried.' : 'tóm tắt release vừa 5 dòng, nêu đủ mọi breaking change (hoặc ghi "none"), và kết bằng một khuyến nghị; câu chat có dòng nguyên nhân gốc và điều bạn đã thử.'}</p></div>

<a class="link-card lien-ket-cheo" href="/courses/debug-co-phuong-phap">
  <span class="lc-ico">🐞</span>
  <span class="lc-body"><span class="lc-title">${en ? 'Debugging with a method' : 'Debug có phương pháp'}</span><span class="lc-sub">${en ? 'How to find the root cause step by step; this lesson only covers reading the English around it.' : 'Cách tìm nguyên nhân gốc từng bước; bài này chỉ lo phần đọc tiếng Anh quanh nó.'}</span></span>
</a>
</div>
`;

/* ═════════════ 1.3 — Spec, RFC 2119, chỗ mơ hồ ═════════════ */
const MAU_BCP14 = mau(`
The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT",
"RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted
as described in BCP 14 [RFC2119] [RFC8174] when, and only when, they appear in all capitals,
as shown here.
`, 'Câu khai báo chuẩn theo RFC 8174 — nhiều đặc tả, API và tài liệu giao tiếp hệ thống mở đầu bằng đúng câu này.');

const MAU_SPEC = mau(`
LabFlow — Software Requirements Specification
4.3 Equipment reservation                                                     v0.9 (draft)

4.3.1 A member MUST be logged in to reserve equipment.
4.3.2 A member can reserve up to 3 items at the same time.
4.3.3 The reservation period MUST NOT exceed 7 days.
4.3.4 The system should send a reminder before the due date.
4.3.5 Reservations are approved by the lab manager. Basically, approval is required
      within 2 days.
4.3.6 When an item is overdue, it will be displayed in red and the member's account
      will be restricted.
4.3.7 The reservation list MAY be exported (CSV, Excel, etc.).
4.3.8 The search must be fast and user-friendly.
4.3.9 Please be noted that cancelled reservations are handled as same as before.
`, 'Spec mẫu dựng cho bài (dự án LabFlow), cố ý cài chỗ mơ hồ — giống bản nháp thật khách hay gửi.');

const L13 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 1 · Reading' : 'Chương 1 · Đọc'}</span>
<h2>${en ? '1.3 — Specs and requirements in English: RFC 2119 words, acceptance criteria, ambiguity' : '1.3 — Spec và yêu cầu bằng tiếng Anh: từ của RFC 2119, tiêu chí chấp nhận, chỗ mơ hồ'}</h2>
<p class="lead">${en
    ? 'A spec is a contract. When the client says "the system did not do what we wrote", the conversation goes back to the exact words — and a single word like <em>should</em> decides whether the work is a bug fix (free) or a change request (paid, planned). This lesson teaches the five words engineers use to say how strong a requirement is, and how to read a spec looking for the places where two people could understand it differently.'
    : 'Spec là một hợp đồng. Khi khách nói "hệ thống không làm đúng như chúng tôi viết", cuộc nói chuyện quay về đúng từng chữ — và chỉ một chữ như <em>should</em> quyết định việc đó là sửa lỗi (miễn phí) hay change request (tính tiền, lên kế hoạch lại). Bài này dạy năm từ kỹ sư dùng để nói một yêu cầu mạnh tới đâu, và cách đọc spec để săn những chỗ hai người có thể hiểu khác nhau.'}</p>

<h3>${en ? 'RFC 2119: five words with exact meanings' : 'RFC 2119: năm từ có nghĩa chính xác'}</h3>
<p>${en
    ? 'RFC 2119 (Scott Bradner, March 1997, also called BCP 14) is a two-page document that defines these key words for internet standards. Today they are used far beyond the IETF: in API specs, security standards, interface agreements between companies and many client specs. The definitions, quoted from the RFC:'
    : 'RFC 2119 (Scott Bradner, tháng 3/1997, còn gọi là BCP 14) là văn bản dài hai trang định nghĩa các từ khoá này cho chuẩn Internet. Ngày nay chúng được dùng rộng hơn IETF nhiều: trong spec API, chuẩn bảo mật, thoả thuận giao tiếp giữa các công ty và nhiều spec của khách. Định nghĩa, trích từ RFC:'}</p>
<table>
<thead><tr><th>${en ? 'Key word (synonyms)' : 'Từ khoá (từ đồng nghĩa)'}</th><th>${en ? 'RFC 2119 definition' : 'Định nghĩa trong RFC 2119'}</th><th>${en ? 'What it means for your work' : 'Nghĩa với công việc của bạn'}</th></tr></thead>
<tbody>
<tr><td><strong>MUST</strong> (REQUIRED, SHALL)</td><td><em>"an absolute requirement of the specification"</em></td><td>${en ? 'Not doing it = a bug. Write a test for it.' : 'Không làm = bug. Viết test cho nó.'}</td></tr>
<tr><td><strong>MUST NOT</strong> (SHALL NOT)</td><td><em>"an absolute prohibition of the specification"</em></td><td>${en ? 'Doing it = a bug. Test that it cannot happen.' : 'Làm = bug. Test rằng nó không thể xảy ra.'}</td></tr>
<tr><td><strong>SHOULD</strong> (RECOMMENDED)</td><td><em>"there may exist valid reasons in particular circumstances to ignore a particular item, but the full implications must be understood and carefully weighed before choosing a different course"</em></td><td>${en ? 'Do it by default. Skipping it needs a reason that someone agreed to <strong>in writing</strong>.' : 'Mặc định là làm. Muốn bỏ thì cần lý do và có người đồng ý <strong>bằng văn bản</strong>.'}</td></tr>
<tr><td><strong>SHOULD NOT</strong> (NOT RECOMMENDED)</td><td><em>"there may exist valid reasons in particular circumstances when the particular behavior is acceptable or even useful, but the full implications should be understood and the case carefully weighed"</em></td><td>${en ? 'Avoid by default; same rule as SHOULD, reversed.' : 'Mặc định là tránh; luật giống SHOULD, theo chiều ngược.'}</td></tr>
<tr><td><strong>MAY</strong> (OPTIONAL)</td><td><em>"an item is truly optional"</em></td><td>${en ? 'Your choice. But other systems must still work whether you do it or not.' : 'Tuỳ bạn. Nhưng hệ thống khác vẫn phải chạy được dù bạn làm hay không.'}</td></tr>
</tbody>
</table>
<div class="callout warn"><p>${en
    ? '<strong>SHOULD is not "nice to have".</strong> This is the single most common misreading by Vietnamese developers, because "nên" in Vietnamese sounds optional. In RFC 2119, SHOULD is much closer to MUST than to MAY: it is a requirement with an escape door, and opening the door is a decision you must document. The intern in the "Start here" lesson lost two days on exactly this.'
    : '<strong>SHOULD không phải "có thì tốt".</strong> Đây là chỗ dev Việt đọc sai nhiều nhất, vì chữ "nên" trong tiếng Việt nghe như tuỳ ý. Trong RFC 2119, SHOULD gần MUST hơn nhiều so với MAY: nó là yêu cầu có một cửa thoát, và mở cửa đó là một quyết định phải ghi lại. Bạn thực tập sinh ở bài "Bắt đầu tại đây" mất hai ngày vì đúng chữ này.'}</p></div>

<h3>${en ? 'Capitals matter — RFC 8174' : 'Viết hoa mới tính — RFC 8174'}</h3>
${MAU_BCP14}
<p>${en
    ? 'RFC 8174 (2017) clarified that only the <strong>UPPERCASE</strong> words carry the special meaning. "The system must…" in lowercase is ordinary English. In practice: if a spec contains that declaration, read capitals strictly. If it does not (most client specs), lowercase "should", "must", "will", "can" are <strong>unclear by default</strong> — put them in the Q&amp;A list when the difference matters.'
    : 'RFC 8174 (2017) làm rõ: chỉ các từ <strong>VIẾT HOA</strong> mới mang nghĩa đặc biệt. "The system must…" viết thường là tiếng Anh bình thường. Thực tế: spec có câu khai báo trên thì đọc chữ hoa thật chặt. Không có (đa số spec của khách) thì "should", "must", "will", "can" viết thường <strong>mặc định là chưa rõ</strong> — đưa vào Q&amp;A list khi khác biệt đó quan trọng.'}</p>
<table>
<thead><tr><th>${en ? 'Other words in specs' : 'Các chữ khác trong spec'}</th><th>${en ? 'Usual reading' : 'Cách hiểu thường gặp'}</th></tr></thead>
<tbody>
<tr><td>will / is displayed / is sent</td><td>${en ? 'describes expected behaviour; usually treated as required' : 'mô tả hành vi mong đợi; thường coi là bắt buộc'}</td></tr>
<tr><td>can / is able to</td><td>${en ? 'the user is allowed to — but must the system support it now? Often unclear' : 'người dùng được phép — nhưng hệ thống có phải hỗ trợ ngay không? Hay mơ hồ'}</td></tr>
<tr><td>need to / is required to / has to</td><td>${en ? 'required' : 'bắt buộc'}</td></tr>
<tr><td>it is preferable / ideally / if possible</td><td>${en ? 'SHOULD or MAY — ask which' : 'SHOULD hay MAY — hỏi lại'}</td></tr>
<tr><td>TBD / TBC</td><td>${en ? 'to be decided / to be confirmed — not ready; do not build it yet' : 'chưa quyết / chưa xác nhận — chưa sẵn sàng; chưa làm'}</td></tr>
</tbody>
</table>

<h3>${en ? 'Acceptance criteria: the testable part' : 'Tiêu chí chấp nhận: phần kiểm được'}</h3>
<p>${en
    ? 'A good requirement ends in <strong>acceptance criteria</strong> — conditions that are either true or false. The most common format is <em>Given / When / Then</em> (Chapter 2 teaches you to write them):'
    : 'Một yêu cầu tốt kết thúc bằng <strong>acceptance criteria</strong> (tiêu chí chấp nhận) — các điều kiện chỉ có đúng hoặc sai. Dạng phổ biến nhất là <em>Given / When / Then</em> (Chương 2 dạy viết):'}</p>
${mau(`
Given a member who already has 3 active reservations
When they try to reserve a 4th item
Then the reservation is rejected with the message "You can reserve at most 3 items at a time."
`)}
<p>${en ? 'Reading tip: for each requirement, ask yourself "how would I test this?". If you cannot write a Given/When/Then for it, the requirement is ambiguous.' : 'Mẹo đọc: với mỗi yêu cầu, tự hỏi "mình sẽ test câu này thế nào?". Không viết nổi Given/When/Then cho nó thì yêu cầu đó đang mơ hồ.'}</p>

<h3>${en ? 'Ten ambiguity signals' : 'Mười dấu hiệu mơ hồ'}</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">${en ? '1. Vague adjectives' : '1. Tính từ chung chung'}</span><span class="v">fast, user-friendly, appropriate, large, modern, secure — ${en ? 'ask for a number or an example.' : 'xin một con số hoặc ví dụ.'}</span></div>
  <div class="kv"><span class="k">${en ? '2. Open lists' : '2. Danh sách bỏ ngỏ'}</span><span class="v">etc., and so on, such as — ${en ? 'which items exactly?' : 'chính xác những mục nào?'}</span></div>
  <div class="kv"><span class="k">${en ? '3. Boundaries' : '3. Biên'}</span><span class="v">up to, within, more than, between 1 and 7 — ${en ? 'inclusive or not? 7 days = 168 hours or 7 calendar dates?' : 'có tính biên không? 7 ngày = 168 giờ hay 7 ngày lịch?'}</span></div>
  <div class="kv"><span class="k">${en ? '4. Passive without a doer' : '4. Bị động không có chủ thể'}</span><span class="v">"is approved", "is validated", "will be notified" — ${en ? 'by whom? by what? when?' : 'ai làm? hệ thống nào? lúc nào?'}</span></div>
  <div class="kv"><span class="k">${en ? '5. Numbers without units, times without zones' : '5. Số không đơn vị, giờ không múi giờ'}</span><span class="v">"timeout 30", "before 9:00" — ${en ? 'seconds? JST or ICT? (Mars Climate Orbiter, lesson 0.9).' : 'giây? JST hay ICT? (Mars Climate Orbiter, bài 0.9).'}</span></div>
  <div class="kv"><span class="k">${en ? '6. "and/or", "or"' : '6. "and/or", "or"'}</span><span class="v">${en ? 'both, either, or exactly one?' : 'cả hai, một trong hai, hay đúng một?'}</span></div>
  <div class="kv"><span class="k">${en ? '7. Unclear pronouns' : '7. Đại từ không rõ'}</span><span class="v">it, this, they — ${en ? 'which noun do they point to?' : 'trỏ về danh từ nào?'}</span></div>
  <div class="kv"><span class="k">${en ? '8. "same as before / as is"' : '8. "same as before / as is"'}</span><span class="v">${en ? 'before what? the old system, the last version, the prototype?' : 'trước là trước cái gì? hệ thống cũ, bản trước, bản prototype?'}</span></div>
  <div class="kv"><span class="k">${en ? '9. Missing error cases' : '9. Thiếu trường hợp lỗi'}</span><span class="v">${en ? 'what happens when it fails, is empty, is duplicated, times out?' : 'khi lỗi, rỗng, trùng, quá thời gian thì sao?'}</span></div>
  <div class="kv"><span class="k">${en ? '10. Lowercase "should"' : '10. "should" viết thường'}</span><span class="v">${en ? 'required in this release, or optional?' : 'bắt buộc trong bản này hay tuỳ chọn?'}</span></div>
</div>

<h3>${en ? 'English written by Japanese clients' : 'Tiếng Anh do khách Nhật viết'}</h3>
<p>${en
    ? 'Many FPT Software projects are for Japanese clients, and their specs are often translated from Japanese — sometimes by people, sometimes by tools. Some patterns appear often. They are not "bad English"; they are a dialect you learn to decode. Treat these as tendencies to check, not rules.'
    : 'Nhiều dự án FPT Software làm cho khách Nhật, và spec thường được dịch từ tiếng Nhật — khi do người dịch, khi do công cụ. Một số mẫu hay xuất hiện. Đó không phải "tiếng Anh dở"; đó là một phương ngữ bạn học cách giải mã. Coi chúng là xu hướng cần kiểm, không phải luật.'}</p>
<table>
<thead><tr><th>${en ? 'You read' : 'Bạn đọc thấy'}</th><th>${en ? 'Often means' : 'Thường có nghĩa'}</th><th>${en ? 'What to do' : 'Nên làm gì'}</th></tr></thead>
<tbody>
<tr><td>Please confirm …</td><td>${en ? '"please check / review" (確認), not only "say yes"' : '"hãy kiểm tra / xem lại" (確認), không chỉ "hãy nói có"'}</td><td>${en ? 'Check it and report what you found.' : 'Kiểm rồi báo lại bạn thấy gì.'}</td></tr>
<tr><td>Basically, …</td><td>${en ? '"as a rule, but exceptions exist" (基本的に)' : '"về nguyên tắc, nhưng có ngoại lệ" (基本的に)'}</td><td>${en ? 'Ask: "What are the exceptions?"' : 'Hỏi: "What are the exceptions?"'}</td></tr>
<tr><td>We will consider it.</td><td>${en ? 'may be a polite "probably not" (検討します)' : 'có thể là lời "chắc là không" lịch sự (検討します)'}</td><td>${en ? 'Do not build it; ask for a decision date.' : 'Đừng làm; hỏi ngày có quyết định.'}</td></tr>
<tr><td>Please be noted that …</td><td>${en ? '"Please note that …" — important information follows' : '"Please note that …" — sau đó là thông tin quan trọng'}</td><td>${en ? 'Read the next sentence twice.' : 'Đọc câu sau hai lần.'}</td></tr>
<tr><td>as is / same as before / as current</td><td>${en ? 'keep the current behaviour (現状通り)' : 'giữ hành vi hiện tại (現状通り)'}</td><td>${en ? 'Ask which system/version is "current".' : 'Hỏi hệ thống / phiên bản nào là "hiện tại".'}</td></tr>
<tr><td>${en ? 'Long sentences with 3–4 conditions, many passives' : 'Câu dài 3–4 điều kiện, nhiều bị động'}</td><td>${en ? 'several rules packed into one' : 'nhiều luật nén vào một câu'}</td><td>${en ? 'Split it into a numbered list and send it back: "We understand it as: 1… 2… 3… Is that correct?"' : 'Tách thành danh sách đánh số rồi gửi lại: "We understand it as: 1… 2… 3… Is that correct?"'}</td></tr>
</tbody>
</table>

<h3>${en ? 'Read a real-style spec' : 'Đọc một spec kiểu thật'}</h3>
${MAU_SPEC}
<p>${en ? 'Before you open the answer, mark every ambiguity you can find. There are at least eight.' : 'Trước khi mở đáp án, đánh dấu mọi chỗ mơ hồ bạn tìm được. Có ít nhất tám chỗ.'}</p>
<details><summary>${en ? 'Ambiguities and the question to send' : 'Các chỗ mơ hồ và câu hỏi nên gửi'}</summary>
<ol>
<li><strong>4.3.2 "can"</strong> — ${en ? 'is the limit of 3 enforced (MUST), or is it a guideline? "At the same time" = active reservations only, or also pending ones?' : 'giới hạn 3 có bị chặn cứng (MUST) không, hay chỉ là hướng dẫn? "At the same time" = chỉ tính đơn đang hiệu lực, hay cả đơn đang chờ duyệt?'} <em>"Should the system block a 4th reservation? Do pending reservations count toward the limit of 3?"</em></li>
<li><strong>4.3.3 "7 days"</strong> — ${en ? 'calendar days or working days? Is day 7 allowed (inclusive)?' : 'ngày lịch hay ngày làm việc? Ngày thứ 7 có được tính (bao gồm biên) không?'}</li>
<li><strong>4.3.4 "should … a reminder before the due date"</strong> — ${en ? 'required in this release? How long before? By email, in-app, or both?' : 'có bắt buộc trong bản này không? Trước bao lâu? Qua email, trong app, hay cả hai?'}</li>
<li><strong>4.3.5 "are approved"</strong> — ${en ? 'passive: what happens if the manager does nothing? "Basically … within 2 days": what are the exceptions, and does the system enforce it (auto-cancel?)' : 'bị động: nếu quản lý không làm gì thì sao? "Basically … within 2 days": ngoại lệ là gì, hệ thống có ép không (tự huỷ?)'}</li>
<li><strong>4.3.6 "restricted"</strong> — ${en ? 'restricted from what — new reservations only, or login? Until when?' : 'bị hạn chế cái gì — chỉ không được đặt mới, hay không được đăng nhập? Tới khi nào?'}</li>
<li><strong>4.3.6 "displayed in red"</strong> — ${en ? 'red where — the list, the detail page, the manager\'s dashboard? (also: colour alone is an accessibility issue)' : 'màu đỏ ở đâu — danh sách, trang chi tiết, dashboard của quản lý? (và chỉ dùng màu là vấn đề trợ năng)'}</li>
<li><strong>4.3.7 "CSV, Excel, etc."</strong> — ${en ? 'which formats exactly in this release? MAY = are we expected to build it at all?' : 'chính xác những định dạng nào trong bản này? MAY = có cần làm không?'}</li>
<li><strong>4.3.8 "fast and user-friendly"</strong> — ${en ? 'ask for a measurable target: e.g. "results within 1 second for 10,000 items?"' : 'xin mục tiêu đo được: ví dụ "kết quả trong 1 giây với 10.000 bản ghi?"'}</li>
<li><strong>4.3.9 "as same as before"</strong> — ${en ? 'before = the old Excel process, or the previous version of LabFlow? What exactly happens to a cancelled reservation?' : 'trước = quy trình Excel cũ, hay bản LabFlow trước? Đơn bị huỷ chính xác xử lý ra sao?'}</li>
<li><strong>${en ? 'Header "v0.9 (draft)"' : 'Đầu trang "v0.9 (draft)"'}</strong> — ${en ? 'when is it final? Which version is the contract?' : 'khi nào thành bản chính thức? Bản nào là căn cứ hợp đồng?'}</li>
</ol></details>

<h3>${en ? 'Mistakes Vietnamese developers make' : 'Lỗi dev Việt hay mắc'}</h3>
${saiDung([
    [en ? 'Reading SHOULD as "optional"' : 'Đọc SHOULD thành "tuỳ chọn"', en ? 'SHOULD = do it unless there is an agreed reason not to' : 'SHOULD = làm, trừ khi có lý do đã được đồng ý', en ? 'RFC 2119 definition.' : 'Định nghĩa RFC 2119.'],
    [en ? 'Choosing an interpretation silently' : 'Tự chọn một cách hiểu mà không nói', 'We understand 4.3.3 as 7 calendar days, inclusive. Is that correct?', en ? 'If you must assume, write the assumption down and send it.' : 'Buộc phải giả định thì ghi giả định ra và gửi đi.'],
    [en ? 'Asking "What does 4.3.6 mean?"' : 'Hỏi "4.3.6 nghĩa là gì?"', 'For 4.3.6, should a restricted member still be able to log in and return items?', en ? 'A closed, specific question gets a fast answer (Chapter 5).' : 'Câu hỏi đóng, cụ thể được trả lời nhanh (Chương 5).'],
    [en ? 'Translating the spec into Vietnamese and working from the translation' : 'Dịch spec sang tiếng Việt rồi làm theo bản dịch', en ? 'Keep the English original as the reference; add notes beside it' : 'Giữ bản tiếng Anh làm căn cứ; ghi chú bên cạnh', en ? 'Translation hides exactly the words (should/can/basically) that need questions.' : 'Bản dịch che đúng những chữ (should/can/basically) cần đặt câu hỏi.'],
  ], en)}

${tuVung(en ? [
    ['requirement', 'something the system must do or be', 'This requirement is not testable yet.'],
    ['acceptance criteria', 'true/false conditions for accepting the work', 'Could you add acceptance criteria to 4.3.4?'],
    ['ambiguous / ambiguity', 'can be understood in more than one way', '4.3.3 is ambiguous: calendar or working days?'],
    ['inclusive / exclusive', 'including / not including the boundary', 'Is the 7-day limit inclusive?'],
    ['to enforce', 'to make the system block what is not allowed', 'Should the system enforce the limit of 3?'],
    ['assumption', 'something you treat as true without confirmation', 'Our assumption is that pending reservations do not count.'],
    ['out of scope', 'not part of the agreed work', 'Excel export is out of scope for this release.'],
  ] : [
    ['requirement', 'yêu cầu', 'This requirement is not testable yet.'],
    ['acceptance criteria', 'tiêu chí chấp nhận (đúng/sai)', 'Could you add acceptance criteria to 4.3.4?'],
    ['ambiguous / ambiguity', 'mơ hồ / chỗ mơ hồ', '4.3.3 is ambiguous: calendar or working days?'],
    ['inclusive / exclusive', 'tính / không tính biên', 'Is the 7-day limit inclusive?'],
    ['to enforce', 'cho hệ thống chặn cứng điều không được phép', 'Should the system enforce the limit of 3?'],
    ['assumption', 'giả định', 'Our assumption is that pending reservations do not count.'],
    ['out of scope', 'ngoài phạm vi', 'Excel export is out of scope for this release.'],
  ], en)}

<h3>🧪 ${en ? 'Practice (20 minutes)' : 'Thực hành (20 phút)'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Classify each line of the LabFlow spec as MUST / MUST NOT / SHOULD / MAY / unclear.' : 'Xếp từng dòng của spec LabFlow vào MUST / MUST NOT / SHOULD / MAY / chưa rõ.'}</li>
<li>${en ? 'Choose 5 ambiguities and write each as one closed English question with your proposed answer, in the form <em>"For 4.3.x, we assume … . Is that correct?"</em>' : 'Chọn 5 chỗ mơ hồ, viết mỗi chỗ thành một câu hỏi đóng bằng tiếng Anh kèm đề xuất của bạn, theo dạng <em>"For 4.3.x, we assume … . Is that correct?"</em>'}</li>
<li>${en ? 'Rewrite 4.3.3 and 4.3.8 so they are testable, and add one Given/When/Then for each.' : 'Viết lại 4.3.3 và 4.3.8 cho kiểm được, kèm một Given/When/Then cho mỗi câu.'}</li>
</ol>
<details><summary>${en ? 'Model answer for 3' : 'Đáp án gợi ý câu 3'}</summary>
${mau(`
4.3.3 The reservation period MUST NOT exceed 7 calendar days, counted from the start date
      (the end date is at most start date + 7 days, inclusive).
  Given a reservation starting on 2026-12-01
  When the member selects 2026-12-09 as the end date
  Then the system rejects it with "The maximum reservation period is 7 days."

4.3.8 Search results MUST be displayed within 1 second for up to 10,000 items.
  Given 10,000 equipment items
  When a member searches for "oscilloscope"
  Then the results are displayed within 1 second
`)}
</details>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'every one of your 5 questions can be answered with "yes", "no" or a choice; each contains the spec number; and your rewritten requirements could be tested by someone who never talked to you.' : 'cả 5 câu hỏi đều trả lời được bằng "yes", "no" hoặc một lựa chọn; câu nào cũng có số mục spec; và yêu cầu bạn viết lại thì một người chưa từng nói chuyện với bạn cũng test được.'}</p></div>

<a class="link-card lien-ket-cheo" href="/courses/agile-teamwork">
  <span class="lc-ico">🤝</span>
  <span class="lc-body"><span class="lc-title">${en ? 'Agile &amp; Teamwork — requirements and the outsourcing process' : 'Agile &amp; Làm việc nhóm — yêu cầu và quy trình outsourcing'}</span><span class="lc-sub">${en ? 'Who owns the spec, who answers questions, how a change request is approved.' : 'Ai giữ spec, ai trả lời câu hỏi, change request được duyệt thế nào.'}</span></span>
</a>
</div>
`;

/* ═════════════ 1.4 — Lab chương 1 ═════════════ */
const LAB_README = mau(`
# labflow-notify

Sends email and in-app notifications for LabFlow (reminders, approvals, overdue alerts).

## Requirements
- Java 21. Redis 7+ is required in production; for local development an in-memory queue
  is used unless NOTIFY_QUEUE=redis is set.

## Configuration
| Variable          | Default | Description                                                    |
|-------------------|---------|----------------------------------------------------------------|
| NOTIFY_SMTP_HOST  | (none)  | Required. Emails are NOT sent if missing; they are logged only. |
| NOTIFY_BATCH_SIZE | 50      | Max emails per minute. Values above 200 are ignored.           |
| NOTIFY_QUIET_HOURS| 22-07   | No emails are sent during these hours (server time, UTC).      |

## Known limitations
- In-app notifications are not delivered to users who are offline for more than 30 days.
- Attachments are not supported yet (planned for 1.4).
`);

const LAB_ISSUE = mau(`
#77  Members receive the same reminder email twice            [bug] [needs-triage]

@qa-thu        Since yesterday's deploy, some members get every reminder twice, about 1 minute apart.
               Not all members — maybe 10%? Staging, build #340.
@dev-khoa      Can't reproduce locally.
@qa-thu        It only happens on staging, which runs 2 instances of notify.
@dev-khoa      Ah. Each instance runs the scheduler, so both send. Locally I only run one.
@lead-hanh     [Member] Correct. Short term: set NOTIFY_SCHEDULER_ENABLED=false on instance 2.
               Proper fix: use a distributed lock (ShedLock) so only one instance runs the job.
               @dev-khoa please create a ticket for the proper fix, target sprint 14.
@dev-minh      Should we also dedupe by (memberId, reminderType, date)?
@lead-hanh     [Member] Good idea as a safety net, but not required for sprint 14.
               — lead-hanh added the label status: workaround-applied
`);

const LAB_SPEC = mau(`
5.2 Password reset

5.2.1 A user MUST be able to request a password reset from the login page by entering
      their email address.
5.2.2 The system MUST NOT reveal whether the email address is registered. The same
      message is displayed in both cases.
5.2.3 The reset link MUST expire 30 minutes after it is sent and MUST be usable only once.
5.2.4 The new password SHOULD be checked against a list of commonly used passwords.
5.2.5 After a successful reset, all other sessions of the user MAY be signed out.
5.2.6 Reset requests are limited to 5 per hour per email address. Additional requests
      are ignored silently.
`);

const L14 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 1 · Lab' : 'Chương 1 · Lab'}</span>
<h2>${en ? '1.4 — Lab: summarise a README, an issue thread and a spec' : '1.4 — Lab: tóm tắt một README, một luồng issue và một spec'}</h2>
<p class="lead">${en
    ? 'Three short texts of the kind you will meet in your first week. For each one, your lead asks for a summary in English that the team can read in 30 seconds. Time limit: 60 minutes in total. Work only from the texts — the point is to read precisely, not to look things up.'
    : 'Ba đoạn văn ngắn kiểu bạn sẽ gặp ngay tuần đầu. Với mỗi đoạn, trưởng nhóm cần một bản tóm tắt bằng tiếng Anh cả nhóm đọc trong 30 giây. Giới hạn: tổng 60 phút. Chỉ dựa vào văn bản — mục đích là đọc chính xác, không phải đi tra cứu.'}</p>
<p class="note-ct">${en ? 'All three texts are written for this lab in the style of real ones (LabFlow is the sample project of this site).' : 'Cả ba văn bản được dựng cho bài lab theo văn phong thật (LabFlow là dự án mẫu của trang).'}</p>

<h3>${en ? 'Task 1 — README (15 minutes)' : 'Bài 1 — README (15 phút)'}</h3>
${LAB_README}
<p>${en ? 'Write a "things that will surprise you" note of <strong>at most 5 bullet points</strong> for a new teammate who will run this service locally and then deploy it.' : 'Viết ghi chú "những thứ sẽ làm bạn bất ngờ" <strong>tối đa 5 gạch đầu dòng</strong> cho một đồng đội mới sắp chạy dịch vụ này ở máy rồi deploy.'}</p>
<details><summary>${en ? 'Model answer' : 'Đáp án gợi ý'}</summary>
${mau(`
- Locally, no Redis is needed: an in-memory queue is used unless NOTIFY_QUEUE=redis.
  In production Redis 7+ is required.
- Without NOTIFY_SMTP_HOST, emails are only logged, not sent — check this first if "no email arrives".
- Max 50 emails/minute by default; values above 200 are ignored (no error).
- Quiet hours 22-07 are in UTC = 05:00-14:00 in Vietnam (ICT). Emails "missing" during
  our working morning may be held, not lost.
- No attachments yet (planned 1.4); users offline > 30 days do not get in-app notifications.
`)}
</details>

<h3>${en ? 'Task 2 — Issue thread (15 minutes)' : 'Bài 2 — Luồng issue (15 phút)'}</h3>
${LAB_ISSUE}
<p>${en ? 'Write a summary with exactly four lines: <strong>Problem · Root cause · Current workaround · Next action (who, when)</strong>.' : 'Viết tóm tắt đúng bốn dòng: <strong>Problem · Root cause · Current workaround · Next action (who, when)</strong>.'}</p>
<details><summary>${en ? 'Model answer' : 'Đáp án gợi ý'}</summary>
${mau(`
Problem:     Since build #340, some members receive each reminder email twice (staging).
Root cause:  Staging runs 2 notify instances and both run the scheduler.
Workaround:  NOTIFY_SCHEDULER_ENABLED=false on instance 2 (applied).
Next action: Khoa creates a ticket for a distributed lock (ShedLock), target sprint 14.
             Deduplication is optional, not required for sprint 14.
`)}
<p>${en ? 'Typical errors: writing "cannot reproduce" as the root cause (it was only a step); listing dedupe as required (the lead said "not required"); missing who owns the next action.' : 'Lỗi hay gặp: ghi "cannot reproduce" là nguyên nhân (đó chỉ là một bước); ghi dedupe là bắt buộc (trưởng nhóm nói "not required"); thiếu người chịu trách nhiệm việc tiếp theo.'}</p>
</details>

<h3>${en ? 'Task 3 — Spec (25 minutes)' : 'Bài 3 — Spec (25 phút)'}</h3>
${LAB_SPEC}
<ol>
<li>${en ? 'Make a table: requirement number · strength (MUST / MUST NOT / SHOULD / MAY / unclear) · one-line summary.' : 'Lập bảng: số mục · độ mạnh (MUST / MUST NOT / SHOULD / MAY / chưa rõ) · tóm tắt một dòng.'}</li>
<li>${en ? 'Write the <strong>three conditions you could easily forget</strong> while coding.' : 'Viết <strong>ba điều kiện dễ quên nhất</strong> khi code.'}</li>
<li>${en ? 'Write two closed questions for the client about the unclear parts.' : 'Viết hai câu hỏi đóng gửi khách về những chỗ chưa rõ.'}</li>
</ol>
<details><summary>${en ? 'Model answer' : 'Đáp án gợi ý'}</summary>
<table>
<thead><tr><th>#</th><th>${en ? 'Strength' : 'Độ mạnh'}</th><th>${en ? 'Summary' : 'Tóm tắt'}</th></tr></thead>
<tbody>
<tr><td>5.2.1</td><td>MUST</td><td>Reset is requested from the login page with an email.</td></tr>
<tr><td>5.2.2</td><td>MUST NOT</td><td>Never reveal whether the email exists — same message for both cases.</td></tr>
<tr><td>5.2.3</td><td>MUST (×2)</td><td>Link expires after 30 min AND works only once.</td></tr>
<tr><td>5.2.4</td><td>SHOULD</td><td>Check new password against common passwords (do it unless agreed otherwise).</td></tr>
<tr><td>5.2.5</td><td>MAY</td><td>Signing out other sessions is optional.</td></tr>
<tr><td>5.2.6</td><td>${en ? 'unclear (no key word)' : 'chưa rõ (không có từ khoá)'}</td><td>5 requests/hour/email; extra requests ignored silently.</td></tr>
</tbody>
</table>
<p><strong>${en ? 'Easy to forget:' : 'Dễ quên:'}</strong> ${en ? '(1) the "only once" half of 5.2.3; (2) 5.2.2 also applies to error messages and response time — a different message or a much slower response for a registered email reveals it; (3) 5.2.6 says "silently": the user still sees the normal success message, otherwise 5.2.2 is broken.' : '(1) nửa "chỉ dùng một lần" của 5.2.3; (2) 5.2.2 áp cả cho thông báo lỗi lẫn thời gian phản hồi — thông báo khác hoặc phản hồi chậm hẳn với email đã đăng ký là đã để lộ; (3) 5.2.6 ghi "silently": người dùng vẫn thấy thông báo thành công bình thường, không thì vi phạm 5.2.2.'}</p>
${mau(`
Q1. For 5.2.6, is the limit of 5 per hour a requirement for this release (MUST)?
    We assume yes, using a sliding 60-minute window. Is that correct?
Q2. For 5.2.5, we propose to sign out all other sessions after a reset, because it protects
    users whose password was stolen. Do you agree, or should we keep the other sessions?
`)}
</details>

<h3>${en ? 'Self-grading rubric (10 points)' : 'Rubric tự chấm (10 điểm)'}</h3>
<table>
<thead><tr><th>${en ? 'Criterion' : 'Tiêu chí'}</th><th>${en ? 'Points' : 'Điểm'}</th></tr></thead>
<tbody>
<tr><td>${en ? 'Task 1 mentions the SMTP "logged only" trap and the UTC quiet hours' : 'Bài 1 nêu bẫy SMTP "chỉ ghi log" và giờ yên lặng theo UTC'}</td><td>2</td></tr>
<tr><td>${en ? 'Task 2: correct root cause and the owner of the next action' : 'Bài 2: đúng nguyên nhân gốc và người phụ trách việc tiếp theo'}</td><td>2</td></tr>
<tr><td>${en ? 'Task 2: dedupe correctly marked as optional' : 'Bài 2: dedupe được ghi đúng là tuỳ chọn'}</td><td>1</td></tr>
<tr><td>${en ? 'Task 3: all six strengths correct (5.2.6 marked unclear)' : 'Bài 3: đúng cả sáu độ mạnh (5.2.6 ghi là chưa rõ)'}</td><td>2</td></tr>
<tr><td>${en ? 'Task 3: at least two of the three easy-to-forget conditions' : 'Bài 3: có ít nhất hai trong ba điều kiện dễ quên'}</td><td>1</td></tr>
<tr><td>${en ? 'Questions are closed, numbered, contain a proposal' : 'Câu hỏi là câu đóng, có đánh số, có đề xuất'}</td><td>1</td></tr>
<tr><td>${en ? 'Summaries respect the length limits' : 'Tóm tắt đúng giới hạn độ dài'}</td><td>1</td></tr>
</tbody>
</table>
<div class="callout ok"><p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'you score at least 8/10, every summary keeps the mandatory conditions (nothing marked MUST is missing), and you finished in about 60 minutes. Below 8: reread lesson 1.3 and redo Task 3 tomorrow without looking at the answer.' : 'bạn đạt ít nhất 8/10, không bản tóm tắt nào bỏ sót điều kiện bắt buộc (không thiếu mục MUST nào), và làm xong trong khoảng 60 phút. Dưới 8: đọc lại bài 1.3 và hôm sau làm lại Bài 3 mà không nhìn đáp án.'}</p></div>
</div>
`;

/* ═════════════ 1.5 — Quiz chương 1 ═════════════ */
const QUIZ1 = [
  Q('tak1-1', 'A spec says: "The export SHOULD include cancelled loans." Under RFC 2119, what does this mean?|||Spec ghi: "The export SHOULD include cancelled loans." Theo RFC 2119, câu này nghĩa là gì?', [
    'Optional — include them only if there is time|||Tuỳ chọn — có thời gian thì làm',
    'Include them, unless there is a valid reason not to whose implications are understood and agreed|||Phải đưa vào, trừ khi có lý do chính đáng mà hệ quả đã được cân nhắc và thống nhất',
    'Forbidden|||Bị cấm',
    'Exactly the same as MAY|||Giống hệt MAY',
  ], 1, 'RFC 2119: SHOULD = "there may exist valid reasons … to ignore a particular item, but the full implications must be understood and carefully weighed". Lesson 1.3.|||RFC 2119: SHOULD = "có thể tồn tại lý do chính đáng để bỏ qua…, nhưng hệ quả phải được hiểu và cân nhắc kỹ". Bài 1.3.'),
  Q('tak1-2', 'According to RFC 8174, when do "must" and "should" carry the special RFC 2119 meaning?|||Theo RFC 8174, khi nào "must" và "should" mang nghĩa đặc biệt của RFC 2119?', [
    'Always, in any technical document|||Luôn luôn, trong mọi tài liệu kỹ thuật',
    'Only when written in all capitals (MUST, SHOULD)|||Chỉ khi viết hoa toàn bộ (MUST, SHOULD)',
    'Only in bold|||Chỉ khi in đậm',
    'Only in Japanese specs|||Chỉ trong spec của khách Nhật',
  ], 1, '"when, and only when, they appear in all capitals". Lowercase words are ordinary English — ask if it matters.|||"when, and only when, they appear in all capitals". Viết thường là tiếng Anh bình thường — quan trọng thì hỏi lại.'),
  Q('tak1-3', 'The docs say: "Retries are disabled unless you set retry.enabled to true." You set nothing. Are retries on?|||Tài liệu ghi: "Retries are disabled unless you set retry.enabled to true." Bạn không đặt gì. Retry có bật không?', [
    'Yes|||Có',
    'No|||Không',
    'Only for POST|||Chỉ với POST',
    'It depends on the timeout|||Tuỳ vào timeout',
  ], 1, '"unless X" = "if not X". Not set ⇒ disabled. Lesson 1.1.|||"unless X" = "nếu không X". Không đặt ⇒ tắt. Bài 1.1.'),
  Q('tak1-4', '"Use a secure protocol, i.e. HTTPS." What does it tell you?|||"Use a secure protocol, i.e. HTTPS." Câu này cho bạn biết gì?', [
    'HTTPS is one example among several allowed protocols|||HTTPS là một ví dụ trong nhiều giao thức được phép',
    'The secure protocol meant here is HTTPS (i.e. = that is)|||Giao thức an toàn được nói tới chính là HTTPS (i.e. = tức là)',
    'HTTPS is optional|||HTTPS là tuỳ chọn',
    'HTTPS is deprecated|||HTTPS đã lỗi thời',
  ], 1, 'i.e. explains (that is); e.g. gives an example (for example).|||i.e. giải thích (tức là); e.g. đưa ví dụ (ví dụ như).'),
  Q('tak1-5', 'In a Java stack trace, where is the root cause usually found?|||Trong stack trace Java, nguyên nhân gốc thường nằm ở đâu?', [
    'In the first line|||Ở dòng đầu tiên',
    'In the last "Caused by:" line|||Ở dòng "Caused by:" cuối cùng',
    'In the "... 25 more" line|||Ở dòng "... 25 more"',
    'In the WARN lines above it|||Ở các dòng WARN phía trên',
  ], 1, 'The top line is the symptom at the highest layer; each Caused by goes one layer deeper. Lesson 1.2.|||Dòng đầu là triệu chứng ở tầng cao nhất; mỗi Caused by đi sâu thêm một tầng. Bài 1.2.'),
  Q('tak1-6', 'A release note says: "Fixed a regression in 2.3.0 where large uploads timed out." What is a regression?|||Release note ghi: "Fixed a regression in 2.3.0 where large uploads timed out." Regression là gì?', [
    'A new feature|||Một tính năng mới',
    'A performance improvement|||Một cải tiến hiệu năng',
    'Something that worked before and broke in a newer version|||Thứ trước đây chạy được và bị hỏng ở bản mới hơn',
    'A deprecated option|||Một tuỳ chọn đã lỗi thời',
  ], 2, 'Regression = it used to work. Lesson 1.2.|||Regression = trước đây vẫn chạy. Bài 1.2.'),
  Q('tak1-7', 'In a GitHub issue, a maintainer writes: "The fix will be backported to 2.3.x." What does it mean for you on version 2.3.0?|||Trên issue GitHub, maintainer viết: "The fix will be backported to 2.3.x." Với bạn đang ở 2.3.0, điều đó nghĩa là gì?', [
    'You must upgrade to the next major version to get the fix|||Phải lên bản major tiếp theo mới có bản sửa',
    'A future 2.3.x patch release will contain the fix, so a small upgrade is enough|||Một bản vá 2.3.x sắp tới sẽ có bản sửa, chỉ cần nâng bản nhỏ',
    'The fix was removed|||Bản sửa đã bị gỡ',
    'The bug will not be fixed|||Lỗi sẽ không được sửa',
  ], 1, 'Backport = apply the fix to an older release line.|||Backport = đưa bản sửa về nhánh phát hành cũ.'),
  Q('tak1-8', 'Which line of a GitHub issue is NOISE, not information?|||Dòng nào trong issue GitHub là TIẾNG ỒN, không phải thông tin?', [
    '"Also happens on Windows 11 with Node 22.11."|||"Also happens on Windows 11 with Node 22.11."',
    '"As a workaround, set connectTimeoutMs to 30000."|||"As a workaround, set connectTimeoutMs to 30000."',
    '"+1, any update?"|||"+1, any update?"',
    '"Closed as duplicate of #1490."|||"Closed as duplicate of #1490."',
  ], 2, 'New environments, workarounds and resolutions are information; "+1" adds nothing — use the 👍 reaction.|||Môi trường mới, cách tạm và kết luận là thông tin; "+1" không thêm gì — bấm 👍.'),
  Q('tak1-9', 'A Japanese client writes: "Basically, approval is required within 2 days." What is the best reaction?|||Khách Nhật viết: "Basically, approval is required within 2 days." Phản ứng tốt nhất là gì?', [
    'Ignore "basically" — it is a filler word|||Bỏ qua "basically" — chữ đệm thôi',
    'Treat it as an absolute rule with no exceptions|||Coi là luật tuyệt đối, không ngoại lệ',
    'Ask what the exceptions are and whether the system must enforce the 2 days|||Hỏi ngoại lệ là gì và hệ thống có phải ép mốc 2 ngày không',
    'Treat it as optional|||Coi là tuỳ chọn',
  ], 2, '"Basically" (基本的に) often means "as a rule, with exceptions". Lesson 1.3.|||"Basically" (基本的に) thường là "về nguyên tắc, có ngoại lệ". Bài 1.3.'),
  Q('tak1-10', 'Which requirement is testable as written?|||Yêu cầu nào kiểm được ngay như đang viết?', [
    'The search must be fast and user-friendly.|||The search must be fast and user-friendly.',
    'The system should handle large files appropriately.|||The system should handle large files appropriately.',
    'The reset link MUST expire 30 minutes after it is sent.|||The reset link MUST expire 30 minutes after it is sent.',
    'Cancelled reservations are handled as same as before.|||Cancelled reservations are handled as same as before.',
  ], 2, 'Only C has a measurable condition. The others contain vague adjectives or "same as before". Lessons 1.3–1.4.|||Chỉ C có điều kiện đo được. Các câu khác có tính từ chung chung hoặc "same as before". Bài 1.3–1.4.'),
];

export default {
  title: 'Chapter 1 — Reading technical English|||Chương 1 — Đọc tiếng Anh kỹ thuật',
  description: 'Đọc để làm được việc, không phải để dịch từng chữ: tài liệu, thông báo lỗi, issue, release notes, spec và MUST/SHOULD/MAY.',
  lessons: [
    { title: '1.1 — Reading documentation: structure, skimming, tutorial vs reference|||1.1 — Đọc tài liệu: cấu trúc, đọc lướt, tutorial và reference', slug: 'tak-1-1-tai-lieu', type: 'LESSON', isFreePreview: true, description: 'Bốn loại trang tài liệu (Diátaxis), bảy chỗ nghĩa hay nằm khi đọc lướt, unless/i.e./e.g., đoán từ lạ, lab săn CORS trong tài liệu Spring 5 phút.', content: L11(true) + L11(false) },
    { title: '1.2 — Error messages, logs, GitHub issues, release notes and changelogs|||1.2 — Thông báo lỗi, log, issue GitHub, release notes và changelog', slug: 'tak-1-2-loi-issue', type: 'LESSON', isFreePreview: true, description: 'Chín mẫu câu của thông báo lỗi (câu thật Java/JS/Spring/Git/npm), đọc "Caused by" cuối, bốn loại bình luận trong issue, semver + breaking change/regression/backport, tóm tắt release notes 5 dòng.', content: L12(true) + L12(false) },
    { title: '1.3 — Specs and requirements in English: RFC 2119 words, acceptance criteria, ambiguity|||1.3 — Spec và yêu cầu bằng tiếng Anh: từ của RFC 2119, tiêu chí chấp nhận, chỗ mơ hồ', slug: 'tak-1-3-spec', type: 'LESSON', isFreePreview: true, description: 'MUST/SHOULD/MAY trích nguyên văn RFC 2119 + RFC 8174 (chỉ chữ hoa), SHOULD không phải "có thì tốt", Given/When/Then, mười dấu hiệu mơ hồ, tiếng Anh của khách Nhật, spec LabFlow cài 10 chỗ mơ hồ.', content: L13(true) + L13(false) },
    { title: '1.4 — Lab: summarise a README, an issue thread and a spec|||1.4 — Lab: tóm tắt một README, một luồng issue và một spec', slug: 'tak-1-4-lab', type: 'LESSON', isFreePreview: true, description: 'Ba văn bản kiểu thật (README dịch vụ thông báo, issue gửi email trùng, spec quên mật khẩu), giới hạn độ dài, đáp án gợi ý và rubric 10 điểm.', content: L14(true) + L14(false) },
    {
      title: '1.5 — Chapter 1 quiz|||1.5 — Kiểm tra Chương 1',
      slug: 'tak-1-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu: MUST/SHOULD theo RFC 2119 và 8174, unless, i.e./e.g., Caused by, regression, backport, tiếng ồn trong issue, "basically", yêu cầu kiểm được.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten questions taken from the texts you read in this chapter. Every explanation names the lesson to reread.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười câu lấy từ chính những văn bản bạn đã đọc trong chương. Lời giải câu nào cũng chỉ ra bài cần đọc lại.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ1 },
    },
  ],
};
