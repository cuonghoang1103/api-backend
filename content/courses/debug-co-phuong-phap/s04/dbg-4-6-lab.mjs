/**
 * 4.6 — Lab: Săn lỗi Spring Boot với bốn kỹ thuật IntelliJ (soạn 24/11/2026).
 * Bốn lỗi thật trong LabFlow Java (cùng repo bài 4.1–4.5): mã giảm SV15 không trừ (Evaluate), lượt miễn phí bị trừ hai lần (field watchpoint),
 * "Không tìm thấy đặt chỗ" cho lượt có thật (exception breakpoint NoSuchElementException), báo cáo theo ngày lệch chỉ trong container (remote debug, TZ UTC).
 * Test JUnit 5 (HoaDonServiceTest + DatChoTichHopTest với PostgreSQL thật): 5 test đỏ trên mã lỗi, 5 xanh sau bản sửa (mvn test chạy thật).
 * Đáp án: phiên jdb s46a/s46b/s46c (output thật), sua.diff. Đáp án nằm cuối bài.
 */
import { nguon, lienKet } from '../_chung.mjs';
import { TRULUOT, LOI, TEST_HOADON, TEST_TICHHOP, SUA_DIFF } from './_ma-4.mjs';

const ma = (s, lang = 'java') => `<pre><code class="language-${lang}">${s}</code></pre>`;

const TRIEU_CHUNG = `<div class="out">$ curl -s '127.0.0.1:48080/api/dat-cho/1/hoa-don?ma=SV15'
{"datChoId":1,"phong":"Lab 401","soPhut":90,"tamTinh":45000,"giam":0,"thanhTien":45000}         ← bug 1: SV15 = 15% off, giam is 0
$ curl -s -X POST 127.0.0.1:48080/api/dat-cho/3/xac-nhan
{"maSv":"SE1803","ten":"Chi","luotConLai":1}                                                       ← bug 2: Chi had 3 free bookings, one check-in left 1
$ curl -s 127.0.0.1:48080/api/dat-cho/7/nguoi-dat
{"duongDan":"/api/dat-cho/7/nguoi-dat","loi":"Không tìm thấy đặt chỗ"}                             ← bug 3: booking 7 is in the weekly report (Lab 401, 27/11)
$ ./container.sh                                     # the "test server": same jar, eclipse-temurin:21
$ curl -s '127.0.0.1:48080/api/bao-cao/theo-ngay?tu=2026-11-23&amp;den=2026-11-29'     # your laptop
{"2026-11-23":2,"2026-11-24":1,"2026-11-25":1,"2026-11-26":2,"2026-11-27":1,"2026-11-28":1}
$ curl -s '127.0.0.1:48090/api/bao-cao/theo-ngay?tu=2026-11-23&amp;den=2026-11-29'     # the container
{"2026-11-23":2,"2026-11-24":1,"2026-11-25":2,"2026-11-26":1,"2026-11-27":1,"2026-11-28":1}      ← bug 4: one booking moved from 26/11 to 25/11</div>`;

const DO = `<div class="out">$ mvn -q test          # on the buggy code (dbg-pg must be running)
[ERROR]   DatChoTichHopTest.theoNgayKhongPhuThuocMuiGioMay:38 expected: &lt;2&gt; but was: &lt;1&gt;
[ERROR]   DatChoTichHopTest.xacNhanTruDungMotLuot:25 expected: &lt;2&gt; but was: &lt;1&gt;
[ERROR]   HoaDonServiceTest.maGiamSV15:28 expected: &lt;10125&gt; but was: &lt;0&gt;
[ERROR]   HoaDonServiceTest.tinhTienTheoPhutLe:23 expected: &lt;67500&gt; but was: &lt;45000&gt;
[ERROR] Errors:
[ERROR]   DatChoTichHopTest.nguoiDatNhapTuExcelCu:30 ? NoSuchElement No value present     (maven prints » as ? when LANG is empty)
[ERROR] Tests run: 5, Failures: 4, Errors: 1, Skipped: 0
[INFO] BUILD FAILURE</div>`;

