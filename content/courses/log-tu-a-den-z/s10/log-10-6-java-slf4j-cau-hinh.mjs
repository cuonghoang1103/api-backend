/**
 * 10.6 — Log Java từ bên trong: SLF4J, Logback vs Log4j2, cấu hình, appender, rolling file (soạn 24/11/2026).
 * Output thật: OUT['s10/spring-cauhinh'] (Spring Boot 4.1.1 + logback-lab.xml: MDC, RollingFile 20KB, bẫy additivity, bẫy hai provider SLF4J
 * với slf4j-simple 2.0.18), OUT['s10/bt-10-6'] (lời giải Thực hành chạy thật 24/11/2026: springProfile prod, 5KB/12KB, additivity làm mất dòng trong tệp) và OUT['s10/spring-log4j2'] (cùng app đổi sang spring-boot-starter-log4j2, Log4j 2.25.5).
 */
import { ma, lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '10.6 — Java logging from the inside: SLF4J facade, Logback vs Log4j2, configuration, levels, appenders, rolling files|||10.6 — Log Java từ bên trong: lớp vỏ SLF4J, Logback vs Log4j2, cấu hình, mức log, appender, rolling file',
  slug: 'log-10-6-java-slf4j-cau-hinh',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Vì sao Java có "lớp vỏ" SLF4J và lịch sử JUL → Log4j 1 → Logback → Log4j2; trong tệp jar Spring Boot có những thư viện log nào và các cầu nối (jul-to-slf4j, log4j-to-slf4j) để làm gì; viết logback-spring.xml: appender Console/RollingFile/JSON, pattern có %X{requestId}, logger theo package, additivity; xoay tệp theo ngày + dung lượng với maxHistory, totalSizeCap — chạy thật và nhìn tệp .gz sinh ra; bẫy log trùng do additivity, bẫy hai provider SLF4J ("LoggerFactory is not a Logback LoggerContext"), bẫy "--" trong chú thích XML; đổi sang Log4j2 bằng starter + exclusion.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.6</span>
<h2>Java logging from the inside: who actually writes the line</h2>
<p class="lead">In 10.5 you read Spring Boot's output. On a real project you will also have to <em>change</em> it: add the request id to every line, write to files that rotate before the disk fills, silence a noisy library, or fix "every line appears twice". For that you need the plumbing: the SLF4J API your code calls, the implementation behind it (Logback or Log4j2), and the configuration file that connects them. Nothing in the Spring Boot course goes this deep — so this lesson does it fully.</p>

<h3>The everyday picture: the wall socket</h3>
<p>Your laptop charger fits the wall socket, and it does not care whether the electricity comes from a coal plant or solar panels. <strong>SLF4J</strong> is the socket: your code calls <code>LoggerFactory.getLogger(…)</code> and <code>log.info(…)</code>. <strong>Logback</strong> or <strong>Log4j2</strong> is the power plant that actually formats and writes the line. Libraries also plug into the same socket, so all logs of the app go to one place, configured once. Two power plants on one socket — that is the "multiple providers" bug you will see below.</p>

<h3>A short history (why there are so many names)</h3>
<table>
<thead><tr><th>Year</th><th>What</th><th>Status today</th></tr></thead>
<tbody>
<tr><td>~1999–2001</td><td><strong>Log4j 1</strong> (Ceki Gülcü, Apache) — the first popular Java logger</td><td>End of life since August 2015; still found in old systems (and has its own unpatched CVEs)</td></tr>
<tr><td>2002</td><td><strong>java.util.logging (JUL)</strong> built into Java 1.4</td><td>Exists, rarely chosen; libraries like Tomcat use it — bridged into SLF4J</td></tr>
<tr><td>2002</td><td>Apache Commons Logging — a first facade</td><td>Legacy; Spring 5+ ships its own bridge</td></tr>
<tr><td>2005–2006</td><td><strong>SLF4J</strong> facade and <strong>Logback</strong> implementation (also by Ceki Gülcü)</td><td>Spring Boot's default</td></tr>
<tr><td>2014</td><td><strong>Log4j 2</strong> — a rewrite (async loggers, plugins, lookups)</td><td>Widely used; the library of Log4Shell (2021, lesson 10.7)</td></tr>
</tbody></table>

<h3>Step 1 — what is inside the Spring Boot jar</h3>
${lenh('s10/spring-cauhinh', 0)}
<ul>
<li><code>slf4j-api</code> — the socket your code and Spring call.</li>
<li><code>logback-classic</code> + <code>logback-core</code> — the implementation (the "provider").</li>
<li><code>jul-to-slf4j</code> — reroutes JUL calls (Tomcat, some JDK parts) into SLF4J.</li>
<li><code>log4j-to-slf4j</code> + <code>log4j-api</code> — reroutes libraries that call the Log4j 2 <em>API</em> into SLF4J. Note: no <code>log4j-core</code> — this app is not affected by Log4Shell even though "log4j" appears in the jar list. Knowing this difference saved many teams a panic in December 2021.</li>
<li><code>logstash-logback-encoder</code> — JSON output for Logback (lesson 10.7).</li>
</ul>

<h3>Step 2 — a production-style Logback configuration</h3>
${ma('xml', 's10/spring-lab/src/main/resources/logback-lab.xml')}
<p>Vocabulary: an <strong>appender</strong> is a destination (console, file, rolling file, network); an <strong>encoder/pattern</strong> decides the text of each line; a <strong>logger</strong> has a name (package or class) and a level; <strong>root</strong> is the parent of all loggers. In a real project name the file <code>logback-spring.xml</code> in <code>src/main/resources</code>; Spring Boot loads it automatically and lets you use <code>&lt;springProfile name="prod"&gt;</code> inside. We name it <code>logback-lab.xml</code> and switch it on with <code>--logging.config=classpath:logback-lab.xml</code>, so 10.5 could show the default.</p>
<p>Pattern pieces you will see everywhere: <code>%d{…}</code> date, <code>%-5level</code> level padded to 5, <code>[%thread]</code>, <code>%logger{20}</code> logger name shortened to about 20 chars, <code>%msg</code>, <code>%n</code> newline, <code>%X{requestId:-}</code> the MDC value <code>requestId</code> or empty (MDC — lesson 10.7).</p>
<p>The request id itself comes from a servlet filter that copies <code>X-Request-Id</code> into the MDC — and refuses odd values:</p>
${ma('java', 's10/spring-lab/src/main/java/vn/lab/shop/RequestIdFilter.java')}

<h3>Step 3 — run it: MDC in the pattern, and a twice-printed line</h3>
${lenh('s10/spring-cauhinh', 2)}
${lenh('s10/spring-cauhinh', 3)}
${lenh('s10/spring-cauhinh', 4)}
${lenh('s10/spring-cauhinh', 5)}
<p>Every line of request <code>req-c0ffee01</code> carries its id — even the mail line on another thread (<code>mail-1</code>, lesson 10.7 explains how). But the mail line appears <strong>twice</strong>. Why: the <code>MailService</code> logger has its own <code>CONSOLE</code> appender, and <strong>additivity</strong> (default <code>true</code>) also passes every event up to root, which writes it to <code>CONSOLE</code> again. Classic cause of "duplicate logs" tickets — and of a log bill twice as big.</p>
${lenh('s10/spring-cauhinh', 10)}
${lenh('s10/spring-cauhinh', 11)}
<p>With <code>additivity="false"</code> (here via <code>-DADDITIVITY=false</code>) the event stops at the child logger: one line.</p>
<p><strong>But count the file too.</strong> Re-run on 24/11/2026 (practice solution), counting the mail line on the screen <em>and</em> in <code>logs/shop.log</code>:</p>
${lenh('s10/bt-10-6', 8)}
${lenh('s10/bt-10-6', 10)}
<p><code>additivity="false"</code> fixed the screen, but the event no longer reaches root — so the mail line is now <strong>missing from <code>shop.log</code> and <code>shop.json</code></strong>, the files your log platform collects. A quiet data loss nobody notices until an incident. The cleaner fix: give the child logger only a level, no appender of its own (<code>logback-sach.xml</code>); the event goes up to root once and lands in every destination once:</p>
${lenh('s10/bt-10-6', 11)}
${lenh('s10/bt-10-6', 13)}
<p>Rule of thumb: attach appenders to <code>root</code>, set only levels on child loggers. Use <code>additivity="false"</code> only when a logger really needs its own separate destination (for example an audit file) — and then list every appender it needs.</p>
${lenh('s10/spring-cauhinh', 6)}
<p>The header <code>X-Request-Id: &lt;script&gt;</code> was rejected by the filter's regex and replaced with a UUID. Never copy a header into logs unchecked: logs end up in HTML dashboards and in other tools (log injection — lesson 10.9).</p>

<h3>Step 4 — rolling files: never fill the disk</h3>
${lenh('s10/spring-cauhinh', 7)}
${lenh('s10/spring-cauhinh', 8)}
${lenh('s10/spring-cauhinh', 9)}
<p>The <code>SizeAndTimeBasedRollingPolicy</code> rotates when the day changes <em>or</em> the file passes <code>maxFileSize</code> (20KB for the demo — 400 requests produced three archives). <code>%d{yyyy-MM-dd}.%i</code> gives date + index; the <code>.gz</code> suffix compresses archives (20KB of text → under 5KB). <code>maxHistory=14</code> deletes archives older than 14 periods (days here); <code>totalSizeCap</code> deletes the oldest archives when all archives together exceed the cap. Without these two, a busy app fills the disk and then <em>stops working</em> — a real outage caused by logs. Typical production values: <code>maxFileSize 100MB</code>, <code>maxHistory 30</code>, <code>totalSizeCap 5GB</code>, or no files at all when logs go to stdout and the platform collects them (Docker, Kubernetes — Chapter 13). System-level rotation of other files is <code>logrotate</code> (lesson 8.5).</p>
<div class="pitfall co-tieu-de"><p><strong>Two programs rotating the same file.</strong> If Logback rolls <code>shop.log</code> and logrotate also renames it, one of them writes into a file the other has moved: lines vanish or land in an archive. Choose one: either the app rotates (Logback/Log4j2 policy) or logrotate does (with <code>copytruncate</code>, accepting a small loss window).</p></div>

<h3>Step 5 — the "two providers" trap</h3>
${lenh('s10/spring-cauhinh', 12)}
${lenh('s10/spring-cauhinh', 13)}
<p>We added <code>slf4j-simple</code> next to Logback — what happens when a transitive dependency drags in a second logger. SLF4J warns "multiple SLF4J providers", <em>picks one</em> (here the wrong one), and Spring Boot then refuses to start: <code>LoggerFactory is not a Logback LoggerContext but Logback is on the classpath</code>. In older SLF4J 1.7 the same situation was "multiple bindings" and the app might start with the wrong logger silently. Find the culprit with <code>mvn dependency:tree -Dincludes=org.slf4j</code> and add an <code>&lt;exclusion&gt;</code>.</p>
<div class="pitfall co-tieu-de"><p><strong>"--" inside an XML comment breaks the file.</strong> Our first version of <code>logback-lab.xml</code> had <code>--logging.config</code> inside a comment; Logback refused the file (<em>The string "--" is not permitted within comments</em>) and Spring Boot did not start. When a logging config fails, the first lines of output are Logback's own status messages (<code>|-ERROR in ch.qos.logback…</code>) — read those before anything else.</p></div>

<h3>Step 6 — switching to Log4j2</h3>
${lenh('s10/spring-log4j2', 0)}
${lenh('s10/spring-log4j2', 1)}
${lenh('s10/spring-log4j2', 3)}
<p>Exclude <code>spring-boot-starter-logging</code> from every starter that brings it, add <code>spring-boot-starter-log4j2</code> (and drop Logback-only libraries like the logstash encoder). The jar now has <code>log4j-core</code> (the implementation), <code>log4j-slf4j2-impl</code> (SLF4J calls go to Log4j2) and <code>log4j-jul</code>. Your Java code did not change at all — that is the point of the facade. Spring Boot keeps the same console pattern; the config file becomes <code>log4j2-spring.xml</code> with <code>&lt;Appenders&gt;</code>, <code>&lt;RollingFile&gt;</code> + <code>&lt;Policies&gt;</code> (<code>TimeBasedTriggeringPolicy</code>, <code>SizeBasedTriggeringPolicy</code>) and <code>&lt;DefaultRolloverStrategy max="…"&gt;</code>. Teams choose Log4j2 mainly for its async loggers (lesson 10.7); Logback is the simpler default.</p>

<h3>Real-life situations</h3>
<ul>
<li><strong>Outsourcing, legacy project:</strong> you inherit a Spring 4 app with <code>log4j.properties</code> — Log4j 1, end of life. The upgrade path is: SLF4J API in code, <code>log4j-over-slf4j</code> bridge for old calls, Logback or Log4j2 behind. Mention it in your first week's "risks" report.</li>
<li><strong>"Disk full" at 3 a.m.:</strong> <code>du -sh /var/log/* /app/logs</code> shows 40 GB of <code>app.log</code>. The config had a <code>FileAppender</code>, not a rolling one. Fix: rolling policy with <code>totalSizeCap</code>, and log at INFO, not DEBUG, in production.</li>
<li><strong>What if</strong> a library spams WARN lines every second? Add <code>&lt;logger name="com.noisy.lib" level="ERROR"/&gt;</code> — but read one of those warnings first; sometimes it is the only sign of a real problem.</li>
</ul>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok"><ol>
<li>Build the shop app (<code>mvn package</code>, or <code>docker run --rm -v "$PWD":/p -w /p maven:3.9-eclipse-temurin-21 mvn -q package -DskipTests</code>) and run it with <code>--logging.config=classpath:logback-lab.xml</code>.</li>
<li>Add a <code>springProfile</code>: on profile <code>prod</code>, root goes only to FILE and JSON (no console). Prove it by starting with and without <code>--spring.profiles.active=prod</code>. (For this, rename the file to <code>logback-spring.xml</code>.)</li>
<li>Change <code>maxFileSize</code> to 5KB and <code>totalSizeCap</code> to 12KB, send 400 requests, and show that the oldest archives were deleted.</li>
<li>Reproduce the duplicate-line bug and fix it with <code>additivity="false"</code>.</li>
</ol>
<p><strong>Done when:</strong> 2 shows no console lines after startup on prod; 3 never shows more than about 12KB of <code>.gz</code> files; 4 prints the mail line once.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['facade', 'An API (SLF4J) your code calls, independent of which logging library writes the output.'],
  ['provider / binding', 'The implementation behind SLF4J (Logback, Log4j2, slf4j-simple). Exactly one should be present.'],
  ['bridge', 'Adapter that reroutes another API into SLF4J (jul-to-slf4j, log4j-to-slf4j, log4j-over-slf4j).'],
  ['appender', 'Destination of log events (console, file, rolling file, socket).'],
  ['additivity', 'Whether a logger also passes events to its parent’s appenders (default true).'],
  ['rolling policy', 'Rules to rotate files by time/size and delete old ones (maxHistory, totalSizeCap).'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Code talks to SLF4J; Logback (Spring default) or Log4j2 writes the line; bridges pull JUL/Log4j-API calls in.</li>
<li><code>logback-spring.xml</code>: appenders, pattern with <code>%X{…}</code>, loggers per package, root.</li>
<li>Always rotate with both a size/time trigger and <code>maxHistory</code> + <code>totalSizeCap</code>.</li>
<li>Duplicate lines → additivity; "multiple providers" → <code>dependency:tree</code> + exclusion.</li>
<li>Switching to Log4j2 = exclude starter-logging, add starter-log4j2; Java code unchanged.</li>
</ul>
${nguon('📘', 'SLF4J user manual', 'Facade, providers, bridging legacy APIs', 'https://www.slf4j.org/manual.html')}
${nguon('📘', 'SLF4J error codes', 'multiple_bindings / multiple providers explained', 'https://www.slf4j.org/codes.html')}
${nguon('📘', 'Logback manual — Appenders', 'RollingFileAppender, SizeAndTimeBasedRollingPolicy, maxHistory, totalSizeCap', 'https://logback.qos.ch/manual/appenders.html')}
${nguon('📘', 'Spring Boot reference — Logging', 'logback-spring.xml, springProfile, switching to Log4j2', 'https://docs.spring.io/spring-boot/reference/features/logging.html')}
${lienKet({ khoa: 'spring-boot', bai: 'sb-15-3-logging-traceid', title: 'Spring Boot 15.3 — Logging and traceId', sub: 'The Spring Boot course’s short take on logging', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.6</span>
<h2>Log Java từ bên trong: ai thật sự viết ra dòng log</h2>
<p class="lead">Ở bài 10.5 bạn đã đọc output của Spring Boot. Ở dự án thật bạn còn phải <em>sửa</em> nó: thêm request id vào mọi dòng, ghi ra tệp tự xoay vòng trước khi đầy đĩa, bịt miệng một thư viện ồn ào, hay sửa lỗi "dòng nào cũng in hai lần". Muốn vậy bạn cần hiểu đường ống: API SLF4J mà mã của bạn gọi, phần thực thi phía sau (Logback hoặc Log4j2), và tệp cấu hình nối chúng lại. Khoá Spring Boot không đi sâu tới mức này — nên bài này dạy trọn.</p>

<h3>Liên tưởng đời thường: ổ cắm điện trên tường</h3>
<p>Cục sạc laptop cắm vừa ổ điện trên tường, và nó không quan tâm điện đến từ nhà máy nhiệt điện hay tấm pin mặt trời. <strong>SLF4J</strong> là ổ cắm: mã của bạn gọi <code>LoggerFactory.getLogger(…)</code> và <code>log.info(…)</code>. <strong>Logback</strong> hoặc <strong>Log4j2</strong> là nhà máy điện thật sự định dạng và ghi ra dòng log. Các thư viện cũng cắm vào cùng ổ đó, nên mọi log của app đổ về một chỗ, cấu hình một lần. Hai nhà máy cùng cắm một ổ — đó chính là lỗi "nhiều provider" bạn sẽ thấy bên dưới.</p>

<h3>Lịch sử ngắn (vì sao có nhiều tên đến vậy)</h3>
<table>
<thead><tr><th>Năm</th><th>Cái gì</th><th>Hiện trạng</th></tr></thead>
<tbody>
<tr><td>~1999–2001</td><td><strong>Log4j 1</strong> (Ceki Gülcü, Apache) — thư viện log Java phổ biến đầu tiên</td><td>Hết hỗ trợ từ tháng 8/2015; vẫn còn trong hệ thống cũ (và có CVE riêng không được vá)</td></tr>
<tr><td>2002</td><td><strong>java.util.logging (JUL)</strong> có sẵn từ Java 1.4</td><td>Vẫn tồn tại, hiếm ai chọn; thư viện như Tomcat dùng nó — được nối vào SLF4J</td></tr>
<tr><td>2002</td><td>Apache Commons Logging — lớp vỏ đầu tiên</td><td>Di sản; Spring 5+ có cầu nối riêng</td></tr>
<tr><td>2005–2006</td><td>Lớp vỏ <strong>SLF4J</strong> và phần thực thi <strong>Logback</strong> (cũng của Ceki Gülcü)</td><td>Mặc định của Spring Boot</td></tr>
<tr><td>2014</td><td><strong>Log4j 2</strong> — viết lại từ đầu (async logger, plugin, lookup)</td><td>Dùng rộng rãi; chính là thư viện của Log4Shell (2021, bài 10.7)</td></tr>
</tbody></table>

<h3>Bước 1 — trong tệp jar Spring Boot có gì</h3>
${lenh('s10/spring-cauhinh', 0)}
<ul>
<li><code>slf4j-api</code> — cái ổ cắm mà mã của bạn và Spring gọi.</li>
<li><code>logback-classic</code> + <code>logback-core</code> — phần thực thi (the "provider").</li>
<li><code>jul-to-slf4j</code> — chuyển hướng lời gọi JUL (Tomcat, một phần JDK) vào SLF4J.</li>
<li><code>log4j-to-slf4j</code> + <code>log4j-api</code> — chuyển hướng các thư viện gọi <em>API</em> của Log4j 2 vào SLF4J. Lưu ý: không có <code>log4j-core</code> — app này không dính Log4Shell dù danh sách jar có chữ "log4j". Biết phân biệt điều này đã cứu nhiều đội khỏi hoảng loạn hồi tháng 12/2021.</li>
<li><code>logstash-logback-encoder</code> — xuất JSON cho Logback (bài 10.7).</li>
</ul>

<h3>Bước 2 — một cấu hình Logback kiểu production</h3>
${ma('xml', 's10/spring-lab/src/main/resources/logback-lab.xml')}
<p>Từ vựng: <strong>appender</strong> là đích đến (console, tệp, tệp xoay vòng, mạng); <strong>encoder/pattern</strong> quyết định chữ của mỗi dòng; <strong>logger</strong> có tên (package hoặc lớp) và mức; <strong>root</strong> là cha của mọi logger. Ở dự án thật, đặt tên tệp <code>logback-spring.xml</code> trong <code>src/main/resources</code>; Spring Boot tự nạp nó và cho bạn dùng <code>&lt;springProfile name="prod"&gt;</code> bên trong. Ta đặt tên <code>logback-lab.xml</code> và bật bằng <code>--logging.config=classpath:logback-lab.xml</code>, để bài 10.5 còn cho xem được mặc định.</p>
<p>Các mảnh pattern bạn sẽ gặp khắp nơi: <code>%d{…}</code> ngày giờ, <code>%-5level</code> mức đệm đủ 5 ký tự, <code>[%thread]</code>, <code>%logger{20}</code> tên logger rút còn khoảng 20 ký tự, <code>%msg</code>, <code>%n</code> xuống dòng, <code>%X{requestId:-}</code> giá trị MDC <code>requestId</code> hoặc rỗng (MDC — bài 10.7).</p>
<p>Bản thân request id đến từ một servlet filter chép <code>X-Request-Id</code> vào MDC — và từ chối giá trị lạ:</p>
${ma('java', 's10/spring-lab/src/main/java/vn/lab/shop/RequestIdFilter.java')}

<h3>Bước 3 — chạy thử: MDC trong pattern, và một dòng bị in hai lần</h3>
${lenh('s10/spring-cauhinh', 2)}
${lenh('s10/spring-cauhinh', 3)}
${lenh('s10/spring-cauhinh', 4)}
${lenh('s10/spring-cauhinh', 5)}
<p>Mọi dòng của request <code>req-c0ffee01</code> đều mang id của nó — kể cả dòng gửi thư ở luồng khác (<code>mail-1</code>, bài 10.7 giải thích bằng cách nào). Nhưng dòng gửi thư xuất hiện <strong>hai lần</strong>. Vì: logger <code>MailService</code> có appender <code>CONSOLE</code> riêng, và <strong>additivity</strong> (mặc định <code>true</code>) còn chuyển mọi sự kiện lên root, root lại ghi ra <code>CONSOLE</code> lần nữa. Nguyên nhân kinh điển của ticket "log bị trùng" — và của hoá đơn lưu log to gấp đôi.</p>
${lenh('s10/spring-cauhinh', 10)}
${lenh('s10/spring-cauhinh', 11)}
<p>Với <code>additivity="false"</code> (ở đây qua <code>-DADDITIVITY=false</code>) sự kiện dừng ở logger con: một dòng.</p>
<p><strong>Nhưng hãy đếm cả trong tệp.</strong> Chạy lại ngày 24/11/2026 (lời giải phần Thực hành), đếm dòng gửi mail trên màn hình <em>và</em> trong <code>logs/shop.log</code>:</p>
${lenh('s10/bt-10-6', 8)}
${lenh('s10/bt-10-6', 10)}
<p><code>additivity="false"</code> sửa được màn hình, nhưng sự kiện không còn lên tới root — nên dòng mail <strong>biến mất khỏi <code>shop.log</code> và <code>shop.json</code></strong>, chính là các tệp mà hệ thống gom log thu thập. Mất dữ liệu âm thầm, không ai thấy cho tới khi có sự cố. Cách sửa sạch hơn: logger con chỉ đặt mức, không gắn appender riêng (<code>logback-sach.xml</code>); sự kiện đi lên root một lần và tới mọi đích, mỗi đích một lần:</p>
${lenh('s10/bt-10-6', 11)}
${lenh('s10/bt-10-6', 13)}
<p>Quy tắc dễ nhớ: gắn appender vào <code>root</code>, logger con chỉ đặt mức. Chỉ dùng <code>additivity="false"</code> khi một logger thật sự cần đích riêng (ví dụ tệp audit) — và khi đó liệt kê đủ mọi appender nó cần.</p>
${lenh('s10/spring-cauhinh', 6)}
<p>Header <code>X-Request-Id: &lt;script&gt;</code> bị regex của filter từ chối và thay bằng một UUID. Đừng bao giờ chép header vào log mà không kiểm tra: log rồi sẽ lên các bảng điều khiển HTML và công cụ khác (chèn log — bài 10.9).</p>

<h3>Bước 4 — tệp xoay vòng: không bao giờ làm đầy đĩa</h3>
${lenh('s10/spring-cauhinh', 7)}
${lenh('s10/spring-cauhinh', 8)}
${lenh('s10/spring-cauhinh', 9)}
<p><code>SizeAndTimeBasedRollingPolicy</code> xoay tệp khi sang ngày mới <em>hoặc</em> khi tệp vượt <code>maxFileSize</code> (20KB cho bản demo — 400 request sinh ra ba tệp lưu trữ). <code>%d{yyyy-MM-dd}.%i</code> cho ngày + số thứ tự; đuôi <code>.gz</code> nén các tệp lưu trữ (20KB chữ → dưới 5KB). <code>maxHistory=14</code> xoá tệp lưu trữ cũ hơn 14 chu kỳ (ở đây là ngày); <code>totalSizeCap</code> xoá tệp cũ nhất khi tổng mọi tệp lưu trữ vượt trần. Thiếu hai thứ này, một app bận rộn sẽ làm đầy đĩa rồi <em>ngừng hoạt động</em> — một sự cố thật do log gây ra. Giá trị production hay dùng: <code>maxFileSize 100MB</code>, <code>maxHistory 30</code>, <code>totalSizeCap 5GB</code>, hoặc không ghi tệp gì cả khi log đi ra stdout và nền tảng tự gom (Docker, Kubernetes — Chương 13). Xoay vòng các tệp khác ở mức hệ thống là việc của <code>logrotate</code> (bài 8.5).</p>
<div class="pitfall co-tieu-de"><p><strong>Hai chương trình cùng xoay một tệp.</strong> Nếu Logback xoay <code>shop.log</code> mà logrotate cũng đổi tên nó, một bên sẽ ghi vào tệp mà bên kia đã dời đi: dòng log biến mất hoặc rơi vào tệp lưu trữ. Chọn một: hoặc app xoay (chính sách Logback/Log4j2), hoặc logrotate xoay (với <code>copytruncate</code>, chấp nhận một khoảng mất nhỏ).</p></div>

<h3>Bước 5 — cái bẫy "hai provider"</h3>
${lenh('s10/spring-cauhinh', 12)}
${lenh('s10/spring-cauhinh', 13)}
<p>Ta thêm <code>slf4j-simple</code> bên cạnh Logback — đúng chuyện xảy ra khi một phụ thuộc bắc cầu kéo theo một logger thứ hai. SLF4J cảnh báo "multiple SLF4J providers", <em>chọn một</em> (ở đây chọn sai), và Spring Boot từ chối khởi động: <code>LoggerFactory is not a Logback LoggerContext but Logback is on the classpath</code>. Ở SLF4J 1.7 đời cũ, tình huống này gọi là "multiple bindings" và app có thể vẫn chạy với logger sai mà không ai hay. Tìm thủ phạm bằng <code>mvn dependency:tree -Dincludes=org.slf4j</code> rồi thêm <code>&lt;exclusion&gt;</code>.</p>
<div class="pitfall co-tieu-de"><p><strong>"--" trong chú thích XML làm hỏng tệp.</strong> Bản đầu tiên của <code>logback-lab.xml</code> có chữ <code>--logging.config</code> trong một chú thích; Logback từ chối tệp (<em>The string "--" is not permitted within comments</em>) và Spring Boot không khởi động. Khi cấu hình log hỏng, những dòng đầu tiên của output là thông điệp trạng thái của chính Logback (<code>|-ERROR in ch.qos.logback…</code>) — đọc chúng trước mọi thứ khác.</p></div>

<h3>Bước 6 — chuyển sang Log4j2</h3>
${lenh('s10/spring-log4j2', 0)}
${lenh('s10/spring-log4j2', 1)}
${lenh('s10/spring-log4j2', 3)}
<p>Loại <code>spring-boot-starter-logging</code> khỏi mọi starter kéo nó vào, thêm <code>spring-boot-starter-log4j2</code> (và bỏ thư viện chỉ dành cho Logback như logstash encoder). Giờ jar có <code>log4j-core</code> (phần thực thi), <code>log4j-slf4j2-impl</code> (lời gọi SLF4J đi sang Log4j2) và <code>log4j-jul</code>. Mã Java của bạn không đổi một chữ — đó chính là ý nghĩa của lớp vỏ. Spring Boot giữ nguyên pattern console; tệp cấu hình thành <code>log4j2-spring.xml</code> với <code>&lt;Appenders&gt;</code>, <code>&lt;RollingFile&gt;</code> + <code>&lt;Policies&gt;</code> (<code>TimeBasedTriggeringPolicy</code>, <code>SizeBasedTriggeringPolicy</code>) và <code>&lt;DefaultRolloverStrategy max="…"&gt;</code>. Các đội chọn Log4j2 chủ yếu vì async logger của nó (bài 10.7); Logback là mặc định đơn giản hơn.</p>

<h3>Tình huống đời thật</h3>
<ul>
<li><strong>Outsourcing, dự án cũ:</strong> bạn nhận một app Spring 4 có <code>log4j.properties</code> — tức Log4j 1, đã hết hỗ trợ. Đường nâng cấp: mã dùng API SLF4J, cầu nối <code>log4j-over-slf4j</code> cho lời gọi cũ, Logback hoặc Log4j2 phía sau. Ghi điều này vào báo cáo "rủi ro" tuần đầu của bạn.</li>
<li><strong>"Đầy đĩa" lúc 3 giờ sáng:</strong> <code>du -sh /var/log/* /app/logs</code> cho thấy 40 GB <code>app.log</code>. Cấu hình dùng <code>FileAppender</code>, không phải loại xoay vòng. Sửa: chính sách xoay có <code>totalSizeCap</code>, và production log ở INFO chứ không phải DEBUG.</li>
<li><strong>Nếu</strong> một thư viện xả dòng WARN mỗi giây? Thêm <code>&lt;logger name="com.noisy.lib" level="ERROR"/&gt;</code> — nhưng đọc một cái cảnh báo đó trước đã; đôi khi nó là dấu hiệu duy nhất của một sự cố thật.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Build app shop (<code>mvn package</code>, hoặc <code>docker run --rm -v "$PWD":/p -w /p maven:3.9-eclipse-temurin-21 mvn -q package -DskipTests</code>) và chạy với <code>--logging.config=classpath:logback-lab.xml</code>.</li>
<li>Thêm một <code>springProfile</code>: ở profile <code>prod</code>, root chỉ ghi ra FILE và JSON (không ra console). Chứng minh bằng cách chạy có và không có <code>--spring.profiles.active=prod</code>. (Muốn vậy, đổi tên tệp thành <code>logback-spring.xml</code>.)</li>
<li>Đổi <code>maxFileSize</code> thành 5KB và <code>totalSizeCap</code> thành 12KB, gửi 400 request, và cho thấy các tệp lưu trữ cũ nhất đã bị xoá.</li>
<li>Tái hiện lỗi dòng bị trùng rồi sửa bằng <code>additivity="false"</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> câu 2 không còn dòng console nào sau khởi động ở prod; câu 3 tổng các tệp <code>.gz</code> không bao giờ vượt khoảng 12KB; câu 4 dòng gửi thư chỉ in một lần.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['facade (lớp vỏ)', 'Một API (SLF4J) mã của bạn gọi, không phụ thuộc thư viện nào thực sự ghi ra output.'],
  ['provider / binding', 'Phần thực thi sau SLF4J (Logback, Log4j2, slf4j-simple). Chỉ được có đúng một.'],
  ['bridge (cầu nối)', 'Bộ chuyển hướng một API khác vào SLF4J (jul-to-slf4j, log4j-to-slf4j, log4j-over-slf4j).'],
  ['appender', 'Đích đến của sự kiện log (console, tệp, tệp xoay vòng, socket).'],
  ['additivity', 'Logger có chuyển tiếp sự kiện lên appender của cha hay không (mặc định có).'],
  ['rolling policy', 'Quy tắc xoay tệp theo thời gian/dung lượng và xoá tệp cũ (maxHistory, totalSizeCap).'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mã nói chuyện với SLF4J; Logback (mặc định của Spring) hoặc Log4j2 ghi ra dòng log; cầu nối kéo lời gọi JUL/Log4j-API vào.</li>
<li><code>logback-spring.xml</code>: appender, pattern có <code>%X{…}</code>, logger theo package, root.</li>
<li>Luôn xoay vòng với cả điều kiện dung lượng/thời gian và <code>maxHistory</code> + <code>totalSizeCap</code>.</li>
<li>Dòng trùng → additivity; "multiple providers" → <code>dependency:tree</code> + exclusion.</li>
<li>Chuyển sang Log4j2 = loại starter-logging, thêm starter-log4j2; mã Java giữ nguyên.</li>
</ul>
${nguon('📘', 'SLF4J user manual', 'Lớp vỏ, provider, nối các API cũ', 'https://www.slf4j.org/manual.html')}
${nguon('📘', 'SLF4J error codes', 'Giải thích multiple_bindings / multiple providers', 'https://www.slf4j.org/codes.html')}
${nguon('📘', 'Logback manual — Appenders', 'RollingFileAppender, SizeAndTimeBasedRollingPolicy, maxHistory, totalSizeCap', 'https://logback.qos.ch/manual/appenders.html')}
${nguon('📘', 'Spring Boot reference — Logging', 'logback-spring.xml, springProfile, chuyển sang Log4j2', 'https://docs.spring.io/spring-boot/reference/features/logging.html')}
${lienKet({ khoa: 'spring-boot', bai: 'sb-15-3-logging-traceid', title: 'Spring Boot 15.3 — Logging và traceId', sub: 'Phần log ngắn gọn trong khoá Spring Boot', cta: 'Mở bài' })}
</div>
`,
};
