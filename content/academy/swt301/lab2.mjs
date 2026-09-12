/**
 * SWT301 · Lab 2 — Component (unit) testing: white-box & black-box.
 * Sources (02.Lab/02.LAB02):
 *   01.Guide/単体テスト実施ガイド(A_Guide_for_Unit_Testing).pptx  → deck lab2-utguide (88 slides, Hitachi 2013, JP + EN pages)
 *   01.Guide/How to write PCL.pptx                                → deck lab2-pcl (32 slides, Hitachi Consulting 2017)
 *   02.Whitebox/Lab2_component(Structural)testing.pptx + CheckList_UT_Whitebox.xlsx → deck lab2-structural (13)
 *   03.Blackbox/Lab2_component(Functional)testing.pptx + CheckList_UT_Blackbox_{Testcase,UI}.xls → deck lab2-functional (14)
 *   01.Guide/UnitTestPoints_EN.XLSX, Template/Template_Unit Test Case.xlsx, Template/Sample_Test Cases.xlsx,
 *   Template/Samples/*Unit_Test.xlsx, 01.Guide/Detail Design/doc (Javadoc of package jp.co.jtnis.jnap1.svrint)
 * Lessons:
 *   L2.1 Overview & grading (no slides)          L2.2 guide slides 1–35     L2.3 guide slides 36–67
 *   L2.4 guide slides 68–88                        L2.5 PCL deck 1–32         L2.6 structural deck 1–13 + white-box checklist
 *   L2.7 functional deck 1–14 + black-box checklists + the Detail Design     L2.8 Unit Test Case template + two worked sheets
 *   L2.9 UnitTestPoints_EN                         Quiz
 * NOTE: the guide's images are served from R2 prefix v2 (re-rendered with Japanese fonts; the v1 render had lost
 * every Japanese character). Every Japanese slide also quotes and translates its Japanese text.
 * Every Java listing that claims an output was compiled and run (JDK 21, JUnit 5.12.2, JaCoCo 0.8.13).
 */
import { walk, walkHead, books, bi } from './_slides.mjs';

const G = 'lab2-utguide';
const P = 'lab2-pcl';
const WB = 'lab2-structural';
const BB = 'lab2-functional';

/* Japanese page of the guide: note + the English twin's slide number (placed right after the 🎯 line). */
const JE = (n) => `<p class="ghi-chu">🇯🇵 Japanese page — its English twin is slide ${n}. The Japanese text of the picture is quoted and translated here.</p>`;
const JV = (n) => `<p class="ghi-chu">🇯🇵 Trang tiếng Nhật — bản tiếng Anh tương ứng là slide ${n}. Chữ Nhật trong hình được chép lại và dịch ngay dưới đây.</p>`;

/* ─────────────────────────── L2.1 Overview ─────────────────────────── */
const L21 = {
  title: 'L2.1 — Lab 2 at a glance: what you hand in and how it is graded|||L2.1 — Tổng quan Lab 2: nộp gì và chấm điểm thế nào',
  slug: 'swt301-lab2-overview',
  type: 'DOCUMENT',
  description: 'Lab 2 gồm 2 biến thể: white-box (C0/C1 100% trên code SWP391 của bạn) và black-box (test từ Detail Design). Bản đồ thư mục LAB02, quy trình PCL của Hitachi, thang điểm theo LOC / số trang DD, bảng thuật ngữ Nhật–Anh–Việt.',
  content: [
    bi(`<span class="eyebrow">Lab 2 · Lesson L2.1 · overview of 02.LAB02</span>
<h2>Lab 2 at a glance</h2>
<p class="lead">Lab 2 is the first lab in which you <em>design and execute</em> tests yourself. You test one small piece of software — a <strong>unit</strong> (a method or a function) — and you document the tests in the <strong>Unit Test Case</strong> spreadsheet that FPT Software inherited from its Japanese customers (Hitachi calls the same document a <strong>PCL</strong>).</p>
<p>The lab comes in two flavours:</p>
<ul>
<li><strong>White-box</strong> (structural) — you test your own source code until every statement and every decision has been executed.</li>
<li><strong>Black-box</strong> (functional) — you test from a <strong>Detail Design</strong> without looking at code.</li>
</ul>
<div class="callout"><p><strong>Learning objectives</strong></p>
<ul>
<li>Explain what component (unit) testing is and who does it (LO-2.2.1, K2)</li>
<li>Apply equivalence partitioning and boundary value analysis to unit inputs (LO-4.2.1/4.2.2, K3)</li>
<li>Explain and measure statement coverage (C0) and decision coverage (C1) (LO-4.3.1/4.3.2, K2)</li>
<li>Fill the Unit Test Case matrix (conditions × UTCID columns, Confirm rows, N/A/B type)</li>
<li>Write a JUnit script and show a coverage report as evidence</li>
</ul></div>
<h3>The two variants side by side</h3>
<div class="table-wrap"><table>
<thead><tr><th></th><th>White-box — <em>Component (structural) testing</em></th><th>Black-box — <em>Component (functional) testing</em></th></tr></thead>
<tbody>
<tr><td>Work</td><td>Individual</td><td>Individual</td></tr>
<tr><td>Tool</td><td>One unit-test tool from the deck (NUnit, JUnit, TestNG) — for a Java SWP391 project that means JUnit</td><td>Same</td></tr>
<tr><td>Test basis</td><td>Source code you prepare yourself, taken from your SWP391 project</td><td>One “screen” (action class) of the Detail Design in <code>LAB02\\01.Guide\\Detail Design\\doc\\jp\\co\\jtnis\\jnap1\\svrint\\action</code></td></tr>
<tr><td>Deliverables</td><td>Unit Test Case sheet (+ the white-box checklist) and/or a JUnit test script; a test report</td><td>Unit Test Case sheet / test script + the black-box checklists</td></tr>
<tr><td>Hard requirement</td><td>Coverage <strong>C0 = 100 %</strong> and <strong>C1 = 100 %</strong></td><td>Case mix <strong>Normal &lt; 20 % : Abnormal &gt; 60 % : Boundary &gt; 20 %</strong></td></tr>
<tr><td>Score</td><td>By size of the code under test (LOC) + 0–2 for difficulty</td><td>By size of the design you tested (pages of DD) + 0–2 for complexity</td></tr>
</tbody></table></div>
<h3>Grading scales (structural slide 10, functional slide 11)</h3>
<div class="table-wrap"><table>
<thead><tr><th>White-box: LOC tested</th><th>Points</th><th>Black-box: DD size</th><th>Points</th></tr></thead>
<tbody>
<tr><td>nothing submitted</td><td>1</td><td>nothing submitted</td><td>1</td></tr>
<tr><td>&lt; 100 LOC</td><td>1–4</td><td>&lt; 2 pages</td><td>1–4</td></tr>
<tr><td>101–200 LOC</td><td>5</td><td>2–3 pages</td><td>5–6</td></tr>
<tr><td>201–250 LOC</td><td>6</td><td>&gt; 3 pages</td><td>7–8</td></tr>
<tr><td>251–300 LOC</td><td>7</td><td colspan="2" rowspan="2">+ 0–2 for DD complexity (many loops, nesting)</td></tr>
<tr><td>&gt; 300 LOC</td><td>8</td></tr>
<tr><td colspan="2">+ 0–2 for source-code difficulty</td><td colspan="2"></td></tr>
</tbody></table></div>
<h3>The process you are imitating (guide slide 21)</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Create the PCL</div><div class="lz-d">test cases from the design, before coding; reviewed</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Prepare</div><div class="lz-d">environment, test data, drivers, tools</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Code</div><div class="lz-d">from design + PCL, coding standard</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Static testing</div><div class="lz-d">desk check, static analysis, code review</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Dynamic testing</div><div class="lz-d">run every case, record bugs, C0/C1 = 100 %</div></div>
  <div class="lz-step"><div class="lz-k">6</div><div class="lz-t">Evaluation</div><div class="lz-d">report, leader approves</div></div>
</div>`,
    `<span class="eyebrow">Lab 2 · Bài L2.1 · tổng quan thư mục 02.LAB02</span>
<h2>Tổng quan Lab 2</h2>
<p class="lead">Lab 2 là bài đầu tiên bạn tự <em>thiết kế và chạy</em> test. Bạn kiểm thử một mẩu phần mềm nhỏ — một <strong>unit</strong> (một method/hàm) — và ghi test vào bảng tính <strong>Unit Test Case</strong> mà FPT Software kế thừa từ khách hàng Nhật (Hitachi gọi đúng tài liệu này là <strong>PCL</strong>).</p>
<p>Lab có hai biến thể:</p>
<ul>
<li><strong>White-box</strong> (cấu trúc) — test chính source code của bạn cho tới khi mọi câu lệnh và mọi quyết định (decision) đều đã được chạy.</li>
<li><strong>Black-box</strong> (chức năng) — test dựa trên <strong>Detail Design</strong> mà không nhìn code.</li>
</ul>
<div class="callout"><p><strong>Chuẩn đầu ra</strong></p>
<ul>
<li>Giải thích component (unit) testing là gì, ai làm (LO-2.2.1, K2)</li>
<li>Áp dụng phân vùng tương đương và phân tích giá trị biên cho đầu vào của unit (LO-4.2.1/4.2.2, K3)</li>
<li>Giải thích và đo statement coverage (C0) và decision coverage (C1) (LO-4.3.1/4.3.2, K2)</li>
<li>Điền được ma trận Unit Test Case (điều kiện × cột UTCID, các dòng Confirm, loại N/A/B)</li>
<li>Viết JUnit script và nộp báo cáo coverage làm bằng chứng</li>
</ul></div>
<h3>Hai biến thể đặt cạnh nhau</h3>
<div class="table-wrap"><table>
<thead><tr><th></th><th>White-box — <em>Component (structural) testing</em></th><th>Black-box — <em>Component (functional) testing</em></th></tr></thead>
<tbody>
<tr><td>Hình thức</td><td>Làm cá nhân</td><td>Làm cá nhân</td></tr>
<tr><td>Công cụ</td><td>Chọn một công cụ unit test trong slide (NUnit, JUnit, TestNG) — dự án SWP391 bằng Java thì dùng JUnit</td><td>Như trên</td></tr>
<tr><td>Test basis</td><td>Source code tự chuẩn bị, lấy từ dự án SWP391 của bạn</td><td>Một “màn hình” (lớp action) trong Detail Design ở <code>LAB02\\01.Guide\\Detail Design\\doc\\jp\\co\\jtnis\\jnap1\\svrint\\action</code></td></tr>
<tr><td>Sản phẩm nộp</td><td>Sheet Unit Test Case (+ checklist white-box) và/hoặc JUnit test script; báo cáo test</td><td>Sheet Unit Test Case / test script + các checklist black-box</td></tr>
<tr><td>Yêu cầu cứng</td><td>Coverage <strong>C0 = 100 %</strong> và <strong>C1 = 100 %</strong></td><td>Tỉ lệ ca <strong>Normal &lt; 20 % : Abnormal &gt; 60 % : Boundary &gt; 20 %</strong></td></tr>
<tr><td>Điểm</td><td>Theo kích thước code được test (LOC) + 0–2 điểm độ khó</td><td>Theo kích thước thiết kế đã test (số trang DD) + 0–2 điểm độ phức tạp</td></tr>
</tbody></table></div>
<h3>Thang điểm (slide 10 bản structural, slide 11 bản functional)</h3>
<div class="table-wrap"><table>
<thead><tr><th>White-box: số LOC được test</th><th>Điểm</th><th>Black-box: kích thước DD</th><th>Điểm</th></tr></thead>
<tbody>
<tr><td>không nộp</td><td>1</td><td>không nộp</td><td>1</td></tr>
<tr><td>&lt; 100 LOC</td><td>1–4</td><td>&lt; 2 trang</td><td>1–4</td></tr>
<tr><td>101–200 LOC</td><td>5</td><td>2–3 trang</td><td>5–6</td></tr>
<tr><td>201–250 LOC</td><td>6</td><td>&gt; 3 trang</td><td>7–8</td></tr>
<tr><td>251–300 LOC</td><td>7</td><td colspan="2" rowspan="2">+ 0–2 điểm cho độ phức tạp của DD (nhiều vòng lặp, lồng nhau)</td></tr>
<tr><td>&gt; 300 LOC</td><td>8</td></tr>
<tr><td colspan="2">+ 0–2 điểm cho độ khó của source code</td><td colspan="2"></td></tr>
</tbody></table></div>
<h3>Quy trình bạn đang mô phỏng (slide 21 của bộ hướng dẫn)</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Viết PCL</div><div class="lz-d">test case từ thiết kế, trước khi code; được review</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Chuẩn bị</div><div class="lz-d">môi trường, dữ liệu test, driver, công cụ</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Viết code</div><div class="lz-d">theo thiết kế + PCL, đúng coding standard</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Kiểm thử tĩnh</div><div class="lz-d">desk check, phân tích tĩnh, review code</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Kiểm thử động</div><div class="lz-d">chạy mọi ca, ghi bug, C0/C1 = 100 %</div></div>
  <div class="lz-step"><div class="lz-k">6</div><div class="lz-t">Đánh giá</div><div class="lz-d">báo cáo, leader phê duyệt</div></div>
</div>`),
    bi(`<h3>Map of the 02.LAB02 folder — every file and where it is taught</h3>
<div class="table-wrap"><table>
<thead><tr><th>File</th><th>What it is</th><th>Lesson</th></tr></thead>
<tbody>
<tr><td>01.Guide/単体テスト実施ガイド(A_Guide_for_Unit_Testing).pptx</td><td>Hitachi's 2013 “Guide for carrying out unit testing”: the programming process, how to build a PCL, testing concerns, coverage C0/C1/RC0. Japanese and English pages alternate.</td><td>L2.2–L2.4</td></tr>
<tr><td>01.Guide/How to write PCL.pptx</td><td>Hitachi Consulting (2017) slides: what a PCL is, how to fill it from a detail design, 12 writing rules, the PCL review flow, the UT flow with tools.</td><td>L2.5</td></tr>
<tr><td>02.Whitebox/Lab2_component(Structural)testing.pptx</td><td>The white-box lab brief and its grading scale.</td><td>L2.6</td></tr>
<tr><td>02.Whitebox/CheckList_UT_Whitebox.xlsx</td><td>22-item self-check for your test-case sheet, test data and test script + a sheet on boundary/limit values.</td><td>L2.6</td></tr>
<tr><td>03.Blackbox/Lab2_component(Functional)testing.pptx</td><td>The black-box lab brief, ratio N:A:B and grading scale.</td><td>L2.7</td></tr>
<tr><td>03.Blackbox/CheckList_UT_Blackbox_Testcase.xls, …_UI.xls</td><td>132-item and 73-item black-box review checklists (document control, branches, validation, calculation, output, DB, files).</td><td>L2.7</td></tr>
<tr><td>01.Guide/Detail Design/doc/</td><td>Javadoc of a real Japanese batch system (package <code>jp.co.jtnis.jnap1.svrint</code>) — the test basis of the black-box lab.</td><td>L2.7, L2.8</td></tr>
<tr><td>01.Guide/Template/Template_Unit Test Case.xlsx</td><td>The template you must use: Cover, FunctionList, Test Report and one matrix sheet per function.</td><td>L2.8</td></tr>
<tr><td>01.Guide/Template/Sample_Test Cases.xlsx</td><td>A system/integration test-case file in <em>list</em> format (project FMO) — a contrast to the unit matrix.</td><td>L2.8</td></tr>
<tr><td>01.Guide/Template/Samples/…Report5_Unit_Test.xlsx, …Integration_Test.xlsx</td><td>A real SEP490 capstone team's filled unit-test and integration-test reports.</td><td>L2.8</td></tr>
<tr><td>01.Guide/UnitTestPoints_EN.XLSX</td><td>“Unit test viewpoint collection”: 8 sheets of test ideas for screens, logic, limits, input checks, files, devices.</td><td>L2.9</td></tr>
</tbody></table></div>
<h3>Japanese words you will meet in these files</h3>
<div class="table-wrap"><table>
<thead><tr><th>Japanese</th><th>Reading</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td>単体テスト</td><td>tantai tesuto</td><td>unit test (= ISTQB component test)</td></tr>
<tr><td>組合せテスト</td><td>kumiawase tesuto</td><td>“combination test” = Hitachi's <em>Software Component Testing</em> ≈ ISTQB component integration testing (checklist: CCL)</td></tr>
<tr><td>連動テスト</td><td>rendō tesuto</td><td>“linked test” = Application Software Testing ≈ system testing (checklist: ACL)</td></tr>
<tr><td>詳細設計書</td><td>shōsai sekkeisho</td><td>Detailed Design document (DD / DS)</td></tr>
<tr><td>チェックリスト作成観点</td><td>chekkurisuto sakusei kanten</td><td>“viewpoints for building the checklist” = Testing Concerns</td></tr>
<tr><td>正常系 / 異常系 / 境界値</td><td>seijōkei / ijōkei / kyōkaichi</td><td>normal case / abnormal (error) case / boundary value — the N, A (E), B (L) letters; the PCL deck abbreviates them 正 / 異 / 境</td></tr>
<tr><td>命令網羅 / 分岐網羅 / 修正網羅</td><td>meirei mōra / bunki mōra / shūsei mōra</td><td>statement coverage C0 / branch (decision) coverage C1 / revised-statement coverage RC0</td></tr>
<tr><td>机上デバッグ</td><td>kijō debaggu</td><td>desk debugging = desk checking (reading code against the design)</td></tr>
<tr><td>静的解析 / 動的テスト</td><td>seiteki kaiseki / dōteki tesuto</td><td>static analysis / dynamic testing</td></tr>
<tr><td>バグ管理票</td><td>bagu kanrihyō</td><td>bug management sheet = Bug List (the PCL deck calls it “B-Voucher”)</td></tr>
<tr><td>有識者 / リーダー / プログラマ</td><td>yūshikisha / rīdā / puroguramā</td><td>expert (knows the spec) / leader / programmer</td></tr>
<tr><td>検収</td><td>kenshū</td><td>acceptance inspection by the customer</td></tr>
<tr><td>帳票</td><td>chōhyō</td><td>business form / printed report</td></tr>
<tr><td>社外秘</td><td>shagaihi</td><td>“confidential — not to leave the company”</td></tr>
</tbody></table></div>`,
    `<h3>Bản đồ thư mục 02.LAB02 — từng file và được dạy ở bài nào</h3>
<div class="table-wrap"><table>
<thead><tr><th>File</th><th>Là gì</th><th>Bài</th></tr></thead>
<tbody>
<tr><td>01.Guide/単体テスト実施ガイド(A_Guide_for_Unit_Testing).pptx</td><td>“Hướng dẫn thực hiện unit test” của Hitachi (2013): quy trình lập trình, cách dựng PCL, các quan điểm test, coverage C0/C1/RC0. Trang tiếng Nhật và tiếng Anh xen kẽ.</td><td>L2.2–L2.4</td></tr>
<tr><td>01.Guide/How to write PCL.pptx</td><td>Slide của Hitachi Consulting (2017): PCL là gì, điền PCL từ detail design ra sao, 12 quy tắc viết, luồng review PCL, luồng UT kèm công cụ.</td><td>L2.5</td></tr>
<tr><td>02.Whitebox/Lab2_component(Structural)testing.pptx</td><td>Đề bài lab white-box và thang điểm.</td><td>L2.6</td></tr>
<tr><td>02.Whitebox/CheckList_UT_Whitebox.xlsx</td><td>22 mục tự kiểm cho sheet test case, test data và test script + một sheet về giá trị biên/giới hạn.</td><td>L2.6</td></tr>
<tr><td>03.Blackbox/Lab2_component(Functional)testing.pptx</td><td>Đề bài lab black-box, tỉ lệ N:A:B và thang điểm.</td><td>L2.7</td></tr>
<tr><td>03.Blackbox/CheckList_UT_Blackbox_Testcase.xls, …_UI.xls</td><td>Checklist review black-box 132 mục và 73 mục (quản lý tài liệu, nhánh, validation, tính toán, output, DB, file).</td><td>L2.7</td></tr>
<tr><td>01.Guide/Detail Design/doc/</td><td>Javadoc của một hệ thống batch Nhật thật (package <code>jp.co.jtnis.jnap1.svrint</code>) — test basis của lab black-box.</td><td>L2.7, L2.8</td></tr>
<tr><td>01.Guide/Template/Template_Unit Test Case.xlsx</td><td>Template bắt buộc: Cover, FunctionList, Test Report và mỗi function một sheet ma trận.</td><td>L2.8</td></tr>
<tr><td>01.Guide/Template/Sample_Test Cases.xlsx</td><td>File test case system/integration dạng <em>danh sách</em> (dự án FMO) — để so với ma trận unit.</td><td>L2.8</td></tr>
<tr><td>01.Guide/Template/Samples/…Report5_Unit_Test.xlsx, …Integration_Test.xlsx</td><td>Báo cáo unit test và integration test đã điền của một nhóm đồ án SEP490 thật.</td><td>L2.8</td></tr>
<tr><td>01.Guide/UnitTestPoints_EN.XLSX</td><td>“Bộ sưu tập quan điểm unit test”: 8 sheet ý tưởng test cho màn hình, logic, giá trị giới hạn, kiểm tra input, file, thiết bị.</td><td>L2.9</td></tr>
</tbody></table></div>
<h3>Từ tiếng Nhật bạn sẽ gặp trong các file này</h3>
<div class="table-wrap"><table>
<thead><tr><th>Tiếng Nhật</th><th>Cách đọc</th><th>Nghĩa</th></tr></thead>
<tbody>
<tr><td>単体テスト</td><td>tantai tesuto</td><td>unit test (= component test theo ISTQB)</td></tr>
<tr><td>組合せテスト</td><td>kumiawase tesuto</td><td>“test kết hợp” = <em>Software Component Testing</em> của Hitachi ≈ component integration testing của ISTQB (checklist: CCL)</td></tr>
<tr><td>連動テスト</td><td>rendō tesuto</td><td>“test liên động” = Application Software Testing ≈ system testing (checklist: ACL)</td></tr>
<tr><td>詳細設計書</td><td>shōsai sekkeisho</td><td>tài liệu Detailed Design (DD / DS)</td></tr>
<tr><td>チェックリスト作成観点</td><td>chekkurisuto sakusei kanten</td><td>“quan điểm để lập checklist” = Testing Concerns</td></tr>
<tr><td>正常系 / 異常系 / 境界値</td><td>seijōkei / ijōkei / kyōkaichi</td><td>ca bình thường / ca bất thường (lỗi) / giá trị biên — chính là các chữ N, A (E), B (L); slide PCL viết tắt là 正 / 異 / 境</td></tr>
<tr><td>命令網羅 / 分岐網羅 / 修正網羅</td><td>meirei mōra / bunki mōra / shūsei mōra</td><td>phủ câu lệnh C0 / phủ nhánh (quyết định) C1 / phủ phần sửa đổi RC0</td></tr>
<tr><td>机上デバッグ</td><td>kijō debaggu</td><td>“debug trên bàn” = desk checking (đọc code đối chiếu thiết kế)</td></tr>
<tr><td>静的解析 / 動的テスト</td><td>seiteki kaiseki / dōteki tesuto</td><td>phân tích tĩnh / kiểm thử động</td></tr>
<tr><td>バグ管理票</td><td>bagu kanrihyō</td><td>phiếu quản lý bug = Bug List (slide PCL gọi là “B-Voucher”)</td></tr>
<tr><td>有識者 / リーダー / プログラマ</td><td>yūshikisha / rīdā / puroguramā</td><td>chuyên gia (hiểu spec) / leader / lập trình viên</td></tr>
<tr><td>検収</td><td>kenshū</td><td>nghiệm thu của khách hàng</td></tr>
<tr><td>帳票</td><td>chōhyō</td><td>biểu mẫu nghiệp vụ / báo cáo in</td></tr>
<tr><td>社外秘</td><td>shagaihi</td><td>“mật — không mang ra ngoài công ty”</td></tr>
</tbody></table></div>`),
    bi(`<h3>Ví dụ có lời giải · Worked example — how big must my white-box submission be?</h3>
<p>You pick <code>OrderService</code> from your SWP391 project: three methods with 62, 71 and 55 lines of code (188 LOC in total).</p>
<ol>
<li><strong>Score band.</strong> 188 LOC falls in “101–200 LOC → 5 points”; a method with nested loops and exception handling can add up to 2 difficulty points, so the ceiling is 7. Adding one more 60-LOC method would move you to 248 LOC → band 6 (+ difficulty).</li>
<li><strong>Expected number of test cases.</strong> The template's FunctionList sheet sets <em>Normal number of test cases/KLOC = 100</em>. The function sheet computes <em>Lack of test cases = LOC × 100 / 1000 − Total test cases</em> (formula <code>SUM(C4*FunctionList!E6/1000,-O7)</code>). For the 62-LOC method: 6.2 − (your total). With 5 cases the cell shows 1.2 (you are 1.2 cases short); with 8 cases it shows −1.8 (no lack). If you stay below the norm you must write the reason.</li>
<li><strong>Coverage evidence.</strong> Run the JUnit tests with a coverage tool (JaCoCo, EclEmma in Eclipse, IntelliJ's coverage runner) and paste the report: every method must show 100 % lines and 100 % branches.</li>
</ol>
<div class="pitfall co-tieu-de"><p><strong>Two traps that cost points.</strong></p>
<ol>
<li><strong>100 % coverage from tests without assertions</strong> — the structural deck (slide 3) warns about “empty unit tests, so 100 % of them pass”. Coverage measures what ran, not what was checked.</li>
<li><strong>Black-box cases derived from the code instead of the DD</strong> — then the expected results simply copy what the code does and a design violation can never be found.</li>
</ol></div>
<div class="callout"><p><span class="badge">★ Beyond the syllabus</span> <strong>Mutation testing — the test of your tests.</strong></p>
<p>A tool such as PIT (pitest.org) makes small changes to your code (turns <code>&lt;</code> into <code>&lt;=</code>, deletes a line, returns 0) and re-runs your JUnit suite. Every “mutant” that survives shows a place where your tests execute the code without checking it.</p>
<p>A suite with 100 % C0/C1 and a low mutation score is exactly the “empty unit test” problem.</p>
<p class="ghi-chu">Outside the syllabus because CTFL only covers statement and decision coverage as test-quality measures.</p></div>`,
    `<h3>Ví dụ có lời giải · Bài nộp white-box của tôi phải lớn cỡ nào?</h3>
<p>Bạn chọn <code>OrderService</code> trong dự án SWP391: ba method dài 62, 71 và 55 dòng code (tổng 188 LOC).</p>
<ol>
<li><strong>Mức điểm.</strong> 188 LOC rơi vào “101–200 LOC → 5 điểm”; method có vòng lặp lồng nhau và xử lý exception có thể được cộng tối đa 2 điểm độ khó, nên trần là 7. Thêm một method 60 LOC nữa sẽ lên 248 LOC → mức 6 (+ độ khó).</li>
<li><strong>Số test case kỳ vọng.</strong> Sheet FunctionList của template đặt <em>Normal number of test cases/KLOC = 100</em>. Sheet function tính <em>Lack of test cases = LOC × 100 / 1000 − Tổng số test case</em> (công thức <code>SUM(C4*FunctionList!E6/1000,-O7)</code>). Với method 62 LOC: 6,2 − (tổng của bạn). Có 5 ca thì ô hiện 1,2 (còn thiếu 1,2 ca); có 8 ca thì hiện −1,8 (không thiếu). Nếu thấp hơn định mức, bạn phải ghi lý do.</li>
<li><strong>Bằng chứng coverage.</strong> Chạy JUnit kèm công cụ coverage (JaCoCo, EclEmma trong Eclipse, trình coverage của IntelliJ) và dán báo cáo: mọi method phải 100 % dòng và 100 % nhánh.</li>
</ol>
<div class="pitfall co-tieu-de"><p><strong>Hai cái bẫy làm mất điểm.</strong></p>
<ol>
<li><strong>Coverage 100 % nhờ các test không có assertion</strong> — slide 3 bản structural cảnh báo “viết unit test rỗng nên 100 % đều pass”. Coverage đo cái đã <em>chạy</em>, không đo cái đã được <em>kiểm</em>.</li>
<li><strong>Ca black-box rút ra từ code thay vì từ DD</strong> — khi đó kết quả mong đợi chỉ chép lại việc code đang làm, và một chỗ sai so với thiết kế sẽ không bao giờ bị phát hiện.</li>
</ol></div>
<div class="callout"><p><span class="badge">★ Ngoài giáo trình</span> <strong>Mutation testing — kiểm tra chính bộ test.</strong></p>
<p>Công cụ như PIT (pitest.org) sửa nhỏ code của bạn (đổi <code>&lt;</code> thành <code>&lt;=</code>, xoá một dòng, trả về 0) rồi chạy lại bộ JUnit. Mỗi “mutant” sống sót chỉ ra một chỗ test có chạy qua code mà không hề kiểm tra nó.</p>
<p>Bộ test đạt C0/C1 100 % mà điểm mutation thấp chính là căn bệnh “unit test rỗng”.</p>
<p class="ghi-chu">Ngoài giáo trình vì CTFL chỉ dùng statement và decision coverage làm thước đo chất lượng test.</p></div>`),
    books([
      ['sp5', '§3.4.1 “Component Testing” — test objects, test drivers and stubs, PDF pp.87–93', '§3.4.1 “Component Testing” — đối tượng test, test driver và stub, PDF 87–93'],
      ['fst', '§2.2 “Test levels”, component testing — p.41 (PDF p.44)', '§2.2 “Test levels”, component testing — trang 41 (PDF 44)'],
      ['junit', 'Ch.1 “JUnit jump-start” PDF p.5 and Ch.6 “Test quality” (code coverage) PDF pp.103–105', 'Chương 1 “JUnit jump-start” PDF 5 và Chương 6 “Test quality” (code coverage) PDF 103–105'],
      ['fst4', 'Ch.4 §3 “White-box test techniques” — book pp.132–139', 'Chương 4 §3 “White-box test techniques” — trang sách 132–139'],
    ]),
  ].join('\n'),
};

/* ───────────── L2.2 Guide slides 1–35: purpose, roles, programming process ───────────── */
const L22 = {
  title: 'L2.2 — Unit-testing guide (1): roles and the six-step programming process|||L2.2 — Hướng dẫn unit test (1): vai trò và quy trình lập trình 6 bước',
  slug: 'swt301-lab2-guide-process',
  type: 'VIDEO',
  description: 'Slide 1–35 bộ “A Guide for Unit Testing” (Hitachi 2013): vì sao có bộ hướng dẫn, thuật ngữ và vai trò, kiến trúc 3 lớp, 6 bước từ viết PCL → chuẩn bị → code → test tĩnh → test động (C0/C1/RC0) → đánh giá. Trang tiếng Nhật được dịch đầy đủ.',
  content: [
    bi(`<span class="eyebrow">Lab 2 · Lesson L2.2 · A Guide for Unit Testing slides 1–35</span>
<h2>The unit-testing guide (1): why, who, and the programming process</h2>
<p class="lead">This deck is Hitachi's internal standard for unit testing, written for the programmers of its offshore partners — FPT Software among them. Chapters 1 and 2 tell you <strong>what a software unit is</strong>, <strong>who does what</strong>, and the <strong>six steps</strong> every programmer follows: write the test list (PCL) first, prepare, code, test statically, test dynamically until C0 and C1 reach 100 %, and have the result approved.</p>
<div class="callout"><p><strong>Learning objectives</strong></p>
<ul>
<li>Describe component testing, its test basis (the detailed design) and the use of drivers and stubs (LO-2.2.1, K2)</li>
<li>Explain why test cases should be written before the code (early testing, SWT1)</li>
<li>List the exit criteria of unit testing: all cases run, all bugs closed, static-analysis violations fixed, C0/C1 (or RC0) = 100 % (LO-5.2.3, K2)</li>
<li>Explain C0, C1 and RC0 (LO-4.3.1/4.3.2, K2)</li>
</ul></div>
<h3>Hitachi words ↔ ISTQB words</h3>
<div class="table-wrap"><table>
<thead><tr><th>In the guide</th><th>ISTQB / SWT301 term</th><th>Careful</th></tr></thead>
<tbody>
<tr><td>Software unit</td><td>Component (a method, function or class)</td><td>—</td></tr>
<tr><td>Unit testing</td><td>Component testing</td><td>The lab title “Component testing” means this level.</td></tr>
<tr><td>Software Component Testing (組合せテスト)</td><td>Component <em>integration</em> testing</td><td>Not ISTQB “component testing”!</td></tr>
<tr><td>Application Software Testing (連動テスト)</td><td>System testing</td><td>—</td></tr>
<tr><td>PCL (checklist for unit testing)</td><td>Test case specification for one component</td><td>Matrix of conditions × test cases</td></tr>
<tr><td>Testing Concerns</td><td>Checklist of test conditions / checklist-based testing</td><td>—</td></tr>
<tr><td>Desk checking, static code analysis, source code review</td><td>Static testing (Ch.3)</td><td>—</td></tr>
<tr><td>C0 / C1 / RC0</td><td>Statement / decision coverage; RC0 = statement coverage of changed lines</td><td>C1 counts branch outcomes.</td></tr>
</tbody></table></div>`,
    `<span class="eyebrow">Lab 2 · Bài L2.2 · A Guide for Unit Testing slide 1–35</span>
<h2>Hướng dẫn unit test (1): vì sao, ai làm gì, và quy trình lập trình</h2>
<p class="lead">Bộ slide này là tiêu chuẩn nội bộ của Hitachi về unit test, viết cho lập trình viên ở các đối tác offshore — trong đó có FPT Software. Chương 1 và 2 cho biết <strong>software unit là gì</strong>, <strong>ai làm việc gì</strong>, và <strong>sáu bước</strong> mọi lập trình viên phải theo: viết danh sách test (PCL) trước, chuẩn bị, code, test tĩnh, test động cho tới khi C0 và C1 đạt 100 %, rồi xin phê duyệt kết quả.</p>
<div class="callout"><p><strong>Chuẩn đầu ra</strong></p>
<ul>
<li>Mô tả component testing, test basis của nó (detailed design) và việc dùng driver, stub (LO-2.2.1, K2)</li>
<li>Giải thích vì sao phải viết test case trước khi code (early testing, SWT1)</li>
<li>Kể được tiêu chí kết thúc unit test: chạy hết ca, đóng hết bug, sửa hết vi phạm phân tích tĩnh, C0/C1 (hoặc RC0) = 100 % (LO-5.2.3, K2)</li>
<li>Giải thích C0, C1 và RC0 (LO-4.3.1/4.3.2, K2)</li>
</ul></div>
<h3>Từ của Hitachi ↔ từ của ISTQB</h3>
<div class="table-wrap"><table>
<thead><tr><th>Trong bộ hướng dẫn</th><th>Thuật ngữ ISTQB / SWT301</th><th>Chú ý</th></tr></thead>
<tbody>
<tr><td>Software unit</td><td>Component (method, hàm hoặc class)</td><td>—</td></tr>
<tr><td>Unit testing</td><td>Component testing</td><td>Tên lab “Component testing” chính là cấp này.</td></tr>
<tr><td>Software Component Testing (組合せテスト)</td><td>Component <em>integration</em> testing</td><td>Không phải “component testing” của ISTQB!</td></tr>
<tr><td>Application Software Testing (連動テスト)</td><td>System testing</td><td>—</td></tr>
<tr><td>PCL (checklist cho unit test)</td><td>Đặc tả test case của một component</td><td>Ma trận điều kiện × test case</td></tr>
<tr><td>Testing Concerns</td><td>Checklist các test condition / checklist-based testing</td><td>—</td></tr>
<tr><td>Desk checking, phân tích tĩnh, review code</td><td>Kiểm thử tĩnh (Chương 3)</td><td>—</td></tr>
<tr><td>C0 / C1 / RC0</td><td>Statement / decision coverage; RC0 = statement coverage trên các dòng bị sửa</td><td>C1 đếm các kết quả nhánh.</td></tr>
</tbody></table></div>`),
    walkHead(G, 1, 35, 'The guide alternates Japanese and English pages (an odd slide is usually Japanese, the next one its English twin). The Japanese text of each Japanese page is translated below it.', 'Bộ hướng dẫn xen kẽ trang tiếng Nhật và tiếng Anh (thường slide lẻ là tiếng Nhật, slide kế tiếp là bản tiếng Anh). Nội dung tiếng Nhật của mỗi trang được dịch ngay dưới slide đó.'),
    walk(G, [
      [1, 'Cover (Japanese): 単体テスト実施ガイド, 2013/01',
        `<p class="y-chinh">🎯 The cover of Hitachi's unit-testing standard — the source of the PCL, the N/A/B letters and the C0/C1 = 100 % rule you meet in Lab 2.</p>
${JE(7)}
<p class="nhan">What the cover says</p>
<ul>
<li><strong>単体テスト実施ガイド</strong> (<em>tantai tesuto jisshi gaido</em>, “guide for carrying out unit testing”) — <em>A Guide for Unit Testing</em>, January 2013.</li>
<li><strong>株式会社 日立製作所 情報・通信システム社</strong> — Hitachi, Ltd., Information &amp; Telecommunication Systems Company.</li>
<li><strong>社外秘</strong> — the small red-framed box at the top right: “confidential, not for outside the company”.</li>
</ul>
<p class="nhan">Why a Hitachi document in an FPT course?</p>
<p>FPT Software builds and tests software for Japanese customers, and this is the standard those customers impose. The PCL, the N/A/B letters and the C0/C1 = 100 % rule in your template all come from here.</p>`,
        `<p class="y-chinh">🎯 Bìa bộ tiêu chuẩn unit test của Hitachi — nguồn gốc của PCL, các chữ N/A/B và quy tắc C0/C1 = 100 % mà bạn gặp trong Lab 2.</p>
${JV(7)}
<p class="nhan">Bìa ghi gì</p>
<ul>
<li><strong>単体テスト実施ガイド</strong> (<em>tantai tesuto jisshi gaido</em>, “hướng dẫn thực hiện unit test”) — <em>A Guide for Unit Testing</em>, tháng 1/2013.</li>
<li><strong>株式会社 日立製作所 情報・通信システム社</strong> — Hitachi, Ltd., Công ty Hệ thống Thông tin &amp; Viễn thông.</li>
<li><strong>社外秘</strong> — ô viền đỏ nhỏ góc phải trên: “mật, không đưa ra ngoài công ty”.</li>
</ul>
<p class="nhan">Vì sao tài liệu Hitachi lại có trong môn học của FPT?</p>
<p>FPT Software làm và test phần mềm cho khách Nhật, và đây là chuẩn khách hàng áp đặt. PCL, các chữ N/A/B và quy tắc C0/C1 = 100 % trong template của bạn đều bắt nguồn từ đây.</p>`],
      [2, 'About this guide (Japanese only)',
        `<p class="y-chinh">🎯 本ガイドについて — “About this guide”: five rows saying what the guide covers, for whom, and what should change after using it.</p>
<p class="ghi-chu">🇯🇵 Japanese-only page (no English twin) — the Japanese text is translated here.</p>
<p class="nhan">The five rows</p>
<ol>
<li><strong>Scope (対象範囲)</strong> — unit testing of online applications with a three-tier architecture, and of batch programs.</li>
<li><strong>Assumed use (想定ユースケース)</strong> — explains to developers the unit-testing procedure and how to write checklists consistent with the quality indicators.</li>
<li><strong>Purpose (目的)</strong> — reduce the variation of test work between workers and between projects, and secure the application quality Hitachi requires.</li>
<li><strong>Readers (想定読者)</strong> — programmers who implement and unit-test the programs; <em>not</em> management criteria for leaders.</li>
<li><strong>State after applying it (適用後の状態)</strong> — each programmer can create a PCL correctly (an explanation and a review are needed the first time to confirm they understood), and can report properly with a bug management sheet.</li>
</ol>
<p class="ghi-chu">The only Latin word on the page, “PCL”, sits in that last row.</p>`,
        `<p class="y-chinh">🎯 本ガイドについて — “Về bộ hướng dẫn này”: năm dòng cho biết hướng dẫn áp dụng cho gì, cho ai, và sau khi dùng thì phải thay đổi được gì.</p>
<p class="ghi-chu">🇯🇵 Trang chỉ có tiếng Nhật (không có bản tiếng Anh) — nội dung tiếng Nhật được dịch ở đây.</p>
<p class="nhan">Năm dòng</p>
<ol>
<li><strong>Phạm vi (対象範囲)</strong> — unit test cho ứng dụng online kiến trúc 3 lớp và cho chương trình batch.</li>
<li><strong>Tình huống dùng (想定ユースケース)</strong> — giải thích cho lập trình viên quy trình unit test và cách viết checklist nhất quán với các chỉ số chất lượng.</li>
<li><strong>Mục đích (目的)</strong> — giảm độ chênh lệch trong công việc test giữa từng người và từng dự án, bảo đảm chất lượng ứng dụng mà Hitachi yêu cầu.</li>
<li><strong>Người đọc (想定読者)</strong> — lập trình viên phụ trách cài đặt và unit test; <em>không phải</em> tiêu chuẩn quản lý dành cho leader.</li>
<li><strong>Trạng thái sau khi áp dụng (適用後の状態)</strong> — mỗi lập trình viên tạo được PCL đúng (lần đầu cần giải thích và review để chắc là đã hiểu), và báo cáo đúng cách bằng phiếu quản lý bug.</li>
</ol>
<p class="ghi-chu">Chữ Latin duy nhất trên trang, “PCL”, nằm ở dòng cuối đó.</p>`],
      [3, 'How and where to use the guide (Japanese only)',
        `<p class="y-chinh">🎯 The guide is a template to adapt: keep one language, edit it to your project, and delete the red “labels” when you use it for real.</p>
<p class="ghi-chu">🇯🇵 Japanese-only page, translated here.</p>
<p class="nhan">How to use (利用方法)</p>
<ul>
<li><strong>Two languages</strong> — the guide has Japanese pages and English pages; delete the pages in the language you do not use.</li>
<li><strong>Editable</strong> — you may edit it where your project's standards differ or where you want to add content.</li>
<li><strong>Red labels</strong> — points that need special care are explained in labels like the red-framed box at the bottom: “labels in this format give supplementary notes for using the guide — delete them when you actually use it”. You will see these red frames on many later slides.</li>
</ul>
<p class="nhan">Usage scenes (利用シーン)</p>
<ol>
<li><strong>Offshore partner (IP先)</strong> — few leaders for many developers; wants to control test work efficiently.</li>
<li><strong>Overseas subsidiary</strong> serving Japanese companies — wants to strengthen testing to reach the quality Japanese companies expect.</li>
<li><strong>Training</strong> — teaching developers in Japan or abroad “Hitachi's way of testing”.</li>
</ol>
<p>Scene ② is literally your future job at an FPT offshore project.</p>`,
        `<p class="y-chinh">🎯 Bộ hướng dẫn là một mẫu để tuỳ biến: giữ một ngôn ngữ, sửa cho hợp dự án, và xoá các “nhãn” đỏ khi dùng thật.</p>
<p class="ghi-chu">🇯🇵 Trang chỉ có tiếng Nhật, được dịch ở đây.</p>
<p class="nhan">Cách dùng (利用方法)</p>
<ul>
<li><strong>Hai ngôn ngữ</strong> — bộ hướng dẫn có trang tiếng Nhật và trang tiếng Anh; xoá các trang của ngôn ngữ không dùng.</li>
<li><strong>Được sửa</strong> — được phép chỉnh sửa chỗ nào tiêu chuẩn dự án khác đi hoặc muốn bổ sung.</li>
<li><strong>Nhãn đỏ</strong> — những điểm cần đặc biệt lưu ý được ghi trong các nhãn như ô viền đỏ phía dưới: “nhãn dạng này chứa ghi chú bổ sung để dùng bộ hướng dẫn — hãy xoá chúng khi sử dụng thật”. Bạn sẽ gặp các khung đỏ này ở rất nhiều slide sau.</li>
</ul>
<p class="nhan">Tình huống sử dụng (利用シーン)</p>
<ol>
<li><strong>Đối tác offshore (IP先)</strong> — ít leader so với số developer; muốn kiểm soát việc test hiệu quả.</li>
<li><strong>Công ty con ở nước ngoài</strong> phục vụ doanh nghiệp Nhật — muốn tăng cường khâu test để đạt chất lượng doanh nghiệp Nhật đòi hỏi.</li>
<li><strong>Đào tạo</strong> — dạy developer trong và ngoài nước theo “cách test của Hitachi”.</li>
</ol>
<p>Tình huống ② chính là công việc tương lai của bạn ở một dự án offshore của FPT.</p>`],
      [4, 'Effect of applying the guide (Japanese)',
        `<p class="y-chinh">🎯 Three bar charts show what the guide changed on a real project: fewer test cases, more bugs caught in UT, fewer bugs at acceptance.</p>
${JE(5)}
<p class="nhan">The three charts (project criterion = red band)</p>
<ul>
<li><strong>CL密度</strong> (checklist density = test cases per size) — −48 %.</li>
<li><strong>UT摘出不良</strong> (defects detected in unit testing) — +14 %.</li>
<li><strong>検収時不良</strong> (defects found at acceptance inspection) — −50 %.</li>
</ul>
<p class="nhan">What the text boxes say</p>
<ol>
<li><strong>Before</strong> — testing depended on each person and was disorderly.</li>
<li><strong>Unified CL-creation rules</strong> — the quality of cases became adequate and their number approached the criterion.</li>
<li><strong>Result</strong> — more defects were found efficiently at UT, which cut acceptance defects.</li>
</ol>
<p class="ghi-chu">The link at the bottom points to Hitachi's internal knowledge base (SoFI).</p>`,
        `<p class="y-chinh">🎯 Ba biểu đồ cột cho thấy hướng dẫn đã thay đổi gì trên một dự án thật: ít test case hơn, bắt nhiều bug hơn ở UT, ít bug hơn lúc nghiệm thu.</p>
${JV(5)}
<p class="nhan">Ba biểu đồ (tiêu chuẩn dự án = dải đỏ)</p>
<ul>
<li><strong>CL密度</strong> (mật độ checklist = số test case trên kích thước) — giảm 48 %.</li>
<li><strong>UT摘出不良</strong> (lỗi phát hiện ở unit test) — tăng 14 %.</li>
<li><strong>検収時不良</strong> (lỗi phát hiện khi nghiệm thu) — giảm 50 %.</li>
</ul>
<p class="nhan">Các ô chữ nói gì</p>
<ol>
<li><strong>Trước đây</strong> — việc test phụ thuộc từng người, lộn xộn.</li>
<li><strong>Thống nhất quy tắc lập CL</strong> — chất lượng ca test trở nên hợp lý và số lượng tiến gần tiêu chuẩn.</li>
<li><strong>Kết quả</strong> — nhiều lỗi được bắt hiệu quả hơn ở UT nên lỗi lúc nghiệm thu giảm.</li>
</ol>
<p class="ghi-chu">Đường link cuối trang trỏ tới kho tri thức nội bộ của Hitachi (SoFI).</p>`],
      [5, 'A case example of the effects (English)',
        `<p class="y-chinh">🎯 The English twin of slide 4: fewer but better test cases found more bugs earlier — early testing, measured.</p>
<p class="nhan">Read the three charts together</p>
<ul>
<li><strong>Density of test cases</strong> — dropped 48 % to the criterion; before the guide, people wrote many redundant cases.</li>
<li><strong>Density of defects found in unit testing</strong> — rose 14 % to the criterion.</li>
<li><strong>Density of defects at acceptance</strong> — fell 50 %.</li>
</ul>
<p class="nhan">What it teaches</p>
<ul>
<li><strong>Principle 3 of SWT1</strong> (<em>early testing saves time and money</em>) — measured on a real project: fewer but better cases find more bugs earlier.</li>
<li><strong>Criterion (基準値)</strong> — Japanese projects set target densities for both test cases and bugs; a leader questions a unit whose numbers are far off in either direction (slide 35).</li>
</ul>
<p class="ghi-chu">The red label at the top says “delete this page and all pages before it when you actually use the guide” — slides 1–5 are only the sales pitch; the real guide starts at slide 6.</p>`,
        `<p class="y-chinh">🎯 Bản tiếng Anh của slide 4: ít test case hơn nhưng tốt hơn đã bắt nhiều bug hơn và sớm hơn — test sớm, được đo bằng số.</p>
<p class="nhan">Đọc ba biểu đồ cùng nhau</p>
<ul>
<li><strong>Mật độ test case</strong> — giảm 48 % về đúng tiêu chuẩn; trước khi có hướng dẫn, mọi người viết nhiều ca thừa.</li>
<li><strong>Mật độ lỗi phát hiện ở unit test</strong> — tăng 14 % lên tiêu chuẩn.</li>
<li><strong>Mật độ lỗi lúc nghiệm thu</strong> — giảm 50 %.</li>
</ul>
<p class="nhan">Bài học rút ra</p>
<ul>
<li><strong>Nguyên tắc 3 của SWT1</strong> (<em>test sớm tiết kiệm thời gian và tiền</em>) — được đo trên dự án thật: ít ca hơn nhưng tốt hơn, bắt nhiều lỗi hơn và sớm hơn.</li>
<li><strong>Tiêu chuẩn (基準値)</strong> — dự án Nhật đặt mật độ mục tiêu cho cả test case lẫn bug; leader sẽ chất vấn unit nào có số liệu lệch xa ở bất kỳ chiều nào (slide 35).</li>
</ul>
<p class="ghi-chu">Nhãn đỏ ở trên ghi “khi dùng thật, hãy xoá trang này và mọi trang trước nó” — slide 1–5 chỉ là phần giới thiệu; bộ hướng dẫn thật bắt đầu từ slide 6.</p>`],
      [6, 'Template cover (Japanese): yyyy/MM',
        `<p class="y-chinh">🎯 The real first page of the guide, as a template with a date to fill in.</p>
${JE(7)}
<ul>
<li><strong>Red label</strong> — “yyyy/MM に年月を記入してください（例：2013/01）” = “write the year and month in yyyy/MM (e.g. 2013/01)”.</li>
<li><strong>Empty box at the top right</strong> — where 社外秘 (confidential) goes.</li>
</ul>`,
        `<p class="y-chinh">🎯 Trang bìa thật của bộ hướng dẫn, ở dạng mẫu có ô ngày tháng để điền.</p>
${JV(7)}
<ul>
<li><strong>Nhãn đỏ</strong> — “yyyy/MM に年月を記入してください（例：2013/01）” = “điền năm tháng theo dạng yyyy/MM (ví dụ 2013/01)”.</li>
<li><strong>Ô trống góc phải trên</strong> — chỗ ghi 社外秘 (mật).</li>
</ul>`],
      [7, 'Template cover (English): MMM yyyy, HITACHI CONFIDENTIAL',
        `<p class="y-chinh">🎯 The English cover — nothing to learn for the exam, but even the guide is a template to be customised.</p>
<ul>
<li><strong>Title</strong> — <em>A Guide for Unit Testing</em>, Information &amp; Telecommunication Systems Company, Hitachi, Ltd., marked <strong>HITACHI CONFIDENTIAL</strong>.</li>
<li><strong>Red label</strong> (in Japanese) — replace “MMM yyyy” with the month, e.g. “January 2013”.</li>
<li><strong>Take-away</strong> — every project adapts the standard (see slide 3).</li>
</ul>`,
        `<p class="y-chinh">🎯 Bìa tiếng Anh — không có gì để thi, nhưng ngay cả bộ hướng dẫn cũng là một mẫu để tuỳ biến.</p>
<ul>
<li><strong>Tựa đề</strong> — <em>A Guide for Unit Testing</em>, Information &amp; Telecommunication Systems Company, Hitachi, Ltd., đóng dấu <strong>HITACHI CONFIDENTIAL</strong>.</li>
<li><strong>Nhãn đỏ</strong> (tiếng Nhật) — thay “MMM yyyy” bằng tháng, ví dụ “January 2013”.</li>
<li><strong>Điều cần nhớ</strong> — dự án nào cũng điều chỉnh tiêu chuẩn (xem slide 3).</li>
</ul>`],
      [8, 'Contents (Japanese)',
        `<p class="y-chinh">🎯 The table of contents: four chapters and an appendix.</p>
${JE(9)}
<ol>
<li><strong>本ガイドの概要</strong> — outline of this guide.</li>
<li><strong>プログラミングプロセスの進め方</strong> — how to proceed through the programming process.</li>
<li><strong>PCLの作成方法</strong> — how to create PCLs.</li>
<li><strong>PCL作成時の留意点</strong> — points to note when creating PCLs.</li>
</ol>
<ul><li><strong>付録 関連知識</strong> — appendix: related knowledge.</li></ul>`,
        `<p class="y-chinh">🎯 Mục lục: bốn chương và một phụ lục.</p>
${JV(9)}
<ol>
<li><strong>本ガイドの概要</strong> — tổng quan bộ hướng dẫn.</li>
<li><strong>プログラミングプロセスの進め方</strong> — cách tiến hành quy trình lập trình.</li>
<li><strong>PCLの作成方法</strong> — cách tạo PCL.</li>
<li><strong>PCL作成時の留意点</strong> — điểm lưu ý khi tạo PCL.</li>
</ol>
<ul><li><strong>付録 関連知識</strong> — phụ lục: kiến thức liên quan.</li></ul>`],
      [9, 'Contents (English)',
        `<p class="y-chinh">🎯 The five parts of the guide, and the lesson on this site where each one is taught.</p>
<ul>
<li><strong>1 Outline</strong> and <strong>2 Procedure for the Programming Process</strong> — this lesson (slides 10–35).</li>
<li><strong>3 Creating PCLs</strong> and <strong>4 Points to note</strong> — lesson L2.3 (slides 36–67).</li>
<li><strong>Appendix</strong> — three-tier architecture, order of unit testing, testing concerns vs test cases vs checklists, list vs matrix format, test-case categories, coverage — lesson L2.4.</li>
</ul>`,
        `<p class="y-chinh">🎯 Năm phần của bộ hướng dẫn, và bài nào trên trang này dạy phần đó.</p>
<ul>
<li><strong>1 Tổng quan</strong> và <strong>2 Quy trình lập trình</strong> — bài này (slide 10–35).</li>
<li><strong>3 Tạo PCL</strong> và <strong>4 Điểm lưu ý</strong> — bài L2.3 (slide 36–67).</li>
<li><strong>Phụ lục</strong> — kiến trúc 3 lớp, thứ tự unit test, testing concern vs test case vs checklist, dạng danh sách vs ma trận, phân loại test case, coverage — bài L2.4.</li>
</ul>`],
      [10, 'Section 1 divider (Japanese)',
        `<p class="y-chinh">🎯 “1. 本ガイドの概要” — “1. Outline of this guide”.</p>
${JE(11)}`,
        `<p class="y-chinh">🎯 “1. 本ガイドの概要” — “1. Tổng quan bộ hướng dẫn”.</p>
${JV(11)}`],
      [11, 'Section 1: Outline of This Guide',
        `<p class="y-chinh">🎯 Divider for chapter 1, which answers three questions.</p>
<ol>
<li>What is unit testing for?</li>
<li>Who is involved?</li>
<li>Which kinds of units does the guide cover?</li>
</ol>`,
        `<p class="y-chinh">🎯 Trang ngăn chương 1, chương trả lời ba câu hỏi.</p>
<ol>
<li>Unit test để làm gì?</li>
<li>Ai tham gia?</li>
<li>Bộ hướng dẫn áp dụng cho loại unit nào?</li>
</ol>`],
      [12, 'Outline (Japanese)',
        `<p class="y-chinh">🎯 Same text as slide 13: where unit testing sits in Hitachi's development process.</p>
${JE(13)}
<p class="nhan">The five chevrons</p>
<ol>
<li><strong>アプリケーション方式設計</strong> — application architecture design</li>
<li><strong>アプリケーション詳細設計</strong> — detailed application design</li>
<li><strong>プログラミング（コーディング・単体テスト）</strong> — programming: coding and unit testing (highlighted)</li>
<li><strong>組合せテスト</strong> — combination test</li>
<li><strong>連動テスト</strong> — linked test</li>
</ol>`,
        `<p class="y-chinh">🎯 Nội dung giống slide 13: unit test nằm ở đâu trong quy trình phát triển của Hitachi.</p>
${JV(13)}
<p class="nhan">Năm mũi tên</p>
<ol>
<li><strong>アプリケーション方式設計</strong> — thiết kế kiến trúc ứng dụng</li>
<li><strong>アプリケーション詳細設計</strong> — thiết kế chi tiết ứng dụng</li>
<li><strong>プログラミング（コーディング・単体テスト）</strong> — lập trình: code và unit test (được tô đậm)</li>
<li><strong>組合せテスト</strong> — test kết hợp</li>
<li><strong>連動テスト</strong> — test liên động</li>
</ol>`],
      [13, 'Outline of This Guide (English)',
        `<p class="y-chinh">🎯 Unit testing is the only level that can check a unit exhaustively — so it is done by the programmer, against the detailed design, until C0/C1 = 100 %.</p>
<p class="nhan">Three key sentences</p>
<ol>
<li><strong>Audience</strong> — the guide is for <strong>programmers</strong> who implement and unit-test.</li>
<li><strong>“Unit testing is the only process for exhaustively checking the behaviour of software units.”</strong> — later levels test units only through other units, so many internal paths can never be reached again. That is why the guide demands 100 % C0/C1 here and nowhere else.</li>
<li><strong>Part of the Programming Process</strong> — at Hitachi, unit testing is not a separate test phase: the same person codes and unit-tests.</li>
</ol>
<p class="nhan">The chevrons = the left-to-right half of a V-model</p>
<ol>
<li>Architecture design</li>
<li>Detailed design</li>
<li>Programming (coding + unit testing)</li>
<li>Software Component Testing — units combined, i.e. ISTQB <em>component integration testing</em></li>
<li>Application Software Testing ≈ system testing</li>
</ol>
<p>Each test level is checked against the matching design level; unit testing is checked against the <strong>detailed design</strong>.</p>`,
        `<p class="y-chinh">🎯 Unit test là cấp duy nhất kiểm được unit một cách vét cạn — nên do chính lập trình viên làm, đối chiếu detailed design, tới khi C0/C1 = 100 %.</p>
<p class="nhan">Ba câu then chốt</p>
<ol>
<li><strong>Người đọc</strong> — bộ hướng dẫn dành cho <strong>lập trình viên</strong>, người cài đặt và unit test.</li>
<li><strong>“Unit test là quy trình duy nhất kiểm tra hành vi của software unit một cách vét cạn.”</strong> — các cấp sau chỉ test unit gián tiếp qua unit khác, nên nhiều đường đi bên trong không bao giờ với tới được nữa. Đó là lý do hướng dẫn đòi C0/C1 100 % ở đây chứ không ở cấp nào khác.</li>
<li><strong>Một phần của Quy trình Lập trình</strong> — ở Hitachi, unit test không phải một pha test riêng: người code cũng là người unit test.</li>
</ol>
<p class="nhan">Các mũi tên = nửa trái-sang-phải của mô hình V</p>
<ol>
<li>Thiết kế kiến trúc</li>
<li>Thiết kế chi tiết</li>
<li>Lập trình (code + unit test)</li>
<li>Software Component Testing — ghép các unit, tức <em>component integration testing</em> của ISTQB</li>
<li>Application Software Testing ≈ system testing</li>
</ol>
<p>Mỗi cấp test đối chiếu với cấp thiết kế tương ứng; unit test đối chiếu với <strong>detailed design</strong>.</p>`],
      [14, 'People and terms (Japanese)',
        `<p class="y-chinh">🎯 Same two tables as slide 15 — who is involved in unit testing, and the important terms.</p>
${JE(15)}
<ul>
<li><strong>単体テストに関係する人物</strong> — persons involved in unit testing.</li>
<li><strong>重要語</strong> — important terms.</li>
<li><strong>Red label</strong> — “change the roles to fit your project organisation; if you change them, make each role's share of work clear (e.g. when programmer and test executor are different people)”.</li>
</ul>`,
        `<p class="y-chinh">🎯 Hai bảng giống slide 15 — ai liên quan tới unit test, và các thuật ngữ quan trọng.</p>
${JV(15)}
<ul>
<li><strong>単体テストに関係する人物</strong> — người liên quan tới unit test.</li>
<li><strong>重要語</strong> — thuật ngữ quan trọng.</li>
<li><strong>Nhãn đỏ</strong> — “đổi các vai trò cho hợp với tổ chức dự án; nếu đổi thì phải làm rõ phân công của từng vai (ví dụ khi người lập trình và người chạy test là hai người khác nhau)”.</li>
</ul>`],
      [15, 'Persons involved and important terms (English)',
        `<p class="y-chinh">🎯 Three roles (programmer, expert, leader) and six terms — above all: a test case is <em>a pair of input conditions and expected results</em>.</p>
<p class="nhan">Roles</p>
<ul>
<li><strong>Programmer</strong> — implements the units and performs unit testing.</li>
<li><strong>Expert</strong> — understands the specification of the software being developed and tested (reviews the PCL).</li>
<li><strong>Leader</strong> — coordinates programmers, manages progress and quality (reviews and approves).</li>
</ul>
<p class="nhan">Terms</p>
<ul>
<li><strong>Software unit</strong> — the smallest piece a programmer develops (method, function).</li>
<li><strong>Unit testing</strong> — testing whether units are implemented correctly.</li>
<li><strong>Test case</strong> — <strong>a pair of input conditions and expected results</strong> (exactly the ISTQB idea).</li>
<li><strong>PCL</strong> — the list of test cases for unit testing. Footnote *1: “for historical reasons a Checklist for Unit Testing is called a PCL within Hitachi” (the PCL deck expands it as <em>Program Check List</em>, L2.5).</li>
<li><strong>Testing Concerns</strong> — an artifact listing things to watch so that testing is not insufficient.</li>
<li><strong>Detailed Design</strong> — the internal specification of a unit (e.g. Detailed Method Design), input to both the PCL and the code.</li>
</ul>`,
        `<p class="y-chinh">🎯 Ba vai trò (programmer, expert, leader) và sáu thuật ngữ — quan trọng nhất: test case là <em>một cặp điều kiện đầu vào và kết quả mong đợi</em>.</p>
<p class="nhan">Vai trò</p>
<ul>
<li><strong>Programmer</strong> — cài đặt unit và unit test.</li>
<li><strong>Expert</strong> — người hiểu đặc tả phần mềm đang làm và đang test (review PCL).</li>
<li><strong>Leader</strong> — điều phối lập trình viên, quản lý tiến độ và chất lượng (review và phê duyệt).</li>
</ul>
<p class="nhan">Thuật ngữ</p>
<ul>
<li><strong>Software unit</strong> — phần nhỏ nhất lập trình viên phát triển (method, hàm).</li>
<li><strong>Unit testing</strong> — kiểm xem unit đã được cài đặt đúng chưa.</li>
<li><strong>Test case</strong> — <strong>một cặp điều kiện đầu vào và kết quả mong đợi</strong> (đúng ý của ISTQB).</li>
<li><strong>PCL</strong> — danh sách test case cho unit test. Chú thích *1: “vì lý do lịch sử, Checklist for Unit Testing được gọi là PCL trong Hitachi” (slide PCL giải nghĩa là <em>Program Check List</em>, bài L2.5).</li>
<li><strong>Testing Concerns</strong> — tài liệu liệt kê những điểm cần để ý để việc test không bị thiếu.</li>
<li><strong>Detailed Design</strong> — đặc tả bên trong của một unit (ví dụ Detailed Method Design), là đầu vào cho cả PCL lẫn code.</li>
</ul>`],
      [16, 'Applicable software units (Japanese)',
        `<p class="y-chinh">🎯 Same diagram as slide 17, plus one rule: client-side programs get PCLs too.</p>
${JE(17)}
<p>Footnote *1 (only “JavaScript FLEX … PCL” survived): <strong>when you develop client-side programs such as JavaScript or FLEX, create PCLs and test them following this guide exactly as for server-side programs.</strong></p>`,
        `<p class="y-chinh">🎯 Sơ đồ giống slide 17, thêm một quy tắc: chương trình phía client cũng phải có PCL.</p>
${JV(17)}
<p>Chú thích *1 (chỉ còn sót “JavaScript FLEX … PCL”): <strong>khi phát triển chương trình phía client như JavaScript hay FLEX, cũng phải tạo PCL và test theo đúng bộ hướng dẫn này như chương trình phía server.</strong></p>`],
      [17, 'Applicable software units: the three-tier architecture',
        `<p class="y-chinh">🎯 The guide covers four kinds of unit: P, F and D units of a three-tier application, plus batch main units.</p>
<p class="nhan">The four kinds</p>
<ul>
<li><strong>Presentation layer (P) units</strong> — handle user interfaces: screen layouts and screen transitions (the hexagons on the left are <em>Views</em>).</li>
<li><strong>Function layer (F) units</strong> — hold business logic and transaction control; they call each other.</li>
<li><strong>Data access layer (D) units</strong> — access the database, and <em>only</em> D units may do so.</li>
<li><strong>Batch main units</strong> (orange box) — batch programs that also go through D units.</li>
</ul>
<p class="nhan">In your own projects</p>
<ul>
<li><strong>SWP391</strong> — servlet/JSP or controller = P, service = F, DAO/repository = D.</li>
<li><strong>Black-box lab</strong> — its Detail Design is a <em>batch</em> system: the action classes are batch main units (L2.7).</li>
</ul>`,
        `<p class="y-chinh">🎯 Bộ hướng dẫn áp dụng cho bốn loại unit: unit P, F, D của ứng dụng 3 lớp, cộng batch main unit.</p>
<p class="nhan">Bốn loại</p>
<ul>
<li><strong>Unit lớp Presentation (P)</strong> — lo giao diện: bố cục màn hình và chuyển màn hình (các hình lục giác bên trái là <em>View</em>).</li>
<li><strong>Unit lớp Function (F)</strong> — chứa logic nghiệp vụ và điều khiển transaction; chúng gọi lẫn nhau.</li>
<li><strong>Unit lớp Data access (D)</strong> — truy cập cơ sở dữ liệu, và <em>chỉ</em> unit D được làm việc này.</li>
<li><strong>Batch main unit</strong> (ô cam) — chương trình batch, cũng đi qua unit D.</li>
</ul>
<p class="nhan">Trong dự án của bạn</p>
<ul>
<li><strong>SWP391</strong> — servlet/JSP hoặc controller = P, service = F, DAO/repository = D.</li>
<li><strong>Lab black-box</strong> — Detail Design của nó là một hệ thống <em>batch</em>: các lớp action là batch main unit (bài L2.7).</li>
</ul>`],
      [18, 'Section 2 divider (Japanese)',
        `<p class="y-chinh">🎯 “2. プログラミングプロセスの進め方” — “2. How to proceed through the programming process”.</p>
${JE(19)}`,
        `<p class="y-chinh">🎯 “2. プログラミングプロセスの進め方” — “2. Cách tiến hành quy trình lập trình”.</p>
${JV(19)}`],
      [19, 'Section 2: Procedure for the Programming Process',
        `<p class="y-chinh">🎯 Divider for chapter 2 — the heart of the guide.</p>
<ul>
<li><strong>Six steps</strong>, each on its own slide with <em>Objectives</em> and <em>Tasks</em> (slides 21–35).</li>
</ul>`,
        `<p class="y-chinh">🎯 Trang ngăn chương 2 — trái tim của bộ hướng dẫn.</p>
<ul>
<li><strong>Sáu bước</strong>, mỗi bước một slide có <em>Objectives</em> và <em>Tasks</em> (slide 21–35).</li>
</ul>`],
      [20, 'Procedure (Japanese)',
        `<p class="y-chinh">🎯 The Japanese flowchart of the six-step programming process (English twin: slide 21).</p>
${JE(21)}
<p class="nhan">Objective</p>
<p>ソフトウェアユニットを実装し、詳細設計書通りに動作することを確認する — implement the unit and confirm it behaves as the detailed design says.</p>
<p class="nhan">The six boxes</p>
<ol>
<li><strong>PCL作成</strong> — create PCL</li>
<li><strong>単体テスト準備</strong> — prepare unit test</li>
<li><strong>ソースプログラム作成</strong> — write source program</li>
<li><strong>静的テスト</strong> — static test</li>
<li><strong>動的テスト（単体テスト）</strong> — dynamic test</li>
<li><strong>単体テスト評価</strong> — unit-test evaluation</li>
</ol>
<ul>
<li><strong>Yellow balloon</strong> — 動的テストで検出したバグは必ず記録する: always record bugs found in dynamic testing.</li>
<li><strong>Red label</strong> — report progress every day so the leader can grasp it.</li>
</ul>`,
        `<p class="y-chinh">🎯 Lưu đồ tiếng Nhật của quy trình lập trình 6 bước (bản tiếng Anh: slide 21).</p>
${JV(21)}
<p class="nhan">Mục tiêu</p>
<p>ソフトウェアユニットを実装し、詳細設計書通りに動作することを確認する — cài đặt unit và xác nhận nó chạy đúng như detailed design.</p>
<p class="nhan">Sáu ô</p>
<ol>
<li><strong>PCL作成</strong> — tạo PCL</li>
<li><strong>単体テスト準備</strong> — chuẩn bị unit test</li>
<li><strong>ソースプログラム作成</strong> — viết chương trình nguồn</li>
<li><strong>静的テスト</strong> — test tĩnh</li>
<li><strong>動的テスト（単体テスト）</strong> — test động</li>
<li><strong>単体テスト評価</strong> — đánh giá unit test</li>
</ol>
<ul>
<li><strong>Bóng vàng</strong> — 動的テストで検出したバグは必ず記録する: bug phát hiện trong test động phải được ghi lại.</li>
<li><strong>Nhãn đỏ</strong> — báo cáo tiến độ hằng ngày để leader nắm được.</li>
</ul>`],
      [21, 'Procedure for the Programming Process (English)',
        `<p class="y-chinh">🎯 Six steps from PCL to approval — and the test design (PCL) comes <em>before</em> the code.</p>
<p class="nhan">Objective</p>
<p>Implement units and determine whether they behave as described in their Detailed Design.</p>
<p class="nhan">The six steps</p>
<ol>
<li><strong>Create PCLs</strong> — reviewed by others (*3: more reviewers → more exhaustive PCLs).</li>
<li><strong>Prepare for unit testing</strong> — runtime environment, test data, test drivers.</li>
<li><strong>Code</strong>.</li>
<li><strong>Do static testing</strong> — check the code without running it (*4: bugs found statically reduce later work).</li>
<li><strong>Do dynamic testing</strong> — run the unit (yellow balloon: <strong>always record every bug found here</strong>).</li>
<li><strong>Have the unit testing evaluated and approved</strong> by the leader.</li>
</ol>
<p class="nhan">Footnotes</p>
<ul>
<li><strong>*1</strong> — if quality does not meet the project criteria, repeat the procedure.</li>
<li><strong>*2</strong> — following it makes your work “highly evaluated”.</li>
<li><strong>Bottom line</strong> — report progress daily.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> test design (PCL) comes before coding — the same “test first” idea as TDD, and ISTQB's early-testing principle.</p>`,
        `<p class="y-chinh">🎯 Sáu bước từ PCL tới phê duyệt — và thiết kế test (PCL) đứng <em>trước</em> khi code.</p>
<p class="nhan">Mục tiêu</p>
<p>Cài đặt unit và xác định chúng có chạy đúng như Detailed Design không.</p>
<p class="nhan">Sáu bước</p>
<ol>
<li><strong>Tạo PCL</strong> — có người khác review (*3: càng nhiều người review → PCL càng đầy đủ).</li>
<li><strong>Chuẩn bị unit test</strong> — môi trường chạy, dữ liệu test, test driver.</li>
<li><strong>Code</strong>.</li>
<li><strong>Test tĩnh</strong> — kiểm code mà không chạy (*4: bắt lỗi bằng test tĩnh giảm công sức về sau).</li>
<li><strong>Test động</strong> — chạy unit (bóng vàng: <strong>mọi bug tìm thấy ở đây đều phải ghi lại</strong>).</li>
<li><strong>Được leader đánh giá và phê duyệt</strong> kết quả unit test.</li>
</ol>
<p class="nhan">Chú thích</p>
<ul>
<li><strong>*1</strong> — nếu chất lượng chưa đạt tiêu chuẩn dự án thì làm lại quy trình.</li>
<li><strong>*2</strong> — làm đúng thì công việc của bạn “được đánh giá cao”.</li>
<li><strong>Dòng cuối</strong> — báo cáo tiến độ hằng ngày.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> thiết kế test (PCL) đứng trước khi code — cùng tinh thần “test trước” của TDD, và nguyên tắc test sớm của ISTQB.</p>`],
      [22, '2-1 Creating PCLs (Japanese)',
        `<p class="y-chinh">🎯 Same content as slide 23, with one extra footnote for presentation-layer units.</p>
${JE(23)}
<p>Footnote *3 (P層プログラムのPCLを作成する場合、画面設計書も参照してください): when you write the PCL of a presentation-layer program, also refer to the <strong>Screen Design</strong> (画面設計書).</p>`,
        `<p class="y-chinh">🎯 Nội dung giống slide 23, thêm một chú thích cho unit lớp presentation.</p>
${JV(23)}
<p>Chú thích *3 (P層プログラムのPCLを作成する場合、画面設計書も参照してください): khi viết PCL cho chương trình lớp presentation, phải xem cả <strong>Screen Design</strong> (画面設計書).</p>`],
      [23, '2-1 Creating PCLs (English)',
        `<p class="y-chinh">🎯 Write one PCL per unit from the Detailed Design, <em>before</em> coding, and have it reviewed.</p>
<p class="nhan">Objective</p>
<p>Define the test cases to be run so the unit can be tested exhaustively.</p>
<p class="nhan">Tasks</p>
<ol>
<li><strong>Create a PCL from the Detailed Design</strong> — <strong>one PCL per unit</strong>, and <strong>always before coding</strong>: “if PCLs are created based on source code after coding, coding errors cannot be detected”. Also use the Testing Concerns (section 3-3) to catch frequent bugs.</li>
<li><strong>Have the PCL reviewed by an expert and by the leader</strong> — a review of a test work product, i.e. static testing of your test design.</li>
</ol>
<p class="nhan">Why “before coding” matters</p>
<p>If you derive the expected result from the code, the code is its own oracle and every bug becomes “expected behaviour”.</p>
<p class="nhan">The picture</p>
<p>Detailed Design + Testing Concerns (+ Screen Design for P units, *3) → programmer → PCL → review meeting.</p>`,
        `<p class="y-chinh">🎯 Mỗi unit một PCL, viết từ Detailed Design, <em>trước</em> khi code, và phải được review.</p>
<p class="nhan">Mục tiêu</p>
<p>Định nghĩa các test case sẽ chạy để test unit một cách vét cạn.</p>
<p class="nhan">Việc cần làm</p>
<ol>
<li><strong>Tạo PCL từ Detailed Design</strong> — <strong>mỗi unit một PCL</strong>, và <strong>luôn trước khi code</strong>: “nếu tạo PCL dựa trên source code sau khi code xong thì không thể phát hiện lỗi code”. Dùng thêm Testing Concerns (mục 3-3) để bắt các lỗi hay gặp.</li>
<li><strong>Cho PCL được chuyên gia và leader review</strong> — tức review một sản phẩm test, là kiểm thử tĩnh cho thiết kế test của bạn.</li>
</ol>
<p class="nhan">Vì sao “trước khi code” quan trọng</p>
<p>Nếu bạn lấy kết quả mong đợi từ code, code trở thành oracle của chính nó và mọi bug đều thành “hành vi mong đợi”.</p>
<p class="nhan">Hình minh hoạ</p>
<p>Detailed Design + Testing Concerns (+ Screen Design với unit P, *3) → lập trình viên → PCL → buổi review.</p>`],
      [24, '2-2 Preparing for unit testing (Japanese)',
        `<p class="y-chinh">🎯 Same content as slide 25; the red label says the project, not the programmer, must provide the tools and environments.</p>
${JE(25)}
<p class="nhan">Red label (visible as a red frame)</p>
<p>開発環境、実行環境、静的解析ツール（ルール作成、修正すべき重要度の閾値設定も含む）、カバレージ計測ツールの準備については、事前にプロジェクトにてご用意願います — “the project must prepare in advance:</p>
<ul>
<li>the development and runtime environments,</li>
<li>the static-analysis tool (including its rules and the severity threshold above which violations must be fixed),</li>
<li>the coverage tool”.</li>
</ul>`,
        `<p class="y-chinh">🎯 Nội dung giống slide 25; nhãn đỏ nói rằng dự án, không phải lập trình viên, phải lo công cụ và môi trường.</p>
${JV(25)}
<p class="nhan">Nhãn đỏ (thấy được khung đỏ)</p>
<p>開発環境、実行環境、静的解析ツール（ルール作成、修正すべき重要度の閾値設定も含む）、カバレージ計測ツールの準備については、事前にプロジェクトにてご用意願います — “dự án phải chuẩn bị trước:</p>
<ul>
<li>môi trường phát triển và môi trường chạy,</li>
<li>công cụ phân tích tĩnh (gồm bộ quy tắc và ngưỡng mức độ nghiêm trọng bắt buộc phải sửa),</li>
<li>công cụ đo coverage”.</li>
</ul>`],
      [25, '2-2 Preparing for unit testing (English)',
        `<p class="y-chinh">🎯 Before running anything: environment, test data, drivers and tools — and prefer real, already-tested submodules to stubs.</p>
<p class="nhan">Tasks</p>
<ol>
<li><strong>Runtime environment</strong> — configuration files, libraries, submodules.</li>
<li><strong>Test data</strong> the PCL needs — database rows, input files.</li>
<li><strong>Test drivers</strong> that call the unit.</li>
<li><strong>Tools</strong> — prepare and learn them (static analysis, coverage).</li>
</ol>
<p class="nhan">The yellow scroll</p>
<p><em>Test driver → call → Software unit being tested → call → Submodule</em>.</p>
<p class="nhan">Footnotes (Hitachi-specific, worth remembering)</p>
<ul>
<li><strong>*1 Real submodules, not stubs</strong> — if the unit calls other units, use the real, already tested submodules. If you had to use stubs, re-test with the real submodules once they exist; therefore develop submodules <em>first</em> (bottom-up). “Real submodules allow more reliable testing than stubs.”</li>
<li><strong>*2 Keep the environment</strong> — keep the unit-test environment after the programming process: bugs found in later levels send you back to unit testing.</li>
</ul>
<p class="meo">🧠 <strong>Remember</strong> (link to SWT2): <strong>driver</strong> = replaces the caller, <strong>stub</strong> = replaces the callee.</p>`,
        `<p class="y-chinh">🎯 Trước khi chạy: môi trường, dữ liệu test, driver và công cụ — và ưu tiên submodule thật đã test thay cho stub.</p>
<p class="nhan">Việc cần làm</p>
<ol>
<li><strong>Môi trường chạy</strong> — file cấu hình, thư viện, submodule.</li>
<li><strong>Dữ liệu test</strong> mà PCL cần — bản ghi DB, file input.</li>
<li><strong>Test driver</strong> để gọi unit.</li>
<li><strong>Công cụ</strong> — chuẩn bị và học cách dùng (phân tích tĩnh, coverage).</li>
</ol>
<p class="nhan">Cuộn giấy vàng</p>
<p><em>Test driver → gọi → Unit đang test → gọi → Submodule</em>.</p>
<p class="nhan">Chú thích (rất riêng của Hitachi, nên nhớ)</p>
<ul>
<li><strong>*1 Submodule thật, không phải stub</strong> — nếu unit gọi unit khác, dùng submodule thật đã được test. Nếu buộc phải dùng stub thì phải test lại với submodule thật khi đã có; vì vậy phát triển submodule <em>trước</em> (bottom-up). “Submodule thật cho kết quả test tin cậy hơn stub.”</li>
<li><strong>*2 Giữ môi trường</strong> — giữ lại môi trường unit test sau quy trình lập trình: bug tìm ra ở các cấp sau sẽ đưa bạn quay lại unit test.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ</strong> (liên hệ SWT2): <strong>driver</strong> = thay cho bên gọi, <strong>stub</strong> = thay cho bên bị gọi.</p>`],
      [26, '2-3 Coding (Japanese)',
        `<p class="y-chinh">🎯 Same as slide 27, plus a red label about coding standards.</p>
${JE(27)}
<ul>
<li><strong>Red label</strong> — コーディング基準については、事前にプロジェクトにてご用意願います: “the project must prepare the coding standards in advance”.</li>
</ul>`,
        `<p class="y-chinh">🎯 Giống slide 27, thêm một nhãn đỏ về coding standard.</p>
${JV(27)}
<ul>
<li><strong>Nhãn đỏ</strong> — コーディング基準については、事前にプロジェクトにてご用意願います: “dự án phải chuẩn bị coding standard từ trước”.</li>
</ul>`],
      [27, '2-3 Coding (English)',
        `<p class="y-chinh">🎯 Code from the Detailed Design <em>and</em> the PCL; if you find missing cases, add them and get the PCL re-reviewed.</p>
<p class="nhan">Objective</p>
<p>Implement the unit.</p>
<p class="nhan">Tasks</p>
<ol>
<li><strong>Write the code from the Detailed Design and the PCL</strong>, following the project's coding standards (the picture: Detailed Design + PCL + Coding standards → programmer → Source code).</li>
<li><strong>Missing test cases?</strong> — if, while coding, you discover that test cases are missing (e.g. a branch condition you overlooked when you wrote the PCL), <strong>add them to the PCL and have it reviewed by the leader again</strong>.</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> the PCL is a living document, but every change goes back through review.</p>`,
        `<p class="y-chinh">🎯 Code theo Detailed Design <em>và</em> PCL; thấy thiếu ca thì bổ sung và cho review PCL lại.</p>
<p class="nhan">Mục tiêu</p>
<p>Cài đặt unit.</p>
<p class="nhan">Việc cần làm</p>
<ol>
<li><strong>Viết code từ Detailed Design và PCL</strong>, tuân thủ coding standard của dự án (hình: Detailed Design + PCL + Coding standard → lập trình viên → Source code).</li>
<li><strong>Thiếu test case?</strong> — nếu trong lúc code bạn phát hiện còn thiếu test case (ví dụ một điều kiện rẽ nhánh bị bỏ sót lúc viết PCL), <strong>bổ sung vào PCL và cho leader review lại</strong>.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> PCL là tài liệu sống, nhưng mọi thay đổi đều phải qua review.</p>`],
      [28, '2-4 Static testing (Japanese)',
        `<p class="y-chinh">🎯 Same as slide 29: the three kinds of static testing.</p>
${JE(29)}
<ul>
<li><strong>机上デバッグ</strong> — desk debugging.</li>
<li><strong>静的解析</strong> — static analysis.</li>
<li><strong>ソースコードレビュー</strong> — source code review.</li>
<li><strong>Footnote *1</strong> — on reducing later work.</li>
</ul>`,
        `<p class="y-chinh">🎯 Giống slide 29: ba kiểu test tĩnh.</p>
${JV(29)}
<ul>
<li><strong>机上デバッグ</strong> — debug trên bàn.</li>
<li><strong>静的解析</strong> — phân tích tĩnh.</li>
<li><strong>ソースコードレビュー</strong> — review source code.</li>
<li><strong>Chú thích *1</strong> — về giảm việc về sau.</li>
</ul>`],
      [29, '2-4 Static Testing (English)',
        `<p class="y-chinh">🎯 Check the code without running it — desk checking, static analysis, code review — before dynamic testing begins.</p>
<p class="nhan">Objectives</p>
<ul>
<li><strong>Fewer bugs reach dynamic testing</strong> — fix errors and coding-standard violations <em>before</em> unit testing (*1: a bug found dynamically costs a debug-and-retest loop).</li>
<li><strong>Readability and maintainability</strong> — qualities dynamic testing cannot see.</li>
</ul>
<p class="nhan">Three tasks</p>
<ol>
<li><strong>Desk checking</strong> — compare your code with the Detailed Design yourself, statement by statement.</li>
<li><strong>Static code analysis</strong> — run the project's tool, fix all high-priority violations and report the result as evidence.</li>
<li><strong>Source code review</strong> — with other programmers, to catch what the first two missed.</li>
</ol>
<p class="nhan">Rule for every task</p>
<p>When you find an error, <strong>look for similar errors</strong> and fix them too.</p>
<p class="ghi-chu">This is Chapter 3 of the course and Lab 1 (review + static analysis) applied to your own unit.</p>`,
        `<p class="y-chinh">🎯 Kiểm code mà không chạy — desk checking, phân tích tĩnh, review code — trước khi bắt đầu test động.</p>
<p class="nhan">Mục tiêu</p>
<ul>
<li><strong>Ít bug lọt tới test động</strong> — sửa lỗi và vi phạm coding standard <em>trước</em> khi unit test (*1: bug tìm bằng test động tốn một vòng debug-và-test-lại).</li>
<li><strong>Dễ đọc và dễ bảo trì</strong> — những thứ test động không nhìn thấy.</li>
</ul>
<p class="nhan">Ba việc</p>
<ol>
<li><strong>Desk checking</strong> — tự đối chiếu code với Detailed Design từng câu lệnh.</li>
<li><strong>Phân tích tĩnh</strong> — chạy công cụ của dự án, sửa mọi vi phạm mức ưu tiên cao và nộp kết quả làm bằng chứng.</li>
<li><strong>Review source code</strong> — cùng lập trình viên khác, để bắt những gì hai bước trước bỏ sót.</li>
</ol>
<p class="nhan">Quy tắc chung</p>
<p>Khi tìm thấy một lỗi, <strong>tìm cả các lỗi tương tự</strong> và sửa luôn.</p>
<p class="ghi-chu">Đây chính là Chương 3 của môn và Lab 1 (review + phân tích tĩnh) áp dụng lên unit của bạn.</p>`],
      [30, '2-5 Dynamic testing (1) (Japanese)',
        `<p class="y-chinh">🎯 Same as slide 31: run the PCL with a coverage tool, date each passed case, record every problem.</p>
${JE(31)}
<p class="nhan">Key words</p>
<ul>
<li><strong>カバレージ計測ツール</strong> — coverage tool.</li>
<li><strong>確認日</strong> — date of verification, written into the PCL.</li>
<li><strong>エビデンス</strong> — evidence.</li>
<li><strong>バグ管理票</strong> — bug management sheet.</li>
</ul>
<p class="ghi-chu">The red-underlined sentences are the same as on slide 31.</p>`,
        `<p class="y-chinh">🎯 Giống slide 31: chạy PCL kèm công cụ coverage, ghi ngày cho ca đạt, ghi lại mọi vấn đề.</p>
${JV(31)}
<p class="nhan">Từ khoá</p>
<ul>
<li><strong>カバレージ計測ツール</strong> — công cụ đo coverage.</li>
<li><strong>確認日</strong> — ngày xác nhận, ghi vào PCL.</li>
<li><strong>エビデンス</strong> — bằng chứng.</li>
<li><strong>バグ管理票</strong> — phiếu quản lý bug.</li>
</ul>
<p class="ghi-chu">Các câu gạch chân đỏ giống slide 31.</p>`],
      [31, '2-5 Dynamic Testing (1) (English)',
        `<p class="y-chinh">🎯 Run every PCL case under a coverage tool; a match gets a date and evidence, a mismatch goes into the Bug List — every time.</p>
<p class="nhan">Objectives</p>
<ul>
<li>Run the unit and verify it behaves as designed.</li>
<li>Detect and correct bugs.</li>
</ul>
<p class="nhan">Tasks</p>
<ol>
<li><strong>Switch on a coverage tool.</strong></li>
<li><strong>Run each PCL case</strong> and compare actual with expected:
<ul>
<li><strong>(a) Equal</strong> → enter the <strong>date of verification</strong> in the PCL and keep the evidence the project asks for (screenshots, output files).</li>
<li><strong>(b) Different</strong> → <u>record the problem in the Bug List</u>, including problems that are not program bugs (a wrong environment setting).</li>
</ul></li>
<li><strong>Debug</strong>, then re-run the related cases. If a revised statement is not exercised by any existing case, add one. After all fixes, statically test the revised statements (desk check, analysis, review) at least once.</li>
</ol>
<p class="nhan">Why record everything</p>
<p>The number of bugs is used to judge unit quality and the sufficiency of testing, so <u>all problems found by running the unit must be recorded</u>. Unrecorded problems mean the leader may order a re-test.</p>
<p class="meo">🧠 <strong>Remember</strong> (ISTQB words): failure → defect report → debugging → <strong>confirmation testing</strong>.</p>`,
        `<p class="y-chinh">🎯 Chạy mọi ca trong PCL kèm công cụ coverage; khớp thì ghi ngày và lưu bằng chứng, lệch thì ghi vào Bug List — lần nào cũng vậy.</p>
<p class="nhan">Mục tiêu</p>
<ul>
<li>Chạy unit và xác nhận nó hoạt động đúng thiết kế.</li>
<li>Phát hiện và sửa bug.</li>
</ul>
<p class="nhan">Việc cần làm</p>
<ol>
<li><strong>Bật công cụ đo coverage.</strong></li>
<li><strong>Chạy từng ca trong PCL</strong> và so thực tế với mong đợi:
<ul>
<li><strong>(a) Khớp</strong> → ghi <strong>ngày xác nhận</strong> vào PCL và lưu bằng chứng dự án yêu cầu (ảnh chụp màn hình, file output).</li>
<li><strong>(b) Lệch</strong> → <u>ghi vấn đề vào Bug List</u>, kể cả vấn đề không phải bug chương trình (cấu hình môi trường sai).</li>
</ul></li>
<li><strong>Debug</strong>, rồi chạy lại các ca liên quan. Nếu câu lệnh vừa sửa chưa được ca nào chạy qua thì thêm ca. Sửa xong hết thì test tĩnh các câu lệnh đã sửa (desk check, phân tích, review) ít nhất một lần.</li>
</ol>
<p class="nhan">Vì sao phải ghi hết</p>
<p>Số bug được dùng để đánh giá chất lượng unit và độ đầy đủ của việc test, nên <u>mọi vấn đề phát hiện khi chạy unit đều phải được ghi</u>. Không ghi thì leader có thể yêu cầu test lại.</p>
<p class="meo">🧠 <strong>Mẹo nhớ</strong> (ngôn ngữ ISTQB): failure → báo cáo defect → debugging → <strong>confirmation testing</strong>.</p>`],
      [32, '2-5 Dynamic testing (2) (Japanese)',
        `<p class="y-chinh">🎯 Same as slide 33: which coverage criterion applies — C0 + C1 for new code, RC0 for modified code.</p>
${JE(33)}
<p>Visible Latin text: C0, C1, RC0. The Japanese reads:</p>
<ul>
<li><strong>(a) 新規開発の場合 C0（命令網羅）と C1（分岐網羅）の両方</strong> — new development: both C0 (statement coverage) and C1 (branch coverage).</li>
<li><strong>(b) 改造開発の場合 RC0（修正網羅）</strong> — modification: RC0 (revised-statement coverage).</li>
</ul>`,
        `<p class="y-chinh">🎯 Giống slide 33: tiêu chí coverage nào áp dụng — C0 + C1 cho code mới, RC0 cho code sửa đổi.</p>
${JV(33)}
<p>Chữ Latin còn thấy: C0, C1, RC0. Phần tiếng Nhật là:</p>
<ul>
<li><strong>(a) 新規開発の場合 C0（命令網羅）と C1（分岐網羅）の両方</strong> — phát triển mới: cả C0 (phủ câu lệnh) và C1 (phủ nhánh).</li>
<li><strong>(b) 改造開発の場合 RC0（修正網羅）</strong> — sửa đổi: RC0 (phủ phần sửa).</li>
</ul>`],
      [33, '2-5 Dynamic Testing (2) (English)',
        `<p class="y-chinh">🎯 Tasks 4–6 of dynamic testing: hunt similar bugs, run a full regression, and reach 100 % coverage.</p>
<ul>
<li><strong>4. Similar-bug check</strong> — “similar processes tend to contain similar bugs”: inspect other units and share each bug with the team; record what you find.</li>
<li><strong>5. Regression testing</strong> — after all fixes, re-run <em>every</em> case of the unit, because debugging can create new bugs (“regression”).</li>
<li><strong>6. Coverage</strong>:
<ul>
<li><strong>New unit</strong> → <strong>C0 (statement)</strong> and <strong>C1 (decision)</strong>.</li>
<li><strong>Modified unit</strong> → <strong>RC0 (revised-statement coverage)</strong>.</li>
</ul></li>
</ul>
<p class="nhan">When coverage is below 100 %</p>
<ul>
<li><strong>Add cases</strong> for the unexecuted statements/branches and re-run.</li>
<li><strong>Conditions impossible to produce</strong> (e.g. a hardware failure) → prove by source-code review that the code is right, and report the reason.</li>
<li>“In principle, 100 % coverage is required for dynamic testing to be considered complete.”</li>
</ul>
<p class="meo">🧠 <strong>Remember</strong> (ISTQB): 100 % decision coverage guarantees 100 % statement coverage, not the other way round (LO-4.3.3).</p>`,
        `<p class="y-chinh">🎯 Việc 4–6 của test động: săn lỗi tương tự, chạy regression toàn bộ, và đạt coverage 100 %.</p>
<ul>
<li><strong>4. Kiểm tra lỗi tương tự</strong> — “các xử lý giống nhau thường chứa lỗi giống nhau”: soi các unit khác và chia sẻ từng bug cho nhóm; ghi lại những gì tìm được.</li>
<li><strong>5. Regression testing</strong> — sửa xong hết thì chạy lại <em>toàn bộ</em> ca của unit, vì debug có thể đẻ ra bug mới (“regression”).</li>
<li><strong>6. Coverage</strong>:
<ul>
<li><strong>Unit mới</strong> → <strong>C0 (câu lệnh)</strong> và <strong>C1 (quyết định)</strong>.</li>
<li><strong>Unit sửa đổi</strong> → <strong>RC0 (phủ câu lệnh đã sửa)</strong>.</li>
</ul></li>
</ul>
<p class="nhan">Khi coverage dưới 100 %</p>
<ul>
<li><strong>Thêm ca</strong> cho câu lệnh/nhánh chưa chạy rồi chạy lại.</li>
<li><strong>Điều kiện không thể tạo ra</strong> (ví dụ hỏng phần cứng) → chứng minh bằng review code rằng code đúng, và báo cáo lý do.</li>
<li>“Về nguyên tắc, phải đạt 100 % coverage thì test động mới được coi là xong.”</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ</strong> (ISTQB): 100 % decision coverage bảo đảm 100 % statement coverage, chiều ngược lại thì không (LO-4.3.3).</p>`],
      [34, '2-5 Evaluating unit testing (Japanese)',
        `<p class="y-chinh">🎯 Same as slide 35: four conditions before the leader looks, then the leader's evaluation.</p>
${JE(35)}
<ul>
<li><strong>Four conditions (a)–(d)</strong> — must hold before the leader's evaluation.</li>
<li><strong>テストケース件数</strong> — number of test cases, evaluated by the leader.</li>
<li><strong>検出されたバグの件数</strong> — number of bugs detected, evaluated by the leader.</li>
</ul>`,
        `<p class="y-chinh">🎯 Giống slide 35: bốn điều kiện trước khi leader xem, rồi leader đánh giá.</p>
${JV(35)}
<ul>
<li><strong>Bốn điều kiện (a)–(d)</strong> — phải thoả trước khi leader đánh giá.</li>
<li><strong>テストケース件数</strong> — số test case, leader đánh giá.</li>
<li><strong>検出されたバグの件数</strong> — số bug phát hiện, leader đánh giá.</li>
</ul>`],
      [35, '2-5 Evaluating unit testing (English)',
        `<p class="y-chinh">🎯 The exit criteria of unit testing: all cases run, all problems resolved, static violations fixed, coverage 100 % — then the leader judges the numbers.</p>
<p class="nhan">Objective</p>
<p>Evaluate the results and verify that unit testing was done properly.</p>
<p class="nhan">(1) Four conditions before the leader looks — the exit criteria</p>
<ul>
<li><strong>(a)</strong> Every PCL case has been run.</li>
<li><strong>(b)</strong> Every problem in the Bug List is resolved.</li>
<li><strong>(c)</strong> Every high-priority static-analysis violation is fixed.</li>
<li><strong>(d)</strong> Coverage is 100 % — C0 and C1 for new units, RC0 for modified units (*1: unreachable statements/branches must be justified and verified by code review).</li>
</ul>
<p class="nhan">(2) The leader's evaluation</p>
<ul>
<li><strong>Report</strong> to the leader in the project format.</li>
<li><strong>Numbers</strong> — the leader evaluates the <strong>number of test cases and of bugs</strong> against the project criteria (the densities of slide 5).</li>
<li><strong>Off the criteria?</strong> — you explain why; if the leader wants more testing, you add cases and test again.</li>
</ul>
<p class="ghi-chu">Exam link: LO-5.2.3 — exit criteria typically include coverage, number of unresolved defects and completed tests.</p>`,
        `<p class="y-chinh">🎯 Tiêu chí kết thúc unit test: chạy hết ca, giải quyết hết vấn đề, sửa hết vi phạm tĩnh, coverage 100 % — rồi leader xét các con số.</p>
<p class="nhan">Mục tiêu</p>
<p>Đánh giá kết quả và xác nhận việc unit test đã làm đúng.</p>
<p class="nhan">(1) Bốn điều kiện trước khi leader xem — exit criteria</p>
<ul>
<li><strong>(a)</strong> Đã chạy mọi ca trong PCL.</li>
<li><strong>(b)</strong> Mọi vấn đề trong Bug List đã được giải quyết.</li>
<li><strong>(c)</strong> Mọi vi phạm phân tích tĩnh mức cao đã được sửa.</li>
<li><strong>(d)</strong> Coverage 100 % — C0 và C1 với unit mới, RC0 với unit sửa đổi (*1: câu lệnh/nhánh không thể chạy tới phải được giải trình và xác nhận bằng review code).</li>
</ul>
<p class="nhan">(2) Leader đánh giá</p>
<ul>
<li><strong>Báo cáo</strong> leader theo mẫu dự án.</li>
<li><strong>Con số</strong> — leader đánh giá <strong>số test case và số bug</strong> so với tiêu chuẩn dự án (các mật độ ở slide 5).</li>
<li><strong>Lệch tiêu chuẩn?</strong> — bạn giải thích lý do; nếu leader muốn test thêm, bạn bổ sung ca và test lại.</li>
</ul>
<p class="ghi-chu">Liên hệ đề thi: LO-5.2.3 — exit criteria thường gồm coverage, số defect chưa giải quyết và số test đã hoàn thành.</p>`],
    ]),
    bi(`<h3>Ví dụ có lời giải · Worked example — which step of the programming process?</h3>
<p>Put each event of a real week on the right step (numbers as on slide 21) and say what the guide requires.</p>
<div class="table-wrap"><table>
<thead><tr><th>#</th><th>Event</th><th>Step · rule</th></tr></thead>
<tbody>
<tr><td>1</td><td>Monday: you read the DD of <code>updateStatus</code> and write 9 UTCID columns.</td><td>1 Create PCL · before coding, reviewed by expert + leader</td></tr>
<tr><td>2</td><td>You insert 3 rows into a test schema and write a <code>main</code>/JUnit class that calls the method.</td><td>2 Prepare · test data + test driver</td></tr>
<tr><td>3</td><td>While coding you notice the DD has a branch “status = 9” you forgot in the PCL.</td><td>3 Code · add the case to the PCL, re-review with the leader</td></tr>
<tr><td>4</td><td>SonarLint flags an unclosed <code>ResultSet</code>.</td><td>4 Static testing · fix, look for similar leaks, report evidence</td></tr>
<tr><td>5</td><td>UTCID04 fails: the method returns 1 instead of 0.</td><td>5 Dynamic testing · record in the Bug List, debug, re-run related cases</td></tr>
<tr><td>6</td><td>After the fix you re-run all 10 cases; JaCoCo shows 100 % lines, 95 % branches.</td><td>5 Dynamic · regression done, but C1 &lt; 100 % → add a case</td></tr>
<tr><td>7</td><td>Coverage 100 %, 0 open bugs, 0 high-priority violations: you send the report.</td><td>6 Evaluation · exit criteria (a)–(d) met, leader judges counts</td></tr>
</tbody></table></div>
<div class="pitfall co-tieu-de"><strong>“Component testing” means two different things.</strong> In ISTQB and in the lab title, <em>component testing</em> = unit testing (one method/class, by developers, with drivers and stubs). In Hitachi's process, <em>Software Component Testing</em> (組合せテスト) is the <em>next</em> level, where units are combined. If an exam question says “component testing”, use the ISTQB meaning.</div>
<div class="callout"><p><span class="badge">★ Beyond the syllabus</span> <strong>Real submodules or stubs? “Classicist” vs “mockist”.</strong></p>
<p>Slide 25 prefers already-tested real submodules over stubs. Martin Fowler's essay <em>Mocks Aren't Stubs</em> names the two schools:</p>
<ul>
<li><strong>Classicists</strong> — test a unit together with its real collaborators when these are cheap and deterministic. Their tests break less when you refactor.</li>
<li><strong>Mockists</strong> — replace every collaborator with a mock (Mockito in Java) and verify the interactions. Their tests pinpoint failures and run without a database.</li>
</ul>
<p>Hitachi's rule is classicist, with stubs only as a temporary measure.</p>
<p class="ghi-chu">Outside the syllabus because CTFL only defines stubs and drivers, not the design styles built on them.</p></div>`,
    `<h3>Ví dụ có lời giải · Việc này thuộc bước nào của quy trình lập trình?</h3>
<p>Xếp từng sự kiện trong một tuần làm việc thật vào đúng bước (đánh số như slide 21) và nêu yêu cầu của bộ hướng dẫn.</p>
<div class="table-wrap"><table>
<thead><tr><th>#</th><th>Sự kiện</th><th>Bước · quy tắc</th></tr></thead>
<tbody>
<tr><td>1</td><td>Thứ Hai: bạn đọc DD của <code>updateStatus</code> và viết 9 cột UTCID.</td><td>1 Tạo PCL · trước khi code, được chuyên gia + leader review</td></tr>
<tr><td>2</td><td>Bạn chèn 3 dòng vào schema test và viết một lớp <code>main</code>/JUnit để gọi method.</td><td>2 Chuẩn bị · dữ liệu test + test driver</td></tr>
<tr><td>3</td><td>Đang code thì thấy DD có nhánh “status = 9” mà PCL quên mất.</td><td>3 Code · thêm ca vào PCL, cho leader review lại</td></tr>
<tr><td>4</td><td>SonarLint báo một <code>ResultSet</code> không được đóng.</td><td>4 Test tĩnh · sửa, tìm các chỗ rò rỉ tương tự, nộp bằng chứng</td></tr>
<tr><td>5</td><td>UTCID04 fail: method trả về 1 thay vì 0.</td><td>5 Test động · ghi vào Bug List, debug, chạy lại các ca liên quan</td></tr>
<tr><td>6</td><td>Sửa xong bạn chạy lại cả 10 ca; JaCoCo báo 100 % dòng, 95 % nhánh.</td><td>5 Test động · đã regression, nhưng C1 &lt; 100 % → thêm ca</td></tr>
<tr><td>7</td><td>Coverage 100 %, 0 bug mở, 0 vi phạm mức cao: bạn gửi báo cáo.</td><td>6 Đánh giá · đạt exit criteria (a)–(d), leader xét các con số</td></tr>
</tbody></table></div>
<div class="pitfall co-tieu-de"><strong>“Component testing” mang hai nghĩa.</strong> Trong ISTQB và trong tên lab, <em>component testing</em> = unit test (một method/class, do developer làm, dùng driver và stub). Trong quy trình Hitachi, <em>Software Component Testing</em> (組合せテスト) là cấp <em>kế tiếp</em>, nơi các unit được ghép lại. Câu hỏi thi nói “component testing” thì dùng nghĩa của ISTQB.</div>
<div class="callout"><p><span class="badge">★ Ngoài giáo trình</span> <strong>Submodule thật hay stub? “Classicist” và “mockist”.</strong></p>
<p>Slide 25 ưu tiên submodule thật đã test hơn stub. Bài viết <em>Mocks Aren't Stubs</em> của Martin Fowler gọi tên hai trường phái:</p>
<ul>
<li><strong>Classicist</strong> — test unit cùng các cộng tác viên thật khi chúng rẻ và ổn định. Test kiểu này ít gãy khi refactor.</li>
<li><strong>Mockist</strong> — thay mọi cộng tác viên bằng mock (Mockito trong Java) và kiểm các lời gọi qua lại. Test kiểu này chỉ đúng chỗ hỏng và chạy được không cần database.</li>
</ul>
<p>Quy tắc của Hitachi là classicist, stub chỉ là giải pháp tạm.</p>
<p class="ghi-chu">Ngoài giáo trình vì CTFL chỉ định nghĩa stub và driver, không bàn các phong cách thiết kế test dựa trên chúng.</p></div>`),
    books([
      ['sp5', '§3.4.1 “Component Testing” (test drivers, stubs) — PDF pp.87–93; §2.3 test process activities', '§3.4.1 “Component Testing” (test driver, stub) — PDF 87–93; §2.3 các hoạt động của quy trình test'],
      ['fst', '§2.2 “Test levels”, component testing — p.41 (PDF p.44)', '§2.2 “Test levels”, component testing — trang 41 (PDF 44)'],
      ['fst4', 'Ch.5 §2 “Test planning and estimation”, entry and exit criteria — book pp.161–175', 'Chương 5 §2 “Test planning and estimation”, entry/exit criteria — trang sách 161–175'],
      ['junit', 'Ch.7 “Coarse-grained testing with stubs” PDF p.127 and Ch.8 “Testing with mock objects” PDF p.143', 'Chương 7 “Coarse-grained testing with stubs” PDF 127 và Chương 8 “Testing with mock objects” PDF 143'],
    ]),
  ].join('\n'),
};

/* ───────────── L2.3 Guide slides 36–67: PCL format, test-case rules, points to note ───────────── */
const L23 = {
  title: 'L2.3 — Unit-testing guide (2): the matrix PCL and deriving test cases|||L2.3 — Hướng dẫn unit test (2): PCL ma trận và cách rút test case',
  slug: 'swt301-lab2-guide-pcl-rules',
  type: 'VIDEO',
  description: 'Slide 36–67: định dạng PCL ma trận (mỗi cột một test case, N/E/L/I), điều kiện vào & kết quả mong đợi, 15 + 10 testing concern, 4 bước rút test case (ca cơ sở, đổi một điều kiện, điều kiện phụ thuộc, điều kiện ghép), và 6 điểm lưu ý: submodule, file cấu hình, SQL, danh sách 0/1/nhiều, JavaScript, kiểm tra phía server.',
  content: [
    bi(`<span class="eyebrow">Lab 2 · Lesson L2.3 · A Guide for Unit Testing slides 36–67</span>
<h2>The matrix PCL and the rules for deriving test cases</h2>
<p class="lead">Chapter 3 shows what a PCL looks like — a matrix in which every <strong>row</strong> is an input condition or an expected result and every <strong>column</strong> is one test case — and gives a four-step recipe that reaches 100 % statement and decision coverage without redundant cases. Chapter 4 adds six situations in which programmers typically forget cases.</p>
<div class="callout"><p><strong>Learning objectives</strong></p>
<ul>
<li>Read and write a matrix PCL (conditions × test cases, specific values, category letters)</li>
<li>Derive test cases with the “basic case + change one condition” rule and explain why changing two conditions at once hides statements (LO-4.3.1/4.3.2, K2)</li>
<li>Explain why 100 % decision coverage does not test every sub-condition of <code>a &amp;&amp; b</code></li>
<li>Apply boundary values to branch conditions (LO-4.2.2, K3)</li>
<li>List the testing concerns for submodules, configuration files, SQL, lists, client-side code and server-side validation</li>
</ul></div>
<h3>The four-step recipe (slides 46–53)</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Step 1</div><div class="lz-t">Basic case</div><div class="lz-d">all inputs typical, normal result</div></div>
  <div class="lz-step"><div class="lz-k">Step 2</div><div class="lz-t">Change ONE condition</div><div class="lz-d">each new case differs from the basic case in one input</div></div>
  <div class="lz-step"><div class="lz-k">Step 3</div><div class="lz-t">Dependent conditions</div><div class="lz-d">change only the inputs a nested branch depends on</div></div>
  <div class="lz-step"><div class="lz-k">Step 4</div><div class="lz-t">Compound conditions</div><div class="lz-d">check every sub-condition of a &amp;&amp; b, not just the decision</div></div>
</div>`,
    `<span class="eyebrow">Lab 2 · Bài L2.3 · A Guide for Unit Testing slide 36–67</span>
<h2>PCL dạng ma trận và các quy tắc rút test case</h2>
<p class="lead">Chương 3 cho thấy hình dạng của PCL — một ma trận trong đó mỗi <strong>dòng</strong> là một điều kiện đầu vào hoặc một kết quả mong đợi, mỗi <strong>cột</strong> là một test case — và đưa ra công thức 4 bước để đạt 100 % phủ câu lệnh và phủ quyết định mà không thừa ca nào. Chương 4 bổ sung sáu tình huống lập trình viên hay quên ca test.</p>
<div class="callout"><p><strong>Chuẩn đầu ra</strong></p>
<ul>
<li>Đọc và viết PCL ma trận (điều kiện × test case, giá trị cụ thể, chữ phân loại)</li>
<li>Rút test case theo quy tắc “ca cơ sở + đổi một điều kiện” và giải thích vì sao đổi hai điều kiện một lúc làm sót câu lệnh (LO-4.3.1/4.3.2, K2)</li>
<li>Giải thích vì sao 100 % decision coverage chưa test hết từng điều kiện con của <code>a &amp;&amp; b</code></li>
<li>Áp dụng giá trị biên cho điều kiện rẽ nhánh (LO-4.2.2, K3)</li>
<li>Kể được các testing concern cho submodule, file cấu hình, SQL, danh sách, code phía client và kiểm tra phía server</li>
</ul></div>
<h3>Công thức 4 bước (slide 46–53)</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Bước 1</div><div class="lz-t">Ca cơ sở</div><div class="lz-d">mọi đầu vào ở giá trị điển hình, kết quả bình thường</div></div>
  <div class="lz-step"><div class="lz-k">Bước 2</div><div class="lz-t">Đổi MỘT điều kiện</div><div class="lz-d">mỗi ca mới chỉ khác ca cơ sở ở một đầu vào</div></div>
  <div class="lz-step"><div class="lz-k">Bước 3</div><div class="lz-t">Điều kiện phụ thuộc</div><div class="lz-d">chỉ đổi các đầu vào mà nhánh lồng bên trong phụ thuộc</div></div>
  <div class="lz-step"><div class="lz-k">Bước 4</div><div class="lz-t">Điều kiện ghép</div><div class="lz-d">kiểm từng điều kiện con của a &amp;&amp; b, không chỉ kết quả chung</div></div>
</div>`),
    walkHead(G, 36, 67, 'Japanese pages keep the Japanese labels of the matrix (テストケースID, 入力条件, 確認内容 …); they are translated where they appear.', 'Các trang tiếng Nhật giữ nhãn tiếng Nhật trong ma trận (テストケースID, 入力条件, 確認内容 …); chúng được dịch ngay tại chỗ.'),
    walk(G, [
      [36, 'Section 3 divider (Japanese)',
        `<p class="y-chinh">🎯 Divider: “3. PCLの作成方法” — “3. How to create PCLs”.</p>
${JE(37)}`,
        `<p class="y-chinh">🎯 Trang ngăn chương: “3. PCLの作成方法” — “3. Cách tạo PCL”.</p>
${JV(37)}`],
      [37, 'Section 3: Creating PCLs',
        `<p class="y-chinh">🎯 Chapter 3 teaches how to build a PCL, in four parts.</p>
<ol>
<li><strong>3-1</strong> — the PCL format</li>
<li><strong>3-2</strong> — input conditions and expected results</li>
<li><strong>3-3</strong> — testing concerns</li>
<li><strong>3-4</strong> — creating test cases</li>
</ol>`,
        `<p class="y-chinh">🎯 Chương 3 dạy cách dựng một PCL, gồm bốn phần.</p>
<ol>
<li><strong>3-1</strong> — định dạng PCL</li>
<li><strong>3-2</strong> — điều kiện đầu vào và kết quả mong đợi</li>
<li><strong>3-3</strong> — testing concern</li>
<li><strong>3-4</strong> — tạo test case</li>
</ol>`],
      [38, '3-1 PCL format (Japanese matrix)',
        `<p class="y-chinh">🎯 The same matrix as slide 39, with Japanese labels — learn them, the customer's files use them.</p>
${JE(39)}
<p class="nhan">Row and column labels</p>
<ul>
<li><strong>テストケースID</strong> — test case ID</li>
<li><strong>テストケース説明</strong> — description</li>
<li><strong>入力条件 / 確認内容</strong> — input conditions / expected results (literally “items to confirm”)</li>
<li><strong>【引数a】</strong> — parameter a; <strong>代表値</strong> — typical value; <strong>処理A境界値</strong> — boundary for statements A</li>
<li><strong>戻り値</strong> — return value; <strong>例外</strong> — exception</li>
<li><strong>チェック観点ID</strong> — testing-concern ID; <strong>CL区分</strong> — checklist category</li>
</ul>
<p class="nhan">Description row</p>
<ul>
<li><strong>基本ケース</strong> — basic case</li>
<li><strong>aの境界値</strong> — boundary of a</li>
<li><strong>bの境界値</strong> — boundary of b</li>
</ul>
<p class="nhan">Legend of categories</p>
<ul>
<li><strong>N 正常系</strong> — normal</li>
<li><strong>E 異常系</strong> — error</li>
<li><strong>L 境界値</strong> — boundary</li>
<li><strong>I インタフェース</strong> — interface</li>
</ul>
<p class="ghi-chu">Red label: “this guide recommends the matrix checklist for F/D-layer tests; if you use another format, the project must provide it”.</p>`,
        `<p class="y-chinh">🎯 Cùng ma trận như slide 39 nhưng nhãn tiếng Nhật — nên thuộc, vì file của khách hàng dùng đúng các nhãn này.</p>
${JV(39)}
<p class="nhan">Nhãn dòng và cột</p>
<ul>
<li><strong>テストケースID</strong> — mã test case</li>
<li><strong>テストケース説明</strong> — mô tả</li>
<li><strong>入力条件 / 確認内容</strong> — điều kiện đầu vào / kết quả mong đợi (nghĩa đen “nội dung cần xác nhận”)</li>
<li><strong>【引数a】</strong> — tham số a; <strong>代表値</strong> — giá trị điển hình; <strong>処理A境界値</strong> — biên để vào xử lý A</li>
<li><strong>戻り値</strong> — giá trị trả về; <strong>例外</strong> — exception</li>
<li><strong>チェック観点ID</strong> — mã testing concern; <strong>CL区分</strong> — phân loại checklist</li>
</ul>
<p class="nhan">Dòng mô tả</p>
<ul>
<li><strong>基本ケース</strong> — ca cơ sở</li>
<li><strong>aの境界値</strong> — biên của a</li>
<li><strong>bの境界値</strong> — biên của b</li>
</ul>
<p class="nhan">Chú giải phân loại</p>
<ul>
<li><strong>N 正常系</strong> — bình thường</li>
<li><strong>E 異常系</strong> — lỗi</li>
<li><strong>L 境界値</strong> — biên</li>
<li><strong>I インタフェース</strong> — giao diện</li>
</ul>
<p class="ghi-chu">Nhãn đỏ: “bộ hướng dẫn khuyến nghị dùng checklist ma trận cho test lớp F/D; nếu dùng dạng khác thì dự án phải tự cung cấp”.</p>`],
      [39, '3-1 PCL format (English matrix)',
        `<p class="y-chinh">🎯 The most important picture of Lab 2: each column is one test case, each row is one specific value — your template (L2.8) is the same idea.</p>
<p class="nhan">How to read the matrix</p>
<ul>
<li><strong>Column = test case</strong> — ID on top (0001-01-0010 … 0050), a short description of its testing concern, an “o” on every input row it uses and on the expected-result row(s) it must produce, and its category at the bottom.</li>
<li><strong>Row = one specific value</strong> — an input condition or an expected result.</li>
</ul>
<p class="nhan">The five columns</p>
<div class="table-wrap"><table><thead><tr><th>ID</th><th>Concern</th><th>a</th><th>b</th><th>Expected</th><th>Category</th></tr></thead><tbody>
<tr><td>0010</td><td>basic case</td><td>5 (typical)</td><td>10 (typical)</td><td>return 2</td><td>N</td></tr>
<tr><td>0020</td><td>boundary a</td><td>1 (lowest value into A)</td><td>10</td><td>return 10</td><td>N L</td></tr>
<tr><td>0030</td><td>boundary a</td><td>0 (goes to B)</td><td>10</td><td>IllegalArgumentException</td><td>E L</td></tr>
<tr><td>0040</td><td>boundary b</td><td>5</td><td>0 (lowest into C)</td><td>return 0</td><td>N L</td></tr>
<tr><td>0050</td><td>boundary b</td><td>5</td><td>−1 (goes to D)</td><td>IllegalArgumentException</td><td>E L</td></tr>
</tbody></table></div>
<p>The values fit the function <em>b ÷ a</em> with a &gt; 0 and b ≥ 0 required — it is re-created and run in the worked example below.</p>
<p class="nhan">The four callouts on the slide</p>
<ol>
<li><strong>Unique ID</strong> — give every case its own ID.</li>
<li><strong>Specific values</strong> — list real values, never “a positive number”.</li>
<li><strong>Concern</strong> — describe the testing concern briefly.</li>
<li><strong>Category</strong> — mark N, E, L, I; several letters may combine, e.g. NL.</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> the matrix makes gaps visible — an input row with no “o”, or two columns with identical “o” patterns, jumps out.</p>`,
        `<p class="y-chinh">🎯 Hình quan trọng nhất của Lab 2: mỗi cột là một test case, mỗi dòng là một giá trị cụ thể — template của bạn (bài L2.8) dùng đúng ý này.</p>
<p class="nhan">Cách đọc ma trận</p>
<ul>
<li><strong>Cột = test case</strong> — mã ở trên (0001-01-0010 … 0050), mô tả ngắn testing concern, dấu “o” ở mọi dòng đầu vào nó dùng và ở (các) dòng kết quả mong đợi nó phải cho ra, và phân loại ở dưới cùng.</li>
<li><strong>Dòng = một giá trị cụ thể</strong> — một điều kiện đầu vào hoặc một kết quả mong đợi.</li>
</ul>
<p class="nhan">Đọc năm cột</p>
<div class="table-wrap"><table><thead><tr><th>ID</th><th>Concern</th><th>a</th><th>b</th><th>Mong đợi</th><th>Loại</th></tr></thead><tbody>
<tr><td>0010</td><td>ca cơ sở</td><td>5 (điển hình)</td><td>10 (điển hình)</td><td>trả về 2</td><td>N</td></tr>
<tr><td>0020</td><td>biên a</td><td>1 (giá trị nhỏ nhất vào A)</td><td>10</td><td>trả về 10</td><td>N L</td></tr>
<tr><td>0030</td><td>biên a</td><td>0 (rẽ sang B)</td><td>10</td><td>IllegalArgumentException</td><td>E L</td></tr>
<tr><td>0040</td><td>biên b</td><td>5</td><td>0 (nhỏ nhất vào C)</td><td>trả về 0</td><td>N L</td></tr>
<tr><td>0050</td><td>biên b</td><td>5</td><td>−1 (rẽ sang D)</td><td>IllegalArgumentException</td><td>E L</td></tr>
</tbody></table></div>
<p>Các giá trị khớp với hàm <em>b ÷ a</em> yêu cầu a &gt; 0 và b ≥ 0 — hàm này được dựng lại và chạy thật trong ví dụ có lời giải bên dưới.</p>
<p class="nhan">Bốn chú thích trên slide</p>
<ol>
<li><strong>Mã duy nhất</strong> — mỗi ca một mã riêng.</li>
<li><strong>Giá trị cụ thể</strong> — ghi giá trị thật, không bao giờ ghi “một số dương”.</li>
<li><strong>Concern</strong> — mô tả testing concern ngắn gọn.</li>
<li><strong>Phân loại</strong> — ghi N, E, L, I; có thể ghép nhiều chữ, ví dụ NL.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> ma trận làm lộ lỗ hổng — một dòng đầu vào không có “o”, hay hai cột có mẫu “o” giống hệt nhau, nhìn là thấy ngay.</p>`],
      [40, '3-2 Input conditions and expected results (Japanese)',
        `<p class="y-chinh">🎯 Same rules as slide 41 — the explanation is there.</p>
${JE(41)}
<p class="ghi-chu">The Japanese list numbers the input items (1)(2)(2)(3)(4) — a typo in the original; the English twin correctly has five items (1)–(5).</p>`,
        `<p class="y-chinh">🎯 Quy tắc giống slide 41 — phần giải thích nằm ở đó.</p>
${JV(41)}
<p class="ghi-chu">Danh sách tiếng Nhật đánh số các mục đầu vào là (1)(2)(2)(3)(4) — lỗi đánh máy của bản gốc; bản tiếng Anh đánh đúng năm mục (1)–(5).</p>`],
      [41, '3-2 Input conditions and expected results (English)',
        `<p class="y-chinh">🎯 Design from the internal logic, but write inputs and expected results only as things that can be set or observed from outside the unit.</p>
<p class="nhan">The rule</p>
<ul>
<li><strong>Input</strong> = the state <u>before</u> execution.</li>
<li><strong>Expected result</strong> = the state <u>after</u> execution.</li>
<li><strong>Never</strong> write a condition on a local variable or on a state in the middle of execution.</li>
<li><strong>No debugger tricks (*1)</strong> — never change variables with a debugger during a test run; if a case truly cannot run without one, get the leader's approval.</li>
</ul>
<p class="nhan">Inputs — 5 kinds</p>
<ol>
<li>Input parameters</li>
<li>Input items on the screen</li>
<li>Database content</li>
<li>Input files</li>
<li>Configuration files</li>
</ol>
<p class="nhan">Expected results — 5 kinds</p>
<ol>
<li>Output values</li>
<li>Output items on the screen</li>
<li><strong>Thrown exceptions and error codes</strong></li>
<li>Database content</li>
<li>Output files (including printed business forms)</li>
</ol>
<p>This is why the template has rows for Precondition (DB/file state) and for Exception and Log message — not just parameters and return value. To list them, use the Testing Concerns on the next pages (slide 43).</p>`,
        `<p class="y-chinh">🎯 Thiết kế dựa trên logic bên trong, nhưng ghi đầu vào và kết quả mong đợi chỉ bằng những thứ đặt được hoặc quan sát được từ bên ngoài unit.</p>
<p class="nhan">Quy tắc</p>
<ul>
<li><strong>Đầu vào</strong> = trạng thái <u>trước</u> khi chạy.</li>
<li><strong>Kết quả mong đợi</strong> = trạng thái <u>sau</u> khi chạy.</li>
<li><strong>Không bao giờ</strong> ghi điều kiện trên biến cục bộ hay trạng thái giữa chừng.</li>
<li><strong>Không dùng debugger (*1)</strong> — không dùng debugger đổi giá trị biến khi đang chạy test; nếu một ca thật sự không chạy được nếu thiếu debugger thì phải xin phép leader.</li>
</ul>
<p class="nhan">Đầu vào — 5 loại</p>
<ol>
<li>Tham số đầu vào</li>
<li>Mục nhập trên màn hình</li>
<li>Nội dung database</li>
<li>File input</li>
<li>File cấu hình</li>
</ol>
<p class="nhan">Kết quả mong đợi — 5 loại</p>
<ol>
<li>Giá trị output</li>
<li>Mục hiển thị trên màn hình</li>
<li><strong>Exception và mã lỗi được ném ra</strong></li>
<li>Nội dung database</li>
<li>File output (kể cả biểu mẫu in)</li>
</ol>
<p>Vì vậy template có dòng Precondition (trạng thái DB/file) và dòng Exception, Log message — không chỉ tham số và giá trị trả về. Để liệt kê chúng, dùng Testing Concerns ở các trang sau (slide 43).</p>`],
      [42, '3-3 Testing concerns (Japanese)',
        `<p class="y-chinh">🎯 The same 15-row table as slide 43 — 分類 category, 観点 concern, 確認 check.</p>
${JE(43)}
<p class="nhan">Category names in Japanese</p>
<ul>
<li><strong>全体</strong> — generic</li>
<li><strong>分岐条件</strong> — branch conditions</li>
<li><strong>ループ条件</strong> — loop conditions</li>
<li><strong>入出力値</strong> — input/output values</li>
<li><strong>サブモジュール呼出</strong> — calling submodules</li>
<li><strong>エラー処理</strong> — error handling</li>
<li><strong>SQL</strong> — SQL</li>
<li><strong>日付</strong> — dates</li>
<li><strong>設定ファイル</strong> — configuration file</li>
<li><strong>帳票出力</strong> — business-form output</li>
</ul>
<p class="ghi-chu">Red label: “customise for your project; the concerns to consult are available on the <em>Quality Management Guideline – Application edition</em> website” (Hitachi internal).</p>`,
        `<p class="y-chinh">🎯 Cùng bảng 15 dòng như slide 43 — 分類 nhóm, 観点 quan điểm, 確認 cột đánh dấu.</p>
${JV(43)}
<p class="nhan">Tên nhóm tiếng Nhật</p>
<ul>
<li><strong>全体</strong> — chung</li>
<li><strong>分岐条件</strong> — điều kiện rẽ nhánh</li>
<li><strong>ループ条件</strong> — điều kiện vòng lặp</li>
<li><strong>入出力値</strong> — giá trị vào/ra</li>
<li><strong>サブモジュール呼出</strong> — gọi submodule</li>
<li><strong>エラー処理</strong> — xử lý lỗi</li>
<li><strong>SQL</strong> — SQL</li>
<li><strong>日付</strong> — ngày tháng</li>
<li><strong>設定ファイル</strong> — file cấu hình</li>
<li><strong>帳票出力</strong> — xuất biểu mẫu</li>
</ul>
<p class="ghi-chu">Nhãn đỏ: “tuỳ biến theo dự án; bộ quan điểm tham khảo lấy trên website <em>Quality Management Guideline – Application edition</em>” (nội bộ Hitachi).</p>`],
      [43, '3-3 Testing concerns for unit testing (English)',
        `<p class="y-chinh">🎯 Fifteen concerns — a checklist to run over your PCL before review.</p>
<ol class="hai-cot">
<li><strong>Generic</strong> — C0 = 100 %.</li>
<li><strong>Generic</strong> — C1 = 100 %.</li>
<li><strong>Generic</strong> — RC0 = 100 % for modifications.</li>
<li><strong>Branch conditions</strong> — numeric conditions need boundary values, not only typical ones.</li>
<li><strong>Branch conditions</strong> — multiple sub-conditions → check each one, not only the decision.</li>
<li><strong>Loops</strong> — check the end-of-loop condition and the number of iterations through the output.</li>
<li><strong>Input/output</strong> — special values: max, min, limit, zero, negative, null, illegal format.</li>
<li><strong>Input/output</strong> — lists → 0, 1 and many elements.</li>
<li><strong>Submodules</strong> — normal return values and every exception the unit handles.</li>
<li><strong>Error handling</strong> — check the exception class and error code.</li>
<li><strong>SQL</strong> — SQL injection countermeasures when the unit builds SQL.</li>
<li><strong>Dates</strong> — 29 February, daylight-saving switch days.</li>
<li><strong>Dates</strong> — time spans over 24 hours.</li>
<li><strong>Configuration files</strong> — file missing, key or value missing.</li>
<li><strong>Business forms</strong> — correct page breaks.</li>
</ol>
<p class="ghi-chu">The picture is cut after row 14; row 15 is in the file.</p>
<p class="nhan">Which chapter each concern comes from</p>
<ul>
<li><strong>4, 7, 8</strong> — EP/BVA (Chapter 4).</li>
<li><strong>1, 2, 5</strong> — white-box coverage.</li>
<li><strong>The rest</strong> — checklist-based testing (LO-4.4.3).</li>
</ul>`,
        `<p class="y-chinh">🎯 Mười lăm quan điểm — một checklist để rà PCL trước khi review.</p>
<ol class="hai-cot">
<li><strong>Chung</strong> — C0 = 100 %.</li>
<li><strong>Chung</strong> — C1 = 100 %.</li>
<li><strong>Chung</strong> — RC0 = 100 % khi sửa đổi.</li>
<li><strong>Điều kiện rẽ nhánh</strong> — điều kiện số phải thử giá trị biên, không chỉ giá trị điển hình.</li>
<li><strong>Điều kiện rẽ nhánh</strong> — nhiều điều kiện con → kiểm từng cái, không chỉ kết quả chung.</li>
<li><strong>Vòng lặp</strong> — kiểm điều kiện kết thúc vòng lặp và số lần lặp qua output.</li>
<li><strong>Vào/ra</strong> — giá trị đặc biệt: max, min, giới hạn, 0, số âm, null, sai định dạng.</li>
<li><strong>Vào/ra</strong> — danh sách → 0, 1 và nhiều phần tử.</li>
<li><strong>Submodule</strong> — giá trị trả về bình thường và mọi exception unit có xử lý.</li>
<li><strong>Xử lý lỗi</strong> — kiểm lớp exception và mã lỗi.</li>
<li><strong>SQL</strong> — biện pháp chống SQL injection khi unit tự dựng câu SQL.</li>
<li><strong>Ngày</strong> — 29/2, ngày chuyển giờ mùa hè.</li>
<li><strong>Ngày</strong> — khoảng thời gian trên 24 giờ.</li>
<li><strong>File cấu hình</strong> — thiếu file, thiếu khoá hay giá trị.</li>
<li><strong>Biểu mẫu</strong> — ngắt trang đúng.</li>
</ol>
<p class="ghi-chu">Hình bị cắt sau dòng 14; dòng 15 có trong file.</p>
<p class="nhan">Mỗi quan điểm đến từ chương nào</p>
<ul>
<li><strong>4, 7, 8</strong> — EP/BVA (Chương 4).</li>
<li><strong>1, 2, 5</strong> — coverage white-box.</li>
<li><strong>Phần còn lại</strong> — checklist-based testing (LO-4.4.3).</li>
</ul>`],
      [44, '3-3 Testing concerns — presentation layer (Japanese)',
        `<p class="y-chinh">🎯 Same ten rows as slide 45 — the extra concerns for presentation-layer units.</p>
${JE(45)}
<p class="nhan">Category names in Japanese</p>
<ul>
<li><strong>画面設計</strong> — screen design</li>
<li><strong>境界値・限界値</strong> — boundary/limit values</li>
<li><strong>文字エンコーディング</strong> — character encoding</li>
<li><strong>入力チェック</strong> — input check</li>
<li><strong>クライアントサイドプログラム</strong> — client-side programs</li>
<li><strong>セキュリティ</strong> — security</li>
</ul>
<p class="ghi-chu">Only “PCL”, “HTML” and “Cookie” survived in the picture.</p>`,
        `<p class="y-chinh">🎯 Mười dòng giống slide 45 — các quan điểm thêm cho unit lớp presentation.</p>
${JV(45)}
<p class="nhan">Tên nhóm tiếng Nhật</p>
<ul>
<li><strong>画面設計</strong> — thiết kế màn hình</li>
<li><strong>境界値・限界値</strong> — giá trị biên/giới hạn</li>
<li><strong>文字エンコーディング</strong> — mã hoá ký tự</li>
<li><strong>入力チェック</strong> — kiểm tra đầu vào</li>
<li><strong>クライアントサイドプログラム</strong> — chương trình phía client</li>
<li><strong>セキュリティ</strong> — bảo mật</li>
</ul>
<p class="ghi-chu">Trong ảnh chỉ còn “PCL”, “HTML” và “Cookie”.</p>`],
      [45, '3-3 Testing concerns — presentation layer (English)',
        `<p class="y-chinh">🎯 Ten extra concerns for P-layer units — the last three are security tests done at unit level.</p>
<ol>
<li><strong>Screen design</strong> — layout and items match the Screen Design.</li>
<li><strong>Limit/boundary</strong> — boundary of the number of list rows shown per page.</li>
<li><strong>Limit/boundary</strong> — boundary of the displayed length of items.</li>
<li><strong>Character encoding</strong> — correct encoding, no garbled text (mojibake).</li>
<li><strong>Input verification</strong> — <strong>input is verified on the server too</strong>, not only in the browser (see slide 67).</li>
<li><strong>Client-side programs</strong> — they have their own PCLs.</li>
<li><strong>Client-side programs</strong> — with scripts disabled the screen still works or tells the user to enable them.</li>
<li><strong>Security</strong> — HTML tags are rejected or sanitised (XSS).</li>
<li><strong>Security</strong> — double-clicking submit does not create or update data twice.</li>
<li><strong>Security</strong> — confidential user data never appears in HTML source or cookies.</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> items 8–10 are security testing done at unit level — cheap and very effective.</p>`,
        `<p class="y-chinh">🎯 Mười quan điểm thêm cho unit lớp P — ba mục cuối là kiểm thử bảo mật làm ngay ở cấp unit.</p>
<ol>
<li><strong>Thiết kế màn hình</strong> — bố cục và các mục khớp Screen Design.</li>
<li><strong>Biên/giới hạn</strong> — biên của số dòng danh sách hiển thị trên một trang.</li>
<li><strong>Biên/giới hạn</strong> — biên của độ dài hiển thị của các mục.</li>
<li><strong>Mã hoá ký tự</strong> — đúng mã hoá, không lỗi font (mojibake).</li>
<li><strong>Kiểm tra đầu vào</strong> — <strong>đầu vào được kiểm cả ở server</strong>, không chỉ ở trình duyệt (xem slide 67).</li>
<li><strong>Chương trình phía client</strong> — có PCL riêng.</li>
<li><strong>Chương trình phía client</strong> — khi tắt script, màn hình vẫn dùng được hoặc báo người dùng bật lên.</li>
<li><strong>Bảo mật</strong> — thẻ HTML bị chặn hoặc được làm sạch (XSS).</li>
<li><strong>Bảo mật</strong> — bấm đúp nút submit không tạo/cập nhật dữ liệu hai lần.</li>
<li><strong>Bảo mật</strong> — dữ liệu bí mật của người dùng không xuất hiện trong mã HTML hay cookie.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> mục 8–10 là kiểm thử bảo mật làm ngay ở cấp unit — rẻ mà rất hiệu quả.</p>`],
      [46, '3-4 Creating test cases (1) (Japanese)',
        `<p class="y-chinh">🎯 Steps 1 and 2 of building test cases: one basic case, then change only one condition per case.</p>
${JE(47)}
<ul>
<li><strong>手順1 (Step 1)</strong> — basic case = all inputs typical, normal result.</li>
<li><strong>手順2 (Step 2)</strong> — each other case changes <strong>only one</strong> input condition from the basic case, so it is clear which input caused the result.</li>
</ul>
<p class="nhan">Balloons and labels</p>
<ul>
<li><strong>条件1の境界値を確認</strong> — check the boundary of condition 1.</li>
<li><strong>条件2を確認</strong> — check condition 2.</li>
<li><strong>他の条件は固定</strong> — keep the other conditions fixed.</li>
<li><strong>処理A–D</strong> — flowchart labels = statements A–D.</li>
</ul>`,
        `<p class="y-chinh">🎯 Bước 1 và 2 khi dựng test case: một ca cơ sở, rồi mỗi ca chỉ đổi một điều kiện.</p>
${JV(47)}
<ul>
<li><strong>手順1 (Bước 1)</strong> — ca cơ sở = mọi đầu vào điển hình, kết quả bình thường.</li>
<li><strong>手順2 (Bước 2)</strong> — mỗi ca khác chỉ đổi <strong>một</strong> điều kiện đầu vào so với ca cơ sở, để biết rõ đầu vào nào gây ra kết quả.</li>
</ul>
<p class="nhan">Bóng chữ và nhãn</p>
<ul>
<li><strong>条件1の境界値を確認</strong> — kiểm biên của điều kiện 1.</li>
<li><strong>条件2を確認</strong> — kiểm điều kiện 2.</li>
<li><strong>他の条件は固定</strong> — giữ nguyên các điều kiện khác.</li>
<li><strong>処理A–D</strong> — nhãn lưu đồ = xử lý A–D.</li>
</ul>`],
      [47, '3-4 Creating test cases (1): basic case + change one condition',
        `<p class="y-chinh">🎯 Start from one typical “basic case”, then change one input at a time — five cases cover every statement and both outcomes of both decisions.</p>
<p class="nhan">The flowchart</p>
<p><em>Start → Cond. 1 (a &gt; 0)? yes → Statements A → Cond. 2 (b ≥ 0)? yes → Statements C / no → Statements D → End; Cond. 1 no → Statements B → End.</em></p>
<p class="nhan">The five cases</p>
<ol>
<li><strong>Step 1 — basic case</strong> a = 5, b = 10: typical values, normal result (yellow path through A and C).</li>
<li><strong>a = 1</strong> (b stays 10) — boundary of condition 1.</li>
<li><strong>a = 0</strong> (b stays 10) — boundary of condition 1.</li>
<li><strong>b = 0</strong> (a stays 5) — boundary of condition 2.</li>
<li><strong>b = −1</strong> (a stays 5) — boundary of condition 2.</li>
</ol>
<p>Cases 2–5 are <strong>Step 2</strong>: each changes <em>one</em> input from the basic case.</p>
<p class="nhan">Why one at a time?</p>
<ul>
<li><strong>Diagnosis</strong> — if a case fails, you know which input caused it.</li>
<li><strong>Coverage</strong> — changing two inputs at once can make a branch disappear from your tests (slide 49).</li>
</ul>
<p class="nhan">Coloured paths</p>
<ul>
<li><strong>(1)(2)(4)</strong> go A→C; <strong>(3)</strong> goes B; <strong>(5)</strong> goes A→D.</li>
<li>All four statement blocks and both outcomes of both decisions are covered by five cases.</li>
</ul>`,
        `<p class="y-chinh">🎯 Bắt đầu từ một “ca cơ sở” điển hình, rồi mỗi lần đổi một đầu vào — năm ca phủ mọi câu lệnh và cả hai kết quả của cả hai quyết định.</p>
<p class="nhan">Lưu đồ</p>
<p><em>Start → Điều kiện 1 (a &gt; 0)? đúng → Xử lý A → Điều kiện 2 (b ≥ 0)? đúng → Xử lý C / sai → Xử lý D → End; Điều kiện 1 sai → Xử lý B → End.</em></p>
<p class="nhan">Năm ca</p>
<ol>
<li><strong>Bước 1 — ca cơ sở</strong> a = 5, b = 10: giá trị điển hình, kết quả bình thường (đường vàng qua A và C).</li>
<li><strong>a = 1</strong> (b giữ 10) — biên của điều kiện 1.</li>
<li><strong>a = 0</strong> (b giữ 10) — biên của điều kiện 1.</li>
<li><strong>b = 0</strong> (a giữ 5) — biên của điều kiện 2.</li>
<li><strong>b = −1</strong> (a giữ 5) — biên của điều kiện 2.</li>
</ol>
<p>Ca 2–5 là <strong>Bước 2</strong>: mỗi ca đổi <em>một</em> đầu vào so với ca cơ sở.</p>
<p class="nhan">Vì sao đổi từng cái?</p>
<ul>
<li><strong>Chẩn đoán</strong> — nếu ca fail, bạn biết đầu vào nào gây ra.</li>
<li><strong>Coverage</strong> — đổi hai đầu vào một lúc có thể làm một nhánh biến mất khỏi bộ test (slide 49).</li>
</ul>
<p class="nhan">Các đường màu</p>
<ul>
<li><strong>(1)(2)(4)</strong> đi A→C; <strong>(3)</strong> đi B; <strong>(5)</strong> đi A→D.</li>
<li>Năm ca phủ cả bốn khối xử lý và cả hai kết quả của cả hai quyết định.</li>
</ul>`],
      [48, '3-4 Creating test cases (2) (Japanese)',
        `<p class="y-chinh">🎯 手順２のルールに違反すると、テスト漏れが発生しやすくなります — “violating the rule of step 2 easily causes test omissions (テスト漏れ)”.</p>
${JE(49)}
<ul>
<li><strong>Red banner 違反例</strong> — “example of a violation”.</li>
<li><strong>Balloon 1件のテストケースで複数の条件を変更しないこと</strong> — “do not change several conditions in one test case”.</li>
</ul>`,
        `<p class="y-chinh">🎯 手順２のルールに違反すると、テスト漏れが発生しやすくなります — “vi phạm quy tắc bước 2 rất dễ gây sót test (テスト漏れ)”.</p>
${JV(49)}
<ul>
<li><strong>Băng đỏ 違反例</strong> — “ví dụ vi phạm”.</li>
<li><strong>Bóng chữ 1件のテストケースで複数の条件を変更しないこと</strong> — “không đổi nhiều điều kiện trong một test case”.</li>
</ul>`],
      [49, '3-4 Creating test cases (2): the improper example',
        `<p class="y-chinh">🎯 Changing two conditions in one case looks economical — but here it leaves Statements D untested.</p>
<p class="nhan">Only three cases</p>
<ol>
<li><strong>Basic</strong> — a = 5, b = 10.</li>
<li><strong>a = 1 <em>and</em> b = 0</strong> — two conditions changed.</li>
<li><strong>a = 0 <em>and</em> b = −1</strong> — two conditions changed.</li>
</ol>
<p class="nhan">What goes wrong</p>
<ul>
<li><strong>Case (3) never reaches condition 2</strong> — a = 0 sends it to B, so its b = −1 is wasted.</li>
<li><strong>Statements D is “Not tested”</strong> (red dashed circle) — a statement and a decision outcome stay uncovered.</li>
<li><strong>Measured</strong> — the worked example below shows JaCoCo reporting exactly this (6/7 lines, 3/4 branches).</li>
</ul>`,
        `<p class="y-chinh">🎯 Đổi hai điều kiện trong một ca trông tiết kiệm — nhưng ở đây nó để Xử lý D không được test.</p>
<p class="nhan">Chỉ ba ca</p>
<ol>
<li><strong>Cơ sở</strong> — a = 5, b = 10.</li>
<li><strong>a = 1 <em>và</em> b = 0</strong> — đổi hai điều kiện.</li>
<li><strong>a = 0 <em>và</em> b = −1</strong> — đổi hai điều kiện.</li>
</ol>
<p class="nhan">Hỏng ở đâu</p>
<ul>
<li><strong>Ca (3) không bao giờ tới được điều kiện 2</strong> — a = 0 đẩy nó sang B, nên b = −1 bị lãng phí.</li>
<li><strong>Xử lý D “Not tested”</strong> (vòng đỏ nét đứt) — một câu lệnh và một kết quả quyết định bị bỏ sót.</li>
<li><strong>Đo thật</strong> — ví dụ có lời giải bên dưới cho thấy JaCoCo báo đúng như vậy (6/7 dòng, 3/4 nhánh).</li>
</ul>`],
      [50, '3-4 Creating test cases (3) (Japanese)',
        `<p class="y-chinh">🎯 手順3 (Step 3): add cases for processing that depends on several input conditions, changing only the conditions it depends on (cases (4)(5)).</p>
${JE(51)}
<p class="nhan">Balloons</p>
<ul>
<li><strong>手順1,2によって作成したテストケースでは、条件2を確認できない</strong> — “the cases made by steps 1 and 2 cannot check condition 2”.</li>
<li><strong>a=0 に固定し、bを変えて条件2を確認</strong> — “fix a = 0 and vary b to check condition 2”.</li>
</ul>`,
        `<p class="y-chinh">🎯 手順3 (Bước 3): thêm ca cho xử lý phụ thuộc nhiều điều kiện đầu vào, chỉ đổi những điều kiện nó phụ thuộc (ca (4)(5)).</p>
${JV(51)}
<p class="nhan">Bóng chữ</p>
<ul>
<li><strong>手順1,2によって作成したテストケースでは、条件2を確認できない</strong> — “các ca tạo bằng bước 1, 2 không kiểm được điều kiện 2”.</li>
<li><strong>a=0 に固定し、bを変えて条件2を確認</strong> — “cố định a = 0 và đổi b để kiểm điều kiện 2”.</li>
</ul>`],
      [51, '3-4 Creating test cases (3): dependent conditions',
        `<p class="y-chinh">🎯 Step 3: when a condition is only reachable through another, fix the inputs that lead there and vary only the relevant one.</p>
<p class="nhan">A different flowchart</p>
<p>Now condition 2 sits <em>inside the “no” branch</em> of condition 1: Cond. 1 a &gt; 0: yes → A → End; no → B → Cond. 2 b ≥ 0 → C or D.</p>
<p class="nhan">Why step 2 is not enough</p>
<p>The basic case a = 5 never reaches condition 2, so varying b from the basic case (step 2) proves nothing.</p>
<p class="nhan">Step 3</p>
<p>For statements that depend on several conditions, change <em>only the relevant inputs</em>: fix a = 0 and vary b.</p>
<ul>
<li><strong>(4) b = 0</strong> → B, C.</li>
<li><strong>(5) b = −1</strong> → B, D.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> through steps 1–3 “each statement and branch is executed in at least one test case” — i.e. C0 = C1 = 100 %.</p>`,
        `<p class="y-chinh">🎯 Bước 3: khi một điều kiện chỉ tới được qua điều kiện khác, cố định các đầu vào dẫn tới đó và chỉ đổi đầu vào liên quan.</p>
<p class="nhan">Một lưu đồ khác</p>
<p>Giờ điều kiện 2 nằm <em>bên trong nhánh “sai”</em> của điều kiện 1: Điều kiện 1 a &gt; 0: đúng → A → End; sai → B → Điều kiện 2 b ≥ 0 → C hoặc D.</p>
<p class="nhan">Vì sao bước 2 chưa đủ</p>
<p>Ca cơ sở a = 5 không bao giờ tới điều kiện 2, nên đổi b từ ca cơ sở (bước 2) chẳng chứng minh được gì.</p>
<p class="nhan">Bước 3</p>
<p>Với câu lệnh phụ thuộc nhiều điều kiện, chỉ đổi <em>những đầu vào liên quan</em>: cố định a = 0 và đổi b.</p>
<ul>
<li><strong>(4) b = 0</strong> → B, C.</li>
<li><strong>(5) b = −1</strong> → B, D.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> qua bước 1–3, “mỗi câu lệnh và mỗi nhánh được chạy trong ít nhất một test case” — tức C0 = C1 = 100 %.</p>`],
      [52, '3-4 Creating test cases (4) (Japanese)',
        `<p class="y-chinh">🎯 複数条件からなる分岐条件がある場合、分岐の判定結果だけでなく、分岐を構成する個々の条件も確認してください — same rule as slide 53.</p>
${JE(53)}
<p class="nhan">Balloons</p>
<ul>
<li><strong>条件1の確認でC1カバレージは100%になるが、条件2を確認していない</strong> — “checking condition 1 already gives C1 = 100 %, but condition 2 is not checked”.</li>
<li><strong>他の条件も必ず確認する</strong> — “always check the other conditions too”.</li>
</ul>`,
        `<p class="y-chinh">🎯 複数条件からなる分岐条件がある場合、分岐の判定結果だけでなく、分岐を構成する個々の条件も確認してください — quy tắc giống slide 53.</p>
${JV(53)}
<p class="nhan">Bóng chữ</p>
<ul>
<li><strong>条件1の確認でC1カバレージは100%になるが、条件2を確認していない</strong> — “chỉ kiểm điều kiện 1 là đã đạt C1 = 100 %, nhưng điều kiện 2 chưa được kiểm”.</li>
<li><strong>他の条件も必ず確認する</strong> — “luôn kiểm cả các điều kiện khác”.</li>
</ul>`],
      [53, '3-4 Creating test cases (4): compound conditions',
        `<p class="y-chinh">🎯 100 % decision coverage of <code>a &gt; 0 &amp;&amp; b &gt;= 0</code> can leave condition 2 untested — check each sub-condition, not only the decision.</p>
<p class="nhan">The trap</p>
<p>One decision <code>a &gt; 0 &amp;&amp; b &gt;= 0</code> → A (true) or B (false). Cases (1) a = 5, b = 10 (true) and (2) a = 0, b = 10 (false) already give <strong>100 % C1</strong>, yet condition 2 was never false — a bug such as <code>b &gt; 0</code> instead of <code>b &gt;= 0</code> would slip through.</p>
<p class="nhan">The truth table — four combinations</p>
<ol>
<li><strong>T, T → True</strong> — “a normal b normal”</li>
<li><strong>F, T → False</strong> — “a error b normal”</li>
<li><strong>T, F → False</strong> — “a normal b error”</li>
<li><strong>F, F → False</strong> — “a error b error”</li>
</ol>
<p class="nhan">Rule</p>
<p><strong>Check each sub-condition, not only the decision</strong> (concern 5 on slide 43).</p>
<p class="nhan">ISTQB and tool notes</p>
<ul>
<li><strong>Beyond decision coverage</strong> — this moves towards <em>condition coverage</em>.</li>
<li><strong>Short-circuit</strong> — in Java, <code>&amp;&amp;</code> short-circuits, so in case (4) b is never evaluated; cases (1)(2)(3) are enough to show each condition deciding the outcome.</li>
<li><strong>JaCoCo</strong> — counts each operand of <code>&amp;&amp;</code>/<code>||</code> as separate branches, so a tool report enforces this rule automatically (see L2.6).</li>
</ul>`,
        `<p class="y-chinh">🎯 Đạt 100 % decision coverage cho <code>a &gt; 0 &amp;&amp; b &gt;= 0</code> vẫn có thể chưa test điều kiện 2 — phải kiểm từng điều kiện con, không chỉ kết quả chung.</p>
<p class="nhan">Cái bẫy</p>
<p>Một quyết định <code>a &gt; 0 &amp;&amp; b &gt;= 0</code> → A (đúng) hoặc B (sai). Ca (1) a = 5, b = 10 (đúng) và (2) a = 0, b = 10 (sai) đã cho <strong>C1 = 100 %</strong>, nhưng điều kiện 2 chưa từng sai — một bug kiểu <code>b &gt; 0</code> thay vì <code>b &gt;= 0</code> sẽ lọt qua.</p>
<p class="nhan">Bảng chân trị — bốn tổ hợp</p>
<ol>
<li><strong>Đ, Đ → Đúng</strong> — “a normal b normal”</li>
<li><strong>S, Đ → Sai</strong> — “a error b normal”</li>
<li><strong>Đ, S → Sai</strong> — “a normal b error”</li>
<li><strong>S, S → Sai</strong> — “a error b error”</li>
</ol>
<p class="nhan">Quy tắc</p>
<p><strong>Kiểm từng điều kiện con, không chỉ kết quả chung</strong> (concern 5 ở slide 43).</p>
<p class="nhan">Ghi chú ISTQB và công cụ</p>
<ul>
<li><strong>Vượt decision coverage</strong> — việc này hướng tới <em>condition coverage</em>.</li>
<li><strong>Đoản mạch</strong> — trong Java, <code>&amp;&amp;</code> đoản mạch nên ở ca (4) b không hề được tính; ba ca (1)(2)(3) đủ để thấy từng điều kiện quyết định kết quả.</li>
<li><strong>JaCoCo</strong> — đếm mỗi vế của <code>&amp;&amp;</code>/<code>||</code> là nhánh riêng, nên báo cáo công cụ tự động ép quy tắc này (xem bài L2.6).</li>
</ul>`],
      [54, 'Section 4 divider (Japanese)',
        `<p class="y-chinh">🎯 “4. PCL作成時の留意点” — points to note when creating PCLs.</p>
${JE(55)}
<ul>
<li><strong>Sub-text</strong> — “in addition to chapter 3, note the concerns in this chapter”.</li>
<li><strong>Red label</strong> — “customise this section for your project”.</li>
</ul>`,
        `<p class="y-chinh">🎯 “4. PCL作成時の留意点” — các điểm lưu ý khi tạo PCL.</p>
${JV(55)}
<ul>
<li><strong>Dòng phụ</strong> — “ngoài chương 3, hãy lưu ý các quan điểm trong chương này”.</li>
<li><strong>Nhãn đỏ</strong> — “tuỳ biến mục này theo dự án”.</li>
</ul>`],
      [55, 'Section 4: Points to Note When Creating PCLs',
        `<p class="y-chinh">🎯 Six situations follow (4-1 … 4-6), each shown as <em>Design → PCL</em>.</p>
<ul>
<li><strong>Design</strong> — what the design says.</li>
<li><strong>PCL</strong> — which rows/columns it must produce in the PCL.</li>
</ul>`,
        `<p class="y-chinh">🎯 Tiếp theo là sáu tình huống (4-1 … 4-6), mỗi tình huống vẽ theo kiểu <em>Design → PCL</em>.</p>
<ul>
<li><strong>Design</strong> — thiết kế nói gì.</li>
<li><strong>PCL</strong> — nó phải sinh ra những dòng/cột nào trong PCL.</li>
</ul>`],
      [56, '4-1 Calling submodules (Japanese)',
        `<p class="y-chinh">🎯 対象ソフトウェアユニットから別のソフトウェアユニットを呼び出す場合、正常系と、ハンドリングされる全ての異常系をテストしてください — same rule as slide 57.</p>
${JE(57)}
<p class="nhan">PCL rows in Japanese</p>
<ul>
<li><strong>サブモジュール呼出し</strong> — submodule call.</li>
<li><strong>指定項目がDBに存在しない（〇〇〇Exception発生）</strong> — specified item not in DB → ○○○Exception.</li>
<li><strong>参照される項目がDBに存在しない（△△△Exception発生）</strong> — referenced item not in DB → △△△Exception.</li>
<li><strong>値が全て正常 / 異常値が存在</strong> — all values valid / an invalid value exists.</li>
</ul>`,
        `<p class="y-chinh">🎯 対象ソフトウェアユニットから別のソフトウェアユニットを呼び出す場合、正常系と、ハンドリングされる全ての異常系をテストしてください — quy tắc giống slide 57.</p>
${JV(57)}
<p class="nhan">Các dòng PCL tiếng Nhật</p>
<ul>
<li><strong>サブモジュール呼出し</strong> — gọi submodule.</li>
<li><strong>指定項目がDBに存在しない（〇〇〇Exception発生）</strong> — mục chỉ định không có trong DB → ○○○Exception.</li>
<li><strong>参照される項目がDBに存在しない（△△△Exception発生）</strong> — mục tham chiếu không có trong DB → △△△Exception.</li>
<li><strong>値が全て正常 / 異常値が存在</strong> — mọi giá trị hợp lệ / có giá trị không hợp lệ.</li>
</ul>`],
      [57, '4-1 Calling submodules (English)',
        `<p class="y-chinh">🎯 When the unit calls a submodule, the PCL must contain the normal return values <em>and</em> every exception the caller handles.</p>
<p class="nhan">The sequence diagram</p>
<p>The caller (the unit under test) sends IN to the callee; the callee returns OUT normally, or throws Exception A or Exception B.</p>
<p class="nhan">The example — callee <code>ItemSetF.checkItem</code></p>
<p>A sub-routine-condition block with four rows:</p>
<ol>
<li>Specified item missing in DB → ○○○Exception</li>
<li>Related item missing → △△△Exception</li>
<li>All values valid → CheckResult true</li>
<li>An invalid value → CheckResult false</li>
</ol>
<p>Columns: basic case, Application Exception ×2, checkItem false.</p>
<p class="nhan">In practice</p>
<ul>
<li><strong>JUnit</strong> — produce these outcomes with a stub or mock of the callee (or real DB data, as slide 25 prefers).</li>
<li><strong>Category</strong> — this is the <em>I</em> (interface) category of the appendix.</li>
</ul>`,
        `<p class="y-chinh">🎯 Khi unit gọi submodule, PCL phải có các giá trị trả về bình thường <em>và</em> mọi exception bên gọi có xử lý.</p>
<p class="nhan">Sơ đồ tuần tự</p>
<p>Bên gọi (unit đang test) gửi IN cho bên bị gọi; bên bị gọi trả OUT bình thường, hoặc ném Exception A, Exception B.</p>
<p class="nhan">Ví dụ — bên bị gọi <code>ItemSetF.checkItem</code></p>
<p>Một khối sub-routine condition bốn dòng:</p>
<ol>
<li>Mục chỉ định không có trong DB → ○○○Exception</li>
<li>Mục liên quan không có → △△△Exception</li>
<li>Mọi giá trị hợp lệ → CheckResult true</li>
<li>Có giá trị không hợp lệ → CheckResult false</li>
</ol>
<p>Các cột: basic case, Application Exception ×2, checkItem false.</p>
<p class="nhan">Trong thực tế</p>
<ul>
<li><strong>JUnit</strong> — tạo ra các kết quả này bằng stub hay mock của bên bị gọi (hoặc dữ liệu DB thật, như slide 25 ưu tiên).</li>
<li><strong>Phân loại</strong> — đây là loại <em>I</em> (interface) trong phụ lục.</li>
</ul>`],
      [58, '4-2 Retrieving a value from a configuration file (Japanese)',
        `<p class="y-chinh">🎯 設定ファイルから値を取得する場合には、正常なケースに加えて異常ケースもテストしてください — test abnormal cases as well.</p>
${JE(59)}
<p class="nhan">The four abnormal cases</p>
<ol>
<li><strong>設定ファイルがない</strong> — file missing.</li>
<li><strong>設定項目がない</strong> — key missing.</li>
<li><strong>設定値が空文字</strong> — value is an empty string.</li>
<li><strong>異常な値</strong> — illegal value.</li>
</ol>
<p class="ghi-chu">PCL label: 設定ファイル異常の確認 (checking configuration-file errors).</p>`,
        `<p class="y-chinh">🎯 設定ファイルから値を取得する場合には、正常なケースに加えて異常ケースもテストしてください — phải test cả ca bất thường.</p>
${JV(59)}
<p class="nhan">Bốn ca bất thường</p>
<ol>
<li><strong>設定ファイルがない</strong> — không có file.</li>
<li><strong>設定項目がない</strong> — không có khoá.</li>
<li><strong>設定値が空文字</strong> — giá trị là chuỗi rỗng.</li>
<li><strong>異常な値</strong> — giá trị bất thường.</li>
</ol>
<p class="ghi-chu">Nhãn PCL: 設定ファイル異常の確認 (kiểm lỗi file cấu hình).</p>`],
      [59, '4-2 Retrieving a value from a configuration file (English)',
        `<p class="y-chinh">🎯 A setting read from a file needs cases for a missing file, a missing key, a blank value and an illegal value — not only the valid one.</p>
<p class="nhan">Five input rows for the key <code>APND_FILE_SPLT_SIZE</code> (appended-file split size)</p>
<ol>
<li>Configuration file does not exist</li>
<li>Key does not exist (greyed line)</li>
<li>Blank value (<code>APND_FILE_SPLT_SIZE=</code>)</li>
<li><code>xyz</code> (non-digit)</li>
<li><code>1024000</code> (valid)</li>
</ol>
<p>Columns: Basic case, Application Exception and System Exception cases.</p>
<p class="nhan">In your SWP391 project</p>
<p>The equivalent is <code>application.properties</code> or <code>.env</code> values. A missing or empty setting is one of the most common production failures, and it is invisible to tests that always run with a correct file.</p>`,
        `<p class="y-chinh">🎯 Giá trị đọc từ file cấu hình cần ca cho thiếu file, thiếu khoá, giá trị trống và giá trị sai — không chỉ ca hợp lệ.</p>
<p class="nhan">Năm dòng đầu vào cho khoá <code>APND_FILE_SPLT_SIZE</code> (kích thước chia file đính kèm)</p>
<ol>
<li>Không có file cấu hình</li>
<li>Không có khoá (dòng mờ)</li>
<li>Giá trị trống (<code>APND_FILE_SPLT_SIZE=</code>)</li>
<li><code>xyz</code> (không phải số)</li>
<li><code>1024000</code> (hợp lệ)</li>
</ol>
<p>Các cột: Basic case, Application Exception, System Exception.</p>
<p class="nhan">Trong dự án SWP391</p>
<p>Tương đương là giá trị trong <code>application.properties</code> hay <code>.env</code>. Cấu hình thiếu hoặc rỗng là một trong những lỗi production phổ biến nhất, và test nào cũng chạy với file đúng thì không bao giờ thấy nó.</p>`],
      [60, '4-3 Executing SQL statements (Japanese)',
        `<p class="y-chinh">🎯 Same as slide 61: a design excerpt that builds a WHERE/ORDER BY string step by step, and a note on SQL concerns.</p>
${JE(61)}
<p class="nhan">3.2 検索・ソート条件の作成 — creating search and sort conditions</p>
<ol>
<li><strong>3.2.1</strong> — declare local variable whereString = “WEEA01.PJ_CD=”.</li>
<li><strong>3.2.2</strong> — declare sanitizedPjCd: the Project Code with “'” replaced by “''”.</li>
<li><strong>3.2.3</strong> — append it.</li>
<li><strong>3.2.4</strong> — append “ AND ”.</li>
<li><strong>3.2.5</strong> — append “WEE2A02D.DELETE_KEY = '0'”.</li>
<li><strong>3.2.6</strong> — append “ ORDER BY ”.</li>
<li><strong>3.2.7</strong> — append the SortKey argument.</li>
</ol>
<p class="nhan">Right-hand notes</p>
<p>“Even if not written in the DD, check the project's SQL concerns: SQL-injection countermeasures (values with special characters such as ') and search conditions using %”.</p>`,
        `<p class="y-chinh">🎯 Giống slide 61: một đoạn thiết kế dựng chuỗi WHERE/ORDER BY từng bước, và ghi chú về các quan điểm SQL.</p>
${JV(61)}
<p class="nhan">3.2 検索・ソート条件の作成 — tạo điều kiện tìm kiếm và sắp xếp</p>
<ol>
<li><strong>3.2.1</strong> — khai báo biến cục bộ whereString = “WEEA01.PJ_CD=”.</li>
<li><strong>3.2.2</strong> — khai báo sanitizedPjCd: Project Code đã thay “'” bằng “''”.</li>
<li><strong>3.2.3</strong> — nối nó vào.</li>
<li><strong>3.2.4</strong> — nối “ AND ”.</li>
<li><strong>3.2.5</strong> — nối “WEE2A02D.DELETE_KEY = '0'”.</li>
<li><strong>3.2.6</strong> — nối “ ORDER BY ”.</li>
<li><strong>3.2.7</strong> — nối tham số SortKey.</li>
</ol>
<p class="nhan">Ghi chú bên phải</p>
<p>“Kể cả khi DD không ghi, vẫn phải kiểm các quan điểm SQL của dự án: chống SQL injection (giá trị có ký tự đặc biệt như ') và điều kiện tìm kiếm dùng %”.</p>`],
      [61, '4-3 Executing SQL statements (English)',
        `<p class="y-chinh">🎯 When a unit <em>builds</em> SQL, write cases that prove each design step — and test quotes and % even if the DD is silent.</p>
<p class="nhan">Design line → PCL rows (the red arrows)</p>
<ul>
<li><strong>Step 3.2.2 (escaping)</strong> — ProjectCode “only alphabets” (ABC) and “including a single quotation” (AB'C).</li>
<li><strong>Step 3.2.7 (sort)</strong> — SortKey “INVNTRY_ID ASC” and “INVNTRY_NM DESC”.</li>
</ul>
<p class="nhan">Even if the DD is silent</p>
<ul>
<li><strong>SQL-injection countermeasures</strong> — values containing <code>'</code>.</li>
<li><strong>Search conditions with %</strong> — does “50%” search for the literal character or match everything?</li>
</ul>
<div class="pitfall">Appending SortKey unescaped (3.2.7) is itself an injection risk — exactly what such a test exposes. Modern code uses <code>PreparedStatement</code> parameters, but ORDER BY columns cannot be bound, so a whitelist test is still needed.</div>`,
        `<p class="y-chinh">🎯 Khi unit <em>tự dựng</em> câu SQL, hãy viết ca chứng minh từng bước thiết kế — và test dấu nháy, dấu % kể cả khi DD không nói.</p>
<p class="nhan">Dòng thiết kế → dòng PCL (các mũi tên đỏ)</p>
<ul>
<li><strong>Bước 3.2.2 (escape)</strong> — ProjectCode “chỉ chữ cái” (ABC) và “có dấu nháy đơn” (AB'C).</li>
<li><strong>Bước 3.2.7 (sắp xếp)</strong> — SortKey “INVNTRY_ID ASC” và “INVNTRY_NM DESC”.</li>
</ul>
<p class="nhan">Kể cả khi DD không nói</p>
<ul>
<li><strong>Chống SQL injection</strong> — giá trị chứa <code>'</code>.</li>
<li><strong>Điều kiện tìm kiếm có %</strong> — “50%” là tìm đúng ký tự % hay khớp tất cả?</li>
</ul>
<div class="pitfall">Nối SortKey mà không escape (3.2.7) tự nó đã là rủi ro injection — đúng thứ mà một ca test như vậy làm lộ ra. Code hiện đại dùng tham số <code>PreparedStatement</code>, nhưng cột ORDER BY không bind được, nên vẫn cần test danh sách trắng (whitelist).</div>`],
      [62, '4-4 List items in input or output (Japanese)',
        `<p class="y-chinh">🎯 入力項目に繰返し項目がある場合、要素数0件/1件/複数件 — for repeated items in input (and output), cases with 0 / 1 / several elements.</p>
${JE(63)}
<ul>
<li><strong>Several lists</strong> — separate cases for each list.</li>
<li><strong>Balloon</strong> — それぞれのリストで0件・1件・複数件をチェック (check 0 / 1 / several for each list).</li>
</ul>
<p class="nhan">Design labels</p>
<ul>
<li><strong>【添付登録削除リスト】</strong> — appended-file add/delete list.</li>
<li><strong>添付ファイル名称</strong> — file name.</li>
<li><strong>添付サイズ</strong> — size.</li>
<li><strong>楽観排他キー</strong> — optimistic-lock key.</li>
<li><strong>ファイル操作フラグ</strong> — file-operation flag.</li>
<li><strong>【添付登録削除URLリスト】</strong> — URL list.</li>
</ul>`,
        `<p class="y-chinh">🎯 入力項目に繰返し項目がある場合、要素数0件/1件/複数件 — với mục lặp lại trong đầu vào (và đầu ra), có ca 0 / 1 / nhiều phần tử.</p>
${JV(63)}
<ul>
<li><strong>Nhiều danh sách</strong> — mỗi danh sách có ca riêng.</li>
<li><strong>Bóng chữ</strong> — それぞれのリストで0件・1件・複数件をチェック (kiểm 0 / 1 / nhiều cho từng danh sách).</li>
</ul>
<p class="nhan">Nhãn thiết kế</p>
<ul>
<li><strong>【添付登録削除リスト】</strong> — danh sách thêm/xoá file đính kèm.</li>
<li><strong>添付ファイル名称</strong> — tên file.</li>
<li><strong>添付サイズ</strong> — kích thước.</li>
<li><strong>楽観排他キー</strong> — khoá của cơ chế khoá lạc quan (optimistic lock).</li>
<li><strong>ファイル操作フラグ</strong> — cờ thao tác file.</li>
<li><strong>【添付登録削除URLリスト】</strong> — danh sách URL.</li>
</ul>`],
      [63, '4-4 List items in input or output (English)',
        `<p class="y-chinh">🎯 A list in the input or output needs cases with <strong>zero, one and many</strong> elements — separately for each list.</p>
<p class="nhan">The rule</p>
<ul>
<li><strong>Input list</strong> — cases where the list has zero, one and many elements.</li>
<li><strong>Output list</strong> — the same.</li>
<li><strong>Two lists</strong> (here the appended-file list and the appended-URL list) — <strong>separate</strong> cases for each, so that one list's result is not hidden by the other.</li>
</ul>
<p class="nhan">The PCL rows show counts such as</p>
<ul>
<li>“the number of deleted items (flag DELETE): 0 / 1 / 2”</li>
<li>“the number of blank items”</li>
<li>“the number of inserted items”</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> zero–one–many is boundary value analysis applied to collection sizes; empty lists and single-element lists are where loops and <code>get(0)</code> calls break.</p>`,
        `<p class="y-chinh">🎯 Danh sách trong đầu vào hay đầu ra cần ca có <strong>0, 1 và nhiều</strong> phần tử — riêng cho từng danh sách.</p>
<p class="nhan">Quy tắc</p>
<ul>
<li><strong>Danh sách đầu vào</strong> — ca danh sách có 0, 1 và nhiều phần tử.</li>
<li><strong>Danh sách đầu ra</strong> — tương tự.</li>
<li><strong>Hai danh sách</strong> (ở đây danh sách file đính kèm và danh sách URL đính kèm) — viết ca <strong>riêng</strong> cho từng cái để kết quả danh sách này không che mất danh sách kia.</li>
</ul>
<p class="nhan">Các dòng PCL ghi số lượng như</p>
<ul>
<li>“số mục bị xoá (cờ DELETE): 0 / 1 / 2”</li>
<li>“số mục trống”</li>
<li>“số mục được thêm”</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> 0–1–nhiều chính là phân tích giá trị biên áp dụng cho kích thước tập hợp; danh sách rỗng và danh sách một phần tử là chỗ vòng lặp và lời gọi <code>get(0)</code> hay gãy.</p>`],
      [64, '4-5 Client-side programs (Japanese)',
        `<p class="y-chinh">🎯 Same as slide 65: JavaScriptなど、クライアント側のプログラムを開発する場合も…PCLを作成し — create PCLs for JavaScript too.</p>
${JE(65)}
<p class="nhan">Examples of client-side processing</p>
<ul>
<li><strong>入力項目のチェック</strong> — input check.</li>
<li><strong>出力項目の表示</strong> — output display.</li>
<li><strong>画面レイアウトの動的変更</strong> — dynamic layout.</li>
<li><strong>非同期通信</strong> — asynchronous communication.</li>
</ul>
<p class="nhan">Also on the page</p>
<ul>
<li>Fall-backs when static-analysis or coverage tools are unavailable.</li>
<li>The two acceptable behaviours with scripts disabled.</li>
</ul>`,
        `<p class="y-chinh">🎯 Giống slide 65: JavaScriptなど、クライアント側のプログラムを開発する場合も…PCLを作成し — viết PCL cả cho JavaScript.</p>
${JV(65)}
<p class="nhan">Ví dụ về xử lý phía client</p>
<ul>
<li><strong>入力項目のチェック</strong> — kiểm tra input.</li>
<li><strong>出力項目の表示</strong> — hiển thị output.</li>
<li><strong>画面レイアウトの動的変更</strong> — đổi bố cục động.</li>
<li><strong>非同期通信</strong> — giao tiếp bất đồng bộ.</li>
</ul>
<p class="nhan">Trên trang còn có</p>
<ul>
<li>Cách thay thế khi không có công cụ phân tích tĩnh hay coverage.</li>
<li>Hai hành vi chấp nhận được khi tắt script.</li>
</ul>`],
      [65, '4-5 Client-side programs (English)',
        `<p class="y-chinh">🎯 Client-side code gets PCLs and tests exactly like server code — even when tools are missing.</p>
<p class="nhan">What counts as client-side code</p>
<p>Input checks, output display, dynamic layout changes, asynchronous calls.</p>
<p class="nhan">When a tool is missing</p>
<ul>
<li><strong>No static-analysis tool</strong> — cover those concerns during desk debugging and code review.</li>
<li><strong>No coverage tool</strong> — <strong>check coverage by hand against the PCL</strong> during desk debugging and review.</li>
</ul>
<p class="nhan">When scripts are disabled in the browser — one of two</p>
<ol>
<li>The operation still works without the script, or</li>
<li>An error message tells the user to enable it.</li>
</ol>
<p class="ghi-chu">In 2026 terms: ESLint is the static analyser, Jest/Vitest with Istanbul gives coverage — the excuse of “no tool” has disappeared.</p>`,
        `<p class="y-chinh">🎯 Code phía client cũng có PCL và được test y như code server — kể cả khi thiếu công cụ.</p>
<p class="nhan">Code phía client gồm những gì</p>
<p>Kiểm tra input, hiển thị output, đổi bố cục động, gọi bất đồng bộ.</p>
<p class="nhan">Khi thiếu công cụ</p>
<ul>
<li><strong>Không có công cụ phân tích tĩnh</strong> — xét các quan điểm đó khi desk debug và review code.</li>
<li><strong>Không có công cụ coverage</strong> — <strong>tự kiểm coverage bằng tay theo PCL</strong> khi desk debug và review.</li>
</ul>
<p class="nhan">Khi trình duyệt tắt script — một trong hai</p>
<ol>
<li>Thao tác vẫn làm được mà không cần script, hoặc</li>
<li>Có thông báo lỗi yêu cầu người dùng bật script.</li>
</ol>
<p class="ghi-chu">Theo cách nói năm 2026: ESLint là công cụ phân tích tĩnh, Jest/Vitest với Istanbul cho coverage — lý do “không có công cụ” đã không còn.</p>`],
      [66, '4-6 Sending input values (Japanese)',
        `<p class="y-chinh">🎯 クライアントからサーバにデータを送信する場合、クライアント側だけでなくサーバ側でも入力チェックが行われることを確認してください — check that the server validates input, not only the client.</p>
${JE(67)}
<p class="nhan">The four steps</p>
<ol>
<li><strong>4桁以下を入力可能な項目に「9999」を入力</strong> — enter 9999 in a field allowing ≤ 4 digits.</li>
<li><strong>クライアント側の入力チェックを通過</strong> — passes the client check.</li>
<li><strong>ツールを用いてリクエストを編集し、値を「10000」に変更</strong> — edit the request with a tool, change the value to 10000.</li>
<li><strong>サーバ側で入力チェックが行われ、エラーを返す</strong> — the server checks and returns an error.</li>
</ol>
<p class="ghi-chu">PCL note ※リクエストを編集して実施 = “performed by editing the request”.</p>`,
        `<p class="y-chinh">🎯 クライアントからサーバにデータを送信する場合、クライアント側だけでなくサーバ側でも入力チェックが行われることを確認してください — phải xác nhận server cũng kiểm tra input, không chỉ client.</p>
${JV(67)}
<p class="nhan">Bốn bước</p>
<ol>
<li><strong>4桁以下を入力可能な項目に「9999」を入力</strong> — nhập 9999 vào ô cho phép tối đa 4 chữ số.</li>
<li><strong>クライアント側の入力チェックを通過</strong> — qua được kiểm tra phía client.</li>
<li><strong>ツールを用いてリクエストを編集し、値を「10000」に変更</strong> — dùng công cụ sửa request, đổi giá trị thành 10000.</li>
<li><strong>サーバ側で入力チェックが行われ、エラーを返す</strong> — server kiểm tra và trả lỗi.</li>
</ol>
<p class="ghi-chu">Ghi chú PCL ※リクエストを編集して実施 = “thực hiện bằng cách sửa request”.</p>`],
      [67, '4-6 Sending input values (English)',
        `<p class="y-chinh">🎯 Never trust the browser: the server-side program must reject a value even when the client-side check was bypassed.</p>
<p class="nhan">The attack in four steps</p>
<ol>
<li>A field allows at most 4 digits; the user types 9999.</li>
<li>It passes the JavaScript check.</li>
<li>The user edits the HTTP request with a tool (browser DevTools, Burp Suite, Postman) to send <strong>10000</strong>.</li>
<li>The <strong>server-side</strong> program must still reject it.</li>
</ol>
<p class="nhan">The PCL for Date (year) — the full boundary set</p>
<ul>
<li><strong>2013</strong> — basic</li>
<li><strong>blank</strong></li>
<li><strong>0000, 0001, 9999</strong></li>
<li><strong>10000</strong> — by editing the HTTP request</li>
<li><strong>999</strong> — too short</li>
<li>another edited request</li>
</ul>
<p>Descriptions: “year blank / year boundary ×3 / year length ×2”.</p>
<p class="meo">🧠 <strong>Remember:</strong> this is the unit-level form of the OWASP rule “all input validation must happen on the server”.</p>`,
        `<p class="y-chinh">🎯 Đừng bao giờ tin trình duyệt: chương trình phía server vẫn phải từ chối giá trị sai kể cả khi kiểm tra phía client đã bị vượt qua.</p>
<p class="nhan">Cách tấn công trong bốn bước</p>
<ol>
<li>Một ô cho tối đa 4 chữ số; người dùng gõ 9999.</li>
<li>Giá trị qua được kiểm tra JavaScript.</li>
<li>Người dùng dùng công cụ (DevTools của trình duyệt, Burp Suite, Postman) sửa request HTTP để gửi <strong>10000</strong>.</li>
<li>Chương trình <strong>phía server</strong> vẫn phải từ chối.</li>
</ol>
<p class="nhan">PCL cho Date (năm) — đủ bộ biên</p>
<ul>
<li><strong>2013</strong> — cơ sở</li>
<li><strong>để trống</strong></li>
<li><strong>0000, 0001, 9999</strong></li>
<li><strong>10000</strong> — sửa request HTTP</li>
<li><strong>999</strong> — thiếu độ dài</li>
<li>một request bị sửa khác</li>
</ul>
<p>Mô tả: “year blank / year boundary ×3 / year length ×2”.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> đây là dạng cấp unit của quy tắc OWASP “mọi kiểm tra đầu vào phải làm ở server”.</p>`],
    ]),
    bi(`<h3>Ví dụ có lời giải · Worked example — the guide's matrix, run for real</h3>
<p>The five columns of slide 39 describe a function that returns b ÷ a and requires a &gt; 0 and b ≥ 0. Written in Java with the flowchart's statement blocks marked:</p>
<pre><code>public static int divide(int a, int b) {
    int result;
    if (a &gt; 0) {                       // Condition 1
        result = 0;                    // statements A
    } else {
        throw new IllegalArgumentException("a must be &gt; 0");   // statements B
    }
    if (b &gt;= 0) {                      // Condition 2
        result = b / a;                // statements C
    } else {
        throw new IllegalArgumentException("b must be &gt;= 0");  // statements D
    }
    return result;
}</code></pre>
<p>Two JUnit 5 suites were run under JaCoCo 0.8.13 (JDK 21). <strong>Proper suite</strong> = the five columns of slide 39 (basic case + one condition changed at a time). <strong>Improper suite</strong> = the three columns of slide 49 (two conditions changed at once). Real output:</p>
<pre><code>##### proper suite (slide 39)
PASSED 0001-01-0010 N  a=5 b=10 -&gt; 2
PASSED 0001-01-0020 NL a=1 b=10 -&gt; 10
PASSED 0001-01-0030 EL a=0 b=10 -&gt; IllegalArgumentException
PASSED 0001-01-0040 NL a=5 b=0 -&gt; 0
PASSED 0001-01-0050 EL a=5 b=-1 -&gt; IllegalArgumentException
Tests run: 5, passed: 5, failed: 0
Method divide: lines 7/7, branches 4/4
##### improper suite (slide 49)
PASSED (1) a=5 b=10 -&gt; 2
PASSED (2) a=1 b=0 -&gt; 0 (two conditions changed)
PASSED (3) a=0 b=-1 -&gt; IllegalArgumentException (two conditions changed)
Tests run: 3, passed: 3, failed: 0
Method divide: lines 6/7, branches 3/4
  L10  PARTLY  if (b &gt;= 0) {                      // Condition 2  [branches 1/2]
  L13  MISSED  throw new IllegalArgumentException("b must be &gt;= 0");  // statements D</code></pre>
<p>All three improper cases <em>pass</em> — nothing looks wrong — yet statements D and the false outcome of condition 2 were never executed. Only the coverage report reveals it. Five cases give 100 % C0 and C1 and, as a bonus, test both boundaries of both conditions.</p>
<div class="pitfall co-tieu-de"><p><strong>Exam and review traps.</strong></p>
<ol>
<li><strong>“100 % decision coverage means every condition has been tested”</strong> — false for compound conditions (slide 53).</li>
<li><strong>Writing “a &gt; 0” or “valid value” in an input row</strong> — the guide demands specific values.</li>
<li><strong>Expected result written as “no error”</strong> — write the exact return value, exception class or message.</li>
<li><strong>Two columns with the same inputs but different expected results</strong> — this means an input (often DB data) is missing from the matrix (PCL deck slide 29).</li>
</ol></div>
<div class="callout"><p><span class="badge">★ Beyond the syllabus</span> <strong>MC/DC — what avionics requires.</strong></p>
<p>For <code>a &amp;&amp; b</code>, <em>Modified Condition/Decision Coverage</em> asks for cases showing that each condition <em>independently</em> changes the decision:</p>
<ul>
<li>(T,T)→T, (F,T)→F and (T,F)→F — exactly slide 53's cases (1)(2)(3); (F,F) is not needed.</li>
<li>For n conditions MC/DC needs about n + 1 cases instead of 2ⁿ.</li>
<li>DO-178C makes it mandatory for level-A flight software; ISO 26262 recommends it for the highest automotive safety level.</li>
</ul>
<p class="ghi-chu">Outside the syllabus because CTFL 2018 stops at decision coverage (condition-based techniques are in the Advanced Technical Test Analyst syllabus).</p></div>`,
    `<h3>Ví dụ có lời giải · Ma trận của bộ hướng dẫn, chạy thật</h3>
<p>Năm cột ở slide 39 mô tả một hàm trả về b ÷ a, yêu cầu a &gt; 0 và b ≥ 0. Viết bằng Java, đánh dấu các khối xử lý của lưu đồ:</p>
<pre><code>public static int divide(int a, int b) {
    int result;
    if (a &gt; 0) {                       // Condition 1
        result = 0;                    // statements A
    } else {
        throw new IllegalArgumentException("a must be &gt; 0");   // statements B
    }
    if (b &gt;= 0) {                      // Condition 2
        result = b / a;                // statements C
    } else {
        throw new IllegalArgumentException("b must be &gt;= 0");  // statements D
    }
    return result;
}</code></pre>
<p>Hai bộ JUnit 5 được chạy dưới JaCoCo 0.8.13 (JDK 21). <strong>Bộ đúng</strong> = năm cột của slide 39 (ca cơ sở + mỗi lần đổi một điều kiện). <strong>Bộ sai</strong> = ba cột của slide 49 (đổi hai điều kiện một lúc). Kết quả thật:</p>
<pre><code>##### proper suite (slide 39)
PASSED 0001-01-0010 N  a=5 b=10 -&gt; 2
PASSED 0001-01-0020 NL a=1 b=10 -&gt; 10
PASSED 0001-01-0030 EL a=0 b=10 -&gt; IllegalArgumentException
PASSED 0001-01-0040 NL a=5 b=0 -&gt; 0
PASSED 0001-01-0050 EL a=5 b=-1 -&gt; IllegalArgumentException
Tests run: 5, passed: 5, failed: 0
Method divide: lines 7/7, branches 4/4
##### improper suite (slide 49)
PASSED (1) a=5 b=10 -&gt; 2
PASSED (2) a=1 b=0 -&gt; 0 (two conditions changed)
PASSED (3) a=0 b=-1 -&gt; IllegalArgumentException (two conditions changed)
Tests run: 3, passed: 3, failed: 0
Method divide: lines 6/7, branches 3/4
  L10  PARTLY  if (b &gt;= 0) {                      // Condition 2  [branches 1/2]
  L13  MISSED  throw new IllegalArgumentException("b must be &gt;= 0");  // statements D</code></pre>
<p>Cả ba ca của bộ sai đều <em>pass</em> — nhìn không thấy gì sai — nhưng xử lý D và kết quả “sai” của điều kiện 2 chưa từng được chạy. Chỉ báo cáo coverage mới làm lộ ra. Năm ca cho C0 và C1 100 % và, thêm vào đó, thử cả hai biên của cả hai điều kiện.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy khi thi và khi review.</strong></p>
<ol>
<li><strong>“100 % decision coverage nghĩa là mọi điều kiện đã được test”</strong> — sai với điều kiện ghép (slide 53).</li>
<li><strong>Ghi “a &gt; 0” hay “giá trị hợp lệ” ở dòng đầu vào</strong> — bộ hướng dẫn đòi giá trị cụ thể.</li>
<li><strong>Ghi kết quả mong đợi là “không lỗi”</strong> — phải ghi đúng giá trị trả về, lớp exception hay thông báo.</li>
<li><strong>Hai cột cùng đầu vào mà khác kết quả mong đợi</strong> — nghĩa là ma trận còn thiếu một đầu vào (thường là dữ liệu DB) (slide 29 bộ PCL).</li>
</ol></div>
<div class="callout"><p><span class="badge">★ Ngoài giáo trình</span> <strong>MC/DC — thứ ngành hàng không bắt buộc.</strong></p>
<p>Với <code>a &amp;&amp; b</code>, <em>Modified Condition/Decision Coverage</em> đòi các ca cho thấy mỗi điều kiện <em>độc lập</em> làm đổi kết quả quyết định:</p>
<ul>
<li>(Đ,Đ)→Đ, (S,Đ)→S và (Đ,S)→S — đúng ba ca (1)(2)(3) của slide 53; không cần (S,S).</li>
<li>Với n điều kiện, MC/DC cần khoảng n + 1 ca thay vì 2ⁿ.</li>
<li>DO-178C bắt buộc MC/DC cho phần mềm bay mức A; ISO 26262 khuyến nghị nó cho mức an toàn ô tô cao nhất.</li>
</ul>
<p class="ghi-chu">Ngoài giáo trình vì CTFL 2018 dừng ở decision coverage (các kỹ thuật dựa trên điều kiện nằm trong syllabus Advanced Technical Test Analyst).</p></div>`),
    books([
      ['fst4', 'Ch.4 §3 “White-box test techniques” (statement and decision testing and coverage) — book pp.132–139, Table 4.4 control flow p.139', 'Chương 4 §3 “White-box test techniques” (statement/decision testing và coverage) — trang sách 132–139, Bảng 4.4 control flow trang 139'],
      ['sp5', '§5.2.1 Statement testing and coverage PDF p.215, §5.2.2 Decision testing and coverage PDF p.218, condition testing PDF p.221', '§5.2.1 Statement testing and coverage PDF 215, §5.2.2 Decision testing and coverage PDF 218, condition testing PDF 221'],
      ['sp4', '§5.2 White-box: statement coverage p.146, decision coverage p.148, condition coverage p.151 (PDF +15)', '§5.2 White-box: statement coverage trang 146, decision coverage 148, condition coverage 151 (PDF +15)'],
      ['junit', 'Ch.6 “Test quality” — code coverage PDF pp.103–105', 'Chương 6 “Test quality” — code coverage PDF 103–105'],
    ]),
  ].join('\n'),
};

/* ───────────── L2.4 Guide slides 68–88: appendix ───────────── */
const L24 = {
  title: 'L2.4 — Unit-testing guide (3): appendix — test order, formats, N/E/L/I, C0/C1/RC0|||L2.4 — Hướng dẫn unit test (3): phụ lục — thứ tự test, định dạng, N/E/L/I, C0/C1/RC0',
  slug: 'swt301-lab2-guide-appendix',
  type: 'VIDEO',
  description: 'Slide 68–88: kiến trúc 3 lớp và thứ tự unit test (D trước, rồi F/batch dùng D thật, P dùng stub), testing concern → test case → checklist (PCL/CCL/ACL), dạng danh sách vs ma trận, phân loại N/E/L/I, định nghĩa C0, C1, RC0.',
  content: [
    bi(`<span class="eyebrow">Lab 2 · Lesson L2.4 · A Guide for Unit Testing slides 68–88</span>
<h2>The appendix: background you are assumed to know</h2>
<p class="lead">The appendix explains six ideas the guide takes for granted: why a three-tier architecture, <strong>in which order</strong> units are tested (and with which real parts or stubs), how <strong>testing concerns, test cases and checklists</strong> differ, the <strong>list</strong> and <strong>matrix</strong> checklist formats, the <strong>N/E/L/I</strong> categories, and the formulas of <strong>C0, C1 and RC0</strong>.</p>
<div class="callout"><p><strong>Learning objectives</strong></p>
<ul>
<li>Explain bottom-up unit testing with drivers, real lower layers and stubs (LO-2.2.1, K2)</li>
<li>Distinguish test condition (concern), test case and test case specification (LO-1.4.2/1.4.3)</li>
<li>Choose list or matrix format</li>
<li>Assign N/E/L/I categories and map them to the template's N/A/B</li>
<li>Compute statement, decision and revised-statement coverage (LO-4.3.1/4.3.2, K2)</li>
</ul></div>
<div class="table-wrap"><table>
<thead><tr><th>Measure</th><th>Hitachi formula (slide 85)</th><th>ISTQB name</th></tr></thead>
<tbody>
<tr><td>C0</td><td>executed statements / all statements × 100 %</td><td>statement coverage</td></tr>
<tr><td>C1</td><td>executed branches / all branches × 100 %</td><td>decision (branch) coverage</td></tr>
<tr><td>RC0</td><td>executed revised statements / all revised statements × 100 %</td><td>statement coverage restricted to changed code (maintenance testing)</td></tr>
</tbody></table></div>`,
    `<span class="eyebrow">Lab 2 · Bài L2.4 · A Guide for Unit Testing slide 68–88</span>
<h2>Phụ lục: kiến thức nền bộ hướng dẫn coi như bạn đã biết</h2>
<p class="lead">Phụ lục giải thích sáu ý mà bộ hướng dẫn mặc định: vì sao dùng kiến trúc 3 lớp, unit được test <strong>theo thứ tự nào</strong> (dùng phần thật hay stub), <strong>testing concern, test case và checklist</strong> khác nhau ra sao, hai dạng checklist <strong>danh sách</strong> và <strong>ma trận</strong>, các loại <strong>N/E/L/I</strong>, và công thức <strong>C0, C1, RC0</strong>.</p>
<div class="callout"><p><strong>Chuẩn đầu ra</strong></p>
<ul>
<li>Giải thích unit test bottom-up với driver, lớp dưới thật và stub (LO-2.2.1, K2)</li>
<li>Phân biệt test condition (concern), test case và đặc tả test case (LO-1.4.2/1.4.3)</li>
<li>Chọn dạng danh sách hay ma trận</li>
<li>Gán phân loại N/E/L/I và quy đổi sang N/A/B của template</li>
<li>Tính statement, decision và revised-statement coverage (LO-4.3.1/4.3.2, K2)</li>
</ul></div>
<div class="table-wrap"><table>
<thead><tr><th>Chỉ số</th><th>Công thức Hitachi (slide 85)</th><th>Tên theo ISTQB</th></tr></thead>
<tbody>
<tr><td>C0</td><td>số câu lệnh đã chạy / tổng số câu lệnh × 100 %</td><td>statement coverage</td></tr>
<tr><td>C1</td><td>số nhánh đã chạy / tổng số nhánh × 100 %</td><td>decision (branch) coverage</td></tr>
<tr><td>RC0</td><td>số câu lệnh đã sửa được chạy / tổng số câu lệnh đã sửa × 100 %</td><td>statement coverage chỉ tính phần code thay đổi (maintenance testing)</td></tr>
</tbody></table></div>`),
    walkHead(G, 68, 88),
    walk(G, [
      [68, 'Appendix divider (Japanese)',
        `<p class="y-chinh">🎯 Divider of the appendix: “付録 関連知識” — “Appendix: related knowledge”.</p>
${JE(69)}`,
        `<p class="y-chinh">🎯 Trang ngăn của phụ lục: “付録 関連知識” — “Phụ lục: kiến thức liên quan”.</p>
${JV(69)}`],
      [69, 'Appendix: Related Information',
        `<p class="y-chinh">🎯 Divider: the appendix gives background knowledge in six sections, A-1 to A-6.</p>
<ul>
<li><strong>A-1</strong> — three-tier architecture (slides 70–71)</li>
<li><strong>A-2</strong> — order and environment of unit testing; four pages (72–75): the Japanese version fits on one page (72) plus a blank page (73), the English one needs two (74–75)</li>
<li><strong>A-3</strong> — testing concerns, test cases, checklists (76–79)</li>
<li><strong>A-4</strong> — list vs matrix format (80–81)</li>
<li><strong>A-5</strong> — test case categories N/E/L/I (82–83)</li>
<li><strong>A-6</strong> — code coverage C0/C1/RC0 (84–85)</li>
</ul>`,
        `<p class="y-chinh">🎯 Trang ngăn: phụ lục cung cấp kiến thức nền trong sáu mục, A-1 tới A-6.</p>
<ul>
<li><strong>A-1</strong> — kiến trúc 3 lớp (slide 70–71)</li>
<li><strong>A-2</strong> — thứ tự và môi trường unit test; bốn trang (72–75): bản tiếng Nhật gói trong một trang (72) cộng một trang trắng (73), bản tiếng Anh cần hai trang (74–75)</li>
<li><strong>A-3</strong> — testing concern, test case, checklist (76–79)</li>
<li><strong>A-4</strong> — dạng danh sách và dạng ma trận (80–81)</li>
<li><strong>A-5</strong> — phân loại test case N/E/L/I (82–83)</li>
<li><strong>A-6</strong> — code coverage C0/C1/RC0 (84–85)</li>
</ul>`],
      [70, 'A-1 Three-tier architecture (Japanese)',
        `<p class="y-chinh">🎯 ■ オンラインの構造（3層アーキテクチャ） — the structure of online processing: three layers, each with one job.</p>
${JE(71)}
<p class="nhan">The three layers</p>
<ul>
<li><strong>プレゼンテーション層 (presentation, P)</strong> — 画面処理全般（入出力、画面遷移等）: all screen processing (input/output, screen transitions).</li>
<li><strong>ファンクション層 (function, F)</strong> — 業務ロジック全般とトランザクション制御: all business logic and transaction control.</li>
<li><strong>データアクセス層 (data access, D)</strong> — データベースへのアクセス処理: database access.</li>
</ul>
<p class="nhan">Bottom line of the slide</p>
<p>3層構造により、保守性の向上、3層並行開発による期間短縮、層間の整合性チェックによる品質向上が期待できる — the three-tier structure promises:</p>
<ul>
<li>better <strong>maintainability</strong>;</li>
<li>shorter <strong>schedules</strong> by developing the three layers in parallel;</li>
<li>better <strong>quality</strong> through consistency checks between layers.</li>
</ul>`,
        `<p class="y-chinh">🎯 ■ オンラインの構造（3層アーキテクチャ） — cấu trúc xử lý online: ba lớp, mỗi lớp một việc.</p>
${JV(71)}
<p class="nhan">Ba lớp</p>
<ul>
<li><strong>プレゼンテーション層 (presentation, P)</strong> — 画面処理全般（入出力、画面遷移等）: toàn bộ xử lý màn hình (nhập/xuất, chuyển màn hình).</li>
<li><strong>ファンクション層 (function, F)</strong> — 業務ロジック全般とトランザクション制御: toàn bộ logic nghiệp vụ và điều khiển transaction.</li>
<li><strong>データアクセス層 (data access, D)</strong> — データベースへのアクセス処理: truy cập database.</li>
</ul>
<p class="nhan">Dòng cuối của slide</p>
<p>3層構造により、保守性の向上、3層並行開発による期間短縮、層間の整合性チェックによる品質向上が期待できる — cấu trúc 3 lớp hứa hẹn:</p>
<ul>
<li><strong>dễ bảo trì</strong> hơn;</li>
<li>rút ngắn <strong>tiến độ</strong> nhờ phát triển song song ba lớp;</li>
<li><strong>chất lượng</strong> tốt hơn nhờ kiểm tra tính nhất quán giữa các lớp.</li>
</ul>`],
      [71, 'A-1 Three-tier online processing architecture (English)',
        `<p class="y-chinh">🎯 The same layered diagram as slide 17 — and the reason layering helps testing: every layer has a clear interface.</p>
<p class="nhan">The picture</p>
<p>Views → presentation units → function units → data-access units → database. Only data-access units are allowed to touch the database.</p>
<p class="nhan">Three goals of the architecture</p>
<ul>
<li><strong>(a) Maintainability</strong> — improve it.</li>
<li><strong>(b) Development time</strong> — reduce it by developing the layers in parallel.</li>
<li><strong>(c) Quality</strong> — improve it by checking consistency between layers.</li>
</ul>
<p class="nhan">Why it matters for testing</p>
<p>A clear interface per layer is the natural place to put a <strong>driver</strong> above the unit and a <strong>stub</strong> (or the real, already tested layer) below it.</p>`,
        `<p class="y-chinh">🎯 Cùng sơ đồ phân lớp với slide 17 — và lý do phân lớp giúp kiểm thử: mỗi lớp có giao diện rõ ràng.</p>
<p class="nhan">Hình vẽ</p>
<p>View → unit presentation → unit function → unit data-access → database. Chỉ unit data-access được phép chạm vào database.</p>
<p class="nhan">Ba mục tiêu của kiến trúc</p>
<ul>
<li><strong>(a) Bảo trì</strong> — dễ bảo trì hơn.</li>
<li><strong>(b) Thời gian phát triển</strong> — giảm nhờ làm các lớp song song.</li>
<li><strong>(c) Chất lượng</strong> — nâng lên nhờ kiểm tra tính nhất quán giữa các lớp.</li>
</ul>
<p class="nhan">Vì sao quan trọng với kiểm thử</p>
<p>Giao diện rõ ràng của mỗi lớp là chỗ tự nhiên để đặt <strong>driver</strong> ở trên unit và <strong>stub</strong> (hoặc lớp thật đã test) ở dưới nó.</p>`],
      [72, 'A-2 Unit testing: order and environment (Japanese)',
        `<p class="y-chinh">🎯 ■ 単体テスト: P/F/D/batch units are checked against their specifications, in a fixed bottom-up order.</p>
${JE(74)}
<p class="nhan">The four bullets</p>
<ol>
<li><strong>D層の単体テストをDBに接続した状態で実施</strong> — D units are tested connected to the real DB.</li>
<li><strong>F layer</strong> — once D reaches its quality target, F units are tested using D as a library.</li>
<li><strong>Batch</strong> — batch units also use D as a library.</li>
<li><strong>P layer</strong> — P units use the tested F layer if possible (スタブ = stub if F is not ready in time).</li>
</ol>
<p class="nhan">Diagram labels</p>
<ul>
<li><strong>ドライバ</strong> — driver</li>
<li><strong>部品</strong> — common component</li>
<li><strong>画面</strong> — screen / view</li>
<li><strong>ファイル</strong> — file</li>
<li><strong>品質が確保されたD層をライブラリとして使用する</strong> — “use the quality-assured D layer as a library”</li>
</ul>`,
        `<p class="y-chinh">🎯 ■ 単体テスト: unit P/F/D/batch được kiểm theo đặc tả, theo một thứ tự bottom-up cố định.</p>
${JV(74)}
<p class="nhan">Bốn gạch đầu dòng</p>
<ol>
<li><strong>D層の単体テストをDBに接続した状態で実施</strong> — unit D được test khi kết nối DB thật.</li>
<li><strong>Lớp F</strong> — khi D đạt mục tiêu chất lượng thì test unit F dùng D như thư viện.</li>
<li><strong>Batch</strong> — unit batch cũng dùng D như thư viện.</li>
<li><strong>Lớp P</strong> — unit P dùng lớp F đã test nếu có thể (スタブ = stub nếu F chưa kịp xong).</li>
</ol>
<p class="nhan">Nhãn trên sơ đồ</p>
<ul>
<li><strong>ドライバ</strong> — driver</li>
<li><strong>部品</strong> — thành phần dùng chung</li>
<li><strong>画面</strong> — màn hình / view</li>
<li><strong>ファイル</strong> — file</li>
<li><strong>品質が確保されたD層をライブラリとして使用する</strong> — “dùng lớp D đã được bảo đảm chất lượng như thư viện”</li>
</ul>`],
      [73, 'A-2 blank page (Japanese: このページは空白です)',
        `<p class="y-chinh">🎯 An intentionally blank page — nothing to learn here.</p>
<p class="ghi-chu">🇯🇵 Japanese page.</p>
<ul>
<li><strong>The only text</strong> — <strong>このページは空白です</strong>, “this page is intentionally blank”.</li>
<li><strong>Why it exists</strong> — it keeps the Japanese/English page pairs aligned, because the English A-2 needs two pages (74 and 75).</li>
</ul>`,
        `<p class="y-chinh">🎯 Trang cố ý để trống — không có gì để học ở đây.</p>
<p class="ghi-chu">🇯🇵 Trang tiếng Nhật.</p>
<ul>
<li><strong>Chữ duy nhất</strong> — <strong>このページは空白です</strong>, “trang này cố ý để trống”.</li>
<li><strong>Vì sao có nó</strong> — giữ cho các cặp trang Nhật/Anh thẳng hàng, vì mục A-2 tiếng Anh cần hai trang (74 và 75).</li>
</ul>`],
      [74, 'A-2 Unit Testing (English text)',
        `<p class="y-chinh">🎯 Four rules fix the <strong>order</strong> of unit testing: bottom-up, lowest layer first.</p>
<p class="nhan">The four rules</p>
<ol>
<li><strong>Data-access units</strong> — test them against <strong>actual databases</strong> (no fake DB).</li>
<li><strong>Function units</strong> — once D units reach their quality objective, test F units using the <strong>tested D units as libraries</strong>.</li>
<li><strong>Batch main units</strong> — test them with the tested D units too.</li>
<li><strong>Presentation units</strong> — test them with <strong>stubs</strong>, or with tested F units when available.</li>
</ol>
<p class="nhan">Why this order</p>
<p>It is <strong>bottom-up</strong> integration of the layers inside unit testing: the lower layer is already trusted, so a failure points to the unit under test.</p>
<p class="nhan">In ISTQB words</p>
<p>The “component” is tested in isolation from <em>untested</em> parts: <strong>drivers</strong> call it, <strong>stubs</strong> stand in for what does not exist yet.</p>`,
        `<p class="y-chinh">🎯 Bốn quy tắc cố định <strong>thứ tự</strong> unit test: bottom-up, lớp thấp nhất trước.</p>
<p class="nhan">Bốn quy tắc</p>
<ol>
<li><strong>Unit data-access</strong> — test với <strong>database thật</strong> (không dùng DB giả).</li>
<li><strong>Unit function</strong> — khi unit D đạt mục tiêu chất lượng, test unit F dùng <strong>unit D đã test như thư viện</strong>.</li>
<li><strong>Batch main unit</strong> — cũng test với unit D đã test.</li>
<li><strong>Unit presentation</strong> — test bằng <strong>stub</strong>, hoặc bằng unit F đã test nếu có.</li>
</ol>
<p class="nhan">Vì sao theo thứ tự này</p>
<p>Đây là tích hợp <strong>bottom-up</strong> các lớp ngay trong unit test: lớp dưới đã đáng tin, nên hễ fail là lỗi nằm ở unit đang test.</p>
<p class="nhan">Theo cách nói ISTQB</p>
<p>“Component” được test tách khỏi các phần <em>chưa được test</em>: <strong>driver</strong> gọi nó, <strong>stub</strong> đứng thay cho những gì chưa tồn tại.</p>`],
      [75, 'A-2 Unit Testing (English diagrams)',
        `<p class="y-chinh">🎯 The four rules drawn as pictures — the thick frame marks the unit under test in each one.</p>
<p class="nhan">Left — online</p>
<ol>
<li><strong>D unit</strong> — <em>Driver → Data access layer unit → Database</em>.</li>
<li><strong>F unit</strong> — <em>Driver → Function layer unit → (tested) Data access unit + Common component → Database</em> (“use tested data access layer units as libraries”).</li>
<li><strong>P unit, option 1</strong> — <em>View → Presentation unit → tested Function unit → …</em> (“if tested function layer units are available, use them”).</li>
<li><strong>P unit, option 2</strong> — <em>View → Presentation unit → Stub</em> (“if not, use stubs”).</li>
</ol>
<p class="nhan">Right — batch</p>
<ol>
<li><strong>D unit</strong> — tested with a driver.</li>
<li><strong>Batch main unit</strong> — <em>Batch main unit → tested D unit → Database, plus File</em>.</li>
</ol>
<p class="ghi-chu">Exactly the structure of the JNAP batch system used in the black-box lab (action classes → DAOs → Oracle).</p>`,
        `<p class="y-chinh">🎯 Bốn quy tắc được vẽ thành hình — khung đậm đánh dấu unit đang test trong mỗi hình.</p>
<p class="nhan">Bên trái — online</p>
<ol>
<li><strong>Unit D</strong> — <em>Driver → unit Data access → Database</em>.</li>
<li><strong>Unit F</strong> — <em>Driver → unit Function → unit Data access (đã test) + Common component → Database</em> (“dùng unit data access đã test như thư viện”).</li>
<li><strong>Unit P, cách 1</strong> — <em>View → unit Presentation → unit Function đã test → …</em> (“nếu có unit function đã test thì dùng”).</li>
<li><strong>Unit P, cách 2</strong> — <em>View → unit Presentation → Stub</em> (“nếu chưa có thì dùng stub”).</li>
</ol>
<p class="nhan">Bên phải — batch</p>
<ol>
<li><strong>Unit D</strong> — test với driver.</li>
<li><strong>Batch main unit</strong> — <em>Batch main unit → unit D đã test → Database, kèm File</em>.</li>
</ol>
<p class="ghi-chu">Đúng cấu trúc của hệ thống batch JNAP dùng trong lab black-box (lớp action → DAO → Oracle).</p>`],
      [76, 'A-3 Testing concerns and test cases (Japanese)',
        `<p class="y-chinh">🎯 Two definitions: a testing concern (観点) is what to look at; a test case is one input + the result to confirm.</p>
${JE(77)}
<p class="nhan">a) チェックリスト作成観点 — testing concerns</p>
<p>Concerns decided at test-design time so that nothing is missed.</p>
<ul>
<li><strong>Business level (AT)</strong> — entering boundary values such as NULL does not create inconsistency in other business; behaviour on simultaneous login with the same ID.</li>
<li><strong>Programming level (CT, P)</strong> — screen output and DB update for correct input; component output at the boundary of a condition.</li>
</ul>
<p class="nhan">b) テストケース — test cases</p>
<p>A pair of input conditions and confirmation items. Example — item A accepts integers 1–9:</p>
<ol>
<li>A = 0 → <strong>異常</strong> (abnormal)</li>
<li>A = 1 → <strong>正常</strong> (normal)</li>
<li>A = 9 → <strong>正常</strong></li>
<li>A = 10 → <strong>異常</strong></li>
</ol>`,
        `<p class="y-chinh">🎯 Hai định nghĩa: testing concern (観点) là thứ cần để mắt tới; test case là một đầu vào + kết quả cần xác nhận.</p>
${JV(77)}
<p class="nhan">a) チェックリスト作成観点 — testing concern</p>
<p>Các quan điểm chốt lúc thiết kế test để không bỏ sót.</p>
<ul>
<li><strong>Mức nghiệp vụ (AT)</strong> — nhập giá trị biên như NULL không gây mâu thuẫn ở nghiệp vụ khác; hành vi khi đăng nhập đồng thời cùng một ID.</li>
<li><strong>Mức lập trình (CT, P)</strong> — output màn hình và cập nhật DB khi nhập đúng; output của component tại biên của điều kiện.</li>
</ul>
<p class="nhan">b) テストケース — test case</p>
<p>Cặp điều kiện đầu vào và nội dung xác nhận. Ví dụ — mục A nhận số nguyên 1–9:</p>
<ol>
<li>A = 0 → <strong>異常</strong> (bất thường)</li>
<li>A = 1 → <strong>正常</strong> (bình thường)</li>
<li>A = 9 → <strong>正常</strong></li>
<li>A = 10 → <strong>異常</strong></li>
</ol>`],
      [77, 'A-3 Testing concerns, test cases (English)',
        `<p class="y-chinh">🎯 A testing concern is a <em>type</em> of case to remember (ISTQB: test condition); a test case is a concrete pair of input and expected result derived from it.</p>
<p class="nhan">a) Testing concerns</p>
<p>Noticeable <em>types</em> of test case, fixed during test design to avoid insufficient testing — in ISTQB words, <strong>test conditions</strong> / checklist items.</p>
<ul>
<li><strong>Business-level examples</strong> — boundary values such as NULL entered in one process must not corrupt other processes; behaviour when one user ID logs in several times.</li>
<li><strong>Program-level examples</strong> — correct screen values and DB updates for correct input; correct output at the boundary values of branch conditions.</li>
</ul>
<p class="nhan">b) Test cases</p>
<p>Pairs of input conditions and expected results, <em>derived from</em> concerns.</p>
<p class="nhan">Example — item A accepts integers 1–9</p>
<ul>
<li><strong>A = 0</strong> → reject</li>
<li><strong>A = 1</strong> → accept</li>
<li><strong>A = 9</strong> → accept</li>
<li><strong>A = 10</strong> → reject</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> this is two-value boundary value analysis (LO-4.2.2) — each boundary and its invalid neighbour.</p>`,
        `<p class="y-chinh">🎯 Testing concern là một <em>kiểu</em> ca cần nhớ (ISTQB: test condition); test case là cặp đầu vào – kết quả mong đợi cụ thể suy ra từ nó.</p>
<p class="nhan">a) Testing concern</p>
<p>Các <em>kiểu</em> test case đáng chú ý, chốt lúc thiết kế test để khỏi test thiếu — theo ISTQB là <strong>test condition</strong> / mục checklist.</p>
<ul>
<li><strong>Ví dụ mức nghiệp vụ</strong> — giá trị biên như NULL nhập ở một nghiệp vụ không được làm hỏng nghiệp vụ khác; hành vi khi một user ID đăng nhập nhiều lần.</li>
<li><strong>Ví dụ mức chương trình</strong> — giá trị màn hình và cập nhật DB đúng khi nhập đúng; output đúng tại giá trị biên của điều kiện rẽ nhánh.</li>
</ul>
<p class="nhan">b) Test case</p>
<p>Cặp điều kiện đầu vào và kết quả mong đợi, <em>suy ra từ</em> concern.</p>
<p class="nhan">Ví dụ — mục A nhận số nguyên 1–9</p>
<ul>
<li><strong>A = 0</strong> → từ chối</li>
<li><strong>A = 1</strong> → nhận</li>
<li><strong>A = 9</strong> → nhận</li>
<li><strong>A = 10</strong> → từ chối</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> đây là phân tích giá trị biên hai giá trị (LO-4.2.2) — mỗi biên và láng giềng không hợp lệ của nó.</p>`],
      [78, 'A-3 c) Checklists for testing (Japanese)',
        `<p class="y-chinh">🎯 c) テスト用のチェックリスト — a list of test cases (input conditions and confirmation items), one per test level.</p>
${JE(79)}
<p>Made from each project's design documents and used to confirm the combinations of test case and expected result are realised.</p>
<ul>
<li><strong>PCL</strong> — 単体テスト用チェックリスト (unit test).</li>
<li><strong>CCL</strong> — 組合せテスト用チェックリスト (combination test).</li>
<li><strong>ACL</strong> — 連動テスト用チェックリスト (linked test).</li>
</ul>`,
        `<p class="y-chinh">🎯 c) テスト用のチェックリスト — danh sách test case (điều kiện đầu vào và nội dung xác nhận), mỗi cấp test một bản.</p>
${JV(79)}
<p>Làm từ tài liệu thiết kế của từng dự án, dùng để xác nhận các tổ hợp test case – kết quả mong đợi đã được hiện thực.</p>
<ul>
<li><strong>PCL</strong> — 単体テスト用チェックリスト (unit test).</li>
<li><strong>CCL</strong> — 組合せテスト用チェックリスト (test kết hợp).</li>
<li><strong>ACL</strong> — 連動テスト用チェックリスト (test liên động).</li>
</ul>`],
      [79, 'A-3 c) Checklists for Testing (English)',
        `<p class="y-chinh">🎯 A Checklist for Testing is a list of test cases prepared from the design documents — PCL, CCL and ACL, one per level.</p>
<p>It lists inputs + expected results and is used to verify that the software produces the expected values.</p>
<p class="nhan">One checklist per level</p>
<ul>
<li><strong>PCL</strong> — unit testing.</li>
<li><strong>CCL</strong> — Software Component Testing (integration of units).</li>
<li><strong>ACL</strong> — Application Software Testing (system).</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> the three levels of slide 13 each have their own checklist, and each is checked against the matching design level — the V-model again.</p>`,
        `<p class="y-chinh">🎯 Checklist for Testing là danh sách test case lập từ tài liệu thiết kế — PCL, CCL và ACL, mỗi cấp một bản.</p>
<p>Nó ghi đầu vào + kết quả mong đợi, dùng để xác nhận phần mềm cho ra đúng giá trị mong đợi.</p>
<p class="nhan">Mỗi cấp một checklist</p>
<ul>
<li><strong>PCL</strong> — unit test.</li>
<li><strong>CCL</strong> — Software Component Testing (tích hợp unit).</li>
<li><strong>ACL</strong> — Application Software Testing (hệ thống).</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> ba cấp ở slide 13 mỗi cấp có checklist riêng, và mỗi checklist đối chiếu với cấp thiết kế tương ứng — lại là mô hình V.</p>`],
      [80, 'A-4 Checklist formats (Japanese)',
        `<p class="y-chinh">🎯 リスト形式 (list format) vs マトリックス形式 (matrix format), each with メリット (advantages), デメリット (disadvantages) and 主な用途 (main use).</p>
${JE(81)}
<p class="nhan">List example (schedule screen)</p>
<ul>
<li><strong>用件に「テスト１変更」を入力し、「更新実行」ボタンを押下する</strong> — enter “Test 1 modified” as the subject and press “Execute update”.</li>
<li><strong>戻る</strong> — Back.</li>
<li><strong>1-1-0040: 年 2009 月 2 日 29</strong> → <strong>スケジュール更新画面が表示される</strong> (the Schedule <em>Update</em> screen is displayed) and 「予約年月日が不正です。」 (“the reservation date is invalid”).</li>
</ul>
<p class="nhan">Matrix example</p>
<p>引数 a (argument a), 引数 b, 戻り値 (return value).</p>`,
        `<p class="y-chinh">🎯 リスト形式 (dạng danh sách) và マトリックス形式 (dạng ma trận), mỗi dạng kèm メリット (ưu điểm), デメリット (nhược điểm) và 主な用途 (công dụng chính).</p>
${JV(81)}
<p class="nhan">Ví dụ danh sách (màn hình lịch)</p>
<ul>
<li><strong>用件に「テスト１変更」を入力し、「更新実行」ボタンを押下する</strong> — nhập “Test 1 modified” vào mục nội dung rồi bấm “Thực hiện cập nhật”.</li>
<li><strong>戻る</strong> — Quay lại.</li>
<li><strong>1-1-0040: 年 2009 月 2 日 29</strong> → <strong>スケジュール更新画面が表示される</strong> (hiện màn hình <em>Cập nhật</em> lịch) và 「予約年月日が不正です。」 (“ngày đặt không hợp lệ”).</li>
</ul>
<p class="nhan">Ví dụ ma trận</p>
<p>引数 a (tham số a), 引数 b, 戻り値 (giá trị trả về).</p>`],
      [81, 'A-4 Formats of Checklists for Testing (English)',
        `<p class="y-chinh">🎯 List format when each case has its own procedure; matrix format when one procedure is shared and only the values vary (unit tests).</p>
<div class="table-wrap"><table>
<thead><tr><th></th><th>List format (yellow)</th><th>Matrix format (pink)</th></tr></thead>
<tbody>
<tr><td>Shape</td><td>Each test case is a row of text — ID, input conditions, expected results</td><td>Rows = input conditions and expected results, columns = test cases</td></tr>
<tr><td>+</td><td>Easy to describe different or complex procedures per case</td><td>Easy to see the input/output values and to check completeness of combinations</td></tr>
<tr><td>−</td><td>Hard to see whether combinations of many inputs are complete</td><td>Hard to describe case-specific procedures</td></tr>
<tr><td>Used when</td><td><strong>Procedures differ per case</strong> (screens, system tests — the Sample_Test Cases.xlsx of L2.8 is a list)</td><td><strong>One procedure is shared and only values vary</strong> (unit tests)</td></tr>
</tbody></table></div>
<p class="nhan">The matrix example: a × b</p>
<ul>
<li>(1,10) → 10</li>
<li>(0,10) → 0</li>
<li>(1,1) → 1</li>
<li>(0,1) → 0</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Translation error on the slide:</strong> for 1-1-0040 (29 Feb 2009, not a leap year) the English says “The ‘Schedule List’ screen is displayed”, but the Japanese original says the <em>Schedule Update</em> screen stays displayed with the error — which is also the only sensible behaviour.</div>`,
        `<p class="y-chinh">🎯 Dạng danh sách khi mỗi ca có thủ tục riêng; dạng ma trận khi dùng chung một thủ tục và chỉ đổi giá trị (unit test).</p>
<div class="table-wrap"><table>
<thead><tr><th></th><th>Dạng danh sách (vàng)</th><th>Dạng ma trận (hồng)</th></tr></thead>
<tbody>
<tr><td>Hình dạng</td><td>Mỗi test case là một dòng chữ — ID, điều kiện đầu vào, kết quả mong đợi</td><td>Dòng = điều kiện đầu vào và kết quả mong đợi, cột = test case</td></tr>
<tr><td>+</td><td>Dễ mô tả thủ tục khác nhau hoặc phức tạp cho từng ca</td><td>Dễ nhìn giá trị vào/ra và kiểm độ đầy đủ của tổ hợp</td></tr>
<tr><td>−</td><td>Khó thấy các tổ hợp của nhiều đầu vào đã đủ chưa</td><td>Khó mô tả thủ tục riêng từng ca</td></tr>
<tr><td>Dùng khi</td><td><strong>Thủ tục mỗi ca khác nhau</strong> (màn hình, system test — file Sample_Test Cases.xlsx ở bài L2.8 là dạng danh sách)</td><td><strong>Một thủ tục chung, chỉ đổi giá trị</strong> (unit test)</td></tr>
</tbody></table></div>
<p class="nhan">Ví dụ ma trận: a × b</p>
<ul>
<li>(1,10) → 10</li>
<li>(0,10) → 0</li>
<li>(1,1) → 1</li>
<li>(0,1) → 0</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Lỗi dịch trên slide:</strong> với 1-1-0040 (29/2/2009, không phải năm nhuận) bản tiếng Anh ghi “màn hình ‘Schedule List’ được hiển thị”, nhưng bản gốc tiếng Nhật ghi màn hình <em>Cập nhật lịch</em> vẫn hiển thị kèm lỗi — và đó cũng là hành vi hợp lý duy nhất.</div>`],
      [82, 'A-5 Checklist categories (Japanese)',
        `<p class="y-chinh">🎯 ■チェックリスト区分 (checklist category): N or E for every case, plus L and I when they apply.</p>
${JE(83)}
<ul>
<li><strong>N 正常</strong> — normal result (no exception, error code or error message).</li>
<li><strong>E 異常</strong> — abnormal result (exception, error code, error message).</li>
<li><strong>L 限界・境界</strong> (additional) — limit/boundary.</li>
<li><strong>I インタフェース</strong> (additional) — interface of submodules.</li>
</ul>
<p>複数の区分にあてはまる場合、あてはまる区分の全てを記入する — enter every category that applies, e.g. N, L, I.</p>`,
        `<p class="y-chinh">🎯 ■チェックリスト区分 (phân loại checklist): mỗi ca là N hoặc E, cộng thêm L và I nếu áp dụng.</p>
${JV(83)}
<ul>
<li><strong>N 正常</strong> — kết quả bình thường (không exception, mã lỗi hay thông báo lỗi).</li>
<li><strong>E 異常</strong> — kết quả bất thường (exception, mã lỗi, thông báo lỗi).</li>
<li><strong>L 限界・境界</strong> (bổ sung) — giới hạn/biên.</li>
<li><strong>I インタフェース</strong> (bổ sung) — giao diện submodule.</li>
</ul>
<p>複数の区分にあてはまる場合、あてはまる区分の全てを記入する — ghi mọi loại áp dụng, ví dụ N, L, I.</p>`],
      [83, 'A-5 Test case category (English)',
        `<p class="y-chinh">🎯 Categories prove that <em>special</em> cases were written, not only happy paths: N or E by result, plus L and I tags.</p>
<p class="nhan">Exactly one of</p>
<ul>
<li><strong>N (Normal)</strong> — normal result without exceptions/error codes/messages.</li>
<li><strong>E (Error)</strong> — abnormal result.</li>
</ul>
<p class="nhan">In addition, when applicable</p>
<ul>
<li><strong>L (Limit or Boundary)</strong> — checks a range or branch condition with limit/boundary values.</li>
<li><strong>I (Interface)</strong> — checks the interface of a called submodule.</li>
</ul>
<p>The Venn diagram: L and I overlap both N and E. Example from the balloon: a case that checks a submodule's interface with a boundary value and expects a normal result is <strong>N, L, I</strong>.</p>
<div class="pitfall co-tieu-de"><strong>Different from FPT's template (L2.8):</strong> the template uses one letter per case — <strong>N / A (Abnormal) / B (Boundary)</strong> — and classifies by the <em>input</em>, while Hitachi classifies N/E by the <em>result</em> and adds L/I as extra tags.</div>`,
        `<p class="y-chinh">🎯 Phân loại chứng minh rằng các ca <em>đặc biệt</em> đã được viết, không chỉ ca suôn sẻ: N hoặc E theo kết quả, cộng nhãn L và I.</p>
<p class="nhan">Đúng một trong hai</p>
<ul>
<li><strong>N (Normal)</strong> — kết quả bình thường, không exception/mã lỗi/thông báo lỗi.</li>
<li><strong>E (Error)</strong> — kết quả bất thường.</li>
</ul>
<p class="nhan">Thêm vào đó, nếu áp dụng</p>
<ul>
<li><strong>L (Limit/Boundary)</strong> — kiểm một khoảng hay điều kiện rẽ nhánh bằng giá trị giới hạn/biên.</li>
<li><strong>I (Interface)</strong> — kiểm giao diện của submodule được gọi.</li>
</ul>
<p>Biểu đồ Venn: L và I chồng lên cả N và E. Ví dụ trong bóng chữ: ca kiểm giao diện submodule bằng giá trị biên và mong đợi kết quả bình thường là <strong>N, L, I</strong>.</p>
<div class="pitfall co-tieu-de"><strong>Khác với template của FPT (bài L2.8):</strong> template dùng mỗi ca một chữ — <strong>N / A (Abnormal) / B (Boundary)</strong> — và phân loại theo <em>đầu vào</em>, còn Hitachi phân N/E theo <em>kết quả</em> rồi gắn thêm L/I.</div>`],
      [84, 'A-6 Coverage (Japanese)',
        `<p class="y-chinh">🎯 ■カバレージ: the ratio of executed statements or branches — three formulas.</p>
${JE(85)}
<ol>
<li><strong>命令網羅 C0</strong> = 実行した行数 ／ 全行数 × 100 (executed lines / all lines).</li>
<li><strong>分岐網羅 C1</strong> = 実行した分岐数 ／ 全分岐数 × 100.</li>
<li><strong>修正網羅 RC0</strong> = 実行した修正行数 ／ 全修正行数 × 100 (修正箇所を対象とした命令網羅 — statement coverage of the modified places).</li>
</ol>
<p class="ghi-chu">Note that the Japanese defines C0 on <em>lines</em> (行数), the English on <em>statements</em>.</p>`,
        `<p class="y-chinh">🎯 ■カバレージ: tỉ lệ câu lệnh hoặc nhánh đã được chạy — ba công thức.</p>
${JV(85)}
<ol>
<li><strong>命令網羅 C0</strong> = 実行した行数 ／ 全行数 × 100 (số dòng đã chạy / tổng số dòng).</li>
<li><strong>分岐網羅 C1</strong> = 実行した分岐数 ／ 全分岐数 × 100.</li>
<li><strong>修正網羅 RC0</strong> = 実行した修正行数 ／ 全修正行数 × 100 (修正箇所を対象とした命令網羅 — phủ câu lệnh trên các chỗ sửa).</li>
</ol>
<p class="ghi-chu">Để ý bản Nhật định nghĩa C0 theo <em>dòng</em> (行数), bản Anh theo <em>câu lệnh</em>.</p>`],
      [85, 'A-6 Code coverage (English)',
        `<p class="y-chinh">🎯 “Code coverage is a metric describing the degree to which the statements or branches of a program have been executed”, measured with a coverage tool.</p>
<p class="nhan">The three formulas</p>
<ul>
<li><strong>C0 statement coverage</strong> = executed statements / all statements × 100 %.</li>
<li><strong>C1 decision coverage</strong> = executed branches / all branches × 100 %.</li>
<li><strong>RC0 revised-statement coverage</strong> = executed revised statements / all revised statements × 100 %.</li>
</ul>
<p class="nhan">Exam facts (LO-4.3.3)</p>
<ul>
<li><strong>100 % C1 ⇒ 100 % C0</strong>, not conversely.</li>
<li><strong>An <code>if</code> without <code>else</code></strong> can reach 100 % C0 with one test but needs two for C1.</li>
</ul>
<p class="nhan">Tools measure slightly differently</p>
<p>JaCoCo counts lines and bytecode branches (each operand of <code>&amp;&amp;</code>, <code>||</code> counts), so its “branch coverage” is stricter than textbook decision coverage.</p>`,
        `<p class="y-chinh">🎯 “Code coverage là thước đo mức độ các câu lệnh hay nhánh của chương trình đã được chạy”, đo bằng công cụ coverage.</p>
<p class="nhan">Ba công thức</p>
<ul>
<li><strong>C0 statement coverage</strong> = số câu lệnh đã chạy / tổng số câu lệnh × 100 %.</li>
<li><strong>C1 decision coverage</strong> = số nhánh đã chạy / tổng số nhánh × 100 %.</li>
<li><strong>RC0 revised-statement coverage</strong> = số câu lệnh đã sửa được chạy / tổng số câu lệnh đã sửa × 100 %.</li>
</ul>
<p class="nhan">Kiến thức thi (LO-4.3.3)</p>
<ul>
<li><strong>C1 100 % ⇒ C0 100 %</strong>, chiều ngược lại thì không.</li>
<li><strong>Một <code>if</code> không có <code>else</code></strong> đạt C0 100 % với một test nhưng cần hai test cho C1.</li>
</ul>
<p class="nhan">Các công cụ đo hơi khác nhau</p>
<p>JaCoCo đếm dòng và nhánh bytecode (mỗi vế của <code>&amp;&amp;</code>, <code>||</code> đều tính), nên “branch coverage” của nó chặt hơn decision coverage trong sách.</p>`],
      [86, 'END (Japanese)',
        `<p class="y-chinh">🎯 END page with 株式会社 日立製作所 情報・通信システム社 (Hitachi, Ltd., Information &amp; Telecommunication Systems Company).</p>
${JE(87)}`,
        `<p class="y-chinh">🎯 Trang END kèm 株式会社 日立製作所 情報・通信システム社 (Hitachi, Ltd., Công ty Hệ thống Thông tin &amp; Viễn thông).</p>
${JV(87)}`],
      [87, 'END (English)',
        `<p class="y-chinh">🎯 End of the guide — Information &amp; Telecommunication Systems Company, Hitachi, Ltd.</p>`,
        `<p class="y-chinh">🎯 Hết bộ hướng dẫn — Information &amp; Telecommunication Systems Company, Hitachi, Ltd.</p>`],
      [88, 'Hitachi logo (closing slide)',
        `<p class="y-chinh">🎯 Closing logo “HITACHI Inspire the Next”.</p>
<p class="ghi-chu">The speaker note in Japanese, 本日は有難うございました, means “thank you for today”.</p>`,
        `<p class="y-chinh">🎯 Logo kết “HITACHI Inspire the Next”.</p>
<p class="ghi-chu">Ghi chú của người trình bày bằng tiếng Nhật, 本日は有難うございました, nghĩa là “cảm ơn mọi người hôm nay”.</p>`],
    ]),
    bi(`<h3>Ví dụ có lời giải · Worked example — categories and RC0 for a maintenance change</h3>
<p>A customer asks to change <code>divide(a, b)</code> of L2.3: when b is negative the method must now return −1 instead of throwing. You change 2 statements (the <code>else</code> of condition 2 now contains <code>result = -1;</code>, and a new <code>log.warn(...)</code> line). The method now has 8 executable statements.</p>
<ol>
<li><strong>Which coverage applies?</strong> A modified unit → RC0 (slide 33). RC0 = executed revised statements / 2 revised statements.</li>
<li><strong>Re-run the old five cases.</strong> 0001-01-0050 (a = 5, b = −1) now hits both revised statements → RC0 = 2/2 = 100 %. Its expected result must be updated from “IllegalArgumentException” to “return −1” and its category from E L to <strong>N L</strong> (the result is now normal; b = −1 is still a boundary value).</li>
<li><strong>Regression.</strong> Slide 33 (5): after the change all five cases are re-run, not only 0050 — the other four must still give 2, 10, exception, 0.</li>
<li><strong>Template letters.</strong> In FPT's N/A/B scheme 0050 stays <strong>B</strong> (classified by its input, a boundary value), while 0030 (a = 0) is still B by input even though its result is an exception; a case with a = −7 would be <strong>A</strong>.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Don't mix up the three category schemes.</strong> Hitachi guide: N or E by <em>result</em>, plus L and I tags (several letters per case). PCL deck: 正 / 異 / 境 (normal / abnormal / boundary). FPT template: one of N, A, B per case, by the <em>type of input data</em>. Exam questions about ISTQB never use these letters — they ask about valid/invalid partitions and boundary values.</div>
<div class="callout"><p><span class="badge">★ Beyond the syllabus</span> <strong>Why Japanese projects count “test density” and “bug density”.</strong></p>
<p>Japanese quality management (e.g. the IPA/SEC software development data white papers) tracks, at every level:</p>
<ul>
<li><strong>Test cases per KLOC</strong> — the template's 100 TC/KLOC, the PCL deck's “100 TCs/KS”, where KS = kilo-steps ≈ KLOC.</li>
<li><strong>Bugs per KLOC</strong>, plotted as a reliability-growth curve (信頼度成長曲線) of bugs found over time.</li>
</ul>
<p>Too few bugs in unit testing is treated as a warning sign (tests too weak), not as good news — which is why slide 5 wants the UT-bug density to <em>rise</em> to the criterion.</p>
<p class="ghi-chu">Outside the syllabus because CTFL mentions defect density only as one of many test metrics.</p></div>`,
    `<h3>Ví dụ có lời giải · Phân loại và RC0 cho một thay đổi bảo trì</h3>
<p>Khách hàng yêu cầu sửa <code>divide(a, b)</code> ở bài L2.3: khi b âm thì method phải trả về −1 thay vì ném exception. Bạn sửa 2 câu lệnh (nhánh <code>else</code> của điều kiện 2 giờ chứa <code>result = -1;</code>, và thêm một dòng <code>log.warn(...)</code>). Method giờ có 8 câu lệnh thực thi được.</p>
<ol>
<li><strong>Dùng coverage nào?</strong> Unit sửa đổi → RC0 (slide 33). RC0 = số câu lệnh sửa đã chạy / 2 câu lệnh sửa.</li>
<li><strong>Chạy lại năm ca cũ.</strong> 0001-01-0050 (a = 5, b = −1) giờ đi qua cả hai câu lệnh sửa → RC0 = 2/2 = 100 %. Kết quả mong đợi của nó phải đổi từ “IllegalArgumentException” sang “trả về −1” và phân loại từ E L thành <strong>N L</strong> (kết quả giờ bình thường; b = −1 vẫn là giá trị biên).</li>
<li><strong>Regression.</strong> Slide 33 (5): sau khi sửa phải chạy lại cả năm ca, không chỉ 0050 — bốn ca kia vẫn phải cho 2, 10, exception, 0.</li>
<li><strong>Chữ trong template.</strong> Theo N/A/B của FPT, 0050 vẫn là <strong>B</strong> (phân theo đầu vào, một giá trị biên), còn 0030 (a = 0) vẫn là B theo đầu vào dù kết quả là exception; một ca a = −7 sẽ là <strong>A</strong>.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Đừng trộn ba cách phân loại.</strong> Hướng dẫn Hitachi: N hoặc E theo <em>kết quả</em>, cộng thêm nhãn L và I (một ca có thể nhiều chữ). Bộ slide PCL: 正 / 異 / 境 (bình thường / bất thường / biên). Template FPT: mỗi ca một trong N, A, B, theo <em>loại dữ liệu đầu vào</em>. Câu hỏi thi ISTQB không bao giờ dùng các chữ này — chúng hỏi về phân vùng hợp lệ/không hợp lệ và giá trị biên.</div>
<div class="callout"><p><span class="badge">★ Ngoài giáo trình</span> <strong>Vì sao dự án Nhật đếm “mật độ test” và “mật độ bug”.</strong></p>
<p>Quản lý chất lượng kiểu Nhật (ví dụ các sách trắng dữ liệu phát triển phần mềm của IPA/SEC) theo dõi ở mọi cấp:</p>
<ul>
<li><strong>Số test case trên KLOC</strong> — 100 TC/KLOC của template, “100 TCs/KS” của slide PCL, KS = kilo-step ≈ KLOC.</li>
<li><strong>Số bug trên KLOC</strong>, vẽ thành đường cong tăng trưởng độ tin cậy (信頼度成長曲線) của số bug tìm được theo thời gian.</li>
</ul>
<p>Quá ít bug ở unit test bị coi là dấu hiệu cảnh báo (test quá yếu), không phải tin vui — vì vậy slide 5 muốn mật độ bug UT <em>tăng</em> lên tới tiêu chuẩn.</p>
<p class="ghi-chu">Ngoài giáo trình vì CTFL chỉ nhắc defect density như một trong nhiều metric kiểm thử.</p></div>`),
    books([
      ['fst4', 'Ch.4 §3 white-box coverage (book pp.132–139); Ch.2 maintenance testing and impact analysis (within Ch.2, pp.36–74)', 'Chương 4 §3 coverage white-box (trang 132–139); Chương 2 maintenance testing và impact analysis (trong Chương 2, trang 36–74)'],
      ['sp5', '§3.4.1 Component testing, test drivers PDF pp.87–91; §5.2 white-box techniques PDF pp.214–232', '§3.4.1 Component testing, test driver PDF 87–91; §5.2 kỹ thuật white-box PDF 214–232'],
      ['fst', '§4.4 “Structure-based (white-box) techniques” — p.105 (PDF p.108)', '§4.4 “Structure-based (white-box) techniques” — trang 105 (PDF 108)'],
    ]),
  ].join('\n'),
};

/* ───────────── L2.5 How to write PCL (32 slides) ───────────── */
const L25 = {
  title: 'L2.5 — How to write a PCL (Program Check List)|||L2.5 — Cách viết PCL (Program Check List)',
  slug: 'swt301-lab2-how-to-write-pcl',
  type: 'VIDEO',
  description: 'Toàn bộ 32 slide “How to write PCL” (Hitachi Consulting): PCL là gì, đầu vào/đầu ra khi viết, 4 bước đọc DD (thông tin method, nhánh, input, expected), ví dụ getAccountTransferSummaryList, 12 quy tắc, luồng review PCL, luồng UT với công cụ, giá trị đặc biệt cho kiểm tra biên.',
  content: [
    bi(`<span class="eyebrow">Lab 2 · Lesson L2.5 · How to write PCL slides 1–32</span>
<h2>How to write a PCL</h2>
<p class="lead">A <strong>PCL (Program Check List)</strong> is the programmer's list of unit test cases for one method, written as a matrix from the <strong>detailed design</strong> before the code exists.</p>
<ul>
<li><strong>Columns</strong> — each column is a test case (a numbered case with its category normal / abnormal / boundary).</li>
<li><strong>Rows</strong> — each row is a specific input value or an expected value (return value, log message, exception, DB change).</li>
<li><strong>“O” marks</strong> — link a case to its rows.</li>
<li><strong>Life cycle</strong> — it is reviewed, then executed; the execution date and result are recorded on it.</li>
</ul>
<p>In the FPT template the same thing is called a <em>Unit Test Case</em> sheet. This deck from Hitachi Consulting's ICT Division (March 2017) shows how to fill one step by step from a real design.</p>
<div class="callout"><p><strong>Learning objectives</strong></p>
<ul>
<li>State what a PCL is, what goes into it and what comes out of writing it</li>
<li>Derive inputs and expected values from a method design (arguments, return value, exceptions, log, DB data)</li>
<li>Apply the 12 writing rules, including N/A/B cases and C0/C1 = 100 %</li>
<li>Describe the PCL review loop and the unit-test flow with its tools</li>
<li>Choose special values for boundary tests (LO-4.2.2, K3)</li>
</ul></div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">I</div><div class="lz-t">Method information</div><div class="lz-d">name, class, arguments, return value, exceptions</div></div>
  <div class="lz-step"><div class="lz-k">II</div><div class="lz-t">Branches to cover</div><div class="lz-d">every branch of the processing description</div></div>
  <div class="lz-step"><div class="lz-k">III</div><div class="lz-t">Input values</div><div class="lz-d">arguments + log level + settings + DB data</div></div>
  <div class="lz-step"><div class="lz-k">IV</div><div class="lz-t">Expected values</div><div class="lz-d">return value, messages, exceptions</div></div>
  <div class="lz-step"><div class="lz-k">→</div><div class="lz-t">Fill the matrix</div><div class="lz-d">IDs, values, O marks, N/A/B</div></div>
</div>`,
    `<span class="eyebrow">Lab 2 · Bài L2.5 · How to write PCL slide 1–32</span>
<h2>Cách viết PCL</h2>
<p class="lead"><strong>PCL (Program Check List)</strong> là danh sách unit test case của lập trình viên cho một method, viết dạng ma trận từ <strong>detailed design</strong> trước khi có code.</p>
<ul>
<li><strong>Cột</strong> — mỗi cột là một test case (một ca đánh số kèm phân loại normal / abnormal / boundary).</li>
<li><strong>Dòng</strong> — mỗi dòng là một giá trị đầu vào cụ thể hoặc một giá trị mong đợi (giá trị trả về, log message, exception, thay đổi DB).</li>
<li><strong>Dấu “O”</strong> — nối một ca với các dòng của nó.</li>
<li><strong>Vòng đời</strong> — PCL được review, rồi được chạy; ngày chạy và kết quả được ghi ngay trên đó.</li>
</ul>
<p>Trong template của FPT, thứ này gọi là sheet <em>Unit Test Case</em>. Bộ slide của phòng ICT, Hitachi Consulting (3/2017) chỉ cách điền từng bước từ một thiết kế thật.</p>
<div class="callout"><p><strong>Chuẩn đầu ra</strong></p>
<ul>
<li>Nói được PCL là gì, viết PCL cần gì và cho ra gì</li>
<li>Rút đầu vào và giá trị mong đợi từ thiết kế method (tham số, giá trị trả về, exception, log, dữ liệu DB)</li>
<li>Áp dụng 12 quy tắc viết, gồm ca N/A/B và C0/C1 = 100 %</li>
<li>Mô tả vòng review PCL và luồng unit test cùng công cụ</li>
<li>Chọn giá trị đặc biệt cho kiểm thử biên (LO-4.2.2, K3)</li>
</ul></div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">I</div><div class="lz-t">Thông tin method</div><div class="lz-d">tên, class, tham số, giá trị trả về, exception</div></div>
  <div class="lz-step"><div class="lz-k">II</div><div class="lz-t">Các nhánh cần phủ</div><div class="lz-d">mọi nhánh trong mô tả xử lý</div></div>
  <div class="lz-step"><div class="lz-k">III</div><div class="lz-t">Giá trị đầu vào</div><div class="lz-d">tham số + mức log + cấu hình + dữ liệu DB</div></div>
  <div class="lz-step"><div class="lz-k">IV</div><div class="lz-t">Giá trị mong đợi</div><div class="lz-d">giá trị trả về, message, exception</div></div>
  <div class="lz-step"><div class="lz-k">→</div><div class="lz-t">Điền ma trận</div><div class="lz-d">ID, giá trị, dấu O, N/A/B</div></div>
</div>`),
    walkHead(P, 1, 32),
    walk(P, [
      [1, 'Program Check List — PCL (cover)',
        `<p class="y-chinh">🎯 This is how the offshore side explains the Hitachi guide of L2.2–L2.4 to its own developers.</p>
<ul>
<li><strong>Title</strong> — <em>Program Check List — PCL</em>, ICT Division, March 2017.</li>
<li><strong>Author</strong> — Hitachi Consulting, with the “Global CyberSoft” logo (the Vietnamese offshore company Hitachi Consulting acquired).</li>
</ul>`,
        `<p class="y-chinh">🎯 Đây là cách phía offshore giải thích bộ hướng dẫn Hitachi (bài L2.2–L2.4) cho chính developer của mình.</p>
<ul>
<li><strong>Tựa đề</strong> — <em>Program Check List — PCL</em>, ICT Division, tháng 3/2017.</li>
<li><strong>Tác giả</strong> — Hitachi Consulting, kèm logo “Global CyberSoft” (công ty offshore Việt Nam được Hitachi Consulting mua lại).</li>
</ul>`],
      [2, 'Agenda',
        `<p class="y-chinh">🎯 The deck has five parts — the middle one, writing the PCL, is the core.</p>
<ol>
<li><strong>Concept</strong> — slides 3–6</li>
<li><strong>Write PCL document</strong> — slides 7–21</li>
<li><strong>After completed PCL document</strong> — slides 22–23</li>
<li><strong>Unit test flow</strong> — slides 24–27</li>
<li><strong>Best practice</strong> — slides 28–29</li>
</ol>`,
        `<p class="y-chinh">🎯 Bộ slide có năm phần — phần giữa, viết PCL, là cốt lõi.</p>
<ol>
<li><strong>Khái niệm</strong> — slide 3–6</li>
<li><strong>Viết tài liệu PCL</strong> — slide 7–21</li>
<li><strong>Sau khi viết xong PCL</strong> — slide 22–23</li>
<li><strong>Luồng unit test</strong> — slide 24–27</li>
<li><strong>Best practice</strong> — slide 28–29</li>
</ol>`],
      [3, 'What\'s PCL? (section divider)',
        `<p class="y-chinh">🎯 Section divider for part 1, “What's PCL?”, with the slogan “We Make it Happen. Better.”</p>`,
        `<p class="y-chinh">🎯 Trang ngăn phần 1, “What's PCL?”, kèm khẩu hiệu “We Make it Happen. Better.”</p>`],
      [4, 'What\'s PCL? — Concept',
        `<p class="y-chinh">🎯 The PCL is the <em>design</em> of your unit tests; the JUnit script is its <em>implementation</em>.</p>
<p class="nhan">The slide's two definitions</p>
<ul>
<li><strong>PCL is the Program checklist</strong> — the name.</li>
<li><strong>PCL is a collection of test cases</strong> (to implement the unit test script) — the part that matters: one test method per PCL column.</li>
</ul>
<p class="ghi-chu">The guide (slide 15 of L2.2) adds that “PCL” is Hitachi's historical name for the <em>checklist for unit testing</em>.</p>`,
        `<p class="y-chinh">🎯 PCL là <em>thiết kế</em> của unit test; JUnit script là <em>phần cài đặt</em> của nó.</p>
<p class="nhan">Hai định nghĩa trên slide</p>
<ul>
<li><strong>PCL là Program checklist</strong> — cái tên.</li>
<li><strong>PCL là tập hợp các test case</strong> (để cài đặt unit test script) — phần quan trọng: mỗi cột PCL thành một method test.</li>
</ul>
<p class="ghi-chu">Bộ hướng dẫn (slide 15, bài L2.2) nói thêm “PCL” là tên gọi lịch sử trong Hitachi cho <em>checklist cho unit test</em>.</p>`],
      [5, 'PCL template — header and blocks',
        `<p class="y-chinh">🎯 The PCL template has five coloured areas: who/what is tested at the top, inputs and expected values below.</p>
<p class="nhan">The five areas</p>
<ul>
<li><strong>Function ID</strong> (red) — the function being tested.</li>
<li><strong>Class's name</strong> (blue) — “Testing targeted class name”.</li>
<li><strong>Date perform PCL</strong> (green) — the testing date / environment block.</li>
<li><strong>Input value</strong> block (red, pink rows).</li>
<li><strong>Expected value</strong> block (blue, yellow rows).</li>
</ul>
<p class="nhan">Other header fields visible</p>
<p>System name, Document type “Matrix Checklist”, Approved by, UT process test type, Remarks, UT execution confirmation date.</p>
<p class="ghi-chu">Compare with the FPT template: Function Code, Function Name, Condition block, Confirm block (L2.8).</p>`,
        `<p class="y-chinh">🎯 Template PCL có năm vùng tô màu: phía trên là test cái gì, phía dưới là đầu vào và giá trị mong đợi.</p>
<p class="nhan">Năm vùng</p>
<ul>
<li><strong>Function ID</strong> (đỏ) — chức năng được test.</li>
<li><strong>Class's name</strong> (xanh) — “Testing targeted class name”.</li>
<li><strong>Date perform PCL</strong> (xanh lá) — khối ngày test / môi trường.</li>
<li>Khối <strong>Input value</strong> (đỏ, dòng hồng).</li>
<li>Khối <strong>Expected value</strong> (xanh, dòng vàng).</li>
</ul>
<p class="nhan">Các ô tiêu đề khác thấy được</p>
<p>System name, Document type “Matrix Checklist”, Approved by, UT process test type, Remarks, UT execution confirmation date.</p>
<p class="ghi-chu">So với template FPT: Function Code, Function Name, khối Condition, khối Confirm (bài L2.8).</p>`],
      [6, 'PCL template — columns and classification',
        `<p class="y-chinh">🎯 Each column of the PCL is one test case, and one row says which kind of case it is.</p>
<ul>
<li><strong>Each column is a test case</strong> (blue frame) — it holds its own input and expected values; case numbers 00001, 00002 … run along the top.</li>
<li><strong>Kind of test case</strong> (red frame) — the row “Classification (Normal / Abnormal / Boundary – Limit)”.</li>
</ul>
<p class="ghi-chu">The slide writes “Nomal, Abnomal” — typos for Normal, Abnormal. Same matrix idea as guide slide 39.</p>`,
        `<p class="y-chinh">🎯 Mỗi cột của PCL là một test case, và một dòng cho biết ca đó thuộc loại nào.</p>
<ul>
<li><strong>Mỗi cột là một test case</strong> (khung xanh) — chứa giá trị đầu vào và giá trị mong đợi của riêng nó; số ca 00001, 00002 … chạy dọc phía trên.</li>
<li><strong>Loại test case</strong> (khung đỏ) — dòng “Classification (Normal / Abnormal / Boundary – Limit)”.</li>
</ul>
<p class="ghi-chu">Slide viết “Nomal, Abnomal” — gõ nhầm của Normal, Abnormal. Cùng ý ma trận với slide 39 của bộ hướng dẫn.</p>`],
      [7, 'Write PCL document (section divider)',
        `<p class="y-chinh">🎯 Divider for the main part: writing the PCL document (slides 8–21).</p>
<p class="ghi-chu">The speaker note is a PowerPoint template instruction: “if the full presentation is internal or confidential, every slide must include a confidentiality statement” — hence the red CONFIDENTIAL footer on most slides.</p>`,
        `<p class="y-chinh">🎯 Trang ngăn phần chính: viết tài liệu PCL (slide 8–21).</p>
<p class="ghi-chu">Ghi chú người trình bày là hướng dẫn của mẫu PowerPoint: “nếu cả bài là nội bộ hay mật, mọi slide phải có dòng tuyên bố bảo mật” — vì thế hầu hết slide có chân trang đỏ CONFIDENTIAL.</p>`],
      [8, 'PCL writing input',
        `<p class="y-chinh">🎯 Four documents must be on your desk <em>before</em> you write a PCL.</p>
<ul>
<li><strong>PCL template document</strong> — the form to fill.</li>
<li><strong>Detail design</strong> — the test basis.</li>
<li><strong>PCL checklist</strong> — the self-review list; for Lab 2, the white-box/black-box checklists of L2.6/L2.7.</li>
<li><strong>PCL guideline</strong> — the guide of L2.2–L2.4.</li>
</ul>
<p>In ISTQB terms these are the inputs of test analysis and design: test basis, templates and standards.</p>`,
        `<p class="y-chinh">🎯 Bốn tài liệu phải có sẵn <em>trước</em> khi viết PCL.</p>
<ul>
<li><strong>Tài liệu template PCL</strong> — mẫu để điền.</li>
<li><strong>Detail design</strong> — test basis.</li>
<li><strong>PCL checklist</strong> — danh sách tự review; với Lab 2 là các checklist white-box/black-box ở bài L2.6/L2.7.</li>
<li><strong>PCL guideline</strong> — bộ hướng dẫn ở bài L2.2–L2.4.</li>
</ul>
<p>Theo ISTQB, đây là đầu vào của phân tích và thiết kế test: test basis, mẫu và tiêu chuẩn.</p>`],
      [9, 'PCL writing output',
        `<p class="y-chinh">🎯 Writing a PCL produces two things: the completed PCL document and a defects list.</p>
<ul>
<li><strong>Completed PCL document</strong> — the test cases, ready for review.</li>
<li><strong>Defects list</strong> — while turning a design into specific values you find gaps, contradictions and undefined behaviour in the design itself.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> these are defects found by test design before any code runs (SWT1: testing objective “preventing defects”).</p>`,
        `<p class="y-chinh">🎯 Viết PCL cho ra hai thứ: tài liệu PCL hoàn chỉnh và một danh sách defect.</p>
<ul>
<li><strong>Tài liệu PCL hoàn chỉnh</strong> — các test case, sẵn sàng để review.</li>
<li><strong>Danh sách defect</strong> — khi biến thiết kế thành giá trị cụ thể, bạn phát hiện chỗ thiếu, mâu thuẫn và hành vi chưa định nghĩa trong chính thiết kế.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> đó là defect được tìm nhờ thiết kế test trước khi có dòng code nào chạy (SWT1: mục tiêu “ngăn ngừa defect”).</p>`],
      [10, 'Steps: read the detail design and determine…',
        `<p class="y-chinh">🎯 Four things to extract from the design — slides 11–14 do one step each on the same example.</p>
<ol>
<li><strong>Information of the method</strong> — name, class name, arguments, return value, exceptions…</li>
<li><strong>The “brands” of the DS to cover</strong> — read “branches” of the design specification (the deck consistently writes <em>brands</em> for <em>branches</em>).</li>
<li><strong>The input values.</strong></li>
<li><strong>The expected values.</strong></li>
</ol>`,
        `<p class="y-chinh">🎯 Bốn thứ cần rút từ thiết kế — slide 11–14 mỗi slide làm một bước trên cùng một ví dụ.</p>
<ol>
<li><strong>Thông tin method</strong> — tên, tên class, tham số, giá trị trả về, exception…</li>
<li><strong>Các “brands” của DS cần phủ</strong> — đọc là “branches” (nhánh) của đặc tả thiết kế (cả bộ slide viết nhầm <em>brands</em> cho <em>branches</em>).</li>
<li><strong>Giá trị đầu vào.</strong></li>
<li><strong>Giá trị mong đợi.</strong></li>
</ol>`],
      [11, 'How to write — I Information of method',
        `<p class="y-chinh">🎯 Step I: read the method's signature from the design — here a method with <em>no</em> argument, so every input must come from elsewhere.</p>
<p class="nhan">The example</p>
<p>A service method <strong>getAccountTransferSummaryList</strong> (access: public) that retrieves data via a mapper, limiting the results to a pre-configured maximum number of records.</p>
<p class="nhan">Its design summary</p>
<ul>
<li><strong>Argument</strong> — none (“-”, blue frame).</li>
<li><strong>Return value</strong> — <code>accTransferSummaryList</code>, type <code>List&lt;Clm13ReqConfirmModel&gt;</code> (red frame).</li>
<li><strong>Exceptions</strong> — <code>DataConversionException</code> (when converting a date/time from String to Date) and <code>DataRetrievalException</code> (when calling the mapper).</li>
</ul>
<p class="nhan">Usual choice</p>
<p><strong>Arguments → input values, return value → expected values</strong>. “But in order to cover all branches in the method we need more input data” — here the method has no argument at all, so all inputs must come from elsewhere (settings, DB, log level).</p>`,
        `<p class="y-chinh">🎯 Bước I: đọc chữ ký method từ thiết kế — ở đây method <em>không</em> có tham số, nên mọi đầu vào phải đến từ chỗ khác.</p>
<p class="nhan">Ví dụ</p>
<p>Method service <strong>getAccountTransferSummaryList</strong> (public) lấy dữ liệu qua mapper, giới hạn kết quả theo số bản ghi tối đa đã cấu hình.</p>
<p class="nhan">Tóm tắt thiết kế</p>
<ul>
<li><strong>Argument</strong> — không có (“-”, khung xanh).</li>
<li><strong>Return value</strong> — <code>accTransferSummaryList</code>, kiểu <code>List&lt;Clm13ReqConfirmModel&gt;</code> (khung đỏ).</li>
<li><strong>Exception</strong> — <code>DataConversionException</code> (khi đổi ngày giờ từ String sang Date) và <code>DataRetrievalException</code> (khi gọi mapper).</li>
</ul>
<p class="nhan">Cách chọn thông thường</p>
<p><strong>Tham số → giá trị đầu vào, giá trị trả về → giá trị mong đợi</strong>. “Nhưng để phủ hết các nhánh của method ta cần thêm dữ liệu đầu vào” — ở đây method không có tham số nào, nên mọi đầu vào phải đến từ chỗ khác (cấu hình, DB, mức log).</p>`],
      [12, 'How to write — II Branches to cover',
        `<p class="y-chinh">🎯 Step II: mark every branch in the design's processing table — each “when …” is a decision with two outcomes.</p>
<p class="ghi-chu">The table columns: processing item, tag, contents of processing, remarks. The green arrows mark every branch to cover.</p>
<ol>
<li><strong>When log level is DEBUG</strong> → output the start log “getAccountTransferSummaryList Start”.</li>
<li>Declare the list and read <code>recordsLimit</code> from appConfig.</li>
<li><strong>Call mapper</strong> <code>AutomaticDraftCntMapper.selectAutomaticDraftCnt</code> with recordsLimit (max records), returning <code>List&lt;AutomaticDraftCntEntity&gt;</code>.</li>
<li><strong>When the mapper call has an exception</strong> → debug log and throw <code>DataRetrievalException</code> “Failed to get Account Transfer Summary Data”.</li>
<li><strong>When setting the data raises an exception</strong> → throw <code>DataConversionException</code> “Failed to convert from String to Date”.</li>
<li><strong>When log level is DEBUG</strong> → end log.</li>
<li>Return the list.</li>
</ol>`,
        `<p class="y-chinh">🎯 Bước II: đánh dấu mọi nhánh trong bảng mô tả xử lý của thiết kế — mỗi chữ “khi …” là một quyết định có hai kết quả.</p>
<p class="ghi-chu">Các cột của bảng: mục xử lý, tag, nội dung xử lý, ghi chú. Mũi tên xanh đánh dấu mọi nhánh phải phủ.</p>
<ol>
<li><strong>Khi mức log là DEBUG</strong> → ghi log bắt đầu “getAccountTransferSummaryList Start”.</li>
<li>Khai báo list và đọc <code>recordsLimit</code> từ appConfig.</li>
<li><strong>Gọi mapper</strong> <code>AutomaticDraftCntMapper.selectAutomaticDraftCnt</code> với recordsLimit (số bản ghi tối đa), trả về <code>List&lt;AutomaticDraftCntEntity&gt;</code>.</li>
<li><strong>Khi gọi mapper bị exception</strong> → ghi debug log và ném <code>DataRetrievalException</code> “Failed to get Account Transfer Summary Data”.</li>
<li><strong>Khi gán dữ liệu bị exception</strong> → ném <code>DataConversionException</code> “Failed to convert from String to Date”.</li>
<li><strong>Khi mức log là DEBUG</strong> → log kết thúc.</li>
<li>Trả về list.</li>
</ol>`],
      [13, 'III Determine input values',
        `<p class="y-chinh">🎯 Step III: the inputs of a unit are everything that influences its behaviour — here log level, a setting and DB data.</p>
<p class="ghi-chu">From the design pieces (“these images cut from DS at sheet No.13” — the design is an Excel sheet numbered 13).</p>
<p class="nhan">Three inputs</p>
<ul>
<li><strong>Log: DEBUG</strong> — the log level drives the start/end-log branches.</li>
<li><strong>recordsLimit</strong> — the configured maximum.</li>
<li><strong>Data stored in the database</strong> — what the mapper returns.</li>
</ul>
<p>“Exception depend on” data: the two exceptions are provoked by the input data (bad limit, bad date string in the DB).</p>
<p class="meo">🧠 <strong>Remember:</strong> inputs of a unit = everything that influences its behaviour, not only its parameters (guide slide 41).</p>`,
        `<p class="y-chinh">🎯 Bước III: đầu vào của unit là mọi thứ ảnh hưởng tới hành vi của nó — ở đây là mức log, một cấu hình và dữ liệu DB.</p>
<p class="ghi-chu">Từ các mảnh thiết kế (“ảnh cắt từ DS ở sheet No.13” — thiết kế là một sheet Excel đánh số 13).</p>
<p class="nhan">Ba đầu vào</p>
<ul>
<li><strong>Log: DEBUG</strong> — mức log điều khiển nhánh log bắt đầu/kết thúc.</li>
<li><strong>recordsLimit</strong> — giá trị tối đa đã cấu hình.</li>
<li><strong>Dữ liệu lưu trong database</strong> — thứ mapper trả về.</li>
</ul>
<p>“Exception depend on” dữ liệu: hai exception được gây ra bởi dữ liệu đầu vào (limit sai, chuỗi ngày sai trong DB).</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> đầu vào của unit = mọi thứ ảnh hưởng tới hành vi của nó, không chỉ tham số (slide 41 của bộ hướng dẫn).</p>`],
      [14, 'IV Expected values',
        `<p class="y-chinh">🎯 Step IV: expected = return value + observable side effects (log) + exceptions.</p>
<ul>
<li><strong>message</strong> — the start and end log lines, and the message when an exception occurs.</li>
<li><strong>accTransferSummaryList</strong> — the return value.</li>
<li><strong>Exception</strong> — DataConversionException, DataRetrievalException, from the “Exception output” rows.</li>
</ul>
<p class="ghi-chu">These are the template's Return / Exception / Log message rows.</p>`,
        `<p class="y-chinh">🎯 Bước IV: mong đợi = giá trị trả về + tác dụng phụ quan sát được (log) + exception.</p>
<ul>
<li><strong>message</strong> — dòng log bắt đầu, kết thúc, và thông báo khi có exception.</li>
<li><strong>accTransferSummaryList</strong> — giá trị trả về.</li>
<li><strong>Exception</strong> — DataConversionException, DataRetrievalException, từ các dòng “Exception output”.</li>
</ul>
<p class="ghi-chu">Đó chính là các dòng Return / Exception / Log message của template.</p>`],
      [15, 'Fill values — header',
        `<p class="y-chinh">🎯 First fill the header of the sheet — one sheet per method.</p>
<ul>
<li><strong>Function ID</strong> — here CLM13.</li>
<li><strong>Testing targeted class name</strong> — <code>Clm13ReqConfirmService</code>.</li>
<li><strong>UT process test type</strong> — “Function from another test”.</li>
<li><strong>Name of the method</strong> — getAccountTransferSummaryList, both at the top of the input block and on the sheet tab.</li>
</ul>`,
        `<p class="y-chinh">🎯 Trước hết điền phần đầu của sheet — mỗi method một sheet.</p>
<ul>
<li><strong>Function ID</strong> — ở đây CLM13.</li>
<li><strong>Testing targeted class name</strong> — <code>Clm13ReqConfirmService</code>.</li>
<li><strong>UT process test type</strong> — “Function from another test”.</li>
<li><strong>Tên method</strong> — getAccountTransferSummaryList, cả ở đầu khối input lẫn trên tab sheet.</li>
</ul>`],
      [16, 'Fill values — inputs and expected values',
        `<p class="y-chinh">🎯 Second step: write the inputs and expected values found on slides 13–14 as row labels — values come next.</p>
<ul>
<li><strong>Input values</strong> (red frame) — log, recordsLimit, data of database.</li>
<li><strong>Expected values</strong> (blue frame) — message, accTransferSummaryList, Exception.</li>
</ul>
<p>The value cells are still empty.</p>
<p class="ghi-chu">The slide says “sheet No.14, No.15” but means the deck's slides 13–14.</p>`,
        `<p class="y-chinh">🎯 Bước hai: ghi đầu vào và giá trị mong đợi tìm được ở slide 13–14 làm nhãn dòng — giá trị điền ở bước sau.</p>
<ul>
<li><strong>Giá trị đầu vào</strong> (khung đỏ) — log, recordsLimit, data of database.</li>
<li><strong>Giá trị mong đợi</strong> (khung xanh) — message, accTransferSummaryList, Exception.</li>
</ul>
<p>Các ô giá trị còn trống.</p>
<p class="ghi-chu">Slide ghi “sheet No.14, No.15” nhưng ý là slide 13–14 của bộ này.</p>`],
      [17, 'Fill values — choose values by normal / abnormal / boundary',
        `<p class="y-chinh">🎯 Next: choose the concrete values by category — normal, abnormal, boundary — eight cases 00001–00008.</p>
<p class="nhan">Classification row (Japanese abbreviations)</p>
<ul>
<li><strong>異</strong> — abnormal</li>
<li><strong>正</strong> — normal</li>
<li><strong>境</strong> — boundary</li>
</ul>
<p class="nhan">Inputs</p>
<ul>
<li><strong>log</strong> — DEBUG for all.</li>
<li><strong>recordsLimit</strong> — null, empty, 100, 99, ABC, −1, 0.</li>
<li><strong>database</strong> — files Clm13AutomaticDraftCntTblData1.txt / Data2.txt.</li>
</ul>
<p class="nhan">Expected</p>
<ul>
<li>The Start/End log.</li>
<li>“Failed to get Account Transfer Summary Data”, “Failed to convert from String to Date”.</li>
<li>Result file Clm13AutomaticDraftCntTblResultData.txt or an empty list.</li>
<li>DataRetrievalException, DataConversionException.</li>
</ul>
<p class="ghi-chu">The full reading and a critique are in the worked example below.</p>`,
        `<p class="y-chinh">🎯 Tiếp theo: chọn giá trị cụ thể theo loại — normal, abnormal, boundary — tám ca 00001–00008.</p>
<p class="nhan">Dòng phân loại (chữ viết tắt tiếng Nhật)</p>
<ul>
<li><strong>異</strong> — bất thường</li>
<li><strong>正</strong> — bình thường</li>
<li><strong>境</strong> — biên</li>
</ul>
<p class="nhan">Đầu vào</p>
<ul>
<li><strong>log</strong> — DEBUG cho tất cả.</li>
<li><strong>recordsLimit</strong> — null, empty, 100, 99, ABC, −1, 0.</li>
<li><strong>database</strong> — file Clm13AutomaticDraftCntTblData1.txt / Data2.txt.</li>
</ul>
<p class="nhan">Mong đợi</p>
<ul>
<li>Log Start/End.</li>
<li>“Failed to get Account Transfer Summary Data”, “Failed to convert from String to Date”.</li>
<li>File kết quả Clm13AutomaticDraftCntTblResultData.txt hoặc list rỗng.</li>
<li>DataRetrievalException, DataConversionException.</li>
</ul>
<p class="ghi-chu">Cách đọc đầy đủ và phần nhận xét nằm trong ví dụ có lời giải bên dưới.</p>`],
      [18, 'Fill values — each column is a test case',
        `<p class="y-chinh">🎯 “Each column corresponds with a test case, including input values and expected values.”</p>
<p class="ghi-chu">The slide says “each row” but the red frame is a <em>column</em> — case 00001.</p>
<p class="nhan">Example — case 00001</p>
<ul>
<li><strong>Inputs</strong> — log = DEBUG, recordsLimit = null.</li>
<li><strong>Expected</strong> — accTransferSummaryList = empty.</li>
<li><strong>Classification</strong> — 異 (abnormal).</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> this column becomes one JUnit test method: set log level, set recordsLimit to null, call the method, assert the list is empty.</p>`,
        `<p class="y-chinh">🎯 “Mỗi cột ứng với một test case, gồm giá trị đầu vào và giá trị mong đợi.”</p>
<p class="ghi-chu">Slide ghi “each row” nhưng khung đỏ là một <em>cột</em> — ca 00001.</p>
<p class="nhan">Ví dụ — ca 00001</p>
<ul>
<li><strong>Đầu vào</strong> — log = DEBUG, recordsLimit = null.</li>
<li><strong>Mong đợi</strong> — accTransferSummaryList = empty.</li>
<li><strong>Phân loại</strong> — 異 (bất thường).</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> cột này thành một method JUnit: đặt mức log, gán recordsLimit = null, gọi method, assert list rỗng.</p>`],
      [19, 'PCL writing rules 1–4',
        `<p class="y-chinh">🎯 Rules 1–4 of the 12: the developer writes it, it follows the DS strictly, values are specific, and it has normal, abnormal and boundary cases.</p>
<p class="ghi-chu">The slide's auto-numbering is broken — it shows 1, 1, 1, 1; read 1–4.</p>
<ol>
<li><strong>Author</strong> — the PCL is written by the <strong>developer</strong>.</li>
<li><strong>Basis</strong> — the PCL <strong>follows the DS strictly</strong>.</li>
<li><strong>Values</strong> — inputs and outputs are <strong>specific values</strong>.</li>
<li><strong>Case mix</strong> — the PCL must have <strong>normal, abnormal and boundary</strong> cases:
<ul>
<li><strong>Normal</strong> — values used mainly and usually, to show the function works.</li>
<li><strong>Boundary</strong> — limit values containing the upper and lower values.</li>
<li><strong>Abnormal</strong> — non-expected values, usually processed as exceptions.</li>
</ul></li>
</ol>
<div class="pitfall co-tieu-de"><strong>Error in the example:</strong> for 5 ≤ input ≤ 10 the slide calls 6, 7, 8, 9 normal, <strong>4 and 11 boundary</strong>, and −1, 12 abnormal. By boundary value analysis the boundaries are <strong>5 and 10</strong> (valid) with neighbours 4 and 11 (invalid) — the template's own guideline says “5, 10 are boundary values”. Use the template's version.</div>`,
        `<p class="y-chinh">🎯 Quy tắc 1–4 trong 12: developer viết, bám sát DS, giá trị cụ thể, và có đủ ca normal, abnormal, boundary.</p>
<p class="ghi-chu">Số tự động của slide bị hỏng — hiện 1, 1, 1, 1; đọc là 1–4.</p>
<ol>
<li><strong>Người viết</strong> — PCL do <strong>developer</strong> viết.</li>
<li><strong>Căn cứ</strong> — PCL <strong>bám sát DS</strong>.</li>
<li><strong>Giá trị</strong> — đầu vào và đầu ra là <strong>giá trị cụ thể</strong>.</li>
<li><strong>Loại ca</strong> — PCL phải có ca <strong>normal, abnormal và boundary</strong>:
<ul>
<li><strong>Normal</strong> — giá trị dùng chủ yếu, thường ngày, để thấy chức năng chạy.</li>
<li><strong>Boundary</strong> — giá trị giới hạn gồm giá trị trên và dưới.</li>
<li><strong>Abnormal</strong> — giá trị không mong đợi, thường được xử lý bằng exception.</li>
</ul></li>
</ol>
<div class="pitfall co-tieu-de"><strong>Lỗi trong ví dụ:</strong> với 5 ≤ input ≤ 10, slide gọi 6, 7, 8, 9 là normal, <strong>4 và 11 là boundary</strong>, còn −1, 12 là abnormal. Theo phân tích giá trị biên, biên là <strong>5 và 10</strong> (hợp lệ) với láng giềng 4 và 11 (không hợp lệ) — chính guideline của template ghi “5, 10 là giá trị biên”. Hãy theo bản của template.</div>`],
      [20, 'PCL writing rules 5–8',
        `<p class="y-chinh">🎯 Rules 5–8: log and exceptions, C0/C1 100 %, 100 test cases per KS, and the UI of every input/output item.</p>
<p class="ghi-chu">Shown as 5, 5, 5, 5; read 5–8.</p>
<ul>
<li><strong>5. Log and exceptions</strong> — mention clearly the <strong>log information and exceptions</strong>.</li>
<li><strong>6. Coverage</strong> — the PCL must cover <strong>C0/C1 100 %</strong>.</li>
<li><strong>7. Density</strong> — the PCL must reach <strong>100 test cases per KS</strong> (KS = kilo-steps ≈ 1,000 lines of code), with up to 30 % difference allowed — the same norm as the template's “Normal number of test cases/KLOC = 100”.</li>
<li><strong>8. Screen design (UI) of input/output items</strong> — confirm maximum length, display length, active/inactive, alignment (left, centre, right), initial value, input/output format (yyyyMMdd), colour.</li>
</ul>`,
        `<p class="y-chinh">🎯 Quy tắc 5–8: log và exception, C0/C1 100 %, 100 test case trên mỗi KS, và giao diện của từng mục vào/ra.</p>
<p class="ghi-chu">Hiện là 5, 5, 5, 5; đọc là 5–8.</p>
<ul>
<li><strong>5. Log và exception</strong> — ghi rõ <strong>thông tin log và exception</strong>.</li>
<li><strong>6. Coverage</strong> — PCL phải phủ <strong>C0/C1 100 %</strong>.</li>
<li><strong>7. Mật độ</strong> — PCL phải đạt <strong>100 test case trên mỗi KS</strong> (KS = kilo-step ≈ 1.000 dòng code), cho phép chênh tới 30 % — cùng định mức với “Normal number of test cases/KLOC = 100” của template.</li>
<li><strong>8. Thiết kế màn hình (UI) của mục vào/ra</strong> — xác nhận độ dài tối đa, độ dài hiển thị, bật/tắt, căn lề (trái, giữa, phải), giá trị ban đầu, định dạng vào/ra (yyyyMMdd), màu.</li>
</ul>`],
      [21, 'PCL writing rules 9–12',
        `<p class="y-chinh">🎯 Rules 9–12: expected results include what appears on screen, in files and in the database — not only return values.</p>
<p class="ghi-chu">Shown as 9, 9, 9, 9; read 9–12.</p>
<ul>
<li><strong>9. Screen layout</strong> — colour, character format (font size, type, character type), arrangement of elements, punctuation, itemisation, error display.</li>
<li><strong>10. Character encoding.</strong></li>
<li><strong>11. Log written to the log file.</strong></li>
<li><strong>12. DB changes</strong> — insert, update, delete.</li>
</ul>`,
        `<p class="y-chinh">🎯 Quy tắc 9–12: kết quả mong đợi gồm cả thứ hiện trên màn hình, trong file và trong database — không chỉ giá trị trả về.</p>
<p class="ghi-chu">Hiện là 9, 9, 9, 9; đọc là 9–12.</p>
<ul>
<li><strong>9. Bố cục màn hình</strong> — màu, định dạng chữ (cỡ, kiểu font, loại ký tự), sắp xếp phần tử, dấu câu, gạch đầu dòng, hiển thị lỗi.</li>
<li><strong>10. Mã hoá ký tự.</strong></li>
<li><strong>11. Log được ghi vào file log.</strong></li>
<li><strong>12. Thay đổi DB</strong> — insert, update, delete.</li>
</ul>`],
      [22, 'After completed PCL document (section divider)',
        `<p class="y-chinh">🎯 Divider: what happens once the PCL is written.</p>`,
        `<p class="y-chinh">🎯 Trang ngăn: chuyện gì xảy ra sau khi viết xong PCL.</p>`],
      [23, 'PCL flow',
        `<p class="y-chinh">🎯 The PCL review loop: self-check, team-lead review, fix + similar check — only a reviewed PCL may be turned into code.</p>
<ol>
<li><strong>Completed make PCL</strong> → <strong>self-check by the PCL checklist</strong>.</li>
<li><strong>Inform the team lead to review.</strong> If the team lead detects defects:
<ul>
<li><strong>Confirm with the team lead</strong>.</li>
<li><strong>Correct the PCL document</strong>.</li>
<li><strong>Similar check</strong> — look for the same mistake everywhere else you made it.</li>
<li>Back to review.</li>
</ul></li>
<li><strong>When accepted</strong> → <strong>implement the unit test script</strong>.</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> it is a small formal review process (Ch.3): individual preparation (self-check with a checklist), review by a reviewer, fixing and follow-up.</p>`,
        `<p class="y-chinh">🎯 Vòng review PCL: tự kiểm, team lead review, sửa + similar check — chỉ PCL đã được review mới được biến thành code.</p>
<ol>
<li><strong>Viết xong PCL</strong> → <strong>tự kiểm bằng PCL checklist</strong>.</li>
<li><strong>Báo team lead review.</strong> Nếu team lead phát hiện defect:
<ul>
<li><strong>Xác nhận với team lead</strong>.</li>
<li><strong>Sửa tài liệu PCL</strong>.</li>
<li><strong>Similar check</strong> — tìm cùng lỗi đó ở mọi chỗ khác mình đã làm.</li>
<li>Quay lại review.</li>
</ul></li>
<li><strong>Khi được chấp nhận</strong> → <strong>viết unit test script</strong>.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> đây là một quy trình review chính thức thu nhỏ (Chương 3): chuẩn bị cá nhân (tự kiểm theo checklist), review bởi người review, sửa và theo dõi.</p>`],
      [24, 'Unit test flow (section divider)',
        `<p class="y-chinh">🎯 Divider for the unit-test flow.</p>
<p class="ghi-chu">Same confidentiality speaker note as slide 7.</p>`,
        `<p class="y-chinh">🎯 Trang ngăn phần luồng unit test.</p>
<p class="ghi-chu">Cùng ghi chú bảo mật như slide 7.</p>`],
      [25, 'Unit test flow — develop UT scripts',
        `<p class="y-chinh">🎯 Three stages — write, review, execute — and the test code itself is reviewed: test scripts are work products too.</p>
<p class="nhan">1. Write UT scripts</p>
<ul>
<li>Follow the coding convention and the reviewed PCL.</li>
<li>Fix errors/warnings of the static checking tool.</li>
<li>Perform <strong>desk debugging</strong> with the DD checklist.</li>
<li>Commit to your SVN repository and open a review ticket in <strong>Fisheye and Crucible</strong> (Atlassian code-review tools).</li>
</ul>
<p class="nhan">2. Review UT scripts</p>
<ul>
<li>Check against the DD checklist and the PCL.</li>
<li>Record and follow up comments/defects in Crucible &amp; Fisheye; fix and similar-check each defect.</li>
<li>Share issues in the daily meeting; record defects in JIRA.</li>
</ul>
<p class="nhan">3. Execute UT</p>
<ul>
<li>Run the scripts in Eclipse; fix, record failed cases in JIRA and the <strong>B-Voucher</strong> (bug slip, the guide's Bug List).</li>
<li>Update the PCL with bugs and evidence.</li>
<li>Capture screenshots of the coverage result from <strong>djUnit</strong> (an Eclipse JUnit plug-in with coverage).</li>
</ul>`,
        `<p class="y-chinh">🎯 Ba giai đoạn — viết, review, chạy — và bản thân code test cũng được review: test script cũng là sản phẩm công việc.</p>
<p class="nhan">1. Viết UT script</p>
<ul>
<li>Theo coding convention và PCL đã review.</li>
<li>Sửa lỗi/cảnh báo của công cụ kiểm tĩnh.</li>
<li><strong>Desk debug</strong> theo DD checklist.</li>
<li>Commit vào repo SVN của mình và mở ticket review trên <strong>Fisheye và Crucible</strong> (công cụ review code của Atlassian).</li>
</ul>
<p class="nhan">2. Review UT script</p>
<ul>
<li>Đối chiếu DD checklist và PCL.</li>
<li>Ghi và theo dõi comment/defect trên Crucible &amp; Fisheye; sửa và similar-check từng defect.</li>
<li>Chia sẻ vấn đề trong họp hằng ngày; ghi defect vào JIRA.</li>
</ul>
<p class="nhan">3. Chạy UT</p>
<ul>
<li>Chạy script trong Eclipse; sửa, ghi ca fail vào JIRA và <strong>B-Voucher</strong> (phiếu bug, tức Bug List của bộ hướng dẫn).</li>
<li>Cập nhật PCL với bug và bằng chứng.</li>
<li>Chụp màn hình kết quả coverage của <strong>djUnit</strong> (plug-in JUnit cho Eclipse có đo coverage).</li>
</ul>`],
      [26, 'Unit test flow — input',
        `<p class="y-chinh">🎯 Inputs of the UT phase: the design, Hitachi's viewpoints, checklists, coding conventions and tools.</p>
<ul>
<li><strong>Detailed design documents.</strong></li>
<li><strong>PCL creation points from Hitachi</strong> — Checklist_creation_viewpoint.xlsx, the Testing Concerns (UnitTestPoints_EN.XLSX of L2.9 is this kind of file).</li>
<li><strong>PCL review checklist</strong> — PCL_Checklist.xlsx.</li>
<li><strong>Coding conventions</strong> — JavaCodingStandards.doc, JavaScriptCodingStandard.doc, NamingStandard.docx.</li>
<li><strong>Desk debug checklist</strong> — DDChecklist.xls.</li>
<li><strong>Code coverage tool</strong> — djUnit.</li>
<li><strong>Static checking tools</strong> — CheckStyle, FindBugs, SonarLint.</li>
</ul>
<p class="ghi-chu">Today's equivalents: JaCoCo or IntelliJ coverage, SpotBugs (successor of FindBugs), SonarLint.</p>`,
        `<p class="y-chinh">🎯 Đầu vào của pha UT: thiết kế, bộ quan điểm của Hitachi, các checklist, coding convention và công cụ.</p>
<ul>
<li><strong>Tài liệu detailed design.</strong></li>
<li><strong>Điểm tạo PCL của Hitachi</strong> — Checklist_creation_viewpoint.xlsx, tức Testing Concerns (file UnitTestPoints_EN.XLSX ở bài L2.9 là loại file này).</li>
<li><strong>Checklist review PCL</strong> — PCL_Checklist.xlsx.</li>
<li><strong>Coding convention</strong> — JavaCodingStandards.doc, JavaScriptCodingStandard.doc, NamingStandard.docx.</li>
<li><strong>Checklist desk debug</strong> — DDChecklist.xls.</li>
<li><strong>Công cụ coverage</strong> — djUnit.</li>
<li><strong>Công cụ kiểm tĩnh</strong> — CheckStyle, FindBugs, SonarLint.</li>
</ul>
<p class="ghi-chu">Tương đương ngày nay: JaCoCo hoặc coverage của IntelliJ, SpotBugs (kế thừa FindBugs), SonarLint.</p>`],
      [27, 'Unit test flow — output',
        `<p class="y-chinh">🎯 Outputs of the UT phase = the ISTQB “test work products” (LO-1.4.3) for one level.</p>
<ol class="hai-cot">
<li>PCL documents</li>
<li>UT scripts</li>
<li>UT B-Voucher (bug records)</li>
<li>Coverage report</li>
<li>Code-review defects in Crucible &amp; Fisheye and JIRA</li>
<li>Checkstyle and FindBugs reports on the Jenkins build server</li>
<li>Sonar static-checking report on the Sonar server</li>
<li><strong>Quality evaluation report for the UT phase</strong></li>
</ol>
<p>The last one feeds the leader's evaluation (guide slide 35).</p>`,
        `<p class="y-chinh">🎯 Đầu ra của pha UT = các “test work product” của ISTQB (LO-1.4.3) cho một cấp test.</p>
<ol class="hai-cot">
<li>Tài liệu PCL</li>
<li>UT script</li>
<li>UT B-Voucher (bản ghi bug)</li>
<li>Báo cáo coverage</li>
<li>Defect review code trên Crucible &amp; Fisheye và JIRA</li>
<li>Báo cáo Checkstyle và FindBugs trên máy build Jenkins</li>
<li>Báo cáo kiểm tĩnh trên máy chủ Sonar</li>
<li><strong>Báo cáo đánh giá chất lượng pha UT</strong></li>
</ol>
<p>Cái cuối cùng là đầu vào cho đánh giá của leader (slide 35 bộ hướng dẫn).</p>`],
      [28, 'Best Practice (section divider)',
        `<p class="y-chinh">🎯 Divider for the best-practice slide.</p>`,
        `<p class="y-chinh">🎯 Trang ngăn phần best practice.</p>`],
      [29, 'Best practice — choose data to test',
        `<p class="y-chinh">🎯 Three habits when choosing test data, and a table of special values for boundary tests.</p>
<p class="nhan">Keep in mind</p>
<ol>
<li><strong>Same inputs, different expected values?</strong> — an input is missing; add it (e.g. DB data or a setting).</li>
<li><strong>Method ends with an exception?</strong> — there is no return value; check only the <strong>kind of exception and its message</strong>.</li>
<li><strong>After writing the PCL</strong> — <strong>self-review it seriously with the PCL checklist</strong>.</li>
</ol>
<p class="nhan">Special values for boundary tests</p>
<ul>
<li><strong>Numbers</strong> — null, 0, −1 (test negatives even where only correct values can be entered).</li>
<li><strong>Strings</strong> — null, "" (empty), "  " (spaces).</li>
<li><strong>Date/time</strong> — 1/1, 12/31, 2/29, 2/28, 3/1; the Japanese era change <strong>昭和64年1月7日 (Shōwa 64, 7 Jan 1989 — the last day of the Shōwa era)</strong> and <strong>平成元年1月8日 (Heisei 1, 8 Jan 1989 — the first day of Heisei)</strong>; 0:00:00, 23:59:59; special dates of the specification.</li>
<li><strong>Files</strong> — 0 bytes, file exists or not.</li>
</ul>
<p class="ghi-chu">The same table is the “BoundaryLimitValue” sheet of the checklists (L2.6).</p>`,
        `<p class="y-chinh">🎯 Ba thói quen khi chọn dữ liệu test, và bảng giá trị đặc biệt cho test biên.</p>
<p class="nhan">Luôn nhớ</p>
<ol>
<li><strong>Cùng đầu vào mà khác giá trị mong đợi?</strong> — đang thiếu một đầu vào; bổ sung (ví dụ dữ liệu DB hay cấu hình).</li>
<li><strong>Method kết thúc bằng exception?</strong> — không có giá trị trả về; chỉ kiểm <strong>loại exception và message</strong>.</li>
<li><strong>Viết PCL xong</strong> — <strong>tự review nghiêm túc theo PCL checklist</strong>.</li>
</ol>
<p class="nhan">Giá trị đặc biệt cho test biên</p>
<ul>
<li><strong>Số</strong> — null, 0, −1 (thử cả số âm kể cả khi chỉ nhập được giá trị đúng).</li>
<li><strong>Chuỗi</strong> — null, "" (rỗng), "  " (khoảng trắng).</li>
<li><strong>Ngày giờ</strong> — 1/1, 12/31, 2/29, 2/28, 3/1; mốc đổi niên hiệu Nhật <strong>昭和64年1月7日 (Shōwa 64, 7/1/1989 — ngày cuối thời Shōwa)</strong> và <strong>平成元年1月8日 (Heisei 1, 8/1/1989 — ngày đầu thời Heisei)</strong>; 0:00:00, 23:59:59; các ngày đặc biệt trong đặc tả.</li>
<li><strong>File</strong> — 0 byte, file có hay không.</li>
</ul>
<p class="ghi-chu">Cùng bảng này là sheet “BoundaryLimitValue” của các checklist (bài L2.6).</p>`],
      [30, 'Questions and discussion',
        `<p class="y-chinh">🎯 Q&amp;A slide — two good questions to bring to class.</p>
<ol>
<li><strong>Which DB data counts as “input” for a DAO method?</strong></li>
<li><strong>How do you classify a value that is both a boundary and invalid</strong> (e.g. 11 for 5–10)? — UnitTestPoints (L2.9) answers it: some projects tag it both Limit and Abnormal; otherwise use the order Abnormal / Limit / Normal.</li>
</ol>`,
        `<p class="y-chinh">🎯 Slide hỏi đáp — hai câu hỏi hay để mang lên lớp.</p>
<ol>
<li><strong>Dữ liệu DB nào được coi là “đầu vào” của một method DAO?</strong></li>
<li><strong>Phân loại thế nào với giá trị vừa là biên vừa không hợp lệ</strong> (ví dụ 11 với khoảng 5–10)? — UnitTestPoints (bài L2.9) trả lời: có dự án gắn cả Limit lẫn Abnormal; nếu chỉ được một thì theo thứ tự ưu tiên Abnormal / Limit / Normal.</li>
</ol>`],
      [31, 'Thanks you',
        `<p class="y-chinh">🎯 Closing slide (“Thanks you” — sic).</p>`,
        `<p class="y-chinh">🎯 Slide kết (“Thanks you” — nguyên văn, sai ngữ pháp).</p>`],
      [32, 'Hitachi logo',
        `<p class="y-chinh">🎯 Logo page with the confidentiality footer.</p>`,
        `<p class="y-chinh">🎯 Trang logo kèm chân trang bảo mật.</p>`],
    ]),
    bi(`<h3>Ví dụ có lời giải · Worked example — reading (and reviewing) the PCL of slide 17</h3>
<p>The eight columns of the filled PCL for <code>getAccountTransferSummaryList</code>, read from the full-size slide (log = DEBUG in every case):</p>
<div class="table-wrap"><table>
<thead><tr><th>Case</th><th>Class.</th><th>recordsLimit</th><th>DB data</th><th>Expected</th></tr></thead>
<tbody>
<tr><td>00001</td><td>異 A</td><td>null</td><td>—</td><td>list empty</td></tr>
<tr><td>00002</td><td>異 A</td><td>empty</td><td>—</td><td>list empty</td></tr>
<tr><td>00003</td><td>正 N</td><td>100</td><td>TblData1.txt</td><td>list = TblResultData.txt</td></tr>
<tr><td>00004</td><td>正 N</td><td>99</td><td>—</td><td>list = TblResultData.txt</td></tr>
<tr><td>00005</td><td>異 A</td><td>ABC</td><td>—</td><td>message “Failed to get Account Transfer Summary Data”, DataRetrievalException</td></tr>
<tr><td>00006</td><td>境 B</td><td>−1</td><td>—</td><td>list empty</td></tr>
<tr><td>00007</td><td>境 B</td><td>0</td><td>—</td><td>list empty</td></tr>
<tr><td>00008</td><td>異 A</td><td>100</td><td>TblData2.txt (bad date)</td><td>message “Failed to convert from String to Date”, DataConversionException</td></tr>
</tbody></table></div>
<p><strong>Apply slide 29's first rule.</strong> 00003 and 00008 both have recordsLimit = 100 but different expected results — legitimate only because the DB data differs; that is why “Data of database” must be an input row. <strong>Review comments a team lead would write:</strong></p>
<ol>
<li>The “getAccountTransferSummaryList Start / End” message rows carry no “O” in any column — the DEBUG-log branches are listed as expected values but never confirmed (rule 5: log information must be clear).</li>
<li>00004 (99) has no DB data marked, yet expects the result file — either a precondition is missing or the case duplicates 00003.</li>
<li>No case with log level ≠ DEBUG, so the false outcome of “when log level is DEBUG” is never executed → C1 &lt; 100 % (rule 6).</li>
<li>Where is the boundary of the maximum? If the list holds more rows than recordsLimit, a case with exactly recordsLimit and recordsLimit + 1 rows in the DB is the real boundary; −1 and 0 are boundaries of “valid limit”, and their expected result “empty” should be confirmed against the design.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Boundary values in the PCL deck are off by one.</strong> Slide 19 says that for 5 ≤ x ≤ 10 the boundary values are 4 and 11. In ISTQB two-value BVA the boundary values are the edges of each partition: <strong>5 and 10</strong> (valid) and <strong>4 and 11</strong> (invalid neighbours); tests use all four. An exam option “the boundary values are 4 and 11” is wrong.</div>
<div class="callout"><p><span class="badge">★ Beyond the syllabus</span> <strong>From screenshots to CI evidence.</strong></p>
<p>The 2017 flow asks for screenshots of djUnit coverage and bugs typed into B-Vouchers. Modern teams let the build produce the evidence:</p>
<ol>
<li>Maven/Gradle run JUnit on every push.</li>
<li>JaCoCo writes an HTML/XML report.</li>
<li>The CI server (Jenkins, GitHub Actions) fails the build when line or branch coverage drops below a threshold (the JaCoCo <code>check</code> goal).</li>
<li>SonarQube shows coverage per changed line — an automated RC0.</li>
</ol>
<p class="ghi-chu">Outside the syllabus because CTFL treats tools generically (Ch.6) without covering build pipelines.</p></div>`,
    `<h3>Ví dụ có lời giải · Đọc (và review) PCL ở slide 17</h3>
<p>Tám cột của PCL đã điền cho <code>getAccountTransferSummaryList</code>, đọc từ slide cỡ lớn (log = DEBUG ở mọi ca):</p>
<div class="table-wrap"><table>
<thead><tr><th>Ca</th><th>Loại</th><th>recordsLimit</th><th>Dữ liệu DB</th><th>Mong đợi</th></tr></thead>
<tbody>
<tr><td>00001</td><td>異 A</td><td>null</td><td>—</td><td>list rỗng</td></tr>
<tr><td>00002</td><td>異 A</td><td>empty</td><td>—</td><td>list rỗng</td></tr>
<tr><td>00003</td><td>正 N</td><td>100</td><td>TblData1.txt</td><td>list = TblResultData.txt</td></tr>
<tr><td>00004</td><td>正 N</td><td>99</td><td>—</td><td>list = TblResultData.txt</td></tr>
<tr><td>00005</td><td>異 A</td><td>ABC</td><td>—</td><td>message “Failed to get Account Transfer Summary Data”, DataRetrievalException</td></tr>
<tr><td>00006</td><td>境 B</td><td>−1</td><td>—</td><td>list rỗng</td></tr>
<tr><td>00007</td><td>境 B</td><td>0</td><td>—</td><td>list rỗng</td></tr>
<tr><td>00008</td><td>異 A</td><td>100</td><td>TblData2.txt (ngày sai)</td><td>message “Failed to convert from String to Date”, DataConversionException</td></tr>
</tbody></table></div>
<p><strong>Áp quy tắc đầu tiên của slide 29.</strong> 00003 và 00008 cùng recordsLimit = 100 mà khác kết quả mong đợi — chỉ hợp lệ vì dữ liệu DB khác nhau; đó là lý do “Data of database” phải là một dòng đầu vào. <strong>Nhận xét review mà team lead sẽ ghi:</strong></p>
<ol>
<li>Các dòng message “getAccountTransferSummaryList Start / End” không có dấu “O” ở cột nào — nhánh log DEBUG được liệt kê là giá trị mong đợi nhưng chưa bao giờ được xác nhận (quy tắc 5: thông tin log phải rõ).</li>
<li>00004 (99) không đánh dữ liệu DB nào mà vẫn mong đợi file kết quả — hoặc thiếu precondition, hoặc ca này trùng với 00003.</li>
<li>Không có ca nào mức log ≠ DEBUG, nên kết quả “sai” của “khi mức log là DEBUG” chưa bao giờ được chạy → C1 &lt; 100 % (quy tắc 6).</li>
<li>Biên của số tối đa ở đâu? Nếu DB có nhiều dòng hơn recordsLimit, ca có đúng recordsLimit và recordsLimit + 1 dòng trong DB mới là biên thật; −1 và 0 là biên của “limit hợp lệ”, và kết quả “rỗng” của chúng cần được đối chiếu với thiết kế.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Giá trị biên trong bộ slide PCL bị lệch một đơn vị.</strong> Slide 19 nói với 5 ≤ x ≤ 10 thì giá trị biên là 4 và 11. Theo BVA hai giá trị của ISTQB, giá trị biên là mép của mỗi phân vùng: <strong>5 và 10</strong> (hợp lệ) và <strong>4 và 11</strong> (láng giềng không hợp lệ); test dùng cả bốn. Phương án thi “giá trị biên là 4 và 11” là sai.</div>
<div class="callout"><p><span class="badge">★ Ngoài giáo trình</span> <strong>Từ ảnh chụp màn hình tới bằng chứng CI.</strong></p>
<p>Luồng năm 2017 đòi chụp màn hình coverage djUnit và gõ bug vào B-Voucher. Nhóm hiện đại để bản build tự sinh bằng chứng:</p>
<ol>
<li>Maven/Gradle chạy JUnit mỗi lần push.</li>
<li>JaCoCo xuất báo cáo HTML/XML.</li>
<li>Máy CI (Jenkins, GitHub Actions) đánh fail bản build khi line hay branch coverage tụt dưới ngưỡng (goal <code>check</code> của JaCoCo).</li>
<li>SonarQube hiện coverage trên từng dòng thay đổi — một RC0 tự động.</li>
</ol>
<p class="ghi-chu">Ngoài giáo trình vì CTFL chỉ bàn công cụ một cách tổng quát (Chương 6), không đi vào pipeline build.</p></div>`),
    books([
      ['fst4', 'Ch.4 §2 black-box techniques — EP/BVA, Table 4.1 p.116 (book pp.112–120)', 'Chương 4 §2 kỹ thuật black-box — EP/BVA, Bảng 4.1 trang 116 (trang sách 112–120)'],
      ['sp5', '§5.1.1 Equivalence partitioning PDF p.165, §5.1.2 Boundary value analysis PDF p.176; §4.3 review process PDF p.132', '§5.1.1 Equivalence partitioning PDF 165, §5.1.2 Boundary value analysis PDF 176; §4.3 quy trình review PDF 132'],
      ['sp4', '§5.1.1 EP p.110, §5.1.2 BVA p.121 (PDF +15)', '§5.1.1 EP trang 110, §5.1.2 BVA trang 121 (PDF +15)'],
      ['junit', 'Ch.2 “Exploring core JUnit” PDF p.18; Ch.13 “Continuous integration” PDF p.254', 'Chương 2 “Exploring core JUnit” PDF 18; Chương 13 “Continuous integration” PDF 254'],
    ]),
  ].join('\n'),
};

/* ───────────── L2.6 Structural (white-box) deck + CheckList_UT_Whitebox ───────────── */
const WBCHECK = [
  ['1', 'Testcase', 'UT報告_XXX (UT report sheet)', 'Is the function name in the title really the function under test?', 'Tên function trong tiêu đề có đúng là function đang test không?'],
  ['2', '', '', 'Are all methods tested in this function filled in?', 'Đã điền đủ các method được test trong function chưa?'],
  ['3', '', '', 'Do the result-count formulas match the result data of the corresponding method sheet?', 'Công thức tính số liệu kết quả đã khớp với số liệu của sheet method tương ứng chưa?'],
  ['4', '', '更新履歴 (change history)', 'Is all information of the updated version filled in?', 'Đã điền đủ thông tin cho phiên bản cập nhật chưa?'],
  ['5', '', 'Tested method', 'Title: module ID, version, ID of the function under test correct?', 'Tiêu đề: đủ và đúng mã module, phiên bản, mã function test chưa?'],
  ['6', '', '', 'Header: function name, test-case author, creation date?', 'Header: tên function, người tạo test case, ngày tạo?'],
  ['7', '', '', 'Footer: function name, type of case (Normal, Abnormal)?', 'Footer: tên function, loại ca (Normal, Abnormal)?'],
  ['8', '', '', 'Footer: execution date, execution result?', 'Footer: ngày chạy test, kết quả chạy?'],
  ['9', '', '', 'Fonts, font sizes and formats consistent?', 'Font chữ, cỡ chữ, định dạng đã thống nhất chưa?'],
  ['10', '', '', 'All boundaries of every parameter checked?', 'Đã kiểm đủ các cận biên của tham số chưa?'],
  ['11', '', '', 'Abnormal cases handled?', 'Đã kiểm các ca abnormal chưa?'],
  ['12', '', '', 'Do the test cases cover the whole source code?', 'Test case đã phủ toàn bộ source code chưa?'],
  ['13', '', '', 'Log output confirmed for abnormal and normal runs?', 'Đã xác nhận log khi chương trình chạy abnormal hoặc normal chưa?'],
  ['14', '', '', 'Input parameters chosen for every test case?', 'Đã chọn đủ tham số input cho từng test case chưa?'],
  ['15', '', '', 'Expected result chosen for every test case?', 'Đã chọn phần kết quả mong đợi cho từng test case chưa?'],
  ['16', 'Testdata', '', 'Enough test data created?', 'Đã tạo đủ số lượng test data chưa?'],
  ['17', '', '', 'Does the test data satisfy each case\'s conditions?', 'Test data đã đúng điều kiện của test case chưa?'],
  ['18', '', '', 'Can the test data be inserted into the DB without errors?', 'Đã bảo đảm insert test data vào DB không lỗi chưa?'],
  ['19', 'Testscript', '', 'A test script for every test case described?', 'Đã tạo đủ test script so với mô tả test case chưa?'],
  ['20', '', '', 'Does each script match its case (input and output conditions)?', 'Test script đã đúng yêu cầu của test case chưa (điều kiện input, output)?'],
  ['21', '', '', 'Do the scripts run without errors?', 'Chạy test script có bị lỗi không?'],
  ['22', '', '', 'Does each script really return true/false (a real assertion)?', 'Kết quả trả về của test script có đúng là true/false không (có assertion thật)?'],
];
const wbRows = (vi) => WBCHECK.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${vi ? r[4] : r[3]}</td></tr>`).join('');
const L26 = {
  title: 'L2.6 — White-box Lab 2: structural component testing + checklist|||L2.6 — Lab 2 white-box: component test cấu trúc + checklist',
  slug: 'swt301-lab2-whitebox',
  type: 'VIDEO',
  description: '13 slide đề bài Lab 2 white-box (unit test trong SDLC, white/black/grey box, lợi ích, unit test tốt, đề bài + thang điểm theo LOC, NUnit/JUnit/TestNG) + 22 mục CheckList_UT_Whitebox và sheet giá trị biên; ví dụ JUnit + JaCoCo đạt C0/C1 100 %.',
  content: [
    bi(`<span class="eyebrow">Lab 2 · Lesson L2.6 · Lab2_component(Structural)testing slides 1–13 + CheckList_UT_Whitebox.xlsx</span>
<h2>White-box Lab 2: test your own code to C0 = C1 = 100 %</h2>
<p class="lead">The structural variant of Lab 2: you take source code from your SWP391 project, design unit test cases in the template, implement them with a unit-test framework (JUnit for Java) and prove with a coverage report that every statement (C0) and every decision outcome (C1) has been executed.</p>
<ul>
<li><strong>The deck is short</strong> — unit testing in the SDLC, the three box techniques, benefits, what makes a good unit test, the lab brief and the tools.</li>
<li><strong>The white-box checklist</strong> — the self-review you run before you submit.</li>
</ul>
<div class="callout"><p><strong>Learning objectives</strong></p>
<ul>
<li>Explain who performs unit testing and why it is done early (LO-2.2.1)</li>
<li>Distinguish white-box, black-box and grey-box testing (LO-4.1.1, K2)</li>
<li>Apply statement and decision coverage to your own code (LO-4.3.1/4.3.2)</li>
<li>List the properties of good unit tests (single unit, isolated, fast, repeatable, clearly named)</li>
<li>Self-check a Lab 2 submission with the 22-item checklist</li>
</ul></div>`,
    `<span class="eyebrow">Lab 2 · Bài L2.6 · Lab2_component(Structural)testing slide 1–13 + CheckList_UT_Whitebox.xlsx</span>
<h2>Lab 2 white-box: test code của chính bạn tới C0 = C1 = 100 %</h2>
<p class="lead">Biến thể cấu trúc của Lab 2: bạn lấy source code từ dự án SWP391, thiết kế unit test case trong template, cài đặt bằng một unit-test framework (JUnit với Java) và chứng minh bằng báo cáo coverage rằng mọi câu lệnh (C0) và mọi kết quả quyết định (C1) đều đã được chạy.</p>
<ul>
<li><strong>Bộ slide ngắn</strong> — unit test trong SDLC, ba kỹ thuật “hộp”, lợi ích, thế nào là unit test tốt, đề bài và công cụ.</li>
<li><strong>Checklist white-box</strong> — bản tự review bạn chạy trước khi nộp.</li>
</ul>
<div class="callout"><p><strong>Chuẩn đầu ra</strong></p>
<ul>
<li>Giải thích ai làm unit test và vì sao làm sớm (LO-2.2.1)</li>
<li>Phân biệt white-box, black-box và grey-box (LO-4.1.1, K2)</li>
<li>Áp dụng statement và decision coverage trên code của mình (LO-4.3.1/4.3.2)</li>
<li>Kể được tính chất của unit test tốt (một unit, cô lập, nhanh, lặp lại được, đặt tên rõ)</li>
<li>Tự kiểm bài nộp Lab 2 bằng checklist 22 mục</li>
</ul></div>`),
    walkHead(WB, 1, 13),
    walk(WB, [
      [1, 'LAB2: Component (structural) testing using unit test framework',
        `<p class="y-chinh">🎯 The title already says the whole lab: test one component from its code, and write the tests as code.</p>
<p class="nhan">Read the title word by word</p>
<ul>
<li><strong>Component</strong> — the unit level: one method, function or class (ISTQB component testing).</li>
<li><strong>Structural</strong> — white-box: test cases are derived from the internal structure (the code), and success is measured by structural coverage.</li>
<li><strong>Using a unit test framework</strong> — the tests are code (JUnit), not only a spreadsheet.</li>
</ul>`,
        `<p class="y-chinh">🎯 Tựa đề đã nói hết bài lab: test một component dựa trên code của nó, và viết test thành code.</p>
<p class="nhan">Đọc tựa đề từng chữ</p>
<ul>
<li><strong>Component</strong> — cấp unit: một method, hàm hoặc class (component testing của ISTQB).</li>
<li><strong>Structural</strong> — white-box: test case rút ra từ cấu trúc bên trong (code), và thành công đo bằng coverage cấu trúc.</li>
<li><strong>Bằng unit test framework</strong> — test là code (JUnit), không chỉ là bảng tính.</li>
</ul>`],
      [2, 'Unit testing in the SDLC',
        `<p class="y-chinh">🎯 Unit testing is as old as programming, and it is normally done by the developer who wrote the code.</p>
<p class="nhan">The four bullets</p>
<ul>
<li><strong>Not new</strong> — it has been there since the early days of programming.</li>
<li><strong>Improves code quality</strong> — by verifying every unit of the code used to implement the functional requirements.</li>
<li><strong>Basis of TDD</strong> — test-driven development, i.e. test-first development (the slide misspells it “Test drove development”).</li>
<li><strong>Done by developers and sometimes white-box testers</strong> (in red) — the ISTQB answer to “who does component testing?”: usually the developer who wrote the code.</li>
</ul>`,
        `<p class="y-chinh">🎯 Unit test có từ thuở đầu của lập trình, và thường do chính developer viết code đó thực hiện.</p>
<p class="nhan">Bốn gạch đầu dòng</p>
<ul>
<li><strong>Không phải khái niệm mới</strong> — có từ thuở đầu của lập trình.</li>
<li><strong>Nâng chất lượng code</strong> — bằng cách kiểm từng unit của code dùng để hiện thực yêu cầu chức năng.</li>
<li><strong>Nền tảng của TDD</strong> — test-driven development, tức phát triển test trước (slide viết nhầm “Test drove development”).</li>
<li><strong>Do developer làm, đôi khi do tester white-box</strong> (chữ đỏ) — đúng câu trả lời ISTQB cho “ai làm component testing?”: thường là developer viết ra code đó.</li>
</ul>`],
      [3, 'Unit testing in the SDLC (2) — and the warning',
        `<p class="y-chinh">🎯 Unit tests pay off only when they are good — an empty test that always passes is worse than none.</p>
<p class="nhan">What unit testing gives you</p>
<ul>
<li><strong>Robust components</strong> — it helps design them, maintain code and remove issues in code units.</li>
<li><strong>Early defects</strong> — defects are found and fixed early in the development cycle.</li>
<li><strong>Agile</strong> — it is an integral part of agile development (“an related part” is a typo for “integral”, as the teacher's note “Integral: liên quan” hints).</li>
<li><strong>Standard process</strong> — made a standard step, it catches many defects early and saves testing time.</li>
</ul>
<p class="nhan">The red Notes — the warning</p>
<ul>
<li><strong>Many developers hate unit tests</strong> — under schedule pressure they skip them or write bad ones.</li>
<li><strong>Empty tests</strong> — some even write empty unit tests so that 100 % of them pass.</li>
<li><strong>The rule</strong> — “It's important to write good unit tests or don't write them at all.”</li>
</ul>
<p>That is why item 22 of the lab checklist asks whether each script really asserts something.</p>`,
        `<p class="y-chinh">🎯 Unit test chỉ có ích khi viết tốt — một test rỗng luôn pass còn tệ hơn không có.</p>
<p class="nhan">Unit test mang lại gì</p>
<ul>
<li><strong>Component vững chắc</strong> — giúp thiết kế chúng, bảo trì code và loại bỏ lỗi trong từng unit.</li>
<li><strong>Lỗi được bắt sớm</strong> — defect được tìm và sửa sớm trong vòng đời phát triển.</li>
<li><strong>Agile</strong> — là phần gắn liền của phát triển agile (“an related part” là gõ nhầm của “integral”, như ghi chú của thầy/cô “Integral: liên quan” gợi ý).</li>
<li><strong>Quy trình chuẩn</strong> — làm thành bước chuẩn thì bắt được nhiều defect sớm và tiết kiệm thời gian test.</li>
</ul>
<p class="nhan">Phần Notes màu đỏ — lời cảnh báo</p>
<ul>
<li><strong>Nhiều developer ghét unit test</strong> — vì áp lực tiến độ nên bỏ qua hoặc viết qua loa.</li>
<li><strong>Test rỗng</strong> — có người còn viết unit test rỗng để 100 % đều pass.</li>
<li><strong>Quy tắc</strong> — “Viết unit test tốt, hoặc đừng viết.”</li>
</ul>
<p>Đó là lý do mục 22 của checklist lab hỏi mỗi script có thật sự assert gì không.</p>`],
      [4, 'Unit testing methods: manual and automated',
        `<p class="y-chinh">🎯 A unit can be tested by hand or by a framework — Lab 2 expects the automated way.</p>
<p class="nhan">The two ways</p>
<ol>
<li><strong>Manual</strong> — a person runs the unit via a driver or a debugger and compares the result by eye.</li>
<li><strong>Automated</strong> — a framework runs the tests and compares actual with expected by assertions.</li>
</ol>
<p>The template records results either way. Lab 2 still expects automated JUnit scripts, because only they can be re-run for regression (guide slide 33) at no cost.</p>`,
        `<p class="y-chinh">🎯 Unit có thể test bằng tay hoặc bằng framework — Lab 2 muốn cách tự động.</p>
<p class="nhan">Hai cách</p>
<ol>
<li><strong>Thủ công</strong> — người chạy unit qua driver hay debugger rồi so kết quả bằng mắt.</li>
<li><strong>Tự động</strong> — framework chạy test và so thực tế với mong đợi bằng assertion.</li>
</ol>
<p>Template ghi kết quả cho cả hai cách. Nhưng Lab 2 vẫn muốn JUnit script tự động, vì chỉ chúng mới chạy lại được để regression (slide 33 bộ hướng dẫn) mà không tốn công.</p>`],
      [5, 'White-box testing',
        `<p class="y-chinh">🎯 White-box: the tester sees inside the box — the code itself.</p>
<p class="nhan">The three bullets</p>
<ul>
<li><strong>Knows the internals</strong> — the tester knows the internal structure of the software, including the code.</li>
<li><strong>Tests against design and requirements</strong> — both can be used as the reference.</li>
<li><strong>Other name</strong> — transparent (glass-box) testing.</li>
</ul>
<p>Diagram: input → a box showing the control flow → output. In ISTQB terms, white-box techniques are based on the internal structure (statement, decision coverage) — LO-4.1.1.</p>`,
        `<p class="y-chinh">🎯 White-box: tester nhìn được bên trong hộp — chính là code.</p>
<p class="nhan">Ba gạch đầu dòng</p>
<ul>
<li><strong>Biết bên trong</strong> — tester biết cấu trúc bên trong của phần mềm, kể cả code.</li>
<li><strong>Test so với thiết kế và yêu cầu</strong> — cả hai đều dùng làm chuẩn so sánh được.</li>
<li><strong>Tên khác</strong> — kiểm thử trong suốt (glass-box).</li>
</ul>
<p>Hình: input → hộp thấy được luồng điều khiển → output. Theo ISTQB, kỹ thuật white-box dựa trên cấu trúc bên trong (statement, decision coverage) — LO-4.1.1.</p>`],
      [6, 'Black-box testing',
        `<p class="y-chinh">🎯 Black-box: the tester does not see the code — only inputs, outputs and the specification.</p>
<ul>
<li><strong>Definition</strong> — the tester knows neither the internal structure nor the code of the software.</li>
<li><strong>Diagram</strong> — input → executable program → output.</li>
<li><strong>In this course</strong> — this is the black-box variant of Lab 2 (L2.7): the test basis is the detail design, not the code.</li>
</ul>
<p class="ghi-chu">The teacher's note “Robust: mạnh mẽ | Integral: liên quan” translates two words of slide 3.</p>`,
        `<p class="y-chinh">🎯 Black-box: tester không thấy code — chỉ biết đầu vào, đầu ra và đặc tả.</p>
<ul>
<li><strong>Định nghĩa</strong> — tester không biết cấu trúc bên trong, cũng không biết code của phần mềm.</li>
<li><strong>Hình</strong> — input → chương trình chạy được → output.</li>
<li><strong>Trong môn này</strong> — đây là biến thể black-box của Lab 2 (bài L2.7): test basis là detail design, không phải code.</li>
</ul>
<p class="ghi-chu">Ghi chú của thầy/cô “Robust: mạnh mẽ | Integral: liên quan” dịch hai từ ở slide 3.</p>`],
      [7, 'Grey-box testing',
        `<p class="y-chinh">🎯 Grey-box mixes the two: the tester knows part of the inside, plus the requirements.</p>
<ul>
<li><strong>Definition</strong> — a combination of black-box and white-box techniques (“semi-transparent”).</li>
<li><strong>What the tester knows</strong> — part of the internal structure, functions and designs, along with the requirements.</li>
<li><strong>Example</strong> — you design cases from the DD (black-box), but you know the table structure and check the DB rows after the call.</li>
</ul>
<p class="ghi-chu">Grey-box is not an ISTQB CTFL technique category — the syllabus has black-box, white-box and experience-based.</p>`,
        `<p class="y-chinh">🎯 Grey-box trộn hai loại: tester biết một phần bên trong, cộng với yêu cầu.</p>
<ul>
<li><strong>Định nghĩa</strong> — kết hợp kỹ thuật black-box và white-box (“bán trong suốt”).</li>
<li><strong>Tester biết gì</strong> — một phần cấu trúc bên trong, chức năng và thiết kế, cùng với yêu cầu.</li>
<li><strong>Ví dụ</strong> — bạn thiết kế ca từ DD (black-box), nhưng biết cấu trúc bảng và kiểm các dòng DB sau lời gọi.</li>
</ul>
<p class="ghi-chu">Grey-box không phải một nhóm kỹ thuật trong CTFL — syllabus chỉ có black-box, white-box và experience-based.</p>`],
      [8, 'Benefits of unit testing',
        `<p class="y-chinh">🎯 Ten benefits — and the last one, measurable code coverage, is this lab's acceptance criterion.</p>
<ol class="hai-cot">
<li>The process becomes agile</li>
<li>Code quality improves</li>
<li>Bugs are detected early</li>
<li>Easier changes and simpler integration</li>
<li>Documentation — tests show how a unit is meant to be used</li>
<li>Easier debugging — a failing unit test points at one unit</li>
<li>Lower cost</li>
<li>Code completeness can be demonstrated</li>
<li>Development time is saved</li>
<li><strong>Code coverage can be measured</strong></li>
</ol>`,
        `<p class="y-chinh">🎯 Mười lợi ích — và cái cuối, đo được code coverage, chính là tiêu chí nghiệm thu của lab này.</p>
<ol class="hai-cot">
<li>Quy trình linh hoạt (agile) hơn</li>
<li>Chất lượng code tốt lên</li>
<li>Phát hiện bug sớm</li>
<li>Thay đổi dễ, tích hợp đơn giản</li>
<li>Có tài liệu — test cho thấy unit được dùng thế nào</li>
<li>Debug dễ — unit test fail chỉ thẳng vào một unit</li>
<li>Chi phí thấp hơn</li>
<li>Chứng minh được code hoàn chỉnh</li>
<li>Tiết kiệm thời gian phát triển</li>
<li><strong>Đo được code coverage</strong></li>
</ol>`],
      [9, 'How to write good unit tests',
        `<p class="y-chinh">🎯 A good unit test checks one unit, is small and isolated, runs fast and can be run again and again.</p>
<p class="nhan">The five rules on the slide</p>
<ol>
<li><strong>One unit</strong> — verify a single unit of code, not the integration.</li>
<li><strong>Small, isolated, clearly named</strong> — easy to write and to maintain.</li>
<li><strong>Isolated from change</strong> — changing another part of the software must not break a test written for one specific unit.</li>
<li><strong>Fast</strong> — it must run quickly.</li>
<li><strong>Reusable</strong> — it can be run repeatedly.</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> these are close to the well-known F.I.R.S.T. properties — Fast, Isolated, Repeatable, Self-validating (asserts), Timely (written with or before the code).</p>
<p class="ghi-chu">The teacher's note gives the Vietnamese of each line.</p>`,
        `<p class="y-chinh">🎯 Unit test tốt kiểm một unit, nhỏ và cô lập, chạy nhanh và chạy lặp lại được.</p>
<p class="nhan">Năm quy tắc trên slide</p>
<ol>
<li><strong>Một unit</strong> — kiểm một unit của code, không phải phần tích hợp.</li>
<li><strong>Nhỏ, cô lập, đặt tên rõ ràng</strong> — dễ viết, dễ bảo trì.</li>
<li><strong>Không bị ảnh hưởng khi sửa chỗ khác</strong> — sửa phần khác của phần mềm không được làm gãy test viết cho một unit cụ thể.</li>
<li><strong>Nhanh</strong> — phải chạy nhanh.</li>
<li><strong>Dùng lại được</strong> — chạy lặp lại được.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> các ý này gần với bộ tính chất F.I.R.S.T. — Fast (nhanh), Isolated (cô lập), Repeatable (lặp lại được), Self-validating (tự kiểm bằng assert), Timely (viết cùng lúc hoặc trước code).</p>
<p class="ghi-chu">Ghi chú của thầy/cô dịch sẵn từng dòng sang tiếng Việt.</p>`],
      [10, 'Lab 2 — the brief and the grading',
        `<p class="y-chinh">🎯 The real assignment: test your own SWP391 code alone, reach C0 = C1 = 100 %, and earn points by the size and difficulty of that code.</p>
<p class="nhan">The brief (in Vietnamese on the slide)</p>
<ul>
<li><strong>Group</strong> — individual work.</li>
<li><strong>Content</strong> — choose one tool from the tools slide, study it and do the UT with it.</li>
<li><strong>Report</strong> — use the lab's <strong>UT test case template</strong>.</li>
<li><strong>Test basis</strong> — source code you prepare yourself, taken from SWP391.</li>
<li><strong>Deliverables</strong> — the UT test cases (with the checklist) / a JUnit test script.</li>
<li><strong>Test report</strong> — must show <strong>C0: 100 %, C1: 100 %</strong>.</li>
</ul>
<p class="nhan">Grading</p>
<ul>
<li><strong>No submission</strong> — 1 point</li>
<li><strong>&lt; 100 LOC</strong> — 1–4 points</li>
<li><strong>101–200 LOC</strong> — 5 points</li>
<li><strong>201–250 LOC</strong> — 6 points</li>
<li><strong>251–300 LOC</strong> — 7 points</li>
<li><strong>&gt; 300 LOC</strong> — 8 points</li>
<li><strong>Source-code difficulty</strong> — 0–2 points</li>
</ul>
<p class="ghi-chu">The brief points to “slide 12” for the tools; in this deck the tool list is slide 11, and slides 12–13 describe NUnit and JUnit.</p>
<p class="meo">🧠 <strong>Remember:</strong> choose code with real branching and exceptions — difficulty points are given for it, and a getter/setter class earns nothing.</p>`,
        `<p class="y-chinh">🎯 Đề bài thật: tự test code SWP391 của mình, đạt C0 = C1 = 100 %, và điểm tính theo kích thước, độ khó của code đó.</p>
<p class="nhan">Đề bài (tiếng Việt trên slide)</p>
<ul>
<li><strong>Nhóm</strong> — làm cá nhân.</li>
<li><strong>Nội dung</strong> — chọn một công cụ ở slide công cụ để nghiên cứu và thực hiện UT.</li>
<li><strong>Báo cáo</strong> — dùng <strong>template UT test case</strong> kèm theo lab.</li>
<li><strong>Test basis</strong> — source code tự chuẩn bị, lấy từ môn SWP391.</li>
<li><strong>Sản phẩm nộp</strong> — UT test case (kèm checklist) / JUnit test script.</li>
<li><strong>Báo cáo test</strong> — phải có <strong>C0: 100 %, C1: 100 %</strong>.</li>
</ul>
<p class="nhan">Chấm điểm</p>
<ul>
<li><strong>Không nộp</strong> — 1 điểm</li>
<li><strong>&lt; 100 LOC</strong> — 1–4 điểm</li>
<li><strong>101–200 LOC</strong> — 5 điểm</li>
<li><strong>201–250 LOC</strong> — 6 điểm</li>
<li><strong>251–300 LOC</strong> — 7 điểm</li>
<li><strong>&gt; 300 LOC</strong> — 8 điểm</li>
<li><strong>Độ khó source code</strong> — 0–2 điểm</li>
</ul>
<p class="ghi-chu">Đề trỏ tới “slide 12” cho công cụ; trong bộ này danh sách công cụ là slide 11, còn slide 12–13 mô tả NUnit và JUnit.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> chọn code có rẽ nhánh và exception thật — được cộng điểm độ khó, còn một class toàn getter/setter thì chẳng được gì.</p>`],
      [11, 'Popular unit testing tools',
        `<p class="y-chinh">🎯 Pick one of three frameworks — for a Java SWP391 project that means JUnit.</p>
<p class="nhan">The three logos</p>
<ul>
<li><strong>NUnit</strong> — for .NET.</li>
<li><strong>JUnit</strong> — for Java.</li>
<li><strong>TestNG</strong> — for Java, with test groups, dependencies between tests and data providers.</li>
</ul>
<p class="nhan">Guide (Vietnamese)</p>
<ul>
<li><strong>“Giới thiệu JUnit — GP Coder (Lập trình Java)”</strong> — an introductory article on JUnit.</li>
</ul>
<p>For a Java project use JUnit 5 (Jupiter). Its <code>@Test</code>, <code>assertEquals</code>, <code>assertThrows</code> and <code>@ParameterizedTest</code> cover everything the template needs.</p>`,
        `<p class="y-chinh">🎯 Chọn một trong ba framework — dự án SWP391 bằng Java thì là JUnit.</p>
<p class="nhan">Ba logo</p>
<ul>
<li><strong>NUnit</strong> — cho .NET.</li>
<li><strong>JUnit</strong> — cho Java.</li>
<li><strong>TestNG</strong> — cho Java, có nhóm test, phụ thuộc giữa các test và data provider.</li>
</ul>
<p class="nhan">Tài liệu tiếng Việt</p>
<ul>
<li><strong>“Giới thiệu JUnit — GP Coder (Lập trình Java)”</strong> — bài nhập môn JUnit.</li>
</ul>
<p>Dự án Java thì dùng JUnit 5 (Jupiter). <code>@Test</code>, <code>assertEquals</code>, <code>assertThrows</code> và <code>@ParameterizedTest</code> đủ cho mọi thứ template cần.</p>`],
      [12, '#1) NUnit',
        `<p class="y-chinh">🎯 NUnit is the JUnit of .NET — pick it if your SWP391 project was C#/ASP.NET.</p>
<ul>
<li><strong>Platform</strong> — a unit-testing framework for .NET.</li>
<li><strong>Free, hand-written</strong> — test scripts are written manually, not generated.</li>
<li><strong>Like JUnit</strong> — it works the same way JUnit does for Java.</li>
<li><strong>Data-driven</strong> — supports data-driven tests that can run in parallel.</li>
<li><strong>Console runner</strong> — loads and executes the tests.</li>
</ul>
<p class="ghi-chu">“#1” and “#18” are the positions in the web article the slides were copied from.</p>`,
        `<p class="y-chinh">🎯 NUnit là JUnit của .NET — chọn nó nếu dự án SWP391 của bạn viết bằng C#/ASP.NET.</p>
<ul>
<li><strong>Nền tảng</strong> — framework unit test cho .NET.</li>
<li><strong>Miễn phí, viết tay</strong> — test script viết bằng tay, không tự sinh.</li>
<li><strong>Giống JUnit</strong> — hoạt động như JUnit với Java.</li>
<li><strong>Hướng dữ liệu</strong> — hỗ trợ test hướng dữ liệu chạy song song.</li>
<li><strong>Console runner</strong> — nạp và chạy test.</li>
</ul>
<p class="ghi-chu">“#1” và “#18” là thứ tự trong bài báo trên mạng mà slide chép lại.</p>`],
      [13, '#18) JUnit',
        `<p class="y-chinh">🎯 JUnit gives you three pieces: annotations to mark tests, assertions to check results, and runners to execute them.</p>
<ul>
<li><strong>Open source, for Java</strong> — a unit-testing framework designed for the Java language.</li>
<li><strong>Test-driven</strong> — built on the idea “first testing, then coding”.</li>
<li><strong>Test data first</strong> — test data is tested first and then inserted into the code.</li>
<li><strong>Annotations, assertions, runners</strong> — to identify test methods, check expected results and run the tests.</li>
<li><strong>Simple</strong> — tests are quick and easy to write.</li>
</ul>
<p>The worked example below uses exactly these three pieces (annotations, assertions, a runner), plus JaCoCo for coverage.</p>`,
        `<p class="y-chinh">🎯 JUnit cho bạn ba thứ: annotation để đánh dấu test, assertion để kiểm kết quả, và runner để chạy.</p>
<ul>
<li><strong>Mã nguồn mở, cho Java</strong> — framework unit test thiết kế cho ngôn ngữ Java.</li>
<li><strong>Hướng test</strong> — dựa trên ý “test trước, code sau”.</li>
<li><strong>Dữ liệu test trước</strong> — dữ liệu test được thử trước rồi mới đưa vào code.</li>
<li><strong>Annotation, assertion, runner</strong> — để đánh dấu method test, kiểm kết quả mong đợi và chạy test.</li>
<li><strong>Đơn giản</strong> — viết test nhanh và dễ.</li>
</ul>
<p>Ví dụ có lời giải dưới đây dùng đúng ba thứ đó (annotation, assertion, runner), cộng JaCoCo để đo coverage.</p>`],
    ]),
    bi(`<h3>CheckList_UT_Whitebox.xlsx — sheet “Checklist” (translated)</h3>
<ul>
<li><strong>Header</strong> — Confirm date, Người check (checker), System name, Function name, Note.</li>
<li><strong>Columns</strong> — No, Large item, Medium item, Check item, Result, DefectID, Note.</li>
</ul>
<p>Run it on your own submission before handing in — each “No” is a reason a reviewer would reject the file.</p>
<div class="table-wrap"><table><thead><tr><th>No</th><th>Large item</th><th>Medium item</th><th>Check item</th></tr></thead><tbody>${wbRows(false)}</tbody></table></div>
<h3>Sheet “BoundaryLimitValue” — viewpoint of boundary/limit values</h3>
<ul>
<li><strong>What is the boundary per data type:</strong> numbers → the value; strings → the length; date/time → the value; files → size, exists / not exists. If a date is passed as a string, test the value too, not only the length.</li>
<li><strong>How to choose data:</strong> the four values <strong>lower limit − 1, lower limit, upper limit, upper limit + 1</strong>. Example: employees who joined 2000–2005 → test 1999, 2000, 2005, 2006. If boundaries are complicated you may test every boundary ± 1 uniformly: 1999, 2000, 2001, 2004, 2005, 2006.</li>
<li><strong>Special values</strong> (bug-prone): numbers — null, 0, −1; strings — null, "" , "    " (spaces); dates — 1/1, 12/31, 2/29, 2/28, 3/1, 1989/1/7 (Shōwa 64), 1989/1/8 (Heisei 1), 0:00:00, 23:59:59; files — 0 bytes, exists or not.</li>
<li><strong>Limit value</strong> = the limit of a data range set by the language or platform (e.g. <code>Integer.MAX_VALUE</code>); test it the same way, except values beyond the limit that cannot be produced.</li>
</ul>`,
    `<h3>CheckList_UT_Whitebox.xlsx — sheet “Checklist” (đã dịch)</h3>
<ul>
<li><strong>Đầu trang</strong> — Confirm date, Người check, System name, Function name, Note.</li>
<li><strong>Các cột</strong> — No, Large item, Medium item, Check item, Result, DefectID, Note.</li>
</ul>
<p>Tự chạy nó trên bài của mình trước khi nộp — mỗi chữ “No” là một lý do người review sẽ trả file.</p>
<div class="table-wrap"><table><thead><tr><th>No</th><th>Nhóm lớn</th><th>Nhóm vừa</th><th>Mục kiểm</th></tr></thead><tbody>${wbRows(true)}</tbody></table></div>
<h3>Sheet “BoundaryLimitValue” — quan điểm giá trị biên/giới hạn</h3>
<ul>
<li><strong>Biên theo kiểu dữ liệu:</strong> số → giá trị; chuỗi → độ dài; ngày giờ → giá trị; file → kích thước, có / không tồn tại. Nếu ngày được truyền dưới dạng chuỗi thì phải test cả giá trị, không chỉ độ dài.</li>
<li><strong>Cách chọn dữ liệu:</strong> bốn giá trị <strong>cận dưới − 1, cận dưới, cận trên, cận trên + 1</strong>. Ví dụ: nhân viên vào công ty 2000–2005 → test 1999, 2000, 2005, 2006. Nếu biên phức tạp có thể test đồng loạt mọi biên ± 1: 1999, 2000, 2001, 2004, 2005, 2006.</li>
<li><strong>Giá trị đặc biệt</strong> (hay gây bug): số — null, 0, −1; chuỗi — null, "" , "    " (khoảng trắng); ngày — 1/1, 12/31, 2/29, 2/28, 3/1, 1989/1/7 (Shōwa 64), 1989/1/8 (Heisei 1), 0:00:00, 23:59:59; file — 0 byte, có hay không.</li>
<li><strong>Giá trị giới hạn (limit)</strong> = giới hạn của miền dữ liệu do ngôn ngữ hay nền tảng đặt ra (ví dụ <code>Integer.MAX_VALUE</code>); test theo cùng cách, trừ những giá trị vượt giới hạn không thể tạo ra.</li>
</ul>`),
    bi(`<h3>Ví dụ có lời giải · Worked example — a SWP391-style method to C0 = C1 = 100 % with JUnit + JaCoCo</h3>
<pre><code>public static String classify(double weightKg, double heightM) {
    if (weightKg &lt;= 0 || heightM &lt;= 0) {
        throw new IllegalArgumentException("weight and height must be positive");
    }
    double bmi = weightKg / (heightM * heightM);
    if (bmi &lt; 18.5) {
        return "Underweight";
    } else if (bmi &lt; 25) {
        return "Normal";
    } else if (bmi &lt; 30) {
        return "Overweight";
    }
    return "Obese";
}</code></pre>
<p><strong>Step 1 — one case per decision outcome.</strong> Decisions: the guard (true/false) and three comparisons. Five cases: 70 kg/1.75 m (BMI 22.86 → Normal), 50 kg (16.33 → Underweight), 80 kg (26.12 → Overweight), 100 kg (32.65 → Obese), weight 0 (exception). JaCoCo 0.8.13, real output:</p>
<pre><code>Tests run: 5, passed: 5, failed: 0
Method classify: lines 10/10, branches 9/10
  L3   PARTLY  if (weightKg &lt;= 0 || heightM &lt;= 0) {  [branches 3/4]</code></pre>
<p>Textbook decision coverage is already 100 % (the guard was true once and false four times), but JaCoCo counts <em>each operand</em> of <code>||</code>: <code>heightM &lt;= 0</code> was never true — exactly guide slide 53's rule “check each sub-condition”.</p>
<p><strong>Step 2 — add the missing sub-condition and the boundaries.</strong> Height 0 (exception) plus BMI exactly on each boundary: 56.65625 kg (18.5 → Normal), 76.5625 kg (25 → Overweight), 91.875 kg (30 → Obese); with 1.75 m these divisions are exact in floating point (1.75² = 3.0625). Real output:</p>
<pre><code>PASSED UTCID01 N  70kg 1.75m -&gt; Normal
PASSED UTCID02 N  50kg 1.75m -&gt; Underweight
PASSED UTCID03 N  80kg 1.75m -&gt; Overweight
PASSED UTCID04 N  100kg 1.75m -&gt; Obese
PASSED UTCID05 A  weight 0 -&gt; IllegalArgumentException
PASSED UTCID06 A  height 0 -&gt; IllegalArgumentException
PASSED UTCID07 B  bmi exactly 18.5 -&gt; Normal
PASSED UTCID08 B  bmi exactly 25 -&gt; Overweight
PASSED UTCID09 B  bmi exactly 30 -&gt; Obese
Tests run: 9, passed: 9, failed: 0
Method classify: lines 10/10, branches 10/10</code></pre>
<p>Nine UTCID columns; for a 14-line method the template's norm is 14 × 100 / 1000 = 1.4 cases, so “Lack of test cases” = 1.4 − 9 = −7.6 (no lack). Paste the coverage lines as evidence; checklist items 12 and 22 are satisfied.</p>
<div class="pitfall co-tieu-de"><strong>Coverage is necessary, not sufficient.</strong> Steps 1 and 2 both show 10/10 lines; only the branch counter revealed the missing height case, and only the boundary cases (UTCID07–09) would catch <code>&lt;=</code> written instead of <code>&lt;</code> — the coverage report is identical with or without them.</div>
<div class="callout"><p><span class="badge">★ Beyond the syllabus</span> <strong>One matrix, one parameterized test.</strong></p>
<p>JUnit 5's <code>@ParameterizedTest</code> with <code>@CsvSource({"70,1.75,Normal", "50,1.75,Underweight", …})</code> turns the template's columns into rows of data driving a single test method; a failing row is reported with its own index.</p>
<p>It keeps the script aligned with the PCL (checklist item 19) and makes adding a boundary case a one-line change.</p>
<p class="ghi-chu">Outside the syllabus because CTFL does not cover specific frameworks.</p></div>`,
    `<h3>Ví dụ có lời giải · Một method kiểu SWP391 tới C0 = C1 = 100 % với JUnit + JaCoCo</h3>
<pre><code>public static String classify(double weightKg, double heightM) {
    if (weightKg &lt;= 0 || heightM &lt;= 0) {
        throw new IllegalArgumentException("weight and height must be positive");
    }
    double bmi = weightKg / (heightM * heightM);
    if (bmi &lt; 18.5) {
        return "Underweight";
    } else if (bmi &lt; 25) {
        return "Normal";
    } else if (bmi &lt; 30) {
        return "Overweight";
    }
    return "Obese";
}</code></pre>
<p><strong>Bước 1 — mỗi kết quả quyết định một ca.</strong> Các quyết định: câu kiểm tra đầu (đúng/sai) và ba phép so sánh. Năm ca: 70 kg/1,75 m (BMI 22,86 → Normal), 50 kg (16,33 → Underweight), 80 kg (26,12 → Overweight), 100 kg (32,65 → Obese), cân nặng 0 (exception). JaCoCo 0.8.13, kết quả thật:</p>
<pre><code>Tests run: 5, passed: 5, failed: 0
Method classify: lines 10/10, branches 9/10
  L3   PARTLY  if (weightKg &lt;= 0 || heightM &lt;= 0) {  [branches 3/4]</code></pre>
<p>Decision coverage theo sách đã 100 % (câu kiểm tra đầu đúng một lần, sai bốn lần), nhưng JaCoCo đếm <em>từng vế</em> của <code>||</code>: <code>heightM &lt;= 0</code> chưa từng đúng — đúng quy tắc “kiểm từng điều kiện con” ở slide 53 bộ hướng dẫn.</p>
<p><strong>Bước 2 — thêm điều kiện con còn thiếu và các biên.</strong> Chiều cao 0 (exception) cộng BMI đúng bằng từng biên: 56,65625 kg (18,5 → Normal), 76,5625 kg (25 → Overweight), 91,875 kg (30 → Obese); với 1,75 m các phép chia này chính xác tuyệt đối trong số thực (1,75² = 3,0625). Kết quả thật:</p>
<pre><code>PASSED UTCID01 N  70kg 1.75m -&gt; Normal
PASSED UTCID02 N  50kg 1.75m -&gt; Underweight
PASSED UTCID03 N  80kg 1.75m -&gt; Overweight
PASSED UTCID04 N  100kg 1.75m -&gt; Obese
PASSED UTCID05 A  weight 0 -&gt; IllegalArgumentException
PASSED UTCID06 A  height 0 -&gt; IllegalArgumentException
PASSED UTCID07 B  bmi exactly 18.5 -&gt; Normal
PASSED UTCID08 B  bmi exactly 25 -&gt; Overweight
PASSED UTCID09 B  bmi exactly 30 -&gt; Obese
Tests run: 9, passed: 9, failed: 0
Method classify: lines 10/10, branches 10/10</code></pre>
<p>Chín cột UTCID; method 14 dòng thì định mức của template là 14 × 100 / 1000 = 1,4 ca, nên “Lack of test cases” = 1,4 − 9 = −7,6 (không thiếu). Dán các dòng coverage làm bằng chứng; mục 12 và 22 của checklist đạt.</p>
<div class="pitfall co-tieu-de"><strong>Coverage là điều kiện cần, chưa đủ.</strong> Bước 1 và bước 2 đều cho 10/10 dòng; chỉ bộ đếm nhánh làm lộ ca chiều cao còn thiếu, và chỉ các ca biên (UTCID07–09) mới bắt được lỗi viết <code>&lt;=</code> thay cho <code>&lt;</code> — báo cáo coverage y hệt nhau dù có hay không có chúng.</div>
<div class="callout"><p><span class="badge">★ Ngoài giáo trình</span> <strong>Một ma trận, một parameterized test.</strong></p>
<p><code>@ParameterizedTest</code> của JUnit 5 với <code>@CsvSource({"70,1.75,Normal", "50,1.75,Underweight", …})</code> biến các cột của template thành các dòng dữ liệu điều khiển một method test duy nhất; dòng nào fail được báo kèm số thứ tự riêng.</p>
<p>Nó giữ script khớp với PCL (mục 19 của checklist) và thêm một ca biên chỉ tốn một dòng.</p>
<p class="ghi-chu">Ngoài giáo trình vì CTFL không đi vào framework cụ thể.</p></div>`),
    books([
      ['fst4', 'Ch.4 §1 categories of test techniques p.106 and §3 white-box techniques pp.132–139', 'Chương 4 §1 các nhóm kỹ thuật trang 106 và §3 kỹ thuật white-box trang 132–139'],
      ['sp5', '§5.2 White-box testing PDF pp.214–232; §3.4.1 component testing PDF p.87', '§5.2 White-box testing PDF 214–232; §3.4.1 component testing PDF 87'],
      ['junit', 'Ch.1 jump-start PDF p.5, Ch.2 core JUnit PDF p.18, Ch.6 test quality and coverage PDF pp.103–105, Ch.20 TDD PDF p.420', 'Chương 1 PDF 5, Chương 2 PDF 18, Chương 6 chất lượng test và coverage PDF 103–105, Chương 20 TDD PDF 420'],
    ]),
  ].join('\n'),
};

/* ───────────── L2.7 Functional (black-box) deck + black-box checklists + the Detail Design ───────────── */
const ACTIONS = [
  ['001B', 'BT利用明細作成処理', 'create BT usage details', 'tạo chi tiết sử dụng BT'],
  ['002B', 'トーホー請求明細処理', 'Toho billing details', 'chi tiết hoá đơn Toho'],
  ['003B', '月替り処理', 'month changeover: add next month\'s records (closing info …)', 'chuyển tháng: thêm bản ghi tháng sau (thông tin quyết toán …)'],
  ['004B', '請求書発行処理', 'create invoice data', 'tạo dữ liệu hoá đơn'],
  ['005B–008B', 'Tiffany / ツムラ / 東レ / JAG 請求明細処理', 'billing details for customers Tiffany, Tsumura, Toray, JAG', 'chi tiết hoá đơn cho khách Tiffany, Tsumura, Toray, JAG'],
  ['009B', '海外向け請求リスト処理', 'overseas billing list', 'danh sách hoá đơn nước ngoài'],
  ['010B', 'DAVIDE向け売上データ作成＆転送処理', 'create and transfer sales data for DAVIDE', 'tạo và chuyển dữ liệu doanh thu cho DAVIDE'],
  ['011B', '顧客別損益表処理', 'profit-and-loss table per customer', 'bảng lãi lỗ theo khách hàng'],
  ['012B', '債権レポート作成処理', 'receivables (credit) report', 'báo cáo công nợ phải thu'],
  ['013B', '決算日設定確認処理', 'reminder mail if next month\'s closing date is not set by the 25th', 'gửi mail nhắc nếu tới ngày 25 chưa đặt ngày quyết toán tháng sau'],
  ['014B', '売上データ作成処理', 'create sales data', 'tạo dữ liệu doanh thu'],
  ['015B', 'SunAccount元帳抽出処理', 'extract the SunAccount ledger', 'trích sổ cái SunAccount'],
  ['016B', '請求書印刷処理', 'print invoices', 'in hoá đơn'],
  ['017B', '総額SalesReport作成処理', 'total-amount Sales Report', 'Sales Report tổng'],
  ['018B', '回線コスト差異リスト処理', 'line-cost variance list', 'danh sách chênh lệch chi phí đường truyền'],
  ['019B', 'Usageアンマッチリスト処理', 'check usage data for new, unmatched PSNs', 'kiểm dữ liệu usage có PSN mới chưa khớp'],
  ['020B', 'Usageフィード完了処理', 'load usage data into billing data', 'nạp dữ liệu usage vào dữ liệu tính cước'],
  ['021B', 'BT Usageチェック処理', 'load BT usage data', 'nạp dữ liệu usage của BT'],
  ['022B', '為替レート登録処理', 'register exchange rates', 'đăng ký tỉ giá'],
  ['024B / 025B', '口座振替チェックリスト / 結果レポート', 'direct-debit check list / result report', 'danh sách kiểm tra / báo cáo kết quả chuyển khoản tự động'],
];
const actRows = (vi) => ACTIONS.map((r) => `<tr><td>SvrJNAP${r[0]}Action</td><td>${r[1]}</td><td>${vi ? r[3] : r[2]}</td></tr>`).join('');
const L27 = {
  title: 'L2.7 — Black-box Lab 2: functional testing from a Detail Design + checklists|||L2.7 — Lab 2 black-box: test chức năng từ Detail Design + checklist',
  slug: 'swt301-lab2-blackbox',
  type: 'VIDEO',
  description: '14 slide đề bài Lab 2 black-box (tỉ lệ Normal<20% : Abnormal>60% : Boundary>20%, chấm theo số trang DD), hai checklist black-box (132 + 73 mục) và bản đồ Detail Design jp.co.jtnis.jnap1.svrint: 24 lớp action batch, DAO, tham số khởi động; ví dụ phân tích EP/BVA cho JNAP001B.',
  content: [
    bi(`<span class="eyebrow">Lab 2 · Lesson L2.7 · Lab2_component(Functional)testing slides 1–14 + black-box checklists + Detail Design</span>
<h2>Black-box Lab 2: unit tests from a Detail Design</h2>
<p class="lead">In the functional variant you never see code. You pick one action of a real Japanese batch system from its <strong>Detail Design</strong> (a Javadoc site in the lab folder), derive test cases with equivalence partitioning and boundary value analysis, and write them in the template with a case mix of <strong>Normal &lt; 20 %, Abnormal &gt; 60 %, Boundary &gt; 20 %</strong>.</p>
<ul>
<li><strong>Repeated</strong> — the deck repeats slides 2–9 of the structural deck.</li>
<li><strong>New</strong> — the brief, the grading by DD size, and the two long checklists.</li>
</ul>
<div class="callout"><p><strong>Learning objectives</strong></p>
<ul>
<li>Use a detailed design as the test basis of component testing (LO-2.2.1)</li>
<li>Apply EP and BVA to method parameters, DB state and settings (LO-4.2.1/4.2.2, K3)</li>
<li>Meet a required N:A:B ratio</li>
<li>Review a test-case sheet with the black-box checklists (checklist-based testing, LO-4.4.3)</li>
<li>Read the JNAP Detail Design: packages, action classes, parameters, DAOs, constants, message IDs</li>
</ul></div>`,
    `<span class="eyebrow">Lab 2 · Bài L2.7 · Lab2_component(Functional)testing slide 1–14 + checklist black-box + Detail Design</span>
<h2>Lab 2 black-box: unit test từ Detail Design</h2>
<p class="lead">Ở biến thể chức năng bạn không bao giờ nhìn thấy code. Bạn chọn một action của một hệ thống batch Nhật thật trong <strong>Detail Design</strong> (một trang Javadoc trong thư mục lab), rút test case bằng phân vùng tương đương và phân tích giá trị biên, rồi ghi vào template với tỉ lệ <strong>Normal &lt; 20 %, Abnormal &gt; 60 %, Boundary &gt; 20 %</strong>.</p>
<ul>
<li><strong>Lặp lại</strong> — bộ slide lặp lại slide 2–9 của bản structural.</li>
<li><strong>Phần mới</strong> — đề bài, cách chấm theo kích thước DD, và hai checklist dài.</li>
</ul>
<div class="callout"><p><strong>Chuẩn đầu ra</strong></p>
<ul>
<li>Dùng detailed design làm test basis của component testing (LO-2.2.1)</li>
<li>Áp dụng EP và BVA cho tham số method, trạng thái DB và cấu hình (LO-4.2.1/4.2.2, K3)</li>
<li>Đạt tỉ lệ N:A:B bắt buộc</li>
<li>Review sheet test case bằng checklist black-box (checklist-based testing, LO-4.4.3)</li>
<li>Đọc được Detail Design JNAP: package, lớp action, tham số, DAO, hằng số, message ID</li>
</ul></div>`),
    walkHead(BB, 1, 14, 'Slides 2–9 are identical to structural slides 2–9 (lesson L2.6) except one word on slide 9; they are explained briefly here with the black-box angle.', 'Slide 2–9 giống hệt slide 2–9 của bản structural (bài L2.6) trừ một chữ ở slide 9; ở đây chỉ giải thích ngắn theo góc nhìn black-box.'),
    walk(BB, [
      [1, 'LAB2: Component (functional) testing using unit test framework',
        `<p class="y-chinh">🎯 Title of the black-box variant: still component (unit) level, still a unit-test framework — but the cases come from the specification.</p>
<ul>
<li><strong>“Functional”</strong> — the test cases come from what the unit must do (its specification — here the detail design), not from how it is coded.</li>
<li><strong>Same level</strong> — it is still <em>component</em> (unit) level and still uses a unit-test framework.</li>
</ul>`,
        `<p class="y-chinh">🎯 Tựa đề của biến thể black-box: vẫn cấp component (unit), vẫn dùng unit-test framework — nhưng ca test rút ra từ đặc tả.</p>
<ul>
<li><strong>“Functional”</strong> — test case rút ra từ việc unit phải làm (đặc tả của nó — ở đây là detail design), không phải từ cách nó được code.</li>
<li><strong>Cùng cấp</strong> — vẫn là cấp <em>component</em> (unit) và vẫn dùng unit-test framework.</li>
</ul>`],
      [2, 'Unit testing in the SDLC (same as structural slide 2)',
        `<p class="y-chinh">🎯 Same text as structural slide 2 — and the same level can be tested from the <em>outside</em>.</p>
<ul>
<li><strong>Structural slide 2 says</strong> — unit testing is old, verifies every unit, is the basis of TDD, is done by developers and sometimes white-box testers.</li>
<li><strong>Black-box angle</strong> — a unit's detailed design is a specification like any other.</li>
</ul>`,
        `<p class="y-chinh">🎯 Giống slide 2 bản structural — và cùng một cấp có thể test từ <em>bên ngoài</em>.</p>
<ul>
<li><strong>Slide 2 bản structural nói</strong> — unit test đã có từ lâu, kiểm từng unit, là nền của TDD, do developer và đôi khi tester white-box làm.</li>
<li><strong>Góc black-box</strong> — detailed design của một unit cũng là một đặc tả như mọi đặc tả khác.</li>
</ul>`],
      [3, 'Unit testing in the SDLC (2) (same as structural slide 3)',
        `<p class="y-chinh">🎯 Same as structural slide 3, including the warning about empty unit tests that all pass.</p>
<ul>
<li><strong>Black-box terms</strong> — a test without a precise expected result from the DD proves nothing.</li>
</ul>`,
        `<p class="y-chinh">🎯 Giống slide 3 bản structural, kể cả lời cảnh báo về unit test rỗng pass hết.</p>
<ul>
<li><strong>Góc black-box</strong> — test không có kết quả mong đợi chính xác lấy từ DD thì chẳng chứng minh được gì.</li>
</ul>`],
      [4, 'Unit testing methods (same as structural slide 4)',
        `<p class="y-chinh">🎯 Manual or automated — record which way each case was run.</p>
<ul>
<li><strong>Partly manual is allowed</strong> — for a batch action whose DB and mail parts you cannot run at home, you may execute part of the black-box sheet manually (or against stubs).</li>
<li><strong>Record it</strong> — note for each case how it was run.</li>
</ul>`,
        `<p class="y-chinh">🎯 Thủ công hoặc tự động — ghi rõ mỗi ca chạy theo cách nào.</p>
<ul>
<li><strong>Được làm một phần bằng tay</strong> — với một action batch mà phần DB và mail bạn không chạy được ở nhà, có thể thực hiện một phần sheet black-box bằng tay (hoặc với stub).</li>
<li><strong>Ghi lại</strong> — mỗi ca chạy theo cách nào.</li>
</ul>`],
      [5, 'White-box testing (same as structural slide 5)',
        `<p class="y-chinh">🎯 Same definition — and in this variant you deliberately do <em>not</em> use it.</p>
<ul>
<li><strong>Why</strong> — the grading asks for DD coverage and a case ratio, not C0/C1.</li>
</ul>`,
        `<p class="y-chinh">🎯 Cùng định nghĩa — và ở biến thể này bạn cố ý <em>không</em> dùng nó.</p>
<ul>
<li><strong>Vì sao</strong> — chấm điểm dựa trên độ phủ DD và tỉ lệ ca, không phải C0/C1.</li>
</ul>`],
      [6, 'Black-box testing (same as structural slide 6)',
        `<p class="y-chinh">🎯 The technique of this variant: input → executable program → output, with the specification as the only source of expected results.</p>
<p class="nhan">Black-box techniques of Ch.4</p>
<ul>
<li>EP</li>
<li>BVA</li>
<li>Decision tables</li>
<li>State transitions</li>
<li>Use cases</li>
</ul>`,
        `<p class="y-chinh">🎯 Kỹ thuật của biến thể này: input → chương trình chạy được → output, với đặc tả là nguồn duy nhất của kết quả mong đợi.</p>
<p class="nhan">Các kỹ thuật black-box ở Chương 4</p>
<ul>
<li>EP</li>
<li>BVA</li>
<li>Bảng quyết định</li>
<li>Chuyển trạng thái</li>
<li>Use case</li>
</ul>`],
      [7, 'Grey-box testing (same as structural slide 7)',
        `<p class="y-chinh">🎯 Same definition — and in practice your black-box design here will be grey-box.</p>
<ul>
<li><strong>Why</strong> — the DD of this lab is detailed enough (step-by-step processing, called methods, constants) that you know the internal steps but not the code.</li>
</ul>`,
        `<p class="y-chinh">🎯 Cùng định nghĩa — và trên thực tế thiết kế black-box ở đây sẽ là grey-box.</p>
<ul>
<li><strong>Vì sao</strong> — DD của lab này chi tiết tới mức (xử lý từng bước, method được gọi, hằng số) mà bạn biết các bước bên trong nhưng không biết code.</li>
</ul>`],
      [8, 'Benefits of unit testing (same as structural slide 8)',
        `<p class="y-chinh">🎯 The same ten benefits as structural slide 8.</p>
<ul>
<li><strong>Most relevant here: “documentation availability”</strong> — a good black-box sheet doubles as a readable summary of what the action must do.</li>
</ul>`,
        `<p class="y-chinh">🎯 Cùng mười lợi ích như slide 8 bản structural.</p>
<ul>
<li><strong>Liên quan nhất ở đây: “có sẵn tài liệu”</strong> — một sheet black-box tốt đồng thời là bản tóm tắt dễ đọc về việc action phải làm.</li>
</ul>`],
      [9, 'How to write good unit tests — “a single unit of code/DD”',
        `<p class="y-chinh">🎯 The only change from structural slide 9: a unit test verifies “a single unit of <strong>code/DD</strong>”.</p>
<ul>
<li><strong>In this lab</strong> — the unit is one DD entry (one action class or method), not the integration of several.</li>
</ul>`,
        `<p class="y-chinh">🎯 Điểm khác duy nhất so với slide 9 bản structural: unit test kiểm “một unit của <strong>code/DD</strong>”.</p>
<ul>
<li><strong>Trong lab này</strong> — unit là một mục DD (một lớp action hoặc một method), không phải phần tích hợp nhiều mục.</li>
</ul>`],
      [10, 'Lab 2 (Black-box) — the brief',
        `<p class="y-chinh">🎯 The black-box brief: test one action of the Detail Design, with a case mix of Normal &lt; 20 %, Abnormal &gt; 60 %, Boundary &gt; 20 %.</p>
<p class="nhan">The brief</p>
<ul>
<li><strong>Work</strong> — individual.</li>
<li><strong>Tool</strong> — choose one from the tools slide.</li>
<li><strong>Report</strong> — with the lab's UT test-case template.</li>
<li><strong>Test basis</strong> — choose one “screen” in <code>LAB02\\01.Guide\\Detail Design\\doc\\jp\\co\\jtnis\\jnap1\\svrint\\action</code> (the classes there are batch actions, not GUI screens — see the DD map below).</li>
<li><strong>Deliver</strong> — UT test cases / test script / the attached checklists.</li>
<li><strong>Ratio Normal : Abnormal : Boundary</strong> = &lt; 20 % : &gt; 60 % : &gt; 20 %.</li>
</ul>
<p class="nhan">Read the ratio as a design rule</p>
<p>Most black-box value is in abnormal and boundary inputs; if more than one case in five is “normal”, you are mostly confirming the happy path.</p>
<div class="pitfall">With 10 cases the strict inequalities cannot all hold (1 N, 7 A, 2 B gives exactly 20 % B), so plan 12–13 cases or more.</div>`,
        `<p class="y-chinh">🎯 Đề bài black-box: test một action trong Detail Design, với tỉ lệ ca Normal &lt; 20 %, Abnormal &gt; 60 %, Boundary &gt; 20 %.</p>
<p class="nhan">Đề bài</p>
<ul>
<li><strong>Hình thức</strong> — làm cá nhân.</li>
<li><strong>Công cụ</strong> — chọn một công cụ ở slide công cụ.</li>
<li><strong>Báo cáo</strong> — bằng template UT test case của lab.</li>
<li><strong>Test basis</strong> — chọn một “màn hình” trong <code>LAB02\\01.Guide\\Detail Design\\doc\\jp\\co\\jtnis\\jnap1\\svrint\\action</code> (các lớp ở đó là action batch, không phải màn hình GUI — xem bản đồ DD bên dưới).</li>
<li><strong>Nộp</strong> — UT test case / test script / checklist kèm theo.</li>
<li><strong>Tỉ lệ Normal : Abnormal : Boundary</strong> = &lt; 20 % : &gt; 60 % : &gt; 20 %.</li>
</ul>
<p class="nhan">Hiểu tỉ lệ như một quy tắc thiết kế</p>
<p>Giá trị lớn nhất của black-box nằm ở đầu vào bất thường và biên; nếu hơn một phần năm số ca là “normal” thì bạn chủ yếu đang xác nhận luồng suôn sẻ.</p>
<div class="pitfall">Với 10 ca không thể thoả hết các bất đẳng thức chặt (1 N, 7 A, 2 B cho đúng 20 % B), nên hãy lên 12–13 ca trở lên.</div>`],
      [11, 'Lab 2 (Black-box) — grading',
        `<p class="y-chinh">🎯 The score follows the size of the design you covered, plus up to 2 points for its complexity.</p>
<ul>
<li><strong>No submission</strong> — 1 point.</li>
<li><strong>DD tested &lt; 2 pages</strong> — 1–4.</li>
<li><strong>2–3 pages</strong> — 5–6.</li>
<li><strong>&gt; 3 pages</strong> — 7–8.</li>
<li><strong>DD complexity</strong> (many loops, nesting) — + 0–2.</li>
</ul>
<p>A “page” is a printed page of the design you covered. <code>SvrJNAP001BAction.execute</code> is about one page with four decisions; actions such as 014B or 024B/025B have longer processing descriptions and score higher — but only if your cases really cover every step.</p>`,
        `<p class="y-chinh">🎯 Điểm theo kích thước phần thiết kế bạn đã phủ, cộng tối đa 2 điểm cho độ phức tạp của nó.</p>
<ul>
<li><strong>Không nộp</strong> — 1 điểm.</li>
<li><strong>DD được test &lt; 2 trang</strong> — 1–4.</li>
<li><strong>2–3 trang</strong> — 5–6.</li>
<li><strong>&gt; 3 trang</strong> — 7–8.</li>
<li><strong>Độ phức tạp DD</strong> (nhiều vòng lặp, lồng nhau) — + 0–2.</li>
</ul>
<p>“Trang” là trang in của phần thiết kế bạn đã phủ. <code>SvrJNAP001BAction.execute</code> khoảng một trang với bốn quyết định; các action như 014B hay 024B/025B có mô tả xử lý dài hơn và được điểm cao hơn — nhưng chỉ khi các ca của bạn thật sự phủ mọi bước.</p>`],
      [12, 'Popular unit testing tools',
        `<p class="y-chinh">🎯 Same tools slide as structural slide 11 — NUnit, JUnit, TestNG and the Vietnamese JUnit guide by GP Coder.</p>
<p class="ghi-chu">In this deck the tools really are on slide 12, as the brief says.</p>`,
        `<p class="y-chinh">🎯 Cùng slide công cụ như slide 11 bản structural — NUnit, JUnit, TestNG và bài hướng dẫn JUnit tiếng Việt của GP Coder.</p>
<p class="ghi-chu">Trong bộ này công cụ đúng là nằm ở slide 12, như đề bài nói.</p>`],
      [13, '#1) NUnit',
        `<p class="y-chinh">🎯 NUnit for .NET (same text as structural slide 12).</p>
<ul>
<li>Free.</li>
<li>Hand-written test scripts; works like JUnit.</li>
<li>Data-driven tests in parallel.</li>
<li>Console runner.</li>
</ul>`,
        `<p class="y-chinh">🎯 NUnit cho .NET (giống slide 12 bản structural).</p>
<ul>
<li>Miễn phí.</li>
<li>Test script viết tay; hoạt động như JUnit.</li>
<li>Test hướng dữ liệu chạy song song.</li>
<li>Console runner.</li>
</ul>`],
      [14, '#18) JUnit',
        `<p class="y-chinh">🎯 JUnit for Java: open source, test-first, annotations + assertions + runners (same as structural slide 13).</p>
<ul>
<li><strong>For a batch action</strong> — you will need stubs for the DAO, SQL*Plus and mail parts; see the verified example in L2.8.</li>
</ul>`,
        `<p class="y-chinh">🎯 JUnit cho Java: mã nguồn mở, test trước, annotation + assertion + runner (giống slide 13 bản structural).</p>
<ul>
<li><strong>Với action batch</strong> — bạn sẽ cần stub cho phần DAO, SQL*Plus và mail; xem ví dụ đã chạy thật ở bài L2.8.</li>
</ul>`],
    ]),
    bi(`<h3>The Detail Design — what is in <code>01.Guide/Detail Design/doc</code></h3>
<p>A Javadoc site (Shift-JIS, Japanese descriptions) of the server part of <strong>JNAP</strong>, a Japanese billing/accounting batch system, package <code>jp.co.jtnis.jnap1.svrint</code>. Each method's Javadoc is written as a numbered processing description — that is the “DD”. How the pieces fit:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">common.main</div><div class="lz-t">RegistProcess.main(params)</div><div class="lz-d">no params → BusinessLogicException; resolves the action ID; logs start/end</div></div>
  <div class="lz-step"><div class="lz-k">action.manager</div><div class="lz-t">ActionOperator.execute</div><div class="lz-d">creates the action, injects parameters and DAOs, runs it, logs errors</div></div>
  <div class="lz-step"><div class="lz-k">common.operator</div><div class="lz-t">ParameterConfig</div><div class="lz-d">validates each parameter: required, date pattern, number, value set</div></div>
  <div class="lz-step"><div class="lz-k">action.impl</div><div class="lz-t">SvrJNAPxxxBAction.execute</div><div class="lz-d">the business steps — your test object</div></div>
  <div class="lz-step"><div class="lz-k">dao</div><div class="lz-t">TranJobListDao …</div><div class="lz-d">job-list table, closing info, credit report, bank-transfer files</div></div>
</div>
<div class="table-wrap"><table><thead><tr><th>Package</th><th>Contents</th></tr></thead><tbody>
<tr><td>action.iface / action.impl</td><td><code>IActionLauncher</code>; <code>ActionSupport</code> (common methods <code>executeSql</code> — runs a SQL file with SQL*Plus and returns its status — and <code>sendMail</code> — result-notification mail); 24 batch actions (table below)</td></tr>
<tr><td>action.manager</td><td><code>IActionOperator</code>/<code>ActionOperator</code>: DB connection via <code>HibernateOperator</code>, action creation, transaction, error log</td></tr>
<tr><td>annotation</td><td><code>FileColumn</code> (+ <code>Align</code>): maps file columns to bean properties</td></tr>
<tr><td>common.exception</td><td><code>BusinessLogicException</code>, <code>JnapException</code></td></tr>
<tr><td>common.operator</td><td><code>DaoResolver</code>, <code>HibernateOperator</code>, <code>ParameterConfig</code></td></tr>
<tr><td>common.utils</td><td><code>Constants</code>, <code>MessageIds</code>, <code>ActionIds</code>, <code>DateUtils</code>, <code>FileUtils</code>, <code>JnapLog</code>, <code>Resources</code>, <code>ReportCreator</code>, <code>FtpUploadFile</code>, e-mail helpers, file adapters</td></tr>
<tr><td>dao.iface / dao.impl / dao.sql</td><td>7 DAOs (BankTransferReceiveFile, BankTransferSendFile, ClosingInfo, ClosingMonth, Common, CreditReport, TranJobList) with Hibernate implementations; <code>SQLFactory</code></td></tr>
<tr><td>model</td><td>beans for files and reports (AccountTransferResultBean, PaymentDataBean, CreditReport…Bean …)</td></tr>
<tr><td>parameter</td><td><code>IParameter</code>, <code>ActionParameter</code>, annotation <code>ParameterInjection</code> (index, name, required, datePattern, checkNumber, valueSet, min/max value, length …)</td></tr>
</tbody></table></div>
<h3>The 24 action classes you can choose from</h3>
<div class="table-wrap"><table><thead><tr><th>Class</th><th>Japanese name</th><th>What it does</th></tr></thead><tbody>${actRows(false)}</tbody></table></div>
<p>(There is no 023B.) Constants you will need for expected results are on <code>constant-values.html</code>, e.g. job status <code>STATUS_PENDING "0"</code>, <code>STATUS_RUNNING "1"</code>, <code>STATUS_COMPLETE "2"</code>, <code>STATUS_ERROR "9"</code>; <code>RESPOND_SQL_STATUS_COMPLETE 1</code> / <code>ERROR -1</code>; <code>FLAG_SEND_MAIL "1"</code>; <code>PATTERN_YYYYMM "yyyyMM"</code>.</p>`,
    `<h3>Detail Design — trong <code>01.Guide/Detail Design/doc</code> có gì</h3>
<p>Một trang Javadoc (mã Shift-JIS, mô tả tiếng Nhật) của phần server của <strong>JNAP</strong>, một hệ thống batch tính cước/kế toán của Nhật, package <code>jp.co.jtnis.jnap1.svrint</code>. Javadoc của mỗi method được viết thành mô tả xử lý đánh số — đó chính là “DD”. Các mảnh ghép với nhau thế này:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">common.main</div><div class="lz-t">RegistProcess.main(params)</div><div class="lz-d">không có tham số → BusinessLogicException; tra action ID; log bắt đầu/kết thúc</div></div>
  <div class="lz-step"><div class="lz-k">action.manager</div><div class="lz-t">ActionOperator.execute</div><div class="lz-d">tạo action, gán tham số và DAO, chạy nó, ghi log lỗi</div></div>
  <div class="lz-step"><div class="lz-k">common.operator</div><div class="lz-t">ParameterConfig</div><div class="lz-d">kiểm từng tham số: bắt buộc, định dạng ngày, là số, thuộc tập giá trị</div></div>
  <div class="lz-step"><div class="lz-k">action.impl</div><div class="lz-t">SvrJNAPxxxBAction.execute</div><div class="lz-d">các bước nghiệp vụ — đối tượng test của bạn</div></div>
  <div class="lz-step"><div class="lz-k">dao</div><div class="lz-t">TranJobListDao …</div><div class="lz-d">bảng danh sách job, thông tin quyết toán, báo cáo công nợ, file chuyển khoản</div></div>
</div>
<div class="table-wrap"><table><thead><tr><th>Package</th><th>Nội dung</th></tr></thead><tbody>
<tr><td>action.iface / action.impl</td><td><code>IActionLauncher</code>; <code>ActionSupport</code> (method dùng chung <code>executeSql</code> — chạy file SQL bằng SQL*Plus và trả về trạng thái — và <code>sendMail</code> — gửi mail thông báo kết quả); 24 action batch (bảng dưới)</td></tr>
<tr><td>action.manager</td><td><code>IActionOperator</code>/<code>ActionOperator</code>: kết nối DB qua <code>HibernateOperator</code>, tạo action, transaction, log lỗi</td></tr>
<tr><td>annotation</td><td><code>FileColumn</code> (+ <code>Align</code>): ánh xạ cột file với thuộc tính bean</td></tr>
<tr><td>common.exception</td><td><code>BusinessLogicException</code>, <code>JnapException</code></td></tr>
<tr><td>common.operator</td><td><code>DaoResolver</code>, <code>HibernateOperator</code>, <code>ParameterConfig</code></td></tr>
<tr><td>common.utils</td><td><code>Constants</code>, <code>MessageIds</code>, <code>ActionIds</code>, <code>DateUtils</code>, <code>FileUtils</code>, <code>JnapLog</code>, <code>Resources</code>, <code>ReportCreator</code>, <code>FtpUploadFile</code>, tiện ích e-mail, adapter đọc/ghi file</td></tr>
<tr><td>dao.iface / dao.impl / dao.sql</td><td>7 DAO (BankTransferReceiveFile, BankTransferSendFile, ClosingInfo, ClosingMonth, Common, CreditReport, TranJobList) với bản cài đặt Hibernate; <code>SQLFactory</code></td></tr>
<tr><td>model</td><td>bean cho file và báo cáo (AccountTransferResultBean, PaymentDataBean, CreditReport…Bean …)</td></tr>
<tr><td>parameter</td><td><code>IParameter</code>, <code>ActionParameter</code>, annotation <code>ParameterInjection</code> (index, name, required, datePattern, checkNumber, valueSet, min/max value, length …)</td></tr>
</tbody></table></div>
<h3>24 lớp action bạn có thể chọn</h3>
<div class="table-wrap"><table><thead><tr><th>Lớp</th><th>Tên tiếng Nhật</th><th>Chức năng</th></tr></thead><tbody>${actRows(true)}</tbody></table></div>
<p>(Không có 023B.) Các hằng số cần cho kết quả mong đợi nằm ở <code>constant-values.html</code>, ví dụ trạng thái job <code>STATUS_PENDING "0"</code>, <code>STATUS_RUNNING "1"</code>, <code>STATUS_COMPLETE "2"</code>, <code>STATUS_ERROR "9"</code>; <code>RESPOND_SQL_STATUS_COMPLETE 1</code> / <code>ERROR -1</code>; <code>FLAG_SEND_MAIL "1"</code>; <code>PATTERN_YYYYMM "yyyyMM"</code>.</p>`),
    bi(`<h3>The two black-box checklists (03.Blackbox/*.xls)</h3>
<p>Both are Vietnamese translations of Japanese review checklists (Japanese terms kept in brackets).</p>
<ul>
<li><strong>Columns</strong> — No, Large item, Medium item, Check item, Result, DefectID, Note.</li>
<li><strong>Result values</strong> — OK = pass, NG = review again, “-” = not checked.</li>
</ul>
<div class="table-wrap"><table><thead><tr><th>CheckList_UT_Blackbox_Testcase (132 items)</th><th>Typical check items</th></tr></thead><tbody>
<tr><td>1–10 Document control</td><td>columns for pass date, category (normal/abnormal), procedure, test content (input + expected), test ID, execution date, executor, bug number (DMS ID) are filled; differences between the test environment and production (stubs, preconditions) are described; procedures are detailed enough that anyone can run the PCL</td></tr>
<tr><td>11–17 Cover all branches</td><td>statement, branch and condition coverage described; every branch tested, incl. values belonging to no branch; every data class (e.g. status 1, 5, 7) tested; unexpected class codes handled; every column of a state-transition table covered</td></tr>
<tr><td>18–30 Screen operation, validation</td><td>results provable; every DD function tested; module-level input/output interface as specified; separate cases for input validation and for abnormal system behaviour; log/trace output; invalid and missing parameters; combinations of parameters; return values (type, allowed set); IF/WHILE conditions true, false and at the boundary; file-conversion specs; temporary files/work tables deleted</td></tr>
<tr><td>31–38 Calculation</td><td>no overflow with maximum operands; rounding (四捨五入 round half up, 切り捨て round down, 切り上げ round up); division by zero prevented; totals over all data patterns; header/detail totals; NULL in calculations; special days (month end, month start, 締め日 closing day); matching of two keys (&lt;, =, &gt;)</td></tr>
<tr><td>39–72 Screen operation, validation</td><td>initial display values; omitted optional inputs; messages; IME control; cursor shape; screen transitions and return; events after input; focus after an error; required/null checks; format; max length incl. 2-byte kanji; character types (full/half-width katakana, alphanumeric); special characters; numbers — max, min, minus, comma, 0, leading zeros (前ゼロ), decimals, spaces; consistency between items; Western (西暦) vs Japanese (和暦) year; date validity (calendar / business days); 23:59:59 vs 24:00:00; past/future dates; access rights per role and via bookmarks</td></tr>
<tr><td>73–89 Output editing (screen/form)</td><td>max length/digits; line feeds and SQL-reserved characters; decimal rounding and integer-division precision; number editing; NULL/0/blank; calendars; 29 February; date arithmetic (+1 month); overflow; sort keys; scroll range; page breaks (e.g. 19/20/21 rows); subtotals across pages; no blank last page; abnormal data</td></tr>
<tr><td>90–99 Print output</td><td>print position; page count; remaining-time estimate; update control while printing; hard-coded strings; line/paragraph prohibition rules (禁則); print-error reporting</td></tr>
<tr><td>100–114 Search / list</td><td>combinations of extraction conditions; last day 23:59:59; from &gt; to, from = to, from or to omitted; special days; wildcard/password masking; AND/OR of several parameters; prefix (前方一致) and infix (中間一致) match; upper/lower and full/half width; duplicate keys; master record exists or not; number of child records; NULL key</td></tr>
<tr><td>115 Close</td><td>Alt-F4 behaves like the Close/Cancel buttons</td></tr>
<tr><td>116–123 DB update</td><td>retry on deadlock; retry-over; initial values of non-updated columns on insert; columns outside the update are unchanged; duplicated and derived columns updated together; total check on mass updates; exclusive lock</td></tr>
<tr><td>124–132 Files</td><td>input: normal variations, file/table missing, 0 records, abnormal data; output: format variations, no output data, access error, permission error, disk full</td></tr>
</tbody></table></div>
<div class="table-wrap"><table><thead><tr><th>CheckList_UT_Blackbox_UI (73 items)</th><th>Typical check items</th></tr></thead><tbody>
<tr><td>1–18 Basic</td><td>steps and inputs described with concrete values; each case confirms one item; everything in the basic design covered; system exceptions / forced logout checked; log value and format; parameter validation and combinations; overflow; rounding; 0 ÷ 0 and x ÷ 0; totals; NULL; IF/WHILE boundaries; month start/end; all comparison branches (&lt;, &gt;, =)</td></tr>
<tr><td>19–35 Screen operations</td><td>default values; empty fields; GUI standard; navigation and return; events after input; focus and data retention after an error; data extraction; from/to date &gt; &lt; = and omitted; password masking; permissions (also via bookmark); search result kept when paging</td></tr>
<tr><td>36–47 Validation</td><td>required/optional; format; max length with 2-byte kanji; character types; max, min, negative, comma, leading zero, 0, decimal, space in numeric fields</td></tr>
<tr><td>48–59 Output</td><td>max length; number display; overflow into DB; sorting; scroll; paging, no blank last page; print position; page and line counts; countdown estimates; update prevention; editing data being printed</td></tr>
<tr><td>60–61 Database</td><td>updated values/columns and untouched columns; unlock on deadlock</td></tr>
<tr><td>62–70 File input / output</td><td>normal data, file missing, no matching data, abnormal data; file name, format, empty output, access rights, disk full</td></tr>
<tr><td>71–73 Test data</td><td>enough data, matches each case, inserts without errors</td></tr>
</tbody></table></div>
<p>Both files also contain the same <strong>BoundaryLimitValue</strong> sheet as the white-box checklist (L2.6): lower − 1, lower, upper, upper + 1, and special values per data type.</p>`,
    `<h3>Hai checklist black-box (03.Blackbox/*.xls)</h3>
<p>Cả hai là bản dịch tiếng Việt của checklist review tiếng Nhật (thuật ngữ Nhật để trong ngoặc).</p>
<ul>
<li><strong>Cột</strong> — No, Large item, Medium item, Check item, Result, DefectID, Note.</li>
<li><strong>Giá trị Result</strong> — OK = đạt, NG = review lại, “-” = chưa kiểm.</li>
</ul>
<div class="table-wrap"><table><thead><tr><th>CheckList_UT_Blackbox_Testcase (132 mục)</th><th>Các mục kiểm tiêu biểu</th></tr></thead><tbody>
<tr><td>1–10 Quản lý tài liệu</td><td>đã có cột ngày pass, phân loại (normal/abnormal), trình tự thao tác, nội dung test (input + kết quả mong đợi), mã test, ngày chạy, người chạy, số báo lỗi (DMS ID); có mô tả khác biệt giữa môi trường test và môi trường thật (stub, điều kiện tiên quyết); trình tự đủ chi tiết để bất kỳ ai cũng chạy được PCL</td></tr>
<tr><td>11–17 Bao phủ mọi nhánh</td><td>có mô tả phủ lệnh, phủ nhánh, phủ điều kiện; test hết mọi nhánh, kể cả giá trị không thuộc nhánh nào; test hết mọi loại dữ liệu (ví dụ status 1, 5, 7); xử lý mã phân loại ngoài giả định; phủ mọi cột của bảng chuyển trạng thái</td></tr>
<tr><td>18–30 Thao tác màn hình, validation</td><td>kết quả chứng minh được; test hết mọi chức năng trong DD; giao diện vào/ra mức module đúng spec; ca riêng cho validation input và cho hệ thống bất thường; output log/trace; tham số không hợp lệ và thiếu; kết hợp tham số; giá trị trả về (kiểu, tập cho phép); điều kiện IF/WHILE đúng, sai và tại biên; spec convert file; file tạm/work table được xoá</td></tr>
<tr><td>31–38 Xử lý tính toán</td><td>không tràn số với toán hạng lớn nhất; làm tròn (四捨五入 làm tròn, 切り捨て làm tròn xuống, 切り上げ làm tròn lên); chặn chia cho 0; tổng hợp trên mọi mẫu dữ liệu; tổng header/detail; tính toán có NULL; ngày đặc biệt (cuối tháng, đầu tháng, 締め日 ngày chốt); so khớp hai khoá (&lt;, =, &gt;)</td></tr>
<tr><td>39–72 Thao tác màn hình, validation</td><td>giá trị hiển thị ban đầu; bỏ trống mục không bắt buộc; message; điều khiển IME; hình con trỏ; chuyển màn hình và quay lại; sự kiện sau khi nhập; vị trí focus sau lỗi; kiểm bắt buộc/null; định dạng; độ dài tối đa kể cả kanji 2 byte; loại chữ (katakana toàn/nửa độ rộng, chữ-số); ký tự đặc biệt; số — lớn nhất, nhỏ nhất, âm, dấu phẩy, 0, số 0 đầu (前ゼロ), thập phân, khoảng trắng; tương quan giữa các mục; năm dương lịch (西暦) và lịch Nhật (和暦); ngày hợp lệ (ngày lịch / ngày làm việc); 23:59:59 và 24:00:00; ngày quá khứ/tương lai; quyền theo vai trò và khi gọi qua bookmark</td></tr>
<tr><td>73–89 Biên tập output (màn hình/biểu mẫu)</td><td>độ dài/số chữ số tối đa; ký tự xuống dòng và ký tự dành riêng của SQL; làm tròn thập phân và độ chính xác chia nguyên; định dạng số; NULL/0/trống; lịch; 29/2; tính ngày (+1 tháng); tràn số; khoá và thứ tự sắp xếp; phạm vi cuộn; ngắt trang (ví dụ 19/20/21 dòng); tổng phụ qua nhiều trang; không có trang trắng cuối; dữ liệu bất thường</td></tr>
<tr><td>90–99 Chức năng in</td><td>vị trí in; số trang; dự tính thời gian còn lại; kiểm soát cập nhật khi đang in; chuỗi hard-code; quy tắc cấm ngắt dòng/đoạn (禁則); báo lỗi khi in</td></tr>
<tr><td>100–114 Tìm kiếm / danh sách</td><td>kết hợp điều kiện trích; ngày cuối 23:59:59; from &gt; to, from = to, bỏ from hoặc to; ngày đặc biệt; wildcard/che mật khẩu; AND/OR nhiều tham số; khớp đầu (前方一致) và khớp giữa (中間一致); hoa/thường, toàn/nửa độ rộng; trùng khoá; có/không có master record; số bản ghi con; khoá NULL</td></tr>
<tr><td>115 Đóng màn hình</td><td>Alt-F4 hoạt động như nút Đóng/Huỷ</td></tr>
<tr><td>116–123 Cập nhật DB</td><td>thử lại khi deadlock; quá số lần thử; giá trị khởi tạo của cột không cập nhật khi insert; cột ngoài đối tượng cập nhật không đổi; cột trùng và cột dẫn xuất cập nhật đồng thời; total check khi cập nhật số lượng lớn; khoá độc quyền</td></tr>
<tr><td>124–132 File</td><td>input: các biến thể bình thường, thiếu file/bảng, 0 bản ghi, dữ liệu bất thường; output: biến thể định dạng, không có dữ liệu output, lỗi truy cập, lỗi quyền, đầy đĩa</td></tr>
</tbody></table></div>
<div class="table-wrap"><table><thead><tr><th>CheckList_UT_Blackbox_UI (73 mục)</th><th>Các mục kiểm tiêu biểu</th></tr></thead><tbody>
<tr><td>1–18 Cơ bản</td><td>thao tác và input mô tả bằng giá trị cụ thể; mỗi ca xác nhận một mục; phủ hết basic design; kiểm exception hệ thống / bị đẩy ra màn hình login; giá trị và định dạng log; validate và kết hợp tham số; tràn số; làm tròn; 0 ÷ 0 và x ÷ 0; tính tổng; NULL; biên IF/WHILE; đầu/cuối tháng; mọi nhánh so sánh (&lt;, &gt;, =)</td></tr>
<tr><td>19–35 Thao tác màn hình</td><td>giá trị mặc định; ô trống; chuẩn GUI; điều hướng và quay lại; sự kiện sau khi nhập; focus và giữ dữ liệu sau lỗi; điều kiện trích dữ liệu; from/to date &gt; &lt; = và bỏ trống; che mật khẩu; phân quyền (kể cả qua bookmark); giữ kết quả tìm kiếm khi chuyển trang</td></tr>
<tr><td>36–47 Validation</td><td>bắt buộc/không bắt buộc; định dạng; độ dài tối đa với kanji 2 byte; loại chữ; số lớn nhất, nhỏ nhất, âm, dấu phẩy, số 0 đầu, 0, thập phân, khoảng trắng trong ô số</td></tr>
<tr><td>48–59 Output</td><td>độ dài tối đa; hiển thị số; tràn số khi ghi DB; sắp xếp; cuộn; phân trang, không trang trắng cuối; vị trí in; đếm trang và dòng; ước tính đếm ngược; chặn cập nhật; sửa dữ liệu đang in</td></tr>
<tr><td>60–61 Database</td><td>giá trị/cột được cập nhật và cột không được đụng tới; mở khoá khi deadlock</td></tr>
<tr><td>62–70 File input / output</td><td>dữ liệu bình thường, thiếu file, không có dữ liệu thoả điều kiện, dữ liệu bất thường; tên file, định dạng, output rỗng, quyền truy cập, đầy đĩa</td></tr>
<tr><td>71–73 Test data</td><td>đủ dữ liệu, đúng điều kiện từng ca, insert không lỗi</td></tr>
</tbody></table></div>
<p>Cả hai file còn có sheet <strong>BoundaryLimitValue</strong> giống checklist white-box (bài L2.6): cận dưới − 1, cận dưới, cận trên, cận trên + 1, và các giá trị đặc biệt theo kiểu dữ liệu.</p>`),
    bi(`<h3>Ví dụ có lời giải · Worked example — test analysis (EP + BVA) for JNAP001B from its DD</h3>
<p><code>SvrJNAP001BAction</code> (BT usage-detail creation) receives three start-up parameters, validated by <code>ParameterConfig</code> before <code>execute</code> runs (Javadoc of the fields):</p>
<ol>
<li><strong>yearMonthProcess</strong> — required, date pattern yyyyMM.</li>
<li><strong>orderProcess</strong> — required, must be a number.</li>
<li><strong>sendMailFlag</strong> — required, value set {"0","1"}.</li>
</ol>
<p>Violations throw <code>BusinessLogicException</code> with <code>JNAP_ERROR_PARAMETER_REQUIRED</code>, <code>…PARAM_NOT_MATCH_PATTERN</code>, <code>…PARAM_IS_NOT_A_NUMBER</code> or <code>…PARAM_NOT_IN_SET</code>. Inside <code>execute</code> the state of the job-list table and the SQL result are further inputs.</p>
<p>Analysis in the format of the FA23 PE template (Table 3.1):</p>
<div class="table-wrap"><table>
<thead><tr><th>Condition</th><th>Valid partitions</th><th>Tag</th><th>Invalid partitions</th><th>Tag</th><th>Valid boundaries</th><th>Tag</th><th>Invalid boundaries</th><th>Tag</th></tr></thead>
<tbody>
<tr><td>yearMonthProcess</td><td>yyyyMM with month 01–12 (e.g. 201712)</td><td>VP1</td><td>empty / missing</td><td>IP1</td><td>201701</td><td>VB1</td><td>201700</td><td>IB1</td></tr>
<tr><td></td><td></td><td></td><td>wrong format (2017/12)</td><td>IP2</td><td>201712</td><td>VB2</td><td>201713</td><td>IB2</td></tr>
<tr><td>orderProcess</td><td>numeric (1)</td><td>VP2</td><td>non-numeric (A1)</td><td>IP3</td><td></td><td></td><td></td><td></td></tr>
<tr><td>sendMailFlag</td><td>"1" send mail</td><td>VP3</td><td>outside the set ("2")</td><td>IP4</td><td></td><td></td><td></td><td></td></tr>
<tr><td></td><td>"0" no mail</td><td>VP4</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Job record (year-month, order)</td><td>exists, status 0 (pending)</td><td>VP5</td><td>does not exist</td><td>IP5</td><td></td><td></td><td></td><td></td></tr>
<tr><td></td><td></td><td></td><td>exists but not pending (already running) → 0 rows updated</td><td>IP6</td><td></td><td></td><td></td><td></td></tr>
<tr><td>bt_usagerep.sql result</td><td>1 (complete)</td><td>VP6</td><td>−1 (error)</td><td>IP7</td><td></td><td></td><td></td><td></td></tr>
</tbody></table></div>
<p>Assumption stated in the sheet: the yyyyMM check is strict, so month 00 and 13 are rejected. These 17 tags become the 13 UTCID columns of the worked sheet in L2.8 (2 N, 8 A, 3 B = 15.4 % : 61.5 % : 23.1 %, satisfying the ratio).</p>
<div class="pitfall co-tieu-de"><strong>Black-box does not mean “parameters only”.</strong> In a batch action most behaviour is driven by the database state and by the result of called programs (SQL*Plus, mail). A sheet that only varies the three parameters misses four of the five decisions of <code>execute</code>. Treat DB rows, file contents and settings as input conditions (guide slide 41) and write them in the Precondition rows.</div>
<div class="callout"><p><span class="badge">★ Beyond the syllabus</span> <strong>Characterisation tests when there is no design.</strong></p>
<p>The JNAP lab is lucky: a detailed design exists. For legacy code without one, Michael Feathers (<em>Working Effectively with Legacy Code</em>) recommends <em>characterisation tests</em>: run the code, record what it actually does, and pin that behaviour with tests before changing anything.</p>
<p>They are the opposite of guide slide 23's rule — the code becomes the oracle — which is acceptable only because the goal is to detect <em>changes</em>, not to prove correctness.</p>
<p class="ghi-chu">Outside the syllabus because CTFL assumes a test basis exists.</p></div>`,
    `<h3>Ví dụ có lời giải · Phân tích test (EP + BVA) cho JNAP001B từ DD của nó</h3>
<p><code>SvrJNAP001BAction</code> (tạo chi tiết sử dụng BT) nhận ba tham số khởi động, được <code>ParameterConfig</code> kiểm trước khi <code>execute</code> chạy (Javadoc của các field):</p>
<ol>
<li><strong>yearMonthProcess</strong> — bắt buộc, định dạng ngày yyyyMM.</li>
<li><strong>orderProcess</strong> — bắt buộc, phải là số.</li>
<li><strong>sendMailFlag</strong> — bắt buộc, thuộc tập {"0","1"}.</li>
</ol>
<p>Vi phạm sẽ ném <code>BusinessLogicException</code> với <code>JNAP_ERROR_PARAMETER_REQUIRED</code>, <code>…PARAM_NOT_MATCH_PATTERN</code>, <code>…PARAM_IS_NOT_A_NUMBER</code> hoặc <code>…PARAM_NOT_IN_SET</code>. Bên trong <code>execute</code>, trạng thái bảng danh sách job và kết quả SQL là các đầu vào khác.</p>
<p>Phân tích theo mẫu đề PE FA23 (Table 3.1):</p>
<div class="table-wrap"><table>
<thead><tr><th>Điều kiện</th><th>Phân vùng hợp lệ</th><th>Tag</th><th>Phân vùng không hợp lệ</th><th>Tag</th><th>Biên hợp lệ</th><th>Tag</th><th>Biên không hợp lệ</th><th>Tag</th></tr></thead>
<tbody>
<tr><td>yearMonthProcess</td><td>yyyyMM với tháng 01–12 (ví dụ 201712)</td><td>VP1</td><td>rỗng / thiếu</td><td>IP1</td><td>201701</td><td>VB1</td><td>201700</td><td>IB1</td></tr>
<tr><td></td><td></td><td></td><td>sai định dạng (2017/12)</td><td>IP2</td><td>201712</td><td>VB2</td><td>201713</td><td>IB2</td></tr>
<tr><td>orderProcess</td><td>là số (1)</td><td>VP2</td><td>không phải số (A1)</td><td>IP3</td><td></td><td></td><td></td><td></td></tr>
<tr><td>sendMailFlag</td><td>"1" gửi mail</td><td>VP3</td><td>ngoài tập ("2")</td><td>IP4</td><td></td><td></td><td></td><td></td></tr>
<tr><td></td><td>"0" không gửi</td><td>VP4</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Bản ghi job (năm-tháng, thứ tự)</td><td>có, trạng thái 0 (chờ xử lý)</td><td>VP5</td><td>không có</td><td>IP5</td><td></td><td></td><td></td><td></td></tr>
<tr><td></td><td></td><td></td><td>có nhưng không ở trạng thái chờ (đang chạy) → cập nhật 0 dòng</td><td>IP6</td><td></td><td></td><td></td><td></td></tr>
<tr><td>Kết quả bt_usagerep.sql</td><td>1 (xong)</td><td>VP6</td><td>−1 (lỗi)</td><td>IP7</td><td></td><td></td><td></td><td></td></tr>
</tbody></table></div>
<p>Giả định ghi trong sheet: kiểm tra yyyyMM là chặt, nên tháng 00 và 13 bị từ chối. 17 tag này trở thành 13 cột UTCID của sheet mẫu ở bài L2.8 (2 N, 8 A, 3 B = 15,4 % : 61,5 % : 23,1 %, thoả tỉ lệ).</p>
<div class="pitfall co-tieu-de"><strong>Black-box không có nghĩa là “chỉ tham số”.</strong> Trong một action batch, phần lớn hành vi do trạng thái database và kết quả của chương trình được gọi (SQL*Plus, mail) quyết định. Sheet chỉ thay đổi ba tham số sẽ bỏ sót bốn trong năm quyết định của <code>execute</code>. Hãy coi dòng DB, nội dung file và cấu hình là điều kiện đầu vào (slide 41 bộ hướng dẫn) và ghi chúng vào các dòng Precondition.</div>
<div class="callout"><p><span class="badge">★ Ngoài giáo trình</span> <strong>Characterisation test khi không có thiết kế.</strong></p>
<p>Lab JNAP may mắn: có sẵn detailed design. Với code cũ không có thiết kế, Michael Feathers (<em>Working Effectively with Legacy Code</em>) khuyên viết <em>characterisation test</em>: chạy code, ghi lại nó thật sự làm gì, và khoá hành vi đó bằng test trước khi sửa bất cứ gì.</p>
<p>Chúng đi ngược quy tắc slide 23 bộ hướng dẫn — code trở thành oracle — và chỉ chấp nhận được vì mục tiêu là phát hiện <em>thay đổi</em>, không phải chứng minh tính đúng.</p>
<p class="ghi-chu">Ngoài giáo trình vì CTFL mặc định là có test basis.</p></div>`),
    books([
      ['fst4', 'Ch.4 §2 black-box techniques — EP and BVA, Table 4.1 p.116 (book pp.112–120); §4 checklist-based testing (pp.140–142)', 'Chương 4 §2 kỹ thuật black-box — EP và BVA, Bảng 4.1 trang 116 (trang 112–120); §4 checklist-based testing (trang 140–142)'],
      ['sp5', '§5.1.1 EP PDF p.165, §5.1.2 BVA PDF p.176, §5.3 experience-based incl. checklists PDF p.233', '§5.1.1 EP PDF 165, §5.1.2 BVA PDF 176, §5.3 dựa trên kinh nghiệm kể cả checklist PDF 233'],
      ['fst', '§4.3 “Specification-based or black-box techniques” — p.87 (PDF p.90)', '§4.3 “Specification-based or black-box techniques” — trang 87 (PDF 90)'],
      ['junit', 'Ch.7 stubs PDF p.127 and Ch.8 mock objects PDF p.143 (isolating a batch action from DB and mail)', 'Chương 7 stub PDF 127 và Chương 8 mock object PDF 143 (tách action batch khỏi DB và mail)'],
    ]),
  ].join('\n'),
};

/* ───────────── L2.8 The Unit Test Case template + two fully worked sheets ───────────── */
/* Render a template-style matrix. rows: [group, label, valueEN, valueVI, cols] — cols = 1-based column numbers marked "O",
   or an object {n: text} for free-text cells (Type, Passed/Failed, Executed Date). */
function matrix(ids, rows, vi) {
  const head = `<tr><th></th><th></th><th></th>${ids.map((i) => `<th>${i}</th>`).join('')}</tr>`;
  const body = rows.map(([g, l, en, v, cols]) => {
    const cells = ids.map((_, k) => {
      if (Array.isArray(cols)) return `<td>${cols.includes(k + 1) ? 'O' : ''}</td>`;
      return `<td>${cols[k + 1] ?? ''}</td>`;
    }).join('');
    return `<tr><td><strong>${g}</strong></td><td>${l}</td><td>${vi ? v : en}</td>${cells}</tr>`;
  }).join('');
  return `<div class="table-wrap"><table>${head}${body}</table></div>`;
}
const J_IDS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13']; // UTCID01…UTCID13, shortened so the matrix fits
const ALL = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const J_ROWS = [
  ['Condition', 'Precondition', 'TRAN_JOB_LIST has the row (yearMonth, order) with status "0" (pending)', 'TRAN_JOB_LIST có dòng (năm-tháng, thứ tự) trạng thái "0" (chờ)', [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 13]],
  ['', '', 'no row for (yearMonth, order)', 'không có dòng (năm-tháng, thứ tự)', [6]],
  ['', '', 'row exists with status "1" (running)', 'có dòng nhưng trạng thái "1" (đang chạy)', [7]],
  ['', '', 'bt_usagerep.sql ends with 1 (complete)', 'bt_usagerep.sql kết thúc với 1 (xong)', [1, 2, 3]],
  ['', '', 'bt_usagerep.sql ends with −1 (error)', 'bt_usagerep.sql kết thúc với −1 (lỗi)', [8, 9]],
  ['', 'yearMonthProcess', '"201712"', '"201712"', [1, 2, 6, 7, 8, 9, 12, 13]],
  ['', '', '"201701"', '"201701"', [3]],
  ['', '', '"201713"', '"201713"', [4]],
  ['', '', '"201700"', '"201700"', [5]],
  ['', '', '"" (empty)', '"" (rỗng)', [10]],
  ['', '', '"2017/12"', '"2017/12"', [11]],
  ['', 'orderProcess', '"1"', '"1"', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13]],
  ['', '', '"A1"', '"A1"', [12]],
  ['', 'sendMailFlag', '"1"', '"1"', [1, 3, 4, 5, 6, 7, 8, 10, 11, 12]],
  ['', '', '"0"', '"0"', [2, 9]],
  ['', '', '"2"', '"2"', [13]],
  ['Confirm', 'Return', 'void (nothing returned)', 'void (không trả về)', ALL],
  ['', 'Exception', 'none', 'không có', [1, 2, 3, 8, 9]],
  ['', '', 'BusinessLogicException JNAP_ERROR_THERE_IS_NO_CORRESPONDING_RECORD', 'BusinessLogicException JNAP_ERROR_THERE_IS_NO_CORRESPONDING_RECORD', [6]],
  ['', '', 'BusinessLogicException JNAP_ERROR_CHANGE_STATUS_TO_RUNNING', 'BusinessLogicException JNAP_ERROR_CHANGE_STATUS_TO_RUNNING', [7]],
  ['', '', 'BusinessLogicException JNAP_ERROR_PARAM_NOT_MATCH_PATTERN', 'BusinessLogicException JNAP_ERROR_PARAM_NOT_MATCH_PATTERN', [4, 5, 11]],
  ['', '', 'BusinessLogicException JNAP_ERROR_PARAMETER_REQUIRED', 'BusinessLogicException JNAP_ERROR_PARAMETER_REQUIRED', [10]],
  ['', '', 'BusinessLogicException JNAP_ERROR_PARAM_IS_NOT_A_NUMBER', 'BusinessLogicException JNAP_ERROR_PARAM_IS_NOT_A_NUMBER', [12]],
  ['', '', 'BusinessLogicException JNAP_ERROR_PARAM_NOT_IN_SET', 'BusinessLogicException JNAP_ERROR_PARAM_NOT_IN_SET', [13]],
  ['', 'DB change', 'status 0 → 1 → 2 (complete)', 'trạng thái 0 → 1 → 2 (xong)', [1, 2, 3]],
  ['', '', 'status 0 → 1 → 9 (error)', 'trạng thái 0 → 1 → 9 (lỗi)', [8, 9]],
  ['', '', 'no change', 'không đổi', [4, 5, 6, 7, 10, 11, 12, 13]],
  ['', 'Mail', 'result mail “success”', 'mail kết quả “success”', [1, 3]],
  ['', '', 'result mail “error”', 'mail kết quả “error”', [8]],
  ['', '', 'no mail', 'không gửi mail', [2, 4, 5, 6, 7, 9, 10, 11, 12, 13]],
  ['', 'Log message', 'info log JNAP_START_ACTION … JNAP_END_ACTION', 'log info JNAP_START_ACTION … JNAP_END_ACTION', [1, 2, 3, 8, 9]],
  ['', '', 'error log with the message ID of the exception', 'log lỗi kèm message ID của exception', [4, 5, 6, 7, 10, 11, 12, 13]],
  ['Result', 'Type (N/A/B)', '', '', { 1: 'N', 2: 'N', 3: 'B', 4: 'B', 5: 'B', 6: 'A', 7: 'A', 8: 'A', 9: 'A', 10: 'A', 11: 'A', 12: 'A', 13: 'A' }],
  ['', 'Passed/Failed', '', '', { 1: 'P', 2: 'P', 6: 'P', 7: 'P', 8: 'P' }],
  ['', 'Executed Date', '', '', { 1: '11/09', 2: '11/09', 6: '11/09', 7: '11/09', 8: '11/09' }],
  ['', 'Defect ID', '', '', {}],
];
const C_IDS = ['UTCID01', 'UTCID02', 'UTCID03'];
const C_ROWS = [
  ['Condition', 'Precondition', 'N/A (static method, no state)', 'N/A (method static, không có trạng thái)', {}],
  ['', 'input', '"Aa1@"', '"Aa1@"', [1]],
  ['', '', '"" (empty string)', '"" (chuỗi rỗng)', [2]],
  ['', '', 'null', 'null', [3]],
  ['Confirm', 'Return', '{UpperCase=1, LowerCase=1, Numeric=1, SpecialCharacter=1}', '{UpperCase=1, LowerCase=1, Numeric=1, SpecialCharacter=1}', [1]],
  ['', '', '{UpperCase=0, LowerCase=0, Numeric=0, SpecialCharacter=0}', '{UpperCase=0, LowerCase=0, Numeric=0, SpecialCharacter=0}', [2]],
  ['', 'Exception', 'NullPointerException', 'NullPointerException', [3]],
  ['', 'Log message', '(none — the method logs nothing)', '(không có — method không ghi log)', {}],
  ['Result', 'Type (N/A/B)', '', '', { 1: 'N', 2: 'B', 3: 'A' }],
  ['', 'Passed/Failed', '', '', { 1: 'P', 2: 'P', 3: 'P' }],
  ['', 'Executed Date', '', '', { 1: '11/09', 2: '11/09', 3: '11/09' }],
  ['', 'Defect ID', '', '', {}],
];
const L28 = {
  title: 'L2.8 — The Unit Test Case template + worked sheets (JNAP001B, countCharacters)|||L2.8 — Template Unit Test Case + sheet mẫu (JNAP001B, countCharacters)',
  slug: 'swt301-lab2-template-worked',
  type: 'DOCUMENT',
  description: 'Giải thích từng sheet, từng ô của Template_Unit Test Case.xlsx và công thức (Lack of test cases, Test coverage…); sheet mẫu 13 UTCID cho SvrJNAP001BAction.execute; sheet tối thiểu cho countCharacters (đề PE FA23) đạt C0/C1 100 % — JUnit + JaCoCo chạy thật; nhận xét file mẫu SEP490 và file test case dạng danh sách.',
  content: [
    bi(`<span class="eyebrow">Lab 2 · Lesson L2.8 · Template_Unit Test Case.xlsx, Sample_Test Cases.xlsx, Samples/…Report5_Unit_Test.xlsx</span>
<h2>The Unit Test Case template, cell by cell</h2>
<p class="lead">Everything you hand in for Lab 2 — and Question 2 of the practical exam — goes into this workbook. It has a <strong>Guideline</strong> sheet, a <strong>Cover</strong>, a <strong>FunctionList</strong>, a <strong>Test Report</strong> and <strong>one matrix sheet per function</strong>. This lesson explains every block and formula, then fills two sheets completely and verifies them by running the tests.</p>
<div class="callout"><p><strong>Learning objectives</strong></p>
<ul>
<li>Fill every field of the template correctly</li>
<li>Build the condition × UTCID matrix with “O” marks, Confirm rows (Return, Exception, Log message) and the Result rows (Type N/A/B, Passed/Failed, Executed Date, Defect ID)</li>
<li>Compute Lack of test cases, Test coverage and Test successful coverage</li>
<li>Design the minimum test set for 100 % statement and decision coverage (LO-4.3.1/4.3.2)</li>
<li>Derive a black-box sheet from a detailed design (LO-4.2.1/4.2.2)</li>
</ul></div>
<h3>The sheets</h3>
<div class="table-wrap"><table><thead><tr><th>Sheet</th><th>Fields and meaning</th></tr></thead><tbody>
<tr><td>Guideline</td><td>How to read the template: test cases are organised by function, one sheet per function; each case = <strong>condition</strong> (precondition + input values: normal, boundary, abnormal) + <strong>confirmation</strong> (output of the function, log messages, screen messages); result P/F (or OK/NG).</td></tr>
<tr><td>Cover</td><td>Project Name, Project Code, Document Code (formula: <code>&lt;Project Code&gt;_XXX_vx.x</code>), Creator, Reviewer/Approver, Issue Date, Version; <strong>Record of change</strong>: Effective Date · Version · Change Item · *A,D,M (Added / Deleted / Modified) · Change description · Reference.</td></tr>
<tr><td>FunctionList</td><td>Project Name/Code, <strong>Normal number of Test cases/KLOC</strong> (default 100 — the norm), Test Environment Setup Description (server, database, browser…); table No · Requirement/Name · Class Name · Function Name · Function Code · Sheet Name (hyperlink to the function sheet — create the sheet first) · Description · Pre-Condition.</td></tr>
<tr><td>Test Report</td><td>Per function: Passed · Failed · Untested · N · A · B · Total Test Cases (each cell is a link to the function sheet's counters), Sub total, and five percentages (formulas below). “Check the Sub total formula if you add functions.”</td></tr>
<tr><td>Function sheet (e.g. additionMatrix, Function2)</td><td>Header, counters, matrix, result rows — next table.</td></tr>
</tbody></table></div>`,
    `<span class="eyebrow">Lab 2 · Bài L2.8 · Template_Unit Test Case.xlsx, Sample_Test Cases.xlsx, Samples/…Report5_Unit_Test.xlsx</span>
<h2>Template Unit Test Case, từng ô một</h2>
<p class="lead">Mọi thứ bạn nộp cho Lab 2 — và câu 2 của đề thi thực hành — đều nằm trong workbook này. Nó có sheet <strong>Guideline</strong>, <strong>Cover</strong>, <strong>FunctionList</strong>, <strong>Test Report</strong> và <strong>mỗi function một sheet ma trận</strong>. Bài này giải thích từng khối và từng công thức, rồi điền hoàn chỉnh hai sheet và kiểm chứng bằng cách chạy test thật.</p>
<div class="callout"><p><strong>Chuẩn đầu ra</strong></p>
<ul>
<li>Điền đúng mọi ô của template</li>
<li>Dựng ma trận điều kiện × UTCID với dấu “O”, các dòng Confirm (Return, Exception, Log message) và các dòng Result (Type N/A/B, Passed/Failed, Executed Date, Defect ID)</li>
<li>Tính Lack of test cases, Test coverage và Test successful coverage</li>
<li>Thiết kế bộ test tối thiểu cho 100 % phủ câu lệnh và phủ quyết định (LO-4.3.1/4.3.2)</li>
<li>Rút sheet black-box từ detailed design (LO-4.2.1/4.2.2)</li>
</ul></div>
<h3>Các sheet</h3>
<div class="table-wrap"><table><thead><tr><th>Sheet</th><th>Các ô và ý nghĩa</th></tr></thead><tbody>
<tr><td>Guideline</td><td>Cách đọc template: test case tổ chức theo function, mỗi function một sheet; mỗi ca = <strong>condition</strong> (điều kiện tiên quyết + giá trị input: normal, boundary, abnormal) + <strong>confirmation</strong> (output của function, log message, thông báo trên màn hình); kết quả P/F (hoặc OK/NG).</td></tr>
<tr><td>Cover</td><td>Project Name, Project Code, Document Code (công thức: <code>&lt;Project Code&gt;_XXX_vx.x</code>), Creator, Reviewer/Approver, Issue Date, Version; <strong>Record of change</strong>: Effective Date · Version · Change Item · *A,D,M (Thêm / Xoá / Sửa) · Change description · Reference.</td></tr>
<tr><td>FunctionList</td><td>Project Name/Code, <strong>Normal number of Test cases/KLOC</strong> (mặc định 100 — định mức), Test Environment Setup Description (server, database, trình duyệt…); bảng No · Requirement/Name · Class Name · Function Name · Function Code · Sheet Name (link tới sheet function — tạo sheet trước) · Description · Pre-Condition.</td></tr>
<tr><td>Test Report</td><td>Mỗi function một dòng: Passed · Failed · Untested · N · A · B · Total Test Cases (mỗi ô trỏ tới bộ đếm của sheet function), Sub total, và năm tỉ lệ phần trăm (công thức bên dưới). “Nhớ kiểm công thức Sub total khi thêm function.”</td></tr>
<tr><td>Sheet function (ví dụ additionMatrix, Function2)</td><td>Header, bộ đếm, ma trận, các dòng kết quả — bảng tiếp theo.</td></tr>
</tbody></table></div>`),
    bi(`<h3>The function sheet, block by block</h3>
<div class="table-wrap"><table><thead><tr><th>Block / cell</th><th>What to write</th><th>Formula in the file</th></tr></thead><tbody>
<tr><td>Function Code, Function Name</td><td>Copied from FunctionList (the ID and name of the method)</td><td>link to FunctionList</td></tr>
<tr><td>Created By / Executed By</td><td>Author of the cases / person who ran them</td><td>—</td></tr>
<tr><td>Lines of code</td><td>LOC of the method under test</td><td>—</td></tr>
<tr><td>Lack of test cases</td><td>How many cases short of the norm; negative = more than the norm; if &gt; 0 you must explain why</td><td><code>IF(norm&lt;&gt;"N/A", LOC × norm / 1000 − Total, "N/A")</code></td></tr>
<tr><td>Test requirement</td><td>Short description of what is tested (optional)</td><td>—</td></tr>
<tr><td>Passed · Failed · Untested</td><td>Counters</td><td>COUNTIF of “P” / “F” in the Passed/Failed row; Untested = Total − P − F</td></tr>
<tr><td>N/A/B (three cells)</td><td>Number of Normal, Abnormal, Boundary cases</td><td>COUNTIF of “N”, “A”, “B” in the Type row</td></tr>
<tr><td>Total Test Cases</td><td>Number of cases</td><td>COUNTA of the UTCID header row — every filled UTCID header counts, even if its column is empty</td></tr>
<tr><td>UTCID01, UTCID02 … (row 9)</td><td>One column per test case</td><td>—</td></tr>
<tr><td><strong>Condition</strong> → Precondition</td><td>State that must exist before the case: DB rows, files, “can connect to server”</td><td>—</td></tr>
<tr><td><strong>Condition</strong> → one block per input</td><td>Input name in column B, one <em>specific</em> value per row in column D, “O” in the columns that use it</td><td>—</td></tr>
<tr><td><strong>Confirm</strong> → Return</td><td>Each distinct return value on its own row, “O” per case</td><td>—</td></tr>
<tr><td><strong>Confirm</strong> → Exception</td><td>Exception class (and message ID) expected</td><td>—</td></tr>
<tr><td><strong>Confirm</strong> → Log message</td><td>Log/screen messages expected (add rows for DB changes, mails, files if needed)</td><td>—</td></tr>
<tr><td><strong>Result</strong> → Type</td><td>N (Normal), A (Abnormal), B (Boundary) — by the type of input data</td><td>—</td></tr>
<tr><td><strong>Result</strong> → Passed/Failed, Executed Date, Defect ID</td><td>P or F after running; date; bug ID for failed cases</td><td>—</td></tr>
</tbody></table></div>
<h3>Test Report formulas, checked on the template's own sample</h3>
<p>The sample Test Report has three functions with Passed 0+12+12 = 24, Failed 0+3+2 = 5, Untested 2+0+1 = 3, N 25, A 5, B 2, Total 32. The formulas give — exactly the values stored in the file:</p>
<ul>
<li><strong>Test coverage</strong> = (Passed + Failed) × 100 / Total = 29 × 100 / 32 = <strong>90.625 %</strong> (cases executed).</li>
<li><strong>Test successful coverage</strong> = Passed × 100 / Total = <strong>75 %</strong>.</li>
<li><strong>Normal case</strong> = 25/32 = 78.125 %, <strong>Abnormal</strong> = 5/32 = 15.625 %, <strong>Boundary</strong> = 2/32 = 6.25 %.</li>
</ul>
<p>Note that “Test coverage” here means <em>execution progress</em>, not code coverage.</p>
<p class="nhan">The template's sample sheets are placeholders</p>
<ul>
<li><strong>additionMatrix</strong> — 2 cases, 20 LOC → lack 2 − 2 = 0.</li>
<li><strong>fncPersonalIncomeTax</strong> — 15 UTCID headers but only 2 filled; 20 LOC → lack 2 − 15 = −13.</li>
<li><strong>Function2/Function3</strong> — 300 LOC → lack 30 − 15 = 15.</li>
</ul>`,
    `<h3>Sheet function, từng khối</h3>
<div class="table-wrap"><table><thead><tr><th>Khối / ô</th><th>Ghi gì</th><th>Công thức trong file</th></tr></thead><tbody>
<tr><td>Function Code, Function Name</td><td>Lấy từ FunctionList (mã và tên method)</td><td>link tới FunctionList</td></tr>
<tr><td>Created By / Executed By</td><td>Người viết ca / người chạy ca</td><td>—</td></tr>
<tr><td>Lines of code</td><td>Số dòng code của method được test</td><td>—</td></tr>
<tr><td>Lack of test cases</td><td>Thiếu bao nhiêu ca so với định mức; số âm = nhiều hơn định mức; nếu &gt; 0 phải giải thích lý do</td><td><code>IF(norm&lt;&gt;"N/A", LOC × norm / 1000 − Total, "N/A")</code></td></tr>
<tr><td>Test requirement</td><td>Mô tả ngắn cái được test (không bắt buộc)</td><td>—</td></tr>
<tr><td>Passed · Failed · Untested</td><td>Bộ đếm</td><td>COUNTIF “P” / “F” ở dòng Passed/Failed; Untested = Total − P − F</td></tr>
<tr><td>N/A/B (ba ô)</td><td>Số ca Normal, Abnormal, Boundary</td><td>COUNTIF “N”, “A”, “B” ở dòng Type</td></tr>
<tr><td>Total Test Cases</td><td>Số ca</td><td>COUNTA dòng tiêu đề UTCID — mọi ô UTCID đã ghi đều được đếm, kể cả khi cột trống</td></tr>
<tr><td>UTCID01, UTCID02 … (dòng 9)</td><td>Mỗi test case một cột</td><td>—</td></tr>
<tr><td><strong>Condition</strong> → Precondition</td><td>Trạng thái phải có trước khi chạy ca: dòng DB, file, “kết nối được server”</td><td>—</td></tr>
<tr><td><strong>Condition</strong> → mỗi input một khối</td><td>Tên input ở cột B, mỗi giá trị <em>cụ thể</em> một dòng ở cột D, “O” ở các cột dùng nó</td><td>—</td></tr>
<tr><td><strong>Confirm</strong> → Return</td><td>Mỗi giá trị trả về khác nhau một dòng, “O” theo ca</td><td>—</td></tr>
<tr><td><strong>Confirm</strong> → Exception</td><td>Lớp exception (và message ID) mong đợi</td><td>—</td></tr>
<tr><td><strong>Confirm</strong> → Log message</td><td>Log/thông báo màn hình mong đợi (thêm dòng cho thay đổi DB, mail, file nếu cần)</td><td>—</td></tr>
<tr><td><strong>Result</strong> → Type</td><td>N (Normal), A (Abnormal), B (Boundary) — theo loại dữ liệu đầu vào</td><td>—</td></tr>
<tr><td><strong>Result</strong> → Passed/Failed, Executed Date, Defect ID</td><td>P hoặc F sau khi chạy; ngày; mã bug cho ca fail</td><td>—</td></tr>
</tbody></table></div>
<h3>Công thức Test Report, kiểm trên chính mẫu của template</h3>
<p>Test Report mẫu có ba function với Passed 0+12+12 = 24, Failed 0+3+2 = 5, Untested 2+0+1 = 3, N 25, A 5, B 2, Total 32. Công thức cho — đúng các giá trị lưu trong file:</p>
<ul>
<li><strong>Test coverage</strong> = (Passed + Failed) × 100 / Total = 29 × 100 / 32 = <strong>90,625 %</strong> (số ca đã chạy).</li>
<li><strong>Test successful coverage</strong> = Passed × 100 / Total = <strong>75 %</strong>.</li>
<li><strong>Normal case</strong> = 25/32 = 78,125 %, <strong>Abnormal</strong> = 5/32 = 15,625 %, <strong>Boundary</strong> = 2/32 = 6,25 %.</li>
</ul>
<p>Để ý “Test coverage” ở đây nghĩa là <em>tiến độ chạy test</em>, không phải code coverage.</p>
<p class="nhan">Các sheet mẫu của template chỉ là khung</p>
<ul>
<li><strong>additionMatrix</strong> — 2 ca, 20 LOC → thiếu 2 − 2 = 0.</li>
<li><strong>fncPersonalIncomeTax</strong> — 15 tiêu đề UTCID nhưng chỉ điền 2; 20 LOC → thiếu 2 − 15 = −13.</li>
<li><strong>Function2/Function3</strong> — 300 LOC → thiếu 30 − 15 = 15.</li>
</ul>`),
    bi(`<h3>Ví dụ có lời giải 1 · Worked sheet — <code>SvrJNAP001BAction.execute</code> from the Detail Design (black-box)</h3>
<p class="nhan">Header</p>
<ul>
<li><strong>Function Code</strong> — JNAP001B.</li>
<li><strong>Function Name</strong> — SvrJNAP001BAction.execute (BT usage-detail creation).</li>
<li><strong>Created by / Executed by</strong> — you.</li>
<li><strong>Lines of code</strong> — 27 (the re-implementation below; the real source is not in the lab folder).</li>
<li><strong>Test requirement</strong> — “start-up parameters validated; job status pending → running → complete/error; result mail according to flag”.</li>
<li><strong>Test basis</strong> — the Javadoc steps 1–4 of <code>execute</code>, the field annotations and <code>ParameterConfig.injectConfigParameter</code>; tags from L2.7.</li>
</ul>
<p><em>Columns 01–13 = UTCID01–UTCID13.</em></p>
${matrix(J_IDS, J_ROWS, false)}
<p class="nhan">Counters</p>
<ul>
<li><strong>Case mix</strong> — Total 13: N 2, A 8, B 3 → 15.4 % : 61.5 % : 23.1 %, meeting &lt; 20 % : &gt; 60 % : &gt; 20 %.</li>
<li><strong>Lack of test cases</strong> = 27 × 100 / 1000 − 13 = −10.3 (no lack).</li>
<li><strong>Execution</strong> — Passed 5, Failed 0, Untested 8 → Test coverage = 5 × 100 / 13 = 38.46 %.</li>
</ul>
<p>The five executed columns (01, 02, 06, 07, 08) are exactly the cases that reach every decision of <code>execute</code>; the eight parameter-validation and boundary columns need the real launcher (<code>RegistProcess</code> + <code>ParameterConfig</code>) and a database.</p>
<p><strong>Verification.</strong> <code>execute</code> was re-implemented line by line from the Javadoc, with the DAO, SQL*Plus and mail replaced by stubs (a fake <code>TranJobListDao</code> that records every status change, and a subclass overriding <code>executeSql</code>/<code>sendMail</code>). Real output of JUnit 5.12.2 + JaCoCo 0.8.13:</p>
<pre><code>PASSED UTCID01 N  record=1, SQL ok, flag=1 -&gt; 0-&gt;1, 1-&gt;2, mail success
PASSED UTCID06 A  record=0 -&gt; BusinessLogicException NO_CORRESPONDING_RECORD
PASSED UTCID07 A  record=1 but 0 rows 0-&gt;1 -&gt; BusinessLogicException CHANGE_STATUS_TO_RUNNING
PASSED UTCID08 A  SQL returns -1, flag=1 -&gt; 1-&gt;9, mail error
PASSED UTCID02 N  SQL ok, flag=0 -&gt; 1-&gt;2, no mail
Tests run: 5, passed: 5, failed: 0
Method execute: lines 16/16, branches 10/10</code></pre>
<p>So five black-box columns derived from the DD also give 100 % C0/C1 of a faithful implementation — a good sign that the DD steps are fully covered. (UTCID09, SQL error with flag “0”, is an extra abnormal combination not needed for coverage.)</p>`,
    `<h3>Ví dụ có lời giải 1 · Sheet mẫu — <code>SvrJNAP001BAction.execute</code> từ Detail Design (black-box)</h3>
<p class="nhan">Phần đầu (Header)</p>
<ul>
<li><strong>Function Code</strong> — JNAP001B.</li>
<li><strong>Function Name</strong> — SvrJNAP001BAction.execute (tạo chi tiết sử dụng BT).</li>
<li><strong>Created by / Executed by</strong> — bạn.</li>
<li><strong>Lines of code</strong> — 27 (bản dựng lại bên dưới; mã nguồn thật không có trong thư mục lab).</li>
<li><strong>Test requirement</strong> — “tham số khởi động được kiểm; trạng thái job chờ → đang chạy → xong/lỗi; mail kết quả theo cờ”.</li>
<li><strong>Test basis</strong> — các bước 1–4 trong Javadoc của <code>execute</code>, annotation của các field và <code>ParameterConfig.injectConfigParameter</code>; các tag lấy từ bài L2.7.</li>
</ul>
<p><em>Cột 01–13 = UTCID01–UTCID13.</em></p>
${matrix(J_IDS, J_ROWS, true)}
<p class="nhan">Bộ đếm</p>
<ul>
<li><strong>Tỉ lệ ca</strong> — Total 13: N 2, A 8, B 3 → 15,4 % : 61,5 % : 23,1 %, thoả &lt; 20 % : &gt; 60 % : &gt; 20 %.</li>
<li><strong>Lack of test cases</strong> = 27 × 100 / 1000 − 13 = −10,3 (không thiếu).</li>
<li><strong>Thực thi</strong> — Passed 5, Failed 0, Untested 8 → Test coverage = 5 × 100 / 13 = 38,46 %.</li>
</ul>
<p>Năm cột đã chạy (01, 02, 06, 07, 08) chính là các ca đi tới mọi quyết định của <code>execute</code>; tám cột kiểm tham số và biên cần launcher thật (<code>RegistProcess</code> + <code>ParameterConfig</code>) và database.</p>
<p><strong>Kiểm chứng.</strong> <code>execute</code> được dựng lại từng dòng theo Javadoc, thay DAO, SQL*Plus và mail bằng stub (một <code>TranJobListDao</code> giả ghi lại mọi lần đổi trạng thái, và một lớp con override <code>executeSql</code>/<code>sendMail</code>). Kết quả thật của JUnit 5.12.2 + JaCoCo 0.8.13:</p>
<pre><code>PASSED UTCID01 N  record=1, SQL ok, flag=1 -&gt; 0-&gt;1, 1-&gt;2, mail success
PASSED UTCID06 A  record=0 -&gt; BusinessLogicException NO_CORRESPONDING_RECORD
PASSED UTCID07 A  record=1 but 0 rows 0-&gt;1 -&gt; BusinessLogicException CHANGE_STATUS_TO_RUNNING
PASSED UTCID08 A  SQL returns -1, flag=1 -&gt; 1-&gt;9, mail error
PASSED UTCID02 N  SQL ok, flag=0 -&gt; 1-&gt;2, no mail
Tests run: 5, passed: 5, failed: 0
Method execute: lines 16/16, branches 10/10</code></pre>
<p>Vậy năm cột black-box rút từ DD cũng cho C0/C1 100 % trên một bản cài đặt trung thành — dấu hiệu tốt rằng các bước của DD đã được phủ hết. (UTCID09, SQL lỗi với cờ “0”, là tổ hợp bất thường thêm, không cần cho coverage.)</p>`),
    bi(`<h3>Ví dụ có lời giải 2 · Worked sheet — FA23 PE Question 2: <code>countCharacters(String)</code></h3>
<p>The exam asks: “design and create the <strong>minimum</strong> component test cases needed to achieve <strong>100 % statement coverage and 100 % decision coverage</strong>” for:</p>
<pre><code>public static HashMap&lt;String, Integer&gt; countCharacters(String input) {
    int upperCaseCount = 0;
    int lowerCaseCount = 0;
    int numericCount = 0;
    int specialCharCount = 0;

    for (char c : input.toCharArray()) {                 // D1 loop: iterate again / exit
        if (Character.isUpperCase(c)) {                  // D2
            upperCaseCount++;
        } else if (Character.isLowerCase(c)) {           // D3
            lowerCaseCount++;
        } else if (Character.isDigit(c)) {               // D4
            numericCount++;
        } else {
            specialCharCount++;
        }
    }
    HashMap&lt;String, Integer&gt; characterCounts = new HashMap&lt;&gt;();
    characterCounts.put("UpperCase", upperCaseCount);
    characterCounts.put("LowerCase", lowerCaseCount);
    characterCounts.put("Numeric", numericCount);
    characterCounts.put("SpecialCharacter", specialCharCount);
    return characterCounts;
}</code></pre>
<p><strong>Reasoning.</strong> Four decisions, eight outcomes. One input string is processed character by character, so a <em>single</em> string can make every decision go both ways: with “Aa1@”, ‘A’ makes D2 true; ‘a’ makes D2 false and D3 true; ‘1’ makes D3 false and D4 true; ‘@’ makes D4 false (else branch); the loop iterates (D1 true) and finally exits (D1 false). All statements run. <strong>Minimum = 1 test case.</strong></p>
${matrix(C_IDS, C_ROWS, false)}
<p>UTCID01 alone is the answer to the question. UTCID02 (empty string — the loop body never runs) and UTCID03 (null — the method has no null check and throws) are good practice for the lab's N/A/B mix but are not needed for coverage. In the exam template the “Lines of code” cell is blank, so “Lack of test cases” shows −(number of cases).</p>
<p><strong>JUnit script</strong> (minimal):</p>
<pre><code>@Test // UTCID01 (N): one character of each class
void utcid01_oneOfEachKind() {
    Map&lt;String, Integer&gt; r = CharacterCounter.countCharacters("Aa1@");
    assertEquals(Map.of("UpperCase", 1, "LowerCase", 1, "Numeric", 1, "SpecialCharacter", 1), r);
}</code></pre>
<p><strong>Real output</strong> (JDK 21, JUnit 5.12.2, JaCoCo 0.8.13; line numbers L9–L17 are those of the exam listing, where line 1 is the import; per-line lists shortened to the decision lines) — run 1 with UTCID01 only, run 2 with the popular but <em>wrong</em> answer “A”, “a”, “1” (three tests, no special character), run 3 with UTCID01–03:</p>
<pre><code>### Run 1: minimal suite (UTCID01 only)
PASSED utcid01_oneOfEachKind()
Tests run: 1, passed: 1, failed: 0
Method countCharacters: lines 18/18, branches 8/8
  L9   FULL    for (char c : input.toCharArray()) {  [branches 2/2]
  L10  FULL    if (Character.isUpperCase(c)) {  [branches 2/2]
  L12  FULL    } else if (Character.isLowerCase(c)) {  [branches 2/2]
  L14  FULL    } else if (Character.isDigit(c)) {  [branches 2/2]
### Run 2: "A", "a", "1"
PASSED digitOnly()
PASSED lowerOnly()
PASSED upperOnly()
Tests run: 3, passed: 3, failed: 0
Method countCharacters: lines 17/18, branches 7/8
  L14  PARTLY  } else if (Character.isDigit(c)) {  [branches 1/2]
  L17  MISSED  specialCharCount++;
### Run 3: UTCID01-03
PASSED utcid01_oneOfEachKind()
PASSED utcid02_emptyString()
PASSED utcid03_null()
Tests run: 3, passed: 3, failed: 0
Method countCharacters: lines 18/18, branches 8/8</code></pre>
<div class="pitfall co-tieu-de"><p><strong>Two classic mistakes on this question.</strong></p>
<ol>
<li><strong>One case per branch</strong> (“A”, “a”, “1”, “@” = 4 cases) — it reaches 100 % but is not the <em>minimum</em>; a loop lets one input exercise many branches.</li>
<li><strong>Forgetting the special character</strong> — three cases, all green, but 7/8 branches and one statement never run (run 2).</li>
</ol>
<p>If you do write several cases, make sure each column has at least one “O” in every block and that no two columns are identical.</p></div>`,
    `<h3>Ví dụ có lời giải 2 · Sheet mẫu — Câu 2 đề PE FA23: <code>countCharacters(String)</code></h3>
<p>Đề hỏi: “thiết kế và tạo <strong>số component test case tối thiểu</strong> cần để đạt <strong>100 % statement coverage và 100 % decision coverage</strong>” cho:</p>
<pre><code>public static HashMap&lt;String, Integer&gt; countCharacters(String input) {
    int upperCaseCount = 0;
    int lowerCaseCount = 0;
    int numericCount = 0;
    int specialCharCount = 0;

    for (char c : input.toCharArray()) {                 // D1 vòng lặp: lặp tiếp / thoát
        if (Character.isUpperCase(c)) {                  // D2
            upperCaseCount++;
        } else if (Character.isLowerCase(c)) {           // D3
            lowerCaseCount++;
        } else if (Character.isDigit(c)) {               // D4
            numericCount++;
        } else {
            specialCharCount++;
        }
    }
    HashMap&lt;String, Integer&gt; characterCounts = new HashMap&lt;&gt;();
    characterCounts.put("UpperCase", upperCaseCount);
    characterCounts.put("LowerCase", lowerCaseCount);
    characterCounts.put("Numeric", numericCount);
    characterCounts.put("SpecialCharacter", specialCharCount);
    return characterCounts;
}</code></pre>
<p><strong>Lập luận.</strong> Bốn quyết định, tám kết quả. Chuỗi đầu vào được xử lý từng ký tự, nên <em>một</em> chuỗi duy nhất có thể làm mọi quyết định đi cả hai hướng: với “Aa1@”, ‘A’ làm D2 đúng; ‘a’ làm D2 sai và D3 đúng; ‘1’ làm D3 sai và D4 đúng; ‘@’ làm D4 sai (nhánh else); vòng lặp lặp (D1 đúng) và cuối cùng thoát (D1 sai). Mọi câu lệnh đều chạy. <strong>Tối thiểu = 1 test case.</strong></p>
${matrix(C_IDS, C_ROWS, true)}
<p>Chỉ UTCID01 là đáp án của câu hỏi. UTCID02 (chuỗi rỗng — thân vòng lặp không chạy) và UTCID03 (null — method không kiểm null nên ném exception) là thói quen tốt cho tỉ lệ N/A/B của lab nhưng không cần cho coverage. Trong template đề thi, ô “Lines of code” để trống nên “Lack of test cases” hiện −(số ca).</p>
<p><strong>JUnit script</strong> (tối thiểu):</p>
<pre><code>@Test // UTCID01 (N): one character of each class
void utcid01_oneOfEachKind() {
    Map&lt;String, Integer&gt; r = CharacterCounter.countCharacters("Aa1@");
    assertEquals(Map.of("UpperCase", 1, "LowerCase", 1, "Numeric", 1, "SpecialCharacter", 1), r);
}</code></pre>
<p><strong>Kết quả thật</strong> (JDK 21, JUnit 5.12.2, JaCoCo 0.8.13; số dòng L9–L17 theo đúng đoạn code trong đề, dòng 1 là import; danh sách từng dòng được rút gọn còn các dòng quyết định) — lần 1 chỉ UTCID01, lần 2 với đáp án phổ biến nhưng <em>sai</em> “A”, “a”, “1” (ba test, không có ký tự đặc biệt), lần 3 với UTCID01–03:</p>
<pre><code>### Run 1: minimal suite (UTCID01 only)
PASSED utcid01_oneOfEachKind()
Tests run: 1, passed: 1, failed: 0
Method countCharacters: lines 18/18, branches 8/8
  L9   FULL    for (char c : input.toCharArray()) {  [branches 2/2]
  L10  FULL    if (Character.isUpperCase(c)) {  [branches 2/2]
  L12  FULL    } else if (Character.isLowerCase(c)) {  [branches 2/2]
  L14  FULL    } else if (Character.isDigit(c)) {  [branches 2/2]
### Run 2: "A", "a", "1"
PASSED digitOnly()
PASSED lowerOnly()
PASSED upperOnly()
Tests run: 3, passed: 3, failed: 0
Method countCharacters: lines 17/18, branches 7/8
  L14  PARTLY  } else if (Character.isDigit(c)) {  [branches 1/2]
  L17  MISSED  specialCharCount++;
### Run 3: UTCID01-03
PASSED utcid01_oneOfEachKind()
PASSED utcid02_emptyString()
PASSED utcid03_null()
Tests run: 3, passed: 3, failed: 0
Method countCharacters: lines 18/18, branches 8/8</code></pre>
<div class="pitfall co-tieu-de"><p><strong>Hai lỗi kinh điển ở câu này.</strong></p>
<ol>
<li><strong>Mỗi nhánh một ca</strong> (“A”, “a”, “1”, “@” = 4 ca) — đạt 100 % nhưng không phải <em>tối thiểu</em>; vòng lặp cho phép một đầu vào đi qua nhiều nhánh.</li>
<li><strong>Quên ký tự đặc biệt</strong> — ba ca, xanh hết, nhưng 7/8 nhánh và một câu lệnh chưa chạy (lần 2).</li>
</ol>
<p>Nếu có viết nhiều ca, hãy chắc mỗi cột có ít nhất một “O” ở mọi khối và không có hai cột giống hệt nhau.</p></div>`),
    bi(`<h3>The two other files in Template/</h3>
<p><strong>Sample_Test Cases.xlsx</strong> (project “Family Medical Officer”, FMO_IT&amp;ST Test Cases v1.3, 2011) is an integration/system test file in <strong>list format</strong> (guide slide 81).</p>
<ul>
<li><strong>Cover</strong> — a long record of change and the test environments (Samsung Galaxy S II, iPhone 3/4 … and the server).</li>
<li><strong>Test Report per sub-module</strong> — hours per device, Pass/Fail/Untest/N/A, number of runs on all devices; some cells show <code>#REF!</code> (broken links).</li>
<li><strong>Module sheets</strong> — columns ID, Test Case Description, Pre-Condition, Test Case Procedure (numbered steps), Expected Output, Bug#, System test environment, Test date, Note.</li>
</ul>
<p>Use this format for procedure-heavy tests, the matrix for unit tests.</p>
<p><strong>Samples/…SEP490_G47…Report5_Unit_Test.xlsx</strong> is a real capstone team's unit-test report (Chatbot AI Platform, 27 methods such as <code>chat</code>, <code>getLiveChatList</code>, <code>createBot</code>, <code>confirmPayment</code>, with a norm of 20 TC/KLOC).</p>
<p class="nhan">Worth copying — the <code>chat</code> sheet uses the matrix well</p>
<ul>
<li><strong>Inputs</strong> — ChatId, Message, BotId, IsLogin, each with a valid value, "", null and an invalid value.</li>
<li><strong>One input changed per column.</strong></li>
<li><strong>A log message per case</strong> — “ChatId cannot be empty”, “BotId is required” …</li>
</ul>
<p class="nhan">Worth questioning — the Statistics sheet</p>
<ul>
<li><strong>55 cases, 100 % passed</strong>, N 14.5 %, A 10.9 %, <strong>B 74.5 %</strong>.</li>
<li><strong>Misclassified</strong> — "" and null are typed B (boundary) instead of A.</li>
<li><strong>Zero failures, zero defects</strong> — says more about the classification and the tests than about the code (guide slide 5: too few UT defects is a warning sign).</li>
</ul>`,
    `<h3>Hai file còn lại trong Template/</h3>
<p><strong>Sample_Test Cases.xlsx</strong> (dự án “Family Medical Officer”, FMO_IT&amp;ST Test Cases v1.3, 2011) là file test integration/system dạng <strong>danh sách</strong> (slide 81 bộ hướng dẫn).</p>
<ul>
<li><strong>Cover</strong> — lịch sử thay đổi dài và môi trường test (Samsung Galaxy S II, iPhone 3/4 … và server).</li>
<li><strong>Test Report theo sub-module</strong> — số giờ mỗi thiết bị, Pass/Fail/Untest/N/A, số lần chạy trên mọi thiết bị; vài ô hiện <code>#REF!</code> (link bị hỏng).</li>
<li><strong>Các sheet module</strong> — cột ID, Test Case Description, Pre-Condition, Test Case Procedure (các bước đánh số), Expected Output, Bug#, System test environment, Test date, Note.</li>
</ul>
<p>Dùng dạng này cho test nặng về thủ tục, dạng ma trận cho unit test.</p>
<p><strong>Samples/…SEP490_G47…Report5_Unit_Test.xlsx</strong> là báo cáo unit test thật của một nhóm đồ án (Chatbot AI Platform, 27 method như <code>chat</code>, <code>getLiveChatList</code>, <code>createBot</code>, <code>confirmPayment</code>, định mức 20 TC/KLOC).</p>
<p class="nhan">Đáng học theo — sheet <code>chat</code> dùng ma trận tốt</p>
<ul>
<li><strong>Input</strong> — ChatId, Message, BotId, IsLogin, mỗi cái có giá trị hợp lệ, "", null và một giá trị sai.</li>
<li><strong>Mỗi cột đổi một input.</strong></li>
<li><strong>Mỗi ca một log message</strong> — “ChatId cannot be empty”, “BotId is required” …</li>
</ul>
<p class="nhan">Đáng đặt câu hỏi — sheet Statistics</p>
<ul>
<li><strong>55 ca, pass 100 %</strong>, N 14,5 %, A 10,9 %, <strong>B 74,5 %</strong>.</li>
<li><strong>Phân loại sai</strong> — "" và null bị xếp B (biên) thay vì A.</li>
<li><strong>Không ca fail, không defect</strong> — nói về cách phân loại và chất lượng test nhiều hơn là về code (slide 5 bộ hướng dẫn: quá ít defect ở UT là dấu hiệu cảnh báo).</li>
</ul>`),
    bi(`<div class="callout"><p><span class="badge">★ Beyond the syllabus</span> <strong>Generating the sheet from the tests.</strong></p>
<p>Teams that keep both a spreadsheet and JUnit code soon find they disagree. A common fix is to make the code the source:</p>
<ol>
<li>Name tests after UTCIDs (as in the listings above).</li>
<li>Tag them (<code>@Tag("A")</code>, <code>@Tag("B")</code>).</li>
<li>Let a small script turn the JUnit XML report into the Passed/Failed, Type and Executed-Date rows of the template.</li>
</ol>
<p>The matrix becomes a report of what really ran, not a promise.</p>
<p class="ghi-chu">Outside the syllabus because CTFL treats test documentation independently of automation tooling.</p></div>`,
    `<div class="callout"><p><span class="badge">★ Ngoài giáo trình</span> <strong>Sinh sheet từ chính các test.</strong></p>
<p>Nhóm nào vừa giữ bảng tính vừa giữ code JUnit sớm muộn sẽ thấy hai thứ lệch nhau. Cách khắc phục phổ biến là coi code là nguồn:</p>
<ol>
<li>Đặt tên test theo UTCID (như các đoạn code ở trên).</li>
<li>Gắn nhãn (<code>@Tag("A")</code>, <code>@Tag("B")</code>).</li>
<li>Dùng một script nhỏ biến báo cáo JUnit XML thành các dòng Passed/Failed, Type và Executed Date của template.</li>
</ol>
<p>Ma trận khi đó là báo cáo về những gì thật sự đã chạy, không phải một lời hứa.</p>
<p class="ghi-chu">Ngoài giáo trình vì CTFL coi tài liệu test là độc lập với công cụ tự động hoá.</p></div>`),
    books([
      ['fst4', 'Ch.4 §3 statement and decision coverage (book pp.132–139); Ch.5 §3 test monitoring, Table 5.1 test case summary worksheet p.177', 'Chương 4 §3 statement và decision coverage (trang 132–139); Chương 5 §3 giám sát test, Bảng 5.1 test case summary worksheet trang 177'],
      ['sp5', '§5.2.1–5.2.2 statement and decision testing PDF pp.215–221; §5.1.1–5.1.2 EP and BVA PDF pp.165–184', '§5.2.1–5.2.2 statement và decision testing PDF 215–221; §5.1.1–5.1.2 EP và BVA PDF 165–184'],
      ['junit', 'Ch.2 core JUnit (assertions, assertThrows) PDF p.18; Ch.6 coverage PDF pp.103–105; Ch.7 stubs PDF p.127', 'Chương 2 JUnit cốt lõi (assertion, assertThrows) PDF 18; Chương 6 coverage PDF 103–105; Chương 7 stub PDF 127'],
    ]),
  ].join('\n'),
};

/* ───────────── L2.9 UnitTestPoints_EN.XLSX ───────────── */
const L29 = {
  title: 'L2.9 — UnitTestPoints: the unit-test viewpoint collection (screen, logic, limits, input checks)|||L2.9 — UnitTestPoints: bộ quan điểm unit test (màn hình, logic, giá trị giới hạn, kiểm tra input)',
  slug: 'swt301-lab2-unit-test-points',
  type: 'DOCUMENT',
  description: 'UnitTestPoints_EN.XLSX: 8 sheet quan điểm test (110 điểm màn hình black-box, 28 điểm nghiệp vụ & logic white-box, 26 điểm white-box khác theo lớp P/F/D, giá trị giới hạn, 18 kiểm tra input chung); ví dụ mySum chạy JUnit + JaCoCo và sửa các chỗ sai trong file.',
  content: [
    bi(`<span class="eyebrow">Lab 2 · Lesson L2.9 · 01.Guide/UnitTestPoints_EN.XLSX</span>
<h2>UnitTestPoints — where test ideas come from</h2>
<p class="lead">“Unit test viewpoint collection, Ver. 0.1” is the kind of file the PCL deck calls <em>PCL creation points from Hitachi</em> (Checklist_creation_viewpoint.xlsx) and the guide calls <em>Testing Concerns</em>: a catalogue of things that go wrong, grouped by where they occur.</p>
<ul>
<li><strong>Pick, don't test everything</strong> — choose the items that match your unit (“select test items according to the system configuration of each project”) and turn each into one or more PCL columns.</li>
<li><strong>Tailored for a real project</strong> — some rows still carry a reviewer's comments (“[Huy]: not applicable for CBRR project”).</li>
</ul>
<div class="callout"><p><strong>Learning objectives</strong></p>
<ul>
<li>Use a viewpoint catalogue as the basis of checklist-based testing (LO-4.4.3, K2)</li>
<li>Choose viewpoints that fit a unit's layer (P, F, D, adapter)</li>
<li>Apply the limit-value and common-input-check rules (LO-4.2.1/4.2.2)</li>
<li>Derive white-box cases for if/else, loops, switch, join conditions, void methods, methods without arguments, try-catch and throw</li>
</ul></div>
<div class="table-wrap"><table><thead><tr><th>Sheet</th><th>Content</th></tr></thead><tbody>
<tr><td>0.Cover</td><td>Purpose; document structure; which sheet applies to which part of the system (screen initial state / without or with server communication → 1; application logic → 2 and 6; DB update/reference → 1, 2; file access → 7; external connection, network, failure, device → 8); roles (Hitachi project SE, partner PM, TL, developer) in plan and PCL creation</td></tr>
<tr><td>1.BB_Screen</td><td>110 black-box viewpoints for screens</td></tr>
<tr><td>2.BB_Business &amp; WB_Logic</td><td>28 viewpoints for business logic (black-box) and code logic (white-box)</td></tr>
<tr><td>3.WB_Other</td><td>26 white-box viewpoints with Java examples, per layer</td></tr>
<tr><td>4.LimitValue</td><td>limit (boundary) value rules per data type</td></tr>
<tr><td>5.CommonInputCheck</td><td>18 standard input/output checks with the number of cases each needs</td></tr>
<tr><td>6–8</td><td>listed on the cover (business IN/OUT, file access, external/network/failure/device) but not present in this version of the file</td></tr>
</tbody></table></div>`,
    `<span class="eyebrow">Lab 2 · Bài L2.9 · 01.Guide/UnitTestPoints_EN.XLSX</span>
<h2>UnitTestPoints — ý tưởng test lấy từ đâu</h2>
<p class="lead">“Unit test viewpoint collection, Ver. 0.1” là loại file mà slide PCL gọi là <em>PCL creation points from Hitachi</em> (Checklist_creation_viewpoint.xlsx) còn bộ hướng dẫn gọi là <em>Testing Concerns</em>: danh mục những thứ hay hỏng, nhóm theo nơi chúng xảy ra.</p>
<ul>
<li><strong>Chọn, không test hết</strong> — chỉ chọn những mục hợp với unit của mình (“chọn mục test theo cấu hình hệ thống của từng dự án”) rồi biến mỗi mục thành một hay nhiều cột PCL.</li>
<li><strong>Đã tuỳ biến cho dự án thật</strong> — vài dòng còn giữ nhận xét của người review (“[Huy]: not applicable for CBRR project”).</li>
</ul>
<div class="callout"><p><strong>Chuẩn đầu ra</strong></p>
<ul>
<li>Dùng danh mục quan điểm làm nền cho checklist-based testing (LO-4.4.3, K2)</li>
<li>Chọn quan điểm hợp với lớp của unit (P, F, D, adapter)</li>
<li>Áp dụng quy tắc giá trị giới hạn và kiểm tra input chung (LO-4.2.1/4.2.2)</li>
<li>Rút ca white-box cho if/else, vòng lặp, switch, điều kiện ghép, method void, method không tham số, try-catch và throw</li>
</ul></div>
<div class="table-wrap"><table><thead><tr><th>Sheet</th><th>Nội dung</th></tr></thead><tbody>
<tr><td>0.Cover</td><td>Mục đích; cấu trúc tài liệu; sheet nào áp cho phần nào của hệ thống (màn hình trạng thái đầu / không hoặc có giao tiếp server → 1; logic ứng dụng → 2 và 6; cập nhật/tham chiếu DB → 1, 2; truy cập file → 7; kết nối ngoài, mạng, sự cố, thiết bị → 8); vai trò (SE dự án phía Hitachi, PM, TL, developer phía đối tác) trong lập kế hoạch và tạo PCL</td></tr>
<tr><td>1.BB_Screen</td><td>110 quan điểm black-box cho màn hình</td></tr>
<tr><td>2.BB_Business &amp; WB_Logic</td><td>28 quan điểm cho logic nghiệp vụ (black-box) và logic code (white-box)</td></tr>
<tr><td>3.WB_Other</td><td>26 quan điểm white-box có ví dụ Java, theo từng lớp</td></tr>
<tr><td>4.LimitValue</td><td>quy tắc giá trị giới hạn (biên) theo kiểu dữ liệu</td></tr>
<tr><td>5.CommonInputCheck</td><td>18 kiểm tra input/output chuẩn kèm số ca mỗi loại cần</td></tr>
<tr><td>6–8</td><td>có trong mục lục (nghiệp vụ IN/OUT, truy cập file, ngoài/mạng/sự cố/thiết bị) nhưng không có trong phiên bản file này</td></tr>
</tbody></table></div>`),
    bi(`<h3>1.BB_Screen — 110 screen viewpoints, grouped</h3>
<ul>
<li><strong>Initial state (1–31)</strong>
<ul>
<li>Layout, enabled/disabled and shown/hidden items per role (“Edit” active for admin, inactive for member).</li>
<li>Initial values — watch the easily confused empty string, NULL, half-width and full-width space.</li>
<li>Zoom 50/100/150 %; tab order (left→right, top→bottom); radio/checkbox via label; link colour/underline; IME mode.</li>
<li>Right alignment of dates, numbers, currency; password masking.</li>
<li>Labels, borders, highlight, zebra rows, image resize and click; character encoding; JavaScript errors.</li>
<li>Colours, spacing, pixel positions; layout with 0 data; enabled/disabled patterns per display content.</li>
</ul></li>
<li><strong>With server communication (32–49)</strong>
<ul>
<li>Input format (half/full-width, special characters <code>~!@#$%^&amp;*()…</code>, Unicode ♡©®); max length.</li>
<li>Correlations (start ≤ end, min ≤ max; defect type required when issue type = defect); error messages and layout.</li>
<li>Date-time picker (last day, today, reverse, not input); combo sort.</li>
<li>Display format from DB (“00001” or “1”?); field mapping (Name loaded into Surname); NULL from old data.</li>
<li>Byte length (CHAR(40) holds 20 two-byte characters).</li>
</ul></li>
<li><strong>Localisation, lists, print, errors, tab (50–61):</strong> layout and messages per language; scroll bar, item count, hidden items, “no data” message; print preview; error message disappears after correction; focus order, auto-tab, shift-tab.</li>
<li><strong>Security (62–68):</strong> repeated clicks; double submit; resubmit after stopping the request; new tab without logout; many users on the same transaction; personal data in cache/local files; direct URL access bypassing the business flow.</li>
<li><strong>Back/forward, calendar, Enter key, paging, clear, pop-ups, sequence (69–89):</strong> browser back/forward and data kept or cleared; day dropdown per month and leap year (29 Feb 2012), invalid 31st; calendar default date; Enter on buttons and text boxes; page size and links (|&lt; &lt;&lt; 5 6 7 8 9 10 11 &gt;&gt; &gt;|) and sort order across pages; clear button; data passed to and from pop-ups; recovery after business and system errors.</li>
<li><strong>DB (90–106):</strong> commit/rollback; SQL matches the spec, WHERE order, built-in functions; deadlock; select/insert/update/delete — correct, failing (no data, bad condition), DB server down.</li>
<li><strong>Stop processing, settings (107–110):</strong> right-click, function keys, shortcut keys blocked if required; layout when the font size changes.</li>
</ul>
<h3>2.BB_Business &amp; WB_Logic — 28 viewpoints</h3>
<ul>
<li><strong>Code structures:</strong> if — both branches; while — infinite loop by data, break in the middle; do-while — runs at least once, so check the output of a single iteration; for — code that changes the index, break; switch — every case, the default, and a missing <code>break</code> (the example prints both “working day” and “off-day” for 3).</li>
<li><strong>Normal / error / limit rules:</strong> “should be A” → normal A, error not-A; “A or B”; A ≤ B → normal A &lt; B and A = B, error A &gt; B; X &lt; value ≤ Y → limit cases X−1, X, X+1, Y−1, Y, Y+1 (three-value BVA); if one case falls in two types, classify by priority Abnormal / Limit / Normal.</li>
<li><strong>Messages</strong> match the spec; <strong>DB black-box</strong>: connect; commit updates the table as designed; rollback; search result count and values, 0 records when nothing matches; update of a missing target; insert with duplicate key; physical vs logical delete (row gone vs delete flag set); DB access error → the specified business/system exception; commit failure restores the previous state; <strong>DB white-box</strong>: variations of the WHERE clause, ORDER BY ASC/DESC.</li>
</ul>
<h3>3.WB_Other — 26 white-box viewpoints</h3>
<ul>
<li><strong>Logic:</strong> cover all cases of if/for/while/do-while/switch (example <code>mySum</code>, worked below); <strong>join conditions</strong>: <code>path == null || "".equals(path)</code> needs two cases, one per sub-condition (guide slide 53).</li>
<li><strong>Limit/error:</strong> add a = 0, −1, 1 and b = 0, −1, 1 to the <code>mySum</code> cases.</li>
<li><strong>Special cases</strong>
<ul>
<li><em>Void method</em> — confirm the displayed message, the log, or the DB change instead of a return value.</li>
<li><em>Method without arguments</em> — “there is no function without input condition”: never leave the input blank, put the state in Precondition (e.g. “table Student has at least one record”).</li>
<li><em>Try-catch inside</em> — treat it as a normal statement, the Exception row stays empty, check the logged message and the null return.</li>
<li><em>Throws</em> — fill the Exception row.</li>
<li><em>List parameters/results</em> — check element count and content (e.g. lines of a file = elements of the returned ArrayList).</li>
</ul></li>
<li><strong>Per layer</strong>
<ul>
<li><strong>P</strong> — display of data received from F (yyyyMMdd shown as a Japanese-era date).</li>
<li><strong>F</strong> — data from P (convert Heisei dates), business errors (8 planned hours per day: 6 + 5 h is rejected), limit values, data from D.</li>
<li><strong>D</strong> — normal search, empty table / no match, cannot connect, more rows than the one expected.</li>
<li><strong>Adapter</strong> — data from F, business error from outside (wrong ATM card), cannot connect, external system error, invalid received data (withdraw 5 million with 1 million in the account), limit values.</li>
</ul></li>
</ul>
<h3>4.LimitValue and 5.CommonInputCheck</h3>
<p class="nhan">Limit value per data type</p>
<ul>
<li><strong>What “limit” means</strong> — numbers (short, int, long, float, double) → value; String → length; DateTime → value; File → size, existence, maximum number of records.</li>
<li><strong>Which values</strong> — lower − 1, lower, upper, upper + 1 (e.g. 0–99 → −1, 0, 99, 100), or uniformly ± 1 (−1, 0, 1, 98, 99, 100).</li>
<li><strong>Special values</strong> — null, 0, −1; null, ""; 1/1, 12/31, 2/29, 2/28; 0:00:00, 23:59:59; file of 0 bytes, missing, maximum records.</li>
</ul>
<p class="nhan">Common input checks — and the number of cases each needs</p>
<ol class="hai-cot">
<li>Normal pattern — 1</li>
<li>Kana-only — 1</li>
<li>Full-width — 1</li>
<li>Half-width — 1</li>
<li>Numeric — 1</li>
<li><strong>Length check — 4</strong> (lower, lower − 1, upper, upper + 1)</li>
<li><strong>Amount check — 4</strong></li>
<li>Format — 1</li>
<li>Required — 1</li>
<li>Foreign-currency amount — 2</li>
<li>Money amount 0 → error — 1</li>
<li>Matching A = B — 1</li>
<li><strong>FROM/TO date — 5</strong></li>
<li>Correlation-required (if A then B and C) — per item</li>
<li>Output: display — 2</li>
<li>Output: NULL display — 1</li>
<li>Output: max digits — 1</li>
<li>Output: display condition — 1</li>
</ol>`,
    `<h3>1.BB_Screen — 110 quan điểm màn hình, theo nhóm</h3>
<ul>
<li><strong>Trạng thái ban đầu (1–31)</strong>
<ul>
<li>Bố cục, mục bật/tắt và hiện/ẩn theo vai trò (“Edit” bật với admin, tắt với member).</li>
<li>Giá trị ban đầu — cẩn thận chuỗi rỗng, NULL, khoảng trắng nửa độ rộng và toàn độ rộng dễ nhầm.</li>
<li>Zoom 50/100/150 %; thứ tự tab (trái→phải, trên→dưới); radio/checkbox qua nhãn; màu/gạch chân link; chế độ IME.</li>
<li>Căn phải cho ngày, số, tiền; che mật khẩu.</li>
<li>Nhãn, viền, tô sáng, dòng kẻ sọc (zebra), đổi cỡ và bấm ảnh; mã hoá ký tự; lỗi JavaScript.</li>
<li>Màu, khoảng cách, vị trí theo pixel; bố cục khi 0 dữ liệu; mẫu bật/tắt theo nội dung hiển thị.</li>
</ul></li>
<li><strong>Có giao tiếp server (32–49)</strong>
<ul>
<li>Định dạng input (nửa/toàn độ rộng, ký tự đặc biệt <code>~!@#$%^&amp;*()…</code>, Unicode ♡©®); độ dài tối đa.</li>
<li>Tương quan (bắt đầu ≤ kết thúc, min ≤ max; loại lỗi bắt buộc khi issue type = defect); thông báo lỗi và bố cục.</li>
<li>Date-time picker (ngày cuối, hôm nay, đảo ngược, chưa nhập); sắp xếp combo.</li>
<li>Định dạng hiển thị từ DB (“00001” hay “1”?); ánh xạ trường (Name nạp vào Surname); NULL từ dữ liệu cũ.</li>
<li>Độ dài byte (CHAR(40) chứa được 20 ký tự 2 byte).</li>
</ul></li>
<li><strong>Bản địa hoá, danh sách, in, lỗi, tab (50–61):</strong> bố cục và thông báo theo ngôn ngữ; thanh cuộn, số mục, mục bị ẩn, thông báo “không có dữ liệu”; xem trước khi in; thông báo lỗi biến mất sau khi sửa; thứ tự focus, auto-tab, shift-tab.</li>
<li><strong>Bảo mật (62–68):</strong> bấm nhiều lần; submit hai lần; submit lại sau khi dừng request; tab mới không đăng xuất; nhiều người cùng một giao dịch; dữ liệu cá nhân trong cache/file cục bộ; truy cập URL trực tiếp bỏ qua luồng nghiệp vụ.</li>
<li><strong>Back/forward, lịch, phím Enter, phân trang, nút xoá, pop-up, trình tự (69–89):</strong> nút back/forward của trình duyệt và dữ liệu được giữ hay xoá; dropdown ngày theo tháng và năm nhuận (29/2/2012), ngày 31 không hợp lệ; ngày mặc định của lịch; Enter trên nút và ô nhập; cỡ trang và link trang (|&lt; &lt;&lt; 5 6 7 8 9 10 11 &gt;&gt; &gt;|) và thứ tự sắp xếp khi qua trang; nút xoá; dữ liệu truyền tới và từ pop-up; phục hồi sau lỗi nghiệp vụ và lỗi hệ thống.</li>
<li><strong>DB (90–106):</strong> commit/rollback; SQL đúng spec, thứ tự WHERE, hàm dựng sẵn; deadlock; select/insert/update/delete — đúng, thất bại (không có dữ liệu, điều kiện sai), DB server sập.</li>
<li><strong>Dừng xử lý, cài đặt (107–110):</strong> chặn chuột phải, phím chức năng, phím tắt nếu có yêu cầu; bố cục khi đổi cỡ chữ.</li>
</ul>
<h3>2.BB_Business &amp; WB_Logic — 28 quan điểm</h3>
<ul>
<li><strong>Cấu trúc code:</strong> if — cả hai nhánh; while — lặp vô hạn do dữ liệu, break giữa chừng; do-while — chạy ít nhất một lần, nên kiểm output khi chỉ lặp một lần; for — code làm đổi biến chỉ số, break; switch — mọi case, default, và thiếu <code>break</code> (ví dụ nhập 3 in cả “working day” lẫn “off-day”).</li>
<li><strong>Quy tắc normal / error / limit:</strong> “phải là A” → normal A, error khác A; “A hoặc B”; A ≤ B → normal A &lt; B và A = B, error A &gt; B; X &lt; giá trị ≤ Y → ca limit X−1, X, X+1, Y−1, Y, Y+1 (BVA ba giá trị); nếu một ca thuộc hai loại thì xếp theo ưu tiên Abnormal / Limit / Normal.</li>
<li><strong>Message</strong> đúng spec; <strong>DB black-box</strong>: kết nối; commit cập nhật bảng đúng thiết kế; rollback; số bản ghi và giá trị kết quả tìm, 0 bản ghi khi không khớp; cập nhật đối tượng không tồn tại; insert trùng khoá; xoá vật lý và xoá logic (dòng biến mất và cờ xoá được bật); lỗi truy cập DB → exception nghiệp vụ/hệ thống theo thiết kế; commit lỗi thì DB trở về trạng thái trước; <strong>DB white-box</strong>: các biến thể mệnh đề WHERE, ORDER BY ASC/DESC.</li>
</ul>
<h3>3.WB_Other — 26 quan điểm white-box</h3>
<ul>
<li><strong>Logic:</strong> phủ mọi ca của if/for/while/do-while/switch (ví dụ <code>mySum</code>, giải bên dưới); <strong>điều kiện ghép</strong>: <code>path == null || "".equals(path)</code> cần hai ca, mỗi điều kiện con một ca (slide 53 bộ hướng dẫn).</li>
<li><strong>Giới hạn/lỗi:</strong> thêm a = 0, −1, 1 và b = 0, −1, 1 vào các ca của <code>mySum</code>.</li>
<li><strong>Trường hợp đặc biệt</strong>
<ul>
<li><em>Method void</em> — xác nhận thông báo hiển thị, log hoặc thay đổi DB thay cho giá trị trả về.</li>
<li><em>Method không tham số</em> — “không có hàm nào không có điều kiện đầu vào”: không bao giờ để trống input, hãy ghi trạng thái vào Precondition (ví dụ “bảng Student có ít nhất một bản ghi”).</li>
<li><em>Có try-catch bên trong</em> — coi như câu lệnh bình thường, dòng Exception để trống, kiểm message được log và giá trị null trả về.</li>
<li><em>Throws</em> — điền dòng Exception.</li>
<li><em>Tham số/kết quả là list</em> — kiểm số phần tử và nội dung (ví dụ số dòng của file = số phần tử của ArrayList trả về).</li>
</ul></li>
<li><strong>Theo lớp</strong>
<ul>
<li><strong>P</strong> — hiển thị dữ liệu nhận từ F (yyyyMMdd hiện thành niên hiệu Nhật).</li>
<li><strong>F</strong> — dữ liệu từ P (đổi ngày Heisei), lỗi nghiệp vụ (8 giờ kế hoạch mỗi ngày: 6 + 5 giờ bị từ chối), giá trị giới hạn, dữ liệu từ D.</li>
<li><strong>D</strong> — tìm kiếm bình thường, bảng rỗng / không khớp, không kết nối được, nhiều dòng hơn một dòng mong đợi.</li>
<li><strong>Adapter</strong> — dữ liệu từ F, lỗi nghiệp vụ từ bên ngoài (thẻ ATM sai), không kết nối được, lỗi hệ thống bên ngoài, dữ liệu nhận không hợp lệ (rút 5 triệu khi tài khoản có 1 triệu), giá trị giới hạn.</li>
</ul></li>
</ul>
<h3>4.LimitValue và 5.CommonInputCheck</h3>
<p class="nhan">Giá trị giới hạn theo kiểu dữ liệu</p>
<ul>
<li><strong>“Giới hạn” là gì</strong> — số (short, int, long, float, double) → giá trị; String → độ dài; DateTime → giá trị; File → kích thước, có/không, số bản ghi tối đa.</li>
<li><strong>Thử giá trị nào</strong> — cận dưới − 1, cận dưới, cận trên, cận trên + 1 (ví dụ 0–99 → −1, 0, 99, 100), hoặc đồng loạt ± 1 (−1, 0, 1, 98, 99, 100).</li>
<li><strong>Giá trị đặc biệt</strong> — null, 0, −1; null, ""; 1/1, 12/31, 2/29, 2/28; 0:00:00, 23:59:59; file 0 byte, không có, số bản ghi tối đa.</li>
</ul>
<p class="nhan">Kiểm tra input chung — và số ca mỗi loại cần</p>
<ol class="hai-cot">
<li>Mẫu bình thường — 1</li>
<li>Chỉ kana — 1</li>
<li>Toàn độ rộng — 1</li>
<li>Nửa độ rộng — 1</li>
<li>Số — 1</li>
<li><strong>Kiểm độ dài — 4</strong> (cận dưới, cận dưới − 1, cận trên, cận trên + 1)</li>
<li><strong>Kiểm hạn mức — 4</strong></li>
<li>Định dạng — 1</li>
<li>Bắt buộc — 1</li>
<li>Số tiền ngoại tệ — 2</li>
<li>Số tiền = 0 → lỗi — 1</li>
<li>Khớp A = B — 1</li>
<li><strong>Ngày FROM/TO — 5</strong></li>
<li>Bắt buộc theo tương quan (có A thì phải có B và C) — tuỳ số mục</li>
<li>Output: hiển thị — 2</li>
<li>Output: hiển thị NULL — 1</li>
<li>Output: số chữ số tối đa — 1</li>
<li>Output: điều kiện hiển thị — 1</li>
</ol>`),
    bi(`<h3>Ví dụ có lời giải · Worked example — the sheet's own <code>mySum</code>, run and corrected</h3>
<p>3.WB_Other gives this example (as printed, the <code>if</code>/<code>else if</code> blocks lack their closing braces and would not compile):</p>
<pre><code>public int mySum(int a, int b) {
    if (a &lt; 0) {
        return -1;
    } else if (b &lt; 0) {
        return -2;
    } else {
        return a + b;
    }
}</code></pre>
<p>It then says the code has “7 nodes and 6 branches (3 if-else × 2 branches / 1 if-else)” and proposes TC1 a &lt; 0, TC2 a &gt; 0 and b &lt; 0, TC3 a &gt; 0 and b &gt; 0. Run with a = −5/b = 3, a = 5/b = −3, a = 5/b = 3 (JUnit 5.12.2 + JaCoCo 0.8.13, real output):</p>
<pre><code>PASSED TC1 a&lt;0 (a=-5,b=3) -&gt; -1
PASSED TC2 a&gt;0,b&lt;0 (a=5,b=-3) -&gt; -2
PASSED TC3 a&gt;0,b&gt;0 (a=5,b=3) -&gt; 8
Tests run: 3, passed: 3, failed: 0
Method mySum: lines 5/5, branches 4/4</code></pre>
<p class="nhan">Corrections</p>
<ol>
<li><strong>Two decisions with two outcomes each = 4 branches</strong>, not 6 — the tool agrees (4/4).</li>
<li><strong>Three cases are indeed the minimum</strong> for 100 % C0/C1: three different return statements need three runs.</li>
<li><strong>“a &gt; 0” and “b &gt; 0” in TC2/TC3 leave out 0</strong>, which belongs to the non-negative partition — that is why the sheet adds the limit cases TC4–TC9: a = 0, −1, 1 and b = 0, −1, 1 (with the other input kept valid), which test both sides of each boundary (a = 0 must give a + b, a = −1 must give −1).</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Viewpoint files are not the syllabus.</strong> They are practical and project-specific, and they contain mistakes (wrong branch count, missing braces, “normal case: Y” only for X &lt; value ≤ Y). In an ISTQB question, count decisions and outcomes yourself; in the lab, use the file for ideas, then check your cases with a coverage tool.</div>
<div class="callout"><p><span class="badge">★ Beyond the syllabus</span> <strong>Property-based testing — viewpoints as generators.</strong></p>
<p>Libraries such as jqwik (Java) generate hundreds of inputs from a description (“any int”, “strings of letters and digits”) and check a <em>property</em> that must always hold — e.g. for <code>countCharacters</code>: the four counts always add up to the length of the input.</p>
<p>The generators deliberately include the viewpoint catalogue's favourites (0, −1, <code>Integer.MAX_VALUE</code>, empty strings, Unicode) and shrink a failing input to the smallest example.</p>
<p class="ghi-chu">Outside the syllabus because CTFL's techniques select test cases by hand.</p></div>`,
    `<h3>Ví dụ có lời giải · Chính ví dụ <code>mySum</code> của file, chạy thật và sửa lỗi</h3>
<p>Sheet 3.WB_Other đưa ví dụ này (bản in trong file thiếu dấu đóng ngoặc của khối <code>if</code>/<code>else if</code> nên không biên dịch được):</p>
<pre><code>public int mySum(int a, int b) {
    if (a &lt; 0) {
        return -1;
    } else if (b &lt; 0) {
        return -2;
    } else {
        return a + b;
    }
}</code></pre>
<p>Rồi file nói code có “7 nút và 6 nhánh (3 if-else × 2 nhánh / 1 if-else)” và đề xuất TC1 a &lt; 0, TC2 a &gt; 0 và b &lt; 0, TC3 a &gt; 0 và b &gt; 0. Chạy với a = −5/b = 3, a = 5/b = −3, a = 5/b = 3 (JUnit 5.12.2 + JaCoCo 0.8.13, kết quả thật):</p>
<pre><code>PASSED TC1 a&lt;0 (a=-5,b=3) -&gt; -1
PASSED TC2 a&gt;0,b&lt;0 (a=5,b=-3) -&gt; -2
PASSED TC3 a&gt;0,b&gt;0 (a=5,b=3) -&gt; 8
Tests run: 3, passed: 3, failed: 0
Method mySum: lines 5/5, branches 4/4</code></pre>
<p class="nhan">Sửa lại</p>
<ol>
<li><strong>Hai quyết định, mỗi cái hai kết quả = 4 nhánh</strong>, không phải 6 — công cụ cũng báo vậy (4/4).</li>
<li><strong>Ba ca đúng là tối thiểu</strong> cho C0/C1 100 %: ba câu return khác nhau cần ba lần chạy.</li>
<li><strong>“a &gt; 0” và “b &gt; 0” ở TC2/TC3 bỏ sót 0</strong>, vốn thuộc phân vùng không âm — vì thế file thêm các ca biên TC4–TC9: a = 0, −1, 1 và b = 0, −1, 1 (giữ input kia hợp lệ), thử cả hai phía của mỗi biên (a = 0 phải cho a + b, a = −1 phải cho −1).</li>
</ol>
<div class="pitfall co-tieu-de"><strong>File quan điểm không phải syllabus.</strong> Chúng thực dụng, gắn với dự án, và có lỗi (đếm sai số nhánh, thiếu ngoặc, “normal case: Y” duy nhất cho X &lt; giá trị ≤ Y). Trong câu hỏi ISTQB, hãy tự đếm quyết định và kết quả; trong lab, dùng file để lấy ý tưởng, rồi kiểm các ca của mình bằng công cụ coverage.</div>
<div class="callout"><p><span class="badge">★ Ngoài giáo trình</span> <strong>Property-based testing — biến quan điểm thành bộ sinh dữ liệu.</strong></p>
<p>Thư viện như jqwik (Java) sinh hàng trăm đầu vào từ một mô tả (“số int bất kỳ”, “chuỗi gồm chữ và số”) và kiểm một <em>tính chất</em> luôn phải đúng — ví dụ với <code>countCharacters</code>: bốn con đếm cộng lại luôn bằng độ dài chuỗi.</p>
<p>Bộ sinh cố ý đưa vào các giá trị “ruột” của danh mục quan điểm (0, −1, <code>Integer.MAX_VALUE</code>, chuỗi rỗng, Unicode) và thu nhỏ đầu vào gây lỗi về ví dụ nhỏ nhất.</p>
<p class="ghi-chu">Ngoài giáo trình vì các kỹ thuật của CTFL chọn test case bằng tay.</p></div>`),
    books([
      ['fst4', 'Ch.4 §4 experience-based techniques incl. checklist-based testing (book pp.140–142); §2 EP/BVA pp.112–120', 'Chương 4 §4 kỹ thuật dựa trên kinh nghiệm, gồm checklist-based testing (trang 140–142); §2 EP/BVA trang 112–120'],
      ['sp5', '§5.3 experience-based techniques PDF p.233; §5.1.2 BVA PDF p.176; §5.2.2 decision coverage PDF p.218', '§5.3 kỹ thuật dựa trên kinh nghiệm PDF 233; §5.1.2 BVA PDF 176; §5.2.2 decision coverage PDF 218'],
      ['sp4', '§5.3 intuitive and experience-based test case determination p.161 (PDF p.176)', '§5.3 xác định test case theo trực giác và kinh nghiệm trang 161 (PDF 176)'],
    ]),
  ].join('\n'),
};

/* ──────────────────────────────── Quiz ──────────────────────────────── */
// Plain-text strings (the quiz player does not render HTML).
const q = (question, options, correctIndex, explanation) => ({ question, options, correctIndex, points: 1, ...(explanation ? { explanation } : {}) });
const QUIZ = {
  title: 'Lab 2 quiz — unit-test design, PCL, coverage and the template|||Quiz Lab 2 — thiết kế unit test, PCL, coverage và template',
  slug: 'swt301-lab2-quiz',
  type: 'QUIZ',
  description: '22 câu về bộ hướng dẫn unit test của Hitachi, cách viết PCL, C0/C1/RC0, quy tắc rút test case, template Unit Test Case và yêu cầu chấm điểm Lab 2.',
  quiz: {
    timeLimitSeconds: 1320,
    questions: [
      q('According to the Hitachi unit-testing guide, when must the PCL of a software unit be created, and from what?|||Theo hướng dẫn unit test của Hitachi, PCL của một software unit phải được tạo khi nào và từ đâu?',
        ['After coding, from the source code|||Sau khi code, từ source code', 'Before coding, from the Detailed Design|||Trước khi code, từ Detailed Design', 'During system testing, from the requirements|||Trong system test, từ yêu cầu', 'After acceptance, from the bug list|||Sau nghiệm thu, từ bug list'], 1, 'Guide slide 23: a PCL is created for each software unit, based on its Detailed Design, and PCLs must be created before coding. Creating it after coding from the source code is exactly what the same slide forbids.|||Slide 23 của hướng dẫn: mỗi software unit có một PCL, lập từ Detailed Design, và PCL phải được tạo trước khi code. Lập sau khi code từ source code chính là điều slide đó cấm.'),
      q('Why does the guide forbid deriving the PCL from the source code after coding?|||Vì sao hướng dẫn cấm lập PCL từ source code sau khi code xong?',
        ['It takes too long|||Vì tốn quá nhiều thời gian', 'Coding errors can no longer be detected, because the expected results would copy what the code does|||Không phát hiện được lỗi code nữa, vì kết quả mong đợi sẽ chép lại việc code đang làm', 'Coverage tools cannot read PCLs|||Công cụ coverage không đọc được PCL', 'The leader cannot review it|||Leader không review được'], 1, 'Guide slide 23: "If PCLs are created based on source code after coding, coding errors cannot be detected." The expected results would simply copy what the code does, so a wrong line looks correct. Time or tool support is not the reason.|||Slide 23 của hướng dẫn: "If PCLs are created based on source code after coding, coding errors cannot be detected." Kết quả mong đợi sẽ chép lại việc code đang làm, nên dòng sai trông vẫn đúng. Lý do không nằm ở thời gian hay công cụ.'),
      q('Which set of exit criteria must be met before the leader evaluates unit testing of a NEW unit?|||Bộ tiêu chí kết thúc nào phải đạt trước khi leader đánh giá unit test của một unit MỚI?',
        ['All PCL cases run, all bugs resolved, high-priority static-analysis violations fixed, C0 and C1 = 100%|||Chạy hết ca PCL, giải quyết hết bug, sửa hết vi phạm phân tích tĩnh mức cao, C0 và C1 = 100%', 'All PCL cases run and RC0 = 100%|||Chạy hết ca PCL và RC0 = 100%', 'At least 80% statement coverage|||Ít nhất 80% statement coverage', 'No bugs were found|||Không tìm thấy bug nào'], 0, 'Guide slide 35 lists four conditions: (a) all PCL cases complete, (b) all Bug List problems resolved, (c) all high-priority static-analysis violations corrected, (d) coverage 100%, which for a new unit means both C0 and C1. RC0 applies only when enhancing an existing unit.|||Slide 35 của hướng dẫn nêu bốn điều kiện: (a) chạy xong mọi ca trong PCL, (b) giải quyết hết vấn đề trong Bug List, (c) sửa hết vi phạm phân tích tĩnh mức ưu tiên cao, (d) coverage 100%, với unit mới là cả C0 và C1. RC0 chỉ dùng khi sửa unit có sẵn.'),
      q('What is RC0?|||RC0 là gì?',
        ['Coverage of all conditions|||Phủ mọi điều kiện', 'Executed revised statements / all revised statements × 100%|||Số câu lệnh đã sửa được chạy / tổng số câu lệnh đã sửa × 100%', 'Executed branches / all branches × 100%|||Số nhánh đã chạy / tổng số nhánh × 100%', 'Requirement coverage|||Độ phủ yêu cầu'], 1, 'Guide slide 33: RC0 is revised-statement coverage, used when enhancing an existing unit: executed revised statements / all revised statements x 100%. Executed branches / all branches is C1 (decision coverage).|||Slide 33 của hướng dẫn: RC0 là độ phủ câu lệnh đã sửa, dùng khi sửa unit có sẵn: số câu lệnh đã sửa được chạy / tổng số câu lệnh đã sửa x 100%. Số nhánh đã chạy / tổng số nhánh là C1 (decision coverage).'),
      q('In Hitachi\'s process, "Software Component Testing" (組合せテスト) corresponds to which ISTQB level?|||Trong quy trình Hitachi, "Software Component Testing" (組合せテスト) tương ứng cấp nào của ISTQB?',
        ['Component (unit) testing|||Component (unit) testing', 'Component integration testing|||Component integration testing', 'Acceptance testing|||Acceptance testing', 'Maintenance testing|||Maintenance testing'], 1, '組合せテスト means "combination test": Hitachi\'s Software Component Testing combines already unit-tested units, which is ISTQB component integration testing (its checklist is the CCL). ISTQB component testing corresponds to Hitachi\'s unit testing, so the similar name is a trap.|||組合せテスト là "test kết hợp": Software Component Testing của Hitachi ghép các unit đã unit test, tức là component integration testing của ISTQB (checklist là CCL). Component testing của ISTQB tương ứng unit test của Hitachi, nên cái tên giống nhau là bẫy.'),
      q('If the unit under test calls another unit, what does the guide prefer during unit testing?|||Nếu unit đang test gọi unit khác, hướng dẫn ưu tiên điều gì khi unit test?',
        ['Always use stubs|||Luôn dùng stub', 'Use the real, already tested submodule; if stubs were used, re-test with the real one later|||Dùng submodule thật đã được test; nếu đã dùng stub thì test lại với bản thật sau', 'Skip calls to other units|||Bỏ qua lời gọi tới unit khác', 'Test both units together in system testing only|||Chỉ test hai unit cùng nhau ở system test'], 1, 'Guide slide 25: use actual submodules that have already been tested; if stubs were used, test the unit again with the actual submodules once they exist, because real submodules give more reliable testing. "Always use stubs" reverses that preference.|||Slide 25 của hướng dẫn: dùng submodule thật đã được test; nếu đã dùng stub thì test lại unit với submodule thật khi có, vì submodule thật cho kết quả tin cậy hơn. "Luôn dùng stub" là đảo ngược ưu tiên đó.'),
      q('How must input conditions and expected results be written in a PCL?|||Điều kiện đầu vào và kết quả mong đợi trong PCL phải được viết thế nào?',
        ['As values of local variables during execution|||Là giá trị biến cục bộ trong lúc chạy', 'As specific, externally settable/observable states before and after execution|||Là trạng thái cụ thể, đặt/quan sát được từ bên ngoài, trước và sau khi chạy', 'As general descriptions such as "valid value"|||Là mô tả chung như "giá trị hợp lệ"', 'As screenshots of the debugger|||Là ảnh chụp debugger'], 1, 'Guide slide 41: input conditions and expected results must be described with specific items and values that can be set or observed externally, before and after execution. Manipulating local variables with a debugger is prohibited without the leader\'s approval, and "valid value" is not specific.|||Slide 41 của hướng dẫn: điều kiện đầu vào và kết quả mong đợi phải mô tả bằng mục và giá trị cụ thể, đặt hoặc quan sát được từ bên ngoài, trước và sau khi chạy. Chỉnh biến cục bộ bằng debugger bị cấm nếu leader không cho phép, còn "giá trị hợp lệ" thì không cụ thể.'),
      q('Step 2 of test-case creation says each new case should differ from the basic case in only one input condition. Why?|||Bước 2 của việc tạo test case nói mỗi ca mới chỉ khác ca cơ sở ở một điều kiện đầu vào. Vì sao?',
        ['To reduce the number of cases to one|||Để giảm số ca xuống còn một', 'To know which input caused the result and not leave statements unexecuted|||Để biết đầu vào nào gây ra kết quả và không bỏ sót câu lệnh', 'Because JUnit accepts only one parameter|||Vì JUnit chỉ nhận một tham số', 'To make every case abnormal|||Để mọi ca đều là abnormal'], 1, 'Guide slide 47: change only one input condition from the basic case "in order to clarify which input condition causes the result". Changing several at once hides which one mattered and can leave statements unexecuted (slide 49). It has nothing to do with JUnit parameters.|||Slide 47 của hướng dẫn: chỉ đổi một điều kiện đầu vào so với ca cơ sở "để làm rõ điều kiện nào gây ra kết quả". Đổi nhiều điều kiện cùng lúc sẽ che mất điều kiện nào quan trọng và có thể bỏ sót câu lệnh (slide 49). Không liên quan tham số của JUnit.'),
      q('Guide flowchart: if a > 0 then A and (if b >= 0 then C else D), else B. Cases (5,10), (1,0), (0,-1) are run. What is not executed?|||Lưu đồ hướng dẫn: nếu a > 0 thì A và (nếu b >= 0 thì C, ngược lại D), ngược lại B. Chạy các ca (5,10), (1,0), (0,-1). Phần nào không được chạy?',
        ['Statements A|||Xử lý A', 'Statements B|||Xử lý B', 'Statements C|||Xử lý C', 'Statements D|||Xử lý D'], 3, '(5,10): a > 0 and b >= 0, so A and C. (1,0): b = 0 still satisfies b >= 0, so A and C again. (0,-1): a = 0, so B. No case has a > 0 with b < 0, so D never runs. This is the guide\'s "improper test cases" example (slide 49): the third case changed two conditions at once.|||(5,10): a > 0 và b >= 0, nên chạy A và C. (1,0): b = 0 vẫn thoả b >= 0, nên lại A và C. (0,-1): a = 0, nên chạy B. Không ca nào có a > 0 và b < 0, nên D không bao giờ chạy. Đây là ví dụ "test case không đúng cách" của hướng dẫn (slide 49): ca thứ ba đổi hai điều kiện cùng lúc.'),
      q('For the decision "a > 0 && b >= 0", the cases (a=5,b=10) and (a=0,b=10) are executed. Which statement is true?|||Với quyết định "a > 0 && b >= 0", chạy các ca (a=5,b=10) và (a=0,b=10). Phát biểu nào đúng?',
        ['Decision coverage is 50%|||Decision coverage là 50%', 'Decision coverage is 100%, but the sub-condition b >= 0 has never been false|||Decision coverage là 100%, nhưng điều kiện con b >= 0 chưa từng sai', 'Statement coverage is below 100%|||Statement coverage dưới 100%', 'Every sub-condition has been tested both ways|||Mọi điều kiện con đã được thử cả hai chiều'], 1, '(5,10) makes the decision true and (0,10) makes it false, so decision coverage is 100% and both branches\' statements run. But the false outcome came only from a > 0; b >= 0 was never false. Guide slide 53: check each subcondition, not only the decision.|||(5,10) làm quyết định đúng và (0,10) làm nó sai, nên decision coverage là 100% và câu lệnh ở cả hai nhánh đều chạy. Nhưng kết cục sai chỉ do a > 0; b >= 0 chưa từng sai. Slide 53 của hướng dẫn: phải kiểm từng điều kiện con, không chỉ quyết định.'),
      q('An input of the unit is a list. Which element counts must the PCL include?|||Một đầu vào của unit là danh sách. PCL phải có các số phần tử nào?',
        ['Only a typical count such as 5|||Chỉ một số điển hình như 5', '0, 1 and many elements (separately for each list)|||0, 1 và nhiều phần tử (riêng cho từng danh sách)', 'Only the maximum count|||Chỉ số lượng tối đa', 'Only an empty list|||Chỉ danh sách rỗng'], 1, 'Guide slide 63: if the input or output contains a list, test cases with zero, one and multiple elements are required, and with several lists a separate set for each list. Only a typical count, only the maximum or only an empty list each miss the other edges.|||Slide 63 của hướng dẫn: nếu đầu vào hoặc đầu ra có danh sách thì phải có ca 0, 1 và nhiều phần tử, và khi có nhiều danh sách thì làm riêng cho từng danh sách. Chỉ một số điển hình, chỉ số tối đa hay chỉ danh sách rỗng đều bỏ sót các biên còn lại.'),
      q('Why must input values also be checked on the server side (guide slide 67)?|||Vì sao giá trị đầu vào phải được kiểm cả ở phía server (slide 67 của hướng dẫn)?',
        ['Because JavaScript is slow|||Vì JavaScript chậm', 'Because a user can edit the HTTP request and bypass the client-side check|||Vì người dùng có thể sửa request HTTP để vượt qua kiểm tra phía client', 'Because the client cannot display errors|||Vì client không hiển thị được lỗi', 'Because the database requires it|||Vì database đòi hỏi'], 1, 'Guide slide 67: a user can modify the value in the HTTP request after the client-side check, so the server must verify it again and return an error. Client-side JavaScript validation is a convenience, not a security control.|||Slide 67 của hướng dẫn: người dùng có thể sửa giá trị trong request HTTP sau khi đã qua kiểm tra phía client, nên server phải kiểm lại và trả lỗi. Kiểm tra bằng JavaScript phía client chỉ để tiện, không phải lớp bảo vệ.'),
      q('In a PCL, two test cases have the same input values but different expected results. What does this indicate?|||Trong PCL, hai test case có cùng giá trị đầu vào nhưng khác kết quả mong đợi. Điều đó cho thấy gì?',
        ['The code is certainly wrong|||Code chắc chắn sai', 'An input condition (e.g. DB data or a setting) is missing from the matrix|||Ma trận đang thiếu một điều kiện đầu vào (ví dụ dữ liệu DB hay cấu hình)', 'One case should be deleted|||Nên xoá một ca', 'The cases are boundary cases|||Đó là các ca biên'], 1, 'PCL deck slide 29: same input values with different expected values means input values are missing and must be supplemented, typically DB data or a setting that is not yet a row in the matrix. It does not prove the code is wrong, and deleting a case would hide the gap.|||Slide 29 của bộ PCL: cùng đầu vào mà khác kết quả mong đợi nghĩa là đang thiếu giá trị đầu vào và phải bổ sung, thường là dữ liệu DB hoặc cấu hình chưa có dòng trong ma trận. Nó không chứng minh code sai, còn xoá một ca chỉ che mất chỗ thiếu.'),
      q('For an input range 5 <= x <= 10, which are the boundary values by boundary value analysis (two-value)?|||Với khoảng đầu vào 5 <= x <= 10, theo phân tích giá trị biên (hai giá trị), giá trị biên là gì?',
        ['4 and 11 only|||Chỉ 4 và 11', '5 and 10 (tested together with the invalid neighbours 4 and 11)|||5 và 10 (test cùng các láng giềng không hợp lệ 4 và 11)', '6, 7, 8, 9|||6, 7, 8, 9', '-1 and 12|||-1 và 12'], 1, 'The boundary values are the edges of the valid partition, 5 and 10; two-value BVA tests them together with their invalid neighbours 4 and 11. Guide slide 77 does the same for 1..9: A = 0, 1, 9, 10. 4 and 11 alone are only the invalid side.|||Giá trị biên là hai mép của phân vùng hợp lệ, 5 và 10; BVA hai giá trị test chúng cùng các láng giềng không hợp lệ 4 và 11. Slide 77 của hướng dẫn làm y như vậy với 1..9: A = 0, 1, 9, 10. Riêng 4 và 11 chỉ là phía không hợp lệ.'),
      q('A test case checks a submodule\'s interface using a boundary value and expects a normal result. Which Hitachi categories apply?|||Một test case kiểm giao diện của submodule bằng giá trị biên và mong đợi kết quả bình thường. Áp dụng các loại Hitachi nào?',
        ['E only|||Chỉ E', 'N, L, I|||N, L, I', 'L only|||Chỉ L', 'E, I|||E, I'], 1, 'Guide slide 83 uses exactly this example: a case that checks a submodule interface (I) with a boundary value (L) and expects a normal result (N) is marked N, L, I. E (error) would apply only if an abnormal result were expected.|||Slide 83 của hướng dẫn dùng đúng ví dụ này: ca kiểm giao diện submodule (I) bằng giá trị biên (L) và mong đợi kết quả bình thường (N) được ghi N, L, I. E (error) chỉ dùng khi mong đợi kết quả bất thường.'),
      q('When is the matrix checklist format preferred over the list format?|||Khi nào nên dùng dạng checklist ma trận thay vì dạng danh sách?',
        ['When every case has a different, complex procedure|||Khi mỗi ca có thủ tục riêng, phức tạp', 'When one procedure is shared and only input/output values vary|||Khi dùng chung một thủ tục và chỉ thay đổi giá trị vào/ra', 'Only for acceptance testing|||Chỉ cho acceptance testing', 'Never, the list format is always better|||Không bao giờ, dạng danh sách luôn tốt hơn'], 1, 'Guide slide 81: the matrix format is used mainly when a single procedure is shared and variations in input and output values must be checked; it also makes completeness easy to see. The list format suits cases with different or complex procedures.|||Slide 81 của hướng dẫn: dạng ma trận dùng chủ yếu khi các ca dùng chung một thủ tục và cần kiểm các biến thể giá trị vào/ra; nó còn giúp thấy ngay độ đầy đủ. Dạng danh sách hợp với các ca có thủ tục khác nhau hoặc phức tạp.'),
      q('FA23 PE: what is the minimum number of test cases for 100% statement and 100% decision coverage of countCharacters(String) (loop over characters with if isUpperCase / else if isLowerCase / else if isDigit / else)?|||Đề PE FA23: số test case tối thiểu để countCharacters(String) (lặp qua từng ký tự với if isUpperCase / else if isLowerCase / else if isDigit / else) đạt 100% statement và 100% decision coverage là bao nhiêu?',
        ['1, e.g. "Aa1@"|||1, ví dụ "Aa1@"', '3|||3', '4, one per branch|||4, mỗi nhánh một ca', '8, one per decision outcome|||8, mỗi kết quả quyết định một ca'], 0, 'The loop processes one string character by character, so "Aa1@" enters and exits the loop and sends A, a, 1, @ through the upper, lower, digit and else branches: all 8 outcomes of the 4 decisions in one case (run with JUnit + JaCoCo). Four cases also reach 100% but are not the minimum.|||Vòng lặp xử lý một chuỗi từng ký tự, nên "Aa1@" vào rồi thoát vòng lặp và đưa A, a, 1, @ qua nhánh hoa, thường, số và else: đủ 8 kết cục của 4 quyết định chỉ trong một ca (đã chạy JUnit + JaCoCo). Bốn ca cũng đạt 100% nhưng không phải tối thiểu.'),
      q('Template function sheet: Lines of code = 50, Normal number of test cases/KLOC = 100, Total test cases = 3. What does "Lack of test cases" show?|||Sheet function của template: Lines of code = 50, Normal number of test cases/KLOC = 100, Total test cases = 3. Ô "Lack of test cases" hiện gì?',
        ['-2|||-2', '2|||2', '5|||5', '47|||47'], 1, 'The sheet computes Lack = LOC x norm / 1000 - total, formula SUM(C4*FunctionList!E6/1000,-O7): 50 x 100 / 1000 - 3 = 5 - 3 = 2, so two more cases are expected. A negative value would mean there are more cases than the norm.|||Sheet tính Lack = LOC x định mức / 1000 - tổng, công thức SUM(C4*FunctionList!E6/1000,-O7): 50 x 100 / 1000 - 3 = 5 - 3 = 2, tức còn thiếu hai ca. Giá trị âm nghĩa là số ca đã vượt định mức.'),
      q('Test Report: Passed 24, Failed 5, Untested 3, Total 32. What is "Test coverage"?|||Test Report: Passed 24, Failed 5, Untested 3, Total 32. "Test coverage" bằng bao nhiêu?',
        ['75%|||75%', '90.625%|||90,625%', '9.375%|||9,375%', '100%|||100%'], 1, 'The template\'s Test coverage = (Passed + Failed) x 100 / Total = 29 x 100 / 32 = 90.625%, the share of cases executed, not code coverage. 75% (24/32) is the pass rate, i.e. the "Test successful coverage" cell.|||Test coverage của template = (Passed + Failed) x 100 / Tổng = 29 x 100 / 32 = 90,625%, là tỉ lệ ca đã chạy, không phải code coverage. 75% (24/32) là tỉ lệ pass, tức ô "Test successful coverage".'),
      q('Which case mix does the black-box variant of Lab 2 require?|||Biến thể black-box của Lab 2 yêu cầu tỉ lệ ca nào?',
        ['Normal > 60%, Abnormal < 20%, Boundary > 20%|||Normal > 60%, Abnormal < 20%, Boundary > 20%', 'Normal < 20%, Abnormal > 60%, Boundary > 20%|||Normal < 20%, Abnormal > 60%, Boundary > 20%', 'Equal thirds|||Mỗi loại một phần ba', 'Only normal cases|||Chỉ ca normal'], 1, 'Lab 2 black-box slide 10: Normal:Abnormal:Boundary = <20% : >60% : >20%. Normal cases are the small share; most cases must be abnormal. Option A swaps the normal and abnormal shares.|||Slide 10 của Lab 2 black-box: Normal:Abnormal:Boundary = <20% : >60% : >20%. Ca normal chỉ chiếm phần nhỏ; phần lớn phải là ca abnormal. Phương án A đảo ngược tỉ lệ normal và abnormal.'),
      q('White-box Lab 2: your chosen SWP391 code has 180 LOC. According to the grading scale, what is the base score (before the 0-2 difficulty points)?|||Lab 2 white-box: code SWP391 bạn chọn có 180 LOC. Theo thang điểm, điểm cơ bản (trước 0-2 điểm độ khó) là bao nhiêu?',
        ['1-4|||1-4', '5|||5', '6|||6', '8|||8'], 1, 'Lab 2 white-box slide 10 grading: <100 LOC 1-4, 101-200 LOC 5, 201-250 LOC 6, 251-300 LOC 7, >300 LOC 8, plus 0-2 for difficulty. 180 LOC falls in the 101-200 band, so the base is 5.|||Thang điểm ở slide 10 của Lab 2 white-box: <100 LOC 1-4, 101-200 LOC 5, 201-250 LOC 6, 251-300 LOC 7, >300 LOC 8, cộng 0-2 điểm độ khó. 180 LOC nằm trong khoảng 101-200, nên điểm cơ bản là 5.'),
      q('Which statement about coverage is true?|||Phát biểu nào về coverage là đúng?',
        ['100% statement coverage guarantees 100% decision coverage|||100% statement coverage bảo đảm 100% decision coverage', '100% decision coverage guarantees 100% statement coverage|||100% decision coverage bảo đảm 100% statement coverage', '100% coverage proves the unit has no defects|||100% coverage chứng minh unit không có defect', 'Tests without assertions cannot reach 100% coverage|||Test không có assertion không thể đạt 100% coverage'], 1, 'Every executable statement lies on some decision outcome, so 100% decision coverage implies 100% statement coverage. The reverse fails: an if without else can reach 100% statements with only the true outcome. Coverage never proves the absence of defects, and assertion-free tests still produce coverage.|||Mọi câu lệnh chạy được đều nằm trên một kết cục quyết định nào đó, nên 100% decision coverage kéo theo 100% statement coverage. Chiều ngược lại sai: if không có else đạt 100% statement chỉ với kết cục đúng. Coverage không chứng minh hết lỗi, và test không có assertion vẫn tạo ra coverage.'),
    ],
  },
};

export default {
  title: 'Lab 2 — Component (unit) testing: white-box & black-box|||Lab 2 — Component (unit) test: white-box & black-box',
  description: 'Lab 2 học từng slide: bộ hướng dẫn unit test của Hitachi (88 slide, dịch cả trang tiếng Nhật), cách viết PCL (32), đề bài white-box (13) và black-box (14), các checklist, Detail Design JNAP, template Unit Test Case với sheet mẫu đã chạy JUnit + JaCoCo, bộ UnitTestPoints và quiz.',
  lessons: [L21, L22, L23, L24, L25, L26, L27, L28, L29, QUIZ],
};
