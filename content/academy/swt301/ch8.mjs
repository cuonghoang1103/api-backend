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
<p class="lead">The last chapter of the ISTQB syllabus (deck <em>SWT6</em>) is about <strong>tools</strong>. It is short in the exam (only <b>2 of 40</b> questions, SWT0 slide 7) but it is the chapter you will use every day in a job. This lesson explains <strong>why</strong> we use tools at all, the <strong>ways tools are classified</strong> (the syllabus uses one: by the test activity they support), what the little <strong>(D)</strong> on the next slides means, and a subtle idea examiners love: <strong>intrusive tools</strong> and the <strong>probe effect</strong>.</p>
<div class="callout"><b>Learning objectives.</b> LO-6.1.1 Classify test tools according to their purpose and the test activities they support (K2). The rest of Chapter 6 (6.1.2 benefits &amp; risks, 6.1.3 special considerations, 6.2.x selection, pilot, success factors) are all K1 — recognise and recall — and come in lessons 8.3–8.4.</div>
<h3>The six groups of tools in one screen</h3>
<table>
<thead><tr><th>Group (by test activity)</th><th>Tools in the group</th><th>Typical user</th></tr></thead>
<tbody>
<tr><td>1 · Management of testing &amp; testware</td><td>Test management &amp; ALM, requirements management, defect management, configuration management, continuous integration <b>(D)</b></td><td>Test manager, whole team</td></tr>
<tr><td>2 · Static testing</td><td>Review support tools, static analysis tools <b>(D)</b></td><td>Reviewers; developers</td></tr>
<tr><td>3 · Test design &amp; implementation</td><td>Test design, model-based testing, test data preparation, ATDD &amp; BDD, TDD <b>(D)</b></td><td>Testers, BA, developers</td></tr>
<tr><td>4 · Test execution &amp; logging</td><td>Test execution tools, coverage tools <b>(D)</b>, test harnesses <b>(D)</b>, unit test frameworks <b>(D)</b></td><td>Testers, developers</td></tr>
<tr><td>5 · Performance measurement &amp; dynamic analysis</td><td>Performance/load testing tools <b>(D)</b>, monitoring tools, dynamic analysis tools <b>(D)</b></td><td>Performance specialists, ops, developers</td></tr>
<tr><td>6 · Specialised testing needs</td><td>Data quality, data conversion &amp; migration, usability, accessibility, localisation, security, portability</td><td>Specialists</td></tr>
</tbody>
</table>
<p><b>(D)</b> = "more likely to be used by developers" — mostly at component and component-integration level.</p>`,
      `<span class="eyebrow">Chương 8 · Bài 8.1 · SWT6 slide 1–8</span>
<h2>Công cụ hỗ trợ kiểm thử — vì sao cần, và được phân loại thế nào</h2>
<p class="lead">Chương cuối của syllabus ISTQB (bộ slide <em>SWT6</em>) nói về <strong>công cụ</strong>. Trong đề thi nó ngắn (chỉ <b>2/40</b> câu, SWT0 slide 7) nhưng lại là chương bạn dùng hằng ngày khi đi làm. Bài này giải thích <strong>vì sao</strong> phải dùng công cụ, <strong>các cách phân loại công cụ</strong> (syllabus dùng một cách: theo hoạt động kiểm thử mà công cụ hỗ trợ), chữ <strong>(D)</strong> nhỏ trên các slide sau nghĩa là gì, và một ý tinh tế mà giám khảo rất thích: <strong>công cụ xâm lấn (intrusive tool)</strong> và <strong>hiệu ứng thăm dò (probe effect)</strong>.</p>
<div class="callout"><b>Chuẩn đầu ra.</b> LO-6.1.1 Phân loại công cụ test theo mục đích và theo hoạt động kiểm thử mà chúng hỗ trợ (K2). Phần còn lại của Chương 6 (6.1.2 lợi ích &amp; rủi ro, 6.1.3 lưu ý đặc biệt, 6.2.x chọn công cụ, pilot, yếu tố thành công) đều là K1 — nhận biết và nhớ lại — nằm ở bài 8.3–8.4.</div>
<h3>Sáu nhóm công cụ trong một màn hình</h3>
<table>
<thead><tr><th>Nhóm (theo hoạt động test)</th><th>Các công cụ trong nhóm</th><th>Ai hay dùng</th></tr></thead>
<tbody>
<tr><td>1 · Quản lý kiểm thử &amp; testware</td><td>Quản lý test &amp; ALM, quản lý yêu cầu, quản lý defect, quản lý cấu hình, tích hợp liên tục (CI) <b>(D)</b></td><td>Test manager, cả đội</td></tr>
<tr><td>2 · Kiểm thử tĩnh</td><td>Công cụ hỗ trợ review, công cụ phân tích tĩnh <b>(D)</b></td><td>Người review; developer</td></tr>
<tr><td>3 · Thiết kế &amp; triển khai test</td><td>Thiết kế test, model-based testing, chuẩn bị dữ liệu test, ATDD &amp; BDD, TDD <b>(D)</b></td><td>Tester, BA, developer</td></tr>
<tr><td>4 · Thực thi &amp; ghi log test</td><td>Công cụ thực thi test, công cụ đo coverage <b>(D)</b>, test harness <b>(D)</b>, unit test framework <b>(D)</b></td><td>Tester, developer</td></tr>
<tr><td>5 · Đo hiệu năng &amp; phân tích động</td><td>Công cụ test hiệu năng/tải <b>(D)</b>, công cụ giám sát (monitoring), công cụ phân tích động <b>(D)</b></td><td>Chuyên gia hiệu năng, vận hành, developer</td></tr>
<tr><td>6 · Nhu cầu kiểm thử đặc thù</td><td>Chất lượng dữ liệu, chuyển đổi &amp; di trú dữ liệu, usability, accessibility, bản địa hoá, bảo mật, portability</td><td>Chuyên gia</td></tr>
</tbody>
</table>
<p><b>(D)</b> = "thường do developer dùng" — chủ yếu ở cấp component và component integration.</p>`),
    walkHead(D, 1, 8, 'SWT6 has <b>no Question slides</b> — the check-yourself questions are in Quiz 8 at the end of the chapter.', 'SWT6 <b>không có slide Question</b> — câu hỏi tự kiểm tra nằm ở Quiz 8 cuối chương.'),
    walk(D, [
      [1, 'Tools (cover)',
        `<p>The six-box map of the ISTQB syllabus again, this time with box <strong>6 Tools</strong> highlighted: this deck is <em>Chapter 6</em> of the syllabus. On this site it is Chapter 8 because the course inserts an Agile chapter and hands-on practice. The notes only translate "Principles" (Nguyên tắc) — the first box.</p>`,
        `<p>Lại là sơ đồ sáu ô của syllabus ISTQB, lần này ô <strong>6 Tools</strong> được tô: bộ slide này là <em>Chương 6</em> của syllabus. Trên trang này nó là Chương 8 vì môn học chèn thêm chương Agile và phần thực hành. Ghi chú của thầy/cô chỉ dịch chữ "Principles" (Nguyên tắc) — ô đầu tiên.</p>`],
      [2, 'CONTENT',
        `<p>Two parts only — exactly the two sections of syllabus Chapter 6: <strong>6.1 Test tool considerations</strong> (what tools exist, benefits and risks, special considerations) and <strong>6.2 Effective use of tools</strong> (how to select a tool, run a pilot project and roll it out successfully). Lessons 8.1–8.3 cover part 1; lesson 8.4 covers part 2.</p>`,
        `<p>Chỉ có hai phần — đúng hai mục của Chương 6 syllabus: <strong>6.1 Test tool considerations</strong> (có những công cụ gì, lợi ích và rủi ro, các lưu ý đặc biệt) và <strong>6.2 Effective use of tools</strong> (chọn công cụ thế nào, chạy dự án pilot, triển khai thành công). Bài 8.1–8.3 là phần 1; bài 8.4 là phần 2.</p>`],
      [3, 'Mind map — Chap 6 Tool Support for Testing',
        `<p>The whole chapter as a mind map. Right branch <strong>Test Tool Considerations</strong> splits into: <em>Test Tool Classification</em> (six leaves: Tool classification, Management of testing &amp; testware, Static testing, Test design &amp; specification, Performance &amp; dynamic analysis, Specialised needs); <em>Benefits &amp; Risks of Test Automation</em>; and <em>Execution &amp; Management Tools Considerations</em> (Test execution — capture/replay, data-driven, keyword-driven, model-based — and Test management). Left branch <strong>Effective Use of Tools</strong>: Principles for tool selection, Pilot project, Success factors. Notice the leaf "Test Design &amp; <em>Specification</em>": the 2018 syllabus renamed it "Test design &amp; <em>implementation</em>" (slides 16–20 use the new name). The execution-tool leaf does not list "Test execution &amp; logging" — it is simply the "Test Execution" leaf. The map reappears at slides 5, 36, 41 and 49 as a "you are here" marker.</p>`,
        `<p>Cả chương dưới dạng sơ đồ tư duy. Nhánh phải <strong>Test Tool Considerations</strong> tách thành: <em>Test Tool Classification</em> (sáu lá: Phân loại công cụ, Quản lý kiểm thử &amp; testware, Kiểm thử tĩnh, Thiết kế &amp; đặc tả test, Hiệu năng &amp; phân tích động, Nhu cầu đặc thù); <em>Benefits &amp; Risks of Test Automation</em>; và <em>Execution &amp; Management Tools Considerations</em> (Thực thi test — capture/replay, data-driven, keyword-driven, model-based — và Quản lý test). Nhánh trái <strong>Effective Use of Tools</strong>: Nguyên tắc chọn công cụ, Dự án pilot, Yếu tố thành công. Để ý lá "Test Design &amp; <em>Specification</em>": syllabus 2018 đã đổi tên thành "Test design &amp; <em>implementation</em>" (slide 16–20 dùng tên mới). Sơ đồ này quay lại ở slide 5, 36, 41 và 49 như dấu "bạn đang ở đây".</p>`],
      [4, 'CONTENT — Test tool considerations',
        `<p>The first part, zoomed in: <strong>test tool classifications</strong> · <strong>benefits &amp; risks of test automation</strong> · <strong>special considerations for test execution &amp; test management tools</strong>. These three bullets are the three learning objectives LO-6.1.1, 6.1.2 and 6.1.3.</p>`,
        `<p>Phóng to phần thứ nhất: <strong>phân loại công cụ</strong> · <strong>lợi ích &amp; rủi ro của tự động hoá kiểm thử</strong> · <strong>lưu ý đặc biệt cho công cụ thực thi &amp; công cụ quản lý test</strong>. Ba gạch đầu dòng này chính là ba chuẩn đầu ra LO-6.1.1, 6.1.2 và 6.1.3.</p>`],
      [5, 'Mind map (repeated)',
        `<p>The same mind map as slide 3 — the teacher shows it again before starting the first leaf, <em>Tool Classification</em>. Nothing new; use it to check you can name all six classification leaves from memory.</p>`,
        `<p>Sơ đồ giống slide 3 — thầy/cô chiếu lại trước khi vào lá đầu tiên, <em>Tool Classification</em>. Không có gì mới; hãy dùng nó để tự kiểm tra bạn nhớ đủ sáu lá phân loại.</p>`],
      [6, 'Tool Classification — purposes for using tools',
        `<p>Five <strong>purposes</strong> of using tools (the red words are the keys):</p>
<ol>
<li><strong>Automating repetitive tasks</strong> or tasks that need significant resources manually — <em>efficiency</em> (regression runs, re-entering the same data, setting up environments).</li>
<li><strong>Supporting manual test activities</strong> throughout the process — <em>efficiency</em> (a test management tool helps you plan, log and report even when every test is run by hand).</li>
<li><strong>Improving the quality of test activities</strong> — more consistent testing and a higher level of <em>defect reproducibility</em> (the tool does exactly the same thing every time and records it).</li>
<li><strong>Automating what cannot be done manually</strong> — e.g. simulating 10,000 concurrent users, measuring response time in milliseconds.</li>
<li><strong>Increasing the reliability of testing</strong> — e.g. comparing two large data files, which a tired human would get wrong.</li>
</ol>
<p>The teacher's notes are a line-by-line Vietnamese translation. Memory hook: <em>faster, helps people, better, impossible-by-hand, more reliable</em>.</p>`,
        `<p>Năm <strong>mục đích</strong> dùng công cụ (chữ đỏ là chữ khoá):</p>
<ol>
<li><strong>Tự động hoá việc lặp đi lặp lại</strong> hoặc việc làm tay tốn nhiều nguồn lực — <em>hiệu quả</em> (chạy regression, nhập lại cùng dữ liệu, dựng môi trường).</li>
<li><strong>Hỗ trợ các hoạt động test thủ công</strong> suốt quy trình — <em>hiệu quả</em> (công cụ quản lý test giúp lập kế hoạch, ghi log, báo cáo ngay cả khi mọi test đều chạy tay).</li>
<li><strong>Nâng chất lượng hoạt động test</strong> — test nhất quán hơn và <em>khả năng tái hiện lỗi</em> cao hơn (công cụ làm y hệt nhau mỗi lần và ghi lại).</li>
<li><strong>Tự động hoá việc không thể làm tay</strong> — vd giả lập 10.000 người dùng đồng thời, đo thời gian phản hồi tính bằng mili giây.</li>
<li><strong>Tăng độ tin cậy của kiểm thử</strong> — vd so sánh hai file dữ liệu lớn, việc mà người mệt mỏi sẽ làm sai.</li>
</ol>
<p>Ghi chú của thầy/cô là bản dịch tiếng Việt từng dòng. Mẹo nhớ: <em>nhanh hơn, đỡ người, tốt hơn, tay không làm nổi, tin cậy hơn</em>.</p>`],
      [7, 'Tool Classification — how are tools classified?',
        `<p>Tools can be classified in several ways: by <strong>purpose</strong>; by <strong>licensing model</strong> (commercial, free, open source, freemium…); by <strong>price</strong>; by <strong>technology used</strong> (web, mobile, API, desktop, embedded); and by the <strong>testing activities/areas supported</strong>. The ISTQB syllabus uses the <em>last</em> one — tools grouped by the test activity they support — and that is the classification the rest of the deck follows (slides 9–34). Note that one commercial product often covers several groups (a "tool suite"): Jira + Xray does test management, defect management and requirements traceability at once.</p>`,
        `<p>Có nhiều cách phân loại công cụ: theo <strong>mục đích</strong>; theo <strong>mô hình bản quyền</strong> (thương mại, miễn phí, mã nguồn mở, freemium…); theo <strong>giá</strong>; theo <strong>công nghệ</strong> (web, mobile, API, desktop, nhúng); và theo <strong>hoạt động/lĩnh vực kiểm thử được hỗ trợ</strong>. Syllabus ISTQB dùng cách <em>cuối cùng</em> — nhóm công cụ theo hoạt động test mà nó hỗ trợ — và phần còn lại của bộ slide đi theo cách đó (slide 9–34). Lưu ý một sản phẩm thương mại thường phủ nhiều nhóm ("bộ công cụ"): Jira + Xray vừa quản lý test, vừa quản lý defect, vừa truy vết yêu cầu.</p>`],
      [8, 'Tool Classification — intrusive tools & probe effect',
        `<p>An <strong>intrusive tool</strong> is one that has to get <em>inside</em> the system under test (SUT) to do its job, and so may change how the SUT behaves. The <strong>consequence</strong> — the difference the tool itself causes — is called the <strong>probe effect</strong>. The slide gives three examples:</p>
<ul>
<li><strong>Performance tools</strong> record a start and a stop time for each transaction; storing those timestamps adds a tiny extra time to the very response time being measured.</li>
<li><strong>Coverage tools</strong> add <em>instrumentation code</em> into the real code (JaCoCo inserts probes into the bytecode) — the instrumented program is not exactly the program you ship, it runs slower, and two coverage tools may even report different percentages for the same tests because they count elements differently.</li>
<li><strong>Heisenbugs</strong> — the teacher's note: "a software bug that seems to disappear or change its behaviour when one attempts to study it". Classic case: a race condition that vanishes when you run in the debugger or add a <code>println</code>, because the timing changed.</li>
</ul>
<div class="callout ok"><b>How to remember:</b> the <em>tool</em> is intrusive; the <em>effect</em> on the SUT is the probe effect. The name comes from physics (measuring something disturbs it); "Heisenbug" is a pun on Heisenberg.</div>`,
        `<p><strong>Công cụ xâm lấn (intrusive tool)</strong> là công cụ phải chui <em>vào bên trong</em> hệ thống đang test (SUT) mới làm được việc, và vì thế có thể làm SUT chạy khác đi. <strong>Hậu quả</strong> — sự khác biệt do chính công cụ gây ra — gọi là <strong>probe effect (hiệu ứng thăm dò)</strong>. Slide nêu ba ví dụ:</p>
<ul>
<li><strong>Công cụ hiệu năng</strong> ghi thời điểm bắt đầu và kết thúc mỗi giao dịch; việc lưu các mốc thời gian đó cộng thêm một chút thời gian vào chính thời gian phản hồi đang đo.</li>
<li><strong>Công cụ đo coverage</strong> chèn <em>mã đo (instrumentation)</em> vào code thật (JaCoCo chèn "probe" vào bytecode) — chương trình đã chèn không y hệt chương trình bạn giao, nó chạy chậm hơn, và hai công cụ coverage khác nhau có thể báo phần trăm khác nhau cho cùng bộ test vì cách đếm phần tử khác nhau.</li>
<li><strong>Heisenbug</strong> — ghi chú của thầy/cô: "lỗi phần mềm dường như biến mất hoặc đổi hành vi khi người ta cố nghiên cứu nó". Ví dụ kinh điển: lỗi tranh chấp (race condition) biến mất khi chạy trong debugger hoặc thêm một dòng <code>println</code>, vì thời gian chạy đã thay đổi.</li>
</ul>
<div class="callout ok"><b>Cách nhớ:</b> <em>công cụ</em> thì xâm lấn; <em>ảnh hưởng</em> lên SUT là probe effect. Tên gọi lấy từ vật lý (đo một thứ là làm xáo trộn nó); "Heisenbug" là chơi chữ từ tên Heisenberg.</div>`],
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
<tr><td>8</td><td>JaCoCo</td><td>Execution &amp; logging → coverage tool</td><td>D</td><td><b>yes</b> — instruments bytecode</td></tr>
<tr><td>9</td><td>Selenium WebDriver, Playwright</td><td>Execution &amp; logging → test execution tool</td><td>no</td><td>mildly — drives the real UI through a browser driver</td></tr>
<tr><td>10</td><td>JMeter, k6</td><td>Performance &amp; dynamic analysis → performance/load testing</td><td>D*</td><td><b>yes</b> — load generation + timing adds its own load and overhead</td></tr>
<tr><td>11</td><td>Valgrind, VisualVM profiler</td><td>Performance &amp; dynamic analysis → dynamic analysis (memory leaks)</td><td>D</td><td><b>yes</b> — the program runs many times slower under Valgrind</td></tr>
<tr><td>12</td><td>OWASP ZAP; axe</td><td>Specialised needs → security; accessibility</td><td>no</td><td>ZAP sends real attacks, so run it only on a test environment</td></tr>
</tbody>
</table></div>
<p>*The syllabus marks performance testing tools (D) although in practice specialist performance testers use them at system level (slide 25). Answer as the syllabus does.</p>
<div class="pitfall"><b>Two exam traps.</b> (1) "The probe effect is a type of tool" — no: it is the <em>consequence</em> of using an intrusive tool. (2) "Tools are classified by price in the syllabus" — no: several classifications are possible (slide 7), but the syllabus groups tools by the <em>test activity</em> they support. Also remember a single product can belong to several groups.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Measuring without disturbing.</b> Modern observability tries hard to shrink the probe effect: <em>sampling profilers</em> (async-profiler, Java Flight Recorder) look at the stack a few hundred times per second instead of timing every call, adding around 1–2&nbsp;% overhead; Linux <em>eBPF</em> probes attach to the kernel without changing the application at all. For race conditions, instead of hoping the Heisenbug reappears, teams use deterministic tools such as <em>ThreadSanitizer</em> or Java's <em>jcstress</em>, which systematically explore thread interleavings. <em>Outside the syllabus because CTFL only asks you to recognise the probe effect, not to engineer around it.</em></div>`,
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
<tr><td>8</td><td>JaCoCo</td><td>Thực thi &amp; log → công cụ đo coverage</td><td>D</td><td><b>có</b> — chèn mã đo vào bytecode</td></tr>
<tr><td>9</td><td>Selenium WebDriver, Playwright</td><td>Thực thi &amp; log → công cụ thực thi test</td><td>không</td><td>nhẹ — điều khiển UI thật qua browser driver</td></tr>
<tr><td>10</td><td>JMeter, k6</td><td>Hiệu năng &amp; phân tích động → test hiệu năng/tải</td><td>D*</td><td><b>có</b> — việc sinh tải + bấm giờ tự nó thêm tải và độ trễ</td></tr>
<tr><td>11</td><td>Valgrind, VisualVM profiler</td><td>Hiệu năng &amp; phân tích động → phân tích động (rò rỉ bộ nhớ)</td><td>D</td><td><b>có</b> — chương trình chạy chậm đi nhiều lần dưới Valgrind</td></tr>
<tr><td>12</td><td>OWASP ZAP; axe</td><td>Nhu cầu đặc thù → bảo mật; accessibility</td><td>không</td><td>ZAP gửi tấn công thật, nên chỉ chạy trên môi trường test</td></tr>
</tbody>
</table></div>
<p>*Syllabus đánh dấu công cụ test hiệu năng là (D) dù thực tế chuyên gia hiệu năng mới là người dùng chúng ở cấp system (slide 25). Khi thi, trả lời theo syllabus.</p>
<div class="pitfall"><b>Hai bẫy trong đề.</b> (1) "Probe effect là một loại công cụ" — sai: nó là <em>hậu quả</em> của việc dùng công cụ xâm lấn. (2) "Syllabus phân loại công cụ theo giá" — sai: có nhiều cách phân loại (slide 7), nhưng syllabus nhóm công cụ theo <em>hoạt động kiểm thử</em> mà chúng hỗ trợ. Nhớ thêm: một sản phẩm có thể thuộc nhiều nhóm.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Đo mà không làm xáo trộn.</b> Observability hiện đại cố thu nhỏ probe effect: <em>sampling profiler</em> (async-profiler, Java Flight Recorder) chỉ nhìn ngăn xếp vài trăm lần mỗi giây thay vì bấm giờ từng lời gọi, tốn khoảng 1–2&nbsp;% hiệu năng; probe <em>eBPF</em> của Linux gắn vào nhân hệ điều hành mà không sửa ứng dụng. Với lỗi tranh chấp, thay vì cầu mong Heisenbug hiện lại, các đội dùng công cụ tất định như <em>ThreadSanitizer</em> hay <em>jcstress</em> của Java để duyệt có hệ thống các thứ tự xen kẽ luồng. <em>Ngoài giáo trình vì CTFL chỉ yêu cầu nhận ra probe effect, không yêu cầu kỹ thuật né nó.</em></div>`),
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
<div class="callout"><b>Learning objective.</b> LO-6.1.1 Classify test tools according to their purpose and the test activities they support (K2) — the only K2 objective of the chapter, so expect a scenario question.</div>
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
<div class="callout"><b>Chuẩn đầu ra.</b> LO-6.1.1 Phân loại công cụ test theo mục đích và hoạt động test mà chúng hỗ trợ (K2) — chuẩn đầu ra K2 duy nhất của chương, nên hãy chờ một câu hỏi tình huống.</div>
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
        `<p>Five circles make up group 1: <strong>Reqs. Mgt. tools</strong>, <strong>Defect Mgt. tools</strong>, <strong>Config. Mgt. tools</strong>, <strong>Test Mgt. &amp; "AML" tools</strong> and <strong>CI tools (D)</strong>. The callout points at test management:</p>
