/**
 * Spring Boot — Mục 0: Vì sao Spring Boot (soạn 17/11/2026, agent sb trên máy nhà).
 * GIỮ title chương + slug bài đầu của khung (seeder neo chương bằng slug bài đầu: sb-0-8-bat-dau-tai-day).
 * Mọi output trong mục này chạy thật trên máy nhà: Spring Boot 4.1.2, Spring Framework 7.0.10, Java 21.0.12.1 (Temurin),
 * Maven 3.9.16, PostgreSQL 16.15 — mã nguồn lab ở ~/vbg-dp/scratchpad/sb/lab/ (khong-spring, co-spring, cau-truc).
 * KHÔNG dùng backtick trần trong content; mã mẫu đi qua java()/bash()/… của _chung.mjs.
 */
import { java, bash, yml, props, xml, sql, out, tl, giai } from './_chung.mjs';

/* ═══════════════════════════ 0.8 — Bắt đầu tại đây (1/2) ═══════════════════════════ */
const MA_CONTROLLER = java(`
@RestController
public class LabController {
    record Lab(long id, String name, String building, int capacity) {}

    private final JdbcClient db;

    LabController(JdbcClient db) { this.db = db; }

    @GetMapping("/labs")
    List<Lab> list(@RequestParam(required = false) String building) {
        if (building == null)
            return db.sql("SELECT id, name, building, capacity FROM lab").query(Lab.class).list();
        return db.sql("SELECT id, name, building, capacity FROM lab WHERE building = ?")
                 .param(building).query(Lab.class).list();
    }
}`);
const OUT_LABS = out(`$ curl -s localhost:8081/labs
[{"id":1,"name":"Lab AI","building":"Alpha","capacity":30},{"id":2,"name":"Lab IoT","building":"Beta","capacity":24},{"id":3,"name":"Lab Mạng","building":"Alpha","capacity":36}]
$ curl -s 'localhost:8081/labs?building=Alpha'
[{"id":1,"name":"Lab AI","building":"Alpha","capacity":30},{"id":3,"name":"Lab Mạng","building":"Alpha","capacity":36}]`);
const OUT_KHOI_DONG = out(`  .   ____          _            __ _ _
 /\\\\ / ___'_ __ _ _(_)_ __  __ _ \\ \\ \\ \\
( ( )\\___ | '_ | '_| | '_ \\/ _\` | \\ \\ \\ \\
 \\\\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\\__, | / / / /
 =========|_|==============|___/=/_/_/_/

 :: Spring Boot ::                (v4.1.2)

… Starting LabflowApplication v0.0.1-SNAPSHOT using Java 21.0.12.1 with PID 1
… Tomcat initialized with port 8081 (http)
… Starting Servlet engine: [Apache Tomcat/11.0.27]
… Tomcat started on port 8081 (http) with context path '/'
… Started LabflowApplication in 1.318 seconds (process running for 1.656)`);

const L08_EN = `
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here (1/2)</span>
<h2>What Spring Boot is, where it came from, and why so much of enterprise Vietnam runs on it</h2>
<p class="lead">Hello, and welcome. If you open any job board in Vietnam and filter for “Backend Java”, almost every posting has the same two words in it: <strong>Spring Boot</strong>. Banks, telecoms, insurance companies, outsourcing companies that build systems for Japan and Europe — they run on it. This lesson does not ask you to install anything yet. It explains what Spring Boot actually is, what problem it was invented to solve, and what it will do for you — in your SWP391 project, in an interview, and in your first job.</p>

<h3>Spring Boot in one sentence — then in a garage</h3>
<p><strong>Spring Boot is a way to build a Java server program (usually an HTTP API) where the framework creates and connects the parts for you, so you write only the parts that are about your business.</strong></p>
<p>Think of building a car. <strong>Java</strong> is steel and rubber. <strong>Spring Framework</strong> is a huge, well-organised parts shop plus a workshop manager who knows how to bolt any part to any other part. <strong>Spring Boot</strong> is the same shop selling you a car that is <em>already assembled and starts on the first turn of the key</em> — but with the bonnet unlocked, so you can still swap any part you like. That last bit matters: Boot is not a different framework from Spring; it is Spring with sensible defaults chosen for you.</p>
<p>Here is what “only the business part” looks like. This is a complete endpoint that lists the computer labs of LabFlow — the project you will build in this course — reading them from PostgreSQL:</p>
${MA_CONTROLLER}
<p>And here it is, really running on the machine this course was written on:</p>
${OUT_LABS}
<p>Notice what is <em>not</em> in that code: no line opens a network socket, parses an HTTP request, opens or closes a database connection, or turns a Java object into JSON. All of that still happens — Spring Boot does it. When the program starts, it prints a banner and tells you exactly what it set up:</p>
${OUT_KHOI_DONG}
<p>“Tomcat started on port 8081” — you never wrote a web server, but there is one inside your program. 1.3 seconds from nothing to serving requests. Lesson 0.9 shows you the same endpoint written <em>without</em> Spring: 58 lines, slower, and with a security hole an attacker can use to read the database version in one request.</p>

<h3>Seven words people mix up</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">JVM / JRE / JDK</span><span class="v">The JVM runs compiled Java (bytecode). The JRE is the JVM plus the standard library — enough to <em>run</em>. The JDK adds the compiler and tools — what you install to <em>write</em> Java. Since Java 11 you simply install a JDK.</span></div>
  <div class="kv"><span class="k">Spring Framework</span><span class="v">The core library (2003–): a container that creates objects and wires them together, plus modules for web, data, transactions, testing.</span></div>
  <div class="kv"><span class="k">Spring Boot</span><span class="v">A layer on top (2014–) that configures Spring automatically, embeds the web server, and packages everything into one runnable <code>.jar</code>.</span></div>
  <div class="kv"><span class="k">Spring MVC</span><span class="v">The web module of Spring Framework: controllers, <code>@GetMapping</code>, JSON in and out. Spring Boot uses it underneath.</span></div>
  <div class="kv"><span class="k">Jakarta EE (formerly Java EE / J2EE)</span><span class="v">The official “enterprise Java” standards: Servlet, JPA, Bean Validation… Spring <em>uses</em> several of them (Servlet, JPA) but is not one of them.</span></div>
  <div class="kv"><span class="k">Tomcat</span><span class="v">A Servlet container — the HTTP server that actually receives requests. In PRJ301 you deployed a <code>.war</code> <em>into</em> Tomcat; with Boot, Tomcat lives <em>inside</em> your <code>.jar</code>.</span></div>
  <div class="kv"><span class="k">JPA / Hibernate / Spring Data JPA</span><span class="v">JPA is the standard for mapping objects to tables; Hibernate is the most-used implementation; Spring Data JPA writes repository classes for you on top of it (Chapter 6).</span></div>
</div>

<h3>A short history — with sources</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1999–2002</span><span class="lz-t">J2EE and the EJB pain</span><span class="lz-d">Enterprise Java meant Enterprise JavaBeans: a business object needed several interfaces, XML deployment descriptors and a heavyweight application server just to run, and could hardly be tested outside it.</span></div>
  <div class="lz-step"><span class="lz-k">Oct 2002</span><span class="lz-t">A book with a framework inside</span><span class="lz-d">Rod Johnson publishes <em>Expert One-on-One J2EE Design and Development</em> (Wrox). Its ~30,000 lines of sample code argue that plain Java objects, wired together by a container, are enough. Readers ask to use the code.</span></div>
  <div class="lz-step"><span class="lz-k">2003–2004</span><span class="lz-t">Spring is born</span><span class="lz-d">The code becomes an open-source project named “Spring” (“a fresh start after the winter of J2EE”) in 2003; Spring Framework 1.0 ships in March 2004 under the Apache 2.0 licence.</span></div>
  <div class="lz-step"><span class="lz-k">2004–2013</span><span class="lz-t">Spring wins — and grows its own XML problem</span><span class="lz-d">Spring replaces EJB in most companies, but a real application now needs hundreds of lines of XML or Java configuration before the first endpoint answers.</span></div>
  <div class="lz-step"><span class="lz-k">Oct 2012</span><span class="lz-t">The request that started Boot</span><span class="lz-d">Mike Youngstrom files Jira issue SPR-9888, “Improved support for ‘containerless’ web application architectures”: start a web app from a <code>main()</code> method, no external server, no XML. The Spring team answers with a new project.</span></div>
  <div class="lz-step"><span class="lz-k">Apr 2014</span><span class="lz-t">Spring Boot 1.0</span><span class="lz-d">Auto-configuration, “starter” dependencies, embedded Tomcat and an executable jar. “Convention over configuration” arrives in Java.</span></div>
  <div class="lz-step"><span class="lz-k">2018 · 2022</span><span class="lz-t">Boot 2 and Boot 3</span><span class="lz-d">Boot 2.0 (March 2018) adds reactive web (WebFlux) and locks down Actuator by default. Boot 3.0 (November 2022) requires Java 17 and moves from <code>javax.*</code> to <code>jakarta.*</code> packages — the reason many old tutorials no longer compile.</span></div>
  <div class="lz-step"><span class="lz-k">Nov 2025 · 2026</span><span class="lz-t">Boot 4 — the version this course uses</span><span class="lz-d">Spring Boot 4.0 ships with Spring Framework 7, Jakarta EE 11, Jackson 3 and smaller, modular starters (November 2025). This course is written and measured on <strong>Boot 4.1.2</strong> with Java 21. When something differs from Boot 3 — the version most StackOverflow answers still show — the lesson says so.</span></div>
</div>
<p>The company behind Spring changed hands several times — SpringSource, then VMware (2009), Pivotal (2013), VMware again, and Broadcom since it bought VMware (November 2023). The licence stayed open source throughout.</p>

<h3>Why enterprises — and Vietnamese ones in particular — still choose it</h3>
<ul>
  <li><strong>The type system catches mistakes before customers do.</strong> A bank cannot discover in production that a function received a string instead of an amount. Java checks it at compile time.</li>
  <li><strong>It is boring on purpose.</strong> Every Boot release has a published support window, a migration guide and security advisories. A system built in 2015 can still be maintained by someone hired in 2026 — they will recognise <code>@Service</code> and <code>@Transactional</code> instantly.</li>
  <li><strong>The ecosystem already covers enterprise needs:</strong> transactions across several operations, single sign-on with corporate identity servers, message queues (Kafka, RabbitMQ), batch jobs at night, metrics for operations teams.</li>
  <li><strong>Hiring is easy.</strong> Universities — including FPT University with PRO192 and PRJ301 — teach Java, so companies can hire and train in Java at scale. Outsourcing companies that build systems for Japanese and European clients use it because their clients do.</li>
  <li><strong>The JVM is fast once warm</strong> and has excellent tooling to look inside a running server (Chapter 2 and Chapter 16).</li>
</ul>

<h3>Spring Boot or Node.js? — the interview question you will get</h3>
<p>You may have taken the Node.js course on this site. The honest answer is “both are good; they make different trade-offs”, and a good candidate can name the trade-offs:</p>
<table>
<thead><tr><th></th><th>Spring Boot (Java)</th><th>Node.js + Express</th></tr></thead>
<tbody>
<tr><td>Concurrency model</td><td>A thread per request (Tomcat pool of 200); since Java 21, cheap <em>virtual threads</em> too</td><td>One thread, an event loop, non-blocking I/O</td></tr>
<tr><td>CPU-heavy work</td><td>Fine — other threads keep serving</td><td>Blocks every request unless moved to a worker</td></tr>
<tr><td>Typing</td><td>Static, checked by the compiler</td><td>Dynamic (TypeScript adds checking on top)</td></tr>
<tr><td>Start-up / memory</td><td>Measured on this machine for the LabFlow endpoint above: started in 1.3 s, 248 MB of memory (default JVM settings; Chapter 16 shrinks it)</td><td>A bare Node 22 HTTP server: listening after 93 ms, 56 MB</td></tr>
<tr><td>Batteries</td><td>Transactions, security, data, validation built in and integrated</td><td>Pick and glue libraries yourself</td></tr>
<tr><td>Typical home</td><td>Banks, telecoms, large internal systems, long-lived products</td><td>Startups, realtime apps, full-stack JavaScript teams</td></tr>
</tbody>
</table>
<div class="callout ok"><strong>How to answer in an interview:</strong> “Spring Boot gives me a complete, integrated platform — transactions, security, data access — with strong typing and a thread-per-request model that tolerates CPU work; Node gives me fast start-up and a lightweight event loop ideal for I/O-heavy and realtime services. For a banking back office I would choose Spring; for a chat gateway or a small BFF, Node.” Then give one example from your own project.</div>

<h3>What this does for you — concretely</h3>
<ul>
  <li><strong>SWP391 and your capstone.</strong> A team of five can split a Spring Boot project cleanly — controller, service, repository — and the framework stops each person from reinventing connection handling and error formats.</li>
  <li><strong>Interviews.</strong> “Explain dependency injection”, “What does <code>@Transactional</code> do and when does it <em>not</em> work?”, “How do you fix N+1?” are standard questions for Java interns and freshers. Every chapter ends with the questions interviewers really ask and how to answer them.</li>
  <li><strong>The first job.</strong> On day one you will open a Spring Boot repository someone else wrote. This course makes sure nothing in it looks like magic.</li>
</ul>

<h3>What you will be able to build by the end</h3>
<p>A production-style <strong>LabFlow API</strong> — booking computer labs and their devices — with: modern Java 21; a clean controller/service/repository structure; validation and standard error responses (RFC 9457); PostgreSQL through Spring Data JPA without N+1 queries; schema history in Flyway; login with JWT and role-based permissions; tests against a real PostgreSQL in Testcontainers; OpenAPI docs; a Redis cache; background events; metrics; a Docker image and a CI pipeline — plus a written explanation of every design decision for your CV.</p>

<h3>The roadmap — 6 stages</h3>
<div class="lz-map">
  <div class="lz-stage">Stage 1 · Foundations</div>
  <div class="lz-node"><div class="lz-badge">0</div><div class="lz-nbody"><div class="lz-ntitle">Why Spring Boot · installing · anatomy of a project</div><div class="lz-nsub">This section</div></div></div>
  <div class="lz-node"><div class="lz-badge">1–2</div><div class="lz-nbody"><div class="lz-ntitle">⭐ Modern Java for the backend</div><div class="lz-nsub">Records, sealed types, pattern matching, generics, Stream, Optional, collections, concurrency, virtual threads, JVM and GC</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Spring core, from the inside</div><div class="lz-nsub">IoC container, DI, bean lifecycle, proxies, auto-configuration, profiles</div></div></div>
  <div class="lz-stage">Stage 2 · Building the API</div>
  <div class="lz-node"><div class="lz-badge">4–5</div><div class="lz-nbody"><div class="lz-ntitle">REST controllers · validation and errors</div><div class="lz-nsub">DTOs, Jackson, the request pipeline, Bean Validation, ProblemDetail</div></div></div>
  <div class="lz-stage">Stage 3 · Data</div>
  <div class="lz-node"><div class="lz-badge">6–8</div><div class="lz-nbody"><div class="lz-ntitle">Spring Data JPA + PostgreSQL · JPA in depth · Flyway</div><div class="lz-nsub">Persistence context, relations, N+1, transactions, propagation, isolation, locking, migrations</div></div></div>
  <div class="lz-stage">Stage 4 · Safety</div>
  <div class="lz-node"><div class="lz-badge">9–11</div><div class="lz-nbody"><div class="lz-ntitle">Spring Security + JWT · the hacker's view · testing</div><div class="lz-nsub">Filter chain, roles, mass assignment, IDOR, injection; JUnit 5, Mockito, @WebMvcTest, Testcontainers</div></div></div>
  <div class="lz-stage">Stage 5 · Real systems</div>
  <div class="lz-node"><div class="lz-badge">12–16</div><div class="lz-nbody"><div class="lz-ntitle">OpenAPI + React · Redis · events and queues · observability · performance</div><div class="lz-nsub">What makes an API pleasant, fast and visible in production</div></div></div>
  <div class="lz-stage">Stage 6 · Shipping</div>
  <div class="lz-node"><div class="lz-badge">17–18</div><div class="lz-nbody"><div class="lz-ntitle">Docker + CI · the LabFlow capstone</div><div class="lz-nsub">One command brings the whole system up; a timed practical exam at the end</div></div></div>
</div>

<h3>What you need before you start</h3>
<ul>
  <li>Object-oriented programming in any language: class, object, interface, inheritance. PRO192 is enough. Chapters 1–2 rebuild the <em>modern</em> Java you need from there.</li>
  <li>Basic SQL: <code>SELECT … WHERE</code>, <code>INSERT</code>, a primary key. Chapter 6 explains the rest as it goes.</li>
  <li>A computer that can run Docker (for PostgreSQL) — lesson 0.1 walks through it on Windows, macOS and Linux.</li>
  <li>You do <em>not</em> need PRJ301, Servlet/JSP or the Node.js course. When something from them helps, the lesson explains it in place.</li>
</ul>
<div class="callout">Time budget: about <strong>3–4 hours per chapter</strong> if you type every example and do the lab. Around 70 hours for the whole course. Speed is not the goal — being able to rebuild LabFlow from memory is.</div>

<h3>🎤 What interviewers ask about this lesson</h3>
<ol>
  <li><strong>“What is the difference between Spring and Spring Boot?”</strong> — Spring Framework is the container and the modules (web, data, transactions). Spring Boot is an opinionated layer on top: auto-configuration based on what is on the classpath, starter dependencies, an embedded server and an executable jar. Boot does not replace Spring; it configures it.</li>
  <li><strong>“Why would a company choose Java/Spring over Node.js?”</strong> — Static typing, a complete integrated ecosystem (transactions, security, data), long support windows, threads that tolerate CPU work, and a large hiring pool. Mention the trade-off: slower start-up and more memory.</li>
  <li><strong>“What changed from Spring Boot 2 to 3, and 3 to 4?”</strong> — 3: Java 17 baseline and <code>javax</code> → <code>jakarta</code>. 4: Spring Framework 7, Jakarta EE 11, Jackson 3, modular starters. Knowing this shows you read release notes, not just tutorials.</li>
</ol>

<h3>🧪 Practice (10 minutes)</h3>
<div class="callout ok"><ol>
  <li>Open <a href="https://start.spring.io" target="_blank" rel="noopener">start.spring.io</a> and click <em>ADD DEPENDENCIES</em>. Find three dependencies whose names you recognise from this lesson (hint: Web, JDBC, PostgreSQL Driver).</li>
  <li>Open a job board (ITviec, TopDev, LinkedIn) and read three “Java Backend Intern/Fresher” postings. Write down every technology they list.</li>
  <li>Next to each technology, write the chapter of the roadmap above that teaches it.</li>
</ol>
<p><strong>Done when:</strong> you have a list of 10+ technologies from real postings, each mapped to a chapter. Keep it — you will tick them off as you go.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Spring Framework</span><span class="v">The core container and modules that create and connect your objects.</span></div>
  <div class="kv"><span class="k">Spring Boot</span><span class="v">Spring with auto-configuration, starters, an embedded server and an executable jar.</span></div>
  <div class="kv"><span class="k">Auto-configuration</span><span class="v">Boot looks at your classpath and settings and creates the beans you would otherwise configure by hand.</span></div>
  <div class="kv"><span class="k">Starter</span><span class="v">One dependency that pulls in a tested set of libraries for one job, e.g. <code>spring-boot-starter-webmvc</code>.</span></div>
  <div class="kv"><span class="k">Embedded server</span><span class="v">The web server (Tomcat) runs inside your program instead of your program being deployed into it.</span></div>
  <div class="kv"><span class="k">Jakarta EE</span><span class="v">The enterprise Java standards (Servlet, JPA, Validation), renamed from Java EE; packages are <code>jakarta.*</code>.</span></div>
  <div class="kv"><span class="k">LTS</span><span class="v">Long-term support release (Java 17, 21, 25) — what companies run in production.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Spring Boot = Spring Framework + sensible defaults: you write business code; Boot creates the server, the connection pool and the JSON handling.</li>
  <li>Spring was born (2003–2004) as a reaction to heavy EJB; Boot (2014) was born as a reaction to Spring's own configuration weight.</li>
  <li>This course uses Boot 4.1.2 on Java 21 and points out where Boot 3 differs.</li>
  <li>Companies choose it for typing, a complete ecosystem, long support and hiring; Node.js trades those for start-up speed and lightness.</li>
  <li>You will build the LabFlow API from zero to a Dockerised, tested, secured service.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://spring.io/projects/spring-boot', '🍃', 'spring.io — Spring Boot project page', 'Release list, support windows and the official reference documentation.')}
${tl('https://docs.spring.io/spring-boot/reference/', '📘', 'Spring Boot reference documentation', 'The manual. Chapter “Developing with Spring Boot” matches Section 0 of this course.')}

<h3>Sources</h3>
<ul>
  <li>Rod Johnson, <em>Expert One-on-One J2EE Design and Development</em>, Wrox, 2002 — and the history in “Spring Framework” on Wikipedia: <a href="https://en.wikipedia.org/wiki/Spring_Framework" target="_blank" rel="noopener">en.wikipedia.org/wiki/Spring_Framework</a></li>
  <li>SPR-9888 “Improved support for ‘containerless’ web application architectures” (2012), now GitHub issue spring-projects/spring-framework#14521: <a href="https://github.com/spring-projects/spring-framework/issues/14521" target="_blank" rel="noopener">github.com/spring-projects/spring-framework/issues/14521</a></li>
  <li>Spring Boot 1.0 GA announcement (April 2014): <a href="https://spring.io/blog/2014/04/01/spring-boot-1-0-ga-released" target="_blank" rel="noopener">spring.io/blog/2014/04/01/spring-boot-1-0-ga-released</a></li>
  <li>Spring Boot 3.0 release notes (Java 17, Jakarta EE 9+): <a href="https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-3.0-Release-Notes" target="_blank" rel="noopener">github.com/spring-projects/spring-boot/wiki/Spring-Boot-3.0-Release-Notes</a></li>
  <li>Spring Boot 4.0 release notes: <a href="https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.0-Release-Notes" target="_blank" rel="noopener">github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.0-Release-Notes</a></li>
  <li>Broadcom completes acquisition of VMware (22 Nov 2023): <a href="https://investors.broadcom.com/news-releases/news-release-details/broadcom-completes-acquisition-vmware" target="_blank" rel="noopener">investors.broadcom.com</a></li>
</ul>
</div>
`;

