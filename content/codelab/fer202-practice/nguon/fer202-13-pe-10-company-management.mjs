/**
 * FER202 · ĐỀ PE SP26 Block 5 — Company Management (Department → Employee Accordion → Dependents) — Code Lab.
 * ════════════════════════════════════════════════════════════════════════════════════════════════
 * Cùng đề với Phòng thi FER202-PE1 (content/exams/FER202-PE1.mjs, Given zip PE1-Given.zip).
 * database.json dựng lại cho Given (đề gốc không kèm dữ liệu) — khớp đúng số mẫu trong ảnh đề:
 * Binh Tran 4.261.363 + 2.840.909 = 7.102.272 VND.
 *
 * Tài nguyên ở ./_pe10-company/:
 *   database.json   — departments 3 · employees 8 (dependents lồng trong employee) · projects 6 · works 9
 *   loiGiai/src/**  — lời giải đã kiểm (Vite build + Playwright 23/23) + id/class máy chấm
 *   khoiDau/src/**  — starter: index.js + App.js trống
 *   anh/*.webp      — 5 ảnh chụp từ app lời giải
 *
 * Bẫy: tên trưởng phòng phải tra từ employees qua managerId; "Manager" khi supervisorId === null;
 * lương = floor(empSalary / 176 × workHours) từng dòng rồi cộng (không làm tròn); định dạng chấm kiểu Việt;
 * dependents nằm TRONG employee ⇒ thêm = PUT cả employee; ngày sinh phải TRƯỚC hôm nay (giờ địa phương).
 */
import fs from 'node:fs';
import { doiDau, KHOA, tn } from './_chung.mjs';

const TN_MUC = new URL('./_pe10-company/', import.meta.url);
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
  'src/components/DepartmentList.js': doc('loiGiai/src/components/DepartmentList.js'),
  'src/components/EmployeeList.js': doc('loiGiai/src/components/EmployeeList.js'),
  'src/components/Dependents.js': doc('loiGiai/src/components/Dependents.js'),
};

const B = 'http://localhost:9999';
const cho = (ms = 300) => ({ hanhDong: 'cho', ms });
const nhap = (selector, giaTri) => ({ hanhDong: 'nhap', selector, giaTri });
const doi = (selector, giaTri) => ({ hanhDong: 'doi', selector, giaTri });
const click = (selector) => ({ hanhDong: 'click', selector });
const XEM = (dep) => [cho(400), click(`#dep-row-${dep} .view-btn`), cho(400)];
const XEM_NPT = (dep, emp) => [...XEM(dep), click(`#emp-item-${emp} .view-dependents`), cho(300)];
const BINH = XEM_NPT(2, 2);
const THEM = [...BINH, nhap('#dep-fullname', 'Pham Minh Chau'), nhap('#dep-birthdate', '2015-05-05'), doi('#dep-relationship', 'Daughter'), click('#dep-add'), cho(600)];
const TUONG_LAI = [...BINH, nhap('#dep-fullname', 'Pham Minh Chau'), nhap('#dep-birthdate', '2099-01-01'), doi('#dep-relationship', 'Daughter'), click('#dep-add'), cho(300)];
const RONG = [...BINH, click('#dep-add'), cho(300)];