const XANH = `<div class="out">$ mvn test              # after the fixes
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.134 s -- in vn.labflow.HoaDonServiceTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 4.402 s -- in vn.labflow.DatChoTichHopTest
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
$ curl -s '127.0.0.1:48080/api/dat-cho/1/hoa-don?ma=SV15'
{"datChoId":1,"phong":"Lab 401","soPhut":90,"tamTinh":67500,"giam":10125,"thanhTien":57375}
$ curl -s 127.0.0.1:48080/api/dat-cho/7/nguoi-dat
{"maSv":"SE1802","ten":"Bình","luotConLai":5}
$ curl -s -X POST 127.0.0.1:48080/api/dat-cho/3/xac-nhan
{"maSv":"SE1803","ten":"Chi","luotConLai":2}
$ curl -s '127.0.0.1:48080/api/bao-cao/theo-ngay?tu=2026-11-23&amp;den=2026-11-29'
{"2026-11-23":2,"2026-11-24":1,"2026-11-25":1,"2026-11-26":2,"2026-11-27":1,"2026-11-28":1}</div>`;

const DA1 = `<div class="out">&gt; stop at vn.labflow.service.HoaDonService:26
Breakpoint hit: … HoaDonService.tinhGiam(), line=26 bci=43
26        return BigDecimal.valueOf(tamTinh).multiply(tiLe).setScale(0, RoundingMode.HALF_UP).longValue();
exec-1[1] locals
Method arguments:
tamTinh = 45000
ma = "SV15"
Local variables:
phanTram = instance of java.lang.Integer(id=15028)
tiLe = instance of java.math.BigDecimal(id=15029)
exec-1[1] print phanTram / 100
com.sun.tools.example.debug.expr.ParseException: Invalid operation '/' on an Object     ← jdb does not unbox; IntelliJ does
exec-1[1] print phanTram.intValue() / 100
 phanTram.intValue() / 100 = 0
exec-1[1] print phanTram.intValue() / 100.0
 phanTram.intValue() / 100.0 = 0.15</div>`;

const DA2 = `<div class="out">&gt; watch vn.labflow.model.SinhVien.luotConLai
                                     # POST /api/dat-cho/3/xac-nhan
Field (vn.labflow.model.SinhVien.luotConLai) is 3, will be 2: "thread=…-exec-2", vn.labflow.model.SinhVien.truLuot(), line=16 bci=7
exec-2[1] where
  [1] vn.labflow.model.SinhVien.truLuot (SinhVien.java:16)
  [2] vn.labflow.service.DatChoService.xacNhan (DatChoService.java:44)            ← first deduction
  …
exec-2[1] cont
Field (vn.labflow.model.SinhVien.luotConLai) is 2, will be 1: "thread=…-exec-2", vn.labflow.model.SinhVien.truLuot(), line=16 bci=7
exec-2[1] where
  [1] vn.labflow.model.SinhVien.truLuot (SinhVien.java:16)
  [2] vn.labflow.service.TruLuotKhiXacNhan$$Lambda/0x0000000014b4ac90.accept (null)
  [3] java.util.Optional.ifPresent (Optional.java:178)
  [4] vn.labflow.service.TruLuotKhiXacNhan.khiXacNhan (TruLuotKhiXacNhan.java:17)  ← second deduction, same thread, same transaction</div>`;

const DA3 = `<div class="out">&gt; catch java.util.NoSuchElementException
                                     # GET /api/dat-cho/7/nguoi-dat
Exception occurred: java.util.NoSuchElementException (to be caught at: jdk.internal.reflect.DirectMethodHandleAccessor.invoke(), line=118 bci=82)
  "thread=…-exec-4", java.util.Optional.orElseThrow(), line=377 bci=16
exec-4[1] up
exec-4[2] locals
Method arguments:
id = 7
Local variables:
d = instance of vn.labflow.model.DatCho(id=15304)          ← the booking WAS found
exec-4[2] print "[" + d.getNguoiDat() + "]"
 "[" + d.getNguoiDat() + "]" = "[se1802 ]"                   ← lowercase + trailing space: the student lookup fails</div>`;