const L08_VI = `
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây (1/2)</span>
<h2>Spring Boot là gì, ra đời thế nào, và vì sao doanh nghiệp Việt Nam vẫn chạy trên nó</h2>
<p class="lead">Chào bạn. Mở bất kỳ trang tuyển dụng nào ở Việt Nam, lọc "Backend Java", gần như tin nào cũng có đúng hai chữ: <strong>Spring Boot</strong>. Ngân hàng, nhà mạng, bảo hiểm, các công ty outsource làm hệ thống cho Nhật và châu Âu — họ chạy trên nó. Bài này chưa bắt bạn cài gì cả. Bài giải thích Spring Boot thật ra là gì, nó được tạo ra để giải quyết chuyện gì, và nó giúp gì cho <em>bạn</em> — ở đồ án SWP391, ở buổi phỏng vấn, và ở công việc đầu tiên.</p>

<h3>Spring Boot trong một câu — rồi trong một xưởng ô tô</h3>
<p><strong>Spring Boot là cách viết một chương trình máy chủ bằng Java (thường là một HTTP API) mà framework tự tạo và tự nối các bộ phận giúp bạn, để bạn chỉ viết phần thuộc về nghiệp vụ của mình.</strong></p>
<p>Hãy nghĩ tới việc làm một chiếc ô tô. <strong>Java</strong> là thép và cao su. <strong>Spring Framework</strong> là một cửa hàng phụ tùng khổng lồ, ngăn nắp, kèm một quản đốc xưởng biết lắp bất kỳ bộ phận nào vào bất kỳ bộ phận nào. <strong>Spring Boot</strong> là chính cửa hàng đó bán cho bạn một chiếc xe <em>đã lắp sẵn, vặn chìa là nổ máy</em> — nhưng nắp capo không khoá, bạn vẫn thay được bất kỳ món nào. Ý cuối rất quan trọng: Boot không phải một framework khác Spring; nó chính là Spring với các lựa chọn mặc định hợp lý đã được chọn sẵn.</p>
<p>"Chỉ viết phần nghiệp vụ" trông thế này. Đây là một endpoint hoàn chỉnh, liệt kê các phòng máy của LabFlow — dự án bạn sẽ xây suốt khoá — đọc từ PostgreSQL:</p>
${MA_CONTROLLER}
<p>Và đây là nó chạy thật trên chính máy soạn khoá học:</p>
${OUT_LABS}
<p>Để ý những gì <em>không</em> có trong đoạn mã: không dòng nào mở cổng mạng, phân tích HTTP request, mở hay đóng kết nối cơ sở dữ liệu, hay đổi đối tượng Java thành JSON. Mọi việc đó vẫn xảy ra — Spring Boot làm. Lúc khởi động, chương trình in một biểu ngữ và kể rõ nó đã dựng gì:</p>
${OUT_KHOI_DONG}
<p>"Tomcat started on port 8081" — bạn chưa hề viết web server, nhưng trong chương trình của bạn đã có một cái. 1,3 giây từ con số 0 tới lúc nhận request. Bài 0.9 cho bạn xem cùng endpoint này viết <em>không có</em> Spring: 58 dòng, chậm hơn, và có một lỗ hổng mà kẻ tấn công chỉ cần một request để đọc được phiên bản cơ sở dữ liệu.</p>

<h3>Bảy cụm từ hay bị dùng lẫn</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">JVM / JRE / JDK</span><span class="v">JVM (máy ảo Java) chạy mã Java đã biên dịch (bytecode). JRE = JVM + thư viện chuẩn — đủ để <em>chạy</em>. JDK thêm trình biên dịch và công cụ — thứ bạn cài để <em>viết</em> Java. Từ Java 11 trở đi cứ cài JDK là xong.</span></div>
  <div class="kv"><span class="k">Spring Framework</span><span class="v">Thư viện lõi (từ 2003): một "container" (thùng chứa) tạo đối tượng và nối chúng với nhau, kèm các mô-đun cho web, dữ liệu, giao dịch, kiểm thử.</span></div>
  <div class="kv"><span class="k">Spring Boot</span><span class="v">Lớp phủ bên trên (từ 2014): tự cấu hình Spring, nhúng sẵn web server, đóng gói tất cả thành một tệp <code>.jar</code> chạy được.</span></div>
  <div class="kv"><span class="k">Spring MVC</span><span class="v">Mô-đun web của Spring Framework: controller, <code>@GetMapping</code>, nhận và trả JSON. Spring Boot dùng nó bên dưới.</span></div>
  <div class="kv"><span class="k">Jakarta EE (trước là Java EE / J2EE)</span><span class="v">Bộ chuẩn "Java doanh nghiệp" chính thức: Servlet, JPA, Bean Validation… Spring <em>dùng</em> vài chuẩn trong đó (Servlet, JPA) nhưng bản thân không phải chuẩn Jakarta.</span></div>
  <div class="kv"><span class="k">Tomcat</span><span class="v">Servlet container — HTTP server thật sự nhận request. Ở PRJ301 bạn deploy tệp <code>.war</code> <em>vào trong</em> Tomcat; với Boot, Tomcat nằm <em>bên trong</em> tệp <code>.jar</code> của bạn.</span></div>
  <div class="kv"><span class="k">JPA / Hibernate / Spring Data JPA</span><span class="v">JPA là chuẩn ánh xạ đối tượng ↔ bảng; Hibernate là bản cài đặt phổ biến nhất của chuẩn đó; Spring Data JPA viết sẵn lớp repository cho bạn ở trên cùng (Chương 6).</span></div>
</div>

<h3>Một chút lịch sử — có nguồn</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1999–2002</span><span class="lz-t">J2EE và nỗi khổ EJB</span><span class="lz-d">Java doanh nghiệp thời đó nghĩa là Enterprise JavaBeans: một đối tượng nghiệp vụ cần mấy interface, tệp XML mô tả triển khai và một application server nặng nề mới chạy nổi, gần như không thể test bên ngoài server.</span></div>
  <div class="lz-step"><span class="lz-k">10/2002</span><span class="lz-t">Một cuốn sách có framework bên trong</span><span class="lz-d">Rod Johnson xuất bản <em>Expert One-on-One J2EE Design and Development</em> (Wrox). Khoảng 30.000 dòng mã mẫu trong sách chứng minh: đối tượng Java thường, được một container nối lại với nhau, là đủ. Độc giả xin dùng lại số mã đó.</span></div>
  <div class="lz-step"><span class="lz-k">2003–2004</span><span class="lz-t">Spring ra đời</span><span class="lz-d">Số mã trở thành dự án mã nguồn mở tên "Spring" ("một khởi đầu mới sau mùa đông J2EE") năm 2003; Spring Framework 1.0 phát hành tháng 3/2004 theo giấy phép Apache 2.0.</span></div>
  <div class="lz-step"><span class="lz-k">2004–2013</span><span class="lz-t">Spring thắng — và tự đẻ ra núi XML</span><span class="lz-d">Spring thay EJB ở hầu hết công ty, nhưng một ứng dụng thật lại cần hàng trăm dòng cấu hình XML hoặc Java trước khi endpoint đầu tiên trả lời được.</span></div>
  <div class="lz-step"><span class="lz-k">10/2012</span><span class="lz-t">Lời đề nghị khai sinh Boot</span><span class="lz-d">Mike Youngstrom mở phiếu Jira SPR-9888 "Improved support for 'containerless' web application architectures": khởi động ứng dụng web từ một hàm <code>main()</code>, không cần server bên ngoài, không XML. Đội Spring trả lời bằng một dự án mới.</span></div>
  <div class="lz-step"><span class="lz-k">4/2014</span><span class="lz-t">Spring Boot 1.0</span><span class="lz-d">Tự cấu hình (auto-configuration), dependency "starter", Tomcat nhúng sẵn và tệp jar chạy thẳng. "Quy ước thay cho cấu hình" (convention over configuration) tới với Java.</span></div>
  <div class="lz-step"><span class="lz-k">2018 · 2022</span><span class="lz-t">Boot 2 và Boot 3</span><span class="lz-d">Boot 2.0 (3/2018) thêm web phản ứng (WebFlux) và khoá Actuator lại theo mặc định. Boot 3.0 (11/2022) bắt buộc Java 17 và đổi gói <code>javax.*</code> sang <code>jakarta.*</code> — lý do nhiều hướng dẫn cũ giờ biên dịch không nổi.</span></div>
  <div class="lz-step"><span class="lz-k">11/2025 · 2026</span><span class="lz-t">Boot 4 — phiên bản khoá này dùng</span><span class="lz-d">Spring Boot 4.0 ra cùng Spring Framework 7, Jakarta EE 11, Jackson 3 và các starter nhỏ gọn chia mô-đun (11/2025). Khoá này viết và đo trên <strong>Boot 4.1.2</strong> với Java 21. Chỗ nào khác Boot 3 — phiên bản mà đa số câu trả lời trên StackOverflow vẫn dùng — bài sẽ nói rõ.</span></div>
</div>
<p>Công ty đứng sau Spring đổi chủ mấy lần — SpringSource, rồi VMware (2009), Pivotal (2013), lại VMware, và Broadcom từ khi hãng này mua VMware (11/2023). Giấy phép vẫn là mã nguồn mở suốt quá trình đó.</p>

<h3>Vì sao doanh nghiệp — nhất là ở Việt Nam — vẫn chọn nó</h3>
<ul>
  <li><strong>Hệ thống kiểu bắt lỗi trước khi khách hàng bắt.</strong> Ngân hàng không thể phát hiện trên production rằng một hàm nhận chuỗi chữ thay vì số tiền. Java kiểm chuyện đó ngay lúc biên dịch.</li>
  <li><strong>Nó "nhàm chán" có chủ đích.</strong> Mỗi bản Boot có lịch hỗ trợ công bố trước, hướng dẫn nâng cấp và thông báo bảo mật. Hệ thống viết năm 2015 vẫn bảo trì được bởi người tuyển năm 2026 — họ nhận ra <code>@Service</code> và <code>@Transactional</code> ngay lập tức.</li>
  <li><strong>Hệ sinh thái đã phủ sẵn nhu cầu doanh nghiệp:</strong> giao dịch trải qua nhiều thao tác, đăng nhập một lần với hệ thống định danh của công ty, hàng đợi tin nhắn (Kafka, RabbitMQ), tác vụ chạy lô ban đêm, số đo cho đội vận hành.</li>
  <li><strong>Dễ tuyển người.</strong> Trường đại học — kể cả FPT với PRO192 và PRJ301 — dạy Java, nên công ty tuyển và đào tạo Java ở quy mô lớn được. Công ty outsource làm cho khách Nhật, châu Âu dùng nó vì khách của họ dùng.</li>
  <li><strong>JVM chạy rất nhanh khi đã "nóng máy"</strong> và có công cụ tuyệt vời để nhìn vào bên trong một server đang chạy (Chương 2 và Chương 16).</li>
</ul>

<h3>Spring Boot hay Node.js? — câu phỏng vấn chắc chắn gặp</h3>
<p>Có thể bạn đã học khoá Node.js trên trang này. Câu trả lời trung thực là "cả hai đều tốt, mỗi bên đánh đổi một kiểu", và ứng viên giỏi gọi tên được những đánh đổi đó:</p>
<table>
<thead><tr><th></th><th>Spring Boot (Java)</th><th>Node.js + Express</th></tr></thead>
<tbody>
<tr><td>Mô hình xử lý đồng thời</td><td>Mỗi request một luồng (pool Tomcat 200 luồng); từ Java 21 có thêm <em>virtual thread</em> rất rẻ</td><td>Một luồng, vòng lặp sự kiện, I/O không chặn</td></tr>
<tr><td>Việc nặng CPU</td><td>Ổn — các luồng khác vẫn phục vụ</td><td>Chặn mọi request, trừ khi đẩy sang worker</td></tr>
<tr><td>Kiểu dữ liệu</td><td>Tĩnh, trình biên dịch kiểm</td><td>Động (TypeScript thêm lớp kiểm bên trên)</td></tr>
<tr><td>Khởi động / bộ nhớ</td><td>Đo trên máy này với endpoint LabFlow ở trên: khởi động 1,3 giây, 248 MB bộ nhớ (cấu hình JVM mặc định; Chương 16 làm nó gọn lại)</td><td>Một HTTP server Node 22 trần: nghe cổng sau 93 ms, 56 MB</td></tr>
<tr><td>"Pin" đi kèm</td><td>Giao dịch, bảo mật, dữ liệu, validation có sẵn và ăn khớp nhau</td><td>Tự chọn và tự ghép thư viện</td></tr>
<tr><td>Nơi hay gặp</td><td>Ngân hàng, nhà mạng, hệ thống nội bộ lớn, sản phẩm sống lâu năm</td><td>Startup, ứng dụng realtime, đội full-stack JavaScript</td></tr>
</tbody>
</table>
<div class="callout ok"><strong>Trả lời phỏng vấn thế nào:</strong> "Spring Boot cho tôi một nền tảng đầy đủ, ăn khớp — giao dịch, bảo mật, truy cập dữ liệu — với kiểu tĩnh và mô hình mỗi request một luồng chịu được việc nặng CPU; Node cho tôi khởi động nhanh và vòng lặp sự kiện nhẹ, hợp dịch vụ nhiều I/O và realtime. Hệ thống nghiệp vụ ngân hàng tôi chọn Spring; cổng chat hoặc một BFF nhỏ tôi chọn Node." Rồi kể một ví dụ trong chính dự án của bạn.</div>

<h3>Nó giúp gì cho bạn — cụ thể</h3>
<ul>
  <li><strong>SWP391 và đồ án tốt nghiệp.</strong> Nhóm năm người chia dự án Spring Boot rất gọn — controller, service, repository — và framework không cho từng người tự chế lại cách quản lý kết nối hay định dạng lỗi.</li>
  <li><strong>Phỏng vấn.</strong> "Giải thích dependency injection", "<code>@Transactional</code> làm gì và khi nào nó <em>không</em> chạy?", "Sửa N+1 thế nào?" là câu hỏi chuẩn cho thực tập sinh và fresher Java. Chương nào cũng kết bằng các câu người phỏng vấn thật sự hỏi và cách trả lời.</li>
  <li><strong>Công việc đầu tiên.</strong> Ngày đầu đi làm bạn sẽ mở một repository Spring Boot do người khác viết. Khoá này đảm bảo không có gì trong đó trông như phép thuật.</li>
</ul>

<h3>Học xong bạn tự làm được gì</h3>
<p>Một <strong>LabFlow API</strong> kiểu production — đặt phòng máy và thiết bị — có: Java 21 hiện đại; cấu trúc controller/service/repository sạch; validation và phản hồi lỗi chuẩn (RFC 9457); PostgreSQL qua Spring Data JPA không dính N+1; lịch sử schema bằng Flyway; đăng nhập JWT và phân quyền theo vai trò; test với PostgreSQL thật trong Testcontainers; tài liệu OpenAPI; cache Redis; sự kiện chạy nền; số đo vận hành; một image Docker và một pipeline CI — kèm bản giải thích từng quyết định thiết kế để đưa vào CV.</p>

<h3>Lộ trình — 6 giai đoạn</h3>
<div class="lz-map">
  <div class="lz-stage">Giai đoạn 1 · Nền tảng</div>
  <div class="lz-node"><div class="lz-badge">0</div><div class="lz-nbody"><div class="lz-ntitle">Vì sao Spring Boot · cài đặt · giải phẫu một dự án</div><div class="lz-nsub">Mục này</div></div></div>
  <div class="lz-node"><div class="lz-badge">1–2</div><div class="lz-nbody"><div class="lz-ntitle">⭐ Java hiện đại cho backend</div><div class="lz-nsub">Record, sealed, pattern matching, generics, Stream, Optional, collections, đồng thời, virtual thread, JVM và GC</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Lõi Spring, nhìn từ bên trong</div><div class="lz-nsub">IoC container, DI, vòng đời bean, proxy, auto-configuration, profile</div></div></div>
  <div class="lz-stage">Giai đoạn 2 · Dựng API</div>
  <div class="lz-node"><div class="lz-badge">4–5</div><div class="lz-nbody"><div class="lz-ntitle">REST controller · validation và lỗi</div><div class="lz-nsub">DTO, Jackson, đường đi của request, Bean Validation, ProblemDetail</div></div></div>
  <div class="lz-stage">Giai đoạn 3 · Dữ liệu</div>
  <div class="lz-node"><div class="lz-badge">6–8</div><div class="lz-nbody"><div class="lz-ntitle">Spring Data JPA + PostgreSQL · JPA chuyên sâu · Flyway</div><div class="lz-nsub">Persistence context, quan hệ, N+1, giao dịch, propagation, isolation, khoá, migration</div></div></div>
  <div class="lz-stage">Giai đoạn 4 · An toàn</div>
  <div class="lz-node"><div class="lz-badge">9–11</div><div class="lz-nbody"><div class="lz-ntitle">Spring Security + JWT · góc nhìn hacker · kiểm thử</div><div class="lz-nsub">Chuỗi filter, vai trò, mass assignment, IDOR, injection; JUnit 5, Mockito, @WebMvcTest, Testcontainers</div></div></div>
  <div class="lz-stage">Giai đoạn 5 · Hệ thống thật</div>
  <div class="lz-node"><div class="lz-badge">12–16</div><div class="lz-nbody"><div class="lz-ntitle">OpenAPI + React · Redis · sự kiện và hàng đợi · quan sát · hiệu năng</div><div class="lz-nsub">Những gì làm API dễ dùng, nhanh và nhìn thấy được trên production</div></div></div>
  <div class="lz-stage">Giai đoạn 6 · Đưa lên production</div>
  <div class="lz-node"><div class="lz-badge">17–18</div><div class="lz-nbody"><div class="lz-ntitle">Docker + CI · dự án cuối khoá LabFlow</div><div class="lz-nsub">Một lệnh dựng cả hệ thống; cuối khoá có bài thi thực hành tính giờ</div></div></div>
</div>

<h3>Cần biết gì trước khi học</h3>
<ul>
  <li>Lập trình hướng đối tượng ở một ngôn ngữ bất kỳ: class, đối tượng, interface, kế thừa. Học xong PRO192 là đủ. Chương 1–2 dựng lại phần Java <em>hiện đại</em> bạn cần từ đó.</li>
  <li>SQL cơ bản: <code>SELECT … WHERE</code>, <code>INSERT</code>, khoá chính. Chương 6 giải thích phần còn lại khi cần.</li>
  <li>Một máy tính chạy được Docker (để có PostgreSQL) — bài 0.1 hướng dẫn trên Windows, macOS và Linux.</li>
  <li>Bạn <em>không</em> cần PRJ301, Servlet/JSP hay khoá Node.js. Chỗ nào kiến thức từ đó có ích, bài giải thích ngay tại chỗ.</li>
</ul>
<div class="callout">Ngân sách thời gian: khoảng <strong>3–4 giờ mỗi chương</strong> nếu bạn gõ lại mọi ví dụ và làm lab. Cả khoá chừng 70 giờ. Mục tiêu không phải nhanh — mà là tự dựng lại được LabFlow từ trí nhớ.</div>

<h3>🎤 Người phỏng vấn sẽ hỏi gì về bài này</h3>
<ol>
  <li><strong>"Spring và Spring Boot khác nhau thế nào?"</strong> — Spring Framework là container và các mô-đun (web, dữ liệu, giao dịch). Spring Boot là lớp phủ có chính kiến bên trên: tự cấu hình theo những gì có trên classpath, dependency starter, server nhúng và tệp jar chạy thẳng. Boot không thay Spring; nó cấu hình Spring.</li>
  <li><strong>"Vì sao công ty chọn Java/Spring thay vì Node.js?"</strong> — Kiểu tĩnh, hệ sinh thái đầy đủ và ăn khớp (giao dịch, bảo mật, dữ liệu), lịch hỗ trợ dài, luồng chịu được việc nặng CPU, nguồn tuyển dụng lớn. Nhớ nêu cái giá: khởi động chậm hơn và tốn bộ nhớ hơn.</li>
  <li><strong>"Từ Spring Boot 2 lên 3, và 3 lên 4 thay đổi gì?"</strong> — Bản 3: tối thiểu Java 17 và <code>javax</code> → <code>jakarta</code>. Bản 4: Spring Framework 7, Jakarta EE 11, Jackson 3, starter chia mô-đun. Biết chuyện này cho thấy bạn đọc ghi chú phát hành chứ không chỉ đọc hướng dẫn.</li>
</ol>

<h3>🧪 Thực hành (10 phút)</h3>
<div class="callout ok"><ol>
  <li>Mở <a href="https://start.spring.io" target="_blank" rel="noopener">start.spring.io</a>, bấm <em>ADD DEPENDENCIES</em>. Tìm ba dependency có tên bạn đã gặp trong bài (gợi ý: Web, JDBC, PostgreSQL Driver).</li>
  <li>Mở một trang tuyển dụng (ITviec, TopDev, LinkedIn), đọc ba tin "Java Backend Intern/Fresher". Ghi ra mọi công nghệ họ yêu cầu.</li>
  <li>Cạnh mỗi công nghệ, ghi chương nào trong lộ trình ở trên dạy nó.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có danh sách từ 10 công nghệ trở lên lấy từ tin tuyển dụng thật, mỗi cái gắn với một chương. Giữ lại — học tới đâu đánh dấu tới đó.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Spring Framework</span><span class="v">Container lõi và các mô-đun tạo ra rồi nối các đối tượng của bạn với nhau.</span></div>
  <div class="kv"><span class="k">Spring Boot</span><span class="v">Spring kèm tự cấu hình, starter, server nhúng và tệp jar chạy thẳng.</span></div>
  <div class="kv"><span class="k">Auto-configuration (tự cấu hình)</span><span class="v">Boot nhìn classpath và cấu hình của bạn rồi tự tạo những bean mà lẽ ra bạn phải khai báo tay.</span></div>
  <div class="kv"><span class="k">Starter</span><span class="v">Một dependency kéo theo cả bộ thư viện đã được kiểm cùng nhau cho một việc, vd <code>spring-boot-starter-webmvc</code>.</span></div>
  <div class="kv"><span class="k">Embedded server (server nhúng)</span><span class="v">Web server (Tomcat) chạy bên trong chương trình của bạn, thay vì chương trình được deploy vào nó.</span></div>
  <div class="kv"><span class="k">Jakarta EE</span><span class="v">Bộ chuẩn Java doanh nghiệp (Servlet, JPA, Validation), tên mới của Java EE; gói là <code>jakarta.*</code>.</span></div>
  <div class="kv"><span class="k">LTS (hỗ trợ dài hạn)</span><span class="v">Bản phát hành được hỗ trợ lâu (Java 17, 21, 25) — thứ công ty chạy trên production.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Spring Boot = Spring Framework + mặc định hợp lý: bạn viết nghiệp vụ; Boot dựng server, pool kết nối và xử lý JSON.</li>
  <li>Spring ra đời (2003–2004) để phản đối EJB nặng nề; Boot (2014) ra đời để phản đối chính gánh cấu hình của Spring.</li>
  <li>Khoá này dùng Boot 4.1.2 trên Java 21 và chỉ rõ chỗ nào Boot 3 khác.</li>
  <li>Công ty chọn nó vì kiểu tĩnh, hệ sinh thái đầy đủ, hỗ trợ dài hạn và dễ tuyển người; Node.js đổi mấy thứ đó lấy tốc độ khởi động và sự nhẹ nhàng.</li>
  <li>Bạn sẽ xây LabFlow API từ con số 0 tới một dịch vụ có Docker, có test, có bảo mật.</li>
</ul>

<h3>📚 Học sâu thêm</h3>
${tl('https://spring.io/projects/spring-boot', '🍃', 'spring.io — trang dự án Spring Boot', 'Danh sách phiên bản, lịch hỗ trợ và tài liệu tham chiếu chính thức.')}
${tl('https://docs.spring.io/spring-boot/reference/', '📘', 'Tài liệu tham chiếu Spring Boot', 'Sách hướng dẫn gốc. Phần "Developing with Spring Boot" tương ứng Mục 0 của khoá này.')}

<h3>Nguồn</h3>
<ul>
  <li>Rod Johnson, <em>Expert One-on-One J2EE Design and Development</em>, Wrox, 2002 — và lịch sử ở mục "Spring Framework" trên Wikipedia: <a href="https://en.wikipedia.org/wiki/Spring_Framework" target="_blank" rel="noopener">en.wikipedia.org/wiki/Spring_Framework</a></li>
  <li>SPR-9888 "Improved support for 'containerless' web application architectures" (2012), nay là GitHub issue spring-projects/spring-framework#14521: <a href="https://github.com/spring-projects/spring-framework/issues/14521" target="_blank" rel="noopener">github.com/spring-projects/spring-framework/issues/14521</a></li>
  <li>Thông báo Spring Boot 1.0 GA (4/2014): <a href="https://spring.io/blog/2014/04/01/spring-boot-1-0-ga-released" target="_blank" rel="noopener">spring.io/blog/2014/04/01/spring-boot-1-0-ga-released</a></li>
  <li>Ghi chú phát hành Spring Boot 3.0 (Java 17, Jakarta EE 9+): <a href="https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-3.0-Release-Notes" target="_blank" rel="noopener">github.com/spring-projects/spring-boot/wiki/Spring-Boot-3.0-Release-Notes</a></li>
  <li>Ghi chú phát hành Spring Boot 4.0: <a href="https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.0-Release-Notes" target="_blank" rel="noopener">github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.0-Release-Notes</a></li>
  <li>Broadcom hoàn tất mua VMware (22/11/2023): <a href="https://investors.broadcom.com/news-releases/news-release-details/broadcom-completes-acquisition-vmware" target="_blank" rel="noopener">investors.broadcom.com</a></li>
</ul>
</div>
`;

