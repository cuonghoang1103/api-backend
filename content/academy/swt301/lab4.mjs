/**
 * SWT301 · Lab 4 — System test report (Report 5.3) trên LabFlow Demo. Bài cuối của chuỗi Lab 2 → 3 → 4.
 *
 * Nguồn (đều mở ra đọc thật, từng ô và từng công thức):
 *   - Tệp mẫu cô gửi 24/10/2026: ABClinic_ISP490_Report5.3_System Test.xlsx (9 sheet, 96 test case) —
 *     dump bằng openpyxl (công thức + giá trị đã tính). Tên người trong tệp KHÔNG chép lại: gọi "nhóm mẫu".
 *   - Template môn: 01.Materials/05.Templates/Report5.3_System Test.xlsx và Report5.2_Integration Test.xlsx.
 *   - Mẫu 5.2 nhóm APHL ISP490 G1 (đã gửi trước) — để so: Cover/thống kê/round giống hệt khuôn ABClinic.
 *   - Slide SWT2 slide 75–81 (system testing) — bài 2.3 slug swt301-system-acceptance.
 *   - LabFlow Demo (repo cuonghoang1103/LabFlow-AI-demo, nhánh main, commit f85c919): toàn bộ 16 test case
 *     StudentBooking SB1–SB16 trong bài L4.3 đã CHẠY THẬT 24/10/2026 (JDK 21.0.9, profile h2, app vừa khởi động):
 *     mọi Expected khớp, trừ SB7 bước 3 — GET /availability thiếu "to" trả HTTP 500 INTERNAL_ERROR (lỗi thật).
 *   - CT Work project swt301/LAB4 (dựng 24/10): 5 workflow 5.3, cover, record of change, 12 thẻ việc.
 *   - Mã xuất Excel 5.3 của CT Work: src/services/work/fptTests.ts › buildSystemSheets (3 round, Evidence gói vào Note).
 * Đề Lab 4 KHÔNG có văn bản — mọi chỗ "suy ra" được đánh dấu rõ trong bài L4.1.
 */
import { bi, books, ansEn, ansVi } from './_slides.mjs';

const REPO = 'https://github.com/cuonghoang1103/LabFlow-AI-demo';
const BLOB = `${REPO}/blob/main`;

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
const step = (k, t, d) => `<div class="lz-step"><div class="lz-k">${k}</div><div class="lz-t">${t}</div><div class="lz-d">${d}</div></div>`;
const flow = (...steps) => `<div class="lz-flow">${steps.join('')}</div>`;

/* ─────────────────────── dữ liệu dùng chung ─────────────────────── */

// Năm workflow của nhóm (đúng 5 sheet đã dựng trên CT Work swt301/LAB4).
const WF = [
  ['TV1 (team lead)|||TV1 (nhóm trưởng)', 'StudentBooking', 'SB', 'Student', 'register → verify → sign in → find a free lab → book → follow → sign out|||đăng ký → xác minh → đăng nhập → tìm phòng trống → đặt → theo dõi → đăng xuất', '16 (worked example)|||16 (ví dụ mẫu)'],
  ['TV2', 'AccountAdministration', 'AA', 'Admin', 'create accounts → user signs in; change roles → new token needed; lock / unlock; profiles; search|||tạo tài khoản → người đó đăng nhập; đổi vai → cần token mới; khoá / mở khoá; hồ sơ; tìm kiếm', '14–16'],
  ['TV3', 'LabSetup', 'LS', 'Manager', 'building → labs of 30 / 31 seats → students book CONFIRMED / PENDING; edit with version; close / reopen|||toà nhà → lab 30 / 31 chỗ → sinh viên đặt CONFIRMED / PENDING; sửa có version; đóng / mở lab', '14–16'],
  ['TV4', 'EquipmentOperations', 'EO', 'Manager + Staff', 'add equipment → students find it → maintenance → back; bulk all-or-nothing; RETIRED is final|||thêm thiết bị → sinh viên tìm thấy → bảo trì → trả về; đổi hàng loạt tất-cả-hoặc-không; RETIRED là cuối', '14–16'],
  ['TV5', 'CalendarPolicy', 'CP', 'Manager + Admin + Lecturer', 'opening hours, blackouts and Settings change → search and bookings follow at once; always restore|||giờ mở cửa, blackout, Settings đổi → tìm phòng và đặt phòng đổi theo ngay; luôn dọn lại', '14–16'],
];
const wfTable = (lang) => {
  const pick = (s) => (s.includes('|||') ? s.split('|||')[lang === 'en' ? 0 : 1] : s);
  const head = lang === 'en'
    ? '<tr><th>Member</th><th>Workflow (sheet)</th><th>Prefix</th><th>Main role</th><th>The journey</th><th>Cases</th></tr>'
    : '<tr><th>Thành viên</th><th>Workflow (sheet)</th><th>Tiền tố</th><th>Vai chính</th><th>Hành trình</th><th>Số case</th></tr>';
  return `<div class="table-wrap"><table><thead>${head}</thead><tbody>${WF.map((w) => `<tr><td>${pick(w[0])}</td><td><strong>${w[1]}</strong></td><td><code>${w[2]}</code></td><td>${w[3]}</td><td>${pick(w[4])}</td><td>${pick(w[5])}</td></tr>`).join('')}</tbody></table></div>`;
};

// 16 case StudentBooking — bản tóm tắt (bản đầy đủ nằm trên CT Work). [id, scenario, kiểm gì, dữ liệu chính, kết quả mong đợi chính]
const SB = [
  ['SB1', 'Create an account and sign in', 'New student registers with a school e-mail, verifies it, signs in, opens own profile', 'st.sb01@fpt.edu.vn / Passw0rd1; token from the console log', '201 PENDING → 200 "Email verified, you can log in now" → 200 Bearer, expiresIn 900, roles [STUDENT] → /me ACTIVE'],
  ['SB2', 'Create an account and sign in', 'Non-school e-mail cannot register, so cannot sign in (BR-01)', 'st.sb02@gmail.com', '400 AUTH_EMAIL_DOMAIN_NOT_ALLOWED; no e-mail; login 401 AUTH_INVALID_CREDENTIALS'],
  ['SB3', 'Create an account and sign in', 'Sign-in blocked until the link is used; the link works once (BR-03)', 'st.sb03@fpt.edu.vn', '403 AUTH_EMAIL_NOT_VERIFIED → verify 200 → same token 400 AUTH_TOKEN_USED → login 200'],
  ['SB4', 'Create an account and sign in', '5 wrong passwords lock the account even for the right password (BR-02)', 'st.sb04@fpt.edu.vn, Wrong1234 ×5', '401 ×4 → 423 AUTH_ACCOUNT_TEMP_LOCKED → correct password still 423'],
  ['SB5', 'Find a free lab', 'Buildings and labs with capacity, status, approval flag; filter', 'GET /buildings, /labs, /labs/3, ?status=ACTIVE&minCapacity=26', '2 buildings; totalItems 4; BE-201 60 seats requiresApproval true; filter gives BE-201, AL-301'],
  ['SB6', 'Find a free lab', 'Opening hours and planned closures before booking', 'GET /labs/1/hours, /labs/1/blackouts', 'Mon–Sat 07:00–21:00, Sunday closed; blackouts []'],
  ['SB7', 'Find a free lab', 'Availability lists only active, free, big-enough labs; a wrong search is refused cleanly', 'D 02:00Z–04:00Z, capacity 20 / 40 / "to" missing', 'AL-301, AL-302, BE-201 · only BE-201 · expected 400 — real result 500 ⇒ Failed'],
  ['SB8', 'Book a lab', 'Book a lab of ≤ 30 seats: CONFIRMED, in My reservations, no longer offered', 'AL-301, D 09:00–11:00, key st-sb08-0001', '201 CONFIRMED, replayed false; availability without AL-301; /mine has it'],
  ['SB9', 'Book a lab', 'Double submit with the same Idempotency-Key makes one booking', 'same request as SB8', '200 (not 201), same id, replayed true; still one booking'],
  ['SB10', 'Book a lab', 'Lab of > 30 seats waits for approval (BR-06)', 'BE-201, D+1 09:00–11:00', '201 PENDING'],
  ['SB11', 'Book a lab', 'Second student: overlap refused, adjacent slot accepted, cannot see the first student\'s bookings', 'student2, AL-301 10:00–12:00 then 11:00–12:00', '/mine [] → 409 RES_CONFLICT → 201 CONFIRMED → only own booking'],
  ['SB12', 'Book a lab', 'Opening hours (BR-04): last half hour OK, past 21:00 and Sunday refused', 'AL-302, 20:30–21:30 / 20:30–21:00 / Sunday', '400 TIME_OUTSIDE_OPENING_HOURS · 201 · availability [] · 400'],
  ['SB13', 'Book a lab', 'Booking window (BR-05): past and > 14 days refused, 13 days accepted', 'yesterday / +13 days / +16 days', '400 TIME_IN_PAST · 201 · 400 TIME_TOO_FAR_AHEAD'],
  ['SB14', 'Book a lab', '30-minute grid, closed lab, missing Idempotency-Key', '09:15 start / BE-105 / no header', '400 TIME_SLOT_MISALIGNED · 409 LAB_INACTIVE · 400 RES_IDEMPOTENCY_KEY_REQUIRED · no new booking'],
  ['SB15', 'Role limits and end of session', 'A student cannot use manager / admin functions', 'POST /labs AL-499, GET /users', '403 FORBIDDEN; AL-499 not created; /users 403'],
  ['SB16', 'Role limits and end of session', 'After logout the refresh token is dead; bookings are kept', 'logout, refresh, /mine without token, sign in again', '200 "Logged out" → 400 AUTH_TOKEN_USED → 401 UNAUTHORIZED → bookings of SB8, SB10, SB12, SB13 still listed'],
];
const SB_VI_DESC = {
  SB1: 'Sinh viên mới đăng ký bằng email trường, xác minh, đăng nhập, mở hồ sơ của mình',
  SB2: 'Email ngoài trường không đăng ký được nên cũng không đăng nhập được (BR-01)',
  SB3: 'Chưa bấm link xác minh thì không đăng nhập được; link chỉ dùng một lần (BR-03)',
  SB4: 'Sai mật khẩu 5 lần liền ⇒ khoá, kể cả khi gõ đúng ngay sau đó (BR-02)',
  SB5: 'Xem toà nhà, phòng lab (sức chứa, trạng thái, cờ cần duyệt) và lọc',
  SB6: 'Xem giờ mở cửa và lịch đóng cửa trước khi đặt',
  SB7: 'Tìm phòng trống chỉ ra phòng đang mở, còn trống, đủ chỗ; tìm sai phải bị từ chối gọn gàng',
  SB8: 'Đặt phòng ≤ 30 chỗ: CONFIRMED ngay, hiện trong "của tôi", không còn được mời cho người khác',
  SB9: 'Bấm gửi hai lần cùng Idempotency-Key chỉ tạo một lượt đặt',
  SB10: 'Phòng > 30 chỗ phải chờ duyệt (BR-06)',
  SB11: 'Sinh viên thứ hai: trùng giờ bị từ chối, giờ liền kề được nhận, không xem được lượt của người kia',
  SB12: 'Giờ mở cửa (BR-04): nửa giờ cuối được, quá 21:00 và Chủ nhật bị từ chối',
  SB13: 'Khoảng được đặt (BR-05): quá khứ và quá 14 ngày bị từ chối, 13 ngày được',
  SB14: 'Lệch lưới 30 phút, phòng đã đóng, thiếu Idempotency-Key',
  SB15: 'Sinh viên không dùng được chức năng của quản lý / admin',
  SB16: 'Đăng xuất xong refresh token chết; lượt đặt vẫn còn',
};
const sbTable = (lang) => {
  const head = lang === 'en'
    ? '<tr><th>ID</th><th>Scenario</th><th>What the case checks</th><th>Key test data</th><th>Expected (main points)</th></tr>'
    : '<tr><th>ID</th><th>Scenario</th><th>Case kiểm gì</th><th>Dữ liệu chính</th><th>Kết quả mong đợi (ý chính)</th></tr>';
  return `<div class="table-wrap"><table><thead>${head}</thead><tbody>${SB.map((r) => `<tr><td><strong>${r[0]}</strong></td><td>${r[1]}</td><td>${lang === 'en' ? r[2] : SB_VI_DESC[r[0]]}</td><td>${r[3]}</td><td>${r[4]}</td></tr>`).join('')}</tbody></table></div>`;
};

