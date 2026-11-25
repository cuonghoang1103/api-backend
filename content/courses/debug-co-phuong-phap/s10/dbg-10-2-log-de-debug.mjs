/**
 * 10.2 — Log làm debugger trên production (soạn 24/11/2026, máy nhà Linux).
 * Output THẬT: Node 22.22 + pino 9.14 + Express 5.3; Spring Boot 4.1.1 (logging.structured.format.console=ecs, MDC, /actuator/loggers) —
 * scratchpad/dbg/lab/ch10 (c102/, java/).
 */
import { nguon, lienKet } from '../_chung.mjs';
import { APP102, CTRL_JAVA, MA_REQ, PROPS } from './_ma-10.mjs';
import { LO, AN_TOAN, JAVA102 } from './_ra-10.mjs';

const ma = (s, lang = 'js') => `<pre><code class="language-${lang}">${s}</code></pre>`;
const ra = (s) => `<div class="out">${s}</div>`;
const chiTiet = (tom, noiDung) => `<details><summary>${tom}</summary>${noiDung}</details>`;

const DONG_LOG_EN = `<table>
<thead><tr><th>Put in a debug log line</th><th>Never put in</th></tr></thead>
<tbody>
<tr><td><code>request_id</code>, user id (internal), route, version, instance</td><td>Passwords, tokens, cookies, API keys, <code>Authorization</code> header, OTP codes</td></tr>
<tr><td>The <em>intermediate values</em> your hypothesis is about (<code>khoa</code>, <code>giamPhanTram</code>)</td><td>Whole request/response bodies "just in case"</td></tr>
<tr><td>Counts, sizes, booleans (<code>co_mat_khau: true</code>, <code>so_dong: 20</code>)</td><td>Full names, phone numbers, ID-card numbers, addresses, raw e-mails — use a hash or internal id</td></tr>
<tr><td>Durations split by stage (<code>ms_cho_pool</code>, <code>ms_sql</code>)</td><td>Whole error objects of HTTP clients (they carry the request headers)</td></tr>
</tbody></table>`;
const DONG_LOG_VI = `<table>
<thead><tr><th>Nên có trong dòng log debug</th><th>Không bao giờ có</th></tr></thead>
<tbody>
<tr><td><code>request_id</code>, id người dùng (nội bộ), route, phiên bản, instance</td><td>Mật khẩu, token, cookie, API key, header <code>Authorization</code>, mã OTP</td></tr>
<tr><td>Đúng những <em>giá trị trung gian</em> mà giả thuyết của bạn nói tới (<code>khoa</code>, <code>giamPhanTram</code>)</td><td>Nguyên body request/response "cho chắc"</td></tr>
<tr><td>Số đếm, kích thước, giá trị đúng/sai (<code>co_mat_khau: true</code>, <code>so_dong: 20</code>)</td><td>Họ tên, số điện thoại, số CCCD, địa chỉ, email thô — dùng mã băm hoặc id nội bộ</td></tr>
<tr><td>Thời gian tách theo chặng (<code>ms_cho_pool</code>, <code>ms_sql</code>)</td><td>Nguyên đối tượng lỗi của HTTP client (nó mang theo header của request)</td></tr>
</tbody></table>`;

