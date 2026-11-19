/**
 * FER202 · ĐỀ PE SP26 Block 3 — Employee (React Bootstrap) + Plant Shop (JSON Server) — dạng dự án cho Code Lab.
 * ════════════════════════════════════════════════════════════════════════════════════════════════
 * Cùng đề với Phòng thi FER202-PE4 (content/exams/FER202-PE4.mjs, Given zip PE4-Given.zip).
 * Lúc thi là 2 project riêng; Code Lab gộp một dự án: /employees (Câu 1), /plants + /orders (Câu 2).
 *
 * Tài nguyên ở ./_pe9-plant-shop/:
 *   database.json          — Given database.json (3 plants · 2 orders), dùng làm src/data/db.json lúc thi
 *   loiGiai/src/**         — lời giải đã kiểm (Vite build + Playwright: C1 6/6, C2 21/21) + id/class máy chấm
 *   khoiDau/src/**         — starter: index.js + App.js trống + data/employees.js (Given)
 *   anh/fig*.webp          — 4 ảnh chụp từ app lời giải
 *
 * Bẫy của đề: thông báo lỗi phải HIỆN (khoá nút submit khi form sai thì không bao giờ thấy thông báo);
 * stock = 0 hợp lệ, rỗng thì không; plantId từ <select> là chuỗi — đơn lưu cùng kiểu với plants.id;
 * danh sách đơn phải ánh xạ plantId → tên cây; xoá cây phải hiện "Plant deleted successfully.".
 */
import fs from 'node:fs';
import { doiDau, KHOA, tn } from './_chung.mjs';

const TN_MUC = new URL('./_pe9-plant-shop/', import.meta.url);
const doc = (p) => fs.readFileSync(new URL(p, TN_MUC), 'utf8').replace(/\r\n/g, '\n');
const anh = (ten) => `data:image/webp;base64,${fs.readFileSync(new URL(`anh/${ten}.webp`, TN_MUC)).toString('base64')}`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const DB_JSON = doc('database.json');
const DB = JSON.parse(DB_JSON);
const EMP_JS = doc('khoiDau/src/data/employees.js');

const KHOI_DAU = {
  'src/index.js': doc('khoiDau/src/index.js'),
  'src/App.js': doc('khoiDau/src/App.js'),
  'src/data/employees.js': EMP_JS,
};
const LOI_GIAI = {
  'src/index.js': doc('loiGiai/src/index.js'),
  'src/App.js': doc('loiGiai/src/App.js'),
  'src/api.js': doc('loiGiai/src/api.js'),
  'src/data/employees.js': doc('loiGiai/src/data/employees.js'),
  'src/pages/EmployeeManager.js': doc('loiGiai/src/pages/EmployeeManager.js'),
  'src/pages/PlantManagement.js': doc('loiGiai/src/pages/PlantManagement.js'),
  'src/pages/OrderManagement.js': doc('loiGiai/src/pages/OrderManagement.js'),
};

const B = 'http://localhost:9999';
const EMP = '/employees';
const PL = '/plants';
const OR = '/orders';

const cho = (ms = 300) => ({ hanhDong: 'cho', ms });
const nhap = (selector, giaTri) => ({ hanhDong: 'nhap', selector, giaTri });
const doi = (selector, giaTri) => ({ hanhDong: 'doi', selector, giaTri });
const click = (selector, thu) => ({ hanhDong: 'click', selector, ...(thu != null ? { thu } : {}) });
const THEM_CAY = [cho(300), nhap('#plant-name', 'Aloe Vera'), nhap('#plant-price', '150'), nhap('#plant-category', 'Indoor'), nhap('#plant-stock', '0'), click('#plant-submit'), cho(500)];
const SUA_CAY = [cho(300), click('#plant-row-2 .edit-btn'), cho(200), nhap('#plant-price', '250'), click('#plant-submit'), cho(500)];
const XOA_CAY = [cho(300), click('#plant-row-3 .delete-btn'), cho(500)];
const CAY_RONG = [cho(300), click('#plant-submit'), cho(300)];
const THEM_DON = [cho(400), nhap('#order-customer', 'Tran Thi Lan'), doi('#order-plant', '3'), nhap('#order-quantity', '2'), click('#order-submit'), cho(600)];
const DON_RONG = [cho(400), click('#order-submit'), cho(300)];

