/**
 * FER202 · ĐỀ PE SP26 "Attendance System" (FUOverflow "FER202 PE Đề 3- SP26") — dạng dự án cho Code Lab.
 * ════════════════════════════════════════════════════════════════════════════════════════════════
 * Cùng đề với Phòng thi FER202-PE18 (content/exams/FER202-PE18.mjs, Given zip PE18-Given.zip).
 * problemHtml = tờ đề chép lại theo bản Phòng thi (2 câu × 5 điểm, Figure 1–11 tả lại) + 6 ảnh chụp từ lời giải.
 *
 * Tài nguyên ở ./_pe7-attendance/:
 *   database.json   — đúng tệp Given (4 subjects · 6 students · 4 classes có enrollments lồng · 86 attendances · 9 summaries)
 *   loiGiai/src/**  — lời giải đã kiểm (Vite build xanh + Playwright trên json-server@0.17.4) + id/class cho máy chấm
 *   khoiDau/src/**  — starter: index.js + App.js để trống
 *   anh/fig*.webp   — 6 ảnh chụp từ app lời giải
 *
 * Bẫy của đề: dropdown trạng thái phải suy từ dữ liệu (Set); tìm "bắt đầu bằng" (không phải "chứa");
 * ?status= phải pre-select; Câu 2 chỉ hiện enrollment "enrolled" (SE1701: SE004 đã "dropped" ⇒ ẩn);
 * ngày mặc định = hôm nay theo GIỜ ĐỊA PHƯƠNG; ngày trùng so phần ngày của "2026-03-10T00:00:00.000Z";
 * mỗi sinh viên MỘT POST /attendances.
 */
import fs from 'node:fs';
import { doiDau, KHOA, tn } from './_chung.mjs';

const TN_MUC = new URL('./_pe7-attendance/', import.meta.url);
const doc = (p) => fs.readFileSync(new URL(p, TN_MUC), 'utf8').replace(/\r\n/g, '\n');
const anh = (ten) => `data:image/webp;base64,${fs.readFileSync(new URL(`anh/${ten}.webp`, TN_MUC)).toString('base64')}`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const DB_JSON = doc('database.json');
const DB = JSON.parse(DB_JSON);

const KHOI_DAU = {
  'src/index.js': doc('khoiDau/src/index.js'),
  'src/App.js': doc('khoiDau/src/App.js'),
};
const LOI_GIAI = {
  'src/index.js': doc('loiGiai/src/index.js'),
  'src/App.js': doc('loiGiai/src/App.js'),
  'src/api.js': doc('loiGiai/src/api.js'),
  'src/dateUtils.js': doc('loiGiai/src/dateUtils.js'),
  'src/pages/SubjectList.js': doc('loiGiai/src/pages/SubjectList.js'),
  'src/pages/BulkAttendance.js': doc('loiGiai/src/pages/BulkAttendance.js'),
};

// ───────────────────────── Hằng dữ liệu (khớp database.json) ─────────────────────────
const B = 'http://localhost:9999';
const PRJ = '65aa00000000000000000001'; // PRJ301 ACTIVE  (SE1701, SE1702)
const SWP = '65aa00000000000000000002'; // SWP391 ACTIVE  (SE1703)
const SWR = '65aa00000000000000000003'; // SWR302 INACTIVE (0 lớp)
const C1 = '65bb00000000000000000001';  // SE1701: SE001–SE003 enrolled, SE004 dropped; đã điểm danh 10 buổi tới 2026-03-10
const C2 = '65bb00000000000000000002';  // SE1702: SE004–SE006
const S = (n) => `65dd0000000000000000000${n}`;
const LIST = '/subjects';
const ATT = (sub, cls) => `/subjects/${sub}/attendance${cls ? `?classId=${cls}` : ''}`;
const URL_C1 = ATT(PRJ, C1);

// ───────────────────────── Hành động cho máy chấm ─────────────────────────
const cho = (ms = 300) => ({ hanhDong: 'cho', ms });
const nhap = (selector, giaTri) => ({ hanhDong: 'nhap', selector, giaTri });
const doi = (selector, giaTri) => ({ hanhDong: 'doi', selector, giaTri });
const click = (selector) => ({ hanhDong: 'click', selector });
const tick = (selector) => ({ hanhDong: 'chon-o', selector });
const radio = (n, st) => tick(`#att-${S(n)}-${st}`);
const GHI = click('#record-attendance');
const DU_BA = [radio(1, 'PRESENT'), radio(2, 'ABSENT'), radio(3, 'PRESENT')];
const THANH_CONG = [cho(400), nhap('#session-date', '2026-04-01'), ...DU_BA, GHI, cho(600)];