/* ═══════════════════════ L4.1 — Đề bài & yêu cầu ═══════════════════════ */
const L41 = {
  title: 'L4.1 — Lab 4 brief: what to hand in for the Report 5.3 system test, and how it differs from Lab 3|||L4.1 — Đề Lab 4: nộp gì cho báo cáo system test 5.3, và khác Lab 3 ở đâu',
  slug: 'swt301-lab4-de-bai',
  type: 'DOCUMENT',
  description: 'Bài mở đầu Lab 4 (bài lab cuối): cô chỉ gửi tệp mẫu ABClinic Report 5.3 nên đề được suy ra từ mẫu + template môn — nộp gì, mỗi sheet gồm gì, bao nhiêu case, mấy round, Evidence là gì, công thức coverage, chia 5 thành viên, system test khác integration test (có ví dụ), checklist nộp và 10 câu cô hay hỏi.',
  content: [
    bi(`<span class="eyebrow">Lab 4 · Lesson 4.1 · Report5.3_System Test.xlsx · ABClinic sample · SWT2 slides 75–81</span>
<h2>The last lab: test the whole system the way its users do</h2>
<p class="lead">Lab 2 tested single <strong>methods</strong> (Report 5.1). Lab 3 tested <strong>modules wired together</strong> (Report 5.2). Lab 4 closes the chain: the <strong>whole running system</strong>, one end-to-end <strong>business workflow</strong> per member, recorded in <strong>Report 5.3 – System Test</strong>.</p>
${flow(step('Lab 2 · 5.1', 'Unit', 'one method, mocks, JUnit'), step('Lab 3 · 5.2', 'Integration', 'API ↔ security ↔ service ↔ DB'), step('Lab 4 · 5.3', 'System', 'a user\'s whole journey, several roles'))}
<div class="pitfall co-tieu-de"><strong>There is no written brief.</strong> The lecturer only sent a filled sample: <em>ABClinic_ISP490_Report5.3_System Test.xlsx</em>, the report of another group (ISP490). Everything below is marked either <strong>documented</strong> (read from that sample, the official 5.3 template or the SWT2 slides) or <strong>inferred</strong> (our reasoning — confirm it with the lecturer). The lecturer has also merged the Lab 2, 3 and 4 presentations into one session, so the deadline is probably the next class (inferred).</div>
<h3>1 · What you hand in</h3>
<div class="table-wrap"><table>
<thead><tr><th>#</th><th>Deliverable</th><th>Source</th></tr></thead>
<tbody>
<tr><td>1</td><td><strong>One Excel file Report 5.3</strong>: Cover, Test Cases, Test Statistics + <strong>one sheet per workflow</strong></td><td>documented (sample + template)</td></tr>
<tr><td>2</td><td><strong>Evidence screenshots</strong> — one per case and round, named after the case ID, e.g. <code>LAB4_SB8_R1.png</code></td><td>inferred (the sample has an Evidence column but left all 96 cells empty)</td></tr>
<tr><td>3</td><td><strong>Defect list</strong> — a Bug card per failure, its key in the Note column</td><td>inferred (as in Lab 3)</td></tr>
<tr><td>4</td><td><strong>English slides</strong> and a short presentation, together with Lab 2 and Lab 3</td><td>inferred</td></tr>
</tbody></table></div>
<h3>2 · What every sheet contains (documented)</h3>
<ul>
<li><strong>Cover</strong> — Project Name, Project Code, Document Code (<code>LFD_TestReport5.3_v1.0</code>), Creator, Issue Date, Version, and the <strong>Record of change</strong> (Effective Date · Version · Change Item · A/D/M · Change description · Reference): one row per workflow added or modified.</li>
<li><strong>Test Cases</strong> — the <strong>Test Environment Setup Description</strong> (server, database, browser, tools, test accounts) and one row per workflow: No · Function Name · Sheet Name (a link) · Description · Pre-Condition.</li>
<li><strong>Test Statistics</strong> — Creator, Reviewer/Approver, Issue Date, Notes; per workflow Passed · Failed · Pending · N/A · Number of test cases; a Sub total; two percentages.</li>
<li><strong>One sheet per workflow</strong> — header: Workflow, Test requirement, Number of TCs, a Round × Passed/Failed/Pending/N/A table; then the cases: <strong>Test Case ID</strong> <code>&lt;SB1&gt;</code> · <strong>Description</strong> ("Verify that…") · <strong>Procedure</strong> (numbered steps with concrete data) · <strong>Expected Results</strong> (numbered, exact messages) · <strong>Pre-conditions</strong> · <strong>Evidence</strong> · <strong>Round n / Test date / Tester</strong> · <strong>Note</strong>. Group rows (scenarios) split the cases into stages of the journey.</li>
</ul>
<h3>3 · The two formulas</h3>
<ul>
<li><strong>Test coverage</strong> = (Passed + Failed) × 100 / (Total − N/A) — how much of what applies <em>was executed</em>.</li>
<li><strong>Test successful coverage</strong> = Passed × 100 / (Total − N/A) — how much <em>passed</em>.</li>
<li>N/A is subtracted because a case that does not apply to this release cannot be "not yet covered". The sample takes the numbers of its <strong>last round</strong> (Round 4).</li>
</ul>
<h3>4 · How many cases, how many rounds</h3>
<ul>
<li><strong>Cases</strong> (inferred): the sample has <strong>96 cases in 6 sheets</strong> (14–19 each); the 5.2 sample of the APHL group had 155 in 8. Our target: <strong>14–18 per member, at least 75 for the team</strong>, each workflow with happy paths, error paths, boundary values and role limits.</li>
<li><strong>Rounds</strong> (not decided): the official 5.3 template has <strong>3</strong>, the ABClinic sample <strong>4</strong>, CT Work's 5.3 sheet currently 3. Plan: Round 1 by the owner → Round 2 re-run of failures <em>by another member</em> (system testing is typically done by <strong>independent testers</strong>, SWT2 slide 77) → Round 3 full regression on the final build; a Round 4 only if the lecturer asks.</li>
</ul>
<h3>5 · Evidence</h3>
<p>A screenshot that proves the case was really run <em>and</em> shows the result. LabFlow Demo has no web front-end yet, so the screen is <strong>Swagger UI</strong> (or Postman): method, URL, request body, HTTP status and the JSON answer must all be visible. For a multi-step case, capture the decisive step or join 2–3 shots.</p>
<h3>6 · Five members, five roles</h3>
${wfTable('en')}
<p>Each member owns the workflow of one role, so the five sheets together cover every role of the system — exactly the way the sample split ABClinic by patient, receptionist and doctor flows.</p>
<h3>7 · System test (5.3) vs integration test (5.2)</h3>
<div class="table-wrap"><table>
<thead><tr><th></th><th>Integration — Lab 3, Report 5.2</th><th>System — Lab 4, Report 5.3</th></tr></thead>
<tbody>
<tr><td>Question</td><td>Do the <strong>parts wired together</strong> talk correctly (API ↔ security ↔ service ↔ DB)?</td><td>Can the <strong>whole system</strong> do the user's job <strong>from start to finish</strong> as the requirements say?</td></tr>
<tr><td>One sheet is</td><td>a module / feature (Authentication, Equipment…)</td><td>a business workflow of one role (Student books a lab…)</td></tr>
<tr><td>Test basis</td><td>architecture, sequence diagrams, API contract</td><td>SRS, use cases, user stories, business rules (BR)</td></tr>
<tr><td>Viewpoint</td><td>technical inside (status code, rows, tokens)</td><td>the user outside — real data, several roles in a row</td></tr>
<tr><td>Environment</td><td>MockMvc, H2, Testcontainers allowed</td><td>the running system, configured like production</td></tr>
<tr><td>Typical defect</td><td>wrong data passed between components</td><td>"the system <em>cannot complete end-to-end tasks</em>" (SWT2 slide 76)</td></tr>
</tbody></table></div>
<p><strong>Same topic, two levels.</strong></p>
<ul>
<li><em>Integration, Lab 3 RS5:</em> <code>POST /reservations</code> with an overlapping slot answers <strong>409 RES_CONFLICT</strong> — the service and the database constraint agree.</li>
<li><em>System, Lab 4 SB8 → SB11:</em> student A registers, verifies, signs in, searches, books AL-301 09:00–11:00 and sees it in "My reservations"; then <strong>student B</strong> no longer finds AL-301 for that time, is refused for 10:00–12:00, gets 11:00–12:00, and cannot see A's booking. One case is <strong>one journey</strong> across functions and people.</li>
</ul>
<h3>8 · Checklist before you hand in</h3>
<ol>
<li>Cover: <code>LFD_TestReport5.3_v1.x</code>; the words <strong>system test</strong> (the sample wrote "intergration test"); one Record-of-change row per workflow; version raised when you modify; real documents in Reference.</li>
<li>Test Cases: environment description really filled in; the same project name on every sheet.</li>
<li>Every case: "Verify that…", numbered steps with concrete data, numbered expected results with <strong>HTTP status + error.code + exact message</strong>, pre-conditions as <strong>data states</strong>.</li>
<li>Every executed round: result, date, the <strong>real tester</strong>; Failed ⇒ Bug key in Note; Evidence file name.</li>
<li>Statistics = the last round; recompute one sheet by hand.</li>
<li>Export from CT Work, open Excel, click every sheet link; no template text <code>&lt;…&gt;</code> left.</li>
<li>No real personal data or passwords — only demo accounts.</li>
</ol>
<h3>9 · Ask the lecturer</h3>
<ol>
<li>Deadline, where to submit, presentation together with Lab 2–3?</li>
<li>3 rounds (template) or 4 (sample)?</li>
<li>Must Evidence images be embedded in Excel, or are file names / links enough?</li>
<li>LabFlow Demo has no web UI — is system testing through Swagger UI / Postman accepted?</li>
<li>A minimum number of cases?</li>
<li>Sheet label "Workflow" (template) or "Feature" (sample)?</li>
</ol>
<h3>10 · Questions the lecturer likes to ask</h3>
<ol>
<li><em>What is the difference between system and integration testing?</em> — section 7.</li>
<li><em>Why is this case a system test and not a unit test?</em> — it follows a whole user journey through several functions and roles.</li>
<li><em>What is your test basis?</em> — business rules BR-01…BR-14, <code>docs/api-v1.md</code>, the authorization matrix.</li>
<li><em>How do you compute coverage and why minus N/A?</em> — section 3.</li>
<li><em>Pending or N/A?</em> — Pending = could not run yet (blocked); N/A = does not apply to this release.</li>
<li><em>What changed between Round 1 and Round 2?</em> — tell one real defect and its retest.</li>
<li><em>Show me the evidence of &lt;SB8&gt;.</em> — open <code>LAB4_SB8_R1.png</code>.</li>
<li><em>Which boundary values did you test?</em> — 30 vs 31 seats; 13 vs 15 days; 20:30–21:00 vs 20:30–21:30.</li>
<li><em>Who was the independent tester?</em> — the member who ran Round 2.</li>
<li><em>Which defect did you find?</em> — SB7: a search without <code>to</code> returns 500 instead of 400.</li>
</ol>
${inner('swt301-system-acceptance', '📑', 'Theory first: lesson 2.3 — system & acceptance testing (SWT2 slides 75–105)', 'Objectives, test basis, typical defects, independent testers, production-like environment', 'OPEN →')}
${inner('swt301-lab3-report-templates', '🧾', 'Lesson 3.1 — the three Report5 templates sheet by sheet', 'Where 5.3 sits next to 5.1 and 5.2, and the template\'s own formula bugs', 'OPEN →')}`,
    `<span class="eyebrow">Lab 4 · Bài 4.1 · Report5.3_System Test.xlsx · mẫu ABClinic · SWT2 slide 75–81</span>
<h2>Bài lab cuối: test cả hệ thống như người dùng thật</h2>
<p class="lead">Lab 2 test từng <strong>hàm</strong> (Report 5.1). Lab 3 test các <strong>module ghép lại</strong> (Report 5.2). Lab 4 khép lại chuỗi: test <strong>cả hệ thống đang chạy</strong>, mỗi thành viên một <strong>luồng nghiệp vụ đầu-cuối (workflow — chuỗi việc của một vai từ đầu tới cuối)</strong>, ghi vào <strong>Report 5.3 – System Test</strong>.</p>
${flow(step('Lab 2 · 5.1', 'Unit', 'một hàm, mock, JUnit'), step('Lab 3 · 5.2', 'Integration', 'API ↔ bảo mật ↔ service ↔ DB'), step('Lab 4 · 5.3', 'System', 'cả hành trình của người dùng, nhiều vai'))}
<div class="pitfall co-tieu-de"><strong>Không có văn bản đề.</strong> Cô chỉ gửi một tệp mẫu đã điền: <em>ABClinic_ISP490_Report5.3_System Test.xlsx</em> — báo cáo của một nhóm khác (môn ISP490). Mọi thứ dưới đây được đánh dấu <strong>có trong tài liệu</strong> (đọc từ tệp mẫu, template 5.3 chính thức của môn hoặc slide SWT2) hoặc <strong>suy ra</strong> (nhóm tự lập luận — phải hỏi lại cô). Cô cũng đã gộp thuyết trình Lab 2, 3, 4 vào một buổi, nên hạn rất có thể là buổi học tới (suy ra).</div>
<h3>1 · Nộp gì</h3>
<div class="table-wrap"><table>
<thead><tr><th>#</th><th>Sản phẩm</th><th>Nguồn</th></tr></thead>
<tbody>
<tr><td>1</td><td><strong>Một tệp Excel Report 5.3</strong>: Cover, Test Cases, Test Statistics + <strong>mỗi workflow một sheet</strong></td><td>có trong tài liệu (mẫu + template)</td></tr>
<tr><td>2</td><td><strong>Ảnh bằng chứng (Evidence)</strong> — mỗi case mỗi vòng một ảnh, đặt tên theo ID, ví dụ <code>LAB4_SB8_R1.png</code></td><td>suy ra (mẫu có cột Evidence nhưng bỏ trống cả 96 ô)</td></tr>
<tr><td>3</td><td><strong>Danh sách lỗi</strong> — mỗi lỗi một thẻ Bug, mã thẻ ghi ở cột Note</td><td>suy ra (giống Lab 3)</td></tr>
<tr><td>4</td><td><strong>Slide tiếng Anh</strong> + thuyết trình ngắn, chung buổi với Lab 2, Lab 3</td><td>suy ra</td></tr>
</tbody></table></div>
<h3>2 · Mỗi sheet gồm gì (có trong tài liệu)</h3>
<ul>
<li><strong>Cover</strong> (trang bìa) — Project Name, Project Code, Document Code (<code>LFD_TestReport5.3_v1.0</code>), Creator (người soạn), Issue Date (ngày phát hành), Version, và bảng <strong>Record of change</strong> (nhật ký thay đổi: ngày hiệu lực · phiên bản · mục thay đổi · A/D/M = Thêm/Xoá/Sửa · mô tả · tài liệu tham chiếu): thêm hay sửa một workflow là một dòng.</li>
<li><strong>Test Cases</strong> — ô <strong>Test Environment Setup Description</strong> (mô tả môi trường test: máy chủ, CSDL, trình duyệt, công cụ, tài khoản test) và mỗi workflow một dòng: No · Function Name · Sheet Name (bấm được, nhảy tới sheet) · Description · Pre-Condition.</li>
<li><strong>Test Statistics</strong> (thống kê) — Creator, Reviewer/Approver (người duyệt), Issue Date, Notes; mỗi workflow một dòng Passed · Failed · Pending · N/A · Number of test cases; dòng Sub total (tổng); hai tỉ lệ phần trăm.</li>
<li><strong>Mỗi workflow một sheet</strong> — phần đầu: Workflow, Test requirement (yêu cầu được test), Number of TCs (số case), bảng Round × Passed/Failed/Pending/N/A; phần dưới là các case: <strong>Test Case ID</strong> <code>&lt;SB1&gt;</code> · <strong>Description</strong> ("Verify that…" — kiểm rằng…) · <strong>Procedure</strong> (các bước đánh số, dữ liệu cụ thể) · <strong>Expected Results</strong> (kết quả mong đợi, đánh số, đúng từng chữ của thông báo) · <strong>Pre-conditions</strong> (điều kiện trước) · <strong>Evidence</strong> · <strong>Round n / Test date / Tester</strong> (vòng, ngày chạy, người chạy) · <strong>Note</strong>. Các dòng tiêu đề nhóm (scenario — kịch bản con) chia case theo từng chặng của hành trình.</li>
</ul>
<h3>3 · Hai công thức</h3>
<ul>
<li><strong>Test coverage</strong> (độ phủ đã chạy) = (Passed + Failed) × 100 / (Tổng − N/A) — trong số case áp dụng được, <em>đã chạy</em> bao nhiêu phần trăm.</li>
<li><strong>Test successful coverage</strong> (độ phủ thành công) = Passed × 100 / (Tổng − N/A) — bao nhiêu phần trăm <em>qua</em>.</li>
<li>Trừ N/A vì case không áp dụng cho bản này thì không thể gọi là "chưa phủ". Tệp mẫu lấy số của <strong>vòng cuối</strong> (Round 4).</li>
</ul>
<h3>4 · Bao nhiêu case, mấy round</h3>
<ul>
<li><strong>Số case</strong> (suy ra): mẫu có <strong>96 case trong 6 sheet</strong> (14–19 mỗi sheet); mẫu 5.2 của nhóm APHL có 155 case trong 8 sheet. Nhóm mình đặt: <strong>mỗi người 14–18 case, cả nhóm ít nhất 75</strong>, workflow nào cũng có luồng đúng, luồng lỗi, giá trị biên (BVA) và giới hạn vai.</li>
<li><strong>Số round</strong> (chưa chốt): template 5.3 chính thức có <strong>3 round</strong>, mẫu ABClinic <strong>4 round</strong>, sheet 5.3 trên CT Work hiện có 3. Kế hoạch: Round 1 chủ workflow chạy → Round 2 chạy lại case lỗi <em>do người khác chạy</em> (system test thường do <strong>tester độc lập</strong> làm, SWT2 slide 77) → Round 3 hồi quy (regression — chạy lại toàn bộ) trên bản cuối; chỉ thêm Round 4 nếu cô yêu cầu.</li>
</ul>
<h3>5 · Evidence (bằng chứng)</h3>
<p>Là ảnh chụp màn hình chứng minh case đã chạy thật <em>và</em> cho thấy kết quả. LabFlow Demo chưa có giao diện web, nên màn hình dùng để test là <strong>Swagger UI</strong> (trang thử API có sẵn của dự án) hoặc Postman: phải thấy rõ method, URL, body gửi đi, mã HTTP và JSON trả về. Case nhiều bước thì chụp bước quyết định hoặc ghép 2–3 ảnh.</p>
<h3>6 · Năm thành viên, năm vai</h3>
${wfTable('vi')}
<p>Mỗi người giữ workflow của một vai, nên năm sheet cộng lại phủ đủ mọi vai của hệ thống — đúng cách tệp mẫu chia ABClinic theo luồng bệnh nhân, lễ tân, bác sĩ.</p>
<h3>7 · System test (5.3) khác integration test (5.2) chỗ nào</h3>
<div class="table-wrap"><table>
<thead><tr><th></th><th>Integration — Lab 3, Report 5.2</th><th>System — Lab 4, Report 5.3</th></tr></thead>
<tbody>
<tr><td>Câu hỏi</td><td>Các <strong>phần ghép lại</strong> có nói chuyện đúng với nhau không (API ↔ bảo mật ↔ service ↔ DB)?</td><td><strong>Cả hệ thống</strong> có làm xong việc của người dùng <strong>từ đầu tới cuối</strong> đúng yêu cầu không?</td></tr>
<tr><td>Một sheet là</td><td>một module / chức năng (Authentication, Equipment…)</td><td>một luồng nghiệp vụ của một vai (Sinh viên đặt phòng…)</td></tr>
<tr><td>Cơ sở test (test basis)</td><td>kiến trúc, sequence diagram, hợp đồng API</td><td>SRS (đặc tả yêu cầu), use case, user story, luật nghiệp vụ BR</td></tr>
<tr><td>Góc nhìn</td><td>kỹ thuật bên trong (mã trạng thái, dòng trong DB, token)</td><td>người dùng bên ngoài — dữ liệu thật, nhiều vai nối tiếp</td></tr>
<tr><td>Môi trường</td><td>được dùng MockMvc, H2, Testcontainers</td><td>hệ thống chạy thật, cấu hình giống môi trường thật</td></tr>
<tr><td>Lỗi điển hình</td><td>dữ liệu truyền sai giữa các thành phần</td><td>"hệ thống <em>không hoàn thành được tác vụ đầu-cuối</em>" (SWT2 slide 76)</td></tr>
</tbody></table></div>
<p><strong>Cùng chủ đề, hai cấp.</strong></p>
<ul>
<li><em>Integration, Lab 3 RS5:</em> gọi <code>POST /reservations</code> trùng giờ ⇒ <strong>409 RES_CONFLICT</strong> — service và ràng buộc CSDL khớp nhau.</li>
<li><em>System, Lab 4 SB8 → SB11:</em> sinh viên A đăng ký, xác minh, đăng nhập, tìm phòng, đặt AL-301 09:00–11:00, thấy trong "Lượt đặt của tôi"; rồi <strong>sinh viên B</strong> tìm cùng giờ không còn AL-301, đặt 10:00–12:00 bị từ chối, đặt 11:00–12:00 thì được, và không xem được lượt đặt của A. Một case là <strong>một hành trình</strong> đi qua nhiều chức năng và nhiều người.</li>
</ul>
<h3>8 · Checklist trước khi nộp</h3>
<ol>
<li>Cover: <code>LFD_TestReport5.3_v1.x</code>; ghi đúng chữ <strong>system test</strong> (mẫu ghi nhầm "intergration test"); mỗi workflow một dòng Record of change; sửa thì tăng version; cột Reference ghi tài liệu thật.</li>
<li>Test Cases: ô môi trường điền thật; tên dự án giống nhau ở mọi sheet.</li>
<li>Mỗi case: "Verify that…", bước đánh số có dữ liệu cụ thể, kết quả đánh số có <strong>mã HTTP + error.code + câu thông báo đúng từng chữ</strong>, điều kiện trước là <strong>trạng thái dữ liệu</strong>.</li>
<li>Mỗi vòng đã chạy: kết quả, ngày, <strong>đúng người đã chạy</strong>; Failed ⇒ mã Bug ở Note; có tên ảnh Evidence.</li>
<li>Thống kê lấy vòng cuối; tự tính tay lại một sheet.</li>
<li>Xuất từ CT Work, mở Excel, bấm thử mọi link sheet; không còn chữ mẫu <code>&lt;…&gt;</code>.</li>
<li>Không dữ liệu cá nhân thật, không mật khẩu thật — chỉ tài khoản demo.</li>
</ol>
<h3>9 · Hỏi lại cô</h3>
<ol>
<li>Hạn nộp, nộp ở đâu, có thuyết trình chung với Lab 2–3 không?</li>
<li>3 round (template) hay 4 round (mẫu)?</li>
<li>Ảnh Evidence phải chèn vào Excel, hay ghi tên ảnh / link là đủ?</li>
<li>LabFlow Demo chưa có giao diện web — test system qua Swagger UI / Postman có được không?</li>
<li>Có số case tối thiểu không?</li>
<li>Sheet ghi nhãn "Workflow" (template) hay "Feature" (mẫu)?</li>
</ol>
<h3>10 · Câu cô hay hỏi (trả lời bằng tiếng Anh)</h3>
<ol>
<li><em>What is the difference between system and integration testing?</em> — mục 7.</li>
<li><em>Why is this case a system test and not a unit test?</em> — nó đi trọn một hành trình người dùng qua nhiều chức năng và nhiều vai.</li>
<li><em>What is your test basis?</em> — luật BR-01…BR-14, <code>docs/api-v1.md</code>, ma trận phân quyền.</li>
<li><em>How do you compute coverage and why minus N/A?</em> — mục 3.</li>
<li><em>Pending or N/A?</em> — Pending = chưa chạy được (bị chặn); N/A = không áp dụng cho bản này.</li>
<li><em>What changed between Round 1 and Round 2?</em> — kể đúng một lỗi thật và lần chạy lại.</li>
<li><em>Show me the evidence of &lt;SB8&gt;.</em> — mở <code>LAB4_SB8_R1.png</code>.</li>
<li><em>Which boundary values did you test?</em> — 30 vs 31 chỗ; 13 vs 15 ngày; 20:30–21:00 vs 20:30–21:30.</li>
<li><em>Who was the independent tester?</em> — người chạy Round 2.</li>
<li><em>Which defect did you find?</em> — SB7: tìm phòng thiếu <code>to</code> trả 500 thay vì 400.</li>
</ol>
${inner('swt301-system-acceptance', '📑', 'Ôn lý thuyết: bài 2.3 — system & acceptance testing (SWT2 slide 75–105)', 'Mục tiêu, cơ sở test, lỗi điển hình, tester độc lập, môi trường giống thật', 'MỞ →')}
${inner('swt301-lab3-report-templates', '🧾', 'Bài 3.1 — ba template Report5 từng sheet', '5.3 đứng cạnh 5.1 và 5.2 thế nào, và lỗi công thức có sẵn của template', 'MỞ →')}`),
    books([
      ['fst4', 'Ch.2 §2 "Test levels" — system testing pp.54–57 (PDF 68–71); Ch.5 §3 test reports pp.175–180 (PDF 189–194)', 'Chương 2 §2 "Test levels" — system testing trang 54–57 (PDF 68–71); Chương 5 §3 báo cáo test trang 175–180 (PDF 189–194)'],
      ['sp5', '§3.4.3 System testing (PDF 105–107); §6.3.4 Test reports (PDF 281)', '§3.4.3 System testing (PDF 105–107); §6.3.4 Test reports (PDF 281)'],
      ['sp4', '§3.4 System test pp.58–60 (PDF 73–75)', '§3.4 System test trang 58–60 (PDF 73–75)'],
    ]),
  ].join('\n'),
};