const KIEM = [
  // ───────── f1 — Câu 1 · Danh sách nhân viên (2.0đ) ─────────
  { nhom: 'f1', moTa: '/employees shows the 3 employees in a table', url: EMP, kiem: 'so-luong', selector: '.employee-row', giaTri: 3 },
  { nhom: 'f1', moTa: 'Header: ID | Full Name | Position | Department | Salary | Status | Action', url: EMP, kiem: 'danh-sach-text', selector: '#employee-table thead th', mongDoi: ['ID', 'Full Name', 'Position', 'Department', 'Salary', 'Status', 'Action'] },
  { nhom: 'f1', moTa: 'Row 2: Le Hong Manh · Backend Developer · Software Engineering · $1800 · Active', url: EMP, kiem: 'text', selector: '#employee-row-2', khop: 'Le Hong Manh[\\s\\S]*Backend Developer[\\s\\S]*Software Engineering[\\s\\S]*\\$1800[\\s\\S]*Active' },
  { nhom: 'f1', moTa: 'Every row has a "View Detail" button', url: EMP, kiem: 'so-luong', selector: '.employee-row .view-detail', giaTri: 3 },
  { nhom: 'f1', an: true, moTa: 'The list is a Bootstrap table (class "table")', url: EMP, kiem: 'ton-tai', selector: '#employee-table.table' },
  { nhom: 'f1', an: true, moTa: 'Row 3 shows status Inactive', url: EMP, kiem: 'text', selector: '#employee-row-3', khop: 'Nguyen Van Ty[\\s\\S]*Inactive' },

  // ───────── f2 — Câu 1 · Vùng chi tiết (2.0đ) ─────────
  { nhom: 'f2', moTa: 'Before selection: "Please select an employee."', url: EMP, kiem: 'text', selector: 'body', khop: 'Please select an employee\\.' },
  { nhom: 'f2', moTa: 'View Detail of Le Hong Manh ⇒ detail area shows his data', url: EMP, kiem: 'text', selector: '#employee-detail', khop: 'Le Hong Manh[\\s\\S]*Backend Developer[\\s\\S]*Software Engineering[\\s\\S]*1800[\\s\\S]*Active', truoc: [cho(200), click('#employee-row-2 .view-detail'), cho(200)] },
  { nhom: 'f2', moTa: 'Clicking the ROW (not the button) also selects: Nguyen Van Ty', url: EMP, kiem: 'text', selector: '#employee-detail', khop: 'Nguyen Van Ty[\\s\\S]*Tester[\\s\\S]*Quality Assurance', truoc: [cho(200), click('#employee-row-3 td', 1), cho(200)] },
  { nhom: 'f2', an: true, moTa: 'After selecting, the placeholder disappears', url: EMP, kiem: 'khong-ton-tai', selector: '.detail-placeholder', truoc: [cho(200), click('#employee-row-1 .view-detail'), cho(200)] },
  { nhom: 'f2', an: true, moTa: 'Detail labels the fields (ID / Full Name / Salary)', url: EMP, kiem: 'text', selector: '#employee-detail', khop: 'ID:?\\s*1[\\s\\S]*Full Name:?\\s*Vo An Hai[\\s\\S]*Salary:?\\s*\\$1200', truoc: [cho(200), click('#employee-row-1 .view-detail'), cho(200)] },

  // ───────── f3 — Câu 2 · Router + danh sách cây (1.5đ) ─────────
  { nhom: 'f3', moTa: '"/" redirects to /plants', url: '/', kiem: 'duong-dan', giaTri: PL },
  { nhom: 'f3', moTa: 'Navbar has a link to /orders (and one to /plants)', url: PL, kiem: 'ton-tai', selector: `nav a[href="${OR}"]` },
  { nhom: 'f3', an: true, moTa: 'Plants fetched: GET /plants', url: PL, kiem: 'goi-fetch', khop: `^GET ${B}/plants$` },
  { nhom: 'f3', moTa: '3 plant rows', url: PL, kiem: 'so-luong', selector: '.plant-row', giaTri: 3 },
  { nhom: 'f3', moTa: 'Row 3: Bonsai · 1000 · Decor · 5', url: PL, kiem: 'text', selector: '#plant-row-3', khop: 'Bonsai[\\s\\S]*1000[\\s\\S]*Decor[\\s\\S]*5' },
  { nhom: 'f3', an: true, moTa: 'Navbar link opens Order Management', url: PL, kiem: 'duong-dan', giaTri: OR, truoc: [cho(200), click(`nav a[href="${OR}"]`), cho(200)] },

  // ───────── f4 — Câu 2 · CRUD cây (2.0đ) ─────────
  { nhom: 'f4', moTa: 'Add Plant (stock 0 is valid) ⇒ POST saved with numbers', url: PL, kiem: 'du-lieu-server', bang: 'plants', chua: { name: 'Aloe Vera', price: 150, category: 'Indoor', stock: 0 }, chat: true, truoc: THEM_CAY },
  { nhom: 'f4', moTa: 'After adding, the table shows 4 rows', url: PL, kiem: 'so-luong', selector: '.plant-row', giaTri: 4, truoc: THEM_CAY },
  { nhom: 'f4', moTa: 'Edit Cactus price → 250 ⇒ server updated', url: PL, kiem: 'du-lieu-server', bang: 'plants', chua: { id: 2, name: 'Cactus', price: 250 }, truoc: SUA_CAY },
  { nhom: 'f4', an: true, moTa: 'Edit ⇒ the row shows 250 without reloading', url: PL, kiem: 'text', selector: '#plant-row-2', khop: 'Cactus[\\s\\S]*250', truoc: SUA_CAY },
  { nhom: 'f4', moTa: 'Delete Bonsai ⇒ "Plant deleted successfully."', url: PL, kiem: 'text', selector: 'body', khop: 'Plant deleted successfully\\.', truoc: XOA_CAY },
  { nhom: 'f4', an: true, moTa: 'Delete ⇒ 2 plants left on the server and in the table', url: PL, kiem: 'du-lieu-server', bang: 'plants', doDai: 2, truoc: XOA_CAY },

  // ───────── f5 — Câu 2 · Đơn hàng (1.5đ) ─────────
  { nhom: 'f5', moTa: '/orders lists 2 orders', url: OR, kiem: 'so-luong', selector: '.order-row', giaTri: 2 },
  { nhom: 'f5', moTa: 'Plant names mapped from plantId (Monstera, Cactus)', url: OR, kiem: 'text', selector: '#order-table', khop: 'Vo An Hai[\\s\\S]*Monstera[\\s\\S]*2[\\s\\S]*Le Hong Manh[\\s\\S]*Cactus[\\s\\S]*1' },
  { nhom: 'f5', moTa: 'Plant select starts with "-- Select Plant --" + 3 plants', url: OR, kiem: 'so-luong', selector: '#order-plant option', giaTri: 4 },
  { nhom: 'f5', moTa: 'Add Order ⇒ POST /orders saved (Tran Thi Lan · Bonsai · 2)', url: OR, kiem: 'du-lieu-server', bang: 'orders', chua: { customerName: 'Tran Thi Lan', plantId: 3, quantity: 2 }, truoc: THEM_DON },
  { nhom: 'f5', an: true, moTa: 'The new order appears with the plant name Bonsai', url: OR, kiem: 'text', selector: '#order-table', khop: 'Tran Thi Lan[\\s\\S]*Bonsai', truoc: THEM_DON },
  { nhom: 'f5', moTa: 'Delete order 1 ⇒ removed from server and table', url: OR, kiem: 'du-lieu-server', bang: 'orders', doDai: 1, truoc: [cho(400), click('#order-row-1 .order-delete'), cho(500)] },

  // ───────── f6 — Câu 2 · Kiểm hợp lệ (1.0đ) ─────────
  { nhom: 'f6', moTa: 'Empty plant form ⇒ the 4 exact messages are visible', url: PL, kiem: 'text', selector: 'body', khop: 'Name is required\\.[\\s\\S]*Price must be greater than 0\\.[\\s\\S]*Category is required\\.[\\s\\S]*Stock must be greater than or equal to 0\\.', truoc: CAY_RONG },
  { nhom: 'f6', an: true, moTa: 'Invalid plant ⇒ no POST', url: PL, kiem: 'goi-fetch', khop: '^POST', min: 0, max: 0, truoc: CAY_RONG },
  { nhom: 'f6', an: true, moTa: 'Negative price / stock rejected (price −5, stock −1)', url: PL, kiem: 'text', selector: 'body', khop: 'Price must be greater than 0\\.[\\s\\S]*Stock must be greater than or equal to 0\\.', truoc: [cho(300), nhap('#plant-name', 'X'), nhap('#plant-category', 'Y'), nhap('#plant-price', '-5'), nhap('#plant-stock', '-1'), click('#plant-submit'), cho(300)] },
  { nhom: 'f6', moTa: 'Empty order form ⇒ the 3 exact messages are visible', url: OR, kiem: 'text', selector: 'body', khop: 'Customer name is required\\.[\\s\\S]*Please select a plant\\.[\\s\\S]*Quantity must be greater than 0\\.', truoc: DON_RONG },
  { nhom: 'f6', an: true, moTa: 'Invalid order ⇒ no POST', url: OR, kiem: 'goi-fetch', khop: '^POST', min: 0, max: 0, truoc: DON_RONG },
];

