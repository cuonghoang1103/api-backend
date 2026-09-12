/**
 * SWT301 · Lab 3 — Integration & system test reports.
 * Sources:
 *   02.Lab/03.LAB03/01.Guide/5341_SEP490_G47_SEP490_G47_Report5_Integration_Test.xlsx  (a real capstone sample;
 *      byte-identical copies in 01.Materials/05.Templates/Samples and 02.LAB02/01.Guide/Template/Samples)
 *   01.Materials/05.Templates/Report5.1_Unit Test.xls, Report5.2_Integration Test.xlsx, Report5.3_System Test.xlsx
 *   01.Materials/05.Templates/Samples/…Report5_Unit_Test.xlsx
 * Every sheet was dumped cell by cell AND formula by formula (the formulas are
 * what the "template bugs" below are about). No slides exist for Lab 3, so the
 * lessons are DOCUMENT lessons without slide images.
 * Personal data rule: the sample contains the team's names, e-mail addresses,
 * phone numbers and live-looking API tokens — none of them is reproduced here;
 * the team is called "the sample team".
 * The statistics of the worked example were computed with a script
 * (scratch/lab1agent/stats.py) using the templates' own formulas.
 */
import { bi, books } from './_slides.mjs';

/* ─────────────────────────── worked example data ─────────────────────────── */
// [id, description, procedure, expected, precondition, r1, r2, r3, note]
const TCS = [
  ['group', 'Login'],
  ['IT01_TC01', 'Login with a registered, active account', '1. Open the Login page<br>2. Enter &lt;Email&gt;: "user01@example.com", &lt;Password&gt;: "Passw0rd!"<br>3. Click &lt;Login&gt;', 'Dashboard is displayed with the user\'s name; table <code>sessions</code> has a new row for user01; <code>users.last_login</code> is updated', 'user01 exists with status ACTIVE', 'Passed', 'Passed', 'Passed', ''],
  ['IT01_TC02', 'Login with a wrong password', '1. Open the Login page<br>2. Email "user01@example.com", Password "Wrong123!"<br>3. Click &lt;Login&gt;', 'Message "Invalid email or password"; <code>users.failed_attempts</code> of user01 = 1; no session created', 'user01 ACTIVE, failed_attempts = 0', 'Passed', 'Passed', 'Passed', ''],
  ['IT01_TC03', 'Login with an unregistered e-mail', '1. Open the Login page<br>2. Email "nobody@example.com", Password "Passw0rd!"<br>3. Click &lt;Login&gt;', 'The same generic message "Invalid email or password" (the page must not reveal whether the e-mail exists)', 'nobody@example.com is not in <code>users</code>', 'Failed', 'Passed', 'Passed', 'R1: message was "Email not found" → DF-L01'],
  ['IT01_TC04', 'Account is locked after 5 consecutive wrong passwords', '1. Repeat IT01_TC02 five times<br>2. Check the message after the 5th attempt', 'Message "Account locked for 15 minutes"; <code>users.status</code> = LOCKED; <code>locked_until</code> = now + 15 min', 'user02 ACTIVE, failed_attempts = 0', 'Failed', 'Failed', 'Passed', 'R1, R2: still ACTIVE after 5 attempts → DF-L02 (reopened once)'],
  ['IT01_TC05', 'Locked account cannot log in even with the right password', '1. Open the Login page<br>2. Email "user02@example.com", Password "Passw0rd!"<br>3. Click &lt;Login&gt;', 'Message "Account locked for 15 minutes"; no session created', 'Pass IT01_TC04 (user02 LOCKED)', 'Pending', 'Passed', 'Passed', 'R1: blocked — precondition IT01_TC04 failed'],
  ['IT01_TC06', 'Required-field validation happens before calling the API', '1. Open the Login page<br>2. Leave Email and Password empty<br>3. Click &lt;Login&gt;', '"Email is required" and "Password is required" under the fields; the browser Network tab shows no request to <code>/api/auth/login</code>', '—', 'Passed', 'Passed', 'Passed', ''],
  ['group', 'Change password'],
  ['IT01_TC07', 'Change password with valid data, then log in with the new password', '1. Log in as user03<br>2. Profile → &lt;Change password&gt;<br>3. Old "Passw0rd!", New "NewPass9", Confirm "NewPass9"<br>4. Click &lt;Save&gt;, log out, log in with "NewPass9"', '"Password changed successfully"; the hash in <code>users.password_hash</code> changes; other sessions of user03 are revoked; login with the new password succeeds and with the old one fails', 'user03 ACTIVE, logged in on two browsers', 'Passed', 'Passed', 'Passed', ''],
  ['IT01_TC08', 'Wrong old password is rejected', 'Steps 1–2 of IT01_TC07; Old "Wrong000", New "NewPass9", Confirm "NewPass9"; Save', '"Old password is incorrect"; <code>password_hash</code> unchanged', 'user03 logged in', 'Failed', 'Passed', 'Passed', 'R1: API returned 500 instead of 400 → DF-L03'],
  ['IT01_TC09', 'New password of 7 characters is rejected (boundary, invalid side)', 'Steps 1–2; Old correct, New "Pass12a" (7), Confirm "Pass12a"; Save', '"Password must be at least 8 characters"; hash unchanged', 'user03 logged in', 'Passed', 'Passed', 'Passed', 'BVA: 7 / 8'],
  ['IT01_TC10', 'New password of exactly 8 characters is accepted (boundary, valid side)', 'Steps 1–2; Old correct, New "Pass123a" (8), Confirm "Pass123a"; Save', '"Password changed successfully"; hash changed', 'user03 logged in', 'Failed', 'Passed', 'Passed', 'R1: 8 chars rejected (check was &gt; 8) → DF-L04'],
  ['IT01_TC11', 'Confirmation does not match', 'Steps 1–2; New "NewPass9", Confirm "NewPass8"; Save', '"Passwords do not match"; no request to <code>/api/users/me/password</code>', 'user03 logged in', 'Passed', 'Passed', 'Passed', ''],
  ['IT01_TC12', 'Expired session when saving', 'Steps 1–2; wait until the 30-min session expires; Save a valid change', 'API answers 401; the UI redirects to Login with "Session expired, please log in again"; hash unchanged', 'Session timeout set to 30 min', 'N/A', 'N/A', 'Passed', 'R1, R2: session timeout not yet in the build'],
];
const cls = (r) => (r === 'Passed' ? 'ok' : r === 'Failed' ? 'bad' : '');
const tcTable = () => `<div class="table-wrap"><table>
<thead><tr><th>Test Case ID</th><th>Test Case Description</th><th>Test Case Procedure</th><th>Expected Results</th><th>Pre-conditions</th><th>Round 1<br>(10/03)</th><th>Round 2<br>(17/03)</th><th>Round 3<br>(24/03)</th><th>Note</th></tr></thead>
<tbody>${TCS.map((t) => (t[0] === 'group' ? `<tr><td colspan="9"><strong>${t[1]}</strong></td></tr>` : `<tr><td>${t[0]}</td><td>${t[1]}</td><td>${t[2]}</td><td>${t[3]}</td><td>${t[4]}</td><td class="${cls(t[5])}">${t[5]}</td><td class="${cls(t[6])}">${t[6]}</td><td class="${cls(t[7])}">${t[7]}</td><td>${t[8]}</td></tr>`)).join('')}</tbody>
</table></div>`;

const ROUNDS = `<table>
<thead><tr><th>Testing Round</th><th>Passed</th><th>Failed</th><th>Pending</th><th>N/A</th><th>Test coverage</th><th>Test successful coverage</th></tr></thead>
<tbody>
<tr><td>Round 1</td><td>6</td><td>4</td><td>1</td><td>1</td><td>(6+4)×100/(12−1) = <strong>90.91 %</strong></td><td>6×100/11 = <strong>54.55 %</strong></td></tr>
<tr><td>Round 2</td><td>10</td><td>1</td><td>0</td><td>1</td><td>(10+1)×100/11 = <strong>100 %</strong></td><td>10×100/11 = <strong>90.91 %</strong></td></tr>
<tr><td>Round 3</td><td>12</td><td>0</td><td>0</td><td>0</td><td>12×100/12 = <strong>100 %</strong></td><td>12×100/12 = <strong>100 %</strong></td></tr>
</tbody></table>`;