/* ═══════════════════════ L4.2 — Đọc file mẫu ABClinic ═══════════════════════ */
const ERRS = [
  ['Cover · E11–E17', '"Create <strong>intergration</strong> test document", "Add intergration test for …"', 'Wrong level (this is the <em>system</em> test report) and misspelt — the file was copied from the group\'s 5.2 report|||Sai cấp (đây là báo cáo <em>system</em> test) và sai chính tả — tệp được chép từ báo cáo 5.2 của chính nhóm đó', '"Create system test document", "Add system test for the … workflow"|||"Create system test document", "Add system test for the … workflow"'],
  ['Cover · B2', 'Title "TEST REPORT DOCUMENT"', 'That is the 5.2 cover; the 5.3 template says "SYSTEM TEST REPORT DOCUMENT"|||Đó là bìa của 5.2; template 5.3 ghi "SYSTEM TEST REPORT DOCUMENT"', 'Use the 5.3 title (CT Work exports it)|||Dùng tiêu đề của 5.3 (CT Work xuất đúng)'],
  ['Cover B4 · Test Cases D3 · Statistics C3', 'Project "Intelligent Support System for Data Warehouse Inquiry using Voice-based SQL Generation", code ISSVSG', 'Every test case is about the ABClinic clinic — the name and code belong to another project|||Mọi test case đều nói về phòng khám ABClinic — tên và mã là của dự án khác', 'One project name everywhere, read by formula from the Cover|||Một tên dự án ở mọi nơi, các sheet đọc bằng công thức từ Cover'],
  ['Cover · F11 and column Reference', '"&lt;List of documents which are refered in this version.&gt;" left in the cell; nothing below', 'Template text never replaced; no document is referenced|||Chữ mẫu chưa thay; không có tài liệu tham chiếu nào', 'SRS / README business rules, docs/api-v1.md, repo commit|||SRS / luật nghiệp vụ README, docs/api-v1.md, commit của repo'],
  ['Cover · Record of change', '7 rows, all version 1.0, last change 15/03 — but Round 4 ran 08–15/04', 'The version never moves and the round updates are not recorded|||Version không bao giờ tăng, các đợt chạy vòng không được ghi', 'Raise the version (1.0 → 1.1…) and add an M row per update|||Tăng version (1.0 → 1.1…) và thêm dòng M mỗi lần cập nhật'],
  ['Test Cases · D5', 'Test Environment Setup Description = "&lt;List enviroment requires in this system 1. Server 2. Database 3. Web Browser …&gt;"', 'The template placeholder (with its typo) — the environment is not described|||Chữ giữ chỗ của template (kèm lỗi chính tả) — môi trường không hề được mô tả', 'Real server, DB, browser, tools, accounts, time zone|||Ghi thật máy chủ, CSDL, trình duyệt, công cụ, tài khoản, múi giờ'],
  ['Test Statistics · C12', '"<strong>SureyFlow</strong>"', 'Typo, typed by hand while C10 is a formula =Authentication!B2|||Gõ sai, gõ tay trong khi C10 là công thức =Authentication!B2', 'Every Module code = a formula to the sheet\'s B2|||Mọi Module code là công thức trỏ B2 của sheet'],
  ['Test Statistics vs sheets', 'Module "PatientFlow" but sheet header "PatientManagement"; list order Survey before Intake, tabs the other way', 'Three names for one thing; the reader cannot match rows to tabs|||Ba tên cho một thứ; người đọc không khớp được dòng với tab', 'Same name in tab, header and lists; same order|||Cùng một tên ở tab, đầu sheet và danh sách; cùng thứ tự'],
  ['Every workflow sheet · E7 (and E8 in 5 sheets)', 'Round 2 N/A = COUNTIF($H11:$H995,E5) — column H is <strong>Round 1</strong>; Round 3 N/A also points to H', 'Round 2 and 3 N/A show Round 1\'s count — wrong as soon as N/A appears|||N/A của Round 2 và 3 hiện số của Round 1 — sai ngay khi có N/A', 'Round 2 counts K, Round 3 N, Round 4 Q (TicketFlow: J, M, P)|||Round 2 đếm cột K, Round 3 cột N, Round 4 cột Q (TicketFlow: J, M, P)'],
  ['5 sheets · D7', 'Round 2 Pending = COUNTIF($K11:$<strong>GL95</strong>,D5) (also $GK91, $GJ96, $GK94, $GK96)', 'A typo turns one column into a block K11:GL95 — it also counts "Pending" in Round 3 and 4 columns|||Gõ nhầm biến một cột thành cả khối K11:GL95 — đếm lây cả "Pending" ở cột Round 3, 4', 'Same shape as the other counters: $K$12:$K$1000|||Cùng dạng với các ô đếm khác: $K$12:$K$1000'],
  ['PatientFlow · C9:E9', 'Round 4 Failed/Pending/N/A start at <strong>Q25</strong>, Passed at Q11', 'Rows 13–24 are skipped for three of the four counters|||Dòng 13–24 bị bỏ khỏi ba trong bốn ô đếm', 'One fixed range for all four: $Q$12:$Q$1000|||Một vùng cố định cho cả bốn: $Q$12:$Q$1000'],
  ['All sheets · ranges', 'Ranges start at row 11 or 12 and end at 991, 992, 993, 995, 996 or 997', 'Harmless today, but proof that every formula was edited by hand|||Hôm nay vô hại, nhưng chứng tỏ từng công thức được sửa tay', 'Absolute ranges with $, one template, copy across|||Vùng tuyệt đối có $, một mẫu, chép sang'],
  ['Column A · IDs', '="&lt;AT" &amp; ROW(A18)-11 &amp; "&gt;" on row 20 — the offset is re-typed after every group row', 'Insert one row and every following ID is wrong|||Chèn một dòng là mọi ID phía sau sai', 'Type the IDs (or let CT Work number them)|||Gõ thẳng ID (hoặc để CT Work tự đánh số)'],
  ['TicketFlow · columns', 'No spacer column G: Round 1 sits in G, not H as in the five other sheets', 'Same report, two layouts; formulas copied from another sheet break|||Cùng một báo cáo, hai bố cục; chép công thức từ sheet khác là hỏng', 'One identical layout for every workflow sheet|||Một bố cục giống hệt cho mọi sheet'],
  ['Group rows', '"Create account manaually"; "List Ticket (patient)" twice in a row; "Create Ticket (patient)" twice', 'Typos and duplicated scenario titles|||Lỗi chính tả và tiêu đề scenario lặp', 'One scenario title per stage, spell-checked|||Mỗi chặng một tiêu đề, kiểm chính tả'],
  ['Evidence · 96 cells', 'All empty', 'The column exists to prove the run — nothing is proven|||Cột này để chứng minh đã chạy — không chứng minh gì cả', 'A file name or link per case and round|||Tên ảnh hoặc link cho mỗi case mỗi vòng'],
  ['Rounds · Tester', '96 cases × 4 rounds = 384 results, all by one tester, all Passed except 2 Pending in IntakeFlow Round 1', 'No defect ever found in 4 rounds: why re-run? One person ran everything for a 5-person team|||4 vòng không thấy lỗi nào: chạy lại để làm gì? Một người chạy hết cho cả nhóm', 'Honest Round 1, real testers, independent tester in Round 2|||Round 1 trung thực, đúng người chạy, Round 2 có tester độc lập'],
  ['Pre-conditions vs Procedure', 'Pre-condition "Receptionist account is logged in" while step 1 is "Login to ABClinic…"', 'The pre-condition contradicts the steps|||Điều kiện trước mâu thuẫn với các bước', 'Pre-conditions = data states ("slot 09:30 is free"); signing in is a step|||Điều kiện trước = trạng thái dữ liệu ("khung 09:30 còn trống"); đăng nhập là một bước'],
  ['Sheet header A2', '"Feature" — the official 5.3 template says "Workflow"; groups are screens (Login, Forgot Password…)', 'The Authentication sheet is a per-screen functional test, not an end-to-end workflow|||Sheet Authentication là test chức năng theo màn hình, không phải luồng đầu-cuối', '"Workflow" + scenarios that are stages of one journey (ask the lecturer, Q6)|||"Workflow" + scenario là các chặng của một hành trình (hỏi cô, Q6)'],
];
const errTable = (lang) => {
  const pick = (s) => (s.includes('|||') ? s.split('|||')[lang === 'en' ? 0 : 1] : s);
  const head = lang === 'en'
    ? '<tr><th>#</th><th>Where</th><th>What the sample has</th><th>Why it is wrong</th><th>Do this instead</th></tr>'
    : '<tr><th>#</th><th>Ở đâu</th><th>Mẫu ghi gì</th><th>Vì sao sai</th><th>Nên làm</th></tr>';
  return `<div class="table-wrap"><table><thead>${head}</thead><tbody>${ERRS.map((e, i) => `<tr><td>${i + 1}</td><td>${e[0]}</td><td>${e[1]}</td><td>${pick(e[2])}</td><td>${pick(e[3])}</td></tr>`).join('')}</tbody></table></div>`;
};

