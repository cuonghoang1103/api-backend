/**
 * 4.4 — Gỡ lỗi chính Spring: bean nào, controller nào, truy vấn nào (soạn 24/11/2026).
 * Output THẬT (Spring Boot 4.1.1, Spring Security 7, Hibernate 7, JDK 25): breakpoint trong RequestMappingHandlerAdapter.handleInternal (jdb),
 * /actuator/mappings, log TRACE của Spring Security cho POST bị 403 (CsrfFilter), lỗi khởi động "required a single bean, but 2 were found"
 * (profile zalo), log SQL Hibernate kèm tham số (org.hibernate.SQL + org.hibernate.orm.jdbc.bind). Phiên: s44.txt, s44-csrf.log, s44-sql.log.
 * Quan sát thật: trước khi permitAll("/error"), cùng request đó trả 401 thay vì 403 (lần forward sang /error bị denyAll chặn).
 */
import { nguon, lienKet } from '../_chung.mjs';
import { BAOMAT, SV_CONTROLLER, ZALO, THONGBAO } from './_ma-4.mjs';

const ma = (s, lang = 'java') => `<pre><code class="language-${lang}">${s}</code></pre>`;

const OUT_HANDLER = `<div class="out">&gt; stop in org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.handleInternal
                                     # curl -s 127.0.0.1:48080/api/dat-cho/1/hoa-don
Breakpoint hit: … RequestMappingHandlerAdapter.handleInternal(), line=835 bci=0
exec-5[1] locals
Method arguments:
request = instance of org.springframework.security.web.servletapi.HttpServlet3RequestFactory$Servlet3SecurityContextHolderAwareRequestWrapper(id=16029)
response = instance of org.springframework.security.web.header.HeaderWriterFilter$HeaderWriterResponse(id=16030)
handlerMethod = instance of org.springframework.web.method.HandlerMethod(id=16031)
exec-5[1] print handlerMethod.getBeanType()
 handlerMethod.getBeanType() = "class vn.labflow.web.DatChoController"
exec-5[1] print handlerMethod.getMethod().getName()
 handlerMethod.getMethod().getName() = "hoaDon"
exec-5[1] print request.getRequestURI()
 request.getRequestURI() = "/api/dat-cho/1/hoa-don"</div>`;

const OUT_MAPPINGS = `<div class="out">$ curl -s 127.0.0.1:48080/actuator/mappings | python3 -c '…filter predicates containing nap-luot / hoa-don…'
{"handler": "vn.labflow.web.SinhVienController#napLuot(String)", "predicate": "{POST [/api/sinh-vien/{ma}/nap-luot]}"}
{"handler": "vn.labflow.web.DatChoController#hoaDon(long, String)", "predicate": "{GET [/api/dat-cho/{id}/hoa-don]}"}</div>`;

const OUT_403 = `<div class="out">$ curl -s -i -X POST 127.0.0.1:48080/api/sinh-vien/SE1801/nap-luot
HTTP/1.1 403
Set-Cookie: JSESSIONID=854FD6267D92ED3F65CA78F033C6E9D3; Path=/; HttpOnly
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Type: application/json

{"timestamp":"2026-11-23T21:04:16.979Z","status":403,"error":"Forbidden","path":"/api/sinh-vien/SE1801/nap-luot"}
                                     ← no breakpoint in SinhVienController is ever hit; app log at INFO: nothing</div>`;