/* ═══════════════════════ Lesson 1 — the three templates ═══════════════════════ */
const L1 = {
  title: 'Lab 3.1 — The Report5 templates: unit, integration and system test, sheet by sheet|||Lab 3.1 — Bộ template Report5: unit, integration, system test, từng sheet',
  slug: 'swt301-lab3-report-templates',
  type: 'DOCUMENT',
  description: 'Report5.1 Unit Test, 5.2 Integration Test, 5.3 System Test: mỗi template dùng cho cấp test nào (CT / CIT-SIT / ST), giải thích từng sheet, từng cột, từng công thức đếm — và 4 lỗi công thức có sẵn trong template.',
  content: [
    bi(`<span class="eyebrow">Lab 3 · Lesson 3.1 · Report5.1_Unit Test.xls · Report5.2_Integration Test.xlsx · Report5.3_System Test.xlsx</span>
<h2>Three templates, three test levels</h2>
<p class="lead">Lab 3 (and the testing part of every SEP490 capstone) is written in FPT's "Report 5" workbooks. They are not three copies of one form: each belongs to a different row of the teacher's Overview matrix (lesson 2.6), and each counts results in its own way.</p>
<p>This lesson opens every sheet and explains every column and every formula — including four formula bugs shipped inside the templates that silently falsify your statistics if you do not fix them.</p>
<div class="callout"><strong>Learning objectives.</strong>
<ul>
<li><strong>LO-2.2.1</strong> — compare test levels by objectives, test basis, test objects and typical defects (K2).</li>
<li><strong>LO-1.4.3</strong> — relate test work products to the test activities (K2).</li>
<li><strong>LO-5.3.1</strong> — recall metrics used in testing (K1).</li>
<li><strong>LO-5.3.2</strong> — summarise the purpose and content of test reports (K2).</li>
</ul></div>
<table>
<thead><tr><th>Template</th><th>Overview level (lesson 2.6)</th><th>Test object &amp; basis</th><th>One test case is…</th><th>Results counted as</th></tr></thead>
<tbody>
<tr><td><strong>Report5.1 Unit Test</strong> (.xls)</td><td><strong>CT</strong> — component (unit) test</td><td>one <em>method</em>; detailed design / class specification</td><td>a <strong>column</strong> UTCIDnn in a condition × confirmation matrix</td><td>P / F, type N / A / B (normal, abnormal, boundary)</td></tr>
<tr><td><strong>Report5.2 Integration Test</strong></td><td><strong>CIT</strong> (component integration) and <strong>SIT</strong> (system integration)</td><td>a <em>feature</em>: UI → API → service → database / external system; architecture &amp; sequence diagrams</td><td>a <strong>row</strong>: description, procedure, expected result, precondition</td><td>Passed / Failed / Pending / N/A, in up to 3 rounds</td></tr>
<tr><td><strong>Report5.3 System Test</strong></td><td><strong>ST</strong> — system test</td><td>an end-to-end <em>workflow</em> of the whole system; SRS, use cases</td><td>a <strong>row</strong>, grouped into scenarios</td><td>Passed / Failed / Pending / N/A, in up to 3 rounds</td></tr>
</tbody>
</table>
<p>The difference you must be able to explain in the demo:</p>
<ul>
<li><strong>Unit test</strong> — checks that <code>changePassword()</code> rejects a 7-character password.</li>
<li><strong>Integration test</strong> — checks that the form, the REST endpoint, the service and the <code>users</code> table <em>together</em> reject it and leave the hash unchanged.</li>
<li><strong>System test</strong> — checks the user's whole journey (change password, get logged out elsewhere, log back in) against the SRS.</li>
</ul>`,
    `<span class="eyebrow">Lab 3 · Bài 3.1 · Report5.1_Unit Test.xls · Report5.2_Integration Test.xlsx · Report5.3_System Test.xlsx</span>
<h2>Ba template, ba cấp test</h2>
<p class="lead">Lab 3 (và phần kiểm thử của mọi đồ án SEP490) được viết trên các workbook "Report 5" của FPT. Đây không phải ba bản sao của cùng một mẫu: mỗi file ứng với một dòng trong bảng Overview của thầy/cô (bài 2.6), và mỗi file đếm kết quả theo cách riêng.</p>
<p>Bài này mở từng sheet, giải thích từng cột và từng công thức — kể cả bốn lỗi công thức có sẵn trong template, âm thầm làm sai số liệu thống kê nếu bạn không sửa.</p>
<div class="callout"><strong>Chuẩn đầu ra.</strong>
<ul>
<li><strong>LO-2.2.1</strong> — so sánh các cấp test theo mục tiêu, cơ sở test, đối tượng test và loại defect điển hình (K2).</li>
<li><strong>LO-1.4.3</strong> — liên hệ sản phẩm test với các hoạt động test (K2).</li>
<li><strong>LO-5.3.1</strong> — nhớ các số đo dùng trong kiểm thử (K1).</li>
<li><strong>LO-5.3.2</strong> — tóm tắt mục đích và nội dung của báo cáo test (K2).</li>
</ul></div>
<table>
<thead><tr><th>Template</th><th>Cấp trong Overview (bài 2.6)</th><th>Đối tượng &amp; cơ sở test</th><th>Một test case là…</th><th>Kết quả đếm theo</th></tr></thead>
<tbody>
<tr><td><strong>Report5.1 Unit Test</strong> (.xls)</td><td><strong>CT</strong> — component (unit) test</td><td>một <em>method</em>; thiết kế chi tiết / đặc tả lớp</td><td>một <strong>cột</strong> UTCIDnn trong ma trận điều kiện × xác nhận</td><td>P / F, loại N / A / B (normal, abnormal, boundary)</td></tr>
<tr><td><strong>Report5.2 Integration Test</strong></td><td><strong>CIT</strong> (tích hợp thành phần) và <strong>SIT</strong> (tích hợp hệ thống)</td><td>một <em>feature</em>: UI → API → service → database / hệ thống ngoài; kiến trúc &amp; sequence diagram</td><td>một <strong>dòng</strong>: mô tả, các bước, kết quả mong đợi, điều kiện tiên quyết</td><td>Passed / Failed / Pending / N/A, tối đa 3 vòng</td></tr>
<tr><td><strong>Report5.3 System Test</strong></td><td><strong>ST</strong> — system test</td><td>một <em>workflow</em> đầu-cuối của cả hệ thống; SRS, use case</td><td>một <strong>dòng</strong>, gom theo scenario</td><td>Passed / Failed / Pending / N/A, tối đa 3 vòng</td></tr>
</tbody>
</table>
<p>Khác biệt bạn phải giải thích được khi demo:</p>
<ul>
<li><strong>Unit test</strong> — kiểm <code>changePassword()</code> từ chối mật khẩu 7 ký tự.</li>
<li><strong>Integration test</strong> — kiểm form, REST endpoint, service và bảng <code>users</code> <em>cùng nhau</em> từ chối nó và không đổi hash.</li>
<li><strong>System test</strong> — kiểm cả hành trình của người dùng (đổi mật khẩu, bị đăng xuất ở nơi khác, đăng nhập lại) so với SRS.</li>
</ul>`),
    bi(`<h2>1 · The Cover sheet (identical in all three)</h2>
<table>
<thead><tr><th>Cell</th><th>Content</th><th>How to fill</th></tr></thead>
<tbody>
<tr><td>B2</td><td>Title: UNIT TEST DOCUMENT / TEST REPORT DOCUMENT / SYSTEM TEST REPORT DOCUMENT</td><td>leave</td></tr>
<tr><td>B4, B5</td><td>Project Name, Project Code</td><td>e.g. "Online Bookstore", "OBS". Other sheets read these two cells.</td></tr>
<tr><td>B6</td><td>Document Code — <strong>formula</strong> <code>=B5&amp;"_"&amp;"XXX"&amp;"_"&amp;"vx.x"</code></td><td>edit the formula: replace XXX by the report type and vx.x by the version → <em>OBS_IntegrationTest_v1.0</em>. Leaving "XXX_vx.x" is the most visible sloppiness in a submission.</td></tr>
<tr><td>F4–F6</td><td>Creator, Issue Date, Version</td><td>who prepared it, the date of <em>this</em> issue, v1.0, v1.1…</td></tr>
<tr><td>A10:F10…</td><td><strong>Record of change</strong>: Effective Date · Version · Change Item · *A,D,M · Change description · Reference</td><td>one row per change; *A/D/M = <strong>A</strong>dded, <strong>D</strong>eleted, <strong>M</strong>odified; Reference = the documents used (SRS v1.2, design v1.0). This is configuration management of testware (Chapter 5).</td></tr>
</tbody>
</table>
<h2>2 · Report5.1 Unit Test — sheets Guideline, Cover, MethodList, Statistics, one sheet per method, Example</h2>
<h3>Guideline (the template explains itself — summary)</h3>
<p>Test cases are organised <em>per function</em>, one sheet each. Each test case = <strong>condition</strong> + <strong>confirmation</strong>.</p>
<ul>
<li><strong>Condition</strong> — a precondition (e.g. "file A exists") plus input values of three types:
<ul>
<li><strong>normal</strong> — usual values;</li>
<li><strong>boundary</strong> — lower/upper limits;</li>
<li><strong>abnormal</strong> — unexpected values, exception handling.</li>
</ul></li>
<li><strong>Confirmation</strong> — the expected return value, log message or screen message. If the result equals the confirmation the case is P (passed), else F (OK/NG also accepted).</li>
</ul>
<h4>The guideline's example: 5 ≤ input ≤ 10</h4>
<ul>
<li><strong>Normal</strong> — 6–9</li>
<li><strong>Boundary</strong> — 5 and 10</li>
<li><strong>Abnormal</strong> — −1 and 11</li>
</ul>
<p>It also mentions a "normal number of test cases per KLOC" to judge whether there are enough cases. That field exists only in the sample's MethodList ("Normal number of Test cases/KLOC = 20"), not in the empty template.</p>
<h3>MethodList</h3>
<ul>
<li><strong>Project Name/Code</strong> — formulas <code>=Cover!B4</code>, <code>=Cover!B5</code>.</li>
<li><strong>Test Environment Setup Description</strong> — server, database, browser…</li>
<li><strong>The method table</strong> — columns No, Module Name, Method Name, Sheet Name, Description, Pre-Condition. One row per method under test; Sheet Name = the tab that holds its cases.</li>
</ul>
<p><strong>A method sheet</strong> (layout of <em>methodName1</em>):</p>
<table>
<thead><tr><th>Area</th><th>Cells</th><th>Meaning / formula</th></tr></thead>
<tbody>
<tr><td>Header</td><td>A1–L3</td><td>Code Module, Method, Created By, Executed By, Test requirement (a sentence on what is tested)</td></tr>
<tr><td>Counters</td><td>A5 Passed · C5 Failed · F5 Untested · L5/M5/N5 N/A/B · O5 Total</td><td><code>A5 =COUNTIF(F38:HQ38,"P")</code>, <code>C5 =COUNTIF(F38:HQ38,"F")</code>, <code>O5 =COUNTA(E7:HT7)</code> (number of UTCID headers), <code>F5 =SUM(O5,-A5,-C5)</code> (= total − passed − failed), <code>L5/M5/N5 =COUNTIF(E37:HQ37,"N"/"A"/"B")</code></td></tr>
<tr><td>Test case IDs</td><td>row 7 from column F</td><td>UTCID01, UTCID02… — <strong>one column per test case</strong></td></tr>
<tr><td>Condition</td><td>rows 8–28</td><td>B = precondition or input name ("Date", "Month"…), D = one value per row ("29", "null", "&gt;=5 &amp; &lt;=10"), and an <strong>"O"</strong> in the UTCID column means "this case uses this value" (dropdown list "O")</td></tr>
<tr><td>Confirm</td><td>rows 29–36</td><td>Return (expected return values), Exception, Log message — again one value per row, "O" per case</td></tr>
<tr><td>Result</td><td>rows 37–40</td><td>Type (dropdown N, A, B) · Passed/Failed (dropdown P, F) · Executed Date · Defect ID</td></tr>
</tbody>
</table>
<h3>Statistics</h3>
<ul>
<li><strong>One row per method</strong> — each cell a link to that sheet: <code>C12 =methodName1!A5</code>, D12 = …!C5, E12 = …!F5, F–H = N/A/B, I12 = …!O5.</li>
<li><strong>Sub total</strong> — <code>=SUM(C10:C15)</code>.</li>
<li><strong>Test coverage</strong> — <code>=(C16+D16)*100/I16</code>: executed (passed + failed) over all cases.</li>
<li><strong>Test successful coverage</strong> — <code>=C16*100/I16</code>.</li>
<li><strong>Share of Normal / Abnormal / Boundary</strong> — <code>=F16*100/I16</code> etc.</li>
</ul>
<p>With the template's sample numbers: 30 cases, 24 P, 5 F, 1 untested → 96.67 % coverage, 80 % successful, 76.67 / 16.67 / 6.67 % N/A/B.</p>
<h3>Example sheet — a filled matrix you should be able to read</h3>
<p>Inputs a, b, c; returns a list. Decoded, it tests a solver of a·x² + b·x + c = 0:</p>
<ul>
<li>(a=−2) → abnormal, log "please input a&gt;= -1", return null</li>
<li>(0,0,0) → size 0</li>
<li>(0,0,1) → null</li>
<li>(0,2,1) → {−1/2}</li>
<li>(1,−2,1) → {1,1}</li>
<li>(1,−2,5) → null (negative discriminant)</li>
<li>(−1,−2,3) → {1,−3}, marked B because a = −1 is the lower boundary of "a ≥ −1"</li>
</ul>
<p class="ghi-chu">Roots re-computed: x² − 2x + 1 has the double root 1; −x² − 2x + 3 = 0 has roots 1 and −3.</p>
<p>Two template typos:</p>
<ul>
<li>columns H–K are all headed "UTCID02";</li>
<li>the dates are Excel serials 39139… (February–March 2007) — the template's age.</li>
</ul>`,
    `<h2>1 · Sheet Cover (giống nhau ở cả ba)</h2>
<table>
<thead><tr><th>Ô</th><th>Nội dung</th><th>Cách điền</th></tr></thead>
<tbody>
<tr><td>B2</td><td>Tiêu đề: UNIT TEST DOCUMENT / TEST REPORT DOCUMENT / SYSTEM TEST REPORT DOCUMENT</td><td>giữ nguyên</td></tr>
<tr><td>B4, B5</td><td>Project Name, Project Code</td><td>vd "Online Bookstore", "OBS". Các sheet khác đọc hai ô này.</td></tr>
<tr><td>B6</td><td>Document Code — <strong>công thức</strong> <code>=B5&amp;"_"&amp;"XXX"&amp;"_"&amp;"vx.x"</code></td><td>sửa công thức: thay XXX bằng loại báo cáo, vx.x bằng phiên bản → <em>OBS_IntegrationTest_v1.0</em>. Để nguyên "XXX_vx.x" là lỗi cẩu thả lộ nhất trong bài nộp.</td></tr>
<tr><td>F4–F6</td><td>Creator, Issue Date, Version</td><td>người soạn, ngày phát hành <em>bản này</em>, v1.0, v1.1…</td></tr>
<tr><td>A10:F10…</td><td><strong>Record of change</strong>: Effective Date · Version · Change Item · *A,D,M · Change description · Reference</td><td>mỗi thay đổi một dòng; *A/D/M = <strong>A</strong>dded (thêm), <strong>D</strong>eleted (xoá), <strong>M</strong>odified (sửa); Reference = tài liệu tham chiếu (SRS v1.2, thiết kế v1.0). Đây là quản lý cấu hình cho testware (Chương 5).</td></tr>
</tbody>
</table>
<h2>2 · Report5.1 Unit Test — các sheet Guideline, Cover, MethodList, Statistics, mỗi method một sheet, Example</h2>
<h3>Guideline (template tự giải thích — tóm tắt)</h3>
<p>Test case tổ chức <em>theo hàm</em>, mỗi hàm một sheet. Mỗi test case = <strong>condition</strong> (điều kiện) + <strong>confirmation</strong> (xác nhận).</p>
<ul>
<li><strong>Condition</strong> — một precondition (vd "có file A") cộng giá trị đầu vào thuộc ba loại:
<ul>
<li><strong>normal</strong> — giá trị thường dùng;</li>
<li><strong>boundary</strong> — giới hạn dưới/trên;</li>
<li><strong>abnormal</strong> — giá trị ngoài mong đợi, xử lý ngoại lệ.</li>
</ul></li>
<li><strong>Confirmation</strong> — giá trị trả về, log message hoặc thông báo màn hình mong đợi. Kết quả trùng confirmation thì case là P (passed), ngược lại F (cũng chấp nhận OK/NG).</li>
</ul>
<h4>Ví dụ của guideline: 5 ≤ input ≤ 10</h4>
<ul>
<li><strong>Normal</strong> — 6–9</li>
<li><strong>Boundary</strong> — 5 và 10</li>
<li><strong>Abnormal</strong> — −1 và 11</li>
</ul>
<p>Guideline còn nhắc chỉ số "số test case chuẩn trên mỗi KLOC" để đánh giá đủ hay thiếu. Ô này chỉ có trong MethodList của file mẫu ("Normal number of Test cases/KLOC = 20"), không có trong template trống.</p>
<h3>MethodList</h3>
<ul>
<li><strong>Project Name/Code</strong> — công thức <code>=Cover!B4</code>, <code>=Cover!B5</code>.</li>
<li><strong>Test Environment Setup Description</strong> — server, database, trình duyệt…</li>
<li><strong>Bảng method</strong> — các cột No, Module Name, Method Name, Sheet Name, Description, Pre-Condition. Mỗi method được test một dòng; Sheet Name = tab chứa test case của nó.</li>
</ul>
<p><strong>Một sheet method</strong> (bố cục của <em>methodName1</em>):</p>
<table>
<thead><tr><th>Vùng</th><th>Ô</th><th>Ý nghĩa / công thức</th></tr></thead>
<tbody>
<tr><td>Đầu sheet</td><td>A1–L3</td><td>Code Module, Method, Created By, Executed By, Test requirement (một câu nói test cái gì)</td></tr>
<tr><td>Bộ đếm</td><td>A5 Passed · C5 Failed · F5 Untested · L5/M5/N5 N/A/B · O5 Total</td><td><code>A5 =COUNTIF(F38:HQ38,"P")</code>, <code>C5 =COUNTIF(F38:HQ38,"F")</code>, <code>O5 =COUNTA(E7:HT7)</code> (số tiêu đề UTCID), <code>F5 =SUM(O5,-A5,-C5)</code> (= tổng − passed − failed), <code>L5/M5/N5 =COUNTIF(E37:HQ37,"N"/"A"/"B")</code></td></tr>
<tr><td>Mã test case</td><td>dòng 7 từ cột F</td><td>UTCID01, UTCID02… — <strong>mỗi test case một cột</strong></td></tr>
<tr><td>Condition</td><td>dòng 8–28</td><td>B = precondition hoặc tên input ("Date", "Month"…), D = mỗi dòng một giá trị ("29", "null", "&gt;=5 &amp; &lt;=10"), và <strong>"O"</strong> ở cột UTCID nghĩa là "case này dùng giá trị này" (danh sách chọn "O")</td></tr>
<tr><td>Confirm</td><td>dòng 29–36</td><td>Return (giá trị trả về mong đợi), Exception, Log message — cũng mỗi dòng một giá trị, "O" cho từng case</td></tr>
<tr><td>Result</td><td>dòng 37–40</td><td>Type (chọn N, A, B) · Passed/Failed (chọn P, F) · Executed Date · Defect ID</td></tr>
</tbody>
</table>
<h3>Statistics</h3>
<ul>
<li><strong>Mỗi method một dòng</strong> — mỗi ô là liên kết tới sheet đó: <code>C12 =methodName1!A5</code>, D12 = …!C5, E12 = …!F5, F–H = N/A/B, I12 = …!O5.</li>
<li><strong>Sub total</strong> — <code>=SUM(C10:C15)</code>.</li>
<li><strong>Test coverage</strong> — <code>=(C16+D16)*100/I16</code>: đã chạy (passed + failed) trên tổng số case.</li>
<li><strong>Test successful coverage</strong> — <code>=C16*100/I16</code>.</li>
<li><strong>Tỉ lệ case Normal / Abnormal / Boundary</strong> — <code>=F16*100/I16</code>…</li>
</ul>
<p>Với số mẫu trong template: 30 case, 24 P, 5 F, 1 chưa chạy → coverage 96,67 %, thành công 80 %, N/A/B 76,67 / 16,67 / 6,67 %.</p>
<h3>Sheet Example — một ma trận đã điền, bạn phải đọc được</h3>
<p>Input a, b, c; trả về một list. Giải mã ra, nó test hàm giải a·x² + b·x + c = 0:</p>
<ul>
<li>(a=−2) → abnormal, log "please input a&gt;= -1", trả null</li>
<li>(0,0,0) → size 0</li>
<li>(0,0,1) → null</li>
<li>(0,2,1) → {−1/2}</li>
<li>(1,−2,1) → {1,1}</li>
<li>(1,−2,5) → null (biệt thức âm)</li>
<li>(−1,−2,3) → {1,−3}, đánh dấu B vì a = −1 là biên dưới của "a ≥ −1"</li>
</ul>
<p class="ghi-chu">Đã tính lại nghiệm: x² − 2x + 1 có nghiệm kép 1; −x² − 2x + 3 = 0 có nghiệm 1 và −3.</p>
<p>Hai lỗi đánh máy của template:</p>
<ul>
<li>các cột H–K đều mang tiêu đề "UTCID02";</li>
<li>ngày là số serial Excel 39139… (tháng 2–3/2007) — tuổi của template.</li>
</ul>`),
    bi(`<h2>3 · Report5.2 Integration Test and Report5.3 System Test</h2>
<p>The two workbooks are the same machine with different words: Integration uses <em>Feature</em> sheets split into <em>Functions</em>; System uses <em>Workflow</em> sheets split into <em>Scenarios</em>.</p>
<h3>Sheet "Test Cases" (the index)</h3>
<ul>
<li><strong>Project Name/Code</strong> — D3, D4.</li>
<li><strong>Test Environment Setup Description</strong> — D5: server, database, browser…</li>
<li><strong>The function table</strong> — columns No, Function Name, Sheet Name, Description, Pre-Condition. One row per function (Integration) or per function in a workflow (System), telling the reader which sheet contains it.</li>
</ul>
<h3>A Feature / Workflow sheet</h3>
<table>
<thead><tr><th>Cells</th><th>Content</th><th>Formula / rule</th></tr></thead>
<tbody>
<tr><td>B2, B3</td><td>Feature (Workflow) name, Test requirement</td><td>B2 is shown in Test Statistics; B3 = the requirement(s) covered, e.g. "UC-02 Change password, SRS §3.4"</td></tr>
<tr><td>B4</td><td>Number of TCs</td><td><code>=COUNTA(A12:A1000)</code> — counts every non-empty cell of column A below row 11 (see bug 1)</td></tr>
<tr><td>A5:E8</td><td>Testing Round × Passed / Failed / Pending / N/A</td><td><code>=COUNTIF($F10:$F998,B5)</code> for Round 1; Round 2 and 3 should count columns I and L (see bug 2)</td></tr>
<tr><td>R2:R5</td><td>the words Passed, Failed, Pending, N/A</td><td>source of the dropdown lists in the result columns — do not delete</td></tr>
<tr><td>A10:O10</td><td>Test Case ID · Test Case Description · Test Case Procedure · Expected Results · Pre-conditions · Round 1 · Test date · Tester · Round 2 · Test date · Tester · Round 3 · Test date · Tester · Note</td><td>one row per test case; a row with only column A ("Function A", "Scenario A") is a <strong>group header</strong></td></tr>
</tbody>
</table>
<h4>The template's own example of a good row</h4>
<ul>
<li><strong>Description</strong> — "Test viewing 'Company' form"</li>
<li><strong>Procedure</strong> — "1. Login the system with Manager role. 2. Click 'Company' tab in the left menu."</li>
<li><strong>Expected</strong> — "The 'Company' view form is displayed with the following information: Company name, address, phone, fax"</li>
<li><strong>Pre-conditions</strong> — "list all test cases or conditions that must be done before performing this case"</li>
</ul>
<h4>Result values</h4>
<ul>
<li><strong>Passed</strong></li>
<li><strong>Failed</strong></li>
<li><strong>Pending</strong> — not executed yet in this round (or blocked by another failure).</li>
<li><strong>N/A</strong> — not applicable in this round (feature not delivered in the build, environment not available). N/A cases are removed from the denominator of both coverages.</li>
</ul>
<h3>Sheet "Test Statistics"</h3>
<h4>Columns (one row per feature sheet)</h4>
<ul>
<li><strong>No</strong></li>
<li><strong>Module code</strong> — = <code>'Feature 1'!B2</code></li>
<li><strong>Passed · Failed · Pending · N/A</strong> — = that sheet's B6…E6, i.e. <strong>Round 1</strong></li>
<li><strong>Number of test cases</strong> — = B4</li>
</ul>
<p>Sub total <code>=SUM(D9:D13)</code>; then</p>
<ul>
<li><strong>Test coverage</strong> <code>=(D14+E14)*100/(H14-G14)</code> — executed (passed + failed) out of the applicable cases;</li>
<li><strong>Test successful coverage</strong> <code>=D14*100/(H14-G14)</code> — passed out of the applicable cases.</li>
</ul>
<p>Template values: 15 cases, 0 passed, 1 failed, 10 pending → coverage (0+1)×100/15 = <strong>6.67 %</strong>, successful 0 %.</p>
<h2>⚠️ Four bugs inside the templates (check your file)</h2>
<ol>
<li><strong>"Number of TCs" counts group headers.</strong> <code>COUNTA(A12:A1000)</code> counts "Function B" and "Function C" as test cases: Feature 1 shows <strong>8</strong> although it has 6 IDs; Feature 2 shows 7 for 5 IDs (its "Function E" plus a stray "6" in A18). Every percentage in Test Statistics is then computed on a wrong total. Fix: count only IDs, e.g. <code>=COUNTIF(A12:A1000,"*_*")</code> if your IDs contain "_" (the sample team did exactly this).</li>
<li><strong>Rounds 2 and 3 count Round 1's column.</strong> In Feature 1 the formulas of rows 7 and 8 are still <code>COUNTIF($F10:$F998,…)</code>, so the template shows Round 2 = "1 failed, 5 pending" although every Round 2 cell says Pending. Fix: Round 2 → <code>$I$12:$I$1000</code>, Round 3 → <code>$L$12:$L$1000</code>.</li>
<li><strong>#REF! on the Test Cases sheet.</strong> D3 and D4 point to a deleted sheet. Fix: <code>=Cover!B4</code>, <code>=Cover!B5</code>.</li>
<li><strong>Sub totals with fixed ranges.</strong> <code>SUM(D9:D13)</code> in 5.2/5.3 and <code>SUM(C10:C15)</code> in 5.1 only cover the rows that exist in the empty template. Add a sheet, add a row — and extend the range; the 5.1 Guideline itself warns "check the formula of Sub Total if you add more functions". Lesson 3.3 shows a real report that fell into this trap.</li>
</ol>
<p>A fifth decision, not a bug: Test Statistics links <strong>Round 1</strong>. For a final report you normally want the latest round — link B8…E8 instead and write in <em>Notes</em> which round the figures describe.</p>`,
    `<h2>3 · Report5.2 Integration Test và Report5.3 System Test</h2>
<p>Hai workbook là cùng một cỗ máy với từ ngữ khác nhau: Integration dùng sheet <em>Feature</em> chia thành <em>Function</em>; System dùng sheet <em>Workflow</em> chia thành <em>Scenario</em>.</p>
<h3>Sheet "Test Cases" (mục lục)</h3>
<ul>
<li><strong>Project Name/Code</strong> — D3, D4.</li>
<li><strong>Test Environment Setup Description</strong> — D5: server, database, trình duyệt…</li>
<li><strong>Bảng chức năng</strong> — các cột No, Function Name, Sheet Name, Description, Pre-Condition. Mỗi chức năng (Integration) hoặc mỗi chức năng trong workflow (System) một dòng, cho người đọc biết nó nằm ở sheet nào.</li>
</ul>
<h3>Một sheet Feature / Workflow</h3>
<table>
<thead><tr><th>Ô</th><th>Nội dung</th><th>Công thức / quy tắc</th></tr></thead>
<tbody>
<tr><td>B2, B3</td><td>Tên Feature (Workflow), Test requirement</td><td>B2 hiện trong Test Statistics; B3 = yêu cầu được phủ, vd "UC-02 Change password, SRS §3.4"</td></tr>
<tr><td>B4</td><td>Number of TCs</td><td><code>=COUNTA(A12:A1000)</code> — đếm mọi ô không trống ở cột A dưới dòng 11 (xem lỗi 1)</td></tr>
<tr><td>A5:E8</td><td>Testing Round × Passed / Failed / Pending / N/A</td><td><code>=COUNTIF($F10:$F998,B5)</code> cho Round 1; Round 2 và 3 lẽ ra đếm cột I và L (xem lỗi 2)</td></tr>
<tr><td>R2:R5</td><td>các chữ Passed, Failed, Pending, N/A</td><td>nguồn của danh sách chọn ở các cột kết quả — đừng xoá</td></tr>
<tr><td>A10:O10</td><td>Test Case ID · Test Case Description · Test Case Procedure · Expected Results · Pre-conditions · Round 1 · Test date · Tester · Round 2 · Test date · Tester · Round 3 · Test date · Tester · Note</td><td>mỗi test case một dòng; dòng chỉ có cột A ("Function A", "Scenario A") là <strong>dòng tiêu đề nhóm</strong></td></tr>
</tbody>
</table>
<h4>Ví dụ dòng tốt ngay trong template</h4>
<ul>
<li><strong>Mô tả</strong> — "Test viewing 'Company' form"</li>
<li><strong>Các bước</strong> — "1. Login the system with Manager role. 2. Click 'Company' tab in the left menu."</li>
<li><strong>Mong đợi</strong> — "Form xem 'Company' hiện các thông tin: tên công ty, địa chỉ, điện thoại, fax"</li>
<li><strong>Pre-conditions</strong> — "liệt kê mọi test case hoặc điều kiện phải xong trước khi chạy case này"</li>
</ul>
<h4>Giá trị kết quả</h4>
<ul>
<li><strong>Passed</strong></li>
<li><strong>Failed</strong></li>
<li><strong>Pending</strong> — chưa chạy ở vòng này (hoặc bị chặn bởi lỗi khác).</li>
<li><strong>N/A</strong> — không áp dụng ở vòng này (chức năng chưa có trong bản build, môi trường chưa sẵn). Case N/A bị loại khỏi mẫu số của cả hai loại coverage.</li>
</ul>
<h3>Sheet "Test Statistics"</h3>
<h4>Các cột (mỗi sheet feature một dòng)</h4>
<ul>
<li><strong>No</strong></li>
<li><strong>Module code</strong> — = <code>'Feature 1'!B2</code></li>
<li><strong>Passed · Failed · Pending · N/A</strong> — = B6…E6 của sheet đó, tức <strong>Round 1</strong></li>
<li><strong>Number of test cases</strong> — = B4</li>
</ul>
<p>Sub total <code>=SUM(D9:D13)</code>; rồi</p>
<ul>
<li><strong>Test coverage</strong> <code>=(D14+E14)*100/(H14-G14)</code> — số case đã chạy (passed + failed) trên số case áp dụng;</li>
<li><strong>Test successful coverage</strong> <code>=D14*100/(H14-G14)</code> — số case passed trên số case áp dụng.</li>
</ul>
<p>Số trong template: 15 case, 0 passed, 1 failed, 10 pending → coverage (0+1)×100/15 = <strong>6,67 %</strong>, thành công 0 %.</p>
<h2>⚠️ Bốn lỗi nằm sẵn trong template (hãy kiểm tra file của bạn)</h2>
<ol>
<li><strong>"Number of TCs" đếm cả dòng tiêu đề nhóm.</strong> <code>COUNTA(A12:A1000)</code> đếm "Function B" và "Function C" như test case: Feature 1 hiện <strong>8</strong> dù chỉ có 6 ID; Feature 2 hiện 7 cho 5 ID (do "Function E" và một số "6" lạc ở A18). Mọi phần trăm ở Test Statistics vì thế tính trên tổng sai. Sửa: chỉ đếm ID, vd <code>=COUNTIF(A12:A1000,"*_*")</code> nếu ID có dấu "_" (nhóm mẫu đã làm đúng như vậy).</li>
<li><strong>Round 2 và 3 đếm lại cột của Round 1.</strong> Ở Feature 1, công thức dòng 7 và 8 vẫn là <code>COUNTIF($F10:$F998,…)</code>, nên template hiện Round 2 = "1 failed, 5 pending" dù mọi ô Round 2 đều là Pending. Sửa: Round 2 → <code>$I$12:$I$1000</code>, Round 3 → <code>$L$12:$L$1000</code>.</li>
<li><strong>#REF! ở sheet Test Cases.</strong> D3 và D4 trỏ tới một sheet đã bị xoá. Sửa: <code>=Cover!B4</code>, <code>=Cover!B5</code>.</li>
<li><strong>Sub total với vùng cố định.</strong> <code>SUM(D9:D13)</code> ở 5.2/5.3 và <code>SUM(C10:C15)</code> ở 5.1 chỉ phủ các dòng có trong template trống. Thêm sheet, thêm dòng — thì phải nới vùng; chính Guideline của 5.1 đã cảnh báo "check the formula of Sub Total if you add more functions". Bài 3.3 cho thấy một báo cáo thật đã rơi đúng bẫy này.</li>
</ol>
<p>Một quyết định thứ năm, không phải lỗi: Test Statistics liên kết <strong>Round 1</strong>. Báo cáo cuối thường cần vòng mới nhất — hãy liên kết B8…E8 và ghi rõ trong <em>Notes</em> số liệu là của vòng nào.</p>`),
    bi(`<div class="pitfall co-tieu-de"><strong>FE / oral-check trap: "test coverage" in these reports is not code coverage.</strong>
<ul>
<li><strong>Test coverage</strong> here means <em>execution progress</em> — the share of planned, applicable test cases that were executed.</li>
<li><strong>Successful coverage</strong> — the share that passed.</li>
<li><strong>Statement/decision coverage</strong> (Chapter 4) — measured by a tool on the code.</li>
</ul>
<p>If an examiner asks "your report shows 100 % coverage — is every line tested?", the right answer is no: all planned cases ran; how much of the code or requirements they reach is a separate measurement.</p></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Why rounds instead of one result?</strong>
<p>Keeping Round 1/2/3 side by side turns the sheet into a small <em>test-execution history</em>. You can:</p>
<ul>
<li>compute how many defects were found per round;</li>
<li>see whether fixes stuck — a case that fails, passes, fails again signals a regression;</li>
<li>draw the classic "S-curve" of executed and passed cases over time used in test progress reports (van Veenendaal's Table 5.1 and Figure 5.2).</li>
</ul>
<p>Test-management tools (TestRail, Xray, Zephyr) store exactly this as "test runs". <em>Outside the syllabus because CTFL names the metrics but not a format.</em></p></div>`,
    `<div class="pitfall co-tieu-de"><strong>Bẫy FE / vấn đáp: "test coverage" trong các báo cáo này không phải code coverage.</strong>
<ul>
<li><strong>Test coverage</strong> ở đây nghĩa là <em>tiến độ thực thi</em> — tỉ lệ test case đã lên kế hoạch, áp dụng được, đã được chạy.</li>
<li><strong>Successful coverage</strong> — tỉ lệ đã pass.</li>
<li><strong>Statement/decision coverage</strong> (Chương 4) — do công cụ đo trên code.</li>
</ul>
<p>Nếu giám khảo hỏi "báo cáo ghi coverage 100 % — mọi dòng code đã được test?", câu trả lời đúng là không: mọi case đã lên kế hoạch đã chạy; chúng chạm tới bao nhiêu code hay yêu cầu là một phép đo khác.</p></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Vì sao nhiều vòng thay vì một kết quả?</strong>
<p>Đặt Round 1/2/3 cạnh nhau biến sheet thành một <em>lịch sử thực thi test</em> nhỏ. Bạn có thể:</p>
<ul>
<li>tính mỗi vòng tìm được bao nhiêu lỗi;</li>
<li>xem bản sửa có giữ được không — một case fail, rồi pass, rồi fail lại là dấu hiệu regression;</li>
<li>vẽ "đường cong chữ S" số case đã chạy và đã pass theo thời gian trong báo cáo tiến độ (Bảng 5.1 và Hình 5.2 của van Veenendaal).</li>
</ul>
<p>Công cụ quản lý test (TestRail, Xray, Zephyr) lưu đúng thứ này dưới tên "test run". <em>Ngoài giáo trình vì CTFL nêu số đo nhưng không nêu định dạng.</em></p></div>`),
    books([
      ['fst4', 'Ch.2 §2 "Test levels" pp.47–61 (PDF 61–75); Ch.5 §3 "Test monitoring and control" pp.175–180 (PDF 189–194) — Table 5.1 test case summary worksheet p.177, Figure 5.2 defects chart p.178', 'Chương 2 §2 "Test levels" trang 47–61 (PDF 61–75); Chương 5 §3 "Test monitoring and control" trang 175–180 (PDF 189–194) — Bảng 5.1 test case summary worksheet trang 177, Hình 5.2 biểu đồ defect trang 178'],
      ['sp5', '§3.4.1 Component testing (PDF 87), §3.4.2 Integration testing (PDF 96), §3.4.3 System testing (PDF 105); §6.3.3 Test cycle monitoring (PDF 280), §6.3.4 Test reports (PDF 281)', '§3.4.1 Component testing (PDF 87), §3.4.2 Integration testing (PDF 96), §3.4.3 System testing (PDF 105); §6.3.3 Test cycle monitoring (PDF 280), §6.3.4 Test reports (PDF 281)'],
      ['fst', '§5.3 "Test progress monitoring and control" — pp.140–144 (PDF 143–147)', '§5.3 "Test progress monitoring and control" — trang 140–144 (PDF 143–147)'],
      ['sp4', '§3.2–3.4 component, integration and system test pp.42–60 (PDF 57–75); §6.5 test progress p.189 (PDF 204)', '§3.2–3.4 component, integration, system test trang 42–60 (PDF 57–75); §6.5 tiến độ test trang 189 (PDF 204)'],
    ]),
  ].join('\n'),
};

