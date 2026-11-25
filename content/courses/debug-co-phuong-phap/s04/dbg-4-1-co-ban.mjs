/**
 * 4.1 — Cấu hình chạy debug, frame, biến, Evaluate Expression và watch (soạn 24/11/2026).
 * Ứng dụng mẫu LabFlow Java (Spring Boot 4.1.1 + JPA/Hibernate 7 + PostgreSQL 16) — mã thật ở _ma-4.mjs, lưu vbg-dp/scratchpad/dbg/lab/ch4.
 * Máy soạn không có phiên GUI ⇒ không có ảnh IntelliJ; mọi output debugger lấy từ jdb (JDK 25) gắn qua JDWP — đúng giao thức IntelliJ dùng.
 * Thao tác IntelliJ mô tả theo tài liệu JetBrains (IntelliJ IDEA 2025.x). Phiên: s41.txt, s41b.txt.
 */
import { nguon, lienKet } from '../_chung.mjs';
import { POM, PROPS, DATCHO, HOADON, CONTROLLER, DULIEU, CHAY } from './_ma-4.mjs';

const ma = (s, lang = 'java') => `<pre><code class="language-${lang}">${s}</code></pre>`;

const OUT_TRIEU_CHUNG = `<div class="out">$ docker run -d --name dbg-pg -e POSTGRES_PASSWORD=dbg -e POSTGRES_DB=labflow -p 127.0.0.1:45432:5432 postgres:16
$ cd ~/dbg-lab/ch4/app &amp;&amp; mvn -q package -DskipTests &amp;&amp; mvn -q dependency:copy-dependencies -DincludeScope=runtime -DoutputDirectory=target/lib
$ ../chay.sh
$ head -1 ../app.log
Listening for transport dt_socket at address: 45005          ← JDWP is on, like IntelliJ's Debug button
$ curl -s 127.0.0.1:48080/api/dat-cho/1
{"id":1,"phong":"Lab 401","nguoiDat":"SE1801","batDau":"2026-11-23T01:00:00Z","soPhut":90,"trangThai":"DA_DUYET","ghiChu":null}
$ curl -s 127.0.0.1:48080/api/dat-cho/1/hoa-don
{"datChoId":1,"phong":"Lab 401","soPhut":90,"tamTinh":45000,"giam":0,"thanhTien":45000}
                                         ← 90 minutes at 45,000/hour should be 67,500</div>`;

const OUT_WHERE = `<div class="out">$ jdb -sourcepath src/main/java -attach 127.0.0.1:45005
&gt; stop at vn.labflow.service.HoaDonService:18
Set breakpoint vn.labflow.service.HoaDonService:18
&gt;                                          # meanwhile: curl -s 127.0.0.1:48080/api/dat-cho/1/hoa-don
Breakpoint hit: "thread=http-nio-127.0.0.1-48080-exec-3", vn.labflow.service.HoaDonService.tinh(), line=18 bci=20
18        long giam = tinhGiam(tamTinh, ma);

http-nio-127.0.0.1-48080-exec-3[1] where
  [1] vn.labflow.service.HoaDonService.tinh (HoaDonService.java:18)          ← yours
  [2] vn.labflow.web.DatChoController.hoaDon (DatChoController.java:50)      ← yours
  [3] java.lang.invoke.LambdaForm$DMH/0x000000009fb64400.invokeVirtual (null)
  …
  [9] org.springframework.web.method.support.InvocableHandlerMethod.doInvoke (InvocableHandlerMethod.java:252)
  …
  [15] org.springframework.web.servlet.DispatcherServlet.doDispatch (DispatcherServlet.java:963)
  …
  [66] org.springframework.security.web.csrf.CsrfFilter.doFilterInternal (CsrfFilter.java:118)
  …
  [123] org.apache.catalina.connector.CoyoteAdapter.service (CoyoteAdapter.java:347)
  …
  [133] java.lang.Thread.run (Thread.java:1,474)
http-nio-127.0.0.1-48080-exec-3[1] locals
Method arguments:
d = instance of vn.labflow.model.DatCho(id=16106)
ma = null
Local variables:
giaGio = 45000
tamTinh = 45000</div>`;

