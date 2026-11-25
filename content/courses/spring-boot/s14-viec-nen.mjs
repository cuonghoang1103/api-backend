/**
 * spring-boot/s14-viec-nen.mjs — Chương 14: Việc nền — async, hẹn giờ, sự kiện, outbox, RabbitMQ (soạn 25/11/2026, agent sb).
 * Mọi output là chạy thật trên máy nhà: LabFlow (Spring Boot 4.1.2, Spring AMQP 4.1.2, ShedLock 7.12.0, Spring Modulith 2.1.3) + PostgreSQL 16 + RabbitMQ 4 (management-alpine),
 * một hoặc hai instance. Mã: scratchpad/sb/lab/c14/{labflow (bản c14: HetHanDuyet BR-13 + LichCauHinh ShedLock, module demo14 profile c14), t (lệnh đo), lab14 (lời giải + bẫy + bộ chấm)}.
 * Output: ~/.rtq-sb/ch14/o (bản hiển thị ở o/web, lọc bằng lab/c14/web-out.sh). Hằng MA.. / OUT.. sinh bằng tam/s14/build.sh + gen-ma.mjs.
 */
import { java, bash, sql, xml, yml, props, js, out, tl, giai } from './_chung.mjs';

// ===== Bài 14.1 =====
const MA141_TB = java("/** Bài 14.1: các phương thức @Async — chạy trên executor của Spring, KHÔNG trên luồng request. */\n@Component\n@Profile(\"c14\")\npublic class ThongBaoAsync {\n    private static final Logger log = LoggerFactory.getLogger(ThongBaoAsync.class);\n    private final EmailGia email;\n    ThongBaoAsync(EmailGia email) { this.email = email; }\n\n    @Async\n    public void gui(String toi, String nd) { email.gui(toi, nd); }\n\n    /** Bẫy: gọi qua this ⇒ không qua proxy ⇒ @Async bị bỏ qua, chạy luôn trên luồng request. */\n    public void guiVaGhiNhan(String toi) {\n        log.info(\"ghi nhận yêu cầu gửi tới {} (luồng {})\", toi, Thread.currentThread().getName());\n        this.gui(toi, \"Lượt đặt đã ghi nhận\");\n    }\n\n    @Async\n    public void guiLoi(String toi) {\n        throw new IllegalStateException(\"SMTP từ chối \" + toi + \": 552 hộp thư đầy\");\n    }\n\n    @Async\n    public CompletableFuture<String> guiCoKetQua(String toi, boolean hong) {\n        if (hong) throw new IllegalStateException(\"SMTP từ chối \" + toi + \": 552 hộp thư đầy\");\n        email.gui(toi, \"có kết quả\");\n        return CompletableFuture.completedFuture(\"đã gửi tới \" + toi);\n    }\n\n    /** Đọc người dùng hiện tại TRÊN LUỒNG NỀN. */\n    @Async\n    public CompletableFuture<String> ai() {\n        Authentication a = SecurityContextHolder.getContext().getAuthentication();\n        return CompletableFuture.completedFuture((a == null ? \"null\" : a.getName()) + \" (luồng \" + Thread.currentThread().getName() + \")\");\n    }\n    // … viec(i, ms) dùng cho phép đo loạt 100 việc …\n}");
const MA141_NC = java("/**\n * 14.1 — hai cách đưa người dùng sang luồng @Async:\n *  labflow.d14.ngu-canh=ke-thua   ⇒ MODE_INHERITABLETHREADLOCAL (SAI với pool: luồng giữ ngữ cảnh của request đã TẠO ra nó)\n *  labflow.d14.ngu-canh=decorator ⇒ TaskDecorator chép ngữ cảnh lúc GỬI việc, xoá sau khi chạy (ĐÚNG)\n */\n@Configuration\n@Profile(\"c14\")\nclass NguCanhCauHinh {\n    @Configuration\n    @ConditionalOnProperty(name = \"labflow.d14.ngu-canh\", havingValue = \"ke-thua\")\n    static class KeThua {\n        KeThua() { SecurityContextHolder.setStrategyName(SecurityContextHolder.MODE_INHERITABLETHREADLOCAL); }\n    }\n\n    @Bean\n    @ConditionalOnProperty(name = \"labflow.d14.ngu-canh\", havingValue = \"decorator\")\n    TaskDecorator chepNguCanhBaoMat() {\n        return viec -> {\n            SecurityContext ctx = SecurityContextHolder.getContext();     // chạy trên luồng GỬI (request)\n            return () -> {                                                // chạy trên luồng NỀN\n                try { SecurityContextHolder.setContext(ctx); viec.run(); }\n                finally { SecurityContextHolder.clearContext(); }\n            };\n        };\n    }\n}");
const MA141_HAM = bash("# ham.sh — hàm nhỏ cho các tệp lệnh Chương 14 (nguồn bởi t/chay.sh). Bí mật chỉ qua biến môi trường.\nJ='Content-Type: application/json'\n# do: in mã trạng thái + thời gian của một request (ms)\ndo1() { curl -s -o /tmp/sb-c14-body -w '%{http_code} %{time_total}\\n' \"$@\" | awk '{printf \"HTTP %s · %.0f ms · \", $1, $2*1000}'; cat /tmp/sb-c14-body; }\nD14=$API/api/v1/demo14\ntk() { curl -s $D14/a/thong-ke | jq -c .; }\ndem() { curl -s $D14/e/dem | jq -c .; }\ndemo() { curl -s $D14/o/dem | jq -c .; }");
const OUT141A = out("## 1 Executor mặc định mà Boot tạo cho @Async\n$ curl -s $D14/a/executor\n{\"lop\":\"ThreadPoolTaskExecutor\",\"core\":8,\"max\":2147483647,\"queue\":2147483647,\"tienTo\":\"task-\"}\n## 2 Cùng một email giả (2 giây): gọi thẳng, qua @Async, và qua this\n$ do1 -X POST \"$D14/a/dong-bo?toi=an@fpt.edu.vn\"\nHTTP 200 · 2026 ms · đã gửi\n\n$ do1 -X POST \"$D14/a/async?toi=an@fpt.edu.vn\"\nHTTP 202 · 13 ms · đã nhận, sẽ gửi sau\n\n$ do1 -X POST \"$D14/a/tu-goi?toi=an@fpt.edu.vn\"\nHTTP 202 · 2009 ms · đã nhận, sẽ gửi sau\n\n$ docker logs labflow | grep -E \"EmailGia|ThongBaoAsync\" | gon\n13:12:20.144 [nio-8080-exec-3] [email giả] tới an@fpt.edu.vn: Lượt đặt đã ghi nhận (luồng http-nio-8080-exec-3)\n13:12:20.203 [nio-8080-exec-5] ghi nhận yêu cầu gửi tới an@fpt.edu.vn (luồng http-nio-8080-exec-5)\n13:12:22.181 [task-1] [email giả] tới an@fpt.edu.vn: Lượt đặt đã ghi nhận (luồng task-1)\n13:12:22.204 [nio-8080-exec-5] [email giả] tới an@fpt.edu.vn: Lượt đặt đã ghi nhận (luồng http-nio-8080-exec-5)");
const OUT141B = out("## 1 Mặc định: 100 việc, mỗi việc 1 giây\n$ curl -s -X POST \"$D14/a/loat?n=100&ms=1000\"\n{\"tuChoi\":0,\"gui\":100}\n$ cho '.xong == 100' 60; tk\n{\"dongThoiToiDa\":8,\"xong\":100,\"soLuong\":8,\"msTuLucGui\":13014}\n\n## 2 Virtual thread: spring.threads.virtual.enabled=true\n$ curl -s $D14/a/executor\n{\"lop\":\"SimpleAsyncTaskExecutor\"}\n$ curl -s -X POST \"$D14/a/loat?n=100&ms=1000\"\n{\"tuChoi\":0,\"gui\":100}\n$ cho '.xong == 100' 60; tk\n{\"dongThoiToiDa\":100,\"xong\":100,\"soLuong\":100,\"msTuLucGui\":1014}\n\n## 3 Pool có giới hạn: core 4, max 8, hàng đợi 20\n$ curl -s $D14/a/executor\n{\"lop\":\"ThreadPoolTaskExecutor\",\"core\":4,\"max\":8,\"queue\":20,\"tienTo\":\"task-\"}\n$ curl -s -X POST \"$D14/a/loat?n=100&ms=1000\"\n{\"gui\":28,\"tuChoi\":72}\n$ cho '.xong == 28' 60; tk\n{\"soLuong\":8,\"msTuLucGui\":4009,\"dongThoiToiDa\":8,\"xong\":28}");
const OUT141C = out("## 1 @Async void ném lỗi: người gọi không biết gì\n$ do1 -X POST \"$D14/a/loi?toi=binh@fpt.edu.vn\"\nHTTP 202 · 123 ms · đã nhận, sẽ gửi sau\n\n$ docker logs labflow | grep -A2 \"Unexpected exception\" | gon | cut -c1-200\n13:17:38.973 [task-1] Unexpected exception occurred invoking async method: public void vn.labflow.demo14.ThongBaoAsync.guiLoi(java.lang.String)\njava.lang.IllegalStateException: SMTP từ chối binh@fpt.edu.vn: 552 hộp thư đầy\n\n## 2 @Async trả CompletableFuture: lỗi đi theo future\n$ do1 \"$D14/a/ket-qua?toi=an@fpt.edu.vn\"\nHTTP 200 · 2013 ms · đã gửi tới an@fpt.edu.vn\n\n$ do1 \"$D14/a/ket-qua?toi=binh@fpt.edu.vn&hong=true\"\nHTTP 200 · 9 ms · lỗi: CompletionException: java.lang.IllegalStateException: SMTP từ chối binh@fpt.edu.vn: 552 hộp thư đầy");
const OUT141D = out("## 1 Mặc định: luồng nền không thấy ai đăng nhập\n$ curl -s -H \"Authorization: Bearer $TA\" $API/api/v1/thu14/ai\n{\"async\":\"null (luồng task-1)\",\"request\":\"an@fpt.edu.vn\"}\n## 2 MODE_INHERITABLETHREADLOCAL + pool 2 luồng: An gọi trước, Bình gọi sau\n$ curl -s -H \"Authorization: Bearer $TA\" $API/api/v1/thu14/ai\n{\"async\":\"an@fpt.edu.vn (luồng task-1)\",\"request\":\"an@fpt.edu.vn\"}\n$ curl -s -H \"Authorization: Bearer $TA\" $API/api/v1/thu14/ai\n{\"async\":\"an@fpt.edu.vn (luồng task-2)\",\"request\":\"an@fpt.edu.vn\"}\n$ curl -s -H \"Authorization: Bearer $TB\" $API/api/v1/thu14/ai\n{\"async\":\"an@fpt.edu.vn (luồng task-1)\",\"request\":\"binh@fpt.edu.vn\"}\n$ curl -s -H \"Authorization: Bearer $TB\" $API/api/v1/thu14/ai\n{\"async\":\"an@fpt.edu.vn (luồng task-2)\",\"request\":\"binh@fpt.edu.vn\"}\n## 3 TaskDecorator chép ngữ cảnh lúc gửi việc\n$ curl -s -H \"Authorization: Bearer $TA\" $API/api/v1/thu14/ai\n{\"request\":\"an@fpt.edu.vn\",\"async\":\"an@fpt.edu.vn (luồng task-1)\"}\n$ curl -s -H \"Authorization: Bearer $TA\" $API/api/v1/thu14/ai\n{\"request\":\"an@fpt.edu.vn\",\"async\":\"an@fpt.edu.vn (luồng task-2)\"}\n$ curl -s -H \"Authorization: Bearer $TB\" $API/api/v1/thu14/ai\n{\"request\":\"binh@fpt.edu.vn\",\"async\":\"binh@fpt.edu.vn (luồng task-1)\"}\n$ curl -s -H \"Authorization: Bearer $TB\" $API/api/v1/thu14/ai\n{\"request\":\"binh@fpt.edu.vn\",\"async\":\"binh@fpt.edu.vn (luồng task-2)\"}");
const OUT141E = out("## 1 Mặc định: 20 việc 5 giây (8 luồng ⇒ 3 đợt) đang chạy thì tắt ứng dụng, cho tối đa 40 giây\n$ curl -s -X POST \"$D14/a/loat?n=20&ms=5000\"\n{\"tuChoi\":0,\"gui\":20}\n$ time docker stop -t 40 labflow >/dev/null\n\nreal\t0m14.139s\nuser\t0m0.006s\nsys\t0m0.009s\n\n$ docker logs labflow | grep -cE \"xong việc\"\n20\n\n$ docker logs labflow | grep -E \"bị ngắt|Graceful|Shutting|waiting|xong việc 20$\" | gon\n13:19:26.317 [ionShutdownHook] Commencing graceful shutdown. Waiting for active requests to complete\n13:19:26.318 [tomcat-shutdown] Graceful shutdown complete\n13:19:40.248 [task-6] xong việc 20\n\n## 2 Chờ việc dở: await-termination=true, tối đa 30 giây\n$ curl -s -X POST \"$D14/a/loat?n=20&ms=5000\"\n{\"gui\":20,\"tuChoi\":0}\n$ time docker stop -t 40 labflow >/dev/null\n\nreal\t0m14.084s\nuser\t0m0.011s\nsys\t0m0.007s\n\n$ docker logs labflow | grep -cE \"xong việc\"\n20\n\n## 3 Docker chỉ cho 10 giây (mặc định của docker stop) rồi SIGKILL\n$ curl -s -X POST \"$D14/a/loat?n=20&ms=5000\"\n{\"tuChoi\":0,\"gui\":20}\n$ time docker stop labflow >/dev/null\n\nreal\t0m10.175s\nuser\t0m0.005s\nsys\t0m0.012s\n\n$ docker logs labflow | grep -cE \"xong việc\"\n16\n\n$ docker inspect labflow --format '{{.State.ExitCode}}'\n137");

const L141_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.1 · Background work</span>
<h2>@Async and executors</h2>
<p class="lead">When a student books a lab, LabFlow sends a confirmation email. A real mail server can take two seconds to answer — and the student should not stare at a spinner for those two seconds. <code>@Async</code> moves the work to another thread with one annotation. In this lesson we measure what that annotation really does: which thread runs the work, how many threads Spring gives you, what happens with 100 jobs at once, where exceptions go, why the background thread does not know who is logged in — and how one wrong setting made a background thread act as the wrong user.</p>

<h3>Everyday picture first</h3>
<p>At a phở shop the cashier takes your order and money, gives you a number and says "sit down, we'll bring it". The cashier does not stand in the kitchen while the soup is made — the next customer is already waiting. The kitchen is a <em>pool</em> of cooks. Everything in this lesson is in that picture: how many cooks there are (pool size), how long the line of tickets can get (queue), what happens when the line is full (rejection), what happens if a cook burns the soup and nobody tells the customer (lost exception), and the ticket must say <em>whose</em> order it is — the cook was not at the counter when you paid (context).</p>

<h3>1. What @Async does</h3>
<p><code>@EnableAsync</code> (LabFlow has it on the main class) makes Spring wrap beans that have <code>@Async</code> methods in a <strong>proxy</strong>. A call from another bean goes to the proxy, which hands the method call to a <code>TaskExecutor</code> and returns immediately — <code>void</code>, or a <code>CompletableFuture</code> that will be completed later. The test bean used below:</p>
${MA141_TB}
<p>A few helpers so the commands fit on one line (<code>D14</code> is the base URL of the demo endpoints, <code>gon</code> shortens a log line to "time [thread] message"):</p>
${MA141_HAM}
<p>The same two-second email, called three ways:</p>
${OUT141A}
<ul>
  <li><strong>Direct call</strong>: the request waits 2,008 ms and the email is sent on <code>http-nio-8080-exec-…</code> — a Tomcat request thread, blocked for two seconds.</li>
  <li><strong>Through @Async</strong>: 6 ms, HTTP 202; the email is sent two seconds later on <code>task-1</code>.</li>
  <li><strong>Through <code>this</code></strong>: back to 2,007 ms on the request thread. Self-invocation skips the proxy, exactly like <code>@Transactional</code> (Chapter 7) and <code>@Cacheable</code> (Chapter 13).</li>
</ul>
<p>While writing this lesson the proxy bit us one more time: the endpoint that prints statistics first read the counters as fields of <code>ThongBaoAsync</code> and returned 500. The bean is a CGLIB proxy because of <code>@Async</code>, and fields read through a proxy are <code>null</code> — the same trap as lesson 13.1. Read other beans through methods.</p>

<h3>2. The executor Boot gives you</h3>
<p>Spring Boot auto-configures one executor named <code>applicationTaskExecutor</code> and uses it for <code>@Async</code>. The first line of the output above shows its default shape: a <code>ThreadPoolTaskExecutor</code> with <strong>8 core threads</strong>, max and queue both <code>2147483647</code> (Integer.MAX_VALUE). Then we sent 100 jobs of one second each:</p>
${OUT141B}
<ol>
  <li><strong>Default</strong>: 8 threads, 100 jobs ⇒ 13 rounds ⇒ 13 s. Never more than 8 at once. The queue is unbounded, so nothing is ever rejected — a traffic spike becomes a growing list in memory, and a restart loses it.</li>
  <li><strong>Virtual threads</strong> (<code>spring.threads.virtual.enabled=true</code>, Java 21, lesson 2.5): Boot switches to a <code>SimpleAsyncTaskExecutor</code> that starts one virtual thread per job. All 100 ran at once, done in 1.0 s. Great for jobs that mostly <em>wait</em> (HTTP, SMTP, database) — but now nothing limits concurrency: 100 jobs that each open a database connection will fight for a pool of 10 (Chapter 16). Limit with <code>spring.task.execution.simple.concurrency-limit</code> when needed.</li>
  <li><strong>Bounded pool</strong>: core 4, max 8, queue 20. Only 28 of 100 jobs were accepted (8 running + 20 waiting); 72 got a <code>TaskRejectedException</code> in the caller. Note the classic interview detail: the pool grows above <em>core</em> only <strong>when the queue is full</strong>, not before.</li>
</ol>
${props(`# application.properties — a bounded pool: fail fast instead of growing memory without limit
spring.task.execution.pool.core-size=4
spring.task.execution.pool.max-size=8
spring.task.execution.pool.queue-capacity=20
spring.task.execution.thread-name-prefix=email-
# or, for jobs that mostly wait on I/O (Java 21):
# spring.threads.virtual.enabled=true`)}
<p>Which one? For "send an email after booking", a small bounded pool is honest: when 72 of 100 are rejected, you <em>know</em> you are overloaded and can answer 503 or store the work somewhere durable (lessons 14.4–14.5). An unbounded queue hides overload until the JVM runs out of memory.</p>

<h3>3. Where do exceptions go?</h3>
${OUT141C}
<ul>
  <li>A <code>void @Async</code> method that throws: the caller already got 202. The exception only reaches <code>AsyncUncaughtExceptionHandler</code>, which by default writes one ERROR line. If nobody watches the log, Bình never gets an email and nobody knows. Register your own handler (implement <code>AsyncConfigurer</code>) to count it as a metric (Chapter 15).</li>
  <li>A method that returns <code>CompletableFuture</code>: the exception travels inside the future; <code>exceptionally</code>, <code>handle</code> or <code>join()</code> sees it (wrapped in <code>CompletionException</code>). Note: <code>join()</code> waits — calling it in the controller makes the request synchronous again (2,013 ms in the first call).</li>
</ul>

<h3>4. The background thread does not know who you are</h3>
<p>Spring Security keeps the current user in a <code>ThreadLocal</code> of the request thread (lesson 9.1). A job on another thread starts empty:</p>
${MA141_NC}
${OUT141D}
<ol>
  <li><strong>Default</strong>: the request sees <code>an@fpt.edu.vn</code>, the async method sees <code>null</code>. Usually that is what you want — pass the user id as a <em>parameter</em> (<code>tb.gui(user.id(), …)</code>) instead of reading a global.</li>
  <li><strong><code>MODE_INHERITABLETHREADLOCAL</code></strong> — a setting that many Stack Overflow answers recommend. A new thread copies the context of the thread that <em>created</em> it. With a pool, threads are created once and reused: An's requests created <code>task-1</code> and <code>task-2</code>, so when Bình called, the background work ran <strong>as An</strong>. In LabFlow that would be "email An's booking details to Bình" or "write the audit log under the wrong user".</li>
  <li><strong>TaskDecorator</strong>: copy the context when the job is <em>submitted</em> and clear it when the job ends. Boot applies a single <code>TaskDecorator</code> bean to <code>applicationTaskExecutor</code> automatically. Bình's jobs now run as Bình, on the same two reused threads. Spring Security also ships <code>DelegatingSecurityContextAsyncTaskExecutor</code> for the same purpose; for logs (MDC) and traces, Boot's <code>ContextPropagatingTaskDecorator</code> uses Micrometer context propagation (Chapter 15).</li>
</ol>

<h3>5. Shutting down while jobs are running</h3>
${OUT141E}
<ul>
  <li>Spring Framework 7 (Boot 4) stops the executor gracefully as part of context shutdown: with 40 s allowed, all 20 jobs finished (three rounds, 14 s) — with or without <code>spring.task.execution.shutdown.await-termination</code>.</li>
  <li>With Docker's default 10 s, the container was killed (exit code 137) after 16 jobs: the last 4 were simply gone. Kubernetes gives 30 s by default. The platform decides how long you get, not Spring.</li>
  <li>And if the process crashes (out of memory, <code>kill -9</code>, power), everything still in the queue is lost — it only existed in RAM. <strong>@Async is for work you can afford to lose or redo.</strong> A booking confirmation that must arrive belongs in a durable place: an outbox table or a message queue (lessons 14.4–14.5).</li>
</ul>

<h3>🕵️ Hacker corner — GitHub, March 2021: a session handed to the wrong user</h3>
<p>On 8 March 2021 GitHub signed every user out of github.com. A rare race condition, introduced when part of the request handling moved to a <strong>background thread</strong>, could make the server return one user's session cookie in another user's response — the second user was then logged in as the first. GitHub estimated it affected a tiny fraction of sessions, could not be triggered on purpose, and fixed it by stopping the shared object from being used across threads. Same shape as step 4.2 above: data that belongs to one request, read on a thread that is now working for someone else.</p>
<p>Prevention: (1) never put per-user state in thread-reused globals (<code>InheritableThreadLocal</code> with a pool is exactly that); (2) pass identity as an explicit parameter to background work; (3) if you must propagate context, copy at submit time and clear in <code>finally</code> (TaskDecorator); (4) a test that runs two users through the same pool and compares — the four <code>curl</code> lines above are that test.</p>

<h3>Compared with Node.js</h3>
<p>Node has one JavaScript thread and an event loop: "send the email without waiting" is just not awaiting a promise — <code>sendMail(...).catch(log)</code>. There is no pool to size, but a forgotten <code>.catch</code> is an <em>unhandled rejection</em>, which since Node 15 <strong>crashes the process</strong> — the opposite of Spring's single quiet ERROR line. For request context Node has <code>AsyncLocalStorage</code>, which follows the async chain automatically; Java's <code>ThreadLocal</code> follows the thread, so you copy it yourself. CPU-heavy work blocks Node's only thread (you need <code>worker_threads</code>), while in Spring it only occupies one pool thread. Interview line: "Spring gives you threads and you must bound them; Node gives you one thread and you must not block it."</p>

<h3>At work</h3>
<p>Good uses of <code>@Async</code> in LabFlow: sending a non-critical email, warming a cache, writing an audit row to a slow external system — work that may be lost on a crash without harm. Always: a named, bounded executor per kind of work (so slow email cannot starve report generation), user id as a parameter, failures counted as a metric. Bad uses: anything that must happen exactly once (payments, the booking itself), and anything that needs the caller's transaction — the async method runs in another thread, outside it (lesson 14.3 measures that).</p>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"How does @Async work, and when does it silently not work?"</strong> — A proxy submits the call to a TaskExecutor and returns. It is ignored for self-invocation, non-public methods, or a missing <code>@EnableAsync</code>.</li>
  <li><strong>"What is Spring Boot's default async executor?"</strong> — <code>ThreadPoolTaskExecutor</code>, 8 core threads, unbounded queue (so max size never matters). With virtual threads enabled, a <code>SimpleAsyncTaskExecutor</code> with one virtual thread per task.</li>
  <li><strong>"When does a ThreadPoolExecutor create threads beyond core size?"</strong> — Only when the queue is full; when max is reached too, the task is rejected (default policy: exception).</li>
  <li><strong>"An exception in a void @Async method — what happens?"</strong> — It goes to <code>AsyncUncaughtExceptionHandler</code> (logged by default); the caller never sees it. Return <code>CompletableFuture</code> if the caller must know.</li>
  <li><strong>"Why is SecurityContext empty in @Async, and how do you fix it?"</strong> — It is a ThreadLocal of the request thread. Pass data as parameters, or copy it with a TaskDecorator / <code>DelegatingSecurityContextAsyncTaskExecutor</code>. Not <code>MODE_INHERITABLETHREADLOCAL</code> with a pool — measured: it leaked An's identity into Bình's job.</li>
</ol>

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok"><ol>
  <li>With core 4, max 8 and queue 20, you submit exactly 25 one-second jobs. How many threads run at the start, and roughly how long until all finish?</li>
  <li>Make <code>guiVaGhiNhan</code> really asynchronous without moving <code>gui</code> to another class.</li>
  <li>Your job reads <code>SecurityContextHolder</code> to fill a "sent by" column. Rewrite it so it is correct even with <code>MODE_INHERITABLETHREADLOCAL</code> set by some other library.</li>
</ol></div>
${giai('Show the answers', `<p>1. 4 threads: the first 4 jobs start the core threads, the next 20 fill the queue, and only the 25th finds the queue full, so a 5th thread starts. 5 threads for 25 jobs ⇒ 5 rounds ≈ 5 s. (With 24 jobs: 4 threads, 6 rounds ≈ 6 s — fewer jobs, slower.)</p><p>2. Call it through the proxy: inject the bean into itself lazily (<code>@Lazy ThongBaoAsync self</code>, then <code>self.gui(…)</code>), or better, keep <code>guiVaGhiNhan</code> in the controller/service that calls <code>tb.gui(…)</code>.</p><p>3. Do not read a thread-bound global in background work: make the user id a method parameter, taken on the request thread (<code>tb.gui(user.id(), …)</code>). Then neither the strategy nor the pool can change who it is.</p>`)}

<h3>🗂 Key terms</h3>
<ul>
  <li><strong>TaskExecutor</strong> — Spring's interface for "run this somewhere"; Boot's <code>applicationTaskExecutor</code> backs <code>@Async</code>.</li>
  <li><strong>Core / max pool size, queue capacity</strong> — threads kept, threads allowed, waiting jobs allowed; beyond all three ⇒ <code>TaskRejectedException</code>.</li>
  <li><strong>Virtual thread</strong> — a cheap JVM-managed thread (Java 21); one per task is fine for waiting work.</li>
  <li><strong>AsyncUncaughtExceptionHandler</strong> — receives exceptions from <code>void</code> async methods.</li>
  <li><strong>TaskDecorator</strong> — wraps each submitted task; used to copy and clear context (security, MDC).</li>
  <li><strong>Graceful shutdown</strong> — stop taking work, finish what is running, within the time the platform allows.</li>
</ul>

<h3>📌 Summary</h3>
<ul>
  <li>Measured: 2,008 ms synchronous vs 6 ms with <code>@Async</code>; through <code>this</code> it is synchronous again.</li>
  <li>Default pool: 8 threads, unbounded queue — 100 one-second jobs took 13 s; virtual threads 1 s; a bounded pool rejected 72 of 100.</li>
  <li>Exceptions in <code>void</code> async methods only reach a log line; return a future when the caller must know.</li>
  <li>The security context does not follow the job; <code>MODE_INHERITABLETHREADLOCAL</code> with a pool ran Bình's job as An; a TaskDecorator is correct.</li>
  <li>Docker's 10 s stop killed 4 of 20 running jobs; work in memory is not durable.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.spring.io/spring-boot/reference/features/task-execution-and-scheduling.html', '🍃', 'Spring Boot — Task Execution and Scheduling', 'applicationTaskExecutor, spring.task.execution.*, virtual threads, TaskDecorator')}
${tl('https://docs.spring.io/spring-framework/reference/integration/scheduling.html', '📘', 'Spring Framework — Task Execution and Scheduling', '@Async, executors, exception handling')}
${tl('https://github.blog/2021-03-18-how-we-found-and-fixed-a-rare-race-condition-in-our-session-handling/', '🐙', 'GitHub — a rare race condition in our session handling', 'the March 2021 incident, step by step')}

<h3>Sources</h3>
<ul>
  <li>GitHub Blog, 18/03/2021 — <a href="https://github.blog/2021-03-18-how-we-found-and-fixed-a-rare-race-condition-in-our-session-handling/" target="_blank" rel="noopener">How we found and fixed a rare race condition in our session handling</a>.</li>
  <li>All outputs: LabFlow (Spring Boot 4.1.2, Java 21) + PostgreSQL 16 on the course machine, 25/11/2026.</li>
</ul>
</div>
`;

const L141_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.1 · Việc nền</span>
<h2>@Async và executor</h2>
<p class="lead">Khi sinh viên đặt phòng lab, LabFlow gửi email xác nhận. Máy chủ thư thật có lúc mất hai giây mới trả lời — và sinh viên không nên nhìn vòng xoay suốt hai giây đó. <code>@Async</code> chuyển việc sang luồng khác chỉ bằng một chú thích. Bài này đo xem chú thích đó thật sự làm gì: luồng nào chạy việc, Spring cho bao nhiêu luồng, 100 việc cùng lúc thì sao, lỗi đi đâu, vì sao luồng nền không biết ai đang đăng nhập — và một dòng cấu hình sai đã khiến luồng nền làm việc dưới danh nghĩa người khác.</p>

<h3>Đời thường trước đã</h3>
<p>Ở quán phở, thu ngân nhận món, thu tiền, đưa bạn tấm số rồi bảo "ngồi đi, lát mang ra". Thu ngân không đứng trong bếp chờ nấu xong — khách sau đang đợi. Bếp là một <em>pool</em> đầu bếp. Mọi thứ của bài này nằm trong hình ảnh đó: có bao nhiêu đầu bếp (kích thước pool), hàng phiếu chờ dài tối đa bao nhiêu (hàng đợi), hàng đầy thì sao (từ chối), đầu bếp làm hỏng nồi mà không ai báo khách (lỗi bị nuốt), và phiếu phải ghi <em>của ai</em> — đầu bếp không đứng ở quầy lúc bạn trả tiền (ngữ cảnh).</p>

<h3>1. @Async làm gì</h3>
<p><code>@EnableAsync</code> (LabFlow đặt ở lớp main) khiến Spring bọc các bean có phương thức <code>@Async</code> trong một <strong>proxy</strong>. Lời gọi từ bean khác đi vào proxy, proxy giao việc cho một <code>TaskExecutor</code> rồi trả về ngay — kiểu <code>void</code>, hoặc một <code>CompletableFuture</code> sẽ hoàn thành sau. Bean thử nghiệm dùng bên dưới:</p>
${MA141_TB}
<p>Vài hàm nhỏ cho lệnh gọn một dòng (<code>D14</code> là địa chỉ gốc của các endpoint đo, <code>gon</code> rút dòng log còn "giờ [luồng] nội dung"):</p>
${MA141_HAM}
<p>Cùng một email hai giây, gọi theo ba cách:</p>
${OUT141A}
<ul>
  <li><strong>Gọi thẳng</strong>: request chờ 2.008 ms, email gửi trên <code>http-nio-8080-exec-…</code> — luồng request của Tomcat, bị giữ hai giây.</li>
  <li><strong>Qua @Async</strong>: 6 ms, HTTP 202; email được gửi hai giây sau trên <code>task-1</code>.</li>
  <li><strong>Qua <code>this</code></strong>: trở lại 2.007 ms trên luồng request. Tự gọi đi vòng qua proxy, y như <code>@Transactional</code> (Chương 7) và <code>@Cacheable</code> (Chương 13).</li>
</ul>
<p>Lúc soạn bài, proxy còn cắn thêm một lần: endpoint in số đo ban đầu đọc bộ đếm như field của <code>ThongBaoAsync</code> và trả 500. Bean này là proxy CGLIB vì có <code>@Async</code>, mà field đọc qua proxy là <code>null</code> — đúng cái bẫy của bài 13.1. Đọc bean khác qua phương thức.</p>

<h3>2. Executor mà Boot cho sẵn</h3>
<p>Spring Boot tự cấu hình một executor tên <code>applicationTaskExecutor</code> và dùng nó cho <code>@Async</code>. Dòng đầu của output trên cho thấy hình dạng mặc định: một <code>ThreadPoolTaskExecutor</code> có <strong>8 luồng lõi</strong>, max và hàng đợi đều là <code>2147483647</code> (Integer.MAX_VALUE). Rồi ta gửi 100 việc, mỗi việc một giây:</p>
${OUT141B}
<ol>
  <li><strong>Mặc định</strong>: 8 luồng, 100 việc ⇒ 13 đợt ⇒ 13 giây. Không bao giờ quá 8 việc cùng lúc. Hàng đợi không giới hạn nên chẳng việc nào bị từ chối — đợt tải tăng vọt thành một danh sách cứ dài ra trong bộ nhớ, và khởi động lại là mất sạch.</li>
  <li><strong>Virtual thread</strong> (<code>spring.threads.virtual.enabled=true</code>, Java 21, bài 2.5): Boot đổi sang <code>SimpleAsyncTaskExecutor</code>, mỗi việc một virtual thread. Cả 100 việc chạy cùng lúc, xong trong 1,0 giây. Rất hợp với việc chủ yếu <em>chờ</em> (HTTP, SMTP, CSDL) — nhưng giờ không còn gì giới hạn số việc đồng thời: 100 việc cùng mở kết nối CSDL sẽ tranh nhau một pool 10 kết nối (Chương 16). Cần thì giới hạn bằng <code>spring.task.execution.simple.concurrency-limit</code>.</li>
  <li><strong>Pool có giới hạn</strong>: lõi 4, max 8, hàng đợi 20. Chỉ 28 trong 100 việc được nhận (8 đang chạy + 20 đang chờ); 72 việc ném <code>TaskRejectedException</code> ngay ở nơi gọi. Chú ý chi tiết phỏng vấn kinh điển: pool chỉ tăng quá số <em>lõi</em> <strong>khi hàng đợi đã đầy</strong>, không sớm hơn.</li>
</ol>
${props(`# application.properties — pool có giới hạn: báo lỗi sớm thay vì phình bộ nhớ vô hạn
spring.task.execution.pool.core-size=4
spring.task.execution.pool.max-size=8
spring.task.execution.pool.queue-capacity=20
spring.task.execution.thread-name-prefix=email-
# hoặc, với việc chủ yếu chờ I/O (Java 21):
# spring.threads.virtual.enabled=true`)}
<p>Chọn cái nào? Với "gửi email sau khi đặt", một pool nhỏ có giới hạn là trung thực: khi 72/100 việc bị từ chối, bạn <em>biết</em> mình đang quá tải và có thể trả 503 hoặc cất việc vào chỗ bền (bài 14.4–14.5). Hàng đợi vô hạn giấu quá tải cho tới khi JVM hết bộ nhớ.</p>

<h3>3. Lỗi đi đâu?</h3>
${OUT141C}
<ul>
  <li>Phương thức <code>void @Async</code> ném lỗi: người gọi đã nhận 202 từ trước. Lỗi chỉ tới <code>AsyncUncaughtExceptionHandler</code>, mặc định ghi đúng một dòng ERROR. Không ai đọc log thì Bình không bao giờ nhận email và không ai biết. Hãy đăng ký handler riêng (cài <code>AsyncConfigurer</code>) để đếm thành số đo (Chương 15).</li>
  <li>Phương thức trả <code>CompletableFuture</code>: lỗi đi theo future; <code>exceptionally</code>, <code>handle</code> hay <code>join()</code> đều thấy (bọc trong <code>CompletionException</code>). Lưu ý: <code>join()</code> phải chờ — gọi nó trong controller là biến request thành đồng bộ trở lại (2.013 ms ở lần gọi đầu).</li>
</ul>