<ul>
<li><strong>Test management tools</strong> support the <em>test management and control</em> part of the test process — planning, scheduling, test case repository, execution logs, progress and coverage reports (TestRail, Xray, Zephyr, qTest).</li>
<li><strong>ALM tools</strong> (Application Lifecycle Management) manage testing, development and deployment together, focusing on communication, collaboration and task tracking; popular in Agile (Jira, Azure DevOps).</li>
</ul>
<p><b>Typo on the slide:</b> "AML" should read <strong>ALM</strong> — the teacher's note itself says "Agile ALM is the practice of using Agile processes to manage your requirements, issues, and tests".</p>`,
        `<p>Năm vòng tròn tạo thành nhóm 1: <strong>công cụ quản lý yêu cầu</strong>, <strong>quản lý defect</strong>, <strong>quản lý cấu hình</strong>, <strong>quản lý test &amp; "AML"</strong> và <strong>công cụ CI (D)</strong>. Khung chú thích chỉ vào quản lý test:</p>
<ul>
<li><strong>Công cụ quản lý test</strong> hỗ trợ phần <em>quản lý và kiểm soát</em> của quy trình test — lập kế hoạch, lịch, kho test case, log thực thi, báo cáo tiến độ và độ phủ (TestRail, Xray, Zephyr, qTest).</li>
<li><strong>Công cụ ALM</strong> (Application Lifecycle Management — quản lý vòng đời ứng dụng) quản lý cả kiểm thử, phát triển và triển khai, tập trung vào giao tiếp, cộng tác và theo dõi công việc; phổ biến trong Agile (Jira, Azure DevOps).</li>
</ul>
<p><b>Lỗi đánh máy trên slide:</b> "AML" phải là <strong>ALM</strong> — chính ghi chú của thầy/cô viết "Agile ALM is the practice of using Agile processes to manage your requirements, issues, and tests".</p>`],
      [10, 'Management — Requirements management tools',
        `<p><strong>Requirements management tools</strong> store requirements (and user stories) with their attributes, and — the key word for the exam — support <strong>traceability between requirements and tests</strong>. Because "tests are created based on requirements", the tool can answer "which requirements have no test?" and "which tests must be re-run if requirement R12 changes?" (impact analysis). Some of them also check requirements for consistency or undefined terms (e.g. Jama, IBM DOORS, Jira with links).</p>`,
        `<p><strong>Công cụ quản lý yêu cầu</strong> lưu yêu cầu (và user story) cùng các thuộc tính, và — chữ khoá khi thi — hỗ trợ <strong>truy vết (traceability) giữa yêu cầu và test</strong>. Vì "test được tạo dựa trên yêu cầu", công cụ trả lời được "yêu cầu nào chưa có test?" và "đổi yêu cầu R12 thì phải chạy lại test nào?" (phân tích ảnh hưởng). Một số còn kiểm yêu cầu có mâu thuẫn hay thuật ngữ chưa định nghĩa (vd Jama, IBM DOORS, Jira có liên kết).</p>`],
      [11, 'Management — Defect management tools',
        `<p><strong>Defect management tools</strong> are also called <em>incident management</em> or <em>bug tracking</em> tools (Jira, Bugzilla, Mantis, Redmine). What gets recorded during testing is information about <strong>failures</strong> — what was observed — not yet a confirmed <em>defect</em>: an anomaly may turn out to be a test mistake, an environment problem or a duplicate. The tool supports the whole <strong>incident (defect) report life cycle</strong>: New → Assigned → Fixed → Retested → Closed/Reopened, with workflow, severity/priority fields and statistics for reports. Link it with Chapter 5 (defect report content and life cycle, fst4 Fig. 5.3).</p>`,
        `<p><strong>Công cụ quản lý defect</strong> còn gọi là công cụ <em>quản lý sự cố (incident)</em> hay <em>theo dõi bug</em> (Jira, Bugzilla, Mantis, Redmine). Thứ được ghi lại khi test là thông tin về <strong>failure</strong> — điều quan sát được — chứ chưa phải <em>defect</em> đã xác nhận: một bất thường có thể hoá ra là do test sai, do môi trường, hoặc trùng lặp. Công cụ hỗ trợ trọn <strong>vòng đời báo cáo sự cố (defect)</strong>: New → Assigned → Fixed → Retested → Closed/Reopened, có luồng công việc, trường severity/priority và thống kê cho báo cáo. Nối với Chương 5 (nội dung và vòng đời defect report, fst4 Hình 5.3).</p>`],
      [12, 'Management — Configuration management tools',
        `<p>"Not exactly a testing tool, but…" <strong>configuration management (CM) tools</strong> greatly aid testing, especially in complex environments. They keep versions of the test object <em>and</em> of the testware (test scripts, data, environment definitions) so that you always know <em>which version was tested with which tests</em> — without that, a defect report ("fails in build 1.4.2") cannot be reproduced. Examples: Git, SVN, plus artifact repositories (Nexus) and infrastructure-as-code (Docker, Terraform) for environments.</p>`,
        `<p>"Không hẳn là công cụ test, nhưng…" <strong>công cụ quản lý cấu hình (CM)</strong> giúp kiểm thử rất nhiều, nhất là trong môi trường phức tạp. Chúng giữ phiên bản của đối tượng test <em>và</em> của testware (script test, dữ liệu, định nghĩa môi trường) để bạn luôn biết <em>phiên bản nào đã được test bằng những test nào</em> — thiếu điều đó thì một defect report ("lỗi ở build 1.4.2") không thể tái hiện. Ví dụ: Git, SVN, thêm kho artifact (Nexus) và hạ tầng dạng mã (Docker, Terraform) cho môi trường.</p>`],
      [13, 'Management — Continuous Integration tools (D)',
        `<p><strong>CI tools (D)</strong> — Jenkins, GitHub Actions, GitLab CI:</p>
<ul>
<li>more likely to be used by <strong>developers</strong> (hence the D);</li>
<li>an essential part of the <strong>Agile toolkit</strong>;</li>
<li>integration of new or changed code with the existing code base happens <strong>very frequently</strong> (many times a day);</li>
<li><strong>unit tests are often run automatically when a new build is made</strong> — a red build stops the change.</li>
</ul>
<p>Lesson 8.6 builds a real pipeline around the JUnit tests of lesson 8.5.</p>`,
        `<p><strong>Công cụ CI (D)</strong> — Jenkins, GitHub Actions, GitLab CI:</p>
<ul>
<li>thường do <strong>developer</strong> dùng (vì thế có chữ D);</li>
<li>là phần thiết yếu của <strong>bộ công cụ Agile</strong>;</li>
<li>việc tích hợp code mới/đã sửa vào code hiện có diễn ra <strong>rất thường xuyên</strong> (nhiều lần mỗi ngày);</li>
<li><strong>unit test thường tự động chạy mỗi khi có build mới</strong> — build đỏ thì thay đổi bị chặn.</li>
</ul>
<p>Bài 8.6 dựng một pipeline thật quanh các JUnit test của bài 8.5.</p>`],
      [14, 'Static testing — Review tools',
        `<p>Group 2 has two circles: <strong>Review tools</strong> and <strong>Static analysis tools (D)</strong>. Review tools are <strong>more beneficial when reviews are formal</strong> (inspections, Chapter 3): they store the documents under review, collect comments and defects from each reviewer, support online meetings for distributed teams, and keep metrics. The slide's example: <em>monitor reviewers' checking rate</em> — the tool calculates pages (or lines) checked per hour and flags exceptions, e.g. a reviewer who "checked" 40 pages in 10 minutes did not really check. Examples today: GitHub/GitLab pull-request review, Gerrit, Crucible.</p>`,
        `<p>Nhóm 2 có hai vòng: <strong>công cụ review</strong> và <strong>công cụ phân tích tĩnh (D)</strong>. Công cụ review <strong>có ích hơn khi review là chính thức</strong> (inspection, Chương 3): lưu tài liệu đang review, gom nhận xét và defect của từng người review, hỗ trợ họp trực tuyến cho đội phân tán, và lưu số liệu. Ví dụ trên slide: <em>theo dõi tốc độ kiểm tra của người review</em> — công cụ tính số trang (hoặc dòng) được kiểm mỗi giờ và gắn cờ ngoại lệ, vd người "kiểm" 40 trang trong 10 phút thì thực ra không kiểm. Ví dụ ngày nay: review pull request trên GitHub/GitLab, Gerrit, Crucible.</p>`],
      [15, 'Static testing — Static analysis tools (D)',
        `<p><strong>Static analysis tools (D)</strong>:</p>
<ul>
<li>normally used by <strong>developers</strong> — while coding, in unit testing, to understand code structure, and to <strong>enforce coding standards</strong>;</li>
<li>an <strong>extension of compiler technology</strong> — they parse the code like a compiler but look for more (unreachable code, variables used before assignment, security holes, complexity metrics such as V(G));</li>
<li>can also be used on <strong>work products other than source code</strong>, e.g. requirements (ambiguity checkers) or <strong>websites</strong> (broken-link checkers, HTML validators).</li>
</ul>
<p>Examples: SonarQube, Checkstyle, PMD, SpotBugs, ESLint. You used them in Lab 1 (lab1-static deck, Chapter 3).</p>`,
        `<p><strong>Công cụ phân tích tĩnh (D)</strong>:</p>
<ul>
<li>thường do <strong>developer</strong> dùng — khi viết code, khi unit test, để hiểu cấu trúc code và để <strong>ép chuẩn viết code</strong>;</li>
<li>là <strong>phần mở rộng của công nghệ trình biên dịch</strong> — chúng phân tích code giống compiler nhưng tìm nhiều hơn (code không bao giờ chạy tới, biến dùng trước khi gán, lỗ hổng bảo mật, số đo độ phức tạp như V(G));</li>
<li>còn dùng được trên <strong>sản phẩm khác mã nguồn</strong>, vd yêu cầu (công cụ bắt câu mơ hồ) hay <strong>website</strong> (kiểm link hỏng, kiểm HTML hợp lệ).</li>
</ul>
<p>Ví dụ: SonarQube, Checkstyle, PMD, SpotBugs, ESLint. Bạn đã dùng chúng ở Lab 1 (bộ slide lab1-static, Chương 3).</p>`],
      [16, 'Test design & implementation — Test design tools',
        `<p>Group 3 has five circles: <strong>Model-based testing tools</strong>, <strong>Test data preparation tools</strong>, <strong>TDD tools (D)</strong>, <strong>Test design tools</strong> and <strong>ATDD &amp; BDD tools</strong>. The callout is on <strong>test design tools</strong>: they help construct test cases, or at least test inputs. Tests can be derived from <strong>formal requirements</strong>, from <strong>elements on a screen</strong> (fields, buttons → inputs to try) or from <strong>a model of the system</strong>. The drawback: <strong>expected results</strong> are hard to generate (the tool knows the inputs, not the right answer — the oracle problem), and tools tend to generate <strong>too many tests</strong>, so you must select. Examples: pairwise generators (PICT), decision-table generators. Slide typo: "Tests can be <em>derive</em>" → derived.</p>`,
        `<p>Nhóm 3 có năm vòng: <strong>công cụ model-based testing</strong>, <strong>chuẩn bị dữ liệu test</strong>, <strong>TDD (D)</strong>, <strong>thiết kế test</strong> và <strong>ATDD &amp; BDD</strong>. Khung chú thích chỉ vào <strong>công cụ thiết kế test</strong>: giúp xây test case, hoặc ít nhất là input của test. Test có thể được suy ra từ <strong>yêu cầu hình thức</strong>, từ <strong>các phần tử trên màn hình</strong> (ô nhập, nút bấm → input cần thử) hoặc từ <strong>mô hình của hệ thống</strong>. Nhược điểm: <strong>kết quả mong đợi</strong> khó sinh tự động (công cụ biết input chứ không biết đáp án đúng — bài toán oracle), và công cụ hay sinh <strong>quá nhiều test</strong> nên phải chọn lọc. Ví dụ: công cụ sinh pairwise (PICT), sinh bảng quyết định. Lỗi đánh máy trên slide: "Tests can be <em>derive</em>" → derived.</p>`],
      [17, 'Test design & implementation — Model-based testing tools',
        `<p><strong>Model-based testing (MBT) tools</strong> generate <strong>test inputs and test cases from models</strong> of the system — e.g. the <strong>state transition</strong> diagrams you drew in Chapter 4, activity diagrams, BPMN. Because the tests are generated, <strong>a change in the system (the model) triggers automatic generation of new tests</strong>: update one transition and the tool regenerates the affected cases. Examples: GraphWalker, Conformiq. Slide 46 comes back to MBT as a special consideration.</p>`,
        `<p><strong>Công cụ model-based testing (MBT)</strong> sinh <strong>input và test case từ mô hình</strong> của hệ thống — vd sơ đồ <strong>chuyển trạng thái</strong> bạn đã vẽ ở Chương 4, activity diagram, BPMN. Vì test được sinh ra, <strong>thay đổi hệ thống (mô hình) sẽ kích hoạt việc tự động sinh test mới</strong>: sửa một chuyển trạng thái là công cụ sinh lại các ca bị ảnh hưởng. Ví dụ: GraphWalker, Conformiq. Slide 46 quay lại MBT như một lưu ý đặc biệt.</p>`],
      [18, 'Test design & implementation — Test data preparation tools',
        `<p><strong>Test data preparation tools</strong> create, select or manipulate test data — from scratch (generators such as Faker), or by extracting and transforming production data:</p>
<ul>
<li>used by <strong>developers and testers</strong> (in system and/or acceptance testing) — slide typo "can be used <em>be</em> developers" → by;</li>
<li>especially useful in <strong>performance and reliability testing</strong>, which need very large volumes of realistic data;</li>
<li>useful for <strong>anonymising</strong> (masking) production data so it conforms to data-protection rules such as GDPR or Vietnam's Decree 13/2023 on personal data protection.</li>
</ul>`,
        `<p><strong>Công cụ chuẩn bị dữ liệu test</strong> tạo, chọn hoặc biến đổi dữ liệu test — từ đầu (bộ sinh như Faker), hoặc trích và biến đổi dữ liệu thật:</p>
<ul>
<li>được <strong>developer và tester</strong> dùng (trong system và/hoặc acceptance testing) — lỗi đánh máy "can be used <em>be</em> developers" → by;</li>
<li>đặc biệt có ích cho <strong>test hiệu năng và độ tin cậy</strong>, vốn cần khối lượng dữ liệu thật lớn và giống thật;</li>
<li>hữu ích để <strong>ẩn danh hoá</strong> (che) dữ liệu thật cho đúng các quy định bảo vệ dữ liệu như GDPR hay Nghị định 13/2023 của Việt Nam về bảo vệ dữ liệu cá nhân.</li>
</ul>`],
      [19, 'Test design & implementation — TDD tools (D)',
        `<p><strong>Test-driven development tools (D)</strong>: in TDD <strong>tests are written first</strong>, then just enough code is written to pass them (red → green → refactor). TDD tools <strong>provide a framework to write and run tests</strong>, basically unit tests — i.e. JUnit, NUnit, pytest, Jest are TDD tools <em>and</em> unit test frameworks (slide 24). Lesson 8.5 shows JUnit in action; Chapter 9 (Agile) returns to TDD, ATDD and BDD as practices.</p>`,
        `<p><strong>Công cụ phát triển hướng kiểm thử — TDD (D)</strong>: trong TDD <strong>test được viết trước</strong>, rồi mới viết vừa đủ code để test pass (đỏ → xanh → refactor). Công cụ TDD <strong>cung cấp framework để viết và chạy test</strong>, về cơ bản là unit test — tức JUnit, NUnit, pytest, Jest vừa là công cụ TDD <em>vừa là</em> unit test framework (slide 24). Bài 8.5 cho bạn thấy JUnit chạy thật; Chương 9 (Agile) quay lại TDD, ATDD và BDD như các thực hành.</p>`],
      [20, 'Test design & implementation — ATDD & BDD tools',
        `<p><strong>ATDD &amp; BDD tools</strong>:</p>
<ul>
<li><strong>ATDD</strong> (Acceptance Test-Driven Development) captures requirements by <strong>writing acceptance tests together with users</strong> before the feature is built (FitNesse, Robot Framework);</li>
<li><strong>BDD</strong> (Behaviour-Driven Development) focuses on the <strong>behaviour and functionality</strong> of the system, often driven by the dev team, written as <em>Given / When / Then</em> scenarios (Cucumber, SpecFlow, Behave);</li>
<li>these tools have a <strong>syntax (rules) that looks like natural language</strong> — Gherkin — so business people can read and even write the tests, while developers bind each step to code.</li>
</ul>`,
        `<p><strong>Công cụ ATDD &amp; BDD</strong>:</p>
<ul>
<li><strong>ATDD</strong> (phát triển hướng kiểm thử chấp nhận) nắm bắt yêu cầu bằng cách <strong>viết acceptance test cùng với người dùng</strong> trước khi xây tính năng (FitNesse, Robot Framework);</li>
<li><strong>BDD</strong> (phát triển hướng hành vi) tập trung vào <strong>hành vi và chức năng</strong> của hệ thống, thường do đội dev dẫn dắt, viết thành kịch bản <em>Given / When / Then</em> (Cucumber, SpecFlow, Behave);</li>
<li>các công cụ này có <strong>cú pháp (luật) trông như ngôn ngữ tự nhiên</strong> — Gherkin — nên người nghiệp vụ đọc được, thậm chí tự viết được test, còn developer gắn mỗi bước với code.</li>
</ul>`],
      [21, 'Execution & logging — Test execution tools',
        `<p>Group 4 has four circles: <strong>Coverage tools (D)</strong>, <strong>Test harnesses (D)</strong>, <strong>Test execution tools</strong> and <strong>Unit test framework tools (D)</strong>. Test execution tools:</p>
<ul>
<li>provide an <strong>interface to the SUT</strong> (through the GUI, an API or the command line);</li>
<li><strong>run tests as if run by a real user</strong> — clicking, typing, reading the screen;</li>
<li>tests are <strong>scripts in a programmable language</strong> (Java, Python, JavaScript, or a tool-specific language);</li>
<li>data, test inputs and <strong>expected results are held in a test repository</strong>, and the tool compares actual with expected and logs the outcome;</li>
<li>most often used in <strong>automated regression testing</strong>;</li>
<li><strong>capture/replay</strong> — recording a manual tester's actions — is <em>problematic</em> (slide 43 explains why).</li>
</ul>
<p>Examples: Selenium WebDriver, Playwright, Appium (mobile), Postman/REST Assured (API), UFT, Katalon.</p>`,
        `<p>Nhóm 4 có bốn vòng: <strong>công cụ coverage (D)</strong>, <strong>test harness (D)</strong>, <strong>công cụ thực thi test</strong> và <strong>unit test framework (D)</strong>. Công cụ thực thi test:</p>
<ul>
<li>cung cấp <strong>giao diện tới SUT</strong> (qua GUI, API hoặc dòng lệnh);</li>
<li><strong>chạy test như thể người dùng thật chạy</strong> — bấm, gõ, đọc màn hình;</li>
<li>test là <strong>script viết bằng ngôn ngữ lập trình</strong> (Java, Python, JavaScript, hoặc ngôn ngữ riêng của công cụ);</li>
<li>dữ liệu, input và <strong>kết quả mong đợi được giữ trong kho test (repository)</strong>, công cụ so thực tế với mong đợi và ghi log;</li>
<li>dùng nhiều nhất cho <strong>regression test tự động</strong>;</li>
<li><strong>capture/replay</strong> — ghi lại thao tác của tester thủ công — là cách <em>có vấn đề</em> (slide 43 giải thích vì sao).</li>
</ul>
<p>Ví dụ: Selenium WebDriver, Playwright, Appium (mobile), Postman/REST Assured (API), UFT, Katalon.</p>`],
      [22, 'Execution & logging — Coverage tools (D)',
        `<p><strong>Coverage tools (D)</strong> give an <strong>objective measure of which parts of the software structure were executed by the tests</strong>. They first <strong>identify the elements that can be counted</strong> (statements, decisions/branches, methods — or requirements, for requirements coverage), then instrument the code, run the tests, and <strong>report what has and has not been covered</strong>. This is how you get the statement and decision coverage numbers of Chapter 4 without counting by hand. Examples: JaCoCo (Java — used by the course's build.xml, lesson 8.5), Istanbul/nyc (JavaScript), coverage.py. Remember from slide 8 that they are intrusive.</p>`,
        `<p><strong>Công cụ coverage (D)</strong> cho <strong>số đo khách quan về phần nào của cấu trúc phần mềm đã được test chạy qua</strong>. Chúng trước hết <strong>xác định các phần tử đếm được</strong> (câu lệnh, quyết định/nhánh, phương thức — hoặc yêu cầu, với requirements coverage), rồi chèn mã đo, chạy test và <strong>báo cáo cái gì đã và chưa được phủ</strong>. Đây là cách có con số statement coverage và decision coverage của Chương 4 mà không phải đếm tay. Ví dụ: JaCoCo (Java — chính là công cụ trong build.xml của môn, bài 8.5), Istanbul/nyc (JavaScript), coverage.py. Nhớ slide 8: chúng là công cụ xâm lấn.</p>`],
      [23, 'Execution & logging — Test harnesses (D)',
        `<p>A <strong>test harness (D)</strong> is the <strong>test environment that provides drivers and stubs</strong> so that the <strong>IUT</strong> (implementation/item under test) can be tested <strong>on as small a scale as possible</strong> — one component, isolated from the rest. A <em>driver</em> calls the component (plays the role of the missing caller); a <em>stub</em> replaces a component it calls (returns canned answers). Link with Chapter 2 (component and integration testing) and Lab 2. Today harnesses are mostly built with frameworks: JUnit acts as the driver, Mockito creates stubs and mocks.</p>`,
        `<p><strong>Test harness (D)</strong> là <strong>môi trường test cung cấp driver và stub</strong> để <strong>IUT</strong> (phần tử/bản cài đặt đang test) được test <strong>ở quy mô nhỏ nhất có thể</strong> — một component, tách khỏi phần còn lại. <em>Driver</em> gọi component (đóng vai bên gọi còn thiếu); <em>stub</em> thay thế một component mà nó gọi (trả về câu trả lời dựng sẵn). Nối với Chương 2 (component và integration testing) và Lab 2. Ngày nay harness chủ yếu dựng bằng framework: JUnit đóng vai driver, Mockito tạo stub và mock. (Bản dịch "khai thác thử nghiệm" trong ghi chú là máy dịch chữ "harness" — thuật ngữ nên giữ nguyên là test harness.)</p>`],
      [24, 'Execution & logging — Unit test framework tools (D)',
        `<p><strong>Unit test framework tools (D)</strong> are software tools that <strong>support writing and running unit tests</strong>: annotations to mark tests, assertions to check results, fixtures for setup and teardown, runners and reports. They <strong>can be used in Agile to automate tests in parallel with development</strong> (and are the engine of TDD), and <strong>tend to be used in component and component-integration testing</strong>. JUnit (Java), NUnit/xUnit (.NET), pytest (Python), Jest/Vitest (JavaScript). You will run JUnit 4 and JUnit 5 for real in lesson 8.5.</p>`,
        `<p><strong>Unit test framework (D)</strong> là công cụ phần mềm <strong>hỗ trợ viết và chạy unit test</strong>: annotation đánh dấu test, assertion kiểm kết quả, fixture để dựng và dọn, bộ chạy và báo cáo. Chúng <strong>có thể dùng trong Agile để tự động hoá test song song với việc phát triển</strong> (và là động cơ của TDD), và <strong>thường dùng ở component testing và component integration testing</strong>. JUnit (Java), NUnit/xUnit (.NET), pytest (Python), Jest/Vitest (JavaScript). Bạn sẽ chạy JUnit 4 và JUnit 5 thật ở bài 8.5.</p>`],
      [25, 'Performance & dynamic analysis — Performance testing tools (D)',
        `<p>Group 5 has three circles: <strong>Performance testing tools (D)</strong>, <strong>Monitoring tools</strong> and <strong>Dynamic analysis tools (D)</strong>. Performance testing tools:</p>
<ul>
<li>focus on testing at <strong>system level</strong> to see whether the SUT will <strong>stand up to a high volume of usage</strong>;</li>
<li><strong>load generation</strong>: they simulate many users and/or high volumes of input data (slide typo: "<em>stimulates</em>" → simulates);</li>
<li><strong>reports</strong> based on logs, and graphs of <strong>load against response time</strong> — the "knee" of the curve shows the capacity limit.</li>
</ul>
<p>Examples: JMeter, Gatling, k6, LoadRunner. Link with Chapter 2: load, stress and scalability testing are non-functional test types.</p>`,
        `<p>Nhóm 5 có ba vòng: <strong>công cụ test hiệu năng (D)</strong>, <strong>công cụ giám sát</strong> và <strong>công cụ phân tích động (D)</strong>. Công cụ test hiệu năng:</p>
<ul>
<li>tập trung test ở <strong>cấp hệ thống</strong> để xem SUT có <strong>chịu nổi lượng sử dụng lớn</strong> không;</li>
<li><strong>sinh tải</strong>: giả lập nhiều người dùng và/hoặc khối lượng dữ liệu vào lớn (lỗi đánh máy: "<em>stimulates</em>" → simulates, nên bản dịch "kích thích" trong ghi chú thành ra sai nghĩa — phải là "giả lập");</li>
<li><strong>báo cáo</strong> dựa trên log, và đồ thị <strong>tải theo thời gian phản hồi</strong> — chỗ "gãy" của đường cong cho biết giới hạn năng lực.</li>
</ul>
<p>Ví dụ: JMeter, Gatling, k6, LoadRunner. Nối với Chương 2: load, stress và scalability testing là các loại test phi chức năng.</p>`],
      [26, 'Performance & dynamic analysis — Monitoring tools',
        `<p><strong>Monitoring tools</strong> <strong>continuously keep track of the status of the system in use</strong>, so they can <strong>give the earliest warnings</strong> (CPU at 95&nbsp;%, disk almost full, error rate rising) and help <strong>improve the service</strong>. There are monitoring tools for servers, networks, databases, security, performance, websites and internet usage. Examples: Prometheus + Grafana, Zabbix, Nagios, Datadog, uptime checkers. Note: monitoring tools are <em>not</em> marked (D) — operations teams and testers use them, in test environments and in production.</p>`,
        `<p><strong>Công cụ giám sát</strong> <strong>liên tục theo dõi tình trạng của hệ thống đang dùng</strong>, nhờ đó <strong>cảnh báo sớm nhất</strong> (CPU 95&nbsp;%, đĩa gần đầy, tỉ lệ lỗi tăng) và giúp <strong>cải thiện dịch vụ</strong>. Có công cụ giám sát cho máy chủ, mạng, CSDL, bảo mật, hiệu năng, website và việc dùng internet. Ví dụ: Prometheus + Grafana, Zabbix, Nagios, Datadog, công cụ kiểm tra uptime. Lưu ý: công cụ giám sát <em>không</em> có chữ (D) — đội vận hành và tester dùng chúng, cả ở môi trường test lẫn production.</p>`],
      [27, 'Performance & dynamic analysis — Dynamic analysis tools (D)',
        `<p><strong>Dynamic analysis tools (D)</strong> provide <strong>run-time information on the software while it is running</strong>. Examples on the slide: tracking the <strong>allocation, use and de-allocation of resources</strong>, e.g. detecting <strong>memory leaks</strong>; flagging <strong>unassigned pointers</strong> or <strong>pointer-arithmetic faults</strong>. These are defects that static analysis cannot see and that functional tests rarely reveal — a leak only shows up after hours of running. Examples: Valgrind, AddressSanitizer (C/C++), Java profilers (VisualVM, JFR), browser DevTools memory tab. Contrast: <em>static</em> analysis = without running; <em>dynamic</em> analysis = while running.</p>`,
        `<p><strong>Công cụ phân tích động (D)</strong> cung cấp <strong>thông tin lúc chạy về phần mềm khi nó đang chạy</strong>. Ví dụ trên slide: theo dõi <strong>cấp phát, sử dụng và giải phóng tài nguyên</strong>, vd phát hiện <strong>rò rỉ bộ nhớ</strong>; gắn cờ <strong>con trỏ chưa gán</strong> hoặc <strong>lỗi số học con trỏ</strong>. Đây là những defect mà phân tích tĩnh không thấy và test chức năng hiếm khi làm lộ — rò rỉ chỉ hiện ra sau hàng giờ chạy. Ví dụ: Valgrind, AddressSanitizer (C/C++), profiler Java (VisualVM, JFR), tab Memory của DevTools trình duyệt. Đối chiếu: phân tích <em>tĩnh</em> = không chạy; phân tích <em>động</em> = trong lúc chạy.</p>`],
      [28, 'Specialised needs — Data quality assessment',
        `<p>Group 6 is a ring of seven circles: <strong>Usability, Accessibility, Localisation, Security, Portability testing, Data conversion &amp; migration, Data quality assessment</strong>. First, <strong>data quality assessment</strong>: in IT-centric organisations very large volumes of complex, interrelated data must be managed; these tools <strong>check data against given validation rules</strong> (e.g. a field must be numeric or of a given length, a date must not be in the future, every order must reference an existing customer) and <strong>report the data that fails a check</strong>. Examples: Great Expectations, dbt tests, SQL constraint scripts.</p>`,
        `<p>Nhóm 6 là một vòng bảy hình tròn: <strong>test usability, accessibility, bản địa hoá, bảo mật, portability, chuyển đổi &amp; di trú dữ liệu, đánh giá chất lượng dữ liệu</strong>. Đầu tiên, <strong>đánh giá chất lượng dữ liệu</strong>: ở tổ chức lấy CNTT làm trung tâm, cần quản lý khối lượng rất lớn dữ liệu phức tạp và liên quan nhau; các công cụ này <strong>kiểm dữ liệu theo luật kiểm tra cho trước</strong> (vd một trường phải là số hoặc đúng độ dài, ngày không được ở tương lai, mọi đơn hàng phải trỏ tới khách hàng có thật) và <strong>báo cáo dữ liệu không qua được kiểm tra</strong>. Ví dụ: Great Expectations, dbt test, script ràng buộc SQL.</p>`],
      [29, 'Specialised needs — Data conversion & migration',
        `<p><strong>Data conversion &amp; migration tools</strong> verify that <strong>data conversion</strong> was correct and check that <strong>data migration has occurred according to the migration rules</strong> — e.g. when a bank moves 20 million accounts from an old core system to a new one. They help ensure the <strong>correctness, completeness and standard compliance</strong> of the processed data, <strong>regardless of the volume</strong>: count rows on both sides, compare checksums and balances, sample records field by field. Link with Chapter 2: migration testing is part of <em>maintenance testing</em>.</p>`,
        `<p><strong>Công cụ chuyển đổi &amp; di trú dữ liệu</strong> xác minh việc <strong>chuyển đổi dữ liệu</strong> là đúng và kiểm việc <strong>di trú dữ liệu đã diễn ra theo đúng luật di trú</strong> — vd khi ngân hàng chuyển 20 triệu tài khoản từ core cũ sang core mới. Chúng giúp đảm bảo dữ liệu đã xử lý <strong>đúng, đủ và đạt chuẩn</strong>, <strong>bất kể khối lượng</strong>: đếm dòng hai bên, so checksum và số dư, lấy mẫu từng bản ghi theo từng trường. Nối với Chương 2: test di trú là một phần của <em>maintenance testing</em>.</p>`],
      [30, 'Specialised needs — Usability testing',
        `<p><strong>Usability testing tools</strong> help to <strong>assess the user experience (UX)</strong> of using the system: <strong>after-use surveys</strong> (e.g. SUS questionnaires), <strong>checking broken links</strong>, and <strong>monitoring usage</strong> through most-clicked links (heat maps), video recorders, key presses, screen capture and <strong>eye-movement tracking</strong>. Examples: Hotjar, Microsoft Clarity, Maze, Lookback. The tools only collect evidence; judging whether the experience is good still needs people.</p>`,
        `<p><strong>Công cụ test usability</strong> giúp <strong>đánh giá trải nghiệm người dùng (UX)</strong> khi dùng hệ thống: <strong>khảo sát sau khi dùng</strong> (vd bảng hỏi SUS), <strong>kiểm tra link hỏng</strong>, và <strong>theo dõi việc sử dụng</strong> qua các link được bấm nhiều nhất (heat map), ghi video, thao tác phím, chụp màn hình và <strong>theo dõi chuyển động mắt</strong>. Ví dụ: Hotjar, Microsoft Clarity, Maze, Lookback. Công cụ chỉ thu thập bằng chứng; đánh giá trải nghiệm tốt hay không vẫn cần con người.</p>`],
      [31, 'Specialised needs — Accessibility testing',
        `<p><strong>Accessibility testing</strong> is the practice of making sure software <strong>is accessible to people with disabilities</strong>. Things to check (and that tools help with): works with a <strong>screen reader</strong> (NVDA, VoiceOver); designed with <strong>colour-blind users</strong> in mind (contrast, never colour alone); <strong>increasable text</strong> (zoom to 200&nbsp;% without breaking the layout); <strong>alternative text</strong> for images. The standard is WCAG 2.1/2.2. Tools: axe, Lighthouse, WAVE — they catch roughly a third of issues automatically; the rest needs manual checks.</p>`,
        `<p><strong>Test accessibility</strong> là thực hành đảm bảo phần mềm <strong>dùng được với người khuyết tật</strong>. Những điều cần kiểm (và công cụ hỗ trợ): chạy được với <strong>trình đọc màn hình</strong> (NVDA, VoiceOver); thiết kế có tính tới <strong>người mù màu</strong> (độ tương phản, không bao giờ chỉ dựa vào màu); <strong>chữ phóng to được</strong> (zoom 200&nbsp;% không vỡ bố cục); <strong>văn bản thay thế (alt text)</strong> cho ảnh. Chuẩn là WCAG 2.1/2.2. Công cụ: axe, Lighthouse, WAVE — bắt tự động được khoảng một phần ba vấn đề; phần còn lại phải kiểm tay.</p>`],
      [32, 'Specialised needs — Localisation testing',
        `<p><strong>Localisation testing</strong> examines a system's behaviour in relation to a particular <strong>location, locality or culture</strong>. Goal: ensure the software's <strong>linguistic and cultural characteristics</strong> are acceptable for that location — translation, menu items, buttons, error messages, but also date formats (11/09 is 11 September in Vietnam, November 9 in the US), currency (1.000.000 ₫ vs $1,000,000.00), text expansion (German is ~30&nbsp;% longer than English), right-to-left languages. Tools help find untranslated strings and truncated labels, but it is <strong>an area where human intelligence is needed</strong> — only a native speaker notices that a translation is correct but rude.</p>`,
        `<p><strong>Test bản địa hoá (localisation)</strong> xem xét hành vi hệ thống gắn với một <strong>địa điểm, địa phương hay nền văn hoá</strong> cụ thể. Mục tiêu: đảm bảo <strong>đặc điểm ngôn ngữ và văn hoá</strong> của phần mềm chấp nhận được ở nơi đó — bản dịch, mục menu, nút, thông báo lỗi, và cả định dạng ngày (11/09 là 11 tháng 9 ở Việt Nam, 9 tháng 11 ở Mỹ), tiền tệ (1.000.000 ₫ vs $1,000,000.00), độ nở chữ (tiếng Đức dài hơn tiếng Anh ~30&nbsp;%), ngôn ngữ viết phải-sang-trái. Công cụ giúp tìm chuỗi chưa dịch và nhãn bị cắt, nhưng đây là <strong>vùng cần trí tuệ con người</strong> — chỉ người bản xứ mới nhận ra một câu dịch đúng mà bất lịch sự.</p>`],
      [33, 'Specialised needs — Security testing',
        `<p><strong>Security testing tools</strong> test security by <strong>attempting to break into the system</strong>. They help to <strong>identify viruses</strong>, <strong>detect intrusions</strong>, <strong>simulate external attacks</strong>, <strong>probe open ports</strong>, and <strong>identify weaknesses in passwords and password files</strong>; some <strong>perform security checks during operation</strong> (continuous scanning). Examples: OWASP ZAP and Burp Suite (web attacks such as SQL injection, XSS), Nmap (ports), John the Ripper/Hashcat (password strength), dependency scanners (Snyk, OWASP Dependency-Check). Only ever run attack tools against systems you are authorised to test.</p>`,
        `<p><strong>Công cụ test bảo mật</strong> kiểm tra bảo mật bằng cách <strong>cố đột nhập vào hệ thống</strong>. Chúng giúp <strong>nhận diện virus</strong>, <strong>phát hiện xâm nhập</strong>, <strong>giả lập tấn công từ bên ngoài</strong>, <strong>dò cổng mở</strong>, và <strong>tìm điểm yếu của mật khẩu và file mật khẩu</strong>; một số <strong>kiểm tra an ninh trong lúc vận hành</strong> (quét liên tục). Ví dụ: OWASP ZAP và Burp Suite (tấn công web như SQL injection, XSS), Nmap (cổng), John the Ripper/Hashcat (độ mạnh mật khẩu), công cụ quét thư viện phụ thuộc (Snyk, OWASP Dependency-Check). Chỉ chạy công cụ tấn công trên hệ thống bạn được phép test.</p>`],
      [34, 'Specialised needs — Portability testing',
        `<p><strong>Portability testing tools</strong> support testing on <strong>different platforms and environments</strong> — operating systems, browsers, screen sizes, devices — and <strong>help run the same tests on different devices</strong>. Examples: BrowserStack, Sauce Labs, Selenium Grid (cross-browser), Firebase Test Lab and device farms (mobile). The value is in the "same tests": one automated suite, executed on a matrix of Chrome/Firefox/Safari × Windows/macOS/Android/iOS.</p>`,
        `<p><strong>Công cụ test portability (tính khả chuyển)</strong> hỗ trợ test trên <strong>nhiều nền tảng và môi trường</strong> — hệ điều hành, trình duyệt, kích thước màn hình, thiết bị — và <strong>giúp chạy cùng một bộ test trên nhiều thiết bị</strong>. Ví dụ: BrowserStack, Sauce Labs, Selenium Grid (đa trình duyệt), Firebase Test Lab và các "trang trại thiết bị" (mobile). Giá trị nằm ở chữ "cùng một bộ test": một bộ test tự động, chạy trên ma trận Chrome/Firefox/Safari × Windows/macOS/Android/iOS.</p>`],
      [35, 'Where tools fit — tools on the V-model',
        `<p>A summary picture: the <strong>V-model</strong> with the tool types placed where they are used. Left arm (orange area, specification side): <em>Req Anal → Function → Design → Code</em>, with <strong>requirements testing</strong> tools near the top, and <strong>test design</strong> and <strong>test data preparation</strong> along the arm; at the bottom, next to Code, <strong>static analysis</strong> (blue box). Right arm (execution side): <em>Comp. Test → Int Test → Sys Test → Acc Test</em>. Low on the right: <strong>debug</strong>, <strong>test harness &amp; drivers</strong>, <strong>coverage measures</strong> and <strong>dynamic analysis</strong> — developer tools, near component and integration test. In the middle: <strong>test running</strong> and <strong>comparison</strong> (execution tools, used at every level). Top right, around system and acceptance test: <strong>performance measurement</strong>. And the frame around everything: <strong>test management tools</strong>, which span the whole lifecycle. The picture is from the older syllabus: it has no CI, BDD or monitoring tools, and "debug" is a development activity supported by debuggers, not a test tool — but the logic still holds: developer tools sit low on the V, business-facing tools high.</p>`,
        `<p>Hình tổng kết: <strong>mô hình chữ V</strong> với các loại công cụ đặt đúng chỗ chúng được dùng. Nhánh trái (vùng cam, phía đặc tả): <em>Req Anal → Function → Design → Code</em>, công cụ <strong>requirements testing</strong> ở gần đỉnh, <strong>thiết kế test</strong> và <strong>chuẩn bị dữ liệu test</strong> dọc theo nhánh; ở đáy, cạnh Code, là <strong>phân tích tĩnh</strong> (ô xanh). Nhánh phải (phía thực thi): <em>Comp. Test → Int Test → Sys Test → Acc Test</em>. Thấp bên phải: <strong>debug</strong>, <strong>test harness &amp; driver</strong>, <strong>đo coverage</strong> và <strong>phân tích động</strong> — công cụ của developer, gần component và integration test. Ở giữa: <strong>chạy test</strong> và <strong>so sánh kết quả</strong> (công cụ thực thi, dùng ở mọi cấp). Góc trên phải, quanh system và acceptance test: <strong>đo hiệu năng</strong>. Và khung bao ngoài tất cả: <strong>công cụ quản lý test</strong>, trải suốt vòng đời. Hình này lấy từ syllabus cũ: chưa có CI, BDD hay công cụ giám sát, và "debug" là hoạt động phát triển được debugger hỗ trợ chứ không phải công cụ test — nhưng logic vẫn đúng: công cụ của developer nằm thấp trên chữ V, công cụ hướng nghiệp vụ nằm cao.</p>`],
    ]),
    bi(`<h3>Ví dụ có lời giải · Worked example — a tool chain for an online shop</h3>
<p><b>Situation.</b> A team of 6 developers and 2 testers builds a Java/Spring online shop with a React front end, two-week sprints, and a legal requirement to protect customer data. For each need, pick the tool <em>type</em> (that is what the exam asks) and an example product.</p>
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
<div class="pitfall"><b>Pairs that get confused.</b> <em>Performance testing tools</em> generate load in a test (5) ≠ <em>monitoring tools</em> watch the system continuously, also in production (5). <em>Coverage tools</em> measure what tests executed ≠ <em>test execution tools</em> run the tests. <em>Test harness</em> = the environment of drivers and stubs ≠ <em>unit test framework</em> = the tool to write and run unit tests (JUnit is often both). <em>Static</em> analysis = code not executed ≠ <em>dynamic</em> analysis = while running. And "(D)" means <em>likely used by developers</em>, not "dynamic".</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>AI-assisted test tools.</b> Since about 2020 many execution tools advertise "self-healing" locators (when a button's id changes, the tool finds it by other attributes and repairs the script) and, since 2023, large language models that draft unit tests, Gherkin scenarios or test data from a requirement. They attack exactly the two weak points of slides 16 and 21: maintenance of scripts and the cost of test design. They do not solve the oracle problem — an AI-generated assertion can faithfully encode a bug — so generated tests must be reviewed like any other code. <em>Outside the syllabus because the CTFL 2018 tool classification predates these tools; the 2023 CTFL v4.0 mentions them only briefly.</em></div>`,
      `<h3>Ví dụ có lời giải · Bộ công cụ cho một shop online</h3>
<p><b>Tình huống.</b> Một đội 6 developer và 2 tester xây shop online Java/Spring với front end React, sprint hai tuần, và luật bắt buộc bảo vệ dữ liệu khách hàng. Với mỗi nhu cầu, chọn <em>loại</em> công cụ (đề thi hỏi cái này) và một sản phẩm ví dụ.</p>
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
<div class="pitfall"><b>Những cặp hay nhầm.</b> <em>Công cụ test hiệu năng</em> sinh tải trong một đợt test (5) ≠ <em>công cụ giám sát</em> theo dõi hệ thống liên tục, cả trên production (5). <em>Công cụ coverage</em> đo cái test đã chạy qua ≠ <em>công cụ thực thi test</em> chạy test. <em>Test harness</em> = môi trường gồm driver và stub ≠ <em>unit test framework</em> = công cụ viết và chạy unit test (JUnit thường kiêm cả hai). Phân tích <em>tĩnh</em> = không chạy code ≠ phân tích <em>động</em> = trong lúc chạy. Và "(D)" nghĩa là <em>thường do developer dùng</em>, không phải "dynamic".</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Công cụ test có AI hỗ trợ.</b> Từ khoảng 2020 nhiều công cụ thực thi quảng cáo locator "tự lành" (khi id của nút đổi, công cụ tìm nó bằng thuộc tính khác và tự sửa script) và, từ 2023, mô hình ngôn ngữ lớn soạn nháp unit test, kịch bản Gherkin hay dữ liệu test từ một yêu cầu. Chúng nhắm đúng hai điểm yếu của slide 16 và 21: bảo trì script và chi phí thiết kế test. Chúng không giải được bài toán oracle — một assertion do AI sinh có thể "trung thành" mã hoá luôn cả bug — nên test sinh ra phải được review như mọi code khác. <em>Ngoài giáo trình vì cách phân loại công cụ của CTFL 2018 có trước các công cụ này; CTFL v4.0 (2023) chỉ nhắc qua.</em></div>`),
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
<p class="lead">Buying a tool is easy; getting value from it is not. This lesson lists what a tool can realistically give you (<strong>benefits</strong>), what usually goes wrong (<strong>risks</strong>), and then the <strong>special considerations</strong> for the two tool types that cost the most effort: <strong>test execution tools</strong> (four scripting approaches: capture/replay, data-driven, keyword-driven, model-based) and <strong>test management tools</strong>. The worked example runs the same login feature as a data-driven and as a keyword-driven test, for real.</p>
<div class="callout"><b>Learning objectives.</b> LO-6.1.2 Identify benefits and risks of test automation (K1) · LO-6.1.3 Remember special considerations for test execution and test management tools (K1).</div>
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
<p class="lead">Mua công cụ thì dễ; khai thác được giá trị từ nó mới khó. Bài này liệt kê điều công cụ thực sự có thể mang lại (<strong>lợi ích</strong>), điều thường hỏng (<strong>rủi ro</strong>), rồi tới <strong>các lưu ý đặc biệt</strong> cho hai loại công cụ tốn công nhất: <strong>công cụ thực thi test</strong> (bốn cách viết script: capture/replay, data-driven, keyword-driven, model-based) và <strong>công cụ quản lý test</strong>. Ví dụ có lời giải chạy thật cùng một tính năng đăng nhập theo kiểu data-driven và kiểu keyword-driven.</p>
<div class="callout"><b>Chuẩn đầu ra.</b> LO-6.1.2 Nhận diện lợi ích và rủi ro của tự động hoá kiểm thử (K1) · LO-6.1.3 Nhớ các lưu ý đặc biệt cho công cụ thực thi test và công cụ quản lý test (K1).</div>
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
        `<p>The chapter mind map again: we leave <em>Test Tool Classification</em> and move to the next leaf of <em>Test Tool Considerations</em> — <strong>Benefits &amp; Risks of Test Automation</strong>.</p>`,
        `<p>Lại là sơ đồ tư duy của chương: ta rời <em>Test Tool Classification</em> và sang lá tiếp theo của <em>Test Tool Considerations</em> — <strong>Benefits &amp; Risks of Test Automation</strong>.</p>`],
      [37, 'Potential Benefits and Risks — agenda',
        `<p>Three topics: <strong>potential benefits</strong> of using tools · <strong>risks</strong> of using tools · <strong>special considerations for some types of tools</strong>. The word "potential" matters: benefits are not automatic — they come only if the risks are managed.</p>`,
        `<p>Ba chủ đề: <strong>lợi ích tiềm năng</strong> khi dùng công cụ · <strong>rủi ro</strong> khi dùng công cụ · <strong>lưu ý đặc biệt cho một số loại công cụ</strong>. Chữ "tiềm năng" quan trọng: lợi ích không tự đến — chỉ có khi quản lý được rủi ro.</p>`],
      [38, 'Potential benefits of using tools',
        `<p>The four benefits of the syllabus, with the examples it gives:</p>
<ol>
<li><strong>Reduction of repetitive (manual) work</strong> — running regression tests, environment set-up/tear-down, re-entering the same test data, checking against coding standards.</li>
<li><strong>Greater consistency and repeatability</strong> — test data created in a coherent way, tests executed in the same order with the same frequency, tests consistently derived from requirements.</li>
<li><strong>Objective assessment</strong> — static measures, coverage: a number produced by a tool, not someone's impression.</li>
<li><strong>Ease of access to information about tests or testing</strong> — statistics, graphs, aggregated data about test progress, defect rates and performance.</li>
</ol>
<p>Hook: <em>less boring work, same every time, numbers not opinions, information at a glance</em>.</p>`,
        `<p>Bốn lợi ích của syllabus, kèm ví dụ syllabus đưa ra:</p>
<ol>
<li><strong>Giảm việc thủ công lặp lại</strong> — chạy regression test, dựng/dọn môi trường, nhập lại cùng dữ liệu test, kiểm theo chuẩn viết code.</li>
<li><strong>Nhất quán và lặp lại được hơn</strong> — dữ liệu test được tạo mạch lạc, test chạy cùng thứ tự với cùng tần suất, test được suy ra từ yêu cầu một cách nhất quán.</li>
<li><strong>Đánh giá khách quan</strong> — số đo tĩnh, coverage: một con số do công cụ tạo ra, không phải cảm nhận của ai đó.</li>
<li><strong>Dễ truy cập thông tin về test và việc kiểm thử</strong> — thống kê, biểu đồ, số liệu tổng hợp về tiến độ test, tỉ lệ defect và hiệu năng.</li>
</ol>
<p>Mẹo nhớ: <em>bớt việc nhàm, lần nào cũng như nhau, con số thay cho ý kiến, thông tin liếc là thấy</em>.</p>`],
      [39, 'Risks of using tools (1)',
        `<p>"There are many risks that are present when tool support for testing is introduced and used, whatever the specific type of tool":</p>
<ul>
<li><strong>Unrealistic expectations</strong> for the tool (functionality and ease of use) — "we bought it, so testing is automated now".</li>
<li><strong>Underestimation of time, cost and effort</strong> for (a) the <em>initial introduction</em> (training, external expertise), (b) achieving <em>continuing benefits</em> (changes to the test process, continuous improvement) and (c) <em>maintaining the test assets</em> the tool generates (scripts break when the UI changes).</li>
<li><strong>Over-reliance on the tool</strong> — e.g. using it to replace test design, or automating tests that are better done manually (usability, exploratory).</li>
<li><strong>Failing to consider and manage relationships and interoperability between critical tools</strong> — requirements management, configuration management, defect management, tools from multiple vendors that do not talk to each other.</li>
</ul>`,
        `<p>"Có nhiều rủi ro xuất hiện khi đưa công cụ vào hỗ trợ kiểm thử, bất kể loại công cụ nào":</p>
<ul>
<li><strong>Kỳ vọng phi thực tế</strong> vào công cụ (về chức năng và độ dễ dùng) — "mua rồi nên giờ test đã tự động".</li>
<li><strong>Đánh giá thấp thời gian, chi phí và công sức</strong> cho (a) <em>lần đưa vào đầu tiên</em> (đào tạo, thuê chuyên gia), (b) để có <em>lợi ích lâu dài</em> (đổi quy trình test, cải tiến liên tục) và (c) <em>bảo trì tài sản test</em> do công cụ tạo ra (script gãy khi UI đổi).</li>
<li><strong>Quá phụ thuộc vào công cụ</strong> — vd dùng nó thay cho thiết kế test, hoặc tự động hoá những test làm tay tốt hơn (usability, exploratory).</li>
<li><strong>Không tính tới và không quản lý quan hệ, khả năng liên thông giữa các công cụ quan trọng</strong> — quản lý yêu cầu, quản lý cấu hình, quản lý defect, công cụ của nhiều hãng không nói chuyện được với nhau.</li>
</ul>`],
      [40, 'Risks of using tools (2)',
        `<ul>
<li>The <strong>tool vendor goes out of business</strong>, <strong>retires the tool</strong> or <strong>sells it to a different vendor</strong> — "or in the open-source world": the project is abandoned or suspended.</li>
<li><strong>Poor or non-existent vendor response</strong> for support, upgrades or defect fixes.</li>
<li><strong>Various uncertainties and unforeseen problems</strong>, such as the <strong>inability to support a new platform</strong> (your company moves to a new mobile OS version or a new browser and the tool does not follow).</li>
</ul>
<p>The syllabus has three more that the slides skip — learn them too: <strong>version control of test assets neglected</strong>; <strong>no clear ownership of the tool</strong> (nobody responsible for mentoring, updates); and new technologies not supported by the tool. An exam option such as "the tool finds more defects than expected" is <em>not</em> a risk — it is a (pleasant) outcome.</p>`,
        `<ul>
<li><strong>Hãng làm công cụ phá sản</strong>, <strong>khai tử công cụ</strong> hoặc <strong>bán nó cho hãng khác</strong> — "hoặc trong thế giới mã nguồn mở": dự án bị bỏ rơi hoặc tạm dừng.</li>
<li><strong>Hãng hỗ trợ kém hoặc không hỗ trợ</strong> về support, nâng cấp hay sửa lỗi.</li>
<li><strong>Nhiều điều bất định và vấn đề không lường trước</strong>, như <strong>không hỗ trợ được nền tảng mới</strong> (công ty chuyển sang phiên bản hệ điều hành mobile mới hay trình duyệt mới mà công cụ không theo kịp).</li>
</ul>
<p>Syllabus còn ba rủi ro nữa mà slide bỏ qua — học luôn: <strong>bỏ quên quản lý phiên bản của tài sản test</strong>; <strong>không có người sở hữu rõ ràng cho công cụ</strong> (không ai lo hướng dẫn, cập nhật); và công nghệ mới không được công cụ hỗ trợ. Một phương án kiểu "công cụ tìm được nhiều defect hơn mong đợi" <em>không</em> phải rủi ro — đó là một kết quả (dễ chịu).</p>`],
      [41, 'Mind map — next branch: Execution & Management Tools Considerations',
        `<p>Mind map once more, now pointing at the last leaf of the first half: <strong>Execution &amp; Management Tools Considerations</strong> — test execution (capture/replay, data-driven, keyword-driven, model-based) and test management.</p>`,
        `<p>Sơ đồ tư duy thêm một lần, giờ chỉ vào lá cuối của nửa đầu: <strong>Execution &amp; Management Tools Considerations</strong> — thực thi test (capture/replay, data-driven, keyword-driven, model-based) và quản lý test.</p>`],
      [42, 'Special considerations for test execution & management tools',
        `<p>"SpecCons" = <strong>special considerations</strong>. Two tool types need them because they are the most expensive to get right: <strong>test execution tools</strong> — four approaches: <em>capture/replay</em>, <em>data-driven</em>, <em>keyword-driven</em>, <em>model-based</em> — and <strong>test management tools</strong>. The syllabus sentence behind this slide: execution tools "often require significant effort in order to achieve significant benefits".</p>`,
        `<p>"SpecCons" = <strong>special considerations — lưu ý đặc biệt</strong>. Hai loại công cụ cần lưu ý vì làm cho đúng tốn kém nhất: <strong>công cụ thực thi test</strong> — bốn cách: <em>capture/replay</em>, <em>data-driven</em>, <em>keyword-driven</em>, <em>model-based</em> — và <strong>công cụ quản lý test</strong>. Câu syllabus đứng sau slide này: công cụ thực thi "thường đòi hỏi công sức đáng kể mới đạt được lợi ích đáng kể".</p>`],
      [43, 'Capture/Replay testing tools',
        `<p>Recording the actions of a manual tester (camera icon → replay icon) looks easy, but has drawbacks:</p>
<ul>
<li><strong>Does not scale</strong> to large numbers of test scripts — one small UI change can break hundreds of recordings, each to be re-recorded or edited.</li>
<li><strong>Does not store test cases</strong> — only test data and scripts: a recording holds the inputs you typed, <em>not the expected results</em>, until someone programs checks in.</li>
<li><strong>The script may be unstable when unexpected events occur</strong> — a pop-up, a slower page, a file that already exists: the recording only copes with exactly the conditions under which it was recorded.</li>
</ul>
<p>Where it <em>is</em> useful: <strong>capturing test inputs</strong> during <strong>exploratory testing</strong> or <strong>unscripted tests with experienced users</strong> — as an audit trail of what was done, and to replay a hard-to-reproduce failure for the developer. Graham et al. call capture/playback "probably the worst way" to use an execution tool — fine for a few dozen short-lived tests, never as a large regression suite.</p>`,
        `<p>Ghi lại thao tác của tester thủ công (biểu tượng máy quay → biểu tượng phát lại) trông dễ, nhưng có nhược điểm:</p>
<ul>
<li><strong>Không mở rộng được</strong> tới số lượng lớn script — một thay đổi nhỏ trên UI có thể làm gãy hàng trăm bản ghi, cái nào cũng phải ghi lại hoặc sửa.</li>
<li><strong>Không lưu test case</strong> — chỉ lưu dữ liệu và script: bản ghi chứa các input bạn đã gõ, <em>không chứa kết quả mong đợi</em>, cho tới khi có người lập trình thêm các phép kiểm.</li>
<li><strong>Script có thể không ổn định khi có sự kiện bất ngờ</strong> — một pop-up, trang tải chậm hơn, một file đã tồn tại: bản ghi chỉ xử lý được đúng điều kiện lúc nó được ghi.</li>
</ul>
<p>Chỗ nó <em>có ích</em>: <strong>ghi lại input</strong> khi làm <strong>exploratory testing</strong> hoặc <strong>test không kịch bản với người dùng giàu kinh nghiệm</strong> — làm vết kiểm tra (audit trail) về việc đã làm, và để phát lại một failure khó tái hiện cho developer xem. Graham và cộng sự gọi capture/playback là "có lẽ là cách tệ nhất" để dùng công cụ thực thi — ổn cho vài chục test ngắn hạn, không bao giờ nên dùng làm bộ regression lớn.</p>`],
      [44, 'Data-driven testing tools',
        `<p>A <strong>data-driven</strong> approach <strong>separates out the test inputs and expected results</strong>, usually into a <strong>spreadsheet</strong>, and uses a more <strong>generic test script</strong> that reads the input data and <strong>executes the same script with different data</strong>. Testers who do not know the scripting language can then <strong>create new test data</strong> for these predefined scripts. The diagram: <em>Data file</em> → test data → <em>Test script</em> → enters input data → <em>System/component under test</em> → actual output → <em>Test result (compare)</em> ← expected output ← data file. JUnit's <code>@ParameterizedTest</code> with <code>@CsvSource</code> (lesson 8.5) is data-driven testing in miniature.</p>`,
        `<p>Cách <strong>data-driven</strong> <strong>tách riêng input và kết quả mong đợi</strong>, thường vào một <strong>bảng tính</strong>, và dùng một <strong>script test chung</strong> đọc dữ liệu vào rồi <strong>chạy cùng một script với nhiều bộ dữ liệu khác nhau</strong>. Tester không biết ngôn ngữ script vẫn có thể <strong>tạo thêm dữ liệu test</strong> cho các script đã có sẵn. Sơ đồ: <em>Data file</em> → dữ liệu test → <em>Test script</em> → nhập input → <em>Hệ thống/component đang test</em> → output thực tế → <em>Test result (so sánh)</em> ← output mong đợi ← data file. <code>@ParameterizedTest</code> với <code>@CsvSource</code> của JUnit (bài 8.5) chính là data-driven testing thu nhỏ.</p>`],
      [45, 'Keyword-driven testing tools',
        `<p>In a <strong>keyword-driven</strong> approach a <strong>generic script processes keywords</strong> describing the actions to take (also called <strong>action words</strong>), and calls the matching <strong>keyword scripts</strong> to process the associated test data. Testers — even those unfamiliar with the scripting language — can <strong>define tests</strong> using the keywords and data, tailored to the SUT. Diagram: a table of <em>Actions</em> + <em>Test data</em> is input to the <em>Automation script</em>, which enters input data into the <em>SUT</em>, receives output data back, and writes test output data. The key difference from data-driven: the table contains the <em>steps</em>, not only the data — so testers write <em>tests</em>, not just data for one fixed test. Robot Framework is the best-known open-source keyword-driven tool.</p>`,
        `<p>Trong cách <strong>keyword-driven</strong>, một <strong>script chung xử lý các keyword</strong> mô tả hành động cần làm (còn gọi là <strong>action word — từ hành động</strong>), và gọi <strong>keyword script</strong> tương ứng để xử lý dữ liệu đi kèm. Tester — kể cả người không biết ngôn ngữ script — có thể <strong>định nghĩa test</strong> bằng keyword và dữ liệu, may đo cho SUT. Sơ đồ: bảng gồm <em>Actions</em> + <em>Test data</em> là input của <em>Automation script</em>, script nhập dữ liệu vào <em>SUT</em>, nhận output trả về, và ghi dữ liệu kết quả test. Khác biệt then chốt với data-driven: bảng chứa <em>các bước</em>, không chỉ dữ liệu — nên tester viết được <em>test</em>, không chỉ dữ liệu cho một test cố định. Robot Framework là công cụ keyword-driven mã nguồn mở nổi tiếng nhất.</p>`],
      [46, 'Model-based testing tools',
        `<p><strong>MBT tools</strong> include <strong>test execution capability</strong> and <strong>generate test inputs and expected outputs</strong> (unlike the test design tools of slide 16, the model gives them the expected behaviour). They let a <strong>functional specification be captured in the form of a model</strong> — a state transition diagram, an activity diagram — generally done by a <strong>system designer</strong>. The MBT tool interprets the model to <strong>create test case specifications</strong>, which can be saved in a test management tool and/or executed by a test execution tool. Example: from the PIN-entry state diagram of Chapter 4 (fst4 Fig. 4.2) a tool can generate one test per transition (0-switch coverage) automatically.</p>`,
        `<p><strong>Công cụ MBT</strong> có <strong>khả năng thực thi test</strong> và <strong>sinh cả input lẫn output mong đợi</strong> (khác công cụ thiết kế test ở slide 16, mô hình cho chúng biết hành vi mong đợi). Chúng cho phép <strong>ghi lại đặc tả chức năng dưới dạng mô hình</strong> — sơ đồ chuyển trạng thái, activity diagram — thường do <strong>người thiết kế hệ thống</strong> làm. Công cụ MBT diễn giải mô hình để <strong>tạo đặc tả test case</strong>, lưu vào công cụ quản lý test và/hoặc cho công cụ thực thi chạy. Ví dụ: từ sơ đồ trạng thái nhập PIN ở Chương 4 (fst4 Hình 4.2) công cụ tự sinh một test cho mỗi chuyển trạng thái (phủ 0-switch).</p>`],
      [47, 'Test management tools',
        `<p>Test management tools generate lots of useful data, but they need to <strong>interface with other tools</strong> in order to:</p>
<ul>
<li>produce <strong>meaningful information in an accessible format</strong> (e.g. export to the company's report format, spreadsheets);</li>
<li>maintain <strong>consistent traceability to requirements</strong> (with requirements management tools);</li>
<li>link with <strong>test object version information</strong> (with configuration management tools).</li>
</ul>
<p><strong>ALM tools</strong> can present different information to different user groups (managers, developers, testers). It is essential to <strong>monitor the information produced to ensure its currency</strong> — "currency" here means <em>being up to date</em>, not money (the notes translate it as "tính tiền tệ", which is wrong). Recommended approach: <strong>define the test process → consider the adopted tool(s) → adapt the tool(s) to give the highest benefit</strong> — the process first, not the tool dictating the process. Slide typo: "mangers" → managers.</p>`,
        `<p>Công cụ quản lý test tạo ra rất nhiều dữ liệu hữu ích, nhưng cần <strong>kết nối với công cụ khác</strong> để:</p>
<ul>
<li>tạo <strong>thông tin có ý nghĩa ở định dạng dễ tiếp cận</strong> (vd xuất ra mẫu báo cáo của công ty, bảng tính);</li>
<li>giữ <strong>truy vết nhất quán tới yêu cầu</strong> (với công cụ quản lý yêu cầu);</li>
<li>liên kết với <strong>thông tin phiên bản của đối tượng test</strong> (với công cụ quản lý cấu hình).</li>
</ul>
<p><strong>Công cụ ALM</strong> có thể đưa thông tin khác nhau cho từng nhóm người dùng (quản lý, developer, tester). Cần <strong>giám sát thông tin được tạo ra để đảm bảo nó còn cập nhật</strong> — chữ "currency" ở đây nghĩa là <em>tính thời sự, còn mới</em>, không phải tiền (ghi chú dịch là "tính tiền tệ" là dịch sai). Cách tiếp cận khuyến nghị: <strong>xác định quy trình test → xem xét công cụ sẽ dùng → điều chỉnh công cụ để có lợi nhất</strong> — quy trình đi trước, không để công cụ quyết định quy trình. Lỗi đánh máy: "mangers" → managers.</p>`],
    ]),
    bi(`<h3>Ví dụ có lời giải · Worked example — the same login feature, data-driven vs keyword-driven</h3>
<p><b>SUT.</b> A login service: user <code>alice</code> / password <code>secret</code>; blank username → "Username required"; unknown user → "Unknown user"; wrong password → "Invalid password", and the <b>3rd</b> consecutive wrong password locks the account ("Account locked"). The code below was compiled and run with JDK 21 (<code>javac DdtKdtDemo.java &amp;&amp; java DdtKdtDemo</code>).</p>
<p><b>Data-driven.</b> A tester fills a table — inputs and expected result — and never touches Java:</p>
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
<p><b>Keyword-driven.</b> Test case TC-07 "lock-out after three wrong passwords" needs a <em>sequence</em> that the data table cannot express. The tester writes it with three keywords the automation engineer provided — <code>OpenApp</code>, <code>Login</code>, <code>CheckMessage</code>:</p>
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
<p><b>Real output:</b></p>
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
<li><b>Row 5 fails.</b> The tester expected user names to be case-insensitive; the SUT treats <code>ALICE</code> as unknown. Is that a defect? Only the specification (or the product owner) can say — the tool merely reports the difference. This is exactly slide 44: a non-programmer added a new case by adding one line of data.</li>
<li><b>Step 7 shows why keywords were needed.</b> The correct password is still refused because the account is locked — a behaviour that only appears after a <em>sequence</em> of actions. In a data-driven table every row starts with a fresh SUT, so it cannot express this test; the keyword table can.</li>
<li><b>Capture/replay comparison.</b> A recording of TC-07 would store 4 logins and 4 clicks but no "CheckMessage" steps — nothing would fail even if the lock-out were broken (slide 43, "does not store test cases").</li>
</ol>
<div class="pitfall"><b>Exam trap: who writes what.</b> Data-driven → testers add <em>data</em> for a predefined script. Keyword-driven → testers write <em>tests</em> (steps) from keywords and data. In <em>both</em>, someone must still program the scripts (the generic script, the keyword implementations); the syllabus stresses that these approaches let testers without scripting skills contribute — it does not say nobody needs programming skills. And capture/replay does <em>not</em> record expected results.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Keyword-driven testing today: Robot Framework and Gherkin.</b> Robot Framework (open source, used by Nokia, ABB and many banks) is keyword-driven testing productised: tests are tables of keywords such as <code>Open Browser</code>, <code>Input Text</code>, <code>Page Should Contain</code>, with libraries for Selenium, Appium, REST and databases. BDD's Gherkin (<em>Given the account has 2 failed logins / When alice logs in with a wrong password / Then the account is locked</em>) is a close cousin: each step sentence is a keyword bound to code. ISO/IEC/IEEE 29119-5 (2016) standardises keyword-driven testing. <em>Outside the syllabus because CTFL names the approaches but no tools or standards.</em></div>`,
      `<h3>Ví dụ có lời giải · Cùng một tính năng đăng nhập: data-driven vs keyword-driven</h3>
<p><b>SUT.</b> Một service đăng nhập: user <code>alice</code> / mật khẩu <code>secret</code>; username trống → "Username required"; user không tồn tại → "Unknown user"; sai mật khẩu → "Invalid password", và lần sai <b>thứ 3</b> liên tiếp thì khoá tài khoản ("Account locked"). Code bên dưới đã được biên dịch và chạy bằng JDK 21 (<code>javac DdtKdtDemo.java &amp;&amp; java DdtKdtDemo</code>).</p>
<p><b>Data-driven.</b> Tester điền một bảng — input và kết quả mong đợi — không đụng tới Java:</p>
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
<p><b>Keyword-driven.</b> Test case TC-07 "khoá tài khoản sau ba lần sai mật khẩu" cần một <em>chuỗi</em> hành động mà bảng dữ liệu không diễn tả được. Tester viết nó bằng ba keyword do kỹ sư automation cung cấp — <code>OpenApp</code>, <code>Login</code>, <code>CheckMessage</code>:</p>
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
<p><b>Output thật:</b></p>
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
<li><b>Dòng 5 fail.</b> Tester nghĩ tên đăng nhập không phân biệt hoa thường; SUT lại coi <code>ALICE</code> là user không tồn tại. Đó có phải defect không? Chỉ đặc tả (hoặc product owner) trả lời được — công cụ chỉ báo ra sự khác biệt. Đúng tinh thần slide 44: một người không lập trình đã thêm được một ca mới chỉ bằng một dòng dữ liệu.</li>
<li><b>Bước 7 cho thấy vì sao cần keyword.</b> Mật khẩu đúng vẫn bị từ chối vì tài khoản đã khoá — hành vi chỉ xuất hiện sau một <em>chuỗi</em> thao tác. Trong bảng data-driven mỗi dòng bắt đầu với SUT mới, nên không diễn tả được test này; bảng keyword thì được.</li>
<li><b>So với capture/replay.</b> Bản ghi của TC-07 sẽ lưu 4 lần đăng nhập và 4 cú bấm nhưng không có bước "CheckMessage" nào — dù chức năng khoá tài khoản hỏng, không có gì fail cả (slide 43, "không lưu test case").</li>
</ol>
<div class="pitfall"><b>Bẫy thi: ai viết gì.</b> Data-driven → tester thêm <em>dữ liệu</em> cho một script có sẵn. Keyword-driven → tester viết <em>test</em> (các bước) từ keyword và dữ liệu. Ở <em>cả hai</em>, vẫn phải có người lập trình script (script chung, phần cài đặt keyword); syllabus nhấn mạnh hai cách này giúp tester không biết script cũng đóng góp được — không hề nói là không ai cần kỹ năng lập trình. Và capture/replay <em>không</em> ghi kết quả mong đợi.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Keyword-driven ngày nay: Robot Framework và Gherkin.</b> Robot Framework (mã nguồn mở, Nokia, ABB và nhiều ngân hàng dùng) là keyword-driven testing được đóng gói thành sản phẩm: test là bảng các keyword như <code>Open Browser</code>, <code>Input Text</code>, <code>Page Should Contain</code>, có thư viện cho Selenium, Appium, REST và cơ sở dữ liệu. Gherkin của BDD (<em>Given tài khoản đã sai 2 lần / When alice đăng nhập sai mật khẩu / Then tài khoản bị khoá</em>) là họ hàng gần: mỗi câu bước là một keyword gắn với code. ISO/IEC/IEEE 29119-5 (2016) chuẩn hoá keyword-driven testing. <em>Ngoài giáo trình vì CTFL chỉ gọi tên các cách tiếp cận, không nêu công cụ hay chuẩn.</em></div>`),
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
<div class="callout"><b>Learning objectives.</b> LO-6.2.1 Identify the main principles for selecting a tool (K1) · LO-6.2.2 Recall the objectives for using pilot projects to introduce tools (K1) · LO-6.2.3 Identify the success factors for evaluation, implementation, deployment and on-going support of test tools in an organisation (K1).</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1 · Select</div><div class="lz-t">Before buying</div><div class="lz-d">maturity, needs, technology, CI compatibility, criteria, trial, vendor, training, licence, cost-benefit, proof of concept</div></div>
  <div class="lz-step"><div class="lz-k">→ 2 · Pilot</div><div class="lz-t">One small real project</div><div class="lz-d">learn the tool, fit with processes, standard ways of use, benefits at reasonable cost, metrics</div></div>
  <div class="lz-step"><div class="lz-k">→ 3 · Roll out</div><div class="lz-t">Whole organisation</div><div class="lz-d">incremental, adapt processes, training, guidelines, usage data, monitor, support, lessons learned</div></div>
