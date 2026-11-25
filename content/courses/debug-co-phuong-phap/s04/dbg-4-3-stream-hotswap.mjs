/**
 * 4.3 — Stream, lambda, Drop Frame (Reset Frame), Force Return và HotSwap (soạn 24/11/2026).
 * Output THẬT: jdb gắn JDWP vào LabFlow Java (JDK 25): breakpoint trong lambda (stop in lambda$lichTuan$1), 7 phần tử vào map, 6 ra (distinct);
 * HotSwap bằng `redefine` (sửa thân hàm: OK; thêm hàm: "add method not implemented"); `reenter` = Drop Frame + step into;
 * Force Return bằng Jdi.java (ThreadReference.forceEarlyReturn — đúng lời gọi IntelliJ dùng). Phiên: s43.txt, s43b.txt, jdi-fr.out.
 */
import { nguon, lienKet } from '../_chung.mjs';
import { DATCHO_SV, EMAIL } from './_ma-4.mjs';

const ma = (s, lang = 'java') => `<pre><code class="language-${lang}">${s}</code></pre>`;

const MA_LICH = `<pre><code class="language-java">  /** Weekly usage report: one line per booking that was not cancelled. */
  public List&lt;DongLich&gt; lichTuan(LocalDate thuHai) {                       // line 30
    Instant tu = thuHai.atStartOfDay(VN).toInstant();
    return repo.findByBatDauBetweenOrderByBatDau(tu, tu.plus(7, ChronoUnit.DAYS)).stream()
        .filter(d -&gt; d.getTrangThai() != TrangThai.HUY)                       // line 33 → lambda$lichTuan$0
        .map(d -&gt; new DongLich(d.getPhong().getTen(), LocalDate.ofInstant(d.getBatDau(), VN), d.getSoPhut()))  // 34 → lambda$lichTuan$1
        .distinct()
        .toList();
  }</code></pre>`;

const OUT_TUAN = `<div class="out">$ curl -s '127.0.0.1:48080/api/bao-cao/tuan?tu=2026-11-23'
[{"phong":"Lab 401","ngay":"2026-11-23","soPhut":90},{"phong":"Lab 402","ngay":"2026-11-24","soPhut":120},
 {"phong":"Lab 402","ngay":"2026-11-25","soPhut":60},{"phong":"Lab 401","ngay":"2026-11-26","soPhut":120},
 {"phong":"Lab 402","ngay":"2026-11-26","soPhut":45},{"phong":"Lab 401","ngay":"2026-11-27","soPhut":60}]
                                         ← 6 lines. The week has 7 bookings that are not cancelled.</div>`;

const OUT_DONG = `<div class="out">&gt; stop at vn.labflow.service.BaoCaoService:34
Breakpoint hit: … vn.labflow.service.BaoCaoService.lichTuan(), line=34 bci=51
                                         ← stopped while BUILDING the pipeline, not inside the lambda
exec-3[1] print d.getNguoiDat()
com.sun.tools.example.debug.expr.ParseException: Name unknown: d.getNguoiDat      ← there is no d here yet</div>`;