const THANG_DIEM = [
  ['Q1 · Employee list with React Bootstrap', 2.0],
  ['Q1 · Employee detail area (row or View Detail) + layout', 2.0],
  ['Q2 · React Router pages + plant list', 1.5],
  ['Q2 · Full CRUD for plants', 2.0],
  ['Q2 · Orders: mapping, create, delete', 1.5],
  ['Q2 · Validation messages (plants + orders)', 1.0],
].map(([ten, diem], i) => ({ ma: `f${i + 1}`, ten: `${i + 1}. ${ten}`, diem }));
const THANG_VI = [
  'C1 · Danh sách nhân viên bằng React Bootstrap',
  'C1 · Vùng chi tiết (bấm dòng hoặc View Detail) + bố cục',
  'C2 · Trang React Router + danh sách cây',
  'C2 · CRUD đầy đủ cho cây',
  'C2 · Đơn hàng: ánh xạ tên cây, thêm, xoá',
  'C2 · Thông báo kiểm hợp lệ (cây + đơn)',
];

// ═════════════════════════════════════ ĐỀ ═════════════════════════════════════
const img = (ten, alt) => `<p><img src="${anh(ten)}" alt="${alt}" style="max-width:100%;height:auto;border:1px solid #d1d5db;border-radius:4px"></p>`;
const PRE_EMP = `<pre>${esc(EMP_JS.replace(/\s+$/, ''))}</pre>`;
const PRE_DB = `<pre>${esc(DB_JSON.replace(/\s+$/, ''))}</pre>`;

