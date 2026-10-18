/**
 * SWT301 · Lab 2 — phần "dự án làm thật": LabFlow Demo + Report 5.1 (bài L2.10–L2.15, mỗi bài một video).
 *
 * Nguồn (đều là dữ liệu thật, không minh hoạ):
 *   - repo công khai cuonghoang1103/LabFlow-AI-demo, nhánh lab2-unit-test (Spring Boot 3.5, Java 21, JUnit 5 + Mockito + AssertJ):
 *     README, docs/erd.md, docs/lab2/function-list.md, AuthService.login (dòng 143–178), AuthServiceLoginTest.
 *   - CT Work project swt301/LAB (Docs 1–16) và swt301/LFD — chỉ đọc; thành viên chỉ gọi "Thành viên 1…5".
 *   - kịch bản video ~/Documents/video-bai-giang/src/bai/swt-l2-{1,1b,2,3,4,5}/kichban.ts + khung/swt/that-mvn.json (output mvnw thật).
 *   - tệp xuất thật LFD_Report5.1_Unit_Test_Report.xlsx (28 sheet) — bản công bố đã thay tên người tạo bằng "Thành viên 1".
 * Mọi đoạn Java trong bài đã chạy thật 18/10/2026 trên nhánh lab2-unit-test (JDK 21.0.9):
 *   UTCID01–07 ⇒ "Tests run: 7, Failures: 0, Errors: 0".
 * Tệp tải: files/academy/SWT301/v2/… (v1 cùng nội dung nhưng CDN đã cache một 404 lúc dò trước khi tải lên — đừng dùng v1).
 * Video: gắn qua content/course-videos/software-testing.mjs (khối "Lab 2 · LabFlow" — điền 6 URL R2 sau khi tải lên).
 */
import { bi, ansEn, ansVi } from './_slides.mjs';

const REPO = 'https://github.com/cuonghoang1103/LabFlow-AI-demo';
const BR = `${REPO}/tree/lab2-unit-test`;
const BLOB = `${REPO}/blob/lab2-unit-test`;
const SRC = `${BLOB}/backend/src/main/java/vn/swt301/labflowdemo`;
const TEST = `${BLOB}/backend/src/test/java/vn/swt301/labflowdemo`;
const TEST_DIR = `${REPO}/tree/lab2-unit-test/backend/src/test/java/vn/swt301/labflowdemo`;
const FN_LIST = `${BLOB}/docs/lab2/function-list.md`;
const XLSX = 'https://media.cuongthai.com/files/academy/SWT301/v2/LFD_Report5.1_Unit_Test_Report.xlsx';
/* Link CT Work công khai, chỉ đọc (project swt301/LAB: board, backlog, reports, tests + Report 5.1). Gỡ link = để chuỗi rỗng. */
const CTW_PUBLIC = 'https://cuongthai.com/work/share/Bh3PNvh6vwphvbXBVXPRrtHfIJAWJwgE';

const card = (href, ico, title, sub, cta) => `<a class="link-card" href="${href}" target="_blank" rel="noopener">
  <span class="lc-ico">${ico}</span>
  <span class="lc-body"><span class="lc-title">${title}</span><span class="lc-sub">${sub}</span></span>
  <span class="lc-cta">${cta}</span>
</a>`;
const inner = (slug, ico, title, sub, cta) => `<a class="link-card exphub" href="/courses/software-testing/learn?lessonSlug=${slug}">
  <span class="lc-ico">${ico}</span>
  <span class="lc-body"><span class="lc-title">${title}</span><span class="lc-sub">${sub}</span></span>
  <span class="lc-cta">${cta}</span>
</a>`;
const ctwEn = () => CTW_PUBLIC
  ? card(CTW_PUBLIC, '👀', 'The real project on CT Work (read-only, no account needed)', 'Board, backlog, reports and the Report 5.1 test matrices of the sample group', 'OPEN →')
  : '<p class="ghi-chu">A read-only public link to the sample CT Work project will be added here.</p>';
const ctwVi = () => CTW_PUBLIC
  ? card(CTW_PUBLIC, '👀', 'Dự án thật trên CT Work (chỉ xem, không cần tài khoản)', 'Board, backlog, báo cáo và ma trận Report 5.1 của nhóm mẫu', 'MỞ →')
  : '<p class="ghi-chu">Link xem công khai (chỉ đọc) dự án mẫu trên CT Work sẽ được bổ sung tại đây.</p>';
const vidEn = (n) => `<p class="ghi-chu">🎬 Video ${n} of the 6-part series "Lab 2 on LabFlow Demo" is in the player above (Vietnamese voice). This page is the written lecture: read it after the video, or instead of it.</p>`;
const vidVi = (n) => `<p class="ghi-chu">🎬 Video ${n}/6 của loạt "Lab 2 trên LabFlow Demo" nằm ở khung phát phía trên. Trang này là bài giảng viết đầy đủ: đọc sau khi xem, hoặc đọc thay video.</p>`;

/* ═══════════════════════ L2.10 — Nghiệp vụ & dữ liệu ═══════════════════════ */
const L210 = {
  title: 'L2.10 — Worked project (1): LabFlow Demo — the business story and the data|||L2.10 — Dự án làm thật (1): LabFlow Demo — nghiệp vụ & dữ liệu',
  slug: 'swt301-lab2-labflow-nghiep-vu',
  type: 'DOCUMENT',
  description: 'Bắt đầu phần làm thật của Lab 2: hiểu dự án LabFlow Demo trước khi test — 5 vai người dùng, hành trình đặt phòng lab của sinh viên, các luật nghiệp vụ BR-01…BR-14, ERD 5 cụm bảng và hàm của từng thành viên nằm ở đâu trong câu chuyện.',
  content: [
    bi(`<span class="eyebrow">Lab 2 · Worked project · Part 1 of 6 · Video swt-l2-1</span>
<h2>Understand the project before you test it</h2>
<p class="lead">From here on, Lab 2 is done on a <strong>real Spring Boot project</strong>: <strong>LabFlow Demo</strong>, a system that manages university labs and equipment. Five members test 24 service methods and hand in one <strong>Report 5.1</strong>. This first part answers the question every teammate asks first: <em>what does this software do?</em></p>
${vidEn(1)}
<p class="y-chinh">🎯 If you do not know whom a function serves, you cannot know which result is the correct one to check. Business rules are the oracle of a unit test.</p>
<h3>The four questions of the first team meeting</h3>
<div class="lz-flow"><span>1 · What is this project?</span><span>2 · Where is my function?</span><span>3 · Which command runs the tests?</span><span>4 · What do we hand in?</span></div>
<p>Part 1 (this lesson) answers question 1. Part 2 answers questions 2 and 3. Question 4 is lessons L2.12 and L2.15. Prerequisites: basic Java and basic Git.</p>
<h3>Five roles</h3>
<div class="table-wrap"><table>
<thead><tr><th>Role (RoleCode)</th><th>What they do</th><th>Demo account</th></tr></thead>
<tbody>
<tr><td><strong>STUDENT</strong></td><td>Registers with the university email, books labs for study and projects</td><td>student1@fpt.edu.vn</td></tr>
<tr><td><strong>LECTURER</strong></td><td>Books labs for teaching sessions</td><td>lecturer@fe.edu.vn</td></tr>
<tr><td><strong>STAFF</strong> (lab staff)</td><td>Updates equipment status, e.g. sends a machine to maintenance</td><td>staff@fpt.edu.vn</td></tr>
<tr><td><strong>MANAGER</strong> (lab manager)</td><td>Creates buildings, labs, equipment, opening hours and blackouts; approves bookings</td><td>manager@fpt.edu.vn</td></tr>
<tr><td><strong>ADMIN</strong></td><td>Manages accounts, roles and the numbers of the business rules (Settings)</td><td>admin@fpt.edu.vn</td></tr>
</tbody>
</table></div>
<p>An anonymous visitor can only register, verify the email and reset a forgotten password. Every demo account uses the password <code>Labflow123</code> (README of the repo).</p>
<h3>A student's journey, step by step</h3>
<ol>
<li><strong>Register</strong> → the account is <code>PENDING</code> and a verification link is sent.</li>
<li><strong>Verify</strong> the email → the account becomes <code>ACTIVE</code>.</li>
<li><strong>Log in</strong> → an access token valid for 15 minutes plus a refresh token.</li>
<li><strong>Browse</strong> buildings, labs and equipment; filter by capacity.</li>
<li><strong>Check</strong> opening hours and blackouts (holidays, maintenance).</li>
<li><strong>Book</strong> → a small lab is <code>CONFIRMED</code> at once, a large lab waits as <code>PENDING</code>; an overlapping slot is rejected.</li>
</ol>
<p>Behind the scenes the manager must have prepared the buildings, labs, equipment and hours — otherwise there is nothing to book.</p>
<h3>Business rules: exactly what you will test</h3>
<div class="table-wrap"><table>
<thead><tr><th>Rule</th><th>Statement</th><th>Typical boundary</th></tr></thead>
<tbody>
<tr><td>BR-01</td><td>Only university email domains may register</td><td>fpt.edu.vn / fe.edu.vn vs anything else</td></tr>
<tr><td>BR-02</td><td>5 wrong passwords in a row lock the account for 15 minutes</td><td>4th failure vs 5th failure</td></tr>
<tr><td>BR-03</td><td>Verification and reset links are one-time and expire</td><td>expiresAt exactly now</td></tr>
<tr><td>BR-04</td><td>Bookings sit on a 30-minute grid inside opening hours</td><td>07:00 start, 21:00 end</td></tr>
<tr><td>BR-05</td><td>At most 14 days in advance</td><td>exactly 14 days is still valid</td></tr>
<tr><td>BR-06</td><td>A lab with more than 30 seats needs approval</td><td>30 vs 31 seats</td></tr>
<tr><td>BR-11</td><td>Equipment can be booked only when available; RETIRED is final</td><td>reason 255 vs 256 characters</td></tr>
<tr><td>BR-14</td><td>The audit log is append-only</td><td>—</td></tr>
</tbody>
</table></div>
<div class="pitfall co-tieu-de"><strong>Test against the rules, not against the code.</strong> If you read the code first and copy what it does into the expected results, every test passes and no defect can ever be found. Write the Confirmation from the business rules and the requirements; the code is only where you look for branches and boundaries.</div>
<p class="meo">🧠 The numbers (5 attempts, 30 seats, 14 days) live in the <code>Settings</code> table and the admin can change them. In tests they come from a mocked <code>SettingsService</code> — and they are exactly where boundary (B) cases come from (lesson L2.12).</p>
<h3>The data model (ERD) in five clusters</h3>
<div class="table-wrap"><table>
<thead><tr><th>Cluster</th><th>Main tables</th><th>What matters for testing</th></tr></thead>
<tbody>
<tr><td>Users</td><td>users, roles, user_tokens</td><td>status, failed_logins, locked_until; tokens are stored only as hashes</td></tr>
<tr><td>Facilities</td><td>campus → buildings → labs → equipment</td><td>lab capacity, requires_approval, a <strong>version</strong> number against lost updates</td></tr>
<tr><td>Calendar</td><td>operating hours (per weekday), blackouts, holidays</td><td>a lab's own hours override the default</td></tr>
<tr><td>Reservations</td><td>reservations → items (a lab or a unit in a time range)</td><td>an idempotency key against double submits</td></tr>
<tr><td>System</td><td>app settings, audit log</td><td>rule numbers; append-only log</td></tr>
</tbody>
</table></div>
<p>Seed data (Flyway V7): 2 buildings, 4 labs — <strong>AL-301 has exactly 30 seats</strong> (the BR-06 boundary), <strong>BE-201 has 60</strong> (needs approval), <strong>BE-105 is closed</strong> — 8 units of equipment, hours Mon–Sat 07:00–21:00.</p>
<h3>Where each member's functions sit in the story</h3>
<div class="table-wrap"><table>
<thead><tr><th>Member</th><th>Part of the journey</th></tr></thead>
<tbody>
<tr><td>Member 1 (team lead)</td><td>The entrance: register, verify email, log in, change password, log out</td></tr>
<tr><td>Member 2</td><td>Sessions and policy: refresh token, forgot / reset password, edit a Settings number, the booking-period rule</td></tr>
<tr><td>Member 3</td><td>Accounts: admin creates, edits, locks and unlocks users; profile; create a building</td></tr>
<tr><td>Member 4</td><td>The lab manager: create and edit labs, add equipment, change equipment status</td></tr>
<tr><td>Member 5</td><td>The end of the journey: opening hours, blackouts, "is the lab open?", create a reservation</td></tr>
</tbody>
</table></div>
<h3>Practice</h3>
<ol>
<li>Read the "demo accounts" part of the README and <code>docs/erd.md</code>.</li>
<li>A student books <strong>BE-201</strong> for 09:00 next Tuesday. Which rules does the booking pass through, and what status does it get?</li>
<li>At which step of the journey are your own functions?</li>
</ol>
${ansEn('BE-201', 'The slot must be on the 30-minute grid and inside opening hours (BR-04), at most 14 days ahead (BR-05), the lab must be ACTIVE and the slot must not overlap another booking. Because BE-201 has 60 seats (&gt; 30, BR-06) the booking is created as <code>PENDING</code>, waiting for the manager.')}
<div class="callout co-tieu-de"><strong>Links for this part.</strong></div>
${card(BR, '📦', 'Repository LabFlow-AI-demo — branch lab2-unit-test', 'Public: clone without logging in · README (demo accounts) · docs/erd.md', 'GITHUB →')}
${card(`${BLOB}/docs/erd.md`, '🗺️', 'docs/erd.md — the ERD of Flyway V1…V7', 'Five clusters of tables, read before writing any Precondition', 'OPEN →')}
${ctwEn()}`,

`<span class="eyebrow">Lab 2 · Dự án làm thật · Phần 1/6 · Video swt-l2-1</span>
<h2>Hiểu dự án trước khi test</h2>
<p class="lead">Từ bài này, Lab 2 được làm trên một <strong>dự án Spring Boot có thật</strong>: <strong>LabFlow Demo</strong> — hệ thống quản lý phòng lab và thiết bị của một trường đại học. Năm thành viên test 24 hàm service và nộp chung một <strong>Report 5.1</strong>. Phần đầu này trả lời câu đầu tiên mà bạn nào trong nhóm cũng hỏi: <em>phần mềm này làm gì?</em></p>
${vidVi(1)}
<p class="y-chinh">🎯 Không hiểu một hàm phục vụ ai thì bạn không biết kết quả nào mới là kết quả đúng để kiểm. Luật nghiệp vụ chính là "đáp án" (test oracle — nguồn cho biết kết quả mong đợi) của unit test.</p>
<h3>Bốn câu hỏi của buổi họp nhóm đầu tiên</h3>
<div class="lz-flow"><span>1 · Dự án này là gì?</span><span>2 · Hàm của mình ở đâu?</span><span>3 · Chạy test bằng lệnh nào?</span><span>4 · Test xong nộp gì?</span></div>
<p>Phần 1 (bài này) trả lời câu 1. Phần 2 trả lời câu 2 và 3. Câu 4 nằm ở bài L2.12 và L2.15. Cần biết trước: Java cơ bản và Git cơ bản (chưa vững Git thì xem khoá Git trên cuongthai.com trước).</p>
<h3>Năm vai người dùng</h3>
<div class="table-wrap"><table>
<thead><tr><th>Vai (RoleCode)</th><th>Làm gì</th><th>Tài khoản demo</th></tr></thead>
<tbody>
<tr><td><strong>STUDENT</strong> — sinh viên</td><td>Đăng ký bằng email trường, đặt phòng lab để học và làm đồ án</td><td>student1@fpt.edu.vn</td></tr>
<tr><td><strong>LECTURER</strong> — giảng viên</td><td>Đặt phòng cho buổi dạy</td><td>lecturer@fe.edu.vn</td></tr>
<tr><td><strong>STAFF</strong> — nhân viên lab</td><td>Cập nhật trạng thái thiết bị, ví dụ đưa máy đi bảo trì</td><td>staff@fpt.edu.vn</td></tr>
<tr><td><strong>MANAGER</strong> — quản lý lab</td><td>Tạo toà nhà, phòng, thiết bị, giờ mở cửa, khoảng đóng cửa; duyệt lượt đặt</td><td>manager@fpt.edu.vn</td></tr>
<tr><td><strong>ADMIN</strong> — quản trị viên</td><td>Quản lý tài khoản, vai trò và các con số của luật nghiệp vụ (Settings)</td><td>admin@fpt.edu.vn</td></tr>
</tbody>
</table></div>
<p>Người chưa đăng nhập chỉ được đăng ký, xác minh email và lấy lại mật khẩu. Mọi tài khoản demo đều có mật khẩu <code>Labflow123</code> (README của repo).</p>
<h3>Hành trình của một sinh viên, từng bước</h3>
<ol>
<li><strong>Đăng ký</strong> → tài khoản ở trạng thái chờ <code>PENDING</code>, hệ thống gửi link xác minh.</li>
<li><strong>Bấm link xác minh</strong> → tài khoản chuyển sang <code>ACTIVE</code> (đang hoạt động).</li>
<li><strong>Đăng nhập</strong> → nhận access token (token truy cập) sống 15 phút và một refresh token (token làm mới phiên).</li>
<li><strong>Xem</strong> toà nhà, phòng lab, thiết bị; lọc theo sức chứa.</li>
<li><strong>Xem</strong> giờ mở cửa và các khoảng phòng bị đóng (blackout — ngày lễ, lịch bảo trì).</li>
<li><strong>Đặt phòng</strong> → phòng nhỏ được <code>CONFIRMED</code> ngay, phòng lớn chờ duyệt <code>PENDING</code>; khung giờ đã có người đặt thì bị từ chối.</li>
</ol>
<p>Phía sau hậu trường, quản lý lab phải dựng sẵn toà, phòng, thiết bị và giờ mở cửa thì sinh viên mới có cái để đặt.</p>
<h3>Luật nghiệp vụ (BR — business rule): đúng thứ bạn sẽ test</h3>
<div class="table-wrap"><table>
<thead><tr><th>Luật</th><th>Nội dung</th><th>Biên hay gặp</th></tr></thead>
<tbody>
<tr><td>BR-01</td><td>Chỉ email tên miền của trường mới được đăng ký</td><td>fpt.edu.vn / fe.edu.vn so với tên miền khác</td></tr>
<tr><td>BR-02</td><td>Sai mật khẩu 5 lần liên tiếp ⇒ khoá tài khoản 15 phút</td><td>lần sai thứ 4 so với lần thứ 5</td></tr>
<tr><td>BR-03</td><td>Link xác minh và link đặt lại mật khẩu chỉ dùng một lần, có hạn</td><td>expiresAt đúng bằng bây giờ</td></tr>
<tr><td>BR-04</td><td>Giờ đặt tròn mỗi 30 phút và nằm trong giờ mở cửa</td><td>bắt đầu 07:00, kết thúc 21:00</td></tr>
<tr><td>BR-05</td><td>Chỉ đặt trước tối đa 14 ngày</td><td>đúng 14 ngày vẫn hợp lệ</td></tr>
<tr><td>BR-06</td><td>Phòng trên 30 chỗ ⇒ mỗi lượt đặt phải chờ duyệt</td><td>30 chỗ so với 31 chỗ</td></tr>
<tr><td>BR-11</td><td>Thiết bị chỉ đặt được khi sẵn sàng; RETIRED (đã thanh lý) là trạng thái cuối</td><td>lý do dài 255 so với 256 ký tự</td></tr>
<tr><td>BR-14</td><td>Nhật ký thao tác (audit log) chỉ được thêm, không sửa, không xoá</td><td>—</td></tr>
</tbody>
</table></div>
<div class="pitfall co-tieu-de"><strong>Test theo luật, đừng test theo code.</strong> Đọc code trước rồi chép việc code đang làm vào kết quả mong đợi thì test nào cũng xanh và không bao giờ tìm ra lỗi. Viết Confirmation từ luật nghiệp vụ và yêu cầu; code chỉ là nơi bạn đi tìm nhánh và biên.</div>
<p class="meo">🧠 Các con số (5 lần, 30 chỗ, 14 ngày) nằm trong bảng <code>Settings</code>, quản trị viên sửa được. Trong unit test chúng đến từ <code>SettingsService</code> đã được giả lập (mock), và chúng chính là nơi sinh ra các case biên B (bài L2.12).</p>
<h3>Mô hình dữ liệu (ERD — sơ đồ thực thể quan hệ): năm cụm bảng</h3>
<div class="table-wrap"><table>
<thead><tr><th>Cụm</th><th>Bảng chính</th><th>Điều quan trọng khi test</th></tr></thead>
<tbody>
<tr><td>Người dùng</td><td>users, roles, user_tokens</td><td>status, failed_logins (số lần sai), locked_until (khoá tới lúc nào); token chỉ lưu bản băm, không lưu token thật</td></tr>
<tr><td>Cơ sở vật chất</td><td>campus → buildings → labs → equipment</td><td>sức chứa, cờ requires_approval, số <strong>version</strong> chống hai người sửa đè nhau</td></tr>
<tr><td>Lịch</td><td>giờ mở cửa theo thứ, blackout, ngày lễ</td><td>giờ riêng của một phòng ghi đè giờ chung</td></tr>
<tr><td>Đặt chỗ</td><td>reservations → items (một phòng hoặc một thiết bị trong một khoảng giờ)</td><td>khoá chống gửi trùng (idempotency key)</td></tr>
<tr><td>Hệ thống</td><td>app settings, audit log</td><td>con số của luật; nhật ký chỉ thêm</td></tr>
</tbody>
</table></div>
<p>Dữ liệu mẫu (Flyway V7): 2 toà, 4 phòng — <strong>AL-301 đúng 30 chỗ</strong> (đúng biên BR-06), <strong>BE-201 có 60 chỗ</strong> (cần duyệt), <strong>BE-105 đã đóng</strong> — 8 thiết bị, giờ mở T2–T7 07:00–21:00, Chủ nhật đóng.</p>
<h3>Hàm của từng thành viên nằm ở đâu trong câu chuyện</h3>
<div class="table-wrap"><table>
<thead><tr><th>Thành viên</th><th>Khúc nào của hành trình</th></tr></thead>
<tbody>
<tr><td>Thành viên 1 (nhóm trưởng)</td><td>Cửa vào: đăng ký, xác minh email, đăng nhập, đổi mật khẩu, đăng xuất</td></tr>
<tr><td>Thành viên 2</td><td>Phiên và chính sách: làm mới token, quên / đặt lại mật khẩu, sửa con số Settings, luật khoảng giờ đặt</td></tr>
<tr><td>Thành viên 3</td><td>Tài khoản: admin tạo, sửa, khoá, mở khoá; tự sửa hồ sơ; tạo toà nhà</td></tr>
<tr><td>Thành viên 4</td><td>Quản lý lab: tạo và sửa phòng, thêm thiết bị, đổi trạng thái thiết bị</td></tr>
<tr><td>Thành viên 5</td><td>Cuối hành trình: giờ mở cửa, khoảng đóng cửa, "phòng có mở không?", tạo lượt đặt</td></tr>
</tbody>
</table></div>
<p>Mỗi người test một khúc của <strong>cùng một câu chuyện</strong>. Nhóm trưởng hiểu cả câu chuyện thì mới giảng lại được cho cả nhóm.</p>
<h3>Thực hành</h3>
<ol>
<li>Đọc mục "Tài khoản demo" trong README và tệp <code>docs/erd.md</code>.</li>
<li>Một sinh viên muốn đặt phòng <strong>BE-201</strong> lúc 9 giờ sáng thứ Ba tuần sau. Lượt đặt đi qua những luật nào, và ra trạng thái gì?</li>
<li>Hàm của bạn nằm ở bước nào trong hành trình?</li>
</ol>
${ansVi('BE-201', 'Giờ phải tròn 30 phút và nằm trong giờ mở cửa (BR-04), không quá 14 ngày (BR-05), phòng đang hoạt động, không trùng giờ với lượt khác. Vì phòng có 60 chỗ (&gt; 30, BR-06) nên lượt đặt được tạo ở trạng thái <code>PENDING</code>, chờ quản lý duyệt.')}
<div class="callout co-tieu-de"><strong>Liên kết của phần này.</strong></div>
${card(BR, '📦', 'Repo LabFlow-AI-demo — nhánh lab2-unit-test', 'Công khai: clone thẳng, không cần đăng nhập · README (tài khoản demo) · docs/erd.md', 'GITHUB →')}
${card(`${BLOB}/docs/erd.md`, '🗺️', 'docs/erd.md — ERD theo Flyway V1…V7', 'Năm cụm bảng, đọc trước khi viết bất kỳ Precondition nào', 'MỞ →')}
${ctwVi()}`),
  ].join('\n'),
};