const KIEM = [
  // ───────── f1 — Câu 1 · Department List (2.0đ) ─────────
  { nhom: 'f1', moTa: '"/" shows the 3 departments', url: '/', kiem: 'so-luong', selector: '.department-row', giaTri: 3 },
  { nhom: 'f1', an: true, moTa: 'Departments fetched: GET /departments', url: '/', kiem: 'goi-fetch', khop: `^GET ${B}/departments$` },
  { nhom: 'f1', moTa: 'Rows: Human Resources · IT · Finance', url: '/', kiem: 'text', selector: '#department-table', khop: 'Human Resources[\\s\\S]*IT[\\s\\S]*Finance' },
  { nhom: 'f1', moTa: 'Manager full names looked up via managerId (An Nguyen, Binh Tran, Khanh Do)', url: '/', kiem: 'danh-sach-text', selector: '.manager-name', mongDoi: ['An Nguyen', 'Binh Tran', 'Khanh Do'] },
  { nhom: 'f1', moTa: 'Each department has a View button', url: '/', kiem: 'so-luong', selector: '.department-row .view-btn', giaTri: 3 },

  // ───────── f2 — Câu 2 · Accordion nhân viên (1.5đ) ─────────
  { nhom: 'f2', moTa: 'View IT ⇒ 4 employees in an Accordion', url: '/', kiem: 'so-luong', selector: '#employee-accordion .employee-item', giaTri: 4, truoc: XEM(2) },
  { nhom: 'f2', moTa: 'Headers "#1 - Binh Tran - Manager", "#2 - Le Chi", …', url: '/', kiem: 'text', selector: '#employee-accordion', khop: '#1 - Binh Tran[\\s\\S]*Manager[\\s\\S]*#2 - Le Chi[\\s\\S]*#3 - Pham Dung[\\s\\S]*#4 - Vo Hanh', truoc: XEM(2) },
  { nhom: 'f2', moTa: 'Binh Tran: EmployeeId 2 · Male · 1983-03-12', url: '/', kiem: 'text', selector: '#emp-item-2', khop: '2[\\s\\S]*Male[\\s\\S]*1983-03-12', truoc: XEM(2) },
  { nhom: 'f2', an: true, moTa: 'Only supervisorId === null is labelled Manager (Le Chi is not)', url: '/', kiem: 'text', selector: '#emp-item-3 .employee-header', khop: '^(?![\\s\\S]*Manager)', truoc: XEM(2) },
  { nhom: 'f2', an: true, moTa: 'View Human Resources ⇒ 2 employees (An Nguyen, Hoang Lan)', url: '/', kiem: 'text', selector: '#employee-accordion', khop: 'An Nguyen[\\s\\S]*Hoang Lan', truoc: XEM(1) },

  // ───────── f3 — Câu 2 · Dự án + lương (2.5đ) ─────────
  { nhom: 'f3', moTa: 'Binh Tran works on 2 projects', url: '/', kiem: 'so-luong', selector: '#emp-item-2 .work-row', giaTri: 2, truoc: XEM(2) },
  { nhom: 'f3', moTa: 'Project names mapped from projectId (Website Development, Accounting Software)', url: '/', kiem: 'text', selector: '#emp-item-2', khop: 'Website Development[\\s\\S]*30[\\s\\S]*Accounting Software[\\s\\S]*20', truoc: XEM(2) },
  { nhom: 'f3', moTa: 'Salary per project = floor(empSalary / 176 × hours), VN dots: 4.261.363 · 2.840.909', url: '/', kiem: 'danh-sach-text', selector: '#emp-item-2 .work-salary', mongDoi: ['4.261.363', '2.840.909'], truoc: XEM(2) },
  { nhom: 'f3', moTa: 'Total "Projects Salary: 7.102.272 VND"', url: '/', kiem: 'text', selector: '#emp-item-2 .projects-salary', khop: 'Projects Salary:\\s*7\\.102\\.272 VND', truoc: XEM(2) },
  { nhom: 'f3', an: true, moTa: 'Le Chi total 6.392.044 VND (4.261.363 + 2.130.681)', url: '/', kiem: 'text', selector: '#emp-item-3 .projects-salary', khop: '6\\.392\\.044 VND', truoc: XEM(2) },
  { nhom: 'f3', an: true, moTa: 'Pham Dung total 6.136.363 VND (Data Warehouse, 60 h)', url: '/', kiem: 'text', selector: '#emp-item-4', khop: 'Data Warehouse[\\s\\S]*60[\\s\\S]*6\\.136\\.363', truoc: XEM(2) },

  // ───────── f4 — Câu 3 · Danh sách người phụ thuộc (1.5đ) ─────────
  { nhom: 'f4', moTa: 'View Dependents of Binh Tran ⇒ 4 rows', url: '/', kiem: 'so-luong', selector: '#dependents .dependent-row', giaTri: 4, truoc: BINH },
  { nhom: 'f4', moTa: 'Row 1: Hoa Tran · 1985-07-20 · Wife', url: '/', kiem: 'text', selector: '#dependents', khop: 'Binh Tran[\\s\\S]*Hoa Tran[\\s\\S]*1985-07-20[\\s\\S]*Wife', truoc: BINH },
  { nhom: 'f4', moTa: 'Le Chi has none ⇒ "No dependents"', url: '/', kiem: 'text', selector: '#dependents .no-dependents', khop: '^No dependents$', truoc: XEM_NPT(2, 3) },
  { nhom: 'f4', an: true, moTa: 'Switching employee shows the new list (Pham Dung ⇒ Thu Pham only)', url: '/', kiem: 'so-luong', selector: '#dependents .dependent-row', giaTri: 1, truoc: [...BINH, click('#emp-item-4 .view-dependents'), cho(300)] },
  { nhom: 'f4', an: true, moTa: 'Relationship select: placeholder + 7 options', url: '/', kiem: 'so-luong', selector: '#dep-relationship option', giaTri: 8, truoc: BINH },

  // ───────── f5 — Câu 3 · Kiểm hợp lệ (1.5đ) ─────────
  { nhom: 'f5', moTa: 'Empty form ⇒ "Fullname is required", "Birthdate is required", "Please choose a relationship"', url: '/', kiem: 'text', selector: 'body', khop: 'Fullname is required[\\s\\S]*Birthdate is required[\\s\\S]*Please choose a relationship', truoc: RONG },
  { nhom: 'f5', moTa: 'Future birthdate ⇒ "Birthdate must be before today"', url: '/', kiem: 'text', selector: 'body', khop: 'Birthdate must be before today', truoc: TUONG_LAI },
  { nhom: 'f5', an: true, moTa: 'Invalid form ⇒ no PUT', url: '/', kiem: 'goi-fetch', khop: '^PUT', min: 0, max: 0, truoc: TUONG_LAI },
  { nhom: 'f5', an: true, moTa: 'Empty form ⇒ no PUT', url: '/', kiem: 'goi-fetch', khop: '^PUT', min: 0, max: 0, truoc: RONG },

  // ───────── f6 — Câu 3 · Thêm + PUT + UI (1.0đ) ─────────
  { nhom: 'f6', moTa: 'Valid dependent ⇒ PUT /employees/2 (whole employee)', url: '/', kiem: 'goi-fetch', khop: `^PUT ${B}/employees/2$`, min: 1, max: 1, than: { fullname: 'Binh Tran' }, truoc: THEM },
  { nhom: 'f6', moTa: 'The new dependent shows immediately (5 rows, Pham Minh Chau · Daughter)', url: '/', kiem: 'text', selector: '#dependents', khop: 'Pham Minh Chau[\\s\\S]*2015-05-05[\\s\\S]*Daughter', truoc: THEM },
  { nhom: 'f6', an: true, moTa: '5 dependent rows after adding', url: '/', kiem: 'so-luong', selector: '#dependents .dependent-row', giaTri: 5, truoc: THEM },
];