const L42 = {
  title: 'L4.2 — Reading the ABClinic Report 5.3 sample sheet by sheet, and 19 mistakes you must not copy|||L4.2 — Đọc tệp mẫu ABClinic Report 5.3 từng sheet, và 19 lỗi tuyệt đối không chép',
  slug: 'swt301-lab4-doc-mau-abclinic',
  type: 'DOCUMENT',
  description: 'Mổ tệp mẫu cô gửi (ABClinic, ISP490): 9 sheet, 96 case, công thức từng ô — học cách nhóm mẫu viết case end-to-end (bước + dữ liệu + câu chữ UI), so với template 5.3 chính thức (Workflow, 3 round, không cột Evidence), rồi 19 lỗi kiểm bằng openpyxl: "intergration", tên dự án khác, ô đếm N/A trỏ nhầm Round 1, $GL95, Q25, Evidence trống, 4 vòng 100%.',
  content: [
    bi(`<span class="eyebrow">Lab 4 · Lesson 4.2 · ABClinic_ISP490_Report5.3_System Test.xlsx (9 sheets, 96 cases)</span>
<h2>Learn from the sample — including from its mistakes</h2>
<p class="lead">The sample is the only "brief" we have, so read it twice: once to learn the <strong>shape</strong> the lecturer expects, once as a <strong>reviewer</strong> looking for defects. Every cell and every formula below was dumped with a script (openpyxl) — values and formulas, not a screenshot.</p>
<h3>1 · The nine sheets</h3>
<div class="table-wrap"><table>
<thead><tr><th>Sheet</th><th>Content</th><th>Cases</th></tr></thead>
<tbody>
<tr><td>Cover</td><td>title, project, document code (formula), Record of change (7 rows)</td><td>—</td></tr>
<tr><td>Test Cases</td><td>project, environment cell, 6 rows No · Function · Sheet (link) · Description · Pre-Condition</td><td>—</td></tr>
<tr><td>Test Statistics</td><td>6 modules linked to row 9 (= <strong>Round 4</strong>) of each sheet, Sub total, two percentages (100 % / 100 %)</td><td>96</td></tr>
<tr><td>Authentication</td><td>groups Login, Forgot Password, Reset Password, Change Password, Logout</td><td>16 (AT)</td></tr>
<tr><td>PatientFlow</td><td>receptionist: patient list, detail, create account, status, import Excel</td><td>14 (PM)</td></tr>
<tr><td>IntakeFlow</td><td>receptionist: intake for an existing / new patient / from a Google Form</td><td>15 (IM)</td></tr>
<tr><td>TicketFlow</td><td>patient creates a ticket → receptionist replies / escalates → doctor replies → closed</td><td>18 (TM)</td></tr>
<tr><td>SurveyFlow</td><td>surveys, status, landing-page chat, Google Form sync</td><td>14 (SM)</td></tr>
<tr><td>TreatmentFlow</td><td>doctor: today's patients, examination, AI diagnosis, prescription, treatment plan</td><td>19 (TrM)</td></tr>
</tbody></table></div>
<h3>2 · What to copy: how a case is written</h3>
<p>Case <code>&lt;IM1&gt;</code> (receptionist creates an intake for an existing patient) is the best model in the file:</p>
<ul>
<li><strong>Description</strong> — "Verify that the receptionist can create intake successfully for an existing patient with valid information." One goal, one actor.</li>
<li><strong>Procedure</strong> — 11 numbered steps, each with the exact control and data: tab <em>Existing Patient</em>, search "0903333001", doctor "BS. Nguyễn Văn An", reason "đau bụng", date 08/04/2026, slot 09:30, button <em>Tiếp nhận &amp; Gửi bác sĩ</em>.</li>
<li><strong>Expected</strong> — 4 numbered, observable results: the success modal titled <em>Tiếp nhận thành công</em>, the date / time / doctor shown in it, and what must <em>not</em> appear.</li>
<li><strong>Pre-conditions</strong> — data states: the patient exists, the doctor is active, slot 09:30 is free.</li>
</ul>
<p>TicketFlow is the most "system" sheet of the file: one ticket travels <strong>patient → receptionist → doctor → patient</strong> across four roles. That is the pattern our five workflows follow.</p>
<h3>3 · Sample vs official template</h3>
<div class="table-wrap"><table>
<thead><tr><th>Point</th><th>Template 5.3 (05.Templates)</th><th>ABClinic sample</th><th>CT Work export 5.3</th></tr></thead>
<tbody>
<tr><td>Sheet label</td><td>Workflow</td><td>Feature</td><td>Workflow</td></tr>
<tr><td>Rounds</td><td>3</td><td>4</td><td>3</td></tr>
<tr><td>Evidence column</td><td>no</td><td>yes (F:G, all empty)</td><td>no — Evidence written into Note as "Evidence: …"</td></tr>
<tr><td>Statistics read</td><td>Round 1 (row 6) — a template bug</td><td>Round 4 (row 9)</td><td>the last executed round</td></tr>
<tr><td>Number of TCs</td><td>COUNTA(A12:A1000) — counts group rows too</td><td>COUNTIF(…,"*&lt;AT*")</td><td>COUNTIF(A11:A1000,"*&lt;SB*")</td></tr>
<tr><td>Cover title</td><td>SYSTEM TEST REPORT DOCUMENT</td><td>TEST REPORT DOCUMENT (5.2)</td><td>SYSTEM TEST REPORT DOCUMENT</td></tr>
</tbody></table></div>
<p class="meo">🧠 The sample's cover, statistics and round layout are identical to the 5.2 report of the APHL group (same reviewer, same "intergration" typo): the ABClinic group <em>converted their 5.2 file</em>. That explains most of its mistakes.</p>
<h3>4 · The mistakes, checked formula by formula</h3>
${errTable('en')}
<div class="pitfall co-tieu-de"><strong>Why formula bugs matter even when the numbers look right.</strong> Every round in the sample is 100 % Passed, so the wrong ranges happen to return the right numbers. The day one case fails or becomes N/A in Round 2, the Round 2 row still shows Round 1's N/A, and the statistics lie. Test your report like you test software: enter one Failed and one N/A in a copy and watch every counter.</div>
<h3>5 · Practice</h3>
<ol>
<li>Open the sample, sheet PatientFlow, cell D7. Which cells does it really count?</li>
<li>Which single row of Test Statistics would you change to report Round 3 instead of Round 4?</li>
</ol>
${ansEn('1 · K11:GL95', 'The range runs from column K to column GL and from row 11 to row 95 — about 190 columns, including the Round 3 (N) and Round 4 (Q) columns. 2 · Point D10:G15 to row 8 of each sheet instead of row 9 (B8, C8, D8, E8).')}`,
    `<span class="eyebrow">Lab 4 · Bài 4.2 · ABClinic_ISP490_Report5.3_System Test.xlsx (9 sheet, 96 case)</span>
<h2>Học từ tệp mẫu — kể cả học từ lỗi của nó</h2>
<p class="lead">Tệp mẫu là "đề" duy nhất ta có, nên đọc hai lượt: lượt đầu để học <strong>khuôn</strong> cô chờ, lượt sau đọc như một <strong>người review</strong> đi tìm lỗi. Mọi ô và mọi công thức dưới đây đã được đọc bằng script (openpyxl) — cả giá trị lẫn công thức, không phải nhìn ảnh.</p>
<h3>1 · Chín sheet</h3>
<div class="table-wrap"><table>
<thead><tr><th>Sheet</th><th>Nội dung</th><th>Số case</th></tr></thead>
<tbody>
<tr><td>Cover</td><td>tiêu đề, dự án, mã tài liệu (công thức), Record of change (7 dòng)</td><td>—</td></tr>
<tr><td>Test Cases</td><td>dự án, ô môi trường, 6 dòng No · Function · Sheet (link) · Description · Pre-Condition</td><td>—</td></tr>
<tr><td>Test Statistics</td><td>6 module trỏ tới dòng 9 (= <strong>Round 4</strong>) của từng sheet, Sub total, hai tỉ lệ (100 % / 100 %)</td><td>96</td></tr>
<tr><td>Authentication</td><td>nhóm Login, Forgot Password, Reset Password, Change Password, Logout</td><td>16 (AT)</td></tr>
<tr><td>PatientFlow</td><td>lễ tân: danh sách bệnh nhân, chi tiết, tạo tài khoản, trạng thái, nhập Excel</td><td>14 (PM)</td></tr>
<tr><td>IntakeFlow</td><td>lễ tân: tiếp nhận bệnh nhân cũ / mới / từ Google Form</td><td>15 (IM)</td></tr>
<tr><td>TicketFlow</td><td>bệnh nhân tạo ticket → lễ tân trả lời / chuyển → bác sĩ trả lời → đóng</td><td>18 (TM)</td></tr>
<tr><td>SurveyFlow</td><td>khảo sát, trạng thái, chat ở trang chủ, đồng bộ Google Form</td><td>14 (SM)</td></tr>
<tr><td>TreatmentFlow</td><td>bác sĩ: bệnh nhân hôm nay, khám, chẩn đoán AI, kê đơn, kế hoạch điều trị</td><td>19 (TrM)</td></tr>
</tbody></table></div>
<h3>2 · Nên học: cách viết một case</h3>
<p>Case <code>&lt;IM1&gt;</code> (lễ tân tiếp nhận bệnh nhân đã có hồ sơ) là mẫu tốt nhất trong tệp:</p>
<ul>
<li><strong>Description</strong> — "Verify that the receptionist can create intake successfully for an existing patient with valid information." Một mục tiêu, một người làm.</li>
<li><strong>Procedure</strong> — 11 bước đánh số, mỗi bước ghi đúng nút và dữ liệu: tab <em>Existing Patient</em>, tìm "0903333001", bác sĩ "BS. Nguyễn Văn An", lý do "đau bụng", ngày 08/04/2026, giờ 09:30, nút <em>Tiếp nhận &amp; Gửi bác sĩ</em>.</li>
<li><strong>Expected</strong> — 4 kết quả đánh số, nhìn thấy được: hộp thông báo tiêu đề <em>Tiếp nhận thành công</em>, ngày / giờ / bác sĩ hiện trong đó, và cả thứ <em>không</em> được hiện.</li>
<li><strong>Pre-conditions</strong> — trạng thái dữ liệu: bệnh nhân đã có, bác sĩ đang hoạt động, khung 09:30 còn trống.</li>
</ul>
<p>TicketFlow là sheet "system" nhất của tệp: một ticket đi qua <strong>bệnh nhân → lễ tân → bác sĩ → bệnh nhân</strong>, bốn vai. Năm workflow của nhóm mình đi theo đúng khuôn này.</p>
<h3>3 · Tệp mẫu so với template chính thức</h3>
<div class="table-wrap"><table>
<thead><tr><th>Điểm</th><th>Template 5.3 (05.Templates)</th><th>Mẫu ABClinic</th><th>CT Work xuất 5.3</th></tr></thead>
<tbody>
<tr><td>Nhãn sheet</td><td>Workflow</td><td>Feature</td><td>Workflow</td></tr>
<tr><td>Số round</td><td>3</td><td>4</td><td>3</td></tr>
<tr><td>Cột Evidence</td><td>không có</td><td>có (F:G, bỏ trống hết)</td><td>không có cột riêng — Evidence ghi vào Note dạng "Evidence: …"</td></tr>
<tr><td>Thống kê đọc vòng</td><td>Round 1 (dòng 6) — lỗi của template</td><td>Round 4 (dòng 9)</td><td>vòng chạy cuối</td></tr>
<tr><td>Number of TCs</td><td>COUNTA(A12:A1000) — đếm lây dòng tiêu đề nhóm</td><td>COUNTIF(…,"*&lt;AT*")</td><td>COUNTIF(A11:A1000,"*&lt;SB*")</td></tr>
<tr><td>Tiêu đề Cover</td><td>SYSTEM TEST REPORT DOCUMENT</td><td>TEST REPORT DOCUMENT (của 5.2)</td><td>SYSTEM TEST REPORT DOCUMENT</td></tr>
</tbody></table></div>
<p class="meo">🧠 Bìa, thống kê và bố cục round của tệp mẫu giống hệt báo cáo 5.2 của nhóm APHL (cùng người duyệt, cùng lỗi "intergration"): nhóm ABClinic đã <em>sửa tệp 5.2 của mình thành 5.3</em>. Điều đó giải thích phần lớn lỗi bên dưới.</p>
<h3>4 · Các lỗi, kiểm từng công thức</h3>
${errTable('vi')}
<div class="pitfall co-tieu-de"><strong>Vì sao lỗi công thức vẫn quan trọng khi số đang đúng.</strong> Vòng nào của tệp mẫu cũng 100 % Passed, nên vùng đếm sai vẫn tình cờ ra số đúng. Ngày có một case Failed hay N/A ở Round 2, dòng Round 2 vẫn hiện N/A của Round 1 và bảng thống kê nói dối. Hãy test báo cáo như test phần mềm: trong một bản sao, nhập thử một Failed và một N/A rồi nhìn từng ô đếm.</div>
<h3>5 · Thực hành</h3>
<ol>
<li>Mở tệp mẫu, sheet PatientFlow, ô D7. Nó thật ra đang đếm những ô nào?</li>
<li>Muốn Test Statistics báo Round 3 thay vì Round 4 thì sửa đúng chỗ nào?</li>
</ol>
${ansVi('1 · K11:GL95', 'Vùng chạy từ cột K tới cột GL, từ dòng 11 tới dòng 95 — khoảng 190 cột, gồm cả cột Round 3 (N) và Round 4 (Q). 2 · Đổi D10:G15 sang trỏ dòng 8 của mỗi sheet thay vì dòng 9 (B8, C8, D8, E8).')}`),
  ].join('\n'),
};

