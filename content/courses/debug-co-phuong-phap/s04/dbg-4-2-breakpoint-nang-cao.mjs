/**
 * 4.2 — Breakpoint nâng cao: điều kiện, suspend, chỉ ghi log, ngoại lệ, watchpoint (soạn 24/11/2026).
 * Output THẬT: jdb (JDK 25) gắn JDWP vào LabFlow Java; Jdi.java (client JDI tự viết, cùng API IntelliJ dùng) cho breakpoint điều kiện,
 * log-only, method breakpoint. Số đo: 300 request tuần tự (tai.sh) — nền 1,90 s; điều kiện 2,29 s; method breakpoint 22,89 s.
 * Phát hiện thật: Hibernate nạp entity bằng reflection ⇒ field watchpoint KHÔNG bắt được lần gán đó (chỉ bắt putfield trong bytecode).
 * Phiên: s42a/s42b (suspend), s42c (watchpoint), s42d (NPE), jdi-*.out.
 */
import { nguon, lienKet } from '../_chung.mjs';
import { MAPPER, BAOCAO, JDI } from './_ma-4.mjs';

const ma = (s, lang = 'java') => `<pre><code class="language-${lang}">${s}</code></pre>`;

const OUT_SUSPEND_ALL = `<div class="out">&gt; stop at vn.labflow.service.HoaDonService:17                 # default policy: Suspend ALL
&gt;                                    # request 1: curl …/api/dat-cho/1/hoa-don      → stops
Breakpoint hit: "thread=http-nio-127.0.0.1-48080-exec-1", vn.labflow.service.HoaDonService.tinh(), line=17 bci=8
                                     # request 2 from a colleague, 1 s later:
$ curl -s -m 3 -w ' [health: HTTP %{http_code}, %{time_total}s]' 127.0.0.1:48080/actuator/health
 [health: HTTP 000, 3.002163s]       ← no answer at all: every thread of the JVM is frozen</div>`;

const OUT_SUSPEND_THREAD = `<div class="out">&gt; stop thread at vn.labflow.service.HoaDonService:17          # Suspend: Thread
Breakpoint hit: "thread=http-nio-127.0.0.1-48080-exec-5", vn.labflow.service.HoaDonService.tinh(), line=17 bci=8
&gt; threads
  …
  (org.apache.tomcat.util.threads.TaskThread)15331  http-nio-127.0.0.1-48080-exec-4   cond. waiting
  (org.apache.tomcat.util.threads.TaskThread)15317  http-nio-127.0.0.1-48080-exec-5   running (at breakpoint)
  (org.apache.tomcat.util.threads.TaskThread)15332  http-nio-127.0.0.1-48080-exec-6   cond. waiting
  …
$ curl -s -m 3 -w ' [health: HTTP %{http_code}, %{time_total}s]' 127.0.0.1:48080/actuator/health
{"groups":["liveness","readiness"],"status":"UP"} [health: HTTP 200, 0.004574s]    ← the rest of the app keeps serving
&gt; resume
All threads resumed.
$ (request 1)  {"datChoId":1,…,"thanhTien":45000} [7.604724s]                          ← only the paused request waited</div>`;

const OUT_DO = `<div class="out">$ ./tai.sh 300 127.0.0.1:48080/api/dat-cho/1/hoa-don                       # no debugger client
300 requests: 1.90 s, 6.3 ms/request

$ java tools/Jdi.java 45005 dieu-kien vn.labflow.service.HoaDonService 17 id 5 &amp;   # condition d.id == 5
$ ./tai.sh 300 127.0.0.1:48080/api/dat-cho/1/hoa-don;  curl -s …/api/dat-cho/5/hoa-don
300 requests: 2.29 s, 7.6 ms/request
[jdi] condition true at hit 301 on http-nio-127.0.0.1-48080-exec-9 - would stop here
[jdi] 301 events received, 1 matched, in 20.5 s        ← the JVM stopped 301 times; the debugger said "go on" 300 times

$ java tools/Jdi.java 45005 method vn.labflow.service.HoaDonService tinh &amp;       # method breakpoint, IDE-style
$ ./tai.sh 300 127.0.0.1:48080/api/dat-cho/1/hoa-don
300 requests: 22.89 s, 76.3 ms/request                 ← 12× slower, for a breakpoint that matched one method</div>`;

