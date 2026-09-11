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
<tbody>${TCS.map((t) => (t[0] === 'group' ? `<tr><td colspan="9"><b>${t[1]}</b></td></tr>` : `<tr><td>${t[0]}</td><td>${t[1]}</td><td>${t[2]}</td><td>${t[3]}</td><td>${t[4]}</td><td class="${cls(t[5])}">${t[5]}</td><td class="${cls(t[6])}">${t[6]}</td><td class="${cls(t[7])}">${t[7]}</td><td>${t[8]}</td></tr>`)).join('')}</tbody>
</table></div>`;

const ROUNDS = `<table>
<thead><tr><th>Testing Round</th><th>Passed</th><th>Failed</th><th>Pending</th><th>N/A</th><th>Test coverage</th><th>Test successful coverage</th></tr></thead>
<tbody>
<tr><td>Round 1</td><td>6</td><td>4</td><td>1</td><td>1</td><td>(6+4)×100/(12−1) = <b>90.91 %</b></td><td>6×100/11 = <b>54.55 %</b></td></tr>
<tr><td>Round 2</td><td>10</td><td>1</td><td>0</td><td>1</td><td>(10+1)×100/11 = <b>100 %</b></td><td>10×100/11 = <b>90.91 %</b></td></tr>
<tr><td>Round 3</td><td>12</td><td>0</td><td>0</td><td>0</td><td>12×100/12 = <b>100 %</b></td><td>12×100/12 = <b>100 %</b></td></tr>
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
<p class="lead">Lab 3 (and the testing part of every SEP490 capstone) is written in FPT's "Report 5" workbooks. They are not three copies of one form: each belongs to a different row of the teacher's Overview matrix (lesson 2.6), and each counts results in its own way. This lesson opens every sheet and explains every column and every formula — including four formula bugs shipped inside the templates that silently falsify your statistics if you do not fix them.</p>
<div class="callout"><b>Learning objectives.</b> LO-2.2.1 Compare test levels by objectives, test basis, test objects and typical defects (K2) · LO-1.4.3 Relate test work products to the test activities (K2) · LO-5.3.1 Recall metrics used in testing (K1) · LO-5.3.2 Summarise the purpose and content of test reports (K2).</div>
<table>
<thead><tr><th>Template</th><th>Overview level (lesson 2.6)</th><th>Test object &amp; basis</th><th>One test case is…</th><th>Results counted as</th></tr></thead>
<tbody>
<tr><td><b>Report5.1 Unit Test</b> (.xls)</td><td><b>CT</b> — component (unit) test</td><td>one <em>method</em>; detailed design / class specification</td><td>a <b>column</b> UTCIDnn in a condition × confirmation matrix</td><td>P / F, type N / A / B (normal, abnormal, boundary)</td></tr>
<tr><td><b>Report5.2 Integration Test</b></td><td><b>CIT</b> (component integration) and <b>SIT</b> (system integration)</td><td>a <em>feature</em>: UI → API → service → database / external system; architecture &amp; sequence diagrams</td><td>a <b>row</b>: description, procedure, expected result, precondition</td><td>Passed / Failed / Pending / N/A, in up to 3 rounds</td></tr>
<tr><td><b>Report5.3 System Test</b></td><td><b>ST</b> — system test</td><td>an end-to-end <em>workflow</em> of the whole system; SRS, use cases</td><td>a <b>row</b>, grouped into scenarios</td><td>Passed / Failed / Pending / N/A, in up to 3 rounds</td></tr>
</tbody>
</table>
<p>The difference you must be able to explain in the demo: a unit test checks that <code>changePassword()</code> rejects a 7-character password; an integration test checks that the form, the REST endpoint, the service and the <code>users</code> table <em>together</em> reject it and leave the hash unchanged; a system test checks the user's whole journey — change password, get logged out elsewhere, log back in — against the SRS.</p>`,
    `<span class="eyebrow">Lab 3 · Bài 3.1 · Report5.1_Unit Test.xls · Report5.2_Integration Test.xlsx · Report5.3_System Test.xlsx</span>
<h2>Ba template, ba cấp test</h2>
<p class="lead">Lab 3 (và phần kiểm thử của mọi đồ án SEP490) được viết trên các workbook "Report 5" của FPT. Đây không phải ba bản sao của cùng một mẫu: mỗi file ứng với một dòng trong bảng Overview của thầy/cô (bài 2.6), và mỗi file đếm kết quả theo cách riêng. Bài này mở từng sheet, giải thích từng cột và từng công thức — kể cả bốn lỗi công thức có sẵn trong template, âm thầm làm sai số liệu thống kê nếu bạn không sửa.</p>
<div class="callout"><b>Chuẩn đầu ra.</b> LO-2.2.1 So sánh các cấp test theo mục tiêu, cơ sở test, đối tượng test và loại defect điển hình (K2) · LO-1.4.3 Liên hệ sản phẩm test với các hoạt động test (K2) · LO-5.3.1 Nhớ các số đo dùng trong kiểm thử (K1) · LO-5.3.2 Tóm tắt mục đích và nội dung của báo cáo test (K2).</div>
<table>
<thead><tr><th>Template</th><th>Cấp trong Overview (bài 2.6)</th><th>Đối tượng &amp; cơ sở test</th><th>Một test case là…</th><th>Kết quả đếm theo</th></tr></thead>
<tbody>
<tr><td><b>Report5.1 Unit Test</b> (.xls)</td><td><b>CT</b> — component (unit) test</td><td>một <em>method</em>; thiết kế chi tiết / đặc tả lớp</td><td>một <b>cột</b> UTCIDnn trong ma trận điều kiện × xác nhận</td><td>P / F, loại N / A / B (normal, abnormal, boundary)</td></tr>
<tr><td><b>Report5.2 Integration Test</b></td><td><b>CIT</b> (tích hợp thành phần) và <b>SIT</b> (tích hợp hệ thống)</td><td>một <em>feature</em>: UI → API → service → database / hệ thống ngoài; kiến trúc &amp; sequence diagram</td><td>một <b>dòng</b>: mô tả, các bước, kết quả mong đợi, điều kiện tiên quyết</td><td>Passed / Failed / Pending / N/A, tối đa 3 vòng</td></tr>
<tr><td><b>Report5.3 System Test</b></td><td><b>ST</b> — system test</td><td>một <em>workflow</em> đầu-cuối của cả hệ thống; SRS, use case</td><td>một <b>dòng</b>, gom theo scenario</td><td>Passed / Failed / Pending / N/A, tối đa 3 vòng</td></tr>
</tbody>
</table>
<p>Khác biệt bạn phải giải thích được khi demo: unit test kiểm <code>changePassword()</code> từ chối mật khẩu 7 ký tự; integration test kiểm form, REST endpoint, service và bảng <code>users</code> <em>cùng nhau</em> từ chối nó và không đổi hash; system test kiểm cả hành trình của người dùng — đổi mật khẩu, bị đăng xuất ở nơi khác, đăng nhập lại — so với SRS.</p>`),
    bi(`<h2>1 · The Cover sheet (identical in all three)</h2>
<table>
<thead><tr><th>Cell</th><th>Content</th><th>How to fill</th></tr></thead>
<tbody>
<tr><td>B2</td><td>Title: UNIT TEST DOCUMENT / TEST REPORT DOCUMENT / SYSTEM TEST REPORT DOCUMENT</td><td>leave</td></tr>
<tr><td>B4, B5</td><td>Project Name, Project Code</td><td>e.g. "Online Bookstore", "OBS". Other sheets read these two cells.</td></tr>
<tr><td>B6</td><td>Document Code — <b>formula</b> <code>=B5&amp;"_"&amp;"XXX"&amp;"_"&amp;"vx.x"</code></td><td>edit the formula: replace XXX by the report type and vx.x by the version → <em>OBS_IntegrationTest_v1.0</em>. Leaving "XXX_vx.x" is the most visible sloppiness in a submission.</td></tr>
<tr><td>F4–F6</td><td>Creator, Issue Date, Version</td><td>who prepared it, the date of <em>this</em> issue, v1.0, v1.1…</td></tr>
<tr><td>A10:F10…</td><td><b>Record of change</b>: Effective Date · Version · Change Item · *A,D,M · Change description · Reference</td><td>one row per change; *A/D/M = <b>A</b>dded, <b>D</b>eleted, <b>M</b>odified; Reference = the documents used (SRS v1.2, design v1.0). This is configuration management of testware (Chapter 5).</td></tr>
</tbody>
</table>
<h2>2 · Report5.1 Unit Test — sheets Guideline, Cover, MethodList, Statistics, one sheet per method, Example</h2>
<p><b>Guideline</b> (the template explains itself — summary): test cases are organised <em>per function</em>, one sheet each. Each test case = <b>condition</b> + <b>confirmation</b>. Condition = precondition (e.g. "file A exists") + input values of three types: <b>normal</b> (usual values), <b>boundary</b> (lower/upper limits) and <b>abnormal</b> (unexpected values, exception handling) — the guideline's example: for 5 ≤ input ≤ 10, the values 6–9 are normal, 5 and 10 boundary, −1 and 11 abnormal. Confirmation = expected return value, log message or screen message; if the result equals the confirmation the case is P (passed), else F (OK/NG also accepted). It also mentions a "normal number of test cases per KLOC" to judge whether there are enough cases — that field exists only in the sample's MethodList ("Normal number of Test cases/KLOC = 20"), not in the empty template.</p>
<p><b>MethodList</b>: Project Name/Code (formulas <code>=Cover!B4</code>, <code>=Cover!B5</code>), Test Environment Setup Description (server, database, browser…), then a table No · Module Name · Method Name · Sheet Name · Description · Pre-Condition — one row per method under test, Sheet Name = the tab that holds its cases.</p>
<p><b>A method sheet</b> (layout of <em>methodName1</em>):</p>
<table>
<thead><tr><th>Area</th><th>Cells</th><th>Meaning / formula</th></tr></thead>
<tbody>
<tr><td>Header</td><td>A1–L3</td><td>Code Module, Method, Created By, Executed By, Test requirement (a sentence on what is tested)</td></tr>
<tr><td>Counters</td><td>A5 Passed · C5 Failed · F5 Untested · L5/M5/N5 N/A/B · O5 Total</td><td><code>A5 =COUNTIF(F38:HQ38,"P")</code>, <code>C5 =COUNTIF(F38:HQ38,"F")</code>, <code>O5 =COUNTA(E7:HT7)</code> (number of UTCID headers), <code>F5 =SUM(O5,-A5,-C5)</code> (= total − passed − failed), <code>L5/M5/N5 =COUNTIF(E37:HQ37,"N"/"A"/"B")</code></td></tr>
<tr><td>Test case IDs</td><td>row 7 from column F</td><td>UTCID01, UTCID02… — <b>one column per test case</b></td></tr>
<tr><td>Condition</td><td>rows 8–28</td><td>B = precondition or input name ("Date", "Month"…), D = one value per row ("29", "null", "&gt;=5 &amp; &lt;=10"), and an <b>"O"</b> in the UTCID column means "this case uses this value" (dropdown list "O")</td></tr>
<tr><td>Confirm</td><td>rows 29–36</td><td>Return (expected return values), Exception, Log message — again one value per row, "O" per case</td></tr>
<tr><td>Result</td><td>rows 37–40</td><td>Type (dropdown N, A, B) · Passed/Failed (dropdown P, F) · Executed Date · Defect ID</td></tr>
</tbody>
</table>
<p><b>Statistics</b>: one row per method, each cell a link to that sheet (<code>C12 =methodName1!A5</code>, D12 = …!C5, E12 = …!F5, F–H = N/A/B, I12 = …!O5); Sub total <code>=SUM(C10:C15)</code>; then <b>Test coverage</b> <code>=(C16+D16)*100/I16</code> (executed = passed + failed over all cases), <b>Test successful coverage</b> <code>=C16*100/I16</code>, and the share of <b>Normal / Abnormal / Boundary</b> cases <code>=F16*100/I16</code> etc. With the template's sample numbers: 30 cases, 24 P, 5 F, 1 untested → 96.67 % coverage, 80 % successful, 76.67 / 16.67 / 6.67 % N/A/B.</p>
<p><b>Example sheet</b> — a filled matrix you should be able to read: inputs a, b, c; returns a list. Decoded, it tests a solver of a·x² + b·x + c = 0: (a=−2) → abnormal, log "please input a&gt;= -1", return null; (0,0,0) → size 0; (0,0,1) → null; (0,2,1) → {−1/2}; (1,−2,1) → {1,1}; (1,−2,5) → null (negative discriminant); (−1,−2,3) → {1,−3}, marked B because a = −1 is the lower boundary of "a ≥ −1". (Roots re-computed: x² − 2x + 1 has the double root 1; −x² − 2x + 3 = 0 has roots 1 and −3.) Two template typos: columns H–K are all headed "UTCID02", and the dates are Excel serials 39139… (February–March 2007) — the template's age.</p>`,
    `<h2>1 · Sheet Cover (giống nhau ở cả ba)</h2>
<table>
<thead><tr><th>Ô</th><th>Nội dung</th><th>Cách điền</th></tr></thead>
<tbody>
<tr><td>B2</td><td>Tiêu đề: UNIT TEST DOCUMENT / TEST REPORT DOCUMENT / SYSTEM TEST REPORT DOCUMENT</td><td>giữ nguyên</td></tr>
<tr><td>B4, B5</td><td>Project Name, Project Code</td><td>vd "Online Bookstore", "OBS". Các sheet khác đọc hai ô này.</td></tr>
<tr><td>B6</td><td>Document Code — <b>công thức</b> <code>=B5&amp;"_"&amp;"XXX"&amp;"_"&amp;"vx.x"</code></td><td>sửa công thức: thay XXX bằng loại báo cáo, vx.x bằng phiên bản → <em>OBS_IntegrationTest_v1.0</em>. Để nguyên "XXX_vx.x" là lỗi cẩu thả lộ nhất trong bài nộp.</td></tr>
<tr><td>F4–F6</td><td>Creator, Issue Date, Version</td><td>người soạn, ngày phát hành <em>bản này</em>, v1.0, v1.1…</td></tr>
<tr><td>A10:F10…</td><td><b>Record of change</b>: Effective Date · Version · Change Item · *A,D,M · Change description · Reference</td><td>mỗi thay đổi một dòng; *A/D/M = <b>A</b>dded (thêm), <b>D</b>eleted (xoá), <b>M</b>odified (sửa); Reference = tài liệu tham chiếu (SRS v1.2, thiết kế v1.0). Đây là quản lý cấu hình cho testware (Chương 5).</td></tr>
</tbody>
</table>
<h2>2 · Report5.1 Unit Test — các sheet Guideline, Cover, MethodList, Statistics, mỗi method một sheet, Example</h2>
<p><b>Guideline</b> (template tự giải thích — tóm tắt): test case tổ chức <em>theo hàm</em>, mỗi hàm một sheet. Mỗi test case = <b>condition</b> (điều kiện) + <b>confirmation</b> (xác nhận). Condition = precondition (vd "có file A") + giá trị đầu vào thuộc ba loại: <b>normal</b> (giá trị thường dùng), <b>boundary</b> (giới hạn dưới/trên) và <b>abnormal</b> (giá trị ngoài mong đợi, xử lý ngoại lệ) — ví dụ của guideline: với 5 ≤ input ≤ 10, các giá trị 6–9 là normal, 5 và 10 là boundary, −1 và 11 là abnormal. Confirmation = giá trị trả về, log message hoặc thông báo màn hình mong đợi; kết quả trùng confirmation thì case là P (passed), ngược lại F (cũng chấp nhận OK/NG). Guideline còn nhắc chỉ số "số test case chuẩn trên mỗi KLOC" để đánh giá đủ hay thiếu — ô này chỉ có trong MethodList của file mẫu ("Normal number of Test cases/KLOC = 20"), không có trong template trống.</p>
<p><b>MethodList</b>: Project Name/Code (công thức <code>=Cover!B4</code>, <code>=Cover!B5</code>), Test Environment Setup Description (server, database, trình duyệt…), rồi bảng No · Module Name · Method Name · Sheet Name · Description · Pre-Condition — mỗi method được test một dòng, Sheet Name = tab chứa test case của nó.</p>
<p><b>Một sheet method</b> (bố cục của <em>methodName1</em>):</p>
<table>
<thead><tr><th>Vùng</th><th>Ô</th><th>Ý nghĩa / công thức</th></tr></thead>
<tbody>
<tr><td>Đầu sheet</td><td>A1–L3</td><td>Code Module, Method, Created By, Executed By, Test requirement (một câu nói test cái gì)</td></tr>
<tr><td>Bộ đếm</td><td>A5 Passed · C5 Failed · F5 Untested · L5/M5/N5 N/A/B · O5 Total</td><td><code>A5 =COUNTIF(F38:HQ38,"P")</code>, <code>C5 =COUNTIF(F38:HQ38,"F")</code>, <code>O5 =COUNTA(E7:HT7)</code> (số tiêu đề UTCID), <code>F5 =SUM(O5,-A5,-C5)</code> (= tổng − passed − failed), <code>L5/M5/N5 =COUNTIF(E37:HQ37,"N"/"A"/"B")</code></td></tr>
<tr><td>Mã test case</td><td>dòng 7 từ cột F</td><td>UTCID01, UTCID02… — <b>mỗi test case một cột</b></td></tr>
<tr><td>Condition</td><td>dòng 8–28</td><td>B = precondition hoặc tên input ("Date", "Month"…), D = mỗi dòng một giá trị ("29", "null", "&gt;=5 &amp; &lt;=10"), và <b>"O"</b> ở cột UTCID nghĩa là "case này dùng giá trị này" (danh sách chọn "O")</td></tr>
<tr><td>Confirm</td><td>dòng 29–36</td><td>Return (giá trị trả về mong đợi), Exception, Log message — cũng mỗi dòng một giá trị, "O" cho từng case</td></tr>
<tr><td>Result</td><td>dòng 37–40</td><td>Type (chọn N, A, B) · Passed/Failed (chọn P, F) · Executed Date · Defect ID</td></tr>
</tbody>
</table>
<p><b>Statistics</b>: mỗi method một dòng, mỗi ô là liên kết tới sheet đó (<code>C12 =methodName1!A5</code>, D12 = …!C5, E12 = …!F5, F–H = N/A/B, I12 = …!O5); Sub total <code>=SUM(C10:C15)</code>; rồi <b>Test coverage</b> <code>=(C16+D16)*100/I16</code> (đã chạy = passed + failed trên tổng số case), <b>Test successful coverage</b> <code>=C16*100/I16</code>, và tỉ lệ case <b>Normal / Abnormal / Boundary</b> <code>=F16*100/I16</code>… Với số mẫu trong template: 30 case, 24 P, 5 F, 1 chưa chạy → coverage 96,67 %, thành công 80 %, N/A/B 76,67 / 16,67 / 6,67 %.</p>
<p><b>Sheet Example</b> — một ma trận đã điền, bạn phải đọc được: input a, b, c; trả về một list. Giải mã ra, nó test hàm giải a·x² + b·x + c = 0: (a=−2) → abnormal, log "please input a&gt;= -1", trả null; (0,0,0) → size 0; (0,0,1) → null; (0,2,1) → {−1/2}; (1,−2,1) → {1,1}; (1,−2,5) → null (biệt thức âm); (−1,−2,3) → {1,−3}, đánh dấu B vì a = −1 là biên dưới của "a ≥ −1". (Đã tính lại nghiệm: x² − 2x + 1 có nghiệm kép 1; −x² − 2x + 3 = 0 có nghiệm 1 và −3.) Hai lỗi đánh máy của template: các cột H–K đều mang tiêu đề "UTCID02", và ngày là số serial Excel 39139… (tháng 2–3/2007) — tuổi của template.</p>`),
    bi(`<h2>3 · Report5.2 Integration Test and Report5.3 System Test</h2>
<p>The two workbooks are the same machine with different words: Integration uses <em>Feature</em> sheets split into <em>Functions</em>; System uses <em>Workflow</em> sheets split into <em>Scenarios</em>.</p>
<h3>Sheet "Test Cases" (the index)</h3>
<p>Project Name/Code (D3, D4), Test Environment Setup Description (D5: server, database, browser…), then No · Function Name · Sheet Name · Description · Pre-Condition — one row per function (Integration) or per function in a workflow (System), telling the reader which sheet contains it.</p>
<h3>A Feature / Workflow sheet</h3>
<table>
<thead><tr><th>Cells</th><th>Content</th><th>Formula / rule</th></tr></thead>
<tbody>
<tr><td>B2, B3</td><td>Feature (Workflow) name, Test requirement</td><td>B2 is shown in Test Statistics; B3 = the requirement(s) covered, e.g. "UC-02 Change password, SRS §3.4"</td></tr>
<tr><td>B4</td><td>Number of TCs</td><td><code>=COUNTA(A12:A1000)</code> — counts every non-empty cell of column A below row 11 (see bug 1)</td></tr>
<tr><td>A5:E8</td><td>Testing Round × Passed / Failed / Pending / N/A</td><td><code>=COUNTIF($F10:$F998,B5)</code> for Round 1; Round 2 and 3 should count columns I and L (see bug 2)</td></tr>
<tr><td>R2:R5</td><td>the words Passed, Failed, Pending, N/A</td><td>source of the dropdown lists in the result columns — do not delete</td></tr>
<tr><td>A10:O10</td><td>Test Case ID · Test Case Description · Test Case Procedure · Expected Results · Pre-conditions · Round 1 · Test date · Tester · Round 2 · Test date · Tester · Round 3 · Test date · Tester · Note</td><td>one row per test case; a row with only column A ("Function A", "Scenario A") is a <b>group header</b></td></tr>
</tbody>
</table>
<p>The template's own example of a good row: description "Test viewing 'Company' form"; procedure "1. Login the system with Manager role. 2. Click 'Company' tab in the left menu."; expected "The 'Company' view form is displayed with the following information: Company name, address, phone, fax"; pre-conditions "list all test cases or conditions that must be done before performing this case".</p>
<p><b>Result values.</b> Passed · Failed · <b>Pending</b> = not executed yet in this round (or blocked by another failure) · <b>N/A</b> = not applicable in this round (feature not delivered in the build, environment not available) — N/A cases are removed from the denominator of both coverages.</p>
<h3>Sheet "Test Statistics"</h3>
<p>No · Module code (= <code>'Feature 1'!B2</code>) · Passed · Failed · Pending · N/A (= that sheet's B6…E6, i.e. <b>Round 1</b>) · Number of test cases (= B4); Sub total <code>=SUM(D9:D13)</code>; then</p>
<ul>
<li><b>Test coverage</b> <code>=(D14+E14)*100/(H14-G14)</code> — executed (passed + failed) out of the applicable cases;</li>
<li><b>Test successful coverage</b> <code>=D14*100/(H14-G14)</code> — passed out of the applicable cases.</li>
</ul>
<p>Template values: 15 cases, 0 passed, 1 failed, 10 pending → coverage (0+1)×100/15 = <b>6.67 %</b>, successful 0 %.</p>
<h2>⚠️ Four bugs inside the templates (check your file)</h2>
<ol>
<li><b>"Number of TCs" counts group headers.</b> <code>COUNTA(A12:A1000)</code> counts "Function B" and "Function C" as test cases: Feature 1 shows <b>8</b> although it has 6 IDs; Feature 2 shows 7 for 5 IDs (its "Function E" plus a stray "6" in A18). Every percentage in Test Statistics is then computed on a wrong total. Fix: count only IDs, e.g. <code>=COUNTIF(A12:A1000,"*_*")</code> if your IDs contain "_" (the sample team did exactly this).</li>
<li><b>Rounds 2 and 3 count Round 1's column.</b> In Feature 1 the formulas of rows 7 and 8 are still <code>COUNTIF($F10:$F998,…)</code>, so the template shows Round 2 = "1 failed, 5 pending" although every Round 2 cell says Pending. Fix: Round 2 → <code>$I$12:$I$1000</code>, Round 3 → <code>$L$12:$L$1000</code>.</li>
<li><b>#REF! on the Test Cases sheet.</b> D3 and D4 point to a deleted sheet. Fix: <code>=Cover!B4</code>, <code>=Cover!B5</code>.</li>
<li><b>Sub totals with fixed ranges.</b> <code>SUM(D9:D13)</code> in 5.2/5.3 and <code>SUM(C10:C15)</code> in 5.1 only cover the rows that exist in the empty template. Add a sheet, add a row — and extend the range; the 5.1 Guideline itself warns "check the formula of Sub Total if you add more functions". Lesson 3.3 shows a real report that fell into this trap.</li>
</ol>
<p>A fifth decision, not a bug: Test Statistics links <b>Round 1</b>. For a final report you normally want the latest round — link B8…E8 instead and write in <em>Notes</em> which round the figures describe.</p>`,
    `<h2>3 · Report5.2 Integration Test và Report5.3 System Test</h2>
<p>Hai workbook là cùng một cỗ máy với từ ngữ khác nhau: Integration dùng sheet <em>Feature</em> chia thành <em>Function</em>; System dùng sheet <em>Workflow</em> chia thành <em>Scenario</em>.</p>
<h3>Sheet "Test Cases" (mục lục)</h3>
<p>Project Name/Code (D3, D4), Test Environment Setup Description (D5: server, database, trình duyệt…), rồi No · Function Name · Sheet Name · Description · Pre-Condition — mỗi chức năng (Integration) hoặc mỗi chức năng trong workflow (System) một dòng, cho người đọc biết nó nằm ở sheet nào.</p>
<h3>Một sheet Feature / Workflow</h3>
<table>
<thead><tr><th>Ô</th><th>Nội dung</th><th>Công thức / quy tắc</th></tr></thead>
<tbody>
<tr><td>B2, B3</td><td>Tên Feature (Workflow), Test requirement</td><td>B2 hiện trong Test Statistics; B3 = yêu cầu được phủ, vd "UC-02 Change password, SRS §3.4"</td></tr>
<tr><td>B4</td><td>Number of TCs</td><td><code>=COUNTA(A12:A1000)</code> — đếm mọi ô không trống ở cột A dưới dòng 11 (xem lỗi 1)</td></tr>
<tr><td>A5:E8</td><td>Testing Round × Passed / Failed / Pending / N/A</td><td><code>=COUNTIF($F10:$F998,B5)</code> cho Round 1; Round 2 và 3 lẽ ra đếm cột I và L (xem lỗi 2)</td></tr>
<tr><td>R2:R5</td><td>các chữ Passed, Failed, Pending, N/A</td><td>nguồn của danh sách chọn ở các cột kết quả — đừng xoá</td></tr>
<tr><td>A10:O10</td><td>Test Case ID · Test Case Description · Test Case Procedure · Expected Results · Pre-conditions · Round 1 · Test date · Tester · Round 2 · Test date · Tester · Round 3 · Test date · Tester · Note</td><td>mỗi test case một dòng; dòng chỉ có cột A ("Function A", "Scenario A") là <b>dòng tiêu đề nhóm</b></td></tr>
</tbody>
</table>
<p>Ví dụ dòng tốt ngay trong template: mô tả "Test viewing 'Company' form"; các bước "1. Login the system with Manager role. 2. Click 'Company' tab in the left menu."; mong đợi "Form xem 'Company' hiện các thông tin: tên công ty, địa chỉ, điện thoại, fax"; pre-conditions "liệt kê mọi test case hoặc điều kiện phải xong trước khi chạy case này".</p>
<p><b>Giá trị kết quả.</b> Passed · Failed · <b>Pending</b> = chưa chạy ở vòng này (hoặc bị chặn bởi lỗi khác) · <b>N/A</b> = không áp dụng ở vòng này (chức năng chưa có trong bản build, môi trường chưa sẵn) — case N/A bị loại khỏi mẫu số của cả hai loại coverage.</p>
<h3>Sheet "Test Statistics"</h3>
<p>No · Module code (= <code>'Feature 1'!B2</code>) · Passed · Failed · Pending · N/A (= B6…E6 của sheet đó, tức <b>Round 1</b>) · Number of test cases (= B4); Sub total <code>=SUM(D9:D13)</code>; rồi</p>
<ul>
<li><b>Test coverage</b> <code>=(D14+E14)*100/(H14-G14)</code> — số case đã chạy (passed + failed) trên số case áp dụng;</li>
<li><b>Test successful coverage</b> <code>=D14*100/(H14-G14)</code> — số case passed trên số case áp dụng.</li>
</ul>
<p>Số trong template: 15 case, 0 passed, 1 failed, 10 pending → coverage (0+1)×100/15 = <b>6,67 %</b>, thành công 0 %.</p>
<h2>⚠️ Bốn lỗi nằm sẵn trong template (hãy kiểm tra file của bạn)</h2>
<ol>
<li><b>"Number of TCs" đếm cả dòng tiêu đề nhóm.</b> <code>COUNTA(A12:A1000)</code> đếm "Function B" và "Function C" như test case: Feature 1 hiện <b>8</b> dù chỉ có 6 ID; Feature 2 hiện 7 cho 5 ID (do "Function E" và một số "6" lạc ở A18). Mọi phần trăm ở Test Statistics vì thế tính trên tổng sai. Sửa: chỉ đếm ID, vd <code>=COUNTIF(A12:A1000,"*_*")</code> nếu ID có dấu "_" (nhóm mẫu đã làm đúng như vậy).</li>
<li><b>Round 2 và 3 đếm lại cột của Round 1.</b> Ở Feature 1, công thức dòng 7 và 8 vẫn là <code>COUNTIF($F10:$F998,…)</code>, nên template hiện Round 2 = "1 failed, 5 pending" dù mọi ô Round 2 đều là Pending. Sửa: Round 2 → <code>$I$12:$I$1000</code>, Round 3 → <code>$L$12:$L$1000</code>.</li>
<li><b>#REF! ở sheet Test Cases.</b> D3 và D4 trỏ tới một sheet đã bị xoá. Sửa: <code>=Cover!B4</code>, <code>=Cover!B5</code>.</li>
<li><b>Sub total với vùng cố định.</b> <code>SUM(D9:D13)</code> ở 5.2/5.3 và <code>SUM(C10:C15)</code> ở 5.1 chỉ phủ các dòng có trong template trống. Thêm sheet, thêm dòng — thì phải nới vùng; chính Guideline của 5.1 đã cảnh báo "check the formula of Sub Total if you add more functions". Bài 3.3 cho thấy một báo cáo thật đã rơi đúng bẫy này.</li>
</ol>
<p>Một quyết định thứ năm, không phải lỗi: Test Statistics liên kết <b>Round 1</b>. Báo cáo cuối thường cần vòng mới nhất — hãy liên kết B8…E8 và ghi rõ trong <em>Notes</em> số liệu là của vòng nào.</p>`),
    bi(`<div class="pitfall"><b>FE / oral-check trap: "test coverage" in these reports is not code coverage.</b> Here it means <em>execution progress</em> — the share of planned, applicable test cases that were executed — and "successful coverage" the share that passed. Statement/decision coverage (Chapter 4) is measured by a tool on the code. If an examiner asks "your report shows 100 % coverage — is every line tested?", the right answer is no: all planned cases ran; how much of the code or requirements they reach is a separate measurement.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Why rounds instead of one result?</b> Keeping Round 1/2/3 side by side turns the sheet into a small <em>test-execution history</em>: you can compute how many defects were found per round, whether fixes stuck (a case that fails, passes, fails again signals a regression), and draw the classic "S-curve" of executed and passed cases over time used in test progress reports (van Veenendaal's Table 5.1 and Figure 5.2). Test-management tools (TestRail, Xray, Zephyr) store exactly this as "test runs". <em>Outside the syllabus because CTFL names the metrics but not a format.</em></div>`,
    `<div class="pitfall"><b>Bẫy FE / vấn đáp: "test coverage" trong các báo cáo này không phải code coverage.</b> Ở đây nó nghĩa là <em>tiến độ thực thi</em> — tỉ lệ test case đã lên kế hoạch, áp dụng được, đã được chạy — còn "successful coverage" là tỉ lệ đã pass. Statement/decision coverage (Chương 4) do công cụ đo trên code. Nếu giám khảo hỏi "báo cáo ghi coverage 100 % — mọi dòng code đã được test?", câu trả lời đúng là không: mọi case đã lên kế hoạch đã chạy; chúng chạm tới bao nhiêu code hay yêu cầu là một phép đo khác.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Vì sao nhiều vòng thay vì một kết quả?</b> Đặt Round 1/2/3 cạnh nhau biến sheet thành một <em>lịch sử thực thi test</em> nhỏ: tính được mỗi vòng tìm bao nhiêu lỗi, bản sửa có giữ được không (một case fail, rồi pass, rồi fail lại là dấu hiệu regression), và vẽ "đường cong chữ S" số case đã chạy và đã pass theo thời gian trong báo cáo tiến độ (Bảng 5.1 và Hình 5.2 của van Veenendaal). Công cụ quản lý test (TestRail, Xray, Zephyr) lưu đúng thứ này dưới tên "test run". <em>Ngoài giáo trình vì CTFL nêu số đo nhưng không nêu định dạng.</em></div>`),
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
<p class="lead">Feature: <b>Account — Login and Change password</b> of a web shop ("Online Bookstore", code OBS). Architecture: React form → REST API <code>/api/auth/login</code>, <code>/api/users/me/password</code> → AuthService/UserService → PostgreSQL table <code>users</code> + <code>sessions</code>. Rules from the SRS: password ≥ 8 characters with a letter and a digit; 5 wrong passwords lock the account for 15 minutes; login errors must not reveal whether an e-mail exists; changing the password revokes other sessions; a session expires after 30 minutes.</p>
<div class="callout"><b>Learning objectives.</b> LO-4.2.1/4.2.2 Apply EP and BVA (K3) — the 7/8-character pair · LO-4.2.5 Use-case/flow thinking for procedures (K2) · LO-5.3.2 Produce the figures of a test report (K2) · LO-5.6.1 Link failures to defect reports (K3).</div>
<h3>Step 1 — the header</h3>
<p>B2 Feature = <em>Account</em>; B3 Test requirement = <em>SRS UC-01 Login (§3.2), UC-02 Change password (§3.4); interfaces UI ↔ AuthController ↔ AuthService ↔ users/sessions tables</em>. Group rows "Login" (A11) and "Change password".</p>
<h3>Step 2 — the test cases (what makes them <em>integration</em> tests)</h3>
<p>Every expected result checks something that crosses a boundary: the message on the screen <b>and</b> the database state (<code>failed_attempts</code>, <code>status</code>, <code>password_hash</code>, <code>sessions</code>) or the network call (TC06, TC11: validation must happen before the API is called). The sheet is written in English, as the real submission is.</p>
${tcTable()}
<h3>Step 3 — the round table (B5:E8), computed with the fixed formulas</h3>
${ROUNDS}
<p>How to read it: Round 1 found 4 failures (DF-L01…L04) and could not run TC05 because its precondition TC04 failed — that is <b>Pending</b>, not Failed. TC12 is <b>N/A</b> in Rounds 1–2 because session timeout was not in those builds, so it leaves the denominator (12 − 1 = 11). TC04 failed twice: the first fix did not work — the Note records it, and the defect was reopened. Round 3 is clean.</p>
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
<p class="lead">Chức năng: <b>Account — Đăng nhập và Đổi mật khẩu</b> của một web bán sách ("Online Bookstore", mã OBS). Kiến trúc: form React → REST API <code>/api/auth/login</code>, <code>/api/users/me/password</code> → AuthService/UserService → bảng PostgreSQL <code>users</code> + <code>sessions</code>. Quy tắc trong SRS: mật khẩu ≥ 8 ký tự, có chữ và số; sai 5 lần thì khoá tài khoản 15 phút; thông báo lỗi đăng nhập không được lộ e-mail có tồn tại hay không; đổi mật khẩu thì thu hồi các phiên khác; phiên hết hạn sau 30 phút.</p>
<div class="callout"><b>Chuẩn đầu ra.</b> LO-4.2.1/4.2.2 Áp dụng EP và BVA (K3) — cặp 7/8 ký tự · LO-4.2.5 Tư duy use case/luồng khi viết các bước (K2) · LO-5.3.2 Lập số liệu cho báo cáo test (K2) · LO-5.6.1 Liên kết failure với defect report (K3).</div>
<h3>Bước 1 — phần đầu sheet</h3>
<p>B2 Feature = <em>Account</em>; B3 Test requirement = <em>SRS UC-01 Login (§3.2), UC-02 Change password (§3.4); giao diện UI ↔ AuthController ↔ AuthService ↔ bảng users/sessions</em>. Hai dòng nhóm "Login" (A11) và "Change password".</p>
<h3>Bước 2 — các test case (điều gì làm chúng thành test <em>tích hợp</em>)</h3>
<p>Mọi kết quả mong đợi đều kiểm một thứ đi qua ranh giới giữa các thành phần: thông báo trên màn hình <b>và</b> trạng thái database (<code>failed_attempts</code>, <code>status</code>, <code>password_hash</code>, <code>sessions</code>) hoặc lời gọi mạng (TC06, TC11: phải kiểm hợp lệ trước khi gọi API). Sheet viết bằng tiếng Anh, đúng như bài nộp thật.</p>
${tcTable()}
<h3>Bước 3 — bảng vòng test (B5:E8), tính bằng công thức đã sửa</h3>
${ROUNDS}
<p>Cách đọc: Round 1 phát hiện 4 failure (DF-L01…L04) và không chạy được TC05 vì điều kiện tiên quyết TC04 bị fail — đó là <b>Pending</b>, không phải Failed. TC12 là <b>N/A</b> ở Round 1–2 vì bản build chưa có session timeout, nên nó ra khỏi mẫu số (12 − 1 = 11). TC04 fail hai lần: bản sửa đầu không ăn — cột Note ghi lại, và defect được mở lại (reopen). Round 3 sạch.</p>
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
<p><b>Unit (Report5.1, sheet <em>validateNewPassword</em>).</b> Inputs: <code>newPw</code>, <code>confirmPw</code>. Condition rows: newPw = "Pass123a" (8, valid), "Pass12a" (7), "Password" (no digit), "12345678" (no letter), "" , null; confirmPw = same as newPw / different / null. Confirm rows: Return true/false; Exception <code>IllegalArgumentException</code> for null; Log "Password must be at least 8 characters" … Columns UTCID01–UTCID08; types: "Pass123a" = B (lower boundary of the valid length), "Pass12a" = B (upper boundary of the invalid partition), "Password"/"12345678" = A, a 12-character valid password = N, null = A. The counters then give e.g. N = 1, A = 5, B = 2 — a healthy mix, unlike a sheet that is 70 % "B".</p>
<p><b>System (Report5.3, workflow <em>Account security</em>, scenario "Password change on two devices").</b> ST-01: log in on browser A and B → change password on A → B's next action redirects to Login → log in on B with the new password succeeds → an e-mail "Your password was changed" arrives. This is a user journey across the whole system and an external mail service — the kind of case that belongs in the System Test report, not in Integration.</p>
<div class="pitfall"><b>Marks lost in this lab — the usual list.</b> (1) Expected result copied from the description ("Verify login works") instead of an observable result. (2) Test data missing from the procedure ("enter a valid email"). (3) One case testing three things at once — when it fails you cannot tell which. (4) Pending and Failed confused; N/A used for "I had no time". (5) Statistics not linked to the sheets, or linked to Round 1 while you report Round 3. (6) Template placeholders left: "XXX_vx.x", "&lt;Brief description…&gt;", #REF!. (7) Failed rows without a defect ID in Note. (8) Real personal data or secrets in the test data.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Automating such a sheet.</b> The 12 cases above are ideal candidates for API-level automation: Postman/Newman collections or REST Assured tests call <code>/api/auth/login</code> and check the JSON and the database; Playwright or Selenium cover TC06/TC11 in the browser. Each run then produces a JUnit-XML report that CI can turn into exactly the Round columns — without hand-typed "Passed". <em>Outside the syllabus because CTFL Chapter 6 treats tools generically.</em></div>`,
    `<h3>Bước 5 — cùng chức năng ở hai cấp còn lại</h3>
<p><b>Unit (Report5.1, sheet <em>validateNewPassword</em>).</b> Input: <code>newPw</code>, <code>confirmPw</code>. Các dòng điều kiện: newPw = "Pass123a" (8, hợp lệ), "Pass12a" (7), "Password" (không có số), "12345678" (không có chữ), "", null; confirmPw = giống newPw / khác / null. Các dòng xác nhận: Return true/false; Exception <code>IllegalArgumentException</code> khi null; Log "Password must be at least 8 characters" … Các cột UTCID01–UTCID08; loại: "Pass123a" = B (biên dưới của độ dài hợp lệ), "Pass12a" = B (biên trên của phân vùng không hợp lệ), "Password"/"12345678" = A, một mật khẩu hợp lệ 12 ký tự = N, null = A. Bộ đếm cho ra chẳng hạn N = 1, A = 5, B = 2 — cơ cấu lành mạnh, khác hẳn một sheet 70 % là "B".</p>
<p><b>System (Report5.3, workflow <em>Account security</em>, scenario "Đổi mật khẩu trên hai thiết bị").</b> ST-01: đăng nhập trên trình duyệt A và B → đổi mật khẩu trên A → thao tác tiếp theo trên B bị chuyển về Login → đăng nhập trên B bằng mật khẩu mới thành công → nhận e-mail "Your password was changed". Đây là hành trình người dùng xuyên cả hệ thống và một dịch vụ mail bên ngoài — loại case thuộc báo cáo System Test, không thuộc Integration.</p>
<div class="pitfall"><b>Những lỗi mất điểm ở lab này — danh sách quen thuộc.</b> (1) Kết quả mong đợi chép lại mô tả ("Verify login works") thay vì một kết quả quan sát được. (2) Thiếu dữ liệu test trong các bước ("nhập email hợp lệ"). (3) Một case kiểm ba thứ cùng lúc — fail thì không biết cái nào hỏng. (4) Nhầm Pending với Failed; dùng N/A cho "em không kịp làm". (5) Statistics không liên kết với các sheet, hoặc liên kết Round 1 trong khi báo cáo Round 3. (6) Còn placeholder của template: "XXX_vx.x", "&lt;Brief description…&gt;", #REF!. (7) Dòng Failed không có mã defect ở cột Note. (8) Dữ liệu cá nhân thật hoặc bí mật trong dữ liệu test.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Tự động hoá một sheet như thế.</b> 12 case trên rất hợp để tự động ở mức API: collection Postman/Newman hoặc test REST Assured gọi <code>/api/auth/login</code> và kiểm JSON lẫn database; Playwright hoặc Selenium phủ TC06/TC11 trên trình duyệt. Mỗi lần chạy sinh báo cáo JUnit-XML mà CI có thể biến thành đúng các cột Round — không cần gõ tay "Passed". <em>Ngoài giáo trình vì Chương 6 của CTFL chỉ bàn công cụ ở mức tổng quát.</em></div>`),
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
<p class="lead">The Lab 3 guide folder contains one real deliverable of a SEP490 capstone team — here "the sample team" — for a project called <em>Chatbot AI Platform</em> (code CAIP): an integration-test report and a unit-test report built on the templates of Lesson 3.1. It is a good report and a useful model, and it also contains most of the classic mistakes. Reviewing it is itself static testing (Chapter 3) applied to test documentation. Names, e-mails, phone numbers and tokens found in the file are deliberately not reproduced.</p>
<div class="callout"><b>Learning objectives.</b> LO-3.1.1 Test work products (test cases, reports) can be reviewed too (K1) · LO-5.3.2 Judge whether a test report is correct and complete (K2) · LO-1.4.4 Traceability between test basis, test cases, results and defects (K2).</div>
<h2>1 · The integration-test report</h2>
<table>
<thead><tr><th>Sheet</th><th>What the sample team did</th></tr></thead>
<tbody>
<tr><td>Cover</td><td>Project, code, Document Code formula edited to <em>CAIP_Integration_v1.0</em>; Record of change with 17 dated rows (each sheet added, then "Create test report based on test result").</td></tr>
<tr><td>Test Cases</td><td>30 functions (Login, Register, Activate Account, Password Forgot/Reset, User Profile, Password Change, User List/Details/New, Chat, TestBot, Live Chat, Bot List/New/Details, Model, Organization…, Role…, Plan…, Invoice…) mapped to 15 sheets; D3/D4 re-linked to Cover (the #REF! fixed).</td></tr>
<tr><td>15 feature sheets</td><td><b>261 test cases</b> (Login 9, Register 17, Password Reset 11, Profile 10, User List 33, Chat 6, Live chat 4, Bot 16, Bot Details 40, Model 12, Organization 14, Organization Details 24, Role 18, Plan 24, Invoice 23), IDs <code>FTnn_TCmm</code> (feature nn, case mm), sub-functions as group rows, three rounds one week apart (March 2025).</td></tr>
<tr><td>Test Statistics</td><td>Links to <b>Round 3</b> of every sheet → 261 passed, 0 failed, coverage 100 %, successful 100 %. Round 1 across all sheets was 202 passed / 59 failed (77.4 %) — a figure the report never shows.</td></tr>
</tbody>
</table>
<h3>What is worth copying</h3>
<ul>
<li><b>Concrete procedures with data in a fixed pattern</b>: "1. Open Login Form 2. Enter following information: &lt;Email&gt;: "…" &lt;Password&gt;: "12345678" 3. Click &lt;Login&gt; Button" — anyone can re-run it.</li>
<li><b>Exact expected messages</b> ("Error message is displayed right under the &lt;Email&gt; field: 'Email is required'") and, for Register, the database effect ("user inserted with status = INACTIVE, a random 6-digit OTP sent, redirect to Verify OTP").</li>
<li><b>Real integration concerns</b>: OTP e-mail sending and the SMTP failure (FT02_TC11), OTP expiry after 2 minutes, "first OTP after resend must be rejected" (FT02_TC16), expired reset link, Google login, script injection in chat (FT06_TC04), QR-code generation failure for billing (FT12_TC24).</li>
<li><b>Preconditions that chain cases</b>: "Pass FT02_TC01", "Pass FT02_TC10" — explicit dependencies.</li>
<li><b>Fixed formulas</b>: Number of TCs <code>=COUNTIF($A12:$A1003,"*"&amp;"_"&amp;"*")</code> (only IDs are counted), Round 2 and 3 counters on columns I and L — both template bugs of Lesson 3.1 corrected.</li>
<li><b>A visible retest history</b>: Failed → Failed → Passed rows show defects that needed two fixes.</li>
</ul>`,
    `<span class="eyebrow">Lab 3 · Bài 3.3 · 5341_SEP490_G47…Report5_Integration_Test.xlsx · …Report5_Unit_Test.xlsx</span>
<h2>Một báo cáo thật, đọc bằng mắt người review</h2>
<p class="lead">Thư mục hướng dẫn Lab 3 có một sản phẩm thật của một nhóm đồ án SEP490 — ở đây gọi là "nhóm mẫu" — cho dự án <em>Chatbot AI Platform</em> (mã CAIP): một báo cáo integration test và một báo cáo unit test dựng trên các template của Bài 3.1. Đây là báo cáo tốt, đáng làm mẫu, và cũng chứa gần đủ các lỗi kinh điển. Review nó chính là kiểm thử tĩnh (Chương 3) áp cho tài liệu test. Tên, e-mail, số điện thoại và token trong file cố ý không được chép lại.</p>
<div class="callout"><b>Chuẩn đầu ra.</b> LO-3.1.1 Sản phẩm test (test case, báo cáo) cũng review được (K1) · LO-5.3.2 Đánh giá một báo cáo test đúng và đủ chưa (K2) · LO-1.4.4 Truy vết giữa cơ sở test, test case, kết quả và defect (K2).</div>
<h2>1 · Báo cáo integration test</h2>
<table>
<thead><tr><th>Sheet</th><th>Nhóm mẫu đã làm gì</th></tr></thead>
<tbody>
<tr><td>Cover</td><td>Tên dự án, mã, công thức Document Code đã sửa thành <em>CAIP_Integration_v1.0</em>; Record of change 17 dòng có ngày (thêm từng sheet, rồi "Create test report based on test result").</td></tr>
<tr><td>Test Cases</td><td>30 chức năng (Login, Register, Activate Account, Password Forgot/Reset, User Profile, Password Change, User List/Details/New, Chat, TestBot, Live Chat, Bot List/New/Details, Model, Organization…, Role…, Plan…, Invoice…) ánh xạ vào 15 sheet; D3/D4 đã nối lại với Cover (sửa #REF!).</td></tr>
<tr><td>15 sheet chức năng</td><td><b>261 test case</b> (Login 9, Register 17, Password Reset 11, Profile 10, User List 33, Chat 6, Live chat 4, Bot 16, Bot Details 40, Model 12, Organization 14, Organization Details 24, Role 18, Plan 24, Invoice 23), mã <code>FTnn_TCmm</code> (feature nn, case mm), chức năng con làm dòng nhóm, ba vòng cách nhau một tuần (tháng 3/2025).</td></tr>
<tr><td>Test Statistics</td><td>Liên kết <b>Round 3</b> của mọi sheet → 261 passed, 0 failed, coverage 100 %, thành công 100 %. Round 1 trên toàn bộ là 202 passed / 59 failed (77,4 %) — con số báo cáo không hề hiện ra.</td></tr>
</tbody>
</table>
<h3>Điều đáng học</h3>
<ul>
<li><b>Các bước cụ thể, dữ liệu theo một khuôn cố định</b>: "1. Open Login Form 2. Enter following information: &lt;Email&gt;: "…" &lt;Password&gt;: "12345678" 3. Click &lt;Login&gt; Button" — ai cũng chạy lại được.</li>
<li><b>Thông báo mong đợi chính xác</b> ("Error message is displayed right under the &lt;Email&gt; field: 'Email is required'") và, với Register, cả tác động lên database ("user được thêm với status = INACTIVE, gửi OTP 6 số ngẫu nhiên, chuyển sang màn Verify OTP").</li>
<li><b>Mối lo tích hợp thật</b>: gửi OTP qua e-mail và lỗi SMTP (FT02_TC11), OTP hết hạn sau 2 phút, "OTP đầu tiên sau khi gửi lại phải bị từ chối" (FT02_TC16), link reset hết hạn, đăng nhập Google, chèn script vào chat (FT06_TC04), lỗi sinh QR thanh toán (FT12_TC24).</li>
<li><b>Precondition nối các case</b>: "Pass FT02_TC01", "Pass FT02_TC10" — phụ thuộc được ghi rõ.</li>
<li><b>Công thức đã sửa</b>: Number of TCs <code>=COUNTIF($A12:$A1003,"*"&amp;"_"&amp;"*")</code> (chỉ đếm ID), bộ đếm Round 2 và 3 trên cột I và L — cả hai lỗi template của Bài 3.1 đã được sửa.</li>
<li><b>Lịch sử test lại nhìn thấy được</b>: các dòng Failed → Failed → Passed cho thấy defect cần sửa hai lần.</li>
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
<p>27 method sheets (controllers <code>ChatController</code>, <code>LiveChatController</code>, <code>BotController</code>, <code>DataContentController</code>, <code>PaymentController</code>…, a Python-style <code>DataRoutes</code> service, <code>MessageService</code>), each a clean condition matrix: every input gets the partitions <b>valid value / invalid value / "" / null</b>, paging inputs get BVA values (page 1, 2, 0, −1, null; limit 10, 5, 0, −1, null), and each abnormal case has its exact log message ("BotId cannot be empty", "BotId is required"). As a method of designing unit tests, this is exemplary.</p>
<p>But the <b>Statistics</b> sheet says: Sub total <b>55</b> test cases, 55 passed, test coverage 100 %, normal 14.5 % / abnormal 10.9 % / boundary 74.5 %. The formula is the template's <code>=SUM(C10:C15)</code>: it adds only the first four methods (11 + 20 + 12 + 12 = 55) while the sheet lists 27. Summed correctly the report contains <b>262</b> unit test cases (N 38, A 38, B 186 → 14.5 / 14.5 / 71.0 %). In addition the <em>Chat2</em> row is typed by hand as 9 passed of 11 cases while its sheet has 9 cases.</p>
<p>Smaller findings: every case P and no Defect ID — plausible for a final run, but then state that it is the final run; "Test requirement" placeholder left in all sheets; "" and null labelled B (boundary) almost everywhere — they are really abnormal/invalid partitions, which is why B is 71 %; copy-paste in <em>updateBot</em> (expects "bot created" / "Bot created successfully"); <em>HandleUserMessage</em> headed with Code Module "DataRoutes" while the MethodList says MessageService; MethodList numbers 5 and 4 swapped; executed dates filled in for columns that have no test case.</p>`,
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
<p>27 sheet method (các controller <code>ChatController</code>, <code>LiveChatController</code>, <code>BotController</code>, <code>DataContentController</code>, <code>PaymentController</code>…, một service kiểu Python <code>DataRoutes</code>, <code>MessageService</code>), mỗi sheet là một ma trận điều kiện gọn gàng: mọi input có các phân vùng <b>giá trị hợp lệ / không hợp lệ / "" / null</b>, input phân trang có giá trị BVA (page 1, 2, 0, −1, null; limit 10, 5, 0, −1, null), và mỗi case bất thường có log message chính xác ("BotId cannot be empty", "BotId is required"). Xét như cách thiết kế unit test, đây là mẫu mực.</p>
<p>Nhưng sheet <b>Statistics</b> ghi: Sub total <b>55</b> test case, 55 passed, test coverage 100 %, normal 14,5 % / abnormal 10,9 % / boundary 74,5 %. Công thức là <code>=SUM(C10:C15)</code> của template: nó chỉ cộng bốn method đầu (11 + 20 + 12 + 12 = 55) trong khi sheet liệt kê 27. Cộng đúng thì báo cáo có <b>262</b> unit test case (N 38, A 38, B 186 → 14,5 / 14,5 / 71,0 %). Thêm nữa dòng <em>Chat2</em> gõ tay 9 passed trên 11 case trong khi sheet của nó có 9 case.</p>
<p>Phát hiện nhỏ hơn: mọi case đều P và không có Defect ID — hợp lý nếu là lần chạy cuối, nhưng khi đó phải ghi rõ; placeholder "Test requirement" để nguyên ở mọi sheet; "" và null gần như luôn đánh B (boundary) — thực chất là phân vùng bất thường/không hợp lệ, vì thế B chiếm 71 %; chép-dán ở <em>updateBot</em> (mong đợi "bot created" / "Bot created successfully"); <em>HandleUserMessage</em> ghi Code Module "DataRoutes" trong khi MethodList ghi MessageService; MethodList đảo số thứ tự 5 và 4; ngày thực thi điền cả ở các cột không có test case.</p>`),
    bi(`<h2>✅ Submission checklist for Lab 3</h2>
<ol>
<li>Cover: project name/code, Document Code without "XXX_vx.x", creator, issue date, version; Record of change up to date.</li>
<li>Test Cases / MethodList sheet lists every sheet; no #REF!.</li>
<li>Every feature/workflow/method sheet has a filled <b>Test requirement</b> pointing to the SRS / use case / design.</li>
<li>Right level in the right workbook: methods → 5.1, component/system interfaces → 5.2, end-to-end workflows → 5.3.</li>
<li>Each case tests one thing; procedure has numbered steps <b>with test data</b>; expected result is observable (screen message, DB value, API response); preconditions name the data state or prerequisite case.</li>
<li>EP/BVA visible: both sides of every boundary (7/8, 0/1, max/max+1), at least one abnormal case per input.</li>
<li>Results only from the dropdown (Passed/Failed/Pending/N/A or P/F); tester and date filled for every executed round; Failed rows carry a defect ID.</li>
<li>Counters fixed: Number of TCs counts IDs only; Round 2/3 formulas point to columns I and L; sub-total ranges include every row; Statistics linked (not typed) and states which round it reports.</li>
<li>Recalculate and <b>check one figure by hand</b> (e.g. passed of one sheet) before submitting.</li>
<li>No real personal data, passwords or tokens; file named as your lecturer asks.</li>
</ol>
<div class="pitfall"><b>The 100 % trap.</b> A report that shows "100 % coverage, 100 % successful" with zero failures in every round is the first thing a lecturer questions: either the tests are too weak (Chapter 1, lesson 1.5 — low-quality tests find nothing) or the statistics do not show the history. Show Round 1 honestly; the defects you found are the value you delivered.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Reviewing test cases with a checklist.</b> Industry teams review test specifications exactly like code — with checklists such as "is the expected result unambiguous and observable?", "is the test independent of the order of execution?", "does every requirement have at least one test and every test a requirement?". ISO/IEC/IEEE 29119-3 defines the documents (test case specification, test execution log, test completion report) that these Report5 sheets imitate. <em>Outside the syllabus because CTFL only states that test work products can be reviewed.</em></div>`,
    `<h2>✅ Checklist nộp bài Lab 3</h2>
<ol>
<li>Cover: tên/mã dự án, Document Code không còn "XXX_vx.x", người soạn, ngày phát hành, phiên bản; Record of change cập nhật.</li>
<li>Sheet Test Cases / MethodList liệt kê đủ mọi sheet; không còn #REF!.</li>
<li>Mọi sheet feature/workflow/method có <b>Test requirement</b> trỏ tới SRS / use case / thiết kế.</li>
<li>Đúng cấp ở đúng workbook: method → 5.1, giao diện thành phần/hệ thống → 5.2, workflow đầu-cuối → 5.3.</li>
<li>Mỗi case kiểm một điều; các bước đánh số <b>có dữ liệu test</b>; kết quả mong đợi quan sát được (thông báo màn hình, giá trị DB, response API); precondition nêu trạng thái dữ liệu hoặc case tiên quyết.</li>
<li>Thấy rõ EP/BVA: cả hai phía của mỗi biên (7/8, 0/1, max/max+1), ít nhất một case bất thường cho mỗi input.</li>
<li>Kết quả chỉ lấy từ danh sách chọn (Passed/Failed/Pending/N/A hoặc P/F); có tester và ngày cho mỗi vòng đã chạy; dòng Failed có mã defect.</li>
<li>Bộ đếm đã sửa: Number of TCs chỉ đếm ID; công thức Round 2/3 trỏ cột I và L; vùng sub total bao đủ mọi dòng; Statistics liên kết (không gõ tay) và ghi rõ báo cáo vòng nào.</li>
<li>Tính lại và <b>kiểm tay một con số</b> (vd số passed của một sheet) trước khi nộp.</li>
<li>Không có dữ liệu cá nhân thật, mật khẩu hay token; đặt tên file đúng yêu cầu của giảng viên.</li>
</ol>
<div class="pitfall"><b>Bẫy 100 %.</b> Báo cáo ghi "coverage 100 %, thành công 100 %" và không vòng nào có lỗi là thứ đầu tiên giảng viên nghi ngờ: hoặc test quá yếu (Chương 1, bài 1.5 — test kém thì chẳng tìm ra gì), hoặc số liệu giấu mất lịch sử. Hãy trình bày Round 1 trung thực; các defect bạn tìm ra chính là giá trị bạn mang lại.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Review test case bằng checklist.</b> Doanh nghiệp review đặc tả test y như review code — với checklist kiểu "kết quả mong đợi có rõ ràng và quan sát được không?", "test có độc lập với thứ tự chạy không?", "yêu cầu nào cũng có ít nhất một test và test nào cũng có yêu cầu?". ISO/IEC/IEEE 29119-3 định nghĩa các tài liệu (test case specification, test execution log, test completion report) mà các sheet Report5 này mô phỏng. <em>Ngoài giáo trình vì CTFL chỉ nói sản phẩm test cũng review được.</em></div>`),
    books([
      ['fst4', 'Ch.1 §4 test work products and traceability pp.15–26 (PDF 29–40); Ch.3 §1 work products examinable by static testing p.75 (PDF 89); Ch.5 §3 test reports pp.175–180 (PDF 189–194)', 'Chương 1 §4 sản phẩm test và truy vết trang 15–26 (PDF 29–40); Chương 3 §1 sản phẩm xem xét được bằng kiểm thử tĩnh trang 75 (PDF 89); Chương 5 §3 báo cáo test trang 175–180 (PDF 189–194)'],
      ['sp5', '§2.3 test process — traceability (PDF 66); §6.3.4 Test reports (PDF 281); §6.4 Defect management (PDF 284–292)', '§2.3 quy trình test — truy vết (PDF 66); §6.3.4 Test reports (PDF 281); §6.4 Defect management (PDF 284–292)'],
      ['fst', '§5.3 "Test progress monitoring and control" pp.140–144 (PDF 143–147); §5.6 "Incident management" p.155 (PDF 158)', '§5.3 "Test progress monitoring and control" trang 140–144 (PDF 143–147); §5.6 "Incident management" trang 155 (PDF 158)'],
    ]),
  ].join('\n'),
};