/* ═══════════════════════ L4.3 — Viết test case system test cho LabFlow ═══════════════════════ */
const SB8_FULL_EN = `<div class="table-wrap"><table>
<tbody>
<tr><th>Test Case ID</th><td><code>&lt;SB8&gt;</code> — scenario <em>Book a lab</em></td></tr>
<tr><th>Description</th><td>Verify that a student can book a free lab of 30 seats or less, the booking is CONFIRMED at once, appears in My reservations and the slot is no longer offered to others.</td></tr>
<tr><th>Procedure</th><td>1. Signed in as st.sb01@fpt.edu.vn, call <code>POST /api/v1/reservations</code> with header <code>Idempotency-Key: st-sb08-0001</code> and body <code>{"labId":1,"startAt":"&lt;D&gt;T02:00:00Z","endAt":"&lt;D&gt;T04:00:00Z","purpose":"IoT practice for SWT301"}</code>.<br>2. Call <code>GET /api/v1/availability?from=&lt;D&gt;T02:00:00Z&amp;to=&lt;D&gt;T04:00:00Z&amp;capacity=20</code>.<br>3. Call <code>GET /api/v1/reservations/mine</code>.</td></tr>
<tr><th>Expected Results</th><td>1. HTTP 201; data.labId = 1; data.status = "CONFIRMED"; data.replayed = false; startAt / endAt equal to the request.<br>2. HTTP 200; AL-301 is no longer listed (AL-302 and BE-201 remain).<br>3. HTTP 200; the list contains the booking of step 1 (same id, CONFIRMED, purpose "IoT practice for SWT301").</td></tr>
<tr><th>Pre-conditions</th><td>1. &lt;SB1&gt; passed.<br>2. AL-301 (id 1, 30 seats, requiresApproval false) is ACTIVE and free on D 09:00–11:00 Vietnam time.</td></tr>
<tr><th>Evidence</th><td><code>LAB4_SB8_R1.png</code> — Swagger UI showing the 201 answer of step 1</td></tr>
<tr><th>Note</th><td>30 seats is exactly the BR-06 boundary: 30 does NOT need approval, 31 would.</td></tr>
</tbody></table></div>`;
const SB8_FULL_VI = SB8_FULL_EN
  .replace('scenario <em>Book a lab</em>', 'scenario <em>Book a lab</em> (đặt phòng)')
  .replace('— Swagger UI showing the 201 answer of step 1', '— ảnh Swagger UI thấy câu trả lời 201 của bước 1');

const L43 = {
  title: 'L4.3 — System test cases for LabFlow: the StudentBooking workflow solved (16 cases, run for real)|||L4.3 — Viết case system test cho LabFlow: lời giải workflow StudentBooking (16 case, chạy thật)',
  slug: 'swt301-lab4-viet-test-case',
  type: 'DOCUMENT',
  description: 'Ví dụ có lời giải của nhóm trưởng: chọn workflow theo vai, chia scenario, viết 16 case SB1–SB16 cho hành trình sinh viên (đăng ký → xác minh → đăng nhập → tìm phòng → đặt → đăng xuất) với dữ liệu cụ thể và câu thông báo thật — cả 16 case đã chạy trên LabFlow Demo 24/10/2026, tìm được một lỗi thật (SB7: thiếu tham số trả 500); 5 bước biến case 5.2 thành case 5.3.',
  content: [
    bi(`<span class="eyebrow">Lab 4 · Lesson 4.3 · Worked example · CT Work swt301/LAB4 › Tests › System test (5.3) › StudentBooking</span>
<h2>One workflow, solved in full</h2>
<p class="lead">This is the team lead's sheet, written first so that the four other members can copy the way of working. Every step and every expected result below was <strong>executed on LabFlow Demo on 24/10/2026</strong> (fresh start, profile h2): fifteen and a half cases behaved exactly as written — and one step did not, which is the most useful part of the lesson.</p>
<h3>1 · Choose the journey before the cases</h3>
${flow(step('Stage 1', 'Create an account and sign in', 'SB1–SB4 · BR-01, BR-02, BR-03'), step('Stage 2', 'Find a free lab', 'SB5–SB7 · catalogue, hours, availability'), step('Stage 3', 'Book a lab', 'SB8–SB14 · BR-04, BR-05, BR-06'), step('Stage 4', 'Role limits & end of session', 'SB15–SB16'))}
<ul>
<li><strong>Who</strong> — one role (STUDENT), plus a second student where the journey touches other people (SB11).</li>
<li><strong>Test basis</strong> — the business rules BR-01…BR-06, <code>docs/api-v1.md</code> and the error messages of <code>ErrorCode.java</code>. Write the expected result from the rule, never from what the code happens to return.</li>
<li><strong>Each stage = one scenario row</strong> in the sheet. Inside a stage: the happy path first, then the error paths, then the boundaries.</li>
</ul>
<h3>2 · The interface: Swagger UI</h3>
<p>LabFlow Demo is a back-end: its "screen" is the REST API. Start the app (<code>./mvnw spring-boot:run -Dspring-boot.run.profiles=h2</code>), open <strong>http://localhost:8080/swagger-ui.html</strong>, call <code>POST /api/v1/auth/login</code>, click <strong>Authorize</strong> and paste <code>data.accessToken</code>; every later call carries the token. The verification link of a new account is printed in the terminal that runs the app.</p>
<h3>3 · The 16 cases at a glance</h3>
${sbTable('en')}
<p>D = the next Tuesday within 14 days (run on 24/10/2026 ⇒ 2026-10-27). The API speaks UTC: <code>02:00Z</code> = 09:00 in Vietnam.</p>
<h3>4 · One case in full — exactly as on CT Work</h3>
${SB8_FULL_EN}
<p>Read it as a checklist of the six rules of a good system test case:</p>
<ol>
<li>The description states <strong>the user's goal</strong>, not an endpoint.</li>
<li>The procedure <strong>chains several functions</strong> and ends by checking the consequence <strong>somewhere else</strong> (availability, My reservations).</li>
<li>All data is concrete: account, lab, time, header, purpose.</li>
<li>Expected results are numbered like the steps and give <strong>status code + field values</strong>.</li>
<li>Pre-conditions are <strong>data states</strong>, not actions.</li>
<li>The note explains the boundary that the case covers.</li>
</ol>
<h3>5 · The failure we found while preparing: SB7 step 3</h3>
<p>SB7 step 3 searches without the end time: <code>GET /api/v1/availability?from=…&amp;capacity=20</code>. A missing required parameter is a client mistake, so we expected <strong>HTTP 400 VALIDATION_ERROR</strong>. The real answer was:</p>
<pre><code class="language-text">HTTP 500
{"success":false,"error":{"code":"INTERNAL_ERROR","message":"Unexpected error"}}</code></pre>
<ul>
<li>This is a real defect: the user gets a server error and no hint of what to fix.</li>
<li>Round 1 must say <strong>Failed</strong>, the Actual result is written in Note, a Bug card <em>"[ST] SB7: GET /availability without 'to' returns 500 instead of 400"</em> is opened, and its key goes into Note.</li>
<li>Do not "fix" the expected result to 500 so that the case turns green — that would test the code against itself.</li>
</ul>
<h3>6 · Traps met while running the chain</h3>
<ul>
<li><strong>Order matters.</strong> SB9 re-sends SB8's request, SB11 needs SB8's booking, SB16 lists the bookings of SB8, SB10, SB12, SB13. Run SB1 → SB16 in one application run; restarting in the middle erases the H2 data.</li>
<li><strong>Locking the wrong account.</strong> SB4 uses its own new account: locking <code>student1</code> would block other cases for 15 minutes.</li>
<li><strong>Rate limit.</strong> Sign-in and registration accept 20 requests per minute per IP. A 429 is not a Failed — wait a minute.</li>
<li><strong>The 14-day rule counts from now</strong> (start ≤ now + 14 × 24 h). "Exactly 14 days at 09:00" passes in the afternoon and fails in the early morning — that is why SB13 uses 13 and 15–16 days.</li>
<li><strong>Logout keeps the access token alive</strong> until it expires (≤ 15 min): by design only the refresh token is revoked. Do not record that as a defect.</li>
<li>LabFlow Demo v0.1 has <strong>no approve / cancel endpoint</strong>: the PENDING booking of SB10 is the end of that flow.</li>
</ul>
<h3>7 · From a 5.2 case to a 5.3 case in five moves</h3>
<ol>
<li>Title = the user's goal ("a student can book…"), not "POST /reservations returns 201".</li>
<li>Sign in with the real role in step 1 instead of assuming a token.</li>
<li>After the main action, check the consequence where another user would see it.</li>
<li>Replace "valid data" by the exact values.</li>
<li>Move every "user is logged in" out of the pre-conditions into the steps.</li>
</ol>
<h3>Practice</h3>
<p>Turn Lab 3 case <strong>BL6</strong> (manager closes AL-301) into a LabSetup system test case: which steps and which second role do you add?</p>
${ansEn('LS-close', '1. Manager signs in and PATCHes /labs/1/status to CLOSED (200). 2. A student signs in and searches availability for D 09:00–11:00 — AL-301 is missing. 3. The student tries to book AL-301 — 409 LAB_INACTIVE "Lab is not active". 4. The manager reopens it (ACTIVE). 5. The student searches again — AL-301 is back — and books it (201 CONFIRMED). Second role: the student; the clean-up step 4 is mandatory.')}
${card(`${BLOB}/http/labflow-demo.http`, '🧪', 'http/labflow-demo.http — every request of LabFlow Demo', 'Copy bodies and headers instead of typing them', 'OPEN →')}
${card(`${BLOB}/docs/api-v1.md`, '📜', 'docs/api-v1.md — endpoints, roles and error codes', 'The test basis of the expected results', 'OPEN →')}`,
    `<span class="eyebrow">Lab 4 · Bài 4.3 · Ví dụ có lời giải · CT Work swt301/LAB4 › Tests › System test (5.3) › StudentBooking</span>
<h2>Một workflow, giải trọn vẹn</h2>
<p class="lead">Đây là sheet của nhóm trưởng, viết trước để bốn bạn còn lại nhìn theo cách làm. Mọi bước và mọi kết quả mong đợi dưới đây đã <strong>chạy thật trên LabFlow Demo ngày 24/10/2026</strong> (app vừa khởi động, profile h2): mười lăm case rưỡi chạy đúng như viết — và có một bước không đúng, đó lại là phần đáng học nhất.</p>
<h3>1 · Chọn hành trình trước, viết case sau</h3>
${flow(step('Chặng 1', 'Tạo tài khoản & đăng nhập', 'SB1–SB4 · BR-01, BR-02, BR-03'), step('Chặng 2', 'Tìm phòng trống', 'SB5–SB7 · danh mục, giờ mở, phòng trống'), step('Chặng 3', 'Đặt phòng', 'SB8–SB14 · BR-04, BR-05, BR-06'), step('Chặng 4', 'Giới hạn vai & kết thúc phiên', 'SB15–SB16'))}
<ul>
<li><strong>Ai</strong> — một vai (STUDENT), thêm sinh viên thứ hai ở chỗ hành trình chạm tới người khác (SB11).</li>
<li><strong>Cơ sở test</strong> — luật nghiệp vụ BR-01…BR-06, <code>docs/api-v1.md</code> và câu thông báo trong <code>ErrorCode.java</code>. Viết kết quả mong đợi từ luật, đừng chép thứ code đang trả về.</li>
<li><strong>Mỗi chặng = một dòng scenario</strong> trong sheet. Trong một chặng: luồng đúng trước, rồi luồng lỗi, rồi giá trị biên.</li>
</ul>
<h3>2 · Giao diện để test: Swagger UI</h3>
<p>LabFlow Demo là phần back-end: "màn hình" của nó là REST API. Chạy app (<code>./mvnw spring-boot:run -Dspring-boot.run.profiles=h2</code>), mở <strong>http://localhost:8080/swagger-ui.html</strong>, gọi <code>POST /api/v1/auth/login</code>, bấm <strong>Authorize</strong> rồi dán <code>data.accessToken</code>; mọi lệnh sau tự kèm token. Link xác minh của tài khoản mới in ra cửa sổ terminal đang chạy app.</p>
<h3>3 · 16 case trong một bảng</h3>
${sbTable('vi')}
<p>D = thứ Ba tới, trong vòng 14 ngày (chạy ngày 24/10/2026 ⇒ 2026-10-27). API dùng giờ UTC: <code>02:00Z</code> = 9 giờ sáng giờ Việt Nam.</p>
<h3>4 · Một case đầy đủ — đúng như trên CT Work</h3>
${SB8_FULL_VI}
<p>Đọc nó như một checklist sáu điều của một case system test tốt:</p>
<ol>
<li>Mô tả nói <strong>mục tiêu của người dùng</strong>, không nói tên endpoint.</li>
<li>Các bước <strong>nối nhiều chức năng</strong> và kết thúc bằng việc kiểm hậu quả <strong>ở chỗ khác</strong> (tìm phòng trống, lượt đặt của tôi).</li>
<li>Mọi dữ liệu đều cụ thể: tài khoản, phòng, giờ, header, mục đích.</li>
<li>Kết quả mong đợi đánh số khớp các bước, có <strong>mã trạng thái + giá trị trường</strong>.</li>
<li>Điều kiện trước là <strong>trạng thái dữ liệu</strong>, không phải hành động.</li>
<li>Ghi chú giải thích giá trị biên mà case phủ.</li>
</ol>
<h3>5 · Lỗi tìm được khi chuẩn bị: SB7 bước 3</h3>
<p>SB7 bước 3 tìm phòng mà bỏ giờ kết thúc: <code>GET /api/v1/availability?from=…&amp;capacity=20</code>. Thiếu tham số bắt buộc là lỗi của phía gọi, nên ta mong đợi <strong>HTTP 400 VALIDATION_ERROR</strong>. Thực tế hệ thống trả:</p>
<pre><code class="language-text">HTTP 500
{"success":false,"error":{"code":"INTERNAL_ERROR","message":"Unexpected error"}}</code></pre>
<ul>
<li>Đây là lỗi thật: người dùng nhận lỗi máy chủ mà không biết phải sửa gì.</li>
<li>Round 1 phải ghi <strong>Failed</strong>, kết quả thật ghi ở Note, mở thẻ Bug <em>"[ST] SB7: GET /availability without 'to' returns 500 instead of 400"</em>, mã thẻ ghi vào Note.</li>
<li>Đừng "sửa" kết quả mong đợi thành 500 cho case xanh — làm vậy là lấy code để test chính code.</li>
</ul>
<h3>6 · Những bẫy gặp khi chạy cả chuỗi</h3>
<ul>
<li><strong>Thứ tự quan trọng.</strong> SB9 gửi lại request của SB8, SB11 cần lượt đặt của SB8, SB16 liệt kê lượt đặt của SB8, SB10, SB12, SB13. Chạy SB1 → SB16 trong cùng một lần chạy app; khởi động lại giữa chừng là dữ liệu H2 mất sạch.</li>
<li><strong>Khoá nhầm tài khoản.</strong> SB4 dùng tài khoản mới của riêng nó: khoá <code>student1</code> là chặn case khác 15 phút.</li>
<li><strong>Giới hạn tốc độ.</strong> Đăng nhập và đăng ký chỉ nhận 20 lần mỗi phút mỗi IP. Gặp 429 thì đợi một phút — không phải Failed.</li>
<li><strong>Luật 14 ngày tính từ lúc này</strong> (giờ bắt đầu ≤ bây giờ + 14 × 24 giờ). "Đúng 14 ngày lúc 9 giờ" chạy buổi chiều thì qua, sáng sớm thì trượt — vì vậy SB13 dùng 13 ngày và 15–16 ngày.</li>
<li><strong>Đăng xuất không giết access token</strong> ngay (còn sống tới hết 15 phút): thiết kế chỉ thu hồi refresh token. Đừng ghi là lỗi.</li>
<li>LabFlow Demo v0.1 <strong>chưa có API duyệt / huỷ</strong> lượt đặt: trạng thái PENDING của SB10 là điểm cuối của luồng đó.</li>
</ul>
<h3>7 · Năm bước biến case 5.2 thành case 5.3</h3>
<ol>
<li>Tiêu đề = mục tiêu người dùng ("a student can book…"), không phải "POST /reservations trả 201".</li>
<li>Bước 1 đăng nhập đúng vai thật, đừng giả định đã có token.</li>
<li>Sau việc chính, kiểm hậu quả ở chỗ người khác sẽ nhìn thấy.</li>
<li>Thay "dữ liệu hợp lệ" bằng giá trị cụ thể.</li>
<li>Chuyển mọi "user đã đăng nhập" từ điều kiện trước sang thành bước.</li>
</ol>
<h3>Thực hành</h3>
<p>Biến case <strong>BL6</strong> của Lab 3 (quản lý đóng AL-301) thành một case system test của workflow LabSetup: thêm những bước nào và vai thứ hai nào?</p>
${ansVi('LS-đóng', '1. Quản lý đăng nhập, PATCH /labs/1/status sang CLOSED (200). 2. Sinh viên đăng nhập, tìm phòng trống ngày D 09:00–11:00 — không còn AL-301. 3. Sinh viên thử đặt AL-301 — 409 LAB_INACTIVE "Lab is not active". 4. Quản lý mở lại (ACTIVE). 5. Sinh viên tìm lại — AL-301 xuất hiện — và đặt được (201 CONFIRMED). Vai thứ hai: sinh viên; bước dọn số 4 là bắt buộc.')}
${card(`${BLOB}/http/labflow-demo.http`, '🧪', 'http/labflow-demo.http — mọi request của LabFlow Demo', 'Chép body và header thay vì tự gõ', 'MỞ →')}
${card(`${BLOB}/docs/api-v1.md`, '📜', 'docs/api-v1.md — endpoint, vai và mã lỗi', 'Cơ sở để viết kết quả mong đợi', 'MỞ →')}`),
  ].join('\n'),
};