/* ═══════════════════════════ 0.9 — Bắt đầu tại đây (2/2) ═══════════════════════════ */
const MA_PLAIN = java(`
public class PlainLabServer {
    static final String URL = "jdbc:postgresql://localhost:5432/labflow";

    public static void main(String[] args) throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        server.createContext("/labs", ex -> {
            int status = 200;
            String body;
            try {
                if (!ex.getRequestMethod().equals("GET")) {
                    status = 405;
                    body = "{\\"error\\":\\"Method Not Allowed\\"}";
                } else {
                    String building = null;                       // tự tách query string
                    String q = ex.getRequestURI().getRawQuery();
                    if (q != null) {
                        for (String pair : q.split("&")) {
                            String[] kv = pair.split("=", 2);
                            if (kv[0].equals("building") && kv.length == 2)
                                building = URLDecoder.decode(kv[1], StandardCharsets.UTF_8);
                        }
                    }
                    String sql = "SELECT id, name, building, capacity FROM lab";
                    if (building != null) sql += " WHERE building = '" + building + "'";   // ⚠️ nối chuỗi
                    StringBuilder json = new StringBuilder("[");               // tự dựng JSON
                    try (Connection c = DriverManager.getConnection(URL, "postgres", "sb");   // mỗi request một kết nối mới
                         Statement st = c.createStatement();
                         ResultSet rs = st.executeQuery(sql)) {
                        while (rs.next()) {
                            if (json.length() > 1) json.append(',');
                            json.append("{\\"id\\":").append(rs.getLong("id"))
                                .append(",\\"name\\":\\"").append(rs.getString("name").replace("\\"", "\\\\\\""))
                                .append("\\",\\"building\\":\\"").append(rs.getString("building"))
                                .append("\\",\\"capacity\\":").append(rs.getInt("capacity")).append('}');
                        }
                    }
                    body = json.append(']').toString();
                }
            } catch (SQLException e) {
                status = 500;
                body = "{\\"error\\":\\"" + e.getMessage().replace("\\"", "'").replace("\\n", " ") + "\\"}";
            }
            byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
            ex.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
            ex.sendResponseHeaders(status, bytes.length);
            try (OutputStream os = ex.getResponseBody()) { os.write(bytes); }
        });
        server.start();
        System.out.println("Plain server on 8080");
    }
}`);
const OUT_DEM_DONG = out(`$ wc -l khong-spring/PlainLabServer.java co-spring/src/main/java/com/cuongthai/labflow/lab/LabController.java \\
       co-spring/src/main/java/com/cuongthai/labflow/LabflowApplication.java co-spring/src/main/resources/application.properties
  58 khong-spring/PlainLabServer.java
  24 co-spring/src/main/java/com/cuongthai/labflow/lab/LabController.java
  13 co-spring/src/main/java/com/cuongthai/labflow/LabflowApplication.java
   4 co-spring/src/main/resources/application.properties`);
const OUT_TAN_CONG = out(`# 1) Kẻ tấn công: đọc dữ liệu KHÔNG thuộc bảng lab — tên người dùng DB và phiên bản PostgreSQL
$ curl -s -G localhost:8080/labs --data-urlencode "building=' UNION SELECT 0, current_user, split_part(version(),' ',2), 0 --"
[{"id":0,"name":"postgres","building":"16.15","capacity":0}]

# 2) Lấy hết mọi dòng bằng điều kiện luôn đúng
$ curl -s -G localhost:8080/labs --data-urlencode "building=' OR '1'='1"
[{"id":1,"name":"Lab AI","building":"Alpha","capacity":30},{"id":2,"name":"Lab IoT","building":"Beta","capacity":24},{"id":3,"name":"Lab Mạng","building":"Alpha","capacity":36}]

# 3) Người dùng bình thường gõ một cái tên có dấu nháy — lỗi 500 làm lộ luôn câu SQL
$ curl -s -G localhost:8080/labs --data-urlencode "building=O'Brien"
{"error":"Unterminated string literal started at position 70 in SQL SELECT id, name, building, capacity FROM lab WHERE building = 'O'Brien'. Expected  char"}`);
const OUT_SPRING_AN_TOAN = out(`$ curl -s -G localhost:8081/labs --data-urlencode "building=' OR '1'='1"
[]
$ curl -s -G localhost:8081/labs --data-urlencode "building=O'Brien"
[]
$ curl -s -i -X POST localhost:8081/labs
HTTP/1.1 405
{"timestamp":"2026-11-17T15:34:40.245Z","status":405,"error":"Method Not Allowed","path":"/labs"}
$ curl -s -i localhost:8081/labz
HTTP/1.1 404
{"timestamp":"2026-11-17T15:34:40.295Z","status":404,"error":"Not Found","path":"/labz"}

# còn bản không Spring trả 404 dạng HTML, lệch hẳn với phần còn lại của API:
$ curl -s -i localhost:8080/labz
HTTP/1.1 404 Not Found
<h1>404 Not Found</h1>No context found for request`);
const OUT_DO_TOC = out(`# 500 request nối tiếp, mỗi request một tiến trình curl (thời gian gồm cả khởi động curl)
8080 (không Spring, mở kết nối DB mới mỗi lần): 6,5 ms / request
8081 (Spring Boot, pool HikariCP)             : 4,4 ms / request

# số kết nối đang mở tới database labflow khi bản Spring đang chạy
$ psql -U postgres -tc "select count(*) from pg_stat_activity where datname='labflow'"
    10`);

const L09_EN = `
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here (2/2)</span>
<h2>Life without Spring — real incidents, a 58-line endpoint, and how to study this course without giving up</h2>
<p class="lead">Frameworks can look like bureaucracy: annotations everywhere, a 22 MB jar for one endpoint. This lesson shows where Spring's rules come from — first in famous incidents that hit hundreds of millions of people, then in the same LabFlow endpoint written by hand, which we attack with three requests. Then we turn to you: the typical student disaster, why people quit Java backend, and a study plan that keeps you going.</p>

<h3>How to read the stories</h3>
<p>Each story has the same shape: <em>what happened</em>, <em>the ordinary decision behind it</em>, and <em>what in Spring Boot exists because of it</em>. None of them needed a genius attacker. All of them needed one boring thing nobody owned: a dependency update, a default, a string concatenation.</p>

<h3>1 · Equifax, 2017 — a framework patch left waiting for two months</h3>
<p>On 7 March 2017 the Apache Struts project (a Java web framework, Spring MVC's old rival) fixed a remote-code-execution bug, CVE-2017-5638: a crafted <code>Content-Type</code> header made the server run attacker commands. Equifax, one of the three US credit bureaus, did not apply the patch on an internet-facing dispute portal. Attackers got in from mid-May and stayed until 29 July; the data of about <strong>147 million people</strong> — names, birth dates, social security numbers — was taken. The company later agreed a settlement of up to 700 million US dollars.</p>
<p><strong>The ordinary decision:</strong> “we'll upgrade the framework later”. <strong>What exists in Boot because of this kind of story:</strong> one parent version manages ~hundreds of library versions that were tested together, so upgrading is one line in <code>pom.xml</code> — Chapter 17 adds a bot that opens that pull request for you.</p>

<h3>2 · Spring4Shell, 2022 — when “bind the request into an object” goes too far</h3>
<p>On 31 March 2022 Spring disclosed CVE-2022-22965 (severity 9.8/10). Spring MVC binds request parameters into Java objects automatically: <code>?name=Lab</code> sets <code>lab.setName("Lab")</code>. On JDK 9+, a parameter like <code>class.module.classLoader…</code> walked from the object into Tomcat's internals and could rewrite the access-log settings so that Tomcat wrote a JSP web shell to disk. Conditions: Spring MVC, JDK 9 or later, deployed as a <code>.war</code> on Tomcat. Fixed in Spring Framework 5.3.18 / 5.2.20 and Boot 2.6.6 / 2.5.12 within days.</p>
<p><strong>The lesson for you:</strong> automatic binding is powerful and dangerous. Chapter 4 binds JSON into small <em>records</em> that contain only the fields a client may send, and Chapter 10 attacks LabFlow with the same idea — “mass assignment”, sending <code>"role":"ADMIN"</code> in a sign-up form.</p>

<h3>3 · Log4Shell, 2021 — the library you did not know you had</h3>
<p>On 9 December 2021, CVE-2021-44228 in Log4j 2 (versions 2.0-beta9 to 2.14.1) let anyone who could get a string <em>logged</em> — a user name, a User-Agent header — make the server download and run code through a JNDI lookup. It was called the worst vulnerability of the decade because Log4j was everywhere, usually as a dependency of a dependency.</p>
<p>Spring Boot's default logger is <strong>Logback</strong>, not Log4j 2, so a default Boot application was not exploitable. You can check what your own jar contains — this is the LabFlow jar from lesson 0.8:</p>
${out(`$ unzip -l target/labflow-0.0.1-SNAPSHOT.jar | grep -E 'log4j|logback'
  logback-classic-1.5.38.jar
  logback-core-1.5.38.jar
  log4j-to-slf4j-2.25.5.jar
  log4j-api-2.25.5.jar`)}
<p><code>log4j-api</code> is there (only an interface that forwards to SLF4J/Logback), but <code>log4j-core</code> — where the bug lived — is not. Knowing how to answer “are we affected?” in five minutes is exactly the skill a team needs on a day like 10 December 2021.</p>

<h3>4 · Actuator, the open back door</h3>
<p>Spring Boot Actuator adds operational endpoints: health, metrics, environment, and <code>/actuator/heapdump</code> — a full copy of the JVM's memory, which contains database passwords, JWT secrets and recent requests. In Boot 1.x many endpoints were reachable over HTTP; since <strong>Boot 2.0 (2018) only <code>health</code> and <code>info</code> were exposed over the web by default — and since Boot 2.5 (2021) only <code>health</code></strong>, precisely because of real leaks. Security reports still find heap dumps open on the internet every year — always from someone who added <code>management.endpoints.web.exposure.include=*</code> “to make monitoring work”. Chapter 15 sets it up safely.</p>

<h3>The pattern</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Equifax</span><span class="v">Unpatched framework → Boot's managed versions + automated update PRs (Ch. 17).</span></div>
  <div class="kv"><span class="k">Spring4Shell</span><span class="v">Over-eager binding → DTO records with only allowed fields (Ch. 4, Ch. 10).</span></div>
  <div class="kv"><span class="k">Log4Shell</span><span class="v">Unknown transitive dependency → know your jar; Logback by default.</span></div>
  <div class="kv"><span class="k">Actuator leaks</span><span class="v">Convenience over safety → safe defaults, expose explicitly (Ch. 15).</span></div>
</div>

<h3>Closer to home: the same endpoint without Spring</h3>
<p>Here is the endpoint from lesson 0.8 written with only the JDK — the built-in <code>HttpServer</code> and raw JDBC, the way many SWP391 teams still write it after PRJ301. It works. Read it once, then we attack it.</p>
${MA_PLAIN}
<p>Count the lines that are actually about labs:</p>
${OUT_DEM_DONG}
<p>58 lines by hand versus 24 + 13 + 4 with Spring — and only the 24 contain anything specific to LabFlow; the other 17 are almost identical in every Spring project. Now three requests against the hand-written version (port 8080), all real:</p>
${OUT_TAN_CONG}
<p>Request 1 is <strong>SQL injection</strong>: the attacker closed our quote, glued a <code>UNION</code> on, and read the database user and its exact version — the first step to looking up known exploits. Request 3 is not even an attack: an innocent name with an apostrophe crashes the query, and our error handler politely sends the SQL text back to the world. The same three requests against the Spring version (port 8081):</p>
${OUT_SPRING_AN_TOAN}
<p>Spring did not stop the attack by being clever. It stopped it because the <em>easy</em> way to write a query with <code>JdbcClient</code> is the parameterised one (<code>?</code> + <code>.param()</code>), and its default error response never contains exception messages. Good frameworks make the safe way the short way.</p>
<p>Speed, measured the same afternoon:</p>
${OUT_DO_TOC}
<p>The hand-written server opens a brand-new database connection for every request — a TCP handshake plus PostgreSQL authentication each time. Spring Boot created a <strong>connection pool</strong> (HikariCP) of 10 connections at the first request and reuses them. You did not ask for a pool; auto-configuration saw the PostgreSQL driver on the classpath and made one. That is what “Boot configures Spring for you” means in practice.</p>

<div class="pitfall"><p><strong>Illustrative scenario (not a real team) — demo day, SWP391.</strong> A five-person team built their booking system with servlets and string-built SQL. During the demo the lecturer types her own surname, <em>D'Souza</em>, into the search box. The page shows a stack trace with the SQL query in it. She then types <code>' OR '1'='1</code> into the login form and logs in as the first user in the table — the admin. Nothing in the project was “hard”; every line was ordinary. The fix took ten minutes. The grade had already been written.</p></div>

<h3>What Spring Boot takes off your hands</h3>
<table>
<thead><tr><th>By hand (above)</th><th>With Spring Boot</th><th>Chapter</th></tr></thead>
<tbody>
<tr><td>Parse the query string yourself</td><td><code>@RequestParam String building</code></td><td>4</td></tr>
<tr><td>Build JSON with a <code>StringBuilder</code>, escape quotes by hand</td><td>Return a <code>record</code>; Jackson writes JSON</td><td>4</td></tr>
<tr><td>Check the HTTP method, write the 405 yourself</td><td><code>@GetMapping</code>; 405 and 404 are automatic and consistent</td><td>4</td></tr>
<tr><td>Open a connection per request</td><td>Pooled <code>DataSource</code> created for you</td><td>6, 16</td></tr>
<tr><td>Concatenate SQL</td><td>Parameters by default (<code>JdbcClient</code>, JPA)</td><td>6, 10</td></tr>
<tr><td>Return <code>e.getMessage()</code> to the client</td><td>Standard error body with no internals</td><td>5</td></tr>
<tr><td>Hard-code URL and password</td><td><code>application.yml</code> + environment variables</td><td>0.2, 3</td></tr>
</tbody>
</table>

<h3>Why people give up on Java backend — and the fix</h3>
<ul>
  <li><strong>“Too much magic.”</strong> Annotations seem to do things nobody wrote. Fix: Chapter 3 opens the box — you will print the beans Spring created, watch a proxy wrap your class, and read the auto-configuration report. Magic you can print is not magic.</li>
  <li><strong>“The error is 200 lines long.”</strong> Fix: read a Java stack trace <em>bottom up</em> — the last <code>Caused by:</code> is the real cause; Boot also prints an “APPLICATION FAILED TO START” box with a plain-English <em>Action</em>. Lesson 0.1 shows the first one you will meet.</li>
  <li><strong>“Tutorials don't compile.”</strong> They are Boot 2 (<code>javax.*</code>, <code>WebSecurityConfigurerAdapter</code>). Fix: check the version first; this course marks every Boot 3 → 4 difference.</li>
  <li><strong>“I watched everything and can't build anything.”</strong> Fix: the study rhythm below — type, break, measure.</li>
</ul>

<h3>One study session, five steps</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Watch the video (10–15 min)</span><span class="lz-d">Get the picture. Don't take notes yet.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Read the lesson and type every example</span><span class="lz-d">Type, don't paste. Your fingers learn the annotations.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Break it on purpose</span><span class="lz-d">Remove an annotation, rename a package, stop PostgreSQL. Read the error. This is where understanding happens.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">🧪 Practice — 15 minutes</span><span class="lz-d">A small task with a “done when” you can check yourself.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Chapter lab, quiz, interview questions</span><span class="lz-d">Only at the end of a chapter. Answer the interview questions out loud, as if someone were listening.</span></div>
</div>
<p><strong>Minimum path</strong> (you need a working API for SWP391 in a month): Sections 0, 3, 4, 5, 6, 8, 9 and the capstone. <strong>Full path</strong> (you want a Java backend job): everything, in order, including the ⭐ modern Java chapters — interviewers ask about <code>HashMap</code> and the garbage collector as often as about Spring.</p>

<h3>The project: LabFlow</h3>
<p>LabFlow lets students book <strong>computer labs</strong> and <strong>devices</strong>, and lets lab managers approve bookings and keep devices working. It is the same project as the Node.js course and the API Design course on this site — if you did those, you will build the same API again “the Java way” and can compare. It starts with four resources: <code>users</code>, <code>labs</code>, <code>devices</code>, <code>bookings</code>. Booking is a great teacher: two people booking the same slot gives you <code>409 Conflict</code> and optimistic locking; “only the manager approves” gives you roles; “booking at 08:00” gives you time zones.</p>

<h3>🎤 What interviewers ask about this lesson</h3>
<ol>
  <li><strong>“How do you prevent SQL injection in a Spring application?”</strong> — Never build SQL by concatenating input. Use parameters: <code>JdbcClient</code>/<code>JdbcTemplate</code> with <code>?</code>, Spring Data derived queries, JPQL with named parameters. Validate input too, but parameters are the real fix. Bonus: show you know injection is still possible in JPA if you concatenate JPQL (Chapter 10).</li>
  <li><strong>“Why use a connection pool?”</strong> — Opening a connection costs a TCP handshake and authentication; a pool keeps a few open and lends them out. Spring Boot uses HikariCP by default with 10 connections. Mention that the pool size is a tuning knob, not “bigger is better” (Chapter 16).</li>
  <li><strong>“A new critical CVE is announced in a library. What do you do?”</strong> — Check whether we use it (<code>mvn dependency:tree</code>, the jar contents), whether our configuration is affected, upgrade via the Boot parent or a version property, run tests, deploy. Log4Shell is the classic example.</li>
</ol>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok"><ol>
  <li>Look at the hand-written server above. Find the line that makes the injection possible.</li>
  <li>Rewrite just that part with a <code>PreparedStatement</code> and a <code>?</code> placeholder (no Spring needed).</li>
  <li>Explain in one sentence why <code>O'Brien</code> now works <em>and</em> the attack returns an empty list.</li>
</ol>
<p><strong>Done when:</strong> your version has no <code>+ building +</code> anywhere, and you can say what the database receives in place of the <code>?</code>.</p></div>
${giai('Show the solution', `${java(`
String sql = "SELECT id, name, building, capacity FROM lab"
           + (building != null ? " WHERE building = ?" : "");
try (Connection c = DriverManager.getConnection(URL, "postgres", "sb");
     PreparedStatement st = c.prepareStatement(sql)) {
    if (building != null) st.setString(1, building);   // the value travels separately from the SQL text
    try (ResultSet rs = st.executeQuery()) {
        // … same loop as before …
    }
}`)}
<p>The SQL text is fixed and sent first; the value is sent as data. PostgreSQL compares the column with the whole string <code>' OR '1'='1</code> — no lab is called that, so the list is empty — and <code>O'Brien</code> is just a string with an apostrophe in it.</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">CVE</span><span class="v">A public identifier for one known vulnerability, e.g. CVE-2022-22965.</span></div>
  <div class="kv"><span class="k">SQL injection</span><span class="v">Input that changes the structure of a SQL statement because it was concatenated into it.</span></div>
  <div class="kv"><span class="k">Parameterised query</span><span class="v">SQL with placeholders; values are sent separately and can never become SQL.</span></div>
  <div class="kv"><span class="k">Data binding</span><span class="v">Copying request data into Java objects automatically.</span></div>
  <div class="kv"><span class="k">Transitive dependency</span><span class="v">A library you get because a library you chose depends on it.</span></div>
  <div class="kv"><span class="k">Connection pool</span><span class="v">A set of open database connections reused across requests (HikariCP in Boot).</span></div>
  <div class="kv"><span class="k">Heap dump</span><span class="v">A file with the entire memory of a running JVM — secrets included.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Big incidents came from ordinary decisions: an unapplied patch (Equifax), too-eager binding (Spring4Shell), an unknown dependency (Log4Shell), a convenient default (Actuator).</li>
  <li>The same endpoint by hand: 58 lines, an SQL injection, error messages leaking SQL, a new connection per request.</li>
  <li>With Spring Boot: 24 lines of business code, parameters by default, consistent JSON errors, a pool of 10 connections — none of which you had to ask for.</li>
  <li>Read stack traces bottom-up, check the Boot version of any tutorial, and study by typing and breaking things.</li>
