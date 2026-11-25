/**
 * 6.4 — Lần theo một request qua nhiều dịch vụ bằng correlation ID (soạn 24/11/2026, máy nhà Linux).
 * Output THẬT: nginx 1.27.5 ($request_id) → API node:http (AsyncLocalStorage) → Spring Boot 4.1.1 (MDC, Tomcat 11) —
 * scratchpad/dbg/lab/ch6 (tools/c64-tuong-quan.sh truoc|sau, o-64-*.txt). Mã: s06/_ma-6.mjs.
 */
import { nguon, lienKet } from '../_chung.mjs';

const ma = (s, lang = 'js') => `<pre><code class="language-${lang}">${s}</code></pre>`;

const OUT_TRUOC = `<div class="out">### The user clicks "In hoá đơn" (print invoice) — BEFORE
$ curl -s -i 127.0.0.1:41610/api/hoa-don/1864276489217638401/pdf
HTTP/1.1 502 Bad Gateway
X-Request-Id: 2f6e4b2e                                  ← set by the Node app
X-Request-Id: 256434fe82c467db3657f3d1b85e3333          ← added by nginx
{"loi":"Không in được hoá đơn, thử lại sau","maThamChieu":"2f6e4b2e"}

### The customer's screenshot shows maThamChieu 2f6e4b2e — search all three logs
$ grep -r 2f6e4b2e log/
api.log:{"t":"2026-11-23T22:22:13.466Z","lvl":"error","svc":"api-node","rid":"2f6e4b2e","msg":"hoa-don lỗi khi in PDF","status":500,"id":"1864276489217638401"}
api.log:{"t":"2026-11-23T22:22:13.467Z","lvl":"info","svc":"api-node","rid":"2f6e4b2e","msg":"xong","method":"GET","path":"/api/hoa-don/1864276489217638401/pdf","status":502,"ms":95}
[1 tệp có id này]                                         ← only Node knows it. "hoa-don returned 500" — but WHY?

--- nginx access.log
2026-11-23T22:22:13+00:00 rid=256434fe82c467db3657f3d1b85e3333 "GET /api/hoa-don/1864276489217638401/pdf HTTP/1.1" 502 …
--- java.log (Spring)
22:22:13.428  INFO [hoa-don] rid=c3515f95 HoaDonController : in PDF hoá đơn id=1864276489217638401
22:22:13.431  INFO [hoa-don] rid=c3515f95 RidFilter : xong GET /hoa-don/1864276489217638401/pdf 200 23ms     ← says 200!
22:22:13.431 ERROR [hoa-don] rid=- [dispatcherServlet] : Servlet.service() for servlet [dispatcherServlet] … threw exception
java.lang.IllegalStateException: Mẫu PDF thiếu phông chữ: /app/fonts/BeVietnamPro.ttf                     ← the cause, with NO id
	at vn.labflow.hoadon.HoaDonController.pdf(HoaDonApp.java:57)</div>`;