</div>`,
      `<span class="eyebrow">Chương 8 · Bài 8.4 · SWT6 slide 48–54</span>
<h2>Dùng công cụ hiệu quả — chọn, chạy thử, triển khai</h2>
<p class="lead">Nửa sau của Chương 6 ngắn và toàn K1: ba danh sách cần nhận ra. Đưa công cụ vào là một dự án <strong>quản lý thay đổi</strong>, không phải một lần mua hàng: trước hết <strong>chọn</strong> công cụ theo nhu cầu thật, rồi chứng minh nó trong một <strong>dự án pilot</strong> nhỏ, rồi triển khai kèm các <strong>yếu tố thành công</strong>. Câu hỏi thi đưa một mục và hỏi nó thuộc danh sách nào — nên điều đáng học nhất là <em>sự khác nhau</em> giữa ba danh sách.</p>
<div class="callout"><b>Chuẩn đầu ra.</b> LO-6.2.1 Nhận diện các nguyên tắc chính khi chọn công cụ (K1) · LO-6.2.2 Nhớ các mục tiêu của dự án pilot khi đưa công cụ vào (K1) · LO-6.2.3 Nhận diện các yếu tố thành công cho việc đánh giá, cài đặt, triển khai và hỗ trợ lâu dài công cụ test trong tổ chức (K1).</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1 · Chọn</div><div class="lz-t">Trước khi mua</div><div class="lz-d">độ trưởng thành, nhu cầu, công nghệ, tương thích CI, tiêu chí, dùng thử, nhà cung cấp, đào tạo, bản quyền, chi phí-lợi ích, proof of concept</div></div>
  <div class="lz-step"><div class="lz-k">→ 2 · Pilot</div><div class="lz-t">Một dự án thật, nhỏ</div><div class="lz-d">hiểu công cụ, độ khớp với quy trình, cách dùng chuẩn, lợi ích với chi phí hợp lý, số liệu</div></div>
  <div class="lz-step"><div class="lz-k">→ 3 · Triển khai</div><div class="lz-t">Toàn tổ chức</div><div class="lz-d">từng bước, chỉnh quy trình, đào tạo, hướng dẫn, dữ liệu sử dụng, giám sát, hỗ trợ, bài học kinh nghiệm</div></div>
