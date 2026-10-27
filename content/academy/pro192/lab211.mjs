/**
 * PRO192 · 🎓 LAB211 thực chiến — khung chung + cách qua review, P0011, P0021, P0056 (đợt 1).
 * Bài 🏗️ LAB CT Library (chuẩn LAB211, deck tự dựng): pro192-lab211-cach-qua-review, pro192-lab211-p0011-change-base-number, pro192-lab211-p0021-student-management, pro192-lab211-p0056-worker-management.
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/PRO192/gen/gen.mjs từ gen/src/**, gen/java/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node PRO192/gen/gen.mjs`.
 */

import { registerDeck, walk, bi } from './_slides.mjs';

registerDeck('l211-review', { code: 'PRO192 · LAB211', en: "LAB211 in practice — how to pass the lecturer's review", vi: 'LAB211 thực chiến — cách qua review của thầy', total: 15, w: 1280, h: 720 });
registerDeck('l211-p0011', { code: 'PRO192 · LAB211 P0011', en: 'LAB211 · J1.S.P0011 — Change Base Number System', vi: 'LAB211 · J1.S.P0011 — Đổi hệ cơ số', total: 13, w: 1280, h: 720 });
registerDeck('l211-p0021', { code: 'PRO192 · LAB211 P0021', en: 'LAB211 · J1.L.P0021 — Student Management', vi: 'LAB211 · J1.L.P0021 — Quản lý sinh viên', total: 14, w: 1280, h: 720 });
registerDeck('l211-p0056', { code: 'PRO192 · LAB211 P0056', en: 'LAB211 · J1.S.P0056 — Worker Management', vi: 'LAB211 · J1.S.P0056 — Quản lý công nhân', total: 13, w: 1280, h: 720 });

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
<div class="callout"><p><strong>Coming next in this section:</strong> P0070 (TPBank login with captcha and two languages), P0071 (Task Management without a service), P0073 (Handy Expense with a file) — the same checklist, each one from a real review.</p></div>`,
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
<div class="callout"><p><strong>Sắp có trong phần này:</strong> P0070 (đăng nhập TPBank có captcha và hai ngôn ngữ), P0071 (Task Management không có service), P0073 (Handy Expense có lưu tệp) — cùng tờ checklist, bài nào cũng từ một lần review thật.</p></div>`),
  ].join('\n'),
};

export default {
  lessons: [L_l211_review, L_l211_p0011, L_l211_p0021, L_l211_p0056],
};