/* ═══════════════════════ L2.11 — Bên trong code, chạy app & mvnw test ═══════════════════════ */
const L211 = {
  title: 'L2.11 — Worked project (2): inside the code, running the app and mvnw test|||L2.11 — Dự án làm thật (2): bên trong code, chạy app & mvnw test',
  slug: 'swt301-lab2-labflow-chay-app-test',
  type: 'DOCUMENT',
  description: 'Mở code LabFlow Demo: 10 gói, kiến trúc controller → service → repository, vì sao Lab 2 test tầng service; chạy app bằng profile H2 và gọi API thật (CONFIRMED, RES_CONFLICT, PENDING); 24 hàm của nhóm; clone, chuyển nhánh lab2-unit-test và chạy mvnw test trên Windows và Mac.',
  content: [
    bi(`<span class="eyebrow">Lab 2 · Worked project · Part 2 of 6 · Video swt-l2-1b</span>
<h2>Open the lid: where the code is, and how to run it</h2>
<p class="lead">Part 1 told the business story. Part 2 opens the code: which package holds what, which layers a request goes through, then we run the real app and the real tests on a laptop.</p>
${vidEn(2)}
<h3>Ten packages, one area each</h3>
<p>All Java code is in <code>backend/</code>, root package <code>vn.swt301.labflowdemo</code>.</p>
<div class="table-wrap"><table>
<thead><tr><th>Package</th><th>Responsibility</th><th>In Lab 2</th></tr></thead>
<tbody>
<tr><td><code>auth</code></td><td>register, login, passwords, tokens</td><td>Members 1–2</td></tr>
<tr><td><code>user</code></td><td>accounts and profiles</td><td>Member 3</td></tr>
<tr><td><code>catalog</code></td><td>buildings, labs, equipment, calendar, booking policy</td><td>Members 2–5</td></tr>
<tr><td><code>reservation</code></td><td>bookings</td><td>Member 5</td></tr>
<tr><td><code>settings</code></td><td>the numbers of the business rules</td><td>Member 2</td></tr>
<tr><td><code>availability</code>, <code>audit</code>, <code>notification</code>, <code>security</code>, <code>common</code></td><td>support code</td><td>mocked in tests</td></tr>
</tbody>
</table></div>
<h3>Three layers: controller → service → repository</h3>
<div class="lz-flow"><span>Controller — the reception desk: receives the HTTP request</span><span>Service — the business rules: check password, count failures, lock or not</span><span>Repository — reads and writes the database</span></div>
<p>Follow one login: <code>AuthController</code> receives the request and calls <code>AuthService.login</code>, which calls <code>UserRepository.findByEmailIgnoreCase</code>. The result travels back up: the service returns a <code>TokenResponse</code>, the controller wraps it into the HTTP response.</p>
<p class="y-chinh">🎯 Lab 2 tests the <strong>middle layer</strong>, the service, because every business rule lives there. Everything around it (repositories, encoder, token service, audit) is replaced by stand-ins called <strong>mocks</strong> — lesson L2.13 does it step by step.</p>
<h3>Run the real app (H2 in memory, no Docker)</h3>
<pre><code class="language-bash">cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=h2      # Windows: .\\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=h2"
# check:   http://localhost:8080/api/v1/ping
# Swagger: http://localhost:8080/swagger-ui.html</code></pre>
<p>Real responses recorded for the video (log in as <code>student1@fpt.edu.vn</code> / <code>Labflow123</code>):</p>
<div class="table-wrap"><table>
<thead><tr><th>Call</th><th>Real result</th><th>Rule</th></tr></thead>
<tbody>
<tr><td>POST /auth/login</td><td><code>tokenType "Bearer"</code>, <code>expiresIn 900</code>, <code>roles ["STUDENT"]</code></td><td>15-minute access token</td></tr>
<tr><td>GET /labs</td><td>AL-301 30 seats · AL-302 25 · BE-105 CLOSED · BE-201 60, <code>requiresApproval true</code></td><td>BR-06</td></tr>
<tr><td>Book AL-301, Tue 09:00–10:00</td><td><code>status "CONFIRMED"</code></td><td>30 seats ⇒ no approval</td></tr>
<tr><td>Book AL-301 again, overlapping 30 min</td><td><code>"code": "RES_CONFLICT"</code>, "This slot is already booked"</td><td>no double booking</td></tr>
<tr><td>Book BE-201</td><td><code>status "PENDING"</code></td><td>BR-06: &gt; 30 seats</td></tr>
</tbody>
</table></div>
<h3>The 24 service methods of the group</h3>
<div class="table-wrap"><table>
<thead><tr><th>Class</th><th>Methods</th><th>File</th></tr></thead>
<tbody>
<tr><td>AuthService</td><td>8 — login, register, verifyEmail, changePassword, logout, refresh, forgotPassword, resetPassword</td><td><a href="${SRC}/auth/AuthService.java" target="_blank" rel="noopener">auth/AuthService.java</a></td></tr>
<tr><td>UserService</td><td>4 — createUser, updateUser, changeStatus, updateProfile</td><td><a href="${SRC}/user/UserService.java" target="_blank" rel="noopener">user/UserService.java</a></td></tr>
<tr><td>LabService</td><td>3 — createBuilding, createLab, updateLab</td><td><a href="${SRC}/catalog/LabService.java" target="_blank" rel="noopener">catalog/LabService.java</a></td></tr>
<tr><td>EquipmentService</td><td>3 — createEquipment, changeStatus, bulkChangeStatus</td><td><a href="${SRC}/catalog/EquipmentService.java" target="_blank" rel="noopener">catalog/EquipmentService.java</a></td></tr>
<tr><td>CalendarService</td><td>3 — setOperatingHours, addBlackout, checkLabOpen</td><td><a href="${SRC}/catalog/CalendarService.java" target="_blank" rel="noopener">catalog/CalendarService.java</a></td></tr>
<tr><td>ReservationService · SettingsService · BookingPolicy</td><td>1 each — createReservation, updateSetting, checkPeriod</td><td><a href="${SRC}/reservation/ReservationService.java" target="_blank" rel="noopener">reservation/</a> · <a href="${SRC}/settings/SettingsService.java" target="_blank" rel="noopener">settings/</a> · <a href="${SRC}/catalog/BookingPolicy.java" target="_blank" rel="noopener">catalog/BookingPolicy.java</a></td></tr>
</tbody>
</table></div>
<p>Together: <strong>540 lines of code</strong> ⇒ at least <strong>65 test cases</strong> at 100 TC/KLOC. Production code is in <code>src/main/java</code>; your test goes in <code>src/test/java</code>, <strong>in the same package</strong> as the class under test.</p>
<h3>Clone and run the tests the first time</h3>
<pre><code class="language-bash">git clone https://github.com/cuonghoang1103/LabFlow-AI-demo.git
cd LabFlow-AI-demo
git switch lab2-unit-test          # the branch the whole group merges into
java -version                      # must say 21
cd backend
./mvnw test                        # macOS / Linux
.\\mvnw.cmd test                    # Windows PowerShell (note the .\\ at the start)</code></pre>
<p>No Maven install is needed: the Maven Wrapper (<code>mvnw</code>) downloads everything on the first run (a few minutes). Lab 2 does not need Docker — only <code>mvnw verify</code> of Lab 3 does.</p>
<p class="nhan">Real output on the branch (before anyone added tests)</p>
<pre><code class="language-text">[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0 -- in vn.swt301.labflowdemo.LabflowDemoApplicationTests
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0 -- in vn.swt301.labflowdemo.auth.AuthServiceLoginTest
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS</code></pre>
<p>Five tests: one application start-up test and the four sample tests of <code>login</code>. The Mockito "self-attaching" and "dynamic agent" warnings above them are normal on JDK 21.</p>
<div class="pitfall co-tieu-de"><strong>Three classic first-run problems.</strong> <code>java -version</code> says 17 ⇒ set <code>JAVA_HOME</code> to JDK 21. Windows says "mvnw is not recognized" ⇒ you forgot <code>.\\</code>. You are on <code>main</code> instead of <code>lab2-unit-test</code> ⇒ your pull request will target the wrong branch.</div>
<h3>Practice (the whole group)</h3>
<ol>
<li>Clone, switch to <code>lab2-unit-test</code>, run <code>mvnw test</code> until BUILD SUCCESS, screenshot it for the group.</li>
<li>Run the app with profile <code>h2</code>, open Swagger, log in as student1 and book a lab.</li>
<li>Open IntelliJ and find the class holding your own function.</li>
</ol>
${ansEn('done', 'Everyone has a screenshot of 5 tests, 0 failures, and has seen one booking succeed with their own eyes.')}
${card(TEST_DIR, '🧪', 'The test folder on branch lab2-unit-test', 'auth/AuthServiceLoginTest.java is the sample every member copies', 'GITHUB →')}
${card(FN_LIST, '📋', 'docs/lab2/function-list.md — 24 functions, LOC, rules, exceptions', 'The map of which function is where, at which line, and what to test', 'OPEN →')}
${ctwEn()}`,

`<span class="eyebrow">Lab 2 · Dự án làm thật · Phần 2/6 · Video swt-l2-1b</span>
<h2>Mở nắp máy: code nằm ở đâu, chạy thế nào</h2>
<p class="lead">Phần 1 kể câu chuyện nghiệp vụ. Phần 2 mở code ra: gói nào chứa gì, một yêu cầu đi qua những tầng nào, rồi chạy app thật và chạy test thật ngay trên máy.</p>
${vidVi(2)}
<h3>Mười gói (package), mỗi gói một mảng</h3>
<p>Toàn bộ code Java nằm trong thư mục <code>backend/</code>, gói gốc <code>vn.swt301.labflowdemo</code>.</p>
<div class="table-wrap"><table>
<thead><tr><th>Gói</th><th>Lo việc gì</th><th>Trong Lab 2</th></tr></thead>
<tbody>
<tr><td><code>auth</code></td><td>đăng ký, đăng nhập, mật khẩu, token</td><td>Thành viên 1–2</td></tr>
<tr><td><code>user</code></td><td>tài khoản và hồ sơ</td><td>Thành viên 3</td></tr>
<tr><td><code>catalog</code></td><td>toà nhà, phòng lab, thiết bị, lịch, luật khoảng đặt</td><td>Thành viên 2–5</td></tr>
<tr><td><code>reservation</code></td><td>đặt phòng</td><td>Thành viên 5</td></tr>
<tr><td><code>settings</code></td><td>các con số của luật nghiệp vụ</td><td>Thành viên 2</td></tr>
<tr><td><code>availability</code>, <code>audit</code>, <code>notification</code>, <code>security</code>, <code>common</code></td><td>gói hỗ trợ</td><td>giả lập (mock) khi test</td></tr>
</tbody>
</table></div>
<h3>Ba tầng: controller → service → repository</h3>
<div class="lz-flow"><span>Controller — quầy lễ tân: nhận yêu cầu HTTP</span><span>Service — luật nghiệp vụ: kiểm mật khẩu, đếm số lần sai, có khoá hay không</span><span>Repository — đọc / ghi cơ sở dữ liệu</span></div>
<p>Theo chân một lần đăng nhập: <code>AuthController</code> nhận yêu cầu, gọi <code>AuthService.login</code>; hàm này gọi <code>UserRepository.findByEmailIgnoreCase</code> để tìm người dùng. Kết quả đi ngược lên: service trả <code>TokenResponse</code> cho controller, controller bọc lại thành phản hồi HTTP.</p>
<p class="y-chinh">🎯 Lab 2 test đúng <strong>tầng giữa</strong> — tầng service — vì toàn bộ luật nghiệp vụ nằm ở đó. Mọi thứ xung quanh (repository, bộ so mật khẩu, bộ cấp token, audit) được thay bằng "diễn viên đóng thế" gọi là <strong>mock</strong>; bài L2.13 làm thật từng bước.</p>
<h3>Chạy app thật (H2 trong bộ nhớ, không cần Docker)</h3>
<pre><code class="language-bash">cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=h2      # Windows: .\\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=h2"
# kiểm:    http://localhost:8080/api/v1/ping
# Swagger: http://localhost:8080/swagger-ui.html</code></pre>
<p>Kết quả thật ghi lại lúc quay video (đăng nhập <code>student1@fpt.edu.vn</code> / <code>Labflow123</code>):</p>
<div class="table-wrap"><table>
<thead><tr><th>Lời gọi</th><th>Kết quả thật</th><th>Luật</th></tr></thead>
<tbody>
<tr><td>POST /auth/login</td><td><code>tokenType "Bearer"</code>, <code>expiresIn 900</code>, <code>roles ["STUDENT"]</code></td><td>access token sống 15 phút</td></tr>
<tr><td>GET /labs</td><td>AL-301 30 chỗ · AL-302 25 · BE-105 CLOSED · BE-201 60, <code>requiresApproval true</code></td><td>BR-06</td></tr>
<tr><td>Đặt AL-301, thứ Ba 09:00–10:00</td><td><code>status "CONFIRMED"</code></td><td>30 chỗ ⇒ không cần duyệt</td></tr>
<tr><td>Đặt lại AL-301, chồng lên 30 phút</td><td><code>"code": "RES_CONFLICT"</code>, "This slot is already booked"</td><td>không đặt trùng giờ</td></tr>
<tr><td>Đặt BE-201</td><td><code>status "PENDING"</code></td><td>BR-06: trên 30 chỗ</td></tr>
</tbody>
</table></div>
<p>Muốn bấm thử mọi API mà không gõ lệnh: mở Swagger ở cổng 8080.</p>
<h3>24 hàm service của nhóm</h3>
<div class="table-wrap"><table>
<thead><tr><th>Lớp</th><th>Hàm</th><th>Tệp</th></tr></thead>
<tbody>
<tr><td>AuthService</td><td>8 — login, register, verifyEmail, changePassword, logout, refresh, forgotPassword, resetPassword</td><td><a href="${SRC}/auth/AuthService.java" target="_blank" rel="noopener">auth/AuthService.java</a></td></tr>
<tr><td>UserService</td><td>4 — createUser, updateUser, changeStatus, updateProfile</td><td><a href="${SRC}/user/UserService.java" target="_blank" rel="noopener">user/UserService.java</a></td></tr>
<tr><td>LabService</td><td>3 — createBuilding, createLab, updateLab</td><td><a href="${SRC}/catalog/LabService.java" target="_blank" rel="noopener">catalog/LabService.java</a></td></tr>
<tr><td>EquipmentService</td><td>3 — createEquipment, changeStatus, bulkChangeStatus</td><td><a href="${SRC}/catalog/EquipmentService.java" target="_blank" rel="noopener">catalog/EquipmentService.java</a></td></tr>
<tr><td>CalendarService</td><td>3 — setOperatingHours, addBlackout, checkLabOpen</td><td><a href="${SRC}/catalog/CalendarService.java" target="_blank" rel="noopener">catalog/CalendarService.java</a></td></tr>
<tr><td>ReservationService · SettingsService · BookingPolicy</td><td>mỗi lớp 1 — createReservation, updateSetting, checkPeriod</td><td><a href="${SRC}/reservation/ReservationService.java" target="_blank" rel="noopener">reservation/</a> · <a href="${SRC}/settings/SettingsService.java" target="_blank" rel="noopener">settings/</a> · <a href="${SRC}/catalog/BookingPolicy.java" target="_blank" rel="noopener">catalog/BookingPolicy.java</a></td></tr>
</tbody>
</table></div>
<p>Cả 24 hàm dài <strong>540 dòng code</strong> (LOC — lines of code) ⇒ theo chuẩn 100 TC/KLOC nhóm cần ít nhất <strong>65 test case</strong>. Code của hàm nằm trong <code>src/main/java</code>; test của bạn viết trong <code>src/test/java</code>, <strong>cùng gói</strong> với lớp được test.</p>
<h3>Clone và chạy test lần đầu (Windows + Mac)</h3>
<pre><code class="language-bash">git clone https://github.com/cuonghoang1103/LabFlow-AI-demo.git
cd LabFlow-AI-demo
git switch lab2-unit-test          # nhánh cả nhóm gộp bài test vào
java -version                      # phải thấy số 21
cd backend
./mvnw test                        # macOS / Linux
.\\mvnw.cmd test                    # Windows PowerShell (nhớ .\\ ở đầu)</code></pre>
<p>Không cần cài Maven: repo có sẵn Maven Wrapper (<code>mvnw</code>), lần chạy đầu tự tải mọi thứ, mất vài phút. Lab 2 không cần Docker — Docker chỉ dùng cho <code>mvnw verify</code> của Lab 3.</p>
<p class="nhan">Kết quả thật trên nhánh (lúc chưa ai thêm test)</p>
<pre><code class="language-text">[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0 -- in vn.swt301.labflowdemo.LabflowDemoApplicationTests
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0 -- in vn.swt301.labflowdemo.auth.AuthServiceLoginTest
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS</code></pre>
<p>Năm test: một test khởi động ứng dụng và bốn test mẫu của hàm <code>login</code>. Các dòng cảnh báo "Mockito is currently self-attaching" và "dynamic agent" phía trên là bình thường trên JDK 21, không phải lỗi.</p>
<div class="pitfall co-tieu-de"><strong>Ba lỗi kinh điển lần chạy đầu.</strong> <code>java -version</code> báo 17 ⇒ trỏ <code>JAVA_HOME</code> sang JDK 21. Windows báo "mvnw is not recognized" ⇒ quên <code>.\\</code> ở đầu. Đang đứng ở nhánh <code>main</code> thay vì <code>lab2-unit-test</code> ⇒ Pull Request sẽ nhắm sai nhánh.</div>
<h3>Thực hành (cả nhóm)</h3>
<ol>
<li>Clone, chuyển sang nhánh <code>lab2-unit-test</code>, chạy <code>mvnw test</code> tới khi thấy BUILD SUCCESS, chụp màn hình gửi nhóm.</li>
<li>Chạy app với profile <code>h2</code>, mở Swagger, đăng nhập student1 rồi thử đặt một phòng.</li>
<li>Mở IntelliJ, tìm lớp chứa hàm của chính bạn (bảng trên hoặc function-list.md).</li>
</ol>
${ansVi('đạt', 'Ai cũng có ảnh chụp 5 test chạy, 0 lỗi, và đã tận mắt thấy một lần đặt phòng thành công.')}
${card(TEST_DIR, '🧪', 'Thư mục test trên nhánh lab2-unit-test', 'auth/AuthServiceLoginTest.java là mẫu mọi thành viên chép theo', 'GITHUB →')}
${card(FN_LIST, '📋', 'docs/lab2/function-list.md — 24 hàm, LOC, luật, ngoại lệ', 'Bản đồ hàm nào ở tệp nào, dòng nào, cần test gì', 'MỞ →')}
${ctwVi()}`),
  ].join('\n'),
};