<h3>4. Luồng nền không biết bạn là ai</h3>
<p>Spring Security giữ người dùng hiện tại trong một <code>ThreadLocal</code> của luồng request (bài 9.1). Việc chạy trên luồng khác bắt đầu với ngữ cảnh rỗng:</p>
${MA141_NC}
${OUT141D}
<ol>
  <li><strong>Mặc định</strong>: request thấy <code>an@fpt.edu.vn</code>, phương thức async thấy <code>null</code>. Thường đó là điều bạn muốn — truyền mã người dùng làm <em>tham số</em> (<code>tb.gui(user.id(), …)</code>) thay vì đọc một biến toàn cục.</li>
  <li><strong><code>MODE_INHERITABLETHREADLOCAL</code></strong> — thiết lập mà nhiều câu trả lời trên Stack Overflow khuyên dùng. Luồng mới chép ngữ cảnh của luồng đã <em>tạo ra</em> nó. Với pool, luồng được tạo một lần rồi dùng lại: request của An đã tạo <code>task-1</code> và <code>task-2</code>, nên khi Bình gọi, việc nền chạy <strong>dưới tên An</strong>. Trong LabFlow, đó là "gửi chi tiết lượt đặt của An cho Bình" hoặc "ghi nhật ký kiểm toán sai người".</li>
  <li><strong>TaskDecorator</strong>: chép ngữ cảnh lúc <em>gửi</em> việc và xoá khi việc xong. Boot tự gắn một bean <code>TaskDecorator</code> duy nhất vào <code>applicationTaskExecutor</code>. Việc của Bình giờ chạy dưới tên Bình, vẫn trên hai luồng dùng lại đó. Spring Security cũng có sẵn <code>DelegatingSecurityContextAsyncTaskExecutor</code> cho cùng mục đích; với log (MDC) và trace, <code>ContextPropagatingTaskDecorator</code> của Boot dùng cơ chế truyền ngữ cảnh của Micrometer (Chương 15).</li>
</ol>

<h3>5. Tắt ứng dụng khi việc đang chạy</h3>
${OUT141E}
<ul>
  <li>Spring Framework 7 (Boot 4) dừng executor êm như một phần của việc đóng context: cho 40 giây thì cả 20 việc xong (ba đợt, 14 giây) — có hay không có <code>spring.task.execution.shutdown.await-termination</code> cũng vậy.</li>
  <li>Với 10 giây mặc định của Docker, container bị giết (mã thoát 137) sau 16 việc: 4 việc cuối biến mất. Kubernetes mặc định cho 30 giây. Nền tảng quyết định bạn có bao lâu, không phải Spring.</li>
  <li>Còn nếu tiến trình sập (hết bộ nhớ, <code>kill -9</code>, mất điện), mọi việc đang nằm trong hàng đợi đều mất — chúng chỉ tồn tại trong RAM. <strong>@Async dành cho việc mất được hoặc làm lại được.</strong> Email xác nhận đặt phòng bắt buộc phải tới thì phải nằm ở chỗ bền: bảng outbox hoặc hàng đợi tin nhắn (bài 14.4–14.5).</li>
</ul>

<h3>🕵️ Góc hacker — GitHub, tháng 3/2021: phiên đăng nhập trao nhầm người</h3>
<p>Ngày 8/3/2021, GitHub đăng xuất mọi người dùng khỏi github.com. Một lỗi tranh chấp hiếm gặp, xuất hiện khi một phần xử lý request được chuyển sang <strong>luồng nền</strong>, có thể khiến máy chủ trả cookie phiên của người này trong phản hồi cho người khác — người thứ hai khi đó đăng nhập dưới tên người thứ nhất. GitHub ước tính chỉ một phần rất nhỏ phiên bị ảnh hưởng, không thể cố ý kích hoạt, và sửa bằng cách không cho đối tượng dùng chung đó đi qua nhiều luồng nữa. Cùng hình dạng với bước 4.2 ở trên: dữ liệu thuộc về một request, lại bị đọc trên một luồng đang làm việc cho người khác.</p>
<p>Cách phòng: (1) không bao giờ đặt trạng thái riêng từng người vào biến toàn cục gắn với luồng được dùng lại (<code>InheritableThreadLocal</code> cộng pool chính là thế); (2) truyền danh tính làm tham số tường minh cho việc nền; (3) nếu buộc phải truyền ngữ cảnh, chép lúc gửi việc và xoá trong <code>finally</code> (TaskDecorator); (4) một phép thử cho hai người dùng đi qua cùng một pool rồi so sánh — bốn dòng <code>curl</code> ở trên chính là phép thử đó.</p>

<h3>So với Node.js</h3>
<p>Node có một luồng JavaScript và event loop: "gửi email không chờ" chỉ là không <code>await</code> promise — <code>sendMail(...).catch(log)</code>. Không có pool để chỉnh, nhưng quên <code>.catch</code> là một <em>unhandled rejection</em>, và từ Node 15 nó <strong>làm sập tiến trình</strong> — trái ngược với một dòng ERROR lặng lẽ của Spring. Về ngữ cảnh request, Node có <code>AsyncLocalStorage</code>, tự đi theo chuỗi async; <code>ThreadLocal</code> của Java đi theo luồng, nên bạn phải tự chép. Việc nặng CPU chặn luồng duy nhất của Node (cần <code>worker_threads</code>), còn ở Spring nó chỉ chiếm một luồng của pool. Câu chốt phỏng vấn: "Spring cho bạn nhiều luồng và bạn phải giới hạn chúng; Node cho bạn một luồng và bạn không được chặn nó."</p>

<h3>Ở chỗ làm</h3>
<p>Dùng <code>@Async</code> đúng chỗ trong LabFlow: gửi email không quan trọng, làm nóng cache, ghi nhật ký sang hệ thống ngoài chậm — việc mất khi sập cũng không hại gì. Luôn luôn: mỗi loại việc một executor có tên và có giới hạn (để email chậm không bóp nghẹt việc làm báo cáo), mã người dùng làm tham số, lỗi được đếm thành số đo. Dùng sai chỗ: mọi thứ phải xảy ra đúng một lần (thanh toán, chính lượt đặt), và mọi thứ cần giao dịch của nơi gọi — phương thức async chạy ở luồng khác, nằm ngoài giao dịch đó (bài 14.3 đo điều này).</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"@Async chạy thế nào, và khi nào nó lặng lẽ không chạy?"</strong> — Proxy gửi lời gọi cho một TaskExecutor rồi trả về. Bị bỏ qua khi tự gọi, phương thức không public, hoặc thiếu <code>@EnableAsync</code>.</li>
  <li><strong>"Executor async mặc định của Spring Boot là gì?"</strong> — <code>ThreadPoolTaskExecutor</code>, 8 luồng lõi, hàng đợi không giới hạn (nên max chẳng bao giờ có tác dụng). Bật virtual thread thì là <code>SimpleAsyncTaskExecutor</code>, mỗi việc một virtual thread.</li>
  <li><strong>"Khi nào ThreadPoolExecutor tạo luồng vượt số lõi?"</strong> — Chỉ khi hàng đợi đầy; chạm cả max thì việc bị từ chối (chính sách mặc định: ném exception).</li>
  <li><strong>"Exception trong phương thức void @Async thì sao?"</strong> — Đi tới <code>AsyncUncaughtExceptionHandler</code> (mặc định ghi log); nơi gọi không bao giờ thấy. Trả <code>CompletableFuture</code> nếu nơi gọi cần biết.</li>
  <li><strong>"Vì sao SecurityContext rỗng trong @Async, sửa thế nào?"</strong> — Nó là ThreadLocal của luồng request. Truyền dữ liệu làm tham số, hoặc chép bằng TaskDecorator / <code>DelegatingSecurityContextAsyncTaskExecutor</code>. Không dùng <code>MODE_INHERITABLETHREADLOCAL</code> với pool — đã đo: nó làm lộ danh tính của An vào việc của Bình.</li>
</ol>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
  <li>Với lõi 4, max 8, hàng đợi 20, bạn gửi đúng 25 việc một giây. Lúc đầu có bao nhiêu luồng chạy, và khoảng bao lâu thì xong hết?</li>
  <li>Làm cho <code>guiVaGhiNhan</code> thật sự bất đồng bộ mà không chuyển <code>gui</code> sang lớp khác.</li>
  <li>Việc nền của bạn đọc <code>SecurityContextHolder</code> để điền cột "người gửi". Viết lại để luôn đúng, kể cả khi một thư viện khác đã đặt <code>MODE_INHERITABLETHREADLOCAL</code>.</li>