/* ═══════════════════════ L4.4 — Round, Evidence, thống kê ═══════════════════════ */
const ROUNDS_SB = `<div class="table-wrap"><table>
<thead><tr><th>StudentBooking (16)</th><th>Passed</th><th>Failed</th><th>Pending</th><th>N/A</th><th>Test coverage</th><th>Test successful coverage</th></tr></thead>
<tbody>
<tr><td>Round 1</td><td>14</td><td>1 (SB7)</td><td>1 (SB9)</td><td>0</td><td>(14+1)×100/16 = <strong>93.75 %</strong></td><td>14×100/16 = <strong>87.50 %</strong></td></tr>
<tr><td>Round 2</td><td>15</td><td>1 (SB7)</td><td>0</td><td>0</td><td>16×100/16 = <strong>100 %</strong></td><td>15×100/16 = <strong>93.75 %</strong></td></tr>
<tr><td>Round 3</td><td>16</td><td>0</td><td>0</td><td>0</td><td><strong>100 %</strong></td><td><strong>100 %</strong></td></tr>
</tbody></table></div>`;
const TEAM_TOTAL = `<div class="table-wrap"><table>
<thead><tr><th>Workflow</th><th>Passed</th><th>Failed</th><th>Pending</th><th>N/A</th><th>Number of test cases</th></tr></thead>
<tbody>
<tr><td>StudentBooking</td><td>16</td><td>0</td><td>0</td><td>0</td><td>16</td></tr>
<tr><td>AccountAdministration</td><td>15</td><td>0</td><td>0</td><td>0</td><td>15</td></tr>
<tr><td>LabSetup</td><td>13</td><td>0</td><td>0</td><td>1</td><td>14</td></tr>
<tr><td>EquipmentOperations</td><td>13</td><td>1</td><td>1</td><td>0</td><td>15</td></tr>
<tr><td>CalendarPolicy</td><td>15</td><td>0</td><td>0</td><td>0</td><td>15</td></tr>
<tr><td><strong>Sub total</strong></td><td><strong>72</strong></td><td><strong>1</strong></td><td><strong>1</strong></td><td><strong>1</strong></td><td><strong>75</strong></td></tr>
</tbody></table></div>`;

const L44 = {
  title: 'L4.4 — Running the rounds: results, testers, Evidence screenshots, defects and the coverage statistics|||L4.4 — Chạy các round: ghi kết quả, tester, ảnh Evidence, lỗi và thống kê coverage',
  slug: 'swt301-lab4-round-evidence-thong-ke',
  type: 'DOCUMENT',
  description: 'Cách chạy và ghi từng vòng cho Report 5.3: Passed/Failed/Pending/N/A khác nhau thế nào, ai chạy vòng nào (tester độc lập), chụp và đặt tên Evidence, mở Bug, tính coverage có lời giải (một sheet qua 3 vòng và cả nhóm), và cách thêm Round 4 + cột Evidence vào tệp Excel xuất từ CT Work nếu cô yêu cầu đúng khuôn mẫu ABClinic.',
  content: [
    bi(`<span class="eyebrow">Lab 4 · Lesson 4.4 · Rounds · Evidence · Test Statistics</span>
<h2>A round is a promise: "this is what the system did on that day"</h2>
<p class="lead">Writing cases is half of Lab 4. The other half is running them several times, recording honestly what happened, proving it with screenshots and turning the results into the statistics sheet.</p>
<h3>1 · The four results</h3>
<div class="table-wrap"><table>
<thead><tr><th>Result</th><th>Meaning</th><th>LabFlow example</th></tr></thead>
<tbody>
<tr><td><strong>Passed</strong></td><td>ran, every expected result observed</td><td>SB8 returned 201 CONFIRMED and the slot vanished from the search</td></tr>
<tr><td><strong>Failed</strong></td><td>ran, at least one expected result not observed</td><td>SB7 step 3 returned 500 instead of 400</td></tr>
<tr><td><strong>Pending</strong></td><td>could not be run yet in this round (blocked, environment missing)</td><td>SB9 after the app was restarted: SB8's booking no longer exists</td></tr>
<tr><td><strong>N/A</strong></td><td>does not apply to this release</td><td>a case about approving bookings — v0.1 has no approve API</td></tr>
</tbody></table></div>
<h3>2 · Who runs which round</h3>
${flow(step('Round 1', 'Owner', 'first full run on a fresh start'), step('Round 2', 'Another member', 'independent tester: re-runs everything, follows only the written steps'), step('Round 3', 'Owner', 'full regression on the final build'))}
<ul>
<li>The Tester column contains the person who really clicked — in the sample one name stands in all 384 result cells.</li>
<li>Test date = the day of the run. A round run on two days gets the real day per case.</li>
<li>A case that failed stays Failed in the next round until the defect is fixed and retested; never copy Passed forward.</li>
</ul>
<h3>3 · Evidence that proves something</h3>
<ul>
<li><strong>What is in the picture</strong>: method + URL, request body/header, HTTP status, the response JSON — in Swagger UI all four fit in one screen.</li>
<li><strong>Name</strong>: <code>LAB4_&lt;ID&gt;_R&lt;round&gt;.png</code>, e.g. <code>LAB4_SB7_R1.png</code>; several shots: <code>LAB4_SB7_R1_step3.png</code>.</li>
<li><strong>Where</strong>: the group folder <code>Lab4-Evidence/&lt;Workflow&gt;/</code> or attached to the case's card; the Evidence cell holds the name or the link.</li>
<li>Never reuse a Round 1 picture for Round 2 — the date in the corner of Swagger UI's answer header gives it away.</li>
</ul>
<h3>4 · Defects</h3>
<p>For every Failed: a Bug card with the case ID in the title, steps to reproduce (copy the Procedure), expected, actual (the JSON), the screenshot, and the environment (commit, profile). Its key goes into Note. When the developer fixes it, the retest is the next round of the same case.</p>
<h3>5 · Worked statistics — one sheet over three rounds</h3>
<p class="ghi-chu">The numbers in this table are an exercise (assumed), not results of the team: in it, SB9 was Pending in Round 1 because the tester restarted the app, and the SB7 defect was fixed before Round 3.</p>
${ROUNDS_SB}
<h3>6 · Worked statistics — the whole team, last round</h3>
<p class="ghi-chu">Assumed numbers for the exercise.</p>
${TEAM_TOTAL}
<ul>
<li>Test coverage = (72 + 1) × 100 / (75 − 1) = 7300 / 74 = <strong>98.65 %</strong>.</li>
<li>Test successful coverage = 72 × 100 / 74 = <strong>97.30 %</strong>.</li>
<li>The Pending case lowers coverage (it was not executed); the Failed case lowers only the successful coverage; the N/A case is removed from the denominator.</li>
</ul>
<h3>7 · If the lecturer wants exactly the sample's layout (4 rounds + an Evidence column)</h3>
<p>CT Work's 5.3 export follows the official template: 3 rounds, Evidence written in the Note cell. If the lecturer asks for the ABClinic layout, edit the exported file in Excel <strong>after</strong> all results are in CT Work (Excel shifts formulas automatically when you insert columns or rows):</p>
<ol>
<li>In each workflow sheet, right-click column F (Round 1) → <strong>Insert</strong> → header F10 = <em>Evidence</em>; move the "Evidence: …" text of each Note into it.</li>
<li>Right-click the Note column (now P) → insert 3 columns → headers <em>Round 4 · Test date · Tester</em>.</li>
<li>Right-click row 9 → <strong>Insert</strong> → A9 = <em>Round 4</em>, B9 = <code>=COUNTIF($P$12:$P$1000,B$5)</code>, copy to C9:E9.</li>
<li>Copy cell M12 (Round 3) → <strong>Paste Special → Validation</strong> onto P12:P1000, so Round 4 has the same drop-down.</li>
<li>Test Statistics: point each workflow row to row 9 (B9, C9, D9, E9) so it reports Round 4.</li>
<li>Check: enter one Failed in Round 4 of a copy and watch B9:E9 and the statistics change.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Ask first.</strong> The official template has 3 rounds and no Evidence column. Do the manual edit only if the lecturer confirms the 4-round layout (question Q2/Q3 of lesson 4.1).</div>
<h3>Practice</h3>
<p>A sheet has 15 cases: 11 Passed, 2 Failed, 1 Pending, 1 N/A. Compute both percentages.</p>
${ansEn('92.86 % · 78.57 %', 'Denominator 15 − 1 = 14. Coverage = (11 + 2) × 100 / 14 = 92.86 %. Successful coverage = 11 × 100 / 14 = 78.57 %.')}`,
    `<span class="eyebrow">Lab 4 · Bài 4.4 · Round · Evidence · Test Statistics</span>
<h2>Một round là một lời cam kết: "đây là việc hệ thống đã làm vào ngày đó"</h2>
<p class="lead">Viết case mới là một nửa Lab 4. Nửa kia là chạy chúng nhiều lần, ghi trung thực chuyện đã xảy ra, chứng minh bằng ảnh và biến kết quả thành sheet thống kê.</p>
<h3>1 · Bốn loại kết quả</h3>
<div class="table-wrap"><table>
<thead><tr><th>Kết quả</th><th>Nghĩa</th><th>Ví dụ LabFlow</th></tr></thead>
<tbody>
<tr><td><strong>Passed</strong></td><td>đã chạy, thấy đủ mọi kết quả mong đợi</td><td>SB8 trả 201 CONFIRMED và khung giờ biến khỏi danh sách tìm</td></tr>
<tr><td><strong>Failed</strong></td><td>đã chạy, có ít nhất một kết quả mong đợi không thấy</td><td>SB7 bước 3 trả 500 thay vì 400</td></tr>
<tr><td><strong>Pending</strong></td><td>vòng này chưa chạy được (bị chặn, thiếu môi trường)</td><td>SB9 sau khi app bị khởi động lại: lượt đặt của SB8 không còn</td></tr>
<tr><td><strong>N/A</strong></td><td>không áp dụng cho bản phát hành này</td><td>case về duyệt lượt đặt — bản v0.1 chưa có API duyệt</td></tr>
</tbody></table></div>
<h3>2 · Ai chạy vòng nào</h3>
${flow(step('Round 1', 'Chủ workflow', 'chạy lần đầu trên dữ liệu sạch'), step('Round 2', 'Một bạn khác', 'tester độc lập: chạy lại toàn bộ, chỉ làm theo các bước đã viết'), step('Round 3', 'Chủ workflow', 'hồi quy toàn bộ trên bản cuối'))}
<ul>
<li>Cột Tester ghi đúng người đã bấm — tệp mẫu để một cái tên cho cả 384 ô kết quả.</li>
<li>Test date = ngày chạy thật. Một vòng chạy hai ngày thì mỗi case ghi đúng ngày của nó.</li>
<li>Case Failed giữ nguyên Failed ở vòng sau cho tới khi lỗi được sửa và chạy lại; tuyệt đối không chép Passed sang vòng sau.</li>
</ul>
<h3>3 · Evidence phải chứng minh được điều gì đó</h3>
<ul>
<li><strong>Trong ảnh có gì</strong>: method + URL, body/header gửi đi, mã HTTP, JSON trả về — trong Swagger UI cả bốn nằm gọn một màn hình.</li>
<li><strong>Tên</strong>: <code>LAB4_&lt;ID&gt;_R&lt;vòng&gt;.png</code>, ví dụ <code>LAB4_SB7_R1.png</code>; nhiều ảnh: <code>LAB4_SB7_R1_step3.png</code>.</li>
<li><strong>Để đâu</strong>: thư mục chung <code>Lab4-Evidence/&lt;Workflow&gt;/</code> hoặc đính kèm thẻ của case; ô Evidence ghi tên ảnh hoặc link.</li>
<li>Đừng dùng lại ảnh Round 1 cho Round 2 — dòng ngày giờ trong header câu trả lời của Swagger UI sẽ tố cáo ngay.</li>
</ul>
<h3>4 · Lỗi (defect)</h3>
<p>Mỗi case Failed: một thẻ Bug có mã case trong tiêu đề, các bước tái hiện (chép Procedure), kết quả mong đợi, kết quả thật (JSON), ảnh, môi trường (commit, profile). Mã thẻ ghi vào Note. Khi lập trình viên sửa xong, lần chạy lại chính là vòng kế tiếp của đúng case đó.</p>
<h3>5 · Tính thống kê có lời giải — một sheet qua ba vòng</h3>
<p class="ghi-chu">Số trong bảng là số giả định để luyện tính, không phải kết quả của nhóm: trong đó SB9 Pending ở Round 1 vì tester lỡ khởi động lại app, và lỗi SB7 được sửa trước Round 3.</p>
${ROUNDS_SB}
<h3>6 · Tính thống kê có lời giải — cả nhóm, vòng cuối</h3>
<p class="ghi-chu">Số giả định để luyện tính.</p>
${TEAM_TOTAL}
<ul>
<li>Test coverage = (72 + 1) × 100 / (75 − 1) = 7300 / 74 = <strong>98,65 %</strong>.</li>
<li>Test successful coverage = 72 × 100 / 74 = <strong>97,30 %</strong>.</li>
<li>Case Pending làm giảm coverage (vì chưa chạy); case Failed chỉ làm giảm successful coverage; case N/A bị bỏ khỏi mẫu số.</li>
</ul>
<h3>7 · Nếu cô muốn đúng bố cục tệp mẫu (4 round + cột Evidence)</h3>
<p>Tệp 5.3 do CT Work xuất theo template chính thức: 3 round, Evidence ghi trong ô Note. Nếu cô yêu cầu đúng khuôn ABClinic, sửa tệp đã xuất bằng Excel <strong>sau khi</strong> mọi kết quả đã nằm trên CT Work (Excel tự dời công thức khi chèn cột hoặc dòng):</p>
<ol>
<li>Ở mỗi sheet workflow, bấm chuột phải cột F (Round 1) → <strong>Insert</strong> → ô F10 ghi <em>Evidence</em>; chuyển đoạn "Evidence: …" trong Note của từng case sang cột này.</li>
<li>Bấm chuột phải cột Note (giờ là cột P) → chèn 3 cột → tiêu đề <em>Round 4 · Test date · Tester</em>.</li>
<li>Bấm chuột phải dòng 9 → <strong>Insert</strong> → A9 ghi <em>Round 4</em>, B9 = <code>=COUNTIF($P$12:$P$1000,B$5)</code>, chép sang C9:E9.</li>
<li>Copy ô M12 (Round 3) → <strong>Paste Special → Validation</strong> vào P12:P1000 để Round 4 có cùng ô chọn thả xuống.</li>
<li>Sheet Test Statistics: cho mỗi dòng workflow trỏ tới dòng 9 (B9, C9, D9, E9) để báo Round 4.</li>
<li>Kiểm: trong một bản sao, nhập thử một Failed ở Round 4 rồi xem B9:E9 và bảng thống kê có đổi theo không.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Hỏi trước đã.</strong> Template chính thức có 3 round và không có cột Evidence. Chỉ sửa tay khi cô xác nhận muốn bố cục 4 round (câu Q2/Q3 ở bài 4.1).</div>
<h3>Thực hành</h3>
<p>Một sheet có 15 case: 11 Passed, 2 Failed, 1 Pending, 1 N/A. Tính hai tỉ lệ.</p>
${ansVi('92,86 % · 78,57 %', 'Mẫu số 15 − 1 = 14. Coverage = (11 + 2) × 100 / 14 = 92,86 %. Successful coverage = 11 × 100 / 14 = 78,57 %.')}`),
    books([
      ['fst4', 'Ch.5 §3 "Test monitoring and control" and test reports pp.175–180 (PDF 189–194); Ch.5 §6 defect management', 'Chương 5 §3 giám sát, điều khiển và báo cáo test trang 175–180 (PDF 189–194); Chương 5 §6 quản lý lỗi'],
      ['sp5', '§6.3.4 Test reports (PDF 281); §6.4 Defect management (PDF 284–292)', '§6.3.4 Test reports (PDF 281); §6.4 Defect management (PDF 284–292)'],
    ]),
  ].join('\n'),
};