const OUT_TRACE = `<div class="out">$ ./chay.sh -Dlogging.level.org.springframework.security=TRACE          # or in application-dev.properties
$ curl -s -X POST 127.0.0.1:48080/api/sinh-vien/SE1801/nap-luot
TRACE o.s.security.web.FilterChainProxy        : Trying to match request against DefaultSecurityFilterChain defined as 'chuoiLoc' in [class path resource [vn/labflow/config/BaoMat.class]] …
DEBUG o.s.security.web.FilterChainProxy        : Securing POST /api/sinh-vien/SE1801/nap-luot
TRACE o.s.security.web.FilterChainProxy        : Invoking DisableEncodeUrlFilter (1/12)
TRACE o.s.security.web.FilterChainProxy        : Invoking WebAsyncManagerIntegrationFilter (2/12)
TRACE o.s.security.web.FilterChainProxy        : Invoking SecurityContextHolderFilter (3/12)
TRACE o.s.security.web.FilterChainProxy        : Invoking HeaderWriterFilter (4/12)
TRACE o.s.security.web.FilterChainProxy        : Invoking CsrfFilter (5/12)
TRACE s.s.w.c.CsrfTokenRequestAttributeHandler : Wrote a CSRF token to the following request attributes: [_csrf, org.springframework.security.web.csrf.CsrfToken]
TRACE o.s.s.web.csrf.CsrfTokenRequestHandler   : Did not find a CSRF token in the [X-CSRF-TOKEN] request header
TRACE o.s.s.web.csrf.CsrfTokenRequestHandler   : Did not find a CSRF token in the [_csrf] request parameter
DEBUG o.s.security.web.csrf.CsrfFilter         : Invalid CSRF token found for http://127.0.0.1:48080/api/sinh-vien/SE1801/nap-luot
DEBUG o.s.s.w.access.AccessDeniedHandlerImpl   : Responding with 403 status code
DEBUG o.s.security.web.FilterChainProxy        : Securing GET /error                ← Spring Boot then renders the error page
…
DEBUG o.s.security.web.FilterChainProxy        : Secured GET /error</div>`;

const OUT_BEAN = `<div class="out">$ java -Dspring.profiles.active=zalo -cp target/classes:'target/lib/*' vn.labflow.LabFlowApp
…
***************************
APPLICATION FAILED TO START
***************************

Description:

Parameter 2 of constructor in vn.labflow.service.DatChoService required a single bean, but 2 were found:
	- emailThongBao: defined in file [/tmp/dbg-lab/ch4/app/target/classes/vn/labflow/service/EmailThongBao.class]
	- zaloThongBao: defined in file [/tmp/dbg-lab/ch4/app/target/classes/vn/labflow/service/ZaloThongBao.class]

This may be due to missing parameter name information

Action:

Consider marking one of the beans as @Primary, updating the consumer to accept multiple beans, or using @Qualifier to identify the bean that should be consumed

Ensure that your compiler is configured to use the '-parameters' flag.
You may need to update both your build tool settings as well as your IDE.
(See https://github.com/spring-projects/spring-framework/wiki/Spring-Framework-6.1-Release-Notes#parameter-name-retention)</div>`;

const OUT_SQL = `<div class="out">$ ./chay.sh -Dlogging.level.org.hibernate.SQL=DEBUG -Dlogging.level.org.hibernate.orm.jdbc.bind=TRACE
$ curl -s '127.0.0.1:48080/api/bao-cao/tuan?tu=2026-11-23' &gt;/dev/null
DEBUG org.hibernate.SQL                        : select dc1_0.id,dc1_0.bat_dau,dc1_0.ghi_chu,dc1_0.nguoi_dat,dc1_0.phong_id,dc1_0.so_phut,dc1_0.trang_thai from dat_cho dc1_0 where dc1_0.bat_dau between ? and ? order by dc1_0.bat_dau
TRACE org.hibernate.orm.jdbc.bind              : binding parameter (1:TIMESTAMP_UTC) &lt;- [2026-11-22T17:00:00Z]
TRACE org.hibernate.orm.jdbc.bind              : binding parameter (2:TIMESTAMP_UTC) &lt;- [2026-11-29T17:00:00Z]
DEBUG org.hibernate.SQL                        : select p1_0.id,p1_0.gia_gio,p1_0.ten from phong p1_0 where p1_0.id=?
TRACE org.hibernate.orm.jdbc.bind              : binding parameter (1:BIGINT) &lt;- [1]
DEBUG org.hibernate.SQL                        : select p1_0.id,p1_0.gia_gio,p1_0.ten from phong p1_0 where p1_0.id=?
TRACE org.hibernate.orm.jdbc.bind              : binding parameter (1:BIGINT) &lt;- [2]</div>`;

const MA_SUA_BAOMAT = `<pre><code class="language-java">// Option A — this API is stateless JSON (no session cookie used for auth): CSRF protection does not apply
.csrf(c -&gt; c.ignoringRequestMatchers("/api/**"))

// Option B — the front-end logs in with a session cookie: KEEP CSRF, send the token
// (CookieCsrfTokenRepository.withHttpOnlyFalse(); the SPA reads XSRF-TOKEN and sends X-XSRF-TOKEN)</code></pre>`;

