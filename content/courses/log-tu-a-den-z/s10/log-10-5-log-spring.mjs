/**
 * 10.5 — Đọc log Spring Boot (soạn 24/11/2026).
 * Output thật: OUT['s10/spring-doc'] — app _demo/s10/spring-lab (Spring Boot 4.1.1, Logback 1.5.38, Tomcat 11, Java 21,
 * có spring-boot-starter-opentelemetry nên mẫu mặc định có [traceId-spanId]); chạy trong container maven:3.9-eclipse-temurin-21.
 */
import { ma, lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '10.5 — Spring Boot logs: Logback default pattern, per-package levels, "Caused by" chains, Actuator /loggers, traceId|||10.5 — Log Spring Boot: mẫu mặc định của Logback, mức theo package, chuỗi "Caused by", Actuator /loggers, traceId',
  slug: 'log-10-5-log-spring',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Đọc log thật của một app Spring Boot 4.1: tách dòng mặc định thành giờ, mức, PID, tên app, luồng, traceId-spanId, logger, thông điệp; vì sao lỗi không bắt chỉ in "root cause" còn log.error(…, e) in đủ chuỗi Caused by; đọc stack trace Java từ "Caused by" cuối cùng và "… 50 common frames omitted"; đổi mức log khi app đang chạy qua /actuator/loggers và vì sao phải khoá endpoint này; đọc khối APPLICATION FAILED TO START.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.5</span>
<h2>Spring Boot logs: read the default line, the exception chain and the startup failure</h2>
<p class="lead">If you join a Java team — and most outsourcing projects in Vietnam are Java/Spring — the first log you meet is the Spring Boot console output. It is dense: one line carries eight fields, and one exception can fill a hundred lines. This lesson takes a real Spring Boot 4.1 app (the same small "shop" used in 10.6–10.7) and reads what it prints, from startup to a failed request to a failed start.</p>

<h3>The everyday picture: the hospital chart</h3>
<p>A hospital chart line says: time, ward, nurse, patient number, what happened. Doctors read only the columns they need, but every column is always in the same place. A Spring log line is that chart. And an exception chain is the referral letter: "Ward A sent the patient because of B, which was caused by C" — the cure is for C, at the bottom of the letter.</p>

<h3>The app</h3>
${ma('java', 's10/spring-lab/src/main/java/vn/lab/shop/OrderService.java')}
${ma('java', 's10/spring-lab/src/main/java/vn/lab/shop/OrderController.java')}
${ma('properties', 's10/spring-lab/src/main/resources/application.properties')}
<p>Build with <code>mvn package</code> (or the container command in 10.6), then run the jar. No logging configuration file yet: this is Spring Boot's default.</p>

<h3>Step 1 — one default line, field by field</h3>
${lenh('s10/spring-doc', 0)}
${lenh('s10/spring-doc', 1)}
${lenh('s10/spring-doc', 2)}
${lenh('s10/spring-doc', 3)}
<table>
<thead><tr><th>Part</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td><code>2026-11-23T20:28:28.876Z</code></td><td>ISO-8601 time with milliseconds; <code>Z</code> = UTC (the container's zone)</td></tr>
<tr><td><code>INFO</code></td><td>Level: TRACE, DEBUG, INFO, WARN, ERROR (Logback has no FATAL)</td></tr>
<tr><td><code>1</code></td><td>Process id (1 inside a container)</td></tr>
<tr><td><code>---</code></td><td>Separator</td></tr>
<tr><td><code>[shop]</code></td><td><code>spring.application.name</code> — vital when many services share one log store</td></tr>
<tr><td><code>[nio-8080-exec-1]</code></td><td>Thread name, right-aligned and truncated to 15 chars: Tomcat request thread no. 1 (<code>main</code> at startup)</td></tr>
<tr><td><code>[8fed1d…-5872ba…]</code></td><td>Correlation id: <code>traceId-spanId</code>, added automatically because tracing (Micrometer + OpenTelemetry) is on the classpath; blank when there is no active trace (startup lines)</td></tr>
<tr><td><code>vn.lab.shop.OrderController</code></td><td>Logger name = class name; long names are abbreviated (<code>o.s.boot.tomcat.TomcatWebServer</code>)</td></tr>
<tr><td><code>: load order id=7</code></td><td>The message</td></tr>
</tbody></table>
<p>The startup lines tell you the essentials before anything breaks: version (<code>v1.0</code>), Java version, PID, profile ("No active profile set" — in production you expect <code>prod</code>!), the port, and "Started … in 1.826 seconds". When someone says "it works on my machine", compare these first lines.</p>

<h3>Step 2 — an unhandled exception: Spring prints only the root cause</h3>
${lenh('s10/spring-doc', 4)}
${lenh('s10/spring-doc', 5)}
<p>The controller did not catch the exception, so it travelled up to Tomcat, which logged <em>"threw exception [Request processing failed: …OrderLoadException: cannot load order 13] with root cause"</em> and then printed <strong>only the root cause</strong>: <code>NumberFormatException: For input string: "13.5"</code> at <code>PriceRepository.read(OrderService.java:28)</code>. Two notes: the traceId field is empty (the error is logged after the request's trace ended — you match it by thread and time), and the wrapper exceptions are only named in that first line.</p>

<h3>Step 3 — log the exception yourself: the full "Caused by" chain</h3>
${lenh('s10/spring-doc', 6)}
${lenh('s10/spring-doc', 7)}
${lenh('s10/spring-doc', 8)}
<p><code>log.error("order {} failed", id, e)</code> — an exception as the <strong>last</strong> argument after the placeholders — makes Logback print the whole chain. We filtered out framework frames; the real output has 57 <code>at</code> lines. How to read it:</p>
<ol>
<li><strong>Top exception</strong> = what your code saw: <code>OrderLoadException: cannot load order 13</code>, thrown at <code>OrderService.load(OrderService.java:16)</code>.</li>
<li><strong>Each <code>Caused by:</code></strong> = one layer deeper: <code>IllegalStateException: bad price row for order 13</code> at line 31.</li>
<li><strong>The last <code>Caused by:</code></strong> = the root cause, almost always the one to fix: <code>NumberFormatException: For input string: "13.5"</code> — the price table contains <code>13.5</code> where an integer was expected. A data problem, not a code problem.</li>
<li><code>... 50 common frames omitted</code> = "the rest of this stack is identical to the one above" — Logback saves you 50 duplicate lines.</li>
<li>In every block, skip <code>org.springframework</code>, <code>org.apache</code>, <code>jakarta</code>, <code>java.base</code> frames; your package (<code>vn.lab.shop</code>) tells you file and line.</li>
</ol>
<div class="pitfall co-tieu-de"><p><strong>Three ways to destroy an exception in a log.</strong> <code>log.error("failed: " + e)</code> prints only <code>toString()</code> (no stack). <code>log.error("failed: {}", e.getMessage())</code> prints only the message ("cannot load order 13" — the "13.5" is gone). <code>catch (Exception e) {}</code> prints nothing. Code review rule on most Java teams: pass <code>e</code> as the last argument.</p></div>

<h3>Step 4 — change the level of a running app: Actuator /loggers</h3>
${lenh('s10/spring-doc', 9)}
${lenh('s10/spring-doc', 10)}
${lenh('s10/spring-doc', 11)}
${lenh('s10/spring-doc', 12)}
<p>Levels are set per package — <code>logging.level.root=INFO</code>, <code>logging.level.vn.lab.shop=INFO</code> in the properties, or <code>LOGGING_LEVEL_VN_LAB_SHOP=DEBUG</code> as an environment variable. With Spring Boot Actuator you can also change them <em>without a restart</em>: POST <code>{"configuredLevel":"DEBUG"}</code> and the <code>debug</code> line "cache miss for order 8" appears immediately; POST <code>null</code> to go back to the inherited level. This is how you debug a production problem that only happens under real traffic — for ten minutes, on one package.</p>

<h3>Hacker's corner: Actuator endpoints left open</h3>
<p>The scanner in Lab 10 asked for <code>/actuator/env</code> (lesson 10.9) — attackers look for Actuator on every Java site. An open <code>/actuator/loggers</code> lets anyone switch everything to TRACE: the disk fills, the app slows down, and TRACE-level lines of HTTP and SQL libraries can print headers and parameters (tokens, personal data) into the log. <code>/actuator/env</code> and <code>/actuator/heapdump</code> are worse: configuration values and a full memory dump with passwords and session tokens. Defence: expose only <code>health</code> publicly (Spring Boot's default exposes only <code>health</code> over the web), put the rest on a separate management port or behind authentication (Spring Security, role ADMIN), never on the public Internet. Our lab exposes <code>loggers</code> only because it is a lab.</p>
<p><strong>Real incident — Volkswagen / Cariad, 2024.</strong> Researchers presented at the Chaos Computer Club congress (27 December 2024) how a Cariad web service exposed a Spring Boot <code>/heapdump</code> endpoint. The memory dump contained AWS credentials in plain text; with them they reached the cloud storage holding telemetry, including location history, of roughly 800,000 VW group electric cars. VW revoked the keys after being notified. One open Actuator endpoint, one HTTP GET, terabytes of data. Sources: <a href="https://www.theregister.com/2025/01/06/volkswagen_ev_data_exposed/" target="_blank" rel="noopener">The Register, 6/1/2025</a>, <a href="https://heise.de/-10220700" target="_blank" rel="noopener">heise online</a>.</p>

<h3>Step 5 — when the app will not start</h3>
${lenh('s10/spring-doc', 13)}
<p>Spring Boot's <code>FailureAnalyzer</code> turns common startup exceptions into a block with <strong>Description</strong> and <strong>Action</strong>. Always scroll to that block first; the hundred lines of stack trace above it are usually noise. The ones you will meet in your first month:</p>
<table>
<thead><tr><th>Description says</th><th>Usual cause</th></tr></thead>
<tbody>
<tr><td>Web server failed to start. Port 8080 was already in use.</td><td>An old instance still running; IntelliJ started it twice</td></tr>
<tr><td>Failed to configure a DataSource: 'url' attribute is not specified</td><td>JPA/JDBC on the classpath but no <code>spring.datasource.url</code> (wrong profile, missing env var)</td></tr>
<tr><td>Parameter 0 of constructor in … required a bean of type … that could not be found</td><td>Missing <code>@Service</code>/<code>@Component</code>, class outside the scanned package</td></tr>
<tr><td>HikariPool-1 - Exception during pool initialization … Connection refused</td><td>Database down or wrong host/port (same ECONNREFUSED idea as in Node)</td></tr>
<tr><td>Validate failed: Migrations have failed validation (Flyway)</td><td>A migration file was edited after it was applied</td></tr>
</tbody></table>

<h3>Real-life situations</h3>
<ul>
<li><strong>Outsourcing, bug ticket from the client's QA:</strong> "Order 13 shows an error." You find the 500 in the access log, then the Spring line at the same second on the same thread, read to the last <code>Caused by</code>, and answer: "Root cause is price data '13.5' in the price table for order 13 (integer expected). Not a code regression; please confirm whether decimals are allowed." That is a five-minute ticket instead of a two-day one.</li>
<li><strong>Your Spring project (LabFlow-style):</strong> the log shows "No active profile set" on the server — so it runs with dev settings. One startup line exposes a deployment mistake.</li>
<li><strong>What if</strong> the log only says <code>ERROR … Servlet.service() … with root cause</code> and you need the outer exceptions? Add an <code>@ExceptionHandler</code>/<code>@ControllerAdvice</code> that logs <code>e</code>, as in the <code>/api/v2</code> route.</li>
</ul>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok"><ol>
<li>Run the shop app, call <code>/api/v2/orders/13</code>, and copy only the lines that contain <code>Caused by</code> or <code>vn.lab.shop</code>. Write the root cause in one sentence.</li>
<li>Set <code>org.springframework.web</code> to DEBUG through <code>/actuator/loggers</code>, make one request, count how many extra lines it produced, and set it back.</li>
<li>Start the jar a second time while the first one is running (same port) and paste the Description/Action block.</li>
<li>Start it with <code>--spring.profiles.active=prod</code> and find the startup line that changed.</li>
</ol>
<p><strong>Done when:</strong> 1 names "13.5" and <code>OrderService.java:28</code>/<code>PriceRepository.read</code>; 2 shows several DEBUG lines from <code>o.s.web.servlet.DispatcherServlet</code> and then none; 3 shows "Port 8080 was already in use"; 4 shows "The following 1 profile is active: "prod"".</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Logback', 'Spring Boot’s default logging implementation (behind the SLF4J API — lesson 10.6).'],
  ['logger name', 'Usually the fully-qualified class name; levels are set per name prefix (package).'],
  ['root cause', 'The deepest exception in the chain — the last "Caused by".'],
  ['common frames omitted', 'Frames identical to the enclosing stack, skipped by the logger.'],
  ['Actuator /loggers', 'HTTP endpoint to read and change log levels of a running app.'],
  ['FailureAnalyzer', 'Spring Boot component that prints Description/Action for startup failures.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Default line: time, level, PID, ---, [app], [thread], [traceId-spanId], logger : message.</li>
<li>Unhandled exceptions: Tomcat logs the root cause only; log <code>e</code> yourself to see the chain.</li>
<li>Read Java stack traces from the last <code>Caused by</code>, then your own package's frame.</li>
<li>/actuator/loggers changes levels live — and must never be public.</li>
<li>Startup failure: jump to Description/Action.</li>
</ul>
${nguon('📘', 'Spring Boot reference — Logging', 'Default format, log levels, file output, groups', 'https://docs.spring.io/spring-boot/reference/features/logging.html')}
${nguon('📘', 'Spring Boot reference — Actuator Loggers', 'Reading and setting levels at runtime', 'https://docs.spring.io/spring-boot/reference/actuator/loggers.html')}
${lienKet({ khoa: 'spring-boot', bai: 'sb-15-3-logging-traceid', title: 'Spring Boot 15.3 — Logging and traceId', sub: 'Where logging fits in the Spring Boot course', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.5</span>
<h2>Log Spring Boot: đọc dòng mặc định, chuỗi ngoại lệ và lỗi khởi động</h2>
<p class="lead">Nếu bạn vào một đội Java — mà phần lớn dự án outsourcing ở Việt Nam là Java/Spring — log đầu tiên bạn gặp là output console của Spring Boot. Nó dày đặc: một dòng mang tám trường, một ngoại lệ có thể chiếm cả trăm dòng. Bài này lấy một app Spring Boot 4.1 thật (chính app "shop" nhỏ dùng ở 10.6–10.7) và đọc những gì nó in ra, từ lúc khởi động, tới một request hỏng, tới một lần khởi động hỏng.</p>

<h3>Liên tưởng đời thường: bệnh án</h3>
<p>Một dòng bệnh án ghi: giờ, khoa, y tá, số bệnh nhân, chuyện gì đã xảy ra. Bác sĩ chỉ đọc cột mình cần, nhưng cột nào cũng luôn ở đúng chỗ. Một dòng log Spring chính là tờ bệnh án đó. Còn chuỗi ngoại lệ là giấy chuyển viện: "Khoa A chuyển bệnh nhân vì B, mà B là do C" — thuốc phải chữa C, ở cuối tờ giấy.</p>

<h3>App mẫu</h3>
${ma('java', 's10/spring-lab/src/main/java/vn/lab/shop/OrderService.java')}
${ma('java', 's10/spring-lab/src/main/java/vn/lab/shop/OrderController.java')}
${ma('properties', 's10/spring-lab/src/main/resources/application.properties')}
<p>Build bằng <code>mvn package</code> (hoặc lệnh container ở bài 10.6), rồi chạy tệp jar. Chưa có tệp cấu hình log riêng: đây là mặc định của Spring Boot.</p>

<h3>Bước 1 — một dòng mặc định, từng trường</h3>
${lenh('s10/spring-doc', 0)}
${lenh('s10/spring-doc', 1)}
${lenh('s10/spring-doc', 2)}
${lenh('s10/spring-doc', 3)}
<table>
<thead><tr><th>Phần</th><th>Ý nghĩa</th></tr></thead>
<tbody>
<tr><td><code>2026-11-23T20:28:28.876Z</code></td><td>Giờ ISO-8601 kèm mili giây; <code>Z</code> = UTC (múi giờ của container)</td></tr>
<tr><td><code>INFO</code></td><td>Mức: TRACE, DEBUG, INFO, WARN, ERROR (Logback không có FATAL)</td></tr>
<tr><td><code>1</code></td><td>Mã tiến trình (trong container là 1)</td></tr>
<tr><td><code>---</code></td><td>Dấu ngăn cách</td></tr>
<tr><td><code>[shop]</code></td><td><code>spring.application.name</code> — sống còn khi nhiều dịch vụ dùng chung một kho log</td></tr>
<tr><td><code>[nio-8080-exec-1]</code></td><td>Tên luồng, căn phải và cắt còn 15 ký tự: luồng xử lý request số 1 của Tomcat (<code>main</code> lúc khởi động)</td></tr>
<tr><td><code>[8fed1d…-5872ba…]</code></td><td>Mã tương quan: <code>traceId-spanId</code>, tự thêm vì có tracing (Micrometer + OpenTelemetry) trong classpath; để trống khi không có trace (các dòng khởi động)</td></tr>
<tr><td><code>vn.lab.shop.OrderController</code></td><td>Tên logger = tên lớp; tên dài bị rút gọn (<code>o.s.boot.tomcat.TomcatWebServer</code>)</td></tr>
<tr><td><code>: load order id=7</code></td><td>Thông điệp</td></tr>
</tbody></table>
<p>Các dòng khởi động cho bạn những điều cốt lõi trước khi có gì hỏng: phiên bản (<code>v1.0</code>), phiên bản Java, PID, profile ("No active profile set" — trên production bạn mong thấy <code>prod</code>!), cổng, và "Started … in 1.826 seconds". Khi ai đó nói "máy em chạy được", hãy so mấy dòng đầu này trước.</p>

<h3>Bước 2 — ngoại lệ không được bắt: Spring chỉ in nguyên nhân gốc</h3>
${lenh('s10/spring-doc', 4)}
${lenh('s10/spring-doc', 5)}
<p>Controller không bắt ngoại lệ, nên nó bay lên tới Tomcat; Tomcat ghi <em>"threw exception [Request processing failed: …OrderLoadException: cannot load order 13] with root cause"</em> rồi in <strong>chỉ nguyên nhân gốc</strong>: <code>NumberFormatException: For input string: "13.5"</code> ở <code>PriceRepository.read(OrderService.java:28)</code>. Hai lưu ý: trường traceId trống (lỗi được ghi sau khi trace của request đã kết thúc — bạn ghép nó theo luồng và giờ), và các ngoại lệ bọc ngoài chỉ được nêu tên ở dòng đầu đó.</p>

<h3>Bước 3 — tự log ngoại lệ: đủ chuỗi "Caused by"</h3>
${lenh('s10/spring-doc', 6)}
${lenh('s10/spring-doc', 7)}
${lenh('s10/spring-doc', 8)}
<p><code>log.error("order {} failed", id, e)</code> — ngoại lệ là đối số <strong>cuối cùng</strong> sau các chỗ giữ chỗ — khiến Logback in cả chuỗi. Ta đã lọc bỏ khung của framework; output thật có 57 dòng <code>at</code>. Cách đọc:</p>
<ol>
<li><strong>Ngoại lệ trên cùng</strong> = thứ mã của bạn nhìn thấy: <code>OrderLoadException: cannot load order 13</code>, ném ra ở <code>OrderService.load(OrderService.java:16)</code>.</li>
<li><strong>Mỗi <code>Caused by:</code></strong> = sâu thêm một lớp: <code>IllegalStateException: bad price row for order 13</code> ở dòng 31.</li>
<li><strong><code>Caused by:</code> cuối cùng</strong> = nguyên nhân gốc, gần như luôn là cái cần sửa: <code>NumberFormatException: For input string: "13.5"</code> — bảng giá chứa <code>13.5</code> ở chỗ đáng lẽ là số nguyên. Lỗi dữ liệu, không phải lỗi mã.</li>
<li><code>... 50 common frames omitted</code> = "phần còn lại của stack này giống hệt stack phía trên" — Logback tiết kiệm cho bạn 50 dòng trùng.</li>
<li>Trong mọi khối, bỏ qua khung <code>org.springframework</code>, <code>org.apache</code>, <code>jakarta</code>, <code>java.base</code>; package của bạn (<code>vn.lab.shop</code>) cho biết tệp và dòng.</li>
</ol>
<div class="pitfall co-tieu-de"><p><strong>Ba cách phá huỷ một ngoại lệ trong log.</strong> <code>log.error("failed: " + e)</code> chỉ in <code>toString()</code> (không có stack). <code>log.error("failed: {}", e.getMessage())</code> chỉ in thông điệp ("cannot load order 13" — mất luôn "13.5"). <code>catch (Exception e) {}</code> không in gì. Quy tắc review mã ở hầu hết đội Java: truyền <code>e</code> làm đối số cuối.</p></div>

<h3>Bước 4 — đổi mức log của app đang chạy: Actuator /loggers</h3>
${lenh('s10/spring-doc', 9)}
${lenh('s10/spring-doc', 10)}
${lenh('s10/spring-doc', 11)}
${lenh('s10/spring-doc', 12)}
<p>Mức log đặt theo package — <code>logging.level.root=INFO</code>, <code>logging.level.vn.lab.shop=INFO</code> trong tệp properties, hoặc biến môi trường <code>LOGGING_LEVEL_VN_LAB_SHOP=DEBUG</code>. Có Spring Boot Actuator, bạn còn đổi được <em>mà không cần khởi động lại</em>: POST <code>{"configuredLevel":"DEBUG"}</code> là dòng <code>debug</code> "cache miss for order 8" xuất hiện ngay; POST <code>null</code> để quay về mức kế thừa. Đây là cách gỡ một lỗi production chỉ xảy ra dưới lưu lượng thật — trong mười phút, trên một package.</p>

<h3>Góc hacker: endpoint Actuator bị để ngỏ</h3>
<p>Máy quét trong Lab 10 đã hỏi <code>/actuator/env</code> (bài 10.9) — kẻ tấn công đi tìm Actuator trên mọi site Java. Một <code>/actuator/loggers</code> để ngỏ cho phép bất kỳ ai bật mọi thứ lên TRACE: đĩa đầy, app chậm, và dòng TRACE của thư viện HTTP và SQL có thể in header và tham số (token, dữ liệu cá nhân) vào log. <code>/actuator/env</code> và <code>/actuator/heapdump</code> còn tệ hơn: giá trị cấu hình và cả bản chụp bộ nhớ chứa mật khẩu, token phiên. Phòng thủ: chỉ công khai <code>health</code> (mặc định Spring Boot chỉ mở <code>health</code> qua web), phần còn lại để ở cổng quản trị riêng hoặc sau xác thực (Spring Security, vai trò ADMIN), không bao giờ ra Internet. Lab của ta mở <code>loggers</code> chỉ vì đây là lab.</p>
<p><strong>Sự cố thật — Volkswagen / Cariad, 2024.</strong> Tại hội nghị Chaos Computer Club (27/12/2024), các nhà nghiên cứu trình bày cách một dịch vụ web của Cariad (công ty phần mềm của VW) để ngỏ endpoint <code>/heapdump</code> của Spring Boot. Bản chụp bộ nhớ chứa khoá AWS dạng chữ rõ; dùng khoá đó họ vào được kho đám mây chứa dữ liệu xe, gồm cả lịch sử vị trí, của khoảng 800.000 xe điện thuộc tập đoàn VW. VW đã thu hồi khoá sau khi được báo. Một endpoint Actuator để ngỏ, một lệnh HTTP GET, hàng terabyte dữ liệu. Nguồn: <a href="https://www.theregister.com/2025/01/06/volkswagen_ev_data_exposed/" target="_blank" rel="noopener">The Register, 6/1/2025</a>, <a href="https://heise.de/-10220700" target="_blank" rel="noopener">heise online</a>.</p>

<h3>Bước 5 — khi app không chịu khởi động</h3>
${lenh('s10/spring-doc', 13)}
<p><code>FailureAnalyzer</code> của Spring Boot biến các ngoại lệ khởi động hay gặp thành một khối có <strong>Description</strong> và <strong>Action</strong>. Luôn cuộn tới khối đó trước; cả trăm dòng stack trace phía trên thường là nhiễu. Những cái bạn sẽ gặp trong tháng đầu:</p>
<table>
<thead><tr><th>Description ghi</th><th>Nguyên nhân thường gặp</th></tr></thead>
<tbody>
<tr><td>Web server failed to start. Port 8080 was already in use.</td><td>Bản cũ vẫn đang chạy; IntelliJ chạy hai lần</td></tr>
<tr><td>Failed to configure a DataSource: 'url' attribute is not specified</td><td>Có JPA/JDBC trong classpath mà không có <code>spring.datasource.url</code> (sai profile, thiếu biến môi trường)</td></tr>
<tr><td>Parameter 0 of constructor in … required a bean of type … that could not be found</td><td>Thiếu <code>@Service</code>/<code>@Component</code>, lớp nằm ngoài package được quét</td></tr>
<tr><td>HikariPool-1 - Exception during pool initialization … Connection refused</td><td>CSDL đang tắt hoặc sai host/cổng (cùng ý ECONNREFUSED như bên Node)</td></tr>
<tr><td>Validate failed: Migrations have failed validation (Flyway)</td><td>Một tệp migration bị sửa sau khi đã chạy</td></tr>
</tbody></table>

<h3>Tình huống đời thật</h3>
<ul>
<li><strong>Outsourcing, ticket lỗi từ QA phía khách:</strong> "Đơn 13 báo lỗi." Bạn tìm dòng 500 trong access log, rồi dòng Spring cùng giây cùng luồng, đọc tới <code>Caused by</code> cuối cùng, và trả lời: "Nguyên nhân gốc là dữ liệu giá '13.5' trong bảng giá của đơn 13 (đáng lẽ là số nguyên). Không phải lỗi hồi quy của mã; nhờ anh chị xác nhận có cho phép số thập phân không." Đó là ticket năm phút thay vì hai ngày.</li>
<li><strong>Dự án Spring của bạn (kiểu LabFlow):</strong> log trên server ghi "No active profile set" — tức nó đang chạy với cấu hình dev. Một dòng khởi động lộ ra lỗi triển khai.</li>
<li><strong>Nếu</strong> log chỉ ghi <code>ERROR … Servlet.service() … with root cause</code> mà bạn cần các ngoại lệ bọc ngoài? Thêm một <code>@ExceptionHandler</code>/<code>@ControllerAdvice</code> log <code>e</code>, như route <code>/api/v2</code>.</li>
</ul>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
<li>Chạy app shop, gọi <code>/api/v2/orders/13</code>, và chép riêng những dòng có <code>Caused by</code> hoặc <code>vn.lab.shop</code>. Viết nguyên nhân gốc trong một câu.</li>
<li>Đặt <code>org.springframework.web</code> lên DEBUG qua <code>/actuator/loggers</code>, gửi một request, đếm nó sinh thêm bao nhiêu dòng, rồi đặt lại.</li>
<li>Chạy tệp jar lần thứ hai trong khi lần đầu vẫn chạy (cùng cổng) và dán khối Description/Action.</li>
<li>Chạy với <code>--spring.profiles.active=prod</code> và tìm dòng khởi động đã thay đổi.</li>
</ol>
<p><strong>Đạt khi:</strong> câu 1 nêu đúng "13.5" và <code>OrderService.java:28</code>/<code>PriceRepository.read</code>; câu 2 thấy vài dòng DEBUG từ <code>o.s.web.servlet.DispatcherServlet</code> rồi hết; câu 3 có "Port 8080 was already in use"; câu 4 có "The following 1 profile is active: "prod"".</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Logback', 'Bộ ghi log mặc định của Spring Boot (đứng sau API SLF4J — bài 10.6).'],
  ['tên logger', 'Thường là tên đầy đủ của lớp; mức log đặt theo tiền tố tên (package).'],
  ['root cause (nguyên nhân gốc)', 'Ngoại lệ sâu nhất trong chuỗi — dòng "Caused by" cuối cùng.'],
  ['common frames omitted', 'Các khung giống hệt stack bao ngoài, logger bỏ qua cho gọn.'],
  ['Actuator /loggers', 'Endpoint HTTP để đọc và đổi mức log của app đang chạy.'],
  ['FailureAnalyzer', 'Thành phần Spring Boot in khối Description/Action khi khởi động hỏng.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Dòng mặc định: giờ, mức, PID, ---, [app], [luồng], [traceId-spanId], logger : thông điệp.</li>
<li>Ngoại lệ không bắt: Tomcat chỉ log nguyên nhân gốc; tự log <code>e</code> để thấy cả chuỗi.</li>
<li>Đọc stack trace Java từ <code>Caused by</code> cuối cùng, rồi tới khung thuộc package của bạn.</li>
<li>/actuator/loggers đổi mức log ngay khi đang chạy — và không bao giờ được để công khai.</li>
<li>Khởi động hỏng: nhảy thẳng tới Description/Action.</li>
</ul>
${nguon('📘', 'Spring Boot reference — Logging', 'Định dạng mặc định, mức log, ghi ra tệp, nhóm logger', 'https://docs.spring.io/spring-boot/reference/features/logging.html')}
${nguon('📘', 'Spring Boot reference — Actuator Loggers', 'Đọc và đặt mức log lúc đang chạy', 'https://docs.spring.io/spring-boot/reference/actuator/loggers.html')}
${lienKet({ khoa: 'spring-boot', bai: 'sb-15-3-logging-traceid', title: 'Spring Boot 15.3 — Logging và traceId', sub: 'Vị trí của log trong khoá Spring Boot', cta: 'Mở bài' })}
</div>
`,
};