/* ═══════════════════════ L4.5 — Chia việc, CT Work, xuất Excel, thuyết trình ═══════════════════════ */
const L45 = {
  title: 'L4.5 — Five members on CT Work: workflows, rounds, Excel export and presenting|||L4.5 — Năm thành viên trên CT Work: chia workflow, ghi round, xuất Excel 5.3, thuyết trình',
  slug: 'swt301-lab4-chia-viec-ct-work',
  type: 'DOCUMENT',
  description: 'Chặng về đích của Lab 4: project swt301/LAB4 trên CT Work (5 sheet workflow, cover và môi trường điền sẵn, 12 thẻ việc có checklist và hạn), cách mỗi người nhập case, ghi round, Evidence; lịch 7 ngày; chạy chéo Round 2; xuất Excel 5.3 rồi kiểm; chỗ CT Work còn khác tệp mẫu; cấu trúc slide và gói nộp.',
  content: [
    bi(`<span class="eyebrow">Lab 4 · Lesson 4.5 · CT Work swt301/LAB4</span>
<h2>From five laptops to one Report 5.3</h2>
<p class="lead">Five people writing into one Excel file by e-mail ends with five versions and broken formulas. The team works in one CT Work project instead, and the Excel file is generated at the end.</p>
<h3>1 · What is already in the project</h3>
<ul>
<li><strong>Tests → System test (5.3)</strong>: five workflow sheets — StudentBooking (16 cases written), AccountAdministration, LabSetup, EquipmentOperations, CalendarPolicy (header filled, cases to write).</li>
<li><strong>Cover &amp; changes</strong>: project <em>LabFlow Demo (SWT301)</em>, code LFD, issue date, the full <strong>Test Environment Setup Description</strong>, two Record-of-change rows.</li>
<li><strong>Board</strong>: the brief, the workflow guide, the questions for the lecturer, the kickoff, one card per member (checklist + due date), Round 2, Round 3 + export, slides.</li>
</ul>
<h3>2 · Seven days</h3>
<div class="lz-map">
<div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Kickoff — everyone runs the app and calls GET /api/v1/me</div><div class="lz-nsub">assign TV2–TV5, create the Evidence folder</div></div></div>
<div class="lz-node"><div class="lz-badge">2–3</div><div class="lz-nbody"><div class="lz-ntitle">Write 14–16 cases each — expected results before running</div><div class="lz-nsub">copy the StudentBooking way of writing</div></div></div>
<div class="lz-node"><div class="lz-badge">4–5</div><div class="lz-nbody"><div class="lz-ntitle">Round 1 + Evidence + Bug cards</div><div class="lz-nsub">fresh start, run in order</div></div></div>
<div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Round 2 — cross-testing</div><div class="lz-nsub">TV1↔TV2, TV3↔TV4, TV5 with TV1</div></div></div>
<div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Round 3, export, slides, rehearsal</div><div class="lz-nsub">if the deadline is sooner: drop Round 3</div></div></div>
</div>
<h3>3 · Entering a case and a round</h3>
<ol>
<li>Open your sheet, <strong>Add test case</strong>: scenario (group row), Description, Procedure, Test data, Expected, Pre-conditions, Note.</li>
<li>After running: choose the result in the Round column, the date and tester fill in; write the Actual result for Failed; put the screenshot name or link in <em>Evidence (link / screenshot)</em>.</li>
<li>Record of change: one "A – Add system test for the … workflow" row when your sheet is complete; an "M" row when you change cases later.</li>
</ol>
<h3>4 · Export and check</h3>
<ol>
<li><strong>Export 5.3 (.xlsx)</strong> → <code>LFD_Report5.3_System_Test_Report.xlsx</code>.</li>
<li>Open Test Cases: click the five sheet links.</li>
<li>Open Test Statistics: the Sub total covers five rows; recompute one sheet by hand (lesson 4.4).</li>
<li>Search the file for "&lt;" and "intergration": nothing should be found except the case IDs.</li>
</ol>
<h3>5 · Where CT Work still differs from the sample</h3>
<div class="table-wrap"><table>
<thead><tr><th>Point</th><th>Sample</th><th>CT Work 5.3 today</th><th>What to do</th></tr></thead>
<tbody>
<tr><td>Rounds</td><td>4</td><td>3 (like the template)</td><td>ask the lecturer; if 4 is required, edit the export (lesson 4.4 §7)</td></tr>
<tr><td>Evidence</td><td>own column</td><td>inside Note ("Evidence: …")</td><td>same</td></tr>
<tr><td>Sheet label</td><td>Feature</td><td>Workflow (template)</td><td>keep Workflow unless told otherwise</td></tr>
<tr><td>Statistics document code</td><td>LFD_TestReport5.3_v1.0</td><td>LFD_Test Report_v1.0 (template text)</td><td>align it with the Cover by hand if the lecturer cares</td></tr>
</tbody></table></div>
<h3>6 · The presentation</h3>
<ol>
<li>Team lead: one slide "system vs integration", one slide Test Statistics with the two formulas.</li>
<li>Each member, 1–2 slides: the journey of the workflow, one case in full with its screenshot, the three rounds, one defect.</li>
<li>Live: Swagger UI open, the app running; each member re-runs one case when the lecturer points at it.</li>
<li>After submitting, move your card to In Review — the timestamp is your on-time proof.</li>
</ol>
<h3>Practice (team lead)</h3>
<p>Before the kickoff, run SB1 → SB16 once yourself and note the minutes it takes.</p>
${ansEn('≈ 25–35 min', 'About 16 × 2 minutes including screenshots. That is the time each member should plan per round for a 15-case workflow — three rounds ≈ 1.5–2 hours per person.')}`,
    `<span class="eyebrow">Lab 4 · Bài 4.5 · CT Work swt301/LAB4</span>
<h2>Từ năm cái laptop tới một Report 5.3</h2>
<p class="lead">Năm người cùng sửa một tệp Excel qua email thì cuối cùng có năm phiên bản và công thức gãy. Nhóm làm chung trên một project CT Work, tệp Excel được sinh ra ở bước cuối.</p>
<h3>1 · Trong project đã có sẵn gì</h3>
<ul>
<li><strong>Tests → System test (5.3)</strong>: năm sheet workflow — StudentBooking (đã viết 16 case), AccountAdministration, LabSetup, EquipmentOperations, CalendarPolicy (đã điền phần đầu, chờ viết case).</li>
<li><strong>Cover &amp; changes</strong>: dự án <em>LabFlow Demo (SWT301)</em>, mã LFD, ngày phát hành, ô <strong>Test Environment Setup Description</strong> đầy đủ, hai dòng Record of change.</li>
<li><strong>Board</strong>: đề bài, hướng dẫn workflow, câu hỏi cho cô, kickoff, mỗi thành viên một thẻ (checklist + hạn), Round 2, Round 3 + xuất Excel, slide.</li>
</ul>
<h3>2 · Bảy ngày</h3>
<div class="lz-map">
<div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Kickoff — ai cũng chạy được app và gọi được GET /api/v1/me</div><div class="lz-nsub">gán TV2–TV5, tạo thư mục Evidence</div></div></div>
<div class="lz-node"><div class="lz-badge">2–3</div><div class="lz-nbody"><div class="lz-ntitle">Mỗi người viết 14–16 case — viết kết quả mong đợi trước khi chạy</div><div class="lz-nsub">bắt chước cách viết của StudentBooking</div></div></div>
<div class="lz-node"><div class="lz-badge">4–5</div><div class="lz-nbody"><div class="lz-ntitle">Round 1 + Evidence + thẻ Bug</div><div class="lz-nsub">dữ liệu sạch, chạy đúng thứ tự</div></div></div>
<div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Round 2 — chạy chéo</div><div class="lz-nsub">TV1↔TV2, TV3↔TV4, TV5 với TV1</div></div></div>
<div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Round 3, xuất Excel, slide, tập dượt</div><div class="lz-nsub">hạn sớm hơn thì bỏ Round 3</div></div></div>
</div>
<h3>3 · Nhập một case và một vòng</h3>
<ol>
<li>Mở sheet của mình, <strong>Add test case</strong>: scenario (dòng nhóm), Description, Procedure, Test data, Expected, Pre-conditions, Note.</li>
<li>Chạy xong: chọn kết quả ở cột Round, ngày và tên người chạy tự điền; case Failed ghi kết quả thật (Actual); dán tên ảnh hoặc link vào ô <em>Evidence (link / screenshot)</em>.</li>
<li>Record of change: xong sheet thì thêm một dòng "A – Add system test for the … workflow"; sau này sửa case thì thêm dòng "M".</li>
</ol>
<h3>4 · Xuất và kiểm</h3>
<ol>
<li><strong>Export 5.3 (.xlsx)</strong> → <code>LFD_Report5.3_System_Test_Report.xlsx</code>.</li>
<li>Mở Test Cases: bấm thử năm link sheet.</li>
<li>Mở Test Statistics: Sub total cộng đủ năm dòng; tự tính tay lại một sheet (bài 4.4).</li>
<li>Tìm trong tệp chữ "&lt;" và "intergration": ngoài mã case ra thì không được còn gì.</li>
</ol>
<h3>5 · CT Work còn khác tệp mẫu ở đâu</h3>
<div class="table-wrap"><table>
<thead><tr><th>Điểm</th><th>Tệp mẫu</th><th>CT Work 5.3 hiện tại</th><th>Làm gì</th></tr></thead>
<tbody>
<tr><td>Số round</td><td>4</td><td>3 (giống template)</td><td>hỏi cô; nếu bắt buộc 4 thì sửa tệp xuất (bài 4.4 mục 7)</td></tr>
<tr><td>Evidence</td><td>cột riêng</td><td>nằm trong Note ("Evidence: …")</td><td>như trên</td></tr>
<tr><td>Nhãn sheet</td><td>Feature</td><td>Workflow (theo template)</td><td>giữ Workflow nếu cô không nói khác</td></tr>
<tr><td>Mã tài liệu ở Statistics</td><td>LFD_TestReport5.3_v1.0</td><td>LFD_Test Report_v1.0 (chữ của template)</td><td>sửa tay cho khớp Cover nếu cô để ý</td></tr>
</tbody></table></div>
<h3>6 · Thuyết trình</h3>
<ol>
<li>Nhóm trưởng: một slide "system vs integration", một slide Test Statistics với hai công thức.</li>
<li>Mỗi người 1–2 slide: hành trình của workflow, một case đầy đủ kèm ảnh, ba vòng, một lỗi.</li>
<li>Chạy trực tiếp: Swagger UI mở sẵn, app đang chạy; cô chỉ case nào thì người đó chạy lại case đó.</li>
<li>Nộp xong thì kéo thẻ sang In Review — mốc giờ đó là bằng chứng nộp đúng hạn.</li>
</ol>
<h3>Thực hành (nhóm trưởng)</h3>
<p>Trước buổi kickoff, tự chạy SB1 → SB16 một lượt và ghi lại hết bao nhiêu phút.</p>
${ansVi('≈ 25–35 phút', 'Khoảng 16 × 2 phút kể cả chụp ảnh. Đó là thời gian mỗi người nên dành cho một vòng của workflow 15 case — ba vòng ≈ 1,5–2 giờ mỗi người.')}`),
  ].join('\n'),
};