/* ═══════════════════════ Lesson 2 — worked example ═══════════════════════ */
const L2 = {
  title: 'Lab 3.2 — Worked example: an integration test sheet for Login + Change password|||Lab 3.2 — Ví dụ có lời giải: sheet integration test cho Đăng nhập + Đổi mật khẩu',
  slug: 'swt301-lab3-worked-example',
  type: 'DOCUMENT',
  description: 'Điền trọn một sheet Report5.2: 12 test case tích hợp cho Login + Change password (điều kiện, các bước có dữ liệu, kết quả mong đợi kiểm cả DB), kết quả 3 vòng, bảng đếm và Test Statistics tính bằng đúng công thức template (có so sánh bản lỗi), kèm phần unit và system test tương ứng.',
  content: [
    bi(`<span class="eyebrow">Lab 3 · Lesson 3.2 · worked example on Report5.2</span>
<h2>Filling one Feature sheet from scratch</h2>
<p class="lead">Feature: <strong>Account — Login and Change password</strong> of a web shop ("Online Bookstore", code OBS). Architecture: React form → REST API <code>/api/auth/login</code>, <code>/api/users/me/password</code> → AuthService/UserService → PostgreSQL table <code>users</code> + <code>sessions</code>.</p>
<h4>Rules from the SRS</h4>
<ol>
<li><strong>Password</strong> — ≥ 8 characters, with a letter and a digit.</li>
<li><strong>Lockout</strong> — 5 wrong passwords lock the account for 15 minutes.</li>
<li><strong>No e-mail leak</strong> — login errors must not reveal whether an e-mail exists.</li>
<li><strong>Revocation</strong> — changing the password revokes other sessions.</li>
<li><strong>Timeout</strong> — a session expires after 30 minutes.</li>
</ol>
<div class="callout"><strong>Learning objectives.</strong>
<ul>
<li><strong>LO-4.2.1/4.2.2</strong> — apply EP and BVA (K3): the 7/8-character pair.</li>
<li><strong>LO-4.2.5</strong> — use-case/flow thinking for procedures (K2).</li>
<li><strong>LO-5.3.2</strong> — produce the figures of a test report (K2).</li>
<li><strong>LO-5.6.1</strong> — link failures to defect reports (K3).</li>
</ul></div>
<h3>Step 1 — the header</h3>
<p>B2 Feature = <em>Account</em>; B3 Test requirement = <em>SRS UC-01 Login (§3.2), UC-02 Change password (§3.4); interfaces UI ↔ AuthController ↔ AuthService ↔ users/sessions tables</em>. Group rows "Login" (A11) and "Change password".</p>
<h3>Step 2 — the test cases (what makes them <em>integration</em> tests)</h3>
<p>Every expected result checks something that crosses a boundary: the message on the screen <strong>and</strong> the database state (<code>failed_attempts</code>, <code>status</code>, <code>password_hash</code>, <code>sessions</code>) or the network call (TC06, TC11: validation must happen before the API is called). The sheet is written in English, as the real submission is.</p>
${tcTable()}
<h3>Step 3 — the round table (B5:E8), computed with the fixed formulas</h3>
${ROUNDS}
<h4>How to read it</h4>
<ul>
<li><strong>Round 1</strong> — found 4 failures (DF-L01…L04) and could not run TC05 because its precondition TC04 failed: that is <strong>Pending</strong>, not Failed.</li>
<li><strong>TC12</strong> — <strong>N/A</strong> in Rounds 1–2 because session timeout was not in those builds, so it leaves the denominator (12 − 1 = 11).</li>
<li><strong>TC04</strong> — failed twice: the first fix did not work. The Note records it, and the defect was reopened.</li>
<li><strong>Round 3</strong> — clean.</li>
</ul>
<h3>Step 4 — Test Statistics, and what the unfixed template would have shown</h3>
<table>
<thead><tr><th>Figure</th><th>Correct (IDs counted = 12)</th><th>Template as shipped (COUNTA = 13: 12 IDs + the "Change password" header row)</th></tr></thead>
<tbody>
<tr><td>Round 1 test coverage</td><td>90.91 %</td><td>(6+4)×100/(13−1) = 83.33 %</td></tr>
<tr><td>Round 1 successful coverage</td><td>54.55 %</td><td>6×100/12 = 50.00 %</td></tr>
<tr><td>Round 3 test coverage / successful</td><td>100 % / 100 %</td><td>12×100/13 = 92.31 % / 92.31 %</td></tr>
<tr><td>Round 2 and 3 counters</td><td>10/1/0/1 and 12/0/0/0</td><td>6/4/1/1 twice — the Round 1 column counted again</td></tr>
</tbody>
</table>
<p>(The first group row A11 sits above the counted range A12:A1000, so only the second header is counted.) All figures were produced by a script that applies the templates' formulas to this sheet. A final report on this feature therefore reads: <em>"Account: 12 test cases, 3 rounds; Round 1 54.55 % passed, 4 defects (DF-L01…L04) found, all closed; Round 3: 12/12 passed (100 %)."</em></p>`,
    `<span class="eyebrow">Lab 3 · Bài 3.2 · ví dụ có lời giải trên Report5.2</span>
<h2>Điền một sheet Feature từ đầu</h2>
<p class="lead">Chức năng: <strong>Account — Đăng nhập và Đổi mật khẩu</strong> của một web bán sách ("Online Bookstore", mã OBS). Kiến trúc: form React → REST API <code>/api/auth/login</code>, <code>/api/users/me/password</code> → AuthService/UserService → bảng PostgreSQL <code>users</code> + <code>sessions</code>.</p>
<h4>Quy tắc trong SRS</h4>
<ol>
<li><strong>Mật khẩu</strong> — ≥ 8 ký tự, có chữ và số.</li>
<li><strong>Khoá tài khoản</strong> — sai 5 lần thì khoá 15 phút.</li>
<li><strong>Không lộ e-mail</strong> — thông báo lỗi đăng nhập không được lộ e-mail có tồn tại hay không.</li>
<li><strong>Thu hồi phiên</strong> — đổi mật khẩu thì thu hồi các phiên khác.</li>
<li><strong>Hết hạn</strong> — phiên hết hạn sau 30 phút.</li>
</ol>
<div class="callout"><strong>Chuẩn đầu ra.</strong>
<ul>
<li><strong>LO-4.2.1/4.2.2</strong> — áp dụng EP và BVA (K3): cặp 7/8 ký tự.</li>
<li><strong>LO-4.2.5</strong> — tư duy use case/luồng khi viết các bước (K2).</li>
<li><strong>LO-5.3.2</strong> — lập số liệu cho báo cáo test (K2).</li>
<li><strong>LO-5.6.1</strong> — liên kết failure với defect report (K3).</li>
</ul></div>
<h3>Bước 1 — phần đầu sheet</h3>
<p>B2 Feature = <em>Account</em>; B3 Test requirement = <em>SRS UC-01 Login (§3.2), UC-02 Change password (§3.4); giao diện UI ↔ AuthController ↔ AuthService ↔ bảng users/sessions</em>. Hai dòng nhóm "Login" (A11) và "Change password".</p>
<h3>Bước 2 — các test case (điều gì làm chúng thành test <em>tích hợp</em>)</h3>
<p>Mọi kết quả mong đợi đều kiểm một thứ đi qua ranh giới giữa các thành phần: thông báo trên màn hình <strong>và</strong> trạng thái database (<code>failed_attempts</code>, <code>status</code>, <code>password_hash</code>, <code>sessions</code>) hoặc lời gọi mạng (TC06, TC11: phải kiểm hợp lệ trước khi gọi API). Sheet viết bằng tiếng Anh, đúng như bài nộp thật.</p>
${tcTable()}
<h3>Bước 3 — bảng vòng test (B5:E8), tính bằng công thức đã sửa</h3>
${ROUNDS}
<h4>Cách đọc</h4>
<ul>
<li><strong>Round 1</strong> — phát hiện 4 failure (DF-L01…L04) và không chạy được TC05 vì điều kiện tiên quyết TC04 bị fail: đó là <strong>Pending</strong>, không phải Failed.</li>
<li><strong>TC12</strong> — <strong>N/A</strong> ở Round 1–2 vì bản build chưa có session timeout, nên nó ra khỏi mẫu số (12 − 1 = 11).</li>
<li><strong>TC04</strong> — fail hai lần: bản sửa đầu không ăn. Cột Note ghi lại, và defect được mở lại (reopen).</li>
<li><strong>Round 3</strong> — sạch.</li>
</ul>
<h3>Bước 4 — Test Statistics, và template chưa sửa sẽ hiện gì</h3>
<table>
<thead><tr><th>Số liệu</th><th>Đúng (đếm ID = 12)</th><th>Template nguyên bản (COUNTA = 13: 12 ID + dòng tiêu đề "Change password")</th></tr></thead>
<tbody>
<tr><td>Test coverage Round 1</td><td>90,91 %</td><td>(6+4)×100/(13−1) = 83,33 %</td></tr>
<tr><td>Successful coverage Round 1</td><td>54,55 %</td><td>6×100/12 = 50,00 %</td></tr>
<tr><td>Coverage / successful Round 3</td><td>100 % / 100 %</td><td>12×100/13 = 92,31 % / 92,31 %</td></tr>
<tr><td>Bộ đếm Round 2 và 3</td><td>10/1/0/1 và 12/0/0/0</td><td>6/4/1/1 hai lần — đếm lại cột Round 1</td></tr>
</tbody>
</table>
<p>(Dòng nhóm đầu tiên A11 nằm trên vùng đếm A12:A1000, nên chỉ dòng tiêu đề thứ hai bị đếm.) Mọi con số được sinh bởi một script áp đúng công thức của template lên sheet này. Báo cáo cuối cho chức năng này vì vậy ghi: <em>"Account: 12 test case, 3 vòng; Round 1 pass 54,55 %, phát hiện 4 defect (DF-L01…L04), đã đóng hết; Round 3: 12/12 pass (100 %)."</em></p>`),
    bi(`<h3>Step 5 — the same feature at the other two levels</h3>
<h4>Unit — Report5.1, sheet <em>validateNewPassword</em></h4>
<ul>
<li><strong>Inputs</strong> — <code>newPw</code>, <code>confirmPw</code>.</li>
<li><strong>Condition rows</strong> — newPw = "Pass123a" (8, valid), "Pass12a" (7), "Password" (no digit), "12345678" (no letter), "", null; confirmPw = same as newPw / different / null.</li>
<li><strong>Confirm rows</strong> — Return true/false; Exception <code>IllegalArgumentException</code> for null; Log "Password must be at least 8 characters" …</li>
<li><strong>Columns</strong> — UTCID01–UTCID08.</li>
</ul>
<p>Types of the cases:</p>
<ul>
<li>"Pass123a" = <strong>B</strong> — lower boundary of the valid length;</li>
<li>"Pass12a" = <strong>B</strong> — upper boundary of the invalid partition;</li>
<li>"Password" / "12345678" = <strong>A</strong>;</li>
<li>a 12-character valid password = <strong>N</strong>;</li>
<li>null = <strong>A</strong>.</li>
</ul>
<p>The counters then give e.g. N = 1, A = 5, B = 2 — a healthy mix, unlike a sheet that is 70 % "B".</p>
<h4>System — Report5.3, workflow <em>Account security</em>, scenario "Password change on two devices"</h4>
<ol>
<li>ST-01: log in on browser A and B.</li>
<li>Change password on A.</li>
<li>B's next action redirects to Login.</li>
<li>Log in on B with the new password — succeeds.</li>
<li>An e-mail "Your password was changed" arrives.</li>
</ol>
<p>This is a user journey across the whole system and an external mail service — the kind of case that belongs in the System Test report, not in Integration.</p>
<div class="pitfall co-tieu-de"><strong>Marks lost in this lab — the usual list.</strong>
<ol>
<li>Expected result copied from the description ("Verify login works") instead of an observable result.</li>
<li>Test data missing from the procedure ("enter a valid email").</li>
<li>One case testing three things at once — when it fails you cannot tell which.</li>
<li>Pending and Failed confused; N/A used for "I had no time".</li>
<li>Statistics not linked to the sheets, or linked to Round 1 while you report Round 3.</li>
<li>Template placeholders left: "XXX_vx.x", "&lt;Brief description…&gt;", #REF!.</li>
<li>Failed rows without a defect ID in Note.</li>
<li>Real personal data or secrets in the test data.</li>
</ol></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Automating such a sheet.</strong>
<p>The 12 cases above are ideal candidates for API-level automation:</p>
<ul>
<li><strong>Postman/Newman collections or REST Assured tests</strong> — call <code>/api/auth/login</code> and check the JSON and the database.</li>
<li><strong>Playwright or Selenium</strong> — cover TC06/TC11 in the browser.</li>
</ul>
<p>Each run then produces a JUnit-XML report that CI can turn into exactly the Round columns — without hand-typed "Passed". <em>Outside the syllabus because CTFL Chapter 6 treats tools generically.</em></p></div>`,
    `<h3>Bước 5 — cùng chức năng ở hai cấp còn lại</h3>
<h4>Unit — Report5.1, sheet <em>validateNewPassword</em></h4>
<ul>
<li><strong>Input</strong> — <code>newPw</code>, <code>confirmPw</code>.</li>
<li><strong>Các dòng điều kiện</strong> — newPw = "Pass123a" (8, hợp lệ), "Pass12a" (7), "Password" (không có số), "12345678" (không có chữ), "", null; confirmPw = giống newPw / khác / null.</li>
<li><strong>Các dòng xác nhận</strong> — Return true/false; Exception <code>IllegalArgumentException</code> khi null; Log "Password must be at least 8 characters" …</li>
<li><strong>Các cột</strong> — UTCID01–UTCID08.</li>
</ul>
<p>Loại của từng case:</p>
<ul>
<li>"Pass123a" = <strong>B</strong> — biên dưới của độ dài hợp lệ;</li>
<li>"Pass12a" = <strong>B</strong> — biên trên của phân vùng không hợp lệ;</li>
<li>"Password" / "12345678" = <strong>A</strong>;</li>
<li>một mật khẩu hợp lệ 12 ký tự = <strong>N</strong>;</li>
<li>null = <strong>A</strong>.</li>
</ul>
<p>Bộ đếm cho ra chẳng hạn N = 1, A = 5, B = 2 — cơ cấu lành mạnh, khác hẳn một sheet 70 % là "B".</p>
<h4>System — Report5.3, workflow <em>Account security</em>, scenario "Đổi mật khẩu trên hai thiết bị"</h4>
<ol>
<li>ST-01: đăng nhập trên trình duyệt A và B.</li>
<li>Đổi mật khẩu trên A.</li>
<li>Thao tác tiếp theo trên B bị chuyển về Login.</li>
<li>Đăng nhập trên B bằng mật khẩu mới — thành công.</li>
<li>Nhận e-mail "Your password was changed".</li>
</ol>
<p>Đây là hành trình người dùng xuyên cả hệ thống và một dịch vụ mail bên ngoài — loại case thuộc báo cáo System Test, không thuộc Integration.</p>
<div class="pitfall co-tieu-de"><strong>Những lỗi mất điểm ở lab này — danh sách quen thuộc.</strong>
<ol>
<li>Kết quả mong đợi chép lại mô tả ("Verify login works") thay vì một kết quả quan sát được.</li>
<li>Thiếu dữ liệu test trong các bước ("nhập email hợp lệ").</li>
<li>Một case kiểm ba thứ cùng lúc — fail thì không biết cái nào hỏng.</li>
<li>Nhầm Pending với Failed; dùng N/A cho "em không kịp làm".</li>
<li>Statistics không liên kết với các sheet, hoặc liên kết Round 1 trong khi báo cáo Round 3.</li>
<li>Còn placeholder của template: "XXX_vx.x", "&lt;Brief description…&gt;", #REF!.</li>
<li>Dòng Failed không có mã defect ở cột Note.</li>
<li>Dữ liệu cá nhân thật hoặc bí mật trong dữ liệu test.</li>
</ol></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Tự động hoá một sheet như thế.</strong>
<p>12 case trên rất hợp để tự động ở mức API:</p>
<ul>
<li><strong>Collection Postman/Newman hoặc test REST Assured</strong> — gọi <code>/api/auth/login</code> và kiểm JSON lẫn database.</li>
<li><strong>Playwright hoặc Selenium</strong> — phủ TC06/TC11 trên trình duyệt.</li>
</ul>
<p>Mỗi lần chạy sinh báo cáo JUnit-XML mà CI có thể biến thành đúng các cột Round — không cần gõ tay "Passed". <em>Ngoài giáo trình vì Chương 6 của CTFL chỉ bàn công cụ ở mức tổng quát.</em></p></div>`),
    books([
      ['fst4', 'Ch.4 §2 black-box techniques pp.112–131 (PDF 126–145): EP/BVA Table 4.1 p.116, use-case testing p.131; Ch.5 §6 defect management pp.190–195 (PDF 204–209)', 'Chương 4 §2 kỹ thuật black-box trang 112–131 (PDF 126–145): EP/BVA Bảng 4.1 trang 116, use case trang 131; Chương 5 §6 quản lý defect trang 190–195 (PDF 204–209)'],
      ['sp5', '§3.4.2 Integration testing (PDF 96–104); §5.1.1 EP (PDF 165), §5.1.2 BVA (PDF 176); §6.3.4 Test reports (PDF 281)', '§3.4.2 Integration testing (PDF 96–104); §5.1.1 EP (PDF 165), §5.1.2 BVA (PDF 176); §6.3.4 Test reports (PDF 281)'],
      ['junit', 'Ch.18 "Testing a REST API" (PDF 363) and Ch.19 "Testing database applications" (PDF 386) — automating the integration cases', 'Chương 18 "Testing a REST API" (PDF 363) và Chương 19 "Testing database applications" (PDF 386) — tự động hoá các case tích hợp'],
    ]),
  ].join('\n'),
};