</ul>

<h3>Sources</h3>
<ul>
  <li>US GAO report on the Equifax breach (GAO-18-559, 2018): <a href="https://www.gao.gov/products/gao-18-559" target="_blank" rel="noopener">gao.gov/products/gao-18-559</a> · Equifax data breach overview: <a href="https://en.wikipedia.org/wiki/2017_Equifax_data_breach" target="_blank" rel="noopener">en.wikipedia.org/wiki/2017_Equifax_data_breach</a></li>
  <li>Spring advisory CVE-2022-22965: <a href="https://spring.io/security/cve-2022-22965" target="_blank" rel="noopener">spring.io/security/cve-2022-22965</a></li>
  <li>Apache Log4j security page (CVE-2021-44228): <a href="https://logging.apache.org/security.html" target="_blank" rel="noopener">logging.apache.org/security.html</a> · Spring blog “Log4J2 Vulnerability and Spring Boot” (10 Dec 2021): <a href="https://spring.io/blog/2021/12/10/log4j2-vulnerability-and-spring-boot" target="_blank" rel="noopener">spring.io/blog</a></li>
  <li>Spring Boot 2.0 release notes (Actuator exposure defaults): <a href="https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.0-Release-Notes" target="_blank" rel="noopener">github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.0-Release-Notes</a></li>
  <li>OWASP SQL Injection Prevention Cheat Sheet: <a href="https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html" target="_blank" rel="noopener">cheatsheetseries.owasp.org</a></li>
</ul>
</div>
`;

const L09_VI = `
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây (2/2)</span>
<h2>Sống không có Spring — sự cố thật, một endpoint 58 dòng, và cách học khoá này mà không bỏ cuộc</h2>
<p class="lead">Framework đôi khi trông như thủ tục hành chính: annotation khắp nơi, tệp jar 22 MB cho một endpoint. Bài này cho bạn thấy các "luật" của Spring từ đâu ra — trước hết qua những vụ nổi tiếng ảnh hưởng hàng trăm triệu người, rồi qua chính endpoint LabFlow viết tay, mà ta sẽ tấn công bằng ba request. Sau đó quay về bạn: thảm hoạ điển hình của sinh viên, vì sao người ta bỏ học Java backend, và một kế hoạch học giữ bạn đi tiếp.</p>

<h3>Đọc các câu chuyện thế nào</h3>
<p>Câu chuyện nào cũng cùng một dáng: <em>chuyện gì đã xảy ra</em>, <em>quyết định bình thường nằm phía sau</em>, và <em>thứ gì trong Spring Boot tồn tại vì nó</em>. Không vụ nào cần kẻ tấn công thiên tài. Vụ nào cũng chỉ cần một việc nhàm chán không ai nhận phần: cập nhật thư viện, một giá trị mặc định, một phép nối chuỗi.</p>

<h3>1 · Equifax, 2017 — bản vá framework bị để chờ hai tháng</h3>
<p>Ngày 7/3/2017, dự án Apache Struts (một web framework Java, đối thủ cũ của Spring MVC) vá lỗi thực thi mã từ xa CVE-2017-5638: một header <code>Content-Type</code> được chế khéo khiến server chạy lệnh của kẻ tấn công. Equifax, một trong ba công ty xếp hạng tín dụng lớn nhất nước Mỹ, không vá cổng khiếu nại công khai trên Internet. Kẻ tấn công vào từ giữa tháng 5 và ở lại tới 29/7; dữ liệu của khoảng <strong>147 triệu người</strong> — họ tên, ngày sinh, số an sinh xã hội — bị lấy đi. Về sau công ty chấp nhận bồi thường tới 700 triệu đô la Mỹ.</p>
<p><strong>Quyết định bình thường:</strong> "để sau hẵng nâng framework". <strong>Thứ tồn tại trong Boot vì kiểu chuyện này:</strong> một phiên bản parent quản lý cả trăm thư viện đã được kiểm cùng nhau, nên nâng cấp chỉ là sửa một dòng trong <code>pom.xml</code> — Chương 17 thêm một con bot tự mở pull request đó cho bạn.</p>

<h3>2 · Spring4Shell, 2022 — khi "gắn request vào đối tượng" đi quá xa</h3>
<p>Ngày 31/3/2022 Spring công bố CVE-2022-22965 (mức nghiêm trọng 9,8/10). Spring MVC tự gắn tham số request vào đối tượng Java: <code>?name=Lab</code> sẽ gọi <code>lab.setName("Lab")</code>. Trên JDK 9 trở lên, một tham số kiểu <code>class.module.classLoader…</code> đi từ đối tượng xuyên vào bên trong Tomcat, sửa được cấu hình access log để Tomcat ghi ra đĩa một web shell JSP. Điều kiện: Spring MVC, JDK 9 trở lên, deploy dạng <code>.war</code> trên Tomcat. Vá trong vài ngày ở Spring Framework 5.3.18 / 5.2.20 và Boot 2.6.6 / 2.5.12.</p>
<p><strong>Bài học cho bạn:</strong> tự động gắn dữ liệu (data binding) vừa mạnh vừa nguy hiểm. Chương 4 gắn JSON vào các <em>record</em> nhỏ chỉ chứa đúng trường client được gửi, và Chương 10 tấn công LabFlow bằng chính ý tưởng đó — "mass assignment", gửi <code>"role":"ADMIN"</code> trong form đăng ký.</p>

<h3>3 · Log4Shell, 2021 — thư viện bạn không biết là mình có</h3>
<p>Ngày 9/12/2021, lỗi CVE-2021-44228 trong Log4j 2 (bản 2.0-beta9 tới 2.14.1) cho phép bất kỳ ai khiến server <em>ghi log</em> một chuỗi — tên đăng nhập, header User-Agent — buộc server tải và chạy mã qua tra cứu JNDI. Người ta gọi nó là lỗ hổng tệ nhất thập kỷ vì Log4j có mặt khắp nơi, thường là phụ thuộc của một phụ thuộc.</p>
<p>Logger mặc định của Spring Boot là <strong>Logback</strong>, không phải Log4j 2, nên ứng dụng Boot mặc định không bị khai thác. Bạn tự kiểm được tệp jar của mình chứa gì — đây là jar LabFlow ở bài 0.8:</p>
${out(`$ unzip -l target/labflow-0.0.1-SNAPSHOT.jar | grep -E 'log4j|logback'
  logback-classic-1.5.38.jar
  logback-core-1.5.38.jar
  log4j-to-slf4j-2.25.5.jar
  log4j-api-2.25.5.jar`)}
<p><code>log4j-api</code> có mặt (chỉ là interface chuyển tiếp sang SLF4J/Logback), nhưng <code>log4j-core</code> — nơi chứa lỗi — thì không. Trả lời được câu "mình có dính không?" trong năm phút chính là kỹ năng cả đội cần vào một ngày như 10/12/2021.</p>

<h3>4 · Actuator, cánh cửa sau để ngỏ</h3>
<p>Spring Boot Actuator thêm các endpoint vận hành: tình trạng sức khoẻ, số đo, biến môi trường, và <code>/actuator/heapdump</code> — bản chụp toàn bộ bộ nhớ JVM, trong đó có mật khẩu cơ sở dữ liệu, khoá bí mật JWT và các request gần nhất. Ở Boot 1.x nhiều endpoint truy cập được qua HTTP; từ <strong>Boot 2.0 (2018) mặc định chỉ <code>health</code> và <code>info</code> được mở qua web — và từ Boot 2.5 (2021) chỉ còn <code>health</code></strong>, chính vì những vụ rò rỉ thật. Năm nào các báo cáo bảo mật cũng vẫn tìm thấy heap dump để ngỏ trên Internet — luôn do ai đó thêm <code>management.endpoints.web.exposure.include=*</code> "cho giám sát chạy được". Chương 15 cấu hình nó an toàn.</p>

<h3>Điểm chung</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Equifax</span><span class="v">Framework không vá → Boot quản lý phiên bản + PR nâng cấp tự động (Ch. 17).</span></div>
  <div class="kv"><span class="k">Spring4Shell</span><span class="v">Gắn dữ liệu quá hăng → record DTO chỉ chứa trường được phép (Ch. 4, Ch. 10).</span></div>
  <div class="kv"><span class="k">Log4Shell</span><span class="v">Phụ thuộc bắc cầu không ai biết → biết jar của mình chứa gì; mặc định Logback.</span></div>
  <div class="kv"><span class="k">Rò rỉ Actuator</span><span class="v">Tiện hơn an toàn → mặc định an toàn, muốn mở phải khai báo rõ (Ch. 15).</span></div>
</div>

<h3>Gần nhà hơn: cùng endpoint đó, không có Spring</h3>
<p>Đây là endpoint của bài 0.8 viết chỉ bằng JDK — <code>HttpServer</code> có sẵn và JDBC thuần, đúng kiểu nhiều nhóm SWP391 vẫn viết sau PRJ301. Nó chạy được. Đọc qua một lượt, rồi ta tấn công nó.</p>
${MA_PLAIN}
<p>Đếm xem bao nhiêu dòng thật sự nói về phòng lab:</p>
${OUT_DEM_DONG}
<p>58 dòng viết tay so với 24 + 13 + 4 khi có Spring — và chỉ 24 dòng chứa thứ riêng của LabFlow; 17 dòng còn lại gần như giống hệt ở mọi dự án Spring. Giờ là ba request vào bản viết tay (cổng 8080), tất cả chạy thật:</p>
${OUT_TAN_CONG}
<p>Request 1 là <strong>SQL injection</strong>: kẻ tấn công đóng dấu nháy của ta, dán thêm <code>UNION</code>, rồi đọc được tên người dùng cơ sở dữ liệu và đúng phiên bản của nó — bước đầu để tra lỗ hổng đã biết. Request 3 thậm chí không phải tấn công: một cái tên vô hại có dấu nháy đơn làm câu truy vấn vỡ, và bộ xử lý lỗi của ta lịch sự gửi nguyên văn câu SQL ra cho cả thế giới. Cũng ba request đó vào bản Spring (cổng 8081):</p>
${OUT_SPRING_AN_TOAN}
<p>Spring chặn được không phải nhờ khôn. Nó chặn được vì cách viết truy vấn <em>dễ nhất</em> với <code>JdbcClient</code> chính là cách có tham số (<code>?</code> + <code>.param()</code>), và phản hồi lỗi mặc định không bao giờ chứa thông điệp exception. Framework tốt biến cách an toàn thành cách ngắn nhất.</p>
<p>Tốc độ, đo cùng buổi chiều:</p>
${OUT_DO_TOC}
<p>Bản viết tay mở một kết nối cơ sở dữ liệu mới tinh cho mỗi request — mỗi lần một cái bắt tay TCP cộng một lượt xác thực PostgreSQL. Spring Boot dựng một <strong>pool kết nối</strong> (HikariCP) 10 kết nối ngay request đầu tiên rồi dùng lại. Bạn không hề xin pool; auto-configuration thấy driver PostgreSQL trên classpath và tự tạo. "Boot cấu hình Spring giúp bạn" trên thực tế nghĩa là vậy.</p>

<div class="pitfall"><p><strong>Tình huống minh hoạ (không phải một nhóm có thật) — ngày demo SWP391.</strong> Nhóm năm người làm hệ thống đặt phòng bằng servlet và SQL nối chuỗi. Lúc demo, cô giáo gõ họ của mình, <em>D'Souza</em>, vào ô tìm kiếm. Trang hiện ra một stack trace kèm nguyên câu SQL. Cô gõ tiếp <code>' OR '1'='1</code> vào form đăng nhập và vào được bằng tài khoản đầu tiên trong bảng — tài khoản admin. Chẳng có gì trong dự án là "khó"; dòng nào cũng bình thường. Sửa mất mười phút. Điểm thì đã chấm xong.</p></div>

<h3>Spring Boot gánh giúp bạn những gì</h3>
<table>
<thead><tr><th>Viết tay (ở trên)</th><th>Với Spring Boot</th><th>Chương</th></tr></thead>
<tbody>
<tr><td>Tự tách query string</td><td><code>@RequestParam String building</code></td><td>4</td></tr>
<tr><td>Dựng JSON bằng <code>StringBuilder</code>, tự thoát dấu nháy</td><td>Trả về một <code>record</code>; Jackson viết JSON</td><td>4</td></tr>
<tr><td>Tự kiểm phương thức HTTP, tự viết 405</td><td><code>@GetMapping</code>; 405 và 404 tự động, đồng nhất</td><td>4</td></tr>
<tr><td>Mỗi request mở một kết nối</td><td><code>DataSource</code> có pool được tạo sẵn</td><td>6, 16</td></tr>
<tr><td>Nối chuỗi SQL</td><td>Tham số là mặc định (<code>JdbcClient</code>, JPA)</td><td>6, 10</td></tr>
<tr><td>Trả <code>e.getMessage()</code> cho client</td><td>Thân lỗi chuẩn, không lộ nội tình</td><td>5</td></tr>
<tr><td>Ghi cứng URL và mật khẩu trong mã</td><td><code>application.yml</code> + biến môi trường</td><td>0.2, 3</td></tr>
</tbody>
</table>

<h3>Vì sao người ta bỏ học Java backend — và cách chữa</h3>
<ul>
  <li><strong>"Nhiều phép thuật quá."</strong> Annotation như tự làm những việc chẳng ai viết. Cách chữa: Chương 3 mở hộp ra — bạn sẽ in danh sách bean Spring đã tạo, xem một proxy bọc lấy class của mình, và đọc báo cáo auto-configuration. Phép thuật in ra được thì không còn là phép thuật.</li>
  <li><strong>"Lỗi dài 200 dòng."</strong> Cách chữa: đọc stack trace Java <em>từ dưới lên</em> — dòng <code>Caused by:</code> cuối cùng mới là nguyên nhân thật; Boot còn in một khung "APPLICATION FAILED TO START" với mục <em>Action</em> viết bằng tiếng Anh dễ hiểu. Bài 0.1 cho bạn gặp cái đầu tiên.</li>
  <li><strong>"Làm theo hướng dẫn mà biên dịch không nổi."</strong> Hướng dẫn đó là Boot 2 (<code>javax.*</code>, <code>WebSecurityConfigurerAdapter</code>). Cách chữa: xem phiên bản trước; khoá này đánh dấu mọi chỗ Boot 3 → 4 khác nhau.</li>
  <li><strong>"Xem hết video mà chẳng tự dựng được gì."</strong> Cách chữa: nhịp học bên dưới — gõ, phá, đo.</li>