const OUT_EVAL = `<div class="out">&gt; stop at vn.labflow.service.HoaDonService:17
Breakpoint hit: "thread=http-nio-127.0.0.1-48080-exec-5", vn.labflow.service.HoaDonService.tinh(), line=17 bci=8
17        long tamTinh = d.getSoPhut() / 60 * giaGio;

exec-5[1] print d.getSoPhut()
 d.getSoPhut() = 90
exec-5[1] print d.getSoPhut() / 60                    # Evaluate the sub-expression
 d.getSoPhut() / 60 = 1                               ← integer division: 1.5 hours became 1
exec-5[1] print d.getSoPhut() / 60.0 * giaGio
 d.getSoPhut() / 60.0 * giaGio = 67500.0              ← the number the customer expected
exec-5[1] up                                          # select frame [2], the controller
exec-5[2] locals
Method arguments:
id = 1
ma = null
exec-5[2] print datCho.tim(2L).getNguoiDat()          # call a Spring service (and the repository behind it) while paused
 datCho.tim(2L).getNguoiDat() = "SE1802"
exec-5[2] print datCho.tim(2L).getSoPhut()
 datCho.tim(2L).getSoPhut() = 90
exec-5[2] down
exec-5[1] set d.soPhut = 120                          # Set Value: try the hypothesis "whole hours are fine"
 d.soPhut = 120 = 120
exec-5[1] next
Step completed: … HoaDonService.tinh(), line=18 bci=20
exec-5[1] print tamTinh
 tamTinh = 90000                                      ← 2 h × 45,000 is right: only non-whole hours are wrong
exec-5[1] cont
$ curl -s 127.0.0.1:48080/api/dat-cho/1/hoa-don        # the paused request, now finished
{"datChoId":1,"phong":"Lab 401","soPhut":120,"tamTinh":90000,"giam":0,"thanhTien":90000}
$ curl -s 127.0.0.1:48080/api/dat-cho/1
{"id":1,…,"soPhut":90,…}                              ← Set Value changed memory only; the database still says 90</div>`;

const BANG_PHIM = `<table>
<thead><tr><th>Action / Thao tác</th><th>IntelliJ (Windows/Linux)</th><th>IntelliJ (macOS)</th><th>jdb</th></tr></thead>
<tbody>
<tr><td>Debug run / Chạy debug</td><td>Shift+F9</td><td>⌃D</td><td><code>java -agentlib:jdwp=…</code> + <code>jdb -attach</code></td></tr>
<tr><td>Toggle breakpoint / Đặt breakpoint</td><td>Ctrl+F8</td><td>⌘F8</td><td><code>stop at Lớp:dòng</code></td></tr>
<tr><td>Step over</td><td>F8</td><td>F8</td><td><code>next</code></td></tr>
<tr><td>Step into</td><td>F7</td><td>F7</td><td><code>step</code></td></tr>
<tr><td>Step out</td><td>Shift+F8</td><td>⇧F8</td><td><code>step up</code></td></tr>
<tr><td>Run to cursor</td><td>Alt+F9</td><td>⌥F9</td><td>(breakpoint tạm + <code>cont</code>)</td></tr>
<tr><td>Resume</td><td>F9</td><td>⌘⌥R</td><td><code>cont</code></td></tr>
<tr><td>Evaluate Expression</td><td>Alt+F8</td><td>⌥F8</td><td><code>print</code> / <code>eval</code></td></tr>
<tr><td>Set Value</td><td>F2 (trong Variables)</td><td>F2</td><td><code>set biến = giá trị</code></td></tr>
<tr><td>View breakpoints</td><td>Ctrl+Shift+F8</td><td>⌘⇧F8</td><td><code>clear</code> (liệt kê)</td></tr>
</tbody></table>`;