const THANG_DIEM = [
  ['Q1 · Department list + manager name + View', 2.0],
  ['Q2 · Employee Accordion (fields, Manager label)', 1.5],
  ['Q2 · Projects, salary per project, Projects Salary total', 2.5],
  ['Q3 · Dependents list / No dependents', 1.5],
  ['Q3 · Validation messages', 1.5],
  ['Q3 · Add dependent: PUT + UI updates immediately', 1.0],
].map(([ten, diem], i) => ({ ma: `f${i + 1}`, ten: `${i + 1}. ${ten}`, diem }));
const THANG_VI = [
  'C1 · Danh sách phòng ban + tên trưởng phòng + nút View',
  'C2 · Accordion nhân viên (thông tin, nhãn Manager)',
  'C2 · Dự án, lương từng dự án, tổng Projects Salary',
  'C3 · Danh sách người phụ thuộc / No dependents',
  'C3 · Thông báo kiểm hợp lệ',
  'C3 · Thêm người phụ thuộc: PUT + giao diện cập nhật ngay',
];

const img = (ten, alt) => `<p><img src="${anh(ten)}" alt="${alt}" style="max-width:100%;height:auto;border:1px solid #d1d5db;border-radius:4px"></p>`;
const PRE_DB = `<pre>${esc(DB_JSON.replace(/\s+$/, ''))}</pre>`;