</ul>

<h3>Một buổi học, năm bước</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Xem video (10–15 phút)</span><span class="lz-d">Nắm bức tranh. Chưa cần ghi chép.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Đọc bài và gõ lại mọi ví dụ</span><span class="lz-d">Gõ, đừng dán. Ngón tay sẽ thuộc annotation.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Cố tình làm hỏng</span><span class="lz-d">Bỏ một annotation, đổi tên package, tắt PostgreSQL. Đọc lỗi. Hiểu bài nằm ở bước này.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">🧪 Thực hành — 15 phút</span><span class="lz-d">Một việc nhỏ có tiêu chí "đạt khi" để tự kiểm.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Lab chương, quiz, câu hỏi phỏng vấn</span><span class="lz-d">Chỉ ở cuối chương. Trả lời câu phỏng vấn thành tiếng, như có người đang nghe.</span></div>
</div>
<p><strong>Lộ trình tối thiểu</strong> (cần API chạy được cho SWP391 trong một tháng): Mục 0, Chương 3, 4, 5, 6, 8, 9 và dự án cuối khoá. <strong>Lộ trình đầy đủ</strong> (muốn đi làm Java backend): học hết, theo thứ tự, kể cả hai chương ⭐ Java hiện đại — người phỏng vấn hỏi về <code>HashMap</code> và bộ thu gom rác nhiều không kém hỏi về Spring.</p>

<h3>Dự án: LabFlow</h3>
<p>LabFlow cho sinh viên đặt <strong>phòng máy</strong> và <strong>thiết bị</strong>, cho quản lý lab duyệt lượt đặt và giữ thiết bị hoạt động. Đây là cùng dự án với khoá Node.js và khoá API Design trên trang này — nếu đã học hai khoá đó, bạn sẽ dựng lại đúng API ấy "theo cách Java" và tự so sánh được. Khởi đầu với bốn tài nguyên: <code>users</code>, <code>labs</code>, <code>devices</code>, <code>bookings</code>. Bài toán đặt chỗ là người thầy giỏi: hai người đặt cùng khung giờ cho ta <code>409 Conflict</code> và khoá lạc quan; "chỉ quản lý được duyệt" cho ta phân quyền; "đặt lúc 08:00" cho ta chuyện múi giờ.</p>

<h3>🎤 Người phỏng vấn sẽ hỏi gì về bài này</h3>
<ol>
  <li><strong>"Chống SQL injection trong ứng dụng Spring thế nào?"</strong> — Không bao giờ dựng SQL bằng cách nối dữ liệu người dùng. Dùng tham số: <code>JdbcClient</code>/<code>JdbcTemplate</code> với <code>?</code>, truy vấn suy ra từ tên phương thức của Spring Data, JPQL với tham số có tên. Có kiểm tra đầu vào nữa thì tốt, nhưng tham số mới là cách chữa thật. Điểm cộng: cho thấy bạn biết JPA vẫn dính injection nếu nối chuỗi JPQL (Chương 10).</li>
  <li><strong>"Vì sao cần pool kết nối?"</strong> — Mở một kết nối tốn một lần bắt tay TCP và một lượt xác thực; pool giữ sẵn vài kết nối mở và cho mượn. Spring Boot mặc định dùng HikariCP với 10 kết nối. Nhớ nói thêm kích thước pool là núm tinh chỉnh, không phải "càng to càng tốt" (Chương 16).</li>
  <li><strong>"Một CVE nghiêm trọng vừa công bố trong một thư viện. Bạn làm gì?"</strong> — Kiểm xem mình có dùng không (<code>mvn dependency:tree</code>, nội dung jar), cấu hình của mình có bị ảnh hưởng không, nâng qua Boot parent hoặc thuộc tính phiên bản, chạy test, deploy. Log4Shell là ví dụ kinh điển.</li>
</ol>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok"><ol>
  <li>Nhìn bản server viết tay ở trên. Tìm dòng khiến injection xảy ra được.</li>
  <li>Viết lại riêng phần đó bằng <code>PreparedStatement</code> với chỗ giữ chỗ <code>?</code> (không cần Spring).</li>
  <li>Giải thích trong một câu vì sao giờ <code>O'Brien</code> chạy được <em>và</em> đòn tấn công trả về danh sách rỗng.</li>
</ol>
<p><strong>Đạt khi:</strong> bản của bạn không còn <code>+ building +</code> ở đâu cả, và bạn nói được cơ sở dữ liệu nhận gì ở vị trí dấu <code>?</code>.</p></div>
${giai('Xem lời giải', `${java(`
String sql = "SELECT id, name, building, capacity FROM lab"
           + (building != null ? " WHERE building = ?" : "");
try (Connection c = DriverManager.getConnection(URL, "postgres", "sb");
     PreparedStatement st = c.prepareStatement(sql)) {
    if (building != null) st.setString(1, building);   // giá trị đi riêng, tách khỏi chữ SQL
    try (ResultSet rs = st.executeQuery()) {
        // … vòng lặp như cũ …
    }
}`)}
<p>Chữ SQL cố định và được gửi trước; giá trị được gửi như dữ liệu. PostgreSQL so cột với nguyên chuỗi <code>' OR '1'='1</code> — chẳng phòng nào tên vậy nên danh sách rỗng — còn <code>O'Brien</code> chỉ là một chuỗi có dấu nháy bên trong.</p>`)}

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">CVE</span><span class="v">Mã định danh công khai cho một lỗ hổng đã biết, vd CVE-2022-22965.</span></div>
  <div class="kv"><span class="k">SQL injection</span><span class="v">Dữ liệu đầu vào làm đổi cấu trúc câu SQL vì bị nối thẳng vào câu.</span></div>
  <div class="kv"><span class="k">Truy vấn tham số hoá</span><span class="v">SQL có chỗ giữ chỗ; giá trị gửi riêng và không bao giờ thành SQL được.</span></div>
  <div class="kv"><span class="k">Data binding (gắn dữ liệu)</span><span class="v">Tự động chép dữ liệu request vào đối tượng Java.</span></div>
  <div class="kv"><span class="k">Phụ thuộc bắc cầu</span><span class="v">Thư viện bạn có vì một thư viện bạn chọn phụ thuộc vào nó.</span></div>
  <div class="kv"><span class="k">Pool kết nối</span><span class="v">Tập kết nối cơ sở dữ liệu mở sẵn, dùng lại qua nhiều request (HikariCP trong Boot).</span></div>
  <div class="kv"><span class="k">Heap dump</span><span class="v">Tệp chứa toàn bộ bộ nhớ của một JVM đang chạy — gồm cả bí mật.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Sự cố lớn đến từ quyết định bình thường: một bản vá chưa áp (Equifax), gắn dữ liệu quá hăng (Spring4Shell), một phụ thuộc không ai biết (Log4Shell), một mặc định cho tiện (Actuator).</li>
  <li>Cùng endpoint viết tay: 58 dòng, một lỗ SQL injection, thông báo lỗi lộ câu SQL, mỗi request một kết nối mới.</li>
  <li>Với Spring Boot: 24 dòng nghiệp vụ, tham số là mặc định, lỗi JSON đồng nhất, pool 10 kết nối — không cái nào bạn phải xin.</li>
  <li>Đọc stack trace từ dưới lên, xem phiên bản Boot của mọi hướng dẫn, và học bằng cách gõ rồi phá.</li>
</ul>

<h3>Nguồn</h3>
<ul>
  <li>Báo cáo của GAO (Mỹ) về vụ Equifax (GAO-18-559, 2018): <a href="https://www.gao.gov/products/gao-18-559" target="_blank" rel="noopener">gao.gov/products/gao-18-559</a> · Tổng quan vụ rò rỉ Equifax: <a href="https://en.wikipedia.org/wiki/2017_Equifax_data_breach" target="_blank" rel="noopener">en.wikipedia.org/wiki/2017_Equifax_data_breach</a></li>
  <li>Thông báo bảo mật của Spring, CVE-2022-22965: <a href="https://spring.io/security/cve-2022-22965" target="_blank" rel="noopener">spring.io/security/cve-2022-22965</a></li>
  <li>Trang bảo mật Apache Log4j (CVE-2021-44228): <a href="https://logging.apache.org/security.html" target="_blank" rel="noopener">logging.apache.org/security.html</a> · Blog Spring "Log4J2 Vulnerability and Spring Boot" (10/12/2021): <a href="https://spring.io/blog/2021/12/10/log4j2-vulnerability-and-spring-boot" target="_blank" rel="noopener">spring.io/blog</a></li>
  <li>Ghi chú phát hành Spring Boot 2.0 (mặc định mở endpoint Actuator): <a href="https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.0-Release-Notes" target="_blank" rel="noopener">github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.0-Release-Notes</a></li>
  <li>OWASP SQL Injection Prevention Cheat Sheet: <a href="https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html" target="_blank" rel="noopener">cheatsheetseries.owasp.org</a></li>
</ul>
</div>
`;

/* ═══════════════════════════ 0.1 — Cài đặt ═══════════════════════════ */
const CMD_CAI = bash(`
# Windows (PowerShell, có winget)
winget install EclipseAdoptium.Temurin.21.JDK
# macOS (Homebrew)
brew install --cask temurin@21
# Linux / WSL / macOS — SDKMAN quản lý nhiều bản JDK song song
curl -s "https://get.sdkman.io" | bash
sdk install java 21.0.12.1-tem`);
const OUT_JAVA_V = out(`$ java -version
openjdk version "21.0.12.1" 2026-08-18 LTS
OpenJDK Runtime Environment Temurin-21.0.12.1+1 (build 21.0.12.1+1-LTS)
OpenJDK 64-Bit Server VM Temurin-21.0.12.1+1 (build 21.0.12.1+1-LTS, mixed mode, sharing)`);
const CMD_INIT = bash(`
curl -s https://start.spring.io/starter.zip \\
  -d type=maven-project -d language=java -d bootVersion=4.1.2 -d javaVersion=21 \\
  -d groupId=com.cuongthai -d artifactId=labflow -d name=labflow \\
  -d packageName=com.cuongthai.labflow -d dependencies=web,jdbc,postgresql \\
  -o labflow.zip -w '%{http_code} %{size_download}\\n'
unzip -q labflow.zip
find . -type f -not -name '*.zip' | sort`);
const OUT_INIT = out(`200 15028
./.gitattributes
./.gitignore
./.mvn/wrapper/maven-wrapper.properties
./HELP.md
./mvnw
./mvnw.cmd
./pom.xml
./src/main/java/com/cuongthai/labflow/LabflowApplication.java
./src/main/resources/application.properties
./src/test/java/com/cuongthai/labflow/LabflowApplicationTests.java`);
const OUT_MVNW = out(`$ ./mvnw -v
Apache Maven 3.10.1 (3afd8084b5629f80b97750906a719879ed4cd283)
Maven home: /tmp/.m2/wrapper/dists/apache-maven-3.10.1/987df3ef
Java version: 21.0.12.1, vendor: Eclipse Adoptium, runtime: /opt/java/openjdk