</div>`),
    walkHead(D, 48, 54),
    walk(D, [
      [48, 'CONTENT — Effective use of tools',
        `<p>The agenda switches to part 2, <strong>Effective use of tools</strong>: <strong>principles for tool selection</strong> · <strong>pilot project</strong> · <strong>success factors for tools</strong> — the three objectives LO-6.2.1 to 6.2.3.</p>`,
        `<p>Mục lục chuyển sang phần 2, <strong>Effective use of tools</strong>: <strong>nguyên tắc chọn công cụ</strong> · <strong>dự án pilot</strong> · <strong>yếu tố thành công</strong> — ba chuẩn đầu ra LO-6.2.1 tới 6.2.3.</p>`],
      [49, 'Mind map — left branch: Effective Use of Tools',
        `<p>Last appearance of the mind map: now the <em>left</em> branch, <strong>Effective Use of Tools</strong>, with its three leaves Principles for tool selection, Pilot project and Success factors for tools.</p>`,
        `<p>Lần xuất hiện cuối của sơ đồ tư duy: giờ là nhánh <em>trái</em>, <strong>Effective Use of Tools</strong>, với ba lá Nguyên tắc chọn công cụ, Dự án pilot và Yếu tố thành công.</p>`],
      [50, 'Considerations for tool selection (1)',
        `<p>The main considerations when selecting a tool (red = keywords):</p>
