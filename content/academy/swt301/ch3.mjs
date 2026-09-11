/**
 * SWT301 · Chapter 3 — Static testing.
 * Source: SWT3_tim.pptx (106 visible slides; hidden pptx slide 75 is
 * summarised in text in lesson 3.3) + teacher's speaker notes.
 * Lesson split follows the deck's own CONTENTS slides (2, 3, 21, 94) and the
 * section-title slides inside "Review Process" (22, 24, 40, 54, 82, 92):
 *   3.1 Static testing & the test process   slides 1–20
 *   3.2 Review process, roles & duties      slides 21–53
 *   3.3 Review types, techniques & success  slides 54–93 (+ hidden pptx 75)
 *   3.4 Static analysis by tools            slides 94–106
 *   3.5 The older 2023 deck SWT3.ppt (deck 'oswt3', 43 pages): only the pages
 *       the current lessons do not teach; the rest are listed in a table.
 * Answers to every "Question" slide were worked out against the ISTQB CTFL
 * 2018 syllabus (v3.1) wording, which these slides follow. Every calculation
 * and code output in the worked examples was run (javac/java 21, node).
 * Lab 1 (code review & static analysis) lives in its own module.
 */
import { walk, walkHead, books, bi, ansEn as AE, ansVi as AV } from './_slides.mjs';

const D = 'swt3';

/* ──────────────────── 3.1 Static testing & the test process ──────────────────── */
const L31 = {
  title: '3.1 — Static testing: what it examines, its value, static vs dynamic|||3.1 — Kiểm thử tĩnh: xem xét gì, giá trị, tĩnh vs động',
  slug: 'swt301-static-testing-basics',
  type: 'VIDEO',
  description: 'SWT3 slide 1–20: định nghĩa static testing & static analysis, sản phẩm nào review được, testware, lợi ích và chi phí review (1×→100×), static vs dynamic, 8 loại defect tìm bằng kiểm thử tĩnh — kèm đáp án 6 câu hỏi trên slide.',
  content: [
    bi(`<span class="eyebrow">Chapter 3 · Lesson 3.1 · SWT3 slides 1–20</span>
<h2>Static testing and the test process</h2>
<p class="lead">Chapter 1 told you testing has two halves. This chapter is the half most students forget: <strong>static testing</strong> — finding defects in work products <em>without executing</em> anything.</p>
<p class="nhan">This first lesson answers four questions</p>
<ol>
<li>What exactly is static testing (and static analysis)?</li>
<li>Which work products can it examine?</li>
<li>Why is it worth the effort — and what does it cost?</li>
<li>How does it differ from dynamic testing?</li>
</ol>
<div class="callout"><p><strong>Learning objectives.</strong></p>
<ul>
<li><strong>LO-3.1.1</strong> — Recognise types of software work product that can be examined by the different static testing techniques (K1).</li>
<li><strong>LO-3.1.2</strong> — Use examples to describe the value of static testing (K2).</li>
<li><strong>LO-3.1.3</strong> — Explain the difference between static and dynamic techniques, considering objectives, types of defects to be identified, and the role of these techniques within the software lifecycle (K2).</li>
</ul>
<p>Chapter 3 carries <strong>5 of the 40</strong> questions in the ISTQB exam (SWT0 slide 7).</p></div>
<h3>The essentials in one screen</h3>
<table>
<thead><tr><th>Idea</th><th>What you must be able to say</th></tr></thead>
<tbody>
<tr><td>Static testing</td><td>Testing a work product <em>without code being executed</em>. Two families: <strong>reviews</strong> (people read) and <strong>static analysis</strong> (tools parse).</td></tr>
<tr><td>What it examines</td><td>Almost anything written: specifications, epics/user stories/acceptance criteria, code, testware, user guides, web pages, contracts/plans/budgets, models.</td></tr>
<tr><td>Why it pays</td><td>Early feedback + low rework cost. Finds defects dynamic testing struggles to reach; prevents defects; improves communication.</td></tr>
<tr><td>Static vs dynamic</td><td>Same objectives (assess quality, find defects early). Static finds <em>defects</em> directly; dynamic shows <em>failures</em> and then someone must investigate to find the defect.</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 3 · Bài 3.1 · SWT3 slide 1–20</span>
<h2>Kiểm thử tĩnh và quy trình kiểm thử</h2>
<p class="lead">Chương 1 đã nói kiểm thử có hai nửa. Chương này là nửa mà sinh viên hay quên nhất: <strong>kiểm thử tĩnh (static testing)</strong> — tìm defect trong sản phẩm công việc <em>mà không chạy</em> gì cả.</p>
<p class="nhan">Bài đầu tiên trả lời bốn câu hỏi</p>
<ol>
<li>Static testing (và static analysis) chính xác là gì?</li>
<li>Những sản phẩm nào có thể xem xét tĩnh?</li>
<li>Vì sao đáng bỏ công — và tốn bao nhiêu?</li>
<li>Nó khác kiểm thử động ở điểm nào?</li>
</ol>
<div class="callout"><p><strong>Chuẩn đầu ra.</strong></p>
<ul>
<li><strong>LO-3.1.1</strong> — Nhận diện các loại sản phẩm công việc có thể xem xét bằng các kỹ thuật kiểm thử tĩnh (K1).</li>
<li><strong>LO-3.1.2</strong> — Dùng ví dụ để mô tả giá trị của kiểm thử tĩnh (K2).</li>
<li><strong>LO-3.1.3</strong> — Giải thích khác biệt giữa kỹ thuật tĩnh và động xét theo mục tiêu, loại defect tìm được và vai trò trong vòng đời (K2).</li>
</ul>
<p>Chương 3 chiếm <strong>5/40</strong> câu trong đề ISTQB (SWT0 slide 7).</p></div>
<h3>Cốt lõi trong một màn hình</h3>
<table>
<thead><tr><th>Ý chính</th><th>Bạn phải nói được</th></tr></thead>
<tbody>
<tr><td>Static testing</td><td>Kiểm thử một sản phẩm công việc <em>mà không thực thi code</em>. Hai nhánh: <strong>review</strong> (con người đọc) và <strong>static analysis</strong> (công cụ phân tích).</td></tr>
<tr><td>Xem xét được gì</td><td>Gần như mọi thứ viết ra: đặc tả, epic/user story/acceptance criteria, code, testware, hướng dẫn sử dụng, trang web, hợp đồng/kế hoạch/ngân sách, mô hình.</td></tr>
<tr><td>Vì sao đáng làm</td><td>Phản hồi sớm + chi phí sửa thấp. Tìm được defect mà kiểm thử động khó chạm tới; ngăn defect; cải thiện giao tiếp.</td></tr>
<tr><td>Tĩnh vs động</td><td>Cùng mục tiêu (đánh giá chất lượng, tìm defect sớm). Tĩnh tìm thẳng ra <em>defect</em>; động làm lộ <em>failure</em> rồi phải điều tra mới ra defect.</td></tr>
</tbody>
</table>`),
    walkHead(D, 1, 20),
    walk(D, [
      [1, 'Static Techniques (cover)',
        `<p class="y-chinh">🎯 Chapter 3 of the six-box course map: <strong>static testing</strong>.</p>
<ul>
<li><strong>The map</strong> — 1 Principles · 2 Lifecycle · <strong>3 Static testing</strong> (highlighted) · 4 Test techniques · 5 Management · 6 Tools; the same map opens every deck of the course.</li>
<li><strong>Two names, one topic</strong> — the big title says <em>Static Techniques</em>, the older syllabus name (CTFL 2011) of what CTFL 2018 calls <em>Static Testing</em>. Same content; the exam uses "static testing".</li>
</ul>`,
        `<p class="y-chinh">🎯 Chương 3 trên sơ đồ 6 ô của cả môn: <strong>kiểm thử tĩnh</strong>.</p>
<ul>
<li><strong>Sơ đồ</strong> — 1 Nguyên tắc · 2 Vòng đời · <strong>3 Kiểm thử tĩnh</strong> (được tô) · 4 Kỹ thuật test · 5 Quản lý · 6 Công cụ; bộ slide nào của môn cũng mở đầu bằng sơ đồ này.</li>
<li><strong>Hai tên, một nội dung</strong> — tiêu đề lớn ghi <em>Static Techniques</em>, tên cũ trong syllabus CTFL 2011 của thứ mà CTFL 2018 gọi là <em>Static Testing</em>. Cùng nội dung; đề thi dùng chữ "static testing".</li>
</ul>`],
      [2, 'CONTENTS',
        `<p class="y-chinh">🎯 The deck has three blocks.</p>
<ol>
<li><strong>Static techniques &amp; test process</strong> — slides 3–20, this lesson.</li>
<li><strong>Review process</strong> — slides 21–93, the biggest block; on this site split into lessons 3.2 and 3.3.</li>
<li><strong>Static analysis</strong> — slides 94–106, lesson 3.4.</li>
</ol>`,
        `<p class="y-chinh">🎯 Bộ slide có ba khối.</p>
<ol>
<li><strong>Kỹ thuật tĩnh &amp; quy trình test</strong> — slide 3–20, bài này.</li>
<li><strong>Quy trình review</strong> — slide 21–93, khối lớn nhất; trên trang này tách thành bài 3.2 và 3.3.</li>
<li><strong>Phân tích tĩnh</strong> — slide 94–106, bài 3.4.</li>
</ol>`],
      [3, 'CONTENTS — Static techniques & test process',
        `<p class="y-chinh">🎯 First block (highlighted): place static testing inside the test process of Chapter 1.</p>
<p>Its job is also to show why static testing is worth doing <em>before</em> any code runs.</p>`,
        `<p class="y-chinh">🎯 Khối đầu tiên (được tô sáng): đặt kiểm thử tĩnh vào quy trình test đã học ở Chương 1.</p>
<p>Nhiệm vụ của nó còn là cho thấy vì sao nên làm kiểm thử tĩnh <em>trước khi</em> có code chạy.</p>`],
      [4, 'Static Testing — the family tree',
        `<p class="y-chinh">🎯 Software testing has two halves — static and dynamic — and static testing has two families of its own.</p>
<p class="nhan">The family tree</p>
<ul>
<li><strong>Software testing</strong> → <strong>static testing</strong> and <strong>dynamic testing</strong>.</li>
<li><strong>Static testing</strong> → <strong>reviews</strong> and <strong>static analysis</strong>.</li>
</ul>
<p class="nhan">The teacher's picture</p>
<ul>
<li><strong>Static</strong> — judging a new phone by its weight, design and spec sheet (RAM, camera megapixels): you never switch it on.</li>
<li><strong>Dynamic</strong> — needs <em>inputs</em> and produces <em>outputs</em>: you must run the software.</li>
</ul>`,
        `<p class="y-chinh">🎯 Kiểm thử phần mềm có hai nửa — tĩnh và động — và bản thân kiểm thử tĩnh lại có hai nhánh.</p>
<p class="nhan">Cây phân loại</p>
<ul>
<li><strong>Kiểm thử phần mềm</strong> → <strong>kiểm thử tĩnh</strong> và <strong>kiểm thử động</strong>.</li>
<li><strong>Kiểm thử tĩnh</strong> → <strong>review</strong> và <strong>phân tích tĩnh (static analysis)</strong>.</li>
</ul>
<p class="nhan">Hình ảnh trong ghi chú của thầy/cô</p>
<ul>
<li><strong>Tĩnh</strong> — đánh giá một chiếc điện thoại mới qua cân nặng, thiết kế, bảng thông số (RAM, số megapixel camera): bạn không hề bật máy.</li>
<li><strong>Động</strong> — cần <em>đầu vào</em> và sinh <em>đầu ra</em>: phải chạy phần mềm.</li>
</ul>`],
      [5, 'Static Testing — three glossary definitions',
        `<p class="y-chinh">🎯 Three glossary terms: static analysis is part of static testing, which is the opposite of dynamic testing.</p>
<ul>
<li><strong>Static analysis</strong> — the process of evaluating a component or system <em>without executing it</em>, based on its form, structure, content or documentation. "Tool-driven evaluation", most often of code (coding standards, complexity thresholds…).</li>
<li><strong>Static testing</strong> — testing a work product without code being executed. <em>Broader</em> than automated evaluation, because reviews are included.</li>
<li><strong>Dynamic testing</strong> (greyed out, for contrast) — testing that involves executing the software.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> <em>static analysis ⊂ static testing</em>; "tool" → analysis, "people" → review.</p>`,
        `<p class="y-chinh">🎯 Ba thuật ngữ trong glossary: phân tích tĩnh là một phần của kiểm thử tĩnh, còn kiểm thử tĩnh đối lập với kiểm thử động.</p>
<ul>
<li><strong>Static analysis (phân tích tĩnh)</strong> — quá trình đánh giá một thành phần/hệ thống <em>không thực thi nó</em>, dựa trên hình thức, cấu trúc, nội dung hoặc tài liệu. "Đánh giá do công cụ dẫn dắt", thường áp cho code (chuẩn code, ngưỡng độ phức tạp…).</li>
<li><strong>Static testing (kiểm thử tĩnh)</strong> — kiểm thử một sản phẩm mà không thực thi code. <em>Rộng hơn</em> đánh giá tự động, vì bao gồm cả review.</li>
<li><strong>Dynamic testing</strong> (in mờ để đối chiếu) — kiểm thử có thực thi phần mềm.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> <em>static analysis ⊂ static testing</em>; "công cụ" → analysis, "con người" → review.</p>`],
      [6, 'Work Products Examined by Static Testing',
        `<p class="y-chinh">🎯 Almost any work product can be examined statically — learn this list (LO-3.1.1, a K1 "recognise" objective).</p>
<ol>
<li><strong>Specifications</strong> of any type — business, functional, security requirements.</li>
<li><strong>Epics, user stories, acceptance criteria</strong></li>
<li><strong>Code</strong></li>
<li><strong>Testware</strong> — test plans, cases, procedures, scripts (slide 7).</li>
<li><strong>User guides, help text, wizards</strong></li>
<li><strong>Web pages</strong></li>
<li><strong>Contracts, project plans, schedules, budgets</strong></li>
<li><strong>Models</strong> — activity diagrams, state models…; these can even be checked by model-based tools.</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> anything a human can <em>read and understand</em> can be reviewed; static <em>analysis</em> needs a formal structure a tool can parse (code, models, HTML).</p>`,
        `<p class="y-chinh">🎯 Gần như mọi sản phẩm đều kiểm tĩnh được — hãy thuộc danh sách này (LO-3.1.1, mức K1 "nhận diện").</p>
<ol>
<li><strong>Đặc tả</strong> mọi loại — yêu cầu nghiệp vụ, chức năng, bảo mật.</li>
<li><strong>Epic, user story, acceptance criteria</strong></li>
<li><strong>Code</strong></li>
<li><strong>Testware</strong> — test plan, test case, procedure, script (slide 7).</li>
<li><strong>Hướng dẫn sử dụng, help text, wizard</strong></li>
<li><strong>Trang web</strong></li>
<li><strong>Hợp đồng, kế hoạch dự án, lịch, ngân sách</strong></li>
<li><strong>Mô hình</strong> — activity diagram, state model…; có thể kiểm bằng công cụ model-based.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> thứ gì con người <em>đọc và hiểu</em> được thì review được; còn <em>phân tích</em> tĩnh cần cấu trúc hình thức để công cụ phân tích (code, mô hình, HTML).</p>`],
      [7, 'Test Work Products — Testware',
        `<p class="y-chinh">🎯 "Testware" (slide 6) means every work product of the test process — and all of it can be reviewed.</p>
<p class="nhan">Activity → its work products</p>
<ul>
<li><strong>Test planning</strong> — test plans.</li>
<li><strong>Monitoring &amp; control</strong> — progress / summary reports.</li>
<li><strong>Test analysis</strong> — test conditions.</li>
<li><strong>Test design</strong> — test cases, test data.</li>
<li><strong>Test implementation</strong> — test procedures, test suites, execution schedule.</li>
<li><strong>Test execution</strong> — status of test cases, defect reports.</li>
<li><strong>Test completion</strong> — test summary reports, change requests (which may or may not be part of the summary report).</li>
</ul>
<p>The table maps each activity of Chapter 1's test process to its outputs. All of them can — and should — be reviewed: a wrong expected result in a test case is a defect too.</p>`,
        `<p class="y-chinh">🎯 "Testware" (slide 6) là mọi sản phẩm của quy trình test — và tất cả đều review được.</p>
<p class="nhan">Hoạt động → sản phẩm của nó</p>
<ul>
<li><strong>Test planning</strong> — test plan.</li>
<li><strong>Monitoring &amp; control</strong> — báo cáo tiến độ / tổng kết.</li>
<li><strong>Test analysis</strong> — test condition.</li>
<li><strong>Test design</strong> — test case, test data.</li>
<li><strong>Test implementation</strong> — test procedure, test suite, lịch thực thi.</li>
<li><strong>Test execution</strong> — trạng thái test case, defect report.</li>
<li><strong>Test completion</strong> — báo cáo tổng kết, change request (có thể nằm hoặc không nằm trong báo cáo tổng kết).</li>
</ul>
<p>Bảng nối từng hoạt động của quy trình test Chương 1 với đầu ra của nó. Tất cả đều có thể — và nên — được review: một kết quả mong đợi sai trong test case cũng là defect.</p>`],
      [8, 'Benefits of Static Testing — two major advantages',
        `<p class="y-chinh">🎯 Static testing gives two big wins: early feedback and cheap rework.</p>
<p class="nhan">Two major advantages</p>
<ul>
<li><strong>Early feedback on quality issues</strong></li>
<li><strong>Relatively low rework cost</strong></li>
</ul>
<p class="nhan">The chart — relative cost of fixing a defect (IBM Systems Sciences Institute)</p>
<ul>
<li><strong>1×</strong> — around requirements / design.</li>
<li><strong>6.5×</strong> — during development.</li>
<li><strong>15×</strong> — in testing.</li>
<li><strong>100×</strong> — after release.</li>
</ul>
<p>Same message as SWT1 slide 45 (1-2-4-8-16), just with steeper numbers: the source differs, the direction does not. Static testing is the main way to catch defects at the cheap end of that curve — before code even exists.</p>`,
        `<p class="y-chinh">🎯 Kiểm thử tĩnh mang lại hai cái lợi lớn: phản hồi sớm và làm lại rẻ.</p>
<p class="nhan">Hai ưu điểm chính</p>
<ul>
<li><strong>Phản hồi sớm về vấn đề chất lượng</strong></li>
<li><strong>Chi phí làm lại tương đối thấp</strong></li>
</ul>
<p class="nhan">Biểu đồ — chi phí tương đối để sửa một defect (IBM Systems Sciences Institute)</p>
<ul>
<li><strong>1×</strong> — quanh khâu yêu cầu / thiết kế.</li>
<li><strong>6,5×</strong> — khi phát triển.</li>
<li><strong>15×</strong> — khi test.</li>
<li><strong>100×</strong> — sau phát hành.</li>
</ul>
<p>Cùng thông điệp với SWT1 slide 45 (1-2-4-8-16), chỉ là con số dốc hơn: nguồn khác nhau, chiều hướng thì như nhau. Kiểm thử tĩnh là cách chính để bắt defect ở đầu rẻ của đường cong — trước cả khi có code.</p>`],
      [9, 'Benefits of Static Testing — additional benefits',
        `<p class="y-chinh">🎯 Six more benefits — the key one: static testing finds defects that dynamic testing struggles to find.</p>
<ol>
<li><strong>More efficient detection &amp; correction</strong> — a review points straight at the defect.</li>
<li><strong>Defects that are hard to find by dynamic testing</strong></li>
<li><strong>Prevention</strong> of defects in future design and code.</li>
<li><strong>Increased development productivity</strong></li>
<li><strong>Reduced development and testing cost and time</strong> → reduced total cost of quality over the software's lifetime.</li>
<li><strong>Improved communication</strong> within the team.</li>
</ol>
<p class="nhan">"Hard to find dynamically" — the teacher's examples</p>
<ul>
<li><strong>Missing exception handling</strong> — for a situation that rarely happens.</li>
<li><strong>Buffer overflow</strong> — a static analyser sees that the code never checks the buffer's bounds; dynamic tests only reveal it if some test happens to feed an over-long input in the right environment.</li>
</ul>`,
        `<p class="y-chinh">🎯 Thêm sáu lợi ích — quan trọng nhất: kiểm thử tĩnh tìm được defect mà kiểm thử động khó tìm.</p>
<ol>
<li><strong>Tìm và sửa hiệu quả hơn</strong> — review chỉ thẳng vào defect.</li>
<li><strong>Tìm được defect khó phát hiện bằng kiểm thử động</strong></li>
<li><strong>Ngăn ngừa</strong> defect trong thiết kế và code sau này.</li>
<li><strong>Tăng năng suất phát triển</strong></li>
<li><strong>Giảm chi phí và thời gian phát triển, test</strong> → giảm tổng chi phí chất lượng suốt vòng đời phần mềm.</li>
<li><strong>Cải thiện giao tiếp</strong> trong nhóm.</li>
</ol>
<p class="nhan">"Khó tìm bằng kiểm thử động" — ví dụ trong ghi chú của thầy/cô</p>
<ul>
<li><strong>Thiếu xử lý ngoại lệ</strong> — cho một tình huống hiếm khi xảy ra.</li>
<li><strong>Buffer overflow</strong> — công cụ phân tích tĩnh thấy code không bao giờ kiểm giới hạn bộ đệm; test động chỉ lộ ra nếu tình cờ có test đưa đầu vào quá dài trong đúng môi trường.</li>
</ul>`],
      [10, 'Reviews Are Cost-effective',
        `<p class="y-chinh">🎯 Three classic books say the same thing: reviews cut the defects reaching test by about ten times.</p>
<ul>
<li><strong>Freedman &amp; Weinberg</strong>, <em>Handbook of Walkthroughs, Inspections and Technical Reviews</em> — <strong>10× fewer faults reaching test</strong>; testing cost down 50–80%.</li>
<li><strong>Yourdon</strong>, <em>Structured Walkthroughs</em> — fault reduction by a factor of 10.</li>
<li><strong>Gilb &amp; Graham</strong>, <em>Software Inspection</em> — 25% shorter schedules, 80–95% of faults removed at each stage, 28× lower maintenance cost.</li>
</ul>
<p>The teacher's note sums it up: reviews can cut the number of defects reaching the test phase tenfold.</p>
<p class="ghi-chu">These are figures from mature, well-run programmes — do not quote them as guarantees.</p>`,
        `<p class="y-chinh">🎯 Ba cuốn sách kinh điển cùng nói một điều: review giảm khoảng mười lần số lỗi lọt tới giai đoạn test.</p>
<ul>
<li><strong>Freedman &amp; Weinberg</strong>, <em>Handbook of Walkthroughs, Inspections and Technical Reviews</em> — <strong>số lỗi lọt tới test giảm 10 lần</strong>; chi phí test giảm 50–80%.</li>
<li><strong>Yourdon</strong>, <em>Structured Walkthroughs</em> — lỗi giảm 10 lần.</li>
<li><strong>Gilb &amp; Graham</strong>, <em>Software Inspection</em> — lịch rút ngắn 25%, loại 80–95% lỗi ở mỗi giai đoạn, chi phí bảo trì giảm 28 lần.</li>
</ul>
<p>Ghi chú của thầy/cô tóm lại: review có thể giảm tới 10 lần số lỗi đến giai đoạn kiểm thử.</p>
<p class="ghi-chu">Đây là số liệu từ các chương trình review trưởng thành, làm bài bản — đừng trích như một sự bảo đảm.</p>`],
      [11, 'Costs of Reviews',
        `<p class="y-chinh">🎯 Reviews are not free: roughly <strong>5–15% of development effort</strong>.</p>
<p>Rule of thumb: "half a day a week is 10%" — 4 h of a 40-h week.</p>
<p class="nhan">Where the effort goes</p>
<ol>
<li><strong>Planning</strong> — by the leader / moderator.</li>
<li><strong>Preparation</strong> — self-study checking.</li>
<li><strong>The meeting</strong></li>
<li><strong>Fixing, editing, follow-up</strong></li>
<li><strong>Recording and analysing</strong> statistics / metrics.</li>
<li><strong>Process improvement</strong> — the one teams skip ("should!").</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> put slides 10 and 11 together — you spend about a tenth of the effort to avoid rework that would cost many times more.</p>`,
        `<p class="y-chinh">🎯 Review không miễn phí: khoảng <strong>5–15% công sức phát triển</strong>.</p>
<p>Quy tắc nhanh: "nửa ngày mỗi tuần là 10%" — 4 giờ trên tuần 40 giờ.</p>
<p class="nhan">Công sức dành cho</p>
<ol>
<li><strong>Lập kế hoạch</strong> — do leader / moderator.</li>
<li><strong>Chuẩn bị</strong> — tự đọc kiểm tra.</li>
<li><strong>Cuộc họp</strong></li>
<li><strong>Sửa, biên tập, theo dõi</strong></li>
<li><strong>Ghi nhận và phân tích</strong> số liệu / metric.</li>
<li><strong>Cải tiến quy trình</strong> — việc các nhóm hay bỏ ("nên làm!").</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> ghép slide 10 và 11 — bỏ ra khoảng một phần mười công sức để tránh phần làm lại tốn gấp nhiều lần.</p>`],
      [12, 'Static vs Dynamic Testing',
        `<p class="y-chinh">🎯 Static and dynamic testing share a goal but find different things — they are <em>complementary</em>.</p>
<p class="nhan">Four statements — each a possible exam option</p>
<ol>
<li><strong>Similar objectives</strong> — assess the quality of work products and identify defects as early as possible.</li>
<li><strong>Dynamic testing can start early</strong> (test analysis and design from the requirements), but its <strong>execution can only be applied to software code</strong>.</li>
<li><strong>Static testing finds defects rather than failures</strong> — only dynamic testing can show failures.</li>
<li><strong>Static testing finds the defect directly</strong>; dynamic testing <strong>has to investigate</strong> the failure (debugging) to find the defect.</li>
</ol>
<p class="nhan">Who is good at what</p>
<ul>
<li><strong>Static</strong> — maintainability defects, specification gaps, security patterns.</li>
<li><strong>Dynamic</strong> — needed for performance, run-time behaviour, integration with a real environment.</li>
</ul>`,
        `<p class="y-chinh">🎯 Kiểm thử tĩnh và động chung mục tiêu nhưng tìm ra những thứ khác nhau — chúng <em>bổ sung</em> cho nhau.</p>
<p class="nhan">Bốn câu — câu nào cũng có thể thành phương án trong đề</p>
<ol>
<li><strong>Mục tiêu tương tự</strong> — đánh giá chất lượng sản phẩm và tìm defect càng sớm càng tốt.</li>
<li><strong>Kiểm thử động có thể bắt đầu sớm</strong> (phân tích, thiết kế test từ yêu cầu), nhưng <strong>việc thực thi chỉ áp được cho code</strong>.</li>
<li><strong>Kiểm thử tĩnh tìm defect chứ không tìm failure</strong> — chỉ kiểm thử động mới làm lộ failure.</li>
<li><strong>Kiểm thử tĩnh tìm defect trực tiếp</strong>; kiểm thử động <strong>phải điều tra</strong> failure (debugging) mới ra defect.</li>
</ol>
<p class="nhan">Loại nào mạnh ở đâu</p>
<ul>
<li><strong>Tĩnh</strong> — defect về bảo trì, lỗ hổng đặc tả, mẫu mã không an toàn.</li>
<li><strong>Động</strong> — cần cho hiệu năng, hành vi lúc chạy, tích hợp với môi trường thật.</li>
</ul>`],
      [13, 'Types of Defects Found by Static Testing',
        `<p class="y-chinh">🎯 Static testing finds eight categories of defect — from requirement ambiguities to code smells.</p>
<ol>
<li><strong>Requirement defects</strong> — inconsistencies, ambiguities, contradictions, omissions, inaccuracies, redundancies.</li>
<li><strong>Design defects</strong> — inefficient algorithms or DB structures, high coupling, low cohesion.</li>
<li><strong>Coding defects</strong> — variables with undefined values, variables declared but never used, unreachable code, duplicate code.</li>
<li><strong>Deviations from standards</strong> — e.g. not following the coding standard.</li>
<li><strong>Incorrect interface specifications</strong> — e.g. caller and callee use different units.</li>
<li><strong>Security vulnerabilities</strong> — buffer overflow, SQL injection.</li>
<li><strong>Gaps or inaccuracies in traceability / coverage</strong> — e.g. a requirement with no acceptance test.</li>
<li><strong>Maintainability defects</strong> — poor reusability, <em>code smells</em>.</li>
</ol>
<p class="nhan">Code smells — from the teacher's notes</p>
<p>Not syntax or logic errors, but signs of design weakness that make code hard to maintain, extend and reuse.</p>
<ul>
<li><strong>Duplicated code</strong> — the same code repeated in several places.</li>
<li><strong>Long method</strong> — too long to read and reuse.</li>
<li><strong>Large class</strong> — too many methods and too much state.</li>
<li><strong>Feature envy</strong> — a method uses another class's data more than its own.</li>
<li><strong>Shotgun surgery</strong> — one small change forces edits in many places.</li>
<li><strong>Lazy class</strong> — a class that contributes almost nothing.</li>
<li><strong>Primitive obsession</strong> — primitive types used where proper classes belong.</li>
</ul>`,
        `<p class="y-chinh">🎯 Kiểm thử tĩnh tìm được tám nhóm defect — từ yêu cầu mơ hồ tới code smell.</p>
<ol>
<li><strong>Defect yêu cầu</strong> — không nhất quán, mơ hồ, mâu thuẫn, thiếu, không chính xác, thừa.</li>
<li><strong>Defect thiết kế</strong> — thuật toán hay cấu trúc CSDL kém hiệu quả, coupling cao, cohesion thấp.</li>
<li><strong>Defect code</strong> — biến chưa có giá trị, biến khai báo mà không dùng, code không tới được, code trùng lặp.</li>
<li><strong>Lệch chuẩn</strong> — vd không theo coding standard.</li>
<li><strong>Đặc tả giao diện sai</strong> — vd bên gọi và bên được gọi dùng khác đơn vị.</li>
<li><strong>Lỗ hổng bảo mật</strong> — buffer overflow, SQL injection.</li>
<li><strong>Thiếu hoặc sai truy vết / độ phủ</strong> — vd một yêu cầu không có acceptance test nào.</li>
<li><strong>Defect về khả năng bảo trì</strong> — khó tái sử dụng, <em>code smell</em>.</li>
</ol>
<p class="nhan">Code smell — theo ghi chú của thầy/cô</p>
<p>Không phải lỗi cú pháp hay lỗi logic, mà là dấu hiệu thiết kế yếu làm code khó bảo trì, mở rộng và tái sử dụng.</p>
<ul>
<li><strong>Duplicated code</strong> — cùng một đoạn code lặp ở nhiều nơi.</li>
<li><strong>Long method</strong> — phương thức quá dài, khó đọc và khó tái sử dụng.</li>
<li><strong>Large class</strong> — lớp có quá nhiều phương thức và trạng thái.</li>
<li><strong>Feature envy</strong> — hàm "thèm" dữ liệu của lớp khác hơn dữ liệu của chính lớp mình.</li>
<li><strong>Shotgun surgery</strong> — sửa một chỗ nhỏ phải đụng nhiều nơi.</li>
<li><strong>Lazy class</strong> — lớp gần như không đóng góp gì (lớp thừa).</li>
<li><strong>Primitive obsession</strong> — lạm dụng kiểu nguyên thuỷ thay cho lớp phù hợp.</li>
</ul>`],
      [14, 'Other Objectives of Static Testing',
        `<p class="y-chinh">🎯 Besides finding defects, reviews serve four "softer" goals.</p>
<ol>
<li><strong>Educational</strong> — juniors learn from seniors' comments, and vice versa.</li>
<li><strong>Mutual understanding</strong> — everyone leaves with the same picture of the product.</li>
<li><strong>Decision-making facilitation</strong> — e.g. a technical review choosing between two designs.</li>
<li><strong>Agreed commitment</strong> — consensus: people own what they reviewed.</li>
</ol>
<p class="ghi-chu">You will meet these again as the "possible further purposes" of each review type in lesson 3.3.</p>`,
        `<p class="y-chinh">🎯 Ngoài tìm defect, review còn phục vụ bốn mục tiêu "mềm".</p>
<ol>
<li><strong>Giáo dục</strong> — người mới học từ góp ý của người giỏi, và ngược lại.</li>
<li><strong>Hiểu nhau</strong> — ai cũng ra về với cùng một hình dung về sản phẩm.</li>
<li><strong>Hỗ trợ ra quyết định</strong> — vd một technical review chọn giữa hai thiết kế.</li>
<li><strong>Cam kết chung</strong> — đồng thuận: người đã review thì cùng chịu trách nhiệm.</li>
</ol>
<p class="ghi-chu">Bạn sẽ gặp lại chúng dưới dạng "mục đích bổ sung" của từng loại review ở bài 3.3.</p>`],
      [15, 'Question — TWO statements about static testing',
        `<p class="y-chinh">🎯 Static testing is a cheap way to remove defects and to validate requirements early.</p>
<p class="nhan">Option by option</p>
<ul>
<li><strong>A — true</strong>: finding and fixing a defect in a document is cheap (slides 8, 10).</li>
<li><strong>B — false</strong>: dynamic testing is not made "less challenging".</li>
<li><strong>C — true</strong>: reviewing requirements with users and testers validates them early — before anything is built.</li>
<li><strong>D — false</strong>: static testing finds <em>defects</em>, not run-time problems — run-time behaviour needs execution.</li>
<li><strong>E — false and dangerous</strong>: safety-critical standards (DO-178C, ISO 26262) <em>require</em> reviews and static analysis precisely because they find defects dynamic testing misses.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: A and C.</strong> Cheap defect removal + early validation of user requirements.</p>
<p class="ghi-chu">This is an official ISTQB sample-exam question.</p>`,
        `<p class="y-chinh">🎯 Kiểm thử tĩnh là cách rẻ để gỡ defect và validate yêu cầu từ sớm.</p>
<p class="nhan">Xét từng phương án</p>
<ul>
<li><strong>A — đúng</strong>: tìm và sửa defect ngay trong tài liệu thì rẻ (slide 8, 10).</li>
<li><strong>B — sai</strong>: kiểm thử động không vì thế mà "bớt thách thức".</li>
<li><strong>C — đúng</strong>: review yêu cầu cùng người dùng và tester là validate yêu cầu từ sớm — trước khi xây gì.</li>
<li><strong>D — sai</strong>: kiểm thử tĩnh tìm <em>defect</em>, không tìm vấn đề lúc chạy — hành vi runtime phải chạy mới thấy.</li>
<li><strong>E — sai và nguy hiểm</strong>: các chuẩn an toàn (DO-178C, ISO 26262) <em>bắt buộc</em> review và phân tích tĩnh chính vì chúng tìm được defect mà kiểm thử động bỏ sót.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: A và C.</strong> Gỡ defect rẻ + validate yêu cầu người dùng từ sớm.</p>
<p class="ghi-chu">Đây là câu trong đề mẫu chính thức của ISTQB.</p>`],
      [16, 'Question — correct definition of a review',
        `<p class="y-chinh">🎯 A review is <em>mostly manual</em> and applies to any work product, to find defects.</p>
<ul>
<li><strong>A and C</strong> — "automated activity" describes static <em>analysis</em>, not a review.</li>
<li><strong>D</strong> — fails on "prove there is no defect": Principle 1 — testing, static or dynamic, can never prove absence of defects.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: B.</strong> Review is mostly a manual activity on work products like requirements, code and design, to find defects in them.</p>`,
        `<p class="y-chinh">🎯 Review <em>chủ yếu làm thủ công</em> và áp cho mọi sản phẩm, để tìm defect.</p>
<ul>
<li><strong>A và C</strong> — "hoạt động tự động" là mô tả <em>phân tích</em> tĩnh, không phải review.</li>
<li><strong>D</strong> — sai ở "chứng minh không có defect": Nguyên tắc 1 — kiểm thử tĩnh hay động đều không chứng minh được không còn defect.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: B.</strong> Review chủ yếu là hoạt động thủ công trên các sản phẩm như yêu cầu, code, thiết kế, để tìm defect trong đó.</p>`],
      [17, 'Question — reviews vs static analysis',
        `<p class="y-chinh">🎯 Reviews = people examine; static analysis = tools examine.</p>
<ul>
<li><strong>A and D</strong> — merge the two or swap them.</li>
<li><strong>B</strong> — tempting, because review <em>support</em> tools exist (e.g. for logging comments); but the examination in a review is done by people — tools only help manage it.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: C.</strong> Reviews rely on the <em>manual</em> examination of work products; static analysis is <em>tool-driven</em>.</p>`,
        `<p class="y-chinh">🎯 Review = con người xem xét; phân tích tĩnh = công cụ xem xét.</p>
<ul>
<li><strong>A và D</strong> — gộp hai thứ làm một, hoặc đảo ngược chúng.</li>
<li><strong>B</strong> — dễ gây nhầm vì có công cụ <em>hỗ trợ</em> review (vd ghi nhận comment); nhưng việc xem xét trong review do con người làm — công cụ chỉ giúp quản lý.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: C.</strong> Review dựa vào việc <em>con người</em> xem xét sản phẩm; phân tích tĩnh do <em>công cụ</em> dẫn dắt.</p>`],
      [18, 'Question — cost of a defect found in requirements',
        `<p class="y-chinh">🎯 The earlier a defect is found, the cheaper it is to fix.</p>
<ul>
<li><strong>The numbers</strong> — 1× in requirements/design vs up to 100× in production (slide 8).</li>
<li><strong>Why it matters</strong> — this is the economic core of static testing and of Principle 3 (early testing).</li>
</ul>
<p class="dap-an">✅ <strong>Answer: B — less than.</strong> A defect found in requirements or design costs <em>less</em> than the same defect found in production.</p>`,
        `<p class="y-chinh">🎯 Defect tìm ra càng sớm thì sửa càng rẻ.</p>
<ul>
<li><strong>Con số</strong> — 1× ở yêu cầu/thiết kế so với tới 100× trên production (slide 8).</li>
<li><strong>Vì sao quan trọng</strong> — đây là cốt lõi kinh tế của kiểm thử tĩnh và của Nguyên tắc 3 (kiểm thử sớm).</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: B — ít hơn (less than).</strong> Defect tìm ở yêu cầu hoặc thiết kế tốn <em>ít hơn</em> cùng defect đó tìm trên production.</p>`],
      [19, 'Question — which is a form of static testing?',
        `<p class="y-chinh">🎯 Reading code without running it is static.</p>
<ul>
<li><strong>A — error guessing</strong>: an experience-based <em>test-design</em> technique for dynamic tests (Chapter 4).</li>
<li><strong>B — automated regression testing</strong>: runs the code.</li>
<li><strong>C — inputs → outputs</strong>: the very definition of dynamic testing.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: D — Code review.</strong></p>`,
        `<p class="y-chinh">🎯 Đọc code mà không chạy là tĩnh.</p>
<ul>
<li><strong>A — error guessing</strong>: kỹ thuật <em>thiết kế test</em> dựa kinh nghiệm cho kiểm thử động (Chương 4).</li>
<li><strong>B — regression tự động</strong>: chạy code.</li>
<li><strong>C — đưa đầu vào → xem đầu ra</strong>: chính là định nghĩa kiểm thử động.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: D — Review code.</strong></p>`],
      [20, 'Question — a benefit of static analysis',
        `<p class="y-chinh">🎯 Static analysis catches defects that dynamic tests may never trigger.</p>
<ul>
<li><strong>B — right</strong>: exactly slide 9 — buffer overflow, unreachable code, a variable used before it is defined.</li>
<li><strong>A</strong> — irrelevant: static analysis does not reduce documentation.</li>
<li><strong>C</strong> — self-contradictory: static analysis does not execute code.</li>
<li><strong>D</strong> — wrong twice: static analysis <em>is</em> tool-based, and reviews do not replace tools.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: B — Defects can be identified that might not be caught by dynamic testing.</strong></p>`,
        `<p class="y-chinh">🎯 Phân tích tĩnh bắt được defect mà test động có thể không bao giờ kích hoạt.</p>
<ul>
<li><strong>B — đúng</strong>: đúng như slide 9 — buffer overflow, code không tới được, biến dùng trước khi được gán.</li>
<li><strong>A</strong> — không liên quan: phân tích tĩnh không làm giảm tài liệu.</li>
<li><strong>C</strong> — tự mâu thuẫn: phân tích tĩnh không chạy code.</li>
<li><strong>D</strong> — sai hai lần: phân tích tĩnh <em>chính là</em> dùng công cụ, và review không thay được công cụ.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: B — Tìm được defect mà kiểm thử động có thể bỏ sót.</strong></p>`],
    ]),
    bi(`<h3>Ví dụ có lời giải · Worked example — static or dynamic, and what does "late" cost?</h3>
<p><strong>Situation.</strong> A team builds an online-course checkout. Six defects were eventually found. For each: could static testing have found it, and by which family? Then price one of them with slide 8's multipliers.</p>
<table>
<thead><tr><th>#</th><th>Defect</th><th>Best found by</th><th>Why</th></tr></thead>
<tbody>
<tr><td>1</td><td>US-12 says "students get a discount" but never says how much.</td><td>Static — review of the user story</td><td>Requirement omission; no code needed to see it.</td></tr>
<tr><td>2</td><td>SRS §3 says passwords ≥ 8 characters, §7 says ≥ 6.</td><td>Static — review</td><td>Contradiction between two parts of one document.</td></tr>
<tr><td>3</td><td>A method reads <code>total</code> before assigning it on one path.</td><td>Static — static analysis (the compiler/linter)</td><td>Data-flow fault, visible from the code structure (lesson 3.4).</td></tr>
<tr><td>4</td><td>Payment page takes 9 s with 300 concurrent users.</td><td>Dynamic — performance testing</td><td>Depends on the running system and environment.</td></tr>
<tr><td>5</td><td>SQL built by string concatenation of a user field.</td><td>Static — static analysis (security rule) or code review</td><td>An injection pattern is recognisable in the source.</td></tr>
<tr><td>6</td><td>The test case for refunds expects the wrong amount.</td><td>Static — review of testware</td><td>Testware is a work product too (slide 7).</td></tr>
</tbody>
</table>
<p><strong>Pricing defect 1.</strong> Suppose fixing it at the design stage takes 2 hours (the "1×" unit). Using slide 8: during development 6.5 × 2 = <strong>13 h</strong>; found in system testing 15 × 2 = <strong>30 h</strong>; found by customers after release 100 × 2 = <strong>200 h</strong> (rewrite, retest, redeploy, apologise). A 30-minute review of the story would have cost almost nothing by comparison — and slide 11 says reviews take only about 5–15% of effort.</p>
<div class="pitfall co-tieu-de"><p><strong>Exam traps.</strong></p>
<ol>
<li><strong>"Static testing finds failures"</strong> — false: it finds <em>defects</em>; failures only appear when software runs.</li>
<li><strong>"Static testing can only be applied to code"</strong> — false: any readable work product can be reviewed; only static <em>analysis</em> needs a parsable structure.</li>
<li><strong>"Dynamic testing cannot start early"</strong> — false: its design can start as soon as the test basis exists; only <em>execution</em> needs code.</li>
</ol></div>
<div class="callout"><p><span class="badge">★ Beyond the syllabus</span> <strong>Where inspections came from.</strong></p>
<p>Formal software inspection was invented by <strong>Michael Fagan at IBM</strong> and published in 1976 ("Design and code inspections to reduce errors in program development", <em>IBM Systems Journal</em>).</p>
<p>Fagan borrowed the idea from hardware manufacturing quality control:</p>
<ul>
<li><strong>Defined roles</strong> — moderator, reader, author, tester.</li>
<li><strong>Fixed entry and exit criteria</strong></li>
<li><strong>Checking rates</strong></li>
<li><strong>Measurement</strong> of every inspection — crucially — so the process itself could be improved.</li>
</ul>
<p>Tom Gilb and Dorothy Graham's 1993 book <em>Software Inspection</em> (quoted on slide 10) refined it; the CTFL review process of lesson 3.2 is its descendant.</p>
<p class="ghi-chu"><em>Outside the syllabus because CTFL teaches the review process without its history.</em></p></div>`,
    `<h3>Ví dụ có lời giải · Tĩnh hay động, và "muộn" thì tốn bao nhiêu?</h3>
<p><strong>Tình huống.</strong> Một nhóm xây trang thanh toán khoá học online. Cuối cùng tìm ra sáu defect. Với mỗi defect: kiểm thử tĩnh có tìm được không, bằng nhánh nào? Sau đó tính giá một defect bằng hệ số ở slide 8.</p>
<table>
<thead><tr><th>#</th><th>Defect</th><th>Tìm tốt nhất bằng</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>1</td><td>US-12 ghi "sinh viên được giảm giá" mà không nói giảm bao nhiêu.</td><td>Tĩnh — review user story</td><td>Thiếu yêu cầu; không cần code cũng thấy.</td></tr>
<tr><td>2</td><td>SRS §3 ghi mật khẩu ≥ 8 ký tự, §7 ghi ≥ 6.</td><td>Tĩnh — review</td><td>Mâu thuẫn giữa hai phần của một tài liệu.</td></tr>
<tr><td>3</td><td>Một phương thức đọc <code>total</code> trước khi gán trên một nhánh.</td><td>Tĩnh — phân tích tĩnh (compiler/linter)</td><td>Lỗi luồng dữ liệu, thấy được từ cấu trúc code (bài 3.4).</td></tr>
<tr><td>4</td><td>Trang thanh toán mất 9 giây khi có 300 người dùng đồng thời.</td><td>Động — kiểm thử hiệu năng</td><td>Phụ thuộc hệ thống đang chạy và môi trường.</td></tr>
<tr><td>5</td><td>Câu SQL ghép chuỗi trực tiếp từ ô người dùng nhập.</td><td>Tĩnh — phân tích tĩnh (luật bảo mật) hoặc review code</td><td>Mẫu injection nhận ra được ngay trong mã nguồn.</td></tr>
<tr><td>6</td><td>Test case hoàn tiền mong đợi sai số tiền.</td><td>Tĩnh — review testware</td><td>Testware cũng là sản phẩm công việc (slide 7).</td></tr>
</tbody>
</table>
<p><strong>Tính giá defect 1.</strong> Giả sử sửa ở khâu thiết kế mất 2 giờ (đơn vị "1×"). Theo slide 8: khi đang phát triển 6,5 × 2 = <strong>13 giờ</strong>; tìm ở system test 15 × 2 = <strong>30 giờ</strong>; khách hàng phát hiện sau phát hành 100 × 2 = <strong>200 giờ</strong> (viết lại, test lại, triển khai lại, xin lỗi khách). So ra, 30 phút review user story gần như không tốn gì — và slide 11 nói review chỉ chiếm khoảng 5–15% công sức.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy đề thi.</strong></p>
<ol>
<li><strong>"Kiểm thử tĩnh tìm failure"</strong> — sai: nó tìm <em>defect</em>; failure chỉ xuất hiện khi phần mềm chạy.</li>
<li><strong>"Kiểm thử tĩnh chỉ áp được cho code"</strong> — sai: mọi sản phẩm đọc được đều review được; chỉ <em>phân tích</em> tĩnh mới cần cấu trúc để công cụ đọc.</li>
<li><strong>"Kiểm thử động không thể bắt đầu sớm"</strong> — sai: thiết kế test làm được ngay khi có test basis; chỉ <em>thực thi</em> mới cần code.</li>
</ol></div>
<div class="callout"><p><span class="badge">★ Ngoài giáo trình</span> <strong>Inspection ra đời từ đâu.</strong></p>
<p>Inspection phần mềm chính quy do <strong>Michael Fagan ở IBM</strong> sáng tạo và công bố năm 1976 ("Design and code inspections to reduce errors in program development", <em>IBM Systems Journal</em>).</p>
<p>Fagan mượn ý tưởng từ kiểm soát chất lượng trong sản xuất phần cứng:</p>
<ul>
<li><strong>Vai trò xác định</strong> — moderator, reader, author, tester.</li>
<li><strong>Entry/exit criteria cố định</strong></li>
<li><strong>Tốc độ kiểm tra</strong></li>
<li><strong>Đo đạc</strong> mọi buổi inspection — quan trọng nhất — để cải tiến chính quy trình.</li>
</ul>
<p>Cuốn <em>Software Inspection</em> (1993) của Tom Gilb và Dorothy Graham (được trích ở slide 10) hoàn thiện nó; quy trình review trong CTFL ở bài 3.2 là hậu duệ trực tiếp.</p>
<p class="ghi-chu"><em>Ngoài giáo trình vì CTFL dạy quy trình review mà không nói lịch sử của nó.</em></p></div>`),
    books([
      ['fst4', 'Ch.3 §1 "Static techniques and the test process" — book pp.75–78 (PDF 89–92)', 'Chương 3 §1 "Static techniques and the test process" — trang sách 75–78 (PDF 89–92)'],
      ['fst', '§3.1 "Static techniques and the test process" — pp.57–58 (PDF ≈60–61)', '§3.1 "Static techniques and the test process" — trang 57–58 (PDF ≈60–61)'],
      ['sp5', '§4.1 What can we analyze and test? (PDF 130), §4.2 Static test techniques (PDF 131), §4.6 Differences between static and dynamic testing (PDF 153)', '§4.1 What can we analyze and test? (PDF 130), §4.2 Static test techniques (PDF 131), §4.6 Khác biệt giữa kiểm thử tĩnh và động (PDF 153)'],
      ['sp4', 'Ch.4 "Static Test", §4.1 structured group evaluations — pp.79–82 (PDF 94–97)', 'Chương 4 "Static Test", §4.1 structured group evaluations — trang 79–82 (PDF 94–97)'],
    ]),
  ].join('\n'),
};

/* ─────────────────── 3.2 Review process, roles & responsibilities ─────────────────── */
const L32 = {
  title: '3.2 — The review process: five activities, roles & responsibilities|||3.2 — Quy trình review: năm hoạt động, vai trò & trách nhiệm',
  slug: 'swt301-static-reviews',
  type: 'VIDEO',
  description: 'SWT3 slide 21–53: định nghĩa review, formal vs informal, 5 hoạt động (Planning → Initiate → Individual review → Issue communication & analysis → Fixing & reporting), entry/exit criteria, checking rate, severity, 6 vai trò — kèm đáp án 14 câu hỏi trên slide.',
  content: [
    bi(`<span class="eyebrow">Chapter 3 · Lesson 3.2 · SWT3 slides 21–53</span>
<h2>The review process and who does what</h2>
<p class="lead">A review is not "a meeting where people comment on a document". In the ISTQB model it is a <strong>process of five activities</strong>, each with defined tasks, run by people in <strong>six roles</strong>. Exam questions in this area are almost always of one shape: <em>"activity X happens in which step?"</em> or <em>"who is responsible for Y?"</em>. This lesson gives you the exact mapping.</p>
<div class="callout"><p><strong>Learning objectives.</strong></p>
<ul>
<li><strong>LO-3.2.1</strong> — Summarise the activities of the work product review process (K2).</li>
<li><strong>LO-3.2.2</strong> — Recognise the different roles and responsibilities in a formal review (K1).</li>
</ul></div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1 Planning</div><div class="lz-t">scope, effort, type, roles</div><div class="lz-d">entry &amp; exit criteria; entry check</div></div>
  <div class="lz-step"><div class="lz-k">2 Initiate review</div><div class="lz-t">kick-off</div><div class="lz-d">distribute, explain, answer questions</div></div>
  <div class="lz-step"><div class="lz-k">3 Individual review</div><div class="lz-t">individual preparation</div><div class="lz-d">note defects, recommendations, questions</div></div>
  <div class="lz-step"><div class="lz-k">4 Issue communication &amp; analysis</div><div class="lz-t">log, discuss, decide</div><div class="lz-d">evaluate findings vs exit criteria</div></div>
  <div class="lz-step"><div class="lz-k">5 Fixing &amp; reporting</div><div class="lz-t">rework, metrics</div><div class="lz-d">check exit criteria; accept</div></div>
</div>
<table>
<thead><tr><th>Role</th><th>One-line responsibility</th></tr></thead>
<tbody>
<tr><td>Author</td><td>creates the work product and fixes its defects</td></tr>
<tr><td>Management</td><td>decides reviews happen; staff, budget, time; monitors cost-effectiveness; control decisions</td></tr>
<tr><td>Facilitator (moderator)</td><td>runs review meetings effectively; mediates; the person success often depends on</td></tr>
<tr><td>Review leader</td><td>overall responsibility; decides who is involved, when and where</td></tr>
<tr><td>Reviewers</td><td>identify potential defects, from different perspectives</td></tr>
<tr><td>Scribe (recorder)</td><td>collates defects from individual review; records defects, open points, decisions in the meeting</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 3 · Bài 3.2 · SWT3 slide 21–53</span>
<h2>Quy trình review và ai làm gì</h2>
<p class="lead">Review không phải là "một buổi họp để mọi người góp ý tài liệu". Theo mô hình ISTQB, nó là một <strong>quy trình gồm năm hoạt động</strong>, mỗi hoạt động có nhiệm vụ xác định, do những người giữ <strong>sáu vai trò</strong> thực hiện. Câu hỏi thi phần này hầu như chỉ có một dạng: <em>"hoạt động X diễn ra ở bước nào?"</em> hoặc <em>"ai chịu trách nhiệm Y?"</em>. Bài này cho bạn bảng đối chiếu chính xác.</p>
<div class="callout"><p><strong>Chuẩn đầu ra.</strong></p>
<ul>
<li><strong>LO-3.2.1</strong> — Tóm tắt các hoạt động của quy trình review sản phẩm công việc (K2).</li>
<li><strong>LO-3.2.2</strong> — Nhận diện các vai trò và trách nhiệm trong một review chính quy (K1).</li>
</ul></div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1 Planning</div><div class="lz-t">phạm vi, công sức, loại, vai trò</div><div class="lz-d">entry &amp; exit criteria; kiểm entry</div></div>
  <div class="lz-step"><div class="lz-k">2 Initiate review</div><div class="lz-t">kick-off</div><div class="lz-d">phát tài liệu, giải thích, trả lời câu hỏi</div></div>
  <div class="lz-step"><div class="lz-k">3 Individual review</div><div class="lz-t">chuẩn bị cá nhân</div><div class="lz-d">ghi defect, đề xuất, câu hỏi</div></div>
  <div class="lz-step"><div class="lz-k">4 Issue communication &amp; analysis</div><div class="lz-t">ghi nhận, thảo luận, quyết định</div><div class="lz-d">so kết quả với exit criteria</div></div>
  <div class="lz-step"><div class="lz-k">5 Fixing &amp; reporting</div><div class="lz-t">sửa, thu metric</div><div class="lz-d">kiểm exit criteria; chấp nhận</div></div>
</div>
<table>
<thead><tr><th>Vai trò</th><th>Trách nhiệm một dòng</th></tr></thead>
<tbody>
<tr><td>Author (tác giả)</td><td>tạo ra sản phẩm và sửa defect của nó</td></tr>
<tr><td>Management (quản lý)</td><td>quyết định có review; cấp người, ngân sách, thời gian; theo dõi hiệu quả chi phí; ra quyết định kiểm soát</td></tr>
<tr><td>Facilitator (moderator — điều phối)</td><td>điều hành buổi họp review hiệu quả; hoà giải; người mà thành công của review thường phụ thuộc vào</td></tr>
<tr><td>Review leader (trưởng review)</td><td>chịu trách nhiệm tổng thể; quyết định ai tham gia, khi nào, ở đâu</td></tr>
<tr><td>Reviewers (người review)</td><td>tìm defect tiềm năng, từ nhiều góc nhìn</td></tr>
<tr><td>Scribe (thư ký)</td><td>tổng hợp defect từ bước review cá nhân; ghi defect, điểm còn mở, quyết định trong buổi họp</td></tr>
</tbody>
</table>`),
    walkHead(D, 21, 53),
    walk(D, [
      [21, 'CONTENTS — Review Process',
        `<p class="y-chinh">🎯 Second block (highlighted): the review process — the heart of the chapter, slides 21–93.</p>
<ul>
<li><strong>This lesson (3.2)</strong> — the review process and the roles, slides 21–53.</li>
<li><strong>Lesson 3.3</strong> — review types, review techniques and success factors, slides 54–93.</li>
</ul>`,
        `<p class="y-chinh">🎯 Khối thứ hai (được tô): quy trình review — trọng tâm của chương, slide 21–93.</p>
<ul>
<li><strong>Bài này (3.2)</strong> — quy trình review và các vai trò, slide 21–53.</li>
<li><strong>Bài 3.3</strong> — các loại review, kỹ thuật review và yếu tố thành công, slide 54–93.</li>
</ul>`],
      [22, 'Review Process — the four-column map',
        `<p class="y-chinh">🎯 The whole review block on one slide: four columns that match the syllabus sections — learn them as 5 – 6 – 4 – 5.</p>
<ul>
<li><strong>Review process (5)</strong> — Planning · Initiate review · Individual review · Issue comms &amp; analysis · Fixing &amp; reporting.</li>
<li><strong>Roles &amp; responsibilities (6)</strong> — Author · Management · Facilitator · Review leader · Reviewer · Scribe.</li>
<li><strong>Review types (4)</strong> — Informal · Walkthrough · Technical review · Inspection.</li>
<li><strong>Review techniques (5)</strong> — Ad hoc · Checklist-based · Scenario-based &amp; dry runs · Role-based · Perspective-based.</li>
</ul>
<div class="pitfall">Exam distractors often mix items from different columns — e.g. "technical review" offered as a <em>step</em> of the process (slide 33).</div>`,
        `<p class="y-chinh">🎯 Cả khối review trên một slide: bốn cột khớp với các mục của syllabus — nhớ theo số 5 – 6 – 4 – 5.</p>
<ul>
<li><strong>Quy trình review (5)</strong> — Planning · Initiate review · Individual review · Issue comms &amp; analysis · Fixing &amp; reporting.</li>
<li><strong>Vai trò &amp; trách nhiệm (6)</strong> — Author · Management · Facilitator · Review leader · Reviewer · Scribe.</li>
<li><strong>Loại review (4)</strong> — Informal · Walkthrough · Technical review · Inspection.</li>
<li><strong>Kỹ thuật review (5)</strong> — Ad hoc · Checklist-based · Scenario-based &amp; dry run · Role-based · Perspective-based.</li>
</ul>
<div class="pitfall">Phương án gây nhiễu trong đề hay trộn mục của các cột khác nhau — vd đưa "technical review" vào như một <em>bước</em> của quy trình (slide 33).</div>`],
      [23, 'Reviews — definitions',
        `<p class="y-chinh">🎯 A review is static testing done by people; every review sits somewhere between informal and formal.</p>
<ul>
<li><strong>Review</strong> — a type of static testing during which a work product or process is evaluated by one or more individuals to detect issues and to provide improvements.</li>
<li><strong>Informal review</strong> — no formal documented procedure; the <em>most common</em> type.</li>
<li><strong>Formal review</strong> — follows a defined process with a formally documented output.</li>
</ul>
<p class="nhan">How formal? It depends on</p>
<ul>
<li><strong>Maturity</strong> of the development process.</li>
<li><strong>Legal / regulatory requirements</strong></li>
<li><strong>The need for an audit trail</strong> — proof that the review happened, e.g. in medical or avionics software.</li>
</ul>
<p class="ghi-chu">The scale from informal to formal is slide 55's pyramid.</p>`,
        `<p class="y-chinh">🎯 Review là kiểm thử tĩnh do con người làm; mọi review đều nằm đâu đó giữa không chính quy và chính quy.</p>
<ul>
<li><strong>Review</strong> — một loại kiểm thử tĩnh trong đó một sản phẩm công việc hoặc một quy trình được một hay nhiều người đánh giá để phát hiện vấn đề và đề xuất cải tiến.</li>
<li><strong>Informal review</strong> — không có thủ tục được văn bản hoá; loại <em>phổ biến nhất</em>.</li>
<li><strong>Formal review</strong> — theo một quy trình xác định, có đầu ra được văn bản hoá chính thức.</li>
</ul>
<p class="nhan">Chính quy tới đâu? Tuỳ vào</p>
<ul>
<li><strong>Độ trưởng thành</strong> của quy trình phát triển.</li>
<li><strong>Yêu cầu pháp lý / quy định</strong></li>
<li><strong>Nhu cầu audit trail</strong> — bằng chứng review đã diễn ra, vd phần mềm y tế, hàng không.</li>
</ul>
<p class="ghi-chu">Thang từ không chính quy tới chính quy là kim tự tháp ở slide 55.</p>`],
      [24, 'Review Process (section title)',
        `<p class="y-chinh">🎯 Divider: the next seven slides walk through the five activities of the <em>work product review process</em>.</p>
<p>The syllabus describes them for a formal review. Less formal reviews may skip or merge activities — e.g. an informal buddy check has no planning or exit criteria.</p>`,
        `<p class="y-chinh">🎯 Slide chuyển mục: bảy slide tiếp theo đi qua năm hoạt động của <em>quy trình review sản phẩm công việc</em>.</p>
<p>Syllabus mô tả chúng cho review chính quy. Review ít chính quy hơn có thể bỏ bớt hoặc gộp hoạt động — vd buddy check không có planning hay exit criteria.</p>`],
      [25, 'Work Product Review Process — the arrow',
        `<p class="y-chinh">🎯 Five activities, always in this order.</p>
<ol>
<li><strong>Planning</strong></li>
<li><strong>Initiate review</strong></li>
<li><strong>Individual review</strong></li>
<li><strong>Issue communication &amp; analysis</strong></li>
<li><strong>Fixing &amp; reporting</strong></li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> <em>"Plan, Kick off, Read alone, Talk it over, Fix it"</em>.</p>
<p class="nhan">Older names you may still meet</p>
<ul>
<li><strong>"Kick-off"</strong> = initiate review; <strong>"individual preparation"</strong> = individual review (slide 38 uses both).</li>
<li><strong>The fst book (CTFL 2011)</strong> lists six steps — planning, kick-off, preparation, review meeting, rework, follow-up — the same ideas split differently.</li>
</ul>`,
        `<p class="y-chinh">🎯 Năm hoạt động, luôn theo đúng thứ tự này.</p>
<ol>
<li><strong>Planning</strong></li>
<li><strong>Initiate review</strong></li>
<li><strong>Individual review</strong></li>
<li><strong>Issue communication &amp; analysis</strong></li>
<li><strong>Fixing &amp; reporting</strong></li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> <em>"Lên kế hoạch – Khởi động – Đọc một mình – Bàn bạc – Sửa và báo cáo"</em>.</p>
<p class="nhan">Tên cũ còn gặp trong sách</p>
<ul>
<li><strong>"Kick-off"</strong> = initiate review; <strong>"individual preparation"</strong> = individual review (slide 38 dùng cả hai).</li>
<li><strong>Sách fst (CTFL 2011)</strong> ghi sáu bước — planning, kick-off, preparation, review meeting, rework, follow-up — cùng ý tưởng, chỉ chia khác.</li>
</ul>`],
      [26, 'REVIEW PROCESS: Planning',
        `<p class="y-chinh">🎯 Planning decides <em>how</em> the review will be run — six tasks.</p>
<ol>
<li><strong>Define the scope</strong> — purpose, which documents or parts, which quality characteristics.</li>
<li><strong>Estimate effort and timeframe</strong></li>
<li><strong>Identify review characteristics</strong> — review type, roles, activities, checklists.</li>
<li><strong>Select reviewers</strong> and assign <strong>roles</strong>.</li>
<li><strong>Define entry and exit criteria</strong> — for more formal review types.</li>
<li><strong>Check that entry criteria are met</strong> before the review starts.</li>
</ol>
<div class="pitfall">The entry <em>check</em> (task 6) belongs to <em>planning</em>, not to initiation. Anything that decides how the review will be run is planning.</div>`,
        `<p class="y-chinh">🎯 Planning quyết định review <em>sẽ được làm thế nào</em> — sáu nhiệm vụ.</p>
<ol>
<li><strong>Xác định phạm vi</strong> — mục đích, tài liệu hay phần nào, đặc tính chất lượng nào.</li>
<li><strong>Ước lượng công sức và khung thời gian</strong></li>
<li><strong>Xác định đặc điểm của review</strong> — loại review, vai trò, hoạt động, checklist.</li>
<li><strong>Chọn người review</strong> và phân <strong>vai trò</strong>.</li>
<li><strong>Định nghĩa entry và exit criteria</strong> — với loại review chính quy hơn.</li>
<li><strong>Kiểm tra entry criteria đã đạt</strong> trước khi review bắt đầu.</li>
</ol>
<div class="pitfall">Việc <em>kiểm</em> entry (nhiệm vụ 6) thuộc <em>planning</em>, không thuộc initiate. Cái gì quyết định review sẽ được làm thế nào thì là planning.</div>`],
      [27, 'REVIEW PROCESS: Planning (cont.) — entry & exit criteria',
        `<p class="y-chinh">🎯 Entry criteria are the gate to <em>start</em> a review; exit criteria are the goal to <em>finish</em> it.</p>
<p class="nhan">Entry criteria — prerequisites that must be met to start</p>
<ul>
<li><strong>A short check by the review leader</strong> finds not many major defects — otherwise the document goes back; reviewing a bad draft wastes everyone's time.</li>
<li><strong>Line numbers present</strong> — so findings can be located.</li>
<li><strong>Clean-up done</strong> — formatting / syntax trivia already removed.</li>
<li><strong>Related material</strong> stable and available.</li>
<li><strong>The author</strong> is prepared and confident.</li>
</ul>
<p class="nhan">Exit criteria — goals to finish</p>
<ul>
<li><strong>Average critical/major defects per page</strong> below a limit — e.g. <strong>no more than 3 per page</strong>.</li>
<li><strong>All pages checked</strong> at the right rate.</li>
<li><strong>Defects</strong> fixed, deferred, etc.</li>
</ul>
<p class="nhan">More typical exit criteria (teacher's notes)</p>
<ol class="hai-cot"><li>All defects addressed</li><li>Comments incorporated</li><li>Standards followed</li><li>Requirements met</li><li>Findings documented</li><li>Stakeholder approval obtained</li><li>Review metrics captured</li></ol>`,
        `<p class="y-chinh">🎯 Entry criteria là cổng để <em>bắt đầu</em> review; exit criteria là mục tiêu để <em>kết thúc</em> nó.</p>
<p class="nhan">Entry criteria — điều kiện tiên quyết phải đạt để bắt đầu</p>
<ul>
<li><strong>Leader kiểm nhanh</strong> thấy không nhiều defect nặng — nếu nhiều thì trả tài liệu lại; review một bản nháp tồi là phí thời gian của mọi người.</li>
<li><strong>Có đánh số dòng</strong> — để chỉ vị trí lỗi.</li>
<li><strong>Đã dọn dẹp</strong> — các lỗi định dạng / cú pháp vặt đã được sửa.</li>
<li><strong>Tài liệu liên quan</strong> ổn định và sẵn có.</li>
<li><strong>Tác giả</strong> đã sẵn sàng và tự tin.</li>
</ul>
<p class="nhan">Exit criteria — mục tiêu để kết thúc</p>
<ul>
<li><strong>Số defect critical/major trung bình mỗi trang</strong> dưới ngưỡng — vd <strong>không quá 3 mỗi trang</strong>.</li>
<li><strong>Mọi trang đã được kiểm</strong> ở đúng tốc độ.</li>
<li><strong>Defect</strong> đã được sửa, hoãn, v.v.</li>
</ul>
<p class="nhan">Các exit criteria hay gặp khác (ghi chú của thầy/cô)</p>
<ol class="hai-cot"><li>Mọi defect đã được xử lý</li><li>Góp ý đã được đưa vào</li><li>Tuân thủ chuẩn</li><li>Đáp ứng yêu cầu</li><li>Kết quả được ghi lại</li><li>Các bên liên quan đã phê duyệt</li><li>Đã thu thập metric review</li></ol>`],
      [28, 'REVIEW PROCESS: Initiate Review',
        `<p class="y-chinh">🎯 Initiate review: get everyone on the same page before they start reading.</p>
<ol>
<li><strong>Distribute</strong> the work product and related material — physically or electronically, plus issue-log forms, checklists, related documents.</li>
<li><strong>Explain</strong> the scope, objectives, process, roles and work products to the participants.</li>
<li><strong>Answer</strong> any questions.</li>
</ol>
<p class="nhan">The evidence at the bottom of the slide</p>
<p>A recorded <strong>70% increase in major defects found per page</strong> when a kick-off meeting was held — because reviewers who understand the objective look for the right things.</p>`,
        `<p class="y-chinh">🎯 Initiate review: cho mọi người hiểu như nhau trước khi bắt đầu đọc.</p>
<ol>
<li><strong>Phát</strong> sản phẩm cần review và tài liệu liên quan — bản giấy hoặc điện tử, kèm mẫu ghi lỗi, checklist, tài liệu liên quan.</li>
<li><strong>Giải thích</strong> phạm vi, mục tiêu, quy trình, vai trò và sản phẩm cho người tham gia.</li>
<li><strong>Trả lời</strong> mọi câu hỏi.</li>
</ol>
<p class="nhan">Bằng chứng ở cuối slide</p>
<p>Số <strong>defect nặng tìm được mỗi trang tăng 70%</strong> khi có buổi kick-off — vì người review hiểu mục tiêu sẽ tìm đúng thứ cần tìm.</p>`],
      [29, 'REVIEW PROCESS: Individual Review',
        `<p class="y-chinh">🎯 Individual review: each reviewer works <em>alone</em> — this is where most defects are actually found.</p>
<ul>
<li><strong>Review</strong> all or part of the work product.</li>
<li><strong>Note</strong> potential defects, recommendations and questions.</li>
<li><strong>Use checklists</strong> — and the review techniques of lesson 3.3.</li>
<li><strong>Keep to a checking rate</strong> (pages reviewed per hour) — it depends on the type and complexity of the work product, the number of related documents and the reviewer's experience.</li>
</ul>
<p class="nhan">Rough checking rates</p>
<ul>
<li><strong>Less formal reviews</strong> — 5–10 pages/hour.</li>
<li><strong>Inspections</strong> — 1 page/hour.</li>
</ul>
<p>The meeting that follows mainly collects the defects found here.</p>`,
        `<p class="y-chinh">🎯 Individual review: mỗi người review làm <em>một mình</em> — đây là nơi phần lớn defect thực sự được tìm ra.</p>
<ul>
<li><strong>Đọc</strong> toàn bộ hoặc một phần sản phẩm.</li>
<li><strong>Ghi lại</strong> defect tiềm năng, đề xuất và câu hỏi.</li>
<li><strong>Dùng checklist</strong> — và các kỹ thuật review ở bài 3.3.</li>
<li><strong>Giữ đúng tốc độ kiểm tra (checking rate)</strong> — số trang đọc mỗi giờ, tuỳ loại và độ phức tạp của sản phẩm, số tài liệu liên quan và kinh nghiệm người review.</li>
</ul>
<p class="nhan">Tốc độ tham khảo</p>
<ul>
<li><strong>Review ít chính quy</strong> — 5–10 trang/giờ.</li>
<li><strong>Inspection</strong> — 1 trang/giờ.</li>
</ul>
<p>Buổi họp sau đó chủ yếu là để gom các defect tìm được ở bước này.</p>`],
      [30, 'REVIEW PROCESS: Issue Communication & Analysis',
        `<p class="y-chinh">🎯 Issue communication &amp; analysis: log the findings, discuss them, then decide against the exit criteria.</p>
<ol>
<li><strong>Logging</strong> in a review meeting, with <strong>severity levels critical / major / minor</strong> — no real discussion; the aim is to log as many defects as possible. An item that needs discussion is noted as a discussion item and handled later.</li>
<li><strong>Discussion</strong> — in more formal reviews logging and discussion are separate parts; in less formal ones they are mixed. The moderator handles people issues and how discussed items are handled.</li>
<li><strong>Decision making</strong> — evaluate the findings against the exit criteria to make a review decision: reject, accept with major changes, or accept (possibly with minor changes).</li>
</ol>
<p class="ghi-chu">The slide's "decision marking" is a typo for "decision making".</p>
<p class="nhan">Severity classes (teacher's notes)</p>
<ul>
<li><strong>Critical</strong> — will cause downstream damage; the impact reaches beyond the work product under inspection.</li>
<li><strong>Major</strong> — could cause a downstream effect, e.g. a design fault becoming an implementation error.</li>
<li><strong>Minor</strong> — not likely to cause downstream damage, e.g. non-compliance with a standard or template.</li>
</ul>
<p>The reviewer who finds a defect may propose its severity, or the facilitator assigns it. Everyone must share the same meanings — otherwise one reviewer calling everything "critical" skews the results.</p>`,
        `<p class="y-chinh">🎯 Issue communication &amp; analysis: ghi nhận phát hiện, thảo luận, rồi quyết định dựa trên exit criteria.</p>
<ol>
<li><strong>Ghi nhận (logging)</strong> trong buổi họp, kèm <strong>mức nghiêm trọng critical / major / minor</strong> — không thảo luận thật sự; mục tiêu là ghi được càng nhiều defect càng tốt. Mục nào cần bàn thì ghi là mục thảo luận và xử lý sau.</li>
<li><strong>Thảo luận</strong> — review chính quy tách riêng phần ghi nhận và phần thảo luận; review ít chính quy thì trộn lẫn. Moderator xử lý chuyện con người và cách giải quyết các mục được bàn.</li>
<li><strong>Ra quyết định</strong> — so kết quả review với exit criteria để ra quyết định: từ chối, chấp nhận nhưng phải sửa nhiều, hoặc chấp nhận (có thể kèm sửa nhỏ).</li>
</ol>
<p class="ghi-chu">Chữ "decision marking" trên slide là lỗi đánh máy của "decision making".</p>
<p class="nhan">Các mức nghiêm trọng (ghi chú của thầy/cô)</p>
<ul>
<li><strong>Critical</strong> — chắc chắn gây hại về sau; tác động vượt ra ngoài sản phẩm đang review.</li>
<li><strong>Major</strong> — có thể gây ảnh hưởng về sau, vd lỗi thiết kế thành lỗi cài đặt.</li>
<li><strong>Minor</strong> — ít khả năng gây hại, vd không theo chuẩn hoặc mẫu.</li>
</ul>
<p>Người tìm ra defect có thể đề xuất mức nghiêm trọng, hoặc facilitator gán. Mọi người phải hiểu các mức giống nhau — nếu không một người coi gì cũng "critical" sẽ làm lệch kết quả.</p>`],
      [31, 'REVIEW PROCESS: Fixing & Reporting',
        `<p class="y-chinh">🎯 Fixing &amp; reporting: rework, record, measure — and accept the work product once the exit criteria are met.</p>
<ol>
<li><strong>Create defect reports</strong> for findings that need changes.</li>
<li><strong>Fix defects</strong> — typically the author.</li>
<li><strong>Communicate defects</strong> to the appropriate person/team — e.g. a defect found in a related document.</li>
<li><strong>Record the updated status</strong> of defects as they are fixed.</li>
<li><strong>Gather metrics</strong> — more formal types: defects found, fixed, deferred, effort.</li>
<li><strong>Check that exit criteria are met</strong></li>
<li><strong>Accept</strong> the work product when they are.</li>
</ol>
<div class="pitfall">Two tasks mention exit criteria. <em>Evaluating findings against exit criteria to decide</em> is step 4 (issue communication &amp; analysis). <em>Checking exit criteria are met after rework and accepting</em> is step 5 (fixing &amp; reporting).</div>`,
        `<p class="y-chinh">🎯 Fixing &amp; reporting: sửa, ghi nhận, đo — và chấp nhận sản phẩm khi đạt exit criteria.</p>
<ol>
<li><strong>Tạo defect report</strong> cho những phát hiện cần sửa.</li>
<li><strong>Sửa defect</strong> — thường là tác giả.</li>
<li><strong>Thông báo defect</strong> cho đúng người/nhóm — vd defect nằm ở tài liệu liên quan.</li>
<li><strong>Cập nhật trạng thái</strong> defect khi được sửa.</li>
<li><strong>Thu thập metric</strong> — review chính quy: số defect tìm được, đã sửa, hoãn, công sức.</li>
<li><strong>Kiểm tra exit criteria đã đạt</strong></li>
<li><strong>Chấp nhận</strong> sản phẩm khi đạt.</li>
</ol>
<div class="pitfall">Hai việc cùng nhắc tới exit criteria. <em>So kết quả với exit criteria để ra quyết định</em> là bước 4 (issue communication &amp; analysis). <em>Kiểm exit criteria đã đạt sau khi sửa và chấp nhận sản phẩm</em> là bước 5 (fixing &amp; reporting).</div>`],
      [32, 'Question — two categories of review',
        `<p class="y-chinh">🎯 Reviews split into two kinds: formal and informal (slide 23).</p>
<ul>
<li><strong>A — static / dynamic</strong>: nonsense — a review is always static.</li>
<li><strong>B — experience-based / metrics-based</strong>: names of groups of <em>test techniques</em> and estimation (Chapters 4–5), not reviews.</li>
<li><strong>D — official / unofficial</strong>: not ISTQB vocabulary.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: C — formal and informal review.</strong></p>`,
        `<p class="y-chinh">🎯 Review chia làm hai loại: chính quy và không chính quy (slide 23).</p>
<ul>
<li><strong>A — tĩnh / động</strong>: vô nghĩa — review luôn là tĩnh.</li>
<li><strong>B — experience-based / metrics-based</strong>: tên nhóm <em>kỹ thuật test</em> và ước lượng (Chương 4–5), không phải review.</li>
<li><strong>D — chính thức / không chính thức</strong>: không phải thuật ngữ ISTQB.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: C — review chính quy và không chính quy (formal and informal).</strong></p>`],
      [33, 'Question — correct steps of the review process',
        `<p class="y-chinh">🎯 The five steps of slide 25, in order — watch for items borrowed from other columns of slide 22.</p>
<ul>
<li><strong>A</strong> — lists test-process activities (Chapter 1).</li>
<li><strong>B</strong> — mixes a review type (technical review), a technique (checklist-based) and "roles".</li>
<li><strong>D</strong> — inserts "executing" and "technical review".</li>
</ul>
<p class="dap-an">✅ <strong>Answer: C.</strong> Planning, initiate ("initial") review, individual review, issue communication and analysis, fixing and reporting.</p>
<p class="ghi-chu">The slide writes "initial review" — the syllabus term is "initiate review".</p>`,
        `<p class="y-chinh">🎯 Năm bước của slide 25, đúng thứ tự — cảnh giác với mục mượn từ các cột khác của slide 22.</p>
<ul>
<li><strong>A</strong> — là các hoạt động của quy trình test (Chương 1).</li>
<li><strong>B</strong> — trộn một loại review (technical review), một kỹ thuật (checklist-based) và "roles".</li>
<li><strong>D</strong> — chèn "executing" và "technical review".</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: C.</strong> Planning, initiate ("initial") review, individual review, issue communication and analysis, fixing and reporting.</p>
<p class="ghi-chu">Slide ghi "initial review" — thuật ngữ syllabus là "initiate review".</p>`],
      [34, 'Question — what happens in Planning?',
        `<p class="y-chinh">🎯 Scope and effort are decided in Planning (slide 26).</p>
<ul>
<li><strong>A — distributing the work product</strong>: initiate review.</li>
<li><strong>C — noting potential defects</strong>: individual review.</li>
<li><strong>D — logging defects</strong>: issue communication and analysis.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: B — Defining scope &amp; estimating effort.</strong></p>`,
        `<p class="y-chinh">🎯 Phạm vi và công sức được quyết định ở Planning (slide 26).</p>
<ul>
<li><strong>A — phát sản phẩm</strong>: initiate review.</li>
<li><strong>C — ghi defect tiềm năng</strong>: individual review.</li>
<li><strong>D — ghi nhận defect</strong>: issue communication and analysis.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: B — Xác định phạm vi &amp; ước lượng công sức.</strong></p>`],
      [35, 'Question — entry vs exit criteria',
        `<p class="y-chinh">🎯 Entry criteria = prerequisites that <em>must</em> be met to begin; exit criteria = goals to achieve to finish.</p>
<ul>
<li><strong>A</strong> — swaps the two.</li>
<li><strong>B</strong> — says entry criteria "<em>might</em>" be met: a criterion that does not have to be met is not a criterion.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> read every word — B and C differ by one word only.</p>
<p class="dap-an">✅ <strong>Answer: C.</strong> Entry criteria are prerequisites that must be met to begin the review; exit criteria are goals that need to be achieved.</p>`,
        `<p class="y-chinh">🎯 Entry criteria = điều kiện tiên quyết <em>phải</em> đạt để bắt đầu; exit criteria = mục tiêu phải đạt để kết thúc.</p>
<ul>
<li><strong>A</strong> — đảo ngược hai thứ.</li>
<li><strong>B</strong> — ghi entry criteria "<em>có thể</em>" đạt: một tiêu chí không bắt buộc đạt thì không còn là tiêu chí.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> đọc kỹ từng chữ — B và C chỉ khác nhau đúng một từ.</p>
<p class="dap-an">✅ <strong>Đáp án: C.</strong> Entry criteria là điều kiện tiên quyết phải đạt để bắt đầu review; exit criteria là mục tiêu cần đạt.</p>`],
      [36, 'Question — what happens in Initiate review?',
        `<p class="y-chinh">🎯 Initiate review = distribute, explain, answer questions (slide 28).</p>
<ul>
<li><strong>A — evaluating and documenting quality characteristics</strong>: issue communication and analysis.</li>
<li><strong>B — gathering metrics</strong>: fixing and reporting.</li>
<li><strong>D — identifying review characteristics</strong>: planning.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: C — Answering any questions participants may have about the review.</strong></p>`,
        `<p class="y-chinh">🎯 Initiate review = phát tài liệu, giải thích, trả lời câu hỏi (slide 28).</p>
<ul>
<li><strong>A — đánh giá và ghi lại các đặc tính chất lượng</strong>: issue communication and analysis.</li>
<li><strong>B — thu metric</strong>: fixing and reporting.</li>
<li><strong>D — xác định đặc điểm review</strong>: planning.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: C — Trả lời mọi câu hỏi của người tham gia về buổi review.</strong></p>`],
      [37, 'Question — reviewing and noting potential defects',
        `<p class="y-chinh">🎯 Reading the work product and noting defects is what each reviewer does alone.</p>
<ul>
<li><strong>Individual review</strong> — its defining tasks are reviewing all or part of the work product and noting potential defects, recommendations and questions (slide 29).</li>
</ul>
<p class="dap-an">✅ <strong>Answer: B — Individual review.</strong></p>`,
        `<p class="y-chinh">🎯 Đọc sản phẩm và ghi defect là việc mỗi reviewer tự làm một mình.</p>
<ul>
<li><strong>Individual review</strong> — nhiệm vụ đặc trưng là đọc toàn bộ hoặc một phần sản phẩm và ghi defect tiềm năng, đề xuất, câu hỏi (slide 29).</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: B — Individual review.</strong></p>`],
      [38, 'Question — evaluating findings against exit criteria',
        `<p class="y-chinh">🎯 The review <em>decision</em> is made in issue communication &amp; analysis (slide 30).</p>
<ul>
<li><strong>D — issue communication &amp; analysis</strong>: the decision comes after the findings have been communicated and analysed.</li>
<li><strong>A — fixing and reporting</strong>: comes later — it checks the exit criteria after rework and accepts the product.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: D — Issue communication &amp; analysis.</strong></p>`,
        `<p class="y-chinh">🎯 <em>Quyết định</em> review được đưa ra ở issue communication &amp; analysis (slide 30).</p>
<ul>
<li><strong>D — issue communication &amp; analysis</strong>: quyết định đến sau khi các phát hiện đã được trao đổi và phân tích.</li>
<li><strong>A — fixing and reporting</strong>: đến sau đó — nó kiểm exit criteria sau khi sửa và chấp nhận sản phẩm.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: D — Issue communication &amp; analysis.</strong></p>`],
      [39, 'Question — accepting the work product',
        `<p class="y-chinh">🎯 Accepting the work product is the very last task of the whole process.</p>
<ul>
<li><strong>Fixing and reporting</strong> — once rework is done and the exit criteria are reached, the work product is accepted (slide 31).</li>
</ul>
<p class="dap-an">✅ <strong>Answer: C — Fixing and reporting.</strong></p>`,
        `<p class="y-chinh">🎯 Chấp nhận sản phẩm là nhiệm vụ cuối cùng của cả quy trình.</p>
<ul>
<li><strong>Fixing and reporting</strong> — sau khi sửa xong và đạt exit criteria thì sản phẩm được chấp nhận (slide 31).</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: C — Fixing and reporting.</strong></p>`],
      [40, 'Roles & Responsibilities in a Formal Review (section title)',
        `<p class="y-chinh">🎯 Divider: six roles follow.</p>
<ul>
<li><strong>One person, several roles</strong> — common in small reviews.</li>
<li><strong>Limits for the author</strong> — the <em>formal</em> review types (technical review, inspection) restrict which roles the author may take.</li>
</ul>`,
        `<p class="y-chinh">🎯 Slide chuyển mục: tiếp theo là sáu vai trò.</p>
<ul>
<li><strong>Một người, nhiều vai</strong> — thường gặp trong review nhỏ.</li>
<li><strong>Giới hạn cho tác giả</strong> — các loại review <em>chính quy</em> (technical review, inspection) giới hạn những vai trò mà tác giả được giữ.</li>
</ul>`],
      [41, 'Author',
        `<p class="y-chinh">🎯 The author creates the work product under review and fixes its defects (if necessary).</p>
<p class="nhan">Who is the author? (teacher's notes)</p>
<ul>
<li><strong>Test cases</strong> → the tester.</li>
<li><strong>Code</strong> → the developer.</li>
<li><strong>A test plan</strong> → the test leader / manager.</li>
<li><strong>Requirements or an SRS</strong> → the business / system analyst or the product owner.</li>
</ul>
<p>The author's goal is to learn how to improve this and future work products, to clarify unclear areas and to understand the defects found — not to defend the document.</p>`,
        `<p class="y-chinh">🎯 Tác giả tạo ra sản phẩm được review và sửa defect trong đó (nếu cần).</p>
<p class="nhan">Tác giả là ai? (ghi chú của thầy/cô)</p>
<ul>
<li><strong>Test case</strong> → tester.</li>
<li><strong>Code</strong> → developer.</li>
<li><strong>Test plan</strong> → test leader / manager.</li>
<li><strong>Yêu cầu hay SRS</strong> → BA / system analyst hoặc product owner.</li>
</ul>
<p>Mục tiêu của tác giả là học cách cải thiện sản phẩm này và các sản phẩm sau, làm rõ chỗ chưa rõ và hiểu các defect được tìm ra — không phải để bào chữa cho tài liệu.</p>`],
      [42, 'Management',
        `<p class="y-chinh">🎯 Management decides that reviews happen and pays for them — time, people, budget.</p>
<ul>
<li><strong>Review planning</strong> — is responsible for it.</li>
<li><strong>Control decisions</strong> — executes them when outcomes are inadequate.</li>
<li><strong>Decides</strong> on the execution of reviews.</li>
<li><strong>Assigns</strong> staff, budget and time.</li>
<li><strong>Monitors</strong> ongoing cost-effectiveness.</li>
</ul>
<p class="nhan">From the teacher's notes</p>
<ul>
<li><strong>Believe in reviews</strong> — and put time for them, <em>and for the resulting rework</em>, into the schedule.</li>
<li><strong>Arrange review training</strong> requested by the participants.</li>
<li><strong>May take part</strong> as review leader or reviewer when their background helps.</li>
</ul>`,
        `<p class="y-chinh">🎯 Quản lý quyết định có review và chi trả cho nó — thời gian, con người, ngân sách.</p>
<ul>
<li><strong>Lập kế hoạch review</strong> — chịu trách nhiệm việc này.</li>
<li><strong>Quyết định kiểm soát</strong> — đưa ra khi kết quả không đạt.</li>
<li><strong>Quyết định</strong> có thực hiện review hay không.</li>
<li><strong>Cấp</strong> người, ngân sách và thời gian.</li>
<li><strong>Theo dõi</strong> hiệu quả chi phí liên tục.</li>
</ul>
<p class="nhan">Theo ghi chú của thầy/cô</p>
<ul>
<li><strong>Tin vào review</strong> — và đưa thời gian cho review, <em>cùng phần sửa chữa sau đó</em>, vào lịch dự án.</li>
<li><strong>Tổ chức đào tạo review</strong> mà người tham gia yêu cầu.</li>
<li><strong>Có thể tham gia</strong> làm review leader hoặc reviewer nếu chuyên môn phù hợp.</li>
</ul>`],
      [43, 'Facilitator (aka Moderator)',
        `<p class="y-chinh">🎯 The facilitator (moderator) makes the review meeting work — often the person the review's success depends on.</p>
<ul>
<li><strong>Runs meetings effectively</strong> — ensures the effective running of review meetings (when held).</li>
<li><strong>Mediates</strong> — between the various points of view, if necessary.</li>
<li><strong>Key to success</strong> — is often the person upon whom the success of the review depends.</li>
</ul>
<p>The sketch shows a person at the board steering a group in discussion.</p>
<p class="nhan">Classic moderator duties (teacher's notes)</p>
<ol class="hai-cot"><li>Lead each review process</li><li>Do the entry check</li><li>Check the fixes</li><li>Schedule the meeting</li><li>Distribute the material</li><li>Coach team members</li><li>Pace the meeting</li><li>Lead discussions</li><li>Store the data collected</li></ol>
<p class="ghi-chu">Some of these belong to the review leader in the 2018 syllabus — in small organisations it is the same person, as slide 44 says.</p>`,
        `<p class="y-chinh">🎯 Facilitator (moderator) giúp buổi họp review vận hành — thường là người quyết định thành bại của review.</p>
<ul>
<li><strong>Điều hành họp hiệu quả</strong> — đảm bảo buổi họp review diễn ra hiệu quả (khi có họp).</li>
<li><strong>Hoà giải</strong> — giữa các quan điểm khác nhau, khi cần.</li>
<li><strong>Then chốt</strong> — thường là người mà thành công của buổi review phụ thuộc vào.</li>
</ul>
<p>Hình vẽ là một người đứng ở bảng dẫn dắt nhóm thảo luận.</p>
<p class="nhan">Nhiệm vụ kinh điển của moderator (ghi chú của thầy/cô)</p>
<ol class="hai-cot"><li>Dẫn dắt từng quy trình review</li><li>Kiểm entry</li><li>Kiểm phần sửa</li><li>Xếp lịch họp</li><li>Phát tài liệu</li><li>Hướng dẫn thành viên</li><li>Giữ nhịp buổi họp</li><li>Dẫn thảo luận</li><li>Lưu dữ liệu thu được</li></ol>
<p class="ghi-chu">Một số việc này thuộc review leader trong syllabus 2018 — ở tổ chức nhỏ thì là cùng một người, như slide 44 nói.</p>`],
      [44, 'Review Leader',
        `<p class="y-chinh">🎯 The review leader owns the review as a whole; the facilitator runs the meeting.</p>
<ul>
<li><strong>Overall responsibility</strong> — takes it for the review.</li>
<li><strong>Who, when, where</strong> — decides who will be involved and organises when and where it takes place.</li>
<li><strong>Who holds the role</strong> — depending on the size of the organisation, a manager or the facilitator.</li>
</ul>
<p class="nhan">The key distinction (the two bold sub-bullets)</p>
<ul>
<li><strong>Review leader</strong> — responsible for the review <em>happening</em> and organises the people, but may not even attend the meeting.</li>
<li><strong>Facilitator</strong> — deals with the people <em>while</em> the review is happening and makes sure the meetings run well.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> the picture — one person helping another climb to the flag — the leader gets the review to its goal.</p>`,
        `<p class="y-chinh">🎯 Review leader chịu trách nhiệm cả buổi review; facilitator điều hành buổi họp.</p>
<ul>
<li><strong>Trách nhiệm tổng thể</strong> — chịu trách nhiệm cho buổi review.</li>
<li><strong>Ai, khi nào, ở đâu</strong> — quyết định ai tham gia và tổ chức khi nào, ở đâu.</li>
<li><strong>Ai giữ vai này</strong> — tuỳ quy mô tổ chức, có thể là quản lý hoặc facilitator.</li>
</ul>
<p class="nhan">Điểm phân biệt then chốt (hai gạch đầu dòng in đậm)</p>
<ul>
<li><strong>Review leader</strong> — chịu trách nhiệm để review <em>diễn ra</em> và tổ chức con người, nhưng có thể không dự họp.</li>
<li><strong>Facilitator</strong> — làm việc với con người <em>trong lúc</em> review diễn ra và đảm bảo buổi họp suôn sẻ.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> hình vẽ — một người kéo người kia leo tới lá cờ — leader đưa review tới đích.</p>`],
      [45, 'Reviewers',
        `<p class="y-chinh">🎯 Reviewers find the potential defects — ideally from different perspectives.</p>
<ul>
<li><strong>Who</strong> — subject-matter experts, people working on the project, stakeholders with an interest in the work product, and/or people with specific technical or business backgrounds.</li>
<li><strong>What they do</strong> — identify potential defects in the work product under review.</li>
<li><strong>Perspectives</strong> — may represent different ones: tester, developer, user, operator, business analyst, usability expert…</li>
</ul>
<p class="nhan">Expertise that makes reviewers effective (teacher's note)</p>
<ol class="hai-cot"><li>System analysis</li><li>The programming language</li><li>Testing</li><li>The application domain (e.g. medical regulations)</li><li>Users' needs</li><li>Security</li></ol>`,
        `<p class="y-chinh">🎯 Reviewer tìm defect tiềm năng — lý tưởng là từ nhiều góc nhìn khác nhau.</p>
<ul>
<li><strong>Là ai</strong> — chuyên gia lĩnh vực, người trong dự án, các bên có quan tâm tới sản phẩm, và/hoặc người có nền tảng kỹ thuật hay nghiệp vụ riêng.</li>
<li><strong>Làm gì</strong> — tìm defect tiềm năng trong sản phẩm được review.</li>
<li><strong>Góc nhìn</strong> — có thể đại diện cho nhiều góc nhìn: tester, developer, người dùng, vận hành, BA, chuyên gia usability…</li>
</ul>
<p class="nhan">Chuyên môn giúp reviewer hiệu quả (ghi chú của thầy/cô)</p>
<ol class="hai-cot"><li>Phân tích hệ thống</li><li>Ngôn ngữ lập trình</li><li>Kiểm thử</li><li>Lĩnh vực ứng dụng (vd quy định y tế)</li><li>Nhu cầu người dùng</li><li>Bảo mật</li></ol>`],
      [46, 'Scribe (or recorder)',
        `<p class="y-chinh">🎯 The scribe turns everyone's findings into one record.</p>
<ul>
<li><strong>Collates</strong> potential defects found during the individual review activity.</li>
<li><strong>Records</strong> new potential defects, open points and decisions from the review meeting (when held).</li>
<li><strong>Who</strong> — can be the author or someone else, e.g. the facilitator.</li>
<li><strong>How</strong> — can be done electronically: a shared issue log or review tool replaces the notebook in the picture.</li>
</ul>
<div class="pitfall">"Can be the author" has limits (lesson 3.3): in a technical review the scribe should not be the author, and in an inspection the author <em>cannot</em> be the scribe.</div>`,
        `<p class="y-chinh">🎯 Scribe gom phát hiện của mọi người thành một bản ghi.</p>
<ul>
<li><strong>Tổng hợp</strong> defect tiềm năng tìm được ở bước review cá nhân.</li>
<li><strong>Ghi lại</strong> defect mới, các điểm còn mở và quyết định trong buổi họp (khi có).</li>
<li><strong>Ai làm</strong> — có thể là tác giả hoặc người khác, vd facilitator.</li>
<li><strong>Làm thế nào</strong> — có thể làm điện tử: một bảng ghi lỗi dùng chung hoặc công cụ review thay cho cuốn sổ trong hình.</li>
</ul>
<div class="pitfall">"Có thể là tác giả" có giới hạn (bài 3.3): trong technical review scribe không nên là tác giả, còn trong inspection tác giả <em>không được</em> làm scribe.</div>`],
      [47, 'Question — who creates the work product?',
        `<p class="y-chinh">🎯 The author is, by definition, the one who creates the work product (slide 41).</p>
<ul>
<li><strong>Reviewer</strong> — finds defects.</li>
<li><strong>Manager</strong> — allocates resources.</li>
<li><strong>Facilitator</strong> — runs the meeting.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: C — Author.</strong></p>`,
        `<p class="y-chinh">🎯 Theo định nghĩa, tác giả là người tạo ra sản phẩm (slide 41).</p>
<ul>
<li><strong>Reviewer</strong> — tìm defect.</li>
<li><strong>Manager</strong> — cấp nguồn lực.</li>
<li><strong>Facilitator</strong> — điều hành buổi họp.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: C — Author (tác giả).</strong></p>`],
      [48, 'Question — author when reviewing mobile-app code',
        `<p class="y-chinh">🎯 The author is whoever created the work product under review — code is written by developers (notes of slide 41).</p>
<ul>
<li><strong>Tester</strong> — would be the author of test cases.</li>
<li><strong>Product owner</strong> — the author of user stories.</li>
<li><strong>Scrum master</strong> — authors neither.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: B — The Developer.</strong></p>`,
        `<p class="y-chinh">🎯 Tác giả là người tạo ra sản phẩm đang review — code do developer viết (ghi chú slide 41).</p>
<ul>
<li><strong>Tester</strong> — là tác giả của test case.</li>
<li><strong>Product owner</strong> — là tác giả của user story.</li>
<li><strong>Scrum master</strong> — không là tác giả của cả hai.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: B — Developer.</strong></p>`],
      [49, 'Question — planning, staff and budget, cost-effectiveness',
        `<p class="y-chinh">🎯 Planning, staff, budget and cost-effectiveness — word for word from slide 42.</p>
<ul>
<li><strong>B — the facilitator</strong>: runs meetings but does not assign budget.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: D — the manager.</strong></p>`,
        `<p class="y-chinh">🎯 Lập kế hoạch, cấp người, ngân sách và theo dõi hiệu quả chi phí — đúng từng chữ ở slide 42.</p>
<ul>
<li><strong>B — facilitator</strong>: điều hành họp nhưng không phân bổ ngân sách.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: D — manager (quản lý).</strong></p>`],
      [50, 'Question — running the meeting effectively',
        `<p class="y-chinh">🎯 Running the meeting effectively is the facilitator's job (slide 43).</p>
<ul>
<li><strong>B — the facilitator</strong>: ensures the effective running of review meetings and mediates.</li>
<li><strong>C — the manager</strong>: decides that reviews happen, not how meetings are run.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: B — the facilitator.</strong></p>`,
        `<p class="y-chinh">🎯 Điều hành buổi họp hiệu quả là việc của facilitator (slide 43).</p>
<ul>
<li><strong>B — facilitator</strong>: đảm bảo buổi họp review hiệu quả và hoà giải.</li>
<li><strong>C — manager</strong>: quyết định có review, không điều hành buổi họp.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: B — facilitator.</strong></p>`],
      [51, 'Question — overall responsibility for the review',
        `<p class="y-chinh">🎯 Overall responsibility for the review belongs to the review leader (slide 44).</p>
<ul>
<li><strong>The trap is C</strong> — the moderator (= facilitator) runs the meeting; the review leader owns the review as a whole.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: D — The review leader.</strong></p>`,
        `<p class="y-chinh">🎯 Trách nhiệm tổng thể của buổi review thuộc về review leader (slide 44).</p>
<ul>
<li><strong>Bẫy là C</strong> — moderator (= facilitator) điều hành buổi họp; còn review leader chịu trách nhiệm cả buổi review.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: D — Review leader.</strong></p>`],
      [52, 'Question — collating defects from individual review',
        `<p class="y-chinh">🎯 Collating defects from individual review is the scribe's first duty (slide 46).</p>
<ul>
<li><strong>Reviewers</strong> — find the defects individually.</li>
<li><strong>Scribe</strong> — collates them into one list (and records the meeting).</li>
</ul>
<p class="dap-an">✅ <strong>Answer: B — the scribe.</strong></p>`,
        `<p class="y-chinh">🎯 Tổng hợp defect từ bước review cá nhân là nhiệm vụ đầu tiên của scribe (slide 46).</p>
<ul>
<li><strong>Reviewer</strong> — tự tìm defect.</li>
<li><strong>Scribe</strong> — gom chúng thành một danh sách (và ghi biên bản buổi họp).</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: B — scribe (thư ký).</strong></p>`],
      [53, 'SUMMER 2023 PT1 — SWT301_PT1_SUMMER23_2984632',
        `<p class="y-chinh">🎯 A marker slide, not content: in Summer 2023 the class stopped here to take <strong>Progress Test 1</strong>.</p>
<ul>
<li><strong>The string</strong> — SWT301_PT1_SUMMER23_2984632 is the code of that test session.</li>
<li><strong>Scope of PT1</strong> — Chapters 1–2 plus Chapter 3 up to the review process and roles.</li>
<li><strong>Practice on this site</strong> — the <em>Progress Test 1</em> section; slides 32–52 of this lesson are typical of its questions.</li>
</ul>`,
        `<p class="y-chinh">🎯 Slide đánh dấu, không phải nội dung: ở kỳ Summer 2023 lớp dừng tại đây để làm <strong>Progress Test 1</strong>.</p>
<ul>
<li><strong>Chuỗi ký tự</strong> — SWT301_PT1_SUMMER23_2984632 là mã của buổi kiểm tra đó.</li>
<li><strong>Phạm vi PT1</strong> — Chương 1–2 cộng Chương 3 tới hết quy trình review và vai trò.</li>
<li><strong>Luyện trên trang này</strong> — mục <em>Progress Test 1</em>; các slide 32–52 của bài này chính là dạng câu hỏi hay gặp trong đó.</li>
</ul>`],
    ]),
    bi(`<h3>Ví dụ có lời giải · Worked example — plan and decide a formal review of an SRS</h3>
<p><strong>Situation.</strong> The 30-page SRS of a hospital appointment system must be reviewed before design starts. Management gives three reviewers two hours each for individual review. Exit criterion: <em>no more than 3 critical/major defects per page on average</em>.</p>
<ol>
<li><strong>Planning (review leader + management).</strong>
<ul>
<li><strong>Scope</strong> — §2–§5 (functional requirements) and the security chapter.</li>
<li><strong>Type, option 1: a less formal review</strong> — at 5–10 pages/h each reviewer covers 10–20 pages in 2 h, i.e. the whole document between the three of them.</li>
<li><strong>Type, option 2: an inspection</strong> — at the optimum 1 page/h each reviewer checks only <strong>2 pages</strong>: 3 × 2 = 6 page-readings. Because the rate matters, the leader chooses this and picks the 4 riskiest pages (booking rules, cancellation, payments, patient data) as a <em>sample</em>: two pages get two readers, the other two get one (2 + 2 + 1 + 1 = 6).</li>
<li><strong>Roles</strong> — author = the business analyst; facilitator = a trained QA engineer; scribe = the facilitator (never the author in an inspection); reviewers = a doctor (domain), a tester, a developer.</li>
<li><strong>Entry check</strong> — the leader reads one page and finds only one major issue → entry criterion met.</li>
</ul></li>
<li><strong>Initiate review (facilitator).</strong> 20-minute kick-off: hand out the SRS with line numbers, the checklist and the issue log; explain that the tester should try to write acceptance tests from each rule; answer questions.</li>
<li><strong>Individual review (each reviewer).</strong> Two hours, 1 page/h, noting potential defects, recommendations and questions in the log.</li>
<li><strong>Issue communication &amp; analysis (meeting, facilitator + scribe).</strong> Logging only, then discussion. Critical/major defects per sampled page: p.4 = 5, p.7 = 2, p.9 = 4, p.12 = 3 → total 14 over 4 pages = <strong>3.5 per page &gt; 3</strong>. Decision: exit criterion <em>not</em> met → "major changes needed, re-inspect".</li>
<li><strong>Fixing &amp; reporting (author, leader).</strong> The author fixes all 14 plus every defect <em>of the same types</em> elsewhere in the document (the sample showed what kinds of defects exist); status updated in the log; metrics recorded (14 major+ on 4 pages, 6 reviewer-hours). A re-inspection of the same pages finds 1 major per page → exit criterion met → SRS accepted.</li>
</ol>
<div class="pitfall co-tieu-de"><p><strong>The mapping traps — activity → step.</strong></p>
<ul>
<li><strong>Planning</strong> — "identifying review characteristics", "defining entry/exit criteria", "checking entry criteria".</li>
<li><strong>Initiate</strong> — "distributing", "explaining", "answering questions".</li>
<li><strong>Individual review</strong> — "noting potential defects".</li>
<li><strong>Issue communication &amp; analysis</strong> — "logging", "evaluating quality characteristics", "evaluating findings against exit criteria to decide".</li>
<li><strong>Fixing &amp; reporting</strong> — "defect reports", "gathering metrics", "checking exit criteria are met", "accepting".</li>
</ul>
<p>And the roles: review leader = owns the review; facilitator = runs the meeting; manager = decides and funds.</p></div>
<div class="callout"><p><span class="badge">★ Beyond the syllabus</span> <strong>Modern code review = the pull request.</strong></p>
<p>Today most reviews happen as PR reviews on GitHub/GitLab: the author opens a pull request, CI runs static analysis and tests automatically, reviewers comment inline, and the change merges only after approval.</p>
<p>Mapped onto this lesson:</p>
<ul>
<li><strong>Initiate review</strong> — opening the PR with a description.</li>
<li><strong>Individual review + issue communication</strong> — inline comments, merged together (a less formal style, slide 30).</li>
<li><strong>Review decision</strong> — "approve / request changes".</li>
<li><strong>Fixing &amp; reporting</strong> — pushing fixes and re-requesting review.</li>
</ul>
<p>Studies at Microsoft and Google found that the biggest pay-off of such reviews is not defect-finding but knowledge sharing and keeping the codebase consistent — the "other objectives" of slide 14.</p>
<p class="ghi-chu"><em>Outside the syllabus because CTFL describes the generic process, not any tool's workflow.</em></p></div>`,
    `<h3>Ví dụ có lời giải · Lập kế hoạch và ra quyết định cho một review chính quy SRS</h3>
<p><strong>Tình huống.</strong> SRS 30 trang của hệ thống đặt lịch khám bệnh viện phải được review trước khi bắt đầu thiết kế. Quản lý cấp cho ba reviewer mỗi người hai giờ để review cá nhân. Exit criterion: <em>trung bình không quá 3 defect critical/major mỗi trang</em>.</p>
<ol>
<li><strong>Planning (review leader + quản lý).</strong>
<ul>
<li><strong>Phạm vi</strong> — §2–§5 (yêu cầu chức năng) và chương bảo mật.</li>
<li><strong>Loại review, phương án 1: review ít chính quy</strong> — với 5–10 trang/giờ mỗi người đọc được 10–20 trang trong 2 giờ, tức ba người phủ hết tài liệu.</li>
<li><strong>Loại review, phương án 2: inspection</strong> — ở tốc độ tối ưu 1 trang/giờ mỗi người chỉ kiểm được <strong>2 trang</strong>: 3 × 2 = 6 lượt đọc trang. Vì tốc độ đọc quyết định tất cả, leader chọn phương án này và lấy 4 trang rủi ro nhất (luật đặt lịch, huỷ lịch, thanh toán, dữ liệu bệnh nhân) làm <em>mẫu</em>: hai trang có hai người đọc, hai trang còn lại một người (2 + 2 + 1 + 1 = 6).</li>
<li><strong>Vai trò</strong> — tác giả = BA; facilitator = một QA đã được đào tạo; scribe = facilitator (trong inspection tác giả không bao giờ làm scribe); reviewer = một bác sĩ (nghiệp vụ), một tester, một developer.</li>
<li><strong>Kiểm entry</strong> — leader đọc thử một trang, chỉ thấy một lỗi major → đạt entry criterion.</li>
</ul></li>
<li><strong>Initiate review (facilitator).</strong> Kick-off 20 phút: phát SRS có đánh số dòng, checklist và bảng ghi lỗi; dặn tester thử viết acceptance test từ mỗi luật; trả lời câu hỏi.</li>
<li><strong>Individual review (từng reviewer).</strong> Hai giờ, 1 trang/giờ, ghi defect tiềm năng, đề xuất và câu hỏi vào bảng.</li>
<li><strong>Issue communication &amp; analysis (buổi họp, facilitator + scribe).</strong> Chỉ ghi nhận, sau đó mới thảo luận. Số defect critical/major trên các trang mẫu: tr.4 = 5, tr.7 = 2, tr.9 = 4, tr.12 = 3 → tổng 14 trên 4 trang = <strong>3,5 mỗi trang &gt; 3</strong>. Quyết định: <em>không</em> đạt exit criterion → "cần sửa nhiều, inspect lại".</li>
<li><strong>Fixing &amp; reporting (tác giả, leader).</strong> Tác giả sửa cả 14 lỗi và mọi lỗi <em>cùng loại</em> ở phần còn lại của tài liệu (mẫu đã cho thấy có những loại lỗi nào); cập nhật trạng thái trong bảng; ghi metric (14 lỗi major+ trên 4 trang, 6 giờ-người). Inspect lại đúng các trang đó còn 1 lỗi major mỗi trang → đạt exit criterion → chấp nhận SRS.</li>
</ol>
<div class="pitfall co-tieu-de"><p><strong>Bẫy ghép hoạt động → bước.</strong></p>
<ul>
<li><strong>Planning</strong> — "xác định đặc điểm review", "định nghĩa entry/exit criteria", "kiểm entry criteria".</li>
<li><strong>Initiate</strong> — "phát tài liệu", "giải thích", "trả lời câu hỏi".</li>
<li><strong>Individual review</strong> — "ghi defect tiềm năng".</li>
<li><strong>Issue communication &amp; analysis</strong> — "ghi nhận (logging)", "đánh giá đặc tính chất lượng", "so kết quả với exit criteria để quyết định".</li>
<li><strong>Fixing &amp; reporting</strong> — "defect report", "thu metric", "kiểm exit criteria đã đạt", "chấp nhận sản phẩm".</li>
</ul>
<p>Và vai trò: review leader = chịu trách nhiệm review; facilitator = điều hành họp; manager = quyết định và cấp nguồn lực.</p></div>
<div class="callout"><p><span class="badge">★ Ngoài giáo trình</span> <strong>Code review hiện đại = pull request.</strong></p>
<p>Ngày nay phần lớn review diễn ra dưới dạng PR review trên GitHub/GitLab: tác giả mở pull request, CI tự chạy phân tích tĩnh và test, reviewer bình luận ngay trên dòng code, và thay đổi chỉ được merge sau khi được duyệt.</p>
<p>Đối chiếu với bài này:</p>
<ul>
<li><strong>Initiate review</strong> — mở PR kèm mô tả.</li>
<li><strong>Individual review + issue communication</strong> — bình luận inline, gộp làm một (kiểu ít chính quy, slide 30).</li>
<li><strong>Quyết định review</strong> — "approve / request changes".</li>
<li><strong>Fixing &amp; reporting</strong> — đẩy bản sửa và yêu cầu review lại.</li>
</ul>
<p>Các nghiên cứu ở Microsoft và Google cho thấy lợi ích lớn nhất của kiểu review này không phải tìm defect mà là chia sẻ kiến thức và giữ codebase nhất quán — đúng các "mục tiêu khác" ở slide 14.</p>
<p class="ghi-chu"><em>Ngoài giáo trình vì CTFL mô tả quy trình chung, không mô tả quy trình của công cụ nào.</em></p></div>`),
    books([
      ['fst4', 'Ch.3 §2 "Review process" — work product review process, roles and responsibilities: book pp.79–89 (PDF 93–103)', 'Chương 3 §2 "Review process" — quy trình review, vai trò và trách nhiệm: trang sách 79–89 (PDF 93–103)'],
      ['fst', '§3.2 "Review process" — phases of a formal review and roles: pp.59–64 (PDF ≈62–67)', '§3.2 "Review process" — các pha của review chính quy và vai trò: trang 59–64 (PDF ≈62–67)'],
      ['sp5', '§4.3 The review process (PDF 132), §4.3.1 Review process activities (PDF 133), §4.3.3 Roles and responsibilities (PDF 141)', '§4.3 The review process (PDF 132), §4.3.1 Các hoạt động của quy trình review (PDF 133), §4.3.3 Vai trò và trách nhiệm (PDF 141)'],
      ['sp4', '§4.1.2 Reviews p.80, general process p.82, roles and responsibilities p.86 (PDF 95–103)', '§4.1.2 Reviews trang 80, quy trình chung trang 82, vai trò và trách nhiệm trang 86 (PDF 95–103)'],
    ]),
  ].join('\n'),
};

/* ─────────────── 3.3 Review types, review techniques & success factors ─────────────── */
const L33 = {
  title: '3.3 — Review types, review techniques & success factors|||3.3 — Các loại review, kỹ thuật review & yếu tố thành công',
  slug: 'swt301-review-types-techniques',
  type: 'VIDEO',
  description: 'SWT3 slide 54–93 (+ slide ẩn pptx 75): informal, walkthrough, technical review, inspection (mục đích, ai dẫn, bắt buộc/tuỳ chọn), tốc độ kiểm tra, 5 kỹ thuật review, yếu tố thành công; ví dụ review log thật có severity — kèm đáp án 13 câu hỏi.',
  content: [
    bi(`<span class="eyebrow">Chapter 3 · Lesson 3.3 · SWT3 slides 54–93</span>
<h2>Four review types, five review techniques, and what makes reviews work</h2>
<p class="lead">Lesson 3.2 gave you the generic process. Here you learn how its <em>formality</em> is dialled up or down.</p>
<ul>
<li><strong>Four review types</strong> — from informal to inspection.</li>
<li><strong>Checking rates</strong> — why an inspection reads only one page per hour.</li>
<li><strong>Five review techniques</strong> — what a reviewer can use during individual review.</li>
<li><strong>Success factors</strong> — the organisational and people factors that decide whether reviews succeed.</li>
</ul>
<p>At the end you do a real review yourself and write a review log with severities.</p>
<div class="callout"><p><strong>Learning objectives.</strong></p>
<ul>
<li><strong>LO-3.2.3</strong> — Explain the differences between different review types: informal review, walkthrough, technical review and inspection (K2).</li>
<li><strong>LO-3.2.4</strong> — Apply a review technique to a work product to find defects (K3).</li>
<li><strong>LO-3.2.5</strong> — Explain the factors that contribute to a successful review (K2).</li>
</ul></div>
<h3>Review types at a glance (the table examiners test)</h3>
<div style="overflow-x:auto"><table>
<thead><tr><th></th><th>Informal review</th><th>Walkthrough</th><th>Technical review</th><th>Inspection</th></tr></thead>
<tbody>
<tr><td><strong>Main purpose</strong></td><td>detect potential defects</td><td>find defects, improve the product, consider alternatives, evaluate conformance to standards &amp; specs</td><td>gain consensus, detect potential defects</td><td>detect defects, evaluate quality &amp; build confidence, <strong>prevent future similar defects</strong> (author learning, root-cause analysis)</td></tr>
<tr><td><strong>Further purposes</strong></td><td>new ideas, quickly solving minor problems</td><td>exchange ideas, train participants, achieve consensus</td><td>evaluate quality, new ideas, motivate authors, alternative implementations</td><td>motivate authors, improve the development process, consensus</td></tr>
<tr><td><strong>Led by</strong></td><td>nobody formally (author asks a colleague — "buddy check", pairing)</td><td><strong>the author</strong></td><td>ideally a <strong>trained facilitator/moderator</strong>, not the author</td><td>a <strong>trained facilitator</strong> — never the author</td></tr>
<tr><td><strong>Formality</strong></td><td>no documented process</td><td>varies from quite informal to very formal</td><td>formal, but lighter than inspection</td><td>most formal: defined process, rules, clearly defined roles, entry &amp; exit criteria</td></tr>
<tr><td><strong>Individual preparation</strong></td><td>optional</td><td>optional</td><td><strong>mandatory</strong></td><td><strong>mandatory</strong></td></tr>
<tr><td><strong>Scribe</strong></td><td>—</td><td><strong>mandatory</strong></td><td><strong>mandatory</strong> (not the author)</td><td><strong>mandatory</strong> (not the author)</td></tr>
<tr><td><strong>Checklists</strong></td><td>optional</td><td>optional</td><td>optional</td><td><strong>mandatory</strong></td></tr>
<tr><td><strong>Documentation</strong></td><td>results optional</td><td>defect logs &amp; review report optional</td><td>defect logs &amp; review report typically produced</td><td>defect logs &amp; review report <strong>always</strong>; <strong>metrics</strong> gathered</td></tr>
<tr><td><strong>Typical use</strong></td><td>Agile teams, quick peer check</td><td>higher-level documents, knowledge transfer; dry runs, scenarios, simulations</td><td>design decisions among technical peers/experts</td><td>safety-critical or high-risk work products; process improvement</td></tr>
</tbody>
</table></div>`,
    `<span class="eyebrow">Chương 3 · Bài 3.3 · SWT3 slide 54–93</span>
<h2>Bốn loại review, năm kỹ thuật review, và điều gì làm review hiệu quả</h2>
<p class="lead">Bài 3.2 cho bạn quy trình chung. Bài này học cách "vặn" mức <em>chính quy</em> của quy trình đó lên hay xuống.</p>
<ul>
<li><strong>Bốn loại review</strong> — từ informal tới inspection.</li>
<li><strong>Tốc độ kiểm tra</strong> — vì sao inspection chỉ đọc một trang mỗi giờ.</li>
<li><strong>Năm kỹ thuật review</strong> — người review dùng khi review cá nhân.</li>
<li><strong>Yếu tố thành công</strong> — các yếu tố tổ chức, con người quyết định review thành hay bại.</li>
</ul>
<p>Cuối bài bạn tự làm một buổi review thật và viết review log có mức nghiêm trọng.</p>
<div class="callout"><p><strong>Chuẩn đầu ra.</strong></p>
<ul>
<li><strong>LO-3.2.3</strong> — Giải thích khác biệt giữa các loại review: informal review, walkthrough, technical review và inspection (K2).</li>
<li><strong>LO-3.2.4</strong> — Áp dụng một kỹ thuật review lên sản phẩm công việc để tìm defect (K3).</li>
<li><strong>LO-3.2.5</strong> — Giải thích các yếu tố góp phần làm review thành công (K2).</li>
</ul></div>
<h3>Các loại review trong một bảng (bảng giám khảo hay hỏi)</h3>
<div style="overflow-x:auto"><table>
<thead><tr><th></th><th>Informal review</th><th>Walkthrough</th><th>Technical review</th><th>Inspection</th></tr></thead>
<tbody>
<tr><td><strong>Mục đích chính</strong></td><td>tìm defect tiềm năng</td><td>tìm defect, cải thiện sản phẩm, xem xét phương án khác, đánh giá sự tuân thủ chuẩn &amp; đặc tả</td><td>đạt đồng thuận, tìm defect tiềm năng</td><td>tìm defect, đánh giá chất lượng &amp; tạo niềm tin, <strong>ngăn defect tương tự về sau</strong> (tác giả rút kinh nghiệm, phân tích nguyên nhân gốc)</td></tr>
<tr><td><strong>Mục đích bổ sung</strong></td><td>ý tưởng mới, giải quyết nhanh vấn đề nhỏ</td><td>trao đổi ý tưởng, đào tạo người tham gia, đạt đồng thuận</td><td>đánh giá chất lượng, ý tưởng mới, tạo động lực cho tác giả, phương án cài đặt khác</td><td>tạo động lực cho tác giả, cải tiến quy trình phát triển, đồng thuận</td></tr>
<tr><td><strong>Ai dẫn</strong></td><td>không ai chính thức (tác giả nhờ đồng nghiệp — "buddy check", pairing)</td><td><strong>tác giả</strong></td><td>lý tưởng là <strong>facilitator/moderator được đào tạo</strong>, không phải tác giả</td><td><strong>facilitator được đào tạo</strong> — không bao giờ là tác giả</td></tr>
<tr><td><strong>Mức chính quy</strong></td><td>không có quy trình văn bản hoá</td><td>từ khá thoải mái tới rất chính quy</td><td>chính quy nhưng nhẹ hơn inspection</td><td>chính quy nhất: quy trình xác định, luật, vai trò rõ ràng, entry &amp; exit criteria</td></tr>
<tr><td><strong>Chuẩn bị cá nhân</strong></td><td>tuỳ chọn</td><td>tuỳ chọn</td><td><strong>bắt buộc</strong></td><td><strong>bắt buộc</strong></td></tr>
<tr><td><strong>Scribe</strong></td><td>—</td><td><strong>bắt buộc</strong></td><td><strong>bắt buộc</strong> (không phải tác giả)</td><td><strong>bắt buộc</strong> (không phải tác giả)</td></tr>
<tr><td><strong>Checklist</strong></td><td>tuỳ chọn</td><td>tuỳ chọn</td><td>tuỳ chọn</td><td><strong>bắt buộc</strong></td></tr>
<tr><td><strong>Tài liệu đầu ra</strong></td><td>ghi kết quả tuỳ chọn</td><td>defect log &amp; review report tuỳ chọn</td><td>thường có defect log &amp; review report</td><td><strong>luôn có</strong> defect log &amp; review report; <strong>thu metric</strong></td></tr>
<tr><td><strong>Dùng khi</strong></td><td>nhóm Agile, kiểm nhanh giữa đồng nghiệp</td><td>tài liệu cấp cao, chuyển giao kiến thức; dry run, kịch bản, mô phỏng</td><td>quyết định thiết kế giữa đồng nghiệp/chuyên gia kỹ thuật</td><td>sản phẩm an toàn-sống-còn hoặc rủi ro cao; cải tiến quy trình</td></tr>
</tbody>
</table></div>`),
    walkHead(D, 54, 93, 'The hidden pptx slide 75 (a question between visible slides 74 and 75) is answered in the box after the walkthrough.', 'Slide ẩn pptx 75 (một câu hỏi nằm giữa slide 74 và 75) được giải trong khung ngay sau phần đi slide.'),
    walk(D, [
      [54, 'Types of Review (section title)',
        `<p class="y-chinh">🎯 Divider: from here to slide 81 — the four review types.</p>
<ul>
<li><strong>Slides 55–63</strong> — the four review types.</li>
<li><strong>Slides 64–72</strong> — the inspection "deep dive" inherited from Gilb &amp; Graham.</li>
<li><strong>Slides 73–81</strong> — nine questions.</li>
</ul>`,
        `<p class="y-chinh">🎯 Slide chuyển mục: từ đây tới slide 81 — bốn loại review.</p>
<ul>
<li><strong>Slide 55–63</strong> — bốn loại review.</li>
<li><strong>Slide 64–72</strong> — phần "đào sâu inspection" kế thừa từ Gilb &amp; Graham.</li>
<li><strong>Slide 73–81</strong> — chín câu hỏi.</li>
</ul>`],
      [55, 'Review Types — the formality pyramid',
        `<p class="y-chinh">🎯 Every work product should be reviewed — the question is only which type, and a product may get more than one.</p>
<p class="nhan">Three rules</p>
<ol>
<li><strong>Any work product should be reviewed</strong> — slide 6's list.</li>
<li><strong>The type is chosen</strong> by the needs of the project, available resources, product type and <strong>risks</strong>, business domain, company culture…</li>
<li><strong>One work product may go through more than one type</strong> — e.g. an informal buddy check before a technical review, then an inspection of the riskiest part.</li>
</ol>
<p class="nhan">The pyramid — ordered by formality</p>
<ul>
<li><strong>Informal review</strong> — the wide base: most common, least formal.</li>
<li><strong>Walkthrough</strong></li>
<li><strong>Technical review</strong></li>
<li><strong>Inspection</strong> — the tip: rarest, most formal.</li>
</ul>`,
        `<p class="y-chinh">🎯 Sản phẩm nào cũng nên được review — chỉ còn là chọn loại nào, và một sản phẩm có thể qua nhiều loại.</p>
<p class="nhan">Ba quy tắc</p>
<ol>
<li><strong>Sản phẩm nào cũng nên được review</strong> — danh sách ở slide 6.</li>
<li><strong>Loại review được chọn</strong> theo nhu cầu dự án, nguồn lực sẵn có, loại sản phẩm và <strong>rủi ro</strong>, lĩnh vực kinh doanh, văn hoá công ty…</li>
<li><strong>Một sản phẩm có thể qua nhiều loại review</strong> — vd buddy check trước, rồi technical review, rồi inspection phần rủi ro nhất.</li>
</ol>
<p class="nhan">Kim tự tháp — xếp theo mức chính quy</p>
<ul>
<li><strong>Informal review</strong> — đáy rộng: phổ biến nhất, ít chính quy nhất.</li>
<li><strong>Walkthrough</strong></li>
<li><strong>Technical review</strong></li>
<li><strong>Inspection</strong> — đỉnh: hiếm nhất, chính quy nhất.</li>
</ul>`],
      [56, 'Informal Review — purposes',
        `<p class="y-chinh">🎯 Informal review: its main purpose is detecting potential defects.</p>
<ul>
<li><strong>Main purpose</strong> — detecting potential defects.</li>
<li><strong>Possible additional purposes</strong> — generating new ideas or solutions, and <strong>quickly solving minor problems</strong> (the phrase behind slide 73).</li>
</ul>
<p>The picture — two people at one screen — is pair programming or a desk check.</p>`,
        `<p class="y-chinh">🎯 Informal review: mục đích chính là tìm defect tiềm năng.</p>
<ul>
<li><strong>Mục đích chính</strong> — tìm defect tiềm năng.</li>
<li><strong>Mục đích bổ sung</strong> — nảy ra ý tưởng hoặc giải pháp mới, và <strong>giải quyết nhanh các vấn đề nhỏ</strong> (cụm từ này chính là đáp án slide 73).</li>
</ul>
<p>Hình hai người ngồi chung một màn hình là pair programming hoặc desk check.</p>`],
      [57, 'Informal Review — characteristics',
        `<p class="y-chinh">🎯 Informal review: cheap, fast, no fixed process — and no metrics, so you cannot tell how good it was.</p>
<ul>
<li><strong>Optional</strong> — documentation of results, checklists.</li>
<li><strong>Who</strong> — a colleague of the author (<strong>"buddy check"</strong>) or more people.</li>
<li><strong>Process</strong> — not based on a formal (documented) process.</li>
<li><strong>Meeting</strong> — may not involve one at all.</li>
<li><strong>Usefulness</strong> — varies depending on the reviewers.</li>
<li><strong>Agile</strong> — very commonly used there: pairing, a quick look at a teammate's pull request.</li>
</ul>`,
        `<p class="y-chinh">🎯 Informal review: rẻ, nhanh, không quy trình cố định — và không có số liệu nên không biết nó tốt tới đâu.</p>
<ul>
<li><strong>Tuỳ chọn</strong> — ghi lại kết quả, checklist.</li>
<li><strong>Ai làm</strong> — một đồng nghiệp của tác giả (<strong>"buddy check"</strong>) hoặc nhiều người.</li>
<li><strong>Quy trình</strong> — không dựa trên quy trình văn bản hoá.</li>
<li><strong>Họp</strong> — có thể không có buổi họp nào.</li>
<li><strong>Hiệu quả</strong> — thay đổi tuỳ người review.</li>
<li><strong>Agile</strong> — rất phổ biến ở đó: pairing, xem nhanh pull request của đồng đội.</li>
</ul>`],
      [58, 'Walkthrough — definition & purposes',
        `<p class="y-chinh">🎯 Walkthrough: the author leads the participants through the work product; they ask questions and comment on possible issues.</p>
<p class="nhan">Main purposes</p>
<ul>
<li><strong>Find defects</strong></li>
<li><strong>Improve</strong> the work product.</li>
<li><strong>Consider alternative</strong> implementations.</li>
<li><strong>Evaluate conformance</strong> to standards and specifications.</li>
</ul>
<p class="nhan">Additional purposes</p>
<ul>
<li><strong>Exchanging ideas</strong> about techniques or style variations.</li>
<li><strong>Training</strong> participants.</li>
<li><strong>Achieving consensus</strong></li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> the picture — a guide with a flag leading a group — the author is the tour guide.</p>`,
        `<p class="y-chinh">🎯 Walkthrough: tác giả dẫn người tham gia đi qua sản phẩm; họ đặt câu hỏi và góp ý về vấn đề có thể có.</p>
<p class="nhan">Mục đích chính</p>
<ul>
<li><strong>Tìm defect</strong></li>
<li><strong>Cải thiện</strong> sản phẩm.</li>
<li><strong>Xem xét phương án</strong> cài đặt khác.</li>
<li><strong>Đánh giá sự tuân thủ</strong> chuẩn và đặc tả.</li>
</ul>
<p class="nhan">Mục đích bổ sung</p>
<ul>
<li><strong>Trao đổi ý tưởng</strong> về kỹ thuật hay phong cách.</li>
<li><strong>Đào tạo</strong> người tham gia.</li>
<li><strong>Đạt đồng thuận</strong></li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> hình người cầm cờ dẫn đoàn — tác giả là hướng dẫn viên.</p>`],
      [59, 'Walkthrough — characteristics',
        `<p class="y-chinh">🎯 Walkthrough: led by the author, and the only mandatory item is a scribe.</p>
<ul>
<li><strong>Best for</strong> — higher-level work products (requirements, architecture).</li>
<li><strong>Often used</strong> — to transfer knowledge and educate a wider audience.</li>
<li><strong>Mandatory</strong> — a scribe.</li>
<li><strong>Optional</strong> — individual preparation, checklists, defect logs and review reports.</li>
<li><strong>Forms</strong> — scenarios, dry runs, simulations.</li>
<li><strong>Leader</strong> — typically the author.</li>
<li><strong>Formality</strong> — varies.</li>
</ul>
<p class="meo">🧠 <strong>Remember (slide 75):</strong> walkthrough → <em>scribe</em> mandatory, <em>author</em> leads.</p>`,
        `<p class="y-chinh">🎯 Walkthrough: tác giả dẫn, và thứ bắt buộc duy nhất là có scribe.</p>
<ul>
<li><strong>Hợp nhất với</strong> — sản phẩm cấp cao (yêu cầu, kiến trúc).</li>
<li><strong>Thường dùng</strong> — để chuyển giao kiến thức và đào tạo nhiều người.</li>
<li><strong>Bắt buộc</strong> — có scribe.</li>
<li><strong>Tuỳ chọn</strong> — chuẩn bị cá nhân, checklist, defect log và review report.</li>
<li><strong>Hình thức</strong> — kịch bản (scenario), chạy thử trên giấy (dry run), mô phỏng.</li>
<li><strong>Người dẫn</strong> — thường là tác giả.</li>
<li><strong>Mức chính quy</strong> — thay đổi.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ (slide 75):</strong> walkthrough → <em>scribe</em> bắt buộc, <em>tác giả</em> dẫn.</p>`],
      [60, 'Technical Review — purposes',
        `<p class="y-chinh">🎯 Technical review: its main purposes are gaining consensus and detecting potential defects.</p>
<p class="nhan">Main purposes</p>
<ul>
<li><strong>Gaining consensus</strong></li>
<li><strong>Detecting potential defects</strong></li>
</ul>
<p class="nhan">Further purposes</p>
<ul>
<li><strong>Evaluating quality</strong> and building confidence in the work product.</li>
<li><strong>Generating new ideas</strong></li>
<li><strong>Motivating and enabling authors</strong> to improve future work products.</li>
<li><strong>Considering alternative implementations</strong></li>
</ul>
<p class="nhan">Glossary definition (teacher's note)</p>
<p>A formal review by a team of <em>technically qualified</em> personnel that examines the suitability of a work product for its intended use and identifies discrepancies from specifications and standards.</p>`,
        `<p class="y-chinh">🎯 Technical review: mục đích chính là đạt đồng thuận và tìm defect tiềm năng.</p>
<p class="nhan">Mục đích chính</p>
<ul>
<li><strong>Đạt đồng thuận</strong></li>
<li><strong>Tìm defect tiềm năng</strong></li>
</ul>
<p class="nhan">Mục đích bổ sung</p>
<ul>
<li><strong>Đánh giá chất lượng</strong> và tạo niềm tin vào sản phẩm.</li>
<li><strong>Nảy ý tưởng mới</strong></li>
<li><strong>Tạo động lực và giúp tác giả</strong> làm tốt hơn các sản phẩm sau.</li>
<li><strong>Xem xét phương án cài đặt khác</strong></li>
</ul>
<p class="nhan">Định nghĩa trong glossary (ghi chú của thầy/cô)</p>
<p>Một review chính quy do nhóm người <em>có chuyên môn kỹ thuật</em> thực hiện, xem xét sản phẩm có phù hợp mục đích sử dụng không và chỉ ra chỗ lệch so với đặc tả, chuẩn.</p>`],
      [61, 'Technical Review — characteristics',
        `<p class="y-chinh">🎯 Technical review: preparation and a scribe are mandatory — and the author no longer leads.</p>
<p class="nhan">Mandatory</p>
<ul>
<li><strong>Individual preparation</strong></li>
<li><strong>A scribe</strong> — <strong>not the author</strong>.</li>
</ul>
<p class="nhan">Optional</p>
<ul>
<li><strong>A review meeting</strong> — led by a trained moderator, not the author.</li>
<li><strong>Checklists</strong></li>
<li><strong>Defect logs and review reports</strong></li>
</ul>
<p class="nhan">Reviewers</p>
<p>Technical peers of the author, and technical experts in the same or other disciplines.</p>
<p class="meo">🧠 <strong>Remember:</strong> compared with a walkthrough, the author no longer leads, and preparation becomes compulsory.</p>`,
        `<p class="y-chinh">🎯 Technical review: chuẩn bị cá nhân và scribe là bắt buộc — và tác giả không còn dẫn.</p>
<p class="nhan">Bắt buộc</p>
<ul>
<li><strong>Chuẩn bị cá nhân</strong></li>
<li><strong>Có scribe</strong> — <strong>không phải tác giả</strong>.</li>
</ul>
<p class="nhan">Tuỳ chọn</p>
<ul>
<li><strong>Buổi họp review</strong> — do moderator được đào tạo dẫn, không phải tác giả.</li>
<li><strong>Checklist</strong></li>
<li><strong>Defect log và review report</strong></li>
</ul>
<p class="nhan">Reviewer</p>
<p>Đồng nghiệp kỹ thuật ngang hàng với tác giả, và chuyên gia kỹ thuật cùng hoặc khác chuyên ngành.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> so với walkthrough, tác giả không còn dẫn, và chuẩn bị cá nhân trở thành bắt buộc.</p>`],
      [62, 'Inspection — purposes & mandatory characteristics',
        `<p class="y-chinh">🎯 Inspection: the most formal type — and the only one that also aims to <em>prevent</em> future similar defects.</p>
<p class="nhan">Main purposes</p>
<ul>
<li><strong>Detecting potential defects</strong></li>
<li><strong>Evaluating quality</strong> and building confidence.</li>
<li><strong>Preventing future similar defects</strong> through author learning and root-cause analysis — this phrase identifies inspection in slides 76 and 78.</li>
</ul>
<p class="nhan">Further purposes</p>
<ul>
<li><strong>Motivating authors</strong> to improve future work products <em>and the development process</em>.</li>
<li><strong>Achieving consensus</strong></li>
</ul>
<p class="nhan">Mandatory characteristics</p>
<ol class="hai-cot"><li>Defined process</li><li>Checklists</li><li>Clearly defined roles</li><li>Individual preparation</li><li>Entry and exit criteria</li><li>Scribe</li><li>Gathering metrics</li><li>Defect logs and review report</li></ol>
<p class="nhan">From the teacher's notes</p>
<ul>
<li><strong>Definition</strong> — a formal review that identifies issues in a work product and provides measurement to improve the review process and the development process.</li>
<li><strong>Thorough preparation</strong> — reviewers check the work product against its sources and other referenced documents, using rules and checklists.</li>
<li><strong>Efficient meeting</strong> — logging and discussion are strictly separated.</li>
<li><strong>Balanced goals</strong> — when time-to-market matters the emphasis is on efficiency; in safety-critical markets, on effectiveness.</li>
</ul>`,
        `<p class="y-chinh">🎯 Inspection: loại chính quy nhất — và là loại duy nhất còn nhắm tới <em>ngăn</em> defect tương tự về sau.</p>
<p class="nhan">Mục đích chính</p>
<ul>
<li><strong>Tìm defect tiềm năng</strong></li>
<li><strong>Đánh giá chất lượng</strong> và tạo niềm tin.</li>
<li><strong>Ngăn defect tương tự về sau</strong> nhờ tác giả rút kinh nghiệm và phân tích nguyên nhân gốc — cụm này là dấu hiệu nhận ra inspection ở slide 76 và 78.</li>
</ul>
<p class="nhan">Mục đích bổ sung</p>
<ul>
<li><strong>Tạo động lực cho tác giả</strong> cải thiện sản phẩm sau <em>và cả quy trình phát triển</em>.</li>
<li><strong>Đạt đồng thuận</strong></li>
</ul>
<p class="nhan">Đặc điểm bắt buộc</p>
<ol class="hai-cot"><li>Quy trình xác định</li><li>Checklist</li><li>Vai trò rõ ràng</li><li>Chuẩn bị cá nhân</li><li>Entry và exit criteria</li><li>Scribe</li><li>Thu metric</li><li>Defect log và review report</li></ol>
<p class="nhan">Theo ghi chú của thầy/cô</p>
<ul>
<li><strong>Định nghĩa</strong> — một review chính quy để tìm vấn đề trong sản phẩm, có đo đạc để cải tiến quy trình review và quy trình phát triển.</li>
<li><strong>Chuẩn bị kỹ lưỡng</strong> — reviewer kiểm sản phẩm so với tài liệu nguồn và các tài liệu tham chiếu, bằng luật và checklist.</li>
<li><strong>Buổi họp hiệu quả</strong> — phần ghi nhận và phần thảo luận tách bạch hẳn.</li>
<li><strong>Cân bằng mục tiêu</strong> — khi thời gian ra thị trường quan trọng thì nhấn vào hiệu suất (efficiency); ở thị trường an toàn-sống-còn thì nhấn vào hiệu quả (effectiveness).</li>
</ul>`],
      [63, 'Inspection — who does what',
        `<p class="y-chinh">🎯 In an inspection a trained facilitator leads, and the author may not lead, read or scribe.</p>
<ul>
<li><strong>Reader</strong> — may include a dedicated one, who reads the work product aloud (paraphrasing it) during the meeting.</li>
<li><strong>Reviewers</strong> — peers of the author or experts in other relevant disciplines.</li>
<li><strong>Leader of the meeting</strong> — a trained facilitator, not the author.</li>
<li><strong>The author cannot be</strong> review leader, reader or scribe.</li>
</ul>
<p class="nhan">Why so strict?</p>
<ul>
<li><strong>Reading</strong> — an author reading their own text reads what they <em>meant</em>, not what they <em>wrote</em>.</li>
<li><strong>Recording</strong> — an author recording findings tends to soften them.</li>
</ul>`,
        `<p class="y-chinh">🎯 Trong inspection facilitator được đào tạo dẫn họp, còn tác giả không được dẫn, đọc hay làm scribe.</p>
<ul>
<li><strong>Người đọc (reader)</strong> — có thể có một người chuyên đọc to (diễn giải) sản phẩm trong buổi họp.</li>
<li><strong>Reviewer</strong> — đồng nghiệp ngang hàng của tác giả hoặc chuyên gia các lĩnh vực liên quan.</li>
<li><strong>Người dẫn họp</strong> — facilitator được đào tạo, không phải tác giả.</li>
<li><strong>Tác giả không được làm</strong> review leader, reader hay scribe.</li>
</ul>
<p class="nhan">Vì sao khắt khe vậy?</p>
<ul>
<li><strong>Đọc</strong> — tác giả đọc văn bản của chính mình sẽ đọc cái mình <em>định viết</em>, không phải cái mình <em>đã viết</em>.</li>
<li><strong>Ghi</strong> — tác giả tự ghi lỗi của mình thì hay "nhẹ tay".</li>
</ul>`],
      [64, 'Formal Review Pitfalls (they don\'t always work!)',
        `<p class="y-chinh">🎯 Formal reviews don't always work — four classic reasons they fail.</p>
<ol>
<li><strong>Lack of training</strong> in the technique — especially inspection, the most formal.</li>
<li><strong>Lack or poor quality of documentation</strong> — you cannot inspect what was never written down, or a source document is missing.</li>
<li><strong>Lack of management support</strong> — "lip service": managers want reviews but do not put time for them in the schedule.</li>
<li><strong>Failure to improve processes</strong> — getting better and better at finding the same defects again is disheartening; the point is to stop making them.</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> compare with the success factors of slide 93 — each pitfall is the absence of one factor.</p>`,
        `<p class="y-chinh">🎯 Review chính quy không phải lúc nào cũng hiệu quả — bốn lý do kinh điển khiến nó thất bại.</p>
<ol>
<li><strong>Không được đào tạo</strong> kỹ thuật — nhất là inspection, loại chính quy nhất.</li>
<li><strong>Thiếu tài liệu hoặc tài liệu kém</strong> — không thể inspect thứ chưa được viết ra, hoặc thiếu tài liệu nguồn.</li>
<li><strong>Thiếu hỗ trợ của quản lý</strong> — "nói suông": muốn có review nhưng không dành thời gian cho nó trong lịch.</li>
<li><strong>Không cải tiến quy trình</strong> — ngày càng giỏi tìm lại đúng những lỗi cũ thì rất nản; mục đích là ngừng tạo ra chúng.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> so với yếu tố thành công ở slide 93 — mỗi cái bẫy là sự vắng mặt của một yếu tố.</p>`],
      [65, 'Inspection is more and better',
        `<p class="y-chinh">🎯 Inspection adds discipline — and finds far more of the defects that are there.</p>
<p class="nhan">What an inspection adds over a typical review</p>
<ol class="hai-cot"><li>Entry criteria</li><li>Training</li><li>An <strong>optimum checking rate</strong></li><li>Prioritising the words — the important content, not formatting</li><li>Standards</li><li>Process improvement</li><li>Exit criteria</li><li><strong>Quantified estimates of remaining major faults per page</strong></li></ol>
<p class="nhan">The table (Gilb &amp; Graham data) — share of the defects present that are found</p>
<ul>
<li><strong>Typical review</strong> — <strong>10–20%</strong>; effort/return unknown.</li>
<li><strong>Early inspection</strong> — <strong>30–40%</strong>; 6–8 hrs per inspection hour.</li>
<li><strong>Mature inspection</strong> — <strong>80–95%</strong>; 8–30 hrs per inspection hour.</li>
</ul>
<p>The "Effort" column is best read as the return: each hour spent inspecting saves roughly that many hours of later rework. The "Unknown" for typical reviews is because nobody measures them.</p>`,
        `<p class="y-chinh">🎯 Inspection thêm kỷ luật — và tìm được phần lớn hơn hẳn số defect có trong tài liệu.</p>
<p class="nhan">Những gì inspection có thêm so với review thông thường</p>
<ol class="hai-cot"><li>Entry criteria</li><li>Đào tạo</li><li><strong>Tốc độ kiểm tra tối ưu</strong></li><li>Ưu tiên nội dung quan trọng — kiểm chữ nghĩa, không phải định dạng</li><li>Chuẩn</li><li>Cải tiến quy trình</li><li>Exit criteria</li><li><strong>Ước lượng định lượng số lỗi nặng còn lại mỗi trang</strong></li></ol>
<p class="nhan">Bảng (số liệu Gilb &amp; Graham) — tỉ lệ defect có trong tài liệu được tìm ra</p>
<ul>
<li><strong>Review thông thường</strong> — <strong>10–20%</strong>; công sức/lợi ích không rõ.</li>
<li><strong>Inspection giai đoạn đầu</strong> — <strong>30–40%</strong>; 6–8 giờ trên mỗi giờ inspection.</li>
<li><strong>Inspection trưởng thành</strong> — <strong>80–95%</strong>; 8–30 giờ trên mỗi giờ inspection.</li>
</ul>
<p>Cột "Effort" nên hiểu là lợi ích thu về: mỗi giờ inspection tiết kiệm khoảng ngần ấy giờ sửa chữa về sau. Ô "Unknown" của review thông thường là vì chẳng ai đo nó.</p>`],
      [66, 'Inspection Process Overview',
        `<p class="y-chinh">🎯 An inspection sits between an entry gate and an exit gate — and feeds what it learns back into the process.</p>
<p class="nhan">Reading the diagram</p>
<ul>
<li><strong>The box</strong> — the five review activities, between an <strong>entry gate</strong> and an <strong>exit gate</strong> (the two ovals).</li>
<li><strong>In and out</strong> — a work product arrives from a <em>software development stage</em>; it passes on to the <em>next stage</em> only through the exit gate.</li>
</ul>
<p class="nhan">Two feedback arrows</p>
<ul>
<li><strong>Change Request</strong> — Fix &amp; Report can raise one back to an earlier stage (a defect found in a source document).</li>
<li><strong>Process Improvement</strong> — Issue Communication and Fix &amp; Report feed it: the learning loop that distinguishes inspection from every other type.</li>
</ul>`,
        `<p class="y-chinh">🎯 Inspection nằm giữa cổng vào và cổng ra — và đưa những gì học được ngược trở lại quy trình.</p>
<p class="nhan">Đọc sơ đồ</p>
<ul>
<li><strong>Khung</strong> — năm hoạt động review, giữa <strong>cổng vào (entry)</strong> và <strong>cổng ra (exit)</strong> (hai hình bầu dục).</li>
<li><strong>Vào và ra</strong> — sản phẩm đến từ một <em>giai đoạn phát triển</em>; nó chỉ được sang <em>giai đoạn kế tiếp</em> khi qua cổng ra.</li>
</ul>
<p class="nhan">Hai mũi tên phản hồi</p>
<ul>
<li><strong>Change Request</strong> — Fix &amp; Report có thể phát sinh ngược về giai đoạn trước (defect nằm ở tài liệu nguồn).</li>
<li><strong>Process Improvement</strong> — Issue Communication cùng Fix &amp; Report đổ vào đây: vòng học hỏi làm inspection khác mọi loại review khác.</li>
</ul>`],
      [67, 'At first glance …',
        `<p class="y-chinh">🎯 Start of a five-slide story (67–71) from Dorothy Graham's training material.</p>
<p>The grey rectangle is "a document": review it, or inspect it. Keep the picture in mind — the next slides show how the same document is treated by an ordinary review and by an inspection.</p>`,
        `<p class="y-chinh">🎯 Mở đầu câu chuyện năm slide (67–71) lấy từ tài liệu đào tạo của Dorothy Graham.</p>
<p>Hình chữ nhật xám là "một tài liệu": hãy review nó, hoặc inspect nó. Giữ hình này trong đầu — các slide sau cho thấy cùng một tài liệu được xử lý thế nào bằng review thường và bằng inspection.</p>`],
      [68, 'Reviews: TIME & SIZE → RATE',
        `<p class="y-chinh">🎯 In an ordinary review, time and size are fixed first — the checking rate is whatever falls out.</p>
<ul>
<li><strong>Time</strong> — 2 hours?</li>
<li><strong>Size</strong> — 100 pages?</li>
<li><strong>Checking rate</strong> — 100 ÷ 2 = <strong>50 pages per hour</strong>.</li>
</ul>
<p>At that speed you skim — which is why typical reviews find only 10–20% of defects (slide 65).</p>`,
        `<p class="y-chinh">🎯 Trong review thường, thời gian và khối lượng được chốt trước — tốc độ kiểm tra là con số tự rơi ra.</p>
<ul>
<li><strong>Thời gian</strong> — 2 giờ?</li>
<li><strong>Khối lượng</strong> — 100 trang?</li>
<li><strong>Tốc độ kiểm tra</strong> — 100 ÷ 2 = <strong>50 trang mỗi giờ</strong>.</li>
</ul>
<p>Ở tốc độ đó bạn chỉ lướt — vì vậy review thường chỉ tìm được 10–20% defect (slide 65).</p>`],
      [69, 'Review "Thoroughness"?',
        `<p class="y-chinh">🎯 A fast review catches a few defects and the team wrongly concludes the document is fine.</p>
<ul>
<li><strong>The orange line</strong> — the reviewer's path skimming across the document.</li>
<li><strong>What it catches</strong> — it passes close to a few defects: two minor ones and one major.</li>
<li><strong>The conclusion</strong> — the team fixes those three and considers the document "corrected and OK", although most defects were never near the path.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> at 50 pages/hour, thoroughness is an illusion.</p>`,
        `<p class="y-chinh">🎯 Review nhanh bắt được vài lỗi và cả nhóm kết luận sai rằng tài liệu đã ổn.</p>
<ul>
<li><strong>Đường màu cam</strong> — đường "lướt" của người review qua tài liệu.</li>
<li><strong>Bắt được gì</strong> — nó đi gần vài lỗi: hai lỗi minor và một lỗi major.</li>
<li><strong>Kết luận</strong> — nhóm sửa ba lỗi đó và coi tài liệu "đã sửa xong, ổn", dù phần lớn lỗi chưa từng nằm gần đường đi.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> ở tốc độ 50 trang/giờ, sự kỹ lưỡng chỉ là ảo giác.</p>`],
      [70, 'Inspection: TIME & RATE → SIZE',
        `<p class="y-chinh">🎯 Inspection reverses the logic: fix time and rate, and the size falls out.</p>
<ul>
<li><strong>Time</strong> — 2 hours.</li>
<li><strong>Optimum rate</strong> — <strong>1 page per hour</strong>, where 1 page = 300 important words.</li>
<li><strong>Size</strong> — <strong>2 pages</strong>.</li>
</ul>
<p>You do not inspect the whole document — you inspect a sample deeply. The arrows on the diagram changed direction compared with slide 68: rate is now an input, size an output.</p>`,
        `<p class="y-chinh">🎯 Inspection đảo ngược logic: chốt thời gian và tốc độ, khối lượng tự rơi ra.</p>
<ul>
<li><strong>Thời gian</strong> — 2 giờ.</li>
<li><strong>Tốc độ tối ưu</strong> — <strong>1 trang mỗi giờ</strong>, với 1 trang = 300 từ quan trọng.</li>
<li><strong>Khối lượng</strong> — <strong>2 trang</strong>.</li>
</ul>
<p>Bạn không inspect cả tài liệu — bạn inspect sâu một mẫu. Mũi tên trên sơ đồ đổi chiều so với slide 68: tốc độ giờ là đầu vào, khối lượng là đầu ra.</p>`],
      [71, 'Inspection Thoroughness',
        `<p class="y-chinh">🎯 Inspecting a small sample deeply finds a deep-seated fault type — then every fault of that type can be fixed.</p>
<ul>
<li><strong>The yellow box</strong> — the 2-page sample. Inside it the inspection finds many faults, including a <strong>deep-seated major fault</strong> (circled in blue).</li>
<li><strong>All of that type can be corrected</strong> — once the fault <em>type</em> is understood, the author finds and fixes the same type in the rest of the document (the other blue circles). That is how 2 pages of inspection can improve 100 pages.</li>
<li><strong>But it needs the optimum checking rate</strong> — skim the sample and the deep fault is missed.</li>
</ul>
<p class="nhan">Why inspection finds deep faults (teacher's note)</p>
<ol class="hai-cot"><li>Expert participants</li><li>Analytic skill</li><li>A whole-system view</li><li>Attention to detail</li><li>Experience</li></ol>`,
        `<p class="y-chinh">🎯 Inspect sâu một mẫu nhỏ sẽ lộ ra một loại lỗi "ăn sâu" — rồi sửa được mọi lỗi cùng loại.</p>
<ul>
<li><strong>Khung vàng</strong> — mẫu 2 trang. Bên trong đó inspection tìm được rất nhiều lỗi, trong đó có một <strong>lỗi major "ăn sâu"</strong> (khoanh xanh).</li>
<li><strong>Sửa được mọi lỗi cùng loại</strong> — khi đã hiểu <em>loại</em> lỗi, tác giả tìm và sửa cùng loại đó ở phần còn lại của tài liệu (các vòng xanh khác). Đó là cách 2 trang inspection cải thiện được 100 trang.</li>
<li><strong>Nhưng cần đúng tốc độ tối ưu</strong> — lướt mẫu thì lỗi sâu bị bỏ qua.</li>
</ul>
<p class="nhan">Vì sao inspection tìm được lỗi sâu (ghi chú của thầy/cô)</p>
<ol class="hai-cot"><li>Người tham gia có chuyên môn</li><li>Kỹ năng phân tích</li><li>Tầm nhìn tổng thể</li><li>Quan sát chi tiết</li><li>Kinh nghiệm</li></ol>`],
      [72, 'Inspection surprises',
        `<p class="y-chinh">🎯 Five things that surprise teams new to inspection.</p>
<ol>
<li><strong>The fundamental importance of rules</strong> — democratically agreed as applying, and defining what counts as a major issue.</li>
<li><strong>Slow checking rates</strong> — 1 page/hour feels absurd until you see the results.</li>
<li><strong>Strict entry and exit criteria</strong></li>
<li><strong>Fast logging rates</strong> — a well-run meeting logs a defect every minute or so, because nothing is discussed while logging.</li>
<li><strong>The amount of responsibility given to the author</strong> — the author decides how to fix, and fixes defects of the same type everywhere.</li>
</ol>`,
        `<p class="y-chinh">🎯 Năm điều làm nhóm mới làm inspection bất ngờ.</p>
<ol>
<li><strong>Tầm quan trọng nền tảng của luật (rules)</strong> — được cả nhóm đồng ý áp dụng, và xác định thế nào là lỗi major.</li>
<li><strong>Tốc độ kiểm tra chậm</strong> — 1 trang/giờ nghe vô lý cho tới khi thấy kết quả.</li>
<li><strong>Entry và exit criteria nghiêm ngặt</strong></li>
<li><strong>Tốc độ ghi nhận nhanh</strong> — buổi họp tốt ghi được khoảng mỗi phút một lỗi, vì không bàn luận khi đang ghi.</li>
<li><strong>Mức trách nhiệm trao cho tác giả</strong> — tác giả quyết định sửa thế nào, và sửa mọi lỗi cùng loại ở khắp nơi.</li>
</ol>`],
      [73, 'Question — quickly solving minor problems',
        `<p class="y-chinh">🎯 "Quickly solving minor problems" is an additional purpose of the informal review (slide 56).</p>
<ul>
<li><strong>B, C, D</strong> — the formal types all involve preparation or meetings; nothing about them is quick.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: A — Informal review (pairing).</strong></p>`,
        `<p class="y-chinh">🎯 "Giải quyết nhanh vấn đề nhỏ" là mục đích bổ sung của informal review (slide 56).</p>
<ul>
<li><strong>B, C, D</strong> — các loại chính quy đều có chuẩn bị hoặc họp; không có gì "nhanh" cả.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: A — Informal review (pairing).</strong></p>`],
      [74, 'Question — why "buddy check"?',
        `<p class="y-chinh">🎯 In a buddy check the author asks a colleague — a "buddy" — to look over the work (slide 57).</p>
<ul>
<li><strong>A and C</strong> — informal reviews have no facilitator or review leader, so these make no sense.</li>
<li><strong>D</strong> — mixes up roles.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: B — a colleague of the author.</strong></p>`,
        `<p class="y-chinh">🎯 Trong buddy check, tác giả nhờ một đồng nghiệp — "bạn thân" — xem giúp (slide 57).</p>
<ul>
<li><strong>A và C</strong> — informal review không có facilitator hay review leader nên hai phương án này vô nghĩa.</li>
<li><strong>D</strong> — lẫn lộn vai trò.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: B — một đồng nghiệp của tác giả.</strong></p>`],
      [75, 'Question — walkthrough: mandatory item and leader',
        `<p class="y-chinh">🎯 Walkthrough: the only mandatory item is a scribe, and the author leads (slide 59).</p>
<ul>
<li><strong>A and D</strong> — name a moderator as leader: that is technical review / inspection.</li>
<li><strong>B</strong> — makes no sense: a manager is not a characteristic.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: C — Scribe / Author of the work product.</strong></p>`,
        `<p class="y-chinh">🎯 Walkthrough: thứ bắt buộc duy nhất là có scribe, và tác giả dẫn (slide 59).</p>
<ul>
<li><strong>A và D</strong> — cho moderator dẫn: đó là technical review / inspection.</li>
<li><strong>B</strong> — vô nghĩa: manager không phải một "đặc điểm".</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: C — Scribe / Tác giả của sản phẩm.</strong></p>`],
      [76, 'Question — purposes incl. root-cause analysis',
        `<p class="y-chinh">🎯 "Preventing future similar defects through author learning and root-cause analysis" belongs only to inspection (slide 62).</p>
<ul>
<li><strong>A — "formal"</strong>: a category, not a type.</li>
<li><strong>C — walkthrough</strong>: aims at improving the product and considering alternatives.</li>
<li><strong>D — technical review</strong>: aims at consensus and defect detection.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: B — Inspection.</strong> The purpose list is copied from slide 62.</p>`,
        `<p class="y-chinh">🎯 "Ngăn defect tương tự về sau nhờ tác giả rút kinh nghiệm và phân tích nguyên nhân gốc" chỉ thuộc inspection (slide 62).</p>
<ul>
<li><strong>A — "formal"</strong>: là một nhóm, không phải một loại.</li>
<li><strong>C — walkthrough</strong>: hướng tới cải thiện sản phẩm và xem phương án khác.</li>
<li><strong>D — technical review</strong>: hướng tới đồng thuận và tìm defect.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: B — Inspection.</strong> Danh sách mục đích chép từ slide 62.</p>`],
      [77, 'Question — technical review: mandatory items and peers',
        `<p class="y-chinh">🎯 Technical review: individual preparation and a scribe are mandatory; the author's technical peers are the reviewers (slide 61).</p>
<ul>
<li><strong>A</strong> — wrong in both blanks: the author is not a mandatory characteristic (the scribe must not even be the author), and the technical peers are reviewers, not moderators.</li>
<li><strong>C</strong> — a product owner is not a characteristic, and the peers are not managers.</li>
<li><strong>D</strong> — checklists are optional in a technical review.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: B — individual preparation and scribe / reviewers.</strong></p>`,
        `<p class="y-chinh">🎯 Technical review: chuẩn bị cá nhân và scribe là bắt buộc; đồng nghiệp kỹ thuật ngang hàng của tác giả là reviewer (slide 61).</p>
<ul>
<li><strong>A</strong> — sai cả hai chỗ trống: tác giả không phải thành phần bắt buộc (scribe còn không được là tác giả), và đồng nghiệp kỹ thuật là reviewer, không phải moderator.</li>
<li><strong>C</strong> — product owner không phải một đặc điểm, và đồng nghiệp không phải manager.</li>
<li><strong>D</strong> — checklist là tuỳ chọn trong technical review.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: B — chuẩn bị cá nhân và scribe / reviewer.</strong></p>`],
      [78, 'Question — prevent future defects & improve the process',
        `<p class="y-chinh">🎯 Preventing future defects and improving the process through author learning and root-cause analysis = inspection.</p>
<ul>
<li><strong>Same idea as slide 76</strong> — phrased as the inspection note on slide 62: done well, inspections not only find defects but improve the process through author learning and root-cause analysis.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: B — Inspection.</strong></p>`,
        `<p class="y-chinh">🎯 Ngăn defect về sau và cải tiến quy trình nhờ tác giả rút kinh nghiệm, phân tích nguyên nhân gốc = inspection.</p>
<ul>
<li><strong>Cùng ý với slide 76</strong> — diễn đạt theo ghi chú slide 62: làm tốt, inspection không chỉ tìm defect mà còn cải tiến quy trình nhờ tác giả rút kinh nghiệm và phân tích nguyên nhân gốc.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: B — Inspection.</strong></p>`],
      [79, 'Question — defined process, preparation, scribe, logs & report',
        `<p class="y-chinh">🎯 A <em>defined process</em> plus mandatory preparation, scribe, logs and report — only inspection has them all.</p>
<ul>
<li><strong>D — inspection</strong>: a defined process is an inspection characteristic (slide 62), and individual preparation, a scribe, defect logs and a review report are all <em>mandatory</em> there.</li>
<li><strong>B — technical review</strong>: logs and reports are only optional on slide 61, and there is no "defined process" requirement.</li>
<li><strong>A — walkthrough</strong>: only the scribe is mandatory.</li>
<li><strong>C — informal review</strong>: has none of these.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: D — Inspection review.</strong></p>`,
        `<p class="y-chinh">🎯 <em>Quy trình xác định</em> cùng chuẩn bị cá nhân, scribe, log và report bắt buộc — chỉ inspection có đủ.</p>
<ul>
<li><strong>D — inspection</strong>: quy trình xác định là đặc điểm của inspection (slide 62), và chuẩn bị cá nhân, scribe, defect log, review report ở đó đều <em>bắt buộc</em>.</li>
<li><strong>B — technical review</strong>: log và report chỉ là tuỳ chọn theo slide 61, và không đòi "quy trình xác định".</li>
<li><strong>A — walkthrough</strong>: chỉ bắt buộc scribe.</li>
<li><strong>C — informal review</strong>: không có thứ nào.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: D — Inspection.</strong></p>`],
      [80, 'Question — who leads an inspection meeting?',
        `<p class="y-chinh">🎯 An inspection meeting is led by a trained facilitator (slide 63).</p>
<ul>
<li><strong>B — author</strong>: cannot be leader, reader or scribe in an inspection.</li>
<li><strong>C, D — manager, reviewer</strong>: do not lead it.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: A — Facilitator.</strong></p>`,
        `<p class="y-chinh">🎯 Buổi họp inspection do facilitator được đào tạo dẫn (slide 63).</p>
<ul>
<li><strong>B — tác giả</strong>: không được làm leader, reader hay scribe trong inspection.</li>
<li><strong>C, D — manager, reviewer</strong>: không dẫn họp.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: A — Facilitator.</strong></p>`],
      [81, 'Question — reviews by colleagues at the same level',
        `<p class="y-chinh">🎯 A review done by colleagues at about the same organisational level is a <em>peer review</em>.</p>
<ul>
<li><strong>The syllabus</strong> — walkthroughs, technical reviews and inspections can all be performed within a peer group; this is called a peer review.</li>
<li><strong>A — formal</strong>: is about the process, not about who reviews.</li>
<li><strong>C, D</strong> — are specific review types.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: B — Peer reviews.</strong></p>`,
        `<p class="y-chinh">🎯 Review do các đồng nghiệp cùng cấp bậc tổ chức xấp xỉ nhau thực hiện là <em>peer review</em>.</p>
<ul>
<li><strong>Syllabus</strong> — walkthrough, technical review và inspection đều có thể làm trong một nhóm đồng nghiệp; khi đó gọi là peer review.</li>
<li><strong>A — formal</strong>: nói về quy trình, không nói ai review.</li>
<li><strong>C, D</strong> — là các loại review cụ thể.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: B — Peer review.</strong></p>`],
      [82, 'Review Techniques (section title)',
        `<p class="y-chinh">🎯 A review technique is <em>how one reviewer reads</em> during individual preparation — not the same as a review type.</p>
<p>The slide: "How reviewers actually do the individual reviewing, the individual preparation of the review process."</p>
<ul>
<li><strong>Chosen per reviewer and per work product</strong></li>
<li><strong>Mix freely</strong> — one inspection may have a reviewer with a checklist and another reading from a tester's perspective.</li>
</ul>`,
        `<p class="y-chinh">🎯 Kỹ thuật review là <em>cách một người đọc</em> trong bước chuẩn bị cá nhân — không phải loại review.</p>
<p>Slide ghi: "Người review thực sự làm phần review cá nhân thế nào — bước chuẩn bị cá nhân của quy trình review."</p>
<ul>
<li><strong>Chọn cho từng người và từng sản phẩm</strong></li>
<li><strong>Phối hợp tự do</strong> — một buổi inspection có thể có người dùng checklist, người khác đọc theo góc nhìn tester.</li>
</ul>`],
      [83, 'Ad hoc Reviewing',
        `<p class="y-chinh">🎯 Ad hoc: little or no guidance — free, but uneven.</p>
<ul>
<li><strong>Guidance</strong> — reviewers get little or none on how to review.</li>
<li><strong>How they read</strong> — typically <strong>sequentially</strong>, noting issues as they meet them.</li>
<li><strong>Depends on skill</strong> — the technique is <strong>highly dependent on reviewer skill</strong>.</li>
<li><strong>Duplicates</strong> — <strong>many duplicate issues</strong> reported by different reviewers: everyone stumbles on the same obvious typo on page 1.</li>
</ul>`,
        `<p class="y-chinh">🎯 Ad hoc: rất ít hoặc không có hướng dẫn — không tốn gì, nhưng chất lượng thất thường.</p>
<ul>
<li><strong>Hướng dẫn</strong> — người review được hướng dẫn rất ít hoặc không gì cả.</li>
<li><strong>Cách đọc</strong> — thường đọc <strong>tuần tự</strong> từ đầu tới cuối, gặp gì ghi nấy.</li>
<li><strong>Phụ thuộc tay nghề</strong> — kỹ thuật này <strong>phụ thuộc rất nhiều vào tay nghề người review</strong>.</li>
<li><strong>Trùng lặp</strong> — sinh <strong>nhiều lỗi trùng</strong> giữa các reviewer: ai cũng vấp cùng một lỗi chính tả ở trang 1.</li>
</ul>`],
      [84, 'Checklist-based Reviewing',
        `<p class="y-chinh">🎯 Checklist-based: a systematic technique — questions about likely defects, handed out at review initiation.</p>
<ul>
<li><strong>Distributed at initiation</strong> — e.g. by the facilitator.</li>
<li><strong>What a checklist is</strong> — a set of questions based on potential defects, often derived from experience ("Is every input validated?", "Are loop boundaries correct?").</li>
<li><strong>Size</strong> — keep it to <strong>one page</strong>.</li>
<li><strong>Main advantage</strong> — <strong>systematic coverage of typical defect types</strong>.</li>
<li><strong>Look beyond it</strong> — reviewers should also look for defects outside the checklist.</li>
</ul>
<p class="ghi-chu">Teacher's note: different reviewers may get different checklists. Lab 1 uses exactly this technique with its Java checklist.</p>`,
        `<p class="y-chinh">🎯 Checklist-based: kỹ thuật có hệ thống — bộ câu hỏi về các lỗi hay gặp, được phát ở bước initiate review.</p>
<ul>
<li><strong>Phát ở bước initiate</strong> — vd do facilitator phát.</li>
<li><strong>Checklist là gì</strong> — bộ câu hỏi dựa trên các defect tiềm năng, thường rút từ kinh nghiệm ("Mọi đầu vào đã được kiểm tra chưa?", "Biên vòng lặp đúng chưa?").</li>
<li><strong>Độ dài</strong> — nên giới hạn trong <strong>một trang</strong>.</li>
<li><strong>Ưu điểm chính</strong> — <strong>phủ có hệ thống các loại defect điển hình</strong>.</li>
<li><strong>Nhìn ra ngoài</strong> — người review vẫn nên tìm cả defect ngoài checklist.</li>
</ul>
<p class="ghi-chu">Ghi chú của thầy/cô: mỗi reviewer có thể nhận một checklist khác nhau. Lab 1 dùng đúng kỹ thuật này với checklist Java.</p>`],
      [85, 'Scenario-based Reviewing & Dry runs',
        `<p class="y-chinh">🎯 Scenario-based: reviewers "act out" expected usage of the work product (dry runs) and check each step is supported.</p>
<ul>
<li><strong>Structured guidelines</strong> — on how to read the work product.</li>
<li><strong>Dry runs</strong> — walking through the document according to its expected usage; works best if it is written as use cases.</li>
<li><strong>Better than a checklist entry</strong> — for finding <em>specific</em> defect types.</li>
<li><strong>Not a cage</strong> — reviewers should not be constrained to the documented scenarios.</li>
</ul>
<p class="nhan">Example scenarios (teacher's notes — an online shop)</p>
<ol>
<li><strong>New user registers</strong> → receives a confirmation e-mail → completes sign-up.</li>
<li><strong>Order a product</strong> — log in → search → add to cart → pay.</li>
<li><strong>View order history</strong></li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> a scenario acts out realistic use and asks whether the document supports each step; a checklist verifies individual aspects that went wrong before.</p>`,
        `<p class="y-chinh">🎯 Scenario-based: người review "diễn lại" cách sản phẩm sẽ được dùng (dry run) và kiểm từng bước có được hỗ trợ không.</p>
<ul>
<li><strong>Hướng dẫn có cấu trúc</strong> — về cách đọc sản phẩm.</li>
<li><strong>Dry run</strong> — đi qua tài liệu theo cách nó sẽ được dùng; hiệu quả nhất khi tài liệu viết dưới dạng use case.</li>
<li><strong>Tốt hơn một dòng checklist</strong> — khi cần tìm các loại defect <em>cụ thể</em>.</li>
<li><strong>Không phải khuôn cứng</strong> — người review không nên bị bó hẹp trong các kịch bản có sẵn.</li>
</ul>
<p class="nhan">Kịch bản ví dụ (ghi chú của thầy/cô — cửa hàng online)</p>
<ol>
<li><strong>Người dùng mới đăng ký</strong> → nhận email xác nhận → hoàn tất.</li>
<li><strong>Đặt hàng</strong> — đăng nhập → tìm sản phẩm → thêm giỏ → thanh toán.</li>
<li><strong>Xem lịch sử đơn hàng</strong></li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> kịch bản "diễn lại" cách dùng thực tế và hỏi tài liệu có hỗ trợ từng bước không; checklist kiểm từng khía cạnh riêng lẻ đã từng sai trước đây.</p>`],
      [86, 'Role-based Reviewing',
        `<p class="y-chinh">🎯 Role-based: like scenario-based, but the viewpoints are different stakeholders, not just "a user".</p>
<p class="nhan">Typical roles</p>
<ul>
<li><strong>End-user types</strong> — experienced, inexperienced, senior, child…</li>
<li><strong>Roles in the organisation</strong> — user administrator, system administrator, performance tester…</li>
</ul>
<p>The notes connect it to <em>personas</em> — characterisations of target users that represent a range of profiles and needs. Slide 89 is a direct application.</p>`,
        `<p class="y-chinh">🎯 Role-based: giống scenario-based, nhưng góc nhìn là các bên liên quan khác nhau, không chỉ "người dùng".</p>
<p class="nhan">Vai điển hình</p>
<ul>
<li><strong>Kiểu người dùng cuối</strong> — thành thạo, mới dùng, người cao tuổi, trẻ em…</li>
<li><strong>Vai trong tổ chức</strong> — quản trị người dùng, quản trị hệ thống, người test hiệu năng…</li>
</ul>
<p>Ghi chú nối nó với <em>persona</em> — chân dung người dùng mục tiêu đại diện cho nhiều hồ sơ, nhu cầu khác nhau. Slide 89 là bài áp dụng trực tiếp.</p>`],
      [87, 'Perspective-based Reading',
        `<p class="y-chinh">🎯 Perspective-based reading: each reviewer takes a stakeholder viewpoint — the most effective general technique for requirements.</p>
<ul>
<li><strong>Viewpoints</strong> — like role-based: end user, marketing, designer, tester, operations.</li>
<li><strong>Depth, fewer duplicates</strong> — different viewpoints give more depth with less duplication of issues across reviewers.</li>
<li><strong>Evidence</strong> — empirical studies show it is the most effective general technique for reviewing requirements and technical work products.</li>
</ul>
<p class="nhan">Two defining features (teacher's notes)</p>
<ul>
<li><strong>Generate the derived product</strong> — each reviewer tries to use the work product to produce what they would derive from it; e.g. a tester drafts acceptance tests from the requirements to see whether all needed information is there.</li>
<li><strong>Checklists are expected</strong> — they are used too.</li>
</ul>
<p>A key success factor is weighing the viewpoints by risk.</p>`,
        `<p class="y-chinh">🎯 Perspective-based reading: mỗi reviewer nhận một góc nhìn của bên liên quan — kỹ thuật tổng quát hiệu quả nhất cho tài liệu yêu cầu.</p>
<ul>
<li><strong>Góc nhìn</strong> — như role-based: người dùng cuối, marketing, thiết kế, tester, vận hành.</li>
<li><strong>Sâu hơn, ít trùng hơn</strong> — góc nhìn khác nhau cho độ sâu cao hơn và ít lỗi trùng hơn giữa các reviewer.</li>
<li><strong>Bằng chứng</strong> — nghiên cứu thực nghiệm cho thấy đây là kỹ thuật tổng quát hiệu quả nhất để review yêu cầu và sản phẩm kỹ thuật.</li>
</ul>
<p class="nhan">Hai đặc điểm riêng (ghi chú của thầy/cô)</p>
<ul>
<li><strong>Tạo ra sản phẩm phái sinh</strong> — mỗi reviewer thử dùng sản phẩm để làm ra thứ họ sẽ làm từ nó; vd tester soạn nháp acceptance test từ yêu cầu để xem có đủ thông tin không.</li>
<li><strong>Vẫn dùng checklist</strong> — checklist được kỳ vọng dùng kèm.</li>
</ul>
<p>Yếu tố then chốt là cân các góc nhìn theo rủi ro.</p>`],
      [88, 'Question — questions distributed at initiation',
        `<p class="y-chinh">🎯 Questions based on potential defects, distributed at review initiation — slide 84 word for word.</p>
<ul>
<li><strong>Ad hoc</strong> — gives no guidance.</li>
<li><strong>Scenarios</strong> — give reading guidelines.</li>
<li><strong>Roles</strong> — give viewpoints.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: B — Checklist-based technique.</strong></p>`,
        `<p class="y-chinh">🎯 Bộ câu hỏi dựa trên defect tiềm năng, phát ở bước initiate — đúng từng chữ slide 84.</p>
<ul>
<li><strong>Ad hoc</strong> — không có hướng dẫn.</li>
<li><strong>Scenario</strong> — cho cách đọc.</li>
<li><strong>Role</strong> — cho góc nhìn.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: B — Checklist-based.</strong></p>`],
      [89, 'Question — role-based review as a senior citizen',
        `<p class="y-chinh">🎯 As a senior citizen reviewing the <em>user interface</em>, your viewpoint is readability and ease of use.</p>
<ul>
<li><strong>C — right</strong>: small or unclear text is exactly what this persona suffers from.</li>
<li><strong>A — backend speed</strong> and <strong>D — reliability on dropped connections</strong>: not UI concerns, and not specific to seniors.</li>
<li><strong>B — attractiveness</strong>: matters to every user, not particularly to this role.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: C — The size and clarity of the instruction text.</strong></p>
<p class="ghi-chu">Official ISTQB sample-exam question.</p>`,
        `<p class="y-chinh">🎯 Đóng vai người cao tuổi review <em>giao diện</em>, góc nhìn của bạn là dễ đọc, dễ dùng.</p>
<ul>
<li><strong>C — đúng</strong>: chữ nhỏ hoặc khó hiểu chính là thứ persona này gặp khó.</li>
<li><strong>A — tốc độ backend</strong> và <strong>D — độ tin cậy khi mất kết nối</strong>: không phải chuyện giao diện, và không riêng người cao tuổi.</li>
<li><strong>B — tính hấp dẫn</strong>: quan trọng với mọi người dùng, không đặc thù vai này.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: C — Cỡ chữ và độ rõ ràng của hướng dẫn.</strong></p>
<p class="ghi-chu">Câu trong đề mẫu chính thức ISTQB.</p>`],
      [90, 'Question — depends mainly on reviewer skills',
        `<p class="y-chinh">🎯 Little or no guidance and little preparation → everything depends on the reviewer's skill (slide 83).</p>
<ul>
<li><strong>B, C, D</strong> — checklist, scenario and role-based techniques all give the reviewer structure.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: A — Ad hoc technique.</strong></p>`,
        `<p class="y-chinh">🎯 Ít hoặc không có hướng dẫn, ít chuẩn bị → mọi thứ phụ thuộc tay nghề người review (slide 83).</p>
<ul>
<li><strong>B, C, D</strong> — checklist, scenario và role-based đều cho người review một khuôn khổ.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: A — Ad hoc.</strong></p>`],
      [91, 'Question — walkthrough vs inspection',
        `<p class="y-chinh">🎯 Who leads is the key difference: the author leads a walkthrough, a trained moderator leads an inspection.</p>
<ul>
<li><strong>A</strong> — swaps the leaders.</li>
<li><strong>B</strong> — wrong: a walkthrough does have a leader (the author).</li>
<li><strong>C</strong> — wrong: the author is present at an inspection — they just may not lead, read or scribe.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: D — A walkthrough is led by the author, whilst an inspection is led by a trained moderator.</strong></p>`,
        `<p class="y-chinh">🎯 Khác biệt then chốt là ai dẫn: tác giả dẫn walkthrough, moderator được đào tạo dẫn inspection.</p>
<ul>
<li><strong>A</strong> — đảo người dẫn.</li>
<li><strong>B</strong> — sai: walkthrough có người dẫn (tác giả).</li>
<li><strong>C</strong> — sai: tác giả có mặt trong inspection — chỉ là không được dẫn, đọc hay làm scribe.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: D — Walkthrough do tác giả dẫn, còn inspection do moderator được đào tạo dẫn.</strong></p>`],
      [92, 'Success Factors for Reviews (section title)',
        `<p class="y-chinh">🎯 Divider: success factors for reviews.</p>
<p>The teacher's note links to a web summary of syllabus section 3.2.5; the next slide gives the full list.</p>`,
        `<p class="y-chinh">🎯 Slide chuyển mục: các yếu tố thành công của review.</p>
<p>Ghi chú của thầy/cô dẫn tới một bài tóm tắt mục 3.2.5 của syllabus trên mạng; slide sau có danh sách đầy đủ.</p>`],
      [93, 'Success Factors for Reviews',
        `<p class="y-chinh">🎯 Reviews succeed through the organisation (6 factors) and the people (9 factors).</p>
<p class="nhan">Organisational success factors</p>
<ol>
<li><strong>Clearly defined objectives</strong> — used as measurable exit criteria.</li>
<li><strong>Appropriate review type and technique</strong> — chosen for the objectives, the work product and the participants.</li>
<li><strong>Up-to-date review materials</strong></li>
<li><strong>Limited scope</strong> — review in small chunks, so reviewers do not lose concentration.</li>
<li><strong>Adequate time</strong> — to prepare and for reviews to happen.</li>
<li><strong>Management support</strong></li>
</ol>
<p class="nhan">People-related success factors</p>
<ol class="hai-cot">
<li><strong>Pick the right reviewers</strong></li>
<li><strong>Involve testers</strong> — they learn the product and prepare tests earlier.</li>
<li><strong>Proper individual preparation</strong> — attention to detail.</li>
<li><strong>Defects found are welcomed</strong> — and expressed objectively.</li>
<li><strong>Well-managed review meetings</strong></li>
<li><strong>Trust is critical</strong> — the outcome is never used to evaluate the participants.</li>
<li><strong>Follow the rules but keep it simple</strong></li>
<li><strong>Trained participants</strong> — especially for formal types.</li>
<li><strong>Continuously improve</strong> process and tools.</li>
</ol>
<div class="pitfall">"The review results are used to appraise the author" is always the wrong option.</div>`,
        `<p class="y-chinh">🎯 Review thành công nhờ tổ chức (6 yếu tố) và con người (9 yếu tố).</p>
<p class="nhan">Yếu tố thành công về tổ chức</p>
<ol>
<li><strong>Mục tiêu rõ ràng</strong> — dùng làm exit criteria đo được.</li>
<li><strong>Loại và kỹ thuật review phù hợp</strong> — chọn theo mục tiêu, sản phẩm và người tham gia.</li>
<li><strong>Tài liệu review cập nhật</strong></li>
<li><strong>Giới hạn phạm vi</strong> — chia nhỏ mỗi lần review để không mất tập trung.</li>
<li><strong>Đủ thời gian</strong> — để chuẩn bị và để review diễn ra.</li>
<li><strong>Quản lý ủng hộ</strong></li>
</ol>
<p class="nhan">Yếu tố thành công về con người</p>
<ol class="hai-cot">
<li><strong>Chọn đúng người review</strong></li>
<li><strong>Có tester tham gia</strong> — họ hiểu sản phẩm và chuẩn bị test sớm hơn.</li>
<li><strong>Chuẩn bị cá nhân chu đáo</strong> — chú ý chi tiết.</li>
<li><strong>Hoan nghênh defect tìm được</strong> — và nêu khách quan.</li>
<li><strong>Buổi họp được điều hành tốt</strong></li>
<li><strong>Tin tưởng là then chốt</strong> — kết quả review không bao giờ dùng để đánh giá người tham gia.</li>
<li><strong>Theo luật nhưng giữ đơn giản</strong></li>
<li><strong>Người tham gia được đào tạo</strong> — nhất là với loại chính quy.</li>
<li><strong>Liên tục cải tiến</strong> quy trình và công cụ.</li>
</ol>
<div class="pitfall">"Kết quả review dùng để đánh giá tác giả" luôn là phương án sai.</div>`],
    ]),
    bi(`<h3>🔒 Hidden slide in SWT3_tim.pptx (not shown in class, still worth knowing)</h3>
<ul>
<li><strong>Question</strong> (pptx slide 75, between visible slides 74 and 75): "The main purposes of ……… review type include: improving the software product, considering alternative implementations and finding defects." Options: Formal, Informal, Walkthrough, Technical.
<ul>
<li><strong>Answer: Walkthrough</strong> — the three purposes are the walkthrough's main purposes on slide 58 (find defects, improve the product, consider alternatives, evaluate conformance).</li>
<li><strong>Technical — the tempting distractor</strong>: "considering alternative implementations" is one of its <em>further</em> purposes, but its <em>main</em> purposes are gaining consensus and detecting defects.</li>
<li><strong>Formal</strong> — a category, not a type.</li>
<li><strong>Informal</strong> — its main purpose is only detecting defects.</li>
</ul></li>
</ul>`,
    `<h3>🔒 Slide ẩn trong file SWT3_tim.pptx (không chiếu trên lớp nhưng vẫn nên biết)</h3>
<ul>
<li><strong>Câu hỏi</strong> (slide pptx 75, nằm giữa slide 74 và 75): "Mục đích chính của loại review ……… gồm: cải thiện sản phẩm phần mềm, xem xét phương án cài đặt khác và tìm defect." Phương án: Formal, Informal, Walkthrough, Technical.
<ul>
<li><strong>Đáp án: Walkthrough</strong> — ba mục đích đó chính là mục đích chính của walkthrough ở slide 58 (tìm defect, cải thiện sản phẩm, xem phương án khác, đánh giá sự tuân thủ).</li>
<li><strong>Technical — phương án gây nhiễu</strong>: "xem xét phương án cài đặt khác" là một mục đích <em>bổ sung</em> của nó, nhưng mục đích <em>chính</em> là đạt đồng thuận và tìm defect.</li>
<li><strong>Formal</strong> — là một nhóm, không phải một loại.</li>
<li><strong>Informal</strong> — mục đích chính chỉ là tìm defect.</li>
</ul></li>
</ul>`),
    bi(`<h3>Ví dụ có lời giải · Worked example — review a requirement and its code, and write the review log</h3>
<p><strong>Work products under review.</strong> One requirement and the method that implements it (a technical review; you are one of the reviewers).</p>
<div class="callout"><strong>REQ-DISC-01.</strong> Members who have been registered for at least 12 months receive a 10% discount on orders of 500,000 VND or more. VIP members receive 15%. The discount shall not exceed 200,000 VND. The final price is rounded to the nearest 1,000 VND.</div>
<pre><code>public class DiscountService {
    public static final double RATE = 0.1;
    public long finalPrice(long total, int months, boolean vip) {   // line 3
        double d = 0;                                                // line 4
        if (months &gt; 12 &amp;&amp; total &gt; 500000) {                        // line 5
            d = total * RATE;                                        // line 6
            if (vip) d = total * 0.15;                               // line 7
        }
        if (d &gt; 200000) d = 200000;                                  // line 9
        long p = (long) (total - d);                                 // line 10
        return p;
    }
}</code></pre>
<p><strong>Technique.</strong> Checklist-based (a short Java checklist: boundaries, input validation, rounding, magic numbers, naming, money types) combined with a <em>tester's perspective</em> (perspective-based reading: try to write acceptance tests from REQ-DISC-01 — every question you cannot answer is a requirement defect).</p>
<p><strong>Review log.</strong> Severity as defined in the notes of slide 30: <em>critical</em> = will cause damage beyond this work product; <em>major</em> = could cause a downstream effect; <em>minor</em> = unlikely to cause damage.</p>
<div style="overflow-x:auto"><table>
<thead><tr><th>ID</th><th>Where</th><th>Finding</th><th>Found via</th><th>Severity</th></tr></thead>
<tbody>
<tr><td>R1</td><td>REQ, sentence 2</td><td>Ambiguous: must a VIP also have 12 months and a 500,000 order to get 15%? (The code silently assumes "yes".)</td><td>tester perspective (cannot write the VIP test)</td><td>Major</td></tr>
<tr><td>R2</td><td>REQ</td><td>Omission: behaviour for a total ≤ 0 or invalid input is not specified.</td><td>tester perspective</td><td>Major</td></tr>
<tr><td>R3</td><td>REQ, sentence 1</td><td>"At least 12 months" — counted how (calendar months, up to the order date)?</td><td>tester perspective</td><td>Minor</td></tr>
<tr><td>R4</td><td>REQ, sentence 4</td><td>Rounding of exact halves (…500) not stated.</td><td>checklist: rounding</td><td>Minor</td></tr>
<tr><td>C1</td><td>line 5</td><td><code>months &gt; 12</code> must be <code>&gt;= 12</code> ("at least 12").</td><td>checklist: boundaries</td><td>Major</td></tr>
<tr><td>C2</td><td>line 5</td><td><code>total &gt; 500000</code> must be <code>&gt;= 500000</code> ("500,000 or more").</td><td>checklist: boundaries</td><td>Major</td></tr>
<tr><td>C3</td><td>line 10</td><td>Cast truncates; the requirement asks for rounding to the nearest 1,000.</td><td>checklist: rounding</td><td>Major</td></tr>
<tr><td>C4</td><td>line 3</td><td>No input validation: a negative total yields a negative price that a payment module could turn into a refund.</td><td>checklist: input validation</td><td>Critical</td></tr>
<tr><td>C5</td><td>lines 4–10</td><td>Money held in <code>double</code> (binary floating point) — use integer đồng or BigDecimal.</td><td>checklist: money types</td><td>Major</td></tr>
<tr><td>C6</td><td>line 7</td><td>Magic number 0.15 while a constant exists for 0.1 — define <code>VIP_RATE</code>.</td><td>checklist: magic numbers (coding standard)</td><td>Minor</td></tr>
<tr><td>C7</td><td>lines 4, 10</td><td>Names <code>d</code>, <code>p</code> say nothing — <code>discount</code>, <code>price</code>.</td><td>checklist: naming</td><td>Minor</td></tr>
</tbody>
</table></div>
<p><strong>Confirming the code findings (optional, after the review).</strong> A review does not execute anything — but to show these are real defects, the method was compiled and run (JDK 21) with inputs chosen from the findings:</p>
<pre><code>12 months,   600,000, normal -&gt; 600000  (spec: 540,000)     ← C1
13 months,   500,000, normal -&gt; 500000  (spec: 450,000)     ← C2
24 months,   612,345, normal -&gt; 551110  (spec: 551,000)     ← C3
24 months, 2,000,000, VIP    -&gt; 1800000 (spec: 1,800,000)   ← cap is correct
24 months,  -100,000, normal -&gt; -100000 (spec: not stated)  ← C4 / R2</code></pre>
<p>Notice what the review achieved that testing would not: R1–R4 are defects in the <em>requirement</em> — no test can fail against a rule nobody wrote down. And one line of review found C1 and C2 at once, while dynamic testing would need the exact boundary inputs to reveal them (Chapter 4, BVA). Lab 1 asks you to do exactly this on a larger class: at least 10 logged defects with a checklist.</p>
<h4>Choosing the review type — four quick cases</h4>
<table>
<thead><tr><th>Situation</th><th>Type</th><th>Why</th></tr></thead>
<tbody>
<tr><td>A developer wants a quick second look at a 20-line fix before lunch.</td><td>Informal (buddy check)</td><td>fast, cheap, "quickly solving minor problems"</td></tr>
<tr><td>A new architecture must be explained to 15 developers, who should also spot problems.</td><td>Walkthrough</td><td>author-led, knowledge transfer, higher-level work product</td></tr>
<tr><td>Two database designs compete; the leads must agree on one.</td><td>Technical review</td><td>gaining consensus among technical peers, evaluating alternatives</td></tr>
<tr><td>A safety-critical flight-control module needs certification evidence.</td><td>Inspection</td><td>defined process, entry/exit criteria, metrics, audit trail; led by a trained facilitator — never the author</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><p><strong>Traps in this section.</strong></p>
<ul>
<li><strong>Walkthrough</strong> — led by the <em>author</em>; scribe mandatory.</li>
<li><strong>Technical review</strong> — preparation and scribe mandatory; scribe <em>not</em> the author; meeting optional.</li>
<li><strong>Inspection</strong> — checklists, entry/exit criteria and metrics mandatory; the author cannot be leader, reader or scribe.</li>
<li><strong>Type ≠ technique</strong> — do not confuse a review <em>type</em> (how formal) with a review <em>technique</em> (how one reviewer reads).</li>
</ul></div>
<div class="callout"><p><span class="badge">★ Beyond the syllabus</span> <strong>Where "perspective-based reading is most effective" comes from.</strong></p>
<p>The claim on slide 87 goes back to experiments by Victor Basili and colleagues with NASA Goddard's Software Engineering Laboratory (published 1996).</p>
<ul>
<li><strong>The finding</strong> — professional developers reviewing requirement documents found more defects, as a team, when each read from an assigned perspective (designer, tester, user) and produced an artefact from it, than with their usual ad hoc or checklist approach.</li>
<li><strong>Why</strong> — the perspectives overlapped less.</li>
<li><strong>Later replications</strong> — confirmed the effect for requirements, but found it smaller for code, where tool support and checklists do well.</li>
</ul>
<p class="ghi-chu"><em>Outside the syllabus because CTFL states the result without the studies behind it.</em></p></div>`,
    `<h3>Ví dụ có lời giải · Review một yêu cầu và code của nó, rồi viết review log</h3>
<p><strong>Sản phẩm cần review.</strong> Một yêu cầu và phương thức cài đặt nó (một buổi technical review; bạn là một reviewer).</p>
<div class="callout"><strong>REQ-DISC-01.</strong> Thành viên đã đăng ký ít nhất 12 tháng được giảm 10% cho đơn hàng từ 500.000 VND trở lên. Thành viên VIP được giảm 15%. Mức giảm không vượt quá 200.000 VND. Giá cuối được làm tròn tới 1.000 VND gần nhất.</div>
<pre><code>public class DiscountService {
    public static final double RATE = 0.1;
    public long finalPrice(long total, int months, boolean vip) {   // line 3
        double d = 0;                                                // line 4
        if (months &gt; 12 &amp;&amp; total &gt; 500000) {                        // line 5
            d = total * RATE;                                        // line 6
            if (vip) d = total * 0.15;                               // line 7
        }
        if (d &gt; 200000) d = 200000;                                  // line 9
        long p = (long) (total - d);                                 // line 10
        return p;
    }
}</code></pre>
<p><strong>Kỹ thuật.</strong> Checklist-based (checklist Java ngắn: giá trị biên, kiểm tra đầu vào, làm tròn, magic number, đặt tên, kiểu dữ liệu tiền) kết hợp <em>góc nhìn tester</em> (perspective-based reading: thử viết acceptance test từ REQ-DISC-01 — câu hỏi nào không trả lời được là một defect của yêu cầu).</p>
<p><strong>Review log.</strong> Mức nghiêm trọng theo ghi chú slide 30: <em>critical</em> = chắc chắn gây hại vượt ra ngoài sản phẩm này; <em>major</em> = có thể gây ảnh hưởng về sau; <em>minor</em> = ít khả năng gây hại.</p>
<div style="overflow-x:auto"><table>
<thead><tr><th>ID</th><th>Vị trí</th><th>Phát hiện</th><th>Tìm nhờ</th><th>Mức</th></tr></thead>
<tbody>
<tr><td>R1</td><td>REQ, câu 2</td><td>Mơ hồ: VIP có cần đủ 12 tháng và đơn 500.000 mới được 15% không? (Code ngầm hiểu là "có".)</td><td>góc nhìn tester (không viết được test VIP)</td><td>Major</td></tr>
<tr><td>R2</td><td>REQ</td><td>Thiếu: không nói xử lý thế nào khi tổng ≤ 0 hoặc đầu vào không hợp lệ.</td><td>góc nhìn tester</td><td>Major</td></tr>
<tr><td>R3</td><td>REQ, câu 1</td><td>"Ít nhất 12 tháng" — tính thế nào (tháng dương lịch, tính tới ngày đặt hàng)?</td><td>góc nhìn tester</td><td>Minor</td></tr>
<tr><td>R4</td><td>REQ, câu 4</td><td>Không nói cách làm tròn khi đúng nửa (…500).</td><td>checklist: làm tròn</td><td>Minor</td></tr>
<tr><td>C1</td><td>dòng 5</td><td><code>months &gt; 12</code> phải là <code>&gt;= 12</code> ("ít nhất 12").</td><td>checklist: giá trị biên</td><td>Major</td></tr>
<tr><td>C2</td><td>dòng 5</td><td><code>total &gt; 500000</code> phải là <code>&gt;= 500000</code> ("từ 500.000 trở lên").</td><td>checklist: giá trị biên</td><td>Major</td></tr>
<tr><td>C3</td><td>dòng 10</td><td>Ép kiểu sẽ cắt bỏ phần lẻ; yêu cầu là làm tròn tới 1.000 gần nhất.</td><td>checklist: làm tròn</td><td>Major</td></tr>
<tr><td>C4</td><td>dòng 3</td><td>Không kiểm tra đầu vào: tổng âm cho ra giá âm, module thanh toán có thể biến nó thành tiền hoàn.</td><td>checklist: kiểm tra đầu vào</td><td>Critical</td></tr>
<tr><td>C5</td><td>dòng 4–10</td><td>Lưu tiền bằng <code>double</code> (dấu phẩy động nhị phân) — dùng số nguyên đồng hoặc BigDecimal.</td><td>checklist: kiểu dữ liệu tiền</td><td>Major</td></tr>
<tr><td>C6</td><td>dòng 7</td><td>Magic number 0.15 trong khi 0.1 đã có hằng — định nghĩa <code>VIP_RATE</code>.</td><td>checklist: magic number (chuẩn code)</td><td>Minor</td></tr>
<tr><td>C7</td><td>dòng 4, 10</td><td>Tên <code>d</code>, <code>p</code> không nói lên gì — nên là <code>discount</code>, <code>price</code>.</td><td>checklist: đặt tên</td><td>Minor</td></tr>
</tbody>
</table></div>
<p><strong>Xác nhận các phát hiện trong code (tuỳ chọn, sau buổi review).</strong> Review không chạy gì cả — nhưng để chứng tỏ đây là defect thật, phương thức đã được biên dịch và chạy (JDK 21) với đầu vào chọn theo các phát hiện:</p>
<pre><code>12 months,   600,000, normal -&gt; 600000  (spec: 540,000)     ← C1
13 months,   500,000, normal -&gt; 500000  (spec: 450,000)     ← C2
24 months,   612,345, normal -&gt; 551110  (spec: 551,000)     ← C3
24 months, 2,000,000, VIP    -&gt; 1800000 (spec: 1,800,000)   ← phần trần đúng
24 months,  -100,000, normal -&gt; -100000 (spec: not stated)  ← C4 / R2</code></pre>
<p>Để ý điều review làm được mà kiểm thử không làm được: R1–R4 là defect nằm trong <em>yêu cầu</em> — không test nào có thể fail theo một luật chưa ai viết ra. Và chỉ một dòng review đã bắt được cả C1 lẫn C2, trong khi kiểm thử động phải có đúng giá trị biên mới làm lộ chúng (Chương 4, BVA). Lab 1 yêu cầu bạn làm đúng việc này trên một lớp lớn hơn: ít nhất 10 defect được ghi nhận bằng checklist.</p>
<h4>Chọn loại review — bốn tình huống nhanh</h4>
<table>
<thead><tr><th>Tình huống</th><th>Loại</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>Developer muốn nhờ xem nhanh một bản sửa 20 dòng trước giờ trưa.</td><td>Informal (buddy check)</td><td>nhanh, rẻ, "giải quyết nhanh vấn đề nhỏ"</td></tr>
<tr><td>Kiến trúc mới cần giải thích cho 15 developer, đồng thời để họ chỉ ra vấn đề.</td><td>Walkthrough</td><td>tác giả dẫn, chuyển giao kiến thức, sản phẩm cấp cao</td></tr>
<tr><td>Hai thiết kế CSDL cạnh tranh; các trưởng nhóm phải chốt một.</td><td>Technical review</td><td>đạt đồng thuận giữa đồng nghiệp kỹ thuật, đánh giá phương án</td></tr>
<tr><td>Module điều khiển bay an toàn-sống-còn cần bằng chứng để được chứng nhận.</td><td>Inspection</td><td>quy trình xác định, entry/exit criteria, metric, audit trail; do facilitator được đào tạo dẫn — không bao giờ là tác giả</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><p><strong>Bẫy của phần này.</strong></p>
<ul>
<li><strong>Walkthrough</strong> — <em>tác giả</em> dẫn; scribe bắt buộc.</li>
<li><strong>Technical review</strong> — chuẩn bị cá nhân và scribe bắt buộc; scribe <em>không</em> là tác giả; họp là tuỳ chọn.</li>
<li><strong>Inspection</strong> — checklist, entry/exit criteria và metric bắt buộc; tác giả không được làm leader, reader hay scribe.</li>
<li><strong>Loại ≠ kỹ thuật</strong> — đừng nhầm <em>loại</em> review (chính quy tới đâu) với <em>kỹ thuật</em> review (một người đọc thế nào).</li>
</ul></div>
<div class="callout"><p><span class="badge">★ Ngoài giáo trình</span> <strong>Câu "perspective-based reading hiệu quả nhất" từ đâu ra.</strong></p>
<p>Nhận định ở slide 87 bắt nguồn từ các thí nghiệm của Victor Basili và cộng sự với Phòng thí nghiệm Kỹ nghệ phần mềm của NASA Goddard (công bố năm 1996).</p>
<ul>
<li><strong>Kết quả</strong> — các developer chuyên nghiệp review tài liệu yêu cầu tìm được nhiều defect hơn (tính cả nhóm) khi mỗi người đọc theo một góc nhìn được giao (thiết kế, tester, người dùng) và tạo ra một sản phẩm từ góc nhìn đó, so với khi dùng cách ad hoc hay checklist quen thuộc.</li>
<li><strong>Vì sao</strong> — các góc nhìn ít chồng lấn nhau.</li>
<li><strong>Các nghiên cứu lặp lại</strong> — xác nhận hiệu ứng với tài liệu yêu cầu, nhưng thấy nó nhỏ hơn với code, nơi công cụ và checklist đã làm tốt.</li>
</ul>
<p class="ghi-chu"><em>Ngoài giáo trình vì CTFL chỉ nêu kết quả mà không nói tới các nghiên cứu phía sau.</em></p></div>`),
    books([
      ['fst4', 'Ch.3 §2 "Review process" — review types, applying review techniques, success factors: book pp.89–99 (PDF 103–113); sample questions p.101, exercise p.103, solution p.105', 'Chương 3 §2 "Review process" — các loại review, áp dụng kỹ thuật review, yếu tố thành công: trang sách 89–99 (PDF 103–113); câu hỏi mẫu trang 101, bài tập trang 103, lời giải trang 105'],
      ['fst', '§3.2.3 Types of review and §3.2.4 success factors — pp.64–68 (PDF ≈67–71)', '§3.2.3 Các loại review và §3.2.4 yếu tố thành công — trang 64–68 (PDF ≈67–71)'],
      ['sp5', '§4.3.2 Different individual review techniques (PDF 137), §4.4 Types of review (PDF 144), §4.5 Critical factors, benefits and limits (PDF 150)', '§4.3.2 Các kỹ thuật review cá nhân (PDF 137), §4.4 Các loại review (PDF 144), §4.5 Yếu tố then chốt, lợi ích và giới hạn (PDF 150)'],
      ['sp4', '§4.1.5 Types of reviews — walkthrough, inspection, technical review, informal review: pp.88–95 (PDF 103–110)', '§4.1.5 Các loại review — walkthrough, inspection, technical review, informal review: trang 88–95 (PDF 103–110)'],
    ]),
  ].join('\n'),
};

/* ─────────────────────────── 3.4 Static analysis by tools ─────────────────────────── */
const L34 = {
  title: '3.4 — Static analysis: data flow, control flow, cyclomatic complexity & metrics|||3.4 — Phân tích tĩnh: luồng dữ liệu, luồng điều khiển, độ phức tạp cyclomatic & metric',
  slug: 'swt301-static-analysis',
  type: 'VIDEO',
  description: 'SWT3 slide 94–106: phân tích tĩnh bằng công cụ, data flow (defined/used, anomaly ur-du-dd), control flow, code không tới được, cyclomatic complexity V(G) ba cách tính, Halstead, fan-in/out, giới hạn của công cụ — ví dụ Java chạy thật.',
  content: [
    bi(`<span class="eyebrow">Chapter 3 · Lesson 3.4 · SWT3 slides 94–106</span>
<h2>Static analysis by tools</h2>
<p class="lead">Reviews use people; static analysis uses tools that read the code (or a model) the way a compiler does — without running it — and report what looks wrong.</p>
<p class="nhan">This last block of the deck shows the three things such tools compute</p>
<ol>
<li><strong>Data flow</strong> — how each variable is defined and used.</li>
<li><strong>Control flow</strong> — which paths exist, which code can never be reached.</li>
<li><strong>Metrics</strong> — above all <strong>cyclomatic complexity</strong>.</li>
</ol>
<p>You will calculate V(G) three ways and see a real compiler catch a data-flow fault.</p>
<div class="callout"><p><strong>Where this sits in the syllabus.</strong></p>
<ul>
<li><strong>CTFL 2018</strong> — folds static analysis into LO-3.1.1–3.1.3 (what it examines, its value, the defects it finds) and into Chapter 6 (static analysis tools, LO-6.1.1).</li>
<li><strong>The deck's detail</strong> on data flow, control flow and metrics follows the older CTFL 2011 section 3.3 "Static analysis by tools" (objective of static analysis, typical defects found, typical benefits).</li>
<li><strong>Coming back</strong> — cyclomatic complexity returns in white-box testing (Chapter 4) and in Lab 1, where you run a real static-analysis tool.</li>
</ul></div>
<table>
<thead><tr><th>Analysis</th><th>What it looks at</th><th>Typical findings</th></tr></thead>
<tbody>
<tr><td>Data flow</td><td>each variable: <strong>d</strong>efined (value stored), <strong>u</strong>sed/referenced (value read), <strong>u</strong>ndefined</td><td><strong>ur</strong> — used while undefined (a fault); <strong>dd</strong> — defined twice without use; <strong>du</strong> — defined then lost unused (anomalies)</td></tr>
<tr><td>Control flow</td><td>the flow graph: nodes = statements/blocks, edges = possible transfers</td><td>unreachable code, infinite loops, multiple loop entries, jumps to undefined labels, unstructured code</td></tr>
<tr><td>Metrics</td><td>numbers computed from the code</td><td><strong>V(G) = decisions + 1 = E − N + 2 = number of regions</strong>; LOC, Halstead, fan-in/fan-out, nesting, OO metrics</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 3 · Bài 3.4 · SWT3 slide 94–106</span>
<h2>Phân tích tĩnh bằng công cụ</h2>
<p class="lead">Review dùng con người; phân tích tĩnh dùng công cụ đọc code (hoặc mô hình) như trình biên dịch vẫn làm — không chạy nó — và báo những chỗ trông có vấn đề.</p>
<p class="nhan">Khối cuối của bộ slide cho thấy ba thứ các công cụ này tính</p>
<ol>
<li><strong>Luồng dữ liệu (data flow)</strong> — mỗi biến được gán và dùng thế nào.</li>
<li><strong>Luồng điều khiển (control flow)</strong> — có những đường đi nào, đoạn code nào không bao giờ tới được.</li>
<li><strong>Metric</strong> — quan trọng nhất là <strong>độ phức tạp cyclomatic</strong>.</li>
</ol>
<p>Bạn sẽ tính V(G) bằng ba cách và xem một trình biên dịch thật bắt lỗi luồng dữ liệu.</p>
<div class="callout"><p><strong>Vị trí trong syllabus.</strong></p>
<ul>
<li><strong>CTFL 2018</strong> — gộp phân tích tĩnh vào LO-3.1.1–3.1.3 (xem xét gì, giá trị, loại defect tìm được) và vào Chương 6 (công cụ phân tích tĩnh, LO-6.1.1).</li>
<li><strong>Phần chi tiết trong slide</strong> về data flow, control flow và metric theo mục 3.3 "Static analysis by tools" của CTFL 2011 cũ (mục tiêu của phân tích tĩnh, defect điển hình, lợi ích điển hình).</li>
<li><strong>Sẽ gặp lại</strong> — độ phức tạp cyclomatic quay lại ở kiểm thử hộp trắng (Chương 4) và ở Lab 1, nơi bạn chạy một công cụ phân tích tĩnh thật.</li>
</ul></div>
<table>
<thead><tr><th>Phân tích</th><th>Xem xét gì</th><th>Phát hiện điển hình</th></tr></thead>
<tbody>
<tr><td>Data flow</td><td>từng biến: <strong>d</strong> — được định nghĩa (gán giá trị), <strong>r/u</strong> — được dùng (đọc giá trị), <strong>u</strong> — chưa xác định</td><td><strong>ur</strong> — dùng khi chưa có giá trị (lỗi); <strong>dd</strong> — gán hai lần mà chưa dùng; <strong>du</strong> — gán rồi mất đi mà không dùng (anomaly)</td></tr>
<tr><td>Control flow</td><td>đồ thị luồng: đỉnh = lệnh/khối lệnh, cạnh = đường chuyển điều khiển có thể</td><td>code không tới được, vòng lặp vô hạn, vào vòng lặp từ nhiều chỗ, nhảy tới nhãn không tồn tại, code thiếu cấu trúc</td></tr>
<tr><td>Metric</td><td>các con số tính từ code</td><td><strong>V(G) = số quyết định + 1 = E − N + 2 = số miền</strong>; LOC, Halstead, fan-in/fan-out, độ lồng, metric hướng đối tượng</td></tr>
</tbody>
</table>`),
    walkHead(D, 94, 106),
    walk(D, [
      [94, 'CONTENTS — Static Analysis',
        `<p class="y-chinh">🎯 Third and last block of the deck: static analysis — finding faults with tools, without running the code.</p>
<ul>
<li><strong>Size</strong> — only thirteen slides (94–106), but dense.</li>
<li><strong>Exam weight</strong> — data flow, control flow and complexity are the parts most likely to turn into calculation questions.</li>
</ul>`,
        `<p class="y-chinh">🎯 Khối thứ ba và cuối cùng của bộ slide: phân tích tĩnh — dùng công cụ tìm lỗi mà không chạy code.</p>
<ul>
<li><strong>Độ dài</strong> — chỉ mười ba slide (94–106), nhưng dày.</li>
<li><strong>Trọng tâm thi</strong> — data flow, control flow và độ phức tạp là phần dễ biến thành câu hỏi tính toán nhất.</li>
</ul>`],
      [95, 'What can static analysis do?',
        `<p class="y-chinh">🎯 Static analysis is a form of <strong>automated testing</strong> that reads the code — it never executes it.</p>
<p class="nhan">What it checks for</p>
<ul>
<li><strong>Violations of standards</strong> — naming, layout, forbidden constructs, security rules.</li>
<li><strong>Things which may be a fault</strong> — note the word "may": a tool reports <em>anomalies</em>; a human decides whether each one is a real defect.</li>
</ul>
<p class="nhan">The bold reminder on the slide</p>
<p><strong>Static techniques do not execute the code.</strong></p>
<p class="nhan">Typical tools (the ones Lab 1 asks you to try)</p>
<ul>
<li><strong>Compilers</strong></li>
<li><strong>Linters</strong> — ESLint, Checkstyle</li>
<li><strong>Bug finders</strong> — SpotBugs/FindBugs, PMD, PVS-Studio</li>
<li><strong>Quality platforms</strong> — SonarQube</li>
</ul>`,
        `<p class="y-chinh">🎯 Phân tích tĩnh là một dạng <strong>kiểm thử tự động</strong> đọc code — nó không bao giờ chạy code.</p>
<p class="nhan">Nó kiểm tra gì</p>
<ul>
<li><strong>Vi phạm chuẩn</strong> — đặt tên, trình bày, cấu trúc bị cấm, luật bảo mật.</li>
<li><strong>Những thứ có thể là lỗi</strong> — để ý chữ "có thể": công cụ báo <em>anomaly</em>; con người quyết định cái nào là defect thật.</li>
</ul>
<p class="nhan">Dòng in đậm cần nhớ trên slide</p>
<p><strong>Kỹ thuật tĩnh không thực thi code.</strong></p>
<p class="nhan">Công cụ điển hình (chính các công cụ Lab 1 yêu cầu bạn thử)</p>
<ul>
<li><strong>Compiler</strong></li>
<li><strong>Linter</strong> — ESLint, Checkstyle</li>
<li><strong>Công cụ tìm bug</strong> — SpotBugs/FindBugs, PMD, PVS-Studio</li>
<li><strong>Nền tảng chất lượng</strong> — SonarQube</li>
</ul>`],
      [96, 'Static Analysis — descended from compiler technology',
        `<p class="y-chinh">🎯 Static analysis tools grew out of compilers: they <strong>extend</strong> what a compiler already knows about the code.</p>
<p class="nhan">The ancestor — the compiler</p>
<ul>
<li><strong>Already static</strong> — a compiler analyses code without running it and "knows" a lot about it, e.g. variable usage.</li>
<li><strong>Finds syntax faults</strong> — that is its basic job.</li>
</ul>
<p class="nhan">What static analysis tools can find in addition</p>
<ul>
<li><strong>Unreachable code</strong></li>
<li><strong>Undeclared variables</strong></li>
<li><strong>Parameter type mismatches</strong></li>
<li><strong>Uncalled functions and procedures</strong></li>
<li><strong>Array bound violations</strong>, etc.</li>
</ul>
<p class="nhan">It depends on the language</p>
<ul>
<li><strong>Java (strongly typed)</strong> — the compiler itself already rejects undeclared variables, type mismatches, some unreachable code and uninitialised reads. The worked example shows javac doing data-flow analysis.</li>
<li><strong>C or JavaScript</strong> — you need a separate tool for the same checks.</li>
</ul>`,
        `<p class="y-chinh">🎯 Công cụ phân tích tĩnh sinh ra từ trình biên dịch: chúng <strong>mở rộng</strong> những gì compiler vốn đã biết về code.</p>
<p class="nhan">Tổ tiên — trình biên dịch</p>
<ul>
<li><strong>Vốn đã "tĩnh"</strong> — compiler phân tích code mà không chạy nó và "biết" nhiều về nó, vd cách dùng biến.</li>
<li><strong>Tìm lỗi cú pháp</strong> — đó là việc cơ bản của nó.</li>
</ul>
<p class="nhan">Công cụ phân tích tĩnh tìm thêm được</p>
<ul>
<li><strong>Code không tới được</strong></li>
<li><strong>Biến chưa khai báo</strong></li>
<li><strong>Sai kiểu tham số</strong></li>
<li><strong>Hàm/thủ tục không bao giờ được gọi</strong></li>
<li><strong>Truy cập mảng vượt biên</strong>, v.v.</li>
</ul>
<p class="nhan">Tuỳ ngôn ngữ</p>
<ul>
<li><strong>Java (kiểu mạnh)</strong> — chính compiler đã từ chối biến chưa khai báo, sai kiểu, một số code không tới được và việc đọc biến chưa gán. Ví dụ có lời giải cho thấy javac làm data-flow analysis.</li>
<li><strong>C hay JavaScript</strong> — bạn cần công cụ riêng cho cùng các kiểm tra đó.</li>
</ul>`],
      [97, 'Data Flow Analysis',
        `<p class="y-chinh">🎯 Data-flow analysis follows every variable: where a value is stored, where it is read, and where it has none.</p>
<p class="nhan">The three states of a variable</p>
<ul>
<li><strong>Defined</strong> — a value is <em>stored</em> into it.</li>
<li><strong>Used</strong> — the stored value is <em>accessed</em>.</li>
<li><strong>Undefined</strong> — before it is first defined, or when it goes out of scope.</li>
</ul>
<p class="nhan">The asterisk: defined ≠ declared</p>
<p><code>int y;</code> <em>declares</em> y but leaves it <em>undefined</em> — it has no value yet.</p>
<p class="nhan">The two examples on the slide</p>
<ul>
<li><code>x = y + z</code> — x is <strong>defined</strong>; y and z are <strong>used</strong>.</li>
<li><code>if a &gt; b THEN read(S)</code> — a and b are <strong>used</strong>; S is <strong>defined</strong> (reading input stores a value).</li>
</ul>
<p class="nhan">What it buys you (teacher's notes)</p>
<ul>
<li><strong>Logic faults</strong> — e.g. use of undefined data.</li>
<li><strong>Security weaknesses</strong> — unchecked input flowing into sensitive operations.</li>
<li><strong>Performance hints</strong></li>
<li><strong>Code clean-up</strong></li>
</ul>`,
        `<p class="y-chinh">🎯 Data-flow analysis theo dõi từng biến: chỗ nào lưu giá trị vào, chỗ nào đọc ra, chỗ nào nó chưa có giá trị.</p>
<p class="nhan">Ba trạng thái của một biến</p>
<ul>
<li><strong>Defined (được định nghĩa)</strong> — một giá trị được <em>lưu</em> vào nó.</li>
<li><strong>Used (được dùng)</strong> — giá trị đã lưu được <em>đọc ra</em>.</li>
<li><strong>Undefined (chưa xác định)</strong> — trước lần định nghĩa đầu tiên, hoặc khi ra khỏi phạm vi.</li>
</ul>
<p class="nhan">Dấu sao: defined ≠ declared</p>
<p><code>int y;</code> <em>khai báo (declare)</em> y nhưng y vẫn <em>chưa xác định</em> — chưa có giá trị.</p>
<p class="nhan">Hai ví dụ trên slide</p>
<ul>
<li><code>x = y + z</code> — x được <strong>định nghĩa</strong>; y và z được <strong>dùng</strong>.</li>
<li><code>if a &gt; b THEN read(S)</code> — a và b được <strong>dùng</strong>; S được <strong>định nghĩa</strong> (đọc đầu vào là lưu một giá trị).</li>
</ul>
<p class="nhan">Lợi ích (theo ghi chú của thầy/cô)</p>
<ul>
<li><strong>Lỗi logic</strong> — vd dùng dữ liệu chưa xác định.</li>
<li><strong>Điểm yếu bảo mật</strong> — đầu vào chưa kiểm tra chảy vào thao tác nhạy cảm.</li>
<li><strong>Gợi ý hiệu năng</strong></li>
<li><strong>Dọn dẹp code</strong></li>
</ul>`],
      [98, 'Data Flow Analysis Faults',
        `<p class="y-chinh">🎯 One small loop, two findings: n is overwritten before it is used (an <em>anomaly</em>), y is read before it has a value (a <em>fault</em>).</p>
<p class="nhan">The pseudo-code</p>
<pre><code>n ← 0
read(x)
n ← 1
while x &gt; y do
begin
    read(y)
    write(n*y)
    x ← x − n
end</code></pre>
<p class="nhan">Finding 1 — data-flow anomaly (a dd pattern)</p>
<ul>
<li><strong>What</strong> — n is re-defined without being used: the value 0 is overwritten by 1 before anyone reads it.</li>
<li><strong>How bad</strong> — harmless here, but often a sign of a typo (e.g. the programmer meant to initialise another variable).</li>
</ul>
<p class="nhan">Finding 2 — data-flow fault (a ur pattern)</p>
<ul>
<li><strong>What</strong> — y is used before it has been defined, the first time around the loop.</li>
<li><strong>Why</strong> — the condition <code>x &gt; y</code> reads y, but y only gets a value <em>inside</em> the loop.</li>
<li><strong>How bad</strong> — a real defect: the program's behaviour depends on garbage.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> anomaly = suspicious; fault = wrong.</p>
<p class="ghi-chu">The worked example runs this code through javac.</p>`,
        `<p class="y-chinh">🎯 Một vòng lặp nhỏ, hai phát hiện: n bị ghi đè khi chưa được dùng (<em>anomaly</em>), y bị đọc khi chưa có giá trị (<em>fault</em>).</p>
<p class="nhan">Mã giả</p>
<pre><code>n ← 0
read(x)
n ← 1
while x &gt; y do
begin
    read(y)
    write(n*y)
    x ← x − n
end</code></pre>
<p class="nhan">Phát hiện 1 — data-flow anomaly (mẫu dd)</p>
<ul>
<li><strong>Là gì</strong> — n được định nghĩa lại khi chưa được dùng: giá trị 0 bị ghi đè bằng 1 trước khi ai đọc nó.</li>
<li><strong>Nặng không</strong> — ở đây vô hại, nhưng thường là dấu hiệu gõ nhầm (vd lập trình viên định khởi tạo biến khác).</li>
</ul>
<p class="nhan">Phát hiện 2 — data-flow fault (mẫu ur)</p>
<ul>
<li><strong>Là gì</strong> — y được dùng trước khi được định nghĩa, ở lượt đầu của vòng lặp.</li>
<li><strong>Vì sao</strong> — điều kiện <code>x &gt; y</code> đọc y, nhưng y chỉ có giá trị <em>bên trong</em> vòng lặp.</li>
<li><strong>Nặng không</strong> — defect thật: hành vi chương trình phụ thuộc vào giá trị rác.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> anomaly = đáng ngờ; fault = sai.</p>
<p class="ghi-chu">Ví dụ có lời giải cho đoạn code này chạy qua javac.</p>`],
      [99, 'Control Flow Analysis',
        `<p class="y-chinh">🎯 Control-flow analysis reads the flow graph and flags paths that are impossible, endless or badly structured.</p>
<p class="nhan">What it highlights</p>
<ul>
<li><strong>Nodes not accessible from the start node</strong> — dead code.</li>
<li><strong>Infinite loops</strong> — no path from the loop to the exit.</li>
<li><strong>Multiple entries to loops</strong> — jumping into the middle of a loop.</li>
<li><strong>Well structured?</strong> — i.e. <em>reducible</em>: built only from sequence, selection and iteration, so it can be collapsed step by step into a single node.</li>
<li><strong>Flowchart grammar</strong> — whether the code conforms to it.</li>
<li><strong>Jumps to undefined labels</strong> and <strong>labels never jumped to</strong> — goto-era problems, still relevant in C and assembly.</li>
<li><strong>Cyclomatic complexity and other metrics</strong></li>
</ul>
<p class="nhan">A practical trick (sp4 textbook)</p>
<p>A tool's predecessor–successor table exposes dead code: any statement (other than the first) that has no predecessor.</p>`,
        `<p class="y-chinh">🎯 Phân tích luồng điều khiển đọc đồ thị luồng và đánh dấu những đường đi không thể có, không có điểm dừng hoặc thiếu cấu trúc.</p>
<p class="nhan">Nó làm lộ những gì</p>
<ul>
<li><strong>Đỉnh không tới được từ đỉnh bắt đầu</strong> — code chết.</li>
<li><strong>Vòng lặp vô hạn</strong> — không có đường từ vòng lặp ra lối thoát.</li>
<li><strong>Vòng lặp có nhiều lối vào</strong> — nhảy vào giữa vòng lặp.</li>
<li><strong>Cấu trúc tốt không?</strong> — tức <em>reducible</em>: chỉ gồm tuần tự, rẽ nhánh, lặp nên thu gọn dần được thành một đỉnh.</li>
<li><strong>Văn phạm lưu đồ</strong> — code có tuân theo không.</li>
<li><strong>Nhảy tới nhãn không tồn tại</strong> và <strong>nhãn không ai nhảy tới</strong> — vấn đề thời goto, vẫn còn ở C và assembly.</li>
<li><strong>Độ phức tạp cyclomatic và các metric khác</strong></li>
</ul>
<p class="nhan">Mẹo thực tế (sách sp4)</p>
<p>Bảng tiền bối – hậu bối (predecessor–successor) của công cụ làm lộ code chết: mọi lệnh (trừ lệnh đầu) không có lệnh nào đứng trước.</p>`],
      [100, 'Unreachable code example',
        `<p class="y-chinh">🎯 Both constants are 1000, so <code>1000 &lt; 1000</code> is <em>always false</em> — the THEN clause can never run.</p>
<p class="nhan">The code</p>
<pre><code>Buffsize: 1000
Mailboxmax: 1000
IF Buffsize &lt; Mailboxmax THEN
    Error-Exit
ENDIF</code></pre>
<p class="nhan">What the tool does</p>
<p>Static analysis finds the THEN clause unreachable and flags it.</p>
<p class="nhan">Is it a defect?</p>
<ul>
<li><strong>Maybe a typo</strong> — the programmer meant <code>&gt;</code>.</li>
<li><strong>Maybe a deliberate safeguard</strong> — for the day someone changes the constants.</li>
<li><strong>The tool cannot tell</strong> — slide 105's limitation. Either way the finding deserves a human look.</li>
</ul>
<p class="nhan">Why dynamic testing misses it</p>
<p>No input can reach that line, so no test can ever reveal it.</p>`,
        `<p class="y-chinh">🎯 Cả hai hằng đều bằng 1000, nên <code>1000 &lt; 1000</code> <em>luôn sai</em> — nhánh THEN không bao giờ được chạy.</p>
<p class="nhan">Đoạn code</p>
<pre><code>Buffsize: 1000
Mailboxmax: 1000
IF Buffsize &lt; Mailboxmax THEN
    Error-Exit
ENDIF</code></pre>
<p class="nhan">Công cụ làm gì</p>
<p>Phân tích tĩnh thấy nhánh THEN không tới được và đánh dấu nó.</p>
<p class="nhan">Đó có phải defect không?</p>
<ul>
<li><strong>Có thể gõ nhầm</strong> — lập trình viên định viết <code>&gt;</code>.</li>
<li><strong>Có thể là chốt an toàn có chủ đích</strong> — cho ngày ai đó đổi hằng.</li>
<li><strong>Công cụ không phân biệt được</strong> — giới hạn ở slide 105. Dù sao phát hiện này cũng đáng để người xem lại.</li>
</ul>
<p class="nhan">Vì sao kiểm thử động bỏ sót</p>
<p>Không đầu vào nào tới được dòng đó, nên không test nào làm lộ được nó.</p>`],
      [101, 'Cyclomatic complexity',
        `<p class="y-chinh">🎯 Cyclomatic complexity V(G) measures how complex a <strong>flow graph</strong> — and so the code behind it — is: the more complex the graph, the bigger the number.</p>
<p class="nhan">Three equivalent ways to compute it</p>
<ol>
<li><strong>Decisions + 1</strong> — the easiest, the one the slide means.</li>
<li><strong>V(G) = E − N + 2</strong> — edges minus nodes plus 2, for one connected routine (McCabe, 1976).</li>
<li><strong>V(G) = number of regions</strong> — of the planar graph: the enclosed areas plus the outside.</li>
</ol>
<p class="nhan">What the number means</p>
<ul>
<li><strong>Independent paths</strong> — V(G) is the number of <em>linearly independent paths</em> through the code.</li>
<li><strong>Basis-path testing</strong> — needs that many tests.</li>
<li><strong>Decision coverage</strong> — V(G) is an upper bound for the tests it needs.</li>
<li><strong>McCabe's rule of thumb</strong> — above 10, consider splitting the routine.</li>
</ul>`,
        `<p class="y-chinh">🎯 Độ phức tạp cyclomatic V(G) đo độ phức tạp của một <strong>đồ thị luồng</strong> — và vì thế của đoạn code phía sau nó: đồ thị càng phức tạp, con số càng lớn.</p>
<p class="nhan">Ba cách tính tương đương</p>
<ol>
<li><strong>Số quyết định + 1</strong> — dễ nhất, chính là cách slide muốn nói.</li>
<li><strong>V(G) = E − N + 2</strong> — số cạnh trừ số đỉnh cộng 2, cho một thủ tục liên thông (McCabe, 1976).</li>
<li><strong>V(G) = số miền</strong> — của đồ thị phẳng: các vùng kín cộng vùng bên ngoài.</li>
</ol>
<p class="nhan">Con số đó nghĩa là gì</p>
<ul>
<li><strong>Đường đi độc lập</strong> — V(G) là số <em>đường đi độc lập tuyến tính</em> qua code.</li>
<li><strong>Basis-path testing</strong> — cần đúng ngần ấy test.</li>
<li><strong>Decision coverage</strong> — V(G) là cận trên của số test cần.</li>
<li><strong>Quy tắc kinh nghiệm của McCabe</strong> — trên 10 thì nên tách thủ tục.</li>
</ul>`],
      [102, 'Which flow graph is most complex? What is the cyclomatic complexity?',
        `<p class="y-chinh">🎯 Count the diamonds and add 1: the right-hand graph, with V(G) = 5, is the most complex.</p>
<p class="nhan">The four graphs (the red numbers are the answers)</p>
<ul>
<li><strong>Graph 1</strong> — two boxes in sequence, no decision → 0 + 1 = <strong>1</strong>.</li>
<li><strong>Graph 2</strong> — one diamond whose two branches rejoin → 1 + 1 = <strong>2</strong>.</li>
<li><strong>Graph 3</strong> — two diamonds, the second nested on the right branch of the first → 2 + 1 = <strong>3</strong>.</li>
<li><strong>Graph on the right</strong> — an outer diamond that can bypass everything, then three diamonds in a chain inside → 4 + 1 = <strong>5</strong>, the most complex.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> count only the diamonds (nodes with two outgoing arrows); boxes and joins never add complexity.</p>`,
        `<p class="y-chinh">🎯 Đếm hình thoi rồi cộng 1: đồ thị bên phải, V(G) = 5, là phức tạp nhất.</p>
<p class="nhan">Bốn đồ thị (các số đỏ là đáp án)</p>
<ul>
<li><strong>Đồ thị 1</strong> — hai ô nối tiếp, không có quyết định → 0 + 1 = <strong>1</strong>.</li>
<li><strong>Đồ thị 2</strong> — một hình thoi, hai nhánh nhập lại → 1 + 1 = <strong>2</strong>.</li>
<li><strong>Đồ thị 3</strong> — hai hình thoi, hình thứ hai lồng ở nhánh phải của hình thứ nhất → 2 + 1 = <strong>3</strong>.</li>
<li><strong>Đồ thị bên phải</strong> — một hình thoi ngoài có thể bỏ qua tất cả, bên trong là ba hình thoi nối tiếp → 4 + 1 = <strong>5</strong>, phức tạp nhất.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> chỉ đếm hình thoi (đỉnh có hai mũi tên đi ra); ô vuông và điểm nhập nhánh không bao giờ làm tăng độ phức tạp.</p>`],
      [103, 'Example control flow graph',
        `<p class="y-chinh">🎯 A quiz-grading routine with three decisions (do, if, if), so V(G) = 4.</p>
<p class="nhan">The pseudo-code</p>
<pre><code>Result = 0
Right = 0
DO WHILE more Questions
    IF Answer = Correct THEN
        Right = Right + 1
    ENDIF
END DO
Result = (Right / Questions)
IF Result &gt; 60% THEN
    Print "pass"
ELSE
    Print "fail"
ENDIF</code></pre>
<p class="nhan">Reading the graph on the right</p>
<ol>
<li><em>init</em> → <em>do</em> (the loop test).</li>
<li><em>do</em> → <em>if</em> → (<em>r=r+1</em>) → <em>end</em>, and back to <em>do</em>.</li>
<li>When the loop ends → <em>res</em> → <em>if</em> → <em>pass</em> or <em>fail</em> → <em>end</em>.</li>
</ol>
<p class="nhan">Computing V(G) two ways</p>
<ul>
<li><strong>Decisions + 1</strong> — do, if, if → 3 + 1 = <strong>4</strong>.</li>
<li><strong>E − N + 2</strong> — the drawn graph has 10 nodes and 12 edges → 12 − 10 + 2 = <strong>4</strong> (confirmed by a script in the worked example).</li>
</ul>
<p class="nhan">Two bonus static findings a good reviewer sees</p>
<ul>
<li><strong><code>Result = 0</code></strong> — overwritten without being used: a <em>dd</em>-anomaly, like n on slide 98.</li>
<li><strong><code>Right / Questions</code></strong> — divides by zero when there are no questions; and in integer arithmetic 9/10 = 0, so almost everyone would fail.</li>
</ul>`,
        `<p class="y-chinh">🎯 Một thủ tục chấm bài có ba quyết định (do, if, if), nên V(G) = 4.</p>
<p class="nhan">Mã giả</p>
<pre><code>Result = 0
Right = 0
DO WHILE more Questions
    IF Answer = Correct THEN
        Right = Right + 1
    ENDIF
END DO
Result = (Right / Questions)
IF Result &gt; 60% THEN
    Print "pass"
ELSE
    Print "fail"
ENDIF</code></pre>
<p class="nhan">Đọc đồ thị bên phải</p>
<ol>
<li><em>init</em> → <em>do</em> (kiểm tra vòng lặp).</li>
<li><em>do</em> → <em>if</em> → (<em>r=r+1</em>) → <em>end</em>, rồi quay lại <em>do</em>.</li>
<li>Khi hết vòng lặp → <em>res</em> → <em>if</em> → <em>pass</em> hoặc <em>fail</em> → <em>end</em>.</li>
</ol>
<p class="nhan">Tính V(G) bằng hai cách</p>
<ul>
<li><strong>Số quyết định + 1</strong> — do, if, if → 3 + 1 = <strong>4</strong>.</li>
<li><strong>E − N + 2</strong> — đồ thị vẽ có 10 đỉnh, 12 cạnh → 12 − 10 + 2 = <strong>4</strong> (được script xác nhận trong ví dụ có lời giải).</li>
</ul>
<p class="nhan">Hai phát hiện tĩnh "tặng thêm" mà người review giỏi sẽ thấy</p>
<ul>
<li><strong><code>Result = 0</code></strong> — bị ghi đè khi chưa được dùng: dd-anomaly, giống n ở slide 98.</li>
<li><strong><code>Right / Questions</code></strong> — chia cho 0 khi không có câu hỏi nào; còn với số nguyên thì 9/10 = 0, nên gần như ai cũng trượt.</li>
</ul>`],
      [104, 'Other static metrics',
        `<p class="y-chinh">🎯 Besides V(G), tools compute other numbers from the code — they tell you where to look, not what is wrong.</p>
<p class="nhan">The metrics on the slide</p>
<ul>
<li><strong>Lines of code (LOC)</strong> — size; crude but useful for normalising (defects per KLOC).</li>
<li><strong>Operands &amp; operators (Halstead's metrics)</strong> — from the counts of distinct and total operators/operands, Halstead derives program vocabulary, length, volume, difficulty and effort.</li>
<li><strong>Fan-in</strong> — how many modules call this one. High fan-in: widely reused, so changes are risky.</li>
<li><strong>Fan-out</strong> — how many modules it calls. High fan-out: depends on a lot, hard to test in isolation.</li>
<li><strong>Nesting levels</strong> — deep nesting hurts readability.</li>
<li><strong>Function calls</strong></li>
<li><strong>OO metrics</strong> — depth of the inheritance tree, number of methods, coupling between classes, cohesion within a class.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> metrics do not say a module <em>is</em> wrong; they say where to look first (defect clustering, Principle 4).</p>`,
        `<p class="y-chinh">🎯 Ngoài V(G), công cụ còn tính nhiều con số khác từ code — chúng chỉ nên xem chỗ nào, không nói chỗ nào sai.</p>
<p class="nhan">Các metric trên slide</p>
<ul>
<li><strong>Số dòng code (LOC)</strong> — kích thước; thô nhưng hữu ích để chuẩn hoá (số defect trên nghìn dòng).</li>
<li><strong>Toán hạng &amp; toán tử (metric Halstead)</strong> — từ số toán tử/toán hạng phân biệt và tổng số, Halstead suy ra từ vựng, độ dài, thể tích, độ khó và công sức của chương trình.</li>
<li><strong>Fan-in</strong> — bao nhiêu module gọi module này. Fan-in cao: được dùng lại nhiều, sửa là rủi ro.</li>
<li><strong>Fan-out</strong> — module này gọi bao nhiêu module khác. Fan-out cao: phụ thuộc nhiều, khó test độc lập.</li>
<li><strong>Độ lồng</strong> — lồng sâu thì khó đọc.</li>
<li><strong>Số lời gọi hàm</strong></li>
<li><strong>Metric hướng đối tượng</strong> — độ sâu cây kế thừa, số phương thức, độ kết dính giữa các lớp (coupling), độ gắn kết trong lớp (cohesion).</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> metric không nói module <em>sai</em>; nó chỉ nói nên xem chỗ nào trước (defect clustering, Nguyên tắc 4).</p>`],
      [105, 'Limitations and advantages',
        `<p class="y-chinh">🎯 Static analysis finds faults that are hard to see, but it raises false alarms and knows nothing about run-time conditions.</p>
<p class="nhan">Limitations</p>
<ul>
<li><strong>Cannot tell intent from error</strong> — it cannot distinguish deliberately written code from real programming faults or anomalies, so it often produces an <strong>overload of spurious messages</strong> (false positives).</li>
<li><strong>Does not execute the code</strong> — so its results are <strong>not related to operating conditions</strong> (performance, memory under load, the real environment).</li>
</ul>
<p class="nhan">Advantages</p>
<ul>
<li><strong>Finds faults that are difficult to "see"</strong> — e.g. a data-flow fault buried among hundreds of lines.</li>
<li><strong>Objective quality assessment</strong> — the same code always gets the same numbers.</li>
</ul>
<p class="nhan">The teacher's note — fail-safe code</p>
<ul>
<li><strong>What it is</strong> — defensive checks, input validation and exception handling written on purpose, so a system stays safe when something goes wrong.</li>
<li><strong>Why it is here</strong> — the original version of this slide says the tool "cannot distinguish <em>fail-safe</em> code from programming faults": a defensive check that can never fire today, like slide 100, looks exactly like dead code to a tool.</li>
</ul>`,
        `<p class="y-chinh">🎯 Phân tích tĩnh tìm được lỗi khó thấy, nhưng hay báo động nhầm và không biết gì về điều kiện lúc chạy.</p>
<p class="nhan">Giới hạn</p>
<ul>
<li><strong>Không phân biệt chủ đích với lỗi</strong> — không phân biệt được code viết có chủ đích với lỗi lập trình hay anomaly thật, nên thường sinh ra <strong>quá nhiều cảnh báo thừa</strong> (false positive).</li>
<li><strong>Không chạy code</strong> — nên kết quả <strong>không liên quan tới điều kiện vận hành</strong> (hiệu năng, bộ nhớ khi tải cao, môi trường thật).</li>
</ul>
<p class="nhan">Ưu điểm</p>
<ul>
<li><strong>Tìm được lỗi khó "nhìn thấy"</strong> — vd một lỗi luồng dữ liệu vùi giữa hàng trăm dòng.</li>
<li><strong>Đánh giá chất lượng khách quan</strong> — cùng một code luôn ra cùng con số.</li>
</ul>
<p class="nhan">Ghi chú của thầy/cô — fail-safe code</p>
<ul>
<li><strong>Là gì</strong> — các kiểm tra phòng thủ, xác thực đầu vào, xử lý ngoại lệ được viết cố ý để hệ thống vẫn an toàn khi có sự cố.</li>
<li><strong>Vì sao nhắc ở đây</strong> — bản gốc của slide này ghi công cụ "không phân biệt được code <em>fail-safe</em> với lỗi lập trình": một kiểm tra phòng thủ hôm nay không bao giờ kích hoạt, như ở slide 100, trong mắt công cụ trông y hệt code chết.</li>
</ul>`],
      [106, 'Summary: Key Points',
        `<p class="y-chinh">🎯 The whole chapter in three sentences.</p>
<ol>
<li><strong>Reviews</strong> help to find faults in development and test documentation, and should be applied early.</li>
<li><strong>Types of review</strong>: informal, walkthrough, technical/peer review, inspection.</li>
<li><strong>Static analysis</strong> can find faults and give information about code without executing it.</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> if you can explain each of these with one example, you have the chapter.</p>`,
        `<p class="y-chinh">🎯 Cả chương gói trong ba câu.</p>
<ol>
<li><strong>Review</strong> giúp tìm lỗi trong tài liệu phát triển và tài liệu test, và nên áp dụng sớm.</li>
<li><strong>Các loại review</strong>: informal, walkthrough, technical/peer review, inspection.</li>
<li><strong>Phân tích tĩnh</strong> tìm được lỗi và cung cấp thông tin về code mà không cần chạy nó.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> nếu giải thích được mỗi ý bằng một ví dụ, bạn đã nắm được cả chương.</p>`],
    ]),
    bi(`<h3>Ví dụ có lời giải · Worked example — data flow, control flow and V(G), checked by running the code</h3>
<h4>Part A — slide 98 through a real compiler</h4>
<p>Slide 98 written line for line in Java:</p>
<pre><code>int n = 0;                 // n defined ...
int x = in.nextInt();
n = 1;                     // ... and re-defined without being used (dd)
int y;                     // declared, NOT defined
while (x &gt; y) {            // y used before it has been defined (ur)
    y = in.nextInt();
    System.out.println(n * y);
    x = x - n;
}</code></pre>
<p>Compiling it with <code>javac</code> (JDK 21) — real output:</p>
<pre><code>DataFlowFault.java:10: error: variable y might not have been initialized
        while (x &gt; y) {            // y used before it has been defined (ur) on the first pass
                   ^
1 error</code></pre>
<p>Java's "definite assignment" rule is a data-flow analysis built into the compiler (slide 96): the <em>ur</em> fault is rejected before the program can ever run. The <em>dd</em>-anomaly on n is legal Java, so javac stays silent; tools such as PMD or SonarLint report it as an unused assignment.</p>
<h4>Part B — the data-flow table by hand, then by script</h4>
<table>
<thead><tr><th>Line</th><th>Statement</th><th>n</th><th>x</th><th>y</th></tr></thead>
<tbody>
<tr><td>1</td><td>n ← 0</td><td>d</td><td>–</td><td>–</td></tr>
<tr><td>2</td><td>read(x)</td><td></td><td>d</td><td></td></tr>
<tr><td>3</td><td>n ← 1</td><td><strong>d (dd!)</strong></td><td></td><td></td></tr>
<tr><td>4</td><td>while x &gt; y</td><td></td><td>r</td><td><strong>r while u (ur!)</strong></td></tr>
<tr><td>5</td><td>read(y)</td><td></td><td></td><td>d</td></tr>
<tr><td>6</td><td>write(n*y)</td><td>r</td><td></td><td>r</td></tr>
<tr><td>7</td><td>x ← x − n</td><td>r</td><td>r, d</td><td></td></tr>
</tbody>
</table>
<p>Walking the paths with the loop taken 0, 1 and 2 times reveals a third anomaly the slide does not mention: on the path where the loop body never runs, the value 1 given to n on line 3 is <em>never used</em> before the program ends — a <em>du</em>-anomaly on that path. A small node script that tracks each variable's state along those paths prints:</p>
<pre><code>slide 98: dd-anomaly: n re-defined in "n := 1" without the previous value being used
slide 98: ur-anomaly: y used in "while x &gt; y" before any definition
slide 98: du-anomaly: n (last defined in "n := 1") goes out of scope unused when the loop runs 0 time(s)</code></pre>
<h4>Part C — slide 103 as Java: control flow, V(G) and two defects</h4>
<pre><code>static String gradeAsWritten(boolean[] answers) {
    int result = 0;                         // dd-anomaly: never used before the next definition
    int right = 0;
    for (boolean correct : answers) {       // decision 1 (loop)
        if (correct) {                      // decision 2
            right = right + 1;
        }
    }
    result = right / answers.length;        // integer division!
    if (result &gt; 0.60) {                    // decision 3
        return "pass";
    } else {
        return "fail";
    }
}</code></pre>
<ol>
<li><strong>Decisions + 1:</strong> loop, if, if → 3 + 1 = <strong>4</strong>.</li>
<li><strong>E − N + 2</strong> on the slide's graph: nodes init, do, if, r=r+1, end, res, if, pass, fail, end = 10; edges init→do, do→if, do→res, if→r=r+1, if→end, r=r+1→end, end→do, res→if, if→pass, if→fail, pass→end, fail→end = 12 → 12 − 10 + 2 = <strong>4</strong>.</li>
<li><strong>Regions:</strong> the loop encloses two areas (the if inside it, and the loop back-edge), the second if one more, plus the outside region → <strong>4</strong>.</li>
</ol>
<p>Script check (node) — real output:</p>
<pre><code>slide 103: N = 10 E = 12 -&gt; V(G) = E - N + 2 = 4 | decisions = 3 -&gt; decisions + 1 = 4
slide 102 graph 1: 0 decisions -&gt; V(G) = 1
slide 102 graph 2: 1 decisions -&gt; V(G) = 2
slide 102 graph 3: 2 decisions -&gt; V(G) = 3
slide 102 graph 4 (labelled 5): 4 decisions -&gt; V(G) = 5</code></pre>
<p><strong>What V(G) = 4 tells a tester:</strong> there are 4 linearly independent paths (basis-path testing needs 4 tests), but decision coverage needs fewer — 2 tests suffice here: 2 questions with 1 right (loop entered and left, inner if true and false, 50% → "fail") and 1 question right (100% → "pass"). V(G) is an upper bound for decision coverage, not the exact number.</p>
<p><strong>The defects a reviewer finds by reading</strong>, confirmed by running the method next to a fixed version (the fix: return "fail" when there are no questions, divide as <code>double</code>, drop the dead <code>result = 0</code>) — real output:</p>
<pre><code> 9/10 correct -&gt; as written: fail | fixed: pass
 6/10 correct -&gt; as written: fail | fixed: fail
 7/10 correct -&gt; as written: fail | fixed: pass
10/10 correct -&gt; as written: pass | fixed: pass
 0/ 0 questions -&gt; as written: ArithmeticException: / by zero | fixed: fail</code></pre>
<p>Integer division makes 9/10 equal 0, so only a perfect score passes; an empty quiz crashes. Neither needs a test to be spotted — a reviewer or a static-analysis rule ("integer division result compared with a fraction", "possible division by zero") finds both in seconds.</p>
<div class="pitfall co-tieu-de"><p><strong>Exam traps.</strong></p>
<ol>
<li><strong>Defined ≠ declared</strong> — <code>int y;</code> leaves y undefined.</li>
<li><strong>Count decisions, not boxes</strong> — a loop is a decision; an <code>if</code> without <code>else</code> is still one decision.</li>
<li><strong>Compound conditions</strong> — the flow-graph method counts <code>if (a &amp;&amp; b)</code> once, but tools such as PMD and Checkstyle count each <code>&amp;&amp;</code>/<code>||</code> as an extra decision. For the <code>finalPrice</code> method of lesson 3.3 that is 3 + 1 = 4 by the graph, 5 by the tools.</li>
<li><strong>Anomaly ≠ defect</strong> — a data-flow <em>anomaly</em> is not automatically a defect; a <em>ur</em> (use before definition) almost always is.</li>
</ol></div>
<div class="callout"><p><span class="badge">★ Beyond the syllabus</span> <strong>Beyond V(G): cognitive complexity and taint analysis.</strong></p>
<ul>
<li><strong>Cognitive complexity</strong> — cyclomatic complexity treats a flat <code>switch</code> with 10 cases like ten nested <code>if</code>s, although the first is far easier to read. SonarSource's <em>cognitive complexity</em> (2017) penalises nesting and breaks in linear flow instead; SonarQube now reports both.</li>
<li><strong>Taint analysis</strong> — data-flow analysis also powers modern security scanners (SAST). It marks values from users as "tainted" and follows them through assignments exactly like the d/u analysis of slide 97.</li>
<li><strong>The alarm</strong> — raised when a tainted value reaches a "sink" such as an SQL query without passing a sanitiser: the static detection of SQL injection mentioned on slide 13.</li>
</ul>
<p class="ghi-chu"><em>Outside the syllabus because CTFL stops at cyclomatic complexity and generic data-flow anomalies.</em></p></div>`,
    `<h3>Ví dụ có lời giải · Data flow, control flow và V(G), kiểm chứng bằng cách chạy code</h3>
<h4>Phần A — slide 98 qua một trình biên dịch thật</h4>
<p>Slide 98 viết lại từng dòng bằng Java:</p>
<pre><code>int n = 0;                 // n defined ...
int x = in.nextInt();
n = 1;                     // ... and re-defined without being used (dd)
int y;                     // declared, NOT defined
while (x &gt; y) {            // y used before it has been defined (ur)
    y = in.nextInt();
    System.out.println(n * y);
    x = x - n;
}</code></pre>
<p>Biên dịch bằng <code>javac</code> (JDK 21) — kết quả thật:</p>
<pre><code>DataFlowFault.java:10: error: variable y might not have been initialized
        while (x &gt; y) {            // y used before it has been defined (ur) on the first pass
                   ^
1 error</code></pre>
<p>Quy tắc "definite assignment" của Java chính là một phép data-flow analysis cài sẵn trong compiler (slide 96): lỗi <em>ur</em> bị từ chối trước khi chương trình có cơ hội chạy. Còn dd-anomaly của n là Java hợp lệ nên javac im lặng; các công cụ như PMD hay SonarLint sẽ báo nó là phép gán không dùng tới.</p>
<h4>Phần B — bảng luồng dữ liệu bằng tay, rồi bằng script</h4>
<table>
<thead><tr><th>Dòng</th><th>Lệnh</th><th>n</th><th>x</th><th>y</th></tr></thead>
<tbody>
<tr><td>1</td><td>n ← 0</td><td>d</td><td>–</td><td>–</td></tr>
<tr><td>2</td><td>read(x)</td><td></td><td>d</td><td></td></tr>
<tr><td>3</td><td>n ← 1</td><td><strong>d (dd!)</strong></td><td></td><td></td></tr>
<tr><td>4</td><td>while x &gt; y</td><td></td><td>r</td><td><strong>r khi đang u (ur!)</strong></td></tr>
<tr><td>5</td><td>read(y)</td><td></td><td></td><td>d</td></tr>
<tr><td>6</td><td>write(n*y)</td><td>r</td><td></td><td>r</td></tr>
<tr><td>7</td><td>x ← x − n</td><td>r</td><td>r, d</td><td></td></tr>
</tbody>
</table>
<p>Đi dọc các đường với vòng lặp chạy 0, 1 và 2 lần sẽ lộ ra anomaly thứ ba mà slide không nhắc: trên đường mà thân vòng lặp không chạy lần nào, giá trị 1 gán cho n ở dòng 3 <em>không bao giờ được dùng</em> trước khi chương trình kết thúc — một du-anomaly trên đường đó. Một script node nhỏ theo dõi trạng thái từng biến dọc các đường ấy in ra:</p>
<pre><code>slide 98: dd-anomaly: n re-defined in "n := 1" without the previous value being used
slide 98: ur-anomaly: y used in "while x &gt; y" before any definition
slide 98: du-anomaly: n (last defined in "n := 1") goes out of scope unused when the loop runs 0 time(s)</code></pre>
<h4>Phần C — slide 103 bằng Java: luồng điều khiển, V(G) và hai defect</h4>
<pre><code>static String gradeAsWritten(boolean[] answers) {
    int result = 0;                         // dd-anomaly: never used before the next definition
    int right = 0;
    for (boolean correct : answers) {       // decision 1 (loop)
        if (correct) {                      // decision 2
            right = right + 1;
        }
    }
    result = right / answers.length;        // integer division!
    if (result &gt; 0.60) {                    // decision 3
        return "pass";
    } else {
        return "fail";
    }
}</code></pre>
<ol>
<li><strong>Số quyết định + 1:</strong> vòng lặp, if, if → 3 + 1 = <strong>4</strong>.</li>
<li><strong>E − N + 2</strong> trên đồ thị của slide: các đỉnh init, do, if, r=r+1, end, res, if, pass, fail, end = 10; các cạnh init→do, do→if, do→res, if→r=r+1, if→end, r=r+1→end, end→do, res→if, if→pass, if→fail, pass→end, fail→end = 12 → 12 − 10 + 2 = <strong>4</strong>.</li>
<li><strong>Số miền:</strong> vòng lặp bao hai vùng kín (lệnh if bên trong, và cạnh quay lui của vòng lặp), lệnh if thứ hai thêm một vùng, cộng vùng bên ngoài → <strong>4</strong>.</li>
</ol>
<p>Kiểm bằng script (node) — kết quả thật:</p>
<pre><code>slide 103: N = 10 E = 12 -&gt; V(G) = E - N + 2 = 4 | decisions = 3 -&gt; decisions + 1 = 4
slide 102 graph 1: 0 decisions -&gt; V(G) = 1
slide 102 graph 2: 1 decisions -&gt; V(G) = 2
slide 102 graph 3: 2 decisions -&gt; V(G) = 3
slide 102 graph 4 (labelled 5): 4 decisions -&gt; V(G) = 5</code></pre>
<p><strong>V(G) = 4 nói gì với tester:</strong> có 4 đường đi độc lập tuyến tính (basis-path testing cần 4 test), nhưng decision coverage cần ít hơn — ở đây 2 test là đủ: 2 câu hỏi đúng 1 (vòng lặp vào và ra, if bên trong đúng và sai, 50% → "fail") và 1 câu hỏi đúng (100% → "pass"). V(G) là cận trên cho decision coverage, không phải con số chính xác.</p>
<p><strong>Các defect người review tìm được chỉ bằng cách đọc</strong>, được xác nhận khi chạy phương thức cạnh bản đã sửa (bản sửa: trả "fail" khi không có câu hỏi, chia bằng <code>double</code>, bỏ dòng <code>result = 0</code> thừa) — kết quả thật:</p>
<pre><code> 9/10 correct -&gt; as written: fail | fixed: pass
 6/10 correct -&gt; as written: fail | fixed: fail
 7/10 correct -&gt; as written: fail | fixed: pass
10/10 correct -&gt; as written: pass | fixed: pass
 0/ 0 questions -&gt; as written: ArithmeticException: / by zero | fixed: fail</code></pre>
<p>Chia số nguyên làm 9/10 bằng 0, nên chỉ ai đúng hết mới qua; bài không có câu hỏi thì chương trình sập. Cả hai không cần test mới thấy — người review hoặc một luật phân tích tĩnh ("kết quả chia số nguyên đem so với số thập phân", "có thể chia cho 0") tìm ra trong vài giây.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy đề thi.</strong></p>
<ol>
<li><strong>Defined ≠ declared</strong> — <code>int y;</code> để y chưa có giá trị.</li>
<li><strong>Đếm quyết định, không đếm ô</strong> — vòng lặp là một quyết định; <code>if</code> không có <code>else</code> vẫn là một quyết định.</li>
<li><strong>Điều kiện ghép</strong> — cách đếm trên đồ thị tính <code>if (a &amp;&amp; b)</code> một lần, nhưng công cụ như PMD và Checkstyle tính mỗi <code>&amp;&amp;</code>/<code>||</code> thêm một quyết định. Với phương thức <code>finalPrice</code> ở bài 3.3 là 3 + 1 = 4 theo đồ thị, 5 theo công cụ.</li>
<li><strong>Anomaly ≠ defect</strong> — data-flow <em>anomaly</em> chưa chắc là defect; còn <em>ur</em> (dùng trước khi gán) thì gần như luôn là defect.</li>
</ol></div>
<div class="callout"><p><span class="badge">★ Ngoài giáo trình</span> <strong>Vượt khỏi V(G): cognitive complexity và taint analysis.</strong></p>
<ul>
<li><strong>Cognitive complexity</strong> — độ phức tạp cyclomatic coi một <code>switch</code> phẳng 10 nhánh ngang với mười <code>if</code> lồng nhau, dù cái đầu dễ đọc hơn nhiều. <em>Cognitive complexity</em> của SonarSource (2017) thay vào đó phạt độ lồng và các chỗ ngắt mạch đọc tuyến tính; SonarQube hiện báo cả hai.</li>
<li><strong>Taint analysis</strong> — data-flow analysis cũng là nền của các công cụ quét bảo mật hiện đại (SAST). Nó đánh dấu giá trị đến từ người dùng là "nhiễm bẩn" và lần theo nó qua các phép gán đúng như phân tích d/u ở slide 97.</li>
<li><strong>Báo động</strong> — khi giá trị bẩn tới một "điểm chìm" như câu truy vấn SQL mà chưa qua bước làm sạch: chính là cách phát hiện tĩnh SQL injection nhắc ở slide 13.</li>
</ul>
<p class="ghi-chu"><em>Ngoài giáo trình vì CTFL dừng ở độ phức tạp cyclomatic và các data-flow anomaly chung chung.</em></p></div>`),
    books([
      ['fst4', 'Ch.3 §1 static testing incl. static analysis — book pp.75–78 (PDF 89–92); static analysis tools in Ch.6 §1 tool classification, from p.203 (PDF 217)', 'Chương 3 §1 kiểm thử tĩnh gồm cả phân tích tĩnh — trang sách 75–78 (PDF 89–92); công cụ phân tích tĩnh ở Chương 6 §1 phân loại công cụ, từ trang 203 (PDF 217)'],
      ['fst', '§3.3 "Static analysis by tools" — pp.69–74 (PDF ≈72–77); cyclomatic complexity p.70 (PDF 73)', '§3.3 "Static analysis by tools" — trang 69–74 (PDF ≈72–77); độ phức tạp cyclomatic trang 70 (PDF 73)'],
      ['sp5', '§7.1.3 Static test tools — code metrics, data-flow anomalies ur/du/dd with a C++ example: PDF 311–313', '§7.1.3 Static test tools — metric code, data-flow anomaly ur/du/dd kèm ví dụ C++: PDF 311–313'],
      ['sp4', '§4.2 Static analysis p.95, the compiler as a static analysis tool p.97, data flow analysis p.98, control flow analysis p.99, metrics & cyclomatic number pp.100–102 (PDF 110–117)', '§4.2 Static analysis trang 95, compiler là công cụ phân tích tĩnh trang 97, data flow analysis trang 98, control flow analysis trang 99, metric & cyclomatic number trang 100–102 (PDF 110–117)'],
    ]),
  ].join('\n'),
};

/* ──────────────────── 3.5 More from the 2023 slide set (SWT3.ppt) ──────────────────── */
const O = 'oswt3';
const L35 = {
  title: '3.5 — More from the 2023 slide set: people techniques, old review types & why inspection is different|||3.5 — Bổ sung từ bộ slide 2023: kỹ thuật con người, các loại review kiểu cũ & inspection khác gì',
  slug: 'swt301-ch3-slides-2023',
  type: 'VIDEO',
  description: 'Bộ slide SWT3 bản 2023 (43 trang): những trang bài 3.1–3.4 chưa có — kỹ thuật cá nhân/nhóm, lợi ích review, cái gì inspect/review được, 5 loại review kiểu cũ đổi sang tên CTFL, "Reviews in general" 1–4, 3 trang "Inspection is different", sơ đồ quy trình inspection kiểu cũ — kèm bảng đổi thuật ngữ cũ → mới.',
  content: [
    bi(`<span class="eyebrow">Chapter 3 · Lesson 3.5 · SWT3 (2023) pages 1–43</span>
<h2>More from the 2023 slide set: what the older deck adds</h2>
<p class="lead">Before the current <em>SWT3_tim</em> deck, the course used an older <em>SWT3.ppt</em> (43 pages). Most of it survived into the new deck, and lessons 3.1–3.4 already teach it. About a third of the pages did not survive.</p>
<ul>
<li><strong>What this lesson shows</strong> — every old page that teaches something the current lessons do not, with its picture and an explanation.</li>
<li><strong>What it does not repeat</strong> — pages already taught elsewhere are listed in the table below, with the lesson and slide where you find them.</li>
<li><strong>Old wording</strong> — the old deck follows an older ISTQB/ISEB syllabus. Each card says where its words differ from the current CTFL terms, so you learn the right vocabulary for the exam.</li>
</ul>
<div class="callout"><p><strong>Learning objectives.</strong></p>
<ul>
<li>Tell individual static techniques (desk-checking, data-stepping, proof-reading) from group techniques (reviews).</li>
<li>List what can be inspected and what can be reviewed, and explain why "review" is the wider word.</li>
<li>Map the old review types (informal, technical/peer, decision-making, walkthrough, inspection) to the four CTFL review types.</li>
<li>Map the old review activities, roles and deliverables to the CTFL 2018 review process (lesson 3.2).</li>
<li>Explain in three contrasts why an inspection is different from an ordinary review.</li>
</ul></div>`,
    `<span class="eyebrow">Chương 3 · Bài 3.5 · SWT3 (2023) trang 1–43</span>
<h2>Bổ sung từ bộ slide 2023: bộ slide cũ thêm được gì</h2>
<p class="lead">Trước bộ <em>SWT3_tim</em> hiện nay, môn học dùng bộ <em>SWT3.ppt</em> cũ hơn (43 trang). Phần lớn đã được giữ sang bộ mới, và bài 3.1–3.4 đã dạy. Khoảng một phần ba số trang thì không được giữ lại.</p>
<ul>
<li><strong>Bài này có gì</strong> — mọi trang cũ dạy điều mà các bài hiện tại chưa có, kèm ảnh slide và lời giải thích.</li>
<li><strong>Bài này không lặp lại gì</strong> — các trang đã dạy ở bài khác nằm trong bảng dưới đây, ghi rõ bài và số slide để bạn tra.</li>
<li><strong>Từ ngữ cũ</strong> — bộ slide cũ theo syllabus ISTQB/ISEB đời trước. Mỗi thẻ đều ghi chỗ nào từ ngữ khác thuật ngữ CTFL hiện hành, để bạn học đúng từ đi thi.</li>
</ul>
<div class="callout"><p><strong>Chuẩn đầu ra.</strong></p>
<ul>
<li>Phân biệt kỹ thuật tĩnh cá nhân (desk-checking, data-stepping, proof-reading) với kỹ thuật nhóm (review).</li>
<li>Kể được cái gì inspect được, cái gì review được, và giải thích vì sao "review" là từ rộng hơn.</li>
<li>Đổi các loại review kiểu cũ (informal, technical/peer, decision-making, walkthrough, inspection) sang bốn loại review của CTFL.</li>
<li>Đổi các hoạt động, vai trò và sản phẩm đầu ra của review kiểu cũ sang quy trình review CTFL 2018 (bài 3.2).</li>
<li>Giải thích bằng ba cặp đối lập vì sao inspection khác một buổi review thông thường.</li>
</ul></div>`),
    bi(`<h3>Old pages already taught in lessons 3.1–3.4 (no picture repeated here)</h3>
<div style="overflow-x:auto"><table>
<thead><tr><th>Old page (SWT3 2023)</th><th>Already taught in</th><th>Note</th></tr></thead>
<tbody>
<tr><td>1 — cover "Static Techniques"</td><td>3.1, slide 1</td><td>Same six-box course map. The header still says "ISTQB / ISEB" — see the terms table at the end.</td></tr>
<tr><td>2, 10, 30 — Contents</td><td>3.1 slides 2–3 · 3.2 slide 21 · 3.4 slide 94</td><td>Old headings "Reviews and the test process · Types of review · Static analysis" = today's "Static techniques &amp; test process · Review process · Static analysis".</td></tr>
<tr><td>5 — Reviews are cost-effective</td><td>3.1, slide 10</td><td>Same figures (Freedman &amp; Weinberg, Yourdon, Gilb &amp; Graham).</td></tr>
<tr><td>9 — Costs of reviews</td><td>3.1, slide 11</td><td>Identical (5–15% of development effort).</td></tr>
<tr><td>18 — Reviews in general 5 (pitfalls)</td><td>3.3, slide 64</td><td>Identical four pitfalls; the new deck calls them "Formal Review Pitfalls".</td></tr>
<tr><td>22 — Inspection is more and better</td><td>3.3, slide 65</td><td>Same table (10–20% · 30–40% · 80–95%).</td></tr>
<tr><td>24–29 — At first glance … Inspection surprises</td><td>3.3, slides 67–72</td><td>Same six pages, same order: checking rate, 1 page = 300 important words.</td></tr>
<tr><td>31–35 — static analysis, data flow, control flow</td><td>3.4, slides 95–99</td><td>Identical, including the <code>n := 0 … read(y)</code> anomaly example.</td></tr>
<tr><td>37 — "THEN clause unreachable"</td><td>3.4, slide 100</td><td>The conclusion of page 36 (page 36 itself is shown below: it adds the macro remark).</td></tr>
<tr><td>38–42 — cyclomatic complexity, other metrics, limitations</td><td>3.4, slides 101–105</td><td>Identical.</td></tr>
</tbody>
</table></div>`,
    `<h3>Các trang cũ đã dạy ở bài 3.1–3.4 (không lặp lại ảnh ở đây)</h3>
<div style="overflow-x:auto"><table>
<thead><tr><th>Trang cũ (SWT3 2023)</th><th>Đã dạy ở</th><th>Ghi chú</th></tr></thead>
<tbody>
<tr><td>1 — bìa "Static Techniques"</td><td>3.1, slide 1</td><td>Cùng bản đồ sáu ô của môn. Tiêu đề vẫn ghi "ISTQB / ISEB" — xem bảng thuật ngữ cuối bài.</td></tr>
<tr><td>2, 10, 30 — Contents</td><td>3.1 slide 2–3 · 3.2 slide 21 · 3.4 slide 94</td><td>Mục cũ "Reviews and the test process · Types of review · Static analysis" = mục mới "Static techniques &amp; test process · Review process · Static analysis".</td></tr>
<tr><td>5 — Reviews are cost-effective</td><td>3.1, slide 10</td><td>Cùng số liệu (Freedman &amp; Weinberg, Yourdon, Gilb &amp; Graham).</td></tr>
<tr><td>9 — Costs of reviews</td><td>3.1, slide 11</td><td>Giống hệt (5–15% công sức phát triển).</td></tr>
<tr><td>18 — Reviews in general 5 (cạm bẫy)</td><td>3.3, slide 64</td><td>Giống hệt bốn cạm bẫy; bộ mới gọi là "Formal Review Pitfalls".</td></tr>
<tr><td>22 — Inspection is more and better</td><td>3.3, slide 65</td><td>Cùng bảng (10–20% · 30–40% · 80–95%).</td></tr>
<tr><td>24–29 — At first glance … Inspection surprises</td><td>3.3, slide 67–72</td><td>Cùng sáu trang, cùng thứ tự: tốc độ kiểm tra, 1 trang = 300 từ quan trọng.</td></tr>
<tr><td>31–35 — static analysis, data flow, control flow</td><td>3.4, slide 95–99</td><td>Giống hệt, kể cả ví dụ anomaly <code>n := 0 … read(y)</code>.</td></tr>
<tr><td>37 — "THEN clause unreachable"</td><td>3.4, slide 100</td><td>Là kết luận của trang 36 (bản thân trang 36 có ở dưới vì nó thêm ý về macro).</td></tr>
<tr><td>38–42 — cyclomatic complexity, metric khác, giới hạn</td><td>3.4, slide 101–105</td><td>Giống hệt.</td></tr>
</tbody>
</table></div>`),
    walkHead(O, 3, 43, 'This is the <strong>2023</strong> deck: only the pages that add something are shown; the rest are in the table above.', 'Đây là bộ slide <strong>2023</strong>: chỉ hiện những trang có thêm kiến thức; các trang còn lại nằm trong bảng ở trên.'),
    walk(O, [
      [3, 'People techniques',
        `<p class="y-chinh">🎯 The 2023 deck sorts static techniques by <em>who</em> does them — one person or a group — and none of them executes the code.</p>
<p class="nhan">Individual techniques</p>
<ul>
<li><strong>Desk-checking</strong> — you trace the program by hand, on paper, "playing computer". The code is never run by a machine.</li>
<li><strong>Data-stepping</strong> — you pick an input and follow the values of the variables line by line, writing them down as you go.</li>
<li><strong>Proof-reading</strong> — you read a document yourself for mistakes, gaps and unclear wording.</li>
</ul>
<p class="nhan">Group techniques — as the old deck labels them</p>
<ul>
<li><strong>Reviews (informal &amp; formal)</strong> — "for consensus".</li>
<li><strong>Walkthrough</strong> — "for education".</li>
<li><strong>Inspection</strong> — the most formal one — "to find faults".</li>
</ul>
<p class="nhan">The same idea in today's CTFL words</p>
<ul>
<li><strong>Four review types</strong> — CTFL 2018 has informal review, walkthrough, technical review and inspection (lesson 3.3, slides 55–63).</li>
<li><strong>Consensus</strong> — today it is a main purpose of the <em>technical review</em> (slide 60), not of "reviews" in general.</li>
<li><strong>Education</strong> — today only an <em>additional</em> purpose of a walkthrough (slide 58). Its main purposes are finding defects, improving the work product, considering alternatives and checking conformance to standards.</li>
<li><strong>"Faults"</strong> — the old word. Say <strong>defects</strong>.</li>
<li><strong>The individual techniques</strong> — today they sit inside the <em>individual review</em> activity (lesson 3.2, slide 29) or an informal review done by one colleague.</li>
</ul>
<div class="pitfall">An exam option saying "the purpose of a walkthrough is education" is only half true. If another option lists "finding defects, improving the product, considering alternatives", that one is the main purpose.</div>`,
        `<p class="y-chinh">🎯 Bộ slide 2023 chia kỹ thuật tĩnh theo <em>ai</em> làm — một người hay một nhóm — và không kỹ thuật nào chạy code.</p>
<p class="nhan">Kỹ thuật cá nhân</p>
<ul>
<li><strong>Desk-checking</strong> — tự dò chương trình bằng tay trên giấy, "đóng vai máy tính". Không có máy nào chạy code.</li>
<li><strong>Data-stepping</strong> — chọn một đầu vào rồi theo dõi giá trị các biến qua từng dòng, vừa dò vừa ghi lại.</li>
<li><strong>Proof-reading</strong> — tự đọc một tài liệu để tìm lỗi, chỗ thiếu và câu chữ mơ hồ.</li>
</ul>
<p class="nhan">Kỹ thuật nhóm — theo nhãn của slide cũ</p>
<ul>
<li><strong>Reviews (informal &amp; formal)</strong> — "để đạt đồng thuận".</li>
<li><strong>Walkthrough</strong> — "để đào tạo".</li>
<li><strong>Inspection</strong> — chính quy nhất — "để tìm fault".</li>
</ul>
<p class="nhan">Cùng ý đó, nói bằng từ CTFL hiện hành</p>
<ul>
<li><strong>Bốn loại review</strong> — CTFL 2018 có informal review, walkthrough, technical review và inspection (bài 3.3, slide 55–63).</li>
<li><strong>Đồng thuận</strong> — nay là mục đích chính của <em>technical review</em> (slide 60), không phải của "review" nói chung.</li>
<li><strong>Đào tạo</strong> — nay chỉ là mục đích <em>phụ</em> của walkthrough (slide 58). Mục đích chính là tìm defect, cải thiện sản phẩm, xem xét phương án khác và kiểm tra việc tuân thủ chuẩn.</li>
<li><strong>"Faults"</strong> — từ cũ. Hãy nói <strong>defect</strong>.</li>
<li><strong>Các kỹ thuật cá nhân</strong> — nay nằm trong hoạt động <em>individual review</em> (bài 3.2, slide 29) hoặc trong một informal review do một đồng nghiệp làm.</li>
</ul>
<div class="pitfall">Phương án thi ghi "mục đích của walkthrough là đào tạo" chỉ đúng một nửa. Nếu có phương án khác ghi "tìm defect, cải thiện sản phẩm, xem xét phương án khác" thì đó mới là mục đích chính.</div>`],
      [4, 'Benefits of reviews',
        `<p class="y-chinh">🎯 Six business benefits of reviews — five of them are in today's "Benefits of Static Testing", one is new: better customer relations.</p>
<p class="nhan">The six benefits, matched to the current deck (lesson 3.1, slides 8–9)</p>
<ol>
<li><strong>Development productivity improvement</strong> — same as today's "increased development productivity".</li>
<li><strong>Reduced development timescales</strong> — shorter schedules; the "25% reduction in schedules" figure is on slide 10.</li>
<li><strong>Reduced testing time and cost</strong> — fewer defects reach test, so fewer failures to investigate, report and retest.</li>
<li><strong>Lifetime cost reductions</strong> — today "reduced total cost of quality over the software's lifetime" (maintenance included).</li>
<li><strong>Reduced fault levels</strong> — fewer defects left in the product. Today's wording is "more efficient detection &amp; correction of defects".</li>
<li><strong>Improved customer relations</strong> — not in the new deck. Fewer defects reach the customer. When customers help review the requirements, they also see early that the product matches what they asked for.</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> faster, cheaper, fewer defects, and a happier customer. The "etc." means the list is open.</p>`,
        `<p class="y-chinh">🎯 Sáu lợi ích kinh doanh của review — năm cái có trong "Benefits of Static Testing" hiện nay, một cái mới: quan hệ khách hàng tốt hơn.</p>
<p class="nhan">Sáu lợi ích, so với bộ slide hiện tại (bài 3.1, slide 8–9)</p>
<ol>
<li><strong>Development productivity improvement</strong> — chính là "increased development productivity" hiện nay.</li>
<li><strong>Reduced development timescales</strong> — rút ngắn lịch; con số "giảm 25% lịch" có ở slide 10.</li>
<li><strong>Reduced testing time and cost</strong> — ít defect lọt tới giai đoạn test hơn, nên ít failure phải điều tra, báo cáo và test lại.</li>
<li><strong>Lifetime cost reductions</strong> — nay là "giảm tổng chi phí chất lượng suốt vòng đời phần mềm" (tính cả bảo trì).</li>
<li><strong>Reduced fault levels</strong> — ít defect sót lại trong sản phẩm. Từ ngữ hiện nay là "phát hiện và sửa defect hiệu quả hơn".</li>
<li><strong>Improved customer relations</strong> — bộ mới không có. Ít defect tới tay khách hàng hơn. Khi khách hàng cùng review yêu cầu, họ cũng thấy sớm rằng sản phẩm đúng thứ họ cần.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> nhanh hơn, rẻ hơn, ít defect hơn, khách hàng vui hơn. Chữ "etc." nghĩa là danh sách còn mở.</p>`],
      [6, 'What can be Inspected? Anything written down can be Inspected',
        `<p class="y-chinh">🎯 If it is written down, it can be inspected — the list reaches far beyond code and requirements.</p>
<p class="nhan">The six groups on the page</p>
<ol>
<li><strong>Business documents</strong> — policy, strategy, business plans, marketing or advertising material, contracts.</li>
<li><strong>Early project documents</strong> — system requirements, feasibility studies, acceptance test plans.</li>
<li><strong>Testware</strong> — test plans, test designs, test cases, test results.</li>
<li><strong>Designs</strong> — system designs, both logical and physical.</li>
<li><strong>Software code</strong>.</li>
<li><strong>User-facing documents</strong> — user manuals, procedures, training material.</li>
</ol>
<p class="nhan">Compared with the current deck (lesson 3.1, slide 6)</p>
<ul>
<li><strong>Already there</strong> — specifications, code, testware, user guides, contracts, project plans.</li>
<li><strong>Only in the old list</strong> — policy, strategy, business plans, marketing material, feasibility studies, procedures, training material.</li>
<li><strong>Why an acceptance test plan sits next to the requirements</strong> — it is written from them early, so checking both together finds defects in each.</li>
</ul>
<p class="nhan">The current syllabus adds one condition</p>
<p>CTFL v4.0 (§3.1.1): anything a person can read and understand can be <em>reviewed</em>. <em>Static analysis</em> additionally needs a structure a tool can check, such as code, models or text with a formal syntax.</p>`,
        `<p class="y-chinh">🎯 Cái gì đã viết ra thì inspect được — danh sách rộng hơn nhiều so với code và tài liệu yêu cầu.</p>
<p class="nhan">Sáu nhóm trên slide</p>
<ol>
<li><strong>Tài liệu kinh doanh</strong> — chính sách, chiến lược, kế hoạch kinh doanh, tài liệu marketing hay quảng cáo, hợp đồng.</li>
<li><strong>Tài liệu đầu dự án</strong> — yêu cầu hệ thống, nghiên cứu khả thi, acceptance test plan.</li>
<li><strong>Testware</strong> — test plan, test design, test case, kết quả test.</li>
<li><strong>Thiết kế</strong> — thiết kế hệ thống, cả logic lẫn vật lý.</li>
<li><strong>Mã nguồn</strong>.</li>
<li><strong>Tài liệu cho người dùng</strong> — hướng dẫn sử dụng, quy trình thao tác, tài liệu đào tạo.</li>
</ol>
<p class="nhan">So với bộ slide hiện tại (bài 3.1, slide 6)</p>
<ul>
<li><strong>Đã có</strong> — đặc tả, code, testware, hướng dẫn sử dụng, hợp đồng, kế hoạch dự án.</li>
<li><strong>Chỉ danh sách cũ có</strong> — chính sách, chiến lược, kế hoạch kinh doanh, tài liệu marketing, nghiên cứu khả thi, quy trình thao tác, tài liệu đào tạo.</li>
<li><strong>Vì sao acceptance test plan đứng cạnh tài liệu yêu cầu</strong> — nó được viết sớm, từ chính tài liệu yêu cầu, nên kiểm tra cả hai cùng lúc sẽ tìm ra defect ở cả hai.</li>
</ul>
<p class="nhan">Syllabus hiện hành thêm một điều kiện</p>
<p>CTFL v4.0 (§3.1.1): cái gì con người đọc và hiểu được thì <em>review</em> được. Còn <em>phân tích tĩnh</em> thì cần thêm một cấu trúc để công cụ kiểm tra, như code, mô hình hay văn bản có cú pháp hình thức.</p>`],
      [7, 'What can be reviewed?',
        `<p class="y-chinh">🎯 "Review" is the wider word: besides everything that can be inspected, you can review ideas and progress that are not a finished document.</p>
<p class="nhan">What the page adds to page 6</p>
<ul>
<li><strong>Anything which could be inspected</strong> — i.e. anything written down (page 6).</li>
<li><strong>Plans, visions, the "big picture"</strong> — strategic directions and ideas, even before they become a document.</li>
<li><strong>Project progress</strong> — is the work completed to schedule?</li>
<li><strong>"Should we develop this?"</strong> — marketing options, a go/no-go decision.</li>
</ul>
<p class="nhan">Why these cannot be inspected</p>
<p>An inspection checks a document against its sources and agreed rules (page 12). An idea or a progress status has no such sources or rules, so a group can discuss and judge it, but not inspect it.</p>
<p class="nhan">Today's name for the last two bullets</p>
<ul>
<li><strong>Management review</strong> — the ISTQB glossary term for a review that monitors progress and the status of plans and schedules.</li>
<li><strong>Not one of the four exam types</strong> — CTFL 2018 does not examine it as a review type.</li>
</ul>`,
        `<p class="y-chinh">🎯 "Review" là từ rộng hơn: ngoài mọi thứ inspect được, bạn còn review được ý tưởng và tiến độ, những thứ chưa thành tài liệu hoàn chỉnh.</p>
<p class="nhan">Trang này thêm gì so với trang 6</p>
<ul>
<li><strong>Mọi thứ inspect được</strong> — tức là mọi thứ đã viết ra (trang 6).</li>
<li><strong>Kế hoạch, tầm nhìn, "bức tranh lớn"</strong> — định hướng chiến lược và ý tưởng, kể cả khi chưa thành tài liệu.</li>
<li><strong>Tiến độ dự án</strong> — công việc có xong đúng lịch không?</li>
<li><strong>"Có nên phát triển cái này không?"</strong> — các phương án marketing, quyết định làm hay không làm (go/no-go).</li>
</ul>
<p class="nhan">Vì sao những thứ này không inspect được</p>
<p>Inspection kiểm tra một tài liệu so với tài liệu nguồn và bộ quy tắc đã thống nhất (trang 12). Một ý tưởng hay một tình trạng tiến độ không có nguồn và quy tắc như vậy, nên nhóm có thể bàn và đánh giá nó, nhưng không inspect được.</p>
<p class="nhan">Tên gọi ngày nay cho hai gạch cuối</p>
<ul>
<li><strong>Management review</strong> — thuật ngữ trong glossary ISTQB cho loại review theo dõi tiến độ, tình trạng kế hoạch và lịch.</li>
<li><strong>Không nằm trong bốn loại đi thi</strong> — CTFL 2018 không hỏi nó như một loại review.</li>
</ul>`],
      [8, 'What to review / Inspect?',
        `<p class="y-chinh">🎯 On the V-model, every document on the left <em>and</em> the tests written from it are candidates for review or inspection.</p>
<p class="nhan">Reading the picture</p>
<ul>
<li><strong>Left arm</strong> — Requirements → Functions (the functional specification) → Design → Code.</li>
<li><strong>Right arm</strong> — Unit Test → Integration Test → System Test → Acceptance Test.</li>
<li><strong>Horizontal lines</strong> — each left document is the basis for the test level opposite it: Requirements ↔ Acceptance, Functions ↔ System, Design ↔ Integration, Code ↔ Unit.</li>
<li><strong>The "Tests" ovals</strong> — the tests designed for each level. They are written documents too, so they can be reviewed.</li>
</ul>
<p class="nhan">What the picture tells you to do</p>
<ol>
<li><strong>Review each left-side document</strong> as soon as it exists, not when testing starts.</li>
<li><strong>Design the tests for its level early</strong> — writing a test for a requirement quickly shows whether the requirement is vague.</li>
<li><strong>Review the tests</strong> together with the document they come from.</li>
</ol>
<p class="ghi-chu">The V-model itself is taught in Chapter 2. This page only adds where reviews fit into it.</p>`,
        `<p class="y-chinh">🎯 Trên mô hình chữ V, mọi tài liệu ở nhánh trái <em>và</em> các test viết từ nó đều nên được review hoặc inspect.</p>
<p class="nhan">Đọc hình</p>
<ul>
<li><strong>Nhánh trái</strong> — Requirements → Functions (đặc tả chức năng) → Design → Code.</li>
<li><strong>Nhánh phải</strong> — Unit Test → Integration Test → System Test → Acceptance Test.</li>
<li><strong>Đường ngang</strong> — mỗi tài liệu bên trái là cơ sở cho cấp test đối diện: Requirements ↔ Acceptance, Functions ↔ System, Design ↔ Integration, Code ↔ Unit.</li>
<li><strong>Các ô "Tests"</strong> — các test được thiết kế cho từng cấp. Chúng cũng là tài liệu viết ra, nên cũng review được.</li>
</ul>
<p class="nhan">Hình này bảo bạn làm gì</p>
<ol>
<li><strong>Review từng tài liệu bên trái</strong> ngay khi nó có, không đợi tới lúc bắt đầu test.</li>
<li><strong>Thiết kế sớm các test cho cấp tương ứng</strong> — viết test cho một yêu cầu sẽ lộ ngay yêu cầu đó có mơ hồ không.</li>
<li><strong>Review các test</strong> cùng lúc với tài liệu mà chúng được viết ra từ đó.</li>
</ol>
<p class="ghi-chu">Bản thân mô hình chữ V được dạy ở Chương 2. Trang này chỉ thêm việc review nằm ở đâu trong mô hình.</p>`],
      [11, 'Types of review of documents (1) — informal, technical/peer, decision-making',
        `<p class="y-chinh">🎯 The old deck names five review types over two pages. This page has the first three, and only two of them survive in CTFL.</p>
<p class="nhan">What the page says</p>
<ul>
<li><strong>Informal review</strong> (undocumented) — widely seen as useful and cheap, "but no one can prove it!" A helpful first step for chaotic organisations.</li>
<li><strong>Technical review</strong> (or peer review) — peers and technical experts, no management participation. Normally documented and aimed at finding defects. Can be rather subjective.</li>
<li><strong>Decision-making review</strong> — the group discusses a document and decides about its content: how something should be done, go or no-go, or technical comments.</li>
</ul>
<p class="nhan">Mapped to CTFL 2018 (lesson 3.3)</p>
<ul>
<li><strong>Informal review</strong> → still <em>informal review</em> (slides 56–57): no documented process, results documentation optional. "No one can prove it" because nobody collects metrics.</li>
<li><strong>Technical review</strong> → still <em>technical review</em> (slides 60–61). Main purposes today: gaining consensus and detecting potential defects. Reviewers are technical peers of the author and technical experts.</li>
<li><strong>Decision-making review</strong> → <em>not a CTFL type</em>. Deciding "how it should be done" is the consensus purpose of a technical review; go/no-go is a management review (page 7).</li>
</ul>
<div class="pitfall">"Peer review" is <strong>not</strong> another name for technical review in today's glossary. It means any review by colleagues of the author — walkthrough, technical review and inspection are all peer reviews (lesson 3.3, slide 81).</div>`,
        `<p class="y-chinh">🎯 Slide cũ kể năm loại review trên hai trang. Trang này có ba loại đầu, và chỉ hai loại còn trong CTFL.</p>
<p class="nhan">Trang này nói gì</p>
<ul>
<li><strong>Informal review</strong> (không ghi thành văn bản) — được coi là hữu ích và rẻ, "nhưng không ai chứng minh được!" Là bước khởi đầu tốt cho tổ chức còn lộn xộn.</li>
<li><strong>Technical review</strong> (hay peer review) — gồm đồng nghiệp và chuyên gia kỹ thuật, không có quản lý tham gia. Thường có ghi chép, nhằm tìm defect. Có thể khá chủ quan.</li>
<li><strong>Decision-making review</strong> — nhóm bàn về một tài liệu và ra quyết định về nội dung: nên làm thế nào, làm hay không làm (go/no-go), hoặc góp ý kỹ thuật.</li>
</ul>
<p class="nhan">Đổi sang CTFL 2018 (bài 3.3)</p>
<ul>
<li><strong>Informal review</strong> → vẫn là <em>informal review</em> (slide 56–57): không có quy trình văn bản, ghi kết quả là tuỳ chọn. "Không ai chứng minh được" vì không ai thu metric.</li>
<li><strong>Technical review</strong> → vẫn là <em>technical review</em> (slide 60–61). Mục đích chính ngày nay: đạt đồng thuận và tìm defect tiềm năng. Người review là đồng nghiệp kỹ thuật của tác giả và chuyên gia kỹ thuật.</li>
<li><strong>Decision-making review</strong> → <em>không phải loại review của CTFL</em>. Quyết định "nên làm thế nào" là mục đích đồng thuận của technical review; còn go/no-go là management review (trang 7).</li>
</ul>
<div class="pitfall">Trong glossary hiện nay "peer review" <strong>không</strong> phải tên khác của technical review. Nó là mọi loại review do đồng nghiệp của tác giả làm — walkthrough, technical review và inspection đều là peer review (bài 3.3, slide 81).</div>`],
      [12, 'Types of review of documents (2) — walkthrough, inspection',
        `<p class="y-chinh">🎯 The last two old types: the walkthrough is led by the author, the inspection is formal checking against sources and rules.</p>
<p class="nhan">What the page says</p>
<ul>
<li><strong>Walkthrough</strong> — the author guides the group through a document and his or her thought processes, so all understand the same thing and agree on the changes to make.</li>
<li><strong>Inspection</strong> — formal individual and group checking:
<ul>
<li>using <strong>sources and standards</strong> — the product is compared with the documents it was built from;</li>
<li>according to <strong>generic and specific rules and checklists</strong> — generic rules apply to every document (e.g. "no ambiguous wording"), specific ones to one document type (e.g. "every requirement is testable");</li>
<li>using <strong>entry and exit criteria</strong>;</li>
<li>the <strong>leader must be trained &amp; certified</strong>;</li>
<li><strong>metrics</strong> are required.</li>
</ul></li>
</ul>
<p class="nhan">Mapped to CTFL 2018 (lesson 3.3)</p>
<ul>
<li><strong>Walkthrough</strong> — still typically led by the author (slide 59). Consensus is now only an additional purpose (slide 58).</li>
<li><strong>Inspection</strong> — defined process, checklists, entry &amp; exit criteria and gathering metrics are all still mandatory (slide 62).</li>
<li><strong>"Trained &amp; certified"</strong> — CTFL asks for a <em>trained facilitator</em> (slide 63). Certification comes from the Gilb &amp; Graham inspection method, not from the syllabus.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> walkthrough = the author <em>walks</em> you through; inspection = a trained leader makes you <em>check against rules</em>.</p>`,
        `<p class="y-chinh">🎯 Hai loại cũ còn lại: walkthrough do tác giả dẫn, inspection là kiểm tra chính quy so với tài liệu nguồn và quy tắc.</p>
<p class="nhan">Trang này nói gì</p>
<ul>
<li><strong>Walkthrough</strong> — tác giả dẫn nhóm đi qua tài liệu và cách mình suy nghĩ, để mọi người hiểu giống nhau và thống nhất những thay đổi cần làm.</li>
<li><strong>Inspection</strong> — kiểm tra chính quy, cả cá nhân lẫn nhóm:
<ul>
<li>dùng <strong>tài liệu nguồn và chuẩn</strong> — so sản phẩm với các tài liệu mà nó được làm ra từ đó;</li>
<li>theo <strong>quy tắc chung, quy tắc riêng và checklist</strong> — quy tắc chung áp cho mọi tài liệu (vd "không có câu mơ hồ"), quy tắc riêng cho một loại tài liệu (vd "mọi yêu cầu đều test được");</li>
<li>dùng <strong>entry và exit criteria</strong>;</li>
<li><strong>người dẫn phải được đào tạo và cấp chứng chỉ</strong>;</li>
<li><strong>bắt buộc có metric</strong>.</li>
</ul></li>
</ul>
<p class="nhan">Đổi sang CTFL 2018 (bài 3.3)</p>
<ul>
<li><strong>Walkthrough</strong> — vẫn thường do tác giả dẫn (slide 59). Đồng thuận nay chỉ là mục đích phụ (slide 58).</li>
<li><strong>Inspection</strong> — quy trình xác định, checklist, entry &amp; exit criteria và thu thập metric vẫn đều bắt buộc (slide 62).</li>
<li><strong>"Được đào tạo và cấp chứng chỉ"</strong> — CTFL chỉ đòi một <em>facilitator được đào tạo</em> (slide 63). Chuyện chứng chỉ đến từ phương pháp inspection của Gilb &amp; Graham, không phải từ syllabus.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> walkthrough = tác giả <em>dắt</em> bạn đi qua; inspection = người dẫn được đào tạo bắt bạn <em>soi theo quy tắc</em>.</p>`],
      [13, 'Reviews in general 1 — objectives / goals',
        `<p class="y-chinh">🎯 Reviews aim at three things: verification &amp; validation, consensus, and process improvement — and the old deck says inspection skips consensus.</p>
<p class="nhan">The three goals on the page</p>
<ol>
<li><strong>Validation &amp; verification</strong> against specifications and standards — are we building the right thing, and building it right?</li>
<li><strong>Achieve consensus</strong> — "excluding inspection".</li>
<li><strong>Process improvement</strong> — "ideal, included in inspection".</li>
</ol>
<p class="nhan">Compared with CTFL 2018</p>
<ul>
<li><strong>Verification &amp; validation</strong> — still what static testing does: checking work products against specifications and standards (lesson 3.1).</li>
<li><strong>Consensus in inspection</strong> — <em>outdated</em>. CTFL 2018 lists "achieving consensus" as a possible further purpose of an inspection (lesson 3.3, slide 62).</li>
<li><strong>Process improvement</strong> — still the mark of an inspection: authors improve future work products and the development process (slide 62).</li>
<li><strong>What the current deck adds</strong> — lesson 3.1, slide 14: educational, mutual understanding, decision-making facilitation, agreed commitment.</li>
</ul>
<div class="pitfall">Do not answer "inspection never aims at consensus". In the current syllabus consensus is a further purpose of an inspection too — only its <em>main</em> purposes are detecting defects, evaluating quality and preventing future defects.</div>`,
        `<p class="y-chinh">🎯 Review nhắm tới ba điều: verification &amp; validation, đồng thuận và cải tiến quy trình — và slide cũ nói inspection không nhắm tới đồng thuận.</p>
<p class="nhan">Ba mục tiêu trên slide</p>
<ol>
<li><strong>Validation &amp; verification</strong> so với đặc tả và chuẩn — làm đúng thứ cần làm chưa, và làm thứ đó đúng chưa?</li>
<li><strong>Đạt đồng thuận</strong> — "trừ inspection".</li>
<li><strong>Cải tiến quy trình</strong> — "lý tưởng, inspection có sẵn".</li>
</ol>
<p class="nhan">So với CTFL 2018</p>
<ul>
<li><strong>Verification &amp; validation</strong> — vẫn là việc kiểm thử tĩnh làm: kiểm tra sản phẩm so với đặc tả và chuẩn (bài 3.1).</li>
<li><strong>Đồng thuận trong inspection</strong> — <em>đã lỗi thời</em>. CTFL 2018 ghi "đạt đồng thuận" là một mục đích phụ có thể có của inspection (bài 3.3, slide 62).</li>
<li><strong>Cải tiến quy trình</strong> — vẫn là dấu hiệu của inspection: tác giả làm tốt hơn ở sản phẩm sau, và quy trình phát triển được cải tiến (slide 62).</li>
<li><strong>Bộ slide hiện tại thêm</strong> — bài 3.1, slide 14: đào tạo, hiểu biết chung, hỗ trợ ra quyết định, cam kết đã thống nhất.</li>
</ul>
<div class="pitfall">Đừng chọn "inspection không bao giờ nhắm tới đồng thuận". Trong syllabus hiện hành đồng thuận cũng là mục đích phụ của inspection — chỉ có mục đích <em>chính</em> là tìm defect, đánh giá chất lượng và ngăn defect về sau.</div>`],
      [14, 'Reviews in general 2 — activities',
        `<p class="y-chinh">🎯 Six old review activities — they fit exactly onto the five activities of the CTFL 2018 review process.</p>
<p class="nhan">Old activity → CTFL 2018 activity (lesson 3.2, slides 25–31)</p>
<div style="overflow-x:auto"><table>
<thead><tr><th>Old deck (2023)</th><th>CTFL 2018</th><th>Remark</th></tr></thead>
<tbody>
<tr><td>Planning</td><td>Planning</td><td>Scope, effort, people, entry &amp; exit criteria.</td></tr>
<tr><td>Overview / kick-off meeting (inspection)</td><td>Initiate review</td><td>Hand out the work product, explain objectives and process.</td></tr>
<tr><td>Preparation / individual checking</td><td>Individual review</td><td>Each reviewer checks alone and notes potential defects.</td></tr>
<tr><td>Review meeting (not always)</td><td>Issue communication &amp; analysis</td><td>The meeting is still optional in lighter review types.</td></tr>
<tr><td>Follow-up (for some types)</td><td>Fixing &amp; reporting</td><td>Author fixes; someone checks the fixes against the exit criteria.</td></tr>
<tr><td>Metrics recording &amp; analysis (inspections, sometimes reviews)</td><td>Fixing &amp; reporting — "gathering metrics"</td><td>Only for the more formal review types.</td></tr>
</tbody>
</table></div>
<p class="ghi-chu">CTFL 2011 had six phases (planning, kick-off, individual preparation, review meeting, rework, follow-up). CTFL v4.0 keeps the five 2018 activities under slightly shorter names: review initiation, individual review, communication and analysis, fixing and reporting.</p>`,
        `<p class="y-chinh">🎯 Sáu hoạt động review kiểu cũ — khớp đúng vào năm hoạt động của quy trình review CTFL 2018.</p>
<p class="nhan">Hoạt động cũ → hoạt động CTFL 2018 (bài 3.2, slide 25–31)</p>
<div style="overflow-x:auto"><table>
<thead><tr><th>Slide cũ (2023)</th><th>CTFL 2018</th><th>Ghi chú</th></tr></thead>
<tbody>
<tr><td>Planning</td><td>Planning</td><td>Phạm vi, công sức, con người, entry &amp; exit criteria.</td></tr>
<tr><td>Overview / kick-off meeting (inspection)</td><td>Initiate review</td><td>Phát sản phẩm, giải thích mục tiêu và quy trình.</td></tr>
<tr><td>Preparation / individual checking</td><td>Individual review</td><td>Mỗi người review tự kiểm tra và ghi defect tiềm năng.</td></tr>
<tr><td>Review meeting (không phải lúc nào cũng có)</td><td>Issue communication &amp; analysis</td><td>Buổi họp vẫn là tuỳ chọn ở các loại review nhẹ.</td></tr>
<tr><td>Follow-up (một số loại)</td><td>Fixing &amp; reporting</td><td>Tác giả sửa; có người kiểm tra bản sửa so với exit criteria.</td></tr>
<tr><td>Ghi &amp; phân tích metric (inspection, đôi khi review)</td><td>Fixing &amp; reporting — "gathering metrics"</td><td>Chỉ ở các loại review chính quy hơn.</td></tr>
</tbody>
</table></div>
<p class="ghi-chu">CTFL 2011 có sáu giai đoạn (planning, kick-off, individual preparation, review meeting, rework, follow-up). CTFL v4.0 giữ năm hoạt động của 2018 với tên gọn hơn: review initiation, individual review, communication and analysis, fixing and reporting.</p>`],
      [15, 'Reviews in general 3 — roles: leader / moderator',
        `<p class="y-chinh">🎯 In the old deck one person, the leader/moderator, does six jobs. CTFL 2018 spreads them over three roles.</p>
<p class="nhan">The six duties → who does them today (lesson 3.2, slides 42–44)</p>
<ul>
<li><strong>Plans the review / inspection</strong> → <em>management</em> is responsible for review planning; the <em>review leader</em> organises it.</li>
<li><strong>Chooses participants</strong> → <em>review leader</em> ("decides who will be involved").</li>
<li><strong>Helps &amp; encourages</strong> → <em>facilitator</em> (mediates between points of view).</li>
<li><strong>Conducts the meeting</strong> → <em>facilitator</em> ("ensures effective running of review meetings").</li>
<li><strong>Performs follow-up</strong> → <em>facilitator</em> (the teacher's notes on slide 43: checks the fixes).</li>
<li><strong>Manages metrics</strong> → <em>review leader</em> (overall responsibility), with management watching cost-effectiveness.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> old "moderator" = today's <strong>facilitator</strong> (the syllabus still says "facilitator (often called moderator)"). The review leader is a separate role on top.</p>`,
        `<p class="y-chinh">🎯 Ở slide cũ một người — leader/moderator — làm sáu việc. CTFL 2018 chia chúng cho ba vai trò.</p>
<p class="nhan">Sáu nhiệm vụ → ngày nay ai làm (bài 3.2, slide 42–44)</p>
<ul>
<li><strong>Lập kế hoạch review / inspection</strong> → <em>management</em> chịu trách nhiệm lập kế hoạch; <em>review leader</em> tổ chức.</li>
<li><strong>Chọn người tham gia</strong> → <em>review leader</em> ("quyết định ai tham gia").</li>
<li><strong>Hỗ trợ &amp; động viên</strong> → <em>facilitator</em> (hoà giải các quan điểm khác nhau).</li>
<li><strong>Điều khiển buổi họp</strong> → <em>facilitator</em> ("đảm bảo buổi họp review diễn ra hiệu quả").</li>
<li><strong>Theo dõi sau họp (follow-up)</strong> → <em>facilitator</em> (ghi chú của thầy/cô ở slide 43: kiểm tra các bản sửa).</li>
<li><strong>Quản lý metric</strong> → <em>review leader</em> (chịu trách nhiệm tổng thể), còn management theo dõi hiệu quả chi phí.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> "moderator" cũ = <strong>facilitator</strong> ngày nay (syllabus vẫn ghi "facilitator (thường gọi là moderator)"). Review leader là một vai trò riêng, đứng trên.</p>`],
      [16, 'Reviews in general 3 — roles: author, reviewers, managers, others',
        `<p class="y-chinh">🎯 The other old roles: author, reviewers/inspectors, managers and a co-ordinator — and one role that today is mandatory is missing.</p>
<p class="nhan">What the page says, and today's view</p>
<ul>
<li><strong>Author</strong> of the document being reviewed/inspected → same role today (slide 41): creates the work product and fixes its defects.</li>
<li><strong>Reviewers / inspectors</strong> — in an inspection they get specialised fault-finding roles → today "reviewers may represent different perspectives" (slide 45), and the role-based and perspective-based techniques (lesson 3.3, slides 86–87).</li>
<li><strong>Managers</strong> — excluded from some review types; they must plan project time for reviews → today management decides on reviews and assigns staff, budget and time (slide 42). Management support is a success factor (slide 93).</li>
<li><strong>Others</strong>, e.g. an inspection/review co-ordinator → an organisation-wide organiser. There is no such role in CTFL; the closest is the review leader.</li>
</ul>
<p class="nhan">Why managers stay out of some reviews</p>
<p>With the boss in the room, a review can feel like judging the <em>author</em> instead of the <em>document</em>. People then hide defects instead of finding them.</p>
<div class="pitfall">The old role list has <strong>no scribe</strong>. In CTFL 2018 the scribe (recorder) is mandatory in walkthroughs, technical reviews and inspections (lesson 3.2, slide 46).</div>`,
        `<p class="y-chinh">🎯 Các vai trò cũ còn lại: tác giả, reviewer/inspector, quản lý và điều phối viên — và thiếu một vai trò mà ngày nay là bắt buộc.</p>
<p class="nhan">Slide nói gì, và ngày nay nhìn thế nào</p>
<ul>
<li><strong>Tác giả</strong> của tài liệu được review/inspect → vai trò y hệt ngày nay (slide 41): tạo sản phẩm và sửa defect của nó.</li>
<li><strong>Reviewer / inspector</strong> — trong inspection họ được giao vai chuyên soi một loại lỗi → ngày nay là "reviewer có thể đại diện cho các góc nhìn khác nhau" (slide 45), cùng các kỹ thuật role-based và perspective-based (bài 3.3, slide 86–87).</li>
<li><strong>Quản lý</strong> — không tham gia một số loại review; phải dành thời gian cho review trong lịch dự án → ngày nay management quyết định việc review và cấp người, ngân sách, thời gian (slide 42). Sự ủng hộ của quản lý là một yếu tố thành công (slide 93).</li>
<li><strong>Vai trò khác</strong>, vd điều phối viên inspection/review → người tổ chức review cho cả tổ chức. CTFL không có vai trò này; gần nhất là review leader.</li>
</ul>
<p class="nhan">Vì sao quản lý đứng ngoài một số buổi review</p>
<p>Có sếp trong phòng, buổi review dễ biến thành chấm điểm <em>tác giả</em> thay vì xem xét <em>tài liệu</em>. Khi đó người ta giấu defect thay vì tìm ra nó.</p>
<div class="pitfall">Danh sách vai trò cũ <strong>không có scribe</strong>. Trong CTFL 2018 scribe (người ghi chép) là bắt buộc ở walkthrough, technical review và inspection (bài 3.2, slide 46).</div>`],
      [17, 'Reviews in general 4 — deliverables',
        `<p class="y-chinh">🎯 A review delivers more than a corrected document: change requests upstream, process improvement ideas and metrics.</p>
<p class="nhan">The four deliverables</p>
<ol>
<li><strong>Changes (edits) in the review product</strong> — the author fixes the document that was reviewed.</li>
<li><strong>Change requests for source documents</strong> — the predecessor documents the product was built from.</li>
<li><strong>Process improvement suggestions</strong>:
<ul>
<li>to the review/inspection process itself;</li>
<li>to the development process that produced the product just reviewed.</li>
</ul></li>
<li><strong>Metrics</strong> — for inspections and some other review types.</li>
</ol>
<p class="nhan">Why a change request instead of an edit</p>
<p>Reviewing a design, you find that the real mistake is in the requirements. The design team cannot simply edit someone else's document, so they raise a change request to the owner of the requirements. That is the "Change Request" arrow on page 23 and on slide 66 of lesson 3.3.</p>
<p class="nhan">Today's names (lesson 3.2, slide 31 — Fixing &amp; Reporting)</p>
<ul>
<li><strong>Edits in the review product</strong> → "fixing defects (typically by the author)".</li>
<li><strong>Change requests for source documents</strong> → "communicating defects to the appropriate person/team".</li>
<li><strong>Metrics</strong> → "gathering metrics (for more formal review types)".</li>
<li><strong>Not on the old page</strong> — creating defect reports, and accepting the work product once the exit criteria are met.</li>
</ul>`,
        `<p class="y-chinh">🎯 Review không chỉ cho ra tài liệu đã sửa: còn có change request gửi ngược lên, ý tưởng cải tiến quy trình và metric.</p>
<p class="nhan">Bốn sản phẩm đầu ra</p>
<ol>
<li><strong>Chỉnh sửa trong sản phẩm được review</strong> — tác giả sửa tài liệu vừa được review.</li>
<li><strong>Change request cho tài liệu nguồn</strong> — các tài liệu đi trước mà sản phẩm được làm ra từ đó.</li>
<li><strong>Đề xuất cải tiến quy trình</strong>:
<ul>
<li>cho chính quy trình review/inspection;</li>
<li>cho quy trình phát triển đã tạo ra sản phẩm vừa review.</li>
</ul></li>
<li><strong>Metric</strong> — với inspection và một số loại review khác.</li>
</ol>
<p class="nhan">Vì sao là change request chứ không sửa luôn</p>
<p>Đang review bản thiết kế, bạn phát hiện lỗi thật nằm ở tài liệu yêu cầu. Nhóm thiết kế không thể tự sửa tài liệu của người khác, nên họ gửi change request cho người sở hữu tài liệu yêu cầu. Đó là mũi tên "Change Request" ở trang 23 và ở slide 66 bài 3.3.</p>
<p class="nhan">Tên gọi ngày nay (bài 3.2, slide 31 — Fixing &amp; Reporting)</p>
<ul>
<li><strong>Chỉnh sửa trong sản phẩm được review</strong> → "sửa defect (thường do tác giả)".</li>
<li><strong>Change request cho tài liệu nguồn</strong> → "báo defect cho đúng người/nhóm phụ trách".</li>
<li><strong>Metric</strong> → "thu thập metric (với các loại review chính quy hơn)".</li>
<li><strong>Trang cũ không có</strong> — tạo defect report, và chấp nhận sản phẩm khi đạt exit criteria.</li>
</ul>`],
      [19, 'Inspection is different (1) — what is handed out',
        `<p class="y-chinh">🎯 Left column: an ordinary review. Boxed column: an inspection. First contrast — what you are given to check.</p>
<p class="nhan">Ordinary review → inspection</p>
<ul>
<li><strong>The document is given out in advance</strong> → <strong>not just the product, but its sources</strong> too: you check the product <em>against</em> the documents it came from.</li>
<li><strong>Typically dozens of pages</strong> → <strong>a chunk or a sample</strong>: only a few pages, checked at the optimum rate of about 1 page per hour (lesson 3.3, slide 70).</li>
<li><strong>Instructions: "please review this"</strong> → <strong>training and roles</strong>: every checker is trained and told exactly what to look for.</li>
</ul>
<p class="nhan">Why a sample is enough</p>
<p>If the sample of 2 pages has many major defects, the rest of the document almost certainly has them too. The author then fixes that <em>type</em> of defect everywhere (slide 71).</p>`,
        `<p class="y-chinh">🎯 Cột trái: một buổi review thông thường. Cột đóng khung: inspection. Cặp đối lập thứ nhất — bạn được giao gì để kiểm tra.</p>
<p class="nhan">Review thông thường → inspection</p>
<ul>
<li><strong>Tài liệu được phát trước</strong> → <strong>không chỉ sản phẩm mà cả tài liệu nguồn</strong>: bạn kiểm tra sản phẩm <em>so với</em> các tài liệu mà nó được làm ra từ đó.</li>
<li><strong>Thường vài chục trang</strong> → <strong>một phần hoặc một mẫu</strong>: chỉ vài trang, kiểm tra ở tốc độ tối ưu khoảng 1 trang mỗi giờ (bài 3.3, slide 70).</li>
<li><strong>Chỉ dặn "xem giúp cái này"</strong> → <strong>đào tạo và vai trò</strong>: mỗi người kiểm tra đều được đào tạo và biết chính xác phải soi cái gì.</li>
</ul>
<p class="nhan">Vì sao một mẫu là đủ</p>
<p>Nếu 2 trang mẫu đã có nhiều defect nặng thì gần như chắc chắn phần còn lại cũng có. Tác giả sẽ sửa cả <em>loại</em> defect đó trên toàn bộ tài liệu (slide 71).</p>`],
      [20, 'Inspection is different (2) — before and during the meeting',
        `<p class="y-chinh">🎯 Second contrast — preparation and the meeting: in an inspection nobody comes unprepared, and the meeting is short.</p>
<p class="nhan">Ordinary review → inspection</p>
<ul>
<li><strong>Some people find time to look at it and comment before the meeting</strong> (which is hard to arrange) → <strong>entry criteria for the meeting</strong>: if checkers have not prepared, or the sample is too poor, the meeting may not be worth holding.</li>
<li><strong>The meeting often lasts for hours</strong> → <strong>2 hours maximum, often much shorter</strong>.</li>
</ul>
<p class="nhan">Why these rules exist</p>
<ul>
<li><strong>Individual preparation is mandatory</strong> in an inspection (lesson 3.3, slide 62). An unprepared meeting only reads the document aloud.</li>
<li><strong>Attention drops after about two hours</strong>, so a long meeting logs fewer defects per hour.</li>
<li><strong>Cancelling is a result, not a failure</strong> — a document that fails the entry check goes back to the author before it wastes everyone's time.</li>
</ul>`,
        `<p class="y-chinh">🎯 Cặp đối lập thứ hai — chuẩn bị và buổi họp: trong inspection không ai đến họp mà chưa chuẩn bị, và buổi họp ngắn.</p>
<p class="nhan">Review thông thường → inspection</p>
<ul>
<li><strong>Vài người có thời gian xem trước và góp ý trước buổi họp</strong> (mà việc này khó sắp xếp) → <strong>có entry criteria cho buổi họp</strong>: nếu người kiểm tra chưa chuẩn bị, hoặc mẫu quá tệ, buổi họp có thể không đáng tổ chức.</li>
<li><strong>Buổi họp thường kéo dài hàng giờ</strong> → <strong>tối đa 2 giờ, thường ngắn hơn nhiều</strong>.</li>
</ul>
<p class="nhan">Vì sao có các quy tắc này</p>
<ul>
<li><strong>Chuẩn bị cá nhân là bắt buộc</strong> trong inspection (bài 3.3, slide 62). Buổi họp không ai chuẩn bị chỉ còn là đọc to tài liệu.</li>
<li><strong>Sự tập trung giảm sau khoảng hai giờ</strong>, nên họp dài thì mỗi giờ ghi được ít defect hơn.</li>
<li><strong>Huỷ họp là một kết quả, không phải thất bại</strong> — tài liệu không qua được entry check sẽ quay về tác giả trước khi làm mất thời gian của mọi người.</li>
</ul>`],
      [21, 'Inspection is different (3) — what is logged and why we keep doing it',
        `<p class="y-chinh">🎯 Third contrast — the content of the meeting: an inspection logs objective rule violations, fast, and must keep proving its value.</p>
<p class="nhan">Ordinary review → inspection</p>
<ul>
<li><strong>"I don't like this"</strong> → <strong>rule violations: objective, not subjective</strong>. An issue counts only if it breaks a rule the group agreed on.</li>
<li><strong>Much discussion</strong>, some about technical approaches, some about trivia → <strong>no discussion, highly focused, anti-trivia</strong>. The meeting logs issues; solving them happens later.</li>
<li><strong>We don't really know if it was worthwhile, but we keep doing it</strong> → <strong>only do it if its value is proven, continually</strong>. The metrics show it.</li>
</ul>
<p class="nhan">Links to lesson 3.3</p>
<ul>
<li><strong>Rules, democratically agreed</strong>, and <strong>fast logging rates</strong> — the "Inspection surprises" of slide 72.</li>
<li><strong>Proven value</strong> — the return on investment of slide 65: 6–8 hours saved per inspection hour early on, 8–30 hours when inspection is mature.</li>
</ul>
<p class="meo">🧠 <strong>Remember the three pages as "Sources · Short · Rules"</strong>: check against sources, keep the meeting short, log only rule violations.</p>`,
        `<p class="y-chinh">🎯 Cặp đối lập thứ ba — nội dung buổi họp: inspection ghi các vi phạm quy tắc một cách khách quan và nhanh, và phải liên tục chứng minh giá trị.</p>
<p class="nhan">Review thông thường → inspection</p>
<ul>
<li><strong>"Tôi không thích chỗ này"</strong> → <strong>vi phạm quy tắc: khách quan, không chủ quan</strong>. Một vấn đề chỉ được tính khi nó phạm một quy tắc cả nhóm đã thống nhất.</li>
<li><strong>Bàn luận nhiều</strong>, có khi về cách làm kỹ thuật, có khi về chuyện vụn vặt → <strong>không bàn luận, rất tập trung, chống chuyện vụn vặt</strong>. Buổi họp chỉ ghi vấn đề; giải quyết để sau.</li>
<li><strong>Không rõ có đáng không, nhưng vẫn cứ làm</strong> → <strong>chỉ làm khi giá trị được chứng minh, liên tục</strong>. Metric cho thấy điều đó.</li>
</ul>
<p class="nhan">Nối với bài 3.3</p>
<ul>
<li><strong>Quy tắc được thống nhất dân chủ</strong> và <strong>tốc độ ghi nhanh</strong> — chính là "Inspection surprises" ở slide 72.</li>
<li><strong>Giá trị đã chứng minh</strong> — lợi tức đầu tư ở slide 65: tiết kiệm 6–8 giờ cho mỗi giờ inspection lúc mới áp dụng, 8–30 giờ khi inspection đã thành thục.</li>
</ul>
<p class="meo">🧠 <strong>Nhớ ba trang bằng "Nguồn · Ngắn · Quy tắc"</strong>: so với tài liệu nguồn, họp ngắn, chỉ ghi vi phạm quy tắc.</p>`],
      [23, 'The Inspection Process (old activity names)',
        `<p class="y-chinh">🎯 The same picture as slide 66 of lesson 3.3, drawn with the old activity names — read it to translate the names.</p>
<p class="nhan">Old box → current activity</p>
<ul>
<li><strong>Planning</strong> (the long bar over everything) → Planning.</li>
<li><strong>Kick off</strong> → Initiate review.</li>
<li><strong>Ind Chk</strong> (individual checking) → Individual review.</li>
<li><strong>Meet</strong> → Issue communication &amp; analysis.</li>
<li><strong>Edit</strong> → Fixing &amp; reporting.</li>
</ul>
<p class="nhan">Details only the old drawing has</p>
<ul>
<li><strong>The two document icons</strong> — at the entry, a page covered in spots (defects). At the exit, a page with a single spot and rays: cleaned, with an <em>estimate</em> of the major defects that remain (slide 65 calls it "quantified estimates of remaining major faults per page").</li>
<li><strong>Arrow from Edit back to the development stage</strong> — rework is done by the author, on the stage that produced the document.</li>
<li><strong>Change Request</strong> (pink) — from Edit, for defects found in the <em>source</em> documents (page 17).</li>
<li><strong>Process Improvement</strong> (cyan) — fed by both Meet and Edit, and pointing out of the picture: the lessons leave this one inspection.</li>
</ul>`,
        `<p class="y-chinh">🎯 Cùng hình với slide 66 bài 3.3, nhưng vẽ bằng tên hoạt động kiểu cũ — đọc nó để đổi tên cho đúng.</p>
<p class="nhan">Ô cũ → hoạt động hiện hành</p>
<ul>
<li><strong>Planning</strong> (thanh dài phủ lên tất cả) → Planning.</li>
<li><strong>Kick off</strong> → Initiate review.</li>
<li><strong>Ind Chk</strong> (kiểm tra cá nhân) → Individual review.</li>
<li><strong>Meet</strong> → Issue communication &amp; analysis.</li>
<li><strong>Edit</strong> → Fixing &amp; reporting.</li>
</ul>
<p class="nhan">Chi tiết chỉ hình cũ có</p>
<ul>
<li><strong>Hai biểu tượng tài liệu</strong> — ở cổng vào, một trang lấm tấm chấm (defect). Ở cổng ra, một trang chỉ còn một chấm và toả sáng: đã được làm sạch, kèm <em>ước lượng</em> số defect nặng còn sót (slide 65 gọi là "ước lượng định lượng số lỗi nặng còn lại trên mỗi trang").</li>
<li><strong>Mũi tên từ Edit quay về giai đoạn phát triển</strong> — việc sửa do tác giả làm, tại chính giai đoạn đã tạo ra tài liệu.</li>
<li><strong>Change Request</strong> (hồng) — xuất phát từ Edit, cho các defect nằm ở tài liệu <em>nguồn</em> (trang 17).</li>
<li><strong>Process Improvement</strong> (xanh) — nhận từ cả Meet lẫn Edit, và chỉ ra ngoài hình: bài học được mang ra khỏi buổi inspection này.</li>
</ul>`],
      [36, 'Unreachable code example — macro definitions',
        `<p class="y-chinh">🎯 The same unreachable-code example as slide 100 of lesson 3.4, plus one remark: the two values are <em>macros</em> that differ from platform to platform.</p>
<p class="nhan">What the extra line changes</p>
<ul>
<li><strong>On this platform</strong> both macros are 1000, so <code>1000 &lt; 1000</code> is false and the THEN clause is unreachable (page 37 = slide 100).</li>
<li><strong>On another platform</strong> the macros may be, say, <code>Buffsize 500</code> and <code>Mailboxmax 1000</code>. Then the same line is reachable and the Error-Exit is needed.</li>
<li><strong>So the warning may be a false alarm</strong> — the code is a deliberate safeguard for other platforms. This is the limitation on slide 105: a tool cannot tell "fail-safe" code from a real defect.</li>
</ul>
<p class="nhan">The same situation in C</p>
<pre><code>#define BUFFSIZE    1000   /* platform A: 1000, platform B: 500 */
#define MAILBOXMAX  1000
if (BUFFSIZE &lt; MAILBOXMAX) error_exit();</code></pre>
<p>Analysing the build for platform A, the tool reports dead code. A person has to decide whether it is a defect.</p>`,
        `<p class="y-chinh">🎯 Cùng ví dụ code không tới được như slide 100 bài 3.4, thêm một ý: hai giá trị là <em>macro</em>, mỗi nền tảng một giá trị khác.</p>
<p class="nhan">Dòng thêm vào thay đổi điều gì</p>
<ul>
<li><strong>Trên nền tảng này</strong> cả hai macro đều là 1000, nên <code>1000 &lt; 1000</code> sai và nhánh THEN không bao giờ tới được (trang 37 = slide 100).</li>
<li><strong>Trên nền tảng khác</strong> macro có thể là <code>Buffsize 500</code> và <code>Mailboxmax 1000</code>. Khi đó chính dòng này tới được và Error-Exit là cần thiết.</li>
<li><strong>Vậy cảnh báo có thể là báo động giả</strong> — đoạn code là chốt an toàn có chủ đích cho nền tảng khác. Đây là giới hạn ở slide 105: công cụ không phân biệt được code "fail-safe" với defect thật.</li>
</ul>
<p class="nhan">Cùng tình huống viết bằng C</p>
<pre><code>#define BUFFSIZE    1000   /* nền tảng A: 1000, nền tảng B: 500 */
#define MAILBOXMAX  1000
if (BUFFSIZE &lt; MAILBOXMAX) error_exit();</code></pre>
<p>Khi phân tích bản build cho nền tảng A, công cụ báo dead code. Con người phải quyết định đó có phải defect không.</p>`],
      [43, 'Summary: Key Points',
        `<p class="y-chinh">🎯 Three sentences to take away from the old chapter — all still true once "faults" becomes "defects".</p>
<ol>
<li><strong>Reviews find defects in development and test documentation, and should be applied early</strong> — the earlier a defect is found, the cheaper it is to fix (lesson 3.1, slide 18).</li>
<li><strong>Types of review: informal, walkthrough, technical / peer review, inspection</strong> — the same four types as CTFL 2018. Only read "peer review" as today's umbrella word (page 11).</li>
<li><strong>Static analysis finds defects and gives information about code without executing it</strong> — e.g. data-flow anomalies, unreachable code and cyclomatic complexity (lesson 3.4).</li>
</ol>
<p class="ghi-chu">The old deck's summary drops the decision-making review of page 11, which confirms that it is not one of the four types you are examined on.</p>`,
        `<p class="y-chinh">🎯 Ba câu cần nhớ của chương cũ — vẫn đúng cả, chỉ cần đổi "fault" thành "defect".</p>
<ol>
<li><strong>Review tìm defect trong tài liệu phát triển và tài liệu test, và nên làm sớm</strong> — defect tìm ra càng sớm thì sửa càng rẻ (bài 3.1, slide 18).</li>
<li><strong>Các loại review: informal, walkthrough, technical / peer review, inspection</strong> — đúng bốn loại của CTFL 2018. Chỉ cần hiểu "peer review" theo nghĩa bao trùm như ngày nay (trang 11).</li>
<li><strong>Phân tích tĩnh tìm defect và cho thông tin về code mà không cần chạy nó</strong> — vd data-flow anomaly, code không tới được, độ phức tạp cyclomatic (bài 3.4).</li>
</ol>
<p class="ghi-chu">Phần tóm tắt của slide cũ bỏ decision-making review ở trang 11, điều đó cho thấy nó không thuộc bốn loại review đi thi.</p>`],
    ]),
    bi(`<h3>Old word → current CTFL term (learn the right-hand column)</h3>
<div style="overflow-x:auto"><table>
<thead><tr><th>2023 deck says</th><th>Say today (CTFL 2018 / v4.0)</th><th>Page</th></tr></thead>
<tbody>
<tr><td>ISTQB / ISEB Foundation</td><td>ISTQB CTFL. ISEB was the UK (BCS) exam board whose Foundation certificate was later aligned with ISTQB; you sit the ISTQB exam.</td><td>1</td></tr>
<tr><td>fault</td><td>defect (fault and bug are synonyms of defect)</td><td>3, 11, 43</td></tr>
<tr><td>walkthrough "for education"</td><td>main purposes: find defects, improve the product, consider alternatives, check conformance; training is an additional purpose</td><td>3</td></tr>
<tr><td>peer review = technical review</td><td>peer review = any review by the author's colleagues (walkthrough, technical review, inspection)</td><td>11, 43</td></tr>
<tr><td>decision-making review</td><td>not a CTFL review type (closest: the consensus purpose of a technical review, or a management review)</td><td>11</td></tr>
<tr><td>leader "trained &amp; certified"</td><td>a trained facilitator leads the inspection meeting</td><td>12</td></tr>
<tr><td>consensus "excluding inspection"</td><td>achieving consensus is a further purpose of inspection too</td><td>13</td></tr>
<tr><td>kick-off · individual checking · meeting · edit / follow-up</td><td>initiate review · individual review · issue communication &amp; analysis · fixing &amp; reporting</td><td>14, 23</td></tr>
<tr><td>leader / moderator</td><td>review leader + facilitator (moderator), with management planning the reviews</td><td>15</td></tr>
<tr><td>inspectors</td><td>reviewers — and the scribe, missing from the old list, is mandatory in formal types</td><td>16</td></tr>
</tbody>
</table></div>
<h3>Worked example — name the review type</h3>
<div style="overflow-x:auto"><table>
<thead><tr><th>Situation</th><th>2023 deck</th><th>CTFL 2018</th><th>Deciding clue</th></tr></thead>
<tbody>
<tr><td>A developer asks the colleague at the next desk to look at a pull request. No notes are kept.</td><td>informal review</td><td><strong>informal review</strong></td><td>no documented process, a "buddy check"</td></tr>
<tr><td>The business analyst leads the team through the new SRS page by page, explaining her reasoning, so new testers understand it. A scribe notes questions.</td><td>walkthrough</td><td><strong>walkthrough</strong></td><td>led by the author</td></tr>
<tr><td>Three architects and a senior developer, led by a trained moderator, check a design and agree between a message queue and REST calls. A scribe records the decision.</td><td>technical review / decision-making review</td><td><strong>technical review</strong></td><td>technical peers, consensus, trained moderator who is not the author</td></tr>
<tr><td>Two sampled pages of a safety-critical spec are checked against their source requirements with agreed rules. The entry check passes, the meeting takes 90 minutes, and major defects per page are counted.</td><td>inspection</td><td><strong>inspection</strong></td><td>sources, rules, sample, entry criteria, metrics</td></tr>
</tbody>
</table></div>
<div class="pitfall"><ol>
<li><strong>"Peer review"</strong> in an answer usually means the umbrella term, not only the technical review.</li>
<li><strong>Consensus</strong> — do not reject an option just because it gives consensus as a purpose of inspection. It is a further purpose.</li>
<li><strong>Walkthrough</strong> — "education" alone is not its main purpose.</li>
<li><strong>Decision-making review</strong> is never the right answer to "which of the four review types…".</li>
<li><strong>Moderator</strong> = facilitator. The review leader is a different role.</li>
</ol></div>`,
    `<h3>Từ cũ → thuật ngữ CTFL hiện hành (học cột bên phải)</h3>
<div style="overflow-x:auto"><table>
<thead><tr><th>Slide 2023 ghi</th><th>Ngày nay nói (CTFL 2018 / v4.0)</th><th>Trang</th></tr></thead>
<tbody>
<tr><td>ISTQB / ISEB Foundation</td><td>ISTQB CTFL. ISEB là hội đồng thi của Anh (BCS), chứng chỉ Foundation của họ về sau được đồng bộ với ISTQB; bạn thi theo ISTQB.</td><td>1</td></tr>
<tr><td>fault</td><td>defect (fault và bug là từ đồng nghĩa của defect)</td><td>3, 11, 43</td></tr>
<tr><td>walkthrough "để đào tạo"</td><td>mục đích chính: tìm defect, cải thiện sản phẩm, xem xét phương án khác, kiểm tra tuân thủ; đào tạo là mục đích phụ</td><td>3</td></tr>
<tr><td>peer review = technical review</td><td>peer review = mọi review do đồng nghiệp của tác giả làm (walkthrough, technical review, inspection)</td><td>11, 43</td></tr>
<tr><td>decision-making review</td><td>không phải loại review của CTFL (gần nhất: mục đích đồng thuận của technical review, hoặc management review)</td><td>11</td></tr>
<tr><td>leader "được đào tạo &amp; cấp chứng chỉ"</td><td>một facilitator được đào tạo dẫn buổi họp inspection</td><td>12</td></tr>
<tr><td>đồng thuận "trừ inspection"</td><td>đạt đồng thuận cũng là mục đích phụ của inspection</td><td>13</td></tr>
<tr><td>kick-off · individual checking · meeting · edit / follow-up</td><td>initiate review · individual review · issue communication &amp; analysis · fixing &amp; reporting</td><td>14, 23</td></tr>
<tr><td>leader / moderator</td><td>review leader + facilitator (moderator), còn management lập kế hoạch review</td><td>15</td></tr>
<tr><td>inspectors</td><td>reviewer — và scribe, vai trò slide cũ bỏ sót, là bắt buộc ở các loại chính quy</td><td>16</td></tr>
</tbody>
</table></div>
<h3>Ví dụ có lời giải — gọi tên loại review</h3>
<div style="overflow-x:auto"><table>
<thead><tr><th>Tình huống</th><th>Slide 2023</th><th>CTFL 2018</th><th>Dấu hiệu quyết định</th></tr></thead>
<tbody>
<tr><td>Một developer nhờ đồng nghiệp ngồi cạnh xem giúp một pull request. Không ghi chép gì.</td><td>informal review</td><td><strong>informal review</strong></td><td>không có quy trình văn bản, kiểu "buddy check"</td></tr>
<tr><td>Business analyst dẫn cả nhóm đi qua bản SRS mới từng trang, giải thích cách cô ấy nghĩ, để tester mới hiểu. Có scribe ghi câu hỏi.</td><td>walkthrough</td><td><strong>walkthrough</strong></td><td>do tác giả dẫn</td></tr>
<tr><td>Ba kiến trúc sư và một developer cấp cao, do một moderator được đào tạo dẫn, xem một bản thiết kế và thống nhất chọn message queue hay gọi REST. Scribe ghi lại quyết định.</td><td>technical review / decision-making review</td><td><strong>technical review</strong></td><td>đồng nghiệp kỹ thuật, đồng thuận, moderator được đào tạo và không phải tác giả</td></tr>
<tr><td>Hai trang mẫu của một đặc tả an toàn-sống-còn được kiểm tra so với yêu cầu nguồn theo bộ quy tắc đã thống nhất. Qua entry check, buổi họp 90 phút, đếm số defect nặng mỗi trang.</td><td>inspection</td><td><strong>inspection</strong></td><td>tài liệu nguồn, quy tắc, mẫu, entry criteria, metric</td></tr>
</tbody>
</table></div>
<div class="pitfall"><ol>
<li><strong>"Peer review"</strong> trong đáp án thường là từ bao trùm, không chỉ riêng technical review.</li>
<li><strong>Đồng thuận</strong> — đừng loại một phương án chỉ vì nó ghi đồng thuận là mục đích của inspection. Đó là mục đích phụ.</li>
<li><strong>Walkthrough</strong> — chỉ "đào tạo" thì không phải mục đích chính.</li>
<li><strong>Decision-making review</strong> không bao giờ là đáp án cho câu "loại nào trong bốn loại review…".</li>
<li><strong>Moderator</strong> = facilitator. Review leader là một vai trò khác.</li>
</ol></div>`),
  ].join('\n'),
};

/* ─────────────────────────────────── Quiz 3 ─────────────────────────────────── */
const q = (question, options, correctIndex) => ({ question, options, correctIndex, points: 1 });
// Same, with an EN|||VI explanation shown after submit (the seeder carries it since 12/09/2026).
const qx = (question, options, correctIndex, explanation) => ({ ...q(question, options, correctIndex), explanation });

const QUIZ3 = {
  title: 'Quiz 3 — Static testing (all SWT3 slide questions)|||Quiz 3 — Kiểm thử tĩnh (toàn bộ câu hỏi trên slide SWT3)',
  slug: 'swt301-quiz-3',
  type: 'QUIZ',
  description: '53 câu: đủ 33 câu "Question" trên slide SWT3 + câu hỏi ở slide ẩn pptx 75 + câu tính V(G) slide 102 (đáp án đã giải trong bài 3.1–3.4) + 12 câu kiểm tra phần lý thuyết + 6 câu về bộ slide SWT3 bản 2023 (bài 3.5).',
  quiz: {
    timeLimitSeconds: 3180,
    questions: [
      q('Which TWO statements about static testing are MOST true? A cheap way to detect and remove defects · B makes dynamic testing less challenging · C early validation of user requirements · D finds run-time problems early · E has less value for safety-critical systems. (SWT3 s.15)|||Hai câu nào về kiểm thử tĩnh ĐÚNG NHẤT? A cách rẻ để tìm và gỡ defect · B làm kiểm thử động bớt thách thức · C validate yêu cầu người dùng từ sớm · D tìm sớm vấn đề lúc chạy · E kém giá trị với hệ thống an toàn-sống-còn. (SWT3 s.15)', ['A and C|||A và C', 'A and D|||A và D', 'B and C|||B và C', 'D and E|||D và E'], 0),
      q('Which is a correct definition of a review? (s.16)|||Định nghĩa đúng của review? (s.16)', ['An automated activity reviewing requirements, code and design to find defects|||Hoạt động tự động review yêu cầu, code, thiết kế để tìm defect', 'A mostly manual activity in which work products like requirements, code and design are reviewed to find defects|||Hoạt động chủ yếu thủ công xem xét các sản phẩm như yêu cầu, code, thiết kế để tìm defect', 'An automated activity reviewing code to find warnings and errors|||Hoạt động tự động xem code để tìm cảnh báo và lỗi', 'A manual activity examining work products to prove there is no defect|||Hoạt động thủ công xem xét sản phẩm để chứng minh không có defect'], 1),
      q('Which of the following is correct? (s.17)|||Câu nào đúng? (s.17)', ['Both reviews and static analysis are tool-driven|||Cả review và static analysis đều dùng công cụ', 'Both can be done either manually or by tools|||Cả hai đều làm được thủ công hoặc bằng công cụ', 'Reviews rely on manual examination while static analysis is tool-driven|||Review dựa vào con người xem xét, static analysis dùng công cụ', 'Static analysis is manual while reviews are tool-driven|||Static analysis thủ công, review dùng công cụ'], 2),
      q('A defect found in requirements or design costs (…) the same defect found in production. (s.18)|||Defect tìm ở yêu cầu hay thiết kế tốn (…) cùng defect đó tìm ở production. (s.18)', ['more than|||nhiều hơn', 'less than|||ít hơn', 'the same as|||bằng'], 1),
      q('Which technique is a form of static testing? (s.19)|||Kỹ thuật nào là kiểm thử tĩnh? (s.19)', ['Error guessing', 'Automated regression testing|||Regression test tự động', 'Providing inputs and examining outputs|||Đưa đầu vào và xem đầu ra', 'Code review|||Review code'], 3),
      q('Which is a benefit of static analysis? (s.20)|||Đâu là lợi ích của static analysis? (s.20)', ['Early defect identification requires less documentation|||Tìm defect sớm cần ít tài liệu hơn', 'Defects can be identified that might not be caught by dynamic testing|||Tìm được defect mà kiểm thử động có thể bỏ sót', 'Early execution of the code gauges code quality|||Chạy code sớm để đo chất lượng', 'Tools are not needed because reviews replace execution|||Không cần công cụ vì review thay cho việc chạy code'], 1),
      q('If reviews are categorised into two types, they are… (s.32)|||Nếu chia review thành hai loại, đó là… (s.32)', ['static and dynamic review|||review tĩnh và động', 'experience-based and metrics-based review|||review dựa kinh nghiệm và dựa số liệu', 'formal and informal review|||review chính quy và không chính quy', 'official and unofficial review|||review chính thức và không chính thức'], 2),
      q('Which are the correct steps of the review process? (s.33)|||Các bước đúng của quy trình review? (s.33)', ['Planning, monitoring, analysis, design, executing', 'Planning, initial review, technical review, checklist based, roles', 'Planning, initiate review, individual review, issue communication and analysis, fixing and reporting', 'Planning, initial review, executing, technical review, fixing and reporting'], 2),
      q('Which occurs in the Planning step of the review process? (s.34)|||Việc nào thuộc bước Planning của quy trình review? (s.34)', ['Distributing the work product|||Phát sản phẩm cần review', 'Defining scope and estimating effort|||Xác định phạm vi và ước lượng công sức', 'Noting potential defects|||Ghi defect tiềm năng', 'Logging defects and issues|||Ghi nhận defect và vấn đề'], 1),
      q('Difference between entry and exit criteria in the review process? (s.35)|||Khác biệt giữa entry và exit criteria trong quy trình review? (s.35)', ['Entry = goals to achieve; exit = prerequisites to begin|||Entry = mục tiêu cần đạt; exit = điều kiện để bắt đầu', 'Entry = prerequisites that might be met to begin; exit = goals to achieve|||Entry = điều kiện có thể đạt để bắt đầu; exit = mục tiêu cần đạt', 'Entry = prerequisites that must be met to begin; exit = goals to achieve|||Entry = điều kiện phải đạt để bắt đầu; exit = mục tiêu cần đạt'], 2),
      q('Which occurs in the "Initiate review" step? (s.36)|||Việc nào thuộc bước "Initiate review"? (s.36)', ['Evaluating and documenting quality characteristics|||Đánh giá và ghi lại đặc tính chất lượng', 'Gathering metrics|||Thu thập metric', 'Answering participants\' questions about the review|||Trả lời câu hỏi của người tham gia về buổi review', 'Identifying review characteristics|||Xác định đặc điểm review'], 2),
      q('Reviewing all or part of the work product and noting potential defects and questions occur in… (s.37)|||Đọc toàn bộ/một phần sản phẩm, ghi defect tiềm năng và câu hỏi thuộc bước… (s.37)', ['Initiate review', 'Individual review', 'Planning', 'Issue communication & analysis'], 1),
      q('"Evaluating the review findings against the exit criteria to make a review decision" happens in… (s.38)|||"So kết quả review với exit criteria để ra quyết định" diễn ra ở… (s.38)', ['Fixing and reporting', 'Initiate review', 'Individual review (individual preparation)', 'Issue communication & analysis'], 3),
      q('"Accepting the work product when the exit criteria are reached" happens in… (s.39)|||"Chấp nhận sản phẩm khi đạt exit criteria" diễn ra ở… (s.39)', ['Issue communication and analysis', 'Individual review', 'Fixing and reporting', 'Initiate review'], 2),
      q('Who creates the work product under review? (s.47)|||Ai tạo ra sản phẩm được review? (s.47)', ['Reviewer', 'Manager', 'Author', 'Facilitator'], 2),
      q('In a review of the code of a mobile app, who is the author? (s.48)|||Review code của một ứng dụng di động, ai là tác giả? (s.48)', ['The tester|||Tester', 'The developer|||Developer', 'The product owner|||Product owner', 'The scrum master|||Scrum master'], 1),
      q('Responsible for review planning, assigning staff and budget, monitoring cost-effectiveness: (s.49)|||Chịu trách nhiệm lập kế hoạch review, cấp người và ngân sách, theo dõi hiệu quả chi phí: (s.49)', ['the reviewer', 'the facilitator', 'the author', 'the manager'], 3),
      q('Who ensures the review meeting is run effectively? (s.50)|||Ai đảm bảo buổi họp review diễn ra hiệu quả? (s.50)', ['the reviewer', 'the facilitator', 'the manager', 'the author'], 1),
      q('Who takes overall responsibility for the review? (s.51)|||Ai chịu trách nhiệm tổng thể cho buổi review? (s.51)', ['The scribe', 'The author', 'The moderator', 'The review leader'], 3),
      q('Who collates potential defects found during individual review? (s.52)|||Ai tổng hợp defect tiềm năng tìm được ở bước review cá nhân? (s.52)', ['the moderator', 'the scribe', 'the author', 'the reviewer'], 1),
      q('Which review type aims at quickly solving minor problems? (s.73)|||Loại review nào nhằm giải quyết nhanh vấn đề nhỏ? (s.73)', ['Informal review (pairing)', 'Walkthrough', 'Technical review', 'Inspection'], 0),
      q('The informal review is called a "buddy check" because it is performed by… (s.74)|||Informal review được gọi là "buddy check" vì do… thực hiện (s.74)', ['a colleague of the facilitator|||đồng nghiệp của facilitator', 'a colleague of the author|||đồng nghiệp của tác giả', 'a colleague of the review leader|||đồng nghiệp của review leader', 'a colleague of the reviewers|||đồng nghiệp của reviewer'], 1),
      q('Main purposes of the … review type include improving the software product, considering alternative implementations and finding defects. (SWT3 hidden pptx s.75)|||Mục đích chính của loại review … gồm cải thiện sản phẩm, xem xét phương án cài đặt khác và tìm defect. (SWT3 slide ẩn pptx 75)', ['Formal', 'Informal', 'Walkthrough', 'Technical'], 2),
      q('In a walkthrough the … is mandatory and the meeting is led by the … (s.75)|||Trong walkthrough … là bắt buộc và buổi họp do … dẫn (s.75)', ['Moderator / Facilitator', 'Manager / Reviewer', 'Scribe / Author of the work product|||Scribe / Tác giả của sản phẩm', 'Scribe / Moderator'], 2),
      q('Purposes include detecting defects, building confidence and preventing future similar defects through author learning and root cause analysis: (s.76)|||Mục đích gồm tìm defect, tạo niềm tin và ngăn defect tương tự nhờ tác giả rút kinh nghiệm và phân tích nguyên nhân gốc: (s.76)', ['Formal', 'Inspection', 'Walkthrough', 'Technical review'], 1),
      q('In a technical review, the … are mandatory, and the technical peers of the author are the … (s.77)|||Trong technical review, … là bắt buộc, và đồng nghiệp kỹ thuật của tác giả là … (s.77)', ['individual preparation and author / moderators', 'individual preparation and scribe / reviewers', 'product owner and facilitator / managers', 'checklists and scribe / reviewers'], 1),
      q('When … are done properly they also prevent future similar defects and improve the process through author learning and RCA. (s.78)|||Khi … được làm đúng, chúng còn ngăn defect tương tự và cải tiến quy trình nhờ tác giả rút kinh nghiệm và RCA. (s.78)', ['Informal', 'Inspection', 'Walkthrough', 'Technical'], 1),
      q('Which review type has a defined process, individual preparation and a scribe, and produces defect logs and a review report? (s.79)|||Loại review nào có quy trình xác định, chuẩn bị cá nhân, scribe, và tạo defect log cùng review report? (s.79)', ['Walkthrough review', 'Technical review', 'Informal review', 'Inspection review'], 3),
      q('In an inspection, the review meeting is led by the… (s.80)|||Trong inspection, buổi họp review do… dẫn (s.80)', ['Facilitator', 'Author', 'Manager', 'Reviewer'], 0),
      q('Reviews done by colleagues at a similar organisational level are… (s.81)|||Review do đồng nghiệp cùng cấp bậc tổ chức thực hiện gọi là… (s.81)', ['Formal reviews', 'Peer reviews', 'Technical reviews', 'Inspection reviews'], 1),
      q('… is a systematic technique using a set of questions, distributed at review initiation, based on potential defects. (s.88)|||… là kỹ thuật có hệ thống dùng bộ câu hỏi dựa trên defect tiềm năng, phát ở bước initiate. (s.88)', ['Ad hoc', 'Checklist-based', 'Scenario and dry runs', 'Role based'], 1),
      q('Role-based review as a senior citizen, reviewing the UI of a mobile banking prototype: which area should you review? (s.89)|||Review theo vai người cao tuổi, xem giao diện bản mẫu ngân hàng di động: bạn nên review phần nào? (s.89)', ['Speed of response from the banking backend|||Tốc độ phản hồi của backend', 'Attractiveness of the application|||Độ hấp dẫn của ứng dụng', 'Size and clarity of the instruction text|||Cỡ chữ và độ rõ ràng của hướng dẫn', 'Reliability when the connection drops|||Độ tin cậy khi mất kết nối'], 2),
      q('… is used when we depend mainly on reviewer skills, with little or no planning and preparation. (s.90)|||… dùng khi phụ thuộc chủ yếu vào tay nghề người review, ít hoặc không lập kế hoạch, ít chuẩn bị. (s.90)', ['Ad hoc', 'Checklist-based', 'Scenario and dry run', 'Role based'], 0),
      q('Main difference between a walkthrough and an inspection? (s.91)|||Khác biệt chính giữa walkthrough và inspection? (s.91)', ['An inspection is led by the authors, a walkthrough by a trained moderator|||Inspection do tác giả dẫn, walkthrough do moderator được đào tạo dẫn', 'An inspection has a trained leader, a walkthrough has no leader|||Inspection có leader được đào tạo, walkthrough không có leader', 'Authors are absent in inspections but present in walkthroughs|||Tác giả vắng mặt trong inspection nhưng có mặt trong walkthrough', 'A walkthrough is led by the author, an inspection by a trained moderator|||Walkthrough do tác giả dẫn, inspection do moderator được đào tạo dẫn'], 3),
      q('Slide 102: a flow graph contains four decision diamonds. Its cyclomatic complexity is…|||Slide 102: một đồ thị luồng có bốn hình thoi quyết định. Độ phức tạp cyclomatic là…', ['3', '4', '5', '6'], 2),
      q('Which work product can NOT be examined by static testing?|||Sản phẩm nào KHÔNG thể xem xét bằng kiểm thử tĩnh?', ['A user guide|||Hướng dẫn sử dụng', 'A test plan|||Test plan', 'A contract|||Hợp đồng', 'The response time of the running system|||Thời gian phản hồi của hệ thống đang chạy'], 3),
      q('Rough guide to the cost of reviews (slide 11):|||Chi phí review ước chừng (slide 11):', ['1–2% of development effort|||1–2% công sức phát triển', '5–15% of development effort|||5–15% công sức phát triển', '30–40% of development effort|||30–40% công sức phát triển', 'Reviews cost nothing|||Review không tốn gì'], 1),
      q('The optimum checking rate for an inspection is about…|||Tốc độ kiểm tra tối ưu của inspection khoảng…', ['1 page per hour|||1 trang mỗi giờ', '5–10 pages per hour|||5–10 trang mỗi giờ', '50 pages per hour|||50 trang mỗi giờ', '100 pages per hour|||100 trang mỗi giờ'], 0),
      q('Holding a kick-off meeting (initiate review) was recorded to increase major defects found per page by about…|||Có buổi kick-off (initiate review) được ghi nhận làm tăng số defect nặng tìm được mỗi trang khoảng…', ['10%', '25%', '70%', '200%'], 2),
      q('In the review severity classes, "critical" means the defect…|||Trong các mức nghiêm trọng của review, "critical" nghĩa là defect…', ['will cause downstream damage beyond the work product under review|||chắc chắn gây hại về sau, vượt ra ngoài sản phẩm đang review', 'violates a template or standard only|||chỉ vi phạm mẫu hoặc chuẩn', 'is a spelling mistake|||là lỗi chính tả', 'was found by the author|||do tác giả tìm ra'], 0),
      q('Empirical studies show the most effective general technique for reviewing requirements is…|||Nghiên cứu thực nghiệm cho thấy kỹ thuật tổng quát hiệu quả nhất để review yêu cầu là…', ['Ad hoc reviewing', 'Checklist-based reviewing', 'Perspective-based reading', 'Buddy check'], 2),
      q('In an inspection, the author may NOT act as…|||Trong inspection, tác giả KHÔNG được làm…', ['a participant who answers questions|||người tham gia trả lời câu hỏi', 'the person who fixes the defects|||người sửa defect', 'the reader, scribe or review leader|||reader, scribe hay review leader', 'the creator of the work product|||người tạo ra sản phẩm'], 2),
      q('In "x = y + z", data-flow analysis says…|||Trong "x = y + z", data-flow analysis cho biết…', ['x is used; y and z are defined|||x được dùng; y và z được định nghĩa', 'x is defined; y and z are used|||x được định nghĩa; y và z được dùng', 'all three are declared|||cả ba được khai báo', 'all three are undefined|||cả ba chưa xác định'], 1),
      q('"n := 0; read(x); n := 1; …" — the anomaly on n is…|||"n := 0; read(x); n := 1; …" — anomaly của n là…', ['used before it is defined|||dùng trước khi được định nghĩa', 're-defined without being used|||được định nghĩa lại khi chưa được dùng', 'declared twice|||khai báo hai lần', 'an infinite loop|||vòng lặp vô hạn'], 1),
      q('Buffsize = 1000, Mailboxmax = 1000; IF Buffsize < Mailboxmax THEN Error-Exit. Static analysis reports…|||Buffsize = 1000, Mailboxmax = 1000; IF Buffsize < Mailboxmax THEN Error-Exit. Phân tích tĩnh báo…', ['an undeclared variable|||biến chưa khai báo', 'the THEN clause is unreachable|||nhánh THEN không bao giờ tới được', 'a parameter type mismatch|||sai kiểu tham số', 'nothing|||không có gì'], 1),
      q('The flow graph of slide 103 has 10 nodes and 12 edges. V(G) = …|||Đồ thị luồng ở slide 103 có 10 đỉnh và 12 cạnh. V(G) = …', ['2', '3', '4', '12'], 2),
      q('A limitation of static analysis tools is that they…|||Một giới hạn của công cụ phân tích tĩnh là chúng…', ['must execute the code|||phải chạy code', 'cannot find unreachable code|||không tìm được code không tới được', 'produce false positives and say nothing about operating conditions|||sinh cảnh báo thừa và không nói gì về điều kiện vận hành', 'only work on requirements documents|||chỉ dùng được cho tài liệu yêu cầu'], 2),
      qx('The 2023 slides call the technical review "peer review". In today\'s ISTQB glossary a peer review is…|||Slide 2023 gọi technical review là "peer review". Trong glossary ISTQB hiện nay, peer review là…', ['only another name for a technical review|||chỉ là tên khác của technical review', 'any review by colleagues of the author, e.g. walkthrough, technical review or inspection|||mọi review do đồng nghiệp của tác giả làm, vd walkthrough, technical review hay inspection', 'a review led by management|||review do quản lý dẫn', 'an automated review done by a static analysis tool|||review tự động bằng công cụ phân tích tĩnh'], 1, 'ISTQB glossary: a peer review is a review of a work product by colleagues of its author, so walkthroughs, technical reviews and inspections are all peer reviews. The 2023 deck used the term narrowly for the technical review.|||Glossary ISTQB: peer review là review sản phẩm do đồng nghiệp của tác giả thực hiện, nên walkthrough, technical review và inspection đều là peer review. Bộ slide 2023 dùng từ này hẹp hơn, chỉ cho technical review.'),
      qx('The old review activity "overview / kick-off meeting" corresponds in the CTFL 2018 review process to…|||Hoạt động cũ "overview / kick-off meeting" tương ứng với hoạt động nào trong quy trình review CTFL 2018?', ['Planning', 'Initiate review', 'Individual review', 'Fixing and reporting'], 1, 'The kick-off (distributing the work product, explaining objectives and process, answering questions) belongs to Initiate review in CTFL 2018. Planning comes before it and defines scope, roles and entry/exit criteria.|||Kick-off (phát tài liệu, giải thích mục tiêu và quy trình, trả lời câu hỏi) thuộc hoạt động Initiate review trong CTFL 2018. Planning là bước trước đó, xác định phạm vi, vai trò và tiêu chí vào/ra.'),
      qx('According to the 2023 slides "Inspection is different", which is typical of an inspection rather than an ordinary review?|||Theo các slide 2023 "Inspection is different", điều nào là đặc trưng của inspection chứ không phải review thông thường?', ['Dozens of pages handed out with the instruction "please review this"|||Phát vài chục trang kèm lời dặn "xem giúp cái này"', 'Checking a sample against its source documents using agreed rules|||Kiểm tra một mẫu so với tài liệu nguồn theo bộ quy tắc đã thống nhất', 'A meeting of several hours discussing technical approaches|||Họp nhiều giờ bàn về cách làm kỹ thuật', 'Only those who have time comment before the meeting|||Ai rảnh thì góp ý trước buổi họp'], 1, 'An inspection checks a limited sample against its source documents using agreed rules and checklists, led by a trained facilitator. Dozens of pages handed out, long technical debates or optional comments are signs of an ordinary, informal review.|||Inspection kiểm một mẫu giới hạn so với tài liệu nguồn theo quy tắc và checklist đã thống nhất, do facilitator được đào tạo dẫn dắt. Phát vài chục trang, họp dài bàn kỹ thuật hay ai rảnh thì góp ý là dấu hiệu của review thông thường, không chính thức.'),
      qx('While reviewing a design, the team finds that the real mistake is in the requirements specification. Per the 2023 slide "Reviews in general 4", the review should produce…|||Khi review bản thiết kế, nhóm phát hiện lỗi thật nằm ở đặc tả yêu cầu. Theo slide 2023 "Reviews in general 4", buổi review nên cho ra…', ['an edit to the design only|||chỉ một chỉnh sửa trong bản thiết kế', 'a change request for the source document|||một change request cho tài liệu nguồn', 'nothing, because requirements are out of scope|||không gì cả, vì yêu cầu nằm ngoài phạm vi', 'a new test case for the design|||một test case mới cho bản thiết kế'], 1, 'A defect that lives in the source document is not fixed inside the design under review: the review raises a change request for the requirements specification, so its owner corrects it through change control.|||Defect nằm ở tài liệu nguồn không được sửa ngay trong bản thiết kế đang review: buổi review ghi một change request cho đặc tả yêu cầu để người phụ trách sửa qua quy trình quản lý thay đổi.'),
      qx('The 2023 slides say anything written down can be inspected, but some things can only be reviewed. Which one?|||Slide 2023 nói mọi thứ đã viết ra đều inspect được, nhưng có thứ chỉ review được. Đó là gì?', ['A test plan|||Test plan', 'Source code|||Mã nguồn', 'Project progress and "should we develop this?" options|||Tiến độ dự án và các phương án "có nên phát triển cái này không?"', 'A user manual|||Hướng dẫn sử dụng'], 2, 'An inspection needs a written work product plus source documents and rules to check it against. Project progress and go/no-go options have no such source, so they can be reviewed (for example in a management review) but not inspected; plans, code and manuals can be inspected.|||Inspection cần một sản phẩm viết ra cùng tài liệu nguồn và quy tắc để đối chiếu. Tiến độ dự án và phương án có nên làm hay không không có nguồn như vậy, nên chỉ review được (ví dụ management review) chứ không inspect được; plan, code và tài liệu hướng dẫn thì inspect được.'),
      qx('The 2023 slides label the walkthrough "for education". Under CTFL 2018 the MAIN purposes of a walkthrough are…|||Slide 2023 ghi walkthrough là "để đào tạo". Theo CTFL 2018, mục đích CHÍNH của walkthrough là…', ['training participants only|||chỉ đào tạo người tham gia', 'finding defects, improving the product, considering alternatives, evaluating conformance to standards|||tìm defect, cải thiện sản phẩm, xem xét phương án khác, đánh giá việc tuân thủ chuẩn', 'gathering metrics for process improvement|||thu thập metric để cải tiến quy trình', 'making a go/no-go release decision|||ra quyết định phát hành go/no-go'], 1, 'CTFL 2018 lists the main purposes of a walkthrough as finding defects, improving the product, considering alternative implementations and evaluating conformance to standards. Training participants is only a possible additional purpose.|||CTFL 2018 liệt kê mục đích chính của walkthrough là tìm defect, cải thiện sản phẩm, xem xét phương án khác và đánh giá việc tuân thủ chuẩn. Đào tạo người tham gia chỉ là mục đích phụ có thể có.'),
    ],
  },
};

export default {
  title: 'Chapter 3 — Static testing|||Chương 3 — Kiểm thử tĩnh',
  description: 'SWT3 (106 slide) học từng slide: kiểm thử tĩnh và giá trị của nó, quy trình review 5 hoạt động & 6 vai trò, 4 loại review, 5 kỹ thuật review, yếu tố thành công, phân tích tĩnh (data flow, control flow, cyclomatic complexity) — kèm đáp án mọi câu hỏi trên slide, ví dụ review log và code Java chạy thật.',
  lessons: [L31, L32, L33, L34, L35, QUIZ3],
};
