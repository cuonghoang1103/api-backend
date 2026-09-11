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

/* Japanese page of the guide: note + the English twin's slide number. */
const JE = (n) => `<p><em>🇯🇵 Japanese page — its English twin is slide ${n}. The Japanese text of the picture is quoted and translated here.</em></p>`;
const JV = (n) => `<p><em>🇯🇵 Trang tiếng Nhật — bản tiếng Anh tương ứng là slide ${n}. Chữ Nhật trong hình được chép lại và dịch ngay dưới đây.</em></p>`;

/* ─────────────────────────── L2.1 Overview ─────────────────────────── */
const L21 = {
  title: 'L2.1 — Lab 2 at a glance: what you hand in and how it is graded|||L2.1 — Tổng quan Lab 2: nộp gì và chấm điểm thế nào',
  slug: 'swt301-lab2-overview',
  type: 'DOCUMENT',
  description: 'Lab 2 gồm 2 biến thể: white-box (C0/C1 100% trên code SWP391 của bạn) và black-box (test từ Detail Design). Bản đồ thư mục LAB02, quy trình PCL của Hitachi, thang điểm theo LOC / số trang DD, bảng thuật ngữ Nhật–Anh–Việt.',
  content: [
    bi(`<span class="eyebrow">Lab 2 · Lesson L2.1 · overview of 02.LAB02</span>
<h2>Lab 2 at a glance</h2>
<p class="lead">Lab 2 is the first lab in which you <em>design and execute</em> tests yourself. You test one small piece of software — a <strong>unit</strong> (a method or a function) — and you document the tests in the <strong>Unit Test Case</strong> spreadsheet that FPT Software inherited from its Japanese customers (Hitachi calls the same document a <strong>PCL</strong>). The lab comes in two flavours: a <strong>white-box</strong> (structural) version, where you test your own source code until every statement and every decision has been executed, and a <strong>black-box</strong> (functional) version, where you test from a <strong>Detail Design</strong> without looking at code.</p>
<div class="callout"><b>Learning objectives.</b> Explain what component (unit) testing is and who does it (LO-2.2.1, K2) · apply equivalence partitioning and boundary value analysis to unit inputs (LO-4.2.1/4.2.2, K3) · explain and measure statement coverage (C0) and decision coverage (C1) (LO-4.3.1/4.3.2, K2) · fill the Unit Test Case matrix (conditions × UTCID columns, Confirm rows, N/A/B type) · write a JUnit script and show a coverage report as evidence.</div>
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
<p class="lead">Lab 2 là bài đầu tiên bạn tự <em>thiết kế và chạy</em> test. Bạn kiểm thử một mẩu phần mềm nhỏ — một <strong>unit</strong> (một method/hàm) — và ghi test vào bảng tính <strong>Unit Test Case</strong> mà FPT Software kế thừa từ khách hàng Nhật (Hitachi gọi đúng tài liệu này là <strong>PCL</strong>). Lab có hai biến thể: bản <strong>white-box</strong> (cấu trúc) — test chính source code của bạn cho tới khi mọi câu lệnh và mọi quyết định (decision) đều đã được chạy; và bản <strong>black-box</strong> (chức năng) — test dựa trên <strong>Detail Design</strong> mà không nhìn code.</p>
<div class="callout"><b>Chuẩn đầu ra.</b> Giải thích component (unit) testing là gì, ai làm (LO-2.2.1, K2) · áp dụng phân vùng tương đương và phân tích giá trị biên cho đầu vào của unit (LO-4.2.1/4.2.2, K3) · giải thích và đo statement coverage (C0) và decision coverage (C1) (LO-4.3.1/4.3.2, K2) · điền được ma trận Unit Test Case (điều kiện × cột UTCID, các dòng Confirm, loại N/A/B) · viết JUnit script và nộp báo cáo coverage làm bằng chứng.</div>
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
<li><b>Score band.</b> 188 LOC falls in “101–200 LOC → 5 points”; a method with nested loops and exception handling can add up to 2 difficulty points, so the ceiling is 7. Adding one more 60-LOC method would move you to 248 LOC → band 6 (+ difficulty).</li>
<li><b>Expected number of test cases.</b> The template's FunctionList sheet sets <em>Normal number of test cases/KLOC = 100</em>. The function sheet computes <em>Lack of test cases = LOC × 100 / 1000 − Total test cases</em> (formula <code>SUM(C4*FunctionList!E6/1000,-O7)</code>). For the 62-LOC method: 6.2 − (your total). With 5 cases the cell shows 1.2 (you are 1.2 cases short); with 8 cases it shows −1.8 (no lack). If you stay below the norm you must write the reason.</li>
<li><b>Coverage evidence.</b> Run the JUnit tests with a coverage tool (JaCoCo, EclEmma in Eclipse, IntelliJ's coverage runner) and paste the report: every method must show 100 % lines and 100 % branches.</li>
</ol>
<div class="pitfall"><b>Two traps that cost points.</b> (1) 100 % coverage from tests without assertions — the structural deck (slide 3) warns about “empty unit tests, so 100 % of them pass”. Coverage measures what ran, not what was checked. (2) Black-box cases derived from the code instead of the DD — then the expected results simply copy what the code does and a design violation can never be found.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Mutation testing — the test of your tests.</b> A tool such as PIT (pitest.org) makes small changes to your code (turns <code>&lt;</code> into <code>&lt;=</code>, deletes a line, returns 0) and re-runs your JUnit suite. Every “mutant” that survives shows a place where your tests execute the code without checking it. A suite with 100 % C0/C1 and a low mutation score is exactly the “empty unit test” problem. <em>Outside the syllabus because CTFL only covers statement and decision coverage as test-quality measures.</em></div>`,
    `<h3>Ví dụ có lời giải · Bài nộp white-box của tôi phải lớn cỡ nào?</h3>
<p>Bạn chọn <code>OrderService</code> trong dự án SWP391: ba method dài 62, 71 và 55 dòng code (tổng 188 LOC).</p>
<ol>
<li><b>Mức điểm.</b> 188 LOC rơi vào “101–200 LOC → 5 điểm”; method có vòng lặp lồng nhau và xử lý exception có thể được cộng tối đa 2 điểm độ khó, nên trần là 7. Thêm một method 60 LOC nữa sẽ lên 248 LOC → mức 6 (+ độ khó).</li>
<li><b>Số test case kỳ vọng.</b> Sheet FunctionList của template đặt <em>Normal number of test cases/KLOC = 100</em>. Sheet function tính <em>Lack of test cases = LOC × 100 / 1000 − Tổng số test case</em> (công thức <code>SUM(C4*FunctionList!E6/1000,-O7)</code>). Với method 62 LOC: 6,2 − (tổng của bạn). Có 5 ca thì ô hiện 1,2 (còn thiếu 1,2 ca); có 8 ca thì hiện −1,8 (không thiếu). Nếu thấp hơn định mức, bạn phải ghi lý do.</li>
<li><b>Bằng chứng coverage.</b> Chạy JUnit kèm công cụ coverage (JaCoCo, EclEmma trong Eclipse, trình coverage của IntelliJ) và dán báo cáo: mọi method phải 100 % dòng và 100 % nhánh.</li>
</ol>
<div class="pitfall"><b>Hai cái bẫy làm mất điểm.</b> (1) Coverage 100 % nhờ các test không có assertion — slide 3 bản structural cảnh báo “viết unit test rỗng nên 100 % đều pass”. Coverage đo cái đã <em>chạy</em>, không đo cái đã được <em>kiểm</em>. (2) Ca black-box rút ra từ code thay vì từ DD — khi đó kết quả mong đợi chỉ chép lại việc code đang làm, và một chỗ sai so với thiết kế sẽ không bao giờ bị phát hiện.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Mutation testing — kiểm tra chính bộ test.</b> Công cụ như PIT (pitest.org) sửa nhỏ code của bạn (đổi <code>&lt;</code> thành <code>&lt;=</code>, xoá một dòng, trả về 0) rồi chạy lại bộ JUnit. Mỗi “mutant” sống sót chỉ ra một chỗ test có chạy qua code mà không hề kiểm tra nó. Bộ test đạt C0/C1 100 % mà điểm mutation thấp chính là căn bệnh “unit test rỗng”. <em>Ngoài giáo trình vì CTFL chỉ dùng statement và decision coverage làm thước đo chất lượng test.</em></div>`),
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
<div class="callout"><b>Learning objectives.</b> Describe component testing, its test basis (the detailed design) and the use of drivers and stubs (LO-2.2.1, K2) · explain why test cases should be written before the code (early testing, SWT1) · list the exit criteria of unit testing: all cases run, all bugs closed, static-analysis violations fixed, C0/C1 (or RC0) = 100 % (LO-5.2.3, K2) · explain C0, C1 and RC0 (LO-4.3.1/4.3.2, K2).</div>
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
<div class="callout"><b>Chuẩn đầu ra.</b> Mô tả component testing, test basis của nó (detailed design) và việc dùng driver, stub (LO-2.2.1, K2) · giải thích vì sao phải viết test case trước khi code (early testing, SWT1) · kể được tiêu chí kết thúc unit test: chạy hết ca, đóng hết bug, sửa hết vi phạm phân tích tĩnh, C0/C1 (hoặc RC0) = 100 % (LO-5.2.3, K2) · giải thích C0, C1 và RC0 (LO-4.3.1/4.3.2, K2).</div>
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
        `${JE(7)}<p>Title <b>単体テスト実施ガイド</b> (<em>tantai tesuto jisshi gaido</em>, “guide for carrying out unit testing”) — <em>A Guide for Unit Testing</em>, January 2013, by <b>株式会社 日立製作所 情報・通信システム社</b> (Hitachi, Ltd., Information &amp; Telecommunication Systems Company). The small red-framed box at the top right held <b>社外秘</b> (“confidential, not for outside the company”). Why a Hitachi document in an FPT course? FPT Software builds and tests software for Japanese customers, and this is the standard those customers impose — the PCL, the N/A/B letters and the C0/C1 = 100 % rule in your template all come from here.</p>`,
        `${JV(7)}<p>Tựa đề <b>単体テスト実施ガイド</b> (<em>tantai tesuto jisshi gaido</em>, “hướng dẫn thực hiện unit test”) — <em>A Guide for Unit Testing</em>, tháng 1/2013, của <b>株式会社 日立製作所 情報・通信システム社</b> (Hitachi, Ltd., Công ty Hệ thống Thông tin &amp; Viễn thông). Ô viền đỏ nhỏ góc phải trên chứa chữ <b>社外秘</b> (“mật, không đưa ra ngoài công ty”). Vì sao tài liệu Hitachi lại có trong môn học của FPT? FPT Software làm và test phần mềm cho khách Nhật, và đây là chuẩn khách hàng áp đặt — PCL, các chữ N/A/B và quy tắc C0/C1 = 100 % trong template của bạn đều bắt nguồn từ đây.</p>`],
      [2, 'About this guide (Japanese only)',
        `<p><em>🇯🇵 Japanese-only page (no English twin) — the Japanese text is translated here.</em></p><p><b>本ガイドについて — About this guide.</b> Five rows:</p><ul><li><b>Scope (対象範囲):</b> unit testing of online applications with a three-tier architecture, and of batch programs.</li><li><b>Assumed use (想定ユースケース):</b> explains to developers the unit-testing procedure and how to write checklists consistent with the quality indicators.</li><li><b>Purpose (目的):</b> reduce the variation of test work between workers and between projects, and secure the application quality Hitachi requires.</li><li><b>Readers (想定読者):</b> programmers who implement and unit-test the programs — <em>not</em> management criteria for leaders.</li><li><b>State after applying it (適用後の状態):</b> each programmer can create a PCL correctly (an explanation and a review are needed the first time to confirm they understood), and can report properly with a bug management sheet.</li></ul><p>The only Latin word left in the picture, “PCL”, sits in that last row.</p>`,
        `<p><em>🇯🇵 Trang chỉ có tiếng Nhật (không có bản tiếng Anh) — nội dung tiếng Nhật được dịch ở đây.</em></p><p><b>本ガイドについて — Về bộ hướng dẫn này.</b> Năm dòng:</p><ul><li><b>Phạm vi (対象範囲):</b> unit test cho ứng dụng online kiến trúc 3 lớp và cho chương trình batch.</li><li><b>Tình huống dùng (想定ユースケース):</b> giải thích cho lập trình viên quy trình unit test và cách viết checklist nhất quán với các chỉ số chất lượng.</li><li><b>Mục đích (目的):</b> giảm độ chênh lệch trong công việc test giữa từng người và từng dự án, bảo đảm chất lượng ứng dụng mà Hitachi yêu cầu.</li><li><b>Người đọc (想定読者):</b> lập trình viên phụ trách cài đặt và unit test — <em>không phải</em> tiêu chuẩn quản lý dành cho leader.</li><li><b>Trạng thái sau khi áp dụng (適用後の状態):</b> mỗi lập trình viên tạo được PCL đúng (lần đầu cần giải thích và review để chắc là đã hiểu), và báo cáo đúng cách bằng phiếu quản lý bug.</li></ul><p>Chữ Latin duy nhất còn lại trong ảnh, “PCL”, nằm ở dòng cuối đó.</p>`],
      [3, 'How and where to use the guide (Japanese only)',
        `<p><em>🇯🇵 Japanese-only page, translated here.</em></p><p><b>How to use (利用方法):</b> the guide has Japanese pages and English pages — delete the pages in the language you do not use. You may edit it where your project's standards differ or where you want to add content. Points that need special care are explained in <b>labels</b> like the red-framed box at the bottom (“labels in this format give supplementary notes for using the guide — delete them when you actually use it”). You will see these red frames on many later slides.</p><p><b>Usage scenes (利用シーン):</b> ① the offshore partner (IP先) has few leaders for many developers and wants to control test work efficiently; ② an overseas subsidiary serving Japanese companies wants to strengthen testing to reach the quality Japanese companies expect; ③ teaching developers in Japan or abroad “Hitachi's way of testing”. Scene ② is literally your future job at an FPT offshore project.</p>`,
        `<p><em>🇯🇵 Trang chỉ có tiếng Nhật, được dịch ở đây.</em></p><p><b>Cách dùng (利用方法):</b> bộ hướng dẫn có trang tiếng Nhật và trang tiếng Anh — xoá các trang của ngôn ngữ không dùng. Được phép chỉnh sửa chỗ nào tiêu chuẩn dự án khác đi hoặc muốn bổ sung. Những điểm cần đặc biệt lưu ý được ghi trong các <b>nhãn</b> như ô viền đỏ phía dưới (“nhãn dạng này chứa ghi chú bổ sung để dùng bộ hướng dẫn — hãy xoá chúng khi sử dụng thật”). Bạn sẽ gặp các khung đỏ này ở rất nhiều slide sau.</p><p><b>Tình huống sử dụng (利用シーン):</b> ① đối tác offshore (IP先) có ít leader so với số developer và muốn kiểm soát việc test hiệu quả; ② công ty con ở nước ngoài phục vụ doanh nghiệp Nhật muốn tăng cường khâu test để đạt chất lượng doanh nghiệp Nhật đòi hỏi; ③ đào tạo developer trong và ngoài nước theo “cách test của Hitachi”. Tình huống ② chính là công việc tương lai của bạn ở một dự án offshore của FPT.</p>`],
      [4, 'Effect of applying the guide (Japanese)',
        `${JE(5)}<p>Three bar charts with the project criterion drawn as a red band: <b>CL密度</b> (checklist density = test cases per size) −48 %; <b>UT摘出不良</b> (defects detected in unit testing) +14 %; <b>検収時不良</b> (defects found at acceptance inspection) −50 %. The boxes say: before, testing depended on each person and was disorderly; after unifying the CL-creation rules the quality of cases became adequate and their number approached the criterion; more defects were found efficiently at UT, which cut acceptance defects. The link at the bottom points to Hitachi's internal knowledge base (SoFI).</p>`,
        `${JV(5)}<p>Ba biểu đồ cột, tiêu chuẩn dự án là dải đỏ: <b>CL密度</b> (mật độ checklist = số test case trên kích thước) giảm 48 %; <b>UT摘出不良</b> (lỗi phát hiện ở unit test) tăng 14 %; <b>検収時不良</b> (lỗi phát hiện khi nghiệm thu) giảm 50 %. Các ô chữ nói: trước đây việc test phụ thuộc từng người, lộn xộn; sau khi thống nhất quy tắc lập CL, chất lượng ca test trở nên hợp lý và số lượng tiến gần tiêu chuẩn; nhiều lỗi được bắt hiệu quả hơn ở UT nên lỗi lúc nghiệm thu giảm. Đường link cuối trang trỏ tới kho tri thức nội bộ của Hitachi (SoFI).</p>`],
      [5, 'A case example of the effects (English)',
        `<p>The English twin of slide 4. Read the three charts together: the <b>density of test cases</b> dropped 48 % to the criterion — before the guide, people wrote many redundant cases; the <b>density of defects found in unit testing</b> rose 14 % to the criterion; and the <b>density of defects at acceptance</b> fell 50 %. That is Principle 3 of SWT1 (<em>early testing saves time and money</em>) measured on a real project: fewer but better cases find more bugs earlier. Note the idea of a <b>criterion</b> (基準値): Japanese projects set target densities for both test cases and bugs, and a leader questions a unit whose numbers are far off in either direction (slide 35). The red label at the top says “delete this page and all pages before it when you actually use the guide” — slides 1–5 are only the sales pitch; the real guide starts at slide 6.</p>`,
        `<p>Bản tiếng Anh của slide 4. Đọc ba biểu đồ cùng nhau: <b>mật độ test case</b> giảm 48 % về đúng tiêu chuẩn — trước khi có hướng dẫn, mọi người viết nhiều ca thừa; <b>mật độ lỗi phát hiện ở unit test</b> tăng 14 % lên tiêu chuẩn; và <b>mật độ lỗi lúc nghiệm thu</b> giảm 50 %. Đó là Nguyên tắc 3 của SWT1 (<em>test sớm tiết kiệm thời gian và tiền</em>) được đo trên dự án thật: ít ca hơn nhưng tốt hơn, bắt nhiều lỗi hơn và sớm hơn. Chú ý khái niệm <b>tiêu chuẩn</b> (基準値): dự án Nhật đặt mật độ mục tiêu cho cả test case lẫn bug, và leader sẽ chất vấn unit nào có số liệu lệch xa ở bất kỳ chiều nào (slide 35). Nhãn đỏ ở trên ghi “khi dùng thật, hãy xoá trang này và mọi trang trước nó” — slide 1–5 chỉ là phần giới thiệu; bộ hướng dẫn thật bắt đầu từ slide 6.</p>`],
      [6, 'Template cover (Japanese): yyyy/MM',
        `${JE(7)}<p>The real first page of the guide, as a template. The red label says <b>“yyyy/MM に年月を記入してください（例：2013/01）”</b> — “write the year and month in yyyy/MM (e.g. 2013/01)”. The empty box at the top right is where 社外秘 (confidential) goes.</p>`,
        `${JV(7)}<p>Trang bìa thật của bộ hướng dẫn, ở dạng mẫu. Nhãn đỏ ghi <b>“yyyy/MM に年月を記入してください（例：2013/01）”</b> — “điền năm tháng theo dạng yyyy/MM (ví dụ 2013/01)”. Ô trống góc phải trên là chỗ ghi 社外秘 (mật).</p>`],
      [7, 'Template cover (English): MMM yyyy, HITACHI CONFIDENTIAL',
        `<p>The English cover: <em>A Guide for Unit Testing</em>, Information &amp; Telecommunication Systems Company, Hitachi, Ltd., marked <b>HITACHI CONFIDENTIAL</b>. The red label (in Japanese) asks you to replace “MMM yyyy” with the month, e.g. “January 2013”. Nothing to learn for the exam — but notice that even the guide is a template to be customised: every project adapts the standard (see slide 3).</p>`,
        `<p>Bìa tiếng Anh: <em>A Guide for Unit Testing</em>, Information &amp; Telecommunication Systems Company, Hitachi, Ltd., đóng dấu <b>HITACHI CONFIDENTIAL</b>. Nhãn đỏ (tiếng Nhật) yêu cầu thay “MMM yyyy” bằng tháng, ví dụ “January 2013”. Không có gì để thi — nhưng hãy để ý rằng ngay cả bộ hướng dẫn cũng là một mẫu để tuỳ biến: dự án nào cũng điều chỉnh tiêu chuẩn (xem slide 3).</p>`],
      [8, 'Contents (Japanese)',
        `${JE(9)}<p>1. 本ガイドの概要 (outline of this guide) · 2. プログラミングプロセスの進め方 (how to proceed through the programming process) · 3. PCLの作成方法 (how to create PCLs) · 4. PCL作成時の留意点 (points to note when creating PCLs) · 付録 関連知識 (appendix: related knowledge). Only “3. PCL” and “4. PCL” survived in the picture.</p>`,
        `${JV(9)}<p>1. 本ガイドの概要 (tổng quan bộ hướng dẫn) · 2. プログラミングプロセスの進め方 (cách tiến hành quy trình lập trình) · 3. PCLの作成方法 (cách tạo PCL) · 4. PCL作成時の留意点 (điểm lưu ý khi tạo PCL) · 付録 関連知識 (phụ lục: kiến thức liên quan). Trong ảnh chỉ còn sót “3. PCL” và “4. PCL”.</p>`],
      [9, 'Contents (English)',
        `<p>The five parts and where they are on this site: <b>1 Outline</b> and <b>2 Procedure for the Programming Process</b> — this lesson (slides 10–35); <b>3 Creating PCLs</b> and <b>4 Points to note</b> — lesson L2.3 (slides 36–67); <b>Appendix</b> (three-tier architecture, order of unit testing, testing concerns vs test cases vs checklists, list vs matrix format, test-case categories, coverage) — lesson L2.4.</p>`,
        `<p>Năm phần và vị trí trên trang này: <b>1 Tổng quan</b> và <b>2 Quy trình lập trình</b> — bài này (slide 10–35); <b>3 Tạo PCL</b> và <b>4 Điểm lưu ý</b> — bài L2.3 (slide 36–67); <b>Phụ lục</b> (kiến trúc 3 lớp, thứ tự unit test, testing concern vs test case vs checklist, dạng danh sách vs ma trận, phân loại test case, coverage) — bài L2.4.</p>`],
      [10, 'Section 1 divider (Japanese)',
        `${JE(11)}<p>“1. 本ガイドの概要” — “1. Outline of this guide”.</p>`,
        `${JV(11)}<p>“1. 本ガイドの概要” — “1. Tổng quan bộ hướng dẫn”.</p>`],
      [11, 'Section 1: Outline of This Guide',
        `<p>Divider for chapter 1, which answers three questions: what is unit testing for, who is involved, and which kinds of units the guide covers.</p>`,
        `<p>Trang ngăn chương 1, chương trả lời ba câu hỏi: unit test để làm gì, ai tham gia, và bộ hướng dẫn áp dụng cho loại unit nào.</p>`],
      [12, 'Outline (Japanese)',
        `${JE(13)}<p>Same text as slide 13. The five chevrons read アプリケーション方式設計 (application architecture design) → アプリケーション詳細設計 (detailed application design) → <b>プログラミング（コーディング・単体テスト）</b> (programming: coding and unit testing, highlighted) → 組合せテスト (combination test) → 連動テスト (linked test).</p>`,
        `${JV(13)}<p>Nội dung giống slide 13. Năm mũi tên: アプリケーション方式設計 (thiết kế kiến trúc ứng dụng) → アプリケーション詳細設計 (thiết kế chi tiết ứng dụng) → <b>プログラミング（コーディング・単体テスト）</b> (lập trình: code và unit test, được tô đậm) → 組合せテスト (test kết hợp) → 連動テスト (test liên động).</p>`],
      [13, 'Outline of This Guide (English)',
        `<p>Three key sentences. (1) The guide is for <b>programmers</b> who implement and unit-test. (2) <b>“Unit testing is the only process for exhaustively checking the behaviour of software units.”</b> Later levels test units only through other units, so many internal paths can never be reached again — which is why the guide demands 100 % C0/C1 here and nowhere else. (3) At Hitachi, unit testing is <b>part of the Programming Process</b>, not a separate test phase: the same person codes and unit-tests. The chevrons are the left-to-right half of a V-model: architecture design → detailed design → programming (coding + unit testing) → Software Component Testing (units combined — ISTQB <em>component integration testing</em>) → Application Software Testing (≈ system testing). Each test level is checked against the matching design level; unit testing is checked against the <b>detailed design</b>.</p>`,
        `<p>Ba câu then chốt. (1) Bộ hướng dẫn dành cho <b>lập trình viên</b> — người cài đặt và unit test. (2) <b>“Unit test là quy trình duy nhất kiểm tra hành vi của software unit một cách vét cạn.”</b> Các cấp sau chỉ test unit gián tiếp qua unit khác, nên nhiều đường đi bên trong không bao giờ với tới được nữa — đó là lý do hướng dẫn đòi C0/C1 100 % ở đây chứ không phải ở cấp nào khác. (3) Ở Hitachi, unit test là <b>một phần của Quy trình Lập trình</b>, không phải một pha test riêng: người code cũng là người unit test. Các mũi tên là nửa trái-sang-phải của mô hình V: thiết kế kiến trúc → thiết kế chi tiết → lập trình (code + unit test) → Software Component Testing (ghép các unit — tức <em>component integration testing</em> của ISTQB) → Application Software Testing (≈ system testing). Mỗi cấp test đối chiếu với cấp thiết kế tương ứng; unit test đối chiếu với <b>detailed design</b>.</p>`],
      [14, 'People and terms (Japanese)',
        `${JE(15)}<p>Same two tables as slide 15 (単体テストに関係する人物 = persons involved in unit testing; 重要語 = important terms). The red label adds: “change the roles to fit your project organisation; if you change them, make each role's share of work clear (e.g. when programmer and test executor are different people)”.</p>`,
        `${JV(15)}<p>Hai bảng giống slide 15 (単体テストに関係する人物 = người liên quan tới unit test; 重要語 = thuật ngữ quan trọng). Nhãn đỏ nói thêm: “đổi các vai trò cho hợp với tổ chức dự án; nếu đổi thì phải làm rõ phân công của từng vai (ví dụ khi người lập trình và người chạy test là hai người khác nhau)”.</p>`],
      [15, 'Persons involved and important terms (English)',
        `<p><b>Roles:</b> <em>Programmer</em> — implements the units and performs unit testing; <em>Expert</em> — understands the specification of the software being developed and tested (reviews the PCL); <em>Leader</em> — coordinates programmers, manages progress and quality (reviews and approves). <b>Terms:</b> <em>software unit</em> = the smallest piece a programmer develops (method, function); <em>unit testing</em> = testing whether units are implemented correctly; <em>test case</em> = <b>a pair of input conditions and expected results</b> (exactly the ISTQB idea); <em>PCL</em> = the list of test cases for unit testing — footnote *1: “for historical reasons a Checklist for Unit Testing is called a PCL within Hitachi” (the PCL deck expands it as <em>Program Check List</em>, L2.5); <em>Testing Concerns</em> = an artifact listing things to watch so that testing is not insufficient; <em>Detailed Design</em> = the internal specification of a unit (e.g. Detailed Method Design), input to both the PCL and the code.</p>`,
        `<p><b>Vai trò:</b> <em>Programmer</em> — cài đặt unit và unit test; <em>Expert</em> — người hiểu đặc tả phần mềm đang làm và đang test (review PCL); <em>Leader</em> — điều phối lập trình viên, quản lý tiến độ và chất lượng (review và phê duyệt). <b>Thuật ngữ:</b> <em>software unit</em> = phần nhỏ nhất lập trình viên phát triển (method, hàm); <em>unit testing</em> = kiểm xem unit đã được cài đặt đúng chưa; <em>test case</em> = <b>một cặp điều kiện đầu vào và kết quả mong đợi</b> (đúng ý của ISTQB); <em>PCL</em> = danh sách test case cho unit test — chú thích *1: “vì lý do lịch sử, Checklist for Unit Testing được gọi là PCL trong Hitachi” (slide PCL giải nghĩa là <em>Program Check List</em>, bài L2.5); <em>Testing Concerns</em> = tài liệu liệt kê những điểm cần để ý để việc test không bị thiếu; <em>Detailed Design</em> = đặc tả bên trong của một unit (ví dụ Detailed Method Design), là đầu vào cho cả PCL lẫn code.</p>`],
      [16, 'Applicable software units (Japanese)',
        `${JE(17)}<p>Same diagram as slide 17. Footnote *1 (only “JavaScript FLEX … PCL” survived): <b>when you develop client-side programs such as JavaScript or FLEX, create PCLs and test them following this guide exactly as for server-side programs.</b></p>`,
        `${JV(17)}<p>Sơ đồ giống slide 17. Chú thích *1 (chỉ còn sót “JavaScript FLEX … PCL”): <b>khi phát triển chương trình phía client như JavaScript hay FLEX, cũng phải tạo PCL và test theo đúng bộ hướng dẫn này như chương trình phía server.</b></p>`],
      [17, 'Applicable software units: the three-tier architecture',
        `<p>The guide covers four kinds of unit. <b>Presentation layer (P) units</b> handle user interfaces: screen layouts and screen transitions (the hexagons on the left are <em>Views</em>). <b>Function layer (F) units</b> hold business logic and transaction control; they call each other. <b>Data access layer (D) units</b> access the database — and <em>only</em> D units may do so. <b>Batch main units</b> (orange box) are batch programs that also go through D units. For your SWP391 project: servlet/JSP or controller = P, service = F, DAO/repository = D. The Detail Design used in the black-box lab is a <em>batch</em> system: its action classes are batch main units (L2.7).</p>`,
        `<p>Bộ hướng dẫn áp dụng cho bốn loại unit. <b>Unit lớp Presentation (P)</b> lo giao diện: bố cục màn hình và chuyển màn hình (các hình lục giác bên trái là <em>View</em>). <b>Unit lớp Function (F)</b> chứa logic nghiệp vụ và điều khiển transaction; chúng gọi lẫn nhau. <b>Unit lớp Data access (D)</b> truy cập cơ sở dữ liệu — và <em>chỉ</em> unit D được làm việc này. <b>Batch main unit</b> (ô cam) là chương trình batch, cũng đi qua unit D. Với dự án SWP391: servlet/JSP hoặc controller = P, service = F, DAO/repository = D. Detail Design dùng trong lab black-box là một hệ thống <em>batch</em>: các lớp action của nó là batch main unit (bài L2.7).</p>`],
      [18, 'Section 2 divider (Japanese)',
        `${JE(19)}<p>“2. プログラミングプロセスの進め方” — “2. How to proceed through the programming process”.</p>`,
        `${JV(19)}<p>“2. プログラミングプロセスの進め方” — “2. Cách tiến hành quy trình lập trình”.</p>`],
      [19, 'Section 2: Procedure for the Programming Process',
        `<p>Divider for chapter 2 — the heart of the guide: six steps, each on its own slide with <em>Objectives</em> and <em>Tasks</em> (slides 21–35).</p>`,
        `<p>Trang ngăn chương 2 — trái tim của bộ hướng dẫn: sáu bước, mỗi bước một slide có <em>Objectives</em> và <em>Tasks</em> (slide 21–35).</p>`],
      [20, 'Procedure (Japanese)',
        `${JE(21)}<p>Objective: ソフトウェアユニットを実装し、詳細設計書通りに動作することを確認する — implement the unit and confirm it behaves as the detailed design says. The six boxes: PCL作成 (create PCL), 単体テスト準備 (prepare unit test), ソースプログラム作成 (write source program), 静的テスト (static test), 動的テスト（単体テスト） (dynamic test), 単体テスト評価 (unit-test evaluation). Yellow balloon: 動的テストで検出したバグは必ず記録する — always record bugs found in dynamic testing. Red label: report progress every day so the leader can grasp it.</p>`,
        `${JV(21)}<p>Mục tiêu: ソフトウェアユニットを実装し、詳細設計書通りに動作することを確認する — cài đặt unit và xác nhận nó chạy đúng như detailed design. Sáu ô: PCL作成 (tạo PCL), 単体テスト準備 (chuẩn bị unit test), ソースプログラム作成 (viết chương trình nguồn), 静的テスト (test tĩnh), 動的テスト（単体テスト） (test động), 単体テスト評価 (đánh giá unit test). Bóng vàng: 動的テストで検出したバグは必ず記録する — bug phát hiện trong test động phải được ghi lại. Nhãn đỏ: báo cáo tiến độ hằng ngày để leader nắm được.</p>`],
      [21, 'Procedure for the Programming Process (English)',
        `<p><b>Objective:</b> implement units and determine whether they behave as described in their Detailed Design. <b>Six steps:</b> (1) <em>Create PCLs</em> — reviewed by others (*3: more reviewers → more exhaustive PCLs); (2) <em>Prepare for unit testing</em> — runtime environment, test data, test drivers; (3) <em>Code</em>; (4) <em>Do static testing</em> — check the code without running it (*4: bugs found statically reduce later work); (5) <em>Do dynamic testing</em> — run the unit (yellow balloon: <b>always record every bug found here</b>); (6) <em>Have the unit testing evaluated and approved</em> by the leader. *1: if quality does not meet the project criteria, repeat the procedure. *2: following it makes your work “highly evaluated”. Bottom line: report progress daily. Notice the order: <b>test design (PCL) comes before coding</b> — the same “test first” idea as TDD, and ISTQB's early-testing principle.</p>`,
        `<p><b>Mục tiêu:</b> cài đặt unit và xác định chúng có chạy đúng như Detailed Design không. <b>Sáu bước:</b> (1) <em>Tạo PCL</em> — có người khác review (*3: càng nhiều người review → PCL càng đầy đủ); (2) <em>Chuẩn bị unit test</em> — môi trường chạy, dữ liệu test, test driver; (3) <em>Code</em>; (4) <em>Test tĩnh</em> — kiểm code mà không chạy (*4: bắt lỗi bằng test tĩnh giảm công sức về sau); (5) <em>Test động</em> — chạy unit (bóng vàng: <b>mọi bug tìm thấy ở đây đều phải ghi lại</b>); (6) <em>Được leader đánh giá và phê duyệt</em> kết quả unit test. *1: nếu chất lượng chưa đạt tiêu chuẩn dự án thì làm lại quy trình. *2: làm đúng thì công việc của bạn “được đánh giá cao”. Dòng cuối: báo cáo tiến độ hằng ngày. Để ý thứ tự: <b>thiết kế test (PCL) đứng trước khi code</b> — cùng tinh thần “test trước” của TDD, và nguyên tắc test sớm của ISTQB.</p>`],
      [22, '2-1 Creating PCLs (Japanese)',
        `${JE(23)}<p>Same content as slide 23. Footnote *3 here (P層プログラムのPCLを作成する場合、画面設計書も参照してください): when you write the PCL of a presentation-layer program, also refer to the <b>Screen Design</b> (画面設計書).</p>`,
        `${JV(23)}<p>Nội dung giống slide 23. Chú thích *3 (P層プログラムのPCLを作成する場合、画面設計書も参照してください): khi viết PCL cho chương trình lớp presentation, phải xem cả <b>Screen Design</b> (画面設計書).</p>`],
      [23, '2-1 Creating PCLs (English)',
        `<p><b>Objective:</b> define the test cases to be run so the unit can be tested exhaustively. <b>Tasks:</b> (1) create a PCL from the <b>Detailed Design</b> — <b>one PCL per unit</b>, and <b>always before coding</b>: “if PCLs are created based on source code after coding, coding errors cannot be detected”. If you derive the expected result from the code, the code is its own oracle and every bug becomes “expected behaviour”. Also use the Testing Concerns (section 3-3) to catch frequent bugs. (2) Have the PCL <b>reviewed by an expert and by the leader</b> — a review of a test work product, i.e. static testing of your test design. The picture: Detailed Design + Testing Concerns (+ Screen Design for P units, *3) → programmer → PCL → review meeting.</p>`,
        `<p><b>Mục tiêu:</b> định nghĩa các test case sẽ chạy để test unit một cách vét cạn. <b>Việc cần làm:</b> (1) tạo PCL từ <b>Detailed Design</b> — <b>mỗi unit một PCL</b>, và <b>luôn trước khi code</b>: “nếu tạo PCL dựa trên source code sau khi code xong thì không thể phát hiện lỗi code”. Nếu bạn lấy kết quả mong đợi từ code, code trở thành oracle của chính nó và mọi bug đều thành “hành vi mong đợi”. Dùng thêm Testing Concerns (mục 3-3) để bắt các lỗi hay gặp. (2) Cho PCL được <b>chuyên gia và leader review</b> — tức review một sản phẩm test, là kiểm thử tĩnh cho thiết kế test của bạn. Hình minh hoạ: Detailed Design + Testing Concerns (+ Screen Design với unit P, *3) → lập trình viên → PCL → buổi review.</p>`],
      [24, '2-2 Preparing for unit testing (Japanese)',
        `${JE(25)}<p>Same content as slide 25. The red label (visible as a red frame): 開発環境、実行環境、静的解析ツール（ルール作成、修正すべき重要度の閾値設定も含む）、カバレージ計測ツールの準備については、事前にプロジェクトにてご用意願います — “the project must prepare in advance the development and runtime environments, the static-analysis tool (including its rules and the severity threshold above which violations must be fixed) and the coverage tool”.</p>`,
        `${JV(25)}<p>Nội dung giống slide 25. Nhãn đỏ (thấy được khung đỏ): 開発環境、実行環境、静的解析ツール（ルール作成、修正すべき重要度の閾値設定も含む）、カバレージ計測ツールの準備については、事前にプロジェクトにてご用意願います — “dự án phải chuẩn bị trước môi trường phát triển và môi trường chạy, công cụ phân tích tĩnh (gồm bộ quy tắc và ngưỡng mức độ nghiêm trọng bắt buộc phải sửa) và công cụ đo coverage”.</p>`],
      [25, '2-2 Preparing for unit testing (English)',
        `<p><b>Tasks:</b> (1) set up the runtime environment — configuration files, libraries, submodules; (2) create the <b>test data</b> the PCL needs (database rows, input files); (3) write <b>test drivers</b> that call the unit; (4) prepare and learn the tools (static analysis, coverage). The yellow scroll shows <em>Test driver → call → Software unit being tested → call → Submodule</em>. Footnote *1 is Hitachi-specific and worth remembering: if the unit calls other units, <b>use the real, already tested submodules</b> rather than stubs; if you had to use stubs, re-test with the real submodules once they exist; therefore develop submodules <em>first</em> (bottom-up). “Real submodules allow more reliable testing than stubs.” *2: keep the unit-test environment after the programming process — bugs found in later levels send you back to unit testing. Link to SWT2: <b>driver</b> = replaces the caller, <b>stub</b> = replaces the callee.</p>`,
        `<p><b>Việc cần làm:</b> (1) dựng môi trường chạy — file cấu hình, thư viện, submodule; (2) tạo <b>dữ liệu test</b> mà PCL cần (bản ghi DB, file input); (3) viết <b>test driver</b> để gọi unit; (4) chuẩn bị và học cách dùng công cụ (phân tích tĩnh, coverage). Cuộn giấy vàng vẽ <em>Test driver → gọi → Unit đang test → gọi → Submodule</em>. Chú thích *1 rất riêng của Hitachi và nên nhớ: nếu unit gọi unit khác, <b>dùng submodule thật đã được test</b> thay vì stub; nếu buộc phải dùng stub thì phải test lại với submodule thật khi đã có; vì vậy phát triển submodule <em>trước</em> (bottom-up). “Submodule thật cho kết quả test tin cậy hơn stub.” *2: giữ lại môi trường unit test sau quy trình lập trình — bug tìm ra ở các cấp sau sẽ đưa bạn quay lại unit test. Liên hệ SWT2: <b>driver</b> = thay cho bên gọi, <b>stub</b> = thay cho bên bị gọi.</p>`],
      [26, '2-3 Coding (Japanese)',
        `${JE(27)}<p>Same as slide 27. Red label: コーディング基準については、事前にプロジェクトにてご用意願います — “the project must prepare the coding standards in advance”.</p>`,
        `${JV(27)}<p>Giống slide 27. Nhãn đỏ: コーディング基準については、事前にプロジェクトにてご用意願います — “dự án phải chuẩn bị coding standard từ trước”.</p>`],
      [27, '2-3 Coding (English)',
        `<p><b>Objective:</b> implement the unit. <b>Tasks:</b> (1) write the code from the <b>Detailed Design and the PCL</b>, following the project's coding standards (the picture: Detailed Design + PCL + Coding standards → programmer → Source code); (2) if, while coding, you discover that test cases are missing — e.g. a branch condition you overlooked when you wrote the PCL — <b>add them to the PCL and have it reviewed by the leader again</b>. The PCL is a living document, but every change goes back through review.</p>`,
        `<p><b>Mục tiêu:</b> cài đặt unit. <b>Việc cần làm:</b> (1) viết code từ <b>Detailed Design và PCL</b>, tuân thủ coding standard của dự án (hình: Detailed Design + PCL + Coding standard → lập trình viên → Source code); (2) nếu trong lúc code bạn phát hiện còn thiếu test case — ví dụ một điều kiện rẽ nhánh bị bỏ sót lúc viết PCL — <b>bổ sung vào PCL và cho leader review lại</b>. PCL là tài liệu sống, nhưng mọi thay đổi đều phải qua review.</p>`],
      [28, '2-4 Static testing (Japanese)',
        `${JE(29)}<p>Same as slide 29: 机上デバッグ (desk debugging), 静的解析 (static analysis), ソースコードレビュー (source code review); footnote *1 on reducing later work.</p>`,
        `${JV(29)}<p>Giống slide 29: 机上デバッグ (debug trên bàn), 静的解析 (phân tích tĩnh), ソースコードレビュー (review source code); chú thích *1 về giảm việc về sau.</p>`],
      [29, '2-4 Static Testing (English)',
        `<p><b>Objectives:</b> fix errors and coding-standard violations <em>before</em> unit testing, so fewer bugs reach dynamic testing (*1: a bug found dynamically costs a debug-and-retest loop), and ensure <b>readability and maintainability</b> — qualities dynamic testing cannot see. <b>Three tasks:</b> (1) <b>Desk checking</b> — compare your code with the Detailed Design yourself, statement by statement; (2) <b>Static code analysis</b> — run the project's tool, fix all high-priority violations and report the result as evidence; (3) <b>Source code review</b> with other programmers, to catch what the first two missed. Rule for every task: when you find an error, <b>look for similar errors</b> and fix them too. This is Chapter 3 of the course and Lab 1 (review + static analysis) applied to your own unit.</p>`,
        `<p><b>Mục tiêu:</b> sửa lỗi và vi phạm coding standard <em>trước</em> khi unit test, để ít bug lọt tới test động (*1: bug tìm bằng test động tốn một vòng debug-và-test-lại), và bảo đảm <b>tính dễ đọc và dễ bảo trì</b> — những thứ test động không nhìn thấy. <b>Ba việc:</b> (1) <b>Desk checking</b> — tự đối chiếu code với Detailed Design từng câu lệnh; (2) <b>Phân tích tĩnh</b> — chạy công cụ của dự án, sửa mọi vi phạm mức ưu tiên cao và nộp kết quả làm bằng chứng; (3) <b>Review source code</b> cùng lập trình viên khác, để bắt những gì hai bước trước bỏ sót. Quy tắc chung: khi tìm thấy một lỗi, <b>tìm cả các lỗi tương tự</b> và sửa luôn. Đây chính là Chương 3 của môn và Lab 1 (review + phân tích tĩnh) áp dụng lên unit của bạn.</p>`],
      [30, '2-5 Dynamic testing (1) (Japanese)',
        `${JE(31)}<p>Same as slide 31. Key words: カバレージ計測ツール (coverage tool), 確認日 (date of verification) written into the PCL, エビデンス (evidence), バグ管理票 (bug management sheet). The red-underlined sentences are the same as on slide 31.</p>`,
        `${JV(31)}<p>Giống slide 31. Từ khoá: カバレージ計測ツール (công cụ đo coverage), 確認日 (ngày xác nhận) ghi vào PCL, エビデンス (bằng chứng), バグ管理票 (phiếu quản lý bug). Các câu gạch chân đỏ giống slide 31.</p>`],
      [31, '2-5 Dynamic Testing (1) (English)',
        `<p><b>Objectives:</b> run the unit and verify it behaves as designed; detect and correct bugs. <b>Tasks:</b> (1) switch on a <b>coverage tool</b>; (2) run each PCL case and compare actual with expected — (a) equal → enter the <b>date of verification</b> in the PCL and keep the evidence the project asks for (screenshots, output files); (b) different → <u>record the problem in the Bug List</u>, including problems that are not program bugs (a wrong environment setting). The number of bugs is used to judge unit quality and the sufficiency of testing, so <u>all problems found by running the unit must be recorded</u>; unrecorded problems mean the leader may order a re-test. (3) Debug, then re-run the related cases; if a revised statement is not exercised by any existing case, add one; after all fixes, statically test the revised statements (desk check, analysis, review) at least once. In ISTQB words: failure → defect report → debugging → <b>confirmation testing</b>.</p>`,
        `<p><b>Mục tiêu:</b> chạy unit và xác nhận nó hoạt động đúng thiết kế; phát hiện và sửa bug. <b>Việc cần làm:</b> (1) bật <b>công cụ đo coverage</b>; (2) chạy từng ca trong PCL và so thực tế với mong đợi — (a) khớp → ghi <b>ngày xác nhận</b> vào PCL và lưu bằng chứng dự án yêu cầu (ảnh chụp màn hình, file output); (b) lệch → <u>ghi vấn đề vào Bug List</u>, kể cả vấn đề không phải bug chương trình (cấu hình môi trường sai). Số bug được dùng để đánh giá chất lượng unit và độ đầy đủ của việc test, nên <u>mọi vấn đề phát hiện khi chạy unit đều phải được ghi</u>; không ghi thì leader có thể yêu cầu test lại. (3) Debug, rồi chạy lại các ca liên quan; nếu câu lệnh vừa sửa chưa được ca nào chạy qua thì thêm ca; sửa xong hết thì test tĩnh các câu lệnh đã sửa (desk check, phân tích, review) ít nhất một lần. Theo ngôn ngữ ISTQB: failure → báo cáo defect → debugging → <b>confirmation testing</b>.</p>`],
      [32, '2-5 Dynamic testing (2) (Japanese)',
        `${JE(33)}<p>Same as slide 33. Visible Latin text: C0, C1, RC0; the Japanese is (a) 新規開発の場合 C0（命令網羅）と C1（分岐網羅）の両方 — new development: both C0 (statement coverage) and C1 (branch coverage); (b) 改造開発の場合 RC0（修正網羅） — modification: RC0 (revised-statement coverage).</p>`,
        `${JV(33)}<p>Giống slide 33. Chữ Latin còn thấy: C0, C1, RC0; phần tiếng Nhật là (a) 新規開発の場合 C0（命令網羅）と C1（分岐網羅）の両方 — phát triển mới: cả C0 (phủ câu lệnh) và C1 (phủ nhánh); (b) 改造開発の場合 RC0（修正網羅） — sửa đổi: RC0 (phủ phần sửa).</p>`],
      [33, '2-5 Dynamic Testing (2) (English)',
        `<p>(4) <b>Similar-bug check</b>: “similar processes tend to contain similar bugs” — inspect other units and share each bug with the team; record what you find. (5) <b>Regression testing</b>: after all fixes, re-run <em>every</em> case of the unit, because debugging can create new bugs (“regression”). (6) <b>Coverage</b>: new unit → <b>C0 (statement)</b> and <b>C1 (decision)</b>; modified unit → <b>RC0 (revised-statement coverage)</b>. Below 100 % → add cases for the unexecuted statements/branches and re-run. Conditions impossible to produce (e.g. a hardware failure) → prove by source-code review that the code is right, and report the reason. “In principle, 100 % coverage is required for dynamic testing to be considered complete.” Compare with ISTQB: 100 % decision coverage guarantees 100 % statement coverage, not the other way round (LO-4.3.3).</p>`,
        `<p>(4) <b>Kiểm tra lỗi tương tự</b>: “các xử lý giống nhau thường chứa lỗi giống nhau” — soi các unit khác và chia sẻ từng bug cho nhóm; ghi lại những gì tìm được. (5) <b>Regression testing</b>: sửa xong hết thì chạy lại <em>toàn bộ</em> ca của unit, vì debug có thể đẻ ra bug mới (“regression”). (6) <b>Coverage</b>: unit mới → <b>C0 (câu lệnh)</b> và <b>C1 (quyết định)</b>; unit sửa đổi → <b>RC0 (phủ câu lệnh đã sửa)</b>. Dưới 100 % → thêm ca cho câu lệnh/nhánh chưa chạy rồi chạy lại. Điều kiện không thể tạo ra (ví dụ hỏng phần cứng) → chứng minh bằng review code rằng code đúng, và báo cáo lý do. “Về nguyên tắc, phải đạt 100 % coverage thì test động mới được coi là xong.” So với ISTQB: 100 % decision coverage bảo đảm 100 % statement coverage, chiều ngược lại thì không (LO-4.3.3).</p>`],
      [34, '2-5 Evaluating unit testing (Japanese)',
        `${JE(35)}<p>Same as slide 35: the four conditions (a)–(d) before the leader's evaluation, then the leader's evaluation of テストケース件数 (number of test cases) and 検出されたバグの件数 (number of bugs detected).</p>`,
        `${JV(35)}<p>Giống slide 35: bốn điều kiện (a)–(d) trước khi leader đánh giá, rồi leader đánh giá テストケース件数 (số test case) và 検出されたバグの件数 (số bug phát hiện).</p>`],
      [35, '2-5 Evaluating unit testing (English)',
        `<p><b>Objective:</b> evaluate the results and verify that unit testing was done properly. (1) Before the leader looks at anything, four conditions must hold — these are the <b>exit criteria</b> of unit testing: (a) every PCL case has been run; (b) every problem in the Bug List is resolved; (c) every high-priority static-analysis violation is fixed; (d) coverage is 100 % — C0 and C1 for new units, RC0 for modified units (*1: unreachable statements/branches must be justified and verified by code review). (2) Report to the leader in the project format; the leader evaluates the <b>number of test cases and of bugs</b> against the project criteria (the densities of slide 5); if they are off, you explain why; if the leader wants more testing, you add cases and test again. Exam link: LO-5.2.3 — exit criteria typically include coverage, number of unresolved defects and completed tests.</p>`,
        `<p><b>Mục tiêu:</b> đánh giá kết quả và xác nhận việc unit test đã làm đúng. (1) Trước khi leader xem, phải thoả bốn điều kiện — đây chính là <b>tiêu chí kết thúc (exit criteria)</b> của unit test: (a) đã chạy mọi ca trong PCL; (b) mọi vấn đề trong Bug List đã được giải quyết; (c) mọi vi phạm phân tích tĩnh mức cao đã được sửa; (d) coverage 100 % — C0 và C1 với unit mới, RC0 với unit sửa đổi (*1: câu lệnh/nhánh không thể chạy tới phải được giải trình và xác nhận bằng review code). (2) Báo cáo leader theo mẫu dự án; leader đánh giá <b>số test case và số bug</b> so với tiêu chuẩn dự án (các mật độ ở slide 5); nếu lệch, bạn giải thích lý do; nếu leader muốn test thêm, bạn bổ sung ca và test lại. Liên hệ đề thi: LO-5.2.3 — exit criteria thường gồm coverage, số defect chưa giải quyết và số test đã hoàn thành.</p>`],
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
<div class="pitfall"><b>“Component testing” means two different things.</b> In ISTQB and in the lab title, <em>component testing</em> = unit testing (one method/class, by developers, with drivers and stubs). In Hitachi's process, <em>Software Component Testing</em> (組合せテスト) is the <em>next</em> level, where units are combined. If an exam question says “component testing”, use the ISTQB meaning.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Real submodules or stubs? “Classicist” vs “mockist”.</b> Slide 25 prefers already-tested real submodules over stubs. Martin Fowler's essay <em>Mocks Aren't Stubs</em> names the two schools: <em>classicists</em> test a unit together with its real collaborators when these are cheap and deterministic; <em>mockists</em> replace every collaborator with a mock (Mockito in Java) and verify the interactions. Classicist tests break less when you refactor; mockist tests pinpoint failures and run without a database. Hitachi's rule is classicist, with stubs only as a temporary measure. <em>Outside the syllabus because CTFL only defines stubs and drivers, not the design styles built on them.</em></div>`,
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
<div class="pitfall"><b>“Component testing” mang hai nghĩa.</b> Trong ISTQB và trong tên lab, <em>component testing</em> = unit test (một method/class, do developer làm, dùng driver và stub). Trong quy trình Hitachi, <em>Software Component Testing</em> (組合せテスト) là cấp <em>kế tiếp</em>, nơi các unit được ghép lại. Câu hỏi thi nói “component testing” thì dùng nghĩa của ISTQB.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Submodule thật hay stub? “Classicist” và “mockist”.</b> Slide 25 ưu tiên submodule thật đã test hơn stub. Bài viết <em>Mocks Aren't Stubs</em> của Martin Fowler gọi tên hai trường phái: <em>classicist</em> test unit cùng các cộng tác viên thật khi chúng rẻ và ổn định; <em>mockist</em> thay mọi cộng tác viên bằng mock (Mockito trong Java) và kiểm các lời gọi qua lại. Test kiểu classicist ít gãy khi refactor; test kiểu mockist chỉ đúng chỗ hỏng và chạy được không cần database. Quy tắc của Hitachi là classicist, stub chỉ là giải pháp tạm. <em>Ngoài giáo trình vì CTFL chỉ định nghĩa stub và driver, không bàn các phong cách thiết kế test dựa trên chúng.</em></div>`),
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
<div class="callout"><b>Learning objectives.</b> Read and write a matrix PCL (conditions × test cases, specific values, category letters) · derive test cases with the “basic case + change one condition” rule and explain why changing two conditions at once hides statements (LO-4.3.1/4.3.2, K2) · explain why 100 % decision coverage does not test every sub-condition of <code>a &amp;&amp; b</code> · apply boundary values to branch conditions (LO-4.2.2, K3) · list the testing concerns for submodules, configuration files, SQL, lists, client-side code and server-side validation.</div>
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
<div class="callout"><b>Chuẩn đầu ra.</b> Đọc và viết PCL ma trận (điều kiện × test case, giá trị cụ thể, chữ phân loại) · rút test case theo quy tắc “ca cơ sở + đổi một điều kiện” và giải thích vì sao đổi hai điều kiện một lúc làm sót câu lệnh (LO-4.3.1/4.3.2, K2) · giải thích vì sao 100 % decision coverage chưa test hết từng điều kiện con của <code>a &amp;&amp; b</code> · áp dụng giá trị biên cho điều kiện rẽ nhánh (LO-4.2.2, K3) · kể được các testing concern cho submodule, file cấu hình, SQL, danh sách, code phía client và kiểm tra phía server.</div>
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
        `${JE(37)}<p>“3. PCLの作成方法” — “3. How to create PCLs”.</p>`,
        `${JV(37)}<p>“3. PCLの作成方法” — “3. Cách tạo PCL”.</p>`],
      [37, 'Section 3: Creating PCLs',
        `<p>Divider for chapter 3: 3-1 format, 3-2 input conditions and expected results, 3-3 testing concerns, 3-4 creating test cases.</p>`,
        `<p>Trang ngăn chương 3: 3-1 định dạng, 3-2 điều kiện đầu vào và kết quả mong đợi, 3-3 testing concern, 3-4 tạo test case.</p>`],
      [38, '3-1 PCL format (Japanese matrix)',
        `${JE(39)}<p>The same matrix with Japanese labels: <b>テストケースID</b> (test case ID), <b>テストケース説明</b> (description), <b>入力条件 / 確認内容</b> (input conditions / expected results — literally “items to confirm”), 【引数a】 (parameter a), 代表値 (typical value), 処理A境界値 (boundary for statements A), 戻り値 (return value), 例外 (exception), <b>チェック観点ID</b> (testing-concern ID), <b>CL区分</b> (checklist category). Description row: 基本ケース (basic case), aの境界値 (boundary of a), bの境界値 (boundary of b). Legend: N 正常系 normal · E 異常系 error · L 境界値 boundary · I インタフェース interface. Red label: “this guide recommends the matrix checklist for F/D-layer tests; if you use another format, the project must provide it”.</p>`,
        `${JV(39)}<p>Cùng ma trận nhưng nhãn tiếng Nhật: <b>テストケースID</b> (mã test case), <b>テストケース説明</b> (mô tả), <b>入力条件 / 確認内容</b> (điều kiện đầu vào / kết quả mong đợi — nghĩa đen “nội dung cần xác nhận”), 【引数a】 (tham số a), 代表値 (giá trị điển hình), 処理A境界値 (biên để vào xử lý A), 戻り値 (giá trị trả về), 例外 (exception), <b>チェック観点ID</b> (mã testing concern), <b>CL区分</b> (phân loại checklist). Dòng mô tả: 基本ケース (ca cơ sở), aの境界値 (biên của a), bの境界値 (biên của b). Chú giải: N 正常系 bình thường · E 異常系 lỗi · L 境界値 biên · I インタフェース giao diện. Nhãn đỏ: “bộ hướng dẫn khuyến nghị dùng checklist ma trận cho test lớp F/D; nếu dùng dạng khác thì dự án phải tự cung cấp”.</p>`],
      [39, '3-1 PCL format (English matrix)',
        `<p>The most important picture of Lab 2 — your template (L2.8) is the same idea. <b>Each column is one test case</b>: ID on top (0001-01-0010 … 0050), a short description of its testing concern, an “o” on every input row it uses and on the expected-result row(s) it must produce, and its category at the bottom. <b>Each row is one specific value.</b> Reading the five columns:</p>
<div class="table-wrap"><table><thead><tr><th>ID</th><th>Concern</th><th>a</th><th>b</th><th>Expected</th><th>Category</th></tr></thead><tbody>
<tr><td>0010</td><td>basic case</td><td>5 (typical)</td><td>10 (typical)</td><td>return 2</td><td>N</td></tr>
<tr><td>0020</td><td>boundary a</td><td>1 (lowest value into A)</td><td>10</td><td>return 10</td><td>N L</td></tr>
<tr><td>0030</td><td>boundary a</td><td>0 (goes to B)</td><td>10</td><td>IllegalArgumentException</td><td>E L</td></tr>
<tr><td>0040</td><td>boundary b</td><td>5</td><td>0 (lowest into C)</td><td>return 0</td><td>N L</td></tr>
<tr><td>0050</td><td>boundary b</td><td>5</td><td>−1 (goes to D)</td><td>IllegalArgumentException</td><td>E L</td></tr>
</tbody></table></div>
<p>The values fit the function <em>b ÷ a</em> with a &gt; 0 and b ≥ 0 required — it is re-created and run in the worked example below. Callouts: give every case a <b>unique ID</b>; <b>list specific values</b> (never “a positive number”); describe the concern briefly; mark categories (N, E, L, I — several letters may combine, e.g. NL). The matrix makes gaps visible: an input row with no “o”, or two columns with identical “o” patterns, jumps out.</p>`,
        `<p>Hình quan trọng nhất của Lab 2 — template của bạn (bài L2.8) dùng đúng ý này. <b>Mỗi cột là một test case</b>: mã ở trên (0001-01-0010 … 0050), mô tả ngắn testing concern, dấu “o” ở mọi dòng đầu vào nó dùng và ở (các) dòng kết quả mong đợi nó phải cho ra, và phân loại ở dưới cùng. <b>Mỗi dòng là một giá trị cụ thể.</b> Đọc năm cột:</p>
<div class="table-wrap"><table><thead><tr><th>ID</th><th>Concern</th><th>a</th><th>b</th><th>Mong đợi</th><th>Loại</th></tr></thead><tbody>
<tr><td>0010</td><td>ca cơ sở</td><td>5 (điển hình)</td><td>10 (điển hình)</td><td>trả về 2</td><td>N</td></tr>
<tr><td>0020</td><td>biên a</td><td>1 (giá trị nhỏ nhất vào A)</td><td>10</td><td>trả về 10</td><td>N L</td></tr>
<tr><td>0030</td><td>biên a</td><td>0 (rẽ sang B)</td><td>10</td><td>IllegalArgumentException</td><td>E L</td></tr>
<tr><td>0040</td><td>biên b</td><td>5</td><td>0 (nhỏ nhất vào C)</td><td>trả về 0</td><td>N L</td></tr>
<tr><td>0050</td><td>biên b</td><td>5</td><td>−1 (rẽ sang D)</td><td>IllegalArgumentException</td><td>E L</td></tr>
</tbody></table></div>
<p>Các giá trị khớp với hàm <em>b ÷ a</em> yêu cầu a &gt; 0 và b ≥ 0 — hàm này được dựng lại và chạy thật trong ví dụ có lời giải bên dưới. Các chú thích: mỗi ca một <b>mã duy nhất</b>; <b>ghi giá trị cụ thể</b> (không bao giờ ghi “một số dương”); mô tả concern ngắn gọn; ghi phân loại (N, E, L, I — có thể ghép nhiều chữ, ví dụ NL). Ma trận làm lộ lỗ hổng: một dòng đầu vào không có “o”, hay hai cột có mẫu “o” giống hệt nhau, nhìn là thấy ngay.</p>`],
      [40, '3-2 Input conditions and expected results (Japanese)',
        `${JE(41)}<p>Same rules as slide 41. The Japanese list numbers the input items (1)(2)(2)(3)(4) — a typo in the original (the English twin correctly has five items (1)–(5)).</p>`,
        `${JV(41)}<p>Quy tắc giống slide 41. Danh sách tiếng Nhật đánh số các mục đầu vào là (1)(2)(2)(3)(4) — lỗi đánh máy của bản gốc (bản tiếng Anh đánh đúng năm mục (1)–(5)).</p>`],
      [41, '3-2 Input conditions and expected results (English)',
        `<p>A subtle but essential rule. You <em>design</em> unit tests by looking at internal logic (white-box thinking), yet you must <b>write</b> inputs and expected results only in terms of things that can be <b>set or observed from outside</b> the unit: input = the state <u>before</u> execution, expected = the state <u>after</u> execution. Never write a condition on a local variable or on a state in the middle of execution, and (*1) never change variables with a debugger during a test run — if a case truly cannot run without a debugger, get the leader's approval. <b>Inputs:</b> input parameters, screen input items, database content, input files, configuration files. <b>Expected results:</b> output values, screen output items, <b>thrown exceptions and error codes</b>, database content, output files (including printed forms). This is why the template has rows for Precondition (DB/file state) and for Exception and Log message — not just parameters and return value.</p>`,
        `<p>Một quy tắc tinh tế nhưng cốt yếu. Bạn <em>thiết kế</em> unit test bằng cách nhìn logic bên trong (tư duy white-box), nhưng phải <b>viết</b> đầu vào và kết quả mong đợi chỉ bằng những thứ <b>đặt được hoặc quan sát được từ bên ngoài</b> unit: đầu vào = trạng thái <u>trước</u> khi chạy, mong đợi = trạng thái <u>sau</u> khi chạy. Không bao giờ ghi điều kiện trên biến cục bộ hay trạng thái giữa chừng, và (*1) không bao giờ dùng debugger đổi giá trị biến khi đang chạy test — nếu một ca thật sự không chạy được nếu thiếu debugger thì phải xin phép leader. <b>Đầu vào:</b> tham số, mục nhập trên màn hình, nội dung database, file input, file cấu hình. <b>Kết quả mong đợi:</b> giá trị output, mục hiển thị trên màn hình, <b>exception và mã lỗi được ném ra</b>, nội dung database, file output (kể cả biểu mẫu in). Vì vậy template có dòng Precondition (trạng thái DB/file) và dòng Exception, Log message — không chỉ tham số và giá trị trả về.</p>`],
      [42, '3-3 Testing concerns (Japanese)',
        `${JE(43)}<p>The same 15-row table (分類 category, 観点 concern, 確認 check). Categories in Japanese: 全体 generic, 分岐条件 branch conditions, ループ条件 loop conditions, 入出力値 input/output values, サブモジュール呼出 calling submodules, エラー処理 error handling, SQL, 日付 dates, 設定ファイル configuration file, 帳票出力 business-form output. Red label: “customise for your project; the concerns to consult are available on the <em>Quality Management Guideline – Application edition</em> website” (Hitachi internal).</p>`,
        `${JV(43)}<p>Cùng bảng 15 dòng (分類 nhóm, 観点 quan điểm, 確認 cột đánh dấu). Tên nhóm tiếng Nhật: 全体 chung, 分岐条件 điều kiện rẽ nhánh, ループ条件 điều kiện vòng lặp, 入出力値 giá trị vào/ra, サブモジュール呼出 gọi submodule, エラー処理 xử lý lỗi, SQL, 日付 ngày tháng, 設定ファイル file cấu hình, 帳票出力 xuất biểu mẫu. Nhãn đỏ: “tuỳ biến theo dự án; bộ quan điểm tham khảo lấy trên website <em>Quality Management Guideline – Application edition</em>” (nội bộ Hitachi).</p>`],
      [43, '3-3 Testing concerns for unit testing (English)',
        `<p>Fifteen concerns — a checklist to run over your PCL before review: <b>1–3 Generic:</b> C0 = 100 %, C1 = 100 %, RC0 = 100 % for modifications. <b>4 Branch conditions:</b> numeric conditions need boundary values, not only typical ones. <b>5:</b> multiple sub-conditions → check each one, not only the decision. <b>6 Loops:</b> check the end-of-loop condition and the number of iterations through the output. <b>7 Input/output:</b> special values — max, min, limit, zero, negative, null, illegal format. <b>8:</b> lists → 0, 1 and many elements. <b>9 Submodules:</b> normal return values and every exception the unit handles. <b>10 Error handling:</b> check the exception class and error code. <b>11 SQL:</b> SQL injection countermeasures when the unit builds SQL. <b>12 Dates:</b> 29 February, daylight-saving switch days. <b>13:</b> time spans over 24 hours. <b>14 Configuration files:</b> file missing, key or value missing. <b>15 Business forms:</b> correct page breaks. (The picture is cut after row 14; row 15 is in the file.) Items 4, 7 and 8 are EP/BVA (Chapter 4); 1, 2, 5 are white-box coverage; the rest is checklist-based testing (LO-4.4.3).</p>`,
        `<p>Mười lăm quan điểm — một checklist để rà PCL trước khi review: <b>1–3 Chung:</b> C0 = 100 %, C1 = 100 %, RC0 = 100 % khi sửa đổi. <b>4 Điều kiện rẽ nhánh:</b> điều kiện số phải thử giá trị biên, không chỉ giá trị điển hình. <b>5:</b> nhiều điều kiện con → kiểm từng cái, không chỉ kết quả chung. <b>6 Vòng lặp:</b> kiểm điều kiện kết thúc vòng lặp và số lần lặp qua output. <b>7 Vào/ra:</b> giá trị đặc biệt — max, min, giới hạn, 0, số âm, null, sai định dạng. <b>8:</b> danh sách → 0, 1 và nhiều phần tử. <b>9 Submodule:</b> giá trị trả về bình thường và mọi exception unit có xử lý. <b>10 Xử lý lỗi:</b> kiểm lớp exception và mã lỗi. <b>11 SQL:</b> biện pháp chống SQL injection khi unit tự dựng câu SQL. <b>12 Ngày:</b> 29/2, ngày chuyển giờ mùa hè. <b>13:</b> khoảng thời gian trên 24 giờ. <b>14 File cấu hình:</b> thiếu file, thiếu khoá hay giá trị. <b>15 Biểu mẫu:</b> ngắt trang đúng. (Hình bị cắt sau dòng 14; dòng 15 có trong file.) Mục 4, 7, 8 là EP/BVA (Chương 4); 1, 2, 5 là coverage white-box; phần còn lại là checklist-based testing (LO-4.4.3).</p>`],
      [44, '3-3 Testing concerns — presentation layer (Japanese)',
        `${JE(45)}<p>Same ten rows as slide 45: 画面設計 screen design, 境界値・限界値 boundary/limit values, 文字エンコーディング character encoding, 入力チェック input check, クライアントサイドプログラム client-side programs, セキュリティ security. Only “PCL”, “HTML” and “Cookie” survived in the picture.</p>`,
        `${JV(45)}<p>Mười dòng giống slide 45: 画面設計 thiết kế màn hình, 境界値・限界値 giá trị biên/giới hạn, 文字エンコーディング mã hoá ký tự, 入力チェック kiểm tra đầu vào, クライアントサイドプログラム chương trình phía client, セキュリティ bảo mật. Trong ảnh chỉ còn “PCL”, “HTML” và “Cookie”.</p>`],
      [45, '3-3 Testing concerns — presentation layer (English)',
        `<p>Ten extra concerns for P-layer units: (1) layout and items match the Screen Design; (2) boundary of the number of list rows shown per page; (3) boundary of the displayed length of items; (4) correct character encoding, no garbled text (mojibake); (5) <b>input is verified on the server too</b>, not only in the browser (see slide 67); (6) client-side programs have their own PCLs; (7) with scripts disabled the screen still works or tells the user to enable them; (8) HTML tags are rejected or sanitised (XSS); (9) double-clicking submit does not create or update data twice; (10) confidential user data never appears in HTML source or cookies. Items 8–10 are security testing done at unit level — cheap and very effective.</p>`,
        `<p>Mười quan điểm thêm cho unit lớp P: (1) bố cục và các mục khớp Screen Design; (2) biên của số dòng danh sách hiển thị trên một trang; (3) biên của độ dài hiển thị của các mục; (4) đúng mã hoá ký tự, không lỗi font (mojibake); (5) <b>đầu vào được kiểm cả ở server</b>, không chỉ ở trình duyệt (xem slide 67); (6) chương trình phía client có PCL riêng; (7) khi tắt script, màn hình vẫn dùng được hoặc báo người dùng bật lên; (8) thẻ HTML bị chặn hoặc được làm sạch (XSS); (9) bấm đúp nút submit không tạo/cập nhật dữ liệu hai lần; (10) dữ liệu bí mật của người dùng không xuất hiện trong mã HTML hay cookie. Mục 8–10 là kiểm thử bảo mật làm ngay ở cấp unit — rẻ mà rất hiệu quả.</p>`],
      [46, '3-4 Creating test cases (1) (Japanese)',
        `${JE(47)}<p>手順1 (Step 1): basic case = all inputs typical, normal result. 手順2 (Step 2): each other case changes <b>only one</b> input condition from the basic case, so it is clear which input caused the result. Balloons: 条件1の境界値を確認 (check the boundary of condition 1), 条件2を確認 (check condition 2), 他の条件は固定 (keep the other conditions fixed). Flowchart labels 処理A–D = statements A–D.</p>`,
        `${JV(47)}<p>手順1 (Bước 1): ca cơ sở = mọi đầu vào điển hình, kết quả bình thường. 手順2 (Bước 2): mỗi ca khác chỉ đổi <b>một</b> điều kiện đầu vào so với ca cơ sở, để biết rõ đầu vào nào gây ra kết quả. Bóng chữ: 条件1の境界値を確認 (kiểm biên của điều kiện 1), 条件2を確認 (kiểm điều kiện 2), 他の条件は固定 (giữ nguyên các điều kiện khác). Nhãn lưu đồ 処理A–D = xử lý A–D.</p>`],
      [47, '3-4 Creating test cases (1): basic case + change one condition',
        `<p>The flowchart: <em>Start → Cond. 1 (a &gt; 0)? yes → Statements A → Cond. 2 (b ≥ 0)? yes → Statements C / no → Statements D → End; Cond. 1 no → Statements B → End.</em> <b>Step 1</b> — case (1), the basic case a = 5, b = 10: typical values, normal result (yellow path through A and C). <b>Step 2</b> — every other case changes <em>one</em> input from the basic case: (2) a = 1 and (3) a = 0 test the boundary of condition 1 (b stays 10); (4) b = 0 and (5) b = −1 test the boundary of condition 2 (a stays 5). Why one at a time? If a case fails, you know which input caused it; and — slide 49 — changing two inputs at once can make a branch disappear from your tests. Coloured paths: (1)(2)(4) go A→C, (3) goes B, (5) goes A→D. All four statement blocks and both outcomes of both decisions are covered by five cases.</p>`,
        `<p>Lưu đồ: <em>Start → Điều kiện 1 (a &gt; 0)? đúng → Xử lý A → Điều kiện 2 (b ≥ 0)? đúng → Xử lý C / sai → Xử lý D → End; Điều kiện 1 sai → Xử lý B → End.</em> <b>Bước 1</b> — ca (1), ca cơ sở a = 5, b = 10: giá trị điển hình, kết quả bình thường (đường vàng qua A và C). <b>Bước 2</b> — mỗi ca khác đổi <em>một</em> đầu vào so với ca cơ sở: (2) a = 1 và (3) a = 0 thử biên của điều kiện 1 (b giữ 10); (4) b = 0 và (5) b = −1 thử biên của điều kiện 2 (a giữ 5). Vì sao đổi từng cái? Nếu ca fail, bạn biết đầu vào nào gây ra; và — slide 49 — đổi hai đầu vào một lúc có thể làm một nhánh biến mất khỏi bộ test. Các đường màu: (1)(2)(4) đi A→C, (3) đi B, (5) đi A→D. Năm ca phủ cả bốn khối xử lý và cả hai kết quả của cả hai quyết định.</p>`],
      [48, '3-4 Creating test cases (2) (Japanese)',
        `${JE(49)}<p>手順２のルールに違反すると、テスト漏れが発生しやすくなります — “violating the rule of step 2 easily causes test omissions (テスト漏れ)”. Red banner 違反例 = “example of a violation”; balloon: 1件のテストケースで複数の条件を変更しないこと — “do not change several conditions in one test case”.</p>`,
        `${JV(49)}<p>手順２のルールに違反すると、テスト漏れが発生しやすくなります — “vi phạm quy tắc bước 2 rất dễ gây sót test (テスト漏れ)”. Băng đỏ 違反例 = “ví dụ vi phạm”; bóng chữ: 1件のテストケースで複数の条件を変更しないこと — “không đổi nhiều điều kiện trong một test case”.</p>`],
      [49, '3-4 Creating test cases (2): the improper example',
        `<p>Only three cases: (1) basic a = 5, b = 10; (2) a = 1 <em>and</em> b = 0; (3) a = 0 <em>and</em> b = −1. Each of (2) and (3) changes two conditions. Case (3) never reaches condition 2 because a = 0 sends it to B, so its b = −1 is wasted — and <b>Statements D is “Not tested”</b> (red dashed circle). Three cases look economical but leave a statement and a decision outcome uncovered; the worked example below shows JaCoCo reporting exactly this (6/7 lines, 3/4 branches).</p>`,
        `<p>Chỉ ba ca: (1) cơ sở a = 5, b = 10; (2) a = 1 <em>và</em> b = 0; (3) a = 0 <em>và</em> b = −1. Ca (2) và (3) mỗi ca đổi hai điều kiện. Ca (3) không bao giờ tới được điều kiện 2 vì a = 0 đẩy nó sang B, nên b = −1 bị lãng phí — và <b>Xử lý D “Not tested”</b> (vòng đỏ nét đứt). Ba ca trông tiết kiệm nhưng bỏ sót một câu lệnh và một kết quả quyết định; ví dụ có lời giải bên dưới cho thấy JaCoCo báo đúng như vậy (6/7 dòng, 3/4 nhánh).</p>`],
      [50, '3-4 Creating test cases (3) (Japanese)',
        `${JE(51)}<p>手順3 (Step 3): add cases for processing that depends on several input conditions, changing only the conditions it depends on (cases (4)(5)). Balloons: 手順1,2によって作成したテストケースでは、条件2を確認できない — “the cases made by steps 1 and 2 cannot check condition 2”; a=0 に固定し、bを変えて条件2を確認 — “fix a = 0 and vary b to check condition 2”.</p>`,
        `${JV(51)}<p>手順3 (Bước 3): thêm ca cho xử lý phụ thuộc nhiều điều kiện đầu vào, chỉ đổi những điều kiện nó phụ thuộc (ca (4)(5)). Bóng chữ: 手順1,2によって作成したテストケースでは、条件2を確認できない — “các ca tạo bằng bước 1, 2 không kiểm được điều kiện 2”; a=0 に固定し、bを変えて条件2を確認 — “cố định a = 0 và đổi b để kiểm điều kiện 2”.</p>`],
      [51, '3-4 Creating test cases (3): dependent conditions',
        `<p>A different flowchart: now condition 2 sits <em>inside the “no” branch</em> of condition 1 (Cond. 1 a &gt; 0: yes → A → End; no → B → Cond. 2 b ≥ 0 → C or D). The basic case a = 5 never reaches condition 2, so varying b from the basic case (step 2) proves nothing. <b>Step 3</b>: for statements that depend on several conditions, change <em>only the relevant inputs</em>: fix a = 0 and vary b — (4) b = 0 → B, C and (5) b = −1 → B, D. Summary sentence: through steps 1–3 “each statement and branch is executed in at least one test case” — i.e. C0 = C1 = 100 %.</p>`,
        `<p>Một lưu đồ khác: giờ điều kiện 2 nằm <em>bên trong nhánh “sai”</em> của điều kiện 1 (Điều kiện 1 a &gt; 0: đúng → A → End; sai → B → Điều kiện 2 b ≥ 0 → C hoặc D). Ca cơ sở a = 5 không bao giờ tới điều kiện 2, nên đổi b từ ca cơ sở (bước 2) chẳng chứng minh được gì. <b>Bước 3</b>: với câu lệnh phụ thuộc nhiều điều kiện, chỉ đổi <em>những đầu vào liên quan</em>: cố định a = 0 và đổi b — (4) b = 0 → B, C và (5) b = −1 → B, D. Câu tổng kết: qua bước 1–3, “mỗi câu lệnh và mỗi nhánh được chạy trong ít nhất một test case” — tức C0 = C1 = 100 %.</p>`],
      [52, '3-4 Creating test cases (4) (Japanese)',
        `${JE(53)}<p>複数条件からなる分岐条件がある場合、分岐の判定結果だけでなく、分岐を構成する個々の条件も確認してください — same rule as slide 53. Balloons: 条件1の確認でC1カバレージは100%になるが、条件2を確認していない (“checking condition 1 already gives C1 = 100 %, but condition 2 is not checked”) and 他の条件も必ず確認する (“always check the other conditions too”).</p>`,
        `${JV(53)}<p>複数条件からなる分岐条件がある場合、分岐の判定結果だけでなく、分岐を構成する個々の条件も確認してください — quy tắc giống slide 53. Bóng chữ: 条件1の確認でC1カバレージは100%になるが、条件2を確認していない (“chỉ kiểm điều kiện 1 là đã đạt C1 = 100 %, nhưng điều kiện 2 chưa được kiểm”) và 他の条件も必ず確認する (“luôn kiểm cả các điều kiện khác”).</p>`],
      [53, '3-4 Creating test cases (4): compound conditions',
        `<p>One decision <code>a &gt; 0 &amp;&amp; b &gt;= 0</code> → A (true) or B (false). Cases (1) a = 5, b = 10 (true) and (2) a = 0, b = 10 (false) already give <b>100 % C1</b>, yet condition 2 was never false — a bug such as <code>b &gt; 0</code> instead of <code>b &gt;= 0</code> would slip through. The truth table shows four combinations: (1) T,T → True; (2) F,T → False; (3) T,F → False; (4) F,F → False; the test-case descriptions read “a normal b normal / a error b normal / a normal b error / a error b error”. Rule: <b>check each sub-condition, not only the decision</b> (concern 5 on slide 43). ISTQB note: this goes beyond decision coverage towards <em>condition coverage</em>; in Java, <code>&amp;&amp;</code> short-circuits, so in case (4) b is never evaluated — cases (1)(2)(3) are enough to show each condition deciding the outcome. JaCoCo counts each operand of <code>&amp;&amp;</code>/<code>||</code> as separate branches, so a tool report enforces this rule automatically (see L2.6).</p>`,
        `<p>Một quyết định <code>a &gt; 0 &amp;&amp; b &gt;= 0</code> → A (đúng) hoặc B (sai). Ca (1) a = 5, b = 10 (đúng) và (2) a = 0, b = 10 (sai) đã cho <b>C1 = 100 %</b>, nhưng điều kiện 2 chưa từng sai — một bug kiểu <code>b &gt; 0</code> thay vì <code>b &gt;= 0</code> sẽ lọt qua. Bảng chân trị có bốn tổ hợp: (1) Đ,Đ → Đúng; (2) S,Đ → Sai; (3) Đ,S → Sai; (4) S,S → Sai; mô tả các ca là “a normal b normal / a error b normal / a normal b error / a error b error”. Quy tắc: <b>kiểm từng điều kiện con, không chỉ kết quả chung</b> (concern 5 ở slide 43). Ghi chú ISTQB: việc này vượt quá decision coverage, hướng tới <em>condition coverage</em>; trong Java, <code>&amp;&amp;</code> đoản mạch nên ở ca (4) b không hề được tính — ba ca (1)(2)(3) đủ để thấy từng điều kiện quyết định kết quả. JaCoCo đếm mỗi vế của <code>&amp;&amp;</code>/<code>||</code> là nhánh riêng, nên báo cáo công cụ tự động ép quy tắc này (xem bài L2.6).</p>`],
      [54, 'Section 4 divider (Japanese)',
        `${JE(55)}<p>“4. PCL作成時の留意点” — points to note when creating PCLs. Sub-text: “in addition to chapter 3, note the concerns in this chapter”; red label: “customise this section for your project”.</p>`,
        `${JV(55)}<p>“4. PCL作成時の留意点” — các điểm lưu ý khi tạo PCL. Dòng phụ: “ngoài chương 3, hãy lưu ý các quan điểm trong chương này”; nhãn đỏ: “tuỳ biến mục này theo dự án”.</p>`],
      [55, 'Section 4: Points to Note When Creating PCLs',
        `<p>Six situations follow (4-1 … 4-6), each shown as <em>Design → PCL</em>: what the design says and which rows/columns it must produce in the PCL.</p>`,
        `<p>Tiếp theo là sáu tình huống (4-1 … 4-6), mỗi tình huống vẽ theo kiểu <em>Design → PCL</em>: thiết kế nói gì và nó phải sinh ra những dòng/cột nào trong PCL.</p>`],
      [56, '4-1 Calling submodules (Japanese)',
        `${JE(57)}<p>対象ソフトウェアユニットから別のソフトウェアユニットを呼び出す場合、正常系と、ハンドリングされる全ての異常系をテストしてください — same rule as slide 57. PCL rows in Japanese: サブモジュール呼出し (submodule call), 指定項目がDBに存在しない（〇〇〇Exception発生） (specified item not in DB → ○○○Exception), 参照される項目がDBに存在しない（△△△Exception発生） (referenced item not in DB → △△△Exception), 値が全て正常 (all values valid) / 異常値が存在 (an invalid value exists).</p>`,
        `${JV(57)}<p>対象ソフトウェアユニットから別のソフトウェアユニットを呼び出す場合、正常系と、ハンドリングされる全ての異常系をテストしてください — quy tắc giống slide 57. Các dòng PCL tiếng Nhật: サブモジュール呼出し (gọi submodule), 指定項目がDBに存在しない（〇〇〇Exception発生） (mục chỉ định không có trong DB → ○○○Exception), 参照される項目がDBに存在しない（△△△Exception発生） (mục tham chiếu không có trong DB → △△△Exception), 値が全て正常 (mọi giá trị hợp lệ) / 異常値が存在 (có giá trị không hợp lệ).</p>`],
      [57, '4-1 Calling submodules (English)',
        `<p>The sequence diagram: the caller (the unit under test) sends IN to the callee; the callee returns OUT normally, or throws Exception A or Exception B. The PCL must contain <b>the normal return values and every exception the caller handles</b>. In the example the callee is <code>ItemSetF.checkItem</code>: a sub-routine-condition block with four rows — specified item missing in DB (○○○Exception), related item missing (△△△Exception), all values valid (CheckResult true), an invalid value (CheckResult false) — and columns basic case, Application Exception ×2, checkItem false. In JUnit you produce these outcomes with a stub or mock of the callee (or real DB data, as slide 25 prefers). This is the <em>I</em> (interface) category of the appendix.</p>`,
        `<p>Sơ đồ tuần tự: bên gọi (unit đang test) gửi IN cho bên bị gọi; bên bị gọi trả OUT bình thường, hoặc ném Exception A, Exception B. PCL phải có <b>các giá trị trả về bình thường và mọi exception bên gọi có xử lý</b>. Trong ví dụ bên bị gọi là <code>ItemSetF.checkItem</code>: một khối sub-routine condition bốn dòng — mục chỉ định không có trong DB (○○○Exception), mục liên quan không có (△△△Exception), mọi giá trị hợp lệ (CheckResult true), có giá trị không hợp lệ (CheckResult false) — và các cột basic case, Application Exception ×2, checkItem false. Trong JUnit bạn tạo ra các kết quả này bằng stub hay mock của bên bị gọi (hoặc dữ liệu DB thật, như slide 25 ưu tiên). Đây là loại <em>I</em> (interface) trong phụ lục.</p>`],
      [58, '4-2 Retrieving a value from a configuration file (Japanese)',
        `${JE(59)}<p>設定ファイルから値を取得する場合には、正常なケースに加えて異常ケースもテストしてください — test abnormal cases as well. The four cases: (1) 設定ファイルがない (file missing), (2) 設定項目がない (key missing), (3) 設定値が空文字 (value is an empty string), (4) 異常な値 (illegal value). PCL label: 設定ファイル異常の確認 (checking configuration-file errors).</p>`,
        `${JV(59)}<p>設定ファイルから値を取得する場合には、正常なケースに加えて異常ケースもテストしてください — phải test cả ca bất thường. Bốn ca: (1) 設定ファイルがない (không có file), (2) 設定項目がない (không có khoá), (3) 設定値が空文字 (giá trị là chuỗi rỗng), (4) 異常な値 (giá trị bất thường). Nhãn PCL: 設定ファイル異常の確認 (kiểm lỗi file cấu hình).</p>`],
      [59, '4-2 Retrieving a value from a configuration file (English)',
        `<p>For the key <code>APND_FILE_SPLT_SIZE</code> (appended-file split size) the PCL has five input rows: configuration file does not exist · key does not exist (greyed line) · blank value (<code>APND_FILE_SPLT_SIZE=</code>) · <code>xyz</code> (non-digit) · <code>1024000</code> (valid) — and columns Basic case, Application Exception and System Exception cases. Your SWP391 equivalent: <code>application.properties</code> or <code>.env</code> values. A missing or empty setting is one of the most common production failures, and it is invisible to tests that always run with a correct file.</p>`,
        `<p>Với khoá <code>APND_FILE_SPLT_SIZE</code> (kích thước chia file đính kèm), PCL có năm dòng đầu vào: không có file cấu hình · không có khoá (dòng mờ) · giá trị trống (<code>APND_FILE_SPLT_SIZE=</code>) · <code>xyz</code> (không phải số) · <code>1024000</code> (hợp lệ) — và các cột Basic case, Application Exception, System Exception. Tương đương trong dự án SWP391: giá trị trong <code>application.properties</code> hay <code>.env</code>. Cấu hình thiếu hoặc rỗng là một trong những lỗi production phổ biến nhất, và test nào cũng chạy với file đúng thì không bao giờ thấy nó.</p>`],
      [60, '4-3 Executing SQL statements (Japanese)',
        `${JE(61)}<p>Same as slide 61. The design excerpt is Japanese: 3.2 検索・ソート条件の作成 (creating search and sort conditions): 3.2.1 declare local variable whereString = “WEEA01.PJ_CD=”; 3.2.2 declare sanitizedPjCd — the Project Code with “'” replaced by “''”; 3.2.3 append it; 3.2.4 append “ AND ”; 3.2.5 append “WEE2A02D.DELETE_KEY = '0'”; 3.2.6 append “ ORDER BY ”; 3.2.7 append the SortKey argument. Right-hand notes: “even if not written in the DD, check the project's SQL concerns: SQL-injection countermeasures (values with special characters such as ') and search conditions using %”.</p>`,
        `${JV(61)}<p>Giống slide 61. Đoạn thiết kế bằng tiếng Nhật: 3.2 検索・ソート条件の作成 (tạo điều kiện tìm kiếm và sắp xếp): 3.2.1 khai báo biến cục bộ whereString = “WEEA01.PJ_CD=”; 3.2.2 khai báo sanitizedPjCd — Project Code đã thay “'” bằng “''”; 3.2.3 nối nó vào; 3.2.4 nối “ AND ”; 3.2.5 nối “WEE2A02D.DELETE_KEY = '0'”; 3.2.6 nối “ ORDER BY ”; 3.2.7 nối tham số SortKey. Ghi chú bên phải: “kể cả khi DD không ghi, vẫn phải kiểm các quan điểm SQL của dự án: chống SQL injection (giá trị có ký tự đặc biệt như ') và điều kiện tìm kiếm dùng %”.</p>`],
      [61, '4-3 Executing SQL statements (English)',
        `<p>When a unit <em>builds</em> SQL, write cases that prove the SQL is executed as designed — the red arrows link each design line to PCL rows: ProjectCode “only alphabets” (ABC) and “including a single quotation” (AB'C) for the escaping step 3.2.2; SortKey “INVNTRY_ID ASC” and “INVNTRY_NM DESC” for step 3.2.7. Plus, even if the DD is silent: <b>SQL-injection countermeasures</b> (values containing <code>'</code>) and <b>search conditions with %</b> (does “50%” search for the literal character or match everything?). Note that appending SortKey unescaped (3.2.7) is itself an injection risk — exactly what such a test exposes. Modern code uses <code>PreparedStatement</code> parameters, but ORDER BY columns cannot be bound, so a whitelist test is still needed.</p>`,
        `<p>Khi unit <em>tự dựng</em> câu SQL, hãy viết ca chứng minh SQL chạy đúng thiết kế — các mũi tên đỏ nối từng dòng thiết kế với dòng PCL: ProjectCode “chỉ chữ cái” (ABC) và “có dấu nháy đơn” (AB'C) cho bước escape 3.2.2; SortKey “INVNTRY_ID ASC” và “INVNTRY_NM DESC” cho bước 3.2.7. Thêm nữa, kể cả khi DD không nói: <b>chống SQL injection</b> (giá trị chứa <code>'</code>) và <b>điều kiện tìm kiếm có %</b> (“50%” là tìm đúng ký tự % hay khớp tất cả?). Để ý: nối SortKey mà không escape (3.2.7) tự nó đã là rủi ro injection — đúng thứ mà một ca test như vậy làm lộ ra. Code hiện đại dùng tham số <code>PreparedStatement</code>, nhưng cột ORDER BY không bind được, nên vẫn cần test danh sách trắng (whitelist).</p>`],
      [62, '4-4 List items in input or output (Japanese)',
        `${JE(63)}<p>入力項目に繰返し項目がある場合、要素数0件/1件/複数件 — for repeated items in input (and output), cases with 0 / 1 / several elements; with several lists, separate cases for each list. Balloon: それぞれのリストで0件・1件・複数件をチェック. Design labels: 【添付登録削除リスト】 (appended-file add/delete list), 添付ファイル名称 (file name), 添付サイズ (size), 楽観排他キー (optimistic-lock key), ファイル操作フラグ (file-operation flag), 【添付登録削除URLリスト】 (URL list).</p>`,
        `${JV(63)}<p>入力項目に繰返し項目がある場合、要素数0件/1件/複数件 — với mục lặp lại trong đầu vào (và đầu ra), có ca 0 / 1 / nhiều phần tử; nhiều danh sách thì mỗi danh sách có ca riêng. Bóng chữ: それぞれのリストで0件・1件・複数件をチェック. Nhãn thiết kế: 【添付登録削除リスト】 (danh sách thêm/xoá file đính kèm), 添付ファイル名称 (tên file), 添付サイズ (kích thước), 楽観排他キー (khoá khoá lạc quan), ファイル操作フラグ (cờ thao tác file), 【添付登録削除URLリスト】 (danh sách URL).</p>`],
      [63, '4-4 List items in input or output (English)',
        `<p>If an input contains a list, write cases where the list has <b>zero, one and many</b> elements; the same for a list in the output; and with two lists (here the appended-file list and the appended-URL list) write <b>separate</b> cases for each so that one list's result is not hidden by the other. The PCL rows show counts such as “the number of deleted items (flag DELETE): 0 / 1 / 2”, “the number of blank items”, “the number of inserted items”. Zero–one–many is boundary value analysis applied to collection sizes; empty lists and single-element lists are where loops and <code>get(0)</code> calls break.</p>`,
        `<p>Nếu đầu vào có danh sách, hãy viết ca danh sách có <b>0, 1 và nhiều</b> phần tử; tương tự với danh sách trong đầu ra; và khi có hai danh sách (ở đây danh sách file đính kèm và danh sách URL đính kèm) thì viết ca <b>riêng</b> cho từng cái để kết quả danh sách này không che mất danh sách kia. Các dòng PCL ghi số lượng như “số mục bị xoá (cờ DELETE): 0 / 1 / 2”, “số mục trống”, “số mục được thêm”. 0–1–nhiều chính là phân tích giá trị biên áp dụng cho kích thước tập hợp; danh sách rỗng và danh sách một phần tử là chỗ vòng lặp và lời gọi <code>get(0)</code> hay gãy.</p>`],
      [64, '4-5 Client-side programs (Japanese)',
        `${JE(65)}<p>Same as slide 65: JavaScriptなど、クライアント側のプログラムを開発する場合も…PCLを作成し — create PCLs for JavaScript too; examples 入力項目のチェック (input check), 出力項目の表示 (output display), 画面レイアウトの動的変更 (dynamic layout), 非同期通信 (asynchronous communication); fall-backs when static-analysis or coverage tools are unavailable; the two acceptable behaviours with scripts disabled.</p>`,
        `${JV(65)}<p>Giống slide 65: JavaScriptなど、クライアント側のプログラムを開発する場合も…PCLを作成し — viết PCL cả cho JavaScript; ví dụ 入力項目のチェック (kiểm tra input), 出力項目の表示 (hiển thị output), 画面レイアウトの動的変更 (đổi bố cục động), 非同期通信 (giao tiếp bất đồng bộ); cách thay thế khi không có công cụ phân tích tĩnh hay coverage; hai hành vi chấp nhận được khi tắt script.</p>`],
      [65, '4-5 Client-side programs (English)',
        `<p>Client-side code (input checks, output display, dynamic layout changes, asynchronous calls) gets PCLs and tests exactly like server code. If no static-analysis tool exists for it, cover those concerns during desk debugging and code review; if no coverage tool exists, <b>check coverage by hand against the PCL</b> during desk debugging and review. When scripts are disabled in the browser, either the operation still works without the script, or an error message tells the user to enable it. In 2026 terms: ESLint is the static analyser, Jest/Vitest with Istanbul gives coverage — the excuse of “no tool” has disappeared.</p>`,
        `<p>Code phía client (kiểm tra input, hiển thị output, đổi bố cục động, gọi bất đồng bộ) cũng có PCL và được test y như code server. Nếu không có công cụ phân tích tĩnh cho nó, hãy xét các quan điểm đó khi desk debug và review code; nếu không có công cụ coverage, <b>tự kiểm coverage bằng tay theo PCL</b> khi desk debug và review. Khi trình duyệt tắt script, hoặc thao tác vẫn làm được mà không cần script, hoặc có thông báo lỗi yêu cầu người dùng bật script. Theo cách nói năm 2026: ESLint là công cụ phân tích tĩnh, Jest/Vitest với Istanbul cho coverage — lý do “không có công cụ” đã không còn.</p>`],
      [66, '4-6 Sending input values (Japanese)',
        `${JE(67)}<p>クライアントからサーバにデータを送信する場合、クライアント側だけでなくサーバ側でも入力チェックが行われることを確認してください. The four steps: 1. 4桁以下を入力可能な項目に「9999」を入力 (enter 9999 in a field allowing ≤ 4 digits); 2. クライアント側の入力チェックを通過 (passes the client check); 3. ツールを用いてリクエストを編集し、値を「10000」に変更 (edit the request with a tool, change the value to 10000); 4. サーバ側で入力チェックが行われ、エラーを返す (the server checks and returns an error). PCL note ※リクエストを編集して実施 = “performed by editing the request”.</p>`,
        `${JV(67)}<p>クライアントからサーバにデータを送信する場合、クライアント側だけでなくサーバ側でも入力チェックが行われることを確認してください. Bốn bước: 1. 4桁以下を入力可能な項目に「9999」を入力 (nhập 9999 vào ô cho phép tối đa 4 chữ số); 2. クライアント側の入力チェックを通過 (qua được kiểm tra phía client); 3. ツールを用いてリクエストを編集し、値を「10000」に変更 (dùng công cụ sửa request, đổi giá trị thành 10000); 4. サーバ側で入力チェックが行われ、エラーを返す (server kiểm tra và trả lỗi). Ghi chú PCL ※リクエストを編集して実施 = “thực hiện bằng cách sửa request”.</p>`],
      [67, '4-6 Sending input values (English)',
        `<p>Never trust the browser: a field allows at most 4 digits, the user types 9999 (passes the JavaScript check), then edits the HTTP request with a tool (browser DevTools, Burp Suite, Postman) to send <b>10000</b>; the <b>server-side</b> program must still reject it. The PCL for Date (year) shows the full boundary set: 2013 (basic), blank, 0000, 0001, 9999, <b>10000 (by editing the HTTP request)</b>, 999 (too short), and another edited request — descriptions “year blank / year boundary ×3 / year length ×2”. This is the unit-level form of the OWASP rule “all input validation must happen on the server”.</p>`,
        `<p>Đừng bao giờ tin trình duyệt: một ô cho tối đa 4 chữ số, người dùng gõ 9999 (qua được kiểm tra JavaScript), rồi dùng công cụ (DevTools của trình duyệt, Burp Suite, Postman) sửa request HTTP để gửi <b>10000</b>; chương trình <b>phía server</b> vẫn phải từ chối. PCL cho Date (năm) liệt kê đủ bộ biên: 2013 (cơ sở), để trống, 0000, 0001, 9999, <b>10000 (sửa request HTTP)</b>, 999 (thiếu độ dài), và một request bị sửa khác — mô tả “year blank / year boundary ×3 / year length ×2”. Đây là dạng cấp unit của quy tắc OWASP “mọi kiểm tra đầu vào phải làm ở server”.</p>`],
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
<p>Two JUnit 5 suites were run under JaCoCo 0.8.13 (JDK 21). <b>Proper suite</b> = the five columns of slide 39 (basic case + one condition changed at a time). <b>Improper suite</b> = the three columns of slide 49 (two conditions changed at once). Real output:</p>
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
<div class="pitfall"><b>Exam and review traps.</b> (1) “100 % decision coverage means every condition has been tested” — false for compound conditions (slide 53). (2) Writing “a &gt; 0” or “valid value” in an input row — the guide demands specific values. (3) Expected result written as “no error” — write the exact return value, exception class or message. (4) Two columns with the same inputs but different expected results — this means an input (often DB data) is missing from the matrix (PCL deck slide 29).</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>MC/DC — what avionics requires.</b> For <code>a &amp;&amp; b</code>, <em>Modified Condition/Decision Coverage</em> asks for cases showing that each condition <em>independently</em> changes the decision: (T,T)→T, (F,T)→F and (T,F)→F — exactly slide 53's cases (1)(2)(3); (F,F) is not needed. For n conditions MC/DC needs about n + 1 cases instead of 2<sup>n</sup>. DO-178C makes it mandatory for level-A flight software, and ISO 26262 recommends it for the highest automotive safety level. <em>Outside the syllabus because CTFL 2018 stops at decision coverage (condition-based techniques are in the Advanced Technical Test Analyst syllabus).</em></div>`,
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
<p>Hai bộ JUnit 5 được chạy dưới JaCoCo 0.8.13 (JDK 21). <b>Bộ đúng</b> = năm cột của slide 39 (ca cơ sở + mỗi lần đổi một điều kiện). <b>Bộ sai</b> = ba cột của slide 49 (đổi hai điều kiện một lúc). Kết quả thật:</p>
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
<div class="pitfall"><b>Bẫy khi thi và khi review.</b> (1) “100 % decision coverage nghĩa là mọi điều kiện đã được test” — sai với điều kiện ghép (slide 53). (2) Ghi “a &gt; 0” hay “giá trị hợp lệ” ở dòng đầu vào — bộ hướng dẫn đòi giá trị cụ thể. (3) Ghi kết quả mong đợi là “không lỗi” — phải ghi đúng giá trị trả về, lớp exception hay thông báo. (4) Hai cột cùng đầu vào mà khác kết quả mong đợi — nghĩa là ma trận còn thiếu một đầu vào (thường là dữ liệu DB) (slide 29 bộ PCL).</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>MC/DC — thứ ngành hàng không bắt buộc.</b> Với <code>a &amp;&amp; b</code>, <em>Modified Condition/Decision Coverage</em> đòi các ca cho thấy mỗi điều kiện <em>độc lập</em> làm đổi kết quả quyết định: (Đ,Đ)→Đ, (S,Đ)→S và (Đ,S)→S — đúng ba ca (1)(2)(3) của slide 53; không cần (S,S). Với n điều kiện, MC/DC cần khoảng n + 1 ca thay vì 2<sup>n</sup>. DO-178C bắt buộc MC/DC cho phần mềm bay mức A, ISO 26262 khuyến nghị nó cho mức an toàn ô tô cao nhất. <em>Ngoài giáo trình vì CTFL 2018 dừng ở decision coverage (các kỹ thuật dựa trên điều kiện nằm trong syllabus Advanced Technical Test Analyst).</em></div>`),
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
<div class="callout"><b>Learning objectives.</b> Explain bottom-up unit testing with drivers, real lower layers and stubs (LO-2.2.1, K2) · distinguish test condition (concern), test case and test case specification (LO-1.4.2/1.4.3) · choose list or matrix format · assign N/E/L/I categories and map them to the template's N/A/B · compute statement, decision and revised-statement coverage (LO-4.3.1/4.3.2, K2).</div>
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
<div class="callout"><b>Chuẩn đầu ra.</b> Giải thích unit test bottom-up với driver, lớp dưới thật và stub (LO-2.2.1, K2) · phân biệt test condition (concern), test case và đặc tả test case (LO-1.4.2/1.4.3) · chọn dạng danh sách hay ma trận · gán phân loại N/E/L/I và quy đổi sang N/A/B của template · tính statement, decision và revised-statement coverage (LO-4.3.1/4.3.2, K2).</div>
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
        `${JE(69)}<p>“付録 関連知識” — “Appendix: related knowledge”.</p>`,
        `${JV(69)}<p>“付録 関連知識” — “Phụ lục: kiến thức liên quan”.</p>`],
      [69, 'Appendix: Related Information',
        `<p>Divider. Sections A-1 to A-6 follow; A-2 has three pages (72–75) because the Japanese version is on one page and the English one on two.</p>`,
        `<p>Trang ngăn. Tiếp theo là mục A-1 tới A-6; A-2 có ba trang (72–75) vì bản tiếng Nhật nằm trên một trang còn bản tiếng Anh trải hai trang.</p>`],
      [70, 'A-1 Three-tier architecture (Japanese)',
        `${JE(71)}<p>Header ■ オンラインの構造（3層アーキテクチャ） (structure of online processing, three-tier). Bottom line: 3層構造により、保守性の向上、3層並行開発による期間短縮、層間の整合性チェックによる品質向上が期待できる — the three-tier structure promises better maintainability, shorter schedules by developing the three layers in parallel, and better quality through consistency checks between layers.</p>`,
        `${JV(71)}<p>Tiêu đề ■ オンラインの構造（3層アーキテクチャ） (cấu trúc xử lý online, 3 lớp). Dòng cuối: 3層構造により、保守性の向上、3層並行開発による期間短縮、層間の整合性チェックによる品質向上が期待できる — cấu trúc 3 lớp hứa hẹn dễ bảo trì hơn, rút ngắn tiến độ nhờ phát triển song song ba lớp, và chất lượng tốt hơn nhờ kiểm tra tính nhất quán giữa các lớp.</p>`],
      [71, 'A-1 Three-tier online processing architecture (English)',
        `<p>The same diagram as slide 17 (Views → presentation units → function units → data-access units → database) with the three goals: <b>a)</b> improve maintainability, <b>b)</b> reduce development time by developing layers in parallel, <b>c)</b> improve quality by checking consistency between layers. For testing, layering matters because each layer has a clear interface — a natural place to put a driver above the unit and a stub (or the real tested layer) below it.</p>`,
        `<p>Cùng sơ đồ với slide 17 (View → unit presentation → unit function → unit data-access → database) kèm ba mục tiêu: <b>a)</b> dễ bảo trì hơn, <b>b)</b> giảm thời gian phát triển nhờ làm các lớp song song, <b>c)</b> nâng chất lượng nhờ kiểm tra tính nhất quán giữa các lớp. Với kiểm thử, phân lớp quan trọng vì mỗi lớp có giao diện rõ ràng — chỗ tự nhiên để đặt driver ở trên unit và stub (hoặc lớp thật đã test) ở dưới nó.</p>`],
      [72, 'A-2 Unit testing: order and environment (Japanese)',
        `${JE(74)}<p>■ 単体テスト: P/F/D/batch units are checked against their specifications. • D層の単体テストをDBに接続した状態で実施 — D units are tested connected to the real DB; • once D reaches its quality target, F units are tested using D as a library; • batch units too use D as a library; • P units use the tested F layer if possible (スタブ = stub if F is not ready). Diagram labels: ドライバ (driver), 部品 (common component), 画面 (screen/view), ファイル (file); 品質が確保されたD層をライブラリとして使用する — “use the quality-assured D layer as a library”.</p>`,
        `${JV(74)}<p>■ 単体テスト: unit P/F/D/batch được kiểm theo đặc tả. • D層の単体テストをDBに接続した状態で実施 — unit D được test khi kết nối DB thật; • khi D đạt mục tiêu chất lượng thì test unit F dùng D như thư viện; • unit batch cũng dùng D như thư viện; • unit P dùng lớp F đã test nếu có thể (スタブ = stub nếu F chưa xong). Nhãn sơ đồ: ドライバ (driver), 部品 (thành phần dùng chung), 画面 (màn hình/view), ファイル (file); 品質が確保されたD層をライブラリとして使用する — “dùng lớp D đã được bảo đảm chất lượng như thư viện”.</p>`],
      [73, 'A-2 blank page (Japanese: このページは空白です)',
        `<p><em>🇯🇵 Japanese page.</em> The only text in the box is <b>このページは空白です</b> — “this page is intentionally blank”. It keeps the Japanese/English page pairing aligned, because the English A-2 needs two pages (74 and 75). Nothing to learn here.</p>`,
        `<p><em>🇯🇵 Trang tiếng Nhật.</em> Chữ duy nhất trong khung là <b>このページは空白です</b> — “trang này cố ý để trống”. Nó giữ cho các cặp trang Nhật/Anh thẳng hàng, vì mục A-2 tiếng Anh cần hai trang (74 và 75). Không có gì để học ở đây.</p>`],
      [74, 'A-2 Unit Testing (English text)',
        `<p>Four rules that fix the <b>order</b> of unit testing: (1) test <b>data-access units against actual databases</b> (no fake DB); (2) when D units reach their quality objective, test <b>function units using the tested D units as libraries</b>; (3) test <b>batch main units</b> with the tested D units too; (4) test <b>presentation units with stubs</b>, or with tested F units when available. This is <b>bottom-up</b> integration of the layers inside unit testing: the lower layer is already trusted, so a failure points to the unit under test. ISTQB wording: the “component” is tested in isolation from <em>untested</em> parts; drivers call it, stubs stand in for what does not exist yet.</p>`,
        `<p>Bốn quy tắc cố định <b>thứ tự</b> unit test: (1) test <b>unit data-access với database thật</b> (không dùng DB giả); (2) khi unit D đạt mục tiêu chất lượng, test <b>unit function dùng unit D đã test như thư viện</b>; (3) test <b>batch main unit</b> cũng với unit D đã test; (4) test <b>unit presentation bằng stub</b>, hoặc bằng unit F đã test nếu có. Đây là tích hợp <b>bottom-up</b> các lớp ngay trong unit test: lớp dưới đã đáng tin, nên hễ fail là lỗi nằm ở unit đang test. Theo ISTQB: “component” được test tách khỏi các phần <em>chưa được test</em>; driver gọi nó, stub đứng thay cho những gì chưa tồn tại.</p>`],
      [75, 'A-2 Unit Testing (English diagrams)',
        `<p>Left, <b>online</b>: 1. <em>Driver → Data access layer unit → Database</em>; 2. <em>Driver → Function layer unit → (tested) Data access unit + Common component → Database</em> (“use tested data access layer units as libraries”); presentation units either <em>View → Presentation unit → tested Function unit → …</em> (“if tested function layer units are available, use them”) or <em>View → Presentation unit → Stub</em> (“if not, use stubs”). Right, <b>batch</b>: 1. D unit with a driver; 2. <em>Batch main unit → tested D unit → Database, plus File</em>. The thick frame marks the unit under test in each picture. Exactly the structure of the JNAP batch system used in the black-box lab (action classes → DAOs → Oracle).</p>`,
        `<p>Bên trái, <b>online</b>: 1. <em>Driver → unit Data access → Database</em>; 2. <em>Driver → unit Function → unit Data access (đã test) + Common component → Database</em> (“dùng unit data access đã test như thư viện”); unit presentation hoặc là <em>View → unit Presentation → unit Function đã test → …</em> (“nếu có unit function đã test thì dùng”) hoặc <em>View → unit Presentation → Stub</em> (“nếu chưa có thì dùng stub”). Bên phải, <b>batch</b>: 1. unit D với driver; 2. <em>Batch main unit → unit D đã test → Database, kèm File</em>. Khung đậm đánh dấu unit đang test trong mỗi hình. Đúng cấu trúc của hệ thống batch JNAP dùng trong lab black-box (lớp action → DAO → Oracle).</p>`],
      [76, 'A-3 Testing concerns and test cases (Japanese)',
        `${JE(77)}<p>a) チェックリスト作成観点 — concerns decided at test-design time so nothing is missed; business-level examples (AT): entering boundary values such as NULL does not create inconsistency in other business; simultaneous login with the same ID. Programming-level examples (CT, P): screen output and DB update for correct input; component output at the boundary of a condition. b) テストケース — pair of input conditions and confirmation items; e.g. item A accepts integers 1–9: (1) A = 0 → 異常 (abnormal), (2) A = 1 → 正常, (3) A = 9 → 正常, (4) A = 10 → 異常.</p>`,
        `${JV(77)}<p>a) チェックリスト作成観点 — các quan điểm chốt lúc thiết kế test để không bỏ sót; ví dụ mức nghiệp vụ (AT): nhập giá trị biên như NULL không gây mâu thuẫn ở nghiệp vụ khác; đăng nhập đồng thời cùng một ID. Ví dụ mức lập trình (CT, P): output màn hình và cập nhật DB khi nhập đúng; output của component tại biên của điều kiện. b) テストケース — cặp điều kiện đầu vào và nội dung xác nhận; ví dụ mục A nhận số nguyên 1–9: (1) A = 0 → 異常 (bất thường), (2) A = 1 → 正常, (3) A = 9 → 正常, (4) A = 10 → 異常.</p>`],
      [77, 'A-3 Testing concerns, test cases (English)',
        `<p><b>a) Testing concerns</b> = noticeable <em>types</em> of test case, fixed during test design to avoid insufficient testing — in ISTQB words, <b>test conditions</b> / checklist items. Business-level examples: boundary values such as NULL entered in one process must not corrupt other processes; behaviour when one user ID logs in several times. Program-level examples: correct screen values and DB updates for correct input; correct output at the boundary values of branch conditions. <b>b) Test cases</b> = pairs of input conditions and expected results, <em>derived from</em> concerns. Example: item A accepts integers 1–9 → A = 0 reject, A = 1 accept, A = 9 accept, A = 10 reject — two-value boundary value analysis (LO-4.2.2): each boundary and its invalid neighbour.</p>`,
        `<p><b>a) Testing concern</b> = các <em>kiểu</em> test case đáng chú ý, chốt lúc thiết kế test để khỏi test thiếu — theo ISTQB là <b>test condition</b> / mục checklist. Ví dụ mức nghiệp vụ: giá trị biên như NULL nhập ở một nghiệp vụ không được làm hỏng nghiệp vụ khác; hành vi khi một user ID đăng nhập nhiều lần. Ví dụ mức chương trình: giá trị màn hình và cập nhật DB đúng khi nhập đúng; output đúng tại giá trị biên của điều kiện rẽ nhánh. <b>b) Test case</b> = cặp điều kiện đầu vào và kết quả mong đợi, <em>suy ra từ</em> concern. Ví dụ: mục A nhận số nguyên 1–9 → A = 0 từ chối, A = 1 nhận, A = 9 nhận, A = 10 từ chối — phân tích giá trị biên hai giá trị (LO-4.2.2): mỗi biên và láng giềng không hợp lệ của nó.</p>`],
      [78, 'A-3 c) Checklists for testing (Japanese)',
        `${JE(79)}<p>c) テスト用のチェックリスト — list of test cases (input conditions and confirmation items), made from each project's design documents and used to confirm the combinations of test case and expected result are realised. PCL…単体テスト用チェックリスト (unit test), CCL…組合せテスト用チェックリスト (combination test), ACL…連動テスト用チェックリスト (linked test).</p>`,
        `${JV(79)}<p>c) テスト用のチェックリスト — danh sách test case (điều kiện đầu vào và nội dung xác nhận), làm từ tài liệu thiết kế của từng dự án, dùng để xác nhận các tổ hợp test case – kết quả mong đợi đã được hiện thực. PCL…単体テスト用チェックリスト (unit test), CCL…組合せテスト用チェックリスト (test kết hợp), ACL…連動テスト用チェックリスト (test liên động).</p>`],
      [79, 'A-3 c) Checklists for Testing (English)',
        `<p>A <b>Checklist for Testing</b> is a list of test cases (inputs + expected results) prepared from the design documents and used to verify that the software produces the expected values. One checklist per level: <b>PCL</b> — unit testing; <b>CCL</b> — Software Component Testing (integration of units); <b>ACL</b> — Application Software Testing (system). So the three levels of slide 13 each have their own checklist, and each is checked against the matching design level — the V-model again.</p>`,
        `<p><b>Checklist for Testing</b> là danh sách test case (đầu vào + kết quả mong đợi) lập từ tài liệu thiết kế, dùng để xác nhận phần mềm cho ra đúng giá trị mong đợi. Mỗi cấp một checklist: <b>PCL</b> — unit test; <b>CCL</b> — Software Component Testing (tích hợp unit); <b>ACL</b> — Application Software Testing (hệ thống). Như vậy ba cấp ở slide 13 mỗi cấp có checklist riêng, và mỗi checklist đối chiếu với cấp thiết kế tương ứng — lại là mô hình V.</p>`],
      [80, 'A-4 Checklist formats (Japanese)',
        `${JE(81)}<p>リスト形式 (list format) / マトリックス形式 (matrix format), with メリット (advantages), デメリット (disadvantages), 主な用途 (main use). List example (schedule screen): 用件に「テスト１変更」を入力し、「更新実行」ボタンを押下する — enter “Test 1 modified” as the subject and press “Execute update”; 戻る = Back; 1-1-0040: 年 2009 月 2 日 29 → <b>スケジュール更新画面が表示される</b> (the Schedule <em>Update</em> screen is displayed) and 「予約年月日が不正です。」 (“the reservation date is invalid”). Matrix example: 引数 a (argument a), 引数 b, 戻り値 (return value).</p>`,
        `${JV(81)}<p>リスト形式 (dạng danh sách) / マトリックス形式 (dạng ma trận), kèm メリット (ưu điểm), デメリット (nhược điểm), 主な用途 (công dụng chính). Ví dụ danh sách (màn hình lịch): 用件に「テスト１変更」を入力し、「更新実行」ボタンを押下する — nhập “Test 1 modified” vào mục nội dung rồi bấm “Thực hiện cập nhật”; 戻る = Quay lại; 1-1-0040: 年 2009 月 2 日 29 → <b>スケジュール更新画面が表示される</b> (hiện màn hình <em>Cập nhật</em> lịch) và 「予約年月日が不正です。」 (“ngày đặt không hợp lệ”). Ví dụ ma trận: 引数 a (tham số a), 引数 b, 戻り値 (giá trị trả về).</p>`],
      [81, 'A-4 Formats of Checklists for Testing (English)',
        `<p><b>List format</b> (yellow): each test case is a row of text — ID, input conditions, expected results. + easy to describe different or complex procedures per case; − hard to see whether combinations of many inputs are complete; used when <b>procedures differ per case</b> (screens, system tests — the Sample_Test Cases.xlsx of L2.8 is a list). <b>Matrix format</b> (pink): rows = input conditions and expected results, columns = test cases. + easy to see the input/output values and to check completeness of combinations; − hard to describe case-specific procedures; used when <b>one procedure is shared and only values vary</b> (unit tests). The matrix example is a×b: (1,10)→10, (0,10)→0, (1,1)→1, (0,1)→0. <b>Translation error on the slide:</b> for 1-1-0040 (29 Feb 2009, not a leap year) the English says “The ‘Schedule List’ screen is displayed”, but the Japanese original says the <em>Schedule Update</em> screen stays displayed with the error — which is also the only sensible behaviour.</p>`,
        `<p><b>Dạng danh sách</b> (vàng): mỗi test case là một dòng chữ — ID, điều kiện đầu vào, kết quả mong đợi. + dễ mô tả thủ tục khác nhau hoặc phức tạp cho từng ca; − khó thấy các tổ hợp của nhiều đầu vào đã đủ chưa; dùng khi <b>thủ tục mỗi ca khác nhau</b> (màn hình, system test — file Sample_Test Cases.xlsx ở bài L2.8 là dạng danh sách). <b>Dạng ma trận</b> (hồng): dòng = điều kiện đầu vào và kết quả mong đợi, cột = test case. + dễ nhìn giá trị vào/ra và kiểm độ đầy đủ của tổ hợp; − khó mô tả thủ tục riêng từng ca; dùng khi <b>một thủ tục chung, chỉ đổi giá trị</b> (unit test). Ví dụ ma trận là a×b: (1,10)→10, (0,10)→0, (1,1)→1, (0,1)→0. <b>Lỗi dịch trên slide:</b> với 1-1-0040 (29/2/2009, không phải năm nhuận) bản tiếng Anh ghi “màn hình ‘Schedule List’ được hiển thị”, nhưng bản gốc tiếng Nhật ghi màn hình <em>Cập nhật lịch</em> vẫn hiển thị kèm lỗi — và đó cũng là hành vi hợp lý duy nhất.</p>`],
      [82, 'A-5 Checklist categories (Japanese)',
        `${JE(83)}<p>■チェックリスト区分 (checklist category). N 正常: normal result (no exception, error code or error message); E 異常: abnormal result (exception, error code, error message). Additional: L 限界・境界 (limit/boundary), I インタフェース (interface of submodules). 複数の区分にあてはまる場合、あてはまる区分の全てを記入する — enter every category that applies, e.g. N, L, I.</p>`,
        `${JV(83)}<p>■チェックリスト区分 (phân loại checklist). N 正常: kết quả bình thường (không exception, mã lỗi hay thông báo lỗi); E 異常: kết quả bất thường (exception, mã lỗi, thông báo lỗi). Thêm: L 限界・境界 (giới hạn/biên), I インタフェース (giao diện submodule). 複数の区分にあてはまる場合、あてはまる区分の全てを記入する — ghi mọi loại áp dụng, ví dụ N, L, I.</p>`],
      [83, 'A-5 Test case category (English)',
        `<p>Categories exist to prove that <em>special</em> cases were written, not only happy paths. Every case gets exactly one of <b>N (Normal)</b> — normal result without exceptions/error codes/messages — or <b>E (Error)</b> — abnormal result. In addition, when applicable: <b>L (Limit or Boundary)</b> — checks a range or branch condition with limit/boundary values; <b>I (Interface)</b> — checks the interface of a called submodule. The Venn diagram: L and I overlap both N and E. Example from the balloon: a case that checks a submodule's interface with a boundary value and expects a normal result is <b>N, L, I</b>. Note the difference with FPT's template (L2.8): it uses one letter per case — <b>N / A (Abnormal) / B (Boundary)</b> — and classifies by the <em>input</em>, while Hitachi classifies N/E by the <em>result</em> and adds L/I as extra tags.</p>`,
        `<p>Phân loại có để chứng minh rằng các ca <em>đặc biệt</em> đã được viết, không chỉ ca suôn sẻ. Mỗi ca nhận đúng một trong hai: <b>N (Normal)</b> — kết quả bình thường, không exception/mã lỗi/thông báo lỗi — hoặc <b>E (Error)</b> — kết quả bất thường. Thêm vào đó, nếu áp dụng: <b>L (Limit/Boundary)</b> — kiểm một khoảng hay điều kiện rẽ nhánh bằng giá trị giới hạn/biên; <b>I (Interface)</b> — kiểm giao diện của submodule được gọi. Biểu đồ Venn: L và I chồng lên cả N và E. Ví dụ trong bóng chữ: ca kiểm giao diện submodule bằng giá trị biên và mong đợi kết quả bình thường là <b>N, L, I</b>. Chú ý khác biệt với template của FPT (bài L2.8): mỗi ca một chữ — <b>N / A (Abnormal) / B (Boundary)</b> — và phân loại theo <em>đầu vào</em>, còn Hitachi phân N/E theo <em>kết quả</em> rồi gắn thêm L/I.</p>`],
      [84, 'A-6 Coverage (Japanese)',
        `${JE(85)}<p>■カバレージ: the ratio of executed statements or branches. 1 命令網羅 C0 = 実行した行数 ／ 全行数 × 100 (executed lines / all lines); 2 分岐網羅 C1 = 実行した分岐数 ／ 全分岐数 × 100; 3 修正網羅 RC0 = 実行した修正行数 ／ 全修正行数 × 100 (修正箇所を対象とした命令網羅 — statement coverage of the modified places). Note that the Japanese defines C0 on <em>lines</em> (行数), the English on <em>statements</em>.</p>`,
        `${JV(85)}<p>■カバレージ: tỉ lệ câu lệnh hoặc nhánh đã được chạy. 1 命令網羅 C0 = 実行した行数 ／ 全行数 × 100 (số dòng đã chạy / tổng số dòng); 2 分岐網羅 C1 = 実行した分岐数 ／ 全分岐数 × 100; 3 修正網羅 RC0 = 実行した修正行数 ／ 全修正行数 × 100 (修正箇所を対象とした命令網羅 — phủ câu lệnh trên các chỗ sửa). Để ý bản Nhật định nghĩa C0 theo <em>dòng</em> (行数), bản Anh theo <em>câu lệnh</em>.</p>`],
      [85, 'A-6 Code coverage (English)',
        `<p>“Code coverage is a metric describing the degree to which the statements or branches of a program have been executed”, measured with a coverage tool. <b>C0</b> statement coverage = executed statements / all statements × 100 %; <b>C1</b> decision coverage = executed branches / all branches × 100 %; <b>RC0</b> revised-statement coverage = executed revised statements / all revised statements × 100 %. Exam facts (LO-4.3.3): 100 % C1 ⇒ 100 % C0, not conversely; an <code>if</code> without <code>else</code> can reach 100 % C0 with one test but needs two for C1. Tools measure slightly differently: JaCoCo counts lines and bytecode branches (each operand of <code>&amp;&amp;</code>, <code>||</code> counts), so its “branch coverage” is stricter than textbook decision coverage.</p>`,
        `<p>“Code coverage là thước đo mức độ các câu lệnh hay nhánh của chương trình đã được chạy”, đo bằng công cụ coverage. <b>C0</b> statement coverage = số câu lệnh đã chạy / tổng số câu lệnh × 100 %; <b>C1</b> decision coverage = số nhánh đã chạy / tổng số nhánh × 100 %; <b>RC0</b> revised-statement coverage = số câu lệnh đã sửa được chạy / tổng số câu lệnh đã sửa × 100 %. Kiến thức thi (LO-4.3.3): C1 100 % ⇒ C0 100 %, chiều ngược lại thì không; một <code>if</code> không có <code>else</code> đạt C0 100 % với một test nhưng cần hai test cho C1. Các công cụ đo hơi khác nhau: JaCoCo đếm dòng và nhánh bytecode (mỗi vế của <code>&amp;&amp;</code>, <code>||</code> đều tính), nên “branch coverage” của nó chặt hơn decision coverage trong sách.</p>`],
      [86, 'END (Japanese)',
        `${JE(87)}<p>END page with 株式会社 日立製作所 情報・通信システム社 (Hitachi, Ltd., Information &amp; Telecommunication Systems Company).</p>`,
        `${JV(87)}<p>Trang END kèm 株式会社 日立製作所 情報・通信システム社 (Hitachi, Ltd., Công ty Hệ thống Thông tin &amp; Viễn thông).</p>`],
      [87, 'END (English)',
        `<p>End of the guide — Information &amp; Telecommunication Systems Company, Hitachi, Ltd.</p>`,
        `<p>Hết bộ hướng dẫn — Information &amp; Telecommunication Systems Company, Hitachi, Ltd.</p>`],
      [88, 'Hitachi logo (closing slide)',
        `<p>Closing logo “HITACHI Inspire the Next”. The speaker note in Japanese, 本日は有難うございました, means “thank you for today”.</p>`,
        `<p>Logo kết “HITACHI Inspire the Next”. Ghi chú của người trình bày bằng tiếng Nhật, 本日は有難うございました, nghĩa là “cảm ơn mọi người hôm nay”.</p>`],
    ]),
    bi(`<h3>Ví dụ có lời giải · Worked example — categories and RC0 for a maintenance change</h3>
<p>A customer asks to change <code>divide(a, b)</code> of L2.3: when b is negative the method must now return −1 instead of throwing. You change 2 statements (the <code>else</code> of condition 2 now contains <code>result = -1;</code>, and a new <code>log.warn(...)</code> line). The method now has 8 executable statements.</p>
<ol>
<li><b>Which coverage applies?</b> A modified unit → RC0 (slide 33). RC0 = executed revised statements / 2 revised statements.</li>
<li><b>Re-run the old five cases.</b> 0001-01-0050 (a = 5, b = −1) now hits both revised statements → RC0 = 2/2 = 100 %. Its expected result must be updated from “IllegalArgumentException” to “return −1” and its category from E L to <b>N L</b> (the result is now normal; b = −1 is still a boundary value).</li>
<li><b>Regression.</b> Slide 33 (5): after the change all five cases are re-run, not only 0050 — the other four must still give 2, 10, exception, 0.</li>
<li><b>Template letters.</b> In FPT's N/A/B scheme 0050 stays <b>B</b> (classified by its input, a boundary value), while 0030 (a = 0) is still B by input even though its result is an exception; a case with a = −7 would be <b>A</b>.</li>
</ol>
<div class="pitfall"><b>Don't mix up the three category schemes.</b> Hitachi guide: N or E by <em>result</em>, plus L and I tags (several letters per case). PCL deck: 正 / 異 / 境 (normal / abnormal / boundary). FPT template: one of N, A, B per case, by the <em>type of input data</em>. Exam questions about ISTQB never use these letters — they ask about valid/invalid partitions and boundary values.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Why Japanese projects count “test density” and “bug density”.</b> Japanese quality management (e.g. the IPA/SEC software development data white papers) tracks test cases per KLOC (the template's 100 TC/KLOC, the PCL deck's “100 TCs/KS”, where KS = kilo-steps ≈ KLOC) and bugs per KLOC at every level, and plots a reliability-growth curve (信頼度成長曲線) of bugs found over time. Too few bugs in unit testing is treated as a warning sign (tests too weak), not as good news — which is why slide 5 wants the UT-bug density to <em>rise</em> to the criterion. <em>Outside the syllabus because CTFL mentions defect density only as one of many test metrics.</em></div>`,
    `<h3>Ví dụ có lời giải · Phân loại và RC0 cho một thay đổi bảo trì</h3>
<p>Khách hàng yêu cầu sửa <code>divide(a, b)</code> ở bài L2.3: khi b âm thì method phải trả về −1 thay vì ném exception. Bạn sửa 2 câu lệnh (nhánh <code>else</code> của điều kiện 2 giờ chứa <code>result = -1;</code>, và thêm một dòng <code>log.warn(...)</code>). Method giờ có 8 câu lệnh thực thi được.</p>
<ol>
<li><b>Dùng coverage nào?</b> Unit sửa đổi → RC0 (slide 33). RC0 = số câu lệnh sửa đã chạy / 2 câu lệnh sửa.</li>
<li><b>Chạy lại năm ca cũ.</b> 0001-01-0050 (a = 5, b = −1) giờ đi qua cả hai câu lệnh sửa → RC0 = 2/2 = 100 %. Kết quả mong đợi của nó phải đổi từ “IllegalArgumentException” sang “trả về −1” và phân loại từ E L thành <b>N L</b> (kết quả giờ bình thường; b = −1 vẫn là giá trị biên).</li>
<li><b>Regression.</b> Slide 33 (5): sau khi sửa phải chạy lại cả năm ca, không chỉ 0050 — bốn ca kia vẫn phải cho 2, 10, exception, 0.</li>
<li><b>Chữ trong template.</b> Theo N/A/B của FPT, 0050 vẫn là <b>B</b> (phân theo đầu vào, một giá trị biên), còn 0030 (a = 0) vẫn là B theo đầu vào dù kết quả là exception; một ca a = −7 sẽ là <b>A</b>.</li>
</ol>
<div class="pitfall"><b>Đừng trộn ba cách phân loại.</b> Hướng dẫn Hitachi: N hoặc E theo <em>kết quả</em>, cộng thêm nhãn L và I (một ca có thể nhiều chữ). Bộ slide PCL: 正 / 異 / 境 (bình thường / bất thường / biên). Template FPT: mỗi ca một trong N, A, B, theo <em>loại dữ liệu đầu vào</em>. Câu hỏi thi ISTQB không bao giờ dùng các chữ này — chúng hỏi về phân vùng hợp lệ/không hợp lệ và giá trị biên.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Vì sao dự án Nhật đếm “mật độ test” và “mật độ bug”.</b> Quản lý chất lượng kiểu Nhật (ví dụ các sách trắng dữ liệu phát triển phần mềm của IPA/SEC) theo dõi số test case trên KLOC (100 TC/KLOC của template, “100 TCs/KS” của slide PCL, KS = kilo-step ≈ KLOC) và số bug trên KLOC ở mọi cấp, và vẽ đường cong tăng trưởng độ tin cậy (信頼度成長曲線) của số bug tìm được theo thời gian. Quá ít bug ở unit test bị coi là dấu hiệu cảnh báo (test quá yếu), không phải tin vui — vì vậy slide 5 muốn mật độ bug UT <em>tăng</em> lên tới tiêu chuẩn. <em>Ngoài giáo trình vì CTFL chỉ nhắc defect density như một trong nhiều metric kiểm thử.</em></div>`),
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
<p class="lead">A <strong>PCL (Program Check List)</strong> is the programmer's list of unit test cases for one method, written as a matrix from the <strong>detailed design</strong> before the code exists: each column is a test case (a numbered case with its category normal / abnormal / boundary), each row a specific input value or an expected value (return value, log message, exception, DB change), and an “O” links them. It is reviewed, then executed; the execution date and result are recorded on it. In the FPT template the same thing is called a <em>Unit Test Case</em> sheet. This deck from Hitachi Consulting's ICT Division (March 2017) shows how to fill one step by step from a real design.</p>
<div class="callout"><b>Learning objectives.</b> State what a PCL is, what goes into it and what comes out of writing it · derive inputs and expected values from a method design (arguments, return value, exceptions, log, DB data) · apply the 12 writing rules, including N/A/B cases and C0/C1 = 100 % · describe the PCL review loop and the unit-test flow with its tools · choose special values for boundary tests (LO-4.2.2, K3).</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">I</div><div class="lz-t">Method information</div><div class="lz-d">name, class, arguments, return value, exceptions</div></div>
  <div class="lz-step"><div class="lz-k">II</div><div class="lz-t">Branches to cover</div><div class="lz-d">every branch of the processing description</div></div>
  <div class="lz-step"><div class="lz-k">III</div><div class="lz-t">Input values</div><div class="lz-d">arguments + log level + settings + DB data</div></div>
  <div class="lz-step"><div class="lz-k">IV</div><div class="lz-t">Expected values</div><div class="lz-d">return value, messages, exceptions</div></div>
  <div class="lz-step"><div class="lz-k">→</div><div class="lz-t">Fill the matrix</div><div class="lz-d">IDs, values, O marks, N/A/B</div></div>