<ol>
<li><strong>Assessment of the maturity of the organisation</strong> — its strengths and weaknesses. A team with no written test cases will not get value from a test management tool; a team with no stable regression suite will not get value from an execution tool. (Tools amplify the process you have — "automating chaos gives faster chaos".)</li>
<li><strong>Identification of opportunities for an improved test process</strong> supported by tools — start from a problem, not from a product.</li>
<li><strong>Understanding the technologies used by the test object(s)</strong> — a desktop-only tool is useless for a React web app; a tool must recognise your UI controls.</li>
<li><strong>Knowledge of the current build and continuous integration tools</strong>, to ensure tool compatibility and integration (can it run headless in Jenkins/GitHub Actions? does it produce JUnit-XML reports?).</li>
<li><strong>Evaluation of tools against clear requirements and objective criteria</strong> — e.g. a weighted scoring matrix (worked example below).</li>
</ol>`,
        `<p>Những điều chính cần cân nhắc khi chọn công cụ (chữ đỏ = chữ khoá):</p>
<ol>
<li><strong>Đánh giá độ trưởng thành của tổ chức</strong> — điểm mạnh và điểm yếu. Một đội chưa có test case viết ra sẽ chẳng được lợi gì từ công cụ quản lý test; một đội chưa có bộ regression ổn định sẽ chẳng được lợi gì từ công cụ thực thi. (Công cụ khuếch đại quy trình bạn đang có — "tự động hoá sự hỗn loạn chỉ cho ra hỗn loạn nhanh hơn".)</li>
<li><strong>Xác định cơ hội cải tiến quy trình test</strong> nhờ công cụ — bắt đầu từ vấn đề, không bắt đầu từ sản phẩm.</li>
<li><strong>Hiểu công nghệ mà đối tượng test dùng</strong> — công cụ chỉ chạy desktop thì vô dụng với web React; công cụ phải nhận diện được các control giao diện của bạn.</li>
<li><strong>Nắm các công cụ build và tích hợp liên tục hiện có</strong>, để đảm bảo tương thích và tích hợp (có chạy headless trong Jenkins/GitHub Actions không? có xuất báo cáo dạng JUnit-XML không?).</li>
<li><strong>Đánh giá công cụ theo yêu cầu rõ ràng và tiêu chí khách quan</strong> — vd ma trận chấm điểm có trọng số (ví dụ có lời giải bên dưới).</li>
</ol>`],
      [51, 'Considerations for tool selection (2)',
        `<ol start="6">
<li>Check whether the tool is available for a <strong>free trial period</strong> (and for how long) — 14 days is not enough to judge a UI-automation tool.</li>
<li><strong>Evaluation of the vendor</strong> — training, support and commercial aspects; for open source: the community (activity, releases, who maintains it).</li>
<li>Identification of <strong>coaching, mentoring and training needs</strong>, considering the testing and automation skills of the people who will use the tool.</li>
<li>Pros and cons of various <strong>licensing models</strong> — commercial (per user, per node, subscription) or open source (free, but you pay in skills and self-support).</li>
<li>Estimation of a <strong>cost-benefit ratio</strong>, based on a concrete business case.</li>
<li>Finally, a <strong>proof-of-concept (PoC) evaluation</strong> — try the short-listed tool on <em>your</em> application to establish whether it works with your software and infrastructure, and to identify the changes needed to use it.</li>
</ol>
<p>Notice the order: the PoC is the <em>last</em> selection step; the pilot project (next slide) comes <em>after</em> the tool is chosen.</p>`,
        `<ol start="6">
<li>Kiểm tra công cụ có <strong>thời gian dùng thử miễn phí</strong> không (và bao lâu) — 14 ngày không đủ để đánh giá một công cụ tự động hoá UI.</li>
<li><strong>Đánh giá nhà cung cấp</strong> — đào tạo, hỗ trợ và điều khoản thương mại; với mã nguồn mở: cộng đồng (hoạt động, tần suất phát hành, ai bảo trì).</li>
<li>Xác định nhu cầu <strong>kèm cặp (coaching), cố vấn (mentoring) và đào tạo</strong>, dựa trên kỹ năng test và automation của những người sẽ dùng công cụ.</li>
<li>Ưu nhược điểm của các <strong>mô hình bản quyền</strong> — thương mại (theo người dùng, theo máy, thuê bao) hay mã nguồn mở (miễn phí, nhưng trả giá bằng kỹ năng và tự hỗ trợ).</li>
<li>Ước lượng <strong>tỉ lệ chi phí-lợi ích</strong>, dựa trên một business case cụ thể.</li>
<li>Cuối cùng, <strong>đánh giá proof-of-concept (PoC)</strong> — thử công cụ trong danh sách ngắn trên <em>chính</em> ứng dụng của bạn để xác định nó có chạy được với phần mềm và hạ tầng của bạn không, và cần thay đổi gì để dùng nó.</li>
</ol>
<p>Để ý thứ tự: PoC là bước <em>cuối</em> của việc chọn; dự án pilot (slide sau) diễn ra <em>sau khi</em> đã chọn công cụ.</p>`],
      [52, 'Pilot project — objectives (older wording)',
        `<p>"The objectives for a pilot project for a new tool are": <strong>to learn more about the tool</strong> (more detail, more depth); <strong>to see how the tool would fit with existing processes or documentation</strong>, how those would need to change to work well with the tool, and how to use the tool to <strong>streamline existing processes</strong>. This is the wording of the older (2011) syllabus — the list continues with "decide on standard ways of using the tool" and "assess whether the benefits will be achieved at reasonable cost". Slide 53 gives the current 2018 list.</p>`,
        `<p>"Mục tiêu của dự án pilot cho một công cụ mới là": <strong>hiểu công cụ kỹ hơn</strong> (chi tiết hơn, sâu hơn); <strong>xem công cụ khớp thế nào với quy trình hoặc tài liệu hiện có</strong>, chúng phải đổi ra sao để làm việc tốt với công cụ, và dùng công cụ thế nào để <strong>tinh gọn quy trình hiện có</strong>. Đây là câu chữ của syllabus cũ (2011) — danh sách còn tiếp "quyết định cách dùng công cụ chuẩn" và "đánh giá lợi ích có đạt được với chi phí hợp lý không". Slide 53 là danh sách 2018 hiện hành.</p>`],
      [53, 'Pilot project — primary objectives (2018)',
        `<p>The five primary objectives of a pilot project (CTFL 2018):</p>
<ol>
<li><strong>Gaining knowledge about the tool</strong> — in depth, understanding both its strengths and its weaknesses.</li>
<li><strong>Evaluating how the tool fits</strong> with existing processes and practices, and what would need to change.</li>
<li><strong>Deciding on standard ways</strong> of using, managing, storing and maintaining the tool and the test assets — naming conventions for files and tests, coding standards for scripts, libraries, modularity of test suites.</li>
<li><strong>Assessing whether the benefits will be achieved at reasonable cost</strong>.</li>
<li><strong>Understanding the metrics</strong> you want the tool to collect and report, and <strong>configuring the tool</strong> so these metrics can be captured and reported.</li>
</ol>
<p>Hook: <em>know it, fit it, standardise it, cost it, measure it</em>. A pilot is <strong>not</strong> "to convince management to buy the tool" and not "to train the whole organisation" — both are classic wrong options.</p>`,
        `<p>Năm mục tiêu chính của dự án pilot (CTFL 2018):</p>
<ol>
<li><strong>Có hiểu biết về công cụ</strong> — sâu, nắm cả điểm mạnh lẫn điểm yếu.</li>
<li><strong>Đánh giá độ khớp của công cụ</strong> với quy trình và thực hành hiện có, và cái gì cần thay đổi.</li>
<li><strong>Quyết định cách chuẩn</strong> để dùng, quản lý, lưu trữ và bảo trì công cụ và tài sản test — quy ước đặt tên file và test, chuẩn viết script, thư viện, cách chia module bộ test.</li>
<li><strong>Đánh giá lợi ích có đạt được với chi phí hợp lý không</strong>.</li>
<li><strong>Hiểu các số liệu</strong> muốn công cụ thu thập và báo cáo, và <strong>cấu hình công cụ</strong> để thu thập, báo cáo được các số liệu đó.</li>
</ol>
<p>Mẹo nhớ: <em>hiểu nó, khớp nó, chuẩn hoá nó, tính tiền nó, đo nó</em>. Pilot <strong>không</strong> nhằm "thuyết phục ban giám đốc mua công cụ" và cũng không nhằm "đào tạo cả tổ chức" — hai phương án sai kinh điển.</p>`],
      [54, 'Success factors for tools',
        `<p>Success factors for evaluating, implementing, deploying and supporting a tool:</p>
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
<p>The syllabus adds one more: ensure the tool is <strong>technically and organisationally integrated</strong> into the software development lifecycle, which may involve separate organisations responsible for operations or third-party suppliers.</p>`,
        `<p>Các yếu tố thành công cho việc đánh giá, cài đặt, triển khai và hỗ trợ công cụ:</p>
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
<p>Syllabus thêm một ý: đảm bảo công cụ được <strong>tích hợp cả về kỹ thuật lẫn tổ chức</strong> vào vòng đời phát triển phần mềm, có thể liên quan tới các tổ chức riêng phụ trách vận hành hoặc nhà cung cấp bên thứ ba.</p>`],
    ]),
    bi(`<h3>Ví dụ có lời giải · Worked example — choosing a UI-automation tool and checking the business case</h3>