const KIEM = [
  // ───────── f1 — Câu 1 · Routing + fetch + lưới thẻ (1.5đ) ─────────
  { nhom: 'f1', moTa: '"/" redirects to /subjects', url: '/', kiem: 'duong-dan', giaTri: LIST },
  { nhom: 'f1', moTa: '/subjects renders the Subject List page (search box present)', url: LIST, kiem: 'ton-tai', selector: '#search' },
  { nhom: 'f1', an: true, moTa: 'Subjects fetched from GET /subjects', url: LIST, kiem: 'goi-fetch', khop: `^GET ${B}/subjects$` },
  { nhom: 'f1', moTa: 'All 4 subjects shown (one .subject-card each)', url: LIST, kiem: 'so-luong', selector: '.subject-card', giaTri: 4 },
  { nhom: 'f1', moTa: 'Cards show the codes in data order', url: LIST, kiem: 'danh-sach-text', selector: '.subject-code', mongDoi: ['PRJ301', 'SWP391', 'SWR302', 'SWT301'] },
  { nhom: 'f1', moTa: 'A card shows Code, Name, Credits and Status', url: LIST, kiem: 'text', selector: '.subject-card', tatCa: false, khop: 'SWP391[\\s\\S]*Software Development Project[\\s\\S]*4[\\s\\S]*ACTIVE' },
  { nhom: 'f1', an: true, moTa: 'Status badges in data order (ACTIVE ×2, INACTIVE, ACTIVE)', url: LIST, kiem: 'danh-sach-text', selector: '.subject-status', mongDoi: ['ACTIVE', 'ACTIVE', 'INACTIVE', 'ACTIVE'] },

  // ───────── f2 — Câu 1 · Ô tìm kiếm (1.0đ) ─────────
  { nhom: 'f2', moTa: 'Search "Soft" ⇒ SWP391, SWR302, SWT301', url: LIST, kiem: 'danh-sach-text', selector: '.subject-code', mongDoi: ['SWP391', 'SWR302', 'SWT301'], truoc: [cho(200), nhap('#search', 'Soft')] },
  { nhom: 'f2', an: true, moTa: 'Case-insensitive + trimmed: "  project " ⇒ PRJ301 only', url: LIST, kiem: 'danh-sach-text', selector: '.subject-code', mongDoi: ['PRJ301'], truoc: [cho(200), nhap('#search', '  project ')] },
  { nhom: 'f2', an: true, moTa: '"Starts with", not "contains": "Testing" ⇒ no subject', url: LIST, kiem: 'so-luong', selector: '.subject-card', giaTri: 0, truoc: [cho(200), nhap('#search', 'Testing'), cho(100)] },
  { nhom: 'f2', an: true, moTa: 'Searching makes no extra API call (still one GET /subjects)', url: LIST, kiem: 'goi-fetch', khop: `^GET ${B}/subjects`, min: 1, max: 1, truoc: [cho(200), nhap('#search', 'So'), cho(200)] },

  // ───────── f3 — Câu 1 · Lọc trạng thái (1.0đ) ─────────
  { nhom: 'f3', moTa: 'Dropdown = All Status + unique statuses from the data', url: LIST, kiem: 'danh-sach-text', selector: '#status-filter option', mongDoi: ['All Status', 'ACTIVE', 'INACTIVE'] },
  { nhom: 'f3', moTa: 'Status INACTIVE ⇒ SWR302 only', url: LIST, kiem: 'danh-sach-text', selector: '.subject-code', mongDoi: ['SWR302'], truoc: [cho(200), doi('#status-filter', 'INACTIVE')] },
  { nhom: 'f3', moTa: '"Soft" + ACTIVE ⇒ SWP391, SWT301 (search AND status)', url: LIST, kiem: 'danh-sach-text', selector: '.subject-code', mongDoi: ['SWP391', 'SWT301'], truoc: [cho(200), nhap('#search', 'Soft'), doi('#status-filter', 'ACTIVE')] },
  { nhom: 'f3', an: true, moTa: 'Counter "Showing 2 of 4 subjects" after "Soft" + ACTIVE', url: LIST, kiem: 'text', selector: '.showing-text', khop: 'Showing\\s*2\\s*of\\s*4\\s*subjects', truoc: [cho(200), nhap('#search', 'Soft'), doi('#status-filter', 'ACTIVE')] },

  // ───────── f4 — Câu 1 · ?status= + View Attendance (1.5đ) ─────────
  { nhom: 'f4', moTa: '/subjects?status=ACTIVE pre-selects the dropdown', url: '/subjects?status=ACTIVE', kiem: 'thuoc-tinh-js', selector: '#status-filter', thuocTinh: 'value', giaTri: 'ACTIVE' },
  { nhom: 'f4', moTa: '/subjects?status=ACTIVE ⇒ PRJ301, SWP391, SWT301', url: '/subjects?status=ACTIVE', kiem: 'danh-sach-text', selector: '.subject-code', mongDoi: ['PRJ301', 'SWP391', 'SWT301'] },
  { nhom: 'f4', an: true, moTa: '/subjects?status=INACTIVE ⇒ SWR302 only', url: '/subjects?status=INACTIVE', kiem: 'danh-sach-text', selector: '.subject-code', mongDoi: ['SWR302'] },
  { nhom: 'f4', moTa: 'Every card has a "View Attendance" button', url: LIST, kiem: 'so-luong', selector: '.view-attendance', giaTri: 4 },
  { nhom: 'f4', moTa: '"View Attendance" on SWP391 ⇒ /subjects/:id/attendance', url: '/subjects?status=ACTIVE', kiem: 'duong-dan', khop: `^/subjects/${SWP}/attendance`, truoc: [cho(300), { hanhDong: 'click', selector: '.view-attendance', thu: 1 }] },

  // ───────── f5 — Câu 2 · Routing + fetch + header + chọn lớp (1.0đ) ─────────
  { nhom: 'f5', moTa: '/subjects/:id/attendance renders (Record Attendance button present)', url: URL_C1, kiem: 'ton-tai', selector: '#record-attendance' },
  { nhom: 'f5', an: true, moTa: 'Subject fetched by id: GET /subjects/:id', url: URL_C1, kiem: 'goi-fetch', khop: `^GET ${B}/subjects/${PRJ}$` },
  { nhom: 'f5', an: true, moTa: 'Classes fetched by subject: GET /classes?subjectId=:id', url: URL_C1, kiem: 'goi-fetch', khop: `^GET ${B}/classes\\?(.*&)?subjectId=${PRJ}(&|$)` },
  { nhom: 'f5', moTa: 'Header shows the subject (PRJ301 — Project Management)', url: URL_C1, kiem: 'text', selector: '.subject-title', khop: 'PRJ301[\\s\\S]*Project Management' },
  { nhom: 'f5', moTa: 'Class dropdown lists only the classes of PRJ301 (SE1701, SE1702)', url: URL_C1, kiem: 'danh-sach-text', selector: '#class-select option', mongDoi: ['-- Select class --', 'SE1701', 'SE1702'] },
  { nhom: 'f5', moTa: '?classId= pre-selects the class', url: URL_C1, kiem: 'thuoc-tinh-js', selector: '#class-select', thuocTinh: 'value', giaTri: C1 },

  // ───────── f6 — Câu 2 · Bảng sinh viên (1.25đ) ─────────
  { nhom: 'f6', moTa: 'SE1701 shows the 3 ENROLLED students only (SE004 dropped is hidden)', url: URL_C1, kiem: 'danh-sach-text', selector: '.student-code', mongDoi: ['SE001', 'SE002', 'SE003'] },
  { nhom: 'f6', moTa: 'Each student row has a PRESENT and an ABSENT radio', url: URL_C1, kiem: 'so-luong', selector: '.student-row input[type="radio"]', giaTri: 6 },
  { nhom: 'f6', moTa: 'Choosing SE1702 in the dropdown ⇒ SE004, SE005, SE006', url: URL_C1, kiem: 'danh-sach-text', selector: '.student-code', mongDoi: ['SE004', 'SE005', 'SE006'], truoc: [cho(300), doi('#class-select', C2), cho(300)] },
  { nhom: 'f6', an: true, moTa: 'Choosing a class updates ?classId= in the URL', url: URL_C1, kiem: 'duong-dan', khop: `classId=${C2}`, truoc: [cho(300), doi('#class-select', C2), cho(200)] },

  // ───────── f7 — Câu 2 · Ngày + Luật 1 + Luật 2 (1.5đ) ─────────
  { nhom: 'f7', moTa: 'Date input defaults to a date (today, YYYY-MM-DD)', url: URL_C1, kiem: 'thuoc-tinh', selector: '#session-date', thuocTinh: 'value', khop: '^20\\d\\d-\\d\\d-\\d\\d$' },
  { nhom: 'f7', moTa: 'Rule 1 — a future date shows "Date cannot be in the future."', url: URL_C1, kiem: 'text', selector: '.error-msg', khop: '^Date cannot be in the future\\.$', truoc: [cho(400), nhap('#session-date', '2099-01-01'), ...DU_BA, GHI, cho(300)] },
  { nhom: 'f7', an: true, moTa: 'Rule 1 — nothing is POSTed for a future date', url: URL_C1, kiem: 'goi-fetch', khop: '^POST', min: 0, max: 0, truoc: [cho(400), nhap('#session-date', '2099-01-01'), ...DU_BA, GHI, cho(300)] },
  { nhom: 'f7', moTa: 'Rule 2 — SE002 without status ⇒ error naming SE002', url: URL_C1, kiem: 'text', selector: '.error-msg', khop: 'Please select attendance status for all students[\\s\\S]*SE002', truoc: [cho(400), nhap('#session-date', '2026-04-01'), radio(1, 'PRESENT'), radio(3, 'ABSENT'), GHI, cho(300)] },
  { nhom: 'f7', an: true, moTa: 'Rule 2 — nothing is POSTed while a status is missing', url: URL_C1, kiem: 'goi-fetch', khop: '^POST', min: 0, max: 0, truoc: [cho(400), nhap('#session-date', '2026-04-01'), radio(1, 'PRESENT'), GHI, cho(300)] },

  // ───────── f8 — Câu 2 · Luật 3 + lưu thành công (1.25đ) ─────────
  { nhom: 'f8', moTa: 'Rule 3 — 2026-03-10 already recorded ⇒ "Attendance for 2026-03-10 already exists in this class"', url: URL_C1, kiem: 'text', selector: '.error-msg', khop: 'Attendance for 2026-03-10 already exists in this class', truoc: [cho(400), nhap('#session-date', '2026-03-10'), ...DU_BA, GHI, cho(500)] },
  { nhom: 'f8', an: true, moTa: 'Rule 3 — no POST for an existing date', url: URL_C1, kiem: 'goi-fetch', khop: '^POST', min: 0, max: 0, truoc: [cho(400), nhap('#session-date', '2026-03-10'), ...DU_BA, GHI, cho(500)] },
  { nhom: 'f8', moTa: 'Success — one POST /attendances per enrolled student (3)', url: URL_C1, kiem: 'goi-fetch', khop: `^POST ${B}/attendances$`, min: 3, max: 3, truoc: THANH_CONG },
  { nhom: 'f8', moTa: 'Saved record: SE002 ABSENT on "2026-04-01T00:00:00.000Z" in SE1701', url: URL_C1, kiem: 'du-lieu-server', bang: 'attendances', chua: { studentId: S(2), classId: C1, date: '2026-04-01T00:00:00.000Z', status: 'ABSENT' }, truoc: THANH_CONG },
  { nhom: 'f8', an: true, moTa: 'The dropped student SE004 is not recorded', url: URL_C1, kiem: 'du-lieu-server', bang: 'attendances', khongChua: { studentId: S(4), date: '2026-04-01T00:00:00.000Z' }, truoc: THANH_CONG },
  { nhom: 'f8', moTa: 'Success message "Attendance recorded successfully for 3 student(s) on 2026-04-01."', url: URL_C1, kiem: 'text', selector: '.success-msg', khop: 'Attendance recorded successfully for 3 student\\(s\\) on 2026-04-01\\.', truoc: THANH_CONG },
];