const OUT_LAMBDA = `<div class="out">$ javap -p -cp target/classes vn.labflow.service.BaoCaoService | grep lambda
  private static vn.labflow.service.BaoCaoService$DongLich lambda$lichTuan$1(vn.labflow.model.DatCho);
  private static boolean lambda$lichTuan$0(vn.labflow.model.DatCho);
  …
&gt; stop in vn.labflow.service.BaoCaoService.lambda$lichTuan$1
Breakpoint hit: … vn.labflow.service.BaoCaoService.lambda$lichTuan$1(), line=34 bci=0
exec-10[1] where
  [1] vn.labflow.service.BaoCaoService.lambda$lichTuan$1 (BaoCaoService.java:34)
  [2] vn.labflow.service.BaoCaoService$$Lambda/0x000000002fcbdb40.apply (null)
  [3] java.util.stream.ReferencePipeline$3$1.accept (ReferencePipeline.java:214)     ← map
  [4] java.util.stream.ReferencePipeline$2$1.accept (ReferencePipeline.java:197)     ← filter
  [5] java.util.ArrayList$ArrayListSpliterator.forEachRemaining (ArrayList.java:1,716)
  …
exec-10[1] print d.getId() + " " + d.getNguoiDat() + " " + d.getPhong().getTen() + " " + d.getSoPhut()
 … = "1 SE1801 Lab 401 90"
exec-10[1] cont                     … = "2 SE1802 Lab 401 90"      ← same room, same day, same minutes as #1
exec-10[1] cont                     … = "3 SE1803 Lab 402 120"
exec-10[1] cont                     … = "4 SE1801 Lab 402 60"
exec-10[1] cont                     … = "5 SE1803 Lab 401 120"
exec-10[1] cont                     … = "6 SE1802 Lab 402 45"
exec-10[1] cont                     … = "7 se1802  Lab 401 60"
                                    ← 7 elements entered map; the result has 6 ⇒ distinct() removed one</div>`;

const OUT_HOTSWAP = `<div class="out">$ sed -i 's#d.getSoPhut() / 60 \\* giaGio#d.getSoPhut() * giaGio / 60#' HoaDonService.java
$ javac --release 21 -g -cp 'target/classes:target/lib/*' -d hotswap/sua/out HoaDonService.java    # IntelliJ: Build → Recompile (Ctrl+Shift+F9)

&gt; stop at vn.labflow.service.HoaDonService:18
Breakpoint hit: … vn.labflow.service.HoaDonService.tinh(), line=18 bci=20
exec-5[1] print tamTinh
 tamTinh = 45000                                             ← still the bug
exec-5[1] redefine vn.labflow.service.HoaDonService /…/hotswap/sua/out/vn/labflow/service/HoaDonService.class
exec-5[1] print tamTinh
com.sun.tools.example.debug.expr.ParseException: Name unknown: tamTinh
                                    ← this frame still runs the OLD (obsolete) method; its variables are gone
exec-5[1] reenter                                            # = Reset/Drop Frame + step into the method again
Step completed: … vn.labflow.service.HoaDonService.tinh(), line=16 bci=0
exec-5[1] next
exec-5[1] next
Step completed: … HoaDonService.tinh(), line=18 bci=21
exec-5[1] print tamTinh
 tamTinh = 67500                                             ← the NEW code ran, without restarting Spring
exec-5[1] cont
$ curl -s 127.0.0.1:48080/api/dat-cho/1/hoa-don
{"datChoId":1,"phong":"Lab 401","soPhut":90,"tamTinh":67500,"giam":0,"thanhTien":67500}</div>`;

const OUT_HOTSWAP_LOI = `<div class="out"># second attempt: same fix + a new helper method  static long lamTron(long x) { … }
&gt; redefine vn.labflow.service.HoaDonService /…/hotswap/them/out/vn/labflow/service/HoaDonService.class
Error redefining vn.labflow.service.HoaDonService to /…/HoaDonService.class - java.lang.UnsupportedOperationException: add method not implemented</div>`;

const OUT_FORCE = `<div class="out">$ java tools/Jdi.java 45005 force-return vn.labflow.service.EmailThongBao gui false &amp;
$ curl -s -X POST 127.0.0.1:48080/api/dat-cho/4/duyet
{"id":4,"phong":"Lab 402","nguoiDat":"SE1801",…,"trangThai":"DA_DUYET","ghiChu":"Chưa gửi được thông báo — gửi lại sau"}
[jdi] entered vn.labflow.service.EmailThongBao.gui(java.lang.String, java.lang.String) args=["SE1801", "Lịch 4 đã được duyệt"] - forcing return false
$ grep -c '\\[email\\]' app.log
0                                          ← the body of gui() never ran; the fallback branch did
                                           ← and the fallback OVERWROTE the note "Mang theo máy chiếu": a second bug, found for free</div>`;