const DE_EN = `<h1>PRACTICAL EXAMINATION</h1>
<p class="bi-phu">FER202 · SPRING 2026 Block 5 PE — Company Management (same paper as the Exam Room's PE1). Duration: 85 minutes.</p>
<p><b>Technical Requirement:</b> json-server serves <code>database.json</code> at <code>http://localhost:9999</code> (<code>npx json-server --watch database.json --port 9999</code>); the React app runs at <code>http://localhost:3000</code>. 0 points if JSON Server / the app does not run or the URL is incorrect.</p>
${PRE_DB}
<h3>Question 1 (2 points) — Department List</h3>
<ul><li>Component routing at <code>http://localhost:3000</code>. Fetch data from the API.</li><li>Display the departments in a table: DepName | Manager | Employees.</li><li>Display the manager's full name (from employees via <code>managerId</code>).</li><li>Provide a <b>View</b> button to show the employees of that department (filter employees by <code>depId</code>) — Question 2.</li></ul>
${img('q1-departments', 'COMPANY MANAGEMENT — Department List')}
<h3>Question 2 (4 points) — Employee &amp; Project Information</h3>
<ul><li>Render the employee list of the chosen department with an <b>Accordion</b> (header <code>#&lt;no.&gt; - &lt;fullname&gt;</code>; add <b>- Manager</b> when <code>supervisorId === null</code>).</li><li>For each employee show EmployeeId, Gender, BirthDate and a <b>View Dependents</b> button.</li><li>Projects worked on: WorkId | Project Name | Work Hours | Salary, where hourly = empSalary / 176 and salary = hourly × workHours (decimals truncated, VN dot separators).</li><li>Show the total: <b>Projects Salary: XXX VND</b> (IT · Binh Tran: 4.261.363 + 2.840.909 = 7.102.272 VND).</li></ul>
${img('q2-employees', 'IT — Binh Tran (Manager) with his projects')}
<h3>Question 3 (4 points) — Dependents Management</h3>
<ul><li>View Dependents ⇒ No. | Name | Birthdate | Relationship; none ⇒ <b>No dependents</b>.</li><li>Add form: Fullname, Birthdate, Relationship (first option <code>--- Type of relationship ---</code>, then Wife, Son, Daughter, Father, Mother, Father in law, Mother in law).</li><li>Validation (show a list of errors): "Fullname is required", "Birthdate is required", "Birthdate must be before today", "Please choose a relationship".</li><li>On success add the dependent to the employee, send <code>PUT http://localhost:9999/employees/:id</code> and update the UI immediately.</li></ul>
${img('q3-dependents', 'Dependents of Binh Tran')}
${img('q3-errors', 'Validation errors')}
${img('q3-added', 'After adding a dependent')}`;