<p><b>Situation.</b> The online-shop team of lesson 8.2 (Java back end, React front end, GitHub Actions, testers who know Java) spends <b>40 hours</b> of manual regression testing before every release. It short-lists three tools.</p>
<p><b>Step 1 — objective criteria with weights</b> (slide 50, last bullet). Score 1–5, multiply by the weight, add up:</p>
<div class="table-wrap"><table>
<thead><tr><th>Criterion</th><th>Weight</th><th>Selenium WebDriver</th><th>Playwright</th><th>Tool C (commercial record/replay suite)</th></tr></thead>
<tbody>
<tr><td>Fits our technology (React, Chrome/Safari)</td><td>0.30</td><td>4</td><td>5</td><td>3</td></tr>
<tr><td>Integrates with our CI (headless, reports)</td><td>0.20</td><td>4</td><td>5</td><td>3</td></tr>
<tr><td>Matches team skills / training need</td><td>0.20</td><td>4</td><td>3</td><td>5</td></tr>
<tr><td>Licence and total cost</td><td>0.15</td><td>5</td><td>5</td><td>2</td></tr>
<tr><td>Vendor / community support</td><td>0.15</td><td>5</td><td>4</td><td>4</td></tr>
<tr><td><b>Weighted score</b></td><td>1.00</td><td><b>4.30</b></td><td><b>4.45</b></td><td><b>3.40</b></td></tr>
</tbody>
</table></div>
<p>Check Playwright: 0.30×5 + 0.20×5 + 0.20×3 + 0.15×5 + 0.15×4 = 1.50 + 1.00 + 0.60 + 0.75 + 0.60 = <b>4.45</b>. (All three totals were recomputed with a small Node script: <code>Selenium 4.30 · Playwright 4.45 · Tool C 3.40</code>.) Playwright and Selenium are close — so the <b>proof of concept</b> (slide 51) on the real checkout page decides, not the spreadsheet.</p>
<p><b>Step 2 — cost-benefit ratio.</b> Estimates for automating the regression suite: build <b>240 h</b> once; per run <b>4 h</b> maintenance + <b>1 h</b> to analyse results, instead of 40 h manual. Automation pays for itself after <em>n</em> runs when 240 + 5n ≤ 40n, i.e. n ≥ 240 / 35 = 6.86 → <b>7 runs</b>.</p>
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
<p><b>Step 3 — pilot.</b> Automate the checkout flow of one team for two sprints, with the five pilot objectives as the pilot's exit report: what did we learn about Playwright, what changed in our process, which naming and folder conventions do we adopt, was the 5 h/run estimate right, which metrics (pass rate, flaky rate, run time) does the CI report show?</p>
<div class="pitfall"><b>Which list is it?</b> "Evaluate the vendor", "free trial", "licensing model", "proof of concept" → <em>selection</em>. "Learn the tool in depth", "decide standard ways of using it", "assess benefits at reasonable cost", "which metrics to collect" → <em>pilot</em>. "Roll out incrementally", "training and mentoring", "guidelines", "monitor use and benefits", "lessons learned from all users" → <em>success factors</em>. Watch for "roll out to the whole organisation at once" — the opposite of a success factor.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Total cost of ownership and open-source due diligence.</b> The licence price is often the smallest cost: TCO = licence + infrastructure (grid machines, device farm) + training + script development + <em>maintenance over the tool's whole life</em> + the cost of switching away later (vendor lock-in; proprietary script formats). For open-source tools, due diligence means checking the licence (Apache-2.0 and MIT are permissive; GPL has obligations when you distribute), the project's bus factor and release rhythm, and adding the dependency to your software bill of materials (SBOM) so security advisories reach you. <em>Outside the syllabus because CTFL stops at "estimate a cost-benefit ratio" and "consider licensing models".</em></div>`,
      `<h3>Ví dụ có lời giải · Chọn công cụ tự động hoá UI và kiểm tra business case</h3>
<p><b>Tình huống.</b> Đội shop online của bài 8.2 (back end Java, front end React, GitHub Actions, tester biết Java) tốn <b>40 giờ</b> regression test thủ công trước mỗi lần phát hành. Đội chọn ra ba công cụ vào danh sách ngắn.</p>
<p><b>Bước 1 — tiêu chí khách quan có trọng số</b> (slide 50, gạch cuối). Chấm 1–5, nhân trọng số, cộng lại:</p>
<div class="table-wrap"><table>
<thead><tr><th>Tiêu chí</th><th>Trọng số</th><th>Selenium WebDriver</th><th>Playwright</th><th>Tool C (bộ record/replay thương mại)</th></tr></thead>
<tbody>
<tr><td>Khớp công nghệ (React, Chrome/Safari)</td><td>0.30</td><td>4</td><td>5</td><td>3</td></tr>
<tr><td>Tích hợp với CI (headless, báo cáo)</td><td>0.20</td><td>4</td><td>5</td><td>3</td></tr>
<tr><td>Hợp kỹ năng đội / nhu cầu đào tạo</td><td>0.20</td><td>4</td><td>3</td><td>5</td></tr>
<tr><td>Bản quyền và tổng chi phí</td><td>0.15</td><td>5</td><td>5</td><td>2</td></tr>
<tr><td>Hỗ trợ của hãng / cộng đồng</td><td>0.15</td><td>5</td><td>4</td><td>4</td></tr>
<tr><td><b>Điểm có trọng số</b></td><td>1.00</td><td><b>4.30</b></td><td><b>4.45</b></td><td><b>3.40</b></td></tr>
</tbody>
</table></div>
<p>Kiểm Playwright: 0.30×5 + 0.20×5 + 0.20×3 + 0.15×5 + 0.15×4 = 1.50 + 1.00 + 0.60 + 0.75 + 0.60 = <b>4.45</b>. (Cả ba tổng đã được tính lại bằng một script Node nhỏ: <code>Selenium 4.30 · Playwright 4.45 · Tool C 3.40</code>.) Playwright và Selenium sát nhau — nên <b>proof of concept</b> (slide 51) trên trang checkout thật mới là thứ quyết định, không phải bảng tính.</p>
<p><b>Bước 2 — tỉ lệ chi phí-lợi ích.</b> Ước lượng để tự động hoá bộ regression: xây dựng <b>240 giờ</b> một lần; mỗi lần chạy tốn <b>4 giờ</b> bảo trì + <b>1 giờ</b> phân tích kết quả, thay cho 40 giờ làm tay. Automation hoà vốn sau <em>n</em> lần chạy khi 240 + 5n ≤ 40n, tức n ≥ 240 / 35 = 6,86 → <b>7 lần chạy</b>.</p>
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
<p><b>Bước 3 — pilot.</b> Tự động hoá luồng checkout của một đội trong hai sprint, lấy năm mục tiêu pilot làm báo cáo kết thúc pilot: học được gì về Playwright, quy trình đổi gì, chọn quy ước đặt tên và thư mục nào, ước lượng 5 giờ/lần chạy có đúng không, báo cáo CI hiện những số liệu gì (tỉ lệ pass, tỉ lệ flaky, thời gian chạy)?</p>
<div class="pitfall"><b>Thuộc danh sách nào?</b> "Đánh giá nhà cung cấp", "dùng thử miễn phí", "mô hình bản quyền", "proof of concept" → <em>chọn công cụ</em>. "Hiểu sâu công cụ", "quyết định cách dùng chuẩn", "đánh giá lợi ích với chi phí hợp lý", "số liệu cần thu thập" → <em>pilot</em>. "Triển khai từng bước", "đào tạo và cố vấn", "hướng dẫn sử dụng", "giám sát việc dùng và lợi ích", "bài học từ mọi người dùng" → <em>yếu tố thành công</em>. Cẩn thận với "triển khai cho cả tổ chức cùng lúc" — ngược hẳn với yếu tố thành công.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Tổng chi phí sở hữu và thẩm định mã nguồn mở.</b> Giá bản quyền thường là khoản nhỏ nhất: TCO = bản quyền + hạ tầng (máy grid, trang trại thiết bị) + đào tạo + viết script + <em>bảo trì suốt đời công cụ</em> + chi phí đổi sang công cụ khác về sau (khoá chặt vào nhà cung cấp; định dạng script độc quyền). Với công cụ mã nguồn mở, thẩm định nghĩa là kiểm giấy phép (Apache-2.0 và MIT dễ dãi; GPL có nghĩa vụ khi bạn phân phối), "bus factor" và nhịp phát hành của dự án, và đưa thư viện vào danh mục thành phần phần mềm (SBOM) để nhận được cảnh báo bảo mật. <em>Ngoài giáo trình vì CTFL dừng ở "ước lượng tỉ lệ chi phí-lợi ích" và "cân nhắc mô hình bản quyền".</em></div>`),
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
<p class="lead">The folder <em>04.Samples</em> contains exactly three files: <code>build.xml</code> (an Apache Ant build script with JaCoCo coverage), <code>junit-4.13.2.jar</code> and <code>hamcrest-core-1.3.jar</code>. They are the tool chain of Lab 2 — a <strong>unit test framework (D)</strong>, a <strong>coverage tool (D)</strong> and a <strong>build tool</strong> that CI servers call (lesson 8.2, slides 13, 22, 24). In this lesson you read the build file target by target, run a real JUnit 4 test suite with the two jars (including a failing test, and how the failure is reported), then write the same tests in JUnit 5 with Maven and learn the JUnit 4 → 5 migration.</p>
<div class="callout"><b>What you will be able to do.</b> Explain every target of <code>build.xml</code> and the order Ant runs them · compile and run JUnit 4 tests from the command line without an IDE or Ant · read a JUnit failure report (expected/actual, line number, exit code) · write JUnit 5 tests with <code>@BeforeEach</code>, <code>assertThrows</code>, <code>assertAll</code> and <code>@ParameterizedTest</code> · migrate a JUnit 4 test class. Every output on this page was produced by really running the code (JDK 21, JUnit 4.13.2, Maven 3.9.11 with JUnit 5.12.2 and JaCoCo 0.8.13).</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">clean</div><div class="lz-t">delete build/ and report/</div><div class="lz-d">always first</div></div>
  <div class="lz-step"><div class="lz-k">→ compile</div><div class="lz-t">javac src → build/classes</div><div class="lz-d">default target</div></div>
  <div class="lz-step"><div class="lz-k">→ compile-tests</div><div class="lz-t">javac test → build/classes</div><div class="lz-d">needs JUnit on the classpath</div></div>
  <div class="lz-step"><div class="lz-k">→ test-with-jacoco</div><div class="lz-t">run **/*Test with the JaCoCo agent</div><div class="lz-d">writes jacoco.exec</div></div>
  <div class="lz-step"><div class="lz-k">→ jacoco-report</div><div class="lz-t">HTML + CSV + XML coverage</div><div class="lz-d">report/html/index.html</div></div>
</div>`,
      `<span class="eyebrow">Chương 8 · Bài 8.5 · Thực hành — 01.Materials/04.Samples</span>
<h2>JUnit thực chiến: bộ công cụ build của chính môn học</h2>
<p class="lead">Thư mục <em>04.Samples</em> có đúng ba file: <code>build.xml</code> (script build Apache Ant có đo coverage bằng JaCoCo), <code>junit-4.13.2.jar</code> và <code>hamcrest-core-1.3.jar</code>. Đó là bộ công cụ của Lab 2 — một <strong>unit test framework (D)</strong>, một <strong>công cụ coverage (D)</strong> và một <strong>công cụ build</strong> mà CI server gọi tới (bài 8.2, slide 13, 22, 24). Trong bài này bạn đọc file build từng target, chạy thật một bộ test JUnit 4 bằng hai file jar (có cả test fail, và cách failure được báo), rồi viết lại các test đó bằng JUnit 5 với Maven và học cách chuyển JUnit 4 → 5.</p>
<div class="callout"><b>Học xong bạn làm được.</b> Giải thích mọi target của <code>build.xml</code> và thứ tự Ant chạy chúng · biên dịch và chạy JUnit 4 từ dòng lệnh, không cần IDE hay Ant · đọc báo cáo failure của JUnit (expected/actual, số dòng, exit code) · viết test JUnit 5 với <code>@BeforeEach</code>, <code>assertThrows</code>, <code>assertAll</code> và <code>@ParameterizedTest</code> · chuyển một lớp test JUnit 4 sang JUnit 5. Mọi output trên trang này đều do chạy code thật (JDK 21, JUnit 4.13.2, Maven 3.9.11 với JUnit 5.12.2 và JaCoCo 0.8.13).</div>
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
<tr><td><code>&lt;property&gt;</code> ×7</td><td>Names for folders and files: <code>src</code>, <code>test</code>, <code>build/classes</code>, <code>libs/jacoco-0.8.13/lib</code>, <code>report</code>, <code>jacoco.exec</code>.</td><td><code>build.test.dir</code> is declared but <b>never used</b> — tests are compiled into <code>build/classes</code> together with the code.</td></tr>
<tr><td><code>&lt;taskdef&gt;</code></td><td>Loads the JaCoCo Ant tasks from <code>jacocoant.jar</code>.</td><td>It is outside any target, so it runs on <em>every</em> call — if <code>jacocoant.jar</code> is missing even <code>ant clean</code> fails.</td></tr>
<tr><td><code>clean</code></td><td>Deletes <code>build/</code> and <code>report/</code>.</td><td>Does not delete <code>jacoco.exec</code>; JaCoCo appends to it by default, so old runs can mix in (delete it by hand for a clean measure).</td></tr>
<tr><td><code>compile</code> (depends on clean)</td><td><code>javac</code> of <code>src</code> into <code>build/classes</code>, UTF-8, with debug info (lines, vars, source).</td><td>Because it depends on <code>clean</code>, <b>every compile is a full rebuild</b>. Debug info is what lets JaCoCo and stack traces show line numbers.</td></tr>
<tr><td><code>compile-tests</code> (depends on compile)</td><td><code>javac</code> of <code>test</code>, classpath = compiled code + every jar in <code>lib.dir</code>.</td><td>That is why JUnit and Hamcrest must be copied into <code>libs/jacoco-0.8.13/lib</code>: it is the only library folder the script knows.</td></tr>
<tr><td><code>test-with-jacoco</code> (depends on compile-tests)</td><td>Runs the Ant <code>&lt;junit&gt;</code> task inside <code>&lt;jacoco:coverage&gt;</code>; <code>batchtest</code> picks every <code>**/*Test.java</code> in <code>test/</code>.</td><td><code>fork="true"</code> is required — JaCoCo attaches its agent to a new JVM. <code>haltonfailure</code>/<code>haltonerror="true"</code>: one red test ⇒ <b>BUILD FAILED</b> and the later targets never run. A class named <code>CalculatorTests</code> or <code>TestCalculator</code> is silently <b>not run</b>.</td></tr>
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
<p>Ant is <b>not installed</b> on the machine used to write this page (and often not on students' machines outside NetBeans), so below are the equivalent plain <code>javac</code>/<code>java</code> commands, run for real with the two jars copied into <code>lib/</code>. They do what <code>compile</code>, <code>compile-tests</code> and the test part of <code>test-with-jacoco</code> do (without coverage). On Windows, replace the classpath separator <code>:</code> by <code>;</code>.</p>`,
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
<tr><td><code>&lt;property&gt;</code> ×7</td><td>Đặt tên cho thư mục và file: <code>src</code>, <code>test</code>, <code>build/classes</code>, <code>libs/jacoco-0.8.13/lib</code>, <code>report</code>, <code>jacoco.exec</code>.</td><td><code>build.test.dir</code> được khai báo nhưng <b>không bao giờ dùng</b> — test được biên dịch chung vào <code>build/classes</code> với code.</td></tr>
<tr><td><code>&lt;taskdef&gt;</code></td><td>Nạp các task Ant của JaCoCo từ <code>jacocoant.jar</code>.</td><td>Nó nằm ngoài mọi target nên chạy ở <em>mọi</em> lệnh — thiếu <code>jacocoant.jar</code> thì ngay cả <code>ant clean</code> cũng lỗi.</td></tr>
<tr><td><code>clean</code></td><td>Xoá <code>build/</code> và <code>report/</code>.</td><td>Không xoá <code>jacoco.exec</code>; mặc định JaCoCo ghi nối vào file này, nên dữ liệu các lần chạy cũ có thể trộn vào (xoá tay nếu muốn đo sạch).</td></tr>
<tr><td><code>compile</code> (phụ thuộc clean)</td><td><code>javac</code> thư mục <code>src</code> vào <code>build/classes</code>, UTF-8, kèm thông tin debug (dòng, biến, nguồn).</td><td>Vì phụ thuộc <code>clean</code>, <b>mỗi lần compile là build lại toàn bộ</b>. Thông tin debug giúp JaCoCo và stack trace hiện số dòng.</td></tr>
<tr><td><code>compile-tests</code> (phụ thuộc compile)</td><td><code>javac</code> thư mục <code>test</code>, classpath = code đã biên dịch + mọi jar trong <code>lib.dir</code>.</td><td>Vì vậy JUnit và Hamcrest phải được chép vào <code>libs/jacoco-0.8.13/lib</code>: đó là thư mục thư viện duy nhất script biết.</td></tr>
<tr><td><code>test-with-jacoco</code> (phụ thuộc compile-tests)</td><td>Chạy task <code>&lt;junit&gt;</code> của Ant bên trong <code>&lt;jacoco:coverage&gt;</code>; <code>batchtest</code> lấy mọi <code>**/*Test.java</code> trong <code>test/</code>.</td><td>Bắt buộc <code>fork="true"</code> — JaCoCo gắn agent vào một JVM mới. <code>haltonfailure</code>/<code>haltonerror="true"</code>: một test đỏ ⇒ <b>BUILD FAILED</b> và các target sau không chạy. Lớp tên <code>CalculatorTests</code> hay <code>TestCalculator</code> sẽ <b>bị bỏ qua im lặng</b>.</td></tr>
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
<p>Máy dùng để soạn trang này <b>không cài Ant</b> (máy sinh viên ngoài NetBeans cũng thường không có), nên dưới đây là các lệnh <code>javac</code>/<code>java</code> thuần tương đương, đã chạy thật với hai jar chép vào <code>lib/</code>. Chúng làm đúng việc của <code>compile</code>, <code>compile-tests</code> và phần chạy test của <code>test-with-jacoco</code> (không đo coverage). Trên Windows, đổi dấu phân cách classpath <code>:</code> thành <code>;</code>.</p>`),
    bi(`<h3>4 · Ví dụ có lời giải · Worked example — JUnit 4.13.2 from the command line</h3>
<p>The class under test has three methods. <code>average</code> hides a real defect: <code>a + b</code> overflows for large values. We apply boundary value analysis (Chapter 4) and put <code>Integer.MAX_VALUE</code> in a test.</p>
${CALC_J4}
${TEST_J4}
<p><b>Commands and real output:</b></p>
${RUN_J4}
<p><b>How to read it.</b></p>
<ol>
<li><code>...E..I</code> — one character per test, in execution order: <code>.</code> a test started, <code>E</code> right after the dot of a test that failed, <code>I</code> an ignored test. (JUnit 4 does not guarantee the order of test methods; do not make tests depend on each other.)</li>
<li><code>@BeforeClass</code> printed once; <code>@Before</code>/<code>@After</code> ran around each of the 5 tests — every test gets a fresh <code>Calculator</code>.</li>
<li><code>Tests run: 5, Failures: 1</code> — the <code>@Ignore</code>d test is not counted as run. <code>divideByZeroThrows</code> passed because the exception was <em>expected</em>.</li>
<li>The failure report names the test, the <b>message</b> we gave, <b>expected</b> and <b>actual</b> values, and the line <code>CalculatorTest.java:50</code> in our test. JUnit 4 distinguishes a <em>failure</em> (an assertion was false) from an <em>error</em> (an unexpected exception).</li>
<li>Exit code <b>1</b> — this is what makes a CI server (lesson 8.6) mark the build red. With Ant the same failure would stop <code>test-with-jacoco</code> with <em>BUILD FAILED</em> (because of <code>haltonfailure="true"</code>) and no coverage report would be written.</li>
<li>Why −1? 2,147,483,647 + 2,147,483,647 wraps round to −2 in 32-bit arithmetic; −2 / 2 = −1. The test found a <b>defect</b> (a failure observed); <b>debugging</b> finds the cause and fixes it — see the JUnit 5 run below, where the fix is confirmed by re-running the tests (<b>confirmation testing</b>) and the other tests guard against regressions.</li>
</ol>
<h3>5 · The same tests in JUnit 5 with Maven</h3>
<p>Maven replaces both Ant and the hand-copied jars: dependencies are declared in <code>pom.xml</code> and downloaded to <code>~/.m2</code>; the Surefire plugin runs every <code>*Test</code> class during <code>mvn test</code>. Layout: <code>src/main/java</code> and <code>src/test/java</code>.</p>
${POM}
${TEST_J5}
<p><b>Real run (Maven 3.9.11):</b> before the fix, then after changing <code>average</code> to <code>return (int) (((long) a + b) / 2);</code>.</p>
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
<tr><td>Assertions class</td><td><code>org.junit.Assert</code>; message is the <b>first</b> parameter</td><td><code>org.junit.jupiter.api.Assertions</code>; message is the <b>last</b> parameter; new <code>assertAll</code>, <code>assertThrows</code></td></tr>
<tr><td><code>assertThat</code></td><td>in <code>Assert</code> (Hamcrest)</td><td>removed — use Hamcrest's <code>MatcherAssert.assertThat</code> or AssertJ</td></tr>
<tr><td>Assumptions</td><td><code>Assume</code> class</td><td><code>Assumptions</code> class; <code>assumeNotNull</code>, <code>assumeNoException</code> removed</td></tr>
<tr><td>Dependency</td><td>one jar (+ Hamcrest)</td><td>modular: <code>junit-jupiter-api</code> + <code>junit-jupiter-engine</code> (+ <code>-params</code>), or the aggregate <code>junit-jupiter</code></td></tr>
</tbody>
</table></div>
<p><b>Migration steps</b> (JUnit in Action, Table 4.1): (1) <b>replace the dependencies</b> — add <code>junit-vintage-engine</code> so the old JUnit 4 tests keep running on the JUnit Platform next to new Jupiter tests; (2) <b>replace the annotations</b> and introduce the new ones; (3) <b>replace the testing classes and methods</b> — assertions and assumptions moved to other classes and packages; (4) <b>replace rules and runners with the extension model</b> — the most effort, and it can be done last. When no JUnit 4 test is left, remove the vintage engine. (The book's Table 4.2 prints <code>@Disable</code>; the real annotation is <code>@Disabled</code>.)</p>
<div class="pitfall"><b>The green build that tests nothing.</b> Put a JUnit 4 test (<code>import org.junit.Test;</code>) in a project that has only the Jupiter engine and no <code>junit-vintage-engine</code>: Maven compiles it, finds no JUnit 5 tests and reports <em>Tests run: 0 … BUILD SUCCESS</em>. Likewise an Ant <code>batchtest</code> with <code>**/*Test.java</code> ignores <code>CalculatorTests.java</code>, and <code>-Dmaven.test.failure.ignore=true</code> turns 2 failing tests into <em>BUILD SUCCESS</em> (we tried it: "Tests run: 8, Failures: 2" and still BUILD SUCCESS). Always read the number of tests run, not only the colour.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>100&nbsp;% coverage did not find the bug — mutation testing asks the right question.</b> We re-ran JaCoCo on the <em>buggy</em> <code>average</code> (failures ignored so the report is written): coverage was already 4/4 lines and 17/17 instructions, 100&nbsp;%. Coverage only proves the lines were <em>executed</em>; the defect was found by <em>choosing</em> the boundary value. Mutation testing (PIT for Java, JUnit in Action §6.5) measures test <em>strength</em> instead: it makes small changes to the code (replace <code>+</code> by <code>-</code>, <code>/ 2</code> by <code>* 2</code>…) and checks that at least one test fails for each "mutant". Surviving mutants show weak tests. Also note: JUnit 6 was released in September 2025 (Java 17+, one version number for Platform, Jupiter and Vintage); code written for JUnit 5 Jupiter runs on it with minor changes. <em>Outside the syllabus because CTFL treats unit test frameworks and coverage tools only as tool types.</em></div>`,
      `<h3>4 · Ví dụ có lời giải · JUnit 4.13.2 từ dòng lệnh</h3>