const OUT_LOG = `<div class="out">$ java tools/Jdi.java 45005 log vn.labflow.service.HoaDonService 17 &amp;           # "Suspend: off" + "Evaluate and log"
$ for i in 1 3 4; do curl -s …/api/dat-cho/$i/hoa-don &gt;/dev/null; done
[log] http-nio-127.0.0.1-48080-exec-5 datCho=1 soPhut=90
[log] http-nio-127.0.0.1-48080-exec-8 datCho=3 soPhut=120
[log] http-nio-127.0.0.1-48080-exec-10 datCho=4 soPhut=60</div>`;

const OUT_TRIEU_CHUNG = `<div class="out">$ curl -s 127.0.0.1:48080/api/dat-cho/3
{"id":3,"phong":"Lab 402","nguoiDat":"SE1803",…,"soPhut":120,"trangThai":"DA_DUYET","ghiChu":null}
$ curl -s -X PATCH -H 'Content-Type: application/json' -d '{"ghiChu":"Cần 2 ổ cắm"}' 127.0.0.1:48080/api/dat-cho/3
{"id":3,…,"trangThai":"CHO_DUYET","ghiChu":"Cần 2 ổ cắm"}        ← adding a note "un-approved" the booking</div>`;

const OUT_WATCH = `<div class="out">&gt; watch vn.labflow.model.DatCho.trangThai                      # field watchpoint, modification
Set watch modification of vn.labflow.model.DatCho.trangThai
                                                               # PATCH /api/dat-cho/3 {"ghiChu":"Cần 2 ổ cắm"}
Field (vn.labflow.model.DatCho.trangThai) is null, will be instance of vn.labflow.model.TrangThai(id=15627):
  "thread=http-nio-127.0.0.1-48080-exec-4", vn.labflow.model.DatCho.&lt;init&gt;(), line=13 bci=8
13      @Enumerated(EnumType.STRING) private TrangThai trangThai = TrangThai.CHO_DUYET;
                                         ← Hibernate creates an empty DatCho: the field initialiser runs (noise, continue)
exec-4[1] cont
Field (vn.labflow.model.DatCho.trangThai) is instance of vn.labflow.model.TrangThai(id=15650), will be instance of vn.labflow.model.TrangThai(id=15627):
  "thread=http-nio-127.0.0.1-48080-exec-4", vn.labflow.model.DatCho.setTrangThai(), line=28 bci=2
28      public void setTrangThai(TrangThai trangThai) { this.trangThai = trangThai; }
exec-4[1] print this.trangThai
 this.trangThai = "DA_DUYET"
exec-4[1] print trangThai
 trangThai = "CHO_DUYET"
exec-4[1] where
  [1] vn.labflow.model.DatCho.setTrangThai (DatCho.java:28)
  [2] vn.labflow.service.DatChoMapper.capNhat (DatChoMapper.java:12)      ← the culprit
  [3] vn.labflow.service.DatChoService.sua (DatChoService.java:28)
  …</div>`;

const OUT_NPE = `<div class="out">$ curl -s 127.0.0.1:48080/api/bao-cao/co-ghi-chu
{"soLuot":0}                                  ← booking 4 has a note; the front desk sees 0, no error anywhere

&gt; catch java.lang.NullPointerException         # exception breakpoint, caught + uncaught
Set all java.lang.NullPointerException
Exception occurred: java.lang.NullPointerException (to be caught at: vn.labflow.service.BaoCaoService.soCoGhiChu(), line=43 bci=30)
  "thread=http-nio-127.0.0.1-48080-exec-3", vn.labflow.service.BaoCaoService.lambda$soCoGhiChu$0(), line=42 bci=4
42          return repo.findAll().stream().filter(d -&gt; !d.getGhiChu().isBlank()).count();
exec-3[1] where
  [1] vn.labflow.service.BaoCaoService.lambda$soCoGhiChu$0 (BaoCaoService.java:42)
  [2] vn.labflow.service.BaoCaoService$$Lambda/0x000000002fbfa228.test (null)
  [3] java.util.stream.ReferencePipeline$2$1.accept (ReferencePipeline.java:196)
  …</div>`;