const OUT_SAU = `<div class="out">### AFTER: one id from the edge to the last service
$ curl -s -i 127.0.0.1:41610/api/hoa-don/1864276489217638401/pdf
HTTP/1.1 502 Bad Gateway
X-Request-Id: c3bcfa9b0c54e40fa3fe2178d2ee2fc0
{"loi":"Không in được hoá đơn, thử lại sau","maThamChieu":"c3bcfa9b0c54e40fa3fe2178d2ee2fc0"}

$ grep -r c3bcfa9b0c54e40fa3fe2178d2ee2fc0 log/
java.log:22:22:43.189  INFO [hoa-don] rid=c3bcfa9b… HoaDonController : in PDF hoá đơn id=1864276489217638401
java.log:22:22:43.190 ERROR [hoa-don] rid=c3bcfa9b… LoiToanCuc : lỗi không bắt ở GET /hoa-don/1864276489217638401/pdf
java.log:22:22:43.210  INFO [hoa-don] rid=c3bcfa9b… RidFilter : xong GET /hoa-don/1864276489217638401/pdf 500 37ms
api.log:{"t":"2026-11-23T22:22:43.214Z","lvl":"error","svc":"api-node","rid":"c3bcfa9b…","msg":"hoa-don lỗi khi in PDF","status":500,…}
api.log:{"t":"2026-11-23T22:22:43.215Z","lvl":"info","svc":"api-node","rid":"c3bcfa9b…","msg":"xong",…,"status":502,"ms":73}
access.log:2026-11-23T22:22:43+00:00 rid=c3bcfa9b… "GET /api/hoa-don/1864276489217638401/pdf HTTP/1.1" 502 rt=0.074 urt=0.074 us=502 …
[3 tệp có id này]

$ grep -A2 'LoiToanCuc' log/java.log
22:22:43.190 ERROR [hoa-don] rid=c3bcfa9b0c54e40fa3fe2178d2ee2fc0 LoiToanCuc : lỗi không bắt ở GET /hoa-don/1864276489217638401/pdf
java.lang.IllegalStateException: Mẫu PDF thiếu phông chữ: /app/fonts/BeVietnamPro.ttf
	at vn.labflow.hoadon.HoaDonController.pdf(HoaDonApp.java:57)</div>`;

const MA_NGINX = ma(`location /api/ {
  proxy_pass http://api_node;
  proxy_set_header X-Request-Id $request_id;   # 1. the edge creates the id (32 hex chars) and OVERWRITES any id the client sent
  proxy_hide_header X-Request-Id;              # 2. FIX: drop the app's own header so the client sees exactly one
  add_header X-Request-Id $request_id always;  # 3. give it back to the client, on errors too ("always")
}
log_format chitiet '$time_iso8601 rid=$request_id "$request" $status rt=$request_time urt=$upstream_response_time us=$upstream_status';`, 'nginx');

const MA_NODE = ma(`import { AsyncLocalStorage } from 'node:async_hooks';
const ngCanh = new AsyncLocalStorage();                    // "the current request", available in every async function below

function log(lvl, msg, them = {}) {                        // every log line gets rid without passing it around
  const rid = ngCanh.getStore()?.rid;
  console.log(JSON.stringify({ t: new Date().toISOString(), lvl, svc: 'api-node', ...(rid ? { rid } : {}), msg, ...them }));
}

http.createServer((req, res) =&gt; {
  const rid = req.headers['x-request-id'] || crypto.randomUUID().slice(0, 8);   // BUG before: ignored the header, always generated
  ngCanh.run({ rid }, () =&gt; xuLy(req, res, rid));
});

// calling the next service: FORWARD the id — the line that was missing
const r = await fetch(\`\${HOA_DON}/hoa-don/\${id}\`, { headers: { 'X-Request-Id': ngCanh.getStore().rid } });`);

const MA_JAVA = ma(`@Component
class RidFilter extends OncePerRequestFilter {
  protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain) throws ServletException, IOException {
    String rid = req.getHeader("X-Request-Id");
    if (rid == null || rid.isBlank()) rid = UUID.randomUUID().toString().substring(0, 8);
    MDC.put("rid", rid);                                   // logging.pattern.console = … rid=%X{rid:--} …
    res.setHeader("X-Request-Id", rid);
    try { chain.doFilter(req, res); }
    finally {
      log.info("xong {} {} {}", req.getMethod(), req.getRequestURI(), res.getStatus());   // trap: still 200 if an exception is in flight
      MDC.remove("rid");                                   // trap: Tomcat logs the exception AFTER this line ⇒ rid=-
    }
  }
}

@RestControllerAdvice                                      // FIX: handle the exception INSIDE the chain, while MDC still has the id
class LoiToanCuc {
  @ExceptionHandler(Exception.class)
  ResponseEntity&lt;Map&lt;String, String&gt;&gt; loi(Exception e, HttpServletRequest req) {
    log.error("lỗi không bắt ở {} {}", req.getMethod(), req.getRequestURI(), e);
    return ResponseEntity.status(500).body(Map.of("loi", "Lỗi máy chủ", "maThamChieu", MDC.get("rid")));
  }
}`, 'java');