</div>`,
    `<span class="eyebrow">Lab 2 · Bài L2.5 · How to write PCL slide 1–32</span>
<h2>Cách viết PCL</h2>
<p class="lead"><strong>PCL (Program Check List)</strong> là danh sách unit test case của lập trình viên cho một method, viết dạng ma trận từ <strong>detailed design</strong> trước khi có code: mỗi cột là một test case (một ca đánh số kèm phân loại normal / abnormal / boundary), mỗi dòng là một giá trị đầu vào cụ thể hoặc một giá trị mong đợi (giá trị trả về, log message, exception, thay đổi DB), và dấu “O” nối chúng lại. PCL được review, rồi được chạy; ngày chạy và kết quả được ghi ngay trên đó. Trong template của FPT, thứ này gọi là sheet <em>Unit Test Case</em>. Bộ slide của phòng ICT, Hitachi Consulting (3/2017) chỉ cách điền từng bước từ một thiết kế thật.</p>
<div class="callout"><b>Chuẩn đầu ra.</b> Nói được PCL là gì, viết PCL cần gì và cho ra gì · rút đầu vào và giá trị mong đợi từ thiết kế method (tham số, giá trị trả về, exception, log, dữ liệu DB) · áp dụng 12 quy tắc viết, gồm ca N/A/B và C0/C1 = 100 % · mô tả vòng review PCL và luồng unit test cùng công cụ · chọn giá trị đặc biệt cho kiểm thử biên (LO-4.2.2, K3).</div>
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
        `<p>Cover: <b>Program Check List — PCL</b>, ICT Division, March 2017, Hitachi Consulting with the “Global CyberSoft” logo (the Vietnamese offshore company Hitachi Consulting acquired). So this is how the offshore side explains the Hitachi guide of L2.2–L2.4 to its own developers.</p>`,
        `<p>Bìa: <b>Program Check List — PCL</b>, ICT Division, tháng 3/2017, Hitachi Consulting với logo “Global CyberSoft” (công ty offshore Việt Nam được Hitachi Consulting mua lại). Vậy đây là cách phía offshore giải thích bộ hướng dẫn Hitachi (bài L2.2–L2.4) cho chính developer của mình.</p>`],
      [2, 'Agenda',
        `<p>Five parts: <b>Concept</b> (slides 3–6) · <b>Write PCL document</b> (7–21) · <b>After completed PCL document</b> (22–23) · <b>Unit test flow</b> (24–27) · <b>Best practice</b> (28–29).</p>`,
        `<p>Năm phần: <b>Khái niệm</b> (slide 3–6) · <b>Viết tài liệu PCL</b> (7–21) · <b>Sau khi viết xong PCL</b> (22–23) · <b>Luồng unit test</b> (24–27) · <b>Best practice</b> (28–29).</p>`],
      [3, 'What\'s PCL? (section divider)',
        `<p>Section divider with the slogan “We Make it Happen. Better.”</p>`,
        `<p>Trang ngăn phần kèm khẩu hiệu “We Make it Happen. Better.”</p>`],
      [4, 'What\'s PCL? — Concept',
        `<p>Two definitions: <b>PCL is the Program checklist</b>; <b>PCL is a collection of test cases (to implement the unit test script)</b>. The second half matters: the PCL is the <em>design</em> of your unit tests, and the JUnit script is its <em>implementation</em> — one test method per PCL column. The guide (slide 15 of L2.2) adds that “PCL” is Hitachi's historical name for the <em>checklist for unit testing</em>.</p>`,
        `<p>Hai định nghĩa: <b>PCL là Program checklist</b>; <b>PCL là tập hợp các test case (để cài đặt unit test script)</b>. Nửa sau quan trọng: PCL là <em>thiết kế</em> của unit test, còn JUnit script là <em>phần cài đặt</em> — mỗi cột PCL một method test. Bộ hướng dẫn (slide 15, bài L2.2) nói thêm “PCL” là tên gọi lịch sử trong Hitachi cho <em>checklist cho unit test</em>.</p>`],
      [5, 'PCL template — header and blocks',
        `<p>The PCL template and its five areas: <b>Function ID</b> (red — the function being tested), <b>Class's name</b> (blue — “Testing targeted class name”), <b>Date perform PCL</b> (green — the testing date / environment block), <b>Input value</b> block (red, pink rows) and <b>Expected value</b> block (blue, yellow rows). Header fields visible: System name, Document type “Matrix Checklist”, Approved by, UT process test type, Remarks, UT execution confirmation date. Compare with the FPT template: Function Code, Function Name, Condition block, Confirm block (L2.8).</p>`,
        `<p>Template PCL và năm vùng: <b>Function ID</b> (đỏ — chức năng được test), <b>Class's name</b> (xanh — “Testing targeted class name”), <b>Date perform PCL</b> (xanh lá — khối ngày test / môi trường), khối <b>Input value</b> (đỏ, dòng hồng) và khối <b>Expected value</b> (xanh, dòng vàng). Các ô tiêu đề thấy được: System name, Document type “Matrix Checklist”, Approved by, UT process test type, Remarks, UT execution confirmation date. So với template FPT: Function Code, Function Name, khối Condition, khối Confirm (bài L2.8).</p>`],
      [6, 'PCL template — columns and classification',
        `<p>Right-hand part: <b>each column is a test case</b> containing its input and expected values (blue frame: case numbers 00001, 00002 … along the top), and the <b>kind of test case</b> row (red: “Classification (Normal / Abnormal / Boundary – Limit)”). The slide writes “Nomal, Abnomal” — typos for Normal, Abnormal. Same matrix idea as guide slide 39.</p>`,
        `<p>Phần bên phải: <b>mỗi cột là một test case</b> gồm giá trị đầu vào và giá trị mong đợi của nó (khung xanh: số ca 00001, 00002 … dọc phía trên), và dòng <b>loại test case</b> (đỏ: “Classification (Normal / Abnormal / Boundary – Limit)”). Slide viết “Nomal, Abnomal” — gõ nhầm của Normal, Abnormal. Cùng ý ma trận với slide 39 của bộ hướng dẫn.</p>`],
      [7, 'Write PCL document (section divider)',
        `<p>Divider for the main part. The speaker note is a PowerPoint template instruction: “if the full presentation is internal or confidential, every slide must include a confidentiality statement” — hence the red CONFIDENTIAL footer on most slides.</p>`,
        `<p>Trang ngăn phần chính. Ghi chú người trình bày là hướng dẫn của mẫu PowerPoint: “nếu cả bài là nội bộ hay mật, mọi slide phải có dòng tuyên bố bảo mật” — vì thế hầu hết slide có chân trang đỏ CONFIDENTIAL.</p>`],
      [8, 'PCL writing input',
        `<p>What you need <em>before</em> writing: the <b>PCL template document</b>, the <b>detail design</b> (the test basis), the <b>PCL checklist</b> (the self-review list — for Lab 2 the white-box/black-box checklists of L2.6/L2.7) and the <b>PCL guideline</b> (the guide of L2.2–L2.4). In ISTQB terms these are the inputs of test analysis and design: test basis, templates and standards.</p>`,
        `<p>Những gì cần có <em>trước</em> khi viết: <b>tài liệu template PCL</b>, <b>detail design</b> (test basis), <b>PCL checklist</b> (danh sách tự review — với Lab 2 là các checklist white-box/black-box ở bài L2.6/L2.7) và <b>PCL guideline</b> (bộ hướng dẫn ở bài L2.2–L2.4). Theo ISTQB, đây là đầu vào của phân tích và thiết kế test: test basis, mẫu và tiêu chuẩn.</p>`],
      [9, 'PCL writing output',
        `<p>What writing produces: the <b>completed PCL document</b> and a <b>defects list</b>. Why defects? While turning a design into specific values you find gaps, contradictions and undefined behaviour in the design itself — defects found by test design before any code runs (SWT1: testing objective “preventing defects”).</p>`,
        `<p>Viết PCL cho ra: <b>tài liệu PCL hoàn chỉnh</b> và một <b>danh sách defect</b>. Vì sao có defect? Khi biến thiết kế thành giá trị cụ thể, bạn phát hiện chỗ thiếu, mâu thuẫn và hành vi chưa định nghĩa trong chính thiết kế — defect được tìm nhờ thiết kế test trước khi có dòng code nào chạy (SWT1: mục tiêu “ngăn ngừa defect”).</p>`],
      [10, 'Steps: read the detail design and determine…',
        `<p>Four things to extract from the design: (1) <b>information of the method</b> — name, class name, arguments, return value, exceptions…; (2) the <b>“brands” of the DS to cover</b> — read “branches” of the design specification (the deck consistently writes <em>brands</em> for <em>branches</em>); (3) the <b>input values</b>; (4) the <b>expected values</b>. Slides 11–14 do one step each on the same example.</p>`,
        `<p>Bốn thứ cần rút từ thiết kế: (1) <b>thông tin method</b> — tên, tên class, tham số, giá trị trả về, exception…; (2) các <b>“brands” của DS cần phủ</b> — đọc là “branches” (nhánh) của đặc tả thiết kế (cả bộ slide viết nhầm <em>brands</em> cho <em>branches</em>); (3) <b>giá trị đầu vào</b>; (4) <b>giá trị mong đợi</b>. Slide 11–14 mỗi slide làm một bước trên cùng một ví dụ.</p>`],
      [11, 'How to write — I Information of method',
        `<p>The example: a service method <b>getAccountTransferSummaryList</b> (access: public) that retrieves data via a mapper, limiting the results to a pre-configured maximum number of records. Its design summary: <b>Argument</b> — none (“-”, blue frame); <b>Return value</b> — <code>accTransferSummaryList</code>, type <code>List&lt;Clm13ReqConfirmModel&gt;</code> (red frame); <b>Exceptions</b> — <code>DataConversionException</code> (when converting a date/time from String to Date) and <code>DataRetrievalException</code> (when calling the mapper). Usual choice: <b>arguments → input values, return value → expected values</b>. “But in order to cover all branches in the method we need more input data” — here the method has no argument at all, so all inputs must come from elsewhere (settings, DB, log level).</p>`,
        `<p>Ví dụ: method service <b>getAccountTransferSummaryList</b> (public) lấy dữ liệu qua mapper, giới hạn kết quả theo số bản ghi tối đa đã cấu hình. Tóm tắt thiết kế: <b>Argument</b> — không có (“-”, khung xanh); <b>Return value</b> — <code>accTransferSummaryList</code>, kiểu <code>List&lt;Clm13ReqConfirmModel&gt;</code> (khung đỏ); <b>Exception</b> — <code>DataConversionException</code> (khi đổi ngày giờ từ String sang Date) và <code>DataRetrievalException</code> (khi gọi mapper). Thường chọn: <b>tham số → giá trị đầu vào, giá trị trả về → giá trị mong đợi</b>. “Nhưng để phủ hết các nhánh của method ta cần thêm dữ liệu đầu vào” — ở đây method không có tham số nào, nên mọi đầu vào phải đến từ chỗ khác (cấu hình, DB, mức log).</p>`],
      [12, 'How to write — II Branches to cover',
        `<p>The processing table of the design (columns: processing item, tag, contents of processing, remarks). The green arrows mark every branch to cover: <b>when log level is DEBUG</b> → output the start log “getAccountTransferSummaryList Start”; declare the list and read <code>recordsLimit</code> from appConfig; <b>call mapper</b> <code>AutomaticDraftCntMapper.selectAutomaticDraftCnt</code> with recordsLimit (max records), returning <code>List&lt;AutomaticDraftCntEntity&gt;</code>; <b>when the mapper call has an exception</b> → debug log and throw <code>DataRetrievalException</code> “Failed to get Account Transfer Summary Data”; <b>when setting the data raises an exception</b> → throw <code>DataConversionException</code> “Failed to convert from String to Date”; <b>when log level is DEBUG</b> → end log; return the list. Each “when …” is a decision with two outcomes.</p>`,
        `<p>Bảng mô tả xử lý của thiết kế (cột: mục xử lý, tag, nội dung xử lý, ghi chú). Mũi tên xanh đánh dấu mọi nhánh phải phủ: <b>khi mức log là DEBUG</b> → ghi log bắt đầu “getAccountTransferSummaryList Start”; khai báo list và đọc <code>recordsLimit</code> từ appConfig; <b>gọi mapper</b> <code>AutomaticDraftCntMapper.selectAutomaticDraftCnt</code> với recordsLimit (số bản ghi tối đa), trả về <code>List&lt;AutomaticDraftCntEntity&gt;</code>; <b>khi gọi mapper bị exception</b> → ghi debug log và ném <code>DataRetrievalException</code> “Failed to get Account Transfer Summary Data”; <b>khi gán dữ liệu bị exception</b> → ném <code>DataConversionException</code> “Failed to convert from String to Date”; <b>khi mức log là DEBUG</b> → log kết thúc; trả về list. Mỗi chữ “khi …” là một quyết định có hai kết quả.</p>`],
      [13, 'III Determine input values',
        `<p>From the design pieces (“these images cut from DS at sheet No.13” — the design is an Excel sheet numbered 13) come three inputs: <b>Log: DEBUG</b> (the log level drives the start/end-log branches), <b>recordsLimit</b> (the configured maximum), and <b>data stored in the database</b> (what the mapper returns). “Exception depend on” data: the two exceptions are provoked by the input data (bad limit, bad date string in the DB). Lesson: inputs of a unit = everything that influences its behaviour, not only its parameters (guide slide 41).</p>`,
        `<p>Từ các mảnh thiết kế (“ảnh cắt từ DS ở sheet No.13” — thiết kế là một sheet Excel đánh số 13) rút ra ba đầu vào: <b>Log: DEBUG</b> (mức log điều khiển nhánh log bắt đầu/kết thúc), <b>recordsLimit</b> (giá trị tối đa đã cấu hình), và <b>dữ liệu lưu trong database</b> (thứ mapper trả về). “Exception depend on” dữ liệu: hai exception được gây ra bởi dữ liệu đầu vào (limit sai, chuỗi ngày sai trong DB). Bài học: đầu vào của unit = mọi thứ ảnh hưởng tới hành vi của nó, không chỉ tham số (slide 41 của bộ hướng dẫn).</p>`],
      [14, 'IV Expected values',
        `<p>The expected values: <b>message</b> (the start and end log lines, and the message when an exception occurs), <b>accTransferSummaryList</b> (the return value) and <b>Exception</b> (DataConversionException, DataRetrievalException from the “Exception output” rows). Expected = return value + observable side effects (log) + exceptions — the template's Return / Exception / Log message rows.</p>`,
        `<p>Các giá trị mong đợi: <b>message</b> (dòng log bắt đầu, kết thúc, và thông báo khi có exception), <b>accTransferSummaryList</b> (giá trị trả về) và <b>Exception</b> (DataConversionException, DataRetrievalException từ các dòng “Exception output”). Mong đợi = giá trị trả về + tác dụng phụ quan sát được (log) + exception — chính là các dòng Return / Exception / Log message của template.</p>`],
      [15, 'Fill values — header',
        `<p>First fill the header: <b>Function ID</b> (here CLM13), <b>Testing targeted class name</b> (<code>Clm13ReqConfirmService</code>), UT process test type (“Function from another test”), and the <b>name of the method</b> (getAccountTransferSummaryList) both at the top of the input block and on the sheet tab. One sheet per method.</p>`,
        `<p>Trước hết điền phần đầu: <b>Function ID</b> (ở đây CLM13), <b>Testing targeted class name</b> (<code>Clm13ReqConfirmService</code>), UT process test type (“Function from another test”), và <b>tên method</b> (getAccountTransferSummaryList) cả ở đầu khối input lẫn trên tab sheet. Mỗi method một sheet.</p>`],
      [16, 'Fill values — inputs and expected values',
        `<p>Second step: write the <b>input values</b> (red frame: log, recordsLimit, data of database) and <b>expected values</b> (blue frame: message, accTransferSummaryList, Exception) found on slides 13–14 as row labels. The value cells are still empty — values come next. (The slide says “sheet No.14, No.15” but means the deck's slides 13–14.)</p>`,
        `<p>Bước hai: ghi <b>giá trị đầu vào</b> (khung đỏ: log, recordsLimit, data of database) và <b>giá trị mong đợi</b> (khung xanh: message, accTransferSummaryList, Exception) tìm được ở slide 13–14 làm nhãn dòng. Các ô giá trị còn trống — giá trị điền ở bước sau. (Slide ghi “sheet No.14, No.15” nhưng ý là slide 13–14 của bộ này.)</p>`],
      [17, 'Fill values — choose values by normal / abnormal / boundary',
        `<p>Next: choose the concrete values by category <b>normal, abnormal, boundary</b>. The filled matrix has eight cases 00001–00008; the classification row uses the Japanese abbreviations <b>異</b> (abnormal), <b>正</b> (normal), <b>境</b> (boundary). Inputs: log DEBUG for all; recordsLimit null, empty, 100, 99, ABC, −1, 0; database files Clm13AutomaticDraftCntTblData1.txt / Data2.txt. Expected: the Start/End log, “Failed to get Account Transfer Summary Data”, “Failed to convert from String to Date”, result file Clm13AutomaticDraftCntTblResultData.txt or an empty list, DataRetrievalException, DataConversionException. The full reading and a critique are in the worked example below.</p>`,
        `<p>Tiếp theo: chọn giá trị cụ thể theo loại <b>normal, abnormal, boundary</b>. Ma trận đã điền có tám ca 00001–00008; dòng phân loại dùng chữ viết tắt tiếng Nhật <b>異</b> (bất thường), <b>正</b> (bình thường), <b>境</b> (biên). Đầu vào: log DEBUG cho tất cả; recordsLimit null, empty, 100, 99, ABC, −1, 0; file dữ liệu DB Clm13AutomaticDraftCntTblData1.txt / Data2.txt. Mong đợi: log Start/End, “Failed to get Account Transfer Summary Data”, “Failed to convert from String to Date”, file kết quả Clm13AutomaticDraftCntTblResultData.txt hoặc list rỗng, DataRetrievalException, DataConversionException. Cách đọc đầy đủ và phần nhận xét nằm trong ví dụ có lời giải bên dưới.</p>`],
      [18, 'Fill values — each column is a test case',
        `<p>“Each column corresponds with a test case, including input values and expected values.” (The slide says “each row” but the red frame is a <em>column</em> — case 00001.) Example: case 00001 has inputs <b>log = DEBUG, recordsLimit = null</b> and expected value <b>accTransferSummaryList = empty</b>, classification 異 (abnormal). This column becomes one JUnit test method: set log level, set recordsLimit to null, call the method, assert the list is empty.</p>`,
        `<p>“Mỗi cột ứng với một test case, gồm giá trị đầu vào và giá trị mong đợi.” (Slide ghi “each row” nhưng khung đỏ là một <em>cột</em> — ca 00001.) Ví dụ: ca 00001 có đầu vào <b>log = DEBUG, recordsLimit = null</b> và giá trị mong đợi <b>accTransferSummaryList = empty</b>, phân loại 異 (bất thường). Cột này thành một method JUnit: đặt mức log, gán recordsLimit = null, gọi method, assert list rỗng.</p>`],
      [19, 'PCL writing rules 1–4',
        `<p>The “12 rules” (the slide's auto-numbering is broken — it shows 1, 1, 1, 1; read 1–4): <b>1</b> the PCL is written by the <b>developer</b>; <b>2</b> the PCL <b>follows the DS strictly</b>; <b>3</b> inputs and outputs are <b>specific values</b>; <b>4</b> the PCL must have <b>normal, abnormal and boundary</b> cases — normal = values used mainly and usually to show the function works; boundary = limit values containing the upper and lower values; abnormal = non-expected values, usually processed as exceptions. <b>Error in the example:</b> for 5 ≤ input ≤ 10 the slide calls 6, 7, 8, 9 normal, <b>4 and 11 boundary</b>, and −1, 12 abnormal. By boundary value analysis the boundaries are <b>5 and 10</b> (valid) with neighbours 4 and 11 (invalid) — the template's own guideline says “5, 10 are boundary values”. Use the template's version.</p>`,
        `<p>“12 quy tắc” (số tự động của slide bị hỏng — hiện 1, 1, 1, 1; đọc là 1–4): <b>1</b> PCL do <b>developer</b> viết; <b>2</b> PCL <b>bám sát DS</b>; <b>3</b> đầu vào và đầu ra là <b>giá trị cụ thể</b>; <b>4</b> PCL phải có ca <b>normal, abnormal và boundary</b> — normal = giá trị dùng chủ yếu, thường ngày để thấy chức năng chạy; boundary = giá trị giới hạn gồm giá trị trên và dưới; abnormal = giá trị không mong đợi, thường được xử lý bằng exception. <b>Lỗi trong ví dụ:</b> với 5 ≤ input ≤ 10, slide gọi 6, 7, 8, 9 là normal, <b>4 và 11 là boundary</b>, còn −1, 12 là abnormal. Theo phân tích giá trị biên, biên là <b>5 và 10</b> (hợp lệ) với láng giềng 4 và 11 (không hợp lệ) — chính guideline của template ghi “5, 10 là giá trị biên”. Hãy theo bản của template.</p>`],
      [20, 'PCL writing rules 5–8',
        `<p>(Shown as 5, 5, 5, 5; read 5–8.) <b>5</b> mention clearly the <b>log information and exceptions</b>; <b>6</b> the PCL must cover <b>C0/C1 100 %</b>; <b>7</b> the PCL must reach <b>100 test cases per KS</b> (KS = kilo-steps ≈ 1,000 lines of code), with up to 30 % difference allowed — the same norm as the template's “Normal number of test cases/KLOC = 100”; <b>8</b> confirm the <b>screen design (UI) of input/output items</b>: maximum length, display length, active/inactive, alignment (left, centre, right), initial value, input/output format (yyyyMMdd), colour.</p>`,
        `<p>(Hiện là 5, 5, 5, 5; đọc là 5–8.) <b>5</b> ghi rõ <b>thông tin log và exception</b>; <b>6</b> PCL phải phủ <b>C0/C1 100 %</b>; <b>7</b> PCL phải đạt <b>100 test case trên mỗi KS</b> (KS = kilo-step ≈ 1.000 dòng code), cho phép chênh tới 30 % — cùng định mức với “Normal number of test cases/KLOC = 100” của template; <b>8</b> xác nhận <b>thiết kế màn hình (UI) của mục vào/ra</b>: độ dài tối đa, độ dài hiển thị, bật/tắt, căn lề (trái, giữa, phải), giá trị ban đầu, định dạng vào/ra (yyyyMMdd), màu.</p>`],
      [21, 'PCL writing rules 9–12',
        `<p>(Shown as 9, 9, 9, 9; read 9–12.) <b>9</b> confirm the <b>screen layout</b>: colour, character format (font size, type, character type), arrangement of elements, punctuation, itemisation, error display; <b>10</b> confirm <b>character encoding</b>; <b>11</b> confirm the <b>log written to the log file</b>; <b>12</b> confirm <b>DB changes (insert, update, delete)</b>. Rules 8–12 remind you that expected results include what appears on screen, in files and in the database — not only return values.</p>`,
        `<p>(Hiện là 9, 9, 9, 9; đọc là 9–12.) <b>9</b> xác nhận <b>bố cục màn hình</b>: màu, định dạng chữ (cỡ, kiểu font, loại ký tự), sắp xếp phần tử, dấu câu, gạch đầu dòng, hiển thị lỗi; <b>10</b> xác nhận <b>mã hoá ký tự</b>; <b>11</b> xác nhận <b>log được ghi vào file log</b>; <b>12</b> xác nhận <b>thay đổi DB (insert, update, delete)</b>. Quy tắc 8–12 nhắc rằng kết quả mong đợi gồm cả thứ hiện trên màn hình, trong file và trong database — không chỉ giá trị trả về.</p>`],
      [22, 'After completed PCL document (section divider)',
        `<p>Divider: what happens once the PCL is written.</p>`,
        `<p>Trang ngăn: chuyện gì xảy ra sau khi viết xong PCL.</p>`],
      [23, 'PCL flow',
        `<p>The review loop: <b>Completed make PCL</b> → ① <b>self-check by the PCL checklist</b> → ② <b>inform the team lead to review</b> → if the team lead detects defects → <b>confirm with the team lead</b> → <b>correct the PCL document</b> → <b>similar check</b> (look for the same mistake everywhere else you made) → back to review; when accepted → ③ <b>implement the unit test script</b>. It is a small formal review process (Ch.3): individual preparation (self-check with a checklist), review by a reviewer, fixing and follow-up — and only a reviewed PCL may be turned into code.</p>`,
        `<p>Vòng review: <b>Viết xong PCL</b> → ① <b>tự kiểm bằng PCL checklist</b> → ② <b>báo team lead review</b> → nếu team lead phát hiện defect → <b>xác nhận với team lead</b> → <b>sửa tài liệu PCL</b> → <b>similar check</b> (tìm cùng lỗi đó ở mọi chỗ khác mình đã làm) → quay lại review; khi được chấp nhận → ③ <b>viết unit test script</b>. Đây là một quy trình review chính thức thu nhỏ (Chương 3): chuẩn bị cá nhân (tự kiểm theo checklist), review bởi người review, sửa và theo dõi — và chỉ PCL đã được review mới được biến thành code.</p>`],
      [24, 'Unit test flow (section divider)',
        `<p>Divider for the unit-test flow (same confidentiality speaker note as slide 7).</p>`,
        `<p>Trang ngăn phần luồng unit test (cùng ghi chú bảo mật như slide 7).</p>`],
      [25, 'Unit test flow — develop UT scripts',
        `<p>Three stages. <b>Write UT scripts</b>: follow the coding convention and the reviewed PCL; fix errors/warnings of the static checking tool; perform <b>desk debugging</b> with the DD checklist; commit to your SVN repository and open a review ticket in <b>Fisheye and Crucible</b> (Atlassian code-review tools). <b>Review UT scripts</b>: against the DD checklist and the PCL; record and follow up comments/defects in Crucible &amp; Fisheye; fix and similar-check each defect; share issues in the daily meeting; record defects in JIRA. <b>Execute UT</b>: run the scripts in Eclipse; fix, record failed cases in JIRA and the <b>B-Voucher</b> (bug slip, the guide's Bug List); update the PCL with bugs and evidence; capture screenshots of the coverage result from <b>djUnit</b> (an Eclipse JUnit plug-in with coverage). The test code itself is reviewed — test scripts are work products too.</p>`,
        `<p>Ba giai đoạn. <b>Viết UT script</b>: theo coding convention và PCL đã review; sửa lỗi/cảnh báo của công cụ kiểm tĩnh; <b>desk debug</b> theo DD checklist; commit vào repo SVN của mình và mở ticket review trên <b>Fisheye và Crucible</b> (công cụ review code của Atlassian). <b>Review UT script</b>: đối chiếu DD checklist và PCL; ghi và theo dõi comment/defect trên Crucible &amp; Fisheye; sửa và similar-check từng defect; chia sẻ vấn đề trong họp hằng ngày; ghi defect vào JIRA. <b>Chạy UT</b>: chạy script trong Eclipse; sửa, ghi ca fail vào JIRA và <b>B-Voucher</b> (phiếu bug, tức Bug List của bộ hướng dẫn); cập nhật PCL với bug và bằng chứng; chụp màn hình kết quả coverage của <b>djUnit</b> (plug-in JUnit cho Eclipse có đo coverage). Bản thân code test cũng được review — test script cũng là sản phẩm công việc.</p>`],
      [26, 'Unit test flow — input',
        `<p>Inputs of the UT phase: <b>detailed design documents</b>; <b>PCL creation points from Hitachi</b> (Checklist_creation_viewpoint.xlsx — the Testing Concerns; UnitTestPoints_EN.XLSX of L2.9 is this kind of file); <b>PCL review checklist</b> (PCL_Checklist.xlsx); <b>coding conventions</b> (JavaCodingStandards.doc, JavaScriptCodingStandard.doc, NamingStandard.docx); <b>desk debug checklist</b> (DDChecklist.xls); <b>code coverage tool</b> (djUnit); <b>static checking tools</b> (CheckStyle, FindBugs, SonarLint). Today's equivalents: JaCoCo or IntelliJ coverage, SpotBugs (successor of FindBugs), SonarLint.</p>`,
        `<p>Đầu vào của pha UT: <b>tài liệu detailed design</b>; <b>điểm tạo PCL của Hitachi</b> (Checklist_creation_viewpoint.xlsx — Testing Concerns; file UnitTestPoints_EN.XLSX ở bài L2.9 là loại file này); <b>checklist review PCL</b> (PCL_Checklist.xlsx); <b>coding convention</b> (JavaCodingStandards.doc, JavaScriptCodingStandard.doc, NamingStandard.docx); <b>checklist desk debug</b> (DDChecklist.xls); <b>công cụ coverage</b> (djUnit); <b>công cụ kiểm tĩnh</b> (CheckStyle, FindBugs, SonarLint). Tương đương ngày nay: JaCoCo hoặc coverage của IntelliJ, SpotBugs (kế thừa FindBugs), SonarLint.</p>`],
      [27, 'Unit test flow — output',
        `<p>Outputs: PCL documents · UT scripts · UT B-Voucher (bug records) · coverage report · code-review defects in Crucible &amp; Fisheye and JIRA · Checkstyle and FindBugs reports on the Jenkins build server · Sonar static-checking report on the Sonar server · <b>quality evaluation report for the UT phase</b>. These are the “test work products” of ISTQB (LO-1.4.3) for one level; the last one feeds the leader's evaluation (guide slide 35).</p>`,
        `<p>Đầu ra: tài liệu PCL · UT script · UT B-Voucher (bản ghi bug) · báo cáo coverage · defect review code trên Crucible &amp; Fisheye và JIRA · báo cáo Checkstyle và FindBugs trên máy build Jenkins · báo cáo kiểm tĩnh trên máy chủ Sonar · <b>báo cáo đánh giá chất lượng pha UT</b>. Đây là các “test work product” của ISTQB (LO-1.4.3) cho một cấp test; cái cuối cùng là đầu vào cho đánh giá của leader (slide 35 bộ hướng dẫn).</p>`],
      [28, 'Best Practice (section divider)',
        `<p>Divider for the best-practice slide.</p>`,
        `<p>Trang ngăn phần best practice.</p>`],
      [29, 'Best practice — choose data to test',
        `<p><b>Keep in mind:</b> (1) if two cases have the <b>same input values but different expected values</b>, an input is missing — add it (e.g. DB data or a setting); (2) if the method ends with an exception there is no return value — check only the <b>kind of exception and its message</b>; (3) after writing the PCL, <b>self-review it seriously with the PCL checklist</b>. <b>Special values for boundary tests:</b> numbers — null, 0, −1 (test negatives even where only correct values can be entered); strings — null, "" (empty), "  " (spaces); date/time — 1/1, 12/31, 2/29, 2/28, 3/1, and the Japanese era change <b>昭和64年1月7日 (Shōwa 64, 7 Jan 1989 — the last day of the Shōwa era)</b> and <b>平成元年1月8日 (Heisei 1, 8 Jan 1989 — the first day of Heisei)</b>, 0:00:00, 23:59:59, special dates of the specification; files — 0 bytes, file exists or not. The same table is the “BoundaryLimitValue” sheet of the checklists (L2.6).</p>`,
        `<p><b>Luôn nhớ:</b> (1) nếu hai ca <b>cùng giá trị đầu vào mà khác giá trị mong đợi</b>, là đang thiếu một đầu vào — bổ sung (ví dụ dữ liệu DB hay cấu hình); (2) nếu method kết thúc bằng exception thì không có giá trị trả về — chỉ kiểm <b>loại exception và message</b>; (3) viết PCL xong, <b>tự review nghiêm túc theo PCL checklist</b>. <b>Giá trị đặc biệt cho test biên:</b> số — null, 0, −1 (thử cả số âm kể cả khi chỉ nhập được giá trị đúng); chuỗi — null, "" (rỗng), "  " (khoảng trắng); ngày giờ — 1/1, 12/31, 2/29, 2/28, 3/1, và mốc đổi niên hiệu Nhật <b>昭和64年1月7日 (Shōwa 64, 7/1/1989 — ngày cuối thời Shōwa)</b> và <b>平成元年1月8日 (Heisei 1, 8/1/1989 — ngày đầu thời Heisei)</b>, 0:00:00, 23:59:59, các ngày đặc biệt trong đặc tả; file — 0 byte, file có hay không. Cùng bảng này là sheet “BoundaryLimitValue” của các checklist (bài L2.6).</p>`],
      [30, 'Questions and discussion',
        `<p>Q&amp;A slide. Good questions to bring to class: which DB data counts as “input” for a DAO method? how do you classify a value that is both a boundary and invalid (e.g. 11 for 5–10)? — UnitTestPoints (L2.9) answers the second: some projects tag it both Limit and Abnormal; otherwise use the order Abnormal / Limit / Normal.</p>`,
        `<p>Slide hỏi đáp. Câu hỏi hay để mang lên lớp: dữ liệu DB nào được coi là “đầu vào” của một method DAO? phân loại thế nào với giá trị vừa là biên vừa không hợp lệ (ví dụ 11 với khoảng 5–10)? — UnitTestPoints (bài L2.9) trả lời câu thứ hai: có dự án gắn cả Limit lẫn Abnormal; nếu chỉ được một thì theo thứ tự ưu tiên Abnormal / Limit / Normal.</p>`],
      [31, 'Thanks you',
        `<p>Closing slide (“Thanks you” — sic).</p>`,
        `<p>Slide kết (“Thanks you” — nguyên văn, sai ngữ pháp).</p>`],
      [32, 'Hitachi logo',
        `<p>Logo page with the confidentiality footer.</p>`,
        `<p>Trang logo kèm chân trang bảo mật.</p>`],
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
<p><b>Apply slide 29's first rule.</b> 00003 and 00008 both have recordsLimit = 100 but different expected results — legitimate only because the DB data differs; that is why “Data of database” must be an input row. <b>Review comments a team lead would write:</b></p>
<ol>
<li>The “getAccountTransferSummaryList Start / End” message rows carry no “O” in any column — the DEBUG-log branches are listed as expected values but never confirmed (rule 5: log information must be clear).</li>
<li>00004 (99) has no DB data marked, yet expects the result file — either a precondition is missing or the case duplicates 00003.</li>
<li>No case with log level ≠ DEBUG, so the false outcome of “when log level is DEBUG” is never executed → C1 &lt; 100 % (rule 6).</li>
<li>Where is the boundary of the maximum? If the list holds more rows than recordsLimit, a case with exactly recordsLimit and recordsLimit + 1 rows in the DB is the real boundary; −1 and 0 are boundaries of “valid limit”, and their expected result “empty” should be confirmed against the design.</li>
</ol>
<div class="pitfall"><b>Boundary values in the PCL deck are off by one.</b> Slide 19 says that for 5 ≤ x ≤ 10 the boundary values are 4 and 11. In ISTQB two-value BVA the boundary values are the edges of each partition: <b>5 and 10</b> (valid) and <b>4 and 11</b> (invalid neighbours); tests use all four. An exam option “the boundary values are 4 and 11” is wrong.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>From screenshots to CI evidence.</b> The 2017 flow asks for screenshots of djUnit coverage and bugs typed into B-Vouchers. Modern teams let the build produce the evidence: Maven/Gradle run JUnit on every push, JaCoCo writes an HTML/XML report, the CI server (Jenkins, GitHub Actions) fails the build when line or branch coverage drops below a threshold (the JaCoCo <code>check</code> goal), and SonarQube shows coverage per changed line — an automated RC0. <em>Outside the syllabus because CTFL treats tools generically (Ch.6) without covering build pipelines.</em></div>`,
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
<p><b>Áp quy tắc đầu tiên của slide 29.</b> 00003 và 00008 cùng recordsLimit = 100 mà khác kết quả mong đợi — chỉ hợp lệ vì dữ liệu DB khác nhau; đó là lý do “Data of database” phải là một dòng đầu vào. <b>Nhận xét review mà team lead sẽ ghi:</b></p>
<ol>
<li>Các dòng message “getAccountTransferSummaryList Start / End” không có dấu “O” ở cột nào — nhánh log DEBUG được liệt kê là giá trị mong đợi nhưng chưa bao giờ được xác nhận (quy tắc 5: thông tin log phải rõ).</li>
<li>00004 (99) không đánh dữ liệu DB nào mà vẫn mong đợi file kết quả — hoặc thiếu precondition, hoặc ca này trùng với 00003.</li>
<li>Không có ca nào mức log ≠ DEBUG, nên kết quả “sai” của “khi mức log là DEBUG” chưa bao giờ được chạy → C1 &lt; 100 % (quy tắc 6).</li>
<li>Biên của số tối đa ở đâu? Nếu DB có nhiều dòng hơn recordsLimit, ca có đúng recordsLimit và recordsLimit + 1 dòng trong DB mới là biên thật; −1 và 0 là biên của “limit hợp lệ”, và kết quả “rỗng” của chúng cần được đối chiếu với thiết kế.</li>
</ol>
<div class="pitfall"><b>Giá trị biên trong bộ slide PCL bị lệch một đơn vị.</b> Slide 19 nói với 5 ≤ x ≤ 10 thì giá trị biên là 4 và 11. Theo BVA hai giá trị của ISTQB, giá trị biên là mép của mỗi phân vùng: <b>5 và 10</b> (hợp lệ) và <b>4 và 11</b> (láng giềng không hợp lệ); test dùng cả bốn. Phương án thi “giá trị biên là 4 và 11” là sai.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Từ ảnh chụp màn hình tới bằng chứng CI.</b> Luồng năm 2017 đòi chụp màn hình coverage djUnit và gõ bug vào B-Voucher. Nhóm hiện đại để bản build tự sinh bằng chứng: Maven/Gradle chạy JUnit mỗi lần push, JaCoCo xuất báo cáo HTML/XML, máy CI (Jenkins, GitHub Actions) đánh fail bản build khi line hay branch coverage tụt dưới ngưỡng (goal <code>check</code> của JaCoCo), và SonarQube hiện coverage trên từng dòng thay đổi — một RC0 tự động. <em>Ngoài giáo trình vì CTFL chỉ bàn công cụ một cách tổng quát (Chương 6), không đi vào pipeline build.</em></div>`),
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
<p class="lead">The structural variant of Lab 2: you take source code from your SWP391 project, design unit test cases in the template, implement them with a unit-test framework (JUnit for Java) and prove with a coverage report that every statement (C0) and every decision outcome (C1) has been executed. The deck is short — unit testing in the SDLC, the three box techniques, benefits, what makes a good unit test, the lab brief and the tools — and the white-box checklist is the self-review you run before you submit.</p>
<div class="callout"><b>Learning objectives.</b> Explain who performs unit testing and why it is done early (LO-2.2.1) · distinguish white-box, black-box and grey-box testing (LO-4.1.1, K2) · apply statement and decision coverage to your own code (LO-4.3.1/4.3.2) · list the properties of good unit tests (single unit, isolated, fast, repeatable, clearly named) · self-check a Lab 2 submission with the 22-item checklist.</div>`,
    `<span class="eyebrow">Lab 2 · Bài L2.6 · Lab2_component(Structural)testing slide 1–13 + CheckList_UT_Whitebox.xlsx</span>
