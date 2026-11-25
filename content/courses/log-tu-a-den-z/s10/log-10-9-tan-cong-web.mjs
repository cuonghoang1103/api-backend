/**
 * 10.9 — Tấn công nhìn thấy trong log web (soạn 24/11/2026).
 * Output thật: OUT['s10/tan-cong'] — log Lab 10: máy quét giả (UA Nikto, IP 203.0.113.66), dò mật khẩu từ 3 IP 192.0.2.51–53,
 * payload SQLi/XSS/path traversal/Log4Shell (chỉ bắn vào lab), thử chèn log vào pino. Sự cố Equifax: báo cáo Hạ viện Mỹ 12/2018 (đã đọc bản PDF).
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '10.9 — Attacks visible in web logs: scanners, SQLi/XSS/path traversal patterns, 404 storms, credential stuffing, log injection|||10.9 — Tấn công nhìn thấy trong log web: máy quét, mẫu SQLi/XSS/path traversal, bão 404, credential stuffing, chèn log',
  slug: 'log-10-9-tan-cong-web',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Trên log thật của Lab 10: tìm IP gây nhiều 4xx nhất và đọc "lộ trình" của một máy quét (/.env, /.git/config, /wp-login.php, /actuator/env); User-Agent hiếm là nơi kẻ xấu ẩn mình; regex bắt SQLi, XSS, path traversal ở dạng mã hoá URL; nhận ra dò mật khẩu phân tán qua nhiều IP và vai trò của 429; dấu vết dò Log4Shell; chèn log bằng ký tự xuống dòng — log chữ bị lừa, log JSON thì không; 200 không có nghĩa là an toàn và 404 không có nghĩa là vô hại; vụ Equifax 2017: 76 ngày trong hệ thống vì thiết bị giám sát hết hạn chứng chỉ.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.9</span>
<h2>Attacks in web logs: reading the footprints</h2>
<p class="lead">Put any server on the Internet and within minutes its access log fills with requests nobody you know sent: scanners looking for leaked files, scripts trying passwords, payloads hoping something is vulnerable. Most are noise; a few matter. This lesson teaches you to recognise each kind in the Lab 10 logs — whose "attacks" came from our own script against our own lab — and to tell "someone tried" from "someone succeeded". Writing detection rules is the SIEM course's job; here you learn to see.</p>

<h3>The everyday picture: footprints in the snow</h3>
<p>Overnight snow shows who walked around your house. Footprints that go from window to window and stop at each one are not the postman. Footprints that reach the back door and then go <em>inside</em> are a different level of problem. Access logs are the snow: the path (which URLs, in which order), the pace (how fast), and where the tracks end (status codes) tell you who was there and what they wanted.</p>

<h3>Step 1 — who is noisy?</h3>
${lenh('s10/tan-cong', 0)}
${lenh('s10/tan-cong', 1)}
<p>One IP, 13 requests in four seconds, almost all 4xx: <code>/.env</code> (environment file with database passwords and API keys), <code>/.git/config</code> (a deployed Git folder leaks the whole source code), <code>/wp-login.php</code> and <code>/phpmyadmin/</code> (popular software, maybe unpatched), <code>/server-status</code> (Apache's status page), <code>/backup.zip</code>, <code>/config.php.bak</code>, <code>/actuator/env</code> (Spring Boot Actuator — lesson 10.5). This is a <strong>generic scanner</strong>: it does not know what your app is, it asks every server the same questions. The defence is to make sure every answer is 404 — and to check that it <em>really</em> is (a <code>200</code> on <code>/.env</code> is an incident).</p>
<div class="pitfall co-tieu-de"><p><strong>"200" does not mean safe; "404" does not mean harmless.</strong> Look at the three 200s: <code>UNION SELECT</code>, <code>&lt;script&gt;</code> and <code>\${jndi</code> all got 200, because <code>/api/products</code> ignores unknown query parameters. A 200 says "the server answered", not "the attack failed" or "the attack worked". Whether a payload worked is decided by what the app <em>did</em> with it — app logs, database logs, outgoing connections. And a 404 storm can hide one 200 in the middle: always filter the attacker's IP for non-4xx answers.</p></div>

<h3>Step 2 — rare user agents are where attackers hide</h3>
${lenh('s10/tan-cong', 2)}
<p>Sort user agents by count and read the <em>bottom</em> of the list. Real browsers produce one dominant string; the rare ones are a scanner announcing itself (<code>Nikto/2.5.0</code>), a script (<code>python-requests</code>, <code>curl</code>), and a user agent that <em>is</em> an attack (<code>\${jndi:ldap://…}</code>). <code>-</code> twice: those are the 400s, rejected before headers were read (10.1). Careful scanners fake a browser string, so UA is a hint, never proof.</p>

<h3>Step 3 — injection patterns in URLs</h3>
${lenh('s10/tan-cong', 3)}
<table>
<thead><tr><th>Attack</th><th>Looks like in logs</th><th>Note</th></tr></thead>
<tbody>
<tr><td>SQL injection</td><td><code>%27</code> (<code>'</code>), <code>UNION SELECT</code>, <code>OR 1=1</code>, <code>SLEEP(5)</code>, <code>--</code></td><td><code>SLEEP</code>-style payloads show up as <code>rt</code> ≈ 5 s with status 200 — timing is evidence</td></tr>
<tr><td>XSS</td><td><code>%3Cscript%3E</code>, <code>onerror=</code>, <code>javascript:</code></td><td>Dangerous later, when the stored value is shown — maybe in your log viewer</td></tr>
<tr><td>Path traversal</td><td><code>../</code>, <code>..%2f</code>, <code>%2e%2e</code>, <code>/etc/passwd</code>, <code>win.ini</code></td><td>nginx answered 400 and logged the Docker gateway IP — attacker IP lost (10.1)</td></tr>
<tr><td>Command injection</td><td><code>;id</code>, <code>|whoami</code>, <code>$(…)</code>, <code>/bin/sh</code></td><td>The <code>/cgi-bin/.%2e/…/bin/sh</code> line is a known Apache path-traversal-to-RCE probe (CVE-2021-41773)</td></tr>
<tr><td>Log4Shell</td><td><code>\${jndi:</code>, <code>%24%7Bjndi</code>, <code>\${\${lower:j}ndi</code></td><td>Lesson 10.7; anywhere: path, query, UA, Referer, form fields</td></tr>
</tbody></table>
<p>Always search the <strong>URL-encoded</strong> forms too: the access log records the request as sent. Decode a suspicious line by hand with <code>python3 -c "import urllib.parse,sys; print(urllib.parse.unquote(sys.argv[1]))" '…'</code>.</p>

<h3>Step 4 — password guessing spread over IPs</h3>
${lenh('s10/tan-cong', 4)}
<p>Three IPs, same user agent, same endpoint, each 4 × 401 then 2 × 429. Per IP it looks small; together it is one attack — 18 attempts on 18 different email addresses with the same password <code>123456</code> (we can see the users in the app log, never the password). Trying a few common passwords against many accounts is <strong>password spraying</strong>; trying leaked email/password pairs from other sites is <strong>credential stuffing</strong>. Both are spread across many IPs (often residential proxies) precisely to stay under per-IP limits. Group by <em>endpoint + status + user agent</em> over time, not only by IP. The rate limit did its job: after 4 tries per IP, nginx answered 429 and the app never saw the rest. The critical question in a real case: <strong>did any of those IPs get a 200 on <code>/api/login</code></strong>? Here no. Chapter 14 goes deeper.</p>

<h3>Step 5 — Log4Shell probes</h3>
${lenh('s10/tan-cong', 5)}
<p>Payload in both the query string (URL-encoded) and the User-Agent, pointing back to the attacker's own IP on port 1389. Mechanism and safe reproduction: lesson 10.7. What to check next: does any service behind this proxy use <code>log4j-core</code> ≤ 2.14.1, and did any server open a connection to <code>203.0.113.66:1389</code> (firewall/DNS logs, Chapter 11)?</p>

<h3>Step 6 — log injection: forging a line</h3>
${lenh('s10/tan-cong', 6)}
<p>A text logger writes <code>login failed user=%s</code>. If the username contains a newline, the attacker writes a <em>second, fake line</em>: "INFO login ok user=admin". Whoever reads the log (or a script counting successful logins) is fooled — and a fake "login ok" can be planted to hide a real one or to frame someone. OWASP calls this log injection / log forging (CWE-117).</p>
${lenh('s10/tan-cong', 7)}
<p>The same attempt against our pino app: one record, level 40, the forged text trapped inside the <code>user</code> field with <code>\\n</code> escaped. Defences: structured JSON logging; for text logs, replace or escape CR/LF and control characters before logging; validate identifiers (the request-id regex in 10.6); and make your log viewer escape HTML, because a logged <code>&lt;script&gt;</code> becomes stored XSS in a web-based log dashboard.</p>

<h3>Hacker's corner, real incident: Equifax 2017 — the logs that nobody could see</h3>
<p>On 7 March 2017 a critical vulnerability in Apache Struts (CVE-2017-5638, exploited through a crafted <code>Content-Type</code> header) was published; Equifax did not patch one legacy dispute portal. Attackers entered on <strong>13 May 2017</strong>, installed web shells, found a file with plaintext credentials, queried databases about 265 times and left with personal data of about <strong>148 million</strong> people. They stayed <strong>76 days</strong>. Why so long? According to the US House Oversight Committee report (December 2018), the device that inspected traffic for that system had been inactive for <strong>19 months</strong> because its SSL certificate had expired; when the certificate was renewed on 29 July 2017, staff noticed suspicious traffic almost immediately. Lessons for log readers: (1) a log or monitor that silently stops is worse than none — check that your sources are still sending (Chapter 15 alerts on silence); (2) exploit attempts against known CVEs appear in access logs <em>before</em> the breach — Step 3's patterns; (3) web shells show up as requests to new, odd files with 200 responses and unusual parameters (SIEM course).</p>

<h3>Real-life situations</h3>
<ul>
<li><strong>First week of OJT, the client's CISO forwards a scanner report:</strong> "Your site received 3,000 attacks yesterday." You answer with numbers from the log: how many distinct IPs, which paths, and the key fact — every probe got 404/403, no unexpected 200, no outbound connections. Calm, evidence-based answers build trust.</li>
<li><strong>Your VPS for a student project:</strong> <code>/var/log/nginx/access.log</code> shows <code>/wp-login.php</code> every minute. It is not personal; it is background radiation. Make sure secrets are not served (<code>.env</code>, <code>.git</code>), add rate limits on login, and move on.</li>
<li><strong>What if</strong> you find a 200 on <code>/.git/config</code>? Treat it as an incident: the source code (and any secrets ever committed) may be public. Block the path, rotate secrets, check what else that IP downloaded (Chapter 14).</li>
</ul>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok"><ol>
<li>Write one command that lists, for each IP with at least 5 requests in 4xx, how many distinct paths it requested.</li>
<li>Prove with one command that the scanner IP never received a 2xx on anything except <code>/api/products</code>.</li>
<li>Decode the SQLi and XSS lines with Python's <code>unquote</code> and write what each was trying to do.</li>
<li>Write a regex (<code>grep -E</code>) that catches <code>\${jndi</code> in plain, URL-encoded and <code>\${lower:j}</code> obfuscated forms; test it against three strings you craft.</li>
</ol>
<p><strong>Done when:</strong> 1 shows the scanner with 10 distinct 4xx paths and the three password IPs with 1 each; 2 prints only <code>/api/products?…</code> lines for 2xx; 3 explains "dump usernames and passwords" and "run JavaScript in a victim's page"; 4 matches all three test strings.</p></div>

<h3>🎤 Interview questions on this chapter</h3>
<ul>
<li>"Users get 502 sometimes. Where do you look first, and what is the difference between 502 and 504?" (10.1–10.2: error log line, connect() failed vs timed out, app restarts.)</li>
<li>"How do you follow one request through nginx and your Spring/Node service?" (Request id / traceId in both logs; MDC; X-Request-Id.)</li>
<li>"Why is <code>log.debug("x=" + obj)</code> bad, and what is SLF4J?" (10.6–10.7.)</li>
<li>"Explain Log4Shell in two minutes. Was your project affected — how would you check?" (Lookups in logged data; <code>dependency:tree | grep log4j-core</code>.)</li>
<li>"What must never be written to logs?" (Passwords, tokens, cookies, full card numbers, unnecessary personal data — Twitter 2018, Facebook 2019; lesson 16.3.)</li>
</ul>

<h3>🗂 Key terms</h3>
${kv([
  ['scanner', 'Automated tool requesting known sensitive paths/vulnerabilities on many servers (Nikto, nuclei, custom bots).'],
  ['credential stuffing / password spraying', 'Login attempts with leaked pairs / few common passwords over many accounts, spread across IPs.'],
  ['path traversal', 'Using ../ (often encoded) to reach files outside the web root.'],
  ['log injection (CWE-117)', 'Inserting CR/LF or markup into logged data to forge lines or attack log viewers.'],
  ['web shell', 'Malicious script uploaded to a web server to run commands through HTTP requests.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Group by IP, then read the attacker's path list; check for any non-4xx in the middle of a 404 storm.</li>
<li>Read the rare end of the user-agent list; UA is a hint, not proof.</li>
<li>Search payloads in plain and URL-encoded forms; timing (rt ≈ 5 s) can reveal blind SQLi.</li>
<li>Password attacks are spread over IPs — group by endpoint + status + UA; the question is "any 200?".</li>
<li>Text logs can be forged with newlines; JSON escapes them. Monitoring that silently stops (Equifax) is the worst gap.</li>
</ul>
${nguon('📘', 'OWASP — Logging Cheat Sheet', 'What to log, what never to log, log injection', 'https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html')}
${nguon('📘', 'OWASP — Log Injection', 'CWE-117 explained with examples', 'https://owasp.org/www-community/attacks/Log_Injection')}
${nguon('📘', 'OWASP Top 10 — A09 Security Logging and Monitoring Failures', 'Why missing or ignored logs make breaches last', 'https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/')}
${nguon('🛡', 'US House Oversight Committee — The Equifax Data Breach (12/2018)', 'Struts CVE, 76 days, expired certificate on the monitoring device', 'https://oversight.house.gov/wp-content/uploads/2018/12/Equifax-Report.pdf')}
${lienKet({ khoa: 'web-security', bai: 'sec-9-1-log', title: 'Web Security 9.1 — Security logging', sub: 'Designing the security events your app should log', cta: 'Open lesson' })}
${lienKet({ khoa: 'blue-team-siem', bai: 'siem-6-3-web-shell', title: 'Blue Team & SIEM 6.3 — Web attacks and web shells', sub: 'Turning these patterns into detection rules', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.9</span>
<h2>Tấn công trong log web: đọc dấu chân</h2>
<p class="lead">Đặt bất kỳ server nào lên Internet và chỉ vài phút sau access log của nó đầy những request chẳng người quen nào gửi: máy quét đi tìm tệp bị lộ, script thử mật khẩu, payload mong có chỗ nào đó có lỗ hổng. Phần lớn là nhiễu; vài cái thì quan trọng. Bài này dạy bạn nhận ra từng loại trong log Lab 10 — nơi các "đòn tấn công" đến từ chính script của ta bắn vào chính lab của ta — và phân biệt "có kẻ đã thử" với "có kẻ đã thành công". Viết luật phát hiện là việc của khoá SIEM; ở đây bạn học cách nhìn.</p>

<h3>Liên tưởng đời thường: dấu chân trên tuyết</h3>
<p>Tuyết rơi qua đêm cho thấy ai đã đi quanh nhà bạn. Dấu chân đi từ cửa sổ này sang cửa sổ khác và dừng lại ở từng cái thì không phải của người đưa thư. Dấu chân tới cửa sau rồi đi <em>vào trong</em> là chuyện ở cấp độ khác hẳn. Access log là lớp tuyết: lộ trình (URL nào, theo thứ tự nào), nhịp độ (nhanh cỡ nào), và nơi dấu chân dừng lại (mã trạng thái) cho bạn biết ai đã ở đó và họ muốn gì.</p>

<h3>Bước 1 — ai đang ồn ào?</h3>
${lenh('s10/tan-cong', 0)}
${lenh('s10/tan-cong', 1)}
<p>Một IP, 13 request trong bốn giây, gần như toàn 4xx: <code>/.env</code> (tệp biến môi trường chứa mật khẩu CSDL và khoá API), <code>/.git/config</code> (thư mục Git bị deploy lên làm lộ toàn bộ mã nguồn), <code>/wp-login.php</code> và <code>/phpmyadmin/</code> (phần mềm phổ biến, biết đâu chưa vá), <code>/server-status</code> (trang trạng thái của Apache), <code>/backup.zip</code>, <code>/config.php.bak</code>, <code>/actuator/env</code> (Spring Boot Actuator — bài 10.5). Đây là một <strong>máy quét đại trà</strong>: nó không biết app của bạn là gì, nó hỏi mọi server cùng một bộ câu. Cách phòng thủ là bảo đảm mọi câu trả lời đều là 404 — và kiểm tra xem có <em>thật</em> là vậy không (một cái <code>200</code> cho <code>/.env</code> là một sự cố).</p>
<div class="pitfall co-tieu-de"><p><strong>"200" không có nghĩa là an toàn; "404" không có nghĩa là vô hại.</strong> Nhìn ba cái 200: <code>UNION SELECT</code>, <code>&lt;script&gt;</code> và <code>\${jndi</code> đều nhận 200, vì <code>/api/products</code> bỏ qua tham số lạ. 200 nghĩa là "server đã trả lời", không phải "đòn tấn công thất bại" hay "đòn tấn công thành công". Payload có tác dụng hay không được quyết định bởi việc app đã <em>làm gì</em> với nó — log app, log CSDL, kết nối đi ra. Và một cơn bão 404 có thể giấu một cái 200 ở giữa: luôn lọc IP của kẻ tấn công để tìm câu trả lời không phải 4xx.</p></div>

<h3>Bước 2 — User-Agent hiếm là nơi kẻ xấu ẩn mình</h3>
${lenh('s10/tan-cong', 2)}
<p>Xếp user agent theo số lần và đọc <em>cuối</em> danh sách. Trình duyệt thật cho ra một chuỗi áp đảo; những chuỗi hiếm là một máy quét tự xưng danh (<code>Nikto/2.5.0</code>), một script (<code>python-requests</code>, <code>curl</code>), và một user agent mà <em>bản thân nó</em> là đòn tấn công (<code>\${jndi:ldap://…}</code>). <code>-</code> hai lần: đó là hai cái 400, bị từ chối trước khi đọc header (10.1). Máy quét cẩn thận sẽ giả chuỗi trình duyệt, nên UA chỉ là gợi ý, không bao giờ là bằng chứng.</p>

<h3>Bước 3 — mẫu chèn mã trong URL</h3>
${lenh('s10/tan-cong', 3)}
<table>
<thead><tr><th>Đòn tấn công</th><th>Trông thế nào trong log</th><th>Ghi chú</th></tr></thead>
<tbody>
<tr><td>SQL injection</td><td><code>%27</code> (<code>'</code>), <code>UNION SELECT</code>, <code>OR 1=1</code>, <code>SLEEP(5)</code>, <code>--</code></td><td>Payload kiểu <code>SLEEP</code> hiện thành <code>rt</code> ≈ 5 giây với mã 200 — thời gian cũng là bằng chứng</td></tr>
<tr><td>XSS</td><td><code>%3Cscript%3E</code>, <code>onerror=</code>, <code>javascript:</code></td><td>Nguy hiểm về sau, khi giá trị đã lưu được hiển thị — có khi ngay trong trình xem log của bạn</td></tr>
<tr><td>Path traversal</td><td><code>../</code>, <code>..%2f</code>, <code>%2e%2e</code>, <code>/etc/passwd</code>, <code>win.ini</code></td><td>nginx trả 400 và ghi IP cổng Docker — mất IP kẻ tấn công (10.1)</td></tr>
<tr><td>Command injection</td><td><code>;id</code>, <code>|whoami</code>, <code>$(…)</code>, <code>/bin/sh</code></td><td>Dòng <code>/cgi-bin/.%2e/…/bin/sh</code> là phát dò quen thuộc của lỗi Apache path traversal dẫn tới thực thi mã (CVE-2021-41773)</td></tr>
<tr><td>Log4Shell</td><td><code>\${jndi:</code>, <code>%24%7Bjndi</code>, <code>\${\${lower:j}ndi</code></td><td>Bài 10.7; ở bất cứ đâu: đường dẫn, query, UA, Referer, trường form</td></tr>
</tbody></table>
<p>Luôn tìm cả dạng <strong>mã hoá URL</strong>: access log ghi request đúng như lúc gửi. Giải mã tay một dòng đáng ngờ bằng <code>python3 -c "import urllib.parse,sys; print(urllib.parse.unquote(sys.argv[1]))" '…'</code>.</p>

<h3>Bước 4 — dò mật khẩu rải qua nhiều IP</h3>
${lenh('s10/tan-cong', 4)}
<p>Ba IP, cùng user agent, cùng endpoint, mỗi IP 4 lần 401 rồi 2 lần 429. Xét từng IP thì nhỏ; gộp lại là một đòn — 18 lần thử trên 18 địa chỉ email khác nhau với cùng mật khẩu <code>123456</code> (ta thấy tên người dùng trong log app, không bao giờ thấy mật khẩu). Thử vài mật khẩu phổ biến trên nhiều tài khoản là <strong>password spraying</strong>; thử các cặp email/mật khẩu bị lộ từ trang khác là <strong>credential stuffing</strong>. Cả hai đều rải qua nhiều IP (thường là proxy dân cư) chính để lọt dưới giới hạn theo IP. Hãy gom theo <em>endpoint + mã + user agent</em> theo thời gian, đừng chỉ theo IP. Giới hạn tốc độ đã làm tròn việc: sau 4 lần mỗi IP, nginx trả 429 và app không hề thấy phần còn lại. Câu hỏi sống còn trong ca thật: <strong>có IP nào nhận 200 ở <code>/api/login</code> không</strong>? Ở đây không. Chương 14 đi sâu hơn.</p>

<h3>Bước 5 — phát dò Log4Shell</h3>
${lenh('s10/tan-cong', 5)}
<p>Payload nằm ở cả query string (mã hoá URL) lẫn User-Agent, trỏ ngược về chính IP của kẻ tấn công ở cổng 1389. Cơ chế và cách tái hiện an toàn: bài 10.7. Kiểm tra tiếp: có dịch vụ nào sau proxy này dùng <code>log4j-core</code> ≤ 2.14.1 không, và có server nào mở kết nối tới <code>203.0.113.66:1389</code> không (log tường lửa/DNS, Chương 11)?</p>

<h3>Bước 6 — chèn log: giả mạo một dòng</h3>
${lenh('s10/tan-cong', 6)}
<p>Một logger dạng chữ viết <code>login failed user=%s</code>. Nếu tên đăng nhập chứa ký tự xuống dòng, kẻ tấn công viết ra được một <em>dòng thứ hai, giả</em>: "INFO login ok user=admin". Ai đọc log (hay một script đếm số lần đăng nhập thành công) đều bị lừa — và một dòng "login ok" giả có thể được cài vào để che giấu một lần đăng nhập thật hoặc đổ tội cho người khác. OWASP gọi đây là log injection / log forging (CWE-117).</p>
${lenh('s10/tan-cong', 7)}
<p>Cùng phát thử đó với app pino của ta: một bản ghi, mức 40, đoạn chữ giả bị nhốt trong trường <code>user</code> với <code>\\n</code> đã được thoát. Phòng thủ: log JSON có cấu trúc; với log chữ, thay hoặc thoát CR/LF và ký tự điều khiển trước khi ghi; kiểm tra định danh (regex request id ở bài 10.6); và bắt trình xem log thoát HTML, vì một <code>&lt;script&gt;</code> được ghi log sẽ thành stored XSS trong bảng điều khiển log chạy trên web.</p>

<h3>Góc hacker, sự cố thật: Equifax 2017 — những log không ai nhìn thấy</h3>
<p>Ngày 7/3/2017, một lỗ hổng nghiêm trọng trong Apache Struts (CVE-2017-5638, khai thác qua header <code>Content-Type</code> được chế sẵn) được công bố; Equifax không vá một cổng thông tin khiếu nại đời cũ. Kẻ tấn công vào từ <strong>13/5/2017</strong>, cài web shell, tìm thấy một tệp chứa thông tin đăng nhập dạng rõ, truy vấn CSDL khoảng 265 lần và mang đi dữ liệu cá nhân của khoảng <strong>148 triệu</strong> người. Chúng ở lại <strong>76 ngày</strong>. Vì sao lâu thế? Theo báo cáo của Uỷ ban Giám sát Hạ viện Mỹ (12/2018), thiết bị soi lưu lượng của hệ thống đó đã ngừng hoạt động <strong>19 tháng</strong> vì chứng chỉ SSL hết hạn; khi chứng chỉ được gia hạn ngày 29/7/2017, nhân viên gần như lập tức thấy lưu lượng đáng ngờ. Bài học cho người đọc log: (1) một nguồn log hay thiết bị giám sát lặng lẽ ngừng còn tệ hơn không có — kiểm tra rằng các nguồn của bạn vẫn đang gửi (Chương 15 cảnh báo khi im lặng); (2) các lần thử khai thác CVE đã biết xuất hiện trong access log <em>trước</em> vụ xâm nhập — đúng các mẫu ở Bước 3; (3) web shell lộ ra thành request tới tệp mới, lạ, trả 200 với tham số bất thường (khoá SIEM).</p>

<h3>Tình huống đời thật</h3>
<ul>
<li><strong>Tuần đầu OJT, CISO phía khách chuyển tiếp một báo cáo máy quét:</strong> "Hôm qua site của các anh nhận 3.000 đòn tấn công." Bạn trả lời bằng số liệu từ log: bao nhiêu IP khác nhau, những đường dẫn nào, và điểm mấu chốt — mọi phát dò đều nhận 404/403, không có 200 bất thường, không có kết nối đi ra. Câu trả lời bình tĩnh, dựa trên bằng chứng tạo ra niềm tin.</li>
<li><strong>VPS cho đồ án của bạn:</strong> <code>/var/log/nginx/access.log</code> phút nào cũng có <code>/wp-login.php</code>. Không phải nhắm vào bạn; đó là bức xạ nền. Bảo đảm bí mật không bị phục vụ ra ngoài (<code>.env</code>, <code>.git</code>), thêm giới hạn tốc độ cho đăng nhập, rồi đi tiếp.</li>
<li><strong>Nếu</strong> bạn thấy một cái 200 cho <code>/.git/config</code>? Coi đó là sự cố: mã nguồn (và mọi bí mật từng bị commit) có thể đã công khai. Chặn đường dẫn, đổi bí mật, kiểm tra IP đó còn tải gì nữa (Chương 14).</li>
</ul>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
<li>Viết một lệnh liệt kê, với mỗi IP có ít nhất 5 request 4xx, nó đã hỏi bao nhiêu đường dẫn khác nhau.</li>
<li>Chứng minh bằng một lệnh rằng IP máy quét chưa từng nhận 2xx ở đâu ngoài <code>/api/products</code>.</li>
<li>Giải mã dòng SQLi và XSS bằng <code>unquote</code> của Python và viết mỗi cái đang định làm gì.</li>
<li>Viết một regex (<code>grep -E</code>) bắt được <code>\${jndi</code> ở dạng thường, dạng mã hoá URL và dạng nguỵ trang <code>\${lower:j}</code>; thử với ba chuỗi bạn tự chế.</li>
</ol>
<p><strong>Đạt khi:</strong> câu 1 cho máy quét 10 đường dẫn 4xx khác nhau và ba IP dò mật khẩu mỗi IP 1; câu 2 chỉ in các dòng <code>/api/products?…</code> cho 2xx; câu 3 giải thích được "lấy hết tên và mật khẩu người dùng" và "chạy JavaScript trong trang của nạn nhân"; câu 4 khớp cả ba chuỗi thử.</p></div>

<h3>🎤 Câu hỏi phỏng vấn về chương này</h3>
<ul>
<li>"Người dùng thỉnh thoảng gặp 502. Bạn nhìn vào đâu trước, và 502 khác 504 thế nào?" (10.1–10.2: dòng error log, connect() failed so với timed out, app khởi động lại.)</li>
<li>"Bạn lần theo một request qua nginx và dịch vụ Spring/Node thế nào?" (Request id / traceId trong cả hai log; MDC; X-Request-Id.)</li>
<li>"Vì sao <code>log.debug("x=" + obj)</code> là không tốt, và SLF4J là gì?" (10.6–10.7.)</li>
<li>"Giải thích Log4Shell trong hai phút. Dự án của bạn có bị ảnh hưởng không — kiểm tra thế nào?" (Lookup trong dữ liệu được log; <code>dependency:tree | grep log4j-core</code>.)</li>
<li>"Thứ gì tuyệt đối không được ghi vào log?" (Mật khẩu, token, cookie, số thẻ đầy đủ, dữ liệu cá nhân không cần thiết — Twitter 2018, Facebook 2019; bài 16.3.)</li>
</ul>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['scanner (máy quét)', 'Công cụ tự động hỏi các đường dẫn nhạy cảm/lỗ hổng đã biết trên rất nhiều server (Nikto, nuclei, bot tự viết).'],
  ['credential stuffing / password spraying', 'Thử đăng nhập bằng cặp tài khoản bị lộ / vài mật khẩu phổ biến trên nhiều tài khoản, rải qua nhiều IP.'],
  ['path traversal', 'Dùng ../ (thường được mã hoá) để với tới tệp nằm ngoài thư mục web.'],
  ['log injection (CWE-117)', 'Nhét CR/LF hay mã đánh dấu vào dữ liệu được log để giả dòng hoặc tấn công trình xem log.'],
  ['web shell', 'Script độc hại được tải lên web server để chạy lệnh qua request HTTP.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Gom theo IP, rồi đọc danh sách đường dẫn của kẻ tấn công; tìm bất kỳ câu trả lời không phải 4xx giữa cơn bão 404.</li>
<li>Đọc phần hiếm của danh sách user agent; UA là gợi ý, không phải bằng chứng.</li>
<li>Tìm payload ở cả dạng thường và mã hoá URL; thời gian (rt ≈ 5 giây) có thể lộ blind SQLi.</li>
<li>Đòn dò mật khẩu rải qua nhiều IP — gom theo endpoint + mã + UA; câu hỏi là "có cái 200 nào không?".</li>
<li>Log chữ bị giả mạo được bằng ký tự xuống dòng; JSON thoát chúng. Hệ giám sát lặng lẽ ngừng (Equifax) là lỗ hổng tồi tệ nhất.</li>
</ul>
${nguon('📘', 'OWASP — Logging Cheat Sheet', 'Nên log gì, không bao giờ log gì, chèn log', 'https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html')}
${nguon('📘', 'OWASP — Log Injection', 'Giải thích CWE-117 kèm ví dụ', 'https://owasp.org/www-community/attacks/Log_Injection')}
${nguon('📘', 'OWASP Top 10 — A09 Security Logging and Monitoring Failures', 'Vì sao thiếu log hay bỏ qua log khiến vụ xâm nhập kéo dài', 'https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/')}
${nguon('🛡', 'Uỷ ban Giám sát Hạ viện Mỹ — The Equifax Data Breach (12/2018)', 'CVE Struts, 76 ngày, chứng chỉ hết hạn trên thiết bị giám sát', 'https://oversight.house.gov/wp-content/uploads/2018/12/Equifax-Report.pdf')}
${lienKet({ khoa: 'web-security', bai: 'sec-9-1-log', title: 'Web Security 9.1 — Log bảo mật', sub: 'Thiết kế các sự kiện bảo mật app của bạn nên ghi', cta: 'Mở bài' })}
${lienKet({ khoa: 'blue-team-siem', bai: 'siem-6-3-web-shell', title: 'Blue Team & SIEM 6.3 — Tấn công web và web shell', sub: 'Biến các mẫu này thành luật phát hiện', cta: 'Mở bài' })}
</div>
`,
};