const OUT_GIA_MAO = `<div class="out">$ curl -s -o /dev/null -H 'X-Request-Id: x 22:40:00.000 ERROR [hoa-don] rid=admin HoaDonController : xoá toàn bộ hoá đơn' \\
       127.0.0.1:41612/hoa-don/1864276489217638401          # straight to the Java port, bypassing nginx
$ tail -1 log/java.log
22:33:55.741  INFO [hoa-don] rid=x 22:40:00.000 ERROR [hoa-don] rid=admin HoaDonController : xoÃ¡ toÃ n bá» hoÃ¡ ÄÆ¡n RidFilter : xong GET … 200 72ms
              ↑ a forged "ERROR … rid=admin" now sits inside a real log line (and Tomcat decoded the header bytes as ISO-8859-1 — lesson 6.3)

$ curl -s -i -H 'X-Request-Id: gia-mao-123' 127.0.0.1:41610/api/phong | grep X-Request-Id      # through nginx
X-Request-Id: 22560f5f899a727d6976989a65318ac4        ← the edge overwrote the client's value</div>`;

const NGUON = [
  nguon('📗', 'nginx — $request_id (ngx_http_core_module)', 'Biến 16 byte ngẫu nhiên dạng hex, có từ nginx 1.11.0.', 'https://nginx.org/en/docs/http/ngx_http_core_module.html#var_request_id'),
  nguon('📘', 'Node.js — AsyncLocalStorage', 'Giữ ngữ cảnh (request hiện tại) xuyên qua các hàm bất đồng bộ.', 'https://nodejs.org/api/async_context.html#class-asynclocalstorage'),
  nguon('📙', 'SLF4J / Logback — Mapped Diagnostic Context (MDC)', 'Gắn khoá–giá trị vào luồng hiện tại, in bằng %X{rid}.', 'https://logback.qos.ch/manual/mdc.html'),
  nguon('🌐', 'W3C Trace Context (traceparent)', 'Chuẩn header mang trace id giữa các hệ thống khác nhau — OpenTelemetry dùng nó.', 'https://www.w3.org/TR/trace-context/'),
  nguon('🔥', 'NVD — CVE-2021-44228 (Log4Shell, 12/2021)', 'Log4j thực thi chuỗi ${jndi:…} có trong dữ liệu được ghi log — kể cả header như User-Agent.', 'https://nvd.nist.gov/vuln/detail/CVE-2021-44228'),
  lienKet({ khoa: 'observability-monitoring', bai: 'obs-3-4-trace-context', title: 'Observability 3.4 — W3C Trace Context', sub: 'Cái id mà người khác cũng hiểu — bản đầy đủ của bài này.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'observability-monitoring', bai: 'obs-3-3-qua-ranh-gioi', title: 'Observability 3.3 — Đi qua ranh giới', sub: 'Mang id qua proxy, cơ sở dữ liệu, hàng đợi, worker.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-10-7-java-mdc-json-hieu-nang', title: 'Log từ A đến Z 10.7 — MDC và correlation id', sub: 'Log Java trên production: MDC, JSON, hiệu năng.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '6.4 — Following one request across services with a correlation ID|||6.4 — Lần theo một request qua nhiều dịch vụ bằng correlation ID',
  slug: 'dbg-6-4-tuong-quan',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Một lần bấm "In hoá đơn" đi qua nginx → Node → Spring Boot. Chạy thật bản lỗi: ba tầng ba id khác nhau, response có HAI header X-Request-Id, mã tham chiếu khách gửi chỉ tìm thấy ở một tệp log, filter Spring ghi 200 và stack trace ERROR mất id (MDC bị gỡ trước khi Tomcat log). Bản sửa: nginx $request_id + proxy_hide_header, Node AsyncLocalStorage chuyền id sang fetch, Spring MDC + @RestControllerAdvice — một lệnh grep ra đủ 3 tệp. Góc hacker: giả mạo dòng log qua header, Log4Shell 2021.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.4</span>
<h2>One click, three services, one id</h2>
<p class="lead">A customer sends a screenshot: "Không in được hoá đơn — mã tham chiếu 2f6e4b2e". Behind that click are nginx, a Node gateway and a Spring invoice service, each writing its own log. Without one id shared by all of them, you match lines by timestamp and hope — at 200 requests per second that is not debugging, it is guessing. This lesson runs the broken setup first, then fixes it hop by hop.</p>

<h3>An everyday picture: the parcel tracking number</h3>
<p>A parcel goes through the shop, the sorting centre and the local post office. If each one writes the parcel down under its own number, "where is my parcel?" takes three phone calls and guesswork. With one tracking number printed at the first counter and copied at every station, one search shows the whole journey — including the station where it got stuck. The <strong>correlation id</strong> (request id) is that tracking number.</p>

<h3>1. The broken version, as it really behaved</h3>
${OUT_TRUOC}
<p>Read it carefully — there are four separate bugs, and each one is common in real projects:</p>
<ol>
<li><strong>Every hop invents its own id.</strong> nginx has <code>256434fe…</code>, Node has <code>2f6e4b2e</code>, Spring has <code>c3515f95</code>. The customer's reference finds only the Node lines, which say "hoa-don returned 500" — the actual cause is in a file the id does not reach.</li>
<li><strong>Two <code>X-Request-Id</code> headers</strong> in one response (the app sets one, nginx adds another). Lesson 6.2 already showed curl printing both and Postman's script picking one. Which one ends up in the support ticket is luck.</li>
<li><strong>The filter logs 200 for a request that failed.</strong> The exception is still travelling up when the filter's <code>finally</code> runs, so <code>res.getStatus()</code> is still the default 200. A dashboard built on that line would show zero errors.</li>
<li><strong>The stack trace has <code>rid=-</code>.</strong> The filter removes the MDC value in <code>finally</code>; Tomcat logs the exception <em>after</em> the filter chain returns. The one line you need has no id.</li>
</ol>

<h3>2. The fix, hop by hop</h3>
<p><strong>The edge creates the id.</strong> nginx's <code>$request_id</code> is 16 random bytes in hex. Set it for the upstream, overwrite anything the client sent, hide the app's duplicate, and return it to the client:</p>
${MA_NGINX}
<p><strong>Node reads it and forwards it.</strong> <code>AsyncLocalStorage</code> keeps "the current request" available in every <code>await</code> below the handler, so the logger adds <code>rid</code> without passing it through every function. The forgotten line in most gateways is the last one: put the id on the <em>outgoing</em> call.</p>
${MA_NODE}
<p><strong>Spring puts it in the MDC.</strong> A filter reads the header into SLF4J's MDC and the log pattern prints <code>%X{rid}</code>. Then fix the two traps: handle exceptions inside the chain with <code>@RestControllerAdvice</code>, so the error is logged while the id is still there and the status is really 500; and return the id in the error body.</p>
${MA_JAVA}
<p>Result, same click:</p>
${OUT_SAU}
<p>One <code>grep</code>, three files, the whole story in order: nginx 502 in 74 ms ← Node logged the 500 from hoa-don ← Spring threw <code>IllegalStateException: Mẫu PDF thiếu phông chữ</code> at <code>HoaDonApp.java:57</code>. The fix (ship the font) is now obvious, and it took one search instead of an afternoon. In a real system the three files are one log platform (Loki, Elasticsearch/Kibana, CloudWatch) and the search is <code>rid="c3bcfa9b…"</code> — but the work that makes it possible is exactly these three small changes.</p>

<h3>3. Rules that keep the id useful</h3>
<ul>
<li><strong>Generate at the edge, trust only inside.</strong> Overwrite ids coming from the internet; accept them from your own services.</li>
<li><strong>Forward on every hop</strong>: HTTP clients (fetch, axios, RestClient/WebClient — use an interceptor), message queues (put it in message headers), background jobs (store it with the job). The id stops at the first hop that forgets.</li>
<li><strong>Return it to the user</strong> in error bodies and in a response header; show it on error screens ("Mã tham chiếu: …") so support tickets contain it.</li>
<li><strong>Log it as a field</strong> (JSON <code>rid</code>), not hidden inside the message text, so the log platform can index it.</li>
<li><strong>Standards</strong>: <code>X-Request-Id</code> is a convention; W3C <code>traceparent</code> is the standard that tracing systems (OpenTelemetry) use, and it also carries span ids for timing. The observability course covers it — use whichever your project already has, but use exactly one.</li>
</ul>

<h3>Hacker corner: the log believes whatever you put in a header</h3>
${OUT_GIA_MAO}
<p>If a service copies a client header into a plain-text log, the client writes your log. Here a single header forged a whole "ERROR … rid=admin … xoá toàn bộ hoá đơn" entry inside a real line — enough to mislead an investigation or hide a real attack in noise (CWE-117, log injection). Through nginx the value was overwritten, which is why the edge must generate the id. Inside services, validate the format (for example <code>^[0-9a-f-]{8,64}$</code>) and prefer JSON logs, which escape values. The extreme version of "logging attacker-controlled data" was <strong>Log4Shell</strong> (CVE-2021-44228, December 2021): Log4j 2 evaluated <code>\${jndi:ldap://…}</code> found inside logged strings, and attackers put it into <code>User-Agent</code>, <code>X-Api-Version</code> and other headers that servers logged — remote code execution on a huge number of Java systems, from game servers to enterprise products.</p>

<h3>On the job</h3>
<p>The most common OJT ticket in a maintenance project: a customer support email with a screenshot and a reference code, sometimes a week old. Your steps: search the code in the log platform for that date; read the lines in order across services; find the first error; then reproduce (6.2) with the same input. If the project has no correlation id, propose it — it is a small, visible improvement an intern can deliver in a sprint, and reviewers remember who made the next incident take ten minutes instead of a day.</p>

<h3>🧪 Practice (35 min)</h3>
<div class="callout ok">
<ol>
<li>Run <code>tools/c64-tuong-quan.sh truoc</code>. List the ids seen at each hop and explain each of the four bugs from the output alone.</li>
<li>Run <code>tools/c64-tuong-quan.sh sau</code>. Use one <code>grep</code> to print the full story; write the incident in three sentences.</li>
<li>Remove <code>proxy_hide_header</code> and check how many <code>X-Request-Id</code> headers curl sees; then fix it in the app instead (do not set the header when one came in).</li>
<li>Forge a log line by calling the Java port directly; add format validation to <code>RidFilter</code> and show the forged value is replaced.</li>
<li>Bonus: add <code>rid</code> to a background job (e.g. a <code>setTimeout</code> after the response) and show that <code>AsyncLocalStorage</code> still knows it.</li>
</ol>
<p><strong>Done when:</strong> given a reference code from an error screen, you print every log line of that request from all services with one command.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Correlation / request id</span><span class="v">One id per incoming request, copied by every hop and every log line.</span></div>
  <div class="kv"><span class="k">$request_id</span><span class="v">nginx variable: random 32-hex id per request.</span></div>
  <div class="kv"><span class="k">AsyncLocalStorage</span><span class="v">Node API holding per-request context across async calls.</span></div>
  <div class="kv"><span class="k">MDC</span><span class="v">Mapped Diagnostic Context — per-thread key/values printed by the Java logger.</span></div>
  <div class="kv"><span class="k">traceparent</span><span class="v">W3C header carrying trace id + span id between services.</span></div>
  <div class="kv"><span class="k">Log injection</span><span class="v">Untrusted input written into logs to forge or break entries (CWE-117).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Without a shared id, cross-service debugging is guessing by timestamp.</li>
<li>Edge generates (and overwrites), every hop forwards, every line logs it as a field, the user sees it.</li>
<li>Watch the traps: duplicate headers, ids not forwarded on outgoing calls, MDC cleared before the exception is logged, status logged too early.</li>
<li>Never trust an id (or any header) from the internet inside a plain-text log.</li>
</ul>
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.4</span>
<h2>Một lần bấm, ba dịch vụ, một id</h2>
<p class="lead">Khách gửi một ảnh chụp: "Không in được hoá đơn — mã tham chiếu 2f6e4b2e". Sau lần bấm đó là nginx, một cổng Node và một dịch vụ hoá đơn Spring, mỗi bên ghi log riêng. Không có một id chung cho cả ba, bạn ghép các dòng theo giờ và cầu may — ở mức 200 request mỗi giây thì đó không phải gỡ lỗi, đó là đoán. Bài này chạy bản hỏng trước, rồi sửa từng chặng.</p>

<h3>Liên tưởng đời thường: mã vận đơn</h3>
<p>Một bưu kiện đi qua cửa hàng, trung tâm phân loại và bưu cục địa phương. Nếu mỗi nơi ghi bưu kiện theo một số riêng, câu "bưu kiện của tôi đâu?" tốn ba cuộc gọi và một mớ phỏng đoán. Có một mã vận đơn in ngay ở quầy đầu tiên và được chép lại ở mọi trạm, một lần tra là thấy cả hành trình — kể cả trạm nơi nó bị kẹt. <strong>Correlation id</strong> (request id) chính là mã vận đơn đó.</p>

<h3>1. Bản hỏng, đúng như nó đã chạy</h3>
${OUT_TRUOC}
<p>Đọc kỹ — có bốn lỗi riêng biệt, và lỗi nào cũng phổ biến trong dự án thật:</p>
<ol>
<li><strong>Mỗi chặng tự đặt ra id riêng.</strong> nginx có <code>256434fe…</code>, Node có <code>2f6e4b2e</code>, Spring có <code>c3515f95</code>. Mã tham chiếu của khách chỉ tìm ra các dòng của Node, mà Node chỉ nói "hoa-don trả 500" — nguyên nhân thật nằm ở một tệp mà id không tới được.</li>
<li><strong>Hai header <code>X-Request-Id</code></strong> trong cùng một response (app đặt một cái, nginx thêm một cái). Bài 6.2 đã thấy curl in cả hai còn script Postman chọn một. Cái nào lọt vào ticket hỗ trợ là do may rủi.</li>
<li><strong>Filter ghi 200 cho một request đã hỏng.</strong> Lúc khối <code>finally</code> của filter chạy thì ngoại lệ vẫn đang bay lên, nên <code>res.getStatus()</code> vẫn là 200 mặc định. Một dashboard dựng trên dòng đó sẽ báo không có lỗi nào.</li>
<li><strong>Stack trace có <code>rid=-</code>.</strong> Filter gỡ giá trị MDC trong <code>finally</code>; Tomcat ghi log ngoại lệ <em>sau khi</em> chuỗi filter đã trả về. Đúng dòng bạn cần lại không có id.</li>
</ol>

<h3>2. Sửa từng chặng</h3>
<p><strong>Cổng vào tạo id.</strong> <code>$request_id</code> của nginx là 16 byte ngẫu nhiên viết hex. Gắn nó cho upstream, ghi đè mọi giá trị client gửi, giấu bản trùng của app, và trả lại cho client:</p>
${MA_NGINX}
<p><strong>Node đọc và chuyền tiếp.</strong> <code>AsyncLocalStorage</code> giữ "request hiện tại" cho mọi <code>await</code> bên dưới handler, nên hàm log tự thêm <code>rid</code> mà không phải truyền qua từng hàm. Dòng hay bị quên nhất ở các cổng là dòng cuối: gắn id vào lời gọi <em>đi ra</em>.</p>
${MA_NODE}
<p><strong>Spring đưa nó vào MDC.</strong> Một filter đọc header vào MDC của SLF4J và mẫu log in <code>%X{rid}</code>. Rồi sửa hai cái bẫy: bắt ngoại lệ ngay trong chuỗi bằng <code>@RestControllerAdvice</code>, để lỗi được ghi khi id vẫn còn và mã thật sự là 500; và trả id trong body lỗi.</p>
${MA_JAVA}
<p>Kết quả, cùng một lần bấm:</p>
${OUT_SAU}
<p>Một lệnh <code>grep</code>, ba tệp, cả câu chuyện theo đúng thứ tự: nginx trả 502 sau 74 ms ← Node ghi nhận 500 từ hoa-don ← Spring ném <code>IllegalStateException: Mẫu PDF thiếu phông chữ</code> ở <code>HoaDonApp.java:57</code>. Cách sửa (đóng gói phông chữ) hiện ra ngay, và chỉ tốn một lần tìm thay vì cả buổi chiều. Trong hệ thống thật, ba tệp đó là một nền tảng log (Loki, Elasticsearch/Kibana, CloudWatch) và câu tìm là <code>rid="c3bcfa9b…"</code> — nhưng thứ làm nó khả thi chính là ba thay đổi nhỏ này.</p>

<h3>3. Luật giữ cho id có ích</h3>
<ul>
<li><strong>Tạo ở cổng vào, chỉ tin ở bên trong.</strong> Ghi đè id tới từ Internet; nhận id từ các dịch vụ của chính mình.</li>
<li><strong>Chuyền tiếp ở mọi chặng</strong>: HTTP client (fetch, axios, RestClient/WebClient — dùng interceptor), hàng đợi tin nhắn (để trong header của tin nhắn), job chạy nền (lưu kèm job). Id dừng lại ở chặng đầu tiên quên chuyền.</li>
<li><strong>Trả nó cho người dùng</strong> trong body lỗi và trong header response; hiện nó trên màn hình lỗi ("Mã tham chiếu: …") để ticket hỗ trợ có sẵn.</li>
<li><strong>Ghi nó thành một trường</strong> (<code>rid</code> trong JSON), đừng giấu trong câu thông báo, để nền tảng log đánh chỉ mục được.</li>
<li><strong>Chuẩn</strong>: <code>X-Request-Id</code> là quy ước; <code>traceparent</code> của W3C là chuẩn mà hệ thống tracing (OpenTelemetry) dùng, và mang cả span id để đo thời gian. Khoá observability dạy kỹ phần này — dự án đang dùng cái nào thì dùng cái đó, nhưng chỉ dùng đúng một.</li>
</ul>

<h3>Góc hacker: log tin mọi thứ bạn nhét vào header</h3>
${OUT_GIA_MAO}
<p>Nếu một dịch vụ chép header của client vào log dạng chữ thường, thì client đang viết log của bạn. Ở đây một header duy nhất đã giả được cả một mục "ERROR … rid=admin … xoá toàn bộ hoá đơn" nằm gọn trong một dòng thật — đủ để đánh lạc hướng cuộc điều tra hoặc giấu một vụ tấn công thật trong mớ nhiễu (CWE-117, log injection). Đi qua nginx thì giá trị bị ghi đè, đó là lý do cổng vào phải tự tạo id. Bên trong các dịch vụ, hãy kiểm định dạng (ví dụ <code>^[0-9a-f-]{8,64}$</code>) và ưu tiên log JSON, vốn có escape giá trị. Phiên bản cực đoan của "ghi log dữ liệu do kẻ tấn công kiểm soát" là <strong>Log4Shell</strong> (CVE-2021-44228, tháng 12/2021): Log4j 2 thực thi <code>\${jndi:ldap://…}</code> nằm trong chuỗi được ghi log, và kẻ tấn công nhét nó vào <code>User-Agent</code>, <code>X-Api-Version</code> cùng các header khác mà server ghi lại — chạy mã từ xa trên vô số hệ thống Java, từ server game tới sản phẩm doanh nghiệp.</p>

<h3>Tình huống đi làm</h3>
<p>Ticket OJT hay gặp nhất trong dự án bảo trì: một email từ bộ phận hỗ trợ khách hàng, kèm ảnh chụp và một mã tham chiếu, có khi đã cũ cả tuần. Các bước của bạn: tìm mã đó trong nền tảng log đúng ngày; đọc các dòng theo thứ tự qua các dịch vụ; tìm lỗi đầu tiên; rồi tái hiện (bài 6.2) với cùng dữ liệu vào. Nếu dự án chưa có correlation id, hãy đề xuất — đó là cải tiến nhỏ, dễ thấy, một thực tập sinh làm xong trong một sprint, và người review sẽ nhớ ai đã giúp sự cố sau chỉ tốn mười phút thay vì một ngày.</p>

<h3>🧪 Thực hành (35 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>tools/c64-tuong-quan.sh truoc</code>. Liệt kê id ở từng chặng và giải thích bốn lỗi chỉ từ output.</li>
<li>Chạy <code>tools/c64-tuong-quan.sh sau</code>. Dùng một lệnh <code>grep</code> in ra cả câu chuyện; viết sự cố thành ba câu.</li>
<li>Bỏ <code>proxy_hide_header</code> rồi đếm xem curl thấy mấy header <code>X-Request-Id</code>; sau đó sửa ở app thay vì ở nginx (không đặt header khi request đã mang sẵn id).</li>
<li>Giả mạo một dòng log bằng cách gọi thẳng cổng Java; thêm phép kiểm định dạng vào <code>RidFilter</code> và cho thấy giá trị giả bị thay.</li>
<li>Thêm: gắn <code>rid</code> cho một việc chạy nền (ví dụ một <code>setTimeout</code> sau khi đã trả response) và cho thấy <code>AsyncLocalStorage</code> vẫn biết nó.</li>
</ol>
<p><strong>Đạt khi:</strong> từ một mã tham chiếu trên màn hình lỗi, bạn in ra mọi dòng log của request đó ở mọi dịch vụ bằng một lệnh.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Correlation / request id</span><span class="v">Một id cho mỗi request đi vào, được mọi chặng và mọi dòng log chép theo.</span></div>
  <div class="kv"><span class="k">$request_id</span><span class="v">Biến của nginx: id ngẫu nhiên 32 ký tự hex cho mỗi request.</span></div>
  <div class="kv"><span class="k">AsyncLocalStorage</span><span class="v">API của Node giữ ngữ cảnh từng request qua các lời gọi bất đồng bộ.</span></div>
  <div class="kv"><span class="k">MDC</span><span class="v">Mapped Diagnostic Context — cặp khoá/giá trị theo luồng mà logger Java in ra.</span></div>
  <div class="kv"><span class="k">traceparent</span><span class="v">Header W3C mang trace id + span id giữa các dịch vụ.</span></div>
  <div class="kv"><span class="k">Log injection</span><span class="v">Đầu vào không tin cậy bị ghi vào log để giả mạo hoặc làm hỏng các mục (CWE-117).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Không có id chung thì gỡ lỗi xuyên dịch vụ là đoán theo giờ.</li>
<li>Cổng vào tạo (và ghi đè), mọi chặng chuyền tiếp, mọi dòng log ghi thành trường, người dùng nhìn thấy.</li>
<li>Coi chừng các bẫy: header trùng, id không được chuyền sang lời gọi đi ra, MDC bị xoá trước khi ngoại lệ được ghi, mã trạng thái ghi quá sớm.</li>
<li>Đừng bao giờ tin id (hay header nào) tới từ Internet trong một log dạng chữ thường.</li>
</ul>
${NGUON}
</div>
`,
};