const THANG_DIEM = [
  ['Q1 · Routing + fetch + subject grid (code/name/credits/badge)', 1.5],
  ['Q1 · Search box (startsWith, case-insensitive, client-side)', 1.0],
  ['Q1 · Status filter from data + combined with search', 1.0],
  ['Q1 · ?status= query param + View Attendance button', 1.5],
  ['Q2 · Routing + fetch + subject header + class dropdown', 1.0],
  ['Q2 · Student table (enrolled only) + PRESENT/ABSENT radios', 1.25],
  ['Q2 · Date default + Rule 1 (future) + Rule 2 (missing status)', 1.5],
  ['Q2 · Rule 3 (date exists) + POST per student + success', 1.25],
].map(([ten, diem], i) => ({ ma: `f${i + 1}`, ten: `${i + 1}. ${ten}`, diem }));
const THANG_VI = [
  'C1 · Routing + fetch + lưới môn (mã/tên/tín chỉ/badge)',
  'C1 · Ô tìm kiếm (startsWith, không phân biệt hoa thường, lọc phía client)',
  'C1 · Lọc trạng thái suy từ dữ liệu + kết hợp tìm kiếm',
  'C1 · Tham số ?status= + nút View Attendance',
  'C2 · Routing + fetch + tiêu đề môn + dropdown lớp',
  'C2 · Bảng sinh viên (chỉ enrolled) + radio PRESENT/ABSENT',
  'C2 · Ngày mặc định + Luật 1 (ngày tương lai) + Luật 2 (thiếu trạng thái)',
  'C2 · Luật 3 (ngày đã có) + POST từng sinh viên + thông báo thành công',
];