$ ./mvnw package -DskipTests
…
[INFO] BUILD SUCCESS
[INFO] Total time:  2.169 s
$ ls -la target/*.jar
-rw-r--r--. 1 dev dev 22651493 Nov 17 22:35 target/labflow-0.0.1-SNAPSHOT.jar`);
const OUT_LOI_DS = out(`$ java -jar target/labflow-0.0.1-SNAPSHOT.jar
 :: Spring Boot ::                (v4.1.2)
… Starting LabflowApplication v0.0.1-SNAPSHOT using Java 21.0.12.1 with PID 15
… Tomcat initialized with port 8080 (http)
… WARN … Exception encountered during context initialization - cancelling refresh attempt: org.springframework.beans.factory.BeanCreationException: Error creating bean …

***************************
APPLICATION FAILED TO START
***************************

Description:

Failed to configure a DataSource: 'url' attribute is not specified and no embedded datasource could be configured.

Reason: Failed to determine a suitable driver class

Action:

Consider the following:
	If you want an embedded database (H2, HSQL or Derby), please put it on the classpath.
	If you have database settings to be loaded from a particular profile you may need to activate it (no profiles are currently active).`);
const CMD_PG = bash(`
docker run -d --name labflow-pg -e POSTGRES_PASSWORD=sb -e POSTGRES_DB=labflow -p 5432:5432 postgres:16
docker exec -it labflow-pg psql -U postgres -d labflow`);
const SQL_LAB = sql(`
CREATE TABLE lab (
  id       serial PRIMARY KEY,
  name     text    NOT NULL,
  building text    NOT NULL,
  capacity integer NOT NULL
);
INSERT INTO lab (name, building, capacity) VALUES
  ('Lab AI', 'Alpha', 30), ('Lab IoT', 'Beta', 24), ('Lab Mạng', 'Alpha', 36);`);
const PROPS_DS = props(`
spring.application.name=labflow
spring.datasource.url=jdbc:postgresql://localhost:5432/labflow
spring.datasource.username=postgres
spring.datasource.password=sb`);
const OUT_CHAY_OK = out(`$ java -jar target/labflow-0.0.1-SNAPSHOT.jar
… Tomcat started on port 8080 (http) with context path '/'
… Started LabflowApplication in 2.37 seconds (process running for 2.88)

$ curl -s -i localhost:8080/
HTTP/1.1 404
{"timestamp":"2026-11-17T15:45:59.997Z","status":404,"error":"Not Found","path":"/"}`);
const OUT_TRUNG_CONG = out(`$ java -jar target/labflow-0.0.1-SNAPSHOT.jar      # chạy lần hai khi lần một còn sống
***************************
APPLICATION FAILED TO START
***************************

Description:

Web server failed to start. Port 8080 was already in use.

Action:

Identify and stop the process that's listening on port 8080 or configure this application to listen on another port.
$ echo $?
1`);

const L01_EN = `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>Installing the JDK and creating a project with Spring Initializr</h2>
<p class="lead">By the end of this lesson you will have Java 21 installed, a LabFlow project generated by Spring Initializr, a PostgreSQL database running in Docker, and a Spring Boot application that starts, fails in the most common way, and then starts properly. Every output below was produced on the course machine.</p>

<h3>Which Java? — JDK 21 LTS, from Temurin</h3>
<p>Java releases a new version every six months, but companies run <strong>LTS</strong> (long-term support) versions: 17 (2021), 21 (2023), 25 (2025). Spring Boot 4 requires at least Java 17. This course uses <strong>21</strong>: it is what most companies are moving to now, and it has <em>virtual threads</em> (Chapter 2), which Spring Boot uses for high-concurrency servers. Java 25 works the same for everything in this course.</p>
<p>“Java” is a specification; several vendors build it. Use <strong>Eclipse Temurin</strong> (free, from the Adoptium project) — not an old Oracle JRE from a 2015 tutorial.</p>
${CMD_CAI}
${OUT_JAVA_V}
<div class="callout warn"><strong>Two classic mistakes on Windows.</strong> (1) <code>java -version</code> shows 1.8 — an old Java is earlier in <code>PATH</code>; remove it or move the new <code>bin</code> folder up. (2) Maven says “JAVA_HOME is not defined correctly” — set <code>JAVA_HOME</code> to the JDK folder (the one <em>containing</em> <code>bin</code>), then open a new terminal.</div>

<h3>Maven or Gradle?</h3>
<p>Both are <strong>build tools</strong>: they download libraries (dependencies), compile, run tests and package the jar. Gradle (Groovy/Kotlin scripts) is faster on big builds and standard on Android. Maven (one <code>pom.xml</code> file in XML) is more common in Vietnamese enterprises and outsourcing, and its file is easier to read for a beginner. <strong>This course uses Maven.</strong> If your team uses Gradle, every concept maps one to one.</p>

<h3>Spring Initializr — the official project generator</h3>
<p>Nobody writes a Spring Boot project skeleton by hand. Go to <a href="https://start.spring.io" target="_blank" rel="noopener">start.spring.io</a> and choose: <em>Project</em> Maven · <em>Language</em> Java · <em>Spring Boot</em> 4.1.2 · <em>Group</em> <code>com.cuongthai</code> · <em>Artifact</em> <code>labflow</code> · <em>Packaging</em> Jar · <em>Java</em> 21 · <em>Dependencies</em>: Spring Web, JDBC API, PostgreSQL Driver. Click <em>GENERATE</em> and unzip. The site is also an API, so the same thing from a terminal — real output:</p>
${CMD_INIT}
${OUT_INIT}
<div class="kv-grid">
  <div class="kv"><span class="k">pom.xml</span><span class="v">The project description: parent <code>spring-boot-starter-parent</code> 4.1.2, Java 21, and the three starters you picked (lesson 0.2 reads it line by line).</span></div>
  <div class="kv"><span class="k">mvnw, mvnw.cmd, .mvn/</span><span class="v">The <strong>Maven Wrapper</strong>: a script that downloads the exact Maven version the project expects. Teammates need only a JDK.</span></div>
  <div class="kv"><span class="k">LabflowApplication.java</span><span class="v">The class with <code>main()</code> — the entry point.</span></div>
  <div class="kv"><span class="k">application.properties</span><span class="v">Configuration: one line for now, <code>spring.application.name=labflow</code>.</span></div>
  <div class="kv"><span class="k">LabflowApplicationTests.java</span><span class="v">One test that starts the whole application — Chapter 11.</span></div>
  <div class="kv"><span class="k">.gitignore</span><span class="v">Already ignores <code>target/</code> and IDE files. Commit everything else.</span></div>
</div>

<h3>Build it</h3>
${OUT_MVNW}
<p>Note the size: a 22.6 MB jar for an application with no code of yours. Inside are Tomcat, Spring, Jackson, HikariCP and the PostgreSQL driver — 44 libraries. That is the price of “runs anywhere with one <code>java -jar</code>”: the server needs nothing but a JRE.</p>

<h3>Run it — and meet your first Spring Boot error</h3>
${OUT_LOI_DS}
<p>Do not panic at the stack trace; read the box at the bottom. You added the JDBC starter, so Spring Boot tried to create a <code>DataSource</code> (a connection pool) — but you never said <em>where</em> the database is. The <em>Action</em> section even suggests the fixes. This is the most common first error of every Spring Boot beginner, and now you know it means “database settings missing”.</p>

<h3>Start PostgreSQL in Docker</h3>
${CMD_PG}
${SQL_LAB}
<p>Then tell Spring where it is, in <code>src/main/resources/application.properties</code>:</p>
${PROPS_DS}
${OUT_CHAY_OK}
<p>It starts. The 404 is correct — there is no endpoint yet, and notice that even the 404 is clean JSON. Copy the <code>LabController</code> from lesson 0.8 into <code>src/main/java/com/cuongthai/labflow/lab/</code>, rebuild, and <code>curl localhost:8080/labs</code> returns the three labs.</p>
<p>On the course machine port 5432 is used by other projects, so PostgreSQL was published on another port and the app joined its network; the commands above are what you type on your own machine.</p>

<h3>The second error everyone meets</h3>
${OUT_TRUNG_CONG}
<p>You started the app from IntelliJ, forgot, and started it again from the terminal. Stop the first one, or run on another port: <code>java -jar … --server.port=8081</code> (lesson 0.2 explains why that flag works).</p>

<h3>The IDE: IntelliJ IDEA</h3>
<p>Most Java teams use <strong>IntelliJ IDEA</strong>. The free Community edition is enough for this whole course: <em>File → Open</em> the folder with <code>pom.xml</code>, wait for indexing, then run <code>LabflowApplication</code> with the green ▶ next to <code>main</code>. Ultimate (free for students with a university email) adds Spring-specific views such as a bean graph — nice, not needed. VS Code with the “Extension Pack for Java” and “Spring Boot Extension Pack” also works.</p>
<div class="pitfall"><p><strong>Trap — “it works in IntelliJ but not in the terminal”.</strong> IntelliJ may use a different JDK (Project Structure → SDK) than your <code>PATH</code>, and may run with environment variables from the run configuration. When the two disagree, trust <code>./mvnw package</code> + <code>java -jar</code>: that is what the server and CI will do.</p></div>

<h3>🎤 What interviewers ask about this lesson</h3>
<ol>
  <li><strong>“What is the difference between JDK and JRE, and which LTS do you use?”</strong> — JRE runs, JDK compiles and runs; I use Java 21 LTS (Temurin), the baseline for virtual threads.</li>
  <li><strong>“Why commit the Maven Wrapper?”</strong> — Everyone, including CI, builds with exactly the same Maven version without installing it — reproducible builds.</li>
  <li><strong>“Your Spring Boot app fails with ‘Failed to configure a DataSource’. What do you check?”</strong> — The <code>spring.datasource.*</code> properties (or the profile that should provide them), that the driver is on the classpath, and that the database is reachable.</li>
</ol>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok"><ol>
  <li>Generate the project from start.spring.io (web page or <code>curl</code>), build it, and reproduce the DataSource error.</li>
  <li>Start PostgreSQL, create the <code>lab</code> table, add the three properties, and see “Started LabflowApplication”.</li>
  <li>Add <code>LabController</code> from lesson 0.8 and call <code>/labs</code> and <code>/labs?building=Alpha</code>.</li>
  <li>Break it: stop the database container (<code>docker stop labflow-pg</code>) and call <code>/labs</code> again. What status code do you get, and what does the log say?</li>
</ol>
<p><strong>Done when:</strong> you have seen both start-up errors, the JSON list of three labs, and can explain the error from step 4 in one sentence.</p></div>
${giai('What step 4 should show', `<p>Measured on the course machine. The application keeps running, but the request fails — slowly:</p>
${out(`$ curl -s -o r.json -w "%{http_code} %{time_total}s\\n" localhost:8080/labs
500 30.043567s
$ cat r.json
{"timestamp":"2026-11-17T15:48:41.461Z","status":500,"error":"Internal Server Error","path":"/labs"}`)}
<p>The log explains it: first HikariCP warns <code>Failed to validate connection … (This connection has been closed.)</code> for each pooled connection, then keeps trying to open a new one for 30 seconds (its default <code>connectionTimeout</code>), and finally <code>CannotGetJdbcConnectionException: Failed to obtain JDBC Connection</code> becomes a 500. Start the container again and the next request answers <code>200</code> in 15 ms — no restart of the app needed, the pool heals itself.</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Temurin</span><span class="v">A free, production-grade build of OpenJDK from the Eclipse Adoptium project.</span></div>
  <div class="kv"><span class="k">Build tool</span><span class="v">Maven or Gradle: downloads dependencies, compiles, tests, packages.</span></div>
  <div class="kv"><span class="k">Maven Wrapper</span><span class="v"><code>mvnw</code> — runs a pinned Maven version without installing Maven.</span></div>
  <div class="kv"><span class="k">Spring Initializr</span><span class="v">start.spring.io — generates a ready-to-build Spring Boot project.</span></div>
  <div class="kv"><span class="k">Executable (fat) jar</span><span class="v">One jar containing your code and every library, started with <code>java -jar</code>.</span></div>
  <div class="kv"><span class="k">DataSource</span><span class="v">The object that hands out database connections — in Boot, a HikariCP pool.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Install JDK 21 LTS (Temurin); check with <code>java -version</code>; fix <code>PATH</code>/<code>JAVA_HOME</code> if an old Java appears.</li>
  <li>Generate projects with start.spring.io; build with the Maven Wrapper; run with <code>java -jar</code>.</li>
  <li>“Failed to configure a DataSource” = you added JDBC/JPA but no database settings.</li>
  <li>“Port 8080 was already in use” = another instance is running; stop it or change <code>server.port</code>.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://adoptium.net/', '☕', 'adoptium.net — Eclipse Temurin downloads', 'Installers for every OS and the list of supported versions.')}
${tl('https://docs.spring.io/spring-boot/installing.html', '📘', 'Spring Boot reference — Installing Spring Boot', 'System requirements for Boot 4 and installation notes.')}
</div>
`;

const L01_VI = `
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Cài JDK và tạo dự án bằng Spring Initializr</h2>
<p class="lead">Hết bài này bạn có Java 21 trên máy, một dự án LabFlow do Spring Initializr sinh ra, một cơ sở dữ liệu PostgreSQL chạy trong Docker, và một ứng dụng Spring Boot khởi động lên, hỏng theo kiểu phổ biến nhất, rồi khởi động đúng. Mọi output dưới đây đều chạy ra trên máy soạn khoá học.</p>

<h3>Java nào? — JDK 21 LTS, bản Temurin</h3>
<p>Java ra bản mới sáu tháng một lần, nhưng công ty chạy các bản <strong>LTS</strong> (hỗ trợ dài hạn): 17 (2021), 21 (2023), 25 (2025). Spring Boot 4 cần tối thiểu Java 17. Khoá này dùng <strong>21</strong>: đó là bản phần lớn công ty đang chuyển sang, và có <em>virtual thread</em> (Chương 2) mà Spring Boot dùng cho server chịu nhiều kết nối đồng thời. Java 25 chạy y hệt với mọi thứ trong khoá.</p>
<p>"Java" là một đặc tả; nhiều hãng đóng gói nó. Hãy dùng <strong>Eclipse Temurin</strong> (miễn phí, của dự án Adoptium) — đừng dùng JRE Oracle cũ trong một hướng dẫn năm 2015.</p>
${CMD_CAI}
${OUT_JAVA_V}
<div class="callout warn"><strong>Hai lỗi kinh điển trên Windows.</strong> (1) <code>java -version</code> hiện 1.8 — một bản Java cũ đứng trước trong <code>PATH</code>; gỡ nó hoặc đưa thư mục <code>bin</code> mới lên trên. (2) Maven báo "JAVA_HOME is not defined correctly" — đặt <code>JAVA_HOME</code> trỏ vào thư mục JDK (thư mục <em>chứa</em> <code>bin</code>), rồi mở terminal mới.</div>

<h3>Maven hay Gradle?</h3>
<p>Cả hai đều là <strong>công cụ build</strong>: tải thư viện (dependency), biên dịch, chạy test và đóng gói jar. Gradle (script Groovy/Kotlin) nhanh hơn với dự án lớn và là chuẩn của Android. Maven (một tệp <code>pom.xml</code> viết bằng XML) phổ biến hơn ở doanh nghiệp và công ty outsource Việt Nam, và tệp của nó dễ đọc hơn với người mới. <strong>Khoá này dùng Maven.</strong> Nhóm bạn dùng Gradle thì mọi khái niệm vẫn tương ứng một–một.</p>

<h3>Spring Initializr — bộ sinh dự án chính thức</h3>
<p>Không ai tự gõ khung dự án Spring Boot bằng tay. Vào <a href="https://start.spring.io" target="_blank" rel="noopener">start.spring.io</a> và chọn: <em>Project</em> Maven · <em>Language</em> Java · <em>Spring Boot</em> 4.1.2 · <em>Group</em> <code>com.cuongthai</code> · <em>Artifact</em> <code>labflow</code> · <em>Packaging</em> Jar · <em>Java</em> 21 · <em>Dependencies</em>: Spring Web, JDBC API, PostgreSQL Driver. Bấm <em>GENERATE</em> rồi giải nén. Trang này cũng là một API, nên làm từ terminal cũng được — output thật:</p>
${CMD_INIT}
${OUT_INIT}
<div class="kv-grid">
  <div class="kv"><span class="k">pom.xml</span><span class="v">Bản mô tả dự án: parent <code>spring-boot-starter-parent</code> 4.1.2, Java 21, và ba starter bạn đã chọn (bài 0.2 đọc từng dòng).</span></div>
  <div class="kv"><span class="k">mvnw, mvnw.cmd, .mvn/</span><span class="v"><strong>Maven Wrapper</strong>: script tự tải đúng phiên bản Maven mà dự án cần. Bạn cùng nhóm chỉ cần có JDK.</span></div>
  <div class="kv"><span class="k">LabflowApplication.java</span><span class="v">Class có hàm <code>main()</code> — điểm vào chương trình.</span></div>
  <div class="kv"><span class="k">application.properties</span><span class="v">Cấu hình: tạm thời một dòng, <code>spring.application.name=labflow</code>.</span></div>
  <div class="kv"><span class="k">LabflowApplicationTests.java</span><span class="v">Một test khởi động toàn bộ ứng dụng — Chương 11.</span></div>
  <div class="kv"><span class="k">.gitignore</span><span class="v">Đã bỏ qua sẵn <code>target/</code> và tệp của IDE. Mọi thứ còn lại thì commit.</span></div>
</div>

<h3>Build</h3>
${OUT_MVNW}
<p>Để ý kích thước: tệp jar 22,6 MB cho một ứng dụng chưa có dòng mã nào của bạn. Bên trong là Tomcat, Spring, Jackson, HikariCP và driver PostgreSQL — 44 thư viện. Đó là cái giá của "chạy ở đâu cũng được chỉ với một lệnh <code>java -jar</code>": server không cần gì ngoài một JRE.</p>

<h3>Chạy — và gặp lỗi Spring Boot đầu tiên của đời bạn</h3>
${OUT_LOI_DS}
<p>Đừng hoảng vì stack trace; đọc cái khung ở cuối. Bạn đã thêm starter JDBC, nên Spring Boot cố tạo một <code>DataSource</code> (pool kết nối) — nhưng bạn chưa hề nói cơ sở dữ liệu nằm <em>ở đâu</em>. Mục <em>Action</em> còn gợi ý luôn cách sửa. Đây là lỗi đầu tiên phổ biến nhất của mọi người mới học Spring Boot, và giờ bạn biết nó nghĩa là "thiếu cấu hình cơ sở dữ liệu".</p>

<h3>Chạy PostgreSQL trong Docker</h3>
${CMD_PG}
${SQL_LAB}
<p>Rồi báo cho Spring biết nó ở đâu, trong <code>src/main/resources/application.properties</code>:</p>
${PROPS_DS}
${OUT_CHAY_OK}
<p>Khởi động được rồi. Lỗi 404 là đúng — chưa có endpoint nào, và để ý ngay cả 404 cũng là JSON gọn gàng. Chép <code>LabController</code> ở bài 0.8 vào <code>src/main/java/com/cuongthai/labflow/lab/</code>, build lại, và <code>curl localhost:8080/labs</code> trả về ba phòng lab.</p>
<p>Trên máy soạn khoá, cổng 5432 đang được dự án khác dùng nên PostgreSQL được mở ở cổng khác và ứng dụng nhập vào mạng của nó; các lệnh ở trên là thứ bạn gõ trên máy của mình.</p>

<h3>Lỗi thứ hai ai cũng gặp</h3>
${OUT_TRUNG_CONG}
<p>Bạn chạy ứng dụng từ IntelliJ, quên mất, rồi chạy thêm lần nữa từ terminal. Tắt bản thứ nhất, hoặc chạy ở cổng khác: <code>java -jar … --server.port=8081</code> (bài 0.2 giải thích vì sao cờ đó có tác dụng).</p>

<h3>IDE: IntelliJ IDEA</h3>
<p>Phần lớn đội Java dùng <strong>IntelliJ IDEA</strong>. Bản Community miễn phí đủ dùng cho cả khoá: <em>File → Open</em> thư mục chứa <code>pom.xml</code>, chờ lập chỉ mục xong, rồi chạy <code>LabflowApplication</code> bằng nút ▶ xanh cạnh <code>main</code>. Bản Ultimate (miễn phí cho sinh viên có email trường) thêm các khung nhìn riêng cho Spring như đồ thị bean — có thì hay, không có cũng chẳng sao. VS Code với "Extension Pack for Java" và "Spring Boot Extension Pack" cũng dùng được.</p>
<div class="pitfall"><p><strong>Bẫy — "chạy trong IntelliJ được mà ra terminal thì không".</strong> IntelliJ có thể dùng một JDK khác (Project Structure → SDK) với JDK trong <code>PATH</code>, và có thể chạy kèm biến môi trường trong cấu hình chạy. Hai bên lệch nhau thì tin <code>./mvnw package</code> + <code>java -jar</code>: đó là điều server và CI sẽ làm.</p></div>

<h3>🎤 Người phỏng vấn sẽ hỏi gì về bài này</h3>
<ol>
  <li><strong>"JDK và JRE khác nhau thế nào, bạn dùng bản LTS nào?"</strong> — JRE để chạy, JDK để biên dịch và chạy; tôi dùng Java 21 LTS (Temurin), mốc tối thiểu để có virtual thread.</li>
  <li><strong>"Vì sao commit Maven Wrapper?"</strong> — Mọi người, kể cả CI, build bằng đúng một phiên bản Maven mà không cần cài — build tái lập được.</li>
  <li><strong>"Ứng dụng Spring Boot báo 'Failed to configure a DataSource'. Bạn kiểm gì?"</strong> — Các thuộc tính <code>spring.datasource.*</code> (hoặc profile lẽ ra cung cấp chúng), driver đã có trên classpath chưa, và cơ sở dữ liệu có kết nối tới được không.</li>
</ol>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok"><ol>
  <li>Sinh dự án từ start.spring.io (trang web hoặc <code>curl</code>), build, và tái hiện lỗi DataSource.</li>
  <li>Chạy PostgreSQL, tạo bảng <code>lab</code>, thêm ba thuộc tính, và thấy dòng "Started LabflowApplication".</li>
  <li>Thêm <code>LabController</code> từ bài 0.8 rồi gọi <code>/labs</code> và <code>/labs?building=Alpha</code>.</li>
  <li>Phá thử: tắt container cơ sở dữ liệu (<code>docker stop labflow-pg</code>) rồi gọi lại <code>/labs</code>. Bạn nhận mã trạng thái nào, log ghi gì?</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đã thấy cả hai lỗi lúc khởi động, thấy danh sách JSON ba phòng lab, và giải thích được lỗi ở bước 4 trong một câu.</p></div>
${giai('Bước 4 lẽ ra phải thấy gì', `<p>Đo trên máy soạn khoá. Ứng dụng vẫn sống, nhưng request thất bại — và thất bại chậm:</p>
${out(`$ curl -s -o r.json -w "%{http_code} %{time_total}s\\n" localhost:8080/labs
500 30.043567s
$ cat r.json
{"timestamp":"2026-11-17T15:48:41.461Z","status":500,"error":"Internal Server Error","path":"/labs"}`)}
<p>Log giải thích: đầu tiên HikariCP cảnh báo <code>Failed to validate connection … (This connection has been closed.)</code> cho từng kết nối trong pool, rồi cố mở kết nối mới suốt 30 giây (<code>connectionTimeout</code> mặc định), cuối cùng <code>CannotGetJdbcConnectionException: Failed to obtain JDBC Connection</code> biến thành lỗi 500. Bật lại container là request kế tiếp trả <code>200</code> trong 15 ms — không cần khởi động lại ứng dụng, pool tự lành.</p>`)}

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Temurin</span><span class="v">Bản OpenJDK miễn phí, dùng được cho production, của dự án Eclipse Adoptium.</span></div>
  <div class="kv"><span class="k">Công cụ build</span><span class="v">Maven hoặc Gradle: tải dependency, biên dịch, test, đóng gói.</span></div>
  <div class="kv"><span class="k">Maven Wrapper</span><span class="v"><code>mvnw</code> — chạy một phiên bản Maven cố định mà không cần cài Maven.</span></div>
  <div class="kv"><span class="k">Spring Initializr</span><span class="v">start.spring.io — sinh ra một dự án Spring Boot build được ngay.</span></div>
  <div class="kv"><span class="k">Jar chạy thẳng (fat jar)</span><span class="v">Một tệp jar chứa mã của bạn và mọi thư viện, chạy bằng <code>java -jar</code>.</span></div>
  <div class="kv"><span class="k">DataSource</span><span class="v">Đối tượng phát kết nối cơ sở dữ liệu — trong Boot là một pool HikariCP.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Cài JDK 21 LTS (Temurin); kiểm bằng <code>java -version</code>; sửa <code>PATH</code>/<code>JAVA_HOME</code> nếu hiện ra Java cũ.</li>
  <li>Sinh dự án bằng start.spring.io; build bằng Maven Wrapper; chạy bằng <code>java -jar</code>.</li>
  <li>"Failed to configure a DataSource" = đã thêm JDBC/JPA nhưng chưa có cấu hình cơ sở dữ liệu.</li>
  <li>"Port 8080 was already in use" = một bản khác đang chạy; tắt nó hoặc đổi <code>server.port</code>.</li>
</ul>

<h3>📚 Học sâu thêm</h3>
${tl('https://adoptium.net/', '☕', 'adoptium.net — tải Eclipse Temurin', 'Bộ cài cho mọi hệ điều hành và danh sách phiên bản được hỗ trợ.')}
${tl('https://docs.spring.io/spring-boot/installing.html', '📘', 'Tài liệu Spring Boot — Installing Spring Boot', 'Yêu cầu hệ thống của Boot 4 và ghi chú cài đặt.')}
</div>
`;

/* ═══════════════════════════ 0.2 — Giải phẫu dự án ═══════════════════════════ */
const MA_MAIN = java(`
package com.cuongthai.labflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class LabflowApplication {

    public static void main(String[] args) {
        SpringApplication.run(LabflowApplication.class, args);
    }
}`);
const MA_TUONG_DUONG = java(`
@SpringBootConfiguration      // lớp này là một nguồn cấu hình (có thể chứa @Bean)
@EnableAutoConfiguration      // bật tự cấu hình theo classpath + thuộc tính
@ComponentScan                // quét package hiện tại và MỌI package con để tìm @Component
public class LabflowApplication { … }`);
const CAY_THU_MUC = out(`labflow/
├── pom.xml
├── mvnw, mvnw.cmd, .mvn/
└── src/
    ├── main/
    │   ├── java/com/cuongthai/labflow/
    │   │   ├── LabflowApplication.java      ← @SpringBootApplication, gốc của việc quét
    │   │   ├── BeanCount.java               ← in danh sách bean lúc khởi động (để học)
    │   │   └── lab/
    │   │       ├── Lab.java                 ← record dữ liệu
    │   │       ├── LabController.java       ← @RestController: HTTP vào/ra
    │   │       ├── LabService.java          ← @Service: quy tắc nghiệp vụ
    │   │       └── LabRepository.java       ← @Repository: nói chuyện với DB
    │   └── resources/
    │       └── application.yml
    └── test/java/com/cuongthai/labflow/
        └── LabflowApplicationTests.java`);
const MA_BA_TANG = java(`
@RestController
public class LabController {
    private final LabService service;
    LabController(LabService service) { this.service = service; }      // Spring tự đưa LabService vào

    @GetMapping("/labs")
    List<Lab> list(@RequestParam(required = false) String building) { return service.list(building); }

    @GetMapping("/hours")
    Map<String, String> hours() { return Map.of("open", service.hours()); }
}

@Service
public class LabService {
    private final LabRepository repo;
    private final int openHour;
    private final int closeHour;

    LabService(LabRepository repo,
               @Value("\${labflow.open-hour}") int openHour,              // đọc từ application.yml
               @Value("\${labflow.close-hour}") int closeHour) {
        this.repo = repo;
        this.openHour = openHour;
        this.closeHour = closeHour;
    }

    List<Lab> list(String building) { return building == null ? repo.findAll() : repo.findByBuilding(building); }
    String hours() { return openHour + "h-" + closeHour + "h"; }
}

@Repository
public class LabRepository {
    private final JdbcClient db;
    LabRepository(JdbcClient db) { this.db = db; }                      // JdbcClient do Boot tự tạo

    List<Lab> findByBuilding(String building) {
        return db.sql("SELECT id, name, building, capacity FROM lab WHERE building = ?")
                 .param(building).query(Lab.class).list();
    }
    List<Lab> findAll() {
        return db.sql("SELECT id, name, building, capacity FROM lab").query(Lab.class).list();
    }
}`);
const YML = yml(`
spring:
  application:
    name: labflow
  datasource:
    url: jdbc:postgresql://localhost:5432/labflow
    username: postgres
    password: sb
server:
  port: 8080
labflow:
  open-hour: 7
  close-hour: 21`);
const MA_BEANCOUNT = java(`
@Component
class BeanCount implements CommandLineRunner {          // chạy một lần, ngay sau khi ứng dụng khởi động xong
    private final ApplicationContext ctx;
    BeanCount(ApplicationContext ctx) { this.ctx = ctx; }

    @Override
    public void run(String... args) {
        String[] names = ctx.getBeanDefinitionNames();
        System.out.println("Tong so bean: " + names.length);
        Arrays.stream(names)
              .filter(n -> n.startsWith("lab") || n.equals("beanCount"))
              .sorted()
              .forEach(n -> System.out.println("  " + n + " -> " + ctx.getBean(n).getClass().getSimpleName()));
    }
}`);
const OUT_BEAN = out(`… Tomcat started on port 8083 (http) with context path '/'
… Started LabflowApplication in 1.797 seconds (process running for 2.151)
Tong so bean: 190
  beanCount -> BeanCount
  labController -> LabController
  labRepository -> LabRepository$$SpringCGLIB$$0
  labService -> LabService
  labflowApplication -> LabflowApplication`);