/* ═══════════════════════ L2.12 — Lab 2 & Report 5.1 từ A–Z ═══════════════════════ */
const L212 = {
  title: 'L2.12 — Worked project (3): Lab 2 and Report 5.1 from A to Z|||L2.12 — Dự án làm thật (3): Lab 2 & Report 5.1 từ A tới Z',
  slug: 'swt301-lab2-report51-a-z',
  type: 'DOCUMENT',
  description: 'Đọc Report 5.1 như đọc bản đồ: unit vs integration vs system, các sheet Guideline/Cover/Functions/Statistics và sheet từng hàm, Condition/Confirmation (Return + Exception + Log message), N/A/B, cột UTCID, chuẩn 100 TC/KLOC, lỗi có thật của tệp mẫu, và quyết định của nhóm: một workbook chung, mỗi người sở hữu sheet hàm của mình và tự trình bày, tự chạy test phần mình.',
  content: [
    bi(`<span class="eyebrow">Lab 2 · Worked project · Part 3 of 6 · Video swt-l2-2</span>
<h2>Read Report 5.1 like a map</h2>
<p class="lead">Tests that run green are only half of Lab 2. The other half is the <strong>Report 5.1 — Unit Test Report</strong> workbook, and that is where the lecturer's questions land: <em>"Why is this test case B and not N?"</em> — <em>"You wrote Failed here; what did you do about it?"</em></p>
${vidEn(3)}
<h3>Which level is Lab 2?</h3>
<div class="table-wrap"><table>
<thead><tr><th>Level</th><th>What is real</th><th>LabFlow example</th><th>Report · Lab</th></tr></thead>
<tbody>
<tr><td><strong>Unit</strong></td><td>One function; everything around it is mocked, no database</td><td>Does login lock on the 5th wrong password?</td><td>5.1 · <strong>Lab 2</strong></td></tr>
<tr><td>Integration</td><td>Several parts wired for real, real database</td><td>Two people book the same lab at the same time; only one row is written</td><td>5.2 · Lab 3</td></tr>
<tr><td>System</td><td>The whole system along a user flow</td><td>Register → verify → log in → book</td><td>5.3</td></tr>
</tbody>
</table></div>
<h3>The workbook, sheet by sheet</h3>
<div class="table-wrap"><table>
<thead><tr><th>Sheet</th><th>Content</th><th>Rule to remember</th></tr></thead>
<tbody>
<tr><td>Guideline</td><td>The official instructions of the template</td><td>Keep as is</td></tr>
<tr><td>Cover</td><td>Project name (LabFlow Demo), code (LFD), creator, version, <strong>Record of change</strong> (A = added, D = deleted, M = modified)</td><td>New functions ⇒ one more row here</td></tr>
<tr><td>Functions</td><td>Class, function, sheet name; "Normal number of Test cases/KLOC" = 100</td><td><strong>Clicking a function name must open its sheet</strong></td></tr>
<tr><td>Statistics</td><td>One row per function: Passed, Failed, Untested, N, A, B, and a <strong>Sub Total</strong></td><td>Check the Sub Total range when you add functions</td></tr>
<tr><td>One sheet per function</td><td>The UTCID matrix</td><td>Where you spend most of your time</td></tr>
</tbody>
</table></div>
<h3>One shared workbook or one file per person? — the decision</h3>
<div class="callout co-tieu-de"><strong>Decision of the group: ONE shared 5.1 workbook for the whole group.</strong>
<ul>
<li>Each member <strong>owns the function sheets of their own functions</strong>: <em>Created By</em> = who designed the cases, <em>Executed By</em> = who ran the tests.</li>
<li>The team lead maintains Cover, Functions and Statistics, merges, and exports <strong>one</strong> file to hand in.</li>
<li><strong>At the presentation each member presents their own part</strong>: the functions they tested, their matrix, and then <strong>opens their own test class in the project and runs it</strong> in front of the lecturer.</li>
</ul></div>
<p>This matches what the lecturer asked for the presentation: <strong>run the code (demo) + slides + show where in the project it was tested</strong>. So the grade covers three things at once: the 5.1 file, test code that really runs, and your understanding of your own part.</p>
<h3>Inside a function sheet: Condition and Confirmation</h3>
<p><strong>Condition</strong> (upper half) = <strong>Precondition</strong> (state that must exist before the call, e.g. "user ACTIVE, 4 failures so far") + one group per <strong>input</strong> with <strong>concrete values</strong> below it.</p>
<p class="pitfall co-tieu-de"><strong>Concrete, not generic.</strong> Not "a valid email" — write <code>"student1@fpt.edu.vn"</code>. Not "wrong password" — write <code>"wrong123"</code>. Not "nothing" — write <code>null</code>.</p>
<p><strong>Confirmation</strong> (lower half) = the expected result, in three parts, and the lecturer insists on <strong>all three</strong>:</p>
<div class="table-wrap"><table>
<thead><tr><th>Part</th><th>Meaning</th><th>login example</th></tr></thead>
<tbody>
<tr><td>Return</td><td>Returned value or state after the call</td><td>TokenResponse with tokenType "Bearer"; failedLogins = 4</td></tr>
<tr><td>Exception</td><td>The exception and its code</td><td>BusinessException(AUTH_INVALID_CREDENTIALS) – HTTP 401</td></tr>
<tr><td>Log message</td><td>The message that is logged / shown</td><td>"Invalid email or password"; WARN "Login locked after 5 failures: userId=5"</td></tr>
</tbody>
</table></div>
<h3>N · A · B, with the Guideline's example 5 ≤ x ≤ 10</h3>
<div class="table-wrap"><table>
<thead><tr><th>Type</th><th>Meaning</th><th>5 ≤ x ≤ 10</th><th>createLab: capacity 1–200</th></tr></thead>
<tbody>
<tr><td><strong>N</strong> Normal</td><td>Typical value well inside</td><td>6, 7, 8, 9</td><td>20</td></tr>
<tr><td><strong>B</strong> Boundary</td><td>Exactly on the edges, still valid</td><td>5, 10</td><td>1, 200</td></tr>
<tr><td><strong>A</strong> Abnormal</td><td>Outside, null, wrong type → usually the error branch</td><td>−1, 11, null, "a"</td><td>0, 201</td></tr>
</tbody>
</table></div>
<p class="meo">🧠 To find boundaries, look for every comparison operator in the code (<code>&gt;</code>, <code>&gt;=</code>, <code>isBefore</code>…). BR-06 "more than 30 seats needs approval" ⇒ 30 (no approval) and 31 (approval) are both B.</p>
<h3>The UTCID columns</h3>
<ul>
<li>Each column is one test case: UTCID01, UTCID02…</li>
<li>Mark <strong>O</strong> in the Condition rows used by that case and in its expected Confirmation rows. Hard rule: every column has at least one O in Condition <strong>and</strong> one O in Confirmation.</li>
<li>Bottom rows: <strong>Type</strong> (N/A/B), <strong>Passed/Failed</strong> (P/F after really running JUnit), <strong>Executed Date</strong>, <strong>Defect ID</strong> (only when F — the Bug card's key).</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Failed is normal; a broken test is not Failed.</strong> A test that finds a real defect is a good test — keep F and log a Bug; never change the expected result to match wrong code. But a red test caused by a compile error or a forgotten mock is a <em>badly written test</em>: fix the test and run again.</div>
<h3>How many test cases? 100 TC/KLOC</h3>
<p>About one test case per ten lines: minimum for a function = ⌈LOC / 10⌉. <code>login</code> has 35 LOC ⇒ at least 4 (the sample has 13). The group: 540 LOC ⇒ at least 65; target 6–10 per function. The <em>Lack of test cases</em> column shows what is missing; if a function stays below the norm, its creator writes the reason. Statistics also computes <em>Test coverage</em> (executed / total) and <em>Test successful coverage</em> (passed / total).</p>
<h3>Do not copy the template's bugs</h3>
<p>The sample workbook of an earlier group (opened cell by cell) contains real errors:</p>
<ul>
<li>The <code>forgotPassword</code> row links to a sheet named <code>fogotPassword</code> (missing "r") — the link goes nowhere; another row links to <code>null!A1</code>.</li>
<li>Sub Total of Failed and Untested sums only <code>E8:E40</code> while the table runs to row 73 — Failed is silently under-counted.</li>
</ul>
<p>Lesson: after renaming a sheet click every link; after adding a function re-check the sum ranges — or export from CT Work (lesson L2.15), where links and formulas are generated correctly.</p>
<h3>Practice</h3>
<p><code>createEquipment</code> requires a serial of 3–50 characters and has 14 LOC. (1) Classify lengths 2, 3, 10, 50, 51 as N/A/B. (2) Minimum number of test cases?</p>
${ansEn('10 = N; 3, 50 = B; 2, 51 = A', '⌈14 / 10⌉ = 2 — the five values above already give five cases, above the norm.')}
${ctwEn()}`,

`<span class="eyebrow">Lab 2 · Dự án làm thật · Phần 3/6 · Video swt-l2-2</span>
<h2>Đọc Report 5.1 như đọc bản đồ</h2>
<p class="lead">Test chạy xanh mới là một nửa Lab 2. Nửa còn lại là workbook <strong>Report 5.1 — Unit Test Report</strong>, và câu hỏi của cô rơi đúng vào đó: <em>"Vì sao test case này là B mà không phải N?"</em> — <em>"Chỗ này em ghi Failed, vậy em đã xử lý thế nào?"</em>. Những câu đó không hỏi về code; nhiều bạn không trả lời được dù test chạy xanh.</p>
${vidVi(3)}
<h3>Lab 2 là cấp kiểm thử nào?</h3>
<div class="table-wrap"><table>
<thead><tr><th>Cấp</th><th>Cái gì là thật</th><th>Ví dụ LabFlow</th><th>Báo cáo · Lab</th></tr></thead>
<tbody>
<tr><td><strong>Unit</strong> — kiểm thử đơn vị</td><td>Đúng một hàm; mọi thứ xung quanh giả lập, không cần cơ sở dữ liệu</td><td>login có khoá ở lần sai thứ 5 không?</td><td>5.1 · <strong>Lab 2</strong></td></tr>
<tr><td>Integration — kiểm thử tích hợp</td><td>Nhiều phần nối thật với nhau, có CSDL thật</td><td>Hai người đặt cùng phòng cùng giờ, chỉ một người được ghi</td><td>5.2 · Lab 3</td></tr>
<tr><td>System — kiểm thử hệ thống</td><td>Cả hệ thống theo đúng luồng người dùng</td><td>Đăng ký → xác minh → đăng nhập → đặt phòng</td><td>5.3</td></tr>
</tbody>
</table></div>
<p>Vậy Lab 2 chỉ làm một việc: unit test từng hàm, và chỉ nộp báo cáo 5.1.</p>
<h3>Workbook 5.1, từng sheet</h3>
<div class="table-wrap"><table>
<thead><tr><th>Sheet</th><th>Nội dung</th><th>Điều cần nhớ</th></tr></thead>
<tbody>
<tr><td>Guideline</td><td>Hướng dẫn chính thức của mẫu</td><td>Giữ nguyên, không sửa</td></tr>
<tr><td>Cover — trang bìa</td><td>Tên dự án (LabFlow Demo), mã dự án (LFD), người tạo, phiên bản, bảng <strong>Record of change</strong> (A = thêm, D = xoá, M = sửa)</td><td>Thêm hàm mới ⇒ thêm một dòng ở đây</td></tr>
<tr><td>Functions — danh sách hàm</td><td>Lớp, hàm, tên sheet; ô "Normal number of Test cases/KLOC" = 100</td><td><strong>Bấm vào tên hàm phải nhảy đúng tới sheet của hàm đó</strong></td></tr>
<tr><td>Statistics — thống kê</td><td>Mỗi hàm một dòng: Passed, Failed, Untested, N, A, B và dòng <strong>Sub Total</strong></td><td>Thêm hàm thì kiểm lại vùng cộng của Sub Total</td></tr>
<tr><td>Mỗi hàm một sheet</td><td>Ma trận UTCID</td><td>Chỗ bạn làm việc nhiều nhất</td></tr>
</tbody>
</table></div>
<h3>Một file chung hay mỗi người một file? — quyết định của nhóm</h3>
<div class="callout co-tieu-de"><strong>Nhóm đã chốt: MỘT workbook 5.1 chung cho cả nhóm.</strong>
<ul>
<li>Mỗi thành viên <strong>sở hữu các sheet hàm của chính mình</strong>: ô <em>Created By</em> ghi người thiết kế case, ô <em>Executed By</em> ghi người bấm chạy test.</li>
<li>Nhóm trưởng lo Cover, Functions và Statistics, gộp bài và xuất <strong>một file duy nhất</strong> để nộp.</li>
<li><strong>Lúc thuyết trình, mỗi người tự trình bày phần của mình</strong>: các hàm mình test, ma trận của mình, rồi <strong>mở lớp test của mình trong dự án và chạy</strong> cho cô xem.</li>
</ul></div>
<p>Điều này khớp với yêu cầu cô đưa ra cho buổi thuyết trình: <strong>có chạy code demo + có slide + chỉ ra chỗ đã test trong project</strong>. Nghĩa là cô chấm ba thứ cùng lúc: file 5.1, code test chạy thật, và việc bạn hiểu phần của mình.</p>
<h3>Bên trong sheet hàm: Condition và Confirmation</h3>
<p><strong>Condition</strong> (nửa trên, điều kiện đầu vào) = <strong>Precondition</strong> (trạng thái phải có sẵn trước khi gọi hàm, ví dụ "người dùng ACTIVE, đã sai 4 lần") + mỗi <strong>input</strong> một nhóm, dưới nhóm là các <strong>giá trị cụ thể</strong>.</p>
<p class="pitfall co-tieu-de"><strong>Cụ thể, đừng chung chung.</strong> Không ghi "email hợp lệ" — ghi đúng chuỗi <code>"student1@fpt.edu.vn"</code>. Không ghi "mật khẩu sai" — ghi <code>"wrong123"</code>. Không ghi "không có" — ghi <code>null</code>.</p>
<p><strong>Confirmation</strong> (nửa dưới, kết quả mong đợi) có ba phần, và cô đã nhấn mạnh phải đủ <strong>cả ba</strong>:</p>
<div class="table-wrap"><table>
<thead><tr><th>Phần</th><th>Nghĩa</th><th>Ví dụ hàm login</th></tr></thead>
<tbody>
<tr><td>Return</td><td>Giá trị trả về, hoặc trạng thái sau khi gọi</td><td>TokenResponse có tokenType "Bearer"; failedLogins = 4</td></tr>
<tr><td>Exception</td><td>Ngoại lệ hàm ném ra, ghi rõ mã lỗi</td><td>BusinessException(AUTH_INVALID_CREDENTIALS) – HTTP 401</td></tr>
<tr><td>Log message</td><td>Thông điệp được ghi lại / hiển thị</td><td>"Invalid email or password"; WARN "Login locked after 5 failures: userId=5"</td></tr>
</tbody>
</table></div>
<h3>N · A · B — ví dụ chính thức 5 ≤ x ≤ 10</h3>
<div class="table-wrap"><table>
<thead><tr><th>Loại</th><th>Nghĩa</th><th>5 ≤ x ≤ 10</th><th>createLab: sức chứa 1–200</th></tr></thead>
<tbody>
<tr><td><strong>N</strong> Normal — bình thường</td><td>Giá trị nằm gọn bên trong</td><td>6, 7, 8, 9</td><td>20</td></tr>
<tr><td><strong>B</strong> Boundary — biên</td><td>Đúng hai đầu mút, vẫn hợp lệ nhưng sát lằn ranh</td><td>5, 10</td><td>1, 200</td></tr>
<tr><td><strong>A</strong> Abnormal — bất thường</td><td>Nằm ngoài, null, sai kiểu → thường vào nhánh báo lỗi</td><td>−1, 11, null, "a"</td><td>0, 201</td></tr>
</tbody>
</table></div>
<p class="meo">🧠 Mẹo tìm biên: thấy một phép so sánh trong code (<code>&gt;</code>, <code>&gt;=</code>, <code>isBefore</code>…) là có biên ở ngay đó. BR-06 "trên 30 chỗ thì cần duyệt" ⇒ 30 (không cần) và 31 (cần) đều là B.</p>
<h3>Cột UTCID, dấu O, P/F, Executed Date, Defect ID</h3>
<ul>
<li>Mỗi cột của ma trận là một test case, đặt tên UTCID01, UTCID02…</li>
<li>Đánh chữ <strong>O</strong> vào đúng các dòng Condition dùng cho case đó và đúng các dòng Confirmation mong đợi. Luật cứng: cột nào cũng phải có ít nhất một O ở Condition <strong>và</strong> ít nhất một O ở Confirmation.</li>
<li>Dưới đáy cột: <strong>Type</strong> (N/A/B), <strong>Passed/Failed</strong> (P/F — chỉ ghi sau khi chạy JUnit thật), <strong>Executed Date</strong> (ngày chạy), <strong>Defect ID</strong> (mã thẻ Bug, chỉ điền khi F).</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Failed là chuyện bình thường; test viết sai thì không phải Failed.</strong> Test tìm ra lỗi thật là test tốt — giữ chữ F và tạo thẻ Bug; tuyệt đối không sửa kết quả mong đợi cho khớp code sai. Còn test đỏ vì lỗi biên dịch hay quên giả lập một thứ là <em>test viết sai</em>: sửa test rồi chạy lại.</div>
<h3>Bao nhiêu test case thì đủ? 100 TC/KLOC</h3>
<p>Chuẩn 100 test case trên 1.000 dòng code — nói gọn: cứ khoảng 10 dòng cần 1 case; tối thiểu của một hàm = ⌈LOC / 10⌉ (làm tròn lên). <code>login</code> 35 dòng ⇒ tối thiểu 4 (ví dụ mẫu có 13). Cả nhóm 540 dòng ⇒ tối thiểu 65; mục tiêu 6–10 case mỗi hàm. Cột <em>Lack of test cases</em> cho biết hàm nào còn thiếu bao nhiêu; thiếu thì người tạo phải ghi lý do. Statistics còn tính <em>Test coverage</em> (số case đã chạy / tổng) và <em>Test successful coverage</em> (số case Passed / tổng).</p>
<h3>Đừng chép lỗi của file mẫu</h3>
<p>File mẫu của khoá trước (đã mở kiểm từng ô) có lỗi thật:</p>
<ul>
<li>Dòng <code>forgotPassword</code> có link trỏ tới sheet tên <code>fogotPassword</code> (thiếu chữ r), bấm vào không đi đâu cả; một dòng khác trỏ tới <code>null!A1</code>, cũng chết.</li>
<li>Ô Sub Total của cột Failed và Untested chỉ cộng <code>E8:E40</code> trong khi bảng kéo dài tới dòng 73 — số case Failed bị đếm thiếu mà không ai nhận ra.</li>
</ul>
<p>Bài học: đổi tên sheet xong là bấm thử từng link, thêm hàm xong là kiểm lại công thức cộng — hoặc xuất file từ CT Work (bài L2.15), link và công thức tự đúng.</p>
<h3>Thực hành</h3>
<p>Hàm <code>createEquipment</code> yêu cầu số serial dài 3–50 ký tự, hàm dài 14 dòng. (1) Xếp các độ dài 2, 3, 10, 50, 51 vào N/A/B. (2) Cần tối thiểu bao nhiêu test case?</p>
${ansVi('10 = N; 3, 50 = B; 2, 51 = A', '⌈14 / 10⌉ = 2 — năm giá trị trên đã cho bạn năm case, vượt chuẩn rồi.')}
${ctwVi()}`),
  ].join('\n'),
};