/* ──────────────────────────────── Quiz ──────────────────────────────── */
const q = (question, options, correctIndex) => ({ question, options, correctIndex, points: 1 });
const QUIZL3 = {
  title: 'Quiz Lab 3 — Test reports (unit, integration, system)|||Quiz Lab 3 — Báo cáo test (unit, integration, system)',
  slug: 'swt301-lab3-quiz',
  type: 'QUIZ',
  description: '10 câu về bộ template Report5: cấp test của từng file, công thức coverage, Pending vs N/A, các lỗi công thức và bài học từ file mẫu SEP490.',
  quiz: {
    timeLimitSeconds: 600,
    questions: [
      q('Which Report5 template belongs to the CT (component/unit test) level?|||Template Report5 nào thuộc cấp CT (component/unit test)?', ['Report5.1 Unit Test', 'Report5.2 Integration Test', 'Report5.3 System Test', 'None — CT is not documented|||Không file nào — CT không cần tài liệu'], 0),
      q('In Report5.1, one unit test case is…|||Trong Report5.1, một unit test case là…', ['a row with procedure and expected result|||một dòng có các bước và kết quả mong đợi', 'a UTCID column in the condition/confirmation matrix|||một cột UTCID trong ma trận condition/confirmation', 'a separate sheet|||một sheet riêng', 'a JUnit class|||một class JUnit'], 1),
      q('Test coverage in Report5.2 Test Statistics is computed as…|||Test coverage trong Test Statistics của Report5.2 được tính là…', ['Passed × 100 / Total|||Passed × 100 / Tổng', '(Passed + Failed) × 100 / (Total − N/A)|||(Passed + Failed) × 100 / (Tổng − N/A)', 'Statements executed / total statements|||Số lệnh đã chạy / tổng số lệnh', 'Failed × 100 / Total|||Failed × 100 / Tổng'], 1),
      q('A case could not run in Round 1 because its prerequisite case failed. Its Round 1 result is…|||Một case không chạy được ở Round 1 vì case tiên quyết bị fail. Kết quả Round 1 của nó là…', ['Failed', 'Pending', 'N/A', 'Passed'], 1),
      q('A feature sheet has 6 test cases and 2 group-header rows below row 11. What does the template\'s COUNTA(A12:A1000) show?|||Một sheet có 6 test case và 2 dòng tiêu đề nhóm dưới dòng 11. COUNTA(A12:A1000) của template hiện bao nhiêu?', ['6', '7', '8', '2'], 2),
      q('In the shipped template, what is wrong with the Round 2 and Round 3 counters?|||Trong template gốc, bộ đếm Round 2 và Round 3 sai ở đâu?', ['They count the Round 1 column again|||Chúng đếm lại cột Round 1', 'They count only Passed|||Chúng chỉ đếm Passed', 'They are hard-coded numbers|||Chúng là số gõ cứng', 'Nothing is wrong|||Không có gì sai'], 0),
      q('The sample unit-test report shows 55 test cases in total although it contains 262. Why?|||Báo cáo unit test mẫu hiện tổng 55 case dù có 262. Vì sao?', ['55 cases failed|||55 case bị fail', 'The Sub total formula SUM(C10:C15) only covers the first four methods|||Công thức Sub total SUM(C10:C15) chỉ phủ bốn method đầu', 'Only boundary cases are counted|||Chỉ đếm case boundary', 'Pending cases are excluded|||Case pending bị loại'], 1),
      q('Which expected result is written well?|||Kết quả mong đợi nào được viết tốt?', ['Verify login works|||Kiểm tra đăng nhập chạy', 'System works correctly|||Hệ thống chạy đúng', 'Message "Invalid email or password" is shown and failed_attempts becomes 1|||Hiện thông báo "Invalid email or password" và failed_attempts thành 1', 'Test passes|||Test pass'], 2),
      q('"Password must be ≥ 8 characters." Which pair of new passwords applies BVA correctly?|||"Mật khẩu phải ≥ 8 ký tự." Cặp mật khẩu mới nào áp dụng BVA đúng?', ['6 and 10 characters|||6 và 10 ký tự', '7 and 8 characters|||7 và 8 ký tự', '8 and 9 characters|||8 và 9 ký tự', '0 and 100 characters|||0 và 100 ký tự'], 1),
      q('Which case belongs in the System Test report rather than the Integration Test report?|||Case nào thuộc báo cáo System Test hơn là Integration Test?', ['The change-password API rejects a wrong old password and the DB hash is unchanged|||API đổi mật khẩu từ chối mật khẩu cũ sai và hash trong DB không đổi', 'A user changes the password on one device, is logged out on another, logs in again and receives a notification e-mail|||Người dùng đổi mật khẩu trên một thiết bị, bị đăng xuất ở thiết bị khác, đăng nhập lại và nhận e-mail thông báo', 'The login form sends no request when fields are empty|||Form đăng nhập không gửi request khi để trống', 'validateNewPassword("Pass12a") returns false|||validateNewPassword("Pass12a") trả về false'], 1),
    ],
  },
};

export default {
  title: 'Lab 3 — Integration & system test reports|||Lab 3 — Báo cáo integration test & system test',
  description: 'Lab 3: bộ template Report5 (Unit / Integration / System) giải thích từng sheet, từng cột, từng công thức và 4 lỗi công thức có sẵn; ví dụ điền trọn sheet Login + Change password có số liệu tính thật; phân tích file mẫu SEP490 và checklist nộp bài.',
  lessons: [L1, L2, L3, QUIZL3],
};
