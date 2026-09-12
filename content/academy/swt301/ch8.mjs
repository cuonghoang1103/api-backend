/**
 * SWT301 · Chapter 8 — Test tools & automation.
 * Source: SWT6_tim.pptx (54 visible slides, no hidden slides) + teacher's speaker
 * notes + the course sample kit 01.Materials/04.Samples (build.xml,
 * junit-4.13.2.jar, hamcrest-core-1.3.jar) + JUnit in Action 3rd ed.
 * Lesson split follows the deck's own mind map:
 *   8.1 Purposes, classification, probe effect    slides 1–8
 *   8.2 Tool support per activity                  slides 9–35
 *   8.3 Benefits, risks, special considerations    slides 36–47
 *   8.4 Selecting & introducing a tool             slides 48–54
 *   8.5 HANDS-ON JUnit 4 (sample kit) → JUnit 5    (no slides; code verified)
 *   8.6 Test pyramid, CI & Selenium WebDriver      (no slides)
 * SWT6 has no "Question" slides; the quiz is written against the ISTQB CTFL
 * 2018 (v3.1) syllabus, chapter 6.
 * Every console output quoted below was produced by really running the code
 * (javac/java 21, Maven 3.9.11 + JUnit 5.12.2 + JaCoCo 0.8.13).
 */
import { walk, walkHead, books, bi } from './_slides.mjs';

const D = 'swt6';

/* ─────────────── 8.1 Purposes, classification & the probe effect ─────────────── */
const L81 = {
  title: '8.1 — Why tools? Purposes, classification & the probe effect|||8.1 — Vì sao cần công cụ? Mục đích, phân loại & hiệu ứng thăm dò (probe effect)',
  slug: 'swt301-tools-pyramid',
  type: 'VIDEO',
  description: 'SWT6 slide 1–8: bản đồ Chương 6, 5 mục đích dùng công cụ test, 5 cách phân loại, 6 nhóm công cụ theo hoạt động, ký hiệu (D), công cụ xâm lấn & probe effect, Heisenbug.',
  content: [
    bi(`<span class="eyebrow">Chapter 8 · Lesson 8.1 · SWT6 slides 1–8</span>
<h2>Tool support for testing — why, and how tools are classified</h2>
<p class="lead">The last chapter of the ISTQB syllabus (deck <em>SWT6</em>) is about <strong>tools</strong>. It is short in the exam (only <strong>2 of 40</strong> questions, SWT0 slide 7), but it is the chapter you will use every day in a job.</p>
<p class="nhan">This lesson explains</p>
<ul>
<li><strong>Why</strong> we use tools at all.</li>
<li>The <strong>ways tools are classified</strong> — the syllabus uses one: by the test activity they support.</li>
<li>What the little <strong>(D)</strong> on the next slides means.</li>
<li>A subtle idea examiners love: <strong>intrusive tools</strong> and the <strong>probe effect</strong>.</li>
</ul>
<div class="callout"><strong>Learning objectives.</strong> LO-6.1.1 Classify test tools according to their purpose and the test activities they support (K2). The rest of Chapter 6 (6.1.2 benefits &amp; risks, 6.1.3 special considerations, 6.2.x selection, pilot, success factors) are all K1 — recognise and recall — and come in lessons 8.3–8.4.</div>
<h3>The six groups of tools in one screen</h3>
<table>
<thead><tr><th>Group (by test activity)</th><th>Tools in the group</th><th>Typical user</th></tr></thead>
<tbody>
<tr><td>1 · Management of testing &amp; testware</td><td>Test management &amp; ALM, requirements management, defect management, configuration management, continuous integration <strong>(D)</strong></td><td>Test manager, whole team</td></tr>
<tr><td>2 · Static testing</td><td>Review support tools, static analysis tools <strong>(D)</strong></td><td>Reviewers; developers</td></tr>
<tr><td>3 · Test design &amp; implementation</td><td>Test design, model-based testing, test data preparation, ATDD &amp; BDD, TDD <strong>(D)</strong></td><td>Testers, BA, developers</td></tr>
<tr><td>4 · Test execution &amp; logging</td><td>Test execution tools, coverage tools <strong>(D)</strong>, test harnesses <strong>(D)</strong>, unit test frameworks <strong>(D)</strong></td><td>Testers, developers</td></tr>
<tr><td>5 · Performance measurement &amp; dynamic analysis</td><td>Performance/load testing tools <strong>(D)</strong>, monitoring tools, dynamic analysis tools <strong>(D)</strong></td><td>Performance specialists, ops, developers</td></tr>
<tr><td>6 · Specialised testing needs</td><td>Data quality, data conversion &amp; migration, usability, accessibility, localisation, security, portability</td><td>Specialists</td></tr>
</tbody>
</table>
<p><strong>(D)</strong> = "more likely to be used by developers" — mostly at component and component-integration level.</p>`,
      `<span class="eyebrow">Chương 8 · Bài 8.1 · SWT6 slide 1–8</span>
<h2>Công cụ hỗ trợ kiểm thử — vì sao cần, và được phân loại thế nào</h2>
<p class="lead">Chương cuối của syllabus ISTQB (bộ slide <em>SWT6</em>) nói về <strong>công cụ</strong>. Trong đề thi nó ngắn (chỉ <strong>2/40</strong> câu, SWT0 slide 7), nhưng lại là chương bạn dùng hằng ngày khi đi làm.</p>
<p class="nhan">Bài này giải thích</p>
<ul>
<li><strong>Vì sao</strong> phải dùng công cụ.</li>
<li><strong>Các cách phân loại công cụ</strong> — syllabus dùng một cách: theo hoạt động kiểm thử mà công cụ hỗ trợ.</li>
<li>Chữ <strong>(D)</strong> nhỏ trên các slide sau nghĩa là gì.</li>
<li>Một ý tinh tế mà giám khảo rất thích: <strong>công cụ xâm lấn (intrusive tool)</strong> và <strong>hiệu ứng thăm dò (probe effect)</strong>.</li>
</ul>
<div class="callout"><strong>Chuẩn đầu ra.</strong> LO-6.1.1 Phân loại công cụ test theo mục đích và theo hoạt động kiểm thử mà chúng hỗ trợ (K2). Phần còn lại của Chương 6 (6.1.2 lợi ích &amp; rủi ro, 6.1.3 lưu ý đặc biệt, 6.2.x chọn công cụ, pilot, yếu tố thành công) đều là K1 — nhận biết và nhớ lại — nằm ở bài 8.3–8.4.</div>
<h3>Sáu nhóm công cụ trong một màn hình</h3>
<table>
<thead><tr><th>Nhóm (theo hoạt động test)</th><th>Các công cụ trong nhóm</th><th>Ai hay dùng</th></tr></thead>
<tbody>
<tr><td>1 · Quản lý kiểm thử &amp; testware</td><td>Quản lý test &amp; ALM, quản lý yêu cầu, quản lý defect, quản lý cấu hình, tích hợp liên tục (CI) <strong>(D)</strong></td><td>Test manager, cả đội</td></tr>
<tr><td>2 · Kiểm thử tĩnh</td><td>Công cụ hỗ trợ review, công cụ phân tích tĩnh <strong>(D)</strong></td><td>Người review; developer</td></tr>
<tr><td>3 · Thiết kế &amp; triển khai test</td><td>Thiết kế test, model-based testing, chuẩn bị dữ liệu test, ATDD &amp; BDD, TDD <strong>(D)</strong></td><td>Tester, BA, developer</td></tr>
<tr><td>4 · Thực thi &amp; ghi log test</td><td>Công cụ thực thi test, công cụ đo coverage <strong>(D)</strong>, test harness <strong>(D)</strong>, unit test framework <strong>(D)</strong></td><td>Tester, developer</td></tr>
<tr><td>5 · Đo hiệu năng &amp; phân tích động</td><td>Công cụ test hiệu năng/tải <strong>(D)</strong>, công cụ giám sát (monitoring), công cụ phân tích động <strong>(D)</strong></td><td>Chuyên gia hiệu năng, vận hành, developer</td></tr>
<tr><td>6 · Nhu cầu kiểm thử đặc thù</td><td>Chất lượng dữ liệu, chuyển đổi &amp; di trú dữ liệu, usability, accessibility, bản địa hoá, bảo mật, portability</td><td>Chuyên gia</td></tr>
</tbody>
</table>
<p><strong>(D)</strong> = "thường do developer dùng" — chủ yếu ở cấp component và component integration.</p>`),
    walkHead(D, 1, 8, 'SWT6 has <strong>no Question slides</strong> — the check-yourself questions are in Quiz 8 at the end of the chapter.', 'SWT6 <strong>không có slide Question</strong> — câu hỏi tự kiểm tra nằm ở Quiz 8 cuối chương.'),
    walk(D, [
      [1, 'Tools (cover)',
        `<p class="y-chinh">🎯 This deck is syllabus <em>Chapter 6 — Tools</em>: the last of the six ISTQB boxes.</p>
<ul>
<li><strong>The map</strong> — the six-box map of the ISTQB syllabus again, this time with box <strong>6 Tools</strong> highlighted.</li>
<li><strong>Numbering</strong> — on this site it is Chapter 8, because the course inserts an Agile chapter and hands-on practice.</li>
</ul>
<p class="ghi-chu">The teacher's notes only translate "Principles" (Nguyên tắc) — the first box.</p>`,
        `<p class="y-chinh">🎯 Bộ slide này là <em>Chương 6 — Tools</em> của syllabus: ô cuối cùng trong sáu ô ISTQB.</p>
<ul>
<li><strong>Sơ đồ</strong> — lại là sơ đồ sáu ô của syllabus ISTQB, lần này ô <strong>6 Tools</strong> được tô.</li>
<li><strong>Số chương</strong> — trên trang này nó là Chương 8, vì môn học chèn thêm chương Agile và phần thực hành.</li>
</ul>
<p class="ghi-chu">Ghi chú của thầy/cô chỉ dịch chữ "Principles" (Nguyên tắc) — ô đầu tiên.</p>`],
      [2, 'CONTENT',
        `<p class="y-chinh">🎯 Only two parts — exactly the two sections of syllabus Chapter 6.</p>
<ol>
<li><strong>6.1 Test tool considerations</strong> — what tools exist, benefits and risks, special considerations. Covered in lessons 8.1–8.3.</li>
<li><strong>6.2 Effective use of tools</strong> — how to select a tool, run a pilot project and roll it out successfully. Covered in lesson 8.4.</li>
</ol>`,
        `<p class="y-chinh">🎯 Chỉ có hai phần — đúng hai mục của Chương 6 syllabus.</p>
<ol>
<li><strong>6.1 Test tool considerations</strong> — có những công cụ gì, lợi ích và rủi ro, các lưu ý đặc biệt. Nằm ở bài 8.1–8.3.</li>
<li><strong>6.2 Effective use of tools</strong> — chọn công cụ thế nào, chạy dự án pilot, triển khai thành công. Nằm ở bài 8.4.</li>
</ol>`],
      [3, 'Mind map — Chap 6 Tool Support for Testing',
        `<p class="y-chinh">🎯 The whole chapter on one mind map: a right branch (considerations) and a left branch (effective use).</p>
<p class="nhan">Right branch — Test Tool Considerations</p>
<ul>
<li><strong>Test Tool Classification</strong> — six leaves: Tool classification, Management of testing &amp; testware, Static testing, Test design &amp; specification, Performance &amp; dynamic analysis, Specialised needs.</li>
<li><strong>Benefits &amp; Risks of Test Automation</strong>.</li>
<li><strong>Execution &amp; Management Tools Considerations</strong> — Test execution (capture/replay, data-driven, keyword-driven, model-based) and Test management.</li>
</ul>
<p class="nhan">Left branch — Effective Use of Tools</p>
<ul>
<li>Principles for tool selection</li>
<li>Pilot project</li>
<li>Success factors for tools</li>
</ul>
<p class="nhan">Two details to notice</p>
<ul>
<li><strong>Old name</strong> — the leaf "Test Design &amp; <em>Specification</em>" was renamed "Test design &amp; <em>implementation</em>" in the 2018 syllabus (slides 16–20 use the new name).</li>
<li><strong>Missing group</strong> — the Classification branch has no leaf for group 4, "Test execution &amp; logging" (slides 21–24). The "Test Execution" leaf you see belongs to the <em>Considerations</em> branch (slides 42–46).</li>
</ul>
<p class="ghi-chu">The map reappears at slides 5, 36, 41 and 49 as a "you are here" marker.</p>`,
        `<p class="y-chinh">🎯 Cả chương trên một sơ đồ tư duy: nhánh phải (các lưu ý) và nhánh trái (dùng hiệu quả).</p>
<p class="nhan">Nhánh phải — Test Tool Considerations</p>
<ul>
<li><strong>Test Tool Classification</strong> — sáu lá: Phân loại công cụ, Quản lý kiểm thử &amp; testware, Kiểm thử tĩnh, Thiết kế &amp; đặc tả test, Hiệu năng &amp; phân tích động, Nhu cầu đặc thù.</li>
<li><strong>Benefits &amp; Risks of Test Automation</strong>.</li>
<li><strong>Execution &amp; Management Tools Considerations</strong> — Thực thi test (capture/replay, data-driven, keyword-driven, model-based) và Quản lý test.</li>
</ul>
<p class="nhan">Nhánh trái — Effective Use of Tools</p>
<ul>
<li>Nguyên tắc chọn công cụ</li>
<li>Dự án pilot</li>
<li>Yếu tố thành công</li>
</ul>
<p class="nhan">Hai chi tiết cần để ý</p>
<ul>
<li><strong>Tên cũ</strong> — lá "Test Design &amp; <em>Specification</em>" đã được syllabus 2018 đổi thành "Test design &amp; <em>implementation</em>" (slide 16–20 dùng tên mới).</li>
<li><strong>Thiếu một nhóm</strong> — nhánh Classification không có lá cho nhóm 4, "Test execution &amp; logging" (slide 21–24). Lá "Test Execution" bạn thấy thuộc nhánh <em>Considerations</em> (slide 42–46).</li>
</ul>
<p class="ghi-chu">Sơ đồ này quay lại ở slide 5, 36, 41 và 49 như dấu "bạn đang ở đây".</p>`],
      [4, 'CONTENT — Test tool considerations',
        `<p class="y-chinh">🎯 Part 1 zoomed in: three bullets = the three learning objectives LO-6.1.1, 6.1.2 and 6.1.3.</p>
<ol>
<li><strong>Test tool classifications</strong> — LO-6.1.1.</li>
<li><strong>Benefits &amp; risks of test automation</strong> — LO-6.1.2.</li>
<li><strong>Special considerations for test execution &amp; test management tools</strong> — LO-6.1.3.</li>
</ol>`,
        `<p class="y-chinh">🎯 Phóng to phần 1: ba gạch đầu dòng = ba chuẩn đầu ra LO-6.1.1, 6.1.2 và 6.1.3.</p>
<ol>
<li><strong>Phân loại công cụ</strong> — LO-6.1.1.</li>
<li><strong>Lợi ích &amp; rủi ro của tự động hoá kiểm thử</strong> — LO-6.1.2.</li>
<li><strong>Lưu ý đặc biệt cho công cụ thực thi &amp; công cụ quản lý test</strong> — LO-6.1.3.</li>
</ol>`],
      [5, 'Mind map (repeated)',
        `<p class="y-chinh">🎯 The same mind map as slide 3, shown again before the first leaf, <em>Tool Classification</em>.</p>
<ul>
<li><strong>Nothing new</strong> — use it as a self-test: can you name all six classification leaves from memory?</li>
</ul>`,
        `<p class="y-chinh">🎯 Sơ đồ giống slide 3, chiếu lại trước khi vào lá đầu tiên, <em>Tool Classification</em>.</p>
<ul>
<li><strong>Không có gì mới</strong> — hãy dùng nó để tự kiểm tra: bạn có kể đủ sáu lá phân loại mà không nhìn không?</li>
</ul>`],
      [6, 'Tool Classification — purposes for using tools',
        `<p class="y-chinh">🎯 We use tools for five <strong>purposes</strong> — the red words on the slide are the keys.</p>
<ol>
<li><strong>Automating repetitive tasks</strong> or tasks that need significant resources manually — <em>efficiency</em> (regression runs, re-entering the same data, setting up environments).</li>
<li><strong>Supporting manual test activities</strong> throughout the process — <em>efficiency</em> (a test management tool helps you plan, log and report even when every test is run by hand).</li>
<li><strong>Improving the quality of test activities</strong> — more consistent testing and a higher level of <em>defect reproducibility</em> (the tool does exactly the same thing every time and records it).</li>
<li><strong>Automating what cannot be done manually</strong> — e.g. simulating 10,000 concurrent users, measuring response time in milliseconds.</li>
<li><strong>Increasing the reliability of testing</strong> — e.g. comparing two large data files, which a tired human would get wrong.</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> <em>faster, helps people, better, impossible-by-hand, more reliable</em>.</p>
<p class="ghi-chu">The teacher's notes are a line-by-line Vietnamese translation.</p>`,
        `<p class="y-chinh">🎯 Ta dùng công cụ vì năm <strong>mục đích</strong> — chữ đỏ trên slide là chữ khoá.</p>
<ol>
<li><strong>Tự động hoá việc lặp đi lặp lại</strong> hoặc việc làm tay tốn nhiều nguồn lực — <em>hiệu quả</em> (chạy regression, nhập lại cùng dữ liệu, dựng môi trường).</li>
<li><strong>Hỗ trợ các hoạt động test thủ công</strong> suốt quy trình — <em>hiệu quả</em> (công cụ quản lý test giúp lập kế hoạch, ghi log, báo cáo ngay cả khi mọi test đều chạy tay).</li>
<li><strong>Nâng chất lượng hoạt động test</strong> — test nhất quán hơn và <em>khả năng tái hiện lỗi</em> cao hơn (công cụ làm y hệt nhau mỗi lần và ghi lại).</li>
<li><strong>Tự động hoá việc không thể làm tay</strong> — vd giả lập 10.000 người dùng đồng thời, đo thời gian phản hồi tính bằng mili giây.</li>
<li><strong>Tăng độ tin cậy của kiểm thử</strong> — vd so sánh hai file dữ liệu lớn, việc mà người mệt mỏi sẽ làm sai.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> <em>nhanh hơn, đỡ người, tốt hơn, tay không làm nổi, tin cậy hơn</em>.</p>
<p class="ghi-chu">Ghi chú của thầy/cô là bản dịch tiếng Việt từng dòng.</p>`],
      [7, 'Tool Classification — how are tools classified?',
        `<p class="y-chinh">🎯 Tools can be classified in five ways; the ISTQB syllabus uses the last one — <em>by test activity</em>.</p>
<p class="nhan">Five ways to classify</p>
<ol>
<li><strong>By purpose</strong></li>
<li><strong>By licensing model</strong> — commercial, free, open source, freemium…</li>
<li><strong>By price</strong></li>
<li><strong>By technology used</strong> — web, mobile, API, desktop, embedded.</li>
<li><strong>By the testing activities/areas supported</strong> — the one the syllabus uses, and the one the rest of the deck follows (slides 9–34).</li>
</ol>
<p class="nhan">Good to know</p>
<ul>
<li><strong>Tool suites</strong> — one commercial product often covers several groups: Jira + Xray does test management, defect management and requirements traceability at once.</li>
</ul>`,
        `<p class="y-chinh">🎯 Có năm cách phân loại công cụ; syllabus ISTQB dùng cách cuối — <em>theo hoạt động kiểm thử</em>.</p>
<p class="nhan">Năm cách phân loại</p>
<ol>
<li><strong>Theo mục đích</strong></li>
<li><strong>Theo mô hình bản quyền</strong> — thương mại, miễn phí, mã nguồn mở, freemium…</li>
<li><strong>Theo giá</strong></li>
<li><strong>Theo công nghệ</strong> — web, mobile, API, desktop, nhúng.</li>
<li><strong>Theo hoạt động/lĩnh vực kiểm thử được hỗ trợ</strong> — cách syllabus dùng, và phần còn lại của bộ slide đi theo cách này (slide 9–34).</li>
</ol>
<p class="nhan">Nên biết</p>
<ul>
<li><strong>Bộ công cụ (tool suite)</strong> — một sản phẩm thương mại thường phủ nhiều nhóm: Jira + Xray vừa quản lý test, vừa quản lý defect, vừa truy vết yêu cầu.</li>
</ul>`],
      [8, 'Tool Classification — intrusive tools & probe effect',
        `<p class="y-chinh">🎯 An <strong>intrusive tool</strong> gets inside the SUT; the difference it causes there is the <strong>probe effect</strong>.</p>
<p class="nhan">The two terms</p>
<ul>
<li><strong>Intrusive tool</strong> — a tool that has to get <em>inside</em> the system under test (SUT) to do its job, and so may change how the SUT behaves.</li>
<li><strong>Probe effect</strong> — the <em>consequence</em>: the difference the tool itself causes.</li>
</ul>
<p class="nhan">Three examples on the slide</p>
<ol>
<li><strong>Performance tools</strong> — they record a start and a stop time for each transaction; storing those timestamps adds a tiny extra time to the very response time being measured.</li>
<li><strong>Coverage tools</strong> — they add <em>instrumentation code</em> into the real code (JaCoCo inserts probes into the bytecode). The instrumented program is not exactly the program you ship, and it runs slower. Two coverage tools may even report different percentages for the same tests, because they count elements differently.</li>
<li><strong>Heisenbugs</strong> — the teacher's note: "a software bug that seems to disappear or change its behaviour when one attempts to study it". Classic case: a race condition that vanishes when you run in the debugger or add a <code>println</code>, because the timing changed.</li>
</ol>
<div class="callout ok"><strong>How to remember:</strong> the <em>tool</em> is intrusive; the <em>effect</em> on the SUT is the probe effect. The name comes from physics (measuring something disturbs it); "Heisenbug" is a pun on Heisenberg.</div>`,
        `<p class="y-chinh">🎯 <strong>Công cụ xâm lấn</strong> chui vào trong SUT; sự khác biệt nó gây ra ở đó gọi là <strong>probe effect</strong>.</p>
<p class="nhan">Hai thuật ngữ</p>
<ul>
<li><strong>Công cụ xâm lấn (intrusive tool)</strong> — công cụ phải chui <em>vào bên trong</em> hệ thống đang test (SUT) mới làm được việc, và vì thế có thể làm SUT chạy khác đi.</li>
<li><strong>Probe effect (hiệu ứng thăm dò)</strong> — <em>hậu quả</em>: sự khác biệt do chính công cụ gây ra.</li>
</ul>
<p class="nhan">Ba ví dụ trên slide</p>
<ol>
<li><strong>Công cụ hiệu năng</strong> — ghi thời điểm bắt đầu và kết thúc mỗi giao dịch; việc lưu các mốc thời gian đó cộng thêm một chút vào chính thời gian phản hồi đang đo.</li>
<li><strong>Công cụ đo coverage</strong> — chèn <em>mã đo (instrumentation)</em> vào code thật (JaCoCo chèn "probe" vào bytecode). Chương trình đã chèn không y hệt chương trình bạn giao, và nó chạy chậm hơn. Hai công cụ coverage khác nhau còn có thể báo phần trăm khác nhau cho cùng bộ test, vì cách đếm phần tử khác nhau.</li>
<li><strong>Heisenbug</strong> — ghi chú của thầy/cô: "lỗi phần mềm dường như biến mất hoặc đổi hành vi khi người ta cố nghiên cứu nó". Ví dụ kinh điển: lỗi tranh chấp (race condition) biến mất khi chạy trong debugger hoặc thêm một dòng <code>println</code>, vì thời gian chạy đã thay đổi.</li>
</ol>
<div class="callout ok"><strong>Cách nhớ:</strong> <em>công cụ</em> thì xâm lấn; <em>ảnh hưởng</em> lên SUT là probe effect. Tên gọi lấy từ vật lý (đo một thứ là làm xáo trộn nó); "Heisenbug" là chơi chữ từ tên Heisenberg.</div>`],
    ]),
    bi(`<h3>Ví dụ có lời giải · Worked example — classify twelve real tools</h3>
<p>For each tool name the ISTQB group, whether it is a (D) tool, and whether it is intrusive. Try it yourself before reading the answer column.</p>
<div class="table-wrap"><table>
<thead><tr><th>#</th><th>Tool</th><th>ISTQB group → tool type</th><th>(D)?</th><th>Intrusive?</th></tr></thead>
<tbody>
<tr><td>1</td><td>Jira + Xray / TestRail</td><td>Management → test management &amp; defect management</td><td>no</td><td>no</td></tr>
<tr><td>2</td><td>Git</td><td>Management → configuration management</td><td>no</td><td>no</td></tr>
<tr><td>3</td><td>Jenkins, GitHub Actions</td><td>Management → continuous integration</td><td>D</td><td>no</td></tr>
<tr><td>4</td><td>SonarQube, Checkstyle, PMD</td><td>Static testing → static analysis</td><td>D</td><td>no — the code is not executed</td></tr>
<tr><td>5</td><td>Cucumber (Gherkin)</td><td>Test design &amp; implementation → BDD</td><td>no</td><td>no</td></tr>
<tr><td>6</td><td>JUnit, TestNG</td><td>Execution &amp; logging → unit test framework (and a TDD tool)</td><td>D</td><td>no</td></tr>
<tr><td>7</td><td>Mockito (stubs/mocks)</td><td>Execution &amp; logging → test harness support</td><td>D</td><td>no</td></tr>
<tr><td>8</td><td>JaCoCo</td><td>Execution &amp; logging → coverage tool</td><td>D</td><td><strong>yes</strong> — instruments bytecode</td></tr>
<tr><td>9</td><td>Selenium WebDriver, Playwright</td><td>Execution &amp; logging → test execution tool</td><td>no</td><td>mildly — drives the real UI through a browser driver</td></tr>
<tr><td>10</td><td>JMeter, k6</td><td>Performance &amp; dynamic analysis → performance/load testing</td><td>D*</td><td><strong>yes</strong> — load generation + timing adds its own load and overhead</td></tr>
<tr><td>11</td><td>Valgrind, VisualVM profiler</td><td>Performance &amp; dynamic analysis → dynamic analysis (memory leaks)</td><td>D</td><td><strong>yes</strong> — the program runs many times slower under Valgrind</td></tr>
<tr><td>12</td><td>OWASP ZAP; axe</td><td>Specialised needs → security; accessibility</td><td>no</td><td>ZAP sends real attacks, so run it only on a test environment</td></tr>
</tbody>
</table></div>
<p>*The syllabus marks performance testing tools (D) although in practice specialist performance testers use them at system level (slide 25). Answer as the syllabus does.</p>
<div class="pitfall co-tieu-de"><strong>Two exam traps.</strong>
<ol>
<li>"The probe effect is a type of tool" — no: it is the <em>consequence</em> of using an intrusive tool.</li>
<li>"Tools are classified by price in the syllabus" — no: several classifications are possible (slide 7), but the syllabus groups tools by the <em>test activity</em> they support.</li>
</ol>
<p>Also remember a single product can belong to several groups.</p></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Measuring without disturbing.</strong> Modern observability tries hard to shrink the probe effect:
<ul>
<li><strong>Sampling profilers</strong> (async-profiler, Java Flight Recorder) look at the stack a few hundred times per second instead of timing every call, adding around 1–2&nbsp;% overhead.</li>
<li><strong>Linux eBPF probes</strong> attach to the kernel without changing the application at all.</li>
<li><strong>Race conditions</strong> — instead of hoping the Heisenbug reappears, teams use deterministic tools such as <em>ThreadSanitizer</em> or Java's <em>jcstress</em>, which systematically explore thread interleavings.</li>
</ul>
<p class="ghi-chu">Outside the syllabus because CTFL only asks you to recognise the probe effect, not to engineer around it.</p></div>`,
      `<h3>Ví dụ có lời giải · Phân loại mười hai công cụ thật</h3>
<p>Với mỗi công cụ, hãy nêu nhóm theo ISTQB, có phải công cụ (D) không, và có xâm lấn không. Tự làm trước khi đọc cột đáp án.</p>
<div class="table-wrap"><table>
<thead><tr><th>#</th><th>Công cụ</th><th>Nhóm ISTQB → loại công cụ</th><th>(D)?</th><th>Xâm lấn?</th></tr></thead>
<tbody>
<tr><td>1</td><td>Jira + Xray / TestRail</td><td>Quản lý → quản lý test &amp; quản lý defect</td><td>không</td><td>không</td></tr>
<tr><td>2</td><td>Git</td><td>Quản lý → quản lý cấu hình</td><td>không</td><td>không</td></tr>
<tr><td>3</td><td>Jenkins, GitHub Actions</td><td>Quản lý → tích hợp liên tục (CI)</td><td>D</td><td>không</td></tr>
<tr><td>4</td><td>SonarQube, Checkstyle, PMD</td><td>Kiểm thử tĩnh → phân tích tĩnh</td><td>D</td><td>không — code không được chạy</td></tr>
<tr><td>5</td><td>Cucumber (Gherkin)</td><td>Thiết kế &amp; triển khai test → BDD</td><td>không</td><td>không</td></tr>
<tr><td>6</td><td>JUnit, TestNG</td><td>Thực thi &amp; log → unit test framework (kiêm công cụ TDD)</td><td>D</td><td>không</td></tr>
<tr><td>7</td><td>Mockito (stub/mock)</td><td>Thực thi &amp; log → hỗ trợ test harness</td><td>D</td><td>không</td></tr>
<tr><td>8</td><td>JaCoCo</td><td>Thực thi &amp; log → công cụ đo coverage</td><td>D</td><td><strong>có</strong> — chèn mã đo vào bytecode</td></tr>
<tr><td>9</td><td>Selenium WebDriver, Playwright</td><td>Thực thi &amp; log → công cụ thực thi test</td><td>không</td><td>nhẹ — điều khiển UI thật qua browser driver</td></tr>
<tr><td>10</td><td>JMeter, k6</td><td>Hiệu năng &amp; phân tích động → test hiệu năng/tải</td><td>D*</td><td><strong>có</strong> — việc sinh tải + bấm giờ tự nó thêm tải và độ trễ</td></tr>
<tr><td>11</td><td>Valgrind, VisualVM profiler</td><td>Hiệu năng &amp; phân tích động → phân tích động (rò rỉ bộ nhớ)</td><td>D</td><td><strong>có</strong> — chương trình chạy chậm đi nhiều lần dưới Valgrind</td></tr>
<tr><td>12</td><td>OWASP ZAP; axe</td><td>Nhu cầu đặc thù → bảo mật; accessibility</td><td>không</td><td>ZAP gửi tấn công thật, nên chỉ chạy trên môi trường test</td></tr>
</tbody>
</table></div>
<p>*Syllabus đánh dấu công cụ test hiệu năng là (D) dù thực tế chuyên gia hiệu năng mới là người dùng chúng ở cấp system (slide 25). Khi thi, trả lời theo syllabus.</p>
<div class="pitfall co-tieu-de"><strong>Hai bẫy trong đề.</strong>
<ol>
<li>"Probe effect là một loại công cụ" — sai: nó là <em>hậu quả</em> của việc dùng công cụ xâm lấn.</li>
<li>"Syllabus phân loại công cụ theo giá" — sai: có nhiều cách phân loại (slide 7), nhưng syllabus nhóm công cụ theo <em>hoạt động kiểm thử</em> mà chúng hỗ trợ.</li>
</ol>
<p>Nhớ thêm: một sản phẩm có thể thuộc nhiều nhóm.</p></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Đo mà không làm xáo trộn.</strong> Observability hiện đại cố thu nhỏ probe effect:
<ul>
<li><strong>Sampling profiler</strong> (async-profiler, Java Flight Recorder) chỉ nhìn ngăn xếp vài trăm lần mỗi giây thay vì bấm giờ từng lời gọi, tốn khoảng 1–2&nbsp;% hiệu năng.</li>
<li><strong>Probe eBPF của Linux</strong> gắn vào nhân hệ điều hành mà không sửa ứng dụng.</li>
<li><strong>Lỗi tranh chấp</strong> — thay vì cầu mong Heisenbug hiện lại, các đội dùng công cụ tất định như <em>ThreadSanitizer</em> hay <em>jcstress</em> của Java để duyệt có hệ thống các thứ tự xen kẽ luồng.</li>
</ul>
<p class="ghi-chu">Ngoài giáo trình vì CTFL chỉ yêu cầu nhận ra probe effect, không yêu cầu kỹ thuật né nó.</p></div>`),
    books([
      ['fst4', 'Ch.6 §1 "Test tool considerations" — opens with tool classification and the probe effect, from book p.203 (PDF 217)', 'Chương 6 §1 "Test tool considerations" — mở đầu bằng phân loại công cụ và probe effect, từ trang sách 203 (PDF 217)'],
      ['fst', '§6.1.1 "Test tool classification" (probe effect, Heisenbugs, tools marked (D)) — pp.169–171', '§6.1.1 "Test tool classification" (probe effect, Heisenbug, công cụ đánh dấu (D)) — trang 169–171'],
      ['sp5', 'Ch.7 "Test Tools", §7.1 Types of Test Tools — PDF p.303–304', 'Chương 7 "Test Tools", §7.1 Types of Test Tools — PDF 303–304'],
      ['sp4', 'Ch.7 §7.1 "Types of Test Tools" — p.205 (PDF 220)', 'Chương 7 §7.1 "Types of Test Tools" — trang 205 (PDF 220)'],
    ]),
  ].join('\n'),
};

/* ─────────────────── 8.2 Tool support for each test activity ─────────────────── */
const L82 = {
  title: '8.2 — Tool support for each test activity: management, static, design, execution, performance, specialised|||8.2 — Công cụ cho từng hoạt động: quản lý, tĩnh, thiết kế, thực thi, hiệu năng, đặc thù',
  slug: 'swt301-tools-by-activity',
  type: 'VIDEO',
  description: 'SWT6 slide 9–35: 6 nhóm công cụ theo syllabus 2018 — quản lý test/ALM, yêu cầu, defect, cấu hình, CI; review & phân tích tĩnh; thiết kế test, MBT, dữ liệu test, TDD, ATDD/BDD; thực thi, coverage, harness, unit framework; hiệu năng, monitoring, phân tích động; 7 nhu cầu đặc thù; "Where tools fit".',
  content: [
    bi(`<span class="eyebrow">Chapter 8 · Lesson 8.2 · SWT6 slides 9–35</span>
<h2>Tool support for each test activity</h2>
<p class="lead">Slides 9–34 walk through the six groups of the ISTQB classification one circle at a time: every slide shows the same group of circles and a dotted callout pointing at <em>one</em> of them. Slide 35 then places all the tools on the V-model. The exam question is almost always "<em>Which tool supports …?</em>" or "<em>Which tool is more likely used by developers?</em>" — so for every tool learn <strong>what it does</strong>, <strong>who uses it</strong> and <strong>which activity</strong> it belongs to.</p>
<div class="callout"><strong>Learning objective.</strong> LO-6.1.1 Classify test tools according to their purpose and the test activities they support (K2) — the only K2 objective of the chapter, so expect a scenario question.</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1 · Manage</div><div class="lz-t">test mgt/ALM · requirements · defects · config · CI (D)</div><div class="lz-d">slides 9–13</div></div>
  <div class="lz-step"><div class="lz-k">2 · Static</div><div class="lz-t">review tools · static analysis (D)</div><div class="lz-d">slides 14–15</div></div>
  <div class="lz-step"><div class="lz-k">3 · Design &amp; implement</div><div class="lz-t">test design · MBT · test data · TDD (D) · ATDD/BDD</div><div class="lz-d">slides 16–20</div></div>
  <div class="lz-step"><div class="lz-k">4 · Execute &amp; log</div><div class="lz-t">execution · coverage (D) · harness (D) · unit framework (D)</div><div class="lz-d">slides 21–24</div></div>
  <div class="lz-step"><div class="lz-k">5 · Performance &amp; dynamic</div><div class="lz-t">performance (D) · monitoring · dynamic analysis (D)</div><div class="lz-d">slides 25–27</div></div>
  <div class="lz-step"><div class="lz-k">6 · Specialised</div><div class="lz-t">data quality · migration · usability · accessibility · localisation · security · portability</div><div class="lz-d">slides 28–34</div></div>
</div>`,
      `<span class="eyebrow">Chương 8 · Bài 8.2 · SWT6 slide 9–35</span>
<h2>Công cụ cho từng hoạt động kiểm thử</h2>
<p class="lead">Slide 9–34 đi qua sáu nhóm của cách phân loại ISTQB, mỗi lần một vòng tròn: slide nào cũng vẽ cùng một cụm vòng tròn và một khung chấm chấm chỉ vào <em>một</em> vòng. Slide 35 đặt tất cả công cụ lên mô hình chữ V. Câu hỏi thi gần như luôn là "<em>Công cụ nào hỗ trợ …?</em>" hoặc "<em>Công cụ nào thường do developer dùng?</em>" — nên với mỗi công cụ hãy thuộc <strong>nó làm gì</strong>, <strong>ai dùng</strong> và <strong>thuộc hoạt động nào</strong>.</p>
<div class="callout"><strong>Chuẩn đầu ra.</strong> LO-6.1.1 Phân loại công cụ test theo mục đích và hoạt động test mà chúng hỗ trợ (K2) — chuẩn đầu ra K2 duy nhất của chương, nên hãy chờ một câu hỏi tình huống.</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1 · Quản lý</div><div class="lz-t">quản lý test/ALM · yêu cầu · defect · cấu hình · CI (D)</div><div class="lz-d">slide 9–13</div></div>
  <div class="lz-step"><div class="lz-k">2 · Tĩnh</div><div class="lz-t">công cụ review · phân tích tĩnh (D)</div><div class="lz-d">slide 14–15</div></div>
  <div class="lz-step"><div class="lz-k">3 · Thiết kế &amp; triển khai</div><div class="lz-t">thiết kế test · MBT · dữ liệu test · TDD (D) · ATDD/BDD</div><div class="lz-d">slide 16–20</div></div>
  <div class="lz-step"><div class="lz-k">4 · Thực thi &amp; log</div><div class="lz-t">thực thi · coverage (D) · harness (D) · unit framework (D)</div><div class="lz-d">slide 21–24</div></div>
  <div class="lz-step"><div class="lz-k">5 · Hiệu năng &amp; động</div><div class="lz-t">hiệu năng (D) · giám sát · phân tích động (D)</div><div class="lz-d">slide 25–27</div></div>
  <div class="lz-step"><div class="lz-k">6 · Đặc thù</div><div class="lz-t">chất lượng dữ liệu · di trú · usability · accessibility · bản địa hoá · bảo mật · portability</div><div class="lz-d">slide 28–34</div></div>
</div>`),
    walkHead(D, 9, 35),
    walk(D, [
      [9, 'Management of testing & testware — Test Mgt. & ALM tools',
        `<p class="y-chinh">🎯 Group 1 manages testing and testware; the callout points at <strong>test management &amp; ALM tools</strong>.</p>
<p class="nhan">The five circles of group 1</p>
<ul>
<li>Reqs. Mgt. tools</li>
<li>Defect Mgt. tools</li>
<li>Config. Mgt. tools</li>
<li>Test Mgt. &amp; "AML" tools</li>
<li>CI tools (D)</li>
</ul>
<p class="nhan">What the callout says</p>
<ul>
<li><strong>Test management tools</strong> — support the <em>test management and control</em> part of the test process: planning, scheduling, test case repository, execution logs, progress and coverage reports (TestRail, Xray, Zephyr, qTest).</li>
<li><strong>ALM tools</strong> (Application Lifecycle Management) — manage testing, development and deployment together, focusing on communication, collaboration and task tracking; popular in Agile (Jira, Azure DevOps).</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Typo on the slide:</strong> "AML" should read <strong>ALM</strong> — the teacher's note itself says "Agile ALM is the practice of using Agile processes to manage your requirements, issues, and tests".</div>`,
        `<p class="y-chinh">🎯 Nhóm 1 quản lý kiểm thử và testware; khung chú thích chỉ vào <strong>công cụ quản lý test &amp; ALM</strong>.</p>
<p class="nhan">Năm vòng tròn của nhóm 1</p>
<ul>
<li>Công cụ quản lý yêu cầu</li>
<li>Công cụ quản lý defect</li>
<li>Công cụ quản lý cấu hình</li>
<li>Công cụ quản lý test &amp; "AML"</li>
<li>Công cụ CI (D)</li>
</ul>
<p class="nhan">Khung chú thích nói gì</p>
<ul>
<li><strong>Công cụ quản lý test</strong> — hỗ trợ phần <em>quản lý và kiểm soát</em> của quy trình test: lập kế hoạch, lịch, kho test case, log thực thi, báo cáo tiến độ và độ phủ (TestRail, Xray, Zephyr, qTest).</li>
<li><strong>Công cụ ALM</strong> (Application Lifecycle Management — quản lý vòng đời ứng dụng) — quản lý cả kiểm thử, phát triển và triển khai, tập trung vào giao tiếp, cộng tác và theo dõi công việc; phổ biến trong Agile (Jira, Azure DevOps).</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Lỗi đánh máy trên slide:</strong> "AML" phải là <strong>ALM</strong> — chính ghi chú của thầy/cô viết "Agile ALM is the practice of using Agile processes to manage your requirements, issues, and tests".</div>`],
      [10, 'Management — Requirements management tools',
        `<p class="y-chinh">🎯 Requirements management tools store requirements and — the exam key word — give <strong>traceability between requirements and tests</strong>.</p>
<ul>
<li><strong>What they store</strong> — requirements (and user stories) with their attributes.</li>
<li><strong>Traceability</strong> — because "tests are created based on requirements", the tool can answer "which requirements have no test?".</li>
<li><strong>Impact analysis</strong> — "which tests must be re-run if requirement R12 changes?".</li>
<li><strong>Extra checks</strong> — some of them also check requirements for consistency or undefined terms.</li>
</ul>
<p>Examples: Jama, IBM DOORS, Jira with links.</p>`,
        `<p class="y-chinh">🎯 Công cụ quản lý yêu cầu lưu yêu cầu và — chữ khoá khi thi — cho <strong>truy vết (traceability) giữa yêu cầu và test</strong>.</p>
<ul>
<li><strong>Lưu gì</strong> — yêu cầu (và user story) cùng các thuộc tính.</li>
<li><strong>Truy vết</strong> — vì "test được tạo dựa trên yêu cầu", công cụ trả lời được "yêu cầu nào chưa có test?".</li>
<li><strong>Phân tích ảnh hưởng</strong> — "đổi yêu cầu R12 thì phải chạy lại test nào?".</li>
<li><strong>Kiểm thêm</strong> — một số còn kiểm yêu cầu có mâu thuẫn hay thuật ngữ chưa định nghĩa.</li>
</ul>
<p>Ví dụ: Jama, IBM DOORS, Jira có liên kết.</p>`],
      [11, 'Management — Defect management tools',
        `<p class="y-chinh">🎯 Defect management tools record <strong>failures</strong> seen in testing and carry each report through its <strong>life cycle</strong>.</p>
<ul>
<li><strong>Other names</strong> — <em>incident management</em> or <em>bug tracking</em> tools (Jira, Bugzilla, Mantis, Redmine).</li>
<li><strong>Failures, not defects</strong> — what gets recorded is what was observed, not yet a confirmed <em>defect</em>: an anomaly may turn out to be a test mistake, an environment problem or a duplicate.</li>
<li><strong>Report life cycle</strong> — New → Assigned → Fixed → Retested → Closed/Reopened, with workflow, severity/priority fields and statistics for reports.</li>
</ul>
<p class="ghi-chu">Link with Chapter 5: defect report content and life cycle, fst4 Fig. 5.3.</p>`,
        `<p class="y-chinh">🎯 Công cụ quản lý defect ghi lại các <strong>failure</strong> thấy khi test và đưa mỗi báo cáo đi hết <strong>vòng đời</strong> của nó.</p>
<ul>
<li><strong>Tên khác</strong> — công cụ <em>quản lý sự cố (incident)</em> hay <em>theo dõi bug</em> (Jira, Bugzilla, Mantis, Redmine).</li>
<li><strong>Failure, chưa phải defect</strong> — thứ được ghi là điều quan sát được, chưa phải <em>defect</em> đã xác nhận: một bất thường có thể hoá ra là do test sai, do môi trường, hoặc trùng lặp.</li>
<li><strong>Vòng đời báo cáo</strong> — New → Assigned → Fixed → Retested → Closed/Reopened, có luồng công việc, trường severity/priority và thống kê cho báo cáo.</li>
</ul>
<p class="ghi-chu">Nối với Chương 5: nội dung và vòng đời defect report, fst4 Hình 5.3.</p>`],
      [12, 'Management — Configuration management tools',
        `<p class="y-chinh">🎯 "Not exactly a testing tool, but…" — configuration management tools let you know <em>which version was tested with which tests</em>.</p>
<ul>
<li><strong>Why they matter</strong> — they greatly aid testing, especially in complex environments.</li>
<li><strong>What they version</strong> — the test object <em>and</em> the testware (test scripts, data, environment definitions).</li>
<li><strong>Without them</strong> — a defect report ("fails in build 1.4.2") cannot be reproduced.</li>
</ul>
<p>Examples: Git, SVN, plus artifact repositories (Nexus) and infrastructure-as-code (Docker, Terraform) for environments.</p>`,
        `<p class="y-chinh">🎯 "Không hẳn là công cụ test, nhưng…" — công cụ quản lý cấu hình cho bạn biết <em>phiên bản nào đã được test bằng những test nào</em>.</p>
<ul>
<li><strong>Vì sao quan trọng</strong> — giúp kiểm thử rất nhiều, nhất là trong môi trường phức tạp.</li>
<li><strong>Quản lý phiên bản của gì</strong> — đối tượng test <em>và</em> testware (script test, dữ liệu, định nghĩa môi trường).</li>
<li><strong>Nếu thiếu</strong> — một defect report ("lỗi ở build 1.4.2") không thể tái hiện.</li>
</ul>
<p>Ví dụ: Git, SVN, thêm kho artifact (Nexus) và hạ tầng dạng mã (Docker, Terraform) cho môi trường.</p>`],
      [13, 'Management — Continuous Integration tools (D)',
        `<p class="y-chinh">🎯 CI tools (D) integrate code many times a day and <strong>run the unit tests on every new build</strong>.</p>
<ul>
<li><strong>Developers</strong> — more likely to be used by developers (hence the D).</li>
<li><strong>Agile</strong> — an essential part of the Agile toolkit.</li>
<li><strong>Very frequent integration</strong> — new or changed code is merged into the existing code base many times a day.</li>
<li><strong>Automatic unit tests</strong> — unit tests are often run automatically when a new build is made; a red build stops the change.</li>
</ul>
<p>Examples: Jenkins, GitHub Actions, GitLab CI. Lesson 8.6 builds a real pipeline around the JUnit tests of lesson 8.5.</p>`,
        `<p class="y-chinh">🎯 Công cụ CI (D) tích hợp code nhiều lần mỗi ngày và <strong>chạy unit test với mỗi build mới</strong>.</p>
<ul>
<li><strong>Developer</strong> — thường do developer dùng (vì thế có chữ D).</li>
<li><strong>Agile</strong> — là phần thiết yếu của bộ công cụ Agile.</li>
<li><strong>Tích hợp rất thường xuyên</strong> — code mới/đã sửa được gộp vào code hiện có nhiều lần mỗi ngày.</li>
<li><strong>Unit test tự chạy</strong> — unit test thường tự động chạy mỗi khi có build mới; build đỏ thì thay đổi bị chặn.</li>
</ul>
<p>Ví dụ: Jenkins, GitHub Actions, GitLab CI. Bài 8.6 dựng một pipeline thật quanh các JUnit test của bài 8.5.</p>`],
      [14, 'Static testing — Review tools',
        `<p class="y-chinh">🎯 Group 2 is static testing; review tools pay off most when reviews are <strong>formal</strong>.</p>
<p class="nhan">The two circles of group 2</p>
<ul>
<li>Review tools</li>
<li>Static analysis tools (D)</li>
</ul>
<p class="nhan">What review tools do</p>
<ul>
<li><strong>Formal reviews</strong> — they are more beneficial when reviews are formal (inspections, Chapter 3).</li>
<li><strong>Documents and comments</strong> — they store the documents under review and collect comments and defects from each reviewer.</li>
<li><strong>Distributed teams</strong> — they support online meetings.</li>
<li><strong>Metrics</strong> — the slide's example: <em>monitor reviewers' checking rate</em>. The tool calculates pages (or lines) checked per hour and flags exceptions — a reviewer who "checked" 40 pages in 10 minutes did not really check.</li>
</ul>
<p>Examples today: GitHub/GitLab pull-request review, Gerrit, Crucible.</p>`,
        `<p class="y-chinh">🎯 Nhóm 2 là kiểm thử tĩnh; công cụ review có ích nhất khi review là <strong>chính thức</strong>.</p>
<p class="nhan">Hai vòng tròn của nhóm 2</p>
<ul>
<li>Công cụ review</li>
<li>Công cụ phân tích tĩnh (D)</li>
</ul>
<p class="nhan">Công cụ review làm gì</p>
<ul>
<li><strong>Review chính thức</strong> — có ích hơn khi review là chính thức (inspection, Chương 3).</li>
<li><strong>Tài liệu và nhận xét</strong> — lưu tài liệu đang review, gom nhận xét và defect của từng người review.</li>
<li><strong>Đội phân tán</strong> — hỗ trợ họp trực tuyến.</li>
<li><strong>Số liệu</strong> — ví dụ trên slide: <em>theo dõi tốc độ kiểm tra của người review</em>. Công cụ tính số trang (hoặc dòng) được kiểm mỗi giờ và gắn cờ ngoại lệ — người "kiểm" 40 trang trong 10 phút thì thực ra không kiểm.</li>
</ul>
<p>Ví dụ ngày nay: review pull request trên GitHub/GitLab, Gerrit, Crucible.</p>`],
      [15, 'Static testing — Static analysis tools (D)',
        `<p class="y-chinh">🎯 Static analysis tools (D) analyse code <em>without running it</em> — an extension of compiler technology.</p>
<ul>
<li><strong>Used by developers</strong> — while coding, in unit testing, to understand code structure, and to <strong>enforce coding standards</strong>.</li>
<li><strong>Compiler technology</strong> — they parse the code like a compiler but look for more: unreachable code, variables used before assignment, security holes, complexity metrics such as V(G).</li>
<li><strong>Not only source code</strong> — also usable on other work products, e.g. requirements (ambiguity checkers) or <strong>websites</strong> (broken-link checkers, HTML validators).</li>
</ul>
<p>Examples: SonarQube, Checkstyle, PMD, SpotBugs, ESLint. You used them in Lab 1 (lab1-static deck, Chapter 3).</p>`,
        `<p class="y-chinh">🎯 Công cụ phân tích tĩnh (D) phân tích code <em>mà không chạy nó</em> — phần mở rộng của công nghệ trình biên dịch.</p>
<ul>
<li><strong>Developer dùng</strong> — khi viết code, khi unit test, để hiểu cấu trúc code và để <strong>ép chuẩn viết code</strong>.</li>
<li><strong>Công nghệ compiler</strong> — phân tích code giống compiler nhưng tìm nhiều hơn: code không bao giờ chạy tới, biến dùng trước khi gán, lỗ hổng bảo mật, số đo độ phức tạp như V(G).</li>
<li><strong>Không chỉ mã nguồn</strong> — còn dùng được trên sản phẩm khác, vd yêu cầu (công cụ bắt câu mơ hồ) hay <strong>website</strong> (kiểm link hỏng, kiểm HTML hợp lệ).</li>
</ul>
<p>Ví dụ: SonarQube, Checkstyle, PMD, SpotBugs, ESLint. Bạn đã dùng chúng ở Lab 1 (bộ slide lab1-static, Chương 3).</p>`],
      [16, 'Test design & implementation — Test design tools',
        `<p class="y-chinh">🎯 Group 3 is test design &amp; implementation; test design tools help construct test cases, or at least test inputs.</p>
<p class="nhan">The five circles of group 3</p>
<ul>
<li>Model-based testing tools</li>
<li>Test data preparation tools</li>
<li>TDD tools (D)</li>
<li>Test design tools</li>
<li>ATDD &amp; BDD tools</li>
</ul>
<p class="nhan">Tests can be derived from</p>
<ul>
<li><strong>Formal requirements</strong></li>
<li><strong>Elements on a screen</strong> — fields, buttons → inputs to try</li>
<li><strong>A model of the system</strong></li>
</ul>
<p class="nhan">The challenges</p>
<ul>
<li><strong>Expected results</strong> are hard to generate — the tool knows the inputs, not the right answer (the oracle problem).</li>
<li><strong>Too many tests</strong> — tools tend to generate more than you can run, so you must select.</li>
</ul>
<p>Examples: pairwise generators (PICT), decision-table generators.</p>
<p class="ghi-chu">Slide typo: "Tests can be <em>derive</em>" → derived.</p>`,
        `<p class="y-chinh">🎯 Nhóm 3 là thiết kế &amp; triển khai test; công cụ thiết kế test giúp xây test case, hoặc ít nhất là input của test.</p>
<p class="nhan">Năm vòng tròn của nhóm 3</p>
<ul>
<li>Công cụ model-based testing</li>
<li>Công cụ chuẩn bị dữ liệu test</li>
<li>Công cụ TDD (D)</li>
<li>Công cụ thiết kế test</li>
<li>Công cụ ATDD &amp; BDD</li>
</ul>
<p class="nhan">Test có thể được suy ra từ</p>
<ul>
<li><strong>Yêu cầu hình thức</strong></li>
<li><strong>Các phần tử trên màn hình</strong> — ô nhập, nút bấm → input cần thử</li>
<li><strong>Mô hình của hệ thống</strong></li>
</ul>
<p class="nhan">Thách thức</p>
<ul>
<li><strong>Kết quả mong đợi</strong> khó sinh tự động — công cụ biết input chứ không biết đáp án đúng (bài toán oracle).</li>
<li><strong>Quá nhiều test</strong> — công cụ hay sinh nhiều hơn mức chạy nổi, nên phải chọn lọc.</li>
</ul>
<p>Ví dụ: công cụ sinh pairwise (PICT), sinh bảng quyết định.</p>
<p class="ghi-chu">Lỗi đánh máy trên slide: "Tests can be <em>derive</em>" → derived.</p>`],
      [17, 'Test design & implementation — Model-based testing tools',
        `<p class="y-chinh">🎯 MBT tools generate test inputs and test cases <strong>from models</strong> of the system.</p>
<ul>
<li><strong>Which models</strong> — e.g. the <strong>state transition</strong> diagrams you drew in Chapter 4, activity diagrams, BPMN.</li>
<li><strong>Change → new tests</strong> — because the tests are generated, a change in the system (the model) triggers automatic generation of new tests: update one transition and the tool regenerates the affected cases.</li>
</ul>
<p>Examples: GraphWalker, Conformiq. Slide 46 comes back to MBT as a special consideration.</p>`,
        `<p class="y-chinh">🎯 Công cụ MBT sinh input và test case <strong>từ mô hình</strong> của hệ thống.</p>
<ul>
<li><strong>Mô hình nào</strong> — vd sơ đồ <strong>chuyển trạng thái</strong> bạn đã vẽ ở Chương 4, activity diagram, BPMN.</li>
<li><strong>Đổi → test mới</strong> — vì test được sinh ra, thay đổi hệ thống (mô hình) sẽ kích hoạt việc tự động sinh test mới: sửa một chuyển trạng thái là công cụ sinh lại các ca bị ảnh hưởng.</li>
</ul>
<p>Ví dụ: GraphWalker, Conformiq. Slide 46 quay lại MBT như một lưu ý đặc biệt.</p>`],
      [18, 'Test design & implementation — Test data preparation tools',
        `<p class="y-chinh">🎯 Test data preparation tools create, select or manipulate test data — from scratch or from production data.</p>
<ul>
<li><strong>How</strong> — from scratch (generators such as Faker), or by extracting and transforming production data.</li>
<li><strong>Who</strong> — developers and testers (in system and/or acceptance testing).</li>
<li><strong>Performance &amp; reliability testing</strong> — especially useful there, because those tests need very large volumes of realistic data.</li>
<li><strong>Anonymising</strong> — masking production data so it conforms to data-protection rules such as GDPR or Vietnam's Decree 13/2023 on personal data protection.</li>
</ul>
<p class="ghi-chu">Slide typo: "can be used <em>be</em> developers" → by.</p>`,
        `<p class="y-chinh">🎯 Công cụ chuẩn bị dữ liệu test tạo, chọn hoặc biến đổi dữ liệu test — từ đầu hoặc từ dữ liệu thật.</p>
<ul>
<li><strong>Cách làm</strong> — từ đầu (bộ sinh như Faker), hoặc trích và biến đổi dữ liệu thật.</li>
<li><strong>Ai dùng</strong> — developer và tester (trong system và/hoặc acceptance testing).</li>
<li><strong>Test hiệu năng &amp; độ tin cậy</strong> — đặc biệt có ích ở đây, vì các test này cần khối lượng dữ liệu thật lớn và giống thật.</li>
<li><strong>Ẩn danh hoá</strong> — che dữ liệu thật cho đúng các quy định bảo vệ dữ liệu như GDPR hay Nghị định 13/2023 của Việt Nam về bảo vệ dữ liệu cá nhân.</li>
</ul>
<p class="ghi-chu">Lỗi đánh máy trên slide: "can be used <em>be</em> developers" → by.</p>`],
      [19, 'Test design & implementation — TDD tools (D)',
        `<p class="y-chinh">🎯 In TDD <strong>tests are written first</strong>; TDD tools (D) are the frameworks that write and run those tests.</p>
<ul>
<li><strong>The cycle</strong> — write a test, then just enough code to pass it (red → green → refactor).</li>
<li><strong>The tool</strong> — provides a framework to write and run tests, basically unit tests.</li>
<li><strong>Same tools as slide 24</strong> — JUnit, NUnit, pytest, Jest are TDD tools <em>and</em> unit test frameworks.</li>
</ul>
<p>Lesson 8.5 shows JUnit in action; Chapter 9 (Agile) returns to TDD, ATDD and BDD as practices.</p>`,
        `<p class="y-chinh">🎯 Trong TDD <strong>test được viết trước</strong>; công cụ TDD (D) là framework để viết và chạy các test đó.</p>
<ul>
<li><strong>Vòng lặp</strong> — viết test, rồi viết vừa đủ code để test pass (đỏ → xanh → refactor).</li>
<li><strong>Công cụ</strong> — cung cấp framework để viết và chạy test, về cơ bản là unit test.</li>
<li><strong>Trùng với slide 24</strong> — JUnit, NUnit, pytest, Jest vừa là công cụ TDD <em>vừa là</em> unit test framework.</li>
</ul>
<p>Bài 8.5 cho bạn thấy JUnit chạy thật; Chương 9 (Agile) quay lại TDD, ATDD và BDD như các thực hành.</p>`],
      [20, 'Test design & implementation — ATDD & BDD tools',
        `<p class="y-chinh">🎯 ATDD &amp; BDD tools let people write tests in a syntax that looks like natural language.</p>
<ul>
<li><strong>ATDD</strong> (Acceptance Test-Driven Development) — captures requirements by <strong>writing acceptance tests together with users</strong> before the feature is built (FitNesse, Robot Framework).</li>
<li><strong>BDD</strong> (Behaviour-Driven Development) — focuses on the <strong>behaviour and functionality</strong> of the system, often driven by the dev team, written as <em>Given / When / Then</em> scenarios (Cucumber, SpecFlow, Behave).</li>
<li><strong>Natural-language syntax</strong> — these tools have rules that look like natural language (Gherkin), so business people can read and even write the tests, while developers bind each step to code.</li>
</ul>`,
        `<p class="y-chinh">🎯 Công cụ ATDD &amp; BDD cho phép viết test bằng cú pháp trông như ngôn ngữ tự nhiên.</p>
<ul>
<li><strong>ATDD</strong> (phát triển hướng kiểm thử chấp nhận) — nắm bắt yêu cầu bằng cách <strong>viết acceptance test cùng với người dùng</strong> trước khi xây tính năng (FitNesse, Robot Framework).</li>
<li><strong>BDD</strong> (phát triển hướng hành vi) — tập trung vào <strong>hành vi và chức năng</strong> của hệ thống, thường do đội dev dẫn dắt, viết thành kịch bản <em>Given / When / Then</em> (Cucumber, SpecFlow, Behave).</li>
<li><strong>Cú pháp như ngôn ngữ tự nhiên</strong> — các công cụ này có luật trông như ngôn ngữ tự nhiên (Gherkin), nên người nghiệp vụ đọc được, thậm chí tự viết được test, còn developer gắn mỗi bước với code.</li>
</ul>`],
      [21, 'Execution & logging — Test execution tools',
        `<p class="y-chinh">🎯 Group 4 is execution &amp; logging; test execution tools run tests against the SUT as if a real user did.</p>
<p class="nhan">The four circles of group 4</p>
<ul>
<li>Coverage tools (D)</li>
<li>Test harnesses (D)</li>
<li>Test execution tools</li>
<li>Unit test framework tools (D)</li>
</ul>
<p class="nhan">Test execution tools</p>
<ul>
<li><strong>Interface to the SUT</strong> — through the GUI, an API or the command line.</li>
<li><strong>Like a real user</strong> — they run tests as if run by a real user: clicking, typing, reading the screen.</li>
<li><strong>Scripts</strong> — tests are scripts in a programmable language (Java, Python, JavaScript, or a tool-specific language).</li>
<li><strong>Test repository</strong> — data, test inputs and expected results are held there; the tool compares actual with expected and logs the outcome.</li>
<li><strong>Regression</strong> — most often used in automated regression testing.</li>
<li><strong>Capture/replay</strong> — recording a manual tester's actions — is <em>problematic</em> (slide 43 explains why).</li>
</ul>
<p>Examples: Selenium WebDriver, Playwright, Appium (mobile), Postman/REST Assured (API), UFT, Katalon.</p>`,
        `<p class="y-chinh">🎯 Nhóm 4 là thực thi &amp; ghi log; công cụ thực thi test chạy test trên SUT như thể người dùng thật chạy.</p>
<p class="nhan">Bốn vòng tròn của nhóm 4</p>
<ul>
<li>Công cụ coverage (D)</li>
<li>Test harness (D)</li>
<li>Công cụ thực thi test</li>
<li>Unit test framework (D)</li>
</ul>
<p class="nhan">Công cụ thực thi test</p>
<ul>
<li><strong>Giao diện tới SUT</strong> — qua GUI, API hoặc dòng lệnh.</li>
<li><strong>Như người dùng thật</strong> — chạy test như thể người dùng thật chạy: bấm, gõ, đọc màn hình.</li>
<li><strong>Script</strong> — test là script viết bằng ngôn ngữ lập trình (Java, Python, JavaScript, hoặc ngôn ngữ riêng của công cụ).</li>
<li><strong>Kho test (repository)</strong> — giữ dữ liệu, input và kết quả mong đợi; công cụ so thực tế với mong đợi và ghi log.</li>
<li><strong>Regression</strong> — dùng nhiều nhất cho regression test tự động.</li>
<li><strong>Capture/replay</strong> — ghi lại thao tác của tester thủ công — là cách <em>có vấn đề</em> (slide 43 giải thích vì sao).</li>
</ul>
<p>Ví dụ: Selenium WebDriver, Playwright, Appium (mobile), Postman/REST Assured (API), UFT, Katalon.</p>`],
      [22, 'Execution & logging — Coverage tools (D)',
        `<p class="y-chinh">🎯 Coverage tools (D) give an <strong>objective measure</strong> of which parts of the software structure the tests executed.</p>
<p class="nhan">How they work</p>
<ol>
<li><strong>Identify the elements that can be counted</strong> — statements, decisions/branches, methods, or requirements (for requirements coverage).</li>
<li><strong>Instrument</strong> the code.</li>
<li><strong>Run</strong> the tests.</li>
<li><strong>Report</strong> what has and has not been covered.</li>
</ol>
<p>This is how you get the statement and decision coverage numbers of Chapter 4 without counting by hand.</p>
<p>Examples: JaCoCo (Java — used by the course's build.xml, lesson 8.5), Istanbul/nyc (JavaScript), coverage.py.</p>
<p class="meo">🧠 <strong>Remember:</strong> from slide 8 — coverage tools are intrusive.</p>`,
        `<p class="y-chinh">🎯 Công cụ coverage (D) cho <strong>số đo khách quan</strong> về phần nào của cấu trúc phần mềm đã được test chạy qua.</p>
<p class="nhan">Cách chúng làm việc</p>
<ol>
<li><strong>Xác định các phần tử đếm được</strong> — câu lệnh, quyết định/nhánh, phương thức, hoặc yêu cầu (với requirements coverage).</li>
<li><strong>Chèn mã đo</strong> vào code.</li>
<li><strong>Chạy</strong> test.</li>
<li><strong>Báo cáo</strong> cái gì đã và chưa được phủ.</li>
</ol>
<p>Đây là cách có con số statement coverage và decision coverage của Chương 4 mà không phải đếm tay.</p>
<p>Ví dụ: JaCoCo (Java — chính là công cụ trong build.xml của môn, bài 8.5), Istanbul/nyc (JavaScript), coverage.py.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> nhớ slide 8 — công cụ coverage là công cụ xâm lấn.</p>`],
      [23, 'Execution & logging — Test harnesses (D)',
        `<p class="y-chinh">🎯 A test harness (D) is the test environment of <strong>drivers and stubs</strong> that lets the IUT be tested on as small a scale as possible.</p>
<ul>
<li><strong>IUT</strong> — implementation/item under test; "as small a scale as possible" = one component, isolated from the rest.</li>
<li><strong>Driver</strong> — calls the component (plays the role of the missing caller).</li>
<li><strong>Stub</strong> — replaces a component it calls (returns canned answers).</li>
<li><strong>Today</strong> — harnesses are mostly built with frameworks: JUnit acts as the driver, Mockito creates stubs and mocks.</li>
</ul>
<p class="ghi-chu">Link with Chapter 2 (component and integration testing) and Lab 2.</p>`,
        `<p class="y-chinh">🎯 Test harness (D) là môi trường test gồm <strong>driver và stub</strong>, để IUT được test ở quy mô nhỏ nhất có thể.</p>
<ul>
<li><strong>IUT</strong> — phần tử/bản cài đặt đang test; "quy mô nhỏ nhất có thể" = một component, tách khỏi phần còn lại.</li>
<li><strong>Driver</strong> — gọi component (đóng vai bên gọi còn thiếu).</li>
<li><strong>Stub</strong> — thay thế một component mà nó gọi (trả về câu trả lời dựng sẵn).</li>
<li><strong>Ngày nay</strong> — harness chủ yếu dựng bằng framework: JUnit đóng vai driver, Mockito tạo stub và mock.</li>
</ul>
<p class="ghi-chu">Nối với Chương 2 (component và integration testing) và Lab 2. Bản dịch "khai thác thử nghiệm" trong ghi chú là máy dịch chữ "harness" — thuật ngữ nên giữ nguyên là test harness.</p>`],
      [24, 'Execution & logging — Unit test framework tools (D)',
        `<p class="y-chinh">🎯 Unit test framework tools (D) support <strong>writing and running unit tests</strong>.</p>
<p class="nhan">What they provide</p>
<ul>
<li><strong>Annotations</strong> to mark tests</li>
<li><strong>Assertions</strong> to check results</li>
<li><strong>Fixtures</strong> for setup and teardown</li>
<li><strong>Runners and reports</strong></li>
</ul>
<p class="nhan">Where they are used</p>
<ul>
<li><strong>Agile</strong> — to automate tests in parallel with development (they are also the engine of TDD).</li>
<li><strong>Levels</strong> — they tend to be used in component and component-integration testing.</li>
</ul>
<p>Examples: JUnit (Java), NUnit/xUnit (.NET), pytest (Python), Jest/Vitest (JavaScript). You will run JUnit 4 and JUnit 5 for real in lesson 8.5.</p>`,
        `<p class="y-chinh">🎯 Unit test framework (D) hỗ trợ <strong>viết và chạy unit test</strong>.</p>
<p class="nhan">Chúng cung cấp gì</p>
<ul>
<li><strong>Annotation</strong> đánh dấu test</li>
<li><strong>Assertion</strong> kiểm kết quả</li>
<li><strong>Fixture</strong> để dựng và dọn</li>
<li><strong>Bộ chạy và báo cáo</strong></li>
</ul>
<p class="nhan">Dùng ở đâu</p>
<ul>
<li><strong>Agile</strong> — để tự động hoá test song song với việc phát triển (và là động cơ của TDD).</li>
<li><strong>Cấp test</strong> — thường dùng ở component testing và component integration testing.</li>
</ul>
<p>Ví dụ: JUnit (Java), NUnit/xUnit (.NET), pytest (Python), Jest/Vitest (JavaScript). Bạn sẽ chạy JUnit 4 và JUnit 5 thật ở bài 8.5.</p>`],
      [25, 'Performance & dynamic analysis — Performance testing tools (D)',
        `<p class="y-chinh">🎯 Group 5 is performance &amp; dynamic analysis; performance testing tools check whether the SUT stands up to a high volume of usage.</p>
<p class="nhan">The three circles of group 5</p>
<ul>
<li>Performance testing tools (D)</li>
<li>Monitoring tools</li>
<li>Dynamic analysis tools (D)</li>
</ul>
<p class="nhan">Performance testing tools</p>
<ul>
<li><strong>System level</strong> — they focus on testing at system level, to see whether the SUT will stand up to a high volume of usage.</li>
<li><strong>Load generation</strong> — they simulate many users and/or high volumes of input data.</li>
<li><strong>Reports</strong> — based on logs, and graphs of <strong>load against response time</strong>; the "knee" of the curve shows the capacity limit.</li>
</ul>
<p>Examples: JMeter, Gatling, k6, LoadRunner. Link with Chapter 2: load, stress and scalability testing are non-functional test types.</p>
<p class="ghi-chu">Slide typo: "<em>stimulates</em>" → simulates.</p>`,
        `<p class="y-chinh">🎯 Nhóm 5 là hiệu năng &amp; phân tích động; công cụ test hiệu năng kiểm xem SUT có chịu nổi lượng sử dụng lớn không.</p>
<p class="nhan">Ba vòng tròn của nhóm 5</p>
<ul>
<li>Công cụ test hiệu năng (D)</li>
<li>Công cụ giám sát</li>
<li>Công cụ phân tích động (D)</li>
</ul>
<p class="nhan">Công cụ test hiệu năng</p>
<ul>
<li><strong>Cấp hệ thống</strong> — tập trung test ở cấp hệ thống, để xem SUT có chịu nổi lượng sử dụng lớn không.</li>
<li><strong>Sinh tải</strong> — giả lập nhiều người dùng và/hoặc khối lượng dữ liệu vào lớn.</li>
<li><strong>Báo cáo</strong> — dựa trên log, và đồ thị <strong>tải theo thời gian phản hồi</strong>; chỗ "gãy" của đường cong cho biết giới hạn năng lực.</li>
</ul>
<p>Ví dụ: JMeter, Gatling, k6, LoadRunner. Nối với Chương 2: load, stress và scalability testing là các loại test phi chức năng.</p>
<p class="ghi-chu">Lỗi đánh máy: "<em>stimulates</em>" → simulates, nên bản dịch "kích thích" trong ghi chú thành ra sai nghĩa — phải là "giả lập".</p>`],
      [26, 'Performance & dynamic analysis — Monitoring tools',
        `<p class="y-chinh">🎯 Monitoring tools <strong>continuously keep track</strong> of the system in use, to give the earliest warnings.</p>
<ul>
<li><strong>Earliest warnings</strong> — CPU at 95&nbsp;%, disk almost full, error rate rising.</li>
<li><strong>Better service</strong> — acting on those warnings improves the service.</li>
<li><strong>What they watch</strong> — servers, networks, databases, security, performance, websites and internet usage.</li>
<li><strong>Not (D)</strong> — operations teams and testers use them, in test environments and in production.</li>
</ul>
<p>Examples: Prometheus + Grafana, Zabbix, Nagios, Datadog, uptime checkers.</p>`,
        `<p class="y-chinh">🎯 Công cụ giám sát <strong>liên tục theo dõi</strong> hệ thống đang dùng, để cảnh báo sớm nhất.</p>
<ul>
<li><strong>Cảnh báo sớm</strong> — CPU 95&nbsp;%, đĩa gần đầy, tỉ lệ lỗi tăng.</li>
<li><strong>Dịch vụ tốt hơn</strong> — xử lý theo các cảnh báo đó giúp cải thiện dịch vụ.</li>
<li><strong>Theo dõi gì</strong> — máy chủ, mạng, CSDL, bảo mật, hiệu năng, website và việc dùng internet.</li>
<li><strong>Không có (D)</strong> — đội vận hành và tester dùng chúng, cả ở môi trường test lẫn production.</li>
</ul>
<p>Ví dụ: Prometheus + Grafana, Zabbix, Nagios, Datadog, công cụ kiểm tra uptime.</p>`],
      [27, 'Performance & dynamic analysis — Dynamic analysis tools (D)',
        `<p class="y-chinh">🎯 Dynamic analysis tools (D) give <strong>run-time information</strong> about the software while it is running.</p>
<p class="nhan">Examples on the slide</p>
<ul>
<li><strong>Resources</strong> — tracking allocation, use and de-allocation, e.g. detecting <strong>memory leaks</strong>.</li>
<li><strong>Pointers</strong> — flagging <strong>unassigned pointers</strong> or <strong>pointer-arithmetic faults</strong>.</li>
</ul>
<p class="nhan">Why they are needed</p>
<p>Static analysis cannot see these defects, and functional tests rarely reveal them — a leak only shows up after hours of running.</p>
<p>Examples: Valgrind, AddressSanitizer (C/C++), Java profilers (VisualVM, JFR), browser DevTools memory tab.</p>
<p class="meo">🧠 <strong>Remember:</strong> <em>static</em> analysis = without running; <em>dynamic</em> analysis = while running.</p>`,
        `<p class="y-chinh">🎯 Công cụ phân tích động (D) cho <strong>thông tin lúc chạy</strong> về phần mềm khi nó đang chạy.</p>
<p class="nhan">Ví dụ trên slide</p>
<ul>
<li><strong>Tài nguyên</strong> — theo dõi cấp phát, sử dụng và giải phóng, vd phát hiện <strong>rò rỉ bộ nhớ</strong>.</li>
<li><strong>Con trỏ</strong> — gắn cờ <strong>con trỏ chưa gán</strong> hoặc <strong>lỗi số học con trỏ</strong>.</li>
</ul>
<p class="nhan">Vì sao cần</p>
<p>Phân tích tĩnh không thấy những defect này, và test chức năng hiếm khi làm lộ chúng — rò rỉ chỉ hiện ra sau hàng giờ chạy.</p>
<p>Ví dụ: Valgrind, AddressSanitizer (C/C++), profiler Java (VisualVM, JFR), tab Memory của DevTools trình duyệt.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> phân tích <em>tĩnh</em> = không chạy; phân tích <em>động</em> = trong lúc chạy.</p>`],
      [28, 'Specialised needs — Data quality assessment',
        `<p class="y-chinh">🎯 Group 6 covers specialised needs; data quality tools <strong>check data against validation rules</strong> and report what fails.</p>
<p class="nhan">The seven circles of group 6</p>
<ol class="hai-cot">
<li>Usability testing</li>
<li>Accessibility testing</li>
<li>Localisation testing</li>
<li>Security testing</li>
<li>Portability testing</li>
<li>Data conversion &amp; migration</li>
<li>Data quality assessment</li>
</ol>
<p class="nhan">Data quality assessment</p>
<ul>
<li><strong>The problem</strong> — in IT-centric organisations, very large volumes of complex, interrelated data must be managed.</li>
<li><strong>Validation rules</strong> — e.g. a field must be numeric or of a given length, a date must not be in the future, every order must reference an existing customer.</li>
<li><strong>Report</strong> — the data that fails a check gets reported.</li>
</ul>
<p>Examples: Great Expectations, dbt tests, SQL constraint scripts.</p>`,
        `<p class="y-chinh">🎯 Nhóm 6 là nhu cầu đặc thù; công cụ chất lượng dữ liệu <strong>kiểm dữ liệu theo luật cho trước</strong> và báo cáo phần không đạt.</p>
<p class="nhan">Bảy vòng tròn của nhóm 6</p>
<ol class="hai-cot">
<li>Test usability</li>
<li>Test accessibility</li>
<li>Test bản địa hoá</li>
<li>Test bảo mật</li>
<li>Test portability</li>
<li>Chuyển đổi &amp; di trú dữ liệu</li>
<li>Đánh giá chất lượng dữ liệu</li>
</ol>
<p class="nhan">Đánh giá chất lượng dữ liệu</p>
<ul>
<li><strong>Vấn đề</strong> — ở tổ chức lấy CNTT làm trung tâm, cần quản lý khối lượng rất lớn dữ liệu phức tạp và liên quan nhau.</li>
<li><strong>Luật kiểm tra</strong> — vd một trường phải là số hoặc đúng độ dài, ngày không được ở tương lai, mọi đơn hàng phải trỏ tới khách hàng có thật.</li>
<li><strong>Báo cáo</strong> — dữ liệu không qua được kiểm tra sẽ được báo cáo.</li>
</ul>
<p>Ví dụ: Great Expectations, dbt test, script ràng buộc SQL.</p>`],
      [29, 'Specialised needs — Data conversion & migration',
        `<p class="y-chinh">🎯 Data conversion &amp; migration tools check that data was converted and migrated <strong>according to the migration rules</strong>.</p>
<ul>
<li><strong>Conversion</strong> — they verify that data conversion was correct.</li>
<li><strong>Migration</strong> — they check that migration followed the rules, e.g. when a bank moves 20 million accounts from an old core system to a new one.</li>
<li><strong>Quality of the result</strong> — correctness, completeness and standard compliance of the processed data, <strong>regardless of the volume</strong>.</li>
<li><strong>How</strong> — count rows on both sides, compare checksums and balances, sample records field by field.</li>
</ul>
<p class="ghi-chu">Link with Chapter 2: migration testing is part of <em>maintenance testing</em>.</p>`,
        `<p class="y-chinh">🎯 Công cụ chuyển đổi &amp; di trú dữ liệu kiểm việc chuyển đổi và di trú dữ liệu <strong>đúng theo luật di trú</strong>.</p>
<ul>
<li><strong>Chuyển đổi</strong> — xác minh việc chuyển đổi dữ liệu là đúng.</li>
<li><strong>Di trú</strong> — kiểm việc di trú đã theo đúng luật, vd khi ngân hàng chuyển 20 triệu tài khoản từ core cũ sang core mới.</li>
<li><strong>Chất lượng kết quả</strong> — dữ liệu đã xử lý đúng, đủ và đạt chuẩn, <strong>bất kể khối lượng</strong>.</li>
<li><strong>Cách làm</strong> — đếm dòng hai bên, so checksum và số dư, lấy mẫu từng bản ghi theo từng trường.</li>
</ul>
<p class="ghi-chu">Nối với Chương 2: test di trú là một phần của <em>maintenance testing</em>.</p>`],
      [30, 'Specialised needs — Usability testing',
        `<p class="y-chinh">🎯 Usability testing tools help <strong>assess the user experience (UX)</strong> of using the system.</p>
<p class="nhan">Three ways on the slide</p>
<ul>
<li><strong>After-use surveys</strong> — e.g. SUS questionnaires.</li>
<li><strong>Checking broken links</strong></li>
<li><strong>Monitoring usage</strong> — most-clicked links (heat maps), video recorders, key presses, screen capture, eye-movement tracking.</li>
</ul>
<p>Examples: Hotjar, Microsoft Clarity, Maze, Lookback. The tools only collect evidence; judging whether the experience is good still needs people.</p>`,
        `<p class="y-chinh">🎯 Công cụ test usability giúp <strong>đánh giá trải nghiệm người dùng (UX)</strong> khi dùng hệ thống.</p>
<p class="nhan">Ba cách trên slide</p>
<ul>
<li><strong>Khảo sát sau khi dùng</strong> — vd bảng hỏi SUS.</li>
<li><strong>Kiểm tra link hỏng</strong></li>
<li><strong>Theo dõi việc sử dụng</strong> — các link được bấm nhiều nhất (heat map), ghi video, thao tác phím, chụp màn hình, theo dõi chuyển động mắt.</li>
</ul>
<p>Ví dụ: Hotjar, Microsoft Clarity, Maze, Lookback. Công cụ chỉ thu thập bằng chứng; đánh giá trải nghiệm tốt hay không vẫn cần con người.</p>`],
      [31, 'Specialised needs — Accessibility testing',
        `<p class="y-chinh">🎯 Accessibility testing makes sure software <strong>is accessible to people with disabilities</strong>.</p>
<p class="nhan">What to check (tools help)</p>
<ul>
<li><strong>Screen reader</strong> — works with NVDA, VoiceOver.</li>
<li><strong>Colour-blind users</strong> — designed with them in mind: enough contrast, never colour alone.</li>
<li><strong>Increasable text</strong> — zoom to 200&nbsp;% without breaking the layout.</li>
<li><strong>Alternative text</strong> — for images.</li>
</ul>
<p>The standard is WCAG 2.1/2.2. Tools: axe, Lighthouse, WAVE — they catch roughly a third of issues automatically; the rest needs manual checks.</p>`,
        `<p class="y-chinh">🎯 Test accessibility đảm bảo phần mềm <strong>dùng được với người khuyết tật</strong>.</p>
<p class="nhan">Cần kiểm gì (công cụ hỗ trợ)</p>
<ul>
<li><strong>Trình đọc màn hình</strong> — chạy được với NVDA, VoiceOver.</li>
<li><strong>Người mù màu</strong> — thiết kế có tính tới họ: đủ độ tương phản, không bao giờ chỉ dựa vào màu.</li>
<li><strong>Chữ phóng to được</strong> — zoom 200&nbsp;% không vỡ bố cục.</li>
<li><strong>Văn bản thay thế (alt text)</strong> — cho ảnh.</li>
</ul>
<p>Chuẩn là WCAG 2.1/2.2. Công cụ: axe, Lighthouse, WAVE — bắt tự động được khoảng một phần ba vấn đề; phần còn lại phải kiểm tay.</p>`],
      [32, 'Specialised needs — Localisation testing',
        `<p class="y-chinh">🎯 Localisation testing checks that the software's language and culture are acceptable for one <strong>location</strong> — and it needs human intelligence.</p>
<p class="nhan">What is checked</p>
<ul>
<li><strong>Language</strong> — translation, menu items, buttons, error messages.</li>
<li><strong>Date formats</strong> — 11/09 is 11 September in Vietnam, November 9 in the US.</li>
<li><strong>Currency</strong> — 1.000.000 ₫ vs $1,000,000.00.</li>
<li><strong>Text expansion</strong> — German is ~30&nbsp;% longer than English.</li>
<li><strong>Right-to-left languages</strong></li>
</ul>
<p class="nhan">Tools vs people</p>
<p>Tools help find untranslated strings and truncated labels. But it is <strong>an area where human intelligence is needed</strong> — only a native speaker notices that a translation is correct but rude.</p>`,
        `<p class="y-chinh">🎯 Test bản địa hoá kiểm ngôn ngữ và văn hoá của phần mềm có chấp nhận được ở một <strong>địa phương</strong> không — và cần trí tuệ con người.</p>
<p class="nhan">Kiểm những gì</p>
<ul>
<li><strong>Ngôn ngữ</strong> — bản dịch, mục menu, nút, thông báo lỗi.</li>
<li><strong>Định dạng ngày</strong> — 11/09 là 11 tháng 9 ở Việt Nam, 9 tháng 11 ở Mỹ.</li>
<li><strong>Tiền tệ</strong> — 1.000.000 ₫ vs $1,000,000.00.</li>
<li><strong>Độ nở chữ</strong> — tiếng Đức dài hơn tiếng Anh ~30&nbsp;%.</li>
<li><strong>Ngôn ngữ viết phải-sang-trái</strong></li>
</ul>
<p class="nhan">Công cụ và con người</p>
<p>Công cụ giúp tìm chuỗi chưa dịch và nhãn bị cắt. Nhưng đây là <strong>vùng cần trí tuệ con người</strong> — chỉ người bản xứ mới nhận ra một câu dịch đúng mà bất lịch sự.</p>`],
      [33, 'Specialised needs — Security testing',
        `<p class="y-chinh">🎯 Security testing tools test security by <strong>attempting to break into the system</strong>.</p>
<p class="nhan">They help to</p>
<ul>
<li><strong>Identify viruses</strong></li>
<li><strong>Detect intrusions</strong></li>
<li><strong>Simulate external attacks</strong></li>
<li><strong>Probe open ports</strong></li>
<li><strong>Identify weaknesses in passwords</strong> and password files</li>
<li><strong>Perform security checks during operation</strong> — continuous scanning</li>
</ul>
<p class="nhan">Examples</p>
<ul>
<li><strong>OWASP ZAP, Burp Suite</strong> — web attacks such as SQL injection, XSS.</li>
<li><strong>Nmap</strong> — ports.</li>
<li><strong>John the Ripper, Hashcat</strong> — password strength.</li>
<li><strong>Dependency scanners</strong> — Snyk, OWASP Dependency-Check.</li>
</ul>
<div class="pitfall">Only ever run attack tools against systems you are authorised to test.</div>`,
        `<p class="y-chinh">🎯 Công cụ test bảo mật kiểm tra bảo mật bằng cách <strong>cố đột nhập vào hệ thống</strong>.</p>
<p class="nhan">Chúng giúp</p>
<ul>
<li><strong>Nhận diện virus</strong></li>
<li><strong>Phát hiện xâm nhập</strong></li>
<li><strong>Giả lập tấn công từ bên ngoài</strong></li>
<li><strong>Dò cổng mở</strong></li>
<li><strong>Tìm điểm yếu của mật khẩu</strong> và file mật khẩu</li>
<li><strong>Kiểm tra an ninh trong lúc vận hành</strong> — quét liên tục</li>
</ul>
<p class="nhan">Ví dụ</p>
<ul>
<li><strong>OWASP ZAP, Burp Suite</strong> — tấn công web như SQL injection, XSS.</li>
<li><strong>Nmap</strong> — cổng.</li>
<li><strong>John the Ripper, Hashcat</strong> — độ mạnh mật khẩu.</li>
<li><strong>Công cụ quét thư viện phụ thuộc</strong> — Snyk, OWASP Dependency-Check.</li>
</ul>
<div class="pitfall">Chỉ chạy công cụ tấn công trên hệ thống bạn được phép test.</div>`],
      [34, 'Specialised needs — Portability testing',
        `<p class="y-chinh">🎯 Portability testing tools <strong>run the same tests</strong> on different platforms, environments and devices.</p>
<ul>
<li><strong>Platforms and environments</strong> — operating systems, browsers, screen sizes, devices.</li>
<li><strong>Same tests</strong> — the value is here: one automated suite, executed on a matrix of Chrome/Firefox/Safari × Windows/macOS/Android/iOS.</li>
</ul>
<p>Examples: BrowserStack, Sauce Labs, Selenium Grid (cross-browser), Firebase Test Lab and device farms (mobile).</p>`,
        `<p class="y-chinh">🎯 Công cụ test portability (tính khả chuyển) <strong>chạy cùng một bộ test</strong> trên nhiều nền tảng, môi trường và thiết bị.</p>
<ul>
<li><strong>Nền tảng và môi trường</strong> — hệ điều hành, trình duyệt, kích thước màn hình, thiết bị.</li>
<li><strong>Cùng một bộ test</strong> — giá trị nằm ở đây: một bộ test tự động, chạy trên ma trận Chrome/Firefox/Safari × Windows/macOS/Android/iOS.</li>
</ul>
<p>Ví dụ: BrowserStack, Sauce Labs, Selenium Grid (đa trình duyệt), Firebase Test Lab và các "trang trại thiết bị" (mobile).</p>`],
      [35, 'Where tools fit — tools on the V-model',
        `<p class="y-chinh">🎯 A summary picture: the <strong>V-model</strong> with each tool type placed where it is used.</p>
<p class="nhan">Left arm — specification side (orange area)</p>
<ul>
<li><strong>Stages</strong> — <em>Req Anal → Function → Design → Code</em>.</li>
<li><strong>Near the top</strong> — requirements testing tools.</li>
<li><strong>Along the arm</strong> — test design and test data preparation.</li>
<li><strong>At the bottom, next to Code</strong> — static analysis (blue box).</li>
</ul>
<p class="nhan">Right arm — execution side</p>
<ul>
<li><strong>Stages</strong> — <em>Comp. Test → Int Test → Sys Test → Acc Test</em>.</li>
<li><strong>Low on the right</strong> — debug, test harness &amp; drivers, coverage measures and dynamic analysis: developer tools, near component and integration test.</li>
<li><strong>In the middle</strong> — test running and comparison (execution tools, used at every level).</li>
<li><strong>Top right</strong>, around system and acceptance test — performance measurement.</li>
</ul>
<p class="nhan">The frame around everything</p>
<ul>
<li><strong>Test management tools</strong> — they span the whole lifecycle.</li>
</ul>
<p class="ghi-chu">The picture is from the older syllabus: it has no CI, BDD or monitoring tools, and "debug" is a development activity supported by debuggers, not a test tool. The logic still holds: developer tools sit low on the V, business-facing tools high.</p>`,
        `<p class="y-chinh">🎯 Hình tổng kết: <strong>mô hình chữ V</strong> với mỗi loại công cụ đặt đúng chỗ nó được dùng.</p>
<p class="nhan">Nhánh trái — phía đặc tả (vùng cam)</p>
<ul>
<li><strong>Các bước</strong> — <em>Req Anal → Function → Design → Code</em>.</li>
<li><strong>Gần đỉnh</strong> — công cụ requirements testing.</li>
<li><strong>Dọc theo nhánh</strong> — thiết kế test và chuẩn bị dữ liệu test.</li>
<li><strong>Ở đáy, cạnh Code</strong> — phân tích tĩnh (ô xanh).</li>
</ul>
<p class="nhan">Nhánh phải — phía thực thi</p>
<ul>
<li><strong>Các bước</strong> — <em>Comp. Test → Int Test → Sys Test → Acc Test</em>.</li>
<li><strong>Thấp bên phải</strong> — debug, test harness &amp; driver, đo coverage và phân tích động: công cụ của developer, gần component và integration test.</li>
<li><strong>Ở giữa</strong> — chạy test và so sánh kết quả (công cụ thực thi, dùng ở mọi cấp).</li>
<li><strong>Góc trên phải</strong>, quanh system và acceptance test — đo hiệu năng.</li>
</ul>
<p class="nhan">Khung bao ngoài tất cả</p>
<ul>
<li><strong>Công cụ quản lý test</strong> — trải suốt vòng đời.</li>
</ul>
<p class="ghi-chu">Hình này lấy từ syllabus cũ: chưa có CI, BDD hay công cụ giám sát, và "debug" là hoạt động phát triển được debugger hỗ trợ chứ không phải công cụ test. Logic vẫn đúng: công cụ của developer nằm thấp trên chữ V, công cụ hướng nghiệp vụ nằm cao.</p>`],
    ]),
    bi(`<h3>Ví dụ có lời giải · Worked example — a tool chain for an online shop</h3>
<p><strong>Situation.</strong> A team of 6 developers and 2 testers builds a Java/Spring online shop with a React front end, two-week sprints, and a legal requirement to protect customer data. For each need, pick the tool <em>type</em> (that is what the exam asks) and an example product.</p>
<div class="table-wrap"><table>
<thead><tr><th>Need</th><th>ISTQB tool type (group)</th><th>Example</th></tr></thead>
<tbody>
<tr><td>Know which user stories have no test yet</td><td>Requirements management / traceability (1)</td><td>Jira + Xray</td></tr>
<tr><td>Track bugs from New to Closed</td><td>Defect management (1)</td><td>Jira</td></tr>
<tr><td>Know exactly which build a test ran against</td><td>Configuration management (1)</td><td>Git tags + Nexus</td></tr>
<tr><td>Build and run unit tests on every push</td><td>Continuous integration (1, D)</td><td>GitHub Actions</td></tr>
<tr><td>Enforce coding rules, find null-pointer risks before running</td><td>Static analysis (2, D)</td><td>SonarQube</td></tr>
<tr><td>Review pull requests</td><td>Review tool (2)</td><td>GitHub PR review</td></tr>
<tr><td>Write acceptance criteria as Given/When/Then with the PO</td><td>ATDD/BDD (3)</td><td>Cucumber</td></tr>
<tr><td>Copy production orders to test, with names and phones masked</td><td>Test data preparation (3)</td><td>masking scripts, Faker</td></tr>
<tr><td>Unit tests + TDD</td><td>Unit test framework / TDD (3–4, D)</td><td>JUnit 5</td></tr>
<tr><td>Replace the payment gateway during component tests</td><td>Test harness — stubs/mocks (4, D)</td><td>Mockito, WireMock</td></tr>
<tr><td>How much of the code do our tests execute?</td><td>Coverage (4, D)</td><td>JaCoCo</td></tr>
<tr><td>Regression of the checkout UI every night</td><td>Test execution (4)</td><td>Selenium WebDriver</td></tr>
<tr><td>Will checkout survive the 11.11 sale with 5,000 users?</td><td>Performance/load testing (5)</td><td>JMeter or k6</td></tr>
<tr><td>Alert when the error rate rises in production</td><td>Monitoring (5)</td><td>Prometheus + Grafana</td></tr>
<tr><td>Find memory leaks in the image-resizing service</td><td>Dynamic analysis (5, D)</td><td>VisualVM, JFR</td></tr>
<tr><td>SQL injection and XSS in the search box</td><td>Security testing (6)</td><td>OWASP ZAP</td></tr>
<tr><td>Screen-reader and contrast problems</td><td>Accessibility (6)</td><td>axe, Lighthouse</td></tr>
<tr><td>Same UI tests on Chrome, Safari, iPhone</td><td>Portability (6)</td><td>BrowserStack</td></tr>
</tbody>
</table></div>
<p>Result: 18 needs → all six groups used. Notice that one product (Jira) appears in two rows — a tool suite, as slide 7 warned.</p>
<div class="pitfall co-tieu-de"><strong>Pairs that get confused.</strong>
<ul>
<li><em>Performance testing tools</em> generate load in a test (5) ≠ <em>monitoring tools</em> watch the system continuously, also in production (5).</li>
<li><em>Coverage tools</em> measure what tests executed ≠ <em>test execution tools</em> run the tests.</li>
<li><em>Test harness</em> = the environment of drivers and stubs ≠ <em>unit test framework</em> = the tool to write and run unit tests (JUnit is often both).</li>
<li><em>Static</em> analysis = code not executed ≠ <em>dynamic</em> analysis = while running.</li>
<li>"(D)" means <em>likely used by developers</em>, not "dynamic".</li>
</ul></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>AI-assisted test tools.</strong>
<ul>
<li><strong>Self-healing locators</strong> (since about 2020) — when a button's id changes, the tool finds it by other attributes and repairs the script.</li>
<li><strong>Large language models</strong> (since 2023) — draft unit tests, Gherkin scenarios or test data from a requirement.</li>
<li><strong>What they attack</strong> — exactly the two weak points of slides 16 and 21: maintenance of scripts and the cost of test design.</li>
<li><strong>What they do not solve</strong> — the oracle problem: an AI-generated assertion can faithfully encode a bug, so generated tests must be reviewed like any other code.</li>
</ul>
<em>Outside the syllabus because the CTFL 2018 tool classification predates these tools; the 2023 CTFL v4.0 mentions them only briefly.</em></div>`,
      `<h3>Ví dụ có lời giải · Bộ công cụ cho một shop online</h3>
<p><strong>Tình huống.</strong> Một đội 6 developer và 2 tester xây shop online Java/Spring với front end React, sprint hai tuần, và luật bắt buộc bảo vệ dữ liệu khách hàng. Với mỗi nhu cầu, chọn <em>loại</em> công cụ (đề thi hỏi cái này) và một sản phẩm ví dụ.</p>
<div class="table-wrap"><table>
<thead><tr><th>Nhu cầu</th><th>Loại công cụ ISTQB (nhóm)</th><th>Ví dụ</th></tr></thead>
<tbody>
<tr><td>Biết user story nào chưa có test</td><td>Quản lý yêu cầu / truy vết (1)</td><td>Jira + Xray</td></tr>
<tr><td>Theo dõi bug từ New tới Closed</td><td>Quản lý defect (1)</td><td>Jira</td></tr>
<tr><td>Biết chính xác test đã chạy trên build nào</td><td>Quản lý cấu hình (1)</td><td>Git tag + Nexus</td></tr>
<tr><td>Build và chạy unit test mỗi lần push</td><td>Tích hợp liên tục (1, D)</td><td>GitHub Actions</td></tr>
<tr><td>Ép luật viết code, tìm nguy cơ null pointer trước khi chạy</td><td>Phân tích tĩnh (2, D)</td><td>SonarQube</td></tr>
<tr><td>Review pull request</td><td>Công cụ review (2)</td><td>Review PR trên GitHub</td></tr>
<tr><td>Cùng PO viết tiêu chí chấp nhận dạng Given/When/Then</td><td>ATDD/BDD (3)</td><td>Cucumber</td></tr>
<tr><td>Chép đơn hàng thật sang môi trường test, che tên và số điện thoại</td><td>Chuẩn bị dữ liệu test (3)</td><td>script che dữ liệu, Faker</td></tr>
<tr><td>Unit test + TDD</td><td>Unit test framework / TDD (3–4, D)</td><td>JUnit 5</td></tr>
<tr><td>Thay cổng thanh toán khi test component</td><td>Test harness — stub/mock (4, D)</td><td>Mockito, WireMock</td></tr>
<tr><td>Test của mình chạy qua bao nhiêu phần code?</td><td>Coverage (4, D)</td><td>JaCoCo</td></tr>
<tr><td>Regression giao diện checkout mỗi đêm</td><td>Thực thi test (4)</td><td>Selenium WebDriver</td></tr>
<tr><td>Checkout có chịu nổi đợt sale 11.11 với 5.000 người không?</td><td>Test hiệu năng/tải (5)</td><td>JMeter hoặc k6</td></tr>
<tr><td>Cảnh báo khi tỉ lệ lỗi tăng trên production</td><td>Giám sát (5)</td><td>Prometheus + Grafana</td></tr>
<tr><td>Tìm rò rỉ bộ nhớ ở service co giãn ảnh</td><td>Phân tích động (5, D)</td><td>VisualVM, JFR</td></tr>
<tr><td>SQL injection và XSS ở ô tìm kiếm</td><td>Test bảo mật (6)</td><td>OWASP ZAP</td></tr>
<tr><td>Lỗi trình đọc màn hình và độ tương phản</td><td>Accessibility (6)</td><td>axe, Lighthouse</td></tr>
<tr><td>Cùng bộ test UI trên Chrome, Safari, iPhone</td><td>Portability (6)</td><td>BrowserStack</td></tr>
</tbody>
</table></div>
<p>Kết quả: 18 nhu cầu → dùng đủ cả sáu nhóm. Để ý một sản phẩm (Jira) xuất hiện ở hai dòng — một bộ công cụ, đúng như slide 7 cảnh báo.</p>
<div class="pitfall co-tieu-de"><strong>Những cặp hay nhầm.</strong>
<ul>
<li><em>Công cụ test hiệu năng</em> sinh tải trong một đợt test (5) ≠ <em>công cụ giám sát</em> theo dõi hệ thống liên tục, cả trên production (5).</li>
<li><em>Công cụ coverage</em> đo cái test đã chạy qua ≠ <em>công cụ thực thi test</em> chạy test.</li>
<li><em>Test harness</em> = môi trường gồm driver và stub ≠ <em>unit test framework</em> = công cụ viết và chạy unit test (JUnit thường kiêm cả hai).</li>
<li>Phân tích <em>tĩnh</em> = không chạy code ≠ phân tích <em>động</em> = trong lúc chạy.</li>
<li>"(D)" nghĩa là <em>thường do developer dùng</em>, không phải "dynamic".</li>
</ul></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Công cụ test có AI hỗ trợ.</strong>
<ul>
<li><strong>Locator "tự lành"</strong> (từ khoảng 2020) — khi id của nút đổi, công cụ tìm nó bằng thuộc tính khác và tự sửa script.</li>
<li><strong>Mô hình ngôn ngữ lớn</strong> (từ 2023) — soạn nháp unit test, kịch bản Gherkin hay dữ liệu test từ một yêu cầu.</li>
<li><strong>Nhắm vào đâu</strong> — đúng hai điểm yếu của slide 16 và 21: bảo trì script và chi phí thiết kế test.</li>
<li><strong>Không giải được gì</strong> — bài toán oracle: một assertion do AI sinh có thể "trung thành" mã hoá luôn cả bug, nên test sinh ra phải được review như mọi code khác.</li>
</ul>
<em>Ngoài giáo trình vì cách phân loại công cụ của CTFL 2018 có trước các công cụ này; CTFL v4.0 (2023) chỉ nhắc qua.</em></div>`),
    books([
      ['fst4', 'Ch.6 §1 "Test tool considerations" — the six tool groups, within book pp.203–221 (PDF 217–235)', 'Chương 6 §1 "Test tool considerations" — sáu nhóm công cụ, nằm trong trang sách 203–221 (PDF 217–235)'],
      ['fst', '§6.1.2 management p.171 · §6.1.3 static testing p.174 · §6.1.4 test specification p.176 · §6.1.5 execution &amp; logging p.177 · §6.1.6 performance &amp; monitoring p.182 · §6.1.7–6.1.8 specific areas &amp; other tools p.184', '§6.1.2 quản lý trang 171 · §6.1.3 kiểm thử tĩnh trang 174 · §6.1.4 đặc tả test trang 176 · §6.1.5 thực thi &amp; log trang 177 · §6.1.6 hiệu năng &amp; giám sát trang 182 · §6.1.7–6.1.8 lĩnh vực đặc thù &amp; công cụ khác trang 184'],
      ['sp5', '§7.1.1 test management tools PDF 304 · §7.1.2 test specification PDF 308 · §7.1.3 static test tools PDF 310 · §7.1.4 automating dynamic tests PDF 314 · §7.1.5 load &amp; performance PDF 320 · §7.1.6 other kinds of tests PDF 321', '§7.1.1 công cụ quản lý test PDF 304 · §7.1.2 đặc tả test PDF 308 · §7.1.3 công cụ test tĩnh PDF 310 · §7.1.4 tự động hoá test động PDF 314 · §7.1.5 tải &amp; hiệu năng PDF 320 · §7.1.6 các loại test khác PDF 321'],
      ['sp4', '§7.1 "Types of Test Tools" (management, specification, static, dynamic, non-functional) — pp.205–217 (PDF 220–232)', '§7.1 "Types of Test Tools" (quản lý, đặc tả, tĩnh, động, phi chức năng) — trang 205–217 (PDF 220–232)'],
    ]),
  ].join('\n'),
};

/* ──────────── 8.3 Benefits, risks & special considerations ──────────── */
const L83 = {
  title: '8.3 — Benefits & risks of test automation; capture/replay, data-driven, keyword-driven, model-based|||8.3 — Lợi ích & rủi ro của tự động hoá; capture/replay, data-driven, keyword-driven, model-based',
  slug: 'swt301-tools-benefits-risks',
  type: 'VIDEO',
  description: 'SWT6 slide 36–47: lợi ích và rủi ro khi dùng công cụ (đủ danh sách syllabus 2018), lưu ý đặc biệt cho công cụ thực thi (capture/replay, data-driven, keyword-driven, MBT) và công cụ quản lý test — kèm ví dụ data-driven vs keyword-driven chạy thật bằng Java.',
  content: [
    bi(`<span class="eyebrow">Chapter 8 · Lesson 8.3 · SWT6 slides 36–47</span>
<h2>Benefits and risks of test automation — and the special cases</h2>
<p class="lead">Buying a tool is easy; getting value from it is not.</p>
<p class="nhan"><strong>This lesson covers</strong></p>
<ul>
<li><strong>Benefits</strong> — what a tool can realistically give you.</li>
<li><strong>Risks</strong> — what usually goes wrong.</li>
<li><strong>Special considerations</strong> for the two tool types that cost the most effort: <strong>test execution tools</strong> (four scripting approaches: capture/replay, data-driven, keyword-driven, model-based) and <strong>test management tools</strong>.</li>
<li><strong>Worked example</strong> — the same login feature run as a data-driven and as a keyword-driven test, for real.</li>
</ul>
<div class="callout"><strong>Learning objectives.</strong><ul><li>LO-6.1.2 Identify benefits and risks of test automation (K1).</li><li>LO-6.1.3 Remember special considerations for test execution and test management tools (K1).</li></ul></div>
<table>
<thead><tr><th>Approach</th><th>Who writes what</th><th>Strength</th><th>Weakness</th></tr></thead>
<tbody>
<tr><td>Capture/replay</td><td>Tool records a manual tester's actions into a linear script</td><td>Quick to start; audit trail of exploratory sessions</td><td>Brittle, no expected results, does not scale</td></tr>
<tr><td>Data-driven</td><td>Automation engineer writes one generic script; testers add <em>data rows</em> (inputs + expected results)</td><td>Many cases of the <em>same</em> test cheaply</td><td>Only varies data, not the steps</td></tr>
<tr><td>Keyword-driven</td><td>Engineers implement <em>keywords</em> (action words); testers write <em>tests</em> as keyword + data tables</td><td>Non-programmers design new tests; scripts reusable</td><td>Upfront effort to build and maintain the keyword library</td></tr>
<tr><td>Model-based</td><td>Designer draws a <em>model</em>; the MBT tool generates test cases (inputs + expected outputs)</td><td>Tests regenerate when the model changes</td><td>Modelling skill; model can be wrong too</td></tr>
</tbody>
</table>`,
      `<span class="eyebrow">Chương 8 · Bài 8.3 · SWT6 slide 36–47</span>
<h2>Lợi ích và rủi ro của tự động hoá kiểm thử — và các trường hợp đặc biệt</h2>
<p class="lead">Mua công cụ thì dễ; khai thác được giá trị từ nó mới khó.</p>
<p class="nhan"><strong>Bài này gồm</strong></p>
<ul>
<li><strong>Lợi ích</strong> — điều công cụ thực sự có thể mang lại.</li>
<li><strong>Rủi ro</strong> — điều thường hỏng.</li>
<li><strong>Lưu ý đặc biệt</strong> cho hai loại công cụ tốn công nhất: <strong>công cụ thực thi test</strong> (bốn cách viết script: capture/replay, data-driven, keyword-driven, model-based) và <strong>công cụ quản lý test</strong>.</li>
<li><strong>Ví dụ có lời giải</strong> — chạy thật cùng một tính năng đăng nhập theo kiểu data-driven và kiểu keyword-driven.</li>
</ul>
<div class="callout"><strong>Chuẩn đầu ra.</strong><ul><li>LO-6.1.2 Nhận diện lợi ích và rủi ro của tự động hoá kiểm thử (K1).</li><li>LO-6.1.3 Nhớ các lưu ý đặc biệt cho công cụ thực thi test và công cụ quản lý test (K1).</li></ul></div>
<table>
<thead><tr><th>Cách làm</th><th>Ai viết gì</th><th>Điểm mạnh</th><th>Điểm yếu</th></tr></thead>
<tbody>
<tr><td>Capture/replay</td><td>Công cụ ghi thao tác của tester thủ công thành script tuyến tính</td><td>Bắt đầu nhanh; lưu vết các buổi exploratory</td><td>Dễ gãy, không có kết quả mong đợi, không mở rộng được</td></tr>
<tr><td>Data-driven</td><td>Kỹ sư automation viết một script chung; tester thêm <em>dòng dữ liệu</em> (input + kết quả mong đợi)</td><td>Nhiều ca của <em>cùng một</em> test với chi phí thấp</td><td>Chỉ thay dữ liệu, không thay các bước</td></tr>
<tr><td>Keyword-driven</td><td>Kỹ sư cài đặt các <em>keyword</em> (từ hành động); tester viết <em>test</em> dưới dạng bảng keyword + dữ liệu</td><td>Người không lập trình thiết kế được test mới; script tái sử dụng</td><td>Tốn công ban đầu để xây và bảo trì thư viện keyword</td></tr>
<tr><td>Model-based</td><td>Người thiết kế vẽ <em>mô hình</em>; công cụ MBT sinh test case (input + output mong đợi)</td><td>Test tự sinh lại khi mô hình đổi</td><td>Cần kỹ năng mô hình hoá; mô hình cũng có thể sai</td></tr>
</tbody>
</table>`),
    walkHead(D, 36, 47),
    walk(D, [
      [36, 'Mind map — next branch: Benefits & Risks',
        `<p class="y-chinh">🎯 The chapter mind map again, now pointing at the next leaf: <strong>Benefits &amp; Risks of Test Automation</strong>.</p>
<ul>
<li><strong>Leaving</strong> — <em>Test Tool Classification</em> (slides 9–35).</li>
<li><strong>Entering</strong> — the next leaf of <em>Test Tool Considerations</em>: <strong>Benefits &amp; Risks of Test Automation</strong>.</li>
</ul>`,
        `<p class="y-chinh">🎯 Lại là sơ đồ tư duy của chương, giờ chỉ vào lá tiếp theo: <strong>Benefits &amp; Risks of Test Automation</strong>.</p>
<ul>
<li><strong>Rời khỏi</strong> — <em>Test Tool Classification</em> (slide 9–35).</li>
<li><strong>Đi vào</strong> — lá tiếp theo của <em>Test Tool Considerations</em>: <strong>Benefits &amp; Risks of Test Automation</strong>.</li>
</ul>`],
      [37, 'Potential Benefits and Risks — agenda',
        `<p class="y-chinh">🎯 Three topics on this slide — and the word "potential" is the point.</p>
<ol>
<li><strong>Potential benefits</strong> of using tools (slide 38).</li>
<li><strong>Risks</strong> of using tools (slides 39–40).</li>
<li><strong>Special considerations for some types of tools</strong> (slides 42–47).</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> benefits are not automatic — they come only if the risks are managed.</p>`,
        `<p class="y-chinh">🎯 Slide này có ba chủ đề — và chữ "tiềm năng" (potential) mới là điểm chính.</p>
<ol>
<li><strong>Lợi ích tiềm năng</strong> khi dùng công cụ (slide 38).</li>
<li><strong>Rủi ro</strong> khi dùng công cụ (slide 39–40).</li>
<li><strong>Lưu ý đặc biệt cho một số loại công cụ</strong> (slide 42–47).</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> lợi ích không tự đến — chỉ có khi quản lý được rủi ro.</p>`],
      [38, 'Potential benefits of using tools',
        `<p class="y-chinh">🎯 A tool can give four benefits — less repetitive work, consistency, objective numbers and easy access to information.</p>
<p class="nhan">The four benefits, with the syllabus's examples</p>
<ol>
<li><strong>Reduction of repetitive (manual) work</strong> — running regression tests, environment set-up/tear-down, re-entering the same test data, checking against coding standards.</li>
<li><strong>Greater consistency and repeatability</strong> — test data created in a coherent way, tests executed in the same order with the same frequency, tests consistently derived from requirements.</li>
<li><strong>Objective assessment</strong> — static measures, coverage: a number produced by a tool, not someone's impression.</li>
<li><strong>Ease of access to information about tests or testing</strong> — statistics, graphs, aggregated data about test progress, defect rates and performance.</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> <em>less boring work, same every time, numbers not opinions, information at a glance</em>.</p>`,
        `<p class="y-chinh">🎯 Công cụ có thể mang lại bốn lợi ích — bớt việc lặp lại, nhất quán, con số khách quan và thông tin dễ lấy.</p>
<p class="nhan">Bốn lợi ích, kèm ví dụ của syllabus</p>
<ol>
<li><strong>Giảm việc thủ công lặp lại</strong> — chạy regression test, dựng/dọn môi trường, nhập lại cùng dữ liệu test, kiểm theo chuẩn viết code.</li>
<li><strong>Nhất quán và lặp lại được hơn</strong> — dữ liệu test được tạo mạch lạc, test chạy cùng thứ tự với cùng tần suất, test được suy ra từ yêu cầu một cách nhất quán.</li>
<li><strong>Đánh giá khách quan</strong> — số đo tĩnh, coverage: một con số do công cụ tạo ra, không phải cảm nhận của ai đó.</li>
<li><strong>Dễ truy cập thông tin về test và việc kiểm thử</strong> — thống kê, biểu đồ, số liệu tổng hợp về tiến độ test, tỉ lệ defect và hiệu năng.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> <em>bớt việc nhàm, lần nào cũng như nhau, con số thay cho ý kiến, thông tin liếc là thấy</em>.</p>`],
      [39, 'Risks of using tools (1)',
        `<p class="y-chinh">🎯 Whatever the type of tool, introducing it brings risks — first the four "human" ones.</p>
<p class="ghi-chu">"There are many risks that are present when tool support for testing is introduced and used, whatever the specific type of tool."</p>
<ul>
<li><strong>Unrealistic expectations</strong> for the tool (functionality and ease of use) — "we bought it, so testing is automated now".</li>
<li><strong>Underestimation of time, cost and effort</strong> for three things:
<ol>
<li>the <em>initial introduction</em> (training, external expertise);</li>
<li>achieving <em>continuing benefits</em> (changes to the test process, continuous improvement);</li>
<li><em>maintaining the test assets</em> the tool generates (scripts break when the UI changes).</li>
</ol></li>
<li><strong>Over-reliance on the tool</strong> — e.g. using it to replace test design, or automating tests that are better done manually (usability, exploratory).</li>
<li><strong>Failing to consider and manage relationships and interoperability between critical tools</strong> — requirements management, configuration management, defect management, tools from multiple vendors that do not talk to each other.</li>
</ul>`,
        `<p class="y-chinh">🎯 Loại công cụ nào cũng vậy, đưa vào là có rủi ro — trước hết là bốn rủi ro về "con người".</p>
<p class="ghi-chu">"Có nhiều rủi ro xuất hiện khi đưa công cụ vào hỗ trợ kiểm thử, bất kể loại công cụ nào."</p>
<ul>
<li><strong>Kỳ vọng phi thực tế</strong> vào công cụ (về chức năng và độ dễ dùng) — "mua rồi nên giờ test đã tự động".</li>
<li><strong>Đánh giá thấp thời gian, chi phí và công sức</strong> cho ba việc:
<ol>
<li><em>lần đưa vào đầu tiên</em> (đào tạo, thuê chuyên gia);</li>
<li>để có <em>lợi ích lâu dài</em> (đổi quy trình test, cải tiến liên tục);</li>
<li><em>bảo trì tài sản test</em> do công cụ tạo ra (script gãy khi UI đổi).</li>
</ol></li>
<li><strong>Quá phụ thuộc vào công cụ</strong> — vd dùng nó thay cho thiết kế test, hoặc tự động hoá những test làm tay tốt hơn (usability, exploratory).</li>
<li><strong>Không tính tới và không quản lý quan hệ, khả năng liên thông giữa các công cụ quan trọng</strong> — quản lý yêu cầu, quản lý cấu hình, quản lý defect, công cụ của nhiều hãng không nói chuyện được với nhau.</li>
</ul>`],
      [40, 'Risks of using tools (2)',
        `<p class="y-chinh">🎯 The second group of risks comes from outside your team: the vendor, its support, and platforms the tool cannot follow.</p>
<p class="nhan">On the slide</p>
<ul>
<li>The <strong>tool vendor goes out of business</strong>, <strong>retires the tool</strong> or <strong>sells it to a different vendor</strong> — "or in the open-source world": the project is abandoned or suspended.</li>
<li><strong>Poor or non-existent vendor response</strong> for support, upgrades or defect fixes.</li>
<li><strong>Various uncertainties and unforeseen problems</strong>, such as the <strong>inability to support a new platform</strong> (your company moves to a new mobile OS version or a new browser and the tool does not follow).</li>
</ul>
<p class="nhan">Three more in the syllabus — the slides skip them</p>
<ul>
<li><strong>Version control of test assets neglected</strong>.</li>
<li><strong>No clear ownership of the tool</strong> — nobody responsible for mentoring, updates.</li>
<li><strong>New technologies</strong> not supported by the tool.</li>
</ul>
<div class="pitfall">An exam option such as "the tool finds more defects than expected" is <em>not</em> a risk — it is a (pleasant) outcome.</div>`,
        `<p class="y-chinh">🎯 Nhóm rủi ro thứ hai đến từ bên ngoài đội: nhà cung cấp, việc hỗ trợ, và nền tảng mà công cụ không theo kịp.</p>
<p class="nhan">Trên slide</p>
<ul>
<li><strong>Hãng làm công cụ phá sản</strong>, <strong>khai tử công cụ</strong> hoặc <strong>bán nó cho hãng khác</strong> — "hoặc trong thế giới mã nguồn mở": dự án bị bỏ rơi hoặc tạm dừng.</li>
<li><strong>Hãng hỗ trợ kém hoặc không hỗ trợ</strong> về support, nâng cấp hay sửa lỗi.</li>
<li><strong>Nhiều điều bất định và vấn đề không lường trước</strong>, như <strong>không hỗ trợ được nền tảng mới</strong> (công ty chuyển sang phiên bản hệ điều hành mobile mới hay trình duyệt mới mà công cụ không theo kịp).</li>
</ul>
<p class="nhan">Syllabus còn ba rủi ro nữa — slide bỏ qua</p>
<ul>
<li><strong>Bỏ quên quản lý phiên bản của tài sản test</strong>.</li>
<li><strong>Không có người sở hữu rõ ràng cho công cụ</strong> — không ai lo hướng dẫn, cập nhật.</li>
<li><strong>Công nghệ mới</strong> không được công cụ hỗ trợ.</li>
</ul>
<div class="pitfall">Một phương án kiểu "công cụ tìm được nhiều defect hơn mong đợi" <em>không</em> phải rủi ro — đó là một kết quả (dễ chịu).</div>`],
      [41, 'Mind map — next branch: Execution & Management Tools Considerations',
        `<p class="y-chinh">🎯 Mind map once more, now pointing at the last leaf of the first half: <strong>Execution &amp; Management Tools Considerations</strong>.</p>
<ul>
<li><strong>Test execution</strong> — capture/replay, data-driven, keyword-driven, model-based.</li>
<li><strong>Test management</strong>.</li>
</ul>`,
        `<p class="y-chinh">🎯 Sơ đồ tư duy thêm một lần, giờ chỉ vào lá cuối của nửa đầu: <strong>Execution &amp; Management Tools Considerations</strong>.</p>
<ul>
<li><strong>Thực thi test</strong> — capture/replay, data-driven, keyword-driven, model-based.</li>
<li><strong>Quản lý test</strong>.</li>
</ul>`],
      [42, 'Special considerations for test execution & management tools',
        `<p class="y-chinh">🎯 "SpecCons" = <strong>special considerations</strong> — needed for the two tool types that are the most expensive to get right.</p>
<ul>
<li><strong>Test execution tools</strong> — four approaches:
<ol>
<li><em>capture/replay</em> (slide 43)</li>
<li><em>data-driven</em> (slide 44)</li>
<li><em>keyword-driven</em> (slide 45)</li>
<li><em>model-based</em> (slide 46)</li>
</ol></li>
<li><strong>Test management tools</strong> (slide 47).</li>
</ul>
<p class="ghi-chu">The syllabus sentence behind this slide: execution tools "often require significant effort in order to achieve significant benefits".</p>`,
        `<p class="y-chinh">🎯 "SpecCons" = <strong>special considerations — lưu ý đặc biệt</strong> — dành cho hai loại công cụ làm cho đúng tốn kém nhất.</p>
<ul>
<li><strong>Công cụ thực thi test</strong> — bốn cách:
<ol>
<li><em>capture/replay</em> (slide 43)</li>
<li><em>data-driven</em> (slide 44)</li>
<li><em>keyword-driven</em> (slide 45)</li>
<li><em>model-based</em> (slide 46)</li>
</ol></li>
<li><strong>Công cụ quản lý test</strong> (slide 47).</li>
</ul>
<p class="ghi-chu">Câu syllabus đứng sau slide này: công cụ thực thi "thường đòi hỏi công sức đáng kể mới đạt được lợi ích đáng kể".</p>`],
      [43, 'Capture/Replay testing tools',
        `<p class="y-chinh">🎯 Recording a manual tester's actions (camera icon → replay icon) is easy to start — but it has three drawbacks.</p>
<p class="nhan">Drawbacks</p>
<ul>
<li><strong>Does not scale</strong> to large numbers of test scripts — one small UI change can break hundreds of recordings, each to be re-recorded or edited.</li>
<li><strong>Does not store test cases</strong> — only test data and scripts: a recording holds the inputs you typed, <em>not the expected results</em>, until someone programs checks in.</li>
<li><strong>The script may be unstable when unexpected events occur</strong> — a pop-up, a slower page, a file that already exists: the recording only copes with exactly the conditions under which it was recorded.</li>
</ul>
<p class="nhan">Where it <em>is</em> useful — capturing test inputs</p>
<ul>
<li><strong>When</strong> — during <strong>exploratory testing</strong> or <strong>unscripted tests with experienced users</strong>.</li>
<li><strong>Audit trail</strong> — a record of what was actually done.</li>
<li><strong>Reproduction</strong> — replay a hard-to-reproduce failure for the developer.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> Graham et al. call capture/playback "probably the worst way" to use an execution tool — fine for a few dozen short-lived tests, never as a large regression suite.</p>`,
        `<p class="y-chinh">🎯 Ghi lại thao tác của tester thủ công (biểu tượng máy quay → biểu tượng phát lại) thì bắt đầu rất dễ — nhưng có ba nhược điểm.</p>
<p class="nhan">Nhược điểm</p>
<ul>
<li><strong>Không mở rộng được</strong> tới số lượng lớn script — một thay đổi nhỏ trên UI có thể làm gãy hàng trăm bản ghi, cái nào cũng phải ghi lại hoặc sửa.</li>
<li><strong>Không lưu test case</strong> — chỉ lưu dữ liệu và script: bản ghi chứa các input bạn đã gõ, <em>không chứa kết quả mong đợi</em>, cho tới khi có người lập trình thêm các phép kiểm.</li>
<li><strong>Script có thể không ổn định khi có sự kiện bất ngờ</strong> — một pop-up, trang tải chậm hơn, một file đã tồn tại: bản ghi chỉ xử lý được đúng điều kiện lúc nó được ghi.</li>
</ul>
<p class="nhan">Chỗ nó <em>có ích</em> — ghi lại input</p>
<ul>
<li><strong>Khi nào</strong> — khi làm <strong>exploratory testing</strong> hoặc <strong>test không kịch bản với người dùng giàu kinh nghiệm</strong>.</li>
<li><strong>Vết kiểm tra (audit trail)</strong> — bản ghi về việc đã thực sự làm.</li>
<li><strong>Tái hiện</strong> — phát lại một failure khó tái hiện cho developer xem.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> Graham và cộng sự gọi capture/playback là "có lẽ là cách tệ nhất" để dùng công cụ thực thi — ổn cho vài chục test ngắn hạn, không bao giờ nên dùng làm bộ regression lớn.</p>`],
      [44, 'Data-driven testing tools',
        `<p class="y-chinh">🎯 Data-driven = <strong>one generic script, many rows of data</strong>: the inputs and expected results live outside the script.</p>
<p class="nhan">How it works</p>
<ul>
<li><strong>Separate the data</strong> — test inputs and expected results go into a file, usually a <strong>spreadsheet</strong>.</li>
<li><strong>Generic test script</strong> — reads the input data and <strong>executes the same script with different data</strong>.</li>
<li><strong>Who adds tests</strong> — testers who do not know the scripting language can <strong>create new test data</strong> for these predefined scripts.</li>
</ul>
<p class="nhan">The diagram, step by step</p>
<ol>
<li><em>Data file</em> → test data → <em>Test script</em>.</li>
<li><em>Test script</em> → enters input data → <em>System/component under test</em>.</li>
<li><em>System/component under test</em> → actual output → <em>Test result (compare)</em>.</li>
<li><em>Data file</em> → expected output → <em>Test result (compare)</em>.</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> JUnit's <code>@ParameterizedTest</code> with <code>@CsvSource</code> (lesson 8.5) is data-driven testing in miniature.</p>`,
        `<p class="y-chinh">🎯 Data-driven = <strong>một script chung, nhiều dòng dữ liệu</strong>: input và kết quả mong đợi nằm ngoài script.</p>
<p class="nhan">Cách hoạt động</p>
<ul>
<li><strong>Tách dữ liệu ra</strong> — input và kết quả mong đợi nằm trong một file, thường là <strong>bảng tính</strong>.</li>
<li><strong>Script test chung</strong> — đọc dữ liệu vào rồi <strong>chạy cùng một script với nhiều bộ dữ liệu khác nhau</strong>.</li>
<li><strong>Ai thêm test</strong> — tester không biết ngôn ngữ script vẫn <strong>tạo thêm dữ liệu test</strong> được cho các script đã có sẵn.</li>
</ul>
<p class="nhan">Sơ đồ, từng bước</p>
<ol>
<li><em>Data file</em> → dữ liệu test → <em>Test script</em>.</li>
<li><em>Test script</em> → nhập input → <em>Hệ thống/component đang test</em>.</li>
<li><em>Hệ thống/component đang test</em> → output thực tế → <em>Test result (so sánh)</em>.</li>
<li><em>Data file</em> → output mong đợi → <em>Test result (so sánh)</em>.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> <code>@ParameterizedTest</code> với <code>@CsvSource</code> của JUnit (bài 8.5) chính là data-driven testing thu nhỏ.</p>`],
      [45, 'Keyword-driven testing tools',
        `<p class="y-chinh">🎯 Keyword-driven = testers write the <em>steps</em> of a test as a table of keywords (action words) plus data.</p>
<p class="nhan">How it works</p>
<ul>
<li><strong>Generic script</strong> — processes <strong>keywords</strong> describing the actions to take (also called <strong>action words</strong>).</li>
<li><strong>Keyword scripts</strong> — the generic script calls the matching keyword script to process the associated test data.</li>
<li><strong>Who writes tests</strong> — testers, even those unfamiliar with the scripting language, <strong>define tests</strong> using the keywords and data, tailored to the SUT.</li>
</ul>
<p class="nhan">The diagram, step by step</p>
<ol>
<li>A table of <em>Actions</em> + <em>Test data</em> is the input of the <em>Automation script</em>.</li>
<li>The script enters input data into the <em>SUT</em>.</li>
<li>The SUT sends output data back.</li>
<li>The script writes the test output data.</li>
</ol>
<p class="nhan">Key difference from data-driven</p>
<ul>
<li><strong>The table holds the steps</strong>, not only the data — so testers write <em>tests</em>, not just data for one fixed test.</li>
<li><strong>Best-known tool</strong> — Robot Framework (open source).</li>
</ul>`,
        `<p class="y-chinh">🎯 Keyword-driven = tester viết <em>các bước</em> của test thành một bảng keyword (từ hành động) kèm dữ liệu.</p>
<p class="nhan">Cách hoạt động</p>
<ul>
<li><strong>Script chung</strong> — xử lý các <strong>keyword</strong> mô tả hành động cần làm (còn gọi là <strong>action word — từ hành động</strong>).</li>
<li><strong>Keyword script</strong> — script chung gọi keyword script tương ứng để xử lý dữ liệu đi kèm.</li>
<li><strong>Ai viết test</strong> — tester, kể cả người không biết ngôn ngữ script, <strong>định nghĩa test</strong> bằng keyword và dữ liệu, may đo cho SUT.</li>
</ul>
<p class="nhan">Sơ đồ, từng bước</p>
<ol>
<li>Bảng gồm <em>Actions</em> + <em>Test data</em> là input của <em>Automation script</em>.</li>
<li>Script nhập dữ liệu vào <em>SUT</em>.</li>
<li>SUT gửi output trả về.</li>
<li>Script ghi dữ liệu kết quả test.</li>
</ol>
<p class="nhan">Khác biệt then chốt với data-driven</p>
<ul>
<li><strong>Bảng chứa các bước</strong>, không chỉ dữ liệu — nên tester viết được <em>test</em>, không chỉ dữ liệu cho một test cố định.</li>
<li><strong>Công cụ nổi tiếng nhất</strong> — Robot Framework (mã nguồn mở).</li>
</ul>`],
      [46, 'Model-based testing tools',
        `<p class="y-chinh">🎯 MBT tools turn a <strong>model</strong> of the specification into test cases — inputs <em>and</em> expected outputs — and can execute them.</p>
<ul>
<li><strong>What they do</strong> — include <strong>test execution capability</strong> and <strong>generate test inputs and expected outputs</strong> (unlike the test design tools of slide 16, the model gives them the expected behaviour).</li>
<li><strong>The model</strong> — a <strong>functional specification captured as a model</strong>: a state transition diagram, an activity diagram.</li>
<li><strong>Who models</strong> — generally a <strong>system designer</strong>.</li>
<li><strong>The output</strong> — the tool interprets the model to <strong>create test case specifications</strong>, saved in a test management tool and/or executed by a test execution tool.</li>
</ul>
<p class="nhan">Example</p>
<p>From the PIN-entry state diagram of Chapter 4 (fst4 Fig. 4.2), a tool can generate one test per transition (0-switch coverage) automatically.</p>`,
        `<p class="y-chinh">🎯 Công cụ MBT biến một <strong>mô hình</strong> của đặc tả thành test case — cả input <em>lẫn</em> output mong đợi — và có thể chạy chúng.</p>
<ul>
<li><strong>Làm gì</strong> — có <strong>khả năng thực thi test</strong> và <strong>sinh cả input lẫn output mong đợi</strong> (khác công cụ thiết kế test ở slide 16, mô hình cho chúng biết hành vi mong đợi).</li>
<li><strong>Mô hình</strong> — <strong>đặc tả chức năng được ghi lại dưới dạng mô hình</strong>: sơ đồ chuyển trạng thái, activity diagram.</li>
<li><strong>Ai vẽ mô hình</strong> — thường là <strong>người thiết kế hệ thống</strong>.</li>
<li><strong>Đầu ra</strong> — công cụ diễn giải mô hình để <strong>tạo đặc tả test case</strong>, lưu vào công cụ quản lý test và/hoặc cho công cụ thực thi chạy.</li>
</ul>
<p class="nhan">Ví dụ</p>
<p>Từ sơ đồ trạng thái nhập PIN ở Chương 4 (fst4 Hình 4.2), công cụ tự sinh một test cho mỗi chuyển trạng thái (phủ 0-switch).</p>`],
      [47, 'Test management tools',
        `<p class="y-chinh">🎯 Test management tools produce lots of data — but only become useful when they <strong>interface with other tools</strong> and are fitted to your process.</p>
<p class="nhan">They must interface with other tools to</p>
<ul>
<li>produce <strong>meaningful information in an accessible format</strong> (e.g. export to the company's report format, spreadsheets);</li>
<li>maintain <strong>consistent traceability to requirements</strong> (with requirements management tools);</li>
<li>link with <strong>test object version information</strong> (with configuration management tools).</li>
</ul>
<p class="nhan">Two more points</p>
<ul>
<li><strong>ALM tools</strong> — can present different information to different user groups (managers, developers, testers).</li>
<li><strong>Currency</strong> — it is essential to <strong>monitor the information produced to ensure its currency</strong>. "Currency" here means <em>being up to date</em>, not money (the notes translate it as "tính tiền tệ", which is wrong).</li>
</ul>
<p class="nhan">Recommended approach — the process first</p>
<ol>
<li><strong>Define the test process</strong>.</li>
<li><strong>Consider the adopted tool(s)</strong>.</li>
<li><strong>Adapt the tool(s)</strong> to give the highest benefit — not the tool dictating the process.</li>
</ol>
<p class="ghi-chu">Slide typo: "mangers" → managers.</p>`,
        `<p class="y-chinh">🎯 Công cụ quản lý test tạo ra rất nhiều dữ liệu — nhưng chỉ hữu ích khi <strong>kết nối với công cụ khác</strong> và được chỉnh theo quy trình của bạn.</p>
<p class="nhan">Phải kết nối với công cụ khác để</p>
<ul>
<li>tạo <strong>thông tin có ý nghĩa ở định dạng dễ tiếp cận</strong> (vd xuất ra mẫu báo cáo của công ty, bảng tính);</li>
<li>giữ <strong>truy vết nhất quán tới yêu cầu</strong> (với công cụ quản lý yêu cầu);</li>
<li>liên kết với <strong>thông tin phiên bản của đối tượng test</strong> (với công cụ quản lý cấu hình).</li>
</ul>
<p class="nhan">Thêm hai ý</p>
<ul>
<li><strong>Công cụ ALM</strong> — có thể đưa thông tin khác nhau cho từng nhóm người dùng (quản lý, developer, tester).</li>
<li><strong>Currency</strong> — cần <strong>giám sát thông tin được tạo ra để đảm bảo nó còn cập nhật</strong>. Chữ "currency" ở đây nghĩa là <em>tính thời sự, còn mới</em>, không phải tiền (ghi chú dịch là "tính tiền tệ" là dịch sai).</li>
</ul>
<p class="nhan">Cách tiếp cận khuyến nghị — quy trình đi trước</p>
<ol>
<li><strong>Xác định quy trình test</strong>.</li>
<li><strong>Xem xét công cụ sẽ dùng</strong>.</li>
<li><strong>Điều chỉnh công cụ</strong> để có lợi nhất — không để công cụ quyết định quy trình.</li>
</ol>
<p class="ghi-chu">Lỗi đánh máy trên slide: "mangers" → managers.</p>`],
    ]),
    bi(`<h3>Ví dụ có lời giải · Worked example — the same login feature, data-driven vs keyword-driven</h3>
<p><strong>SUT.</strong> A login service: user <code>alice</code> / password <code>secret</code>; blank username → "Username required"; unknown user → "Unknown user"; wrong password → "Invalid password", and the <strong>3rd</strong> consecutive wrong password locks the account ("Account locked"). The code below was compiled and run with JDK 21 (<code>javac DdtKdtDemo.java &amp;&amp; java DdtKdtDemo</code>).</p>
<p><strong>Data-driven.</strong> A tester fills a table — inputs and expected result — and never touches Java:</p>
<pre><code>user,password,expected
alice,secret,Welcome alice
alice,wrong,Invalid password
,secret,Username required
bob,secret,Unknown user
ALICE,secret,Welcome alice</code></pre>
<p>One generic script reads every row, runs the same steps, compares:</p>
<pre><code>for (String[] r : table(file)) {
    LoginService sut = new LoginService();          // fresh SUT per row
    String actual = sut.login(r[0], r[1]);
    boolean ok = actual.equals(r[2]);               // compare with expected
    System.out.printf("row %d ... %s%n", n, ok ? "PASS" : "FAIL");
}</code></pre>
<p><strong>Keyword-driven.</strong> Test case TC-07 "lock-out after three wrong passwords" needs a <em>sequence</em> that the data table cannot express. The tester writes it with three keywords the automation engineer provided — <code>OpenApp</code>, <code>Login</code>, <code>CheckMessage</code>:</p>
<pre><code>keyword,arg1,arg2
OpenApp,,
Login,alice,wrong
CheckMessage,Invalid password,
Login,alice,wrong
Login,alice,wrong
CheckMessage,Account locked,
Login,alice,secret
CheckMessage,Account locked,</code></pre>
<pre><code>switch (r[0]) {                                     // keyword -&gt; keyword script
    case "OpenApp"      -&gt; sut = new LoginService();
    case "Login"        -&gt; last = sut.login(r[1], r[2]);
    case "CheckMessage" -&gt; passed &amp;= r[1].equals(last);
    default             -&gt; throw new IllegalArgumentException("unknown keyword " + r[0]);
}</code></pre>
<p><strong>Real output:</strong></p>
<pre><code>== Data-driven run: login-data.csv
row 1  user='alice' pass=secret expected=Welcome alice      actual=Welcome alice      PASS
row 2  user='alice' pass=wrong  expected=Invalid password   actual=Invalid password   PASS
row 3  user=''     pass=secret expected=Username required  actual=Username required  PASS
row 4  user='bob'  pass=secret expected=Unknown user       actual=Unknown user       PASS
row 5  user='ALICE' pass=secret expected=Welcome alice      actual=Unknown user       FAIL
   5 rows, 1 failed
== Keyword-driven run: tc07-lockout.csv
step 1  OpenApp
step 2  Login alice/wrong -&gt; Invalid password
step 3  CheckMessage 'Invalid password' PASS
step 4  Login alice/wrong -&gt; Invalid password
step 5  Login alice/wrong -&gt; Account locked
step 6  CheckMessage 'Account locked' PASS
step 7  Login alice/secret -&gt; Account locked
step 8  CheckMessage 'Account locked' PASS
   test case PASSED</code></pre>
<ol>
<li><strong>Row 5 fails.</strong> The tester expected user names to be case-insensitive; the SUT treats <code>ALICE</code> as unknown. Is that a defect? Only the specification (or the product owner) can say — the tool merely reports the difference. This is exactly slide 44: a non-programmer added a new case by adding one line of data.</li>
<li><strong>Step 7 shows why keywords were needed.</strong> The correct password is still refused because the account is locked — a behaviour that only appears after a <em>sequence</em> of actions. In a data-driven table every row starts with a fresh SUT, so it cannot express this test; the keyword table can.</li>
<li><strong>Capture/replay comparison.</strong> A recording of TC-07 would store 4 logins and 4 clicks but no "CheckMessage" steps — nothing would fail even if the lock-out were broken (slide 43, "does not store test cases").</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Exam trap: who writes what.</strong> Data-driven → testers add <em>data</em> for a predefined script. Keyword-driven → testers write <em>tests</em> (steps) from keywords and data. In <em>both</em>, someone must still program the scripts (the generic script, the keyword implementations); the syllabus stresses that these approaches let testers without scripting skills contribute — it does not say nobody needs programming skills. And capture/replay does <em>not</em> record expected results.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Keyword-driven testing today: Robot Framework and Gherkin.</strong>
<ul>
<li><strong>Robot Framework</strong> (open source, used by Nokia, ABB and many banks) — keyword-driven testing productised: tests are tables of keywords such as <code>Open Browser</code>, <code>Input Text</code>, <code>Page Should Contain</code>, with libraries for Selenium, Appium, REST and databases.</li>
<li><strong>BDD's Gherkin</strong> (<em>Given the account has 2 failed logins / When alice logs in with a wrong password / Then the account is locked</em>) — a close cousin: each step sentence is a keyword bound to code.</li>
<li><strong>ISO/IEC/IEEE 29119-5 (2016)</strong> — standardises keyword-driven testing.</li>
</ul>
<em>Outside the syllabus because CTFL names the approaches but no tools or standards.</em></div>`,
      `<h3>Ví dụ có lời giải · Cùng một tính năng đăng nhập: data-driven vs keyword-driven</h3>
<p><strong>SUT.</strong> Một service đăng nhập: user <code>alice</code> / mật khẩu <code>secret</code>; username trống → "Username required"; user không tồn tại → "Unknown user"; sai mật khẩu → "Invalid password", và lần sai <strong>thứ 3</strong> liên tiếp thì khoá tài khoản ("Account locked"). Code bên dưới đã được biên dịch và chạy bằng JDK 21 (<code>javac DdtKdtDemo.java &amp;&amp; java DdtKdtDemo</code>).</p>
<p><strong>Data-driven.</strong> Tester điền một bảng — input và kết quả mong đợi — không đụng tới Java:</p>
<pre><code>user,password,expected
alice,secret,Welcome alice
alice,wrong,Invalid password
,secret,Username required
bob,secret,Unknown user
ALICE,secret,Welcome alice</code></pre>
<p>Một script chung đọc từng dòng, chạy cùng các bước, so sánh:</p>
<pre><code>for (String[] r : table(file)) {
    LoginService sut = new LoginService();          // SUT mới cho mỗi dòng
    String actual = sut.login(r[0], r[1]);
    boolean ok = actual.equals(r[2]);               // so với kết quả mong đợi
    System.out.printf("row %d ... %s%n", n, ok ? "PASS" : "FAIL");
}</code></pre>
<p><strong>Keyword-driven.</strong> Test case TC-07 "khoá tài khoản sau ba lần sai mật khẩu" cần một <em>chuỗi</em> hành động mà bảng dữ liệu không diễn tả được. Tester viết nó bằng ba keyword do kỹ sư automation cung cấp — <code>OpenApp</code>, <code>Login</code>, <code>CheckMessage</code>:</p>
<pre><code>keyword,arg1,arg2
OpenApp,,
Login,alice,wrong
CheckMessage,Invalid password,
Login,alice,wrong
Login,alice,wrong
CheckMessage,Account locked,
Login,alice,secret
CheckMessage,Account locked,</code></pre>
<pre><code>switch (r[0]) {                                     // keyword -&gt; keyword script
    case "OpenApp"      -&gt; sut = new LoginService();
    case "Login"        -&gt; last = sut.login(r[1], r[2]);
    case "CheckMessage" -&gt; passed &amp;= r[1].equals(last);
    default             -&gt; throw new IllegalArgumentException("unknown keyword " + r[0]);
}</code></pre>
<p><strong>Output thật:</strong></p>
<pre><code>== Data-driven run: login-data.csv
row 1  user='alice' pass=secret expected=Welcome alice      actual=Welcome alice      PASS
row 2  user='alice' pass=wrong  expected=Invalid password   actual=Invalid password   PASS
row 3  user=''     pass=secret expected=Username required  actual=Username required  PASS
row 4  user='bob'  pass=secret expected=Unknown user       actual=Unknown user       PASS
row 5  user='ALICE' pass=secret expected=Welcome alice      actual=Unknown user       FAIL
   5 rows, 1 failed
== Keyword-driven run: tc07-lockout.csv
step 1  OpenApp
step 2  Login alice/wrong -&gt; Invalid password
step 3  CheckMessage 'Invalid password' PASS
step 4  Login alice/wrong -&gt; Invalid password
step 5  Login alice/wrong -&gt; Account locked
step 6  CheckMessage 'Account locked' PASS
step 7  Login alice/secret -&gt; Account locked
step 8  CheckMessage 'Account locked' PASS
   test case PASSED</code></pre>
<ol>
<li><strong>Dòng 5 fail.</strong> Tester nghĩ tên đăng nhập không phân biệt hoa thường; SUT lại coi <code>ALICE</code> là user không tồn tại. Đó có phải defect không? Chỉ đặc tả (hoặc product owner) trả lời được — công cụ chỉ báo ra sự khác biệt. Đúng tinh thần slide 44: một người không lập trình đã thêm được một ca mới chỉ bằng một dòng dữ liệu.</li>
<li><strong>Bước 7 cho thấy vì sao cần keyword.</strong> Mật khẩu đúng vẫn bị từ chối vì tài khoản đã khoá — hành vi chỉ xuất hiện sau một <em>chuỗi</em> thao tác. Trong bảng data-driven mỗi dòng bắt đầu với SUT mới, nên không diễn tả được test này; bảng keyword thì được.</li>
<li><strong>So với capture/replay.</strong> Bản ghi của TC-07 sẽ lưu 4 lần đăng nhập và 4 cú bấm nhưng không có bước "CheckMessage" nào — dù chức năng khoá tài khoản hỏng, không có gì fail cả (slide 43, "không lưu test case").</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Bẫy thi: ai viết gì.</strong> Data-driven → tester thêm <em>dữ liệu</em> cho một script có sẵn. Keyword-driven → tester viết <em>test</em> (các bước) từ keyword và dữ liệu. Ở <em>cả hai</em>, vẫn phải có người lập trình script (script chung, phần cài đặt keyword); syllabus nhấn mạnh hai cách này giúp tester không biết script cũng đóng góp được — không hề nói là không ai cần kỹ năng lập trình. Và capture/replay <em>không</em> ghi kết quả mong đợi.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Keyword-driven ngày nay: Robot Framework và Gherkin.</strong>
<ul>
<li><strong>Robot Framework</strong> (mã nguồn mở, Nokia, ABB và nhiều ngân hàng dùng) — keyword-driven testing được đóng gói thành sản phẩm: test là bảng các keyword như <code>Open Browser</code>, <code>Input Text</code>, <code>Page Should Contain</code>, có thư viện cho Selenium, Appium, REST và cơ sở dữ liệu.</li>
<li><strong>Gherkin của BDD</strong> (<em>Given tài khoản đã sai 2 lần / When alice đăng nhập sai mật khẩu / Then tài khoản bị khoá</em>) — họ hàng gần: mỗi câu bước là một keyword gắn với code.</li>
<li><strong>ISO/IEC/IEEE 29119-5 (2016)</strong> — chuẩn hoá keyword-driven testing.</li>
</ul>
<em>Ngoài giáo trình vì CTFL chỉ gọi tên các cách tiếp cận, không nêu công cụ hay chuẩn.</em></div>`),
    books([
      ['fst4', 'Ch.6 §1 "Test tool considerations" — the later parts on benefits and risks of test automation and on special considerations for test execution and test management tools, within book pp.203–221 (PDF 217–235)', 'Chương 6 §1 "Test tool considerations" — các phần sau về lợi ích và rủi ro của tự động hoá và lưu ý đặc biệt cho công cụ thực thi và quản lý test, nằm trong trang sách 203–221 (PDF 217–235)'],
      ['fst', '§6.2.1 potential benefits p.185 · §6.2.2 risks p.186 · §6.2.3 special considerations (five scripting levels: linear, structured, shared, data-driven, keyword-driven) p.187', '§6.2.1 lợi ích tiềm năng trang 185 · §6.2.2 rủi ro trang 186 · §6.2.3 lưu ý đặc biệt (năm mức script: linear, structured, shared, data-driven, keyword-driven) trang 187'],
      ['sp5', '§7.1.4 "Tools for Automating Dynamic Tests" (capture/replay, data-driven, keyword-driven) PDF 314–320 · §7.2 "Benefits and Risks of Test Automation" PDF 323–325', '§7.1.4 "Tools for Automating Dynamic Tests" (capture/replay, data-driven, keyword-driven) PDF 314–320 · §7.2 "Benefits and Risks of Test Automation" PDF 323–325'],
      ['sp4', '§7.1.4 "Tools for Dynamic Testing" — capture/replay p.212–214, data-driven p.214, keyword-/action-word-driven pp.214–215 (PDF 227–230)', '§7.1.4 "Tools for Dynamic Testing" — capture/replay trang 212–214, data-driven trang 214, keyword/action-word-driven trang 214–215 (PDF 227–230)'],
      ['junit', '§2.8 "Parameterized tests" (@ValueSource, @CsvSource — data-driven tests in JUnit 5) — PDF p.38', '§2.8 "Parameterized tests" (@ValueSource, @CsvSource — data-driven test trong JUnit 5) — PDF trang 38'],
    ]),
  ].join('\n'),
};

/* ─────────────── 8.4 Selecting & introducing a tool ─────────────── */
const L84 = {
  title: '8.4 — Effective use of tools: selection, pilot project, success factors|||8.4 — Dùng công cụ hiệu quả: chọn công cụ, dự án pilot, yếu tố thành công',
  slug: 'swt301-tools-selection-pilot',
  type: 'VIDEO',
  description: 'SWT6 slide 48–54: 11 điểm cần cân nhắc khi chọn công cụ, mục tiêu của dự án pilot (bản 2011 và 2018), 8 yếu tố thành công khi triển khai — kèm ví dụ ma trận chấm điểm có trọng số và điểm hoà vốn ROI đã tính kiểm bằng máy.',
  content: [
    bi(`<span class="eyebrow">Chapter 8 · Lesson 8.4 · SWT6 slides 48–54</span>
<h2>Effective use of tools — select, pilot, roll out</h2>
<p class="lead">The second half of Chapter 6 is short and entirely K1: three lists to recognise. Introducing a tool is a <strong>change-management</strong> project, not a purchase: first <strong>select</strong> the tool against your real needs, then prove it in a small <strong>pilot project</strong>, then roll it out with the <strong>success factors</strong> in place. Exam questions give you one item and ask which list it belongs to — so the most useful thing to learn is the <em>difference</em> between the three lists.</p>
<div class="callout"><strong>Learning objectives.</strong><ul><li>LO-6.2.1 Identify the main principles for selecting a tool (K1).</li><li>LO-6.2.2 Recall the objectives for using pilot projects to introduce tools (K1).</li><li>LO-6.2.3 Identify the success factors for evaluation, implementation, deployment and on-going support of test tools in an organisation (K1).</li></ul></div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1 · Select</div><div class="lz-t">Before buying</div><div class="lz-d">maturity, needs, technology, CI compatibility, criteria, trial, vendor, training, licence, cost-benefit, proof of concept</div></div>
  <div class="lz-step"><div class="lz-k">→ 2 · Pilot</div><div class="lz-t">One small real project</div><div class="lz-d">learn the tool, fit with processes, standard ways of use, benefits at reasonable cost, metrics</div></div>
  <div class="lz-step"><div class="lz-k">→ 3 · Roll out</div><div class="lz-t">Whole organisation</div><div class="lz-d">incremental, adapt processes, training, guidelines, usage data, monitor, support, lessons learned</div></div>
</div>`,
      `<span class="eyebrow">Chương 8 · Bài 8.4 · SWT6 slide 48–54</span>
<h2>Dùng công cụ hiệu quả — chọn, chạy thử, triển khai</h2>
<p class="lead">Nửa sau của Chương 6 ngắn và toàn K1: ba danh sách cần nhận ra. Đưa công cụ vào là một dự án <strong>quản lý thay đổi</strong>, không phải một lần mua hàng: trước hết <strong>chọn</strong> công cụ theo nhu cầu thật, rồi chứng minh nó trong một <strong>dự án pilot</strong> nhỏ, rồi triển khai kèm các <strong>yếu tố thành công</strong>. Câu hỏi thi đưa một mục và hỏi nó thuộc danh sách nào — nên điều đáng học nhất là <em>sự khác nhau</em> giữa ba danh sách.</p>
<div class="callout"><strong>Chuẩn đầu ra.</strong><ul><li>LO-6.2.1 Nhận diện các nguyên tắc chính khi chọn công cụ (K1).</li><li>LO-6.2.2 Nhớ các mục tiêu của dự án pilot khi đưa công cụ vào (K1).</li><li>LO-6.2.3 Nhận diện các yếu tố thành công cho việc đánh giá, cài đặt, triển khai và hỗ trợ lâu dài công cụ test trong tổ chức (K1).</li></ul></div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1 · Chọn</div><div class="lz-t">Trước khi mua</div><div class="lz-d">độ trưởng thành, nhu cầu, công nghệ, tương thích CI, tiêu chí, dùng thử, nhà cung cấp, đào tạo, bản quyền, chi phí-lợi ích, proof of concept</div></div>
  <div class="lz-step"><div class="lz-k">→ 2 · Pilot</div><div class="lz-t">Một dự án thật, nhỏ</div><div class="lz-d">hiểu công cụ, độ khớp với quy trình, cách dùng chuẩn, lợi ích với chi phí hợp lý, số liệu</div></div>
  <div class="lz-step"><div class="lz-k">→ 3 · Triển khai</div><div class="lz-t">Toàn tổ chức</div><div class="lz-d">từng bước, chỉnh quy trình, đào tạo, hướng dẫn, dữ liệu sử dụng, giám sát, hỗ trợ, bài học kinh nghiệm</div></div>
</div>`),
    walkHead(D, 48, 54),
    walk(D, [
      [48, 'CONTENT — Effective use of tools',
        `<p class="y-chinh">🎯 The agenda switches to part 2, <strong>Effective use of tools</strong> — three topics, one per learning objective.</p>
<ol>
<li><strong>Principles for tool selection</strong> — LO-6.2.1 (slides 50–51).</li>
<li><strong>Pilot project</strong> — LO-6.2.2 (slides 52–53).</li>
<li><strong>Success factors for tools</strong> — LO-6.2.3 (slide 54).</li>
</ol>`,
        `<p class="y-chinh">🎯 Mục lục chuyển sang phần 2, <strong>Effective use of tools</strong> — ba chủ đề, mỗi chủ đề một chuẩn đầu ra.</p>
<ol>
<li><strong>Nguyên tắc chọn công cụ</strong> — LO-6.2.1 (slide 50–51).</li>
<li><strong>Dự án pilot</strong> — LO-6.2.2 (slide 52–53).</li>
<li><strong>Yếu tố thành công</strong> — LO-6.2.3 (slide 54).</li>
</ol>`],
      [49, 'Mind map — left branch: Effective Use of Tools',
        `<p class="y-chinh">🎯 Last appearance of the mind map: now the <em>left</em> branch, <strong>Effective Use of Tools</strong>.</p>
<p class="nhan">Its three leaves</p>
<ol>
<li>Principles for tool selection</li>
<li>Pilot project</li>
<li>Success factors for tools</li>
</ol>`,
        `<p class="y-chinh">🎯 Lần xuất hiện cuối của sơ đồ tư duy: giờ là nhánh <em>trái</em>, <strong>Effective Use of Tools</strong>.</p>
<p class="nhan">Ba lá của nhánh</p>
<ol>
<li>Nguyên tắc chọn công cụ</li>
<li>Dự án pilot</li>
<li>Yếu tố thành công</li>
</ol>`],
      [50, 'Considerations for tool selection (1)',
        `<p class="y-chinh">🎯 Select a tool starting from <em>your</em> organisation, process and technology — not from the product.</p>
<p class="nhan">Main considerations (red on the slide = keywords)</p>
<ol>
<li><strong>Assessment of the maturity of the organisation</strong> — its strengths and weaknesses. A team with no written test cases will not get value from a test management tool; a team with no stable regression suite will not get value from an execution tool. (Tools amplify the process you have — "automating chaos gives faster chaos".)</li>
<li><strong>Identification of opportunities for an improved test process</strong> supported by tools — start from a problem, not from a product.</li>
<li><strong>Understanding the technologies used by the test object(s)</strong> — a desktop-only tool is useless for a React web app; a tool must recognise your UI controls.</li>
<li><strong>Knowledge of the current build and continuous integration tools</strong>, to ensure tool compatibility and integration (can it run headless in Jenkins/GitHub Actions? does it produce JUnit-XML reports?).</li>
<li><strong>Evaluation of tools against clear requirements and objective criteria</strong> — e.g. a weighted scoring matrix (worked example below).</li>
</ol>`,
        `<p class="y-chinh">🎯 Chọn công cụ bắt đầu từ tổ chức, quy trình và công nghệ <em>của bạn</em> — không bắt đầu từ sản phẩm.</p>
<p class="nhan">Những điều chính cần cân nhắc (chữ đỏ trên slide = chữ khoá)</p>
<ol>
<li><strong>Đánh giá độ trưởng thành của tổ chức</strong> — điểm mạnh và điểm yếu. Một đội chưa có test case viết ra sẽ chẳng được lợi gì từ công cụ quản lý test; một đội chưa có bộ regression ổn định sẽ chẳng được lợi gì từ công cụ thực thi. (Công cụ khuếch đại quy trình bạn đang có — "tự động hoá sự hỗn loạn chỉ cho ra hỗn loạn nhanh hơn".)</li>
<li><strong>Xác định cơ hội cải tiến quy trình test</strong> nhờ công cụ — bắt đầu từ vấn đề, không bắt đầu từ sản phẩm.</li>
<li><strong>Hiểu công nghệ mà đối tượng test dùng</strong> — công cụ chỉ chạy desktop thì vô dụng với web React; công cụ phải nhận diện được các control giao diện của bạn.</li>
<li><strong>Nắm các công cụ build và tích hợp liên tục hiện có</strong>, để đảm bảo tương thích và tích hợp (có chạy headless trong Jenkins/GitHub Actions không? có xuất báo cáo dạng JUnit-XML không?).</li>
<li><strong>Đánh giá công cụ theo yêu cầu rõ ràng và tiêu chí khách quan</strong> — vd ma trận chấm điểm có trọng số (ví dụ có lời giải bên dưới).</li>
</ol>`],
      [51, 'Considerations for tool selection (2)',
        `<p class="y-chinh">🎯 Six more selection considerations — ending with a proof of concept on <em>your</em> application.</p>
<p class="nhan">Considerations 6–11</p>
<ol start="6">
<li>Check whether the tool is available for a <strong>free trial period</strong> (and for how long) — 14 days is not enough to judge a UI-automation tool.</li>
<li><strong>Evaluation of the vendor</strong> — training, support and commercial aspects; for open source: the community (activity, releases, who maintains it).</li>
<li>Identification of <strong>coaching, mentoring and training needs</strong>, considering the testing and automation skills of the people who will use the tool.</li>
<li>Pros and cons of various <strong>licensing models</strong> — commercial (per user, per node, subscription) or open source (free, but you pay in skills and self-support).</li>
<li>Estimation of a <strong>cost-benefit ratio</strong>, based on a concrete business case.</li>
<li>Finally, a <strong>proof-of-concept (PoC) evaluation</strong> — try the short-listed tool on <em>your</em> application to establish whether it works with your software and infrastructure, and to identify the changes needed to use it.</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> notice the order — the PoC is the <em>last</em> selection step; the pilot project (next slide) comes <em>after</em> the tool is chosen.</p>`,
        `<p class="y-chinh">🎯 Thêm sáu điều cần cân nhắc khi chọn — kết thúc bằng proof of concept trên <em>chính</em> ứng dụng của bạn.</p>
<p class="nhan">Điều 6–11</p>
<ol start="6">
<li>Kiểm tra công cụ có <strong>thời gian dùng thử miễn phí</strong> không (và bao lâu) — 14 ngày không đủ để đánh giá một công cụ tự động hoá UI.</li>
<li><strong>Đánh giá nhà cung cấp</strong> — đào tạo, hỗ trợ và điều khoản thương mại; với mã nguồn mở: cộng đồng (hoạt động, tần suất phát hành, ai bảo trì).</li>
<li>Xác định nhu cầu <strong>kèm cặp (coaching), cố vấn (mentoring) và đào tạo</strong>, dựa trên kỹ năng test và automation của những người sẽ dùng công cụ.</li>
<li>Ưu nhược điểm của các <strong>mô hình bản quyền</strong> — thương mại (theo người dùng, theo máy, thuê bao) hay mã nguồn mở (miễn phí, nhưng trả giá bằng kỹ năng và tự hỗ trợ).</li>
<li>Ước lượng <strong>tỉ lệ chi phí-lợi ích</strong>, dựa trên một business case cụ thể.</li>
<li>Cuối cùng, <strong>đánh giá proof-of-concept (PoC)</strong> — thử công cụ trong danh sách ngắn trên <em>chính</em> ứng dụng của bạn để xác định nó có chạy được với phần mềm và hạ tầng của bạn không, và cần thay đổi gì để dùng nó.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> để ý thứ tự — PoC là bước <em>cuối</em> của việc chọn; dự án pilot (slide sau) diễn ra <em>sau khi</em> đã chọn công cụ.</p>`],
      [52, 'Pilot project — objectives (older wording)',
        `<p class="y-chinh">🎯 A pilot project exists to <strong>learn the tool</strong> and to <strong>see how it fits</strong> your processes — this slide uses the older (2011) wording.</p>
<p class="nhan">"The objectives for a pilot project for a new tool are"</p>
<ol>
<li><strong>To learn more about the tool</strong> — more detail, more depth.</li>
<li><strong>To see how the tool would fit with existing processes or documentation</strong>:
<ul>
<li>how those would need to change to work well with the tool;</li>
<li>how to use the tool to <strong>streamline existing processes</strong>.</li>
</ul></li>
</ol>
<p class="nhan">Where this list comes from</p>
<ul>
<li><strong>Older syllabus (2011)</strong> — the list continues with "decide on standard ways of using the tool" and "assess whether the benefits will be achieved at reasonable cost".</li>
<li><strong>Current list (2018)</strong> — on slide 53.</li>
</ul>`,
        `<p class="y-chinh">🎯 Dự án pilot để <strong>hiểu công cụ</strong> và <strong>xem nó khớp</strong> với quy trình ra sao — slide này dùng câu chữ cũ (2011).</p>
<p class="nhan">"Mục tiêu của dự án pilot cho một công cụ mới là"</p>
<ol>
<li><strong>Hiểu công cụ kỹ hơn</strong> — chi tiết hơn, sâu hơn.</li>
<li><strong>Xem công cụ khớp thế nào với quy trình hoặc tài liệu hiện có</strong>:
<ul>
<li>chúng phải đổi ra sao để làm việc tốt với công cụ;</li>
<li>dùng công cụ thế nào để <strong>tinh gọn quy trình hiện có</strong>.</li>
</ul></li>
</ol>
<p class="nhan">Danh sách này từ đâu ra</p>
<ul>
<li><strong>Syllabus cũ (2011)</strong> — danh sách còn tiếp "quyết định cách dùng công cụ chuẩn" và "đánh giá lợi ích có đạt được với chi phí hợp lý không".</li>
<li><strong>Danh sách hiện hành (2018)</strong> — ở slide 53.</li>
</ul>`],
      [53, 'Pilot project — primary objectives (2018)',
        `<p class="y-chinh">🎯 The current (CTFL 2018) list: a pilot project has five primary objectives.</p>
<p class="nhan">Five primary objectives</p>
<ol>
<li><strong>Gaining knowledge about the tool</strong> — in depth, understanding both its strengths and its weaknesses.</li>
<li><strong>Evaluating how the tool fits</strong> with existing processes and practices, and what would need to change.</li>
<li><strong>Deciding on standard ways</strong> of using, managing, storing and maintaining the tool and the test assets — naming conventions for files and tests, coding standards for scripts, libraries, modularity of test suites.</li>
<li><strong>Assessing whether the benefits will be achieved at reasonable cost</strong>.</li>
<li><strong>Understanding the metrics</strong> you want the tool to collect and report, and <strong>configuring the tool</strong> so these metrics can be captured and reported.</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> <em>know it, fit it, standardise it, cost it, measure it</em>.</p>
<div class="pitfall">A pilot is <strong>not</strong> "to convince management to buy the tool" and not "to train the whole organisation" — both are classic wrong options.</div>`,
        `<p class="y-chinh">🎯 Danh sách hiện hành (CTFL 2018): dự án pilot có năm mục tiêu chính.</p>
<p class="nhan">Năm mục tiêu chính</p>
<ol>
<li><strong>Có hiểu biết về công cụ</strong> — sâu, nắm cả điểm mạnh lẫn điểm yếu.</li>
<li><strong>Đánh giá độ khớp của công cụ</strong> với quy trình và thực hành hiện có, và cái gì cần thay đổi.</li>
<li><strong>Quyết định cách chuẩn</strong> để dùng, quản lý, lưu trữ và bảo trì công cụ và tài sản test — quy ước đặt tên file và test, chuẩn viết script, thư viện, cách chia module bộ test.</li>
<li><strong>Đánh giá lợi ích có đạt được với chi phí hợp lý không</strong>.</li>
<li><strong>Hiểu các số liệu</strong> muốn công cụ thu thập và báo cáo, và <strong>cấu hình công cụ</strong> để thu thập, báo cáo được các số liệu đó.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> <em>hiểu nó, khớp nó, chuẩn hoá nó, tính tiền nó, đo nó</em>.</p>
<div class="pitfall">Pilot <strong>không</strong> nhằm "thuyết phục ban giám đốc mua công cụ" và cũng không nhằm "đào tạo cả tổ chức" — hai phương án sai kinh điển.</div>`],
      [54, 'Success factors for tools',
        `<p class="y-chinh">🎯 A tool succeeds when it is rolled out step by step, with people trained, supported and its use measured.</p>
<p class="nhan">Success factors for evaluating, implementing, deploying and supporting a tool</p>
<ol>
<li><strong>Rolling out the tool to the rest of the organisation incrementally</strong> — team by team, not a "big bang".</li>
<li><strong>Adapting and improving processes</strong> to fit with the use of the tool.</li>
<li>Providing <strong>training, coaching and mentoring</strong> for tool users.</li>
<li><strong>Defining guidelines</strong> for the use of the tool (e.g. internal standards for automation).</li>
<li>Implementing a way to <strong>gather usage information</strong> from the actual use of the tool.</li>
<li><strong>Monitoring tool use and benefits</strong>.</li>
<li>Providing <strong>support</strong> to the users of a given tool.</li>
<li><strong>Gathering lessons learned</strong> from all users.</li>
</ol>
<p class="nhan">One more in the syllabus</p>
<p>Ensure the tool is <strong>technically and organisationally integrated</strong> into the software development lifecycle, which may involve separate organisations responsible for operations or third-party suppliers.</p>`,
        `<p class="y-chinh">🎯 Công cụ thành công khi được triển khai từng bước, người dùng được đào tạo, được hỗ trợ và việc dùng được đo lại.</p>
<p class="nhan">Yếu tố thành công cho việc đánh giá, cài đặt, triển khai và hỗ trợ công cụ</p>
<ol>
<li><strong>Triển khai công cụ ra phần còn lại của tổ chức theo từng bước</strong> — từng đội một, không "big bang".</li>
<li><strong>Điều chỉnh và cải tiến quy trình</strong> cho khớp với việc dùng công cụ.</li>
<li>Cung cấp <strong>đào tạo, kèm cặp và cố vấn</strong> cho người dùng công cụ.</li>
<li><strong>Định ra hướng dẫn</strong> sử dụng công cụ (vd chuẩn nội bộ cho automation).</li>
<li>Có cách <strong>thu thập thông tin sử dụng</strong> từ việc dùng công cụ thực tế.</li>
<li><strong>Giám sát việc dùng công cụ và lợi ích</strong> của nó.</li>
<li><strong>Hỗ trợ</strong> người dùng công cụ.</li>
<li><strong>Thu thập bài học kinh nghiệm</strong> từ mọi người dùng.</li>
</ol>
<p class="nhan">Syllabus thêm một ý</p>
<p>Đảm bảo công cụ được <strong>tích hợp cả về kỹ thuật lẫn tổ chức</strong> vào vòng đời phát triển phần mềm, có thể liên quan tới các tổ chức riêng phụ trách vận hành hoặc nhà cung cấp bên thứ ba.</p>`],
    ]),
    bi(`<h3>Ví dụ có lời giải · Worked example — choosing a UI-automation tool and checking the business case</h3>
<p><strong>Situation.</strong> The online-shop team of lesson 8.2 (Java back end, React front end, GitHub Actions, testers who know Java) spends <strong>40 hours</strong> of manual regression testing before every release. It short-lists three tools.</p>
<p><strong>Step 1 — objective criteria with weights</strong> (slide 50, last bullet). Score 1–5, multiply by the weight, add up:</p>
<div class="table-wrap"><table>
<thead><tr><th>Criterion</th><th>Weight</th><th>Selenium WebDriver</th><th>Playwright</th><th>Tool C (commercial record/replay suite)</th></tr></thead>
<tbody>
<tr><td>Fits our technology (React, Chrome/Safari)</td><td>0.30</td><td>4</td><td>5</td><td>3</td></tr>
<tr><td>Integrates with our CI (headless, reports)</td><td>0.20</td><td>4</td><td>5</td><td>3</td></tr>
<tr><td>Matches team skills / training need</td><td>0.20</td><td>4</td><td>3</td><td>5</td></tr>
<tr><td>Licence and total cost</td><td>0.15</td><td>5</td><td>5</td><td>2</td></tr>
<tr><td>Vendor / community support</td><td>0.15</td><td>5</td><td>4</td><td>4</td></tr>
<tr><td><strong>Weighted score</strong></td><td>1.00</td><td><strong>4.30</strong></td><td><strong>4.45</strong></td><td><strong>3.40</strong></td></tr>
</tbody>
</table></div>
<p>Check Playwright: 0.30×5 + 0.20×5 + 0.20×3 + 0.15×5 + 0.15×4 = 1.50 + 1.00 + 0.60 + 0.75 + 0.60 = <strong>4.45</strong>. (All three totals were recomputed with a small Node script: <code>Selenium 4.30 · Playwright 4.45 · Tool C 3.40</code>.) Playwright and Selenium are close — so the <strong>proof of concept</strong> (slide 51) on the real checkout page decides, not the spreadsheet.</p>
<p><strong>Step 2 — cost-benefit ratio.</strong> Estimates for automating the regression suite: build <strong>240 h</strong> once; per run <strong>4 h</strong> maintenance + <strong>1 h</strong> to analyse results, instead of 40 h manual. Automation pays for itself after <em>n</em> runs when 240 + 5n ≤ 40n, i.e. n ≥ 240 / 35 = 6.86 → <strong>7 runs</strong>.</p>
<div class="table-wrap"><table>
<thead><tr><th>Runs</th><th>Manual (40 h × n)</th><th>Automated (240 + 5 h × n)</th><th>Cheaper</th></tr></thead>
<tbody>
<tr><td>5</td><td>200 h</td><td>265 h</td><td>manual</td></tr>
<tr><td>7</td><td>280 h</td><td>275 h</td><td>automated (break-even passed)</td></tr>
<tr><td>10</td><td>400 h</td><td>290 h</td><td>automated</td></tr>
<tr><td>26 (one year of fortnightly releases)</td><td>1,040 h</td><td>370 h</td><td>automated — 670 h saved</td></tr>
</tbody>
</table></div>
<p>With a release every two weeks the break-even arrives after about 14 weeks. If the product released twice a year, 7 runs would take 3.5 years — and the UI would have changed long before: automation would not pay off. That is slide 39's risk "underestimation of time, cost and effort … for maintenance" in numbers.</p>
<p><strong>Step 3 — pilot.</strong> Automate the checkout flow of one team for two sprints, with the five pilot objectives as the pilot's exit report:</p>
<ol>
<li>What did we learn about Playwright?</li>
<li>What changed in our process?</li>
<li>Which naming and folder conventions do we adopt?</li>
<li>Was the 5 h/run estimate right?</li>
<li>Which metrics (pass rate, flaky rate, run time) does the CI report show?</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Which list is it?</strong>
<ul>
<li><strong>Selection</strong> — "evaluate the vendor", "free trial", "licensing model", "proof of concept".</li>
<li><strong>Pilot</strong> — "learn the tool in depth", "decide standard ways of using it", "assess benefits at reasonable cost", "which metrics to collect".</li>
<li><strong>Success factors</strong> — "roll out incrementally", "training and mentoring", "guidelines", "monitor use and benefits", "lessons learned from all users".</li>
</ul>
Watch for "roll out to the whole organisation at once" — the opposite of a success factor.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Total cost of ownership and open-source due diligence.</strong>
<p>The licence price is often the smallest cost. TCO =</p>
<ul>
<li>licence</li>
<li>+ infrastructure (grid machines, device farm)</li>
<li>+ training</li>
<li>+ script development</li>
<li>+ <em>maintenance over the tool's whole life</em></li>
<li>+ the cost of switching away later (vendor lock-in; proprietary script formats).</li>
</ul>
<p>For open-source tools, due diligence means:</p>
<ul>
<li><strong>Licence</strong> — Apache-2.0 and MIT are permissive; GPL has obligations when you distribute.</li>
<li><strong>Project health</strong> — the bus factor and release rhythm.</li>
<li><strong>SBOM</strong> — add the dependency to your software bill of materials so security advisories reach you.</li>
</ul>
<em>Outside the syllabus because CTFL stops at "estimate a cost-benefit ratio" and "consider licensing models".</em></div>`,
      `<h3>Ví dụ có lời giải · Chọn công cụ tự động hoá UI và kiểm tra business case</h3>
<p><strong>Tình huống.</strong> Đội shop online của bài 8.2 (back end Java, front end React, GitHub Actions, tester biết Java) tốn <strong>40 giờ</strong> regression test thủ công trước mỗi lần phát hành. Đội chọn ra ba công cụ vào danh sách ngắn.</p>
<p><strong>Bước 1 — tiêu chí khách quan có trọng số</strong> (slide 50, gạch cuối). Chấm 1–5, nhân trọng số, cộng lại:</p>
<div class="table-wrap"><table>
<thead><tr><th>Tiêu chí</th><th>Trọng số</th><th>Selenium WebDriver</th><th>Playwright</th><th>Tool C (bộ record/replay thương mại)</th></tr></thead>
<tbody>
<tr><td>Khớp công nghệ (React, Chrome/Safari)</td><td>0.30</td><td>4</td><td>5</td><td>3</td></tr>
<tr><td>Tích hợp với CI (headless, báo cáo)</td><td>0.20</td><td>4</td><td>5</td><td>3</td></tr>
<tr><td>Hợp kỹ năng đội / nhu cầu đào tạo</td><td>0.20</td><td>4</td><td>3</td><td>5</td></tr>
<tr><td>Bản quyền và tổng chi phí</td><td>0.15</td><td>5</td><td>5</td><td>2</td></tr>
<tr><td>Hỗ trợ của hãng / cộng đồng</td><td>0.15</td><td>5</td><td>4</td><td>4</td></tr>
<tr><td><strong>Điểm có trọng số</strong></td><td>1.00</td><td><strong>4.30</strong></td><td><strong>4.45</strong></td><td><strong>3.40</strong></td></tr>
</tbody>
</table></div>
<p>Kiểm Playwright: 0.30×5 + 0.20×5 + 0.20×3 + 0.15×5 + 0.15×4 = 1.50 + 1.00 + 0.60 + 0.75 + 0.60 = <strong>4.45</strong>. (Cả ba tổng đã được tính lại bằng một script Node nhỏ: <code>Selenium 4.30 · Playwright 4.45 · Tool C 3.40</code>.) Playwright và Selenium sát nhau — nên <strong>proof of concept</strong> (slide 51) trên trang checkout thật mới là thứ quyết định, không phải bảng tính.</p>
<p><strong>Bước 2 — tỉ lệ chi phí-lợi ích.</strong> Ước lượng để tự động hoá bộ regression: xây dựng <strong>240 giờ</strong> một lần; mỗi lần chạy tốn <strong>4 giờ</strong> bảo trì + <strong>1 giờ</strong> phân tích kết quả, thay cho 40 giờ làm tay. Automation hoà vốn sau <em>n</em> lần chạy khi 240 + 5n ≤ 40n, tức n ≥ 240 / 35 = 6,86 → <strong>7 lần chạy</strong>.</p>
<div class="table-wrap"><table>
<thead><tr><th>Số lần chạy</th><th>Thủ công (40 giờ × n)</th><th>Tự động (240 + 5 giờ × n)</th><th>Rẻ hơn</th></tr></thead>
<tbody>
<tr><td>5</td><td>200 giờ</td><td>265 giờ</td><td>thủ công</td></tr>
<tr><td>7</td><td>280 giờ</td><td>275 giờ</td><td>tự động (đã qua điểm hoà vốn)</td></tr>
<tr><td>10</td><td>400 giờ</td><td>290 giờ</td><td>tự động</td></tr>
<tr><td>26 (một năm phát hành hai tuần một lần)</td><td>1.040 giờ</td><td>370 giờ</td><td>tự động — tiết kiệm 670 giờ</td></tr>
</tbody>
</table></div>
<p>Phát hành hai tuần một lần thì khoảng 14 tuần là hoà vốn. Nếu sản phẩm chỉ phát hành hai lần mỗi năm, 7 lần chạy mất 3,5 năm — và UI đã đổi từ lâu trước đó: automation sẽ không có lời. Đó là rủi ro "đánh giá thấp thời gian, chi phí, công sức … bảo trì" của slide 39 viết bằng con số.</p>
<p><strong>Bước 3 — pilot.</strong> Tự động hoá luồng checkout của một đội trong hai sprint, lấy năm mục tiêu pilot làm báo cáo kết thúc pilot:</p>
<ol>
<li>Học được gì về Playwright?</li>
<li>Quy trình đổi gì?</li>
<li>Chọn quy ước đặt tên và thư mục nào?</li>
<li>Ước lượng 5 giờ/lần chạy có đúng không?</li>
<li>Báo cáo CI hiện những số liệu gì (tỉ lệ pass, tỉ lệ flaky, thời gian chạy)?</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Thuộc danh sách nào?</strong>
<ul>
<li><strong>Chọn công cụ</strong> — "đánh giá nhà cung cấp", "dùng thử miễn phí", "mô hình bản quyền", "proof of concept".</li>
<li><strong>Pilot</strong> — "hiểu sâu công cụ", "quyết định cách dùng chuẩn", "đánh giá lợi ích với chi phí hợp lý", "số liệu cần thu thập".</li>
<li><strong>Yếu tố thành công</strong> — "triển khai từng bước", "đào tạo và cố vấn", "hướng dẫn sử dụng", "giám sát việc dùng và lợi ích", "bài học từ mọi người dùng".</li>
</ul>
Cẩn thận với "triển khai cho cả tổ chức cùng lúc" — ngược hẳn với yếu tố thành công.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Tổng chi phí sở hữu và thẩm định mã nguồn mở.</strong>
<p>Giá bản quyền thường là khoản nhỏ nhất. TCO =</p>
<ul>
<li>bản quyền</li>
<li>+ hạ tầng (máy grid, trang trại thiết bị)</li>
<li>+ đào tạo</li>
<li>+ viết script</li>
<li>+ <em>bảo trì suốt đời công cụ</em></li>
<li>+ chi phí đổi sang công cụ khác về sau (khoá chặt vào nhà cung cấp; định dạng script độc quyền).</li>
</ul>
<p>Với công cụ mã nguồn mở, thẩm định nghĩa là:</p>
<ul>
<li><strong>Giấy phép</strong> — Apache-2.0 và MIT dễ dãi; GPL có nghĩa vụ khi bạn phân phối.</li>
<li><strong>Sức khoẻ dự án</strong> — "bus factor" và nhịp phát hành.</li>
<li><strong>SBOM</strong> — đưa thư viện vào danh mục thành phần phần mềm để nhận được cảnh báo bảo mật.</li>
</ul>
<em>Ngoài giáo trình vì CTFL dừng ở "ước lượng tỉ lệ chi phí-lợi ích" và "cân nhắc mô hình bản quyền".</em></div>`),
    books([
      ['fst4', 'Ch.6 §2 "Effective use of tools" — selection, pilot project, success factors, book pp.222–224 (PDF 236–238); chapter review p.225 and sample questions p.227 (answers p.253)', 'Chương 6 §2 "Effective use of tools" — chọn công cụ, pilot, yếu tố thành công, trang sách 222–224 (PDF 236–238); ôn tập chương trang 225 và câu hỏi mẫu trang 227 (đáp án trang 253)'],
      ['fst', '§6.3.1 main principles p.190 · §6.3.2 pilot project p.191 · §6.3.3 success factors p.192 · chapter review p.193', '§6.3.1 nguyên tắc chính trang 190 · §6.3.2 dự án pilot trang 191 · §6.3.3 yếu tố thành công trang 192 · ôn tập chương trang 193'],
      ['sp5', '§7.3 "Using Test Tools Effectively": 7.3.1 principles PDF 326 · 7.3.2 tool selection PDF 327 · 7.3.3 pilot project PDF 328 · 7.3.4 success factors PDF 329', '§7.3 "Using Test Tools Effectively": 7.3.1 nguyên tắc PDF 326 · 7.3.2 chọn công cụ PDF 327 · 7.3.3 dự án pilot PDF 328 · 7.3.4 yếu tố thành công PDF 329'],
      ['sp4', '§7.2 "Selection and Introduction of Test Tools": 7.2.1 cost effectiveness p.219 · 7.2.2 tool selection p.220 · 7.2.3 tool introduction p.221 (PDF 234–236)', '§7.2 "Selection and Introduction of Test Tools": 7.2.1 hiệu quả chi phí trang 219 · 7.2.2 chọn công cụ trang 220 · 7.2.3 đưa công cụ vào trang 221 (PDF 234–236)'],
    ]),
  ].join('\n'),
};

/* ─────────────── 8.5 HANDS-ON: JUnit with the course sample kit ─────────────── */
const BUILD_XML = `<pre><code>&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;project name="Lab02" default="compile" basedir="." xmlns:jacoco="antlib:org.jacoco.ant" &gt;
    &lt;property name="src.dir" value="src"/&gt;
    &lt;property name="test.dir" value="test"/&gt;
    &lt;property name="build.dir" value="build/classes"/&gt;
    &lt;property name="build.test.dir" value="build/test"/&gt;
    &lt;property name="lib.dir" value="libs/jacoco-0.8.13/lib"/&gt;
    &lt;property name="report.dir" value="report"/&gt;
    &lt;property name="jacoco.exec.file" value="jacoco.exec"/&gt;

    &lt;!-- Include the JaCoCo ANT task --&gt;
    &lt;taskdef uri="antlib:org.jacoco.ant"
             resource="org/jacoco/ant/antlib.xml"
             classpath="&#36;{lib.dir}/jacocoant.jar"/&gt;

    &lt;!-- Clean build --&gt;
    &lt;target name="clean"&gt;
        &lt;delete dir="build"/&gt;
        &lt;delete dir="&#36;{report.dir}"/&gt;
    &lt;/target&gt;

    &lt;!-- Compile source --&gt;
    &lt;target name="compile" depends="clean"&gt;
        &lt;mkdir dir="&#36;{build.dir}"/&gt;
        &lt;javac srcdir="&#36;{src.dir}" destdir="&#36;{build.dir}" encoding="UTF-8" debug="true"
               debuglevel="lines,vars,source" includeantruntime="false"/&gt;
    &lt;/target&gt;

    &lt;!-- Compile test --&gt;
    &lt;target name="compile-tests" depends="compile"&gt;
        &lt;mkdir dir="&#36;{build.dir}"/&gt;
        &lt;javac srcdir="&#36;{test.dir}" destdir="&#36;{build.dir}" encoding="UTF-8" debug="true"
               debuglevel="lines,vars,source" includeantruntime="false"&gt;
            &lt;classpath&gt;
                &lt;pathelement path="&#36;{build.dir}"/&gt;
                &lt;fileset dir="&#36;{lib.dir}" includes="**/*.jar"/&gt;
            &lt;/classpath&gt;
        &lt;/javac&gt;
    &lt;/target&gt;

    &lt;!-- Run tests with JaCoCo agent --&gt;
    &lt;target name="test-with-jacoco" depends="compile-tests"&gt;
        &lt;mkdir dir="&#36;{report.dir}"/&gt;
        &lt;jacoco:coverage destfile="&#36;{jacoco.exec.file}"&gt;
            &lt;junit printsummary="true" fork="true" haltonfailure="true" haltonerror="true" showoutput="true"&gt;
                &lt;classpath&gt;
                    &lt;pathelement path="&#36;{build.dir}"/&gt;
                    &lt;fileset dir="&#36;{lib.dir}" includes="**/*.jar"/&gt;
                &lt;/classpath&gt;
                &lt;batchtest&gt;
                    &lt;fileset dir="&#36;{test.dir}"&gt;
                        &lt;include name="**/*Test.java"/&gt;
                    &lt;/fileset&gt;
                &lt;/batchtest&gt;
            &lt;/junit&gt;
        &lt;/jacoco:coverage&gt;
    &lt;/target&gt;

    &lt;!-- Generate JaCoCo report --&gt;
    &lt;target name="jacoco-report" depends="test-with-jacoco"&gt;
        &lt;jacoco:report&gt;
            &lt;executiondata&gt;&lt;file file="&#36;{jacoco.exec.file}"/&gt;&lt;/executiondata&gt;
            &lt;structure name="J1.S.P0065"&gt;
                &lt;classfiles&gt;&lt;fileset dir="&#36;{build.dir}"/&gt;&lt;/classfiles&gt;
                &lt;sourcefiles&gt;&lt;fileset dir="&#36;{src.dir}"/&gt;&lt;/sourcefiles&gt;
            &lt;/structure&gt;
            &lt;html destdir="&#36;{report.dir}/html"/&gt;
            &lt;csv destfile="&#36;{report.dir}/coverage.csv"/&gt;
            &lt;xml destfile="&#36;{report.dir}/coverage.xml"/&gt;
        &lt;/jacoco:report&gt;
    &lt;/target&gt;
    &lt;!-- fake for stupid netbean --&gt;
    &lt;target name="test-single" depends="compile-tests"&gt;
        &lt;property name="test.class" value="lab02.utils.NumberUtilsTest"/&gt;
        &lt;jacoco:coverage destfile="&#36;{jacoco.exec.file}"&gt;
            &lt;junit printsummary="true" fork="true" haltonfailure="true" haltonerror="true" showoutput="true"&gt;
                &lt;classpath&gt; …same as above… &lt;/classpath&gt;
                &lt;formatter type="brief" usefile="false"/&gt;
                &lt;test name="&#36;{test.class}" /&gt;
            &lt;/junit&gt;
        &lt;/jacoco:coverage&gt;
    &lt;/target&gt;

    &lt;target name="debug-test" depends="compile-tests"&gt;
        &lt;jacoco:coverage destfile="&#36;{jacoco.exec.file}"&gt;
            &lt;junit printsummary="true" fork="true"&gt;
                &lt;classpath&gt; …same as above… &lt;/classpath&gt;
                &lt;test name="&#36;{test.class}"/&gt;
            &lt;/junit&gt;
        &lt;/jacoco:coverage&gt;
    &lt;/target&gt;
&lt;/project&gt;</code></pre>`;

const CALC_J4 = `<pre><code>// src/lab02/utils/Calculator.java
package lab02.utils;

public class Calculator {
    public int add(int a, int b) {
        return a + b;
    }

    public int divide(int a, int b) {
        return a / b;              // b == 0 -&gt; ArithmeticException
    }

    /** Average of two ints, rounded towards zero. */
    public int average(int a, int b) {
        return (a + b) / 2;        // defect: a + b can overflow
    }
}</code></pre>`;

const TEST_J4 = `<pre><code>// test/lab02/utils/CalculatorTest.java   (JUnit 4.13.2 — line numbers matter for the output below)
package lab02.utils;

import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Ignore;
import org.junit.Test;
import static org.junit.Assert.assertEquals;

public class CalculatorTest {
    private Calculator calc;

    @BeforeClass
    public static void initAll() {
        System.out.println("@BeforeClass: runs once, before all tests");
    }

    @Before
    public void setUp() {
        calc = new Calculator();          // fresh fixture for every test
    }

    @After
    public void tearDown() {
        calc = null;
    }

    @Test
    public void addTwoPositives() {
        assertEquals(5, calc.add(2, 3));
    }

    @Test
    public void addPositiveAndNegative() {
        assertEquals(-1, calc.add(2, -3));
    }

    @Test
    public void divideTruncatesTowardsZero() {
        assertEquals(3, calc.divide(7, 2));
    }

    @Test(expected = ArithmeticException.class)
    public void divideByZeroThrows() {
        calc.divide(1, 0);
    }

    @Test
    public void averageOfTwoMaxValues() {         // boundary value (Ch.4 BVA)
        assertEquals("average(MAX, MAX)",          // &lt;- line 50
                Integer.MAX_VALUE,
                calc.average(Integer.MAX_VALUE, Integer.MAX_VALUE));
    }

    @Ignore("square root not implemented yet")
    @Test
    public void squareRoot() {
    }
}</code></pre>`;

const RUN_J4 = `<pre><code>$ rm -rf build report
$ mkdir -p build/classes
$ javac -encoding UTF-8 -g -d build/classes $(find src -name '*.java')
$ javac -encoding UTF-8 -g -d build/classes \\
        -cp build/classes:lib/junit-4.13.2.jar:lib/hamcrest-core-1.3.jar $(find test -name '*.java')
$ find build -name '*.class'
build/classes/lab02/utils/Calculator.class
build/classes/lab02/utils/CalculatorTest.class
$ java -cp build/classes:lib/junit-4.13.2.jar:lib/hamcrest-core-1.3.jar \\
       org.junit.runner.JUnitCore lab02.utils.CalculatorTest
JUnit version 4.13.2
@BeforeClass: runs once, before all tests
...E..I
Time: 0.007
There was 1 failure:
1) averageOfTwoMaxValues(lab02.utils.CalculatorTest)
java.lang.AssertionError: average(MAX, MAX) expected:&lt;2147483647&gt; but was:&lt;-1&gt;
	at org.junit.Assert.fail(Assert.java:89)
	at org.junit.Assert.failNotEquals(Assert.java:835)
	at org.junit.Assert.assertEquals(Assert.java:647)
	at lab02.utils.CalculatorTest.averageOfTwoMaxValues(CalculatorTest.java:50)

FAILURES!!!
Tests run: 5,  Failures: 1

$ echo $?
1</code></pre>`;

const POM = `<pre><code>&lt;!-- pom.xml (Maven 3) --&gt;
&lt;project xmlns="http://maven.apache.org/POM/4.0.0" …&gt;
  &lt;modelVersion&gt;4.0.0&lt;/modelVersion&gt;
  &lt;groupId&gt;lab02&lt;/groupId&gt;
  &lt;artifactId&gt;calculator&lt;/artifactId&gt;
  &lt;version&gt;1.0&lt;/version&gt;

  &lt;properties&gt;
    &lt;maven.compiler.release&gt;17&lt;/maven.compiler.release&gt;
    &lt;project.build.sourceEncoding&gt;UTF-8&lt;/project.build.sourceEncoding&gt;
  &lt;/properties&gt;

  &lt;dependencies&gt;
    &lt;dependency&gt;                              &lt;!-- api + engine + params in one --&gt;
      &lt;groupId&gt;org.junit.jupiter&lt;/groupId&gt;
      &lt;artifactId&gt;junit-jupiter&lt;/artifactId&gt;
      &lt;version&gt;5.12.2&lt;/version&gt;
      &lt;scope&gt;test&lt;/scope&gt;
    &lt;/dependency&gt;
  &lt;/dependencies&gt;

  &lt;build&gt;
    &lt;plugins&gt;
      &lt;plugin&gt;                                &lt;!-- runs the tests in "mvn test" --&gt;
        &lt;groupId&gt;org.apache.maven.plugins&lt;/groupId&gt;
        &lt;artifactId&gt;maven-surefire-plugin&lt;/artifactId&gt;
        &lt;version&gt;3.5.3&lt;/version&gt;
      &lt;/plugin&gt;
      &lt;plugin&gt;                                &lt;!-- optional: coverage, like build.xml --&gt;
        &lt;groupId&gt;org.jacoco&lt;/groupId&gt;
        &lt;artifactId&gt;jacoco-maven-plugin&lt;/artifactId&gt;
        &lt;version&gt;0.8.13&lt;/version&gt;
        &lt;executions&gt;
          &lt;execution&gt;&lt;goals&gt;&lt;goal&gt;prepare-agent&lt;/goal&gt;&lt;/goals&gt;&lt;/execution&gt;
          &lt;execution&gt;&lt;id&gt;report&lt;/id&gt;&lt;phase&gt;test&lt;/phase&gt;&lt;goals&gt;&lt;goal&gt;report&lt;/goal&gt;&lt;/goals&gt;&lt;/execution&gt;
        &lt;/executions&gt;
      &lt;/plugin&gt;
    &lt;/plugins&gt;
  &lt;/build&gt;
&lt;/project&gt;</code></pre>`;

const TEST_J5 = `<pre><code>// src/test/java/lab02/utils/CalculatorTest.java   (JUnit 5 / Jupiter)
package lab02.utils;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import static org.junit.jupiter.api.Assertions.*;

class CalculatorTest {                       // no "public" needed any more
    private Calculator calc;

    @BeforeEach
    void setUp() {
        calc = new Calculator();
    }

    @Test
    @DisplayName("2 + 3 = 5")
    void addTwoPositives() {
        assertEquals(5, calc.add(2, 3));
    }

    @Test
    void divideByZeroThrows() {
        ArithmeticException e = assertThrows(ArithmeticException.class,
                () -&gt; calc.divide(1, 0));
        assertEquals("/ by zero", e.getMessage());
    }

    @Test
    void severalChecksAtOnce() {
        assertAll("divide",
                () -&gt; assertEquals(3, calc.divide(7, 2)),
                () -&gt; assertEquals(-3, calc.divide(-7, 2)),
                () -&gt; assertEquals(0, calc.divide(0, 5)));
    }

    @ParameterizedTest(name = "average({0}, {1}) = {2}")
    @CsvSource({
            "2, 4, 3",
            "-2, -4, -3",
            "0, 0, 0",
            "2147483647, 2147483647, 2147483647",   // boundary: MAX, MAX
            "-2147483648, -2147483648, -2147483648" // boundary: MIN, MIN
    })
    void average(int a, int b, int expected) {
        assertEquals(expected, calc.average(a, b), "average must not overflow");   // line 48
    }
}</code></pre>`;

const RUN_J5 = `<pre><code>$ mvn test          # output filtered to the interesting lines (stack traces cut)
[INFO] Running lab02.utils.CalculatorTest
[ERROR] Tests run: 8, Failures: 2, Errors: 0, Skipped: 0, Time elapsed: 0.379 s &lt;&lt;&lt; FAILURE! -- in lab02.utils.CalculatorTest
[ERROR] lab02.utils.CalculatorTest.average(int, int, int)[4] -- Time elapsed: 0.013 s &lt;&lt;&lt; FAILURE!
[ERROR] lab02.utils.CalculatorTest.average(int, int, int)[5] -- Time elapsed: 0.008 s &lt;&lt;&lt; FAILURE!
[ERROR]   CalculatorTest.average:48 average must not overflow ==&gt; expected: &lt;2147483647&gt; but was: &lt;-1&gt;
[ERROR]   CalculatorTest.average:48 average must not overflow ==&gt; expected: &lt;-2147483648&gt; but was: &lt;0&gt;
[ERROR] Tests run: 8, Failures: 2, Errors: 0, Skipped: 0
[INFO] BUILD FAILURE

# debugging: add in 64-bit, then divide
#   return (int) (((long) a + b) / 2);

$ mvn test
[INFO] Running lab02.utils.CalculatorTest
[INFO] Tests run: 8, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.474 s -- in lab02.utils.CalculatorTest
[INFO] Tests run: 8, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS

$ cat target/site/jacoco/jacoco.csv       # with the jacoco-maven-plugin added
GROUP,PACKAGE,CLASS,INSTRUCTION_MISSED,INSTRUCTION_COVERED,BRANCH_MISSED,BRANCH_COVERED,LINE_MISSED,LINE_COVERED,COMPLEXITY_MISSED,COMPLEXITY_COVERED,METHOD_MISSED,METHOD_COVERED
calculator,lab02.utils,Calculator,0,20,0,0,0,4,0,4,0,4</code></pre>`;

const L85 = {
  title: '8.5 — HANDS-ON: JUnit with the course sample kit (build.xml, JUnit 4.13.2) → JUnit 5 with Maven|||8.5 — THỰC HÀNH: JUnit với bộ mẫu của môn (build.xml, JUnit 4.13.2) → JUnit 5 với Maven',
  slug: 'swt301-junit-hands-on',
  type: 'DOCUMENT',
  description: 'Đọc build.xml mẫu của môn từng target (clean, compile, compile-tests, test-with-jacoco, jacoco-report, test-single, debug-test); chạy JUnit 4.13.2 bằng javac/java khi không có Ant (output thật, có test fail); JUnit 5 + Maven, assertThrows, @ParameterizedTest, JaCoCo; bảng chuyển JUnit 4 → 5.',
  content: [
    bi(`<span class="eyebrow">Chapter 8 · Lesson 8.5 · Hands-on — 01.Materials/04.Samples</span>
<h2>JUnit in practice: the course's own build kit</h2>
<p class="lead">The folder <em>04.Samples</em> contains exactly three files — the tool chain of Lab 2.</p>
<ul>
<li><code>build.xml</code> — an Apache Ant build script with JaCoCo coverage: a <strong>build tool</strong> that CI servers call, plus a <strong>coverage tool (D)</strong>.</li>
<li><code>junit-4.13.2.jar</code> — a <strong>unit test framework (D)</strong>.</li>
<li><code>hamcrest-core-1.3.jar</code> — the matcher library JUnit 4 needs.</li>
</ul>
<p class="ghi-chu">Tool types from lesson 8.2, slides 13, 22, 24.</p>
<p class="nhan"><strong>In this lesson you</strong></p>
<ol>
<li>Read the build file target by target.</li>
<li>Run a real JUnit 4 test suite with the two jars — including a failing test, and how the failure is reported.</li>
<li>Write the same tests in JUnit 5 with Maven and learn the JUnit 4 → 5 migration.</li>
</ol>
<div class="callout"><strong>What you will be able to do.</strong>
<ul>
<li>Explain every target of <code>build.xml</code> and the order Ant runs them.</li>
<li>Compile and run JUnit 4 tests from the command line without an IDE or Ant.</li>
<li>Read a JUnit failure report (expected/actual, line number, exit code).</li>
<li>Write JUnit 5 tests with <code>@BeforeEach</code>, <code>assertThrows</code>, <code>assertAll</code> and <code>@ParameterizedTest</code>.</li>
<li>Migrate a JUnit 4 test class.</li>
</ul>
Every output on this page was produced by really running the code (JDK 21, JUnit 4.13.2, Maven 3.9.11 with JUnit 5.12.2 and JaCoCo 0.8.13).</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">clean</div><div class="lz-t">delete build/ and report/</div><div class="lz-d">always first</div></div>
  <div class="lz-step"><div class="lz-k">→ compile</div><div class="lz-t">javac src → build/classes</div><div class="lz-d">default target</div></div>
  <div class="lz-step"><div class="lz-k">→ compile-tests</div><div class="lz-t">javac test → build/classes</div><div class="lz-d">needs JUnit on the classpath</div></div>
  <div class="lz-step"><div class="lz-k">→ test-with-jacoco</div><div class="lz-t">run **/*Test with the JaCoCo agent</div><div class="lz-d">writes jacoco.exec</div></div>
  <div class="lz-step"><div class="lz-k">→ jacoco-report</div><div class="lz-t">HTML + CSV + XML coverage</div><div class="lz-d">report/html/index.html</div></div>
</div>`,
      `<span class="eyebrow">Chương 8 · Bài 8.5 · Thực hành — 01.Materials/04.Samples</span>
<h2>JUnit thực chiến: bộ công cụ build của chính môn học</h2>
<p class="lead">Thư mục <em>04.Samples</em> có đúng ba file — bộ công cụ của Lab 2.</p>
<ul>
<li><code>build.xml</code> — script build Apache Ant có đo coverage bằng JaCoCo: một <strong>công cụ build</strong> mà CI server gọi tới, kèm một <strong>công cụ coverage (D)</strong>.</li>
<li><code>junit-4.13.2.jar</code> — một <strong>unit test framework (D)</strong>.</li>
<li><code>hamcrest-core-1.3.jar</code> — thư viện matcher mà JUnit 4 cần.</li>
</ul>
<p class="ghi-chu">Các loại công cụ ở bài 8.2, slide 13, 22, 24.</p>
<p class="nhan"><strong>Trong bài này bạn</strong></p>
<ol>
<li>Đọc file build từng target.</li>
<li>Chạy thật một bộ test JUnit 4 bằng hai file jar — có cả test fail, và cách failure được báo.</li>
<li>Viết lại các test đó bằng JUnit 5 với Maven và học cách chuyển JUnit 4 → 5.</li>
</ol>
<div class="callout"><strong>Học xong bạn làm được.</strong>
<ul>
<li>Giải thích mọi target của <code>build.xml</code> và thứ tự Ant chạy chúng.</li>
<li>Biên dịch và chạy JUnit 4 từ dòng lệnh, không cần IDE hay Ant.</li>
<li>Đọc báo cáo failure của JUnit (expected/actual, số dòng, exit code).</li>
<li>Viết test JUnit 5 với <code>@BeforeEach</code>, <code>assertThrows</code>, <code>assertAll</code> và <code>@ParameterizedTest</code>.</li>
<li>Chuyển một lớp test JUnit 4 sang JUnit 5.</li>
</ul>
Mọi output trên trang này đều do chạy code thật (JDK 21, JUnit 4.13.2, Maven 3.9.11 với JUnit 5.12.2 và JaCoCo 0.8.13).</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">clean</div><div class="lz-t">xoá build/ và report/</div><div class="lz-d">luôn chạy trước</div></div>
  <div class="lz-step"><div class="lz-k">→ compile</div><div class="lz-t">javac src → build/classes</div><div class="lz-d">target mặc định</div></div>
  <div class="lz-step"><div class="lz-k">→ compile-tests</div><div class="lz-t">javac test → build/classes</div><div class="lz-d">cần JUnit trên classpath</div></div>
  <div class="lz-step"><div class="lz-k">→ test-with-jacoco</div><div class="lz-t">chạy **/*Test kèm agent JaCoCo</div><div class="lz-d">ghi jacoco.exec</div></div>
  <div class="lz-step"><div class="lz-k">→ jacoco-report</div><div class="lz-t">coverage HTML + CSV + XML</div><div class="lz-d">report/html/index.html</div></div>
</div>`),
    bi(`<h3>1 · The kit and the project layout it expects</h3>
<table>
<thead><tr><th>File</th><th>What it is</th></tr></thead>
<tbody>
<tr><td><code>junit-4.13.2.jar</code></td><td>JUnit 4.13.2 (Feb 2021), the last release of JUnit 4: annotations <code>@Test</code>, <code>@Before</code>…, class <code>org.junit.Assert</code>, the runner <code>org.junit.runner.JUnitCore</code>.</td></tr>
<tr><td><code>hamcrest-core-1.3.jar</code></td><td>The matcher library JUnit 4 depends on (<code>assertThat(x, is(5))</code>). JUnit 4 does not start without it — keep both jars together on every classpath.</td></tr>
<tr><td><code>build.xml</code></td><td>Ant script: compile, run all <code>*Test</code> classes under the JaCoCo agent, write a coverage report. It does <em>not</em> contain the JaCoCo jars — you download JaCoCo 0.8.13 and unzip it into <code>libs/</code>.</td></tr>
</tbody>
</table>
<pre><code>Lab02/
├── build.xml
├── src/lab02/utils/Calculator.java          ← code under test   (src.dir)
├── test/lab02/utils/CalculatorTest.java     ← tests, name ends in Test   (test.dir)
├── libs/jacoco-0.8.13/lib/                  ← lib.dir: jacocoant.jar (from the JaCoCo zip)
│                                              + junit-4.13.2.jar + hamcrest-core-1.3.jar
├── build/classes/                           ← created: .class files of src AND test
├── jacoco.exec                              ← created: raw coverage data
└── report/html · coverage.csv · coverage.xml  ← created by jacoco-report</code></pre>
<h3>2 · build.xml, target by target</h3>
${BUILD_XML}
<div class="table-wrap"><table>
<thead><tr><th>Part</th><th>What it does</th><th>Things to notice</th></tr></thead>
<tbody>
<tr><td><code>&lt;project default="compile"&gt;</code></td><td>Plain <code>ant</code> runs the <code>compile</code> target. The <code>xmlns:jacoco</code> prefix lets the file use <code>&lt;jacoco:…&gt;</code> tasks.</td><td>Ant properties are immutable: the first value set wins, and a value given on the command line (<code>-Dtest.class=…</code>) beats the one in the file.</td></tr>
<tr><td><code>&lt;property&gt;</code> ×7</td><td>Names for folders and files: <code>src</code>, <code>test</code>, <code>build/classes</code>, <code>libs/jacoco-0.8.13/lib</code>, <code>report</code>, <code>jacoco.exec</code>.</td><td><code>build.test.dir</code> is declared but <strong>never used</strong> — tests are compiled into <code>build/classes</code> together with the code.</td></tr>
<tr><td><code>&lt;taskdef&gt;</code></td><td>Loads the JaCoCo Ant tasks from <code>jacocoant.jar</code>.</td><td>It is outside any target, so it runs on <em>every</em> call — if <code>jacocoant.jar</code> is missing even <code>ant clean</code> fails.</td></tr>
<tr><td><code>clean</code></td><td>Deletes <code>build/</code> and <code>report/</code>.</td><td>Does not delete <code>jacoco.exec</code>; JaCoCo appends to it by default, so old runs can mix in (delete it by hand for a clean measure).</td></tr>
<tr><td><code>compile</code> (depends on clean)</td><td><code>javac</code> of <code>src</code> into <code>build/classes</code>, UTF-8, with debug info (lines, vars, source).</td><td>Because it depends on <code>clean</code>, <strong>every compile is a full rebuild</strong>. Debug info is what lets JaCoCo and stack traces show line numbers.</td></tr>
<tr><td><code>compile-tests</code> (depends on compile)</td><td><code>javac</code> of <code>test</code>, classpath = compiled code + every jar in <code>lib.dir</code>.</td><td>That is why JUnit and Hamcrest must be copied into <code>libs/jacoco-0.8.13/lib</code>: it is the only library folder the script knows.</td></tr>
<tr><td><code>test-with-jacoco</code> (depends on compile-tests)</td><td>Runs the Ant <code>&lt;junit&gt;</code> task inside <code>&lt;jacoco:coverage&gt;</code>; <code>batchtest</code> picks every <code>**/*Test.java</code> in <code>test/</code>.</td><td><code>fork="true"</code> is required — JaCoCo attaches its agent to a new JVM. <code>haltonfailure</code>/<code>haltonerror="true"</code>: one red test ⇒ <strong>BUILD FAILED</strong> and the later targets never run. A class named <code>CalculatorTests</code> or <code>TestCalculator</code> is silently <strong>not run</strong>.</td></tr>
<tr><td><code>jacoco-report</code> (depends on test-with-jacoco)</td><td>Reads <code>jacoco.exec</code> + classes + sources and writes HTML, CSV and XML reports.</td><td>The report title <code>J1.S.P0065</code> is a LAB211 assignment code left over from the template — rename it for your project. No report if a test failed (halt on failure).</td></tr>
<tr><td><code>test-single</code></td><td>Runs one class, default <code>lab02.utils.NumberUtilsTest</code>, printing a brief result to the console.</td><td>The comment "fake for stupid netbean": NetBeans' <em>Test File</em> action calls a target with this name, so the target exists to make the IDE button work. Override the class with <code>-Dtest.class=…</code>.</td></tr>
<tr><td><code>debug-test</code></td><td>Same, without halting and without the formatter.</td><td>Has no default for <code>test.class</code> — you must pass <code>-Dtest.class=…</code>.</td></tr>
</tbody>
</table></div>
<h3>3 · The Ant commands — and their equivalents when Ant is not installed</h3>
<table>
<thead><tr><th>With Ant</th><th>What runs</th></tr></thead>
<tbody>
<tr><td><code>ant</code> or <code>ant compile</code></td><td>clean → compile</td></tr>
<tr><td><code>ant compile-tests</code></td><td>clean → compile → compile-tests</td></tr>
<tr><td><code>ant test-with-jacoco</code></td><td>… → run all *Test classes with coverage</td></tr>
<tr><td><code>ant jacoco-report</code></td><td>the whole chain; open <code>report/html/index.html</code></td></tr>
<tr><td><code>ant test-single -Dtest.class=lab02.utils.CalculatorTest</code></td><td>one test class</td></tr>
<tr><td><code>ant clean</code></td><td>delete build output</td></tr>
</tbody>
</table>
<p>Ant is <strong>not installed</strong> on the machine used to write this page (and often not on students' machines outside NetBeans), so below are the equivalent plain <code>javac</code>/<code>java</code> commands, run for real with the two jars copied into <code>lib/</code>. They do what <code>compile</code>, <code>compile-tests</code> and the test part of <code>test-with-jacoco</code> do (without coverage). On Windows, replace the classpath separator <code>:</code> by <code>;</code>.</p>`,
      `<h3>1 · Bộ mẫu và cấu trúc dự án mà nó cần</h3>
<table>
<thead><tr><th>File</th><th>Là gì</th></tr></thead>
<tbody>
<tr><td><code>junit-4.13.2.jar</code></td><td>JUnit 4.13.2 (2/2021), bản phát hành cuối của JUnit 4: annotation <code>@Test</code>, <code>@Before</code>…, lớp <code>org.junit.Assert</code>, bộ chạy <code>org.junit.runner.JUnitCore</code>.</td></tr>
<tr><td><code>hamcrest-core-1.3.jar</code></td><td>Thư viện matcher mà JUnit 4 phụ thuộc (<code>assertThat(x, is(5))</code>). Thiếu nó JUnit 4 không chạy — luôn để hai jar đi cùng nhau trên mọi classpath.</td></tr>
<tr><td><code>build.xml</code></td><td>Script Ant: biên dịch, chạy mọi lớp <code>*Test</code> dưới agent JaCoCo, ghi báo cáo coverage. File <em>không</em> kèm jar của JaCoCo — bạn tải JaCoCo 0.8.13 rồi giải nén vào <code>libs/</code>.</td></tr>
</tbody>
</table>
<pre><code>Lab02/
├── build.xml
├── src/lab02/utils/Calculator.java          ← code được test   (src.dir)
├── test/lab02/utils/CalculatorTest.java     ← test, tên kết thúc bằng Test   (test.dir)
├── libs/jacoco-0.8.13/lib/                  ← lib.dir: jacocoant.jar (trong file zip JaCoCo)
│                                              + junit-4.13.2.jar + hamcrest-core-1.3.jar
├── build/classes/                           ← sinh ra: file .class của src VÀ test
├── jacoco.exec                              ← sinh ra: dữ liệu coverage thô
└── report/html · coverage.csv · coverage.xml  ← do jacoco-report sinh ra</code></pre>
<h3>2 · build.xml, từng target một</h3>
${BUILD_XML}
<div class="table-wrap"><table>
<thead><tr><th>Phần</th><th>Làm gì</th><th>Điều cần để ý</th></tr></thead>
<tbody>
<tr><td><code>&lt;project default="compile"&gt;</code></td><td>Gõ <code>ant</code> trống là chạy target <code>compile</code>. Tiền tố <code>xmlns:jacoco</code> cho phép dùng các task <code>&lt;jacoco:…&gt;</code>.</td><td>Property của Ant không đổi được: giá trị đặt trước thắng, và giá trị truyền trên dòng lệnh (<code>-Dtest.class=…</code>) thắng giá trị trong file.</td></tr>
<tr><td><code>&lt;property&gt;</code> ×7</td><td>Đặt tên cho thư mục và file: <code>src</code>, <code>test</code>, <code>build/classes</code>, <code>libs/jacoco-0.8.13/lib</code>, <code>report</code>, <code>jacoco.exec</code>.</td><td><code>build.test.dir</code> được khai báo nhưng <strong>không bao giờ dùng</strong> — test được biên dịch chung vào <code>build/classes</code> với code.</td></tr>
<tr><td><code>&lt;taskdef&gt;</code></td><td>Nạp các task Ant của JaCoCo từ <code>jacocoant.jar</code>.</td><td>Nó nằm ngoài mọi target nên chạy ở <em>mọi</em> lệnh — thiếu <code>jacocoant.jar</code> thì ngay cả <code>ant clean</code> cũng lỗi.</td></tr>
<tr><td><code>clean</code></td><td>Xoá <code>build/</code> và <code>report/</code>.</td><td>Không xoá <code>jacoco.exec</code>; mặc định JaCoCo ghi nối vào file này, nên dữ liệu các lần chạy cũ có thể trộn vào (xoá tay nếu muốn đo sạch).</td></tr>
<tr><td><code>compile</code> (phụ thuộc clean)</td><td><code>javac</code> thư mục <code>src</code> vào <code>build/classes</code>, UTF-8, kèm thông tin debug (dòng, biến, nguồn).</td><td>Vì phụ thuộc <code>clean</code>, <strong>mỗi lần compile là build lại toàn bộ</strong>. Thông tin debug giúp JaCoCo và stack trace hiện số dòng.</td></tr>
<tr><td><code>compile-tests</code> (phụ thuộc compile)</td><td><code>javac</code> thư mục <code>test</code>, classpath = code đã biên dịch + mọi jar trong <code>lib.dir</code>.</td><td>Vì vậy JUnit và Hamcrest phải được chép vào <code>libs/jacoco-0.8.13/lib</code>: đó là thư mục thư viện duy nhất script biết.</td></tr>
<tr><td><code>test-with-jacoco</code> (phụ thuộc compile-tests)</td><td>Chạy task <code>&lt;junit&gt;</code> của Ant bên trong <code>&lt;jacoco:coverage&gt;</code>; <code>batchtest</code> lấy mọi <code>**/*Test.java</code> trong <code>test/</code>.</td><td>Bắt buộc <code>fork="true"</code> — JaCoCo gắn agent vào một JVM mới. <code>haltonfailure</code>/<code>haltonerror="true"</code>: một test đỏ ⇒ <strong>BUILD FAILED</strong> và các target sau không chạy. Lớp tên <code>CalculatorTests</code> hay <code>TestCalculator</code> sẽ <strong>bị bỏ qua im lặng</strong>.</td></tr>
<tr><td><code>jacoco-report</code> (phụ thuộc test-with-jacoco)</td><td>Đọc <code>jacoco.exec</code> + class + mã nguồn rồi ghi báo cáo HTML, CSV và XML.</td><td>Tên báo cáo <code>J1.S.P0065</code> là mã bài LAB211 còn sót từ template — đổi cho dự án của bạn. Có test fail thì không có báo cáo (dừng khi fail).</td></tr>
<tr><td><code>test-single</code></td><td>Chạy một lớp, mặc định <code>lab02.utils.NumberUtilsTest</code>, in kết quả gọn ra console.</td><td>Chú thích "fake for stupid netbean": nút <em>Test File</em> của NetBeans gọi target có tên này, nên target tồn tại để nút trong IDE hoạt động. Đổi lớp bằng <code>-Dtest.class=…</code>.</td></tr>
<tr><td><code>debug-test</code></td><td>Giống trên, không dừng khi fail và không có formatter.</td><td>Không có giá trị mặc định cho <code>test.class</code> — bắt buộc truyền <code>-Dtest.class=…</code>.</td></tr>
</tbody>
</table></div>
<h3>3 · Các lệnh Ant — và lệnh tương đương khi không có Ant</h3>
<table>
<thead><tr><th>Với Ant</th><th>Chạy những gì</th></tr></thead>
<tbody>
<tr><td><code>ant</code> hoặc <code>ant compile</code></td><td>clean → compile</td></tr>
<tr><td><code>ant compile-tests</code></td><td>clean → compile → compile-tests</td></tr>
<tr><td><code>ant test-with-jacoco</code></td><td>… → chạy mọi lớp *Test có đo coverage</td></tr>
<tr><td><code>ant jacoco-report</code></td><td>cả chuỗi; mở <code>report/html/index.html</code></td></tr>
<tr><td><code>ant test-single -Dtest.class=lab02.utils.CalculatorTest</code></td><td>một lớp test</td></tr>
<tr><td><code>ant clean</code></td><td>xoá kết quả build</td></tr>
</tbody>
</table>
<p>Máy dùng để soạn trang này <strong>không cài Ant</strong> (máy sinh viên ngoài NetBeans cũng thường không có), nên dưới đây là các lệnh <code>javac</code>/<code>java</code> thuần tương đương, đã chạy thật với hai jar chép vào <code>lib/</code>. Chúng làm đúng việc của <code>compile</code>, <code>compile-tests</code> và phần chạy test của <code>test-with-jacoco</code> (không đo coverage). Trên Windows, đổi dấu phân cách classpath <code>:</code> thành <code>;</code>.</p>`),
    bi(`<h3>4 · Ví dụ có lời giải · Worked example — JUnit 4.13.2 from the command line</h3>
<p>The class under test has three methods. <code>average</code> hides a real defect: <code>a + b</code> overflows for large values. We apply boundary value analysis (Chapter 4) and put <code>Integer.MAX_VALUE</code> in a test.</p>
${CALC_J4}
${TEST_J4}
<p><strong>Commands and real output:</strong></p>
${RUN_J4}
<p><strong>How to read it.</strong></p>
<ol>
<li><code>...E..I</code> — one character per test, in execution order: <code>.</code> a test started, <code>E</code> right after the dot of a test that failed, <code>I</code> an ignored test. (JUnit 4 does not guarantee the order of test methods; do not make tests depend on each other.)</li>
<li><code>@BeforeClass</code> printed once; <code>@Before</code>/<code>@After</code> ran around each of the 5 tests — every test gets a fresh <code>Calculator</code>.</li>
<li><code>Tests run: 5, Failures: 1</code> — the <code>@Ignore</code>d test is not counted as run. <code>divideByZeroThrows</code> passed because the exception was <em>expected</em>.</li>
<li>The failure report names the test, the <strong>message</strong> we gave, <strong>expected</strong> and <strong>actual</strong> values, and the line <code>CalculatorTest.java:50</code> in our test. JUnit 4 distinguishes a <em>failure</em> (an assertion was false) from an <em>error</em> (an unexpected exception).</li>
<li>Exit code <strong>1</strong> — this is what makes a CI server (lesson 8.6) mark the build red. With Ant the same failure would stop <code>test-with-jacoco</code> with <em>BUILD FAILED</em> (because of <code>haltonfailure="true"</code>) and no coverage report would be written.</li>
<li>Why −1? 2,147,483,647 + 2,147,483,647 wraps round to −2 in 32-bit arithmetic; −2 / 2 = −1. The test found a <strong>defect</strong> (a failure observed); <strong>debugging</strong> finds the cause and fixes it — see the JUnit 5 run below, where the fix is confirmed by re-running the tests (<strong>confirmation testing</strong>) and the other tests guard against regressions.</li>
</ol>
<h3>5 · The same tests in JUnit 5 with Maven</h3>
<p>Maven replaces both Ant and the hand-copied jars: dependencies are declared in <code>pom.xml</code> and downloaded to <code>~/.m2</code>; the Surefire plugin runs every <code>*Test</code> class during <code>mvn test</code>. Layout: <code>src/main/java</code> and <code>src/test/java</code>.</p>
${POM}
${TEST_J5}
<p><strong>Real run (Maven 3.9.11):</strong> before the fix, then after changing <code>average</code> to <code>return (int) (((long) a + b) / 2);</code>.</p>
${RUN_J5}
<p>The parameterized test counts as 5 tests (8 in total). Both boundary rows fail — <code>MIN + MIN</code> overflows too (to 0). <code>mvn -q test</code> (quiet) prints nothing on success and exits with 0; with failures it prints the <code>[ERROR]</code> block and exits with 1. JaCoCo: 20 of 20 bytecode instructions, 4 of 4 lines, 4 of 4 methods (the 4th is the default constructor) covered; there are no branches in <code>Calculator</code>, so branch counts are 0/0.</p>
<h3>6 · JUnit 4 → JUnit 5 cheat sheet and migration</h3>
<div class="table-wrap"><table>
<thead><tr><th>Purpose</th><th>JUnit 4 (<code>org.junit</code>)</th><th>JUnit 5 (<code>org.junit.jupiter.api</code>)</th></tr></thead>
<tbody>
<tr><td>Mark a test</td><td><code>@Test</code> (method must be <code>public</code>)</td><td><code>@Test</code> (package-private is fine)</td></tr>
<tr><td>Before / after every test</td><td><code>@Before</code>, <code>@After</code></td><td><code>@BeforeEach</code>, <code>@AfterEach</code></td></tr>
<tr><td>Once per class (static)</td><td><code>@BeforeClass</code>, <code>@AfterClass</code></td><td><code>@BeforeAll</code>, <code>@AfterAll</code></td></tr>
<tr><td>Skip a test</td><td><code>@Ignore</code></td><td><code>@Disabled</code></td></tr>
<tr><td>Group tests</td><td><code>@Category</code></td><td><code>@Tag</code></td></tr>
<tr><td>Expect an exception</td><td><code>@Test(expected = X.class)</code></td><td><code>assertThrows(X.class, () -&gt; …)</code> — returns the exception so you can check its message</td></tr>
<tr><td>Timeout</td><td><code>@Test(timeout = 100)</code></td><td><code>@Timeout</code> or <code>assertTimeout(…)</code></td></tr>
<tr><td>Parameterized</td><td><code>@RunWith(Parameterized.class)</code> + constructor</td><td><code>@ParameterizedTest</code> + <code>@ValueSource</code>, <code>@CsvSource</code>, <code>@MethodSource</code> (needs <code>junit-jupiter-params</code>)</td></tr>
<tr><td>Extensions</td><td><code>@RunWith</code>, <code>@Rule</code>, <code>@ClassRule</code></td><td><code>@ExtendWith</code> (e.g. <code>MockitoExtension</code>, <code>SpringExtension</code>)</td></tr>
<tr><td>Readable names</td><td>—</td><td><code>@DisplayName</code>, <code>@Nested</code> classes</td></tr>
<tr><td>Assertions class</td><td><code>org.junit.Assert</code>; message is the <strong>first</strong> parameter</td><td><code>org.junit.jupiter.api.Assertions</code>; message is the <strong>last</strong> parameter; new <code>assertAll</code>, <code>assertThrows</code></td></tr>
<tr><td><code>assertThat</code></td><td>in <code>Assert</code> (Hamcrest)</td><td>removed — use Hamcrest's <code>MatcherAssert.assertThat</code> or AssertJ</td></tr>
<tr><td>Assumptions</td><td><code>Assume</code> class</td><td><code>Assumptions</code> class; <code>assumeNotNull</code>, <code>assumeNoException</code> removed</td></tr>
<tr><td>Dependency</td><td>one jar (+ Hamcrest)</td><td>modular: <code>junit-jupiter-api</code> + <code>junit-jupiter-engine</code> (+ <code>-params</code>), or the aggregate <code>junit-jupiter</code></td></tr>
</tbody>
</table></div>
<p class="nhan"><strong>Migration steps (JUnit in Action, Table 4.1)</strong></p>
<ol>
<li><strong>Replace the dependencies</strong> — add <code>junit-vintage-engine</code> so the old JUnit 4 tests keep running on the JUnit Platform next to new Jupiter tests.</li>
<li><strong>Replace the annotations</strong> and introduce the new ones.</li>
<li><strong>Replace the testing classes and methods</strong> — assertions and assumptions moved to other classes and packages.</li>
<li><strong>Replace rules and runners with the extension model</strong> — the most effort, and it can be done last.</li>
</ol>
<p>When no JUnit 4 test is left, remove the vintage engine.</p>
<p class="ghi-chu">The book's Table 4.2 prints <code>@Disable</code>; the real annotation is <code>@Disabled</code>.</p>
<div class="pitfall co-tieu-de"><strong>The green build that tests nothing.</strong>
<ul>
<li><strong>No vintage engine</strong> — put a JUnit 4 test (<code>import org.junit.Test;</code>) in a project that has only the Jupiter engine and no <code>junit-vintage-engine</code>: Maven compiles it, finds no JUnit 5 tests and reports <em>Tests run: 0 … BUILD SUCCESS</em>.</li>
<li><strong>Wrong file pattern</strong> — an Ant <code>batchtest</code> with <code>**/*Test.java</code> ignores <code>CalculatorTests.java</code>.</li>
<li><strong>Ignored failures</strong> — <code>-Dmaven.test.failure.ignore=true</code> turns 2 failing tests into <em>BUILD SUCCESS</em> (we tried it: "Tests run: 8, Failures: 2" and still BUILD SUCCESS).</li>
</ul>
Always read the number of tests run, not only the colour.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>100&nbsp;% coverage did not find the bug — mutation testing asks the right question.</strong>
<ul>
<li><strong>The experiment</strong> — we re-ran JaCoCo on the <em>buggy</em> <code>average</code> (failures ignored so the report is written): coverage was already 4/4 lines and 17/17 instructions, 100&nbsp;%.</li>
<li><strong>The lesson</strong> — coverage only proves the lines were <em>executed</em>; the defect was found by <em>choosing</em> the boundary value.</li>
<li><strong>Mutation testing</strong> (PIT for Java, JUnit in Action §6.5) — measures test <em>strength</em> instead: it makes small changes to the code (replace <code>+</code> by <code>-</code>, <code>/ 2</code> by <code>* 2</code>…) and checks that at least one test fails for each "mutant". Surviving mutants show weak tests.</li>
<li><strong>JUnit 6</strong> — released in September 2025 (Java 17+, one version number for Platform, Jupiter and Vintage); code written for JUnit 5 Jupiter runs on it with minor changes.</li>
</ul>
<em>Outside the syllabus because CTFL treats unit test frameworks and coverage tools only as tool types.</em></div>`,
      `<h3>4 · Ví dụ có lời giải · JUnit 4.13.2 từ dòng lệnh</h3>
<p>Lớp được test có ba phương thức. <code>average</code> giấu một defect thật: <code>a + b</code> bị tràn số với giá trị lớn. Ta áp dụng phân tích giá trị biên (Chương 4) và đưa <code>Integer.MAX_VALUE</code> vào một test.</p>
${CALC_J4}
${TEST_J4}
<p><strong>Lệnh và output thật:</strong></p>
${RUN_J4}
<p><strong>Đọc output thế nào.</strong></p>
<ol>
<li><code>...E..I</code> — mỗi test một ký tự, theo thứ tự chạy: <code>.</code> một test bắt đầu, <code>E</code> ngay sau dấu chấm của test bị fail, <code>I</code> test bị bỏ qua. (JUnit 4 không đảm bảo thứ tự các phương thức test; đừng để test phụ thuộc nhau.)</li>
<li><code>@BeforeClass</code> in ra một lần; <code>@Before</code>/<code>@After</code> chạy quanh từng test trong 5 test — test nào cũng có một <code>Calculator</code> mới.</li>
<li><code>Tests run: 5, Failures: 1</code> — test <code>@Ignore</code> không được tính là đã chạy. <code>divideByZeroThrows</code> pass vì exception là điều <em>được mong đợi</em>.</li>
<li>Báo cáo failure nêu tên test, <strong>thông điệp</strong> ta đặt, giá trị <strong>expected</strong> và <strong>actual</strong>, và dòng <code>CalculatorTest.java:50</code> trong test của ta. JUnit 4 phân biệt <em>failure</em> (một assertion sai) với <em>error</em> (một exception không mong đợi).</li>
<li>Exit code <strong>1</strong> — chính điều này khiến CI server (bài 8.6) đánh dấu build đỏ. Với Ant, failure này sẽ dừng <code>test-with-jacoco</code> với <em>BUILD FAILED</em> (vì <code>haltonfailure="true"</code>) và không có báo cáo coverage nào được ghi.</li>
<li>Vì sao ra −1? 2.147.483.647 + 2.147.483.647 tràn vòng thành −2 trong số học 32-bit; −2 / 2 = −1. Test đã tìm ra <strong>defect</strong> (quan sát được một failure); <strong>debugging</strong> tìm nguyên nhân và sửa — xem lần chạy JUnit 5 bên dưới, nơi bản sửa được xác nhận bằng cách chạy lại test (<strong>confirmation testing</strong>) và các test còn lại canh chừng regression.</li>
</ol>
<h3>5 · Cùng bộ test đó bằng JUnit 5 với Maven</h3>
<p>Maven thay cho cả Ant lẫn việc chép jar bằng tay: thư viện được khai báo trong <code>pom.xml</code> và tải về <code>~/.m2</code>; plugin Surefire chạy mọi lớp <code>*Test</code> trong <code>mvn test</code>. Cấu trúc: <code>src/main/java</code> và <code>src/test/java</code>.</p>
${POM}
${TEST_J5}
<p><strong>Lần chạy thật (Maven 3.9.11):</strong> trước khi sửa, rồi sau khi đổi <code>average</code> thành <code>return (int) (((long) a + b) / 2);</code>.</p>
${RUN_J5}
<p>Test tham số hoá tính là 5 test (tổng 8). Cả hai dòng biên đều fail — <code>MIN + MIN</code> cũng tràn (thành 0). <code>mvn -q test</code> (chế độ im lặng) không in gì khi thành công và thoát với mã 0; khi có fail thì in khối <code>[ERROR]</code> và thoát với mã 1. JaCoCo: phủ 20/20 lệnh bytecode, 4/4 dòng, 4/4 phương thức (cái thứ 4 là constructor mặc định); <code>Calculator</code> không có nhánh nào nên số nhánh là 0/0.</p>
<h3>6 · Bảng tra JUnit 4 → JUnit 5 và cách chuyển</h3>
<div class="table-wrap"><table>
<thead><tr><th>Mục đích</th><th>JUnit 4 (<code>org.junit</code>)</th><th>JUnit 5 (<code>org.junit.jupiter.api</code>)</th></tr></thead>
<tbody>
<tr><td>Đánh dấu test</td><td><code>@Test</code> (phương thức phải <code>public</code>)</td><td><code>@Test</code> (package-private cũng được)</td></tr>
<tr><td>Trước / sau mỗi test</td><td><code>@Before</code>, <code>@After</code></td><td><code>@BeforeEach</code>, <code>@AfterEach</code></td></tr>
<tr><td>Một lần cho cả lớp (static)</td><td><code>@BeforeClass</code>, <code>@AfterClass</code></td><td><code>@BeforeAll</code>, <code>@AfterAll</code></td></tr>
<tr><td>Bỏ qua test</td><td><code>@Ignore</code></td><td><code>@Disabled</code></td></tr>
<tr><td>Nhóm test</td><td><code>@Category</code></td><td><code>@Tag</code></td></tr>
<tr><td>Mong đợi exception</td><td><code>@Test(expected = X.class)</code></td><td><code>assertThrows(X.class, () -&gt; …)</code> — trả về exception để kiểm tiếp thông điệp</td></tr>
<tr><td>Giới hạn thời gian</td><td><code>@Test(timeout = 100)</code></td><td><code>@Timeout</code> hoặc <code>assertTimeout(…)</code></td></tr>
<tr><td>Tham số hoá</td><td><code>@RunWith(Parameterized.class)</code> + constructor</td><td><code>@ParameterizedTest</code> + <code>@ValueSource</code>, <code>@CsvSource</code>, <code>@MethodSource</code> (cần <code>junit-jupiter-params</code>)</td></tr>
<tr><td>Mở rộng</td><td><code>@RunWith</code>, <code>@Rule</code>, <code>@ClassRule</code></td><td><code>@ExtendWith</code> (vd <code>MockitoExtension</code>, <code>SpringExtension</code>)</td></tr>
<tr><td>Tên dễ đọc</td><td>—</td><td><code>@DisplayName</code>, lớp <code>@Nested</code></td></tr>
<tr><td>Lớp assertion</td><td><code>org.junit.Assert</code>; thông điệp là tham số <strong>đầu tiên</strong></td><td><code>org.junit.jupiter.api.Assertions</code>; thông điệp là tham số <strong>cuối cùng</strong>; thêm <code>assertAll</code>, <code>assertThrows</code></td></tr>
<tr><td><code>assertThat</code></td><td>có trong <code>Assert</code> (Hamcrest)</td><td>bị bỏ — dùng <code>MatcherAssert.assertThat</code> của Hamcrest hoặc AssertJ</td></tr>
<tr><td>Assumption</td><td>lớp <code>Assume</code></td><td>lớp <code>Assumptions</code>; bỏ <code>assumeNotNull</code>, <code>assumeNoException</code></td></tr>
<tr><td>Thư viện</td><td>một jar (+ Hamcrest)</td><td>chia module: <code>junit-jupiter-api</code> + <code>junit-jupiter-engine</code> (+ <code>-params</code>), hoặc gói gộp <code>junit-jupiter</code></td></tr>
</tbody>
</table></div>
<p class="nhan"><strong>Các bước chuyển (JUnit in Action, Bảng 4.1)</strong></p>
<ol>
<li><strong>Thay thư viện</strong> — thêm <code>junit-vintage-engine</code> để các test JUnit 4 cũ vẫn chạy trên JUnit Platform cạnh các test Jupiter mới.</li>
<li><strong>Thay annotation</strong> và dùng thêm annotation mới.</li>
<li><strong>Thay các lớp và phương thức kiểm thử</strong> — assertion và assumption đã chuyển sang lớp và package khác.</li>
<li><strong>Thay rule và runner bằng mô hình extension</strong> — tốn công nhất, có thể làm sau cùng.</li>
</ol>
<p>Khi không còn test JUnit 4 nào thì bỏ vintage engine.</p>
<p class="ghi-chu">Bảng 4.2 của sách in <code>@Disable</code>; annotation thật là <code>@Disabled</code>.</p>
<div class="pitfall co-tieu-de"><strong>Build xanh mà chẳng test gì.</strong>
<ul>
<li><strong>Thiếu vintage engine</strong> — để một test JUnit 4 (<code>import org.junit.Test;</code>) trong dự án chỉ có engine Jupiter mà không có <code>junit-vintage-engine</code>: Maven vẫn biên dịch, không tìm thấy test JUnit 5 nào và báo <em>Tests run: 0 … BUILD SUCCESS</em>.</li>
<li><strong>Sai mẫu tên file</strong> — <code>batchtest</code> của Ant với <code>**/*Test.java</code> bỏ qua <code>CalculatorTests.java</code>.</li>
<li><strong>Bỏ qua failure</strong> — <code>-Dmaven.test.failure.ignore=true</code> biến 2 test fail thành <em>BUILD SUCCESS</em> (chúng tôi đã thử: "Tests run: 8, Failures: 2" mà vẫn BUILD SUCCESS).</li>
</ul>
Luôn đọc số test đã chạy, đừng chỉ nhìn màu.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Coverage 100&nbsp;% không tìm ra bug — mutation testing mới hỏi đúng câu.</strong>
<ul>
<li><strong>Thí nghiệm</strong> — chúng tôi chạy lại JaCoCo trên bản <code>average</code> <em>còn lỗi</em> (bỏ qua failure để báo cáo vẫn được ghi): coverage đã là 4/4 dòng và 17/17 lệnh, 100&nbsp;%.</li>
<li><strong>Bài học</strong> — coverage chỉ chứng minh các dòng đã được <em>chạy qua</em>; defect được tìm ra nhờ <em>chọn</em> giá trị biên.</li>
<li><strong>Mutation testing</strong> (PIT cho Java, JUnit in Action §6.5) — đo <em>độ mạnh</em> của test: nó sửa code một chút (đổi <code>+</code> thành <code>-</code>, <code>/ 2</code> thành <code>* 2</code>…) và kiểm tra với mỗi "đột biến" có ít nhất một test fail không. Đột biến sống sót cho thấy test yếu.</li>
<li><strong>JUnit 6</strong> — phát hành tháng 9/2025 (Java 17+, một số phiên bản chung cho Platform, Jupiter và Vintage); code viết cho JUnit 5 Jupiter chạy được trên nó với vài thay đổi nhỏ.</li>
</ul>
<em>Ngoài giáo trình vì CTFL chỉ coi unit test framework và công cụ coverage là các loại công cụ.</em></div>`),
    books([
      ['junit', 'Ch.2 "Exploring core JUnit": §2.1 core annotations, §2.4 assertions PDF 27, §2.8 parameterized tests PDF 38 · Ch.4 "Migrating from JUnit 4 to JUnit 5": Table 4.1 PDF 69, dependencies §4.2 PDF 70, Tables 4.2–4.4 §4.3 PDF 72 · Ch.10 "Running JUnit tests from Maven 3" PDF 193 · §6.1 measuring coverage and §6.5 mutation testing (Ch.6 from PDF 103)', 'Chương 2 "Exploring core JUnit": §2.1 annotation cốt lõi, §2.4 assertion PDF 27, §2.8 test tham số hoá PDF 38 · Chương 4 "Migrating from JUnit 4 to JUnit 5": Bảng 4.1 PDF 69, thư viện §4.2 PDF 70, Bảng 4.2–4.4 §4.3 PDF 72 · Chương 10 "Running JUnit tests from Maven 3" PDF 193 · §6.1 đo coverage và §6.5 mutation testing (Chương 6 từ PDF 103)'],
      ['fst', '§6.1.5 "Tool support for test execution and logging" (unit test frameworks, test harnesses, coverage) — p.177', '§6.1.5 "Tool support for test execution and logging" (unit test framework, test harness, coverage) — trang 177'],
      ['sp5', '§7.1.4 "Tools for Automating Dynamic Tests" — PDF 314', '§7.1.4 "Tools for Automating Dynamic Tests" — PDF 314'],
    ]),
  ].join('\n'),
};

/* ─────────────── 8.6 Test pyramid, CI & Selenium WebDriver ─────────────── */
const GHA = `<pre><code># .github/workflows/test.yml — run the JUnit 5 project of lesson 8.5 on every push
name: tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: '21'
          cache: maven
      - run: mvn -B test          # a red test =&gt; exit code 1 =&gt; job fails =&gt; merge blocked
      - uses: actions/upload-artifact@v4
        if: always()              # keep the coverage report even when tests fail
        with:
          name: coverage
          path: target/site/jacoco</code></pre>`;

const SEL = `<pre><code>// Selenium 4 + JUnit 5 — illustrative, NOT executed for this page (needs a browser and a real site)
class LoginPage {                                   // Page Object: locators live in ONE place
    private final WebDriver driver;
    private final By user = By.id("user"), pass = By.id("pass"), login = By.id("login");
    LoginPage(WebDriver driver) { this.driver = driver; }

    void open()                        { driver.get("https://shop.example/login"); }
    void loginAs(String u, String p)   {
        driver.findElement(user).sendKeys(u);
        driver.findElement(pass).sendKeys(p);
        driver.findElement(login).click();
    }
}

class LoginUiTest {
    WebDriver driver;

    @BeforeEach void start() { driver = new ChromeDriver(); }   // Selenium Manager fetches chromedriver (4.6+)
    @AfterEach  void stop()  { driver.quit(); }                  // always close the browser

    @Test
    void validUserReachesDashboard() {
        LoginPage page = new LoginPage(driver);
        page.open();
        page.loginAs("alice", "secret");
        new WebDriverWait(driver, Duration.ofSeconds(10))           // explicit wait, never Thread.sleep
                .until(ExpectedConditions.titleIs("Dashboard"));
        assertEquals("Dashboard", driver.getTitle());
    }
}</code></pre>`;

const L86 = {
  title: '8.6 — Test pyramid, continuous integration & Selenium WebDriver|||8.6 — Test pyramid, tích hợp liên tục (CI) & Selenium WebDriver',
  slug: 'swt301-ci-automation',
  type: 'VIDEO',
  description: 'Test pyramid (nhiều unit, ít E2E) và anti-pattern "ốc quế kem" có số liệu tính kiểm; CI chạy JUnit mỗi lần push (GitHub Actions), build đỏ nghĩa là gì; Selenium WebDriver: kiến trúc, locator, explicit wait, Page Object.',
  content: [
    bi(`<span class="eyebrow">Chapter 8 · Lesson 8.6 · beyond the SWT6 slides</span>
<h2>Putting automation to work: the pyramid, CI and Selenium</h2>
<p class="lead">Lessons 8.1–8.4 answered <em>which</em> tools exist and <em>how</em> to introduce them; lesson 8.5 ran a unit test framework. This lesson assembles them into what teams actually run.</p>
<ul>
<li><strong>Test pyramid</strong> — says how many tests to automate at each level.</li>
<li><strong>Continuous integration server</strong> (slide 13) — runs them on every change.</li>
<li><strong>Selenium WebDriver</strong> — the most widely used test execution tool (slide 21), for the few end-to-end tests at the top.</li>
</ul>
<div class="callout"><strong>Links to the syllabus.</strong>
<ul>
<li>CI tools (D) — group 1, SWT6 slide 13.</li>
<li>Unit test frameworks (D) and test execution tools — group 4, slides 21 and 24.</li>
<li>Benefits and risks — lesson 8.3.</li>
</ul>
The test pyramid itself is an Agile Tester topic (ISTQB Agile Tester, Chapter 3 objectives) and appears in Chapter 9.</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">UI / end-to-end (few)</span><span class="lz-lnote">Selenium, Playwright — seconds to minutes each, brittle; only critical user journeys</span></div>
  <div class="lz-layer"><span class="lz-lname">Integration / API (some)</span><span class="lz-lnote">REST Assured, Spring tests, test containers — interfaces between components</span></div>
  <div class="lz-layer"><span class="lz-lname">Unit / component (many)</span><span class="lz-lnote">JUnit + Mockito — milliseconds, run on every push, pinpoint the failing line</span></div>
</div>`,
      `<span class="eyebrow">Chương 8 · Bài 8.6 · mở rộng ngoài slide SWT6</span>
<h2>Đưa tự động hoá vào vận hành: pyramid, CI và Selenium</h2>
<p class="lead">Bài 8.1–8.4 trả lời có <em>những</em> công cụ nào và đưa chúng vào <em>thế nào</em>; bài 8.5 đã chạy một unit test framework. Bài này lắp chúng lại thành thứ các đội thật sự chạy.</p>
<ul>
<li><strong>Test pyramid</strong> — cho biết tự động hoá bao nhiêu test ở mỗi cấp.</li>
<li><strong>Server tích hợp liên tục (CI)</strong> (slide 13) — chạy chúng mỗi khi có thay đổi.</li>
<li><strong>Selenium WebDriver</strong> — công cụ thực thi test (slide 21) phổ biến nhất, cho vài test đầu-cuối ở đỉnh.</li>
</ul>
<div class="callout"><strong>Nối với syllabus.</strong>
<ul>
<li>Công cụ CI (D) — nhóm 1, SWT6 slide 13.</li>
<li>Unit test framework (D) và công cụ thực thi test — nhóm 4, slide 21 và 24.</li>
<li>Lợi ích và rủi ro — bài 8.3.</li>
</ul>
Bản thân test pyramid là chủ đề của ISTQB Agile Tester (chuẩn đầu ra Chương 3) và xuất hiện ở Chương 9.</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">UI / đầu-cuối (ít)</span><span class="lz-lnote">Selenium, Playwright — mỗi test vài giây tới vài phút, dễ gãy; chỉ hành trình người dùng trọng yếu</span></div>
  <div class="lz-layer"><span class="lz-lname">Integration / API (vừa)</span><span class="lz-lnote">REST Assured, Spring test, test container — giao diện giữa các component</span></div>
  <div class="lz-layer"><span class="lz-lname">Unit / component (nhiều)</span><span class="lz-lnote">JUnit + Mockito — mili giây, chạy mỗi lần push, chỉ đích danh dòng lỗi</span></div>
</div>`),
    bi(`<h3>1 · The test pyramid</h3>
<p>Mike Cohn's <strong>test pyramid</strong> (<em>Succeeding with Agile</em>, 2009) says: many fast, cheap tests at the bottom, fewer as you go up.</p>
<p class="nhan"><strong>Why — cost per test grows with the level</strong></p>
<ul>
<li><strong>Slower</strong> — the higher the level, the slower the test.</li>
<li><strong>More fragile</strong> — it breaks more often for reasons unrelated to the code under test (layout changes, network, test data).</li>
<li><strong>Harder to diagnose</strong> — it is harder to locate the defect when it fails.</li>
</ul>
<p class="nhan"><strong>Layers → ISTQB test levels (JUnit in Action, Ch.22)</strong></p>
<ul>
<li><strong>Unit</strong> → component testing.</li>
<li><strong>Integration</strong> → component-integration and system-integration testing.</li>
<li><strong>UI/end-to-end</strong> → system and acceptance testing.</li>
</ul>
<p>The anti-pattern is the <strong>inverted pyramid</strong> or <strong>"ice-cream cone"</strong>: mostly UI tests, often recorded with capture/replay, few unit tests. The suite becomes so slow and unreliable that the team stops trusting it — tests are disabled one by one until the green build verifies almost nothing.</p>
<h3>2 · Continuous integration — the tests on every push</h3>
<p><strong>CI</strong> is the practice of integrating code into the shared mainline <em>frequently</em> (at least daily) and having a server <em>automatically build and test</em> every change (slide 13).</p>
<p class="nhan"><strong>Practices that make it work</strong></p>
<ul>
<li><strong>Small commits</strong> — every developer commits small changes often.</li>
<li><strong>Fast feedback</strong> — the build and unit tests finish within minutes.</li>
<li><strong>Red build = first priority</strong> — it means the last change broke something, and fixing it comes first.</li>
<li><strong>No merge on red</strong> — nobody merges while the build is red.</li>
</ul>
<p>The server knows red from green through exit codes — the same <code>exit code 1</code> that JUnitCore and <code>mvn test</code> returned in lesson 8.5.</p>
${GHA}
<p>Other CI servers express the same pipeline differently (a <code>Jenkinsfile</code> for Jenkins, <code>.gitlab-ci.yml</code> for GitLab).</p>
<p class="nhan"><strong>A typical pipeline — ordered by speed, to fail fast</strong></p>
<ol>
<li>Compile</li>
<li>Static analysis</li>
<li>Unit tests + coverage</li>
<li>Integration tests</li>
<li>Deploy to a test environment</li>
<li>A small end-to-end smoke suite</li>
</ol>
<h3>3 · Selenium WebDriver</h3>
<p>Selenium WebDriver drives a <em>real</em> browser through the W3C WebDriver protocol: your test code calls the client library (Java, Python, C#, JavaScript) → a browser-specific driver (chromedriver, geckodriver) → the browser. It types, clicks and reads the page like a user — a test execution tool in the ISTQB sense, used for system/acceptance-level regression. Rules that keep Selenium tests maintainable:</p>
<ul>
<li><strong>Stable locators</strong>: prefer <code>By.id</code> or a dedicated <code>data-testid</code> attribute over long XPath expressions that break with every layout change.</li>
<li><strong>Explicit waits</strong> (<code>WebDriverWait</code> + <code>ExpectedConditions</code>) instead of <code>Thread.sleep</code>: wait for a condition, not for a guessed number of seconds.</li>
<li><strong>Page Object pattern</strong>: one class per page holds its locators and actions, so a UI change is fixed in one place — the same idea as the keyword library of lesson 8.3.</li>
<li><strong>Independent tests</strong>: each test prepares its own data and closes its browser (<code>driver.quit()</code>).</li>
</ul>
${SEL}`,
      `<h3>1 · Test pyramid</h3>
<p><strong>Test pyramid</strong> của Mike Cohn (<em>Succeeding with Agile</em>, 2009) nói: nhiều test nhanh, rẻ ở đáy, càng lên cao càng ít.</p>
<p class="nhan"><strong>Vì sao — chi phí mỗi test tăng theo cấp</strong></p>
<ul>
<li><strong>Chậm hơn</strong> — cấp càng cao, test càng chậm.</li>
<li><strong>Dễ gãy hơn</strong> — càng hay gãy vì những lý do không liên quan tới code đang test (bố cục đổi, mạng, dữ liệu test).</li>
<li><strong>Khó chẩn đoán hơn</strong> — càng khó định vị defect khi nó fail.</li>
</ul>
<p class="nhan"><strong>Các tầng → cấp test ISTQB (JUnit in Action, Chương 22)</strong></p>
<ul>
<li><strong>Unit</strong> → component testing.</li>
<li><strong>Integration</strong> → component-integration và system-integration testing.</li>
<li><strong>UI/đầu-cuối</strong> → system và acceptance testing.</li>
</ul>
<p>Anti-pattern là <strong>kim tự tháp ngược</strong> hay <strong>"ốc quế kem"</strong>: chủ yếu là UI test, thường ghi bằng capture/replay, rất ít unit test. Bộ test trở nên chậm và thiếu tin cậy tới mức đội ngừng tin nó — test bị tắt từng cái một cho tới khi build xanh gần như chẳng kiểm gì.</p>
<h3>2 · Tích hợp liên tục — test ở mỗi lần push</h3>
<p><strong>CI</strong> là thực hành tích hợp code vào nhánh chính dùng chung <em>thường xuyên</em> (ít nhất mỗi ngày) và để một server <em>tự động build và test</em> mọi thay đổi (slide 13).</p>
<p class="nhan"><strong>Những thực hành giúp nó chạy được</strong></p>
<ul>
<li><strong>Commit nhỏ</strong> — developer nào cũng commit thay đổi nhỏ và thường xuyên.</li>
<li><strong>Phản hồi nhanh</strong> — build và unit test xong trong vài phút.</li>
<li><strong>Build đỏ = ưu tiên số một</strong> — nghĩa là thay đổi vừa rồi làm hỏng thứ gì đó, và sửa nó là việc đầu tiên của đội.</li>
<li><strong>Không merge khi đỏ</strong> — không ai merge khi build đang đỏ.</li>
</ul>
<p>Server phân biệt đỏ và xanh qua exit code — đúng cái <code>exit code 1</code> mà JUnitCore và <code>mvn test</code> trả về ở bài 8.5.</p>
${GHA}
<p>CI server khác diễn tả cùng pipeline theo cách khác (<code>Jenkinsfile</code> cho Jenkins, <code>.gitlab-ci.yml</code> cho GitLab).</p>
<p class="nhan"><strong>Pipeline điển hình — xếp theo tốc độ để fail sớm</strong></p>
<ol>
<li>Biên dịch</li>
<li>Phân tích tĩnh</li>
<li>Unit test + coverage</li>
<li>Integration test</li>
<li>Deploy lên môi trường test</li>
<li>Một bộ smoke test đầu-cuối nhỏ</li>
</ol>
<h3>3 · Selenium WebDriver</h3>
<p>Selenium WebDriver điều khiển một trình duyệt <em>thật</em> qua giao thức W3C WebDriver: code test gọi thư viện client (Java, Python, C#, JavaScript) → driver riêng của trình duyệt (chromedriver, geckodriver) → trình duyệt. Nó gõ, bấm và đọc trang như người dùng — một công cụ thực thi test theo nghĩa ISTQB, dùng cho regression ở cấp system/acceptance. Các quy tắc giữ cho test Selenium dễ bảo trì:</p>
<ul>
<li><strong>Locator ổn định</strong>: ưu tiên <code>By.id</code> hoặc thuộc tính riêng <code>data-testid</code> thay cho XPath dài, thứ gãy mỗi khi bố cục đổi.</li>
<li><strong>Explicit wait</strong> (<code>WebDriverWait</code> + <code>ExpectedConditions</code>) thay cho <code>Thread.sleep</code>: chờ một điều kiện, không chờ một số giây đoán mò.</li>
<li><strong>Page Object pattern</strong>: mỗi trang một lớp giữ locator và thao tác của nó, nên UI đổi thì sửa ở một chỗ — cùng ý tưởng với thư viện keyword ở bài 8.3.</li>
<li><strong>Test độc lập</strong>: mỗi test tự chuẩn bị dữ liệu và tự đóng trình duyệt (<code>driver.quit()</code>).</li>
</ul>
${SEL}`),
    bi(`<h3>Ví dụ có lời giải · Worked example — place the tests, then count the cost</h3>
<p><strong>Part 1 — where does each test live?</strong> For the shop's discount rule ("orders ≥ 200 get 5&nbsp;% off"):</p>
<ul>
<li>"discount(200) == 190", "discount(199.99) == 199.99" and every other boundary → <strong>unit (JUnit)</strong>, dozens of them, milliseconds each.</li>
<li>"the checkout service applies the discount and sends the right amount to the payment service" → <strong>integration</strong>, a handful, with the payment service stubbed.</li>
<li>"a shopper adds items, sees the discount at checkout and pays" → <strong>one Selenium end-to-end test</strong> for the happy path.</li>
</ul>
<p><strong>Part 2 — what does the shape cost?</strong> Assume a unit test takes 0.01&nbsp;s, an integration test 0.5&nbsp;s and a UI test 30&nbsp;s, and that each UI test is flaky (fails for no code reason) 0.5&nbsp;% of the time.</p>
<div class="table-wrap"><table>
<thead><tr><th>Suite</th><th>Unit</th><th>Integration</th><th>UI</th><th>Run time</th><th>P(no flaky UI failure)</th></tr></thead>
<tbody>
<tr><td>Pyramid</td><td>1,500 × 0.01 s = 15 s</td><td>150 × 0.5 s = 75 s</td><td>15 × 30 s = 450 s</td><td><strong>540 s = 9 min</strong></td><td>0.995¹⁵ = <strong>0.9276</strong></td></tr>
<tr><td>Ice-cream cone</td><td>100 × 0.01 s = 1 s</td><td>100 × 0.5 s = 50 s</td><td>400 × 30 s = 12,000 s</td><td><strong>12,051 s ≈ 3 h 21 min</strong></td><td>0.995⁴⁰⁰ = <strong>0.1347</strong></td></tr>
</tbody>
</table></div>
<p class="ghi-chu">Numbers recomputed with a Node script: <code>healthy s 540 · cone s 12051 · P 0.9276 / 0.1347</code>.</p>
<ul>
<li><strong>Pyramid</strong> — feedback on every push in 9 minutes, and a false alarm about 1 run in 14.</li>
<li><strong>Ice-cream cone</strong> — runs once a night at best, and is red for no reason in 87&nbsp;% of runs — so people stop looking at it.</li>
</ul>
<p>That is lesson 8.3's risk "over-reliance on the tool" and "underestimated maintenance" made concrete.</p>
<div class="pitfall co-tieu-de"><strong>Common mistakes.</strong>
<ol>
<li>Testing business logic through the UI because "that is what the user sees" — test it at unit level and keep UI tests for journeys.</li>
<li><code>Thread.sleep(5000)</code> in UI tests: too short on a slow CI machine (flaky), too long everywhere else (slow).</li>
<li>Treating a red build as "someone else's problem" or re-running until it is green — every red build is either a defect or a flaky test, and both need fixing.</li>
<li>Believing CI means continuous <em>deployment</em>: CI builds and tests every change; delivery/deployment are further steps.</li>
</ol></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>The pyramid is being reshaped: the "testing trophy" and contract testing.</strong>
<ul>
<li><strong>Testing trophy</strong> — for modern web front ends Kent C. Dodds argues for a thick <em>integration</em> layer, because component-level integration tests give the best confidence per cost once UI frameworks make them cheap.</li>
<li><strong>Consumer-driven contract tests</strong> (Pact) — in microservices, teams replace slow cross-service end-to-end tests with them: each consumer–provider pair verifies a shared contract, catching interface breaks without starting the whole system.</li>
</ul>
<p>The pyramid is a heuristic, not a law — adapt the shape to your architecture, but keep the principle "push each check down to the cheapest level that can catch the defect".</p>
<em>Outside the syllabus because CTFL does not prescribe a test-portfolio shape.</em></div>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fsoftware-testing%2Flearn&reflabel=SWT301" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Write &amp; run real JUnit tests</span><span class="lc-sub">Practise @Test, assertions and @ParameterizedTest — on CodeLab.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>`,
      `<h3>Ví dụ có lời giải · Đặt test đúng tầng, rồi tính chi phí</h3>
<p><strong>Phần 1 — mỗi test nằm ở đâu?</strong> Với luật giảm giá của shop ("đơn ≥ 200 được giảm 5&nbsp;%"):</p>
<ul>
<li>"discount(200) == 190", "discount(199.99) == 199.99" và mọi biên khác → <strong>unit (JUnit)</strong>, hàng chục cái, mỗi cái vài mili giây.</li>
<li>"service checkout áp giảm giá và gửi đúng số tiền sang service thanh toán" → <strong>integration</strong>, một nhúm, service thanh toán được thay bằng stub.</li>
<li>"người mua thêm hàng, thấy giảm giá ở checkout và thanh toán" → <strong>một test Selenium đầu-cuối</strong> cho happy path.</li>
</ul>
<p><strong>Phần 2 — hình dạng bộ test tốn bao nhiêu?</strong> Giả sử một unit test mất 0,01&nbsp;s, integration test 0,5&nbsp;s, UI test 30&nbsp;s, và mỗi UI test "flaky" (fail không vì code) 0,5&nbsp;% số lần.</p>
<div class="table-wrap"><table>
<thead><tr><th>Bộ test</th><th>Unit</th><th>Integration</th><th>UI</th><th>Thời gian chạy</th><th>P(không có UI fail oan)</th></tr></thead>
<tbody>
<tr><td>Kim tự tháp</td><td>1.500 × 0,01 s = 15 s</td><td>150 × 0,5 s = 75 s</td><td>15 × 30 s = 450 s</td><td><strong>540 s = 9 phút</strong></td><td>0,995¹⁵ = <strong>0,9276</strong></td></tr>
<tr><td>Ốc quế kem</td><td>100 × 0,01 s = 1 s</td><td>100 × 0,5 s = 50 s</td><td>400 × 30 s = 12.000 s</td><td><strong>12.051 s ≈ 3 giờ 21 phút</strong></td><td>0,995⁴⁰⁰ = <strong>0,1347</strong></td></tr>
</tbody>
</table></div>
<p class="ghi-chu">Số liệu đã tính lại bằng script Node: <code>healthy s 540 · cone s 12051 · P 0.9276 / 0.1347</code>.</p>
<ul>
<li><strong>Kim tự tháp</strong> — phản hồi mỗi lần push sau 9 phút, báo động giả khoảng 1 lần trong 14 lần chạy.</li>
<li><strong>Ốc quế kem</strong> — cùng lắm chạy mỗi đêm một lần, và đỏ vô cớ ở 87&nbsp;% số lần chạy — nên mọi người thôi nhìn nó.</li>
</ul>
<p>Đó là rủi ro "quá phụ thuộc vào công cụ" và "đánh giá thấp chi phí bảo trì" của bài 8.3, viết thành con số.</p>
<div class="pitfall co-tieu-de"><strong>Lỗi thường gặp.</strong>
<ol>
<li>Test logic nghiệp vụ qua UI vì "người dùng nhìn thấy cái đó" — hãy test ở mức unit và để UI test cho các hành trình.</li>
<li><code>Thread.sleep(5000)</code> trong UI test: quá ngắn trên máy CI chậm (flaky), quá dài ở mọi nơi khác (chậm).</li>
<li>Coi build đỏ là "việc của người khác" hoặc chạy lại tới khi xanh — build đỏ nào cũng là một defect hoặc một test flaky, và cả hai đều phải sửa.</li>
<li>Tưởng CI là continuous <em>deployment</em>: CI build và test mọi thay đổi; delivery/deployment là các bước xa hơn.</li>
</ol></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Kim tự tháp đang được định hình lại: "testing trophy" và contract testing.</strong>
<ul>
<li><strong>Testing trophy</strong> — với front end web hiện đại, Kent C. Dodds ủng hộ tầng <em>integration</em> dày, vì integration test ở mức component cho niềm tin trên mỗi đồng chi phí tốt nhất khi framework UI khiến chúng rẻ.</li>
<li><strong>Consumer-driven contract test</strong> (Pact) — trong microservices, các đội dùng nó thay cho test đầu-cuối chậm xuyên nhiều service: mỗi cặp bên gọi–bên cung cấp kiểm một hợp đồng chung, bắt lỗi giao diện mà không phải dựng cả hệ thống.</li>
</ul>
<p>Kim tự tháp là heuristic, không phải luật — chỉnh hình theo kiến trúc của bạn, nhưng giữ nguyên tắc "đẩy mỗi phép kiểm xuống cấp rẻ nhất mà vẫn bắt được defect".</p>
<em>Ngoài giáo trình vì CTFL không quy định hình dạng danh mục test.</em></div>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fsoftware-testing%2Flearn&reflabel=SWT301" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Viết &amp; chạy JUnit test thật</span><span class="lc-sub">Luyện @Test, assertion và @ParameterizedTest — trên CodeLab.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>`),
    books([
      ['junit', 'Ch.13 "Continuous integration with JUnit 5" (§13.1 CI testing, §13.2 Jenkins) PDF 254 · §15.4 "Introducing Selenium" PDF 307, §15.5 "Writing Selenium tests" PDF 308 · Ch.22 "Implementing a test pyramid strategy with JUnit 5" PDF 493–534 (§22.2 unit 495, §22.3 integration 505, §22.4 system 513, §22.5 acceptance 523)', 'Chương 13 "Continuous integration with JUnit 5" (§13.1 CI testing, §13.2 Jenkins) PDF 254 · §15.4 "Introducing Selenium" PDF 307, §15.5 "Writing Selenium tests" PDF 308 · Chương 22 "Implementing a test pyramid strategy with JUnit 5" PDF 493–534 (§22.2 unit 495, §22.3 integration 505, §22.4 system 513, §22.5 acceptance 523)'],
      ['agile', 'Chapter 3 learning objectives "Recall the concepts of the test pyramid" and the testing quadrants — PDF p.19', 'Chuẩn đầu ra Chương 3 "Recall the concepts of the test pyramid" và các góc phần tư kiểm thử — PDF trang 19'],
      ['sp5', '§7.1.4 "Tools for Automating Dynamic Tests" PDF 314–320 · §7.2 benefits and risks of test automation PDF 323', '§7.1.4 "Tools for Automating Dynamic Tests" PDF 314–320 · §7.2 lợi ích và rủi ro của tự động hoá PDF 323'],
      ['fst', '§6.1.2 (continuous integration in management tools) p.171 · §6.1.5 test execution tools p.177', '§6.1.2 (tích hợp liên tục trong nhóm công cụ quản lý) trang 171 · §6.1.5 công cụ thực thi test trang 177'],
    ]),
  ].join('\n'),
};

/* ─────────────── 8.7 More from the 2023 slide set (old SWT6, 32 pages) ─────────────── */
const D2 = 'oswt6';
const L87 = {
  title: '8.7 — More from the 2023 slide set: the old tool list & introducing a tool|||8.7 — Bổ sung từ bộ slide 2023: danh sách công cụ cũ & đưa công cụ vào tổ chức',
  slug: 'swt301-ch8-slides-2023',
  type: 'VIDEO',
  description: 'SWT6 bản 2023 (32 trang): 12 loại công cụ theo cách phân loại cũ (requirements testing, static analysis, test design, test data, test running, comparison, harness & driver, performance, debugging, test management, coverage) đối chiếu sang nhóm CTFL 2018, và "đưa công cụ vào tổ chức" bản 2011 (nguyên tắc chọn, pilot, yếu tố thành công) so với bản 2018.',
  content: [
    bi(`<span class="eyebrow">Chapter 8 · Lesson 8.7 · SWT6 (2023) pages 1–32</span>
<h2>More from the 2023 slide set — the old tool list and introducing a tool</h2>
<p class="lead">Before the current <em>SWT6_tim</em> deck, SWT301 used an older 32-page deck, "ISTQB / ISEB Foundation Exam Practice — Chapter 6". About a third of it is identical to lessons 8.2–8.4. The rest teaches tools the way the <strong>older syllabi</strong> (CTFL 2005/2011) did: one page per tool type, then "introducing a tool into an organisation".</p>
<p>Old exam questions and the FE bank still use this vocabulary. So every new page is shown below, explained, and mapped to the <strong>CTFL 2018</strong> category you learned in lesson 8.2.</p>
<p class="nhan">Learning objectives</p>
<ul>
<li>Recognise the twelve tool types of the old classification and name the CTFL 2018 category of each.</li>
<li>Explain what comparison tools, harnesses and drivers, simulators, coverage instrumentation and debuggers do.</li>
<li>Compare the 2011 lists (selection principles, pilot objectives, success factors) with the 2018 lists of lesson 8.4.</li>
<li>Replace outdated words: ISEB, faults, incident management, test running tools, LCSAJ.</li>
</ul>
<p class="ghi-chu"><strong>ISEB</strong> (Information Systems Examinations Board, part of BCS in the UK) ran a software-testing Foundation certificate before ISTQB was founded in 2002, then aligned it with ISTQB. Today the exam is simply ISTQB CTFL.</p>
<h3>Old pages already taught in this chapter</h3>
<table>
<thead><tr><th>Old page</th><th>Content</th><th>Already taught in</th></tr></thead>
<tbody>
<tr><td>1</td><td>Cover "Chapter 6"</td><td>title page — nothing to learn</td></tr>
<tr><td>2, 18, 24</td><td>Contents: types of tool · effective use · introducing a tool</td><td>agenda pages; the same sections are lessons 8.1–8.4</td></tr>
<tr><td>4</td><td>Where tools fit (V-model picture)</td><td>8.2, SWT6 slide 35 — the same picture</td></tr>
<tr><td>14</td><td>Dynamic analysis tools (memory leaks, pointers)</td><td>8.2, SWT6 slide 27</td></tr>
<tr><td>19</td><td>Effective use of tools — agenda</td><td>8.3, SWT6 slide 37</td></tr>
<tr><td>20</td><td>Potential benefits of using tools</td><td>8.3, SWT6 slide 38 — identical text</td></tr>
<tr><td>21–22</td><td>Risks of using tools</td><td>8.3, SWT6 slides 39–40 — identical text</td></tr>
<tr><td>28</td><td>Pilot project — objectives 1–2</td><td>8.4, SWT6 slide 52 — identical text</td></tr>
<tr><td>32</td><td>Summary: key points</td><td>repeats the three section titles</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 8 · Bài 8.7 · SWT6 (2023) trang 1–32</span>
<h2>Bổ sung từ bộ slide 2023 — danh sách công cụ cũ và đưa công cụ vào tổ chức</h2>
<p class="lead">Trước bộ <em>SWT6_tim</em> hiện nay, SWT301 dùng một bộ slide cũ 32 trang, "ISTQB / ISEB Foundation Exam Practice — Chapter 6". Khoảng một phần ba giống hệt bài 8.2–8.4. Phần còn lại dạy công cụ theo cách của <strong>syllabus cũ</strong> (CTFL 2005/2011): mỗi trang một loại công cụ, rồi tới "đưa công cụ vào tổ chức".</p>
<p>Đề cũ và ngân hàng câu FE vẫn dùng các từ này. Vì vậy mỗi trang mới đều được hiện bên dưới, giải thích, và đối chiếu sang nhóm <strong>CTFL 2018</strong> bạn đã học ở bài 8.2.</p>
<p class="nhan">Mục tiêu bài học</p>
<ul>
<li>Nhận ra mười hai loại công cụ của cách phân loại cũ và gọi đúng tên nhóm CTFL 2018 của từng loại.</li>
<li>Giải thích comparison tool, harness và driver, simulator, cơ chế chèn mã đo coverage và debugger làm gì.</li>
<li>So các danh sách bản 2011 (nguyên tắc chọn, mục tiêu pilot, yếu tố thành công) với danh sách bản 2018 ở bài 8.4.</li>
<li>Thay các từ đã cũ: ISEB, fault, incident management, test running tool, LCSAJ.</li>
</ul>
<p class="ghi-chu"><strong>ISEB</strong> (Information Systems Examinations Board, thuộc BCS ở Anh) cấp chứng chỉ Foundation về kiểm thử từ trước khi ISTQB ra đời năm 2002, rồi chuyển sang theo ISTQB. Ngày nay kỳ thi chỉ còn tên ISTQB CTFL.</p>
<h3>Các trang cũ đã có trong chương này</h3>
<table>
<thead><tr><th>Trang cũ</th><th>Nội dung</th><th>Đã học ở</th></tr></thead>
<tbody>
<tr><td>1</td><td>Bìa "Chapter 6"</td><td>trang tiêu đề — không có gì để học</td></tr>
<tr><td>2, 18, 24</td><td>Mục lục: các loại công cụ · dùng hiệu quả · đưa công cụ vào</td><td>trang mục lục; ba phần này chính là bài 8.1–8.4</td></tr>
<tr><td>4</td><td>Where tools fit (hình chữ V)</td><td>8.2, SWT6 slide 35 — cùng một hình</td></tr>
<tr><td>14</td><td>Dynamic analysis tools (rò rỉ bộ nhớ, con trỏ)</td><td>8.2, SWT6 slide 27</td></tr>
<tr><td>19</td><td>Effective use of tools — mục lục</td><td>8.3, SWT6 slide 37</td></tr>
<tr><td>20</td><td>Lợi ích tiềm năng của công cụ</td><td>8.3, SWT6 slide 38 — y hệt chữ</td></tr>
<tr><td>21–22</td><td>Rủi ro khi dùng công cụ</td><td>8.3, SWT6 slide 39–40 — y hệt chữ</td></tr>
<tr><td>28</td><td>Dự án pilot — mục tiêu 1–2</td><td>8.4, SWT6 slide 52 — y hệt chữ</td></tr>
<tr><td>32</td><td>Summary: key points</td><td>nhắc lại ba tiêu đề phần</td></tr>
</tbody>
</table>`),
    walkHead(D2, 3, 31, 'Only the pages that add something are shown; the others are in the table above.', 'Chỉ hiện các trang có thêm nội dung; các trang còn lại nằm trong bảng ở trên.'),
    walk(D2, [
      [3, 'Testing tool classification',
        `<p class="y-chinh">🎯 The old syllabus listed twelve tool types one after another — the 2018 syllabus groups the same tools by the test activity they support.</p>
<p class="nhan">The twelve types on the page</p>
<ol class="hai-cot"><li>Requirements testing tools</li><li>Static analysis tools</li><li>Test design tools</li><li>Test data preparation tools</li><li>Test running tools — character-based, GUI</li><li>Comparison tools</li><li>Test harnesses and drivers</li><li>Performance test tools</li><li>Dynamic analysis tools</li><li>Debugging tools</li><li>Test management tools</li><li>Coverage measurement</li></ol>
<p class="nhan">How the list changed by 2018</p>
<ul>
<li><strong>Grouped by activity</strong> — six groups: management, static testing, test design &amp; implementation, execution &amp; logging, performance &amp; dynamic analysis, specialised needs (lesson 8.1, SWT6 slide 7).</li>
<li><strong>Renamed</strong> — "test running tools" became <em>test execution tools</em>; "coverage measurement" became <em>coverage tools</em>.</li>
<li><strong>Absorbed</strong> — comparison is now a feature of test execution tools.</li>
<li><strong>Dropped</strong> — debugging tools: debugging is a development activity, not testing (LO-1.1.2).</li>
<li><strong>Added</strong> — review, CI, configuration management, monitoring, model-based and TDD/ATDD/BDD tools.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> the full old → new mapping is the table at the end of this lesson.</p>`,
        `<p class="y-chinh">🎯 Syllabus cũ liệt kê mười hai loại công cụ nối nhau — syllabus 2018 gom chính các công cụ đó theo hoạt động test mà chúng hỗ trợ.</p>
<p class="nhan">Mười hai loại trên trang</p>
<ol class="hai-cot"><li>Requirements testing tools</li><li>Static analysis tools</li><li>Test design tools</li><li>Test data preparation tools</li><li>Test running tools — dạng ký tự, GUI</li><li>Comparison tools</li><li>Test harnesses and drivers</li><li>Performance test tools</li><li>Dynamic analysis tools</li><li>Debugging tools</li><li>Test management tools</li><li>Coverage measurement</li></ol>
<p class="nhan">Danh sách đã đổi thế nào tới 2018</p>
<ul>
<li><strong>Gom theo hoạt động</strong> — sáu nhóm: quản lý, kiểm thử tĩnh, thiết kế &amp; hiện thực test, thực thi &amp; ghi log, hiệu năng &amp; phân tích động, nhu cầu đặc thù (bài 8.1, SWT6 slide 7).</li>
<li><strong>Đổi tên</strong> — "test running tools" thành <em>test execution tools</em>; "coverage measurement" thành <em>coverage tools</em>.</li>
<li><strong>Gộp vào</strong> — so sánh kết quả giờ là một tính năng của test execution tool.</li>
<li><strong>Bỏ</strong> — debugging tools: debug là việc của phát triển, không phải kiểm thử (LO-1.1.2).</li>
<li><strong>Thêm</strong> — công cụ review, CI, quản lý cấu hình, giám sát, model-based và TDD/ATDD/BDD.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> bảng đối chiếu cũ → mới đầy đủ nằm ở cuối bài này.</p>`],
      [5, 'Requirements testing tools',
        `<p class="y-chinh">🎯 Requirements testing tools check a <em>model</em> of the requirements before any code exists — today that is split between requirements management and static testing of models.</p>
<p class="nhan">What the page says</p>
<ul>
<li><strong>Automated support</strong> for verification and validation of requirements models.</li>
<li><strong>Consistency checking</strong> — the tool finds contradictions and gaps, e.g. a state with no way out, or two rules that fire on the same input.</li>
<li><strong>Animation</strong> — the tool "runs" the model so a user can watch the behaviour and say "that is not what I meant" (validation).</li>
</ul>
<p class="nhan">Where it went in CTFL 2018</p>
<ul>
<li><strong>Requirements management tools</strong> — store requirements and their traceability to tests (8.2, SWT6 slide 10).</li>
<li><strong>Static testing of models</strong> — checking a model without executing code is static testing (Chapter 3).</li>
<li><strong>Model-based testing tools</strong> — reuse the model to generate tests (SWT6 slide 17).</li>
</ul>
<p class="ghi-chu">"Tool information available from": Ovum's evaluation service and the CAST report 1999 (CAST = Computer-Aided Software Testing) are sources from around 2000. Today: vendor sites, open-source communities, independent comparisons — then your own proof of concept.</p>`,
        `<p class="y-chinh">🎯 Requirements testing tool kiểm tra <em>mô hình</em> yêu cầu trước khi có dòng code nào — ngày nay phần đó chia cho quản lý yêu cầu và kiểm thử tĩnh trên mô hình.</p>
<p class="nhan">Trang nói gì</p>
<ul>
<li><strong>Hỗ trợ tự động</strong> việc verification và validation mô hình yêu cầu.</li>
<li><strong>Kiểm tra tính nhất quán</strong> — công cụ tìm chỗ mâu thuẫn và chỗ hổng, vd một trạng thái không có đường ra, hay hai luật cùng kích hoạt với một input.</li>
<li><strong>Animation</strong> — công cụ "chạy" mô hình để người dùng xem hành vi và nói "không phải ý tôi" (validation).</li>
</ul>
<p class="nhan">Trong CTFL 2018 nó nằm đâu</p>
<ul>
<li><strong>Requirements management tools</strong> — lưu yêu cầu và truy vết tới test (8.2, SWT6 slide 10).</li>
<li><strong>Kiểm thử tĩnh trên mô hình</strong> — soi mô hình mà không chạy code là kiểm thử tĩnh (Chương 3).</li>
<li><strong>Model-based testing tools</strong> — dùng lại mô hình để sinh test (SWT6 slide 17).</li>
</ul>
<p class="ghi-chu">"Tool information available from": dịch vụ đánh giá của Ovum và báo cáo CAST 1999 (CAST = Computer-Aided Software Testing) là nguồn của khoảng năm 2000. Ngày nay: trang của hãng, cộng đồng mã nguồn mở, bài so sánh độc lập — rồi proof of concept của chính bạn.</p>`],
      [6, 'Static analysis tools',
        `<p class="y-chinh">🎯 Static analysis tools examine code without running it and turn its structure into objective numbers.</p>
<ul>
<li><strong>Information about quality</strong> — the tool reports on the software itself, not on test results.</li>
<li><strong>Code is examined, not executed</strong> — that is what makes it <em>static</em>.</li>
<li><strong>Objective measures</strong> — cyclomatic complexity; also nesting levels and size.</li>
</ul>
<p class="nhan">Example — cyclomatic complexity</p>
<p>A method with one <code>if</code> and one <code>while</code> has 2 decisions, so V(G) = 2 + 1 = <strong>3</strong>: three independent paths, which basis-path testing would cover with three tests. A method scoring 25 is a warning sign — hard to test and to maintain.</p>
<p class="nhan">In CTFL 2018</p>
<p>Same name, marked <strong>(D)</strong> — mostly used by developers (8.2, SWT6 slide 15; Lab 1 in Chapter 3).</p>`,
        `<p class="y-chinh">🎯 Static analysis tool soi code mà không chạy nó, và biến cấu trúc code thành những con số khách quan.</p>
<ul>
<li><strong>Thông tin về chất lượng</strong> — công cụ báo về chính phần mềm, không phải về kết quả test.</li>
<li><strong>Code được soi, không được chạy</strong> — đó là lý do gọi là <em>tĩnh</em>.</li>
<li><strong>Số đo khách quan</strong> — cyclomatic complexity; ngoài ra độ lồng nhau (nesting level) và kích thước.</li>
</ul>
<p class="nhan">Ví dụ — cyclomatic complexity</p>
<p>Một method có một <code>if</code> và một <code>while</code> là 2 điểm quyết định, nên V(G) = 2 + 1 = <strong>3</strong>: ba đường độc lập, basis-path testing cần ba test để phủ. Method nào ra 25 là tín hiệu xấu — khó test và khó bảo trì.</p>
<p class="nhan">Trong CTFL 2018</p>
<p>Giữ nguyên tên, đánh dấu <strong>(D)</strong> — chủ yếu developer dùng (8.2, SWT6 slide 15; Lab 1 ở Chương 3).</p>`],
      [7, 'Test design tools',
        `<p class="y-chinh">🎯 Test design tools generate test inputs — from a formal specification or from the code itself.</p>
<ul>
<li><strong>From a formal specification or CASE repository</strong> — e.g. a state model stored in a CASE tool (Computer-Aided Software Engineering, the 1990s name for modelling tools such as Rational Rose).</li>
<li><strong>From code</strong> — e.g. inputs that reach code <em>not covered yet</em>.</li>
</ul>
<p class="nhan">Today's equivalents</p>
<ul>
<li><strong>Model-based testing tools</strong> — generate test cases from a model (SWT6 slides 17 and 46).</li>
<li><strong>Test design tools</strong> — e.g. pairwise generators such as Microsoft PICT (8.2, SWT6 slide 16).</li>
<li><strong>From code</strong> — generators such as EvoSuite for Java, or fuzzers that aim at uncovered branches.</li>
</ul>
<div class="pitfall">A tool can generate <em>inputs</em>, but it cannot know the correct <em>expected result</em> from the code alone — code-derived tests show what the code does, not what it should do (the test-oracle problem).</div>`,
        `<p class="y-chinh">🎯 Test design tool sinh input cho test — từ một đặc tả hình thức hoặc từ chính code.</p>
<ul>
<li><strong>Từ đặc tả hình thức hoặc kho CASE</strong> — vd một mô hình trạng thái lưu trong công cụ CASE (Computer-Aided Software Engineering, tên gọi thập niên 1990 của các công cụ mô hình hoá như Rational Rose).</li>
<li><strong>Từ code</strong> — vd input đi tới đoạn code <em>chưa được phủ</em>.</li>
</ul>
<p class="nhan">Tương đương ngày nay</p>
<ul>
<li><strong>Model-based testing tools</strong> — sinh test case từ mô hình (SWT6 slide 17 và 46).</li>
<li><strong>Test design tools</strong> — vd bộ sinh pairwise như Microsoft PICT (8.2, SWT6 slide 16).</li>
<li><strong>Từ code</strong> — bộ sinh như EvoSuite cho Java, hoặc fuzzer nhắm vào nhánh chưa phủ.</li>
</ul>
<div class="pitfall">Công cụ sinh được <em>input</em>, nhưng chỉ nhìn code thì không biết <em>kết quả mong đợi</em> đúng là gì — test sinh từ code chỉ cho thấy code đang làm gì, không cho thấy nó phải làm gì (bài toán test oracle).</div>`],
      [8, 'Test data preparation tools',
        `<p class="y-chinh">🎯 Test data preparation tools produce the data a test needs — by selecting it, generating it, or editing it from other sources.</p>
<p class="nhan">Three ways on the page</p>
<ol>
<li><strong>Selected</strong> from existing databases or files — e.g. copy 1,000 real orders from production.</li>
<li><strong>Created</strong> according to rules — e.g. 500 customers aged 18–65, each with a valid phone format.</li>
<li><strong>Edited</strong> from other sources — e.g. convert a CSV export into the new database schema.</li>
</ol>
<p class="nhan">What 2018 adds</p>
<p>Same name, now in the "test design &amp; implementation" group (SWT6 slide 18). The newer text stresses <strong>anonymising</strong> copied production data: mask names and phone numbers before they reach a test environment.</p>`,
        `<p class="y-chinh">🎯 Test data preparation tool tạo ra dữ liệu mà test cần — bằng cách chọn, sinh, hoặc chỉnh từ nguồn khác.</p>
<p class="nhan">Ba cách trên trang</p>
<ol>
<li><strong>Chọn</strong> từ database hoặc file có sẵn — vd chép 1.000 đơn hàng thật từ production.</li>
<li><strong>Tạo</strong> theo luật — vd 500 khách hàng tuổi 18–65, ai cũng có số điện thoại đúng định dạng.</li>
<li><strong>Chỉnh</strong> từ nguồn khác — vd đổi một file CSV xuất ra sang schema database mới.</li>
</ol>
<p class="nhan">Bản 2018 thêm gì</p>
<p>Giữ tên, nay nằm trong nhóm "thiết kế &amp; hiện thực test" (SWT6 slide 18). Bản mới nhấn mạnh việc <strong>ẩn danh</strong> dữ liệu chép từ production: che tên và số điện thoại trước khi đưa vào môi trường test.</p>`],
      [9, 'Test running tools 1',
        `<p class="y-chinh">🎯 A test running tool — today a <em>test execution tool</em> — drives the software the way a human tester would, from scripts.</p>
<ul>
<li><strong>Interface to the software being tested</strong> — through its UI, API or command line.</li>
<li><strong>Runs tests as though run by a human tester</strong> — enters inputs, presses buttons, reads outputs.</li>
<li><strong>Test scripts in a programmable language</strong> — e.g. Java with Selenium, TypeScript with Playwright.</li>
<li><strong>Data, inputs and expected results held in test repositories</strong> — kept apart from the script: the idea behind data-driven testing (SWT6 slide 44).</li>
<li><strong>Most often used to automate regression testing</strong> — the same checks after every change.</li>
</ul>
<p class="nhan">Outdated wording</p>
<p>"Test running tool" is now <strong>test execution tool</strong> (8.2, SWT6 slide 21). Its special considerations — capture/replay, data-driven, keyword-driven — are in lesson 8.3.</p>`,
        `<p class="y-chinh">🎯 Test running tool — nay gọi là <em>test execution tool</em> — điều khiển phần mềm như một tester thật, theo script.</p>
<ul>
<li><strong>Giao tiếp với phần mềm đang test</strong> — qua giao diện, API hoặc dòng lệnh.</li>
<li><strong>Chạy test như tester thật chạy</strong> — nhập input, bấm nút, đọc output.</li>
<li><strong>Script viết bằng ngôn ngữ lập trình</strong> — vd Java với Selenium, TypeScript với Playwright.</li>
<li><strong>Dữ liệu, input và kết quả mong đợi nằm trong kho test</strong> — tách khỏi script: chính là ý tưởng của data-driven testing (SWT6 slide 44).</li>
<li><strong>Dùng nhiều nhất để tự động hoá regression test</strong> — kiểm lại cùng một thứ sau mỗi lần sửa.</li>
</ul>
<p class="nhan">Từ đã cũ</p>
<p>"Test running tool" nay là <strong>test execution tool</strong> (8.2, SWT6 slide 21). Các lưu ý riêng của nó — capture/replay, data-driven, keyword-driven — nằm ở bài 8.3.</p>`],
      [10, 'Test running tools 2',
        `<p class="y-chinh">🎯 Two kinds of test running tool: character-based for old terminal screens, and GUI tools for windows and a mouse.</p>
<p class="nhan">Character-based</p>
<ul>
<li><strong>Simulates user interaction from dumb terminals</strong> — text-only screens attached to a mainframe, like old bank-teller screens.</li>
<li><strong>Captures keystrokes and screen responses</strong>.</li>
</ul>
<p class="nhan">GUI (Graphical User Interface)</p>
<ul>
<li><strong>Simulates interaction with WIMP applications</strong> — Windows, Icons, Mouse, Pointer.</li>
<li><strong>Captures input</strong> — mouse movement, button clicks and keyboard inputs.</li>
<li><strong>Captures output</strong> — screens, bitmaps, characters and object states.</li>
</ul>
<p class="nhan">Today</p>
<ul>
<li><strong>Character-based</strong> tools are rare outside mainframe work.</li>
<li><strong>Capturing</strong> is the capture/replay approach — fragile when the UI changes (8.3, SWT6 slide 43).</li>
<li><strong>Object states, not bitmaps</strong> — Selenium and Playwright find elements by ID or role, not by pixels, so a button that moves does not break the test.</li>
</ul>`,
        `<p class="y-chinh">🎯 Hai loại test running tool: loại ký tự cho màn hình terminal cũ, và loại GUI cho cửa sổ và chuột.</p>
<p class="nhan">Loại ký tự (character-based)</p>
<ul>
<li><strong>Giả lập người dùng trên dumb terminal</strong> — màn hình chỉ có chữ nối với máy mainframe, như màn hình giao dịch viên ngân hàng ngày trước.</li>
<li><strong>Ghi lại phím bấm và phản hồi trên màn hình</strong>.</li>
</ul>
<p class="nhan">Loại GUI (giao diện đồ hoạ)</p>
<ul>
<li><strong>Giả lập thao tác với ứng dụng WIMP</strong> — Windows, Icons, Mouse, Pointer.</li>
<li><strong>Ghi input</strong> — di chuột, bấm nút và gõ phím.</li>
<li><strong>Ghi output</strong> — màn hình, ảnh bitmap, ký tự và trạng thái đối tượng.</li>
</ul>
<p class="nhan">Ngày nay</p>
<ul>
<li><strong>Loại ký tự</strong> hiếm gặp, trừ khi làm với mainframe.</li>
<li><strong>Ghi lại thao tác</strong> chính là cách capture/replay — dễ gãy khi giao diện đổi (8.3, SWT6 slide 43).</li>
<li><strong>Trạng thái đối tượng thay cho bitmap</strong> — Selenium và Playwright tìm phần tử theo ID hoặc role, không theo điểm ảnh, nên nút bị dời chỗ không làm test gãy.</li>
</ul>`],
      [11, 'Comparison tools',
        `<p class="y-chinh">🎯 A comparison tool detects differences between actual and expected results — and must be told which differences to ignore.</p>
<ul>
<li><strong>Compares</strong> screens, characters and bitmaps.</li>
<li><strong>Masking and filtering</strong> — hides the parts that legitimately change on every run.</li>
<li><strong>Built in</strong> — test running tools normally include comparison.</li>
<li><strong>Stand-alone</strong> — separate comparators for files or databases.</li>
</ul>
<p class="nhan">Example — why masking matters</p>
<p>An invoice report contains the print date and an invoice number. Compared byte by byte with yesterday's expected file, it "fails" every day. Mask the date and the number, and the tool reports only real differences, such as a wrong total.</p>
<p class="nhan">In CTFL 2018</p>
<p>No separate category: comparing actual with expected results is a function of <strong>test execution tools</strong> (8.2, SWT6 slide 21). Today's examples: <code>assertEquals</code> in JUnit (lesson 8.5), <code>diff</code>, database-compare tools, visual-regression tools.</p>`,
        `<p class="y-chinh">🎯 Comparison tool phát hiện chỗ khác nhau giữa kết quả thực tế và kết quả mong đợi — và phải được dặn chỗ khác nào cần bỏ qua.</p>
<ul>
<li><strong>So sánh</strong> màn hình, ký tự và ảnh bitmap.</li>
<li><strong>Che và lọc (masking, filtering)</strong> — giấu những phần đổi hợp lệ sau mỗi lần chạy.</li>
<li><strong>Có sẵn bên trong</strong> — test running tool thường đã có chức năng so sánh.</li>
<li><strong>Công cụ riêng</strong> — bộ so sánh file hoặc database.</li>
</ul>
<p class="nhan">Ví dụ — vì sao cần che</p>
<p>Một báo cáo hoá đơn có ngày in và số hoá đơn. So từng byte với file mong đợi hôm qua thì ngày nào nó cũng "fail". Che ngày và số hoá đơn đi, công cụ chỉ còn báo khác biệt thật, như tổng tiền sai.</p>
<p class="nhan">Trong CTFL 2018</p>
<p>Không còn là nhóm riêng: so kết quả thực tế với mong đợi là một chức năng của <strong>test execution tool</strong> (8.2, SWT6 slide 21). Ví dụ ngày nay: <code>assertEquals</code> trong JUnit (bài 8.5), <code>diff</code>, công cụ so database, công cụ visual regression.</p>`],
      [12, 'Test harnesses and drivers',
        `<p class="y-chinh">🎯 A test harness exercises software that has no user interface yet — with drivers, stubs and, when the real world is too costly or dangerous, simulators.</p>
<ul>
<li><strong>Exercises software without a UI (yet)</strong> — e.g. a payment component called directly from test code.</li>
<li><strong>Runs groups of automated tests or comparisons</strong>.</li>
<li><strong>Often custom-built</strong> — written by the team for its own components.</li>
<li><strong>Simulators</strong> — where testing in the real environment would be too costly or dangerous.</li>
</ul>
<p class="nhan">The picture — four parts of a harness</p>
<ol>
<li><strong>Test library</strong> — the stored tests.</li>
<li><strong>Driver and stubs</strong> — the driver calls the component under test; stubs stand in for the components it calls.</li>
<li><strong>Executing test</strong> — runs the tests.</li>
<li><strong>Generating reports</strong> — records pass and fail.</li>
</ol>
<p class="nhan">Examples</p>
<ul>
<li><strong>Driver</strong> — a JUnit test class that calls <code>OrderService.checkout()</code> (lesson 8.5).</li>
<li><strong>Stub</strong> — a fake payment gateway that always answers "approved".</li>
<li><strong>Simulator</strong> — a flight simulator for avionics software, or a network simulator standing in for 10,000 phones.</li>
</ul>
<p class="ghi-chu">CTFL 2018 keeps "test harnesses (D)" in the execution &amp; logging group (8.2, SWT6 slide 23); unit test frameworks such as JUnit sit next to them (slide 24).</p>`,
        `<p class="y-chinh">🎯 Test harness chạy thử phần mềm chưa có giao diện — bằng driver, stub, và simulator khi môi trường thật quá đắt hoặc quá nguy hiểm.</p>
<ul>
<li><strong>Chạy thử phần mềm chưa có UI</strong> — vd gọi thẳng một component thanh toán từ code test.</li>
<li><strong>Chạy từng nhóm test tự động hoặc phép so sánh</strong>.</li>
<li><strong>Thường tự viết</strong> — đội tự dựng cho component của mình.</li>
<li><strong>Simulator</strong> — khi test trong môi trường thật quá tốn kém hoặc quá nguy hiểm.</li>
</ul>
<p class="nhan">Hình minh hoạ — bốn phần của một harness</p>
<ol>
<li><strong>Test library</strong> — kho test đã lưu.</li>
<li><strong>Driver và stub</strong> — driver gọi component đang test; stub đứng thay cho các component mà nó gọi tới.</li>
<li><strong>Executing test</strong> — chạy test.</li>
<li><strong>Generating reports</strong> — ghi lại pass và fail.</li>
</ol>
<p class="nhan">Ví dụ</p>
<ul>
<li><strong>Driver</strong> — một lớp test JUnit gọi <code>OrderService.checkout()</code> (bài 8.5).</li>
<li><strong>Stub</strong> — cổng thanh toán giả lúc nào cũng trả "approved".</li>
<li><strong>Simulator</strong> — buồng lái mô phỏng cho phần mềm điều khiển máy bay, hoặc bộ giả lập mạng thay cho 10.000 chiếc điện thoại.</li>
</ul>
<p class="ghi-chu">CTFL 2018 giữ "test harnesses (D)" trong nhóm thực thi &amp; ghi log (8.2, SWT6 slide 23); unit test framework như JUnit nằm ngay cạnh (slide 24).</p>`],
      [13, 'Performance testing tools',
        `<p class="y-chinh">🎯 A performance testing tool does two jobs: it generates load, and it measures how response time changes under that load.</p>
<p class="nhan">Load generation</p>
<ul>
<li><strong>Drives the application</strong> via the user interface or a test harness.</li>
<li><strong>Simulates realistic load</strong> on the system and logs the number of transactions.</li>
</ul>
<p class="nhan">Transaction measurement and reports</p>
<ul>
<li><strong>Response times</strong> for selected transactions, measured via the user interface.</li>
<li><strong>Reports based on the logs</strong> — graphs of load versus response time.</li>
</ul>
<p class="nhan">Example — reading the graph</p>
<ul>
<li><strong>100 virtual users</strong> — checkout answers in 0.8 s.</li>
<li><strong>500 users</strong> — 1.1 s.</li>
<li><strong>800 users</strong> — 6 s: the "knee" of the curve. If the requirement is "under 2 s for 600 users", run again at 600 to see which side of the knee you are on.</li>
</ul>
<p class="ghi-chu">CTFL 2018: "performance testing tools (D)", next to monitoring tools (8.2, SWT6 slides 25–26). Today: JMeter, k6, Gatling. "Performance measurement" on the old V-model picture (page 4) is the same thing.</p>`,
        `<p class="y-chinh">🎯 Performance testing tool làm hai việc: tạo tải, và đo thời gian phản hồi thay đổi ra sao dưới mức tải đó.</p>
<p class="nhan">Tạo tải</p>
<ul>
<li><strong>Điều khiển ứng dụng</strong> qua giao diện người dùng hoặc qua test harness.</li>
<li><strong>Giả lập tải thực tế</strong> lên hệ thống và ghi log số giao dịch.</li>
</ul>
<p class="nhan">Đo giao dịch và báo cáo</p>
<ul>
<li><strong>Thời gian phản hồi</strong> của các giao dịch được chọn, đo qua giao diện.</li>
<li><strong>Báo cáo dựa trên log</strong> — biểu đồ tải so với thời gian phản hồi.</li>
</ul>
<p class="nhan">Ví dụ — đọc biểu đồ</p>
<ul>
<li><strong>100 người dùng ảo</strong> — thanh toán phản hồi trong 0,8 s.</li>
<li><strong>500 người</strong> — 1,1 s.</li>
<li><strong>800 người</strong> — 6 s: "khúc gãy" của đường cong. Nếu yêu cầu là "dưới 2 s với 600 người", hãy chạy lại đúng 600 để biết mình đang ở phía nào của khúc gãy.</li>
</ul>
<p class="ghi-chu">CTFL 2018: "performance testing tools (D)", cạnh công cụ giám sát (8.2, SWT6 slide 25–26). Ngày nay: JMeter, k6, Gatling. "Performance measurement" trên hình chữ V cũ (trang 4) chính là thứ này.</p>`],
      [15, 'Debugging tools',
        `<p class="y-chinh">🎯 Debuggers help programmers find and fix the cause of a failure — which is why CTFL 2018 no longer counts them as test tools.</p>
<ul>
<li><strong>Used by programmers</strong> when investigating, fixing and testing faults.</li>
<li><strong>Reproduce faults</strong> and examine program execution in detail.</li>
<li><strong>Single-stepping</strong> — run one statement at a time.</li>
<li><strong>Breakpoints or watchpoints</strong> at any statement — stop when a line is reached, or when a variable changes.</li>
<li><strong>Examine</strong> the contents of variables and other data.</li>
</ul>
<p class="nhan">Outdated wording</p>
<ul>
<li><strong>"Faults"</strong> — CTFL 2018 says <strong>defects</strong> (error → defect → failure, Chapter 1).</li>
<li><strong>Debugging is not testing</strong> — testing shows failures; debugging finds, analyses and removes their cause (LO-1.1.2). So the 2018 classification has no "debugging tools" group.</li>
</ul>
<div class="pitfall">"What does a debugging tool do?" — locate the cause of a failure. "Find failures" is the job of testing, not of the debugger.</div>`,
        `<p class="y-chinh">🎯 Debugger giúp lập trình viên tìm và sửa nguyên nhân của failure — chính vì vậy CTFL 2018 không còn xếp nó vào công cụ test.</p>
<ul>
<li><strong>Lập trình viên dùng</strong> khi điều tra, sửa và test fault.</li>
<li><strong>Tái hiện fault</strong> và xem chi tiết chương trình chạy thế nào.</li>
<li><strong>Single-stepping</strong> — chạy từng câu lệnh một.</li>
<li><strong>Breakpoint hoặc watchpoint</strong> ở bất kỳ câu lệnh nào — dừng khi tới một dòng, hoặc khi một biến đổi giá trị.</li>
<li><strong>Xem</strong> nội dung biến và các dữ liệu khác.</li>
</ul>
<p class="nhan">Từ đã cũ</p>
<ul>
<li><strong>"Fault"</strong> — CTFL 2018 dùng <strong>defect</strong> (error → defect → failure, Chương 1).</li>
<li><strong>Debug không phải là test</strong> — test làm lộ failure; debug tìm, phân tích và gỡ nguyên nhân (LO-1.1.2). Vì thế phân loại 2018 không có nhóm "debugging tools".</li>
</ul>
<div class="pitfall">"Debugging tool làm gì?" — định vị nguyên nhân của failure. "Tìm failure" là việc của kiểm thử, không phải của debugger.</div>`],
      [16, 'Test management tools',
        `<p class="y-chinh">🎯 The old "test management tools" page bundles four jobs that CTFL 2018 spreads across the management group.</p>
<ol>
<li><strong>Management of testware</strong> — test plans, specifications, results.</li>
<li><strong>Project management of the test process</strong> — estimation, scheduling tests, logging results.</li>
<li><strong>Incident management</strong> — may include workflow facilities to track allocation, correction and retesting.</li>
<li><strong>Traceability</strong> — of tests to requirements and designs.</li>
</ol>
<p class="nhan">Where each job lives in CTFL 2018 (8.2, SWT6 slides 9–12)</p>
<ul>
<li><strong>Jobs 1–2</strong> — test management tools and ALM tools.</li>
<li><strong>Job 3</strong> — <strong>defect management tools</strong>, e.g. Jira.</li>
<li><strong>Job 4</strong> — requirements management tools, linked to the test management tool.</li>
</ul>
<div class="pitfall">"Incident" is old wording. CTFL 2018 says <strong>defect management</strong> and <strong>defect report</strong> (Chapter 7). An "incident" was any unexpected event that needed investigation — it could turn out not to be a defect at all.</div>`,
        `<p class="y-chinh">🎯 Trang "test management tools" cũ gói bốn việc mà CTFL 2018 chia ra khắp nhóm quản lý.</p>
<ol>
<li><strong>Quản lý testware</strong> — test plan, đặc tả, kết quả.</li>
<li><strong>Quản lý dự án cho quy trình test</strong> — ước lượng, lên lịch test, ghi kết quả.</li>
<li><strong>Quản lý incident</strong> — có thể có workflow để theo dõi việc giao, sửa và test lại.</li>
<li><strong>Truy vết</strong> — từ test tới yêu cầu và thiết kế.</li>
</ol>
<p class="nhan">Mỗi việc nằm đâu trong CTFL 2018 (8.2, SWT6 slide 9–12)</p>
<ul>
<li><strong>Việc 1–2</strong> — test management tool và ALM tool.</li>
<li><strong>Việc 3</strong> — <strong>defect management tool</strong>, vd Jira.</li>
<li><strong>Việc 4</strong> — requirements management tool, nối với test management tool.</li>
</ul>
<div class="pitfall">"Incident" là từ cũ. CTFL 2018 dùng <strong>defect management</strong> và <strong>defect report</strong> (Chương 7). "Incident" là mọi sự kiện bất thường cần điều tra — điều tra xong có khi lại không phải defect.</div>`],
      [17, 'Coverage measurement tools',
        `<p class="y-chinh">🎯 A coverage tool instruments the code, runs the tests through it, and reports which parts of the structure were — and were not — executed.</p>
<p class="nhan">How it works, in order</p>
<ol>
<li><strong>Instrument</strong> — the code is instrumented in a static analysis pass: counters are inserted at statements and branches.</li>
<li><strong>Run</strong> — the tests are run through the instrumented code.</li>
<li><strong>Report</strong> — what has and has not been covered, line by line, plus summary statistics.</li>
</ol>
<p class="nhan">Types of coverage on the page</p>
<ul>
<li><strong>Statement</strong> and <strong>branch (decision)</strong> — the two in CTFL 2018 (Chapter 6).</li>
<li><strong>Condition</strong> — each Boolean sub-condition evaluated true and false; Advanced level.</li>
<li><strong>LCSAJ</strong> — "linear code sequence and jump": a run of straight-line code followed by a jump. From older standards (BS 7925-2); no longer in the syllabus.</li>
</ul>
<p class="nhan">Example</p>
<p>JaCoCo inserts probes into the bytecode (lesson 8.5). A report such as "Lines 17/20, Branches 5/8" means 3 lines and 3 branch outcomes were never executed — look at them before writing more tests.</p>
<p class="ghi-chu">CTFL 2018 name: <strong>coverage tools (D)</strong> (8.2, SWT6 slide 22). Instrumentation makes them intrusive — the probe effect of lesson 8.1.</p>`,
        `<p class="y-chinh">🎯 Coverage tool chèn mã đo vào code, chạy test qua đó, rồi báo phần nào của cấu trúc đã — và chưa — được chạy.</p>
<p class="nhan">Cách làm, theo thứ tự</p>
<ol>
<li><strong>Chèn mã đo</strong> — code được chèn mã đo (instrument) trong một lượt phân tích tĩnh: đặt bộ đếm ở các câu lệnh và nhánh.</li>
<li><strong>Chạy</strong> — test được chạy qua bản code đã chèn.</li>
<li><strong>Báo cáo</strong> — cái gì đã phủ, cái gì chưa, theo từng dòng, kèm số liệu tổng.</li>
</ol>
<p class="nhan">Các loại coverage trên trang</p>
<ul>
<li><strong>Statement</strong> và <strong>branch (decision)</strong> — hai loại có trong CTFL 2018 (Chương 6).</li>
<li><strong>Condition</strong> — mỗi điều kiện con nhận cả true và false; thuộc cấp Advanced.</li>
<li><strong>LCSAJ</strong> — "linear code sequence and jump": một đoạn code chạy thẳng rồi tới một cú nhảy. Có trong chuẩn cũ (BS 7925-2); không còn trong syllabus.</li>
</ul>
<p class="nhan">Ví dụ</p>
<p>JaCoCo chèn probe vào bytecode (bài 8.5). Một báo cáo kiểu "Lines 17/20, Branches 5/8" nghĩa là còn 3 dòng và 3 kết quả nhánh chưa bao giờ chạy — hãy xem chúng trước khi viết thêm test.</p>
<p class="ghi-chu">Tên trong CTFL 2018: <strong>coverage tools (D)</strong> (8.2, SWT6 slide 22). Việc chèn mã đo khiến chúng xâm lấn — chính là probe effect ở bài 8.1.</p>`],
      [23, 'Special considerations for some types of tools',
        `<p class="y-chinh">🎯 The old list had four tool types that need special care; CTFL 2018 keeps only two of them (LO-6.1.3).</p>
<p class="nhan">The four on the page</p>
<ol>
<li><strong>Test execution tools</strong> — kept in 2018 (8.3, SWT6 slides 42–46).</li>
<li><strong>Performance testing tools</strong> — no longer on this list in 2018.</li>
<li><strong>Static analysis tools</strong> — no longer on this list in 2018.</li>
<li><strong>Test management tools</strong> — kept in 2018 (8.3, SWT6 slide 47).</li>
</ol>
<p class="nhan">What the older syllabi (2007/2011) said about the two dropped ones</p>
<ul>
<li><strong>Performance testing tools</strong> — you need someone with performance-testing expertise to design the load and interpret the results.</li>
<li><strong>Static analysis tools</strong> — run on existing code, they can produce a huge number of warnings. Introduce them gradually: filter some messages at first, and apply the rules to new code first.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> for the 2018 exam, "special considerations" means test <em>execution</em> and test <em>management</em> tools — nothing else.</p>`,
        `<p class="y-chinh">🎯 Danh sách cũ có bốn loại công cụ cần lưu ý riêng; CTFL 2018 chỉ giữ hai (LO-6.1.3).</p>
<p class="nhan">Bốn loại trên trang</p>
<ol>
<li><strong>Test execution tools</strong> — còn trong bản 2018 (8.3, SWT6 slide 42–46).</li>
<li><strong>Performance testing tools</strong> — bản 2018 không còn đưa vào danh sách này.</li>
<li><strong>Static analysis tools</strong> — bản 2018 không còn đưa vào danh sách này.</li>
<li><strong>Test management tools</strong> — còn trong bản 2018 (8.3, SWT6 slide 47).</li>
</ol>
<p class="nhan">Syllabus cũ (2007/2011) nói gì về hai loại bị bỏ</p>
<ul>
<li><strong>Performance testing tools</strong> — cần người có chuyên môn test hiệu năng để thiết kế tải và đọc kết quả.</li>
<li><strong>Static analysis tools</strong> — chạy trên code có sẵn thì có thể ra hàng nghìn cảnh báo. Đưa vào từ từ: lúc đầu lọc bớt một số thông báo, và áp luật cho code mới trước.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> với đề 2018, "special considerations" chỉ là công cụ <em>thực thi</em> test và công cụ <em>quản lý</em> test — không có gì khác.</p>`],
      [25, 'Introducing a tool into an organization — objectives',
        `<p class="y-chinh">🎯 The three objectives of the old section "Introducing a tool into an organisation" — today section 6.2, "Effective use of tools".</p>
<ol>
<li><strong>State the main principles</strong> of introducing a tool into an organisation.</li>
<li><strong>State the goals of a proof-of-concept</strong> for tool evaluation and of a <strong>piloting phase</strong> for tool implementation.</li>
<li><strong>Recognise that factors other than simply acquiring a tool</strong> are required for good tool support.</li>
</ol>
<p class="nhan">2011 → 2018</p>
<ul>
<li><strong>Objective 1</strong> → LO-6.2.1, identify the main principles for selecting a tool (K1).</li>
<li><strong>Objective 2</strong> → LO-6.2.2, recall the objectives for using pilot projects (K1).</li>
<li><strong>Objective 3</strong> → LO-6.2.3, the success factors (K1).</li>
</ul>
<p class="nhan">Proof of concept vs pilot — do not mix them up</p>
<ul>
<li><strong>Proof of concept</strong> — <em>before</em> buying: does the tool work on our application and meet our requirements? Part of selection (SWT6 slide 51).</li>
<li><strong>Pilot project</strong> — <em>after</em> choosing: use it on one small real project to learn it, fit the process, set standards and check cost against benefit (SWT6 slides 52–53).</li>
</ul>`,
        `<p class="y-chinh">🎯 Ba mục tiêu của phần cũ "Đưa công cụ vào tổ chức" — ngày nay là mục 6.2, "Dùng công cụ hiệu quả".</p>
<ol>
<li><strong>Nêu các nguyên tắc chính</strong> khi đưa một công cụ vào tổ chức.</li>
<li><strong>Nêu mục tiêu của proof-of-concept</strong> khi đánh giá công cụ và của <strong>giai đoạn pilot</strong> khi triển khai.</li>
<li><strong>Nhận ra rằng chỉ mua công cụ thôi là chưa đủ</strong> — cần thêm nhiều yếu tố khác mới có hỗ trợ tốt.</li>
</ol>
<p class="nhan">2011 → 2018</p>
<ul>
<li><strong>Mục tiêu 1</strong> → LO-6.2.1, nhận diện nguyên tắc chính khi chọn công cụ (K1).</li>
<li><strong>Mục tiêu 2</strong> → LO-6.2.2, nhớ mục tiêu của dự án pilot (K1).</li>
<li><strong>Mục tiêu 3</strong> → LO-6.2.3, các yếu tố thành công (K1).</li>
</ul>
<p class="nhan">Proof of concept và pilot — đừng nhầm</p>
<ul>
<li><strong>Proof of concept</strong> — <em>trước khi</em> mua: công cụ có chạy được trên ứng dụng của mình và đáp ứng yêu cầu không? Thuộc bước chọn (SWT6 slide 51).</li>
<li><strong>Dự án pilot</strong> — <em>sau khi</em> đã chọn: dùng thử trên một dự án thật, nhỏ để hiểu công cụ, khớp quy trình, đặt chuẩn và so chi phí với lợi ích (SWT6 slide 52–53).</li>
</ul>`],
      [26, 'Main principles (1)',
        `<p class="y-chinh">🎯 The 2011 list of what matters when selecting a tool, first half: start from the organisation, then evaluate objectively.</p>
<ol>
<li><strong>Assess the organisation's maturity</strong> — e.g. its readiness for change.</li>
<li><strong>Identify the areas</strong> within the organisation where tool support will help to improve the testing process.</li>
<li><strong>Evaluate tools against clear requirements and objective criteria</strong>.</li>
<li><strong>Proof of concept</strong> — see whether the product works as desired and meets the requirements and objectives defined for it.</li>
</ol>
<p class="nhan">Compared with 2018 (SWT6 slide 50)</p>
<ul>
<li><strong>Still there</strong> — items 1–3 ("identify opportunities for an improved test process").</li>
<li><strong>Moved</strong> — the proof of concept is now the <em>last</em> selection step (slide 51: "finally…").</li>
<li><strong>New in 2018</strong> — understand the technologies of the test object; know the current build and CI tools, so the new tool can integrate.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> a tool automates a process — if the team has no stable manual test process yet, the tool only automates the chaos.</p>`,
        `<p class="y-chinh">🎯 Danh sách 2011 về những điều quan trọng khi chọn công cụ, nửa đầu: bắt đầu từ tổ chức, rồi đánh giá khách quan.</p>
<ol>
<li><strong>Đánh giá độ trưởng thành của tổ chức</strong> — vd mức sẵn sàng thay đổi.</li>
<li><strong>Xác định những chỗ</strong> trong tổ chức mà công cụ sẽ giúp cải thiện quy trình test.</li>
<li><strong>Đánh giá công cụ theo yêu cầu rõ ràng và tiêu chí khách quan</strong>.</li>
<li><strong>Proof of concept</strong> — xem sản phẩm có chạy như mong muốn và đáp ứng yêu cầu, mục tiêu đã đặt ra không.</li>
</ol>
<p class="nhan">So với bản 2018 (SWT6 slide 50)</p>
<ul>
<li><strong>Vẫn còn</strong> — mục 1–3 ("xác định cơ hội cải thiện quy trình test").</li>
<li><strong>Dời chỗ</strong> — proof of concept nay là bước <em>cuối</em> của việc chọn (slide 51: "finally…").</li>
<li><strong>Mới trong 2018</strong> — hiểu công nghệ của đối tượng test; nắm công cụ build và CI đang dùng để công cụ mới tích hợp được.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> công cụ tự động hoá một quy trình — nếu đội chưa có quy trình test thủ công ổn định, công cụ chỉ tự động hoá sự hỗn loạn.</p>`],
      [27, 'Main principles (2)',
        `<p class="y-chinh">🎯 Second half of the 2011 list: look beyond the product — at the vendor, the internal roll-out and the business case.</p>
<ol start="5">
<li><strong>Evaluate the vendor</strong> — training, support and other commercial aspects — or the open-source network of support.</li>
<li><strong>Identify and plan internal implementation</strong> — including training, coaching and mentoring for those new to the tool.</li>
<li><strong>Estimate the return on investment</strong> — the cost-benefit ratio, based on a concrete and realistic business case.</li>
</ol>
<p class="nhan">Compared with 2018 (SWT6 slide 51)</p>
<ul>
<li><strong>Still there</strong> — evaluation of the vendor; coaching, mentoring and training needs; a cost-benefit ratio.</li>
<li><strong>New in 2018</strong> — check whether a free trial is available and for how long; weigh licensing models (commercial or open source).</li>
<li><strong>Wording</strong> — "return on investment" became "cost-benefit ratio"; the calculation is the same (the break-even example of lesson 8.4: 7 runs).</li>
</ul>`,
        `<p class="y-chinh">🎯 Nửa sau danh sách 2011: nhìn ra ngoài sản phẩm — nhà cung cấp, việc triển khai nội bộ và bài toán kinh doanh.</p>
<ol start="5">
<li><strong>Đánh giá nhà cung cấp</strong> — đào tạo, hỗ trợ và các mặt thương mại — hoặc mạng lưới hỗ trợ của cộng đồng mã nguồn mở.</li>
<li><strong>Xác định và lên kế hoạch triển khai nội bộ</strong> — gồm đào tạo, kèm cặp và cố vấn cho người mới dùng.</li>
<li><strong>Ước lượng lợi tức đầu tư (ROI)</strong> — tỉ lệ chi phí-lợi ích, dựa trên một bài toán kinh doanh cụ thể và thực tế.</li>
</ol>
<p class="nhan">So với bản 2018 (SWT6 slide 51)</p>
<ul>
<li><strong>Vẫn còn</strong> — đánh giá nhà cung cấp; nhu cầu kèm cặp, cố vấn, đào tạo; tỉ lệ chi phí-lợi ích.</li>
<li><strong>Mới trong 2018</strong> — xem có bản dùng thử miễn phí không và bao lâu; cân nhắc mô hình bản quyền (thương mại hay mã nguồn mở).</li>
<li><strong>Câu chữ</strong> — "return on investment" đổi thành "cost-benefit ratio"; cách tính vẫn vậy (ví dụ điểm hoà vốn ở bài 8.4: 7 lần chạy).</li>
</ul>`],
      [29, 'Pilot project (2)',
        `<p class="y-chinh">🎯 Objectives 3 and 4 of the 2011 pilot list: agree on standard ways of using the tool, then judge the pilot against its objectives.</p>
<ol start="3">
<li><strong>Decide on standard ways of using the tool</strong> that work for all potential users:
<ul>
<li>naming conventions;</li>
<li>creation of libraries and defining modularity;</li>
<li>where the different elements will be stored;</li>
<li>how they, and the tool itself, will be maintained.</li>
</ul></li>
<li><strong>Evaluate the pilot project against its objectives</strong> — have the benefits been achieved at reasonable cost?</li>
</ol>
<p class="nhan">Compared with 2018 (SWT6 slide 53)</p>
<ul>
<li><strong>Objective 3</strong> — kept as "deciding on standard ways of using, managing, storing and maintaining the tool and the test assets".</li>
<li><strong>Objective 4</strong> — kept as "assessing whether the benefits will be achieved at reasonable cost".</li>
<li><strong>New in 2018</strong> — understanding the metrics the tool should collect and report, and configuring it to capture them.</li>
</ul>
<p class="nhan">Example — the standards a Playwright pilot might set</p>
<ul>
<li><strong>Naming</strong> — <code>checkout_guest_pays_by_card.spec.ts</code>.</li>
<li><strong>Library</strong> — one page object per screen, shared by all tests.</li>
<li><strong>Storage</strong> — tests in the same Git repository as the code, test data in <code>/fixtures</code>.</li>
<li><strong>Maintenance</strong> — whoever changes a screen updates its page object in the same pull request.</li>
</ul>`,
        `<p class="y-chinh">🎯 Mục tiêu 3 và 4 trong danh sách pilot bản 2011: thống nhất cách dùng công cụ chuẩn, rồi chấm pilot theo chính mục tiêu của nó.</p>
<ol start="3">
<li><strong>Quyết định cách dùng công cụ chuẩn</strong> hợp với mọi người sẽ dùng:
<ul>
<li>quy ước đặt tên;</li>
<li>cách tạo thư viện và chia module;</li>
<li>chỗ lưu từng thành phần;</li>
<li>cách bảo trì chúng, và bảo trì chính công cụ.</li>
</ul></li>
<li><strong>Đánh giá dự án pilot theo mục tiêu của nó</strong> — lợi ích có đạt được với chi phí hợp lý không?</li>
</ol>
<p class="nhan">So với bản 2018 (SWT6 slide 53)</p>
<ul>
<li><strong>Mục tiêu 3</strong> — giữ lại thành "quyết định cách dùng, quản lý, lưu trữ và bảo trì chuẩn cho công cụ và tài sản test".</li>
<li><strong>Mục tiêu 4</strong> — giữ lại thành "đánh giá lợi ích có đạt được với chi phí hợp lý không".</li>
<li><strong>Mới trong 2018</strong> — hiểu các số liệu công cụ cần thu thập và báo cáo, và cấu hình để thu được chúng.</li>
</ul>
<p class="nhan">Ví dụ — các chuẩn một pilot Playwright có thể đặt ra</p>
<ul>
<li><strong>Đặt tên</strong> — <code>checkout_guest_pays_by_card.spec.ts</code>.</li>
<li><strong>Thư viện</strong> — mỗi màn hình một page object, mọi test dùng chung.</li>
<li><strong>Lưu trữ</strong> — test nằm cùng kho Git với code, dữ liệu test trong <code>/fixtures</code>.</li>
<li><strong>Bảo trì</strong> — ai sửa màn hình thì sửa luôn page object của nó trong cùng pull request.</li>
</ul>`],
      [30, 'Success factors (1)',
        `<p class="y-chinh">🎯 The 2011 success factors, first half: roll out step by step, adapt the process, support people, write guidelines.</p>
<ol>
<li><strong>Incremental roll-out</strong> (after the pilot) to the rest of the organisation.</li>
<li><strong>Adapting and improving processes, testware and tool artefacts</strong> — to get the best fit and balance between them and the use of the tool.</li>
<li><strong>Adequate support, training, coaching and mentoring</strong> of new users.</li>
<li><strong>Defining and communicating guidelines</strong> for the use of the tool, based on what was learned in the pilot.</li>
</ol>
<p class="nhan">Compared with 2018 (SWT6 slide 54)</p>
<ul>
<li><strong>Same four ideas</strong> — the 2018 list opens with exactly these.</li>
<li><strong>A detail 2018 dropped</strong> — the guidelines come <em>from the pilot</em>: the pilot's standards (page 29) become the organisation's guidelines.</li>
</ul>`,
        `<p class="y-chinh">🎯 Yếu tố thành công bản 2011, nửa đầu: triển khai từng bước, chỉnh quy trình, hỗ trợ con người, viết hướng dẫn.</p>
<ol>
<li><strong>Triển khai từng bước</strong> (sau pilot) ra phần còn lại của tổ chức.</li>
<li><strong>Điều chỉnh và cải tiến quy trình, testware và các sản phẩm của công cụ</strong> — để chúng và việc dùng công cụ khớp và cân bằng nhất.</li>
<li><strong>Hỗ trợ, đào tạo, kèm cặp và cố vấn đầy đủ</strong> cho người mới dùng.</li>
<li><strong>Định ra và phổ biến hướng dẫn</strong> sử dụng công cụ, dựa trên những gì học được từ pilot.</li>
</ol>
<p class="nhan">So với bản 2018 (SWT6 slide 54)</p>
<ul>
<li><strong>Cùng bốn ý</strong> — danh sách 2018 mở đầu bằng đúng bốn ý này.</li>
<li><strong>Một chi tiết bản 2018 bỏ đi</strong> — hướng dẫn đến <em>từ pilot</em>: các chuẩn của pilot (trang 29) trở thành hướng dẫn của cả tổ chức.</li>
</ul>`],
      [31, 'Success factors (2)',
        `<p class="y-chinh">🎯 Second half: keep improving — measure use and benefit, keep supporting users, learn from every team.</p>
<ol start="5">
<li><strong>A continuous improvement mechanism</strong> as tool use spreads through more of the organisation.</li>
<li><strong>Monitor the use of the tool and the benefits achieved</strong> — and adapt the way it is used to what is learned.</li>
<li><strong>Continuing support</strong> for anyone using test tools — e.g. technical expertise to help non-programmer testers who use keyword-driven test automation.</li>
<li><strong>Improvement based on information from all teams</strong> who use test tools.</li>
</ol>
<p class="nhan">Compared with 2018 (SWT6 slide 54)</p>
<ul>
<li><strong>Kept</strong> — monitoring tool use and benefits; providing support; gathering lessons learned from all users.</li>
<li><strong>Named differently</strong> — the "continuous improvement mechanism" is close to 2018's "a way to gather usage information from the actual use of the tool".</li>
<li><strong>The example is worth keeping</strong> — keyword-driven automation lets non-programmers write tests, but someone technical must still build and maintain the keywords (8.3, SWT6 slide 45).</li>
</ul>
<div class="pitfall">Training appears in two lists. <em>Planning</em> training, coaching and mentoring is a <strong>selection</strong> principle (page 27); <em>providing</em> it to users is a <strong>success factor</strong> (page 30). Read the verb in the option.</div>`,
        `<p class="y-chinh">🎯 Nửa sau: cải tiến liên tục — đo việc dùng và lợi ích, tiếp tục hỗ trợ người dùng, học từ mọi đội.</p>
<ol start="5">
<li><strong>Cơ chế cải tiến liên tục</strong> khi công cụ lan ra nhiều phần của tổ chức.</li>
<li><strong>Giám sát việc dùng công cụ và lợi ích đạt được</strong> — và điều chỉnh cách dùng theo điều học được.</li>
<li><strong>Hỗ trợ lâu dài</strong> cho mọi người dùng công cụ test — vd cần chuyên môn kỹ thuật để giúp tester không biết lập trình dùng keyword-driven automation.</li>
<li><strong>Cải tiến dựa trên thông tin từ mọi đội</strong> đang dùng công cụ test.</li>
</ol>
<p class="nhan">So với bản 2018 (SWT6 slide 54)</p>
<ul>
<li><strong>Giữ lại</strong> — giám sát việc dùng và lợi ích; hỗ trợ người dùng; thu bài học kinh nghiệm từ mọi người dùng.</li>
<li><strong>Đổi cách gọi</strong> — "cơ chế cải tiến liên tục" gần với "cách thu thập thông tin sử dụng từ việc dùng thật" của bản 2018.</li>
<li><strong>Ví dụ đáng nhớ</strong> — keyword-driven cho người không lập trình viết được test, nhưng vẫn cần người kỹ thuật dựng và bảo trì các keyword (8.3, SWT6 slide 45).</li>
</ul>
<div class="pitfall">Đào tạo xuất hiện ở hai danh sách. <em>Lên kế hoạch</em> đào tạo, kèm cặp, cố vấn là nguyên tắc <strong>chọn công cụ</strong> (trang 27); <em>cung cấp</em> nó cho người dùng là <strong>yếu tố thành công</strong> (trang 30). Hãy đọc động từ trong phương án.</div>`],
    ]),
    bi(`<h3>Summary table — the old tool list mapped to CTFL 2018</h3>
<div class="table-wrap"><table>
<thead><tr><th>Old type (2023 deck)</th><th>CTFL 2018 name</th><th>2018 group</th><th>SWT6 slide</th></tr></thead>
<tbody>
<tr><td>Requirements testing</td><td>Requirements management tools; model-based testing tools</td><td>Management; test design &amp; implementation</td><td>10, 17</td></tr>
<tr><td>Static analysis</td><td>Static analysis tools (D)</td><td>Static testing</td><td>15</td></tr>
<tr><td>Test design</td><td>Test design tools; model-based testing tools</td><td>Test design &amp; implementation</td><td>16–17</td></tr>
<tr><td>Test data preparation</td><td>Test data preparation tools</td><td>Test design &amp; implementation</td><td>18</td></tr>
<tr><td>Test running (character-based, GUI)</td><td>Test execution tools</td><td>Execution &amp; logging</td><td>21, 43–46</td></tr>
<tr><td>Comparison</td><td>part of test execution tools</td><td>Execution &amp; logging</td><td>21</td></tr>
<tr><td>Harnesses &amp; drivers, simulators</td><td>Test harnesses (D); unit test frameworks (D)</td><td>Execution &amp; logging</td><td>23–24</td></tr>
<tr><td>Performance</td><td>Performance testing tools (D); monitoring tools</td><td>Performance &amp; dynamic analysis</td><td>25–26</td></tr>
<tr><td>Dynamic analysis</td><td>Dynamic analysis tools (D)</td><td>Performance &amp; dynamic analysis</td><td>27</td></tr>
<tr><td>Debugging</td><td>— not a test tool (debugging ≠ testing, LO-1.1.2)</td><td>—</td><td>—</td></tr>
<tr><td>Test management (incidents, traceability)</td><td>Test management &amp; ALM; defect management; requirements management</td><td>Management</td><td>9–11</td></tr>
<tr><td>Coverage measurement</td><td>Coverage tools (D)</td><td>Execution &amp; logging</td><td>22</td></tr>
</tbody>
</table></div>
<h3>Ví dụ có lời giải · Worked example — one question, two vocabularies</h3>
<p><strong>Q.</strong> "A tool captures screens and compares them with stored bitmaps, masking the date field. It is a…" a) comparison tool · b) dynamic analysis tool · c) test harness · d) debugging tool.</p>
<ol>
<li><strong>Old list</strong> — page 11: actual vs expected, bitmaps, masking → <strong>a) comparison tool</strong>.</li>
<li><strong>2018 list</strong> — there is no comparison group; the same function belongs to <strong>test execution tools</strong>. If a newer question offers "test execution tool" instead, choose that.</li>
<li><strong>Rule out the rest</strong> — dynamic analysis watches memory at run time (page 14), a harness drives components without a UI (page 12), a debugger locates the cause of a failure (page 15).</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Old words in exam questions.</strong>
<ul>
<li><strong>"Fault", "incident"</strong> — read them as defect, defect report.</li>
<li><strong>"Test running tool"</strong> — test execution tool.</li>
<li><strong>"LCSAJ", "condition coverage"</strong> — not examined at Foundation 2018; only statement and decision coverage are.</li>
</ul></div>`,
    `<h3>Bảng tổng kết — danh sách công cụ cũ đối chiếu CTFL 2018</h3>
<div class="table-wrap"><table>
<thead><tr><th>Loại cũ (slide 2023)</th><th>Tên trong CTFL 2018</th><th>Nhóm 2018</th><th>SWT6 slide</th></tr></thead>
<tbody>
<tr><td>Requirements testing</td><td>Requirements management tools; model-based testing tools</td><td>Quản lý; thiết kế &amp; hiện thực test</td><td>10, 17</td></tr>
<tr><td>Static analysis</td><td>Static analysis tools (D)</td><td>Kiểm thử tĩnh</td><td>15</td></tr>
<tr><td>Test design</td><td>Test design tools; model-based testing tools</td><td>Thiết kế &amp; hiện thực test</td><td>16–17</td></tr>
<tr><td>Test data preparation</td><td>Test data preparation tools</td><td>Thiết kế &amp; hiện thực test</td><td>18</td></tr>
<tr><td>Test running (ký tự, GUI)</td><td>Test execution tools</td><td>Thực thi &amp; ghi log</td><td>21, 43–46</td></tr>
<tr><td>Comparison</td><td>một phần của test execution tools</td><td>Thực thi &amp; ghi log</td><td>21</td></tr>
<tr><td>Harness &amp; driver, simulator</td><td>Test harnesses (D); unit test frameworks (D)</td><td>Thực thi &amp; ghi log</td><td>23–24</td></tr>
<tr><td>Performance</td><td>Performance testing tools (D); monitoring tools</td><td>Hiệu năng &amp; phân tích động</td><td>25–26</td></tr>
<tr><td>Dynamic analysis</td><td>Dynamic analysis tools (D)</td><td>Hiệu năng &amp; phân tích động</td><td>27</td></tr>
<tr><td>Debugging</td><td>— không phải công cụ test (debug ≠ test, LO-1.1.2)</td><td>—</td><td>—</td></tr>
<tr><td>Test management (incident, truy vết)</td><td>Test management &amp; ALM; defect management; requirements management</td><td>Quản lý</td><td>9–11</td></tr>
<tr><td>Coverage measurement</td><td>Coverage tools (D)</td><td>Thực thi &amp; ghi log</td><td>22</td></tr>
</tbody>
</table></div>
<h3>Ví dụ có lời giải · Một câu hỏi, hai bộ từ vựng</h3>
<p><strong>Câu hỏi.</strong> "Một công cụ chụp màn hình và so với ảnh bitmap đã lưu, có che trường ngày tháng. Đó là…" a) comparison tool · b) dynamic analysis tool · c) test harness · d) debugging tool.</p>
<ol>
<li><strong>Danh sách cũ</strong> — trang 11: so thực tế với mong đợi, bitmap, masking → <strong>a) comparison tool</strong>.</li>
<li><strong>Danh sách 2018</strong> — không có nhóm comparison; chức năng này thuộc <strong>test execution tools</strong>. Nếu câu hỏi mới đưa ra "test execution tool" thì chọn cái đó.</li>
<li><strong>Loại các phương án còn lại</strong> — dynamic analysis theo dõi bộ nhớ lúc chạy (trang 14), harness chạy component chưa có UI (trang 12), debugger định vị nguyên nhân failure (trang 15).</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Từ cũ trong đề thi.</strong>
<ul>
<li><strong>"Fault", "incident"</strong> — hiểu là defect, defect report.</li>
<li><strong>"Test running tool"</strong> — test execution tool.</li>
<li><strong>"LCSAJ", "condition coverage"</strong> — Foundation 2018 không hỏi; chỉ hỏi statement và decision coverage.</li>
</ul></div>`),
  ].join('\n'),
};

/* ──────────────────────────────── Quiz 8 ──────────────────────────────── */
// SWT6 has no "Question" slides: 45 questions on the non-question slides, the hands-on lessons and (last 5) the 2023 deck of lesson 8.7.
const q = (question, options, correctIndex, explanation) => ({ question, options, correctIndex, points: 1, ...(explanation ? { explanation } : {}) });
const QUIZ8 = {
  title: 'Quiz 8 — Tools & automation (SWT6 + JUnit hands-on)|||Quiz 8 — Công cụ & tự động hoá (SWT6 + thực hành JUnit)',
  slug: 'swt301-quiz-8',
  type: 'QUIZ',
  description: '45 câu: phân loại công cụ, (D), probe effect, lợi ích/rủi ro, capture/replay vs data-driven vs keyword-driven vs MBT, công cụ quản lý test, chọn công cụ, pilot, yếu tố thành công, JUnit 4/5, build.xml, pyramid, CI, Selenium, và 5 câu về bộ slide 2023 (bài 8.7). SWT6 không có slide Question.',
  quiz: {
    timeLimitSeconds: 2700,
    questions: [
      q('Which of the following is NOT a purpose of using test tools? (SWT6 s.6)|||Đâu KHÔNG phải mục đích dùng công cụ test? (SWT6 s.6)', ['Automating repetitive tasks|||Tự động hoá việc lặp lại', 'Supporting manual test activities|||Hỗ trợ các hoạt động test thủ công', 'More consistent testing and better defect reproducibility|||Test nhất quán hơn, tái hiện lỗi tốt hơn', 'Removing the need for test design|||Không cần thiết kế test nữa'], 3, 'SWT6 slide 6 lists the purposes: automate repetitive or resource-heavy tasks, support manual activities, make testing more consistent and defects reproducible, automate what cannot be done by hand, and increase reliability. A tool runs or supports tests, but someone still has to design them.|||SWT6 slide 6 liệt kê các mục đích: tự động hoá việc lặp lại hoặc tốn nhiều công, hỗ trợ hoạt động thủ công, test nhất quán và tái hiện lỗi tốt hơn, tự động hoá việc không làm tay được, tăng độ tin cậy. Công cụ chạy hoặc hỗ trợ test, nhưng vẫn phải có người thiết kế test.'),
      q('The ISTQB syllabus classifies test tools mainly by… (s.7)|||Syllabus ISTQB phân loại công cụ test chủ yếu theo… (s.7)', ['price|||giá', 'licensing model|||mô hình bản quyền', 'the test activities they support|||hoạt động kiểm thử mà chúng hỗ trợ', 'the vendor|||nhà cung cấp'], 2, 'Slide 7 shows five possible ways (purpose, licensing, price, technology, activities supported), but the ISTQB syllabus groups tools by the test activities they support, and SWT6 slides 9-34 follow that grouping. Price and licence are criteria when you select a tool, not the classification.|||Slide 7 nêu năm cách (mục đích, bản quyền, giá, công nghệ, hoạt động hỗ trợ), nhưng syllabus ISTQB nhóm công cụ theo hoạt động kiểm thử mà chúng hỗ trợ, và SWT6 slide 9-34 đi theo cách nhóm đó. Giá và bản quyền là tiêu chí khi chọn công cụ, không phải cách phân loại.'),
      q('What is the probe effect? (s.8)|||Probe effect là gì? (s.8)', ['A tool that probes open ports|||Công cụ dò cổng mở', 'The change in the SUT\'s behaviour caused by using an intrusive tool|||Sự thay đổi hành vi của SUT do dùng công cụ xâm lấn', 'A defect found by exploratory testing|||Defect tìm bằng exploratory testing', 'The effect of test pressure on developers|||Tác động của áp lực test lên developer'], 1, 'Slide 8: intrusive tools can have unexpected side effects on the SUT, and that consequence is called the probe effect, e.g. a performance tool adding time to each transaction. Probing open ports is what a security tool does (slide 33), so the word "probe" in option A is a trap.|||Slide 8: công cụ xâm lấn có thể gây tác dụng phụ bất ngờ lên SUT, và hệ quả đó gọi là probe effect, vd công cụ hiệu năng làm mỗi giao dịch chậm thêm. Dò cổng mở là việc của công cụ bảo mật (slide 33), nên chữ "probe" ở phương án A là bẫy.'),
      q('Which tool is MOST likely to be intrusive? (s.8)|||Công cụ nào DỄ là công cụ xâm lấn nhất? (s.8)', ['Requirements management tool|||Công cụ quản lý yêu cầu', 'Code coverage tool|||Công cụ đo code coverage', 'Defect management tool|||Công cụ quản lý defect', 'Review tool|||Công cụ review'], 1, 'Slide 8 names coverage tools: they add instrumentation code into the real code, so the program being measured is not exactly the one that ships. Requirements, defect and review tools work on documents and records and never touch the running SUT.|||Slide 8 nêu đích danh công cụ coverage: chúng chèn mã đo (instrumentation) vào code thật, nên chương trình được đo không còn y hệt bản giao đi. Công cụ quản lý yêu cầu, defect và review làm việc với tài liệu, bản ghi, không đụng tới SUT đang chạy.'),
      q('A bug that disappears when you run the program in a debugger is called…|||Lỗi biến mất khi chạy chương trình trong debugger gọi là…', ['a Heisenbug|||Heisenbug', 'a regression|||regression', 'a false positive|||false positive', 'a pesticide paradox|||pesticide paradox'], 0, 'The teacher\'s note on slide 8: a Heisenbug seems to disappear or change its behaviour when you try to study it, e.g. a race condition hidden by the debugger\'s slower timing. It is a probe-effect example. A regression is a defect reintroduced by a change and has nothing to do with observing the program.|||Ghi chú của giảng viên ở slide 8: Heisenbug là lỗi dường như biến mất hoặc đổi hành vi khi ta cố nghiên cứu nó, vd race condition bị che vì debugger làm chương trình chạy chậm hơn. Đó là một ví dụ của probe effect. Regression là lỗi tái xuất do thay đổi code, không liên quan việc quan sát chương trình.'),
      q('On the SWT6 slides, "(D)" after a tool type means…|||Trên slide SWT6, "(D)" sau loại công cụ nghĩa là…', ['dynamic tool|||công cụ động', 'more likely to be used by developers|||thường do developer dùng', 'deprecated|||đã lỗi thời', 'defect-related|||liên quan defect'], 1, 'Slide 13 spells it out next to CI tools: (D) = more likely to be used by developers. That is why static analysis, unit test framework, coverage and dynamic analysis tools carry it. It does not mean "dynamic": static analysis tools are marked (D) too (slide 14).|||Slide 13 ghi rõ ngay cạnh CI tools: (D) = thường do developer dùng. Vì thế công cụ phân tích tĩnh, unit test framework, coverage và phân tích động đều mang (D). Nó không có nghĩa là "dynamic": công cụ phân tích tĩnh cũng được đánh (D) (slide 14).'),
      q('Which tool type supports traceability between requirements and tests? (s.10)|||Loại công cụ nào hỗ trợ truy vết giữa yêu cầu và test? (s.10)', ['Requirements management tools|||Công cụ quản lý yêu cầu', 'Dynamic analysis tools|||Công cụ phân tích động', 'Test data preparation tools|||Công cụ chuẩn bị dữ liệu test', 'Monitoring tools|||Công cụ giám sát'], 0, 'Slide 10: tests are created from requirements, and requirements management tools support traceability between requirements and tests. Test data preparation tools create or anonymise data; they do not link tests to requirements.|||Slide 10: test được tạo từ yêu cầu, và công cụ quản lý yêu cầu hỗ trợ truy vết giữa yêu cầu và test. Công cụ chuẩn bị dữ liệu test tạo hoặc ẩn danh dữ liệu, không nối test với yêu cầu.'),
      q('Which pair of tools is marked (D) in the syllabus?|||Cặp công cụ nào được đánh dấu (D) trong syllabus?', ['Monitoring and usability tools|||Giám sát và usability', 'Continuous integration and static analysis tools|||Tích hợp liên tục và phân tích tĩnh', 'Requirements and defect management tools|||Quản lý yêu cầu và quản lý defect', 'Localisation and accessibility tools|||Bản địa hoá và accessibility'], 1, 'On SWT6 the (D) mark sits on CI tools (slide 13) and static analysis tools (slides 14-15). Requirements and defect management tools serve the whole team, and monitoring, usability, localisation and accessibility tools carry no (D).|||Trên SWT6, dấu (D) nằm ở CI tools (slide 13) và công cụ phân tích tĩnh (slide 14-15). Công cụ quản lý yêu cầu và quản lý defect phục vụ cả nhóm, còn công cụ giám sát, usability, bản địa hoá và accessibility không có (D).'),
      q('Which tool gives an objective measure of which parts of the software structure were executed by the tests? (s.22)|||Công cụ nào cho số đo khách quan về phần cấu trúc phần mềm đã được test chạy qua? (s.22)', ['Test execution tool|||Công cụ thực thi test', 'Coverage tool|||Công cụ coverage', 'Static analysis tool|||Công cụ phân tích tĩnh', 'Test management tool|||Công cụ quản lý test'], 1, 'Slide 22: a coverage tool gives an objective measure of which parts of the software structure were executed by the tests; it counts elements such as statements or decisions and reports what was and was not covered. A test execution tool runs the tests but does not measure structure.|||Slide 22: công cụ coverage cho số đo khách quan về phần cấu trúc phần mềm đã được test chạy qua; nó đếm các phần tử như câu lệnh, quyết định và báo phần nào đã hay chưa được phủ. Công cụ thực thi test chạy test nhưng không đo cấu trúc.'),
      q('A test environment that provides drivers and stubs so a component can be tested in isolation is a… (s.23)|||Môi trường test cung cấp driver và stub để test một component tách biệt là… (s.23)', ['test harness|||test harness', 'test oracle|||test oracle', 'monitoring tool|||công cụ giám sát', 'model-based testing tool|||công cụ MBT'], 0, 'Slide 23: a test harness is the test environment that provides drivers and stubs so the item under test can be tested on as small a scale as possible. A test oracle is only the source of expected results; it provides no drivers or stubs.|||Slide 23: test harness là môi trường test cung cấp driver và stub để đối tượng được test ở quy mô nhỏ nhất có thể. Test oracle chỉ là nguồn kết quả mong đợi, không cung cấp driver hay stub.'),
      q('A tool that detects memory leaks while the program is running is a…  (s.27)|||Công cụ phát hiện rò rỉ bộ nhớ khi chương trình đang chạy là… (s.27)', ['static analysis tool|||công cụ phân tích tĩnh', 'dynamic analysis tool|||công cụ phân tích động', 'performance testing tool|||công cụ test hiệu năng', 'review tool|||công cụ review'], 1, 'Slide 27: dynamic analysis tools provide run-time information on software while it is running, e.g. allocation and de-allocation of memory (leaks) and pointer faults. A static analysis tool never runs the code, so it can at most warn about a possible leak.|||Slide 27: công cụ phân tích động cung cấp thông tin lúc chạy, vd cấp phát và giải phóng bộ nhớ (rò rỉ) và lỗi con trỏ. Công cụ phân tích tĩnh không chạy code, nên nhiều nhất chỉ cảnh báo khả năng rò rỉ.'),
      q('Which tool continuously tracks the status of a system in use and gives the earliest warnings? (s.26)|||Công cụ nào liên tục theo dõi tình trạng hệ thống đang dùng và cảnh báo sớm nhất? (s.26)', ['Performance testing tool|||Công cụ test hiệu năng', 'Monitoring tool|||Công cụ giám sát', 'Coverage tool|||Công cụ coverage', 'Configuration management tool|||Công cụ quản lý cấu hình'], 1, 'Slide 26: monitoring tools continuously keep track of the status of a system in use to give the earliest warnings and improve service (servers, networks, DB, security...). A performance testing tool generates load during a test run (slide 25); it does not watch the live system.|||Slide 26: công cụ giám sát liên tục theo dõi trạng thái hệ thống đang dùng để cảnh báo sớm nhất và cải thiện dịch vụ (server, mạng, DB, bảo mật...). Công cụ test hiệu năng tạo tải trong lúc chạy test (slide 25), không theo dõi hệ thống thật.'),
      q('Masking customer names in copied production data for testing is done with a…  (s.18)|||Che tên khách hàng trong dữ liệu production chép sang để test là việc của… (s.18)', ['test data preparation tool|||công cụ chuẩn bị dữ liệu test', 'defect management tool|||công cụ quản lý defect', 'test harness|||test harness', 'review tool|||công cụ review'], 0, 'Slide 18: test data preparation tools are useful for anonymising data so it conforms to data protection rules, and are especially useful in performance and reliability testing. A test harness supplies drivers and stubs, not data.|||Slide 18: công cụ chuẩn bị dữ liệu test hữu ích để ẩn danh dữ liệu cho đúng quy định bảo vệ dữ liệu, và đặc biệt có ích khi test hiệu năng, độ tin cậy. Test harness cung cấp driver và stub, không phải dữ liệu.'),
      q('Generating test inputs and expected outputs from a state transition diagram is typical of… (s.17, s.46)|||Sinh input và output mong đợi từ sơ đồ chuyển trạng thái là đặc trưng của… (s.17, s.46)', ['capture/replay tools|||công cụ capture/replay', 'model-based testing tools|||công cụ model-based testing', 'monitoring tools|||công cụ giám sát', 'static analysis tools|||công cụ phân tích tĩnh'], 1, 'Slides 17 and 46: model-based testing tools generate test inputs and expected outputs from a model such as a state transition or activity diagram. A capture/replay tool only records what a tester does; it has no model and produces no expected results.|||Slide 17 và 46: công cụ model-based testing sinh input và output mong đợi từ mô hình như sơ đồ chuyển trạng thái hay activity diagram. Công cụ capture/replay chỉ ghi lại thao tác của tester, không có mô hình và không sinh kết quả mong đợi.'),
      q('Which statement about localisation testing is TRUE? (s.32)|||Câu nào về test bản địa hoá là ĐÚNG? (s.32)', ['It can be fully automated|||Có thể tự động hoá hoàn toàn', 'It only checks the currency symbol|||Chỉ kiểm ký hiệu tiền tệ', 'It is an area where human intelligence is needed|||Là vùng cần trí tuệ con người', 'It is the same as portability testing|||Giống test portability'], 2, 'Slide 32: localisation testing checks that translation, menus, buttons and messages are linguistically and culturally acceptable for a locale, and the slide calls it "an area where human intelligence is needed". So it cannot be fully automated. Portability is about running on different platforms (slide 34).|||Slide 32: test bản địa hoá kiểm bản dịch, menu, nút, thông báo có phù hợp ngôn ngữ và văn hoá của một địa phương không, và slide gọi đó là "vùng cần trí tuệ con người". Vì vậy không thể tự động hoá hoàn toàn. Portability là chạy được trên nhiều nền tảng (slide 34).'),
      q('Which is a potential BENEFIT of using test tools? (s.38)|||Đâu là một LỢI ÍCH tiềm năng của việc dùng công cụ test? (s.38)', ['Objective assessment, e.g. coverage measures|||Đánh giá khách quan, vd số đo coverage', 'No maintenance of test scripts is needed|||Không cần bảo trì script test', 'The tool replaces test design|||Công cụ thay thế thiết kế test', 'A guaranteed return on investment|||Chắc chắn có lời'], 0, 'Slide 38 lists four benefits: less repetitive work, greater consistency and repeatability, objective assessment (e.g. coverage measures) and easier access to test information. "No maintenance needed" is the opposite of reality: underestimating maintenance of test assets is a risk (slide 39).|||Slide 38 nêu bốn lợi ích: giảm việc lặp lại, nhất quán và lặp lại được hơn, đánh giá khách quan (vd số đo coverage), dễ truy cập thông tin test. "Không cần bảo trì" là ngược thực tế: đánh giá thấp công bảo trì tài sản test là một rủi ro (slide 39).'),
      q('Which is a RISK of using test tools? (s.39)|||Đâu là một RỦI RO khi dùng công cụ test? (s.39)', ['Greater consistency and repeatability|||Nhất quán và lặp lại được hơn', 'Underestimating the effort to maintain the test assets generated by the tool|||Đánh giá thấp công sức bảo trì tài sản test do công cụ tạo ra', 'Easier access to information about testing|||Dễ truy cập thông tin về kiểm thử', 'Reduction of repetitive work|||Giảm việc lặp lại'], 1, 'Slide 39: underestimating the time, cost and effort for introducing a tool and for maintaining the test assets it generates is a classic risk. The other three options are exactly the benefits listed on slide 38.|||Slide 39: đánh giá thấp thời gian, chi phí, công sức để đưa công cụ vào và để bảo trì tài sản test do nó tạo ra là rủi ro kinh điển. Ba phương án còn lại chính là các lợi ích ở slide 38.'),
      q('Which of these is NOT a risk of using tools? (s.39–40)|||Điều nào KHÔNG phải rủi ro khi dùng công cụ? (s.39–40)', ['The vendor goes out of business|||Nhà cung cấp phá sản', 'Unrealistic expectations for the tool|||Kỳ vọng phi thực tế vào công cụ', 'Over-reliance on the tool|||Quá phụ thuộc vào công cụ', 'Reduction of repetitive manual work|||Giảm việc thủ công lặp lại'], 3, 'Reduction of repetitive work is the first benefit on slide 38. The vendor going out of business (slide 40), unrealistic expectations and over-reliance on the tool (slide 39) are all listed risks.|||Giảm việc lặp lại là lợi ích đầu tiên ở slide 38. Nhà cung cấp phá sản (slide 40), kỳ vọng phi thực tế và quá phụ thuộc vào công cụ (slide 39) đều là rủi ro được liệt kê.'),
      q('Which statement about capture/replay is TRUE? (s.43)|||Câu nào về capture/replay là ĐÚNG? (s.43)', ['Recordings store complete test cases including expected results|||Bản ghi lưu đủ test case kể cả kết quả mong đợi', 'It scales well to thousands of scripts|||Mở rộng tốt tới hàng nghìn script', 'Recorded scripts may be unstable when unexpected events occur|||Script ghi lại có thể không ổn định khi có sự kiện bất ngờ', 'It is the recommended approach for large regression suites|||Là cách được khuyến nghị cho bộ regression lớn'], 2, 'Slide 43: recording a manual tester is easy, but the script may be unstable when unexpected events occur, it does not scale to large numbers of scripts, and it stores only data and scripts, not test cases with expected results. That rules out the other three options.|||Slide 43: ghi lại thao tác tester thì dễ, nhưng script có thể không ổn định khi có sự kiện bất ngờ, không mở rộng được cho số lượng script lớn, và chỉ lưu dữ liệu và script chứ không lưu test case có kết quả mong đợi. Vì thế ba phương án kia sai.'),
      q('When can capturing test inputs be useful? (s.43)|||Khi nào ghi lại input của test là có ích? (s.43)', ['As an audit trail during exploratory or unscripted testing|||Làm vết kiểm tra khi exploratory hoặc test không kịch bản', 'To build a 5,000-test regression suite|||Để xây bộ regression 5.000 test', 'To generate expected results automatically|||Để tự sinh kết quả mong đợi', 'To replace test management tools|||Để thay công cụ quản lý test'], 0, 'Slide 43: capturing test inputs is useful in exploratory testing or unscripted testing with experienced users, where the recording serves as an audit trail of what was done. Building a 5,000-test regression suite from recordings is exactly what "does not scale" warns against.|||Slide 43: ghi lại input có ích khi exploratory testing hoặc test không kịch bản với người dùng nhiều kinh nghiệm, lúc đó bản ghi là vết kiểm tra (audit trail) những gì đã làm. Xây bộ regression 5.000 test bằng bản ghi chính là điều slide cảnh báo "không mở rộng được".'),
      q('In data-driven testing… (s.44)|||Trong data-driven testing… (s.44)', ['each test has its own hand-written script|||mỗi test có script viết tay riêng', 'inputs and expected results are stored separately (e.g. a spreadsheet) and read by a generic script|||input và kết quả mong đợi được lưu riêng (vd bảng tính) và một script chung đọc chúng', 'the tool generates tests from a model|||công cụ sinh test từ mô hình', 'the tester records mouse clicks|||tester ghi lại thao tác chuột'], 1, 'Slide 44: a data-driven approach separates test inputs and expected results, usually into a spreadsheet, and a generic script reads each row and runs the same steps with different data. Generating tests from a model is MBT; recording clicks is capture/replay.|||Slide 44: data-driven tách input và kết quả mong đợi ra riêng, thường vào bảng tính, rồi một script chung đọc từng dòng và chạy cùng các bước với dữ liệu khác nhau. Sinh test từ mô hình là MBT; ghi thao tác chuột là capture/replay.'),
      q('The main advantage of keyword-driven over data-driven testing is that testers can…  (s.45)|||Ưu điểm chính của keyword-driven so với data-driven là tester có thể… (s.45)', ['avoid writing expected results|||khỏi viết kết quả mong đợi', 'define new tests (sequences of action words), not only new data for one script|||định nghĩa test mới (chuỗi action word), không chỉ dữ liệu mới cho một script', 'run tests without any automation code at all|||chạy test mà hoàn toàn không cần code automation', 'skip test management|||bỏ qua quản lý test'], 1, 'In data-driven testing a non-programmer can only add data for a predefined script (slide 44). With keywords (action words) they can combine actions into new tests tailored to the SUT (slide 45). Someone still has to write the keyword scripts, so "no automation code at all" is wrong.|||Với data-driven, người không biết lập trình chỉ thêm được dữ liệu cho script có sẵn (slide 44). Với keyword (action word), họ ghép các hành động thành test mới cho SUT (slide 45). Vẫn phải có người viết script cho từng keyword, nên "không cần code automation" là sai.'),
      q('In model-based testing, who typically creates the model and what does the tool produce? (s.46)|||Trong MBT, ai thường tạo mô hình và công cụ tạo ra gì? (s.46)', ['The end user; a defect report|||Người dùng cuối; một defect report', 'A system designer; test case specifications that can be stored or executed|||Người thiết kế hệ thống; đặc tả test case có thể lưu hoặc thực thi', 'The test manager; a test plan|||Test manager; một test plan', 'The developer; source code|||Developer; mã nguồn'], 1, 'Slide 46: the functional specification is captured as a model (state transition, activity diagram), generally by a system designer, and the MBT tool interprets it to create test case specifications that can be saved in a test management tool and/or executed by a test execution tool.|||Slide 46: đặc tả chức năng được thể hiện thành mô hình (chuyển trạng thái, activity diagram), thường do người thiết kế hệ thống làm, và công cụ MBT diễn giải mô hình để tạo đặc tả test case có thể lưu vào công cụ quản lý test và/hoặc chạy bằng công cụ thực thi test.'),
      q('Test management tools need to interface with configuration management tools in order to… (s.47)|||Công cụ quản lý test cần kết nối công cụ quản lý cấu hình để… (s.47)', ['generate load|||sinh tải', 'link results with test object version information|||liên kết kết quả với thông tin phiên bản đối tượng test', 'check coding standards|||kiểm chuẩn code', 'anonymise data|||ẩn danh dữ liệu'], 1, 'Slide 47: test management tools interface with requirements management tools for traceability and with configuration management tools to link results with test object version information, so you know which build a result belongs to. Generating load is a performance tool\'s job.|||Slide 47: công cụ quản lý test kết nối công cụ quản lý yêu cầu để truy vết, và công cụ quản lý cấu hình để liên kết kết quả với thông tin phiên bản đối tượng test, nhờ đó biết kết quả thuộc bản build nào. Sinh tải là việc của công cụ hiệu năng.'),
      q('The recommended approach for adopting a test management tool is… (s.47)|||Cách tiếp cận khuyến nghị khi áp dụng công cụ quản lý test là… (s.47)', ['buy the tool, then build the process around it|||mua công cụ rồi xây quy trình quanh nó', 'define the test process → consider the tool(s) → adapt the tool(s) for the highest benefit|||xác định quy trình test → xem xét công cụ → điều chỉnh công cụ cho lợi nhất', 'let each tester choose a tool|||để mỗi tester tự chọn công cụ', 'use the vendor\'s default configuration|||dùng cấu hình mặc định của hãng'], 1, 'Slide 47 gives the order: define the test process, then consider the tool(s), then adapt them to provide the highest benefit. Buying a tool first and bending the process around it, or accepting the vendor\'s defaults, reverses that order.|||Slide 47 nêu thứ tự: xác định quy trình test, rồi xem xét công cụ, rồi điều chỉnh công cụ cho lợi nhất. Mua công cụ trước rồi uốn quy trình theo nó, hay dùng cấu hình mặc định của hãng, là làm ngược thứ tự đó.'),
      q('Which is a principle for SELECTING a tool? (s.50–51)|||Đâu là nguyên tắc khi CHỌN công cụ? (s.50–51)', ['Roll out incrementally|||Triển khai từng bước', 'Evaluate the vendor (training, support, commercial aspects)|||Đánh giá nhà cung cấp (đào tạo, hỗ trợ, thương mại)', 'Gather lessons learned from all users|||Thu thập bài học từ mọi người dùng', 'Monitor tool use and benefits|||Giám sát việc dùng và lợi ích'], 1, 'Slide 51 lists "evaluation of the vendor" (training, support, commercial aspects) as a selection consideration. Incremental roll-out, gathering lessons learned and monitoring use and benefits are success factors for deploying a tool that is already chosen (slide 54).|||Slide 51 liệt kê "đánh giá nhà cung cấp" (đào tạo, hỗ trợ, thương mại) là một yếu tố khi chọn công cụ. Triển khai từng bước, thu thập bài học và giám sát việc dùng là yếu tố thành công khi triển khai công cụ đã chọn (slide 54).'),
      q('According to slide 51, what should be done FINALLY in tool selection?|||Theo slide 51, bước CUỐI khi chọn công cụ là gì?', ['A proof-of-concept evaluation|||Đánh giá proof-of-concept', 'An organisation-wide roll-out|||Triển khai toàn tổ chức', 'Signing a 5-year licence|||Ký bản quyền 5 năm', 'Writing the test policy|||Viết chính sách test'], 0, 'Slide 51 ends with "Finally, a proof-of-concept evaluation should be done" to check that the tool works with our software and infrastructure. An organisation-wide roll-out comes much later, after a pilot, and should be incremental (slide 54).|||Slide 51 kết thúc bằng "Finally, a proof-of-concept evaluation should be done" để kiểm công cụ có chạy được với phần mềm và hạ tầng của mình. Triển khai toàn tổ chức đến sau rất xa, sau pilot, và nên làm từng bước (slide 54).'),
      q('Which is an objective of a PILOT project? (s.53)|||Đâu là mục tiêu của dự án PILOT? (s.53)', ['Rolling the tool out to the whole organisation|||Triển khai công cụ cho cả tổ chức', 'Assessing whether the benefits will be achieved at reasonable cost|||Đánh giá lợi ích có đạt được với chi phí hợp lý không', 'Negotiating the licence price|||Đàm phán giá bản quyền', 'Replacing all manual testing|||Thay thế mọi test thủ công'], 1, 'Slide 53 lists the pilot objectives: gain knowledge of the tool, see how it fits existing processes, decide standard ways of using it, assess whether the benefits will be achieved at reasonable cost, and understand its metrics. Rolling out to the whole organisation happens after the pilot.|||Slide 53 nêu mục tiêu pilot: hiểu công cụ, xem nó khớp quy trình hiện có ra sao, quyết định cách dùng chuẩn, đánh giá lợi ích có đạt với chi phí hợp lý không, và hiểu các số đo của nó. Triển khai cho cả tổ chức diễn ra sau pilot.'),
      q('Deciding naming conventions for test scripts and how test assets are stored belongs to…|||Quyết định quy ước đặt tên script test và cách lưu tài sản test thuộc về…', ['tool selection|||việc chọn công cụ', 'the pilot project (standard ways of using the tool)|||dự án pilot (cách dùng công cụ chuẩn)', 'maintenance testing|||maintenance testing', 'defect management|||quản lý defect'], 1, 'Slide 53: a pilot objective is "deciding on standard ways of using, managing, storing and maintaining the tool and the test assets", which includes naming conventions and storage. Tool selection happens before the tool is chosen, so it cannot yet set conventions for using it.|||Slide 53: một mục tiêu của pilot là "quyết định cách chuẩn để dùng, quản lý, lưu trữ và bảo trì công cụ và tài sản test", bao gồm quy ước đặt tên và cách lưu. Việc chọn công cụ diễn ra trước khi có công cụ, nên chưa thể đặt quy ước dùng nó.'),
      q('Which is a SUCCESS FACTOR for deploying a tool? (s.54)|||Đâu là YẾU TỐ THÀNH CÔNG khi triển khai công cụ? (s.54)', ['Big-bang roll-out to every team at once|||Triển khai "big bang" cho mọi đội cùng lúc', 'Rolling out incrementally with training, coaching and mentoring|||Triển khai từng bước kèm đào tạo, kèm cặp và cố vấn', 'No usage guidelines, to keep flexibility|||Không có hướng dẫn để giữ linh hoạt', 'Stopping support after the pilot|||Dừng hỗ trợ sau pilot'], 1, 'Slide 54: success factors include rolling out incrementally, providing training, coaching and mentoring, defining usage guidelines and providing support. A big-bang roll-out, no guidelines and stopping support are the opposites of three items on that slide.|||Slide 54: yếu tố thành công gồm triển khai từng bước, đào tạo, kèm cặp, cố vấn, đặt hướng dẫn sử dụng và hỗ trợ người dùng. Triển khai "big bang", không có hướng dẫn và dừng hỗ trợ là ngược với ba mục trên slide đó.'),
      q('Which JUnit 5 annotation replaces JUnit 4\'s @Before?|||Annotation JUnit 5 nào thay cho @Before của JUnit 4?', ['@BeforeAll', '@BeforeEach', '@Setup', '@Init'], 1, 'JUnit 4 @Before runs before every test method; its JUnit 5 name is @BeforeEach (lesson 8.5). @BeforeAll replaces @BeforeClass: it runs once for the whole class and must be static.|||@Before của JUnit 4 chạy trước mỗi phương thức test; tên trong JUnit 5 là @BeforeEach (bài 8.5). @BeforeAll thay cho @BeforeClass: chạy một lần cho cả lớp và phải là static.'),
      q('Which JUnit 5 annotation replaces JUnit 4\'s @Ignore?|||Annotation JUnit 5 nào thay cho @Ignore của JUnit 4?', ['@Skip', '@Disabled', '@Ignore', '@Tag'], 1, 'JUnit 5 disables a test with @Disabled (optionally with a reason). @Ignore exists only in JUnit 4 and the Jupiter engine does not honour it; @Tag labels tests for filtering but still runs them.|||JUnit 5 tắt một test bằng @Disabled (có thể kèm lý do). @Ignore chỉ có ở JUnit 4 và engine Jupiter không xét tới nó; @Tag chỉ gắn nhãn để lọc, test vẫn chạy.'),
      q('In JUnit 5, how do you check that divide(1, 0) throws ArithmeticException?|||Trong JUnit 5, kiểm tra divide(1, 0) ném ArithmeticException thế nào?', ['@Test(expected = ArithmeticException.class)', 'assertThrows(ArithmeticException.class, () -> calc.divide(1, 0))', 'assertEquals(ArithmeticException, calc.divide(1, 0))', 'try { } finally { }'], 1, 'JUnit 5 uses assertThrows(ArithmeticException.class, () -> calc.divide(1, 0)), which also returns the exception so you can check its message. @Test(expected = ...) is JUnit 4 syntax; the JUnit 5 @Test annotation has no "expected" attribute.|||JUnit 5 dùng assertThrows(ArithmeticException.class, () -> calc.divide(1, 0)), hàm này còn trả về exception để kiểm message. @Test(expected = ...) là cú pháp JUnit 4; @Test của JUnit 5 không có thuộc tính "expected".'),
      q('Which JUnit annotation runs the same test over many inputs?|||Annotation JUnit nào chạy cùng một test trên nhiều input?', ['@BeforeEach', '@Test', '@ParameterizedTest', '@AfterEach'], 2, '@ParameterizedTest plus a source such as @ValueSource or @CsvSource runs the same method once per input row, which is the JUnit form of data-driven testing. A plain @Test runs once; @BeforeEach and @AfterEach are setup and teardown hooks.|||@ParameterizedTest kèm một nguồn như @ValueSource hay @CsvSource chạy cùng một phương thức cho từng dòng input, là dạng data-driven trong JUnit. @Test thường chỉ chạy một lần; @BeforeEach và @AfterEach là hàm chuẩn bị và dọn dẹp.'),
      q('In the course build.xml, what runs when you type "ant" with no target?|||Trong build.xml của môn, gõ "ant" không kèm target thì chạy gì?', ['test-with-jacoco', 'clean, then compile (the default target)|||clean rồi compile (target mặc định)', 'jacoco-report', 'Nothing|||Không gì cả'], 1, 'The sample build.xml declares project default="compile", and the compile target has depends="clean", so plain "ant" runs clean and then compile (lesson 8.5). test-with-jacoco and jacoco-report run only when you name them.|||build.xml mẫu khai báo project default="compile", và target compile có depends="clean", nên gõ "ant" trống sẽ chạy clean rồi compile (bài 8.5). test-with-jacoco và jacoco-report chỉ chạy khi gọi đích danh.'),
      q('build.xml runs tests with haltonfailure="true". One test fails. What happens?|||build.xml chạy test với haltonfailure="true". Một test fail. Chuyện gì xảy ra?', ['The failure is logged and the JaCoCo report is still written|||Failure được ghi log và báo cáo JaCoCo vẫn được ghi', 'BUILD FAILED; later targets such as jacoco-report do not run|||BUILD FAILED; các target sau như jacoco-report không chạy', 'Ant retries the test three times|||Ant chạy lại test ba lần', 'Only the failing test is skipped|||Chỉ test fail bị bỏ qua'], 1, 'With haltonfailure="true" (and haltonerror="true") one red test stops Ant with BUILD FAILED, so targets that depend on it, such as jacoco-report, never run (lesson 8.5). Ant does not retry or skip tests by itself.|||Với haltonfailure="true" (và haltonerror="true"), chỉ một test đỏ là Ant dừng với BUILD FAILED, nên các target phụ thuộc như jacoco-report không chạy (bài 8.5). Ant không tự chạy lại hay bỏ qua test.'),
      q('JUnitCore prints "Tests run: 5, Failures: 1" for a class with 6 @Test methods, one of them @Ignore. Why 5?|||JUnitCore in "Tests run: 5, Failures: 1" cho lớp có 6 phương thức @Test, một cái @Ignore. Vì sao là 5?', ['One test crashed the JVM|||Một test làm sập JVM', 'Ignored tests are not counted as run|||Test bị @Ignore không được tính là đã chạy', 'The failing test is not counted|||Test fail không được tính', 'JUnit counts only public classes|||JUnit chỉ đếm lớp public'], 1, '6 @Test methods minus 1 @Ignore = 5 run; JUnit 4 reports ignored tests separately and does not count them as run (output verified in lesson 8.5). The failing test is counted: "Failures: 1" is one of those 5.|||6 phương thức @Test trừ 1 cái @Ignore = 5 được chạy; JUnit 4 báo test bị ignore riêng và không tính là đã chạy (kết quả đã chạy thật ở bài 8.5). Test fail vẫn được tính: "Failures: 1" nằm trong 5 test đó.'),
      q('The test pyramid recommends…|||Test pyramid khuyến nghị…', ['mostly UI tests, few unit tests|||chủ yếu UI test, ít unit test', 'many unit tests, fewer integration tests, very few UI tests|||nhiều unit test, ít integration hơn, rất ít UI test', 'only manual tests|||chỉ test thủ công', 'equal numbers at every level|||số lượng bằng nhau mọi tầng'], 1, 'The pyramid (lesson 8.6) puts many fast, cheap unit tests at the base, fewer integration tests in the middle and very few slow, brittle UI tests at the top. Mostly UI tests is the inverted "ice-cream cone" anti-pattern.|||Kim tự tháp (bài 8.6) đặt nhiều unit test nhanh, rẻ ở đáy, ít integration test hơn ở giữa và rất ít UI test chậm, dễ vỡ ở đỉnh. Chủ yếu UI test là mô hình ngược "cây kem ốc quế", một anti-pattern.'),
      q('In CI, what does a RED build mean?|||Trong CI, build ĐỎ nghĩa là gì?', ['The code is ready to ship|||Code sẵn sàng giao', 'A step (e.g. a test) failed; the change should not be merged as it is|||Một bước (vd một test) fail; không nên merge thay đổi nguyên trạng', 'The CI server is switched off|||CI server bị tắt', 'Coverage is 100 %|||Coverage đạt 100 %'], 1, 'Red means some step of the pipeline (compile, unit tests, a quality gate) failed on that change, so it should be fixed before merging (lesson 8.6). Even a green build only means the automated checks passed, not that the code is ready to ship.|||Đỏ nghĩa là một bước của pipeline (biên dịch, unit test, quality gate) đã fail với thay đổi đó, nên phải sửa trước khi merge (bài 8.6). Kể cả build xanh cũng chỉ nghĩa là các kiểm tra tự động đã qua, chưa phải code sẵn sàng giao.'),
      q('Selenium WebDriver is primarily a tool for… and which is BEST kept manual rather than automated?|||Selenium WebDriver chủ yếu là công cụ để… và việc nào NÊN giữ thủ công?', ['unit testing; boundary checks|||unit test; kiểm biên', 'driving a real browser for UI/end-to-end tests; usability and exploratory testing|||điều khiển trình duyệt thật cho test UI/đầu-cuối; usability và exploratory testing', 'load testing; smoke tests|||load test; smoke test', 'static analysis; regression checks|||phân tích tĩnh; kiểm regression'], 1, 'Selenium WebDriver drives a real browser, so it serves UI and end-to-end tests (lesson 8.6). Usability and exploratory testing depend on human judgement, like localisation on SWT6 slide 32. Unit tests belong to JUnit and load tests to tools such as JMeter.|||Selenium WebDriver điều khiển trình duyệt thật, nên dùng cho test UI và đầu-cuối (bài 8.6). Usability và exploratory testing cần phán đoán của con người, giống bản địa hoá ở SWT6 slide 32. Unit test là việc của JUnit, load test là của công cụ như JMeter.'),
      // Lesson 8.7 — the 2023 deck (oswt6): the old tool classification and introducing a tool.
      { ...q('The 2023 deck lists "incident management tools" under test management tools. What does CTFL 2018 call them? (8.7, page 16)|||Slide 2023 xếp "incident management tools" vào công cụ quản lý test. CTFL 2018 gọi chúng là gì? (8.7, trang 16)', ['Defect management tools|||Công cụ quản lý defect', 'Risk management tools|||Công cụ quản lý rủi ro', 'Configuration management tools|||Công cụ quản lý cấu hình', 'Release management tools|||Công cụ quản lý phát hành'], 0), explanation: 'The old decks said "incident"; CTFL 2018 uses defect management and defect reports. An incident was any unexpected event needing investigation, which might not be a defect.|||Slide cũ dùng "incident"; CTFL 2018 dùng defect management và defect report. Incident là mọi sự kiện bất thường cần điều tra, có khi không phải defect.' },
      { ...q('Which tool type from the 2023 deck is NOT a category in the CTFL 2018 tool classification? (8.7, page 15)|||Loại công cụ nào của slide 2023 KHÔNG còn là một nhóm trong phân loại CTFL 2018? (8.7, trang 15)', ['Test data preparation tools|||Công cụ chuẩn bị dữ liệu test', 'Debugging tools|||Công cụ debug', 'Coverage tools|||Công cụ coverage', 'Dynamic analysis tools|||Công cụ phân tích động'], 1), explanation: 'Debugging finds, analyses and removes the cause of a failure; it is a development activity, not testing (LO-1.1.2). The other three are still in the 2018 classification.|||Debug là tìm, phân tích và gỡ nguyên nhân của failure; đó là việc của phát triển, không phải kiểm thử (LO-1.1.2). Ba loại còn lại vẫn có trong phân loại 2018.' },
      { ...q('Flight-control software is tested in a simulator because testing in the real environment would be too costly or dangerous. In the 2023 deck, simulators belong to… (8.7, page 12)|||Phần mềm điều khiển bay được test trong simulator vì test ở môi trường thật quá tốn kém hoặc nguy hiểm. Trong slide 2023, simulator thuộc về… (8.7, trang 12)', ['comparison tools|||công cụ so sánh', 'test harnesses and drivers|||test harness và driver', 'performance testing tools|||công cụ test hiệu năng', 'requirements testing tools|||công cụ test yêu cầu'], 1), explanation: 'Page 12: harnesses and drivers exercise software without a user interface, run groups of automated tests, are often custom-built, and include simulators where the real environment is too costly or dangerous.|||Trang 12: harness và driver chạy thử phần mềm chưa có giao diện, chạy từng nhóm test tự động, thường tự viết, và gồm cả simulator khi môi trường thật quá tốn kém hoặc nguy hiểm.' },
      { ...q('How does a coverage measurement tool work? (8.7, page 17)|||Công cụ đo coverage hoạt động thế nào? (8.7, trang 17)', ['It counts the test cases written for each requirement|||Đếm số test case viết cho mỗi yêu cầu', 'It instruments the code, runs the tests through the instrumented code, and reports what was and was not executed|||Chèn mã đo vào code, chạy test qua bản đã chèn, rồi báo phần nào đã và chưa được chạy', 'It compares actual screens with stored bitmaps|||So màn hình thực tế với ảnh bitmap đã lưu', 'It generates load and measures response times|||Tạo tải và đo thời gian phản hồi'], 1), explanation: 'Instrument, run, report: counters are inserted in a static pass, the tests run through that code, and the tool reports coverage line by line plus summary statistics. The instrumentation is what makes coverage tools intrusive.|||Chèn, chạy, báo: bộ đếm được chèn trong một lượt tĩnh, test chạy qua code đó, và công cụ báo coverage theo từng dòng kèm số liệu tổng. Việc chèn mã đo khiến công cụ coverage mang tính xâm lấn.' },
      { ...q('What is the difference between a proof of concept and a pilot project? (8.7, page 25)|||Proof of concept khác dự án pilot ở điểm nào? (8.7, trang 25)', ['The proof of concept comes after roll-out; the pilot comes before buying|||Proof of concept làm sau khi triển khai; pilot làm trước khi mua', 'The proof of concept checks, during selection, that the tool works on our application; the pilot uses the chosen tool on a small real project to learn it, set standards and check cost against benefit|||Proof of concept kiểm, trong lúc chọn, xem công cụ có chạy trên ứng dụng của mình không; pilot dùng công cụ đã chọn trên một dự án thật nhỏ để hiểu nó, đặt chuẩn và so chi phí với lợi ích', 'They are two names for the same activity|||Hai tên gọi của cùng một việc', 'A proof of concept is only for open-source tools|||Proof of concept chỉ dành cho công cụ mã nguồn mở'], 1), explanation: 'A proof of concept is the last step of tool selection (SWT6 slide 51). The pilot comes after the tool is chosen and has its own objectives: learn the tool, fit the process, standardise its use, assess benefits at reasonable cost (slides 52–53).|||Proof of concept là bước cuối của việc chọn công cụ (SWT6 slide 51). Pilot diễn ra sau khi đã chọn và có mục tiêu riêng: hiểu công cụ, khớp quy trình, chuẩn hoá cách dùng, đánh giá lợi ích với chi phí hợp lý (slide 52–53).' },
    ],
  },
};

export default {
  title: 'Chapter 8 — Test tools & automation|||Chương 8 — Công cụ & tự động hoá',
  description: 'SWT6 (54 slide) học từng slide: mục đích & phân loại công cụ, probe effect, 6 nhóm công cụ theo hoạt động, lợi ích/rủi ro, capture/replay – data-driven – keyword-driven – MBT, chọn công cụ, pilot, yếu tố thành công — cộng thực hành JUnit 4 (bộ mẫu build.xml) → JUnit 5/Maven/JaCoCo, test pyramid, CI và Selenium.',
  lessons: [L81, L82, L83, L84, L85, L86, L87, QUIZ8],
};
