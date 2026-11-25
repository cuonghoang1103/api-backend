/**
 * spring-boot/s15-quan-sat.mjs — Chương 15: Quan sát hệ thống — Actuator, số đo, log, tracing (soạn 24/11/2026, agent sb).
 * Mọi output là chạy thật trên máy nhà: LabFlow (Spring Boot 4.1.2, Micrometer 1.17.2, Micrometer Tracing 1.7.2 + OpenTelemetry 1.62.0, Spring Modulith 2.1.3)
 * + PostgreSQL 16 + Redis 7 + Prometheus 3.16.0 + Grafana 13.2.6 + Jaeger 2.23.0, một hoặc hai instance. Mã: scratchpad/sb/lab/c15/{labflow, obs, t (lệnh đo), lab15 (lời giải + bẫy + bộ chấm)}.
 * Output: ~/.rtq-sb/ch15/o (bản hiển thị ở o/web, lọc bằng lab/c15/web-out.sh). Hằng MA.. / OUT.. sinh bằng tam/s15/build.sh + gen-ma.mjs.
 */
import { java, bash, sql, xml, yml, props, js, out, tl, giai } from './_chung.mjs';

// ===== Bài 15.1 =====
const MA151_PROPS = props("# ---- Chương 15: quan sát hệ thống ----\n# Actuator trên CỔNG RIÊNG (8081): chỉ mạng nội bộ/Prometheus tới được, không đi qua load balancer công khai\nmanagement.server.port=${LABFLOW_MANAGEMENT_PORT:8081}\n# chỉ mở đúng thứ cần — KHÔNG dùng \"*\" (env, heapdump, loggers, threaddump… ở bài 15.1)\nmanagement.endpoints.web.exposure.include=health,info,prometheus\nmanagement.endpoint.health.probes.enabled=true\n# người lạ chỉ thấy UP/DOWN; MANAGER đăng nhập mới thấy từng thành phần\nmanagement.endpoint.health.show-details=when-authorized\nmanagement.endpoint.health.roles=MANAGER\n# readiness = \"nhận request được chưa\": cần CSDL. Liveness KHÔNG chứa CSDL/Redis (CSDL chết ⇒ khởi động lại app cũng vô ích)\nmanagement.endpoint.health.group.readiness.include=readinessState,db\n# histogram cho http.server.requests ⇒ Prometheus tính được p95/p99 gộp nhiều instance");
const MA151_SEC = java("// identity/internal/BaoMat.java — chuỗi filter duy nhất của LabFlow, áp cho CẢ cổng 8080 lẫn cổng quản trị 8081\nSecurityFilterChain chain(HttpSecurity http) throws Exception {\n    http.cors(Customizer.withDefaults())\n        .csrf(c -> c.disable())                         // chỉ Bearer token trong header, không cookie phiên\n        .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))\n        .authorizeHttpRequests(a -> a\n            .requestMatchers(\"/api/v1/auth/**\", \"/error\").permitAll()\n            .requestMatchers(HttpMethod.GET, \"/api/v1/labs\", \"/api/v1/labs/*\").permitAll()\n            .requestMatchers(\"/v3/api-docs/**\", \"/swagger-ui/**\", \"/swagger-ui.html\").permitAll()\n            // Chương 15: actuator — health/info công khai (chỉ UP/DOWN), prometheus cho máy thu số đo, CÒN LẠI chỉ MANAGER\n            .requestMatchers(EndpointRequest.to(\"health\", \"info\", \"prometheus\")).permitAll()\n            .requestMatchers(EndpointRequest.toAnyEndpoint()).hasRole(\"MANAGER\")\n            .requestMatchers(\"/dev/**\").permitAll()          // chỉ tồn tại ở profile dev (ChamDemo)\n            .anyRequest().authenticated())\n        .oauth2ResourceServer(o -> o.jwt(j -> j.jwtAuthenticationConverter(vaiTro())))\n        .addFilterAfter(new NguoiDungMdc(), BearerTokenAuthenticationFilter.class);\n    return http.build();\n}");
const MA151_MO = java("/**\n * CHỈ profile c15-mo (demo bài 15.1): cấu hình SAI hay gặp trên mạng — \"mở actuator cho dễ debug\".\n * Một chuỗi filter ưu tiên cao cho MỌI endpoint actuator, không cần đăng nhập. Đi cùng exposure.include=* là thảm hoạ.\n */\n@Profile(\"c15-mo\")\n@Configuration\nclass DemoActuatorMo {\n    @Bean\n    @Order(0)\n    SecurityFilterChain actuatorMo(HttpSecurity http) throws Exception {\n        http.securityMatcher(EndpointRequest.toAnyEndpoint()).csrf(c -> c.disable())   // \"API thì tắt CSRF\" — chép từ cấu hình chính\n            .authorizeHttpRequests(a -> a.anyRequest().permitAll());\n        return http.build();\n    }\n}");
const MA151_HAM = bash("# ham.sh — hàm nhỏ cho các tệp lệnh Chương 15 (nguồn bởi t/chay.sh). Bí mật chỉ qua biến môi trường.\nJ='Content-Type: application/json'\ndk() { curl -s -o /dev/null -H \"$J\" -d \"{\\\"email\\\":\\\"$1\\\",\\\"fullName\\\":\\\"$2\\\",\\\"password\\\":\\\"$MAT_KHAU_SV\\\"}\" $API/api/v1/auth/register; }\ntok() { curl -s -H \"$J\" -d \"{\\\"email\\\":\\\"$1\\\",\\\"password\\\":\\\"${2:-$MAT_KHAU_SV}\\\"}\" $API/api/v1/auth/login | jq -r .accessToken; }\n# dat <token> <lab> <bắt đầu> <kết thúc>: đặt một lượt, in mã HTTP + id/trạng thái hoặc mã lỗi\ndat() { curl -s -w ' HTTP %{http_code}\\n' -H \"Authorization: Bearer $1\" -H \"$J\" -H \"Idempotency-Key: k-$RANDOM$RANDOM\" -d \"{\\\"labCode\\\":\\\"$2\\\",\\\"startAt\\\":\\\"$3\\\",\\\"endAt\\\":\\\"$4\\\",\\\"purpose\\\":\\\"do an nhom 3\\\"}\" $API/api/v1/bookings | sed -E 's/^(\\{.*\\}) HTTP/\\1 HTTP/' | jq -Rr 'capture(\"^(?<j>.*) HTTP (?<c>[0-9]+)$\") as $m | ($m.j|fromjson) as $o | \"HTTP \\($m.c) \\($o|if .id then \"#\\(.id) \\(.labCode) \\(.status)\" else .code end)\"'; }\n# gon: dòng log ⇒ \"giờ [luồng] nội dung\"\ngon() { sed -E 's/^([0-9:.]+) +[A-Z]+ +\\[ *([^]]+)\\] +[A-Za-z0-9$.]+ +: /\\1 [\\2] /'; }\nso() { curl -s $QL/actuator/prometheus | grep -E \"^$1(\\{| )\"; }");
const OUT151A = out("## 15.1a — Actuator đã cấu hình: cổng API 8080 và cổng quản trị 8081\n## Người lạ chỉ thấy UP/DOWN — tổng thể đang DOWN?\n$ curl -s -w '  HTTP %{http_code}\\n' $QL/actuator/health\n{\"groups\":[\"liveness\",\"readiness\"],\"status\":\"DOWN\"}  HTTP 503\n\n$ curl -s -w '  HTTP %{http_code}\\n' $QL/actuator/health/liveness\n{\"status\":\"UP\"}  HTTP 200\n\n$ curl -s -w '  HTTP %{http_code}\\n' $QL/actuator/health/readiness\n{\"status\":\"UP\"}  HTTP 200\n\n## MANAGER đăng nhập mới thấy từng thành phần\n$ TQ=$(tok manager@fpt.edu.vn $MAT_KHAU_QL)\n\n$ curl -s -H \"Authorization: Bearer $TQ\" $QL/actuator/health | jq -c '.components | map_values(.status)'\n{\"db\":\"UP\",\"diskSpace\":\"UP\",\"livenessState\":\"UP\",\"ping\":\"UP\",\"rabbit\":\"DOWN\",\"readinessState\":\"UP\",\"redis\":\"UP\",\"ssl\":\"UP\"}\n\n$ curl -s -H \"Authorization: Bearer $TQ\" $QL/actuator/health | jq -r '.components.rabbit.details.error'\norg.springframework.amqp.AmqpConnectException: java.net.ConnectException: Connection refused\n\n## Danh sách endpoint (/actuator) cũng chỉ MANAGER xem được\n$ curl -s -o /dev/null -w 'không token: HTTP %{http_code}\\n' $QL/actuator\nkhông token: HTTP 401\n\n$ curl -s -H \"Authorization: Bearer $TQ\" $QL/actuator | jq -c '._links | keys'\n[\"health\",\"health-path\",\"info\",\"prometheus\",\"self\"]\n\n## Sinh viên có token cũng chỉ thấy UP/DOWN\n$ TA=$(tok an@fpt.edu.vn)\n\n$ curl -s -w '\\n' -H \"Authorization: Bearer $TA\" $QL/actuator/health\n{\"groups\":[\"liveness\",\"readiness\"],\"status\":\"DOWN\"}\n\n## Cổng API công khai: actuator không có ở đây\n$ curl -s -o /dev/null -w 'GET 8080/actuator/health      HTTP %{http_code}\\n' $API/actuator/health\nGET 8080/actuator/health      HTTP 401\n\n$ curl -s -o /dev/null -w 'GET 8080/actuator/prometheus  HTTP %{http_code}\\n' $API/actuator/prometheus\nGET 8080/actuator/prometheus  HTTP 401\n\n$ curl -s -o /dev/null -w 'GET 8081/actuator/env         HTTP %{http_code}\\n' $QL/actuator/env\nGET 8081/actuator/env         HTTP 401\n\n$ curl -s -o /dev/null -w 'GET 8081/actuator/heapdump    HTTP %{http_code}\\n' $QL/actuator/heapdump\nGET 8081/actuator/heapdump    HTTP 401\n\n$ curl -s -o /dev/null -w 'GET 8081/actuator/env  (MANAGER) HTTP %{http_code}\\n' -H \"Authorization: Bearer $TQ\" $QL/actuator/env\nGET 8081/actuator/env  (MANAGER) HTTP 404\n\n$ curl -s -o /dev/null -w 'GET 8081/actuator/heapdump (MANAGER) HTTP %{http_code}\\n' -H \"Authorization: Bearer $TQ\" $QL/actuator/heapdump\nGET 8081/actuator/heapdump (MANAGER) HTTP 404\n\n$ curl -s $QL/actuator/info; echo\n{\"app\":{\"name\":\"labflow\",\"version\":\"1.0.0\"}}");
const OUT151B = out("## 15.1b — Ba câu hỏi khác nhau: còn sống? nhận request được chưa? mọi thứ ổn không?\n$ hoi() { for p in health health/liveness health/readiness; do curl -s -o /dev/null -m 15 -w \"%-18s HTTP %{http_code} · %{time_total}s\\n\" $QL/actuator/$p 2>/dev/null | sed \"s#^#/actuator/$p #\" | awk '{printf \"%-28s %s %s %s %s\\n\",$1,$3,$4,$5,$6}'; done; }\n\n## Lúc thường (RabbitMQ chưa chạy — module thông báo của lab 14 dùng nó)\n$ hoi\n/actuator/health             HTTP 503 · 0.639705s\n/actuator/health/liveness    HTTP 200 · 0.017520s\n/actuator/health/readiness   HTTP 200 · 0.008991s\n\n## Redis (cache) dừng\n$ docker stop -t 1 redis >/dev/null\n\n$ hoi\n/actuator/health             HTTP 503 · 0.626301s\n/actuator/health/liveness    HTTP 200 · 0.007830s\n/actuator/health/readiness   HTTP 200 · 0.013684s\n\n$ docker start redis >/dev/null\n\n## PostgreSQL đứng hình (docker pause: tiến trình còn đó nhưng không trả lời — giống mạng treo)\n$ docker pause postgres >/dev/null\n\n$ hoi\n/actuator/health             HTTP 000 · 15.002416s\n/actuator/health/liveness    HTTP 200 · 0.015333s\n/actuator/health/readiness   HTTP 000 · 15.002683s\n\n$ curl -s -o /dev/null -m 40 -w 'GET /api/v1/labs           HTTP %{http_code} · %{time_total}s\\n' $API/api/v1/labs\nGET /api/v1/labs           HTTP 500 · 30.190747s\n\n$ docker unpause postgres >/dev/null\n\n## PostgreSQL chạy lại\n$ hoi\n/actuator/health             HTTP 503 · 0.031029s\n/actuator/health/liveness    HTTP 200 · 0.011210s\n/actuator/health/readiness   HTTP 200 · 0.013107s");
const OUT151C = out("## 15.1c — Cấu hình SAI hay gặp: actuator chung cổng 8080, include=*, mở heapdump, permitAll cho /actuator/**\n## Người lạ, không token, từ Internet:\n$ curl -s $API/actuator | jq -r '._links | keys | length as $n | \"\\($n) đường: \\(join(\" \"))\"' | fold -s -w 110\n25 đường: beans caches caches-cache conditions configprops configprops-prefix env env-toMatch flyway \nhealth health-path heapdump info loggers loggers-name mappings metrics metrics-requiredMetricName modulith \nprometheus sbom sbom-id scheduledtasks self threaddump\n\n## env che giá trị (mặc định show-values=never)…\n$ curl -s $API/actuator/env | jq -c '.propertySources[] | select(.name==\"systemEnvironment\") | .properties | {LABFLOW_JWT_SECRET, LABFLOW_DB_PASSWORD} | map_values(.value)'\n{\"LABFLOW_JWT_SECRET\":\"******\",\"LABFLOW_DB_PASSWORD\":\"******\"}\n\n## …nhưng heapdump là TOÀN BỘ bộ nhớ của JVM\n$ curl -s -o /tmp/heap.hprof -w 'HTTP %{http_code} · %{size_download} byte · %{time_total}s\\n' $API/actuator/heapdump\nHTTP 200 · 168731805 byte · 1.391832s\n\n$ strings -n 20 /tmp/heap.hprof | grep -c \"$MAT_KHAU_JWT\" | sed 's/^/khoá ký JWT (LABFLOW_JWT_SECRET) xuất hiện: /;s/$/ lần/'\nkhoá ký JWT (LABFLOW_JWT_SECRET) xuất hiện: 5 lần\n\n$ strings -n 8 /tmp/heap.hprof | grep -c \"$MAT_KHAU_DB\" | sed 's/^/mật khẩu PostgreSQL xuất hiện: /;s/$/ lần/'\nmật khẩu PostgreSQL xuất hiện: 3 lần\n\n$ strings -n 8 /tmp/heap.hprof | grep -c \"$MAT_KHAU_SV\" | sed 's/^/mật khẩu sinh viên An gửi lúc đăng nhập: /;s/$/ lần/'\nmật khẩu sinh viên An gửi lúc đăng nhập: 1 lần\n\n$ strings -n 20 /tmp/heap.hprof | grep -o 'eyJhbGciOiJIUzI1NiJ9\\.[A-Za-z0-9_-]*' | sort -u | wc -l | sed 's/^/JWT còn nằm trong bộ nhớ: /'\nJWT còn nằm trong bộ nhớ: 1\n\n## loggers: ai cũng đổi được mức log\n$ curl -s -o /dev/null -w 'POST loggers/ROOT DEBUG ⇒ HTTP %{http_code}\\n' -H \"$J\" -d '{\"configuredLevel\":\"DEBUG\"}' $API/actuator/loggers/ROOT\nPOST loggers/ROOT DEBUG ⇒ HTTP 204\n\n$ echo \"5 request GET /api/v1/labs sinh $(cat /tmp/n) dòng log\"\n5 request GET /api/v1/labs sinh 370 dòng log\n\n## Có thứ vẫn đóng dù include=*: shutdown mặc định access=none\n$ curl -s -o /dev/null -w 'POST /actuator/shutdown ⇒ HTTP %{http_code}\\n' -X POST $API/actuator/shutdown\nPOST /actuator/shutdown ⇒ HTTP 401");

const L151_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.1 · Observability</span>
<h2>Spring Boot Actuator, safely</h2>
<p class="lead">Your LabFlow API is running on a server. A student says "booking is broken". Is the process alive? Can it reach PostgreSQL? Is it slow, or failing? Without a way to <em>look inside</em> a running application you can only guess. Spring Boot Actuator gives you that window: health checks, metrics, configuration, even a full memory dump. In this lesson we open the window the right way — and then open it the wrong way, and download 168 MB of memory containing the JWT signing key, the database password and a student's password, without logging in.</p>

<h3>Everyday picture first</h3>
<p>A hospital patient has a monitor by the bed: heart rate, blood pressure, oxygen. Nurses glance at it from the corridor — they do not need to open the patient up. That monitor is Actuator. But the same hospital has a records room with the patient's full file, address and ID card. The monitor belongs in the corridor; the records room must be locked. The mistake in this lesson is putting the records room in the corridor "so it's easier to debug".</p>