const DE_VI = `<h1>BÀI THI THỰC HÀNH</h1>
<p class="bi-phu">FER202 · PE SPRING 2026 Block 5 — Company Management (cùng đề PE1 ở Phòng thi). Thời gian: 85 phút.</p>
<p><b>Yêu cầu kỹ thuật:</b> json-server phục vụ <code>database.json</code> ở <code>http://localhost:9999</code>; app React chạy ở <code>http://localhost:3000</code>. Không chạy được hoặc sai URL ⇒ 0 điểm.</p>
${PRE_DB}
<h3>Câu 1 (2 điểm) — Danh sách phòng ban</h3>
<ul><li>Route <code>http://localhost:3000</code>; lấy dữ liệu từ API; bảng DepName | Manager | Employees.</li><li>Tên trưởng phòng tra từ employees theo <code>managerId</code>.</li><li>Nút <b>View</b> hiện nhân viên của phòng (lọc theo <code>depId</code>) — Câu 2.</li></ul>
${img('q1-departments', 'Department List')}
<h3>Câu 2 (4 điểm) — Nhân viên &amp; dự án</h3>
<ul><li>Danh sách nhân viên của phòng bằng <b>Accordion</b> (tiêu đề <code>#&lt;stt&gt; - &lt;fullname&gt;</code>, thêm <b>- Manager</b> khi <code>supervisorId === null</code>).</li><li>Mỗi người: EmployeeId, Gender, BirthDate, nút <b>View Dependents</b>.</li><li>Bảng dự án: WorkId | Project Name | Work Hours | Salary; lương giờ = empSalary / 176, lương = lương giờ × workHours (bỏ phần lẻ, dấu chấm kiểu Việt).</li><li>Tổng: <b>Projects Salary: XXX VND</b> (Binh Tran: 4.261.363 + 2.840.909 = 7.102.272 VND).</li></ul>
${img('q2-employees', 'IT — Binh Tran')}
<h3>Câu 3 (4 điểm) — Người phụ thuộc</h3>
<ul><li>Bấm View Dependents ⇒ bảng No. | Name | Birthdate | Relationship; không có ⇒ <b>No dependents</b>.</li><li>Form thêm: Fullname, Birthdate, Relationship (lựa chọn đầu <code>--- Type of relationship ---</code>, rồi Wife, Son, Daughter, Father, Mother, Father in law, Mother in law).</li><li>Kiểm hợp lệ (hiện danh sách lỗi): "Fullname is required", "Birthdate is required", "Birthdate must be before today", "Please choose a relationship".</li><li>Hợp lệ ⇒ thêm vào employee, gửi <code>PUT http://localhost:9999/employees/:id</code>, giao diện cập nhật ngay.</li></ul>
${img('q3-dependents', 'Người phụ thuộc của Binh Tran')}
${img('q3-errors', 'Lỗi kiểm hợp lệ')}
${img('q3-added', 'Sau khi thêm')}`;

const SEL = [
  ['#department-table · .department-row · #dep-row-&lt;id&gt; · .manager-name · .view-btn', 'Q1 — the table, one row per department (id = <code>dep-row-</code> + id), the manager cell, the View button', 'Câu 1 — bảng, mỗi phòng một dòng (id = <code>dep-row-</code> + id), ô trưởng phòng, nút View'],
  ['#employee-accordion · .employee-item · #emp-item-&lt;id&gt; · .employee-header', 'Q2 — the Accordion, one item per employee (id = <code>emp-item-</code> + employee id), its header', 'Câu 2 — Accordion, mỗi nhân viên một item (id = <code>emp-item-</code> + id nhân viên), tiêu đề item'],
  ['.work-row · .work-salary · .projects-salary · .view-dependents', 'inside an item: one row per work, its salary cell, the "Projects Salary" line, the View Dependents button', 'trong item: mỗi dòng công việc, ô lương, dòng "Projects Salary", nút View Dependents'],
  ['#dependents · .dependent-row · .no-dependents', 'Q3 — the dependents panel, one row per dependent, the "No dependents" text', 'Câu 3 — khung người phụ thuộc, mỗi người một dòng, chữ "No dependents"'],
  ['#dep-fullname · #dep-birthdate · #dep-relationship · #dep-add', 'the Add form (birthdate is <code>input type="date"</code>)', 'form thêm (ngày sinh là <code>input type="date"</code>)'],
];
const codeLab = (lang) => {
  const vi = lang === 'vi';
  const r = (en, v) => (vi ? v : en);
  return `<hr>
<h2>${r('Code Lab — auto-grader notes (not part of the paper)', 'Code Lab — ghi chú cho máy chấm (KHÔNG thuộc tờ đề)')}</h2>
<p class="bi-chu-y">${r('The grader opens the page at <code>/</code>, clicks View of a department, then View Dependents of an employee. Keep every Accordion item in the DOM (react-bootstrap does by default) so the buttons of collapsed items can still be clicked.', 'Máy chấm mở <code>/</code>, bấm View của một phòng, rồi View Dependents của một nhân viên. Giữ mọi item Accordion trong DOM (react-bootstrap mặc định đã vậy) để nút của item đang đóng vẫn bấm được.')}</p>
<h3>${r('Element ids / classes used by the auto-grader', 'id / class máy chấm dùng')}</h3>
<table><thead><tr><th>Selector</th><th>${r('Purpose', 'Vai trò')}</th></tr></thead><tbody>${SEL.map(([s, en, v]) => `<tr><td><code>${s}</code></td><td>${r(en, v)}</td></tr>`).join('')}</tbody></table>
<h3>${r('Auto-grader rubric (10 points, Run = sample checks · Submit = full rubric incl. hidden)', 'Thang điểm máy chấm (10 điểm, Chạy thử = kiểm mẫu · Nộp = chấm đủ, có kiểm ẩn)')}</h3>
<table><thead><tr><th>#</th><th>${r('Rubric line', 'Dòng điểm')}</th><th>${r('Marks', 'Điểm')}</th></tr></thead><tbody>${THANG_DIEM.map((t, i) => `<tr><td>${i + 1}</td><td>${esc(vi ? THANG_VI[i] : t.ten.replace(/^\d+\. /, ''))}</td><td>${t.diem}</td></tr>`).join('')}</tbody></table>`;
};