/* ═══════════════════════ L2.13 — Ví dụ trọn vòng: AuthService.login ═══════════════════════ */
const SETUP = `@ExtendWith(MockitoExtension.class)
class AuthServiceLoginTest {

    static final Instant NOW = Instant.parse("2026-10-12T02:00:00Z");   // 09:00 Monday, Vietnam time

    @Mock UserRepository userRepository;
    @Mock RoleRepository roleRepository;
    @Mock UserTokenRepository tokenRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock AccessTokenService accessTokenService;
    @Mock SettingsService settings;
    @Mock MailService mailService;
    @Mock AuditService auditService;

    AuthService authService;

    @BeforeEach
    void setUp() {
        // build the service by hand to pass a fixed Clock and JwtProperties (a record, cannot be mocked)
        authService = new AuthService(userRepository, roleRepository, tokenRepository, passwordEncoder,
                accessTokenService, new JwtProperties("x".repeat(32), 15, 7), settings, mailService, auditService,
                Clock.fixed(NOW, ZoneOffset.UTC));
        lenient().when(settings.getInt("auth.max-failed-logins")).thenReturn(5);
        lenient().when(settings.getInt("auth.lock-minutes")).thenReturn(15);
    }

    private static User activeStudent(int failedLogins) {
        Role role = new Role();
        role.setId(1);
        role.setCode(RoleCode.STUDENT);
        User u = new User();
        u.setId(5L);
        u.setEmail("student1@fpt.edu.vn");
        u.setPasswordHash("hashed");
        u.setFullName("Demo Student One");
        u.setStatus(UserStatus.ACTIVE);
        u.setFailedLogins(failedLogins);
        u.setRoles(Set.of(role));
        return u;
    }`;