// ═════════════════════════════════════ ĐỀ ═════════════════════════════════════
const img = (ten, alt) => `<p><img src="${anh(ten)}" alt="${alt}" style="max-width:100%;height:auto;border:1px solid #d1d5db;border-radius:4px"></p>`;
const PRE_DB = `<pre>${esc(DB_JSON.replace(/\s+$/, ''))}</pre>`;
const POST_BODY = `<pre>{
  "studentId": "65dd00000000000000000001",
  "classId": "65bb00000000000000000001",
  "date": "2026-04-01T00:00:00.000Z",
  "status": "PRESENT"
}</pre>`;

const DE_EN = `<h1>PRACTICAL EXAMINATION</h1>
<p class="bi-phu">FER202 · SP26 PE — Attendance System (same paper as the Exam Room's PE18). Exam duration: 85 minutes.</p>
<p><b>Technical Requirement:</b> Run a mock API server with json-server to read/write data from/to database.json (<code>npx json-server --watch database.json --port 9999</code>). The React app must run at http://localhost:3000.</p>
<p class="bi-chu-y"><b>0 points</b> is given to work that: does not run JSON Server at http://localhost:9999 · does not run the React app at http://localhost:3000 · has incorrect component routing URLs.</p>
<h2>PART 1: INPUT DATA (database.json)</h2>
<p>Use the provided file <code>database.json</code>. Each top-level key is one REST resource; <code>enrollments</code> are embedded inside each class.</p>
${PRE_DB}
<h2>PART 2: REQUIREMENTS</h2>
<h3>Question 1 — Subject List Page (5 points)</h3>
<p><b>Objective:</b> Create a React page that shows the list of subjects with search and filtering capabilities.</p>
<p><b>Component routing at:</b> <code>http://localhost:3000/subjects</code> (0 points if the URL is incorrect).</p>
<p><b>Fetch data from:</b> <code>GET http://localhost:9999/subjects</code></p>
<p><b>Display Requirements:</b></p>
<ul>
  <li>Show subjects in a grid layout (4 items per row).</li>
  <li>Every subject card must contain: Code | Name | Credits | Status.</li>
  <li>Display Status as a colored badge: ACTIVE = green, INACTIVE = gray.</li>
</ul>
<p><b>Search Box:</b> filter the subjects by name; case-insensitive; match when the name <b>starts with</b> the keyword; filtering is done client-side — no additional API call.</p>
<p><b>Status Filter (Dropdown):</b> options All / ACTIVE / INACTIVE; filter subjects according to the selected status. Do not hard-code the values — extract the unique statuses from the data. The search and the status filter work together.</p>
<p><b>URL Query Parameter:</b> support <code>http://localhost:3000/subjects?status=ACTIVE</code> and <code>?status=INACTIVE</code>. When the page loads, read the status param and pre-select the filter dropdown.</p>
<p><b>Navigation Button:</b> every subject card must include a "View Attendance" button that redirects to <code>http://localhost:3000/subjects/:id/attendance</code>.</p>
<p><b>Figures:</b> (1) "Showing 4 of 4 subjects", 4 cards · (2) "Soft" → SWP391, SWR302, SWT301 · (3) ACTIVE → PRJ301, SWP391, SWT301 · (4) INACTIVE → SWR302 · (5) "Soft" + ACTIVE → "Showing 2 of 4 subjects matching "Soft" with status ACTIVE" → SWP391, SWT301 · (6) <code>?status=ACTIVE</code> pre-selects the filter.</p>
${img('fig1-list', 'Figure 1: Subject List (4 of 4)')}
${img('fig2-soft-active', 'Figure 5: "Soft" + ACTIVE')}
${img('fig3-param', 'Figure 6-like: ?status=INACTIVE pre-selected')}
<h3>Question 2 — Bulk Attendance Page (5 points)</h3>
<p><b>Objective:</b> Create a React page that lets a lecturer record attendance for every student in a class.</p>
<p><b>Component routing at:</b> <code>http://localhost:3000/subjects/:subjectId/attendance?classId=xxx</code> (0 points if the URL is incorrect).</p>
<p><b>Fetch data from:</b> <code>GET /subjects/:id</code> · <code>GET /classes?subjectId=xxx</code> · <code>GET /students</code> · <code>GET /attendances?classId=xxx</code> (all on <code>http://localhost:9999</code>).</p>
<p><b>Display Requirements:</b></p>
<ul>
  <li>Display the subject name and class name at the top of the page.</li>
  <li>Show a class selector dropdown listing all classes that belong to the subject.</li>
  <li>After a class is selected, show all <b>enrolled</b> students in a table: No | Student Code | Full Name | Status (radio).</li>
  <li>Status radio for each student: PRESENT / ABSENT.</li>
</ul>
<p><b>Form:</b> a date picker (<code>input type="date"</code>) that defaults to today's date; a submit button "Record Attendance".</p>
<p><b>Business Rules:</b></p>
<ul>
  <li>Do NOT allow submission when the date is in the future → show an error message ("Date cannot be in the future.").</li>
  <li>Do NOT allow submission when any student's status has not been selected → show an error message ("Please select attendance status for all students (missing: SE002).").</li>
  <li>If attendance for the chosen date already exists in this class → show the error: "Attendance for [date] already exists in this class".</li>
  <li>On success: POST all records to <code>http://localhost:9999/attendances</code> (one record per student), display a success message ("Attendance recorded successfully for 3 student(s) on 2026-04-01.") and reload the page.</li>
</ul>
<p><b>POST request body (one record per student):</b></p>
${POST_BODY}
${img('fig4-attendance', 'Figure 7: SE1701 — 3 enrolled students')}
${img('fig5-rule2', 'Figure 9: Rule 2 — SE002 missing')}
${img('fig6-success', 'Figure 11: success')}`;