<h2>Lab 2 white-box: test code của chính bạn tới C0 = C1 = 100 %</h2>
<p class="lead">Biến thể cấu trúc của Lab 2: bạn lấy source code từ dự án SWP391, thiết kế unit test case trong template, cài đặt bằng một unit-test framework (JUnit với Java) và chứng minh bằng báo cáo coverage rằng mọi câu lệnh (C0) và mọi kết quả quyết định (C1) đều đã được chạy. Bộ slide ngắn — unit test trong SDLC, ba kỹ thuật “hộp”, lợi ích, thế nào là unit test tốt, đề bài và công cụ — còn checklist white-box là bản tự review bạn chạy trước khi nộp.</p>
<div class="callout"><b>Chuẩn đầu ra.</b> Giải thích ai làm unit test và vì sao làm sớm (LO-2.2.1) · phân biệt white-box, black-box và grey-box (LO-4.1.1, K2) · áp dụng statement và decision coverage trên code của mình (LO-4.3.1/4.3.2) · kể được tính chất của unit test tốt (một unit, cô lập, nhanh, lặp lại được, đặt tên rõ) · tự kiểm bài nộp Lab 2 bằng checklist 22 mục.</div>`),
    walkHead(WB, 1, 13),
    walk(WB, [
      [1, 'LAB2: Component (structural) testing using unit test framework',
        `<p>Title: <b>component (structural) testing using a unit test framework</b>. “Structural” = white-box: test cases are derived from the internal structure (the code), and success is measured by structural coverage. “Using a unit test framework” = the tests are code (JUnit), not only a spreadsheet.</p>`,
        `<p>Tựa đề: <b>component test cấu trúc bằng unit test framework</b>. “Structural” = white-box: test case rút ra từ cấu trúc bên trong (code), và thành công đo bằng coverage cấu trúc. “Bằng unit test framework” = test là code (JUnit), không chỉ là bảng tính.</p>`],
      [2, 'Unit testing in the SDLC',
        `<p>Unit testing is <b>not new</b> — as old as programming. It improves code quality <b>by verifying every unit of the code</b> used to implement functional requirements. It is the basis of <b>test-driven development (TDD)</b>, test-first development (the slide misspells it “Test drove development”). It is <b>done by developers and sometimes white-box testers</b> (red) — the ISTQB answer to “who does component testing?”: usually the developer who wrote the code.</p>`,
        `<p>Unit test <b>không phải khái niệm mới</b> — có từ thuở đầu của lập trình. Nó nâng chất lượng code <b>bằng cách kiểm từng unit của code</b> dùng để hiện thực yêu cầu chức năng. Nó là nền tảng của <b>test-driven development (TDD)</b>, phát triển test trước (slide viết nhầm “Test drove development”). Nó <b>do developer làm, đôi khi do tester white-box</b> (chữ đỏ) — đúng câu trả lời ISTQB cho “ai làm component testing?”: thường là developer viết ra code đó.</p>`],
      [3, 'Unit testing in the SDLC (2) — and the warning',
        `<p>Unit testing helps design <b>robust components</b>, maintain code and remove issues in code units; it finds and fixes defects <b>early</b>; it is an integral part of agile development (“an related part” — typo for “integral”, as the teacher's note “Integral: liên quan” hints); as a standard process it catches many defects early and saves testing time. The red <em>Notes</em>: many developers hate unit tests — they skip them or write bad ones under schedule pressure, even <b>empty unit tests so that 100 % of them pass</b>. “It's important to write good unit tests or don't write them at all.” That is the reason the lab checklist (item 22) asks whether each script really asserts something.</p>`,
        `<p>Unit test giúp thiết kế <b>component vững chắc</b>, bảo trì code và loại bỏ lỗi trong từng unit; nó tìm và sửa defect <b>sớm</b>; nó là phần gắn liền của phát triển agile (“an related part” — gõ nhầm của “integral”, như ghi chú của thầy/cô “Integral: liên quan” gợi ý); làm thành quy trình chuẩn thì bắt được nhiều defect sớm và tiết kiệm thời gian test. Phần <em>Notes</em> màu đỏ: nhiều developer ghét unit test — bỏ qua hoặc viết qua loa vì áp lực tiến độ, thậm chí viết <b>unit test rỗng để 100 % đều pass</b>. “Viết unit test tốt, hoặc đừng viết.” Đó là lý do mục 22 của checklist lab hỏi mỗi script có thật sự assert gì không.</p>`],
      [4, 'Unit testing methods: manual and automated',
        `<p>Two ways: <b>manual</b> (a person runs the unit via a driver or a debugger and compares by eye) and <b>automated</b> (a framework runs the tests and compares actual with expected by assertions). The template records results either way, but Lab 2 expects automated JUnit scripts because only they can be re-run for regression (guide slide 33) at no cost.</p>`,
        `<p>Hai cách: <b>thủ công</b> (người chạy unit qua driver hay debugger rồi so bằng mắt) và <b>tự động</b> (framework chạy test và so thực tế với mong đợi bằng assertion). Template ghi kết quả cho cả hai, nhưng Lab 2 muốn JUnit script tự động vì chỉ chúng mới chạy lại được để regression (slide 33 bộ hướng dẫn) mà không tốn công.</p>`],
      [5, 'White-box testing',
        `<p><b>White-box</b>: the tester knows the internal structure including the code; can test against the design and the requirements; also called <b>transparent</b> (glass-box) testing. Diagram: input → a box showing the control flow → output. ISTQB: white-box techniques are based on the internal structure (statement, decision coverage) — LO-4.1.1.</p>`,
        `<p><b>White-box</b>: tester biết cấu trúc bên trong kể cả code; test được so với thiết kế và yêu cầu; còn gọi là kiểm thử <b>trong suốt</b> (glass-box). Hình: input → hộp thấy được luồng điều khiển → output. ISTQB: kỹ thuật white-box dựa trên cấu trúc bên trong (statement, decision coverage) — LO-4.1.1.</p>`],
      [6, 'Black-box testing',
        `<p><b>Black-box</b>: the tester does not know the internal structure or the code — only inputs, outputs and the specification (diagram: input → executable program → output). This is the black-box variant of Lab 2 (L2.7): the test basis is the detail design, not the code. (The teacher's note “Robust: mạnh mẽ | Integral: liên quan” translates two words of slide 3.)</p>`,
        `<p><b>Black-box</b>: tester không biết cấu trúc bên trong hay code — chỉ biết đầu vào, đầu ra và đặc tả (hình: input → chương trình chạy được → output). Đây là biến thể black-box của Lab 2 (bài L2.7): test basis là detail design, không phải code. (Ghi chú của thầy/cô “Robust: mạnh mẽ | Integral: liên quan” dịch hai từ ở slide 3.)</p>`],
      [7, 'Grey-box testing',
        `<p><b>Grey-box</b> = a combination of black-box and white-box (“semi-transparent”): the tester knows part of the internal structure, functions and designs, plus the requirements. Example: you design cases from the DD (black-box) but you know the table structure and check the DB rows after the call. Grey-box is not an ISTQB CTFL technique category — the syllabus has black-box, white-box and experience-based.</p>`,
        `<p><b>Grey-box</b> = kết hợp black-box và white-box (“bán trong suốt”): tester biết một phần cấu trúc bên trong, chức năng và thiết kế, cộng với yêu cầu. Ví dụ: bạn thiết kế ca từ DD (black-box) nhưng biết cấu trúc bảng và kiểm các dòng DB sau lời gọi. Grey-box không phải một nhóm kỹ thuật trong CTFL — syllabus chỉ có black-box, white-box và experience-based.</p>`],
      [8, 'Benefits of unit testing',
        `<p>Ten benefits: the process becomes agile · code quality improves · bugs are detected early · easier changes and simpler integration · documentation (tests show how a unit is meant to be used) · easier debugging (a failing unit test points at one unit) · lower cost · code completeness can be demonstrated · development time is saved · <b>code coverage can be measured</b>. The last one is the lab's acceptance criterion.</p>`,
        `<p>Mười lợi ích: quy trình linh hoạt hơn · chất lượng code tốt lên · phát hiện bug sớm · thay đổi dễ và tích hợp đơn giản · có tài liệu (test cho thấy unit được dùng thế nào) · debug dễ (unit test fail chỉ thẳng vào một unit) · chi phí thấp hơn · chứng minh được code hoàn chỉnh · tiết kiệm thời gian phát triển · <b>đo được code coverage</b>. Cái cuối chính là tiêu chí nghiệm thu của lab.</p>`],
      [9, 'How to write good unit tests',
        `<p>(1) Verify <b>one unit</b>, not the integration. (2) <b>Small, isolated</b>, with <b>clear names</b> — easy to write and maintain. (3) Changing another part of the software must not break the test if it is isolated. (4) It must <b>run quickly</b>. (5) It should be <b>reusable</b> (repeatable). The teacher's note gives the Vietnamese of each line. These are close to the well-known F.I.R.S.T. properties: Fast, Isolated, Repeatable, Self-validating (asserts), Timely (written with or before the code).</p>`,
        `<p>(1) Kiểm <b>một unit</b>, không phải phần tích hợp. (2) <b>Nhỏ, cô lập</b>, <b>đặt tên rõ ràng</b> — dễ viết, dễ bảo trì. (3) Sửa phần khác của phần mềm không được làm gãy test nếu nó được cô lập. (4) Phải <b>chạy nhanh</b>. (5) Phải <b>dùng lại được</b> (chạy lặp lại được). Ghi chú của thầy/cô dịch sẵn từng dòng sang tiếng Việt. Các ý này gần với bộ tính chất F.I.R.S.T.: Fast (nhanh), Isolated (cô lập), Repeatable (lặp lại được), Self-validating (tự kiểm bằng assert), Timely (viết cùng lúc hoặc trước code).</p>`],
      [10, 'Lab 2 — the brief and the grading',
        `<p>The actual assignment (in Vietnamese): <b>individual</b>; choose one tool from the tools slide to study and do the UT with; report with the <b>UT test case template</b> of the lab; <b>test basis: source code you prepare yourself, taken from SWP391</b>; deliver the UT test cases (with the checklist) / JUnit test script; test report with <b>C0: 100 %, C1: 100 %</b>. Grading: no submission 1 point; &lt; 100 LOC 1–4; 101–200 LOC 5; 201–250 LOC 6; 251–300 LOC 7; &gt; 300 LOC 8; source-code difficulty 0–2. (The brief points to “slide 12” for the tools; in this deck the tool list is slide 11 and slides 12–13 describe NUnit and JUnit.) Choose code with real branching and exceptions: difficulty points are given for it, and a getter/setter class earns nothing.</p>`,
        `<p>Đề bài thật (tiếng Việt): <b>làm cá nhân</b>; chọn một công cụ ở slide công cụ để nghiên cứu và thực hiện UT; báo cáo bằng <b>template UT test case</b> kèm theo lab; <b>test basis: source code tự chuẩn bị, lấy từ môn SWP391</b>; nộp UT test case (kèm checklist) / JUnit test script; báo cáo test yêu cầu <b>C0: 100 %, C1: 100 %</b>. Chấm điểm: không nộp 1 điểm; &lt; 100 LOC 1–4; 101–200 LOC 5; 201–250 LOC 6; 251–300 LOC 7; &gt; 300 LOC 8; độ khó source code 0–2. (Đề trỏ tới “slide 12” cho công cụ; trong bộ này danh sách công cụ là slide 11, còn slide 12–13 mô tả NUnit và JUnit.) Hãy chọn code có rẽ nhánh và exception thật: được cộng điểm độ khó, còn một class toàn getter/setter thì chẳng được gì.</p>`],
      [11, 'Popular unit testing tools',
        `<p>Three logos: <b>NUnit</b> (.NET), <b>JUnit</b> (Java), <b>TestNG</b> (Java, with test groups, dependencies and data providers). Guide in Vietnamese: “Giới thiệu JUnit — GP Coder (Lập trình Java)”, an introductory article on JUnit. For a Java SWP391 project use JUnit 5 (Jupiter) — its <code>@Test</code>, <code>assertEquals</code>, <code>assertThrows</code> and <code>@ParameterizedTest</code> cover everything the template needs.</p>`,
        `<p>Ba logo: <b>NUnit</b> (.NET), <b>JUnit</b> (Java), <b>TestNG</b> (Java, có nhóm test, phụ thuộc giữa test và data provider). Tài liệu tiếng Việt: “Giới thiệu JUnit — GP Coder (Lập trình Java)”, bài nhập môn JUnit. Dự án SWP391 bằng Java thì dùng JUnit 5 (Jupiter) — <code>@Test</code>, <code>assertEquals</code>, <code>assertThrows</code> và <code>@ParameterizedTest</code> đủ cho mọi thứ template cần.</p>`],
      [12, '#1) NUnit',
        `<p>NUnit: a unit-testing framework for the <b>.NET</b> platform; free; you write test scripts by hand (not generated); works the same way as JUnit does for Java; supports <b>data-driven tests that can run in parallel</b>; uses a <b>console runner</b> to load and execute tests. Pick it if your SWP391 project was C#/ASP.NET. (“#1” and “#18” are the positions in the web article the slides were copied from.)</p>`,
        `<p>NUnit: framework unit test cho nền tảng <b>.NET</b>; miễn phí; viết test script bằng tay (không tự sinh); hoạt động giống JUnit với Java; hỗ trợ <b>test hướng dữ liệu chạy song song</b>; dùng <b>console runner</b> để nạp và chạy test. Chọn nó nếu dự án SWP391 của bạn viết bằng C#/ASP.NET. (“#1” và “#18” là thứ tự trong bài báo trên mạng mà slide chép lại.)</p>`],
      [13, '#18) JUnit',
        `<p>JUnit: open-source unit-testing framework for <b>Java</b>; supports a test-driven environment — “first testing then coding”; test data is tested first and then inserted into the code; provides <b>annotations</b> to identify test methods, <b>assertions</b> to check expected results, and <b>test runners</b>; simple and fast to write. The worked example below uses exactly these three pieces (annotations, assertions, a runner) plus JaCoCo for coverage.</p>`,
        `<p>JUnit: framework unit test mã nguồn mở cho <b>Java</b>; hỗ trợ môi trường hướng test — “test trước, code sau”; dữ liệu test được thử trước rồi mới đưa vào code; cung cấp <b>annotation</b> để đánh dấu method test, <b>assertion</b> để kiểm kết quả mong đợi, và <b>test runner</b>; đơn giản, viết nhanh. Ví dụ có lời giải dưới đây dùng đúng ba thứ đó (annotation, assertion, runner) cộng JaCoCo để đo coverage.</p>`],
    ]),
    bi(`<h3>CheckList_UT_Whitebox.xlsx — sheet “Checklist” (translated)</h3>
<p>Header: Confirm date · Người check (checker) · System name · Function name · Note; columns No · Large item · Medium item · Check item · Result · DefectID · Note. Run it on your own submission before handing in — each “No” is a reason a reviewer would reject the file.</p>
<div class="table-wrap"><table><thead><tr><th>No</th><th>Large item</th><th>Medium item</th><th>Check item</th></tr></thead><tbody>${wbRows(false)}</tbody></table></div>
<h3>Sheet “BoundaryLimitValue” — viewpoint of boundary/limit values</h3>
<ul>
<li><b>What is the boundary per data type:</b> numbers → the value; strings → the length; date/time → the value; files → size, exists / not exists. If a date is passed as a string, test the value too, not only the length.</li>
<li><b>How to choose data:</b> the four values <b>lower limit − 1, lower limit, upper limit, upper limit + 1</b>. Example: employees who joined 2000–2005 → test 1999, 2000, 2005, 2006. If boundaries are complicated you may test every boundary ± 1 uniformly: 1999, 2000, 2001, 2004, 2005, 2006.</li>
<li><b>Special values</b> (bug-prone): numbers — null, 0, −1; strings — null, "" , "    " (spaces); dates — 1/1, 12/31, 2/29, 2/28, 3/1, 1989/1/7 (Shōwa 64), 1989/1/8 (Heisei 1), 0:00:00, 23:59:59; files — 0 bytes, exists or not.</li>
<li><b>Limit value</b> = the limit of a data range set by the language or platform (e.g. <code>Integer.MAX_VALUE</code>); test it the same way, except values beyond the limit that cannot be produced.</li>
</ul>`,
    `<h3>CheckList_UT_Whitebox.xlsx — sheet “Checklist” (đã dịch)</h3>
<p>Đầu trang: Confirm date · Người check · System name · Function name · Note; các cột No · Large item · Medium item · Check item · Result · DefectID · Note. Tự chạy nó trên bài của mình trước khi nộp — mỗi chữ “No” là một lý do người review sẽ trả file.</p>
<div class="table-wrap"><table><thead><tr><th>No</th><th>Nhóm lớn</th><th>Nhóm vừa</th><th>Mục kiểm</th></tr></thead><tbody>${wbRows(true)}</tbody></table></div>
<h3>Sheet “BoundaryLimitValue” — quan điểm giá trị biên/giới hạn</h3>
<ul>
<li><b>Biên theo kiểu dữ liệu:</b> số → giá trị; chuỗi → độ dài; ngày giờ → giá trị; file → kích thước, có / không tồn tại. Nếu ngày được truyền dưới dạng chuỗi thì phải test cả giá trị, không chỉ độ dài.</li>
<li><b>Cách chọn dữ liệu:</b> bốn giá trị <b>cận dưới − 1, cận dưới, cận trên, cận trên + 1</b>. Ví dụ: nhân viên vào công ty 2000–2005 → test 1999, 2000, 2005, 2006. Nếu biên phức tạp có thể test đồng loạt mọi biên ± 1: 1999, 2000, 2001, 2004, 2005, 2006.</li>
<li><b>Giá trị đặc biệt</b> (hay gây bug): số — null, 0, −1; chuỗi — null, "" , "    " (khoảng trắng); ngày — 1/1, 12/31, 2/29, 2/28, 3/1, 1989/1/7 (Shōwa 64), 1989/1/8 (Heisei 1), 0:00:00, 23:59:59; file — 0 byte, có hay không.</li>
<li><b>Giá trị giới hạn (limit)</b> = giới hạn của miền dữ liệu do ngôn ngữ hay nền tảng đặt ra (ví dụ <code>Integer.MAX_VALUE</code>); test theo cùng cách, trừ những giá trị vượt giới hạn không thể tạo ra.</li>
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
<p><b>Step 1 — one case per decision outcome.</b> Decisions: the guard (true/false) and three comparisons. Five cases: 70 kg/1.75 m (BMI 22.86 → Normal), 50 kg (16.33 → Underweight), 80 kg (26.12 → Overweight), 100 kg (32.65 → Obese), weight 0 (exception). JaCoCo 0.8.13, real output:</p>
<pre><code>Tests run: 5, passed: 5, failed: 0
Method classify: lines 10/10, branches 9/10
  L3   PARTLY  if (weightKg &lt;= 0 || heightM &lt;= 0) {  [branches 3/4]</code></pre>
<p>Textbook decision coverage is already 100 % (the guard was true once and false four times), but JaCoCo counts <em>each operand</em> of <code>||</code>: <code>heightM &lt;= 0</code> was never true — exactly guide slide 53's rule “check each sub-condition”.</p>
<p><b>Step 2 — add the missing sub-condition and the boundaries.</b> Height 0 (exception) plus BMI exactly on each boundary: 56.65625 kg (18.5 → Normal), 76.5625 kg (25 → Overweight), 91.875 kg (30 → Obese); with 1.75 m these divisions are exact in floating point (1.75² = 3.0625). Real output:</p>
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
<div class="pitfall"><b>Coverage is necessary, not sufficient.</b> Steps 1 and 2 both show 10/10 lines; only the branch counter revealed the missing height case, and only the boundary cases (UTCID07–09) would catch <code>&lt;=</code> written instead of <code>&lt;</code> — the coverage report is identical with or without them.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>One matrix, one parameterized test.</b> JUnit 5's <code>@ParameterizedTest</code> with <code>@CsvSource({"70,1.75,Normal", "50,1.75,Underweight", …})</code> turns the template's columns into rows of data driving a single test method; a failing row is reported with its own index. It keeps the script aligned with the PCL (checklist item 19) and makes adding a boundary case a one-line change. <em>Outside the syllabus because CTFL does not cover specific frameworks.</em></div>`,
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
<p><b>Bước 1 — mỗi kết quả quyết định một ca.</b> Các quyết định: câu kiểm tra đầu (đúng/sai) và ba phép so sánh. Năm ca: 70 kg/1,75 m (BMI 22,86 → Normal), 50 kg (16,33 → Underweight), 80 kg (26,12 → Overweight), 100 kg (32,65 → Obese), cân nặng 0 (exception). JaCoCo 0.8.13, kết quả thật:</p>
<pre><code>Tests run: 5, passed: 5, failed: 0
Method classify: lines 10/10, branches 9/10
  L3   PARTLY  if (weightKg &lt;= 0 || heightM &lt;= 0) {  [branches 3/4]</code></pre>
<p>Decision coverage theo sách đã 100 % (câu kiểm tra đầu đúng một lần, sai bốn lần), nhưng JaCoCo đếm <em>từng vế</em> của <code>||</code>: <code>heightM &lt;= 0</code> chưa từng đúng — đúng quy tắc “kiểm từng điều kiện con” ở slide 53 bộ hướng dẫn.</p>
<p><b>Bước 2 — thêm điều kiện con còn thiếu và các biên.</b> Chiều cao 0 (exception) cộng BMI đúng bằng từng biên: 56,65625 kg (18,5 → Normal), 76,5625 kg (25 → Overweight), 91,875 kg (30 → Obese); với 1,75 m các phép chia này chính xác tuyệt đối trong số thực (1,75² = 3,0625). Kết quả thật:</p>
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
<div class="pitfall"><b>Coverage là điều kiện cần, chưa đủ.</b> Bước 1 và bước 2 đều cho 10/10 dòng; chỉ bộ đếm nhánh làm lộ ca chiều cao còn thiếu, và chỉ các ca biên (UTCID07–09) mới bắt được lỗi viết <code>&lt;=</code> thay cho <code>&lt;</code> — báo cáo coverage y hệt nhau dù có hay không có chúng.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Một ma trận, một parameterized test.</b> <code>@ParameterizedTest</code> của JUnit 5 với <code>@CsvSource({"70,1.75,Normal", "50,1.75,Underweight", …})</code> biến các cột của template thành các dòng dữ liệu điều khiển một method test duy nhất; dòng nào fail được báo kèm số thứ tự riêng. Nó giữ script khớp với PCL (mục 19 của checklist) và thêm một ca biên chỉ tốn một dòng. <em>Ngoài giáo trình vì CTFL không đi vào framework cụ thể.</em></div>`),
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
<p class="lead">In the functional variant you never see code. You pick one action of a real Japanese batch system from its <strong>Detail Design</strong> (a Javadoc site in the lab folder), derive test cases with equivalence partitioning and boundary value analysis, and write them in the template with a case mix of <strong>Normal &lt; 20 %, Abnormal &gt; 60 %, Boundary &gt; 20 %</strong>. The deck repeats slides 2–9 of the structural deck; the new parts are the brief, the grading by DD size, and the two long checklists.</p>
<div class="callout"><b>Learning objectives.</b> Use a detailed design as the test basis of component testing (LO-2.2.1) · apply EP and BVA to method parameters, DB state and settings (LO-4.2.1/4.2.2, K3) · meet a required N:A:B ratio · review a test-case sheet with the black-box checklists (checklist-based testing, LO-4.4.3) · read the JNAP Detail Design: packages, action classes, parameters, DAOs, constants, message IDs.</div>`,
    `<span class="eyebrow">Lab 2 · Bài L2.7 · Lab2_component(Functional)testing slide 1–14 + checklist black-box + Detail Design</span>
<h2>Lab 2 black-box: unit test từ Detail Design</h2>
<p class="lead">Ở biến thể chức năng bạn không bao giờ nhìn thấy code. Bạn chọn một action của một hệ thống batch Nhật thật trong <strong>Detail Design</strong> (một trang Javadoc trong thư mục lab), rút test case bằng phân vùng tương đương và phân tích giá trị biên, rồi ghi vào template với tỉ lệ <strong>Normal &lt; 20 %, Abnormal &gt; 60 %, Boundary &gt; 20 %</strong>. Bộ slide lặp lại slide 2–9 của bản structural; phần mới là đề bài, cách chấm theo kích thước DD, và hai checklist dài.</p>
<div class="callout"><b>Chuẩn đầu ra.</b> Dùng detailed design làm test basis của component testing (LO-2.2.1) · áp dụng EP và BVA cho tham số method, trạng thái DB và cấu hình (LO-4.2.1/4.2.2, K3) · đạt tỉ lệ N:A:B bắt buộc · review sheet test case bằng checklist black-box (checklist-based testing, LO-4.4.3) · đọc được Detail Design JNAP: package, lớp action, tham số, DAO, hằng số, message ID.</div>`),
    walkHead(BB, 1, 14, 'Slides 2–9 are identical to structural slides 2–9 (lesson L2.6) except one word on slide 9; they are explained briefly here with the black-box angle.', 'Slide 2–9 giống hệt slide 2–9 của bản structural (bài L2.6) trừ một chữ ở slide 9; ở đây chỉ giải thích ngắn theo góc nhìn black-box.'),
    walk(BB, [
      [1, 'LAB2: Component (functional) testing using unit test framework',
        `<p>Title of the black-box variant. “Functional” = the test cases come from what the unit must do (its specification — here the detail design), not from how it is coded. It is still <em>component</em> (unit) level and still uses a unit-test framework.</p>`,
        `<p>Tựa đề của biến thể black-box. “Functional” = test case rút ra từ việc unit phải làm (đặc tả của nó — ở đây là detail design), không phải từ cách nó được code. Vẫn là cấp <em>component</em> (unit) và vẫn dùng unit-test framework.</p>`],
      [2, 'Unit testing in the SDLC (same as structural slide 2)',
        `<p>Same text as structural slide 2: unit testing is old, verifies every unit, is the basis of TDD, is done by developers and sometimes white-box testers. For the black-box lab note that the same level can be tested from the <em>outside</em>: a unit's detailed design is a specification like any other.</p>`,
        `<p>Giống slide 2 bản structural: unit test đã có từ lâu, kiểm từng unit, là nền của TDD, do developer và đôi khi tester white-box làm. Với lab black-box, để ý rằng cùng một cấp có thể test từ <em>bên ngoài</em>: detailed design của một unit cũng là một đặc tả như mọi đặc tả khác.</p>`],
      [3, 'Unit testing in the SDLC (2) (same as structural slide 3)',
        `<p>Same as structural slide 3, including the warning about empty unit tests that all pass. In black-box terms: a test without a precise expected result from the DD proves nothing.</p>`,
        `<p>Giống slide 3 bản structural, kể cả lời cảnh báo về unit test rỗng pass hết. Theo góc black-box: test không có kết quả mong đợi chính xác lấy từ DD thì chẳng chứng minh được gì.</p>`],
      [4, 'Unit testing methods (same as structural slide 4)',
        `<p>Manual or automated. For a batch action whose DB and mail parts you cannot run at home, you may execute part of the black-box sheet manually (or against stubs) — record which way each case was run.</p>`,
        `<p>Thủ công hoặc tự động. Với một action batch mà phần DB và mail bạn không chạy được ở nhà, có thể thực hiện một phần sheet black-box bằng tay (hoặc với stub) — ghi rõ mỗi ca chạy theo cách nào.</p>`],
      [5, 'White-box testing (same as structural slide 5)',
        `<p>Same definition. In this variant you deliberately do <em>not</em> use it: the grading asks for DD coverage and a case ratio, not C0/C1.</p>`,
        `<p>Cùng định nghĩa. Ở biến thể này bạn cố ý <em>không</em> dùng nó: chấm điểm dựa trên độ phủ DD và tỉ lệ ca, không phải C0/C1.</p>`],
      [6, 'Black-box testing (same as structural slide 6)',
        `<p>The technique of this variant: input → executable program → output, with the specification as the only source of expected results. Black-box techniques of Ch.4: EP, BVA, decision tables, state transitions, use cases.</p>`,
        `<p>Kỹ thuật của biến thể này: input → chương trình chạy được → output, với đặc tả là nguồn duy nhất của kết quả mong đợi. Các kỹ thuật black-box ở Chương 4: EP, BVA, bảng quyết định, chuyển trạng thái, use case.</p>`],
      [7, 'Grey-box testing (same as structural slide 7)',
        `<p>Same. The DD of this lab is detailed enough (step-by-step processing, called methods, constants) that your test design will in practice be grey-box: you know the internal steps but not the code.</p>`,
        `<p>Giống. DD của lab này chi tiết tới mức (xử lý từng bước, method được gọi, hằng số) mà trên thực tế thiết kế test của bạn sẽ là grey-box: biết các bước bên trong nhưng không biết code.</p>`],
      [8, 'Benefits of unit testing (same as structural slide 8)',
        `<p>The same ten benefits. The one most relevant here: “documentation availability” — a good black-box sheet doubles as a readable summary of what the action must do.</p>`,
        `<p>Cùng mười lợi ích. Cái liên quan nhất ở đây: “có sẵn tài liệu” — một sheet black-box tốt đồng thời là bản tóm tắt dễ đọc về việc action phải làm.</p>`],
      [9, 'How to write good unit tests — “a single unit of code/DD”',
        `<p>The only change from structural slide 9: the first line says a unit test verifies “a single unit of <b>code/DD</b>” — in this lab the unit is one DD entry (one action class or method), not the integration of several.</p>`,
        `<p>Điểm khác duy nhất so với slide 9 bản structural: dòng đầu nói unit test kiểm “một unit của <b>code/DD</b>” — trong lab này, unit là một mục DD (một lớp action hoặc một method), không phải phần tích hợp nhiều mục.</p>`],
      [10, 'Lab 2 (Black-box) — the brief',
        `<p>Individual work; choose a tool from the tools slide; report with the lab's UT test-case template. <b>Test basis:</b> choose one “screen” in <code>LAB02\\01.Guide\\Detail Design\\doc\\jp\\co\\jtnis\\jnap1\\svrint\\action</code> (the classes there are batch actions, not GUI screens — see the DD map below). Deliver UT test cases / test script / the attached checklists. <b>Ratio Normal : Abnormal : Boundary = &lt; 20 % : &gt; 60 % : &gt; 20 %.</b> Read the ratio as a design rule: most black-box value is in abnormal and boundary inputs; if more than one case in five is “normal”, you are mostly confirming the happy path. With 10 cases the strict inequalities cannot all hold (1 N, 7 A, 2 B gives exactly 20 % B), so plan 12–13 cases or more.</p>`,
        `<p>Làm cá nhân; chọn một công cụ ở slide công cụ; báo cáo bằng template UT test case của lab. <b>Test basis:</b> chọn một “màn hình” trong <code>LAB02\\01.Guide\\Detail Design\\doc\\jp\\co\\jtnis\\jnap1\\svrint\\action</code> (các lớp ở đó là action batch, không phải màn hình GUI — xem bản đồ DD bên dưới). Nộp UT test case / test script / checklist kèm theo. <b>Tỉ lệ Normal : Abnormal : Boundary = &lt; 20 % : &gt; 60 % : &gt; 20 %.</b> Hiểu tỉ lệ này như một quy tắc thiết kế: giá trị lớn nhất của black-box nằm ở đầu vào bất thường và biên; nếu hơn một phần năm số ca là “normal” thì bạn chủ yếu đang xác nhận luồng suôn sẻ. Với 10 ca không thể thoả hết các bất đẳng thức chặt (1 N, 7 A, 2 B cho đúng 20 % B), nên hãy lên 12–13 ca trở lên.</p>`],
      [11, 'Lab 2 (Black-box) — grading',
        `<p>No submission 1 point; DD tested &lt; 2 pages 1–4; 2–3 pages 5–6; &gt; 3 pages 7–8; + 0–2 for DD complexity (many loops, nesting). A “page” is a printed page of the design you covered. <code>SvrJNAP001BAction.execute</code> is about one page with four decisions; actions such as 014B or 024B/025B have longer processing descriptions and score higher — but only if your cases really cover every step.</p>`,
        `<p>Không nộp 1 điểm; DD được test &lt; 2 trang 1–4; 2–3 trang 5–6; &gt; 3 trang 7–8; + 0–2 cho độ phức tạp DD (nhiều vòng lặp, lồng nhau). “Trang” là trang in của phần thiết kế bạn đã phủ. <code>SvrJNAP001BAction.execute</code> khoảng một trang với bốn quyết định; các action như 014B hay 024B/025B có mô tả xử lý dài hơn và được điểm cao hơn — nhưng chỉ khi các ca của bạn thật sự phủ mọi bước.</p>`],
      [12, 'Popular unit testing tools',
        `<p>Same tools slide as structural slide 11: NUnit, JUnit, TestNG and the Vietnamese JUnit guide by GP Coder. In this deck the tools really are on slide 12, as the brief says.</p>`,
        `<p>Cùng slide công cụ như slide 11 bản structural: NUnit, JUnit, TestNG và bài hướng dẫn JUnit tiếng Việt của GP Coder. Trong bộ này công cụ đúng là nằm ở slide 12, như đề bài nói.</p>`],
      [13, '#1) NUnit',
        `<p>NUnit for .NET: free, hand-written test scripts, works like JUnit, data-driven tests in parallel, console runner (same text as structural slide 12).</p>`,
        `<p>NUnit cho .NET: miễn phí, test script viết tay, hoạt động như JUnit, test hướng dữ liệu chạy song song, console runner (giống slide 12 bản structural).</p>`],
      [14, '#18) JUnit',
        `<p>JUnit for Java: open source, test-first, annotations + assertions + runners (same as structural slide 13). For a batch action you will need stubs for the DAO, SQL*Plus and mail parts — see the verified example in L2.8.</p>`,
        `<p>JUnit cho Java: mã nguồn mở, test trước, annotation + assertion + runner (giống slide 13 bản structural). Với action batch bạn sẽ cần stub cho phần DAO, SQL*Plus và mail — xem ví dụ đã chạy thật ở bài L2.8.</p>`],
    ]),
    bi(`<h3>The Detail Design — what is in <code>01.Guide/Detail Design/doc</code></h3>
<p>A Javadoc site (Shift-JIS, Japanese descriptions) of the server part of <b>JNAP</b>, a Japanese billing/accounting batch system, package <code>jp.co.jtnis.jnap1.svrint</code>. Each method's Javadoc is written as a numbered processing description — that is the “DD”. How the pieces fit:</p>
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
<p>Một trang Javadoc (mã Shift-JIS, mô tả tiếng Nhật) của phần server của <b>JNAP</b>, một hệ thống batch tính cước/kế toán của Nhật, package <code>jp.co.jtnis.jnap1.svrint</code>. Javadoc của mỗi method được viết thành mô tả xử lý đánh số — đó chính là “DD”. Các mảnh ghép với nhau thế này:</p>
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
<p>Both are Vietnamese translations of Japanese review checklists (Japanese terms kept in brackets). Columns: No · Large item · Medium item · Check item · Result (OK = pass, NG = review again, “-” = not checked) · DefectID · Note.</p>
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
<p>Both files also contain the same <b>BoundaryLimitValue</b> sheet as the white-box checklist (L2.6): lower − 1, lower, upper, upper + 1, and special values per data type.</p>`,
    `<h3>Hai checklist black-box (03.Blackbox/*.xls)</h3>
<p>Cả hai là bản dịch tiếng Việt của checklist review tiếng Nhật (thuật ngữ Nhật để trong ngoặc). Cột: No · Large item · Medium item · Check item · Result (OK = đạt, NG = review lại, “-” = chưa kiểm) · DefectID · Note.</p>
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
<p>Cả hai file còn có sheet <b>BoundaryLimitValue</b> giống checklist white-box (bài L2.6): cận dưới − 1, cận dưới, cận trên, cận trên + 1, và các giá trị đặc biệt theo kiểu dữ liệu.</p>`),
    bi(`<h3>Ví dụ có lời giải · Worked example — test analysis (EP + BVA) for JNAP001B from its DD</h3>
<p><code>SvrJNAP001BAction</code> (BT usage-detail creation) receives three start-up parameters, validated by <code>ParameterConfig</code> before <code>execute</code> runs (Javadoc of the fields): <b>1 yearMonthProcess</b> — required, date pattern yyyyMM; <b>2 orderProcess</b> — required, must be a number; <b>3 sendMailFlag</b> — required, value set {"0","1"}. Violations throw <code>BusinessLogicException</code> with <code>JNAP_ERROR_PARAMETER_REQUIRED</code>, <code>…PARAM_NOT_MATCH_PATTERN</code>, <code>…PARAM_IS_NOT_A_NUMBER</code> or <code>…PARAM_NOT_IN_SET</code>. Inside <code>execute</code> the state of the job-list table and the SQL result are further inputs. Analysis in the format of the FA23 PE template (Table 3.1):</p>
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
<div class="pitfall"><b>Black-box does not mean “parameters only”.</b> In a batch action most behaviour is driven by the database state and by the result of called programs (SQL*Plus, mail). A sheet that only varies the three parameters misses four of the five decisions of <code>execute</code>. Treat DB rows, file contents and settings as input conditions (guide slide 41) and write them in the Precondition rows.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Characterisation tests when there is no design.</b> The JNAP lab is lucky: a detailed design exists. For legacy code without one, Michael Feathers (<em>Working Effectively with Legacy Code</em>) recommends <em>characterisation tests</em>: run the code, record what it actually does, and pin that behaviour with tests before changing anything. They are the opposite of guide slide 23's rule — the code becomes the oracle — which is acceptable only because the goal is to detect <em>changes</em>, not to prove correctness. <em>Outside the syllabus because CTFL assumes a test basis exists.</em></div>`,
    `<h3>Ví dụ có lời giải · Phân tích test (EP + BVA) cho JNAP001B từ DD của nó</h3>
<p><code>SvrJNAP001BAction</code> (tạo chi tiết sử dụng BT) nhận ba tham số khởi động, được <code>ParameterConfig</code> kiểm trước khi <code>execute</code> chạy (Javadoc của các field): <b>1 yearMonthProcess</b> — bắt buộc, định dạng ngày yyyyMM; <b>2 orderProcess</b> — bắt buộc, phải là số; <b>3 sendMailFlag</b> — bắt buộc, thuộc tập {"0","1"}. Vi phạm sẽ ném <code>BusinessLogicException</code> với <code>JNAP_ERROR_PARAMETER_REQUIRED</code>, <code>…PARAM_NOT_MATCH_PATTERN</code>, <code>…PARAM_IS_NOT_A_NUMBER</code> hoặc <code>…PARAM_NOT_IN_SET</code>. Bên trong <code>execute</code>, trạng thái bảng danh sách job và kết quả SQL là các đầu vào khác. Phân tích theo mẫu đề PE FA23 (Table 3.1):</p>
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
<div class="pitfall"><b>Black-box không có nghĩa là “chỉ tham số”.</b> Trong một action batch, phần lớn hành vi do trạng thái database và kết quả của chương trình được gọi (SQL*Plus, mail) quyết định. Sheet chỉ thay đổi ba tham số sẽ bỏ sót bốn trong năm quyết định của <code>execute</code>. Hãy coi dòng DB, nội dung file và cấu hình là điều kiện đầu vào (slide 41 bộ hướng dẫn) và ghi chúng vào các dòng Precondition.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Characterisation test khi không có thiết kế.</b> Lab JNAP may mắn: có sẵn detailed design. Với code cũ không có thiết kế, Michael Feathers (<em>Working Effectively with Legacy Code</em>) khuyên viết <em>characterisation test</em>: chạy code, ghi lại nó thật sự làm gì, và khoá hành vi đó bằng test trước khi sửa bất cứ gì. Chúng đi ngược quy tắc slide 23 bộ hướng dẫn — code trở thành oracle — và chỉ chấp nhận được vì mục tiêu là phát hiện <em>thay đổi</em>, không phải chứng minh tính đúng. <em>Ngoài giáo trình vì CTFL mặc định là có test basis.</em></div>`),
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
    return `<tr><td><b>${g}</b></td><td>${l}</td><td>${vi ? v : en}</td>${cells}</tr>`;
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
<div class="callout"><b>Learning objectives.</b> Fill every field of the template correctly · build the condition × UTCID matrix with “O” marks, Confirm rows (Return, Exception, Log message) and the Result rows (Type N/A/B, Passed/Failed, Executed Date, Defect ID) · compute Lack of test cases, Test coverage and Test successful coverage · design the minimum test set for 100 % statement and decision coverage (LO-4.3.1/4.3.2) · derive a black-box sheet from a detailed design (LO-4.2.1/4.2.2).</div>
<h3>The sheets</h3>
<div class="table-wrap"><table><thead><tr><th>Sheet</th><th>Fields and meaning</th></tr></thead><tbody>
<tr><td>Guideline</td><td>How to read the template: test cases are organised by function, one sheet per function; each case = <b>condition</b> (precondition + input values: normal, boundary, abnormal) + <b>confirmation</b> (output of the function, log messages, screen messages); result P/F (or OK/NG).</td></tr>
<tr><td>Cover</td><td>Project Name, Project Code, Document Code (formula: <code>&lt;Project Code&gt;_XXX_vx.x</code>), Creator, Reviewer/Approver, Issue Date, Version; <b>Record of change</b>: Effective Date · Version · Change Item · *A,D,M (Added / Deleted / Modified) · Change description · Reference.</td></tr>
<tr><td>FunctionList</td><td>Project Name/Code, <b>Normal number of Test cases/KLOC</b> (default 100 — the norm), Test Environment Setup Description (server, database, browser…); table No · Requirement/Name · Class Name · Function Name · Function Code · Sheet Name (hyperlink to the function sheet — create the sheet first) · Description · Pre-Condition.</td></tr>
<tr><td>Test Report</td><td>Per function: Passed · Failed · Untested · N · A · B · Total Test Cases (each cell is a link to the function sheet's counters), Sub total, and five percentages (formulas below). “Check the Sub total formula if you add functions.”</td></tr>
<tr><td>Function sheet (e.g. additionMatrix, Function2)</td><td>Header, counters, matrix, result rows — next table.</td></tr>
</tbody></table></div>`,
    `<span class="eyebrow">Lab 2 · Bài L2.8 · Template_Unit Test Case.xlsx, Sample_Test Cases.xlsx, Samples/…Report5_Unit_Test.xlsx</span>
<h2>Template Unit Test Case, từng ô một</h2>
<p class="lead">Mọi thứ bạn nộp cho Lab 2 — và câu 2 của đề thi thực hành — đều nằm trong workbook này. Nó có sheet <strong>Guideline</strong>, <strong>Cover</strong>, <strong>FunctionList</strong>, <strong>Test Report</strong> và <strong>mỗi function một sheet ma trận</strong>. Bài này giải thích từng khối và từng công thức, rồi điền hoàn chỉnh hai sheet và kiểm chứng bằng cách chạy test thật.</p>
<div class="callout"><b>Chuẩn đầu ra.</b> Điền đúng mọi ô của template · dựng ma trận điều kiện × UTCID với dấu “O”, các dòng Confirm (Return, Exception, Log message) và các dòng Result (Type N/A/B, Passed/Failed, Executed Date, Defect ID) · tính Lack of test cases, Test coverage và Test successful coverage · thiết kế bộ test tối thiểu cho 100 % phủ câu lệnh và phủ quyết định (LO-4.3.1/4.3.2) · rút sheet black-box từ detailed design (LO-4.2.1/4.2.2).</div>
<h3>Các sheet</h3>
<div class="table-wrap"><table><thead><tr><th>Sheet</th><th>Các ô và ý nghĩa</th></tr></thead><tbody>
<tr><td>Guideline</td><td>Cách đọc template: test case tổ chức theo function, mỗi function một sheet; mỗi ca = <b>condition</b> (điều kiện tiên quyết + giá trị input: normal, boundary, abnormal) + <b>confirmation</b> (output của function, log message, thông báo trên màn hình); kết quả P/F (hoặc OK/NG).</td></tr>
<tr><td>Cover</td><td>Project Name, Project Code, Document Code (công thức: <code>&lt;Project Code&gt;_XXX_vx.x</code>), Creator, Reviewer/Approver, Issue Date, Version; <b>Record of change</b>: Effective Date · Version · Change Item · *A,D,M (Thêm / Xoá / Sửa) · Change description · Reference.</td></tr>
<tr><td>FunctionList</td><td>Project Name/Code, <b>Normal number of Test cases/KLOC</b> (mặc định 100 — định mức), Test Environment Setup Description (server, database, trình duyệt…); bảng No · Requirement/Name · Class Name · Function Name · Function Code · Sheet Name (link tới sheet function — tạo sheet trước) · Description · Pre-Condition.</td></tr>
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
<tr><td><b>Condition</b> → Precondition</td><td>State that must exist before the case: DB rows, files, “can connect to server”</td><td>—</td></tr>
<tr><td><b>Condition</b> → one block per input</td><td>Input name in column B, one <em>specific</em> value per row in column D, “O” in the columns that use it</td><td>—</td></tr>
<tr><td><b>Confirm</b> → Return</td><td>Each distinct return value on its own row, “O” per case</td><td>—</td></tr>
<tr><td><b>Confirm</b> → Exception</td><td>Exception class (and message ID) expected</td><td>—</td></tr>
<tr><td><b>Confirm</b> → Log message</td><td>Log/screen messages expected (add rows for DB changes, mails, files if needed)</td><td>—</td></tr>
<tr><td><b>Result</b> → Type</td><td>N (Normal), A (Abnormal), B (Boundary) — by the type of input data</td><td>—</td></tr>
<tr><td><b>Result</b> → Passed/Failed, Executed Date, Defect ID</td><td>P or F after running; date; bug ID for failed cases</td><td>—</td></tr>
</tbody></table></div>
<h3>Test Report formulas, checked on the template's own sample</h3>
<p>The sample Test Report has three functions with Passed 0+12+12 = 24, Failed 0+3+2 = 5, Untested 2+0+1 = 3, N 25, A 5, B 2, Total 32. The formulas give: <b>Test coverage</b> = (Passed + Failed) × 100 / Total = 29 × 100 / 32 = <b>90.625 %</b> (cases executed); <b>Test successful coverage</b> = Passed × 100 / Total = <b>75 %</b>; <b>Normal case</b> = 25/32 = 78.125 %, <b>Abnormal</b> = 5/32 = 15.625 %, <b>Boundary</b> = 2/32 = 6.25 % — exactly the values stored in the file. Note that “Test coverage” here means <em>execution progress</em>, not code coverage. The template's sample sheets are placeholders: additionMatrix (2 cases, 20 LOC → lack 2 − 2 = 0), fncPersonalIncomeTax (15 UTCID headers but only 2 filled; 20 LOC → lack 2 − 15 = −13), Function2/Function3 (300 LOC → lack 30 − 15 = 15).</p>`,
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
<tr><td><b>Condition</b> → Precondition</td><td>Trạng thái phải có trước khi chạy ca: dòng DB, file, “kết nối được server”</td><td>—</td></tr>
<tr><td><b>Condition</b> → mỗi input một khối</td><td>Tên input ở cột B, mỗi giá trị <em>cụ thể</em> một dòng ở cột D, “O” ở các cột dùng nó</td><td>—</td></tr>
<tr><td><b>Confirm</b> → Return</td><td>Mỗi giá trị trả về khác nhau một dòng, “O” theo ca</td><td>—</td></tr>
<tr><td><b>Confirm</b> → Exception</td><td>Lớp exception (và message ID) mong đợi</td><td>—</td></tr>
<tr><td><b>Confirm</b> → Log message</td><td>Log/thông báo màn hình mong đợi (thêm dòng cho thay đổi DB, mail, file nếu cần)</td><td>—</td></tr>
<tr><td><b>Result</b> → Type</td><td>N (Normal), A (Abnormal), B (Boundary) — theo loại dữ liệu đầu vào</td><td>—</td></tr>
<tr><td><b>Result</b> → Passed/Failed, Executed Date, Defect ID</td><td>P hoặc F sau khi chạy; ngày; mã bug cho ca fail</td><td>—</td></tr>
</tbody></table></div>
<h3>Công thức Test Report, kiểm trên chính mẫu của template</h3>
<p>Test Report mẫu có ba function với Passed 0+12+12 = 24, Failed 0+3+2 = 5, Untested 2+0+1 = 3, N 25, A 5, B 2, Total 32. Công thức cho: <b>Test coverage</b> = (Passed + Failed) × 100 / Total = 29 × 100 / 32 = <b>90,625 %</b> (số ca đã chạy); <b>Test successful coverage</b> = Passed × 100 / Total = <b>75 %</b>; <b>Normal case</b> = 25/32 = 78,125 %, <b>Abnormal</b> = 5/32 = 15,625 %, <b>Boundary</b> = 2/32 = 6,25 % — đúng các giá trị lưu trong file. Để ý “Test coverage” ở đây nghĩa là <em>tiến độ chạy test</em>, không phải code coverage. Các sheet mẫu của template chỉ là khung: additionMatrix (2 ca, 20 LOC → thiếu 2 − 2 = 0), fncPersonalIncomeTax (15 tiêu đề UTCID nhưng chỉ điền 2; 20 LOC → thiếu 2 − 15 = −13), Function2/Function3 (300 LOC → thiếu 30 − 15 = 15).</p>`),
    bi(`<h3>Ví dụ có lời giải 1 · Worked sheet — <code>SvrJNAP001BAction.execute</code> from the Detail Design (black-box)</h3>
<p><b>Header.</b> Function Code: JNAP001B · Function Name: SvrJNAP001BAction.execute (BT usage-detail creation) · Created by / Executed by: you · Lines of code: 27 (the re-implementation below; the real source is not in the lab folder) · Test requirement: “start-up parameters validated; job status pending → running → complete/error; result mail according to flag”. Test basis: the Javadoc steps 1–4 of <code>execute</code>, the field annotations and <code>ParameterConfig.injectConfigParameter</code>; tags from L2.7.</p>
<p><em>Columns 01–13 = UTCID01–UTCID13.</em></p>
${matrix(J_IDS, J_ROWS, false)}
<p><b>Counters.</b> Total 13 · N 2 · A 8 · B 3 → 15.4 % : 61.5 % : 23.1 %, meeting &lt; 20 % : &gt; 60 % : &gt; 20 %. Lack of test cases = 27 × 100 / 1000 − 13 = −10.3 (no lack). Passed 5, Failed 0, Untested 8 → Test coverage = 5 × 100 / 13 = 38.46 %. The five executed columns (01, 02, 06, 07, 08) are exactly the cases that reach every decision of <code>execute</code>; the eight parameter-validation and boundary columns need the real launcher (<code>RegistProcess</code> + <code>ParameterConfig</code>) and a database.</p>
<p><b>Verification.</b> <code>execute</code> was re-implemented line by line from the Javadoc, with the DAO, SQL*Plus and mail replaced by stubs (a fake <code>TranJobListDao</code> that records every status change, and a subclass overriding <code>executeSql</code>/<code>sendMail</code>). Real output of JUnit 5.12.2 + JaCoCo 0.8.13:</p>
<pre><code>PASSED UTCID01 N  record=1, SQL ok, flag=1 -&gt; 0-&gt;1, 1-&gt;2, mail success
PASSED UTCID06 A  record=0 -&gt; BusinessLogicException NO_CORRESPONDING_RECORD
PASSED UTCID07 A  record=1 but 0 rows 0-&gt;1 -&gt; BusinessLogicException CHANGE_STATUS_TO_RUNNING
PASSED UTCID08 A  SQL returns -1, flag=1 -&gt; 1-&gt;9, mail error
PASSED UTCID02 N  SQL ok, flag=0 -&gt; 1-&gt;2, no mail
Tests run: 5, passed: 5, failed: 0
Method execute: lines 16/16, branches 10/10</code></pre>
<p>So five black-box columns derived from the DD also give 100 % C0/C1 of a faithful implementation — a good sign that the DD steps are fully covered. (UTCID09, SQL error with flag “0”, is an extra abnormal combination not needed for coverage.)</p>`,
    `<h3>Ví dụ có lời giải 1 · Sheet mẫu — <code>SvrJNAP001BAction.execute</code> từ Detail Design (black-box)</h3>
<p><b>Header.</b> Function Code: JNAP001B · Function Name: SvrJNAP001BAction.execute (tạo chi tiết sử dụng BT) · Created by / Executed by: bạn · Lines of code: 27 (bản dựng lại bên dưới; mã nguồn thật không có trong thư mục lab) · Test requirement: “tham số khởi động được kiểm; trạng thái job chờ → đang chạy → xong/lỗi; mail kết quả theo cờ”. Test basis: các bước 1–4 trong Javadoc của <code>execute</code>, annotation của các field và <code>ParameterConfig.injectConfigParameter</code>; các tag lấy từ bài L2.7.</p>
<p><em>Cột 01–13 = UTCID01–UTCID13.</em></p>
${matrix(J_IDS, J_ROWS, true)}
<p><b>Bộ đếm.</b> Total 13 · N 2 · A 8 · B 3 → 15,4 % : 61,5 % : 23,1 %, thoả &lt; 20 % : &gt; 60 % : &gt; 20 %. Lack of test cases = 27 × 100 / 1000 − 13 = −10,3 (không thiếu). Passed 5, Failed 0, Untested 8 → Test coverage = 5 × 100 / 13 = 38,46 %. Năm cột đã chạy (01, 02, 06, 07, 08) chính là các ca đi tới mọi quyết định của <code>execute</code>; tám cột kiểm tham số và biên cần launcher thật (<code>RegistProcess</code> + <code>ParameterConfig</code>) và database.</p>
<p><b>Kiểm chứng.</b> <code>execute</code> được dựng lại từng dòng theo Javadoc, thay DAO, SQL*Plus và mail bằng stub (một <code>TranJobListDao</code> giả ghi lại mọi lần đổi trạng thái, và một lớp con override <code>executeSql</code>/<code>sendMail</code>). Kết quả thật của JUnit 5.12.2 + JaCoCo 0.8.13:</p>
<pre><code>PASSED UTCID01 N  record=1, SQL ok, flag=1 -&gt; 0-&gt;1, 1-&gt;2, mail success
PASSED UTCID06 A  record=0 -&gt; BusinessLogicException NO_CORRESPONDING_RECORD
PASSED UTCID07 A  record=1 but 0 rows 0-&gt;1 -&gt; BusinessLogicException CHANGE_STATUS_TO_RUNNING
PASSED UTCID08 A  SQL returns -1, flag=1 -&gt; 1-&gt;9, mail error
PASSED UTCID02 N  SQL ok, flag=0 -&gt; 1-&gt;2, no mail
Tests run: 5, passed: 5, failed: 0
Method execute: lines 16/16, branches 10/10</code></pre>
<p>Vậy năm cột black-box rút từ DD cũng cho C0/C1 100 % trên một bản cài đặt trung thành — dấu hiệu tốt rằng các bước của DD đã được phủ hết. (UTCID09, SQL lỗi với cờ “0”, là tổ hợp bất thường thêm, không cần cho coverage.)</p>`),
    bi(`<h3>Ví dụ có lời giải 2 · Worked sheet — FA23 PE Question 2: <code>countCharacters(String)</code></h3>
<p>The exam asks: “design and create the <b>minimum</b> component test cases needed to achieve <b>100 % statement coverage and 100 % decision coverage</b>” for:</p>
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
<p><b>Reasoning.</b> Four decisions, eight outcomes. One input string is processed character by character, so a <em>single</em> string can make every decision go both ways: with “Aa1@”, ‘A’ makes D2 true; ‘a’ makes D2 false and D3 true; ‘1’ makes D3 false and D4 true; ‘@’ makes D4 false (else branch); the loop iterates (D1 true) and finally exits (D1 false). All statements run. <b>Minimum = 1 test case.</b></p>
${matrix(C_IDS, C_ROWS, false)}
<p>UTCID01 alone is the answer to the question. UTCID02 (empty string — the loop body never runs) and UTCID03 (null — the method has no null check and throws) are good practice for the lab's N/A/B mix but are not needed for coverage. In the exam template the “Lines of code” cell is blank, so “Lack of test cases” shows −(number of cases).</p>
<p><b>JUnit script</b> (minimal):</p>
<pre><code>@Test // UTCID01 (N): one character of each class
void utcid01_oneOfEachKind() {
    Map&lt;String, Integer&gt; r = CharacterCounter.countCharacters("Aa1@");
    assertEquals(Map.of("UpperCase", 1, "LowerCase", 1, "Numeric", 1, "SpecialCharacter", 1), r);
}</code></pre>
<p><b>Real output</b> (JDK 21, JUnit 5.12.2, JaCoCo 0.8.13; line numbers L9–L17 are those of the exam listing, where line 1 is the import; per-line lists shortened to the decision lines) — run 1 with UTCID01 only, run 2 with the popular but <em>wrong</em> answer “A”, “a”, “1” (three tests, no special character), run 3 with UTCID01–03:</p>
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
<div class="pitfall"><b>Two classic mistakes on this question.</b> (1) Writing one case per branch (“A”, “a”, “1”, “@” = 4 cases) — it reaches 100 % but is not the <em>minimum</em>; a loop lets one input exercise many branches. (2) Forgetting the special character — three cases, all green, but 7/8 branches and one statement never run (run 2). If you do write several cases, make sure each column has at least one “O” in every block and that no two columns are identical.</div>`,
    `<h3>Ví dụ có lời giải 2 · Sheet mẫu — Câu 2 đề PE FA23: <code>countCharacters(String)</code></h3>
<p>Đề hỏi: “thiết kế và tạo <b>số component test case tối thiểu</b> cần để đạt <b>100 % statement coverage và 100 % decision coverage</b>” cho:</p>
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
<p><b>Lập luận.</b> Bốn quyết định, tám kết quả. Chuỗi đầu vào được xử lý từng ký tự, nên <em>một</em> chuỗi duy nhất có thể làm mọi quyết định đi cả hai hướng: với “Aa1@”, ‘A’ làm D2 đúng; ‘a’ làm D2 sai và D3 đúng; ‘1’ làm D3 sai và D4 đúng; ‘@’ làm D4 sai (nhánh else); vòng lặp lặp (D1 đúng) và cuối cùng thoát (D1 sai). Mọi câu lệnh đều chạy. <b>Tối thiểu = 1 test case.</b></p>
${matrix(C_IDS, C_ROWS, true)}
<p>Chỉ UTCID01 là đáp án của câu hỏi. UTCID02 (chuỗi rỗng — thân vòng lặp không chạy) và UTCID03 (null — method không kiểm null nên ném exception) là thói quen tốt cho tỉ lệ N/A/B của lab nhưng không cần cho coverage. Trong template đề thi, ô “Lines of code” để trống nên “Lack of test cases” hiện −(số ca).</p>
<p><b>JUnit script</b> (tối thiểu):</p>
<pre><code>@Test // UTCID01 (N): one character of each class
void utcid01_oneOfEachKind() {
    Map&lt;String, Integer&gt; r = CharacterCounter.countCharacters("Aa1@");
    assertEquals(Map.of("UpperCase", 1, "LowerCase", 1, "Numeric", 1, "SpecialCharacter", 1), r);
}</code></pre>
<p><b>Kết quả thật</b> (JDK 21, JUnit 5.12.2, JaCoCo 0.8.13; số dòng L9–L17 theo đúng đoạn code trong đề, dòng 1 là import; danh sách từng dòng được rút gọn còn các dòng quyết định) — lần 1 chỉ UTCID01, lần 2 với đáp án phổ biến nhưng <em>sai</em> “A”, “a”, “1” (ba test, không có ký tự đặc biệt), lần 3 với UTCID01–03:</p>
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
<div class="pitfall"><b>Hai lỗi kinh điển ở câu này.</b> (1) Viết mỗi nhánh một ca (“A”, “a”, “1”, “@” = 4 ca) — đạt 100 % nhưng không phải <em>tối thiểu</em>; vòng lặp cho phép một đầu vào đi qua nhiều nhánh. (2) Quên ký tự đặc biệt — ba ca, xanh hết, nhưng 7/8 nhánh và một câu lệnh chưa chạy (lần 2). Nếu có viết nhiều ca, hãy chắc mỗi cột có ít nhất một “O” ở mọi khối và không có hai cột giống hệt nhau.</div>`),
    bi(`<h3>The two other files in Template/</h3>
<p><b>Sample_Test Cases.xlsx</b> (project “Family Medical Officer”, FMO_IT&amp;ST Test Cases v1.3, 2011) is an integration/system test file in <b>list format</b> (guide slide 81): Cover with a long record of change and the test environments (Samsung Galaxy S II, iPhone 3/4 … and the server), a Test Report per sub-module (hours per device, Pass/Fail/Untest/N/A, number of runs on all devices — some cells show <code>#REF!</code>, broken links), and module sheets with columns ID · Test Case Description · Pre-Condition · Test Case Procedure (numbered steps) · Expected Output · Bug# · System test environment · Test date · Note. Use this format for procedure-heavy tests, the matrix for unit tests.</p>
<p><b>Samples/…SEP490_G47…Report5_Unit_Test.xlsx</b> is a real capstone team's unit-test report (Chatbot AI Platform, 27 methods such as <code>chat</code>, <code>getLiveChatList</code>, <code>createBot</code>, <code>confirmPayment</code>, with a norm of 20 TC/KLOC). Its <code>chat</code> sheet shows the matrix used well: inputs ChatId, Message, BotId, IsLogin each with a valid value, "", null and an invalid value; one input changed per column; a log message per case (“ChatId cannot be empty”, “BotId is required” …). Worth copying. Worth questioning: the Statistics sheet reports 55 cases with <b>100 % passed</b>, N 14.5 %, A 10.9 %, <b>B 74.5 %</b> — "" and null are typed B (boundary) instead of A, and a report with zero failures and zero defects says more about the classification and the tests than about the code (guide slide 5: too few UT defects is a warning sign).</p>`,
    `<h3>Hai file còn lại trong Template/</h3>
<p><b>Sample_Test Cases.xlsx</b> (dự án “Family Medical Officer”, FMO_IT&amp;ST Test Cases v1.3, 2011) là file test integration/system dạng <b>danh sách</b> (slide 81 bộ hướng dẫn): Cover với lịch sử thay đổi dài và môi trường test (Samsung Galaxy S II, iPhone 3/4 … và server), Test Report theo sub-module (số giờ mỗi thiết bị, Pass/Fail/Untest/N/A, số lần chạy trên mọi thiết bị — vài ô hiện <code>#REF!</code>, link bị hỏng), và các sheet module với cột ID · Test Case Description · Pre-Condition · Test Case Procedure (các bước đánh số) · Expected Output · Bug# · System test environment · Test date · Note. Dùng dạng này cho test nặng về thủ tục, dạng ma trận cho unit test.</p>
<p><b>Samples/…SEP490_G47…Report5_Unit_Test.xlsx</b> là báo cáo unit test thật của một nhóm đồ án (Chatbot AI Platform, 27 method như <code>chat</code>, <code>getLiveChatList</code>, <code>createBot</code>, <code>confirmPayment</code>, định mức 20 TC/KLOC). Sheet <code>chat</code> của họ dùng ma trận tốt: các input ChatId, Message, BotId, IsLogin mỗi cái có giá trị hợp lệ, "", null và một giá trị sai; mỗi cột đổi một input; mỗi ca một log message (“ChatId cannot be empty”, “BotId is required” …). Đáng học theo. Đáng đặt câu hỏi: sheet Statistics báo 55 ca <b>pass 100 %</b>, N 14,5 %, A 10,9 %, <b>B 74,5 %</b> — "" và null bị xếp B (biên) thay vì A, và một báo cáo không có ca fail, không có defect nào nói về cách phân loại và chất lượng test nhiều hơn là về code (slide 5 bộ hướng dẫn: quá ít defect ở UT là dấu hiệu cảnh báo).</p>`),
    bi(`<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Generating the sheet from the tests.</b> Teams that keep both a spreadsheet and JUnit code soon find they disagree. A common fix is to make the code the source: name tests after UTCIDs (as in the listings above), tag them (<code>@Tag("A")</code>, <code>@Tag("B")</code>), and let a small script turn the JUnit XML report into the Passed/Failed, Type and Executed-Date rows of the template. The matrix becomes a report of what really ran, not a promise. <em>Outside the syllabus because CTFL treats test documentation independently of automation tooling.</em></div>`,
    `<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Sinh sheet từ chính các test.</b> Nhóm nào vừa giữ bảng tính vừa giữ code JUnit sớm muộn sẽ thấy hai thứ lệch nhau. Cách khắc phục phổ biến là coi code là nguồn: đặt tên test theo UTCID (như các đoạn code ở trên), gắn nhãn (<code>@Tag("A")</code>, <code>@Tag("B")</code>), và dùng một script nhỏ biến báo cáo JUnit XML thành các dòng Passed/Failed, Type và Executed Date của template. Ma trận khi đó là báo cáo về những gì thật sự đã chạy, không phải một lời hứa. <em>Ngoài giáo trình vì CTFL coi tài liệu test là độc lập với công cụ tự động hoá.</em></div>`),
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
<p class="lead">“Unit test viewpoint collection, Ver. 0.1” is the kind of file the PCL deck calls <em>PCL creation points from Hitachi</em> (Checklist_creation_viewpoint.xlsx) and the guide calls <em>Testing Concerns</em>: a catalogue of things that go wrong, grouped by where they occur. You do not test every item — you pick those that match your unit (“select test items according to the system configuration of each project”) and turn each into one or more PCL columns. Some rows still carry a reviewer's comments (“[Huy]: not applicable for CBRR project”), showing it was tailored for a real project.</p>
<div class="callout"><b>Learning objectives.</b> Use a viewpoint catalogue as the basis of checklist-based testing (LO-4.4.3, K2) · choose viewpoints that fit a unit's layer (P, F, D, adapter) · apply the limit-value and common-input-check rules (LO-4.2.1/4.2.2) · derive white-box cases for if/else, loops, switch, join conditions, void methods, methods without arguments, try-catch and throw.</div>
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
<p class="lead">“Unit test viewpoint collection, Ver. 0.1” là loại file mà slide PCL gọi là <em>PCL creation points from Hitachi</em> (Checklist_creation_viewpoint.xlsx) còn bộ hướng dẫn gọi là <em>Testing Concerns</em>: danh mục những thứ hay hỏng, nhóm theo nơi chúng xảy ra. Bạn không test mọi mục — chỉ chọn những mục hợp với unit của mình (“chọn mục test theo cấu hình hệ thống của từng dự án”) rồi biến mỗi mục thành một hay nhiều cột PCL. Vài dòng còn giữ nhận xét của người review (“[Huy]: not applicable for CBRR project”), cho thấy file đã được tuỳ biến cho một dự án thật.</p>
<div class="callout"><b>Chuẩn đầu ra.</b> Dùng danh mục quan điểm làm nền cho checklist-based testing (LO-4.4.3, K2) · chọn quan điểm hợp với lớp của unit (P, F, D, adapter) · áp dụng quy tắc giá trị giới hạn và kiểm tra input chung (LO-4.2.1/4.2.2) · rút ca white-box cho if/else, vòng lặp, switch, điều kiện ghép, method void, method không tham số, try-catch và throw.</div>
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
<li><b>Initial state (1–31):</b> layout, enabled/disabled and shown/hidden items per role (“Edit” active for admin, inactive for member); initial values — watch the easily confused empty string, NULL, half-width and full-width space; zoom 50/100/150 %; tab order (left→right, top→bottom); radio/checkbox via label; link colour/underline; IME mode; right alignment of dates, numbers, currency; password masking; labels, borders, highlight, zebra rows, image resize and click; character encoding; JavaScript errors; colours, spacing, pixel positions; layout with 0 data; enabled/disabled patterns per display content.</li>
<li><b>With server communication (32–49):</b> input format (half/full-width, special characters <code>~!@#$%^&amp;*()…</code>, Unicode ♡©®); max length; correlations (start ≤ end, min ≤ max; defect type required when issue type = defect); error messages and layout; date-time picker (last day, today, reverse, not input); combo sort; display format from DB (“00001” or “1”?); field mapping (Name loaded into Surname); NULL from old data; byte length (CHAR(40) holds 20 two-byte characters).</li>
<li><b>Localisation, lists, print, errors, tab (50–61):</b> layout and messages per language; scroll bar, item count, hidden items, “no data” message; print preview; error message disappears after correction; focus order, auto-tab, shift-tab.</li>
<li><b>Security (62–68):</b> repeated clicks; double submit; resubmit after stopping the request; new tab without logout; many users on the same transaction; personal data in cache/local files; direct URL access bypassing the business flow.</li>
<li><b>Back/forward, calendar, Enter key, paging, clear, pop-ups, sequence (69–89):</b> browser back/forward and data kept or cleared; day dropdown per month and leap year (29 Feb 2012), invalid 31st; calendar default date; Enter on buttons and text boxes; page size and links (|&lt; &lt;&lt; 5 6 7 8 9 10 11 &gt;&gt; &gt;|) and sort order across pages; clear button; data passed to and from pop-ups; recovery after business and system errors.</li>
<li><b>DB (90–106):</b> commit/rollback; SQL matches the spec, WHERE order, built-in functions; deadlock; select/insert/update/delete — correct, failing (no data, bad condition), DB server down.</li>
<li><b>Stop processing, settings (107–110):</b> right-click, function keys, shortcut keys blocked if required; layout when the font size changes.</li>
</ul>
<h3>2.BB_Business &amp; WB_Logic — 28 viewpoints</h3>
<ul>
<li><b>Code structures:</b> if — both branches; while — infinite loop by data, break in the middle; do-while — runs at least once, so check the output of a single iteration; for — code that changes the index, break; switch — every case, the default, and a missing <code>break</code> (the example prints both “working day” and “off-day” for 3).</li>
<li><b>Normal / error / limit rules:</b> “should be A” → normal A, error not-A; “A or B”; A ≤ B → normal A &lt; B and A = B, error A &gt; B; X &lt; value ≤ Y → limit cases X−1, X, X+1, Y−1, Y, Y+1 (three-value BVA); if one case falls in two types, classify by priority Abnormal / Limit / Normal.</li>
<li><b>Messages</b> match the spec; <b>DB black-box</b>: connect; commit updates the table as designed; rollback; search result count and values, 0 records when nothing matches; update of a missing target; insert with duplicate key; physical vs logical delete (row gone vs delete flag set); DB access error → the specified business/system exception; commit failure restores the previous state; <b>DB white-box</b>: variations of the WHERE clause, ORDER BY ASC/DESC.</li>
</ul>
<h3>3.WB_Other — 26 white-box viewpoints</h3>
<ul>
<li><b>Logic:</b> cover all cases of if/for/while/do-while/switch (example <code>mySum</code>, worked below); <b>join conditions</b>: <code>path == null || "".equals(path)</code> needs two cases, one per sub-condition (guide slide 53).</li>
<li><b>Limit/error:</b> add a = 0, −1, 1 and b = 0, −1, 1 to the <code>mySum</code> cases.</li>
<li><b>Special cases:</b> <em>void method</em> — confirm the displayed message, the log, or the DB change instead of a return value; <em>method without arguments</em> — “there is no function without input condition”: never leave the input blank, put the state in Precondition (e.g. “table Student has at least one record”); <em>try-catch inside</em> — treat it as a normal statement, the Exception row stays empty, check the logged message and the null return; <em>throws</em> — fill the Exception row; <em>list parameters/results</em> — check element count and content (e.g. lines of a file = elements of the returned ArrayList).</li>
<li><b>Per layer:</b> P — display of data received from F (yyyyMMdd shown as a Japanese-era date); F — data from P (convert Heisei dates), business errors (8 planned hours per day: 6 + 5 h is rejected), limit values, data from D; D — normal search, empty table / no match, cannot connect, more rows than the one expected; Adapter — data from F, business error from outside (wrong ATM card), cannot connect, external system error, invalid received data (withdraw 5 million with 1 million in the account), limit values.</li>
</ul>
<h3>4.LimitValue and 5.CommonInputCheck</h3>
<p><b>Limit value per data type:</b> numbers (short, int, long, float, double) → value; String → length; DateTime → value; File → size, existence, maximum number of records. Test lower − 1, lower, upper, upper + 1 (e.g. 0–99 → −1, 0, 99, 100), or uniformly ± 1 (−1, 0, 1, 98, 99, 100). Special values: null, 0, −1; null, ""; 1/1, 12/31, 2/29, 2/28; 0:00:00, 23:59:59; file of 0 bytes, missing, maximum records. <b>Common input checks</b> and the number of cases each needs: normal pattern 1; kana-only 1; full-width 1; half-width 1; numeric 1; <b>length check 4</b> (lower, lower − 1, upper, upper + 1); <b>amount check 4</b>; format 1; required 1; foreign-currency amount 2; money amount 0 → error 1; matching A = B 1; <b>FROM/TO date 5</b>; correlation-required (if A then B and C) per item; output: display 2, NULL display 1, max digits 1, display condition 1.</p>`,
    `<h3>1.BB_Screen — 110 quan điểm màn hình, theo nhóm</h3>
<ul>
<li><b>Trạng thái ban đầu (1–31):</b> bố cục, mục bật/tắt và hiện/ẩn theo vai trò (“Edit” bật với admin, tắt với member); giá trị ban đầu — cẩn thận chuỗi rỗng, NULL, khoảng trắng nửa độ rộng và toàn độ rộng dễ nhầm; zoom 50/100/150 %; thứ tự tab (trái→phải, trên→dưới); radio/checkbox qua nhãn; màu/gạch chân link; chế độ IME; căn phải cho ngày, số, tiền; che mật khẩu; nhãn, viền, tô sáng, dòng kẻ sọc (zebra), đổi cỡ và bấm ảnh; mã hoá ký tự; lỗi JavaScript; màu, khoảng cách, vị trí theo pixel; bố cục khi 0 dữ liệu; mẫu bật/tắt theo nội dung hiển thị.</li>
<li><b>Có giao tiếp server (32–49):</b> định dạng input (nửa/toàn độ rộng, ký tự đặc biệt <code>~!@#$%^&amp;*()…</code>, Unicode ♡©®); độ dài tối đa; tương quan (bắt đầu ≤ kết thúc, min ≤ max; loại lỗi bắt buộc khi issue type = defect); thông báo lỗi và bố cục; date-time picker (ngày cuối, hôm nay, đảo ngược, chưa nhập); sắp xếp combo; định dạng hiển thị từ DB (“00001” hay “1”?); ánh xạ trường (Name nạp vào Surname); NULL từ dữ liệu cũ; độ dài byte (CHAR(40) chứa được 20 ký tự 2 byte).</li>
<li><b>Bản địa hoá, danh sách, in, lỗi, tab (50–61):</b> bố cục và thông báo theo ngôn ngữ; thanh cuộn, số mục, mục bị ẩn, thông báo “không có dữ liệu”; xem trước khi in; thông báo lỗi biến mất sau khi sửa; thứ tự focus, auto-tab, shift-tab.</li>
<li><b>Bảo mật (62–68):</b> bấm nhiều lần; submit hai lần; submit lại sau khi dừng request; tab mới không đăng xuất; nhiều người cùng một giao dịch; dữ liệu cá nhân trong cache/file cục bộ; truy cập URL trực tiếp bỏ qua luồng nghiệp vụ.</li>
<li><b>Back/forward, lịch, phím Enter, phân trang, nút xoá, pop-up, trình tự (69–89):</b> nút back/forward của trình duyệt và dữ liệu được giữ hay xoá; dropdown ngày theo tháng và năm nhuận (29/2/2012), ngày 31 không hợp lệ; ngày mặc định của lịch; Enter trên nút và ô nhập; cỡ trang và link trang (|&lt; &lt;&lt; 5 6 7 8 9 10 11 &gt;&gt; &gt;|) và thứ tự sắp xếp khi qua trang; nút xoá; dữ liệu truyền tới và từ pop-up; phục hồi sau lỗi nghiệp vụ và lỗi hệ thống.</li>
<li><b>DB (90–106):</b> commit/rollback; SQL đúng spec, thứ tự WHERE, hàm dựng sẵn; deadlock; select/insert/update/delete — đúng, thất bại (không có dữ liệu, điều kiện sai), DB server sập.</li>
<li><b>Dừng xử lý, cài đặt (107–110):</b> chặn chuột phải, phím chức năng, phím tắt nếu có yêu cầu; bố cục khi đổi cỡ chữ.</li>
</ul>
<h3>2.BB_Business &amp; WB_Logic — 28 quan điểm</h3>
<ul>
<li><b>Cấu trúc code:</b> if — cả hai nhánh; while — lặp vô hạn do dữ liệu, break giữa chừng; do-while — chạy ít nhất một lần, nên kiểm output khi chỉ lặp một lần; for — code làm đổi biến chỉ số, break; switch — mọi case, default, và thiếu <code>break</code> (ví dụ nhập 3 in cả “working day” lẫn “off-day”).</li>
<li><b>Quy tắc normal / error / limit:</b> “phải là A” → normal A, error khác A; “A hoặc B”; A ≤ B → normal A &lt; B và A = B, error A &gt; B; X &lt; giá trị ≤ Y → ca limit X−1, X, X+1, Y−1, Y, Y+1 (BVA ba giá trị); nếu một ca thuộc hai loại thì xếp theo ưu tiên Abnormal / Limit / Normal.</li>
<li><b>Message</b> đúng spec; <b>DB black-box</b>: kết nối; commit cập nhật bảng đúng thiết kế; rollback; số bản ghi và giá trị kết quả tìm, 0 bản ghi khi không khớp; cập nhật đối tượng không tồn tại; insert trùng khoá; xoá vật lý và xoá logic (dòng biến mất và cờ xoá được bật); lỗi truy cập DB → exception nghiệp vụ/hệ thống theo thiết kế; commit lỗi thì DB trở về trạng thái trước; <b>DB white-box</b>: các biến thể mệnh đề WHERE, ORDER BY ASC/DESC.</li>
</ul>
<h3>3.WB_Other — 26 quan điểm white-box</h3>
<ul>
<li><b>Logic:</b> phủ mọi ca của if/for/while/do-while/switch (ví dụ <code>mySum</code>, giải bên dưới); <b>điều kiện ghép</b>: <code>path == null || "".equals(path)</code> cần hai ca, mỗi điều kiện con một ca (slide 53 bộ hướng dẫn).</li>
<li><b>Giới hạn/lỗi:</b> thêm a = 0, −1, 1 và b = 0, −1, 1 vào các ca của <code>mySum</code>.</li>
<li><b>Trường hợp đặc biệt:</b> <em>method void</em> — xác nhận thông báo hiển thị, log hoặc thay đổi DB thay cho giá trị trả về; <em>method không tham số</em> — “không có hàm nào không có điều kiện đầu vào”: không bao giờ để trống input, hãy ghi trạng thái vào Precondition (ví dụ “bảng Student có ít nhất một bản ghi”); <em>có try-catch bên trong</em> — coi như câu lệnh bình thường, dòng Exception để trống, kiểm message được log và giá trị null trả về; <em>throws</em> — điền dòng Exception; <em>tham số/kết quả là list</em> — kiểm số phần tử và nội dung (ví dụ số dòng của file = số phần tử của ArrayList trả về).</li>
<li><b>Theo lớp:</b> P — hiển thị dữ liệu nhận từ F (yyyyMMdd hiện thành niên hiệu Nhật); F — dữ liệu từ P (đổi ngày Heisei), lỗi nghiệp vụ (8 giờ kế hoạch mỗi ngày: 6 + 5 giờ bị từ chối), giá trị giới hạn, dữ liệu từ D; D — tìm kiếm bình thường, bảng rỗng / không khớp, không kết nối được, nhiều dòng hơn một dòng mong đợi; Adapter — dữ liệu từ F, lỗi nghiệp vụ từ bên ngoài (thẻ ATM sai), không kết nối được, lỗi hệ thống bên ngoài, dữ liệu nhận không hợp lệ (rút 5 triệu khi tài khoản có 1 triệu), giá trị giới hạn.</li>
</ul>
<h3>4.LimitValue và 5.CommonInputCheck</h3>
<p><b>Giá trị giới hạn theo kiểu dữ liệu:</b> số (short, int, long, float, double) → giá trị; String → độ dài; DateTime → giá trị; File → kích thước, có/không, số bản ghi tối đa. Test cận dưới − 1, cận dưới, cận trên, cận trên + 1 (ví dụ 0–99 → −1, 0, 99, 100), hoặc đồng loạt ± 1 (−1, 0, 1, 98, 99, 100). Giá trị đặc biệt: null, 0, −1; null, ""; 1/1, 12/31, 2/29, 2/28; 0:00:00, 23:59:59; file 0 byte, không có, số bản ghi tối đa. <b>Kiểm tra input chung</b> và số ca mỗi loại cần: mẫu bình thường 1; chỉ kana 1; toàn độ rộng 1; nửa độ rộng 1; số 1; <b>kiểm độ dài 4</b> (cận dưới, cận dưới − 1, cận trên, cận trên + 1); <b>kiểm hạn mức 4</b>; định dạng 1; bắt buộc 1; số tiền ngoại tệ 2; số tiền = 0 → lỗi 1; khớp A = B 1; <b>ngày FROM/TO 5</b>; bắt buộc theo tương quan (có A thì phải có B và C) tuỳ số mục; output: hiển thị 2, hiển thị NULL 1, số chữ số tối đa 1, điều kiện hiển thị 1.</p>`),
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
<p><b>Corrections.</b> (1) There are <b>two decisions with two outcomes each = 4 branches</b>, not 6 — the tool agrees (4/4). (2) Three cases are indeed the minimum for 100 % C0/C1: three different return statements need three runs. (3) The conditions “a &gt; 0” and “b &gt; 0” in TC2/TC3 leave out 0, which belongs to the non-negative partition — that is why the sheet adds the limit cases TC4–TC9: a = 0, −1, 1 and b = 0, −1, 1 (with the other input kept valid), which test both sides of each boundary (a = 0 must give a + b, a = −1 must give −1).</p>
<div class="pitfall"><b>Viewpoint files are not the syllabus.</b> They are practical and project-specific, and they contain mistakes (wrong branch count, missing braces, “normal case: Y” only for X &lt; value ≤ Y). In an ISTQB question, count decisions and outcomes yourself; in the lab, use the file for ideas, then check your cases with a coverage tool.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Property-based testing — viewpoints as generators.</b> Libraries such as jqwik (Java) generate hundreds of inputs from a description (“any int”, “strings of letters and digits”) and check a <em>property</em> that must always hold — e.g. for <code>countCharacters</code>: the four counts always add up to the length of the input. The generators deliberately include the viewpoint catalogue's favourites (0, −1, <code>Integer.MAX_VALUE</code>, empty strings, Unicode) and shrink a failing input to the smallest example. <em>Outside the syllabus because CTFL's techniques select test cases by hand.</em></div>`,
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
<p><b>Sửa lại.</b> (1) Có <b>hai quyết định, mỗi cái hai kết quả = 4 nhánh</b>, không phải 6 — công cụ cũng báo vậy (4/4). (2) Ba ca đúng là tối thiểu cho C0/C1 100 %: ba câu return khác nhau cần ba lần chạy. (3) Điều kiện “a &gt; 0” và “b &gt; 0” ở TC2/TC3 bỏ sót 0, vốn thuộc phân vùng không âm — vì thế file thêm các ca biên TC4–TC9: a = 0, −1, 1 và b = 0, −1, 1 (giữ input kia hợp lệ), thử cả hai phía của mỗi biên (a = 0 phải cho a + b, a = −1 phải cho −1).</p>
<div class="pitfall"><b>File quan điểm không phải syllabus.</b> Chúng thực dụng, gắn với dự án, và có lỗi (đếm sai số nhánh, thiếu ngoặc, “normal case: Y” duy nhất cho X &lt; giá trị ≤ Y). Trong câu hỏi ISTQB, hãy tự đếm quyết định và kết quả; trong lab, dùng file để lấy ý tưởng, rồi kiểm các ca của mình bằng công cụ coverage.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Property-based testing — biến quan điểm thành bộ sinh dữ liệu.</b> Thư viện như jqwik (Java) sinh hàng trăm đầu vào từ một mô tả (“số int bất kỳ”, “chuỗi gồm chữ và số”) và kiểm một <em>tính chất</em> luôn phải đúng — ví dụ với <code>countCharacters</code>: bốn con đếm cộng lại luôn bằng độ dài chuỗi. Bộ sinh cố ý đưa vào các giá trị “ruột” của danh mục quan điểm (0, −1, <code>Integer.MAX_VALUE</code>, chuỗi rỗng, Unicode) và thu nhỏ đầu vào gây lỗi về ví dụ nhỏ nhất. <em>Ngoài giáo trình vì các kỹ thuật của CTFL chọn test case bằng tay.</em></div>`),
    books([
      ['fst4', 'Ch.4 §4 experience-based techniques incl. checklist-based testing (book pp.140–142); §2 EP/BVA pp.112–120', 'Chương 4 §4 kỹ thuật dựa trên kinh nghiệm, gồm checklist-based testing (trang 140–142); §2 EP/BVA trang 112–120'],
      ['sp5', '§5.3 experience-based techniques PDF p.233; §5.1.2 BVA PDF p.176; §5.2.2 decision coverage PDF p.218', '§5.3 kỹ thuật dựa trên kinh nghiệm PDF 233; §5.1.2 BVA PDF 176; §5.2.2 decision coverage PDF 218'],
      ['sp4', '§5.3 intuitive and experience-based test case determination p.161 (PDF p.176)', '§5.3 xác định test case theo trực giác và kinh nghiệm trang 161 (PDF 176)'],
    ]),
  ].join('\n'),
};

/* ──────────────────────────────── Quiz ──────────────────────────────── */
// Plain-text strings (the quiz player does not render HTML).
const q = (question, options, correctIndex) => ({ question, options, correctIndex, points: 1 });
const QUIZ = {
  title: 'Lab 2 quiz — unit-test design, PCL, coverage and the template|||Quiz Lab 2 — thiết kế unit test, PCL, coverage và template',
  slug: 'swt301-lab2-quiz',
  type: 'QUIZ',
  description: '22 câu về bộ hướng dẫn unit test của Hitachi, cách viết PCL, C0/C1/RC0, quy tắc rút test case, template Unit Test Case và yêu cầu chấm điểm Lab 2.',
  quiz: {
    timeLimitSeconds: 1320,
    questions: [
      q('According to the Hitachi unit-testing guide, when must the PCL of a software unit be created, and from what?|||Theo hướng dẫn unit test của Hitachi, PCL của một software unit phải được tạo khi nào và từ đâu?',
        ['After coding, from the source code|||Sau khi code, từ source code', 'Before coding, from the Detailed Design|||Trước khi code, từ Detailed Design', 'During system testing, from the requirements|||Trong system test, từ yêu cầu', 'After acceptance, from the bug list|||Sau nghiệm thu, từ bug list'], 1),
      q('Why does the guide forbid deriving the PCL from the source code after coding?|||Vì sao hướng dẫn cấm lập PCL từ source code sau khi code xong?',
        ['It takes too long|||Vì tốn quá nhiều thời gian', 'Coding errors can no longer be detected, because the expected results would copy what the code does|||Không phát hiện được lỗi code nữa, vì kết quả mong đợi sẽ chép lại việc code đang làm', 'Coverage tools cannot read PCLs|||Công cụ coverage không đọc được PCL', 'The leader cannot review it|||Leader không review được'], 1),
      q('Which set of exit criteria must be met before the leader evaluates unit testing of a NEW unit?|||Bộ tiêu chí kết thúc nào phải đạt trước khi leader đánh giá unit test của một unit MỚI?',
        ['All PCL cases run, all bugs resolved, high-priority static-analysis violations fixed, C0 and C1 = 100%|||Chạy hết ca PCL, giải quyết hết bug, sửa hết vi phạm phân tích tĩnh mức cao, C0 và C1 = 100%', 'All PCL cases run and RC0 = 100%|||Chạy hết ca PCL và RC0 = 100%', 'At least 80% statement coverage|||Ít nhất 80% statement coverage', 'No bugs were found|||Không tìm thấy bug nào'], 0),
      q('What is RC0?|||RC0 là gì?',
        ['Coverage of all conditions|||Phủ mọi điều kiện', 'Executed revised statements / all revised statements × 100%|||Số câu lệnh đã sửa được chạy / tổng số câu lệnh đã sửa × 100%', 'Executed branches / all branches × 100%|||Số nhánh đã chạy / tổng số nhánh × 100%', 'Requirement coverage|||Độ phủ yêu cầu'], 1),
      q('In Hitachi\'s process, "Software Component Testing" (組合せテスト) corresponds to which ISTQB level?|||Trong quy trình Hitachi, "Software Component Testing" (組合せテスト) tương ứng cấp nào của ISTQB?',
        ['Component (unit) testing|||Component (unit) testing', 'Component integration testing|||Component integration testing', 'Acceptance testing|||Acceptance testing', 'Maintenance testing|||Maintenance testing'], 1),
      q('If the unit under test calls another unit, what does the guide prefer during unit testing?|||Nếu unit đang test gọi unit khác, hướng dẫn ưu tiên điều gì khi unit test?',
        ['Always use stubs|||Luôn dùng stub', 'Use the real, already tested submodule; if stubs were used, re-test with the real one later|||Dùng submodule thật đã được test; nếu đã dùng stub thì test lại với bản thật sau', 'Skip calls to other units|||Bỏ qua lời gọi tới unit khác', 'Test both units together in system testing only|||Chỉ test hai unit cùng nhau ở system test'], 1),
      q('How must input conditions and expected results be written in a PCL?|||Điều kiện đầu vào và kết quả mong đợi trong PCL phải được viết thế nào?',
        ['As values of local variables during execution|||Là giá trị biến cục bộ trong lúc chạy', 'As specific, externally settable/observable states before and after execution|||Là trạng thái cụ thể, đặt/quan sát được từ bên ngoài, trước và sau khi chạy', 'As general descriptions such as "valid value"|||Là mô tả chung như "giá trị hợp lệ"', 'As screenshots of the debugger|||Là ảnh chụp debugger'], 1),
      q('Step 2 of test-case creation says each new case should differ from the basic case in only one input condition. Why?|||Bước 2 của việc tạo test case nói mỗi ca mới chỉ khác ca cơ sở ở một điều kiện đầu vào. Vì sao?',
        ['To reduce the number of cases to one|||Để giảm số ca xuống còn một', 'To know which input caused the result and not leave statements unexecuted|||Để biết đầu vào nào gây ra kết quả và không bỏ sót câu lệnh', 'Because JUnit accepts only one parameter|||Vì JUnit chỉ nhận một tham số', 'To make every case abnormal|||Để mọi ca đều là abnormal'], 1),
      q('Guide flowchart: if a > 0 then A and (if b >= 0 then C else D), else B. Cases (5,10), (1,0), (0,-1) are run. What is not executed?|||Lưu đồ hướng dẫn: nếu a > 0 thì A và (nếu b >= 0 thì C, ngược lại D), ngược lại B. Chạy các ca (5,10), (1,0), (0,-1). Phần nào không được chạy?',
        ['Statements A|||Xử lý A', 'Statements B|||Xử lý B', 'Statements C|||Xử lý C', 'Statements D|||Xử lý D'], 3),
      q('For the decision "a > 0 && b >= 0", the cases (a=5,b=10) and (a=0,b=10) are executed. Which statement is true?|||Với quyết định "a > 0 && b >= 0", chạy các ca (a=5,b=10) và (a=0,b=10). Phát biểu nào đúng?',
        ['Decision coverage is 50%|||Decision coverage là 50%', 'Decision coverage is 100%, but the sub-condition b >= 0 has never been false|||Decision coverage là 100%, nhưng điều kiện con b >= 0 chưa từng sai', 'Statement coverage is below 100%|||Statement coverage dưới 100%', 'Every sub-condition has been tested both ways|||Mọi điều kiện con đã được thử cả hai chiều'], 1),
      q('An input of the unit is a list. Which element counts must the PCL include?|||Một đầu vào của unit là danh sách. PCL phải có các số phần tử nào?',
        ['Only a typical count such as 5|||Chỉ một số điển hình như 5', '0, 1 and many elements (separately for each list)|||0, 1 và nhiều phần tử (riêng cho từng danh sách)', 'Only the maximum count|||Chỉ số lượng tối đa', 'Only an empty list|||Chỉ danh sách rỗng'], 1),
      q('Why must input values also be checked on the server side (guide slide 67)?|||Vì sao giá trị đầu vào phải được kiểm cả ở phía server (slide 67 của hướng dẫn)?',
        ['Because JavaScript is slow|||Vì JavaScript chậm', 'Because a user can edit the HTTP request and bypass the client-side check|||Vì người dùng có thể sửa request HTTP để vượt qua kiểm tra phía client', 'Because the client cannot display errors|||Vì client không hiển thị được lỗi', 'Because the database requires it|||Vì database đòi hỏi'], 1),
      q('In a PCL, two test cases have the same input values but different expected results. What does this indicate?|||Trong PCL, hai test case có cùng giá trị đầu vào nhưng khác kết quả mong đợi. Điều đó cho thấy gì?',
        ['The code is certainly wrong|||Code chắc chắn sai', 'An input condition (e.g. DB data or a setting) is missing from the matrix|||Ma trận đang thiếu một điều kiện đầu vào (ví dụ dữ liệu DB hay cấu hình)', 'One case should be deleted|||Nên xoá một ca', 'The cases are boundary cases|||Đó là các ca biên'], 1),
      q('For an input range 5 <= x <= 10, which are the boundary values by boundary value analysis (two-value)?|||Với khoảng đầu vào 5 <= x <= 10, theo phân tích giá trị biên (hai giá trị), giá trị biên là gì?',
        ['4 and 11 only|||Chỉ 4 và 11', '5 and 10 (tested together with the invalid neighbours 4 and 11)|||5 và 10 (test cùng các láng giềng không hợp lệ 4 và 11)', '6, 7, 8, 9|||6, 7, 8, 9', '-1 and 12|||-1 và 12'], 1),
      q('A test case checks a submodule\'s interface using a boundary value and expects a normal result. Which Hitachi categories apply?|||Một test case kiểm giao diện của submodule bằng giá trị biên và mong đợi kết quả bình thường. Áp dụng các loại Hitachi nào?',
        ['E only|||Chỉ E', 'N, L, I|||N, L, I', 'L only|||Chỉ L', 'E, I|||E, I'], 1),
      q('When is the matrix checklist format preferred over the list format?|||Khi nào nên dùng dạng checklist ma trận thay vì dạng danh sách?',
        ['When every case has a different, complex procedure|||Khi mỗi ca có thủ tục riêng, phức tạp', 'When one procedure is shared and only input/output values vary|||Khi dùng chung một thủ tục và chỉ thay đổi giá trị vào/ra', 'Only for acceptance testing|||Chỉ cho acceptance testing', 'Never, the list format is always better|||Không bao giờ, dạng danh sách luôn tốt hơn'], 1),
      q('FA23 PE: what is the minimum number of test cases for 100% statement and 100% decision coverage of countCharacters(String) (loop over characters with if isUpperCase / else if isLowerCase / else if isDigit / else)?|||Đề PE FA23: số test case tối thiểu để countCharacters(String) (lặp qua từng ký tự với if isUpperCase / else if isLowerCase / else if isDigit / else) đạt 100% statement và 100% decision coverage là bao nhiêu?',
        ['1, e.g. "Aa1@"|||1, ví dụ "Aa1@"', '3|||3', '4, one per branch|||4, mỗi nhánh một ca', '8, one per decision outcome|||8, mỗi kết quả quyết định một ca'], 0),
      q('Template function sheet: Lines of code = 50, Normal number of test cases/KLOC = 100, Total test cases = 3. What does "Lack of test cases" show?|||Sheet function của template: Lines of code = 50, Normal number of test cases/KLOC = 100, Total test cases = 3. Ô "Lack of test cases" hiện gì?',
        ['-2|||-2', '2|||2', '5|||5', '47|||47'], 1),
      q('Test Report: Passed 24, Failed 5, Untested 3, Total 32. What is "Test coverage"?|||Test Report: Passed 24, Failed 5, Untested 3, Total 32. "Test coverage" bằng bao nhiêu?',
        ['75%|||75%', '90.625%|||90,625%', '9.375%|||9,375%', '100%|||100%'], 1),
      q('Which case mix does the black-box variant of Lab 2 require?|||Biến thể black-box của Lab 2 yêu cầu tỉ lệ ca nào?',
        ['Normal > 60%, Abnormal < 20%, Boundary > 20%|||Normal > 60%, Abnormal < 20%, Boundary > 20%', 'Normal < 20%, Abnormal > 60%, Boundary > 20%|||Normal < 20%, Abnormal > 60%, Boundary > 20%', 'Equal thirds|||Mỗi loại một phần ba', 'Only normal cases|||Chỉ ca normal'], 1),
      q('White-box Lab 2: your chosen SWP391 code has 180 LOC. According to the grading scale, what is the base score (before the 0-2 difficulty points)?|||Lab 2 white-box: code SWP391 bạn chọn có 180 LOC. Theo thang điểm, điểm cơ bản (trước 0-2 điểm độ khó) là bao nhiêu?',
        ['1-4|||1-4', '5|||5', '6|||6', '8|||8'], 1),
      q('Which statement about coverage is true?|||Phát biểu nào về coverage là đúng?',
        ['100% statement coverage guarantees 100% decision coverage|||100% statement coverage bảo đảm 100% decision coverage', '100% decision coverage guarantees 100% statement coverage|||100% decision coverage bảo đảm 100% statement coverage', '100% coverage proves the unit has no defects|||100% coverage chứng minh unit không có defect', 'Tests without assertions cannot reach 100% coverage|||Test không có assertion không thể đạt 100% coverage'], 1),
    ],
  },
};

export default {
  title: 'Lab 2 — Component (unit) testing: white-box & black-box|||Lab 2 — Component (unit) test: white-box & black-box',
  description: 'Lab 2 học từng slide: bộ hướng dẫn unit test của Hitachi (88 slide, dịch cả trang tiếng Nhật), cách viết PCL (32), đề bài white-box (13) và black-box (14), các checklist, Detail Design JNAP, template Unit Test Case với sheet mẫu đã chạy JUnit + JaCoCo, bộ UnitTestPoints và quiz.',
  lessons: [L21, L22, L23, L24, L25, L26, L27, L28, L29, QUIZ],
};
