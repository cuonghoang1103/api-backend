/**
 * MAW301 — Modern Web Application Security (Bảo mật ứng dụng web hiện đại).
 * Ngành Khoa học Máy tính FPTU, kỳ 5. Khung 8 chương theo giáo trình chuẩn
 * quốc tế: mô hình đe doạ & OWASP Top 10 → injection → XSS & CSRF → xác thực
 * & phiên → phân quyền → cấu hình & phụ thuộc → mã hoá & dữ liệu nhạy cảm →
 * kiểm thử & DevSecOps. Song ngữ VI+EN, có khối code minh hoạ & mẹo phòng chống.
 * Nguồn: OWASP Top 10 & OWASP Testing Guide (WSTG); Stuttard & Pinto "The Web
 * Application Hacker's Handbook"; PortSwigger Web Security Academy; MDN Web Security.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick lồng/${; & → &amp;, < → &lt; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('maw301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), OWASP Top 10 & Testing Guide, sách WAHH, PortSwigger Academy, MDN, YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">MAW301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Modern Web Application Security — threat modeling, the OWASP Top 10, injection, XSS &amp; CSRF, authentication, access control, cryptography and DevSecOps — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for MAW301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/The_Web_Application_Hacker%27s_Handbook" target="_blank" rel="noopener"><em>The Web Application Hacker's Handbook</em> — Stuttard &amp; Pinto</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://owasp.org/www-project-top-ten/" target="_blank" rel="noopener">OWASP Top 10</a> — the standard list of web risks</li>
<li><a href="https://owasp.org/www-project-web-security-testing-guide/" target="_blank" rel="noopener">OWASP Web Security Testing Guide (WSTG)</a></li>
<li><a href="https://cheatsheetseries.owasp.org/" target="_blank" rel="noopener">OWASP Cheat Sheet Series</a> — practical prevention recipes</li>
<li><a href="https://portswigger.net/web-security" target="_blank" rel="noopener">PortSwigger Web Security Academy</a> — free labs, hands-on</li>
<li><a href="https://developer.mozilla.org/en-US/docs/Web/Security" target="_blank" rel="noopener">MDN Web Security</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@PwnFunction" target="_blank" rel="noopener">PwnFunction</a> — web vulnerabilities, animated</li>
<li><a href="https://www.youtube.com/@LiveOverflow" target="_blank" rel="noopener">LiveOverflow</a> — hacking &amp; security explained</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://portswigger.net/burp" target="_blank" rel="noopener">Burp Suite</a> — the industry proxy for web testing</li>
<li><a href="https://www.zaproxy.org/" target="_blank" rel="noopener">OWASP ZAP</a> — free web app scanner &amp; proxy</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — how HTTP works, the threat model, and the OWASP Top 10 as a map of risks.</li>
<li><strong>Practice</strong> — reproduce each vulnerability in PortSwigger Academy labs until you can both exploit and fix it.</li>
<li><strong>Go deeper</strong> — injection, XSS/CSRF, auth &amp; sessions, access control, misconfiguration, crypto.</li>
<li><strong>Job-ready</strong> — run SAST/DAST, write secure code reviews, and bake security into the SDLC (DevSecOps).</li>
</ol></div>`,
    `<span class="eyebrow">MAW301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Bảo mật ứng dụng web hiện đại — mô hình đe doạ, OWASP Top 10, injection, XSS &amp; CSRF, xác thực, phân quyền, mã hoá và DevSecOps — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của MAW301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/The_Web_Application_Hacker%27s_Handbook" target="_blank" rel="noopener"><em>The Web Application Hacker's Handbook</em> — Stuttard &amp; Pinto</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://owasp.org/www-project-top-ten/" target="_blank" rel="noopener">OWASP Top 10</a> — danh sách chuẩn các rủi ro web</li>
<li><a href="https://owasp.org/www-project-web-security-testing-guide/" target="_blank" rel="noopener">OWASP Web Security Testing Guide (WSTG)</a></li>
<li><a href="https://cheatsheetseries.owasp.org/" target="_blank" rel="noopener">OWASP Cheat Sheet Series</a> — công thức phòng chống thực dụng</li>
<li><a href="https://portswigger.net/web-security" target="_blank" rel="noopener">PortSwigger Web Security Academy</a> — lab miễn phí, thực hành</li>
<li><a href="https://developer.mozilla.org/en-US/docs/Web/Security" target="_blank" rel="noopener">MDN Web Security</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@PwnFunction" target="_blank" rel="noopener">PwnFunction</a> — lỗ hổng web, minh hoạ động</li>
<li><a href="https://www.youtube.com/@LiveOverflow" target="_blank" rel="noopener">LiveOverflow</a> — hacking &amp; bảo mật giảng dễ hiểu</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://portswigger.net/burp" target="_blank" rel="noopener">Burp Suite</a> — proxy chuẩn ngành để kiểm thử web</li>
<li><a href="https://www.zaproxy.org/" target="_blank" rel="noopener">OWASP ZAP</a> — máy quét &amp; proxy web miễn phí</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — HTTP hoạt động thế nào, mô hình đe doạ, và OWASP Top 10 như bản đồ rủi ro.</li>
<li><strong>Luyện tập</strong> — dựng lại từng lỗ hổng trong lab PortSwigger Academy đến khi vừa khai thác vừa vá được.</li>
<li><strong>Đào sâu</strong> — injection, XSS/CSRF, xác thực &amp; phiên, phân quyền, cấu hình sai, mã hoá.</li>
<li><strong>Sẵn sàng đi làm</strong> — chạy SAST/DAST, review mã bảo mật, và đưa bảo mật vào SDLC (DevSecOps).</li>
</ol></div>`,
  ]]);

const intro = doc('maw301-0-1-overview', 'Course overview: Modern web application security|||Tổng quan: Bảo mật ứng dụng web hiện đại',
  'Bảo mật web làm gì; bộ ba CIA (bí mật/toàn vẹn/sẵn sàng); tư duy tấn công và phòng thủ; lộ trình: mô hình đe doạ → injection → XSS/CSRF → xác thực → phân quyền → cấu hình → mã hoá → kiểm thử/DevSecOps.',
  [[
    `<span class="eyebrow">MAW301 · Lesson 0.1 · Overview</span>
<h2>Modern Web Application Security</h2>
<p class="lead">This course teaches you to <strong>think like an attacker and build like a defender</strong>. You will learn how real web vulnerabilities work — and, just as importantly, how to prevent them in your own code, following the <strong>OWASP Top 10</strong>.</p>
<h3>The three security goals (CIA)</h3>
<ul>
<li><strong>Confidentiality</strong> — only authorized people can read the data.</li>
<li><strong>Integrity</strong> — data cannot be tampered with undetected.</li>
<li><strong>Availability</strong> — the service stays up for legitimate users.</li>
</ul>
<p>Almost every attack you will study breaks one of these three.</p>
<h3>Roadmap</h3>
<p>Threat modeling &amp; the OWASP Top 10 → injection (SQL/command) → XSS &amp; CSRF → authentication &amp; sessions → authorization &amp; access control → misconfiguration, SSRF &amp; supply chain → cryptography &amp; sensitive data → testing &amp; DevSecOps. Bilingual, with code examples and quizzes each chapter.</p>
<div class="callout"><span class="badge">Ethics first</span> Everything here is for <strong>defensive</strong> purposes. Only test systems you own or have written permission to test — unauthorized hacking is illegal.</div>`,
    `<span class="eyebrow">MAW301 · Bài 0.1 · Tổng quan</span>
<h2>Bảo mật ứng dụng web hiện đại</h2>
<p class="lead">Môn này dạy bạn <strong>tư duy như kẻ tấn công và xây dựng như người phòng thủ</strong>. Bạn học cách các lỗ hổng web thật hoạt động — và quan trọng không kém, cách phòng chúng ngay trong mã của mình, theo <strong>OWASP Top 10</strong>.</p>
<h3>Ba mục tiêu bảo mật (CIA)</h3>
<ul>
<li><strong>Bí mật (Confidentiality)</strong> — chỉ người được phép mới đọc được dữ liệu.</li>
<li><strong>Toàn vẹn (Integrity)</strong> — dữ liệu không thể bị sửa lén mà không bị phát hiện.</li>
<li><strong>Sẵn sàng (Availability)</strong> — dịch vụ luôn hoạt động cho người dùng hợp lệ.</li>
</ul>
<p>Gần như mọi cuộc tấn công bạn sắp học đều phá vỡ một trong ba điều này.</p>
<h3>Lộ trình</h3>
<p>Mô hình đe doạ &amp; OWASP Top 10 → injection (SQL/lệnh) → XSS &amp; CSRF → xác thực &amp; phiên → phân quyền &amp; kiểm soát truy cập → cấu hình sai, SSRF &amp; supply chain → mã hoá &amp; dữ liệu nhạy cảm → kiểm thử &amp; DevSecOps. Song ngữ, có ví dụ code và quiz mỗi chương.</p>
<div class="callout"><span class="badge">Đạo đức trước tiên</span> Mọi thứ ở đây phục vụ mục đích <strong>phòng thủ</strong>. Chỉ kiểm thử hệ thống bạn sở hữu hoặc được phép bằng văn bản — hack trái phép là phạm pháp.</div>`,
  ]]);

const c1 = doc('maw301-1-1-threat-model', '1.1 — Web security & threat modeling|||1.1 — Bảo mật web & mô hình đe doạ',
  'HTTP (request/response, phi trạng thái), kiến trúc web (client/server/DB), mô hình đe doạ (tài sản, kẻ tấn công, bề mặt tấn công, STRIDE), OWASP Top 10 tổng quan.',
  [[
    `<span class="eyebrow">MAW301 · Chapter 1 · Lesson 1.1</span>
<h2>Web security &amp; threat modeling</h2>
<h3>How the web works</h3>
<p><strong>HTTP</strong> is a request/response protocol: the browser (client) sends a request, the server answers. It is <strong>stateless</strong> — each request stands alone, so sessions are rebuilt with cookies/tokens. A typical app has three tiers: <strong>client → server → database</strong>. Every boundary between them is a place an attacker can push on.</p>
<h3>Threat modeling</h3>
<p>Before defending, ask four questions: <strong>What are we building? What can go wrong? What do we do about it? Did we do a good job?</strong> Identify <strong>assets</strong> (data, accounts), <strong>attackers</strong>, and the <strong>attack surface</strong> (every input the app accepts). A common framework is <strong>STRIDE</strong>:</p>
<pre><code>STRIDE — six threat categories
  Spoofing               -> pretend to be someone else
  Tampering              -> modify data in transit or at rest
  Repudiation            -> deny having done an action
  Information disclosure -> leak data that should be secret
  Denial of service      -> make the service unavailable
  Elevation of privilege -> gain rights you should not have
</code></pre>
<h3>The OWASP Top 10</h3>
<p>The <strong>OWASP Top 10</strong> is the industry standard list of the most critical web risks (broken access control, cryptographic failures, injection, insecure design, misconfiguration, vulnerable components, auth failures, and more). This course walks through it.</p>
<div class="callout"><span class="badge">Never trust input</span> The single golden rule: <strong>all input is hostile until validated</strong> — query params, headers, cookies, JSON bodies, file uploads, everything.</div>`,
    `<span class="eyebrow">MAW301 · Chương 1 · Bài 1.1</span>
<h2>Bảo mật web &amp; mô hình đe doạ</h2>
<h3>Web hoạt động thế nào</h3>
<p><strong>HTTP</strong> là giao thức request/response: trình duyệt (client) gửi yêu cầu, máy chủ trả lời. Nó <strong>phi trạng thái (stateless)</strong> — mỗi request đứng độc lập, nên phiên được dựng lại bằng cookie/token. Ứng dụng điển hình có ba tầng: <strong>client → server → cơ sở dữ liệu</strong>. Mỗi ranh giới giữa chúng là chỗ kẻ tấn công có thể tì vào.</p>
<h3>Mô hình đe doạ</h3>
<p>Trước khi phòng thủ, hỏi bốn câu: <strong>Ta đang xây gì? Có thể sai ở đâu? Ta làm gì với nó? Ta làm tốt chưa?</strong> Xác định <strong>tài sản</strong> (dữ liệu, tài khoản), <strong>kẻ tấn công</strong>, và <strong>bề mặt tấn công</strong> (mọi đầu vào ứng dụng nhận). Một khung phổ biến là <strong>STRIDE</strong>:</p>
<pre><code>STRIDE — sáu nhóm đe doạ
  Spoofing               -> giả danh người khác
  Tampering              -> sửa dữ liệu khi truyền hoặc khi lưu
  Repudiation            -> chối đã làm một hành động
  Information disclosure -> lộ dữ liệu đáng lẽ bí mật
  Denial of service      -> làm dịch vụ không truy cập được
  Elevation of privilege -> giành quyền không đáng có
</code></pre>
<h3>OWASP Top 10</h3>
<p><strong>OWASP Top 10</strong> là danh sách chuẩn ngành về các rủi ro web nghiêm trọng nhất (phân quyền hỏng, lỗi mã hoá, injection, thiết kế không an toàn, cấu hình sai, thành phần dễ tổn thương, lỗi xác thực, và hơn nữa). Môn này đi qua từng mục.</p>
<div class="callout"><span class="badge">Đừng bao giờ tin đầu vào</span> Quy tắc vàng duy nhất: <strong>mọi đầu vào đều thù địch cho tới khi được kiểm hợp lệ</strong> — query, header, cookie, thân JSON, file tải lên, tất cả.</div>`,
  ]]);

const c1q = quiz('maw301-quiz-1', 'Quiz 1 — Threat model|||Quiz 1 — Mô hình đe doạ', [
  { id: 'q1', question: 'Bộ ba mục tiêu bảo mật (CIA) gồm?', options: ['Cache, Index, Auth', 'Bí mật, Toàn vẹn, Sẵn sàng', 'Client, Internet, API', 'Cookie, IP, Address'], correctIndex: 1, explanation: 'CIA = Confidentiality (bí mật), Integrity (toàn vẹn), Availability (sẵn sàng).' },
  { id: 'q2', question: 'HTTP là giao thức có tính chất nào?', options: ['Có trạng thái (nhớ mọi request)', 'Phi trạng thái (mỗi request độc lập)', 'Chỉ dùng cho email', 'Không dùng cho web'], correctIndex: 1, explanation: 'HTTP phi trạng thái; phiên được dựng lại bằng cookie/token.' },
  { id: 'q3', question: 'OWASP Top 10 là gì?', options: ['Danh sách trình duyệt nhanh nhất', 'Danh sách chuẩn các rủi ro bảo mật web nghiêm trọng nhất', 'Bảng giá máy chủ', 'Danh sách ngôn ngữ lập trình'], correctIndex: 1, explanation: 'OWASP Top 10 liệt kê các rủi ro web nghiêm trọng nhất, dùng làm bản đồ phòng thủ.' },
]);

const c2 = doc('maw301-2-1-injection', '2.1 — Injection (SQL & command)|||2.1 — Injection (SQL & lệnh)',
  'SQL injection (ghép chuỗi truy vấn, bypass đăng nhập, rút dữ liệu), command injection; phòng chống bằng truy vấn tham số hoá (prepared statement), allow-list, không gọi shell với dữ liệu người dùng.',
  [[
    `<span class="eyebrow">MAW301 · Chapter 2 · Lesson 2.1</span>
<h2>Injection — SQL &amp; command</h2>
<h3>What injection is</h3>
<p><strong>Injection</strong> happens when untrusted input is mixed into a command or query as <em>code</em> instead of <em>data</em>. The classic is <strong>SQL injection</strong>: the app glues user input straight into a SQL string.</p>
<pre><code>// VULNERABLE — string concatenation
const q = "SELECT * FROM users WHERE name = '" + input + "'";

// Attacker sends:   ' OR '1'='1
// Query becomes:    SELECT * FROM users WHERE name = '' OR '1'='1'
//  -> the WHERE is always true -> auth bypass / data dump
</code></pre>
<p><strong>Command injection</strong> is the same idea against the OS shell: input reaches <code>exec()</code>/<code>system()</code> and an attacker appends <code>; rm -rf /</code>.</p>
<h3>Prevention</h3>
<ul>
<li><strong>Parameterized queries / prepared statements</strong> — the database treats input as data, never code. This is the real fix.</li>
<li><strong>Use an ORM / query builder</strong> safely; avoid raw string building.</li>
<li><strong>Never pass user input to a shell</strong>; if you must call a program, use argument arrays and an allow-list.</li>
<li>Least-privilege DB accounts limit the damage.</li>
</ul>
<pre><code>// SAFE — parameterized (placeholder, not concatenation)
db.query("SELECT * FROM users WHERE name = ?", [input]);
</code></pre>
<div class="callout"><span class="badge">Data, not code</span> Injection dies the moment input is bound as a parameter — the engine can no longer confuse it with the query structure.</div>`,
    `<span class="eyebrow">MAW301 · Chương 2 · Bài 2.1</span>
<h2>Injection — SQL &amp; lệnh</h2>
<h3>Injection là gì</h3>
<p><strong>Injection</strong> xảy ra khi đầu vào không tin cậy bị trộn vào một lệnh hay truy vấn như <em>mã</em> thay vì <em>dữ liệu</em>. Kinh điển là <strong>SQL injection</strong>: ứng dụng dán thẳng đầu vào người dùng vào chuỗi SQL.</p>
<pre><code>// DỄ TỔN THƯƠNG — ghép chuỗi
const q = "SELECT * FROM users WHERE name = '" + input + "'";

// Kẻ tấn công gửi:  ' OR '1'='1
// Truy vấn thành:   SELECT * FROM users WHERE name = '' OR '1'='1'
//  -> WHERE luôn đúng -> bỏ qua đăng nhập / rút sạch dữ liệu
</code></pre>
<p><strong>Command injection</strong> cùng ý tưởng nhưng nhắm vào shell hệ điều hành: đầu vào chạm tới <code>exec()</code>/<code>system()</code> và kẻ tấn công nối thêm <code>; rm -rf /</code>.</p>
<h3>Phòng chống</h3>
<ul>
<li><strong>Truy vấn tham số hoá / prepared statement</strong> — CSDL coi đầu vào là dữ liệu, không bao giờ là mã. Đây mới là cách vá thật.</li>
<li><strong>Dùng ORM / query builder</strong> an toàn; tránh tự dựng chuỗi.</li>
<li><strong>Không đưa đầu vào người dùng vào shell</strong>; nếu buộc phải gọi chương trình, dùng mảng tham số và allow-list.</li>
<li>Tài khoản CSDL quyền tối thiểu giới hạn thiệt hại.</li>
</ul>
<pre><code>// AN TOÀN — tham số hoá (dùng placeholder, không ghép chuỗi)
db.query("SELECT * FROM users WHERE name = ?", [input]);
</code></pre>
<div class="callout"><span class="badge">Dữ liệu, không phải mã</span> Injection chết ngay khi đầu vào được gắn như tham số — bộ máy không còn nhầm nó với cấu trúc truy vấn.</div>`,
  ]]);

const c2q = quiz('maw301-quiz-2', 'Quiz 2 — Injection|||Quiz 2 — Injection', [
  { id: 'q1', question: 'Cách vá SQL injection đúng và hiệu quả nhất là?', options: ['Lọc bỏ dấu nháy đơn', 'Truy vấn tham số hoá (prepared statement)', 'Đổi tên bảng', 'Ẩn thông báo lỗi'], correctIndex: 1, explanation: 'Prepared statement gắn đầu vào như dữ liệu, engine không nhầm với mã truy vấn.' },
  { id: 'q2', question: 'Cốt lõi của mọi lỗ hổng injection là?', options: ['Máy chủ quá chậm', 'Đầu vào không tin cậy bị coi là MÃ thay vì DỮ LIỆU', 'Mật khẩu quá ngắn', 'Thiếu HTTPS'], correctIndex: 1, explanation: 'Injection là khi input bị trộn vào lệnh/truy vấn như code.' },
  { id: 'q3', question: 'Để tránh command injection, nên?', options: ['Đưa thẳng input vào shell', 'Không đưa input người dùng vào shell; dùng mảng tham số & allow-list', 'Tắt tường lửa', 'Chạy app dưới quyền root'], correctIndex: 1, explanation: 'Tránh gọi shell với dữ liệu người dùng; dùng mảng tham số và allow-list.' },
]);

const c3 = doc('maw301-3-1-xss-csrf', '3.1 — XSS & CSRF|||3.1 — XSS & CSRF',
  'XSS (reflected, stored, DOM-based — chèn script chạy trong trình duyệt nạn nhân); CSRF (lợi dụng phiên đăng nhập); phòng chống: output encoding, CSP, cookie SameSite, token chống CSRF.',
  [[
    `<span class="eyebrow">MAW301 · Chapter 3 · Lesson 3.1</span>
<h2>XSS &amp; CSRF</h2>
<h3>Cross-Site Scripting (XSS)</h3>
<p><strong>XSS</strong> injects attacker JavaScript that runs in the <em>victim's</em> browser, stealing cookies or acting as them. Three flavors:</p>
<ul>
<li><strong>Reflected</strong> — the payload is in the request (e.g. a URL param) and echoed straight back.</li>
<li><strong>Stored</strong> — the payload is saved (a comment, profile) and served to every viewer. Most dangerous.</li>
<li><strong>DOM-based</strong> — vulnerable client-side JS writes untrusted data into the page.</li>
</ul>
<pre><code>// Untrusted comment rendered raw:
&lt;div&gt;Hello USERINPUT&lt;/div&gt;
// Attacker stores:  &lt;script&gt;stealCookie()&lt;/script&gt;
//  -> runs for everyone who views the page
</code></pre>
<p><strong>Prevention:</strong> context-aware <strong>output encoding</strong> (HTML-escape untrusted data), a strong <strong>Content Security Policy (CSP)</strong>, and framework auto-escaping. Avoid <code>innerHTML</code> with user data.</p>
<h3>Cross-Site Request Forgery (CSRF)</h3>
<p><strong>CSRF</strong> tricks a logged-in victim's browser into sending a state-changing request (transfer money, change email) using their session cookie automatically.</p>
<p><strong>Prevention:</strong> <strong>anti-CSRF tokens</strong> (unpredictable per-form value the server checks), <strong>SameSite cookies</strong>, and re-checking the origin for sensitive actions.</p>
<div class="callout"><span class="badge">Encode on output</span> XSS defense is about <strong>where data lands</strong> — encode for HTML, attribute, JS or URL context at the moment of output, and add CSP as a second wall.</div>`,
    `<span class="eyebrow">MAW301 · Chương 3 · Bài 3.1</span>
<h2>XSS &amp; CSRF</h2>
<h3>Cross-Site Scripting (XSS)</h3>
<p><strong>XSS</strong> chèn JavaScript của kẻ tấn công để chạy trong trình duyệt của <em>nạn nhân</em>, đánh cắp cookie hoặc hành động thay họ. Ba dạng:</p>
<ul>
<li><strong>Reflected</strong> — payload nằm trong request (vd tham số URL) và bị dội thẳng trở lại.</li>
<li><strong>Stored</strong> — payload được lưu (bình luận, hồ sơ) và trả về cho mọi người xem. Nguy hiểm nhất.</li>
<li><strong>DOM-based</strong> — mã JS phía client dễ tổn thương ghi dữ liệu không tin cậy vào trang.</li>
</ul>
<pre><code>// Bình luận không tin cậy render thô:
&lt;div&gt;Hello USERINPUT&lt;/div&gt;
// Kẻ tấn công lưu:  &lt;script&gt;stealCookie()&lt;/script&gt;
//  -> chạy cho mọi người xem trang
</code></pre>
<p><strong>Phòng chống:</strong> <strong>mã hoá đầu ra (output encoding)</strong> theo ngữ cảnh (HTML-escape dữ liệu không tin cậy), một <strong>Content Security Policy (CSP)</strong> mạnh, và tự-escape của framework. Tránh <code>innerHTML</code> với dữ liệu người dùng.</p>
<h3>Cross-Site Request Forgery (CSRF)</h3>
<p><strong>CSRF</strong> lừa trình duyệt của nạn nhân đang đăng nhập gửi một request đổi trạng thái (chuyển tiền, đổi email) bằng cookie phiên được đính kèm tự động.</p>
<p><strong>Phòng chống:</strong> <strong>token chống CSRF</strong> (giá trị khó đoán theo từng form, server kiểm), <strong>cookie SameSite</strong>, và kiểm lại origin cho hành động nhạy cảm.</p>
<div class="callout"><span class="badge">Mã hoá lúc xuất</span> Phòng XSS là chuyện <strong>dữ liệu hạ cánh ở đâu</strong> — mã hoá đúng ngữ cảnh HTML, thuộc tính, JS hay URL ngay lúc xuất, và thêm CSP làm lớp tường thứ hai.</div>`,
  ]]);

const c3q = quiz('maw301-quiz-3', 'Quiz 3 — XSS & CSRF|||Quiz 3 — XSS & CSRF', [
  { id: 'q1', question: 'Loại XSS nào lưu payload lại và trả về cho mọi người xem?', options: ['Reflected', 'Stored', 'DOM-based', 'Không có loại nào'], correctIndex: 1, explanation: 'Stored XSS lưu payload (bình luận/hồ sơ) và phục vụ mọi người xem — nguy hiểm nhất.' },
  { id: 'q2', question: 'Biện pháp cốt lõi chống XSS là?', options: ['Mã hoá đầu ra theo ngữ cảnh + CSP', 'Dùng cookie dài hơn', 'Tắt JavaScript trên server', 'Đổi cổng HTTP'], correctIndex: 0, explanation: 'Output encoding theo ngữ cảnh + Content Security Policy là hai lớp phòng XSS.' },
  { id: 'q3', question: 'CSRF được phòng chống hiệu quả bằng?', options: ['Nén ảnh', 'Token chống CSRF & cookie SameSite', 'Xoá cache', 'Tăng RAM'], correctIndex: 1, explanation: 'Anti-CSRF token khó đoán và cookie SameSite chặn request đổi trạng thái giả mạo.' },
]);

const c4 = doc('maw301-4-1-auth-session', '4.1 — Authentication & session management|||4.1 — Xác thực & quản lý phiên',
  'Xác thực (mật khẩu, MFA); quản lý phiên (session ID, cookie, JWT); tấn công brute force & credential stuffing; phòng chống: băm mật khẩu mạnh, MFA, giới hạn tốc độ, cookie an toàn.',
  [[
    `<span class="eyebrow">MAW301 · Chapter 4 · Lesson 4.1</span>
<h2>Authentication &amp; session management</h2>
<h3>Authentication vs sessions</h3>
<p><strong>Authentication</strong> proves who you are (login). Because HTTP is stateless, after login the server issues a <strong>session</strong> — either a random <strong>session ID</strong> stored server-side and referenced by a cookie, or a signed <strong>JWT</strong> (a self-contained token the server verifies without a lookup).</p>
<h3>Common attacks</h3>
<ul>
<li><strong>Brute force</strong> — try many passwords for one account.</li>
<li><strong>Credential stuffing</strong> — replay username/password pairs leaked from other sites.</li>
<li><strong>Session hijacking / fixation</strong> — steal or pin a victim's session token.</li>
</ul>
<pre><code>Session cookie hardening:
  Set-Cookie: session=...; HttpOnly; Secure; SameSite=Strict
  HttpOnly -> JS cannot read it (blunts XSS theft)
  Secure   -> sent only over HTTPS
  SameSite -> not sent on cross-site requests
</code></pre>
<h3>Prevention</h3>
<ul>
<li><strong>Never store plain passwords</strong> — hash with bcrypt/argon2 (salted, slow).</li>
<li><strong>MFA (multi-factor)</strong> — a second factor stops most account takeover.</li>
<li><strong>Rate limiting &amp; lockout</strong> against brute force; regenerate the session ID on login.</li>
<li>Short-lived tokens; a real logout / refresh flow.</li>
</ul>
<div class="callout"><span class="badge">JWT caution</span> A JWT is only as safe as its signature check — verify the algorithm and secret server-side, and never trust the <code>alg</code> field from the token itself.</div>`,
    `<span class="eyebrow">MAW301 · Chương 4 · Bài 4.1</span>
<h2>Xác thực &amp; quản lý phiên</h2>
<h3>Xác thực khác phiên</h3>
<p><strong>Xác thực (authentication)</strong> chứng minh bạn là ai (đăng nhập). Vì HTTP phi trạng thái, sau đăng nhập máy chủ cấp một <strong>phiên (session)</strong> — hoặc một <strong>session ID</strong> ngẫu nhiên lưu ở server và tham chiếu qua cookie, hoặc một <strong>JWT</strong> có chữ ký (token tự chứa mà server xác minh không cần tra bảng).</p>
<h3>Các đòn tấn công thường gặp</h3>
<ul>
<li><strong>Brute force</strong> — thử nhiều mật khẩu cho một tài khoản.</li>
<li><strong>Credential stuffing</strong> — dùng lại cặp tài khoản/mật khẩu rò rỉ từ site khác.</li>
<li><strong>Chiếm/ghim phiên (hijacking/fixation)</strong> — đánh cắp hoặc ghim token phiên của nạn nhân.</li>
</ul>
<pre><code>Gia cố cookie phiên:
  Set-Cookie: session=...; HttpOnly; Secure; SameSite=Strict
  HttpOnly -> JS không đọc được (giảm nguy cơ XSS đánh cắp)
  Secure   -> chỉ gửi qua HTTPS
  SameSite -> không gửi trong request khác site
</code></pre>
<h3>Phòng chống</h3>
<ul>
<li><strong>Không bao giờ lưu mật khẩu thô</strong> — băm bằng bcrypt/argon2 (có salt, chậm).</li>
<li><strong>MFA (đa yếu tố)</strong> — yếu tố thứ hai chặn phần lớn chiếm tài khoản.</li>
<li><strong>Giới hạn tốc độ &amp; khoá tạm</strong> chống brute force; sinh lại session ID khi đăng nhập.</li>
<li>Token sống ngắn; có luồng đăng xuất / làm mới thật.</li>
</ul>
<div class="callout"><span class="badge">Cẩn thận JWT</span> Một JWT chỉ an toàn bằng bước kiểm chữ ký — xác minh thuật toán và khoá bí mật ở phía server, đừng bao giờ tin trường <code>alg</code> đến từ chính token.</div>`,
  ]]);

const c4q = quiz('maw301-quiz-4', 'Quiz 4 — Auth & session|||Quiz 4 — Xác thực & phiên', [
  { id: 'q1', question: 'Mật khẩu nên được lưu như thế nào?', options: ['Văn bản thô để dễ so', 'Băm bằng bcrypt/argon2 (có salt, chậm)', 'Mã hoá base64', 'Trong URL'], correctIndex: 1, explanation: 'Không lưu mật khẩu thô; băm chậm có salt như bcrypt/argon2.' },
  { id: 'q2', question: 'Thuộc tính cookie nào chặn JavaScript đọc cookie phiên?', options: ['Secure', 'HttpOnly', 'Path', 'Domain'], correctIndex: 1, explanation: 'HttpOnly khiến JS không đọc được cookie, làm giảm nguy cơ XSS đánh cắp phiên.' },
  { id: 'q3', question: 'Biện pháp nào chặn phần lớn việc chiếm tài khoản dù lộ mật khẩu?', options: ['Đổi màu giao diện', 'MFA (xác thực đa yếu tố)', 'Tăng timeout', 'Dùng HTTP thay HTTPS'], correctIndex: 1, explanation: 'MFA thêm yếu tố thứ hai nên mật khẩu lộ vẫn chưa đủ để đăng nhập.' },
]);

const c5 = doc('maw301-5-1-access-control', '5.1 — Authorization & access control|||5.1 — Phân quyền & kiểm soát truy cập',
  'Phân quyền (authorization) khác xác thực; broken access control (đứng #1 OWASP); IDOR (đổi ID để xem dữ liệu người khác); leo thang đặc quyền; phòng chống: kiểm quyền phía server, deny by default, RBAC.',
  [[
    `<span class="eyebrow">MAW301 · Chapter 5 · Lesson 5.1</span>
<h2>Authorization &amp; access control</h2>
<h3>Authorization is not authentication</h3>
<p>Authentication asks <em>who are you</em>; <strong>authorization</strong> asks <em>what are you allowed to do</em>. <strong>Broken access control</strong> is currently the <strong>#1 risk</strong> in the OWASP Top 10 — the app authenticates you but fails to check that you may touch this specific resource or action.</p>
<h3>IDOR &amp; privilege escalation</h3>
<p><strong>IDOR (Insecure Direct Object Reference)</strong>: the app trusts an ID from the request and returns the object without checking ownership.</p>
<pre><code>GET /api/invoices/1001   -> your own invoice (fine)
GET /api/invoices/1002   -> someone else's invoice
// If the server does not verify owner == current user,
// changing the ID leaks other people's data (IDOR).
</code></pre>
<p><strong>Privilege escalation:</strong> a normal user reaches admin functions (horizontal = other users' data; vertical = higher role) because the server relies on a hidden UI or a client-side role flag.</p>
<h3>Prevention</h3>
<ul>
<li><strong>Enforce every check on the server</strong> — never trust the client or a hidden field.</li>
<li><strong>Deny by default</strong>; grant access explicitly.</li>
<li><strong>Verify ownership</strong> on every object access (owner == current user).</li>
<li>Use a clear model — <strong>RBAC</strong> (roles) or ABAC (attributes) — and test it.</li>
</ul>
<div class="callout"><span class="badge">Check on the server</span> Hiding a button is not access control. Every sensitive request must re-check permission on the server, for every object, every time.</div>`,
    `<span class="eyebrow">MAW301 · Chương 5 · Bài 5.1</span>
<h2>Phân quyền &amp; kiểm soát truy cập</h2>
<h3>Phân quyền không phải xác thực</h3>
<p>Xác thực hỏi <em>bạn là ai</em>; <strong>phân quyền (authorization)</strong> hỏi <em>bạn được phép làm gì</em>. <strong>Broken access control</strong> hiện là <strong>rủi ro #1</strong> trong OWASP Top 10 — ứng dụng xác thực bạn nhưng quên kiểm rằng bạn có được đụng vào đúng tài nguyên hay hành động này.</p>
<h3>IDOR &amp; leo thang đặc quyền</h3>
<p><strong>IDOR (Insecure Direct Object Reference)</strong>: ứng dụng tin một ID từ request và trả về đối tượng mà không kiểm quyền sở hữu.</p>
<pre><code>GET /api/invoices/1001   -> hoá đơn của chính bạn (bình thường)
GET /api/invoices/1002   -> hoá đơn của người khác
// Nếu server không kiểm owner == người dùng hiện tại,
// đổi ID sẽ lộ dữ liệu người khác (IDOR).
</code></pre>
<p><strong>Leo thang đặc quyền:</strong> người dùng thường chạm tới chức năng admin (ngang = dữ liệu người khác; dọc = vai trò cao hơn) vì server dựa vào giao diện ẩn hay một cờ vai trò phía client.</p>
<h3>Phòng chống</h3>
<ul>
<li><strong>Kiểm mọi thứ ở phía server</strong> — đừng bao giờ tin client hay một trường ẩn.</li>
<li><strong>Từ chối mặc định (deny by default)</strong>; cấp quyền một cách tường minh.</li>
<li><strong>Kiểm quyền sở hữu</strong> ở mỗi lần truy cập đối tượng (owner == người dùng hiện tại).</li>
<li>Dùng mô hình rõ ràng — <strong>RBAC</strong> (vai trò) hoặc ABAC (thuộc tính) — và kiểm thử nó.</li>
</ul>
<div class="callout"><span class="badge">Kiểm ở server</span> Ẩn một nút bấm không phải là kiểm soát truy cập. Mọi request nhạy cảm phải kiểm lại quyền ở server, cho mọi đối tượng, mọi lần.</div>`,
  ]]);

const c5q = quiz('maw301-quiz-5', 'Quiz 5 — Access control|||Quiz 5 — Phân quyền', [
  { id: 'q1', question: 'IDOR xảy ra khi?', options: ['Mật khẩu quá ngắn', 'Server tin ID từ request và trả đối tượng mà không kiểm quyền sở hữu', 'Trình duyệt lỗi thời', 'CSS bị hỏng'], correctIndex: 1, explanation: 'IDOR: đổi ID trong request để truy cập dữ liệu người khác do server không kiểm owner.' },
  { id: 'q2', question: 'Rủi ro đứng #1 trong OWASP Top 10 hiện nay là?', options: ['Broken Access Control (phân quyền hỏng)', 'Nén ảnh kém', 'Font sai', 'Cache lỗi'], correctIndex: 0, explanation: 'Broken Access Control đứng đầu OWASP Top 10.' },
  { id: 'q3', question: 'Nguyên tắc đúng để kiểm soát truy cập là?', options: ['Ẩn nút trên giao diện là đủ', 'Từ chối mặc định & kiểm quyền ở server cho mọi đối tượng', 'Tin cờ vai trò phía client', 'Cho phép mặc định'], correctIndex: 1, explanation: 'Deny by default và kiểm quyền phía server cho từng đối tượng, mọi lần.' },
]);

const c6 = doc('maw301-6-1-misconfig-ssrf', '6.1 — Misconfiguration, SSRF & dependencies|||6.1 — Cấu hình sai, SSRF & phụ thuộc',
  'Security misconfiguration (mặc định không an toàn, lộ lỗi, header thiếu); SSRF (server bị lừa gọi tài nguyên nội bộ); thành phần dễ tổn thương & supply chain; phòng chống: hardening, allow-list URL, quét & vá phụ thuộc.',
  [[
    `<span class="eyebrow">MAW301 · Chapter 6 · Lesson 6.1</span>
<h2>Misconfiguration, SSRF &amp; dependencies</h2>
<h3>Security misconfiguration</h3>
<p>Often the app code is fine but the <em>setup</em> is not: default credentials left on, verbose error pages leaking stack traces, debug mode in production, open cloud buckets, or missing security headers. Attackers scan for these first because they are easy wins.</p>
<h3>SSRF (Server-Side Request Forgery)</h3>
<p><strong>SSRF</strong> tricks the server into making a request the attacker chooses — often to internal systems the attacker cannot reach directly.</p>
<pre><code>POST /fetch    url=http://169.254.169.254/latest/meta-data/
// The app fetches the URL for the user. Point it at an
// internal address (cloud metadata, admin panel) and the
// server relays secrets back -> SSRF.
</code></pre>
<h3>Vulnerable components &amp; supply chain</h3>
<p>Modern apps pull in hundreds of packages. A single outdated library with a known <strong>CVE</strong> can sink the whole app; a poisoned dependency is a <strong>supply-chain</strong> attack.</p>
<h3>Prevention</h3>
<ul>
<li><strong>Harden defaults</strong> — no debug in prod, generic error pages, remove unused features, add security headers.</li>
<li><strong>SSRF:</strong> allow-list the destinations the server may call; block internal IP ranges and metadata endpoints.</li>
<li><strong>Dependencies:</strong> keep an inventory (SBOM), scan (npm audit / Dependabot), and patch promptly; pin versions.</li>
</ul>
<div class="callout"><span class="badge">Secure by default</span> Ship locked-down, then open only what you need — the reverse (open, then remember to lock) is how misconfigurations reach production.</div>`,
    `<span class="eyebrow">MAW301 · Chương 6 · Bài 6.1</span>
<h2>Cấu hình sai, SSRF &amp; phụ thuộc</h2>
<h3>Cấu hình sai (security misconfiguration)</h3>
<p>Nhiều khi mã ứng dụng ổn nhưng <em>khâu cài đặt</em> thì không: để nguyên tài khoản mặc định, trang lỗi chi tiết lộ stack trace, bật debug trên production, bucket đám mây mở toang, hay thiếu header bảo mật. Kẻ tấn công quét những thứ này đầu tiên vì dễ ăn.</p>
<h3>SSRF (Server-Side Request Forgery)</h3>
<p><strong>SSRF</strong> lừa máy chủ gửi một request do kẻ tấn công chọn — thường tới hệ thống nội bộ mà kẻ tấn công không chạm trực tiếp được.</p>
<pre><code>POST /fetch    url=http://169.254.169.254/latest/meta-data/
// Ứng dụng tải URL giúp người dùng. Trỏ nó vào một địa chỉ
// nội bộ (metadata đám mây, trang admin) thì máy chủ chuyển
// tiếp bí mật về -> SSRF.
</code></pre>
<h3>Thành phần dễ tổn thương &amp; supply chain</h3>
<p>Ứng dụng hiện đại kéo về hàng trăm gói. Một thư viện cũ với <strong>CVE</strong> đã biết có thể nhấn chìm cả ứng dụng; một phụ thuộc bị đầu độc là tấn công <strong>chuỗi cung ứng (supply chain)</strong>.</p>
<h3>Phòng chống</h3>
<ul>
<li><strong>Gia cố mặc định</strong> — không debug trên prod, trang lỗi chung chung, gỡ tính năng thừa, thêm header bảo mật.</li>
<li><strong>SSRF:</strong> allow-list các đích máy chủ được phép gọi; chặn dải IP nội bộ và endpoint metadata.</li>
<li><strong>Phụ thuộc:</strong> giữ danh mục (SBOM), quét (npm audit / Dependabot), vá kịp thời; ghim phiên bản.</li>
</ul>
<div class="callout"><span class="badge">An toàn từ mặc định</span> Ship ở trạng thái khoá chặt rồi chỉ mở đúng thứ cần — làm ngược lại (mở, rồi nhớ khoá) là cách cấu hình sai lọt lên production.</div>`,
  ]]);

const c6q = quiz('maw301-quiz-6', 'Quiz 6 — Misconfig & SSRF|||Quiz 6 — Cấu hình & SSRF', [
  { id: 'q1', question: 'SSRF (Server-Side Request Forgery) là?', options: ['Lỗi CSS phía server', 'Lừa máy chủ gửi request tới tài nguyên (thường nội bộ) do kẻ tấn công chọn', 'Một loại font', 'Cách nén dữ liệu'], correctIndex: 1, explanation: 'SSRF: server bị lừa gọi URL kẻ tấn công chọn, thường chạm tài nguyên nội bộ.' },
  { id: 'q2', question: 'Ví dụ điển hình của security misconfiguration là?', options: ['Để tài khoản mặc định, bật debug trên prod, lộ stack trace', 'Dùng HTTPS', 'Băm mật khẩu', 'Đặt tên biến rõ ràng'], correctIndex: 0, explanation: 'Mặc định không an toàn, debug bật, lỗi chi tiết — đều là cấu hình sai.' },
  { id: 'q3', question: 'Cách xử lý phụ thuộc dễ tổn thương (vulnerable components)?', options: ['Không bao giờ cập nhật', 'Giữ danh mục (SBOM), quét & vá kịp thời, ghim phiên bản', 'Xoá package.json', 'Tin mọi gói bên thứ ba'], correctIndex: 1, explanation: 'Kiểm kê, quét CVE và vá nhanh là cách chống thành phần dễ tổn thương & supply chain.' },
]);

const c7 = doc('maw301-7-1-crypto-data', '7.1 — Cryptography & sensitive data|||7.1 — Mã hoá & dữ liệu nhạy cảm',
  'Cryptographic failures (OWASP); mã hoá khi truyền (TLS/HTTPS) & khi lưu (at rest); lưu mật khẩu bằng băm chậm có salt; bảo vệ dữ liệu nhạy cảm; phòng chống: dùng thuật toán chuẩn, không tự chế crypto, quản khoá.',
  [[
    `<span class="eyebrow">MAW301 · Chapter 7 · Lesson 7.1</span>
<h2>Cryptography &amp; sensitive data</h2>
<h3>Cryptographic failures</h3>
<p>OWASP lists <strong>cryptographic failures</strong> near the top: sensitive data (passwords, tokens, personal info, cards) is exposed because it was sent or stored without proper protection.</p>
<h3>In transit vs at rest</h3>
<ul>
<li><strong>In transit</strong> — use <strong>TLS (HTTPS)</strong> everywhere so data cannot be read or altered on the wire. Redirect HTTP to HTTPS and set HSTS.</li>
<li><strong>At rest</strong> — encrypt sensitive stored data; keep keys separate from the data.</li>
</ul>
<h3>Passwords are special</h3>
<pre><code>Encryption   -> reversible (you can decrypt)   -> for data you must read back
Hashing      -> one-way (cannot reverse)       -> for passwords
Password hash: bcrypt / argon2 (salted + slow)
  salt   -> two equal passwords hash differently
  slow   -> brute force is expensive
Do NOT use plain MD5/SHA-1 for passwords (too fast).
</code></pre>
<h3>Prevention</h3>
<ul>
<li><strong>Use standard, vetted algorithms</strong> — TLS, AES, argon2 — never invent your own crypto.</li>
<li><strong>Manage keys properly</strong> — store in a secret manager, rotate, never commit to git.</li>
<li>Collect and keep the <strong>minimum</strong> sensitive data; classify what you hold.</li>
</ul>
<div class="callout"><span class="badge">Do not roll your own crypto</span> Cryptography is easy to get subtly wrong. Use well-reviewed libraries and current algorithms; your job is to use them correctly, not to reinvent them.</div>`,
    `<span class="eyebrow">MAW301 · Chương 7 · Bài 7.1</span>
<h2>Mã hoá &amp; dữ liệu nhạy cảm</h2>
<h3>Lỗi mã hoá (cryptographic failures)</h3>
<p>OWASP xếp <strong>lỗi mã hoá</strong> gần đầu bảng: dữ liệu nhạy cảm (mật khẩu, token, thông tin cá nhân, thẻ) bị lộ vì được truyền hoặc lưu mà không được bảo vệ đúng cách.</p>
<h3>Khi truyền và khi lưu</h3>
<ul>
<li><strong>Khi truyền (in transit)</strong> — dùng <strong>TLS (HTTPS)</strong> ở mọi nơi để dữ liệu không bị đọc hay sửa trên đường truyền. Chuyển hướng HTTP sang HTTPS và bật HSTS.</li>
<li><strong>Khi lưu (at rest)</strong> — mã hoá dữ liệu nhạy cảm lưu trữ; giữ khoá tách khỏi dữ liệu.</li>
</ul>
<h3>Mật khẩu là trường hợp đặc biệt</h3>
<pre><code>Mã hoá (encryption) -> đảo ngược được -> cho dữ liệu cần đọc lại
Băm (hashing)       -> một chiều       -> cho mật khẩu
Băm mật khẩu: bcrypt / argon2 (có salt + chậm)
  salt   -> hai mật khẩu giống nhau băm ra khác nhau
  chậm   -> brute force trở nên đắt đỏ
KHÔNG dùng MD5/SHA-1 trần cho mật khẩu (quá nhanh).
</code></pre>
<h3>Phòng chống</h3>
<ul>
<li><strong>Dùng thuật toán chuẩn, đã kiểm định</strong> — TLS, AES, argon2 — đừng bao giờ tự chế crypto.</li>
<li><strong>Quản khoá đúng cách</strong> — lưu trong secret manager, xoay khoá, không commit vào git.</li>
<li>Thu thập và giữ <strong>tối thiểu</strong> dữ liệu nhạy cảm; phân loại thứ bạn đang giữ.</li>
</ul>
<div class="callout"><span class="badge">Đừng tự chế crypto</span> Mã hoá rất dễ sai một cách tinh vi. Dùng thư viện đã được rà kỹ và thuật toán hiện đại; việc của bạn là dùng đúng, không phải phát minh lại.</div>`,
  ]]);

const c7q = quiz('maw301-quiz-7', 'Quiz 7 — Crypto & data|||Quiz 7 — Mã hoá & dữ liệu', [
  { id: 'q1', question: 'Dữ liệu nhạy cảm khi TRUYỀN nên được bảo vệ bằng?', options: ['TLS/HTTPS', 'Base64', 'Nén gzip', 'Đổi tên file'], correctIndex: 0, explanation: 'TLS (HTTPS) mã hoá dữ liệu trên đường truyền, chống nghe lén và sửa đổi.' },
  { id: 'q2', question: 'Vì sao dùng băm chậm có salt (bcrypt/argon2) cho mật khẩu?', options: ['Để lưu ít bộ nhớ', 'Salt làm mật khẩu giống nhau băm khác nhau; chậm làm brute force đắt đỏ', 'Để giải mã nhanh', 'Vì đẹp hơn'], correctIndex: 1, explanation: 'Salt chống bảng tra sẵn; chậm làm việc dò mật khẩu tốn kém.' },
  { id: 'q3', question: 'Nguyên tắc quan trọng về mã hoá là?', options: ['Tự viết thuật toán riêng', 'Dùng thuật toán chuẩn đã kiểm định, không tự chế crypto', 'Dùng MD5 cho mật khẩu', 'Commit khoá vào git'], correctIndex: 1, explanation: 'Dùng thư viện/thuật toán đã được rà kỹ; tự chế crypto rất dễ sai.' },
]);

const c8 = doc('maw301-8-1-testing-devsecops', '8.1 — Security testing & DevSecOps|||8.1 — Kiểm thử bảo mật & DevSecOps',
  'Kiểm thử xâm nhập (pentest); SAST (quét mã tĩnh) & DAST (quét động khi chạy); secure SDLC; DevSecOps (đưa bảo mật vào CI/CD, dịch trái); đạo đức hacking & báo cáo có trách nhiệm.',
  [[
    `<span class="eyebrow">MAW301 · Chapter 8 · Lesson 8.1</span>
<h2>Security testing &amp; DevSecOps</h2>
<h3>Ways to find bugs before attackers do</h3>
<ul>
<li><strong>Penetration testing</strong> — a skilled human attacks the app (with permission) and reports what they broke.</li>
<li><strong>SAST</strong> (Static Application Security Testing) — scans <em>source code</em> without running it; catches patterns early.</li>
<li><strong>DAST</strong> (Dynamic) — tests the <em>running</em> app from the outside, like an attacker (e.g. OWASP ZAP).</li>
<li><strong>SCA</strong> — scans dependencies for known CVEs.</li>
</ul>
<h3>Secure SDLC &amp; DevSecOps</h3>
<p>Security is cheapest when it is early and continuous, not a check at the end. <strong>DevSecOps</strong> bakes it into every stage — this is called <strong>shifting left</strong>.</p>
<pre><code>Shift-left pipeline (security at each stage):
  Design   -> threat modeling
  Code     -> secure coding + SAST + secret scanning
  Build    -> SCA (dependency CVE scan)
  Test     -> DAST + integration security tests
  Deploy   -> hardened config, monitoring, alerts
</code></pre>
<h3>Ethics &amp; responsible disclosure</h3>
<p>Only test with <strong>authorization</strong>. When you find a flaw, report it privately to the owner and give them time to fix it before any public mention — that is <strong>responsible disclosure</strong>.</p>
<div class="callout"><span class="badge">Shift left</span> A bug caught in code review costs minutes; the same bug caught in production after a breach costs far more. Automate the checks and run them on every commit.</div>`,
    `<span class="eyebrow">MAW301 · Chương 8 · Bài 8.1</span>
<h2>Kiểm thử bảo mật &amp; DevSecOps</h2>
<h3>Các cách tìm lỗi trước kẻ tấn công</h3>
<ul>
<li><strong>Kiểm thử xâm nhập (pentest)</strong> — một chuyên gia tấn công ứng dụng (có phép) và báo cáo thứ họ phá được.</li>
<li><strong>SAST</strong> (kiểm thử tĩnh) — quét <em>mã nguồn</em> mà không chạy; bắt mẫu lỗi sớm.</li>
<li><strong>DAST</strong> (kiểm thử động) — thử ứng dụng <em>đang chạy</em> từ bên ngoài như kẻ tấn công (vd OWASP ZAP).</li>
<li><strong>SCA</strong> — quét phụ thuộc để tìm CVE đã biết.</li>
</ul>
<h3>Secure SDLC &amp; DevSecOps</h3>
<p>Bảo mật rẻ nhất khi làm sớm và liên tục, không phải một lần kiểm ở cuối. <strong>DevSecOps</strong> đưa nó vào mọi giai đoạn — gọi là <strong>dịch trái (shift left)</strong>.</p>
<pre><code>Pipeline dịch trái (bảo mật ở mỗi giai đoạn):
  Thiết kế -> mô hình đe doạ
  Viết mã  -> secure coding + SAST + quét bí mật
  Build    -> SCA (quét CVE phụ thuộc)
  Kiểm thử -> DAST + kiểm thử bảo mật tích hợp
  Triển khai -> cấu hình gia cố, giám sát, cảnh báo
</code></pre>
<h3>Đạo đức &amp; báo cáo có trách nhiệm</h3>
<p>Chỉ kiểm thử khi có <strong>uỷ quyền</strong>. Khi tìm ra lỗ hổng, báo riêng cho chủ sở hữu và cho họ thời gian vá trước khi công bố — đó là <strong>báo cáo có trách nhiệm (responsible disclosure)</strong>.</p>
<div class="callout"><span class="badge">Dịch trái</span> Một lỗi bắt ở review mã tốn vài phút; cùng lỗi đó bắt trên production sau khi bị xâm nhập tốn hơn rất nhiều. Tự động hoá các phép kiểm và chạy trên mỗi commit.</div>`,
  ]]);

const c8q = quiz('maw301-quiz-8', 'Quiz 8 — Testing & DevSecOps|||Quiz 8 — Kiểm thử & DevSecOps', [
  { id: 'q1', question: 'Khác biệt cốt lõi giữa SAST và DAST là?', options: ['SAST quét mã nguồn (không chạy); DAST thử ứng dụng đang chạy từ bên ngoài', 'Cả hai giống hệt nhau', 'SAST chỉ cho iOS', 'DAST là một ngôn ngữ'], correctIndex: 0, explanation: 'SAST là tĩnh (đọc mã); DAST là động (thử app đang chạy như kẻ tấn công).' },
  { id: 'q2', question: '"Shift left" trong DevSecOps nghĩa là?', options: ['Chỉ kiểm bảo mật sau khi ra mắt', 'Đưa bảo mật vào sớm & liên tục ở mọi giai đoạn phát triển', 'Dời server sang trái', 'Bỏ qua kiểm thử'], correctIndex: 1, explanation: 'Shift left = bảo mật sớm và liên tục trong SDLC, không để tới cuối.' },
  { id: 'q3', question: 'Báo cáo có trách nhiệm (responsible disclosure) là?', options: ['Đăng công khai lỗ hổng ngay lập tức', 'Báo riêng cho chủ sở hữu và cho thời gian vá trước khi công bố', 'Bán lỗ hổng cho kẻ xấu', 'Giữ im lặng mãi mãi'], correctIndex: 1, explanation: 'Báo riêng cho chủ sở hữu và cho họ thời gian vá trước khi tiết lộ công khai.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'MAW301',
    slug: 'maw301-modern-web-application-security',
    title: 'Modern Web Application Security',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/MAW301.webp',
    shortDescription: 'Attack & defend modern web apps — threat modeling & OWASP Top 10, injection, XSS & CSRF, auth/sessions/JWT/MFA, access control & IDOR, misconfig & SSRF, crypto & TLS, pentesting & DevSecOps. Bilingual, with code & quizzes.|||Tấn công & phòng thủ web hiện đại — mô hình đe doạ & OWASP Top 10, injection, XSS & CSRF, xác thực/phiên/JWT/MFA, phân quyền & IDOR, cấu hình sai & SSRF, mã hoá & TLS, pentest & DevSecOps. Song ngữ, có code & quiz.',
    description: 'Môn <strong>MAW301 — Modern Web Application Security</strong> (kỳ 5, ngành Khoa học Máy tính) dạy bạn tư duy như kẻ tấn công và xây dựng như người phòng thủ. Đi qua cả bức tranh theo <strong>OWASP Top 10</strong>: <strong>mô hình đe doạ</strong> (HTTP, kiến trúc web, STRIDE) → <strong>injection</strong> (SQL/lệnh) → <strong>XSS &amp; CSRF</strong> (CSP, SameSite) → <strong>xác thực &amp; phiên</strong> (JWT, MFA, brute force) → <strong>phân quyền</strong> (IDOR, broken access control) → <strong>cấu hình &amp; phụ thuộc</strong> (misconfiguration, SSRF, supply chain) → <strong>mã hoá &amp; dữ liệu nhạy cảm</strong> (TLS, băm mật khẩu) → <strong>kiểm thử &amp; DevSecOps</strong> (pentest, SAST/DAST, secure SDLC). Bám giáo trình chuẩn quốc tế, song ngữ, có khối code minh hoạ và quiz mỗi chương.',
    whatYouLearn: 'HTTP &amp; mô hình đe doạ (STRIDE, bề mặt tấn công); OWASP Top 10; injection SQL/lệnh &amp; truy vấn tham số hoá; XSS (reflected/stored/DOM), CSRF, CSP, cookie SameSite; xác thực, quản lý phiên, JWT, MFA, chống brute force; phân quyền, IDOR, broken access control, leo thang đặc quyền; security misconfiguration, SSRF, thành phần dễ tổn thương &amp; supply chain; lỗi mã hoá, TLS, băm mật khẩu (bcrypt/argon2), dữ liệu nhạy cảm; pentest, SAST/DAST/SCA, secure SDLC &amp; DevSecOps, đạo đức hacking.',
    requirements: 'Biết lập trình web cơ bản (HTTP, HTML, một ngôn ngữ backend) và SQL cơ bản. Nên có tài khoản PortSwigger Web Security Academy (miễn phí) để thực hành lab.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, OWASP, sách WAHH, PortSwigger, MDN, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Bảo mật web, bộ ba CIA, tư duy tấn công & phòng thủ.', lessons: [intro] },
    { title: 'Chương 1 — Bảo mật web & mô hình đe doạ|||Chapter 1 — Web security & threat model', description: 'HTTP, kiến trúc web, STRIDE, OWASP Top 10.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Injection|||Chapter 2 — Injection', description: 'SQL & command injection, tham số hoá.', lessons: [c2, c2q] },
    { title: 'Chương 3 — XSS & CSRF|||Chapter 3 — XSS & CSRF', description: 'Reflected/stored/DOM XSS, CSRF, CSP, SameSite.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Xác thực & phiên|||Chapter 4 — Authentication & sessions', description: 'Auth, session, JWT, MFA, brute force.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Phân quyền & kiểm soát truy cập|||Chapter 5 — Authorization & access control', description: 'IDOR, broken access control, leo thang đặc quyền.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Cấu hình & phụ thuộc|||Chapter 6 — Configuration & dependencies', description: 'Misconfiguration, SSRF, thành phần dễ tổn thương, supply chain.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Mã hoá & dữ liệu nhạy cảm|||Chapter 7 — Cryptography & sensitive data', description: 'Crypto failures, TLS, lưu mật khẩu, dữ liệu nhạy cảm.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Kiểm thử & DevSecOps|||Chapter 8 — Testing & DevSecOps', description: 'Pentest, SAST/DAST, secure SDLC, DevSecOps, đạo đức hacking.', lessons: [c8, c8q] },
  ],
};