const DE_EN = `<h1>PRACTICAL EXAMINATION</h1>
<p class="bi-phu">FER202 · SPRING 2026 Block 3 PE (same paper as the Exam Room's PE4). Duration: 85 minutes. In the exam each question is its own React project; in Code Lab both live in one app: Question 1 at <code>/employees</code>, Question 2 at <code>/plants</code> and <code>/orders</code>.</p>
<h2>Question 1: Display Object Data using React Bootstrap (4 marks)</h2>
<p>File: <code>src/data/employees.js</code> (given)</p>
${PRE_EMP}
<h3>1.1. Display employee list using React Bootstrap (2 marks)</h3>
<ul><li>Show all employees using React Bootstrap components (Table, Card, Container, Row, Col, Button, Badge…).</li><li>Columns: ID | Full Name | Position | Department | Salary | Status | Action; salary as <code>$1200</code>; each row has a <b>[View Detail]</b> button.</li><li>The Employee List and the Employee Detail area are side by side; before any selection the detail area shows <i>Please select an employee.</i></li></ul>
<h3>1.2. Display employee detail area (1.5 marks)</h3>
<ul><li>When an employee item (row) <b>or</b> the View Detail button is clicked, the selected employee's information is shown in a separate area: ID, Full Name, Position, Department, Salary, Status.</li></ul>
<h3>1.3. Apply Bootstrap styling properly (0.5 mark)</h3>
<ul><li>The interface must be clear and aligned, with React Bootstrap used appropriately.</li></ul>
${img('fig1-employees', 'Question 1 — after View Detail of employee 1')}
<h2>Question 2: Plant Shop Management using JSON Server (6 marks)</h2>
<p>Build a React application that manages a plant trading system with 2 objects: <b>plants</b> and <b>orders</b>. Use <b>React Router</b> to split it into at least two pages, <b>Plant Management</b> and <b>Order Management</b>, with a menu/navigation bar between them. File: <code>src/data/db.json</code>; API BASE URL: <code>http://localhost:9999</code>.</p>
${PRE_DB}
<h3>2.1. Display plant list</h3>
<ul><li>Fetch data from API <code>/plants</code>; columns ID, Name, Price, Category, Stock, Actions ([Edit] [Delete]).</li></ul>
${img('fig2-plants', 'Plant Management')}
<h3>2.2. Full CRUD for Plants</h3>
<ul><li>Create plant, Update plant, Delete plant; the UI must update correctly. Add Plant form: Name · Price · Category · Stock · [Add Plant]. After deleting show <i>Plant deleted successfully.</i></li></ul>
<h3>2.3. Manage Orders</h3>
<ul><li>List orders: customerName, plant name (mapping from plantId), quantity; Create order; Delete order. Add Order form: Customer Name · Plant (<code>-- Select Plant --</code>) · Quantity · [Add Order].</li></ul>
${img('fig4-orders', 'Order Management (Total Price is a bonus column)')}
<h3>2.4. Validation</h3>
<table><thead><tr><th>Plant field</th><th>Rule</th><th>Message</th></tr></thead><tbody><tr><td>name</td><td>Required</td><td>Name is required.</td></tr><tr><td>price</td><td>&gt; 0</td><td>Price must be greater than 0.</td></tr><tr><td>category</td><td>Required</td><td>Category is required.</td></tr><tr><td>stock</td><td>≥ 0</td><td>Stock must be greater than or equal to 0.</td></tr></tbody></table>
<table><thead><tr><th>Order field</th><th>Rule</th><th>Message</th></tr></thead><tbody><tr><td>customerName</td><td>Required</td><td>Customer name is required.</td></tr><tr><td>plantId</td><td>Required</td><td>Please select a plant.</td></tr><tr><td>quantity</td><td>&gt; 0</td><td>Quantity must be greater than 0.</td></tr></tbody></table>
${img('fig3-plant-errors', 'Add Plant with validation errors')}
<p><b>Bonus (not auto-graded):</b> useContext / Redux Toolkit; reduce plant stock when creating an order; prevent ordering when quantity &gt; stock; total price of each order.</p>`;