<h3>1. Three questions, three endpoints</h3>
<p>Spring Boot Actuator (already in LabFlow's <code>pom.xml</code> since Chapter 17) adds endpoints under <code>/actuator</code>. Three of them answer different questions — mixing them up is the most common mistake:</p>
<ul>
  <li><strong><code>/actuator/health/liveness</code></strong> — "is the process stuck?" If this fails, restarting the process helps. It must <em>not</em> depend on the database: when PostgreSQL is down, restarting the app does not bring PostgreSQL back.</li>
  <li><strong><code>/actuator/health/readiness</code></strong> — "can I send it requests right now?" If this fails, the load balancer stops sending traffic but leaves the process alone. It <em>should</em> depend on what every request needs (here: the database).</li>
  <li><strong><code>/actuator/health</code></strong> — "is everything OK?" — every health indicator together: database, Redis, RabbitMQ, disk, SSL certificates. Good for a human on a dashboard, dangerous for an automatic restart.</li>
</ul>
<p>The Chapter 15 block of LabFlow's <code>application.properties</code>:</p>
${MA151_PROPS}
<p>Actuator now lives on a <strong>separate management port</strong> (8081). In production only the internal network (Prometheus, the load balancer's health checker) can reach it; the public load balancer forwards only port 8080. Only <code>health</code>, <code>info</code> and <code>prometheus</code> are exposed. Spring Security protects both ports with the same chain:</p>
${MA151_SEC}
<p><code>EndpointRequest</code> matches actuator endpoints by <em>id</em>, whatever the base path or port. To keep the demo commands short, a few helpers (the full script is in the lab folder):</p>
${MA151_HAM}

<h3>2. What a stranger, a student and a manager see</h3>
${OUT151A}
<ul>
  <li>The total health is <strong>DOWN (503)</strong> while liveness and readiness are <strong>UP</strong>. The manager's view says why: <code>rabbit</code> is DOWN. LabFlow carries the RabbitMQ starter from Lab 14, and no broker is running on this machine. That one indicator drags the whole <code>/actuator/health</code> down.</li>
  <li>A stranger and a logged-in student see only <code>UP</code>/<code>DOWN</code>. Component details (database version, Redis host, error messages) are for <code>MANAGER</code> only — <code>show-details=when-authorized</code> + <code>roles=MANAGER</code>.</li>
  <li>On port 8080, <code>/actuator/…</code> answers <strong>401</strong>, not 404: the request never reaches a handler, Spring Security stops it first. On 8081, <code>env</code> and <code>heapdump</code> are 401 for strangers and <strong>404 even for the manager</strong> — they are not exposed at all. Not exposed beats protected: there is nothing to misconfigure later.</li>
  <li><code>/actuator/info</code> was empty at first. Since Boot 2.6 the <code>info.*</code> properties are ignored until <code>management.info.env.enabled=true</code> — a small trap that wastes an afternoon.</li>
</ul>

<h3>3. When a dependency dies: which probe should fail?</h3>
<p>We stop Redis, then freeze PostgreSQL with <code>docker pause</code> (the process exists but never answers — exactly what a broken network looks like) and ask the three endpoints each time:</p>
${OUT151B}
<ul>
  <li><strong>Redis stopped</strong>: readiness stays 200. Correct — Redis is only a cache (Chapter 13); LabFlow still answers from PostgreSQL, a bit slower. If readiness included Redis, a cache outage would take <em>every</em> instance out of the load balancer: a small problem turned into a full outage.</li>
  <li><strong>PostgreSQL frozen</strong>: liveness answers in 15 ms, readiness does not answer within 15 s (curl gives up: <code>000</code>), and a real API call returns 500 after 30.19 s. Liveness staying UP is right: restarting LabFlow would not unfreeze the database. Readiness hanging is a lesson for Chapter 16: the health check waits for a connection from the pool, and HikariCP's default <code>connection-timeout</code> is 30 s. The orchestrator's probe has its own timeout (typically 1–3 s), so it marks the pod not ready — but each probe holds a management thread for up to 30 s.</li>
  <li>If liveness pointed at <code>/actuator/health</code> (a very common copy-paste), the missing RabbitMQ alone would make the orchestrator restart LabFlow forever, and a database blip would restart every pod at once — a "restart storm".</li>
</ul>
<p>How the probes are wired in Kubernetes (configuration sample — the course machine does not run a cluster; Docker Compose in Chapter 17 used the same endpoint in its <code>healthcheck</code>):</p>
${yml(`livenessProbe:            # bị treo ⇒ khởi động lại container
  httpGet: { path: /actuator/health/liveness, port: 8081 }
  periodSeconds: 10
  failureThreshold: 3
readinessProbe:           # chưa sẵn sàng ⇒ ngừng gửi request, KHÔNG khởi động lại
  httpGet: { path: /actuator/health/readiness, port: 8081 }
  periodSeconds: 5
  timeoutSeconds: 2
startupProbe:             # cho JVM thời gian khởi động trước khi liveness bắt đầu đếm
  httpGet: { path: /actuator/health/liveness, port: 8081 }
  failureThreshold: 30
  periodSeconds: 2`)}

<h3>4. The wrong way: "open actuator, it's easier to debug"</h3>
<p>Search for a Spring Boot actuator tutorial and you will find this combination: management on the same port 8080, <code>management.endpoints.web.exposure.include=*</code>, and a security rule that permits <code>/actuator/**</code>. Here is that rule, written as a separate chain so the real LabFlow chain stays untouched (profile <code>c15-mo</code>, demo only):</p>
${MA151_MO}
<p>Run with that profile plus <code>--management.server.port=8080 --management.endpoints.web.exposure.include=* --management.endpoint.heapdump.access=unrestricted</code>, then attack it from outside, without a token:</p>
${OUT151C}
<ul>
  <li><strong>25 links</strong> appear: beans, configuration, every URL mapping, Flyway history, scheduled jobs, the SBOM (every library and version — a ready-made list for searching known CVEs).</li>
  <li><code>/actuator/env</code> shows <code>******</code> for the JWT secret and DB password. Since Boot 3, <code>show-values</code> defaults to <code>never</code>. That is where most people stop checking.</li>
  <li><code>/actuator/heapdump</code> returns <strong>168,731,805 bytes in 1.4 s</strong> — a copy of the whole JVM heap. A plain <code>strings | grep</code> finds the JWT signing key 5 times, the PostgreSQL password 3 times, and <strong>the password student An typed when logging in</strong> (the request body was still in memory), plus a live JWT. With the signing key, anyone can mint a token with <code>"roles":["MANAGER"]</code> (Chapter 9) — no password needed.</li>
  <li><code>POST /actuator/loggers/ROOT</code> works for anyone: after switching the root logger to DEBUG, five <code>GET /api/v1/labs</code> produce 370 log lines. An attacker can fill your disk and log bill, or switch security logging off before attacking.</li>
  <li>Some things stay closed even with <code>*</code>: <code>shutdown</code> has <code>access=none</code> by default, so it is not an endpoint at all and the request falls through to the normal chain (401). Boot 4 also keeps <code>heapdump</code> at <code>access=none</code> until you open it explicitly — the tutorial line <code>heapdump.access=unrestricted</code> is what made this possible.</li>
</ul>
<p>Note the detail that made <code>loggers</code> writable: the demo chain disables CSRF "because it is an API". With CSRF on, that same POST got <strong>403</strong> in our first run. Copying <code>csrf.disable()</code> from the API chain into an actuator chain removes the last accidental protection.</p>

<h3>5. A safe checklist for every Spring Boot service</h3>
<ol>
  <li>Expose only what you use: <code>health,info,prometheus</code>. Never <code>*</code> in a shared <code>application.properties</code>.</li>
  <li>Put actuator on a management port that the public load balancer does not route; firewall it to the internal network.</li>
  <li>Keep <code>heapdump</code>, <code>threaddump</code>, <code>env</code>, <code>loggers</code>, <code>configprops</code> unexposed in production. When you need a heap dump, take it on the machine (<code>jcmd &lt;pid&gt; GC.heap_dump</code>) and treat the file as a secret.</li>
  <li>Health details only for an operator role; liveness without external dependencies; readiness with what every request needs, and nothing optional.</li>
  <li>Test it like an attacker: <code>curl</code> every actuator path on the public port from outside — expect 401/404, never 200.</li>
</ol>

<h3>🕵️ Hacker corner — Volkswagen/Cariad, December 2024: an open heapdump, 800,000 cars</h3>
<p>At the 38th Chaos Communication Congress (December 2024), researchers from the Chaos Computer Club presented how they found the movement data of about <strong>800,000 electric cars</strong> (VW, Seat, Audi, Skoda) together with owners' contact details. The entry point reported by the researchers and the press was an exposed Spring Boot Actuator <code>heapdump</code> on a Cariad (VW's software company) server: inside the memory dump were credentials for the cloud storage holding the data. Nobody "hacked" a password — the service handed over its own memory, exactly as LabFlow did in section 4.</p>
<p><strong>How to prevent it</strong>: the checklist above; scan your own public endpoints for <code>/actuator</code> in CI or with a simple uptime check; rotate every secret that was ever in a heap dump you cannot account for; give the application only short-lived, minimum-scope cloud credentials so that a leaked key opens as little as possible.</p>

<h3>Compared with Node.js</h3>
<p>Express has no built-in Actuator. Node teams write <code>/healthz</code> and <code>/readyz</code> by hand (or use <code>@godaddy/terminus</code>, <code>lightship</code>), expose metrics with <code>prom-client</code> on a separate port, and take heap snapshots with <code>node --inspect</code> or <code>v8.writeHeapSnapshot()</code>. The trade-off: Spring gives you a lot for one dependency — which is also a lot to expose by accident. Same rules in both worlds: liveness without the DB, readiness with it, debug endpoints never public.</p>

<h3>At work</h3>
<ul>
  <li>The first ticket on a new team is often "pods restart every few minutes". Check which path the liveness probe calls before reading any Java code.</li>
  <li>Security reviews and pentests look for <code>/actuator</code> first — it is one of the most common findings on Spring applications.</li>
  <li>In SWP391, give the LabFlow team one rule in the README: actuator on 8081, three endpoints, and a curl test in CI that fails if <code>/actuator/env</code> answers 200 on 8080.</li>
</ul>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"Liveness vs readiness?"</strong> — Liveness: is the process stuck — failing ⇒ restart. Readiness: can it serve now — failing ⇒ stop routing traffic, keep the process. Liveness must not include the DB, otherwise a DB outage becomes a restart storm.</li>
  <li><strong>"Which actuator endpoints do you expose in production?"</strong> — health, info, prometheus, on a management port reachable only internally; details for an operator role. Never heapdump/env/loggers publicly; I'd mention a real leak (VW/Cariad 2024) to show why.</li>
  <li><strong>"/actuator/env masks secrets, so is it safe?"</strong> — No: heapdump contains the real values, and env still reveals names, hosts and structure. Masking is a last line, not access control.</li>
  <li><strong>"Health is DOWN because the cache is down — what do you change?"</strong> — Readiness group with only required dependencies (<code>management.endpoint.health.group.readiness.include</code>); keep the cache indicator for dashboards/alerts, not probes.</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<ol>
  <li>With PostgreSQL frozen, readiness took more than 15 s. Which property makes it fail within 2 s, and what else changes for normal API requests when you set it?</li>
  <li>Your teammate adds <code>management.endpoints.web.exposure.include=*</code> "only in application-dev.properties". The CI pipeline builds one image and starts it with <code>SPRING_PROFILES_ACTIVE=dev</code> on the staging server reachable from the Internet. What leaks, and what would you change?</li>
  <li>Write the curl commands a CI job should run against the public port so that the build fails on any exposed actuator endpoint.</li>
</ol>
${giai('Show the answers', `<p>1. <code>spring.datasource.hikari.connection-timeout=2000</code> (milliseconds). Every request now waits at most 2 s for a connection: when the pool or the DB is in trouble, users get a fast 500/503 instead of hanging for 30 s — usually what you want. Chapter 16 measures it.</p><p>2. Everything in section 4 — the profile is about how the app is <em>started</em>, not where it runs. Keep debug exposure out of shared profiles; give staging its own profile with the production rules, and block the management port at the network level.</p><p>3. For example: <code>for p in env heapdump loggers configprops threaddump beans mappings; do c=$(curl -s -o /dev/null -w '%{http_code}' https://staging.example/actuator/$p); [ "$c" = 200 ] &amp;&amp; { echo "LỘ /actuator/$p"; exit 1; }; done</code>.</p>`)}

<h3>🗂 Key terms</h3>
<ul>
  <li><strong>Actuator</strong> — Spring Boot module that adds operational endpoints (health, metrics, info, env, heapdump…).</li>
  <li><strong>Exposure</strong> — which endpoints are reachable over HTTP (<code>management.endpoints.web.exposure.include</code>).</li>
  <li><strong>Access</strong> — Boot 4 setting per endpoint (<code>none</code>, <code>read-only</code>, <code>unrestricted</code>); <code>heapdump</code> and <code>shutdown</code> start at <code>none</code>.</li>
  <li><strong>Management port</strong> — a separate HTTP port for actuator (<code>management.server.port</code>).</li>
  <li><strong>Liveness / readiness probe</strong> — orchestrator checks: restart when stuck / stop routing when not ready.</li>
  <li><strong>Health group</strong> — a named subset of health indicators (<code>management.endpoint.health.group.*</code>).</li>
  <li><strong>Heap dump</strong> — a file with every object in the JVM heap, including secrets and user data.</li>
</ul>

<h3>📌 Summary</h3>
<ul>
  <li>Liveness without the database, readiness with it, total health for humans — measured: Redis down keeps LabFlow ready, frozen PostgreSQL makes it not ready while it stays alive.</li>
  <li>Three exposed endpoints on an internal port; details for MANAGER only.</li>
  <li>The tutorial setup leaked a 168 MB heap with the JWT key, DB password and a user's password to an anonymous curl — the same class of mistake as VW/Cariad in 2024.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.spring.io/spring-boot/reference/actuator/endpoints.html', '🍃', 'Spring Boot — Actuator endpoints', 'exposure, access, health groups, Kubernetes probes, security')}
${tl('https://media.ccc.de/v/38c3-wir-wissen-wo-dein-auto-steht-volksdaten-von-volkswagen', '🚗', '38C3 — Wir wissen wo dein Auto steht', 'the CCC talk on the VW/Cariad data leak (German, with translation)')}

<h3>Sources</h3>
<ul>
  <li>Chaos Computer Club, 38C3 (12/2024) — <a href="https://media.ccc.de/v/38c3-wir-wissen-wo-dein-auto-steht-volksdaten-von-volkswagen" target="_blank" rel="noopener">Wir wissen wo dein Auto steht – Volksdaten von Volkswagen</a> (movement data of 800,000 EVs).</li>
  <li>All outputs: LabFlow (Spring Boot 4.1.2, Java 21) + PostgreSQL 16 + Redis 7 on the course machine, 24/11/2026.</li>
</ul>
</div>
`;

const L151_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.1 · Quan sát hệ thống</span>
<h2>Spring Boot Actuator, an toàn</h2>
<p class="lead">API LabFlow đang chạy trên máy chủ. Một sinh viên nhắn "không đặt phòng được". Tiến trình còn sống không? Có kết nối được PostgreSQL không? Chậm hay lỗi? Không có cách <em>nhìn vào bên trong</em> một ứng dụng đang chạy thì bạn chỉ đoán. Spring Boot Actuator mở ra cái cửa sổ đó: kiểm tra sức khoẻ, số đo, cấu hình, thậm chí toàn bộ bộ nhớ. Bài này mở cửa sổ đúng cách — rồi mở sai cách, và tải về 168 MB bộ nhớ chứa khoá ký JWT, mật khẩu CSDL và mật khẩu của một sinh viên, không cần đăng nhập.</p>

<h3>Đời thường trước đã</h3>
<p>Bệnh nhân nằm viện có màn hình theo dõi cạnh giường: nhịp tim, huyết áp, oxy. Y tá liếc từ hành lang là biết — không cần mở bệnh nhân ra xem. Màn hình đó là Actuator. Nhưng bệnh viện còn có phòng hồ sơ: bệnh án đầy đủ, địa chỉ, căn cước. Màn hình đặt ở hành lang; phòng hồ sơ phải khoá. Lỗi trong bài này là đem phòng hồ sơ ra hành lang "cho dễ gỡ lỗi".</p>

<h3>1. Ba câu hỏi, ba endpoint</h3>
<p>Spring Boot Actuator (LabFlow đã có trong <code>pom.xml</code> từ Chương 17) thêm các endpoint dưới <code>/actuator</code>. Ba endpoint trả lời ba câu hỏi khác nhau — nhầm chúng là lỗi hay gặp nhất:</p>
<ul>
  <li><strong><code>/actuator/health/liveness</code></strong> — "tiến trình có bị treo không?" Hỏng thì khởi động lại tiến trình là có ích. Nó <em>không</em> được phụ thuộc CSDL: PostgreSQL chết thì khởi động lại ứng dụng cũng không làm PostgreSQL sống lại.</li>
  <li><strong><code>/actuator/health/readiness</code></strong> — "gửi request vào lúc này được chưa?" Hỏng thì bộ cân bằng tải ngừng gửi request nhưng để yên tiến trình. Nó <em>nên</em> phụ thuộc thứ mọi request đều cần (ở đây: CSDL).</li>
  <li><strong><code>/actuator/health</code></strong> — "mọi thứ ổn cả chứ?" — gộp mọi chỉ báo: CSDL, Redis, RabbitMQ, ổ đĩa, chứng chỉ SSL. Hợp cho người nhìn bảng điều khiển, nguy hiểm khi dùng để tự động khởi động lại.</li>
</ul>
<p>Khối Chương 15 trong <code>application.properties</code> của LabFlow:</p>
${MA151_PROPS}
<p>Actuator giờ nằm trên <strong>cổng quản trị riêng</strong> (8081). Ở production chỉ mạng nội bộ (Prometheus, bộ kiểm sức khoẻ của load balancer) tới được; load balancer công khai chỉ chuyển cổng 8080. Chỉ mở <code>health</code>, <code>info</code> và <code>prometheus</code>. Spring Security bảo vệ cả hai cổng bằng cùng một chuỗi filter:</p>
${MA151_SEC}
<p><code>EndpointRequest</code> khớp endpoint actuator theo <em>id</em>, dù đường gốc hay cổng là gì. Cho lệnh demo ngắn gọn, vài hàm nhỏ (tệp đầy đủ trong thư mục lab):</p>
${MA151_HAM}

<h3>2. Người lạ, sinh viên và quản lý thấy gì</h3>
${OUT151A}
<ul>
  <li>Sức khoẻ tổng là <strong>DOWN (503)</strong> trong khi liveness và readiness đều <strong>UP</strong>. Góc nhìn của quản lý cho biết vì sao: <code>rabbit</code> DOWN. LabFlow mang starter RabbitMQ từ Lab 14, mà máy này không chạy broker nào. Một chỉ báo đó kéo cả <code>/actuator/health</code> xuống.</li>
  <li>Người lạ và sinh viên đã đăng nhập chỉ thấy <code>UP</code>/<code>DOWN</code>. Chi tiết thành phần (phiên bản CSDL, host Redis, thông báo lỗi) chỉ dành cho <code>MANAGER</code> — <code>show-details=when-authorized</code> + <code>roles=MANAGER</code>.</li>
  <li>Trên cổng 8080, <code>/actuator/…</code> trả <strong>401</strong>, không phải 404: request chưa tới handler nào, Spring Security đã chặn trước. Trên 8081, <code>env</code> và <code>heapdump</code> trả 401 cho người lạ và <strong>404 ngay cả với quản lý</strong> — chúng hoàn toàn không được mở. Không mở tốt hơn có bảo vệ: sau này không còn gì để cấu hình sai.</li>
  <li><code>/actuator/info</code> lúc đầu rỗng. Từ Boot 2.6, các thuộc tính <code>info.*</code> bị bỏ qua cho tới khi bật <code>management.info.env.enabled=true</code> — bẫy nhỏ làm mất một buổi chiều.</li>
</ul>

<h3>3. Khi một phụ thuộc chết: probe nào nên hỏng?</h3>
<p>Ta dừng Redis, rồi làm PostgreSQL đứng hình bằng <code>docker pause</code> (tiến trình còn đó nhưng không bao giờ trả lời — y như mạng treo), mỗi lần hỏi cả ba endpoint:</p>
${OUT151B}
<ul>
  <li><strong>Redis dừng</strong>: readiness vẫn 200. Đúng — Redis chỉ là cache (Chương 13); LabFlow vẫn trả lời từ PostgreSQL, chậm hơn một chút. Nếu readiness chứa Redis, cache sập sẽ kéo <em>mọi</em> instance ra khỏi load balancer: sự cố nhỏ thành sập toàn bộ.</li>
  <li><strong>PostgreSQL đứng hình</strong>: liveness trả lời trong 15 ms, readiness không trả lời trong 15 giây (curl bỏ cuộc: <code>000</code>), một request API thật trả 500 sau 30,19 giây. Liveness vẫn UP là đúng: khởi động lại LabFlow không làm CSDL hết đứng. Readiness treo là bài học cho Chương 16: health check chờ một kết nối từ pool, mà <code>connection-timeout</code> mặc định của HikariCP là 30 giây. Probe của bộ điều phối có timeout riêng (thường 1–3 giây) nên vẫn đánh dấu "chưa sẵn sàng" — nhưng mỗi lần probe giữ một luồng quản trị tới 30 giây.</li>
  <li>Nếu liveness trỏ vào <code>/actuator/health</code> (kiểu chép dán rất phổ biến), chỉ riêng việc thiếu RabbitMQ đã khiến bộ điều phối khởi động lại LabFlow mãi mãi, còn CSDL chập chờn một lần là mọi pod cùng khởi động lại — "bão khởi động lại".</li>
</ul>
<p>Cách nối probe trong Kubernetes (cấu hình mẫu — máy dựng bài không chạy cụm; Docker Compose ở Chương 17 dùng chính endpoint này cho <code>healthcheck</code>):</p>
${yml(`livenessProbe:            # bị treo ⇒ khởi động lại container
  httpGet: { path: /actuator/health/liveness, port: 8081 }
  periodSeconds: 10
  failureThreshold: 3
readinessProbe:           # chưa sẵn sàng ⇒ ngừng gửi request, KHÔNG khởi động lại
  httpGet: { path: /actuator/health/readiness, port: 8081 }
  periodSeconds: 5
  timeoutSeconds: 2
startupProbe:             # cho JVM thời gian khởi động trước khi liveness bắt đầu đếm
  httpGet: { path: /actuator/health/liveness, port: 8081 }
  failureThreshold: 30
  periodSeconds: 2`)}

<h3>4. Cách sai: "mở actuator ra cho dễ gỡ lỗi"</h3>
<p>Tìm hướng dẫn actuator trên mạng, bạn sẽ gặp bộ ba này: actuator chung cổng 8080, <code>management.endpoints.web.exposure.include=*</code>, và một luật bảo mật cho phép <code>/actuator/**</code>. Đây là luật đó, viết thành một chuỗi riêng để chuỗi thật của LabFlow không bị đụng (profile <code>c15-mo</code>, chỉ để demo):</p>
${MA151_MO}
<p>Chạy với profile đó cùng <code>--management.server.port=8080 --management.endpoints.web.exposure.include=* --management.endpoint.heapdump.access=unrestricted</code>, rồi tấn công từ ngoài vào, không token:</p>
${OUT151C}
<ul>
  <li>Hiện ra <strong>25 đường</strong>: các bean, cấu hình, mọi URL, lịch sử Flyway, job hẹn giờ, SBOM (mọi thư viện kèm phiên bản — danh sách có sẵn để tra CVE đã biết).</li>
  <li><code>/actuator/env</code> hiện <code>******</code> cho khoá JWT và mật khẩu CSDL. Từ Boot 3, <code>show-values</code> mặc định là <code>never</code>. Phần lớn mọi người kiểm tới đây là dừng.</li>
  <li><code>/actuator/heapdump</code> trả <strong>168.731.805 byte trong 1,4 giây</strong> — bản sao toàn bộ heap của JVM. Một lệnh <code>strings | grep</code> tìm thấy khoá ký JWT 5 lần, mật khẩu PostgreSQL 3 lần, và <strong>mật khẩu sinh viên An gõ lúc đăng nhập</strong> (thân request còn nằm trong bộ nhớ), cùng một JWT còn hạn. Có khoá ký, ai cũng tự tạo được token mang <code>"roles":["MANAGER"]</code> (Chương 9) — không cần mật khẩu.</li>
  <li><code>POST /actuator/loggers/ROOT</code> ai gọi cũng được: chuyển logger gốc sang DEBUG xong, năm lần <code>GET /api/v1/labs</code> sinh 370 dòng log. Kẻ tấn công có thể làm đầy ổ đĩa, đội hoá đơn log, hoặc tắt log bảo mật trước khi tấn công.</li>
  <li>Vài thứ vẫn đóng dù có <code>*</code>: <code>shutdown</code> mặc định <code>access=none</code> nên không thành endpoint, request rơi về chuỗi thường (401). Boot 4 cũng giữ <code>heapdump</code> ở <code>access=none</code> cho tới khi bạn mở rõ ràng — dòng <code>heapdump.access=unrestricted</code> trong hướng dẫn mới là thứ cho phép chuyện trên.</li>
</ul>
<p>Để ý chi tiết làm <code>loggers</code> ghi được: chuỗi demo tắt CSRF "vì là API". Khi CSRF còn bật, cùng lệnh POST đó bị <strong>403</strong> ở lần chạy đầu. Chép <code>csrf.disable()</code> từ chuỗi API sang chuỗi actuator là gỡ nốt lớp bảo vệ vô tình cuối cùng.</p>

<h3>5. Danh sách kiểm an toàn cho mọi dịch vụ Spring Boot</h3>
<ol>
  <li>Chỉ mở thứ đang dùng: <code>health,info,prometheus</code>. Không bao giờ <code>*</code> trong <code>application.properties</code> dùng chung.</li>
  <li>Đặt actuator trên cổng quản trị mà load balancer công khai không chuyển tới; tường lửa chỉ cho mạng nội bộ.</li>
  <li>Ở production không mở <code>heapdump</code>, <code>threaddump</code>, <code>env</code>, <code>loggers</code>, <code>configprops</code>. Cần heap dump thì lấy ngay trên máy (<code>jcmd &lt;pid&gt; GC.heap_dump</code>) và coi tệp đó là bí mật.</li>
  <li>Chi tiết sức khoẻ chỉ cho vai trò vận hành; liveness không phụ thuộc bên ngoài; readiness gồm thứ mọi request đều cần, không gì tuỳ chọn.</li>
  <li>Kiểm như kẻ tấn công: <code>curl</code> mọi đường actuator trên cổng công khai từ bên ngoài — chỉ được 401/404, không bao giờ 200.</li>
</ol>

<h3>🕵️ Góc hacker — Volkswagen/Cariad, tháng 12/2024: heapdump để ngỏ, 800.000 chiếc xe</h3>
<p>Tại hội nghị Chaos Communication Congress lần thứ 38 (tháng 12/2024), nhóm nghiên cứu của Chaos Computer Club trình bày cách họ tìm thấy dữ liệu di chuyển của khoảng <strong>800.000 xe điện</strong> (VW, Seat, Audi, Skoda) kèm thông tin liên hệ của chủ xe. Điểm vào mà nhóm nghiên cứu và báo chí mô tả là một endpoint <code>heapdump</code> của Spring Boot Actuator để ngỏ trên máy chủ của Cariad (công ty phần mềm của VW): trong bản dump bộ nhớ có thông tin đăng nhập vào kho lưu trữ đám mây chứa dữ liệu. Không ai "bẻ" mật khẩu nào — dịch vụ tự trao bộ nhớ của nó, đúng như LabFlow ở mục 4.</p>
<p><strong>Cách phòng</strong>: danh sách kiểm ở trên; quét chính các địa chỉ công khai của bạn tìm <code>/actuator</code> trong CI hoặc bằng một bộ kiểm uptime đơn giản; đổi mọi bí mật từng nằm trong một heap dump mà bạn không kiểm soát được; chỉ cấp cho ứng dụng thông tin đăng nhập đám mây ngắn hạn, quyền tối thiểu, để khoá có lộ thì mở được càng ít càng tốt.</p>

<h3>So với Node.js</h3>
<p>Express không có Actuator dựng sẵn. Đội Node tự viết <code>/healthz</code>, <code>/readyz</code> (hoặc dùng <code>@godaddy/terminus</code>, <code>lightship</code>), mở số đo bằng <code>prom-client</code> trên cổng riêng, chụp heap bằng <code>node --inspect</code> hay <code>v8.writeHeapSnapshot()</code>. Đánh đổi: Spring cho rất nhiều chỉ với một phụ thuộc — cũng là rất nhiều thứ để lỡ mở ra. Luật thì như nhau ở cả hai bên: liveness không có CSDL, readiness có CSDL, endpoint gỡ lỗi không bao giờ công khai.</p>

<h3>Ở chỗ làm</h3>
<ul>
  <li>Phiếu việc đầu tiên ở đội mới hay là "pod khởi động lại vài phút một lần". Xem probe liveness gọi đường nào trước khi đọc dòng Java nào.</li>
  <li>Kiểm tra bảo mật và pentest tìm <code>/actuator</code> đầu tiên — đây là một trong những lỗi hay gặp nhất ở ứng dụng Spring.</li>
  <li>Ở SWP391, ghi cho nhóm LabFlow một luật trong README: actuator ở 8081, ba endpoint, và một lệnh curl trong CI làm build đỏ nếu <code>/actuator/env</code> trả 200 trên cổng 8080.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Liveness khác readiness thế nào?"</strong> — Liveness: tiến trình có treo không — hỏng ⇒ khởi động lại. Readiness: phục vụ được chưa — hỏng ⇒ ngừng chuyển request, giữ tiến trình. Liveness không được chứa CSDL, nếu không CSDL sập sẽ thành bão khởi động lại.</li>
  <li><strong>"Bạn mở những endpoint actuator nào ở production?"</strong> — health, info, prometheus, trên cổng quản trị chỉ nội bộ tới được; chi tiết cho vai trò vận hành. Không bao giờ để heapdump/env/loggers công khai; nhắc một vụ lộ thật (VW/Cariad 2024) để chứng minh vì sao.</li>
  <li><strong>"/actuator/env đã che bí mật, vậy là an toàn?"</strong> — Không: heapdump chứa giá trị thật, còn env vẫn lộ tên biến, host, cấu trúc. Che giá trị là lớp cuối, không phải kiểm soát truy cập.</li>
  <li><strong>"Health DOWN vì cache sập — bạn đổi gì?"</strong> — Nhóm readiness chỉ chứa phụ thuộc bắt buộc (<code>management.endpoint.health.group.readiness.include</code>); giữ chỉ báo cache cho bảng điều khiển/cảnh báo, không cho probe.</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<ol>
  <li>Khi PostgreSQL đứng hình, readiness mất hơn 15 giây. Thuộc tính nào làm nó hỏng trong 2 giây, và đặt nó thì request API bình thường thay đổi gì?</li>
  <li>Bạn cùng nhóm thêm <code>management.endpoints.web.exposure.include=*</code> "chỉ trong application-dev.properties". Pipeline CI build một image rồi chạy nó với <code>SPRING_PROFILES_ACTIVE=dev</code> trên máy staging mà Internet vào được. Cái gì lộ, và bạn sẽ đổi gì?</li>
  <li>Viết các lệnh curl mà một job CI nên chạy vào cổng công khai để build đỏ khi có bất kỳ endpoint actuator nào bị lộ.</li>
</ol>
${giai('Xem đáp án', `<p>1. <code>spring.datasource.hikari.connection-timeout=2000</code> (mili giây). Mọi request giờ chờ kết nối tối đa 2 giây: khi pool hoặc CSDL gặp sự cố, người dùng nhận 500/503 nhanh thay vì treo 30 giây — thường là điều bạn muốn. Chương 16 đo việc này.</p><p>2. Mọi thứ ở mục 4 — profile nói ứng dụng được <em>khởi động thế nào</em>, không nói nó chạy ở đâu. Đừng để cấu hình gỡ lỗi trong profile dùng chung; cho staging một profile riêng theo luật production, và chặn cổng quản trị ở tầng mạng.</p><p>3. Ví dụ: <code>for p in env heapdump loggers configprops threaddump beans mappings; do c=$(curl -s -o /dev/null -w '%{http_code}' https://staging.example/actuator/$p); [ "$c" = 200 ] &amp;&amp; { echo "LỘ /actuator/$p"; exit 1; }; done</code>.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<ul>
  <li><strong>Actuator</strong> — mô-đun Spring Boot thêm các endpoint vận hành (health, metrics, info, env, heapdump…).</li>
  <li><strong>Exposure</strong> — endpoint nào gọi được qua HTTP (<code>management.endpoints.web.exposure.include</code>).</li>
  <li><strong>Access</strong> — thiết lập của Boot 4 cho từng endpoint (<code>none</code>, <code>read-only</code>, <code>unrestricted</code>); <code>heapdump</code> và <code>shutdown</code> khởi đầu ở <code>none</code>.</li>
  <li><strong>Cổng quản trị</strong> — cổng HTTP riêng cho actuator (<code>management.server.port</code>).</li>
  <li><strong>Probe liveness / readiness</strong> — phép kiểm của bộ điều phối: khởi động lại khi treo / ngừng chuyển request khi chưa sẵn sàng.</li>
  <li><strong>Health group</strong> — tập con có tên của các chỉ báo sức khoẻ (<code>management.endpoint.health.group.*</code>).</li>
  <li><strong>Heap dump</strong> — tệp chứa mọi đối tượng trong heap của JVM, kể cả bí mật và dữ liệu người dùng.</li>
</ul>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Liveness không có CSDL, readiness có CSDL, health tổng cho người xem — đã đo: Redis sập LabFlow vẫn sẵn sàng, PostgreSQL đứng hình thì LabFlow chưa sẵn sàng nhưng vẫn sống.</li>
  <li>Ba endpoint trên cổng nội bộ; chi tiết chỉ cho MANAGER.</li>
  <li>Cấu hình theo hướng dẫn trên mạng làm lộ heap 168 MB chứa khoá JWT, mật khẩu CSDL và mật khẩu người dùng cho một lệnh curl ẩn danh — cùng loại lỗi với VW/Cariad năm 2024.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.spring.io/spring-boot/reference/actuator/endpoints.html', '🍃', 'Spring Boot — Actuator endpoints', 'exposure, access, health group, probe Kubernetes, bảo mật')}
${tl('https://media.ccc.de/v/38c3-wir-wissen-wo-dein-auto-steht-volksdaten-von-volkswagen', '🚗', '38C3 — Wir wissen wo dein Auto steht', 'bài trình bày của CCC về vụ lộ dữ liệu VW/Cariad (tiếng Đức, có bản dịch)')}

<h3>Nguồn</h3>
<ul>
  <li>Chaos Computer Club, 38C3 (12/2024) — <a href="https://media.ccc.de/v/38c3-wir-wissen-wo-dein-auto-steht-volksdaten-von-volkswagen" target="_blank" rel="noopener">Wir wissen wo dein Auto steht – Volksdaten von Volkswagen</a> (dữ liệu di chuyển của 800.000 xe điện).</li>
  <li>Mọi output: LabFlow (Spring Boot 4.1.2, Java 21) + PostgreSQL 16 + Redis 7 trên máy dựng bài, 24/11/2026.</li>
</ul>
</div>
`;

// ===== Bài 15.2 =====
const MA152_BS = java("// booking/internal/BookingService.java — cuối hàm dat(), sau khi lượt đặt đã được lưu\nBooking b = bookings.saveAndFlush(new Booking(lab.id(), u.id(), r.startAt(), r.endAt(), r.purpose(), idemKey, lab.requiresApproval()));\nevents.publishEvent(new BookingCreated(b.getId(), u.id(), lab.code(), b.getStartAt(), b.getEndAt(), b.getStatus().name()));\n// Chương 15: số đo nghiệp vụ. Tên KHÔNG kết thúc bằng \".created\" (Prometheus cắt đuôi _created ⇒ ra labflow_bookings_total).\n// Nhãn lab lấy từ CATALOG (mã đã tồn tại, tập hữu hạn), không lấy chữ client gửi.\nsoDo.counter(\"labflow.bookings.placed\", \"lab\", lab.code(), \"status\", b.getStatus().name()).increment();\nreturn new KetQua(view(b, Map.of(lab.id(), lab)), false);\n// … và ở nhánh Idempotency-Key gửi lại: soDo.counter(\"labflow.bookings.replayed\").increment();");
const MA152_XL = java("// shared/XuLyLoi.java — mọi handler đều trả qua dem(pd(…))\n/**\n * Chương 15: mỗi lỗi trả cho client được đếm theo MÃ (tập hữu hạn do ta đặt: SLOT_TAKEN, QUOTA_EXCEEDED…).\n * Lỗi đã được @ExceptionHandler xử lý thì http.server.requests chỉ ghi exception=\"none\" ⇒ phải tự đếm mới thấy \"409 vì sao\".\n * KHÔNG gắn nhãn bằng chữ người dùng gửi lên (email, labCode, đường dẫn thô) — mỗi giá trị mới là một chuỗi số đo mới.\n */\nprivate ProblemDetail dem(ProblemDetail p) {\n    soDo.counter(\"labflow.api.errors\", \"code\", String.valueOf(p.getProperties().get(\"code\")), \"status\", String.valueOf(p.getStatus())).increment();\n    return p;\n}");
const MA152_BC = java("// booking/internal/BookingController.java — trong dat()\n// Chương 15: MỘT Observation = một Timer (labflow.booking.create, có nhãn error) + một span trong trace.\nvar kq = Observation.createNotStarted(\"labflow.booking.create\", obs)\n    .observe(() -> service.dat(NguoiDung.tu(jwt), new BookingService.YeuCauDat(r.labCode(), r.startAt(), r.endAt(), r.purpose()), key));");
const MA152_GAUGE = java("/**\n * Chương 15: sự kiện Spring Modulith đã ghi sổ nhưng listener CHƯA xong (Chương 14.3).\n * Bình thường ~0; đứng yên ở số dương ⇒ email/thông báo đang hỏng mà API vẫn trả 201 — chỉ số đo này mới thấy.\n */\n@Component\nclass SoDoThongBao {\n    SoDoThongBao(MeterRegistry soDo, JdbcClient db) {\n        Gauge.builder(\"labflow.events.incomplete\", db,\n                d -> d.sql(\"select count(*) from event_publication where completion_date is null\").query(Long.class).single())\n            .description(\"Sự kiện đã ghi sổ nhưng listener chưa xong\").register(soDo);\n    }\n}");
const MA152_DEMO = java("/** CHỈ profile c15 (demo bài 15.2): những cách dùng số đo SAI để đo hậu quả. Đường /dev/** công khai như ChamDemo. */\n@Profile(\"c15\")\n@RestController\nclass DemoQuanSat {\n    private final MeterRegistry soDo;\n    DemoQuanSat(MeterRegistry soDo) { this.soDo = soDo; }\n\n    /** SAI: nhãn lấy nguyên chữ client gửi ⇒ mỗi giá trị mới một chuỗi số đo mới (bùng nổ cardinality). */\n    @GetMapping(\"/dev/the-sai\")\n    String theSai(@RequestParam String nguoi) {\n        soDo.counter(\"labflow.demo.visits\", \"user\", nguoi).increment();\n        return \"ok\\n\";\n    }\n\n    /** Bẫy đặt tên: counter tên \"….created\" — xem nó hiện ra trong /actuator/prometheus dưới tên gì. */\n    @GetMapping(\"/dev/dem-created\")\n    String demCreated() {\n        soDo.counter(\"labflow.demo.created\").increment();\n        return \"ok\\n\";\n    }\n\n    /** Một lỗi không lường trước (500) để xem nhãn exception/outcome của http.server.requests. */\n    @GetMapping(\"/dev/loi\")\n    String loi() { throw new IllegalStateException(\"hỏng có chủ ý cho bài 15.2\"); }\n\n    /**\n     * Chặn bùng nổ: số đo labflow.demo.visits chỉ giữ tối đa 100 giá trị nhãn \"user\", từ giá trị thứ 101 bị bỏ (deny).\n     * Bật bằng labflow.demo.chan-the=true. Bean MeterFilter được Boot áp vào registry TRƯỚC khi số đo đầu tiên được tạo.\n     */\n    @Bean\n    @ConditionalOnProperty(name = \"labflow.demo.chan-the\", havingValue = \"true\")\n    static MeterFilter chanThe() {\n        return MeterFilter.maximumAllowableTags(\"labflow.demo.visits\", \"user\", 100, MeterFilter.deny());\n    }\n}");
const MA152_PROM = yml("# Prometheus hỏi (scrape) hai instance LabFlow mỗi 5 giây qua CỔNG QUẢN TRỊ (8081/8091), không qua cổng API công khai\nglobal:\n  scrape_interval: 5s\n  evaluation_interval: 5s\nrule_files: [/etc/prometheus/rules.yml]\nscrape_configs:\n  - job_name: labflow\n    metrics_path: /actuator/prometheus\n    static_configs:\n      - targets: [\"localhost:8081\"]\n        labels: {instance_name: A}\n      - targets: [\"localhost:8091\"]\n        labels: {instance_name: B}");
const MA152_RULES = yml("# Cảnh báo dựa trên số đo — đặt theo TRIỆU CHỨNG người dùng thấy (chậm, lỗi), không theo CPU\ngroups:\n  - name: labflow\n    rules:\n      - alert: LabflowDatPhongCham\n        # p95 thời gian đặt phòng trong 1 phút gần nhất, gộp mọi instance\n        expr: histogram_quantile(0.95, sum by (le) (rate(http_server_requests_seconds_bucket{uri=\"/api/v1/bookings\",method=\"POST\"}[1m]))) > 0.5\n        for: 30s\n        labels: {severity: page}\n        annotations: {summary: \"p95 đặt phòng > 500 ms\"}\n      - alert: LabflowLoi5xx\n        expr: sum(rate(http_server_requests_seconds_count{status=~\"5..\"}[1m])) / sum(rate(http_server_requests_seconds_count[1m])) > 0.05\n        for: 30s\n        labels: {severity: page}\n        annotations: {summary: \"hơn 5 % request lỗi 5xx\"}\n      - alert: LabflowSuKienKet\n        # email/thông báo hỏng mà API vẫn 201 — chỉ số đo này thấy (Chương 14.3)\n        expr: max(labflow_events_incomplete) > 0\n        for: 2m\n        labels: {severity: ticket}\n        annotations: {summary: \"có sự kiện chưa xử lý xong quá 2 phút\"}");
const OUT152A = out("## 15.2a — Đọc /actuator/prometheus: một request ⇒ những dòng nào?\n$ curl -s -o /dev/null -w 'GET /api/v1/labs/NET-02  HTTP %{http_code}\\n' $API/api/v1/labs/NET-02\nGET /api/v1/labs/NET-02  HTTP 200\n\n$ curl -s $QL/actuator/prometheus | grep 'uri=\"/api/v1/labs/{code}\"' | grep -v _bucket\nhttp_server_requests_seconds_count{error=\"none\",exception=\"none\",method=\"GET\",outcome=\"SUCCESS\",status=\"200\",uri=\"/api/v1/labs/{code}\"} 1\nhttp_server_requests_seconds_sum{error=\"none\",exception=\"none\",method=\"GET\",outcome=\"SUCCESS\",status=\"200\",uri=\"/api/v1/labs/{code}\"} 1.160946896\nhttp_server_requests_seconds_max{error=\"none\",exception=\"none\",method=\"GET\",outcome=\"SUCCESS\",status=\"200\",uri=\"/api/v1/labs/{code}\"} 1.160946896\n\n$ curl -s $QL/actuator/prometheus | grep 'uri=\"/api/v1/labs/{code}\"' | grep -c _bucket | sed 's/^/… và /;s/$/ dòng _bucket (histogram: bao nhiêu request nhanh hơn từng mốc)/'\n… và 69 dòng _bucket (histogram: bao nhiêu request nhanh hơn từng mốc)\n\n$ curl -s $QL/actuator/prometheus | grep 'uri=\"/api/v1/labs/{code}\"' | grep _bucket | sed -n '1p;20p;40p;$p'\nhttp_server_requests_seconds_bucket{error=\"none\",exception=\"none\",method=\"GET\",outcome=\"SUCCESS\",status=\"200\",uri=\"/api/v1/labs/{code}\",le=\"0.001\"} 0\nhttp_server_requests_seconds_bucket{error=\"none\",exception=\"none\",method=\"GET\",outcome=\"SUCCESS\",status=\"200\",uri=\"/api/v1/labs/{code}\",le=\"0.016777216\"} 0\nhttp_server_requests_seconds_bucket{error=\"none\",exception=\"none\",method=\"GET\",outcome=\"SUCCESS\",status=\"200\",uri=\"/api/v1/labs/{code}\",le=\"0.447392426\"} 0\nhttp_server_requests_seconds_bucket{error=\"none\",exception=\"none\",method=\"GET\",outcome=\"SUCCESS\",status=\"200\",uri=\"/api/v1/labs/{code}\",le=\"+Inf\"} 1\n\n## 300 mã phòng khác nhau, 300 đường không tồn tại ⇒ bao nhiêu chuỗi số đo mới?\n$ for i in $(seq 300); do curl -s -o /dev/null $API/api/v1/labs/P$i; curl -s -o /dev/null $API/khong-co-$i; done\n\n$ echo \"chuỗi http_server_requests: trước $(cat /tmp/a), sau $(curl -s $QL/actuator/prometheus | grep -c '^http_server_requests_seconds_count')\"\nchuỗi http_server_requests: trước 2, sau 4\n\n$ curl -s $QL/actuator/prometheus | grep '^http_server_requests_seconds_count' | grep 'status=\"40[14]\"'\nhttp_server_requests_seconds_count{error=\"none\",exception=\"none\",method=\"GET\",outcome=\"CLIENT_ERROR\",status=\"401\",uri=\"UNKNOWN\"} 300\nhttp_server_requests_seconds_count{error=\"none\",exception=\"none\",method=\"GET\",outcome=\"CLIENT_ERROR\",status=\"404\",uri=\"/api/v1/labs/{code}\"} 300");
const OUT152B = out("## 15.2b — Số đo nghiệp vụ của LabFlow: đặt được, xung đột, gửi lại, dò mật khẩu, việc tồn\n$ TA=$(tok an@fpt.edu.vn); TB=$(tok binh@fpt.edu.vn)\n\n$ dat $TA NET-02 2026-12-02T08:00 2026-12-02T10:00\nHTTP 201 #1 NET-02 CONFIRMED\n\n$ dat $TB NET-02 2026-12-02T09:00 2026-12-02T11:00\nHTTP 409 SLOT_TAKEN\n\n$ dat $TA AI-03 2026-12-03T08:00 2026-12-03T10:00\nHTTP 201 #3 AI-03 PENDING\n\n$ dat $TA HW-04 2026-12-04T08:00 2026-12-04T12:00\nHTTP 422 QUOTA_EXCEEDED\n\n$ dat $TA HW-04 2026-12-05T08:00 2026-12-05T12:00\nHTTP 422 QUOTA_EXCEEDED\n\n$ curl -s -o /dev/null -w 'gửi lại cùng Idempotency-Key ⇒ HTTP %{http_code}\\n' -H \"Authorization: Bearer $TB\" -H \"$J\" -H \"Idempotency-Key: k-binh-0001\" -d '{\"labCode\":\"IOT-01\",\"startAt\":\"2026-12-02T13:00\",\"endAt\":\"2026-12-02T14:00\",\"purpose\":\"do an\"}' $API/api/v1/bookings\ngửi lại cùng Idempotency-Key ⇒ HTTP 201\n\n$ curl -s -o /dev/null -w 'gửi lại cùng Idempotency-Key ⇒ HTTP %{http_code}\\n' -H \"Authorization: Bearer $TB\" -H \"$J\" -H \"Idempotency-Key: k-binh-0001\" -d '{\"labCode\":\"IOT-01\",\"startAt\":\"2026-12-02T13:00\",\"endAt\":\"2026-12-02T14:00\",\"purpose\":\"do an\"}' $API/api/v1/bookings\ngửi lại cùng Idempotency-Key ⇒ HTTP 200\n\n$ for i in $(seq 7); do tok an@fpt.edu.vn sai-mat-khau-$i >/dev/null; done\n\n$ so labflow_bookings_placed_total\nlabflow_bookings_placed_total{lab=\"AI-03\",status=\"PENDING\"} 1.0\nlabflow_bookings_placed_total{lab=\"IOT-01\",status=\"CONFIRMED\"} 1.0\nlabflow_bookings_placed_total{lab=\"NET-02\",status=\"CONFIRMED\"} 1.0\n\n$ so labflow_bookings_replayed_total\nlabflow_bookings_replayed_total 1.0\n\n$ so labflow_api_errors_total\nlabflow_api_errors_total{code=\"BAD_CREDENTIALS\",status=\"401\"} 7.0\nlabflow_api_errors_total{code=\"QUOTA_EXCEEDED\",status=\"422\"} 2.0\nlabflow_api_errors_total{code=\"SLOT_TAKEN\",status=\"409\"} 1.0\n\n$ so labflow_auth_failures_total\nlabflow_auth_failures_total 7.0\n\n$ so labflow_bookings_pending\nlabflow_bookings_pending 1.0\n\n$ so labflow_events_incomplete\nlabflow_events_incomplete 0.0\n\n## Thời gian của Observation labflow.booking.create (có cả nhãn module của Spring Modulith)\n$ so labflow_booking_create_seconds_count\nlabflow_booking_create_seconds_count{error=\"DataIntegrityViolationException\",module_identifier=\"booking\"} 1\nlabflow_booking_create_seconds_count{error=\"LoiNghiepVu\",module_identifier=\"booking\"} 2\nlabflow_booking_create_seconds_count{error=\"none\",module_identifier=\"booking\"} 4\n\n$ so labflow_booking_create_seconds_sum\nlabflow_booking_create_seconds_sum{error=\"DataIntegrityViolationException\",module_identifier=\"booking\"} 0.060138471\nlabflow_booking_create_seconds_sum{error=\"LoiNghiepVu\",module_identifier=\"booking\"} 0.044495723\nlabflow_booking_create_seconds_sum{error=\"none\",module_identifier=\"booking\"} 0.242177932\n\n## Bẫy đặt tên: một counter tên \"labflow.demo.created\"\n$ curl -s -o /dev/null $API/dev/dem-created\n\n$ curl -s $QL/actuator/prometheus | grep -i 'labflow_demo' | grep -v '^#'\nlabflow_demo_total 1.0");
const OUT152C = out("## 15.2c — Bùng nổ nhãn: counter gắn nhãn bằng chữ client gửi (/dev/the-sai?nguoi=…)\n$ do_scrape() { curl -s -o /tmp/s -w '%{size_download} %{time_total}' $QL/actuator/prometheus | awk -v n=$(curl -s $QL/actuator/prometheus | grep -c '^labflow_demo_visits') '{printf \"chuỗi labflow_demo_visits: %6d · trang /actuator/prometheus: %9d byte · %.3fs\\n\", n, $1, $2}'; }\n\n$ do_scrape\nchuỗi labflow_demo_visits:      0 · trang /actuator/prometheus:     30406 byte · 0.159s\n\n$ seq 1 20000 | xargs -P 16 -I{} curl -s -o /dev/null \"$API/dev/the-sai?nguoi=sv{}\"\n\n$ do_scrape\nchuỗi labflow_demo_visits:  20000 · trang /actuator/prometheus:    965871 byte · 0.063s\n\n$ curl -s $QL/actuator/prometheus | grep '^labflow_demo_visits' | sed -n '1p;2p;$p'\nlabflow_demo_visits_total{user=\"sv1\"} 1.0\nlabflow_demo_visits_total{user=\"sv10\"} 1.0\nlabflow_demo_visits_total{user=\"sv9999\"} 1.0\n\n## Prometheus phải lưu từng chuỗi: số chuỗi nó đang giữ\n$ curl -s 'http://localhost:9090/api/v1/query?query=count(labflow_demo_visits_total)' | jq -r '.data.result[0].value[1] | \"Prometheus đang giữ \\(.) chuỗi labflow_demo_visits_total\"'\nPrometheus đang giữ 20000 chuỗi labflow_demo_visits_total\n\n$ curl -s http://localhost:9090/api/v1/status/tsdb | jq -c '.data.headStats.numSeries as $n | {\"tổng chuỗi\": $n, \"nhiều nhất\": .data.seriesCountByMetricName[:3]}'\n{\"tổng chuỗi\":21545,\"nhiều nhất\":[{\"name\":\"labflow_demo_visits_total\",\"value\":20000},{\"name\":\"http_server_requests_seconds_bucket\",\"value\":828},{\"name\":\"labflow_booking_create_seconds_bucket\",\"value\":207}]}\n\n## Sửa: MeterFilter giữ tối đa 100 giá trị cho nhãn user, phần còn lại bị bỏ\n$ seq 1 20000 | xargs -P 16 -I{} curl -s -o /dev/null \"$API/dev/the-sai?nguoi=sv{}\"\n\n$ do_scrape\nchuỗi labflow_demo_visits:    100 · trang /actuator/prometheus:     61582 byte · 0.017s");
const OUT152D = out("## 15.2d — Trung bình nói dối: 1 000 request vào A (94 % mất 10 ms, 6 % mất 1 giây), 1 000 request vào B (đều 300 ms)\n$ { seq 940 | sed 's/.*/10/'; seq 60 | sed 's/.*/1000/'; } | shuf | xargs -P 20 -I{} curl -s -o /dev/null \"$API/dev/cham?ms={}\"\n\n$ seq 1000 | xargs -P 20 -I{} curl -s -o /dev/null \"http://localhost:8090/dev/cham?ms=300\"\n\n## Trung bình (sum / count) của từng instance\n$ PQ 'sum by (instance_name) (increase(http_server_requests_seconds_sum{uri=\"/dev/cham\"}[3m])) / sum by (instance_name) (increase(http_server_requests_seconds_count{uri=\"/dev/cham\"}[3m]))'\nA  80 ms\nB  303 ms\n\n## p50 và p95 của từng instance (histogram_quantile trên các bucket)\n$ PQ 'histogram_quantile(0.50, sum by (instance_name, le) (increase(http_server_requests_seconds_bucket{uri=\"/dev/cham\"}[3m])))'\nA  12 ms\nB  313 ms\n\n$ PQ 'histogram_quantile(0.95, sum by (instance_name, le) (increase(http_server_requests_seconds_bucket{uri=\"/dev/cham\"}[3m])))'\nB  353 ms\nA  1007 ms\n\n## p95 của CẢ HỆ THỐNG: SAI = lấy trung bình hai p95, ĐÚNG = cộng bucket rồi mới tính\n$ PQ 'avg(histogram_quantile(0.95, sum by (instance_name, le) (increase(http_server_requests_seconds_bucket{uri=\"/dev/cham\"}[3m]))))'\ngộp A+B  680 ms\n\n$ PQ 'histogram_quantile(0.95, sum by (le) (increase(http_server_requests_seconds_bucket{uri=\"/dev/cham\"}[3m])))'\ngộp A+B  354 ms\n\n$ PQ 'histogram_quantile(0.99, sum by (le) (increase(http_server_requests_seconds_bucket{uri=\"/dev/cham\"}[3m])))'\ngộp A+B  1041 ms\n\n## \"max\" trong /actuator/prometheus chỉ là lớn nhất của một cửa sổ ngắn\n$ so 'http_server_requests_seconds_max' | grep '/dev/cham'\nhttp_server_requests_seconds_max{error=\"none\",exception=\"none\",method=\"GET\",outcome=\"SUCCESS\",status=\"200\",uri=\"/dev/cham\"} 1.016300285\n\n## Đối chiếu: trung bình CHÍNH XÁC từ sum/count ngay trong ứng dụng (increase() của Prometheus là ước lượng theo cửa sổ)\n$ for u in $QL http://localhost:8091; do curl -s $u/actuator/prometheus | grep '^http_server_requests_seconds_\\(count\\|sum\\).*dev/cham' | awk '{print $NF}' | paste -sd' ' | awk '{printf \"%d request · tổng %.1f s · trung bình %.1f ms\\n\",$1,$2,$2/$1*1000}'; done\n1001 request · tổng 73.1 s · trung bình 73.0 ms\n1001 request · tổng 304.0 s · trung bình 303.7 ms");
const OUT152E = out("## 15.2e — Luật cảnh báo: kiểm cú pháp rồi làm nó kêu thật\n$ docker run --rm --entrypoint promtool -v $PWD/obs/rules.yml:/r.yml:ro,z prom/prometheus:v3.16.0 check rules /r.yml\nChecking /r.yml\n  SUCCESS: 3 rules found\n\n## Cứ 2 request thì 1 lỗi 500 — sau 20 giây:\n$ for i in $(seq 80); do curl -s -o /dev/null $API/dev/loi; curl -s -o /dev/null $API/api/v1/labs; sleep 0.2; done\n\n$ curl -s http://localhost:9090/api/v1/alerts | jq -r '.data.alerts[] | \"\\(.labels.alertname)  \\(.state)  từ \\(.activeAt[11:19])\"'\nLabflowLoi5xx  pending  từ 14:53:07\n\n## Lỗi kéo dài thêm 40 giây (quá \"for: 30s\"):\n$ for i in $(seq 160); do curl -s -o /dev/null $API/dev/loi; curl -s -o /dev/null $API/api/v1/labs; sleep 0.2; done\n\n$ curl -s http://localhost:9090/api/v1/alerts | jq -r '.data.alerts[] | \"\\(.labels.alertname)  \\(.state)  từ \\(.activeAt[11:19])  — \\(.annotations.summary)\"'\nLabflowLoi5xx  firing  từ 14:53:07  — hơn 5 % request lỗi 5xx\n\n## Lỗi 500 trong số đo: nhãn exception KHÔNG có tên lớp — bộ bắt Exception chung (XuLyLoi) đã \"xử lý\" nó\n$ so http_server_requests_seconds_count | grep '/dev/loi'\nhttp_server_requests_seconds_count{error=\"none\",exception=\"none\",method=\"GET\",outcome=\"SERVER_ERROR\",status=\"500\",uri=\"/dev/loi\"} 240\n\n$ so labflow_api_errors_total | grep INTERNAL\nlabflow_api_errors_total{code=\"INTERNAL\",status=\"500\"} 240.0");
const OUT152F = out("## 15.2f — Grafana đọc cùng số đo (datasource + dashboard nạp sẵn từ tệp)\n$ curl -s -u \"admin:$MAT_KHAU_GF\" http://localhost:3000/api/search?query=LabFlow | jq -c '.[] | {title, url}'\n{\"title\":\"LabFlow\",\"url\":\"/dashboards/f/dg59zaiolsutcf/labflow\"}\n{\"title\":\"LabFlow — sức khoẻ API\",\"url\":\"/d/labflow/labflow-e28094-suc-khoe-api\"}\n\n$ curl -s -u \"admin:$MAT_KHAU_GF\" http://localhost:3000/api/dashboards/uid/labflow | jq -r '.dashboard.panels[] | \"• \\(.title)\"'\n• Request/giây theo instance\n• p95 đặt phòng (gộp mọi instance)\n• Tỉ lệ lỗi 5xx\n• Lỗi nghiệp vụ theo mã\n• Lượt chờ duyệt · sự kiện chưa xong\n• Đăng nhập thất bại/phút\n\n## Grafana hỏi Prometheus thay bạn — p95 của GET /api/v1/labs và tỉ lệ 5xx trong 5 phút gần nhất\n$ curl -s -u \"admin:$MAT_KHAU_GF\" -H \"$J\" http://localhost:3000/api/ds/query -d '{\"from\":\"now-5m\",\"to\":\"now\",\"queries\":[{\"refId\":\"A\",\"datasource\":{\"uid\":\"prom\"},\"expr\":\"histogram_quantile(0.95, sum by (le) (rate(http_server_requests_seconds_bucket{uri=\\\"/api/v1/labs\\\"}[5m])))\",\"instant\":true}]}' | jq -r '.results.A.frames[0].data.values[1][0] | \"p95 GET /api/v1/labs: \\(. * 1000 | floor) ms\"'\np95 GET /api/v1/labs: 20 ms\n\n$ curl -s -u \"admin:$MAT_KHAU_GF\" -H \"$J\" http://localhost:3000/api/ds/query -d '{\"from\":\"now-5m\",\"to\":\"now\",\"queries\":[{\"refId\":\"A\",\"datasource\":{\"uid\":\"prom\"},\"expr\":\"sum(rate(http_server_requests_seconds_count{status=~\\\"5..\\\"}[1m])) / sum(rate(http_server_requests_seconds_count[1m]))\",\"instant\":true}]}' | jq -r '.results.A.frames[0].data.values[1][0] | \"tỉ lệ 5xx: \\(. * 100 | floor) %\"'\ntỉ lệ 5xx: 50 %\n\n## Prometheus và Grafana để mặc định thì AI CŨNG ĐỌC ĐƯỢC: danh sách máy nội bộ\n$ curl -s http://localhost:9090/api/v1/targets | jq -r '.data.activeTargets[] | \"\\(.scrapeUrl)  \\(.health)\"'\nhttp://localhost:8081/actuator/prometheus  up\nhttp://localhost:8091/actuator/prometheus  up");

const PQ_DEF = bash(`# PQ '<PromQL>': hỏi Prometheus (cổng 9090) một biểu thức, in "instance  giá trị ms"
PQ() { curl -s "http://localhost:9090/api/v1/query" --data-urlencode "query=$1" \\
  | jq -r '.data.result[] | "\\(.metric.instance_name // "gộp A+B")  \\(.value[1] | tonumber * 1000 | floor) ms"'; }`);

const L152_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.2 · Observability</span>
<h2>Metrics with Micrometer and Prometheus</h2>
<p class="lead">Health tells you "alive or not". Metrics tell you "how well": how many bookings per minute, how many fail and why, how long the slowest 5 % of students wait. Spring Boot records these numbers through Micrometer; Prometheus collects them every few seconds; Grafana draws them; alert rules wake someone up. In this lesson LabFlow gets business metrics, we read p95 correctly across two instances, watch the average lie, crash Prometheus' memory budget with one careless tag — 20,000 series from one query parameter — and make an alert fire for real.</p>

<h3>Everyday picture first</h3>
<p>A motorbike's dashboard does not show "the engine is fine". It shows numbers: speed, fuel, temperature, the odometer. Some only go up (the odometer — a <em>counter</em>), some go up and down (fuel — a <em>gauge</em>), and the mechanic's logbook shows how long each trip took (a <em>timer</em>). You do not write the number of every turn of the wheel; you read the dashboard every few seconds. Prometheus is the person who reads the dashboard every 5 seconds and writes it down.</p>

<h3>1. One request, many lines: reading /actuator/prometheus</h3>
<p>LabFlow already has <code>micrometer-registry-prometheus</code> (added to <code>pom.xml</code> this chapter) and exposes <code>prometheus</code> on the management port. Spring MVC records every request in a timer called <code>http.server.requests</code>, which Prometheus sees as <code>http_server_requests_seconds_*</code>:</p>
${OUT152A}
<ul>
  <li>One request becomes <code>_count</code> (how many), <code>_sum</code> (total seconds) and <code>_max</code> (slowest in a recent window). Average = sum ÷ count.</li>
  <li>Because LabFlow sets <code>percentiles-histogram</code> for this timer, there are also <strong>69 <code>_bucket</code> lines</strong> per combination of tags: "how many requests were faster than 1 ms, 16.8 ms, 447 ms… +Inf". Prometheus computes percentiles from these buckets — the price is 69 series per (uri, method, status, outcome, exception) combination.</li>
  <li>The <code>uri</code> tag is the <strong>template</strong> <code>/api/v1/labs/{code}</code>, not the real path. 300 different lab codes and 300 non-existent paths added only <strong>2 series</strong>: unknown paths become <code>uri="UNKNOWN"</code> (they got 401 from Security before routing). Spring protects you here — section 3 shows what happens when you do not protect yourself.</li>
</ul>

<h3>2. Business metrics: what the product owner actually asks</h3>
<p><code>http_server_requests</code> says "POST /api/v1/bookings returned 409 twice". It cannot say <em>why</em>. Three kinds of meter fill the gap:</p>
<p><strong>Counter</strong> — only goes up. A booking that was really created, tagged by lab and status:</p>
${MA152_BS}
<p>Every error LabFlow returns already goes through one advice (Chapter 5). Counting there costs one line and covers every code:</p>
${MA152_XL}
<p><strong>Timer via Observation</strong> — one call gives a timer <em>and</em> a span in the trace (lesson 15.3):</p>
${MA152_BC}
<p><strong>Gauge</strong> — a value read again at each scrape. The most useful LabFlow gauge watches the Spring Modulith event log from Chapter 14: events whose listener has not finished.</p>
${MA152_GAUGE}
<p>Book, collide, retry, mistype a password seven times — then read:</p>
${OUT152B}
<ul>
  <li><code>labflow_bookings_placed_total</code> counts three real bookings. Bình's overlapping slot is <code>SLOT_TAKEN</code>, An's two 4-hour HW-04 bookings exceed the 6-hour weekly quota (<code>QUOTA_EXCEEDED</code> ×2), and the second request with the same <code>Idempotency-Key</code> is a replay, not a new booking.</li>
  <li><code>labflow_auth_failures_total</code> = 7: one panel and one alert away from "someone is guessing passwords".</li>
  <li>The Observation timer has an <code>error</code> tag (<code>LoiNghiepVu</code>, <code>DataIntegrityViolationException</code>) and Spring Modulith adds <code>module_identifier="booking"</code> automatically.</li>
  <li><strong>Naming trap:</strong> a counter named <code>labflow.demo.created</code> appears as <code>labflow_demo_total</code>. The Prometheus client treats a <code>_created</code> suffix as reserved (OpenMetrics uses it for "when was this counter created") and cuts it. Our first version of LabFlow named the booking counter <code>labflow.bookings.created</code> — and the dashboard query for <code>labflow_bookings_created_total</code> returned nothing. Hence <code>placed</code>.</li>
</ul>

<h3>3. Cardinality: one tag that eats your monitoring</h3>
<p>Every distinct combination of tag values is a separate <strong>time series</strong> that the app keeps in memory and Prometheus stores on disk. A tag taken from user input has no upper bound. The demo endpoint does exactly the common mistake — "count visits per user":</p>
${MA152_DEMO}
${OUT152C}
<ul>
  <li>20,000 different <code>nguoi=</code> values ⇒ <strong>20,000 series</strong>; the scrape page grows from 30,698 to 966,176 bytes (31×). Prometheus now holds 21,545 series, and 20,000 of them are this one useless metric — more than all of LabFlow's real metrics together. An attacker with a loop can do this to you in a minute, and each scrape keeps the cost forever (until retention expires).</li>
  <li>The fix is not "be careful": guard it in code. <code>MeterFilter.maximumAllowableTags</code> keeps 100 values and denies the rest — the page is back to 61,584 bytes. Better still, never tag with user ids, emails, raw paths, request ids or free text; use bounded values (lab codes that exist, error codes you defined, HTTP status classes). Per-user questions belong in logs or the database, not in metrics.</li>
</ul>

<h3>4. Percentiles: why the average lies, and how not to average percentiles</h3>
<p>Prometheus scrapes both instances (A on 8081, B on 8091) every 5 s — through the management port, never the public one:</p>
${MA152_PROM}
<p>A small helper sends PromQL and prints milliseconds:</p>
${PQ_DEF}
<p>Instance A receives 1,000 requests: 94 % take 10 ms, 6 % take 1 second (a slow query, a full GC, a cold cache). Instance B receives 1,000 requests of 300 ms each:</p>
${OUT152D}
<ul>
  <li><strong>The average of A is 73 ms</strong> (exact, from the app's own sum/count; Prometheus' <code>increase()</code> over a window estimates 80 ms). It looks healthy — yet 60 students out of 1,000 waited a full second. <strong>p95 = 1,007 ms</strong> tells the truth: "1 in 20 requests is slower than this".</li>
  <li>p50 of A is 12 ms: the typical user is happy. p50 hides the tail; p95/p99 show it. Set objectives on percentiles ("p95 of booking under 500 ms"), not on averages.</li>
  <li><strong>System p95, wrong way</strong>: average the two instances' p95 ⇒ 680 ms. <strong>Right way</strong>: add the buckets of both instances, then compute ⇒ 354 ms. Percentiles cannot be averaged — 6 % slow requests on one of two instances is 3 % overall, which is below the 95th percentile. This is why we use histogram buckets (<code>percentiles-histogram</code>) instead of percentiles computed inside each app (<code>management.metrics.distribution.percentiles=0.95</code>), which cannot be combined at all.</li>
  <li><code>_max</code> (1.016 s) is the slowest request of a short rolling window — good for spotting spikes, useless for "how often".</li>
</ul>

<h3>5. Alerts on symptoms, then Grafana</h3>
<p>Alert on what users feel — slow or failing requests, stuck background work — not on CPU percentage. LabFlow's rules:</p>
${MA152_RULES}
${OUT152E}
<ul>
  <li><code>promtool check rules</code> belongs in CI next to your tests.</li>
  <li>After 20 seconds of 50 % errors the alert is <strong>pending</strong>; once the condition has held for <code>for: 30s</code> it becomes <strong>firing</strong>. <code>for</code> trades speed for fewer false alarms from one bad scrape.</li>
  <li>The 500s from <code>/dev/loi</code> show <code>exception="none"</code>: LabFlow's catch-all <code>@ExceptionHandler(Exception.class)</code> "handled" the exception, so Spring records no exception class. Our own <code>labflow_api_errors_total{code="INTERNAL"}</code> still counts all 240. If you have a catch-all handler, count in it.</li>
</ul>
<p>Grafana reads the same Prometheus. The data source and the dashboard are provisioned from files in the repo (no clicking that a teammate cannot review):</p>
${OUT152F}
<p>Six panels answer six questions a team asks during an incident: traffic per instance, booking p95, 5xx ratio, business errors by code, pending approvals and stuck events, failed logins per minute. The last command shows the other side: Prometheus' API answers anyone who can reach port 9090 — including the internal addresses of every service it scrapes.</p>

<h3>🕵️ Hacker corner — exposed Prometheus and Grafana</h3>
<ul>
  <li><strong>Aqua Security, December 2024</strong>: researchers found about <strong>336,000</strong> Prometheus servers and exporters reachable from the Internet. Their APIs leaked internal hostnames, labels, sometimes credentials and API keys put in labels or configs; exposed debug endpoints (<code>/debug/pprof</code>) allowed denial of service. Our <code>/api/v1/targets</code> above is the same leak in miniature.</li>
  <li><strong>Grafana CVE-2021-43798 (December 2021)</strong>: a path traversal in plugin URLs let anyone, <em>without logging in</em>, read files on the Grafana server — such as <code>grafana.ini</code> and the database with data-source passwords. Exploited in the wild within days.</li>
  <li><strong>Prevention</strong>: Prometheus, Grafana and every exporter on the internal network only; authentication in front (Grafana's own login with a non-default admin password — our demo reads it from an environment variable; a reverse proxy for Prometheus); no secrets in labels; update Grafana quickly; keep cardinality bounded so one request loop cannot become a denial of service on your monitoring.</li>
</ul>

<h3>Compared with Node.js</h3>
<p>In Express you add <code>prom-client</code>, call <code>collectDefaultMetrics()</code>, and write a middleware that observes a <code>Histogram</code> with labels <code>method, route, status</code> — and you must pass <code>req.route.path</code>, not <code>req.url</code>, or you rebuild section 3's explosion yourself. Spring's <code>http.server.requests</code> gives templated URIs, JVM, pool and cache metrics with zero code. The concepts — counter/gauge/histogram, bounded labels, buckets aggregated across instances — are identical, and so are the interview questions.</p>

<h3>At work</h3>
<ul>
  <li>An SLO in a real team sounds like "99 % of booking requests under 500 ms over 30 days". You can only state it if you have histograms.</li>
  <li>When a dashboard looks fine but users complain, the usual suspects are averages and missing labels — exactly sections 2 and 4.</li>
  <li>Cloud monitoring vendors bill per active series. Section 3 is also a lesson in money.</li>
</ul>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"Counter, gauge, timer — give one LabFlow example each."</strong> — Bookings placed (counter), pending approvals (gauge), booking creation time (timer/histogram).</li>
  <li><strong>"Why p95 instead of the average?"</strong> — The average hides the slow tail; measured: average 73 ms while p95 was 1,007 ms. Users feel the tail.</li>
  <li><strong>"How do you compute p95 across ten instances?"</strong> — Sum histogram buckets by <code>le</code>, then <code>histogram_quantile</code>. Never average per-instance percentiles (measured: 680 ms wrong vs 354 ms right).</li>
  <li><strong>"What is high cardinality and how do you prevent it?"</strong> — Unbounded tag values (user id, raw path) creating a series each; bounded tags only, MeterFilter limits, per-user detail in logs.</li>
</ol>

<h3>🧪 Practice (25 minutes)</h3>
<ol>
  <li>Write the PromQL for "bookings placed per lab per hour" and for "share of booking requests that ended in SLOT_TAKEN over the last 15 minutes".</li>
  <li>A teammate adds the tag <code>email</code> to <code>labflow.auth.failures</code> "to see who is attacked". What happens during a password-spraying attack with 50,000 emails, and what would you do instead?</li>
  <li>Change the alert <code>LabflowDatPhongCham</code> so it ignores periods with fewer than 1 booking request per second.</li>
</ol>
${giai('Show the answers', `<p>1. <code>sum by (lab) (increase(labflow_bookings_placed_total[1h]))</code>; and <code>sum(increase(labflow_api_errors_total{code="SLOT_TAKEN"}[15m])) / sum(increase(http_server_requests_seconds_count{uri="/api/v1/bookings",method="POST"}[15m]))</code>.</p><p>2. 50,000 new series — the attack against your login becomes an attack against your monitoring (memory, scrape time, bill). Keep the counter without email; log each failure (with the email, as JSON, lesson 15.3) and search the logs, or count per source network range, which is bounded.</p><p>3. Add a condition with <code>and</code>: <code>histogram_quantile(0.95, sum by (le) (rate(http_server_requests_seconds_bucket{uri="/api/v1/bookings",method="POST"}[1m]))) &gt; 0.5 and sum(rate(http_server_requests_seconds_count{uri="/api/v1/bookings",method="POST"}[1m])) &gt; 1</code>.</p>`)}

<h3>🗂 Key terms</h3>
<ul>
  <li><strong>Micrometer</strong> — the metrics facade Spring uses; one API, many back ends (Prometheus, OTLP, Datadog…).</li>
  <li><strong>Counter / gauge / timer</strong> — only increases / current value read on demand / count + total time (+ histogram).</li>
  <li><strong>Time series</strong> — one metric name + one combination of tag values.</li>
  <li><strong>Cardinality</strong> — how many series a metric produces; bounded tags keep it small.</li>
  <li><strong>Histogram bucket (<code>le</code>)</strong> — count of observations below a bound; summable across instances.</li>
  <li><strong>p95</strong> — the value 95 % of observations are below.</li>
  <li><strong>Scrape</strong> — Prometheus pulling <code>/actuator/prometheus</code> on a schedule.</li>
  <li><strong>Alert rule, <code>for</code></strong> — PromQL condition that must hold for a duration before firing.</li>
</ul>

<h3>📌 Summary</h3>
<ul>
  <li>http.server.requests for free; business counters, a timer through Observation and gauges from the database for what the product asks.</li>
  <li>Measured: average 73 ms vs p95 1,007 ms; averaging p95s gives 680 ms, summing buckets gives 354 ms.</li>
  <li>One user-controlled tag ⇒ 20,000 series, 31× bigger scrape; a MeterFilter caps it. Names ending in <code>.created</code> lose the suffix.</li>
  <li>Alert on symptoms with <code>for</code>; provision Grafana from files; keep Prometheus and Grafana off the Internet.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.spring.io/spring-boot/reference/actuator/metrics.html', '🍃', 'Spring Boot — Metrics', 'supported meters, MeterFilter, percentiles-histogram, Prometheus')}
${tl('https://prometheus.io/docs/practices/histograms/', '🔥', 'Prometheus — Histograms and summaries', 'why buckets aggregate and quantiles do not')}
${tl('https://nvd.nist.gov/vuln/detail/CVE-2021-43798', '🛡️', 'NVD — CVE-2021-43798 (Grafana)', 'unauthenticated path traversal, December 2021')}

<h3>Sources</h3>
<ul>
  <li>Aqua Security (Nautilus), 12/2024 — research on ~336,000 exposed Prometheus servers and exporters.</li>
  <li>NVD — <a href="https://nvd.nist.gov/vuln/detail/CVE-2021-43798" target="_blank" rel="noopener">CVE-2021-43798</a>.</li>
  <li>All outputs: LabFlow (Spring Boot 4.1.2, Micrometer 1.17.2) ×2 + Prometheus 3.16.0 + Grafana 13.2.6 on the course machine, 24/11/2026.</li>
</ul>
</div>
`;

const L152_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.2 · Quan sát hệ thống</span>
<h2>Số đo với Micrometer và Prometheus</h2>
<p class="lead">Health cho biết "sống hay chết". Số đo cho biết "tốt tới đâu": mỗi phút bao nhiêu lượt đặt, bao nhiêu lượt hỏng và vì sao, 5 % sinh viên chậm nhất phải chờ bao lâu. Spring Boot ghi các con số qua Micrometer; Prometheus thu chúng vài giây một lần; Grafana vẽ; luật cảnh báo đánh thức người trực. Trong bài này LabFlow có số đo nghiệp vụ, ta đọc p95 đúng cách trên hai instance, nhìn trung bình nói dối, làm Prometheus phình bộ nhớ chỉ bằng một nhãn cẩu thả — 20.000 chuỗi từ một tham số — và làm một cảnh báo kêu thật.</p>

<h3>Đời thường trước đã</h3>
<p>Đồng hồ xe máy không hiện chữ "máy ổn". Nó hiện con số: tốc độ, xăng, nhiệt độ, công-tơ-mét. Có số chỉ tăng (công-tơ-mét — <em>counter</em>), có số lên xuống (xăng — <em>gauge</em>), còn sổ của thợ ghi mỗi chuyến đi mất bao lâu (<em>timer</em>). Bạn không ghi từng vòng bánh xe; bạn liếc đồng hồ vài giây một lần. Prometheus là người cứ 5 giây liếc đồng hồ một lần rồi ghi lại.</p>

<h3>1. Một request, nhiều dòng: đọc /actuator/prometheus</h3>
<p>LabFlow đã có <code>micrometer-registry-prometheus</code> (thêm vào <code>pom.xml</code> ở chương này) và mở <code>prometheus</code> trên cổng quản trị. Spring MVC ghi mọi request vào timer tên <code>http.server.requests</code>, Prometheus thấy nó là <code>http_server_requests_seconds_*</code>:</p>
${OUT152A}
<ul>
  <li>Một request thành <code>_count</code> (bao nhiêu lần), <code>_sum</code> (tổng số giây) và <code>_max</code> (chậm nhất trong một cửa sổ gần đây). Trung bình = sum ÷ count.</li>
  <li>Vì LabFlow bật <code>percentiles-histogram</code> cho timer này, còn có <strong>69 dòng <code>_bucket</code></strong> cho mỗi tổ hợp nhãn: "bao nhiêu request nhanh hơn 1 ms, 16,8 ms, 447 ms… +Inf". Prometheus tính phân vị từ các bucket này — cái giá là 69 chuỗi cho mỗi tổ hợp (uri, method, status, outcome, exception).</li>
  <li>Nhãn <code>uri</code> là <strong>mẫu</strong> <code>/api/v1/labs/{code}</code>, không phải đường thật. 300 mã phòng khác nhau và 300 đường không tồn tại chỉ thêm <strong>2 chuỗi</strong>: đường lạ thành <code>uri="UNKNOWN"</code> (chúng bị Security trả 401 trước khi định tuyến). Ở đây Spring bảo vệ bạn — mục 3 cho thấy chuyện gì xảy ra khi bạn không tự bảo vệ.</li>
</ul>

<h3>2. Số đo nghiệp vụ: điều chủ sản phẩm thật sự hỏi</h3>
<p><code>http_server_requests</code> nói "POST /api/v1/bookings trả 409 hai lần". Nó không nói được <em>vì sao</em>. Ba loại số đo lấp chỗ trống:</p>
<p><strong>Counter</strong> — chỉ tăng. Một lượt đặt thật sự được tạo, gắn nhãn phòng và trạng thái:</p>
${MA152_BS}
<p>Mọi lỗi LabFlow trả về đã đi qua một advice duy nhất (Chương 5). Đếm ở đó tốn một dòng mà phủ mọi mã lỗi:</p>
${MA152_XL}
<p><strong>Timer qua Observation</strong> — một lời gọi cho cả timer <em>lẫn</em> một span trong trace (bài 15.3):</p>
${MA152_BC}
<p><strong>Gauge</strong> — giá trị được đọc lại ở mỗi lần scrape. Gauge có ích nhất của LabFlow canh sổ sự kiện Spring Modulith từ Chương 14: những sự kiện mà listener chưa xong.</p>
${MA152_GAUGE}
<p>Đặt, đặt trùng, gửi lại, gõ sai mật khẩu bảy lần — rồi đọc:</p>
${OUT152B}
<ul>
  <li><code>labflow_bookings_placed_total</code> đếm ba lượt đặt thật. Khung giờ chồng của Bình là <code>SLOT_TAKEN</code>, hai lượt HW-04 bốn giờ của An vượt hạn mức 6 giờ/tuần (<code>QUOTA_EXCEEDED</code> ×2), còn request thứ hai cùng <code>Idempotency-Key</code> là gửi lại, không phải lượt mới.</li>
  <li><code>labflow_auth_failures_total</code> = 7: chỉ cách một ô biểu đồ và một luật cảnh báo là thành "có người đang dò mật khẩu".</li>
  <li>Timer của Observation có nhãn <code>error</code> (<code>LoiNghiepVu</code>, <code>DataIntegrityViolationException</code>), còn Spring Modulith tự thêm <code>module_identifier="booking"</code>.</li>
  <li><strong>Bẫy đặt tên:</strong> counter tên <code>labflow.demo.created</code> hiện ra thành <code>labflow_demo_total</code>. Thư viện Prometheus coi đuôi <code>_created</code> là dành riêng (OpenMetrics dùng nó cho "counter được tạo lúc nào") nên cắt đi. Bản LabFlow đầu tiên đặt tên counter là <code>labflow.bookings.created</code> — và câu truy vấn <code>labflow_bookings_created_total</code> trên bảng điều khiển không ra gì. Vì thế mới có <code>placed</code>.</li>
</ul>

<h3>3. Cardinality: một nhãn ăn sạch hệ thống giám sát</h3>
<p>Mỗi tổ hợp giá trị nhãn khác nhau là một <strong>chuỗi thời gian</strong> riêng mà ứng dụng giữ trong bộ nhớ và Prometheus lưu xuống đĩa. Nhãn lấy từ dữ liệu người dùng không có giới hạn trên. Endpoint demo làm đúng lỗi hay gặp — "đếm lượt truy cập theo từng người":</p>
${MA152_DEMO}
${OUT152C}
<ul>
  <li>20.000 giá trị <code>nguoi=</code> khác nhau ⇒ <strong>20.000 chuỗi</strong>; trang scrape phình từ 30.698 lên 966.176 byte (31 lần). Prometheus giờ giữ 21.545 chuỗi, 20.000 trong đó là một số đo vô dụng này — nhiều hơn mọi số đo thật của LabFlow cộng lại. Kẻ tấn công có một vòng lặp là làm được trong một phút, và mỗi lần scrape giữ cái giá đó mãi (tới khi hết hạn lưu).</li>
  <li>Cách sửa không phải "cẩn thận vào": hãy chặn trong mã. <code>MeterFilter.maximumAllowableTags</code> giữ 100 giá trị, từ chối phần còn lại — trang quay về 61.584 byte. Tốt hơn nữa, đừng bao giờ gắn nhãn bằng mã người dùng, email, đường thô, mã request hay chữ tự do; dùng giá trị có giới hạn (mã phòng có thật, mã lỗi bạn tự đặt, nhóm mã HTTP). Câu hỏi theo từng người thuộc về log hoặc CSDL, không thuộc số đo.</li>
</ul>

<h3>4. Phân vị: vì sao trung bình nói dối, và đừng lấy trung bình các phân vị</h3>
<p>Prometheus scrape cả hai instance (A ở 8081, B ở 8091) mỗi 5 giây — qua cổng quản trị, không bao giờ qua cổng công khai:</p>
${MA152_PROM}
<p>Một hàm nhỏ gửi PromQL và in ra mili giây:</p>
${PQ_DEF}
<p>Instance A nhận 1.000 request: 94 % mất 10 ms, 6 % mất 1 giây (một truy vấn chậm, một lần GC toàn phần, cache nguội). Instance B nhận 1.000 request, mỗi cái 300 ms:</p>
${OUT152D}
<ul>
  <li><strong>Trung bình của A là 73 ms</strong> (chính xác, từ sum/count của ứng dụng; <code>increase()</code> của Prometheus trên cửa sổ ước lượng 80 ms). Trông ổn — vậy mà 60 trên 1.000 sinh viên chờ trọn một giây. <strong>p95 = 1.007 ms</strong> nói thật: "cứ 20 request thì 1 request chậm hơn mức này".</li>
  <li>p50 của A là 12 ms: người dùng điển hình vui vẻ. p50 giấu cái đuôi; p95/p99 lộ nó ra. Đặt mục tiêu theo phân vị ("p95 đặt phòng dưới 500 ms"), không theo trung bình.</li>
  <li><strong>p95 cả hệ thống, cách sai</strong>: lấy trung bình p95 của hai instance ⇒ 680 ms. <strong>Cách đúng</strong>: cộng bucket của hai instance rồi mới tính ⇒ 354 ms. Phân vị không lấy trung bình được — 6 % request chậm trên một trong hai instance là 3 % toàn hệ thống, thấp hơn mốc 95. Vì thế ta dùng bucket histogram (<code>percentiles-histogram</code>) thay cho phân vị tính sẵn trong từng ứng dụng (<code>management.metrics.distribution.percentiles=0.95</code>) — thứ hoàn toàn không gộp được.</li>
  <li><code>_max</code> (1,016 giây) là request chậm nhất trong một cửa sổ ngắn — hợp để thấy đột biến, vô dụng cho câu "bao lâu một lần".</li>
</ul>

<h3>5. Cảnh báo theo triệu chứng, rồi tới Grafana</h3>
<p>Cảnh báo theo thứ người dùng cảm thấy — request chậm hoặc lỗi, việc nền bị kẹt — không theo phần trăm CPU. Luật của LabFlow:</p>
${MA152_RULES}
${OUT152E}
<ul>
  <li><code>promtool check rules</code> nên nằm trong CI cạnh các bài test.</li>
  <li>Sau 20 giây lỗi 50 %, cảnh báo ở trạng thái <strong>pending</strong>; khi điều kiện kéo dài đủ <code>for: 30s</code> nó thành <strong>firing</strong>. <code>for</code> đổi tốc độ lấy ít báo động giả từ một lần scrape xấu.</li>
  <li>Lỗi 500 từ <code>/dev/loi</code> có <code>exception="none"</code>: bộ bắt chung <code>@ExceptionHandler(Exception.class)</code> của LabFlow đã "xử lý" exception, nên Spring không ghi tên lớp nào. <code>labflow_api_errors_total{code="INTERNAL"}</code> của ta vẫn đếm đủ 240. Có bộ bắt lỗi chung thì đếm ngay trong nó.</li>
</ul>
<p>Grafana đọc cùng Prometheus. Nguồn dữ liệu và bảng điều khiển được nạp từ tệp trong repo (không bấm tay thứ mà đồng đội không review được):</p>
${OUT152F}
<p>Sáu ô trả lời sáu câu cả đội hỏi khi có sự cố: lưu lượng theo instance, p95 đặt phòng, tỉ lệ 5xx, lỗi nghiệp vụ theo mã, lượt chờ duyệt và sự kiện kẹt, đăng nhập thất bại mỗi phút. Lệnh cuối cho thấy mặt kia: API của Prometheus trả lời bất kỳ ai tới được cổng 9090 — kể cả địa chỉ nội bộ của mọi dịch vụ nó scrape.</p>

<h3>🕵️ Góc hacker — Prometheus và Grafana để ngỏ</h3>
<ul>
  <li><strong>Aqua Security, tháng 12/2024</strong>: nhóm nghiên cứu tìm thấy khoảng <strong>336.000</strong> máy chủ Prometheus và exporter truy cập được từ Internet. API của chúng lộ tên máy nội bộ, nhãn, đôi khi cả thông tin đăng nhập và khoá API bị đặt trong nhãn hay cấu hình; endpoint gỡ lỗi để ngỏ (<code>/debug/pprof</code>) cho phép đánh sập dịch vụ. <code>/api/v1/targets</code> ở trên là cùng kiểu lộ, thu nhỏ.</li>
  <li><strong>Grafana CVE-2021-43798 (tháng 12/2021)</strong>: lỗi duyệt đường dẫn trong URL plugin cho phép bất kỳ ai, <em>không cần đăng nhập</em>, đọc tệp trên máy Grafana — như <code>grafana.ini</code> và CSDL chứa mật khẩu nguồn dữ liệu. Bị khai thác thật chỉ vài ngày sau.</li>
  <li><strong>Cách phòng</strong>: Prometheus, Grafana và mọi exporter chỉ ở mạng nội bộ; có xác thực phía trước (đăng nhập của Grafana với mật khẩu admin không mặc định — demo đọc nó từ biến môi trường; reverse proxy cho Prometheus); không đặt bí mật trong nhãn; cập nhật Grafana nhanh; giữ cardinality có giới hạn để một vòng lặp request không thành tấn công từ chối dịch vụ vào hệ thống giám sát.</li>
</ul>

<h3>So với Node.js</h3>
<p>Ở Express bạn thêm <code>prom-client</code>, gọi <code>collectDefaultMetrics()</code>, và viết một middleware ghi vào <code>Histogram</code> với nhãn <code>method, route, status</code> — phải truyền <code>req.route.path</code>, không phải <code>req.url</code>, nếu không bạn tự dựng lại vụ bùng nổ ở mục 3. <code>http.server.requests</code> của Spring cho URI dạng mẫu, số đo JVM, pool, cache mà không cần dòng mã nào. Khái niệm — counter/gauge/histogram, nhãn có giới hạn, bucket gộp qua nhiều instance — giống hệt, câu hỏi phỏng vấn cũng vậy.</p>

<h3>Ở chỗ làm</h3>
<ul>
  <li>SLO ở một đội thật nghe như "99 % request đặt phòng dưới 500 ms trong 30 ngày". Chỉ nói được câu đó khi có histogram.</li>
  <li>Bảng điều khiển trông ổn mà người dùng vẫn kêu, nghi phạm quen thuộc là trung bình và thiếu nhãn — đúng mục 2 và 4.</li>
  <li>Các dịch vụ giám sát đám mây tính tiền theo số chuỗi đang hoạt động. Mục 3 cũng là bài học về tiền.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Counter, gauge, timer — mỗi loại một ví dụ ở LabFlow."</strong> — Số lượt đặt được tạo (counter), số lượt chờ duyệt (gauge), thời gian tạo lượt đặt (timer/histogram).</li>
  <li><strong>"Sao dùng p95 mà không dùng trung bình?"</strong> — Trung bình giấu cái đuôi chậm; đã đo: trung bình 73 ms trong khi p95 là 1.007 ms. Người dùng cảm nhận cái đuôi.</li>
  <li><strong>"Tính p95 trên mười instance thế nào?"</strong> — Cộng bucket theo <code>le</code> rồi <code>histogram_quantile</code>. Không bao giờ lấy trung bình phân vị từng instance (đã đo: 680 ms sai so với 354 ms đúng).</li>
  <li><strong>"High cardinality là gì, phòng thế nào?"</strong> — Giá trị nhãn không giới hạn (mã người dùng, đường thô) mỗi cái sinh một chuỗi; chỉ dùng nhãn có giới hạn, MeterFilter chặn trần, chi tiết theo người để ở log.</li>
</ol>

<h3>🧪 Thực hành (25 phút)</h3>
<ol>
  <li>Viết PromQL cho "số lượt đặt theo từng phòng mỗi giờ" và "tỉ lệ request đặt phòng kết thúc bằng SLOT_TAKEN trong 15 phút gần nhất".</li>
  <li>Bạn cùng nhóm thêm nhãn <code>email</code> vào <code>labflow.auth.failures</code> "để biết ai bị tấn công". Chuyện gì xảy ra khi bị dò mật khẩu rải trên 50.000 email, và bạn sẽ làm gì thay thế?</li>
  <li>Sửa cảnh báo <code>LabflowDatPhongCham</code> để bỏ qua những lúc có ít hơn 1 request đặt phòng mỗi giây.</li>
</ol>
${giai('Xem đáp án', `<p>1. <code>sum by (lab) (increase(labflow_bookings_placed_total[1h]))</code>; và <code>sum(increase(labflow_api_errors_total{code="SLOT_TAKEN"}[15m])) / sum(increase(http_server_requests_seconds_count{uri="/api/v1/bookings",method="POST"}[15m]))</code>.</p><p>2. 50.000 chuỗi mới — đòn tấn công vào đăng nhập biến thành đòn vào hệ thống giám sát (bộ nhớ, thời gian scrape, hoá đơn). Giữ counter không có email; ghi log mỗi lần thất bại (kèm email, dạng JSON, bài 15.3) rồi tìm trong log, hoặc đếm theo dải mạng nguồn — thứ có giới hạn.</p><p>3. Thêm điều kiện bằng <code>and</code>: <code>histogram_quantile(0.95, sum by (le) (rate(http_server_requests_seconds_bucket{uri="/api/v1/bookings",method="POST"}[1m]))) &gt; 0.5 and sum(rate(http_server_requests_seconds_count{uri="/api/v1/bookings",method="POST"}[1m])) &gt; 1</code>.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<ul>
  <li><strong>Micrometer</strong> — lớp số đo mà Spring dùng; một API, nhiều nơi nhận (Prometheus, OTLP, Datadog…).</li>
  <li><strong>Counter / gauge / timer</strong> — chỉ tăng / giá trị hiện tại đọc khi cần / số lần + tổng thời gian (+ histogram).</li>
  <li><strong>Chuỗi thời gian (time series)</strong> — một tên số đo + một tổ hợp giá trị nhãn.</li>
  <li><strong>Cardinality</strong> — số chuỗi một số đo sinh ra; nhãn có giới hạn giữ nó nhỏ.</li>
  <li><strong>Bucket histogram (<code>le</code>)</strong> — số lần đo dưới một mốc; cộng được qua nhiều instance.</li>
  <li><strong>p95</strong> — giá trị mà 95 % lần đo thấp hơn.</li>
  <li><strong>Scrape</strong> — Prometheus kéo <code>/actuator/prometheus</code> theo lịch.</li>
  <li><strong>Luật cảnh báo, <code>for</code></strong> — điều kiện PromQL phải đúng liên tục một khoảng rồi mới kêu.</li>
</ul>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>http.server.requests có sẵn; counter nghiệp vụ, timer qua Observation và gauge đọc CSDL cho điều sản phẩm cần biết.</li>
  <li>Đã đo: trung bình 73 ms so với p95 1.007 ms; trung bình hai p95 ra 680 ms, cộng bucket ra 354 ms.</li>
  <li>Một nhãn do người dùng điều khiển ⇒ 20.000 chuỗi, trang scrape lớn gấp 31; MeterFilter chặn trần. Tên kết thúc bằng <code>.created</code> bị mất đuôi.</li>
  <li>Cảnh báo theo triệu chứng có <code>for</code>; nạp Grafana từ tệp; Prometheus và Grafana không ra Internet.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.spring.io/spring-boot/reference/actuator/metrics.html', '🍃', 'Spring Boot — Metrics', 'các loại số đo, MeterFilter, percentiles-histogram, Prometheus')}
${tl('https://prometheus.io/docs/practices/histograms/', '🔥', 'Prometheus — Histograms and summaries', 'vì sao bucket gộp được còn phân vị thì không')}
${tl('https://nvd.nist.gov/vuln/detail/CVE-2021-43798', '🛡️', 'NVD — CVE-2021-43798 (Grafana)', 'duyệt đường dẫn không cần đăng nhập, tháng 12/2021')}

<h3>Nguồn</h3>
<ul>
  <li>Aqua Security (Nautilus), 12/2024 — nghiên cứu về khoảng 336.000 máy chủ Prometheus và exporter để ngỏ.</li>
  <li>NVD — <a href="https://nvd.nist.gov/vuln/detail/CVE-2021-43798" target="_blank" rel="noopener">CVE-2021-43798</a>.</li>
  <li>Mọi output: LabFlow (Spring Boot 4.1.2, Micrometer 1.17.2) ×2 + Prometheus 3.16.0 + Grafana 13.2.6 trên máy dựng bài, 24/11/2026.</li>
</ul>
</div>
`;

// ===== Bài 15.3 =====
const MA153_AUTH = java("// identity/internal/AuthController.java\n/** Sai email hay sai mật khẩu đều cùng một câu (không cho dò email). */\n@PostMapping(\"/login\")\nToken dangNhap(@Valid @RequestBody DangNhap r) {\n    Account a = accounts.findByEmail(r.email().trim().toLowerCase())\n        .filter(x -> pe.matches(r.password(), x.getPasswordHash()))\n        .orElseThrow(() -> {\n            thatBai.increment();\n            // ghi email ĐỂ điều tra dò mật khẩu — KHÔNG bao giờ ghi mật khẩu. Email là chữ client gửi ⇒ log phải là JSON (bài 15.3).\n            log.warn(\"đăng nhập thất bại cho {}\", r.email());\n            return new LoiNghiepVu(HttpStatus.UNAUTHORIZED, \"BAD_CREDENTIALS\", \"sai email hoặc mật khẩu\");\n        });\n    // … phát JWT như Chương 9 …\n}");
const MA153_REC = java("/**\n * toString() mặc định của record in MỌI trường — log DEBUG của Spring (\"Read … to [DangNhap[…]]\") sẽ in nguyên mật khẩu (đo ở 15.3).\n * Record nào chứa bí mật đều phải tự viết toString().\n */\nrecord DangNhap(@NotBlank String email, @NotBlank String password) {\n    @Override public String toString() { return \"DangNhap[email=\" + email + \", password=***]\"; }\n}");
const MA153_PAT = props("# Chương 15 (demo): mẫu log ngắn để đọc trên màn hình — 8 ký tự đầu của traceId và requestId (nếu có)\nlogging.pattern.console=%d{HH:mm:ss.SSS} %-5level [%15.15thread] %-17.17logger{0} [%.-8X{traceId}|%.-8X{requestId}] : %msg%n");
const MA153_PROD = props("# prod: log JSON một dòng mỗi sự kiện (ECS) — máy đọc được, chữ người dùng gửi được escape, MDC + traceId thành trường riêng\nlogging.structured.format.console=ecs");
const MA153_QS = java("/** Chương 15: những thứ giúp NHÌN THẤY ứng dụng đang chạy — mã request trong log, trace đi theo cả việc nền. */\n@Configuration\nclass QuanSatCauHinh {\n\n    /**\n     * Mỗi request một mã: nhận X-Request-Id của gateway/frontend nếu HỢP LỆ (chữ, số, gạch; 8–64 ký tự), không thì tự sinh.\n     * Đặt vào MDC ⇒ MỌI dòng log của request mang mã đó; trả lại trong header ⇒ người dùng chép mã gửi hỗ trợ.\n     * Không nhận nguyên văn header: chữ client gửi đi thẳng vào log là chỗ để giả dòng log (log injection).\n     */\n    static final class MaRequest extends OncePerRequestFilter {\n        private static final Pattern HOP_LE = Pattern.compile(\"[A-Za-z0-9-]{8,64}\");\n        private final ObjectProvider<Tracer> tracer;\n        MaRequest(ObjectProvider<Tracer> tracer) { this.tracer = tracer; }\n\n        @Override\n        protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain) throws ServletException, IOException {\n            String id = req.getHeader(\"X-Request-Id\");\n            if (id == null || !HOP_LE.matcher(id).matches()) id = UUID.randomUUID().toString();\n            MDC.put(\"requestId\", id);\n            res.setHeader(\"X-Request-Id\", id);\n            Tracer t = tracer.getIfAvailable();\n            Span s = t == null ? null : t.currentSpan();\n            if (s != null) res.setHeader(\"X-Trace-Id\", s.context().traceId());   // mã để tra trong Jaeger/Grafana\n            try { chain.doFilter(req, res); } finally { MDC.remove(\"requestId\"); }\n        }\n    }\n\n    /** Chạy SAU filter quan sát HTTP của Spring (đã mở span), TRƯỚC Spring Security (để cả 401/403 cũng có mã). */\n    @Bean\n    FilterRegistrationBean<MaRequest> maRequest(ObjectProvider<Tracer> tracer) {\n        FilterRegistrationBean<MaRequest> b = new FilterRegistrationBean<>(new MaRequest(tracer));\n        b.setOrder(Ordered.HIGHEST_PRECEDENCE + 2);\n        return b;\n    }\n\n    /**\n     * Việc nền (@Async, @ApplicationModuleListener) chạy trên luồng khác. Bật spring.task.execution.propagate-context=true\n     * thì Boot gắn ContextPropagatingTaskDecorator: trace hiện tại đi theo việc nền (đo ở bài 15.3).\n     * Nhưng MDC TỰ ĐẶT (requestId, userId) chỉ đi theo nếu được ĐĂNG KÝ với thư viện context-propagation — dòng dưới đây.\n     */\n    QuanSatCauHinh(@Value(\"${labflow.tracing.mdc-propagation:true}\") boolean chepMdc) {\n        // labflow.tracing.mdc-propagation=false chỉ để thấy lỗi ở bài 15.3: luồng nền có traceId nhưng mất requestId\n        if (chepMdc) ContextRegistry.getInstance().registerThreadLocalAccessor(new Slf4jThreadLocalAccessor(\"requestId\", \"userId\"));\n    }\n}");
const MA153_MDC = java("/**\n * Chương 15: sau khi Spring Security đã đọc JWT ⇒ đặt mã TÀI KHOẢN (uid, không phải email) vào MDC.\n * Log của request mang \"userId\" ⇒ trả lời được \"người này gặp lỗi gì lúc 10:05\" mà log không chứa dữ liệu cá nhân.\n * KHÔNG đánh @Component: Boot sẽ đăng ký nó thêm một lần nữa vào chuỗi filter của servlet (chạy hai lần, trước cả Security).\n */\nclass NguoiDungMdc extends OncePerRequestFilter {\n    @Override\n    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain) throws ServletException, IOException {\n        if (SecurityContextHolder.getContext().getAuthentication() != null\n                && SecurityContextHolder.getContext().getAuthentication().getPrincipal() instanceof Jwt j && j.getClaim(\"uid\") != null)\n            MDC.put(\"userId\", String.valueOf(j.<Object>getClaim(\"uid\")));\n        try { chain.doFilter(req, res); } finally { MDC.remove(\"userId\"); }\n    }\n}");
const MA153_PROPS = props("# tracing: mặc định Boot chỉ lấy mẫu 10 % request; gửi span tới bộ thu OTLP (Jaeger/Tempo/Collector)\nmanagement.tracing.sampling.probability=${LABFLOW_TRACE_SAMPLING:0.1}\nmanagement.opentelemetry.tracing.export.otlp.endpoint=${LABFLOW_OTLP_ENDPOINT:http://localhost:4318/v1/traces}");
const MA153_PROPS2 = props("# việc nền (@Async, listener sự kiện) mang theo trace + MDC của request đã sinh ra nó (mặc định false)\nspring.task.execution.propagate-context=true");
const OUT153A = out("## 15.3a — Log chữ thường + chữ client gửi = giả được dòng log\n$ GIA='x@fpt.edu.vn\\n10:31:02.118 INFO  [nio-8080-exec-7] AuthController   [        |        ] : đăng nhập thành công cho manager@fpt.edu.vn'\n\n$ curl -s -o /dev/null -w 'HTTP %{http_code}\\n' -H \"$J\" -d \"{\\\"email\\\":\\\"$GIA\\\",\\\"password\\\":\\\"doan-thu-123\\\"}\" $API/api/v1/auth/login\nHTTP 401\n\n$ docker logs labflow | grep -B0 -A1 'đăng nhập thất bại' | tail -2 | cut -c1-160\n14:55:52.531 WARN  [nio-8080-exec-3] AuthController   [4a94424f|c404327b] : đăng nhập thất bại cho x@fpt.edu.vn\n10:31:02.118 INFO  [nio-8080-exec-7] AuthController   [        |        ] : đăng nhập thành công cho manager@fpt.edu.vn\n\n## Cùng request khi log là JSON (profile prod: logging.structured.format.console=ecs)\n$ curl -s -o /dev/null -w 'HTTP %{http_code}\\n' -H \"$J\" -d \"{\\\"email\\\":\\\"$GIA\\\",\\\"password\\\":\\\"doan-thu-123\\\"}\" $API/api/v1/auth/login\nHTTP 401\n\n$ docker logs labflow | grep 'đăng nhập thất bại' | tail -1 | jq .\n{\n  \"@timestamp\": \"2026-11-24T14:56:07.839732797Z\",\n  \"log\": {\n    \"level\": \"WARN\",\n    \"logger\": \"vn.labflow.identity.internal.AuthController\"\n  },\n  \"process\": {\n    \"pid\": 1,\n    \"thread\": {\n      \"name\": \"http-nio-8080-exec-1\"\n    }\n  },\n  \"service\": {\n    \"name\": \"labflow\",\n    \"node\": {}\n  },\n  \"message\": \"đăng nhập thất bại cho x@fpt.edu.vn\\n10:31:02.118 INFO  [nio-8080-exec-7] AuthController   [        |        ] : đăng nhập thành công cho manager@fpt.edu.vn\",\n  \"traceId\": \"1eaf43b395a9e73f79f4289355376feb\",\n  \"spanId\": \"95a5fa08a66c761c\",\n  \"requestId\": \"3c45efa9-88e1-4bab-bf57-442bb3019ccb\",\n  \"ecs\": {\n    \"version\": \"8.11\"\n  }\n}");
const OUT153B = out("## 15.3b — Mã request và traceId: tìm MỌI dòng log của một request, kể cả việc chạy nền sau đó\n## Lượt 1: mặc định của Boot (spring.task.execution.propagate-context=false), chưa có Spring Modulith insight\n$ TA=$(tok an@fpt.edu.vn)\n\n$ curl -s -D - -o /dev/null -H \"Authorization: Bearer $TA\" -H \"$J\" -H \"Idempotency-Key: k-an-00000001\" -H \"X-Request-Id: ho-tro-2611-0001\" -d '{\"labCode\":\"NET-02\",\"startAt\":\"2026-12-02T08:00\",\"endAt\":\"2026-12-02T10:00\",\"purpose\":\"do an\"}' $API/api/v1/bookings | grep -i '^HTTP\\|x-request-id\\|x-trace-id'\nHTTP/1.1 201 \r\nX-Request-Id: ho-tro-2611-0001\r\nX-Trace-Id: 840173acc96c09dbf4b18cd77b232fc5\r\n\n$ docker logs labflow | grep -E 'đặt lượt|email giả' | tail -2 | cut -c1-170\n15:05:13.733 INFO  [nio-8080-exec-4] BookingController [840173ac|ho-tro-2] : đặt lượt #1 phòng NET-02 trạng thái CONFIRMED\n15:05:13.743 INFO  [         task-2] ThongBao          [|] : [email giả] tới tài khoản 2: Đã giữ phòng NET-02 2026-12-02T08:00 → 10:00\n\n## Lượt 1b: propagate-context=true nhưng CHƯA đăng ký requestId với context-propagation\n$ TA=$(tok an@fpt.edu.vn)\n\n$ curl -s -o /dev/null -w 'HTTP %{http_code}\\n' -H \"Authorization: Bearer $TA\" -H \"$J\" -H \"Idempotency-Key: k-an-0000001b\" -H \"X-Request-Id: ho-tro-2611-001b\" -d '{\"labCode\":\"NET-02\",\"startAt\":\"2026-12-04T08:00\",\"endAt\":\"2026-12-04T09:00\",\"purpose\":\"do an\"}' $API/api/v1/bookings\nHTTP 201\n\n$ docker logs labflow | grep -E 'đặt lượt|email giả' | tail -2 | cut -c1-170\n15:05:34.776 INFO  [nio-8080-exec-2] BookingController [da26f887|ho-tro-2] : đặt lượt #2 phòng NET-02 trạng thái CONFIRMED\n15:05:34.795 INFO  [         task-1] ThongBao          [da26f887|] : [email giả] tới tài khoản 2: Đã giữ phòng NET-02 2026-12-04T08:00 → 09:00\n\n## Lượt 2: cấu hình của LabFlow — propagate-context=true + đăng ký requestId/userId với context-propagation\n$ TA=$(tok an@fpt.edu.vn)\n\n$ curl -s -D - -o /dev/null -H \"Authorization: Bearer $TA\" -H \"$J\" -H \"Idempotency-Key: k-an-00000002\" -H \"X-Request-Id: ho-tro-2611-0002\" -d '{\"labCode\":\"NET-02\",\"startAt\":\"2026-12-03T08:00\",\"endAt\":\"2026-12-03T10:00\",\"purpose\":\"do an\"}' $API/api/v1/bookings | grep -i '^HTTP\\|x-request-id\\|x-trace-id'\nHTTP/1.1 201 \r\nX-Request-Id: ho-tro-2611-0002\r\nX-Trace-Id: b3c166cab0bd8dfeafb9198856f6d562\r\n\n$ docker logs labflow | grep -E 'đặt lượt|email giả' | tail -2 | cut -c1-170\n15:05:54.621 INFO  [nio-8080-exec-2] BookingController [b3c166ca|ho-tro-2] : đặt lượt #3 phòng NET-02 trạng thái CONFIRMED\n15:05:54.633 INFO  [         task-1] ThongBao          [b3c166ca|ho-tro-2] : [email giả] tới tài khoản 2: Đã giữ phòng NET-02 2026-12-03T08:00 → 10:00\n\n## X-Request-Id không hợp lệ (có dấu cách, dấu ;) bị thay bằng mã tự sinh\n$ curl -s -D - -o /dev/null -H 'X-Request-Id: abc def;rm -rf' $API/api/v1/labs | grep -i 'x-request-id'\nX-Request-Id: e5fc1608-e4d7-4370-a25d-7509c5726d48\r\n\n## Lượt 3: tắt propagate-context nhưng CÓ spring-modulith-starter-insight — nó tự gắn ContextPropagatingTaskDecorator vào executor\n$ TA=$(tok an@fpt.edu.vn)\n\n$ curl -s -o /dev/null -w 'HTTP %{http_code}\\n' -H \"Authorization: Bearer $TA\" -H \"$J\" -H \"Idempotency-Key: k-an-00000003\" -H \"X-Request-Id: ho-tro-2611-0003\" -d '{\"labCode\":\"IOT-01\",\"startAt\":\"2026-12-04T13:00\",\"endAt\":\"2026-12-04T14:00\",\"purpose\":\"do an\"}' $API/api/v1/bookings\nHTTP 201\n\n$ docker logs labflow | grep -E 'đặt lượt|email giả' | tail -2 | cut -c1-170\n15:06:14.827 INFO  [nio-8080-exec-3] BookingController [76624a1c|ho-tro-2] : đặt lượt #4 phòng IOT-01 trạng thái CONFIRMED\n15:06:14.882 INFO  [         task-1] ThongBao          [76624a1c|ho-tro-2] : [email giả] tới tài khoản 2: Đã giữ phòng IOT-01 2026-12-04T13:00 → 14:00");
const OUT153C = out("## 15.3c — Lấy mẫu: mặc định Boot chỉ giữ 10 % trace\n$ for i in $(seq 200); do curl -s -o /dev/null $API/api/v1/labs; done\n\n$ echo \"200 request GET /api/v1/labs ⇒ Jaeger có $(JQ 'http%20get%20%2Fapi%2Fv1%2Flabs') trace\"\n200 request GET /api/v1/labs ⇒ Jaeger có 19 trace\n\n## management.tracing.sampling.probability=1.0\n$ for i in $(seq 200); do curl -s -o /dev/null $API/api/v1/labs; done\n\n$ echo \"200 request GET /api/v1/labs ⇒ Jaeger có $(JQ 'http%20get%20%2Fapi%2Fv1%2Flabs') trace\"\n200 request GET /api/v1/labs ⇒ Jaeger có 200 trace\n\n## Một lượt đặt phòng MỚI, xem trong Jaeger (lượt thứ hai — lượt đầu tiên sau khởi động còn trả giá làm nóng JVM)\n$ TID=$(curl -s -D - -o /dev/null -H \"Authorization: Bearer $TA\" -H \"$J\" -H \"Idempotency-Key: k-an-$(date +%s%N | tail -c 9)\" -d \"{\\\"labCode\\\":\\\"HW-04\\\",\\\"startAt\\\":\\\"${N}T$H:00\\\",\\\"endAt\\\":\\\"${N}T$H:30\\\",\\\"purpose\\\":\\\"do an\\\"}\" $API/api/v1/bookings | tr -d '\\r' | awk '/^HTTP/{printf \"%s \", $2} /^X-Trace-Id/{print $2}' | tee /tmp/tid | cut -d' ' -f2); cat /tmp/tid\n201 58e0afe59846174f408c78d6114ffc5a\n\n$ curl -s \"http://localhost:16686/api/v3/traces/$TID\" | python3 t/cay.py\n31 span · bắt đầu  · kéo dài\n    0.0 ms    41.8 ms  http post /api/v1/bookings · /api/v1/bookings\n    0.2 ms     1.1 ms    security filterchain before\n    0.5 ms     0.6 ms      authenticate bearertoken\n    1.1 ms     0.1 ms      authorize request\n    1.3 ms    40.4 ms    secured request\n    2.2 ms    38.6 ms      Booking > v.l.b.internal.BookingController.dat(o.s.s.o.j.Jwt, j.l.String, v.l.b.internal.BookingController.DatRequest) · booking\n    2.3 ms     0.8 ms        Shared > v.l.s.GioiHan.kiem(j.l.String, j.l.String, int, j.t.Duration) · shared\n    2.6 ms     0.4 ms          evalsha · shared\n    3.1 ms    37.5 ms        labflow.booking.create · booking\n    3.3 ms    37.2 ms          connection\n    3.6 ms     0.3 ms          query · select pg_advisory_xact_lock(?)\n    3.9 ms     0.1 ms          result-set\n    4.7 ms     0.3 ms          query · select b1_0.id,b1_0.end_at,b1_0.idempotency_key,b1_0.lab_id,b1_0.owner\n    5.1 ms     0.1 ms          result-set\n    5.4 ms     4.4 ms          Catalog > v.l.c.internal.LabCatalogImpl.timTheoMa(j.l.String) · catalog\n    5.7 ms     0.3 ms            get · catalog\n    7.5 ms     0.4 ms            query · select l1_0.id,l1_0.building,l1_0.capacity,l1_0.code,l1_0.name,l1_0.re\n    8.0 ms     0.3 ms            result-set\n   10.6 ms     0.5 ms          query · select coalesce(sum(extract(epoch from b1_0.end_at-b1_0.start_at)/60),\n   11.2 ms     0.1 ms          result-set\n   12.0 ms     0.4 ms          query · insert into bookings (end_at,idempotency_key,lab_id,owner_id,purpose,r\n   12.6 ms     0.3 ms          generated-keys\n   13.6 ms     0.3 ms          query · INSERT INTO EVENT_PUBLICATION (ID, EVENT_TYPE, LISTENER_ID, PUBLICATIO\n   40.6 ms     8.9 ms          Notification > v.l.n.internal.ThongBao.khiDat(v.l.b.BookingCreated) · notification\n   40.9 ms     3.0 ms            connection · notification\n   41.3 ms     0.5 ms            query · UPDATE EVENT_PUBLICATION SET STATUS = 'PROCESSING' WHERE ID = ? AND CO\n   44.0 ms     2.8 ms            connection · notification\n   44.5 ms     0.4 ms            query · insert into notifications (account_id, booking_id, kind, message) valu\n   47.0 ms     2.4 ms            connection · notification\n   47.5 ms     0.4 ms            query · UPDATE EVENT_PUBLICATION SET STATUS = 'COMPLETED', COMPLETION_DATE = ?\n   41.6 ms     0.1 ms    security filterchain after");
const OUT153D = out("## 15.3d — \"Bật DEBUG cho dễ tìm lỗi\" trên LabFlow: log in ra những gì?\n$ TA=$(tok an@fpt.edu.vn)\n\n$ docker logs labflow | grep \"$MAT_KHAU_SV\" | sed \"s/$MAT_KHAU_SV/<MẬT-KHẨU-THẬT>/g\" | cut -c1-200\n15:24:05.916 DEBUG [nio-8080-exec-1] dyMethodProcessor [0c097c3a|6f79f094] : Read \"application/json;charset=UTF-8\" to [DangNhap[email=an@fpt.edu.vn, password=<MẬT-KHẨU-THẬT>]]\n\n## Thêm spring.mvc.log-request-details=true và TRACE cho DispatcherServlet\n$ TA=$(tok an@fpt.edu.vn)\n\n$ curl -s -o /dev/null -H \"Authorization: Bearer $TA\" \"$API/api/v1/bookings/mine?page=0\"\n\n$ docker logs labflow | grep -o 'GET \"/api/v1/bookings/mine.*' | tail -1 | sed -E 's/(Bearer [A-Za-z0-9_-]{12})[A-Za-z0-9._-]*/\\1…(đủ token)/'\nGET \"/api/v1/bookings/mine?page=0\", parameters={page:[0]}, headers={Host:[localhost:8080], User-Agent:[curl/8.18.0], Accept:[*/*], Authorization:[Bearer eyJhbGciOiJI…(đủ token)]} in DispatcherServlet 'dispatcherServlet'\n\n$ docker logs labflow | grep -c 'Bearer eyJ' | sed 's/^/số dòng log chứa nguyên JWT: /'\nsố dòng log chứa nguyên JWT: 1\n\n## Sau khi DangNhap/DangKy tự viết toString(): cùng log DEBUG\n$ TA=$(tok an@fpt.edu.vn)\n\n$ docker logs labflow | grep 'to \\[DangNhap' | tail -1 | cut -c1-200\n15:27:23.258 DEBUG [nio-8080-exec-1] dyMethodProcessor [0c3ed1a1|3a55b38e] : Read \"application/json;charset=UTF-8\" to [DangNhap[email=an@fpt.edu.vn, password=***]]\n\n$ docker logs labflow | grep -c \"$MAT_KHAU_SV\" | sed 's/^/số dòng log chứa mật khẩu sinh viên: /'\nsố dòng log chứa mật khẩu sinh viên: 0");
const OUT153E = out("$ mvn dependency:tree -Dincludes=org.apache.logging.log4j,ch.qos.logback\nvn.labflow:labflow-api:jar:1.0.0\n   \\- org.springframework.boot:spring-boot-starter:jar:4.1.2:compile\n      \\- org.springframework.boot:spring-boot-starter-logging:jar:4.1.2:compile\n         +- ch.qos.logback:logback-classic:jar:1.5.38:compile\n         |  \\- ch.qos.logback:logback-core:jar:1.5.38:compile\n         \\- org.apache.logging.log4j:log4j-to-slf4j:jar:2.25.5:compile\n            \\- org.apache.logging.log4j:log4j-api:jar:2.25.5:compile\n\n$ ls target/dep | grep -i \"log4j\\|logback\"\nlog4j-api-2.25.5.jar\nlog4j-to-slf4j-2.25.5.jar\nlogback-classic-1.5.38.jar\nlogback-core-1.5.38.jar");

const MA153_POM = xml(`<!-- Chương 15: số đo Prometheus, tracing OpenTelemetry (OTLP), span cho từng câu SQL, span theo module -->
<dependency><groupId>io.micrometer</groupId><artifactId>micrometer-registry-prometheus</artifactId></dependency>
<dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-opentelemetry</artifactId></dependency>
<dependency><groupId>net.ttddyy.observation</groupId><artifactId>datasource-micrometer-spring-boot</artifactId><version>2.3.1</version></dependency>
<dependency><groupId>org.springframework.modulith</groupId><artifactId>spring-modulith-starter-insight</artifactId><scope>runtime</scope></dependency>`);

const L153_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.3 · Observability</span>
<h2>Structured logs and tracing</h2>
<p class="lead">Metrics say "p95 jumped at 10:05". Now you need the story of <em>one</em> request: which user, which lab, which SQL, which background job sent the email. Logs and traces tell that story — if every line carries the same request id and trace id, if the format can be read by a machine, and if nothing secret ends up inside. In this lesson a student forges a log line through the email field, a background job loses track of the request that created it (four measured variants), Boot keeps only 10 % of traces by default, and Spring's own DEBUG log prints a real password.</p>

<h3>Everyday picture first</h3>
<p>At a clinic you get a ticket number at the door. The receptionist, the nurse, the lab and the pharmacy all write that number next to what they did. When you complain about a wrong prescription, the clinic looks up one number and reads the whole visit in order. A request id is that ticket; a trace is the clinic's timeline of the visit, with how long each room took. And the clinic's notebook should never contain your bank PIN, even if you said it out loud at the counter.</p>

<h3>1. Plain text logs can be forged</h3>
<p>LabFlow logs every failed login with the email — useful when someone is guessing passwords:</p>
${MA153_AUTH}
<p>The email comes from the client. The demo profile uses a readable one-line pattern:</p>
${MA153_PAT}
${OUT153A}
<ul>
  <li><strong>Plain text</strong>: the JSON string contained <code>\\n</code>, Logback wrote it as a real newline, and the second line — "login succeeded for manager@fpt.edu.vn" at 10:31 — is indistinguishable from a real one. Anyone reading the log, or a tool that parses lines, is fooled. This is <strong>log injection</strong> (CWE-117): hide an attack, frame another user, break the parser.</li>
  <li><strong>JSON (ECS)</strong>: Boot 3.4+ writes structured logs with one property — the same attack becomes one JSON line, with the newline escaped inside <code>message</code>. You also get, for free, separate fields for level, logger, thread, <code>traceId</code>, <code>spanId</code> and our <code>requestId</code> from MDC. Log platforms (Loki, Elasticsearch, CloudWatch) index these fields — you search <code>requestId="…"</code> instead of grepping.</li>
</ul>
${MA153_PROD}
<p>Boot ships three formats: <code>ecs</code> (Elastic), <code>logstash</code>, <code>gelf</code> (Graylog). Keep the readable pattern for your terminal in dev; use JSON wherever a machine reads the logs.</p>

<h3>2. One id per request: MDC</h3>
<p>MDC (Mapped Diagnostic Context) is a small map attached to the current thread; Logback prints its entries with every log line. A filter fills it at the start of the request and clears it at the end:</p>
${MA153_QS}
<ul>
  <li>The filter accepts an incoming <code>X-Request-Id</code> only if it matches <code>[A-Za-z0-9-]{8,64}</code> — otherwise the id itself would be a log-injection channel. It returns the id (and the trace id) in response headers, so support can ask the user "send me the X-Request-Id".</li>
  <li><code>finally { MDC.remove(…) }</code> matters: Tomcat reuses threads; without it the next request on that thread inherits the previous user's id.</li>
</ul>
<p>The user id is added after Spring Security has read the JWT — the account id, not the email, so logs identify a person without storing personal data in every line:</p>
${MA153_MDC}

<h3>3. Traces: the timeline of one request</h3>
<p>A <strong>trace</strong> is one request's journey; it is made of <strong>spans</strong> (one unit of work each: the HTTP handler, a security filter, a SQL query, a module call), linked by parent ids, all sharing one <strong>traceId</strong>. Between services the context travels in the W3C <code>traceparent</code> header. Four dependencies give LabFlow tracing without hand-written spans:</p>
${MA153_POM}
<ul>
  <li><code>spring-boot-starter-opentelemetry</code> — Micrometer Tracing bridged to OpenTelemetry, exporting spans over OTLP. It also pushes metrics over OTLP every minute by default; LabFlow is scraped by Prometheus, so we set <code>management.otlp.metrics.export.enabled=false</code>.</li>
  <li><code>datasource-micrometer-spring-boot</code> — a span for every JDBC connection, query and result set.</li>
  <li><code>spring-modulith-starter-insight</code> — a span each time a call enters another module (booking → catalog → notification).</li>
</ul>
${MA153_PROPS}
<p>Jaeger (one container, in-memory, receives OTLP on 4318) stores and shows the traces. First, the sampling default:</p>
${OUT153C}
<ul>
  <li><strong>Default sampling is 10 %</strong>: 200 requests ⇒ 19 traces in Jaeger. The other 181 still had a trace id (it is in the logs and the <code>X-Trace-Id</code> header) but no spans were exported — a student's "request <code>58e0…</code> failed" may have nothing in Jaeger. Use 1.0 in dev and for low traffic; in production choose the rate on purpose (cost vs coverage), or sample at a collector after the fact.</li>
  <li><strong>The booking trace</strong> (31 spans, 41.8 ms) reads like the code: security filters 1.1 ms → rate limiter in Redis (<code>evalsha</code>, Chapter 13) 0.4 ms → our <code>labflow.booking.create</code> Observation → <code>pg_advisory_xact_lock</code>, the Idempotency-Key lookup, the catalog module (a cache <code>get</code>, then SQL), the weekly quota query, <code>insert into bookings</code>, <code>INSERT INTO EVENT_PUBLICATION</code> (Chapter 14's event log) — then, at 40.6 ms, <strong>after commit, on another thread</strong>, the notification module marks the event PROCESSING, inserts the notification and marks it COMPLETED. One picture shows the module boundaries, every SQL statement and what ran asynchronously.</li>
</ul>
<p>When a booking is slow, you no longer guess "the database, probably": the longest span tells you.</p>

<h3>4. The background thread forgets — four measured variants</h3>
<p>The email in LabFlow is sent by <code>@ApplicationModuleListener</code> on a task executor thread (Chapter 14). Trace and MDC live in thread-locals of the <em>request</em> thread. Do they follow? We booked with <code>X-Request-Id: ho-tro-2611-…</code> in four configurations and read the two log lines of each booking:</p>
${OUT153B}
<ul>
  <li><strong>Run 1 — Boot defaults, no Modulith insight</strong>: the request line has <code>[840173ac|ho-tro-2]</code>, the email line on <code>task-2</code> has <code>[|]</code>. The email is orphaned: you cannot connect "email failed" to the booking that caused it. <code>spring.task.execution.propagate-context</code> defaults to <code>false</code>.</li>
  <li><strong>Run 1b — <code>propagate-context=true</code></strong>: Boot adds a <code>ContextPropagatingTaskDecorator</code>; the trace id follows (<code>[da26f887|]</code>) — but <strong>requestId does not</strong>. The decorator only copies what is registered with the context-propagation library; tracing registers itself, your own MDC keys do not.</li>
  <li><strong>Run 2 — LabFlow's configuration</strong>: register <code>Slf4jThreadLocalAccessor("requestId", "userId")</code> (the constructor of <code>QuanSatCauHinh</code> above) ⇒ <code>[b3c166ca|ho-tro-2]</code> on both lines.</li>
  <li><strong>Run 3 — <code>propagate-context=false</code> but with <code>spring-modulith-starter-insight</code></strong>: everything is propagated anyway. We disassembled the starter's auto-configuration: it installs its own <code>ContextPropagatingTaskDecorator</code> on the executor through a customizer — calling <code>setTaskDecorator</code>, which <strong>replaces</strong> any decorator you configured (such as the security-context decorator from lesson 14.1). Know what your starters do to shared beans.</li>
</ul>
${MA153_PROPS2}

<h3>5. What must never be in a log</h3>
<p>"Turn on DEBUG to find the bug" is a normal day at work. Let's see what Spring prints:</p>
${OUT153D}
<ul>
  <li><strong>DEBUG for <code>web</code></strong> prints the deserialized body: <code>DangNhap[email=…, password=&lt;the real password&gt;]</code>. A Java record's generated <code>toString()</code> includes every field. Nobody wrote "log the password" — it happened.</li>
  <li><strong><code>spring.mvc.log-request-details=true</code> + TRACE</strong> prints every header, including the full <code>Authorization: Bearer eyJ…</code>. Anyone with read access to logs can now act as that user until the token expires. By default Spring masks them (<code>parameters={masked}</code>) — the property exists for local debugging only.</li>
  <li>Fix: every record that carries a secret overrides <code>toString()</code>; after the change the same DEBUG line shows <code>password=***</code> and the count of lines with the password drops to 0.</li>
</ul>
${MA153_REC}
<p>And the most famous logging bug of all — is LabFlow exposed?</p>
${OUT153E}
<p>Spring Boot logs through <strong>Logback</strong>. The two Log4j jars are <code>log4j-api</code> plus <code>log4j-to-slf4j</code>, a bridge that forwards Log4j API calls into SLF4J/Logback. Log4Shell lived in <code>log4j-core</code>, which is not here — unless someone swaps in <code>spring-boot-starter-log4j2</code>.</p>

<h3>🕵️ Hacker corner — Log4Shell (2021) and passwords in logs (Twitter, GitHub 2018)</h3>
<ul>
  <li><strong>Log4Shell, CVE-2021-44228 (December 2021)</strong>: Log4j 2 interpreted <code>\${jndi:ldap://…}</code> inside logged strings and loaded remote code. Logging a user-agent, a username or a chat message was enough for remote code execution — Minecraft servers, iCloud, Steam and countless internal systems were hit within days. The lesson is the same as section 1: <em>logged text is attacker input</em>. Spring's guidance at the time: Boot's default Logback setup was not affected.</li>
  <li><strong>Twitter, May 2018</strong>: a bug wrote passwords to an internal log before hashing; Twitter asked all its users (over 300 million) to consider changing passwords. <strong>GitHub, the same month</strong>: plaintext passwords of a small number of users appeared in internal logs after a password reset. Neither was a "hack" — exactly like section 5.</li>
  <li><strong>Prevention</strong>: JSON logs; never log request bodies, headers or secrets; mask in <code>toString()</code>; DEBUG/TRACE only locally; restrict who can read production logs; keep logging libraries patched and know which ones you ship (<code>mvn dependency:tree</code>, the SBOM from lesson 15.1).</li>
</ul>

<h3>Compared with Node.js</h3>
<p>Node's usual stack: <strong>pino</strong> for JSON logs (with <code>redact: ['req.headers.authorization', '*.password']</code>), <strong>AsyncLocalStorage</strong> to carry a request id through async calls (Node's equivalent of MDC — and it follows <code>await</code> automatically, so section 4's problem appears only with worker threads or queues), and the <strong>OpenTelemetry Node SDK</strong> with auto-instrumentation for http, express, pg. The traceparent header, OTLP and Jaeger are identical — a Spring service and a Node service show up in the same trace.</p>

<h3>At work</h3>
<ul>
  <li>"Customer support sent a screenshot of an error" — if your error page or ProblemDetail shows the request id, you find the logs in seconds.</li>
  <li>Many companies forbid logging personal data (email, phone) in plain text; a user id plus a separate lookup is the usual compromise.</li>
  <li>Expect a code review comment on any new <code>log.debug(object)</code> where the object might contain a token.</li>
</ul>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"How do you find all logs of one failing request across services?"</strong> — Trace id propagated via <code>traceparent</code>, in MDC on every line, JSON logs indexed by trace id; return the id to the client for support.</li>
  <li><strong>"Logs, metrics, traces — when do you use which?"</strong> — Metrics to detect and alert (cheap, aggregated), traces to locate where time goes in one request, logs for the details of what happened.</li>
  <li><strong>"Your async job logs have no trace id. Why, and how do you fix it?"</strong> — Thread-locals do not cross thread pools; context propagation via a TaskDecorator (<code>spring.task.execution.propagate-context=true</code>) and registering custom MDC keys.</li>
  <li><strong>"What should never be logged?"</strong> — Passwords, tokens, full card numbers, secrets, request bodies/headers wholesale; mention the record <code>toString()</code> trap and Log4Shell as why logged input is dangerous.</li>
</ol>

<h3>🧪 Practice (25 minutes)</h3>
<ol>
  <li>Add a log line when a manager rejects a booking, so that support can answer "who rejected my booking and why" — without logging the student's email. What goes in the message, what in MDC?</li>
  <li>With sampling at 0.1, a student reports request id <code>ho-tro-2611-0042</code> failed. Which of logs / metrics / Jaeger will certainly have it, and which might not?</li>
  <li>Find another place in LabFlow where a record or entity <code>toString()</code> could print something sensitive at DEBUG level.</li>
</ol>
${giai('Show the answers', `<p>1. <code>log.info("từ chối lượt #{} phòng {}: {}", id, labCode, lyDo)</code> in the service — userId (the manager) and requestId are already in MDC; the student's identity is the booking's owner id in the database, no email in the line. Keep the reason short and do not log free text you did not validate (or rely on JSON escaping).</p><p>2. Logs — always (every line has requestId and traceId). Metrics — the request is counted, but not individually. Jaeger — only if that trace was sampled (10 % chance); the trace id is still in the logs to try.</p><p>3. <code>DangKy</code> (password — fixed together with <code>DangNhap</code>), any record holding a JWT or refresh token, and JPA entities such as <code>Account</code> if someone adds a Lombok <code>@Data</code>/<code>@ToString</code> that includes <code>passwordHash</code>.</p>`)}

<h3>🗂 Key terms</h3>
<ul>
  <li><strong>Structured logging</strong> — one machine-readable record (JSON) per event; Boot: <code>logging.structured.format.console=ecs|logstash|gelf</code>.</li>
  <li><strong>Log injection (CWE-117)</strong> — forging or corrupting log entries through unescaped user input.</li>
  <li><strong>MDC</strong> — per-thread key-value context printed with every log line.</li>
  <li><strong>Trace / span / traceId / spanId</strong> — one request's journey / one unit of work in it / their identifiers.</li>
  <li><strong>traceparent</strong> — W3C header carrying trace context between services.</li>
  <li><strong>OTLP</strong> — OpenTelemetry's protocol for sending spans, metrics and logs to a collector.</li>
  <li><strong>Sampling probability</strong> — share of traces exported (Boot default 0.1).</li>
  <li><strong>Context propagation</strong> — copying trace/MDC thread-locals to the thread that runs async work.</li>
</ul>

<h3>📌 Summary</h3>
<ul>
  <li>JSON logs turn a forged line into one escaped field; MDC gives every line requestId and userId.</li>
  <li>A real booking trace: 31 spans, every SQL statement, module boundaries and the after-commit email on another thread.</li>
  <li>Measured: 10 % sampling by default; async work loses trace and MDC unless context propagation is on and custom keys are registered — and a starter can switch it on behind your back.</li>
  <li>DEBUG printed a real password from a record's <code>toString()</code> and a full JWT from headers; fixed and re-measured to 0.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.spring.io/spring-boot/reference/features/logging.html', '🍃', 'Spring Boot — Logging', 'structured logging, formats, MDC, log groups')}
${tl('https://docs.spring.io/spring-boot/reference/actuator/tracing.html', '🧭', 'Spring Boot — Tracing', 'Micrometer Tracing, OpenTelemetry, sampling, propagation')}
${tl('https://spring.io/blog/2021/12/10/log4j2-vulnerability-and-spring-boot', '🛡️', 'Spring — Log4J2 vulnerability and Spring Boot', 'why the default Logback setup was not affected')}

<h3>Sources</h3>
<ul>
  <li>MITRE — <a href="https://cwe.mitre.org/data/definitions/117.html" target="_blank" rel="noopener">CWE-117: Improper Output Neutralization for Logs</a>.</li>
  <li>Spring Blog, 10/12/2021 — <a href="https://spring.io/blog/2021/12/10/log4j2-vulnerability-and-spring-boot" target="_blank" rel="noopener">Log4J2 Vulnerability and Spring Boot</a>.</li>
  <li>Twitter and GitHub disclosures, May 2018 (passwords written to internal logs).</li>
  <li>All outputs: LabFlow (Spring Boot 4.1.2, Micrometer Tracing 1.7.2, OpenTelemetry 1.62.0, Spring Modulith 2.1.3) + Jaeger 2.23.0 on the course machine, 24/11/2026.</li>
</ul>
</div>
`;

const L153_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.3 · Quan sát hệ thống</span>
<h2>Log có cấu trúc và tracing</h2>
<p class="lead">Số đo nói "p95 vọt lên lúc 10:05". Giờ bạn cần câu chuyện của <em>một</em> request: người dùng nào, phòng nào, câu SQL nào, việc nền nào gửi email. Log và trace kể câu chuyện đó — nếu mọi dòng mang cùng mã request và mã trace, nếu định dạng máy đọc được, và nếu không có bí mật nào lọt vào. Trong bài này một sinh viên giả dòng log qua ô email, một việc nền quên mất request đã sinh ra nó (bốn biến thể đã đo), Boot mặc định chỉ giữ 10 % trace, và chính log DEBUG của Spring in ra một mật khẩu thật.</p>

<h3>Đời thường trước đã</h3>
<p>Tới phòng khám bạn nhận một số thứ tự ở cửa. Lễ tân, y tá, phòng xét nghiệm, quầy thuốc đều ghi số đó cạnh việc họ làm. Khi bạn khiếu nại đơn thuốc sai, phòng khám tra một con số là đọc được cả lượt khám theo thứ tự. Mã request là số thứ tự đó; trace là dòng thời gian của lượt khám, kèm mỗi phòng mất bao lâu. Và sổ của phòng khám không bao giờ được chứa mã PIN ngân hàng của bạn, kể cả khi bạn lỡ đọc to ở quầy.</p>

<h3>1. Log chữ thường bị giả được</h3>
<p>LabFlow ghi log mọi lần đăng nhập thất bại kèm email — có ích khi có người dò mật khẩu:</p>
${MA153_AUTH}
<p>Email là do client gửi. Profile demo dùng mẫu một dòng dễ đọc:</p>
${MA153_PAT}
${OUT153A}
<ul>
  <li><strong>Chữ thường</strong>: chuỗi JSON chứa <code>\\n</code>, Logback ghi nó thành dấu xuống dòng thật, và dòng thứ hai — "đăng nhập thành công cho manager@fpt.edu.vn" lúc 10:31 — không phân biệt được với dòng thật. Người đọc log, hay công cụ tách từng dòng, đều bị lừa. Đây là <strong>log injection</strong> (CWE-117): giấu dấu vết tấn công, đổ tội cho người khác, làm hỏng bộ đọc log.</li>
  <li><strong>JSON (ECS)</strong>: từ Boot 3.4, một thuộc tính là có log có cấu trúc — cùng đòn tấn công thành một dòng JSON, dấu xuống dòng bị escape bên trong <code>message</code>. Bạn còn được thêm miễn phí các trường riêng cho level, logger, luồng, <code>traceId</code>, <code>spanId</code> và <code>requestId</code> của ta từ MDC. Nền tảng log (Loki, Elasticsearch, CloudWatch) đánh chỉ mục các trường này — bạn tìm <code>requestId="…"</code> thay vì grep.</li>
</ul>
${MA153_PROD}
<p>Boot có sẵn ba định dạng: <code>ecs</code> (Elastic), <code>logstash</code>, <code>gelf</code> (Graylog). Giữ mẫu dễ đọc cho terminal khi phát triển; dùng JSON ở mọi nơi máy đọc log.</p>

<h3>2. Mỗi request một mã: MDC</h3>
<p>MDC (Mapped Diagnostic Context) là một bảng nhỏ gắn với luồng hiện tại; Logback in các mục của nó cùng mọi dòng log. Một filter điền vào lúc request bắt đầu và xoá lúc kết thúc:</p>
${MA153_QS}
<ul>
  <li>Filter chỉ nhận <code>X-Request-Id</code> gửi tới nếu khớp <code>[A-Za-z0-9-]{8,64}</code> — nếu không, chính cái mã đó thành kênh log injection. Nó trả mã (và mã trace) trong header phản hồi, để bộ phận hỗ trợ bảo người dùng "gửi tôi X-Request-Id".</li>
  <li><code>finally { MDC.remove(…) }</code> rất quan trọng: Tomcat dùng lại luồng; thiếu nó, request kế tiếp trên luồng đó thừa hưởng mã của người dùng trước.</li>
</ul>
<p>Mã người dùng được thêm sau khi Spring Security đã đọc JWT — mã tài khoản, không phải email, để log nhận ra một người mà không chứa dữ liệu cá nhân ở mọi dòng:</p>
${MA153_MDC}

<h3>3. Trace: dòng thời gian của một request</h3>
<p>Một <strong>trace</strong> là hành trình của một request; nó gồm các <strong>span</strong> (mỗi span một phần việc: handler HTTP, một filter bảo mật, một câu SQL, một lần gọi sang module khác), nối với nhau bằng mã cha, cùng chung một <strong>traceId</strong>. Giữa các dịch vụ, ngữ cảnh đi trong header W3C <code>traceparent</code>. Bốn phụ thuộc cho LabFlow tracing mà không phải tự viết span:</p>
${MA153_POM}
<ul>
  <li><code>spring-boot-starter-opentelemetry</code> — Micrometer Tracing nối sang OpenTelemetry, gửi span qua OTLP. Nó còn mặc định đẩy số đo qua OTLP mỗi phút; LabFlow được Prometheus scrape nên ta đặt <code>management.otlp.metrics.export.enabled=false</code>.</li>
  <li><code>datasource-micrometer-spring-boot</code> — một span cho mỗi kết nối JDBC, câu truy vấn và tập kết quả.</li>
  <li><code>spring-modulith-starter-insight</code> — một span mỗi khi lời gọi đi vào module khác (booking → catalog → notification).</li>
</ul>
${MA153_PROPS}
<p>Jaeger (một container, lưu trong bộ nhớ, nhận OTLP ở cổng 4318) lưu và hiển thị trace. Trước hết, mặc định lấy mẫu:</p>
${OUT153C}
<ul>
  <li><strong>Mặc định lấy mẫu 10 %</strong>: 200 request ⇒ 19 trace trong Jaeger. 181 request còn lại vẫn có traceId (nằm trong log và header <code>X-Trace-Id</code>) nhưng không span nào được gửi đi — sinh viên báo "request <code>58e0…</code> lỗi" có thể chẳng có gì trong Jaeger. Dùng 1.0 khi phát triển và khi lưu lượng thấp; ở production hãy chọn tỉ lệ có chủ đích (chi phí so với độ phủ), hoặc lấy mẫu sau ở collector.</li>
  <li><strong>Trace một lượt đặt</strong> (31 span, 41,8 ms) đọc giống hệt mã: filter bảo mật 1,1 ms → giới hạn tần suất trên Redis (<code>evalsha</code>, Chương 13) 0,4 ms → Observation <code>labflow.booking.create</code> của ta → <code>pg_advisory_xact_lock</code>, tra Idempotency-Key, module catalog (một lần <code>get</code> cache rồi SQL), truy vấn hạn mức tuần, <code>insert into bookings</code>, <code>INSERT INTO EVENT_PUBLICATION</code> (sổ sự kiện của Chương 14) — rồi ở mốc 40,6 ms, <strong>sau commit, trên luồng khác</strong>, module notification đánh dấu sự kiện PROCESSING, thêm thông báo và đánh dấu COMPLETED. Một hình cho thấy ranh giới module, mọi câu SQL và phần nào chạy bất đồng bộ.</li>
</ul>
<p>Khi một lượt đặt chậm, bạn không còn đoán "chắc tại CSDL": span dài nhất nói cho bạn biết.</p>

<h3>4. Luồng nền quên — bốn biến thể đã đo</h3>
<p>Email trong LabFlow được gửi bởi <code>@ApplicationModuleListener</code> trên một luồng của task executor (Chương 14). Trace và MDC nằm trong biến gắn luồng của luồng <em>request</em>. Chúng có đi theo không? Ta đặt phòng với <code>X-Request-Id: ho-tro-2611-…</code> ở bốn cấu hình và đọc hai dòng log của mỗi lượt đặt:</p>
${OUT153B}
<ul>
  <li><strong>Lượt 1 — mặc định của Boot, chưa có Modulith insight</strong>: dòng của request có <code>[840173ac|ho-tro-2]</code>, dòng email trên <code>task-2</code> có <code>[|]</code>. Email thành "trẻ mồ côi": bạn không nối được "email lỗi" với lượt đặt đã gây ra nó. <code>spring.task.execution.propagate-context</code> mặc định là <code>false</code>.</li>
  <li><strong>Lượt 1b — <code>propagate-context=true</code></strong>: Boot thêm <code>ContextPropagatingTaskDecorator</code>; traceId đi theo (<code>[da26f887|]</code>) — nhưng <strong>requestId thì không</strong>. Decorator chỉ chép những gì đã đăng ký với thư viện context-propagation; tracing tự đăng ký, còn khoá MDC của bạn thì không.</li>
  <li><strong>Lượt 2 — cấu hình của LabFlow</strong>: đăng ký <code>Slf4jThreadLocalAccessor("requestId", "userId")</code> (hàm dựng của <code>QuanSatCauHinh</code> ở trên) ⇒ <code>[b3c166ca|ho-tro-2]</code> ở cả hai dòng.</li>
  <li><strong>Lượt 3 — <code>propagate-context=false</code> nhưng CÓ <code>spring-modulith-starter-insight</code></strong>: mọi thứ vẫn được truyền. Ta dịch ngược auto-configuration của starter: nó tự gắn <code>ContextPropagatingTaskDecorator</code> của riêng nó vào executor qua một customizer — gọi <code>setTaskDecorator</code>, tức là <strong>thay thế</strong> mọi decorator bạn đã cấu hình (như decorator chép ngữ cảnh bảo mật ở bài 14.1). Hãy biết starter của bạn làm gì với các bean dùng chung.</li>
</ul>
${MA153_PROPS2}

<h3>5. Thứ không bao giờ được nằm trong log</h3>
<p>"Bật DEBUG để tìm lỗi" là chuyện thường ngày ở chỗ làm. Xem Spring in ra gì:</p>
${OUT153D}
<ul>
  <li><strong>DEBUG cho <code>web</code></strong> in thân request đã đọc: <code>DangNhap[email=…, password=&lt;mật khẩu thật&gt;]</code>. <code>toString()</code> tự sinh của record Java chứa mọi trường. Không ai viết "ghi log mật khẩu" — nó vẫn xảy ra.</li>
  <li><strong><code>spring.mvc.log-request-details=true</code> + TRACE</strong> in mọi header, kể cả nguyên <code>Authorization: Bearer eyJ…</code>. Ai đọc được log là đóng vai người dùng đó tới khi token hết hạn. Mặc định Spring che chúng (<code>parameters={masked}</code>) — thuộc tính kia chỉ để gỡ lỗi trên máy mình.</li>
  <li>Cách sửa: record nào mang bí mật đều tự viết <code>toString()</code>; sau khi sửa, cùng dòng DEBUG hiện <code>password=***</code> và số dòng chứa mật khẩu về 0.</li>
</ul>
${MA153_REC}
<p>Và lỗi log nổi tiếng nhất — LabFlow có dính không?</p>
${OUT153E}
<p>Spring Boot ghi log qua <strong>Logback</strong>. Hai jar Log4j là <code>log4j-api</code> cùng <code>log4j-to-slf4j</code>, một cầu nối chuyển lời gọi API Log4j sang SLF4J/Logback. Log4Shell nằm trong <code>log4j-core</code>, thứ không có ở đây — trừ khi ai đó đổi sang <code>spring-boot-starter-log4j2</code>.</p>

<h3>🕵️ Góc hacker — Log4Shell (2021) và mật khẩu trong log (Twitter, GitHub 2018)</h3>
<ul>
  <li><strong>Log4Shell, CVE-2021-44228 (tháng 12/2021)</strong>: Log4j 2 diễn giải <code>\${jndi:ldap://…}</code> bên trong chuỗi được ghi log và nạp mã từ xa. Chỉ cần ghi log một user-agent, một tên đăng nhập hay một tin nhắn chat là bị chạy mã từ xa — máy chủ Minecraft, iCloud, Steam và vô số hệ thống nội bộ trúng đòn trong vài ngày. Bài học giống mục 1: <em>chữ được ghi log là dữ liệu của kẻ tấn công</em>. Hướng dẫn của Spring lúc đó: cấu hình Logback mặc định của Boot không bị ảnh hưởng.</li>
  <li><strong>Twitter, tháng 5/2018</strong>: một lỗi ghi mật khẩu vào log nội bộ trước khi băm; Twitter khuyên toàn bộ người dùng (hơn 300 triệu) cân nhắc đổi mật khẩu. <strong>GitHub, cùng tháng</strong>: mật khẩu dạng rõ của một số ít người dùng xuất hiện trong log nội bộ sau khi đặt lại mật khẩu. Cả hai đều không phải "bị hack" — đúng như mục 5.</li>
  <li><strong>Cách phòng</strong>: log JSON; không ghi log thân request, header hay bí mật; che trong <code>toString()</code>; DEBUG/TRACE chỉ trên máy mình; giới hạn người đọc được log production; cập nhật thư viện log và biết mình đang mang thư viện nào (<code>mvn dependency:tree</code>, SBOM ở bài 15.1).</li>
</ul>

<h3>So với Node.js</h3>
<p>Bộ quen thuộc của Node: <strong>pino</strong> cho log JSON (với <code>redact: ['req.headers.authorization', '*.password']</code>), <strong>AsyncLocalStorage</strong> để mang mã request qua các lời gọi bất đồng bộ (bản tương đương MDC của Node — và nó tự đi theo <code>await</code>, nên vấn đề ở mục 4 chỉ gặp với worker thread hoặc hàng đợi), và <strong>OpenTelemetry Node SDK</strong> với tự động gắn đo cho http, express, pg. Header traceparent, OTLP và Jaeger giống hệt — một dịch vụ Spring và một dịch vụ Node hiện chung trong một trace.</p>

<h3>Ở chỗ làm</h3>
<ul>
  <li>"Bộ phận hỗ trợ gửi ảnh chụp màn hình lỗi" — nếu trang lỗi hoặc ProblemDetail hiện mã request, bạn tìm ra log trong vài giây.</li>
  <li>Nhiều công ty cấm ghi dữ liệu cá nhân (email, số điện thoại) dạng rõ vào log; mã người dùng cộng một lần tra riêng là cách dung hoà thường gặp.</li>
  <li>Cứ chờ một bình luận review cho mọi dòng <code>log.debug(object)</code> mới mà object có thể chứa token.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Tìm mọi log của một request lỗi đi qua nhiều dịch vụ thế nào?"</strong> — traceId truyền qua <code>traceparent</code>, có trong MDC ở mọi dòng, log JSON đánh chỉ mục theo traceId; trả mã cho client để hỗ trợ.</li>
  <li><strong>"Log, số đo, trace — khi nào dùng cái nào?"</strong> — Số đo để phát hiện và cảnh báo (rẻ, đã gộp), trace để tìm thời gian tiêu vào đâu trong một request, log cho chi tiết chuyện gì đã xảy ra.</li>
  <li><strong>"Log của job bất đồng bộ không có traceId. Vì sao, sửa thế nào?"</strong> — Biến gắn luồng không tự qua thread pool; truyền ngữ cảnh bằng TaskDecorator (<code>spring.task.execution.propagate-context=true</code>) và đăng ký các khoá MDC tự đặt.</li>
  <li><strong>"Thứ gì không bao giờ được ghi log?"</strong> — Mật khẩu, token, số thẻ đầy đủ, bí mật, cả cục thân/header request; nhắc bẫy <code>toString()</code> của record và Log4Shell để giải thích vì sao chữ đầu vào trong log là nguy hiểm.</li>
</ol>

<h3>🧪 Thực hành (25 phút)</h3>
<ol>
  <li>Thêm một dòng log khi quản lý từ chối lượt đặt, để hỗ trợ trả lời được "ai từ chối lượt của tôi và vì sao" — mà không ghi email sinh viên. Gì nằm trong câu log, gì nằm trong MDC?</li>
  <li>Lấy mẫu 0.1, một sinh viên báo request <code>ho-tro-2611-0042</code> lỗi. Log / số đo / Jaeger, cái nào chắc chắn có, cái nào có thể không?</li>
  <li>Tìm một chỗ khác trong LabFlow mà <code>toString()</code> của record hay entity có thể in ra thứ nhạy cảm ở mức DEBUG.</li>
</ol>
${giai('Xem đáp án', `<p>1. <code>log.info("từ chối lượt #{} phòng {}: {}", id, labCode, lyDo)</code> trong service — userId (quản lý) và requestId đã có trong MDC; danh tính sinh viên là owner id của lượt đặt trong CSDL, không có email trong dòng log. Giữ lý do ngắn và đừng ghi chữ tự do chưa kiểm (hoặc dựa vào escape của JSON).</p><p>2. Log — luôn có (mọi dòng có requestId và traceId). Số đo — request được đếm, nhưng không riêng từng cái. Jaeger — chỉ khi trace đó được lấy mẫu (10 % khả năng); traceId vẫn có trong log để thử tra.</p><p>3. <code>DangKy</code> (mật khẩu — đã sửa cùng <code>DangNhap</code>), mọi record chứa JWT hay refresh token, và entity JPA như <code>Account</code> nếu ai đó thêm <code>@Data</code>/<code>@ToString</code> của Lombok có cả <code>passwordHash</code>.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<ul>
  <li><strong>Log có cấu trúc</strong> — mỗi sự kiện một bản ghi máy đọc được (JSON); Boot: <code>logging.structured.format.console=ecs|logstash|gelf</code>.</li>
  <li><strong>Log injection (CWE-117)</strong> — giả hoặc làm hỏng dòng log qua dữ liệu người dùng không được escape.</li>
  <li><strong>MDC</strong> — ngữ cảnh khoá–giá trị theo luồng, in kèm mọi dòng log.</li>
  <li><strong>Trace / span / traceId / spanId</strong> — hành trình một request / một phần việc trong đó / mã của chúng.</li>
  <li><strong>traceparent</strong> — header W3C mang ngữ cảnh trace giữa các dịch vụ.</li>
  <li><strong>OTLP</strong> — giao thức của OpenTelemetry để gửi span, số đo, log tới bộ thu.</li>
  <li><strong>Tỉ lệ lấy mẫu</strong> — phần trace được gửi đi (mặc định Boot 0.1).</li>
  <li><strong>Truyền ngữ cảnh</strong> — chép biến gắn luồng của trace/MDC sang luồng chạy việc bất đồng bộ.</li>
</ul>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Log JSON biến dòng giả thành một trường đã escape; MDC cho mọi dòng requestId và userId.</li>
  <li>Một trace đặt phòng thật: 31 span, mọi câu SQL, ranh giới module và email sau commit trên luồng khác.</li>
  <li>Đã đo: mặc định lấy mẫu 10 %; việc bất đồng bộ mất trace và MDC trừ khi bật truyền ngữ cảnh và đăng ký khoá riêng — và một starter có thể bật nó sau lưng bạn.</li>
  <li>DEBUG in mật khẩu thật từ <code>toString()</code> của record và nguyên JWT từ header; đã sửa và đo lại về 0.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.spring.io/spring-boot/reference/features/logging.html', '🍃', 'Spring Boot — Logging', 'log có cấu trúc, định dạng, MDC, nhóm log')}
${tl('https://docs.spring.io/spring-boot/reference/actuator/tracing.html', '🧭', 'Spring Boot — Tracing', 'Micrometer Tracing, OpenTelemetry, lấy mẫu, truyền ngữ cảnh')}
${tl('https://spring.io/blog/2021/12/10/log4j2-vulnerability-and-spring-boot', '🛡️', 'Spring — Log4J2 vulnerability and Spring Boot', 'vì sao cấu hình Logback mặc định không bị ảnh hưởng')}

<h3>Nguồn</h3>
<ul>
  <li>MITRE — <a href="https://cwe.mitre.org/data/definitions/117.html" target="_blank" rel="noopener">CWE-117: Improper Output Neutralization for Logs</a>.</li>
  <li>Spring Blog, 10/12/2021 — <a href="https://spring.io/blog/2021/12/10/log4j2-vulnerability-and-spring-boot" target="_blank" rel="noopener">Log4J2 Vulnerability and Spring Boot</a>.</li>
  <li>Công bố của Twitter và GitHub, tháng 5/2018 (mật khẩu bị ghi vào log nội bộ).</li>
  <li>Mọi output: LabFlow (Spring Boot 4.1.2, Micrometer Tracing 1.7.2, OpenTelemetry 1.62.0, Spring Modulith 2.1.3) + Jaeger 2.23.0 trên máy dựng bài, 24/11/2026.</li>
</ul>
</div>
`;

// ===== Bài 15.4 =====
const MA154_CHAM = bash("#!/bin/bash\n# cham.sh <thư mục dự án> — chấm Lab 15 \"Bảng điều khiển LabFlow\". 10 mục ĐẠT/TRƯỢT, gọi API, actuator, Jaeger THẬT.\n# Chép dự án sang thư mục tạm, biên dịch, chạy profile dev,prod (log phải là JSON) với PostgreSQL + Redis + Jaeger trong netns sb-c15-cham-net.\n# Cổng: API 127.0.0.1:41857 (8080 trong netns), quản trị 41858 (8081), Jaeger 41859 (16686). Mật khẩu sinh lúc chấm, không in ra.\nset -u\nSRC=$(realpath \"$1\"); W=/tmp/cham/$(basename \"$SRC\")-$$; MVN=./mvn.sh   # Maven 3.9 + JDK 21 trong container\nA=http://127.0.0.1:41857; Q=http://127.0.0.1:41858; JG=http://127.0.0.1:41859; J='Content-Type: application/json'\nMKDB=$(openssl rand -hex 8); JWT=$(openssl rand -hex 32); MKQL=ql-$(openssl rand -hex 8); MKSV=sv-$(openssl rand -hex 8)\nN=sb-c15-cham; diem=0; muc() { if [ \"$2\" = 1 ]; then diem=$((diem+1)); echo \"Mục $1: ĐẠT   — $3\"; else echo \"Mục $1: TRƯỢT — $3\"; fi; }\ndon() { docker rm -f $N-app $N-pg $N-redis $N-jaeger $N-net >/dev/null 2>&1; rm -rf \"$W\"; }\ntrap don EXIT\nrm -rf \"$W\"; mkdir -p \"$W\"; cp -r \"$SRC\"/pom.xml \"$SRC\"/src \"$W\"/\nbash $MVN \"$W\" -B -q -DskipTests compile dependency:copy-dependencies -DoutputDirectory=target/dep -DincludeScope=runtime > \"$W/build.log\" 2>&1 \\\n  || { echo \"BIÊN DỊCH HỎNG:\"; grep -E 'ERROR.*\\.java' \"$W/build.log\" | head -5; echo \"Điểm: 0/10\"; exit 1; }\ndocker rm -f $N-app $N-pg $N-redis $N-jaeger $N-net >/dev/null 2>&1\ndocker run -d --name $N-net --memory 64m -p 127.0.0.1:41857:8080 -p 127.0.0.1:41858:8081 -p 127.0.0.1:41859:16686 --entrypoint sleep postgres:16 infinity >/dev/null\ndocker run -d --name $N-pg --network container:$N-net --memory 2g --memory-swap 2g --cpus 2 -e POSTGRES_USER=labflow -e POSTGRES_PASSWORD=\"$MKDB\" -e POSTGRES_DB=labflow postgres:16 >/dev/null\ndocker run -d --name $N-redis --network container:$N-net --memory 256m --memory-swap 256m --cpus 0.5 redis:7-alpine redis-server --save \"\" >/dev/null\ndocker run -d --name $N-jaeger --network container:$N-net --memory 512m --memory-swap 512m --cpus 1 jaegertracing/jaeger:2.23.0 >/dev/null\nfor i in $(seq 60); do docker exec $N-pg pg_isready -h 127.0.0.1 -U labflow -q 2>/dev/null && break; sleep 1; done; sleep 2\ndocker run -d --name $N-app --network container:$N-net --memory 1g --memory-swap 1g --cpus 2 --user $(id -u):$(id -g) -e HOME=/tmp -e TZ=UTC \\\n  -e LABFLOW_DB_PASSWORD=\"$MKDB\" -e LABFLOW_JWT_SECRET=\"$JWT\" -e LABFLOW_MANAGER_PASSWORD=\"$MKQL\" -e SPRING_PROFILES_ACTIVE=dev,prod \\\n  -e LABFLOW_TRACE_SAMPLING=1.0 -e LABFLOW_MANAGEMENT_PORT=8081 -e MANAGEMENT_SERVER_PORT=8081 -e MANAGEMENT_TRACING_SAMPLING_PROBABILITY=1.0 \\\n  -v \"$W\":/w -w /w --entrypoint \"\" maven:3.9-eclipse-temurin-21 java -XX:MaxRAMPercentage=60 -cp \"target/classes:target/dep/*\" vn.labflow.LabflowApplication >/dev/null\nfor i in $(seq 120); do docker logs $N-app 2>&1 | grep -qE 'Started [A-Za-z0-9]+ in|APPLICATION FAILED|Application run failed' && break; sleep 1; done\ndocker logs $N-app 2>&1 | grep -qE 'Started [A-Za-z0-9]+ in' || { echo \"ỨNG DỤNG KHÔNG LÊN:\"; docker logs $N-app 2>&1 | grep -vE '^\\s+at ' | tail -8; echo \"Điểm: 0/10\"; exit 1; }\nps() { docker exec $N-pg psql -qtA -U labflow -d labflow -c \"$1\" 2>/dev/null; }\nma() { curl -s -o /dev/null -m ${3:-5} -w '%{http_code}' \"${@:4}\" \"$1$2\"; }\nso() { curl -s $Q/actuator/prometheus | grep -E \"^$1\" | awk '{s+=$NF} END{print s+0}'; }\ndk() { curl -s -o /dev/null -H \"$J\" -d \"{\\\"email\\\":\\\"$1\\\",\\\"fullName\\\":\\\"Sinh Vien\\\",\\\"password\\\":\\\"$MKSV\\\"}\" $A/api/v1/auth/register; }\ntok() { curl -s -H \"$J\" -d \"{\\\"email\\\":\\\"$1\\\",\\\"password\\\":\\\"$2\\\"}\" $A/api/v1/auth/login | jq -r '.accessToken // empty'; }\nNGAY=$(date -d '+3 day' +%F); NGAY2=$(date -d '+4 day' +%F)\ndat() { curl -s -o /dev/null -w '%{http_code}' -H \"Authorization: Bearer $1\" -H \"$J\" -H \"Idempotency-Key: $2\" -d \"{\\\"labCode\\\":\\\"$3\\\",\\\"startAt\\\":\\\"${NGAY}T$4\\\",\\\"endAt\\\":\\\"${NGAY}T$5\\\",\\\"purpose\\\":\\\"cham lab 15\\\"}\" $A/api/v1/bookings; }\ndk an@fpt.edu.vn; dk binh@fpt.edu.vn; TA=$(tok an@fpt.edu.vn $MKSV); TB=$(tok binh@fpt.edu.vn $MKSV); TQ=$(tok manager@fpt.edu.vn $MKQL)\ncurl -s -o /dev/null $A/api/v1/labs; sleep 1\n\n# 1. cổng API công khai không lộ actuator\nok=1; for p in env heapdump prometheus loggers configprops; do [ \"$(ma $A /actuator/$p)\" = 200 ] && ok=0; done\nmuc 1 $ok \"cổng API (8080) không trả 200 cho /actuator/env, heapdump, prometheus, loggers, configprops\"\n\n# 2. cổng quản trị: probe có, endpoint nguy hiểm không mở (kể cả với MANAGER)\nok=1; [ \"$(ma $Q /actuator/health/liveness)\" = 200 ] || ok=0; [ \"$(ma $Q /actuator/health/readiness)\" = 200 ] || ok=0\nfor p in env heapdump loggers threaddump; do [ \"$(ma $Q /actuator/$p 5 -H \"Authorization: Bearer $TQ\")\" = 200 ] && ok=0; done\nmuc 2 $ok \"cổng quản trị (8081): liveness + readiness 200; env/heapdump/loggers/threaddump không mở, kể cả với MANAGER\"\n\n# 3. readiness theo CSDL, không theo Redis; liveness không theo CSDL\nok=1; docker stop -t 1 $N-redis >/dev/null; [ \"$(ma $Q /actuator/health/readiness)\" = 200 ] || ok=0; docker start $N-redis >/dev/null\ndocker pause $N-pg >/dev/null; r=$(ma $Q /actuator/health/readiness 5); l=$(ma $Q /actuator/health/liveness 2); docker unpause $N-pg >/dev/null\n[ \"$r\" != 200 ] || ok=0; [ \"$l\" = 200 ] || ok=0\nfor i in $(seq 30); do [ \"$(ma $Q /actuator/health/readiness)\" = 200 ] && break; sleep 1; done\nmuc 3 $ok \"Redis dừng ⇒ readiness vẫn 200; PostgreSQL đứng hình ⇒ readiness $r, liveness $l\"\n\n# 4 + 5. histogram + số đo lượt đặt (không tính lần gửi lại)\np0=$(so 'labflow_bookings_placed_total\\{.*lab=\"NET-02\"'); r0=$(so labflow_bookings_replayed_total)\nc1=$(dat $TA k-cham-0001 NET-02 08:00 09:00); c2=$(dat $TA k-cham-0001 NET-02 08:00 09:00); sleep 1\np1=$(so 'labflow_bookings_placed_total\\{.*lab=\"NET-02\"'); r1=$(so labflow_bookings_replayed_total)\nh=$(curl -s $Q/actuator/prometheus | grep -c '^http_server_requests_seconds_bucket{.*method=\"POST\".*uri=\"/api/v1/bookings\"')\n[ \"$h\" -ge 5 ] && muc 4 1 \"http.server.requests có histogram cho POST /api/v1/bookings ($h bucket)\" || muc 4 0 \"không có bucket histogram cho POST /api/v1/bookings ($h)\"\nok=0; [ \"$c1$c2\" = 201200 ] && [ \"$(echo \"$p1 - $p0\" | bc)\" = 1 ] && [ \"$(echo \"$r1 - $r0\" | bc)\" = 1 ] && ok=1\nmuc 5 $ok \"đặt rồi gửi lại ($c1, $c2) ⇒ labflow_bookings_placed_total{lab=NET-02} +$(echo \"$p1 - $p0\" | bc), labflow_bookings_replayed_total +$(echo \"$r1 - $r0\" | bc)\"\n\n# 6. lỗi nghiệp vụ theo mã\ns0=$(so 'labflow_api_errors_total\\{.*code=\"SLOT_TAKEN\"'); b0=$(so 'labflow_api_errors_total\\{.*code=\"BAD_CREDENTIALS\"')\nc3=$(dat $TB k-cham-0002 NET-02 08:30 09:30); tok an@fpt.edu.vn sai-mat-khau-0 >/dev/null; sleep 1\ns1=$(so 'labflow_api_errors_total\\{.*code=\"SLOT_TAKEN\"'); b1=$(so 'labflow_api_errors_total\\{.*code=\"BAD_CREDENTIALS\"')\nok=0; [ \"$c3\" = 409 ] && [ \"$(echo \"$s1 - $s0\" | bc)\" = 1 ] && [ \"$(echo \"$b1 - $b0\" | bc)\" = 1 ] && ok=1\nmuc 6 $ok \"trùng giờ ($c3) ⇒ labflow_api_errors_total{code=SLOT_TAKEN} +$(echo \"$s1 - $s0\" | bc); sai mật khẩu ⇒ {code=BAD_CREDENTIALS} +$(echo \"$b1 - $b0\" | bc)\"\n\n# 7. gauge đọc từ CSDL\ncurl -s -o /dev/null -H \"Authorization: Bearer $TB\" -H \"$J\" -H \"Idempotency-Key: k-cham-0003\" -d \"{\\\"labCode\\\":\\\"AI-03\\\",\\\"startAt\\\":\\\"${NGAY2}T08:00\\\",\\\"endAt\\\":\\\"${NGAY2}T09:00\\\",\\\"purpose\\\":\\\"cho duyet\\\"}\" $A/api/v1/bookings; sleep 1\npg=$(ps \"select count(*) from bookings where status='PENDING'\"); g=$(so labflow_bookings_pending); e=$(curl -s $Q/actuator/prometheus | grep -c '^labflow_events_incomplete')\nok=0; [ \"$(printf '%.0f' $g)\" = \"$pg\" ] && [ \"$pg\" -ge 1 ] && [ \"$e\" -ge 1 ] && ok=1\nmuc 7 $ok \"labflow_bookings_pending = $g (CSDL: $pg); labflow_events_incomplete có mặt ($e dòng)\"\n\n# 8. không bùng nổ nhãn: mỗi vòng = 1 lượt đặt với mã phòng rác + 1 đăng nhập email rác + 1 GET phòng rác\nrac() { for i in $(seq $1 $2); do echo $i; done | xargs -P 8 -I{} sh -c \"curl -s -o /dev/null -H 'Authorization: Bearer $TB' -H '$J' -H 'Idempotency-Key: k-rac-{}-xxxx' -d '{\\\"labCode\\\":\\\"RAC-{}\\\",\\\"startAt\\\":\\\"${NGAY2}T10:00\\\",\\\"endAt\\\":\\\"${NGAY2}T11:00\\\",\\\"purpose\\\":\\\"x\\\"}' $A/api/v1/bookings; curl -s -o /dev/null -H '$J' -d '{\\\"email\\\":\\\"rac{}@x.vn\\\",\\\"password\\\":\\\"x\\\"}' $A/api/v1/auth/login; curl -s -o /dev/null $A/api/v1/labs/RAC-{}\"; }\ndem() { curl -s $Q/actuator/prometheus | grep '^labflow_' | grep -vc '_bucket{'; }\nrac 1 1; sleep 1; n0=$(dem)   # một vòng làm nóng: nhãn có giới hạn (mã lỗi, tên exception) xuất hiện ở đây\nrac 2 301; sleep 1; n1=$(dem)\n[ $((n1 - n0)) -le 3 ] && muc 8 1 \"300 vòng request rác (mã phòng, email, đường lạ) ⇒ chuỗi labflow_* (không kể _bucket) $n0 → $n1\" || muc 8 0 \"300 vòng request rác ⇒ chuỗi labflow_* (không kể _bucket) $n0 → $n1 (bùng nổ nhãn)\"\n\n# 9. log JSON, chống giả dòng, mã request\nGIA='x@fpt.edu.vn\\n10:31:02.118 INFO  [nio-8080-exec-7] AuthController : dang nhap thanh cong cho manager@fpt.edu.vn'\nhid=$(curl -s -D - -o /dev/null -H \"$J\" -H \"X-Request-Id: cham-lab15-0009\" -d \"{\\\"email\\\":\\\"$GIA\\\",\\\"password\\\":\\\"x\\\"}\" $A/api/v1/auth/login | tr -d '\\r' | awk 'tolower($1)==\"x-request-id:\"{print $2}'); sleep 1\nL9=$W/log9; docker logs $N-app 2>&1 | sed -n '/Started /,$p' | tail -n +2 > $L9\ntong=$(grep -c . $L9); json=$(while IFS= read -r x; do echo \"$x\" | jq -e . >/dev/null 2>&1 && echo 1; done < $L9 | grep -c 1)\ngia=$(grep -c '^10:31:02.118' $L9); rq=$(grep 'cham-lab15-0009' $L9 | grep -c 'x@fpt.edu.vn')\nok=0; [ \"$tong\" -gt 0 ] && [ \"$json\" = \"$tong\" ] && [ \"$gia\" = 0 ] && [ \"$hid\" = cham-lab15-0009 ] && [ \"$rq\" -ge 1 ] && ok=1\nmuc 9 $ok \"log JSON $json/$tong dòng; dòng giả: $gia; X-Request-Id trả về '$hid'; dòng đăng nhập thất bại mang requestId: $rq\"\n\n# 10. trace: header X-Trace-Id, span labflow.booking.create trong Jaeger, log việc nền cùng traceId + requestId\ntid=$(curl -s -D - -o /dev/null -H \"Authorization: Bearer $TA\" -H \"$J\" -H \"Idempotency-Key: k-cham-0010\" -H \"X-Request-Id: cham-lab15-0010\" -d \"{\\\"labCode\\\":\\\"IOT-01\\\",\\\"startAt\\\":\\\"${NGAY}T13:00\\\",\\\"endAt\\\":\\\"${NGAY}T14:00\\\",\\\"purpose\\\":\\\"trace\\\"}\" $A/api/v1/bookings | tr -d '\\r' | awk 'tolower($1)==\"x-trace-id:\"{print $2}')\nsp=0; for i in $(seq 20); do sp=$(curl -s \"$JG/api/v3/traces/$tid\" | jq '[.result.resourceSpans[]?.scopeSpans[]?.spans[]? | select(.name==\"labflow.booking.create\")] | length' 2>/dev/null); [ \"${sp:-0}\" -ge 1 ] && break; sleep 1; done\nnen=$(docker logs $N-app 2>&1 | grep 'email giả' | grep \"$tid\" | grep -c 'cham-lab15-0010')\nok=0; [ -n \"$tid\" ] && [ \"${sp:-0}\" -ge 1 ] && [ \"$nen\" -ge 1 ] && ok=1\nmuc 10 $ok \"X-Trace-Id '${tid:0:12}…'; span labflow.booking.create trong Jaeger: ${sp:-0}; dòng [email giả] cùng traceId + requestId: $nen\"\necho \"Điểm: $diem/10\"");
const OUT154S = out("$ bash lab15/lam.sh starter && bash lab15/cham.sh /tmp/lab/starter\nMục 1: ĐẠT   — cổng API (8080) không trả 200 cho /actuator/env, heapdump, prometheus, loggers, configprops\nMục 2: ĐẠT   — cổng quản trị (8081): liveness + readiness 200; env/heapdump/loggers/threaddump không mở, kể cả với MANAGER\nMục 3: TRƯỢT — Redis dừng ⇒ readiness vẫn 200; PostgreSQL đứng hình ⇒ readiness 200, liveness 200\nMục 4: TRƯỢT — không có bucket histogram cho POST /api/v1/bookings (0)\nMục 5: TRƯỢT — đặt rồi gửi lại (201, 200) ⇒ labflow_bookings_placed_total{lab=NET-02} +0, labflow_bookings_replayed_total +0\nMục 6: TRƯỢT — trùng giờ (409) ⇒ labflow_api_errors_total{code=SLOT_TAKEN} +0; sai mật khẩu ⇒ {code=BAD_CREDENTIALS} +0\nMục 7: TRƯỢT — labflow_bookings_pending = 0 (CSDL: 1); labflow_events_incomplete có mặt (0 dòng)\nMục 8: ĐẠT   — 300 vòng request rác (mã phòng, email, đường lạ) ⇒ chuỗi labflow_* (không kể _bucket) 0 → 0\nMục 9: TRƯỢT — log JSON 0/13 dòng; dòng giả: 0; X-Request-Id trả về ''; dòng đăng nhập thất bại mang requestId: 0\nMục 10: TRƯỢT — X-Trace-Id '…'; span labflow.booking.create trong Jaeger: 0; dòng [email giả] cùng traceId + requestId: 0\nĐiểm: 3/10");
const OUT154G = out("$ bash lab15/lam.sh giai && bash lab15/cham.sh /tmp/lab/giai\nMục 1: ĐẠT   — cổng API (8080) không trả 200 cho /actuator/env, heapdump, prometheus, loggers, configprops\nMục 2: ĐẠT   — cổng quản trị (8081): liveness + readiness 200; env/heapdump/loggers/threaddump không mở, kể cả với MANAGER\nMục 3: ĐẠT   — Redis dừng ⇒ readiness vẫn 200; PostgreSQL đứng hình ⇒ readiness 000, liveness 200\nMục 4: ĐẠT   — http.server.requests có histogram cho POST /api/v1/bookings (138 bucket)\nMục 5: ĐẠT   — đặt rồi gửi lại (201, 200) ⇒ labflow_bookings_placed_total{lab=NET-02} +1, labflow_bookings_replayed_total +1\nMục 6: ĐẠT   — trùng giờ (409) ⇒ labflow_api_errors_total{code=SLOT_TAKEN} +1; sai mật khẩu ⇒ {code=BAD_CREDENTIALS} +1\nMục 7: ĐẠT   — labflow_bookings_pending = 1 (CSDL: 1); labflow_events_incomplete có mặt (1 dòng)\nMục 8: ĐẠT   — 300 vòng request rác (mã phòng, email, đường lạ) ⇒ chuỗi labflow_* (không kể _bucket) 21 → 22\nMục 9: ĐẠT   — log JSON 318/318 dòng; dòng giả: 0; X-Request-Id trả về 'cham-lab15-0009'; dòng đăng nhập thất bại mang requestId: 1\nMục 10: ĐẠT   — X-Trace-Id '336cdd90b183…'; span labflow.booking.create trong Jaeger: 1; dòng [email giả] cùng traceId + requestId: 1\nĐiểm: 10/10");
const OUT154B = out("$ bash lab15/lam.sh bay && bash lab15/cham.sh /tmp/lab/bay\nMục 1: ĐẠT   — cổng API (8080) không trả 200 cho /actuator/env, heapdump, prometheus, loggers, configprops\nMục 2: ĐẠT   — cổng quản trị (8081): liveness + readiness 200; env/heapdump/loggers/threaddump không mở, kể cả với MANAGER\nMục 3: ĐẠT   — Redis dừng ⇒ readiness vẫn 200; PostgreSQL đứng hình ⇒ readiness 000, liveness 200\nMục 4: ĐẠT   — http.server.requests có histogram cho POST /api/v1/bookings (138 bucket)\nMục 5: ĐẠT   — đặt rồi gửi lại (201, 200) ⇒ labflow_bookings_placed_total{lab=NET-02} +1, labflow_bookings_replayed_total +1\nMục 6: ĐẠT   — trùng giờ (409) ⇒ labflow_api_errors_total{code=SLOT_TAKEN} +1; sai mật khẩu ⇒ {code=BAD_CREDENTIALS} +1\nMục 7: ĐẠT   — labflow_bookings_pending = 1 (CSDL: 1); labflow_events_incomplete có mặt (1 dòng)\nMục 8: TRƯỢT — 300 vòng request rác ⇒ chuỗi labflow_* (không kể _bucket) 24 → 325 (bùng nổ nhãn)\nMục 9: ĐẠT   — log JSON 318/318 dòng; dòng giả: 0; X-Request-Id trả về 'cham-lab15-0009'; dòng đăng nhập thất bại mang requestId: 1\nMục 10: ĐẠT   — X-Trace-Id '2262ec343921…'; span labflow.booking.create trong Jaeger: 1; dòng [email giả] cùng traceId + requestId: 1\nĐiểm: 9/10");

const L154_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.4 · Lab</span>
<h2>Chapter 15 lab + interview questions</h2>
<p class="lead">It is the first week of the semester. LabFlow is live for the whole campus, and the lab manager's phone rings: "students say booking is slow", "a student says he got two emails", "is the system down?". Your SWP391 team has logs that nobody can search, no metrics, and an actuator someone opened "for testing". Your task: give LabFlow the dashboard an on-call engineer needs — safe probes, business metrics with bounded labels, JSON logs that cannot be forged, a request id the user can quote, and traces that follow the booking into its background email. A grader with ten checks runs your code next to a real PostgreSQL, Redis and Jaeger, freezes the database, floods you with garbage input and tries to forge a log line.</p>

<h3>The starting point</h3>
<p>Start from LabFlow at the end of Chapter 14 (the version you built, or the course's): Actuator is in the <code>pom.xml</code> with <code>health,info</code> exposed on port 8080, plain-text logs, no business metrics, no tracing. Three versions are used below: the <strong>starter</strong> (exactly that), the official <strong>solution</strong> (hidden at the end), and a <strong>trap</strong> version that looks finished but contains one classic mistake.</p>

<h3>Requirements (what the grader checks)</h3>
<ol>
  <li><strong>Public port closed</strong>: on port 8080, <code>/actuator/env</code>, <code>heapdump</code>, <code>prometheus</code>, <code>loggers</code>, <code>configprops</code> never answer 200.</li>
  <li><strong>Management port 8081</strong>: <code>/actuator/health/liveness</code> and <code>/actuator/health/readiness</code> answer 200; <code>env</code>, <code>heapdump</code>, <code>loggers</code>, <code>threaddump</code> are not available even with a MANAGER token.</li>
  <li><strong>Correct probes</strong>: Redis stopped ⇒ readiness still 200; PostgreSQL frozen ⇒ readiness not 200 within 5 s while liveness answers 200 within 2 s.</li>
  <li><strong>Histogram</strong>: <code>http_server_requests_seconds_bucket</code> exists for <code>POST /api/v1/bookings</code>.</li>
  <li><strong>Booking counter</strong>: <code>labflow_bookings_placed_total{lab, status}</code> grows by exactly 1 per new booking and not on an <code>Idempotency-Key</code> replay; <code>labflow_bookings_replayed_total</code> counts replays.</li>
  <li><strong>Errors by code</strong>: <code>labflow_api_errors_total{code, status}</code> — an overlapping booking adds 1 to <code>code="SLOT_TAKEN"</code>, a wrong password adds 1 to <code>code="BAD_CREDENTIALS"</code>.</li>
  <li><strong>Gauges</strong>: <code>labflow_bookings_pending</code> equals the number of PENDING bookings in the database; <code>labflow_events_incomplete</code> is exported.</li>
  <li><strong>Bounded cardinality</strong>: 300 rounds of garbage (a booking with a random lab code, a login with a random email, a GET of a random lab) add at most 3 non-bucket <code>labflow_*</code> series.</li>
  <li><strong>JSON logs</strong> with profile <code>prod</code>: every log line after startup parses as JSON; a login with an email containing a newline and a fake log line creates no forged line; a valid <code>X-Request-Id</code> is returned and appears in the failed-login log record.</li>
  <li><strong>Tracing</strong>: <code>POST /api/v1/bookings</code> returns <code>X-Trace-Id</code>; Jaeger has that trace with a span named <code>labflow.booking.create</code>; the background "[email giả]" log line carries the same traceId <em>and</em> requestId.</li>
</ol>
<p>The grader starts your app with <code>SPRING_PROFILES_ACTIVE=dev,prod</code>, management port 8081, sampling 1.0 and an OTLP endpoint on <code>localhost:4318</code>; you do not need to configure those three yourself, but your code must work with them.</p>

<h3>The grader</h3>
<p>It copies your project, compiles it in a JDK 21 container, starts PostgreSQL 16, Redis 7 and Jaeger in one network namespace (each with a memory limit), then calls the real API. Passwords and the JWT key are generated per run and never printed. About 3–4 minutes per run:</p>
${MA154_CHAM}

<h3>Results on the course machine</h3>
${OUT154S}
<p>The starter already passes 1 and 2 (the grader forces the management port, and Chapter 9's security chain answers 401 on the public port) and 8 (no custom metrics — nothing to explode). Everything that needs Chapter 15's work fails: readiness ignores the frozen database, there are no business metrics, logs are plain text (0/13 lines parse as JSON), and there is no trace id.</p>
${OUT154G}
<p>The official solution passes all ten. Look at the numbers the grader prints: 138 bucket lines for one URI, readiness <code>000</code> (no answer in 5 s) while liveness answers 200, and only one new <code>labflow_*</code> series after 300 rounds of garbage (an error code seen for the first time).</p>
${OUT154B}
<p>The trap version adds one line at the top of the booking handler: <code>soDo.counter("labflow.booking.requests", "lab", r.labCode()).increment()</code> — "count requests per lab, it's useful". The lab code comes from the client, before anyone checks it exists: 300 rounds of garbage ⇒ 24 → 325 series. Everything else is perfect, and an attacker with a loop owns your monitoring.</p>
<p>An honest note from building this lab: in the first version of the trap the counter sat <em>after</em> the rate limiter (5 bookings per minute per user, Chapter 13). The grader used one account, so the limiter cut the garbage to five requests and the trap scored 10/10. A real attacker uses many accounts. Never let one protection make you believe another bug is not there — test them separately.</p>

${giai('Show the official solution (try first!)', `<p>Everything in the solution is code you met in lessons 15.1–15.3; this is the checklist of where it goes:</p>
<ul>
  <li><code>pom.xml</code>: <code>micrometer-registry-prometheus</code>, <code>spring-boot-starter-opentelemetry</code>, <code>datasource-micrometer-spring-boot</code>, <code>spring-modulith-starter-insight</code>.</li>
  <li><code>application.properties</code>: the Chapter 15 block of lesson 15.1 (management port, exposure <code>health,info,prometheus</code>, <code>show-details=when-authorized</code>, readiness group <code>readinessState,db</code>), the histogram lines and tracing lines of 15.2–15.3, <code>management.otlp.metrics.export.enabled=false</code>, <code>spring.task.execution.propagate-context=true</code>.</li>
  <li><code>application-prod.properties</code>: <code>logging.structured.format.console=ecs</code>.</li>
  <li><code>BaoMat</code>: <code>EndpointRequest.to("health","info","prometheus")</code> permitted, <code>EndpointRequest.toAnyEndpoint()</code> for MANAGER, <code>addFilterAfter(new NguoiDungMdc(), BearerTokenAuthenticationFilter.class)</code>.</li>
  <li><code>shared/QuanSatCauHinh</code>: the <code>MaRequest</code> filter (validated <code>X-Request-Id</code>, MDC, <code>X-Trace-Id</code> header) and the <code>Slf4jThreadLocalAccessor("requestId","userId")</code> registration.</li>
  <li><code>XuLyLoi</code>: every handler returns through <code>dem(…)</code> ⇒ <code>labflow.api.errors{code,status}</code>.</li>
  <li><code>BookingService</code>: <code>labflow.bookings.placed{lab,status}</code> with the lab code <em>from the catalog</em>, <code>labflow.bookings.replayed</code>; <code>BookingController</code>: the <code>labflow.booking.create</code> Observation and one INFO line per booking.</li>
  <li><code>SoDoBooking</code> / <code>SoDoThongBao</code>: the two gauges; <code>AuthController</code>: <code>labflow.auth.failures</code>, the WARN line, and <code>toString()</code> without the password in <code>DangNhap</code>/<code>DangKy</code>.</li>
</ul>`)}

<h3>🎤 Chapter 15 — what the interviewer will ask</h3>
<ol>
  <li><strong>"A user says the app is slow. Walk me through how you investigate."</strong> — Dashboard first (p95 and error rate per endpoint and instance — is it everyone or one endpoint/instance?), then a slow trace for that endpoint to see which span takes the time, then the logs of that trace id for details. Metrics → traces → logs.</li>
  <li><strong>"Liveness vs readiness, and what goes in each?"</strong> — Restart when stuck vs stop routing when not ready; liveness without the database, readiness with required dependencies only. Measured: a frozen database must not restart the app; a stopped cache must not take it out of the load balancer.</li>
  <li><strong>"How do you secure Actuator?"</strong> — Minimal exposure, management port on the internal network, details for an operator role, never heapdump/env/loggers publicly; cite the VW/Cariad heap dump leak (2024).</li>
  <li><strong>"Why not average p95 across instances, and what is high cardinality?"</strong> — Sum histogram buckets then compute; averaging gave 680 ms instead of 354 ms. Unbounded labels from user input create a series per value; bounded labels and MeterFilter limits.</li>
  <li><strong>"Your async jobs' logs have no trace id, and a password appeared in DEBUG logs. Explain both."</strong> — Thread-locals do not cross pools — context propagation + registered MDC keys; a record's generated <code>toString()</code> printed by Spring's DEBUG — override it, never log bodies/headers.</li>
</ol>

<h3>📌 Summary</h3>
<ul>
  <li>Ten checks turn "we have monitoring" into something measurable: safe probes, business metrics, bounded labels, JSON logs, request ids, traces across threads.</li>
  <li>Starter 3/10, official solution 10/10, the per-lab-code trap 9/10 — and a rate limiter almost hid it.</li>
  <li>Chapter 15 in one line: you cannot fix what you cannot see, and what you expose to see it must not become the next leak.</li>
</ul>
</div>
`;

const L154_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.4 · Lab</span>
<h2>Lab chương 15 + câu hỏi phỏng vấn</h2>
<p class="lead">Tuần đầu học kỳ. LabFlow chạy cho cả trường, và điện thoại của quản lý phòng lab reo liên tục: "sinh viên kêu đặt phòng chậm", "một bạn nói nhận hai email", "hệ thống sập à?". Nhóm SWP391 của bạn có log mà không ai tìm được gì, không có số đo, và một actuator ai đó mở "để thử". Nhiệm vụ: cho LabFlow cái bảng điều khiển mà người trực cần — probe an toàn, số đo nghiệp vụ với nhãn có giới hạn, log JSON không giả được, mã request người dùng đọc lại được, và trace đi theo lượt đặt vào tận email chạy nền. Bộ chấm 10 mục chạy mã của bạn cạnh PostgreSQL, Redis và Jaeger thật, làm CSDL đứng hình, dội dữ liệu rác vào và thử giả một dòng log.</p>

<h3>Điểm xuất phát</h3>
<p>Bắt đầu từ LabFlow cuối Chương 14 (bản bạn tự làm, hoặc bản của khoá): Actuator có trong <code>pom.xml</code>, mở <code>health,info</code> trên cổng 8080, log chữ thường, chưa có số đo nghiệp vụ, chưa có tracing. Bên dưới dùng ba bản: bản <strong>khởi đầu</strong> (đúng như trên), <strong>lời giải</strong> chính thức (che ở cuối), và một bản <strong>bẫy</strong> trông như đã xong nhưng chứa một lỗi kinh điển.</p>

<h3>Yêu cầu (thứ bộ chấm kiểm)</h3>
<ol>
  <li><strong>Cổng công khai đóng</strong>: trên cổng 8080, <code>/actuator/env</code>, <code>heapdump</code>, <code>prometheus</code>, <code>loggers</code>, <code>configprops</code> không bao giờ trả 200.</li>
  <li><strong>Cổng quản trị 8081</strong>: <code>/actuator/health/liveness</code> và <code>/actuator/health/readiness</code> trả 200; <code>env</code>, <code>heapdump</code>, <code>loggers</code>, <code>threaddump</code> không có, kể cả với token MANAGER.</li>
  <li><strong>Probe đúng</strong>: Redis dừng ⇒ readiness vẫn 200; PostgreSQL đứng hình ⇒ readiness không phải 200 trong 5 giây, còn liveness trả 200 trong 2 giây.</li>
  <li><strong>Histogram</strong>: có <code>http_server_requests_seconds_bucket</code> cho <code>POST /api/v1/bookings</code>.</li>
  <li><strong>Đếm lượt đặt</strong>: <code>labflow_bookings_placed_total{lab, status}</code> tăng đúng 1 mỗi lượt đặt mới và không tăng khi gửi lại cùng <code>Idempotency-Key</code>; <code>labflow_bookings_replayed_total</code> đếm lần gửi lại.</li>
  <li><strong>Lỗi theo mã</strong>: <code>labflow_api_errors_total{code, status}</code> — đặt trùng giờ cộng 1 vào <code>code="SLOT_TAKEN"</code>, sai mật khẩu cộng 1 vào <code>code="BAD_CREDENTIALS"</code>.</li>
  <li><strong>Gauge</strong>: <code>labflow_bookings_pending</code> bằng số lượt PENDING trong CSDL; có xuất <code>labflow_events_incomplete</code>.</li>
  <li><strong>Cardinality có giới hạn</strong>: 300 vòng rác (một lượt đặt với mã phòng ngẫu nhiên, một lần đăng nhập email ngẫu nhiên, một GET phòng ngẫu nhiên) thêm tối đa 3 chuỗi <code>labflow_*</code> (không kể bucket).</li>
  <li><strong>Log JSON</strong> với profile <code>prod</code>: mọi dòng log sau khi khởi động đều đọc được thành JSON; đăng nhập với email chứa dấu xuống dòng và một dòng log giả không sinh ra dòng giả nào; <code>X-Request-Id</code> hợp lệ được trả lại và có mặt trong bản ghi log đăng nhập thất bại.</li>
  <li><strong>Tracing</strong>: <code>POST /api/v1/bookings</code> trả <code>X-Trace-Id</code>; Jaeger có trace đó với span tên <code>labflow.booking.create</code>; dòng log nền "[email giả]" mang cùng traceId <em>và</em> requestId.</li>
</ol>
<p>Bộ chấm khởi động ứng dụng với <code>SPRING_PROFILES_ACTIVE=dev,prod</code>, cổng quản trị 8081, lấy mẫu 1.0 và điểm nhận OTLP ở <code>localhost:4318</code>; bạn không phải tự cấu hình ba thứ đó, nhưng mã của bạn phải chạy đúng với chúng.</p>

<h3>Bộ chấm</h3>
<p>Nó chép dự án của bạn, biên dịch trong container JDK 21, khởi động PostgreSQL 16, Redis 7 và Jaeger trong cùng một network namespace (mỗi cái có giới hạn bộ nhớ), rồi gọi API thật. Mật khẩu và khoá JWT sinh mới mỗi lượt và không bao giờ in ra. Khoảng 3–4 phút một lượt:</p>
${MA154_CHAM}

<h3>Kết quả trên máy dựng bài</h3>
${OUT154S}
<p>Bản khởi đầu đã qua mục 1 và 2 (bộ chấm ép cổng quản trị, còn chuỗi bảo mật của Chương 9 trả 401 trên cổng công khai) và mục 8 (không có số đo tự đặt — không có gì để bùng nổ). Mọi thứ cần đến việc của Chương 15 đều trượt: readiness lờ CSDL đứng hình, không có số đo nghiệp vụ, log chữ thường (0/13 dòng đọc được thành JSON), không có traceId.</p>
${OUT154G}
<p>Lời giải chính thức qua cả mười mục. Để ý các con số bộ chấm in ra: 138 dòng bucket cho một URI, readiness <code>000</code> (không trả lời trong 5 giây) trong khi liveness trả 200, và chỉ một chuỗi <code>labflow_*</code> mới sau 300 vòng rác (một mã lỗi lần đầu xuất hiện).</p>
${OUT154B}
<p>Bản bẫy thêm một dòng ở đầu handler đặt phòng: <code>soDo.counter("labflow.booking.requests", "lab", r.labCode()).increment()</code> — "đếm request theo từng phòng, có ích mà". Mã phòng do client gửi, trước khi ai kiểm nó có tồn tại không: 300 vòng rác ⇒ 24 → 325 chuỗi. Mọi thứ khác hoàn hảo, còn kẻ tấn công có một vòng lặp là nắm luôn hệ thống giám sát của bạn.</p>
<p>Một ghi chú thật thà từ lúc dựng lab: ở bản bẫy đầu tiên, dòng đếm nằm <em>sau</em> bộ giới hạn tần suất (5 lượt đặt mỗi phút mỗi người, Chương 13). Bộ chấm dùng một tài khoản, nên bộ giới hạn cắt rác còn năm request và bản bẫy được 10/10. Kẻ tấn công thật dùng nhiều tài khoản. Đừng để một lớp bảo vệ làm bạn tin một lỗi khác không tồn tại — hãy kiểm chúng riêng rẽ.</p>

${giai('Xem lời giải chính thức (tự làm trước!)', `<p>Mọi thứ trong lời giải là mã bạn đã gặp ở bài 15.1–15.3; đây là danh sách nó nằm ở đâu:</p>
<ul>
  <li><code>pom.xml</code>: <code>micrometer-registry-prometheus</code>, <code>spring-boot-starter-opentelemetry</code>, <code>datasource-micrometer-spring-boot</code>, <code>spring-modulith-starter-insight</code>.</li>
  <li><code>application.properties</code>: khối Chương 15 của bài 15.1 (cổng quản trị, exposure <code>health,info,prometheus</code>, <code>show-details=when-authorized</code>, nhóm readiness <code>readinessState,db</code>), các dòng histogram và tracing của 15.2–15.3, <code>management.otlp.metrics.export.enabled=false</code>, <code>spring.task.execution.propagate-context=true</code>.</li>
  <li><code>application-prod.properties</code>: <code>logging.structured.format.console=ecs</code>.</li>
  <li><code>BaoMat</code>: cho phép <code>EndpointRequest.to("health","info","prometheus")</code>, <code>EndpointRequest.toAnyEndpoint()</code> cho MANAGER, <code>addFilterAfter(new NguoiDungMdc(), BearerTokenAuthenticationFilter.class)</code>.</li>
  <li><code>shared/QuanSatCauHinh</code>: filter <code>MaRequest</code> (kiểm <code>X-Request-Id</code>, MDC, header <code>X-Trace-Id</code>) và dòng đăng ký <code>Slf4jThreadLocalAccessor("requestId","userId")</code>.</li>
  <li><code>XuLyLoi</code>: mọi handler trả qua <code>dem(…)</code> ⇒ <code>labflow.api.errors{code,status}</code>.</li>
  <li><code>BookingService</code>: <code>labflow.bookings.placed{lab,status}</code> với mã phòng <em>lấy từ catalog</em>, <code>labflow.bookings.replayed</code>; <code>BookingController</code>: Observation <code>labflow.booking.create</code> và một dòng INFO mỗi lượt đặt.</li>
  <li><code>SoDoBooking</code> / <code>SoDoThongBao</code>: hai gauge; <code>AuthController</code>: <code>labflow.auth.failures</code>, dòng WARN, và <code>toString()</code> không có mật khẩu trong <code>DangNhap</code>/<code>DangKy</code>.</li>
</ul>`)}

<h3>🎤 Chương 15 — phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Người dùng kêu ứng dụng chậm. Bạn điều tra thế nào?"</strong> — Bảng điều khiển trước (p95 và tỉ lệ lỗi theo endpoint, theo instance — mọi người hay chỉ một endpoint/instance?), rồi một trace chậm của endpoint đó để xem span nào ngốn thời gian, rồi log của traceId đó để xem chi tiết. Số đo → trace → log.</li>
  <li><strong>"Liveness khác readiness, mỗi cái chứa gì?"</strong> — Khởi động lại khi treo, so với ngừng chuyển request khi chưa sẵn sàng; liveness không có CSDL, readiness chỉ có phụ thuộc bắt buộc. Đã đo: CSDL đứng hình không được làm ứng dụng khởi động lại; cache dừng không được kéo ứng dụng khỏi load balancer.</li>
  <li><strong>"Bảo vệ Actuator thế nào?"</strong> — Mở tối thiểu, cổng quản trị ở mạng nội bộ, chi tiết cho vai trò vận hành, không bao giờ để heapdump/env/loggers công khai; dẫn vụ lộ heap dump VW/Cariad (2024).</li>
  <li><strong>"Sao không lấy trung bình p95 của các instance, và high cardinality là gì?"</strong> — Cộng bucket rồi mới tính; lấy trung bình ra 680 ms thay vì 354 ms. Nhãn không giới hạn từ dữ liệu người dùng sinh một chuỗi cho mỗi giá trị; dùng nhãn có giới hạn và trần bằng MeterFilter.</li>
  <li><strong>"Log của job bất đồng bộ không có traceId, còn log DEBUG lại hiện mật khẩu. Giải thích cả hai."</strong> — Biến gắn luồng không tự qua pool — truyền ngữ cảnh + đăng ký khoá MDC; <code>toString()</code> tự sinh của record bị DEBUG của Spring in ra — tự viết lại, không bao giờ ghi log thân/header request.</li>
</ol>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Mười mục kiểm biến câu "bọn em có giám sát rồi" thành thứ đo được: probe an toàn, số đo nghiệp vụ, nhãn có giới hạn, log JSON, mã request, trace qua nhiều luồng.</li>
  <li>Khởi đầu 3/10, lời giải chính thức 10/10, bẫy đếm theo mã phòng 9/10 — và bộ giới hạn tần suất suýt giấu nó đi.</li>
  <li>Chương 15 trong một dòng: không nhìn thấy thì không sửa được, và thứ bạn mở ra để nhìn không được thành vụ lộ tiếp theo.</li>
</ul>
</div>
`;

const Q = (question, options, correctIndex) => ({ question, options, correctIndex, points: 1 });
const QUIZ15 = [
  Q('LabFlow carries the RabbitMQ starter but no broker is running. What did the three health endpoints return?|||LabFlow có starter RabbitMQ nhưng không broker nào chạy. Ba endpoint health trả gì?', [
    'All three 503|||Cả ba 503',
    '/health 503, liveness 200, readiness 200|||/health 503, liveness 200, readiness 200',
    'All three 200: RabbitMQ is ignored|||Cả ba 200: RabbitMQ bị bỏ qua',
    'liveness 503, the others 200|||liveness 503, hai cái kia 200',
  ], 1),
  Q('PostgreSQL is frozen (docker pause). Which probe should fail, and what did readiness do?|||PostgreSQL đứng hình (docker pause). Probe nào nên hỏng, readiness đã làm gì?', [
    'Liveness should fail; readiness answered 200|||Liveness nên hỏng; readiness trả 200',
    'Readiness should fail; it gave no answer within 15 s (Hikari waits 30 s)|||Readiness nên hỏng; nó không trả lời trong 15 giây (Hikari chờ 30 giây)',
    'Both should fail immediately|||Cả hai nên hỏng ngay',
    'Neither: the database is not the app|||Không cái nào: CSDL không phải ứng dụng',
  ], 1),
  Q('With exposure=* and heapdump opened, /actuator/env showed ****** for the JWT secret. What did the heap dump contain?|||Với exposure=* và mở heapdump, /actuator/env hiện ****** cho khoá JWT. Heap dump chứa gì?', [
    'Only masked values too|||Cũng chỉ giá trị đã che',
    'Nothing useful: it is binary|||Không có gì dùng được: nó là nhị phân',
    'The JWT key, the DB password and a student\'s login password in plain text|||Khoá JWT, mật khẩu CSDL và mật khẩu đăng nhập của sinh viên dạng rõ',
    'Only class names|||Chỉ tên lớp',
  ], 2),
  Q('A counter is named "labflow.bookings.created". Under which name does Prometheus show it?|||Một counter tên "labflow.bookings.created". Prometheus hiện nó dưới tên nào?', [
    'labflow_bookings_created_total|||labflow_bookings_created_total',
    'labflow_bookings_total — the _created suffix is cut|||labflow_bookings_total — đuôi _created bị cắt',
    'labflow.bookings.created|||labflow.bookings.created',
    'It is rejected at startup|||Bị từ chối lúc khởi động',
  ], 1),
  Q('/dev/the-sai?nguoi=… was called with 20,000 different values. What happened?|||/dev/the-sai?nguoi=… được gọi với 20.000 giá trị khác nhau. Chuyện gì xảy ra?', [
    'One series with value 20,000|||Một chuỗi giá trị 20.000',
    '20,000 series; the scrape page grew about 31×|||20.000 chuỗi; trang scrape lớn lên khoảng 31 lần',
    'Micrometer keeps only the first 100 by default|||Micrometer mặc định chỉ giữ 100 cái đầu',
    'Prometheus refused to scrape|||Prometheus từ chối scrape',
  ], 1),
  Q('Instance A: 94 % at 10 ms, 6 % at 1 s. Which numbers were measured?|||Instance A: 94 % mất 10 ms, 6 % mất 1 giây. Đo được những số nào?', [
    'Average ≈ 73 ms, p95 ≈ 1,007 ms|||Trung bình ≈ 73 ms, p95 ≈ 1.007 ms',
    'Average ≈ 1 s, p95 ≈ 10 ms|||Trung bình ≈ 1 giây, p95 ≈ 10 ms',
    'Average and p95 both ≈ 70 ms|||Trung bình và p95 đều ≈ 70 ms',
    'p50 ≈ 1 s|||p50 ≈ 1 giây',
  ], 0),
  Q('Two instances: p95 of A = 1,007 ms, p95 of B = 353 ms. What is the correct system p95?|||Hai instance: p95 của A = 1.007 ms, p95 của B = 353 ms. p95 đúng của cả hệ thống là?', [
    '680 ms — the average of the two|||680 ms — trung bình hai số',
    '1,007 ms — the worst one|||1.007 ms — số tệ nhất',
    '354 ms — computed from the summed buckets|||354 ms — tính từ bucket đã cộng',
    'It cannot be computed|||Không tính được',
  ], 2),
  Q('A student\'s email field contains "\\n" followed by a fake log line. With JSON (ECS) logs, what appears?|||Ô email của sinh viên chứa "\\n" rồi một dòng log giả. Với log JSON (ECS), log hiện gì?', [
    'Two lines, the second one forged|||Hai dòng, dòng thứ hai là giả',
    'One JSON line; the newline is escaped inside "message"|||Một dòng JSON; dấu xuống dòng bị escape trong "message"',
    'The request is rejected with 400|||Request bị từ chối với 400',
    'Nothing is logged|||Không ghi log gì',
  ], 1),
  Q('spring.task.execution.propagate-context=true, no other change. What did the async email log line show?|||spring.task.execution.propagate-context=true, không đổi gì khác. Dòng log email chạy nền hiện gì?', [
    'Neither traceId nor requestId|||Không traceId, không requestId',
    'traceId, but not requestId|||Có traceId, không có requestId',
    'requestId, but not traceId|||Có requestId, không có traceId',
    'Both|||Cả hai',
  ], 1),
  Q('logging.level.web=DEBUG while a student logs in. What did Spring print?|||logging.level.web=DEBUG khi một sinh viên đăng nhập. Spring đã in gì?', [
    'Nothing about the body|||Không gì về thân request',
    'DangNhap[email=…, password=<the real password>] from the record\'s toString()|||DangNhap[email=…, password=<mật khẩu thật>] từ toString() của record',
    'The password hash|||Giá trị băm của mật khẩu',
    'password=*** by default|||Mặc định password=***',
  ], 1),
];
const L = (n, slug, en, vi, description, content) => ({
  title: `15.${n} — ${en}|||15.${n} — ${vi}`, slug, type: 'LESSON', isFreePreview: false, description, content,
});

export default {
  title: 'Chapter 15 — Observability: Actuator, metrics and logs|||Chương 15 — Quan sát hệ thống: Actuator, số đo và log',
  description: 'Thấy được LabFlow đang chạy, đo thật trên một và hai instance với PostgreSQL, Redis, Prometheus, Grafana và Jaeger: Actuator an toàn (cổng quản trị, liveness/readiness, heapdump lộ khoá JWT và mật khẩu — vụ VW/Cariad 2024); Micrometer và Prometheus (số đo nghiệp vụ, bùng nổ nhãn 20.000 chuỗi, trung bình 73 ms so với p95 1.007 ms, gộp p95 đúng cách, cảnh báo, Grafana); log JSON chống giả dòng, MDC, tracing OpenTelemetry qua luồng nền, mật khẩu lọt vào DEBUG; lab có bộ chấm 10 mục.',
  lessons: [
    L(1, 'sb-15-1-actuator', 'Spring Boot Actuator, safely', 'Spring Boot Actuator, an toàn',
      'Cổng quản trị 8081, ba endpoint, chi tiết chỉ cho MANAGER; RabbitMQ thiếu làm /health 503 trong khi liveness/readiness 200; Redis dừng vẫn sẵn sàng, PostgreSQL đứng hình thì readiness treo còn liveness 15 ms; cấu hình kiểu hướng dẫn trên mạng lộ heapdump 168 MB chứa khoá JWT, mật khẩu CSDL và mật khẩu sinh viên, loggers cho người lạ đổi mức log; vụ VW/Cariad 2024.',
      L151_EN + L151_VI),
    L(2, 'sb-15-2-micrometer-prometheus', 'Metrics with Micrometer and Prometheus', 'Số đo với Micrometer và Prometheus',
      'Đọc /actuator/prometheus (69 bucket mỗi tổ hợp nhãn, URI dạng mẫu); counter, timer qua Observation và gauge cho LabFlow, bẫy đuôi _created; một nhãn từ dữ liệu người dùng sinh 20.000 chuỗi, MeterFilter chặn; trung bình 73 ms so với p95 1.007 ms, trung bình hai p95 ra 680 ms còn cộng bucket ra 354 ms; cảnh báo pending → firing; Grafana nạp từ tệp; Prometheus/Grafana để ngỏ.',
      L152_EN + L152_VI),
    L(3, 'sb-15-3-logging-traceid', 'Structured logs and tracing', 'Log có cấu trúc và tracing',
      'Giả dòng log qua ô email với log chữ thường, log JSON (ECS) chặn được; MDC requestId/userId; trace OpenTelemetry của một lượt đặt 31 span tới Jaeger, mặc định chỉ lấy mẫu 10 %; bốn biến thể truyền ngữ cảnh sang luồng nền (Spring Modulith insight tự gắn decorator); DEBUG in mật khẩu thật từ toString() của record và nguyên JWT; Log4Shell, Twitter/GitHub 2018.',
      L153_EN + L153_VI),
    L(4, 'sb-15-4-lab-15', 'Chapter 15 lab + interview questions', 'Lab chương 15 + câu hỏi phỏng vấn',
      'Lab có bộ chấm 10 mục với PostgreSQL, Redis và Jaeger thật: cổng công khai đóng, probe đúng khi CSDL đứng hình, histogram, số đo lượt đặt và lỗi theo mã, gauge, nhãn có giới hạn trước 300 vòng rác, log JSON không giả được kèm mã request, trace theo lượt đặt vào email chạy nền. Bản khởi đầu 3/10, lời giải 10/10 (ẩn), bẫy đếm theo mã phòng 9/10. Năm câu phỏng vấn của chương.',
      L154_EN + L154_VI),
    {
      title: '15.5 — Chapter 15 quiz|||15.5 — Kiểm tra chương 15',
      slug: 'sb-15-5-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về những gì đã chạy thật trong chương: health tổng và hai probe, CSDL đứng hình, heapdump để ngỏ, đuôi _created, bùng nổ nhãn, trung bình so với p95, gộp p95 hai instance, log injection với JSON, truyền ngữ cảnh sang luồng nền, mật khẩu trong log DEBUG.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every answer is something that ran in this chapter — a health check dragged down by a broker nobody uses, a heap dump with three kinds of password, 20,000 series from one parameter, an average that looked fine, and a DEBUG line that printed a real password.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Đáp án nào cũng là thứ đã chạy trong chương — một health check bị kéo xuống bởi broker không ai dùng, một heap dump chứa ba loại mật khẩu, 20.000 chuỗi từ một tham số, một con số trung bình trông rất ổn, và một dòng DEBUG in ra mật khẩu thật.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ15 },
    },
  ],
};