const LOGIN = `public TokenResponse login(LoginRequest request) {
    String email = normalizeEmail(request.email());            // trim + lower-case; "   " ⇒ null
    if (email == null || request.password() == null) {
        throw new BusinessException(ErrorCode.AUTH_INVALID_CREDENTIALS);
    }
    User user = userRepository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new BusinessException(ErrorCode.AUTH_INVALID_CREDENTIALS));
    Instant now = Instant.now(clock);
    if (user.getStatus() == UserStatus.LOCKED) {
        throw new BusinessException(ErrorCode.AUTH_ACCOUNT_LOCKED);
    }
    if (user.getLockedUntil() != null &amp;&amp; now.isBefore(user.getLockedUntil())) {   // boundary #2
        throw new BusinessException(ErrorCode.AUTH_ACCOUNT_TEMP_LOCKED);
    }
    if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
        int failed = user.getFailedLogins() + 1;
        if (failed &gt;= settings.getInt("auth.max-failed-logins")) {                   // boundary #1 (BR-02: 5)
            user.setFailedLogins(0);
            user.setLockedUntil(now.plus(Duration.ofMinutes(settings.getInt("auth.lock-minutes"))));
            auditService.record(user.getId(), "USER", user.getId(), "LOGIN_LOCKED", null, null);
            log.warn("Login locked after {} failures: userId={}", failed, user.getId());
            throw new BusinessException(ErrorCode.AUTH_ACCOUNT_TEMP_LOCKED);
        }
        user.setFailedLogins(failed);
        throw new BusinessException(ErrorCode.AUTH_INVALID_CREDENTIALS);
    }
    if (user.getStatus() == UserStatus.PENDING) {
        throw new BusinessException(ErrorCode.AUTH_EMAIL_NOT_VERIFIED);
    }
    user.setFailedLogins(0);
    user.setLockedUntil(null);
    auditService.record(user.getId(), "USER", user.getId(), "LOGIN", null, null);
    log.info("Login success: userId={}", user.getId());
    return issueTokens(user);
}`;
const T05 = `@Test
@DisplayName("UTCID05 [B] 3 failures so far + wrong password (4th) -&gt; not locked yet")
void utcid05_fourthFailure_notLockedYet() {
    // Arrange — build the Condition
    User user = activeStudent(3);
    when(userRepository.findByEmailIgnoreCase("student1@fpt.edu.vn")).thenReturn(Optional.of(user));
    when(passwordEncoder.matches("wrong123", "hashed")).thenReturn(false);

    // Act + Assert — call ONE function, compare with the Confirmation
    assertThatThrownBy(() -&gt; authService.login(new LoginRequest("student1@fpt.edu.vn", "wrong123")))
            .isInstanceOf(BusinessException.class)
            .extracting(e -&gt; ((BusinessException) e).getCode())
            .isEqualTo(ErrorCode.AUTH_INVALID_CREDENTIALS);
    assertThat(user.getFailedLogins()).isEqualTo(4);
    assertThat(user.getLockedUntil()).isNull();
}`;
const T07 = `@Test
@DisplayName("UTCID07 [B] lockedUntil == now (the lock ends exactly now) + correct password -&gt; login succeeds")
void utcid07_lockEndsExactlyNow_loginSucceeds() {
    User user = activeStudent(0);
    user.setLockedUntil(NOW);
    when(userRepository.findByEmailIgnoreCase("student1@fpt.edu.vn")).thenReturn(Optional.of(user));
    when(passwordEncoder.matches("Labflow123", "hashed")).thenReturn(true);
    when(accessTokenService.issue(eq(5L), anyString(), anyList())).thenReturn("jwt-token");
    when(accessTokenService.accessSeconds()).thenReturn(900);

    TokenResponse res = authService.login(new LoginRequest("student1@fpt.edu.vn", "Labflow123"));

    assertThat(res.accessToken()).isEqualTo("jwt-token");
    assertThat(user.getLockedUntil()).isNull();
    assertThat(user.getFailedLogins()).isZero();
}`;
const T06 = `@Test
@DisplayName("UTCID06 [A] temporarily locked (10 more minutes) + correct password -&gt; AUTH_ACCOUNT_TEMP_LOCKED")
void utcid06_tempLocked_rejectsCorrectPassword() {
    User user = activeStudent(0);
    user.setLockedUntil(NOW.plusSeconds(10 * 60));
    when(userRepository.findByEmailIgnoreCase("student1@fpt.edu.vn")).thenReturn(Optional.of(user));

    assertThatThrownBy(() -&gt; authService.login(new LoginRequest("student1@fpt.edu.vn", "Labflow123")))
            .isInstanceOf(BusinessException.class)
            .extracting(e -&gt; ((BusinessException) e).getCode())
            .isEqualTo(ErrorCode.AUTH_ACCOUNT_TEMP_LOCKED);
    verify(accessTokenService, never()).issue(any(), any(), any());
}`;
const OUT6 = `$ ./mvnw test -Dtest=AuthServiceLoginTest
[INFO] Running vn.swt301.labflowdemo.auth.AuthServiceLoginTest
WARN vn.swt301.labflowdemo.auth.AuthService -- Login locked after 5 failures: userId=5
INFO vn.swt301.labflowdemo.auth.AuthService -- Login success: userId=5
INFO vn.swt301.labflowdemo.auth.AuthService -- Login success: userId=5
[INFO] Tests run: 6, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS`;
const OUTF = `[ERROR] AuthServiceLoginTest.utcid10_pendingWrongPassword_expectNotVerified:198
expected: AUTH_EMAIL_NOT_VERIFIED
 but was: AUTH_INVALID_CREDENTIALS
[ERROR] Tests run: 1, Failures: 1, Errors: 0, Skipped: 0
[INFO] BUILD FAILURE`;
const UT_ROWS = (vi) => [
  ['01', 'N', vi ? 'ACTIVE, đã sai 2 lần, đúng mật khẩu' : 'ACTIVE, 2 failures so far, correct password', vi ? 'Token Bearer, STUDENT, bộ đếm về 0' : 'Bearer token, STUDENT, counter reset', vi ? 'có sẵn' : 'in repo'],
  ['02', 'A', vi ? 'Email không tồn tại' : 'Unknown email', 'AUTH_INVALID_CREDENTIALS', vi ? 'có sẵn' : 'in repo'],
  ['03', 'A', vi ? 'Sai mật khẩu lần đầu' : 'Wrong password, 1st time', vi ? 'INVALID_CREDENTIALS, failedLogins = 1' : 'INVALID_CREDENTIALS, failedLogins = 1', vi ? 'có sẵn' : 'in repo'],
  ['04', 'B', vi ? 'Đã sai 4 lần + sai nữa (= 5)' : '4 failures + wrong again (= 5)', vi ? 'TEMP_LOCKED, khoá tới bây giờ + 15 phút' : 'TEMP_LOCKED, locked until now + 15 min', vi ? 'có sẵn' : 'in repo'],
  ['05', 'B', vi ? 'Đã sai 3 lần + sai nữa (= 4)' : '3 failures + wrong again (= 4)', vi ? 'INVALID_CREDENTIALS, failedLogins = 4, chưa khoá' : 'INVALID_CREDENTIALS, failedLogins = 4, not locked', vi ? 'bài này' : 'this lesson'],
  ['06', 'A', vi ? 'Đang khoá tạm còn 10 phút, đúng mật khẩu' : 'Temp-locked for 10 more min, correct password', 'AUTH_ACCOUNT_TEMP_LOCKED', vi ? 'bài tập' : 'exercise'],
  ['07', 'B', vi ? 'lockedUntil đúng bằng bây giờ' : 'lockedUntil exactly now', vi ? 'Đăng nhập thành công' : 'Login succeeds', vi ? 'bài này' : 'this lesson'],
  ['08', 'A', vi ? 'Tài khoản LOCKED' : 'Account LOCKED', 'AUTH_ACCOUNT_LOCKED', 'TV1'],
  ['09', 'A', vi ? 'PENDING, đúng mật khẩu' : 'PENDING, correct password', 'AUTH_EMAIL_NOT_VERIFIED', 'TV1'],
  ['10', 'A', vi ? 'PENDING, sai mật khẩu' : 'PENDING, wrong password', vi ? 'INVALID_CREDENTIALS (mật khẩu kiểm trước)' : 'INVALID_CREDENTIALS (password checked first)', 'TV1'],
  ['11', 'N', '"  Student1@FPT.edu.vn  "', vi ? 'Thành công (trim + chữ thường)' : 'Success (trim + lower-case)', 'TV1'],
  ['12', 'A', vi ? 'Email chỉ toàn khoảng trắng' : 'Blank email', vi ? 'INVALID_CREDENTIALS, không gọi repository' : 'INVALID_CREDENTIALS, repository not called', 'TV1'],
  ['13', 'A', vi ? 'Mật khẩu null' : 'null password', vi ? 'INVALID_CREDENTIALS, không gọi repository' : 'INVALID_CREDENTIALS, repository not called', 'TV1'],
].map((r) => `<tr><td>UTCID${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4].replace('TV1', vi ? 'Thành viên 1' : 'Member 1')}</td></tr>`).join('\n');