const DE_VI = `<h1>BÀI THI THỰC HÀNH</h1>
<p class="bi-phu">FER202 · PE SP26 — Attendance System (cùng đề PE18 ở Phòng thi). Thời gian: 85 phút.</p>
<p><b>Yêu cầu kỹ thuật:</b> Chạy API giả bằng json-server đọc/ghi database.json (<code>npx json-server --watch database.json --port 9999</code>). App React chạy ở http://localhost:3000.</p>
<p class="bi-chu-y"><b>0 điểm</b> nếu: không chạy JSON Server ở http://localhost:9999 · không chạy app React ở http://localhost:3000 · sai URL route của component.</p>
<h2>PHẦN 1: DỮ LIỆU (database.json)</h2>
<p>Dùng tệp <code>database.json</code> được phát. Mỗi khoá cấp 1 là một resource REST; <code>enrollments</code> nằm TRONG mỗi lớp.</p>
${PRE_DB}
<h2>PHẦN 2: YÊU CẦU</h2>
<h3>Câu 1 — Trang danh sách môn (5 điểm)</h3>
<p><b>Mục tiêu:</b> trang React hiện danh sách môn học, có tìm kiếm và lọc.</p>
<p><b>Route:</b> <code>http://localhost:3000/subjects</code> (sai URL ⇒ 0 điểm). <b>Lấy dữ liệu:</b> <code>GET http://localhost:9999/subjects</code>.</p>
<ul>
  <li>Lưới 4 thẻ/hàng; mỗi thẻ có Code | Name | Credits | Status; Status là badge màu: ACTIVE xanh lá, INACTIVE xám.</li>
  <li><b>Ô tìm kiếm:</b> lọc theo tên, không phân biệt hoa thường, khớp khi tên <b>bắt đầu bằng</b> từ khoá; lọc phía client — không gọi API thêm.</li>
  <li><b>Dropdown trạng thái:</b> All / ACTIVE / INACTIVE — KHÔNG gõ cứng, lấy các trạng thái duy nhất từ dữ liệu; kết hợp với ô tìm kiếm.</li>
  <li><b>Tham số URL:</b> hỗ trợ <code>/subjects?status=ACTIVE</code> và <code>?status=INACTIVE</code>; khi tải trang đọc tham số và chọn sẵn dropdown.</li>
  <li><b>Nút điều hướng:</b> mỗi thẻ có nút "View Attendance" chuyển tới <code>/subjects/:id/attendance</code>.</li>
</ul>
<p><b>Hình mẫu:</b> "Soft" → SWP391, SWR302, SWT301 · ACTIVE → PRJ301, SWP391, SWT301 · INACTIVE → SWR302 · "Soft" + ACTIVE → SWP391, SWT301 ("Showing 2 of 4 subjects…").</p>
${img('fig1-list', 'Hình 1: danh sách môn')}
${img('fig2-soft-active', 'Hình 5: "Soft" + ACTIVE')}
${img('fig3-param', '?status=INACTIVE chọn sẵn')}
<h3>Câu 2 — Trang điểm danh hàng loạt (5 điểm)</h3>
<p><b>Mục tiêu:</b> trang cho giảng viên điểm danh mọi sinh viên của một lớp.</p>
<p><b>Route:</b> <code>http://localhost:3000/subjects/:subjectId/attendance?classId=xxx</code> (sai URL ⇒ 0 điểm). <b>Lấy dữ liệu:</b> <code>GET /subjects/:id</code> · <code>GET /classes?subjectId=xxx</code> · <code>GET /students</code> · <code>GET /attendances?classId=xxx</code>.</p>
<ul>
  <li>Hiện tên môn và tên lớp ở đầu trang; dropdown chọn lớp gồm mọi lớp của môn.</li>
  <li>Chọn lớp xong hiện bảng sinh viên <b>enrolled</b>: No | Student Code | Full Name | Status (radio PRESENT / ABSENT).</li>
  <li>Ô ngày (<code>input type="date"</code>) mặc định là hôm nay; nút "Record Attendance".</li>
</ul>
<p><b>Luật nghiệp vụ:</b></p>
<ul>
  <li>Ngày ở tương lai ⇒ không cho gửi, báo "Date cannot be in the future.".</li>
  <li>Còn sinh viên chưa chọn trạng thái ⇒ không cho gửi, báo "Please select attendance status for all students (missing: SE002).".</li>
  <li>Lớp đã có điểm danh của ngày đó ⇒ báo "Attendance for [date] already exists in this class".</li>
  <li>Thành công: POST từng bản ghi (mỗi sinh viên một bản) tới <code>http://localhost:9999/attendances</code>, hiện thông báo thành công ("Attendance recorded successfully for 3 student(s) on 2026-04-01.") và tải lại trang.</li>
</ul>
${POST_BODY}
${img('fig4-attendance', 'Hình 7: SE1701 — 3 sinh viên enrolled')}
${img('fig5-rule2', 'Hình 9: Luật 2 — thiếu SE002')}
${img('fig6-success', 'Hình 11: thành công')}`;