/* ═══════════════════════ Lesson 3 — the real SEP490 sample ═══════════════════════ */
const L3 = {
  title: 'Lab 3.3 — Reading a real capstone report (SEP490 sample): strengths, mistakes, submission checklist|||Lab 3.3 — Đọc báo cáo đồ án thật (mẫu SEP490): điểm mạnh, lỗi, checklist nộp bài',
  slug: 'swt301-lab3-sample-review',
  type: 'DOCUMENT',
  description: 'Phân tích file mẫu SEP490 (Integration Test 261 case/15 sheet, Unit Test 27 method): cách viết case đáng học, các lỗi chép-dán, dữ liệu thật và token lộ, lỗi Sub total khiến báo cáo unit test chỉ tính 55/262 case — và checklist trước khi nộp Lab 3.',
  content: [
    bi(`<span class="eyebrow">Lab 3 · Lesson 3.3 · 5341_SEP490_G47…Report5_Integration_Test.xlsx · …Report5_Unit_Test.xlsx</span>
<h2>A real report, read like a reviewer</h2>
<p class="lead">The Lab 3 guide folder contains one real deliverable of a SEP490 capstone team — here "the sample team" — for a project called <em>Chatbot AI Platform</em> (code CAIP): an integration-test report and a unit-test report built on the templates of Lesson 3.1.</p>
<p>It is a good report and a useful model, and it also contains most of the classic mistakes. Reviewing it is itself static testing (Chapter 3) applied to test documentation.</p>
<p class="ghi-chu">Names, e-mails, phone numbers and tokens found in the file are deliberately not reproduced.</p>
<div class="callout"><strong>Learning objectives.</strong>
<ul>
<li><strong>LO-3.1.1</strong> — test work products (test cases, reports) can be reviewed too (K1).</li>
<li><strong>LO-5.3.2</strong> — judge whether a test report is correct and complete (K2).</li>
<li><strong>LO-1.4.4</strong> — traceability between test basis, test cases, results and defects (K2).</li>
</ul></div>
<h2>1 · The integration-test report</h2>
<table>
<thead><tr><th>Sheet</th><th>What the sample team did</th></tr></thead>
<tbody>
<tr><td>Cover</td><td>Project, code, Document Code formula edited to <em>CAIP_Integration_v1.0</em>; Record of change with 17 dated rows (each sheet added, then "Create test report based on test result").</td></tr>
<tr><td>Test Cases</td><td>30 functions (Login, Register, Activate Account, Password Forgot/Reset, User Profile, Password Change, User List/Details/New, Chat, TestBot, Live Chat, Bot List/New/Details, Model, Organization…, Role…, Plan…, Invoice…) mapped to 15 sheets; D3/D4 re-linked to Cover (the #REF! fixed).</td></tr>
<tr><td>15 feature sheets</td><td><strong>261 test cases</strong> (Login 9, Register 17, Password Reset 11, Profile 10, User List 33, Chat 6, Live chat 4, Bot 16, Bot Details 40, Model 12, Organization 14, Organization Details 24, Role 18, Plan 24, Invoice 23), IDs <code>FTnn_TCmm</code> (feature nn, case mm), sub-functions as group rows, three rounds one week apart (March 2025).</td></tr>
<tr><td>Test Statistics</td><td>Links to <strong>Round 3</strong> of every sheet → 261 passed, 0 failed, coverage 100 %, successful 100 %. Round 1 across all sheets was 202 passed / 59 failed (77.4 %) — a figure the report never shows.</td></tr>
</tbody>
</table>
<h3>What is worth copying</h3>
<ul>
<li><strong>Concrete procedures with data in a fixed pattern</strong>: "1. Open Login Form 2. Enter following information: &lt;Email&gt;: "…" &lt;Password&gt;: "12345678" 3. Click &lt;Login&gt; Button" — anyone can re-run it.</li>
<li><strong>Exact expected messages</strong> ("Error message is displayed right under the &lt;Email&gt; field: 'Email is required'") and, for Register, the database effect ("user inserted with status = INACTIVE, a random 6-digit OTP sent, redirect to Verify OTP").</li>
<li><strong>Real integration concerns</strong>: OTP e-mail sending and the SMTP failure (FT02_TC11), OTP expiry after 2 minutes, "first OTP after resend must be rejected" (FT02_TC16), expired reset link, Google login, script injection in chat (FT06_TC04), QR-code generation failure for billing (FT12_TC24).</li>
<li><strong>Preconditions that chain cases</strong>: "Pass FT02_TC01", "Pass FT02_TC10" — explicit dependencies.</li>
<li><strong>Fixed formulas</strong>: Number of TCs <code>=COUNTIF($A12:$A1003,"*"&amp;"_"&amp;"*")</code> (only IDs are counted), Round 2 and 3 counters on columns I and L — both template bugs of Lesson 3.1 corrected.</li>
<li><strong>A visible retest history</strong>: Failed → Failed → Passed rows show defects that needed two fixes.</li>
</ul>`,
    `<span class="eyebrow">Lab 3 · Bài 3.3 · 5341_SEP490_G47…Report5_Integration_Test.xlsx · …Report5_Unit_Test.xlsx</span>
<h2>Một báo cáo thật, đọc bằng mắt người review</h2>
<p class="lead">Thư mục hướng dẫn Lab 3 có một sản phẩm thật của một nhóm đồ án SEP490 — ở đây gọi là "nhóm mẫu" — cho dự án <em>Chatbot AI Platform</em> (mã CAIP): một báo cáo integration test và một báo cáo unit test dựng trên các template của Bài 3.1.</p>
<p>Đây là báo cáo tốt, đáng làm mẫu, và cũng chứa gần đủ các lỗi kinh điển. Review nó chính là kiểm thử tĩnh (Chương 3) áp cho tài liệu test.</p>
<p class="ghi-chu">Tên, e-mail, số điện thoại và token trong file cố ý không được chép lại.</p>
<div class="callout"><strong>Chuẩn đầu ra.</strong>
<ul>
<li><strong>LO-3.1.1</strong> — sản phẩm test (test case, báo cáo) cũng review được (K1).</li>
<li><strong>LO-5.3.2</strong> — đánh giá một báo cáo test đúng và đủ chưa (K2).</li>
<li><strong>LO-1.4.4</strong> — truy vết giữa cơ sở test, test case, kết quả và defect (K2).</li>
</ul></div>
<h2>1 · Báo cáo integration test</h2>
<table>
<thead><tr><th>Sheet</th><th>Nhóm mẫu đã làm gì</th></tr></thead>
<tbody>
<tr><td>Cover</td><td>Tên dự án, mã, công thức Document Code đã sửa thành <em>CAIP_Integration_v1.0</em>; Record of change 17 dòng có ngày (thêm từng sheet, rồi "Create test report based on test result").</td></tr>
<tr><td>Test Cases</td><td>30 chức năng (Login, Register, Activate Account, Password Forgot/Reset, User Profile, Password Change, User List/Details/New, Chat, TestBot, Live Chat, Bot List/New/Details, Model, Organization…, Role…, Plan…, Invoice…) ánh xạ vào 15 sheet; D3/D4 đã nối lại với Cover (sửa #REF!).</td></tr>
<tr><td>15 sheet chức năng</td><td><strong>261 test case</strong> (Login 9, Register 17, Password Reset 11, Profile 10, User List 33, Chat 6, Live chat 4, Bot 16, Bot Details 40, Model 12, Organization 14, Organization Details 24, Role 18, Plan 24, Invoice 23), mã <code>FTnn_TCmm</code> (feature nn, case mm), chức năng con làm dòng nhóm, ba vòng cách nhau một tuần (tháng 3/2025).</td></tr>
<tr><td>Test Statistics</td><td>Liên kết <strong>Round 3</strong> của mọi sheet → 261 passed, 0 failed, coverage 100 %, thành công 100 %. Round 1 trên toàn bộ là 202 passed / 59 failed (77,4 %) — con số báo cáo không hề hiện ra.</td></tr>
</tbody>
</table>
<h3>Điều đáng học</h3>
<ul>
<li><strong>Các bước cụ thể, dữ liệu theo một khuôn cố định</strong>: "1. Open Login Form 2. Enter following information: &lt;Email&gt;: "…" &lt;Password&gt;: "12345678" 3. Click &lt;Login&gt; Button" — ai cũng chạy lại được.</li>
<li><strong>Thông báo mong đợi chính xác</strong> ("Error message is displayed right under the &lt;Email&gt; field: 'Email is required'") và, với Register, cả tác động lên database ("user được thêm với status = INACTIVE, gửi OTP 6 số ngẫu nhiên, chuyển sang màn Verify OTP").</li>
<li><strong>Mối lo tích hợp thật</strong>: gửi OTP qua e-mail và lỗi SMTP (FT02_TC11), OTP hết hạn sau 2 phút, "OTP đầu tiên sau khi gửi lại phải bị từ chối" (FT02_TC16), link reset hết hạn, đăng nhập Google, chèn script vào chat (FT06_TC04), lỗi sinh QR thanh toán (FT12_TC24).</li>
<li><strong>Precondition nối các case</strong>: "Pass FT02_TC01", "Pass FT02_TC10" — phụ thuộc được ghi rõ.</li>
<li><strong>Công thức đã sửa</strong>: Number of TCs <code>=COUNTIF($A12:$A1003,"*"&amp;"_"&amp;"*")</code> (chỉ đếm ID), bộ đếm Round 2 và 3 trên cột I và L — cả hai lỗi template của Bài 3.1 đã được sửa.</li>
<li><strong>Lịch sử test lại nhìn thấy được</strong>: các dòng Failed → Failed → Passed cho thấy defect cần sửa hai lần.</li>
</ul>`),
    bi(`<h3>What a reviewer would send back</h3>
<table>
<thead><tr><th>Where</th><th>Finding</th><th>Better</th></tr></thead>
<tbody>
<tr><td>every sheet, B3</td><td>"Test requirement" left empty in all 15 sheets — no traceability to the SRS/use cases.</td><td>"UC-03 Register & activate, SRS §3.3".</td></tr>
<tr><td>FT04_TC01</td><td>"Verify detail view shows correct user info" expects "System sends reset link to email." — pasted from the password-reset sheet.</td><td>"Profile shows full name, e-mail, phone of the logged-in user".</td></tr>
<tr><td>FT09_TC01 / TC02</td><td>Expected results swapped (the view case expects "details are updated…", the update case expects "detail matches…").</td><td>Swap them back.</td></tr>
<tr><td>FT04_TC07</td><td>"min length" case enters a new password "12345678" (8 characters, valid) but expects "must be at least 8 chars".</td><td>Use 7 characters — and add the 8-character valid boundary as its own case.</td></tr>
<tr><td>FT03_TC05</td><td>"Send failed — no connection to SMTP" is executed with an <em>empty</em> e-mail and the precondition "e-mail not registered": the data tests validation, not the SMTP failure.</td><td>Registered e-mail + SMTP server stopped (or a mock returning an error).</td></tr>
<tr><td>FT09_TC19</td><td>"URL is empty" case clicks the File tab and leaves &lt;File&gt; empty.</td><td>URL tab, &lt;Url&gt;: "".</td></tr>
<tr><td>FT05_TC02, FT12_TC22</td><td>Procedure = the description, or empty.</td><td>Real steps with data.</td></tr>
<tr><td>FT05_TC11</td><td>Selects role Admin, expects "Active and User role".</td><td>Make data and expectation agree.</td></tr>
<tr><td>FT06_TC04</td><td>Expected result = "Verify system prevents script injection" (a goal, not an observation).</td><td>"The text is shown literally; no alert pops up; the stored message is HTML-escaped".</td></tr>
<tr><td>test data</td><td>Real student e-mail addresses and phone numbers, and — in Bot Details — what look like live Telegram and Slack bot tokens and a signing secret pasted in plain text.</td><td>Fake data (user01@example.com); secrets as placeholders; anything already published must be revoked.</td></tr>
<tr><td>Failed rows</td><td>No defect ID anywhere (Note column empty) — 59 Round-1 failures cannot be traced to bug reports.</td><td>"DF-023" in Note; the defect list or Jira keys in an extra sheet.</td></tr>
<tr><td>Test Statistics</td><td>Passed and Number-of-test-cases columns typed by hand (only some cells are links); only Round 3 shown; issue date on the Statistics sheet (October 2025) disagrees with the Cover (March 2025).</td><td>Link every cell; show Round 1 and Round 3; one issue date.</td></tr>
<tr><td>scope</td><td>Many cases (pagination, page size, form reset, cancel) are UI/system checks with no component interface involved.</td><td>Keep them in the System Test report; keep Integration for UI↔API↔DB↔external-service paths.</td></tr>
</tbody>
</table>
<h2>2 · The unit-test report — one formula decides everything</h2>
<p><strong>27 method sheets</strong> — controllers <code>ChatController</code>, <code>LiveChatController</code>, <code>BotController</code>, <code>DataContentController</code>, <code>PaymentController</code>…, a Python-style <code>DataRoutes</code> service, <code>MessageService</code>. Each is a clean condition matrix:</p>
<ul>
<li><strong>Partitions</strong> — every input gets <strong>valid value / invalid value / "" / null</strong>.</li>
<li><strong>BVA values</strong> — for paging inputs: page 1, 2, 0, −1, null; limit 10, 5, 0, −1, null.</li>
<li><strong>Exact log messages</strong> — for each abnormal case ("BotId cannot be empty", "BotId is required").</li>
</ul>
<p>As a method of designing unit tests, this is exemplary.</p>
<h4>But the Statistics sheet is wrong</h4>
<ul>
<li><strong>What it says</strong> — Sub total <strong>55</strong> test cases, 55 passed, test coverage 100 %, normal 14.5 % / abnormal 10.9 % / boundary 74.5 %.</li>
<li><strong>Why</strong> — the formula is the template's <code>=SUM(C10:C15)</code>: it adds only the first four methods (11 + 20 + 12 + 12 = 55) while the sheet lists 27.</li>
<li><strong>Summed correctly</strong> — the report contains <strong>262</strong> unit test cases (N 38, A 38, B 186 → 14.5 / 14.5 / 71.0 %).</li>
<li><strong>Also</strong> — the <em>Chat2</em> row is typed by hand as 9 passed of 11 cases while its sheet has 9 cases.</li>
</ul>
<h4>Smaller findings</h4>
<ul>
<li><strong>Every case P, no Defect ID</strong> — plausible for a final run, but then state that it is the final run.</li>
<li><strong>"Test requirement" placeholder</strong> — left in all sheets.</li>
<li><strong>"" and null labelled B (boundary)</strong> almost everywhere — they are really abnormal/invalid partitions, which is why B is 71 %.</li>
<li><strong>Copy-paste in <em>updateBot</em></strong> — expects "bot created" / "Bot created successfully".</li>
<li><strong><em>HandleUserMessage</em></strong> — headed with Code Module "DataRoutes" while the MethodList says MessageService.</li>
<li><strong>MethodList</strong> — numbers 5 and 4 swapped.</li>
<li><strong>Executed dates</strong> — filled in for columns that have no test case.</li>
</ul>`,
    `<h3>Người review sẽ gửi lại những gì</h3>
<table>
<thead><tr><th>Ở đâu</th><th>Phát hiện</th><th>Nên làm</th></tr></thead>
<tbody>
<tr><td>mọi sheet, B3</td><td>"Test requirement" để trống ở cả 15 sheet — không truy vết được về SRS/use case.</td><td>"UC-03 Register & activate, SRS §3.3".</td></tr>
<tr><td>FT04_TC01</td><td>"Verify detail view shows correct user info" lại mong đợi "System sends reset link to email." — chép từ sheet reset mật khẩu.</td><td>"Profile hiện họ tên, e-mail, điện thoại của người đang đăng nhập".</td></tr>
<tr><td>FT09_TC01 / TC02</td><td>Kết quả mong đợi bị tráo (case xem chi tiết mong đợi "details are updated…", case cập nhật mong đợi "detail matches…").</td><td>Tráo lại.</td></tr>
<tr><td>FT04_TC07</td><td>Case "độ dài tối thiểu" nhập mật khẩu mới "12345678" (8 ký tự, hợp lệ) nhưng mong đợi lỗi "must be at least 8 chars".</td><td>Dùng 7 ký tự — và thêm biên hợp lệ 8 ký tự thành một case riêng.</td></tr>
<tr><td>FT03_TC05</td><td>"Gửi thất bại — không kết nối được SMTP" lại chạy với e-mail <em>rỗng</em> và precondition "e-mail chưa đăng ký": dữ liệu đó test phần kiểm hợp lệ, không test lỗi SMTP.</td><td>E-mail đã đăng ký + tắt SMTP server (hoặc mock trả lỗi).</td></tr>
<tr><td>FT09_TC19</td><td>Case "URL rỗng" lại bấm tab File và để trống &lt;File&gt;.</td><td>Tab URL, &lt;Url&gt;: "".</td></tr>
<tr><td>FT05_TC02, FT12_TC22</td><td>Các bước = chép lại mô tả, hoặc để trống.</td><td>Các bước thật có dữ liệu.</td></tr>
<tr><td>FT05_TC11</td><td>Chọn role Admin, lại mong đợi "Active and User role".</td><td>Cho dữ liệu và mong đợi khớp nhau.</td></tr>
<tr><td>FT06_TC04</td><td>Kết quả mong đợi = "Verify system prevents script injection" (một mục tiêu, không phải quan sát).</td><td>"Văn bản hiện nguyên dạng; không có hộp alert; tin nhắn lưu đã được escape HTML".</td></tr>
<tr><td>dữ liệu test</td><td>E-mail và số điện thoại thật của sinh viên, và — ở Bot Details — thứ trông như token bot Telegram, Slack thật và một signing secret dán nguyên văn.</td><td>Dữ liệu giả (user01@example.com); bí mật để dạng placeholder; cái gì đã lỡ công khai phải thu hồi.</td></tr>
<tr><td>dòng Failed</td><td>Không có mã defect nào (cột Note trống) — 59 failure của Round 1 không truy được về bug report.</td><td>"DF-023" ở cột Note; danh sách defect hoặc mã Jira ở một sheet riêng.</td></tr>
<tr><td>Test Statistics</td><td>Cột Passed và Number of test cases gõ tay (chỉ một số ô là liên kết); chỉ hiện Round 3; ngày phát hành ở sheet Statistics (tháng 10/2025) lệch với Cover (tháng 3/2025).</td><td>Liên kết mọi ô; hiện cả Round 1 và Round 3; một ngày phát hành.</td></tr>
<tr><td>phạm vi</td><td>Nhiều case (phân trang, cỡ trang, reset form, nút cancel) là kiểm tra UI/hệ thống, không liên quan giao diện giữa các thành phần.</td><td>Đưa vào báo cáo System Test; giữ Integration cho các đường UI↔API↔DB↔dịch vụ ngoài.</td></tr>
</tbody>
</table>
<h2>2 · Báo cáo unit test — một công thức quyết định tất cả</h2>
<p><strong>27 sheet method</strong> — các controller <code>ChatController</code>, <code>LiveChatController</code>, <code>BotController</code>, <code>DataContentController</code>, <code>PaymentController</code>…, một service kiểu Python <code>DataRoutes</code>, <code>MessageService</code>. Mỗi sheet là một ma trận điều kiện gọn gàng:</p>
<ul>
<li><strong>Phân vùng</strong> — mọi input có <strong>giá trị hợp lệ / không hợp lệ / "" / null</strong>.</li>
<li><strong>Giá trị BVA</strong> — cho input phân trang: page 1, 2, 0, −1, null; limit 10, 5, 0, −1, null.</li>
<li><strong>Log message chính xác</strong> — cho mỗi case bất thường ("BotId cannot be empty", "BotId is required").</li>
</ul>
<p>Xét như cách thiết kế unit test, đây là mẫu mực.</p>
<h4>Nhưng sheet Statistics sai</h4>
<ul>
<li><strong>Nó ghi</strong> — Sub total <strong>55</strong> test case, 55 passed, test coverage 100 %, normal 14,5 % / abnormal 10,9 % / boundary 74,5 %.</li>
<li><strong>Vì sao</strong> — công thức là <code>=SUM(C10:C15)</code> của template: nó chỉ cộng bốn method đầu (11 + 20 + 12 + 12 = 55) trong khi sheet liệt kê 27.</li>
<li><strong>Cộng đúng</strong> — báo cáo có <strong>262</strong> unit test case (N 38, A 38, B 186 → 14,5 / 14,5 / 71,0 %).</li>
<li><strong>Thêm nữa</strong> — dòng <em>Chat2</em> gõ tay 9 passed trên 11 case trong khi sheet của nó có 9 case.</li>
</ul>
<h4>Phát hiện nhỏ hơn</h4>
<ul>
<li><strong>Mọi case đều P, không có Defect ID</strong> — hợp lý nếu là lần chạy cuối, nhưng khi đó phải ghi rõ.</li>
<li><strong>Placeholder "Test requirement"</strong> — để nguyên ở mọi sheet.</li>
<li><strong>"" và null gần như luôn đánh B (boundary)</strong> — thực chất là phân vùng bất thường/không hợp lệ, vì thế B chiếm 71 %.</li>
<li><strong>Chép-dán ở <em>updateBot</em></strong> — mong đợi "bot created" / "Bot created successfully".</li>
<li><strong><em>HandleUserMessage</em></strong> — ghi Code Module "DataRoutes" trong khi MethodList ghi MessageService.</li>
<li><strong>MethodList</strong> — đảo số thứ tự 5 và 4.</li>
<li><strong>Ngày thực thi</strong> — điền cả ở các cột không có test case.</li>
</ul>`),
    bi(`<h2>✅ Submission checklist for Lab 3</h2>
<ol>
<li>Cover: project name/code, Document Code without "XXX_vx.x", creator, issue date, version; Record of change up to date.</li>
<li>Test Cases / MethodList sheet lists every sheet; no #REF!.</li>
<li>Every feature/workflow/method sheet has a filled <strong>Test requirement</strong> pointing to the SRS / use case / design.</li>
<li>Right level in the right workbook: methods → 5.1, component/system interfaces → 5.2, end-to-end workflows → 5.3.</li>
<li>Each case tests one thing; procedure has numbered steps <strong>with test data</strong>; expected result is observable (screen message, DB value, API response); preconditions name the data state or prerequisite case.</li>
<li>EP/BVA visible: both sides of every boundary (7/8, 0/1, max/max+1), at least one abnormal case per input.</li>
<li>Results only from the dropdown (Passed/Failed/Pending/N/A or P/F); tester and date filled for every executed round; Failed rows carry a defect ID.</li>
<li>Counters fixed: Number of TCs counts IDs only; Round 2/3 formulas point to columns I and L; sub-total ranges include every row; Statistics linked (not typed) and states which round it reports.</li>
<li>Recalculate and <strong>check one figure by hand</strong> (e.g. passed of one sheet) before submitting.</li>
<li>No real personal data, passwords or tokens; file named as your lecturer asks.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>The 100 % trap.</strong> A report that shows "100 % coverage, 100 % successful" with zero failures in every round is the first thing a lecturer questions: either the tests are too weak (Chapter 1, lesson 1.5 — low-quality tests find nothing) or the statistics do not show the history. Show Round 1 honestly; the defects you found are the value you delivered.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Reviewing test cases with a checklist.</strong>
<p>Industry teams review test specifications exactly like code — with checklists such as:</p>
<ul>
<li>"is the expected result unambiguous and observable?"</li>
<li>"is the test independent of the order of execution?"</li>
<li>"does every requirement have at least one test and every test a requirement?"</li>
</ul>
<p>ISO/IEC/IEEE 29119-3 defines the documents (test case specification, test execution log, test completion report) that these Report5 sheets imitate. <em>Outside the syllabus because CTFL only states that test work products can be reviewed.</em></p></div>`,
    `<h2>✅ Checklist nộp bài Lab 3</h2>
<ol>
<li>Cover: tên/mã dự án, Document Code không còn "XXX_vx.x", người soạn, ngày phát hành, phiên bản; Record of change cập nhật.</li>
<li>Sheet Test Cases / MethodList liệt kê đủ mọi sheet; không còn #REF!.</li>
<li>Mọi sheet feature/workflow/method có <strong>Test requirement</strong> trỏ tới SRS / use case / thiết kế.</li>
<li>Đúng cấp ở đúng workbook: method → 5.1, giao diện thành phần/hệ thống → 5.2, workflow đầu-cuối → 5.3.</li>
<li>Mỗi case kiểm một điều; các bước đánh số <strong>có dữ liệu test</strong>; kết quả mong đợi quan sát được (thông báo màn hình, giá trị DB, response API); precondition nêu trạng thái dữ liệu hoặc case tiên quyết.</li>
<li>Thấy rõ EP/BVA: cả hai phía của mỗi biên (7/8, 0/1, max/max+1), ít nhất một case bất thường cho mỗi input.</li>
<li>Kết quả chỉ lấy từ danh sách chọn (Passed/Failed/Pending/N/A hoặc P/F); có tester và ngày cho mỗi vòng đã chạy; dòng Failed có mã defect.</li>
<li>Bộ đếm đã sửa: Number of TCs chỉ đếm ID; công thức Round 2/3 trỏ cột I và L; vùng sub total bao đủ mọi dòng; Statistics liên kết (không gõ tay) và ghi rõ báo cáo vòng nào.</li>
<li>Tính lại và <strong>kiểm tay một con số</strong> (vd số passed của một sheet) trước khi nộp.</li>
<li>Không có dữ liệu cá nhân thật, mật khẩu hay token; đặt tên file đúng yêu cầu của giảng viên.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Bẫy 100 %.</strong> Báo cáo ghi "coverage 100 %, thành công 100 %" và không vòng nào có lỗi là thứ đầu tiên giảng viên nghi ngờ: hoặc test quá yếu (Chương 1, bài 1.5 — test kém thì chẳng tìm ra gì), hoặc số liệu giấu mất lịch sử. Hãy trình bày Round 1 trung thực; các defect bạn tìm ra chính là giá trị bạn mang lại.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Review test case bằng checklist.</strong>
<p>Doanh nghiệp review đặc tả test y như review code — với checklist kiểu:</p>
<ul>
<li>"kết quả mong đợi có rõ ràng và quan sát được không?"</li>
<li>"test có độc lập với thứ tự chạy không?"</li>
<li>"yêu cầu nào cũng có ít nhất một test và test nào cũng có yêu cầu?"</li>
</ul>
<p>ISO/IEC/IEEE 29119-3 định nghĩa các tài liệu (test case specification, test execution log, test completion report) mà các sheet Report5 này mô phỏng. <em>Ngoài giáo trình vì CTFL chỉ nói sản phẩm test cũng review được.</em></p></div>`),
    books([
      ['fst4', 'Ch.1 §4 test work products and traceability pp.15–26 (PDF 29–40); Ch.3 §1 work products examinable by static testing p.75 (PDF 89); Ch.5 §3 test reports pp.175–180 (PDF 189–194)', 'Chương 1 §4 sản phẩm test và truy vết trang 15–26 (PDF 29–40); Chương 3 §1 sản phẩm xem xét được bằng kiểm thử tĩnh trang 75 (PDF 89); Chương 5 §3 báo cáo test trang 175–180 (PDF 189–194)'],
      ['sp5', '§2.3 test process — traceability (PDF 66); §6.3.4 Test reports (PDF 281); §6.4 Defect management (PDF 284–292)', '§2.3 quy trình test — truy vết (PDF 66); §6.3.4 Test reports (PDF 281); §6.4 Defect management (PDF 284–292)'],
      ['fst', '§5.3 "Test progress monitoring and control" pp.140–144 (PDF 143–147); §5.6 "Incident management" p.155 (PDF 158)', '§5.3 "Test progress monitoring and control" trang 140–144 (PDF 143–147); §5.6 "Incident management" trang 155 (PDF 158)'],
    ]),
  ].join('\n'),
};