const MA_PEEK = `<pre><code class="language-java">// Temporary, never committed: count what each step lets through
var dem = new AtomicInteger[]{ new AtomicInteger(), new AtomicInteger() };   // java.util.concurrent.atomic
return repo.findByBatDauBetweenOrderByBatDau(tu, tu.plus(7, ChronoUnit.DAYS)).stream()
    .filter(d -&gt; d.getTrangThai() != TrangThai.HUY)
    .map(d -&gt; new DongLich(…))
    .peek(x -&gt; dem[0].incrementAndGet())
    .distinct()
    .peek(x -&gt; dem[1].incrementAndGet())
    .toList();     // then evaluate dem[0] and dem[1]: 7 and 6</code></pre>`;

const NGUON = [
  nguon('🌊', 'IntelliJ IDEA — Analyze Java Stream operations (Trace Current Stream Chain)', 'Xem từng bước của stream: phần tử nào qua, phần tử nào bị loại.', 'https://www.jetbrains.com/help/idea/analyze-java-stream-operations.html'),
  nguon('🔁', 'IntelliJ IDEA — Alter the program’s execution flow', 'Reset Frame (trước gọi Drop Frame), Force Return, Throw Exception.', 'https://www.jetbrains.com/help/idea/altering-the-program-s-execution-flow.html'),
  nguon('♻️', 'IntelliJ IDEA — Reload modified classes (HotSwap)', 'Recompile khi đang debug; giới hạn: chỉ đổi thân hàm.', 'https://www.jetbrains.com/help/idea/altering-the-program-s-execution-flow.html#reload_classes'),
  nguon('☕', 'Oracle — JDI ThreadReference.forceEarlyReturn / VirtualMachine.redefineClasses', 'API mà Force Return và HotSwap gọi xuống JVM.', 'https://docs.oracle.com/en/java/javase/25/docs/api/jdk.jdi/com/sun/jdi/VirtualMachine.html#redefineClasses(java.util.Map)'),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-3-3-buoc-va-quan-sat', title: 'Bài 3.3 — Restart Frame trong VS Code', sub: 'Cùng ý tưởng ở Node.js — và vì sao nó từ chối với hàm async.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '4.3 — Streams, lambdas, Drop Frame, Force Return and HotSwap|||4.3 — Stream, lambda, Drop Frame, Force Return và HotSwap',
  slug: 'dbg-4-3-stream-hotswap',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Báo cáo tuần mất một lượt đặt: breakpoint dòng trên stream dừng lúc DỰNG pipeline chứ không phải trong lambda; dừng đúng trong lambda (lambda$lichTuan$1) đếm được 7 phần tử vào, 6 ra ⇒ distinct() gộp hai lượt khác người. Trace Current Stream Chain của IntelliJ. HotSwap thật: sửa thân hàm khi đang chạy (45.000 → 67.500 không khởi động lại), thêm hàm thì bị từ chối "add method not implemented"; Reset/Drop Frame chạy lại hàm; Force Return giả lập dịch vụ email lỗi — và tình cờ lộ thêm lỗi ghi đè ghi chú.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>Streams hide their steps; the debugger can change the past</h2>
<p class="lead">Two kinds of code are awkward to debug the classic way: Java streams (one "line" that is really a pipeline running element by element) and slow-to-restart apps (a Spring Boot restart costs seconds to minutes). This lesson covers how to look inside a stream, and three IntelliJ actions that rewrite execution: Reset Frame (formerly Drop Frame), Force Return and HotSwap.</p>

<h3>An everyday picture: the sorting line at a post office</h3>
<p>A stream is a conveyor belt with stations: one throws away cancelled letters (filter), one re-labels (map), one removes duplicates (distinct). Looking at the belt from far away you only see letters go in and fewer come out. To know which station took a letter, you must stand at each station — that is what a lambda breakpoint and Stream Trace do.</p>

<h3>1. The bug: the weekly report is one booking short</h3>
${MA_LICH}
${OUT_TUAN}
<p>Put a line breakpoint on line 34 and look — the first surprise:</p>
${OUT_DONG}
<p>A line containing a lambda has <em>two</em> places to stop: when the pipeline is built (once), and inside the lambda body (once per element). IntelliJ asks you when you click the gutter: <em>Line</em>, <em>λ</em> (the lambda) or <em>All</em>. The compiler turned each lambda into a hidden method (<code>lambda$lichTuan$1</code>), and that is where to stop:</p>
${OUT_LAMBDA}
<p>Booking 2 (SE1802) maps to exactly the same <code>DongLich</code> as booking 1 (SE1801): same room, same date, same minutes. A <code>record</code> gets <code>equals</code> from its fields, and the student is not one of them, so <code>distinct()</code> treats two people as one. Someone added <code>distinct()</code> "to remove duplicates from the join" — there was no join. Fix: remove it (or include the booking id in the record).</p>

<h3>2. Trace Current Stream Chain</h3>
<p>IntelliJ does the counting for you. When paused on a line with a stream, click <em>Trace Current Stream Chain</em> in the Debug toolbar (the icon with a stream; bundled Java Stream Debugger). A window opens with one tab per operation: <code>filter</code> 8 → 7, <code>map</code> 7 → 7, <code>distinct</code> 7 → 6, with lines showing which element went where — the dropped booking is the one without an outgoing arrow. It evaluates the whole chain again in the debugger, so do not use it on streams with side effects (writes, emails).</p>
<p>Without IntelliJ (or in a test): temporary <code>peek</code> counters, removed afterwards —</p>
${MA_PEEK}

<h3>3. HotSwap: change the code without restarting Spring</h3>
<p>Back to lesson 4.1's invoice bug. Edit the line, then <em>Build → Recompile</em> (Ctrl+Shift+F9 / ⌘⇧F9) while debugging; IntelliJ asks "Reload changed classes?" (recent versions show a <em>Code changed: Hot Swap</em> button). Under the hood it calls JDI <code>redefineClasses</code> — jdb's <code>redefine</code>:</p>
${OUT_HOTSWAP}
<p>Note the trap in the middle: after the swap, the paused frame still runs the old version of the method, and its variables are no longer visible. You must <strong>Reset Frame</strong> to re-enter the method with the new code (jdb <code>reenter</code>). HotSwap only replaces method <em>bodies</em>:</p>
${OUT_HOTSWAP_LOI}
<p>Adding/removing methods or fields, changing signatures, annotations that Spring reads at start-up (a new <code>@GetMapping</code>, a new bean) — all need a restart. Spring Boot DevTools' automatic restart is the practical answer for those; the JetBrains Runtime option <code>-XX:+AllowEnhancedClassRedefinition</code> lifts some JVM limits but not Spring's (the new endpoint still is not registered).</p>

<h3>4. Reset Frame (Drop Frame): run the method again</h3>
<p>Right-click the top frame → <em>Reset Frame</em>. The method's frame is popped and execution goes back to the call, so you can step in again — after a HotSwap, or because you stepped over the interesting line. It does <strong>not</strong> undo side effects: rows already inserted, a counter already incremented, an email already sent stay done. Resetting a frame that already saved something often makes the second run behave differently — that is not the bug.</p>

<h3>5. Force Return: pretend a dependency failed</h3>
<p>How does <code>duyet()</code> behave when the email provider is down? You could unplug the network… or make <code>gui()</code> return <code>false</code> without running it. IntelliJ: stop at the first line of <code>gui</code>, right-click its frame → <em>Force Return</em>, enter <code>false</code>. The JDI call is <code>ThreadReference.forceEarlyReturn</code>:</p>
${ma(DATCHO_SV)}
${ma(EMAIL)}
${OUT_FORCE}
<p>The fallback branch works — and it destroys whatever note the booking had. Exploring a "what if" with Force Return found a second bug no tester had reported. (Fix: append to the note, or store the notification state in its own column.) The same menu has <em>Throw Exception</em> to simulate a timeout or a <code>DataAccessException</code>.</p>

<h3>Workplace situation</h3>
<p>Your Spring app takes 90 seconds to start (many beans, a big Flyway history — normal in enterprise projects). Each "edit → restart → click through the UI to the screen" cycle costs three minutes. With HotSwap + Reset Frame you test five ideas in the time of one restart. But never "fix it in the debugger" and forget: HotSwapped code lives only in that JVM. Commit the change and add the test.</p>

<h3>🧪 Practice (35 min)</h3>
<div class="callout ok">
<ol>
<li>Stop on line 34 with Line, then with λ; explain the difference.</li>
<li>Use Trace Current Stream Chain (or the peek counters) to find which operation drops the booking; fix it and add a test asserting 7 lines.</li>
<li>HotSwap the invoice fix during a paused request; Reset Frame and verify 67,500. Then try to add a method and read the error.</li>
<li>Force Return <code>false</code> from <code>EmailThongBao.gui</code> while approving booking 4; describe the second bug in one sentence.</li>
</ol>
<p><strong>Done when:</strong> both bugs from this lesson have a fix + test, and you can list two things HotSwap cannot do.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Lambda breakpoint</span><span class="v">Stops inside the lambda body, once per element.</span></div>
  <div class="kv"><span class="k">lambda$m$n</span><span class="v">Hidden method the compiler generates for a lambda.</span></div>
  <div class="kv"><span class="k">Trace Current Stream Chain</span><span class="v">IntelliJ view of what each stream step keeps and drops.</span></div>
  <div class="kv"><span class="k">HotSwap</span><span class="v">Replace method bodies in a running JVM (redefineClasses).</span></div>
  <div class="kv"><span class="k">Reset / Drop Frame</span><span class="v">Pop a frame and re-enter the method; side effects stay.</span></div>
  <div class="kv"><span class="k">Force Return</span><span class="v">Return a chosen value from a method without running it.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A line with a lambda has two stop points; pick λ to see each element.</li>
<li>Count in/out per stream step (Stream Trace or peek) to find the step that drops data.</li>
<li>HotSwap changes method bodies only; then Reset Frame to run the new code.</li>
<li>Reset Frame does not undo database writes or other side effects.</li>
<li>Force Return / Throw Exception simulate failing dependencies — great for finding untested fallback branches.</li>
</ul>
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>Stream giấu các bước của nó; debugger thì sửa được quá khứ</h2>
<p class="lead">Có hai loại code khó debug theo kiểu cổ điển: stream của Java (một "dòng" nhưng thực ra là một pipeline chạy từng phần tử) và ứng dụng khởi động lại chậm (Spring Boot khởi động lại mất từ vài giây tới vài phút). Bài này dạy cách nhìn vào bên trong stream, và ba thao tác IntelliJ viết lại luồng chạy: Reset Frame (trước gọi là Drop Frame), Force Return và HotSwap.</p>

<h3>Liên tưởng đời thường: băng chuyền phân loại ở bưu điện</h3>
<p>Stream là băng chuyền có nhiều trạm: một trạm bỏ thư đã huỷ (filter), một trạm dán nhãn lại (map), một trạm bỏ thư trùng (distinct). Đứng xa chỉ thấy thư vào nhiều, ra ít hơn. Muốn biết trạm nào lấy mất một lá thư, phải đứng ở từng trạm — đó là việc của breakpoint trong lambda và Stream Trace.</p>

<h3>1. Lỗi: báo cáo tuần thiếu một lượt đặt</h3>
${MA_LICH}
${OUT_TUAN}
<p>Đặt breakpoint dòng ở dòng 34 và nhìn — bất ngờ đầu tiên:</p>
${OUT_DONG}
<p>Một dòng có lambda có <em>hai</em> chỗ dừng: lúc dựng pipeline (một lần) và trong thân lambda (mỗi phần tử một lần). IntelliJ hỏi khi bạn bấm vào lề: <em>Line</em>, <em>λ</em> (lambda) hay <em>All</em>. Trình biên dịch đã biến mỗi lambda thành một hàm ẩn (<code>lambda$lichTuan$1</code>), và đó là chỗ cần dừng:</p>
${OUT_LAMBDA}
<p>Lượt 2 (SE1802) map ra <code>DongLich</code> y hệt lượt 1 (SE1801): cùng phòng, cùng ngày, cùng số phút. <code>record</code> có <code>equals</code> theo các trường của nó, mà người đặt không nằm trong đó, nên <code>distinct()</code> coi hai người là một. Ai đó đã thêm <code>distinct()</code> "để bỏ trùng do join" — nhưng làm gì có join. Sửa: bỏ nó (hoặc thêm id lượt đặt vào record).</p>

<h3>2. Trace Current Stream Chain</h3>
<p>IntelliJ đếm hộ bạn. Khi đang dừng ở dòng có stream, bấm <em>Trace Current Stream Chain</em> trên thanh công cụ Debug (biểu tượng dòng chảy; plugin Java Stream Debugger có sẵn). Một cửa sổ mở ra, mỗi thao tác một tab: <code>filter</code> 8 → 7, <code>map</code> 7 → 7, <code>distinct</code> 7 → 6, có đường nối cho thấy phần tử nào đi đâu — lượt bị bỏ là lượt không có mũi tên đi ra. Nó tính lại cả chuỗi trong debugger, nên đừng dùng với stream có tác dụng phụ (ghi DB, gửi email).</p>
<p>Không có IntelliJ (hoặc trong test): đếm tạm bằng <code>peek</code>, xoá sau khi xong —</p>
${MA_PEEK}

<h3>3. HotSwap: đổi code mà không khởi động lại Spring</h3>
<p>Quay lại lỗi hoá đơn ở bài 4.1. Sửa dòng code, rồi <em>Build → Recompile</em> (Ctrl+Shift+F9 / ⌘⇧F9) trong lúc đang debug; IntelliJ hỏi "Reload changed classes?" (bản mới hiện nút <em>Code changed: Hot Swap</em>). Bên dưới nó gọi <code>redefineClasses</code> của JDI — lệnh <code>redefine</code> của jdb:</p>
${OUT_HOTSWAP}
<p>Chú ý cái bẫy ở giữa: sau khi swap, frame đang dừng vẫn chạy phiên bản CŨ của hàm, và biến của nó không còn xem được. Phải <strong>Reset Frame</strong> để vào lại hàm với code mới (jdb: <code>reenter</code>). HotSwap chỉ thay <em>thân</em> hàm:</p>
${OUT_HOTSWAP_LOI}
<p>Thêm/bớt hàm hay trường, đổi chữ ký hàm, annotation mà Spring đọc lúc khởi động (một <code>@GetMapping</code> mới, một bean mới) — đều phải khởi động lại. Với những thứ đó, cách thực tế là để Spring Boot DevTools tự khởi động lại; tuỳ chọn <code>-XX:+AllowEnhancedClassRedefinition</code> của JetBrains Runtime gỡ bớt giới hạn của JVM nhưng không gỡ được giới hạn của Spring (endpoint mới vẫn không được đăng ký).</p>

<h3>4. Reset Frame (Drop Frame): chạy lại hàm</h3>
<p>Chuột phải vào frame trên cùng → <em>Reset Frame</em>. Frame của hàm bị bỏ và luồng chạy quay về chỗ gọi, để bạn step vào lại — sau HotSwap, hoặc vì lỡ step over qua dòng quan trọng. Nó <strong>không</strong> hoàn tác tác dụng phụ: dòng đã insert, bộ đếm đã tăng, email đã gửi vẫn còn đó. Reset một frame đã lưu dữ liệu thường làm lần chạy thứ hai khác đi — cái đó không phải là lỗi.</p>

<h3>5. Force Return: giả vờ một dịch vụ phụ thuộc bị lỗi</h3>
<p><code>duyet()</code> xử lý ra sao khi nhà cung cấp email sập? Bạn có thể rút dây mạng… hoặc bắt <code>gui()</code> trả <code>false</code> mà không chạy thân hàm. IntelliJ: dừng ở dòng đầu của <code>gui</code>, chuột phải frame → <em>Force Return</em>, nhập <code>false</code>. Lời gọi JDI là <code>ThreadReference.forceEarlyReturn</code>:</p>
${ma(DATCHO_SV)}
${ma(EMAIL)}
${OUT_FORCE}
<p>Nhánh dự phòng chạy đúng — và xoá mất ghi chú cũ của lượt đặt. Thử "nếu… thì" bằng Force Return đã lộ ra một lỗi thứ hai chưa tester nào báo. (Sửa: nối thêm vào ghi chú, hoặc lưu trạng thái thông báo ở cột riêng.) Cùng menu có <em>Throw Exception</em> để giả lập timeout hay <code>DataAccessException</code>.</p>

<h3>Tình huống đi làm</h3>
<p>Ứng dụng Spring của dự án mất 90 giây để khởi động (nhiều bean, lịch sử Flyway dài — bình thường ở dự án doanh nghiệp). Mỗi vòng "sửa → khởi động lại → bấm qua giao diện tới đúng màn hình" tốn ba phút. Với HotSwap + Reset Frame, bạn thử năm ý tưởng trong thời gian một lần khởi động lại. Nhưng đừng "sửa trong debugger" rồi quên: code đã HotSwap chỉ sống trong JVM đó. Commit thay đổi và thêm test.</p>

<h3>🧪 Thực hành (35 phút)</h3>
<div class="callout ok">
<ol>
<li>Dừng ở dòng 34 với Line, rồi với λ; giải thích khác nhau thế nào.</li>
<li>Dùng Trace Current Stream Chain (hoặc bộ đếm peek) tìm thao tác làm rơi lượt đặt; sửa và thêm test khẳng định có 7 dòng.</li>
<li>HotSwap bản sửa hoá đơn trong lúc request đang dừng; Reset Frame và kiểm ra 67.500. Rồi thử thêm một hàm và đọc thông báo lỗi.</li>
<li>Force Return <code>false</code> từ <code>EmailThongBao.gui</code> khi duyệt lượt 4; mô tả lỗi thứ hai trong một câu.</li>
</ol>
<p><strong>Đạt khi:</strong> cả hai lỗi trong bài có bản sửa + test, và bạn kể được hai việc HotSwap không làm được.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Breakpoint lambda</span><span class="v">Dừng trong thân lambda, mỗi phần tử một lần.</span></div>
  <div class="kv"><span class="k">lambda$m$n</span><span class="v">Hàm ẩn trình biên dịch sinh cho một lambda.</span></div>
  <div class="kv"><span class="k">Trace Current Stream Chain</span><span class="v">Màn hình IntelliJ cho thấy mỗi bước stream giữ và bỏ gì.</span></div>
  <div class="kv"><span class="k">HotSwap</span><span class="v">Thay thân hàm trong JVM đang chạy (redefineClasses).</span></div>
  <div class="kv"><span class="k">Reset / Drop Frame</span><span class="v">Bỏ một frame và vào lại hàm; tác dụng phụ vẫn còn.</span></div>
  <div class="kv"><span class="k">Force Return</span><span class="v">Trả về giá trị tự chọn mà không chạy thân hàm.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Dòng có lambda có hai điểm dừng; chọn λ để thấy từng phần tử.</li>
<li>Đếm vào/ra từng bước stream (Stream Trace hoặc peek) để tìm bước làm rơi dữ liệu.</li>
<li>HotSwap chỉ đổi thân hàm; sau đó Reset Frame để chạy code mới.</li>
<li>Reset Frame không hoàn tác ghi database hay tác dụng phụ khác.</li>
<li>Force Return / Throw Exception giả lập phụ thuộc bị lỗi — rất hợp để tìm nhánh dự phòng chưa được test.</li>
</ul>
${NGUON}
</div>
`,
};