</ol></div>
${giai('Xem đáp án', `<p>1. 4 luồng: 4 việc đầu khởi động 4 luồng lõi, 20 việc kế lấp đầy hàng đợi, chỉ việc thứ 25 gặp hàng đầy nên luồng thứ 5 mới được tạo. 5 luồng cho 25 việc ⇒ 5 đợt ≈ 5 giây. (Với 24 việc: 4 luồng, 6 đợt ≈ 6 giây — ít việc hơn mà lại chậm hơn.)</p><p>2. Gọi qua proxy: tiêm chính bean đó vào nó theo kiểu lười (<code>@Lazy ThongBaoAsync self</code>, rồi <code>self.gui(…)</code>), hoặc tốt hơn, để <code>guiVaGhiNhan</code> ở controller/service rồi gọi <code>tb.gui(…)</code>.</p><p>3. Đừng đọc biến toàn cục gắn luồng trong việc nền: biến mã người dùng thành tham số phương thức, lấy trên luồng request (<code>tb.gui(user.id(), …)</code>). Khi đó cả chiến lược lẫn pool đều không đổi được người là ai.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<ul>
  <li><strong>TaskExecutor</strong> — interface "chạy việc này ở đâu đó" của Spring; <code>applicationTaskExecutor</code> của Boot đứng sau <code>@Async</code>.</li>
  <li><strong>Core / max pool size, queue capacity</strong> — số luồng giữ sẵn, số luồng tối đa, số việc được chờ; vượt cả ba ⇒ <code>TaskRejectedException</code>.</li>
  <li><strong>Virtual thread</strong> — luồng rẻ do JVM quản lý (Java 21); mỗi việc một luồng là ổn với việc chủ yếu chờ.</li>
  <li><strong>AsyncUncaughtExceptionHandler</strong> — nơi nhận exception từ phương thức async kiểu <code>void</code>.</li>
  <li><strong>TaskDecorator</strong> — bọc từng việc được gửi; dùng để chép rồi xoá ngữ cảnh (bảo mật, MDC).</li>
  <li><strong>Tắt êm (graceful shutdown)</strong> — ngừng nhận việc, làm nốt việc đang chạy, trong thời gian nền tảng cho phép.</li>
</ul>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Đã đo: 2.008 ms khi đồng bộ, 6 ms với <code>@Async</code>; gọi qua <code>this</code> là đồng bộ trở lại.</li>
  <li>Pool mặc định: 8 luồng, hàng đợi vô hạn — 100 việc một giây mất 13 giây; virtual thread 1 giây; pool có giới hạn từ chối 72/100.</li>
  <li>Lỗi trong phương thức async <code>void</code> chỉ thành một dòng log; trả future khi nơi gọi cần biết.</li>
  <li>Ngữ cảnh bảo mật không đi theo việc; <code>MODE_INHERITABLETHREADLOCAL</code> cộng pool đã chạy việc của Bình dưới tên An; TaskDecorator mới đúng.</li>
  <li>10 giây của <code>docker stop</code> đã giết 4 trong 20 việc đang chạy; việc nằm trong bộ nhớ thì không bền.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.spring.io/spring-boot/reference/features/task-execution-and-scheduling.html', '🍃', 'Spring Boot — Task Execution and Scheduling', 'applicationTaskExecutor, spring.task.execution.*, virtual thread, TaskDecorator')}
${tl('https://docs.spring.io/spring-framework/reference/integration/scheduling.html', '📘', 'Spring Framework — Task Execution and Scheduling', '@Async, executor, xử lý exception')}
${tl('https://github.blog/2021-03-18-how-we-found-and-fixed-a-rare-race-condition-in-our-session-handling/', '🐙', 'GitHub — lỗi tranh chấp hiếm gặp trong xử lý phiên', 'sự cố tháng 3/2021, từng bước')}

<h3>Nguồn</h3>
<ul>
  <li>GitHub Blog, 18/03/2021 — <a href="https://github.blog/2021-03-18-how-we-found-and-fixed-a-rare-race-condition-in-our-session-handling/" target="_blank" rel="noopener">How we found and fixed a rare race condition in our session handling</a>.</li>
  <li>Mọi output: LabFlow (Spring Boot 4.1.2, Java 21) + PostgreSQL 16 trên máy của khoá học, 25/11/2026.</li>
</ul>
</div>
`;

// ===== Bài 14.2 =====
const MA142_JOB = java("/**\n * BR-13: lượt PENDING mà tới 2 giờ trước giờ bắt đầu vẫn chưa ai duyệt ⇒ tự từ chối, trả chỗ cho người khác, báo cho sinh viên.\n * Chạy mỗi phút theo giờ Việt Nam; @SchedulerLock ⇒ hai instance không cùng xử lý một lượt.\n */\n@Component\n@ConditionalOnProperty(name = \"labflow.scheduling.enabled\", havingValue = \"true\", matchIfMissing = true)\nclass HetHanDuyet {\n    private static final Logger log = LoggerFactory.getLogger(HetHanDuyet.class);\n    private final BookingRepository bookings; private final LabCatalog catalog;\n    private final ApplicationEventPublisher events; private final Clock clock;\n\n    HetHanDuyet(BookingRepository b, LabCatalog c, ApplicationEventPublisher e, Clock clock) {\n        this.bookings = b; this.catalog = c; this.events = e; this.clock = clock;\n    }\n\n    @Scheduled(cron = \"${labflow.booking.het-han.cron:0 * * * * *}\", zone = \"Asia/Ho_Chi_Minh\")\n    @SchedulerLock(name = \"booking.hetHanDuyet\", lockAtMostFor = \"PT5M\", lockAtLeastFor = \"PT5S\")\n    @Transactional\n    public void chay() {\n        LocalDateTime han = LocalDateTime.now(clock).plusHours(2);\n        List<Booking> qua = bookings.choDuyetBatDauTruoc(han);\n        for (Booking b : qua) {\n            b.tuChoi(\"Hết hạn duyệt: chưa được duyệt trước giờ bắt đầu 2 giờ\");\n            String lab = catalog.theoIds(List.of(b.getLabId())).get(b.getLabId()).code();\n            events.publishEvent(new BookingDecided(b.getId(), b.getOwnerId(), lab, b.getStatus().name(), b.getRejectReason()));\n        }\n        if (!qua.isEmpty()) log.info(\"tự từ chối {} lượt chờ quá hạn: {}\", qua.size(), qua.stream().map(Booking::getId).toList());\n    }\n}");
const MA142_REPO = java("/** BR-13: lượt còn chờ duyệt mà giờ bắt đầu đã sát (job HetHanDuyet). Khoá dòng, bỏ qua dòng người khác đang khoá. */\n@Lock(LockModeType.PESSIMISTIC_WRITE)\n@QueryHints(@QueryHint(name = \"jakarta.persistence.lock.timeout\", value = \"-2\"))   // -2 = SKIP LOCKED\n@Query(\"select b from Booking b where b.status = 'PENDING' and b.startAt < :han order by b.id\")\nList<Booking> choDuyetBatDauTruoc(@Param(\"han\") LocalDateTime han);");
const MA142_CFG = java("/**\n * Bật @Scheduled cho cả ứng dụng + ShedLock: job có @SchedulerLock chỉ chạy trên MỘT instance mỗi lượt.\n * Khoá nằm trong bảng shedlock của PostgreSQL, giờ lấy từ CSDL (usingDbTime) ⇒ đồng hồ các máy lệch nhau cũng không sao.\n * labflow.scheduling.enabled=false ⇒ tắt hẳn (test, công cụ một lần).\n */\n@Configuration\n@EnableScheduling\n@EnableSchedulerLock(defaultLockAtMostFor = \"PT5M\")\n@ConditionalOnProperty(name = \"labflow.scheduling.enabled\", havingValue = \"true\", matchIfMissing = true)\nclass LichCauHinh {\n    @Bean\n    LockProvider lockProvider(DataSource ds) {\n        return new JdbcTemplateLockProvider(JdbcTemplateLockProvider.Configuration.builder()\n            .withJdbcTemplate(new JdbcTemplate(ds)).usingDbTime().build());\n    }\n}");
const MA142_SQL = sql("-- shared: bảng khoá của ShedLock — một dòng cho mỗi job hẹn giờ; instance nào giữ dòng thì instance đó chạy (Chương 14.2)\ncreate table shedlock (\n  name       varchar(64)  not null primary key,\n  lock_until timestamptz  not null,\n  locked_at  timestamptz  not null,\n  locked_by  varchar(255) not null\n);");
const MA142_NHAC = java("/** Nhắc lịch ngày mai: cách ngây thơ — chọn dòng chưa nhắc, gửi, đánh dấu. Hai instance ⇒ nhắc hai lần. */\nabstract static class NhacGoc {\n    final JdbcClient db; final String inst;\n    NhacGoc(JdbcClient db, String inst) { this.db = db; this.inst = inst; }\n    void nhacMot(long id) {\n        ngu(50);                                                             // \"gửi email\"\n        db.sql(\"insert into d14_email (lich_id, instance) values (?, ?)\").params(id, inst).update();\n        db.sql(\"update d14_lich set nhac_luc = now() where id = ?\").param(id).update();\n    }\n    void nhacTatCa() {\n        List<Long> ids = db.sql(\"select id from d14_lich where nhac_luc is null order by id\").query(Long.class).list();\n        ids.forEach(this::nhacMot);\n        if (!ids.isEmpty()) log.info(\"instance {} đã nhắc {} lịch\", inst, ids.size());\n    }\n}\n\n@Component @Profile(\"c14\") @ConditionalOnProperty(name = \"labflow.d14.lich\", havingValue = \"nhac\")\nstatic class Nhac extends NhacGoc {\n    Nhac(JdbcClient db, @Value(\"${labflow.instance}\") String inst) { super(db, inst); }\n    @Scheduled(cron = \"*/5 * * * * *\") void chay() { nhacTatCa(); }\n}\n\n@Component @Profile(\"c14\") @ConditionalOnProperty(name = \"labflow.d14.lich\", havingValue = \"nhac-khoa\")\nstatic class NhacKhoa extends NhacGoc {\n    NhacKhoa(JdbcClient db, @Value(\"${labflow.instance}\") String inst) { super(db, inst); }\n    @Scheduled(cron = \"*/5 * * * * *\")\n    @SchedulerLock(name = \"d14.nhacLich\", lockAtMostFor = \"PT1M\", lockAtLeastFor = \"PT2S\")\n    public void chay() { nhacTatCa(); }\n}\n\n/** Cách khác: không khoá cả job mà khoá TỪNG DÒNG — hai instance chia nhau việc, không ai làm trùng. */\n@Component @Profile(\"c14\") @ConditionalOnProperty(name = \"labflow.d14.lich\", havingValue = \"nhac-skip\")\nstatic class NhacSkip extends NhacGoc {\n    final TransactionTemplate tx;\n    NhacSkip(JdbcClient db, @Value(\"${labflow.instance}\") String inst, TransactionTemplate tx) { super(db, inst); this.tx = tx; }\n    @Scheduled(cron = \"*/5 * * * * *\")\n    void chay() {\n        int tong = 0, n;\n        do {\n            n = tx.execute(s -> {\n                List<Long> ids = db.sql(\"select id from d14_lich where nhac_luc is null order by id limit 5 for update skip locked\")\n                    .query(Long.class).list();\n                ids.forEach(this::nhacMot);\n                return ids.size();\n            });\n            tong += n;\n        } while (n > 0);\n        if (tong > 0) log.info(\"instance {} đã nhắc {} lịch\", inst, tong);\n    }\n}");
const OUT142A = out("## 1 fixedRate = 2000, việc mất 3 giây\n$ docker logs labflow | grep fixedRate | gon\n13:21:10.785 [scheduling-1] fixedRate #1 bắt đầu\n13:21:13.786 [scheduling-1] fixedRate #1 xong\n13:21:13.788 [scheduling-1] fixedRate #2 bắt đầu\n13:21:16.788 [scheduling-1] fixedRate #2 xong\n13:21:16.789 [scheduling-1] fixedRate #3 bắt đầu\n13:21:19.789 [scheduling-1] fixedRate #3 xong\n13:21:19.790 [scheduling-1] fixedRate #4 bắt đầu\n\n## 2 fixedDelay = 2000, việc mất 3 giây\n$ docker logs labflow | grep fixedDelay | gon\n13:21:34.712 [scheduling-1] fixedDelay #1 bắt đầu\n13:21:37.713 [scheduling-1] fixedDelay #1 xong\n13:21:39.714 [scheduling-1] fixedDelay #2 bắt đầu\n13:21:42.715 [scheduling-1] fixedDelay #2 xong\n13:21:44.715 [scheduling-1] fixedDelay #3 bắt đầu");
const OUT142B = out("## 1 Hai job, một luồng scheduler (mặc định): báo cáo 5 giây + nhịp tim mỗi giây\n$ docker logs labflow | grep -E \"báo cáo|nhịp tim\" | gon\n13:21:58.796 [scheduling-1] báo cáo chậm bắt đầu\n13:22:03.796 [scheduling-1] báo cáo chậm xong\n13:22:03.798 [scheduling-1] nhịp tim\n13:22:03.798 [scheduling-1] báo cáo chậm bắt đầu\n13:22:08.799 [scheduling-1] báo cáo chậm xong\n13:22:08.799 [scheduling-1] nhịp tim\n13:22:08.867 [scheduling-1] báo cáo chậm bắt đầu\n\n## 2 spring.task.scheduling.pool.size=2\n$ docker logs labflow | grep -E \"báo cáo|nhịp tim\" | gon\n13:22:20.386 [scheduling-2] nhịp tim\n13:22:20.386 [scheduling-1] báo cáo chậm bắt đầu\n13:22:21.379 [scheduling-2] nhịp tim\n13:22:22.379 [scheduling-2] nhịp tim\n13:22:23.379 [scheduling-2] nhịp tim\n13:22:24.379 [scheduling-2] nhịp tim\n13:22:25.379 [scheduling-2] nhịp tim\n13:22:25.386 [scheduling-1] báo cáo chậm xong\n13:22:25.387 [scheduling-1] báo cáo chậm bắt đầu\n13:22:26.379 [scheduling-2] nhịp tim\n13:22:27.379 [scheduling-2] nhịp tim\n\n## 3 Job ném lỗi ở lượt chẵn\n$ docker logs labflow | grep -E \"lượt|Unexpected error\" | gon | cut -c1-150\n13:22:39.767 [scheduling-1] lượt 1 chạy xong\n13:22:40.757 [scheduling-1] Unexpected error occurred in scheduled task\njava.lang.IllegalStateException: lượt 2: máy chủ thư không trả lời\n13:22:41.756 [scheduling-1] lượt 3 chạy xong\n13:22:42.756 [scheduling-1] Unexpected error occurred in scheduled task\njava.lang.IllegalStateException: lượt 4: máy chủ thư không trả lời\n13:22:43.756 [scheduling-1] lượt 5 chạy xong\n13:22:44.756 [scheduling-1] Unexpected error occurred in scheduled task\njava.lang.IllegalStateException: lượt 6: máy chủ thư không trả lời");
const OUT142C = out("## 1 \"7 giờ sáng các ngày thường\" — tính theo múi giờ nào?\n$ curl -s -G $D14/s/cron --data-urlencode \"bt=0 0 7 * * MON-FRI\" --data-urlencode \"tu=2026-11-27T00:00:00Z\" --data-urlencode \"zone=UTC\" | jq -r '.[]'\n2026-11-27T07:00Z[UTC]  =  2026-11-27T14:00 giờ VN\n2026-11-30T07:00Z[UTC]  =  2026-11-30T14:00 giờ VN\n2026-12-01T07:00Z[UTC]  =  2026-12-01T14:00 giờ VN\n\n$ curl -s -G $D14/s/cron --data-urlencode \"bt=0 0 7 * * MON-FRI\" --data-urlencode \"tu=2026-11-27T00:00:00Z\" --data-urlencode \"zone=Asia/Ho_Chi_Minh\" | jq -r '.[]'\n2026-11-30T07:00+07:00[Asia/Ho_Chi_Minh]  =  2026-11-30T07:00 giờ VN\n2026-12-01T07:00+07:00[Asia/Ho_Chi_Minh]  =  2026-12-01T07:00 giờ VN\n2026-12-02T07:00+07:00[Asia/Ho_Chi_Minh]  =  2026-12-02T07:00 giờ VN\n\n## 2 Cron năm trường kiểu Linux trong Spring\n$ bash $R app \"--labflow.booking.het-han.cron=0 7 * * *\" | grep -o \"Encountered invalid.*\" | head -1\nEncountered invalid @Scheduled method 'chay': Cron expression must consist of 6 fields (found 5 in \"0 7 * * *\")");
const OUT142D = out("## 1 Hai instance, job nhắc lịch không khoá (cron mỗi 5 giây, 20 lịch, cả hai đã chạy rồi mới thả dữ liệu)\n$ psql -c \"select instance, count(*) as email, count(distinct lich_id) as lich from d14_email group by instance order by 1\"\n instance | email | lich \n----------+-------+------\n A        |    20 |   20\n B        |    20 |   20\n(2 rows)\n\n$ psql -c \"select count(*) as tong_email, count(distinct lich_id) as so_lich from d14_email\"\n tong_email | so_lich \n------------+---------\n         40 |      20\n(1 row)\n\n## 2 Thêm @SchedulerLock (ShedLock)\n$ psql -c \"select instance, count(*) as email, count(distinct lich_id) as lich from d14_email group by instance order by 1\"\n instance | email | lich \n----------+-------+------\n A        |    20 |   20\n(1 row)\n\n$ psql -c \"select name, locked_by, lock_until - locked_at as giu from shedlock where name like 'd14%'\"\n     name     |  locked_by   |   giu    \n--------------+--------------+----------\n d14.nhacLich | 05eb4de45317 | 00:00:02\n(1 row)\n\n## 3 Khoá từng dòng: FOR UPDATE SKIP LOCKED, lô 5 dòng\n$ psql -c \"select instance, count(*) as email, count(distinct lich_id) as lich from d14_email group by instance order by 1\"\n instance | email | lich \n----------+-------+------\n A        |    10 |   10\n B        |    10 |   10\n(2 rows)\n\n$ psql -c \"select count(*) as tong_email, count(distinct lich_id) as so_lich from d14_email\"\n tong_email | so_lich \n------------+---------\n         20 |      20\n(1 row)");
const OUT142E = out("## 1 Thứ Tư 25/11 lúc 08:00 — An đặt Lab AI (40 chỗ ⇒ cần duyệt) hai khung\n$ dat $AN AI-03 2026-11-25T11:00:00 2026-11-25T12:00:00\n{\"id\":1,\"lab\":\"AI-03\",\"startAt\":\"2026-11-25T11:00:00\",\"status\":\"PENDING\"}\n\n$ dat $AN AI-03 2026-11-25T15:00:00 2026-11-25T16:00:00\n{\"id\":2,\"lab\":\"AI-03\",\"startAt\":\"2026-11-25T15:00:00\",\"status\":\"PENDING\"}\n\n## 2 Một giờ năm phút sau, không ai duyệt; hai instance cùng chạy job\n$ curl -s -H \"Authorization: Bearer $AN\" $API/api/v1/bookings/mine | jq -c '.items[] | {id,startAt,status,rejectReason}'\n{\"id\":1,\"startAt\":\"2026-11-25T11:00:00\",\"status\":\"REJECTED\",\"rejectReason\":\"Hết hạn duyệt: chưa được duyệt trước giờ bắt đầu 2 giờ\"}\n{\"id\":2,\"startAt\":\"2026-11-25T15:00:00\",\"status\":\"PENDING\",\"rejectReason\":null}\n\n$ curl -s -H \"Authorization: Bearer $AN\" $API/api/v1/notifications/mine | jq -c '.[] | {bookingId,kind,message}'\n{\"bookingId\":1,\"kind\":\"CREATED_PENDING\",\"message\":\"Lượt đặt #1 phòng AI-03 đang chờ duyệt\"}\n{\"bookingId\":2,\"kind\":\"CREATED_PENDING\",\"message\":\"Lượt đặt #2 phòng AI-03 đang chờ duyệt\"}\n{\"bookingId\":1,\"kind\":\"REJECTED\",\"message\":\"Lượt đặt #1 bị từ chối: Hết hạn duyệt: chưa được duyệt trước giờ bắt đầu 2 giờ\"}\n\n$ (docker logs labflow; docker logs labflow-b) | grep -E \"tự từ chối\" | gon\n13:28:20.153 [scheduling-1] tự từ chối 1 lượt chờ quá hạn: [1]\n\n$ docker logs labflow | grep -o \"from bookings b1_0 where b1_0.status=.PENDING.*\" | head -1\nfrom bookings b1_0 where b1_0.status='PENDING' and b1_0.start_at<? order by b1_0.id for no key update of b1_0 skip locked\n\n$ psql -c \"select name, locked_by, lock_until - locked_at as giu from shedlock\"\n        name         |  locked_by   |   giu    \n---------------------+--------------+----------\n booking.hetHanDuyet | 05eb4de45317 | 00:00:05\n(1 row)");

const L142_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.2 · Background work</span>
<h2>@Scheduled jobs</h2>
<p class="lead">Some work is not triggered by a request but by the clock: "every minute, reject bookings nobody approved in time", "at 7:00 on weekdays, email tomorrow's schedule". Spring runs such methods with <code>@Scheduled</code>. It looks trivial — until a slow job silently delays every other job, a cron written for 7:00 fires at 14:00 Vietnam time, and two instances of the same app send every student two reminder emails. All three happened in the measurements below, followed by the fixes: a scheduler pool, an explicit time zone, ShedLock and <code>SKIP LOCKED</code>.</p>

<h3>Everyday picture first</h3>
<p>A dormitory has a rule: at 22:00 someone locks the main gate. If there is one guard with one list of chores, and the chore before "lock the gate" takes an hour, the gate is locked at 23:00. If the guard's watch is set to London time, the gate is locked at 5 in the morning. And if the dormitory hires a second guard and gives him the same list, both walk to the gate at 22:00 — harmless for a gate, not harmless for "give each student their mail" or "charge each room its electricity bill". Scheduling is the guard's list; the rest of this lesson is about the hour, the watch and the second guard.</p>

<h3>1. Three ways to say "when"</h3>
<p><code>@EnableScheduling</code> turns it on (LabFlow does it in <code>shared/LichCauHinh</code>, shown in section 5). Then any bean method without arguments can carry <code>@Scheduled</code>:</p>
${java(`@Scheduled(fixedRate = 2000)                       // start every 2 s, counted from the previous START
@Scheduled(fixedDelay = 2000)                      // wait 2 s after the previous run ENDS
@Scheduled(cron = "0 0 7 * * MON-FRI", zone = "Asia/Ho_Chi_Minh")   // sec min hour day month weekday
@Scheduled(cron = "\${labflow.booking.het-han.cron:0 * * * * *}")   // from configuration, with a default`)}
<p>Both jobs below take 3 seconds, with a 2-second period:</p>
${OUT142A}
<ul>
  <li><strong>fixedRate</strong>: the next run was due 2 s after the previous start, but the previous one was still running — so Spring started it immediately after (13.786 ⇒ 13.788). Runs never overlap on the same scheduler; they pile up back-to-back. A job that is always slower than its rate runs non-stop.</li>
  <li><strong>fixedDelay</strong>: 3 s of work + 2 s of rest = one start every 5 s. Use it when "do it again after you finished" is what you mean (polling an outbox, lesson 14.4).</li>
</ul>

<h3>2. One thread for every job</h3>
<p>By default Boot gives the scheduler <strong>one</strong> thread, <code>scheduling-1</code>. A heartbeat job every second next to a 5-second report:</p>
${OUT142B}
<ol>
  <li>With one thread, the heartbeat that should run every second ran once every 5 s — it waited behind the report. If the heartbeat was "renew a lock" or "send a keep-alive", the system thinks the app is dead.</li>
  <li><code>spring.task.scheduling.pool.size=2</code>: the heartbeat runs every second on <code>scheduling-2</code> while the report occupies <code>scheduling-1</code>. (With <code>spring.threads.virtual.enabled=true</code>, Boot uses a scheduler that runs each execution on a new virtual thread.)</li>
  <li>An exception does <em>not</em> stop the schedule: run 2 failed, run 3 ran a second later. The error is only an ERROR line from <code>TaskUtils$LoggingErrorHandler</code> — count it (Chapter 15), or a job can fail every minute for a month unnoticed.</li>
</ol>

<h3>3. Cron, and the question "7:00 where?"</h3>
${OUT142C}
<ul>
  <li>Containers usually run in UTC (LabFlow's do, <code>TZ=UTC</code>). A cron without <code>zone</code> is read in the JVM's default zone: "7:00 on weekdays" fires at <strong>14:00</strong> in Vietnam. With <code>zone = "Asia/Ho_Chi_Minh"</code> it fires at 7:00 Vietnam time, whatever the server's zone.</li>
  <li>Spring cron has <strong>six</strong> fields (seconds first). The five-field Linux form <code>0 7 * * *</code> is rejected at startup — good: a failed start is better than a job that silently never runs. Also useful: <code>@hourly</code>, <code>@daily</code>, <code>L</code> (last day of month), <code>MON#1</code> (first Monday).</li>
  <li>Vietnam has no daylight saving time, but if your users are in a zone that has it, a job at 02:30 can run twice or never on the day the clock changes — another reason to make jobs safe to run twice.</li>
</ul>

<h3>4. The real LabFlow job: BR-13, unapproved bookings expire</h3>
<p>Rule BR-13: a <code>PENDING</code> booking that nobody approved by two hours before its start is rejected automatically, so the slot goes back to others and the student is told. The job reads "now" from the injected <code>Clock</code> (lesson 18.2), so a test can move time instead of waiting:</p>
${MA142_JOB}
${MA142_REPO}
${OUT142E}
<p>At 08:00 An booked 11:00 and 15:00 in Lab AI (40 seats ⇒ needs approval). At 09:05 nobody had approved: booking #1 (starts 11:00, within two hours) was rejected with a reason and An got a notification through the existing <code>BookingDecided</code> event; #2 (15:00) is still waiting. Two instances were running, yet the log line appears once and <code>shedlock</code> has one row — section 5 explains. The last line is the SQL Hibernate 7 generated for the repository method: <code>for no key update of b1_0 skip locked</code> — the rows the job touches are locked against a manager approving them at the same moment.</p>

<h3>5. Two instances, two runs</h3>
<p>The moment LabFlow runs on two instances (Chapter 17), every <code>@Scheduled</code> method runs on both. A reminder job written the obvious way — select rows not reminded yet, send, mark:</p>
${MA142_NHAC}
${OUT142D}
<ol>
  <li><strong>No protection</strong>: both instances fired at the same second, both selected the same 20 rows before either marked them: 40 emails for 20 students.</li>
  <li><strong>ShedLock</strong>: before the method runs, the instance tries to insert/update a row in table <code>shedlock</code>; only one succeeds, the other skips this run. 20 emails, all from A. <code>lockAtMostFor</code> releases the lock if the holder dies; <code>lockAtLeastFor</code> (2 s here) keeps it a little longer so that a fast job on A does not finish before B's clock reaches the same second and runs it again.</li>
  <li><strong>Lock rows instead of the job</strong>: <code>select … for update skip locked limit 5</code> in a transaction. Each instance takes rows the other has not locked: 10 + 10, zero duplicates, and the work is shared — this scales to many instances. LabFlow's BR-13 job uses both: ShedLock so it runs once a minute, <code>SKIP LOCKED</code> so it never fights a manager's request.</li>
</ol>
${MA142_CFG}
${MA142_SQL}
<p><code>usingDbTime()</code> makes ShedLock compare times using PostgreSQL's clock, so two servers whose clocks differ by a few seconds still agree on who holds the lock.</p>

<h3>🕵️ Real incident — Microsoft Azure, 29 February 2012</h3>
<p>On leap day 2012, a large part of Windows Azure went down for many hours. When a virtual machine started, an agent created a certificate "valid for one year" by taking today's date and adding one to the year: 29 February 2013 — a date that does not exist. Certificate creation failed, VMs failed to start, and the automatic recovery made it spread. Microsoft's report describes the cause in exactly those terms. Lessons for scheduled and time-based code: never do date arithmetic by hand (use <code>plusYears</code>, <code>java.time</code> handles 29/02), test jobs with an injected <code>Clock</code> at awkward dates (29/02, 31/12, month ends, DST changes), and make sure a failing job is <em>seen</em> before it is everywhere.</p>

<h3>Compared with Node.js</h3>
<p>In Node you write <code>setInterval</code> or use <code>node-cron</code> (<code>cron.schedule('0 7 * * 1-5', fn, { timezone: 'Asia/Ho_Chi_Minh' })</code>). The single-instance trap is identical — PM2 cluster mode with 4 processes runs every cron 4 times. Teams then move scheduled work to BullMQ repeatable jobs, which keep the schedule in Redis so only one worker picks each run — the same idea as ShedLock. Because Node is single-threaded, a slow synchronous job also delays every request, not just the other jobs. Interview line: "in-process schedulers run once per instance; you need a shared lock (ShedLock, Redis, the database) or a single external scheduler."</p>

<h3>At work</h3>
<ul>
  <li>Write jobs to be <strong>idempotent</strong> — safe to run twice — because sooner or later they will be (two instances, a retry, a DST day). "Reject PENDING bookings older than…" is idempotent; "send everyone a reminder" is not until you record who was reminded.</li>
  <li>Process in small batches inside short transactions; a job that loads 100,000 rows in one transaction locks them all and can run out of memory.</li>
  <li>For heavy or rare jobs (monthly reports, data clean-up), many teams use a Kubernetes <code>CronJob</code> that starts a separate container, or Quartz with a JDBC job store when jobs must survive restarts and be managed at runtime. In-app <code>@Scheduled</code> + ShedLock is the right size for LabFlow.</li>
</ul>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"fixedRate vs fixedDelay?"</strong> — Rate counts from the previous start, delay from the previous end. With one scheduler thread runs never overlap; a slow fixedRate job runs back-to-back.</li>
  <li><strong>"Why did my second scheduled job stop running on time?"</strong> — Boot's scheduler has one thread by default; a long job blocks the others. Set <code>spring.task.scheduling.pool.size</code> or move the long job to an executor.</li>
  <li><strong>"How do you run a scheduled job only once across several instances?"</strong> — A distributed lock (ShedLock with a database/Redis table), or design the job to claim rows with <code>SELECT … FOR UPDATE SKIP LOCKED</code> so instances share the work.</li>
  <li><strong>"What does lockAtLeastFor protect against?"</strong> — Clock skew and very fast jobs: without it, one instance can finish and release before the other instance's trigger fires for the same slot.</li>
  <li><strong>"How do you test a job that depends on time?"</strong> — Inject a <code>Clock</code>; in tests use <code>Clock.fixed</code> and call the job method directly, including edge dates like 29/02.</li>
</ol>

<h3>🧪 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
  <li>A job with <code>fixedRate = 60000</code> usually takes 10 s, but once took 150 s. When do the next runs start, and do any run in parallel (one scheduler thread)?</li>
  <li>Write the cron for "every 15 minutes between 07:00 and 21:00, Monday to Saturday, Vietnam time".</li>
  <li>The reminder job uses ShedLock with <code>lockAtMostFor = "PT1M"</code>, but sending all reminders takes 3 minutes. What can happen?</li>
</ol></div>
${giai('Show the answers', `<p>1. Runs that became due during the 150 s do not overlap; when the long run ends, the next one starts immediately, then the schedule continues from there. Nothing runs in parallel on one thread — the cost is that runs are late.</p><p>2. <code>@Scheduled(cron = "0 */15 7-20 * * MON-SAT", zone = "Asia/Ho_Chi_Minh")</code> — hour field <code>7-20</code> gives 07:00 … 20:45; add a separate expression if 21:00 itself is needed.</p><p>3. After one minute the lock expires while A is still sending; at the next trigger B takes the lock and starts sending the reminders A has not marked yet ⇒ duplicates. <code>lockAtMostFor</code> must be longer than the longest realistic run, and the job should still mark rows one by one (or use SKIP LOCKED) so a second runner skips finished work.</p>`)}

<h3>🗂 Key terms</h3>
<ul>
  <li><strong>fixedRate / fixedDelay</strong> — period from the previous start / from the previous end.</li>
  <li><strong>Cron expression (Spring)</strong> — six fields: second, minute, hour, day of month, month, day of week; <code>zone</code> sets the time zone.</li>
  <li><strong>TaskScheduler</strong> — the component that triggers scheduled methods; one thread by default in Boot.</li>
  <li><strong>ShedLock</strong> — library that lets only one instance run a given job execution, using a shared lock table.</li>
  <li><strong>lockAtMostFor / lockAtLeastFor</strong> — safety expiry if the holder dies / minimum hold time against skew.</li>
  <li><strong>SKIP LOCKED</strong> — PostgreSQL row locking that skips rows locked by others; lets several workers share a table of work.</li>
  <li><strong>Idempotent job</strong> — running it twice has the same effect as once.</li>
</ul>

<h3>📌 Summary</h3>
<ul>
  <li>Measured: fixedRate with a slow job runs back-to-back; fixedDelay waits after each run.</li>
  <li>One scheduler thread by default: a 5-second report delayed a 1-second heartbeat to every 5 s; <code>pool.size=2</code> fixed it. Exceptions do not stop the schedule.</li>
  <li>Without <code>zone</code>, "7:00" in a UTC container is 14:00 in Vietnam; five-field cron fails at startup.</li>
  <li>BR-13 rejects unapproved bookings two hours before start, with an injected <code>Clock</code>, ShedLock and <code>SKIP LOCKED</code>.</li>
  <li>Two instances without protection sent 40 emails for 20 reminders; ShedLock 20 from one instance; SKIP LOCKED 10 + 10.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.spring.io/spring-framework/reference/integration/scheduling.html', '📘', 'Spring Framework — Scheduling', '@Scheduled, cron syntax, TaskScheduler')}
${tl('https://github.com/lukas-krecan/ShedLock', '🔒', 'ShedLock', 'providers, lockAtMostFor / lockAtLeastFor, usingDbTime')}
${tl('https://azure.microsoft.com/en-us/blog/summary-of-windows-azure-service-disruption-on-feb-29th-2012/', '☁️', 'Microsoft — Summary of Windows Azure Service Disruption on Feb 29th, 2012', 'the leap day root cause')}

<h3>Sources</h3>
<ul>
  <li>Bill Laing, Microsoft, 09/03/2012 — <a href="https://azure.microsoft.com/en-us/blog/summary-of-windows-azure-service-disruption-on-feb-29th-2012/" target="_blank" rel="noopener">Summary of Windows Azure Service Disruption on Feb 29th, 2012</a>.</li>
  <li>All outputs: LabFlow (Spring Boot 4.1.2, ShedLock 7.12.0) + PostgreSQL 16, one and two instances, on the course machine, 25/11/2026.</li>
</ul>
</div>
`;

const L142_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.2 · Việc nền</span>
<h2>Tác vụ hẹn giờ @Scheduled</h2>
<p class="lead">Có những việc không do request kích hoạt mà do đồng hồ: "mỗi phút, từ chối các lượt đặt không ai duyệt kịp", "7 giờ sáng ngày thường, email lịch ngày mai". Spring chạy các phương thức đó bằng <code>@Scheduled</code>. Trông thì đơn giản — cho tới khi một job chậm lặng lẽ làm trễ mọi job khác, một cron viết cho 7 giờ lại chạy lúc 14 giờ giờ Việt Nam, và hai instance của cùng ứng dụng gửi cho mỗi sinh viên hai email nhắc. Cả ba đều xảy ra trong các phép đo dưới đây, kèm cách sửa: pool cho scheduler, múi giờ tường minh, ShedLock và <code>SKIP LOCKED</code>.</p>

<h3>Đời thường trước đã</h3>
<p>Ký túc xá có quy định: 22 giờ phải có người khoá cổng chính. Nếu chỉ có một bảo vệ với một danh sách việc, và việc ngay trước "khoá cổng" mất một tiếng, thì 23 giờ cổng mới khoá. Nếu đồng hồ của bảo vệ chỉnh theo giờ London, cổng bị khoá lúc 5 giờ sáng. Còn nếu ký túc thuê thêm bảo vệ thứ hai và đưa đúng danh sách đó, cả hai cùng đi khoá cổng lúc 22 giờ — vô hại với cái cổng, nhưng không vô hại với "phát thư cho từng sinh viên" hay "thu tiền điện từng phòng". Lịch hẹn giờ là danh sách việc của bảo vệ; phần còn lại của bài nói về cái giờ, cái đồng hồ và người bảo vệ thứ hai.</p>

<h3>1. Ba cách nói "khi nào"</h3>
<p><code>@EnableScheduling</code> bật tính năng này (LabFlow đặt trong <code>shared/LichCauHinh</code>, xem mục 5). Sau đó mọi phương thức không tham số của bean đều có thể mang <code>@Scheduled</code>:</p>
${java(`@Scheduled(fixedRate = 2000)                       // bắt đầu mỗi 2 giây, tính từ lúc BẮT ĐẦU lượt trước
@Scheduled(fixedDelay = 2000)                      // chờ 2 giây sau khi lượt trước KẾT THÚC
@Scheduled(cron = "0 0 7 * * MON-FRI", zone = "Asia/Ho_Chi_Minh")   // giây phút giờ ngày tháng thứ
@Scheduled(cron = "\${labflow.booking.het-han.cron:0 * * * * *}")   // lấy từ cấu hình, có giá trị mặc định`)}
<p>Cả hai job dưới đây mất 3 giây, chu kỳ 2 giây:</p>
${OUT142A}
<ul>
  <li><strong>fixedRate</strong>: lượt sau đến hạn 2 giây sau khi lượt trước bắt đầu, nhưng lượt trước vẫn đang chạy — nên Spring cho chạy ngay khi nó xong (13.786 ⇒ 13.788). Các lượt không bao giờ chồng nhau trên cùng một scheduler; chúng xếp nối đuôi. Một job luôn chậm hơn chu kỳ thì chạy không nghỉ.</li>
  <li><strong>fixedDelay</strong>: 3 giây làm + 2 giây nghỉ = 5 giây một lần. Dùng khi ý bạn là "làm xong thì nghỉ rồi làm tiếp" (quét outbox, bài 14.4).</li>
</ul>

<h3>2. Một luồng cho mọi job</h3>
<p>Mặc định Boot cho scheduler <strong>một</strong> luồng, <code>scheduling-1</code>. Một job nhịp tim mỗi giây đặt cạnh một báo cáo 5 giây:</p>
${OUT142B}
<ol>
  <li>Với một luồng, nhịp tim lẽ ra chạy mỗi giây lại 5 giây mới chạy một lần — nó phải chờ sau báo cáo. Nếu nhịp tim là "gia hạn khoá" hay "gửi tín hiệu còn sống", hệ thống sẽ tưởng ứng dụng đã chết.</li>
  <li><code>spring.task.scheduling.pool.size=2</code>: nhịp tim chạy mỗi giây trên <code>scheduling-2</code> trong khi báo cáo chiếm <code>scheduling-1</code>. (Bật <code>spring.threads.virtual.enabled=true</code> thì Boot dùng scheduler chạy mỗi lượt trên một virtual thread mới.)</li>
  <li>Exception <em>không</em> làm dừng lịch: lượt 2 lỗi, lượt 3 vẫn chạy một giây sau. Lỗi chỉ là một dòng ERROR từ <code>TaskUtils$LoggingErrorHandler</code> — hãy đếm nó (Chương 15), không thì một job có thể lỗi mỗi phút suốt một tháng mà không ai hay.</li>
</ol>

<h3>3. Cron, và câu hỏi "7 giờ ở đâu?"</h3>
${OUT142C}
<ul>
  <li>Container thường chạy giờ UTC (LabFlow cũng vậy, <code>TZ=UTC</code>). Cron không có <code>zone</code> được hiểu theo múi giờ mặc định của JVM: "7 giờ ngày thường" chạy lúc <strong>14 giờ</strong> ở Việt Nam. Có <code>zone = "Asia/Ho_Chi_Minh"</code> thì chạy đúng 7 giờ giờ Việt Nam, máy chủ đặt múi nào cũng vậy.</li>
  <li>Cron của Spring có <strong>sáu</strong> trường (giây đứng đầu). Dạng năm trường của Linux <code>0 7 * * *</code> bị từ chối ngay lúc khởi động — tốt: thà không khởi động được còn hơn một job lặng lẽ không bao giờ chạy. Cũng hữu ích: <code>@hourly</code>, <code>@daily</code>, <code>L</code> (ngày cuối tháng), <code>MON#1</code> (thứ Hai đầu tiên).</li>
  <li>Việt Nam không đổi giờ mùa hè, nhưng nếu người dùng ở múi có đổi giờ, job lúc 02:30 có thể chạy hai lần hoặc không chạy vào ngày đổi giờ — thêm một lý do để job chạy hai lần cũng an toàn.</li>
</ul>

<h3>4. Job thật của LabFlow: BR-13, lượt chưa duyệt hết hạn</h3>
<p>Quy tắc BR-13: lượt <code>PENDING</code> mà tới hai giờ trước giờ bắt đầu vẫn chưa ai duyệt thì tự bị từ chối, để trả chỗ cho người khác và báo cho sinh viên. Job đọc "bây giờ" từ <code>Clock</code> được tiêm vào (bài 18.2), nên phép thử có thể dời thời gian thay vì ngồi chờ:</p>
${MA142_JOB}
${MA142_REPO}
${OUT142E}
<p>Lúc 08:00 An đặt 11:00 và 15:00 ở Lab AI (40 chỗ ⇒ cần duyệt). Tới 09:05 chưa ai duyệt: lượt #1 (bắt đầu 11:00, trong vòng hai giờ) bị từ chối kèm lý do, và An nhận thông báo qua sự kiện <code>BookingDecided</code> có sẵn; lượt #2 (15:00) vẫn chờ. Đang có hai instance chạy, nhưng dòng log chỉ xuất hiện một lần và bảng <code>shedlock</code> có một dòng — mục 5 sẽ giải thích. Dòng cuối là câu SQL mà Hibernate 7 sinh cho phương thức repository: <code>for no key update of b1_0 skip locked</code> — các dòng job đụng tới được khoá, để không giẫm chân một quản lý đang duyệt đúng lúc đó.</p>

<h3>5. Hai instance, hai lần chạy</h3>
<p>Ngay khi LabFlow chạy hai instance (Chương 17), mọi phương thức <code>@Scheduled</code> chạy trên cả hai. Một job nhắc lịch viết theo cách hiển nhiên — chọn dòng chưa nhắc, gửi, đánh dấu:</p>
${MA142_NHAC}
${OUT142D}
<ol>
  <li><strong>Không bảo vệ</strong>: hai instance cùng chạy đúng một giây, cùng chọn 20 dòng trước khi bên nào kịp đánh dấu: 40 email cho 20 sinh viên.</li>
  <li><strong>ShedLock</strong>: trước khi chạy phương thức, instance thử chèn/cập nhật một dòng trong bảng <code>shedlock</code>; chỉ một bên thành công, bên kia bỏ qua lượt này. 20 email, tất cả từ A. <code>lockAtMostFor</code> nhả khoá nếu bên giữ chết; <code>lockAtLeastFor</code> (ở đây 2 giây) giữ thêm một chút, để job chạy nhanh trên A không xong trước khi đồng hồ của B chạm cùng giây đó rồi chạy lại.</li>
  <li><strong>Khoá dòng thay vì khoá job</strong>: <code>select … for update skip locked limit 5</code> trong một giao dịch. Mỗi instance lấy các dòng bên kia chưa khoá: 10 + 10, không trùng, và việc được chia đôi — cách này mở rộng được cho nhiều instance. Job BR-13 của LabFlow dùng cả hai: ShedLock để mỗi phút chạy một lần, <code>SKIP LOCKED</code> để không bao giờ tranh với request của quản lý.</li>
</ol>
${MA142_CFG}
${MA142_SQL}
<p><code>usingDbTime()</code> khiến ShedLock so thời gian bằng đồng hồ của PostgreSQL, nên hai máy chủ lệch đồng hồ vài giây vẫn thống nhất được ai đang giữ khoá.</p>

<h3>🕵️ Sự cố thật — Microsoft Azure, 29/02/2012</h3>
<p>Vào ngày nhuận năm 2012, một phần lớn Windows Azure ngừng hoạt động nhiều giờ. Khi máy ảo khởi động, một agent tạo chứng chỉ "có hạn một năm" bằng cách lấy ngày hôm nay rồi cộng năm thêm một: ngày 29/02/2013 — ngày không tồn tại. Tạo chứng chỉ thất bại, máy ảo không lên, và cơ chế tự phục hồi làm lỗi lan rộng. Báo cáo của Microsoft mô tả nguyên nhân đúng như vậy. Bài học cho mã hẹn giờ và mã dựa vào thời gian: đừng tự tính ngày bằng tay (dùng <code>plusYears</code>, <code>java.time</code> tự xử lý 29/02), thử job với <code>Clock</code> tiêm vào ở những ngày khó (29/02, 31/12, cuối tháng, ngày đổi giờ), và bảo đảm job lỗi phải được <em>nhìn thấy</em> trước khi nó lan khắp nơi.</p>

<h3>So với Node.js</h3>
<p>Ở Node bạn viết <code>setInterval</code> hoặc dùng <code>node-cron</code> (<code>cron.schedule('0 7 * * 1-5', fn, { timezone: 'Asia/Ho_Chi_Minh' })</code>). Bẫy nhiều instance y hệt — PM2 chế độ cluster với 4 tiến trình chạy mỗi cron 4 lần. Các nhóm khi đó chuyển việc hẹn giờ sang repeatable job của BullMQ, lưu lịch trong Redis để mỗi lượt chỉ một worker nhận — cùng ý tưởng với ShedLock. Vì Node đơn luồng, một job đồng bộ chậm còn làm trễ mọi request, không chỉ các job khác. Câu chốt phỏng vấn: "scheduler trong tiến trình chạy một lần cho mỗi instance; cần một khoá dùng chung (ShedLock, Redis, CSDL) hoặc một scheduler duy nhất bên ngoài."</p>

<h3>Ở chỗ làm</h3>
<ul>
  <li>Viết job <strong>idempotent</strong> — chạy hai lần cũng an toàn — vì sớm muộn gì nó cũng bị chạy hai lần (hai instance, chạy lại, ngày đổi giờ). "Từ chối lượt PENDING quá hạn" là idempotent; "gửi nhắc cho mọi người" thì chưa, cho tới khi bạn ghi lại đã nhắc ai.</li>
  <li>Xử lý theo lô nhỏ trong các giao dịch ngắn; job nạp 100.000 dòng trong một giao dịch sẽ khoá tất cả và có thể hết bộ nhớ.</li>
  <li>Với job nặng hoặc hiếm (báo cáo tháng, dọn dữ liệu), nhiều nhóm dùng <code>CronJob</code> của Kubernetes chạy một container riêng, hoặc Quartz với kho job JDBC khi job phải sống sót qua khởi động lại và được quản lý lúc chạy. <code>@Scheduled</code> trong ứng dụng + ShedLock là vừa cỡ cho LabFlow.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"fixedRate khác fixedDelay thế nào?"</strong> — Rate tính từ lúc lượt trước bắt đầu, delay tính từ lúc lượt trước kết thúc. Với một luồng scheduler, các lượt không chồng nhau; job fixedRate chậm sẽ chạy nối đuôi.</li>
  <li><strong>"Vì sao job hẹn giờ thứ hai của tôi không chạy đúng giờ?"</strong> — Scheduler của Boot mặc định có một luồng; job dài chặn các job khác. Đặt <code>spring.task.scheduling.pool.size</code> hoặc chuyển job dài sang executor.</li>
  <li><strong>"Làm sao để job chỉ chạy một lần khi có nhiều instance?"</strong> — Khoá phân tán (ShedLock với bảng trong CSDL/Redis), hoặc thiết kế job giành dòng bằng <code>SELECT … FOR UPDATE SKIP LOCKED</code> để các instance chia việc.</li>
  <li><strong>"lockAtLeastFor chống lại điều gì?"</strong> — Lệch đồng hồ và job quá nhanh: thiếu nó, một instance có thể xong và nhả khoá trước khi lịch của instance kia kích hoạt cho cùng lượt đó.</li>
  <li><strong>"Thử một job phụ thuộc thời gian thế nào?"</strong> — Tiêm <code>Clock</code>; trong test dùng <code>Clock.fixed</code> rồi gọi thẳng phương thức của job, kể cả những ngày biên như 29/02.</li>
</ol>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
  <li>Một job <code>fixedRate = 60000</code> thường mất 10 giây, nhưng có lần mất 150 giây. Các lượt sau bắt đầu khi nào, có lượt nào chạy song song không (một luồng scheduler)?</li>
  <li>Viết cron cho "mỗi 15 phút từ 07:00 tới 21:00, thứ Hai tới thứ Bảy, giờ Việt Nam".</li>
  <li>Job nhắc lịch dùng ShedLock với <code>lockAtMostFor = "PT1M"</code>, nhưng gửi hết lời nhắc mất 3 phút. Chuyện gì có thể xảy ra?</li>
</ol></div>
${giai('Xem đáp án', `<p>1. Các lượt đến hạn trong 150 giây đó không chồng lên nhau; khi lượt dài kết thúc, lượt kế bắt đầu ngay, rồi lịch tiếp tục từ đó. Trên một luồng không gì chạy song song — cái giá là các lượt bị trễ.</p><p>2. <code>@Scheduled(cron = "0 */15 7-20 * * MON-SAT", zone = "Asia/Ho_Chi_Minh")</code> — trường giờ <code>7-20</code> cho 07:00 … 20:45; cần đúng 21:00 thì thêm một biểu thức riêng.</p><p>3. Sau một phút khoá hết hạn trong khi A vẫn đang gửi; tới lượt kích hoạt kế, B giành khoá và bắt đầu gửi những lời nhắc A chưa kịp đánh dấu ⇒ trùng. <code>lockAtMostFor</code> phải dài hơn lượt chạy lâu nhất có thể, và job vẫn nên đánh dấu từng dòng (hoặc dùng SKIP LOCKED) để người chạy thứ hai bỏ qua phần đã xong.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<ul>
  <li><strong>fixedRate / fixedDelay</strong> — chu kỳ tính từ lúc bắt đầu / lúc kết thúc lượt trước.</li>
  <li><strong>Biểu thức cron (Spring)</strong> — sáu trường: giây, phút, giờ, ngày trong tháng, tháng, thứ; <code>zone</code> đặt múi giờ.</li>
  <li><strong>TaskScheduler</strong> — thành phần kích hoạt các phương thức hẹn giờ; mặc định một luồng trong Boot.</li>
  <li><strong>ShedLock</strong> — thư viện chỉ cho một instance chạy mỗi lượt của một job, dùng bảng khoá chung.</li>
  <li><strong>lockAtMostFor / lockAtLeastFor</strong> — hạn an toàn nếu bên giữ khoá chết / thời gian giữ tối thiểu chống lệch đồng hồ.</li>
  <li><strong>SKIP LOCKED</strong> — khoá dòng của PostgreSQL bỏ qua dòng người khác đang khoá; cho nhiều worker chia nhau một bảng việc.</li>
  <li><strong>Job idempotent</strong> — chạy hai lần cho kết quả như chạy một lần.</li>
</ul>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Đã đo: fixedRate với job chậm chạy nối đuôi; fixedDelay nghỉ sau mỗi lượt.</li>
  <li>Mặc định một luồng scheduler: báo cáo 5 giây làm nhịp tim 1 giây thành 5 giây một lần; <code>pool.size=2</code> sửa được. Exception không làm dừng lịch.</li>
  <li>Không có <code>zone</code>, "7 giờ" trong container UTC là 14 giờ ở Việt Nam; cron năm trường hỏng ngay lúc khởi động.</li>
  <li>BR-13 từ chối lượt chưa duyệt khi còn hai giờ, với <code>Clock</code> tiêm vào, ShedLock và <code>SKIP LOCKED</code>.</li>
  <li>Hai instance không bảo vệ gửi 40 email cho 20 lời nhắc; ShedLock 20 từ một instance; SKIP LOCKED 10 + 10.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.spring.io/spring-framework/reference/integration/scheduling.html', '📘', 'Spring Framework — Scheduling', '@Scheduled, cú pháp cron, TaskScheduler')}
${tl('https://github.com/lukas-krecan/ShedLock', '🔒', 'ShedLock', 'các provider, lockAtMostFor / lockAtLeastFor, usingDbTime')}
${tl('https://azure.microsoft.com/en-us/blog/summary-of-windows-azure-service-disruption-on-feb-29th-2012/', '☁️', 'Microsoft — Tóm tắt sự cố Windows Azure ngày 29/02/2012', 'nguyên nhân gốc của ngày nhuận')}

<h3>Nguồn</h3>
<ul>
  <li>Bill Laing, Microsoft, 09/03/2012 — <a href="https://azure.microsoft.com/en-us/blog/summary-of-windows-azure-service-disruption-on-feb-29th-2012/" target="_blank" rel="noopener">Summary of Windows Azure Service Disruption on Feb 29th, 2012</a>.</li>
  <li>Mọi output: LabFlow (Spring Boot 4.1.2, ShedLock 7.12.0) + PostgreSQL 16, một và hai instance, trên máy của khoá học, 25/11/2026.</li>
</ul>
</div>
`;

// ===== Bài 14.3 =====
const MA143_DAT = java("/** 14.3: ghi một lượt đặt rồi phát sự kiện — CÙNG giao dịch. hong=true ⇒ lỗi SAU khi đã phát ⇒ rollback. */\n@Service\n@Profile(\"c14\")\npublic class Dat14Service {\n    private static final Logger log = LoggerFactory.getLogger(Dat14Service.class);\n    private final JdbcClient db; private final ApplicationEventPublisher events;\n    Dat14Service(JdbcClient db, ApplicationEventPublisher events) { this.db = db; this.events = events; }\n\n    @Transactional\n    public long dat(String ten, boolean hong) {\n        long id = db.sql(\"insert into d14_dat (ten) values (?) returning id\").param(ten).query(Long.class).single();\n        events.publishEvent(new DatXong(id, ten));\n        log.info(\"đã phát DatXong({}) — giao dịch CHƯA commit\", id);\n        LichDemo.ngu(300);                           // phần việc còn lại của giao dịch\n        if (hong) throw new IllegalStateException(\"lỗi sau khi phát sự kiện ⇒ rollback lượt \" + id);\n        return id;\n    }\n}");
const MA143_NGHE = java("abstract static class Goc {\n    final JdbcClient db; final EmailGia email;\n    Goc(JdbcClient db, EmailGia email) { this.db = db; this.email = email; }\n    void lam(DatXong e, String kieu) {\n        boolean thay = db.sql(\"select count(*) from d14_dat where id = ?\").param(e.id()).query(Integer.class).single() == 1;\n        log.info(\"[{}] nhận DatXong({}) — thấy dòng trong CSDL: {}\", kieu, e.id(), thay);\n        if (e.ten().startsWith(\"hong-email\")) throw new IllegalStateException(\"SMTP từ chối: 552 hộp thư đầy\");\n        email.gui(\"sv@fpt.edu.vn\", \"Đã giữ chỗ #\" + e.id());\n        db.sql(\"insert into d14_thu (dat_id, kieu, luong) values (?, ?, ?)\").params(e.id(), kieu, Thread.currentThread().getName()).update();\n    }\n}\n\n@Component @Profile(\"c14\") @ConditionalOnProperty(name = \"labflow.d14.nghe\", havingValue = \"dong-bo\")\nstatic class DongBo extends Goc {\n    DongBo(JdbcClient db, EmailGia e) { super(db, e); }\n    @EventListener void nghe(DatXong e) { lam(e, \"dong-bo\"); }\n}\n\n@Component @Profile(\"c14\") @ConditionalOnProperty(name = \"labflow.d14.nghe\", havingValue = \"async-som\")\nstatic class AsyncSom extends Goc {\n    AsyncSom(JdbcClient db, EmailGia e) { super(db, e); }\n    @Async @EventListener public void nghe(DatXong e) { lam(e, \"async-som\"); }\n}\n\n@Component @Profile(\"c14\") @ConditionalOnProperty(name = \"labflow.d14.nghe\", havingValue = \"sau-commit\")\nstatic class SauCommit extends Goc {\n    SauCommit(JdbcClient db, EmailGia e) { super(db, e); }\n    @TransactionalEventListener void nghe(DatXong e) { lam(e, \"sau-commit\"); }\n}\n\n@Component @Profile(\"c14\") @ConditionalOnProperty(name = \"labflow.d14.nghe\", havingValue = \"sau-commit-sai\")\nstatic class SauCommitSai extends Goc {\n    SauCommitSai(JdbcClient db, EmailGia e) { super(db, e); }\n    @Transactional @TransactionalEventListener public void nghe(DatXong e) { lam(e, \"sau-commit-sai\"); }\n}\n\n@Component @Profile(\"c14\") @ConditionalOnProperty(name = \"labflow.d14.nghe\", havingValue = \"sau-commit-moi\")\nstatic class SauCommitMoi extends Goc {\n    SauCommitMoi(JdbcClient db, EmailGia e) { super(db, e); }\n    @Transactional(propagation = Propagation.REQUIRES_NEW) @TransactionalEventListener public void nghe(DatXong e) { lam(e, \"sau-commit-moi\"); }\n}\n\n/** Ghi bằng JPA trong AFTER_COMMIT, không có giao dịch mới: (1) save() một entity mới, (2) sửa một entity đã tải (dirty checking). */\n@Component @Profile(\"c14\") @ConditionalOnProperty(name = \"labflow.d14.nghe\", havingValue = \"sau-commit-jpa\")\nstatic class SauCommitJpa {\n    private final D14ThuRepo thu; private final D14DatRepo dat;\n    SauCommitJpa(D14ThuRepo thu, D14DatRepo dat) { this.thu = thu; this.dat = dat; }\n    @TransactionalEventListener void nghe(DatXong e) {\n        thu.save(new D14Thu(e.id(), \"sau-commit-jpa\", Thread.currentThread().getName()));\n        dat.findById(e.id()).ifPresent(d -> d.doiTen(e.ten() + \"-da-bao\"));\n        log.info(\"[sau-commit-jpa] đã save() d14_thu và đổi tên d14_dat #{} trong bộ nhớ\", e.id());\n    }\n}\n\n/** = @Async + @Transactional(REQUIRES_NEW) + @TransactionalEventListener, và Spring Modulith ghi sổ event_publication. */\n@Component @Profile(\"c14\") @ConditionalOnProperty(name = \"labflow.d14.nghe\", havingValue = \"modulith\")\nstatic class Modulith extends Goc {\n    Modulith(JdbcClient db, EmailGia e) { super(db, e); }\n    @ApplicationModuleListener void nghe(DatXong e) { lam(e, \"modulith\"); }\n}");
const MA143_TB = java("/**\n * Nghe sự kiện của booking SAU KHI giao dịch đặt đã commit, trong giao dịch MỚI, trên luồng khác (@ApplicationModuleListener).\n * Gửi email lỗi/chậm không làm hỏng hay làm chậm lượt đặt. Spring Modulith ghi sự kiện vào event_publication trước ⇒ ứng dụng chết giữa chừng thì gửi lại được.\n */\n@Component\nclass ThongBao {\n    private static final Logger log = LoggerFactory.getLogger(ThongBao.class);\n    private final JdbcClient db;\n    ThongBao(JdbcClient db) { this.db = db; }\n\n    @ApplicationModuleListener\n    void khiDat(BookingCreated e) {\n        String msg = e.status().equals(\"PENDING\")\n            ? \"Lượt đặt #\" + e.bookingId() + \" phòng \" + e.labCode() + \" đang chờ duyệt\"\n            : \"Đã giữ phòng \" + e.labCode() + \" \" + e.startAt() + \" → \" + e.endAt().toLocalTime();\n        ghi(e.ownerId(), e.bookingId(), \"CREATED_\" + e.status(), msg);\n    }\n\n    @ApplicationModuleListener\n    void khiQuyetDinh(BookingDecided e) {\n        String msg = e.status().equals(\"CONFIRMED\") ? \"Lượt đặt #\" + e.bookingId() + \" phòng \" + e.labCode() + \" đã được duyệt\"\n            : \"Lượt đặt #\" + e.bookingId() + \" bị từ chối: \" + e.reason();\n        ghi(e.ownerId(), e.bookingId(), e.status(), msg);\n    }\n    // … ghi(): insert … on conflict do nothing (consumer idempotent) …\n}");
const OUT143A = out("## 1 @EventListener thường: listener chạy NGAY trong publishEvent, cùng luồng, cùng giao dịch\n$ do1 -X POST \"$D14/e/dat?ten=nhom3\"\nHTTP 200 · 2482 ms · đã đặt #1\n\n$ dem\n{\"d14_dat\":1,\"d14_thu\":1,\"sổ sự kiện chưa xong\":0}\n\n## 2 Email hỏng ⇒ lượt đặt cũng mất\n$ do1 -X POST \"$D14/e/dat?ten=hong-email-nhom4\"\nHTTP 500 · 65 ms · {\"detail\":\"lỗi máy chủ, đã ghi lại để kiểm tra\",\"instance\":\"/api/v1/demo14/e/dat\",\"status\":500,\"title\":\"Internal Server Error\",\"type\":\"https://labflow.vn/errors/internal\",\"code\":\"INTERNAL\"}\n$ dem\n{\"d14_dat\":1,\"d14_thu\":1,\"sổ sự kiện chưa xong\":0}\n\n## 3 Email đã gửi, rồi giao dịch rollback\n$ do1 -X POST \"$D14/e/dat?ten=nhom5&hong=true\"\nHTTP 500 · 2320 ms · {\"detail\":\"lỗi máy chủ, đã ghi lại để kiểm tra\",\"instance\":\"/api/v1/demo14/e/dat\",\"status\":500,\"title\":\"Internal Server Error\",\"type\":\"https://labflow.vn/errors/internal\",\"code\":\"INTERNAL\"}\n$ dem\n{\"d14_dat\":1,\"d14_thu\":1,\"sổ sự kiện chưa xong\":0}\n\n$ docker logs labflow | grep -E \"nhận DatXong|email giả|đã phát\" | gon\n13:29:08.999 [nio-8080-exec-1] [dong-bo] nhận DatXong(1) — thấy dòng trong CSDL: true\n13:29:11.000 [nio-8080-exec-1] [email giả] tới sv@fpt.edu.vn: Đã giữ chỗ #1 (luồng http-nio-8080-exec-1)\n13:29:11.002 [nio-8080-exec-1] đã phát DatXong(1) — giao dịch CHƯA commit\n13:29:11.380 [nio-8080-exec-4] [dong-bo] nhận DatXong(2) — thấy dòng trong CSDL: true\n13:29:11.476 [nio-8080-exec-7] [dong-bo] nhận DatXong(3) — thấy dòng trong CSDL: true\n13:29:13.476 [nio-8080-exec-7] [email giả] tới sv@fpt.edu.vn: Đã giữ chỗ #3 (luồng http-nio-8080-exec-7)\n13:29:13.479 [nio-8080-exec-7] đã phát DatXong(3) — giao dịch CHƯA commit");
const OUT143B = out("## 1 @Async @EventListener: listener chạy trên luồng khác — TRƯỚC khi giao dịch commit\n$ do1 -X POST \"$D14/e/dat?ten=nhom3\"\nHTTP 200 · 455 ms · đã đặt #1\n\n$ docker logs labflow | grep -E \"nhận DatXong|email giả|đã phát\" | gon\n13:29:27.715 [nio-8080-exec-1] đã phát DatXong(1) — giao dịch CHƯA commit\n13:29:27.718 [task-1] [async-som] nhận DatXong(1) — thấy dòng trong CSDL: false\n13:29:29.718 [task-1] [email giả] tới sv@fpt.edu.vn: Đã giữ chỗ #1 (luồng task-1)");
const OUT143C = out("## 1 @TransactionalEventListener (AFTER_COMMIT): chỉ gọi khi commit xong\n$ do1 -X POST \"$D14/e/dat?ten=nhom3\"\nHTTP 200 · 2484 ms · đã đặt #1\n\n$ do1 -X POST \"$D14/e/dat?ten=nhom5&hong=true\"\nHTTP 500 · 375 ms · {\"detail\":\"lỗi máy chủ, đã ghi lại để kiểm tra\",\"instance\":\"/api/v1/demo14/e/dat\",\"status\":500,\"title\":\"Internal Server Error\",\"type\":\"https://labflow.vn/errors/internal\",\"code\":\"INTERNAL\"}\n$ dem\n{\"d14_dat\":1,\"d14_thu\":1,\"sổ sự kiện chưa xong\":0}\n\n$ docker logs labflow | grep -E \"nhận DatXong|email giả|đã phát\" | gon\n13:29:44.931 [nio-8080-exec-1] đã phát DatXong(1) — giao dịch CHƯA commit\n13:29:45.247 [nio-8080-exec-1] [sau-commit] nhận DatXong(1) — thấy dòng trong CSDL: true\n13:29:47.248 [nio-8080-exec-1] [email giả] tới sv@fpt.edu.vn: Đã giữ chỗ #1 (luồng http-nio-8080-exec-1)\n13:29:47.307 [nio-8080-exec-2] đã phát DatXong(2) — giao dịch CHƯA commit\n\n## 2 Thêm @Transactional thường lên listener\n$ bash $R app --labflow.d14.nghe=sau-commit-sai | grep -o \"IllegalStateException: .*\" | head -1\nIllegalStateException: @TransactionalEventListener method must not be annotated with @Transactional unless when declared as REQUIRES_NEW or NOT_SUPPORTED: public void vn.labflow.demo14.NgheDemo$SauCommitSai.nghe(vn.labflow.demo14.DatXong)\n\n## 3 @Transactional(propagation = REQUIRES_NEW)\n$ do1 -X POST \"$D14/e/dat?ten=nhom3\"\nHTTP 200 · 2488 ms · đã đặt #1\n\n$ dem\n{\"d14_dat\":1,\"d14_thu\":1,\"sổ sự kiện chưa xong\":0}\n\n## 4 Email hỏng sau commit\n$ do1 -X POST \"$D14/e/dat?ten=hong-email-nhom4\"\nHTTP 200 · 339 ms · đã đặt #2\n\n$ dem\n{\"d14_dat\":2,\"d14_thu\":1,\"sổ sự kiện chưa xong\":1}\n\n$ docker logs labflow | grep -E \"nhận DatXong|email giả|SMTP\" | gon | cut -c1-170\n13:30:14.151 [nio-8080-exec-1] [sau-commit-moi] nhận DatXong(1) — thấy dòng trong CSDL: true\n13:30:16.151 [nio-8080-exec-1] [email giả] tới sv@fpt.edu.vn: Đã giữ chỗ #1 (luồng http-nio-8080-exec-1)\n13:30:16.557 [nio-8080-exec-4] [sau-commit-moi] nhận DatXong(2) — thấy dòng trong CSDL: true\n13:30:16.566 [nio-8080-exec-4] Invocation of listener public void vn.labflow.demo14.NgheDemo$SauCommitMoi.nghe(vn.labflow.demo14.DatXong) failed with message SMTP từ ch\njava.lang.IllegalStateException: SMTP từ chối: 552 hộp thư đầy");
const OUT143D = out("## 1 @ApplicationModuleListener: sau commit, luồng khác, giao dịch mới, có sổ ghi\n$ do1 -X POST \"$D14/e/dat?ten=nhom3\"\nHTTP 200 · 485 ms · đã đặt #1\n\n$ dem\n{\"d14_dat\":1,\"d14_thu\":1,\"sổ sự kiện chưa xong\":0}\n\n$ docker logs labflow | grep -E \"nhận DatXong|email giả\" | gon\n13:30:30.872 [task-1] [modulith] nhận DatXong(1) — thấy dòng trong CSDL: true\n13:30:32.873 [task-1] [email giả] tới sv@fpt.edu.vn: Đã giữ chỗ #1 (luồng task-1)\n\n$ psql -c \"select event_type, publication_date is not null as da_ghi, completion_date is not null as xong from event_publication\"\n        event_type         | da_ghi | xong \n---------------------------+--------+------\n vn.labflow.demo14.DatXong | t      | t\n(1 row)\n\n## 2 Ứng dụng chết khi email đang gửi (8 giây), rồi khởi động lại\n$ do1 -X POST \"$D14/e/dat?ten=nhom4\"\nHTTP 200 · 467 ms · đã đặt #2\n\n$ docker kill labflow >/dev/null; dem 2>/dev/null; psql -c \"select id, event_type, completion_date from event_publication where completion_date is null\"\n                  id                  |        event_type         | completion_date \n--------------------------------------+---------------------------+-----------------\n 270c8ad3-7bb9-42c1-8ca1-71deab9ced19 | vn.labflow.demo14.DatXong | \n(1 row)\n\n$ docker logs labflow | grep -E \"Republish|nhận DatXong|email giả\" | gon | cut -c1-170\n13:30:59.940 [task-1] [modulith] nhận DatXong(2) — thấy dòng trong CSDL: true\n13:31:01.942 [task-1] [email giả] tới sv@fpt.edu.vn: Đã giữ chỗ #2 (luồng task-1)\n\n$ dem\n{\"d14_dat\":2,\"d14_thu\":2,\"sổ sự kiện chưa xong\":0}");
const OUT143E = out("## 1 Ghi bằng repository JPA trong listener AFTER_COMMIT (không REQUIRES_NEW)\n$ do1 -X POST \"$D14/e/dat?ten=nhom3\"\nHTTP 200 · 500 ms · đã đặt #1\n\n$ psql -c \"select (select count(*) from d14_thu) as so_dong_thu, (select ten from d14_dat where id = 1) as ten_dat\"\n so_dong_thu | ten_dat \n-------------+---------\n           0 | nhom3\n(1 row)\n\n$ docker logs labflow | grep -E \"sau-commit-jpa\" | gon\n13:32:12.213 [nio-8080-exec-1] [sau-commit-jpa] đã save() d14_thu và đổi tên d14_dat #1 trong bộ nhớ");

const L143_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.3 · Background work</span>
<h2>Application events and @TransactionalEventListener</h2>
<p class="lead">In LabFlow the booking module does not call the notification module. It publishes an event — <code>BookingCreated</code>, <code>BookingDecided</code> — and whoever cares listens. That keeps modules apart (Chapter 18), but it raises a question nobody asks until production: <em>when</em> does the listener run, and on which side of the commit? We publish the same event under five kinds of listener and measure each one: an email sent for a booking that was rolled back, an email that cancels a booking, a listener that cannot see the row it was told about, a write that silently disappears, and an event that survives a crash.</p>

<h3>Everyday picture first</h3>
<p>You order a laptop online. When should the shop send "your order is confirmed"? If they send it the moment you click — before the bank approves the card — you may get a confirmation for an order that was then cancelled. If the email server is slow and the shop waits for it before charging your card, your checkout hangs. And if they promise to send it "after payment" but the shop's server restarts right after payment, nobody sends it at all. Events in Spring have exactly these three failure modes; the fix is to decide when the listener runs and to keep a record of what still has to be delivered.</p>

<h3>1. Publishing an event</h3>
<p>Any bean can publish any object through <code>ApplicationEventPublisher</code>; listeners are methods annotated with <code>@EventListener</code> (or variants) whose parameter type matches. The measuring service writes one row and publishes inside the same transaction; <code>hong=true</code> throws <em>after</em> publishing, to force a rollback:</p>
${MA143_DAT}
<p>The listener does the same work in each variant — check whether the row is visible, "send" a two-second email, record it in <code>d14_thu</code>:</p>
${MA143_NGHE}

<h3>2. @EventListener: inside your transaction, on your thread</h3>
${OUT143A}
<ul>
  <li>The listener ran <em>inside</em> <code>publishEvent</code>: same thread, same transaction. The request took 2,482 ms — the email became part of booking.</li>
  <li><strong>Email failure cancels the booking</strong>: the listener threw, the exception went up through <code>dat()</code>, the transaction rolled back, 500. <code>d14_dat</code> stayed at 1. A mail server problem now prevents students from booking.</li>
  <li><strong>Ghost email</strong>: with <code>hong=true</code>, booking #3 was rolled back <em>after</em> the email for #3 had been sent. The student holds a confirmation for a booking that does not exist.</li>
</ul>
<p>Synchronous listeners are right for one thing: work that <em>must</em> be in the same transaction and touches only the same database — for example writing an outbox row (lesson 14.4). Never for network calls.</p>

<h3>3. @Async @EventListener: on another thread, too early</h3>
${OUT143B}
<p>The request is fast now (455 ms), but the listener started 3 ms after the event — <strong>before the commit</strong> — and on its own thread it could not see the new row: <code>thấy dòng trong CSDL: false</code>. In real code that is "booking 4721 not found" in the email worker, randomly, depending on timing. And on rollback it would still send.</p>

<h3>4. @TransactionalEventListener: after the commit</h3>
${OUT143C}
<ol>
  <li>Default phase <code>AFTER_COMMIT</code>: the listener ran only after the commit and saw the row. With <code>hong=true</code> the listener was <strong>never called</strong> — no ghost email. But it still runs on the request thread: 2,484 ms.</li>
  <li>Adding a plain <code>@Transactional</code> fails at startup (Spring 6.1+): the outer transaction is already committed, so joining it is meaningless.</li>
  <li><code>@Transactional(propagation = REQUIRES_NEW)</code> gives the listener its own transaction for its own writes.</li>
  <li>An email failure after commit no longer touches the booking: 200, row kept, one ERROR "Invocation of listener … failed". Note <code>sổ sự kiện chưa xong: 1</code>: because Spring Modulith is on the classpath, it recorded this transactional listener's publication in <code>event_publication</code> and left it incomplete — section 6 uses that.</li>
</ol>
<p>The write trap, measured. Many articles say "writes in an AFTER_COMMIT listener are lost". With <code>JdbcClient</code> above, the row <em>was</em> written (<code>d14_thu: 1</code>): after commit Hibernate puts the connection back into auto-commit, so each statement commits on its own — working by accident, with no atomicity between two writes. With JPA the article is right:</p>
${OUT143E}
<p><code>save()</code> of a new entity and a change to a loaded entity — both gone, no error, no log. There is no transaction to flush them. Rule: an <code>AFTER_COMMIT</code> listener that writes anything gets <code>@Transactional(propagation = REQUIRES_NEW)</code>.</p>

<h3>5. Where events live: only in memory</h3>
<p><code>AFTER_COMMIT</code> fixed ghost emails, but opened a new gap: between the commit and the end of the listener, the event exists only in the JVM. If the process dies in that window, the booking is committed and the email is never sent. A synchronous listener also keeps the request waiting. What we want: after commit, on another thread, in a new transaction, <em>and</em> recorded durably until it succeeds.</p>

<h3>6. @ApplicationModuleListener and the event publication registry</h3>
<p>Spring Modulith's <code>@ApplicationModuleListener</code> is exactly <code>@Async</code> + <code>@Transactional(REQUIRES_NEW)</code> + <code>@TransactionalEventListener</code>. With <code>spring-modulith-starter-jdbc</code>, every event for such a listener is first written to the table <code>event_publication</code> <em>in the publisher's transaction</em>, and marked complete when the listener succeeds. LabFlow's notification module already works this way:</p>
${MA143_TB}
${OUT143D}
<ul>
  <li>The request returned in 485 ms; the listener ran on <code>task-1</code> after commit and saw the row; the registry row is marked complete.</li>
  <li>Then we killed the app while the listener was "sending" (8 s email): the booking was committed, the registry row stayed with <code>completion_date</code> empty.</li>
  <li>On restart with <code>spring.modulith.events.republish-outstanding-events-on-restart=true</code> the event was delivered again and completed — <code>d14_thu: 2</code>, nothing lost.</li>
</ul>
<p>Two consequences. First, delivery is <strong>at least once</strong>: if the listener had sent the email and the app died before marking completion, it sends again — so the listener must be idempotent (LabFlow's <code>ThongBao</code> uses <code>on conflict do nothing</code> on <code>(booking_id, kind)</code>). Second, republishing on restart is a blunt tool when several instances restart together; Modulith also gives you <code>IncompleteEventPublications.resubmitIncompletePublicationsOlderThan(…)</code> to call from a scheduled job (lesson 14.2) — with ShedLock.</p>

<h3>Which listener when</h3>
<ul>
  <li><code>@EventListener</code> (sync): same-transaction work on the same database (outbox row, audit row). No I/O.</li>
  <li><code>@TransactionalEventListener</code> + <code>REQUIRES_NEW</code>: quick follow-up that may be lost on crash.</li>
  <li><code>@ApplicationModuleListener</code> + registry: cross-module reactions that must happen (notifications in LabFlow).</li>
  <li>Another system must receive it (email service, another team's app): outbox + message broker, lessons 14.4–14.5.</li>
</ul>

<h3>🕵️ Hacker corner — "confirmed" before it is true</h3>
<p>The ghost email of section 2 is also an attack surface. If a confirmation (email, webhook, ticket QR code) is produced before the transaction commits, an attacker who can make the transaction fail <em>after</em> the event — a deliberately conflicting second booking, an invalid field that is checked last, a request that hits a timeout — keeps a valid-looking confirmation for something that does not exist, then shows it at the lab door. The same pattern appears in payment systems as "goods shipped, payment rolled back". Prevention: produce anything the outside world will trust only after commit; validate everything before you publish; and let the receiver look up the real state (the lab door scanner checks the booking by id, it does not trust the email).</p>

<h3>Compared with Node.js</h3>
<p>Node's <code>EventEmitter</code> is synchronous — <code>emit()</code> calls every listener immediately, like <code>@EventListener</code>; an <code>async</code> listener starts and returns a promise nobody awaits. There is no transaction integration: with Prisma or TypeORM you emit after <code>await prisma.$transaction(...)</code> resolves, by hand, and an emit inside the transaction callback reproduces the ghost email. NestJS's <code>@nestjs/event-emitter</code> adds decorators but still no after-commit phase and no durable registry; teams use an outbox table or BullMQ for that. Interview line: "Spring can bind listeners to transaction phases; in Node you order it yourself."</p>

<h3>At work</h3>
<p>Events are the cheapest way to keep modules decoupled inside one application — booking does not import notification. Keep event classes small and immutable (records of ids and values, not entities), name them in the past tense (<code>BookingDecided</code>), and put them in the publisher's public package. Watch the registry: a growing count of incomplete publications is the first sign a listener is failing (Chapter 15 turns it into a metric).</p>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"Difference between @EventListener and @TransactionalEventListener?"</strong> — The first runs immediately inside the publisher's call and transaction; the second waits for a transaction phase (default AFTER_COMMIT) and is not called at all on rollback.</li>
  <li><strong>"Why did my save() in an AFTER_COMMIT listener do nothing?"</strong> — The transaction is already committed; JPA has nothing to flush into. Use <code>REQUIRES_NEW</code>.</li>
  <li><strong>"What happens to an event if the app crashes after commit?"</strong> — Plain Spring: lost, it was only in memory. With Spring Modulith's registry: it is stored in the same transaction as the business data and redelivered, at least once.</li>
  <li><strong>"Is @Async @EventListener enough to send emails after a booking?"</strong> — No: it may run before commit (did not see the row in the measurement) and runs even on rollback.</li>
  <li><strong>"How do you decouple modules in a monolith?"</strong> — Public events published by the owner module, listeners in other modules, no direct calls into internals; verified by Spring Modulith tests.</li>
</ol>

<h3>🧪 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
  <li>A listener with <code>@TransactionalEventListener(phase = TransactionPhase.AFTER_ROLLBACK)</code> is added. In which of the measured requests does it run?</li>
  <li>You publish an event from a method <em>without</em> <code>@Transactional</code>. Does a default <code>@TransactionalEventListener</code> run?</li>
  <li>The notification listener sends a push message and then inserts a row. Make it safe to deliver twice.</li>
</ol></div>
${giai('Show the answers', `<p>1. Only in the <code>hong=true</code> requests (rollback) — useful for "booking failed" alerts or cleaning up a reservation made in another system.</p><p>2. No: there is no transaction, so there is no commit to wait for; the event is dropped silently. Set <code>@TransactionalEventListener(fallbackExecution = true)</code> if it should run anyway.</p><p>3. Reverse the order and make the insert the guard: <code>insert … on conflict (booking_id, kind) do nothing</code>; if it inserted 0 rows, return without sending. Otherwise send. A redelivery then finds the row and skips the push.</p>`)}

<h3>🗂 Key terms</h3>
<ul>
  <li><strong>ApplicationEventPublisher</strong> — Spring's way to publish an object as an event to all matching listeners.</li>
  <li><strong>@EventListener</strong> — synchronous listener, runs inside the publisher's call and transaction.</li>
  <li><strong>@TransactionalEventListener / TransactionPhase</strong> — listener bound to BEFORE_COMMIT, AFTER_COMMIT (default), AFTER_ROLLBACK or AFTER_COMPLETION.</li>
  <li><strong>@ApplicationModuleListener</strong> — Spring Modulith shortcut: async + new transaction + after commit.</li>
  <li><strong>Event publication registry</strong> — table <code>event_publication</code>; stores each event per listener with the business transaction until completed.</li>
  <li><strong>At-least-once delivery</strong> — an event may be delivered more than once, never zero times; consumers must be idempotent.</li>
</ul>

<h3>📌 Summary</h3>
<ul>
  <li>Sync listener: email inside the booking (2.5 s), an email failure cancelled the booking, a rollback left a ghost email.</li>
  <li><code>@Async @EventListener</code>: ran before commit and could not see the row.</li>
  <li><code>@TransactionalEventListener</code>: no call on rollback; plain <code>@Transactional</code> is refused; JPA writes without <code>REQUIRES_NEW</code> vanished silently.</li>
  <li><code>@ApplicationModuleListener</code> + registry: 485 ms request, listener after commit, and an event interrupted by a crash was redelivered on restart.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.spring.io/spring-framework/reference/data-access/transaction/event.html', '📘', 'Spring Framework — Transaction-bound Events', 'phases, fallbackExecution, transactional listeners')}
${tl('https://docs.spring.io/spring-modulith/reference/events.html', '🧩', 'Spring Modulith — Working with Application Events', '@ApplicationModuleListener, event publication registry, resubmission')}

<h3>Sources</h3>
<ul>
  <li>All outputs: LabFlow (Spring Boot 4.1.2, Hibernate 7, Spring Modulith 2.1.3) + PostgreSQL 16 on the course machine, 25/11/2026.</li>
</ul>
</div>
`;

const L143_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.3 · Việc nền</span>
<h2>Sự kiện ứng dụng và @TransactionalEventListener</h2>
<p class="lead">Trong LabFlow, module booking không gọi module notification. Nó phát một sự kiện — <code>BookingCreated</code>, <code>BookingDecided</code> — và ai quan tâm thì nghe. Cách đó giữ các module tách nhau (Chương 18), nhưng sinh ra một câu hỏi chẳng ai hỏi cho tới khi lên production: listener chạy <em>khi nào</em>, trước hay sau commit? Ta phát cùng một sự kiện dưới năm kiểu listener và đo từng kiểu: một email gửi cho lượt đặt đã bị rollback, một email làm hỏng lượt đặt, một listener không thấy dòng nó được báo, một lệnh ghi lặng lẽ biến mất, và một sự kiện sống sót qua lần sập.</p>

<h3>Đời thường trước đã</h3>
<p>Bạn đặt mua laptop trên mạng. Cửa hàng nên gửi "đơn của bạn đã được xác nhận" lúc nào? Gửi ngay lúc bạn bấm — trước khi ngân hàng duyệt thẻ — thì bạn có thể nhận xác nhận cho một đơn sau đó bị huỷ. Nếu máy chủ email chậm và cửa hàng chờ nó xong mới trừ tiền, trang thanh toán của bạn treo. Còn nếu họ hứa gửi "sau khi thanh toán" nhưng máy chủ cửa hàng khởi động lại ngay sau khi trừ tiền, thì chẳng ai gửi nữa. Sự kiện trong Spring có đúng ba kiểu hỏng đó; cách sửa là quyết định listener chạy lúc nào và giữ sổ ghi những gì còn phải giao.</p>

<h3>1. Phát một sự kiện</h3>
<p>Bean nào cũng phát được bất kỳ đối tượng nào qua <code>ApplicationEventPublisher</code>; listener là phương thức có <code>@EventListener</code> (hoặc biến thể) với kiểu tham số khớp. Service đo ghi một dòng rồi phát sự kiện trong cùng giao dịch; <code>hong=true</code> ném lỗi <em>sau</em> khi đã phát, để ép rollback:</p>
${MA143_DAT}
<p>Listener làm cùng một việc ở mọi biến thể — kiểm xem có thấy dòng không, "gửi" email hai giây, ghi lại vào <code>d14_thu</code>:</p>
${MA143_NGHE}

<h3>2. @EventListener: trong giao dịch của bạn, trên luồng của bạn</h3>
${OUT143A}
<ul>
  <li>Listener chạy <em>bên trong</em> <code>publishEvent</code>: cùng luồng, cùng giao dịch. Request mất 2.482 ms — email đã thành một phần của việc đặt.</li>
  <li><strong>Email hỏng làm hỏng lượt đặt</strong>: listener ném lỗi, lỗi đi ngược qua <code>dat()</code>, giao dịch rollback, 500. <code>d14_dat</code> vẫn là 1. Máy chủ thư trục trặc giờ khiến sinh viên không đặt được phòng.</li>
  <li><strong>Email ma</strong>: với <code>hong=true</code>, lượt #3 bị rollback <em>sau khi</em> email cho #3 đã gửi. Sinh viên cầm xác nhận cho một lượt đặt không tồn tại.</li>
</ul>
<p>Listener đồng bộ chỉ đúng cho một việc: việc <em>bắt buộc</em> nằm trong cùng giao dịch và chỉ đụng cùng CSDL — ví dụ ghi một dòng outbox (bài 14.4). Không bao giờ dùng cho lời gọi mạng.</p>

<h3>3. @Async @EventListener: trên luồng khác, nhưng quá sớm</h3>
${OUT143B}
<p>Request giờ nhanh (455 ms), nhưng listener bắt đầu 3 ms sau sự kiện — <strong>trước commit</strong> — và trên luồng riêng nó không thấy dòng mới: <code>thấy dòng trong CSDL: false</code>. Ngoài đời đó là lỗi "không tìm thấy lượt 4721" ở worker gửi email, lúc có lúc không, tuỳ thời điểm. Và nếu rollback, nó vẫn gửi.</p>

<h3>4. @TransactionalEventListener: sau commit</h3>
${OUT143C}
<ol>
  <li>Pha mặc định <code>AFTER_COMMIT</code>: listener chỉ chạy sau khi commit và thấy dòng. Với <code>hong=true</code>, listener <strong>không bao giờ được gọi</strong> — hết email ma. Nhưng nó vẫn chạy trên luồng request: 2.484 ms.</li>
  <li>Thêm một <code>@Transactional</code> thường thì hỏng ngay lúc khởi động (Spring 6.1 trở đi): giao dịch bên ngoài đã commit rồi, tham gia vào nó là vô nghĩa.</li>
  <li><code>@Transactional(propagation = REQUIRES_NEW)</code> cho listener một giao dịch riêng cho phần ghi của nó.</li>
  <li>Email hỏng sau commit không còn đụng tới lượt đặt: 200, dòng còn nguyên, một dòng ERROR "Invocation of listener … failed". Chú ý <code>sổ sự kiện chưa xong: 1</code>: vì Spring Modulith có trên classpath, nó đã ghi lần phát cho listener giao dịch này vào <code>event_publication</code> và để ở trạng thái chưa xong — mục 6 sẽ dùng điều đó.</li>
</ol>
<p>Bẫy ghi dữ liệu, đo thật. Nhiều bài viết nói "ghi trong listener AFTER_COMMIT sẽ mất". Với <code>JdbcClient</code> ở trên, dòng <em>vẫn</em> được ghi (<code>d14_thu: 1</code>): sau commit, Hibernate trả kết nối về chế độ auto-commit, nên mỗi câu lệnh tự commit — chạy được do may, hai lệnh ghi không còn nguyên tử với nhau. Với JPA thì bài viết nói đúng:</p>
${OUT143E}
<p><code>save()</code> một entity mới và sửa một entity đã tải — cả hai đều mất, không lỗi, không log. Không còn giao dịch nào để flush chúng. Luật: listener <code>AFTER_COMMIT</code> nào có ghi dữ liệu thì phải có <code>@Transactional(propagation = REQUIRES_NEW)</code>.</p>

<h3>5. Sự kiện nằm ở đâu: chỉ trong bộ nhớ</h3>
<p><code>AFTER_COMMIT</code> đã chữa email ma, nhưng mở ra một khe hở mới: từ lúc commit tới lúc listener chạy xong, sự kiện chỉ tồn tại trong JVM. Nếu tiến trình chết trong khoảng đó, lượt đặt đã commit còn email thì không bao giờ được gửi. Listener đồng bộ còn bắt request phải chờ. Điều ta muốn: sau commit, trên luồng khác, trong giao dịch mới, <em>và</em> được ghi lại bền vững cho tới khi thành công.</p>

<h3>6. @ApplicationModuleListener và sổ sự kiện</h3>
<p><code>@ApplicationModuleListener</code> của Spring Modulith chính là <code>@Async</code> + <code>@Transactional(REQUIRES_NEW)</code> + <code>@TransactionalEventListener</code>. Có <code>spring-modulith-starter-jdbc</code>, mỗi sự kiện cho listener kiểu này được ghi trước vào bảng <code>event_publication</code> <em>trong giao dịch của bên phát</em>, và được đánh dấu xong khi listener chạy thành công. Module notification của LabFlow vốn đã làm như vậy:</p>
${MA143_TB}
${OUT143D}
<ul>
  <li>Request trả về sau 485 ms; listener chạy trên <code>task-1</code> sau commit và thấy dòng; dòng trong sổ được đánh dấu xong.</li>
  <li>Rồi ta giết ứng dụng khi listener đang "gửi" (email 8 giây): lượt đặt đã commit, dòng trong sổ còn <code>completion_date</code> trống.</li>
  <li>Khởi động lại với <code>spring.modulith.events.republish-outstanding-events-on-restart=true</code>, sự kiện được giao lại và xong — <code>d14_thu: 2</code>, không mất gì.</li>
</ul>
<p>Hai hệ quả. Thứ nhất, việc giao là <strong>ít nhất một lần</strong>: nếu listener đã gửi email rồi ứng dụng chết trước khi kịp đánh dấu xong, nó sẽ gửi lại — nên listener phải idempotent (<code>ThongBao</code> của LabFlow dùng <code>on conflict do nothing</code> trên <code>(booking_id, kind)</code>). Thứ hai, phát lại lúc khởi động là công cụ thô khi nhiều instance cùng khởi động; Modulith còn có <code>IncompleteEventPublications.resubmitIncompletePublicationsOlderThan(…)</code> để gọi từ một job hẹn giờ (bài 14.2) — kèm ShedLock.</p>

<h3>Listener nào cho việc nào</h3>
<ul>
  <li><code>@EventListener</code> (đồng bộ): việc cùng giao dịch trên cùng CSDL (dòng outbox, dòng kiểm toán). Không I/O.</li>
  <li><code>@TransactionalEventListener</code> + <code>REQUIRES_NEW</code>: việc tiếp theo nhanh, mất khi sập cũng được.</li>
  <li><code>@ApplicationModuleListener</code> + sổ sự kiện: phản ứng giữa các module bắt buộc phải xảy ra (thông báo trong LabFlow).</li>
  <li>Một hệ thống khác phải nhận (dịch vụ email, ứng dụng của nhóm khác): outbox + message broker, bài 14.4–14.5.</li>
</ul>

<h3>🕵️ Góc hacker — "đã xác nhận" trước khi thành sự thật</h3>
<p>Email ma ở mục 2 cũng là một bề mặt tấn công. Nếu một xác nhận (email, webhook, mã QR vào phòng) được tạo ra trước khi giao dịch commit, kẻ tấn công nào làm được giao dịch hỏng <em>sau</em> sự kiện — một lượt đặt thứ hai cố tình xung đột, một trường sai được kiểm sau cùng, một request chạm timeout — sẽ giữ được một xác nhận trông hợp lệ cho thứ không tồn tại, rồi đem ra cửa phòng lab. Hệ thống thanh toán gặp cùng mẫu này dưới dạng "hàng đã giao, tiền bị rollback". Cách phòng: chỉ tạo thứ mà thế giới bên ngoài sẽ tin sau khi commit; kiểm tra mọi thứ trước khi phát sự kiện; và để bên nhận tự tra trạng thái thật (máy quét ở cửa lab tra lượt đặt theo id, không tin email).</p>

<h3>So với Node.js</h3>
<p><code>EventEmitter</code> của Node là đồng bộ — <code>emit()</code> gọi mọi listener ngay, như <code>@EventListener</code>; listener <code>async</code> thì chạy và trả về một promise chẳng ai chờ. Không có tích hợp giao dịch: với Prisma hay TypeORM, bạn tự phát sự kiện sau khi <code>await prisma.$transaction(...)</code> xong, và phát bên trong callback của giao dịch là dựng lại email ma. <code>@nestjs/event-emitter</code> của NestJS thêm decorator nhưng vẫn không có pha sau commit và không có sổ bền; các nhóm dùng bảng outbox hoặc BullMQ cho việc đó. Câu chốt phỏng vấn: "Spring gắn được listener vào các pha của giao dịch; ở Node bạn tự sắp thứ tự."</p>

<h3>Ở chỗ làm</h3>
<p>Sự kiện là cách rẻ nhất để giữ các module tách nhau trong một ứng dụng — booking không import notification. Giữ lớp sự kiện nhỏ và bất biến (record chứa id và giá trị, không chứa entity), đặt tên ở thì quá khứ (<code>BookingDecided</code>), và để trong package công khai của bên phát. Theo dõi sổ sự kiện: số lần phát chưa xong cứ tăng là dấu hiệu đầu tiên một listener đang hỏng (Chương 15 biến nó thành số đo).</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"@EventListener khác @TransactionalEventListener thế nào?"</strong> — Cái đầu chạy ngay trong lời gọi và giao dịch của bên phát; cái sau chờ một pha của giao dịch (mặc định AFTER_COMMIT) và không được gọi khi rollback.</li>
  <li><strong>"Vì sao save() trong listener AFTER_COMMIT của tôi không làm gì?"</strong> — Giao dịch đã commit; JPA không còn chỗ nào để flush vào. Dùng <code>REQUIRES_NEW</code>.</li>
  <li><strong>"Ứng dụng sập sau commit thì sự kiện ra sao?"</strong> — Spring thuần: mất, nó chỉ ở trong bộ nhớ. Có sổ sự kiện của Spring Modulith: nó được lưu cùng giao dịch với dữ liệu nghiệp vụ và được giao lại, ít nhất một lần.</li>
  <li><strong>"@Async @EventListener có đủ để gửi email sau khi đặt không?"</strong> — Không: nó có thể chạy trước commit (phép đo cho thấy không thấy dòng) và vẫn chạy khi rollback.</li>
  <li><strong>"Tách module trong một khối nguyên khối thế nào?"</strong> — Module sở hữu phát sự kiện công khai, module khác nghe, không gọi thẳng vào phần bên trong; kiểm bằng test của Spring Modulith.</li>
</ol>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
  <li>Thêm một listener <code>@TransactionalEventListener(phase = TransactionPhase.AFTER_ROLLBACK)</code>. Nó chạy ở những request nào trong các phép đo?</li>
  <li>Bạn phát sự kiện từ một phương thức <em>không có</em> <code>@Transactional</code>. Một <code>@TransactionalEventListener</code> mặc định có chạy không?</li>
  <li>Listener thông báo gửi một tin đẩy rồi mới chèn một dòng. Sửa cho nó an toàn khi bị giao hai lần.</li>
</ol></div>
${giai('Xem đáp án', `<p>1. Chỉ ở các request <code>hong=true</code> (rollback) — có ích cho cảnh báo "đặt thất bại" hoặc dọn chỗ giữ đã tạo ở hệ thống khác.</p><p>2. Không: không có giao dịch thì không có commit để chờ; sự kiện bị bỏ lặng lẽ. Đặt <code>@TransactionalEventListener(fallbackExecution = true)</code> nếu muốn nó vẫn chạy.</p><p>3. Đảo thứ tự và dùng lệnh chèn làm chốt: <code>insert … on conflict (booking_id, kind) do nothing</code>; nếu chèn 0 dòng thì trả về, không gửi. Ngược lại mới gửi. Lần giao lại sẽ gặp dòng đã có và bỏ qua tin đẩy.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<ul>
  <li><strong>ApplicationEventPublisher</strong> — cách Spring phát một đối tượng làm sự kiện tới mọi listener khớp kiểu.</li>
  <li><strong>@EventListener</strong> — listener đồng bộ, chạy trong lời gọi và giao dịch của bên phát.</li>
  <li><strong>@TransactionalEventListener / TransactionPhase</strong> — listener gắn vào BEFORE_COMMIT, AFTER_COMMIT (mặc định), AFTER_ROLLBACK hoặc AFTER_COMPLETION.</li>
  <li><strong>@ApplicationModuleListener</strong> — lối tắt của Spring Modulith: bất đồng bộ + giao dịch mới + sau commit.</li>
  <li><strong>Sổ sự kiện (event publication registry)</strong> — bảng <code>event_publication</code>; lưu mỗi sự kiện cho từng listener cùng giao dịch nghiệp vụ cho tới khi xong.</li>
  <li><strong>Giao ít nhất một lần (at-least-once)</strong> — sự kiện có thể được giao nhiều lần, không bao giờ bằng không; bên nhận phải idempotent.</li>
</ul>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Listener đồng bộ: email nằm trong việc đặt (2,5 giây), email hỏng làm huỷ lượt đặt, rollback để lại email ma.</li>
  <li><code>@Async @EventListener</code>: chạy trước commit và không thấy dòng.</li>
  <li><code>@TransactionalEventListener</code>: không được gọi khi rollback; <code>@Transactional</code> thường bị từ chối; ghi bằng JPA không có <code>REQUIRES_NEW</code> biến mất lặng lẽ.</li>
  <li><code>@ApplicationModuleListener</code> + sổ sự kiện: request 485 ms, listener chạy sau commit, và sự kiện bị lần sập cắt ngang được giao lại khi khởi động.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.spring.io/spring-framework/reference/data-access/transaction/event.html', '📘', 'Spring Framework — Transaction-bound Events', 'các pha, fallbackExecution, listener theo giao dịch')}
${tl('https://docs.spring.io/spring-modulith/reference/events.html', '🧩', 'Spring Modulith — Working with Application Events', '@ApplicationModuleListener, sổ sự kiện, gửi lại')}

<h3>Nguồn</h3>
<ul>
  <li>Mọi output: LabFlow (Spring Boot 4.1.2, Hibernate 7, Spring Modulith 2.1.3) + PostgreSQL 16 trên máy của khoá học, 25/11/2026.</li>
</ul>
</div>
`;

// ===== Bài 14.4 =====
const MA144_GHI = java("/** 14.4: ghi CSDL + gửi tin trong cùng một phương thức (sai), hoặc ghi outbox cùng giao dịch (đúng). */\n@Component @Profile(\"c14\") @ConditionalOnProperty(name = \"labflow.d14.rabbit\", havingValue = \"true\")\nstatic class DatGuiService {\n    private final JdbcClient db; private final RabbitTemplate rabbit;\n    DatGuiService(JdbcClient db, RabbitTemplate rabbit) { this.db = db; this.rabbit = rabbit; }\n\n    @Transactional\n    public long ghiHaiNoi(String ten, boolean hong) {\n        long id = db.sql(\"insert into d14_dat (ten) values (?) returning id\").param(ten).query(Long.class).single();\n        rabbit.convertAndSend(\"d14\", \"dat.tao\", new TinDat(UUID.randomUUID().toString(), id, ten));\n        log.info(\"đã gửi tin cho #{} — giao dịch CHƯA commit\", id);\n        LichDemo.ngu(300);                           // phần việc còn lại của giao dịch\n        if (hong) throw new IllegalStateException(\"lỗi sau khi gửi tin ⇒ rollback lượt \" + id);\n        return id;\n    }\n\n    @Transactional\n    public long ghiOutbox(String ten) {\n        long id = db.sql(\"insert into d14_dat (ten) values (?) returning id\").param(ten).query(Long.class).single();\n        String payload = JSON.writeValueAsString(new TinDat(UUID.randomUUID().toString(), id, ten));\n        db.sql(\"insert into d14_outbox (loai, payload) values ('dat.tao', ?::jsonb)\").param(payload).update();\n        return id;\n    }\n}");
const MA144_RELAY = java("/** Relay của outbox: mỗi 500 ms lấy dòng chưa gửi, đẩy sang RabbitMQ, chờ broker xác nhận, đánh dấu đã gửi. */\n@Component @Profile(\"c14\") @ConditionalOnProperty(name = \"labflow.d14.relay\", havingValue = \"true\")\nstatic class Relay {\n    private final JdbcClient db; private final RabbitTemplate rabbit; private final TransactionTemplate tx;\n    private final boolean khoa, chetSauGui; private final String inst;\n    Relay(JdbcClient db, RabbitTemplate rabbit, TransactionTemplate tx, @Value(\"${labflow.d14.relay-khoa:true}\") boolean khoa,\n          @Value(\"${labflow.d14.relay-chet:false}\") boolean chetSauGui, @Value(\"${labflow.instance}\") String inst) {\n        this.db = db; this.rabbit = rabbit; this.tx = tx; this.khoa = khoa; this.chetSauGui = chetSauGui; this.inst = inst;\n    }\n    record Dong(long id, String loai, String payload) { }\n\n    @Scheduled(fixedDelay = 500)\n    void day() {\n        Integer n = tx.execute(s -> {\n            List<Dong> ds = db.sql(\"select id, loai, payload::text from d14_outbox where sent_at is null order by id limit 50\"\n                + (khoa ? \" for update skip locked\" : \"\")).query(Dong.class).list();\n            for (Dong d : ds) {\n                rabbit.invoke(t -> {\n                    t.convertAndSend(\"d14\", d.loai(), JSON.readValue(d.payload(), TinDat.class));\n                    t.waitForConfirmsOrDie(5000);                 // broker đã nhận và ghi xuống hàng bền\n                    return null;\n                });\n                if (chetSauGui) { log.warn(\"relay CHẾT ngay sau khi gửi outbox #{} (chưa kịp đánh dấu)\", d.id()); Runtime.getRuntime().halt(137); }\n                db.sql(\"update d14_outbox set sent_at = now() where id = ?\").param(d.id()).update();\n            }\n            return ds.size();\n        });\n        if (n != null && n > 0) log.info(\"relay {} đã đẩy {} tin\", inst, n);\n    }\n}");
const MA144_NHAN = java("/** Bên nhận: ghi d14_nhan cho mỗi lần xử lý; labflow.d14.nhan-idem=true ⇒ chặn tin đã xử lý. */\n@Component @Profile(\"c14\") @ConditionalOnProperty(name = \"labflow.d14.nhan\", havingValue = \"true\")\nstatic class Nhan {\n    final AtomicInteger giao = new AtomicInteger();\n    private final JdbcClient db; private final boolean idem; private final String inst; private final long chamMs;\n    Nhan(JdbcClient db, @Value(\"${labflow.d14.nhan-idem:false}\") boolean idem, @Value(\"${labflow.instance}\") String inst,\n         @Value(\"${labflow.d14.cham-ms:100}\") long chamMs) {\n        this.db = db; this.idem = idem; this.inst = inst; this.chamMs = chamMs;\n    }\n\n    @RabbitListener(queues = \"d14.dat\")\n    @Transactional\n    public void nhan(TinDat t, @Header(AmqpHeaders.REDELIVERED) boolean giaoLai) {\n        int lan = giao.incrementAndGet();\n        if (idem && db.sql(\"insert into d14_da_xu_ly (msg_id) values (?) on conflict do nothing\").param(t.msgId()).update() == 0) {\n            log.info(\"bỏ qua tin {} (đã xử lý) — giao lại: {}\", t.msgId().substring(0, 8), giaoLai);\n            return;\n        }\n        if (t.ten().startsWith(\"doc\")) {\n            log.warn(\"lần giao {}: tin {} hỏng, ném lỗi (giao lại: {})\", lan, t.ten(), giaoLai);\n            throw new IllegalArgumentException(\"không đọc được tin \" + t.ten());\n        }\n        if (t.ten().startsWith(\"cham\")) LichDemo.ngu(5000);\n        boolean co = db.sql(\"select count(*) from d14_dat where id = ?\").param(t.datId()).query(Integer.class).single() == 1;\n        db.sql(\"insert into d14_nhan (msg_id, dat_id, co_trong_db, instance) values (?, ?, ?, ?)\").params(t.msgId(), t.datId(), co, inst).update();\n        log.info(\"xử lý tin {} lượt #{} — CSDL có lượt này: {} (giao lại: {})\", t.msgId().substring(0, 8), t.datId(), co, giaoLai);\n    }\n    // … listener cho hàng d14.cham và d14.java (bài 14.5) …\n}");
const MA144_SQL = sql("-- outbox: ghi CÙNG giao dịch với d14_dat; relay đọc rồi đẩy sang RabbitMQ\ncreate table d14_outbox (\n  id         bigint generated by default as identity primary key,\n  loai       varchar(40) not null,\n  payload    jsonb       not null,\n  created_at timestamptz not null default now(),\n  sent_at    timestamptz\n);\ncreate index d14_outbox_chua_gui on d14_outbox (id) where sent_at is null;\n-- phía nhận: d14_nhan ghi mọi lần xử lý; d14_da_xu_ly chặn xử lý lại cùng một tin (consumer idempotent)\ncreate table d14_da_xu_ly (msg_id varchar(60) primary key, at timestamptz not null default now());");
const OUT144A = out("## 1 Ghi CSDL rồi gửi tin ngay trong phương thức @Transactional\n$ do1 -X POST \"$D14/o/thang?ten=nhom3\"\nHTTP 200 · 457 ms · đã đặt #1\n\n$ demo\n{\"d14_dat\":1,\"outbox chưa gửi\":0,\"nhận (lần xử lý)\":1,\"nhận (tin khác nhau)\":1,\"nhận mà CSDL không có lượt\":1,\"số lần giao\":1,\"d14.dat\":0,\"d14.dat.dlq\":0,\"d14.cham\":0}\n\n## 2 Gửi tin xong thì giao dịch lỗi\n$ do1 -X POST \"$D14/o/thang?ten=nhom5&hong=true\"\nHTTP 500 · 386 ms · {\"detail\":\"lỗi máy chủ, đã ghi lại để kiểm tra\",\"instance\":\"/api/v1/demo14/o/thang\",\"status\":500,\"title\":\"Internal Server Error\",\"type\":\"https://labflow.vn/errors/internal\",\"code\":\"INTERNAL\"}\n$ demo\n{\"d14_dat\":1,\"outbox chưa gửi\":0,\"nhận (lần xử lý)\":2,\"nhận (tin khác nhau)\":2,\"nhận mà CSDL không có lượt\":2,\"số lần giao\":2,\"d14.dat\":0,\"d14.dat.dlq\":0,\"d14.cham\":0}\n\n$ docker logs labflow | grep -E \"đã gửi tin|xử lý tin\" | gon\n13:37:00.117 [nio-8080-exec-1] đã gửi tin cho #1 — giao dịch CHƯA commit\n13:37:00.141 [ntContainer#1-1] xử lý tin e230e2be lượt #1 — CSDL có lượt này: false (giao lại: false)\n13:37:01.498 [nio-8080-exec-4] đã gửi tin cho #2 — giao dịch CHƯA commit\n13:37:01.503 [ntContainer#1-1] xử lý tin 13eef2f1 lượt #2 — CSDL có lượt này: false (giao lại: false)\n\n## 3 RabbitMQ dừng: ghi hai nơi vs outbox\n$ docker stop rabbitmq >/dev/null\n\n$ do1 -X POST \"$D14/o/thang?ten=nhom6\"\nHTTP 500 · 29 ms · {\"detail\":\"lỗi máy chủ, đã ghi lại để kiểm tra\",\"instance\":\"/api/v1/demo14/o/thang\",\"status\":500,\"title\":\"Internal Server Error\",\"type\":\"https://labflow.vn/errors/internal\",\"code\":\"INTERNAL\"}\n$ do1 -X POST \"$D14/o/outbox?ten=nhom7\"\nHTTP 200 · 18 ms · đã đặt #4\n\n$ psql -c \"select id, payload->>'ten' as ten, sent_at from d14_outbox\"\n id |  ten  | sent_at \n----+-------+---------\n  1 | nhom7 | \n(1 row)\n\n## 4 RabbitMQ chạy lại\n$ docker start rabbitmq >/dev/null\n\n$ demo\n{\"d14_dat\":2,\"outbox chưa gửi\":0,\"nhận (lần xử lý)\":3,\"nhận (tin khác nhau)\":3,\"nhận mà CSDL không có lượt\":2,\"số lần giao\":3,\"d14.dat\":0,\"d14.dat.dlq\":0,\"d14.cham\":0}\n\n$ docker logs labflow | grep -E \"relay|xử lý tin\" | gon | tail -2\n13:37:08.751 [ntContainer#1-3] xử lý tin 6df80a37 lượt #4 — CSDL có lượt này: true (giao lại: false)\n13:37:08.759 [scheduling-1] relay A đã đẩy 1 tin");
const OUT144A_CONFIRM = out("## (lần chạy đầu, thiếu spring.rabbitmq.publisher-confirm-type)\n## 4 RabbitMQ chạy lại\n$ docker start rabbitmq >/dev/null\n\n$ demo\n{\"d14_dat\":2,\"outbox chưa gửi\":1,\"nhận (lần xử lý)\":126,\"nhận (tin khác nhau)\":3,\"nhận mà CSDL không có lượt\":2,\"số lần giao\":126,\"d14.dat\":0,\"d14.dat.dlq\":0,\"d14.cham\":0}\n\n$ docker logs labflow | grep -E \"relay|xử lý tin\" | gon | tail -2\n13:34:47.965 [ntContainer#1-3] xử lý tin 2d9e8b70 lượt #4 — CSDL có lượt này: true (giao lại: false)\n13:34:48.474 [ntContainer#1-3] xử lý tin 2d9e8b70 lượt #4 — CSDL có lượt này: true (giao lại: false)\n$ docker logs labflow | grep -m1 -B2 'Confirms not selected' | gon\n13:33:45.994 [ntContainer#1-2] Restarting Consumer@5699a65d: tags=[[]], channel=null, acknowledgeMode=AUTO local queue size=0\n13:33:46.111 [scheduling-1] Unexpected error occurred in scheduled task\njava.lang.IllegalStateException: Confirms not selected");
const OUT144B = out("## 1 Hai instance cùng chạy relay, FOR UPDATE SKIP LOCKED; 200 lượt đặt\n$ curl -s -X POST \"$D14/o/loat?n=200\"\nđã đặt 200\n\n$ demo\n{\"d14_dat\":200,\"outbox chưa gửi\":0,\"nhận (lần xử lý)\":200,\"nhận (tin khác nhau)\":200,\"nhận mà CSDL không có lượt\":0,\"số lần giao\":200,\"d14.dat\":0,\"d14.dat.dlq\":0,\"d14.cham\":0}\n\n$ (docker logs labflow; docker logs labflow-b) | grep -E \"relay . đã đẩy\" | gon | awk '{s[$4]+=$7; l[$4]++} END {for (k in s) print \"relay\", k, \"đẩy\", s[k], \"tin trong\", l[k], \"lượt\"}' | sort\nrelay A đẩy 105 tin trong 3 lượt\nrelay B đẩy 95 tin trong 2 lượt\n\n## 2 Bỏ khoá: relay chỉ \"select … where sent_at is null\" — ba lượt, mỗi lượt 200 lượt đặt\n$ for lan in 1 2 3; do curl -s -X POST \"$D14/o/loat?n=200\" >/dev/null; for i in $(seq 60); do psql -c \"select count(*) from d14_outbox where sent_at is null\" | grep -q \"^ *0$\" && break; sleep 1; done; sleep 2; echo \"lượt $lan: $(demo | jq -c '{dat: .d14_dat, xuLy: .\"nhận (lần xử lý)\", tinKhacNhau: .\"nhận (tin khác nhau)\"}')\"; done\nlượt 1: {\"dat\":200,\"xuLy\":200,\"tinKhacNhau\":200}\nlượt 2: {\"dat\":400,\"xuLy\":597,\"tinKhacNhau\":400}\nlượt 3: {\"dat\":600,\"xuLy\":947,\"tinKhacNhau\":600}");
const OUT144C = out("## 1 Relay chết ngay sau khi gửi, trước khi đánh dấu sent_at\n$ curl -s -X POST \"$D14/o/outbox?ten=nhom3\"\nđã đặt #1\n\n$ docker logs labflow | grep -E \"CHẾT\" | gon\n13:39:04.354 [scheduling-1] relay CHẾT ngay sau khi gửi outbox #1 (chưa kịp đánh dấu)\n\n$ docker inspect labflow --format 'ExitCode={{.State.ExitCode}}'\nExitCode=137\n\n$ psql -c \"select id, sent_at from d14_outbox\"\n id | sent_at \n----+---------\n  1 | \n(1 row)\n\n$ rabbitmqctl list_queues name messages | grep \"d14.dat\\b\"\nd14.dat.dlq\t0\nd14.dat\t1\n\n## 2 Khởi động lại, bên nhận KHÔNG chống trùng\n$ demo\n{\"d14_dat\":1,\"outbox chưa gửi\":0,\"nhận (lần xử lý)\":2,\"nhận (tin khác nhau)\":1,\"nhận mà CSDL không có lượt\":0,\"số lần giao\":2,\"d14.dat\":0,\"d14.dat.dlq\":0,\"d14.cham\":0}\n\n$ docker logs labflow | grep -E \"xử lý tin|bỏ qua|relay\" | gon\n13:39:20.808 [ntContainer#1-1] xử lý tin efd252a5 lượt #1 — CSDL có lượt này: true (giao lại: false)\n13:39:20.832 [scheduling-1] relay A đã đẩy 1 tin\n13:39:20.832 [ntContainer#1-1] xử lý tin efd252a5 lượt #1 — CSDL có lượt này: true (giao lại: false)\n\n## 3 Làm lại, bên nhận chống trùng bằng bảng d14_da_xu_ly\n$ demo\n{\"d14_dat\":1,\"outbox chưa gửi\":0,\"nhận (lần xử lý)\":1,\"nhận (tin khác nhau)\":1,\"nhận mà CSDL không có lượt\":0,\"số lần giao\":2,\"d14.dat\":0,\"d14.dat.dlq\":0,\"d14.cham\":0}\n\n$ docker logs labflow | grep -E \"xử lý tin|bỏ qua|relay\" | gon\n13:40:10.521 [ntContainer#1-1] xử lý tin a46f4497 lượt #1 — CSDL có lượt này: true (giao lại: false)\n13:40:10.574 [scheduling-1] relay A đã đẩy 1 tin\n13:40:10.575 [ntContainer#1-1] bỏ qua tin a46f4497 (đã xử lý) — giao lại: false");

const L144_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.4 · Background work</span>
<h2>The transactional outbox</h2>
<p class="lead">Sooner or later LabFlow has to tell <em>another system</em> that something happened: the university's email service, a mobile push service, the analytics team. That means writing to our database <strong>and</strong> sending a message to a broker. Two systems, no shared transaction — this is the <em>dual-write problem</em>. We measure the obvious way failing three times (a message that arrives before the data, a message for a booking that never existed, a broker outage that cancels bookings), then build the fix used everywhere in industry: write the message into an <strong>outbox table</strong> in the same transaction, and let a relay deliver it. Then we break the relay on purpose: two relays, a forgotten setting, a crash between "sent" and "marked as sent".</p>

<h3>Everyday picture first</h3>
<p>A school office approves your request and must also post a letter to your parents. The careless clerk writes the letter first, drops it in the post box, then goes to file the approval — and the director refuses it. The letter is already gone. The careful clerk files the approval and, <em>in the same folder</em>, puts a copy of the letter in the tray marked "to post". Each afternoon someone empties the tray to the post office and stamps each copy "posted". If the post office is closed, the letters wait in the tray. If the person forgets to stamp one, it gets posted twice — so the parents' side must recognise a letter it already read. That tray is the outbox.</p>

<h3>1. Writing to the database and the broker in one method</h3>
${MA144_GHI}
<p><code>ghiHaiNoi</code> is what most people write first: insert, then <code>rabbit.convertAndSend</code>, all inside <code>@Transactional</code>. The consumer (section 4) checks whether the booking exists when it receives the message:</p>
${OUT144A}
<ol>
  <li><strong>The message overtakes the data.</strong> Booking #1 succeeded, but the consumer received the message 22 ms after it was sent, while the transaction was still open — <code>CSDL có lượt này: false</code>. RabbitMQ does not wait for your commit.</li>
  <li><strong>A message for nothing.</strong> Booking #2 was rolled back after sending. The message was already in RabbitMQ: the consumer processed a booking that does not exist (<code>nhận mà CSDL không có lượt: 2</code>).</li>
  <li><strong>The broker decides whether you can book.</strong> With RabbitMQ stopped, <code>ghiHaiNoi</code> failed in 29 ms with 500 and the booking was rolled back. The outbox version answered 200 in 18 ms; the message waited in <code>d14_outbox</code> with <code>sent_at</code> empty.</li>
  <li>When RabbitMQ came back, the relay delivered the waiting row within a second: <code>outbox chưa gửi: 0</code>, the consumer saw booking #4 in the database.</li>
</ol>
<p>Moving the send to after the commit (<code>@TransactionalEventListener</code>, lesson 14.3) fixes 1 and 2 but not 3: if the broker is down at that moment, or the app dies right after commit, the message is lost and nobody retries. Lab 14's trap version does exactly that and fails the "broker down" check.</p>

<h3>2. The outbox pattern</h3>
<ol>
  <li>In the business transaction, insert the message into an <strong>outbox table</strong> (same database ⇒ same transaction ⇒ both or neither).</li>
  <li>A <strong>relay</strong> reads unsent rows, publishes them, waits until the broker confirms, then marks them sent.</li>
  <li>Consumers are <strong>idempotent</strong>, because the relay guarantees "at least once", not "exactly once".</li>
</ol>
${MA144_SQL}
${MA144_RELAY}
<p>Details that matter, each one measured below: <code>for update skip locked</code> so several relays can run; <code>waitForConfirmsOrDie</code> so "sent" means the broker accepted it (needs <code>spring.rabbitmq.publisher-confirm-type=simple</code>); <code>fixedDelay</code> so a slow batch is not started twice; the partial index <code>where sent_at is null</code> so the query stays fast when the table holds millions of sent rows (delete them with a nightly job).</p>

<h3>3. Breaking the relay</h3>
<p><strong>A forgotten setting.</strong> The first run of this lesson did not set <code>publisher-confirm-type</code>. The relay published, then <code>waitForConfirmsOrDie</code> threw "Confirms not selected", the transaction rolled back, the row stayed unsent — and 500 ms later the same message was published again:</p>
${OUT144A_CONFIRM}
<p>One booking, 126 deliveries in about a minute. Nothing crashed, the log had one error line every half second. This is "at least once" in its rawest form, and the reason the next two experiments exist.</p>
<p><strong>Two relays.</strong> LabFlow runs two instances, so two relays poll the same table:</p>
${OUT144B}
<ol>
  <li>With <code>skip locked</code>: 200 bookings, exactly 200 messages; A sent 100, B sent 100 — each row was locked by one relay and skipped by the other.</li>
  <li>Without the lock: three rounds of 200 gave 0, then 197, then 150 duplicates. The first round was clean only by timing luck — a test that runs once would have said "works".</li>
</ol>
<p><strong>A crash between sending and marking.</strong> We halt the JVM right after the broker confirmed outbox row #1, before the <code>update … set sent_at</code>:</p>
${MA144_NHAN}
${OUT144C}
<ol>
  <li>After the crash: exit code 137, the outbox row still unsent, one message in the queue.</li>
  <li>On restart, the consumer took the message from the queue and the relay sent the row again: the same message id (<code>efd252a5</code>) was processed twice.</li>
  <li>With the consumer recording processed ids in <code>d14_da_xu_ly</code> (primary key, <code>on conflict do nothing</code>), the second copy was skipped: <code>bỏ qua tin … (đã xử lý)</code>. The insert and the work are in the same transaction, so "recorded but not done" cannot happen.</li>
</ol>
<p>That is the complete contract: <strong>outbox + confirmed publish + idempotent consumer = effectively once</strong>. No broker gives you true exactly-once delivery to a database across a network.</p>

<h3>4. Other ways to do the same</h3>
<ul>
  <li><strong>Spring Modulith event externalization</strong>: annotate an event with <code>@Externalized("labflow.booking::booking.decided")</code> and add <code>spring-modulith-events-amqp</code>; the event publication registry of lesson 14.3 then acts as the outbox. Less code, same guarantees, same need for idempotent consumers.</li>
  <li><strong>Change data capture</strong> (Debezium): instead of polling, read the database's write-ahead log and stream outbox inserts to Kafka. Lower latency, more infrastructure — common at large companies.</li>
  <li><strong>Polling interval</strong>: 500 ms is a fine default for notifications; it is the price of not depending on the broker at request time.</li>
</ul>

<h3>🕵️ Hacker corner — replays and ghost messages</h3>
<p>The outbox makes duplicates normal, so the consumer's idempotency check is also a security control. If an attacker obtains broker credentials (they live in configuration files — Chapter 17), they can re-publish an old "booking approved" or "payment received" message. A consumer that trusts the message body and has no "already processed" check will act twice — approve twice, refund twice, send a QR code twice. And the ghost message of section 1 is the same bug from the inside: the outside world trusted a message about a transaction that never committed. Prevention: unique event ids checked in the same transaction as the effect; consumers that re-read authoritative state (the booking by id) instead of trusting the payload; separate broker users for publishing and consuming, each with only the permissions it needs (lesson 14.5).</p>

<h3>Compared with Node.js</h3>
<p>The dual-write problem does not care about the language. In Node the same shape appears as <code>await prisma.booking.create(...); await channel.publish(...)</code> — with the same three failures. The fix is the same outbox table, written with <code>prisma.$transaction([...])</code> and drained by a worker (often a BullMQ repeatable job). Some Node teams publish to BullMQ <em>instead of</em> an outbox, but Redis and PostgreSQL are still two systems — that is a dual write again. Interview line: "the outbox is a database pattern, not a framework feature".</p>

<h3>At work</h3>
<p>When a system design interview or a code review mentions "save and then publish", the expected answer is: what happens if the process dies between the two lines? Name the outbox, at-least-once delivery and idempotent consumers. In LabFlow (Lab 14) the decision event writes an outbox row through a synchronous listener in the same transaction; a relay with <code>SKIP LOCKED</code> publishes to RabbitMQ; the email worker deduplicates by event id.</p>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"What is the dual-write problem?"</strong> — Updating a database and publishing a message are two separate operations; any failure between them leaves the systems inconsistent (lost message or message about nothing).</li>
  <li><strong>"Explain the transactional outbox."</strong> — Write the message to a table in the business transaction; a relay publishes and marks rows; delivery is at least once.</li>
  <li><strong>"How do you run the relay on several instances?"</strong> — Claim rows with <code>FOR UPDATE SKIP LOCKED</code> (or a single active relay with a lock); measured: without it 150–197 duplicates per 200.</li>
  <li><strong>"Can you get exactly-once?"</strong> — Not across a network; you get at-least-once plus an idempotent consumer (processed-id table or natural unique key) in the same transaction as the effect.</li>
  <li><strong>"Outbox vs CDC?"</strong> — Polling is simple and needs only the database; CDC reads the log, has lower latency and load, but needs Debezium/Kafka infrastructure.</li>
</ol>

<h3>🧪 Practice (35 minutes)</h3>
<div class="callout ok"><ol>
  <li>The relay marks a row sent <em>before</em> publishing it ("to avoid duplicates"). What can go wrong?</li>
  <li>Messages for the same booking must be processed in order (created ⇒ decided). With two relays and <code>SKIP LOCKED</code>, can they be published out of order? How would you prevent it?</li>
  <li>The outbox table grew to 50 million sent rows and the relay query slowed down. What two things do you change?</li>
</ol></div>
${giai('Show the answers', `<p>1. A crash after marking and before publishing loses the message forever — you traded duplicates (harmless with an idempotent consumer) for loss (not recoverable). Always publish, wait for the confirm, then mark.</p><p>2. Yes: relay A can lock the "created" row while relay B, skipping it, publishes "decided" first. Options: one active relay (ShedLock) with <code>order by id</code>; or partition by booking id (each relay handles <code>booking_id % 2 = n</code>); and make consumers tolerate order (ignore a "created" that arrives after "decided" by comparing versions).</p><p>3. A partial index on unsent rows (<code>where sent_at is null</code>), and a scheduled clean-up that deletes sent rows older than a few days in small batches.</p>`)}

<h3>🗂 Key terms</h3>
<ul>
  <li><strong>Dual write</strong> — updating two systems without a shared transaction.</li>
  <li><strong>Transactional outbox</strong> — messages stored in a table of the same database, in the same transaction as the data.</li>
  <li><strong>Relay / message dispatcher</strong> — the process that reads the outbox, publishes, and marks rows sent.</li>
  <li><strong>Publisher confirm</strong> — the broker's acknowledgement that it has taken responsibility for a message.</li>
  <li><strong>Idempotent consumer</strong> — processes each message id at most once, usually with a unique key in the same transaction.</li>
  <li><strong>Change data capture (CDC)</strong> — streaming database changes from the transaction log (e.g. Debezium).</li>
</ul>

<h3>📌 Summary</h3>
<ul>
  <li>Sending inside the transaction: the message arrived before the commit, a rolled-back booking still produced a message, and a stopped broker turned bookings into 500s.</li>
  <li>Outbox: 200 in 18 ms with the broker down, delivered when it came back.</li>
  <li>A missing <code>publisher-confirm-type</code> made the relay re-send one message 126 times.</li>
  <li>Two relays: <code>SKIP LOCKED</code> 0 duplicates; without it 0 / 197 / 150 across three rounds.</li>
  <li>Crash between publish and mark ⇒ duplicate delivery; a processed-id table in the consumer's transaction made it harmless.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://microservices.io/patterns/data/transactional-outbox.html', '📐', 'microservices.io — Transactional outbox', 'the pattern, polling publisher vs transaction log tailing')}
${tl('https://docs.spring.io/spring-modulith/reference/events.html#externalization', '🧩', 'Spring Modulith — Externalizing Events', '@Externalized, AMQP/Kafka adapters')}
${tl('https://docs.spring.io/spring-amqp/reference/amqp/template.html#template-confirms', '🐇', 'Spring AMQP — Publisher Confirms and Returns', 'simple vs correlated confirms, waitForConfirmsOrDie')}

<h3>Sources</h3>
<ul>
  <li>All outputs: LabFlow (Spring Boot 4.1.2, Spring AMQP 4.1.2) + PostgreSQL 16 + RabbitMQ 4, one and two instances, on the course machine, 25/11/2026.</li>
</ul>
</div>
`;

const L144_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.4 · Việc nền</span>
<h2>Mẫu transactional outbox</h2>
<p class="lead">Sớm muộn gì LabFlow cũng phải báo cho <em>một hệ thống khác</em> rằng có chuyện vừa xảy ra: dịch vụ email của trường, dịch vụ đẩy tin di động, nhóm phân tích dữ liệu. Nghĩa là phải ghi vào CSDL của mình <strong>và</strong> gửi một tin cho broker. Hai hệ thống, không chung giao dịch — đó là <em>bài toán ghi hai nơi</em> (dual write). Ta đo cách làm hiển nhiên hỏng ba lần (tin đến trước dữ liệu, tin cho một lượt đặt chưa từng tồn tại, broker chết làm huỷ lượt đặt), rồi dựng cách sửa mà ngành nào cũng dùng: ghi tin vào một <strong>bảng outbox</strong> trong cùng giao dịch, và để một relay đem đi giao. Sau đó cố tình làm hỏng relay: hai relay, một dòng cấu hình bị quên, một lần sập giữa "đã gửi" và "đã đánh dấu".</p>

<h3>Đời thường trước đã</h3>
<p>Phòng giáo vụ duyệt đơn của bạn và còn phải gửi thư cho phụ huynh. Cô văn thư cẩu thả viết thư trước, bỏ vào thùng thư, rồi mới đi lưu hồ sơ duyệt — và thầy hiệu trưởng không ký. Thư thì đã đi mất. Cô văn thư cẩn thận lưu hồ sơ duyệt và, <em>trong cùng tập hồ sơ</em>, đặt bản sao bức thư vào khay "chờ gửi". Chiều nào cũng có người đem khay ra bưu điện và đóng dấu "đã gửi" lên từng bản. Bưu điện đóng cửa thì thư nằm chờ trong khay. Người đó quên đóng dấu một bản thì bản ấy bị gửi hai lần — nên phía phụ huynh phải nhận ra bức thư đã đọc rồi. Cái khay đó là outbox.</p>

<h3>1. Ghi CSDL và gửi broker trong một phương thức</h3>
${MA144_GHI}
<p><code>ghiHaiNoi</code> là cách hầu hết mọi người viết đầu tiên: chèn, rồi <code>rabbit.convertAndSend</code>, tất cả trong <code>@Transactional</code>. Bên nhận (mục 4) kiểm xem lượt đặt có tồn tại không khi nhận tin:</p>
${OUT144A}
<ol>
  <li><strong>Tin chạy trước dữ liệu.</strong> Lượt #1 thành công, nhưng bên nhận nhận tin 22 ms sau khi gửi, lúc giao dịch còn mở — <code>CSDL có lượt này: false</code>. RabbitMQ không chờ bạn commit.</li>
  <li><strong>Tin cho một thứ không có.</strong> Lượt #2 bị rollback sau khi đã gửi. Tin đã nằm trong RabbitMQ: bên nhận xử lý một lượt đặt không tồn tại (<code>nhận mà CSDL không có lượt: 2</code>).</li>
  <li><strong>Broker quyết định bạn có đặt được hay không.</strong> RabbitMQ dừng, <code>ghiHaiNoi</code> hỏng sau 29 ms với 500 và lượt đặt bị rollback. Bản outbox trả 200 sau 18 ms; tin nằm chờ trong <code>d14_outbox</code> với <code>sent_at</code> trống.</li>
  <li>RabbitMQ chạy lại, relay giao dòng đang chờ trong chưa đầy một giây: <code>outbox chưa gửi: 0</code>, bên nhận thấy lượt #4 trong CSDL.</li>
</ol>
<p>Dời việc gửi ra sau commit (<code>@TransactionalEventListener</code>, bài 14.3) chữa được 1 và 2 nhưng không chữa được 3: broker chết đúng lúc đó, hoặc ứng dụng chết ngay sau commit, là tin mất và không ai gửi lại. Bản bẫy của Lab 14 làm đúng như vậy và trượt mục "broker dừng".</p>

<h3>2. Mẫu outbox</h3>
<ol>
  <li>Trong giao dịch nghiệp vụ, chèn tin vào một <strong>bảng outbox</strong> (cùng CSDL ⇒ cùng giao dịch ⇒ cùng được hoặc cùng không).</li>
  <li>Một <strong>relay</strong> đọc các dòng chưa gửi, đẩy đi, chờ broker xác nhận, rồi đánh dấu đã gửi.</li>
  <li>Bên nhận phải <strong>idempotent</strong>, vì relay chỉ bảo đảm "ít nhất một lần", không phải "đúng một lần".</li>
</ol>
${MA144_SQL}
${MA144_RELAY}
<p>Những chi tiết quan trọng, chi tiết nào cũng được đo ở dưới: <code>for update skip locked</code> để chạy được nhiều relay; <code>waitForConfirmsOrDie</code> để "đã gửi" nghĩa là broker đã nhận (cần <code>spring.rabbitmq.publisher-confirm-type=simple</code>); <code>fixedDelay</code> để một lô chậm không bị chạy chồng; index một phần <code>where sent_at is null</code> để truy vấn vẫn nhanh khi bảng chứa hàng triệu dòng đã gửi (xoá chúng bằng một job ban đêm).</p>

<h3>3. Làm hỏng relay</h3>
<p><strong>Một dòng cấu hình bị quên.</strong> Lần chạy đầu của bài này chưa đặt <code>publisher-confirm-type</code>. Relay đẩy tin đi, rồi <code>waitForConfirmsOrDie</code> ném "Confirms not selected", giao dịch rollback, dòng vẫn chưa gửi — và 500 ms sau chính tin đó lại được đẩy đi:</p>
${OUT144A_CONFIRM}
<p>Một lượt đặt, 126 lần giao trong khoảng một phút. Chẳng có gì sập, log chỉ có một dòng lỗi mỗi nửa giây. Đó là "ít nhất một lần" ở dạng trần trụi nhất, và là lý do hai thí nghiệm tiếp theo tồn tại.</p>
<p><strong>Hai relay.</strong> LabFlow chạy hai instance, nên hai relay cùng quét một bảng:</p>
${OUT144B}
<ol>
  <li>Có <code>skip locked</code>: 200 lượt đặt, đúng 200 tin; A gửi 100, B gửi 100 — mỗi dòng bị một relay khoá và relay kia bỏ qua.</li>
  <li>Bỏ khoá: ba lượt 200 cho ra 0, rồi 197, rồi 150 bản trùng. Lượt đầu sạch chỉ vì may về thời điểm — một phép thử chạy một lần sẽ kết luận "chạy tốt".</li>
</ol>
<p><strong>Sập giữa lúc gửi và lúc đánh dấu.</strong> Ta dừng JVM ngay sau khi broker xác nhận dòng outbox #1, trước câu <code>update … set sent_at</code>:</p>
${MA144_NHAN}
${OUT144C}
<ol>
  <li>Sau khi sập: mã thoát 137, dòng outbox vẫn chưa gửi, một tin nằm trong hàng.</li>
  <li>Khởi động lại, bên nhận lấy tin trong hàng còn relay gửi lại dòng đó: cùng một mã tin (<code>efd252a5</code>) bị xử lý hai lần.</li>
  <li>Khi bên nhận ghi mã tin đã xử lý vào <code>d14_da_xu_ly</code> (khoá chính, <code>on conflict do nothing</code>), bản thứ hai bị bỏ qua: <code>bỏ qua tin … (đã xử lý)</code>. Lệnh chèn và phần việc nằm trong cùng giao dịch, nên không thể có chuyện "đã ghi nhận mà chưa làm".</li>
</ol>
<p>Đó là trọn bộ hợp đồng: <strong>outbox + gửi có xác nhận + bên nhận idempotent = coi như đúng một lần</strong>. Không broker nào cho bạn giao đúng một lần thật sự vào CSDL qua mạng.</p>

<h3>4. Những cách khác làm cùng việc</h3>
<ul>
  <li><strong>Đưa sự kiện ra ngoài bằng Spring Modulith</strong>: gắn <code>@Externalized("labflow.booking::booking.decided")</code> lên sự kiện và thêm <code>spring-modulith-events-amqp</code>; sổ sự kiện của bài 14.3 khi đó đóng vai outbox. Ít mã hơn, bảo đảm như nhau, bên nhận vẫn phải idempotent.</li>
  <li><strong>Change data capture</strong> (Debezium): thay vì quét định kỳ, đọc nhật ký ghi trước (WAL) của CSDL và đẩy các lần chèn outbox sang Kafka. Độ trễ thấp hơn, hạ tầng nhiều hơn — phổ biến ở công ty lớn.</li>
  <li><strong>Chu kỳ quét</strong>: 500 ms là mặc định ổn cho thông báo; đó là cái giá để không phụ thuộc broker lúc xử lý request.</li>
</ul>

<h3>🕵️ Góc hacker — phát lại tin và tin ma</h3>
<p>Outbox khiến tin trùng thành chuyện bình thường, nên phần kiểm idempotent ở bên nhận cũng là một chốt bảo mật. Nếu kẻ tấn công lấy được tài khoản broker (chúng nằm trong tệp cấu hình — Chương 17), họ có thể phát lại một tin "lượt đặt đã duyệt" hay "đã nhận thanh toán" cũ. Bên nhận tin vào thân tin và không kiểm "đã xử lý chưa" sẽ hành động hai lần — duyệt hai lần, hoàn tiền hai lần, gửi mã QR hai lần. Còn tin ma ở mục 1 là cùng lỗi đó nhìn từ bên trong: thế giới bên ngoài đã tin một tin nhắn về giao dịch chưa từng commit. Cách phòng: mã sự kiện duy nhất, kiểm trong cùng giao dịch với tác động; bên nhận tra lại trạng thái gốc (lượt đặt theo id) thay vì tin thân tin; tài khoản broker riêng cho phía gửi và phía nhận, mỗi bên chỉ có đúng quyền cần thiết (bài 14.5).</p>

<h3>So với Node.js</h3>
<p>Bài toán ghi hai nơi không quan tâm ngôn ngữ. Ở Node nó hiện ra dưới dạng <code>await prisma.booking.create(...); await channel.publish(...)</code> — cùng ba kiểu hỏng. Cách sửa vẫn là bảng outbox, ghi bằng <code>prisma.$transaction([...])</code> và được một worker dọn (thường là một repeatable job của BullMQ). Có nhóm Node đẩy vào BullMQ <em>thay cho</em> outbox, nhưng Redis và PostgreSQL vẫn là hai hệ thống — lại là ghi hai nơi. Câu chốt phỏng vấn: "outbox là một mẫu của CSDL, không phải tính năng của framework".</p>

<h3>Ở chỗ làm</h3>
<p>Khi buổi phỏng vấn thiết kế hệ thống hay buổi review mã nhắc tới "lưu rồi phát tin", câu trả lời được chờ đợi là: nếu tiến trình chết giữa hai dòng đó thì sao? Hãy gọi tên outbox, giao ít nhất một lần và bên nhận idempotent. Trong LabFlow (Lab 14), sự kiện quyết định ghi một dòng outbox qua listener đồng bộ trong cùng giao dịch; relay có <code>SKIP LOCKED</code> đẩy sang RabbitMQ; worker email chống trùng theo mã sự kiện.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Bài toán dual write là gì?"</strong> — Cập nhật CSDL và phát tin là hai thao tác tách rời; hỏng ở giữa là hai hệ thống lệch nhau (mất tin hoặc tin về thứ không có).</li>
  <li><strong>"Giải thích transactional outbox."</strong> — Ghi tin vào một bảng trong giao dịch nghiệp vụ; relay đẩy đi rồi đánh dấu; việc giao là ít nhất một lần.</li>
  <li><strong>"Chạy relay trên nhiều instance thế nào?"</strong> — Giành dòng bằng <code>FOR UPDATE SKIP LOCKED</code> (hoặc chỉ một relay hoạt động nhờ khoá); đã đo: thiếu nó là 150–197 bản trùng mỗi 200 tin.</li>
  <li><strong>"Có đạt được exactly-once không?"</strong> — Không, khi qua mạng; bạn có at-least-once cộng bên nhận idempotent (bảng mã đã xử lý hoặc khoá duy nhất tự nhiên) trong cùng giao dịch với tác động.</li>
  <li><strong>"Outbox hay CDC?"</strong> — Quét định kỳ đơn giản, chỉ cần CSDL; CDC đọc nhật ký, độ trễ và tải thấp hơn, nhưng cần hạ tầng Debezium/Kafka.</li>
</ol>

<h3>🧪 Thực hành (35 phút)</h3>
<div class="callout ok"><ol>
  <li>Relay đánh dấu một dòng đã gửi <em>trước</em> khi đẩy nó đi ("để khỏi trùng"). Điều gì có thể hỏng?</li>
  <li>Các tin của cùng một lượt đặt phải được xử lý theo thứ tự (tạo ⇒ quyết định). Với hai relay và <code>SKIP LOCKED</code>, chúng có thể bị đẩy sai thứ tự không? Ngăn thế nào?</li>
  <li>Bảng outbox phình tới 50 triệu dòng đã gửi và truy vấn của relay chậm đi. Bạn đổi hai thứ gì?</li>
</ol></div>
${giai('Xem đáp án', `<p>1. Sập sau khi đánh dấu và trước khi đẩy là mất tin vĩnh viễn — bạn đổi bản trùng (vô hại với bên nhận idempotent) lấy mất tin (không cứu được). Luôn đẩy đi, chờ xác nhận, rồi mới đánh dấu.</p><p>2. Có: relay A có thể khoá dòng "tạo" trong khi relay B bỏ qua nó và đẩy "quyết định" trước. Cách làm: chỉ một relay hoạt động (ShedLock) với <code>order by id</code>; hoặc chia theo mã lượt đặt (mỗi relay lo <code>booking_id % 2 = n</code>); và cho bên nhận chịu được sai thứ tự (bỏ qua "tạo" tới sau "quyết định" bằng cách so phiên bản).</p><p>3. Index một phần cho các dòng chưa gửi (<code>where sent_at is null</code>), và một job dọn định kỳ xoá các dòng đã gửi quá vài ngày theo lô nhỏ.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<ul>
  <li><strong>Dual write (ghi hai nơi)</strong> — cập nhật hai hệ thống mà không có giao dịch chung.</li>
  <li><strong>Transactional outbox</strong> — tin nhắn được lưu vào một bảng của cùng CSDL, trong cùng giao dịch với dữ liệu.</li>
  <li><strong>Relay / bộ phát tin</strong> — tiến trình đọc outbox, đẩy tin đi và đánh dấu dòng đã gửi.</li>
  <li><strong>Publisher confirm</strong> — xác nhận của broker rằng nó đã nhận trách nhiệm giữ một tin.</li>
  <li><strong>Bên nhận idempotent</strong> — xử lý mỗi mã tin tối đa một lần, thường nhờ khoá duy nhất trong cùng giao dịch.</li>
  <li><strong>Change data capture (CDC)</strong> — đẩy các thay đổi của CSDL ra ngoài từ nhật ký giao dịch (ví dụ Debezium).</li>
</ul>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Gửi trong giao dịch: tin tới trước commit, lượt đặt bị rollback vẫn sinh tin, và broker dừng biến lượt đặt thành lỗi 500.</li>
  <li>Outbox: 200 sau 18 ms khi broker dừng, được giao khi broker chạy lại.</li>
  <li>Thiếu <code>publisher-confirm-type</code> khiến relay gửi lại một tin 126 lần.</li>
  <li>Hai relay: <code>SKIP LOCKED</code> 0 bản trùng; bỏ khoá thì 0 / 197 / 150 qua ba lượt.</li>
  <li>Sập giữa lúc đẩy và lúc đánh dấu ⇒ giao trùng; bảng mã đã xử lý trong giao dịch của bên nhận làm nó vô hại.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://microservices.io/patterns/data/transactional-outbox.html', '📐', 'microservices.io — Transactional outbox', 'mẫu thiết kế, quét định kỳ hay đọc nhật ký giao dịch')}
${tl('https://docs.spring.io/spring-modulith/reference/events.html#externalization', '🧩', 'Spring Modulith — Externalizing Events', '@Externalized, bộ chuyển cho AMQP/Kafka')}
${tl('https://docs.spring.io/spring-amqp/reference/amqp/template.html#template-confirms', '🐇', 'Spring AMQP — Publisher Confirms and Returns', 'xác nhận simple hay correlated, waitForConfirmsOrDie')}

<h3>Nguồn</h3>
<ul>
  <li>Mọi output: LabFlow (Spring Boot 4.1.2, Spring AMQP 4.1.2) + PostgreSQL 16 + RabbitMQ 4, một và hai instance, trên máy của khoá học, 25/11/2026.</li>
</ul>
</div>
`;

// ===== Bài 14.5 =====
const MA145_CFG = java("/**\n * 14.4–14.5: exchange \"d14\" (topic) ⇒ hàng \"d14.dat\"; tin bị từ chối hẳn ⇒ exchange \"d14.dlx\" ⇒ hàng \"d14.dat.dlq\".\n * Tin là JSON (JacksonJsonMessageConverter) — KHÔNG dùng tuần tự hoá Java.\n */\n@Configuration\n@Profile(\"c14\")\n@ConditionalOnProperty(name = \"labflow.d14.rabbit\", havingValue = \"true\")\nclass RabbitCauHinh {\n    @Bean\n    Declarables d14() {\n        TopicExchange ex = new TopicExchange(\"d14\");\n        DirectExchange dlx = new DirectExchange(\"d14.dlx\");\n        Queue q = QueueBuilder.durable(\"d14.dat\").deadLetterExchange(\"d14.dlx\").deadLetterRoutingKey(\"dat\").build();\n        Queue dlq = QueueBuilder.durable(\"d14.dat.dlq\").build();\n        Queue cham = QueueBuilder.durable(\"d14.cham\").build();\n        Queue javaQ = QueueBuilder.durable(\"d14.java\").build();\n        return new Declarables(ex, dlx, q, dlq, cham, javaQ,\n            BindingBuilder.bind(q).to(ex).with(\"dat.*\"),\n            BindingBuilder.bind(dlq).to(dlx).with(\"dat\"),\n            BindingBuilder.bind(cham).to(ex).with(\"cham\"));\n    }\n\n    @Bean\n    MessageConverter jsonConverter() { return new JacksonJsonMessageConverter(); }\n\n    /** Một factory riêng dùng bộ chuyển đổi mặc định cũ (tuần tự hoá Java) — chỉ để đo CVE-2023-34050. */\n    @Bean\n    SimpleRabbitListenerContainerFactory javaFactory(ConnectionFactory cf) {\n        SimpleRabbitListenerContainerFactory f = new SimpleRabbitListenerContainerFactory();\n        f.setConnectionFactory(cf);\n        f.setMessageConverter(new SimpleMessageConverter());\n        f.setDefaultRequeueRejected(false);\n        return f;\n    }\n}");
const OUT145A = out("## 1 Tin độc, cấu hình mặc định (lỗi ⇒ trả về hàng ⇒ giao lại)\n$ curl -s -X POST \"$D14/o/gui?ten=doc-1\"\nđã gửi 1\n\n$ demo | jq -c '{giao: .\"số lần giao\", \"d14.dat\", \"d14.dat.dlq\"}'\n{\"giao\":2802,\"d14.dat\":0,\"d14.dat.dlq\":0}\n\n$ docker logs labflow | grep -cE \"hỏng, ném lỗi\"\n2841\n\n$ docker logs labflow | grep -E \"hỏng, ném lỗi\" | gon | tail -2\n13:44:55.377 [ntContainer#1-1] lần giao 3397: tin doc-1 hỏng, ném lỗi (giao lại: true)\n13:44:55.380 [ntContainer#1-1] lần giao 3398: tin doc-1 hỏng, ném lỗi (giao lại: true)\n\n## 2 Bật retry theo hướng dẫn cũ (Boot 3): max-attempts=3, cách 0,5 s, nhân đôi; hết lượt ⇒ từ chối hẳn ⇒ dead-letter\n$ curl -s -X POST \"$D14/o/gui?ten=doc-2\"\nđã gửi 1\n\n$ curl -s -X POST \"$D14/o/gui?ten=nhom3\"\nđã gửi 1\n\n$ demo | jq -c '{giao: .\"số lần giao\", \"d14.dat\", \"d14.dat.dlq\"}'\n{\"giao\":5,\"d14.dat\":0,\"d14.dat.dlq\":1}\n\n$ docker logs labflow | grep -E \"hỏng, ném lỗi|Retries exhausted|xử lý tin\" | gon | cut -c1-140\n13:45:15.636 [ntContainer#1-1] lần giao 1: tin doc-2 hỏng, ném lỗi (giao lại: false)\n13:45:16.142 [ntContainer#1-1] lần giao 2: tin doc-2 hỏng, ném lỗi (giao lại: false)\n13:45:17.144 [ntContainer#1-1] lần giao 3: tin doc-2 hỏng, ném lỗi (giao lại: false)\n13:45:19.147 [ntContainer#1-1] lần giao 4: tin doc-2 hỏng, ném lỗi (giao lại: false)\n13:45:19.157 [ntContainer#1-1] Retries exhausted for message (Body:'[B@31dc99dd(byte[72])' MessageProperties [headers={__TypeId__=vn.labflow\n13:45:19.175 [ntContainer#1-1] xử lý tin 704a742d lượt #0 — CSDL có lượt này: false (giao lại: false)\n\n$ curl -s -u labflow:$MAT_KHAU_MQ -H \"$J\" -d '{\"count\":1,\"ackmode\":\"ack_requeue_true\",\"encoding\":\"auto\"}' $MQ/queues/%2F/d14.dat.dlq/get | jq '.[0] | {payload, reason: .properties.headers[\"x-death\"][0].reason, queue: .properties.headers[\"x-death\"][0].queue, loi: .properties.headers[\"x-exception-message\"]}'\n{\n  \"payload\": \"{\\\"msgId\\\":\\\"ba21a020-ca48-43ae-a8ed-92858f2b81e3\\\",\\\"datId\\\":0,\\\"ten\\\":\\\"doc-2\\\"}\",\n  \"reason\": \"rejected\",\n  \"queue\": \"d14.dat\",\n  \"loi\": null\n}\n\n## 3 Tên mới của Boot 4: max-retries=2 (1 lần đầu + 2 lần thử lại)\n$ curl -s -X POST \"$D14/o/gui?ten=doc-3\"\nđã gửi 1\n\n$ demo | jq -c '{giao: .\"số lần giao\", \"d14.dat\", \"d14.dat.dlq\"}'\n{\"giao\":3,\"d14.dat\":0,\"d14.dat.dlq\":1}\n\n$ docker logs labflow | grep -E \"hỏng, ném lỗi\" | gon | cut -c1-140\n13:45:38.966 [ntContainer#1-1] lần giao 1: tin doc-3 hỏng, ném lỗi (giao lại: false)\n13:45:39.476 [ntContainer#1-1] lần giao 2: tin doc-3 hỏng, ném lỗi (giao lại: false)\n13:45:40.480 [ntContainer#1-1] lần giao 3: tin doc-3 hỏng, ném lỗi (giao lại: false)");
const OUT145B = out("## 1 100 tin, mỗi tin xử lý 100 ms — một consumer\n$ curl -s -X POST \"$D14/o/gui?ten=c&key=cham&n=100\"\nđã gửi 100\n\n$ curl -s $D14/q/cham\n{\"ms\":10134,\"daXuLy\":100}\n## 2 concurrency = 5, tin tới khi consumer đã chạy\n$ curl -s -X POST \"$D14/o/gui?ten=c&key=cham&n=100\"\nđã gửi 100\n\n$ curl -s $D14/q/cham\n{\"ms\":2026,\"daXuLy\":100}\n## 3 concurrency = 5, nhưng 100 tin đã nằm sẵn trong hàng lúc ứng dụng khởi động (prefetch mặc định 250)\n$ curl -s $D14/q/cham\n{\"daXuLy\":100,\"ms\":10136}\n## 4 Như trên, prefetch = 1\n$ curl -s $D14/q/cham\n{\"ms\":2058,\"daXuLy\":100}");
const OUT145C = out("## 1 Consumer đang xử lý (5 giây) thì ứng dụng bị giết\n$ curl -s -X POST \"$D14/o/gui?ten=cham-nhom4\"\nđã gửi 1\n\n$ rabbitmqctl list_queues name messages_ready messages_unacknowledged | grep -P \"^d14.dat\\t\"\nd14.dat\t0\t1\n\n$ docker kill labflow >/dev/null; sleep 1; rabbitmqctl list_queues name messages_ready messages_unacknowledged | grep -P \"^d14.dat\\t\"\nd14.dat\t1\t0\n\n$ docker logs labflow | grep -E \"xử lý tin\" | gon\n14:11:43.459 [ntContainer#1-1] xử lý tin 1cbed5d5 lượt #0 — CSDL có lượt này: false (giao lại: true)\n\n## 2 Kẻ có quyền ghi vào hàng gửi một đối tượng Java tuần tự hoá\n$ curl -s -X POST \"$D14/o/java\"\nđã gửi application/x-java-serialized-object\n\n$ docker logs labflow | grep -E \"GIẢI TUẦN TỰ|unauthorized|not allowed|deserializ|Execution of Rabbit\" | gon | cut -c1-200 | head -4\n14:11:46.004 [ntContainer#0-1] Execution of Rabbit message listener failed.\nCaused by: java.lang.SecurityException: Attempt to deserialize unauthorized class vn.labflow.demo14.Outbox14$GoiJava; add allowed class name patterns to the message converter or, if you trust the mess\n\n## 3 Tài khoản guest/guest mặc định\n$ rabbitmqctl list_users\nuser\ttags\nlabflow\t[administrator]\n\n$ curl -s -o /dev/null -w \"guest: HTTP %{http_code}\\n\" -u \"guest:$MAT_KHAU_GUEST\" $MQ/overview\nguest: HTTP 401");

const L145_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.5 · Background work</span>
<h2>Message queues with RabbitMQ</h2>
<p class="lead">The outbox of lesson 14.4 hands messages to a broker. This lesson is about the broker side: how RabbitMQ routes a message to a queue, how a Spring consumer receives it, and what happens when the consumer fails. We measure a single bad message delivered 4,471 times in five seconds, a retry setting from Boot 3 tutorials that Boot 4 silently ignores, a prefetch default that made five consumers as slow as one, a message that survives a consumer crash, and a Java-serialized message that Spring AMQP refuses to open.</p>

<h3>Everyday picture first</h3>
<p>A post office sorting room. Letters arrive at a counter (<strong>exchange</strong>), and a sorting rule (<strong>binding</strong> with a <strong>routing key</strong>) puts each one into a pigeonhole (<strong>queue</strong>). Postmen (<strong>consumers</strong>) take letters from their pigeonhole and sign for each one they delivered (<strong>ack</strong>). A letter with an unreadable address goes back into the pigeonhole — and if nobody ever does anything else, the same postman picks it up again forever. A sensible office tries three times, then moves it to a "problem letters" shelf (<strong>dead-letter queue</strong>). And if one postman grabs every letter in the pigeonhole before leaving, the other four stand there with nothing to do (<strong>prefetch</strong>).</p>

<h3>1. Exchange, queue, binding</h3>
<ul>
  <li>A producer never writes to a queue directly; it publishes to an <strong>exchange</strong> with a routing key.</li>
  <li><strong>direct</strong>: key must match exactly; <strong>topic</strong>: patterns with <code>*</code> (one word) and <code>#</code> (zero or more); <strong>fanout</strong>: every bound queue gets a copy.</li>
  <li>A <strong>durable</strong> queue survives a broker restart; a <strong>persistent</strong> message (delivery mode 2, Spring's default) is written to disk. You need both to survive a restart.</li>
  <li>Since RabbitMQ 4, <strong>quorum queues</strong> (replicated on several nodes) are the recommended type for important data; classic queues are fine on a single node like ours.</li>
</ul>
<p>The topology of this chapter, declared as Spring beans (Spring AMQP creates them when it first connects):</p>
${MA145_CFG}
<p>Messages are JSON (<code>JacksonJsonMessageConverter</code>, Jackson 3 in Spring AMQP 4). The consumer is the <code>Nhan</code> class from lesson 14.4: <code>@RabbitListener(queues = "d14.dat")</code>, with a message name starting with <code>doc</code> ("poison") made to throw.</p>

<h3>2. Poison messages and the dead-letter queue</h3>
${OUT145A}
<ol>
  <li><strong>Default settings.</strong> The listener throws, Spring rejects the message <em>with requeue</em>, RabbitMQ delivers it again immediately — 4,471 deliveries in about five seconds, one CPU core busy, the log growing by thousands of stack traces. Messages behind it in the queue wait.</li>
  <li><strong>Retry from a Boot 3 tutorial</strong>: <code>retry.max-attempts=3</code>. We got 4 attempts (0.5 s, 1 s, 2 s apart), then the message went to <code>d14.dat.dlq</code> with <code>x-death</code> reason <code>rejected</code>. Why 4? In Boot 4.1.2 the property <code>max-attempts</code> no longer exists — its metadata says <em>replaced by</em> <code>retry.max-retries</code> (default 3 retries = 4 attempts). The old name was ignored without a warning; the default happened to look similar.</li>
  <li><strong>Boot 4 name</strong>: <code>retry.max-retries=2</code> ⇒ exactly 3 attempts, then the DLQ.</li>
</ol>
${props(`spring.rabbitmq.listener.simple.retry.enabled=true
spring.rabbitmq.listener.simple.retry.max-retries=3          # Boot 4 (Boot 3: max-attempts=4)
spring.rabbitmq.listener.simple.retry.initial-interval=500ms
spring.rabbitmq.listener.simple.retry.multiplier=2
# after the last retry Spring rejects WITHOUT requeue ⇒ the queue's dead-letter exchange receives it`)}
<p>Two more facts from the same output. The good message <code>nhom3</code>, published right after <code>doc-2</code>, waited 3.5 s: this retry is <em>stateless</em> and sleeps on the consumer thread, blocking everything behind it. And a dead-lettered message keeps its body and headers, so you can inspect it in the management UI, fix the cause, and move it back — the DLQ is a to-do list, not a bin. Errors that can never succeed (invalid JSON, a missing field) should skip retries: Spring treats <code>MessageConversionException</code> as fatal and dead-letters it at once (Lab 14 checks this).</p>

<h3>3. Throughput: concurrency and prefetch</h3>
${OUT145B}
<ol>
  <li>One consumer, 100 messages × 100 ms ⇒ 10.1 s.</li>
  <li><code>concurrency=5</code>, messages arriving while the consumers run ⇒ 2.0 s: RabbitMQ round-robins deliveries across 5 consumers.</li>
  <li><code>concurrency=5</code>, but 100 messages already waiting when the app started ⇒ <strong>10.1 s again</strong>. The first consumer to connect received up to <code>prefetch</code> (default 250) unacknowledged messages — all 100 — and the other four had nothing.</li>
  <li>Same situation with <code>prefetch=1</code> ⇒ 2.1 s. Lower prefetch = fairer distribution, slightly more network round trips. For slow messages use a small prefetch (1–10); for tiny fast messages a larger one.</li>
</ol>

<h3>4. Acknowledgement: what survives a crash</h3>
${OUT145C}
<ol>
  <li>While the consumer was working (5 s message) the message was <em>unacknowledged</em> (<code>0 1</code>): delivered but not done. Spring's default ack mode <code>AUTO</code> acks only after the listener method returns.</li>
  <li>We killed the app: RabbitMQ saw the connection close and put the message back (<code>1 0</code>). On restart it was delivered again with <code>giao lại: true</code> (the <code>redelivered</code> flag). Nothing lost — and anything the first attempt did before the crash (an email already sent?) happens twice unless the consumer is idempotent (lesson 14.4).</li>
  <li><strong>Security</strong>: a message with content type <code>application/x-java-serialized-object</code> was refused: "Attempt to deserialize unauthorized class". See the hacker corner.</li>
  <li>The default <code>guest</code> account does not exist on our broker (we created <code>labflow</code> via environment variables), and even when it exists RabbitMQ only lets <code>guest</code> log in from localhost.</li>
</ol>

<h3>🕵️ Hacker corner — CVE-2023-34050, deserialization in Spring AMQP</h3>
<p>Java serialization turns bytes into objects of <em>any</em> class on the classpath, running code from constructors and <code>readObject</code> methods along the way — the root of many remote code execution bugs (lesson 13.2 measured the same risk for Redis). Spring AMQP's <code>SimpleMessageConverter</code> deserializes messages of type <code>application/x-java-serialized-object</code>. An allow-list of class patterns was added back in 2016, but CVE-2023-34050 (October 2023) pointed out that when no list was configured, <em>every</em> class could still be deserialized. Any application using that converter without a list was exposed to anyone able to publish to its queue — a leaked broker password, a compromised service. Fixed in 2.4.17 and 3.0.10: no list now means nothing is allowed, which is what we measured on Spring AMQP 4.1.2. Prevention: send JSON (Jackson converter) and never Java serialization; if you must deserialize, list exact class names; give each application its own broker user with permissions only on its own queues; never expose the management port (15672) to the internet.</p>

<h3>Compared with Node.js</h3>
<p>The Node equivalents: <code>amqplib</code> for RabbitMQ (manual <code>channel.ack(msg)</code>, <code>channel.prefetch(n)</code> — the same concepts, without Spring's retry), and <strong>BullMQ</strong> on Redis, which the Node course uses. BullMQ is a job queue rather than a broker: jobs have built-in retries with backoff (<code>attempts: 3, backoff: { type: 'exponential' }</code>), a failed set instead of a DLQ, delayed and repeatable jobs, and concurrency per worker. RabbitMQ gives routing (topic/fanout), multiple consumers per message type across languages and stronger delivery semantics; BullMQ is simpler if Redis is already there. Interview line: "Spring AMQP + RabbitMQ: exchange routing, ack, prefetch, DLX. BullMQ: Redis-backed jobs with retries. Both: at-least-once, idempotent consumers."</p>

<h3>At work</h3>
<ul>
  <li>Every queue that matters has a dead-letter queue and an alert on its size (Chapter 15).</li>
  <li>Set <code>max-retries</code> and backoff explicitly; check property names against the Boot version you run — the metadata JSON in <code>spring-boot-amqp-*.jar</code> is the truth.</li>
  <li>Small prefetch for slow work; measure with the queue already full, not only with messages trickling in.</li>
  <li>Consumers idempotent by message id, JSON only, one broker user per application, management UI behind a VPN.</li>
  <li>RabbitMQ or Kafka? RabbitMQ: task queues, routing, per-message ack. Kafka: a durable log many consumers re-read, event streaming at very high volume. For LabFlow notifications RabbitMQ is the right size.</li>
</ul>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"Exchange types in RabbitMQ?"</strong> — direct, topic, fanout (and headers). Producers publish to exchanges; bindings route to queues.</li>
  <li><strong>"What happens when a Spring listener throws?"</strong> — By default the message is requeued and redelivered immediately — a poison message loops forever. Configure retry with backoff and a dead-letter exchange.</li>
  <li><strong>"What does prefetch do?"</strong> — Limits unacknowledged messages per consumer. Too high and one consumer hoards the backlog (measured: 5 consumers as slow as 1).</li>
  <li><strong>"Can a message be lost or duplicated?"</strong> — Lost if not durable/persistent or acked before work is done; duplicated on redelivery after a crash. Use durable queues, persistent messages, publisher confirms, ack after work, idempotent consumers.</li>
  <li><strong>"Why not Java serialization for messages?"</strong> — Deserializing untrusted bytes can execute code (CVE-2023-34050); use JSON with explicit types.</li>
</ol>

<h3>🧪 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
  <li>Bind a second queue <code>d14.audit</code> to exchange <code>d14</code> so it receives every message whose routing key starts with <code>dat.</code>. Which routing key pattern, and does <code>d14.dat</code> still receive them?</li>
  <li>With <code>max-retries=3</code>, <code>initial-interval=500ms</code>, <code>multiplier=2</code>, how long is the consumer thread blocked by one poison message?</li>
  <li>The email provider is down for 10 minutes. Retries with backoff alone would block the consumer or fill the DLQ. Propose a better design.</li>
</ol></div>
${giai('Show the answers', `<p>1. <code>BindingBuilder.bind(audit).to(ex).with("dat.#")</code> (or <code>dat.*</code> for exactly one more word). Yes: a topic exchange delivers a copy to every queue whose binding matches.</p><p>2. 0.5 + 1 + 2 = 3.5 s (the measurement showed the next good message waiting 3.5 s), plus the four processing attempts.</p><p>3. Distinguish transient from permanent errors. For transient ones, reject to a <em>retry queue</em> with a TTL (e.g. 60 s) whose dead-letter exchange routes back to the main queue — the message waits in RabbitMQ, not on a thread. After N rounds (count in the <code>x-death</code> header) send it to the DLQ. Add a circuit breaker so the worker pauses while the provider is down.</p>`)}

<h3>🗂 Key terms</h3>
<ul>
  <li><strong>Exchange / binding / routing key</strong> — where producers publish / the rule linking an exchange to a queue / the label the rule matches.</li>
  <li><strong>Ack / nack / requeue</strong> — done / failed / put back in the queue.</li>
  <li><strong>Dead-letter exchange (DLX) / DLQ</strong> — where rejected or expired messages go, and the queue that keeps them.</li>
  <li><strong>Prefetch (QoS)</strong> — maximum unacknowledged messages per consumer.</li>
  <li><strong>Publisher confirm</strong> — the broker's acknowledgement to the producer (lesson 14.4).</li>
  <li><strong>Quorum queue</strong> — a replicated queue type, recommended in RabbitMQ 4 for important data.</li>
</ul>

<h3>📌 Summary</h3>
<ul>
  <li>Default error handling redelivered one poison message 4,471 times in ~5 s.</li>
  <li>Boot 4 renamed <code>retry.max-attempts</code> to <code>retry.max-retries</code>; the old name is silently ignored. With retries the message ended in the DLQ.</li>
  <li><code>concurrency=5</code> gave 2 s instead of 10 s — unless a backlog was already waiting with prefetch 250; <code>prefetch=1</code> fixed it.</li>
  <li>An unacked message survived a consumer crash and came back with <code>redelivered=true</code>.</li>
  <li>Spring AMQP 4 refuses Java-serialized classes not on an allow-list (CVE-2023-34050); send JSON.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://www.rabbitmq.com/tutorials', '🐇', 'RabbitMQ Tutorials', 'work queues, routing, topics — with Spring AMQP versions')}
${tl('https://docs.spring.io/spring-boot/reference/messaging/amqp.html', '🍃', 'Spring Boot — AMQP', 'spring.rabbitmq.*, listener retry, containers')}
${tl('https://www.rabbitmq.com/docs/dlx', '📕', 'RabbitMQ — Dead Letter Exchanges', 'x-death, reasons, cycles')}
${tl('https://spring.io/security/cve-2023-34050', '🛡️', 'CVE-2023-34050 — Spring AMQP Message Deserialization', 'affected versions and the fix')}

<h3>Sources</h3>
<ul>
  <li>Spring Security Advisories — <a href="https://spring.io/security/cve-2023-34050" target="_blank" rel="noopener">CVE-2023-34050: Spring AMQP Message Deserialization Vulnerability</a> (19/10/2023).</li>
  <li>Property names: <code>META-INF/spring-configuration-metadata.json</code> in <code>spring-boot-amqp-4.1.2.jar</code>.</li>
  <li>All outputs: LabFlow (Spring Boot 4.1.2, Spring AMQP 4.1.2) + RabbitMQ 4 (management-alpine) + PostgreSQL 16 on the course machine, 25/11/2026.</li>
</ul>
</div>
`;

const L145_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.5 · Việc nền</span>
<h2>Hàng đợi tin nhắn với RabbitMQ</h2>
<p class="lead">Outbox ở bài 14.4 giao tin cho một broker. Bài này nói về phía broker: RabbitMQ đưa một tin vào hàng nào, consumer của Spring nhận nó ra sao, và chuyện gì xảy ra khi consumer hỏng. Ta đo một tin hỏng bị giao 4.471 lần trong năm giây, một thuộc tính retry trong hướng dẫn Boot 3 bị Boot 4 lặng lẽ bỏ qua, một giá trị prefetch mặc định khiến năm consumer chậm như một, một tin sống sót qua lần consumer sập, và một tin tuần tự hoá Java mà Spring AMQP từ chối mở.</p>

<h3>Đời thường trước đã</h3>
<p>Phòng phân loại của bưu điện. Thư tới một quầy (<strong>exchange</strong>), một quy tắc phân loại (<strong>binding</strong> với <strong>routing key</strong>) bỏ từng lá vào một ngăn (<strong>queue</strong>). Bưu tá (<strong>consumer</strong>) lấy thư từ ngăn của mình và ký nhận từng lá đã giao (<strong>ack</strong>). Lá thư ghi địa chỉ không đọc được sẽ bị trả lại ngăn — và nếu không ai làm gì khác, chính bưu tá đó lại nhặt nó lên mãi mãi. Bưu điện tử tế thử ba lần rồi chuyển nó lên kệ "thư có vấn đề" (<strong>dead-letter queue</strong>). Còn nếu một bưu tá ôm hết thư trong ngăn trước khi đi, bốn người còn lại đứng không (<strong>prefetch</strong>).</p>

<h3>1. Exchange, queue, binding</h3>
<ul>
  <li>Bên gửi không bao giờ ghi thẳng vào hàng; nó phát tới một <strong>exchange</strong> kèm routing key.</li>
  <li><strong>direct</strong>: khoá phải khớp đúng; <strong>topic</strong>: mẫu với <code>*</code> (một từ) và <code>#</code> (không hoặc nhiều từ); <strong>fanout</strong>: mọi hàng được gắn đều nhận một bản.</li>
  <li>Hàng <strong>durable</strong> sống sót khi broker khởi động lại; tin <strong>persistent</strong> (delivery mode 2, mặc định của Spring) được ghi xuống đĩa. Cần cả hai mới qua được một lần khởi động lại.</li>
  <li>Từ RabbitMQ 4, <strong>quorum queue</strong> (nhân bản trên nhiều node) là loại được khuyên dùng cho dữ liệu quan trọng; classic queue vẫn ổn trên một node như máy của ta.</li>
</ul>
<p>Cấu trúc hàng của chương này, khai báo bằng bean Spring (Spring AMQP tạo chúng ở lần kết nối đầu tiên):</p>
${MA145_CFG}
<p>Tin là JSON (<code>JacksonJsonMessageConverter</code>, Jackson 3 trong Spring AMQP 4). Consumer là lớp <code>Nhan</code> của bài 14.4: <code>@RabbitListener(queues = "d14.dat")</code>, tin có tên bắt đầu bằng <code>doc</code> ("tin độc") được cho ném lỗi.</p>

<h3>2. Tin độc và hàng chết (dead-letter queue)</h3>
${OUT145A}
<ol>
  <li><strong>Cấu hình mặc định.</strong> Listener ném lỗi, Spring từ chối tin <em>kèm requeue</em>, RabbitMQ giao lại ngay — 4.471 lần giao trong khoảng năm giây, một nhân CPU bận, log phình thêm hàng nghìn stack trace. Các tin xếp sau nó phải chờ.</li>
  <li><strong>Retry theo hướng dẫn Boot 3</strong>: <code>retry.max-attempts=3</code>. Kết quả là 4 lần thử (cách nhau 0,5 s, 1 s, 2 s), rồi tin sang <code>d14.dat.dlq</code> với lý do <code>x-death</code> là <code>rejected</code>. Sao lại 4? Trong Boot 4.1.2 thuộc tính <code>max-attempts</code> không còn nữa — metadata của nó ghi <em>đã thay bằng</em> <code>retry.max-retries</code> (mặc định 3 lần thử lại = 4 lần). Tên cũ bị bỏ qua không một lời cảnh báo; giá trị mặc định tình cờ trông na ná.</li>
  <li><strong>Tên của Boot 4</strong>: <code>retry.max-retries=2</code> ⇒ đúng 3 lần thử, rồi vào hàng chết.</li>
</ol>
${props(`spring.rabbitmq.listener.simple.retry.enabled=true
spring.rabbitmq.listener.simple.retry.max-retries=3          # Boot 4 (Boot 3: max-attempts=4)
spring.rabbitmq.listener.simple.retry.initial-interval=500ms
spring.rabbitmq.listener.simple.retry.multiplier=2
# sau lần thử cuối Spring từ chối KHÔNG requeue ⇒ dead-letter exchange của hàng nhận tin`)}
<p>Thêm hai điều từ cùng output. Tin tốt <code>nhom3</code>, phát ngay sau <code>doc-2</code>, phải chờ 3,5 giây: kiểu retry này là <em>stateless</em> và ngủ ngay trên luồng consumer, chặn mọi tin phía sau. Và tin vào hàng chết vẫn giữ thân và header, nên bạn xem được nó trên giao diện quản trị, sửa nguyên nhân rồi chuyển lại — hàng chết là danh sách việc cần làm, không phải thùng rác. Lỗi không bao giờ thành công được (JSON sai, thiếu trường) nên bỏ qua retry: Spring coi <code>MessageConversionException</code> là lỗi chết và đưa thẳng vào hàng chết (Lab 14 có kiểm điều này).</p>

<h3>3. Thông lượng: concurrency và prefetch</h3>
${OUT145B}
<ol>
  <li>Một consumer, 100 tin × 100 ms ⇒ 10,1 giây.</li>
  <li><code>concurrency=5</code>, tin tới khi consumer đang chạy ⇒ 2,0 giây: RabbitMQ chia lần lượt cho 5 consumer.</li>
  <li><code>concurrency=5</code>, nhưng 100 tin đã nằm chờ sẵn lúc ứng dụng khởi động ⇒ <strong>lại 10,1 giây</strong>. Consumer kết nối đầu tiên nhận tới <code>prefetch</code> (mặc định 250) tin chưa ack — tức cả 100 — và bốn consumer kia không có gì làm.</li>
  <li>Cùng tình huống với <code>prefetch=1</code> ⇒ 2,1 giây. Prefetch thấp = chia đều hơn, tốn thêm chút lượt mạng. Tin xử lý chậm thì dùng prefetch nhỏ (1–10); tin rất nhỏ và nhanh thì dùng lớn hơn.</li>
</ol>

<h3>4. Ack: thứ gì sống sót qua lần sập</h3>
${OUT145C}
<ol>
  <li>Khi consumer đang làm (tin 5 giây), tin ở trạng thái <em>chưa ack</em> (<code>0 1</code>): đã giao nhưng chưa xong. Chế độ ack mặc định <code>AUTO</code> của Spring chỉ ack sau khi phương thức listener trả về.</li>
  <li>Ta giết ứng dụng: RabbitMQ thấy kết nối đóng và trả tin về hàng (<code>1 0</code>). Khởi động lại, tin được giao lần nữa với <code>giao lại: true</code> (cờ <code>redelivered</code>). Không mất gì — còn những gì lần thử đầu đã làm trước khi sập (email đã gửi rồi?) sẽ xảy ra hai lần, trừ khi consumer idempotent (bài 14.4).</li>
  <li><strong>Bảo mật</strong>: một tin có content type <code>application/x-java-serialized-object</code> bị từ chối: "Attempt to deserialize unauthorized class". Xem góc hacker.</li>
  <li>Tài khoản mặc định <code>guest</code> không tồn tại trên broker của ta (ta tạo <code>labflow</code> qua biến môi trường), và kể cả khi có, RabbitMQ chỉ cho <code>guest</code> đăng nhập từ localhost.</li>
</ol>

<h3>🕵️ Góc hacker — CVE-2023-34050, giải tuần tự hoá trong Spring AMQP</h3>
<p>Tuần tự hoá Java biến byte thành đối tượng của <em>bất kỳ</em> lớp nào trên classpath, chạy mã trong constructor và phương thức <code>readObject</code> dọc đường — gốc rễ của rất nhiều lỗi thực thi mã từ xa (bài 13.2 đã đo cùng rủi ro này với Redis). <code>SimpleMessageConverter</code> của Spring AMQP giải tuần tự hoá tin kiểu <code>application/x-java-serialized-object</code>. Danh sách mẫu lớp được phép đã có từ năm 2016, nhưng CVE-2023-34050 (tháng 10/2023) chỉ ra rằng khi không cấu hình danh sách thì <em>mọi</em> lớp vẫn được giải tuần tự hoá. Ứng dụng nào dùng bộ chuyển đó mà không có danh sách đều hở trước bất kỳ ai phát được tin vào hàng của nó — mật khẩu broker bị lộ, một dịch vụ bị chiếm. Đã sửa ở 2.4.17 và 3.0.10: không có danh sách giờ nghĩa là không cho lớp nào, đúng như phép đo của ta trên Spring AMQP 4.1.2. Cách phòng: gửi JSON (bộ chuyển Jackson), không bao giờ dùng tuần tự hoá Java; buộc phải giải tuần tự hoá thì liệt kê đúng tên lớp; mỗi ứng dụng một tài khoản broker chỉ có quyền trên hàng của mình; không bao giờ mở cổng quản trị (15672) ra Internet.</p>

<h3>So với Node.js</h3>
<p>Tương đương bên Node: <code>amqplib</code> cho RabbitMQ (tự gọi <code>channel.ack(msg)</code>, <code>channel.prefetch(n)</code> — cùng khái niệm, không có retry như Spring), và <strong>BullMQ</strong> trên Redis mà khoá Node dùng. BullMQ là hàng đợi job hơn là broker: job có sẵn retry với backoff (<code>attempts: 3, backoff: { type: 'exponential' }</code>), tập failed thay cho hàng chết, job hẹn giờ và lặp lại, concurrency theo worker. RabbitMQ cho định tuyến (topic/fanout), nhiều consumer cho một loại tin qua nhiều ngôn ngữ và bảo đảm giao chắc hơn; BullMQ đơn giản hơn nếu đã có sẵn Redis. Câu chốt phỏng vấn: "Spring AMQP + RabbitMQ: định tuyến qua exchange, ack, prefetch, DLX. BullMQ: job trên Redis có retry. Cả hai: ít nhất một lần, consumer idempotent."</p>

<h3>Ở chỗ làm</h3>
<ul>
  <li>Hàng nào quan trọng cũng có hàng chết và cảnh báo theo kích thước của nó (Chương 15).</li>
  <li>Đặt <code>max-retries</code> và backoff tường minh; đối chiếu tên thuộc tính với đúng phiên bản Boot đang chạy — tệp metadata JSON trong <code>spring-boot-amqp-*.jar</code> là sự thật.</li>
  <li>Prefetch nhỏ cho việc chậm; đo khi hàng đã đầy sẵn, không chỉ khi tin nhỏ giọt tới.</li>
  <li>Consumer idempotent theo mã tin, chỉ JSON, mỗi ứng dụng một tài khoản broker, giao diện quản trị nằm sau VPN.</li>
  <li>RabbitMQ hay Kafka? RabbitMQ: hàng đợi việc, định tuyến, ack từng tin. Kafka: nhật ký bền cho nhiều consumer đọc lại, luồng sự kiện khối lượng rất lớn. Với thông báo của LabFlow, RabbitMQ là vừa cỡ.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"RabbitMQ có những loại exchange nào?"</strong> — direct, topic, fanout (và headers). Bên gửi phát tới exchange; binding định tuyến vào hàng.</li>
  <li><strong>"Listener của Spring ném lỗi thì sao?"</strong> — Mặc định tin bị requeue và giao lại ngay — tin độc lặp vô tận. Cấu hình retry có backoff và dead-letter exchange.</li>
  <li><strong>"Prefetch làm gì?"</strong> — Giới hạn số tin chưa ack trên mỗi consumer. Quá cao thì một consumer ôm hết tồn đọng (đã đo: 5 consumer chậm như 1).</li>
  <li><strong>"Tin có thể mất hoặc trùng không?"</strong> — Mất nếu hàng/tin không bền hoặc ack trước khi làm xong; trùng khi giao lại sau sập. Dùng hàng durable, tin persistent, publisher confirm, ack sau khi làm, consumer idempotent.</li>
  <li><strong>"Sao không dùng tuần tự hoá Java cho tin?"</strong> — Giải tuần tự hoá byte không tin cậy có thể chạy mã (CVE-2023-34050); dùng JSON với kiểu tường minh.</li>
</ol>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
  <li>Gắn thêm hàng <code>d14.audit</code> vào exchange <code>d14</code> để nhận mọi tin có routing key bắt đầu bằng <code>dat.</code>. Dùng mẫu nào, và <code>d14.dat</code> còn nhận các tin đó không?</li>
  <li>Với <code>max-retries=3</code>, <code>initial-interval=500ms</code>, <code>multiplier=2</code>, luồng consumer bị một tin độc chặn bao lâu?</li>
  <li>Nhà cung cấp email chết 10 phút. Chỉ retry với backoff thì hoặc chặn consumer hoặc làm đầy hàng chết. Đề xuất thiết kế tốt hơn.</li>
</ol></div>
${giai('Xem đáp án', `<p>1. <code>BindingBuilder.bind(audit).to(ex).with("dat.#")</code> (hoặc <code>dat.*</code> nếu đúng thêm một từ). Có: exchange topic giao một bản cho mọi hàng có binding khớp.</p><p>2. 0,5 + 1 + 2 = 3,5 giây (phép đo cho thấy tin tốt kế tiếp chờ 3,5 giây), cộng thời gian bốn lần xử lý.</p><p>3. Tách lỗi tạm thời và lỗi vĩnh viễn. Với lỗi tạm thời, từ chối sang một <em>hàng thử lại</em> có TTL (ví dụ 60 giây) mà dead-letter exchange của nó định tuyến về hàng chính — tin chờ trong RabbitMQ, không chiếm luồng. Sau N vòng (đếm trong header <code>x-death</code>) mới chuyển vào hàng chết. Thêm circuit breaker để worker tạm dừng khi nhà cung cấp đang chết.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<ul>
  <li><strong>Exchange / binding / routing key</strong> — nơi bên gửi phát tin / quy tắc nối exchange với hàng / nhãn mà quy tắc so khớp.</li>
  <li><strong>Ack / nack / requeue</strong> — đã xong / thất bại / trả lại hàng.</li>
  <li><strong>Dead-letter exchange (DLX) / DLQ</strong> — nơi tin bị từ chối hoặc hết hạn được chuyển tới, và hàng giữ chúng.</li>
  <li><strong>Prefetch (QoS)</strong> — số tin chưa ack tối đa trên mỗi consumer.</li>
  <li><strong>Publisher confirm</strong> — xác nhận của broker gửi về bên phát (bài 14.4).</li>
  <li><strong>Quorum queue</strong> — loại hàng có nhân bản, được khuyên dùng ở RabbitMQ 4 cho dữ liệu quan trọng.</li>
</ul>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Xử lý lỗi mặc định đã giao lại một tin độc 4.471 lần trong khoảng 5 giây.</li>
  <li>Boot 4 đổi <code>retry.max-attempts</code> thành <code>retry.max-retries</code>; tên cũ bị bỏ qua lặng lẽ. Có retry thì tin kết thúc ở hàng chết.</li>
  <li><code>concurrency=5</code> cho 2 giây thay vì 10 giây — trừ khi tồn đọng đã chờ sẵn với prefetch 250; <code>prefetch=1</code> sửa được.</li>
  <li>Tin chưa ack sống sót qua lần consumer sập và quay lại với <code>redelivered=true</code>.</li>
  <li>Spring AMQP 4 từ chối lớp tuần tự hoá Java không nằm trong danh sách cho phép (CVE-2023-34050); hãy gửi JSON.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://www.rabbitmq.com/tutorials', '🐇', 'RabbitMQ Tutorials', 'work queue, routing, topic — có bản Spring AMQP')}
${tl('https://docs.spring.io/spring-boot/reference/messaging/amqp.html', '🍃', 'Spring Boot — AMQP', 'spring.rabbitmq.*, retry của listener, container')}
${tl('https://www.rabbitmq.com/docs/dlx', '📕', 'RabbitMQ — Dead Letter Exchanges', 'x-death, các lý do, vòng lặp')}
${tl('https://spring.io/security/cve-2023-34050', '🛡️', 'CVE-2023-34050 — Spring AMQP Message Deserialization', 'phiên bản bị ảnh hưởng và bản sửa')}

<h3>Nguồn</h3>
<ul>
  <li>Spring Security Advisories — <a href="https://spring.io/security/cve-2023-34050" target="_blank" rel="noopener">CVE-2023-34050: Spring AMQP Message Deserialization Vulnerability</a> (19/10/2023).</li>
  <li>Tên thuộc tính: <code>META-INF/spring-configuration-metadata.json</code> trong <code>spring-boot-amqp-4.1.2.jar</code>.</li>
  <li>Mọi output: LabFlow (Spring Boot 4.1.2, Spring AMQP 4.1.2) + RabbitMQ 4 (management-alpine) + PostgreSQL 16 trên máy của khoá học, 25/11/2026.</li>
</ul>
</div>
`;

// ===== Bài 14.6 =====
const MA146_CHAM = bash("#!/bin/bash\n# cham.sh <thư mục dự án> — chấm Lab 14 \"Thông báo quyết định duyệt qua hàng đợi\". 10 mục ĐẠT/TRƯỢT, gọi API + RabbitMQ THẬT.\n# Chép dự án sang thư mục tạm, biên dịch, chạy HAI instance (A :41845, B :41846) profile dev, PostgreSQL + RabbitMQ sạch trong netns sb-c14-cham-net.\n# RabbitMQ: tài khoản labflow, quản trị ở 127.0.0.1:41847. Mật khẩu sinh lúc chấm, không in ra.\nset -u\nSRC=$(realpath \"$1\"); W=/tmp/cham14/$(basename \"$SRC\")-$$; MVN=./mvn.sh\nA=http://127.0.0.1:41845; B=http://127.0.0.1:41846; MQ=http://127.0.0.1:41847/api; J='Content-Type: application/json'\nMKDB=$(openssl rand -hex 8); JWT=$(openssl rand -hex 32); MKQL=ql-$(openssl rand -hex 8); MKSV=sv-$(openssl rand -hex 8); MKMQ=mq-$(openssl rand -hex 8)\nN=sb-c14-cham; diem=0; muc() { if [ \"$2\" = 1 ]; then diem=$((diem+1)); echo \"Mục $1: ĐẠT   — $3\"; else echo \"Mục $1: TRƯỢT — $3\"; fi; }\ndon() { docker rm -f $N-a $N-b $N-pg $N-mq $N-net >/dev/null 2>&1; rm -rf \"$W\"; }\ntrap don EXIT\nrm -rf \"$W\"; mkdir -p \"$W\"; cp -r \"$SRC\"/pom.xml \"$SRC\"/src \"$W\"/\nbash $MVN \"$W\" -B -q -DskipTests compile dependency:copy-dependencies -DoutputDirectory=target/dep -DincludeScope=runtime > \"$W/build.log\" 2>&1 \\\n  || { echo \"BIÊN DỊCH HỎNG:\"; grep -E 'ERROR.*\\.java' \"$W/build.log\" | head -5; echo \"Điểm: 0/10\"; exit 1; }\ndocker rm -f $N-a $N-b $N-pg $N-mq $N-net >/dev/null 2>&1\ndocker run -d --name $N-net --hostname $N-mq --memory 64m -p 127.0.0.1:41845:8080 -p 127.0.0.1:41846:8081 -p 127.0.0.1:41847:15672 --entrypoint sleep postgres:16 infinity >/dev/null\ndocker run -d --name $N-pg --network container:$N-net --memory 2g --memory-swap 2g --cpus 2 -e POSTGRES_USER=labflow -e POSTGRES_PASSWORD=\"$MKDB\" -e POSTGRES_DB=labflow postgres:16 >/dev/null\ndocker run -d --name $N-mq --network container:$N-net --memory 512m --memory-swap 512m --cpus 1 -e RABBITMQ_DEFAULT_USER=labflow -e RABBITMQ_DEFAULT_PASS=\"$MKMQ\" rabbitmq:4-management-alpine >/dev/null\nfor i in $(seq 60); do docker exec $N-pg pg_isready -h 127.0.0.1 -U labflow -q 2>/dev/null && break; sleep 1; done\nfor i in $(seq 90); do docker exec $N-mq rabbitmq-diagnostics -q check_port_connectivity >/dev/null 2>&1 && break; sleep 1; done; sleep 2\napp() { # tên cổng giờ\n  docker rm -f $N-$1 >/dev/null 2>&1\n  docker run -d --name $N-$1 --network container:$N-net --memory 1g --memory-swap 1g --cpus 2 --user $(id -u):$(id -g) -e HOME=/tmp -e TZ=UTC \\\n    -e LABFLOW_DB_PASSWORD=\"$MKDB\" -e LABFLOW_JWT_SECRET=\"$JWT\" -e LABFLOW_MANAGER_PASSWORD=\"$MKQL\" -e LABFLOW_RABBIT_PASSWORD=\"$MKMQ\" -e LABFLOW_NOW=$3 -e SPRING_PROFILES_ACTIVE=dev \\\n    -v \"$W\":/w -w /w --entrypoint \"\" maven:3.9-eclipse-temurin-21 java -XX:MaxRAMPercentage=60 -cp \"target/classes:target/dep/*\" vn.labflow.LabflowApplication \\\n    --server.port=$2 \"--labflow.booking.het-han.cron=*/2 * * * * *\" --spring.rabbitmq.username=labflow >/dev/null\n}\nlen() { for i in $(seq 120); do docker logs $N-$1 2>&1 | grep -qE 'Started [A-Za-z0-9]+ in|APPLICATION FAILED|Application run failed' && break; sleep 1; done\n  docker logs $N-$1 2>&1 | grep -qE 'Started [A-Za-z0-9]+ in' || { echo \"ỨNG DỤNG $1 KHÔNG LÊN:\"; docker logs $N-$1 2>&1 | grep -vE '^\\s+at ' | tail -8; echo \"Điểm: 0/10\"; exit 1; }; }\napp a 8080 2026-11-25T08:00; len a; app b 8081 2026-11-25T08:00; len b\nps() { docker exec $N-pg psql -qtA -U labflow -d labflow -c \"$1\" 2>/dev/null; }\nmq() { curl -s -u \"labflow:$MKMQ\" -H \"$J\" \"$@\"; }\ndk() { curl -s -o /dev/null -H \"$J\" -d \"{\\\"email\\\":\\\"$1\\\",\\\"fullName\\\":\\\"Sinh Vien\\\",\\\"password\\\":\\\"$MKSV\\\"}\" $A/api/v1/auth/register; }\ntok() { curl -s -H \"$J\" -d \"{\\\"email\\\":\\\"$1\\\",\\\"password\\\":\\\"$2\\\"}\" $A/api/v1/auth/login | jq -r '.accessToken // empty'; }\ndat() { curl -s -H \"Authorization: Bearer $1\" -H \"$J\" -H \"Idempotency-Key: k-$RANDOM$RANDOM\" -d \"{\\\"labCode\\\":\\\"AI-03\\\",\\\"startAt\\\":\\\"$2\\\",\\\"endAt\\\":\\\"$3\\\",\\\"purpose\\\":\\\"cham lab 14\\\"}\" $A/api/v1/bookings | jq -r '.id // empty'; }\nduyet() { curl -s -o /dev/null -w '%{http_code}' -H \"Authorization: Bearer $QL\" -H \"$J\" -d \"{\\\"version\\\":${3:-0}}\" $1/api/v1/bookings/$2/approve; }\nemail() { ps \"select count(*) from email_log where booking_id = $1 and kind = '$2'\"; }\ncho_email() { for i in $(seq ${3:-10}); do [ \"$(email $1 $2)\" = 1 ] && return 0; sleep 1; done; return 1; }\n# hàng nghe của bộ chấm: nhận MỌI tin booking.* từ exchange labflow.booking (nếu exchange tồn tại)\nmq -X PUT -d '{\"durable\":true,\"auto_delete\":false}' $MQ/queues/%2F/cham.nghe >/dev/null\nmq -X POST -d '{\"routing_key\":\"booking.#\"}' $MQ/bindings/%2F/e/labflow.booking/q/cham.nghe >/dev/null\nlay() { mq -X POST -d '{\"count\":500,\"ackmode\":\"ack_requeue_false\",\"encoding\":\"auto\"}' $MQ/queues/%2F/cham.nghe/get; }\ndlq() { mq $MQ/queues/%2F/labflow.email.dlq | jq -r '.messages // 0'; }\ngui() { # payload content-type message-id\n  mq -X POST -d \"$(jq -nc --arg p \"$1\" --arg c \"$2\" --arg m \"$3\" '{routing_key:\"booking.decided\",payload:$p,payload_encoding:\"string\",properties:{content_type:$c,message_id:$m,delivery_mode:2}}')\" $MQ/exchanges/%2F/labflow.booking/publish | jq -r '.routed // false'; }\nQL=$(tok manager@fpt.edu.vn \"$MKQL\")\nfor s in 1 2 3 4 5 6 7 8; do dk sv$s.cham@fpt.edu.vn; done\nSV1=$(tok sv1.cham@fpt.edu.vn \"$MKSV\")\n\n# ---- Mục 1: hàng labflow.email bền, có dead-letter; có hàng chết labflow.email.dlq\nq=$(mq $MQ/queues/%2F/labflow.email); x=$(echo \"$q\" | jq -r '.arguments[\"x-dead-letter-exchange\"] // empty'); d=$(echo \"$q\" | jq -r '.durable // false')\ndq=$(mq -o /dev/null -w '%{http_code}' $MQ/queues/%2F/labflow.email.dlq)\n[ -n \"$x\" ] && [ \"$d\" = true ] && [ \"$dq\" = 200 ] && ok=1 || ok=0; muc 1 $ok \"labflow.email: durable=$d, x-dead-letter-exchange=${x:-không có}; labflow.email.dlq: HTTP $dq\"\n\n# ---- Mục 2: quản lý duyệt ⇒ trong 10 giây có một email (email_log) cho lượt đó\nb1=$(dat \"$SV1\" 2026-11-26T07:00:00 2026-11-26T08:00:00); s=$(duyet $A $b1)\ncho_email \"$b1\" CONFIRMED 10 && ok=1 || ok=0; muc 2 $ok \"duyệt lượt #$b1: HTTP $s, email_log CONFIRMED = $(email $b1 CONFIRMED || echo lỗi)\"\n\n# ---- Mục 3: tin trên exchange là JSON, có eventId/bookingId/status, có message_id\nm=$(lay | jq -c \"[.[] | select((.payload | fromjson? | .bookingId) == ${b1:-0})][0] // empty\")\nct=$(echo \"$m\" | jq -r '.properties.content_type // empty'); pl=$(echo \"$m\" | jq -r '.payload // empty' | jq -c '{eventId,bookingId,status}' 2>/dev/null)\nmid=$(echo \"$m\" | jq -r '.properties.message_id // empty')\n[ \"$ct\" = application/json ] && echo \"$pl\" | jq -e '.eventId and .status == \"CONFIRMED\"' >/dev/null 2>&1 && [ -n \"$mid\" ] && ok=1 || ok=0\nmuc 3 $ok \"content_type=${ct:-?}, payload=${pl:-không thấy tin}, message_id=${mid:-không có}\"\n\n# ---- Mục 4: RabbitMQ dừng lúc quyết định ⇒ API vẫn 200, chạy lại ⇒ email vẫn tới (không mất tin)\nb2=$(dat \"$SV1\" 2026-11-26T08:00:00 2026-11-26T09:00:00); docker stop $N-mq >/dev/null\ns=$(curl -s -o /dev/null -w '%{http_code}' -H \"Authorization: Bearer $QL\" -H \"$J\" -d '{\"version\":0,\"reason\":\"trung lich bao tri\"}' $A/api/v1/bookings/$b2/reject)\ndocker start $N-mq >/dev/null; for i in $(seq 90); do docker exec $N-mq rabbitmq-diagnostics -q check_port_connectivity >/dev/null 2>&1 && break; sleep 1; done\ncho_email \"$b2\" REJECTED 30 && ok=1 || ok=0; [ \"$s\" = 200 ] || ok=0; muc 4 $ok \"từ chối #$b2 khi broker dừng: HTTP $s; sau khi broker chạy lại, email_log REJECTED = $(email $b2 REJECTED)\"\nmq -X PUT -d '{\"durable\":true,\"auto_delete\":false}' $MQ/queues/%2F/cham.nghe >/dev/null; mq -X POST -d '{\"routing_key\":\"booking.#\"}' $MQ/bindings/%2F/e/labflow.booking/q/cham.nghe >/dev/null; lay >/dev/null\n\n# ---- Mục 5: giao dịch hỏng (sai version ⇒ 409) ⇒ không có tin, không có email\nb3=$(dat \"$SV1\" 2026-11-26T09:00:00 2026-11-26T10:00:00); s=$(duyet $A $b3 7); sleep 3\nt=$(lay | jq \"[.[] | select((.payload | fromjson? | .bookingId) == ${b3:-0})] | length\"); e=$(ps \"select count(*) from email_log where booking_id = ${b3:-0}\")\n[ \"$s\" = 409 ] && [ \"${t:-1}\" = 0 ] && [ \"${e:-1}\" = 0 ] && ok=1 || ok=0; muc 5 $ok \"duyệt #$b3 với version sai: HTTP $s; tin trên exchange: ${t:-?}; email_log: ${e:-lỗi}\"\n\n# ---- Mục 6: cùng một tin (cùng eventId) giao hai lần ⇒ một email\nev=$(cat /proc/sys/kernel/random/uuid); p=\"{\\\"eventId\\\":\\\"$ev\\\",\\\"bookingId\\\":9001,\\\"ownerId\\\":1,\\\"labCode\\\":\\\"AI-03\\\",\\\"status\\\":\\\"CONFIRMED\\\",\\\"reason\\\":null}\"\nr1=$(gui \"$p\" application/json $ev); r2=$(gui \"$p\" application/json $ev); sleep 4\ne=$(ps \"select count(*) from email_log where event_id = '$ev'\"); [ \"$r1\" = true ] && [ \"${e:-0}\" = 1 ] && ok=1 || ok=0\nmuc 6 $ok \"gửi hai lần cùng eventId (routed: $r1/$r2) ⇒ email_log = ${e:-lỗi}\"\n\n# ---- Mục 7: tin độc (không phải JSON) ⇒ vào labflow.email.dlq; tin hợp lệ sau đó vẫn được xử lý\nd0=$(dlq); gui 'khong-phai-json{' application/json doc-$RANDOM >/dev/null\nev2=$(cat /proc/sys/kernel/random/uuid); gui \"{\\\"eventId\\\":\\\"$ev2\\\",\\\"bookingId\\\":9002,\\\"ownerId\\\":1,\\\"labCode\\\":\\\"AI-03\\\",\\\"status\\\":\\\"CONFIRMED\\\",\\\"reason\\\":null}\" application/json $ev2 >/dev/null\nfor i in $(seq 20); do [ \"$(dlq)\" -gt \"${d0:-0}\" ] 2>/dev/null && [ \"$(ps \"select count(*) from email_log where event_id = '$ev2'\")\" = 1 ] && break; sleep 1; done\nd1=$(dlq); e=$(ps \"select count(*) from email_log where event_id = '$ev2'\")\n[ \"$d1\" -gt \"${d0:-0}\" ] 2>/dev/null && [ \"${e:-0}\" = 1 ] && ok=1 || ok=0; muc 7 $ok \"labflow.email.dlq: $d0 ⇒ $d1; tin hợp lệ phía sau: email_log = ${e:-lỗi}\"\n\n# ---- Mục 8 + 9: BR-13 — hai instance, giờ nhảy tới 09:05 ⇒ lượt PENDING bắt đầu 11:00 bị tự từ chối, MỘT email mỗi lượt\nSV2=$(tok sv2.cham@fpt.edu.vn \"$MKSV\"); SV3=$(tok sv3.cham@fpt.edu.vn \"$MKSV\")\nh1=$(dat \"$SV2\" 2026-11-25T10:00:00 2026-11-25T11:00:00); h2=$(dat \"$SV3\" 2026-11-25T11:00:00 2026-11-25T12:00:00); h3=$(dat \"$SV2\" 2026-11-25T16:00:00 2026-11-25T17:00:00)\napp a 8080 2026-11-25T09:05; app b 8081 2026-11-25T09:05; len a; len b; sleep 6\nst=$(ps \"select string_agg(id || ':' || status, ' ' order by id) from bookings where id in (${h1:-0}, ${h2:-0}, ${h3:-0})\")\nly=$(ps \"select reject_reason from bookings where id = ${h1:-0}\")\nok=0; [[ \"$st\" == \"${h1}:REJECTED ${h2}:REJECTED ${h3}:PENDING\" && \"$ly\" == Hết\\ hạn\\ duyệt* ]] && cho_email \"$h1\" REJECTED 10 && cho_email \"$h2\" REJECTED 10 && ok=1\nmuc 8 $ok \"lúc 09:05: $st; lý do #$h1: \\\"${ly%%:*}\\\"; email REJECTED: $(email ${h1:-0} REJECTED)+$(email ${h2:-0} REJECTED)\"\nsleep 4; e=$(ps \"select count(*) from email_log where booking_id in (${h1:-0}, ${h2:-0})\"); t=$(lay | jq \"[.[] | select((.payload | fromjson? | .bookingId) as \\$b | [${h1:-0}, ${h2:-0}] | index(\\$b))] | length\")\n[ \"${e:-0}\" = 2 ] && [ \"${t:-0}\" = 2 ] && ok=1 || ok=0; muc 9 $ok \"hai instance cùng chạy job: email_log cho 2 lượt hết hạn = ${e:-lỗi}, tin trên exchange = ${t:-?} (cần 2 và 2)\"\n\n# ---- Mục 10: 30 quyết định chia đều cho A và B ⇒ đúng 30 tin, 30 lượt khác nhau (relay không gửi trùng)\nlay >/dev/null; ids=\"\"; k=0; QL=$(tok manager@fpt.edu.vn \"$MKQL\")   # token cũ phát lúc 08:00 (đồng hồ giả) đã hết hạn\n# 5 sinh viên × 6 lượt 1 giờ (hạn mức 6 giờ/tuần), Lab AI-03, không chồng giờ\nfor c in \"4 27 7\" \"5 27 13\" \"6 28 7\" \"7 28 13\" \"8 26 11\"; do set -- $c; T=$(tok sv$1.cham@fpt.edu.vn \"$MKSV\")\n  for h in 0 1 2 3 4 5; do g=$(( $3 + h )); i=$(dat \"$T\" 2026-11-$2T$(printf %02d $g):00:00 2026-11-$2T$(printf %02d $((g+1))):00:00); [ -n \"$i\" ] && ids=\"$ids $i\"; done; done\nfor i in $ids; do k=$((k+1)); [ $((k % 2)) = 0 ] && duyet $A $i >/dev/null || duyet $B $i >/dev/null; done\nsleep 6; m=$(lay); t=$(echo \"$m\" | jq 'length'); u=$(echo \"$m\" | jq '[.[] | (.payload | fromjson? | .bookingId)] | unique | length')\n[ \"$k\" = 30 ] && [ \"${t:-0}\" = 30 ] && [ \"${u:-0}\" = 30 ] && ok=1 || ok=0; muc 10 $ok \"$k lượt duyệt qua A và B ⇒ tin trên exchange: ${t:-?}, lượt khác nhau: ${u:-?}\"\necho \"Điểm: $diem/10\"");
const MA146_HOP = java("/**\n * Listener ĐỒNG BỘ, có chủ ý: chạy trong CÙNG giao dịch với quyết định duyệt ⇒ quyết định và dòng outbox cùng commit hoặc cùng rollback.\n * Không gọi mạng ở đây — chỉ một câu INSERT.\n */\n@Component\nclass HopThuDi {\n    private static final JsonMapper JSON = JsonMapper.builder().build();\n    private final JdbcClient db;\n    HopThuDi(JdbcClient db) { this.db = db; }\n\n    @EventListener\n    void khiQuyetDinh(BookingDecided e) {\n        var tin = new TinQuyetDinh(UUID.randomUUID(), e.bookingId(), e.ownerId(), e.labCode(), e.status(), e.reason());\n        db.sql(\"insert into notification_outbox (event_id, routing, payload) values (?, 'booking.decided', ?::jsonb)\")\n            .params(tin.eventId(), JSON.writeValueAsString(tin)).update();\n    }\n}");
const MA146_RELAY = java("/**\n * Relay: mỗi 500 ms lấy tối đa 50 dòng chưa gửi (SKIP LOCKED ⇒ nhiều instance chia nhau, không gửi trùng),\n * đẩy sang exchange labflow.booking, CHỜ broker xác nhận rồi mới đánh dấu đã gửi. Broker chết ⇒ dòng ở lại, lượt sau gửi tiếp.\n */\n@Component\n@ConditionalOnProperty(name = \"labflow.scheduling.enabled\", havingValue = \"true\", matchIfMissing = true)\nclass RelayThu {\n    private static final Logger log = LoggerFactory.getLogger(RelayThu.class);\n    private static final JsonMapper JSON = JsonMapper.builder().build();\n    private final JdbcClient db; private final RabbitTemplate rabbit; private final TransactionTemplate tx;\n    RelayThu(JdbcClient db, RabbitTemplate rabbit, TransactionTemplate tx) { this.db = db; this.rabbit = rabbit; this.tx = tx; }\n\n    record Dong(long id, String routing, String payload) { }\n\n    @Scheduled(fixedDelay = 500)\n    void day() {\n        Integer n = tx.execute(s -> {\n            List<Dong> ds = db.sql(\"\"\"\n                select id, routing, payload::text from notification_outbox\n                where sent_at is null order by id limit 50 for update skip locked\"\"\").query(Dong.class).list();\n            for (Dong d : ds) {\n                TinQuyetDinh tin = JSON.readValue(d.payload(), TinQuyetDinh.class);\n                rabbit.invoke(t -> {\n                    t.convertAndSend(\"labflow.booking\", d.routing(), tin, m -> {\n                        m.getMessageProperties().setMessageId(tin.eventId().toString());\n                        m.getMessageProperties().setDeliveryMode(MessageDeliveryMode.PERSISTENT);\n                        return m;\n                    });\n                    t.waitForConfirmsOrDie(5000);\n                    return null;\n                });\n                db.sql(\"update notification_outbox set sent_at = now() where id = ?\").param(d.id()).update();\n            }\n            return ds.size();\n        });\n        if (n != null && n > 0) log.info(\"relay đã đẩy {} tin\", n);\n    }\n}");
const MA146_WORKER = java("/** Bên nhận: gửi email (giả) cho mỗi quyết định. Idempotent theo eventId; lỗi ⇒ thử lại 3 lần ⇒ hàng chết labflow.email.dlq. */\n@Component\nclass EmailWorker {\n    private static final Logger log = LoggerFactory.getLogger(EmailWorker.class);\n    private final JdbcClient db;\n    EmailWorker(JdbcClient db) { this.db = db; }\n\n    @RabbitListener(queues = \"labflow.email\")\n    @Transactional\n    public void nhan(TinQuyetDinh t) {\n        if (t.eventId() == null || t.status() == null) throw new IllegalArgumentException(\"tin thiếu eventId/status\");\n        int moi = db.sql(\"insert into email_log (event_id, booking_id, kind) values (?, ?, ?) on conflict do nothing\")\n            .params(t.eventId(), t.bookingId(), t.status()).update();\n        if (moi == 0) { log.info(\"bỏ qua tin trùng {}\", t.eventId()); return; }\n        log.info(\"[email giả] tài khoản {}: lượt #{} phòng {} ⇒ {}\", t.ownerId(), t.bookingId(), t.labCode(), t.status());\n    }\n}");
const MA146_CFG = java("/** labflow.booking (topic) --booking.decided--> labflow.email; từ chối hẳn ⇒ labflow.dlx --> labflow.email.dlq. Tin là JSON. */\n@Configuration\nclass HangDoiCauHinh {\n    @Bean\n    Declarables hangDoiEmail() {\n        TopicExchange ex = new TopicExchange(\"labflow.booking\");\n        DirectExchange dlx = new DirectExchange(\"labflow.dlx\");\n        Queue email = QueueBuilder.durable(\"labflow.email\").deadLetterExchange(\"labflow.dlx\").deadLetterRoutingKey(\"email\").build();\n        Queue dlq = QueueBuilder.durable(\"labflow.email.dlq\").build();\n        return new Declarables(ex, dlx, email, dlq,\n            BindingBuilder.bind(email).to(ex).with(\"booking.decided\"),\n            BindingBuilder.bind(dlq).to(dlx).with(\"email\"));\n    }\n\n    @Bean\n    MessageConverter jsonConverter() { return new JacksonJsonMessageConverter(); }\n}");
const MA146_SQL = sql("-- module notification: hộp thư đi (outbox) ghi CÙNG giao dịch với quyết định duyệt + nhật ký email để bên nhận chống trùng\ncreate table notification_outbox (\n  id         bigint generated by default as identity primary key,\n  event_id   uuid        not null unique,\n  routing    varchar(60) not null,\n  payload    jsonb       not null,\n  created_at timestamptz not null default now(),\n  sent_at    timestamptz\n);\ncreate index notification_outbox_chua_gui on notification_outbox (id) where sent_at is null;\ncreate table email_log (\n  event_id   uuid primary key,                 -- giao lại cùng tin ⇒ không gửi email thứ hai\n  booking_id bigint      not null,\n  kind       varchar(30) not null,\n  sent_at    timestamptz not null default now()\n);");
const MA146_PROPS = props("# RabbitMQ (Chương 14): host/tài khoản từ biến môi trường; relay chờ xác nhận; bên nhận thử lại 3 lần rồi dead-letter\nspring.rabbitmq.host=${LABFLOW_RABBIT_HOST:localhost}\nspring.rabbitmq.username=${LABFLOW_RABBIT_USER:labflow}\nspring.rabbitmq.password=${LABFLOW_RABBIT_PASSWORD:}\nspring.rabbitmq.publisher-confirm-type=simple\nspring.rabbitmq.listener.simple.prefetch=10\nspring.rabbitmq.listener.simple.retry.enabled=true\nspring.rabbitmq.listener.simple.retry.max-retries=3\nspring.rabbitmq.listener.simple.retry.initial-interval=500ms\nspring.rabbitmq.listener.simple.retry.multiplier=2");
const MA146_BAY = java("/** BẪY: \"đã đúng\" vì chỉ gửi SAU commit — nhưng broker chết đúng lúc đó thì tin mất, không ai gửi lại. */\n@Component\nclass GuiSauCommit {\n    private final RabbitTemplate rabbit;\n    GuiSauCommit(RabbitTemplate rabbit) { this.rabbit = rabbit; }\n\n    @TransactionalEventListener\n    void khiQuyetDinh(BookingDecided e) {\n        var tin = new TinQuyetDinh(UUID.randomUUID(), e.bookingId(), e.ownerId(), e.labCode(), e.status(), e.reason());\n        rabbit.convertAndSend(\"labflow.booking\", \"booking.decided\", tin, m -> {\n            m.getMessageProperties().setMessageId(tin.eventId().toString());\n            return m;\n        });\n    }\n}");
const OUT146_STARTER = out("$ bash lam.sh starter && bash cham.sh ~/lab14/starter\nMục 1: TRƯỢT — labflow.email: durable=false, x-dead-letter-exchange=không có; labflow.email.dlq: HTTP 404\nMục 2: TRƯỢT — duyệt lượt #1: HTTP 200, email_log CONFIRMED = lỗi\nMục 3: TRƯỢT — content_type=?, payload=không thấy tin, message_id=không có\nMục 4: TRƯỢT — từ chối #2 khi broker dừng: HTTP 200; sau khi broker chạy lại, email_log REJECTED = \nMục 5: TRƯỢT — duyệt #3 với version sai: HTTP 409; tin trên exchange: 0; email_log: lỗi\nMục 6: TRƯỢT — gửi hai lần cùng eventId (routed: false/false) ⇒ email_log = lỗi\nMục 7: TRƯỢT — labflow.email.dlq: 0 ⇒ 0; tin hợp lệ phía sau: email_log = lỗi\nMục 8: TRƯỢT — lúc 09:05: 4:REJECTED 5:REJECTED 6:PENDING; lý do #4: \"Hết hạn duyệt\"; email REJECTED: +\nMục 9: TRƯỢT — hai instance cùng chạy job: email_log cho 2 lượt hết hạn = lỗi, tin trên exchange = 0 (cần 2 và 2)\nMục 10: TRƯỢT — 30 lượt duyệt qua A và B ⇒ tin trên exchange: 0, lượt khác nhau: 0\nĐiểm: 0/10");
const OUT146_GIAI = out("$ bash cham.sh ~/lab14/giai\nMục 1: ĐẠT   — labflow.email: durable=true, x-dead-letter-exchange=labflow.dlx; labflow.email.dlq: HTTP 200\nMục 2: ĐẠT   — duyệt lượt #1: HTTP 200, email_log CONFIRMED = 1\nMục 3: ĐẠT   — content_type=application/json, payload={\"eventId\":\"2169fd40-142c-4d6c-8c25-1a960e80cfc0\",\"bookingId\":1,\"status\":\"CONFIRMED\"}, message_id=2169fd40-142c-4d6c-8c25-1a960e80cfc0\nMục 4: ĐẠT   — từ chối #2 khi broker dừng: HTTP 200; sau khi broker chạy lại, email_log REJECTED = 1\nMục 5: ĐẠT   — duyệt #3 với version sai: HTTP 409; tin trên exchange: 0; email_log: 0\nMục 6: ĐẠT   — gửi hai lần cùng eventId (routed: true/true) ⇒ email_log = 1\nMục 7: ĐẠT   — labflow.email.dlq: 0 ⇒ 1; tin hợp lệ phía sau: email_log = 1\nMục 8: ĐẠT   — lúc 09:05: 4:REJECTED 5:REJECTED 6:PENDING; lý do #4: \"Hết hạn duyệt\"; email REJECTED: 1+1\nMục 9: ĐẠT   — hai instance cùng chạy job: email_log cho 2 lượt hết hạn = 2, tin trên exchange = 2 (cần 2 và 2)\nMục 10: ĐẠT   — 30 lượt duyệt qua A và B ⇒ tin trên exchange: 30, lượt khác nhau: 30\nĐiểm: 10/10");
const OUT146_BAY = out("$ bash cham.sh ~/lab14/bay      # lời giải, nhưng gửi thẳng RabbitMQ sau commit, không có outbox\nMục 1: ĐẠT   — labflow.email: durable=true, x-dead-letter-exchange=labflow.dlx; labflow.email.dlq: HTTP 200\nMục 2: ĐẠT   — duyệt lượt #1: HTTP 200, email_log CONFIRMED = 1\nMục 3: ĐẠT   — content_type=application/json, payload={\"eventId\":\"d7f4aea9-e7ad-4091-8375-de0b76939838\",\"bookingId\":1,\"status\":\"CONFIRMED\"}, message_id=d7f4aea9-e7ad-4091-8375-de0b76939838\nMục 4: TRƯỢT — từ chối #2 khi broker dừng: HTTP 200; sau khi broker chạy lại, email_log REJECTED = 0\nMục 5: ĐẠT   — duyệt #3 với version sai: HTTP 409; tin trên exchange: 0; email_log: 0\nMục 6: ĐẠT   — gửi hai lần cùng eventId (routed: true/true) ⇒ email_log = 1\nMục 7: ĐẠT   — labflow.email.dlq: 0 ⇒ 1; tin hợp lệ phía sau: email_log = 1\nMục 8: ĐẠT   — lúc 09:05: 4:REJECTED 5:REJECTED 6:PENDING; lý do #4: \"Hết hạn duyệt\"; email REJECTED: 1+1\nMục 9: ĐẠT   — hai instance cùng chạy job: email_log cho 2 lượt hết hạn = 2, tin trên exchange = 2 (cần 2 và 2)\nMục 10: ĐẠT   — 30 lượt duyệt qua A và B ⇒ tin trên exchange: 30, lượt khác nhau: 30\nĐiểm: 9/10");

const L146_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.6 · Lab</span>
<h2>Chapter 14 lab + interview questions</h2>
<p class="lead">The school's email service is unreliable: it goes down for minutes at a time, and sometimes delivers the same request twice. Your SWP391 team must still guarantee that every student is told when a booking is approved, rejected or expires — never zero times, never twice, and never about a decision that was rolled back. Your task: send every decision through RabbitMQ with an outbox, a relay that is safe on two instances, and an idempotent email worker with a dead-letter queue. A grader with ten checks runs your code against a real broker, stops it in the middle, sends duplicates and garbage, and moves the clock forward.</p>

<h3>The starting point</h3>
<p>The starter is LabFlow after lesson 14.2: the BR-13 job (<code>HetHanDuyet</code>) with ShedLock is there, <code>spring-boot-starter-amqp</code> is in the <code>pom.xml</code>, and <code>BookingDecided</code> is published on approve, reject and expiry. There is no queue, no outbox and no worker.</p>

<h3>The contract (what the grader assumes)</h3>
<ul>
  <li>Everything from Chapter 18/17: <code>mvn compile</code>, main class <code>vn.labflow.LabflowApplication</code>, <code>LABFLOW_DB_*</code>, profile <code>dev</code>, <code>LABFLOW_MANAGER_PASSWORD</code>, clock <code>LABFLOW_NOW</code>.</li>
  <li>RabbitMQ at <code>localhost:5672</code>, user <code>labflow</code>, password in <code>LABFLOW_RABBIT_PASSWORD</code>. Two instances (<code>:8080</code>, <code>:8081</code>) share one database and one broker.</li>
  <li>Topic exchange <code>labflow.booking</code>, routing key <code>booking.decided</code>; durable queue <code>labflow.email</code> with a dead-letter exchange; dead-letter queue <code>labflow.email.dlq</code>.</li>
  <li>Message body JSON with <code>eventId</code> (UUID), <code>bookingId</code>, <code>ownerId</code>, <code>labCode</code>, <code>status</code>, <code>reason</code>; AMQP <code>message_id</code> = <code>eventId</code>.</li>
  <li>The worker records each email in table <code>email_log(event_id uuid primary key, booking_id, kind, sent_at)</code>.</li>
</ul>

<h3>The grader</h3>
<p>It copies your project, compiles it (<code>mvn.sh</code> runs Maven in a JDK 21 container), starts PostgreSQL, RabbitMQ and <strong>two</strong> instances in a private network, binds its own listening queue to your exchange, then drives the API, the broker's HTTP API and <code>psql</code>. Passwords are generated per run.</p>
${MA146_CHAM}
<p>The starter, graded for real:</p>
${OUT146_STARTER}

<h3>Part A — tasks (graded)</h3>
<ol>
  <li><strong>Topology</strong> (item 1): declare the exchange, the queue with its dead-letter exchange, and the DLQ as Spring beans — lesson 14.5.</li>
  <li><strong>Outbox</strong> (items 2–5): every <code>BookingDecided</code> writes one outbox row <em>in the same transaction</em> as the decision; a relay publishes JSON with publisher confirms and marks rows sent. A decision made while RabbitMQ is stopped must still be delivered after it restarts; a decision that rolls back (stale version ⇒ 409) must produce nothing — lessons 14.3 and 14.4.</li>
  <li><strong>Idempotent worker</strong> (item 6): the same <code>eventId</code> delivered twice ⇒ one <code>email_log</code> row.</li>
  <li><strong>Poison message</strong> (item 7): a message that is not JSON ends up in <code>labflow.email.dlq</code>, and a valid message right behind it is still processed — lesson 14.5.</li>
  <li><strong>BR-13 through the queue</strong> (items 8–9): when the clock moves to 09:05, bookings starting before 11:05 are rejected with a reason starting "Hết hạn duyệt", each student gets exactly one email, even with two instances.</li>
  <li><strong>Two relays</strong> (item 10): 30 decisions split across both instances ⇒ exactly 30 messages, 30 different bookings.</li>
</ol>

<h3>Part B — write it down (not graded, checked in review)</h3>
<ul>
  <li>A "message contract" section in the README: exchange, routing key, JSON fields, who publishes, who consumes, delivery guarantee (at least once) and how duplicates are handled.</li>
  <li>A three-line runbook: "<code>labflow.email.dlq</code> is not empty — what do I check, how do I re-send?"</li>
</ul>

<h3>Rubric</h3>
<table>
  <thead><tr><th>Part</th><th>Points</th><th>What earns them</th></tr></thead>
  <tbody>
    <tr><td>Grader</td><td>10</td><td>One point per item that passes</td></tr>
    <tr><td>Message contract</td><td>2</td><td>Matches the code; states at-least-once and the deduplication key</td></tr>
    <tr><td>DLQ runbook</td><td>1</td><td>Concrete steps someone else could follow at 2 a.m.</td></tr>
    <tr><td>Code review</td><td>2</td><td>No network call inside the business transaction; no Java serialization; retry property names valid for Boot 4</td></tr>
  </tbody>
</table>

<h3>Hints</h3>
<ul>
  <li>Item 4 is the dual-write check. Sending from an <code>AFTER_COMMIT</code> listener passes items 2–3 and 5 and fails 4 — the trap version below.</li>
  <li>The outbox row must be written by code that runs <em>inside</em> the decision's transaction. A plain synchronous <code>@EventListener</code> on <code>BookingDecided</code> does exactly that — the one good use of a synchronous listener from lesson 14.3.</li>
  <li>Item 10 fails without <code>FOR UPDATE SKIP LOCKED</code> — sometimes. Lesson 14.4 measured 0, 197 and 150 duplicates in three rounds; run the grader more than once.</li>
  <li>Item 7: let invalid JSON fail in the message converter; Spring treats conversion errors as fatal and dead-letters them without retrying.</li>
  <li>In Boot 4 the retry property is <code>max-retries</code>, not <code>max-attempts</code> (lesson 14.5).</li>
</ul>

<h3>Self-check: the official solution and a trap</h3>
<p>The official solution, graded by the same script (the code is hidden below):</p>
${OUT146_GIAI}
<p>The same worker and topology, but instead of an outbox the decision is published from an <code>AFTER_COMMIT</code> listener — the version most people write after lesson 14.3:</p>
${MA146_BAY}
${OUT146_BAY}
<p>Only item 4 fails: the rejection made while the broker was stopped never reached the student. The API answered 200, the log has one "Invocation of listener … failed" line, and nothing in the system remembers that a message is owed.</p>
${giai('Show the solution (try first!)', `<p>Files added on top of the starter (module <code>notification</code>):</p><ul><li><code>db/migration/notification/V2026.11.25.1100__notification_outbox.sql</code> — outbox and <code>email_log</code>:</li></ul>` + MA146_SQL + `<ul><li><code>HopThuDi</code> — synchronous listener writing the outbox row in the decision's transaction:</li></ul>` + MA146_HOP + `<ul><li><code>RelayThu</code> — SKIP LOCKED, JSON, message id, persistent, wait for confirm, then mark:</li></ul>` + MA146_RELAY + `<ul><li><code>EmailWorker</code> — idempotent by <code>eventId</code> in the same transaction:</li></ul>` + MA146_WORKER + `<ul><li><code>HangDoiCauHinh</code> — topology and JSON converter, plus <code>TinQuyetDinh</code> (a record with the six fields):</li></ul>` + MA146_CFG + `<ul><li><code>application.properties</code>:</li></ul>` + MA146_PROPS)}

<h3>🎤 What the interviewer will ask (chapter 14)</h3>
<ol>
  <li><strong>"You need to send an email after a user registers. How?"</strong> — Not inside the transaction. For "nice to have": <code>@TransactionalEventListener</code> + <code>@Async</code> or <code>@ApplicationModuleListener</code>. For "must arrive": an outbox (or Modulith's registry) plus a broker and an idempotent consumer. Explain what happens if the process dies after commit.</li>
  <li><strong>"Default @Async executor and its risks?"</strong> — 8 threads, unbounded queue: overload becomes memory growth and lost work on restart; size it, bound it, name it, or use virtual threads with a concurrency limit.</li>
  <li><strong>"Scheduled job on three instances?"</strong> — Runs three times; use ShedLock or claim rows with <code>SKIP LOCKED</code>; make the job idempotent and give cron an explicit zone.</li>
  <li><strong>"At-least-once vs exactly-once?"</strong> — Brokers and outboxes give at-least-once; you get effectively-once with an idempotent consumer keyed on a message id, in the same transaction as the effect.</li>
  <li><strong>"A message keeps failing — what do you do?"</strong> — Bounded retries with backoff, then a dead-letter queue with an alert; separate transient from permanent errors; never requeue forever (measured: 4,471 deliveries in 5 s).</li>
</ol>

<h3>📌 Summary</h3>
<ul>
  <li>The lab turns every booking decision into a message that survives a broker outage, a rollback, duplicates, garbage and two instances.</li>
  <li>The starter scores what is already there; the official solution scores 10/10; sending after commit without an outbox loses exactly the message sent while the broker was down.</li>
  <li>Chapter 14 in one line: decide <em>when</em> work runs relative to the commit, <em>where</em> it is recorded, and <em>how</em> a second delivery is recognised.</li>
</ul>
</div>
`;

const L146_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.6 · Lab</span>
<h2>Lab chương 14 + câu hỏi phỏng vấn</h2>
<p class="lead">Dịch vụ email của trường chập chờn: có lúc chết vài phút, có lúc giao cùng một yêu cầu hai lần. Nhóm SWP391 của bạn vẫn phải bảo đảm mọi sinh viên được báo khi lượt đặt được duyệt, bị từ chối hoặc hết hạn — không bao giờ bằng không, không bao giờ hai lần, và không bao giờ báo về một quyết định đã bị rollback. Nhiệm vụ: đưa mọi quyết định qua RabbitMQ bằng outbox, một relay an toàn khi chạy hai instance, và một worker email idempotent có hàng chết. Bộ chấm mười mục chạy mã của bạn trên broker thật, dừng broker giữa chừng, gửi tin trùng và tin rác, và đẩy đồng hồ tới trước.</p>

<h3>Điểm xuất phát</h3>
<p>Bản khởi đầu là LabFlow sau bài 14.2: đã có job BR-13 (<code>HetHanDuyet</code>) với ShedLock, <code>spring-boot-starter-amqp</code> đã nằm trong <code>pom.xml</code>, và <code>BookingDecided</code> được phát khi duyệt, từ chối và hết hạn. Chưa có hàng đợi, chưa có outbox, chưa có worker.</p>

<h3>Hợp đồng (điều bộ chấm giả định)</h3>
<ul>
  <li>Mọi thứ từ Chương 18/17: <code>mvn compile</code>, lớp main <code>vn.labflow.LabflowApplication</code>, <code>LABFLOW_DB_*</code>, profile <code>dev</code>, <code>LABFLOW_MANAGER_PASSWORD</code>, đồng hồ <code>LABFLOW_NOW</code>.</li>
  <li>RabbitMQ ở <code>localhost:5672</code>, tài khoản <code>labflow</code>, mật khẩu trong <code>LABFLOW_RABBIT_PASSWORD</code>. Hai instance (<code>:8080</code>, <code>:8081</code>) dùng chung một CSDL và một broker.</li>
  <li>Exchange topic <code>labflow.booking</code>, routing key <code>booking.decided</code>; hàng bền <code>labflow.email</code> có dead-letter exchange; hàng chết <code>labflow.email.dlq</code>.</li>
  <li>Thân tin là JSON có <code>eventId</code> (UUID), <code>bookingId</code>, <code>ownerId</code>, <code>labCode</code>, <code>status</code>, <code>reason</code>; <code>message_id</code> của AMQP = <code>eventId</code>.</li>
  <li>Worker ghi mỗi email vào bảng <code>email_log(event_id uuid primary key, booking_id, kind, sent_at)</code>.</li>
</ul>

<h3>Bộ chấm</h3>
<p>Nó chép dự án của bạn, biên dịch (<code>mvn.sh</code> chạy Maven trong container JDK 21), khởi động PostgreSQL, RabbitMQ và <strong>hai</strong> instance trong một mạng riêng, gắn hàng nghe của chính nó vào exchange của bạn, rồi điều khiển API, HTTP API của broker và <code>psql</code>. Mật khẩu sinh mới mỗi lần chấm.</p>
${MA146_CHAM}
<p>Bản khởi đầu, chấm thật:</p>
${OUT146_STARTER}

<h3>Phần A — nhiệm vụ (có chấm)</h3>
<ol>
  <li><strong>Cấu trúc hàng</strong> (mục 1): khai báo exchange, hàng kèm dead-letter exchange, và hàng chết bằng bean Spring — bài 14.5.</li>
  <li><strong>Outbox</strong> (mục 2–5): mỗi <code>BookingDecided</code> ghi một dòng outbox <em>trong cùng giao dịch</em> với quyết định; relay đẩy JSON có publisher confirm rồi đánh dấu đã gửi. Quyết định đưa ra khi RabbitMQ dừng vẫn phải được giao sau khi nó chạy lại; quyết định bị rollback (version cũ ⇒ 409) thì không sinh ra gì — bài 14.3 và 14.4.</li>
  <li><strong>Worker idempotent</strong> (mục 6): cùng một <code>eventId</code> giao hai lần ⇒ một dòng <code>email_log</code>.</li>
  <li><strong>Tin độc</strong> (mục 7): tin không phải JSON phải vào <code>labflow.email.dlq</code>, và tin hợp lệ ngay sau nó vẫn được xử lý — bài 14.5.</li>
  <li><strong>BR-13 qua hàng đợi</strong> (mục 8–9): khi đồng hồ nhảy tới 09:05, các lượt bắt đầu trước 11:05 bị từ chối với lý do mở đầu "Hết hạn duyệt", mỗi sinh viên nhận đúng một email, kể cả khi có hai instance.</li>
  <li><strong>Hai relay</strong> (mục 10): 30 quyết định chia cho cả hai instance ⇒ đúng 30 tin, 30 lượt đặt khác nhau.</li>
</ol>

<h3>Phần B — viết ra giấy (không chấm tự động, xem khi review)</h3>
<ul>
  <li>Mục "hợp đồng tin nhắn" trong README: exchange, routing key, các trường JSON, ai phát, ai nhận, bảo đảm giao (ít nhất một lần) và cách xử lý tin trùng.</li>
  <li>Quy trình ba dòng: "<code>labflow.email.dlq</code> không rỗng — kiểm tra gì, gửi lại thế nào?"</li>
</ul>

<h3>Thang điểm</h3>
<table>
  <thead><tr><th>Phần</th><th>Điểm</th><th>Được điểm khi</th></tr></thead>
  <tbody>
    <tr><td>Bộ chấm</td><td>10</td><td>Mỗi mục đạt một điểm</td></tr>
    <tr><td>Hợp đồng tin nhắn</td><td>2</td><td>Khớp với mã; nói rõ ít nhất một lần và khoá chống trùng</td></tr>
    <tr><td>Quy trình hàng chết</td><td>1</td><td>Các bước cụ thể mà người khác làm theo được lúc 2 giờ sáng</td></tr>
    <tr><td>Review mã</td><td>2</td><td>Không gọi mạng trong giao dịch nghiệp vụ; không tuần tự hoá Java; tên thuộc tính retry đúng cho Boot 4</td></tr>
  </tbody>
</table>

<h3>Gợi ý</h3>
<ul>
  <li>Mục 4 là phép kiểm ghi hai nơi. Gửi từ listener <code>AFTER_COMMIT</code> thì qua mục 2–3 và 5 nhưng trượt mục 4 — chính là bản bẫy bên dưới.</li>
  <li>Dòng outbox phải được ghi bởi mã chạy <em>bên trong</em> giao dịch của quyết định. Một <code>@EventListener</code> đồng bộ thường trên <code>BookingDecided</code> làm đúng việc đó — cách dùng đúng duy nhất của listener đồng bộ ở bài 14.3.</li>
  <li>Mục 10 trượt khi thiếu <code>FOR UPDATE SKIP LOCKED</code> — đôi khi thôi. Bài 14.4 đo được 0, 197 và 150 bản trùng qua ba lượt; hãy chấm hơn một lần.</li>
  <li>Mục 7: để JSON sai hỏng ngay ở bộ chuyển đổi tin; Spring coi lỗi chuyển đổi là lỗi chết và đưa vào hàng chết không thử lại.</li>
  <li>Ở Boot 4 thuộc tính retry là <code>max-retries</code>, không phải <code>max-attempts</code> (bài 14.5).</li>
</ul>

<h3>Tự kiểm: lời giải chính thức và một cái bẫy</h3>
<p>Lời giải chính thức, chấm bằng cùng script (mã ẩn bên dưới):</p>
${OUT146_GIAI}
<p>Cùng worker và cấu trúc hàng, nhưng thay vì outbox thì quyết định được phát từ một listener <code>AFTER_COMMIT</code> — bản mà hầu hết mọi người viết sau bài 14.3:</p>
${MA146_BAY}
${OUT146_BAY}
<p>Chỉ mục 4 trượt: lời từ chối đưa ra lúc broker dừng không bao giờ tới sinh viên. API trả 200, log có một dòng "Invocation of listener … failed", và không chỗ nào trong hệ thống nhớ rằng còn nợ một tin.</p>
${giai('Xem lời giải (hãy tự làm trước!)', `<p>Các tệp thêm vào bản khởi đầu (module <code>notification</code>):</p><ul><li><code>db/migration/notification/V2026.11.25.1100__notification_outbox.sql</code> — outbox và <code>email_log</code>:</li></ul>` + MA146_SQL + `<ul><li><code>HopThuDi</code> — listener đồng bộ ghi dòng outbox trong giao dịch của quyết định:</li></ul>` + MA146_HOP + `<ul><li><code>RelayThu</code> — SKIP LOCKED, JSON, message id, persistent, chờ xác nhận rồi mới đánh dấu:</li></ul>` + MA146_RELAY + `<ul><li><code>EmailWorker</code> — idempotent theo <code>eventId</code> trong cùng giao dịch:</li></ul>` + MA146_WORKER + `<ul><li><code>HangDoiCauHinh</code> — cấu trúc hàng và bộ chuyển JSON, cùng <code>TinQuyetDinh</code> (record sáu trường):</li></ul>` + MA146_CFG + `<ul><li><code>application.properties</code>:</li></ul>` + MA146_PROPS)}

<h3>🎤 Phỏng vấn viên sẽ hỏi (chương 14)</h3>
<ol>
  <li><strong>"Cần gửi email sau khi người dùng đăng ký. Làm thế nào?"</strong> — Không trong giao dịch. Nếu "có thì tốt": <code>@TransactionalEventListener</code> + <code>@Async</code> hoặc <code>@ApplicationModuleListener</code>. Nếu "bắt buộc phải tới": outbox (hoặc sổ sự kiện của Modulith) cộng broker và consumer idempotent. Giải thích chuyện gì xảy ra nếu tiến trình chết sau commit.</li>
  <li><strong>"Executor @Async mặc định và rủi ro của nó?"</strong> — 8 luồng, hàng đợi vô hạn: quá tải biến thành phình bộ nhớ và mất việc khi khởi động lại; hãy đặt cỡ, giới hạn, đặt tên, hoặc dùng virtual thread kèm giới hạn đồng thời.</li>
  <li><strong>"Job hẹn giờ trên ba instance?"</strong> — Chạy ba lần; dùng ShedLock hoặc giành dòng bằng <code>SKIP LOCKED</code>; viết job idempotent và cho cron múi giờ tường minh.</li>
  <li><strong>"At-least-once khác exactly-once thế nào?"</strong> — Broker và outbox cho at-least-once; bạn đạt "coi như một lần" bằng consumer idempotent theo mã tin, trong cùng giao dịch với tác động.</li>
  <li><strong>"Một tin cứ hỏng mãi — bạn làm gì?"</strong> — Retry có giới hạn và backoff, rồi hàng chết kèm cảnh báo; tách lỗi tạm thời với lỗi vĩnh viễn; không bao giờ requeue vô hạn (đã đo: 4.471 lần giao trong 5 giây).</li>
</ol>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Lab biến mọi quyết định đặt phòng thành một tin sống sót qua broker chết, rollback, tin trùng, tin rác và hai instance.</li>
  <li>Bản khởi đầu được điểm cho những gì đã có; lời giải chính thức 10/10; gửi sau commit mà không có outbox làm mất đúng cái tin gửi lúc broker chết.</li>
  <li>Chương 14 trong một dòng: quyết định việc chạy <em>khi nào</em> so với commit, được ghi lại <em>ở đâu</em>, và lần giao thứ hai được nhận ra <em>bằng cách nào</em>.</li>
</ul>
</div>
`;

const Q = (question, options, correctIndex) => ({ question, options, correctIndex, points: 1 });
const QUIZ14 = [
  Q('A controller calls this.gui(...) where gui is @Async. What did the measurement show?|||Controller gọi this.gui(...) trong đó gui có @Async. Phép đo cho thấy gì?', [
    'The email ran on task-1 and the request took 6 ms|||Email chạy trên task-1 và request mất 6 ms',
    'The call skipped the proxy: 2,007 ms on the request thread|||Lời gọi đi vòng qua proxy: 2.007 ms trên luồng request',
    'Spring threw an exception at startup|||Spring ném exception lúc khởi động',
    'The email was never sent|||Email không bao giờ được gửi',
  ], 1),
  Q('Boot 4 default async executor, 100 jobs of 1 second each. How long until all finished?|||Executor async mặc định của Boot 4, 100 việc mỗi việc 1 giây. Bao lâu thì xong hết?', [
    '≈1 s: one thread per job|||≈1 giây: mỗi việc một luồng',
    '≈13 s: 8 core threads, unbounded queue|||≈13 giây: 8 luồng lõi, hàng đợi vô hạn',
    '≈4 s, and 72 jobs rejected|||≈4 giây, và 72 việc bị từ chối',
    '≈100 s: one thread|||≈100 giây: một luồng',
  ], 1),
  Q('MODE_INHERITABLETHREADLOCAL with a pool of 2 threads; An calls twice, then Bình calls. Whom did Bình\'s async job see?|||MODE_INHERITABLETHREADLOCAL với pool 2 luồng; An gọi hai lần, rồi Bình gọi. Việc async của Bình thấy ai?', [
    'Bình|||Bình', 'null|||null', 'An|||An', 'The manager account|||Tài khoản quản lý',
  ], 2),
  Q('Two @Scheduled methods: a 5-second report and a 1-second heartbeat, default Boot scheduler. How often did the heartbeat run?|||Hai phương thức @Scheduled: báo cáo 5 giây và nhịp tim 1 giây, scheduler mặc định của Boot. Nhịp tim chạy bao lâu một lần?', [
    'Every second, on its own thread|||Mỗi giây, trên luồng riêng',
    'About every 5 seconds: one scheduler thread|||Khoảng 5 giây một lần: scheduler chỉ có một luồng',
    'Never: the report blocks it forever|||Không bao giờ: báo cáo chặn nó mãi',
    'Twice per second to catch up|||Hai lần mỗi giây để bù',
  ], 1),
  Q('cron = "0 0 7 * * MON-FRI" without zone, in a container with TZ=UTC. When does it run in Vietnam time?|||cron = "0 0 7 * * MON-FRI" không có zone, trong container TZ=UTC. Nó chạy lúc mấy giờ giờ Việt Nam?', [
    '07:00|||07:00', '00:00|||00:00', '14:00|||14:00', 'It fails at startup|||Hỏng lúc khởi động',
  ], 2),
  Q('Two instances run the reminder job with ShedLock @SchedulerLock. 20 bookings to remind. How many emails?|||Hai instance chạy job nhắc lịch có @SchedulerLock của ShedLock. Có 20 lịch cần nhắc. Bao nhiêu email?', [
    '40|||40', '20, all from one instance|||20, tất cả từ một instance', '10 from each|||Mỗi bên 10', '0: the lock blocks both|||0: khoá chặn cả hai',
  ], 1),
  Q('A @TransactionalEventListener (AFTER_COMMIT, no REQUIRES_NEW) calls repository.save(newEntity). What happened?|||Một @TransactionalEventListener (AFTER_COMMIT, không REQUIRES_NEW) gọi repository.save(entityMoi). Chuyện gì xảy ra?', [
    'The row was saved in the committed transaction|||Dòng được lưu trong giao dịch đã commit',
    'An exception rolled back the booking|||Một exception làm rollback lượt đặt',
    'Nothing was saved and nothing was logged|||Không có gì được lưu và không có log nào',
    'The application refused to start|||Ứng dụng từ chối khởi động',
  ], 2),
  Q('A booking is saved and a message is sent to RabbitMQ inside the same @Transactional method; the transaction then fails. What does the consumer get?|||Lượt đặt được lưu và tin được gửi sang RabbitMQ trong cùng phương thức @Transactional; sau đó giao dịch hỏng. Bên nhận nhận gì?', [
    'Nothing: Spring cancels the message|||Không gì: Spring huỷ tin',
    'A message about a booking that does not exist|||Một tin về lượt đặt không tồn tại',
    'The message after the retry succeeds|||Tin sau khi retry thành công',
    'A message in the dead-letter queue|||Một tin trong hàng chết',
  ], 1),
  Q('Two outbox relays poll the same table WITHOUT "for update skip locked". Three rounds of 200 bookings gave:|||Hai relay outbox quét cùng bảng KHÔNG có "for update skip locked". Ba lượt, mỗi lượt 200 lượt đặt, cho ra:', [
    '0 duplicates every time|||0 bản trùng mọi lần',
    'Exactly 200 duplicates every time|||Đúng 200 bản trùng mọi lần',
    '0, then 197, then 150 duplicates|||0, rồi 197, rồi 150 bản trùng',
    'A deadlock on the first round|||Deadlock ngay lượt đầu',
  ], 2),
  Q('In Spring Boot 4.1.2 you set spring.rabbitmq.listener.simple.retry.max-attempts=3. What happens?|||Trong Spring Boot 4.1.2 bạn đặt spring.rabbitmq.listener.simple.retry.max-attempts=3. Chuyện gì xảy ra?', [
    'Exactly 3 attempts|||Đúng 3 lần thử',
    'Startup fails with an unknown property|||Khởi động hỏng vì thuộc tính lạ',
    'It is ignored; the default max-retries=3 gives 4 attempts|||Bị bỏ qua; mặc định max-retries=3 cho 4 lần thử',
    'Retries become infinite|||Thử lại vô hạn',
  ], 2),
];
const L = (n, slug, en, vi, description, content) => ({
  title: `14.${n} — ${en}|||14.${n} — ${vi}`, slug, type: 'LESSON', isFreePreview: false, description, content,
});

export default {
  title: 'Chapter 14 — Background work: async, scheduling, events and queues|||Chương 14 — Việc nền: async, hẹn giờ, sự kiện và hàng đợi',
  description: 'Việc nền cho LabFlow, đo thật trên một và hai instance với PostgreSQL và RabbitMQ: @Async và executor (pool mặc định, virtual thread, từ chối, lỗi bị nuốt, ngữ cảnh bảo mật rò sang người khác, tắt êm); @Scheduled (rate/delay, một luồng, múi giờ, BR-13 tự từ chối lượt quá hạn, ShedLock, SKIP LOCKED); sự kiện và pha giao dịch, sổ sự kiện Spring Modulith; outbox; RabbitMQ (tin độc, hàng chết, prefetch, ack, CVE-2023-34050); lab có bộ chấm 10 mục.',
  lessons: [
    L(1, 'sb-14-1-async', '@Async and executors', '@Async và executor',
      'Cùng một email hai giây gọi thẳng, qua @Async và qua this (2.008 / 6 / 2.007 ms); pool mặc định 8 luồng hàng đợi vô hạn (100 việc 13 giây), virtual thread 1 giây, pool có giới hạn từ chối 72/100; lỗi của @Async void chỉ thành một dòng log; MODE_INHERITABLETHREADLOCAL chạy việc của Bình dưới tên An, TaskDecorator sửa; docker stop 10 giây giết 4/20 việc; sự cố phiên GitHub 2021.',
      L141_EN + L141_VI),
    L(2, 'sb-14-2-scheduled', '@Scheduled jobs', 'Tác vụ hẹn giờ @Scheduled',
      'fixedRate và fixedDelay với job chậm; một luồng scheduler làm nhịp tim 1 giây thành 5 giây; exception không dừng lịch; cron không zone chạy 14 giờ thay vì 7 giờ, cron năm trường hỏng lúc khởi động; job thật BR-13 tự từ chối lượt chưa duyệt với Clock, ShedLock và SKIP LOCKED; hai instance gửi 40 email cho 20 lời nhắc, ShedLock 20, SKIP LOCKED 10 + 10; sự cố ngày nhuận Azure 2012.',
      L142_EN + L142_VI),
    L(3, 'sb-14-3-application-event', 'Application events and @TransactionalEventListener', 'Sự kiện ứng dụng và @TransactionalEventListener',
      'Năm kiểu listener đo trên cùng sự kiện: listener đồng bộ làm email thành một phần lượt đặt, email hỏng huỷ lượt đặt, rollback để lại email ma; @Async @EventListener chạy trước commit, không thấy dòng; AFTER_COMMIT không gọi khi rollback, ghi JPA không REQUIRES_NEW biến mất lặng lẽ; @ApplicationModuleListener và sổ sự kiện Spring Modulith giao lại sự kiện sau khi ứng dụng bị giết.',
      L143_EN + L143_VI),
    L(4, 'sb-14-4-outbox', 'The transactional outbox', 'Mẫu transactional outbox',
      'Ghi CSDL rồi gửi RabbitMQ trong một giao dịch: tin tới trước commit, tin cho lượt đặt bị rollback, broker dừng làm lượt đặt thành 500; outbox trả 200 và giao khi broker chạy lại; quên publisher confirm ⇒ một tin bị gửi lại 126 lần; hai relay có SKIP LOCKED 0 trùng, bỏ khoá 0/197/150 trùng; relay chết giữa gửi và đánh dấu ⇒ giao trùng, bảng mã đã xử lý chặn được.',
      L144_EN + L144_VI),
    L(5, 'sb-14-5-rabbitmq', 'Message queues with RabbitMQ', 'Hàng đợi tin nhắn với RabbitMQ',
      'Exchange/queue/binding của LabFlow; tin độc bị giao lại 4.471 lần trong 5 giây; Boot 4 đổi retry.max-attempts thành max-retries (tên cũ bị bỏ qua), hàng chết có x-death; concurrency 5 nhanh gấp 5 trừ khi tồn đọng sẵn với prefetch 250, prefetch 1 sửa được; tin chưa ack sống sót khi consumer bị giết; Spring AMQP từ chối tin tuần tự hoá Java (CVE-2023-34050); so với BullMQ.',
      L145_EN + L145_VI),
    L(6, 'sb-14-6-lab-14', 'Chapter 14 lab + interview questions', 'Lab chương 14 + câu hỏi phỏng vấn',
      'Lab có bộ chấm 10 mục trên RabbitMQ và hai instance thật: thông báo mọi quyết định duyệt/từ chối/hết hạn qua outbox, relay an toàn với SKIP LOCKED, worker email idempotent có hàng chết, sống sót khi broker dừng, không sinh tin khi rollback, BR-13 một email mỗi lượt. Bản khởi đầu, lời giải 10/10 (ẩn), bẫy gửi sau commit 9/10. Năm câu phỏng vấn của chương.',
      L146_EN + L146_VI),
    {
      title: '14.7 — Chapter 14 quiz|||14.7 — Kiểm tra chương 14',
      slug: 'sb-14-7-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về những gì đã chạy thật trong chương: @Async qua this, pool mặc định, ngữ cảnh bảo mật rò qua pool, một luồng scheduler, cron không múi giờ, ShedLock trên hai instance, ghi JPA sau commit, gửi tin trong giao dịch bị rollback, relay không khoá, tên thuộc tính retry của Boot 4.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every answer is something that ran in this chapter — a background job that worked as the wrong user, a 7 o'clock job at 14:00, forty emails for twenty reminders, a save that vanished after commit, and a retry setting Boot 4 quietly ignored.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Đáp án nào cũng là thứ đã chạy trong chương — một việc nền làm dưới danh nghĩa người khác, một job 7 giờ chạy lúc 14 giờ, bốn mươi email cho hai mươi lời nhắc, một lệnh lưu biến mất sau commit, và một thuộc tính retry bị Boot 4 lặng lẽ bỏ qua.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ14 },
    },
  ],
};