const DE_VI = `<h1>BÀI THI THỰC HÀNH</h1>
<p class="bi-phu">FER202 · PE SPRING 2026 Block 3 (cùng đề PE4 ở Phòng thi). Thời gian: 85 phút. Lúc thi mỗi câu một project; Code Lab gộp một app: Câu 1 ở <code>/employees</code>, Câu 2 ở <code>/plants</code> và <code>/orders</code>.</p>
<h2>Câu 1: Hiển thị dữ liệu object bằng React Bootstrap (4 điểm)</h2>
<p>File: <code>src/data/employees.js</code> (cho sẵn)</p>
${PRE_EMP}
<ul><li><b>1.1 (2đ)</b> Hiện mọi nhân viên bằng component React Bootstrap; cột ID | Full Name | Position | Department | Salary | Status | Action; lương dạng <code>$1200</code>; mỗi dòng có nút <b>[View Detail]</b>. Danh sách và vùng Employee Detail đặt cạnh nhau; chưa chọn ai thì vùng chi tiết hiện <i>Please select an employee.</i></li>
<li><b>1.2 (1,5đ)</b> Bấm <b>dòng</b> hoặc nút View Detail ⇒ thông tin người đó (ID, Full Name, Position, Department, Salary, Status) hiện ở vùng riêng.</li>
<li><b>1.3 (0,5đ)</b> Giao diện rõ ràng, thẳng hàng, dùng React Bootstrap hợp lý.</li></ul>
${img('fig1-employees', 'Câu 1 — sau khi bấm View Detail nhân viên 1')}
<h2>Câu 2: Quản lý cửa hàng cây dùng JSON Server (6 điểm)</h2>
<p>App React quản lý <b>plants</b> và <b>orders</b>; React Router chia ít nhất 2 trang <b>Plant Management</b> và <b>Order Management</b>, có navbar. File <code>src/data/db.json</code>; API BASE URL <code>http://localhost:9999</code>.</p>
${PRE_DB}
<ul><li><b>2.1</b> Lấy <code>/plants</code>, cột ID, Name, Price, Category, Stock, Actions ([Edit] [Delete]).</li>
<li><b>2.2</b> Thêm, sửa, xoá cây; giao diện cập nhật đúng. Form Add Plant: Name · Price · Category · Stock · [Add Plant]. Xoá xong hiện <i>Plant deleted successfully.</i></li>
<li><b>2.3</b> Danh sách đơn: customerName, tên cây (ánh xạ từ plantId), quantity; thêm đơn; xoá đơn. Form Add Order: Customer Name · Plant (<code>-- Select Plant --</code>) · Quantity · [Add Order].</li>
<li><b>2.4</b> Kiểm hợp lệ với đúng nguyên văn thông báo: Plant — "Name is required.", "Price must be greater than 0.", "Category is required.", "Stock must be greater than or equal to 0."; Order — "Customer name is required.", "Please select a plant.", "Quantity must be greater than 0.". Dữ liệu sai không được gửi đi.</li></ul>
${img('fig2-plants', 'Plant Management')}
${img('fig3-plant-errors', 'Add Plant với lỗi kiểm hợp lệ')}
${img('fig4-orders', 'Order Management (cột Total Price là phần thưởng)')}
<p><b>Điểm thưởng (máy không chấm):</b> useContext / Redux Toolkit; trừ tồn kho khi đặt đơn; chặn quantity &gt; stock; tổng tiền mỗi đơn.</p>`;