const NGUON = [
  nguon('🔐', 'Spring Security — Debugging (logging.level.org.springframework.security=TRACE)', 'Cách chính thức để thấy filter nào xử lý và từ chối request.', 'https://docs.spring.io/spring-security/reference/servlet/architecture.html#servlet-logging'),
  nguon('🛡️', 'Spring Security — CSRF (when to disable)', 'Bảo vệ mặc định cho mọi request không phải GET/HEAD/OPTIONS/TRACE; tắt chỉ khi API không dùng cookie để xác thực.', 'https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html'),
  nguon('📈', 'Spring Boot — Actuator endpoints (mappings, beans, conditions)', 'Xem route → controller, bean nào tồn tại, auto-config nào bật/tắt.', 'https://docs.spring.io/spring-boot/reference/actuator/endpoints.html'),
  nguon('🗄️', 'Hibernate ORM 7 — Logging (org.hibernate.SQL, org.hibernate.orm.jdbc.bind)', 'Tên logger in câu SQL và giá trị tham số.', 'https://docs.jboss.org/hibernate/orm/7.0/userguide/html_single/Hibernate_User_Guide.html#best-practices-logging'),
  nguon('🧠', 'IntelliJ IDEA — Download sources / Debug library code', 'Tải mã nguồn thư viện từ Maven để đặt breakpoint trong Spring.', 'https://www.jetbrains.com/help/idea/library.html'),
  lienKet({ khoa: 'spring-boot', bai: 'sb-9-1-security-filter-chain', title: 'Spring Boot 9.1 — chuỗi filter của Spring Security', sub: 'Học kỹ 12 filter ở log trên; bài này chỉ dạy cách soi chúng khi gỡ lỗi.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'authentication', bai: 'auth-3-4-csrf', title: 'Authentication 3.4 — CSRF', sub: 'Vì sao có CSRF, khi nào cookie cần token, khi nào API JWT thì không.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'spring-boot', bai: 'sb-7-1-n-cong-1', title: 'Spring Boot 7.1 — vấn đề N+1', sub: 'Hai câu select phong ở log SQL trên là N+1; cách sửa bằng fetch join / EntityGraph.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '4.4 — Debugging Spring itself: which bean, which controller, which query|||4.4 — Gỡ lỗi chính Spring: bean nào, controller nào, truy vấn nào',
  slug: 'dbg-4-4-spring',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Khi lỗi nằm "giữa" code của bạn và Spring: đặt breakpoint trong thư viện (Download Sources) để biết request vào controller nào, dùng /actuator/mappings; POST trả 403 mà breakpoint trong controller không bao giờ dừng — bật log TRACE Spring Security thấy CsrfFilter (5/12) từ chối; ứng dụng không khởi động vì hai bean ThongBao (profile zalo) — đọc đúng thông báo của Spring; bật log SQL Hibernate kèm tham số và nhận ra N+1. Tình huống OJT: 403 mà không ai biết filter nào chặn.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.4</span>
<h2>When the bug lives between your code and the framework</h2>
<p class="lead">Many Spring bugs never reach your code: a request is rejected by a security filter, a bean is never created, a query you did not write is slow. Breakpoints in your classes never hit, so the instinct "put a breakpoint" fails. This lesson gives four tools for that layer: breakpoints inside Spring, Actuator, Spring Security's TRACE log, and Hibernate's SQL log.</p>

<h3>An everyday picture: the building's reception desk</h3>
<p>You wait in your office for a visitor who never arrives. Waiting harder at your door (breakpoint in the controller) does not help — the visitor was stopped downstairs. Ask reception for the visitor log (security TRACE), the building directory (mappings), and the list of staff on duty today (beans).</p>

<h3>1. Which controller handles this request?</h3>
<p>In a big project, URLs come from constants, class-level <code>@RequestMapping</code>, versions and gateways; searching the code for the URL often fails. Two ways to ask Spring directly:</p>
<p><strong>(a) A breakpoint inside Spring MVC.</strong> In IntelliJ, open the class (Ctrl+N / ⌘O, tick "include non-project items"), click <em>Download Sources</em> in the yellow banner so you see real source instead of decompiled code, then set a breakpoint in <code>RequestMappingHandlerAdapter.handleInternal</code> — every annotated controller call passes through it:</p>
${OUT_HANDLER}
<p>Spring's jars are compiled with parameter names, so the variables are readable. Use Suspend: Thread and a condition such as <code>request.getRequestURI().contains("hoa-don")</code> — this method is hit by every request.</p>
<p><strong>(b) Actuator mappings</strong> — the whole route table, no debugger needed (expose it only on dev/local, see lesson 4.5's warning and Spring Boot 15.1):</p>
${OUT_MAPPINGS}

<h3>2. A 403 that never reaches your controller</h3>
<p>Sprint 7 adds "top up free bookings" for the front desk:</p>
${ma(SV_CONTROLLER)}
${OUT_403}
<p>The status 403 means "Spring Security said no", and Security does not log refusals at INFO. Turn on its TRACE log (dev only — it is very verbose and can contain session ids):</p>
${OUT_TRACE}
<p>Read it top-down: which chain matched, then each of the 12 filters in order, then who decided. Filter 5/12, <code>CsrfFilter</code>, looked for a token in the <code>X-CSRF-TOKEN</code> header and the <code>_csrf</code> parameter, found none, and answered 403. Now look at the security configuration:</p>
${ma(BAOMAT)}
<p>CSRF protection is on by default for every POST/PUT/PATCH/DELETE. The ignore list covers <code>/api/dat-cho/**</code> and <code>/api/bao-cao/**</code> — the new <code>/api/sinh-vien/**</code> was forgotten. The decision that follows is a security decision, not a "make the 403 go away":</p>
${MA_SUA_BAOMAT}
<p><strong>A variant we hit for real:</strong> in the first version of this config, <code>/error</code> was not in the <code>permitAll</code> list (<code>anyRequest().denyAll()</code> covered it). The very same request then returned <strong>401</strong>, not 403 — Spring Boot forwards errors to <code>/error</code>, that forward was refused for an anonymous user, and the HTTP Basic entry point answered 401. So "401 vs 403" alone does not tell you which filter refused; the TRACE log does.</p>

<h3>3. A bean that is not there — or is there twice</h3>
<p>A teammate adds a Zalo notifier for a pilot and turns on its profile:</p>
${ma(THONGBAO)}
${ma(ZALO)}
${OUT_BEAN}
<p>Spring's failure analysis is precise; read all of it before searching the web. "Parameter 2 of constructor in DatChoService" = the third constructor parameter, <code>ThongBao</code>. Two candidates, three suggested fixes. The right one depends on intent: <code>@Primary</code> on the default implementation (we chose this), <code>@Qualifier("zaloThongBao")</code> where Zalo is wanted, or <code>List&lt;ThongBao&gt;</code> to send to all. The "-parameters" lines are a generic hint printed whenever names could not be matched — Spring Boot's Maven parent already sets that flag.</p>
<p>Related start-up failures you will meet in OJT: <em>"required a bean of type … that could not be found"</em> (class outside the <code>@SpringBootApplication</code> package, missing <code>@Service</code>, or a profile/condition not active), and "the bean is created but my config is ignored" — run with <code>--debug</code> to print the auto-configuration conditions report, or call <code>/actuator/conditions</code> and <code>/actuator/beans</code>.</p>

<h3>4. Which SQL did Hibernate really run, with which values?</h3>
<p><code>spring.jpa.show-sql=true</code> prints SQL to stdout without parameters. Use the loggers instead:</p>
${OUT_SQL}
<p>Three things to read: the time window is bound as UTC (<code>2026-11-22T17:00:00Z</code> = Monday 00:00 in Vietnam) — correct; one query for bookings, then <strong>one query per room</strong>: that is N+1, because <code>DatCho.phong</code> is LAZY and the report calls <code>getPhong().getTen()</code> for each booking. With 2 rooms it is 3 queries; with 300 bookings in 80 rooms it is 81. Fixing it belongs to the Spring Boot course (link below) and chapter 7; finding it is one log line.</p>

<h3>Workplace situation (OJT)</h3>
<p>A front-end colleague on another team: "your POST returns 403, but GET works and the token is valid". Do not reply "works on Postman". Turn on Security TRACE in your local profile, replay their exact request (Copy as cURL from their browser — chapter 6), and answer with the filter name and the line: "CsrfFilter rejects: no X-CSRF-TOKEN. Our API is stateless, I will add <code>/api/sinh-vien/**</code> to the ignore list — PR #123". Five lines, no blame, problem closed.</p>

<h3>🧪 Practice (35 min)</h3>
<div class="callout ok">
<ol>
<li>Download Spring sources in IntelliJ, break in <code>handleInternal</code> with a URI condition, read the handler for three different URLs; compare with <code>/actuator/mappings</code>.</li>
<li>Reproduce the 403, read the TRACE log, fix it with option A, and write one sentence on when option B is required.</li>
<li>Remove <code>"/error"</code> from <code>permitAll</code> and confirm the 401 variant; put it back.</li>
<li>Start with the <code>zalo</code> profile, read the failure, fix it with <code>@Primary</code>; then with <code>@Qualifier</code> instead.</li>
<li>Turn on SQL + bind logs, count the queries of <code>/api/bao-cao/tuan</code>.</li>
</ol>
<p><strong>Done when:</strong> for each of the four problems you can name the exact Spring component that decided (filter, handler, bean factory, Hibernate).</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">HandlerMethod</span><span class="v">Spring MVC's description of the controller method chosen for a request.</span></div>
  <div class="kv"><span class="k">Security filter chain</span><span class="v">Ordered filters (12 here) every request passes before your controller.</span></div>
  <div class="kv"><span class="k">CSRF token</span><span class="v">Secret a cookie-authenticated browser must echo on state-changing requests.</span></div>
  <div class="kv"><span class="k">FailureAnalyzer</span><span class="v">Spring Boot's "APPLICATION FAILED TO START" explanation.</span></div>
  <div class="kv"><span class="k">@Primary / @Qualifier</span><span class="v">Choose among several beans of one type.</span></div>
  <div class="kv"><span class="k">N+1</span><span class="v">One query for a list + one query per element.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Breakpoint never hit ⇒ the problem is before your code: look at the framework layer.</li>
<li>Route → controller: breakpoint in handleInternal, or /actuator/mappings.</li>
<li>401/403: Spring Security TRACE shows the filter that decided.</li>
<li>Start-up failure: read Spring's description and action fully; it names the bean and the fix.</li>
<li>SQL: org.hibernate.SQL + org.hibernate.orm.jdbc.bind; count the queries.</li>
</ul>
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.4</span>
<h2>Khi lỗi nằm giữa code của bạn và framework</h2>
<p class="lead">Nhiều lỗi Spring không bao giờ chạm tới code của bạn: request bị một security filter từ chối, một bean không được tạo, một câu truy vấn bạn không viết bị chậm. Breakpoint trong lớp của bạn không bao giờ dừng, nên phản xạ "đặt breakpoint" thất bại. Bài này cho bốn công cụ cho tầng đó: breakpoint bên trong Spring, Actuator, log TRACE của Spring Security và log SQL của Hibernate.</p>

<h3>Liên tưởng đời thường: quầy lễ tân toà nhà</h3>
<p>Bạn ngồi trong văn phòng chờ một vị khách mãi không tới. Chờ kỹ hơn ở cửa phòng (breakpoint trong controller) chẳng giúp gì — khách đã bị chặn ở tầng trệt. Hãy xin lễ tân sổ khách ra vào (security TRACE), bảng chỉ dẫn toà nhà (mappings) và danh sách nhân viên trực hôm nay (beans).</p>

<h3>1. Request này vào controller nào?</h3>
<p>Ở dự án lớn, URL ghép từ hằng số, <code>@RequestMapping</code> ở mức lớp, tiền tố phiên bản, gateway; tìm chuỗi URL trong code thường không ra. Hai cách hỏi thẳng Spring:</p>
<p><strong>(a) Breakpoint bên trong Spring MVC.</strong> Trong IntelliJ, mở lớp (Ctrl+N / ⌘O, tích "include non-project items"), bấm <em>Download Sources</em> trên dải vàng để thấy mã nguồn thật thay vì mã dịch ngược, rồi đặt breakpoint trong <code>RequestMappingHandlerAdapter.handleInternal</code> — mọi lời gọi controller có annotation đều đi qua đây:</p>
${OUT_HANDLER}
<p>Jar của Spring được biên dịch kèm tên tham số nên biến đọc được. Dùng Suspend: Thread và điều kiện kiểu <code>request.getRequestURI().contains("hoa-don")</code> — hàm này request nào cũng chạy qua.</p>
<p><strong>(b) Actuator mappings</strong> — cả bảng route, không cần debugger (chỉ mở ở dev/máy mình, xem cảnh báo ở bài 4.5 và Spring Boot 15.1):</p>
${OUT_MAPPINGS}

<h3>2. Lỗi 403 không bao giờ tới controller</h3>
<p>Sprint 7 thêm chức năng "nạp lượt miễn phí" cho lễ tân:</p>
${ma(SV_CONTROLLER)}
${OUT_403}
<p>Mã 403 nghĩa là "Spring Security nói không", và Security không ghi log lời từ chối ở mức INFO. Bật log TRACE của nó (chỉ ở dev — rất dài và có thể chứa session id):</p>
${OUT_TRACE}
<p>Đọc từ trên xuống: chuỗi filter nào khớp, rồi lần lượt 12 filter, rồi ai quyết định. Filter 5/12, <code>CsrfFilter</code>, tìm token ở header <code>X-CSRF-TOKEN</code> và tham số <code>_csrf</code>, không thấy, trả 403. Giờ nhìn cấu hình bảo mật:</p>
${ma(BAOMAT)}
<p>Bảo vệ CSRF bật mặc định cho mọi POST/PUT/PATCH/DELETE. Danh sách bỏ qua có <code>/api/dat-cho/**</code> và <code>/api/bao-cao/**</code> — còn <code>/api/sinh-vien/**</code> mới thêm thì bị quên. Quyết định tiếp theo là quyết định bảo mật, không phải "làm sao cho hết 403":</p>
${MA_SUA_BAOMAT}
<p><strong>Một biến thể chúng tôi gặp thật:</strong> ở phiên bản đầu của cấu hình, <code>/error</code> không nằm trong <code>permitAll</code> (bị <code>anyRequest().denyAll()</code> phủ). Khi đó cùng request ấy trả <strong>401</strong> chứ không phải 403 — Spring Boot chuyển lỗi sang <code>/error</code>, lần chuyển đó bị từ chối với người dùng ẩn danh, và entry point HTTP Basic trả 401. Vậy chỉ nhìn "401 hay 403" không biết được filter nào từ chối; log TRACE thì biết.</p>

<h3>3. Bean không có — hoặc có tới hai cái</h3>
<p>Một đồng đội thêm bộ gửi thông báo Zalo cho đợt thử nghiệm và bật profile của nó:</p>
${ma(THONGBAO)}
${ma(ZALO)}
${OUT_BEAN}
<p>Phần phân tích lỗi của Spring rất chính xác; đọc hết trước khi lên mạng tìm. "Parameter 2 of constructor in DatChoService" = tham số thứ ba của constructor, <code>ThongBao</code>. Hai ứng viên, ba cách sửa gợi ý. Chọn cách nào tuỳ ý đồ: <code>@Primary</code> trên bản mặc định (chúng tôi chọn cách này), <code>@Qualifier("zaloThongBao")</code> ở chỗ muốn dùng Zalo, hoặc <code>List&lt;ThongBao&gt;</code> để gửi qua tất cả. Mấy dòng về "-parameters" là gợi ý chung, in ra mỗi khi không khớp được theo tên — parent Maven của Spring Boot đã bật cờ đó.</p>
<p>Các lỗi khởi động họ hàng sẽ gặp khi OJT: <em>"required a bean of type … that could not be found"</em> (lớp nằm ngoài package của <code>@SpringBootApplication</code>, thiếu <code>@Service</code>, hoặc profile/điều kiện chưa bật), và "bean có tạo nhưng cấu hình của tôi bị bỏ qua" — chạy với <code>--debug</code> để in báo cáo điều kiện auto-configuration, hoặc gọi <code>/actuator/conditions</code> và <code>/actuator/beans</code>.</p>

<h3>4. Hibernate đã thật sự chạy SQL gì, với giá trị nào?</h3>
<p><code>spring.jpa.show-sql=true</code> in SQL ra stdout nhưng không có tham số. Hãy dùng logger:</p>
${OUT_SQL}
<p>Ba điều cần đọc: khoảng thời gian được bind theo UTC (<code>2026-11-22T17:00:00Z</code> = 00:00 thứ Hai giờ Việt Nam) — đúng; một câu lấy lượt đặt, rồi <strong>mỗi phòng một câu</strong>: đó là N+1, vì <code>DatCho.phong</code> là LAZY và báo cáo gọi <code>getPhong().getTen()</code> cho từng lượt. 2 phòng thì 3 câu; 300 lượt ở 80 phòng thì 81 câu. Sửa nó thuộc khoá Spring Boot (liên kết dưới) và chương 7; tìm ra nó chỉ cần một dòng log.</p>

<h3>Tình huống đi làm (OJT)</h3>
<p>Một bạn front-end ở đội khác nhắn: "POST của bạn trả 403, nhưng GET thì chạy và token vẫn hợp lệ". Đừng trả lời "Postman chạy mà". Bật Security TRACE ở profile máy mình, gửi lại đúng request của họ (Copy as cURL từ trình duyệt của họ — chương 6), rồi trả lời bằng tên filter và dòng log: "CsrfFilter từ chối: không có X-CSRF-TOKEN. API mình stateless, mình sẽ thêm <code>/api/sinh-vien/**</code> vào danh sách bỏ qua — PR #123". Năm dòng, không đổ lỗi, xong việc.</p>

<h3>🧪 Thực hành (35 phút)</h3>
<div class="callout ok">
<ol>
<li>Tải mã nguồn Spring trong IntelliJ, dừng trong <code>handleInternal</code> với điều kiện URI, đọc handler của ba URL khác nhau; so với <code>/actuator/mappings</code>.</li>
<li>Tái hiện lỗi 403, đọc log TRACE, sửa theo phương án A, và viết một câu: khi nào bắt buộc phương án B.</li>
<li>Bỏ <code>"/error"</code> khỏi <code>permitAll</code> và xác nhận biến thể 401; trả lại như cũ.</li>
<li>Khởi động với profile <code>zalo</code>, đọc lỗi, sửa bằng <code>@Primary</code>; rồi thử bằng <code>@Qualifier</code>.</li>
<li>Bật log SQL + bind, đếm số câu truy vấn của <code>/api/bao-cao/tuan</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> với cả bốn vấn đề, bạn gọi đúng tên thành phần Spring đã ra quyết định (filter, handler, bean factory, Hibernate).</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">HandlerMethod</span><span class="v">Mô tả hàm controller mà Spring MVC chọn cho một request.</span></div>
  <div class="kv"><span class="k">Security filter chain</span><span class="v">Chuỗi filter có thứ tự (ở đây 12) mọi request đi qua trước controller.</span></div>
  <div class="kv"><span class="k">CSRF token</span><span class="v">Bí mật mà trình duyệt xác thực bằng cookie phải gửi lại khi thay đổi dữ liệu.</span></div>
  <div class="kv"><span class="k">FailureAnalyzer</span><span class="v">Phần giải thích "APPLICATION FAILED TO START" của Spring Boot.</span></div>
  <div class="kv"><span class="k">@Primary / @Qualifier</span><span class="v">Chọn giữa nhiều bean cùng kiểu.</span></div>
  <div class="kv"><span class="k">N+1</span><span class="v">Một câu lấy danh sách + mỗi phần tử một câu.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Breakpoint không bao giờ dừng ⇒ lỗi nằm trước code của bạn: nhìn tầng framework.</li>
<li>Route → controller: breakpoint trong handleInternal, hoặc /actuator/mappings.</li>
<li>401/403: Spring Security TRACE chỉ ra filter đã quyết định.</li>
<li>Lỗi khởi động: đọc hết Description và Action; Spring nêu tên bean và cách sửa.</li>
<li>SQL: org.hibernate.SQL + org.hibernate.orm.jdbc.bind; đếm số câu truy vấn.</li>
</ul>
${NGUON}
</div>
`,
};