const YEU_CAU = [
  { en: 'Start the mock API as in the exam: <code>npx json-server --watch database.json --port 9999</code>; the app at <code>http://localhost:3000</code>.', vi: 'Chạy API giả như lúc thi: <code>npx json-server --watch database.json --port 9999</code>; app ở <code>http://localhost:3000</code>.' },
  { en: 'The starter is a bare CRA entry: add Bootstrap CSS and the three parts yourself.', vi: 'Starter là CRA trống: tự thêm CSS Bootstrap và ba phần của trang.' },
  { en: 'Press <b>Run</b> for the sample checks, <b>Submit</b> for the full rubric (hidden checks included). Time yourself: 85 minutes.', vi: 'Bấm <b>Chạy thử</b> để chạy kiểm mẫu, <b>Nộp</b> để chấm đủ (có kiểm ẩn). Tự bấm giờ: 85 phút.' },
];

export default doiDau({
  slug: 'fer202-13-pe-10-company-management',
  ten: 'PE SP26 Block 5 — Company Management (Departments · Employees · Dependents)',
  khoa: KHOA,
  baiHoc: 'fer202-pe1-0-mo-dau',
  de: [
    {
      dangBai: 'pe',
      tieuDe: { en: 'PE SP26 Block 5 — Company Management: Departments → Employees (Accordion) → Dependents', vi: 'Đề PE SP26 Block 5 — Company Management: Phòng ban → Nhân viên (Accordion) → Người phụ thuộc' },
      doKho: 'HARD',
      phut: 85,
      diem: 100,
      ngonNgu: 'javascript',
      khaiNiem: ['fetch / axios', 'lifting state up', 'id → name lookup', 'Accordion (react-bootstrap)', 'reduce (sum)', 'Math.floor', 'toLocaleString("vi-VN")', 'controlled form', 'date validation', 'PUT nested array', 'key to reset child state'],
      tienQuyet: ['useState / useEffect', 'React-Bootstrap'],
      the: ['fer202', 'pe', 'json-server', 'accordion', 'validation'],
      moTa: { en: DE_EN + '\n' + codeLab('en'), vi: DE_VI + '\n' + codeLab('vi') },
      yeuCau: YEU_CAU,
      dauVao: { en: 'A CRA project (React 18, react-bootstrap 2) + database.json (departments, employees with embedded dependents, projects, works).', vi: 'Dự án CRA (React 18, react-bootstrap 2) + database.json (departments, employees có dependents lồng, projects, works).' },
      dauRa: { en: 'One page at "/" with the three linked parts passing every rubric line.', vi: 'Một trang ở "/" gồm ba phần nối nhau, đạt mọi dòng điểm.' },
      rangBuoc: [
        { en: 'Data only through json-server at <code>http://localhost:9999</code>; UI with React-Bootstrap (Accordion for Question 2).', vi: 'Dữ liệu chỉ qua json-server ở <code>http://localhost:9999</code>; giao diện React-Bootstrap (Câu 2 dùng Accordion).' },
        { en: 'Salary per project is truncated before summing; numbers use Vietnamese dot separators.', vi: 'Lương từng dự án bỏ phần lẻ trước khi cộng; số dùng dấu chấm kiểu Việt.' },
      ],
      viDu: [
        { input: 'View IT', output: '#1 - Binh Tran - Manager · #2 - Le Chi · #3 - Pham Dung · #4 - Vo Hanh', explanation: { en: 'Filter employees by depId; "Manager" when supervisorId is null.', vi: 'Lọc theo depId; "Manager" khi supervisorId là null.' } },
        { input: 'Binh Tran (25.000.000, 30 h + 20 h)', output: '4.261.363 + 2.840.909 ⇒ Projects Salary: 7.102.272 VND', explanation: { en: 'floor(25000000 / 176 × 30) = 4261363.', vi: 'floor(25000000 / 176 × 30) = 4261363.' } },
        { input: 'Add dependent with birthdate 2099-01-01', output: 'Birthdate must be before today — nothing sent', explanation: { en: 'Compare "YYYY-MM-DD" strings with today in local time.', vi: 'So chuỗi "YYYY-MM-DD" với hôm nay theo giờ địa phương.' } },
      ],
      goiY: [
        'Giữ employees + depId + selectedId ở component cha; Department List gọi onView(depId), Employee List gọi onViewDependents(emp).',
        'Tên trưởng phòng: employees.find(e => String(e.id) === String(d.managerId))?.fullname.',
        'Lương: Math.floor(emp.empSalary / 176 * w.workHours); tổng = reduce; hiển thị n.toLocaleString("vi-VN").',
        'Người phụ thuộc: render <Dependents key={emp.id} …> để đổi người thì form/lỗi tự xoá.',
        'Thêm: const updated = { ...emp, dependents: [...emp.dependents, moi] }; PUT /employees/:id rồi thay employee trong state cha bằng kết quả trả về.',
      ],
      loiHayGap: [
        'Hiện managerId (1, 2, 7) thay vì tên trưởng phòng.',
        'Làm tròn (Math.round) thay vì bỏ phần lẻ, hoặc cộng rồi mới làm tròn ⇒ lệch 1 VND so với mẫu.',
        'Dùng toLocaleString() không tham số ⇒ dấu phẩy thay vì dấu chấm.',
        'Gửi POST /dependents (không có collection đó) thay vì PUT cả employee.',
        'Không truyền key ⇒ đổi nhân viên mà form/lỗi của người trước vẫn còn.',
        'So ngày bằng new Date("2015-05-05") (UTC) với new Date() ⇒ lệch múi giờ; so chuỗi YYYY-MM-DD địa phương.',
      ],
      thuatNgu: [
        { en: 'dependent', vi: 'người phụ thuộc (vợ/chồng, con, cha mẹ…)' },
        { en: 'accordion', vi: 'danh sách gập/mở từng mục' },
        { en: 'lifting state up', vi: 'đưa state lên component cha để các con dùng chung' },
        ...tn('validate', 'rubric'),
      ],
      giaiThich: {
        en: '<p>The page keeps the employees and the two selections (department, employee) in the parent. Question 1 joins departments with employees for the manager name; Question 2 filters by depId, joins works with projects and computes each salary with <code>Math.floor(empSalary / 176 × hours)</code> before summing. Question 3 edits the embedded <code>dependents</code> array: validate, build the new employee object, PUT it, and replace it in the parent state so every part re-renders.</p>',
        vi: '<p>Trang giữ danh sách nhân viên và hai lựa chọn (phòng, nhân viên) ở component cha. Câu 1 nối departments với employees để lấy tên trưởng phòng; Câu 2 lọc theo depId, nối works với projects và tính từng khoản lương bằng <code>Math.floor(empSalary / 176 × giờ)</code> rồi mới cộng. Câu 3 sửa mảng <code>dependents</code> lồng: kiểm hợp lệ, dựng object nhân viên mới, PUT, rồi thay vào state cha để mọi phần vẽ lại.</p>',
      },
      tests: { loai: 'react', phienBan: 1, tepChinh: 'src/index.js', thuVien: ['react-router-dom', 'react-bootstrap', 'bootstrap'], url: '/', jsonServer: { base: B, db: DB }, thangDiem: THANG_DIEM, kiem: KIEM, loiGiaiSauKhiDat: true },
      khoiDau: KHOI_DAU,
      loiGiai: LOI_GIAI,
      demo: { tepChinh: 'src/index.js', url: '/' },
      thamKhao: 'https://react-bootstrap.github.io/docs/components/accordion/',
    },
  ],
});