const L213 = {
  title: 'L2.13 — Worked project (4): one full cycle on AuthService.login|||L2.13 — Dự án làm thật (4): ví dụ trọn vòng AuthService.login',
  slug: 'swt301-lab2-vi-du-login',
  type: 'DOCUMENT',
  description: 'Làm mẫu trọn vòng cho một hàm thật: đọc code AuthService.login tìm mọi nhánh, liệt kê Condition/Confirmation, thiết kế 13 UTCID (2 N, 8 A, 3 B) và lý do từng case B, mock bằng Mockito + Clock.fixed, viết test theo AAA, chạy thật (6 test xanh), đọc test đỏ expected/but was, rồi ghi P/F vào ma trận. Có code test thật và lời giải UTCID06.',
  content: [
    bi(`<span class="eyebrow">Lab 2 · Worked project · Part 4 of 6 · Video swt-l2-3</span>
<h2>One complete cycle on a real function: login</h2>
<p class="lead"><code>AuthService.login</code> belongs to Member 1 (the team lead). The repository already holds four sample tests, UTCID01–04. Here we go through the whole cycle once, so every other member can repeat it for their own functions.</p>
${vidEn(4)}
<div class="lz-flow"><span>1 · Design the matrix on CT Work</span><span>2 · Write the JUnit test in IntelliJ and run it</span><span>3 · Record P/F in the matrix</span><span>4 · Export Excel</span><span>5 · Make your slides</span></div>
<h3>Step 0 — read the code, find every branch</h3>
<p><a href="${SRC}/auth/AuthService.java#L143" target="_blank" rel="noopener">AuthService.java line 143</a>, 35 LOC:</p>
<pre><code class="language-java">${LOGIN}</code></pre>
<p class="y-chinh">🎯 Every <code>throw</code> is a branch, and every branch needs at least one test case. The same error for "unknown email" and "wrong password" is deliberate: an outsider cannot probe which emails have accounts. And the order matters: the <strong>password is checked before PENDING</strong>.</p>
<h3>Step 1 — list the Condition and Confirmation rows</h3>
<ul>
<li><strong>Precondition</strong>: user ACTIVE with failedLogins 0 / 2 / 3 / 4; temp-locked for 10 more minutes; lock ends exactly now; status LOCKED; status PENDING; no user with this email. Plus the shared one: all dependencies mocked, max-failed-logins = 5, lock-minutes = 15, clock fixed at 2026-10-12T02:00Z (09:00 Monday in Vietnam) so the test gives the same result today and next week.</li>
<li><strong>email</strong>: <code>"student1@fpt.edu.vn"</code> · <code>"  Student1@FPT.edu.vn  "</code> · <code>"ghost@fpt.edu.vn"</code> · <code>"   "</code></li>
<li><strong>password</strong>: <code>"Labflow123"</code> (correct) · <code>"wrong123"</code> · <code>null</code></li>
<li><strong>Confirmation</strong>: the TokenResponse, failedLogins / lockedUntil after the call, "no token issued", four error codes, and the log lines.</li>
</ul>
<h3>The 13 UTCIDs (2 N · 8 A · 3 B)</h3>
<div class="table-wrap"><table>
<thead><tr><th>UTCID</th><th>Type</th><th>Situation</th><th>Expected</th><th>Test</th></tr></thead>
<tbody>
${UT_ROWS(false)}
</tbody>
</table></div>
<p><strong>Why exactly three B cases?</strong> Because the code has two comparisons. <code>failed &gt;= 5</code>: 4 failures + 1 = 5 ⇒ locked (UTCID04); 3 + 1 = 4, just below ⇒ not locked (UTCID05). <code>now.isBefore(lockedUntil)</code>: lock ending exactly now ⇒ allowed in (UTCID07). When the lecturer asks "why B?", point at that <code>if</code> line. That is enough.</p>
<h3>Step 2a — mocks are stunt doubles</h3>
<p><code>login</code> calls the user repository, the password encoder, the token service and the audit log. A unit test must not touch a real database, so Mockito creates a stand-in for each: <code>@Mock</code> = "make a fake that does nothing unless told". You tell it with <code>when(...).thenReturn(...)</code>. The service itself is built by hand in <code>setUp</code> to pass <code>Clock.fixed</code>:</p>
<pre><code class="language-java">${SETUP}</code></pre>
<h3>Step 2b — write UTCID05 with the AAA pattern</h3>
<p>One <code>@Test</code> = one UTCID. <code>@DisplayName</code> carries the case id, the type and the situation; the method name starts with <code>utcid05</code> so that when the lecturer points at a column you open the right method at once. <strong>Arrange</strong> builds the Condition, <strong>Act</strong> calls exactly one function, <strong>Assert</strong> compares with the Confirmation — including the state after the call.</p>
<pre><code class="language-java">${T05}</code></pre>
<p>UTCID07 the same way — the boundary on the other comparison:</p>
<pre><code class="language-java">${T07}</code></pre>
<div class="pitfall co-tieu-de"><strong>Two ways to write a test that proves nothing.</strong> Asserting only <code>isInstanceOf(BusinessException.class)</code> passes for <em>any</em> error code — always check the code with <code>getCode()</code>. And a failure case must also prove that nothing happened that should not: no token issued (<code>verify(..., never())</code>), counter values after the call.</div>
<h3>Run one class — real output</h3>
<pre><code class="language-text">${OUT6}</code></pre>
<p>The two log lines in the middle <em>are</em> the Log message rows of the matrix: one lock after 5 failures, and the login successes. In IntelliJ you can also click the green triangle next to the class or next to one test method.</p>
<h3>When a test is red: read "expected / but was"</h3>
<p>Suppose a teammate believes "PENDING + wrong password must say not verified" and writes UTCID10 that way. Real output:</p>
<pre><code class="language-text">${OUTF}</code></pre>
<p>The code checks the password before PENDING. Who is right? <strong>Not the code — the requirement.</strong> The group's matrix (from the requirements) expects AUTH_INVALID_CREDENTIALS, so the teammate fixes the <em>expectation</em> to follow the requirement. Had the requirement really said otherwise, you would keep <strong>F</strong>, create a Bug card and write its key in <em>Defect ID</em>.</p>
<h3>Step 3 — record the results</h3>
<p>Back on CT Work: write <strong>P</strong> under UTCID01–05 and 07, fill <em>Executed Date</em> and <em>Executed By</em>. Columns without a test stay empty and count as <em>Untested</em>. The counters and Statistics update by themselves (lesson L2.15).</p>
<h3>Practice — write UTCID06</h3>
<p>The account is temporarily locked for 10 more minutes and the user types the <strong>correct</strong> password. Expected: still rejected with TEMP_LOCKED, and no token issued.</p>
${ansEn('UTCID06', 'Set <code>lockedUntil = NOW + 10 minutes</code>, stub the repository, assert the code, and use <code>verify(..., never())</code> to prove the token service was never called. Run the class again: 7 tests, 0 failures (checked on the real branch).')}
<pre><code class="language-java">${T06}</code></pre>
${card(`${TEST}/auth/AuthServiceLoginTest.java`, '🧪', 'AuthServiceLoginTest.java on branch lab2-unit-test', 'The sample test class: setUp with Clock.fixed, UTCID01–04', 'GITHUB →')}
${card(`${SRC}/auth/AuthService.java#L143`, '🔍', 'AuthService.login — the code under test (line 143)', '35 LOC, BR-02', 'GITHUB →')}
${ctwEn()}`,

`<span class="eyebrow">Lab 2 · Dự án làm thật · Phần 4/6 · Video swt-l2-3</span>
<h2>Trọn một vòng với một hàm thật: login</h2>
<p class="lead">Hàm <code>AuthService.login</code> thuộc phần của Thành viên 1 (nhóm trưởng). Repo đã có sẵn bốn test mẫu UTCID01–04. Bài này đi trọn một vòng một lần, để bốn bạn còn lại làm y hệt cho hàm của mình.</p>
${vidVi(4)}
<div class="lz-flow"><span>1 · Thiết kế ma trận trên CT Work</span><span>2 · Viết test JUnit trong IntelliJ rồi chạy</span><span>3 · Ghi P/F vào ma trận</span><span>4 · Xuất Excel</span><span>5 · Làm slide</span></div>
<p>Bài này đi kỹ bước 1 tới bước 3.</p>
<h3>Bước 0 — đọc code, tìm mọi nhánh</h3>
<p><a href="${SRC}/auth/AuthService.java#L143" target="_blank" rel="noopener">AuthService.java dòng 143</a>, dài 35 dòng:</p>
<pre><code class="language-java">${LOGIN}</code></pre>
<ul>
<li>Đầu vào chỉ có email và mật khẩu; email được cắt khoảng trắng và đổi về chữ thường.</li>
<li>Email rỗng hoặc mật khẩu null ⇒ lỗi sai thông tin đăng nhập ngay. Không tìm thấy người dùng ⇒ <strong>cũng đúng lỗi đó</strong> — cố ý, để người ngoài không dò được email nào có tài khoản.</li>
<li>Bị khoá hẳn ⇒ báo LOCKED; đang khoá tạm ⇒ báo TEMP_LOCKED.</li>
<li>Sai mật khẩu ⇒ cộng một lần sai; đủ 5 lần ⇒ khoá 15 phút và ghi một dòng WARN vào log.</li>
<li>Đúng mật khẩu mà chưa xác minh ⇒ báo chưa xác minh. Còn lại là thành công: đặt lại bộ đếm, ghi log, trả về token.</li>
</ul>
<p class="y-chinh">🎯 Mỗi lệnh <code>throw</code> là một nhánh, mỗi nhánh phải có ít nhất một test case đi vào nó. Và thứ tự kiểm quan trọng: <strong>mật khẩu được kiểm TRƯỚC trạng thái PENDING</strong>.</p>
<h3>Bước 1 — liệt kê Condition và Confirmation</h3>
<ul>
<li><strong>Precondition</strong>: người dùng ACTIVE đã sai 0 / 2 / 3 / 4 lần; đang khoá tạm còn 10 phút; khoá tạm hết đúng lúc này; trạng thái LOCKED; trạng thái PENDING; không có người dùng nào với email đó. Cộng một dòng chung: mọi phụ thuộc đều mock, max-failed-logins = 5, lock-minutes = 15, đồng hồ đóng băng ở 2026-10-12T02:00Z (9 giờ sáng thứ Hai giờ Việt Nam) để test hôm nay hay tuần sau đều ra cùng kết quả.</li>
<li><strong>email</strong>: <code>"student1@fpt.edu.vn"</code> · <code>"  Student1@FPT.edu.vn  "</code> (khoảng trắng + chữ hoa) · <code>"ghost@fpt.edu.vn"</code> (không tồn tại) · <code>"   "</code> (toàn khoảng trắng)</li>
<li><strong>password</strong>: <code>"Labflow123"</code> (đúng) · <code>"wrong123"</code> (sai) · <code>null</code></li>
<li><strong>Confirmation</strong>: TokenResponse trả về, failedLogins / lockedUntil sau khi gọi, "không cấp token", bốn mã lỗi, và các dòng log.</li>
</ul>
<h3>Thiết kế 13 UTCID (2 N · 8 A · 3 B)</h3>
<div class="table-wrap"><table>
<thead><tr><th>UTCID</th><th>Loại</th><th>Tình huống</th><th>Mong đợi</th><th>Test</th></tr></thead>
<tbody>
${UT_ROWS(true)}
</tbody>
</table></div>
<p><strong>Vì sao có đúng ba case B?</strong> Vì code có hai phép so sánh. Phép thứ nhất <code>failed &gt;= 5</code>: đã sai 4 lần, sai thêm một là đúng 5 ⇒ bị khoá (UTCID04); đã sai 3 lần, sai thêm một là 4, ngay dưới ngưỡng ⇒ chưa khoá (UTCID05). Phép thứ hai <code>now.isBefore(lockedUntil)</code>: hết khoá đúng bằng bây giờ ⇒ được vào (UTCID07). Cô hỏi vì sao là B, bạn chỉ vào đúng dòng <code>if</code> đó trong code. Thế là đủ.</p>
<h3>Bước 2a — mock là diễn viên đóng thế</h3>
<p>Hàm login gọi tới kho người dùng, bộ so mật khẩu, bộ cấp token và cả nhật ký audit. Unit test không được đụng cơ sở dữ liệu thật, nên Mockito tạo một bản giả cho từng thứ: chú thích <code>@Mock</code> nghĩa là "tạo một bản giả, nó không làm gì trừ khi được dặn trước". Dặn bằng <code>when(...).thenReturn(...)</code> — ví dụ: khi tìm email student1 thì trả về người dùng này. Riêng <code>AuthService</code> được dựng bằng tay trong <code>setUp</code> để truyền vào một đồng hồ cố định (<code>Clock.fixed</code>), và dặn sẵn hai con số luật: tối đa 5 lần sai, khoá 15 phút.</p>
<pre><code class="language-java">${SETUP}</code></pre>
<h3>Bước 2b — gõ test UTCID05 theo mẫu AAA</h3>
<p>Một <code>@Test</code> bằng đúng một UTCID. Dòng <code>@DisplayName</code> ghi mã case, loại B và tình huống; tên hàm test bắt đầu bằng <code>utcid05</code> để cô chỉ vào cột nào là bạn mở ngay đúng hàm đó. <strong>Arrange</strong> (sắp đặt) dựng Condition; <strong>Act</strong> (hành động) gọi đúng một hàm; <strong>Assert</strong> (khẳng định) so với Confirmation — kể cả trạng thái sau khi gọi.</p>
<pre><code class="language-java">${T05}</code></pre>
<p>UTCID07 viết đúng cách đó — biên của phép so sánh thứ hai:</p>
<pre><code class="language-java">${T07}</code></pre>
<div class="pitfall co-tieu-de"><strong>Hai cách viết test không chứng minh được gì.</strong> Chỉ khẳng định <code>isInstanceOf(BusinessException.class)</code> thì mã lỗi <em>nào</em> cũng qua — luôn kiểm mã lỗi bằng <code>getCode()</code>. Và case thất bại còn phải chứng minh điều không được xảy ra đã không xảy ra: không cấp token (<code>verify(..., never())</code>), giá trị bộ đếm sau khi gọi.</div>
<h3>Chạy riêng một lớp test — kết quả thật</h3>
<pre><code class="language-text">${OUT6}</code></pre>
<p>Windows: <code>.\\mvnw.cmd test "-Dtest=AuthServiceLoginTest"</code>. Hai loại dòng log ở giữa <em>chính là</em> các dòng Log message trong ma trận: một dòng khoá sau 5 lần sai, và các dòng đăng nhập thành công. Trong IntelliJ còn dễ hơn: bấm tam giác xanh cạnh tên lớp, hoặc cạnh từng hàm test.</p>
<h3>Khi test đỏ: đọc đúng dòng "expected / but was"</h3>
<p>Giả sử một bạn nghĩ: "tài khoản chưa xác minh mà gõ sai mật khẩu thì phải báo chưa xác minh", và viết UTCID10 với kỳ vọng đó. Kết quả thật:</p>
<pre><code class="language-text">${OUTF}</code></pre>
<p>Vì code kiểm mật khẩu trước, rồi mới kiểm PENDING. Vậy ai đúng? <strong>Không đoán theo code — đối chiếu yêu cầu và luật nghiệp vụ.</strong> Ma trận của nhóm (lấy từ yêu cầu) ghi kỳ vọng là AUTH_INVALID_CREDENTIALS, nên bạn ấy sửa lại <em>kỳ vọng</em> theo yêu cầu. Còn nếu yêu cầu thật sự nói khác code, thì giữ chữ <strong>F</strong>, tạo thẻ Bug và ghi mã thẻ vào ô <em>Defect ID</em>.</p>
<h3>Bước 3 — ghi kết quả vào ma trận</h3>
<p>Chạy xong, quay lại CT Work: ghi <strong>P</strong> ở cột UTCID01–05 và 07, điền <em>Executed Date</em> và <em>Executed By</em>. Các cột chưa có test để trống — được tính là <em>Untested</em>. Ô đếm đầu sheet và bảng Statistics tự cập nhật (bài L2.15 làm thao tác này trên CT Work).</p>
<h3>Thực hành — viết UTCID06</h3>
<p>Tài khoản đang khoá tạm, còn 10 phút, người dùng gõ <strong>đúng</strong> mật khẩu. Kỳ vọng: vẫn bị từ chối với mã TEMP_LOCKED, và không có token nào được cấp.</p>
${ansVi('UTCID06', 'Đặt <code>lockedUntil = NOW + 10 phút</code>, dặn kho người dùng trả về bạn này, khẳng định mã lỗi, và dùng <code>verify(..., never())</code> để chắc chắn bộ cấp token không hề được gọi. Chạy lại cả lớp: 7 test, 0 lỗi (đã chạy thật trên nhánh).')}
<pre><code class="language-java">${T06}</code></pre>
<p class="meo">🧠 Việc tiếp theo của Thành viên 1: viết tiếp UTCID08–13 theo bảng trên vào chính tệp <code>AuthServiceLoginTest.java</code>, chạy cho xanh.</p>
${card(`${TEST}/auth/AuthServiceLoginTest.java`, '🧪', 'AuthServiceLoginTest.java trên nhánh lab2-unit-test', 'Lớp test mẫu: setUp với Clock.fixed, UTCID01–04', 'GITHUB →')}
${card(`${SRC}/auth/AuthService.java#L143`, '🔍', 'AuthService.login — code được test (dòng 143)', '35 LOC, BR-02', 'GITHUB →')}
${ctwVi()}`),
  ].join('\n'),
};

/* ═══════════════════════ L2.14 — Chia việc 5 thành viên ═══════════════════════ */
const FN = [
  // [member, class, method, LOC, min, trap EN, trap VI, boundary]
  [1, 'AuthService', 'login', 35, 4, 'the 5th failure locks for 15 minutes', 'sai lần 5 ⇒ khoá 15 phút', 'failedLogins 3 / 4'],
  [1, 'AuthService', 'register', 35, 4, 'university domain only; password letters + digits; duplicate email ignoring case', 'chỉ tên miền trường; mật khẩu có chữ + số; email trùng không phân biệt hoa thường', 'password 8 / 64'],
  [1, 'AuthService', 'verifyEmail', 12, 2, 'used token or expiresAt = now ⇒ error', 'token đã dùng hoặc hết hạn đúng bằng bây giờ ⇒ lỗi', 'expiresAt = now'],
  [1, 'AuthService', 'changePassword', 19, 2, 'new = old ⇒ error; success revokes every session (verify)', 'mới = cũ ⇒ lỗi; thành công thu hồi mọi phiên (verify)', 'password 8 / 64'],
  [1, 'AuthService', 'logout', 12, 2, 'null or unknown token must NOT throw — an A case that returns normally', 'token null / lạ KHÔNG được ném lỗi — case A mà kết quả vẫn bình thường', 'used token'],
  [2, 'AuthService', 'refresh', 20, 2, 're-using a used token revokes ALL tokens of that user — assert the revocation too', 'dùng lại token đã dùng ⇒ thu hồi HẾT token của người đó — kiểm cả việc thu hồi', 'expires exactly now'],
  [2, 'AuthService', 'forgotPassword', 16, 2, 'unknown / PENDING / LOCKED email: same message, no mail sent', 'email lạ / PENDING / LOCKED: cùng thông báo, không gửi thư', '—'],
  [2, 'AuthService', 'resetPassword', 15, 2, 'a weak password is rejected BEFORE the token is consumed', 'mật khẩu yếu bị chặn TRƯỚC khi token bị dùng mất', 'password 8 / 64'],
  [2, 'SettingsService', 'updateSetting', 37, 4, 'INT min / max, BOOL only true/false', 'INT min / max, BOOL chỉ true/false', '0 · 1 · 60 · 61'],
  [2, 'BookingPolicy', 'checkPeriod', 16, 2, '30-minute grid, not in the past, at most 14 days ahead', 'lưới 30 phút, không ở quá khứ, tối đa 14 ngày nữa', 'exactly 14 days'],
  [3, 'UserService', 'createUser', 28, 3, 'empty roles; duplicate email', 'danh sách vai trò rỗng; email trùng', 'name 1 / 100'],
  [3, 'UserService', 'updateUser', 21, 3, 'an admin cannot drop their own ADMIN; the last admin cannot lose ADMIN', 'không tự bỏ quyền ADMIN của mình; admin cuối cùng không được mất quyền', 'admins 1 / 2'],
  [3, 'UserService', 'changeStatus', 29, 3, 'cannot lock yourself or the last admin; lock revokes sessions, unlock clears the counter', 'không tự khoá mình, không khoá admin cuối; khoá thu hồi phiên, mở khoá xoá bộ đếm', '—'],
  [3, 'UserService', 'updateProfile', 21, 3, 'phone ^0\\d{9}$', 'số điện thoại ^0\\d{9}$', '9 / 10 / 11 digits · avatar 500'],
  [3, 'LabService', 'createBuilding', 21, 3, 'code trimmed + upper-cased', 'mã toà nhà được cắt khoảng trắng + viết hoa', '1 / 2 / 20 / 21 chars'],
  [4, 'LabService', 'createLab', 15, 2, 'BR-06: more than 30 seats ⇒ requiresApproval', 'BR-06: trên 30 chỗ ⇒ cần duyệt', 'capacity 30 / 31 · 1 / 200'],
  [4, 'LabService', 'updateLab', 20, 2, 'optimistic lock: different version ⇒ CONCURRENT_UPDATE; same code as itself is OK', 'khoá lạc quan: version khác ⇒ lỗi; trùng mã với chính nó vẫn được', 'own code ⇒ OK'],
  [4, 'EquipmentService', 'createEquipment', 14, 2, 'the lab must be ACTIVE', 'phòng phải đang ACTIVE', 'serial 2 / 3 / 50 / 51'],
  [4, 'EquipmentService', 'changeStatus', 5, 1, '5 lines, but its private helper has 19: cover every branch of the helper; RETIRED is final', 'chỉ 5 dòng nhưng gọi hàm phụ private 19 dòng: phải đi qua mọi nhánh của hàm phụ; RETIRED là cuối', 'reason 255 / 256'],
  [4, 'EquipmentService', 'bulkChangeStatus', 15, 2, 'all or nothing: one bad unit fails the whole batch', 'tất cả hoặc không gì cả: một cái lỗi là cả lô lỗi', '1 / 50 / 51 ids'],
  [5, 'CalendarService', 'setOperatingHours', 30, 3, 'minutes only :00 or :30 (07:15 ⇒ error)', 'phút chỉ :00 hoặc :30 (07:15 ⇒ lỗi)', 'weekday 0 / 1 / 7 / 8'],
  [5, 'CalendarService', 'addBlackout', 27, 3, 'two ranges that only touch do NOT overlap', 'hai khoảng chỉ chạm mép KHÔNG tính là chồng', 'reason 255'],
  [5, 'CalendarService', 'checkLabOpen', 24, 3, 'holidays are closed; a lab’s own hours override the default', 'ngày lễ đóng; giờ riêng của phòng ghi đè giờ chung', 'exactly 07:00 / 21:00'],
  [5, 'ReservationService', 'createReservation', 53, 6, 'same idempotency key ⇒ the first result is replayed; a DB overlap is simulated by making the mock throw', 'cùng khoá chống trùng ⇒ trả lại kết quả cũ; trùng giờ ở CSDL giả lập bằng cách dặn mock ném lỗi', 'key 7 / 8 / 64 / 65'],
];
const fnRows = (vi) => FN.map((r) => `<tr><td>${vi ? 'Thành viên' : 'Member'} ${r[0]}</td><td>${r[1]}.<strong>${r[2]}</strong></td><td>${r[3]}</td><td>${r[4]}</td><td>${vi ? r[6] : r[5]}</td><td>${r[7]}</td></tr>`).join('\n');

const L214 = {
  title: 'L2.14 — Worked project (5): 5 members, 24 functions, traps, Pull Request|||L2.14 — Dự án làm thật (5): chia việc 5 thành viên, 24 hàm, biên, Pull Request',
  slug: 'swt301-lab2-chia-viec-5-thanh-vien',
  type: 'DOCUMENT',
  description: 'Phần của từng thành viên: 24 hàm, 540 LOC, tối thiểu 65 test case — mỗi hàm một bẫy riêng và giá trị biên cần thử; checklist nhóm trưởng dùng để soát bài; luật vàng không sửa src/main; nộp bằng fork → Pull Request vào nhánh lab2-unit-test, gắn link PR vào thẻ CT Work, và cách mỗi người tự chạy test phần mình lúc thuyết trình.',
  content: [
    bi(`<span class="eyebrow">Lab 2 · Worked project · Part 5 of 6 · Video swt-l2-4</span>
<h2>Each member's part: 24 functions, their traps and their boundaries</h2>
<p class="lead">The team lead must be able to guide and check the work of all four teammates. This lesson goes through every member's functions: what each one does, where its trap is, which boundaries to try — then how the work is checked and submitted.</p>
${vidEn(5)}
<h3>5 people · 24 functions · 540 lines</h3>
<div class="table-wrap"><table>
<thead><tr><th>Member</th><th>Area</th><th>Functions</th><th>LOC</th><th>Min. TC</th></tr></thead>
<tbody>
<tr><td>Member 1 (team lead)</td><td>Auth A</td><td>5</td><td>113</td><td>14</td></tr>
<tr><td>Member 2</td><td>Auth B + policy</td><td>5</td><td>104</td><td>12</td></tr>
<tr><td>Member 3</td><td>Users + buildings</td><td>5</td><td>120</td><td>15</td></tr>
<tr><td>Member 4</td><td>Labs + equipment</td><td>5</td><td>69</td><td>9 (≥ 15 counting helpers)</td></tr>
<tr><td>Member 5</td><td>Opening hours + reservations</td><td>4</td><td>134</td><td>15</td></tr>
<tr><td colspan="2"><strong>Total</strong></td><td><strong>24</strong></td><td><strong>540</strong></td><td><strong>≥ 65</strong></td></tr>
</tbody>
</table></div>
<p>The minimum is only the floor; the target is 6–10 cases per function. The full map (file, line, rules, exception codes) is <a href="${FN_LIST}" target="_blank" rel="noopener">docs/lab2/function-list.md</a>.</p>
<h3>Function by function</h3>
<div class="table-wrap"><table>
<thead><tr><th>Owner</th><th>Function</th><th>LOC</th><th>Min.</th><th>Trap</th><th>Boundaries to try</th></tr></thead>
<tbody>
${fnRows(false)}
</tbody>
</table></div>
<div class="pitfall co-tieu-de"><strong>Two traps worth repeating.</strong> (1) Member 4's <code>EquipmentService.changeStatus</code> has 5 LOC, but the logic lives in a private 19-line helper. The report counts the public function's LOC, yet the tests must walk every branch of the helper. (2) There are two functions named <code>changeStatus</code>; the CT Work export names their sheets <code>changeStatusUser</code> and <code>changeStatusEquipment</code> so they do not overwrite each other.</div>
<h3>The team lead's review checklist</h3>
<ol>
<li>Confirmation has only Return — Exception and Log message are missing.</li>
<li>The function has a comparison but no B case.</li>
<li>Generic values ("a valid email") instead of concrete strings.</li>
<li>A UTCID column with no O in Confirmation.</li>
<li>Missing Executed By, Executed Date or Lines of code.</li>
<li>The test uses the real clock instead of <code>Clock.fixed</code> — green today, red tomorrow.</li>
<li>Only the Excel is filled in; there is no real test code.</li>
</ol>
<p class="y-chinh">🎯 Golden rule: nobody edits <code>src/main</code>. You only add files under <code>src/test</code>, one test class per function or per class (e.g. <code>UserServiceChangeStatusTest</code>).</p>
<h3>Submitting: fork → Pull Request into lab2-unit-test</h3>
<pre><code class="language-bash"># once: click "Fork" on GitHub, then clone YOUR fork
git switch lab2-unit-test
git switch -c test/member-3              # a branch for your work
# add only your test files under backend/src/test/java/...
git add backend/src/test/java/vn/swt301/labflowdemo/user/UserServiceChangeStatusTest.java
git commit -m "test(user): UTCID01-07 for UserService.changeStatus"
git push -u origin test/member-3
# on GitHub: open a Pull Request  base: cuonghoang1103/LabFlow-AI-demo · lab2-unit-test  ←  your fork · test/member-3</code></pre>
<ul>
<li>Paste the PR link into your card on CT Work, attach a screenshot of your green run, move the card to <strong>In Review</strong>.</li>
<li>Not comfortable with Git yet? Send the <code>.java</code> file to the team lead or attach it to your card — never paste code into a chat message.</li>
<li>The team lead reviews the PR, re-runs <code>./mvnw test</code> on the presentation laptop until green, then merges.</li>
</ul>
<h3>At the presentation</h3>
<p>Same principle as the workbook: <strong>each member presents their own part</strong>, opens <strong>their own test class</strong> on the presentation laptop and runs it — e.g. <code>./mvnw test -Dtest=UserServiceChangeStatusTest</code> — because the lecturer wants the demo run, the slides, and to see where in the project the testing lives.</p>
<h3>Practice — Member 5's checkLabOpen</h3>
<p>Opening hours 07:00–21:00, each booking 30 minutes. Write two B ranges and two A ranges.</p>
${ansEn('B and A', 'B: 07:00–07:30 (starts exactly at opening) and 20:30–21:00 (ends exactly at closing). A: 06:30–07:00 and 21:00–21:30, just outside opening hours. Send your answer to Member 5 to compare.')}
${card(FN_LIST, '📋', 'docs/lab2/function-list.md', 'All 24 functions: file, LOC, rules, exception codes, spare functions', 'OPEN →')}
${card(`${REPO}/pulls`, '🔀', 'Pull Requests of LabFlow-AI-demo', 'Target branch: lab2-unit-test', 'GITHUB →')}
${ctwEn()}`,

`<span class="eyebrow">Lab 2 · Dự án làm thật · Phần 5/6 · Video swt-l2-4</span>
<h2>Phần của từng thành viên: 24 hàm, bẫy và biên</h2>
<p class="lead">Nhóm trưởng phải hướng dẫn và kiểm bài được cho cả bốn bạn. Bài này đi qua hàm của từng người: hàm làm gì, bẫy nằm ở đâu, cần thử những giá trị biên nào — rồi cách soát bài và cách nộp.</p>
${vidVi(5)}
<h3>5 người · 24 hàm · 540 dòng</h3>
<div class="table-wrap"><table>
<thead><tr><th>Thành viên</th><th>Mảng</th><th>Số hàm</th><th>LOC</th><th>TC tối thiểu</th></tr></thead>
<tbody>
<tr><td>Thành viên 1 (nhóm trưởng)</td><td>Auth A — đăng nhập</td><td>5</td><td>113</td><td>14</td></tr>
<tr><td>Thành viên 2</td><td>Auth B + chính sách</td><td>5</td><td>104</td><td>12</td></tr>
<tr><td>Thành viên 3</td><td>Người dùng + toà nhà</td><td>5</td><td>120</td><td>15</td></tr>
<tr><td>Thành viên 4</td><td>Phòng lab + thiết bị</td><td>5</td><td>69</td><td>9 (≥ 15 nếu tính hàm phụ)</td></tr>
<tr><td>Thành viên 5</td><td>Lịch mở cửa + đặt chỗ</td><td>4</td><td>134</td><td>15</td></tr>
<tr><td colspan="2"><strong>Tổng</strong></td><td><strong>24</strong></td><td><strong>540</strong></td><td><strong>≥ 65</strong></td></tr>
</tbody>
</table></div>
<p>Con số tối thiểu chỉ là sàn; mục tiêu là 6–10 case mỗi hàm. Mỗi bạn có một thẻ "Thành viên N" trên Board của CT Work; bản đồ đầy đủ (tệp, dòng, luật, mã lỗi) nằm ở <a href="${FN_LIST}" target="_blank" rel="noopener">docs/lab2/function-list.md</a>.</p>
<h3>Từng hàm một</h3>
<div class="table-wrap"><table>
<thead><tr><th>Người làm</th><th>Hàm</th><th>LOC</th><th>Tối thiểu</th><th>Bẫy</th><th>Biên cần thử</th></tr></thead>
<tbody>
${fnRows(true)}
</tbody>
</table></div>
<div class="pitfall co-tieu-de"><strong>Hai bẫy đáng nhắc lại.</strong> (1) Hàm <code>EquipmentService.changeStatus</code> của Thành viên 4 chỉ dài 5 dòng, nhưng logic nằm trong một hàm phụ private dài 19 dòng. Số dòng ghi vào báo cáo là của hàm chính, nhưng test vẫn phải đi qua mọi nhánh của hàm phụ. (2) Có hai hàm cùng tên <code>changeStatus</code>; file xuất từ CT Work đặt tên sheet là <code>changeStatusUser</code> và <code>changeStatusEquipment</code> để không đè lên nhau.</div>
<h3>Checklist nhóm trưởng soát bài</h3>
<ol>
<li>Confirmation chỉ có Return, thiếu Exception và Log message.</li>
<li>Hàm có phép so sánh mà không có case B nào.</li>
<li>Giá trị chung chung kiểu "email hợp lệ" thay vì chuỗi cụ thể.</li>
<li>Cột UTCID không có chữ O nào ở Confirmation.</li>
<li>Thiếu Executed By, Executed Date, hoặc số dòng code.</li>
<li>Test dùng giờ thật thay vì <code>Clock.fixed</code> — hôm nay xanh, mai đỏ.</li>
<li>Chỉ điền Excel mà không có code test thật.</li>
</ol>
<p class="y-chinh">🎯 Luật vàng: không ai sửa code trong <code>src/main</code>. Chỉ thêm tệp trong <code>src/test</code>, mỗi hàm (hoặc mỗi lớp) một lớp test, ví dụ <code>UserServiceChangeStatusTest</code>.</p>
<h3>Nộp bài: fork → Pull Request vào lab2-unit-test</h3>
<pre><code class="language-bash"># một lần: bấm "Fork" trên GitHub, rồi clone BẢN FORK của bạn
git switch lab2-unit-test
git switch -c test/thanh-vien-3          # nhánh riêng cho phần của bạn
# chỉ thêm tệp test của bạn trong backend/src/test/java/...
git add backend/src/test/java/vn/swt301/labflowdemo/user/UserServiceChangeStatusTest.java
git commit -m "test(user): UTCID01-07 cho UserService.changeStatus"
git push -u origin test/thanh-vien-3
# trên GitHub: mở Pull Request  base: cuonghoang1103/LabFlow-AI-demo · lab2-unit-test  ←  fork của bạn · test/thanh-vien-3</code></pre>
<ul>
<li>Dán link Pull Request vào thẻ của mình trên CT Work, đính kèm ảnh test xanh, kéo thẻ sang cột <strong>In Review</strong>.</li>
<li>Chưa quen Git thì gửi nguyên tệp <code>.java</code> cho nhóm trưởng hoặc đính kèm vào thẻ. Đừng dán code vào tin nhắn.</li>
<li>Nhóm trưởng xem Pull Request, chạy lại <code>./mvnw test</code> trên máy dùng để thuyết trình cho xanh, rồi mới gộp (merge).</li>
</ul>
<h3>Lúc thuyết trình</h3>
<p>Cùng nguyên tắc với workbook: <strong>mỗi người trình bày phần của mình</strong>, mở <strong>lớp test của chính mình</strong> trên máy thuyết trình và chạy cho cô xem — ví dụ <code>./mvnw test -Dtest=UserServiceChangeStatusTest</code> — vì cô muốn có chạy code demo, có slide, và thấy được test nằm ở đâu trong dự án.</p>
<h3>Thực hành — checkLabOpen của Thành viên 5</h3>
<p>Giờ mở cửa 07:00–21:00, mỗi lượt đặt dài 30 phút. Viết hai khoảng làm case B và hai khoảng làm case A.</p>
${ansVi('B và A', 'B: 07:00–07:30 (bắt đầu đúng lúc mở cửa) và 20:30–21:00 (kết thúc đúng lúc đóng cửa). A: 06:30–07:00 và 21:00–21:30, nằm ngay ngoài giờ mở cửa. Làm xong gửi cho Thành viên 5 để đối chiếu.')}
${card(FN_LIST, '📋', 'docs/lab2/function-list.md', 'Đủ 24 hàm: tệp, LOC, luật, mã lỗi, hàm dự phòng', 'MỞ →')}
${card(`${REPO}/pulls`, '🔀', 'Pull Request của LabFlow-AI-demo', 'Nhánh đích: lab2-unit-test', 'GITHUB →')}
${ctwVi()}`),
  ].join('\n'),
};

/* ═══════════════════════ L2.15 — Điền 5.1 trên CT Work, xuất Excel, thuyết trình ═══════════════════════ */
const L215 = {
  title: 'L2.15 — Worked project (6): Report 5.1 on CT Work, Excel export, presenting|||L2.15 — Dự án làm thật (6): điền 5.1 trên CT Work, xuất Excel, thuyết trình & nộp',
  slug: 'swt301-lab2-report51-ct-work-excel',
  type: 'DOCUMENT',
  description: 'Chặng về đích: màn hình Tests → Unit tests (5.1) trên CT Work, nhập ma trận (Value, Test case, bấm ô đánh O, N/A/B, P/F, Defect ID), Table view cho nhóm trưởng, Cover & changes, Export 5.1 ra .xlsx 28 sheet (link và Sub Total tự đúng) — kèm tệp xuất thật để tải; cách thuyết trình theo yêu cầu của cô (chạy code demo + slide + chỉ chỗ đã test) và gói nộp.',
  content: [
    bi(`<span class="eyebrow">Lab 2 · Worked project · Part 6 of 6 · Video swt-l2-5</span>
<h2>The finish line: Report 5.1 on CT Work, the Excel file, the presentation</h2>
<p class="lead">The lecturer told the group what the presentation must contain: <strong>a live run of the code, slides, and showing where in the project it was tested</strong>. So three things are graded together: the 5.1 file, test code that really runs, and your understanding of your part. Drawing the matrix by hand in Excel is error-prone (remember the two bugs of the sample file), so the group enters it on CT Work and lets it export the official layout.</p>
${vidEn(6)}
<h3>The screen: Tests → Unit tests (5.1)</h3>
<ul>
<li>Open the project, <strong>Tests</strong> in the sidebar, tab <strong>Unit tests (5.1)</strong>.</li>
<li>The row of numbers at the top is the Statistics sheet, computed live: 24 functions, test cases, Passed, Failed, Untested, coverage. The last tile is the 100 TC/KLOC norm — red means the group is still below the floor of 65.</li>
<li>Left column: the 24 functions grouped by class; a yellow triangle = fewer cases than the norm.</li>
<li>Click a function (e.g. <code>login</code>): the middle shows its sheet. <strong>Details</strong> holds description, precondition, test requirement, LOC, Created By, Executed By. Below it: the Condition block, the Confirmation block, and the Result block (N/A/B, Passed/Failed, Executed Date, Defect ID).</li>
</ul>
<h3>Entering the matrix</h3>
<div class="table-wrap"><table>
<thead><tr><th>Button / action</th><th>Effect</th></tr></thead>
<tbody>
<tr><td><strong>Input</strong></td><td>Adds an input group (e.g. <code>email</code>)</td></tr>
<tr><td><strong>Value</strong></td><td>Adds one concrete value under the group</td></tr>
<tr><td><strong>Test case</strong></td><td>Adds a column, named with the next UTCID</td></tr>
<tr><td>Click a cell</td><td>Marks O; click again to clear</td></tr>
<tr><td>Type row</td><td>Choose N, A or B per column</td></tr>
<tr><td>Passed/Failed row</td><td>After running JUnit: P or F + Executed Date; F ⇒ Bug key in Defect ID</td></tr>
</tbody>
</table></div>
<p>Counters and Statistics re-add immediately. Anyone can enter from any machine (it is a web page); each member edits only their own functions.</p>
<h3>Table view and Cover — for the team lead</h3>
<p><strong>Table</strong> shows all 24 functions in one grid: class, function, LOC, minimum TC, TC so far, Passed, Failed, Untested — one look tells you who is missing cases or has not run tests yet. <strong>Cover &amp; changes</strong> opens the cover: project name, code, norm 100, test environment and the Record of change.</p>
<h3>Export 5.1 (.xlsx)</h3>
<p><strong>Export 5.1</strong> downloads one Excel file whose name starts with the project code LFD. The real export has <strong>28 sheets</strong>: Guideline, Cover, Functions, Statistics and 24 function sheets. On Functions, clicking <code>login</code>, <code>register</code>, <code>createLab</code>… opens the right sheet; Statistics has a Sub Total covering all 24 rows (rows 10–33); the two <code>changeStatus</code> functions are separate sheets.</p>
${card(XLSX, '📊', 'Download the real export: LFD_Report5.1_Unit_Test_Report.xlsx', '28 sheets · exported from CT Work while recording (login matrix of 13 UTCIDs filled as the worked example; other functions in progress) · author names replaced by "Member N"', 'DOWNLOAD →')}
<p class="ghi-chu">Open it to study the layout, the links and the formulas. Hand in your own group's export, never this one.</p>
<div class="pitfall co-tieu-de"><strong>P/F only after a real run.</strong> Writing P into the matrix before the JUnit test exists is the fastest way to lose the presentation: the lecturer asks you to run that column and nothing runs. Untested is an honest state; a fake P is not.</div>
<h3>Presenting: each member, their own part</h3>
<ol>
<li>1–2 slides per member: the functions you tested, a screenshot of your 5.1 matrix, a screenshot of your green run, and one B case explained carefully.</li>
<li>Open your test class in IntelliJ and show where it lives — <code>src/test/java</code>, same package as the class under test.</li>
<li>Run it for the lecturer: the green triangle next to the class, or the one-line command for a single method. If the lecturer points at column UTCID04, open <code>utcid04_…</code> — the test name matches the column.</li>
</ol>
<p>The team lead prepares one laptop: IntelliJ with the repo open, a terminal in <code>backend/</code>, and each member's command in the speaker notes. Rehearse once, for real, the evening before.</p>
<pre><code class="language-bash">./mvnw test -Dtest=AuthServiceLoginTest                       # one class
./mvnw test -Dtest="AuthServiceLoginTest#utcid04*"            # one UTCID
.\\mvnw.cmd test "-Dtest=AuthServiceLoginTest"                 # Windows</code></pre>
<h3>The hand-in package and on-time evidence</h3>
<ul>
<li>The 5.1 Excel file, the slides (.pptx + .pdf), screenshots of the test runs; the test code on <code>lab2-unit-test</code>.</li>
<li>When you have submitted, move your card to <strong>In Review</strong> — CT Work records the time, your proof of an on-time submission. The team lead screenshots <strong>Reports → Contributions</strong>.</li>
<li>Exact deadline and file naming: follow what the lecturer says in class.</li>
</ul>
<h3>Practice (team lead)</h3>
<ol><li>Export 5.1, open it, click all 24 links on Functions.</li><li>Check that Sub Total on Statistics covers all 24 rows.</li><li>Rehearse your part in two minutes, ending with the command that runs <code>AuthServiceLoginTest</code>.</li></ol>
${ansEn('done', 'No broken link, Sub Total complete, and the test class runs green in front of the audience.')}
<h3>The whole series in four lines</h3>
<p>LabFlow Demo has three layers; Lab 2 tests 24 service functions, run with <code>mvnw test</code>. Report 5.1 is one shared workbook: Cover, Functions with links, Statistics, one sheet per function with Condition, Confirmation, N/A/B and P/F. Every function goes through five steps: design on CT Work, write and run JUnit, record results, export, slides. Presentation: each member presents their own part, opens their own test class and runs it.</p>
${ctwEn()}`,

`<span class="eyebrow">Lab 2 · Dự án làm thật · Phần 6/6 · Video swt-l2-5</span>
<h2>Về đích: Report 5.1 trên CT Work, file Excel, thuyết trình</h2>
<p class="lead">Cô đã trả lời nhóm về buổi thuyết trình: <strong>có chạy code demo, có slide, và có chỉ ra chỗ đã test trong project</strong>. Nghĩa là cô chấm ba thứ cùng lúc: file báo cáo 5.1, code test chạy thật, và việc bạn hiểu phần của mình. Tự kẻ ma trận trong Excel rất dễ sai (nhớ hai lỗi của file mẫu ở bài L2.12), nên nhóm nhập trên CT Work rồi để nó xuất Excel đúng mẫu.</p>
${vidVi(6)}
<h3>Màn hình Tests → Unit tests (5.1)</h3>
<ul>
<li>Mở project, vào mục <strong>Tests</strong> ở thanh bên, chọn tab <strong>Unit tests (5.1)</strong>.</li>
<li>Hàng ô số trên cùng chính là sheet Statistics, tính sẵn: 24 hàm, số test case, Passed, Failed, Untested, tỉ lệ coverage. Ô cuối là chuẩn 100 TC/KLOC — số đỏ nghĩa là nhóm chưa đạt sàn 65.</li>
<li>Cột trái: danh sách 24 hàm nhóm theo lớp; hàm có tam giác vàng là còn thiếu test case so với chuẩn.</li>
<li>Bấm một hàm (ví dụ <code>login</code>): phần giữa hiện đúng sheet của hàm đó. Mục <strong>Details</strong> để điền mô tả, tiền điều kiện, yêu cầu test, số dòng code, Created By, Executed By. Kéo xuống là khối Condition, khối Confirmation, và khối Result (N/A/B, Passed/Failed, ngày chạy, Defect ID).</li>
</ul>
<h3>Nhập ma trận: Value · Test case · bấm ô đánh O</h3>
<div class="table-wrap"><table>
<thead><tr><th>Nút / thao tác</th><th>Tác dụng</th></tr></thead>
<tbody>
<tr><td><strong>Input</strong></td><td>Thêm một nhóm đầu vào (ví dụ <code>email</code>)</td></tr>
<tr><td><strong>Value</strong></td><td>Thêm một giá trị cụ thể dưới nhóm đó</td></tr>
<tr><td><strong>Test case</strong></td><td>Thêm một cột, tự đặt tên UTCID kế tiếp</td></tr>
<tr><td>Bấm vào ô</td><td>Đánh chữ O; bấm lần nữa là bỏ</td></tr>
<tr><td>Hàng Type</td><td>Chọn N, A hoặc B cho từng cột</td></tr>
<tr><td>Hàng Passed/Failed</td><td>Sau khi chạy JUnit: chọn P hoặc F, điền ngày chạy; F ⇒ ghi mã thẻ Bug vào Defect ID</td></tr>
</tbody>
</table></div>
<p>Các ô đếm và Statistics tự cộng lại ngay. Ai cũng nhập được, từ máy nào cũng được, vì CT Work là trang web; mỗi người chỉ sửa hàm của mình. (Cảnh nhập trong video là mô phỏng, để không đụng vào dữ liệu thật của nhóm.)</p>
<h3>Table view và Cover — dành cho nhóm trưởng</h3>
<p>Nút <strong>Table</strong> hiện cả 24 hàm trong một bảng: lớp, tên hàm, số dòng code, số case tối thiểu, số case đã có, Passed, Failed, Untested — nhìn một lượt là biết bạn nào còn thiếu case, bạn nào chưa chạy test, để nhắc trước hạn. Nút <strong>Cover &amp; changes</strong> mở trang bìa: tên dự án, mã dự án, chuẩn 100, môi trường test và bảng Record of change.</p>
<h3>Export 5.1 (.xlsx) → mở file Excel</h3>
<p>Xong hết thì bấm <strong>Export 5.1</strong>: CT Work tải về một file Excel, tên bắt đầu bằng mã dự án LFD. File xuất thật có đúng <strong>28 sheet</strong>: Guideline, Cover, Functions, Statistics và 24 sheet hàm. Ở sheet Functions, bấm <code>login</code>, <code>register</code>, <code>createLab</code>… đều nhảy đúng sheet — không còn lỗi thiếu chữ r như file mẫu; sheet Statistics có Sub Total cộng đủ 24 dòng (dòng 10 tới 33); hai hàm cùng tên <code>changeStatus</code> được tách thành hai sheet riêng. Đây là file nộp cho cô — một file duy nhất cho cả nhóm.</p>
${card(XLSX, '📊', 'Tải tệp xuất thật: LFD_Report5.1_Unit_Test_Report.xlsx', '28 sheet · xuất từ CT Work lúc quay video (ma trận login 13 UTCID là ví dụ mẫu đã điền; các hàm khác đang làm dở) · tên người tạo đã thay bằng "Thành viên N"', 'TẢI VỀ →')}
<p class="ghi-chu">Mở ra để học bố cục, link và công thức. Nộp tệp do chính nhóm bạn xuất, đừng nộp tệp này.</p>
<div class="pitfall co-tieu-de"><strong>Chỉ ghi P/F sau khi chạy thật.</strong> Ghi chữ P vào ma trận khi chưa có test JUnit là cách nhanh nhất để mất điểm thuyết trình: cô bảo chạy cột đó và không có gì để chạy. Untested là trạng thái trung thực; P giả thì không.</div>
<h3>Thuyết trình: mỗi người phần của mình</h3>
<ol>
<li>Mỗi người khoảng 1–2 slide: các hàm mình test, ảnh ma trận 5.1, ảnh test chạy xanh, và giải thích kỹ một case B.</li>
<li>Mở lớp test của mình trong IntelliJ, chỉ cho cô thấy test nằm ở đâu — <code>src/test/java</code>, cùng gói với lớp được test.</li>
<li>Chạy cho cô xem: bấm tam giác xanh cạnh tên lớp, hoặc gõ lệnh chạy đúng một hàm cô chỉ. Cô chỉ vào cột UTCID04 thì bạn mở ngay hàm <code>utcid04_…</code>, vì tên test trùng mã cột.</li>
</ol>
<p>Nhóm trưởng chuẩn bị sẵn trên một máy: IntelliJ mở repo, một cửa sổ terminal ở thư mục <code>backend/</code>, và lệnh của từng người ghi trong speaker notes. Tập dượt một lượt đúng như thật vào tối hôm trước.</p>
<pre><code class="language-bash">./mvnw test -Dtest=AuthServiceLoginTest                       # một lớp
./mvnw test -Dtest="AuthServiceLoginTest#utcid04*"            # đúng một UTCID
.\\mvnw.cmd test "-Dtest=AuthServiceLoginTest"                 # Windows</code></pre>
<h3>Gói nộp + bằng chứng đúng giờ</h3>
<ul>
<li>File Excel 5.1, file slide (.pptx + .pdf), ảnh kết quả chạy test; code test đã gộp vào nhánh <code>lab2-unit-test</code>.</li>
<li>Nộp xong thì kéo thẻ của mình sang <strong>In Review</strong> — CT Work ghi lại giờ, đó là dấu đã nộp đúng hạn. Nhóm trưởng mở <strong>Reports → Đóng góp</strong> (Contributions), chụp một ảnh: ai hoàn thành bao nhiêu thẻ, có đúng hạn không.</li>
<li>Giờ cụ thể và cách đặt tên file nộp: làm đúng theo lời cô dặn trên lớp.</li>
</ul>
<h3>Thực hành (nhóm trưởng)</h3>
<ol><li>Xuất file 5.1 từ CT Work, mở ra, bấm thử cả 24 link ở sheet Functions.</li><li>Ở sheet Statistics, kiểm ô Sub Total có cộng đủ 24 dòng không.</li><li>Tập nói phần của bạn trong hai phút, kết thúc bằng lệnh chạy lớp <code>AuthServiceLoginTest</code>.</li></ol>
${ansVi('đạt', 'Không link nào hỏng, Sub Total đủ, và lớp test chạy xanh ngay trước mặt người nghe.')}
<h3>Tóm tắt cả loạt trong bốn dòng</h3>
<p>LabFlow Demo có ba tầng; Lab 2 test 24 hàm service, chạy bằng <code>mvnw test</code>. Báo cáo 5.1 là một workbook chung: Cover, Functions có link, Statistics, và mỗi hàm một sheet với Condition, Confirmation, N/A/B, P/F. Mỗi hàm đi năm bước: thiết kế trên CT Work, viết và chạy JUnit, ghi kết quả, xuất Excel, làm slide. Thuyết trình: mỗi người phần mình, mở lớp test của mình, và chạy cho cô xem.</p>
${ctwVi()}`),
  ].join('\n'),
};

export default [L210, L211, L212, L213, L214, L215];