const DA4 = `<div class="out">$ jdb -sourcepath src/main/java -attach 127.0.0.1:45006
&gt; stop in vn.labflow.service.BaoCaoService.lambda$theoNgay$0
                                     # curl …:48090/api/bao-cao/theo-ngay?tu=2026-11-23&amp;den=2026-11-29
exec-4[1] print java.time.ZoneId.systemDefault()
 java.time.ZoneId.systemDefault() = "Etc/UTC"                 ← your laptop says Asia/Ho_Chi_Minh
exec-4[1] print d.getId() + " " + d.getBatDau() + " -&gt; " + java.time.LocalDate.ofInstant(d.getBatDau(), java.time.ZoneId.systemDefault())
 … = "1 2026-11-23T01:00:00Z -&gt; 2026-11-23"
  (cont × 4)
 … = "5 2026-11-25T23:30:00Z -&gt; 2026-11-25"                    ← 06:30 on 26/11 in Vietnam
exec-4[1] print java.time.LocalDate.ofInstant(d.getBatDau(), java.time.ZoneId.of("Asia/Ho_Chi_Minh"))
 … = "2026-11-26"
$ docker exec dbg-java ls -l /etc/localtime
lrwxrwxrwx+ 1 root root 27 Nov 20 17:43 /etc/localtime -&gt; /usr/share/zoneinfo/Etc/UTC</div>`;

