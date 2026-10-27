/**
 * PRO192 · 🎓 LAB211 thực chiến — khung chung + cách qua review, P0011, P0021, P0056 (đợt 1), P0070, P0071, P0073 (đợt 2).
 * Bài 🏗️ LAB CT Library (chuẩn LAB211, deck tự dựng): pro192-lab211-cach-qua-review, pro192-lab211-p0011-change-base-number, pro192-lab211-p0021-student-management, pro192-lab211-p0056-worker-management, pro192-lab211-p0070-ebank-login, pro192-lab211-p0071-task-management, pro192-lab211-p0073-handy-expense.
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/PRO192/gen/gen.mjs từ gen/src/**, gen/java/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node PRO192/gen/gen.mjs`.
 */

import { registerDeck, walk, bi } from './_slides.mjs';

registerDeck('l211-review', { code: 'PRO192 · LAB211', en: "LAB211 in practice — how to pass the lecturer's review", vi: 'LAB211 thực chiến — cách qua review của thầy', total: 15, w: 1280, h: 720 });
registerDeck('l211-p0011', { code: 'PRO192 · LAB211 P0011', en: 'LAB211 · J1.S.P0011 — Change Base Number System', vi: 'LAB211 · J1.S.P0011 — Đổi hệ cơ số', total: 13, w: 1280, h: 720 });
registerDeck('l211-p0021', { code: 'PRO192 · LAB211 P0021', en: 'LAB211 · J1.L.P0021 — Student Management', vi: 'LAB211 · J1.L.P0021 — Quản lý sinh viên', total: 14, w: 1280, h: 720 });
registerDeck('l211-p0056', { code: 'PRO192 · LAB211 P0056', en: 'LAB211 · J1.S.P0056 — Worker Management', vi: 'LAB211 · J1.S.P0056 — Quản lý công nhân', total: 13, w: 1280, h: 720 });
registerDeck('l211-p0070', { code: 'PRO192 · LAB211 P0070', en: 'LAB211 · J1.S.P0070 — Ebank Login (TPBank)', vi: 'LAB211 · J1.S.P0070 — Đăng nhập Ebank (TPBank)', total: 14, w: 1280, h: 720 });
registerDeck('l211-p0071', { code: 'PRO192 · LAB211 P0071', en: 'LAB211 · J1.S.P0071 — Task Management', vi: 'LAB211 · J1.S.P0071 — Quản lý task', total: 14, w: 1280, h: 720 });
registerDeck('l211-p0073', { code: 'PRO192 · LAB211 P0073', en: 'LAB211 · J1.S.P0073 — Handy Expense', vi: 'LAB211 · J1.S.P0073 — Quản lý chi tiêu', total: 14, w: 1280, h: 720 });

/* ───────── L.0 — 🎓 How to pass the LAB211 review: five gates, the 25-item checklist, lint.py, JDK 8 and the lecturer's questions ───────── */
const L_l211_review = {
  title: "L.0 — 🎓 How to pass the LAB211 review: five gates, the 25-item checklist, lint.py, JDK 8 and the lecturer's questions|||L.0 — 🎓 Cách qua review LAB211: năm cửa, tờ checklist 25 mục, lint.py, JDK 8 và câu thầy hay hỏi",
  slug: 'pro192-lab211-cach-qua-review',
  type: 'VIDEO',
  description: 'Bài mở đầu phần LAB211 thực chiến: LAB211 chấm thế nào (750 LOC, tối đa 3 bài một slot, lưu nháp rồi mới nộp), thầy review theo năm cửa nào, tờ checklist giấy 25 mục và những dòng hay trượt nhất, các luật thầy nói trên lớp (ArrayList chứ không List, tối đa 2 tham số, JavaBean, không static ở biến, không System.exit), ba lần bị bắt THẬT (CRUD trong service, tên biến service, câu lỗi mơ hồ). Tất cả trên một KHUNG CHUNG dùng cho mọi bài (Note Management, 10 tệp, 8 package) — chạy thật, lint.py sạch, JDK 8 thật. Kèm ba bẫy chạy thật: lint đỏ 8 lỗi, lint xanh mà thầy vẫn bắt, javac 8 từ chối var và List.of. Cuối bài: câu thầy hay hỏi kèm trả lời và kế hoạch 90 phút một buổi lab.',
  content: [
    bi(`<span class="eyebrow">🎓 LAB211 in practice · L.0</span>
<h2>How to pass the LAB211 review</h2>
<p class="lead">LAB211 is not a new subject: it is PRO192 done for real. The same classes, objects, encapsulation, interfaces, exceptions and ArrayList — but written under the lecturer's rules, in a fixed architecture, and defended out loud in front of him. People do not fail LAB211 because they cannot code; they fail because the code is in the wrong layer, a comment is missing, a variable is called <code>service</code>, or an error message says "Invalid!".</p>
<p>This lesson gives you the whole review in one place, on ONE small project you will reuse for every lab: the shared skeleton <strong>Note Management</strong> (Add · Delete · Display · Exit). The next lessons apply it to real labs of this semester — P0011, P0021, P0056 — each one the version already corrected after a real review.</p>`,
    `<span class="eyebrow">🎓 LAB211 thực chiến · L.0</span>
<h2>Cách qua review LAB211</h2>
<p class="lead">LAB211 không phải môn mới: nó là PRO192 làm thật. Vẫn lớp, đối tượng, đóng gói, interface, ngoại lệ, ArrayList — nhưng viết theo luật của thầy, trong một kiến trúc cố định, và phải bảo vệ bằng miệng trước mặt thầy. Người ta không trượt LAB211 vì không biết code; người ta trượt vì code nằm sai tầng, thiếu một dòng comment, một biến tên <code>service</code>, hay một câu báo lỗi chỉ ghi "Invalid!".</p>
<p>Bài này gom trọn chuyện review vào một chỗ, trên MỘT dự án nhỏ bạn sẽ dùng lại cho mọi bài: <strong>khung chung Note Management</strong> (Add · Delete · Display · Exit). Các bài sau áp khung đó vào bài LAB211 thật của kỳ — P0011, P0021, P0056 — bài nào cũng là bản đã sửa sau một lần review thật.</p>`),
    bi(`<h2>📑 Slide by slide — PRO192 · LAB211 (15 slides)</h2>
<p>The deck of this LAB211 lesson, made by CuongThai (it is not a school deck and not the lecturer's). Each slide is followed by its key idea and the explanation; every piece of code and every output on the slides comes from the real project in this lesson — checked by <code>lint.py</code> (the lecturer's rules), compiled with <code>javac --release 8</code> and run on a real JDK 8, like the machines in the lab room.</p>`,
    `<h2>📑 Học theo từng slide — PRO192 · LAB211 (15 slide)</h2>
<p>Bộ slide của bài LAB211 này do CuongThai dựng (không phải slide của trường, cũng không phải của thầy). Dưới mỗi slide là ý chính và lời giảng; mọi đoạn code, mọi output trên slide đều lấy từ đúng dự án trong bài — qua <code>lint.py</code> (luật của thầy), biên dịch bằng <code>javac --release 8</code> và chạy trên JDK 8 thật, giống máy phòng lab.</p>`),
    walk('l211-review', [
      [1, 'LAB211 in practice — how to pass the review',
        `<p class="y-chinh">🎯 One skeleton, five gates, one checklist, one tool: that is the whole review.</p>
<p>The deck walks through what the lecturer checks, in the order he checks it, with real code and real tool output. Everything shown here is in the project you can download at the end of the lesson.</p>`,
        `<p class="y-chinh">🎯 Một khung, năm cửa, một tờ checklist, một công cụ kiểm: đó là toàn bộ chuyện review.</p>
<p>Bộ slide đi qua những gì thầy kiểm, đúng thứ tự thầy kiểm, bằng code thật và output thật của công cụ. Mọi thứ hiện ở đây đều nằm trong dự án tải về ở cuối bài.</p>`],
      [2, 'LAB211 is PRO192 done for real',
        `<p class="y-chinh">🎯 You need 750 LOC of passed labs in 10 weeks; each lab has a fixed LOC value (P0056 = 70, P0011 = 100, P0071 = 150, P0021 = 350 as a Long Assignment graded by percentage).</p>
<p>The lecturer reviews at most 3 labs per student per slot, only before the last 30 minutes. Save a draft on PTS (a zip under 10 MB, without <code>build/</code> and <code>dist/</code>) and press SUBMIT only after he says "đạt" — a submitted lab can no longer be changed. Plan the semester backwards from 750, with spare slots for rejections.</p>`,
        `<p class="y-chinh">🎯 Bạn cần 750 LOC bài đã pass trong 10 tuần; mỗi bài có số LOC cố định (P0056 = 70, P0011 = 100, P0071 = 150, P0021 = 350 — bài dài, chấm theo phần trăm hoàn thành).</p>
<p>Thầy review tối đa 3 bài một sinh viên một slot, và chỉ nhận trước 30 phút cuối. Lưu nháp (save draft) trên PTS — tệp zip dưới 10 MB, đã xoá <code>build/</code> và <code>dist/</code> — và chỉ bấm SUBMIT khi thầy nói "đạt": nộp rồi là không sửa được nữa. Lập kế hoạch cả kỳ ngược từ con số 750, chừa slot dự phòng cho lần bị reject.</p>`],
      [3, 'Five gates, in order',
        `<p class="y-chinh">🎯 Structure → convention → comments → debug → test — fail a gate and the lecturer does not look at the next one.</p>
<p>Gate 1 is the package tree (repository is compulsory). Gate 2 is naming and formatting (Alt+Shift+F). Gate 3 is a comment on every method and every <code>if/else/for/while/switch/case/try/catch</code>. Gate 4: he sets a breakpoint and asks you to step (F7 into, F8 over). Gate 5: he types keys — every happy case and every validation message of the brief. Only then come the oral questions.</p>`,
        `<p class="y-chinh">🎯 Cấu trúc → quy ước → comment → debug → test — trượt cửa nào là thầy dừng ở cửa đó, không xem cửa sau.</p>
<p>Cửa 1 là cây package (bắt buộc có repository). Cửa 2 là cách đặt tên và định dạng (Alt+Shift+F). Cửa 3 là comment cho mọi hàm và mọi <code>if/else/for/while/switch/case/try/catch</code>. Cửa 4: thầy đặt breakpoint và bảo bạn đi từng bước (F7 chui vào hàm, F8 bước qua). Cửa 5: thầy gõ phím — mọi trường hợp đúng và mọi câu báo lỗi của đề. Qua hết mới tới phần vấn đáp.</p>`],
      [4, 'The skeleton: nine packages, one direction',
        `<p class="y-chinh">🎓 <code>main</code> reads and checks, <code>controller</code> directs, <code>repository</code> keeps the data, <code>view</code> prints, <code>model</code> describes, <code>dto</code> carries, <code>utils</code> validates, <code>constants</code> names every word and number — and <code>service</code> appears only when there is a business rule beyond CRUD.</p>
<p>Main sends a request DTO to the controller; the controller holds the repository (and the service, if any) and the view; the result goes back to the view as a response DTO and is printed once. Main never imports model, view, repository or service; the controller never imports model. Note Management has no service because it has no rule beyond add/delete/list.</p>`,
        `<p class="y-chinh">🎓 <code>main</code> đọc và kiểm, <code>controller</code> điều phối, <code>repository</code> giữ dữ liệu, <code>view</code> in, <code>model</code> mô tả, <code>dto</code> chở dữ liệu, <code>utils</code> kiểm chữ gõ vào, <code>constants</code> đặt tên cho mọi chữ và mọi số — còn <code>service</code> chỉ xuất hiện khi có nghiệp vụ ngoài CRUD.</p>
<p>Main gửi một DTO yêu cầu (request) cho controller; controller giữ repository (và service nếu có) cùng view; kết quả quay về view dưới dạng DTO trả lời (response) và được in đúng một lần. Main không bao giờ import model, view, repository hay service; controller không bao giờ import model. Note Management không có service vì nó không có luật nào ngoài thêm/xoá/liệt kê.</p>`],
      [5, 'Who checks what',
        `<p class="y-chinh">🎯 Format is checked in Main through <code>Validation</code>; existence ("does ID 9 exist?") in the repository; business rules (a salary must stay positive, a semester cannot repeat) in the service.</p>
<p>Validation never reads the keyboard and never prints: it takes the line Main read, returns the clean value or throws <code>new Exception(Message.X)</code>. The repository throws when the data says no. Main catches every exception and prints <code>e.getMessage()</code>. One rule per place means one place to change when the lecturer changes a rule in the room.</p>`,
        `<p class="y-chinh">🎯 Kiểm DẠNG (có phải số không, có trống không) ở Main qua <code>Validation</code>; kiểm TỒN TẠI ("có ghi chú mã 9 không?") ở repository; kiểm LUẬT NGHIỆP VỤ (lương phải còn dương, học kỳ không được trùng) ở service.</p>
<p>Validation không bao giờ đọc bàn phím và không bao giờ in: nó nhận dòng chữ Main đã đọc, trả về giá trị sạch hoặc ném <code>new Exception(Message.X)</code>. Repository ném lỗi khi dữ liệu nói "không". Main bắt mọi ngoại lệ và in <code>e.getMessage()</code>. Mỗi luật một chỗ thì khi thầy đổi luật ngay trong phòng, bạn chỉ sửa đúng một chỗ.</p>`],
      [6, 'Main: the keyboard lives here, one call per case',
        `<p class="y-chinh">🎯 <code>Scanner</code> is a local variable of <code>main</code>, passed to static helper methods; each <code>case</code> builds a DTO and calls the controller exactly once.</p>
<p><code>Main</code> is <code>final</code> with a private constructor (checklist 3.4: a class with only static methods). No static field — the lecturer: "static is forbidden for variables, allowed for methods". The loop ends with a <code>boolean running</code> flag, never <code>System.exit</code>. The <code>catch</code> prints the message the lower layers threw.</p>`,
        `<p class="y-chinh">🎯 <code>Scanner</code> là biến cục bộ của <code>main</code>, truyền vào các hàm static phụ; mỗi <code>case</code> dựng một DTO rồi gọi controller đúng một lần.</p>
<p><code>Main</code> là <code>final</code> và có constructor private (checklist 3.4: lớp chỉ có hàm static). Không có trường static — thầy nói: "cấm static với biến, có thể dùng với hàm". Vòng lặp dừng bằng cờ <code>boolean running</code>, không bao giờ <code>System.exit</code>. Khối <code>catch</code> in câu lỗi mà các tầng dưới đã ném lên.</p>`],
      [7, 'Controller and view: render once per flow',
        `<p class="y-chinh">🎯 The view receives its data through an attribute (a ResponseDTO and its setter) and has a <code>display()</code> without parameters; the controller calls it once per menu option.</p>
<p>That is the lecturer's own sample: <code>doctorView.setDoctorMap(result); doctorView.display();</code>. No <code>System.out</code> in the controller, ever — lint.py flags it as PRINT. When a flow can end in a message or in a table, the controller fills one or the other and still calls <code>display()</code> once, after the <code>if</code>.</p>`,
        `<p class="y-chinh">🎯 View nhận dữ liệu qua thuộc tính (một ResponseDTO và setter của nó) và có <code>display()</code> không tham số; controller gọi nó đúng một lần mỗi lựa chọn menu.</p>
<p>Đó chính là mẫu của thầy: <code>doctorView.setDoctorMap(result); doctorView.display();</code>. Không bao giờ có <code>System.out</code> trong controller — lint.py bắt ngay với nhãn PRINT. Khi một luồng có thể kết thúc bằng câu thông báo hoặc bằng cái bảng, controller điền cái này hoặc cái kia rồi vẫn gọi <code>display()</code> một lần, sau khối <code>if</code>.</p>`],
      [8, 'Three real rejections — and the fix',
        `<p class="y-chinh">🎯 Learn from reviews that really happened this semester: CRUD inside the service (P0011), a variable called <code>service</code> (P0056), an error message that did not say what was wrong (P0071).</p>
<p>P0011: "the repository calls inside the service go out" — the controller now holds the repository and hands the data to the service. P0056: the lecturer made the student Refactor → Rename <code>service</code> to <code>workerService</code> and <code>view</code> to <code>workerView</code>. P0071: every error must say what is wrong AND what to type, e.g. "Lua chon nam ngoai khoang. Hay nhap 1 so tu 1 den 4."</p>`,
        `<p class="y-chinh">🎯 Học từ những lần review có thật trong kỳ này: CRUD nằm trong service (P0011), một biến tên <code>service</code> (P0056), một câu báo lỗi không nói sai ở đâu (P0071).</p>
<p>P0011: "mấy cái repo gọi trong service đưa ra hết ngoài" — giờ controller giữ repository và đưa dữ liệu cho service. P0056: thầy bắt Refactor → Rename <code>service</code> thành <code>workerService</code>, <code>view</code> thành <code>workerView</code>. P0071: câu lỗi nào cũng phải nói SAI GÌ và PHẢI NHẬP GÌ, ví dụ "Lua chon nam ngoai khoang. Hay nhap 1 so tu 1 den 4."</p>`],
      [9, 'The paper checklist: the lines people miss',
        `<p class="y-chinh">🎯 The lecturer reviews with a 25-item paper "Coding check sheet"; you fill "O" in every row yourself before raising your hand.</p>
<p>The rows that fail most: 2.6 variables declared at the top of the block and initialised (<code>String line = "";</code>); 2.8 a blank line before every comment and after the declarations — Alt+Shift+F does not add it; 3.3 parentheses around each comparison; 3.4 final + private constructor for static-only classes; 3.8 <code>StringBuilder</code>, never <code>String +=</code> in a loop; 1.5 names ending in List/Set/Map/Array and <code>Id</code> not <code>ID</code>; 1.3 interfaces start with <code>I</code>, exceptions end with <code>Exception</code>.</p>`,
        `<p class="y-chinh">🎯 Thầy review bằng tờ giấy "Coding check sheet" 25 mục; bạn tự điền "O" vào từng dòng trước khi giơ tay.</p>
<p>Những dòng hay trượt nhất: 2.6 khai báo biến ở đầu khối và khởi tạo luôn (<code>String line = "";</code>); 2.8 một dòng trống trước mọi comment và sau vùng khai báo — Alt+Shift+F không thêm hộ; 3.3 ngoặc quanh từng phép so sánh; 3.4 lớp chỉ có hàm static thì final + constructor private; 3.8 dùng <code>StringBuilder</code>, không <code>String +=</code> trong vòng lặp; 1.5 tên kết thúc bằng List/Set/Map/Array và viết <code>Id</code> chứ không <code>ID</code>; 1.3 interface bắt đầu bằng <code>I</code>, ngoại lệ kết thúc bằng <code>Exception</code>.</p>`],
      [10, 'The rules said in class',
        `<p class="y-chinh">🎯 Declare <code>ArrayList</code>/<code>HashMap</code>, not <code>List</code>/<code>Map</code>; at most 2 parameters per method (utils 3); every model and DTO is a JavaBean; no static variables; no <code>System.exit</code>; every word in Message, every number in Constants.</p>
<p>The lecturer said <code>List</code>/<code>Map</code> in a student's declarations is a sign that an AI wrote it — keep the interface only where the brief dictates the signature, with a <code>// brief:</code> comment. More than two values to pass? Pack them in a DTO: adding a field then changes the DTO, not every signature. JavaBean = private fields, a public no-argument constructor, getters and setters.</p>`,
        `<p class="y-chinh">🎯 Khai báo <code>ArrayList</code>/<code>HashMap</code> chứ không <code>List</code>/<code>Map</code>; mỗi hàm tối đa 2 tham số (utils được 3); mọi model và DTO là JavaBean; không biến static; không <code>System.exit</code>; mọi câu chữ ở Message, mọi con số ở Constants.</p>
<p>Thầy nói <code>List</code>/<code>Map</code> trong khai báo của sinh viên là dấu hiệu AI viết — chỉ giữ interface khi đề bắt đúng chữ ký đó, kèm comment <code>// brief:</code>. Cần truyền hơn hai giá trị? Gói vào DTO: thêm một trường thì chỉ sửa DTO, không phải sửa mọi chữ ký hàm. JavaBean = trường private, constructor rỗng public, getter và setter.</p>`],
      [11, 'lint.py red: eight real violations',
        `<p class="y-chinh">🎯 <code>lint.py</code> applies the lecturer's rules mechanically: seven one-line mistakes give eight violations, each with file and line.</p>
<p>The trap project <code>bay/loi-thuong-gap</code> is the clean skeleton plus a controller that prints, a <code>List</code>, a static <code>Scanner</code> field without a comment, a <code>System.exit</code>, a bare number 4 and an <code>if</code> without its comment. Read the real output below: PRINT, HARDCODE, EXIT, MAGIC, STATIC, COMMENT, COMMENT, COLLECTION. Fix each line, run again, until it prints "✓ … — sạch".</p>`,
        `<p class="y-chinh">🎯 <code>lint.py</code> áp luật của thầy một cách máy móc: bảy lỗi một dòng cho ra tám vi phạm, mỗi cái kèm tệp và số dòng.</p>
<p>Dự án bẫy <code>bay/loi-thuong-gap</code> là khung sạch cộng thêm một controller tự in, một <code>List</code>, một trường <code>Scanner</code> static không comment, một <code>System.exit</code>, một con số 4 viết thẳng và một <code>if</code> mất comment. Đọc output thật bên dưới: PRINT, HARDCODE, EXIT, MAGIC, STATIC, COMMENT, COMMENT, COLLECTION. Sửa từng dòng, chạy lại, cho tới khi nó in "✓ … — sạch".</p>`],
      [12, 'Green lint is not a pass',
        `<p class="y-chinh">🎯 A <code>NoteService</code> that holds the repository compiles, runs, and passes lint.py — and is exactly what the lecturer rejected in P0011.</p>
<p>The tool does not forbid <code>service → repository</code>; the lecturer does. He reads a project by its imports: open each class and look at the first lines. A service must not <code>import repository.*</code>; a controller must not <code>import model.*</code>. One command checks it: <code>grep -n "^import repository" src/service/*.java</code> must print nothing.</p>`,
        `<p class="y-chinh">🎯 Một <code>NoteService</code> giữ repository vẫn biên dịch được, chạy được, qua lint.py — và đúng là thứ thầy đã bắt ở P0011.</p>
<p>Công cụ không cấm <code>service → repository</code>; thầy cấm. Thầy đọc bài bằng cách NHÌN IMPORT: mở từng lớp và xem mấy dòng đầu. Service không được <code>import repository.*</code>; controller không được <code>import model.*</code>. Một lệnh là kiểm xong: <code>grep -n "^import repository" src/service/*.java</code> phải không in ra gì.</p>`],
      [13, 'The lab room runs JDK 8',
        `<p class="y-chinh">🎯 Code that runs on your JDK 21 at home can fail to compile in the lab: <code>var</code>, <code>List.of</code>, text blocks, <code>String.repeat</code>, switch arrows are all newer than Java 8.</p>
<p>Compile with <code>javac --release 8</code> before you go: it checks the language AND the API of Java 8. The real output below refuses <code>var</code> ("cannot find symbol: class var") and <code>List.of</code> ("cannot find symbol: method of()"). In NetBeans: Project Properties → Sources → Source/Binary Format: JDK 8.</p>`,
        `<p class="y-chinh">🎯 Code chạy ngon trên JDK 21 ở nhà có thể không biên dịch nổi trong phòng lab: <code>var</code>, <code>List.of</code>, text block, <code>String.repeat</code>, switch mũi tên đều mới hơn Java 8.</p>
<p>Biên dịch bằng <code>javac --release 8</code> trước khi lên lớp: nó kiểm cả ngôn ngữ LẪN thư viện của Java 8. Output thật bên dưới từ chối <code>var</code> ("cannot find symbol: class var") và <code>List.of</code> ("cannot find symbol: method of()"). Trong NetBeans: Project Properties → Sources → Source/Binary Format: JDK 8.</p>`],
      [14, 'The oral questions',
        `<p class="y-chinh">🎯 Every answer points at a line of YOUR code: encapsulation = the private fields of the model, polymorphism = <code>@Override toString()</code>, abstraction = Main calls <code>noteController.addNote(dto)</code> without knowing where notes live.</p>
<p>Static: "belongs to the class; Validation is static because its result depends only on its input". Remove <code>static</code>? "non-static method cannot be referenced from a static context" — then create <code>new Validation()</code>. Why <code>ArrayList</code> and not <code>List</code>? "List is the contract, ArrayList the class that implements it". Why <code>void</code>? "the result is printed by the view, errors travel by throw".</p>`,
        `<p class="y-chinh">🎯 Câu trả lời nào cũng chỉ vào một dòng trong code CỦA BẠN: đóng gói = các trường private của model, đa hình = <code>@Override toString()</code>, trừu tượng = Main gọi <code>noteController.addNote(dto)</code> mà không biết ghi chú nằm ở đâu.</p>
<p>Static: "thuộc về lớp; Validation là static vì kết quả chỉ phụ thuộc đầu vào". Bỏ <code>static</code> đi thì sao? "non-static method cannot be referenced from a static context" — muốn chạy thì tạo <code>new Validation()</code>. Vì sao <code>ArrayList</code> mà không <code>List</code>? "List là bản hợp đồng, ArrayList là lớp cài đặt hợp đồng đó". Vì sao <code>void</code>? "kết quả do view in, lỗi đi bằng throw".</p>`],
      [15, 'Before you raise your hand',
        `<p class="y-chinh">🎯 Run the four checks — <code>javac --release 8</code>, run the test keys, <code>lint.py</code>, read your imports — then fill the paper checklist and practise one debug and five answers out loud.</p>
<p>A 90-minute slot: 5 minutes to reread the brief, 10 to create the project and the 9 packages (model first), 35 to type and run after every 2–3 files, 15 to format and finish comments and test, 10 to save the draft, and raise your hand before the last 30 minutes. The skeleton of this lesson is what you type from memory in those first minutes.</p>`,
        `<p class="y-chinh">🎯 Chạy đủ bốn phép kiểm — <code>javac --release 8</code>, chạy các phím test, <code>lint.py</code>, đọc lại import — rồi điền tờ checklist giấy và tập thành tiếng một lần debug với năm câu trả lời.</p>
<p>Một slot 90 phút: 5 phút đọc lại đề, 10 phút tạo project và 9 package (gõ model trước), 35 phút gõ và chạy sau mỗi 2–3 tệp, 15 phút format, bổ sung comment và test, 10 phút lưu nháp, và giơ tay trước 30 phút cuối. Khung chung của bài này là thứ bạn gõ thuộc lòng trong mấy phút đầu đó.</p>`],
    ]),
    bi(`<h2>1. How LAB211 is graded — and why PRO192 already taught you everything</h2>
<table>
<thead><tr><th>What</th><th>Rule</th></tr></thead>
<tbody>
<tr><td>Total to pass</td><td>750 LOC of labs the lecturer accepted, in 10 weeks (2 slots a week)</td></tr>
<tr><td>One lab</td><td>a fixed LOC value: P0056 70 · P0011 100 · P0071 150 · P0070 150 · P0021 350 (Long Assignment, graded by % completed)</td></tr>
<tr><td>One slot</td><td>at most 3 reviews per student; the lecturer takes requests only before the last 30 minutes</td></tr>
<tr><td>PTS</td><td>choose at most 5 labs at a time · Save draft (zip under 10 MB, without build/ and dist/) · SUBMIT only after "đạt"</td></tr>
<tr><td>Copying</td><td>allowed by this lecturer IF you understand every line and the structure is his — "chép bài được, miễn hiểu + chạy đúng format"</td></tr>
</tbody>
</table>
<p>Every skill of LAB211 is a chapter of PRO192: classes and JavaBeans (Ch2–3), interfaces with the prefix <code>I</code> (Ch5), exceptions thrown by Validation and caught in Main (Ch6), <code>ArrayList</code> of objects (Ch7), <code>HashMap</code> and <code>Comparator</code> (Ch8), files (Ch9). The 9 labs of CT Library were written to the same rules, so you have already met every one of them.</p>
<h2>2. The five gates</h2>
<table>
<thead><tr><th>Gate</th><th>The lecturer checks</th><th>Check it yourself before</th></tr></thead>
<tbody>
<tr><td>1. Structure</td><td>packages of the Guide: constants · controller · dto · main · model · repository · (service) · utils · view — repository is compulsory</td><td>open the project tree</td></tr>
<tr><td>2. Convention</td><td>class names = nouns in PascalCase, methods = verbs in camelCase, formatting</td><td>Alt+Shift+F on every file</td></tr>
<tr><td>3. Comments</td><td>every method and every if/else/for/while/switch/case/try/catch</td><td>a block without a comment above it is a missing comment</td></tr>
<tr><td>4. Debug</td><td>a breakpoint, then F7/F8, read the Variables tab</td><td>practise once (section 6)</td></tr>
<tr><td>5. Test</td><td>every happy case + every validation message of the brief</td><td>type the test keys of the lab</td></tr>
</tbody>
</table>`,
    `<h2>1. LAB211 chấm thế nào — và vì sao PRO192 đã dạy bạn đủ cả</h2>
<table>
<thead><tr><th>Chuyện gì</th><th>Luật</th></tr></thead>
<tbody>
<tr><td>Tổng để qua môn</td><td>750 LOC bài được thầy chấp nhận, trong 10 tuần (2 slot mỗi tuần)</td></tr>
<tr><td>Một bài</td><td>số LOC cố định: P0056 70 · P0011 100 · P0071 150 · P0070 150 · P0021 350 (bài dài, chấm theo % hoàn thành)</td></tr>
<tr><td>Một slot</td><td>tối đa 3 lần review mỗi sinh viên; thầy chỉ nhận trước 30 phút cuối</td></tr>
<tr><td>PTS</td><td>chọn tối đa 5 bài một lúc · Save draft (zip dưới 10 MB, đã xoá build/ và dist/) · chỉ SUBMIT khi thầy nói "đạt"</td></tr>
<tr><td>Chép bài</td><td>thầy này cho phép NẾU hiểu từng dòng và đúng cấu trúc của thầy — "chép bài được, miễn hiểu + chạy đúng format"</td></tr>
</tbody>
</table>
<p>Mọi kỹ năng của LAB211 là một chương PRO192: lớp và JavaBean (Ch2–3), interface có tiền tố <code>I</code> (Ch5), ngoại lệ do Validation ném và Main bắt (Ch6), <code>ArrayList</code> chứa đối tượng (Ch7), <code>HashMap</code> và <code>Comparator</code> (Ch8), tệp (Ch9). Chín lab CT Library viết đúng theo các luật này, nên bạn đã gặp từng luật một rồi.</p>
<h2>2. Năm cửa</h2>
<table>
<thead><tr><th>Cửa</th><th>Thầy kiểm</th><th>Tự kiểm trước thế nào</th></tr></thead>
<tbody>
<tr><td>1. Cấu trúc</td><td>các package theo Guide: constants · controller · dto · main · model · repository · (service) · utils · view — repository bắt buộc</td><td>mở cây project</td></tr>
<tr><td>2. Quy ước</td><td>tên lớp là danh từ PascalCase, tên hàm là động từ camelCase, định dạng</td><td>Alt+Shift+F từng tệp</td></tr>
<tr><td>3. Comment</td><td>mọi hàm và mọi if/else/for/while/switch/case/try/catch</td><td>khối nào không có dòng comment phía trên là thiếu</td></tr>
<tr><td>4. Debug</td><td>đặt breakpoint, rồi F7/F8, đọc tab Variables</td><td>tập trước một lần (mục 6)</td></tr>
<tr><td>5. Test</td><td>mọi trường hợp đúng + mọi câu báo lỗi của đề</td><td>gõ đủ bộ phím test của bài</td></tr>
</tbody>
</table>`),
    bi(`<h2>3. The shared skeleton — who holds whom, who may import whom</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/f4283ff1e777ea91cc30739757405cd31c4b581f.svg" alt="The shared skeleton: Main fills a DTO and calls the controller once; the controller holds the repository and the view" loading="lazy" /><p class="chu-thich">🧩 The shared skeleton: Main fills a DTO and calls the controller once; the controller holds the repository and the view</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title The shared LAB211 skeleton (Note Management) — who holds whom, who may import whom
package main {
  class Main &lt;&lt;final&gt;&gt; {
    - Main()
    + {static} main(args : String[]) : void
    - {static} inputChoice(sc : Scanner) : int
    - {static} inputNote(sc : Scanner) : NoteRequestDTO
    - {static} inputDelete(sc : Scanner) : NoteRequestDTO
  }
}
package utils {
  class Validation &lt;&lt;final&gt;&gt; {
    - Validation()
    + {static} getChoice(input : String, min : int, max : int) : int
    + {static} getRequired(input : String, error : String) : String
    + {static} getId(input : String) : int
  }
}
package controller {
  class NoteController {
    - noteRepository : NoteRepository
    - noteView : NoteView
    + addNote(requestDTO : NoteRequestDTO) : void
    + deleteNote(requestDTO : NoteRequestDTO) : void
    + displayNotes() : void
  }
}
package repository {
  class NoteRepository {
    - noteList : ArrayList&lt;Note&gt;
    + addNote(requestDTO : NoteRequestDTO) : int
    + deleteNote(requestDTO : NoteRequestDTO) : void
    + getDataNotes() : ArrayList&lt;String&gt;
    - generateNextId() : int
  }
}
package model {
  class Note {
    - id : int
    - content : String
    + Note()
    + toString() : String
  }
}
package view {
  class NoteView {
    - responseDTO : NoteResponseDTO
    + setResponseDTO(responseDTO : NoteResponseDTO) : void
    + display() : void
  }
}
package dto {
  class NoteRequestDTO {
    - id : int
    - content : String
  }
  class NoteResponseDTO {
    - message : String
    - rowList : ArrayList&lt;String&gt;
  }
}
Main ..&gt; NoteController : one call per case
Main ..&gt; Validation : checks every line typed
Main ..&gt; NoteRequestDTO : fills
NoteController *-- NoteRepository : holds (CRUD)
NoteController *-- NoteView : display() once per flow
NoteController ..&gt; NoteResponseDTO : fills
NoteRepository o-- "0..*" Note
NoteView ..&gt; NoteResponseDTO : reads
note "no service: this program has no business rule beyond CRUD.\\nWhen it has one, the service gets the data FROM the controller —\\nit never holds or calls the repository." as N1
@enduml</code></pre></details>
<table>
<thead><tr><th>Package</th><th>Class</th><th>Its only job</th><th>Must NOT</th></tr></thead>
<tbody>
<tr><td>constants</td><td>Message, Constants</td><td>every word on screen / every number, format, regex</td><td>be instantiated (final + private constructor)</td></tr>
<tr><td>utils</td><td>Validation</td><td>turn the line Main read into a clean value, or throw the message of the broken rule</td><td>read the keyboard, print</td></tr>
<tr><td>model</td><td>Note</td><td>describe one note (private fields, empty constructor, get/set, toString)</td><td>print, read, be static</td></tr>
<tr><td>dto</td><td>NoteRequestDTO, NoteResponseDTO</td><td>carry data Main → controller, controller → view</td><td>hold logic</td></tr>
<tr><td>repository</td><td>NoteRepository</td><td>keep the ArrayList and do CRUD; refuse an unknown ID</td><td>print, check what was typed</td></tr>
<tr><td>controller</td><td>NoteController</td><td>call the repository (and the service), fill the response, display() once</td><td>import model, print, read</td></tr>
<tr><td>view</td><td>NoteView</td><td>print what the controller set</td><td>take data through parameters</td></tr>
<tr><td>main</td><td>Main</td><td>menu, Scanner, Validation, one controller call per case, catch and print</td><td>import model/view/repository/service</td></tr>
</tbody>
</table>
<p>Import rules, as lint.py enforces them: <code>main</code> ✗ model/view/repository/service · <code>controller</code> ✗ model · <code>view</code> ✗ model/repository/service · <code>dto</code> ✗ view/controller/service/repository · <code>model</code> ✗ everything above it. Plus the rule lint.py does NOT check and the lecturer does: <code>service</code> ✗ repository.</p>
<h3>Main — one call per case</h3>
<pre class="trich"><code class="language-java">// Starts the program: shows the menu until the user chooses exit.
public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    NoteController noteController = new NoteController();
    NoteRequestDTO requestDTO = null;
    boolean running = true;
    int choice = 0;

    // show the menu again after every function, until exit is chosen
    while (running) {
        System.out.println(Message.MENU);
        choice = inputChoice(sc);

        // a wrong value or an unknown ID stops the function; its message is shown here
        try {
            // run the function the user picked: one call to the controller per option
            switch (choice) {
                // option 1: read and check a new note, then add it
                case Constants.MENU_ADD:
                    requestDTO = inputNote(sc);
                    noteController.addNote(requestDTO);
                    break;

                // option 2: read and check an ID, then delete that note
                case Constants.MENU_DELETE:
                    requestDTO = inputDelete(sc);
                    noteController.deleteNote(requestDTO);
                    break;

                // option 3: show the notes
                case Constants.MENU_DISPLAY:
                    noteController.displayNotes();
                    break;

                // option 4: stop the loop
                case Constants.MENU_EXIT:
                    running = false;
                    System.out.println(Message.GOODBYE);
                    break;

                // unreachable: inputChoice only returns 1..4
                default:
                    break;
            }
        } catch (Exception e) {
            // the message was written in Message and thrown by Validation or the repository
            System.out.println(e.getMessage());
        }
    }
}</code></pre>
<h3>Controller — render once per flow</h3>
<pre class="trich"><code class="language-java">// Option 1: stores the note Main has checked; the view shows its new ID.
public void addNote(NoteRequestDTO requestDTO) {
    NoteResponseDTO responseDTO = new NoteResponseDTO();
    int noteId = noteRepository.addNote(requestDTO);

    // hand the answer to the view, then render it - once for the whole flow
    responseDTO.setMessage(String.format(Message.ADD_SUCCESS, noteId));
    noteView.setResponseDTO(responseDTO);
    noteView.display();
}</code></pre>
<pre class="trich"><code class="language-java">// Prints what the controller set: the line of an add or a delete, or the note table.
public void display() {
    // options 1 and 2: only the line of the result was set
    if (responseDTO.getRowList() == null) {
        System.out.println(responseDTO.getMessage());
        return;
    }

    // option 3: the title of the table comes first, even when there is no note
    System.out.println(Message.TITLE_NOTE);

    // nothing added yet (or everything deleted)
    if (responseDTO.getRowList().isEmpty()) {
        System.out.println(Message.NO_NOTE);
        return;
    }

    // the header, with the same column widths as the rows
    System.out.println(String.format(Constants.HEADER_FORMAT, Message.LABEL_ID,
            Message.LABEL_CONTENT));

    // one line per note
    for (String row : responseDTO.getRowList()) {
        System.out.println(row);
    }
}</code></pre>
<h3>Repository — the data, CRUD, and "does it exist?"</h3>
<pre class="trich"><code class="language-java">// Removes the note with the request's ID; an unknown ID is refused.
public void deleteNote(NoteRequestDTO requestDTO) throws Exception {
    // look at every note until the ID matches
    for (int i = 0; i &lt; noteList.size(); i++) {
        // found it: remove by position and stop
        if (noteList.get(i).getId() == requestDTO.getId()) {
            noteList.remove(i);
            return;
        }
    }

    // no note has this ID
    throw new Exception(String.format(Message.NOTE_NOT_EXIST, requestDTO.getId()));
}</code></pre>
<h3>Validation — check, never read, never print</h3>
<pre class="trich"><code class="language-java">// Converts a menu choice and checks it lies in [min, max].
public static int getChoice(String input, int min, int max) throws Exception {
    int choice = 0;

    // parse first, so a letter gives the "number" message
    try {
        choice = Integer.parseInt(getText(input));
    } catch (NumberFormatException e) {
        // letters or an empty line: not a number at all
        throw new Exception(Message.INVALID_NUMBER);
    }

    // then check the range, so 9 gives the "range" message
    if ((choice &lt; min) || (choice &gt; max)) {
        throw new Exception(String.format(Message.INVALID_RANGE, min, max));
    }

    return choice;
}</code></pre>`,
    `<h2>3. Khung chung — ai giữ ai, ai được import ai</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/f4283ff1e777ea91cc30739757405cd31c4b581f.svg" alt="Khung chung: Main điền DTO rồi gọi controller một lần; controller giữ repository và view" loading="lazy" /><p class="chu-thich">🧩 Khung chung: Main điền DTO rồi gọi controller một lần; controller giữ repository và view</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title The shared LAB211 skeleton (Note Management) — who holds whom, who may import whom
package main {
  class Main &lt;&lt;final&gt;&gt; {
    - Main()
    + {static} main(args : String[]) : void
    - {static} inputChoice(sc : Scanner) : int
    - {static} inputNote(sc : Scanner) : NoteRequestDTO
    - {static} inputDelete(sc : Scanner) : NoteRequestDTO
  }
}
package utils {
  class Validation &lt;&lt;final&gt;&gt; {
    - Validation()
    + {static} getChoice(input : String, min : int, max : int) : int
    + {static} getRequired(input : String, error : String) : String
    + {static} getId(input : String) : int
  }
}
package controller {
  class NoteController {
    - noteRepository : NoteRepository
    - noteView : NoteView
    + addNote(requestDTO : NoteRequestDTO) : void
    + deleteNote(requestDTO : NoteRequestDTO) : void
    + displayNotes() : void
  }
}
package repository {
  class NoteRepository {
    - noteList : ArrayList&lt;Note&gt;
    + addNote(requestDTO : NoteRequestDTO) : int
    + deleteNote(requestDTO : NoteRequestDTO) : void
    + getDataNotes() : ArrayList&lt;String&gt;
    - generateNextId() : int
  }
}
package model {
  class Note {
    - id : int
    - content : String
    + Note()
    + toString() : String
  }
}
package view {
  class NoteView {
    - responseDTO : NoteResponseDTO
    + setResponseDTO(responseDTO : NoteResponseDTO) : void
    + display() : void
  }
}
package dto {
  class NoteRequestDTO {
    - id : int
    - content : String
  }
  class NoteResponseDTO {
    - message : String
    - rowList : ArrayList&lt;String&gt;
  }
}
Main ..&gt; NoteController : one call per case
Main ..&gt; Validation : checks every line typed
Main ..&gt; NoteRequestDTO : fills
NoteController *-- NoteRepository : holds (CRUD)
NoteController *-- NoteView : display() once per flow
NoteController ..&gt; NoteResponseDTO : fills
NoteRepository o-- "0..*" Note
NoteView ..&gt; NoteResponseDTO : reads
note "no service: this program has no business rule beyond CRUD.\\nWhen it has one, the service gets the data FROM the controller —\\nit never holds or calls the repository." as N1
@enduml</code></pre></details>
<table>
<thead><tr><th>Package</th><th>Lớp</th><th>Việc duy nhất</th><th>KHÔNG được</th></tr></thead>
<tbody>
<tr><td>constants</td><td>Message, Constants</td><td>mọi câu chữ trên màn hình / mọi con số, định dạng, regex</td><td>bị tạo đối tượng (final + constructor private)</td></tr>
<tr><td>utils</td><td>Validation</td><td>đổi dòng chữ Main đã đọc thành giá trị sạch, hoặc ném câu lỗi của luật bị vi phạm</td><td>đọc bàn phím, in</td></tr>
<tr><td>model</td><td>Note</td><td>mô tả một ghi chú (trường private, constructor rỗng, get/set, toString)</td><td>in, đọc, dùng static</td></tr>
<tr><td>dto</td><td>NoteRequestDTO, NoteResponseDTO</td><td>chở dữ liệu Main → controller, controller → view</td><td>chứa xử lý</td></tr>
<tr><td>repository</td><td>NoteRepository</td><td>giữ ArrayList và làm CRUD; từ chối mã không tồn tại</td><td>in, kiểm chữ gõ vào</td></tr>
<tr><td>controller</td><td>NoteController</td><td>gọi repository (và service), điền response, display() một lần</td><td>import model, in, đọc</td></tr>
<tr><td>view</td><td>NoteView</td><td>in những gì controller đã đặt vào</td><td>nhận dữ liệu qua tham số</td></tr>
<tr><td>main</td><td>Main</td><td>menu, Scanner, Validation, mỗi case gọi controller một lần, bắt lỗi và in</td><td>import model/view/repository/service</td></tr>
</tbody>
</table>
<p>Luật import, đúng như lint.py bắt: <code>main</code> ✗ model/view/repository/service · <code>controller</code> ✗ model · <code>view</code> ✗ model/repository/service · <code>dto</code> ✗ view/controller/service/repository · <code>model</code> ✗ mọi tầng trên nó. Cộng thêm luật lint.py KHÔNG kiểm mà thầy kiểm: <code>service</code> ✗ repository.</p>
<h3>Main — mỗi case một lần gọi</h3>
<pre class="trich"><code class="language-java">// Starts the program: shows the menu until the user chooses exit.
public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    NoteController noteController = new NoteController();
    NoteRequestDTO requestDTO = null;
    boolean running = true;
    int choice = 0;

    // show the menu again after every function, until exit is chosen
    while (running) {
        System.out.println(Message.MENU);
        choice = inputChoice(sc);

        // a wrong value or an unknown ID stops the function; its message is shown here
        try {
            // run the function the user picked: one call to the controller per option
            switch (choice) {
                // option 1: read and check a new note, then add it
                case Constants.MENU_ADD:
                    requestDTO = inputNote(sc);
                    noteController.addNote(requestDTO);
                    break;

                // option 2: read and check an ID, then delete that note
                case Constants.MENU_DELETE:
                    requestDTO = inputDelete(sc);
                    noteController.deleteNote(requestDTO);
                    break;

                // option 3: show the notes
                case Constants.MENU_DISPLAY:
                    noteController.displayNotes();
                    break;

                // option 4: stop the loop
                case Constants.MENU_EXIT:
                    running = false;
                    System.out.println(Message.GOODBYE);
                    break;

                // unreachable: inputChoice only returns 1..4
                default:
                    break;
            }
        } catch (Exception e) {
            // the message was written in Message and thrown by Validation or the repository
            System.out.println(e.getMessage());
        }
    }
}</code></pre>
<h3>Controller — in đúng một lần mỗi luồng</h3>
<pre class="trich"><code class="language-java">// Option 1: stores the note Main has checked; the view shows its new ID.
public void addNote(NoteRequestDTO requestDTO) {
    NoteResponseDTO responseDTO = new NoteResponseDTO();
    int noteId = noteRepository.addNote(requestDTO);

    // hand the answer to the view, then render it - once for the whole flow
    responseDTO.setMessage(String.format(Message.ADD_SUCCESS, noteId));
    noteView.setResponseDTO(responseDTO);
    noteView.display();
}</code></pre>
<pre class="trich"><code class="language-java">// Prints what the controller set: the line of an add or a delete, or the note table.
public void display() {
    // options 1 and 2: only the line of the result was set
    if (responseDTO.getRowList() == null) {
        System.out.println(responseDTO.getMessage());
        return;
    }

    // option 3: the title of the table comes first, even when there is no note
    System.out.println(Message.TITLE_NOTE);

    // nothing added yet (or everything deleted)
    if (responseDTO.getRowList().isEmpty()) {
        System.out.println(Message.NO_NOTE);
        return;
    }

    // the header, with the same column widths as the rows
    System.out.println(String.format(Constants.HEADER_FORMAT, Message.LABEL_ID,
            Message.LABEL_CONTENT));

    // one line per note
    for (String row : responseDTO.getRowList()) {
        System.out.println(row);
    }
}</code></pre>
<h3>Repository — dữ liệu, CRUD, và "có tồn tại không?"</h3>
<pre class="trich"><code class="language-java">// Removes the note with the request's ID; an unknown ID is refused.
public void deleteNote(NoteRequestDTO requestDTO) throws Exception {
    // look at every note until the ID matches
    for (int i = 0; i &lt; noteList.size(); i++) {
        // found it: remove by position and stop
        if (noteList.get(i).getId() == requestDTO.getId()) {
            noteList.remove(i);
            return;
        }
    }

    // no note has this ID
    throw new Exception(String.format(Message.NOTE_NOT_EXIST, requestDTO.getId()));
}</code></pre>
<h3>Validation — kiểm, không đọc, không in</h3>
<pre class="trich"><code class="language-java">// Converts a menu choice and checks it lies in [min, max].
public static int getChoice(String input, int min, int max) throws Exception {
    int choice = 0;

    // parse first, so a letter gives the "number" message
    try {
        choice = Integer.parseInt(getText(input));
    } catch (NumberFormatException e) {
        // letters or an empty line: not a number at all
        throw new Exception(Message.INVALID_NUMBER);
    }

    // then check the range, so 9 gives the "range" message
    if ((choice &lt; min) || (choice &gt; max)) {
        throw new Exception(String.format(Message.INVALID_RANGE, min, max));
    }

    return choice;
}</code></pre>`),
    bi(`<h2>4. Run it for real — and the three checks before every review</h2>
<p>The test keys are in <code>harness/input.txt</code>: an empty table, a letter and a 7 at the menu, an empty note, two notes, the table, an empty ID, a letter as ID, an ID that does not exist, a real delete, the table again, exit. Every message says what is wrong and what to type:</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Please choose one option: ------------- Note -------------<br>
Chua co ghi chu nao. Hay chon 1 de them.<br>
========= Note program =========<br>
1. Add Note<br>
2. Delete Note<br>
3. Display Note<br>
4. Exit<br>
Please choose one option: Ban phai nhap 1 so (vi du: 1, 2, 3), khong nhap chu hay de trong. Moi nhap lai.<br>
Please choose one option: Lua chon nam ngoai khoang. Hay nhap 1 so tu 1 den 4. Moi nhap lai.<br>
Please choose one option: ------------Add Note------------<br>
Content: Noi dung ghi chu khong duoc de trong. Hay chon lai 1 va nhap noi dung.<br>
========= Note program =========<br>
1. Add Note<br>
2. Delete Note<br>
3. Display Note<br>
4. Exit<br>
Please choose one option: ------------Add Note------------<br>
Content: Da them ghi chu ma [1].<br>
========= Note program =========<br>
1. Add Note<br>
2. Delete Note<br>
3. Display Note<br>
4. Exit<br>
Please choose one option: ------------Add Note------------<br>
Content: Da them ghi chu ma [2].<br>
========= Note program =========<br>
1. Add Note<br>
2. Delete Note<br>
3. Display Note<br>
4. Exit<br>
Please choose one option: ------------- Note -------------<br>
ID &nbsp;Content<br>
1 &nbsp;&nbsp;Mua sach PRO192<br>
2 &nbsp;&nbsp;Hoc LAB211 moi toi<br>
========= Note program =========<br>
1. Add Note<br>
2. Delete Note<br>
3. Display Note<br>
4. Exit<br>
Please choose one option: ------------Del Note------------<br>
ID: Ma ghi chu khong duoc de trong. Hay chon 3 xem ma roi chon lai 2.<br>
========= Note program =========<br>
1. Add Note<br>
2. Delete Note<br>
3. Display Note<br>
4. Exit<br>
Please choose one option: ------------Del Note------------<br>
ID: Ma ghi chu phai la so nguyen (vi du: 1, 2). Hay chon lai 2.<br>
========= Note program =========<br>
1. Add Note<br>
2. Delete Note<br>
3. Display Note<br>
4. Exit<br>
Please choose one option: ------------Del Note------------<br>
ID: Khong co ghi chu ma [9]. Hay chon 3 xem cac ma dang co.<br>
…</div>
<pre><code class="language-bash">$ python3 lint.py MSSV_KHUNG_NoteManagement</code></pre>
<div class="out">✓ MSSV_KHUNG_NoteManagement — sạch</div>
<pre><code class="language-bash">$ ./check.sh        # Windows: check.bat · NetBeans: Run File on test/harness/CheckHarness.java</code></pre>
<div class="out">PASS: 81/81 dong khop expected.txt</div>
<p>The same program compiled and run on a real JDK 8 (Docker <code>eclipse-temurin:8-jdk</code>, the version of the lab machines) prints exactly the same 81 lines. The audit of the 25 paper items (<code>soat_checklist.py</code>) gives 0 violations.</p>
<h2>5. Three traps, run for real</h2>
<h3>Trap 1 — seven one-line mistakes, eight violations</h3>
<pre><code class="language-bash">$ python3 lint.py MSSV_KHUNG_NoteManagement</code></pre>
<div class="out">✗ MSSV_KHUNG_NoteManagement — 8 vi phạm<br>
&nbsp;&nbsp;[PRINT] src/controller/NoteController.java:34 — không được print ngoài view và main (Guide.xlsx)<br>
&nbsp;&nbsp;[HARDCODE] src/controller/NoteController.java:34 — chuỗi "Them xong" phải khai báo ở constants (Message/Constants)<br>
&nbsp;&nbsp;[EXIT] src/main/Main.java:59 — không dùng System.exit — thoát bằng cờ/return<br>
&nbsp;&nbsp;[MAGIC] src/main/Main.java:85 — số 4 viết thẳng — đặt tên hằng trong Constants (CC §10.3)<br>
&nbsp;&nbsp;[STATIC] src/main/Main.java:18 — main: cấm static với biến, chỉ được static với hàm (Guide.xlsx)<br>
&nbsp;&nbsp;[COMMENT] src/main/Main.java:18 — trường 'sc' thiếu comment<br>
&nbsp;&nbsp;[COMMENT] src/repository/NoteRepository.java:64 — 'if' thiếu comment (thầy: comment cho mọi block/rẽ nhánh)<br>
&nbsp;&nbsp;[COLLECTION] src/repository/NoteRepository.java:19 — dùng kiểu cụ thể ArrayList/HashMap/LinkedHashMap (thầy: List/Map là dấu hiệu AI) — chỉ giữ List/Map khi đề bắt, kèm comment '// brief: ...'</div>
<p>Each line names the rule and the place: a controller that prints (PRINT) a hard-coded string (HARDCODE), <code>System.exit</code> (EXIT), the menu bound written as <code>4</code> (MAGIC), a static <code>Scanner</code> field in Main (STATIC) with no comment (COMMENT), an <code>if</code> that lost its comment (COMMENT), a <code>List</code> (COLLECTION).</p>
<h3>Trap 2 — lint is green, the lecturer still says no</h3>
<pre><code class="language-bash">$ python3 lint.py MSSV_KHUNG_NoteManagement</code></pre>
<div class="out">✓ MSSV_KHUNG_NoteManagement — sạch</div>
<p>This project adds a <code>NoteService</code> that creates and holds the <code>NoteRepository</code>; the controller only talks to the service. It compiles, it prints the same 81 lines as the solution, lint.py is silent — and it is the exact mistake the lecturer rejected in P0011 on 26/10: "CRUD không được nằm trong service". Check it the way he does — by the imports:</p>
<pre><code class="language-bash">$ grep -n "^import" src/service/*.java
src/service/NoteService.java:3:import dto.NoteRequestDTO;
src/service/NoteService.java:4:import java.util.ArrayList;
src/service/NoteService.java:5:import repository.NoteRepository;     &lt;- a service must not import repository</code></pre>
<h3>Trap 3 — your JDK is newer than the lab's</h3>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")</code></pre>
<div class="out">src/main/Main.java:75: warning: as of release 10, 'var' is a restricted type name and cannot be used for type declarations or as the element type of an array<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;var line = "";<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
src/repository/NoteRepository.java:22: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;noteList = new ArrayList&lt;&gt;(java.util.List.of());<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;method of()<br>
&nbsp;&nbsp;location: interface List<br>
src/main/Main.java:75: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;var line = "";<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;class var<br>
&nbsp;&nbsp;location: class Main<br>
2 errors<br>
1 warning</div>`,
    `<h2>4. Chạy thật — và ba phép kiểm trước mỗi lần review</h2>
<p>Bộ phím test nằm trong <code>harness/input.txt</code>: bảng rỗng, một chữ cái và số 7 ở menu, ghi chú trống, hai ghi chú, xem bảng, mã trống, mã là chữ, mã không tồn tại, xoá thật, xem lại bảng, thoát. Câu báo nào cũng nói sai gì và phải nhập gì:</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Please choose one option: ------------- Note -------------<br>
Chua co ghi chu nao. Hay chon 1 de them.<br>
========= Note program =========<br>
1. Add Note<br>
2. Delete Note<br>
3. Display Note<br>
4. Exit<br>
Please choose one option: Ban phai nhap 1 so (vi du: 1, 2, 3), khong nhap chu hay de trong. Moi nhap lai.<br>
Please choose one option: Lua chon nam ngoai khoang. Hay nhap 1 so tu 1 den 4. Moi nhap lai.<br>
Please choose one option: ------------Add Note------------<br>
Content: Noi dung ghi chu khong duoc de trong. Hay chon lai 1 va nhap noi dung.<br>
========= Note program =========<br>
1. Add Note<br>
2. Delete Note<br>
3. Display Note<br>
4. Exit<br>
Please choose one option: ------------Add Note------------<br>
Content: Da them ghi chu ma [1].<br>
========= Note program =========<br>
1. Add Note<br>
2. Delete Note<br>
3. Display Note<br>
4. Exit<br>
Please choose one option: ------------Add Note------------<br>
Content: Da them ghi chu ma [2].<br>
========= Note program =========<br>
1. Add Note<br>
2. Delete Note<br>
3. Display Note<br>
4. Exit<br>
Please choose one option: ------------- Note -------------<br>
ID &nbsp;Content<br>
1 &nbsp;&nbsp;Mua sach PRO192<br>
2 &nbsp;&nbsp;Hoc LAB211 moi toi<br>
========= Note program =========<br>
1. Add Note<br>
2. Delete Note<br>
3. Display Note<br>
4. Exit<br>
Please choose one option: ------------Del Note------------<br>
ID: Ma ghi chu khong duoc de trong. Hay chon 3 xem ma roi chon lai 2.<br>
========= Note program =========<br>
1. Add Note<br>
2. Delete Note<br>
3. Display Note<br>
4. Exit<br>
Please choose one option: ------------Del Note------------<br>
ID: Ma ghi chu phai la so nguyen (vi du: 1, 2). Hay chon lai 2.<br>
========= Note program =========<br>
1. Add Note<br>
2. Delete Note<br>
3. Display Note<br>
4. Exit<br>
Please choose one option: ------------Del Note------------<br>
ID: Khong co ghi chu ma [9]. Hay chon 3 xem cac ma dang co.<br>
…</div>
<pre><code class="language-bash">$ python3 lint.py MSSV_KHUNG_NoteManagement</code></pre>
<div class="out">✓ MSSV_KHUNG_NoteManagement — sạch</div>
<pre><code class="language-bash">$ ./check.sh        # Windows: check.bat · NetBeans: Run File on test/harness/CheckHarness.java</code></pre>
<div class="out">PASS: 81/81 dong khop expected.txt</div>
<p>Cùng chương trình đó biên dịch và chạy trên JDK 8 thật (Docker <code>eclipse-temurin:8-jdk</code>, đúng phiên bản máy phòng lab) in ra y hệt 81 dòng. Soát 25 mục tờ giấy (<code>soat_checklist.py</code>) ra 0 vi phạm.</p>
<h2>5. Ba cái bẫy, chạy thật</h2>
<h3>Bẫy 1 — bảy lỗi một dòng, tám vi phạm</h3>
<pre><code class="language-bash">$ python3 lint.py MSSV_KHUNG_NoteManagement</code></pre>
<div class="out">✗ MSSV_KHUNG_NoteManagement — 8 vi phạm<br>
&nbsp;&nbsp;[PRINT] src/controller/NoteController.java:34 — không được print ngoài view và main (Guide.xlsx)<br>
&nbsp;&nbsp;[HARDCODE] src/controller/NoteController.java:34 — chuỗi "Them xong" phải khai báo ở constants (Message/Constants)<br>
&nbsp;&nbsp;[EXIT] src/main/Main.java:59 — không dùng System.exit — thoát bằng cờ/return<br>
&nbsp;&nbsp;[MAGIC] src/main/Main.java:85 — số 4 viết thẳng — đặt tên hằng trong Constants (CC §10.3)<br>
&nbsp;&nbsp;[STATIC] src/main/Main.java:18 — main: cấm static với biến, chỉ được static với hàm (Guide.xlsx)<br>
&nbsp;&nbsp;[COMMENT] src/main/Main.java:18 — trường 'sc' thiếu comment<br>
&nbsp;&nbsp;[COMMENT] src/repository/NoteRepository.java:64 — 'if' thiếu comment (thầy: comment cho mọi block/rẽ nhánh)<br>
&nbsp;&nbsp;[COLLECTION] src/repository/NoteRepository.java:19 — dùng kiểu cụ thể ArrayList/HashMap/LinkedHashMap (thầy: List/Map là dấu hiệu AI) — chỉ giữ List/Map khi đề bắt, kèm comment '// brief: ...'</div>
<p>Mỗi dòng nói tên luật và chỗ sai: controller tự in (PRINT) một chuỗi viết thẳng (HARDCODE), <code>System.exit</code> (EXIT), giới hạn menu viết thành <code>4</code> (MAGIC), một trường <code>Scanner</code> static trong Main (STATIC) không có comment (COMMENT), một <code>if</code> mất comment (COMMENT), một <code>List</code> (COLLECTION).</p>
<h3>Bẫy 2 — lint xanh, thầy vẫn nói không</h3>
<pre><code class="language-bash">$ python3 lint.py MSSV_KHUNG_NoteManagement</code></pre>
<div class="out">✓ MSSV_KHUNG_NoteManagement — sạch</div>
<p>Dự án này thêm một <code>NoteService</code> tự tạo và giữ <code>NoteRepository</code>; controller chỉ nói chuyện với service. Nó biên dịch được, in ra đúng 81 dòng như đáp án, lint.py im lặng — và đó chính là lỗi thầy đã bắt ở P0011 ngày 26/10: "CRUD không được nằm trong service". Kiểm theo cách thầy kiểm — bằng import:</p>
<pre><code class="language-bash">$ grep -n "^import" src/service/*.java
src/service/NoteService.java:3:import dto.NoteRequestDTO;
src/service/NoteService.java:4:import java.util.ArrayList;
src/service/NoteService.java:5:import repository.NoteRepository;     &lt;- service khong duoc import repository</code></pre>
<h3>Bẫy 3 — JDK của bạn mới hơn JDK phòng lab</h3>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")</code></pre>
<div class="out">src/main/Main.java:75: warning: as of release 10, 'var' is a restricted type name and cannot be used for type declarations or as the element type of an array<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;var line = "";<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
src/repository/NoteRepository.java:22: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;noteList = new ArrayList&lt;&gt;(java.util.List.of());<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;method of()<br>
&nbsp;&nbsp;location: interface List<br>
src/main/Main.java:75: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;var line = "";<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;class var<br>
&nbsp;&nbsp;location: class Main<br>
2 errors<br>
1 warning</div>`),
    bi(`<h2>6. Debug in NetBeans — gate 4</h2>
<table>
<thead><tr><th>Key</th><th>Does</th></tr></thead>
<tbody>
<tr><td>click the line number</td><td>set / remove a breakpoint (red dot)</td></tr>
<tr><td>Ctrl+F5</td><td>run in debug mode</td></tr>
<tr><td>F8</td><td>Step Over — run the current line, do not enter the method</td></tr>
<tr><td>F7</td><td>Step Into — enter the method being called</td></tr>
<tr><td>Ctrl+F7</td><td>Step Out — finish the method, go back to the caller</td></tr>
<tr><td>F5</td><td>Continue to the next breakpoint</td></tr>
<tr><td>Variables tab</td><td>read the values; ▸ opens an object, a list, a map</td></tr>
</tbody>
</table>
<p>The script that works for every lab: a breakpoint on the line that calls <code>Validation.getChoice(...)</code> in Main → Ctrl+F5 → type a WRONG value → F7 into Validation → F8 to the <code>throw</code> and show the variable holding the wrong value → F8 again: you land in Main's <code>catch</code>, the message is printed, the loop asks again.</p>
<h2>7. The questions the lecturer asks — answer them out loud</h2>
<details><summary>Point at the four OOP properties in your code.</summary><p class="dap-an">✅ Encapsulation: the private fields of <code>Note</code> with getters/setters. Inheritance: every class extends <code>Object</code>; <code>toString()</code> is inherited and overridden. Polymorphism: <code>@Override toString()</code> — <code>println(note)</code> runs Note's version. Abstraction: Main calls <code>noteController.addNote(dto)</code> without knowing that notes live in an ArrayList.</p></details>
<details><summary>Why is this field private? Why is this method public?</summary><p class="dap-an">✅ Private: no other class can change it directly — every change goes through a method that can check it. Public: another class calls it (Main calls the controller, the controller calls the repository); everything else stays private.</p></details>
<details><summary>Why is Validation static — and what if I remove static?</summary><p class="dap-an">✅ Its result depends only on its input, it keeps no data: static, called through the class name. Remove <code>static</code>: "non-static method getChoice(String,int,int) cannot be referenced from a static context". To make it run: remove <code>private</code> from its constructor and write <code>Validation validation = new Validation();</code> in main.</p></details>
<details><summary>Why ArrayList and not List?</summary><p class="dap-an">✅ <code>List</code> is an interface (the contract: add, get, remove…); <code>ArrayList</code> is a class that implements it with a growing array — fast by index. The lecturer asks for the concrete type in declarations; if the brief dictates a <code>List</code> signature, keep it and say "the brief requires it, inside I use an ArrayList".</p></details>
<details><summary>Why does addNote return void — and why does the repository's addNote return int?</summary><p class="dap-an">✅ The controller's job is done when the view has printed: nothing to give back, and errors travel by <code>throw</code>. The repository returns the new ID (an int) because the controller needs it to build the message "Da them ghi chu ma [1]."</p></details>
<details><summary>Overloading or overriding?</summary><p class="dap-an">✅ Overloading: same name, different parameters, in the same class — decided at compile time (the two constructors of Note). Overriding: same signature in a subclass — decided at run time (<code>toString()</code> with <code>@Override</code>).</p></details>
<details><summary>"I change requirement X — how long?"</summary><p class="dap-an">✅ Answer with file names: a new message → Message only; a new rule on what is typed → Validation + the Main helper; store in a file → the repository only. That is what one job per class buys.</p></details>`,
    `<h2>6. Debug trong NetBeans — cửa 4</h2>
<table>
<thead><tr><th>Phím</th><th>Tác dụng</th></tr></thead>
<tbody>
<tr><td>bấm vào số dòng</td><td>đặt / bỏ breakpoint (chấm đỏ)</td></tr>
<tr><td>Ctrl+F5</td><td>chạy ở chế độ debug</td></tr>
<tr><td>F8</td><td>Step Over — chạy dòng hiện tại, không chui vào hàm</td></tr>
<tr><td>F7</td><td>Step Into — chui vào hàm đang gọi</td></tr>
<tr><td>Ctrl+F7</td><td>Step Out — chạy hết hàm, quay về chỗ gọi</td></tr>
<tr><td>F5</td><td>Continue — chạy tới breakpoint kế</td></tr>
<tr><td>tab Variables</td><td>đọc giá trị; ▸ mở một đối tượng, một danh sách, một map</td></tr>
</tbody>
</table>
<p>Kịch bản dùng được cho mọi bài: breakpoint ở dòng gọi <code>Validation.getChoice(...)</code> trong Main → Ctrl+F5 → gõ một giá trị SAI → F7 vào Validation → F8 tới dòng <code>throw</code> và chỉ cho thầy biến đang giữ giá trị sai → F8 tiếp: bạn rơi vào <code>catch</code> của Main, câu lỗi được in, vòng lặp hỏi lại.</p>
<h2>7. Câu thầy hay hỏi — tập trả lời thành tiếng</h2>
<details><summary>Chỉ vào bốn tính chất OOP trong code của em.</summary><p class="dap-an">✅ Đóng gói: các trường private của <code>Note</code> cùng getter/setter. Kế thừa: mọi lớp đều extends <code>Object</code>; <code>toString()</code> được thừa kế rồi ghi đè. Đa hình: <code>@Override toString()</code> — <code>println(note)</code> chạy bản của Note. Trừu tượng: Main gọi <code>noteController.addNote(dto)</code> mà không biết ghi chú nằm trong một ArrayList.</p></details>
<details><summary>Sao trường này private? Sao hàm này public?</summary><p class="dap-an">✅ Private: không lớp nào sửa thẳng được — muốn đổi phải đi qua hàm có kiểm tra. Public: có lớp khác gọi nó (Main gọi controller, controller gọi repository); mọi thứ còn lại để private.</p></details>
<details><summary>Sao Validation là static — bỏ static đi thì sao?</summary><p class="dap-an">✅ Kết quả chỉ phụ thuộc đầu vào, không giữ dữ liệu: static, gọi qua tên lớp. Bỏ <code>static</code>: "non-static method getChoice(String,int,int) cannot be referenced from a static context". Muốn chạy được: bỏ <code>private</code> ở constructor và viết <code>Validation validation = new Validation();</code> trong main.</p></details>
<details><summary>Sao dùng ArrayList mà không phải List?</summary><p class="dap-an">✅ <code>List</code> là interface (bản hợp đồng: add, get, remove…); <code>ArrayList</code> là lớp cài đặt hợp đồng đó bằng một mảng tự nở — lấy theo chỉ số rất nhanh. Thầy yêu cầu khai báo kiểu cụ thể; nếu đề bắt chữ ký <code>List</code> thì giữ và nói "đề bắt kiểu trả về List, bên trong em dùng ArrayList".</p></details>
<details><summary>Sao addNote của controller trả về void — còn addNote của repository trả về int?</summary><p class="dap-an">✅ Việc của controller xong khi view đã in: không có gì phải trả về, lỗi đi bằng <code>throw</code>. Repository trả về mã mới (một int) vì controller cần nó để dựng câu "Da them ghi chu ma [1]."</p></details>
<details><summary>Overloading hay overriding?</summary><p class="dap-an">✅ Overloading: cùng tên, khác tham số, trong cùng một lớp — quyết định lúc biên dịch (hai constructor của Note). Overriding: cùng chữ ký ở lớp con — quyết định lúc chạy (<code>toString()</code> có <code>@Override</code>).</p></details>
<details><summary>"Thầy đổi yêu cầu X, em sửa mất bao lâu?"</summary><p class="dap-an">✅ Trả lời bằng tên tệp: thêm một câu báo → chỉ Message; thêm một luật cho chữ gõ vào → Validation + hàm nhập ở Main; lưu ra tệp → chỉ repository. Mỗi lớp một việc mua được đúng điều đó.</p></details>`),
    bi(`<h2>8. Your routine before every review</h2>
<ol>
<li><strong>Compile for the lab:</strong> <code>javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")</code> — no error.</li>
<li><strong>Type every test key</strong> of the lab: each happy case, each error message of the brief.</li>
<li><strong>lint.py</strong> on your project folder → "✓ … — sạch". (At home: <code>python3 lint.py MSSV_KHUNG_NoteManagement</code>.)</li>
<li><strong>Read your imports:</strong> service without <code>repository</code>, controller without <code>model</code>, main without model/view/repository/service.</li>
<li><strong>Alt+Shift+F</strong> on every file, then the blank lines it does not add (before comments, after declarations).</li>
<li><strong>Names:</strong> <code>noteController</code>, <code>workerService</code> — never <code>controller</code>, <code>service</code>, <code>ws</code>; lists end in <code>List</code>, maps in <code>Map</code>.</li>
<li><strong>Messages:</strong> read <code>Message.java</code> — the lecturer opens it first. Every error says what is wrong and what to type.</li>
<li><strong>Paper checklist:</strong> fill "O" in all 25 rows; one "X" = not ready.</li>
<li><strong>Debug once</strong> (section 6) and answer the questions of section 7 out loud.</li>
<li><strong>Save draft</strong> on PTS, then raise your hand — before the last 30 minutes.</li>
</ol>
<h2>9. Download</h2>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/lab211/v1/MSSV_KHUNG_NoteManagement-solution.zip" target="_blank" rel="noopener">
<span class="lc-ico">🧱</span>
<span class="lc-body"><span class="lc-title">MSSV_KHUNG_NoteManagement-solution.zip</span><span class="lc-sub">the shared skeleton: NetBeans project (Java 8), 10 files, 8 packages (no service needed) · harness/input.txt (test keys) · check.sh / check.bat</span></span>
<span class="lc-cta">Download</span>
</a>
<p>Rename the folder: replace <code>MSSV</code> by your student code. Type it again from memory until you can do it in 30 minutes — every lab of the semester starts from these 10 files.</p>
<div class="callout"><p><strong>Next:</strong> J1.S.P0011 Change Base Number — the lab where the lecturer said "CRUD out of the service", and how the fixed version is built.</p></div>`,
    `<h2>8. Thói quen trước mỗi lần review</h2>
<ol>
<li><strong>Biên dịch cho phòng lab:</strong> <code>javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")</code> — không lỗi.</li>
<li><strong>Gõ đủ bộ phím test</strong> của bài: mọi trường hợp đúng, mọi câu báo lỗi của đề.</li>
<li><strong>lint.py</strong> lên thư mục dự án → "✓ … — sạch". (Ở nhà: <code>python3 lint.py MSSV_KHUNG_NoteManagement</code>.)</li>
<li><strong>Đọc lại import:</strong> service không có <code>repository</code>, controller không có <code>model</code>, main không có model/view/repository/service.</li>
<li><strong>Alt+Shift+F</strong> từng tệp, rồi tự thêm các dòng trống nó không thêm (trước comment, sau vùng khai báo).</li>
<li><strong>Tên:</strong> <code>noteController</code>, <code>workerService</code> — không bao giờ <code>controller</code>, <code>service</code>, <code>ws</code>; danh sách đuôi <code>List</code>, map đuôi <code>Map</code>.</li>
<li><strong>Câu báo:</strong> đọc lại <code>Message.java</code> — thầy mở nó đầu tiên. Câu lỗi nào cũng nói sai gì và phải nhập gì.</li>
<li><strong>Tờ checklist giấy:</strong> điền "O" đủ 25 dòng; còn một "X" là chưa sẵn sàng.</li>
<li><strong>Debug một lần</strong> (mục 6) và trả lời thành tiếng các câu ở mục 7.</li>
<li><strong>Save draft</strong> trên PTS, rồi giơ tay — trước 30 phút cuối.</li>
</ol>
<h2>9. Tệp tải về</h2>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/lab211/v1/MSSV_KHUNG_NoteManagement-solution.zip" target="_blank" rel="noopener">
<span class="lc-ico">🧱</span>
<span class="lc-body"><span class="lc-title">MSSV_KHUNG_NoteManagement-solution.zip</span><span class="lc-sub">khung chung: project NetBeans (Java 8), 10 tệp, 8 package (không cần service) · harness/input.txt (phím test) · check.sh / check.bat</span></span>
<span class="lc-cta">Tải về</span>
</a>
<p>Đổi tên thư mục: thay <code>MSSV</code> bằng mã sinh viên của bạn. Gõ lại thuộc lòng cho tới khi làm xong trong 30 phút — bài LAB211 nào của kỳ cũng bắt đầu từ 10 tệp này.</p>
<div class="callout"><p><strong>Tiếp theo:</strong> J1.S.P0011 Change Base Number — bài thầy nói "đưa CRUD ra khỏi service", và cách dựng bản đã sửa.</p></div>`),
  ].join('\n'),
};

/* ───────── L.1 — 🎓 LAB211 J1.S.P0011 Change Base Number (BIN, DEC, HEX): two hand-written conversions, CRUD out of the service, lint clean ───────── */
const L_l211_p0011 = {
  title: 'L.1 — 🎓 LAB211 J1.S.P0011 Change Base Number (BIN, DEC, HEX): two hand-written conversions, CRUD out of the service, lint clean|||L.1 — 🎓 LAB211 J1.S.P0011 Đổi hệ cơ số (BIN, DEC, HEX): hai thuật toán tự viết, CRUD ra khỏi service, lint sạch',
  slug: 'pro192-lab211-p0011-change-base-number',
  type: 'VIDEO',
  description: 'Bài LAB211 J1.S.P0011 (100 LOC) làm trọn theo chuẩn review của thầy: đọc đề (chọn hệ vào, hệ ra, nhập giá trị, lặp tới khi thoát; 4 ví dụ tính tay), thiết kế lớp (controller giữ repository, service chỉ đổi hệ — đúng chỗ thầy bắt ngày 26/10), hai thuật toán tự viết qua hệ thập phân (nhân dồn có chặn tràn số long, chia lấy dư bằng StringBuilder rồi đảo một lần), Validation kiểm từng chữ số đúng hệ, câu lỗi tiếng Việt nói rõ sai ở đâu. Chạy thật đủ phím test, lint.py sạch, 25 mục tờ checklist 0 vi phạm, JDK 8 thật. Kèm bản trước khi sửa (15 vi phạm lint, service giữ repository) để so trước/sau, câu thầy hay hỏi kèm trả lời, và dự án tải về.',
  content: [
    bi(`<span class="eyebrow">🎓 LAB211 in practice · L.1 · J1.S.P0011</span>
<h2>Change Base Number System</h2>
<p class="lead">A short assignment worth 100 LOC: pick an input base, an output base, type a value, see the same number written in the other base — BIN, DEC or HEX. The algorithm fits on a napkin; the review is where people lose it. On 26/10 the lecturer rejected the first version of this exact lab with one sentence: "CRUD must not be in the service — take the repository calls out of it." This lesson builds the fixed version, file by file.</p>
<p>Plan about <strong>2 hours</strong> to retype it from the lesson, then 30 minutes to run the test keys and answer the questions of section 7 out loud.</p>`,
    `<span class="eyebrow">🎓 LAB211 thực chiến · L.1 · J1.S.P0011</span>
<h2>Đổi hệ cơ số</h2>
<p class="lead">Bài ngắn 100 LOC: chọn hệ vào, chọn hệ ra, gõ một giá trị, xem cùng con số đó viết ở hệ kia — BIN, DEC hoặc HEX. Thuật toán viết vừa một mẩu giấy; chỗ người ta mất điểm là lúc review. Ngày 26/10 thầy trả lại bản đầu của đúng bài này bằng một câu: "CRUD không được nằm trong service — mấy cái repo gọi trong service đưa ra hết ngoài." Bài này dựng bản đã sửa, từng tệp một.</p>
<p>Dành khoảng <strong>2 giờ</strong> để gõ lại theo bài, rồi 30 phút chạy bộ phím test và trả lời thành tiếng các câu ở mục 7.</p>`),
    bi(`<h2>📑 Slide by slide — PRO192 · LAB211 P0011 (13 slides)</h2>
<p>The deck of this LAB211 lesson, made by CuongThai (it is not a school deck and not the lecturer's). Each slide is followed by its key idea and the explanation; every piece of code and every output on the slides comes from the real project in this lesson — checked by <code>lint.py</code> (the lecturer's rules), compiled with <code>javac --release 8</code> and run on a real JDK 8, like the machines in the lab room.</p>`,
    `<h2>📑 Học theo từng slide — PRO192 · LAB211 P0011 (13 slide)</h2>
<p>Bộ slide của bài LAB211 này do CuongThai dựng (không phải slide của trường, cũng không phải của thầy). Dưới mỗi slide là ý chính và lời giảng; mọi đoạn code, mọi output trên slide đều lấy từ đúng dự án trong bài — qua <code>lint.py</code> (luật của thầy), biên dịch bằng <code>javac --release 8</code> và chạy trên JDK 8 thật, giống máy phòng lab.</p>`),
    walk('l211-p0011', [
      [1, 'J1.S.P0011 — Change Base Number System',
        `<p class="y-chinh">🎯 Base 2, 10 and 16, two hand-written algorithms, and the layering the lecturer asked for in a real review.</p>
<p>This deck goes from the brief to a reviewed project: the algorithms on the brief's own examples, the class design, the code of every layer, the real run, and the questions you will be asked.</p>`,
        `<p class="y-chinh">🎯 Hệ 2, 10 và 16, hai thuật toán tự viết, và cách chia tầng thầy yêu cầu trong một lần review thật.</p>
<p>Bộ slide đi từ đề tới một dự án đã qua review: thuật toán trên chính các ví dụ của đề, thiết kế lớp, code từng tầng, lần chạy thật, và những câu bạn sẽ bị hỏi.</p>`],
      [2, 'The brief',
        `<p class="y-chinh">🎯 Choose the base of the input (1 binary, 2 decimal, 3 hexadecimal), the base of the output, enter a value, print the equivalent value; repeat until the user closes the program.</p>
<p>The brief has no fixed screen and imposes no method names, only four worked examples: 535 DEC → HEX, 217 HEX → DEC, 27 DEC → BIN, 11011 BIN → DEC. So we keep the reference screen of the class (menu with 0 = Exit, three prompts, one line <code>535 (DEC) = 217 (HEX)</code>) and write both conversions by hand — <code>Integer.parseInt(s, 16)</code> would skip what the lab is testing.</p>`,
        `<p class="y-chinh">🎯 Chọn hệ của giá trị vào (1 nhị phân, 2 thập phân, 3 thập lục phân), chọn hệ ra, nhập giá trị, in giá trị tương đương; lặp lại tới khi người dùng đóng chương trình.</p>
<p>Đề không có màn hình mẫu và không bắt tên hàm nào, chỉ có bốn ví dụ tính tay: 535 DEC → HEX, 217 HEX → DEC, 27 DEC → BIN, 11011 BIN → DEC. Nên bài giữ màn hình tham chiếu của lớp (menu có 0 = Exit, ba câu nhắc, một dòng kết quả <code>535 (DEC) = 217 (HEX)</code>) và tự viết cả hai phép đổi — dùng <code>Integer.parseInt(s, 16)</code> là bỏ qua đúng thứ bài muốn kiểm.</p>`],
      [3, 'Every road goes through decimal',
        `<p class="y-chinh">🎯 Two algorithms cover all 9 pairs: any base → decimal by "result = result × base + digit", decimal → any base by repeated division, reading the remainders from the bottom up.</p>
<p>535 to HEX: 535 ÷ 16 = 33 remainder 7, 33 ÷ 16 = 2 remainder 1, 2 ÷ 16 = 0 remainder 2 — read upwards: 217. Back: ((2 × 16) + 1) × 16 + 7 = 535. Adding base 8 later is one line in the enum, not a third algorithm.</p>`,
        `<p class="y-chinh">🎯 Hai thuật toán phủ đủ 9 cặp: hệ bất kỳ → thập phân bằng "kết quả = kết quả × cơ số + chữ số", thập phân → hệ bất kỳ bằng chia liên tiếp, đọc số dư từ dưới lên.</p>
<p>535 sang HEX: 535 ÷ 16 = 33 dư 7, 33 ÷ 16 = 2 dư 1, 2 ÷ 16 = 0 dư 2 — đọc ngược lên: 217. Chiều về: ((2 × 16) + 1) × 16 + 7 = 535. Sau này thêm hệ 8 chỉ là một dòng trong enum, không phải thuật toán thứ ba.</p>`],
      [4, 'The class design',
        `<p class="y-chinh">🎯 <code>ConvertController</code> holds <code>BaseNumberRepository</code>, <code>ConvertService</code> and <code>ConvertView</code>: it saves the number (CRUD), gives it to the service (conversion), gives the result to the view (print).</p>
<p>The repository keeps the history of numbers typed (<code>ArrayList&lt;BaseNumber&gt;</code>) — the checklist makes a repository compulsory even in an algorithm lab. The service holds nothing and imports no repository: it receives a <code>BaseNumber</code> and a <code>Base</code>, returns a <code>ConvertResponseDTO</code>. The enum <code>Base</code> lives in <code>constants</code> — the Guide says Constants holds "hằng số, enum".</p>`,
        `<p class="y-chinh">🎯 <code>ConvertController</code> giữ <code>BaseNumberRepository</code>, <code>ConvertService</code> và <code>ConvertView</code>: lưu con số (CRUD), đưa cho service (đổi hệ), đưa kết quả cho view (in).</p>
<p>Repository giữ lịch sử các số đã nhập (<code>ArrayList&lt;BaseNumber&gt;</code>) — tờ checklist bắt buộc có repository kể cả bài thuật toán. Service không giữ gì và không import repository: nó nhận một <code>BaseNumber</code> và một <code>Base</code>, trả về một <code>ConvertResponseDTO</code>. Enum <code>Base</code> nằm ở <code>constants</code> — Guide ghi Constants chứa "hằng số, enum".</p>`],
      [5, 'What the lecturer rejected',
        `<p class="y-chinh">🎯 Before: <code>ConvertService</code> created its own <code>BaseNumberRepository</code> and called <code>save</code> and <code>findLast</code> itself. After: the controller does the CRUD and passes the stored number to the service.</p>
<p>The reason he gives: the service is for business computation, the repository for data, the controller decides who is called. If storage changes (a file, a database), only the repository changes — the S of SOLID. The old version also had 15 lint violations (no Javadoc, a <code>List</code>, models without an empty constructor) and English one-word errors ("You must input a number.").</p>`,
        `<p class="y-chinh">🎯 Trước: <code>ConvertService</code> tự tạo <code>BaseNumberRepository</code> và tự gọi <code>save</code>, <code>findLast</code>. Sau: controller làm CRUD rồi đưa con số đã lưu cho service.</p>
<p>Lý do thầy nói: service lo tính toán nghiệp vụ, repository lo dữ liệu, controller quyết định gọi ai. Đổi cách lưu (ra tệp, vào cơ sở dữ liệu) thì chỉ sửa repository — chữ S của SOLID. Bản cũ còn 15 vi phạm lint (không Javadoc, một <code>List</code>, model thiếu constructor rỗng) và câu lỗi tiếng Anh cụt ("You must input a number.").</p>`],
      [6, 'constants: the Base enum and the messages',
        `<p class="y-chinh">🎯 <code>Base</code> stores, for each base, the menu number, the radix and the label; <code>findByChoice</code> turns the number typed into the base. <code>Message</code> holds every sentence, and every error says what is wrong and what to type.</p>
<p><code>getAllowedDigits()</code> cuts <code>"0123456789ABCDEF"</code> to the radix ("01" for binary), so the error for "1G" can list the digits allowed: <code>"1G" khong phai so he HEX hop le. He HEX chi dung cac chu so: 0123456789ABCDEF.</code></p>`,
        `<p class="y-chinh">🎯 <code>Base</code> giữ, cho mỗi hệ, số chọn ở menu, cơ số và nhãn; <code>findByChoice</code> đổi số người dùng gõ thành hệ. <code>Message</code> giữ mọi câu chữ, và câu lỗi nào cũng nói sai gì, phải nhập gì.</p>
<p><code>getAllowedDigits()</code> cắt chuỗi <code>"0123456789ABCDEF"</code> theo cơ số ("01" cho nhị phân), nên câu lỗi của "1G" liệt kê được các chữ số cho phép: <code>"1G" khong phai so he HEX hop le. He HEX chi dung cac chu so: 0123456789ABCDEF.</code></p>`],
      [7, 'Validation: check the digits before converting',
        `<p class="y-chinh">🎯 Three static checks: <code>getChoice</code> (a whole number in a range), <code>getValue</code> (not blank), <code>checkValue</code> (every digit belongs to the input base, an optional sign allowed).</p>
<p><code>checkValue</code> upper-cases the value so "ff" counts like "FF", removes one leading + or −, refuses a sign alone, then looks up each character in the digit string: −1 (not a digit) or a value ≥ the radix ("2" in binary) throws. Main calls it once, just before the controller.</p>`,
        `<p class="y-chinh">🎯 Ba hàm kiểm static: <code>getChoice</code> (số nguyên trong khoảng), <code>getValue</code> (không trống), <code>checkValue</code> (mọi chữ số thuộc hệ vào, được phép có một dấu ở đầu).</p>
<p><code>checkValue</code> viết hoa giá trị để "ff" tính như "FF", bỏ một dấu + hoặc − ở đầu, từ chối chuỗi chỉ có dấu, rồi tra từng ký tự trong chuỗi chữ số: −1 (không phải chữ số) hoặc giá trị ≥ cơ số ("2" trong nhị phân) là ném lỗi. Main gọi nó một lần, ngay trước controller.</p>`],
      [8, 'Repository: save and findLast',
        `<p class="y-chinh">🎯 <code>save(dto)</code> builds the <code>BaseNumber</code> from the request and appends it; <code>findLast()</code> returns the last one stored.</p>
<p>The repository is allowed to import both the DTO and the model — it is the layer that turns one into the other, so the controller never has to import <code>model</code>. The list is an <code>ArrayList</code> declared as such (rule V5) with a name ending in <code>List</code> (checklist 1.5).</p>`,
        `<p class="y-chinh">🎯 <code>save(dto)</code> dựng <code>BaseNumber</code> từ phiếu nhập rồi thêm vào cuối; <code>findLast()</code> trả về con số lưu gần nhất.</p>
<p>Repository được import cả DTO lẫn model — nó là tầng đổi cái này thành cái kia, nhờ vậy controller không bao giờ phải import <code>model</code>. Danh sách khai báo đúng kiểu <code>ArrayList</code> (luật V5) và tên kết thúc bằng <code>List</code> (checklist 1.5).</p>`],
      [9, 'Service: any base to decimal, without overflow',
        `<p class="y-chinh">🎯 Read the digits left to right: <code>result = (result * radix) + digitValue</code> — but check BEFORE multiplying that <code>result &gt; (Long.MAX_VALUE - digitValue) / radix</code> is false.</p>
<p>Without the check, 65 binary ones silently wrap around to a negative number. With it, the program says "So qua lon, chuong trinh chi doi duoc so toi da 9223372036854775807 (he 10)." A minus sign is remembered first and applied at the end.</p>`,
        `<p class="y-chinh">🎯 Đọc chữ số từ trái sang phải: <code>result = (result * radix) + digitValue</code> — nhưng kiểm TRƯỚC khi nhân rằng <code>result &gt; (Long.MAX_VALUE - digitValue) / radix</code> là sai.</p>
<p>Không kiểm thì 65 chữ số 1 nhị phân lặng lẽ tràn thành số âm. Có kiểm thì chương trình nói "So qua lon, chuong trinh chi doi duoc so toi da 9223372036854775807 (he 10)." Dấu trừ được nhớ trước rồi áp vào ở cuối.</p>`],
      [10, 'Service: decimal to any base with a StringBuilder',
        `<p class="y-chinh">🎯 Divide by the radix while the value is above 0, <code>append</code> each remainder, then <code>reverse()</code> once — the last remainder found is the first digit.</p>
<p>The submitted version did <code>result = digit + result</code> in the loop: a new String every turn, and checklist row 3.8 says "StringBuilder, not String +=". 535 gives remainders 7, 1, 2 → "712" → reversed "217". Zero returns "0" directly; a negative number gets its "−" appended before the reverse.</p>`,
        `<p class="y-chinh">🎯 Chia cho cơ số khi giá trị còn lớn hơn 0, <code>append</code> từng số dư, rồi <code>reverse()</code> một lần — số dư tìm ra sau cùng là chữ số đứng đầu.</p>
<p>Bản nộp cũ viết <code>result = digit + result</code> trong vòng lặp: mỗi vòng tạo một String mới, và dòng 3.8 của tờ checklist ghi "dùng StringBuilder, không String +=". 535 cho số dư 7, 1, 2 → "712" → đảo thành "217". Số 0 trả "0" ngay; số âm được thêm dấu "−" trước khi đảo.</p>`],
      [11, 'Controller and Main: one call, three steps',
        `<p class="y-chinh">🎯 Main builds a <code>ConvertRequestDTO</code> (input base, output base, value), checks the digits, and calls <code>convertController.convert(dto)</code> once; the controller saves, converts, displays.</p>
<p>Main declares its four variables at the top of <code>main</code> (checklist 2.6), re-asks a single field until it is valid (<code>promptInputBase</code>, <code>promptOutputBase</code>, <code>promptValue</code>), and goes back to the menu when <code>checkValue</code> or the overflow check throws. 0 at the input base prints "Goodbye." and leaves with <code>return</code> — never <code>System.exit</code>.</p>`,
        `<p class="y-chinh">🎯 Main dựng một <code>ConvertRequestDTO</code> (hệ vào, hệ ra, giá trị), kiểm chữ số, rồi gọi <code>convertController.convert(dto)</code> một lần; controller lưu, đổi, in.</p>
<p>Main khai báo bốn biến ở đầu <code>main</code> (checklist 2.6), hỏi lại đúng một ô cho tới khi hợp lệ (<code>promptInputBase</code>, <code>promptOutputBase</code>, <code>promptValue</code>), và quay về menu khi <code>checkValue</code> hoặc phép kiểm tràn số ném lỗi. Chọn 0 ở hệ vào thì in "Goodbye." và thoát bằng <code>return</code> — không bao giờ <code>System.exit</code>.</p>`],
      [12, 'The real run, lint and JDK 8',
        `<p class="y-chinh">🎯 The four examples of the brief come out right (535 ↔ 217, 27 ↔ 11011), and so do the traps: a letter, 5 at the menu, "1G" in HEX, "2" in BIN, an empty value, −27, "ff", "007", a 65-digit binary number.</p>
<p><code>lint.py</code> prints "✓ MSSV_J1SP0011_ChangeBaseNumber — sạch", the 25 paper items give 0 violations, the grader matches 87/87 lines, and a real JDK 8 prints the same 87 lines as the machine.</p>`,
        `<p class="y-chinh">🎯 Bốn ví dụ của đề ra đúng (535 ↔ 217, 27 ↔ 11011), và các bẫy cũng vậy: một chữ cái, số 5 ở menu, "1G" ở HEX, "2" ở BIN, giá trị trống, −27, "ff", "007", một số nhị phân 65 chữ số.</p>
<p><code>lint.py</code> in "✓ MSSV_J1SP0011_ChangeBaseNumber — sạch", 25 mục tờ giấy ra 0 vi phạm, bộ chấm khớp 87/87 dòng, và JDK 8 thật in ra đúng 87 dòng như máy.</p>`],
      [13, 'What the lecturer asks',
        `<p class="y-chinh">🎯 "Why does the service not call the repository?", "How does 535 become 217?", "Why a long?", "Why is there a repository at all?", "Add base 8 — which files?"</p>
<p>Base 8 is the best answer to show off: one constant <code>OCTAL(4, 8, "OCT")</code> in the enum, change <code>BASE_MAX</code> to 4 and the menu text — neither algorithm changes, because both take the radix as a parameter. That is Open/Closed in one line.</p>`,
        `<p class="y-chinh">🎯 "Sao service không gọi repository?", "535 thành 217 thế nào?", "Sao dùng long?", "Bài thuật toán sao lại có repository?", "Thêm hệ 8 thì sửa tệp nào?"</p>
<p>Hệ 8 là câu trả lời đáng khoe nhất: một hằng <code>OCTAL(4, 8, "OCT")</code> trong enum, sửa <code>BASE_MAX</code> thành 4 và dòng chữ menu — không thuật toán nào phải sửa, vì cả hai nhận cơ số làm tham số. Đó là Open/Closed trong một dòng.</p>`],
    ]),
    bi(`<h2>1. The brief — and what it really requires</h2>
<table>
<thead><tr><th>The brief says</th><th>Where it lives in this project</th></tr></thead>
<tbody>
<tr><td>choose the input base: 1 binary, 2 decimal, 3 hexadecimal</td><td><code>Main.promptInputBase</code> + <code>Validation.getChoice</code> (0..3, 0 = Exit) + <code>Base.findByChoice</code></td></tr>
<tr><td>choose the output base</td><td><code>Main.promptOutputBase</code> (1..3)</td></tr>
<tr><td>enter the input value</td><td><code>Main.promptValue</code> + <code>Validation.getValue</code> (not blank) + <code>Validation.checkValue</code> (digits of the base)</td></tr>
<tr><td>convert by repeated division (DEC → 2, 16) — examples 1 and 3</td><td><code>ConvertService.convertFromDecimal</code></td></tr>
<tr><td>convert by Σ digit × base^position (2, 16 → DEC) — examples 2 and 4</td><td><code>ConvertService.convertToDecimal</code> (the same sum, computed left to right)</td></tr>
<tr><td>repeat until the user closes the program</td><td><code>while (true)</code> in <code>Main.main</code>, 0 prints "Goodbye." and returns</td></tr>
</tbody>
</table>
<p>Terms: <em>base</em> / <em>radix</em> (cơ số) — how many digits a system has; <em>remainder</em> (số dư); <em>overflow</em> (tràn số) — a result too big for the type.</p>
<h2>2. Class design</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/a61d5e291a00255dd4997ab736e5cb92cd8a6b2a.svg" alt="P0011: Main → controller once; the controller does the CRUD and hands the stored number to the service" loading="lazy" /><p class="chu-thich">🧩 P0011: Main → controller once; the controller does the CRUD and hands the stored number to the service</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title J1.S.P0011 Change Base Number — controller holds the repository, the service only converts
package main {
  class Main &lt;&lt;final&gt;&gt; {
    + {static} main(args : String[]) : void
    - {static} promptInputBase(scanner : Scanner) : int
    - {static} promptOutputBase(scanner : Scanner) : int
    - {static} promptValue(scanner : Scanner) : String
  }
}
package utils {
  class Validation &lt;&lt;final&gt;&gt; {
    + {static} getChoice(input : String, min : int, max : int) : int
    + {static} getValue(input : String) : String
    + {static} checkValue(value : String, base : Base) : void
  }
}
package controller {
  class ConvertController {
    - baseNumberRepository : BaseNumberRepository
    - convertService : ConvertService
    - convertView : ConvertView
    + convert(convertRequestDTO : ConvertRequestDTO) : void
  }
}
package repository {
  class BaseNumberRepository {
    - baseNumberList : ArrayList&lt;BaseNumber&gt;
    + save(convertRequestDTO : ConvertRequestDTO) : void
    + findLast() : BaseNumber
  }
}
package service {
  class ConvertService {
    + convert(baseNumber : BaseNumber, outputBase : Base) : ConvertResponseDTO
    - convertToDecimal(value : String, radix : int) : long
    - convertFromDecimal(value : long, radix : int) : String
  }
}
package model {
  class BaseNumber {
    - value : String
    - base : Base
  }
}
package constants {
  enum Base {
    BINARY(1, 2, "BIN")
    DECIMAL(2, 10, "DEC")
    HEXADECIMAL(3, 16, "HEX")
    + {static} findByChoice(choice : int) : Base
  }
}
package view {
  class ConvertView {
    - convertResponseDTO : ConvertResponseDTO
    + display() : void
  }
}
package dto {
  class ConvertRequestDTO {
    - inputBase : Base
    - outputBase : Base
    - value : String
  }
  class ConvertResponseDTO {
    - inputValue : String
    - inputLabel : String
    - outputValue : String
    - outputLabel : String
    + toString() : String
  }
}
Main ..&gt; ConvertController : convert(dto) once
Main ..&gt; Validation
Main ..&gt; ConvertRequestDTO
ConvertController *-- BaseNumberRepository : 1. save + findLast (CRUD)
ConvertController *-- ConvertService : 2. convert
ConvertController *-- ConvertView : 3. display once
BaseNumberRepository o-- "0..*" BaseNumber
ConvertService ..&gt; BaseNumber : reads
ConvertService ..&gt; ConvertResponseDTO : builds
BaseNumber --&gt; Base
@enduml</code></pre></details>
<table>
<thead><tr><th>Class</th><th>Role</th><th>Why there</th></tr></thead>
<tbody>
<tr><td><code>ConvertController</code></td><td>save → convert → display</td><td>the only class that knows the repository, the service and the view</td></tr>
<tr><td><code>BaseNumberRepository</code></td><td>history of numbers typed: <code>save(dto)</code>, <code>findLast()</code></td><td>"Bắt buộc phải có repository" (checklist 1.1), data + CRUD only</td></tr>
<tr><td><code>ConvertService</code></td><td>the two conversions</td><td>business computation, holds no data, imports no repository</td></tr>
<tr><td><code>BaseNumber</code></td><td>one value + its base (JavaBean)</td><td>the model the repository stores</td></tr>
<tr><td><code>Base</code> (enum)</td><td>menu number, radix, label of each base</td><td>constants: fixed values</td></tr>
<tr><td><code>ConvertRequestDTO</code> / <code>ConvertResponseDTO</code></td><td>Main → controller / controller → view</td><td>the Guide's DTO flow</td></tr>
<tr><td><code>Validation</code></td><td>getChoice, getValue, checkValue</td><td>format checks, static, final, private constructor</td></tr>
<tr><td><code>ConvertView</code></td><td>prints one line</td><td>the only printer besides Main</td></tr>
</tbody>
</table>`,
    `<h2>1. Đề bài — và đề thật sự bắt gì</h2>
<table>
<thead><tr><th>Đề nói</th><th>Nằm ở đâu trong dự án</th></tr></thead>
<tbody>
<tr><td>chọn hệ vào: 1 nhị phân, 2 thập phân, 3 thập lục phân</td><td><code>Main.promptInputBase</code> + <code>Validation.getChoice</code> (0..3, 0 = thoát) + <code>Base.findByChoice</code></td></tr>
<tr><td>chọn hệ ra</td><td><code>Main.promptOutputBase</code> (1..3)</td></tr>
<tr><td>nhập giá trị</td><td><code>Main.promptValue</code> + <code>Validation.getValue</code> (không trống) + <code>Validation.checkValue</code> (chữ số đúng hệ)</td></tr>
<tr><td>đổi bằng chia liên tiếp (DEC → 2, 16) — ví dụ 1 và 3</td><td><code>ConvertService.convertFromDecimal</code></td></tr>
<tr><td>đổi bằng Σ chữ số × cơ số^vị trí (2, 16 → DEC) — ví dụ 2 và 4</td><td><code>ConvertService.convertToDecimal</code> (cùng tổng đó, tính từ trái sang phải)</td></tr>
<tr><td>lặp tới khi người dùng đóng chương trình</td><td><code>while (true)</code> trong <code>Main.main</code>, chọn 0 thì in "Goodbye." và return</td></tr>
</tbody>
</table>
<p>Thuật ngữ: <em>base</em> / <em>radix</em> (cơ số) — một hệ có bao nhiêu chữ số; <em>remainder</em> (số dư); <em>overflow</em> (tràn số) — kết quả quá lớn so với kiểu dữ liệu.</p>
<h2>2. Thiết kế lớp</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/a61d5e291a00255dd4997ab736e5cb92cd8a6b2a.svg" alt="P0011: Main → controller một lần; controller làm CRUD rồi đưa con số đã lưu cho service" loading="lazy" /><p class="chu-thich">🧩 P0011: Main → controller một lần; controller làm CRUD rồi đưa con số đã lưu cho service</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title J1.S.P0011 Change Base Number — controller holds the repository, the service only converts
package main {
  class Main &lt;&lt;final&gt;&gt; {
    + {static} main(args : String[]) : void
    - {static} promptInputBase(scanner : Scanner) : int
    - {static} promptOutputBase(scanner : Scanner) : int
    - {static} promptValue(scanner : Scanner) : String
  }
}
package utils {
  class Validation &lt;&lt;final&gt;&gt; {
    + {static} getChoice(input : String, min : int, max : int) : int
    + {static} getValue(input : String) : String
    + {static} checkValue(value : String, base : Base) : void
  }
}
package controller {
  class ConvertController {
    - baseNumberRepository : BaseNumberRepository
    - convertService : ConvertService
    - convertView : ConvertView
    + convert(convertRequestDTO : ConvertRequestDTO) : void
  }
}
package repository {
  class BaseNumberRepository {
    - baseNumberList : ArrayList&lt;BaseNumber&gt;
    + save(convertRequestDTO : ConvertRequestDTO) : void
    + findLast() : BaseNumber
  }
}
package service {
  class ConvertService {
    + convert(baseNumber : BaseNumber, outputBase : Base) : ConvertResponseDTO
    - convertToDecimal(value : String, radix : int) : long
    - convertFromDecimal(value : long, radix : int) : String
  }
}
package model {
  class BaseNumber {
    - value : String
    - base : Base
  }
}
package constants {
  enum Base {
    BINARY(1, 2, "BIN")
    DECIMAL(2, 10, "DEC")
    HEXADECIMAL(3, 16, "HEX")
    + {static} findByChoice(choice : int) : Base
  }
}
package view {
  class ConvertView {
    - convertResponseDTO : ConvertResponseDTO
    + display() : void
  }
}
package dto {
  class ConvertRequestDTO {
    - inputBase : Base
    - outputBase : Base
    - value : String
  }
  class ConvertResponseDTO {
    - inputValue : String
    - inputLabel : String
    - outputValue : String
    - outputLabel : String
    + toString() : String
  }
}
Main ..&gt; ConvertController : convert(dto) once
Main ..&gt; Validation
Main ..&gt; ConvertRequestDTO
ConvertController *-- BaseNumberRepository : 1. save + findLast (CRUD)
ConvertController *-- ConvertService : 2. convert
ConvertController *-- ConvertView : 3. display once
BaseNumberRepository o-- "0..*" BaseNumber
ConvertService ..&gt; BaseNumber : reads
ConvertService ..&gt; ConvertResponseDTO : builds
BaseNumber --&gt; Base
@enduml</code></pre></details>
<table>
<thead><tr><th>Lớp</th><th>Vai trò</th><th>Vì sao ở đó</th></tr></thead>
<tbody>
<tr><td><code>ConvertController</code></td><td>lưu → đổi → in</td><td>lớp duy nhất biết repository, service và view</td></tr>
<tr><td><code>BaseNumberRepository</code></td><td>lịch sử các số đã nhập: <code>save(dto)</code>, <code>findLast()</code></td><td>"Bắt buộc phải có repository" (checklist 1.1), chỉ dữ liệu + CRUD</td></tr>
<tr><td><code>ConvertService</code></td><td>hai phép đổi</td><td>tính toán nghiệp vụ, không giữ dữ liệu, không import repository</td></tr>
<tr><td><code>BaseNumber</code></td><td>một giá trị + hệ của nó (JavaBean)</td><td>model mà repository lưu</td></tr>
<tr><td><code>Base</code> (enum)</td><td>số chọn menu, cơ số, nhãn của từng hệ</td><td>constants: giá trị cố định</td></tr>
<tr><td><code>ConvertRequestDTO</code> / <code>ConvertResponseDTO</code></td><td>Main → controller / controller → view</td><td>luồng DTO của Guide</td></tr>
<tr><td><code>Validation</code></td><td>getChoice, getValue, checkValue</td><td>kiểm dạng, static, final, constructor private</td></tr>
<tr><td><code>ConvertView</code></td><td>in một dòng</td><td>nơi in duy nhất ngoài Main</td></tr>
</tbody>
</table>`),
    bi(`<h2>3. The code, in the order to type it (model first)</h2>
<h4>Step 1 — the enum and the model</h4>
<pre class="trich"><code class="language-java">// Tim he co so theo so nguoi dung chon; khong co thi tra null
public static Base findByChoice(int choice) {
    // Duyet tung he, trung so chon thi tra ve he do
    for (Base base : values()) {
        // So chon khop thi day la he can tim
        if (base.menuChoice == choice) {
            return base;
        }
    }

    return null;
}</code></pre>
<pre class="trich"><code class="language-java">public class BaseNumber {

    // Gia tri nguoi dung nhap (dang chuoi, vd "1B")
    private String value;

    // He co so cua gia tri
    private Base base;

    // Constructor rong (JavaBean)
    public BaseNumber() {
    }

    // Constructor day du thuoc tinh
    public BaseNumber(String value, Base base) {
        this.value = value;
        this.base = base;
    }</code></pre>
<h4>Step 2 — DTO and repository</h4>
<pre class="trich"><code class="language-java">// Luu so vua nhap vao lich su (doi phieu nhap thanh model BaseNumber)
public void save(ConvertRequestDTO convertRequestDTO) {
    BaseNumber baseNumber = new BaseNumber(convertRequestDTO.getValue(),
            convertRequestDTO.getInputBase());

    // Them vao cuoi danh sach
    baseNumberList.add(baseNumber);
}</code></pre>
<pre class="trich"><code class="language-java">// Lay so vua luu gan nhat (phan tu cuoi danh sach)
public BaseNumber findLast() {
    return baseNumberList.get(baseNumberList.size() - 1);
}</code></pre>
<h4>Step 3 — the service (the two algorithms)</h4>
<pre class="trich"><code class="language-java">// Doi so da luu (baseNumber) sang he ra, tra ve phieu ket qua de View in
public ConvertResponseDTO convert(BaseNumber baseNumber, Base outputBase) throws Exception {
    long decimalValue = convertToDecimal(baseNumber.getValue(),
            baseNumber.getBase().getRadix());
    String outputValue = convertFromDecimal(decimalValue, outputBase.getRadix());

    // Gom gia tri vao/ra va nhan he thanh phieu ket qua
    return new ConvertResponseDTO(baseNumber.getValue(), baseNumber.getBase().getLabel(),
            outputValue, outputBase.getLabel());
}</code></pre>
<pre class="trich"><code class="language-java">// He bat ky -&gt; thap phan: ket qua = ket qua * co so + chu so (duyet trai sang phai)
private long convertToDecimal(String value, int radix) throws Exception {
    String digits = value.toUpperCase();
    boolean negative = digits.startsWith(Constants.MINUS);
    long result = 0;
    int digitValue = 0;

    // Bo dau - hoac + o dau truoc khi doi
    if (negative || digits.startsWith(Constants.PLUS)) {
        digits = digits.substring(1);
    }

    // Cong don tung chu so tu trai sang phai
    for (int i = 0; i &lt; digits.length(); i++) {
        digitValue = Constants.DIGITS.indexOf(digits.charAt(i));

        // Kiem TRUOC khi nhan de khong vuot qua so long lon nhat
        if (result &gt; ((Long.MAX_VALUE - digitValue) / radix)) {
            throw new Exception(Message.TOO_BIG);
        }

        // Day cac chu so cu len 1 bac roi cong chu so moi
        result = (result * radix) + digitValue;
    }

    // So am thi doi dau
    if (negative) {
        return -result;
    }

    return result;
}</code></pre>
<pre class="trich"><code class="language-java">// Thap phan -&gt; he bat ky: chia lay du cho co so, doc so du tu duoi len
private String convertFromDecimal(long value, int radix) {
    long remainingValue = Math.abs(value);
    StringBuilder digitBuilder = new StringBuilder();

    // So 0 thi tra ve "0" luon
    if (value == 0) {
        return Constants.ZERO;
    }

    // Chia lien tiep; moi so du la 1 chu so, tim ra tu hang don vi
    while (remainingValue &gt; 0) {
        digitBuilder.append(Constants.DIGITS.charAt((int) (remainingValue % radix)));
        remainingValue = remainingValue / radix;
    }

    // So am thi them dau - (them vao cuoi vi sap dao nguoc)
    if (value &lt; 0) {
        digitBuilder.append(Constants.MINUS);
    }

    // Dao nguoc 1 lan: so du tim ra sau cung la chu so dung dau
    return digitBuilder.reverse().toString();
}</code></pre>
<h4>Step 4 — view and controller</h4>
<pre class="trich"><code class="language-java">// Luu so vua nhap, doi he roi dua ket qua cho view in (1 lan cho 1 luong)
public void convert(ConvertRequestDTO convertRequestDTO) throws Exception {
    ConvertResponseDTO convertResponseDTO = null;

    // CRUD: luu so vua nhap vao kho
    baseNumberRepository.save(convertRequestDTO);

    // Nghiep vu: lay so vua luu, dua service doi sang he ra
    convertResponseDTO = convertService.convert(baseNumberRepository.findLast(),
            convertRequestDTO.getOutputBase());

    // Dua ket qua cho view roi in ra man hinh
    convertView.setConvertResponseDTO(convertResponseDTO);
    convertView.display();
}</code></pre>
<h4>Step 5 — Validation and Main</h4>
<pre class="trich"><code class="language-java">// Kiem moi chu so deu thuoc he (vd he 2 chi co 0 va 1)
public static void checkValue(String value, Base base) throws Exception {
    // Viet hoa de a-f cung hop le nhu A-F
    String digits = value.toUpperCase();

    // Co dau - hoac + o dau thi bo dau di
    if (digits.startsWith(Constants.MINUS) || digits.startsWith(Constants.PLUS)) {
        digits = digits.substring(1);
    }

    // Chi co dau ma khong co chu so thi bao loi
    if (digits.isEmpty()) {
        throw new Exception(String.format(Message.INVALID_VALUE, value, base.getLabel(),
                base.getLabel(), base.getAllowedDigits()));
    }

    // Kiem tung chu so
    for (int i = 0; i &lt; digits.length(); i++) {
        // Gia tri cua chu so (-1 neu khong phai chu so)
        int digitValue = Constants.DIGITS.indexOf(digits.charAt(i));

        // Khong phai chu so, hoac lon hon co so cho phep thi bao loi
        if ((digitValue &lt; 0) || (digitValue &gt;= base.getRadix())) {
            throw new Exception(String.format(Message.INVALID_VALUE, value, base.getLabel(),
                    base.getLabel(), base.getAllowedDigits()));
        }
    }
}</code></pre>
<pre class="trich"><code class="language-java">// Ham chay chuong trinh: lap menu den khi chon 0
public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    ConvertController convertController = new ConvertController();
    ConvertRequestDTO convertRequestDTO = null;
    int inputChoice = 0;

    // Lap lai cho den khi nguoi dung chon 0
    while (true) {
        System.out.println(Message.MENU);
        inputChoice = promptInputBase(scanner);

        // Chon 0 thi chao va thoat
        if (inputChoice == Constants.MENU_EXIT) {
            System.out.println(Message.GOODBYE);
            return;
        }

        // Tao phieu nhap: he vao, he ra, gia tri can doi
        convertRequestDTO = new ConvertRequestDTO();
        convertRequestDTO.setInputBase(Base.findByChoice(inputChoice));
        convertRequestDTO.setOutputBase(Base.findByChoice(promptOutputBase(scanner)));
        convertRequestDTO.setValue(promptValue(scanner));

        // Kiem chu so dung he roi doi; sai thi in loi va ve menu
        try {
            Validation.checkValue(convertRequestDTO.getValue(),
                    convertRequestDTO.getInputBase());
            convertController.convert(convertRequestDTO);
        } catch (Exception e) {
            // Sai chu so hoac so qua lon: in loi roi ve menu
            System.out.println(e.getMessage());
        }
    }
}</code></pre>
<div class="pitfall"><p>⚠️ Traps of this lab: (1) <code>Integer.parseInt(value, radix)</code> — correct, but it is not the algorithm the lab asks for; (2) <code>int</code> overflows at 2 147 483 647 — use <code>long</code> and check before multiplying; (3) building the result with <code>String +</code> in the loop (checklist 3.8); (4) forgetting the upper case: "ff" must work like "FF"; (5) printing in the controller instead of the view.</p></div>`,
    `<h2>3. Code, theo thứ tự gõ (model trước)</h2>
<h4>Bước 1 — enum và model</h4>
<pre class="trich"><code class="language-java">// Tim he co so theo so nguoi dung chon; khong co thi tra null
public static Base findByChoice(int choice) {
    // Duyet tung he, trung so chon thi tra ve he do
    for (Base base : values()) {
        // So chon khop thi day la he can tim
        if (base.menuChoice == choice) {
            return base;
        }
    }

    return null;
}</code></pre>
<pre class="trich"><code class="language-java">public class BaseNumber {

    // Gia tri nguoi dung nhap (dang chuoi, vd "1B")
    private String value;

    // He co so cua gia tri
    private Base base;

    // Constructor rong (JavaBean)
    public BaseNumber() {
    }

    // Constructor day du thuoc tinh
    public BaseNumber(String value, Base base) {
        this.value = value;
        this.base = base;
    }</code></pre>
<h4>Bước 2 — DTO và repository</h4>
<pre class="trich"><code class="language-java">// Luu so vua nhap vao lich su (doi phieu nhap thanh model BaseNumber)
public void save(ConvertRequestDTO convertRequestDTO) {
    BaseNumber baseNumber = new BaseNumber(convertRequestDTO.getValue(),
            convertRequestDTO.getInputBase());

    // Them vao cuoi danh sach
    baseNumberList.add(baseNumber);
}</code></pre>
<pre class="trich"><code class="language-java">// Lay so vua luu gan nhat (phan tu cuoi danh sach)
public BaseNumber findLast() {
    return baseNumberList.get(baseNumberList.size() - 1);
}</code></pre>
<h4>Bước 3 — service (hai thuật toán)</h4>
<pre class="trich"><code class="language-java">// Doi so da luu (baseNumber) sang he ra, tra ve phieu ket qua de View in
public ConvertResponseDTO convert(BaseNumber baseNumber, Base outputBase) throws Exception {
    long decimalValue = convertToDecimal(baseNumber.getValue(),
            baseNumber.getBase().getRadix());
    String outputValue = convertFromDecimal(decimalValue, outputBase.getRadix());

    // Gom gia tri vao/ra va nhan he thanh phieu ket qua
    return new ConvertResponseDTO(baseNumber.getValue(), baseNumber.getBase().getLabel(),
            outputValue, outputBase.getLabel());
}</code></pre>
<pre class="trich"><code class="language-java">// He bat ky -&gt; thap phan: ket qua = ket qua * co so + chu so (duyet trai sang phai)
private long convertToDecimal(String value, int radix) throws Exception {
    String digits = value.toUpperCase();
    boolean negative = digits.startsWith(Constants.MINUS);
    long result = 0;
    int digitValue = 0;

    // Bo dau - hoac + o dau truoc khi doi
    if (negative || digits.startsWith(Constants.PLUS)) {
        digits = digits.substring(1);
    }

    // Cong don tung chu so tu trai sang phai
    for (int i = 0; i &lt; digits.length(); i++) {
        digitValue = Constants.DIGITS.indexOf(digits.charAt(i));

        // Kiem TRUOC khi nhan de khong vuot qua so long lon nhat
        if (result &gt; ((Long.MAX_VALUE - digitValue) / radix)) {
            throw new Exception(Message.TOO_BIG);
        }

        // Day cac chu so cu len 1 bac roi cong chu so moi
        result = (result * radix) + digitValue;
    }

    // So am thi doi dau
    if (negative) {
        return -result;
    }

    return result;
}</code></pre>
<pre class="trich"><code class="language-java">// Thap phan -&gt; he bat ky: chia lay du cho co so, doc so du tu duoi len
private String convertFromDecimal(long value, int radix) {
    long remainingValue = Math.abs(value);
    StringBuilder digitBuilder = new StringBuilder();

    // So 0 thi tra ve "0" luon
    if (value == 0) {
        return Constants.ZERO;
    }

    // Chia lien tiep; moi so du la 1 chu so, tim ra tu hang don vi
    while (remainingValue &gt; 0) {
        digitBuilder.append(Constants.DIGITS.charAt((int) (remainingValue % radix)));
        remainingValue = remainingValue / radix;
    }

    // So am thi them dau - (them vao cuoi vi sap dao nguoc)
    if (value &lt; 0) {
        digitBuilder.append(Constants.MINUS);
    }

    // Dao nguoc 1 lan: so du tim ra sau cung la chu so dung dau
    return digitBuilder.reverse().toString();
}</code></pre>
<h4>Bước 4 — view và controller</h4>
<pre class="trich"><code class="language-java">// Luu so vua nhap, doi he roi dua ket qua cho view in (1 lan cho 1 luong)
public void convert(ConvertRequestDTO convertRequestDTO) throws Exception {
    ConvertResponseDTO convertResponseDTO = null;

    // CRUD: luu so vua nhap vao kho
    baseNumberRepository.save(convertRequestDTO);

    // Nghiep vu: lay so vua luu, dua service doi sang he ra
    convertResponseDTO = convertService.convert(baseNumberRepository.findLast(),
            convertRequestDTO.getOutputBase());

    // Dua ket qua cho view roi in ra man hinh
    convertView.setConvertResponseDTO(convertResponseDTO);
    convertView.display();
}</code></pre>
<h4>Bước 5 — Validation và Main</h4>
<pre class="trich"><code class="language-java">// Kiem moi chu so deu thuoc he (vd he 2 chi co 0 va 1)
public static void checkValue(String value, Base base) throws Exception {
    // Viet hoa de a-f cung hop le nhu A-F
    String digits = value.toUpperCase();

    // Co dau - hoac + o dau thi bo dau di
    if (digits.startsWith(Constants.MINUS) || digits.startsWith(Constants.PLUS)) {
        digits = digits.substring(1);
    }

    // Chi co dau ma khong co chu so thi bao loi
    if (digits.isEmpty()) {
        throw new Exception(String.format(Message.INVALID_VALUE, value, base.getLabel(),
                base.getLabel(), base.getAllowedDigits()));
    }

    // Kiem tung chu so
    for (int i = 0; i &lt; digits.length(); i++) {
        // Gia tri cua chu so (-1 neu khong phai chu so)
        int digitValue = Constants.DIGITS.indexOf(digits.charAt(i));

        // Khong phai chu so, hoac lon hon co so cho phep thi bao loi
        if ((digitValue &lt; 0) || (digitValue &gt;= base.getRadix())) {
            throw new Exception(String.format(Message.INVALID_VALUE, value, base.getLabel(),
                    base.getLabel(), base.getAllowedDigits()));
        }
    }
}</code></pre>
<pre class="trich"><code class="language-java">// Ham chay chuong trinh: lap menu den khi chon 0
public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    ConvertController convertController = new ConvertController();
    ConvertRequestDTO convertRequestDTO = null;
    int inputChoice = 0;

    // Lap lai cho den khi nguoi dung chon 0
    while (true) {
        System.out.println(Message.MENU);
        inputChoice = promptInputBase(scanner);

        // Chon 0 thi chao va thoat
        if (inputChoice == Constants.MENU_EXIT) {
            System.out.println(Message.GOODBYE);
            return;
        }

        // Tao phieu nhap: he vao, he ra, gia tri can doi
        convertRequestDTO = new ConvertRequestDTO();
        convertRequestDTO.setInputBase(Base.findByChoice(inputChoice));
        convertRequestDTO.setOutputBase(Base.findByChoice(promptOutputBase(scanner)));
        convertRequestDTO.setValue(promptValue(scanner));

        // Kiem chu so dung he roi doi; sai thi in loi va ve menu
        try {
            Validation.checkValue(convertRequestDTO.getValue(),
                    convertRequestDTO.getInputBase());
            convertController.convert(convertRequestDTO);
        } catch (Exception e) {
            // Sai chu so hoac so qua lon: in loi roi ve menu
            System.out.println(e.getMessage());
        }
    }
}</code></pre>
<div class="pitfall"><p>⚠️ Bẫy của bài: (1) <code>Integer.parseInt(value, radix)</code> — đúng kết quả, nhưng không phải thuật toán bài muốn; (2) <code>int</code> tràn ở 2 147 483 647 — dùng <code>long</code> và kiểm trước khi nhân; (3) ghép kết quả bằng <code>String +</code> trong vòng lặp (checklist 3.8); (4) quên viết hoa: "ff" phải chạy như "FF"; (5) in ở controller thay vì ở view.</p></div>`),
    bi(`<h2>4. Run it for real</h2>
<p>The test keys (<code>harness/input.txt</code>): a letter and 5 at the menu, the four examples of the brief, "1G" in HEX, "2" in BIN, an empty value then 0, −27, "ff", "007", 65 binary ones, then 0.</p>
<details><summary>The whole run (87 lines)</summary>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">======= CHANGE BASE NUMBER SYSTEM =======<br>
1. Binary (base 2)<br>
2. Decimal (base 10)<br>
3. Hexadecimal (base 16)<br>
0. Exit<br>
=========================================<br>
Choose the INPUT base: Ban phai nhap 1 so nguyen (vi du: 1, 2, 3), khong nhap chu hay de trong. Moi nhap lai.<br>
Choose the INPUT base: Lua chon nam ngoai khoang cho phep. Hay nhap 1 so tu 0 den 3. Moi nhap lai.<br>
Choose the INPUT base: Choose the OUTPUT base: Enter the input value: 535 (DEC) = 217 (HEX)<br>
======= CHANGE BASE NUMBER SYSTEM =======<br>
1. Binary (base 2)<br>
2. Decimal (base 10)<br>
3. Hexadecimal (base 16)<br>
0. Exit<br>
=========================================<br>
Choose the INPUT base: Choose the OUTPUT base: Enter the input value: 217 (HEX) = 535 (DEC)<br>
======= CHANGE BASE NUMBER SYSTEM =======<br>
1. Binary (base 2)<br>
2. Decimal (base 10)<br>
3. Hexadecimal (base 16)<br>
0. Exit<br>
=========================================<br>
Choose the INPUT base: Choose the OUTPUT base: Enter the input value: 27 (DEC) = 11011 (BIN)<br>
======= CHANGE BASE NUMBER SYSTEM =======<br>
1. Binary (base 2)<br>
2. Decimal (base 10)<br>
3. Hexadecimal (base 16)<br>
0. Exit<br>
=========================================<br>
Choose the INPUT base: Choose the OUTPUT base: Enter the input value: 11011 (BIN) = 27 (DEC)<br>
======= CHANGE BASE NUMBER SYSTEM =======<br>
1. Binary (base 2)<br>
2. Decimal (base 10)<br>
3. Hexadecimal (base 16)<br>
0. Exit<br>
=========================================<br>
Choose the INPUT base: Choose the OUTPUT base: Enter the input value: "1G" khong phai so he HEX hop le. He HEX chi dung cac chu so: 0123456789ABCDEF. Moi chon lai tu menu.<br>
======= CHANGE BASE NUMBER SYSTEM =======<br>
1. Binary (base 2)<br>
2. Decimal (base 10)<br>
3. Hexadecimal (base 16)<br>
0. Exit<br>
=========================================<br>
Choose the INPUT base: Choose the OUTPUT base: Enter the input value: "2" khong phai so he BIN hop le. He BIN chi dung cac chu so: 01. Moi chon lai tu menu.<br>
======= CHANGE BASE NUMBER SYSTEM =======<br>
1. Binary (base 2)<br>
2. Decimal (base 10)<br>
3. Hexadecimal (base 16)<br>
0. Exit<br>
=========================================<br>
Choose the INPUT base: Choose the OUTPUT base: Enter the input value: Gia tri can doi khong duoc de trong. Hay nhap 1 so (vi du: 1010, 255, FF). Moi nhap lai.<br>
Enter the input value: 0 (DEC) = 0 (BIN)<br>
======= CHANGE BASE NUMBER SYSTEM =======<br>
1. Binary (base 2)<br>
2. Decimal (base 10)<br>
3. Hexadecimal (base 16)<br>
0. Exit<br>
=========================================<br>
Choose the INPUT base: Choose the OUTPUT base: Enter the input value: -27 (DEC) = -11011 (BIN)<br>
======= CHANGE BASE NUMBER SYSTEM =======<br>
1. Binary (base 2)<br>
2. Decimal (base 10)<br>
3. Hexadecimal (base 16)<br>
0. Exit<br>
=========================================<br>
Choose the INPUT base: Choose the OUTPUT base: Enter the input value: ff (HEX) = 11111111 (BIN)<br>
======= CHANGE BASE NUMBER SYSTEM =======<br>
1. Binary (base 2)<br>
2. Decimal (base 10)<br>
3. Hexadecimal (base 16)<br>
0. Exit<br>
=========================================<br>
Choose the INPUT base: Choose the OUTPUT base: Enter the input value: 007 (DEC) = 7 (DEC)<br>
======= CHANGE BASE NUMBER SYSTEM =======<br>
1. Binary (base 2)<br>
2. Decimal (base 10)<br>
3. Hexadecimal (base 16)<br>
0. Exit<br>
=========================================<br>
Choose the INPUT base: Choose the OUTPUT base: Enter the input value: So qua lon, chuong trinh chi doi duoc so toi da 9223372036854775807 (he 10). Hay nhap so nho hon.<br>
======= CHANGE BASE NUMBER SYSTEM =======<br>
1. Binary (base 2)<br>
2. Decimal (base 10)<br>
3. Hexadecimal (base 16)<br>
0. Exit<br>
=========================================<br>
Choose the INPUT base: Goodbye.</div>
</details>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Choose the INPUT base: Ban phai nhap 1 so nguyen (vi du: 1, 2, 3), khong nhap chu hay de trong. Moi nhap lai.<br>
Choose the INPUT base: Lua chon nam ngoai khoang cho phep. Hay nhap 1 so tu 0 den 3. Moi nhap lai.<br>
Choose the INPUT base: Choose the OUTPUT base: Enter the input value: 535 (DEC) = 217 (HEX)<br>
…</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Choose the INPUT base: Choose the OUTPUT base: Enter the input value: "1G" khong phai so he HEX hop le. He HEX chi dung cac chu so: 0123456789ABCDEF. Moi chon lai tu menu.<br>
…</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Choose the INPUT base: Choose the OUTPUT base: Enter the input value: So qua lon, chuong trinh chi doi duoc so toi da 9223372036854775807 (he 10). Hay nhap so nho hon.<br>
…</div>
<pre><code class="language-bash">$ python3 lint.py MSSV_J1SP0011_ChangeBaseNumber</code></pre>
<div class="out">✓ MSSV_J1SP0011_ChangeBaseNumber — sạch</div>
<pre><code class="language-bash">$ ./check.sh        # Windows: check.bat · NetBeans: Run File on test/harness/CheckHarness.java</code></pre>
<div class="out">PASS: 87/87 dong khop expected.txt</div>
<p>On a real JDK 8 (the lab machines): the same 87 lines. The paper checklist audit: 0 violations.</p>
<h2>5. Before / after — the version the lecturer rejected</h2>
<p>The first submitted version, student code removed. The service created and held the repository:</p>
<pre class="trich"><code class="language-java">public class ConvertService {

    // Kho luu cac so da nhap
    private BaseNumberRepository baseNumberRepository;

    // Constructor: tao repository
    public ConvertService() {
        baseNumberRepository = new BaseNumberRepository();
    }

    // Doi gia tri tu he vao sang he ra: he vao -&gt; thap phan -&gt; he ra
    public ConvertResponseDTO convert(ConvertRequestDTO convertRequestDTO) throws Exception {
        baseNumberRepository.save(new BaseNumber(convertRequestDTO.getValue(),
                convertRequestDTO.getInputBase()));
        BaseNumber baseNumber = baseNumberRepository.findLast();
        long decimalValue = convertToDecimal(baseNumber.getValue(),
                baseNumber.getBase().getRadix());
        String outputValue = convertFromDecimal(decimalValue,
                convertRequestDTO.getOutputBase().getRadix());
        return new ConvertResponseDTO(baseNumber.getValue(), baseNumber.getBase().getLabel(),
                outputValue, convertRequestDTO.getOutputBase().getLabel());
    }</code></pre>
<p>After the fix the service imports no repository and receives the stored number; the CRUD moved to the controller (step 4 above). The old version also fails the lecturer's tool:</p>
<pre><code class="language-bash">$ python3 lint.py MSSV_J1SP0011_ChangeBaseNumber</code></pre>
<div class="out">✗ MSSV_J1SP0011_ChangeBaseNumber — 15 vi phạm<br>
&nbsp;&nbsp;[COMMENT] src/constants/Base.java:3 — enum Base thiếu Javadoc đầu lớp<br>
&nbsp;&nbsp;[COMMENT] src/constants/Constants.java:3 — class Constants thiếu Javadoc đầu lớp<br>
&nbsp;&nbsp;[COMMENT] src/constants/Message.java:3 — class Message thiếu Javadoc đầu lớp<br>
&nbsp;&nbsp;[COMMENT] src/controller/ConvertController.java:8 — class ConvertController thiếu Javadoc đầu lớp<br>
&nbsp;&nbsp;[COMMENT] src/dto/ConvertRequestDTO.java:5 — class ConvertRequestDTO thiếu Javadoc đầu lớp<br>
&nbsp;&nbsp;[COMMENT] src/dto/ConvertResponseDTO.java:5 — class ConvertResponseDTO thiếu Javadoc đầu lớp<br>
&nbsp;&nbsp;[JAVABEAN] src/dto/ConvertResponseDTO.java:1 — lớp ConvertResponseDTO thiếu constructor rỗng public (JavaBean — MVC JSP)<br>
&nbsp;&nbsp;[COMMENT] src/main/Main.java:11 — class Main thiếu Javadoc đầu lớp<br>
&nbsp;&nbsp;[COMMENT] src/model/BaseNumber.java:5 — class BaseNumber thiếu Javadoc đầu lớp<br>
&nbsp;&nbsp;[JAVABEAN] src/model/BaseNumber.java:1 — lớp BaseNumber thiếu constructor rỗng public (JavaBean — MVC JSP)<br>
&nbsp;&nbsp;[COMMENT] src/repository/BaseNumberRepository.java:7 — class BaseNumberRepository thiếu Javadoc đầu lớp<br>
&nbsp;&nbsp;[COLLECTION] src/repository/BaseNumberRepository.java:10 — dùng kiểu cụ thể ArrayList/HashMap/LinkedHashMap (thầy: List/Map là dấu hiệu AI) — chỉ giữ List/Map khi đề bắt, kèm comment '// brief: ...'<br>
&nbsp;&nbsp;[COMMENT] src/service/ConvertService.java:10 — class ConvertService thiếu Javadoc đầu lớp<br>
&nbsp;&nbsp;[COMMENT] src/utils/Validation.java:7 — class Validation thiếu Javadoc đầu lớp<br>
&nbsp;&nbsp;[COMMENT] src/view/ConvertView.java:5 — class ConvertView thiếu Javadoc đầu lớp</div>
<p>And its messages said nothing useful — the same keys, old version then fixed version:</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Choose the INPUT base: You must input a number.<br>
Choose the INPUT base: Please choose from 0 to 3.<br>
…</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Choose the INPUT base: Ban phai nhap 1 so nguyen (vi du: 1, 2, 3), khong nhap chu hay de trong. Moi nhap lai.<br>
Choose the INPUT base: Lua chon nam ngoai khoang cho phep. Hay nhap 1 so tu 0 den 3. Moi nhap lai.<br>
…</div>
<table>
<thead><tr><th>Before</th><th>After</th><th>Checklist row</th></tr></thead>
<tbody>
<tr><td>service holds and calls the repository</td><td>controller holds the repository, service only converts</td><td>1.1 (lecturer, 26/10)</td></tr>
<tr><td><code>result = digit + result</code> in a loop</td><td><code>StringBuilder.append</code> + one <code>reverse()</code></td><td>3.8</td></tr>
<tr><td>no Javadoc on any class — and the first fix then put a comment on every line with no blank line before it (26 rows of 2.8)</td><td>Javadoc on every class, one comment per block, a blank line before it</td><td>1.6, 2.8</td></tr>
<tr><td><code>List&lt;BaseNumber&gt;</code></td><td><code>ArrayList&lt;BaseNumber&gt; baseNumberList</code></td><td>V5, 1.5</td></tr>
<tr><td><code>BaseNumber</code>, <code>ConvertResponseDTO</code> without empty constructor</td><td>JavaBeans</td><td>V10</td></tr>
<tr><td>"You must input a number."</td><td>"Ban phai nhap 1 so nguyen (vi du: 1, 2, 3)… Moi nhap lai."</td><td>lecturer, 05/10</td></tr>
<tr><td>variables declared in the middle of <code>main</code></td><td>declared at the top, then a blank line</td><td>2.6, 2.8</td></tr>
</tbody>
</table>`,
    `<h2>4. Chạy thật</h2>
<p>Bộ phím test (<code>harness/input.txt</code>): một chữ cái và số 5 ở menu, bốn ví dụ của đề, "1G" ở HEX, "2" ở BIN, giá trị trống rồi 0, −27, "ff", "007", 65 chữ số 1 nhị phân, rồi 0.</p>
<details><summary>Toàn bộ lần chạy (87 dòng)</summary>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">======= CHANGE BASE NUMBER SYSTEM =======<br>
1. Binary (base 2)<br>
2. Decimal (base 10)<br>
3. Hexadecimal (base 16)<br>
0. Exit<br>
=========================================<br>
Choose the INPUT base: Ban phai nhap 1 so nguyen (vi du: 1, 2, 3), khong nhap chu hay de trong. Moi nhap lai.<br>
Choose the INPUT base: Lua chon nam ngoai khoang cho phep. Hay nhap 1 so tu 0 den 3. Moi nhap lai.<br>
Choose the INPUT base: Choose the OUTPUT base: Enter the input value: 535 (DEC) = 217 (HEX)<br>
======= CHANGE BASE NUMBER SYSTEM =======<br>
1. Binary (base 2)<br>
2. Decimal (base 10)<br>
3. Hexadecimal (base 16)<br>
0. Exit<br>
=========================================<br>
Choose the INPUT base: Choose the OUTPUT base: Enter the input value: 217 (HEX) = 535 (DEC)<br>
======= CHANGE BASE NUMBER SYSTEM =======<br>
1. Binary (base 2)<br>
2. Decimal (base 10)<br>
3. Hexadecimal (base 16)<br>
0. Exit<br>
=========================================<br>
Choose the INPUT base: Choose the OUTPUT base: Enter the input value: 27 (DEC) = 11011 (BIN)<br>
======= CHANGE BASE NUMBER SYSTEM =======<br>
1. Binary (base 2)<br>
2. Decimal (base 10)<br>
3. Hexadecimal (base 16)<br>
0. Exit<br>
=========================================<br>
Choose the INPUT base: Choose the OUTPUT base: Enter the input value: 11011 (BIN) = 27 (DEC)<br>
======= CHANGE BASE NUMBER SYSTEM =======<br>
1. Binary (base 2)<br>
2. Decimal (base 10)<br>
3. Hexadecimal (base 16)<br>
0. Exit<br>
=========================================<br>
Choose the INPUT base: Choose the OUTPUT base: Enter the input value: "1G" khong phai so he HEX hop le. He HEX chi dung cac chu so: 0123456789ABCDEF. Moi chon lai tu menu.<br>
======= CHANGE BASE NUMBER SYSTEM =======<br>
1. Binary (base 2)<br>
2. Decimal (base 10)<br>
3. Hexadecimal (base 16)<br>
0. Exit<br>
=========================================<br>
Choose the INPUT base: Choose the OUTPUT base: Enter the input value: "2" khong phai so he BIN hop le. He BIN chi dung cac chu so: 01. Moi chon lai tu menu.<br>
======= CHANGE BASE NUMBER SYSTEM =======<br>
1. Binary (base 2)<br>
2. Decimal (base 10)<br>
3. Hexadecimal (base 16)<br>
0. Exit<br>
=========================================<br>
Choose the INPUT base: Choose the OUTPUT base: Enter the input value: Gia tri can doi khong duoc de trong. Hay nhap 1 so (vi du: 1010, 255, FF). Moi nhap lai.<br>
Enter the input value: 0 (DEC) = 0 (BIN)<br>
======= CHANGE BASE NUMBER SYSTEM =======<br>
1. Binary (base 2)<br>
2. Decimal (base 10)<br>
3. Hexadecimal (base 16)<br>
0. Exit<br>
=========================================<br>
Choose the INPUT base: Choose the OUTPUT base: Enter the input value: -27 (DEC) = -11011 (BIN)<br>
======= CHANGE BASE NUMBER SYSTEM =======<br>
1. Binary (base 2)<br>
2. Decimal (base 10)<br>
3. Hexadecimal (base 16)<br>
0. Exit<br>
=========================================<br>
Choose the INPUT base: Choose the OUTPUT base: Enter the input value: ff (HEX) = 11111111 (BIN)<br>
======= CHANGE BASE NUMBER SYSTEM =======<br>
1. Binary (base 2)<br>
2. Decimal (base 10)<br>
3. Hexadecimal (base 16)<br>
0. Exit<br>
=========================================<br>
Choose the INPUT base: Choose the OUTPUT base: Enter the input value: 007 (DEC) = 7 (DEC)<br>
======= CHANGE BASE NUMBER SYSTEM =======<br>
1. Binary (base 2)<br>
2. Decimal (base 10)<br>
3. Hexadecimal (base 16)<br>
0. Exit<br>
=========================================<br>
Choose the INPUT base: Choose the OUTPUT base: Enter the input value: So qua lon, chuong trinh chi doi duoc so toi da 9223372036854775807 (he 10). Hay nhap so nho hon.<br>
======= CHANGE BASE NUMBER SYSTEM =======<br>
1. Binary (base 2)<br>
2. Decimal (base 10)<br>
3. Hexadecimal (base 16)<br>
0. Exit<br>
=========================================<br>
Choose the INPUT base: Goodbye.</div>
</details>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Choose the INPUT base: Ban phai nhap 1 so nguyen (vi du: 1, 2, 3), khong nhap chu hay de trong. Moi nhap lai.<br>
Choose the INPUT base: Lua chon nam ngoai khoang cho phep. Hay nhap 1 so tu 0 den 3. Moi nhap lai.<br>
Choose the INPUT base: Choose the OUTPUT base: Enter the input value: 535 (DEC) = 217 (HEX)<br>
…</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Choose the INPUT base: Choose the OUTPUT base: Enter the input value: "1G" khong phai so he HEX hop le. He HEX chi dung cac chu so: 0123456789ABCDEF. Moi chon lai tu menu.<br>
…</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Choose the INPUT base: Choose the OUTPUT base: Enter the input value: So qua lon, chuong trinh chi doi duoc so toi da 9223372036854775807 (he 10). Hay nhap so nho hon.<br>
…</div>
<pre><code class="language-bash">$ python3 lint.py MSSV_J1SP0011_ChangeBaseNumber</code></pre>
<div class="out">✓ MSSV_J1SP0011_ChangeBaseNumber — sạch</div>
<pre><code class="language-bash">$ ./check.sh        # Windows: check.bat · NetBeans: Run File on test/harness/CheckHarness.java</code></pre>
<div class="out">PASS: 87/87 dong khop expected.txt</div>
<p>Trên JDK 8 thật (máy phòng lab): đúng 87 dòng đó. Soát tờ checklist giấy: 0 vi phạm.</p>
<h2>5. Trước / sau — bản thầy đã trả lại</h2>
<p>Bản nộp đầu tiên, đã bỏ mã sinh viên. Service tự tạo và giữ repository:</p>
<pre class="trich"><code class="language-java">public class ConvertService {

    // Kho luu cac so da nhap
    private BaseNumberRepository baseNumberRepository;

    // Constructor: tao repository
    public ConvertService() {
        baseNumberRepository = new BaseNumberRepository();
    }

    // Doi gia tri tu he vao sang he ra: he vao -&gt; thap phan -&gt; he ra
    public ConvertResponseDTO convert(ConvertRequestDTO convertRequestDTO) throws Exception {
        baseNumberRepository.save(new BaseNumber(convertRequestDTO.getValue(),
                convertRequestDTO.getInputBase()));
        BaseNumber baseNumber = baseNumberRepository.findLast();
        long decimalValue = convertToDecimal(baseNumber.getValue(),
                baseNumber.getBase().getRadix());
        String outputValue = convertFromDecimal(decimalValue,
                convertRequestDTO.getOutputBase().getRadix());
        return new ConvertResponseDTO(baseNumber.getValue(), baseNumber.getBase().getLabel(),
                outputValue, convertRequestDTO.getOutputBase().getLabel());
    }</code></pre>
<p>Sau khi sửa, service không import repository mà nhận con số đã lưu; CRUD chuyển sang controller (bước 4 ở trên). Bản cũ còn trượt cả công cụ kiểm luật của thầy:</p>
<pre><code class="language-bash">$ python3 lint.py MSSV_J1SP0011_ChangeBaseNumber</code></pre>
<div class="out">✗ MSSV_J1SP0011_ChangeBaseNumber — 15 vi phạm<br>
&nbsp;&nbsp;[COMMENT] src/constants/Base.java:3 — enum Base thiếu Javadoc đầu lớp<br>
&nbsp;&nbsp;[COMMENT] src/constants/Constants.java:3 — class Constants thiếu Javadoc đầu lớp<br>
&nbsp;&nbsp;[COMMENT] src/constants/Message.java:3 — class Message thiếu Javadoc đầu lớp<br>
&nbsp;&nbsp;[COMMENT] src/controller/ConvertController.java:8 — class ConvertController thiếu Javadoc đầu lớp<br>
&nbsp;&nbsp;[COMMENT] src/dto/ConvertRequestDTO.java:5 — class ConvertRequestDTO thiếu Javadoc đầu lớp<br>
&nbsp;&nbsp;[COMMENT] src/dto/ConvertResponseDTO.java:5 — class ConvertResponseDTO thiếu Javadoc đầu lớp<br>
&nbsp;&nbsp;[JAVABEAN] src/dto/ConvertResponseDTO.java:1 — lớp ConvertResponseDTO thiếu constructor rỗng public (JavaBean — MVC JSP)<br>
&nbsp;&nbsp;[COMMENT] src/main/Main.java:11 — class Main thiếu Javadoc đầu lớp<br>
&nbsp;&nbsp;[COMMENT] src/model/BaseNumber.java:5 — class BaseNumber thiếu Javadoc đầu lớp<br>
&nbsp;&nbsp;[JAVABEAN] src/model/BaseNumber.java:1 — lớp BaseNumber thiếu constructor rỗng public (JavaBean — MVC JSP)<br>
&nbsp;&nbsp;[COMMENT] src/repository/BaseNumberRepository.java:7 — class BaseNumberRepository thiếu Javadoc đầu lớp<br>
&nbsp;&nbsp;[COLLECTION] src/repository/BaseNumberRepository.java:10 — dùng kiểu cụ thể ArrayList/HashMap/LinkedHashMap (thầy: List/Map là dấu hiệu AI) — chỉ giữ List/Map khi đề bắt, kèm comment '// brief: ...'<br>
&nbsp;&nbsp;[COMMENT] src/service/ConvertService.java:10 — class ConvertService thiếu Javadoc đầu lớp<br>
&nbsp;&nbsp;[COMMENT] src/utils/Validation.java:7 — class Validation thiếu Javadoc đầu lớp<br>
&nbsp;&nbsp;[COMMENT] src/view/ConvertView.java:5 — class ConvertView thiếu Javadoc đầu lớp</div>
<p>Và câu báo của nó chẳng nói được gì — cùng bộ phím, bản cũ rồi bản đã sửa:</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Choose the INPUT base: You must input a number.<br>
Choose the INPUT base: Please choose from 0 to 3.<br>
…</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Choose the INPUT base: Ban phai nhap 1 so nguyen (vi du: 1, 2, 3), khong nhap chu hay de trong. Moi nhap lai.<br>
Choose the INPUT base: Lua chon nam ngoai khoang cho phep. Hay nhap 1 so tu 0 den 3. Moi nhap lai.<br>
…</div>
<table>
<thead><tr><th>Trước</th><th>Sau</th><th>Dòng checklist</th></tr></thead>
<tbody>
<tr><td>service giữ và gọi repository</td><td>controller giữ repository, service chỉ đổi hệ</td><td>1.1 (thầy, 26/10)</td></tr>
<tr><td><code>result = digit + result</code> trong vòng lặp</td><td><code>StringBuilder.append</code> + một lần <code>reverse()</code></td><td>3.8</td></tr>
<tr><td>không lớp nào có Javadoc — rồi bản sửa đầu lại comment từng dòng mà không có dòng trống phía trước (26 lần trượt mục 2.8)</td><td>Javadoc mọi lớp, một comment mỗi khối, có dòng trống phía trước</td><td>1.6, 2.8</td></tr>
<tr><td><code>List&lt;BaseNumber&gt;</code></td><td><code>ArrayList&lt;BaseNumber&gt; baseNumberList</code></td><td>V5, 1.5</td></tr>
<tr><td><code>BaseNumber</code>, <code>ConvertResponseDTO</code> thiếu constructor rỗng</td><td>JavaBean</td><td>V10</td></tr>
<tr><td>"You must input a number."</td><td>"Ban phai nhap 1 so nguyen (vi du: 1, 2, 3)… Moi nhap lai."</td><td>thầy, 05/10</td></tr>
<tr><td>khai báo biến giữa thân <code>main</code></td><td>khai báo ở đầu, rồi một dòng trống</td><td>2.6, 2.8</td></tr>
</tbody>
</table>`),
    bi(`<h2>6. Debug it (gate 4)</h2>
<p>Breakpoint on <code>result = (result * radix) + digitValue;</code> in <code>convertToDecimal</code> → Ctrl+F5 → choose 3, 2, type <code>217</code> → in Variables watch <code>result</code> go 0 → 2 → 33 → 535 while <code>digitValue</code> is 2, 1, 7. Then a breakpoint on the <code>append</code> of <code>convertFromDecimal</code> with 2, 3, 535: <code>digitBuilder</code> becomes "7", "71", "712" — then <code>reverse()</code>.</p>
<h2>7. The questions — answer out loud</h2>
<details><summary>Why does the service not call the repository?</summary><p class="dap-an">✅ The service only does the business work (converting). Saving and reading data is the repository's job; the controller directs: it calls the repository, then the service. If storage changes to a file or a database, only the repository changes — the S of SOLID.</p></details>
<details><summary>Why does the controller not import model?</summary><p class="dap-an">✅ The Guide forbids it. The controller gives the DTO to the repository (<code>save(dto)</code>), the repository builds the <code>BaseNumber</code>; the controller passes <code>findLast()</code> straight to the service without naming its type.</p></details>
<details><summary>An algorithm lab — why a repository at all?</summary><p class="dap-an">✅ The paper checklist, row 1.1: "Bắt buộc phải có repository". Here it keeps the history of the numbers typed, which also makes "show the history" a one-method addition.</p></details>
<details><summary>How does 535 become 217 in HEX?</summary><p class="dap-an">✅ 535 ÷ 16 = 33 r 7; 33 ÷ 16 = 2 r 1; 2 ÷ 16 = 0 r 2; read the remainders upward: 2, 1, 7. In the code they are appended as "712" and reversed once.</p></details>
<details><summary>Why long, and what happens with a huge number?</summary><p class="dap-an">✅ <code>int</code> stops at 2 147 483 647 — 32 binary digits already overflow it. With <code>long</code> and a check before each multiplication, a too-big value gives the message "So qua lon…" instead of a wrong negative result.</p></details>
<details><summary>Why is Base an enum in constants?</summary><p class="dap-an">✅ The three bases are fixed values with data (menu number, radix, label). The Guide puts constants and enums in <code>constants</code>. An enum also prevents an invalid base: <code>findByChoice</code> can only return one of the three.</p></details>
<details><summary>Add base 8 — which files change?</summary><p class="dap-an">✅ <code>Base</code> (one constant <code>OCTAL(4, 8, "OCT")</code>), <code>Constants.BASE_MAX</code> = 4, <code>Message.MENU</code>. Not the service: both algorithms take the radix as a parameter (Open/Closed).</p></details>
<h2>8. Download</h2>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/lab211/v1/MSSV_J1SP0011_ChangeBaseNumber-solution.zip" target="_blank" rel="noopener">
<span class="lc-ico">✅</span>
<span class="lc-body"><span class="lc-title">MSSV_J1SP0011_ChangeBaseNumber-solution.zip</span><span class="lc-sub">NetBeans project (Java 8) · 12 files · harness/input.txt (test keys) · check.sh / check.bat — study it, then type it yourself</span></span>
<span class="lc-cta">Download</span>
</a>
<div class="callout"><p><strong>Next:</strong> J1.L.P0021 Student Management — a long assignment (350 LOC) with a real service: Comparator, a report with LinkedHashMap, and the same rule — the controller holds the repository.</p></div>`,
    `<h2>6. Debug (cửa 4)</h2>
<p>Breakpoint ở <code>result = (result * radix) + digitValue;</code> trong <code>convertToDecimal</code> → Ctrl+F5 → chọn 3, 2, gõ <code>217</code> → ở tab Variables nhìn <code>result</code> đi 0 → 2 → 33 → 535 trong khi <code>digitValue</code> là 2, 1, 7. Rồi breakpoint ở dòng <code>append</code> của <code>convertFromDecimal</code> với 2, 3, 535: <code>digitBuilder</code> thành "7", "71", "712" — rồi <code>reverse()</code>.</p>
<h2>7. Câu thầy hỏi — trả lời thành tiếng</h2>
<details><summary>Sao service không gọi repository?</summary><p class="dap-an">✅ Service chỉ lo nghiệp vụ (đổi hệ). Lưu/đọc dữ liệu là việc của repository; controller điều phối: gọi repository rồi gọi service. Đổi cách lưu sang tệp hay cơ sở dữ liệu thì chỉ sửa repository — chữ S trong SOLID.</p></details>
<details><summary>Sao controller không import model?</summary><p class="dap-an">✅ Guide cấm. Controller đưa DTO cho repository (<code>save(dto)</code>), repository tự dựng <code>BaseNumber</code>; controller chuyển thẳng <code>findLast()</code> sang service mà không cần gọi tên kiểu của nó.</p></details>
<details><summary>Bài thuật toán sao lại có repository?</summary><p class="dap-an">✅ Tờ checklist giấy, dòng 1.1: "Bắt buộc phải có repository". Ở đây nó giữ lịch sử các số đã nhập — muốn thêm chức năng "xem lịch sử" chỉ cần thêm một hàm.</p></details>
<details><summary>535 thành 217 ở HEX thế nào?</summary><p class="dap-an">✅ 535 ÷ 16 = 33 dư 7; 33 ÷ 16 = 2 dư 1; 2 ÷ 16 = 0 dư 2; đọc số dư từ dưới lên: 2, 1, 7. Trong code chúng được ghép thành "712" rồi đảo một lần.</p></details>
<details><summary>Sao dùng long, số cực lớn thì sao?</summary><p class="dap-an">✅ <code>int</code> dừng ở 2 147 483 647 — 32 chữ số nhị phân đã tràn. Dùng <code>long</code> và kiểm trước mỗi phép nhân thì số quá lớn ra câu "So qua lon…" thay vì một kết quả âm sai.</p></details>
<details><summary>Sao Base là enum nằm trong constants?</summary><p class="dap-an">✅ Ba hệ là giá trị cố định có kèm dữ liệu (số chọn, cơ số, nhãn). Guide đặt hằng số và enum trong <code>constants</code>. Enum còn chặn hệ không hợp lệ: <code>findByChoice</code> chỉ trả về một trong ba.</p></details>
<details><summary>Thêm hệ 8 thì sửa tệp nào?</summary><p class="dap-an">✅ <code>Base</code> (một hằng <code>OCTAL(4, 8, "OCT")</code>), <code>Constants.BASE_MAX</code> = 4, <code>Message.MENU</code>. Không sửa service: cả hai thuật toán nhận cơ số làm tham số (Open/Closed).</p></details>
<h2>8. Tệp tải về</h2>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/lab211/v1/MSSV_J1SP0011_ChangeBaseNumber-solution.zip" target="_blank" rel="noopener">
<span class="lc-ico">✅</span>
<span class="lc-body"><span class="lc-title">MSSV_J1SP0011_ChangeBaseNumber-solution.zip</span><span class="lc-sub">project NetBeans (Java 8) · 12 tệp · harness/input.txt (phím test) · check.sh / check.bat — đọc hiểu, rồi tự gõ lại</span></span>
<span class="lc-cta">Tải về</span>
</a>
<div class="callout"><p><strong>Tiếp theo:</strong> J1.L.P0021 Student Management — bài dài (350 LOC) có service thật sự: Comparator, báo cáo bằng LinkedHashMap, và cùng một luật — controller giữ repository.</p></div>`),
  ].join('\n'),
};

/* ───────── L.2 — 🎓 LAB211 J1.L.P0021 Student Management (350 LOC): Comparator, report, update/delete, a service without repository ───────── */
const L_l211_p0021 = {
  title: 'L.2 — 🎓 LAB211 J1.L.P0021 Student Management (350 LOC): Comparator, report, update/delete, a service without repository|||L.2 — 🎓 LAB211 J1.L.P0021 Quản lý sinh viên (350 LOC): Comparator, báo cáo, sửa/xoá, service không giữ repository',
  slug: 'pro192-lab211-p0021-student-management',
  type: 'VIDEO',
  description: 'Bài dài LAB211 J1.L.P0021 (350 LOC, chấm theo phần trăm hoàn thành) làm trọn theo chuẩn review: đọc đề (tạo ít nhất 10 sinh viên rồi hỏi Y/N, tìm và sắp theo tên bằng Collections.sort với Comparator, sửa/xoá theo ID với U/D, báo cáo "Tên | Môn | Tổng", ba môn Java/.Net/C/C++), thiết kế lớp (Student giữ danh sách Enrollment — vì sao tách), controller giữ repository và service, service chỉ xử lý dữ liệu được đưa vào, view một display() mỗi luồng, Main gọi controller đúng một lần mỗi luồng. Bảy chỗ lệch đề và hai mươi chỗ phạm checklist của bản đầu đã sửa. Chạy thật 54 phím test, lint.py sạch, 25 mục 0 vi phạm, JDK 8 thật. Kèm câu thầy hay hỏi (Comparator khác Comparable, LinkedHashMap, vì sao có service) và dự án tải về.',
  content: [
    bi(`<span class="eyebrow">🎓 LAB211 in practice · L.2 · J1.L.P0021</span>
<h2>Student Management — the long assignment</h2>
<p class="lead">350 LOC in one lab, graded by the percentage completed: four functions (create, find and sort, update or delete, report), at least ten students, three courses, and exact sentences from the brief. It is the first lab of the series with a real service — sorting with a Comparator, checking duplicates, counting a report — and the place where the rule "the controller holds the repository, the service never does" matters most.</p>
<p>The code is the version already corrected after review, then audited against the paper checklist until 0 violations. Plan about <strong>4 hours</strong> to retype it (it is long), then 45 minutes on the 54 test keys.</p>`,
    `<span class="eyebrow">🎓 LAB211 thực chiến · L.2 · J1.L.P0021</span>
<h2>Quản lý sinh viên — bài dài</h2>
<p class="lead">350 LOC trong một bài, chấm theo phần trăm hoàn thành: bốn chức năng (tạo, tìm và sắp xếp, sửa hoặc xoá, báo cáo), ít nhất mười sinh viên, ba môn học, và những câu chữ phải chép đúng đề. Đây là bài đầu tiên của loạt có service thật sự — sắp xếp bằng Comparator, kiểm trùng, đếm báo cáo — và là chỗ luật "controller giữ repository, service không bao giờ giữ" quan trọng nhất.</p>
<p>Code là bản đã sửa sau review, rồi soát với tờ checklist giấy tới 0 vi phạm. Dành khoảng <strong>4 giờ</strong> để gõ lại (bài dài), rồi 45 phút cho 54 phím test.</p>`),
    bi(`<h2>📑 Slide by slide — PRO192 · LAB211 P0021 (14 slides)</h2>
<p>The deck of this LAB211 lesson, made by CuongThai (it is not a school deck and not the lecturer's). Each slide is followed by its key idea and the explanation; every piece of code and every output on the slides comes from the real project in this lesson — checked by <code>lint.py</code> (the lecturer's rules), compiled with <code>javac --release 8</code> and run on a real JDK 8, like the machines in the lab room.</p>`,
    `<h2>📑 Học theo từng slide — PRO192 · LAB211 P0021 (14 slide)</h2>
<p>Bộ slide của bài LAB211 này do CuongThai dựng (không phải slide của trường, cũng không phải của thầy). Dưới mỗi slide là ý chính và lời giảng; mọi đoạn code, mọi output trên slide đều lấy từ đúng dự án trong bài — qua <code>lint.py</code> (luật của thầy), biên dịch bằng <code>javac --release 8</code> và chạy trên JDK 8 thật, giống máy phòng lab.</p>`),
    walk('l211-p0021', [
      [1, 'J1.L.P0021 — Student Management',
        `<p class="y-chinh">🎯 A long assignment with a real service: Comparator, duplicates, a grouped report — and the lecturer's layering kept all the way.</p>
<p>From the brief to the reviewed project: what the brief imposes, why a student keeps a list of enrollments, each layer's code, one render per flow, the real run and the questions of the review.</p>`,
        `<p class="y-chinh">🎯 Bài dài có service thật sự: Comparator, kiểm trùng, báo cáo gom nhóm — và cách chia tầng của thầy giữ đúng từ đầu tới cuối.</p>
<p>Từ đề tới dự án đã qua review: đề bắt buộc gì, vì sao một sinh viên giữ danh sách lần học, code từng tầng, in một lần mỗi luồng, lần chạy thật và các câu hỏi khi review.</p>`],
      [2, 'The brief',
        `<p class="y-chinh">🎯 A student has ID, name, semester and course (only Java, .Net, C/C++). Menu: 1 Create · 2 Find and Sort · 3 Update/Delete · 4 Report · 5 Exit.</p>
<p>Create: at least 10 students; from the 10th on, ask "Do you want to continue (Y/N)?". Find and Sort: a name or part of a name, list sorted by name. Update/Delete: find by ID, ask "Do you want to update (U) or delete (D) student". Report: one line per student and course, "Nguyen Van A | Java | 2" = how many times that student took that course.</p>`,
        `<p class="y-chinh">🎯 Sinh viên có mã, tên, học kỳ và môn (chỉ Java, .Net, C/C++). Menu: 1 Create · 2 Find and Sort · 3 Update/Delete · 4 Report · 5 Exit.</p>
<p>Create: ít nhất 10 sinh viên; từ sinh viên thứ 10 trở đi hỏi "Do you want to continue (Y/N)?". Find and Sort: gõ tên hoặc một phần tên, liệt kê đã sắp theo tên. Update/Delete: tìm theo mã, hỏi "Do you want to update (U) or delete (D) student". Report: mỗi dòng một sinh viên với một môn, "Nguyen Van A | Java | 2" = sinh viên đó học môn đó mấy lần.</p>`],
      [3, 'What the brief imposes',
        `<p class="y-chinh">🎯 Four things are graded literally: <code>Collections.sort()</code> with an overridden <code>compare()</code> of <code>Comparator</code>, an <code>ArrayList</code> for the students, the exact sentences of the menu and the questions, and the report format <code>Name | Course | Total</code>.</p>
<p>The first version missed half of them: it sorted with <code>Comparable</code>, printed <code>JAVA</code> and <code>.NET</code>, had its own menu, and printed the report in a random order (a <code>HashMap</code>). Seven deviations from the brief were fixed before looking at the checklist at all.</p>`,
        `<p class="y-chinh">🎯 Bốn thứ được chấm theo đúng chữ: <code>Collections.sort()</code> với hàm <code>compare()</code> ghi đè của <code>Comparator</code>, một <code>ArrayList</code> chứa sinh viên, đúng nguyên văn các câu của menu và câu hỏi, và định dạng báo cáo <code>Tên | Môn | Tổng</code>.</p>
<p>Bản đầu trượt một nửa: sắp xếp bằng <code>Comparable</code>, in <code>JAVA</code> và <code>.NET</code>, tự chế menu riêng, và in báo cáo theo thứ tự ngẫu nhiên (một <code>HashMap</code>). Bảy chỗ lệch đề được sửa trước cả khi nhìn tới tờ checklist.</p>`],
      [4, 'Why Student holds a list of Enrollment',
        `<p class="y-chinh">🎯 One student takes several courses in several semesters: <code>Student</code> keeps <code>id</code> and <code>studentName</code> once, and an <code>ArrayList&lt;Enrollment&gt;</code> of (semester, course).</p>
<p>The name is never repeated, "same semester and same course twice" is checked inside one student (<code>isDuplicated</code>), and the report counts enrollments per course. The brief lists the four fields of a student; be ready to say why you split them — and if the lecturer insists on a flat <code>Student</code> with four fields, ask before changing, because the service changes too.</p>`,
        `<p class="y-chinh">🎯 Một sinh viên học nhiều môn ở nhiều học kỳ: <code>Student</code> giữ <code>id</code> và <code>studentName</code> một lần, cùng một <code>ArrayList&lt;Enrollment&gt;</code> các cặp (học kỳ, môn).</p>
<p>Tên không bao giờ lặp lại, "cùng học kỳ cùng môn hai lần" được kiểm ngay trong một sinh viên (<code>isDuplicated</code>), và báo cáo đếm số lần học theo môn. Đề liệt kê bốn thuộc tính của sinh viên; phải sẵn sàng nói vì sao tách — còn nếu thầy nhất định đòi một <code>Student</code> phẳng bốn thuộc tính thì hỏi trước khi sửa, vì service cũng phải đổi theo.</p>`],
      [5, 'The layers: who calls whom',
        `<p class="y-chinh">🎯 <code>StudentController</code> holds <code>StudentRepository</code>, <code>StudentService</code> and <code>StudentView</code>; the service receives students and returns rows — it never sees the repository.</p>
<p>Create, for example: the controller asks the repository <code>findById(id)</code> (null if new), gives that student and the DTO to <code>studentService.addEnrollment</code> (checks, creates if needed, adds the enrollment), then gives the result back to <code>studentRepository.save</code>. Three lines, three layers, no import of <code>model</code> in the controller.</p>`,
        `<p class="y-chinh">🎯 <code>StudentController</code> giữ <code>StudentRepository</code>, <code>StudentService</code> và <code>StudentView</code>; service nhận sinh viên, trả về các dòng bảng — không bao giờ thấy repository.</p>
<p>Ví dụ Create: controller hỏi repository <code>findById(id)</code> (null nếu là mã mới), đưa sinh viên đó cùng DTO cho <code>studentService.addEnrollment</code> (kiểm, tạo mới nếu cần, thêm lần học), rồi đưa kết quả lại cho <code>studentRepository.save</code>. Ba dòng, ba tầng, controller không import <code>model</code>.</p>`],
      [6, 'Model: one rule lives in Student',
        `<p class="y-chinh">🎯 <code>isDuplicated(newEnrollment, ignoreIndex)</code> answers "does this student already take this course in this semester?" — skipping the record being updated.</p>
<p>The semester is compared with <code>equalsIgnoreCase</code> ("fall2022" = "Fall2022"), the course with <code>equals</code> on the enum (checklist 3.5: objects with equals, never ==). Two parameters only: the old version had three and was cut down to respect "no 3 parameters".</p>`,
        `<p class="y-chinh">🎯 <code>isDuplicated(newEnrollment, ignoreIndex)</code> trả lời "sinh viên này đã học môn này ở học kỳ này chưa?" — bỏ qua bản ghi đang được sửa.</p>
<p>Học kỳ so bằng <code>equalsIgnoreCase</code> ("fall2022" = "Fall2022"), môn so bằng <code>equals</code> trên enum (checklist 3.5: đối tượng so bằng equals, không bao giờ ==). Chỉ hai tham số: bản cũ có ba và đã được rút lại để đúng luật "không truyền 3 tham số".</p>`],
      [7, 'Repository: the list and its CRUD',
        `<p class="y-chinh">🎯 <code>findById</code> (ignore case, null if absent), <code>findByName</code> (contains, ignore case), <code>save</code> (add only if new), <code>deleteStudent</code>, <code>getAllStudents</code>, <code>isEmpty</code>, <code>getSize</code>.</p>
<p>Nothing else: no sorting, no counting, no message. The old service removed students by reaching into <code>getAllStudents().remove(s)</code> — editing the repository's list from outside; now only <code>deleteStudent</code> touches it.</p>`,
        `<p class="y-chinh">🎯 <code>findById</code> (không phân biệt hoa thường, null nếu không có), <code>findByName</code> (chứa chuỗi, không phân biệt hoa thường), <code>save</code> (chỉ thêm khi mới), <code>deleteStudent</code>, <code>getAllStudents</code>, <code>isEmpty</code>, <code>getSize</code>.</p>
<p>Không gì khác: không sắp xếp, không đếm, không câu chữ. Service cũ xoá sinh viên bằng cách thò tay vào <code>getAllStudents().remove(s)</code> — sửa danh sách của repository từ bên ngoài; giờ chỉ <code>deleteStudent</code> được đụng vào nó.</p>`],
      [8, 'Service: add an enrollment',
        `<p class="y-chinh">🎯 <code>addEnrollment(student, dto)</code>: no student → create one; a student with this ID but another name → "ID nay da la cua sinh vien …"; then add the (semester, course) — or the model refuses the duplicate.</p>
<p>It returns the student so the controller can save a new one. A business rule needing data ("this ID belongs to Dao Van Tuan") is checked here, on the object the controller brought, not by the service fetching it.</p>`,
        `<p class="y-chinh">🎯 <code>addEnrollment(student, dto)</code>: chưa có sinh viên → tạo mới; đã có mã này mà khác tên → "ID nay da la cua sinh vien …"; rồi thêm cặp (học kỳ, môn) — hoặc model từ chối vì trùng.</p>
<p>Nó trả về sinh viên để controller lưu nếu là sinh viên mới. Luật nghiệp vụ cần dữ liệu ("mã này thuộc về Dao Van Tuan") được kiểm ở đây, trên đối tượng controller mang tới, chứ không phải service tự đi lấy.</p>`],
      [9, 'Service: sort with a Comparator, then renumber',
        `<p class="y-chinh">🎯 Turn the students found into table rows, <code>Collections.sort(resultList, new Comparator&lt;ResponseDTO&gt;() { … compare … })</code>, then number the rows 1, 2, 3 AFTER sorting.</p>
<p>The anonymous class overrides <code>compare(first, second)</code> with <code>first.getStudentName().compareTo(second.getStudentName())</code> — exactly what the brief names. The old version numbered before sorting, so "No." came out shuffled (11, 10, …). Comparator vs Comparable is the first question of this lab.</p>`,
        `<p class="y-chinh">🎯 Đổi các sinh viên tìm được thành dòng bảng, <code>Collections.sort(resultList, new Comparator&lt;ResponseDTO&gt;() { … compare … })</code>, rồi đánh số 1, 2, 3 SAU khi sắp.</p>
<p>Lớp vô danh ghi đè <code>compare(first, second)</code> bằng <code>first.getStudentName().compareTo(second.getStudentName())</code> — đúng thứ đề gọi tên. Bản cũ đánh số trước khi sắp nên cột "No." ra lộn xộn (11, 10, …). Comparator khác Comparable thế nào là câu hỏi đầu tiên của bài này.</p>`],
      [10, 'Service: the report with a LinkedHashMap',
        `<p class="y-chinh">🎯 For every student and every enrollment, add 1 to the key "name#course" in a <code>LinkedHashMap&lt;String, Integer&gt;</code>; then turn each entry into a row "Name | Course | Total".</p>
<p><code>getOrDefault(key, 0) + 1</code> counts in one line. <code>LinkedHashMap</code> keeps the order of first insertion, so the report is the same on every run; a <code>HashMap</code> printed it in an order that changed with the data — a deviation a lecturer sees at once.</p>`,
        `<p class="y-chinh">🎯 Với mọi sinh viên và mọi lần học, cộng 1 vào khoá "tên#môn" trong một <code>LinkedHashMap&lt;String, Integer&gt;</code>; rồi đổi từng mục thành một dòng "Tên | Môn | Tổng".</p>
<p><code>getOrDefault(key, 0) + 1</code> đếm trong một dòng. <code>LinkedHashMap</code> giữ thứ tự thêm lần đầu nên lần chạy nào báo cáo cũng giống nhau; <code>HashMap</code> in theo thứ tự đổi theo dữ liệu — lệch đề mà thầy thấy ngay.</p>`],
      [11, 'View: one display() per flow',
        `<p class="y-chinh">🎯 <code>StudentView</code> holds the rows, a message and a "report" flag; <code>display()</code> prints the message OR the table OR the report, then clears its state.</p>
<p>The checklist audit flagged three controller methods that called the view twice (<code>printMessage</code> in the <code>if</code>, <code>printStudents</code> in the <code>else</code>). Now each method fills the view in its branches and calls <code>display()</code> once, after the <code>if</code> — "rendering chỉ được gọi 1 lần cho 1 luồng xử lý".</p>`,
        `<p class="y-chinh">🎯 <code>StudentView</code> giữ các dòng, một câu thông báo và một cờ "báo cáo"; <code>display()</code> in câu thông báo HOẶC bảng HOẶC báo cáo, rồi xoá trạng thái của nó.</p>
<p>Lần soát checklist bắt ba hàm controller gọi view hai lần (<code>printMessage</code> trong <code>if</code>, <code>printStudents</code> trong <code>else</code>). Giờ mỗi hàm điền view trong các nhánh rồi gọi <code>display()</code> đúng một lần, sau khối <code>if</code> — "rendering chỉ được gọi 1 lần cho 1 luồng xử lý".</p>`],
      [12, 'Main: one controller call per flow',
        `<p class="y-chinh">🎯 Create: <code>inputStudent(sc)</code> reads the four fields, <code>studentController.addStudent(dto)</code> returns how many students exist — enough to know when to ask Y/N. Update/Delete: a pre-check shows the records, then one <code>updateOrDeleteStudent(dto)</code> with the action U or D in the DTO.</p>
<p>The old Main called the controller three times in Create (find the name, add, count) and three in Update/Delete. The pre-check that prints the records is the only extra call, in its own helper — the user cannot choose a record number without seeing them.</p>`,
        `<p class="y-chinh">🎯 Create: <code>inputStudent(sc)</code> đọc bốn ô, <code>studentController.addStudent(dto)</code> trả về số sinh viên đang có — đủ để biết lúc nào hỏi Y/N. Update/Delete: một lần kiểm trước in các bản ghi, rồi một lần <code>updateOrDeleteStudent(dto)</code> với việc U hoặc D nằm trong DTO.</p>
<p>Main cũ gọi controller ba lần trong Create (tìm tên, thêm, đếm) và ba lần trong Update/Delete. Lần kiểm trước in bản ghi là lần gọi thêm duy nhất, nằm trong hàm riêng — người dùng không thể chọn số bản ghi khi chưa nhìn thấy chúng.</p>`],
      [13, 'The real run, lint and JDK 8',
        `<p class="y-chinh">🎯 54 keys: the report of the 13 sample enrollments, a search sorted 1…11, blank and unknown names, a create with every error, an ID that belongs to someone else, a duplicate, update with an out-of-range number and a duplicate, a real update, a delete, the final report.</p>
<p><code>lint.py</code>: "✓ MSSV_J1LP0021_StudentManagement — sạch"; paper checklist: 0 violations; the grader: 181/181 lines; a real JDK 8: the same 181 lines.</p>`,
        `<p class="y-chinh">🎯 54 phím: báo cáo của 13 lần học mẫu, một lần tìm được sắp 1…11, tên trống và tên không có, một lần tạo đi qua mọi lỗi, một mã thuộc người khác, một bản ghi trùng, sửa với số ngoài khoảng và bị trùng, sửa thật, xoá, báo cáo cuối.</p>
<p><code>lint.py</code>: "✓ MSSV_J1LP0021_StudentManagement — sạch"; tờ checklist giấy: 0 vi phạm; bộ chấm: 181/181 dòng; JDK 8 thật: đúng 181 dòng đó.</p>`],
      [14, 'What the lecturer asks',
        `<p class="y-chinh">🎯 "Where is the Comparator, and how is it different from Comparable?", "Why Enrollment?", "Why is there a service?", "How is the report counted?", "Why two prints in Update/Delete?"</p>
<p>Comparator is the Strategy pattern in miniature: the sorting rule is an object you pass in, so sorting by semester is one new class, and <code>ResponseDTO</code> is not touched. Comparable puts one fixed rule inside the class itself.</p>`,
        `<p class="y-chinh">🎯 "Comparator ở đâu, khác Comparable thế nào?", "Sao tách Enrollment?", "Sao có service?", "Báo cáo đếm thế nào?", "Sao Update/Delete in hai lần?"</p>
<p>Comparator là mẫu Strategy thu nhỏ: luật sắp xếp là một đối tượng truyền vào, nên muốn sắp theo học kỳ chỉ cần thêm một lớp, không đụng tới <code>ResponseDTO</code>. Comparable thì đặt một luật cố định ngay trong chính lớp đó.</p>`],
    ]),
    bi(`<h2>1. The brief, line by line</h2>
<table>
<thead><tr><th>The brief says</th><th>Where it lives</th></tr></thead>
<tbody>
<tr><td>Student: id, studentName, semester, courseName — courses only Java, .Net, C/C++</td><td><code>Student</code> (id, studentName) + <code>Enrollment</code> (semester, course) + enum <code>ProgrammingLanguage</code> with the exact names</td></tr>
<tr><td>use an ArrayList</td><td><code>StudentRepository.studentList : ArrayList&lt;Student&gt;</code></td></tr>
<tr><td>Create at least 10 students, then "Do you want to continue (Y/N)?"</td><td><code>Main.processAdd</code> + <code>Constants.MIN_STUDENTS = 10</code> + <code>Message.INPUT_YN</code></td></tr>
<tr><td>Find and Sort: name or part of a name, sorted by name</td><td><code>StudentRepository.findByName</code> + <code>StudentService.sortByName</code></td></tr>
<tr><td><code>Collections.sort()</code> and overwrite <code>compare()</code> of <code>Comparator</code></td><td>the anonymous <code>Comparator&lt;ResponseDTO&gt;</code> in <code>sortByName</code></td></tr>
<tr><td>Update/Delete by ID, "Do you want to update (U) or delete (D) student"</td><td><code>Main.processUpdateDelete</code> + <code>StudentController.updateOrDeleteStudent</code> + <code>Message.INPUT_UD</code></td></tr>
<tr><td>Report "Nguyen Van A | Java | 2"</td><td><code>StudentService.buildReport</code> + <code>Constants.REPORT_FORMAT = "%s | %s | %d"</code></td></tr>
</tbody>
</table>
<h2>2. Class design</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/545840c0f90ecab01c1b0dbd08ce7fd0146affca.svg" alt="P0021: the controller holds repository, service and view; the service works on the students it is given" loading="lazy" /><p class="chu-thich">🧩 P0021: the controller holds repository, service and view; the service works on the students it is given</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title J1.L.P0021 Student Management — controller holds repository + service; the service never touches the repository
package main {
  class Main &lt;&lt;final&gt;&gt; {
    + {static} main(args : String[]) : void
    - {static} processAdd(sc : Scanner, studentController : StudentController) : void
    - {static} processFind(sc : Scanner, studentController : StudentController) : void
    - {static} processUpdateDelete(sc : Scanner, studentController : StudentController) : void
  }
}
package controller {
  class StudentController {
    - studentRepository : StudentRepository
    - studentService : StudentService
    - studentView : StudentView
    + addStudent(studentDTO : StudentDTO) : int
    + findAndSort(studentDTO : StudentDTO) : void
    + findStudentById(studentDTO : StudentDTO) : int
    + updateOrDeleteStudent(studentDTO : StudentDTO) : void
    + report() : void
  }
}
package repository {
  class StudentRepository {
    - studentList : ArrayList&lt;Student&gt;
    + findById(id : String) : Student
    + findByName(name : String) : ArrayList&lt;Student&gt;
    + save(student : Student) : void
    + deleteStudent(student : Student) : void
    + getAllStudents() : ArrayList&lt;Student&gt;
  }
}
package service {
  class StudentService {
    + addEnrollment(student : Student, studentDTO : StudentDTO) : Student
    + sortByName(studentList : ArrayList&lt;Student&gt;) : ArrayList&lt;ResponseDTO&gt;
    + updateEnrollment(student : Student, studentDTO : StudentDTO) : void
    + removeEnrollment(student : Student, studentDTO : StudentDTO) : boolean
    + buildReport(studentList : ArrayList&lt;Student&gt;) : ArrayList&lt;ResponseDTO&gt;
  }
}
package model {
  class Student {
    - id : String
    - studentName : String
    - enrollmentList : ArrayList&lt;Enrollment&gt;
    + addEnrollment(enrollment : Enrollment) : void
    + isDuplicated(newEnrollment : Enrollment, ignoreIndex : int) : boolean
  }
  class Enrollment {
    - semester : String
    - course : ProgrammingLanguage
  }
}
package constants {
  enum ProgrammingLanguage {
    JAVA("Java")
    DOT_NET(".Net")
    C_CPP("C/C++")
  }
}
package view {
  class StudentView {
    - responseList : ArrayList&lt;ResponseDTO&gt;
    - message : String
    - report : boolean
    + display() : void
  }
}
package dto {
  class StudentDTO
  class ResponseDTO {
    + toString() : String
    + toReportString() : String
  }
}
Main ..&gt; StudentController : one call per flow
StudentController *-- StudentRepository : find / save / delete
StudentController *-- StudentService : check, sort, count
StudentController *-- StudentView : display() once
StudentRepository o-- "0..*" Student
Student *-- "1..*" Enrollment
Enrollment --&gt; ProgrammingLanguage
StudentService ..&gt; Student : works on what it is given
StudentService ..&gt; ResponseDTO : builds rows
@enduml</code></pre></details>
<table>
<thead><tr><th>Class</th><th>Role</th></tr></thead>
<tbody>
<tr><td><code>StudentController</code></td><td>the 5 flows: addStudent (returns the count), findAndSort, findStudentById (pre-check, returns the number of records), updateOrDeleteStudent, report — each ends with one display()</td></tr>
<tr><td><code>StudentRepository</code></td><td>ArrayList of students + CRUD; null when an ID is unknown</td></tr>
<tr><td><code>StudentService</code></td><td>addEnrollment, toRecordList, sortByName (Comparator), updateEnrollment, removeEnrollment, buildReport — no repository</td></tr>
<tr><td><code>Student</code>, <code>Enrollment</code></td><td>JavaBeans; Student checks a duplicate (semester + course) inside itself</td></tr>
<tr><td><code>StudentDTO</code> / <code>ResponseDTO</code></td><td>Main → controller (id, name, semester, course, no, action) / one table or report row</td></tr>
<tr><td><code>StudentView</code></td><td>rows + message + report flag, display() without parameters</td></tr>
<tr><td><code>Validation</code></td><td>getInt, checkId (S + digits), checkName, checkSemester, checkYesNo, checkUpdateDelete</td></tr>
<tr><td><code>Main</code></td><td>menu, Scanner, 8 input helpers, one controller call per flow</td></tr>
</tbody>
</table>`,
    `<h2>1. Đề bài, từng dòng</h2>
<table>
<thead><tr><th>Đề nói</th><th>Nằm ở đâu</th></tr></thead>
<tbody>
<tr><td>Sinh viên: id, studentName, semester, courseName — chỉ ba môn Java, .Net, C/C++</td><td><code>Student</code> (id, studentName) + <code>Enrollment</code> (semester, course) + enum <code>ProgrammingLanguage</code> đúng tên môn</td></tr>
<tr><td>dùng ArrayList</td><td><code>StudentRepository.studentList : ArrayList&lt;Student&gt;</code></td></tr>
<tr><td>Tạo ít nhất 10 sinh viên, rồi hỏi "Do you want to continue (Y/N)?"</td><td><code>Main.processAdd</code> + <code>Constants.MIN_STUDENTS = 10</code> + <code>Message.INPUT_YN</code></td></tr>
<tr><td>Find and Sort: tên hoặc một phần tên, sắp theo tên</td><td><code>StudentRepository.findByName</code> + <code>StudentService.sortByName</code></td></tr>
<tr><td><code>Collections.sort()</code> và ghi đè <code>compare()</code> của <code>Comparator</code></td><td>lớp vô danh <code>Comparator&lt;ResponseDTO&gt;</code> trong <code>sortByName</code></td></tr>
<tr><td>Update/Delete theo mã, "Do you want to update (U) or delete (D) student"</td><td><code>Main.processUpdateDelete</code> + <code>StudentController.updateOrDeleteStudent</code> + <code>Message.INPUT_UD</code></td></tr>
<tr><td>Báo cáo "Nguyen Van A | Java | 2"</td><td><code>StudentService.buildReport</code> + <code>Constants.REPORT_FORMAT = "%s | %s | %d"</code></td></tr>
</tbody>
</table>
<h2>2. Thiết kế lớp</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/545840c0f90ecab01c1b0dbd08ce7fd0146affca.svg" alt="P0021: controller giữ repository, service và view; service xử lý những sinh viên được đưa tới" loading="lazy" /><p class="chu-thich">🧩 P0021: controller giữ repository, service và view; service xử lý những sinh viên được đưa tới</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title J1.L.P0021 Student Management — controller holds repository + service; the service never touches the repository
package main {
  class Main &lt;&lt;final&gt;&gt; {
    + {static} main(args : String[]) : void
    - {static} processAdd(sc : Scanner, studentController : StudentController) : void
    - {static} processFind(sc : Scanner, studentController : StudentController) : void
    - {static} processUpdateDelete(sc : Scanner, studentController : StudentController) : void
  }
}
package controller {
  class StudentController {
    - studentRepository : StudentRepository
    - studentService : StudentService
    - studentView : StudentView
    + addStudent(studentDTO : StudentDTO) : int
    + findAndSort(studentDTO : StudentDTO) : void
    + findStudentById(studentDTO : StudentDTO) : int
    + updateOrDeleteStudent(studentDTO : StudentDTO) : void
    + report() : void
  }
}
package repository {
  class StudentRepository {
    - studentList : ArrayList&lt;Student&gt;
    + findById(id : String) : Student
    + findByName(name : String) : ArrayList&lt;Student&gt;
    + save(student : Student) : void
    + deleteStudent(student : Student) : void
    + getAllStudents() : ArrayList&lt;Student&gt;
  }
}
package service {
  class StudentService {
    + addEnrollment(student : Student, studentDTO : StudentDTO) : Student
    + sortByName(studentList : ArrayList&lt;Student&gt;) : ArrayList&lt;ResponseDTO&gt;
    + updateEnrollment(student : Student, studentDTO : StudentDTO) : void
    + removeEnrollment(student : Student, studentDTO : StudentDTO) : boolean
    + buildReport(studentList : ArrayList&lt;Student&gt;) : ArrayList&lt;ResponseDTO&gt;
  }
}
package model {
  class Student {
    - id : String
    - studentName : String
    - enrollmentList : ArrayList&lt;Enrollment&gt;
    + addEnrollment(enrollment : Enrollment) : void
    + isDuplicated(newEnrollment : Enrollment, ignoreIndex : int) : boolean
  }
  class Enrollment {
    - semester : String
    - course : ProgrammingLanguage
  }
}
package constants {
  enum ProgrammingLanguage {
    JAVA("Java")
    DOT_NET(".Net")
    C_CPP("C/C++")
  }
}
package view {
  class StudentView {
    - responseList : ArrayList&lt;ResponseDTO&gt;
    - message : String
    - report : boolean
    + display() : void
  }
}
package dto {
  class StudentDTO
  class ResponseDTO {
    + toString() : String
    + toReportString() : String
  }
}
Main ..&gt; StudentController : one call per flow
StudentController *-- StudentRepository : find / save / delete
StudentController *-- StudentService : check, sort, count
StudentController *-- StudentView : display() once
StudentRepository o-- "0..*" Student
Student *-- "1..*" Enrollment
Enrollment --&gt; ProgrammingLanguage
StudentService ..&gt; Student : works on what it is given
StudentService ..&gt; ResponseDTO : builds rows
@enduml</code></pre></details>
<table>
<thead><tr><th>Lớp</th><th>Vai trò</th></tr></thead>
<tbody>
<tr><td><code>StudentController</code></td><td>5 luồng: addStudent (trả số sinh viên), findAndSort, findStudentById (kiểm trước, trả số bản ghi), updateOrDeleteStudent, report — luồng nào cũng kết thúc bằng một display()</td></tr>
<tr><td><code>StudentRepository</code></td><td>ArrayList sinh viên + CRUD; null khi mã không có</td></tr>
<tr><td><code>StudentService</code></td><td>addEnrollment, toRecordList, sortByName (Comparator), updateEnrollment, removeEnrollment, buildReport — không có repository</td></tr>
<tr><td><code>Student</code>, <code>Enrollment</code></td><td>JavaBean; Student tự kiểm trùng (học kỳ + môn)</td></tr>
<tr><td><code>StudentDTO</code> / <code>ResponseDTO</code></td><td>Main → controller (mã, tên, học kỳ, môn, số bản ghi, việc U/D) / một dòng bảng hoặc báo cáo</td></tr>
<tr><td><code>StudentView</code></td><td>các dòng + câu thông báo + cờ báo cáo, display() không tham số</td></tr>
<tr><td><code>Validation</code></td><td>getInt, checkId (S + chữ số), checkName, checkSemester, checkYesNo, checkUpdateDelete</td></tr>
<tr><td><code>Main</code></td><td>menu, Scanner, 8 hàm nhập, mỗi luồng gọi controller một lần</td></tr>
</tbody>
</table>`),
    bi(`<h2>3. The code, in the order to type it</h2>
<h4>Step 1 — model</h4>
<pre class="trich"><code class="language-java">// Kiem da co lan hoc trung hoc ky + mon chua (bo qua vi tri ignoreIndex khi dang sua)
public boolean isDuplicated(Enrollment newEnrollment, int ignoreIndex) {
    Enrollment enrollment = null;

    // Duyet tung lan hoc
    for (int i = 0; i &lt; enrollmentList.size(); i++) {
        enrollment = enrollmentList.get(i);

        // Trung hoc ky (khong phan biet hoa thuong) va trung mon, khac vi tri dang sua
        if ((i != ignoreIndex) &amp;&amp;
                (enrollment.getSemester().equalsIgnoreCase(newEnrollment.getSemester())) &amp;&amp;
                (enrollment.getCourse().equals(newEnrollment.getCourse()))) {
            return true;
        }
    }

    return false;
}</code></pre>
<h4>Step 2 — repository</h4>
<pre class="trich"><code class="language-java">// Tim cac sinh vien co ten chua chuoi name (khong phan biet hoa thuong)
public ArrayList&lt;Student&gt; findByName(String name) {
    ArrayList&lt;Student&gt; foundList = new ArrayList&lt;&gt;();

    // Duyet tung sinh vien de so ten
    for (Student student : studentList) {
        // Ten chua chuoi can tim thi giu lai
        if (student.getStudentName().toLowerCase().contains(name.toLowerCase())) {
            foundList.add(student);
        }
    }

    return foundList;
}</code></pre>
<pre class="trich"><code class="language-java">// Luu sinh vien: chua co trong kho thi them, co roi thi giu nguyen
public void save(Student student) {
    // Chi them khi sinh vien chua nam trong kho
    if (!studentList.contains(student)) {
        studentList.add(student);
    }
}</code></pre>
<h4>Step 3 — service</h4>
<pre class="trich"><code class="language-java">// Them lan hoc. student = sinh vien Controller tim trong kho (null neu chua co ID).
// Tra ve sinh vien (moi tao hoac da co) de Controller luu vao kho neu la sinh vien moi.
public Student addEnrollment(Student student, StudentDTO studentDTO) throws Exception {
    // Chua co ID thi tao sinh vien moi; co roi ma khac ten thi bao loi
    if (student == null) {
        student = new Student(studentDTO.getId(), studentDTO.getStudentName());
    } else if (!student.getStudentName().equalsIgnoreCase(studentDTO.getStudentName())) {
        // ID da co nhung ten khac thi bao ID thuoc ve nguoi khac
        throw new Exception(String.format(Message.ERROR_DUPLICATE_ID,
                student.getStudentName()));
    }

    student.addEnrollment(new Enrollment(studentDTO.getSemester(),
            studentDTO.getCourseName()));

    return student;
}</code></pre>
<pre class="trich"><code class="language-java">// Danh sach sinh vien tim duoc -&gt; bang sap xep theo ten bang Comparator, danh so lai
public ArrayList&lt;ResponseDTO&gt; sortByName(ArrayList&lt;Student&gt; studentList) {
    ArrayList&lt;ResponseDTO&gt; resultList = new ArrayList&lt;&gt;();

    // Doi tung sinh vien tim duoc thanh cac dong bang
    for (Student student : studentList) {
        resultList.addAll(convertToResponse(student));
    }

    // Sap xep theo ten: ghi de ham compare() cua Comparator nhu de yeu cau
    Collections.sort(resultList, new Comparator&lt;ResponseDTO&gt;() {
        // So 2 dong theo ten sinh vien
        @Override
        public int compare(ResponseDTO first, ResponseDTO second) {
            return first.getStudentName().compareTo(second.getStudentName());
        }
    });

    // Danh so thu tu lai sau khi sap xep
    for (int i = 0; i &lt; resultList.size(); i++) {
        resultList.get(i).setNo(i + 1);
    }

    return resultList;
}</code></pre>
<pre class="trich"><code class="language-java">// Bao cao: moi dong = ten | mon | so lan hoc mon do (giu thu tu nhap)
public ArrayList&lt;ResponseDTO&gt; buildReport(ArrayList&lt;Student&gt; studentList) {
    ArrayList&lt;ResponseDTO&gt; reportList = new ArrayList&lt;&gt;();
    LinkedHashMap&lt;String, Integer&gt; reportMap = new LinkedHashMap&lt;&gt;();
    String key = "";
    String[] partArray = null;
    ResponseDTO responseDTO = null;

    // Dem so lan hoc theo cap (ten, mon)
    for (Student student : studentList) {
        // Moi lan hoc cong 1 vao cap (ten, mon) cua no
        for (Enrollment enrollment : student.getEnrollmentList()) {
            key = String.format(Constants.REPORT_KEY_FORMAT, student.getStudentName(),
                    enrollment.getCourse().getName());
            reportMap.put(key, reportMap.getOrDefault(key, 0) + 1);
        }
    }

    // Doi tung cap (ten, mon) thanh 1 dong bao cao
    for (Map.Entry&lt;String, Integer&gt; entry : reportMap.entrySet()) {
        partArray = entry.getKey().split(Constants.REPORT_KEY_SEPARATOR);
        responseDTO = new ResponseDTO();
        responseDTO.setStudentName(partArray[0]);
        responseDTO.setCourseName(partArray[1]);
        responseDTO.setTotal(entry.getValue());
        reportList.add(responseDTO);
    }

    return reportList;
}</code></pre>
<pre class="trich"><code class="language-java">// Sua hoc ky + mon cua ban ghi so no cua sinh vien; trung voi ban ghi khac thi bao loi
public void updateEnrollment(Student student, StudentDTO studentDTO) throws Exception {
    Enrollment enrollment = null;
    Enrollment newEnrollment = new Enrollment(studentDTO.getSemester(),
            studentDTO.getCourseName());

    checkRecord(student, studentDTO);

    // Hoc ky + mon moi trung voi ban ghi khac cua chinh sinh vien thi bao loi
    if (student.isDuplicated(newEnrollment, studentDTO.getNo() - 1)) {
        throw new Exception(Message.ERROR_DUPLICATE);
    }

    enrollment = student.getEnrollmentList().get(studentDTO.getNo() - 1);
    enrollment.setSemester(newEnrollment.getSemester());
    enrollment.setCourse(newEnrollment.getCourse());
}</code></pre>
<h4>Step 4 — view and controller</h4>
<pre class="trich"><code class="language-java">// In ket qua cua 1 luong, roi xoa trang thai de luong sau bat dau sach
public void display() {
    // Co cau thong bao thi chi in cau do
    if (!message.isEmpty()) {
        System.out.println(message);
    } else if (report) {
        // Bao cao: tieu de roi tung dong "Ten | Mon | Tong"
        System.out.println(Message.TITLE_REPORT);
        printRows();
    } else {
        // Bang sinh vien: dong tieu de cot roi tung dong
        System.out.println(String.format(Constants.TABLE_FORMAT, Message.COLUMN_NO,
                Message.COLUMN_NAME, Message.COLUMN_SEMESTER, Message.COLUMN_COURSE));
        printRows();
    }

    message = "";
    report = false;
}</code></pre>
<pre class="trich"><code class="language-java">// Them 1 lan hoc cho sinh vien, bao ket qua; tra ve so sinh vien dang co
// (Main dua vao so nay de biet da du 10 sinh vien chua — khong phai goi them ham dem)
public int addStudent(StudentDTO studentDTO) {
    // Them duoc thi bao thanh cong
    try {
        saveEnrollment(studentDTO);
        studentView.setMessage(Message.SUCCESS_ADD_MESSAGE);
    } catch (Exception e) {
        // Trung ID cua nguoi khac hoac trung lan hoc thi bao loi
        studentView.setMessage(e.getMessage());
    }

    studentView.display();
    return studentRepository.getSize();
}</code></pre>
<pre class="trich"><code class="language-java">// Sua (U) hoac xoa (D) ban ghi so no cua sinh vien, bao ket qua
public void updateOrDeleteStudent(StudentDTO studentDTO) {
    // Lam viec nguoi dung chon; loi thi bao loi
    try {
        // U thi sua, D thi xoa
        if (studentDTO.getAction().equalsIgnoreCase(Constants.UPDATE)) {
            updateStudent(studentDTO);
            studentView.setMessage(Message.SUCCESS_UPDATE_MESSAGE);
        } else {
            // D: xoa ban ghi
            deleteStudent(studentDTO);
            studentView.setMessage(Message.SUCCESS_DELETE_MESSAGE);
        }
    } catch (Exception e) {
        // Trung lan hoc hoac khong co ban ghi thi bao loi
        studentView.setMessage(e.getMessage());
    }

    studentView.display();
}</code></pre>
<pre class="trich"><code class="language-java">// Them 1 lan hoc: tim trong kho, Service kiem + them, roi luu lai vao kho
private void saveEnrollment(StudentDTO studentDTO) throws Exception {
    // Kho tim theo ID, Service them lan hoc, kho luu (sinh vien moi thi them)
    studentRepository.save(studentService.addEnrollment(
            studentRepository.findById(studentDTO.getId()), studentDTO));
}</code></pre>
<h4>Step 5 — Main</h4>
<pre class="trich"><code class="language-java">// Tao sinh vien; tu khi du 10 sinh vien thi hoi Y/N sau moi lan nhap
private static void processAdd(Scanner sc, StudentController studentController) {
    StudentDTO studentDTO = null;
    int studentCount = 0;

    // Lap nhap tung sinh vien den khi chon N (chi hoi khi da du 10 sinh vien)
    while (true) {
        studentDTO = inputStudent(sc);
        studentCount = studentController.addStudent(studentDTO);

        // Du 10 sinh vien tro len ma chon N thi ve menu
        if ((studentCount &gt;= Constants.MIN_STUDENTS) &amp;&amp;
                !inputYesNo(sc).equalsIgnoreCase(Constants.YES)) {
            break;
        }
    }
}</code></pre>
<pre class="trich"><code class="language-java">// Tim sinh vien theo ID, chon ban ghi, roi sua (U) hoac xoa (D)
private static void processUpdateDelete(Scanner sc, StudentController studentController) {
    StudentDTO studentDTO = new StudentDTO();
    int recordCount = 0;

    studentDTO.setId(inputId(sc));
    recordCount = showRecords(studentController, studentDTO);

    // Khong co ID thi Controller da bao loi, ve menu
    if (recordCount == 0) {
        return;
    }

    studentDTO.setNo(inputRecordNo(sc, recordCount));
    studentDTO.setAction(inputUpdateDelete(sc));

    // Chon U thi nhap them hoc ky + mon moi
    if (studentDTO.getAction().equalsIgnoreCase(Constants.UPDATE)) {
        studentDTO.setSemester(inputSemester(sc, Message.EDIT_SEMESTER));
        studentDTO.setCourseName(inputCourse(sc));
    }

    studentController.updateOrDeleteStudent(studentDTO);
}</code></pre>
<div class="pitfall"><p>⚠️ Traps of this lab: numbering rows before sorting · <code>HashMap</code> for the report (random order) · <code>JAVA</code>/<code>.NET</code> instead of <code>Java</code>/<code>.Net</code> · a regex with <code>\\s</code> that accepts a name made of spaces (trim first) · " S10" refused because of the space (trim) · printing the whole list again after create/update/delete (a second render) · the service reaching into the repository.</p></div>`,
    `<h2>3. Code, theo thứ tự gõ</h2>
<h4>Bước 1 — model</h4>
<pre class="trich"><code class="language-java">// Kiem da co lan hoc trung hoc ky + mon chua (bo qua vi tri ignoreIndex khi dang sua)
public boolean isDuplicated(Enrollment newEnrollment, int ignoreIndex) {
    Enrollment enrollment = null;

    // Duyet tung lan hoc
    for (int i = 0; i &lt; enrollmentList.size(); i++) {
        enrollment = enrollmentList.get(i);

        // Trung hoc ky (khong phan biet hoa thuong) va trung mon, khac vi tri dang sua
        if ((i != ignoreIndex) &amp;&amp;
                (enrollment.getSemester().equalsIgnoreCase(newEnrollment.getSemester())) &amp;&amp;
                (enrollment.getCourse().equals(newEnrollment.getCourse()))) {
            return true;
        }
    }

    return false;
}</code></pre>
<h4>Bước 2 — repository</h4>
<pre class="trich"><code class="language-java">// Tim cac sinh vien co ten chua chuoi name (khong phan biet hoa thuong)
public ArrayList&lt;Student&gt; findByName(String name) {
    ArrayList&lt;Student&gt; foundList = new ArrayList&lt;&gt;();

    // Duyet tung sinh vien de so ten
    for (Student student : studentList) {
        // Ten chua chuoi can tim thi giu lai
        if (student.getStudentName().toLowerCase().contains(name.toLowerCase())) {
            foundList.add(student);
        }
    }

    return foundList;
}</code></pre>
<pre class="trich"><code class="language-java">// Luu sinh vien: chua co trong kho thi them, co roi thi giu nguyen
public void save(Student student) {
    // Chi them khi sinh vien chua nam trong kho
    if (!studentList.contains(student)) {
        studentList.add(student);
    }
}</code></pre>
<h4>Bước 3 — service</h4>
<pre class="trich"><code class="language-java">// Them lan hoc. student = sinh vien Controller tim trong kho (null neu chua co ID).
// Tra ve sinh vien (moi tao hoac da co) de Controller luu vao kho neu la sinh vien moi.
public Student addEnrollment(Student student, StudentDTO studentDTO) throws Exception {
    // Chua co ID thi tao sinh vien moi; co roi ma khac ten thi bao loi
    if (student == null) {
        student = new Student(studentDTO.getId(), studentDTO.getStudentName());
    } else if (!student.getStudentName().equalsIgnoreCase(studentDTO.getStudentName())) {
        // ID da co nhung ten khac thi bao ID thuoc ve nguoi khac
        throw new Exception(String.format(Message.ERROR_DUPLICATE_ID,
                student.getStudentName()));
    }

    student.addEnrollment(new Enrollment(studentDTO.getSemester(),
            studentDTO.getCourseName()));

    return student;
}</code></pre>
<pre class="trich"><code class="language-java">// Danh sach sinh vien tim duoc -&gt; bang sap xep theo ten bang Comparator, danh so lai
public ArrayList&lt;ResponseDTO&gt; sortByName(ArrayList&lt;Student&gt; studentList) {
    ArrayList&lt;ResponseDTO&gt; resultList = new ArrayList&lt;&gt;();

    // Doi tung sinh vien tim duoc thanh cac dong bang
    for (Student student : studentList) {
        resultList.addAll(convertToResponse(student));
    }

    // Sap xep theo ten: ghi de ham compare() cua Comparator nhu de yeu cau
    Collections.sort(resultList, new Comparator&lt;ResponseDTO&gt;() {
        // So 2 dong theo ten sinh vien
        @Override
        public int compare(ResponseDTO first, ResponseDTO second) {
            return first.getStudentName().compareTo(second.getStudentName());
        }
    });

    // Danh so thu tu lai sau khi sap xep
    for (int i = 0; i &lt; resultList.size(); i++) {
        resultList.get(i).setNo(i + 1);
    }

    return resultList;
}</code></pre>
<pre class="trich"><code class="language-java">// Bao cao: moi dong = ten | mon | so lan hoc mon do (giu thu tu nhap)
public ArrayList&lt;ResponseDTO&gt; buildReport(ArrayList&lt;Student&gt; studentList) {
    ArrayList&lt;ResponseDTO&gt; reportList = new ArrayList&lt;&gt;();
    LinkedHashMap&lt;String, Integer&gt; reportMap = new LinkedHashMap&lt;&gt;();
    String key = "";
    String[] partArray = null;
    ResponseDTO responseDTO = null;

    // Dem so lan hoc theo cap (ten, mon)
    for (Student student : studentList) {
        // Moi lan hoc cong 1 vao cap (ten, mon) cua no
        for (Enrollment enrollment : student.getEnrollmentList()) {
            key = String.format(Constants.REPORT_KEY_FORMAT, student.getStudentName(),
                    enrollment.getCourse().getName());
            reportMap.put(key, reportMap.getOrDefault(key, 0) + 1);
        }
    }

    // Doi tung cap (ten, mon) thanh 1 dong bao cao
    for (Map.Entry&lt;String, Integer&gt; entry : reportMap.entrySet()) {
        partArray = entry.getKey().split(Constants.REPORT_KEY_SEPARATOR);
        responseDTO = new ResponseDTO();
        responseDTO.setStudentName(partArray[0]);
        responseDTO.setCourseName(partArray[1]);
        responseDTO.setTotal(entry.getValue());
        reportList.add(responseDTO);
    }

    return reportList;
}</code></pre>
<pre class="trich"><code class="language-java">// Sua hoc ky + mon cua ban ghi so no cua sinh vien; trung voi ban ghi khac thi bao loi
public void updateEnrollment(Student student, StudentDTO studentDTO) throws Exception {
    Enrollment enrollment = null;
    Enrollment newEnrollment = new Enrollment(studentDTO.getSemester(),
            studentDTO.getCourseName());

    checkRecord(student, studentDTO);

    // Hoc ky + mon moi trung voi ban ghi khac cua chinh sinh vien thi bao loi
    if (student.isDuplicated(newEnrollment, studentDTO.getNo() - 1)) {
        throw new Exception(Message.ERROR_DUPLICATE);
    }

    enrollment = student.getEnrollmentList().get(studentDTO.getNo() - 1);
    enrollment.setSemester(newEnrollment.getSemester());
    enrollment.setCourse(newEnrollment.getCourse());
}</code></pre>
<h4>Bước 4 — view và controller</h4>
<pre class="trich"><code class="language-java">// In ket qua cua 1 luong, roi xoa trang thai de luong sau bat dau sach
public void display() {
    // Co cau thong bao thi chi in cau do
    if (!message.isEmpty()) {
        System.out.println(message);
    } else if (report) {
        // Bao cao: tieu de roi tung dong "Ten | Mon | Tong"
        System.out.println(Message.TITLE_REPORT);
        printRows();
    } else {
        // Bang sinh vien: dong tieu de cot roi tung dong
        System.out.println(String.format(Constants.TABLE_FORMAT, Message.COLUMN_NO,
                Message.COLUMN_NAME, Message.COLUMN_SEMESTER, Message.COLUMN_COURSE));
        printRows();
    }

    message = "";
    report = false;
}</code></pre>
<pre class="trich"><code class="language-java">// Them 1 lan hoc cho sinh vien, bao ket qua; tra ve so sinh vien dang co
// (Main dua vao so nay de biet da du 10 sinh vien chua — khong phai goi them ham dem)
public int addStudent(StudentDTO studentDTO) {
    // Them duoc thi bao thanh cong
    try {
        saveEnrollment(studentDTO);
        studentView.setMessage(Message.SUCCESS_ADD_MESSAGE);
    } catch (Exception e) {
        // Trung ID cua nguoi khac hoac trung lan hoc thi bao loi
        studentView.setMessage(e.getMessage());
    }

    studentView.display();
    return studentRepository.getSize();
}</code></pre>
<pre class="trich"><code class="language-java">// Sua (U) hoac xoa (D) ban ghi so no cua sinh vien, bao ket qua
public void updateOrDeleteStudent(StudentDTO studentDTO) {
    // Lam viec nguoi dung chon; loi thi bao loi
    try {
        // U thi sua, D thi xoa
        if (studentDTO.getAction().equalsIgnoreCase(Constants.UPDATE)) {
            updateStudent(studentDTO);
            studentView.setMessage(Message.SUCCESS_UPDATE_MESSAGE);
        } else {
            // D: xoa ban ghi
            deleteStudent(studentDTO);
            studentView.setMessage(Message.SUCCESS_DELETE_MESSAGE);
        }
    } catch (Exception e) {
        // Trung lan hoc hoac khong co ban ghi thi bao loi
        studentView.setMessage(e.getMessage());
    }

    studentView.display();
}</code></pre>
<pre class="trich"><code class="language-java">// Them 1 lan hoc: tim trong kho, Service kiem + them, roi luu lai vao kho
private void saveEnrollment(StudentDTO studentDTO) throws Exception {
    // Kho tim theo ID, Service them lan hoc, kho luu (sinh vien moi thi them)
    studentRepository.save(studentService.addEnrollment(
            studentRepository.findById(studentDTO.getId()), studentDTO));
}</code></pre>
<h4>Bước 5 — Main</h4>
<pre class="trich"><code class="language-java">// Tao sinh vien; tu khi du 10 sinh vien thi hoi Y/N sau moi lan nhap
private static void processAdd(Scanner sc, StudentController studentController) {
    StudentDTO studentDTO = null;
    int studentCount = 0;

    // Lap nhap tung sinh vien den khi chon N (chi hoi khi da du 10 sinh vien)
    while (true) {
        studentDTO = inputStudent(sc);
        studentCount = studentController.addStudent(studentDTO);

        // Du 10 sinh vien tro len ma chon N thi ve menu
        if ((studentCount &gt;= Constants.MIN_STUDENTS) &amp;&amp;
                !inputYesNo(sc).equalsIgnoreCase(Constants.YES)) {
            break;
        }
    }
}</code></pre>
<pre class="trich"><code class="language-java">// Tim sinh vien theo ID, chon ban ghi, roi sua (U) hoac xoa (D)
private static void processUpdateDelete(Scanner sc, StudentController studentController) {
    StudentDTO studentDTO = new StudentDTO();
    int recordCount = 0;

    studentDTO.setId(inputId(sc));
    recordCount = showRecords(studentController, studentDTO);

    // Khong co ID thi Controller da bao loi, ve menu
    if (recordCount == 0) {
        return;
    }

    studentDTO.setNo(inputRecordNo(sc, recordCount));
    studentDTO.setAction(inputUpdateDelete(sc));

    // Chon U thi nhap them hoc ky + mon moi
    if (studentDTO.getAction().equalsIgnoreCase(Constants.UPDATE)) {
        studentDTO.setSemester(inputSemester(sc, Message.EDIT_SEMESTER));
        studentDTO.setCourseName(inputCourse(sc));
    }

    studentController.updateOrDeleteStudent(studentDTO);
}</code></pre>
<div class="pitfall"><p>⚠️ Bẫy của bài: đánh số dòng trước khi sắp · dùng <code>HashMap</code> cho báo cáo (thứ tự ngẫu nhiên) · in <code>JAVA</code>/<code>.NET</code> thay vì <code>Java</code>/<code>.Net</code> · regex có <code>\\s</code> nhận tên toàn dấu cách (phải trim trước) · " S10" bị từ chối vì dấu cách (phải trim) · in lại cả danh sách sau khi tạo/sửa/xoá (lần render thứ hai) · service thò tay vào repository.</p></div>`),
    bi(`<h2>4. Run it for real</h2>
<details><summary>The whole run (181 lines, 54 keys)</summary>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">WELCOME TO STUDENT MANAGEMENT<br>
1. Create<br>
2. Find and Sort<br>
3. Update/Delete<br>
4. Report<br>
5. Exit<br>
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).<br>
Your choice: Student name | Course | Total of Course<br>
Dao Van Tuan | Java | 1<br>
Dao Van Tuan | .Net | 1<br>
Dao Van Tuan | C/C++ | 1<br>
Doan Duy Huy | Java | 2<br>
Le Thi Hoa | .Net | 1<br>
Le Thi Quynh | Java | 1<br>
Le Trong Nhat | .Net | 1<br>
Le Trong Nhat | Java | 1<br>
Le Van Quyen | Java | 1<br>
Tran Nhat Anh | Java | 1<br>
Nguyen Duc Huy | Java | 1<br>
Ngo Thanh Ha | Java | 1<br>
WELCOME TO STUDENT MANAGEMENT<br>
1. Create<br>
2. Find and Sort<br>
3. Update/Delete<br>
4. Report<br>
5. Exit<br>
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).<br>
Your choice: Student Name: No. &nbsp;&nbsp;Student Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Semester &nbsp;&nbsp;&nbsp;&nbsp;Course Name<br>
1 &nbsp;&nbsp;&nbsp;&nbsp;Dao Van Tuan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;Java<br>
2 &nbsp;&nbsp;&nbsp;&nbsp;Dao Van Tuan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Summer2022 &nbsp;&nbsp;.Net<br>
3 &nbsp;&nbsp;&nbsp;&nbsp;Dao Van Tuan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;C/C++<br>
4 &nbsp;&nbsp;&nbsp;&nbsp;Doan Duy Huy &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2021 &nbsp;&nbsp;&nbsp;&nbsp;Java<br>
5 &nbsp;&nbsp;&nbsp;&nbsp;Doan Duy Huy &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Spring2022 &nbsp;&nbsp;Java<br>
6 &nbsp;&nbsp;&nbsp;&nbsp;Le Thi Hoa &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;.Net<br>
7 &nbsp;&nbsp;&nbsp;&nbsp;Le Trong Nhat &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;.Net<br>
8 &nbsp;&nbsp;&nbsp;&nbsp;Le Trong Nhat &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Summer2022 &nbsp;&nbsp;Java<br>
9 &nbsp;&nbsp;&nbsp;&nbsp;Le Van Quyen &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;Java<br>
10 &nbsp;&nbsp;&nbsp;Ngo Thanh Ha &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;Java<br>
11 &nbsp;&nbsp;&nbsp;Tran Nhat Anh &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;Java<br>
WELCOME TO STUDENT MANAGEMENT<br>
1. Create<br>
2. Find and Sort<br>
3. Update/Delete<br>
4. Report<br>
5. Exit<br>
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).<br>
Your choice: Student Name: Ten chi gom chu cai khong dau, so va dau cach (vi du: Nguyen Van A), khong de trong. Moi nhap lai.<br>
Student Name: Khong co sinh vien nao co ten chua "zzz". Hay thu ten khac.<br>
WELCOME TO STUDENT MANAGEMENT<br>
1. Create<br>
2. Find and Sort<br>
3. Update/Delete<br>
4. Report<br>
5. Exit<br>
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).<br>
Your choice: Enter id: Student Name: Ten chi gom chu cai khong dau, so va dau cach (vi du: Nguyen Van A), khong de trong. Moi nhap lai.<br>
Student Name: Enter Semester: Hoc ky chi gom chu cai khong dau, so va dau cach (vi du: Fall2022), khong de trong. Moi nhap lai.<br>
Enter Semester: Only three courses:<br>
1. Java<br>
2. .Net<br>
3. C/C++<br>
Enter your choice: Ban phai nhap 1 so nguyen, khong nhap chu hay de trong. Moi nhap lai.<br>
Only three courses:<br>
1. Java<br>
2. .Net<br>
3. C/C++<br>
Enter your choice: So ban nhap nam ngoai khoang. Hay nhap 1 so tu 1 den 3. Moi nhap lai.<br>
Only three courses:<br>
1. Java<br>
2. .Net<br>
3. C/C++<br>
Enter your choice: Them sinh vien thanh cong.<br>
Do you want to continue (Y/N)? Chi duoc nhap Y (nhap tiep) hoac N (ve menu). Moi nhap lai.<br>
Do you want to continue (Y/N)? Enter id: Student Name: Enter Semester: Only three courses:<br>
1. Java<br>
2. .Net<br>
3. C/C++<br>
Enter your choice: ID nay da la cua sinh vien Dao Van Tuan. Hay nhap dung ten do hoac dung ID khac.<br>
Do you want to continue (Y/N)? Enter id: Student Name: Enter Semester: Only three courses:<br>
1. Java<br>
2. .Net<br>
3. C/C++<br>
Enter your choice: Sinh vien nay da hoc mon nay o hoc ky nay roi. Hay nhap hoc ky hoac mon khac.<br>
Do you want to continue (Y/N)? Enter id: ID phai la chu S roi toi so, vi du S1, S12 (khong co dau cach). Moi nhap lai.<br>
Enter id: Student Name: Enter Semester: Only three courses:<br>
1. Java<br>
2. .Net<br>
3. C/C++<br>
Enter your choice: Them sinh vien thanh cong.<br>
Do you want to continue (Y/N)? WELCOME TO STUDENT MANAGEMENT<br>
1. Create<br>
2. Find and Sort<br>
3. Update/Delete<br>
4. Report<br>
5. Exit<br>
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).<br>
Your choice: Student Name: No. &nbsp;&nbsp;Student Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Semester &nbsp;&nbsp;&nbsp;&nbsp;Course Name<br>
1 &nbsp;&nbsp;&nbsp;&nbsp;Nguyen Duc Huy &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;Java<br>
2 &nbsp;&nbsp;&nbsp;&nbsp;Nguyen Van Thanh Hai Long Name Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;Java<br>
WELCOME TO STUDENT MANAGEMENT<br>
1. Create<br>
2. Find and Sort<br>
3. Update/Delete<br>
4. Report<br>
5. Exit<br>
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).<br>
Your choice: Enter id: Khong co sinh vien nao co ID = s99. Hay chon chuc nang 2 hoac 4 de xem roi nhap lai.<br>
WELCOME TO STUDENT MANAGEMENT<br>
1. Create<br>
2. Find and Sort<br>
3. Update/Delete<br>
4. Report<br>
5. Exit<br>
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).<br>
Your choice: Enter id: No. &nbsp;&nbsp;Student Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Semester &nbsp;&nbsp;&nbsp;&nbsp;Course Name<br>
1 &nbsp;&nbsp;&nbsp;&nbsp;Dao Van Tuan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;Java<br>
2 &nbsp;&nbsp;&nbsp;&nbsp;Dao Van Tuan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Summer2022 &nbsp;&nbsp;.Net<br>
3 &nbsp;&nbsp;&nbsp;&nbsp;Dao Van Tuan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;C/C++<br>
Select record number (No.) to modify: So ban nhap nam ngoai khoang. Hay nhap 1 so tu 1 den 3. Moi nhap lai.<br>
Select record number (No.) to modify: Do you want to update (U) or delete (D) student: Chi duoc nhap U (sua) hoac D (xoa). Moi nhap lai.<br>
Do you want to update (U) or delete (D) student: Enter new Semester: Only three courses:<br>
1. Java<br>
2. .Net<br>
3. C/C++<br>
Enter your choice: Sinh vien nay da hoc mon nay o hoc ky nay roi. Hay nhap hoc ky hoac mon khac.<br>
WELCOME TO STUDENT MANAGEMENT<br>
1. Create<br>
2. Find and Sort<br>
3. Update/Delete<br>
4. Report<br>
5. Exit<br>
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).<br>
Your choice: Enter id: No. &nbsp;&nbsp;Student Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Semester &nbsp;&nbsp;&nbsp;&nbsp;Course Name<br>
1 &nbsp;&nbsp;&nbsp;&nbsp;Dao Van Tuan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;Java<br>
2 &nbsp;&nbsp;&nbsp;&nbsp;Dao Van Tuan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Summer2022 &nbsp;&nbsp;.Net<br>
3 &nbsp;&nbsp;&nbsp;&nbsp;Dao Van Tuan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;C/C++<br>
Select record number (No.) to modify: Do you want to update (U) or delete (D) student: Enter new Semester: Only three courses:<br>
1. Java<br>
2. .Net<br>
3. C/C++<br>
Enter your choice: Sua thong tin sinh vien thanh cong.<br>
WELCOME TO STUDENT MANAGEMENT<br>
1. Create<br>
2. Find and Sort<br>
3. Update/Delete<br>
4. Report<br>
5. Exit<br>
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).<br>
Your choice: Enter id: No. &nbsp;&nbsp;Student Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Semester &nbsp;&nbsp;&nbsp;&nbsp;Course Name<br>
1 &nbsp;&nbsp;&nbsp;&nbsp;Le Thi Hoa &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;.Net<br>
Select record number (No.) to modify: Do you want to update (U) or delete (D) student: Xoa ban ghi sinh vien thanh cong.<br>
WELCOME TO STUDENT MANAGEMENT<br>
1. Create<br>
2. Find and Sort<br>
3. Update/Delete<br>
4. Report<br>
5. Exit<br>
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).<br>
Your choice: Student name | Course | Total of Course<br>
Dao Van Tuan | Java | 1<br>
Dao Van Tuan | C/C++ | 2<br>
Doan Duy Huy | Java | 2<br>
Le Thi Quynh | Java | 1<br>
Le Trong Nhat | .Net | 1<br>
Le Trong Nhat | Java | 1<br>
Le Van Quyen | Java | 1<br>
Tran Nhat Anh | Java | 1<br>
Nguyen Duc Huy | Java | 1<br>
Ngo Thanh Ha | Java | 1<br>
Nguyen Van Thanh Hai Long Name | Java | 1<br>
Tran Van B | .Net | 1<br>
WELCOME TO STUDENT MANAGEMENT<br>
1. Create<br>
2. Find and Sort<br>
3. Update/Delete<br>
4. Report<br>
5. Exit<br>
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).<br>
Your choice: So ban nhap nam ngoai khoang. Hay nhap 1 so tu 1 den 5. Moi nhap lai.<br>
Your choice: Ban phai nhap 1 so nguyen, khong nhap chu hay de trong. Moi nhap lai.<br>
Your choice: Exiting program...</div>
</details>
<p>The report of the 13 sample enrollments (the student who took Java twice in two semesters counts 2):</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Your choice: Student name | Course | Total of Course<br>
Dao Van Tuan | Java | 1<br>
Dao Van Tuan | .Net | 1<br>
Dao Van Tuan | C/C++ | 1<br>
Doan Duy Huy | Java | 2<br>
Le Thi Hoa | .Net | 1<br>
Le Thi Quynh | Java | 1<br>
Le Trong Nhat | .Net | 1<br>
Le Trong Nhat | Java | 1<br>
Le Van Quyen | Java | 1<br>
Tran Nhat Anh | Java | 1<br>
Nguyen Duc Huy | Java | 1<br>
Ngo Thanh Ha | Java | 1<br>
…</div>
<p>Find "a", sorted by name and numbered after sorting:</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Your choice: Student Name: No. &nbsp;&nbsp;Student Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Semester &nbsp;&nbsp;&nbsp;&nbsp;Course Name<br>
1 &nbsp;&nbsp;&nbsp;&nbsp;Dao Van Tuan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;Java<br>
2 &nbsp;&nbsp;&nbsp;&nbsp;Dao Van Tuan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Summer2022 &nbsp;&nbsp;.Net<br>
3 &nbsp;&nbsp;&nbsp;&nbsp;Dao Van Tuan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;C/C++<br>
4 &nbsp;&nbsp;&nbsp;&nbsp;Doan Duy Huy &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2021 &nbsp;&nbsp;&nbsp;&nbsp;Java<br>
5 &nbsp;&nbsp;&nbsp;&nbsp;Doan Duy Huy &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Spring2022 &nbsp;&nbsp;Java<br>
6 &nbsp;&nbsp;&nbsp;&nbsp;Le Thi Hoa &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;.Net<br>
7 &nbsp;&nbsp;&nbsp;&nbsp;Le Trong Nhat &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;.Net<br>
8 &nbsp;&nbsp;&nbsp;&nbsp;Le Trong Nhat &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Summer2022 &nbsp;&nbsp;Java<br>
9 &nbsp;&nbsp;&nbsp;&nbsp;Le Van Quyen &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;Java<br>
10 &nbsp;&nbsp;&nbsp;Ngo Thanh Ha &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;Java<br>
11 &nbsp;&nbsp;&nbsp;Tran Nhat Anh &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;Java<br>
…</div>
<p>An ID that belongs to another student, then a duplicate semester + course — both refused after the four fields:</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Do you want to continue (Y/N)? Enter id: Student Name: Enter Semester: Only three courses:<br>
1. Java<br>
2. .Net<br>
3. C/C++<br>
Enter your choice: ID nay da la cua sinh vien Dao Van Tuan. Hay nhap dung ten do hoac dung ID khac.<br>
Do you want to continue (Y/N)? Enter id: Student Name: Enter Semester: Only three courses:<br>
1. Java<br>
2. .Net<br>
3. C/C++<br>
Enter your choice: Sinh vien nay da hoc mon nay o hoc ky nay roi. Hay nhap hoc ky hoac mon khac.<br>
…</div>
<p>Update/Delete: the records of s1, an out-of-range number, a wrong letter, a duplicate:</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Your choice: Enter id: No. &nbsp;&nbsp;Student Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Semester &nbsp;&nbsp;&nbsp;&nbsp;Course Name<br>
1 &nbsp;&nbsp;&nbsp;&nbsp;Dao Van Tuan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;Java<br>
2 &nbsp;&nbsp;&nbsp;&nbsp;Dao Van Tuan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Summer2022 &nbsp;&nbsp;.Net<br>
3 &nbsp;&nbsp;&nbsp;&nbsp;Dao Van Tuan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;C/C++<br>
Select record number (No.) to modify: So ban nhap nam ngoai khoang. Hay nhap 1 so tu 1 den 3. Moi nhap lai.<br>
Select record number (No.) to modify: Do you want to update (U) or delete (D) student: Chi duoc nhap U (sua) hoac D (xoa). Moi nhap lai.<br>
Do you want to update (U) or delete (D) student: Enter new Semester: Only three courses:<br>
1. Java<br>
2. .Net<br>
3. C/C++<br>
Enter your choice: Sinh vien nay da hoc mon nay o hoc ky nay roi. Hay nhap hoc ky hoac mon khac.<br>
…</div>
<pre><code class="language-bash">$ python3 lint.py MSSV_J1LP0021_StudentManagement</code></pre>
<div class="out">✓ MSSV_J1LP0021_StudentManagement — sạch</div>
<pre><code class="language-bash">$ ./check.sh        # Windows: check.bat · NetBeans: Run File on test/harness/CheckHarness.java</code></pre>
<div class="out">PASS: 181/181 dong khop expected.txt</div>
<h2>5. Before / after</h2>
<table>
<thead><tr><th>First version</th><th>Fixed</th><th>Why</th></tr></thead>
<tbody>
<tr><td><code>Comparable</code> + <code>compareTo</code> in ResponseDTO</td><td>anonymous <code>Comparator</code> + <code>compare()</code> passed to <code>Collections.sort</code></td><td>the brief names Comparator</td></tr>
<tr><td>numbered, then sorted (No. 11, 10…)</td><td>sorted, then numbered</td><td>the brief: "sorted by name"</td></tr>
<tr><td><code>HashMap</code> report, table format</td><td><code>LinkedHashMap</code>, <code>Name | Course | Total</code></td><td>brief format, same order every run</td></tr>
<tr><td><code>JAVA</code>, <code>.NET</code>, own menu text</td><td>enum names and menu copied from the brief</td><td>graded literally</td></tr>
<tr><td>Main called <code>getService().findByID()</code></td><td>Main talks only to the controller</td><td>checklist 1.1</td></tr>
<tr><td>service held the repository and called find/add/delete</td><td>controller holds the repository; service gets students as parameters</td><td>lecturer, 26/10 (P0011)</td></tr>
<tr><td>view took the message as a parameter; two prints per method</td><td>message as an attribute; one <code>display()</code> per flow</td><td>checklist 1.1</td></tr>
<tr><td>methods with 3–4 parameters (<code>processAdd(sc, manager, dto)</code>)</td><td>at most 2</td><td>rule V4</td></tr>
<tr><td><code>List</code>, <code>Map</code>, <code>findByID</code>, field <code>No</code></td><td><code>ArrayList</code>, <code>LinkedHashMap</code>, <code>findById</code>, <code>no</code></td><td>V5, 1.5</td></tr>
<tr><td>almost no comment, no Javadoc</td><td>Javadoc on every class, a comment on every block</td><td>1.6</td></tr>
</tbody>
</table>`,
    `<h2>4. Chạy thật</h2>
<details><summary>Toàn bộ lần chạy (181 dòng, 54 phím)</summary>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">WELCOME TO STUDENT MANAGEMENT<br>
1. Create<br>
2. Find and Sort<br>
3. Update/Delete<br>
4. Report<br>
5. Exit<br>
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).<br>
Your choice: Student name | Course | Total of Course<br>
Dao Van Tuan | Java | 1<br>
Dao Van Tuan | .Net | 1<br>
Dao Van Tuan | C/C++ | 1<br>
Doan Duy Huy | Java | 2<br>
Le Thi Hoa | .Net | 1<br>
Le Thi Quynh | Java | 1<br>
Le Trong Nhat | .Net | 1<br>
Le Trong Nhat | Java | 1<br>
Le Van Quyen | Java | 1<br>
Tran Nhat Anh | Java | 1<br>
Nguyen Duc Huy | Java | 1<br>
Ngo Thanh Ha | Java | 1<br>
WELCOME TO STUDENT MANAGEMENT<br>
1. Create<br>
2. Find and Sort<br>
3. Update/Delete<br>
4. Report<br>
5. Exit<br>
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).<br>
Your choice: Student Name: No. &nbsp;&nbsp;Student Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Semester &nbsp;&nbsp;&nbsp;&nbsp;Course Name<br>
1 &nbsp;&nbsp;&nbsp;&nbsp;Dao Van Tuan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;Java<br>
2 &nbsp;&nbsp;&nbsp;&nbsp;Dao Van Tuan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Summer2022 &nbsp;&nbsp;.Net<br>
3 &nbsp;&nbsp;&nbsp;&nbsp;Dao Van Tuan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;C/C++<br>
4 &nbsp;&nbsp;&nbsp;&nbsp;Doan Duy Huy &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2021 &nbsp;&nbsp;&nbsp;&nbsp;Java<br>
5 &nbsp;&nbsp;&nbsp;&nbsp;Doan Duy Huy &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Spring2022 &nbsp;&nbsp;Java<br>
6 &nbsp;&nbsp;&nbsp;&nbsp;Le Thi Hoa &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;.Net<br>
7 &nbsp;&nbsp;&nbsp;&nbsp;Le Trong Nhat &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;.Net<br>
8 &nbsp;&nbsp;&nbsp;&nbsp;Le Trong Nhat &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Summer2022 &nbsp;&nbsp;Java<br>
9 &nbsp;&nbsp;&nbsp;&nbsp;Le Van Quyen &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;Java<br>
10 &nbsp;&nbsp;&nbsp;Ngo Thanh Ha &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;Java<br>
11 &nbsp;&nbsp;&nbsp;Tran Nhat Anh &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;Java<br>
WELCOME TO STUDENT MANAGEMENT<br>
1. Create<br>
2. Find and Sort<br>
3. Update/Delete<br>
4. Report<br>
5. Exit<br>
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).<br>
Your choice: Student Name: Ten chi gom chu cai khong dau, so va dau cach (vi du: Nguyen Van A), khong de trong. Moi nhap lai.<br>
Student Name: Khong co sinh vien nao co ten chua "zzz". Hay thu ten khac.<br>
WELCOME TO STUDENT MANAGEMENT<br>
1. Create<br>
2. Find and Sort<br>
3. Update/Delete<br>
4. Report<br>
5. Exit<br>
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).<br>
Your choice: Enter id: Student Name: Ten chi gom chu cai khong dau, so va dau cach (vi du: Nguyen Van A), khong de trong. Moi nhap lai.<br>
Student Name: Enter Semester: Hoc ky chi gom chu cai khong dau, so va dau cach (vi du: Fall2022), khong de trong. Moi nhap lai.<br>
Enter Semester: Only three courses:<br>
1. Java<br>
2. .Net<br>
3. C/C++<br>
Enter your choice: Ban phai nhap 1 so nguyen, khong nhap chu hay de trong. Moi nhap lai.<br>
Only three courses:<br>
1. Java<br>
2. .Net<br>
3. C/C++<br>
Enter your choice: So ban nhap nam ngoai khoang. Hay nhap 1 so tu 1 den 3. Moi nhap lai.<br>
Only three courses:<br>
1. Java<br>
2. .Net<br>
3. C/C++<br>
Enter your choice: Them sinh vien thanh cong.<br>
Do you want to continue (Y/N)? Chi duoc nhap Y (nhap tiep) hoac N (ve menu). Moi nhap lai.<br>
Do you want to continue (Y/N)? Enter id: Student Name: Enter Semester: Only three courses:<br>
1. Java<br>
2. .Net<br>
3. C/C++<br>
Enter your choice: ID nay da la cua sinh vien Dao Van Tuan. Hay nhap dung ten do hoac dung ID khac.<br>
Do you want to continue (Y/N)? Enter id: Student Name: Enter Semester: Only three courses:<br>
1. Java<br>
2. .Net<br>
3. C/C++<br>
Enter your choice: Sinh vien nay da hoc mon nay o hoc ky nay roi. Hay nhap hoc ky hoac mon khac.<br>
Do you want to continue (Y/N)? Enter id: ID phai la chu S roi toi so, vi du S1, S12 (khong co dau cach). Moi nhap lai.<br>
Enter id: Student Name: Enter Semester: Only three courses:<br>
1. Java<br>
2. .Net<br>
3. C/C++<br>
Enter your choice: Them sinh vien thanh cong.<br>
Do you want to continue (Y/N)? WELCOME TO STUDENT MANAGEMENT<br>
1. Create<br>
2. Find and Sort<br>
3. Update/Delete<br>
4. Report<br>
5. Exit<br>
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).<br>
Your choice: Student Name: No. &nbsp;&nbsp;Student Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Semester &nbsp;&nbsp;&nbsp;&nbsp;Course Name<br>
1 &nbsp;&nbsp;&nbsp;&nbsp;Nguyen Duc Huy &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;Java<br>
2 &nbsp;&nbsp;&nbsp;&nbsp;Nguyen Van Thanh Hai Long Name Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;Java<br>
WELCOME TO STUDENT MANAGEMENT<br>
1. Create<br>
2. Find and Sort<br>
3. Update/Delete<br>
4. Report<br>
5. Exit<br>
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).<br>
Your choice: Enter id: Khong co sinh vien nao co ID = s99. Hay chon chuc nang 2 hoac 4 de xem roi nhap lai.<br>
WELCOME TO STUDENT MANAGEMENT<br>
1. Create<br>
2. Find and Sort<br>
3. Update/Delete<br>
4. Report<br>
5. Exit<br>
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).<br>
Your choice: Enter id: No. &nbsp;&nbsp;Student Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Semester &nbsp;&nbsp;&nbsp;&nbsp;Course Name<br>
1 &nbsp;&nbsp;&nbsp;&nbsp;Dao Van Tuan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;Java<br>
2 &nbsp;&nbsp;&nbsp;&nbsp;Dao Van Tuan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Summer2022 &nbsp;&nbsp;.Net<br>
3 &nbsp;&nbsp;&nbsp;&nbsp;Dao Van Tuan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;C/C++<br>
Select record number (No.) to modify: So ban nhap nam ngoai khoang. Hay nhap 1 so tu 1 den 3. Moi nhap lai.<br>
Select record number (No.) to modify: Do you want to update (U) or delete (D) student: Chi duoc nhap U (sua) hoac D (xoa). Moi nhap lai.<br>
Do you want to update (U) or delete (D) student: Enter new Semester: Only three courses:<br>
1. Java<br>
2. .Net<br>
3. C/C++<br>
Enter your choice: Sinh vien nay da hoc mon nay o hoc ky nay roi. Hay nhap hoc ky hoac mon khac.<br>
WELCOME TO STUDENT MANAGEMENT<br>
1. Create<br>
2. Find and Sort<br>
3. Update/Delete<br>
4. Report<br>
5. Exit<br>
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).<br>
Your choice: Enter id: No. &nbsp;&nbsp;Student Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Semester &nbsp;&nbsp;&nbsp;&nbsp;Course Name<br>
1 &nbsp;&nbsp;&nbsp;&nbsp;Dao Van Tuan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;Java<br>
2 &nbsp;&nbsp;&nbsp;&nbsp;Dao Van Tuan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Summer2022 &nbsp;&nbsp;.Net<br>
3 &nbsp;&nbsp;&nbsp;&nbsp;Dao Van Tuan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;C/C++<br>
Select record number (No.) to modify: Do you want to update (U) or delete (D) student: Enter new Semester: Only three courses:<br>
1. Java<br>
2. .Net<br>
3. C/C++<br>
Enter your choice: Sua thong tin sinh vien thanh cong.<br>
WELCOME TO STUDENT MANAGEMENT<br>
1. Create<br>
2. Find and Sort<br>
3. Update/Delete<br>
4. Report<br>
5. Exit<br>
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).<br>
Your choice: Enter id: No. &nbsp;&nbsp;Student Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Semester &nbsp;&nbsp;&nbsp;&nbsp;Course Name<br>
1 &nbsp;&nbsp;&nbsp;&nbsp;Le Thi Hoa &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;.Net<br>
Select record number (No.) to modify: Do you want to update (U) or delete (D) student: Xoa ban ghi sinh vien thanh cong.<br>
WELCOME TO STUDENT MANAGEMENT<br>
1. Create<br>
2. Find and Sort<br>
3. Update/Delete<br>
4. Report<br>
5. Exit<br>
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).<br>
Your choice: Student name | Course | Total of Course<br>
Dao Van Tuan | Java | 1<br>
Dao Van Tuan | C/C++ | 2<br>
Doan Duy Huy | Java | 2<br>
Le Thi Quynh | Java | 1<br>
Le Trong Nhat | .Net | 1<br>
Le Trong Nhat | Java | 1<br>
Le Van Quyen | Java | 1<br>
Tran Nhat Anh | Java | 1<br>
Nguyen Duc Huy | Java | 1<br>
Ngo Thanh Ha | Java | 1<br>
Nguyen Van Thanh Hai Long Name | Java | 1<br>
Tran Van B | .Net | 1<br>
WELCOME TO STUDENT MANAGEMENT<br>
1. Create<br>
2. Find and Sort<br>
3. Update/Delete<br>
4. Report<br>
5. Exit<br>
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).<br>
Your choice: So ban nhap nam ngoai khoang. Hay nhap 1 so tu 1 den 5. Moi nhap lai.<br>
Your choice: Ban phai nhap 1 so nguyen, khong nhap chu hay de trong. Moi nhap lai.<br>
Your choice: Exiting program...</div>
</details>
<p>Báo cáo của 13 lần học mẫu (sinh viên học Java ở hai học kỳ được đếm 2):</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Your choice: Student name | Course | Total of Course<br>
Dao Van Tuan | Java | 1<br>
Dao Van Tuan | .Net | 1<br>
Dao Van Tuan | C/C++ | 1<br>
Doan Duy Huy | Java | 2<br>
Le Thi Hoa | .Net | 1<br>
Le Thi Quynh | Java | 1<br>
Le Trong Nhat | .Net | 1<br>
Le Trong Nhat | Java | 1<br>
Le Van Quyen | Java | 1<br>
Tran Nhat Anh | Java | 1<br>
Nguyen Duc Huy | Java | 1<br>
Ngo Thanh Ha | Java | 1<br>
…</div>
<p>Tìm "a", sắp theo tên và đánh số sau khi sắp:</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Your choice: Student Name: No. &nbsp;&nbsp;Student Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Semester &nbsp;&nbsp;&nbsp;&nbsp;Course Name<br>
1 &nbsp;&nbsp;&nbsp;&nbsp;Dao Van Tuan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;Java<br>
2 &nbsp;&nbsp;&nbsp;&nbsp;Dao Van Tuan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Summer2022 &nbsp;&nbsp;.Net<br>
3 &nbsp;&nbsp;&nbsp;&nbsp;Dao Van Tuan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;C/C++<br>
4 &nbsp;&nbsp;&nbsp;&nbsp;Doan Duy Huy &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2021 &nbsp;&nbsp;&nbsp;&nbsp;Java<br>
5 &nbsp;&nbsp;&nbsp;&nbsp;Doan Duy Huy &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Spring2022 &nbsp;&nbsp;Java<br>
6 &nbsp;&nbsp;&nbsp;&nbsp;Le Thi Hoa &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;.Net<br>
7 &nbsp;&nbsp;&nbsp;&nbsp;Le Trong Nhat &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;.Net<br>
8 &nbsp;&nbsp;&nbsp;&nbsp;Le Trong Nhat &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Summer2022 &nbsp;&nbsp;Java<br>
9 &nbsp;&nbsp;&nbsp;&nbsp;Le Van Quyen &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;Java<br>
10 &nbsp;&nbsp;&nbsp;Ngo Thanh Ha &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;Java<br>
11 &nbsp;&nbsp;&nbsp;Tran Nhat Anh &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;Java<br>
…</div>
<p>Một mã thuộc sinh viên khác, rồi một cặp học kỳ + môn bị trùng — cả hai bị từ chối sau khi nhập đủ bốn ô:</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Do you want to continue (Y/N)? Enter id: Student Name: Enter Semester: Only three courses:<br>
1. Java<br>
2. .Net<br>
3. C/C++<br>
Enter your choice: ID nay da la cua sinh vien Dao Van Tuan. Hay nhap dung ten do hoac dung ID khac.<br>
Do you want to continue (Y/N)? Enter id: Student Name: Enter Semester: Only three courses:<br>
1. Java<br>
2. .Net<br>
3. C/C++<br>
Enter your choice: Sinh vien nay da hoc mon nay o hoc ky nay roi. Hay nhap hoc ky hoac mon khac.<br>
…</div>
<p>Update/Delete: các bản ghi của s1, một số ngoài khoảng, một chữ sai, một lần trùng:</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Your choice: Enter id: No. &nbsp;&nbsp;Student Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Semester &nbsp;&nbsp;&nbsp;&nbsp;Course Name<br>
1 &nbsp;&nbsp;&nbsp;&nbsp;Dao Van Tuan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;Java<br>
2 &nbsp;&nbsp;&nbsp;&nbsp;Dao Van Tuan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Summer2022 &nbsp;&nbsp;.Net<br>
3 &nbsp;&nbsp;&nbsp;&nbsp;Dao Van Tuan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fall2022 &nbsp;&nbsp;&nbsp;&nbsp;C/C++<br>
Select record number (No.) to modify: So ban nhap nam ngoai khoang. Hay nhap 1 so tu 1 den 3. Moi nhap lai.<br>
Select record number (No.) to modify: Do you want to update (U) or delete (D) student: Chi duoc nhap U (sua) hoac D (xoa). Moi nhap lai.<br>
Do you want to update (U) or delete (D) student: Enter new Semester: Only three courses:<br>
1. Java<br>
2. .Net<br>
3. C/C++<br>
Enter your choice: Sinh vien nay da hoc mon nay o hoc ky nay roi. Hay nhap hoc ky hoac mon khac.<br>
…</div>
<pre><code class="language-bash">$ python3 lint.py MSSV_J1LP0021_StudentManagement</code></pre>
<div class="out">✓ MSSV_J1LP0021_StudentManagement — sạch</div>
<pre><code class="language-bash">$ ./check.sh        # Windows: check.bat · NetBeans: Run File on test/harness/CheckHarness.java</code></pre>
<div class="out">PASS: 181/181 dong khop expected.txt</div>
<h2>5. Trước / sau</h2>
<table>
<thead><tr><th>Bản đầu</th><th>Đã sửa</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td><code>Comparable</code> + <code>compareTo</code> trong ResponseDTO</td><td><code>Comparator</code> vô danh + <code>compare()</code> truyền vào <code>Collections.sort</code></td><td>đề gọi tên Comparator</td></tr>
<tr><td>đánh số rồi mới sắp (No. 11, 10…)</td><td>sắp rồi mới đánh số</td><td>đề: "sắp theo tên"</td></tr>
<tr><td>báo cáo <code>HashMap</code>, dạng bảng</td><td><code>LinkedHashMap</code>, <code>Tên | Môn | Tổng</code></td><td>đúng định dạng đề, lần nào cũng cùng thứ tự</td></tr>
<tr><td><code>JAVA</code>, <code>.NET</code>, menu tự chế</td><td>tên môn và menu chép đúng đề</td><td>chấm theo đúng chữ</td></tr>
<tr><td>Main gọi <code>getService().findByID()</code></td><td>Main chỉ nói chuyện với controller</td><td>checklist 1.1</td></tr>
<tr><td>service giữ repository và tự gọi tìm/thêm/xoá</td><td>controller giữ repository; service nhận sinh viên qua tham số</td><td>thầy, 26/10 (P0011)</td></tr>
<tr><td>view nhận câu thông báo qua tham số; một hàm in hai lần</td><td>câu thông báo là thuộc tính; một <code>display()</code> mỗi luồng</td><td>checklist 1.1</td></tr>
<tr><td>hàm 3–4 tham số (<code>processAdd(sc, manager, dto)</code>)</td><td>tối đa 2</td><td>luật V4</td></tr>
<tr><td><code>List</code>, <code>Map</code>, <code>findByID</code>, trường <code>No</code></td><td><code>ArrayList</code>, <code>LinkedHashMap</code>, <code>findById</code>, <code>no</code></td><td>V5, 1.5</td></tr>
<tr><td>gần như không comment, không Javadoc</td><td>Javadoc mọi lớp, comment mỗi khối</td><td>1.6</td></tr>
</tbody>
</table>`),
    bi(`<h2>6. Debug it</h2>
<p>Breakpoint on the <code>return</code> inside <code>compare</code> → Ctrl+F5 → 2, "a" → each stop shows two rows (<code>first</code>, <code>second</code>) and the value returned: negative keeps <code>first</code> before <code>second</code>. Then a breakpoint on <code>reportMap.put</code> in <code>buildReport</code> → 4 → watch <code>reportMap</code> grow and "Doan Duy Huy#Java" become 2.</p>
<h2>7. The questions — answer out loud</h2>
<details><summary>Where is the Comparator, and how is it different from Comparable?</summary><p class="dap-an">✅ In <code>StudentService.sortByName</code>: an anonymous class overriding <code>compare(a, b)</code>, passed to <code>Collections.sort</code>. Comparable is the class comparing itself (<code>compareTo</code>, one fixed rule); Comparator is a separate rule you pass in — change the rule without touching the class. That is the Strategy pattern.</p></details>
<details><summary>The brief says Student has semester and courseName — why Enrollment?</summary><p class="dap-an">✅ One student studies several courses in several semesters. Keeping the name once and a list of (semester, course) avoids repeating it, makes "same semester + course twice" a check inside the student, and makes the report a count per course. (If the lecturer requires the flat class, ask him before changing — the service changes too.)</p></details>
<details><summary>Why is there a service in this lab?</summary><p class="dap-an">✅ There is business work beyond CRUD: duplicate checks, sorting with a Comparator, grouping and counting the report. The Guide: computations go to a service placed between the controller and the repository — and the service gets its data from the controller.</p></details>
<details><summary>How is the report counted, and why LinkedHashMap?</summary><p class="dap-an">✅ For every student × enrollment, key "name#course", <code>getOrDefault(key, 0) + 1</code>. <code>LinkedHashMap</code> keeps the insertion order: the report prints in the same order every time (a HashMap does not).</p></details>
<details><summary>Update/Delete prints twice — is that one render per flow?</summary><p class="dap-an">✅ The first print is a pre-check: the records of the ID, so the user can choose a number — impossible without seeing them. The second is the result of the update or delete. Each controller method calls <code>display()</code> once. If the lecturer wants one print only: remove the table and ask for the record number directly — the controller already returns how many records there are.</p></details>
<details><summary>Why does addStudent return an int?</summary><p class="dap-an">✅ Main must know when the 10th student exists to ask Y/N. Returning the count from the same call keeps "one controller call per flow" instead of calling a second method to count.</p></details>
<h2>8. Download</h2>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/lab211/v1/MSSV_J1LP0021_StudentManagement-solution.zip" target="_blank" rel="noopener">
<span class="lc-ico">✅</span>
<span class="lc-body"><span class="lc-title">MSSV_J1LP0021_StudentManagement-solution.zip</span><span class="lc-sub">NetBeans project (Java 8) · 13 files · harness/input.txt (54 test keys) · check.sh / check.bat</span></span>
<span class="lc-cta">Download</span>
</a>
<div class="callout"><p><strong>Next:</strong> J1.S.P0056 Worker Management — a classmate's passed solution, put through the checklist: what passed, what still breaks the rules, and the clean version.</p></div>`,
    `<h2>6. Debug</h2>
<p>Breakpoint ở dòng <code>return</code> trong <code>compare</code> → Ctrl+F5 → 2, "a" → mỗi lần dừng thấy hai dòng (<code>first</code>, <code>second</code>) và giá trị trả về: âm thì <code>first</code> đứng trước <code>second</code>. Rồi breakpoint ở <code>reportMap.put</code> trong <code>buildReport</code> → 4 → nhìn <code>reportMap</code> lớn dần và "Doan Duy Huy#Java" thành 2.</p>
<h2>7. Câu thầy hỏi — trả lời thành tiếng</h2>
<details><summary>Comparator ở đâu, khác Comparable thế nào?</summary><p class="dap-an">✅ Trong <code>StudentService.sortByName</code>: một lớp vô danh ghi đè <code>compare(a, b)</code>, truyền vào <code>Collections.sort</code>. Comparable là lớp tự so với chính nó (<code>compareTo</code>, một luật cố định); Comparator là luật so để riêng, truyền vào — đổi luật không phải sửa lớp. Đó là mẫu Strategy.</p></details>
<details><summary>Đề bảo Student có semester, courseName — sao em tách Enrollment?</summary><p class="dap-an">✅ Một sinh viên học nhiều môn ở nhiều học kỳ. Giữ tên một lần cùng danh sách (học kỳ, môn) thì không lặp tên, "trùng học kỳ + môn" thành phép kiểm ngay trong sinh viên, và báo cáo là đếm theo môn. (Nếu thầy bắt đúng lớp phẳng thì hỏi thầy trước khi sửa — service cũng đổi theo.)</p></details>
<details><summary>Sao bài này có service?</summary><p class="dap-an">✅ Có nghiệp vụ ngoài CRUD: kiểm trùng, sắp xếp bằng Comparator, gom nhóm và đếm báo cáo. Guide: tính toán đưa vào service nằm giữa controller và repository — và service nhận dữ liệu từ controller.</p></details>
<details><summary>Báo cáo đếm thế nào, sao LinkedHashMap?</summary><p class="dap-an">✅ Với mỗi sinh viên × lần học, khoá "tên#môn", <code>getOrDefault(key, 0) + 1</code>. <code>LinkedHashMap</code> giữ thứ tự thêm vào: báo cáo lần nào cũng in cùng một thứ tự (HashMap thì không).</p></details>
<details><summary>Update/Delete in hai lần — vậy có đúng "một lần mỗi luồng"?</summary><p class="dap-an">✅ Lần in đầu là kiểm trước: các bản ghi của mã đó để người dùng chọn số — không thấy thì không chọn được. Lần thứ hai là kết quả sửa hoặc xoá. Mỗi hàm controller gọi <code>display()</code> một lần. Nếu thầy muốn đúng một lần in: bỏ bảng, hỏi thẳng số bản ghi — controller đã trả về số bản ghi rồi.</p></details>
<details><summary>Sao addStudent trả về int?</summary><p class="dap-an">✅ Main phải biết lúc nào đủ 10 sinh viên để hỏi Y/N. Trả số lượng ngay trong lần gọi đó thì giữ được "mỗi luồng gọi controller một lần", khỏi gọi thêm một hàm đếm.</p></details>
<h2>8. Tệp tải về</h2>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/lab211/v1/MSSV_J1LP0021_StudentManagement-solution.zip" target="_blank" rel="noopener">
<span class="lc-ico">✅</span>
<span class="lc-body"><span class="lc-title">MSSV_J1LP0021_StudentManagement-solution.zip</span><span class="lc-sub">project NetBeans (Java 8) · 13 tệp · harness/input.txt (54 phím test) · check.sh / check.bat</span></span>
<span class="lc-cta">Tải về</span>
</a>
<div class="callout"><p><strong>Tiếp theo:</strong> J1.S.P0056 Worker Management — bài của một bạn cùng lớp đã pass, đem soát theo checklist: cái gì đã qua, cái gì vẫn phạm luật, và bản sạch.</p></div>`),
  ].join('\n'),
};

/* ───────── L.3 — 🎓 LAB211 J1.S.P0056 Worker Management: a passed classmate's solution through the checklist — salary history, sort by code, JDK 8 ───────── */
const L_l211_p0056 = {
  title: "L.3 — 🎓 LAB211 J1.S.P0056 Worker Management: a passed classmate's solution through the checklist — salary history, sort by code, JDK 8|||L.3 — 🎓 LAB211 J1.S.P0056 Quản lý công nhân: bài bạn đã pass đem soát checklist — lịch sử lương, sắp theo mã, JDK 8",
  slug: 'pro192-lab211-p0056-worker-management',
  type: 'VIDEO',
  description: 'Bài LAB211 J1.S.P0056 (70 LOC) đi từ một bài THẬT đã được thầy cho pass: đọc đề (thêm công nhân mã không trùng, tuổi 18–50, lương lớn hơn 0; tăng/giảm lương có lưu lịch sử; bảng lịch sử sắp theo mã), soát bài pass bằng công cụ của thầy (javac --release 8 từ chối text block, lint.py 115 vi phạm, service giữ repository, không sắp theo mã), rồi dựng bản sạch trên đúng khuôn đó: controller giữ repository, repository báo mã trùng / mã không có, service tính lương mới và dựng bảng sắp bằng Comparator, view in một lần mỗi luồng, Main hỏi lại từng ô, câu lỗi tiếng Việt cụ thể. Chạy thật khớp ví dụ của đề (1100, 1500, 1300), lint.py sạch, 25 mục 0 vi phạm, JDK 8 thật. Kèm câu thầy hay hỏi (tên biến workerService, vì sao lịch sử chép lương) và dự án tải về.',
  content: [
    bi(`<span class="eyebrow">🎓 LAB211 in practice · L.3 · J1.S.P0056</span>
<h2>Worker Management — from "passed" to "clean"</h2>
<p class="lead">This lab starts from something real: a classmate's solution that the lecturer accepted (70 LOC), after making him rename <code>service</code> to <code>workerService</code>. It passed — and it still breaks a dozen rules the same lecturer enforces on other days: the service holds the repository, the menu is a Java 15 text block that the lab's JDK 8 cannot compile, the history is not sorted by code as the brief asks. A pass on a lenient day is not a template.</p>
<p>So the lesson runs the lecturer's tools on that solution, then rebuilds it on the same skeleton, rule by rule. Plan about <strong>1 hour 30</strong> to retype, 20 minutes for the test keys.</p>`,
    `<span class="eyebrow">🎓 LAB211 thực chiến · L.3 · J1.S.P0056</span>
<h2>Quản lý công nhân — từ "đã pass" tới "sạch"</h2>
<p class="lead">Bài này bắt đầu từ một thứ có thật: bài của một bạn cùng lớp được thầy cho qua (70 LOC), sau khi thầy bắt đổi tên <code>service</code> thành <code>workerService</code>. Bài đã pass — và vẫn phạm cả chục luật mà cũng chính thầy bắt vào những hôm khác: service giữ repository, menu là text block của Java 15 mà JDK 8 phòng lab không biên dịch nổi, lịch sử không sắp theo mã như đề yêu cầu. Pass vào một hôm thầy chấm nhẹ không phải là khuôn mẫu.</p>
<p>Vì thế bài chạy công cụ kiểm của thầy lên bài đó, rồi dựng lại trên đúng bộ khung ấy, từng luật một. Dành khoảng <strong>1 giờ 30</strong> để gõ lại, 20 phút cho bộ phím test.</p>`),
    bi(`<h2>📑 Slide by slide — PRO192 · LAB211 P0056 (13 slides)</h2>
<p>The deck of this LAB211 lesson, made by CuongThai (it is not a school deck and not the lecturer's). Each slide is followed by its key idea and the explanation; every piece of code and every output on the slides comes from the real project in this lesson — checked by <code>lint.py</code> (the lecturer's rules), compiled with <code>javac --release 8</code> and run on a real JDK 8, like the machines in the lab room.</p>`,
    `<h2>📑 Học theo từng slide — PRO192 · LAB211 P0056 (13 slide)</h2>
<p>Bộ slide của bài LAB211 này do CuongThai dựng (không phải slide của trường, cũng không phải của thầy). Dưới mỗi slide là ý chính và lời giảng; mọi đoạn code, mọi output trên slide đều lấy từ đúng dự án trong bài — qua <code>lint.py</code> (luật của thầy), biên dịch bằng <code>javac --release 8</code> và chạy trên JDK 8 thật, giống máy phòng lab.</p>`),
    walk('l211-p0056', [
      [1, 'J1.S.P0056 — Worker Management',
        `<p class="y-chinh">🎯 Add workers, raise or lower a salary with a history, show the history sorted by code — and turn a lenient pass into a clean solution.</p>
<p>The deck: the brief and its example, what the lecturer's tools say about the passed version, the clean design, each layer, the real run, the questions.</p>`,
        `<p class="y-chinh">🎯 Thêm công nhân, tăng hoặc giảm lương có lưu lịch sử, xem lịch sử sắp theo mã — và biến một lần pass dễ dãi thành một lời giải sạch.</p>
<p>Bộ slide: đề và ví dụ của đề, công cụ của thầy nói gì về bản đã pass, thiết kế sạch, từng tầng, lần chạy thật, các câu hỏi.</p>`],
      [2, 'The brief',
        `<p class="y-chinh">🎯 Menu: 1 Add Worker · 2 Up salary · 3 Down salary · 4 Display Information salary · 5 Exit. A worker has Code, Name, Age, Salary, work location.</p>
<p>Add: the code is not empty and not duplicated, age 18 to 50, salary greater than 0. Up/Down: the code must exist, the amount greater than 0; every change is stored in the history with its status (UP/DOWN) and the date. Display: every change as a row "Code Name Age Salary Status Date", sorted by code. The prompts are copied from the brief, character for character ("Enter Salary: " with a space when adding, "Enter Salary:" without when changing).</p>`,
        `<p class="y-chinh">🎯 Menu: 1 Add Worker · 2 Up salary · 3 Down salary · 4 Display Information salary · 5 Exit. Một công nhân có Code, Name, Age, Salary, work location.</p>
<p>Add: mã không trống và không trùng, tuổi từ 18 tới 50, lương lớn hơn 0. Up/Down: mã phải tồn tại, số tiền lớn hơn 0; mỗi lần đổi lưu vào lịch sử kèm trạng thái (UP/DOWN) và ngày. Display: mỗi lần đổi là một dòng "Code Name Age Salary Status Date", sắp theo mã. Câu nhắc chép đúng đề từng ký tự ("Enter Salary: " có dấu cách khi thêm, "Enter Salary:" không có khi tăng/giảm).</p>`],
      [3, "The brief's example, by hand",
        `<p class="y-chinh">🎯 Add W 1 at 1000 and W 3 at 1400; Up W 1 +100 → 1100; Up W 1 +400 → 1500; Down W 3 −100 → 1300. The table has exactly those three rows, W 1 before W 3.</p>
<p>Two consequences for the design: adding a worker writes NO history row (the example shows only the three changes), and each history row must COPY the salary of that moment — if it read the worker's current salary, the first row would show 1500 too.</p>`,
        `<p class="y-chinh">🎯 Thêm W 1 lương 1000 và W 3 lương 1400; Up W 1 +100 → 1100; Up W 1 +400 → 1500; Down W 3 −100 → 1300. Bảng có đúng ba dòng đó, W 1 đứng trước W 3.</p>
<p>Hai hệ quả cho thiết kế: thêm công nhân KHÔNG ghi dòng lịch sử nào (ví dụ chỉ có ba lần đổi), và mỗi dòng lịch sử phải CHÉP lại mức lương của lúc đó — nếu đọc lương hiện tại của công nhân thì dòng đầu cũng hiện 1500.</p>`],
      [4, 'What the tools say about the passed version',
        `<p class="y-chinh">🎯 <code>javac --release 8</code>: "text blocks are not supported in -source 8" — it does not compile on the lab's JDK. <code>lint.py</code>: 115 violations (79 missing comments, 11 formatting, 10 List/Map, 6 hard-coded strings, 6 magic numbers…).</p>
<p>And what no tool sees: <code>WorkerService</code> creates and holds the <code>WorkerRepository</code>; the history is printed in <code>HashMap</code> order, not by code; adding a worker writes an extra "UP" row; messages like "Invalid number!". It passed because the lecturer looked mostly at the flow that day — the same points were rejected in other students' labs.</p>`,
        `<p class="y-chinh">🎯 <code>javac --release 8</code>: "text blocks are not supported in -source 8" — không biên dịch được trên JDK của phòng lab. <code>lint.py</code>: 115 vi phạm (79 thiếu comment, 11 định dạng, 10 List/Map, 6 chuỗi viết thẳng, 6 số viết thẳng…).</p>
<p>Và những gì công cụ không thấy: <code>WorkerService</code> tự tạo và giữ <code>WorkerRepository</code>; lịch sử in theo thứ tự của <code>HashMap</code>, không theo mã; thêm công nhân ghi thừa một dòng "UP"; câu báo kiểu "Invalid number!". Bài qua vì hôm đó thầy chủ yếu xem luồng chạy — đúng những điểm này đã bị bắt ở bài của bạn khác.</p>`],
      [5, 'The clean design',
        `<p class="y-chinh">🎯 Same classes as the passed version — <code>WorkerController</code>, <code>WorkerService</code>, <code>WorkerRepository</code>, <code>Worker</code> with its <code>SalaryHistory</code> list, the enum <code>SalaryStatus</code> — but the controller holds the repository and the service holds nothing.</p>
<p>One <code>WorkerRequestDTO</code> carries both requests (the five fields of Add, or code + status + amount of Up/Down). One <code>SalaryHistoryResponseDTO</code> is one row of the table, already formatted. <code>FormatUtils.formatMoney</code> prints 1100 and not 1100.0, with <code>Locale.US</code> so a Vietnamese Windows does not print 999,5.</p>`,
        `<p class="y-chinh">🎯 Đúng các lớp của bản đã pass — <code>WorkerController</code>, <code>WorkerService</code>, <code>WorkerRepository</code>, <code>Worker</code> cùng danh sách <code>SalaryHistory</code>, enum <code>SalaryStatus</code> — nhưng controller giữ repository và service không giữ gì.</p>
<p>Một <code>WorkerRequestDTO</code> chở cả hai loại yêu cầu (năm ô của Add, hoặc mã + trạng thái + số tiền của Up/Down). Một <code>SalaryHistoryResponseDTO</code> là một dòng bảng đã định dạng sẵn. <code>FormatUtils.formatMoney</code> in 1100 chứ không 1100.0, dùng <code>Locale.US</code> để máy Windows tiếng Việt không in 999,5.</p>`],
      [6, 'Model: the history copies the salary',
        `<p class="y-chinh">🎯 <code>Worker</code> keeps its five fields and an <code>ArrayList&lt;SalaryHistory&gt; salaryHistoryList</code>; <code>SalaryHistory</code> keeps the salary AFTER the change, the status and the date.</p>
<p>Both are JavaBeans (an empty public constructor, getters and setters — rule V10). The model adds a row with <code>addSalaryHistory</code>; it never prints and never decides a rule — "salary must stay positive" belongs to the service.</p>`,
        `<p class="y-chinh">🎯 <code>Worker</code> giữ năm thuộc tính và một <code>ArrayList&lt;SalaryHistory&gt; salaryHistoryList</code>; <code>SalaryHistory</code> giữ mức lương SAU lần đổi, trạng thái và ngày.</p>
<p>Cả hai là JavaBean (constructor rỗng public, getter và setter — luật V10). Model thêm một dòng bằng <code>addSalaryHistory</code>; nó không bao giờ in và không tự quyết luật nào — "lương phải còn dương" là việc của service.</p>`],
      [7, 'Repository: duplicate and missing codes',
        `<p class="y-chinh">🎯 <code>addWorker(dto)</code> throws "Ma [W 1] da co cong nhan khac…" when the code exists; <code>findWorker(code)</code> throws "Khong co cong nhan ma [W2]…" when it does not; <code>getWorkerList()</code> returns a copy of the workers.</p>
<p>Existence is a question about the stored data, so it is answered where the data is — the lecturer moved exactly this check into <code>TaskRepository</code> in P0071. The map is a <code>HashMap&lt;String, Worker&gt;</code> named <code>workerMap</code> (V5, 1.5): one step to find a code.</p>`,
        `<p class="y-chinh">🎯 <code>addWorker(dto)</code> ném "Ma [W 1] da co cong nhan khac…" khi mã đã có; <code>findWorker(code)</code> ném "Khong co cong nhan ma [W2]…" khi không có; <code>getWorkerList()</code> trả về bản sao danh sách công nhân.</p>
<p>Tồn tại hay không là câu hỏi về dữ liệu đang lưu, nên trả lời ở nơi giữ dữ liệu — thầy đã chuyển đúng phép kiểm này vào <code>TaskRepository</code> ở P0071. Map là <code>HashMap&lt;String, Worker&gt;</code> tên <code>workerMap</code> (V5, 1.5): một bước là tìm ra mã.</p>`],
      [8, 'Service: change a salary',
        `<p class="y-chinh">🎯 <code>changeSalary(worker, dto)</code>: new salary = salary + amount, or − amount for DOWN; a DOWN that leaves 0 or less throws; otherwise set the salary and add a <code>SalaryHistory</code> with <code>LocalDate.now()</code>.</p>
<p>The worker comes from the controller (which got it from the repository), so the service changes what it is given and imports no repository. Two parameters, not three: the brief's <code>changeSalary(status, code, amount)</code> keeps its name but takes the DTO (rule V4). It returns the new salary already formatted, a <code>String</code>, because the controller only needs words for its message.</p>`,
        `<p class="y-chinh">🎯 <code>changeSalary(worker, dto)</code>: lương mới = lương + số tiền, hoặc − số tiền nếu DOWN; DOWN mà còn 0 hoặc âm thì ném lỗi; không thì đặt lương mới và thêm một <code>SalaryHistory</code> với <code>LocalDate.now()</code>.</p>
<p>Công nhân do controller đưa tới (controller lấy từ repository), nên service sửa thứ được đưa và không import repository. Hai tham số, không phải ba: hàm <code>changeSalary(status, code, amount)</code> của đề giữ tên nhưng nhận DTO (luật V4). Nó trả về lương mới đã định dạng, một <code>String</code>, vì controller chỉ cần chữ cho câu báo.</p>`],
      [9, 'Service: the history, sorted by code',
        `<p class="y-chinh">🎯 <code>getInfomationSalary(workerList)</code> sorts the workers with <code>Collections.sort</code> and a <code>Comparator</code> on the code, then turns every history row of every worker into a <code>SalaryHistoryResponseDTO</code>.</p>
<p>Sorting the workers (not the rows) keeps each worker's rows in time order without a second key. The method keeps the brief's name, typo included (<code>Infomation</code>) — the brief imposes it. Dates are formatted <code>dd/MM/yyyy</code> like the example.</p>`,
        `<p class="y-chinh">🎯 <code>getInfomationSalary(workerList)</code> sắp công nhân bằng <code>Collections.sort</code> với một <code>Comparator</code> theo mã, rồi đổi mọi dòng lịch sử của mọi công nhân thành <code>SalaryHistoryResponseDTO</code>.</p>
<p>Sắp công nhân (chứ không sắp từng dòng) giữ các dòng của mỗi công nhân theo thứ tự thời gian mà không cần khoá phụ. Hàm giữ đúng tên của đề, cả lỗi chính tả (<code>Infomation</code>) — đề bắt tên đó. Ngày định dạng <code>dd/MM/yyyy</code> như ví dụ.</p>`],
      [10, 'Controller and view',
        `<p class="y-chinh">🎯 Three methods, three lines of logic each: <code>addWorker</code> (repository adds), <code>changeSalary</code> (repository finds → service changes), <code>displaySalaryHistory</code> (repository lists → service sorts and formats) — then one <code>display()</code>.</p>
<p>The view holds the history rows and a message: an empty history shows "Chua co lan tang/giam luong nao. Hay chon 2 hoac 3 truoc." instead of a header alone. The passed version said nothing after Add/Up/Down — now each one confirms, with the new salary.</p>`,
        `<p class="y-chinh">🎯 Ba hàm, mỗi hàm ba dòng xử lý: <code>addWorker</code> (repository thêm), <code>changeSalary</code> (repository tìm → service đổi), <code>displaySalaryHistory</code> (repository liệt kê → service sắp và định dạng) — rồi một lần <code>display()</code>.</p>
<p>View giữ các dòng lịch sử và một câu thông báo: lịch sử trống thì in "Chua co lan tang/giam luong nao. Hay chon 2 hoac 3 truoc." thay vì chỉ một dòng tiêu đề. Bản đã pass im lặng sau Add/Up/Down — giờ lần nào cũng báo, kèm lương mới.</p>`],
      [11, 'Main and Validation: ask again, field by field',
        `<p class="y-chinh">🎯 Each field has its own small loop (<code>inputCode</code>, <code>inputName</code>, <code>inputAge</code>, <code>inputSalary</code>, <code>inputLocation</code>, <code>inputAmount</code>): a wrong value prints why and asks THAT field again. Each case then calls the controller once.</p>
<p>Six helpers instead of one <code>inputText(sc, prompt, error)</code>: three parameters is what the lecturer forbids. <code>Validation</code> trims before checking (" 3" is a valid choice), refuses blanks with the field's own sentence, and keeps age and money rules in one place.</p>`,
        `<p class="y-chinh">🎯 Mỗi ô có vòng lặp nhỏ riêng (<code>inputCode</code>, <code>inputName</code>, <code>inputAge</code>, <code>inputSalary</code>, <code>inputLocation</code>, <code>inputAmount</code>): gõ sai thì in lý do và hỏi lại ĐÚNG ô đó. Rồi mỗi case gọi controller một lần.</p>
<p>Sáu hàm nhỏ thay cho một hàm <code>inputText(sc, prompt, error)</code>: ba tham số là thứ thầy cấm. <code>Validation</code> trim trước khi kiểm (" 3" vẫn là lựa chọn hợp lệ), từ chối ô trống bằng câu riêng của ô đó, và giữ luật tuổi, luật tiền ở một chỗ.</p>`],
      [12, 'The real run, lint and JDK 8',
        `<p class="y-chinh">🎯 The brief's example comes out row for row: W 1 1100 UP, W 1 1500 UP, W 3 1300 DOWN — even though W 3 was added first.</p>
<p>Plus every error once: empty history, menu 9 and abc, empty code, age 17, 51, abc, salary 0 and −5, empty location, duplicate W 1, unknown W2, amount xyz and 0, a decrease of 2000 from 1400. <code>lint.py</code> clean, 25 paper items 0 violations, a real JDK 8 prints the same lines — the date column shows the day of the run (written dd/MM/yyyy below).</p>`,
        `<p class="y-chinh">🎯 Ví dụ của đề ra đúng từng dòng: W 1 1100 UP, W 1 1500 UP, W 3 1300 DOWN — dù W 3 được thêm trước.</p>
<p>Cộng mọi lỗi một lần: lịch sử trống, menu 9 và abc, mã trống, tuổi 17, 51, abc, lương 0 và −5, nơi làm việc trống, trùng W 1, không có W2, số tiền xyz và 0, giảm 2000 khi lương là 1400. <code>lint.py</code> sạch, 25 mục tờ giấy 0 vi phạm, JDK 8 thật in đúng các dòng đó — cột ngày là ngày chạy (bên dưới viết là dd/MM/yyyy).</p>`],
      [13, 'What the lecturer asks',
        `<p class="y-chinh">🎯 "Why workerService and not service?", "Why does the history copy the salary?", "Why a service here?", "Where is the sort?", "Decrease more than the salary?"</p>
<p>The naming answer is the one the lecturer actually asked for in this lab: a variable is named after its class — <code>workerService</code>, <code>workerView</code>, <code>workerController</code> — so anyone reading a line knows which object it is. NetBeans: Refactor → Rename (Ctrl+R) changes every use at once.</p>`,
        `<p class="y-chinh">🎯 "Sao đặt workerService mà không service?", "Sao lịch sử chép lại lương?", "Sao bài này có service?", "Sắp xếp ở đâu?", "Giảm nhiều hơn lương thì sao?"</p>
<p>Câu đặt tên là câu thầy đã hỏi thật ở bài này: biến đặt theo tên lớp — <code>workerService</code>, <code>workerView</code>, <code>workerController</code> — để ai đọc một dòng cũng biết đó là đối tượng nào. NetBeans: Refactor → Rename (Ctrl+R) đổi mọi chỗ dùng cùng lúc.</p>`],
    ]),
    bi(`<h2>1. The brief</h2>
<table>
<thead><tr><th>The brief says</th><th>Where it lives</th></tr></thead>
<tbody>
<tr><td>Add Worker: code not empty, not duplicated</td><td><code>Validation.getRequired</code> (empty) + <code>WorkerRepository.addWorker</code> (duplicate)</td></tr>
<tr><td>age 18 to 50, salary greater than 0</td><td><code>Validation.getAge</code>, <code>Validation.getPositiveMoney</code> + <code>Constants.MIN_AGE</code>, <code>MAX_AGE</code></td></tr>
<tr><td><code>addWorker(Worker worker) throws Exception</code></td><td><code>WorkerRepository.addWorker(WorkerRequestDTO)</code> — same name, DTO instead of model (the Guide's flow)</td></tr>
<tr><td><code>changeSalary(SalaryStatus status, String code, double amount)</code></td><td><code>WorkerService.changeSalary(Worker, WorkerRequestDTO)</code> — same name, 2 parameters (V4)</td></tr>
<tr><td><code>getInfomationSalary()</code> sorted by id</td><td><code>WorkerService.getInfomationSalary(ArrayList&lt;Worker&gt;)</code> + Comparator on the code</td></tr>
<tr><td>enum <code>SalaryStatus</code> (UP, DOWN)</td><td><code>constants/SalaryStatus.java</code></td></tr>
<tr><td>history: Code Name Age Salary Status Date</td><td><code>SalaryHistoryResponseDTO.toString()</code> with <code>Constants.ROW_FORMAT</code></td></tr>
</tbody>
</table>
<h2>2. What the passed version still breaks</h2>
<p>The project as it was accepted, names hidden, compiled for the lab's JDK:</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")</code></pre>
<div class="out">src/constants/Message.java:14: error: text blocks are not supported in -source 8<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= """<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;(use -source 15 or higher to enable text blocks)<br>
1 error</div>
<p>And the lecturer's rules (the first 12 of 116 lines):</p>
<pre><code class="language-bash">$ python3 lint.py MSSV_J1SP0056_WorkerManagement</code></pre>
<div class="out">✗ MSSV_J1SP0056_WorkerManagement — 115 vi phạm<br>
&nbsp;&nbsp;[FORMAT] src/constants/Message.java:34 — dòng dài 125 ký tự (&gt; 100)<br>
&nbsp;&nbsp;[FORMAT] src/constants/Message.java:46 — dòng dài 102 ký tự (&gt; 100)<br>
&nbsp;&nbsp;[COMMENT] src/constants/Message.java:9 — hàm/constructor 'Message' thiếu comment<br>
&nbsp;&nbsp;[FORMAT] src/constants/SalaryStatus.java:13 — thiếu dấu cách quanh ngoặc nhọn<br>
&nbsp;&nbsp;[COMMENT] src/constants/SalaryStatus.java:4 — enum SalaryStatus thiếu Javadoc đầu lớp<br>
&nbsp;&nbsp;[FORMAT] src/controller/WorkerController.java:22 — thiếu dấu cách sau từ khoá: 'if ('<br>
&nbsp;&nbsp;[FORMAT] src/controller/WorkerController.java:35 — thiếu dấu cách sau từ khoá: 'if ('<br>
&nbsp;&nbsp;[FORMAT] src/controller/WorkerController.java:46 — thiếu dấu cách sau từ khoá: 'if ('<br>
&nbsp;&nbsp;[COMMENT] src/controller/WorkerController.java:14 — trường 'workerView' thiếu comment<br>
&nbsp;&nbsp;[COMMENT] src/controller/WorkerController.java:10 — class WorkerController thiếu Javadoc đầu lớp<br>
&nbsp;&nbsp;[COMMENT] src/controller/WorkerController.java:38 — 'else' thiếu comment (thầy: comment cho mọi block/rẽ nhánh)<br>
…</div>
<table>
<thead><tr><th>In the passed version</th><th>Rule</th><th>In the clean version</th></tr></thead>
<tbody>
<tr><td><code>WorkerService</code> creates and holds <code>WorkerRepository</code></td><td>lecturer, 26/10: CRUD not in the service</td><td><code>WorkerController</code> holds the repository</td></tr>
<tr><td><code>MENU = """ … """</code> (text block)</td><td>the lab runs JDK 8</td><td>ordinary strings joined with +</td></tr>
<tr><td><code>List</code>, <code>Map</code>, <code>List&lt;SalaryHistory&gt; history</code></td><td>V5, 1.5</td><td><code>ArrayList</code>, <code>HashMap</code>, <code>salaryHistoryList</code></td></tr>
<tr><td>history printed in HashMap order</td><td>brief: sorted by id</td><td><code>Collections.sort</code> + Comparator on the code</td></tr>
<tr><td>Add writes an "UP" row with the starting salary</td><td>brief's example: 3 rows</td><td>Add writes no history row</td></tr>
<tr><td>"Invalid number!", "Value is out of allowed range"</td><td>lecturer, 05/10: say what is wrong and what to type</td><td>"Ban phai nhap 1 so (vi du: 25, 1000)…"</td></tr>
<tr><td><code>input.equals(null)</code></td><td>null.equals → NullPointerException</td><td><code>input.trim().isEmpty()</code></td></tr>
<tr><td><code>getChoice(sc.nextLine(), 1, 5)</code>, <code>age &lt; 18</code></td><td>2.10, MAGIC</td><td><code>Constants.MENU_MIN</code>, <code>MIN_AGE</code></td></tr>
<tr><td>Add/Up/Down print nothing</td><td>test keys</td><td>"Da them cong nhan [W 1].", "… luong moi 1100."</td></tr>
<tr><td>79 methods/fields/branches without comment, no Javadoc</td><td>1.6</td><td>Javadoc + one comment per block</td></tr>
</tbody>
</table>`,
    `<h2>1. Đề bài</h2>
<table>
<thead><tr><th>Đề nói</th><th>Nằm ở đâu</th></tr></thead>
<tbody>
<tr><td>Add Worker: mã không trống, không trùng</td><td><code>Validation.getRequired</code> (trống) + <code>WorkerRepository.addWorker</code> (trùng)</td></tr>
<tr><td>tuổi 18 tới 50, lương lớn hơn 0</td><td><code>Validation.getAge</code>, <code>Validation.getPositiveMoney</code> + <code>Constants.MIN_AGE</code>, <code>MAX_AGE</code></td></tr>
<tr><td><code>addWorker(Worker worker) throws Exception</code></td><td><code>WorkerRepository.addWorker(WorkerRequestDTO)</code> — giữ tên, nhận DTO thay vì model (luồng của Guide)</td></tr>
<tr><td><code>changeSalary(SalaryStatus status, String code, double amount)</code></td><td><code>WorkerService.changeSalary(Worker, WorkerRequestDTO)</code> — giữ tên, 2 tham số (V4)</td></tr>
<tr><td><code>getInfomationSalary()</code> sắp theo mã</td><td><code>WorkerService.getInfomationSalary(ArrayList&lt;Worker&gt;)</code> + Comparator theo mã</td></tr>
<tr><td>enum <code>SalaryStatus</code> (UP, DOWN)</td><td><code>constants/SalaryStatus.java</code></td></tr>
<tr><td>lịch sử: Code Name Age Salary Status Date</td><td><code>SalaryHistoryResponseDTO.toString()</code> với <code>Constants.ROW_FORMAT</code></td></tr>
</tbody>
</table>
<h2>2. Bản đã pass vẫn phạm gì</h2>
<p>Dự án đúng như lúc được chấp nhận, đã ẩn tên, biên dịch cho JDK phòng lab:</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")</code></pre>
<div class="out">src/constants/Message.java:14: error: text blocks are not supported in -source 8<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= """<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;(use -source 15 or higher to enable text blocks)<br>
1 error</div>
<p>Và luật của thầy (những dòng đầu trong 116 dòng):</p>
<pre><code class="language-bash">$ python3 lint.py MSSV_J1SP0056_WorkerManagement</code></pre>
<div class="out">✗ MSSV_J1SP0056_WorkerManagement — 115 vi phạm<br>
&nbsp;&nbsp;[FORMAT] src/constants/Message.java:34 — dòng dài 125 ký tự (&gt; 100)<br>
&nbsp;&nbsp;[FORMAT] src/constants/Message.java:46 — dòng dài 102 ký tự (&gt; 100)<br>
&nbsp;&nbsp;[COMMENT] src/constants/Message.java:9 — hàm/constructor 'Message' thiếu comment<br>
&nbsp;&nbsp;[FORMAT] src/constants/SalaryStatus.java:13 — thiếu dấu cách quanh ngoặc nhọn<br>
&nbsp;&nbsp;[COMMENT] src/constants/SalaryStatus.java:4 — enum SalaryStatus thiếu Javadoc đầu lớp<br>
&nbsp;&nbsp;[FORMAT] src/controller/WorkerController.java:22 — thiếu dấu cách sau từ khoá: 'if ('<br>
&nbsp;&nbsp;[FORMAT] src/controller/WorkerController.java:35 — thiếu dấu cách sau từ khoá: 'if ('<br>
&nbsp;&nbsp;[FORMAT] src/controller/WorkerController.java:46 — thiếu dấu cách sau từ khoá: 'if ('<br>
&nbsp;&nbsp;[COMMENT] src/controller/WorkerController.java:14 — trường 'workerView' thiếu comment<br>
&nbsp;&nbsp;[COMMENT] src/controller/WorkerController.java:10 — class WorkerController thiếu Javadoc đầu lớp<br>
&nbsp;&nbsp;[COMMENT] src/controller/WorkerController.java:38 — 'else' thiếu comment (thầy: comment cho mọi block/rẽ nhánh)<br>
…</div>
<table>
<thead><tr><th>Trong bản đã pass</th><th>Luật</th><th>Trong bản sạch</th></tr></thead>
<tbody>
<tr><td><code>WorkerService</code> tự tạo và giữ <code>WorkerRepository</code></td><td>thầy, 26/10: CRUD không nằm trong service</td><td><code>WorkerController</code> giữ repository</td></tr>
<tr><td><code>MENU = """ … """</code> (text block)</td><td>phòng lab chạy JDK 8</td><td>chuỗi thường nối bằng +</td></tr>
<tr><td><code>List</code>, <code>Map</code>, <code>List&lt;SalaryHistory&gt; history</code></td><td>V5, 1.5</td><td><code>ArrayList</code>, <code>HashMap</code>, <code>salaryHistoryList</code></td></tr>
<tr><td>lịch sử in theo thứ tự HashMap</td><td>đề: sắp theo mã</td><td><code>Collections.sort</code> + Comparator theo mã</td></tr>
<tr><td>Add ghi một dòng "UP" lương khởi điểm</td><td>ví dụ của đề: 3 dòng</td><td>Add không ghi dòng lịch sử nào</td></tr>
<tr><td>"Invalid number!", "Value is out of allowed range"</td><td>thầy, 05/10: nói sai gì và phải nhập gì</td><td>"Ban phai nhap 1 so (vi du: 25, 1000)…"</td></tr>
<tr><td><code>input.equals(null)</code></td><td>null.equals → NullPointerException</td><td><code>input.trim().isEmpty()</code></td></tr>
<tr><td><code>getChoice(sc.nextLine(), 1, 5)</code>, <code>age &lt; 18</code></td><td>2.10, MAGIC</td><td><code>Constants.MENU_MIN</code>, <code>MIN_AGE</code></td></tr>
<tr><td>Add/Up/Down không in gì</td><td>khi test phím</td><td>"Da them cong nhan [W 1].", "… luong moi 1100."</td></tr>
<tr><td>79 hàm/trường/nhánh thiếu comment, không Javadoc</td><td>1.6</td><td>Javadoc + một comment mỗi khối</td></tr>
</tbody>
</table>`),
    bi(`<h2>3. Class design</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/591d8e3ec445ba14eb0468dddcf6c042f8099970.svg" alt="P0056: the same classes as the passed version, the lecturer's layering — the controller holds the repository" loading="lazy" /><p class="chu-thich">🧩 P0056: the same classes as the passed version, the lecturer's layering — the controller holds the repository</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title J1.S.P0056 Worker Management — the lecturer's layering on the passed solution
package main {
  class Main &lt;&lt;final&gt;&gt; {
    + {static} main(args : String[]) : void
    - {static} inputWorker(sc : Scanner) : WorkerRequestDTO
    - {static} inputSalaryChange(sc : Scanner, status : SalaryStatus) : WorkerRequestDTO
  }
}
package controller {
  class WorkerController {
    - workerRepository : WorkerRepository
    - workerService : WorkerService
    - workerView : WorkerView
    + addWorker(workerRequestDTO : WorkerRequestDTO) : void
    + changeSalary(workerRequestDTO : WorkerRequestDTO) : void
    + displaySalaryHistory() : void
  }
}
package repository {
  class WorkerRepository {
    - workerMap : HashMap&lt;String, Worker&gt;
    + addWorker(workerRequestDTO : WorkerRequestDTO) : void
    + findWorker(code : String) : Worker
    + getWorkerList() : ArrayList&lt;Worker&gt;
  }
}
package service {
  class WorkerService {
    - dateFormatter : DateTimeFormatter
    + changeSalary(worker : Worker, workerRequestDTO : WorkerRequestDTO) : String
    + getInfomationSalary(workerList : ArrayList&lt;Worker&gt;) : ArrayList&lt;SalaryHistoryResponseDTO&gt;
  }
}
package model {
  class Worker {
    - code : String
    - name : String
    - age : int
    - salary : double
    - workLocation : String
    - salaryHistoryList : ArrayList&lt;SalaryHistory&gt;
  }
  class SalaryHistory {
    - salary : double
    - status : SalaryStatus
    - date : LocalDate
  }
}
package constants {
  enum SalaryStatus {
    UP
    DOWN
  }
}
package view {
  class WorkerView {
    - historyList : ArrayList&lt;SalaryHistoryResponseDTO&gt;
    - message : String
    + display() : void
  }
}
package dto {
  class WorkerRequestDTO
  class SalaryHistoryResponseDTO {
    + toString() : String
  }
}
Main ..&gt; WorkerController : one call per case
WorkerController *-- WorkerRepository : add / find / list (CRUD)
WorkerController *-- WorkerService : new salary, sorted table
WorkerController *-- WorkerView : display() once
WorkerRepository o-- "0..*" Worker
Worker *-- "0..*" SalaryHistory : each Up/Down adds one
SalaryHistory --&gt; SalaryStatus
WorkerService ..&gt; Worker : changes what it is given
@enduml</code></pre></details>
<h2>4. The code, model first</h2>
<h4>Step 1 — model</h4>
<pre class="trich"><code class="language-java">public class SalaryHistory {

    // Luong sau lan doi nay (giu nguyen du sau nay luong doi tiep)
    private double salary;

    // UP hoac DOWN
    private SalaryStatus status;

    // Ngay doi luong
    private LocalDate date;

    // Constructor rong (JavaBean)
    public SalaryHistory() {
    }

    // Constructor day du thuoc tinh
    public SalaryHistory(double salary, SalaryStatus status, LocalDate date) {
        this.salary = salary;
        this.status = status;
        this.date = date;
    }</code></pre>
<pre class="trich"><code class="language-java">// Ghi them 1 lan doi luong vao cuoi lich su
public void addSalaryHistory(SalaryHistory salaryHistory) {
    salaryHistoryList.add(salaryHistory);
}</code></pre>
<h4>Step 2 — repository</h4>
<pre class="trich"><code class="language-java">// Them cong nhan tu phieu Main da kiem; ma da co thi bao loi (de: addWorker)
public void addWorker(WorkerRequestDTO workerRequestDTO) throws Exception {
    Worker worker = null;

    // Ma da co cong nhan khac thi khong them
    if (workerMap.containsKey(workerRequestDTO.getCode())) {
        throw new Exception(String.format(Message.CODE_DUPLICATE,
                workerRequestDTO.getCode()));
    }

    worker = new Worker(workerRequestDTO.getCode(), workerRequestDTO.getName(),
            workerRequestDTO.getAge(), workerRequestDTO.getSalary(),
            workerRequestDTO.getWorkLocation());
    workerMap.put(worker.getCode(), worker);
}</code></pre>
<pre class="trich"><code class="language-java">// Tim cong nhan theo ma; khong co thi bao loi
public Worker findWorker(String code) throws Exception {
    Worker worker = workerMap.get(code);

    // Khong co ma nay trong kho
    if (worker == null) {
        throw new Exception(String.format(Message.CODE_NOT_EXIST, code));
    }

    return worker;
}</code></pre>
<h4>Step 3 — service</h4>
<pre class="trich"><code class="language-java">// Tang/giam luong cong nhan theo phieu (de: changeSalary), ghi 1 dong lich su,
// tra ve luong moi DA DINH DANG (String: Controller chi can chu de bao lai)
public String changeSalary(Worker worker, WorkerRequestDTO workerRequestDTO)
        throws Exception {
    double newSalary = worker.getSalary() + workerRequestDTO.getAmount();

    // Giam luong: tru di, va luong moi phai con lon hon 0
    if (workerRequestDTO.getStatus() == SalaryStatus.DOWN) {
        newSalary = worker.getSalary() - workerRequestDTO.getAmount();

        // Giam het luong (hoac am) thi khong cho
        if (newSalary &lt;= 0) {
            throw new Exception(String.format(Message.SALARY_NOT_ENOUGH, worker.getCode(),
                    FormatUtils.formatMoney(worker.getSalary())));
        }
    }

    worker.setSalary(newSalary);
    worker.addSalaryHistory(new SalaryHistory(newSalary, workerRequestDTO.getStatus(),
            LocalDate.now()));
    return FormatUtils.formatMoney(newSalary);
}</code></pre>
<pre class="trich"><code class="language-java">// Bang lich su luong (de: getInfomationSalary): sap cong nhan theo ma, moi lan doi 1 dong
public ArrayList&lt;SalaryHistoryResponseDTO&gt; getInfomationSalary(ArrayList&lt;Worker&gt; workerList) {
    ArrayList&lt;SalaryHistoryResponseDTO&gt; rowList = new ArrayList&lt;&gt;();

    // Sap theo ma (de: "sort by id"), ghi de compare() cua Comparator
    Collections.sort(workerList, new Comparator&lt;Worker&gt;() {
        // So 2 cong nhan theo ma
        @Override
        public int compare(Worker first, Worker second) {
            return first.getCode().compareTo(second.getCode());
        }
    });

    // Moi cong nhan, moi lan doi luong la 1 dong (giu thu tu thoi gian)
    for (Worker worker : workerList) {
        // Doi tung lan doi luong thanh 1 dong bang
        for (SalaryHistory salaryHistory : worker.getSalaryHistoryList()) {
            rowList.add(toResponseDTO(worker, salaryHistory));
        }
    }

    return rowList;
}</code></pre>
<h4>Step 4 — view and controller</h4>
<pre class="trich"><code class="language-java">// Chuc nang 2, 3: kho tim cong nhan, Service tang/giam + ghi lich su, View bao luong moi
public void changeSalary(WorkerRequestDTO workerRequestDTO) throws Exception {
    String newSalary = workerService.changeSalary(
            workerRepository.findWorker(workerRequestDTO.getCode()), workerRequestDTO);

    // Bao luong moi
    workerView.setMessage(String.format(Message.CHANGE_SUCCESS, workerRequestDTO.getCode(),
            newSalary));
    workerView.display();
}</code></pre>
<pre class="trich"><code class="language-java">// Chuc nang 4: kho lay het cong nhan, Service dung bang sap theo ma, View in
public void displaySalaryHistory() {
    ArrayList&lt;SalaryHistoryResponseDTO&gt; historyList
            = workerService.getInfomationSalary(workerRepository.getWorkerList());

    // Chua co lan doi luong nao thi bao, co thi in bang
    if (historyList.isEmpty()) {
        workerView.setMessage(Message.NO_HISTORY);
    } else {
        // Co lich su: dua bang cho view
        workerView.setHistoryList(historyList);
    }

    workerView.display();
}</code></pre>
<pre class="trich"><code class="language-java">// In ket qua cua 1 luong roi xoa cau thong bao de luong sau bat dau sach
public void display() {
    // Co cau thong bao thi chi in cau do
    if (!message.isEmpty()) {
        System.out.println(message);
    } else {
        // Bang: dong tieu de cot roi tung dong lich su
        System.out.println(String.format(Constants.HEADER_FORMAT, Message.LABEL_CODE,
                Message.LABEL_NAME, Message.LABEL_AGE, Message.LABEL_SALARY,
                Message.LABEL_STATUS, Message.LABEL_DATE));

        // Moi lan doi luong 1 dong
        for (SalaryHistoryResponseDTO row : historyList) {
            System.out.println(row);
        }
    }

    message = "";
}</code></pre>
<h4>Step 5 — Validation and Main</h4>
<pre class="trich"><code class="language-java">// Kiem so tien la so thuc lon hon 0; khong duong thi bao dung cau loi cua o do
public static double getPositiveMoney(String input, String errorMessage) throws Exception {
    double money = 0;

    // Doi chuoi sang so thuc
    try {
        money = Double.parseDouble(input.trim());
    } catch (NumberFormatException e) {
        // Go chu hoac de trong
        throw new Exception(Message.INVALID_NUMBER);
    }

    // Bang 0 hoac am thi bao loi cua o dang nhap
    if (money &lt;= 0) {
        throw new Exception(errorMessage);
    }

    return money;
}</code></pre>
<pre class="trich"><code class="language-java">// Chay chuong trinh: lap menu den khi chon 5
public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    WorkerController workerController = new WorkerController();
    boolean running = true;
    int choice = 0;

    // Hien lai menu sau moi chuc nang, den khi chon thoat
    while (running) {
        System.out.println(Message.MENU);
        choice = inputChoice(sc);

        // Loi tu kho/service (ma trung, ma khong co, giam qua luong) in o catch
        try {
            // Moi lua chon goi controller dung 1 lan
            switch (choice) {
                // 1: nhap 5 o roi them cong nhan
                case Constants.MENU_ADD:
                    workerController.addWorker(inputWorker(sc));
                    break;

                // 2: nhap ma + so tien roi tang luong
                case Constants.MENU_UP:
                    workerController.changeSalary(inputSalaryChange(sc, SalaryStatus.UP));
                    break;

                // 3: nhap ma + so tien roi giam luong
                case Constants.MENU_DOWN:
                    workerController.changeSalary(inputSalaryChange(sc, SalaryStatus.DOWN));
                    break;

                // 4: in bang lich su luong
                case Constants.MENU_DISPLAY:
                    System.out.println(Message.TITLE_DISPLAY);
                    workerController.displaySalaryHistory();
                    break;

                // 5: dung vong lap
                case Constants.MENU_EXIT:
                    running = false;
                    System.out.println(Message.GOODBYE);
                    break;

                // Khong xay ra: inputChoice chi tra 1..5
                default:
                    break;
            }
        } catch (Exception e) {
            // Cau loi da viet san o Message, nem tu kho hoac service
            System.out.println(e.getMessage());
        }
    }
}</code></pre>
<pre class="trich"><code class="language-java">// Chuc nang 2, 3: tieu de roi ma + so tien; status cho biet tang hay giam
private static WorkerRequestDTO inputSalaryChange(Scanner sc, SalaryStatus status) {
    WorkerRequestDTO workerRequestDTO = new WorkerRequestDTO();

    System.out.println(Message.TITLE_CHANGE);
    workerRequestDTO.setStatus(status);
    workerRequestDTO.setCode(inputCode(sc));
    workerRequestDTO.setAmount(inputAmount(sc));
    return workerRequestDTO;
}</code></pre>
<div class="pitfall"><p>⚠️ Traps of this lab: reading the salary from the worker when printing the history (every row shows today's salary) · a history row on Add · sorting the rows instead of the workers (rows of one worker lose their time order unless the sort is stable) · <code>"Enter Salary: "</code> vs <code>"Enter Salary:"</code> · 1100.0 instead of 1100 · 999,5 on a Vietnamese Windows without <code>Locale.US</code> · <code>Double.parseDouble("abc")</code> without catching <code>NumberFormatException</code>.</p></div>`,
    `<h2>3. Thiết kế lớp</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/591d8e3ec445ba14eb0468dddcf6c042f8099970.svg" alt="P0056: đúng các lớp của bản đã pass, chia tầng theo thầy — controller giữ repository" loading="lazy" /><p class="chu-thich">🧩 P0056: đúng các lớp của bản đã pass, chia tầng theo thầy — controller giữ repository</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title J1.S.P0056 Worker Management — the lecturer's layering on the passed solution
package main {
  class Main &lt;&lt;final&gt;&gt; {
    + {static} main(args : String[]) : void
    - {static} inputWorker(sc : Scanner) : WorkerRequestDTO
    - {static} inputSalaryChange(sc : Scanner, status : SalaryStatus) : WorkerRequestDTO
  }
}
package controller {
  class WorkerController {
    - workerRepository : WorkerRepository
    - workerService : WorkerService
    - workerView : WorkerView
    + addWorker(workerRequestDTO : WorkerRequestDTO) : void
    + changeSalary(workerRequestDTO : WorkerRequestDTO) : void
    + displaySalaryHistory() : void
  }
}
package repository {
  class WorkerRepository {
    - workerMap : HashMap&lt;String, Worker&gt;
    + addWorker(workerRequestDTO : WorkerRequestDTO) : void
    + findWorker(code : String) : Worker
    + getWorkerList() : ArrayList&lt;Worker&gt;
  }
}
package service {
  class WorkerService {
    - dateFormatter : DateTimeFormatter
    + changeSalary(worker : Worker, workerRequestDTO : WorkerRequestDTO) : String
    + getInfomationSalary(workerList : ArrayList&lt;Worker&gt;) : ArrayList&lt;SalaryHistoryResponseDTO&gt;
  }
}
package model {
  class Worker {
    - code : String
    - name : String
    - age : int
    - salary : double
    - workLocation : String
    - salaryHistoryList : ArrayList&lt;SalaryHistory&gt;
  }
  class SalaryHistory {
    - salary : double
    - status : SalaryStatus
    - date : LocalDate
  }
}
package constants {
  enum SalaryStatus {
    UP
    DOWN
  }
}
package view {
  class WorkerView {
    - historyList : ArrayList&lt;SalaryHistoryResponseDTO&gt;
    - message : String
    + display() : void
  }
}
package dto {
  class WorkerRequestDTO
  class SalaryHistoryResponseDTO {
    + toString() : String
  }
}
Main ..&gt; WorkerController : one call per case
WorkerController *-- WorkerRepository : add / find / list (CRUD)
WorkerController *-- WorkerService : new salary, sorted table
WorkerController *-- WorkerView : display() once
WorkerRepository o-- "0..*" Worker
Worker *-- "0..*" SalaryHistory : each Up/Down adds one
SalaryHistory --&gt; SalaryStatus
WorkerService ..&gt; Worker : changes what it is given
@enduml</code></pre></details>
<h2>4. Code, model trước</h2>
<h4>Bước 1 — model</h4>
<pre class="trich"><code class="language-java">public class SalaryHistory {

    // Luong sau lan doi nay (giu nguyen du sau nay luong doi tiep)
    private double salary;

    // UP hoac DOWN
    private SalaryStatus status;

    // Ngay doi luong
    private LocalDate date;

    // Constructor rong (JavaBean)
    public SalaryHistory() {
    }

    // Constructor day du thuoc tinh
    public SalaryHistory(double salary, SalaryStatus status, LocalDate date) {
        this.salary = salary;
        this.status = status;
        this.date = date;
    }</code></pre>
<pre class="trich"><code class="language-java">// Ghi them 1 lan doi luong vao cuoi lich su
public void addSalaryHistory(SalaryHistory salaryHistory) {
    salaryHistoryList.add(salaryHistory);
}</code></pre>
<h4>Bước 2 — repository</h4>
<pre class="trich"><code class="language-java">// Them cong nhan tu phieu Main da kiem; ma da co thi bao loi (de: addWorker)
public void addWorker(WorkerRequestDTO workerRequestDTO) throws Exception {
    Worker worker = null;

    // Ma da co cong nhan khac thi khong them
    if (workerMap.containsKey(workerRequestDTO.getCode())) {
        throw new Exception(String.format(Message.CODE_DUPLICATE,
                workerRequestDTO.getCode()));
    }

    worker = new Worker(workerRequestDTO.getCode(), workerRequestDTO.getName(),
            workerRequestDTO.getAge(), workerRequestDTO.getSalary(),
            workerRequestDTO.getWorkLocation());
    workerMap.put(worker.getCode(), worker);
}</code></pre>
<pre class="trich"><code class="language-java">// Tim cong nhan theo ma; khong co thi bao loi
public Worker findWorker(String code) throws Exception {
    Worker worker = workerMap.get(code);

    // Khong co ma nay trong kho
    if (worker == null) {
        throw new Exception(String.format(Message.CODE_NOT_EXIST, code));
    }

    return worker;
}</code></pre>
<h4>Bước 3 — service</h4>
<pre class="trich"><code class="language-java">// Tang/giam luong cong nhan theo phieu (de: changeSalary), ghi 1 dong lich su,
// tra ve luong moi DA DINH DANG (String: Controller chi can chu de bao lai)
public String changeSalary(Worker worker, WorkerRequestDTO workerRequestDTO)
        throws Exception {
    double newSalary = worker.getSalary() + workerRequestDTO.getAmount();

    // Giam luong: tru di, va luong moi phai con lon hon 0
    if (workerRequestDTO.getStatus() == SalaryStatus.DOWN) {
        newSalary = worker.getSalary() - workerRequestDTO.getAmount();

        // Giam het luong (hoac am) thi khong cho
        if (newSalary &lt;= 0) {
            throw new Exception(String.format(Message.SALARY_NOT_ENOUGH, worker.getCode(),
                    FormatUtils.formatMoney(worker.getSalary())));
        }
    }

    worker.setSalary(newSalary);
    worker.addSalaryHistory(new SalaryHistory(newSalary, workerRequestDTO.getStatus(),
            LocalDate.now()));
    return FormatUtils.formatMoney(newSalary);
}</code></pre>
<pre class="trich"><code class="language-java">// Bang lich su luong (de: getInfomationSalary): sap cong nhan theo ma, moi lan doi 1 dong
public ArrayList&lt;SalaryHistoryResponseDTO&gt; getInfomationSalary(ArrayList&lt;Worker&gt; workerList) {
    ArrayList&lt;SalaryHistoryResponseDTO&gt; rowList = new ArrayList&lt;&gt;();

    // Sap theo ma (de: "sort by id"), ghi de compare() cua Comparator
    Collections.sort(workerList, new Comparator&lt;Worker&gt;() {
        // So 2 cong nhan theo ma
        @Override
        public int compare(Worker first, Worker second) {
            return first.getCode().compareTo(second.getCode());
        }
    });

    // Moi cong nhan, moi lan doi luong la 1 dong (giu thu tu thoi gian)
    for (Worker worker : workerList) {
        // Doi tung lan doi luong thanh 1 dong bang
        for (SalaryHistory salaryHistory : worker.getSalaryHistoryList()) {
            rowList.add(toResponseDTO(worker, salaryHistory));
        }
    }

    return rowList;
}</code></pre>
<h4>Bước 4 — view và controller</h4>
<pre class="trich"><code class="language-java">// Chuc nang 2, 3: kho tim cong nhan, Service tang/giam + ghi lich su, View bao luong moi
public void changeSalary(WorkerRequestDTO workerRequestDTO) throws Exception {
    String newSalary = workerService.changeSalary(
            workerRepository.findWorker(workerRequestDTO.getCode()), workerRequestDTO);

    // Bao luong moi
    workerView.setMessage(String.format(Message.CHANGE_SUCCESS, workerRequestDTO.getCode(),
            newSalary));
    workerView.display();
}</code></pre>
<pre class="trich"><code class="language-java">// Chuc nang 4: kho lay het cong nhan, Service dung bang sap theo ma, View in
public void displaySalaryHistory() {
    ArrayList&lt;SalaryHistoryResponseDTO&gt; historyList
            = workerService.getInfomationSalary(workerRepository.getWorkerList());

    // Chua co lan doi luong nao thi bao, co thi in bang
    if (historyList.isEmpty()) {
        workerView.setMessage(Message.NO_HISTORY);
    } else {
        // Co lich su: dua bang cho view
        workerView.setHistoryList(historyList);
    }

    workerView.display();
}</code></pre>
<pre class="trich"><code class="language-java">// In ket qua cua 1 luong roi xoa cau thong bao de luong sau bat dau sach
public void display() {
    // Co cau thong bao thi chi in cau do
    if (!message.isEmpty()) {
        System.out.println(message);
    } else {
        // Bang: dong tieu de cot roi tung dong lich su
        System.out.println(String.format(Constants.HEADER_FORMAT, Message.LABEL_CODE,
                Message.LABEL_NAME, Message.LABEL_AGE, Message.LABEL_SALARY,
                Message.LABEL_STATUS, Message.LABEL_DATE));

        // Moi lan doi luong 1 dong
        for (SalaryHistoryResponseDTO row : historyList) {
            System.out.println(row);
        }
    }

    message = "";
}</code></pre>
<h4>Bước 5 — Validation và Main</h4>
<pre class="trich"><code class="language-java">// Kiem so tien la so thuc lon hon 0; khong duong thi bao dung cau loi cua o do
public static double getPositiveMoney(String input, String errorMessage) throws Exception {
    double money = 0;

    // Doi chuoi sang so thuc
    try {
        money = Double.parseDouble(input.trim());
    } catch (NumberFormatException e) {
        // Go chu hoac de trong
        throw new Exception(Message.INVALID_NUMBER);
    }

    // Bang 0 hoac am thi bao loi cua o dang nhap
    if (money &lt;= 0) {
        throw new Exception(errorMessage);
    }

    return money;
}</code></pre>
<pre class="trich"><code class="language-java">// Chay chuong trinh: lap menu den khi chon 5
public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    WorkerController workerController = new WorkerController();
    boolean running = true;
    int choice = 0;

    // Hien lai menu sau moi chuc nang, den khi chon thoat
    while (running) {
        System.out.println(Message.MENU);
        choice = inputChoice(sc);

        // Loi tu kho/service (ma trung, ma khong co, giam qua luong) in o catch
        try {
            // Moi lua chon goi controller dung 1 lan
            switch (choice) {
                // 1: nhap 5 o roi them cong nhan
                case Constants.MENU_ADD:
                    workerController.addWorker(inputWorker(sc));
                    break;

                // 2: nhap ma + so tien roi tang luong
                case Constants.MENU_UP:
                    workerController.changeSalary(inputSalaryChange(sc, SalaryStatus.UP));
                    break;

                // 3: nhap ma + so tien roi giam luong
                case Constants.MENU_DOWN:
                    workerController.changeSalary(inputSalaryChange(sc, SalaryStatus.DOWN));
                    break;

                // 4: in bang lich su luong
                case Constants.MENU_DISPLAY:
                    System.out.println(Message.TITLE_DISPLAY);
                    workerController.displaySalaryHistory();
                    break;

                // 5: dung vong lap
                case Constants.MENU_EXIT:
                    running = false;
                    System.out.println(Message.GOODBYE);
                    break;

                // Khong xay ra: inputChoice chi tra 1..5
                default:
                    break;
            }
        } catch (Exception e) {
            // Cau loi da viet san o Message, nem tu kho hoac service
            System.out.println(e.getMessage());
        }
    }
}</code></pre>
<pre class="trich"><code class="language-java">// Chuc nang 2, 3: tieu de roi ma + so tien; status cho biet tang hay giam
private static WorkerRequestDTO inputSalaryChange(Scanner sc, SalaryStatus status) {
    WorkerRequestDTO workerRequestDTO = new WorkerRequestDTO();

    System.out.println(Message.TITLE_CHANGE);
    workerRequestDTO.setStatus(status);
    workerRequestDTO.setCode(inputCode(sc));
    workerRequestDTO.setAmount(inputAmount(sc));
    return workerRequestDTO;
}</code></pre>
<div class="pitfall"><p>⚠️ Bẫy của bài: đọc lương của công nhân lúc in lịch sử (dòng nào cũng hiện lương hôm nay) · ghi dòng lịch sử khi Add · sắp các dòng thay vì sắp công nhân (các dòng của một công nhân mất thứ tự thời gian nếu phép sắp không ổn định) · <code>"Enter Salary: "</code> khác <code>"Enter Salary:"</code> · in 1100.0 thay vì 1100 · 999,5 trên Windows tiếng Việt khi thiếu <code>Locale.US</code> · <code>Double.parseDouble("abc")</code> mà không bắt <code>NumberFormatException</code>.</p></div>`),
    bi(`<h2>5. Run it for real</h2>
<details><summary>The whole run (101 lines)</summary>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">======== Worker Management =========<br>
1. Add Worker<br>
2. Up salary<br>
3. Down salary<br>
4. Display Information salary<br>
5. Exit<br>
Enter your choice:--------------------Display Information Salary-----------------------<br>
Chua co lan tang/giam luong nao. Hay chon 2 hoac 3 truoc.<br>
======== Worker Management =========<br>
1. Add Worker<br>
2. Up salary<br>
3. Down salary<br>
4. Display Information salary<br>
5. Exit<br>
Enter your choice:Lua chon nam ngoai khoang. Hay nhap 1 so tu 1 den 5. Moi nhap lai.<br>
Enter your choice:Ban phai nhap 1 so (vi du: 25, 1000), khong nhap chu hay de trong. Moi nhap lai.<br>
Enter your choice:--------- Add Worker ----------<br>
Enter Code:Enter Name:Enter Age:Enter Salary: Enter work location:Da them cong nhan [W 3].<br>
======== Worker Management =========<br>
1. Add Worker<br>
2. Up salary<br>
3. Down salary<br>
4. Display Information salary<br>
5. Exit<br>
Enter your choice:--------- Add Worker ----------<br>
Enter Code:Enter Name:Enter Age:Enter Salary: Enter work location:Da them cong nhan [W 1].<br>
======== Worker Management =========<br>
1. Add Worker<br>
2. Up salary<br>
3. Down salary<br>
4. Display Information salary<br>
5. Exit<br>
Enter your choice:--------- Add Worker ----------<br>
Enter Code:Ma cong nhan khong duoc de trong (vi du: W1). Moi nhap lai.<br>
Enter Code:Enter Name:Enter Age:Tuoi phai tu 18 den 50. Moi nhap lai.<br>
Enter Age:Tuoi phai tu 18 den 50. Moi nhap lai.<br>
Enter Age:Ban phai nhap 1 so (vi du: 25, 1000), khong nhap chu hay de trong. Moi nhap lai.<br>
Enter Age:Enter Salary: Luong phai lon hon 0 (vi du: 1000). Moi nhap lai.<br>
Enter Salary: Luong phai lon hon 0 (vi du: 1000). Moi nhap lai.<br>
Enter Salary: Enter work location:Noi lam viec khong duoc de trong (vi du: Hanoi). Moi nhap lai.<br>
Enter work location:Ma [W 1] da co cong nhan khac. Hay chon lai chuc nang 1 va nhap ma khac.<br>
======== Worker Management =========<br>
1. Add Worker<br>
2. Up salary<br>
3. Down salary<br>
4. Display Information salary<br>
5. Exit<br>
Enter your choice:------- Up/Down Salary --------<br>
Enter Code:Enter Salary:Khong co cong nhan ma [W2]. Hay kiem tra lai ma (phan biet hoa thuong).<br>
======== Worker Management =========<br>
1. Add Worker<br>
2. Up salary<br>
3. Down salary<br>
4. Display Information salary<br>
5. Exit<br>
Enter your choice:------- Up/Down Salary --------<br>
Enter Code:Enter Salary:Da cap nhat luong cua [W 1]: luong moi 1100.<br>
======== Worker Management =========<br>
1. Add Worker<br>
2. Up salary<br>
3. Down salary<br>
4. Display Information salary<br>
5. Exit<br>
Enter your choice:------- Up/Down Salary --------<br>
Enter Code:Enter Salary:Ban phai nhap 1 so (vi du: 25, 1000), khong nhap chu hay de trong. Moi nhap lai.<br>
Enter Salary:So tien tang/giam phai lon hon 0 (vi du: 100). Moi nhap lai.<br>
Enter Salary:Da cap nhat luong cua [W 1]: luong moi 1500.<br>
======== Worker Management =========<br>
1. Add Worker<br>
2. Up salary<br>
3. Down salary<br>
4. Display Information salary<br>
5. Exit<br>
Enter your choice:------- Up/Down Salary --------<br>
Enter Code:Enter Salary:Khong giam duoc: luong hien tai cua [W 3] la 1400, so tien giam phai nho hon so do.<br>
======== Worker Management =========<br>
1. Add Worker<br>
2. Up salary<br>
3. Down salary<br>
4. Display Information salary<br>
5. Exit<br>
Enter your choice:------- Up/Down Salary --------<br>
Enter Code:Enter Salary:Da cap nhat luong cua [W 3]: luong moi 1300.<br>
======== Worker Management =========<br>
1. Add Worker<br>
2. Up salary<br>
3. Down salary<br>
4. Display Information salary<br>
5. Exit<br>
Enter your choice:--------------------Display Information Salary-----------------------<br>
Code &nbsp;&nbsp;&nbsp;Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Age &nbsp;&nbsp;Salary &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Status &nbsp;Date<br>
W 1 &nbsp;&nbsp;&nbsp;&nbsp;Nghia &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 &nbsp;&nbsp;&nbsp;1100 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UP &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dd/MM/yyyy<br>
W 1 &nbsp;&nbsp;&nbsp;&nbsp;Nghia &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 &nbsp;&nbsp;&nbsp;1500 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UP &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dd/MM/yyyy<br>
W 3 &nbsp;&nbsp;&nbsp;&nbsp;Lien &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 &nbsp;&nbsp;&nbsp;1300 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DOWN &nbsp;&nbsp;&nbsp;dd/MM/yyyy<br>
======== Worker Management =========<br>
1. Add Worker<br>
2. Up salary<br>
3. Down salary<br>
4. Display Information salary<br>
5. Exit<br>
Enter your choice:Goodbye.</div>
</details>
<p>Every validation message once (Add, field by field — the duplicate code is refused after the five fields, by the repository):</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Enter your choice:--------- Add Worker ----------<br>
Enter Code:Ma cong nhan khong duoc de trong (vi du: W1). Moi nhap lai.<br>
Enter Code:Enter Name:Enter Age:Tuoi phai tu 18 den 50. Moi nhap lai.<br>
Enter Age:Tuoi phai tu 18 den 50. Moi nhap lai.<br>
Enter Age:Ban phai nhap 1 so (vi du: 25, 1000), khong nhap chu hay de trong. Moi nhap lai.<br>
Enter Age:Enter Salary: Luong phai lon hon 0 (vi du: 1000). Moi nhap lai.<br>
Enter Salary: Luong phai lon hon 0 (vi du: 1000). Moi nhap lai.<br>
Enter Salary: Enter work location:Noi lam viec khong duoc de trong (vi du: Hanoi). Moi nhap lai.<br>
Enter work location:Ma [W 1] da co cong nhan khac. Hay chon lai chuc nang 1 va nhap ma khac.<br>
…</div>
<p>The brief's example — the date column is the day of the run, shown here as dd/MM/yyyy:</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Enter your choice:--------------------Display Information Salary-----------------------<br>
Code &nbsp;&nbsp;&nbsp;Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Age &nbsp;&nbsp;Salary &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Status &nbsp;Date<br>
W 1 &nbsp;&nbsp;&nbsp;&nbsp;Nghia &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 &nbsp;&nbsp;&nbsp;1100 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UP &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dd/MM/yyyy<br>
W 1 &nbsp;&nbsp;&nbsp;&nbsp;Nghia &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 &nbsp;&nbsp;&nbsp;1500 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UP &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dd/MM/yyyy<br>
W 3 &nbsp;&nbsp;&nbsp;&nbsp;Lien &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 &nbsp;&nbsp;&nbsp;1300 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DOWN &nbsp;&nbsp;&nbsp;dd/MM/yyyy<br>
…</div>
<pre><code class="language-bash">$ python3 lint.py MSSV_J1SP0056_WorkerManagement</code></pre>
<div class="out">✓ MSSV_J1SP0056_WorkerManagement — sạch</div>
<p>A real JDK 8 prints the same 101 lines. The paper checklist audit: 0 violations. There is no automatic grader for this lab — the date changes every day: type the keys of <code>harness/input.txt</code> and compare with <code>harness/man-hinh-mong-doi.txt</code>.</p>
<h2>6. Debug it</h2>
<p>Breakpoint on <code>worker.setSalary(newSalary);</code> in <code>WorkerService.changeSalary</code> → Ctrl+F5 → add W 1 (1000), then 3, W 1, 2000 → you never reach the breakpoint: F7 shows the <code>throw</code> because <code>newSalary</code> is −1000. Then 2, W 1, 100 → stop: <code>worker.salary</code> is 1000, <code>newSalary</code> 1100, and after F8 the list <code>salaryHistoryList</code> has one row more.</p>
<h2>7. The questions — answer out loud</h2>
<details><summary>Why workerService and not service?</summary><p class="dap-an">✅ A variable is named after its class so every line says which object it uses — the lecturer had this exact rename done in this lab (Refactor → Rename). Same for <code>workerView</code>, <code>workerController</code>, <code>workerRepository</code>.</p></details>
<details><summary>Why does SalaryHistory copy the salary instead of pointing to the worker's salary?</summary><p class="dap-an">✅ A history row is a photo of one moment. If it read the worker's current salary, after 1100 then 1500 both rows would show 1500 — the brief's example shows 1100 and 1500.</p></details>
<details><summary>Why a service in a 70-LOC lab?</summary><p class="dap-an">✅ Raising and lowering a salary, refusing a salary that drops to 0 and building a sorted history are business rules beyond CRUD. The service gets the worker from the controller — it does not hold the repository.</p></details>
<details><summary>Where is the "sort by id", and why sort the workers, not the rows?</summary><p class="dap-an">✅ <code>getInfomationSalary</code>: <code>Collections.sort(workerList, new Comparator&lt;Worker&gt;() { compare by code })</code>. Sorting the workers keeps each worker's rows in the order they happened, so W 1 1100 always comes before W 1 1500.</p></details>
<details><summary>What if I decrease more than the salary?</summary><p class="dap-an">✅ The service computes the new salary first; 0 or less throws "Khong giam duoc: luong hien tai cua [W 3] la 1400…" and nothing changes — no new salary, no history row.</p></details>
<details><summary>Why does changeSalary return a String?</summary><p class="dap-an">✅ The controller only needs the new salary as words for its message; formatting it in the service keeps the controller free of utils and of numbers.</p></details>
<h2>8. Download</h2>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/lab211/v1/MSSV_J1SP0056_WorkerManagement-solution.zip" target="_blank" rel="noopener">
<span class="lc-ico">✅</span>
<span class="lc-body"><span class="lc-title">MSSV_J1SP0056_WorkerManagement-solution.zip</span><span class="lc-sub">NetBeans project (Java 8) · 14 files · harness/input.txt (test keys) + harness/man-hinh-mong-doi.txt (expected screen)</span></span>
<span class="lc-cta">Download</span>
</a>
<div class="callout"><p><strong>Next:</strong> P0070 Ebank Login (TPBank login with a captcha and two languages), then P0071 (Task Management without a service) and P0073 (Handy Expense with a file) — the same checklist.</p></div>`,
    `<h2>5. Chạy thật</h2>
<details><summary>Toàn bộ lần chạy (101 dòng)</summary>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">======== Worker Management =========<br>
1. Add Worker<br>
2. Up salary<br>
3. Down salary<br>
4. Display Information salary<br>
5. Exit<br>
Enter your choice:--------------------Display Information Salary-----------------------<br>
Chua co lan tang/giam luong nao. Hay chon 2 hoac 3 truoc.<br>
======== Worker Management =========<br>
1. Add Worker<br>
2. Up salary<br>
3. Down salary<br>
4. Display Information salary<br>
5. Exit<br>
Enter your choice:Lua chon nam ngoai khoang. Hay nhap 1 so tu 1 den 5. Moi nhap lai.<br>
Enter your choice:Ban phai nhap 1 so (vi du: 25, 1000), khong nhap chu hay de trong. Moi nhap lai.<br>
Enter your choice:--------- Add Worker ----------<br>
Enter Code:Enter Name:Enter Age:Enter Salary: Enter work location:Da them cong nhan [W 3].<br>
======== Worker Management =========<br>
1. Add Worker<br>
2. Up salary<br>
3. Down salary<br>
4. Display Information salary<br>
5. Exit<br>
Enter your choice:--------- Add Worker ----------<br>
Enter Code:Enter Name:Enter Age:Enter Salary: Enter work location:Da them cong nhan [W 1].<br>
======== Worker Management =========<br>
1. Add Worker<br>
2. Up salary<br>
3. Down salary<br>
4. Display Information salary<br>
5. Exit<br>
Enter your choice:--------- Add Worker ----------<br>
Enter Code:Ma cong nhan khong duoc de trong (vi du: W1). Moi nhap lai.<br>
Enter Code:Enter Name:Enter Age:Tuoi phai tu 18 den 50. Moi nhap lai.<br>
Enter Age:Tuoi phai tu 18 den 50. Moi nhap lai.<br>
Enter Age:Ban phai nhap 1 so (vi du: 25, 1000), khong nhap chu hay de trong. Moi nhap lai.<br>
Enter Age:Enter Salary: Luong phai lon hon 0 (vi du: 1000). Moi nhap lai.<br>
Enter Salary: Luong phai lon hon 0 (vi du: 1000). Moi nhap lai.<br>
Enter Salary: Enter work location:Noi lam viec khong duoc de trong (vi du: Hanoi). Moi nhap lai.<br>
Enter work location:Ma [W 1] da co cong nhan khac. Hay chon lai chuc nang 1 va nhap ma khac.<br>
======== Worker Management =========<br>
1. Add Worker<br>
2. Up salary<br>
3. Down salary<br>
4. Display Information salary<br>
5. Exit<br>
Enter your choice:------- Up/Down Salary --------<br>
Enter Code:Enter Salary:Khong co cong nhan ma [W2]. Hay kiem tra lai ma (phan biet hoa thuong).<br>
======== Worker Management =========<br>
1. Add Worker<br>
2. Up salary<br>
3. Down salary<br>
4. Display Information salary<br>
5. Exit<br>
Enter your choice:------- Up/Down Salary --------<br>
Enter Code:Enter Salary:Da cap nhat luong cua [W 1]: luong moi 1100.<br>
======== Worker Management =========<br>
1. Add Worker<br>
2. Up salary<br>
3. Down salary<br>
4. Display Information salary<br>
5. Exit<br>
Enter your choice:------- Up/Down Salary --------<br>
Enter Code:Enter Salary:Ban phai nhap 1 so (vi du: 25, 1000), khong nhap chu hay de trong. Moi nhap lai.<br>
Enter Salary:So tien tang/giam phai lon hon 0 (vi du: 100). Moi nhap lai.<br>
Enter Salary:Da cap nhat luong cua [W 1]: luong moi 1500.<br>
======== Worker Management =========<br>
1. Add Worker<br>
2. Up salary<br>
3. Down salary<br>
4. Display Information salary<br>
5. Exit<br>
Enter your choice:------- Up/Down Salary --------<br>
Enter Code:Enter Salary:Khong giam duoc: luong hien tai cua [W 3] la 1400, so tien giam phai nho hon so do.<br>
======== Worker Management =========<br>
1. Add Worker<br>
2. Up salary<br>
3. Down salary<br>
4. Display Information salary<br>
5. Exit<br>
Enter your choice:------- Up/Down Salary --------<br>
Enter Code:Enter Salary:Da cap nhat luong cua [W 3]: luong moi 1300.<br>
======== Worker Management =========<br>
1. Add Worker<br>
2. Up salary<br>
3. Down salary<br>
4. Display Information salary<br>
5. Exit<br>
Enter your choice:--------------------Display Information Salary-----------------------<br>
Code &nbsp;&nbsp;&nbsp;Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Age &nbsp;&nbsp;Salary &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Status &nbsp;Date<br>
W 1 &nbsp;&nbsp;&nbsp;&nbsp;Nghia &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 &nbsp;&nbsp;&nbsp;1100 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UP &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dd/MM/yyyy<br>
W 1 &nbsp;&nbsp;&nbsp;&nbsp;Nghia &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 &nbsp;&nbsp;&nbsp;1500 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UP &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dd/MM/yyyy<br>
W 3 &nbsp;&nbsp;&nbsp;&nbsp;Lien &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 &nbsp;&nbsp;&nbsp;1300 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DOWN &nbsp;&nbsp;&nbsp;dd/MM/yyyy<br>
======== Worker Management =========<br>
1. Add Worker<br>
2. Up salary<br>
3. Down salary<br>
4. Display Information salary<br>
5. Exit<br>
Enter your choice:Goodbye.</div>
</details>
<p>Mọi câu báo lỗi một lần (Add, từng ô một — mã trùng bị repository từ chối sau khi nhập đủ năm ô):</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Enter your choice:--------- Add Worker ----------<br>
Enter Code:Ma cong nhan khong duoc de trong (vi du: W1). Moi nhap lai.<br>
Enter Code:Enter Name:Enter Age:Tuoi phai tu 18 den 50. Moi nhap lai.<br>
Enter Age:Tuoi phai tu 18 den 50. Moi nhap lai.<br>
Enter Age:Ban phai nhap 1 so (vi du: 25, 1000), khong nhap chu hay de trong. Moi nhap lai.<br>
Enter Age:Enter Salary: Luong phai lon hon 0 (vi du: 1000). Moi nhap lai.<br>
Enter Salary: Luong phai lon hon 0 (vi du: 1000). Moi nhap lai.<br>
Enter Salary: Enter work location:Noi lam viec khong duoc de trong (vi du: Hanoi). Moi nhap lai.<br>
Enter work location:Ma [W 1] da co cong nhan khac. Hay chon lai chuc nang 1 va nhap ma khac.<br>
…</div>
<p>Ví dụ của đề — cột ngày là ngày chạy, ở đây ghi thành dd/MM/yyyy:</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Enter your choice:--------------------Display Information Salary-----------------------<br>
Code &nbsp;&nbsp;&nbsp;Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Age &nbsp;&nbsp;Salary &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Status &nbsp;Date<br>
W 1 &nbsp;&nbsp;&nbsp;&nbsp;Nghia &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 &nbsp;&nbsp;&nbsp;1100 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UP &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dd/MM/yyyy<br>
W 1 &nbsp;&nbsp;&nbsp;&nbsp;Nghia &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 &nbsp;&nbsp;&nbsp;1500 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UP &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dd/MM/yyyy<br>
W 3 &nbsp;&nbsp;&nbsp;&nbsp;Lien &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 &nbsp;&nbsp;&nbsp;1300 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DOWN &nbsp;&nbsp;&nbsp;dd/MM/yyyy<br>
…</div>
<pre><code class="language-bash">$ python3 lint.py MSSV_J1SP0056_WorkerManagement</code></pre>
<div class="out">✓ MSSV_J1SP0056_WorkerManagement — sạch</div>
<p>JDK 8 thật in đúng 101 dòng đó. Soát tờ checklist giấy: 0 vi phạm. Bài này không có bộ chấm tự động — ngày đổi mỗi hôm: gõ các phím trong <code>harness/input.txt</code> và so với <code>harness/man-hinh-mong-doi.txt</code>.</p>
<h2>6. Debug</h2>
<p>Breakpoint ở <code>worker.setSalary(newSalary);</code> trong <code>WorkerService.changeSalary</code> → Ctrl+F5 → thêm W 1 (1000), rồi 3, W 1, 2000 → không bao giờ dừng ở breakpoint: F7 cho thấy dòng <code>throw</code> vì <code>newSalary</code> là −1000. Rồi 2, W 1, 100 → dừng: <code>worker.salary</code> là 1000, <code>newSalary</code> 1100, và sau F8 danh sách <code>salaryHistoryList</code> có thêm một dòng.</p>
<h2>7. Câu thầy hỏi — trả lời thành tiếng</h2>
<details><summary>Sao đặt workerService mà không đặt service?</summary><p class="dap-an">✅ Biến đặt theo tên lớp để dòng nào cũng nói rõ đang dùng đối tượng nào — thầy đã bắt đổi đúng tên này ở bài này (Refactor → Rename). Tương tự <code>workerView</code>, <code>workerController</code>, <code>workerRepository</code>.</p></details>
<details><summary>Sao SalaryHistory chép lương mà không trỏ tới lương của công nhân?</summary><p class="dap-an">✅ Một dòng lịch sử là ảnh chụp một thời điểm. Nếu đọc lương hiện tại thì sau 1100 rồi 1500 cả hai dòng đều hiện 1500 — ví dụ của đề là 1100 và 1500.</p></details>
<details><summary>Bài 70 LOC sao lại có service?</summary><p class="dap-an">✅ Tăng, giảm lương, chặn lương tụt về 0 và dựng lịch sử đã sắp là luật nghiệp vụ ngoài CRUD. Service nhận công nhân từ controller — nó không giữ repository.</p></details>
<details><summary>"Sắp theo mã" ở đâu, sao sắp công nhân mà không sắp dòng?</summary><p class="dap-an">✅ <code>getInfomationSalary</code>: <code>Collections.sort(workerList, new Comparator&lt;Worker&gt;() { so theo mã })</code>. Sắp công nhân thì các dòng của mỗi người giữ đúng thứ tự xảy ra, nên W 1 1100 luôn đứng trước W 1 1500.</p></details>
<details><summary>Giảm nhiều hơn lương thì sao?</summary><p class="dap-an">✅ Service tính lương mới trước; còn 0 hoặc âm thì ném "Khong giam duoc: luong hien tai cua [W 3] la 1400…" và không gì thay đổi — không lương mới, không dòng lịch sử.</p></details>
<details><summary>Sao changeSalary trả về String?</summary><p class="dap-an">✅ Controller chỉ cần lương mới dạng chữ để đưa vào câu báo; định dạng ở service thì controller không phải dùng utils, không đụng tới con số.</p></details>
<h2>8. Tệp tải về</h2>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/lab211/v1/MSSV_J1SP0056_WorkerManagement-solution.zip" target="_blank" rel="noopener">
<span class="lc-ico">✅</span>
<span class="lc-body"><span class="lc-title">MSSV_J1SP0056_WorkerManagement-solution.zip</span><span class="lc-sub">project NetBeans (Java 8) · 14 tệp · harness/input.txt (phím test) + harness/man-hinh-mong-doi.txt (màn hình mong đợi)</span></span>
<span class="lc-cta">Tải về</span>
</a>
<div class="callout"><p><strong>Bài tiếp:</strong> P0070 Đăng nhập Ebank (TPBank có captcha và hai ngôn ngữ), rồi P0071 (Task Management không có service) và P0073 (Handy Expense có lưu tệp) — cùng tờ checklist.</p></div>`),
  ].join('\n'),
};

/* ───────── L.4 — 🎓 LAB211 J1.S.P0070 Ebank Login (TPBank): two languages, regex, a random captcha checked first, no service ───────── */
const L_l211_p0070 = {
  title: 'L.4 — 🎓 LAB211 J1.S.P0070 Ebank Login (TPBank): two languages, regex, a random captcha checked first, no service|||L.4 — 🎓 LAB211 J1.S.P0070 Đăng nhập Ebank (TPBank): hai ngôn ngữ, regex, captcha ngẫu nhiên kiểm trước, không service',
  slug: 'pro192-lab211-p0070-ebank-login',
  type: 'VIDEO',
  description: 'Bài LAB211 J1.S.P0070 (150 LOC) đi từ bản thầy đã review: đọc đề (menu Việt/Anh, số tài khoản đúng 10 chữ số, mật khẩu 8–31 ký tự có chữ và số, captcha ngẫu nhiên mỗi lần đăng nhập kiểm bằng contains), hiểu hai câu thầy nói ("đưa captcha lên đầu" — bản cũ hỏi kho tài khoản trước rồi mới hỏi captcha; "gì đó trong Main" — Main tự in kết quả, captcha so equals, hàm bốn tham số, System.exit), cái bẫy không ai thấy (Preferences làm lần mở sau ra tiếng Việt), rồi dựng bản sạch: ResourceBundle hai tệp .properties, Validation ba hàm kiểm của đề, CaptchaUtils bằng StringBuilder, controller hỏi thẳng repository vì bài không có tính toán nghiệp vụ, view in một lần. Chạy thật bằng bàn phím biết đọc captcha trên màn hình, lint.py sạch, 25 mục 0 vi phạm, JDK 8 thật. Kèm câu thầy hay hỏi và dự án tải về.',
  content: [
    bi(`<span class="eyebrow">🎓 LAB211 in practice · L.4 · J1.S.P0070</span>
<h2>Ebank Login — "put the captcha first"</h2>
<p class="lead">This lab comes back from a real review. The lecturer looked at the login of TienPhong Bank's Ebank and said two things: <em>"put the captcha first"</em> and <em>"something in Main"</em>. Neither sentence names a line of code — so this lesson finds the lines: the old program asked the account store whether the password was right <strong>before</strong> the captcha, and its Main printed results, compared the captcha with <code>equals</code> instead of the brief's <code>contains</code>, took four parameters and called <code>System.exit</code>.</p>
<p>On top of that, a bug nobody saw in class: the language was saved in the machine's preferences, so the program opened in Vietnamese the next day. Plan about <strong>2 hours</strong> to retype (two <code>.properties</code> files included), 20 minutes for the test keys.</p>`,
    `<span class="eyebrow">🎓 LAB211 thực chiến · L.4 · J1.S.P0070</span>
<h2>Đăng nhập Ebank — "đưa captcha lên đầu"</h2>
<p class="lead">Bài này trở về từ một lần review thật. Thầy xem chức năng đăng nhập Ebank của ngân hàng Tiên Phong và nói hai câu: <em>"đưa captcha lên đầu"</em> và <em>"gì đó trong Main"</em>. Không câu nào chỉ ra dòng code — nên bài này đi tìm đúng các dòng đó: chương trình cũ hỏi kho tài khoản xem mật khẩu đúng hay sai <strong>trước</strong> khi hỏi captcha, còn Main thì tự in kết quả, so captcha bằng <code>equals</code> thay vì <code>contains</code> của đề, nhận bốn tham số và gọi <code>System.exit</code>.</p>
<p>Thêm một lỗi trên lớp không ai thấy: ngôn ngữ được lưu vào cài đặt của máy, nên hôm sau mở chương trình lên là tiếng Việt. Dành khoảng <strong>2 giờ</strong> để gõ lại (kể cả hai tệp <code>.properties</code>), 20 phút cho bộ phím test.</p>`),
    bi(`<h2>📑 Slide by slide — PRO192 · LAB211 P0070 (14 slides)</h2>
<p>The deck of this LAB211 lesson, made by CuongThai (it is not a school deck and not the lecturer's). Each slide is followed by its key idea and the explanation; every piece of code and every output on the slides comes from the real project in this lesson — checked by <code>lint.py</code> (the lecturer's rules), compiled with <code>javac --release 8</code> and run on a real JDK 8, like the machines in the lab room.</p>`,
    `<h2>📑 Học theo từng slide — PRO192 · LAB211 P0070 (14 slide)</h2>
<p>Bộ slide của bài LAB211 này do CuongThai dựng (không phải slide của trường, cũng không phải của thầy). Dưới mỗi slide là ý chính và lời giảng; mọi đoạn code, mọi output trên slide đều lấy từ đúng dự án trong bài — qua <code>lint.py</code> (luật của thầy), biên dịch bằng <code>javac --release 8</code> và chạy trên JDK 8 thật, giống máy phòng lab.</p>`),
    walk('l211-p0070', [
      [1, 'J1.S.P0070 — Ebank Login (TPBank)',
        `<p class="y-chinh">🎯 A login with two languages, two regular expressions and a random captcha — rebuilt after a real review.</p>
<p>The deck: the brief, ResourceBundle, the two regexes by hand, what the lecturer meant, the Preferences trap, the clean design without a service, each layer, the real run, the questions.</p>`,
        `<p class="y-chinh">🎯 Một màn đăng nhập có hai ngôn ngữ, hai biểu thức chính quy và captcha ngẫu nhiên — dựng lại sau một lần review thật.</p>
<p>Bộ slide: đề, ResourceBundle, hai regex chạy tay, ý thầy là gì, bẫy Preferences, thiết kế sạch không có service, từng tầng, lần chạy thật, các câu hỏi.</p>`],
      [2, 'The brief',
        `<p class="y-chinh">🎯 Menu 1 Vietnamese · 2 English · 3 Exit, then a login: account number, password, captcha — each one asked again until it is right.</p>
<p>The account number is a number of exactly 10 digits; the password has 8 to 31 characters with letters and digits; the captcha is random, made again at each login, and the user types one or more of its characters — checked with <code>contains()</code>. The brief names five functions: <code>setLocate</code>, <code>checkAccountNumber</code>, <code>checkPassword</code>, <code>generateCaptcha</code>, <code>checkCaptcha</code>, and two property files, one per language. The sentences are copied from the brief, English mistakes included ("must is a number").</p>`,
        `<p class="y-chinh">🎯 Menu 1 Vietnamese · 2 English · 3 Exit, rồi đăng nhập: số tài khoản, mật khẩu, captcha — ô nào sai hỏi lại ô đó.</p>
<p>Số tài khoản là số có đúng 10 chữ số; mật khẩu dài 8 tới 31 ký tự, có cả chữ và số; captcha ngẫu nhiên, sinh lại mỗi lần đăng nhập, người dùng gõ một hay nhiều ký tự của nó — kiểm bằng <code>contains()</code>. Đề đặt tên năm hàm: <code>setLocate</code>, <code>checkAccountNumber</code>, <code>checkPassword</code>, <code>generateCaptcha</code>, <code>checkCaptcha</code>, và hai tệp properties, mỗi ngôn ngữ một tệp. Câu chữ chép đúng đề, kể cả tiếng Anh sai ("must is a number").</p>`],
      [3, 'Two languages without one if',
        `<p class="y-chinh">🎯 Every sentence lives twice — in <code>Language_en.properties</code> and <code>Language_vi.properties</code> under the same key; <code>Resource.setLocate(locale)</code> loads one of them.</p>
<p>The code only names keys (<code>Message.getAccountPrompt()</code> reads the key <code>account</code>), so switching the language is one call, not an <code>if</code> on every line. The file names must be <code>_vi</code> (language code), not <code>_vn</code> (country code). Java 8 reads .properties as ISO-8859-1, so the Vietnamese file stays without accents.</p>`,
        `<p class="y-chinh">🎯 Mỗi câu có hai bản — trong <code>Language_en.properties</code> và <code>Language_vi.properties</code>, cùng một khoá; <code>Resource.setLocate(locale)</code> nạp một trong hai.</p>
<p>Code chỉ gọi tên khoá (<code>Message.getAccountPrompt()</code> đọc khoá <code>account</code>), nên đổi ngôn ngữ là một lời gọi, không phải một cái <code>if</code> ở mỗi dòng. Tên tệp phải là <code>_vi</code> (mã ngôn ngữ), không phải <code>_vn</code> (mã quốc gia). Java 8 đọc .properties theo ISO-8859-1, nên tệp tiếng Việt viết không dấu.</p>`],
      [4, 'Regex, by hand',
        `<p class="y-chinh">🎯 Account: <code>^[0-9]{10}$</code>. Password: <code>^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,31}$</code> — two look-aheads say "has a letter" and "has a digit".</p>
<p>The brief's own examples prove "alphanumeric" means letters AND digits: <code>12345678</code> and <code>aaaaaaaa</code> are refused. <code>matches</code> tests the whole string, so <code>abc0123456789xyz</code> fails too. The account number stays a <code>String</code>: it keeps a leading 0, and ten digits overflow an <code>int</code>.</p>`,
        `<p class="y-chinh">🎯 Tài khoản: <code>^[0-9]{10}$</code>. Mật khẩu: <code>^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,31}$</code> — hai phép nhìn trước nói "có chữ" và "có số".</p>
<p>Chính ví dụ của đề chứng minh "alphanumeric" nghĩa là chữ VÀ số: <code>12345678</code> và <code>aaaaaaaa</code> bị từ chối. <code>matches</code> so cả chuỗi, nên <code>abc0123456789xyz</code> cũng trượt. Số tài khoản giữ kiểu <code>String</code>: giữ số 0 đầu, và mười chữ số thì tràn <code>int</code>.</p>`],
      [5, '"Put the captcha first"',
        `<p class="y-chinh">🎯 The reviewed version asked the repository "is this account right?" first and showed the captcha only when it was. The fix: make the captcha at the start of each login and pass it in Main before the controller asks anything.</p>
<p>A captcha exists to stop a machine guessing passwords; answering "right/wrong" before it defeats the purpose. The input order stays the brief's — account, password, captcha. If the lecturer meant "show the captcha above the account field", two lines of <code>inputLogin</code> move up and nothing else changes; ask him one question to be sure.</p>`,
        `<p class="y-chinh">🎯 Bản đã review hỏi repository "tài khoản này đúng không?" trước, chỉ khi đúng mới hiện captcha. Sửa: sinh captcha đầu mỗi lần đăng nhập và cho qua captcha ở Main trước khi controller hỏi bất cứ gì.</p>
<p>Captcha sinh ra để chặn máy dò mật khẩu; trả lời "đúng/sai" trước captcha là mất tác dụng. Thứ tự nhập vẫn như đề — tài khoản, mật khẩu, captcha. Nếu thầy muốn "hiện captcha trên cả ô tài khoản", chỉ cần chuyển hai dòng trong <code>inputLogin</code> lên trên, không sửa gì khác; hỏi thầy một câu cho chắc.</p>`],
      [6, '"Something in Main" — what the tools say',
        `<p class="y-chinh">🎯 On the reviewed version (names hidden): <code>lint.py</code> 171 violations, the paper audit 26. In Main itself: it printed the login result, called the controller after the <code>switch</code>, compared the captcha with <code>equals</code>, had 4-parameter public helpers and <code>System.exit(0)</code>.</p>
<p>Each one has a rule: results go through the view (1.1), one controller call inside each case (Guide), the brief says <code>contains()</code>, at most two parameters (V4), helpers are private, no <code>System.exit</code>. And <code>Resource.resourceBundle</code> was a public static field read straight from Main.</p>`,
        `<p class="y-chinh">🎯 Trên bản đã review (đã ẩn tên): <code>lint.py</code> 171 vi phạm, soát tờ giấy 26. Riêng Main: tự in kết quả đăng nhập, gọi controller sau <code>switch</code>, so captcha bằng <code>equals</code>, hàm phụ public bốn tham số, và <code>System.exit(0)</code>.</p>
<p>Mỗi chỗ có một luật: kết quả đi qua view (1.1), mỗi case gọi controller một lần (Guide), đề bắt <code>contains()</code>, tối đa hai tham số (V4), hàm phụ private, không <code>System.exit</code>. Thêm nữa, <code>Resource.resourceBundle</code> là trường public static mà Main đọc thẳng.</p>`],
      [7, 'The trap no one saw: Preferences',
        `<p class="y-chinh">🎯 The old <code>Resource</code> saved the chosen language in the machine's user preferences and read it back in a <code>static</code> block — so after choosing Vietnamese once, the next run opened in Vietnamese.</p>
<p>The comment said "English by default"; the code did something else, on every later run, and on Windows it could also print a warning about the preferences root node. The fix deletes Preferences and the static block: the bundle starts in English, <code>setLocate</code> switches it, nothing outlives the program.</p>`,
        `<p class="y-chinh">🎯 <code>Resource</code> cũ lưu ngôn ngữ đã chọn vào cài đặt người dùng của máy rồi đọc lại trong khối <code>static</code> — chọn tiếng Việt một lần là lần chạy sau mở ra tiếng Việt.</p>
<p>Comment ghi "mặc định tiếng Anh"; code làm việc khác, ở mọi lần chạy sau, và trên Windows còn có thể in cảnh báo về preferences. Bản sửa bỏ Preferences và khối static: bundle bắt đầu bằng tiếng Anh, <code>setLocate</code> đổi nó, không gì sống lâu hơn chương trình.</p>`],
      [8, 'The clean design: no service',
        `<p class="y-chinh">🎯 Main → <code>AccountController</code> (one call) → <code>AccountRepository.checkLogin</code> → <code>AccountView.display()</code> once. No service.</p>
<p>The old <code>AccountService.login</code> only forwarded one line to the repository: the paper adds a service only when there is business computation — the same reason the lecturer gave for P0071. Names follow the class: <code>AccountController</code>, <code>accountController</code>, and <code>CaptchaUtils</code> (the Guide writes <i>CapchaUtils</i>).</p>`,
        `<p class="y-chinh">🎯 Main → <code>AccountController</code> (một lần gọi) → <code>AccountRepository.checkLogin</code> → <code>AccountView.display()</code> một lần. Không có service.</p>
<p><code>AccountService.login</code> cũ chỉ chuyển tiếp một dòng xuống repository: tờ giấy chỉ thêm service khi có tính toán nghiệp vụ — đúng lý do thầy đưa ra ở P0071. Tên theo lớp: <code>AccountController</code>, <code>accountController</code>, và <code>CaptchaUtils</code> (Guide viết <i>CapchaUtils</i>).</p>`],
      [9, 'Model and repository',
        `<p class="y-chinh">🎯 <code>Account</code> is a JavaBean with two fields; <code>AccountRepository</code> loads the four sample accounts in its constructor and answers <code>checkLogin(accountDTO)</code>.</p>
<p>The sample data comes from <code>Constants.SAMPLE_ACCOUNT_ARRAY</code> and <code>SAMPLE_PASSWORD_ARRAY</code> — same position, same account. The list is an <code>ArrayList&lt;Account&gt; accountList</code> (V5, 1.5). The long condition breaks after <code>&amp;&amp;</code> with parentheses around each test (2.3, 3.3).</p>`,
        `<p class="y-chinh">🎯 <code>Account</code> là JavaBean hai trường; <code>AccountRepository</code> nạp bốn tài khoản mẫu trong constructor và trả lời <code>checkLogin(accountDTO)</code>.</p>
<p>Dữ liệu mẫu lấy từ <code>Constants.SAMPLE_ACCOUNT_ARRAY</code> và <code>SAMPLE_PASSWORD_ARRAY</code> — cùng vị trí là cùng một tài khoản. Danh sách là <code>ArrayList&lt;Account&gt; accountList</code> (V5, 1.5). Điều kiện dài xuống dòng sau <code>&amp;&amp;</code>, mỗi vế có ngoặc riêng (2.3, 3.3).</p>`],
      [10, 'Utils: three checks and one captcha',
        `<p class="y-chinh">🎯 <code>Validation.checkAccountNumber</code> and <code>checkPassword</code> keep the brief's names and throw the sentence of the chosen language; <code>checkCaptcha</code> refuses an empty input, then tests <code>captcha.contains(text)</code>.</p>
<p>Every string contains the empty string, so without the <code>isEmpty()</code> test, Enter alone would log in. <code>CaptchaUtils.generateCaptcha()</code> picks five random positions in a character table and appends them to a <code>StringBuilder</code> (3.8: no <code>+=</code> in a loop).</p>`,
        `<p class="y-chinh">🎯 <code>Validation.checkAccountNumber</code> và <code>checkPassword</code> giữ tên đề và ném câu lỗi theo ngôn ngữ đang chọn; <code>checkCaptcha</code> chặn chuỗi rỗng trước, rồi mới kiểm <code>captcha.contains(text)</code>.</p>
<p>Chuỗi nào cũng chứa chuỗi rỗng, nên thiếu phép kiểm <code>isEmpty()</code> thì chỉ nhấn Enter cũng đăng nhập được. <code>CaptchaUtils.generateCaptcha()</code> chọn năm vị trí ngẫu nhiên trong bảng ký tự rồi nối vào <code>StringBuilder</code> (3.8: không <code>+=</code> trong vòng lặp).</p>`],
      [11, 'Main: one login, captcha before the controller',
        `<p class="y-chinh">🎯 <code>inputLogin</code>: make a new captcha, ask the account and the password, show the captcha and ask until it is right — then return the DTO. Each case: set the language, <code>inputLogin</code>, one <code>login</code> call.</p>
<p>The captcha is the first line of <code>inputLogin</code> because the brief says "in each login". Every helper is private and takes at most two parameters (the Scanner and, for the captcha, the string to compare). The Scanner is a local variable of <code>main</code>, passed down — no static variable in Main.</p>`,
        `<p class="y-chinh">🎯 <code>inputLogin</code>: sinh captcha mới, hỏi tài khoản và mật khẩu, hiện captcha và hỏi tới khi đúng — rồi trả phiếu DTO. Mỗi case: đổi ngôn ngữ, <code>inputLogin</code>, một lần <code>login</code>.</p>
<p>Captcha là dòng đầu của <code>inputLogin</code> vì đề ghi "mỗi lần đăng nhập". Mọi hàm phụ đều private và nhận tối đa hai tham số (Scanner và, với captcha, chuỗi để so). Scanner là biến cục bộ của <code>main</code>, truyền xuống — không có biến static trong Main.</p>`],
      [12, 'Controller and view: print once',
        `<p class="y-chinh">🎯 <code>login(accountDTO)</code>: the repository answers true or false, the controller puts the success or failure sentence in a <code>ResponseDTO</code>, the view prints it with <code>display()</code> — once.</p>
<p>The sentence is already in the chosen language (it comes from <code>Message</code>, which reads the bundle). The controller imports no model and prints nothing; Main never prints a login result any more.</p>`,
        `<p class="y-chinh">🎯 <code>login(accountDTO)</code>: repository trả lời đúng hay sai, controller đặt câu thành công hoặc thất bại vào <code>ResponseDTO</code>, view in bằng <code>display()</code> — một lần.</p>
<p>Câu đó đã theo ngôn ngữ đang chọn (lấy từ <code>Message</code>, vốn đọc bundle). Controller không import model, không in gì; Main không còn tự in kết quả đăng nhập.</p>`],
      [13, 'The real run, lint and JDK 8',
        `<p class="y-chinh">🎯 English: four wrong accounts, four wrong passwords, a wrong captcha, an empty one, then one right character — "Login failed" because 0123456789 is not in the store. Vietnamese: a real account, two middle characters — "Dang nhap thanh cong!".</p>
<p>The captcha changes every run, so the test keys hold placeholders: <code>{CAP1}</code> (first character) and <code>{CAPMID}</code> (the two middle ones). The runner waits until the captcha appears on screen, then types. Below, the captcha is written XXXXX. <code>lint.py</code> clean, 25 paper items 0 violations, a real JDK 8 prints the same 29 lines.</p>`,
        `<p class="y-chinh">🎯 Tiếng Anh: bốn tài khoản sai, bốn mật khẩu sai, một captcha sai, một ô trống, rồi một ký tự đúng — "Login failed" vì 0123456789 không có trong kho. Tiếng Việt: một tài khoản thật, hai ký tự giữa — "Dang nhap thanh cong!".</p>
<p>Captcha đổi mỗi lần chạy, nên bộ phím test có chỗ giữ chỗ: <code>{CAP1}</code> (ký tự đầu) và <code>{CAPMID}</code> (hai ký tự giữa). Bộ chạy đợi captcha hiện trên màn hình rồi mới gõ. Bên dưới, captcha được ghi là XXXXX. <code>lint.py</code> sạch, 25 mục tờ giấy 0 vi phạm, JDK 8 thật in đúng 29 dòng đó.</p>`],
      [14, 'What the lecturer asks',
        `<p class="y-chinh">🎯 "Why is the captcha checked before the account?", "Why no service?", "Where is contains(), and an empty input?", "How does the language switch?", "Why is the account number a String?", "Why no System.exit?"</p>
<p>The first one is the review itself: answer with the purpose of a captcha — stopping a machine that guesses passwords — not with "because you said so".</p>`,
        `<p class="y-chinh">🎯 "Sao captcha kiểm trước tài khoản?", "Sao không có service?", "contains() ở đâu, gõ rỗng thì sao?", "Đổi ngôn ngữ chạy thế nào?", "Sao số tài khoản là String?", "Sao không dùng System.exit?"</p>
<p>Câu đầu chính là nội dung lần review: trả lời bằng mục đích của captcha — chặn máy dò mật khẩu — chứ không phải "vì thầy bảo".</p>`],
    ]),
    bi(`<h2>1. The brief</h2>
<table>
<thead><tr><th>The brief says</th><th>Where it lives</th></tr></thead>
<tbody>
<tr><td><code>void setLocate(Locate locate)</code> — change language</td><td><code>Resource.setLocate(Locale locale)</code> — the brief's name, the real Java type</td></tr>
<tr><td><code>String checkAccountNumber(String)</code> — a number, 10 digits</td><td><code>Validation.checkAccountNumber</code> + <code>Constants.ACCOUNT_NUMBER</code></td></tr>
<tr><td><code>String checkPassword(String)</code> — 8–31, letters and digits</td><td><code>Validation.checkPassword</code> + <code>Constants.PASSWORD</code></td></tr>
<tr><td><code>String generateCaptcha()</code> — Random, then <code>char</code></td><td><code>CaptchaUtils.generateCaptcha()</code> (the Guide lists *CapchaUtils* among Main's tools)</td></tr>
<tr><td><code>String checkCaptcha(captchaInput, captchaGenerate)</code> — <code>contains()</code></td><td><code>Validation.checkCaptcha(input, captcha)</code> — throws the sentence instead of returning it</td></tr>
<tr><td>"En.properties and Vi.properties"</td><td><code>constants/Language_en.properties</code>, <code>Language_vi.properties</code> (getBundle needs <code>&lt;name&gt;_&lt;code&gt;</code>)</td></tr>
</tbody>
</table>
<p>The two language files, as they are in the project (the prompts end with spaces — two after <code>Account number:</code>, as in the brief):</p>
<pre><code class="language-properties">account=Account number:
password=Password:
captcha=Captcha:
inputCaptcha=Enter a Captcha incorrect characters:
accountInvalid=Account number must is a number and must have 10 digits
passwordInvalid=Password must be between 8 and 31 characters and must be alphanumeric</code></pre>
<h2>2. What the lecturer meant</h2>
<p>The version the lecturer reviewed (names hidden), through his tool:</p>
<pre><code class="language-bash">$ python3 lint.py MSSV_J1SP0070_EbankLogin</code></pre>
<div class="out">✗ MSSV_J1SP0070_EbankLogin — 171 vi phạm<br>
&nbsp;&nbsp;[STRUCTURE] src/constant/Message.java — package 'constant' không thuộc kiến trúc Guide<br>
&nbsp;&nbsp;[STRUCTURE] src/constant/Constants.java — package 'constant' không thuộc kiến trúc Guide<br>
&nbsp;&nbsp;[STRUCTURE] src/constants — thiếu package constants/ (Guide.xlsx)<br>
&nbsp;&nbsp;[STRUCTURE] src/constants/Message.java — thiếu constants/Message.java<br>
&nbsp;&nbsp;[HEADER] src/constant/Constants.java:1 — còn header mẫu của NetBeans — xoá đi<br>
&nbsp;&nbsp;[MAGIC] src/constant/Constants.java:17 — số 5 viết thẳng — đặt tên hằng trong Constants (CC §10.3)<br>
&nbsp;&nbsp;[HARDCODE] src/constant/Constants.java:19 — chuỗi "^(?=.*[A-Za-z])(?=.*\\\\d)[A-Za-z\\\\d]{8,31" phải khai báo ở constants (Message/Constants)<br>
&nbsp;&nbsp;[HARDCODE] src/constant/Constants.java:20 — chuỗi "^[A-Za-z0-9 ,\\\\.]+$" phải khai báo ở constants (Message/Constants)<br>
&nbsp;&nbsp;[HARDCODE] src/constant/Constants.java:21 — chuỗi "^[A-Za-z0-9]{5}$" phải khai báo ở constants (Message/Constants)<br>
&nbsp;&nbsp;[STATIC] src/constant/Constants.java:17 — package 'constant' không được dùng static (Guide.xlsx)<br>
&nbsp;&nbsp;[STATIC] src/constant/Constants.java:18 — package 'constant' không được dùng static (Guide.xlsx)<br>
…</div>
<p>Its Main asked the store before the captcha — this is "put the captcha first":</p>
<pre><code class="language-java">String captchaGenerate = Helper.generateCaptcha(Constants.CAPTCHA_LENGTH);
if (control.login(dto)) {                 // the account is checked FIRST
    System.out.println(... "captcha" ... + captchaGenerate);
    verifyCaptcha(sc, message, messageError, captchaGenerate);   // only if right
    System.out.println(... "loginSuccess" ...);                  // Main prints
} else {
    System.out.println(... "loginFailed" ...);                   // no captcha at all
}</code></pre>
<table>
<thead><tr><th>In the reviewed version</th><th>Rule</th><th>In the clean version</th></tr></thead>
<tbody>
<tr><td>captcha asked only after a right account</td><td>the purpose of a captcha</td><td>captcha made per login, passed in Main, then one <code>login</code> call</td></tr>
<tr><td>Main prints "Login success / failed"</td><td>1.1: results through the view</td><td><code>AccountView.display()</code> from the controller</td></tr>
<tr><td><code>control.login(dto)</code> after the <code>switch</code>, <code>generateAccount()</code> from Main</td><td>Guide: one call inside each case</td><td>each case: <code>setLocate</code>, <code>inputLogin</code>, <code>login</code></td></tr>
<tr><td>captcha compared with <code>equals</code></td><td>the brief: <code>contains()</code></td><td><code>checkCaptcha</code>: empty refused, then <code>contains</code></td></tr>
<tr><td><code>verifyCaptcha(sc, message, messageError, captcha)</code> public</td><td>V4: at most 2 parameters, helpers private</td><td><code>inputCaptcha(scanner, captcha)</code> private</td></tr>
<tr><td><code>System.exit(0)</code>, <code>case 1:</code></td><td>no exit, 2.10</td><td><code>isRunning = false</code>, <code>Constants.MENU_*</code></td></tr>
<tr><td><code>Resource.resourceBundle</code> public static + Preferences</td><td>V2, and a real bug</td><td>private bundle, <code>getString(key)</code>, no Preferences</td></tr>
<tr><td><code>AccountService.login</code> = one forwarding line</td><td>the paper: service only for computation</td><td>no service</td></tr>
</tbody>
</table>`,
    `<h2>1. Đề bài</h2>
<table>
<thead><tr><th>Đề nói</th><th>Nằm ở đâu</th></tr></thead>
<tbody>
<tr><td><code>void setLocate(Locate locate)</code> — đổi ngôn ngữ</td><td><code>Resource.setLocate(Locale locale)</code> — tên của đề, kiểu Java thật</td></tr>
<tr><td><code>String checkAccountNumber(String)</code> — là số, 10 chữ số</td><td><code>Validation.checkAccountNumber</code> + <code>Constants.ACCOUNT_NUMBER</code></td></tr>
<tr><td><code>String checkPassword(String)</code> — 8–31, chữ và số</td><td><code>Validation.checkPassword</code> + <code>Constants.PASSWORD</code></td></tr>
<tr><td><code>String generateCaptcha()</code> — Random rồi đổi sang <code>char</code></td><td><code>CaptchaUtils.generateCaptcha()</code> (Guide ghi *CapchaUtils* trong công cụ của Main)</td></tr>
<tr><td><code>String checkCaptcha(captchaInput, captchaGenerate)</code> — <code>contains()</code></td><td><code>Validation.checkCaptcha(input, captcha)</code> — ném câu lỗi thay vì trả về</td></tr>
<tr><td>"En.properties và Vi.properties"</td><td><code>constants/Language_en.properties</code>, <code>Language_vi.properties</code> (getBundle cần dạng <code>&lt;tên&gt;_&lt;mã&gt;</code>)</td></tr>
</tbody>
</table>
<p>Hai tệp ngôn ngữ đúng như trong dự án (câu nhắc kết thúc bằng dấu cách — hai dấu cách sau <code>Account number:</code>, như đề):</p>
<pre><code class="language-properties">account=So tai khoan:
password=Mat khau:
captcha=Captcha:
inputCaptcha=Nhap 1 ky tu captcha:
accountInvalid=So tai khoan phai la 1 so va phai co 10 chu so
passwordInvalid=Mat khau phai trong khoang 8-31 ky tu va phai chua ky tu va so</code></pre>
<h2>2. Ý thầy là gì</h2>
<p>Bản thầy đã review (đã ẩn tên), qua công cụ của thầy:</p>
<pre><code class="language-bash">$ python3 lint.py MSSV_J1SP0070_EbankLogin</code></pre>
<div class="out">✗ MSSV_J1SP0070_EbankLogin — 171 vi phạm<br>
&nbsp;&nbsp;[STRUCTURE] src/constant/Message.java — package 'constant' không thuộc kiến trúc Guide<br>
&nbsp;&nbsp;[STRUCTURE] src/constant/Constants.java — package 'constant' không thuộc kiến trúc Guide<br>
&nbsp;&nbsp;[STRUCTURE] src/constants — thiếu package constants/ (Guide.xlsx)<br>
&nbsp;&nbsp;[STRUCTURE] src/constants/Message.java — thiếu constants/Message.java<br>
&nbsp;&nbsp;[HEADER] src/constant/Constants.java:1 — còn header mẫu của NetBeans — xoá đi<br>
&nbsp;&nbsp;[MAGIC] src/constant/Constants.java:17 — số 5 viết thẳng — đặt tên hằng trong Constants (CC §10.3)<br>
&nbsp;&nbsp;[HARDCODE] src/constant/Constants.java:19 — chuỗi "^(?=.*[A-Za-z])(?=.*\\\\d)[A-Za-z\\\\d]{8,31" phải khai báo ở constants (Message/Constants)<br>
&nbsp;&nbsp;[HARDCODE] src/constant/Constants.java:20 — chuỗi "^[A-Za-z0-9 ,\\\\.]+$" phải khai báo ở constants (Message/Constants)<br>
&nbsp;&nbsp;[HARDCODE] src/constant/Constants.java:21 — chuỗi "^[A-Za-z0-9]{5}$" phải khai báo ở constants (Message/Constants)<br>
&nbsp;&nbsp;[STATIC] src/constant/Constants.java:17 — package 'constant' không được dùng static (Guide.xlsx)<br>
&nbsp;&nbsp;[STATIC] src/constant/Constants.java:18 — package 'constant' không được dùng static (Guide.xlsx)<br>
…</div>
<p>Main của bản đó hỏi kho trước khi hỏi captcha — đây là "đưa captcha lên đầu":</p>
<pre><code class="language-java">String captchaGenerate = Helper.generateCaptcha(Constants.CAPTCHA_LENGTH);
if (control.login(dto)) {                 // kiem tai khoan TRUOC
    System.out.println(... "captcha" ... + captchaGenerate);
    verifyCaptcha(sc, message, messageError, captchaGenerate);   // chi khi dung
    System.out.println(... "loginSuccess" ...);                  // Main tu in
} else {
    System.out.println(... "loginFailed" ...);                   // khong co captcha
}</code></pre>
<table>
<thead><tr><th>Trong bản đã review</th><th>Luật</th><th>Trong bản sạch</th></tr></thead>
<tbody>
<tr><td>captcha chỉ hỏi sau khi tài khoản đúng</td><td>mục đích của captcha</td><td>captcha sinh mỗi lần đăng nhập, qua ở Main, rồi một lần <code>login</code></td></tr>
<tr><td>Main tự in "Login success / failed"</td><td>1.1: kết quả qua view</td><td><code>AccountView.display()</code> từ controller</td></tr>
<tr><td><code>control.login(dto)</code> sau <code>switch</code>, <code>generateAccount()</code> gọi từ Main</td><td>Guide: mỗi case gọi một lần</td><td>mỗi case: <code>setLocate</code>, <code>inputLogin</code>, <code>login</code></td></tr>
<tr><td>so captcha bằng <code>equals</code></td><td>đề: <code>contains()</code></td><td><code>checkCaptcha</code>: chặn rỗng, rồi <code>contains</code></td></tr>
<tr><td><code>verifyCaptcha(sc, message, messageError, captcha)</code> public</td><td>V4: tối đa 2 tham số, hàm phụ private</td><td><code>inputCaptcha(scanner, captcha)</code> private</td></tr>
<tr><td><code>System.exit(0)</code>, <code>case 1:</code></td><td>không exit, 2.10</td><td><code>isRunning = false</code>, <code>Constants.MENU_*</code></td></tr>
<tr><td><code>Resource.resourceBundle</code> public static + Preferences</td><td>V2, và một lỗi thật</td><td>bundle private, <code>getString(key)</code>, bỏ Preferences</td></tr>
<tr><td><code>AccountService.login</code> = một dòng chuyển tiếp</td><td>tờ giấy: service chỉ khi có tính toán</td><td>không có service</td></tr>
</tbody>
</table>`),
    bi(`<h2>3. Class design</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/9973ab2c9dc706eb1d628526ab6c7378a22855f0.svg" alt="P0070: no service — the controller asks the repository; Main makes and checks the captcha before calling it" loading="lazy" /><p class="chu-thich">🧩 P0070: no service — the controller asks the repository; Main makes and checks the captcha before calling it</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title J1.S.P0070 Ebank Login — no service: the controller asks the repository, Main checks the captcha first
package main {
  class Main &lt;&lt;final&gt;&gt; {
    + {static} main(args : String[]) : void
    - {static} inputLogin(scanner : Scanner) : AccountDTO
    - {static} inputCaptcha(scanner : Scanner, captcha : String) : void
  }
}
package controller {
  class AccountController {
    - accountRepository : AccountRepository
    - accountView : AccountView
    + login(accountDTO : AccountDTO) : void
  }
}
package repository {
  class AccountRepository {
    - accountList : ArrayList&lt;Account&gt;
    + checkLogin(accountDTO : AccountDTO) : boolean
  }
}
package model {
  class Account {
    - account : String
    - password : String
  }
}
package view {
  class AccountView {
    - responseDTO : ResponseDTO
    + display() : void
  }
}
package dto {
  class AccountDTO {
    - account : String
    - password : String
  }
  class ResponseDTO {
    - message : String
  }
}
package utils {
  class Validation &lt;&lt;final&gt;&gt; {
    + {static} checkAccountNumber(accountNumber : String) : String
    + {static} checkPassword(password : String) : String
    + {static} checkCaptcha(input : String, captcha : String) : void
  }
  class CaptchaUtils &lt;&lt;final&gt;&gt; {
    + {static} generateCaptcha() : String
  }
  class Resource &lt;&lt;final&gt;&gt; {
    - {static} resourceBundle : ResourceBundle
    + {static} setLocate(locale : Locale) : void
    + {static} getString(key : String) : String
  }
}
package constants {
  class Message &lt;&lt;final&gt;&gt; {
    + {static} getAccountPrompt() : String
    + {static} getLoginSuccess() : String
  }
  class "Language_en / Language_vi" as Lang &lt;&lt;properties&gt;&gt;
}
Main ..&gt; AccountController : one call per case
Main ..&gt; Validation : account, password, captcha
Main ..&gt; CaptchaUtils : a new captcha per login
Main ..&gt; Resource : setLocate(vi / en)
AccountController *-- AccountRepository : checkLogin
AccountController *-- AccountView : display() once
AccountRepository o-- "0..*" Account
Message ..&gt; Resource : getString(key)
Resource ..&gt; Lang : getBundle(name, locale)
@enduml</code></pre></details>
<h2>4. The code, model first</h2>
<h4>Step 1 — model and repository</h4>
<pre class="trich"><code class="language-java">public class Account {

    // So tai khoan (10 chu so)
    private String account;

    // Mat khau
    private String password;

    // Tao tai khoan rong (JavaBean)
    public Account() {
    }

    // Tao tai khoan voi so tai khoan va mat khau
    public Account(String account, String password) {
        this.account = account;
        this.password = password;
    }</code></pre>
<pre class="trich"><code class="language-java">// Tao kho va nap cac tai khoan mau
public AccountRepository() {
    this.accountList = new ArrayList&lt;&gt;();

    // Moi vong them 1 tai khoan mau (so tai khoan + mat khau cung vi tri)
    for (int i = 0; i &lt; Constants.SAMPLE_ACCOUNT_ARRAY.length; i++) {
        accountList.add(new Account(Constants.SAMPLE_ACCOUNT_ARRAY[i],
                Constants.SAMPLE_PASSWORD_ARRAY[i]));
    }
}</code></pre>
<pre class="trich"><code class="language-java">// Kiem dang nhap: true neu co tai khoan trung ca so tai khoan lan mat khau
public boolean checkLogin(AccountDTO accountDTO) {
    // Duyet tung tai khoan trong kho
    for (Account account : accountList) {
        // Trung ca 2 thi dang nhap dung
        if ((accountDTO.getAccount().equals(account.getAccount())) &amp;&amp;
                (accountDTO.getPassword().equals(account.getPassword()))) {
            return true;
        }
    }

    return false;
}</code></pre>
<h4>Step 2 — the language: Resource and Message</h4>
<pre class="trich"><code class="language-java">// Doi sang ngon ngu moi: nap file .properties tuong ung
public static void setLocate(Locale locale) {
    resourceBundle = ResourceBundle.getBundle(Constants.LANGUAGE_FILE, locale);
}</code></pre>
<pre class="trich"><code class="language-java">// Cau nhac nhap so tai khoan
public static String getAccountPrompt() {
    return Resource.getString("account");
}</code></pre>
<h4>Step 3 — Validation and CaptchaUtils</h4>
<pre class="trich"><code class="language-java">// Kiem mat khau: 8-31 ky tu, co ca chu va so (ham checkPassword cua de)
public static String checkPassword(String password) throws Exception {
    // Khong khop regex mat khau thi bao loi
    if (!password.matches(Constants.PASSWORD)) {
        throw new Exception(Message.getPasswordInvalid());
    }

    return password;
}</code></pre>
<pre class="trich"><code class="language-java">// Kiem captcha: chuoi go vao khong rong va nam trong captcha (dung contains() nhu de)
public static void checkCaptcha(String input, String captcha) throws Exception {
    String text = input.trim();

    // Rong hoac khong nam trong captcha thi bao sai
    if ((text.isEmpty()) || (!captcha.contains(text))) {
        throw new Exception(Message.getCaptchaInvalid());
    }
}</code></pre>
<pre class="trich"><code class="language-java">// Sinh 1 chuoi captcha gom chu hoa, chu thuong va so (Random -&gt; vi tri -&gt; char)
public static String generateCaptcha() {
    StringBuilder captchaBuilder = new StringBuilder();
    Random random = new Random();
    int index = 0;

    // Moi vong lay ngau nhien 1 ky tu trong bang ky tu
    for (int i = 0; i &lt; Constants.CAPTCHA_LENGTH; i++) {
        index = random.nextInt(Constants.CAPTCHA_CHARACTERS.length());
        captchaBuilder.append(Constants.CAPTCHA_CHARACTERS.charAt(index));
    }

    return captchaBuilder.toString();
}</code></pre>
<h4>Step 4 — view and controller</h4>
<pre class="trich"><code class="language-java">// Dang nhap bang phieu Main da kiem (ca captcha), in ket qua 1 lan
public void login(AccountDTO accountDTO) {
    ResponseDTO responseDTO = new ResponseDTO();

    // Dung tai khoan va mat khau thi bao thanh cong, nguoc lai bao that bai
    if (accountRepository.checkLogin(accountDTO)) {
        responseDTO.setMessage(Message.getLoginSuccess());
    } else {
        // Sai so tai khoan hoac mat khau
        responseDTO.setMessage(Message.getLoginFailed());
    }

    accountView.setResponseDTO(responseDTO);
    accountView.display();
}</code></pre>
<pre class="trich"><code class="language-java">// In cau ket qua dang nhap
public void display() {
    System.out.println(responseDTO.getMessage());
}</code></pre>
<h4>Step 5 — Main</h4>
<pre class="trich"><code class="language-java">// Chay chuong trinh: lap menu den khi chon 3
public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    AccountController accountController = new AccountController();
    AccountDTO accountDTO = null;
    boolean isRunning = true;

    // Hien lai menu sau moi lan dang nhap, den khi chon thoat (khong dung System.exit)
    while (isRunning) {
        System.out.println(Message.getMenuHeader().concat(Message.getMenuBody()));

        // Moi lua chon: doi ngon ngu, nhap du, goi controller dung 1 lan
        switch (inputChoice(scanner)) {
            // 1: doi sang tieng Viet roi dang nhap
            case Constants.MENU_VIETNAMESE:
                Resource.setLocate(Constants.LOCALE_VIETNAMESE);
                accountDTO = inputLogin(scanner);
                accountController.login(accountDTO);
                break;

            // 2: doi sang tieng Anh roi dang nhap
            case Constants.MENU_ENGLISH:
                Resource.setLocate(Constants.LOCALE_ENGLISH);
                accountDTO = inputLogin(scanner);
                accountController.login(accountDTO);
                break;

            // 3: tat co de thoat vong lap
            case Constants.MENU_EXIT:
                isRunning = false;
                break;

            // Khong xay ra: inputChoice chi tra ve 1 den 3
            default:
                break;
        }
    }
}</code></pre>
<pre class="trich"><code class="language-java">// Nhap du 1 lan dang nhap theo thu tu de: tai khoan, mat khau, captcha
private static AccountDTO inputLogin(Scanner scanner) {
    AccountDTO accountDTO = new AccountDTO();
    String captcha = CaptchaUtils.generateCaptcha();

    accountDTO.setAccount(inputAccountNumber(scanner));
    accountDTO.setPassword(inputPassword(scanner));

    // Captcha sinh moi moi lan dang nhap, kiem o Main TRUOC khi Controller hoi kho tai khoan
    System.out.println(Message.getCaptchaLabel().concat(captcha));
    inputCaptcha(scanner, captcha);

    return accountDTO;
}</code></pre>
<pre class="trich"><code class="language-java">// Hoi captcha den khi chuoi go vao nam trong captcha (contains, chan chuoi rong)
private static void inputCaptcha(Scanner scanner, String captcha) {
    boolean isValid = false;

    // Lap den khi go dung captcha
    while (!isValid) {
        // In cau nhac, doc dong va kiem
        try {
            System.out.print(Message.getCaptchaPrompt());
            Validation.checkCaptcha(scanner.nextLine(), captcha);
            isValid = true;
        } catch (Exception e) {
            // Sai thi in cau bao loi (theo ngon ngu) roi hoi lai
            System.out.println(e.getMessage());
        }
    }
}</code></pre>
<div class="pitfall"><p>⚠️ Traps of this lab: <code>Language_vn</code> instead of <code>_vi</code> · the .properties in the wrong package (MissingResourceException) · a Vietnamese file with accents read as ISO-8859-1 · NetBeans removing the trailing spaces of a prompt · <code>[A-Za-z0-9]{8,31}</code> without the two look-aheads (12345678 passes) · <code>{8,}</code> instead of <code>{8,31}</code> · <code>contains("")</code> is always true · <code>Locale.setDefault</code> changing the whole JVM · <code>printf(text)</code> with a <code>%</code> inside.</p></div>`,
    `<h2>3. Thiết kế lớp</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/9973ab2c9dc706eb1d628526ab6c7378a22855f0.svg" alt="P0070: không service — controller hỏi repository; Main sinh và kiểm captcha trước khi gọi" loading="lazy" /><p class="chu-thich">🧩 P0070: không service — controller hỏi repository; Main sinh và kiểm captcha trước khi gọi</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title J1.S.P0070 Ebank Login — no service: the controller asks the repository, Main checks the captcha first
package main {
  class Main &lt;&lt;final&gt;&gt; {
    + {static} main(args : String[]) : void
    - {static} inputLogin(scanner : Scanner) : AccountDTO
    - {static} inputCaptcha(scanner : Scanner, captcha : String) : void
  }
}
package controller {
  class AccountController {
    - accountRepository : AccountRepository
    - accountView : AccountView
    + login(accountDTO : AccountDTO) : void
  }
}
package repository {
  class AccountRepository {
    - accountList : ArrayList&lt;Account&gt;
    + checkLogin(accountDTO : AccountDTO) : boolean
  }
}
package model {
  class Account {
    - account : String
    - password : String
  }
}
package view {
  class AccountView {
    - responseDTO : ResponseDTO
    + display() : void
  }
}
package dto {
  class AccountDTO {
    - account : String
    - password : String
  }
  class ResponseDTO {
    - message : String
  }
}
package utils {
  class Validation &lt;&lt;final&gt;&gt; {
    + {static} checkAccountNumber(accountNumber : String) : String
    + {static} checkPassword(password : String) : String
    + {static} checkCaptcha(input : String, captcha : String) : void
  }
  class CaptchaUtils &lt;&lt;final&gt;&gt; {
    + {static} generateCaptcha() : String
  }
  class Resource &lt;&lt;final&gt;&gt; {
    - {static} resourceBundle : ResourceBundle
    + {static} setLocate(locale : Locale) : void
    + {static} getString(key : String) : String
  }
}
package constants {
  class Message &lt;&lt;final&gt;&gt; {
    + {static} getAccountPrompt() : String
    + {static} getLoginSuccess() : String
  }
  class "Language_en / Language_vi" as Lang &lt;&lt;properties&gt;&gt;
}
Main ..&gt; AccountController : one call per case
Main ..&gt; Validation : account, password, captcha
Main ..&gt; CaptchaUtils : a new captcha per login
Main ..&gt; Resource : setLocate(vi / en)
AccountController *-- AccountRepository : checkLogin
AccountController *-- AccountView : display() once
AccountRepository o-- "0..*" Account
Message ..&gt; Resource : getString(key)
Resource ..&gt; Lang : getBundle(name, locale)
@enduml</code></pre></details>
<h2>4. Code, model trước</h2>
<h4>Bước 1 — model và repository</h4>
<pre class="trich"><code class="language-java">public class Account {

    // So tai khoan (10 chu so)
    private String account;

    // Mat khau
    private String password;

    // Tao tai khoan rong (JavaBean)
    public Account() {
    }

    // Tao tai khoan voi so tai khoan va mat khau
    public Account(String account, String password) {
        this.account = account;
        this.password = password;
    }</code></pre>
<pre class="trich"><code class="language-java">// Tao kho va nap cac tai khoan mau
public AccountRepository() {
    this.accountList = new ArrayList&lt;&gt;();

    // Moi vong them 1 tai khoan mau (so tai khoan + mat khau cung vi tri)
    for (int i = 0; i &lt; Constants.SAMPLE_ACCOUNT_ARRAY.length; i++) {
        accountList.add(new Account(Constants.SAMPLE_ACCOUNT_ARRAY[i],
                Constants.SAMPLE_PASSWORD_ARRAY[i]));
    }
}</code></pre>
<pre class="trich"><code class="language-java">// Kiem dang nhap: true neu co tai khoan trung ca so tai khoan lan mat khau
public boolean checkLogin(AccountDTO accountDTO) {
    // Duyet tung tai khoan trong kho
    for (Account account : accountList) {
        // Trung ca 2 thi dang nhap dung
        if ((accountDTO.getAccount().equals(account.getAccount())) &amp;&amp;
                (accountDTO.getPassword().equals(account.getPassword()))) {
            return true;
        }
    }

    return false;
}</code></pre>
<h4>Bước 2 — ngôn ngữ: Resource và Message</h4>
<pre class="trich"><code class="language-java">// Doi sang ngon ngu moi: nap file .properties tuong ung
public static void setLocate(Locale locale) {
    resourceBundle = ResourceBundle.getBundle(Constants.LANGUAGE_FILE, locale);
}</code></pre>
<pre class="trich"><code class="language-java">// Cau nhac nhap so tai khoan
public static String getAccountPrompt() {
    return Resource.getString("account");
}</code></pre>
<h4>Bước 3 — Validation và CaptchaUtils</h4>
<pre class="trich"><code class="language-java">// Kiem mat khau: 8-31 ky tu, co ca chu va so (ham checkPassword cua de)
public static String checkPassword(String password) throws Exception {
    // Khong khop regex mat khau thi bao loi
    if (!password.matches(Constants.PASSWORD)) {
        throw new Exception(Message.getPasswordInvalid());
    }

    return password;
}</code></pre>
<pre class="trich"><code class="language-java">// Kiem captcha: chuoi go vao khong rong va nam trong captcha (dung contains() nhu de)
public static void checkCaptcha(String input, String captcha) throws Exception {
    String text = input.trim();

    // Rong hoac khong nam trong captcha thi bao sai
    if ((text.isEmpty()) || (!captcha.contains(text))) {
        throw new Exception(Message.getCaptchaInvalid());
    }
}</code></pre>
<pre class="trich"><code class="language-java">// Sinh 1 chuoi captcha gom chu hoa, chu thuong va so (Random -&gt; vi tri -&gt; char)
public static String generateCaptcha() {
    StringBuilder captchaBuilder = new StringBuilder();
    Random random = new Random();
    int index = 0;

    // Moi vong lay ngau nhien 1 ky tu trong bang ky tu
    for (int i = 0; i &lt; Constants.CAPTCHA_LENGTH; i++) {
        index = random.nextInt(Constants.CAPTCHA_CHARACTERS.length());
        captchaBuilder.append(Constants.CAPTCHA_CHARACTERS.charAt(index));
    }

    return captchaBuilder.toString();
}</code></pre>
<h4>Bước 4 — view và controller</h4>
<pre class="trich"><code class="language-java">// Dang nhap bang phieu Main da kiem (ca captcha), in ket qua 1 lan
public void login(AccountDTO accountDTO) {
    ResponseDTO responseDTO = new ResponseDTO();

    // Dung tai khoan va mat khau thi bao thanh cong, nguoc lai bao that bai
    if (accountRepository.checkLogin(accountDTO)) {
        responseDTO.setMessage(Message.getLoginSuccess());
    } else {
        // Sai so tai khoan hoac mat khau
        responseDTO.setMessage(Message.getLoginFailed());
    }

    accountView.setResponseDTO(responseDTO);
    accountView.display();
}</code></pre>
<pre class="trich"><code class="language-java">// In cau ket qua dang nhap
public void display() {
    System.out.println(responseDTO.getMessage());
}</code></pre>
<h4>Bước 5 — Main</h4>
<pre class="trich"><code class="language-java">// Chay chuong trinh: lap menu den khi chon 3
public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    AccountController accountController = new AccountController();
    AccountDTO accountDTO = null;
    boolean isRunning = true;

    // Hien lai menu sau moi lan dang nhap, den khi chon thoat (khong dung System.exit)
    while (isRunning) {
        System.out.println(Message.getMenuHeader().concat(Message.getMenuBody()));

        // Moi lua chon: doi ngon ngu, nhap du, goi controller dung 1 lan
        switch (inputChoice(scanner)) {
            // 1: doi sang tieng Viet roi dang nhap
            case Constants.MENU_VIETNAMESE:
                Resource.setLocate(Constants.LOCALE_VIETNAMESE);
                accountDTO = inputLogin(scanner);
                accountController.login(accountDTO);
                break;

            // 2: doi sang tieng Anh roi dang nhap
            case Constants.MENU_ENGLISH:
                Resource.setLocate(Constants.LOCALE_ENGLISH);
                accountDTO = inputLogin(scanner);
                accountController.login(accountDTO);
                break;

            // 3: tat co de thoat vong lap
            case Constants.MENU_EXIT:
                isRunning = false;
                break;

            // Khong xay ra: inputChoice chi tra ve 1 den 3
            default:
                break;
        }
    }
}</code></pre>
<pre class="trich"><code class="language-java">// Nhap du 1 lan dang nhap theo thu tu de: tai khoan, mat khau, captcha
private static AccountDTO inputLogin(Scanner scanner) {
    AccountDTO accountDTO = new AccountDTO();
    String captcha = CaptchaUtils.generateCaptcha();

    accountDTO.setAccount(inputAccountNumber(scanner));
    accountDTO.setPassword(inputPassword(scanner));

    // Captcha sinh moi moi lan dang nhap, kiem o Main TRUOC khi Controller hoi kho tai khoan
    System.out.println(Message.getCaptchaLabel().concat(captcha));
    inputCaptcha(scanner, captcha);

    return accountDTO;
}</code></pre>
<pre class="trich"><code class="language-java">// Hoi captcha den khi chuoi go vao nam trong captcha (contains, chan chuoi rong)
private static void inputCaptcha(Scanner scanner, String captcha) {
    boolean isValid = false;

    // Lap den khi go dung captcha
    while (!isValid) {
        // In cau nhac, doc dong va kiem
        try {
            System.out.print(Message.getCaptchaPrompt());
            Validation.checkCaptcha(scanner.nextLine(), captcha);
            isValid = true;
        } catch (Exception e) {
            // Sai thi in cau bao loi (theo ngon ngu) roi hoi lai
            System.out.println(e.getMessage());
        }
    }
}</code></pre>
<div class="pitfall"><p>⚠️ Bẫy của bài: đặt <code>Language_vn</code> thay vì <code>_vi</code> · để .properties sai package (MissingResourceException) · tệp tiếng Việt có dấu bị Java 8 đọc theo ISO-8859-1 · NetBeans xoá dấu cách cuối câu nhắc · <code>[A-Za-z0-9]{8,31}</code> thiếu hai phép nhìn trước (12345678 lọt) · <code>{8,}</code> thay cho <code>{8,31}</code> · <code>contains("")</code> luôn đúng · <code>Locale.setDefault</code> đổi cả máy ảo · <code>printf(chữ)</code> mà chữ có <code>%</code>.</p></div>`),
    bi(`<h2>5. Run it for real</h2>
<p>The test keys (<code>harness/input.txt</code>): English, accounts <code>1</code>, <code>a</code>, <code>aaaaaaaaaa</code>, <code>123456789</code>, then <code>0123456789</code>; passwords <code>1</code>, <code>12345678</code>, <code>aaaaaaaa</code>, 32 ones, then <code>123456ab</code>; captcha <code>Adafda</code>, Enter, <code>{CAP1}</code>; then Vietnamese, <code>1029817261</code> / <code>matkhau123a</code> / <code>{CAPMID}</code>; menu <code>0</code>, <code>x</code>, <code>3</code>.</p>
<details><summary>The whole run (29 lines)</summary>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">-------Login Program-------<br>
1. Vietnamese<br>
2. English<br>
3. Exit<br>
Please choice one option: Account number: &nbsp;Account number must is a number and must have 10 digits<br>
Account number: &nbsp;Account number must is a number and must have 10 digits<br>
Account number: &nbsp;Account number must is a number and must have 10 digits<br>
Account number: &nbsp;Account number must is a number and must have 10 digits<br>
Account number: &nbsp;Password: Password must be between 8 and 31 characters and must be alphanumeric<br>
Password: Password must be between 8 and 31 characters and must be alphanumeric<br>
Password: Password must be between 8 and 31 characters and must be alphanumeric<br>
Password: Password must be between 8 and 31 characters and must be alphanumeric<br>
Password: Captcha: XXXXX<br>
Enter a Captcha incorrect characters: Captcha incorrect<br>
Enter a Captcha incorrect characters: Captcha incorrect<br>
Enter a Captcha incorrect characters: Login failed: the account number or password is wrong. Please try again.<br>
-------Login Program-------<br>
1. Vietnamese<br>
2. English<br>
3. Exit<br>
Please choice one option: So tai khoan: &nbsp;Mat khau: Captcha: XXXXX<br>
Nhap 1 ky tu captcha: Dang nhap thanh cong!<br>
-------Chuong Trinh Dang Nhap-------<br>
1. Tieng Viet<br>
2. Tieng Anh<br>
3. Thoat<br>
Moi chon 1 chuc nang: Lua chon phai la so tu 1 den 3. Moi nhap lai.<br>
Moi chon 1 chuc nang: Ban phai nhap so (1, 2 hoac 3), khong nhap chu hay de trong. Moi nhap lai.<br>
Moi chon 1 chuc nang:</div>
</details>
<p>Every validation message once, then the login that fails — the account passed the regex but is not in the store:</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Please choice one option: Account number: &nbsp;Account number must is a number and must have 10 digits<br>
Account number: &nbsp;Account number must is a number and must have 10 digits<br>
Account number: &nbsp;Account number must is a number and must have 10 digits<br>
Account number: &nbsp;Account number must is a number and must have 10 digits<br>
Account number: &nbsp;Password: Password must be between 8 and 31 characters and must be alphanumeric<br>
Password: Password must be between 8 and 31 characters and must be alphanumeric<br>
Password: Password must be between 8 and 31 characters and must be alphanumeric<br>
Password: Password must be between 8 and 31 characters and must be alphanumeric<br>
Password: Captcha: XXXXX<br>
Enter a Captcha incorrect characters: Captcha incorrect<br>
Enter a Captcha incorrect characters: Captcha incorrect<br>
Enter a Captcha incorrect characters: Login failed: the account number or password is wrong. Please try again.<br>
…</div>
<p>The same program in Vietnamese, after <code>setLocate</code>:</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Please choice one option: So tai khoan: &nbsp;Mat khau: Captcha: XXXXX<br>
Nhap 1 ky tu captcha: Dang nhap thanh cong!<br>
-------Chuong Trinh Dang Nhap-------<br>
1. Tieng Viet<br>
2. Tieng Anh<br>
3. Thoat<br>
Moi chon 1 chuc nang: Lua chon phai la so tu 1 den 3. Moi nhap lai.<br>
Moi chon 1 chuc nang: Ban phai nhap so (1, 2 hoac 3), khong nhap chu hay de trong. Moi nhap lai.<br>
…</div>
<pre><code class="language-bash">$ python3 lint.py MSSV_J1SP0070_EbankLogin</code></pre>
<div class="out">✓ MSSV_J1SP0070_EbankLogin — sạch</div>
<p>A real JDK 8 prints the same 29 lines. The paper checklist audit: 0 violations. There is no automatic grader for this lab — the captcha changes every run: type the keys of <code>harness/input.txt</code> (for <code>{CAP1}</code> type the first character of the captcha on screen, for <code>{CAPMID}</code> the second and third) and compare with <code>harness/man-hinh-mong-doi.txt</code>.</p>
<h2>6. Debug it</h2>
<p>Breakpoint on <code>if ((text.isEmpty()) || (!captcha.contains(text)))</code> in <code>Validation.checkCaptcha</code> → Ctrl+F5 → choose 2, type a good account and password → at the captcha press Enter: <code>text</code> is <code>""</code>, F8 goes to the <code>throw</code>. Type the first character of the captcha: <code>captcha.contains(text)</code> is true, F8 leaves the method. Then F7 into <code>accountController.login</code>: only now is the repository asked.</p>
<h2>7. The questions — answer out loud</h2>
<details><summary>Why is the captcha checked before the account?</summary><p class="dap-an">✅ A captcha stops a machine trying passwords. If the program says "wrong account" before the captcha, the machine learns right from wrong without solving it. The captcha is made again at each login, as the brief says.</p></details>
<details><summary>Why is there no service?</summary><p class="dap-an">✅ There is no business computation: the old service forwarded one line to the repository. The paper adds a service only when something is computed. Controller → repository → view.</p></details>
<details><summary>Where is contains(), and what if I press Enter?</summary><p class="dap-an">✅ <code>Validation.checkCaptcha</code>. Every string contains the empty string, so the empty input is refused first; then <code>captcha.contains(text)</code>. <code>contains</code> is case-sensitive: <code>h</code> does not match <code>H</code>.</p></details>
<details><summary>How does the language switch?</summary><p class="dap-an">✅ <code>Resource.setLocate(locale)</code> loads <code>Language_vi</code> or <code>Language_en</code>; every sentence goes through <code>Message.getX()</code> → <code>Resource.getString(key)</code>, so one call changes the whole screen. A third language is one more file.</p></details>
<details><summary>Why is the account number a String?</summary><p class="dap-an">✅ It keeps the leading 0 (<code>0123456789</code>) and ten digits overflow an <code>int</code> (max 2,147,483,647).</p></details>
<details><summary>Why not System.exit?</summary><p class="dap-an">✅ It stops the JVM at once and skips any cleanup; with a flag the loop ends and <code>main</code> returns normally.</p></details>
<h2>8. Download</h2>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/lab211/v2/MSSV_J1SP0070_EbankLogin-solution.zip" target="_blank" rel="noopener">
<span class="lc-ico">✅</span>
<span class="lc-body"><span class="lc-title">MSSV_J1SP0070_EbankLogin-solution.zip</span><span class="lc-sub">NetBeans project (Java 8) · 12 Java files + 2 .properties · harness/input.txt (test keys) + harness/man-hinh-mong-doi.txt (expected screen)</span></span>
<span class="lc-cta">Download</span>
</a>
<div class="callout"><p><strong>Next:</strong> P0071 Task Management — the lab where the lecturer said "no service" and "every error in Vietnamese".</p></div>`,
    `<h2>5. Chạy thật</h2>
<p>Bộ phím test (<code>harness/input.txt</code>): tiếng Anh, tài khoản <code>1</code>, <code>a</code>, <code>aaaaaaaaaa</code>, <code>123456789</code>, rồi <code>0123456789</code>; mật khẩu <code>1</code>, <code>12345678</code>, <code>aaaaaaaa</code>, 32 số 1, rồi <code>123456ab</code>; captcha <code>Adafda</code>, Enter, <code>{CAP1}</code>; rồi tiếng Việt, <code>1029817261</code> / <code>matkhau123a</code> / <code>{CAPMID}</code>; menu <code>0</code>, <code>x</code>, <code>3</code>.</p>
<details><summary>Toàn bộ lần chạy (29 dòng)</summary>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">-------Login Program-------<br>
1. Vietnamese<br>
2. English<br>
3. Exit<br>
Please choice one option: Account number: &nbsp;Account number must is a number and must have 10 digits<br>
Account number: &nbsp;Account number must is a number and must have 10 digits<br>
Account number: &nbsp;Account number must is a number and must have 10 digits<br>
Account number: &nbsp;Account number must is a number and must have 10 digits<br>
Account number: &nbsp;Password: Password must be between 8 and 31 characters and must be alphanumeric<br>
Password: Password must be between 8 and 31 characters and must be alphanumeric<br>
Password: Password must be between 8 and 31 characters and must be alphanumeric<br>
Password: Password must be between 8 and 31 characters and must be alphanumeric<br>
Password: Captcha: XXXXX<br>
Enter a Captcha incorrect characters: Captcha incorrect<br>
Enter a Captcha incorrect characters: Captcha incorrect<br>
Enter a Captcha incorrect characters: Login failed: the account number or password is wrong. Please try again.<br>
-------Login Program-------<br>
1. Vietnamese<br>
2. English<br>
3. Exit<br>
Please choice one option: So tai khoan: &nbsp;Mat khau: Captcha: XXXXX<br>
Nhap 1 ky tu captcha: Dang nhap thanh cong!<br>
-------Chuong Trinh Dang Nhap-------<br>
1. Tieng Viet<br>
2. Tieng Anh<br>
3. Thoat<br>
Moi chon 1 chuc nang: Lua chon phai la so tu 1 den 3. Moi nhap lai.<br>
Moi chon 1 chuc nang: Ban phai nhap so (1, 2 hoac 3), khong nhap chu hay de trong. Moi nhap lai.<br>
Moi chon 1 chuc nang:</div>
</details>
<p>Mọi câu báo lỗi một lần, rồi lần đăng nhập thất bại — tài khoản qua regex nhưng không có trong kho:</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Please choice one option: Account number: &nbsp;Account number must is a number and must have 10 digits<br>
Account number: &nbsp;Account number must is a number and must have 10 digits<br>
Account number: &nbsp;Account number must is a number and must have 10 digits<br>
Account number: &nbsp;Account number must is a number and must have 10 digits<br>
Account number: &nbsp;Password: Password must be between 8 and 31 characters and must be alphanumeric<br>
Password: Password must be between 8 and 31 characters and must be alphanumeric<br>
Password: Password must be between 8 and 31 characters and must be alphanumeric<br>
Password: Password must be between 8 and 31 characters and must be alphanumeric<br>
Password: Captcha: XXXXX<br>
Enter a Captcha incorrect characters: Captcha incorrect<br>
Enter a Captcha incorrect characters: Captcha incorrect<br>
Enter a Captcha incorrect characters: Login failed: the account number or password is wrong. Please try again.<br>
…</div>
<p>Cùng chương trình bằng tiếng Việt, sau <code>setLocate</code>:</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Please choice one option: So tai khoan: &nbsp;Mat khau: Captcha: XXXXX<br>
Nhap 1 ky tu captcha: Dang nhap thanh cong!<br>
-------Chuong Trinh Dang Nhap-------<br>
1. Tieng Viet<br>
2. Tieng Anh<br>
3. Thoat<br>
Moi chon 1 chuc nang: Lua chon phai la so tu 1 den 3. Moi nhap lai.<br>
Moi chon 1 chuc nang: Ban phai nhap so (1, 2 hoac 3), khong nhap chu hay de trong. Moi nhap lai.<br>
…</div>
<pre><code class="language-bash">$ python3 lint.py MSSV_J1SP0070_EbankLogin</code></pre>
<div class="out">✓ MSSV_J1SP0070_EbankLogin — sạch</div>
<p>JDK 8 thật in đúng 29 dòng đó. Soát tờ checklist giấy: 0 vi phạm. Bài này không có bộ chấm tự động — captcha đổi mỗi lần chạy: gõ các phím trong <code>harness/input.txt</code> (gặp <code>{CAP1}</code> thì gõ ký tự đầu của captcha trên màn hình, gặp <code>{CAPMID}</code> thì gõ ký tự thứ hai và thứ ba) rồi so với <code>harness/man-hinh-mong-doi.txt</code>.</p>
<h2>6. Debug</h2>
<p>Breakpoint ở <code>if ((text.isEmpty()) || (!captcha.contains(text)))</code> trong <code>Validation.checkCaptcha</code> → Ctrl+F5 → chọn 2, gõ tài khoản và mật khẩu đúng dạng → tới captcha nhấn Enter: <code>text</code> là <code>""</code>, F8 nhảy vào <code>throw</code>. Gõ ký tự đầu của captcha: <code>captcha.contains(text)</code> đúng, F8 ra khỏi hàm. Rồi F7 vào <code>accountController.login</code>: lúc này repository mới được hỏi.</p>
<h2>7. Câu thầy hỏi — trả lời thành tiếng</h2>
<details><summary>Sao captcha kiểm trước tài khoản?</summary><p class="dap-an">✅ Captcha chặn máy dò mật khẩu. Nếu chương trình báo "sai tài khoản" trước captcha thì máy biết đúng sai mà không cần giải captcha. Captcha sinh lại mỗi lần đăng nhập, đúng như đề.</p></details>
<details><summary>Sao không có service?</summary><p class="dap-an">✅ Bài không có tính toán nghiệp vụ: service cũ chỉ chuyển tiếp một dòng xuống repository. Tờ giấy chỉ thêm service khi có tính toán. Controller → repository → view.</p></details>
<details><summary>contains() ở đâu, nhấn Enter thì sao?</summary><p class="dap-an">✅ <code>Validation.checkCaptcha</code>. Chuỗi nào cũng chứa chuỗi rỗng, nên ô trống bị chặn trước; rồi mới <code>captcha.contains(text)</code>. <code>contains</code> phân biệt hoa thường: <code>h</code> không khớp <code>H</code>.</p></details>
<details><summary>Đổi ngôn ngữ chạy thế nào?</summary><p class="dap-an">✅ <code>Resource.setLocate(locale)</code> nạp <code>Language_vi</code> hoặc <code>Language_en</code>; mọi câu chữ đi qua <code>Message.getX()</code> → <code>Resource.getString(key)</code>, nên một lời gọi đổi cả màn hình. Thêm ngôn ngữ thứ ba là thêm một tệp.</p></details>
<details><summary>Sao số tài khoản là String?</summary><p class="dap-an">✅ Giữ số 0 đầu (<code>0123456789</code>), và mười chữ số tràn <code>int</code> (tối đa 2.147.483.647).</p></details>
<details><summary>Sao không dùng System.exit?</summary><p class="dap-an">✅ Nó tắt máy ảo ngay, bỏ qua mọi việc dọn dẹp; dùng cờ thì vòng lặp tự kết thúc và <code>main</code> chạy hết bình thường.</p></details>
<h2>8. Tệp tải về</h2>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/lab211/v2/MSSV_J1SP0070_EbankLogin-solution.zip" target="_blank" rel="noopener">
<span class="lc-ico">✅</span>
<span class="lc-body"><span class="lc-title">MSSV_J1SP0070_EbankLogin-solution.zip</span><span class="lc-sub">project NetBeans (Java 8) · 12 tệp Java + 2 tệp .properties · harness/input.txt (phím test) + harness/man-hinh-mong-doi.txt (màn hình mong đợi)</span></span>
<span class="lc-cta">Tải về</span>
</a>
<div class="callout"><p><strong>Bài tiếp:</strong> P0071 Task Management — bài thầy nói "bỏ service" và "mọi câu lỗi tiếng Việt".</p></div>`),
  ].join('\n'),
};

/* ───────── L.5 — 🎓 LAB211 J1.S.P0071 Task Management: no service, the repository checks the ID, a real date, a half hour, Vietnamese errors ───────── */
const L_l211_p0071 = {
  title: 'L.5 — 🎓 LAB211 J1.S.P0071 Task Management: no service, the repository checks the ID, a real date, a half hour, Vietnamese errors|||L.5 — 🎓 LAB211 J1.S.P0071 Quản lý task: không service, kho kiểm ID, ngày có thật, nửa giờ, câu lỗi tiếng Việt',
  slug: 'pro192-lab211-p0071-task-management',
  type: 'VIDEO',
  description: 'Bài LAB211 J1.S.P0071 (150 LOC) đi từ bản thầy đã review với hai câu dặn: mọi câu lỗi tiếng Việt nói rõ sai gì và nhập lại thế nào, và bỏ service — bài vốn không có package service nhưng controller vẫn làm việc của service (gọi findById lấy model Task rồi tự quyết). Đọc đề (Requirement Name, loại 1–4, ngày dd-MM-yyyy có thật, giờ 8.0–17.5 bước 0.5 với From nhỏ hơn To, ID = ID cuối + 1, ba hàm addTask/deleteTask/getDataTasks), chạy lại bản cũ thấy lỗi thật (Enter ở ô Date được nhận rồi Display sập "date must not be null", 26-06-2015abc lọt, bảng lệch, 10,0 trên Windows tiếng Việt), rồi dựng bản sạch: TaskRepository tự kiểm ID có hay không, Validation so ngày theo hai chiều, view một display() mỗi luồng, Main một lần gọi mỗi case, không static, không System.exit. Chạy thật, PASS 99/99, lint.py sạch, 25 mục 0 vi phạm, JDK 8 thật. Kèm câu thầy hỏi và dự án tải về.',
  content: [
    bi(`<span class="eyebrow">🎓 LAB211 in practice · L.5 · J1.S.P0071</span>
<h2>Task Management — "no service, and say what to type"</h2>
<p class="lead">The lecturer reviewed this lab and asked for two things: every error message in Vietnamese, saying what is wrong and what to type; and <em>no service</em>. The second one was surprising — the lab had no <code>service</code> package. But its controller still did a service's job: it looked a task up, got a <code>Task</code> model back and decided. That decision moves to the repository.</p>
<p>Running the reviewed version again with the test keys found worse: pressing Enter at <code>Date</code> was accepted, and the next Display crashed. Plan about <strong>2 hours</strong> to retype, 20 minutes for the test keys.</p>`,
    `<span class="eyebrow">🎓 LAB211 thực chiến · L.5 · J1.S.P0071</span>
<h2>Quản lý task — "bỏ service, và nói rõ phải nhập gì"</h2>
<p class="lead">Thầy review bài này và dặn hai việc: mọi câu lỗi viết tiếng Việt, nói rõ sai gì và phải nhập gì; và <em>bỏ service</em>. Câu thứ hai nghe lạ — bài không có package <code>service</code>. Nhưng controller vẫn làm việc của service: tự tìm task, nhận về model <code>Task</code> rồi tự quyết. Việc quyết đó chuyển về repository.</p>
<p>Chạy lại bản đã review bằng bộ phím test còn thấy chuyện nặng hơn: nhấn Enter ở ô <code>Date</code> vẫn được nhận, và lần Display sau thì sập. Dành khoảng <strong>2 giờ</strong> để gõ lại, 20 phút cho bộ phím test.</p>`),
    bi(`<h2>📑 Slide by slide — PRO192 · LAB211 P0071 (14 slides)</h2>
<p>The deck of this LAB211 lesson, made by CuongThai (it is not a school deck and not the lecturer's). Each slide is followed by its key idea and the explanation; every piece of code and every output on the slides comes from the real project in this lesson — checked by <code>lint.py</code> (the lecturer's rules), compiled with <code>javac --release 8</code> and run on a real JDK 8, like the machines in the lab room.</p>`,
    `<h2>📑 Học theo từng slide — PRO192 · LAB211 P0071 (14 slide)</h2>
<p>Bộ slide của bài LAB211 này do CuongThai dựng (không phải slide của trường, cũng không phải của thầy). Dưới mỗi slide là ý chính và lời giảng; mọi đoạn code, mọi output trên slide đều lấy từ đúng dự án trong bài — qua <code>lint.py</code> (luật của thầy), biên dịch bằng <code>javac --release 8</code> và chạy trên JDK 8 thật, giống máy phòng lab.</p>`),
    walk('l211-p0071', [
      [1, 'J1.S.P0071 — Task Management',
        `<p class="y-chinh">🎯 Add, delete and list tasks with a type, a date and a plan time — the lab where the lecturer said "no service".</p>
<p>The deck: the brief, plan time by hand, what the lecturer said, a real crash, what the test keys found, the clean design, each layer, the real run, the questions.</p>`,
        `<p class="y-chinh">🎯 Thêm, xoá và liệt kê task có loại, ngày và giờ kế hoạch — bài thầy nói "bỏ service".</p>
<p>Bộ slide: đề, giờ kế hoạch chạy tay, thầy đã nói gì, một lần sập thật, phím test tìm ra gì, thiết kế sạch, từng tầng, lần chạy thật, các câu hỏi.</p>`],
      [2, 'The brief',
        `<p class="y-chinh">🎯 Menu 1 Add Task · 2 Delete task · 3 Display Task · 4 exit. A task: Requirement Name, Task Type 1–4, Date dd-MM-yyyy, From, To, Assignee, Reviewer; ID = last ID + 1.</p>
<p>The type must exist (1 Code, 2 Test, 3 Design, 4 Review), the date must be real, From and To go from 8.0 to 17.5 by half hours with From before To. Delete needs an existing ID; Display lists the tasks by ascending ID. The brief names three methods: <code>addTask</code> (returns the id), <code>deleteTask</code>, <code>getDataTasks</code>.</p>`,
        `<p class="y-chinh">🎯 Menu 1 Add Task · 2 Delete task · 3 Display Task · 4 exit. Một task: Requirement Name, Task Type 1–4, Date dd-MM-yyyy, From, To, Assignee, Reviewer; ID = ID cuối + 1.</p>
<p>Loại phải tồn tại (1 Code, 2 Test, 3 Design, 4 Review), ngày phải có thật, From và To từ 8.0 tới 17.5 theo từng nửa giờ, From trước To. Xoá cần ID đang có; Display liệt kê task theo ID tăng dần. Đề đặt tên ba hàm: <code>addTask</code> (trả về id), <code>deleteTask</code>, <code>getDataTasks</code>.</p>`],
      [3, 'Plan time, by hand',
        `<p class="y-chinh">🎯 From is asked in [8.0, 17.0] so that a half hour stays for To; To is asked in [From + 0.5, 17.5]. Time in the table = To − From.</p>
<p>The second range depends on the first answer, so Main passes <code>planFrom</code> into <code>getPlanTo</code>. 9.7 is refused even inside the range: only whole or half hours. 8 to 16 gives 8.0, 8 to 9 gives 1.0.</p>`,
        `<p class="y-chinh">🎯 From hỏi trong [8.0, 17.0] để còn nửa giờ cho To; To hỏi trong [From + 0.5, 17.5]. Time trong bảng = To − From.</p>
<p>Khoảng thứ hai phụ thuộc câu trả lời thứ nhất, nên Main truyền <code>planFrom</code> vào <code>getPlanTo</code>. 9.7 bị từ chối dù nằm trong khoảng: chỉ giờ tròn hoặc nửa giờ. 8 tới 16 ra 8.0, 8 tới 9 ra 1.0.</p>`],
      [4, 'What the lecturer said in review',
        `<p class="y-chinh">🎯 (a) every error in Vietnamese, saying what is wrong and what to type; (b) no service. The reviewed controller called <code>findById</code>, received a model <code>Task</code> and decided — a service's job in the wrong layer.</p>
<p>The lecturer's tool on that version (names hidden): <code>lint.py</code> 343 violations — 195 comments, 48 hard-coded strings, 30 static, 26 fields — and 31 on the paper audit. Its messages were "Invalid!" and "Please input number in a range…".</p>`,
        `<p class="y-chinh">🎯 (a) mọi câu lỗi tiếng Việt, nói rõ sai gì và nhập gì; (b) bỏ service. Controller của bản đã review gọi <code>findById</code>, nhận model <code>Task</code> rồi tự quyết — việc của service nằm sai tầng.</p>
<p>Công cụ của thầy trên bản đó (đã ẩn tên): <code>lint.py</code> 343 vi phạm — 195 comment, 48 chuỗi viết thẳng, 30 static, 26 trường — và 31 khi soát tờ giấy. Câu báo lỗi là "Invalid!" và "Please input number in a range…".</p>`],
      [5, 'A real crash: Enter on Date',
        `<p class="y-chinh">🎯 The reviewed <code>getDate</code> returned <code>null</code> for an empty line: the task was added without a date, and the next Display printed the header, then "date must not be null".</p>
<p>The error appears in a different flow from the one that caused it — the hardest kind to find during a review. In the fixed version an empty line is simply a wrong date: <code>parse("")</code> throws and Main asks again.</p>`,
        `<p class="y-chinh">🎯 <code>getDate</code> của bản đã review trả <code>null</code> khi dòng trống: task được thêm mà không có ngày, và lần Display sau in tiêu đề rồi báo "date must not be null".</p>
<p>Lỗi hiện ra ở một luồng khác với luồng gây ra nó — loại khó tìm nhất lúc review. Ở bản sửa, dòng trống chỉ là một ngày sai: <code>parse("")</code> ném lỗi và Main hỏi lại.</p>`],
      [6, 'What the test keys found',
        `<p class="y-chinh">🎯 <code>26-06-2015abc</code> and <code>1-2-2015</code> accepted, an Assignee of spaces accepted, <code>" 1"</code> refused, a long name broke the table, Windows in Vietnamese printed <code>10,0 -&gt; 17,5</code>.</p>
<p>Each has a one-line cause: <code>parse</code> reads the beginning only; the name regex allowed <code>\\s</code> without a trim; no <code>trim()</code> before <code>parseInt</code>; header and rows had different formats plus a <code>\\n</code>; <code>%.1f</code> follows the machine's language.</p>`,
        `<p class="y-chinh">🎯 <code>26-06-2015abc</code> và <code>1-2-2015</code> được nhận, Assignee toàn dấu cách được nhận, <code>" 1"</code> bị từ chối, tên dài làm lệch bảng, Windows tiếng Việt in <code>10,0 -&gt; 17,5</code>.</p>
<p>Mỗi lỗi có nguyên nhân một dòng: <code>parse</code> chỉ đọc phần đầu; regex tên cho <code>\\s</code> mà không trim; không <code>trim()</code> trước <code>parseInt</code>; tiêu đề và các dòng khác định dạng, còn thừa <code>\\n</code>; <code>%.1f</code> theo ngôn ngữ của máy.</p>`],
      [7, 'The clean design: no service',
        `<p class="y-chinh">🎯 Main → <code>TaskController</code> (one call per case) → <code>TaskRepository</code> (add, delete — the ID exists or it throws —, getDataTasks) → <code>TaskView.display()</code> once.</p>
<p>"Is there a task with ID 99?" is a question about stored data, so the repository answers it. The controller never touches <code>Task</code> and imports no model. Names: <code>TaskController</code>, <code>taskController</code>, <code>getDataTasks</code> (the brief's name).</p>`,
        `<p class="y-chinh">🎯 Main → <code>TaskController</code> (mỗi case một lần gọi) → <code>TaskRepository</code> (thêm, xoá — ID có hoặc ném lỗi —, getDataTasks) → <code>TaskView.display()</code> một lần.</p>
<p>"Có task ID 99 không?" là câu hỏi về dữ liệu đang lưu, nên repository trả lời. Controller không đụng <code>Task</code>, không import model. Tên: <code>TaskController</code>, <code>taskController</code>, <code>getDataTasks</code> (tên của đề).</p>`],
      [8, 'Model and the enum TaskType',
        `<p class="y-chinh">🎯 <code>Task</code> is a JavaBean with eight fields; <code>TaskType</code> is an enum of four constants with an id and a name, and <code>getTaskTypeById</code> loops over <code>values()</code>.</p>
<p>The old lookup was a <code>switch</code> on 1, 2, 3, 4 — four magic numbers. The loop compares each constant's <code>getId()</code>; a fifth type would be one line in the enum. Main has already checked the range, so the loop always finds one.</p>`,
        `<p class="y-chinh">🎯 <code>Task</code> là JavaBean tám trường; <code>TaskType</code> là enum bốn hằng có id và tên, <code>getTaskTypeById</code> duyệt <code>values()</code>.</p>
<p>Cách cũ là <code>switch</code> theo 1, 2, 3, 4 — bốn con số viết thẳng. Vòng lặp so <code>getId()</code> của từng hằng; thêm loại thứ năm chỉ là một dòng trong enum. Main đã kiểm khoảng nên vòng lặp luôn tìm thấy.</p>`],
      [9, 'Repository: add, delete, the table',
        `<p class="y-chinh">🎯 <code>addTask</code>: build the Task, <code>lastId++</code>, add, return the id. <code>deleteTask</code>: find it, throw "Khong co task nao co ID = 99…" if missing, remove. <code>getDataTasks</code>: one <code>ResponseDTO</code> per task with Time = To − From.</p>
<p><code>findById</code> is private — only the repository looks a task up. <code>lastId</code> keeps growing: delete 2 then add, the new task is 3, never a second 2.</p>`,
        `<p class="y-chinh">🎯 <code>addTask</code>: dựng Task, <code>lastId++</code>, thêm, trả id. <code>deleteTask</code>: tìm, không có thì ném "Khong co task nao co ID = 99…", có thì xoá. <code>getDataTasks</code>: mỗi task một <code>ResponseDTO</code> với Time = To − From.</p>
<p><code>findById</code> là private — chỉ repository được tìm task. <code>lastId</code> chỉ tăng: xoá 2 rồi thêm thì task mới là 3, không bao giờ có hai số 2.</p>`],
      [10, 'Validation: a real date, a half hour',
        `<p class="y-chinh">🎯 <code>getDate</code>: <code>setLenient(false)</code>, parse, then format the date back and compare with what was typed. <code>getDouble</code>: a number, inside the range (written so that NaN fails too), and a multiple of 0.5.</p>
<p>The round trip catches what <code>parse</code> lets through: <code>1-2-2015</code> comes back as <code>01-02-2015</code>, <code>26-06-2015abc</code> as <code>26-06-2015</code> — both different from the text. Every message is a Vietnamese sentence from <code>Message</code>, with an example.</p>`,
        `<p class="y-chinh">🎯 <code>getDate</code>: <code>setLenient(false)</code>, parse, rồi format ngày ngược ra chữ và so với chữ đã gõ. <code>getDouble</code>: là số, nằm trong khoảng (viết sao cho NaN cũng trượt), và là bội của 0.5.</p>
<p>Phép đi rồi về bắt được thứ <code>parse</code> bỏ lọt: <code>1-2-2015</code> quay về thành <code>01-02-2015</code>, <code>26-06-2015abc</code> thành <code>26-06-2015</code> — cả hai khác chữ gõ. Mọi câu báo là một câu tiếng Việt trong <code>Message</code>, có ví dụ.</p>`],
      [11, 'Controller and view: print once',
        `<p class="y-chinh">🎯 <code>deleteTask</code>: try the repository, the success sentence or the repository's error goes into the view, then one <code>display()</code>. <code>displayTasks</code>: an empty store gives a message, otherwise the rows.</p>
<p><code>TaskView</code> holds the rows and a message; <code>display()</code> prints the message if there is one, the table otherwise, then clears the message. The reviewed controller called <code>printMessage</code> or <code>printTask</code> — two render methods for one flow.</p>`,
        `<p class="y-chinh">🎯 <code>deleteTask</code>: thử repository, câu thành công hoặc câu lỗi của repository đưa vào view, rồi một lần <code>display()</code>. <code>displayTasks</code>: kho rỗng thì một câu báo, có task thì các dòng.</p>
<p><code>TaskView</code> giữ các dòng và một câu báo; <code>display()</code> in câu báo nếu có, không thì in bảng, rồi xoá câu báo. Controller của bản đã review gọi <code>printMessage</code> hoặc <code>printTask</code> — hai hàm render cho một luồng.</p>`],
      [12, 'Main: one call per case',
        `<p class="y-chinh">🎯 <code>inputTaskData</code> fills a new <code>TaskDTO</code> field by field — each field asked again until it is right — and the case calls <code>taskController.addTask</code> once.</p>
<p>The Scanner is a local variable of <code>main</code>, passed to every helper (the Guide forbids static variables); option 4 sets <code>isRunning</code> to false instead of <code>System.exit</code>; every helper takes at most two parameters.</p>`,
        `<p class="y-chinh">🎯 <code>inputTaskData</code> điền một <code>TaskDTO</code> mới từng ô — ô nào sai hỏi lại ô đó — rồi case gọi <code>taskController.addTask</code> một lần.</p>
<p>Scanner là biến cục bộ của <code>main</code>, truyền vào mọi hàm phụ (Guide cấm biến static); lựa chọn 4 đặt <code>isRunning</code> về false thay vì <code>System.exit</code>; mọi hàm phụ nhận tối đa hai tham số.</p>`],
      [13, 'The real run, lint, JDK 8, PASS',
        `<p class="y-chinh">🎯 Every message once: empty name, type abc and 5, four bad dates, hours abc, 7.5, 9.7, 17.5, To 9.0, two bad names — then the table with a long name, straight columns, Time 8.0 and 1.0.</p>
<p><code>lint.py</code> clean, <code>check.sh</code> PASS 99/99, 25 paper items 0 violations, a real JDK 8 prints the same 99 lines.</p>`,
        `<p class="y-chinh">🎯 Mọi câu báo một lần: tên trống, loại abc và 5, bốn ngày sai, giờ abc, 7.5, 9.7, 17.5, To 9.0, hai tên sai — rồi bảng có tên dài, cột thẳng, Time 8.0 và 1.0.</p>
<p><code>lint.py</code> sạch, <code>check.sh</code> PASS 99/99, 25 mục tờ giấy 0 vi phạm, JDK 8 thật in đúng 99 dòng đó.</p>`],
      [14, 'What the lecturer asks',
        `<p class="y-chinh">🎯 "No service — where is the ID check?", "Why is 26-06-2015abc refused?", "%s or %.1f?", "Why no parameter in the view?", "Why is the Scanner not static?", "Why getDataTasks?"</p>
<p>The first answer carries the lab: only the repository knows what it stores, and the controller never handles a model.</p>`,
        `<p class="y-chinh">🎯 "Bỏ service rồi thì kiểm ID ở đâu?", "Sao 26-06-2015abc bị chặn?", "%s hay %.1f?", "Sao view không nhận tham số?", "Sao Scanner không static?", "Sao là getDataTasks?"</p>
<p>Câu đầu là cả bài: chỉ repository biết mình đang giữ gì, còn controller không bao giờ cầm model.</p>`],
    ]),
    bi(`<h2>1. The brief</h2>
<table>
<thead><tr><th>The brief says</th><th>Where it lives</th></tr></thead>
<tbody>
<tr><td>Task type 1–4 fixed (Code, Test, Design, Review)</td><td><code>enum TaskType</code> + <code>getTaskTypeById</code></td></tr>
<tr><td>Date dd-MM-yyyy, a valid date</td><td><code>Validation.getDate</code> (setLenient false + round trip)</td></tr>
<tr><td>Plan From / To 8.0 … 17.5, step 0.5, From &lt; To</td><td><code>Validation.getDouble</code> + Main <code>getPlanFrom</code> / <code>getPlanTo(scanner, planFrom)</code></td></tr>
<tr><td>ID = ID last task + 1</td><td><code>TaskRepository.addTask</code> (<code>lastId</code>)</td></tr>
<tr><td><code>int addTask(...)</code> returns the id</td><td><code>TaskRepository.addTask(TaskDTO)</code> — 7 strings become one DTO checked by Main</td></tr>
<tr><td><code>void deleteTask(String id)</code>, the ID must exist</td><td><code>TaskRepository.deleteTask(int)</code> throws when missing</td></tr>
<tr><td><code>getDataTasks()</code> — ascending by ID</td><td><code>TaskRepository.getDataTasks()</code> → <code>ArrayList&lt;ResponseDTO&gt;</code></td></tr>
<tr><td>try-catch NumberFormatException, SimpleDateFormat, wrapper classes</td><td><code>Validation.getInt</code>, <code>getTaskId</code>, <code>getDouble</code>, <code>getDate</code></td></tr>
</tbody>
</table>
<h2>2. What the lecturer saw</h2>
<p>The reviewed version (names hidden), through his tool:</p>
<pre><code class="language-bash">$ python3 lint.py MSSV_J1SP0071_TaskManagement</code></pre>
<div class="out">✗ MSSV_J1SP0071_TaskManagement — 343 vi phạm<br>
&nbsp;&nbsp;[STRUCTURE] src/constant/Message.java — package 'constant' không thuộc kiến trúc Guide<br>
&nbsp;&nbsp;[STRUCTURE] src/constant/TaskType.java — package 'constant' không thuộc kiến trúc Guide<br>
&nbsp;&nbsp;[STRUCTURE] src/constant/Constants.java — package 'constant' không thuộc kiến trúc Guide<br>
&nbsp;&nbsp;[STRUCTURE] src/constants — thiếu package constants/ (Guide.xlsx)<br>
&nbsp;&nbsp;[STRUCTURE] src/constants/Message.java — thiếu constants/Message.java<br>
&nbsp;&nbsp;[HARDCODE] src/constant/Constants.java:9 — chuỗi ".*\\\\S.*" phải khai báo ở constants (Message/Constants)<br>
&nbsp;&nbsp;[HARDCODE] src/constant/Constants.java:10 — chuỗi "dd-MM-yyyy" phải khai báo ở constants (Message/Constants)<br>
&nbsp;&nbsp;[HARDCODE] src/constant/Constants.java:12 — chuỗi "[A-Za-z0-9\\\\s]+" phải khai báo ở constants (Message/Constants)<br>
&nbsp;&nbsp;[STATIC] src/constant/Constants.java:9 — package 'constant' không được dùng static (Guide.xlsx)<br>
&nbsp;&nbsp;[STATIC] src/constant/Constants.java:10 — package 'constant' không được dùng static (Guide.xlsx)<br>
&nbsp;&nbsp;[STATIC] src/constant/Constants.java:11 — package 'constant' không được dùng static (Guide.xlsx)<br>
…</div>
<p>Its controller decided whether the ID existed — the "service" the lecturer asked to remove:</p>
<pre class="trich"><code class="language-java">public void deleteTask() {
    // Logic kiểm tra ID tồn tại trước khi xóa (Thay cho Service)
    if (taskRepository.findById(taskDto.getId()) == null) {
        taskView.printMessage(Message.ERROR_CANNOT_FOUND); 
        return;
    }

    if (taskRepository.deleteTask(taskDto.getId())) {
        taskView.printMessage(Message.SUCCESS_DELETE_MESSAGE); 
    }
}</code></pre>
<p>And the date that let an empty line through:</p>
<pre class="trich"><code class="language-java">public static Date getDate(String input, final String REGEX) throws Exception {
    SimpleDateFormat dateFormat = new SimpleDateFormat(REGEX);
    dateFormat.setLenient(false);
    try {
        if (input.isEmpty()) {
            return null;
        }
        return dateFormat.parse(input);
    } catch (ParseException e) {
        throw new Exception(Message.ERROR_INVALID_DATE_FORMAT);
    }
}</code></pre>
<p>Add a task with Enter at Date, then choose 3 — the reviewed version, really run:</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Your choice: Requirement Name: Please enter 1-&gt;4<br>
ID &nbsp;Name<br>
1.Code<br>
2.Test<br>
3.Design<br>
4.Review<br>
Enter your choice: Date: From:To:Assignee: Reviewer: Add success!<br>
…</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Your choice: ID &nbsp;&nbsp;Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Task Type &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Time &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Assign &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Reviewer<br>
date must not be null<br>
…</div>
<table>
<thead><tr><th>In the reviewed version</th><th>Rule</th><th>In the clean version</th></tr></thead>
<tbody>
<tr><td>controller calls <code>findById</code>, gets a <code>Task</code>, decides</td><td>lecturer 24/10: no service; 1.1: controller does not touch the model</td><td><code>TaskRepository.deleteTask</code> throws, the controller passes the sentence on</td></tr>
<tr><td>"Invalid!", "Please input number in a range…", "Must be x.0 or x.5"</td><td>lecturer: say what is wrong and what to type</td><td>Vietnamese sentences with an example, all in <code>Message</code></td></tr>
<tr><td>empty Date ⇒ <code>null</code> ⇒ crash at Display</td><td>test keys</td><td>an empty line is a wrong date</td></tr>
<tr><td><code>private static final Scanner sc</code></td><td>Guide: no static variable</td><td>local <code>Scanner scanner</code> passed to the helpers</td></tr>
<tr><td><code>System.exit(0)</code>, <code>case 1:</code></td><td>no exit, 2.10</td><td><code>isRunning = false</code>, <code>Constants.MENU_*</code></td></tr>
<tr><td>two DTOs (one in Main, one <code>new</code> in the controller)</td><td>3.6</td><td>one <code>TaskDTO</code>, passed as a parameter</td></tr>
<tr><td><code>printMessage(String)</code> / <code>printTask()</code></td><td>1.1: attributes, one render per flow</td><td><code>setMessage</code> / <code>setResponseList</code> + <code>display()</code></td></tr>
<tr><td><code>List&lt;Task&gt;</code>, <code>List&lt;ResponseDTO&gt; responseDTO</code></td><td>V5, 1.5</td><td><code>ArrayList&lt;Task&gt; taskList</code>, <code>responseList</code></td></tr>
</tbody>
</table>`,
    `<h2>1. Đề bài</h2>
<table>
<thead><tr><th>Đề nói</th><th>Nằm ở đâu</th></tr></thead>
<tbody>
<tr><td>Loại task 1–4 cố định (Code, Test, Design, Review)</td><td><code>enum TaskType</code> + <code>getTaskTypeById</code></td></tr>
<tr><td>Ngày dd-MM-yyyy, ngày có thật</td><td><code>Validation.getDate</code> (setLenient false + đi rồi về)</td></tr>
<tr><td>Plan From / To 8.0 … 17.5, bước 0.5, From &lt; To</td><td><code>Validation.getDouble</code> + Main <code>getPlanFrom</code> / <code>getPlanTo(scanner, planFrom)</code></td></tr>
<tr><td>ID = ID task cuối + 1</td><td><code>TaskRepository.addTask</code> (<code>lastId</code>)</td></tr>
<tr><td><code>int addTask(...)</code> trả về id</td><td><code>TaskRepository.addTask(TaskDTO)</code> — 7 chuỗi thành một DTO Main đã kiểm</td></tr>
<tr><td><code>void deleteTask(String id)</code>, ID phải có</td><td><code>TaskRepository.deleteTask(int)</code> ném lỗi khi không có</td></tr>
<tr><td><code>getDataTasks()</code> — tăng dần theo ID</td><td><code>TaskRepository.getDataTasks()</code> → <code>ArrayList&lt;ResponseDTO&gt;</code></td></tr>
<tr><td>try-catch NumberFormatException, SimpleDateFormat, lớp bao</td><td><code>Validation.getInt</code>, <code>getTaskId</code>, <code>getDouble</code>, <code>getDate</code></td></tr>
</tbody>
</table>
<h2>2. Thầy đã thấy gì</h2>
<p>Bản thầy đã review (đã ẩn tên), qua công cụ của thầy:</p>
<pre><code class="language-bash">$ python3 lint.py MSSV_J1SP0071_TaskManagement</code></pre>
<div class="out">✗ MSSV_J1SP0071_TaskManagement — 343 vi phạm<br>
&nbsp;&nbsp;[STRUCTURE] src/constant/Message.java — package 'constant' không thuộc kiến trúc Guide<br>
&nbsp;&nbsp;[STRUCTURE] src/constant/TaskType.java — package 'constant' không thuộc kiến trúc Guide<br>
&nbsp;&nbsp;[STRUCTURE] src/constant/Constants.java — package 'constant' không thuộc kiến trúc Guide<br>
&nbsp;&nbsp;[STRUCTURE] src/constants — thiếu package constants/ (Guide.xlsx)<br>
&nbsp;&nbsp;[STRUCTURE] src/constants/Message.java — thiếu constants/Message.java<br>
&nbsp;&nbsp;[HARDCODE] src/constant/Constants.java:9 — chuỗi ".*\\\\S.*" phải khai báo ở constants (Message/Constants)<br>
&nbsp;&nbsp;[HARDCODE] src/constant/Constants.java:10 — chuỗi "dd-MM-yyyy" phải khai báo ở constants (Message/Constants)<br>
&nbsp;&nbsp;[HARDCODE] src/constant/Constants.java:12 — chuỗi "[A-Za-z0-9\\\\s]+" phải khai báo ở constants (Message/Constants)<br>
&nbsp;&nbsp;[STATIC] src/constant/Constants.java:9 — package 'constant' không được dùng static (Guide.xlsx)<br>
&nbsp;&nbsp;[STATIC] src/constant/Constants.java:10 — package 'constant' không được dùng static (Guide.xlsx)<br>
&nbsp;&nbsp;[STATIC] src/constant/Constants.java:11 — package 'constant' không được dùng static (Guide.xlsx)<br>
…</div>
<p>Controller của bản đó tự quyết ID có hay không — chính là "service" thầy bảo bỏ:</p>
<pre class="trich"><code class="language-java">public void deleteTask() {
    // Logic kiểm tra ID tồn tại trước khi xóa (Thay cho Service)
    if (taskRepository.findById(taskDto.getId()) == null) {
        taskView.printMessage(Message.ERROR_CANNOT_FOUND); 
        return;
    }

    if (taskRepository.deleteTask(taskDto.getId())) {
        taskView.printMessage(Message.SUCCESS_DELETE_MESSAGE); 
    }
}</code></pre>
<p>Và hàm ngày để lọt dòng trống:</p>
<pre class="trich"><code class="language-java">public static Date getDate(String input, final String REGEX) throws Exception {
    SimpleDateFormat dateFormat = new SimpleDateFormat(REGEX);
    dateFormat.setLenient(false);
    try {
        if (input.isEmpty()) {
            return null;
        }
        return dateFormat.parse(input);
    } catch (ParseException e) {
        throw new Exception(Message.ERROR_INVALID_DATE_FORMAT);
    }
}</code></pre>
<p>Thêm một task, ô Date nhấn Enter, rồi chọn 3 — bản đã review, chạy thật:</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Your choice: Requirement Name: Please enter 1-&gt;4<br>
ID &nbsp;Name<br>
1.Code<br>
2.Test<br>
3.Design<br>
4.Review<br>
Enter your choice: Date: From:To:Assignee: Reviewer: Add success!<br>
…</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Your choice: ID &nbsp;&nbsp;Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Task Type &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Time &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Assign &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Reviewer<br>
date must not be null<br>
…</div>
<table>
<thead><tr><th>Trong bản đã review</th><th>Luật</th><th>Trong bản sạch</th></tr></thead>
<tbody>
<tr><td>controller gọi <code>findById</code>, nhận <code>Task</code>, tự quyết</td><td>thầy 24/10: bỏ service; 1.1: controller không đụng model</td><td><code>TaskRepository.deleteTask</code> ném lỗi, controller chuyển câu đó cho view</td></tr>
<tr><td>"Invalid!", "Please input number in a range…", "Must be x.0 or x.5"</td><td>thầy: nói rõ sai gì, nhập gì</td><td>câu tiếng Việt có ví dụ, tất cả trong <code>Message</code></td></tr>
<tr><td>Date trống ⇒ <code>null</code> ⇒ sập ở Display</td><td>phím test</td><td>dòng trống là ngày sai</td></tr>
<tr><td><code>private static final Scanner sc</code></td><td>Guide: không biến static</td><td><code>Scanner scanner</code> cục bộ, truyền vào hàm phụ</td></tr>
<tr><td><code>System.exit(0)</code>, <code>case 1:</code></td><td>không exit, 2.10</td><td><code>isRunning = false</code>, <code>Constants.MENU_*</code></td></tr>
<tr><td>hai DTO (một ở Main, một <code>new</code> trong controller)</td><td>3.6</td><td>một <code>TaskDTO</code>, truyền qua tham số</td></tr>
<tr><td><code>printMessage(String)</code> / <code>printTask()</code></td><td>1.1: nhận qua thuộc tính, một lần render mỗi luồng</td><td><code>setMessage</code> / <code>setResponseList</code> + <code>display()</code></td></tr>
<tr><td><code>List&lt;Task&gt;</code>, <code>List&lt;ResponseDTO&gt; responseDTO</code></td><td>V5, 1.5</td><td><code>ArrayList&lt;Task&gt; taskList</code>, <code>responseList</code></td></tr>
</tbody>
</table>`),
    bi(`<h2>3. Class design</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/75429b55320097f944008b9163537b5c555fd96f.svg" alt="P0071: no service — the repository answers &quot;does this ID exist&quot;; the view prints once" loading="lazy" /><p class="chu-thich">🧩 P0071: no service — the repository answers "does this ID exist"; the view prints once</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title J1.S.P0071 Task Management — no service: the repository checks "does this ID exist"
package main {
  class Main &lt;&lt;final&gt;&gt; {
    + {static} main(args : String[]) : void
    - {static} inputTaskData(scanner : Scanner) : TaskDTO
    - {static} getPlanTo(scanner : Scanner, planFrom : double) : double
  }
}
package controller {
  class TaskController {
    - taskRepository : TaskRepository
    - taskView : TaskView
    + addTask(taskDTO : TaskDTO) : void
    + deleteTask(taskDTO : TaskDTO) : void
    + displayTasks() : void
  }
}
package repository {
  class TaskRepository {
    - taskList : ArrayList&lt;Task&gt;
    - lastId : int
    + addTask(taskDTO : TaskDTO) : int
    + deleteTask(taskId : int) : void
    + getDataTasks() : ArrayList&lt;ResponseDTO&gt;
    - findById(taskId : int) : Task
  }
}
package model {
  class Task {
    - id : int
    - taskType : TaskType
    - requirementName : String
    - date : Date
    - planFrom : double
    - planTo : double
    - assign : String
    - reviewer : String
  }
}
package constants {
  enum TaskType {
    CODE
    TEST
    DESIGN
    REVIEW
    + {static} getTaskTypeById(taskTypeId : int) : TaskType
  }
}
package view {
  class TaskView {
    - responseList : ArrayList&lt;ResponseDTO&gt;
    - message : String
    + display() : void
  }
}
package dto {
  class TaskDTO
  class ResponseDTO {
    - time : double
    + toString() : String
  }
}
Main ..&gt; TaskController : one call per case
TaskController *-- TaskRepository : add / delete / getDataTasks
TaskController *-- TaskView : display() once
TaskRepository o-- "0..*" Task
Task --&gt; TaskType
@enduml</code></pre></details>
<h2>4. The code, model first</h2>
<h4>Step 1 — constants and model</h4>
<pre class="trich"><code class="language-java">// Tim loai task theo ma; Main da kiem ma tu 1 den 4 nen luon tim thay
public static TaskType getTaskTypeById(int taskTypeId) {
    TaskType result = null;

    // Duyet tung loai task de so ma
    for (TaskType taskType : TaskType.values()) {
        // Trung ma thi giu lai loai task do
        if (taskType.getId() == taskTypeId) {
            result = taskType;
        }
    }

    return result;
}</code></pre>
<pre class="trich"><code class="language-java">// Ghep 1 dong bang theo dung dinh dang cot cua tieu de
@Override
public String toString() {
    // Dinh dang ngay dd-MM-yyyy
    SimpleDateFormat dateFormat = new SimpleDateFormat(Constants.DATE_FORMAT_PATTERN);

    // Ghep cac cot: ID, ten, loai, ngay, gio, nguoi lam, nguoi review
    return String.format(Constants.TABLE_FORMAT, getId(), getRequirementName(),
            getTaskType().getName(), dateFormat.format(getDate()), getTime(), getAssign(),
            getReviewer());
}</code></pre>
<h4>Step 2 — repository</h4>
<pre class="trich"><code class="language-java">// Them task moi tu phieu DTO, tra ve ID vua cap (ham addTask cua de)
public int addTask(TaskDTO taskDTO) {
    Task task = new Task(taskDTO.getTaskType(), taskDTO.getRequirementName(),
            taskDTO.getDate(), taskDTO.getPlanFrom(), taskDTO.getPlanTo(),
            taskDTO.getAssign(), taskDTO.getReviewer());

    // Cap ID moi = ID task cuoi + 1 roi them vao cuoi danh sach
    lastId++;
    task.setId(lastId);
    taskList.add(task);

    return lastId;
}</code></pre>
<pre class="trich"><code class="language-java">// Xoa task theo ID; khong co ID do thi nem loi cho Controller bao lai (ham deleteTask cua de)
public void deleteTask(int taskId) throws Exception {
    Task task = findById(taskId);

    // Khong tim thay task thi bao ID khong ton tai
    if (task == null) {
        throw new Exception(String.format(Message.ERROR_TASK_NOT_FOUND, taskId));
    }

    taskList.remove(task);
}</code></pre>
<pre class="trich"><code class="language-java">// Doi tung Task thanh 1 dong ResponseDTO de View in (ham getDataTasks cua de)
public ArrayList&lt;ResponseDTO&gt; getDataTasks() {
    ArrayList&lt;ResponseDTO&gt; responseList = new ArrayList&lt;&gt;();

    // Duyet tung task (da tang dan theo ID vi luon them vao cuoi)
    for (Task task : taskList) {
        ResponseDTO responseDTO = new ResponseDTO();

        // Chep du lieu task sang dong bang; Time = To - From
        responseDTO.setId(task.getId());
        responseDTO.setRequirementName(task.getRequirementName());
        responseDTO.setTaskType(task.getTaskType());
        responseDTO.setDate(task.getDate());
        responseDTO.setTime(task.getPlanTo() - task.getPlanFrom());
        responseDTO.setAssign(task.getAssign());
        responseDTO.setReviewer(task.getReviewer());
        responseList.add(responseDTO);
    }

    return responseList;
}</code></pre>
<h4>Step 3 — Validation</h4>
<pre class="trich"><code class="language-java">// Doi chu thanh ngay theo dang dd-MM-yyyy, chi nhan ngay co that
public static Date getDate(String input) throws Exception {
    SimpleDateFormat dateFormat = new SimpleDateFormat(Constants.DATE_FORMAT_PATTERN);
    String text = input.trim();
    Date date = null;

    // Khong cho tu doi ngay sai (vi du 31-02 thanh 03-03)
    dateFormat.setLenient(false);

    // Thu doi chu sang ngay
    try {
        date = dateFormat.parse(text);
    } catch (ParseException e) {
        // De trong hoac sai dang thi bao loi
        throw new Exception(Message.ERROR_INVALID_DATE);
    }

    // In nguoc ngay ra chu phai giong chu da go (chan 1-2-2015, 26-06-2015abc)
    if (!dateFormat.format(date).equals(text)) {
        throw new Exception(Message.ERROR_INVALID_DATE);
    }

    return date;
}</code></pre>
<pre class="trich"><code class="language-java">// Doi chu thanh gio, kiem trong [min, max] va la so tron hoac nua tieng
public static double getDouble(String input, double min, double max) throws Exception {
    double number = 0;

    // Thu doi chu sang so thuc (bo dau cach 2 dau truoc)
    try {
        number = Double.parseDouble(input.trim());
    } catch (NumberFormatException e) {
        // Go chu hoac de trong thi bao phai nhap so
        throw new Exception(Message.ERROR_NOT_REAL_NUMBER);
    }

    // Ngoai khoang (viet dang "khong nam trong" de chan ca NaN) thi bao khoang dung
    if (!((number &gt;= min) &amp;&amp; (number &lt;= max))) {
        throw new Exception(String.format(Message.ERROR_PLAN_RANGE, min, max));
    }

    // Chia cho 0.5 con du thi khong phai so tron hoac nua tieng
    if ((number % Constants.PLAN_STEP) != 0) {
        throw new Exception(Message.ERROR_PLAN_STEP);
    }

    return number;
}</code></pre>
<h4>Step 4 — view and controller</h4>
<pre class="trich"><code class="language-java">// In ket qua cua 1 luong roi xoa cau thong bao de luong sau bat dau sach
public void display() {
    // Co cau thong bao thi chi in cau do
    if (!message.isEmpty()) {
        System.out.println(message);
    } else {
        // Bang: tieu de, ten cot (cung dinh dang voi tung dong), roi tung dong task
        System.out.println(Message.TITLE_DISPLAY);
        System.out.println(String.format(Constants.TABLE_FORMAT, Message.COLUMN_ID,
                Message.COLUMN_NAME, Message.COLUMN_TASK_TYPE, Message.COLUMN_DATE,
                Message.COLUMN_TIME, Message.COLUMN_ASSIGNEE, Message.COLUMN_REVIEWER));

        // Moi task 1 dong
        for (ResponseDTO responseDTO : responseList) {
            System.out.println(responseDTO);
        }
    }

    message = "";
}</code></pre>
<pre class="trich"><code class="language-java">// Chuc nang 2: kho xoa theo ID trong phieu (khong co ID thi kho nem loi), View bao ket qua
public void deleteTask(TaskDTO taskDTO) {
    // Kho xoa duoc thi bao thanh cong
    try {
        taskRepository.deleteTask(taskDTO.getId());
        taskView.setMessage(String.format(Message.SUCCESS_DELETE_MESSAGE, taskDTO.getId()));
    } catch (Exception e) {
        // Kho bao ID khong ton tai thi dua cau loi do cho View
        taskView.setMessage(e.getMessage());
    }

    taskView.display();
}</code></pre>
<pre class="trich"><code class="language-java">// Chuc nang 3: kho lay bang task (tang dan theo ID), View in bang hoac bao danh sach rong
public void displayTasks() {
    // Kho rong thi chi bao rong, co task thi dua bang cho View
    if (taskRepository.isEmpty()) {
        taskView.setMessage(Message.ERROR_EMPTY);
    } else {
        // Co task: dua cac dong bang cho View
        taskView.setResponseList(taskRepository.getDataTasks());
    }

    taskView.display();
}</code></pre>
<h4>Step 5 — Main</h4>
<pre class="trich"><code class="language-java">// Chay chuong trinh: lap menu den khi chon 4
public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    TaskController taskController = new TaskController();
    TaskDTO taskDTO = null;
    boolean isRunning = true;

    // Hien lai menu sau moi chuc nang, den khi chon thoat (khong dung System.exit)
    while (isRunning) {
        System.out.println(Message.MENU_HEADER.concat(Message.MENU_BODY));

        // Moi lua chon goi controller dung 1 lan
        switch (getMenuChoice(scanner)) {
            // 1: nhap va kiem du 7 o roi them task
            case Constants.MENU_ADD:
                System.out.println(Message.TITLE_ADD);
                taskDTO = inputTaskData(scanner);
                taskController.addTask(taskDTO);
                break;

            // 2: nhap va kiem ID roi xoa task (kho tu kiem ID co hay khong)
            case Constants.MENU_DELETE:
                System.out.println(Message.TITLE_DELETE);
                taskDTO = new TaskDTO();
                taskDTO.setId(getTaskId(scanner));
                taskController.deleteTask(taskDTO);
                break;

            // 3: hien thi bang task
            case Constants.MENU_DISPLAY:
                taskController.displayTasks();
                break;

            // 4: tat co de thoat vong lap
            case Constants.MENU_EXIT:
                isRunning = false;
                break;

            // Khong xay ra: getMenuChoice chi tra ve 1 den 4
            default:
                break;
        }
    }
}</code></pre>
<pre class="trich"><code class="language-java">// Nhap va kiem du thong tin 1 task, gom vao 1 phieu DTO moi
private static TaskDTO inputTaskData(Scanner scanner) {
    TaskDTO taskDTO = new TaskDTO();
    double planFrom = 0;

    taskDTO.setRequirementName(getRequirementName(scanner));
    taskDTO.setTaskType(TaskType.getTaskTypeById(getTaskTypeChoice(scanner)));
    taskDTO.setDate(getDate(scanner));

    // Gio bat dau toi da 17.0 de con cho cho gio ket thuc; To phai lon hon From
    planFrom = getPlanFrom(scanner);
    taskDTO.setPlanFrom(planFrom);
    taskDTO.setPlanTo(getPlanTo(scanner, planFrom));

    // Nguoi lam va nguoi review cung 1 luat ten
    taskDTO.setAssign(getPersonName(scanner, Message.INPUT_ASSIGNEE));
    taskDTO.setReviewer(getPersonName(scanner, Message.INPUT_REVIEWER));

    return taskDTO;
}</code></pre>
<pre class="trich"><code class="language-java">// Hoi gio ket thuc: lon hon gio bat dau it nhat 0.5, toi da 17.5
private static double getPlanTo(Scanner scanner, double planFrom) {
    // Lap den khi Validation chap nhan
    while (true) {
        // In cau nhac, doc dong va kiem
        try {
            System.out.print(Message.INPUT_PLAN_TO);
            return Validation.getDouble(scanner.nextLine(), planFrom + Constants.PLAN_STEP,
                    Constants.PLAN_MAX);
        } catch (Exception e) {
            // Sai thi in cau bao loi roi hoi lai
            System.out.println(e.getMessage());
        }
    }
}</code></pre>
<div class="pitfall"><p>⚠️ Traps of this lab: <code>parse</code> without the round trip (1-2-2015 and 26-06-2015abc pass) · forgetting <code>setLenient(false)</code> (31-02 becomes 03-03) · returning <code>null</code> for an empty date · <code>%.1f</code> on a Vietnamese Windows · <code>toString()</code> ending with <code>\\n</code> under a <code>println</code> (an empty line between rows) · header and rows with different formats · From allowed up to 17.5 (no room left for To) · <code>isEmpty()</code> before <code>trim()</code>.</p></div>`,
    `<h2>3. Thiết kế lớp</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/75429b55320097f944008b9163537b5c555fd96f.svg" alt="P0071: không service — repository trả lời &quot;ID này có không&quot;; view in một lần" loading="lazy" /><p class="chu-thich">🧩 P0071: không service — repository trả lời "ID này có không"; view in một lần</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title J1.S.P0071 Task Management — no service: the repository checks "does this ID exist"
package main {
  class Main &lt;&lt;final&gt;&gt; {
    + {static} main(args : String[]) : void
    - {static} inputTaskData(scanner : Scanner) : TaskDTO
    - {static} getPlanTo(scanner : Scanner, planFrom : double) : double
  }
}
package controller {
  class TaskController {
    - taskRepository : TaskRepository
    - taskView : TaskView
    + addTask(taskDTO : TaskDTO) : void
    + deleteTask(taskDTO : TaskDTO) : void
    + displayTasks() : void
  }
}
package repository {
  class TaskRepository {
    - taskList : ArrayList&lt;Task&gt;
    - lastId : int
    + addTask(taskDTO : TaskDTO) : int
    + deleteTask(taskId : int) : void
    + getDataTasks() : ArrayList&lt;ResponseDTO&gt;
    - findById(taskId : int) : Task
  }
}
package model {
  class Task {
    - id : int
    - taskType : TaskType
    - requirementName : String
    - date : Date
    - planFrom : double
    - planTo : double
    - assign : String
    - reviewer : String
  }
}
package constants {
  enum TaskType {
    CODE
    TEST
    DESIGN
    REVIEW
    + {static} getTaskTypeById(taskTypeId : int) : TaskType
  }
}
package view {
  class TaskView {
    - responseList : ArrayList&lt;ResponseDTO&gt;
    - message : String
    + display() : void
  }
}
package dto {
  class TaskDTO
  class ResponseDTO {
    - time : double
    + toString() : String
  }
}
Main ..&gt; TaskController : one call per case
TaskController *-- TaskRepository : add / delete / getDataTasks
TaskController *-- TaskView : display() once
TaskRepository o-- "0..*" Task
Task --&gt; TaskType
@enduml</code></pre></details>
<h2>4. Code, model trước</h2>
<h4>Bước 1 — constants và model</h4>
<pre class="trich"><code class="language-java">// Tim loai task theo ma; Main da kiem ma tu 1 den 4 nen luon tim thay
public static TaskType getTaskTypeById(int taskTypeId) {
    TaskType result = null;

    // Duyet tung loai task de so ma
    for (TaskType taskType : TaskType.values()) {
        // Trung ma thi giu lai loai task do
        if (taskType.getId() == taskTypeId) {
            result = taskType;
        }
    }

    return result;
}</code></pre>
<pre class="trich"><code class="language-java">// Ghep 1 dong bang theo dung dinh dang cot cua tieu de
@Override
public String toString() {
    // Dinh dang ngay dd-MM-yyyy
    SimpleDateFormat dateFormat = new SimpleDateFormat(Constants.DATE_FORMAT_PATTERN);

    // Ghep cac cot: ID, ten, loai, ngay, gio, nguoi lam, nguoi review
    return String.format(Constants.TABLE_FORMAT, getId(), getRequirementName(),
            getTaskType().getName(), dateFormat.format(getDate()), getTime(), getAssign(),
            getReviewer());
}</code></pre>
<h4>Bước 2 — repository</h4>
<pre class="trich"><code class="language-java">// Them task moi tu phieu DTO, tra ve ID vua cap (ham addTask cua de)
public int addTask(TaskDTO taskDTO) {
    Task task = new Task(taskDTO.getTaskType(), taskDTO.getRequirementName(),
            taskDTO.getDate(), taskDTO.getPlanFrom(), taskDTO.getPlanTo(),
            taskDTO.getAssign(), taskDTO.getReviewer());

    // Cap ID moi = ID task cuoi + 1 roi them vao cuoi danh sach
    lastId++;
    task.setId(lastId);
    taskList.add(task);

    return lastId;
}</code></pre>
<pre class="trich"><code class="language-java">// Xoa task theo ID; khong co ID do thi nem loi cho Controller bao lai (ham deleteTask cua de)
public void deleteTask(int taskId) throws Exception {
    Task task = findById(taskId);

    // Khong tim thay task thi bao ID khong ton tai
    if (task == null) {
        throw new Exception(String.format(Message.ERROR_TASK_NOT_FOUND, taskId));
    }

    taskList.remove(task);
}</code></pre>
<pre class="trich"><code class="language-java">// Doi tung Task thanh 1 dong ResponseDTO de View in (ham getDataTasks cua de)
public ArrayList&lt;ResponseDTO&gt; getDataTasks() {
    ArrayList&lt;ResponseDTO&gt; responseList = new ArrayList&lt;&gt;();

    // Duyet tung task (da tang dan theo ID vi luon them vao cuoi)
    for (Task task : taskList) {
        ResponseDTO responseDTO = new ResponseDTO();

        // Chep du lieu task sang dong bang; Time = To - From
        responseDTO.setId(task.getId());
        responseDTO.setRequirementName(task.getRequirementName());
        responseDTO.setTaskType(task.getTaskType());
        responseDTO.setDate(task.getDate());
        responseDTO.setTime(task.getPlanTo() - task.getPlanFrom());
        responseDTO.setAssign(task.getAssign());
        responseDTO.setReviewer(task.getReviewer());
        responseList.add(responseDTO);
    }

    return responseList;
}</code></pre>
<h4>Bước 3 — Validation</h4>
<pre class="trich"><code class="language-java">// Doi chu thanh ngay theo dang dd-MM-yyyy, chi nhan ngay co that
public static Date getDate(String input) throws Exception {
    SimpleDateFormat dateFormat = new SimpleDateFormat(Constants.DATE_FORMAT_PATTERN);
    String text = input.trim();
    Date date = null;

    // Khong cho tu doi ngay sai (vi du 31-02 thanh 03-03)
    dateFormat.setLenient(false);

    // Thu doi chu sang ngay
    try {
        date = dateFormat.parse(text);
    } catch (ParseException e) {
        // De trong hoac sai dang thi bao loi
        throw new Exception(Message.ERROR_INVALID_DATE);
    }

    // In nguoc ngay ra chu phai giong chu da go (chan 1-2-2015, 26-06-2015abc)
    if (!dateFormat.format(date).equals(text)) {
        throw new Exception(Message.ERROR_INVALID_DATE);
    }

    return date;
}</code></pre>
<pre class="trich"><code class="language-java">// Doi chu thanh gio, kiem trong [min, max] va la so tron hoac nua tieng
public static double getDouble(String input, double min, double max) throws Exception {
    double number = 0;

    // Thu doi chu sang so thuc (bo dau cach 2 dau truoc)
    try {
        number = Double.parseDouble(input.trim());
    } catch (NumberFormatException e) {
        // Go chu hoac de trong thi bao phai nhap so
        throw new Exception(Message.ERROR_NOT_REAL_NUMBER);
    }

    // Ngoai khoang (viet dang "khong nam trong" de chan ca NaN) thi bao khoang dung
    if (!((number &gt;= min) &amp;&amp; (number &lt;= max))) {
        throw new Exception(String.format(Message.ERROR_PLAN_RANGE, min, max));
    }

    // Chia cho 0.5 con du thi khong phai so tron hoac nua tieng
    if ((number % Constants.PLAN_STEP) != 0) {
        throw new Exception(Message.ERROR_PLAN_STEP);
    }

    return number;
}</code></pre>
<h4>Bước 4 — view và controller</h4>
<pre class="trich"><code class="language-java">// In ket qua cua 1 luong roi xoa cau thong bao de luong sau bat dau sach
public void display() {
    // Co cau thong bao thi chi in cau do
    if (!message.isEmpty()) {
        System.out.println(message);
    } else {
        // Bang: tieu de, ten cot (cung dinh dang voi tung dong), roi tung dong task
        System.out.println(Message.TITLE_DISPLAY);
        System.out.println(String.format(Constants.TABLE_FORMAT, Message.COLUMN_ID,
                Message.COLUMN_NAME, Message.COLUMN_TASK_TYPE, Message.COLUMN_DATE,
                Message.COLUMN_TIME, Message.COLUMN_ASSIGNEE, Message.COLUMN_REVIEWER));

        // Moi task 1 dong
        for (ResponseDTO responseDTO : responseList) {
            System.out.println(responseDTO);
        }
    }

    message = "";
}</code></pre>
<pre class="trich"><code class="language-java">// Chuc nang 2: kho xoa theo ID trong phieu (khong co ID thi kho nem loi), View bao ket qua
public void deleteTask(TaskDTO taskDTO) {
    // Kho xoa duoc thi bao thanh cong
    try {
        taskRepository.deleteTask(taskDTO.getId());
        taskView.setMessage(String.format(Message.SUCCESS_DELETE_MESSAGE, taskDTO.getId()));
    } catch (Exception e) {
        // Kho bao ID khong ton tai thi dua cau loi do cho View
        taskView.setMessage(e.getMessage());
    }

    taskView.display();
}</code></pre>
<pre class="trich"><code class="language-java">// Chuc nang 3: kho lay bang task (tang dan theo ID), View in bang hoac bao danh sach rong
public void displayTasks() {
    // Kho rong thi chi bao rong, co task thi dua bang cho View
    if (taskRepository.isEmpty()) {
        taskView.setMessage(Message.ERROR_EMPTY);
    } else {
        // Co task: dua cac dong bang cho View
        taskView.setResponseList(taskRepository.getDataTasks());
    }

    taskView.display();
}</code></pre>
<h4>Bước 5 — Main</h4>
<pre class="trich"><code class="language-java">// Chay chuong trinh: lap menu den khi chon 4
public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    TaskController taskController = new TaskController();
    TaskDTO taskDTO = null;
    boolean isRunning = true;

    // Hien lai menu sau moi chuc nang, den khi chon thoat (khong dung System.exit)
    while (isRunning) {
        System.out.println(Message.MENU_HEADER.concat(Message.MENU_BODY));

        // Moi lua chon goi controller dung 1 lan
        switch (getMenuChoice(scanner)) {
            // 1: nhap va kiem du 7 o roi them task
            case Constants.MENU_ADD:
                System.out.println(Message.TITLE_ADD);
                taskDTO = inputTaskData(scanner);
                taskController.addTask(taskDTO);
                break;

            // 2: nhap va kiem ID roi xoa task (kho tu kiem ID co hay khong)
            case Constants.MENU_DELETE:
                System.out.println(Message.TITLE_DELETE);
                taskDTO = new TaskDTO();
                taskDTO.setId(getTaskId(scanner));
                taskController.deleteTask(taskDTO);
                break;

            // 3: hien thi bang task
            case Constants.MENU_DISPLAY:
                taskController.displayTasks();
                break;

            // 4: tat co de thoat vong lap
            case Constants.MENU_EXIT:
                isRunning = false;
                break;

            // Khong xay ra: getMenuChoice chi tra ve 1 den 4
            default:
                break;
        }
    }
}</code></pre>
<pre class="trich"><code class="language-java">// Nhap va kiem du thong tin 1 task, gom vao 1 phieu DTO moi
private static TaskDTO inputTaskData(Scanner scanner) {
    TaskDTO taskDTO = new TaskDTO();
    double planFrom = 0;

    taskDTO.setRequirementName(getRequirementName(scanner));
    taskDTO.setTaskType(TaskType.getTaskTypeById(getTaskTypeChoice(scanner)));
    taskDTO.setDate(getDate(scanner));

    // Gio bat dau toi da 17.0 de con cho cho gio ket thuc; To phai lon hon From
    planFrom = getPlanFrom(scanner);
    taskDTO.setPlanFrom(planFrom);
    taskDTO.setPlanTo(getPlanTo(scanner, planFrom));

    // Nguoi lam va nguoi review cung 1 luat ten
    taskDTO.setAssign(getPersonName(scanner, Message.INPUT_ASSIGNEE));
    taskDTO.setReviewer(getPersonName(scanner, Message.INPUT_REVIEWER));

    return taskDTO;
}</code></pre>
<pre class="trich"><code class="language-java">// Hoi gio ket thuc: lon hon gio bat dau it nhat 0.5, toi da 17.5
private static double getPlanTo(Scanner scanner, double planFrom) {
    // Lap den khi Validation chap nhan
    while (true) {
        // In cau nhac, doc dong va kiem
        try {
            System.out.print(Message.INPUT_PLAN_TO);
            return Validation.getDouble(scanner.nextLine(), planFrom + Constants.PLAN_STEP,
                    Constants.PLAN_MAX);
        } catch (Exception e) {
            // Sai thi in cau bao loi roi hoi lai
            System.out.println(e.getMessage());
        }
    }
}</code></pre>
<div class="pitfall"><p>⚠️ Bẫy của bài: <code>parse</code> mà không so ngược (1-2-2015 và 26-06-2015abc lọt) · quên <code>setLenient(false)</code> (31-02 thành 03-03) · trả <code>null</code> khi ngày trống · <code>%.1f</code> trên Windows tiếng Việt · <code>toString()</code> kết thúc bằng <code>\\n</code> rồi lại <code>println</code> (dòng trống giữa các hàng) · tiêu đề và các dòng khác định dạng · cho From tới 17.5 (không còn chỗ cho To) · kiểm <code>isEmpty()</code> trước <code>trim()</code>.</p></div>`),
    bi(`<h2>5. Run it for real</h2>
<p>The test keys (<code>harness/input.txt</code>): Display on an empty list, then Add with every mistake once, a second task with a long name, Display, Delete <code>abc</code>, <code>0</code>, <code>99</code>, Delete <code> 2</code>, Display, menu <code>0</code>, <code>x</code>, <code>4</code>.</p>
<details><summary>The whole run (99 lines)</summary>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">========= Task program =========<br>
1. Add Task<br>
2. Delete task<br>
3. Display Task<br>
4. exit<br>
Your choice: Danh sach task dang trong. Hay chon chuc nang 1 de them task truoc.<br>
========= Task program =========<br>
1. Add Task<br>
2. Delete task<br>
3. Display Task<br>
4. exit<br>
Your choice: ------------Add Task---------------<br>
Requirement Name: Requirement Name khong duoc de trong hoac chi co dau cach. Moi nhap lai.<br>
Requirement Name: Please enter 1-&gt;4<br>
ID &nbsp;Name<br>
1.Code<br>
2.Test<br>
3.Design<br>
4.Review<br>
Task Type: Ban phai nhap 1 so nguyen (vi du: 1, 2, 3), khong nhap chu hay de trong. Moi nhap lai.<br>
Please enter 1-&gt;4<br>
ID &nbsp;Name<br>
1.Code<br>
2.Test<br>
3.Design<br>
4.Review<br>
Task Type: So ban nhap nam ngoai khoang cho phep. Hay nhap 1 so tu 1 den 4. Moi nhap lai.<br>
Please enter 1-&gt;4<br>
ID &nbsp;Name<br>
1.Code<br>
2.Test<br>
3.Design<br>
4.Review<br>
Task Type: Date: Ngay phai theo dang dd-MM-yyyy va la ngay co that, vi du 28-08-2015. Moi nhap lai.<br>
Date: Ngay phai theo dang dd-MM-yyyy va la ngay co that, vi du 28-08-2015. Moi nhap lai.<br>
Date: Ngay phai theo dang dd-MM-yyyy va la ngay co that, vi du 28-08-2015. Moi nhap lai.<br>
Date: Ngay phai theo dang dd-MM-yyyy va la ngay co that, vi du 28-08-2015. Moi nhap lai.<br>
Date: From: Gio phai la 1 so (vi du: 8.0, 8.5, 9.0), khong nhap chu hay de trong. Moi nhap lai.<br>
From: Gio phai tu 8.0 den 17.0 (To phai lon hon From). Moi nhap lai.<br>
From: Gio chi duoc la so tron hoac nua tieng (vi du: 8.0, 8.5, 9.0). Moi nhap lai.<br>
From: Gio phai tu 8.0 den 17.0 (To phai lon hon From). Moi nhap lai.<br>
From: To: Gio phai tu 10.0 den 17.5 (To phai lon hon From). Moi nhap lai.<br>
To: Assignee: Ten chi gom chu cai khong dau, so va dau cach (vi du: Nguyen Van A), khong de trong. Moi nhap lai.<br>
Assignee: Ten chi gom chu cai khong dau, so va dau cach (vi du: Nguyen Van A), khong de trong. Moi nhap lai.<br>
Assignee: Reviewer: Them task thanh cong, ID cua task la 1.<br>
========= Task program =========<br>
1. Add Task<br>
2. Delete task<br>
3. Display Task<br>
4. exit<br>
Your choice: ------------Add Task---------------<br>
Requirement Name: Please enter 1-&gt;4<br>
ID &nbsp;Name<br>
1.Code<br>
2.Test<br>
3.Design<br>
4.Review<br>
Task Type: Date: From: To: Assignee: Reviewer: Them task thanh cong, ID cua task la 2.<br>
========= Task program =========<br>
1. Add Task<br>
2. Delete task<br>
3. Display Task<br>
4. exit<br>
Your choice: ----------------------------------------- Task ---------------------------------------<br>
ID &nbsp;&nbsp;Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Task Type &nbsp;Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Time &nbsp;&nbsp;Assignee &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Reviewer<br>
1 &nbsp;&nbsp;&nbsp;Dev Program &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Code &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;26-06-2015 &nbsp;&nbsp;8.0 &nbsp;&nbsp;&nbsp;Dev &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Lead<br>
2 &nbsp;&nbsp;&nbsp;Nguyen Van Thanh Hai Program &nbsp;&nbsp;Test &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;28-08-2015 &nbsp;&nbsp;1.0 &nbsp;&nbsp;&nbsp;Nguyen Van Thanh Hai Lead<br>
========= Task program =========<br>
1. Add Task<br>
2. Delete task<br>
3. Display Task<br>
4. exit<br>
Your choice: ---------Del Task------<br>
ID: Ban phai nhap 1 so nguyen (vi du: 1, 2, 3), khong nhap chu hay de trong. Moi nhap lai.<br>
ID: ID phai la so nguyen lon hon hoac bang 1 (xem ID o chuc nang 3). Moi nhap lai.<br>
ID: Khong co task nao co ID = 99. Hay chon chuc nang 3 de xem ID roi xoa lai.<br>
========= Task program =========<br>
1. Add Task<br>
2. Delete task<br>
3. Display Task<br>
4. exit<br>
Your choice: ---------Del Task------<br>
ID: Xoa task co ID = 2 thanh cong.<br>
========= Task program =========<br>
1. Add Task<br>
2. Delete task<br>
3. Display Task<br>
4. exit<br>
Your choice: ----------------------------------------- Task ---------------------------------------<br>
ID &nbsp;&nbsp;Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Task Type &nbsp;Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Time &nbsp;&nbsp;Assignee &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Reviewer<br>
1 &nbsp;&nbsp;&nbsp;Dev Program &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Code &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;26-06-2015 &nbsp;&nbsp;8.0 &nbsp;&nbsp;&nbsp;Dev &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Lead<br>
========= Task program =========<br>
1. Add Task<br>
2. Delete task<br>
3. Display Task<br>
4. exit<br>
Your choice: So ban nhap nam ngoai khoang cho phep. Hay nhap 1 so tu 1 den 4. Moi nhap lai.<br>
Your choice: Ban phai nhap 1 so nguyen (vi du: 1, 2, 3), khong nhap chu hay de trong. Moi nhap lai.<br>
Your choice:</div>
</details>
<p>Every validation message once (Add, field by field):</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Your choice: ------------Add Task---------------<br>
Requirement Name: Requirement Name khong duoc de trong hoac chi co dau cach. Moi nhap lai.<br>
Requirement Name: Please enter 1-&gt;4<br>
ID &nbsp;Name<br>
1.Code<br>
2.Test<br>
3.Design<br>
4.Review<br>
Task Type: Ban phai nhap 1 so nguyen (vi du: 1, 2, 3), khong nhap chu hay de trong. Moi nhap lai.<br>
Please enter 1-&gt;4<br>
ID &nbsp;Name<br>
1.Code<br>
2.Test<br>
3.Design<br>
4.Review<br>
Task Type: So ban nhap nam ngoai khoang cho phep. Hay nhap 1 so tu 1 den 4. Moi nhap lai.<br>
Please enter 1-&gt;4<br>
ID &nbsp;Name<br>
1.Code<br>
2.Test<br>
3.Design<br>
4.Review<br>
Task Type: Date: Ngay phai theo dang dd-MM-yyyy va la ngay co that, vi du 28-08-2015. Moi nhap lai.<br>
Date: Ngay phai theo dang dd-MM-yyyy va la ngay co that, vi du 28-08-2015. Moi nhap lai.<br>
Date: Ngay phai theo dang dd-MM-yyyy va la ngay co that, vi du 28-08-2015. Moi nhap lai.<br>
Date: Ngay phai theo dang dd-MM-yyyy va la ngay co that, vi du 28-08-2015. Moi nhap lai.<br>
Date: From: Gio phai la 1 so (vi du: 8.0, 8.5, 9.0), khong nhap chu hay de trong. Moi nhap lai.<br>
From: Gio phai tu 8.0 den 17.0 (To phai lon hon From). Moi nhap lai.<br>
From: Gio chi duoc la so tron hoac nua tieng (vi du: 8.0, 8.5, 9.0). Moi nhap lai.<br>
From: Gio phai tu 8.0 den 17.0 (To phai lon hon From). Moi nhap lai.<br>
From: To: Gio phai tu 10.0 den 17.5 (To phai lon hon From). Moi nhap lai.<br>
To: Assignee: Ten chi gom chu cai khong dau, so va dau cach (vi du: Nguyen Van A), khong de trong. Moi nhap lai.<br>
Assignee: Ten chi gom chu cai khong dau, so va dau cach (vi du: Nguyen Van A), khong de trong. Moi nhap lai.<br>
Assignee: Reviewer: Them task thanh cong, ID cua task la 1.<br>
…</div>
<p>The table with a long name — straight columns, Time = To − From:</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Your choice: ----------------------------------------- Task ---------------------------------------<br>
ID &nbsp;&nbsp;Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Task Type &nbsp;Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Time &nbsp;&nbsp;Assignee &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Reviewer<br>
1 &nbsp;&nbsp;&nbsp;Dev Program &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Code &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;26-06-2015 &nbsp;&nbsp;8.0 &nbsp;&nbsp;&nbsp;Dev &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Lead<br>
2 &nbsp;&nbsp;&nbsp;Nguyen Van Thanh Hai Program &nbsp;&nbsp;Test &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;28-08-2015 &nbsp;&nbsp;1.0 &nbsp;&nbsp;&nbsp;Nguyen Van Thanh Hai Lead<br>
…</div>
<p>Delete: a letter, 0, an ID that does not exist (the repository's sentence), then ID 2:</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Your choice: ---------Del Task------<br>
ID: Ban phai nhap 1 so nguyen (vi du: 1, 2, 3), khong nhap chu hay de trong. Moi nhap lai.<br>
ID: ID phai la so nguyen lon hon hoac bang 1 (xem ID o chuc nang 3). Moi nhap lai.<br>
ID: Khong co task nao co ID = 99. Hay chon chuc nang 3 de xem ID roi xoa lai.<br>
…</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
ID: Xoa task co ID = 2 thanh cong.<br>
…</div>
<pre><code class="language-bash">$ python3 lint.py MSSV_J1SP0071_TaskManagement</code></pre>
<div class="out">✓ MSSV_J1SP0071_TaskManagement — sạch</div>
<pre><code class="language-bash">$ ./check.sh        # Windows: check.bat · NetBeans: Run File on test/harness/CheckHarness.java</code></pre>
<div class="out">PASS: 99/99 dong khop expected.txt</div>
<p>A real JDK 8 prints the same 99 lines. The paper checklist audit: 0 violations.</p>
<h2>6. Debug it</h2>
<p>Breakpoint on <code>if (task == null) {</code> in <code>TaskRepository.deleteTask</code> → Ctrl+F5 → add one task, then 2 and 99 → stop: <code>taskId</code> is 99, <code>task</code> is null, <code>taskList</code> has one element. F8 goes to the <code>throw</code>; F8 again lands in the <code>catch</code> of <code>TaskController.deleteTask</code> with the message. Then 2 and 1: <code>task</code> is the object, F8 skips the <code>throw</code>.</p>
<h2>7. The questions — answer out loud</h2>
<details><summary>No service — where is "the ID exists", and why not in the controller?</summary><p class="dap-an">✅ In <code>TaskRepository.deleteTask</code>: only the store knows what it holds. The controller must not handle the model <code>Task</code>; it passes a DTO and gives the result to the view. The lab is pure CRUD, so there is no service.</p></details>
<details><summary>Why is 26-06-2015abc refused?</summary><p class="dap-an">✅ <code>setLenient(false)</code> refuses impossible dates, but <code>parse</code> reads the beginning only. So the date is formatted back to text and compared with what was typed; a difference means a wrong date.</p></details>
<details><summary>Why %s and not %.1f in the hour message?</summary><p class="dap-an">✅ <code>%.1f</code> follows the machine's language: a Vietnamese Windows prints 10,0. A <code>double</code> through <code>%s</code> is always 10.0.</p></details>
<details><summary>Why does the view not take the message as a parameter?</summary><p class="dap-an">✅ The paper (1.1): the view receives through attributes. The controller calls <code>setMessage</code> or <code>setResponseList</code>, then <code>display()</code> once per menu choice.</p></details>
<details><summary>Why is the Scanner not static?</summary><p class="dap-an">✅ The Guide forbids static variables in Main. One local <code>Scanner</code> is created in <code>main</code> and passed to each helper.</p></details>
<details><summary>Why is Time not stored in Task?</summary><p class="dap-an">✅ It is To − From: storing it would be a second copy that can disagree. It is computed when the table row is built.</p></details>
<h2>8. Download</h2>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/lab211/v1/MSSV_J1SP0071_TaskManagement-solution.zip" target="_blank" rel="noopener">
<span class="lc-ico">✅</span>
<span class="lc-body"><span class="lc-title">MSSV_J1SP0071_TaskManagement-solution.zip</span><span class="lc-sub">NetBeans project (Java 8) · 11 files · check.sh / check.bat + test/harness (automatic grader, PASS 99/99)</span></span>
<span class="lc-cta">Download</span>
</a>
<div class="callout"><p><strong>Next:</strong> P0073 Handy Expense — the same rules, plus a file that must survive a restart.</p></div>`,
    `<h2>5. Chạy thật</h2>
<p>Bộ phím test (<code>harness/input.txt</code>): Display khi danh sách rỗng, rồi Add với mọi lỗi một lần, task thứ hai tên dài, Display, Delete <code>abc</code>, <code>0</code>, <code>99</code>, Delete <code> 2</code>, Display, menu <code>0</code>, <code>x</code>, <code>4</code>.</p>
<details><summary>Toàn bộ lần chạy (99 dòng)</summary>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">========= Task program =========<br>
1. Add Task<br>
2. Delete task<br>
3. Display Task<br>
4. exit<br>
Your choice: Danh sach task dang trong. Hay chon chuc nang 1 de them task truoc.<br>
========= Task program =========<br>
1. Add Task<br>
2. Delete task<br>
3. Display Task<br>
4. exit<br>
Your choice: ------------Add Task---------------<br>
Requirement Name: Requirement Name khong duoc de trong hoac chi co dau cach. Moi nhap lai.<br>
Requirement Name: Please enter 1-&gt;4<br>
ID &nbsp;Name<br>
1.Code<br>
2.Test<br>
3.Design<br>
4.Review<br>
Task Type: Ban phai nhap 1 so nguyen (vi du: 1, 2, 3), khong nhap chu hay de trong. Moi nhap lai.<br>
Please enter 1-&gt;4<br>
ID &nbsp;Name<br>
1.Code<br>
2.Test<br>
3.Design<br>
4.Review<br>
Task Type: So ban nhap nam ngoai khoang cho phep. Hay nhap 1 so tu 1 den 4. Moi nhap lai.<br>
Please enter 1-&gt;4<br>
ID &nbsp;Name<br>
1.Code<br>
2.Test<br>
3.Design<br>
4.Review<br>
Task Type: Date: Ngay phai theo dang dd-MM-yyyy va la ngay co that, vi du 28-08-2015. Moi nhap lai.<br>
Date: Ngay phai theo dang dd-MM-yyyy va la ngay co that, vi du 28-08-2015. Moi nhap lai.<br>
Date: Ngay phai theo dang dd-MM-yyyy va la ngay co that, vi du 28-08-2015. Moi nhap lai.<br>
Date: Ngay phai theo dang dd-MM-yyyy va la ngay co that, vi du 28-08-2015. Moi nhap lai.<br>
Date: From: Gio phai la 1 so (vi du: 8.0, 8.5, 9.0), khong nhap chu hay de trong. Moi nhap lai.<br>
From: Gio phai tu 8.0 den 17.0 (To phai lon hon From). Moi nhap lai.<br>
From: Gio chi duoc la so tron hoac nua tieng (vi du: 8.0, 8.5, 9.0). Moi nhap lai.<br>
From: Gio phai tu 8.0 den 17.0 (To phai lon hon From). Moi nhap lai.<br>
From: To: Gio phai tu 10.0 den 17.5 (To phai lon hon From). Moi nhap lai.<br>
To: Assignee: Ten chi gom chu cai khong dau, so va dau cach (vi du: Nguyen Van A), khong de trong. Moi nhap lai.<br>
Assignee: Ten chi gom chu cai khong dau, so va dau cach (vi du: Nguyen Van A), khong de trong. Moi nhap lai.<br>
Assignee: Reviewer: Them task thanh cong, ID cua task la 1.<br>
========= Task program =========<br>
1. Add Task<br>
2. Delete task<br>
3. Display Task<br>
4. exit<br>
Your choice: ------------Add Task---------------<br>
Requirement Name: Please enter 1-&gt;4<br>
ID &nbsp;Name<br>
1.Code<br>
2.Test<br>
3.Design<br>
4.Review<br>
Task Type: Date: From: To: Assignee: Reviewer: Them task thanh cong, ID cua task la 2.<br>
========= Task program =========<br>
1. Add Task<br>
2. Delete task<br>
3. Display Task<br>
4. exit<br>
Your choice: ----------------------------------------- Task ---------------------------------------<br>
ID &nbsp;&nbsp;Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Task Type &nbsp;Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Time &nbsp;&nbsp;Assignee &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Reviewer<br>
1 &nbsp;&nbsp;&nbsp;Dev Program &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Code &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;26-06-2015 &nbsp;&nbsp;8.0 &nbsp;&nbsp;&nbsp;Dev &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Lead<br>
2 &nbsp;&nbsp;&nbsp;Nguyen Van Thanh Hai Program &nbsp;&nbsp;Test &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;28-08-2015 &nbsp;&nbsp;1.0 &nbsp;&nbsp;&nbsp;Nguyen Van Thanh Hai Lead<br>
========= Task program =========<br>
1. Add Task<br>
2. Delete task<br>
3. Display Task<br>
4. exit<br>
Your choice: ---------Del Task------<br>
ID: Ban phai nhap 1 so nguyen (vi du: 1, 2, 3), khong nhap chu hay de trong. Moi nhap lai.<br>
ID: ID phai la so nguyen lon hon hoac bang 1 (xem ID o chuc nang 3). Moi nhap lai.<br>
ID: Khong co task nao co ID = 99. Hay chon chuc nang 3 de xem ID roi xoa lai.<br>
========= Task program =========<br>
1. Add Task<br>
2. Delete task<br>
3. Display Task<br>
4. exit<br>
Your choice: ---------Del Task------<br>
ID: Xoa task co ID = 2 thanh cong.<br>
========= Task program =========<br>
1. Add Task<br>
2. Delete task<br>
3. Display Task<br>
4. exit<br>
Your choice: ----------------------------------------- Task ---------------------------------------<br>
ID &nbsp;&nbsp;Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Task Type &nbsp;Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Time &nbsp;&nbsp;Assignee &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Reviewer<br>
1 &nbsp;&nbsp;&nbsp;Dev Program &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Code &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;26-06-2015 &nbsp;&nbsp;8.0 &nbsp;&nbsp;&nbsp;Dev &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Lead<br>
========= Task program =========<br>
1. Add Task<br>
2. Delete task<br>
3. Display Task<br>
4. exit<br>
Your choice: So ban nhap nam ngoai khoang cho phep. Hay nhap 1 so tu 1 den 4. Moi nhap lai.<br>
Your choice: Ban phai nhap 1 so nguyen (vi du: 1, 2, 3), khong nhap chu hay de trong. Moi nhap lai.<br>
Your choice:</div>
</details>
<p>Mọi câu báo lỗi một lần (Add, từng ô một):</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Your choice: ------------Add Task---------------<br>
Requirement Name: Requirement Name khong duoc de trong hoac chi co dau cach. Moi nhap lai.<br>
Requirement Name: Please enter 1-&gt;4<br>
ID &nbsp;Name<br>
1.Code<br>
2.Test<br>
3.Design<br>
4.Review<br>
Task Type: Ban phai nhap 1 so nguyen (vi du: 1, 2, 3), khong nhap chu hay de trong. Moi nhap lai.<br>
Please enter 1-&gt;4<br>
ID &nbsp;Name<br>
1.Code<br>
2.Test<br>
3.Design<br>
4.Review<br>
Task Type: So ban nhap nam ngoai khoang cho phep. Hay nhap 1 so tu 1 den 4. Moi nhap lai.<br>
Please enter 1-&gt;4<br>
ID &nbsp;Name<br>
1.Code<br>
2.Test<br>
3.Design<br>
4.Review<br>
Task Type: Date: Ngay phai theo dang dd-MM-yyyy va la ngay co that, vi du 28-08-2015. Moi nhap lai.<br>
Date: Ngay phai theo dang dd-MM-yyyy va la ngay co that, vi du 28-08-2015. Moi nhap lai.<br>
Date: Ngay phai theo dang dd-MM-yyyy va la ngay co that, vi du 28-08-2015. Moi nhap lai.<br>
Date: Ngay phai theo dang dd-MM-yyyy va la ngay co that, vi du 28-08-2015. Moi nhap lai.<br>
Date: From: Gio phai la 1 so (vi du: 8.0, 8.5, 9.0), khong nhap chu hay de trong. Moi nhap lai.<br>
From: Gio phai tu 8.0 den 17.0 (To phai lon hon From). Moi nhap lai.<br>
From: Gio chi duoc la so tron hoac nua tieng (vi du: 8.0, 8.5, 9.0). Moi nhap lai.<br>
From: Gio phai tu 8.0 den 17.0 (To phai lon hon From). Moi nhap lai.<br>
From: To: Gio phai tu 10.0 den 17.5 (To phai lon hon From). Moi nhap lai.<br>
To: Assignee: Ten chi gom chu cai khong dau, so va dau cach (vi du: Nguyen Van A), khong de trong. Moi nhap lai.<br>
Assignee: Ten chi gom chu cai khong dau, so va dau cach (vi du: Nguyen Van A), khong de trong. Moi nhap lai.<br>
Assignee: Reviewer: Them task thanh cong, ID cua task la 1.<br>
…</div>
<p>Bảng có tên dài — cột thẳng, Time = To − From:</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Your choice: ----------------------------------------- Task ---------------------------------------<br>
ID &nbsp;&nbsp;Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Task Type &nbsp;Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Time &nbsp;&nbsp;Assignee &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Reviewer<br>
1 &nbsp;&nbsp;&nbsp;Dev Program &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Code &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;26-06-2015 &nbsp;&nbsp;8.0 &nbsp;&nbsp;&nbsp;Dev &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Lead<br>
2 &nbsp;&nbsp;&nbsp;Nguyen Van Thanh Hai Program &nbsp;&nbsp;Test &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;28-08-2015 &nbsp;&nbsp;1.0 &nbsp;&nbsp;&nbsp;Nguyen Van Thanh Hai Lead<br>
…</div>
<p>Delete: một chữ, số 0, một ID không có (câu của repository), rồi ID 2:</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Your choice: ---------Del Task------<br>
ID: Ban phai nhap 1 so nguyen (vi du: 1, 2, 3), khong nhap chu hay de trong. Moi nhap lai.<br>
ID: ID phai la so nguyen lon hon hoac bang 1 (xem ID o chuc nang 3). Moi nhap lai.<br>
ID: Khong co task nao co ID = 99. Hay chon chuc nang 3 de xem ID roi xoa lai.<br>
…</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
ID: Xoa task co ID = 2 thanh cong.<br>
…</div>
<pre><code class="language-bash">$ python3 lint.py MSSV_J1SP0071_TaskManagement</code></pre>
<div class="out">✓ MSSV_J1SP0071_TaskManagement — sạch</div>
<pre><code class="language-bash">$ ./check.sh        # Windows: check.bat · NetBeans: Run File on test/harness/CheckHarness.java</code></pre>
<div class="out">PASS: 99/99 dong khop expected.txt</div>
<p>JDK 8 thật in đúng 99 dòng đó. Soát tờ checklist giấy: 0 vi phạm.</p>
<h2>6. Debug</h2>
<p>Breakpoint ở <code>if (task == null) {</code> trong <code>TaskRepository.deleteTask</code> → Ctrl+F5 → thêm một task, rồi 2 và 99 → dừng: <code>taskId</code> là 99, <code>task</code> là null, <code>taskList</code> có một phần tử. F8 vào <code>throw</code>; F8 tiếp rơi vào <code>catch</code> của <code>TaskController.deleteTask</code> kèm câu báo. Rồi 2 và 1: <code>task</code> là đối tượng thật, F8 bỏ qua <code>throw</code>.</p>
<h2>7. Câu thầy hỏi — trả lời thành tiếng</h2>
<details><summary>Bỏ service rồi thì kiểm "ID có không" ở đâu, sao không để controller?</summary><p class="dap-an">✅ Ở <code>TaskRepository.deleteTask</code>: chỉ kho biết mình giữ gì. Controller không được cầm model <code>Task</code>; nó chuyển DTO và đưa kết quả cho view. Bài chỉ có CRUD nên không có service.</p></details>
<details><summary>Sao 26-06-2015abc bị chặn?</summary><p class="dap-an">✅ <code>setLenient(false)</code> chặn ngày không có thật, nhưng <code>parse</code> chỉ đọc phần đầu. Nên em format ngày ngược ra chữ rồi so với chữ đã gõ; khác là ngày sai.</p></details>
<details><summary>Sao câu báo giờ dùng %s mà không %.1f?</summary><p class="dap-an">✅ <code>%.1f</code> theo ngôn ngữ của máy: Windows tiếng Việt in 10,0. Một số <code>double</code> qua <code>%s</code> luôn in 10.0.</p></details>
<details><summary>Sao view không nhận câu báo qua tham số?</summary><p class="dap-an">✅ Tờ giấy (1.1): view nhận qua thuộc tính. Controller gọi <code>setMessage</code> hoặc <code>setResponseList</code>, rồi <code>display()</code> một lần cho mỗi lựa chọn menu.</p></details>
<details><summary>Sao Scanner không static?</summary><p class="dap-an">✅ Guide cấm biến static trong Main. Một <code>Scanner</code> cục bộ tạo trong <code>main</code>, truyền vào từng hàm phụ.</p></details>
<details><summary>Sao không lưu Time trong Task?</summary><p class="dap-an">✅ Time là To − From: lưu thêm là một bản sao có thể lệch. Nó được tính khi dựng dòng bảng.</p></details>
<h2>8. Tệp tải về</h2>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/lab211/v1/MSSV_J1SP0071_TaskManagement-solution.zip" target="_blank" rel="noopener">
<span class="lc-ico">✅</span>
<span class="lc-body"><span class="lc-title">MSSV_J1SP0071_TaskManagement-solution.zip</span><span class="lc-sub">project NetBeans (Java 8) · 11 tệp · check.sh / check.bat + test/harness (bộ chấm tự động, PASS 99/99)</span></span>
<span class="lc-cta">Tải về</span>
</a>
<div class="callout"><p><strong>Bài tiếp:</strong> P0073 Handy Expense — cùng bộ luật, thêm một tệp dữ liệu phải sống qua lần tắt mở chương trình.</p></div>`),
  ].join('\n'),
};

/* ───────── L.6 — 🎓 LAB211 J1.S.P0073 Handy Expense: a file that survives a restart, ID = max + 1, a service that only computes ───────── */
const L_l211_p0073 = {
  title: 'L.6 — 🎓 LAB211 J1.S.P0073 Handy Expense: a file that survives a restart, ID = max + 1, a service that only computes|||L.6 — 🎓 LAB211 J1.S.P0073 Quản lý chi tiêu: tệp sống qua lần mở lại, ID = lớn nhất + 1, service chỉ tính toán',
  slug: 'pro192-lab211-p0073-handy-expense',
  type: 'VIDEO',
  description: 'Bài LAB211 J1.S.P0073 (100 LOC) làm mới theo khuôn bài Worker đã pass và mọi luật thầy bắt sau đó: đọc đề (thêm chi tiêu với ID = ID lớn nhất + 1, ngày dạng 11-Apr-2009, bảng ID Date Amount Content kèm Total, xoá theo ID với đúng hai câu "Delete an expense fail/successful", dữ liệu nằm trong tệp), ai đụng tệp (tờ giấy 1.1: Main đọc, repository tách dòng và ghi lại sau mỗi lần đổi, FileUtils lo vào ra bằng UTF-8), một dòng một chi tiêu với dấu |, bẫy thật split("|") làm bảng nát khi mở lại mà không báo lỗi nào, ngày tháng tiếng Anh với Locale.ENGLISH và setLenient(false), service chỉ tính (ID mới, dòng bảng, tổng tiền 0.## với Locale.US) và không giữ repository, view in một lần mỗi luồng. Chạy thật ra đúng ví dụ của đề (Total: 550), tắt rồi mở lại vẫn đủ dữ liệu, PASS 112/112, lint.py sạch, 25 mục 0 vi phạm, JDK 8 thật. Kèm câu thầy hỏi và dự án tải về.',
  content: [
    bi(`<span class="eyebrow">🎓 LAB211 in practice · L.6 · J1.S.P0073</span>
<h2>Handy Expense — a file that survives a restart</h2>
<p class="lead">The last lab of this section is new: no review yet, written on the skeleton of the Worker lab that passed and under every rule the lecturer enforced afterwards. What is new is a file. The expenses must still be there when the program is closed and opened again — and that one requirement decides who reads the file, who writes it, how an ID is made and which bug only appears on the second run.</p>
<p>The version of 26/10 was already clean for <code>lint.py</code>; the paper audit still found 34 violations, Main printed results itself and the repository read the file although the paper gives that job to Main. Plan about <strong>1 hour 30</strong> to retype, 20 minutes for the test keys (two runs).</p>`,
    `<span class="eyebrow">🎓 LAB211 thực chiến · L.6 · J1.S.P0073</span>
<h2>Quản lý chi tiêu — một tệp sống qua lần mở lại</h2>
<p class="lead">Bài cuối của phần này là bài mới: chưa review, viết trên khuôn bài Worker đã pass và theo mọi luật thầy bắt sau đó. Cái mới là một tệp. Tắt chương trình rồi mở lại, các khoản chi phải còn nguyên — và chỉ một yêu cầu đó quyết định ai đọc tệp, ai ghi tệp, ID sinh thế nào, và lỗi nào chỉ lộ ra ở lần chạy thứ hai.</p>
<p>Bản 26/10 đã sạch với <code>lint.py</code>; soát tờ giấy vẫn ra 34 vi phạm, Main tự in kết quả, và repository tự đọc tệp dù tờ giấy giao việc đó cho Main. Dành khoảng <strong>1 giờ 30</strong> để gõ lại, 20 phút cho bộ phím test (hai lần chạy).</p>`),
    bi(`<h2>📑 Slide by slide — PRO192 · LAB211 P0073 (14 slides)</h2>
<p>The deck of this LAB211 lesson, made by CuongThai (it is not a school deck and not the lecturer's). Each slide is followed by its key idea and the explanation; every piece of code and every output on the slides comes from the real project in this lesson — checked by <code>lint.py</code> (the lecturer's rules), compiled with <code>javac --release 8</code> and run on a real JDK 8, like the machines in the lab room.</p>`,
    `<h2>📑 Học theo từng slide — PRO192 · LAB211 P0073 (14 slide)</h2>
<p>Bộ slide của bài LAB211 này do CuongThai dựng (không phải slide của trường, cũng không phải của thầy). Dưới mỗi slide là ý chính và lời giảng; mọi đoạn code, mọi output trên slide đều lấy từ đúng dự án trong bài — qua <code>lint.py</code> (luật của thầy), biên dịch bằng <code>javac --release 8</code> và chạy trên JDK 8 thật, giống máy phòng lab.</p>`),
    walk('l211-p0073', [
      [1, 'J1.S.P0073 — Handy Expense',
        `<p class="y-chinh">🎯 Add, list and delete expenses, with a total — and keep them in a file between two runs of the program.</p>
<p>The deck: the brief, the ID by hand, who touches the file, the file format and its trap, dates, the clean design, each layer, two real runs, the questions.</p>`,
        `<p class="y-chinh">🎯 Thêm, liệt kê và xoá khoản chi, có tổng tiền — và giữ chúng trong một tệp giữa hai lần chạy chương trình.</p>
<p>Bộ slide: đề, ID chạy tay, ai đụng tệp, định dạng tệp và cái bẫy của nó, ngày tháng, thiết kế sạch, từng tầng, hai lần chạy thật, các câu hỏi.</p>`],
      [2, 'The brief',
        `<p class="y-chinh">🎯 Menu 1 Add an expense · 2 Display all expenses · 3 Delete an expense · 4 Quit. An expense: ID, Date, Amount, Content; ID = last + 1, the first is 1. Display: a table and Total. Delete: "Delete an expense fail" or "Delete an expense successful".</p>
<p>The brief names <code>addExpense(List, Date, double, String)</code>, <code>displayAll(List)</code>, <code>deleteExpense(List, Expense)</code>. The names stay; the signatures cannot — four parameters break the lecturer's rule of two, and printing is the view's job. The real run reproduces the brief's example exactly: 100, 250, 200, Total: 550.</p>`,
        `<p class="y-chinh">🎯 Menu 1 Add an expense · 2 Display all expenses · 3 Delete an expense · 4 Quit. Một khoản chi: ID, Date, Amount, Content; ID = cuối + 1, khoản đầu là 1. Display: bảng và Total. Delete: "Delete an expense fail" hoặc "Delete an expense successful".</p>
<p>Đề đặt tên <code>addExpense(List, Date, double, String)</code>, <code>displayAll(List)</code>, <code>deleteExpense(List, Expense)</code>. Giữ tên; chữ ký thì không giữ được — bốn tham số phạm luật hai tham số của thầy, và in là việc của view. Lần chạy thật ra đúng ví dụ của đề: 100, 250, 200, Total: 550.</p>`],
      [3, 'ID = max + 1, by hand',
        `<p class="y-chinh">🎯 Add three: 1, 2, 3. Close, open: 1, 2, 3 read back. Delete 2: 1, 3. Add: 4 — the largest ID plus one.</p>
<p>The ID is computed from the list every time, so it needs no counter — a counter field would be lost when the program stops, because the file has no counter. P0071 keeps a <code>lastId</code> in memory because nothing there is saved: the same brief rule, a different storage, a different answer.</p>`,
        `<p class="y-chinh">🎯 Thêm ba: 1, 2, 3. Tắt, mở: đọc lại 1, 2, 3. Xoá 2: 1, 3. Thêm: 4 — ID lớn nhất cộng một.</p>
<p>ID tính từ danh sách mỗi lần, nên không cần biến đếm — một trường đếm sẽ mất khi chương trình tắt, vì tệp không lưu biến đếm. P0071 giữ <code>lastId</code> trong bộ nhớ vì ở đó không lưu gì: cùng luật của đề, cách lưu khác, câu trả lời khác.</p>`],
      [4, 'Who touches the file',
        `<p class="y-chinh">🎯 Main reads the file once at start (<code>FileUtils.readLines</code>) and hands the lines to the controller; the repository turns each line into an <code>Expense</code>, and writes the whole file again after every add or delete.</p>
<p>The paper, row 1.1, word for word: "all input, validation, <b>reading from a file</b> and encryption happen in Main", and the Guide lists FileUtils among Main's tools. Writing is not mentioned, so the repository saves through <code>FileUtils</code>. Lab 9 let the repository read too — that is the trade's habit; for the lecturer, follow the paper and say so if asked.</p>`,
        `<p class="y-chinh">🎯 Main đọc tệp một lần lúc mở (<code>FileUtils.readLines</code>) và đưa các dòng cho controller; repository đổi mỗi dòng thành một <code>Expense</code>, và ghi lại cả tệp sau mỗi lần thêm hoặc xoá.</p>
<p>Tờ giấy, mục 1.1, nguyên văn: "toàn bộ việc nhập dữ liệu, validate, <b>đọc từ file</b>, mã hoá thực hiện ở Main", và Guide liệt kê FileUtils trong công cụ của Main. Việc ghi thì không nói, nên repository lưu qua <code>FileUtils</code>. Lab 9 để repository tự đọc — đó là thói quen của nghề; với thầy, làm theo tờ giấy và nói rõ khi được hỏi.</p>`],
      [5, 'One line per expense',
        `<p class="y-chinh">🎯 <code>id|date|amount|content</code>, one expense per line, UTF-8. <code>loadExpenses</code> splits each line with <code>split("\\\\|", 4)</code>, skips a short or broken line, and adds the rest.</p>
<p>A bar instead of a comma because a content may contain a comma; the limit 4 keeps everything after the third bar in the content. Deleting a line in the middle of a text file has no other way than rewriting the file. The content of the file after both runs is shown real.</p>`,
        `<p class="y-chinh">🎯 <code>id|date|amount|content</code>, mỗi khoản chi một dòng, UTF-8. <code>loadExpenses</code> tách từng dòng bằng <code>split("\\\\|", 4)</code>, bỏ qua dòng thiếu hoặc hỏng, thêm các dòng còn lại.</p>
<p>Dùng gạch đứng thay dấu phẩy vì nội dung có thể có dấu phẩy; giới hạn 4 giữ mọi thứ sau gạch thứ ba trong nội dung. Xoá một dòng giữa tệp văn bản thì không có cách nào khác ngoài ghi lại cả tệp. Nội dung tệp sau hai lần chạy là thật.</p>`],
      [6, 'The trap: split("|")',
        `<p class="y-chinh">🎯 Change <code>"\\\\|"</code> into <code>"|"</code> and reopen the program: the table shows dates "|", amounts 1, 2, 3 and Total: 6 — no error at all.</p>
<p>In a regex <code>|</code> means "or"; <code>"|"</code> alone is "empty or empty", which matches between every two characters, so the line is cut into single characters. The first run looks perfect because nothing is read; the bug appears only after a restart — which is why the test keys of a file lab must include one.</p>`,
        `<p class="y-chinh">🎯 Đổi <code>"\\\\|"</code> thành <code>"|"</code> rồi mở lại chương trình: bảng hiện ngày là "|", số tiền 1, 2, 3 và Total: 6 — không một lỗi nào.</p>
<p>Trong regex, <code>|</code> nghĩa là "hoặc"; <code>"|"</code> đứng một mình là "rỗng hoặc rỗng", khớp giữa mọi cặp ký tự, nên dòng bị cắt thành từng ký tự. Lần chạy đầu trông hoàn hảo vì chưa đọc gì; lỗi chỉ lộ sau khi mở lại — vì thế bộ phím test của bài có tệp phải có một lần mở lại.</p>`],
      [7, 'Dates like 11-Apr-2009',
        `<p class="y-chinh">🎯 <code>getDate</code>: check the shape with a regex, parse with <code>dd-MMM-yyyy</code> in <code>Locale.ENGLISH</code> with <code>setLenient(false)</code>, return the date formatted back — <code>11-apr-2009</code> is stored as <code>11-Apr-2009</code>.</p>
<p>Three traps in one line: <code>MMM</code> follows the machine's language (a Vietnamese machine would expect "thg 4"); a lenient parser turns 31-Feb into 3-Mar; <code>parse</code> reads the beginning only, so the regex refuses <code>11-Apr-2009abc</code> first.</p>`,
        `<p class="y-chinh">🎯 <code>getDate</code>: kiểm hình dạng bằng regex, parse theo <code>dd-MMM-yyyy</code> với <code>Locale.ENGLISH</code> và <code>setLenient(false)</code>, trả ngày đã format lại — <code>11-apr-2009</code> được lưu thành <code>11-Apr-2009</code>.</p>
<p>Ba cái bẫy trong một dòng: <code>MMM</code> theo ngôn ngữ của máy (máy tiếng Việt sẽ đòi "thg 4"); parser dễ dãi biến 31-Feb thành 3-Mar; <code>parse</code> chỉ đọc phần đầu, nên regex chặn <code>11-Apr-2009abc</code> trước.</p>`],
      [8, 'The clean design',
        `<p class="y-chinh">🎯 Main → <code>ExpenseController</code>, which holds <code>ExpenseRepository</code> (list, CRUD, save), <code>ExpenseService</code> (next ID, table rows, total) and <code>ExpenseView</code> (display once).</p>
<p>The service holds nothing: it receives the list from the controller and returns numbers and rows — the rule the lecturer enforced on P0011 and P0021. From the 26/10 version: Main printed "Add an expense successful" itself (now the view), the repository read the file (now Main), <code>int choice</code> was declared in the middle of a block, and 34 paper violations became 0.</p>`,
        `<p class="y-chinh">🎯 Main → <code>ExpenseController</code>, giữ <code>ExpenseRepository</code> (danh sách, CRUD, lưu tệp), <code>ExpenseService</code> (ID mới, dòng bảng, tổng tiền) và <code>ExpenseView</code> (in một lần).</p>
<p>Service không giữ gì: nhận danh sách từ controller, trả về con số và dòng bảng — đúng luật thầy bắt ở P0011 và P0021. So với bản 26/10: Main tự in "Add an expense successful" (nay là view), repository tự đọc tệp (nay là Main), <code>int choice</code> khai giữa khối, và 34 vi phạm tờ giấy thành 0.</p>`],
      [9, 'Repository: add, delete, save',
        `<p class="y-chinh">🎯 <code>addExpense</code> adds and saves; <code>deleteExpense(id)</code> removes the matching expense, saves and returns true — or returns false when the ID is not there; <code>saveToFile</code> joins every expense with bars and writes the file.</p>
<p>A missing ID is an expected answer that the brief prints ("Delete an expense fail"), so it is a <code>boolean</code>, not an exception. A write failure is the exception: "Khong ghi duoc tep data/expenses.txt…".</p>`,
        `<p class="y-chinh">🎯 <code>addExpense</code> thêm rồi lưu; <code>deleteExpense(id)</code> xoá khoản chi trùng ID, lưu và trả true — hoặc trả false khi không có ID đó; <code>saveToFile</code> ghép từng khoản chi bằng gạch đứng rồi ghi tệp.</p>
<p>ID không có là một câu trả lời bình thường mà đề in ra ("Delete an expense fail"), nên dùng <code>boolean</code>, không dùng ngoại lệ. Ghi tệp thất bại mới là ngoại lệ: "Khong ghi duoc tep data/expenses.txt…".</p>`],
      [10, 'Service: only computing',
        `<p class="y-chinh">🎯 <code>generateNextId</code> (largest + 1, 1 for an empty list), <code>createExpense</code>, <code>toResponseList</code>, <code>calculateTotal</code> — each one works on the list the controller gives.</p>
<p><code>formatMoney</code> uses <code>"0.##"</code>, so 100 prints as 100 like the brief's table and 50.5 as 50.5, with <code>Locale.US</code> so a Vietnamese Windows does not print 50,5.</p>`,
        `<p class="y-chinh">🎯 <code>generateNextId</code> (lớn nhất + 1, danh sách rỗng thì 1), <code>createExpense</code>, <code>toResponseList</code>, <code>calculateTotal</code> — hàm nào cũng làm trên danh sách controller đưa.</p>
<p><code>formatMoney</code> dùng <code>"0.##"</code> nên 100 in thành 100 như bảng của đề, 50.5 in thành 50.5, và dùng <code>Locale.US</code> để Windows tiếng Việt không in 50,5.</p>`],
      [11, 'Controller and view',
        `<p class="y-chinh">🎯 <code>addExpense</code>: the service gives the next ID, the repository adds, the view says "Add an expense successful (ID 4)". <code>deleteExpense</code>: the repository's true or false becomes the brief's sentence. One <code>display()</code> per flow.</p>
<p>The view holds rows, a total and a message: a message is printed alone, otherwise the table and the Total line. The brief's sentences are copied exactly — "fail", not "failed", no full stop.</p>`,
        `<p class="y-chinh">🎯 <code>addExpense</code>: service đưa ID mới, repository thêm, view báo "Add an expense successful (ID 4)". <code>deleteExpense</code>: true hay false của repository thành câu của đề. Mỗi luồng một <code>display()</code>.</p>
<p>View giữ các dòng, tổng tiền và một câu báo: có câu báo thì chỉ in câu đó, không thì in bảng và dòng Total. Câu của đề chép đúng — "fail", không phải "failed", không dấu chấm.</p>`],
      [12, 'Main and FileUtils',
        `<p class="y-chinh">🎯 <code>readExpenseFile</code> puts the lines into an <code>ExpenseRequestDTO</code> (an unreadable file prints a message and starts empty); <code>inputExpense</code> fills a new DTO field by field; each case calls the controller once.</p>
<p><code>FileUtils.writeLines</code> has three small guards: create the <code>data</code> folder on the very first run, write UTF-8 (read UTF-8 too), and ask <code>checkError()</code> because a <code>PrintWriter</code> never throws on its own.</p>`,
        `<p class="y-chinh">🎯 <code>readExpenseFile</code> đưa các dòng vào một <code>ExpenseRequestDTO</code> (tệp không đọc được thì báo và bắt đầu rỗng); <code>inputExpense</code> điền một DTO mới từng ô; mỗi case gọi controller một lần.</p>
<p><code>FileUtils.writeLines</code> có ba chốt nhỏ: tạo thư mục <code>data</code> ở lần chạy đầu tiên, ghi UTF-8 (đọc cũng UTF-8), và hỏi <code>checkError()</code> vì <code>PrintWriter</code> không bao giờ tự ném lỗi.</p>`],
      [13, 'Two runs, lint, JDK 8, PASS',
        `<p class="y-chinh">🎯 Run 1: every error once, the brief's three expenses, Total: 550. The program is opened again (<code>harness/input-2.txt</code>): the same table is read back, delete abc, 9 (fail), 2 (successful), add one more — ID 4, Total: 350.5.</p>
<p><code>lint.py</code> clean, <code>check.sh</code> PASS 112/112 over both runs, 25 paper items 0 violations, a real JDK 8 prints the same 112 lines.</p>`,
        `<p class="y-chinh">🎯 Lần 1: mọi lỗi một lần, ba khoản chi của đề, Total: 550. Mở lại chương trình (<code>harness/input-2.txt</code>): đọc lại đúng bảng đó, xoá abc, 9 (fail), 2 (successful), thêm một khoản — ID 4, Total: 350.5.</p>
<p><code>lint.py</code> sạch, <code>check.sh</code> PASS 112/112 qua cả hai lần chạy, 25 mục tờ giấy 0 vi phạm, JDK 8 thật in đúng 112 dòng đó.</p>`],
      [14, 'What the lecturer asks',
        `<p class="y-chinh">🎯 "Who reads the file, who writes it?", "Why does the service not call the repository?", "How is the ID made?", "split("\\\\|") or split("|")?", "Locale.ENGLISH and Locale.US — why?", "Why does deleteExpense return a boolean?"</p>
<p>This lab has not been reviewed yet: answer the file question with the paper's own words, and be ready for the lecturer to prefer the Lab 9 way — moving the read into the repository is a two-line change.</p>`,
        `<p class="y-chinh">🎯 "Ai đọc tệp, ai ghi tệp?", "Sao service không gọi repository?", "ID sinh thế nào?", "split("\\\\|") hay split("|")?", "Locale.ENGLISH và Locale.US — để làm gì?", "Sao deleteExpense trả boolean?"</p>
<p>Bài này chưa được review: trả lời câu về tệp bằng chính chữ của tờ giấy, và sẵn sàng nếu thầy thích cách của Lab 9 — chuyển việc đọc vào repository chỉ là sửa hai dòng.</p>`],
    ]),
    bi(`<h2>1. The brief</h2>
<table>
<thead><tr><th>The brief says</th><th>Where it lives</th></tr></thead>
<tbody>
<tr><td>ID auto increase: max + 1, the first is 1</td><td><code>ExpenseService.generateNextId(ArrayList&lt;Expense&gt;)</code> — computed from the list</td></tr>
<tr><td>date 11-Apr-2009</td><td><code>Validation.getDate</code> + <code>Constants.DATE_FORMAT = "dd-MMM-yyyy"</code>, <code>Locale.ENGLISH</code></td></tr>
<tr><td><code>boolean addExpense(List, Date, double, String)</code></td><td><code>ExpenseController.addExpense(ExpenseRequestDTO)</code> → service <code>createExpense</code> → <code>ExpenseRepository.addExpense(Expense)</code></td></tr>
<tr><td><code>void displayAll(List)</code> — table + Total</td><td><code>ExpenseController.displayAll()</code> → service rows + <code>calculateTotal</code> → <code>ExpenseView.display()</code></td></tr>
<tr><td><code>boolean deleteExpense(List, Expense)</code></td><td><code>ExpenseRepository.deleteExpense(int)</code> returns false when the ID is missing</td></tr>
<tr><td>"Delete an expense fail" · "Delete an expense successful"</td><td><code>Message.DELETE_FAIL</code>, <code>DELETE_SUCCESS</code> — copied exactly</td></tr>
<tr><td>"Write a file processing program"</td><td><code>data/expenses.txt</code>: Main reads, the repository saves after each change</td></tr>
</tbody>
</table>
<h2>2. The file, and the bug that waits for a restart</h2>
<p>The file after both runs (real):</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)
$ cat data/*</code></pre>
<div class="out">── data/expenses.txt (87 byte)<br>
1|11-Apr-2009|100.0|Tuition fee<br>
3|30-Apr-2009|200.0|Food<br>
4|01-May-2009|50.5|Bus ticket</div>
<p>The same project with <code>split("|")</code> instead of <code>split("\\\\|")</code> — run 1 is identical, then the program is opened again:</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">…<br>
===== MO LAI CHUONG TRINH (harness/input-2.txt) =====<br>
=======Handy Expense program======<br>
1. Add an expense<br>
2. Display all expenses<br>
3. Delete an expense<br>
4. Quit<br>
Your choice: ---------Display all expenses------------<br>
ID &nbsp;&nbsp;Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Amount &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Content<br>
1 &nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1-Apr-2009|100.0|Tuition fee<br>
2 &nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0-Apr-2009|250.0|Rent house<br>
3 &nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0-Apr-2009|200.0|Food<br>
Total: 6<br>
…</div>
<table>
<thead><tr><th>In the version of 26/10</th><th>Rule</th><th>In this version</th></tr></thead>
<tbody>
<tr><td><code>ExpenseRepository.loadFromFile()</code> read the file</td><td>paper 1.1: reading a file happens in Main</td><td><code>Main.readExpenseFile()</code> → DTO → <code>loadExpenses(lineList)</code></td></tr>
<tr><td>Main printed "Add an expense successful", "Delete an expense successful"</td><td>1.1: results through the view</td><td>the controller sets the message, <code>ExpenseView.display()</code></td></tr>
<tr><td><code>deleteExpense(int expenseId)</code> on the controller</td><td>1.1: the controller receives a DTO</td><td><code>deleteExpense(ExpenseRequestDTO)</code></td></tr>
<tr><td><code>int choice = promptChoice(scanner);</code> inside the loop</td><td>2.6, 3.7</td><td>declared at the top of <code>main</code></td></tr>
<tr><td>a comment on every line, no blank line before it (34 rows of 2.8)</td><td>1.6, 2.8</td><td>one comment per block, a blank line before it</td></tr>
<tr><td><code>expenses.txt</code> in the project folder, default charset</td><td>repeatable checks, Lab 9</td><td><code>data/expenses.txt</code>, UTF-8, <code>data/</code> created on first run</td></tr>
</tbody>
</table>`,
    `<h2>1. Đề bài</h2>
<table>
<thead><tr><th>Đề nói</th><th>Nằm ở đâu</th></tr></thead>
<tbody>
<tr><td>ID tự tăng: lớn nhất + 1, khoản đầu là 1</td><td><code>ExpenseService.generateNextId(ArrayList&lt;Expense&gt;)</code> — tính từ danh sách</td></tr>
<tr><td>ngày 11-Apr-2009</td><td><code>Validation.getDate</code> + <code>Constants.DATE_FORMAT = "dd-MMM-yyyy"</code>, <code>Locale.ENGLISH</code></td></tr>
<tr><td><code>boolean addExpense(List, Date, double, String)</code></td><td><code>ExpenseController.addExpense(ExpenseRequestDTO)</code> → service <code>createExpense</code> → <code>ExpenseRepository.addExpense(Expense)</code></td></tr>
<tr><td><code>void displayAll(List)</code> — bảng + Total</td><td><code>ExpenseController.displayAll()</code> → service dựng dòng + <code>calculateTotal</code> → <code>ExpenseView.display()</code></td></tr>
<tr><td><code>boolean deleteExpense(List, Expense)</code></td><td><code>ExpenseRepository.deleteExpense(int)</code> trả false khi không có ID</td></tr>
<tr><td>"Delete an expense fail" · "Delete an expense successful"</td><td><code>Message.DELETE_FAIL</code>, <code>DELETE_SUCCESS</code> — chép đúng</td></tr>
<tr><td>"Write a file processing program"</td><td><code>data/expenses.txt</code>: Main đọc, repository lưu sau mỗi lần đổi</td></tr>
</tbody>
</table>
<h2>2. Tệp dữ liệu, và lỗi đợi tới lần mở lại</h2>
<p>Tệp sau hai lần chạy (thật):</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)
$ cat data/*</code></pre>
<div class="out">── data/expenses.txt (87 byte)<br>
1|11-Apr-2009|100.0|Tuition fee<br>
3|30-Apr-2009|200.0|Food<br>
4|01-May-2009|50.5|Bus ticket</div>
<p>Cùng dự án nhưng dùng <code>split("|")</code> thay vì <code>split("\\\\|")</code> — lần chạy 1 y hệt, rồi mở lại chương trình:</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">…<br>
===== MO LAI CHUONG TRINH (harness/input-2.txt) =====<br>
=======Handy Expense program======<br>
1. Add an expense<br>
2. Display all expenses<br>
3. Delete an expense<br>
4. Quit<br>
Your choice: ---------Display all expenses------------<br>
ID &nbsp;&nbsp;Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Amount &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Content<br>
1 &nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1-Apr-2009|100.0|Tuition fee<br>
2 &nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0-Apr-2009|250.0|Rent house<br>
3 &nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0-Apr-2009|200.0|Food<br>
Total: 6<br>
…</div>
<table>
<thead><tr><th>Trong bản 26/10</th><th>Luật</th><th>Trong bản này</th></tr></thead>
<tbody>
<tr><td><code>ExpenseRepository.loadFromFile()</code> tự đọc tệp</td><td>tờ giấy 1.1: đọc file thực hiện ở Main</td><td><code>Main.readExpenseFile()</code> → DTO → <code>loadExpenses(lineList)</code></td></tr>
<tr><td>Main tự in "Add an expense successful", "Delete an expense successful"</td><td>1.1: kết quả qua view</td><td>controller đặt câu báo, <code>ExpenseView.display()</code></td></tr>
<tr><td><code>deleteExpense(int expenseId)</code> ở controller</td><td>1.1: controller nhận DTO</td><td><code>deleteExpense(ExpenseRequestDTO)</code></td></tr>
<tr><td><code>int choice = promptChoice(scanner);</code> trong vòng lặp</td><td>2.6, 3.7</td><td>khai báo đầu <code>main</code></td></tr>
<tr><td>comment trên từng dòng, không có dòng trống trước (34 dòng mục 2.8)</td><td>1.6, 2.8</td><td>một comment mỗi khối, có dòng trống trước</td></tr>
<tr><td><code>expenses.txt</code> ở thư mục project, bảng mã mặc định</td><td>chấm lặp lại được, Lab 9</td><td><code>data/expenses.txt</code>, UTF-8, tự tạo <code>data/</code> lần đầu</td></tr>
</tbody>
</table>`),
    bi(`<h2>3. Class design</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/49bb9feca89a91fa0a61cafb7e7902761d3f8719.svg" alt="P0073: Main reads the file, the controller holds repository, service and view; the service only computes" loading="lazy" /><p class="chu-thich">🧩 P0073: Main reads the file, the controller holds repository, service and view; the service only computes</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title J1.S.P0073 Handy Expense — Main reads the file, the repository keeps and saves, the service only computes
package main {
  class Main &lt;&lt;final&gt;&gt; {
    + {static} main(args : String[]) : void
    - {static} readExpenseFile() : ExpenseRequestDTO
    - {static} inputExpense(scanner : Scanner) : ExpenseRequestDTO
  }
}
package controller {
  class ExpenseController {
    - expenseRepository : ExpenseRepository
    - expenseService : ExpenseService
    - expenseView : ExpenseView
    + loadExpenses(expenseRequestDTO : ExpenseRequestDTO) : void
    + addExpense(expenseRequestDTO : ExpenseRequestDTO) : void
    + displayAll() : void
    + deleteExpense(expenseRequestDTO : ExpenseRequestDTO) : void
  }
}
package repository {
  class ExpenseRepository {
    - expenseList : ArrayList&lt;Expense&gt;
    + loadExpenses(lineList : ArrayList&lt;String&gt;) : void
    + addExpense(expense : Expense) : void
    + deleteExpense(expenseId : int) : boolean
    - saveToFile() : void
  }
}
package service {
  class ExpenseService {
    + generateNextId(expenseList : ArrayList&lt;Expense&gt;) : int
    + createExpense(expenseRequestDTO : ExpenseRequestDTO, expenseId : int) : Expense
    + toResponseList(expenseList : ArrayList&lt;Expense&gt;) : ArrayList&lt;ExpenseResponseDTO&gt;
    + calculateTotal(expenseList : ArrayList&lt;Expense&gt;) : String
  }
}
package model {
  class Expense {
    - id : int
    - date : String
    - amount : double
    - content : String
  }
}
package view {
  class ExpenseView {
    - responseList : ArrayList&lt;ExpenseResponseDTO&gt;
    - total : String
    - message : String
    + display() : void
  }
}
package utils {
  class FileUtils &lt;&lt;final&gt;&gt; {
    + {static} readLines(fileName : String) : ArrayList&lt;String&gt;
    + {static} writeLines(fileName : String, lineList : ArrayList&lt;String&gt;) : void
  }
}
package dto {
  class ExpenseRequestDTO {
    - lineList : ArrayList&lt;String&gt;
  }
  class ExpenseResponseDTO {
    + toString() : String
  }
}
Main ..&gt; FileUtils : read data/expenses.txt once
Main ..&gt; ExpenseController : one call per case
ExpenseController *-- ExpenseRepository : load / add / delete (CRUD)
ExpenseController *-- ExpenseService : next ID, rows, total
ExpenseController *-- ExpenseView : display() once
ExpenseRepository o-- "0..*" Expense
ExpenseRepository ..&gt; FileUtils : write after each change
ExpenseService ..&gt; Expense : computes on what it is given
@enduml</code></pre></details>
<h2>4. The code, model first</h2>
<h4>Step 1 — model, constants and the request DTO</h4>
<pre class="trich"><code class="language-java">public class Expense {

    // Ma chi tieu (tu tang)
    private int id;

    // Ngay chi tieu, dang dd-MMM-yyyy (vd 11-Apr-2009)
    private String date;

    // So tien
    private double amount;

    // Noi dung chi tieu
    private String content;

    // Constructor rong (JavaBean)
    public Expense() {
    }

    // Constructor day du thuoc tinh
    public Expense(int id, String date, double amount, String content) {
        this.id = id;
        this.date = date;
        this.amount = amount;
        this.content = content;
    }</code></pre>
<pre class="trich"><code class="language-java">// Dau ngan cach cac cot trong tep
public static final String FILE_SEPARATOR = "|";

// Regex tach theo dau | (| la ky tu dac biet cua regex nen phai co \\\\)
public static final String FILE_SEPARATOR_REGEX = "\\\\|";

// So cot cua 1 dong trong tep: id|date|amount|content
public static final int FILE_FIELDS = 4;</code></pre>
<h4>Step 2 — FileUtils and the repository</h4>
<pre class="trich"><code class="language-java">// Doc tat ca dong cua tep; tep chua co (lan chay dau) thi tra ve danh sach rong
public static ArrayList&lt;String&gt; readLines(String fileName) throws IOException {
    ArrayList&lt;String&gt; lineList = new ArrayList&lt;&gt;();
    File file = new File(fileName);
    String line = null;

    // Chua co tep thi khong co gi de doc
    if (!file.exists()) {
        return lineList;
    }

    // try-with-resources: tu dong dong tep ke ca khi loi
    try (BufferedReader reader = new BufferedReader(new InputStreamReader(
            new FileInputStream(file), Constants.FILE_CHARSET))) {
        line = reader.readLine();

        // Doc tung dong cho den het tep
        while (line != null) {
            lineList.add(line);
            line = reader.readLine();
        }
    }

    return lineList;
}</code></pre>
<pre class="trich"><code class="language-java">// Ghi de toan bo tep bang danh sach dong moi (tao thu muc data neu chua co)
public static void writeLines(String fileName, ArrayList&lt;String&gt; lineList)
        throws IOException {
    File file = new File(fileName);
    File folder = file.getParentFile();

    // Lan chay dau chua co thu muc data thi tao
    if ((folder != null) &amp;&amp; (!folder.exists())) {
        folder.mkdirs();
    }

    // try-with-resources: tu dong dong tep ke ca khi loi
    try (PrintWriter writer = new PrintWriter(new OutputStreamWriter(
            new FileOutputStream(file), Constants.FILE_CHARSET))) {
        // Ghi tung dong
        for (String line : lineList) {
            writer.println(line);
        }

        // PrintWriter khong nem loi nen phai tu hoi
        if (writer.checkError()) {
            throw new IOException(fileName);
        }
    }
}</code></pre>
<pre class="trich"><code class="language-java">// Nap cac dong Main da doc tu tep, moi dong id|date|amount|content (dong hong thi bo qua)
public void loadExpenses(ArrayList&lt;String&gt; lineList) {
    String[] partArray = null;

    // Doi tung dong thanh 1 chi tieu
    for (String line : lineList) {
        partArray = line.split(Constants.FILE_SEPARATOR_REGEX, Constants.FILE_FIELDS);

        // Dong thieu cot thi bo qua
        if (partArray.length &lt; Constants.FILE_FIELDS) {
            continue;
        }

        // Doi id va so tien sang so; dong hong thi bo qua, khong dung chuong trinh
        try {
            expenseList.add(new Expense(
                    Integer.parseInt(partArray[Constants.FIELD_ID].trim()),
                    partArray[Constants.FIELD_DATE].trim(),
                    Double.parseDouble(partArray[Constants.FIELD_AMOUNT].trim()),
                    partArray[Constants.FIELD_CONTENT]));
        } catch (NumberFormatException e) {
            // Bo qua dong hong
            continue;
        }
    }
}</code></pre>
<pre class="trich"><code class="language-java">// Xoa chi tieu theo ID roi ghi lai tep; false = khong co ID do (ham deleteExpense cua de)
public boolean deleteExpense(int expenseId) throws Exception {
    // Duyet tim chi tieu co ID can xoa
    for (Expense expense : expenseList) {
        // Trung ID thi xoa, ghi tep, bao thanh cong
        if (expense.getId() == expenseId) {
            expenseList.remove(expense);
            saveToFile();
            return true;
        }
    }

    return false;
}</code></pre>
<pre class="trich"><code class="language-java">// Ghi toan bo danh sach xuong tep, moi chi tieu 1 dong
private void saveToFile() throws Exception {
    ArrayList&lt;String&gt; lineList = new ArrayList&lt;&gt;();

    // Ghep tung chi tieu thanh 1 dong id|date|amount|content
    for (Expense expense : expenseList) {
        lineList.add(String.join(Constants.FILE_SEPARATOR, String.valueOf(expense.getId()),
                expense.getDate(), String.valueOf(expense.getAmount()), expense.getContent()));
    }

    // Ghi tep, loi thi bao cho nguoi dung
    try {
        FileUtils.writeLines(Constants.FILE_NAME, lineList);
    } catch (Exception e) {
        // Ghi tep that bai: bao loi ro rang
        throw new Exception(Message.WRITE_FAIL);
    }
}</code></pre>
<h4>Step 3 — service</h4>
<pre class="trich"><code class="language-java">// Tim ID lon nhat roi cong 1 (danh sach rong thi ID dau tien la 1)
public int generateNextId(ArrayList&lt;Expense&gt; expenseList) {
    int maxId = Constants.START_ID;

    // Duyet tim ID lon nhat
    for (Expense expense : expenseList) {
        // Gap ID lon hon thi cap nhat
        if (expense.getId() &gt; maxId) {
            maxId = expense.getId();
        }
    }

    return maxId + 1;
}</code></pre>
<pre class="trich"><code class="language-java">// Doi danh sach chi tieu sang cac dong bang de View in (tien da dinh dang)
public ArrayList&lt;ExpenseResponseDTO&gt; toResponseList(ArrayList&lt;Expense&gt; expenseList) {
    ArrayList&lt;ExpenseResponseDTO&gt; responseList = new ArrayList&lt;&gt;();

    // Moi chi tieu 1 dong
    for (Expense expense : expenseList) {
        responseList.add(new ExpenseResponseDTO(expense.getId(), expense.getDate(),
                formatMoney(expense.getAmount()), expense.getContent()));
    }

    return responseList;
}</code></pre>
<pre class="trich"><code class="language-java">// Dinh dang tien: 100 / 100.5, luon dau cham (Locale.US) ke ca may tieng Viet
private String formatMoney(double amount) {
    DecimalFormat moneyFormat = new DecimalFormat(Constants.MONEY_FORMAT,
            new DecimalFormatSymbols(Locale.US));

    return moneyFormat.format(amount);
}</code></pre>
<h4>Step 4 — view and controller</h4>
<pre class="trich"><code class="language-java">// Chuc nang 1: Service tao chi tieu voi ID moi, kho them va ghi tep, View bao ID
public void addExpense(ExpenseRequestDTO expenseRequestDTO) throws Exception {
    int expenseId = expenseService.generateNextId(expenseRepository.getExpenseList());

    expenseRepository.addExpense(expenseService.createExpense(expenseRequestDTO, expenseId));

    // Bao them thanh cong kem ID vua cap
    expenseView.setMessage(String.format(Message.ADD_SUCCESS, expenseId));
    expenseView.display();
}</code></pre>
<pre class="trich"><code class="language-java">// Chuc nang 2: kho lay danh sach, Service doi thanh dong bang + tong tien, View in (displayAll)
public void displayAll() {
    ArrayList&lt;ExpenseResponseDTO&gt; responseList
            = expenseService.toResponseList(expenseRepository.getExpenseList());

    // Chua co chi tieu nao thi bao, co thi dua bang + tong tien cho View
    if (responseList.isEmpty()) {
        expenseView.setMessage(Message.NO_EXPENSE);
    } else {
        // Co chi tieu: dua cac dong va tong tien
        expenseView.setResponseList(responseList);
        expenseView.setTotal(expenseService.calculateTotal(expenseRepository.getExpenseList()));
    }

    expenseView.display();
}</code></pre>
<pre class="trich"><code class="language-java">// In ket qua cua 1 luong roi xoa cau thong bao de luong sau bat dau sach
public void display() {
    // Co cau thong bao thi chi in cau do
    if (!message.isEmpty()) {
        System.out.println(message);
    } else {
        // Bang theo de: tieu de cot, tung dong, dong Total
        System.out.println(String.format(Constants.HEADER_FORMAT, Message.HEADER_ID,
                Message.HEADER_DATE, Message.HEADER_AMOUNT, Message.HEADER_CONTENT));

        // Moi chi tieu 1 dong
        for (ExpenseResponseDTO responseDTO : responseList) {
            System.out.println(responseDTO);
        }

        System.out.println(Message.TOTAL_LABEL.concat(total));
    }

    message = "";
}</code></pre>
<h4>Step 5 — Validation and Main</h4>
<pre class="trich"><code class="language-java">// Kiem ngay dung dang dd-MMM-yyyy va co that; tra ve dang chuan (11-apr-2009 -&gt; 11-Apr-2009)
public static String getDate(String input) throws Exception {
    String text = input.trim();
    SimpleDateFormat dateFormat = new SimpleDateFormat(Constants.DATE_FORMAT, Locale.ENGLISH);
    Date date = null;

    // Khong cho tu "lam tron" ngay sai (31-Feb thanh 03-Mar); ten thang luon tieng Anh
    dateFormat.setLenient(false);

    // Sai hinh dang (vd 2009-04-20, 11-Apr-09, 11-Apr-2009abc) thi bao loi
    if (!text.matches(Constants.DATE_REGEX)) {
        throw new Exception(Message.INVALID_DATE);
    }

    // Doi sang Date; ngay khong co that thi bao loi
    try {
        date = dateFormat.parse(text);
    } catch (ParseException e) {
        // Vi du 31-Feb-2009
        throw new Exception(Message.INVALID_DATE);
    }

    return dateFormat.format(date);
}</code></pre>
<pre class="trich"><code class="language-java">// Chay chuong trinh: doc tep, lap menu den khi chon 4
public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    ExpenseController expenseController = new ExpenseController();
    boolean isRunning = true;
    int choice = 0;

    // Mo chuong trinh: doc tep roi dua cac dong cho Controller nap vao kho
    expenseController.loadExpenses(readExpenseFile());

    // Hien lai menu sau moi chuc nang, den khi chon thoat (khong dung System.exit)
    while (isRunning) {
        System.out.println(Message.MENU);
        choice = promptChoice(scanner);

        // Loi ghi tep (tu kho) in o catch
        try {
            // Moi lua chon goi controller dung 1 lan
            switch (choice) {
                // 1: nhap tung o (sai o nao hoi lai o do) roi them chi tieu
                case Constants.MENU_ADD:
                    System.out.println(Message.TITLE_ADD);
                    expenseController.addExpense(inputExpense(scanner));
                    break;

                // 2: in bang chi tieu + tong tien
                case Constants.MENU_DISPLAY:
                    System.out.println(Message.TITLE_DISPLAY);
                    expenseController.displayAll();
                    break;

                // 3: nhap ID roi xoa
                case Constants.MENU_DELETE:
                    System.out.println(Message.TITLE_DELETE);
                    expenseController.deleteExpense(inputExpenseId(scanner));
                    break;

                // 4: chao va tat co de thoat vong lap
                case Constants.MENU_EXIT:
                    System.out.println(Message.GOODBYE);
                    isRunning = false;
                    break;

                // Khong xay ra: promptChoice chi tra ve 1 den 4
                default:
                    break;
            }
        } catch (Exception e) {
            // Cau loi da viet san o Message
            System.out.println(e.getMessage());
        }
    }
}</code></pre>
<pre class="trich"><code class="language-java">// Doc tep data/expenses.txt thanh phieu chua cac dong; doc loi thi bao va bat dau rong
private static ExpenseRequestDTO readExpenseFile() {
    ExpenseRequestDTO expenseRequestDTO = new ExpenseRequestDTO();

    // Tep chua co (lan chay dau) thi FileUtils tra danh sach rong
    try {
        expenseRequestDTO.setLineList(FileUtils.readLines(Constants.FILE_NAME));
    } catch (IOException e) {
        // Khong doc duoc thi chay tiep voi danh sach rong
        System.out.println(Message.READ_FAIL);
    }

    return expenseRequestDTO;
}</code></pre>
<div class="pitfall"><p>⚠️ Traps of this lab: <code>split("|")</code> (cuts every character) · a counter field for the ID (lost at restart) · <code>MMM</code> without <code>Locale.ENGLISH</code> · lenient dates (31-Feb) · <code>PrintWriter</code> errors never thrown — ask <code>checkError()</code> · the default charset (Vietnamese content broken on another machine) · forgetting to save after delete · testing only one run.</p></div>`,
    `<h2>3. Thiết kế lớp</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/49bb9feca89a91fa0a61cafb7e7902761d3f8719.svg" alt="P0073: Main đọc tệp, controller giữ repository, service và view; service chỉ tính toán" loading="lazy" /><p class="chu-thich">🧩 P0073: Main đọc tệp, controller giữ repository, service và view; service chỉ tính toán</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title J1.S.P0073 Handy Expense — Main reads the file, the repository keeps and saves, the service only computes
package main {
  class Main &lt;&lt;final&gt;&gt; {
    + {static} main(args : String[]) : void
    - {static} readExpenseFile() : ExpenseRequestDTO
    - {static} inputExpense(scanner : Scanner) : ExpenseRequestDTO
  }
}
package controller {
  class ExpenseController {
    - expenseRepository : ExpenseRepository
    - expenseService : ExpenseService
    - expenseView : ExpenseView
    + loadExpenses(expenseRequestDTO : ExpenseRequestDTO) : void
    + addExpense(expenseRequestDTO : ExpenseRequestDTO) : void
    + displayAll() : void
    + deleteExpense(expenseRequestDTO : ExpenseRequestDTO) : void
  }
}
package repository {
  class ExpenseRepository {
    - expenseList : ArrayList&lt;Expense&gt;
    + loadExpenses(lineList : ArrayList&lt;String&gt;) : void
    + addExpense(expense : Expense) : void
    + deleteExpense(expenseId : int) : boolean
    - saveToFile() : void
  }
}
package service {
  class ExpenseService {
    + generateNextId(expenseList : ArrayList&lt;Expense&gt;) : int
    + createExpense(expenseRequestDTO : ExpenseRequestDTO, expenseId : int) : Expense
    + toResponseList(expenseList : ArrayList&lt;Expense&gt;) : ArrayList&lt;ExpenseResponseDTO&gt;
    + calculateTotal(expenseList : ArrayList&lt;Expense&gt;) : String
  }
}
package model {
  class Expense {
    - id : int
    - date : String
    - amount : double
    - content : String
  }
}
package view {
  class ExpenseView {
    - responseList : ArrayList&lt;ExpenseResponseDTO&gt;
    - total : String
    - message : String
    + display() : void
  }
}
package utils {
  class FileUtils &lt;&lt;final&gt;&gt; {
    + {static} readLines(fileName : String) : ArrayList&lt;String&gt;
    + {static} writeLines(fileName : String, lineList : ArrayList&lt;String&gt;) : void
  }
}
package dto {
  class ExpenseRequestDTO {
    - lineList : ArrayList&lt;String&gt;
  }
  class ExpenseResponseDTO {
    + toString() : String
  }
}
Main ..&gt; FileUtils : read data/expenses.txt once
Main ..&gt; ExpenseController : one call per case
ExpenseController *-- ExpenseRepository : load / add / delete (CRUD)
ExpenseController *-- ExpenseService : next ID, rows, total
ExpenseController *-- ExpenseView : display() once
ExpenseRepository o-- "0..*" Expense
ExpenseRepository ..&gt; FileUtils : write after each change
ExpenseService ..&gt; Expense : computes on what it is given
@enduml</code></pre></details>
<h2>4. Code, model trước</h2>
<h4>Bước 1 — model, constants và phiếu yêu cầu</h4>
<pre class="trich"><code class="language-java">public class Expense {

    // Ma chi tieu (tu tang)
    private int id;

    // Ngay chi tieu, dang dd-MMM-yyyy (vd 11-Apr-2009)
    private String date;

    // So tien
    private double amount;

    // Noi dung chi tieu
    private String content;

    // Constructor rong (JavaBean)
    public Expense() {
    }

    // Constructor day du thuoc tinh
    public Expense(int id, String date, double amount, String content) {
        this.id = id;
        this.date = date;
        this.amount = amount;
        this.content = content;
    }</code></pre>
<pre class="trich"><code class="language-java">// Dau ngan cach cac cot trong tep
public static final String FILE_SEPARATOR = "|";

// Regex tach theo dau | (| la ky tu dac biet cua regex nen phai co \\\\)
public static final String FILE_SEPARATOR_REGEX = "\\\\|";

// So cot cua 1 dong trong tep: id|date|amount|content
public static final int FILE_FIELDS = 4;</code></pre>
<h4>Bước 2 — FileUtils và repository</h4>
<pre class="trich"><code class="language-java">// Doc tat ca dong cua tep; tep chua co (lan chay dau) thi tra ve danh sach rong
public static ArrayList&lt;String&gt; readLines(String fileName) throws IOException {
    ArrayList&lt;String&gt; lineList = new ArrayList&lt;&gt;();
    File file = new File(fileName);
    String line = null;

    // Chua co tep thi khong co gi de doc
    if (!file.exists()) {
        return lineList;
    }

    // try-with-resources: tu dong dong tep ke ca khi loi
    try (BufferedReader reader = new BufferedReader(new InputStreamReader(
            new FileInputStream(file), Constants.FILE_CHARSET))) {
        line = reader.readLine();

        // Doc tung dong cho den het tep
        while (line != null) {
            lineList.add(line);
            line = reader.readLine();
        }
    }

    return lineList;
}</code></pre>
<pre class="trich"><code class="language-java">// Ghi de toan bo tep bang danh sach dong moi (tao thu muc data neu chua co)
public static void writeLines(String fileName, ArrayList&lt;String&gt; lineList)
        throws IOException {
    File file = new File(fileName);
    File folder = file.getParentFile();

    // Lan chay dau chua co thu muc data thi tao
    if ((folder != null) &amp;&amp; (!folder.exists())) {
        folder.mkdirs();
    }

    // try-with-resources: tu dong dong tep ke ca khi loi
    try (PrintWriter writer = new PrintWriter(new OutputStreamWriter(
            new FileOutputStream(file), Constants.FILE_CHARSET))) {
        // Ghi tung dong
        for (String line : lineList) {
            writer.println(line);
        }

        // PrintWriter khong nem loi nen phai tu hoi
        if (writer.checkError()) {
            throw new IOException(fileName);
        }
    }
}</code></pre>
<pre class="trich"><code class="language-java">// Nap cac dong Main da doc tu tep, moi dong id|date|amount|content (dong hong thi bo qua)
public void loadExpenses(ArrayList&lt;String&gt; lineList) {
    String[] partArray = null;

    // Doi tung dong thanh 1 chi tieu
    for (String line : lineList) {
        partArray = line.split(Constants.FILE_SEPARATOR_REGEX, Constants.FILE_FIELDS);

        // Dong thieu cot thi bo qua
        if (partArray.length &lt; Constants.FILE_FIELDS) {
            continue;
        }

        // Doi id va so tien sang so; dong hong thi bo qua, khong dung chuong trinh
        try {
            expenseList.add(new Expense(
                    Integer.parseInt(partArray[Constants.FIELD_ID].trim()),
                    partArray[Constants.FIELD_DATE].trim(),
                    Double.parseDouble(partArray[Constants.FIELD_AMOUNT].trim()),
                    partArray[Constants.FIELD_CONTENT]));
        } catch (NumberFormatException e) {
            // Bo qua dong hong
            continue;
        }
    }
}</code></pre>
<pre class="trich"><code class="language-java">// Xoa chi tieu theo ID roi ghi lai tep; false = khong co ID do (ham deleteExpense cua de)
public boolean deleteExpense(int expenseId) throws Exception {
    // Duyet tim chi tieu co ID can xoa
    for (Expense expense : expenseList) {
        // Trung ID thi xoa, ghi tep, bao thanh cong
        if (expense.getId() == expenseId) {
            expenseList.remove(expense);
            saveToFile();
            return true;
        }
    }

    return false;
}</code></pre>
<pre class="trich"><code class="language-java">// Ghi toan bo danh sach xuong tep, moi chi tieu 1 dong
private void saveToFile() throws Exception {
    ArrayList&lt;String&gt; lineList = new ArrayList&lt;&gt;();

    // Ghep tung chi tieu thanh 1 dong id|date|amount|content
    for (Expense expense : expenseList) {
        lineList.add(String.join(Constants.FILE_SEPARATOR, String.valueOf(expense.getId()),
                expense.getDate(), String.valueOf(expense.getAmount()), expense.getContent()));
    }

    // Ghi tep, loi thi bao cho nguoi dung
    try {
        FileUtils.writeLines(Constants.FILE_NAME, lineList);
    } catch (Exception e) {
        // Ghi tep that bai: bao loi ro rang
        throw new Exception(Message.WRITE_FAIL);
    }
}</code></pre>
<h4>Bước 3 — service</h4>
<pre class="trich"><code class="language-java">// Tim ID lon nhat roi cong 1 (danh sach rong thi ID dau tien la 1)
public int generateNextId(ArrayList&lt;Expense&gt; expenseList) {
    int maxId = Constants.START_ID;

    // Duyet tim ID lon nhat
    for (Expense expense : expenseList) {
        // Gap ID lon hon thi cap nhat
        if (expense.getId() &gt; maxId) {
            maxId = expense.getId();
        }
    }

    return maxId + 1;
}</code></pre>
<pre class="trich"><code class="language-java">// Doi danh sach chi tieu sang cac dong bang de View in (tien da dinh dang)
public ArrayList&lt;ExpenseResponseDTO&gt; toResponseList(ArrayList&lt;Expense&gt; expenseList) {
    ArrayList&lt;ExpenseResponseDTO&gt; responseList = new ArrayList&lt;&gt;();

    // Moi chi tieu 1 dong
    for (Expense expense : expenseList) {
        responseList.add(new ExpenseResponseDTO(expense.getId(), expense.getDate(),
                formatMoney(expense.getAmount()), expense.getContent()));
    }

    return responseList;
}</code></pre>
<pre class="trich"><code class="language-java">// Dinh dang tien: 100 / 100.5, luon dau cham (Locale.US) ke ca may tieng Viet
private String formatMoney(double amount) {
    DecimalFormat moneyFormat = new DecimalFormat(Constants.MONEY_FORMAT,
            new DecimalFormatSymbols(Locale.US));

    return moneyFormat.format(amount);
}</code></pre>
<h4>Bước 4 — view và controller</h4>
<pre class="trich"><code class="language-java">// Chuc nang 1: Service tao chi tieu voi ID moi, kho them va ghi tep, View bao ID
public void addExpense(ExpenseRequestDTO expenseRequestDTO) throws Exception {
    int expenseId = expenseService.generateNextId(expenseRepository.getExpenseList());

    expenseRepository.addExpense(expenseService.createExpense(expenseRequestDTO, expenseId));

    // Bao them thanh cong kem ID vua cap
    expenseView.setMessage(String.format(Message.ADD_SUCCESS, expenseId));
    expenseView.display();
}</code></pre>
<pre class="trich"><code class="language-java">// Chuc nang 2: kho lay danh sach, Service doi thanh dong bang + tong tien, View in (displayAll)
public void displayAll() {
    ArrayList&lt;ExpenseResponseDTO&gt; responseList
            = expenseService.toResponseList(expenseRepository.getExpenseList());

    // Chua co chi tieu nao thi bao, co thi dua bang + tong tien cho View
    if (responseList.isEmpty()) {
        expenseView.setMessage(Message.NO_EXPENSE);
    } else {
        // Co chi tieu: dua cac dong va tong tien
        expenseView.setResponseList(responseList);
        expenseView.setTotal(expenseService.calculateTotal(expenseRepository.getExpenseList()));
    }

    expenseView.display();
}</code></pre>
<pre class="trich"><code class="language-java">// In ket qua cua 1 luong roi xoa cau thong bao de luong sau bat dau sach
public void display() {
    // Co cau thong bao thi chi in cau do
    if (!message.isEmpty()) {
        System.out.println(message);
    } else {
        // Bang theo de: tieu de cot, tung dong, dong Total
        System.out.println(String.format(Constants.HEADER_FORMAT, Message.HEADER_ID,
                Message.HEADER_DATE, Message.HEADER_AMOUNT, Message.HEADER_CONTENT));

        // Moi chi tieu 1 dong
        for (ExpenseResponseDTO responseDTO : responseList) {
            System.out.println(responseDTO);
        }

        System.out.println(Message.TOTAL_LABEL.concat(total));
    }

    message = "";
}</code></pre>
<h4>Bước 5 — Validation và Main</h4>
<pre class="trich"><code class="language-java">// Kiem ngay dung dang dd-MMM-yyyy va co that; tra ve dang chuan (11-apr-2009 -&gt; 11-Apr-2009)
public static String getDate(String input) throws Exception {
    String text = input.trim();
    SimpleDateFormat dateFormat = new SimpleDateFormat(Constants.DATE_FORMAT, Locale.ENGLISH);
    Date date = null;

    // Khong cho tu "lam tron" ngay sai (31-Feb thanh 03-Mar); ten thang luon tieng Anh
    dateFormat.setLenient(false);

    // Sai hinh dang (vd 2009-04-20, 11-Apr-09, 11-Apr-2009abc) thi bao loi
    if (!text.matches(Constants.DATE_REGEX)) {
        throw new Exception(Message.INVALID_DATE);
    }

    // Doi sang Date; ngay khong co that thi bao loi
    try {
        date = dateFormat.parse(text);
    } catch (ParseException e) {
        // Vi du 31-Feb-2009
        throw new Exception(Message.INVALID_DATE);
    }

    return dateFormat.format(date);
}</code></pre>
<pre class="trich"><code class="language-java">// Chay chuong trinh: doc tep, lap menu den khi chon 4
public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    ExpenseController expenseController = new ExpenseController();
    boolean isRunning = true;
    int choice = 0;

    // Mo chuong trinh: doc tep roi dua cac dong cho Controller nap vao kho
    expenseController.loadExpenses(readExpenseFile());

    // Hien lai menu sau moi chuc nang, den khi chon thoat (khong dung System.exit)
    while (isRunning) {
        System.out.println(Message.MENU);
        choice = promptChoice(scanner);

        // Loi ghi tep (tu kho) in o catch
        try {
            // Moi lua chon goi controller dung 1 lan
            switch (choice) {
                // 1: nhap tung o (sai o nao hoi lai o do) roi them chi tieu
                case Constants.MENU_ADD:
                    System.out.println(Message.TITLE_ADD);
                    expenseController.addExpense(inputExpense(scanner));
                    break;

                // 2: in bang chi tieu + tong tien
                case Constants.MENU_DISPLAY:
                    System.out.println(Message.TITLE_DISPLAY);
                    expenseController.displayAll();
                    break;

                // 3: nhap ID roi xoa
                case Constants.MENU_DELETE:
                    System.out.println(Message.TITLE_DELETE);
                    expenseController.deleteExpense(inputExpenseId(scanner));
                    break;

                // 4: chao va tat co de thoat vong lap
                case Constants.MENU_EXIT:
                    System.out.println(Message.GOODBYE);
                    isRunning = false;
                    break;

                // Khong xay ra: promptChoice chi tra ve 1 den 4
                default:
                    break;
            }
        } catch (Exception e) {
            // Cau loi da viet san o Message
            System.out.println(e.getMessage());
        }
    }
}</code></pre>
<pre class="trich"><code class="language-java">// Doc tep data/expenses.txt thanh phieu chua cac dong; doc loi thi bao va bat dau rong
private static ExpenseRequestDTO readExpenseFile() {
    ExpenseRequestDTO expenseRequestDTO = new ExpenseRequestDTO();

    // Tep chua co (lan chay dau) thi FileUtils tra danh sach rong
    try {
        expenseRequestDTO.setLineList(FileUtils.readLines(Constants.FILE_NAME));
    } catch (IOException e) {
        // Khong doc duoc thi chay tiep voi danh sach rong
        System.out.println(Message.READ_FAIL);
    }

    return expenseRequestDTO;
}</code></pre>
<div class="pitfall"><p>⚠️ Bẫy của bài: <code>split("|")</code> (cắt từng ký tự) · dùng trường đếm cho ID (mất khi mở lại) · <code>MMM</code> thiếu <code>Locale.ENGLISH</code> · ngày dễ dãi (31-Feb) · <code>PrintWriter</code> không bao giờ ném lỗi — phải hỏi <code>checkError()</code> · bảng mã mặc định (nội dung tiếng Việt hỏng ở máy khác) · quên lưu sau khi xoá · chỉ test một lần chạy.</p></div>`),
    bi(`<h2>5. Run it for real — twice</h2>
<p>Run 1 (<code>harness/input.txt</code>, empty file): menu <code>x</code>, <code>9</code>, Display on an empty list, Add with <code>31-Feb-2009</code>, <code>11-apr-2009</code>, amounts <code>abc</code>, <code>0</code>, <code>100</code>, an empty content, <code>Tuition fee</code>, then the brief's two other expenses, Display, Quit. Run 2 (<code>harness/input-2.txt</code>, the program opened again): Display, Delete <code>abc</code>, <code>9</code>, Delete <code>2</code>, Display, Add <code>01-May-2009</code> <code>50.5</code> <code>Bus ticket</code>, Display, Quit.</p>
<details><summary>Both runs (112 lines)</summary>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">=======Handy Expense program======<br>
1. Add an expense<br>
2. Display all expenses<br>
3. Delete an expense<br>
4. Quit<br>
Your choice: Ban phai nhap 1 so nguyen (vi du: 1, 2, 3), khong nhap chu hay de trong. Moi nhap lai.<br>
Your choice: Lua chon nam ngoai khoang cho phep. Hay nhap 1 so tu 1 den 4. Moi nhap lai.<br>
Your choice: ---------Display all expenses------------<br>
Chua co chi tieu nao de hien thi. Hay chon 1 de them chi tieu truoc.<br>
=======Handy Expense program======<br>
1. Add an expense<br>
2. Display all expenses<br>
3. Delete an expense<br>
4. Quit<br>
Your choice: -------- Add an expense--------<br>
Enter Date: Ngay phai dung dang dd-MMM-yyyy va la ngay co that (vi du: 11-Apr-2009). Moi nhap lai.<br>
Enter Date: Enter Amount: So tien phai la 1 so (vi du: 100 hoac 100.5), khong nhap chu hay de trong. Moi nhap lai.<br>
Enter Amount: So tien phai lon hon 0. Moi nhap lai.<br>
Enter Amount: Enter Content: Noi dung khong duoc de trong (vi du: Tuition fee). Moi nhap lai.<br>
Enter Content: Add an expense successful (ID 1)<br>
=======Handy Expense program======<br>
1. Add an expense<br>
2. Display all expenses<br>
3. Delete an expense<br>
4. Quit<br>
Your choice: -------- Add an expense--------<br>
Enter Date: Enter Amount: Enter Content: Add an expense successful (ID 2)<br>
=======Handy Expense program======<br>
1. Add an expense<br>
2. Display all expenses<br>
3. Delete an expense<br>
4. Quit<br>
Your choice: -------- Add an expense--------<br>
Enter Date: Enter Amount: Enter Content: Add an expense successful (ID 3)<br>
=======Handy Expense program======<br>
1. Add an expense<br>
2. Display all expenses<br>
3. Delete an expense<br>
4. Quit<br>
Your choice: ---------Display all expenses------------<br>
ID &nbsp;&nbsp;Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Amount &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Content<br>
1 &nbsp;&nbsp;&nbsp;11-Apr-2009 &nbsp;&nbsp;100 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tuition fee<br>
2 &nbsp;&nbsp;&nbsp;20-Apr-2009 &nbsp;&nbsp;250 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Rent house<br>
3 &nbsp;&nbsp;&nbsp;30-Apr-2009 &nbsp;&nbsp;200 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Food<br>
Total: 550<br>
=======Handy Expense program======<br>
1. Add an expense<br>
2. Display all expenses<br>
3. Delete an expense<br>
4. Quit<br>
Your choice: Bye.<br>
===== MO LAI CHUONG TRINH (harness/input-2.txt) =====<br>
=======Handy Expense program======<br>
1. Add an expense<br>
2. Display all expenses<br>
3. Delete an expense<br>
4. Quit<br>
Your choice: ---------Display all expenses------------<br>
ID &nbsp;&nbsp;Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Amount &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Content<br>
1 &nbsp;&nbsp;&nbsp;11-Apr-2009 &nbsp;&nbsp;100 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tuition fee<br>
2 &nbsp;&nbsp;&nbsp;20-Apr-2009 &nbsp;&nbsp;250 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Rent house<br>
3 &nbsp;&nbsp;&nbsp;30-Apr-2009 &nbsp;&nbsp;200 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Food<br>
Total: 550<br>
=======Handy Expense program======<br>
1. Add an expense<br>
2. Display all expenses<br>
3. Delete an expense<br>
4. Quit<br>
Your choice: --------Delete an expense------<br>
Enter ID: Ban phai nhap 1 so nguyen (vi du: 1, 2, 3), khong nhap chu hay de trong. Moi nhap lai.<br>
Enter ID: Delete an expense fail<br>
=======Handy Expense program======<br>
1. Add an expense<br>
2. Display all expenses<br>
3. Delete an expense<br>
4. Quit<br>
Your choice: --------Delete an expense------<br>
Enter ID: Delete an expense successful<br>
=======Handy Expense program======<br>
1. Add an expense<br>
2. Display all expenses<br>
3. Delete an expense<br>
4. Quit<br>
Your choice: ---------Display all expenses------------<br>
ID &nbsp;&nbsp;Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Amount &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Content<br>
1 &nbsp;&nbsp;&nbsp;11-Apr-2009 &nbsp;&nbsp;100 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tuition fee<br>
3 &nbsp;&nbsp;&nbsp;30-Apr-2009 &nbsp;&nbsp;200 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Food<br>
Total: 300<br>
=======Handy Expense program======<br>
1. Add an expense<br>
2. Display all expenses<br>
3. Delete an expense<br>
4. Quit<br>
Your choice: -------- Add an expense--------<br>
Enter Date: Enter Amount: Enter Content: Add an expense successful (ID 4)<br>
=======Handy Expense program======<br>
1. Add an expense<br>
2. Display all expenses<br>
3. Delete an expense<br>
4. Quit<br>
Your choice: ---------Display all expenses------------<br>
ID &nbsp;&nbsp;Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Amount &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Content<br>
1 &nbsp;&nbsp;&nbsp;11-Apr-2009 &nbsp;&nbsp;100 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tuition fee<br>
3 &nbsp;&nbsp;&nbsp;30-Apr-2009 &nbsp;&nbsp;200 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Food<br>
4 &nbsp;&nbsp;&nbsp;01-May-2009 &nbsp;&nbsp;50.5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Bus ticket<br>
Total: 350.5<br>
=======Handy Expense program======<br>
1. Add an expense<br>
2. Display all expenses<br>
3. Delete an expense<br>
4. Quit<br>
Your choice: Bye.</div>
</details>
<p>Every validation message once, then the brief's table:</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">…<br>
Your choice: Ban phai nhap 1 so nguyen (vi du: 1, 2, 3), khong nhap chu hay de trong. Moi nhap lai.<br>
Your choice: Lua chon nam ngoai khoang cho phep. Hay nhap 1 so tu 1 den 4. Moi nhap lai.<br>
Your choice: ---------Display all expenses------------<br>
Chua co chi tieu nao de hien thi. Hay chon 1 de them chi tieu truoc.<br>
=======Handy Expense program======<br>
1. Add an expense<br>
2. Display all expenses<br>
3. Delete an expense<br>
4. Quit<br>
Your choice: -------- Add an expense--------<br>
Enter Date: Ngay phai dung dang dd-MMM-yyyy va la ngay co that (vi du: 11-Apr-2009). Moi nhap lai.<br>
Enter Date: Enter Amount: So tien phai la 1 so (vi du: 100 hoac 100.5), khong nhap chu hay de trong. Moi nhap lai.<br>
Enter Amount: So tien phai lon hon 0. Moi nhap lai.<br>
Enter Amount: Enter Content: Noi dung khong duoc de trong (vi du: Tuition fee). Moi nhap lai.<br>
Enter Content: Add an expense successful (ID 1)<br>
…</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">…<br>
Your choice: ---------Display all expenses------------<br>
ID &nbsp;&nbsp;Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Amount &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Content<br>
1 &nbsp;&nbsp;&nbsp;11-Apr-2009 &nbsp;&nbsp;100 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tuition fee<br>
2 &nbsp;&nbsp;&nbsp;20-Apr-2009 &nbsp;&nbsp;250 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Rent house<br>
3 &nbsp;&nbsp;&nbsp;30-Apr-2009 &nbsp;&nbsp;200 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Food<br>
Total: 550<br>
…</div>
<p>Opened again — read back from the file, delete fail and successful, a new ID 4:</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">…<br>
===== MO LAI CHUONG TRINH (harness/input-2.txt) =====<br>
=======Handy Expense program======<br>
1. Add an expense<br>
2. Display all expenses<br>
3. Delete an expense<br>
4. Quit<br>
Your choice: ---------Display all expenses------------<br>
ID &nbsp;&nbsp;Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Amount &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Content<br>
1 &nbsp;&nbsp;&nbsp;11-Apr-2009 &nbsp;&nbsp;100 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tuition fee<br>
2 &nbsp;&nbsp;&nbsp;20-Apr-2009 &nbsp;&nbsp;250 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Rent house<br>
3 &nbsp;&nbsp;&nbsp;30-Apr-2009 &nbsp;&nbsp;200 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Food<br>
Total: 550<br>
…</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">…<br>
Enter ID: Ban phai nhap 1 so nguyen (vi du: 1, 2, 3), khong nhap chu hay de trong. Moi nhap lai.<br>
Enter ID: Delete an expense fail<br>
…</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">…<br>
Your choice: ---------Display all expenses------------<br>
ID &nbsp;&nbsp;Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Amount &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Content<br>
1 &nbsp;&nbsp;&nbsp;11-Apr-2009 &nbsp;&nbsp;100 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tuition fee<br>
3 &nbsp;&nbsp;&nbsp;30-Apr-2009 &nbsp;&nbsp;200 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Food<br>
4 &nbsp;&nbsp;&nbsp;01-May-2009 &nbsp;&nbsp;50.5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Bus ticket<br>
Total: 350.5<br>
…</div>
<pre><code class="language-bash">$ python3 lint.py MSSV_J1SP0073_HandyExpense</code></pre>
<div class="out">✓ MSSV_J1SP0073_HandyExpense — sạch</div>
<pre><code class="language-bash">$ ./check.sh        # Windows: check.bat · NetBeans: Run File on test/harness/CheckHarness.java</code></pre>
<div class="out">PASS: 112/112 dong khop expected.txt</div>
<p>A real JDK 8 prints the same 112 lines. The paper checklist audit: 0 violations. The grader copies <code>harness/data/expenses.txt</code> (empty) over <code>data/</code> before each check, so every check starts from the same file.</p>
<h2>6. Debug it</h2>
<p>Breakpoint on <code>if (expense.getId() > maxId) {</code> in <code>ExpenseService.generateNextId</code> → run 1, then run 2 up to the Add → stop: <code>expenseList</code> holds IDs 1 and 3 (2 was deleted), <code>maxId</code> goes 0 → 1 → 3, the method returns 4. Then a breakpoint on <code>partArray = line.split(…)</code> in <code>loadExpenses</code> at the start of run 2: Variables shows the four parts of <code>"1|11-Apr-2009|100.0|Tuition fee"</code>.</p>
<h2>7. The questions — answer out loud</h2>
<details><summary>Who reads the file, who writes it?</summary><p class="dap-an">✅ Main reads it once at start — the paper (1.1) puts reading a file in Main — and gives the lines to the controller; the repository parses them and saves the whole list after every add or delete, through <code>FileUtils</code>.</p></details>
<details><summary>Why does the service not call the repository?</summary><p class="dap-an">✅ It only computes — next ID, rows, total — on the list the controller gives. Storage is the repository's job; changing the file to a database would not touch the service.</p></details>
<details><summary>How is the ID made, and what after a delete?</summary><p class="dap-an">✅ Largest ID in the list + 1, computed every time, so it is right after a restart. Delete 2 from 1, 2, 3, then add: 4. Delete 3 instead: the next is 3 again.</p></details>
<details><summary>Why split("\\\\|") and not split("|")?</summary><p class="dap-an">✅ <code>split</code> takes a regex and <code>|</code> means "or": unescaped it matches the empty string between every two characters, and the line falls apart — without any error.</p></details>
<details><summary>Locale.ENGLISH for the date, Locale.US for money — why?</summary><p class="dap-an">✅ Month names must be English (Apr) on any machine; money must print a dot (50.5), never a comma, even on a Vietnamese Windows.</p></details>
<details><summary>Why does deleteExpense return a boolean?</summary><p class="dap-an">✅ A missing ID is a normal answer that the brief prints ("Delete an expense fail"). Only a write failure is an exception.</p></details>
<h2>8. Download</h2>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/lab211/v1/MSSV_J1SP0073_HandyExpense-solution.zip" target="_blank" rel="noopener">
<span class="lc-ico">✅</span>
<span class="lc-body"><span class="lc-title">MSSV_J1SP0073_HandyExpense-solution.zip</span><span class="lc-sub">NetBeans project (Java 8) · 12 files · check.sh / check.bat + test/harness (two runs, PASS 112/112) · harness/data/expenses.txt</span></span>
<span class="lc-cta">Download</span>
</a>
<div class="callout"><p><strong>End of 🎓 LAB211 in practice:</strong> seven lessons, one skeleton, one checklist. Next in the course: Progress Test 2.</p></div>`,
    `<h2>5. Chạy thật — hai lần</h2>
<p>Lần 1 (<code>harness/input.txt</code>, tệp rỗng): menu <code>x</code>, <code>9</code>, Display khi danh sách rỗng, Add với <code>31-Feb-2009</code>, <code>11-apr-2009</code>, số tiền <code>abc</code>, <code>0</code>, <code>100</code>, nội dung trống, <code>Tuition fee</code>, rồi hai khoản còn lại của đề, Display, Quit. Lần 2 (<code>harness/input-2.txt</code>, mở lại chương trình): Display, Delete <code>abc</code>, <code>9</code>, Delete <code>2</code>, Display, Add <code>01-May-2009</code> <code>50.5</code> <code>Bus ticket</code>, Display, Quit.</p>
<details><summary>Cả hai lần chạy (112 dòng)</summary>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">=======Handy Expense program======<br>
1. Add an expense<br>
2. Display all expenses<br>
3. Delete an expense<br>
4. Quit<br>
Your choice: Ban phai nhap 1 so nguyen (vi du: 1, 2, 3), khong nhap chu hay de trong. Moi nhap lai.<br>
Your choice: Lua chon nam ngoai khoang cho phep. Hay nhap 1 so tu 1 den 4. Moi nhap lai.<br>
Your choice: ---------Display all expenses------------<br>
Chua co chi tieu nao de hien thi. Hay chon 1 de them chi tieu truoc.<br>
=======Handy Expense program======<br>
1. Add an expense<br>
2. Display all expenses<br>
3. Delete an expense<br>
4. Quit<br>
Your choice: -------- Add an expense--------<br>
Enter Date: Ngay phai dung dang dd-MMM-yyyy va la ngay co that (vi du: 11-Apr-2009). Moi nhap lai.<br>
Enter Date: Enter Amount: So tien phai la 1 so (vi du: 100 hoac 100.5), khong nhap chu hay de trong. Moi nhap lai.<br>
Enter Amount: So tien phai lon hon 0. Moi nhap lai.<br>
Enter Amount: Enter Content: Noi dung khong duoc de trong (vi du: Tuition fee). Moi nhap lai.<br>
Enter Content: Add an expense successful (ID 1)<br>
=======Handy Expense program======<br>
1. Add an expense<br>
2. Display all expenses<br>
3. Delete an expense<br>
4. Quit<br>
Your choice: -------- Add an expense--------<br>
Enter Date: Enter Amount: Enter Content: Add an expense successful (ID 2)<br>
=======Handy Expense program======<br>
1. Add an expense<br>
2. Display all expenses<br>
3. Delete an expense<br>
4. Quit<br>
Your choice: -------- Add an expense--------<br>
Enter Date: Enter Amount: Enter Content: Add an expense successful (ID 3)<br>
=======Handy Expense program======<br>
1. Add an expense<br>
2. Display all expenses<br>
3. Delete an expense<br>
4. Quit<br>
Your choice: ---------Display all expenses------------<br>
ID &nbsp;&nbsp;Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Amount &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Content<br>
1 &nbsp;&nbsp;&nbsp;11-Apr-2009 &nbsp;&nbsp;100 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tuition fee<br>
2 &nbsp;&nbsp;&nbsp;20-Apr-2009 &nbsp;&nbsp;250 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Rent house<br>
3 &nbsp;&nbsp;&nbsp;30-Apr-2009 &nbsp;&nbsp;200 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Food<br>
Total: 550<br>
=======Handy Expense program======<br>
1. Add an expense<br>
2. Display all expenses<br>
3. Delete an expense<br>
4. Quit<br>
Your choice: Bye.<br>
===== MO LAI CHUONG TRINH (harness/input-2.txt) =====<br>
=======Handy Expense program======<br>
1. Add an expense<br>
2. Display all expenses<br>
3. Delete an expense<br>
4. Quit<br>
Your choice: ---------Display all expenses------------<br>
ID &nbsp;&nbsp;Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Amount &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Content<br>
1 &nbsp;&nbsp;&nbsp;11-Apr-2009 &nbsp;&nbsp;100 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tuition fee<br>
2 &nbsp;&nbsp;&nbsp;20-Apr-2009 &nbsp;&nbsp;250 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Rent house<br>
3 &nbsp;&nbsp;&nbsp;30-Apr-2009 &nbsp;&nbsp;200 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Food<br>
Total: 550<br>
=======Handy Expense program======<br>
1. Add an expense<br>
2. Display all expenses<br>
3. Delete an expense<br>
4. Quit<br>
Your choice: --------Delete an expense------<br>
Enter ID: Ban phai nhap 1 so nguyen (vi du: 1, 2, 3), khong nhap chu hay de trong. Moi nhap lai.<br>
Enter ID: Delete an expense fail<br>
=======Handy Expense program======<br>
1. Add an expense<br>
2. Display all expenses<br>
3. Delete an expense<br>
4. Quit<br>
Your choice: --------Delete an expense------<br>
Enter ID: Delete an expense successful<br>
=======Handy Expense program======<br>
1. Add an expense<br>
2. Display all expenses<br>
3. Delete an expense<br>
4. Quit<br>
Your choice: ---------Display all expenses------------<br>
ID &nbsp;&nbsp;Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Amount &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Content<br>
1 &nbsp;&nbsp;&nbsp;11-Apr-2009 &nbsp;&nbsp;100 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tuition fee<br>
3 &nbsp;&nbsp;&nbsp;30-Apr-2009 &nbsp;&nbsp;200 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Food<br>
Total: 300<br>
=======Handy Expense program======<br>
1. Add an expense<br>
2. Display all expenses<br>
3. Delete an expense<br>
4. Quit<br>
Your choice: -------- Add an expense--------<br>
Enter Date: Enter Amount: Enter Content: Add an expense successful (ID 4)<br>
=======Handy Expense program======<br>
1. Add an expense<br>
2. Display all expenses<br>
3. Delete an expense<br>
4. Quit<br>
Your choice: ---------Display all expenses------------<br>
ID &nbsp;&nbsp;Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Amount &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Content<br>
1 &nbsp;&nbsp;&nbsp;11-Apr-2009 &nbsp;&nbsp;100 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tuition fee<br>
3 &nbsp;&nbsp;&nbsp;30-Apr-2009 &nbsp;&nbsp;200 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Food<br>
4 &nbsp;&nbsp;&nbsp;01-May-2009 &nbsp;&nbsp;50.5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Bus ticket<br>
Total: 350.5<br>
=======Handy Expense program======<br>
1. Add an expense<br>
2. Display all expenses<br>
3. Delete an expense<br>
4. Quit<br>
Your choice: Bye.</div>
</details>
<p>Mọi câu báo lỗi một lần, rồi bảng của đề:</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">…<br>
Your choice: Ban phai nhap 1 so nguyen (vi du: 1, 2, 3), khong nhap chu hay de trong. Moi nhap lai.<br>
Your choice: Lua chon nam ngoai khoang cho phep. Hay nhap 1 so tu 1 den 4. Moi nhap lai.<br>
Your choice: ---------Display all expenses------------<br>
Chua co chi tieu nao de hien thi. Hay chon 1 de them chi tieu truoc.<br>
=======Handy Expense program======<br>
1. Add an expense<br>
2. Display all expenses<br>
3. Delete an expense<br>
4. Quit<br>
Your choice: -------- Add an expense--------<br>
Enter Date: Ngay phai dung dang dd-MMM-yyyy va la ngay co that (vi du: 11-Apr-2009). Moi nhap lai.<br>
Enter Date: Enter Amount: So tien phai la 1 so (vi du: 100 hoac 100.5), khong nhap chu hay de trong. Moi nhap lai.<br>
Enter Amount: So tien phai lon hon 0. Moi nhap lai.<br>
Enter Amount: Enter Content: Noi dung khong duoc de trong (vi du: Tuition fee). Moi nhap lai.<br>
Enter Content: Add an expense successful (ID 1)<br>
…</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">…<br>
Your choice: ---------Display all expenses------------<br>
ID &nbsp;&nbsp;Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Amount &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Content<br>
1 &nbsp;&nbsp;&nbsp;11-Apr-2009 &nbsp;&nbsp;100 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tuition fee<br>
2 &nbsp;&nbsp;&nbsp;20-Apr-2009 &nbsp;&nbsp;250 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Rent house<br>
3 &nbsp;&nbsp;&nbsp;30-Apr-2009 &nbsp;&nbsp;200 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Food<br>
Total: 550<br>
…</div>
<p>Mở lại — đọc lại từ tệp, xoá fail và successful, ID mới là 4:</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">…<br>
===== MO LAI CHUONG TRINH (harness/input-2.txt) =====<br>
=======Handy Expense program======<br>
1. Add an expense<br>
2. Display all expenses<br>
3. Delete an expense<br>
4. Quit<br>
Your choice: ---------Display all expenses------------<br>
ID &nbsp;&nbsp;Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Amount &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Content<br>
1 &nbsp;&nbsp;&nbsp;11-Apr-2009 &nbsp;&nbsp;100 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tuition fee<br>
2 &nbsp;&nbsp;&nbsp;20-Apr-2009 &nbsp;&nbsp;250 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Rent house<br>
3 &nbsp;&nbsp;&nbsp;30-Apr-2009 &nbsp;&nbsp;200 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Food<br>
Total: 550<br>
…</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">…<br>
Enter ID: Ban phai nhap 1 so nguyen (vi du: 1, 2, 3), khong nhap chu hay de trong. Moi nhap lai.<br>
Enter ID: Delete an expense fail<br>
…</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">…<br>
Your choice: ---------Display all expenses------------<br>
ID &nbsp;&nbsp;Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Amount &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Content<br>
1 &nbsp;&nbsp;&nbsp;11-Apr-2009 &nbsp;&nbsp;100 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tuition fee<br>
3 &nbsp;&nbsp;&nbsp;30-Apr-2009 &nbsp;&nbsp;200 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Food<br>
4 &nbsp;&nbsp;&nbsp;01-May-2009 &nbsp;&nbsp;50.5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Bus ticket<br>
Total: 350.5<br>
…</div>
<pre><code class="language-bash">$ python3 lint.py MSSV_J1SP0073_HandyExpense</code></pre>
<div class="out">✓ MSSV_J1SP0073_HandyExpense — sạch</div>
<pre><code class="language-bash">$ ./check.sh        # Windows: check.bat · NetBeans: Run File on test/harness/CheckHarness.java</code></pre>
<div class="out">PASS: 112/112 dong khop expected.txt</div>
<p>JDK 8 thật in đúng 112 dòng đó. Soát tờ checklist giấy: 0 vi phạm. Bộ chấm chép <code>harness/data/expenses.txt</code> (rỗng) đè lên <code>data/</code> trước mỗi lần chấm, nên lần chấm nào cũng bắt đầu từ cùng một tệp.</p>
<h2>6. Debug</h2>
<p>Breakpoint ở <code>if (expense.getId() > maxId) {</code> trong <code>ExpenseService.generateNextId</code> → chạy lần 1, rồi lần 2 tới chỗ Add → dừng: <code>expenseList</code> giữ ID 1 và 3 (2 đã xoá), <code>maxId</code> đi 0 → 1 → 3, hàm trả 4. Rồi breakpoint ở <code>partArray = line.split(…)</code> trong <code>loadExpenses</code> lúc đầu lần 2: Variables hiện bốn phần của <code>"1|11-Apr-2009|100.0|Tuition fee"</code>.</p>
<h2>7. Câu thầy hỏi — trả lời thành tiếng</h2>
<details><summary>Ai đọc tệp, ai ghi tệp?</summary><p class="dap-an">✅ Main đọc một lần lúc mở — tờ giấy (1.1) đặt việc đọc file ở Main — rồi đưa các dòng cho controller; repository tách dòng và lưu lại cả danh sách sau mỗi lần thêm hoặc xoá, qua <code>FileUtils</code>.</p></details>
<details><summary>Sao service không gọi repository?</summary><p class="dap-an">✅ Service chỉ tính — ID mới, dòng bảng, tổng tiền — trên danh sách controller đưa. Lưu trữ là việc của repository; đổi tệp thành cơ sở dữ liệu cũng không phải sửa service.</p></details>
<details><summary>ID sinh thế nào, xoá xong thì sao?</summary><p class="dap-an">✅ ID lớn nhất trong danh sách + 1, tính lại mỗi lần, nên mở lại vẫn đúng. Có 1, 2, 3 xoá 2 rồi thêm: 4. Nếu xoá 3: khoản sau lại là 3.</p></details>
<details><summary>Sao split("\\\\|") mà không split("|")?</summary><p class="dap-an">✅ <code>split</code> nhận regex và <code>|</code> nghĩa là "hoặc": không thoát thì nó khớp chuỗi rỗng giữa mọi cặp ký tự, dòng bị cắt vụn — mà không có lỗi nào.</p></details>
<details><summary>Locale.ENGLISH cho ngày, Locale.US cho tiền — để làm gì?</summary><p class="dap-an">✅ Tên tháng phải là tiếng Anh (Apr) trên mọi máy; tiền phải in dấu chấm (50.5), không bao giờ dấu phẩy, kể cả trên Windows tiếng Việt.</p></details>
<details><summary>Sao deleteExpense trả boolean?</summary><p class="dap-an">✅ ID không có là một câu trả lời bình thường mà đề in ra ("Delete an expense fail"). Chỉ ghi tệp thất bại mới là ngoại lệ.</p></details>
<h2>8. Tệp tải về</h2>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/lab211/v1/MSSV_J1SP0073_HandyExpense-solution.zip" target="_blank" rel="noopener">
<span class="lc-ico">✅</span>
<span class="lc-body"><span class="lc-title">MSSV_J1SP0073_HandyExpense-solution.zip</span><span class="lc-sub">project NetBeans (Java 8) · 12 tệp · check.sh / check.bat + test/harness (hai lần chạy, PASS 112/112) · harness/data/expenses.txt</span></span>
<span class="lc-cta">Tải về</span>
</a>
<div class="callout"><p><strong>Hết phần 🎓 LAB211 thực chiến:</strong> bảy bài, một bộ khung, một tờ checklist. Tiếp theo trong khoá: Progress Test 2.</p></div>`),
  ].join('\n'),
};

export default {
  lessons: [L_l211_review, L_l211_p0011, L_l211_p0021, L_l211_p0056, L_l211_p0070, L_l211_p0071, L_l211_p0073],
};