/* ──────────────────────────────── Quiz ──────────────────────────────── */
const q = (question, options, correctIndex, explanation) => ({ question, options, correctIndex, points: 1, ...(explanation ? { explanation } : {}) });
const QUIZ = {
  title: 'Quiz Lab 4 — System test report (Report 5.3)|||Quiz Lab 4 — Báo cáo system test (Report 5.3)',
  slug: 'swt301-lab4-quiz',
  type: 'QUIZ',
  description: '12 câu về Lab 4: system test khác integration test, cách viết case end-to-end, Passed/Failed/Pending/N/A, công thức coverage, tester độc lập, Evidence và các lỗi của tệp mẫu ABClinic.',
  quiz: {
    timeLimitSeconds: 720,
    questions: [
      q('Which case belongs in the Report 5.3 system test rather than the 5.2 integration test?|||Case nào thuộc báo cáo system test 5.3 hơn là integration test 5.2?', ['POST /reservations with an overlapping slot returns 409 RES_CONFLICT|||POST /reservations trùng giờ trả 409 RES_CONFLICT', 'A student registers, verifies, signs in, books AL-301, and a second student no longer finds that slot|||Sinh viên đăng ký, xác minh, đăng nhập, đặt AL-301, và sinh viên thứ hai không còn thấy khung giờ đó', 'BookingPolicy.checkPeriod rejects a start in the past|||BookingPolicy.checkPeriod từ chối giờ bắt đầu trong quá khứ', 'The JWT filter rejects a token with a changed signature|||Bộ lọc JWT từ chối token bị sửa chữ ký'], 1, 'A system test follows a whole user journey through several functions and roles and checks the consequence for another user. The 409 check and the JWT check test interfaces between components (integration); checkPeriod is one method (unit).|||System test đi theo cả hành trình người dùng qua nhiều chức năng, nhiều vai và kiểm hậu quả với người dùng khác. Kiểm 409 và kiểm JWT là test giao tiếp giữa các thành phần (integration); checkPeriod là một hàm (unit).'),
      q('In Report 5.3, one sheet normally corresponds to…|||Trong Report 5.3, một sheet thường ứng với…', ['one Java class|||một lớp Java', 'one REST endpoint|||một endpoint REST', 'one end-to-end business workflow|||một luồng nghiệp vụ đầu-cuối', 'one test round|||một vòng test'], 2, 'The official 5.3 template labels each sheet "Workflow" and groups its cases into scenarios. Classes belong to 5.1, modules and endpoints to 5.2, and rounds are columns inside every sheet.|||Template 5.3 chính thức gắn nhãn mỗi sheet là "Workflow" và gom case theo scenario. Lớp thuộc về 5.1, module và endpoint thuộc 5.2, còn round là các cột trong mỗi sheet.'),
      q('Test coverage in Test Statistics is computed as…|||Test coverage trong Test Statistics được tính bằng…', ['Passed × 100 / Total|||Passed × 100 / Tổng', 'Passed × 100 / (Total − N/A)|||Passed × 100 / (Tổng − N/A)', '(Total − Pending) × 100 / Total|||(Tổng − Pending) × 100 / Tổng', '(Passed + Failed) × 100 / (Total − N/A)|||(Passed + Failed) × 100 / (Tổng − N/A)'], 3, 'Coverage counts every case that was executed, passed or failed, out of the cases that apply. Passed × 100 / (Total − N/A) is the other line, "test successful coverage".|||Coverage đếm mọi case đã chạy, dù qua hay trượt, trên số case áp dụng được. Passed × 100 / (Tổng − N/A) là dòng còn lại, "test successful coverage".'),
      q('A sheet has 15 cases: 11 Passed, 2 Failed, 1 Pending, 1 N/A. What is the test successful coverage?|||Một sheet có 15 case: 11 Passed, 2 Failed, 1 Pending, 1 N/A. Test successful coverage là bao nhiêu?', ['73.33 %', '78.57 %', '86.67 %', '92.86 %'], 1, 'The denominator is 15 − 1 = 14, so 11 × 100 / 14 = 78.57 %. 92.86 % is the test coverage (13 executed of 14); 73.33 % forgets to remove the N/A case.|||Mẫu số là 15 − 1 = 14, nên 11 × 100 / 14 = 78,57 %. 92,86 % là test coverage (13 đã chạy trên 14); 73,33 % là quên bỏ case N/A.'),
      q('Round 1: the app was restarted before SB9, so SB8\'s booking no longer exists and SB9 cannot be executed. Its Round 1 result is…|||Round 1: app bị khởi động lại trước SB9, lượt đặt của SB8 không còn nên SB9 không chạy được. Kết quả Round 1 của SB9 là…', ['Passed', 'Failed', 'Pending', 'N/A'], 2, 'Pending means the case could not be run yet in this round because something blocks it. Failed would claim the system misbehaved; N/A would claim the case does not apply to the release at all.|||Pending nghĩa là vòng này chưa chạy được vì bị chặn. Failed sẽ khẳng định hệ thống chạy sai; N/A sẽ khẳng định case không áp dụng cho bản phát hành.'),
      q('Why should Round 2 be run by a different member than the author of the workflow?|||Vì sao Round 2 nên do một thành viên khác (không phải người viết workflow) chạy?', ['System testing is typically done by independent testers, and another person proves the steps are reproducible|||System test thường do tester độc lập làm, và người khác chạy được chứng tỏ các bước làm lại được', 'To finish faster|||Để xong nhanh hơn', 'Because the author cannot see the Round 2 column|||Vì người viết không thấy được cột Round 2', 'Because CT Work requires it|||Vì CT Work bắt buộc'], 0, 'SWT2 slide 77: system testing is typically carried out by independent testers. An author tends to run from memory; a second person who follows only the written procedure exposes missing steps and data.|||SWT2 slide 77: system test thường do tester độc lập thực hiện. Người viết hay chạy theo trí nhớ; người thứ hai chỉ làm theo các bước đã viết sẽ lộ ra bước và dữ liệu còn thiếu.'),
      q('Which pre-condition is written well?|||Điều kiện trước nào được viết tốt?', ['The user is logged in|||Người dùng đã đăng nhập', 'Test the booking function|||Kiểm chức năng đặt phòng', 'AL-301 is ACTIVE and free on D 09:00–11:00 Vietnam time|||AL-301 đang ACTIVE và còn trống ngày D 09:00–11:00 giờ Việt Nam', 'Everything works|||Mọi thứ chạy tốt'], 2, 'A pre-condition is a checkable state of the data before the case starts. "The user is logged in" is an action that belongs in the steps (the sample even writes it while step 1 is "Login"); the other two are not conditions at all.|||Điều kiện trước là trạng thái dữ liệu kiểm được trước khi bắt đầu. "Người dùng đã đăng nhập" là hành động, phải nằm trong các bước (tệp mẫu còn ghi vậy trong khi bước 1 lại là "Login"); hai đáp án còn lại không phải điều kiện.'),
      q('During preparation SB7 step 3 returned HTTP 500 instead of the expected 400. What do you do in Round 1?|||Khi chuẩn bị, SB7 bước 3 trả HTTP 500 thay vì 400 như mong đợi. Round 1 làm gì?', ['Change the expected result to 500 so the case passes|||Sửa kết quả mong đợi thành 500 cho case qua', 'Mark it N/A|||Ghi N/A', 'Delete the step|||Xoá bước đó', 'Record Failed, write the actual result, open a Bug and put its key in Note|||Ghi Failed, ghi kết quả thật, mở Bug và ghi mã vào Note'], 3, 'A missing required parameter is a client error, so the requirement-based expectation is 400. Rewriting the expectation to match the code tests the code against itself, and N/A or deleting the step hides a real defect.|||Thiếu tham số bắt buộc là lỗi của phía gọi, nên kỳ vọng theo yêu cầu là 400. Sửa kỳ vọng cho khớp code là lấy code test chính nó; ghi N/A hay xoá bước là giấu một lỗi thật.'),
      q('In the ABClinic sample, Round 2 N/A is =COUNTIF($H11:$H995,E5). What is wrong?|||Trong tệp mẫu ABClinic, ô N/A của Round 2 là =COUNTIF($H11:$H995,E5). Sai ở đâu?', ['Nothing|||Không sai gì', 'Column H is the Round 1 column, so Round 2 shows Round 1\'s N/A count|||Cột H là cột Round 1, nên Round 2 hiện số N/A của Round 1', 'E5 should be "Passed"|||E5 phải là "Passed"', 'COUNTIF cannot count text|||COUNTIF không đếm được chữ'], 1, 'In the sample the Round 2 results are in column K; the N/A counter was left pointing at H (Round 1). It looks right only because every round is 100 % Passed.|||Trong tệp mẫu, kết quả Round 2 nằm ở cột K; ô đếm N/A vẫn trỏ cột H (Round 1). Nó trông đúng chỉ vì mọi vòng đều 100 % Passed.'),
      q('What does a good Evidence for an API-only system like LabFlow Demo show?|||Evidence tốt cho một hệ thống chỉ có API như LabFlow Demo cho thấy gì?', ['The method and URL, the request body, the HTTP status and the JSON response|||Method và URL, body gửi đi, mã HTTP và JSON trả về', 'Only the test case ID|||Chỉ mã test case', 'The source code of the controller|||Mã nguồn của controller', 'The Excel row of the case|||Dòng Excel của case'], 0, 'Evidence must prove that the system was really used and show the observed result; in Swagger UI the request and the answer fit in one screen. Code or the Excel row prove nothing about the run.|||Evidence phải chứng minh đã dùng hệ thống thật và cho thấy kết quả quan sát được; trong Swagger UI request và câu trả lời nằm gọn một màn hình. Mã nguồn hay dòng Excel không chứng minh gì về lần chạy.'),
      q('The sample\'s Cover says "Create intergration test document". Why is this a problem for a 5.3 report?|||Cover của tệp mẫu ghi "Create intergration test document". Vì sao đó là vấn đề với báo cáo 5.3?', ['Only the spelling is wrong|||Chỉ sai chính tả', 'It names the wrong test level (and is misspelt): the file was converted from a 5.2 report|||Nó ghi sai cấp test (và sai chính tả): tệp được sửa từ báo cáo 5.2', 'The Cover must be empty|||Cover phải để trống', 'Record of change is not part of 5.3|||Record of change không thuộc 5.3'], 1, 'The Record of change documents what this document is; calling a system test report an integration test document shows it was copied from the 5.2 file without review.|||Record of change ghi lại tài liệu này là gì; gọi báo cáo system test là tài liệu integration test cho thấy nó được chép từ tệp 5.2 mà không rà lại.'),
      q('A student books AL-301, which has exactly 30 seats. With booking.approval-capacity = 30, the booking is…|||Sinh viên đặt AL-301, phòng đúng 30 chỗ. Với booking.approval-capacity = 30, lượt đặt sẽ…', ['PENDING, because 30 needs approval|||PENDING, vì 30 cần duyệt', 'Refused|||Bị từ chối', 'CONFIRMED, because only labs of more than 30 seats need approval|||CONFIRMED, vì chỉ phòng trên 30 chỗ mới cần duyệt', 'N/A'], 2, 'BR-06 requires approval for labs with more than 30 seats, so 30 is the last value on the no-approval side: AL-301 is CONFIRMED at once (SB8) while the 60-seat BE-201 is PENDING (SB10).|||BR-06 chỉ bắt duyệt với phòng trên 30 chỗ, nên 30 là giá trị cuối cùng ở phía không cần duyệt: AL-301 được CONFIRMED ngay (SB8) còn BE-201 60 chỗ thì PENDING (SB10).'),
    ],
  },
};

export default {
  title: 'Lab 4 — System test report (Report 5.3)|||Lab 4 — Báo cáo system test (Report 5.3)',
  description: 'Bài lab cuối: system test LabFlow Demo theo Report 5.3 — đề suy ra từ tệp mẫu ABClinic cô gửi và template môn, đọc mẫu từng sheet và 19 lỗi không được chép, lời giải trọn workflow StudentBooking (16 case đã chạy thật, tìm được một lỗi), cách chạy round / Evidence / thống kê coverage, chia việc 5 người trên CT Work, xuất Excel và thuyết trình.',
  lessons: [L41, L42, L43, L44, L45, QUIZ],
};