const NGUON = [
  nguon('🧠', 'IntelliJ IDEA — Debug code (tutorial + reference)', 'Debug run configuration, Frames, Variables, Watches, Evaluate Expression, Set Value.', 'https://www.jetbrains.com/help/idea/debugging-code.html'),
  nguon('⌨️', 'IntelliJ IDEA — Evaluate expressions', 'Alt+F8: biểu thức, gọi phương thức, code fragment nhiều dòng; side effect có thật.', 'https://www.jetbrains.com/help/idea/examining-suspended-program.html#evaluating-expressions'),
  nguon('☕', 'Oracle — The jdb command (JDK 25)', 'stop at / where / locals / print / set / up / down — CLI trên cùng JDWP.', 'https://docs.oracle.com/en/java/javase/25/docs/specs/man/jdb.html'),
  nguon('🔌', 'Oracle — JPDA architecture (JVM TI · JDWP · JDI)', 'Ba tầng mà mọi debugger Java đứng trên đó, kể cả IntelliJ.', 'https://docs.oracle.com/en/java/javase/25/docs/specs/jpda/architecture.html'),
  nguon('🐱', 'Apache Tomcat — catalina.sh jpda start', 'Debug Tomcat cài ngoài (WAR, JSP — kiểu PRJ301): JPDA_ADDRESS, JPDA_SUSPEND.', 'https://tomcat.apache.org/tomcat-10.1-doc/RUNNING.txt'),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-2-2-java', title: 'Bài 2.2 — đọc stack trace Java và Spring', sub: 'Frame nào là của bạn trong 133 frame: kỹ năng đọc y hệt.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'spring-boot', bai: 'sb-3-1-ioc-container', title: 'Spring Boot 3.1 — IoC container và bean', sub: 'Vì sao datCho trong controller là một proxy do Spring tạo.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '4.1 — Debug run configurations, frames, variables, Evaluate Expression and watches|||4.1 — Cấu hình chạy debug, frame, biến, Evaluate Expression và watch',
  slug: 'dbg-4-1-co-ban',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Dựng LabFlow Java (Spring Boot 4.1 + JPA + PostgreSQL 16), chạy debug như IntelliJ (JDWP), đọc 133 frame của một request để tìm 2 frame của mình, xem biến, Evaluate gọi được cả service/repository khi đang dừng, Set Value để thử giả thuyết. Bắt lỗi thật: hoá đơn 90 phút tính thành 45.000 thay vì 67.500 vì chia số nguyên. Debug Tomcat cài ngoài bằng catalina.sh jpda. Output thật từ jdb (cùng giao thức JDWP với IntelliJ).',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>The invoice is wrong by 22,500 VND — find out why without adding a single println</h2>
<p class="lead">In most Java teams you will join, the debugger is IntelliJ IDEA. This chapter uses a small Spring Boot service, <strong>LabFlow Java</strong> (booking lab rooms, the same domain as chapter 3), with real bugs planted in it. In this lesson you learn the four panels you use every day — Frames, Variables, Watches, Evaluate — and how to run a Spring Boot app or an external Tomcat in debug mode.</p>

<h3>About the outputs in this chapter</h3>
<p>IntelliJ is a GUI; the machine these lessons were run on has none. Every debugger output below comes from <code>jdb</code>, the command-line debugger in the JDK, attached through <strong>JDWP</strong> — the same wire protocol IntelliJ uses (both are clients of the JVM's debug agent, see the JPDA link). So what you see — frames, variable values, evaluation results — is exactly what IntelliJ shows in its panels, only as text. Each IntelliJ action is given next to its jdb command, so you can also follow along in a terminal.</p>

<h3>An everyday picture: the X-ray, not the guess</h3>
<p>A doctor who adds <code>println</code> is a doctor who asks the patient to come back tomorrow after each question. The debugger is the X-ray: you stop the patient at one moment and look at everything inside — who called whom (frames), what each variable holds (variables), and you can even ask "what would happen if…" (evaluate) without operating.</p>

<h3>1. The sample app — build it once</h3>
<p>Spring Boot 4.1.1, Java 21, Spring Data JPA on PostgreSQL 16, Spring Security, Actuator. Rooms (<code>Phong</code>), students (<code>SinhVien</code>) and bookings (<code>DatCho</code>). The project files you need for this lesson:</p>
${ma(POM, 'xml')}
${ma(PROPS, 'properties')}
${ma(DATCHO)}
${ma(HOADON)}
${ma(CONTROLLER)}
<p>Eight bookings are seeded at start-up (<code>ddl-auto=create</code> rebuilds the schema each run, so every run starts from the same data):</p>
${ma(DULIEU)}

<h3>2. Starting in debug mode</h3>
<p><strong>In IntelliJ:</strong> open the folder (it detects Maven), open <code>LabFlowApp</code> and click the green bug next to <code>main</code> (or Shift+F9 / ⌃D on the run configuration). IntelliJ creates a Spring Boot or Application run configuration and adds the debug agent itself. With Maven only: <code>mvn spring-boot:run -Dspring-boot.run.jvmArguments="-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=127.0.0.1:5005"</code> and attach (lesson 4.5).</p>
<p><strong>What IntelliJ actually does</strong> is start Java with the classpath of your modules and the JDWP agent. The script below does exactly that, so the jdb sessions in this chapter run against the same thing:</p>
${ma(CHAY, 'bash')}
${OUT_TRIEU_CHUNG}
<p><strong>Tomcat installed separately (WAR/JSP projects, e.g. PRJ301):</strong> IntelliJ Community has no Tomcat run configuration. Start Tomcat with <code>catalina.sh jpda start</code> (<code>catalina.bat jpda start</code> on Windows); it opens JDWP on <code>JPDA_ADDRESS</code> (default <code>localhost:8000</code>). Then use <em>Remote JVM Debug</em> on port 8000 — the same attach as lesson 4.5. IntelliJ Ultimate has a Tomcat Local configuration that does this for you.</p>

<h3>3. Frames: 133 lines, two of them yours</h3>
<p>Set a breakpoint in <code>HoaDonService.tinh</code> (click the gutter, or Ctrl+F8 / ⌘F8) and call the invoice endpoint. IntelliJ's <em>Frames</em> panel lists the call stack; jdb's <code>where</code> prints it:</p>
${OUT_WHERE}
<p>Read it like a stack trace from chapter 2: the top frames under <code>vn.labflow</code> are yours, everything below is Spring MVC (DispatcherServlet), Spring Security (twelve filters, CsrfFilter among them), and Tomcat. IntelliJ greys out library frames and can hide them (funnel icon "Hide Frames from Libraries"). Clicking a frame — <code>up</code>/<code>down</code> in jdb — shows that frame's variables: in frame [2] you see the controller's <code>id</code> and <code>ma</code>.</p>

<h3>4. Variables, Evaluate and Set Value: test the hypothesis while paused</h3>
<p>Variables shows <code>tamTinh = 45000</code>. Hypothesis: the division by 60 loses the half hour. Do not edit and restart — select the sub-expression in the editor and press Alt+F8 / ⌥F8 (Evaluate):</p>
${OUT_EVAL}
<p>Four things this session proves:</p>
<ol>
<li><strong>Evaluate any sub-expression.</strong> <code>d.getSoPhut() / 60</code> is <code>1</code>: Java integer division drops the fraction before the multiplication. The fix is to multiply first (<code>d.getSoPhut() * giaGio / 60</code>) or use <code>BigDecimal</code> for money.</li>
<li><strong>Evaluate can call your code.</strong> From the controller frame, <code>datCho.tim(2L)</code> ran a real query through the Spring proxy, the transaction and the repository. Powerful — and dangerous: evaluating <code>repo.deleteAll()</code> really deletes. Treat Evaluate like a production console.</li>
<li><strong>Set Value tests "what if" in seconds.</strong> With 120 minutes the result is right, so the bug only hits non-whole hours — a test case you must add.</li>
<li><strong>Set Value changes memory, not the database</strong> — here. This GET ran outside a write transaction, so nothing was flushed. Inside a <code>@Transactional</code> method, changing a field of a managed entity <em>would</em> be saved at commit (dirty checking). Know which you are in before you "just try a value".</li>
</ol>
<p><strong>Watches</strong> (the glasses icon, or right-click → Add to Watches) are evaluations that re-run at every stop: add <code>d.getSoPhut() / 60.0 * giaGio</code> and it updates as you step through several bookings. IntelliJ also shows inline values next to each line in the editor.</p>
${BANG_PHIM}

<h3>Workplace situation</h3>
<p>A tester files: "invoice for booking #1 shows 45,000, customer says 67,500". In outsourcing you often cannot touch the test database. Reproduce locally with the same data, stop in the calculation, evaluate the sub-expressions and paste the session into the ticket: "<code>90 / 60 = 1</code> (int); fix: multiply first; added test for 90 minutes". That is a two-line root cause, not "fixed rounding".</p>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok">
<ol>
<li>Build and run LabFlow Java in debug (IntelliJ bug icon, or <code>chay.sh</code> + <code>jdb -attach 127.0.0.1:45005</code>).</li>
<li>Stop in <code>tinh</code> for booking 1, find your two frames, hide library frames.</li>
<li>Evaluate <code>d.getSoPhut() / 60</code> and <code>d.getSoPhut() / 60.0 * giaGio</code>; from the controller frame evaluate <code>datCho.tim(4L).getGhiChu()</code>.</li>
<li>Set <code>soPhut</code> to 120, then to 45 — write down which values give a wrong price.</li>
<li>Write a JUnit test for 90 minutes that fails now (the test file is in lesson 4.6) — then fix by multiplying first.</li>
</ol>
<p><strong>Done when:</strong> you can explain the bug in one sentence with the evaluated values, and the test is red before / green after the fix.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">JDWP</span><span class="v">Java Debug Wire Protocol — the protocol between the JVM debug agent and any debugger.</span></div>
  <div class="kv"><span class="k">Frame</span><span class="v">One method call on the stack, with its own local variables.</span></div>
  <div class="kv"><span class="k">Evaluate Expression</span><span class="v">Run any expression in the context of the selected frame.</span></div>
  <div class="kv"><span class="k">Watch</span><span class="v">An expression re-evaluated at every stop.</span></div>
  <div class="kv"><span class="k">Set Value</span><span class="v">Change a variable in the paused program to test a hypothesis.</span></div>
  <div class="kv"><span class="k">jpda start</span><span class="v">Tomcat's switch to start with the debug agent.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>IntelliJ "Debug" = start the JVM with the JDWP agent and attach; jdb shows the same data as text.</li>
<li>Of 133 frames in a Spring request, find the ones in your package first.</li>
<li>Evaluate the sub-expression instead of guessing; it can call services and repositories — with real side effects.</li>
<li>Set Value tests "what if" without restarting; inside a transaction it may be saved.</li>
<li>Money: multiply before dividing, or use BigDecimal.</li>
</ul>
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Hoá đơn lệch 22.500 đồng — tìm ra vì sao mà không thêm một dòng println nào</h2>
<p class="lead">Ở phần lớn đội Java bạn sẽ vào (FPT Software cũng vậy), debugger là IntelliJ IDEA. Chương này dùng một dịch vụ Spring Boot nhỏ, <strong>LabFlow Java</strong> (đặt phòng lab — cùng nghiệp vụ với chương 3), có cài sẵn lỗi thật. Bài này dạy bốn bảng bạn dùng hằng ngày — Frames, Variables, Watches, Evaluate — và cách chạy Spring Boot hoặc Tomcat cài ngoài ở chế độ debug.</p>

<h3>Về output trong chương này</h3>
<p>IntelliJ là giao diện đồ hoạ; máy chạy các bài này không có màn hình. Mọi output debugger dưới đây lấy từ <code>jdb</code> — debugger dòng lệnh có sẵn trong JDK — gắn vào qua <strong>JDWP</strong>, đúng giao thức IntelliJ dùng (cả hai đều là client của agent debug trong JVM, xem liên kết JPDA). Vì vậy những gì bạn thấy — frame, giá trị biến, kết quả evaluate — chính là thứ IntelliJ hiện trong các bảng của nó, chỉ là dạng chữ. Mỗi thao tác IntelliJ đều kèm lệnh jdb tương ứng, nên bạn làm theo được cả trong terminal.</p>

<h3>Liên tưởng đời thường: chụp X-quang chứ không đoán</h3>
<p>Thêm <code>println</code> giống bác sĩ hỏi một câu rồi hẹn bệnh nhân mai quay lại. Debugger là máy X-quang: dừng đúng một khoảnh khắc và nhìn mọi thứ bên trong — ai gọi ai (frame), mỗi biến đang giữ gì (variables), thậm chí hỏi "nếu thế này thì sao" (evaluate) mà không cần mổ.</p>

<h3>1. Ứng dụng mẫu — dựng một lần</h3>
<p>Spring Boot 4.1.1, Java 21, Spring Data JPA trên PostgreSQL 16, Spring Security, Actuator. Có phòng (<code>Phong</code>), sinh viên (<code>SinhVien</code>) và lượt đặt (<code>DatCho</code>). Các tệp cần cho bài này:</p>
${ma(POM, 'xml')}
${ma(PROPS, 'properties')}
${ma(DATCHO)}
${ma(HOADON)}
${ma(CONTROLLER)}
<p>Tám lượt đặt được nạp khi khởi động (<code>ddl-auto=create</code> dựng lại bảng mỗi lần chạy, nên lần nào cũng bắt đầu từ cùng dữ liệu):</p>
${ma(DULIEU)}

<h3>2. Khởi động ở chế độ debug</h3>
<p><strong>Trong IntelliJ:</strong> mở thư mục (IntelliJ tự nhận Maven), mở <code>LabFlowApp</code>, bấm biểu tượng con bọ xanh cạnh <code>main</code> (hoặc Shift+F9 / ⌃D trên run configuration). IntelliJ tự tạo cấu hình Spring Boot hoặc Application và tự gắn agent debug. Chỉ có Maven: <code>mvn spring-boot:run -Dspring-boot.run.jvmArguments="-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=127.0.0.1:5005"</code> rồi attach (bài 4.5).</p>
<p><strong>Thực chất IntelliJ làm gì:</strong> chạy Java với classpath các module của bạn kèm agent JDWP. Script dưới làm đúng việc đó, nên các phiên jdb trong chương chạy trên cùng một thứ:</p>
${ma(CHAY, 'bash')}
${OUT_TRIEU_CHUNG}
<p><strong>Tomcat cài ngoài (dự án WAR/JSP, kiểu môn PRJ301):</strong> IntelliJ Community không có cấu hình chạy Tomcat. Khởi động Tomcat bằng <code>catalina.sh jpda start</code> (Windows: <code>catalina.bat jpda start</code>); nó mở JDWP ở <code>JPDA_ADDRESS</code> (mặc định <code>localhost:8000</code>). Rồi dùng <em>Remote JVM Debug</em> vào cổng 8000 — y như attach ở bài 4.5. IntelliJ Ultimate có cấu hình Tomcat Local làm sẵn việc này.</p>

<h3>3. Frames: 133 dòng, hai dòng là của bạn</h3>
<p>Đặt breakpoint trong <code>HoaDonService.tinh</code> (bấm vào lề trái, hoặc Ctrl+F8 / ⌘F8) rồi gọi endpoint hoá đơn. Bảng <em>Frames</em> của IntelliJ liệt kê call stack; lệnh <code>where</code> của jdb in ra:</p>
${OUT_WHERE}
<p>Đọc như stack trace ở chương 2: mấy frame trên cùng thuộc <code>vn.labflow</code> là của bạn, phần còn lại là Spring MVC (DispatcherServlet), Spring Security (mười hai filter, có CsrfFilter) và Tomcat. IntelliJ tô xám frame thư viện và ẩn được chúng (biểu tượng phễu "Hide Frames from Libraries"). Bấm vào một frame — <code>up</code>/<code>down</code> trong jdb — sẽ thấy biến của frame đó: ở frame [2] là <code>id</code> và <code>ma</code> của controller.</p>

<h3>4. Variables, Evaluate và Set Value: kiểm giả thuyết ngay khi đang dừng</h3>
<p>Bảng Variables hiện <code>tamTinh = 45000</code>. Giả thuyết: phép chia cho 60 làm mất nửa giờ. Đừng sửa rồi chạy lại — bôi đen biểu thức con trong editor, bấm Alt+F8 / ⌥F8 (Evaluate):</p>
${OUT_EVAL}
<p>Phiên này chứng minh bốn điều:</p>
<ol>
<li><strong>Evaluate được mọi biểu thức con.</strong> <code>d.getSoPhut() / 60</code> ra <code>1</code>: chia số nguyên trong Java bỏ phần lẻ trước khi nhân. Sửa: nhân trước (<code>d.getSoPhut() * giaGio / 60</code>) hoặc dùng <code>BigDecimal</code> cho tiền.</li>
<li><strong>Evaluate gọi được code của bạn.</strong> Từ frame controller, <code>datCho.tim(2L)</code> chạy một truy vấn thật qua proxy Spring, transaction và repository. Rất mạnh — và nguy hiểm: evaluate <code>repo.deleteAll()</code> là xoá thật. Coi Evaluate như một console trên production.</li>
<li><strong>Set Value thử "nếu… thì" trong vài giây.</strong> Với 120 phút kết quả đúng, vậy lỗi chỉ xảy ra khi số giờ lẻ — một ca test bạn phải thêm.</li>
<li><strong>Set Value đổi bộ nhớ, không đổi database</strong> — ở đây. Request GET này không nằm trong transaction ghi nên không có gì được flush. Trong một hàm <code>@Transactional</code>, đổi trường của entity đang được quản lý <em>sẽ</em> được lưu khi commit (dirty checking). Biết mình đang ở đâu trước khi "thử một giá trị".</li>
</ol>
<p><strong>Watches</strong> (biểu tượng kính, hoặc chuột phải → Add to Watches) là các biểu thức được tính lại mỗi lần dừng: thêm <code>d.getSoPhut() / 60.0 * giaGio</code> thì nó tự cập nhật khi bạn đi qua nhiều lượt đặt. IntelliJ còn hiện giá trị ngay cạnh từng dòng trong editor (inline values).</p>
${BANG_PHIM}

<h3>Tình huống đi làm</h3>
<p>Tester báo: "hoá đơn lượt #1 hiện 45.000, khách nói phải 67.500". Ở công ty outsourcing bạn thường không được đụng database test. Tái hiện ở máy mình với cùng dữ liệu, dừng trong hàm tính, evaluate các biểu thức con rồi dán phiên đó vào ticket: "<code>90 / 60 = 1</code> (int); sửa: nhân trước; thêm test 90 phút". Đó là nguyên nhân gốc hai dòng, không phải "đã sửa làm tròn".</p>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok">
<ol>
<li>Build và chạy LabFlow Java ở chế độ debug (con bọ của IntelliJ, hoặc <code>chay.sh</code> + <code>jdb -attach 127.0.0.1:45005</code>).</li>
<li>Dừng trong <code>tinh</code> với lượt 1, tìm hai frame của mình, ẩn frame thư viện.</li>
<li>Evaluate <code>d.getSoPhut() / 60</code> và <code>d.getSoPhut() / 60.0 * giaGio</code>; từ frame controller evaluate <code>datCho.tim(4L).getGhiChu()</code>.</li>
<li>Set <code>soPhut</code> thành 120, rồi 45 — ghi lại giá trị nào cho giá sai.</li>
<li>Viết test JUnit cho 90 phút, đang đỏ (tệp test ở bài 4.6) — rồi sửa bằng cách nhân trước.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn giải thích được lỗi trong một câu kèm giá trị đã evaluate, và test đỏ trước / xanh sau khi sửa.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">JDWP</span><span class="v">Java Debug Wire Protocol — giao thức giữa agent debug trong JVM và mọi debugger.</span></div>
  <div class="kv"><span class="k">Frame</span><span class="v">Một lần gọi hàm trên stack, có biến cục bộ riêng.</span></div>
  <div class="kv"><span class="k">Evaluate Expression</span><span class="v">Chạy một biểu thức bất kỳ trong ngữ cảnh frame đang chọn.</span></div>
  <div class="kv"><span class="k">Watch</span><span class="v">Biểu thức được tính lại mỗi lần dừng.</span></div>
  <div class="kv"><span class="k">Set Value</span><span class="v">Đổi giá trị biến trong chương trình đang dừng để kiểm giả thuyết.</span></div>
  <div class="kv"><span class="k">jpda start</span><span class="v">Cách khởi động Tomcat kèm agent debug.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>"Debug" của IntelliJ = chạy JVM kèm agent JDWP rồi gắn vào; jdb cho thấy cùng dữ liệu dạng chữ.</li>
<li>Trong 133 frame của một request Spring, tìm frame thuộc package của mình trước.</li>
<li>Evaluate biểu thức con thay vì đoán; nó gọi được service và repository — với tác dụng phụ thật.</li>
<li>Set Value thử "nếu… thì" không cần khởi động lại; trong transaction có thể bị lưu.</li>
<li>Tiền: nhân trước rồi chia, hoặc dùng BigDecimal.</li>
</ul>
${NGUON}
</div>
`,
};