const NGUON = [
  nguon('🧪', 'JUnit 5 User Guide', 'Assertions, cấu trúc test; chạy bằng mvn test / IntelliJ.', 'https://junit.org/junit5/docs/current/user-guide/'),
  nguon('🕰️', 'Oracle — java.time ZoneId.systemDefault()', 'Múi giờ mặc định lấy từ máy/JVM (TZ, /etc/localtime, -Duser.timezone).', 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/time/ZoneId.html#systemDefault()'),
  nguon('📣', 'Spring Framework — Application events (@EventListener)', 'Listener đồng bộ chạy trong cùng luồng và cùng transaction với nơi publish.', 'https://docs.spring.io/spring-framework/reference/core/beans/context-introduction.html#context-functionality-events'),
  lienKet({ khoa: 'spring-boot', bai: 'sb-11-4-testcontainers', title: 'Spring Boot 11.4 — test tích hợp với Testcontainers', sub: 'Lab này dùng container dbg-pg dựng tay; dự án thật để Testcontainers dựng hộ.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-1-5-lab', title: 'Bài 1.5 — mẫu nhật ký gỡ lỗi', sub: 'Dùng lại đúng mẫu 4 mục cho từng lỗi của lab này.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '4.6 — Lab: A Spring Boot bug hunt with four IntelliJ techniques|||4.6 — Lab: Săn lỗi Spring Boot với bốn kỹ thuật IntelliJ',
  slug: 'dbg-4-6-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bốn lỗi thật trong LabFlow Java, mỗi lỗi bắt buộc một kỹ thuật: Evaluate (mã giảm 15% thành 0 vì 15/100 chia số nguyên), field watchpoint (lượt miễn phí bị trừ hai lần — service và một @EventListener thêm sau), exception breakpoint (404 "Không tìm thấy đặt chỗ" cho lượt có thật — mã sinh viên "se1802 " từ Excel cũ), remote debug vào container (báo cáo theo ngày lệch vì container chạy UTC). Năm test JUnit đỏ trước, xanh sau; rubric 100 điểm, 5 câu phỏng vấn, đáp án output thật ở cuối.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lab</span>
<h2>Four bugs, four techniques, one test per bug</h2>
<p class="lead">Same rule as chapter 3: no <code>println</code>, no editing before you know the cause. Each bug is chosen so that one technique of this chapter finds it in minutes. For each bug you hand in a debugging log (lesson 1.5 format) and a JUnit test that fails before your fix. Answers with real debugger output are at the end.</p>

<h3>Setup (10 min)</h3>
<ol>
<li>LabFlow Java from lesson 4.1, PostgreSQL container <code>dbg-pg</code> running, app started in debug (IntelliJ, or <code>chay.sh</code>).</li>
<li>Build the jar (<code>mvn -q package -DskipTests</code>) and start the "test server" with <code>container.sh</code> from lesson 4.5.</li>
<li>Add the two test classes below to <code>src/test/java/vn/labflow/</code> and run <code>mvn test</code>: they must be red.</li>
</ol>
${ma(TEST_HOADON)}
${ma(TEST_TICHHOP)}
${DO}
<p>(<code>tinhTienTheoPhutLe</code> is lesson 4.1's bug — if you fixed it already, it is green. The other four are this lab.) The symptoms, as reported:</p>
${TRIEU_CHUNG}

<h3>Bug 1 — the SV15 voucher gives 0 VND off (technique: Evaluate)</h3>
<p>Stop in <code>HoaDonService.tinhGiam</code> with <code>ma = "SV15"</code>. Evaluate each sub-expression of the line that builds <code>tiLe</code>. Do not change anything until one evaluated value explains the 0.</p>

<h3>Bug 2 — one check-in uses two free bookings (technique: field watchpoint)</h3>
<p>Put a field watchpoint on <code>SinhVien.luotConLai</code> (modification), call <code>POST /api/dat-cho/3/xac-nhan</code>, and read the stack at each stop. The relevant class added in sprint 6:</p>
${ma(TRULUOT)}

<h3>Bug 3 — "booking not found" for a booking that exists (technique: exception breakpoint)</h3>
<p>The handler turns every <code>NoSuchElementException</code> into the same message:</p>
${ma(LOI)}
<p>Add a Java exception breakpoint for <code>java.util.NoSuchElementException</code> (caught + uncaught), call <code>/api/dat-cho/7/nguoi-dat</code>. Where is it thrown, and which lookup failed?</p>

<h3>Bug 4 — the dashboard is wrong only on the test server (technique: remote debug)</h3>
<p>Attach a Remote JVM Debug configuration to <code>127.0.0.1:45006</code>. Stop inside the grouping lambda of <code>BaoCaoService.theoNgay</code> and compare what the container computes with what your laptop computes. Explain why <code>tinh</code> on your laptop never shows this bug.</p>

<h3>What to hand in</h3>
<ul>
<li>Four debugging logs: symptom · what I tried (technique + exact breakpoint) · what I saw (paste debugger output) · cause in one sentence.</li>
<li>A fix per bug, and the five tests green (<code>mvn test</code> output).</li>
<li>For bug 3: one sentence on why the error message itself was part of the bug.</li>
<li>For bug 4: one sentence on how to stop "depends on the server's time zone" bugs project-wide.</li>
</ul>

<h3>Rubric (100 points)</h3>
<table>
<thead><tr><th>Item</th><th>Points</th></tr></thead>
<tbody>
<tr><td>Each bug found with the required technique, with pasted debugger evidence (4 × 12)</td><td>48</td></tr>
<tr><td>Cause stated as a root cause, not a symptom (4 × 5)</td><td>20</td></tr>
<tr><td>Tests red before, green after</td><td>16</td></tr>
<tr><td>Fixes minimal and correct (no catch-all, no "<code>+1</code> to compensate")</td><td>10</td></tr>
<tr><td>Bug 3 message + bug 4 project-wide prevention</td><td>6</td></tr>
</tbody></table>

<h3>🎤 What an interviewer will ask</h3>
<ol>
<li>"You get an NPE in a Spring service that is called from five places. How do you find which caller passes null?" — exception breakpoint, then read the frames; or conditional breakpoint on the parameter being null.</li>
<li>"What is the difference between Suspend All and Suspend Thread, and when do you need All?"</li>
<li>"Can you change code while debugging without restarting? What are the limits?" — HotSwap: method bodies only; Reset Frame; restart for new methods/fields/beans.</li>
<li>"A bug only appears on the test server. Walk me through your steps." — same build, logs, config/TZ/JDK diff, reproduce in a container, remote debug only with a tunnel and permission.</li>
<li>"Why is an open JDWP port dangerous?" — no authentication: Evaluate = arbitrary code execution; Wiz 2025.</li>
</ol>

<h3>🛠 Project milestone</h3>
<p>In your capstone repository, add <code>docs/debugging.md</code>: how to start the API in debug mode, the Remote JVM Debug settings for the Docker Compose setup (loopback-only port), and the rule "no jdwp in production files". Add a CI grep that fails if <code>jdwp</code> appears in the production Dockerfile.</p>

<h3>Answers (check only after writing yours)</h3>
<div class="callout">
<p><strong>Bug 1.</strong> <code>phanTram / 100</code> is integer division: <code>15 / 100 = 0</code>, so <code>tiLe = 0</code> and the discount is always 0 — for every voucher under 100%. Fix: <code>BigDecimal.valueOf(phanTram).movePointLeft(2)</code> (exact 0.15, no double). Same family as lesson 4.1: int arithmetic on money.</p>
${DA1}
<p><strong>Bug 2.</strong> <code>xacNhan</code> deducts, then publishes <code>DaXacNhan</code>; the sprint-6 listener deducts again. <code>@EventListener</code> is synchronous: same thread, same transaction, the same managed <code>SinhVien</code> instance — so both changes are saved together and no log shows anything odd. Fix: one owner for the rule (we removed the deduction from the listener; it only notifies).</p>
${DA2}
<p><strong>Bug 3.</strong> The booking exists; the <em>student</em> lookup fails because the old Excel import stored <code>"se1802 "</code>. The handler's text "booking not found" sent everyone to the wrong place — the message was part of the bug. Fix: normalise (<code>trim().toUpperCase()</code>) where data enters and here, plan a data clean-up script, and make the 404 message generic or specific per entity.</p>
${DA3}
<p><strong>Bug 4.</strong> <code>LocalDate.ofInstant(…, ZoneId.systemDefault())</code> uses the JVM's time zone. The laptop is <code>Asia/Ho_Chi_Minh</code>, the container is <code>Etc/UTC</code>; booking 5 at 06:30 on 26/11 (Vietnam) is 23:30 on 25/11 UTC. The query window already used <code>VN</code>; only the grouping did not. Fix: use the business time zone explicitly (<code>VN</code>) everywhere a date is derived; project-wide, ban <code>ZoneId.systemDefault()</code>/<code>LocalDate.now()</code> without a zone (code review, ArchUnit or Error Prone rule) and run tests with <code>-Duser.timezone=UTC</code> as the test above does.</p>
${DA4}
<p>All fixes (including lessons 4.1–4.4), as a diff:</p>
${ma(SUA_DIFF, 'diff')}
${XANH}
</div>
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Lab</span>
<h2>Bốn lỗi, bốn kỹ thuật, mỗi lỗi một test</h2>
<p class="lead">Luật như chương 3: không <code>println</code>, không sửa code trước khi biết nguyên nhân. Mỗi lỗi được chọn để một kỹ thuật của chương này tìm ra trong vài phút. Với mỗi lỗi, bạn nộp một nhật ký gỡ lỗi (mẫu bài 1.5) và một test JUnit đỏ trước khi sửa. Đáp án kèm output debugger thật ở cuối bài.</p>

<h3>Chuẩn bị (10 phút)</h3>
<ol>
<li>LabFlow Java từ bài 4.1, container PostgreSQL <code>dbg-pg</code> đang chạy, ứng dụng chạy ở chế độ debug (IntelliJ, hoặc <code>chay.sh</code>).</li>
<li>Build jar (<code>mvn -q package -DskipTests</code>) và bật "server test" bằng <code>container.sh</code> ở bài 4.5.</li>
<li>Thêm hai lớp test dưới đây vào <code>src/test/java/vn/labflow/</code> rồi chạy <code>mvn test</code>: chúng phải đỏ.</li>
</ol>
${ma(TEST_HOADON)}
${ma(TEST_TICHHOP)}
${DO}
<p>(<code>tinhTienTheoPhutLe</code> là lỗi của bài 4.1 — nếu đã sửa thì nó xanh. Bốn cái còn lại thuộc lab này.) Triệu chứng, đúng như được báo:</p>
${TRIEU_CHUNG}

<h3>Lỗi 1 — mã SV15 giảm 0 đồng (kỹ thuật: Evaluate)</h3>
<p>Dừng trong <code>HoaDonService.tinhGiam</code> với <code>ma = "SV15"</code>. Evaluate từng biểu thức con của dòng tạo <code>tiLe</code>. Đừng đổi gì cho tới khi một giá trị evaluate giải thích được con số 0.</p>

<h3>Lỗi 2 — một lần check-in tốn hai lượt miễn phí (kỹ thuật: field watchpoint)</h3>
<p>Đặt field watchpoint trên <code>SinhVien.luotConLai</code> (modification), gọi <code>POST /api/dat-cho/3/xac-nhan</code>, đọc stack ở mỗi lần dừng. Lớp liên quan được thêm ở sprint 6:</p>
${ma(TRULUOT)}

<h3>Lỗi 3 — "không tìm thấy đặt chỗ" cho một lượt có thật (kỹ thuật: exception breakpoint)</h3>
<p>Handler biến mọi <code>NoSuchElementException</code> thành cùng một thông báo:</p>
${ma(LOI)}
<p>Thêm Java exception breakpoint cho <code>java.util.NoSuchElementException</code> (caught + uncaught), gọi <code>/api/dat-cho/7/nguoi-dat</code>. Nó bị ném ở đâu, và lần tra cứu nào thất bại?</p>

<h3>Lỗi 4 — dashboard chỉ sai trên server test (kỹ thuật: remote debug)</h3>
<p>Gắn cấu hình Remote JVM Debug vào <code>127.0.0.1:45006</code>. Dừng trong lambda gom nhóm của <code>BaoCaoService.theoNgay</code> và so cái container tính với cái laptop tính. Giải thích vì sao chạy trên laptop không bao giờ thấy lỗi này.</p>

<h3>Nộp gì</h3>
<ul>
<li>Bốn nhật ký gỡ lỗi: triệu chứng · đã thử gì (kỹ thuật + breakpoint cụ thể) · thấy gì (dán output debugger) · nguyên nhân trong một câu.</li>
<li>Bản sửa cho từng lỗi, và cả năm test xanh (output <code>mvn test</code>).</li>
<li>Với lỗi 3: một câu giải thích vì sao chính thông báo lỗi là một phần của lỗi.</li>
<li>Với lỗi 4: một câu về cách chặn lỗi "phụ thuộc múi giờ của server" trên toàn dự án.</li>
</ul>

<h3>Rubric (100 điểm)</h3>
<table>
<thead><tr><th>Mục</th><th>Điểm</th></tr></thead>
<tbody>
<tr><td>Mỗi lỗi tìm bằng đúng kỹ thuật yêu cầu, có dán bằng chứng từ debugger (4 × 12)</td><td>48</td></tr>
<tr><td>Nguyên nhân là nguyên nhân gốc, không phải triệu chứng (4 × 5)</td><td>20</td></tr>
<tr><td>Test đỏ trước, xanh sau</td><td>16</td></tr>
<tr><td>Bản sửa tối thiểu và đúng (không catch-all, không "<code>+1</code> cho bù")</td><td>10</td></tr>
<tr><td>Thông báo của lỗi 3 + cách chặn toàn dự án của lỗi 4</td><td>6</td></tr>
</tbody></table>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li>"Một service Spring bị NPE, nó được gọi từ năm chỗ. Làm sao biết chỗ nào truyền null?" — exception breakpoint rồi đọc các frame; hoặc breakpoint điều kiện "tham số == null".</li>
<li>"Suspend All và Suspend Thread khác gì, khi nào bắt buộc dùng All?"</li>
<li>"Có sửa code trong lúc debug mà không khởi động lại được không? Giới hạn là gì?" — HotSwap: chỉ thân hàm; Reset Frame; khởi động lại khi thêm hàm/trường/bean.</li>
<li>"Một lỗi chỉ có trên server test. Kể các bước bạn làm." — cùng bản build, log, so cấu hình/múi giờ/JDK, tái hiện trong container, remote debug chỉ khi có đường hầm và được phép.</li>
<li>"Vì sao cổng JDWP mở lại nguy hiểm?" — không xác thực: Evaluate = chạy mã tuỳ ý; Wiz 2025.</li>
</ol>

<h3>🛠 Mốc dự án</h3>
<p>Trong repo dự án cuối khoá, thêm <code>docs/debugging.md</code>: cách chạy API ở chế độ debug, thiết lập Remote JVM Debug cho Docker Compose (cổng chỉ ở loopback), và quy tắc "không có jdwp trong tệp production". Thêm một bước CI grep: thất bại nếu Dockerfile production có chữ <code>jdwp</code>.</p>

<h3>Đáp án (chỉ xem sau khi đã viết câu trả lời của mình)</h3>
<div class="callout">
<p><strong>Lỗi 1.</strong> <code>phanTram / 100</code> là chia số nguyên: <code>15 / 100 = 0</code>, nên <code>tiLe = 0</code> và mức giảm luôn bằng 0 — với mọi mã dưới 100%. Sửa: <code>BigDecimal.valueOf(phanTram).movePointLeft(2)</code> (đúng 0,15, không qua double). Cùng họ với bài 4.1: dùng số nguyên cho tiền.</p>
${DA1}
<p><strong>Lỗi 2.</strong> <code>xacNhan</code> trừ một lượt rồi publish <code>DaXacNhan</code>; listener của sprint 6 lại trừ thêm. <code>@EventListener</code> chạy đồng bộ: cùng luồng, cùng transaction, cùng một thể hiện <code>SinhVien</code> đang được quản lý — nên cả hai thay đổi được lưu cùng lúc và không log nào thấy bất thường. Sửa: một nơi duy nhất sở hữu quy tắc (chúng tôi bỏ việc trừ khỏi listener; nó chỉ còn gửi thông báo).</p>
${DA2}
<p><strong>Lỗi 3.</strong> Lượt đặt có tồn tại; lần tra <em>sinh viên</em> mới thất bại, vì dữ liệu nhập từ Excel cũ lưu <code>"se1802 "</code>. Thông báo "không tìm thấy đặt chỗ" của handler dẫn mọi người đi sai hướng — chính thông báo là một phần của lỗi. Sửa: chuẩn hoá (<code>trim().toUpperCase()</code>) ở chỗ dữ liệu đi vào và ở đây, lên kế hoạch script dọn dữ liệu, và để thông báo 404 chung chung hoặc nói đúng loại thực thể.</p>
${DA3}
<p><strong>Lỗi 4.</strong> <code>LocalDate.ofInstant(…, ZoneId.systemDefault())</code> dùng múi giờ của JVM. Laptop là <code>Asia/Ho_Chi_Minh</code>, container là <code>Etc/UTC</code>; lượt 5 lúc 06:30 ngày 26/11 (giờ Việt Nam) là 23:30 ngày 25/11 theo UTC. Khoảng truy vấn đã dùng <code>VN</code>; chỉ bước gom nhóm thì không. Sửa: dùng tường minh múi giờ nghiệp vụ (<code>VN</code>) ở mọi chỗ suy ra ngày; toàn dự án thì cấm <code>ZoneId.systemDefault()</code>/<code>LocalDate.now()</code> không kèm múi giờ (review code, luật ArchUnit hoặc Error Prone) và chạy test với <code>-Duser.timezone=UTC</code> như test ở trên.</p>
${DA4}
<p>Toàn bộ bản sửa (gồm cả bài 4.1–4.4), dạng diff:</p>
${ma(SUA_DIFF, 'diff')}
${XANH}
</div>
${NGUON}
</div>
`,
};