const OUT_QUET_SAI = out(`# PingController đặt ở package com.cuongthai.khac — NGOÀI com.cuongthai.labflow
$ curl -s -i localhost:8092/ping
HTTP/1.1 404
{"timestamp":"2026-11-17T15:36:57.441Z","status":404,"error":"Not Found","path":"/ping"}
# số bean vẫn là 190: Spring không hề thấy lớp đó
Tong so bean: 190`);
const OUT_UU_TIEN = out(`# 1) chỉ có application.yml (close-hour: 21)
$ curl -s localhost:8080/hours
{"open":"7h-21h"}

# 2) biến môi trường ghi đè: SERVER_PORT=8090 LABFLOW_CLOSE_HOUR=22
$ curl -s localhost:8090/hours
{"open":"7h-22h"}
… Tomcat started on port 8090 (http) with context path '/'

# 3) tham số dòng lệnh thắng cả biến môi trường: SERVER_PORT=8090 nhưng --server.port=8091 --labflow.open-hour=6
$ curl -s localhost:8091/hours
{"open":"6h-21h"}
… Tomcat started on port 8091 (http) with context path '/'`);
const POM = xml(`
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>4.1.2</version>              <!-- MỘT con số quyết định phiên bản của ~cả trăm thư viện -->
</parent>
<properties>
    <java.version>21</java.version>
</properties>
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-webmvc</artifactId>   <!-- không ghi version: parent lo -->
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-jdbc</artifactId>
    </dependency>
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>             <!-- chỉ cần lúc chạy, mã của ta không gọi trực tiếp -->
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-webmvc-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
<build>
    <plugins>
        <plugin>                           <!-- đóng gói fat jar chạy bằng java -jar -->
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>`);
const OUT_JAR = out(`$ unzip -l target/labflow-0.0.1-SNAPSHOT.jar | grep -c 'BOOT-INF/lib/'
44
$ unzip -l target/labflow-0.0.1-SNAPSHOT.jar | grep 'BOOT-INF/lib/' | awk '{print $4}' | sed 's#BOOT-INF/lib/##'
spring-boot-autoconfigure-4.1.2.jar   tomcat-embed-core-11.0.27.jar   spring-webmvc-7.0.10.jar
jackson-databind-3.1.7.jar            HikariCP-7.0.2.jar              postgresql-42.7.14.jar
spring-context-7.0.10.jar             spring-jdbc-7.0.10.jar          logback-classic-1.5.38.jar   … (44 tệp)`);
const OUT_DEBUG = out(`$ java -jar target/labflow-0.0.1-SNAPSHOT.jar --debug
============================
CONDITIONS EVALUATION REPORT
============================
Positive matches:   (74 mục)
   DataSourceAutoConfiguration matched:
      - @ConditionalOnClass found required classes 'javax.sql.DataSource', 'org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType' (OnClassCondition)
      - @ConditionalOnMissingBean (types: io.r2dbc.spi.ConnectionFactory; SearchStrategy: all) did not find any beans (OnBeanCondition)
Negative matches:   (58 mục)
   JacksonAutoConfiguration.XmlConfiguration:
      Did not match:
         - @ConditionalOnClass did not find required class 'tools.jackson.dataformat.xml.XmlMapper' (OnClassCondition)
   DataSourceJmxConfiguration:
      Did not match:
         - @ConditionalOnBooleanProperty (spring.jmx.enabled=true) did not find property 'spring.jmx.enabled' (OnPropertyCondition)`);

const L02_EN = `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Anatomy of a Spring Boot project</h2>
<p class="lead">You can run the project; now you will be able to <em>explain</em> it. This lesson opens every file Initializr gave you, splits the LabFlow endpoint into the three layers every Spring team uses, and then makes the invisible visible: we print the 190 objects Spring created, prove that a class outside the right package does not exist for Spring, override configuration three different ways, and read the report in which Boot explains every decision it made.</p>

<h3>The entry point: one annotation, three jobs</h3>
${MA_MAIN}
<p><code>SpringApplication.run</code> starts everything: it creates the <strong>application context</strong> (the container that holds all the objects Spring manages — called <em>beans</em>), applies auto-configuration, starts the embedded Tomcat, and returns. <code>@SpringBootApplication</code> is a shortcut for three annotations:</p>
${MA_TUONG_DUONG}
<p>The third one has a consequence you must remember: Spring only finds your classes in <strong>the package of the main class and its sub-packages</strong>. We will break this on purpose in a minute.</p>

<h3>The folder layout — and three layers</h3>
${CAY_THU_MUC}
<p>Real projects split responsibility into three layers. The rule is that each layer only talks to the one below it:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Controller</span><span class="lz-t">HTTP in, HTTP out</span><span class="lz-d">Reads the URL and parameters, calls the service, returns data. No SQL, no business rules. Like the receptionist at the lab building: takes your request, does not decide.</span></div>
  <div class="lz-step"><span class="lz-k">Service</span><span class="lz-t">The rules</span><span class="lz-d">“A lab can be booked only between 7h and 21h”, “a student may hold at most 2 bookings”. Transactions live here (Chapter 6). Like the lab manager who decides.</span></div>
  <div class="lz-step"><span class="lz-k">Repository</span><span class="lz-t">Talks to the database</span><span class="lz-d">SQL or JPA, nothing else. Like the storeroom clerk who fetches the register.</span></div>
</div>
${MA_BA_TANG}
<p>Look at the constructors. No class ever writes <code>new LabService(…)</code> or <code>new LabRepository(…)</code>. Each simply <em>declares</em> what it needs in its constructor, and Spring, which creates all three, passes them in. That is <strong>dependency injection</strong> — Chapter 3 takes it apart. Even <code>JdbcClient</code> was never declared by us; auto-configuration created it because the JDBC starter is present.</p>

<h3>Configuration: application.yml</h3>
<p>Initializr gives you <code>application.properties</code>. Many teams prefer YAML for its nesting — same keys, choose one format per project:</p>
${YML}
<p><code>labflow.open-hour</code> is our own key; <code>@Value("\${labflow.open-hour}")</code> reads it. Chapter 3 replaces <code>@Value</code> with typed <code>@ConfigurationProperties</code>.</p>

<h3>Make the invisible visible ① — print the beans</h3>
<p>A tiny class that runs once after start-up and asks the container what it holds:</p>
${MA_BEANCOUNT}
${OUT_BEAN}
<p>Two facts worth a screenshot. First, <strong>190 beans</strong> exist; we wrote 5. The other 185 are Tomcat, Jackson, the DataSource, the JdbcClient, converters — auto-configuration's work. Second, look at <code>labRepository -&gt; LabRepository$$SpringCGLIB$$0</code>. The object Spring hands to <code>LabService</code> is <em>not</em> our class: it is a <strong>proxy</strong>, a generated subclass that wraps ours. <code>@Repository</code> asks Spring to translate database exceptions, and Spring does it by wrapping. The same mechanism makes <code>@Transactional</code> and <code>@Cacheable</code> work — and explains their famous traps (Chapter 3.5).</p>

<h3>Make the invisible visible ② — the package that does not exist</h3>
<p>Put a controller in <code>com.cuongthai.khac</code> — outside <code>com.cuongthai.labflow</code> — and call it:</p>
${OUT_QUET_SAI}
<p>No error at start-up, no warning, just a 404 — the class compiled, but component scanning never looked there. This is one of the most common “my endpoint doesn't work” questions on forums. <strong>Rule:</strong> keep the main class in the root package and everything else below it.</p>

<h3>Make the invisible visible ③ — who wins when settings disagree?</h3>
<p>Spring Boot reads configuration from many places and has a fixed order. The three you use every week, real output:</p>
${OUT_UU_TIEN}
<div class="kv-grid">
  <div class="kv"><span class="k">Lowest</span><span class="v"><code>application.yml</code> / <code>.properties</code> inside the jar — defaults for developers.</span></div>
  <div class="kv"><span class="k">Higher</span><span class="v">Environment variables — <code>LABFLOW_CLOSE_HOUR</code> maps to <code>labflow.close-hour</code> (upper case, dots and dashes → underscores). How Docker and servers configure apps (Chapter 17).</span></div>
  <div class="kv"><span class="k">Highest (of these)</span><span class="v">Command-line arguments <code>--key=value</code>.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — committing the production password in <code>application.yml</code>.</strong> The file goes into Git and into the jar. Keep only local development values there; production secrets come from environment variables or a secret store. GitHub's own secret-scanning reports find millions of leaked credentials in public repositories every year — a Spring datasource password is a classic.</p></div>

<h3>pom.xml, the parts that matter</h3>
${POM}
<p>The <strong>parent</strong> carries a bill of materials: a list of tested versions for Spring, Tomcat, Jackson, Hibernate, the PostgreSQL driver and hundreds more. That is why the dependencies have no <code>&lt;version&gt;</code>. A <strong>starter</strong> is a dependency that pulls in a set: <code>spring-boot-starter-webmvc</code> brings Spring MVC, Tomcat and Jackson. In Boot 4 starters became more modular — <code>webmvc</code> instead of Boot 3's <code>web</code>, and a matching <code>…-test</code> starter for each.</p>
<p>The <strong>spring-boot-maven-plugin</strong> builds the executable jar. Look inside:</p>
${OUT_JAR}

<h3>Make the invisible visible ④ — Boot explains its own decisions</h3>
<p>Start with <code>--debug</code> and Boot prints the <em>conditions evaluation report</em>: every auto-configuration it considered, and why it was applied or skipped.</p>
${OUT_DEBUG}
<p>Read one entry: <code>DataSourceAutoConfiguration</code> was applied <em>because</em> the class <code>javax.sql.DataSource</code> is on the classpath. The XML support of Jackson was skipped <em>because</em> the XML library is not. That is the entire idea of auto-configuration — “if this class is present and the user did not define this bean, create it” — and you can always read the reasoning. Chapter 3.6 writes our own auto-configuration.</p>

<h3>🧪 Lab — Section 0: LabFlow skeleton, three layers</h3>
<div class="callout ok">
<p><strong>Context.</strong> Your SWP391 team asks you to set up the backend skeleton everyone will build on. It must run with one command against PostgreSQL and show the team the structure they should copy.</p>
<p><strong>Requirements</strong></p>
<ol>
  <li>A Spring Boot 4.1.x project, Java 21, package <code>com.cuongthai.labflow</code>, built with the Maven Wrapper.</li>
  <li>Table <code>lab</code> with at least 3 rows in PostgreSQL (Docker).</li>
  <li>Three layers in package <code>lab</code>: <code>LabController</code>, <code>LabService</code>, <code>LabRepository</code>, plus record <code>Lab</code>. Constructor injection only; no <code>new</code> of these classes anywhere.</li>
  <li><code>GET /labs</code>, <code>GET /labs?building=…</code> (parameterised SQL), and <code>GET /labs/count</code> returning <code>{"count": N}</code>.</li>
  <li>Opening hours from <code>application.yml</code> (<code>labflow.open-hour</code>, <code>labflow.close-hour</code>) exposed at <code>GET /hours</code>; prove an environment variable overrides one of them.</li>
  <li>A <code>README.md</code> with the exact commands to start the database and the app, and the number of beans your app has.</li>
</ol>
<p><strong>Hints (open only if stuck).</strong> Level 1: copy the three classes from this lesson and add one method per layer for the count. Level 2: <code>SELECT count(*) FROM lab</code> with <code>.query(Integer.class).single()</code>. Level 3: return <code>Map.of("count", n)</code> from the controller.</p>
<p><strong>Rubric (10 points).</strong> Builds and starts with the README commands — 2 · three layers with constructor injection — 2 · all four endpoints correct — 2 · no SQL built by concatenation (try <code>' OR '1'='1</code>) — 2 · environment override demonstrated in README — 1 · bean count reported — 1.</p>
<p><strong>Extra challenge.</strong> Move <code>LabflowApplication</code> into <code>com.cuongthai.labflow.app</code> and fix the resulting 404s <em>without</em> moving it back (look at <code>scanBasePackages</code>).</p>
</div>
${giai('Show the reference solution (try first!)', `${java(`
// LabRepository
int count() {
    return db.sql("SELECT count(*) FROM lab").query(Integer.class).single();
}
// LabService
int count() { return repo.count(); }
// LabController
@GetMapping("/labs/count")
Map<String, Integer> count() { return Map.of("count", service.count()); }`)}
${bash(`
# README: run
docker run -d --name labflow-pg -e POSTGRES_PASSWORD=sb -e POSTGRES_DB=labflow -p 5432:5432 postgres:16
./mvnw package -DskipTests && java -jar target/labflow-0.0.1-SNAPSHOT.jar
# override proof
LABFLOW_CLOSE_HOUR=22 java -jar target/labflow-0.0.1-SNAPSHOT.jar   # /hours -> {"open":"7h-22h"}`)}
<p>Extra challenge: <code>@SpringBootApplication(scanBasePackages = "com.cuongthai.labflow")</code> — but the cleaner fix is still to keep the main class at the root.</p>`)}

<h3>🎤 What interviewers ask about this lesson</h3>
<ol>
  <li><strong>“What does @SpringBootApplication do?”</strong> — It combines <code>@SpringBootConfiguration</code>, <code>@EnableAutoConfiguration</code> and <code>@ComponentScan</code>: marks the configuration class, turns on auto-configuration, and scans the current package and sub-packages for components.</li>
  <li><strong>“How does auto-configuration decide what to create?”</strong> — Conditions: <code>@ConditionalOnClass</code> (a library is on the classpath), <code>@ConditionalOnMissingBean</code> (you did not define your own), <code>@ConditionalOnProperty</code>. You can see the decisions with <code>--debug</code>.</li>
  <li><strong>“Why controller, service, repository?”</strong> — Separation of concerns: HTTP, business rules and persistence change for different reasons; each layer can be tested alone; transactions belong to the service.</li>
  <li><strong>“How do you configure different environments?”</strong> — Defaults in <code>application.yml</code>, overrides by profile files, environment variables and command-line arguments, in increasing priority; secrets never in the repository.</li>
</ol>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Bean</span><span class="v">An object created and managed by the Spring container.</span></div>
  <div class="kv"><span class="k">Application context</span><span class="v">The container holding all beans; created by <code>SpringApplication.run</code>.</span></div>
  <div class="kv"><span class="k">Component scanning</span><span class="v">Finding classes annotated <code>@Component</code>/<code>@Service</code>/<code>@Repository</code>/<code>@RestController</code> under the main package.</span></div>
  <div class="kv"><span class="k">Dependency injection</span><span class="v">A class declares what it needs (constructor); the container provides it.</span></div>
  <div class="kv"><span class="k">Proxy</span><span class="v">A generated wrapper around your bean that adds behaviour (exception translation, transactions).</span></div>
  <div class="kv"><span class="k">Bill of materials (BOM)</span><span class="v">A curated list of compatible library versions, inherited through the Boot parent.</span></div>
  <div class="kv"><span class="k">Conditions evaluation report</span><span class="v">Boot's explanation of every auto-configuration applied or skipped (<code>--debug</code>).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li><code>@SpringBootApplication</code> = configuration + auto-configuration + component scan from the main class's package down.</li>
  <li>Controller → service → repository; dependencies come in through constructors, never with <code>new</code>.</li>
  <li>190 beans in a 5-class app; one of ours is already a CGLIB proxy.</li>
  <li>A class outside the scanned package silently does not exist: 404, no error.</li>
  <li>Configuration priority: file &lt; environment variable &lt; command line.</li>
  <li>The Boot parent pins versions; starters bundle libraries; the Maven plugin builds the fat jar; <code>--debug</code> shows why.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.spring.io/spring-boot/reference/features/external-config.html', '⚙️', 'Spring Boot — Externalized Configuration', 'The full order of the 15+ configuration sources and the relaxed-binding rules for environment variables.')}
${tl('https://docs.spring.io/spring-boot/reference/using/structuring-your-code.html', '🗂', 'Spring Boot — Structuring Your Code', 'Why the main class belongs in the root package.')}
</div>
`;