// ─── Phần Code Lab (KHÔNG thuộc tờ đề) ───
const SEL = [
  ['#search', 'Q1 — the search text input', 'Câu 1 — ô tìm kiếm'],
  ['#status-filter', 'Q1 — the status <code>&lt;select&gt;</code> (first option "All Status" with value "", option <code>value</code> = status)', 'Câu 1 — ô chọn trạng thái (lựa chọn đầu "All Status" value "", <code>value</code> = trạng thái)'],
  ['.subject-card · .subject-code · .subject-status', 'one card per subject; the code element and the status badge inside it', 'mỗi môn một thẻ; phần tử mã môn và badge trạng thái trong thẻ'],
  ['.view-attendance', 'the "View Attendance" button inside each card', 'nút "View Attendance" trong từng thẻ'],
  ['.showing-text', 'the "Showing X of Y subjects…" line', 'dòng "Showing X of Y subjects…"'],
  ['.subject-title', 'Q2 — the element showing the subject code and name', 'Câu 2 — phần tử hiện mã + tên môn'],
  ['#class-select · #session-date · #record-attendance', 'the class <code>&lt;select&gt;</code> (option <code>value</code> = class id), the date input, the submit button', 'ô chọn lớp (<code>value</code> = id lớp), ô ngày, nút gửi'],
  ['.student-row · .student-code', 'one table row per enrolled student; the student-code cell', 'mỗi sinh viên enrolled một dòng; ô mã sinh viên'],
  ['#att-&lt;studentId&gt;-PRESENT · #att-&lt;studentId&gt;-ABSENT', 'the two radios of a student (id = <code>att-</code> + student id + <code>-PRESENT</code>/<code>-ABSENT</code>)', 'hai radio của một sinh viên (id = <code>att-</code> + id sinh viên + <code>-PRESENT</code>/<code>-ABSENT</code>)'],
  ['.error-msg · .success-msg', 'the red error banner and the green success banner', 'banner lỗi đỏ và banner thành công xanh'],
];
const codeLab = (lang) => {
  const vi = lang === 'vi';
  const r = (en, v) => (vi ? v : en);
  return `<hr>
<h2>${r('Code Lab — auto-grader notes (not part of the paper)', 'Code Lab — ghi chú cho máy chấm (KHÔNG thuộc tờ đề)')}</h2>
<p class="bi-chu-y">${r('Everything above this line is the exam paper. Below is only what the CuongThai auto-grader needs to find your elements — give these ids/classes to your elements and every check can see them.', 'Mọi thứ phía trên là tờ đề. Phía dưới chỉ là những gì máy chấm CuongThai cần để tìm phần tử — gắn đúng các id/class này thì mọi kiểm đều thấy.')}</p>
<h3>${r('Element ids / classes used by the auto-grader', 'id / class máy chấm dùng')}</h3>
<table><thead><tr><th>Selector</th><th>${r('Purpose', 'Vai trò')}</th></tr></thead><tbody>${SEL.map(([s, en, v]) => `<tr><td><code>${s}</code></td><td>${r(en, v)}</td></tr>`).join('')}</tbody></table>
<h3>${r('How the grader reads the data', 'Máy chấm hiểu dữ liệu thế nào')}</h3>
<ul>
  <li>${r('SE1701 (<code>65bb…001</code>) has 4 enrollments but SE004 is <code>"dropped"</code> — the table must show SE001, SE002, SE003 only, and only those 3 are POSTed.', 'SE1701 (<code>65bb…001</code>) có 4 enrollment nhưng SE004 đã <code>"dropped"</code> — bảng chỉ hiện SE001, SE002, SE003 và chỉ 3 người này được POST.')}</li>
  <li>${r('SE1701 already has attendance on <code>2026-03-10T00:00:00.000Z</code> — compare the date part (<code>slice(0, 10)</code>) with the picked <code>YYYY-MM-DD</code>.', 'SE1701 đã có điểm danh ngày <code>2026-03-10T00:00:00.000Z</code> — so phần ngày (<code>slice(0, 10)</code>) với giá trị <code>YYYY-MM-DD</code> đã chọn.')}</li>
  <li>${r('Saved <code>date</code> = the picked date + <code>"T00:00:00.000Z"</code>, e.g. <code>"2026-04-01T00:00:00.000Z"</code>.', '<code>date</code> lưu = ngày đã chọn + <code>"T00:00:00.000Z"</code>, vd <code>"2026-04-01T00:00:00.000Z"</code>.')}</li>
</ul>
<h3>${r('Auto-grader rubric (10 points, Run = sample checks · Submit = full rubric incl. hidden)', 'Thang điểm máy chấm (10 điểm, Chạy thử = kiểm mẫu · Nộp = chấm đủ, có kiểm ẩn)')}</h3>
<table><thead><tr><th>#</th><th>${r('Rubric line', 'Dòng điểm')}</th><th>${r('Marks', 'Điểm')}</th></tr></thead><tbody>${THANG_DIEM.map((t, i) => `<tr><td>${i + 1}</td><td>${esc(vi ? THANG_VI[i] : t.ten.replace(/^\d+\. /, ''))}</td><td>${t.diem}</td></tr>`).join('')}</tbody></table>`;
};