const SEL = [
  ['#employee-table · .employee-row · #employee-row-&lt;id&gt; · .view-detail', 'Q1 — the table, one row per employee (id = <code>employee-row-</code> + id), the View Detail button', 'Câu 1 — bảng, mỗi nhân viên một dòng (id = <code>employee-row-</code> + id), nút View Detail'],
  ['#employee-detail · .detail-placeholder', 'Q1 — the detail area after a selection; the "Please select an employee." element', 'Câu 1 — vùng chi tiết khi đã chọn; phần tử "Please select an employee."'],
  ['nav a[href="/plants"] · nav a[href="/orders"]', 'Q2 — navbar links (Link/NavLink inside <code>&lt;nav&gt;</code>)', 'Câu 2 — link navbar (Link/NavLink trong <code>&lt;nav&gt;</code>)'],
  ['.plant-row · #plant-row-&lt;id&gt; · .edit-btn · .delete-btn', 'one row per plant; its Edit and Delete buttons', 'mỗi cây một dòng; nút Edit và Delete của dòng'],
  ['#plant-name · #plant-price · #plant-category · #plant-stock · #plant-submit', 'the Add/Update Plant form (Edit loads the plant into the same form)', 'form Add/Update Plant (Edit nạp cây vào cùng form)'],
  ['#order-table · .order-row · #order-row-&lt;id&gt; · .order-delete', 'the orders table, one row per order, its Delete button', 'bảng đơn, mỗi đơn một dòng, nút Delete'],
  ['#order-customer · #order-plant · #order-quantity · #order-submit', 'the Add Order form (option <code>value</code> = plant id)', 'form Add Order (<code>value</code> của option = id cây)'],
];
const codeLab = (lang) => {
  const vi = lang === 'vi';
  const r = (en, v) => (vi ? v : en);
  return `<hr>
<h2>${r('Code Lab — auto-grader notes (not part of the paper)', 'Code Lab — ghi chú cho máy chấm (KHÔNG thuộc tờ đề)')}</h2>
<p class="bi-chu-y">${r('Validation messages are searched anywhere on the page (inline feedback, Alert or text) — but they must be VISIBLE after pressing the submit button, so do not disable the button while the form is invalid.', 'Thông báo lỗi được tìm ở bất kỳ đâu trên trang (feedback dưới ô, Alert hay chữ thường) — nhưng phải HIỆN sau khi bấm nút gửi, nên đừng khoá nút khi form sai.')}</p>
<h3>${r('Element ids / classes used by the auto-grader', 'id / class máy chấm dùng')}</h3>
<table><thead><tr><th>Selector</th><th>${r('Purpose', 'Vai trò')}</th></tr></thead><tbody>${SEL.map(([s, en, v]) => `<tr><td><code>${s}</code></td><td>${r(en, v)}</td></tr>`).join('')}</tbody></table>
<h3>${r('Auto-grader rubric (10 points, Run = sample checks · Submit = full rubric incl. hidden)', 'Thang điểm máy chấm (10 điểm, Chạy thử = kiểm mẫu · Nộp = chấm đủ, có kiểm ẩn)')}</h3>
<table><thead><tr><th>#</th><th>${r('Rubric line', 'Dòng điểm')}</th><th>${r('Marks', 'Điểm')}</th></tr></thead><tbody>${THANG_DIEM.map((t, i) => `<tr><td>${i + 1}</td><td>${esc(vi ? THANG_VI[i] : t.ten.replace(/^\d+\. /, ''))}</td><td>${t.diem}</td></tr>`).join('')}</tbody></table>`;
};

