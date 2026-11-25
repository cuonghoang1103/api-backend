/**
 * 16.3 — Không bao giờ ghi bí mật hay dữ liệu cá nhân (soạn 24/11/2026, agent lgz).
 * Output thật: OUT['s16/bi-mat'] (Node 22 + pino 9 + pino-http 10 + winston 3), OUT['s16/nginx'] (nginx 1.27 map che query), OUT['s16/java'] (Java 21, SLF4J 2.0.17,
 * Logback 1.5.38: record toString + %replace), OUT['s16/quet'] (gitleaks 8.30.1 + luật riêng CCCD/số thẻ), OUT['s16/ong'] (Grafana Alloy 1.22 stage.replace).
 * Mọi bí mật trong demo là chuỗi GIẢ có chữ GIA. Sự cố thật (nguồn đã GET 24/11/2026): Twitter 05/2018 (The Register), GitHub 05/2018 (Bitdefender),
 * Facebook 03/2019 (Krebs + Facebook newsroom), DPC Ireland phạt Meta 91 triệu € 27/09/2024.
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: 'Never log secrets or personal data: tokens, passwords, cards, ID numbers — masking and redaction|||Không bao giờ ghi bí mật hay dữ liệu cá nhân: token, mật khẩu, thẻ, số CCCD — che và lọc',
  slug: 'log-16-3-khong-log-bi-mat',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Twitter và GitHub (5/2018) ghi mật khẩu dạng rõ vào log nội bộ; Facebook (2019) để hàng trăm triệu mật khẩu đọc được trong hệ thống nội bộ và bị phạt 91 triệu € năm 2024. Bài này cho thấy bí mật lọt vào log theo sáu đường và chặn từng đường bằng demo chạy thật: pino-http ghi cả Authorization/cookie/body ⇒ redact; winston tự viết format che; nginx ghi ?token= ⇒ log_format với map; record Java in mật khẩu qua toString ⇒ ghi đè + %replace của Logback; che lớp hai ở đường ống bằng Alloy stage.replace; quét log bằng gitleaks và luật riêng cho CCCD, số thẻ; và phải làm gì khi đã lỡ lọt.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.3</span>
<h2>The line that must never be written</h2>
<p class="lead">Logs are copied everywhere: to disk, to the central store, to backups, to a colleague's laptop during an incident, into a ticket, into a chat. Anything secret that reaches a log line reaches all of those places, and is read by people who never needed it. This lesson shows the six ways secrets get into logs and closes each one with a real, running fix.</p>

<h3>The everyday picture: the guest book</h3>
<p>A building's guest book records who came, when and to which flat. It would be absurd to also write the door code each visitor used. Yet that is exactly what an application does when it logs the whole request: who, when, where — and the key.</p>

<h3>Three real incidents</h3>
<ul>
<li><strong>Twitter, May 2018.</strong> On World Password Day, Twitter asked all its users — 330 million at the time — to consider changing passwords: a bug had written passwords to an internal log <em>before</em> the bcrypt hashing step. No evidence of misuse was found; the fix was trivial; the trust cost was not.</li>
<li><strong>GitHub, May 2018.</strong> A recently introduced bug recorded plaintext passwords in internal logs when users reset their password. Found by a routine audit; a small number of users had to reset again.</li>
<li><strong>Facebook, March 2019.</strong> KrebsOnSecurity reported that hundreds of millions of passwords had been stored in plain text in internal systems for years and were searchable by many employees; Facebook confirmed passwords "stored in a readable format within our internal data storage systems" and notified hundreds of millions of Facebook Lite users and millions of Facebook and Instagram users. In September 2024 the Irish Data Protection Commission fined Meta <strong>€91 million</strong> for it under GDPR.</li>
</ul>
<p>None of these was a hack. All three were logging. Your project will not make the news, but a token in a log handed to an outsourcing partner, or an ID number in a log that the whole team can grep, is the same mistake at a smaller scale.</p>

<h3>The list: never in a log</h3>
<table>
<thead><tr><th>Never</th><th>Log instead</th></tr></thead>
<tbody>
<tr><td>Passwords, PINs, OTP codes, security answers</td><td>"login failed for userId=u_42, reason=wrong_password"</td></tr>
<tr><td>Session ids, cookies, access/refresh tokens, API keys, the <code>Authorization</code> header</td><td>a token id (<code>jti</code>) or the last 4 characters</td></tr>
<tr><td>Full card numbers (PAN), CVV — CVV may never be stored at all (PCI DSS)</td><td>last 4 digits, the payment provider's transaction id</td></tr>
<tr><td>National ID (CCCD), passport, health data, exact address</td><td>internal user id</td></tr>
<tr><td>Connection strings with passwords, private keys, the whole environment at startup</td><td>host and database name only</td></tr>
<tr><td>Full request/response bodies "for debugging"</td><td>the fields you need, by allow-list</td></tr>
</tbody>
</table>
<p>Emails, phone numbers and IP addresses are personal data too. Log them only if there is a purpose (security logs usually need the IP), and keep them shorter (16.1).</p>

<h3>The six ways secrets get in</h3>
<ol>
<li>Logging the whole request (headers, cookies).</li>
<li>Logging the body.</li>
<li>Secrets in the URL query string (password reset links, OAuth codes) — written by every web server and proxy.</li>
<li>Logging whole objects whose <code>toString()</code> or JSON includes secret fields.</li>
<li>Exception messages that contain the secret (a JDBC URL with password, an HTTP client error that includes the request).</li>
<li>Debug output added "temporarily" and never removed (16.6 turns this into a test).</li>
</ol>

<h3>Ways 1 and 2 — Node.js with pino</h3>
${ma('javascript', 's16/bi-mat/app-ro.mjs')}
${lenh('s16/bi-mat', 1)}
${lenh('s16/bi-mat', 2)}
<p>One login request, four secrets, seven copies: pino-http's default request serializer includes <strong>all headers</strong> and the full URL, and it writes them twice (on the custom line and on the automatic "request completed" line). The fix uses pino's built-in <code>redact</code> (fast-redact, fixed paths, wildcards one level deep) and a request serializer that drops the query string:</p>
${ma('javascript', 's16/bi-mat/app-che.mjs')}
${lenh('s16/bi-mat', 3)}
${lenh('s16/bi-mat', 4)}
<p>Zero lines contain a secret. Note what is still there: the <strong>email</strong>. Redaction lists only what you thought of; the stronger design is an allow-list — log <code>userId</code>, not <code>body</code>.</p>

<h3>winston: no built-in redaction</h3>
${ma('javascript', 's16/bi-mat/winston-che.mjs')}
${lenh('s16/bi-mat', 5)}
<p>The format masks by key name, recursively — but the second line put the password inside the <em>message string</em>, and no key-based mask can see it. Never interpolate data into the message; pass it as fields.</p>

<h3>Way 3 — the query string, in nginx</h3>
${ma('nginx', 's16/nginx/nginx.conf')}
${lenh('s16/nginx', 2)}
${lenh('s16/nginx', 3)}
<p>The default <code>combined</code> format logs <code>$request</code>, which includes the query string with a password-reset token and an OAuth code. The <code>che</code> format logs <code>$uri</code> plus a masked copy of the arguments. Limits: this map masks only the first sensitive key; the better fix is not to put secrets in URLs (send them in the body or a header), because browsers, proxies, CDNs and the <code>Referer</code> header leak them too.</p>

<h3>Way 4 — Java: the record that prints its password</h3>
${ma('java', 's16/java/Login.java')}
${ma('xml', 's16/java/logback.xml')}
${lenh('s16/java', 1)}
${lenh('s16/java', 2)}
<p>Java records generate <code>toString()</code> with <em>every</em> component, so <code>log.info("… {}", request)</code> prints the password (line 1 of the first run). Override <code>toString()</code> on any type holding a secret (Lombok: <code>@ToString.Exclude</code>), and log fields, not objects. Logback's <code>%replace(%msg){regex, replacement}</code> is a safety net applied to the formatted message — it caught the token in the URL. For JSON logs (logstash-logback-encoder, lesson 10.7) use its masking support (<code>MaskingJsonGeneratorDecorator</code>) by field path. Since Spring Boot 3.0, <code>/actuator/env</code> and <code>/actuator/configprops</code> hide every value by default (<code>show-values: never</code>) — but nothing masks your own log lines.</p>

<h3>Second layer — mask in the pipeline</h3>
<p>Applications are written by many people; the shipper is configured once. Grafana Alloy (lesson 15.2) can rewrite every line before it leaves the machine:</p>
${ma('hcl', 's16/ong/che.alloy')}
${lenh('s16/ong', 2)}
${lenh('s16/ong', 3)}
<p>All 702 lines passed through; the five planted secrets, the ID number and the card number came out as <code>[CHE]</code>, and gitleaks finds nothing in the result. The pipeline layer is a net, not the fix: the original files on the machine still contain the secrets.</p>

<h3>Find what already leaked — scan the logs</h3>
${lenh('s16/quet', 1)}
${lenh('s16/quet', 2)}
${lenh('s16/quet', 3)}
<p>gitleaks (open source; usually run on git repositories, here with <code>dir</code> on log files) found five secrets with its default rules: a JWT in an access-log URL, an AWS key pair, a GitHub token inside a git URL, a live Stripe key. <code>--redact=60</code> hides most of each secret in the report — a scan report is itself sensitive. The default rules know nothing about Vietnamese personal data, so add your own:</p>
${ma('toml', 's16/quet/luat-viet.toml')}
${lenh('s16/quet', 4)}
${lenh('s16/quet', 5)}
<p>Seven findings now, including the CCCD and the card number. Regex rules give false positives (any 16 digits) and false negatives (numbers written differently) — treat the scan as a smoke detector, run it in CI on test logs and weekly on real ones.</p>

<h3>When it has already leaked</h3>
<ol>
<li><strong>Rotate first</strong>: revoke the key, force a password reset, invalidate sessions. Deleting the log does not un-leak the secret.</li>
<li><strong>Fix the source</strong> so new lines are clean (deploy the redaction).</li>
<li><strong>Find every copy</strong>: files and rotated <code>.gz</code> on every server, the central store (Loki has a delete API for a stream and time range; Elasticsearch <code>_delete_by_query</code>), backups, SIEM, tickets, chat. Immutable archives (16.4) cannot be edited — another reason to mask before shipping.</li>
<li><strong>Record and report</strong>: an incident ticket with what, since when, who could read it. If personal data was exposed, legal duties to notify may apply (Vietnam's Personal Data Protection Law 2025, GDPR — the Incident Response course covers it).</li>
</ol>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"What must never be logged?" — passwords, tokens/cookies/Authorization, full card numbers and CVV, ID numbers, keys and connection strings; log ids instead.</li>
<li>"How do you stop it in Node/Spring?" — pino <code>redact</code> / custom serializers; Spring: log fields not objects, override <code>toString</code>, encoder masking; plus a pipeline layer and a test (16.6).</li>
<li>"A token appeared in the logs — what do you do?" — revoke first, then fix, then purge copies, then document/notify.</li>
<li>"Why is a token in the URL worse than in a header?" — every proxy/CDN/web server logs the URL, it leaks via Referer and browser history.</li>
</ul>

<h3>Real-world situations</h3>
<ul>
<li><strong>Outsourcing</strong>: the customer sends you a zip of production logs to debug. Scan it first (gitleaks + your rules), keep it in an encrypted folder, delete it when the ticket closes, and tell the customer what you found.</li>
<li><strong>Code review</strong>: any new <code>log.*(req)</code>, <code>log.*(body)</code> or <code>console.log</code> of an object is a review comment.</li>
</ul>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok"><ol>
<li>Run <code>app-ro.mjs</code>, then make <code>app-che.mjs</code> also hide the email. Which approach did you pick?</li>
<li>Write a gitleaks rule for Vietnamese phone numbers (<code>0</code> + 9 digits, starting 03/05/07/08/09) and run it on <code>logs/</code>.</li>
<li>Find one place in your own project where a whole object or request is logged.</li>
</ol>
<p><strong>Pass:</strong> (1) best answer: stop logging <code>body</code> and log <code>{ userId }</code> (allow-list); adding <code>'*.email'</code> to <code>redact</code> also works; (2) a rule like <code>\\b0(?:3|5|7|8|9)[0-9]{8}\\b</code> — 0 findings on the course logs, then add a test line to see it fire (use <code>(?:…)</code>: with a capturing group gitleaks reports group 1 as the secret — you would see just <code>9</code>); (3) a file and line, with the replacement.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Redaction', 'Replacing a sensitive value with a placeholder before writing.'],
  ['Allow-list logging', 'Logging only fields you chose, instead of whole objects.'],
  ['PAN', 'Primary Account Number — the full card number.'],
  ['gitleaks', 'Open-source scanner for secrets in git history or files.'],
  ['stage.replace', 'Alloy pipeline stage that rewrites matches of a regex.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Twitter 2018, GitHub 2018, Facebook 2019 (€91M fine): plaintext passwords via logging, not hacking.</li>
<li>Six ways in; close each: redact/serializers, allow-list fields, no secrets in URLs, safe toString, careful exceptions, no temporary debug.</li>
<li>Second layer in the pipeline; scan logs with your own rules for local data.</li>
<li>Leaked: rotate first, then purge every copy.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.3</span>
<h2>Dòng log không bao giờ được ghi</h2>
<p class="lead">Log bị sao chép đi khắp nơi: xuống đĩa, lên kho trung tâm, vào bản sao lưu, vào laptop đồng nghiệp lúc xử lý sự cố, vào ticket, vào nhóm chat. Bí mật nào chạm tới một dòng log là chạm tới tất cả những nơi đó, và bị đọc bởi những người chẳng bao giờ cần nó. Bài này chỉ ra sáu đường bí mật lọt vào log và chặn từng đường bằng cách sửa chạy thật.</p>

<h3>Liên tưởng đời thường: sổ khách của toà nhà</h3>
<p>Sổ khách ghi ai tới, lúc nào, lên căn hộ nào. Ghi thêm cả mã cửa mỗi người khách đã bấm thì thật vô lý. Vậy mà ứng dụng làm đúng như thế khi ghi log nguyên request: ai, lúc nào, đi đâu — và cả chìa khoá.</p>

<h3>Ba sự cố thật</h3>
<ul>
<li><strong>Twitter, tháng 5/2018.</strong> Đúng Ngày Mật khẩu Thế giới, Twitter đề nghị toàn bộ người dùng — khi đó 330 triệu — cân nhắc đổi mật khẩu: một lỗi đã ghi mật khẩu vào log nội bộ <em>trước</em> bước băm bcrypt. Không thấy dấu hiệu bị lạm dụng; sửa thì dễ; cái giá về niềm tin thì không.</li>
<li><strong>GitHub, tháng 5/2018.</strong> Một lỗi mới đưa vào đã ghi mật khẩu dạng rõ vào log nội bộ khi người dùng đặt lại mật khẩu. Phát hiện nhờ kiểm tra định kỳ; một số ít người dùng phải đặt lại mật khẩu lần nữa.</li>
<li><strong>Facebook, tháng 3/2019.</strong> KrebsOnSecurity đưa tin hàng trăm triệu mật khẩu nằm dạng rõ trong hệ thống nội bộ nhiều năm và nhiều nhân viên tìm kiếm được; Facebook xác nhận mật khẩu bị "lưu ở dạng đọc được trong các hệ thống lưu trữ dữ liệu nội bộ" và thông báo cho hàng trăm triệu người dùng Facebook Lite cùng hàng triệu người dùng Facebook và Instagram. Tháng 9/2024, Uỷ ban Bảo vệ Dữ liệu Ireland phạt Meta <strong>91 triệu euro</strong> vì việc này theo GDPR.</li>
</ul>
<p>Không vụ nào là bị hack. Cả ba đều do ghi log. Dự án của bạn sẽ không lên báo, nhưng một token trong log đưa cho đối tác outsourcing, hay một số CCCD trong log mà cả đội grep được, là cùng một lỗi ở cỡ nhỏ hơn.</p>

<h3>Danh sách: không bao giờ có trong log</h3>
<table>
<thead><tr><th>Không bao giờ</th><th>Ghi thay vào đó</th></tr></thead>
<tbody>
<tr><td>Mật khẩu, mã PIN, mã OTP, câu trả lời bảo mật</td><td>"đăng nhập thất bại userId=u_42, lý do=sai_mat_khau"</td></tr>
<tr><td>Session id, cookie, access/refresh token, API key, header <code>Authorization</code></td><td>mã định danh token (<code>jti</code>) hoặc 4 ký tự cuối</td></tr>
<tr><td>Số thẻ đầy đủ (PAN), CVV — CVV không được lưu ở bất cứ đâu (PCI DSS)</td><td>4 số cuối, mã giao dịch của cổng thanh toán</td></tr>
<tr><td>Số CCCD, hộ chiếu, dữ liệu sức khoẻ, địa chỉ chính xác</td><td>mã người dùng nội bộ</td></tr>
<tr><td>Chuỗi kết nối có mật khẩu, khoá riêng, toàn bộ biến môi trường lúc khởi động</td><td>chỉ tên máy và tên CSDL</td></tr>
<tr><td>Nguyên body request/response "để gỡ lỗi"</td><td>các trường cần thiết, theo danh sách cho phép</td></tr>
</tbody>
</table>
<p>Email, số điện thoại và địa chỉ IP cũng là dữ liệu cá nhân. Chỉ ghi khi có mục đích (log bảo mật thường cần IP), và giữ ngắn hơn (16.1).</p>

<h3>Sáu đường bí mật lọt vào</h3>
<ol>
<li>Ghi nguyên request (header, cookie).</li>
<li>Ghi body.</li>
<li>Bí mật nằm trong query string của URL (liên kết đặt lại mật khẩu, mã OAuth) — mọi web server và proxy đều ghi.</li>
<li>Ghi nguyên đối tượng mà <code>toString()</code> hoặc JSON của nó có trường bí mật.</li>
<li>Thông điệp exception chứa bí mật (JDBC URL có mật khẩu, lỗi của HTTP client kèm cả request).</li>
<li>Dòng debug thêm "tạm" rồi không bao giờ xoá (bài 16.6 biến nó thành phép thử).</li>
</ol>

<h3>Đường 1 và 2 — Node.js với pino</h3>
${ma('javascript', 's16/bi-mat/app-ro.mjs')}
${lenh('s16/bi-mat', 1)}
${lenh('s16/bi-mat', 2)}
<p>Một request đăng nhập, bốn bí mật, bảy bản sao: serializer request mặc định của pino-http có <strong>mọi header</strong> và nguyên URL, và nó ghi hai lần (ở dòng tự viết và ở dòng "request completed" tự động). Cách sửa dùng <code>redact</code> có sẵn của pino (fast-redact, đường dẫn cố định, dấu * một cấp) và một serializer request bỏ query string:</p>
${ma('javascript', 's16/bi-mat/app-che.mjs')}
${lenh('s16/bi-mat', 3)}
${lenh('s16/bi-mat', 4)}
<p>Không dòng nào còn bí mật. Để ý cái vẫn còn: <strong>email</strong>. Danh sách che chỉ có những gì bạn đã nghĩ tới; thiết kế chắc hơn là danh sách cho phép — ghi <code>userId</code>, đừng ghi <code>body</code>.</p>

<h3>winston: không có che sẵn</h3>
${ma('javascript', 's16/bi-mat/winston-che.mjs')}
${lenh('s16/bi-mat', 5)}
<p>Format này che theo tên khoá, đệ quy — nhưng dòng thứ hai nhét mật khẩu vào <em>chuỗi thông điệp</em>, và không cách che theo khoá nào nhìn thấy được. Không bao giờ ghép dữ liệu vào thông điệp; truyền nó thành trường.</p>

<h3>Đường 3 — query string, ở nginx</h3>
${ma('nginx', 's16/nginx/nginx.conf')}
${lenh('s16/nginx', 2)}
${lenh('s16/nginx', 3)}
<p>Định dạng <code>combined</code> mặc định ghi <code>$request</code>, gồm cả query string với token đặt lại mật khẩu và mã OAuth. Định dạng <code>che</code> ghi <code>$uri</code> cộng bản đã che của tham số. Giới hạn: map này chỉ che khoá nhạy cảm đầu tiên; cách tốt hơn là đừng đặt bí mật vào URL (gửi trong body hoặc header), vì trình duyệt, proxy, CDN và header <code>Referer</code> cũng làm lộ nó.</p>

<h3>Đường 4 — Java: record tự in mật khẩu</h3>
${ma('java', 's16/java/Login.java')}
${ma('xml', 's16/java/logback.xml')}
${lenh('s16/java', 1)}
${lenh('s16/java', 2)}
<p>Record của Java tự sinh <code>toString()</code> có <em>mọi</em> thành phần, nên <code>log.info("… {}", request)</code> in luôn mật khẩu (dòng 1 của lần chạy đầu). Ghi đè <code>toString()</code> cho mọi kiểu chứa bí mật (Lombok: <code>@ToString.Exclude</code>), và ghi trường chứ đừng ghi đối tượng. <code>%replace(%msg){regex, thay}</code> của Logback là lưới an toàn áp lên thông điệp đã định dạng — nó bắt được token trong URL. Với log JSON (logstash-logback-encoder, bài 10.7) dùng tính năng che của nó (<code>MaskingJsonGeneratorDecorator</code>) theo đường dẫn trường. Từ Spring Boot 3.0, <code>/actuator/env</code> và <code>/actuator/configprops</code> mặc định giấu mọi giá trị (<code>show-values: never</code>) — nhưng không có gì che dòng log bạn tự viết.</p>

<h3>Lớp thứ hai — che ở đường ống</h3>
<p>Ứng dụng do nhiều người viết; bộ gửi log chỉ cấu hình một lần. Grafana Alloy (bài 15.2) có thể viết lại mọi dòng trước khi nó rời máy:</p>
${ma('hcl', 's16/ong/che.alloy')}
${lenh('s16/ong', 2)}
${lenh('s16/ong', 3)}
<p>Cả 702 dòng đi qua; năm bí mật cài sẵn, số CCCD và số thẻ đều ra thành <code>[CHE]</code>, và gitleaks không tìm thấy gì trong kết quả. Lớp đường ống là lưới đỡ, không phải cách sửa: tệp gốc trên máy vẫn còn bí mật.</p>

<h3>Tìm cái đã lọt — quét log</h3>
${lenh('s16/quet', 1)}
${lenh('s16/quet', 2)}
${lenh('s16/quet', 3)}
<p>gitleaks (mã nguồn mở; thường chạy trên kho git, ở đây dùng lệnh <code>dir</code> cho tệp log) tìm được năm bí mật bằng luật mặc định: một JWT trong URL của access log, một cặp khoá AWS, một token GitHub nằm trong URL git, một khoá Stripe live. <code>--redact=60</code> giấu phần lớn mỗi bí mật trong báo cáo — chính báo cáo quét cũng là thứ nhạy cảm. Luật mặc định không biết gì về dữ liệu cá nhân Việt Nam, nên hãy thêm luật của bạn:</p>
${ma('toml', 's16/quet/luat-viet.toml')}
${lenh('s16/quet', 4)}
${lenh('s16/quet', 5)}
<p>Giờ là bảy phát hiện, có cả CCCD và số thẻ. Luật regex có báo nhầm (16 chữ số bất kỳ) và bỏ sót (số viết kiểu khác) — coi phép quét như máy báo khói, chạy trong CI trên log thử và mỗi tuần trên log thật.</p>

<h3>Khi đã lỡ lọt</h3>
<ol>
<li><strong>Thu hồi trước</strong>: huỷ khoá, bắt đổi mật khẩu, vô hiệu phiên. Xoá log không làm bí mật "hết lộ".</li>
<li><strong>Sửa nguồn</strong> để dòng mới sạch (deploy phần che).</li>
<li><strong>Tìm mọi bản sao</strong>: tệp và các <code>.gz</code> đã xoay trên mọi máy, kho trung tâm (Loki có API xoá theo luồng và khoảng thời gian; Elasticsearch có <code>_delete_by_query</code>), bản sao lưu, SIEM, ticket, chat. Kho bất biến (16.4) không sửa được — thêm một lý do để che trước khi gửi.</li>
<li><strong>Ghi lại và báo cáo</strong>: một ticket sự cố ghi rõ cái gì, từ khi nào, ai đọc được. Nếu dữ liệu cá nhân bị lộ, có thể phát sinh nghĩa vụ thông báo theo luật (Luật Bảo vệ dữ liệu cá nhân 2025, GDPR — khoá Incident Response có bài riêng).</li>
</ol>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Cái gì không bao giờ được ghi log?" — mật khẩu, token/cookie/Authorization, số thẻ đầy đủ và CVV, số định danh, khoá và chuỗi kết nối; ghi mã định danh thay vào.</li>
<li>"Chặn thế nào trong Node/Spring?" — <code>redact</code> / serializer riêng của pino; Spring: ghi trường không ghi đối tượng, ghi đè <code>toString</code>, che ở encoder; cộng thêm lớp đường ống và một phép thử (16.6).</li>
<li>"Một token xuất hiện trong log — bạn làm gì?" — thu hồi trước, rồi sửa, rồi xoá các bản sao, rồi ghi nhận/thông báo.</li>
<li>"Vì sao token trong URL tệ hơn trong header?" — mọi proxy/CDN/web server đều ghi URL, nó lộ qua Referer và lịch sử trình duyệt.</li>
</ul>

<h3>Tình huống đi làm thật</h3>
<ul>
<li><strong>Outsourcing</strong>: khách gửi một tệp zip log production để bạn gỡ lỗi. Quét trước (gitleaks + luật của bạn), để trong thư mục mã hoá, xoá khi đóng ticket, và báo cho khách biết bạn tìm thấy gì.</li>
<li><strong>Review mã</strong>: mọi <code>log.*(req)</code>, <code>log.*(body)</code> hay <code>console.log</code> một đối tượng mới thêm đều đáng một bình luận review.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Chạy <code>app-ro.mjs</code>, rồi sửa <code>app-che.mjs</code> để che luôn email. Bạn chọn cách nào?</li>
<li>Viết luật gitleaks cho số điện thoại Việt Nam (<code>0</code> + 9 chữ số, đầu 03/05/07/08/09) và chạy trên <code>logs/</code>.</li>
<li>Tìm một chỗ trong dự án của chính bạn đang ghi nguyên đối tượng hoặc nguyên request.</li>
</ol>
<p><strong>Đạt khi:</strong> (1) đáp án tốt nhất: thôi ghi <code>body</code>, ghi <code>{ userId }</code> (danh sách cho phép); thêm <code>'*.email'</code> vào <code>redact</code> cũng được; (2) một luật kiểu <code>\\b0(?:3|5|7|8|9)[0-9]{8}\\b</code> — 0 phát hiện trên log của khoá, rồi thêm một dòng thử để thấy nó bắt (dùng <code>(?:…)</code>: nếu là nhóm bắt thì gitleaks lấy nhóm 1 làm bí mật — bạn sẽ chỉ thấy <code>9</code>); (3) tên tệp và dòng, kèm cách thay.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Che (redaction)', 'Thay giá trị nhạy cảm bằng chuỗi giữ chỗ trước khi ghi.'],
  ['Ghi theo danh sách cho phép', 'Chỉ ghi các trường đã chọn, thay vì nguyên đối tượng.'],
  ['PAN', 'Primary Account Number — số thẻ đầy đủ.'],
  ['gitleaks', 'Công cụ mã nguồn mở quét bí mật trong lịch sử git hoặc tệp.'],
  ['stage.replace', 'Bước đường ống của Alloy viết lại phần khớp regex.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Twitter 2018, GitHub 2018, Facebook 2019 (phạt 91 triệu €): mật khẩu dạng rõ do ghi log, không phải bị hack.</li>
<li>Sáu đường lọt; chặn từng đường: redact/serializer, danh sách trường cho phép, không đặt bí mật vào URL, toString an toàn, cẩn thận với exception, không debug "tạm".</li>
<li>Lớp thứ hai ở đường ống; quét log với luật riêng cho dữ liệu trong nước.</li>
<li>Đã lọt: thu hồi trước, rồi xoá mọi bản sao.</li>
</ul>
${nguon('🛡️', 'The Register — Twitter: everyone needs to change their password (3/5/2018)', '330 triệu người dùng, mật khẩu không mã hoá trong log nội bộ', 'https://www.theregister.com/2018/05/03/twitter_no_big_deal_but_everyone_needs_to_change_their_password_right_now/')}
${nguon('🛡️', 'Bitdefender — GitHub bug internally exposes passwords in plaintext (5/2018)', 'Lỗi ghi mật khẩu vào log nội bộ khi đặt lại mật khẩu', 'https://www.bitdefender.com/blog/hotforsecurity/unspecified-github-bug-internally-exposes-passwords-in-plaintext/')}
${nguon('🛡️', 'KrebsOnSecurity — Facebook stored hundreds of millions of user passwords in plain text (21/3/2019)', 'Tin gốc của vụ việc', 'https://krebsonsecurity.com/2019/03/facebook-stored-hundreds-of-millions-of-user-passwords-in-plain-text-for-years/')}
${nguon('🛡️', 'Facebook Newsroom — Keeping Passwords Secure (21/3/2019)', 'Xác nhận của Facebook', 'https://about.fb.com/news/2019/03/keeping-passwords-secure/')}
${nguon('⚖️', 'Data Protection Commission (Ireland) — €91 million fine of Meta (27/9/2024)', 'Quyết định phạt theo GDPR về lưu mật khẩu dạng rõ', 'https://www.dataprotection.ie/en/news-media/press-releases/DPC-announces-91-million-fine-of-Meta')}
${nguon('📘', 'OWASP — Logging Cheat Sheet', 'Mục "Data to exclude"', 'https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html')}
${nguon('📘', 'pino — Redaction', 'redact.paths, censor, wildcard', 'https://getpino.io/#/docs/redaction')}
${nguon('📘', 'gitleaks', 'Luật mặc định, [extend] useDefault, lệnh dir', 'https://github.com/gitleaks/gitleaks')}
${lienKet({ khoa: 'web-security', bai: 'sec-9-1-log', title: 'Web Security 9.1 — Ghi log bảo mật mà không làm lộ dữ liệu', sub: 'Phía ứng dụng web Node + Next.js', cta: 'Mở bài' })}
${lienKet({ khoa: 'privacy-data-law', bai: 'pdl-5-2-toi-thieu', title: 'Privacy & Data Law 5.2 — Tối thiểu hoá: form, log, analytics', sub: 'Góc pháp lý của việc ghi dữ liệu cá nhân', cta: 'Mở bài' })}
${lienKet({ khoa: 'incident-response', bai: 'ir-7-4-playbook-lo-bi-mat', title: 'Incident Response 7.4 — Playbook: bí mật lộ lên GitHub hoặc vào log', sub: 'Quy trình đầy đủ khi đã lọt', cta: 'Mở bài' })}
</div>
`,
};