const YEU_CAU = [
  { en: 'Start the mock API exactly as in the exam: <code>npx json-server --watch database.json --port 9999</code>; the React app at <code>http://localhost:3000</code>.', vi: 'Chạy API giả như lúc thi: <code>npx json-server --watch database.json --port 9999</code>; app React ở <code>http://localhost:3000</code>.' },
  { en: 'The starter is a bare CRA entry (<code>src/index.js</code>, <code>src/App.js</code>): add Bootstrap CSS, the router and both pages yourself.', vi: 'Starter là CRA trống (<code>src/index.js</code>, <code>src/App.js</code>): tự thêm CSS Bootstrap, router và hai trang.' },
  { en: 'Press <b>Run</b> for the sample checks, <b>Submit</b> for the full rubric (hidden checks included). Time yourself: 85 minutes.', vi: 'Bấm <b>Chạy thử</b> để chạy kiểm mẫu, <b>Nộp</b> để chấm đủ thang điểm (có kiểm ẩn). Tự bấm giờ: 85 phút.' },
];

export default doiDau({
  slug: 'fer202-13-pe-7-attendance-system',
  ten: 'PE SP26 — Attendance System (Subject List + Bulk Attendance)',
  khoa: KHOA,
  baiHoc: 'fer202-pe18-sp26-chua-tron-de',
  de: [
    {
      dangBai: 'pe',
      tieuDe: { en: 'PE SP26 — Attendance System: Subject List & Bulk Attendance', vi: 'Đề PE SP26 — Attendance System: danh sách môn & điểm danh hàng loạt' },
      doKho: 'HARD',
      phut: 85,
      diem: 100,
      ngonNgu: 'javascript',
      khaiNiem: ['React Router v6', 'Navigate redirect', 'route param (:subjectId)', 'useSearchParams', 'json-server query filter', 'Set (unique values)', 'combined search + filter', 'controlled radio group', 'input type="date"', 'local date vs UTC', 'business rules', 'POST per record'],
      tienQuyet: ['useState / useEffect', 'axios', 'React-Bootstrap / Bootstrap classes'],
      the: ['fer202', 'pe', 'router', 'json-server', 'form', 'validation'],
      moTa: { en: DE_EN + '\n' + codeLab('en'), vi: DE_VI + '\n' + codeLab('vi') },
      yeuCau: YEU_CAU,
      dauVao: { en: 'A CRA project (React 18, react-router-dom 6, react-bootstrap 2, axios, json-server 0.17) + database.json (4 subjects, 6 students, 4 classes with embedded enrollments, 86 attendances).', vi: 'Dự án CRA (React 18, react-router-dom 6, react-bootstrap 2, axios, json-server 0.17) + database.json (4 môn, 6 sinh viên, 4 lớp có enrollments lồng, 86 lượt điểm danh).' },
      dauRa: { en: 'A working app: /subjects (Subject List) and /subjects/:subjectId/attendance?classId= (Bulk Attendance) passing every rubric line.', vi: 'Ứng dụng chạy: /subjects (Subject List) và /subjects/:subjectId/attendance?classId= (Bulk Attendance) đạt mọi dòng điểm.' },
      rangBuoc: [
        { en: 'react-router-dom v6 (<code>Routes</code>, <code>Navigate</code>, <code>useParams</code>, <code>useSearchParams</code>, <code>useNavigate</code>); UI with Bootstrap / react-bootstrap.', vi: 'react-router-dom v6 (<code>Routes</code>, <code>Navigate</code>, <code>useParams</code>, <code>useSearchParams</code>, <code>useNavigate</code>); giao diện Bootstrap / react-bootstrap.' },
        { en: 'Data only through json-server at <code>http://localhost:9999</code> (axios); no extra libraries.', vi: 'Dữ liệu chỉ qua json-server ở <code>http://localhost:9999</code> (axios); không thêm thư viện.' },
        { en: 'Statuses of the dropdown come from the data (no hard-coded list); only "enrolled" students are listed and recorded.', vi: 'Trạng thái trong dropdown lấy từ dữ liệu (không gõ cứng); chỉ sinh viên "enrolled" được liệt kê và ghi.' },
      ],
      viDu: [
        { input: '/subjects → search "Soft" + status ACTIVE', output: 'SWP391 · SWT301 — "Showing 2 of 4 subjects matching "Soft" with status ACTIVE"', explanation: { en: 'startsWith on the name (case-insensitive) AND the selected status.', vi: 'startsWith theo tên (không phân biệt hoa thường) VÀ trạng thái đã chọn.' } },
        { input: '/subjects?status=INACTIVE', output: 'dropdown = INACTIVE · SWR302 only', explanation: { en: 'The query param is read on load and pre-selects the dropdown.', vi: 'Đọc tham số khi tải trang và chọn sẵn dropdown.' } },
        { input: `/subjects/${PRJ}/attendance?classId=${C1}`, output: 'PRJ301 — Project Management · SE001, SE002, SE003', explanation: { en: 'SE004 is "dropped" in SE1701, so it is not listed.', vi: 'SE004 đã "dropped" ở SE1701 nên không hiện.' } },
        { input: 'date 2026-04-01, SE001 PRESENT · SE002 ABSENT · SE003 PRESENT → Record Attendance', output: '3 × POST /attendances · "Attendance recorded successfully for 3 student(s) on 2026-04-01."', explanation: { en: 'date saved as "2026-04-01T00:00:00.000Z"; 2026-03-10 would be rejected (already exists).', vi: 'date lưu "2026-04-01T00:00:00.000Z"; ngày 2026-03-10 sẽ bị từ chối (đã có).' } },
      ],
      goiY: [
        'Câu 1 làm trước: index.js import "bootstrap/dist/css/bootstrap.min.css" và bọc <BrowserRouter>; App.js có Route "/" ⇒ <Navigate to="/subjects" replace />, "/subjects" và "/subjects/:subjectId/attendance".',
        'Danh sách trạng thái: [...new Set(subjects.map(s => s.status))]. Giữ trạng thái đang chọn TRONG URL: const status = searchParams.get("status") || ""; đổi dropdown ⇒ setSearchParams({ status }) — vậy ?status=ACTIVE tự chọn sẵn khi tải trang.',
        'Lọc là giá trị suy ra, không phải state: subjects.filter(s => s.name.toLowerCase().startsWith(kw.trim().toLowerCase()) && (status === "" || s.status === status)).',
        'Câu 2: useParams lấy subjectId, useSearchParams lấy classId. Lớp hiện tại = classes.find(c => c.id === classId); sinh viên = enrollments.filter(e => e.status === "enrolled").map(e => students.find(s => s.id === e.studentId)).',
        'Ngày hôm nay theo giờ địa phương (getFullYear/getMonth/getDate) — toISOString() là UTC nên ở Việt Nam trước 7 giờ sáng ra NGÀY HÔM QUA. Chuỗi "YYYY-MM-DD" so sánh được bằng > như chữ.',
        'Thứ tự luật khi submit: ngày tương lai ⇒ thiếu trạng thái (liệt kê mã SV thiếu) ⇒ GET /attendances?classId= và so a.date.slice(0, 10) === date ⇒ for…of POST từng sinh viên { studentId, classId, date: date + "T00:00:00.000Z", status }.',
      ],
      loiHayGap: [
        'Gõ cứng <code>&lt;option&gt;ACTIVE&lt;/option&gt;&lt;option&gt;INACTIVE&lt;/option&gt;</code> — đề yêu cầu lấy giá trị duy nhất từ dữ liệu.',
        'Dùng <code>includes</code> thay vì <code>startsWith</code> (gõ "Testing" vẫn ra SWT301 là sai), hoặc gọi lại API mỗi lần gõ.',
        'Không đọc <code>?status=</code> khi tải trang (giữ trạng thái trong useState riêng, không đồng bộ URL).',
        'Hiện cả sinh viên "dropped" (SE004 ở SE1701) và POST luôn cho họ.',
        '<code>new Date().toISOString().slice(0, 10)</code> làm ngày mặc định ⇒ lệch một ngày trước 7 giờ sáng (UTC+7).',
        'So ngày trùng bằng <code>a.date === date</code> — dữ liệu có đuôi <code>T00:00:00.000Z</code> nên không bao giờ bằng; phải so <code>slice(0, 10)</code>.',
        'Gửi MỘT POST chứa mảng thay vì mỗi sinh viên một POST; hoặc quên <code>preventDefault()</code> làm trang tải lại.',
      ],
      thuatNgu: [
        { en: 'attendance', vi: 'điểm danh' },
        { en: 'enrollment (status enrolled/dropped)', vi: 'lượt ghi danh (đang học / đã rút)' },
        { en: 'bulk attendance', vi: 'điểm danh hàng loạt (cả lớp một lần)' },
        { en: 'status badge', vi: 'nhãn nhỏ có màu thể hiện trạng thái' },
        { en: 'business rule', vi: 'luật nghiệp vụ — điều kiện chặn trước khi lưu' },
        ...tn('queryParam', 'routeParam', 'redirect', 'derived', 'caseInsensitive', 'validate', 'rubric'),
      ],
      giaiThich: {
        en: '<p>Q1 fetches <code>/subjects</code> once and derives everything else: the dropdown options are the unique statuses (<code>Set</code>), the visible cards are a filter of name-startsWith AND status. The selected status lives in the URL (<code>useSearchParams</code>), so <code>/subjects?status=ACTIVE</code> pre-selects itself and changing the dropdown updates the URL.</p><p>Q2 reads <code>subjectId</code> from the route and <code>classId</code> from the query, fetches the subject, its classes and all students, then joins the class\'s <b>enrolled</b> enrollments to students. Submitting checks the three rules in order (future date → missing status → date already recorded, via <code>GET /attendances?classId=</code> and comparing the date part) and finally POSTs one record per student, shows the count and resets the radios.</p>',
        vi: '<p>Câu 1 lấy <code>/subjects</code> một lần rồi suy mọi thứ: lựa chọn dropdown là các trạng thái duy nhất (<code>Set</code>), thẻ hiện ra = lọc tên-bắt-đầu-bằng VÀ trạng thái. Trạng thái đang chọn nằm trong URL (<code>useSearchParams</code>) nên <code>/subjects?status=ACTIVE</code> tự chọn sẵn, đổi dropdown thì URL đổi theo.</p><p>Câu 2 đọc <code>subjectId</code> từ route và <code>classId</code> từ query, lấy môn, các lớp của môn và mọi sinh viên, rồi nối các enrollment <b>enrolled</b> của lớp với sinh viên. Khi gửi kiểm ba luật theo thứ tự (ngày tương lai → thiếu trạng thái → ngày đã điểm danh, qua <code>GET /attendances?classId=</code> và so phần ngày) rồi POST mỗi sinh viên một bản ghi, báo số lượng và xoá các radio.</p>',
      },
      tests: { loai: 'react', phienBan: 1, tepChinh: 'src/index.js', thuVien: ['react-router-dom', 'react-bootstrap', 'bootstrap'], url: LIST, jsonServer: { base: B, db: DB }, thangDiem: THANG_DIEM, kiem: KIEM, loiGiaiSauKhiDat: true },
      khoiDau: KHOI_DAU,
      loiGiai: LOI_GIAI,
      demo: { tepChinh: 'src/index.js', url: LIST },
      thamKhao: 'https://reactrouter.com/en/6.26.2/hooks/use-search-params',
    },
  ],
});