const L02_VI = `
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Giải phẫu một dự án Spring Boot</h2>
<p class="lead">Bạn đã chạy được dự án; giờ bạn sẽ <em>giải thích</em> được nó. Bài này mở từng tệp Initializr đưa cho bạn, tách endpoint LabFlow thành ba tầng mà đội Spring nào cũng dùng, rồi biến cái vô hình thành nhìn thấy được: in ra 190 đối tượng Spring đã tạo, chứng minh một class đặt sai package thì với Spring nó không tồn tại, ghi đè cấu hình theo ba cách, và đọc bản báo cáo trong đó Boot tự giải thích mọi quyết định của nó.</p>

<h3>Điểm vào: một annotation, ba việc</h3>
${MA_MAIN}
<p><code>SpringApplication.run</code> khởi động mọi thứ: tạo <strong>application context</strong> (cái thùng chứa mọi đối tượng Spring quản lý — gọi là <em>bean</em>), áp tự cấu hình, bật Tomcat nhúng, rồi trả về. <code>@SpringBootApplication</code> là cách viết tắt của ba annotation:</p>
${MA_TUONG_DUONG}
<p>Annotation thứ ba có một hệ quả bạn phải nhớ: Spring chỉ tìm class của bạn trong <strong>package của class main và các package con của nó</strong>. Lát nữa ta sẽ cố tình làm hỏng chỗ này.</p>

<h3>Bố cục thư mục — và ba tầng</h3>
${CAY_THU_MUC}
<p>Dự án thật chia trách nhiệm thành ba tầng. Luật là mỗi tầng chỉ nói chuyện với tầng ngay dưới nó:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Controller</span><span class="lz-t">HTTP vào, HTTP ra</span><span class="lz-d">Đọc URL và tham số, gọi service, trả dữ liệu. Không SQL, không quy tắc nghiệp vụ. Như cô lễ tân toà nhà lab: nhận yêu cầu của bạn, không tự quyết.</span></div>
  <div class="lz-step"><span class="lz-k">Service</span><span class="lz-t">Các quy tắc</span><span class="lz-d">"Chỉ đặt lab trong khung 7h–21h", "mỗi sinh viên giữ tối đa 2 lượt đặt". Giao dịch nằm ở đây (Chương 6). Như anh quản lý lab — người quyết.</span></div>
  <div class="lz-step"><span class="lz-k">Repository</span><span class="lz-t">Nói chuyện với cơ sở dữ liệu</span><span class="lz-d">SQL hoặc JPA, không gì khác. Như chú thủ kho đi lấy sổ.</span></div>
</div>
${MA_BA_TANG}
<p>Nhìn các constructor. Không class nào viết <code>new LabService(…)</code> hay <code>new LabRepository(…)</code>. Mỗi class chỉ <em>khai báo</em> mình cần gì trong constructor, và Spring — kẻ tạo ra cả ba — đưa chúng vào. Đó là <strong>dependency injection</strong> (tiêm phụ thuộc) — Chương 3 mổ xẻ nó. Ngay cả <code>JdbcClient</code> ta cũng chưa từng khai báo; auto-configuration tự tạo vì starter JDBC có mặt.</p>

<h3>Cấu hình: application.yml</h3>
<p>Initializr đưa bạn <code>application.properties</code>. Nhiều đội thích YAML vì lồng nhau dễ đọc — cùng các khoá, mỗi dự án chọn một định dạng:</p>
${YML}
<p><code>labflow.open-hour</code> là khoá của riêng ta; <code>@Value("\${labflow.open-hour}")</code> đọc nó. Chương 3 thay <code>@Value</code> bằng <code>@ConfigurationProperties</code> có kiểu.</p>

<h3>Nhìn thấy cái vô hình ① — in danh sách bean</h3>
<p>Một class nhỏ chạy đúng một lần sau khi khởi động xong và hỏi container đang giữ những gì:</p>
${MA_BEANCOUNT}
${OUT_BEAN}
<p>Hai điều đáng chụp màn hình. Một, có <strong>190 bean</strong>; ta viết 5. 185 cái còn lại là Tomcat, Jackson, DataSource, JdbcClient, các bộ chuyển đổi — công của auto-configuration. Hai, nhìn dòng <code>labRepository -&gt; LabRepository$$SpringCGLIB$$0</code>. Đối tượng Spring đưa cho <code>LabService</code> <em>không phải</em> class của ta: nó là một <strong>proxy</strong>, một lớp con được sinh tự động bọc lấy lớp của ta. <code>@Repository</code> nhờ Spring dịch exception của cơ sở dữ liệu, và Spring làm việc đó bằng cách bọc lại. Cùng cơ chế này làm <code>@Transactional</code> và <code>@Cacheable</code> chạy được — và giải thích luôn những cái bẫy nổi tiếng của chúng (Chương 3.5).</p>

<h3>Nhìn thấy cái vô hình ② — package không tồn tại</h3>
<p>Đặt một controller vào <code>com.cuongthai.khac</code> — nằm ngoài <code>com.cuongthai.labflow</code> — rồi gọi nó:</p>
${OUT_QUET_SAI}
<p>Khởi động không lỗi, không cảnh báo, chỉ có 404 — class vẫn biên dịch, nhưng việc quét component chưa bao giờ nhìn tới đó. Đây là một trong những câu hỏi "endpoint của em không chạy" phổ biến nhất trên các diễn đàn. <strong>Luật:</strong> để class main ở package gốc và mọi thứ khác nằm bên dưới nó.</p>

<h3>Nhìn thấy cái vô hình ③ — cấu hình bất đồng thì ai thắng?</h3>
<p>Spring Boot đọc cấu hình từ nhiều nơi theo một thứ tự cố định. Ba nơi bạn dùng hằng tuần, output thật:</p>
${OUT_UU_TIEN}
<div class="kv-grid">
  <div class="kv"><span class="k">Thấp nhất</span><span class="v"><code>application.yml</code> / <code>.properties</code> nằm trong jar — giá trị mặc định cho lập trình viên.</span></div>
  <div class="kv"><span class="k">Cao hơn</span><span class="v">Biến môi trường — <code>LABFLOW_CLOSE_HOUR</code> ứng với <code>labflow.close-hour</code> (viết hoa, dấu chấm và gạch ngang → gạch dưới). Cách Docker và server cấu hình ứng dụng (Chương 17).</span></div>
  <div class="kv"><span class="k">Cao nhất (trong ba nơi)</span><span class="v">Tham số dòng lệnh <code>--khoá=giá-trị</code>.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — commit mật khẩu production vào <code>application.yml</code>.</strong> Tệp đó vào Git và vào jar. Chỉ để giá trị phát triển cục bộ ở đó; bí mật production lấy từ biến môi trường hoặc kho bí mật. Chính báo cáo quét bí mật của GitHub năm nào cũng tìm thấy hàng triệu thông tin đăng nhập bị lộ trong repository công khai — mật khẩu datasource của Spring là ví dụ kinh điển.</p></div>

<h3>pom.xml, những phần quan trọng</h3>
${POM}
<p><strong>Parent</strong> mang theo một "bảng vật tư" (bill of materials): danh sách phiên bản đã kiểm cùng nhau của Spring, Tomcat, Jackson, Hibernate, driver PostgreSQL và hàng trăm thư viện khác. Vì vậy các dependency không có <code>&lt;version&gt;</code>. Một <strong>starter</strong> là dependency kéo theo cả một bộ: <code>spring-boot-starter-webmvc</code> mang theo Spring MVC, Tomcat và Jackson. Ở Boot 4 starter được chia mô-đun kỹ hơn — <code>webmvc</code> thay cho <code>web</code> của Boot 3, và mỗi starter có một starter <code>…-test</code> đi kèm.</p>
<p><strong>spring-boot-maven-plugin</strong> đóng gói jar chạy thẳng. Nhìn vào bên trong:</p>
${OUT_JAR}

<h3>Nhìn thấy cái vô hình ④ — Boot tự giải thích quyết định của mình</h3>
<p>Khởi động với <code>--debug</code> và Boot in ra <em>báo cáo đánh giá điều kiện</em>: mọi auto-configuration nó đã cân nhắc, và vì sao được áp hay bị bỏ qua.</p>
${OUT_DEBUG}
<p>Đọc một mục: <code>DataSourceAutoConfiguration</code> được áp <em>vì</em> class <code>javax.sql.DataSource</code> có trên classpath. Phần hỗ trợ XML của Jackson bị bỏ qua <em>vì</em> thư viện XML không có. Toàn bộ ý tưởng của auto-configuration chỉ có vậy — "nếu class này có mặt và người dùng chưa tự định nghĩa bean này, thì tạo nó" — và bạn luôn đọc được lý lẽ. Chương 3.6 tự viết một auto-configuration của riêng ta.</p>

<h3>🧪 Lab — Mục 0: khung LabFlow, ba tầng</h3>
<div class="callout ok">
<p><strong>Bối cảnh.</strong> Nhóm SWP391 nhờ bạn dựng khung backend mà cả nhóm sẽ xây tiếp lên. Nó phải chạy bằng một lệnh với PostgreSQL và cho cả nhóm thấy cấu trúc cần làm theo.</p>
<p><strong>Yêu cầu</strong></p>
<ol>
  <li>Dự án Spring Boot 4.1.x, Java 21, package <code>com.cuongthai.labflow</code>, build bằng Maven Wrapper.</li>
  <li>Bảng <code>lab</code> có ít nhất 3 dòng trong PostgreSQL (Docker).</li>
  <li>Ba tầng trong package <code>lab</code>: <code>LabController</code>, <code>LabService</code>, <code>LabRepository</code>, kèm record <code>Lab</code>. Chỉ dùng constructor injection; không chỗ nào <code>new</code> mấy class này.</li>
  <li><code>GET /labs</code>, <code>GET /labs?building=…</code> (SQL có tham số), và <code>GET /labs/count</code> trả <code>{"count": N}</code>.</li>
  <li>Giờ mở cửa lấy từ <code>application.yml</code> (<code>labflow.open-hour</code>, <code>labflow.close-hour</code>), trả ở <code>GET /hours</code>; chứng minh một biến môi trường ghi đè được một trong hai.</li>
  <li>Tệp <code>README.md</code> ghi đúng các lệnh bật cơ sở dữ liệu và ứng dụng, và số bean mà ứng dụng của bạn có.</li>
</ol>
<p><strong>Gợi ý (chỉ mở khi bí).</strong> Bậc 1: chép ba class trong bài, mỗi tầng thêm một phương thức để đếm. Bậc 2: <code>SELECT count(*) FROM lab</code> với <code>.query(Integer.class).single()</code>. Bậc 3: controller trả <code>Map.of("count", n)</code>.</p>
<p><strong>Thang điểm (10 điểm).</strong> Build và khởi động được bằng các lệnh trong README — 2 · đủ ba tầng với constructor injection — 2 · bốn endpoint đúng — 2 · không có SQL nối chuỗi (thử <code>' OR '1'='1</code>) — 2 · README chứng minh ghi đè bằng biến môi trường — 1 · có báo số bean — 1.</p>
<p><strong>Thử thách thêm.</strong> Chuyển <code>LabflowApplication</code> vào <code>com.cuongthai.labflow.app</code> và sửa các lỗi 404 phát sinh <em>mà không</em> chuyển nó về chỗ cũ (xem <code>scanBasePackages</code>).</p>
</div>
${giai('Xem lời giải tham khảo (tự làm trước đã!)', `${java(`
// LabRepository
int count() {
    return db.sql("SELECT count(*) FROM lab").query(Integer.class).single();
}
// LabService
int count() { return repo.count(); }
// LabController
@GetMapping("/labs/count")
Map<String, Integer> count() { return Map.of("count", service.count()); }`)}
${out(`$ curl -s localhost:8080/labs/count
{"count":3}
$ LABFLOW_CLOSE_HOUR=22 java -jar target/labflow-0.0.1-SNAPSHOT.jar   # rồi gọi /hours
{"open":"7h-22h"}
$ curl -s -G localhost:8080/labs --data-urlencode "building=' OR '1'='1"
[]`)}
<p>Thử thách thêm: <code>@SpringBootApplication(scanBasePackages = "com.cuongthai.labflow")</code> — nhưng cách sạch hơn vẫn là để class main ở package gốc.</p>`)}

<h3>🎤 Người phỏng vấn sẽ hỏi gì về bài này</h3>
<ol>
  <li><strong>"@SpringBootApplication làm gì?"</strong> — Gộp <code>@SpringBootConfiguration</code>, <code>@EnableAutoConfiguration</code> và <code>@ComponentScan</code>: đánh dấu class cấu hình, bật tự cấu hình, và quét package hiện tại cùng các package con để tìm component.</li>
  <li><strong>"Auto-configuration quyết định tạo gì bằng cách nào?"</strong> — Bằng điều kiện: <code>@ConditionalOnClass</code> (thư viện có trên classpath), <code>@ConditionalOnMissingBean</code> (bạn chưa tự định nghĩa), <code>@ConditionalOnProperty</code>. Xem được các quyết định bằng <code>--debug</code>.</li>
  <li><strong>"Vì sao chia controller, service, repository?"</strong> — Tách mối quan tâm: HTTP, quy tắc nghiệp vụ và lưu trữ thay đổi vì những lý do khác nhau; mỗi tầng test riêng được; giao dịch thuộc về service.</li>
  <li><strong>"Cấu hình cho nhiều môi trường thế nào?"</strong> — Mặc định trong <code>application.yml</code>, ghi đè bằng tệp theo profile, biến môi trường và tham số dòng lệnh, ưu tiên tăng dần; bí mật không bao giờ nằm trong repository.</li>
</ol>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Bean</span><span class="v">Đối tượng do container Spring tạo ra và quản lý.</span></div>
  <div class="kv"><span class="k">Application context</span><span class="v">Container chứa mọi bean; do <code>SpringApplication.run</code> tạo ra.</span></div>
  <div class="kv"><span class="k">Component scanning (quét component)</span><span class="v">Tìm các class gắn <code>@Component</code>/<code>@Service</code>/<code>@Repository</code>/<code>@RestController</code> bên dưới package của class main.</span></div>
  <div class="kv"><span class="k">Dependency injection</span><span class="v">Class khai báo mình cần gì (qua constructor); container cung cấp.</span></div>
  <div class="kv"><span class="k">Proxy</span><span class="v">Lớp bọc được sinh tự động quanh bean của bạn để thêm hành vi (dịch exception, giao dịch).</span></div>
  <div class="kv"><span class="k">BOM (bảng vật tư)</span><span class="v">Danh sách phiên bản thư viện tương thích, thừa hưởng qua Boot parent.</span></div>
  <div class="kv"><span class="k">Báo cáo đánh giá điều kiện</span><span class="v">Lời giải thích của Boot cho mọi auto-configuration được áp hoặc bỏ qua (<code>--debug</code>).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li><code>@SpringBootApplication</code> = cấu hình + tự cấu hình + quét component từ package của class main trở xuống.</li>
  <li>Controller → service → repository; phụ thuộc đi vào qua constructor, không bao giờ <code>new</code>.</li>
  <li>190 bean trong một ứng dụng 5 class; một class của ta đã là proxy CGLIB.</li>
  <li>Class nằm ngoài package được quét thì lặng lẽ không tồn tại: 404, không lỗi.</li>
  <li>Thứ tự ưu tiên cấu hình: tệp &lt; biến môi trường &lt; dòng lệnh.</li>
  <li>Boot parent ghim phiên bản; starter gom thư viện; plugin Maven đóng fat jar; <code>--debug</code> cho thấy lý do.</li>
</ul>

<h3>📚 Học sâu thêm</h3>
${tl('https://docs.spring.io/spring-boot/reference/features/external-config.html', '⚙️', 'Spring Boot — Externalized Configuration', 'Toàn bộ thứ tự hơn 15 nguồn cấu hình và luật ánh xạ biến môi trường.')}
${tl('https://docs.spring.io/spring-boot/reference/using/structuring-your-code.html', '🗂', 'Spring Boot — Structuring Your Code', 'Vì sao class main phải nằm ở package gốc.')}
</div>
`;

/* ═══════════════════════════ 0.3 — Quiz ═══════════════════════════ */
const Q = (question, options, correctIndex) => ({ question, options, correctIndex, points: 1 });
const QUIZ0 = [
  Q('What is the relationship between Spring Framework and Spring Boot?|||Spring Framework và Spring Boot quan hệ với nhau thế nào?', [
    'Boot is a newer framework that replaces Spring|||Boot là framework mới thay thế Spring',
    'Boot is Spring plus auto-configuration, starters, an embedded server and an executable jar|||Boot là Spring cộng tự cấu hình, starter, server nhúng và jar chạy thẳng',
    'Boot is the web module of Spring|||Boot là mô-đun web của Spring',
    'Boot is a Jakarta EE standard|||Boot là một chuẩn Jakarta EE',
  ], 1),
  Q('A fresh project with the JDBC starter fails with "Failed to configure a DataSource: \'url\' attribute is not specified". What is missing?|||Dự án mới có starter JDBC báo "Failed to configure a DataSource: \'url\' attribute is not specified". Thiếu gì?', [
    'The PostgreSQL server must be installed without Docker|||Phải cài PostgreSQL không qua Docker',
    'A @Repository class|||Một class @Repository',
    'The spring.datasource.* settings (or the profile that provides them)|||Các thuộc tính spring.datasource.* (hoặc profile cung cấp chúng)',
    'The Maven Wrapper|||Maven Wrapper',
  ], 2),
  Q('A controller is placed in package com.cuongthai.khac while the main class is in com.cuongthai.labflow. What happens when you call its endpoint?|||Một controller đặt ở package com.cuongthai.khac trong khi class main ở com.cuongthai.labflow. Gọi endpoint của nó thì sao?', [
    'Start-up fails with an error|||Khởi động thất bại kèm lỗi',
    'It works normally|||Chạy bình thường',
    '404 — component scanning never found the class, with no warning|||404 — việc quét component không thấy class đó, không có cảnh báo nào',
    '500 — the bean cannot be created|||500 — không tạo được bean',
  ], 2),
  Q('application.yml sets labflow.close-hour: 21, the environment has LABFLOW_CLOSE_HOUR=22, and the app is started with --labflow.close-hour=23. Which value is used?|||application.yml đặt labflow.close-hour: 21, biến môi trường LABFLOW_CLOSE_HOUR=22, và ứng dụng chạy với --labflow.close-hour=23. Giá trị nào được dùng?', [
    '21|||21', '22|||22', '23|||23', 'Start-up fails because of the conflict|||Khởi động lỗi vì xung đột',
  ], 2),
  Q('The bean list shows labRepository -> LabRepository$$SpringCGLIB$$0. What does that mean?|||Danh sách bean hiện labRepository -> LabRepository$$SpringCGLIB$$0. Nghĩa là gì?', [
    'A compilation error in LabRepository|||LabRepository bị lỗi biên dịch',
    'Spring injected a generated proxy subclass that wraps our class|||Spring tiêm vào một lớp con proxy được sinh tự động bọc lớp của ta',
    'There are two copies of LabRepository|||Có hai bản LabRepository',
    'The repository is not managed by Spring|||Repository không do Spring quản lý',
  ], 1),
  Q('Why do dependencies in a Boot pom.xml usually have no <version>?|||Vì sao dependency trong pom.xml của Boot thường không có <version>?', [
    'Maven always picks the latest version|||Maven luôn lấy bản mới nhất',
    'The spring-boot-starter-parent manages tested versions (a BOM)|||spring-boot-starter-parent quản lý các phiên bản đã kiểm cùng nhau (BOM)',
    'Versions are written in application.yml|||Phiên bản được ghi trong application.yml',
    'Starters have no versions|||Starter không có phiên bản',
  ], 1),
  Q('In the hand-written server, which request read the database version?|||Ở server viết tay, request nào đọc được phiên bản cơ sở dữ liệu?', [
    'building=Alpha|||building=Alpha',
    "building=' UNION SELECT 0, current_user, split_part(version(),' ',2), 0 --|||building=' UNION SELECT 0, current_user, split_part(version(),' ',2), 0 --",
    'A POST to /labs|||Một POST tới /labs',
    'GET /labz|||GET /labz',
  ], 1),
  Q('Why was the Spring version about 30% faster per request in the measurement?|||Vì sao trong phép đo bản Spring nhanh hơn khoảng 30% mỗi request?', [
    'Spring compiles SQL to machine code|||Spring biên dịch SQL ra mã máy',
    'It reuses pooled connections (HikariCP) instead of opening a new one per request|||Nó dùng lại kết nối trong pool (HikariCP) thay vì mở kết nối mới mỗi request',
    'Tomcat caches the JSON|||Tomcat cache JSON',
    'Spring uses virtual threads by default|||Spring mặc định dùng virtual thread',
  ], 1),
  Q('Spring4Shell (CVE-2022-22965) abused which Spring feature?|||Spring4Shell (CVE-2022-22965) lợi dụng tính năng nào của Spring?', [
    'Automatic data binding of request parameters into objects|||Tự động gắn tham số request vào đối tượng',
    'The Log4j logger|||Logger Log4j',
    'The Actuator heapdump endpoint|||Endpoint heapdump của Actuator',
    'Flyway migrations|||Migration Flyway',
  ], 0),
  Q('Which command shows why Boot applied or skipped each auto-configuration?|||Lệnh nào cho thấy vì sao Boot áp hay bỏ qua từng auto-configuration?', [
    './mvnw dependency:tree|||./mvnw dependency:tree',
    'java -jar app.jar --debug|||java -jar app.jar --debug',
    'java -version|||java -version',
    'unzip -l app.jar|||unzip -l app.jar',
  ], 1),
];

export default {
  title: 'Section 0 — Why Spring Boot|||Mục 0 — Vì sao Spring Boot',
  description: 'Spring Boot là gì, vì sao doanh nghiệp vẫn chọn Java, không có Spring thì khổ thế nào (đo thật), cài JDK 21 + tạo dự án, giải phẫu dự án và Lab khung LabFlow.',
  lessons: [
    {
      title: 'Start here (1/2) — What Spring Boot is, its history, and why enterprise Vietnam still runs on it|||Bắt đầu tại đây (1/2) — Spring Boot là gì, lịch sử ra đời, và vì sao doanh nghiệp Việt Nam vẫn chạy trên nó',
      slug: 'sb-0-8-bat-dau-tai-day',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Spring vs Spring Boot, lịch sử có nguồn 2002–2026, vì sao doanh nghiệp chọn Java, so sánh với Node.js và lộ trình cả khoá.',
      content: L08_EN + L08_VI,
    },
    {
      title: 'Start here (2/2) — Boilerplate without Spring, and how to study this course|||Bắt đầu tại đây (2/2) — Không có Spring thì phải viết bao nhiêu code thừa, và cách học khoá này',
      slug: 'sb-0-9-bat-dau-khi-khong-co',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Equifax, Spring4Shell, Log4Shell, Actuator; cùng endpoint viết tay bị SQL injection (chạy thật) và cách học không bỏ cuộc.',
      content: L09_EN + L09_VI,
    },
    {
      title: '0.1 — Installing the JDK and creating a project with Spring Initializr|||0.1 — Cài JDK và tạo dự án bằng Spring Initializr',
      slug: 'sb-0-1-cai-dat',
      type: 'LESSON',
      isFreePreview: true,
      description: 'JDK 21 Temurin, Maven vs Gradle, start.spring.io, Maven Wrapper, hai lỗi khởi động đầu tiên và PostgreSQL trong Docker.',
      content: L01_EN + L01_VI,
    },
    {
      title: '0.2 — Anatomy of a Spring Boot project|||0.2 — Giải phẫu một dự án Spring Boot',
      slug: 'sb-0-2-cau-truc-du-an',
      type: 'LESSON',
      isFreePreview: true,
      description: '@SpringBootApplication, ba tầng controller/service/repository, 190 bean và proxy, quét package, thứ tự cấu hình, pom.xml, báo cáo --debug, Lab Mục 0.',
      content: L02_EN + L02_VI,
    },
    {
      title: '0.3 — Section 0 quiz|||0.3 — Kiểm tra Mục 0',
      slug: 'sb-0-3-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu về Spring vs Boot, lỗi khởi động, quét package, thứ tự cấu hình, proxy, BOM và sự cố thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every question here comes from something you saw running in this section — an error box, a bean list, a curl command. If you miss one, the explanation is in the lesson named in the question.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Câu nào ở đây cũng lấy từ thứ bạn đã thấy chạy thật trong mục này — một khung lỗi, một danh sách bean, một lệnh curl. Sai câu nào thì lời giải nằm trong bài được nhắc trong câu hỏi.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ0 },
    },
  ],
};