const YEU_CAU = [
  { en: 'JSON Server as in the exam: <code>npx json-server --watch src/data/db.json --port 9999</code> (the grader serves the same data).', vi: 'JSON Server như lúc thi: <code>npx json-server --watch src/data/db.json --port 9999</code> (máy chấm phục vụ đúng dữ liệu đó).' },
  { en: 'The starter has <code>src/index.js</code>, an empty <code>src/App.js</code> and the given <code>src/data/employees.js</code>.', vi: 'Starter có <code>src/index.js</code>, <code>src/App.js</code> trống và <code>src/data/employees.js</code> được phát.' },
  { en: 'Press <b>Run</b> for the sample checks, <b>Submit</b> for the full rubric (hidden checks included). Time yourself: 85 minutes.', vi: 'Bấm <b>Chạy thử</b> để chạy kiểm mẫu, <b>Nộp</b> để chấm đủ (có kiểm ẩn). Tự bấm giờ: 85 phút.' },
];

export default doiDau({
  slug: 'fer202-13-pe-9-plant-shop',
  ten: 'PE SP26 Block 3 — Employee List + Plant Shop',
  khoa: KHOA,
  baiHoc: 'fer202-pe4-0-mo-dau',
  de: [
    {
      dangBai: 'pe',
      tieuDe: { en: 'PE SP26 Block 3 — Employee master-detail + Plant Shop (JSON Server CRUD)', vi: 'Đề PE SP26 Block 3 — Nhân viên master-detail + Plant Shop (CRUD JSON Server)' },
      doKho: 'HARD',
      phut: 85,
      diem: 100,
      ngonNgu: 'javascript',
      khaiNiem: ['React Bootstrap Table/Card/Badge', 'master-detail state', 'stopPropagation', 'React Router v6', 'Navigate redirect', 'axios CRUD', 'json-server', 'controlled form', 'form validation', 'id → name mapping'],
      tienQuyet: ['useState / useEffect', 'axios', 'React-Bootstrap'],
      the: ['fer202', 'pe', 'router', 'json-server', 'crud', 'validation'],
      moTa: { en: DE_EN + '\n' + codeLab('en'), vi: DE_VI + '\n' + codeLab('vi') },
      yeuCau: YEU_CAU,
      dauVao: { en: 'A CRA project (React 18, react-router-dom 6, react-bootstrap 2, axios) + employees.js + db.json (3 plants, 2 orders).', vi: 'Dự án CRA (React 18, react-router-dom 6, react-bootstrap 2, axios) + employees.js + db.json (3 cây, 2 đơn).' },
      dauRa: { en: '/employees (list + detail) and /plants + /orders (CRUD + validation) passing every rubric line.', vi: '/employees (danh sách + chi tiết) và /plants + /orders (CRUD + kiểm hợp lệ) đạt mọi dòng điểm.' },
      rangBuoc: [
        { en: 'UI with React Bootstrap; data of Question 2 only through json-server at <code>http://localhost:9999</code>.', vi: 'Giao diện React Bootstrap; dữ liệu Câu 2 chỉ qua json-server ở <code>http://localhost:9999</code>.' },
        { en: 'Save price/stock/quantity as numbers and plantId with the same type as plants.id.', vi: 'Lưu price/stock/quantity dạng số và plantId cùng kiểu với plants.id.' },
      ],
      viDu: [
        { input: '/employees → click View Detail of row 2', output: 'Employee Detail: ID 2 · Le Hong Manh · Backend Developer · Software Engineering · $1800 · Active', explanation: { en: 'Clicking the row itself selects too (stopPropagation on the button avoids a double handler).', vi: 'Bấm cả dòng cũng chọn (stopPropagation ở nút để không chạy 2 lần).' } },
        { input: '/plants → [Add Plant] with an empty form', output: 'Name is required. · Price must be greater than 0. · Category is required. · Stock must be greater than or equal to 0.', explanation: { en: 'Nothing is POSTed; messages appear on submit.', vi: 'Không POST gì; thông báo hiện khi bấm gửi.' } },
        { input: '/orders', output: 'Vo An Hai · Monstera · 2 / Le Hong Manh · Cactus · 1', explanation: { en: 'Orders store plantId; the table maps it to the plant name.', vi: 'Đơn lưu plantId; bảng ánh xạ ra tên cây.' } },
      ],
      goiY: [
        'Câu 1: const [selected, setSelected] = useState(null); <tr onClick={() => setSelected(e)}>; nút View Detail gọi ev.stopPropagation() rồi setSelected(e). Bên phải: selected ? <Card>…</Card> : <p>Please select an employee.</p>.',
        'App: BrowserRouter + Navbar (Nav.Link as={NavLink}) + Routes: "/" ⇒ <Navigate to="/plants" replace />, "/plants", "/orders", "/employees".',
        'Plant: một form cho cả Add và Update (editingId); submit ⇒ validate(form) trả object lỗi; rỗng thì POST hoặc PUT, rồi tải lại danh sách.',
        'Kiểm: f.price === "" || !(Number(f.price) > 0); f.stock === "" || !(Number(f.stock) >= 0) — rỗng KHÔNG phải 0.',
        'Order: tải cả /orders và /plants (Promise.all); tên cây = plants.find(p => String(p.id) === String(o.plantId))?.name.',
      ],
      loiHayGap: [
        '<code>disabled={!isValid}</code> trên nút gửi ⇒ không bao giờ bấm được nên 7 thông báo lỗi không bao giờ hiện — mất điểm 2.4.',
        'Number("") là 0 ⇒ ô Stock rỗng lọt qua luật ≥ 0.',
        'Lưu plantId dạng chuỗi "3" từ &lt;select&gt; trong khi plants.id là số.',
        'Bảng đơn hiện plantId (1, 2) thay vì tên cây.',
        'Xoá/sửa xong không tải lại danh sách ⇒ giao diện lệch server.',
        'Chỉ nút View Detail chọn được, bấm dòng không có tác dụng (đề yêu cầu cả hai).',
      ],
      thuatNgu: [
        { en: 'master-detail', vi: 'danh sách + vùng chi tiết của mục đang chọn' },
        { en: 'mapping (plantId → name)', vi: 'tra id sang tên ở bảng khác' },
        { en: 'validation message', vi: 'thông báo lỗi kiểm hợp lệ' },
        ...tn('redirect', 'validate', 'rubric'),
      ],
      giaiThich: {
        en: '<p>Question 1 keeps one piece of state, the selected employee; both the row and the button set it, and the right column renders either a Card with labelled fields or the placeholder. Question 2 splits the app with React Router; each page loads from json-server and re-fetches after every POST/PUT/DELETE so the UI mirrors the server. Validation runs on submit and returns an object of messages, shown with React-Bootstrap <code>isInvalid</code> + <code>Form.Control.Feedback</code>. Orders keep only <code>plantId</code>; the table looks up the plant name.</p>',
        vi: '<p>Câu 1 giữ một state duy nhất là nhân viên đang chọn; cả dòng lẫn nút đều gán nó, cột phải hiện Card có nhãn từng trường hoặc dòng chữ chờ. Câu 2 chia trang bằng React Router; mỗi trang tải từ json-server và tải lại sau mỗi POST/PUT/DELETE để giao diện khớp server. Kiểm hợp lệ chạy khi gửi, trả về object thông báo, hiện bằng <code>isInvalid</code> + <code>Form.Control.Feedback</code>. Đơn chỉ lưu <code>plantId</code>; bảng tra ra tên cây.</p>',
      },
      tests: { loai: 'react', phienBan: 1, tepChinh: 'src/index.js', thuVien: ['react-router-dom', 'react-bootstrap', 'bootstrap'], url: PL, jsonServer: { base: B, db: DB }, thangDiem: THANG_DIEM, kiem: KIEM, loiGiaiSauKhiDat: true },
      khoiDau: KHOI_DAU,
      loiGiai: LOI_GIAI,
      demo: { tepChinh: 'src/index.js', url: PL },
      thamKhao: 'https://react-bootstrap.github.io/docs/forms/validation/',
    },
  ],
});