const NGUON = [
  nguon('📘', 'pino — Redaction', 'redact.paths + censor: che trường theo đường dẫn, kể cả ký tự đại diện.', 'https://getpino.io/#/docs/redaction'),
  nguon('📘', 'Spring Boot — Structured logging', 'logging.structured.format.console = ecs | gelf | logstash; MDC và key-value của SLF4J thành trường JSON.', 'https://docs.spring.io/spring-boot/reference/features/logging.html'),
  nguon('📘', 'Spring Boot — Actuator loggers endpoint', 'GET/POST /actuator/loggers/{name}: xem và đổi mức log lúc đang chạy.', 'https://docs.spring.io/spring-boot/reference/actuator/loggers.html'),
  nguon('🧯', 'Meta — Keeping Passwords Secure (03/2019)', 'Mật khẩu người dùng lưu dạng rõ trong hệ thống nội bộ (log) nhiều năm.', 'https://about.fb.com/news/2019/03/keeping-passwords-secure/'),
  nguon('🧯', 'KrebsOnSecurity — Facebook stored hundreds of millions of passwords in plain text', 'Hàng trăm triệu mật khẩu, hàng nghìn nhân viên tra cứu được.', 'https://krebsonsecurity.com/2019/03/facebook-stored-hundreds-of-millions-of-user-passwords-in-plain-text-for-years/'),
  nguon('🧯', 'NVD — CVE-2021-44228 (Log4Shell)', 'Log một chuỗi người dùng gửi lên ⇒ thực thi mã từ xa qua JNDI lookup.', 'https://nvd.nist.gov/vuln/detail/CVE-2021-44228'),
  lienKet({ khoa: 'observability-monitoring', bai: 'obs-1-1-tu-console-toi-json', title: 'Observability 1.1 — Từ console.log tới một dòng máy đọc được', sub: 'Log có cấu trúc từ gốc, mức log, chi phí — không dạy lại ở đây.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'observability-monitoring', bai: 'obs-3-1-id-di-den-hu-vo', title: 'Observability 3.1 — Cái id chẳng đi tới đâu', sub: 'Correlation id qua nhiều dịch vụ.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-2-4-jq', title: 'Log từ A đến Z 2.4 — jq cho log JSON', sub: 'select, group_by, @tsv — mọi câu jq trong chương này.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'incident-response', bai: 'ir-7-4-playbook-lo-bi-mat', title: 'Incident Response 7.4 — Bí mật lộ vào log', sub: 'Khi đã lỡ: xoay khoá, thu hồi token, dọn bản sao.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '10.2 — Logs as your debugger: temporary structured logs, no PII|||10.2 — Log làm debugger: log có cấu trúc tạm thời, không ghi dữ liệu cá nhân',
  slug: 'dbg-10-2-log-de-debug',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Trên production, dòng log là breakpoint duy nhất bạn có — nên đặt nó như đặt breakpoint: đúng chỗ, đúng giá trị trung gian, gỡ khi xong. Chạy thật với pino 9 và Spring Boot 4.1: log "debug nhanh" in header + body ⇒ mật khẩu, Bearer token, cookie nằm trong log, jq rút ra một dòng; bản an toàn: redact ("[đã che]" cả trong log lỗi 500 có header), mã băm email (Node và Java ra cùng f539fdc75b3c để nối hai dịch vụ), request_id từ AsyncLocalStorage/MDC trả về client. Bật debug tạm thời cho ĐÚNG một người dùng 20 giây qua endpoint quản trị có token + log kiểm toán ⇒ dòng debug lộ khoa "K20-CLC" ⇒ Number("20-CLC") = NaN ⇒ không được giảm; hết giờ tự tắt. Spring: log JSON ECS không cần thư viện, key-value của SLF4J, POST /actuator/loggers đổi DEBUG không restart (cổng quản trị riêng, cổng công khai 404). Góc hacker: Facebook 2019, Log4Shell 2021.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2</span>
<h2>On production, a log line is the only breakpoint you get</h2>
<p class="lead">Lesson 10.1 took the debugger away. What is left is the log — and used well it is a debugger: you choose a line, you choose which values to see, and you see them for real users without stopping anyone. Used badly it is the most common way companies leak passwords. This lesson does both for real, on Node (pino) and Spring Boot: a "quick debug" log that leaks, the safe version, and a debug log you can switch on for one user for twenty seconds without a deploy.</p>

<h3>An everyday picture: the flight recorder</h3>
<p>An aircraft does not let an engineer climb into the engine during a flight. It records chosen values — altitude, speed, engine temperature — with a timestamp, so that afterwards someone can reconstruct exactly what happened. Nobody records the passengers' conversations. Your logs are the flight recorder: chosen values, timestamped, enough to reconstruct; never the passengers' secrets.</p>

<h3>1. The log nobody meant to keep</h3>
<p>Version 2.3.0 of LabFlow had a login bug. Someone added "print everything so we can see" and forgot it. Here is that app (both versions are in one file, switched by an environment variable):</p>
${chiTiet('c102/app.mjs — pino, request_id, redact, temporary debug', ma(APP102))}
${ra(LO)}
<p>One <code>jq</code> line turns the log into a list of e-mails and passwords — plus a valid Bearer token and session cookie, which are even better for an attacker because they skip the password and the 2FA. Everyone who can read logs now has them: the whole dev team, the log platform (Kibana, Loki, a SaaS vendor), every backup of the log storage, and whoever breaks into any of those. Logs are usually kept for months and copied widely; databases are guarded far better.</p>
<div class="callout warn"><p><strong>Hacker's corner — real cases.</strong> In March 2019 Meta (Facebook) announced that hundreds of millions of user passwords had been stored in plain text in internal systems — logs — readable by thousands of employees for years (KrebsOnSecurity broke the story). No attacker was needed: the log was the breach. The opposite direction is just as real: <strong>Log4Shell</strong> (CVE-2021-44228, December 2021) — Log4j 2 interpreted <code>\${jndi:ldap://…}</code> inside a logged string, so merely <em>logging</em> a User-Agent sent by an attacker executed the attacker's code. Lessons: never log secrets, and treat logged user input as data, not as a template (use parameterised messages, keep logging libraries patched).</p></div>

<h3>2. The safe version: structure, ids, redaction</h3>
${ra(AN_TOAN)}
<p>Read it line by line, because every field is a decision:</p>
<ul>
<li><strong><code>request_id</code> in every line</strong>, taken from the incoming <code>x-request-id</code> if it is well-formed or generated otherwise, and <em>returned</em> to the client. The user who got the 500 can paste <code>96f29018</code> into the ticket, and you <code>grep</code> exactly their request — the most useful single field in debugging production (correlation across services: Observability ch3).</li>
<li><strong><code>ver</code> and <code>svc</code> in the base</strong> of the logger: when two versions run during a deploy (10.3) you know which line came from which.</li>
<li><strong><code>email_hash</code></strong> instead of the e-mail: the first 12 hex characters of SHA-256 of the lower-cased address. The same person always has the same hash, so you can follow them across lines and services, but the log does not contain the address. (For data that can be guessed — phone numbers, student ids — use an HMAC with a secret key; a plain hash of a 10-digit phone number can be brute-forced.)</li>
<li><strong><code>redact</code></strong> as a safety net: the 500 handler logs request headers to help reproduction — and <code>authorization</code> came out as <code>[đã che]</code>. The last command proves it: zero lines contain the password, the token or the cookie.</li>
</ul>
${DONG_LOG_EN}

<h3>3. A temporary debug log for one user, for twenty seconds</h3>
<p>Ticket: "student SE2003 (cohort K20-CLC) is charged the full late fee; K20 and later should get 50% off". At <code>info</code> level you only see "request xong". You have a hypothesis — something about the cohort — and you need the intermediate values, for this one student, now. The app has an admin endpoint that switches the request logger to <code>debug</code> for one user id for a limited time, protected by a token, and writes an audit line:</p>
<ul>
<li><code>BẬT log debug tạm thời</code> at level 40 (warn) with <code>kiem_toan: true</code> — who switched what on stays in the log.</li>
<li>Request <code>tk-1043-a1</code> (SE2003) now has a level-20 line: <code>khoa: "K20-CLC", giamPhanTram: 0</code>. The bug is visible: <code>Number("K20-CLC".slice(1))</code> is <code>Number("20-CLC")</code> = <code>NaN</code>, and <code>NaN >= 20</code> is false. SE1911 in the same second gets no debug line — the volume stays tiny.</li>
<li>Twenty-one seconds later <code>tk-1043-a2</code> has no debug line: it switched itself off. Nobody had to remember.</li>
</ul>
<p>This is the production replacement for the conditional breakpoint of lesson 3.2: a condition (this user), the values you care about, no pause. Then the cleanup that people skip: once the bug is understood, write a test for <code>K20-CLC</code>, fix the parsing, and decide whether the debug line stays (it is cheap at debug level) or goes. Temporary logs added in a hurry — a <code>console.log(req.body)</code> in a hotfix — must be removed in the same PR as the fix; put "remove temporary logs" in your PR checklist.</p>

<h3>4. The same in Spring Boot: JSON logs, MDC, levels at run time</h3>
<p>Since Spring Boot 3.4 structured JSON logging is built in — one property, no extra library. A filter puts <code>request_id</code> into the MDC so every line of the request carries it:</p>
${ma(PROPS, 'properties')}
${ma(MA_REQ, 'java')}
${chiTiet('DatLichController.java — the leaky and the safe login log', ma(CTRL_JAVA, 'java'))}
${ra(JAVA102)}
<p>Same story in a different language: <code>headers={…authorization=Bearer …}</code> and <code>matKhau=An@2005-fpt</code> in the <code>message</code> — Java records print every field in <code>toString()</code>, so logging a DTO is logging its password. The safe version uses SLF4J's key-value API (<code>addKeyValue</code>); Spring's ECS format turns each pair into a JSON field. Notice <code>email_hash</code> is <code>f539fdc75b3c</code>, identical to the Node service: same rule, same hash, so you can join the two services' logs on it.</p>
<p>Then the run-time switch: <code>POST /actuator/loggers/vn.labflow.prod {"configuredLevel":"DEBUG"}</code> returns 204, and from the next request the controller's <code>log.debug(…)</code> lines appear — with the MDC <code>request_id</code> the client sent. Posting <code>null</code> returns to the configured level. No restart, no deploy. The endpoint lives on a separate management port bound to <code>127.0.0.1</code>; on the public port it is a 404. An exposed <code>/actuator/loggers</code> lets a stranger turn on <code>TRACE</code> for the whole app — logging every SQL parameter and filling your disk — so never expose it.</p>

<h3>5. Using the log to narrow a hypothesis</h3>
<ol>
<li>Write the hypothesis first: "the discount is computed wrong for cohorts with a suffix".</li>
<li>Choose the one line that would prove or kill it, and the two or three values on it.</li>
<li>Switch on for the smallest scope that reproduces: one user, one route, one instance, a few minutes.</li>
<li>Read with a query, not with your eyes: <code>jq 'select(.request_id == "tk-1043-a1")'</code> (Log A–Z 2.4).</li>
<li>Turn it off, write the test, fix, remove what was temporary.</li>
</ol>
<p>If you need more than three rounds of "add a log, deploy, wait", stop and reproduce on staging with the exact request instead (copy it as curl from the log: method, path, the non-secret headers, the body shape).</p>

<h3>On the job</h3>
<p>On a customer project the log platform is often the customer's, and their security team reviews what you send to it. A leaked token in a log is a security incident you must report, not a bug you quietly fix — the token must be revoked and the logs purged (Incident Response 7.4). Before your first PR on a project, find out three things: which fields the log format already has (request id? user id?), whether there is a redact list, and how levels are changed at run time. When you file a bug, include the request id — "it failed around 10 o'clock" costs the next person an hour.</p>

<h3>🧪 Practice (45 min)</h3>
<div class="callout ok">
<ol>
<li>Run <code>c102-node.sh</code>. Add <code>req.headers['x-api-key']</code> to a log call in the safe version and make it come out redacted without changing the call.</li>
<li>Make the debug switch also accept a <code>route</code> so you can debug "everyone on /phi-tre for 60 seconds". What is the risk at high traffic? Add a cap on the number of debug lines.</li>
<li>Run <code>c102-java.sh</code>. Change the format to <code>logstash</code> and compare the field names. Add the <code>email_hash</code> rule as a shared utility.</li>
<li>Search your own project for <code>console.log(req</code>, <code>log.info(".*{}", .*Dto</code> and logging of whole error objects from HTTP clients. Fix one.</li>
</ol>
<p><strong>Done when:</strong> your project's logs carry a request id returned to the client, a redact list exists and is tested, and you can turn on debug for one scope without a deploy.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Structured log</span><span class="v">One JSON object per line with named fields — queryable with jq or a log platform.</span></div>
  <div class="kv"><span class="k">request_id / correlation id</span><span class="v">An id carried by every line of one request and returned to the caller.</span></div>
  <div class="kv"><span class="k">MDC / AsyncLocalStorage</span><span class="v">Per-request context that the logger adds to every line automatically.</span></div>
  <div class="kv"><span class="k">Redaction</span><span class="v">Replacing sensitive fields by path before the line is written.</span></div>
  <div class="kv"><span class="k">PII</span><span class="v">Personally identifiable information: names, e-mails, phone and ID numbers, addresses.</span></div>
  <div class="kv"><span class="k">Temporary debug log</span><span class="v">Debug level for a narrow scope with an expiry and an audit line.</span></div>
  <div class="kv"><span class="k">/actuator/loggers</span><span class="v">Spring endpoint to read and change log levels at run time — internal port only.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Place a log line the way you place a breakpoint: for a hypothesis, with the intermediate values.</li>
<li>Every line: request id (returned to the client), version, instance; values as fields, not prose.</li>
<li>Never secrets or raw PII; hash or HMAC identifiers; redact as a safety net and test it.</li>
<li>Debug for one user or route, time-boxed, audited — then test, fix, remove the temporary lines.</li>
<li>Logged user input is data, not a template (Log4Shell); exposed log-level endpoints are an attack surface.</li>
</ul>
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.2</span>
<h2>Trên production, dòng log là breakpoint duy nhất bạn có</h2>
<p class="lead">Bài 10.1 đã lấy debugger đi. Thứ còn lại là log — và dùng khéo thì nó là debugger: bạn chọn một dòng, chọn những giá trị muốn thấy, và thấy chúng với người dùng thật mà không làm ai phải dừng. Dùng vụng thì nó là cách phổ biến nhất để các công ty làm lộ mật khẩu. Bài này làm thật cả hai, trên Node (pino) và Spring Boot: một dòng log "debug nhanh" làm lộ, bản an toàn, và log debug bật được cho một người dùng trong hai mươi giây mà không cần deploy.</p>

<h3>Liên tưởng đời thường: hộp đen máy bay</h3>
<p>Máy bay không cho kỹ sư chui vào động cơ giữa chuyến bay. Nó ghi lại các giá trị đã chọn — độ cao, tốc độ, nhiệt độ động cơ — kèm mốc thời gian, để sau đó người ta dựng lại chính xác chuyện đã xảy ra. Không ai ghi cuộc trò chuyện của hành khách. Log của bạn là hộp đen: giá trị chọn lọc, có mốc giờ, đủ để dựng lại; không bao giờ là bí mật của hành khách.</p>

<h3>1. Dòng log không ai định giữ lại</h3>
<p>Bản 2.3.0 của LabFlow có lỗi đăng nhập. Có người thêm "in hết ra cho dễ xem" rồi quên. Đây là ứng dụng đó (hai phiên bản nằm trong một tệp, chuyển bằng biến môi trường):</p>
${chiTiet('c102/app.mjs — pino, request_id, redact, debug tạm thời', ma(APP102))}
${ra(LO)}
<p>Một dòng <code>jq</code> biến log thành danh sách email và mật khẩu — thêm một Bearer token và cookie phiên còn hiệu lực, còn quý hơn với kẻ tấn công vì chúng vượt qua cả mật khẩu lẫn 2FA. Ai đọc được log giờ đều có chúng: cả nhóm dev, nền tảng gom log (Kibana, Loki, một nhà cung cấp SaaS), mọi bản sao lưu của kho log, và bất kỳ ai đột nhập được một trong số đó. Log thường giữ hàng tháng và được sao chép khắp nơi; cơ sở dữ liệu thì được canh giữ kỹ hơn nhiều.</p>
<div class="callout warn"><p><strong>Góc hacker — chuyện có thật.</strong> Tháng 3/2019, Meta (Facebook) thông báo hàng trăm triệu mật khẩu người dùng đã được lưu dạng rõ trong hệ thống nội bộ — log — mà hàng nghìn nhân viên đọc được suốt nhiều năm (KrebsOnSecurity đưa tin đầu tiên). Không cần kẻ tấn công nào: chính log là vụ lộ. Chiều ngược lại cũng có thật: <strong>Log4Shell</strong> (CVE-2021-44228, tháng 12/2021) — Log4j 2 diễn giải <code>\${jndi:ldap://…}</code> nằm trong chuỗi được log, nên chỉ cần <em>log</em> một User-Agent do kẻ tấn công gửi là mã của kẻ tấn công được chạy. Bài học: không bao giờ log bí mật, và coi input người dùng được log là dữ liệu, không phải mẫu (dùng thông điệp có tham số, cập nhật thư viện log).</p></div>

<h3>2. Bản an toàn: có cấu trúc, có id, có che</h3>
${ra(AN_TOAN)}
<p>Đọc từng dòng một, vì mỗi trường là một quyết định:</p>
<ul>
<li><strong><code>request_id</code> trong mọi dòng</strong>, lấy từ <code>x-request-id</code> gửi lên nếu đúng dạng, không thì tự sinh, và <em>trả lại</em> cho client. Người dùng gặp lỗi 500 dán được <code>96f29018</code> vào ticket, và bạn <code>grep</code> đúng request của họ — trường hữu ích nhất khi gỡ lỗi production (nối qua nhiều dịch vụ: Observability chương 3).</li>
<li><strong><code>ver</code> và <code>svc</code> ở phần gốc</strong> của logger: khi hai phiên bản cùng chạy trong lúc deploy (10.3), bạn biết dòng nào của bản nào.</li>
<li><strong><code>email_hash</code></strong> thay cho email: 12 ký tự hex đầu của SHA-256 của địa chỉ viết thường. Cùng một người luôn ra cùng một mã, nên bạn lần theo được qua nhiều dòng, nhiều dịch vụ, mà log không chứa địa chỉ. (Với dữ liệu đoán được — số điện thoại, mã sinh viên — hãy dùng HMAC có khoá bí mật; băm trơn một số điện thoại 10 chữ số thì vét cạn được.)</li>
<li><strong><code>redact</code></strong> làm lưới an toàn: handler lỗi 500 log header của request để dễ tái hiện — và <code>authorization</code> ra <code>[đã che]</code>. Lệnh cuối chứng minh điều đó: không dòng nào chứa mật khẩu, token hay cookie.</li>
</ul>
${DONG_LOG_VI}

<h3>3. Log debug tạm thời cho một người dùng, trong hai mươi giây</h3>
<p>Ticket: "sinh viên SE2003 (khoá K20-CLC) bị tính đủ phí trễ hạn; K20 trở đi phải được giảm 50%". Ở mức <code>info</code> bạn chỉ thấy "request xong". Bạn có một giả thuyết — chuyện gì đó với khoá học — và cần các giá trị trung gian, của đúng sinh viên này, ngay bây giờ. Ứng dụng có một endpoint quản trị chuyển logger của request sang <code>debug</code> cho một id người dùng trong thời gian giới hạn, có token bảo vệ, và ghi một dòng kiểm toán:</p>
<ul>
<li><code>BẬT log debug tạm thời</code> ở mức 40 (warn) kèm <code>kiem_toan: true</code> — ai đã bật gì vẫn nằm trong log.</li>
<li>Request <code>tk-1043-a1</code> (SE2003) giờ có một dòng mức 20: <code>khoa: "K20-CLC", giamPhanTram: 0</code>. Lỗi hiện ra: <code>Number("K20-CLC".slice(1))</code> là <code>Number("20-CLC")</code> = <code>NaN</code>, mà <code>NaN >= 20</code> là sai. SE1911 cùng giây đó không có dòng debug — lượng log vẫn rất nhỏ.</li>
<li>Hai mươi mốt giây sau, <code>tk-1043-a2</code> không còn dòng debug: nó tự tắt. Không ai phải nhớ.</li>
</ul>
<p>Đây là thứ thay thế trên production cho breakpoint điều kiện của bài 3.2: một điều kiện (người dùng này), đúng những giá trị bạn quan tâm, không dừng gì cả. Rồi đến phần dọn dẹp mà người ta hay bỏ: hiểu lỗi xong thì viết test cho <code>K20-CLC</code>, sửa phần tách chuỗi, và quyết định dòng debug ở lại (rẻ, vì ở mức debug) hay bỏ đi. Log tạm thêm vội — một <code>console.log(req.body)</code> trong bản vá nóng — phải gỡ ngay trong PR sửa lỗi; hãy đưa "gỡ log tạm" vào checklist PR.</p>

<h3>4. Trong Spring Boot cũng vậy: log JSON, MDC, đổi mức lúc đang chạy</h3>
<p>Từ Spring Boot 3.4, log JSON có cấu trúc có sẵn — một thuộc tính, không thêm thư viện. Một filter đặt <code>request_id</code> vào MDC để mọi dòng của request mang theo nó:</p>
${ma(PROPS, 'properties')}
${ma(MA_REQ, 'java')}
${chiTiet('DatLichController.java — log đăng nhập bản lộ và bản an toàn', ma(CTRL_JAVA, 'java'))}
${ra(JAVA102)}
<p>Cùng câu chuyện ở một ngôn ngữ khác: <code>headers={…authorization=Bearer …}</code> và <code>matKhau=An@2005-fpt</code> nằm trong <code>message</code> — record của Java in mọi trường trong <code>toString()</code>, nên log một DTO là log luôn mật khẩu của nó. Bản an toàn dùng API key-value của SLF4J (<code>addKeyValue</code>); định dạng ECS của Spring biến mỗi cặp thành một trường JSON. Để ý <code>email_hash</code> là <code>f539fdc75b3c</code>, giống hệt dịch vụ Node: cùng một quy tắc, cùng một mã, nên bạn nối được log của hai dịch vụ theo trường đó.</p>
<p>Rồi đến công tắc lúc đang chạy: <code>POST /actuator/loggers/vn.labflow.prod {"configuredLevel":"DEBUG"}</code> trả 204, và từ request kế tiếp các dòng <code>log.debug(…)</code> của controller xuất hiện — kèm <code>request_id</code> trong MDC do client gửi. Gửi <code>null</code> là trở về mức đã cấu hình. Không restart, không deploy. Endpoint nằm ở cổng quản trị riêng gắn với <code>127.0.0.1</code>; ở cổng công khai nó là 404. Một <code>/actuator/loggers</code> bị lộ ra ngoài cho phép người lạ bật <code>TRACE</code> cho cả ứng dụng — log mọi tham số SQL và làm đầy ổ đĩa — nên đừng bao giờ mở nó ra.</p>

<h3>5. Dùng log để thu hẹp giả thuyết</h3>
<ol>
<li>Viết giả thuyết trước: "giảm giá bị tính sai với các khoá có hậu tố".</li>
<li>Chọn đúng một dòng sẽ chứng minh hoặc bác bỏ nó, cùng hai ba giá trị trên dòng đó.</li>
<li>Bật cho phạm vi nhỏ nhất còn tái hiện được: một người dùng, một route, một instance, vài phút.</li>
<li>Đọc bằng truy vấn, không đọc bằng mắt: <code>jq 'select(.request_id == "tk-1043-a1")'</code> (Log A–Z 2.4).</li>
<li>Tắt đi, viết test, sửa, gỡ những gì là tạm.</li>
</ol>
<p>Nếu cần hơn ba vòng "thêm log, deploy, chờ", hãy dừng lại và tái hiện trên staging bằng đúng request đó (chép nó thành lệnh curl từ log: method, path, các header không bí mật, hình dạng body).</p>

<h3>Đi làm thật</h3>
<p>Trong dự án của khách hàng, nền tảng log thường là của khách, và đội bảo mật của họ soát những gì bạn gửi vào đó. Một token lộ trong log là sự cố bảo mật phải báo cáo, không phải lỗi lặng lẽ sửa — token phải bị thu hồi và log phải được dọn (Incident Response 7.4). Trước PR đầu tiên ở một dự án, hãy tìm hiểu ba điều: định dạng log đã có những trường nào (request id? user id?), có danh sách che (redact) chưa, và đổi mức log lúc đang chạy bằng cách nào. Khi báo lỗi, ghi kèm request id — "lỗi lúc khoảng 10 giờ" làm người sau mất một tiếng.</p>

<h3>🧪 Thực hành (45 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>c102-node.sh</code>. Thêm <code>req.headers['x-api-key']</code> vào một lời gọi log ở bản an toàn và làm cho nó ra dạng đã che mà không sửa lời gọi đó.</li>
<li>Cho công tắc debug nhận thêm <code>route</code> để debug được "mọi người trên /phi-tre trong 60 giây". Rủi ro khi lưu lượng cao là gì? Thêm giới hạn số dòng debug.</li>
<li>Chạy <code>c102-java.sh</code>. Đổi định dạng sang <code>logstash</code> và so tên các trường. Đưa quy tắc <code>email_hash</code> thành một tiện ích dùng chung.</li>
<li>Tìm trong dự án của bạn <code>console.log(req</code>, <code>log.info(".*{}", .*Dto</code> và chỗ log nguyên đối tượng lỗi của HTTP client. Sửa một chỗ.</li>
</ol>
<p><strong>Đạt khi:</strong> log của dự án có request id trả về cho client, có danh sách redact và có test cho nó, và bạn bật được debug cho một phạm vi mà không cần deploy.</p>
</div>

<h3>🗂 Thuật ngữ chính</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Log có cấu trúc</span><span class="v">Mỗi dòng một đối tượng JSON với các trường có tên — truy vấn được bằng jq hoặc nền tảng log.</span></div>
  <div class="kv"><span class="k">request_id / correlation id</span><span class="v">Một id mọi dòng của cùng request đều mang, và được trả về cho bên gọi.</span></div>
  <div class="kv"><span class="k">MDC / AsyncLocalStorage</span><span class="v">Ngữ cảnh theo từng request mà logger tự thêm vào mọi dòng.</span></div>
  <div class="kv"><span class="k">Redaction (che)</span><span class="v">Thay các trường nhạy cảm theo đường dẫn trước khi dòng log được ghi.</span></div>
  <div class="kv"><span class="k">PII</span><span class="v">Thông tin định danh cá nhân: tên, email, số điện thoại, số giấy tờ, địa chỉ.</span></div>
  <div class="kv"><span class="k">Log debug tạm thời</span><span class="v">Mức debug cho một phạm vi hẹp, có hạn giờ và có dòng kiểm toán.</span></div>
  <div class="kv"><span class="k">/actuator/loggers</span><span class="v">Endpoint của Spring để xem và đổi mức log lúc đang chạy — chỉ ở cổng nội bộ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đặt một dòng log như đặt một breakpoint: cho một giả thuyết, kèm các giá trị trung gian.</li>
<li>Mọi dòng: request id (trả về client), phiên bản, instance; giá trị là trường, không phải câu văn.</li>
<li>Không bao giờ có bí mật hay PII thô; băm hoặc HMAC định danh; redact làm lưới an toàn và có test.</li>
<li>Debug cho một người dùng hoặc route, có hạn giờ, có kiểm toán — rồi test, sửa, gỡ dòng tạm.</li>
<li>Input người dùng được log là dữ liệu, không phải mẫu (Log4Shell); endpoint đổi mức log lộ ra ngoài là bề mặt tấn công.</li>
</ul>
${NGUON}
</div>
`,
};