/* ──────────────────────────────── Quiz ──────────────────────────────── */
const q = (question, options, correctIndex, explanation) => ({ question, options, correctIndex, points: 1, ...(explanation ? { explanation } : {}) });
const QUIZL3 = {
  title: 'Quiz Lab 3 — Test reports (unit, integration, system)|||Quiz Lab 3 — Báo cáo test (unit, integration, system)',
  slug: 'swt301-lab3-quiz',
  type: 'QUIZ',
  description: '10 câu về bộ template Report5: cấp test của từng file, công thức coverage, Pending vs N/A, các lỗi công thức và bài học từ file mẫu SEP490.',
  quiz: {
    timeLimitSeconds: 600,
    questions: [
      q('Which Report5 template belongs to the CT (component/unit test) level?|||Template Report5 nào thuộc cấp CT (component/unit test)?', ['Report5.1 Unit Test', 'Report5.2 Integration Test', 'Report5.3 System Test', 'None — CT is not documented|||Không file nào — CT không cần tài liệu'], 0, 'Report5.1 Unit Test is the CT (component/unit) level: one method per sheet, test cases as UTCID columns. Report5.2 is the IT (integration) level and Report5.3 the ST (system) level, both with one row per case.|||Report5.1 Unit Test là cấp CT (component/unit): mỗi sheet một method, test case là các cột UTCID. Report5.2 là cấp IT (integration) và Report5.3 là cấp ST (system), cả hai mỗi case một dòng.'),
      q('In Report5.1, one unit test case is…|||Trong Report5.1, một unit test case là…', ['a row with procedure and expected result|||một dòng có các bước và kết quả mong đợi', 'a UTCID column in the condition/confirmation matrix|||một cột UTCID trong ma trận condition/confirmation', 'a separate sheet|||một sheet riêng', 'a JUnit class|||một class JUnit'], 1, 'In Report5.1 each test case is a UTCIDnn column of the condition x confirmation matrix: an O in a column marks the preconditions, inputs and expected returns of that case. A row with procedure and expected result is how Report5.2 and 5.3 write a case.|||Trong Report5.1 mỗi test case là một cột UTCIDnn của ma trận condition x confirmation: dấu O trong cột đánh dấu tiền điều kiện, input và kết quả trả về mong đợi của case đó. Một dòng có các bước và kết quả mong đợi là cách Report5.2 và 5.3 viết case.'),
      q('Test coverage in Report5.2 Test Statistics is computed as…|||Test coverage trong Test Statistics của Report5.2 được tính là…', ['Passed × 100 / Total|||Passed × 100 / Tổng', '(Passed + Failed) × 100 / (Total − N/A)|||(Passed + Failed) × 100 / (Tổng − N/A)', 'Statements executed / total statements|||Số lệnh đã chạy / tổng số lệnh', 'Failed × 100 / Total|||Failed × 100 / Tổng'], 1, 'Test coverage = (Passed + Failed) x 100 / (Total - N/A), i.e. how much of the applicable cases were executed: Round 1 of the worked sheet gives (6 + 4) x 100 / (12 - 1) = 90.91%. Counting only Passed is the separate "test successful coverage"; statements executed is code coverage.|||Test coverage = (Passed + Failed) x 100 / (Tổng - N/A), tức phần case áp dụng được đã chạy: Round 1 của sheet mẫu cho (6 + 4) x 100 / (12 - 1) = 90,91%. Chỉ đếm Passed là cột riêng "test successful coverage"; số lệnh đã chạy là code coverage.'),
      q('A case could not run in Round 1 because its prerequisite case failed. Its Round 1 result is…|||Một case không chạy được ở Round 1 vì case tiên quyết bị fail. Kết quả Round 1 của nó là…', ['Failed', 'Pending', 'N/A', 'Passed'], 1, 'Pending means not executed yet in this round, including a case blocked by another failure; the worked Login sheet marks exactly this "R1: blocked - precondition IT01_TC04 failed". Failed would claim the case ran and gave a wrong result; N/A means the case does not apply at all.|||Pending nghĩa là chưa chạy ở vòng này, kể cả case bị chặn bởi lỗi khác; sheet Login mẫu ghi đúng trường hợp này "R1: blocked - precondition IT01_TC04 failed". Failed nghĩa là đã chạy và ra kết quả sai; N/A nghĩa là case không áp dụng.'),
      q('A feature sheet has 6 test cases and 2 group-header rows below row 11. What does the template\'s COUNTA(A12:A1000) show?|||Một sheet có 6 test case và 2 dòng tiêu đề nhóm dưới dòng 11. COUNTA(A12:A1000) của template hiện bao nhiêu?', ['6', '7', '8', '2'], 2, 'COUNTA counts every non-empty cell of column A below row 11, so the two group headers ("Function B", "Function C") are counted as test cases: 6 + 2 = 8. That is bug 1 of the template; Feature 1 of the shipped file shows 8 for 6 IDs.|||COUNTA đếm mọi ô không trống ở cột A dưới dòng 11, nên hai dòng tiêu đề nhóm ("Function B", "Function C") bị tính là test case: 6 + 2 = 8. Đó là lỗi 1 của template; Feature 1 trong file gốc hiện 8 cho 6 ID.'),
      q('In the shipped template, what is wrong with the Round 2 and Round 3 counters?|||Trong template gốc, bộ đếm Round 2 và Round 3 sai ở đâu?', ['They count the Round 1 column again|||Chúng đếm lại cột Round 1', 'They count only Passed|||Chúng chỉ đếm Passed', 'They are hard-coded numbers|||Chúng là số gõ cứng', 'Nothing is wrong|||Không có gì sai'], 0, 'The Round 2 and Round 3 rows still use COUNTIF($F10:$F998, ...), the Round 1 column, so Feature 1 shows "1 failed, 5 pending" for Round 2 although every Round 2 cell says Pending. Fix: Round 2 counts column I, Round 3 column L.|||Dòng Round 2 và Round 3 vẫn dùng COUNTIF($F10:$F998, ...), tức cột Round 1, nên Feature 1 hiện Round 2 = "1 failed, 5 pending" dù mọi ô Round 2 đều là Pending. Sửa: Round 2 đếm cột I, Round 3 đếm cột L.'),
      q('The sample unit-test report shows 55 test cases in total although it contains 262. Why?|||Báo cáo unit test mẫu hiện tổng 55 case dù có 262. Vì sao?', ['55 cases failed|||55 case bị fail', 'The Sub total formula SUM(C10:C15) only covers the first four methods|||Công thức Sub total SUM(C10:C15) chỉ phủ bốn method đầu', 'Only boundary cases are counted|||Chỉ đếm case boundary', 'Pending cases are excluded|||Case pending bị loại'], 1, 'The Sub total cell keeps the template\'s =SUM(C10:C15), which adds only the first four methods (11 + 20 + 12 + 12 = 55) while the SEP490 sheet lists 27 methods. Extend the range whenever you add functions, as the 5.1 Guideline itself warns.|||Ô Sub total giữ nguyên =SUM(C10:C15) của template, chỉ cộng bốn method đầu (11 + 20 + 12 + 12 = 55) trong khi sheet SEP490 liệt kê 27 method. Thêm function thì phải nới vùng cộng, như chính Guideline 5.1 đã cảnh báo.'),
      q('Which expected result is written well?|||Kết quả mong đợi nào được viết tốt?', ['Verify login works|||Kiểm tra đăng nhập chạy', 'System works correctly|||Hệ thống chạy đúng', 'Message "Invalid email or password" is shown and failed_attempts becomes 1|||Hiện thông báo "Invalid email or password" và failed_attempts thành 1', 'Test passes|||Test pass'], 2, 'A good expected result is concrete and observable: the exact message and the resulting state (failed_attempts becomes 1), so anyone can decide pass or fail. "Verify login works" is a test objective, and "system works correctly" cannot be checked against anything.|||Kết quả mong đợi tốt phải cụ thể và quan sát được: đúng câu thông báo và trạng thái sau đó (failed_attempts thành 1), để ai cũng kết luận được pass hay fail. "Kiểm tra đăng nhập chạy" là mục tiêu test, còn "hệ thống chạy đúng" thì không đối chiếu được với gì.'),
      q('"Password must be ≥ 8 characters." Which pair of new passwords applies BVA correctly?|||"Mật khẩu phải ≥ 8 ký tự." Cặp mật khẩu mới nào áp dụng BVA đúng?', ['6 and 10 characters|||6 và 10 ký tự', '7 and 8 characters|||7 và 8 ký tự', '8 and 9 characters|||8 và 9 ký tự', '0 and 100 characters|||0 và 100 ký tự'], 1, 'The boundary between invalid and valid lengths lies between 7 and 8, so two-value BVA tests 7 (largest invalid) and 8 (smallest valid). 6 and 10 are ordinary partition values that miss the edge, and 8 and 9 never test the invalid side.|||Ranh giới giữa độ dài không hợp lệ và hợp lệ nằm giữa 7 và 8, nên BVA hai giá trị test 7 (không hợp lệ lớn nhất) và 8 (hợp lệ nhỏ nhất). 6 và 10 chỉ là giá trị đại diện phân vùng, bỏ lỡ ranh giới; 8 và 9 không hề test phía không hợp lệ.'),
      q('Which case belongs in the System Test report rather than the Integration Test report?|||Case nào thuộc báo cáo System Test hơn là Integration Test?', ['The change-password API rejects a wrong old password and the DB hash is unchanged|||API đổi mật khẩu từ chối mật khẩu cũ sai và hash trong DB không đổi', 'A user changes the password on one device, is logged out on another, logs in again and receives a notification e-mail|||Người dùng đổi mật khẩu trên một thiết bị, bị đăng xuất ở thiết bị khác, đăng nhập lại và nhận e-mail thông báo', 'The login form sends no request when fields are empty|||Form đăng nhập không gửi request khi để trống', 'validateNewPassword("Pass12a") returns false|||validateNewPassword("Pass12a") trả về false'], 1, 'A system test case follows an end-to-end workflow of the whole system: two devices, sessions, logging in again and the notification e-mail. Checking that the API rejects a wrong old password and leaves the DB hash unchanged tests one interface (IT); validateNewPassword is a unit test.|||Case system test đi theo luồng đầu-cuối của cả hệ thống: hai thiết bị, phiên đăng nhập, đăng nhập lại và e-mail thông báo. Kiểm API từ chối mật khẩu cũ sai và hash trong DB không đổi là test một giao diện (IT); validateNewPassword là unit test.'),
    ],
  },
};

export default {
  title: 'Lab 3 — Integration & system test reports|||Lab 3 — Báo cáo integration test & system test',
  description: 'Lab 3: bộ template Report5 (Unit / Integration / System) giải thích từng sheet, từng cột, từng công thức và 4 lỗi công thức có sẵn; ví dụ điền trọn sheet Login + Change password có số liệu tính thật; phân tích file mẫu SEP490 và checklist nộp bài.',
  lessons: [L1, L2, L3, QUIZL3],
};