const NGUON = [
  nguon('🧠', 'IntelliJ IDEA — Breakpoints (types, properties)', 'Line, method, field watchpoint, exception; Condition, Suspend, Evaluate and log, Remove once hit, Disable until hit.', 'https://www.jetbrains.com/help/idea/using-breakpoints.html'),
  nguon('🐢', 'IntelliJ IDEA — Method breakpoints can slow down debugging', 'Khuyến cáo chính thức; tuỳ chọn "Emulated" cho method breakpoint.', 'https://www.jetbrains.com/help/idea/using-breakpoints.html#method_breakpoint'),
  nguon('☕', 'Oracle — JVM TI: FieldModification event', 'Sự kiện sinh ra khi code Java (putfield) hoặc JNI ghi trường — nền của field watchpoint.', 'https://docs.oracle.com/en/java/javase/25/docs/specs/jvmti.html#FieldModification'),
  nguon('📘', 'JEP 358 — Helpful NullPointerExceptions', 'Thông báo NPE nói biểu thức nào null (JDK 14+).', 'https://openjdk.org/jeps/358'),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-3-2-breakpoint', title: 'Bài 3.2 — breakpoint chuyên sâu trong VS Code', sub: 'Cùng ý tưởng phía Node.js: điều kiện, đếm lượt, logpoint, ngoại lệ caught.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '4.2 — Advanced breakpoints: conditions, suspend policy, log-only, exceptions, watchpoints|||4.2 — Breakpoint nâng cao: điều kiện, suspend, chỉ ghi log, ngoại lệ, watchpoint',
  slug: 'dbg-4-2-breakpoint-nang-cao',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Suspend All làm treo cả ứng dụng (health không trả lời), Suspend Thread thì không — đo thật; breakpoint điều kiện được debugger kiểm ở MỖI lượt (301 lần dừng cho 1 lần khớp); breakpoint chỉ ghi log; method breakpoint làm chậm 12× (đo 300 request); field watchpoint tìm ra mapper ghi đè trạng thái DA_DUYET khi chỉ sửa ghi chú (và vì sao nó không bắt được lần Hibernate nạp dữ liệu); exception breakpoint bắt NPE bị try/catch nuốt mất.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>Breakpoints that ask the right question</h2>
<p class="lead">A plain line breakpoint asks "stop here, every time, and freeze everything". Most real bugs need a sharper question: stop only for booking 5; do not freeze the other users; just print; stop wherever this field changes; stop where this exception is thrown even if someone catches it. IntelliJ has a setting for each — right-click any breakpoint, or Ctrl+Shift+F8 / ⌘⇧F8 for the full dialog.</p>

<h3>An everyday picture: the traffic police</h3>
<p>Suspend All is closing the whole road to check one car. Suspend Thread is waving one car to the side while the traffic keeps flowing. A conditional breakpoint is an officer who still has to look at every car to find the one with the right plate — cheap per car, but he looks at all of them. A method breakpoint is putting an officer at every intersection of the city.</p>

<h3>1. Suspend policy: All vs Thread — measured</h3>
<p>IntelliJ's default is <strong>Suspend: All</strong> — when the breakpoint hits, every thread of the JVM stops. On your laptop that is fine. On a shared dev server (or when your front-end polls the API) everything freezes:</p>
${OUT_SUSPEND_ALL}
<p>Switch the breakpoint to <strong>Suspend: Thread</strong> (right-click the red dot → Suspend → Thread; "Make Default" to keep it):</p>
${OUT_SUSPEND_THREAD}
<p>Rule: debugging a web server → Thread. Use All when you need a consistent snapshot of several threads (a race, a deadlock — chapter 8), because otherwise the other threads keep changing the data while you look.</p>

<h3>2. Condition and "log only": what they really cost</h3>
<p>A condition such as <code>d.getId() == 5</code> is <em>not</em> evaluated inside the JVM. The JVM stops the thread at every hit, sends an event to the debugger, the debugger evaluates the condition over JDWP and resumes if false. To show this honestly we wrote an 80-line debugger client on JDI — the Java API IntelliJ's debugger is built on — and measured 300 requests:</p>
${ma(JDI)}
${OUT_DO}
<ul>
<li><strong>Condition:</strong> about 1.3 ms extra per hit here (2.29 s vs 1.90 s). Fine for hundreds of hits; a loop of a million iterations would take tens of minutes. In hot loops, put the condition in a temporary <code>if</code> and a plain breakpoint inside it, or use "Pass count" (IntelliJ: Disable until… / hit count) when you know the number.</li>
<li><strong>Method breakpoint:</strong> 12× slower — even though it only matched one method. Method entry/exit events make the JVM check every method call. JetBrains' own documentation warns about this. Put a line breakpoint on the first line of the method instead (or tick "Emulated", which does that for you).</li>
<li><strong>Log only</strong> (IntelliJ: untick Suspend, tick "Evaluate and log"): the thread stops for microseconds, the expression is logged in the Console, the program never visibly pauses. It is the Java equivalent of chapter 3's logpoint — logging without editing or redeploying:</li>
</ul>
${OUT_LOG}

<h3>3. Field watchpoint: who changed this value?</h3>
<p>The bug: a receptionist adds a note to an approved booking, and the booking silently goes back to "waiting for approval".</p>
${OUT_TRIEU_CHUNG}
<p>The status field is written in many places — constructor, service, mapper, Hibernate. Instead of reading them all, put a <strong>field watchpoint</strong> on it: click the gutter next to the field declaration (the icon is an eye), modification only.</p>
${OUT_WATCH}
${ma(MAPPER)}
<p>Found in one step: the mapper treats "no status in the request" as "set to CHO_DUYET". For PATCH, an absent field must mean "leave unchanged". Fix: <code>if (dto.trangThai() != null) d.setTrangThai(dto.trangThai());</code></p>
<p><strong>A trap we hit for real:</strong> the field went from <code>CHO_DUYET</code> (constructor, id 15627) to <code>DA_DUYET</code> (id 15650) when Hibernate loaded the row — and the watchpoint did <em>not</em> fire. Watchpoints rely on the JVM TI FieldModification event, raised by bytecode <code>putfield</code> and JNI; Hibernate sets the field through reflection/method handles, which bypass it. So a watchpoint catches your code changing a field, not the ORM filling it from the database. If you suspect the data itself, look at the SQL (lesson 4.4).</p>

<h3>4. Exception breakpoint: the exception somebody swallowed</h3>
<p>The front desk's "bookings with a note" counter always shows 0:</p>
${ma(BAOCAO)}
<p>The <code>catch (Exception e)</code> logs at DEBUG (off in production) and returns 0. Without a stack trace there is nothing to read. IntelliJ: Ctrl+Shift+F8 → <code>+</code> → Java Exception Breakpoints → <code>NullPointerException</code>, tick both <em>Caught</em> and <em>Uncaught</em>:</p>
${OUT_NPE}
<p>The debugger stopped at the <code>throw</code> point and even said where it will be caught (line 43). Bookings without a note have <code>ghiChu == null</code>. Fixes: <code>d.getGhiChu() != null &amp;&amp; !d.getGhiChu().isBlank()</code> — and delete the catch-all: a dashboard that silently shows 0 is worse than an error.</p>
<p>NPE is thrown and caught inside libraries too. If it stops in Spring/Hibernate code, add a <em>Class filter</em> <code>vn.labflow.*</code> (or a Caller filter) in the exception breakpoint's properties. In lesson 4.6 you will see it stop in <code>Optional.orElseThrow</code> — one <code>up</code> and you are in your code.</p>

<h3>Workplace situation</h3>
<p>Your team lead asks you to debug on the shared DEV server because only there does the bug happen. Before you attach: use Suspend Thread, prefer log-only breakpoints, never leave a method breakpoint on, and tell the channel "debugging DEV from 14:00 to 14:30". A paused JVM looks exactly like an outage to everybody else — that is how you get called by the test lead.</p>

<h3>🧪 Practice (40 min)</h3>
<div class="callout ok">
<ol>
<li>Reproduce the suspend experiment: breakpoint in <code>tinh</code>, call <code>/actuator/health</code> under Suspend All and under Suspend Thread.</li>
<li>Conditional breakpoint <code>d.getId() == 5</code> in <code>tinh</code>; call bookings 1–8; confirm it stops only once.</li>
<li>Log-only breakpoint printing <code>"booking " + d.getId() + " minutes " + d.getSoPhut()</code>.</li>
<li>Field watchpoint on <code>DatCho.trangThai</code>, PATCH a note on booking 3, find the mapper line, fix it, add a test.</li>
<li>Exception breakpoint for NPE, find the swallowed exception, fix the filter and remove the catch-all.</li>
</ol>
<p><strong>Done when:</strong> each bug has a two-line note "technique → what I saw → cause", and you can say why method breakpoints are avoided.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Suspend policy</span><span class="v">All = freeze every thread; Thread = only the one that hit.</span></div>
  <div class="kv"><span class="k">Conditional breakpoint</span><span class="v">Stops only if an expression is true — checked by the debugger at every hit.</span></div>
  <div class="kv"><span class="k">Evaluate and log</span><span class="v">Breakpoint that prints instead of pausing.</span></div>
  <div class="kv"><span class="k">Field watchpoint</span><span class="v">Stops when bytecode reads/writes a field.</span></div>
  <div class="kv"><span class="k">Exception breakpoint</span><span class="v">Stops where an exception is thrown, caught or not.</span></div>
  <div class="kv"><span class="k">JDI</span><span class="v">Java Debug Interface — the Java API debuggers use on top of JDWP.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Debugging a server: Suspend Thread; All freezes every user.</li>
<li>Conditions cost a round trip per hit; method breakpoints slow the whole JVM (12× measured).</li>
<li>Log-only breakpoints = logging without redeploying.</li>
<li>Field watchpoint answers "who changed it" — for code, not for ORM loading.</li>
<li>Exception breakpoint finds exceptions hidden by catch-all blocks; filter by class to skip library noise.</li>
</ul>
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Breakpoint biết hỏi đúng câu</h2>
<p class="lead">Breakpoint dòng thường hỏi "dừng ở đây, lần nào cũng dừng, và đóng băng mọi thứ". Phần lớn lỗi thật cần câu hỏi sắc hơn: chỉ dừng với lượt đặt số 5; đừng làm treo người dùng khác; chỉ in ra; dừng ở bất cứ chỗ nào trường này bị đổi; dừng ở chỗ ngoại lệ bị ném dù có người đã bắt nó. IntelliJ có thiết lập cho từng câu — chuột phải vào breakpoint, hoặc Ctrl+Shift+F8 / ⌘⇧F8 để mở hộp thoại đầy đủ.</p>

<h3>Liên tưởng đời thường: cảnh sát giao thông</h3>
<p>Suspend All là chặn cả con đường để kiểm một xe. Suspend Thread là vẫy một xe vào lề trong khi dòng xe vẫn chạy. Breakpoint điều kiện là anh cảnh sát vẫn phải nhìn từng xe để tìm đúng biển số — mỗi xe tốn ít, nhưng xe nào cũng phải nhìn. Method breakpoint là đặt cảnh sát ở mọi ngã tư trong thành phố.</p>

<h3>1. Chính sách suspend: All hay Thread — đo thật</h3>
<p>Mặc định của IntelliJ là <strong>Suspend: All</strong> — khi breakpoint dừng, mọi luồng của JVM đều dừng. Trên laptop của bạn thì không sao. Trên server dev dùng chung (hoặc khi front-end liên tục gọi API) thì mọi thứ đứng hình:</p>
${OUT_SUSPEND_ALL}
<p>Chuyển breakpoint sang <strong>Suspend: Thread</strong> (chuột phải chấm đỏ → Suspend → Thread; bấm "Make Default" để giữ):</p>
${OUT_SUSPEND_THREAD}
<p>Quy tắc: debug web server → Thread. Dùng All khi cần một ảnh chụp nhất quán của nhiều luồng (race, deadlock — chương 8), vì nếu không các luồng khác vẫn đổi dữ liệu trong lúc bạn đang nhìn.</p>

<h3>2. Điều kiện và "chỉ ghi log": giá thật của chúng</h3>
<p>Điều kiện kiểu <code>d.getId() == 5</code> <em>không</em> được tính bên trong JVM. JVM dừng luồng ở MỌI lượt chạy qua, gửi sự kiện cho debugger, debugger tính điều kiện qua JDWP rồi cho chạy tiếp nếu sai. Để chứng minh trung thực, chúng tôi viết một client debugger 80 dòng trên JDI — API Java mà debugger của IntelliJ dựng trên đó — và đo 300 request:</p>
${ma(JDI)}
${OUT_DO}
<ul>
<li><strong>Điều kiện:</strong> ở đây thêm khoảng 1,3 ms mỗi lượt (2,29 s so với 1,90 s). Vài trăm lượt thì ổn; vòng lặp một triệu lần sẽ mất hàng chục phút. Trong vòng lặp nóng, viết tạm một <code>if</code> rồi đặt breakpoint thường bên trong, hoặc dùng đếm lượt (IntelliJ: Pass count / Disable until…) khi biết trước con số.</li>
<li><strong>Method breakpoint:</strong> chậm 12× — dù chỉ khớp đúng một hàm. Sự kiện vào/ra hàm bắt JVM kiểm mọi lần gọi hàm. Chính tài liệu JetBrains cảnh báo điều này. Hãy đặt breakpoint dòng ở dòng đầu của hàm (hoặc tích "Emulated" — IntelliJ làm hộ việc đó).</li>
<li><strong>Chỉ ghi log</strong> (IntelliJ: bỏ tích Suspend, tích "Evaluate and log"): luồng dừng vài micro giây, biểu thức được in ra Console, chương trình không hề khựng. Đây là bản Java của logpoint ở chương 3 — ghi log mà không sửa code, không deploy lại:</li>
</ul>
${OUT_LOG}

<h3>3. Field watchpoint: ai đã đổi giá trị này?</h3>
<p>Lỗi: lễ tân thêm ghi chú vào một lượt đã duyệt, và lượt đó lặng lẽ quay về "chờ duyệt".</p>
${OUT_TRIEU_CHUNG}
<p>Trường trạng thái được ghi ở nhiều nơi — constructor, service, mapper, Hibernate. Thay vì đọc hết, đặt <strong>field watchpoint</strong>: bấm vào lề cạnh dòng khai báo trường (biểu tượng con mắt), chọn modification.</p>
${OUT_WATCH}
${ma(MAPPER)}
<p>Tìm ra trong một bước: mapper coi "request không gửi trạng thái" là "đặt về CHO_DUYET". Với PATCH, trường vắng mặt phải nghĩa là "giữ nguyên". Sửa: <code>if (dto.trangThai() != null) d.setTrangThai(dto.trangThai());</code></p>
<p><strong>Một cái bẫy chúng tôi gặp thật:</strong> trường đã đổi từ <code>CHO_DUYET</code> (constructor, id 15627) sang <code>DA_DUYET</code> (id 15650) khi Hibernate nạp dòng dữ liệu — và watchpoint <em>không</em> dừng. Watchpoint dựa trên sự kiện FieldModification của JVM TI, sinh ra khi bytecode <code>putfield</code> hoặc JNI ghi trường; Hibernate gán trường qua reflection/method handle nên đi vòng qua nó. Vậy watchpoint bắt được code của bạn đổi trường, không bắt được ORM đổ dữ liệu từ database. Nếu nghi chính dữ liệu, hãy xem SQL (bài 4.4).</p>

<h3>4. Exception breakpoint: ngoại lệ bị ai đó nuốt mất</h3>
<p>Bộ đếm "lượt có ghi chú" của lễ tân luôn hiện 0:</p>
${ma(BAOCAO)}
<p>Khối <code>catch (Exception e)</code> ghi log ở mức DEBUG (production tắt) rồi trả 0. Không có stack trace thì chẳng có gì để đọc. IntelliJ: Ctrl+Shift+F8 → <code>+</code> → Java Exception Breakpoints → <code>NullPointerException</code>, tích cả <em>Caught</em> và <em>Uncaught</em>:</p>
${OUT_NPE}
<p>Debugger dừng đúng chỗ ném, còn nói luôn chỗ sẽ bắt (dòng 43). Lượt không có ghi chú có <code>ghiChu == null</code>. Sửa: <code>d.getGhiChu() != null &amp;&amp; !d.getGhiChu().isBlank()</code> — và xoá khối catch-all: dashboard lặng lẽ hiện 0 còn tệ hơn báo lỗi.</p>
<p>NPE cũng bị ném và bắt bên trong thư viện. Nếu nó dừng trong code Spring/Hibernate, thêm <em>Class filter</em> <code>vn.labflow.*</code> (hoặc Caller filter) trong thuộc tính của exception breakpoint. Ở bài 4.6 bạn sẽ thấy nó dừng trong <code>Optional.orElseThrow</code> — một lần <code>up</code> là về code của mình.</p>

<h3>Tình huống đi làm</h3>
<p>Trưởng nhóm bảo bạn debug trên server DEV dùng chung vì chỉ ở đó mới có lỗi. Trước khi gắn vào: dùng Suspend Thread, ưu tiên breakpoint chỉ ghi log, đừng bao giờ để method breakpoint bật, và báo trên kênh nhóm "debug DEV từ 14:00 đến 14:30". Một JVM đang dừng trông y hệt sự cố sập với mọi người khác — và đó là lúc test lead gọi bạn.</p>

<h3>🧪 Thực hành (40 phút)</h3>
<div class="callout ok">
<ol>
<li>Làm lại thí nghiệm suspend: breakpoint trong <code>tinh</code>, gọi <code>/actuator/health</code> khi Suspend All và khi Suspend Thread.</li>
<li>Breakpoint điều kiện <code>d.getId() == 5</code> trong <code>tinh</code>; gọi lượt 1–8; xác nhận nó chỉ dừng một lần.</li>
<li>Breakpoint chỉ ghi log in <code>"booking " + d.getId() + " minutes " + d.getSoPhut()</code>.</li>
<li>Field watchpoint trên <code>DatCho.trangThai</code>, PATCH ghi chú vào lượt 3, tìm dòng mapper, sửa, thêm test.</li>
<li>Exception breakpoint cho NPE, tìm ngoại lệ bị nuốt, sửa filter và bỏ catch-all.</li>
</ol>
<p><strong>Đạt khi:</strong> mỗi lỗi có ghi chú hai dòng "kỹ thuật → thấy gì → nguyên nhân", và bạn nói được vì sao tránh method breakpoint.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Suspend policy</span><span class="v">All = dừng mọi luồng; Thread = chỉ luồng chạm breakpoint.</span></div>
  <div class="kv"><span class="k">Breakpoint điều kiện</span><span class="v">Chỉ dừng khi biểu thức đúng — debugger kiểm ở mọi lượt chạy qua.</span></div>
  <div class="kv"><span class="k">Evaluate and log</span><span class="v">Breakpoint in ra thay vì dừng.</span></div>
  <div class="kv"><span class="k">Field watchpoint</span><span class="v">Dừng khi bytecode đọc/ghi một trường.</span></div>
  <div class="kv"><span class="k">Exception breakpoint</span><span class="v">Dừng ở chỗ ngoại lệ bị ném, dù có được bắt hay không.</span></div>
  <div class="kv"><span class="k">JDI</span><span class="v">Java Debug Interface — API Java mà debugger dùng, nằm trên JDWP.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Debug server: Suspend Thread; All làm treo mọi người dùng.</li>
<li>Điều kiện tốn một vòng hỏi-đáp mỗi lượt; method breakpoint làm chậm cả JVM (đo được 12×).</li>
<li>Breakpoint chỉ ghi log = ghi log không cần deploy lại.</li>
<li>Field watchpoint trả lời "ai đã đổi" — với code, không với lúc ORM nạp dữ liệu.</li>
<li>Exception breakpoint tìm ngoại lệ bị catch-all giấu; lọc theo lớp để bỏ nhiễu thư viện.</li>
</ul>
${NGUON}
</div>
`,
};