<p>Lớp được test có ba phương thức. <code>average</code> giấu một defect thật: <code>a + b</code> bị tràn số với giá trị lớn. Ta áp dụng phân tích giá trị biên (Chương 4) và đưa <code>Integer.MAX_VALUE</code> vào một test.</p>
${CALC_J4}
${TEST_J4}
<p><b>Lệnh và output thật:</b></p>
${RUN_J4}
<p><b>Đọc output thế nào.</b></p>
<ol>
<li><code>...E..I</code> — mỗi test một ký tự, theo thứ tự chạy: <code>.</code> một test bắt đầu, <code>E</code> ngay sau dấu chấm của test bị fail, <code>I</code> test bị bỏ qua. (JUnit 4 không đảm bảo thứ tự các phương thức test; đừng để test phụ thuộc nhau.)</li>
<li><code>@BeforeClass</code> in ra một lần; <code>@Before</code>/<code>@After</code> chạy quanh từng test trong 5 test — test nào cũng có một <code>Calculator</code> mới.</li>
<li><code>Tests run: 5, Failures: 1</code> — test <code>@Ignore</code> không được tính là đã chạy. <code>divideByZeroThrows</code> pass vì exception là điều <em>được mong đợi</em>.</li>
<li>Báo cáo failure nêu tên test, <b>thông điệp</b> ta đặt, giá trị <b>expected</b> và <b>actual</b>, và dòng <code>CalculatorTest.java:50</code> trong test của ta. JUnit 4 phân biệt <em>failure</em> (một assertion sai) với <em>error</em> (một exception không mong đợi).</li>
<li>Exit code <b>1</b> — chính điều này khiến CI server (bài 8.6) đánh dấu build đỏ. Với Ant, failure này sẽ dừng <code>test-with-jacoco</code> với <em>BUILD FAILED</em> (vì <code>haltonfailure="true"</code>) và không có báo cáo coverage nào được ghi.</li>
<li>Vì sao ra −1? 2.147.483.647 + 2.147.483.647 tràn vòng thành −2 trong số học 32-bit; −2 / 2 = −1. Test đã tìm ra <b>defect</b> (quan sát được một failure); <b>debugging</b> tìm nguyên nhân và sửa — xem lần chạy JUnit 5 bên dưới, nơi bản sửa được xác nhận bằng cách chạy lại test (<b>confirmation testing</b>) và các test còn lại canh chừng regression.</li>
</ol>
<h3>5 · Cùng bộ test đó bằng JUnit 5 với Maven</h3>
<p>Maven thay cho cả Ant lẫn việc chép jar bằng tay: thư viện được khai báo trong <code>pom.xml</code> và tải về <code>~/.m2</code>; plugin Surefire chạy mọi lớp <code>*Test</code> trong <code>mvn test</code>. Cấu trúc: <code>src/main/java</code> và <code>src/test/java</code>.</p>
${POM}
${TEST_J5}
<p><b>Lần chạy thật (Maven 3.9.11):</b> trước khi sửa, rồi sau khi đổi <code>average</code> thành <code>return (int) (((long) a + b) / 2);</code>.</p>
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
<tr><td>Lớp assertion</td><td><code>org.junit.Assert</code>; thông điệp là tham số <b>đầu tiên</b></td><td><code>org.junit.jupiter.api.Assertions</code>; thông điệp là tham số <b>cuối cùng</b>; thêm <code>assertAll</code>, <code>assertThrows</code></td></tr>
<tr><td><code>assertThat</code></td><td>có trong <code>Assert</code> (Hamcrest)</td><td>bị bỏ — dùng <code>MatcherAssert.assertThat</code> của Hamcrest hoặc AssertJ</td></tr>
<tr><td>Assumption</td><td>lớp <code>Assume</code></td><td>lớp <code>Assumptions</code>; bỏ <code>assumeNotNull</code>, <code>assumeNoException</code></td></tr>
<tr><td>Thư viện</td><td>một jar (+ Hamcrest)</td><td>chia module: <code>junit-jupiter-api</code> + <code>junit-jupiter-engine</code> (+ <code>-params</code>), hoặc gói gộp <code>junit-jupiter</code></td></tr>
</tbody>
</table></div>
<p><b>Các bước chuyển</b> (JUnit in Action, Bảng 4.1): (1) <b>thay thư viện</b> — thêm <code>junit-vintage-engine</code> để các test JUnit 4 cũ vẫn chạy trên JUnit Platform cạnh các test Jupiter mới; (2) <b>thay annotation</b> và dùng thêm annotation mới; (3) <b>thay các lớp và phương thức kiểm thử</b> — assertion và assumption đã chuyển sang lớp và package khác; (4) <b>thay rule và runner bằng mô hình extension</b> — tốn công nhất, có thể làm sau cùng. Khi không còn test JUnit 4 nào thì bỏ vintage engine. (Bảng 4.2 của sách in <code>@Disable</code>; annotation thật là <code>@Disabled</code>.)</p>
<div class="pitfall"><b>Build xanh mà chẳng test gì.</b> Để một test JUnit 4 (<code>import org.junit.Test;</code>) trong dự án chỉ có engine Jupiter mà không có <code>junit-vintage-engine</code>: Maven vẫn biên dịch, không tìm thấy test JUnit 5 nào và báo <em>Tests run: 0 … BUILD SUCCESS</em>. Tương tự, <code>batchtest</code> của Ant với <code>**/*Test.java</code> bỏ qua <code>CalculatorTests.java</code>, và <code>-Dmaven.test.failure.ignore=true</code> biến 2 test fail thành <em>BUILD SUCCESS</em> (chúng tôi đã thử: "Tests run: 8, Failures: 2" mà vẫn BUILD SUCCESS). Luôn đọc số test đã chạy, đừng chỉ nhìn màu.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Coverage 100&nbsp;% không tìm ra bug — mutation testing mới hỏi đúng câu.</b> Chúng tôi chạy lại JaCoCo trên bản <code>average</code> <em>còn lỗi</em> (bỏ qua failure để báo cáo vẫn được ghi): coverage đã là 4/4 dòng và 17/17 lệnh, 100&nbsp;%. Coverage chỉ chứng minh các dòng đã được <em>chạy qua</em>; defect được tìm ra nhờ <em>chọn</em> giá trị biên. Mutation testing (PIT cho Java, JUnit in Action §6.5) đo <em>độ mạnh</em> của test: nó sửa code một chút (đổi <code>+</code> thành <code>-</code>, <code>/ 2</code> thành <code>* 2</code>…) và kiểm tra với mỗi "đột biến" có ít nhất một test fail không. Đột biến sống sót cho thấy test yếu. Thêm: JUnit 6 phát hành tháng 9/2025 (Java 17+, một số phiên bản chung cho Platform, Jupiter và Vintage); code viết cho JUnit 5 Jupiter chạy được trên nó với vài thay đổi nhỏ. <em>Ngoài giáo trình vì CTFL chỉ coi unit test framework và công cụ coverage là các loại công cụ.</em></div>`),
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
<p class="lead">Lessons 8.1–8.4 answered <em>which</em> tools exist and <em>how</em> to introduce them; lesson 8.5 ran a unit test framework. This lesson assembles them into what teams actually run: a <strong>test pyramid</strong> that says how many tests to automate at each level, a <strong>continuous integration</strong> server (slide 13) that runs them on every change, and <strong>Selenium WebDriver</strong>, the most widely used test execution tool (slide 21) for the few end-to-end tests at the top.</p>
<div class="callout"><b>Links to the syllabus.</b> CI tools (D) — group 1, SWT6 slide 13 · unit test frameworks (D) and test execution tools — group 4, slides 21 and 24 · benefits and risks — lesson 8.3. The test pyramid itself is an Agile Tester topic (ISTQB Agile Tester, Chapter 3 objectives) and appears in Chapter 9.</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">UI / end-to-end (few)</span><span class="lz-lnote">Selenium, Playwright — seconds to minutes each, brittle; only critical user journeys</span></div>
  <div class="lz-layer"><span class="lz-lname">Integration / API (some)</span><span class="lz-lnote">REST Assured, Spring tests, test containers — interfaces between components</span></div>
  <div class="lz-layer"><span class="lz-lname">Unit / component (many)</span><span class="lz-lnote">JUnit + Mockito — milliseconds, run on every push, pinpoint the failing line</span></div>
</div>`,
      `<span class="eyebrow">Chương 8 · Bài 8.6 · mở rộng ngoài slide SWT6</span>
<h2>Đưa tự động hoá vào vận hành: pyramid, CI và Selenium</h2>
<p class="lead">Bài 8.1–8.4 trả lời có <em>những</em> công cụ nào và đưa chúng vào <em>thế nào</em>; bài 8.5 đã chạy một unit test framework. Bài này lắp chúng lại thành thứ các đội thật sự chạy: một <strong>test pyramid</strong> cho biết tự động hoá bao nhiêu test ở mỗi cấp, một server <strong>tích hợp liên tục (CI)</strong> (slide 13) chạy chúng mỗi khi có thay đổi, và <strong>Selenium WebDriver</strong>, công cụ thực thi test (slide 21) phổ biến nhất cho vài test đầu-cuối ở đỉnh.</p>
<div class="callout"><b>Nối với syllabus.</b> Công cụ CI (D) — nhóm 1, SWT6 slide 13 · unit test framework (D) và công cụ thực thi test — nhóm 4, slide 21 và 24 · lợi ích và rủi ro — bài 8.3. Bản thân test pyramid là chủ đề của ISTQB Agile Tester (chuẩn đầu ra Chương 3) và xuất hiện ở Chương 9.</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">UI / đầu-cuối (ít)</span><span class="lz-lnote">Selenium, Playwright — mỗi test vài giây tới vài phút, dễ gãy; chỉ hành trình người dùng trọng yếu</span></div>
  <div class="lz-layer"><span class="lz-lname">Integration / API (vừa)</span><span class="lz-lnote">REST Assured, Spring test, test container — giao diện giữa các component</span></div>
  <div class="lz-layer"><span class="lz-lname">Unit / component (nhiều)</span><span class="lz-lnote">JUnit + Mockito — mili giây, chạy mỗi lần push, chỉ đích danh dòng lỗi</span></div>
</div>`),
    bi(`<h3>1 · The test pyramid</h3>
<p>Mike Cohn's <strong>test pyramid</strong> (<em>Succeeding with Agile</em>, 2009) says: many fast, cheap tests at the bottom, fewer as you go up. The reason is cost per test — the higher the level, the slower the test, the more it breaks for reasons unrelated to the code under test (layout changes, network, test data), and the harder it is to locate the defect when it fails. JUnit in Action (Ch.22) maps the layers onto the ISTQB test levels: unit → component testing, integration → component-integration and system-integration testing, UI/end-to-end → system and acceptance testing.</p>
<p>The anti-pattern is the <strong>inverted pyramid</strong> or <strong>"ice-cream cone"</strong>: mostly UI tests, often recorded with capture/replay, few unit tests. The suite becomes so slow and unreliable that the team stops trusting it — tests are disabled one by one until the green build verifies almost nothing.</p>
<h3>2 · Continuous integration — the tests on every push</h3>
<p><strong>CI</strong> is the practice of integrating code into the shared mainline <em>frequently</em> (at least daily) and having a server <em>automatically build and test</em> every change (slide 13). Practices that make it work: every developer commits small changes often; the build and unit tests finish within minutes; a <strong>red build</strong> means the last change broke something and fixing it is the team's first priority; nobody merges on red. The server knows red from green through exit codes — the same <code>exit code 1</code> that JUnitCore and <code>mvn test</code> returned in lesson 8.5.</p>
${GHA}
<p>Other CI servers express the same pipeline differently (a <code>Jenkinsfile</code> for Jenkins, <code>.gitlab-ci.yml</code> for GitLab). A typical pipeline is ordered by speed, to fail fast: compile → static analysis → unit tests + coverage → integration tests → deploy to a test environment → a small end-to-end smoke suite.</p>
<h3>3 · Selenium WebDriver</h3>
<p>Selenium WebDriver drives a <em>real</em> browser through the W3C WebDriver protocol: your test code calls the client library (Java, Python, C#, JavaScript) → a browser-specific driver (chromedriver, geckodriver) → the browser. It types, clicks and reads the page like a user — a test execution tool in the ISTQB sense, used for system/acceptance-level regression. Rules that keep Selenium tests maintainable:</p>
<ul>
<li><b>Stable locators</b>: prefer <code>By.id</code> or a dedicated <code>data-testid</code> attribute over long XPath expressions that break with every layout change.</li>
<li><b>Explicit waits</b> (<code>WebDriverWait</code> + <code>ExpectedConditions</code>) instead of <code>Thread.sleep</code>: wait for a condition, not for a guessed number of seconds.</li>
<li><b>Page Object pattern</b>: one class per page holds its locators and actions, so a UI change is fixed in one place — the same idea as the keyword library of lesson 8.3.</li>
<li><b>Independent tests</b>: each test prepares its own data and closes its browser (<code>driver.quit()</code>).</li>
</ul>
${SEL}`,
      `<h3>1 · Test pyramid</h3>
<p><strong>Test pyramid</strong> của Mike Cohn (<em>Succeeding with Agile</em>, 2009) nói: nhiều test nhanh, rẻ ở đáy, càng lên cao càng ít. Lý do là chi phí mỗi test — cấp càng cao, test càng chậm, càng hay gãy vì những lý do không liên quan tới code đang test (bố cục đổi, mạng, dữ liệu test), và càng khó định vị defect khi nó fail. JUnit in Action (Chương 22) ánh xạ các tầng vào các cấp test của ISTQB: unit → component testing, integration → component-integration và system-integration testing, UI/đầu-cuối → system và acceptance testing.</p>
<p>Anti-pattern là <strong>kim tự tháp ngược</strong> hay <strong>"ốc quế kem"</strong>: chủ yếu là UI test, thường ghi bằng capture/replay, rất ít unit test. Bộ test trở nên chậm và thiếu tin cậy tới mức đội ngừng tin nó — test bị tắt từng cái một cho tới khi build xanh gần như chẳng kiểm gì.</p>
<h3>2 · Tích hợp liên tục — test ở mỗi lần push</h3>
<p><strong>CI</strong> là thực hành tích hợp code vào nhánh chính dùng chung <em>thường xuyên</em> (ít nhất mỗi ngày) và để một server <em>tự động build và test</em> mọi thay đổi (slide 13). Những thực hành giúp nó chạy được: developer nào cũng commit thay đổi nhỏ và thường xuyên; build và unit test xong trong vài phút; <strong>build đỏ</strong> nghĩa là thay đổi vừa rồi làm hỏng thứ gì đó và sửa nó là ưu tiên số một của đội; không ai merge khi đang đỏ. Server phân biệt đỏ và xanh qua exit code — đúng cái <code>exit code 1</code> mà JUnitCore và <code>mvn test</code> trả về ở bài 8.5.</p>
${GHA}
<p>CI server khác diễn tả cùng pipeline theo cách khác (<code>Jenkinsfile</code> cho Jenkins, <code>.gitlab-ci.yml</code> cho GitLab). Pipeline điển hình xếp theo tốc độ để fail sớm: biên dịch → phân tích tĩnh → unit test + coverage → integration test → deploy lên môi trường test → một bộ smoke test đầu-cuối nhỏ.</p>
<h3>3 · Selenium WebDriver</h3>
<p>Selenium WebDriver điều khiển một trình duyệt <em>thật</em> qua giao thức W3C WebDriver: code test gọi thư viện client (Java, Python, C#, JavaScript) → driver riêng của trình duyệt (chromedriver, geckodriver) → trình duyệt. Nó gõ, bấm và đọc trang như người dùng — một công cụ thực thi test theo nghĩa ISTQB, dùng cho regression ở cấp system/acceptance. Các quy tắc giữ cho test Selenium dễ bảo trì:</p>
<ul>
<li><b>Locator ổn định</b>: ưu tiên <code>By.id</code> hoặc thuộc tính riêng <code>data-testid</code> thay cho XPath dài, thứ gãy mỗi khi bố cục đổi.</li>
<li><b>Explicit wait</b> (<code>WebDriverWait</code> + <code>ExpectedConditions</code>) thay cho <code>Thread.sleep</code>: chờ một điều kiện, không chờ một số giây đoán mò.</li>
<li><b>Page Object pattern</b>: mỗi trang một lớp giữ locator và thao tác của nó, nên UI đổi thì sửa ở một chỗ — cùng ý tưởng với thư viện keyword ở bài 8.3.</li>
<li><b>Test độc lập</b>: mỗi test tự chuẩn bị dữ liệu và tự đóng trình duyệt (<code>driver.quit()</code>).</li>
</ul>
${SEL}`),
    bi(`<h3>Ví dụ có lời giải · Worked example — place the tests, then count the cost</h3>
<p><b>Part 1 — where does each test live?</b> For the shop's discount rule ("orders ≥ 200 get 5&nbsp;% off"):</p>
<ul>
<li>"discount(200) == 190", "discount(199.99) == 199.99" and every other boundary → <b>unit (JUnit)</b>, dozens of them, milliseconds each.</li>
<li>"the checkout service applies the discount and sends the right amount to the payment service" → <b>integration</b>, a handful, with the payment service stubbed.</li>
<li>"a shopper adds items, sees the discount at checkout and pays" → <b>one Selenium end-to-end test</b> for the happy path.</li>
</ul>
<p><b>Part 2 — what does the shape cost?</b> Assume a unit test takes 0.01&nbsp;s, an integration test 0.5&nbsp;s and a UI test 30&nbsp;s, and that each UI test is flaky (fails for no code reason) 0.5&nbsp;% of the time.</p>
<div class="table-wrap"><table>
<thead><tr><th>Suite</th><th>Unit</th><th>Integration</th><th>UI</th><th>Run time</th><th>P(no flaky UI failure)</th></tr></thead>
<tbody>
<tr><td>Pyramid</td><td>1,500 × 0.01 s = 15 s</td><td>150 × 0.5 s = 75 s</td><td>15 × 30 s = 450 s</td><td><b>540 s = 9 min</b></td><td>0.995<sup>15</sup> = <b>0.9276</b></td></tr>
<tr><td>Ice-cream cone</td><td>100 × 0.01 s = 1 s</td><td>100 × 0.5 s = 50 s</td><td>400 × 30 s = 12,000 s</td><td><b>12,051 s ≈ 3 h 21 min</b></td><td>0.995<sup>400</sup> = <b>0.1347</b></td></tr>
</tbody>
</table></div>
<p>(Numbers recomputed with a Node script: <code>healthy s 540 · cone s 12051 · P 0.9276 / 0.1347</code>.) The pyramid gives feedback on every push in 9 minutes and a false alarm about 1 run in 14; the cone runs once a night at best and is red for no reason in 87&nbsp;% of runs — so people stop looking at it. That is lesson 8.3's risk "over-reliance on the tool" and "underestimated maintenance" made concrete.</p>
<div class="pitfall"><b>Common mistakes.</b> (1) Testing business logic through the UI because "that is what the user sees" — test it at unit level and keep UI tests for journeys. (2) <code>Thread.sleep(5000)</code> in UI tests: too short on a slow CI machine (flaky), too long everywhere else (slow). (3) Treating a red build as "someone else's problem" or re-running until it is green — every red build is either a defect or a flaky test, and both need fixing. (4) Believing CI means continuous <em>deployment</em>: CI builds and tests every change; delivery/deployment are further steps.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The pyramid is being reshaped: the "testing trophy" and contract testing.</b> For modern web front ends Kent C. Dodds argues for a <b>testing trophy</b> with a thick <em>integration</em> layer, because component-level integration tests give the best confidence per cost once UI frameworks make them cheap. In microservices, teams replace slow cross-service end-to-end tests with <b>consumer-driven contract tests</b> (Pact): each consumer–provider pair verifies a shared contract, catching interface breaks without starting the whole system. The pyramid is a heuristic, not a law — adapt the shape to your architecture, but keep the principle "push each check down to the cheapest level that can catch the defect". <em>Outside the syllabus because CTFL does not prescribe a test-portfolio shape.</em></div>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fsoftware-testing%2Flearn&reflabel=SWT301" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Write &amp; run real JUnit tests</span><span class="lc-sub">Practise @Test, assertions and @ParameterizedTest — on CodeLab.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>`,
      `<h3>Ví dụ có lời giải · Đặt test đúng tầng, rồi tính chi phí</h3>
<p><b>Phần 1 — mỗi test nằm ở đâu?</b> Với luật giảm giá của shop ("đơn ≥ 200 được giảm 5&nbsp;%"):</p>
<ul>
<li>"discount(200) == 190", "discount(199.99) == 199.99" và mọi biên khác → <b>unit (JUnit)</b>, hàng chục cái, mỗi cái vài mili giây.</li>
<li>"service checkout áp giảm giá và gửi đúng số tiền sang service thanh toán" → <b>integration</b>, một nhúm, service thanh toán được thay bằng stub.</li>
<li>"người mua thêm hàng, thấy giảm giá ở checkout và thanh toán" → <b>một test Selenium đầu-cuối</b> cho happy path.</li>
</ul>
<p><b>Phần 2 — hình dạng bộ test tốn bao nhiêu?</b> Giả sử một unit test mất 0,01&nbsp;s, integration test 0,5&nbsp;s, UI test 30&nbsp;s, và mỗi UI test "flaky" (fail không vì code) 0,5&nbsp;% số lần.</p>
<div class="table-wrap"><table>
<thead><tr><th>Bộ test</th><th>Unit</th><th>Integration</th><th>UI</th><th>Thời gian chạy</th><th>P(không có UI fail oan)</th></tr></thead>
<tbody>
<tr><td>Kim tự tháp</td><td>1.500 × 0,01 s = 15 s</td><td>150 × 0,5 s = 75 s</td><td>15 × 30 s = 450 s</td><td><b>540 s = 9 phút</b></td><td>0,995<sup>15</sup> = <b>0,9276</b></td></tr>
<tr><td>Ốc quế kem</td><td>100 × 0,01 s = 1 s</td><td>100 × 0,5 s = 50 s</td><td>400 × 30 s = 12.000 s</td><td><b>12.051 s ≈ 3 giờ 21 phút</b></td><td>0,995<sup>400</sup> = <b>0,1347</b></td></tr>
</tbody>
</table></div>
<p>(Số liệu đã tính lại bằng script Node: <code>healthy s 540 · cone s 12051 · P 0.9276 / 0.1347</code>.) Kim tự tháp cho phản hồi mỗi lần push sau 9 phút và báo động giả khoảng 1 lần trong 14 lần chạy; ốc quế kem cùng lắm chạy mỗi đêm một lần và đỏ vô cớ ở 87&nbsp;% số lần chạy — nên mọi người thôi nhìn nó. Đó là rủi ro "quá phụ thuộc vào công cụ" và "đánh giá thấp chi phí bảo trì" của bài 8.3, viết thành con số.</p>
<div class="pitfall"><b>Lỗi thường gặp.</b> (1) Test logic nghiệp vụ qua UI vì "người dùng nhìn thấy cái đó" — hãy test ở mức unit và để UI test cho các hành trình. (2) <code>Thread.sleep(5000)</code> trong UI test: quá ngắn trên máy CI chậm (flaky), quá dài ở mọi nơi khác (chậm). (3) Coi build đỏ là "việc của người khác" hoặc chạy lại tới khi xanh — build đỏ nào cũng là một defect hoặc một test flaky, và cả hai đều phải sửa. (4) Tưởng CI là continuous <em>deployment</em>: CI build và test mọi thay đổi; delivery/deployment là các bước xa hơn.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Kim tự tháp đang được định hình lại: "testing trophy" và contract testing.</b> Với front end web hiện đại, Kent C. Dodds ủng hộ <b>testing trophy</b> có tầng <em>integration</em> dày, vì integration test ở mức component cho niềm tin trên mỗi đồng chi phí tốt nhất khi framework UI khiến chúng rẻ. Trong microservices, các đội thay test đầu-cuối chậm xuyên nhiều service bằng <b>consumer-driven contract test</b> (Pact): mỗi cặp bên gọi–bên cung cấp kiểm một hợp đồng chung, bắt lỗi giao diện mà không phải dựng cả hệ thống. Kim tự tháp là heuristic, không phải luật — chỉnh hình theo kiến trúc của bạn, nhưng giữ nguyên tắc "đẩy mỗi phép kiểm xuống cấp rẻ nhất mà vẫn bắt được defect". <em>Ngoài giáo trình vì CTFL không quy định hình dạng danh mục test.</em></div>
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

/* ──────────────────────────────── Quiz 8 ──────────────────────────────── */
// SWT6 has no "Question" slides: 40 questions on the non-question slides and the hands-on lessons.
const q = (question, options, correctIndex) => ({ question, options, correctIndex, points: 1 });
const QUIZ8 = {
  title: 'Quiz 8 — Tools & automation (SWT6 + JUnit hands-on)|||Quiz 8 — Công cụ & tự động hoá (SWT6 + thực hành JUnit)',
  slug: 'swt301-quiz-8',
  type: 'QUIZ',
  description: '40 câu: phân loại công cụ, (D), probe effect, lợi ích/rủi ro, capture/replay vs data-driven vs keyword-driven vs MBT, công cụ quản lý test, chọn công cụ, pilot, yếu tố thành công, JUnit 4/5, build.xml, pyramid, CI, Selenium. SWT6 không có slide Question.',
  quiz: {
    timeLimitSeconds: 2400,
    questions: [
      q('Which of the following is NOT a purpose of using test tools? (SWT6 s.6)|||Đâu KHÔNG phải mục đích dùng công cụ test? (SWT6 s.6)', ['Automating repetitive tasks|||Tự động hoá việc lặp lại', 'Supporting manual test activities|||Hỗ trợ các hoạt động test thủ công', 'More consistent testing and better defect reproducibility|||Test nhất quán hơn, tái hiện lỗi tốt hơn', 'Removing the need for test design|||Không cần thiết kế test nữa'], 3),
      q('The ISTQB syllabus classifies test tools mainly by… (s.7)|||Syllabus ISTQB phân loại công cụ test chủ yếu theo… (s.7)', ['price|||giá', 'licensing model|||mô hình bản quyền', 'the test activities they support|||hoạt động kiểm thử mà chúng hỗ trợ', 'the vendor|||nhà cung cấp'], 2),
      q('What is the probe effect? (s.8)|||Probe effect là gì? (s.8)', ['A tool that probes open ports|||Công cụ dò cổng mở', 'The change in the SUT\'s behaviour caused by using an intrusive tool|||Sự thay đổi hành vi của SUT do dùng công cụ xâm lấn', 'A defect found by exploratory testing|||Defect tìm bằng exploratory testing', 'The effect of test pressure on developers|||Tác động của áp lực test lên developer'], 1),
      q('Which tool is MOST likely to be intrusive? (s.8)|||Công cụ nào DỄ là công cụ xâm lấn nhất? (s.8)', ['Requirements management tool|||Công cụ quản lý yêu cầu', 'Code coverage tool|||Công cụ đo code coverage', 'Defect management tool|||Công cụ quản lý defect', 'Review tool|||Công cụ review'], 1),
      q('A bug that disappears when you run the program in a debugger is called…|||Lỗi biến mất khi chạy chương trình trong debugger gọi là…', ['a Heisenbug|||Heisenbug', 'a regression|||regression', 'a false positive|||false positive', 'a pesticide paradox|||pesticide paradox'], 0),
      q('On the SWT6 slides, "(D)" after a tool type means…|||Trên slide SWT6, "(D)" sau loại công cụ nghĩa là…', ['dynamic tool|||công cụ động', 'more likely to be used by developers|||thường do developer dùng', 'deprecated|||đã lỗi thời', 'defect-related|||liên quan defect'], 1),
      q('Which tool type supports traceability between requirements and tests? (s.10)|||Loại công cụ nào hỗ trợ truy vết giữa yêu cầu và test? (s.10)', ['Requirements management tools|||Công cụ quản lý yêu cầu', 'Dynamic analysis tools|||Công cụ phân tích động', 'Test data preparation tools|||Công cụ chuẩn bị dữ liệu test', 'Monitoring tools|||Công cụ giám sát'], 0),
      q('Which pair of tools is marked (D) in the syllabus?|||Cặp công cụ nào được đánh dấu (D) trong syllabus?', ['Monitoring and usability tools|||Giám sát và usability', 'Continuous integration and static analysis tools|||Tích hợp liên tục và phân tích tĩnh', 'Requirements and defect management tools|||Quản lý yêu cầu và quản lý defect', 'Localisation and accessibility tools|||Bản địa hoá và accessibility'], 1),
      q('Which tool gives an objective measure of which parts of the software structure were executed by the tests? (s.22)|||Công cụ nào cho số đo khách quan về phần cấu trúc phần mềm đã được test chạy qua? (s.22)', ['Test execution tool|||Công cụ thực thi test', 'Coverage tool|||Công cụ coverage', 'Static analysis tool|||Công cụ phân tích tĩnh', 'Test management tool|||Công cụ quản lý test'], 1),
      q('A test environment that provides drivers and stubs so a component can be tested in isolation is a… (s.23)|||Môi trường test cung cấp driver và stub để test một component tách biệt là… (s.23)', ['test harness|||test harness', 'test oracle|||test oracle', 'monitoring tool|||công cụ giám sát', 'model-based testing tool|||công cụ MBT'], 0),
      q('A tool that detects memory leaks while the program is running is a…  (s.27)|||Công cụ phát hiện rò rỉ bộ nhớ khi chương trình đang chạy là… (s.27)', ['static analysis tool|||công cụ phân tích tĩnh', 'dynamic analysis tool|||công cụ phân tích động', 'performance testing tool|||công cụ test hiệu năng', 'review tool|||công cụ review'], 1),
      q('Which tool continuously tracks the status of a system in use and gives the earliest warnings? (s.26)|||Công cụ nào liên tục theo dõi tình trạng hệ thống đang dùng và cảnh báo sớm nhất? (s.26)', ['Performance testing tool|||Công cụ test hiệu năng', 'Monitoring tool|||Công cụ giám sát', 'Coverage tool|||Công cụ coverage', 'Configuration management tool|||Công cụ quản lý cấu hình'], 1),
      q('Masking customer names in copied production data for testing is done with a…  (s.18)|||Che tên khách hàng trong dữ liệu production chép sang để test là việc của… (s.18)', ['test data preparation tool|||công cụ chuẩn bị dữ liệu test', 'defect management tool|||công cụ quản lý defect', 'test harness|||test harness', 'review tool|||công cụ review'], 0),
      q('Generating test inputs and expected outputs from a state transition diagram is typical of… (s.17, s.46)|||Sinh input và output mong đợi từ sơ đồ chuyển trạng thái là đặc trưng của… (s.17, s.46)', ['capture/replay tools|||công cụ capture/replay', 'model-based testing tools|||công cụ model-based testing', 'monitoring tools|||công cụ giám sát', 'static analysis tools|||công cụ phân tích tĩnh'], 1),
      q('Which statement about localisation testing is TRUE? (s.32)|||Câu nào về test bản địa hoá là ĐÚNG? (s.32)', ['It can be fully automated|||Có thể tự động hoá hoàn toàn', 'It only checks the currency symbol|||Chỉ kiểm ký hiệu tiền tệ', 'It is an area where human intelligence is needed|||Là vùng cần trí tuệ con người', 'It is the same as portability testing|||Giống test portability'], 2),
      q('Which is a potential BENEFIT of using test tools? (s.38)|||Đâu là một LỢI ÍCH tiềm năng của việc dùng công cụ test? (s.38)', ['Objective assessment, e.g. coverage measures|||Đánh giá khách quan, vd số đo coverage', 'No maintenance of test scripts is needed|||Không cần bảo trì script test', 'The tool replaces test design|||Công cụ thay thế thiết kế test', 'A guaranteed return on investment|||Chắc chắn có lời'], 0),
      q('Which is a RISK of using test tools? (s.39)|||Đâu là một RỦI RO khi dùng công cụ test? (s.39)', ['Greater consistency and repeatability|||Nhất quán và lặp lại được hơn', 'Underestimating the effort to maintain the test assets generated by the tool|||Đánh giá thấp công sức bảo trì tài sản test do công cụ tạo ra', 'Easier access to information about testing|||Dễ truy cập thông tin về kiểm thử', 'Reduction of repetitive work|||Giảm việc lặp lại'], 1),
      q('Which of these is NOT a risk of using tools? (s.39–40)|||Điều nào KHÔNG phải rủi ro khi dùng công cụ? (s.39–40)', ['The vendor goes out of business|||Nhà cung cấp phá sản', 'Unrealistic expectations for the tool|||Kỳ vọng phi thực tế vào công cụ', 'Over-reliance on the tool|||Quá phụ thuộc vào công cụ', 'Reduction of repetitive manual work|||Giảm việc thủ công lặp lại'], 3),
      q('Which statement about capture/replay is TRUE? (s.43)|||Câu nào về capture/replay là ĐÚNG? (s.43)', ['Recordings store complete test cases including expected results|||Bản ghi lưu đủ test case kể cả kết quả mong đợi', 'It scales well to thousands of scripts|||Mở rộng tốt tới hàng nghìn script', 'Recorded scripts may be unstable when unexpected events occur|||Script ghi lại có thể không ổn định khi có sự kiện bất ngờ', 'It is the recommended approach for large regression suites|||Là cách được khuyến nghị cho bộ regression lớn'], 2),
      q('When can capturing test inputs be useful? (s.43)|||Khi nào ghi lại input của test là có ích? (s.43)', ['As an audit trail during exploratory or unscripted testing|||Làm vết kiểm tra khi exploratory hoặc test không kịch bản', 'To build a 5,000-test regression suite|||Để xây bộ regression 5.000 test', 'To generate expected results automatically|||Để tự sinh kết quả mong đợi', 'To replace test management tools|||Để thay công cụ quản lý test'], 0),
      q('In data-driven testing… (s.44)|||Trong data-driven testing… (s.44)', ['each test has its own hand-written script|||mỗi test có script viết tay riêng', 'inputs and expected results are stored separately (e.g. a spreadsheet) and read by a generic script|||input và kết quả mong đợi được lưu riêng (vd bảng tính) và một script chung đọc chúng', 'the tool generates tests from a model|||công cụ sinh test từ mô hình', 'the tester records mouse clicks|||tester ghi lại thao tác chuột'], 1),
      q('The main advantage of keyword-driven over data-driven testing is that testers can…  (s.45)|||Ưu điểm chính của keyword-driven so với data-driven là tester có thể… (s.45)', ['avoid writing expected results|||khỏi viết kết quả mong đợi', 'define new tests (sequences of action words), not only new data for one script|||định nghĩa test mới (chuỗi action word), không chỉ dữ liệu mới cho một script', 'run tests without any automation code at all|||chạy test mà hoàn toàn không cần code automation', 'skip test management|||bỏ qua quản lý test'], 1),
      q('In model-based testing, who typically creates the model and what does the tool produce? (s.46)|||Trong MBT, ai thường tạo mô hình và công cụ tạo ra gì? (s.46)', ['The end user; a defect report|||Người dùng cuối; một defect report', 'A system designer; test case specifications that can be stored or executed|||Người thiết kế hệ thống; đặc tả test case có thể lưu hoặc thực thi', 'The test manager; a test plan|||Test manager; một test plan', 'The developer; source code|||Developer; mã nguồn'], 1),
      q('Test management tools need to interface with configuration management tools in order to… (s.47)|||Công cụ quản lý test cần kết nối công cụ quản lý cấu hình để… (s.47)', ['generate load|||sinh tải', 'link results with test object version information|||liên kết kết quả với thông tin phiên bản đối tượng test', 'check coding standards|||kiểm chuẩn code', 'anonymise data|||ẩn danh dữ liệu'], 1),
      q('The recommended approach for adopting a test management tool is… (s.47)|||Cách tiếp cận khuyến nghị khi áp dụng công cụ quản lý test là… (s.47)', ['buy the tool, then build the process around it|||mua công cụ rồi xây quy trình quanh nó', 'define the test process → consider the tool(s) → adapt the tool(s) for the highest benefit|||xác định quy trình test → xem xét công cụ → điều chỉnh công cụ cho lợi nhất', 'let each tester choose a tool|||để mỗi tester tự chọn công cụ', 'use the vendor\'s default configuration|||dùng cấu hình mặc định của hãng'], 1),
      q('Which is a principle for SELECTING a tool? (s.50–51)|||Đâu là nguyên tắc khi CHỌN công cụ? (s.50–51)', ['Roll out incrementally|||Triển khai từng bước', 'Evaluate the vendor (training, support, commercial aspects)|||Đánh giá nhà cung cấp (đào tạo, hỗ trợ, thương mại)', 'Gather lessons learned from all users|||Thu thập bài học từ mọi người dùng', 'Monitor tool use and benefits|||Giám sát việc dùng và lợi ích'], 1),
      q('According to slide 51, what should be done FINALLY in tool selection?|||Theo slide 51, bước CUỐI khi chọn công cụ là gì?', ['A proof-of-concept evaluation|||Đánh giá proof-of-concept', 'An organisation-wide roll-out|||Triển khai toàn tổ chức', 'Signing a 5-year licence|||Ký bản quyền 5 năm', 'Writing the test policy|||Viết chính sách test'], 0),
      q('Which is an objective of a PILOT project? (s.53)|||Đâu là mục tiêu của dự án PILOT? (s.53)', ['Rolling the tool out to the whole organisation|||Triển khai công cụ cho cả tổ chức', 'Assessing whether the benefits will be achieved at reasonable cost|||Đánh giá lợi ích có đạt được với chi phí hợp lý không', 'Negotiating the licence price|||Đàm phán giá bản quyền', 'Replacing all manual testing|||Thay thế mọi test thủ công'], 1),
      q('Deciding naming conventions for test scripts and how test assets are stored belongs to…|||Quyết định quy ước đặt tên script test và cách lưu tài sản test thuộc về…', ['tool selection|||việc chọn công cụ', 'the pilot project (standard ways of using the tool)|||dự án pilot (cách dùng công cụ chuẩn)', 'maintenance testing|||maintenance testing', 'defect management|||quản lý defect'], 1),
      q('Which is a SUCCESS FACTOR for deploying a tool? (s.54)|||Đâu là YẾU TỐ THÀNH CÔNG khi triển khai công cụ? (s.54)', ['Big-bang roll-out to every team at once|||Triển khai "big bang" cho mọi đội cùng lúc', 'Rolling out incrementally with training, coaching and mentoring|||Triển khai từng bước kèm đào tạo, kèm cặp và cố vấn', 'No usage guidelines, to keep flexibility|||Không có hướng dẫn để giữ linh hoạt', 'Stopping support after the pilot|||Dừng hỗ trợ sau pilot'], 1),
      q('Which JUnit 5 annotation replaces JUnit 4\'s @Before?|||Annotation JUnit 5 nào thay cho @Before của JUnit 4?', ['@BeforeAll', '@BeforeEach', '@Setup', '@Init'], 1),
      q('Which JUnit 5 annotation replaces JUnit 4\'s @Ignore?|||Annotation JUnit 5 nào thay cho @Ignore của JUnit 4?', ['@Skip', '@Disabled', '@Ignore', '@Tag'], 1),
      q('In JUnit 5, how do you check that divide(1, 0) throws ArithmeticException?|||Trong JUnit 5, kiểm tra divide(1, 0) ném ArithmeticException thế nào?', ['@Test(expected = ArithmeticException.class)', 'assertThrows(ArithmeticException.class, () -> calc.divide(1, 0))', 'assertEquals(ArithmeticException, calc.divide(1, 0))', 'try { } finally { }'], 1),
      q('Which JUnit annotation runs the same test over many inputs?|||Annotation JUnit nào chạy cùng một test trên nhiều input?', ['@BeforeEach', '@Test', '@ParameterizedTest', '@AfterEach'], 2),
      q('In the course build.xml, what runs when you type "ant" with no target?|||Trong build.xml của môn, gõ "ant" không kèm target thì chạy gì?', ['test-with-jacoco', 'clean, then compile (the default target)|||clean rồi compile (target mặc định)', 'jacoco-report', 'Nothing|||Không gì cả'], 1),
      q('build.xml runs tests with haltonfailure="true". One test fails. What happens?|||build.xml chạy test với haltonfailure="true". Một test fail. Chuyện gì xảy ra?', ['The failure is logged and the JaCoCo report is still written|||Failure được ghi log và báo cáo JaCoCo vẫn được ghi', 'BUILD FAILED; later targets such as jacoco-report do not run|||BUILD FAILED; các target sau như jacoco-report không chạy', 'Ant retries the test three times|||Ant chạy lại test ba lần', 'Only the failing test is skipped|||Chỉ test fail bị bỏ qua'], 1),
      q('JUnitCore prints "Tests run: 5, Failures: 1" for a class with 6 @Test methods, one of them @Ignore. Why 5?|||JUnitCore in "Tests run: 5, Failures: 1" cho lớp có 6 phương thức @Test, một cái @Ignore. Vì sao là 5?', ['One test crashed the JVM|||Một test làm sập JVM', 'Ignored tests are not counted as run|||Test bị @Ignore không được tính là đã chạy', 'The failing test is not counted|||Test fail không được tính', 'JUnit counts only public classes|||JUnit chỉ đếm lớp public'], 1),
      q('The test pyramid recommends…|||Test pyramid khuyến nghị…', ['mostly UI tests, few unit tests|||chủ yếu UI test, ít unit test', 'many unit tests, fewer integration tests, very few UI tests|||nhiều unit test, ít integration hơn, rất ít UI test', 'only manual tests|||chỉ test thủ công', 'equal numbers at every level|||số lượng bằng nhau mọi tầng'], 1),
      q('In CI, what does a RED build mean?|||Trong CI, build ĐỎ nghĩa là gì?', ['The code is ready to ship|||Code sẵn sàng giao', 'A step (e.g. a test) failed; the change should not be merged as it is|||Một bước (vd một test) fail; không nên merge thay đổi nguyên trạng', 'The CI server is switched off|||CI server bị tắt', 'Coverage is 100 %|||Coverage đạt 100 %'], 1),
      q('Selenium WebDriver is primarily a tool for… and which is BEST kept manual rather than automated?|||Selenium WebDriver chủ yếu là công cụ để… và việc nào NÊN giữ thủ công?', ['unit testing; boundary checks|||unit test; kiểm biên', 'driving a real browser for UI/end-to-end tests; usability and exploratory testing|||điều khiển trình duyệt thật cho test UI/đầu-cuối; usability và exploratory testing', 'load testing; smoke tests|||load test; smoke test', 'static analysis; regression checks|||phân tích tĩnh; kiểm regression'], 1),
    ],
  },
};

export default {
  title: 'Chapter 8 — Test tools & automation|||Chương 8 — Công cụ & tự động hoá',
  description: 'SWT6 (54 slide) học từng slide: mục đích & phân loại công cụ, probe effect, 6 nhóm công cụ theo hoạt động, lợi ích/rủi ro, capture/replay – data-driven – keyword-driven – MBT, chọn công cụ, pilot, yếu tố thành công — cộng thực hành JUnit 4 (bộ mẫu build.xml) → JUnit 5/Maven/JaCoCo, test pyramid, CI và Selenium.',
  lessons: [L81, L82, L83, L84, L85, L86, QUIZ8],
};
