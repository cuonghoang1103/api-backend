/**
 * FER202 · ĐỀ PE SU26 "Sneaker Collection" (mã đề FER202_PE_20060701) — dạng dự án cho Code Lab.
 * ════════════════════════════════════════════════════════════════════════════════════════════════
 * Cùng đề với Phòng thi FER202-PE17 (content/exams/FER202-PE17.mjs, Given zip PE17-Given.zip).
 * Lúc thi dữ liệu nằm trên mockapi.io; ở Code Lab máy chấm dựng json-server giả ở http://localhost:9999/sneakers
 * (đúng 10 bản ghi của sneaker_collection.json, id dạng chuỗi như mockapi) và .env cho sẵn REACT_APP_API_URL.
 *
 * Tài nguyên ở ./_pe8-sneakers/:
 *   database.json   — { "sneakers": [10 bản ghi nguyên văn sneaker_collection.json] }
 *   loiGiai/**      — lời giải đã kiểm (Vite build + Playwright trên json-server) + id/class cho máy chấm, .env
 *   khoiDau/**      — starter: .env + index.js + App.js để trống
 *   anh/fig*.webp   — 3 ảnh chụp từ app lời giải
 *
 * Bẫy của đề: URL API phải ở .env (gõ cứng ⇒ 0 điểm); Collection xếp sneakerName GIẢM dần, Management xếp id TĂNG
 * dần nhưng id là CHUỖI ("10" < "2" nếu so chuỗi); retailPriceK là nghìn đồng (189 ⇒ "189,000 VND");
 * brandName ≥ 2 TỪ; giá là số nguyên dương ≤ 3 chữ số; isLimitedEdition là switch mặc định false;
 * sneakerCategory select 5 lựa chọn, mặc định rỗng.
 */
import fs from 'node:fs';
import { doiDau, KHOA, tn } from './_chung.mjs';

const TN_MUC = new URL('./_pe8-sneakers/', import.meta.url);
const doc = (p) => fs.readFileSync(new URL(p, TN_MUC), 'utf8').replace(/\r\n/g, '\n');
const anh = (ten) => `data:image/webp;base64,${fs.readFileSync(new URL(`anh/${ten}.webp`, TN_MUC)).toString('base64')}`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const DB_JSON = doc('database.json');
const DB = JSON.parse(DB_JSON);

const KHOI_DAU = {
  '.env': doc('khoiDau/.env'),
  'src/index.js': doc('khoiDau/src/index.js'),
  'src/App.js': doc('khoiDau/src/App.js'),
};
const LOI_GIAI = {
  '.env': doc('loiGiai/.env'),
  'src/index.js': doc('loiGiai/src/index.js'),
  'src/App.js': doc('loiGiai/src/App.js'),
  'src/api.js': doc('loiGiai/src/api.js'),
  'src/constants.js': doc('loiGiai/src/constants.js'),
  'src/utils.js': doc('loiGiai/src/utils.js'),
  'src/pages/SneakerCollection.js': doc('loiGiai/src/pages/SneakerCollection.js'),
  'src/pages/SneakerManagement.js': doc('loiGiai/src/pages/SneakerManagement.js'),
  'src/pages/SneakerForm.js': doc('loiGiai/src/pages/SneakerForm.js'),
};

// ───────────────────────── Hằng ─────────────────────────
const B = 'http://localhost:9999';
const API = `${B}/sneakers`;
const R = '/se123456';
const COL = `${R}/sneaker-collection`;
const MAN = `${R}/sneaker-management`;
const ADD = `${R}/add-sneaker`;
const EDIT = (id) => `${R}/edit-sneaker/${id}`;
const TOP8 = ['Vans Old Skool', 'Reebok BB 4000 II', 'Puma Disperse XT 3', 'Nike Revolution 7', 'New Balance 574 Core', 'DC Court Graffik', 'Converse Chuck Taylor All Star', 'Charged Commit TR 4'];

const cho = (ms = 300) => ({ hanhDong: 'cho', ms });
const nhap = (selector, giaTri) => ({ hanhDong: 'nhap', selector, giaTri });
const doi = (selector, giaTri) => ({ hanhDong: 'doi', selector, giaTri });
const click = (selector) => ({ hanhDong: 'click', selector });
const tick = (selector) => ({ hanhDong: 'chon-o', selector });
const LUU = click('#save-sneaker');
const SAI = [cho(300), nhap('#sneakerName', 'A'), nhap('#brandName', 'Nike'), nhap('#sneakerImageUrl', 'not-a-url'), nhap('#retailPriceK', '1000'), LUU, cho(300)];
const DUNG = [cho(300), nhap('#sneakerName', 'Nike Pegasus 41'), nhap('#brandName', 'Nike Running'), doi('#sneakerCategory', 'Running'), nhap('#sneakerImageUrl', 'https://placehold.co/300x300?text=Pegasus'), nhap('#retailPriceK', '990'), tick('#isLimitedEdition'), LUU, cho(600)];
const SUA = [cho(500), nhap('#retailPriceK', '959'), LUU, cho(600)];
const XOA = () => [cho(400), click('#sneaker-row-10 .delete-btn'), cho(500)];

const KIEM = [
  // ───────── f1 — Task 1 · URL API trong .env (0.5đ) ─────────
  { nhom: 'f1', moTa: 'The API URL is read from .env (process.env.REACT_APP_… or import.meta.env.VITE_…)', kiem: 'ma-nguon', khop: 'process\\.env\\.REACT_APP_\\w+|import\\.meta\\.env\\.VITE_\\w+' },
  { nhom: 'f1', an: true, moTa: 'Sneakers are fetched from the .env URL: GET /sneakers', url: COL, kiem: 'goi-fetch', khop: `^GET ${API}$` },

  // ───────── f2 — Task 2 · Navbar + route (1.0đ) ─────────
  { nhom: 'f2', moTa: 'Navbar has a "Sneaker Collection" link to /se123456/sneaker-collection', url: MAN, kiem: 'ton-tai', selector: `nav a[href="${COL}"]` },
  { nhom: 'f2', moTa: 'Navbar has a "Sneaker Management" link to /se123456/sneaker-management', url: COL, kiem: 'ton-tai', selector: `nav a[href="${MAN}"]` },
  { nhom: 'f2', moTa: '/se123456/sneaker-collection renders 10 cards', url: COL, kiem: 'so-luong', selector: '.sneaker-card', giaTri: 10 },
  { nhom: 'f2', an: true, moTa: 'Clicking the navbar link opens Sneaker Management', url: COL, kiem: 'duong-dan', giaTri: MAN, truoc: [cho(300), click(`nav a[href="${MAN}"]`), cho(200)] },

  // ───────── f3 — Task 2 · Thẻ + sắp giảm dần (1.5đ) ─────────
  { nhom: 'f3', moTa: 'Cards sorted by sneakerName descending (Vans, Reebok, Puma, Nike, New Balance, DC, Converse, Charged, …)', url: COL, kiem: 'text', selector: 'body', khop: TOP8.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('[\\s\\S]*') },
  { nhom: 'f3', moTa: 'Each card shows the image (sneakerImageUrl)', url: COL, kiem: 'so-luong', selector: '.sneaker-card img', giaTri: 10 },
  { nhom: 'f3', moTa: 'First card (Vans Old Skool) shows brand + category', url: COL, kiem: 'text', selector: '.sneaker-card', tatCa: false, khop: 'Vans Old Skool[\\s\\S]*Vans Skateboarding[\\s\\S]*Skateboarding' },
  { nhom: 'f3', an: true, moTa: 'The image src is the record\'s sneakerImageUrl', url: COL, kiem: 'thuoc-tinh', selector: '.sneaker-card img', tatCa: false, thuocTinh: 'src', khop: 'placehold\\.co/300x300/1F2937|Vans' },

  // ───────── f4 — Task 2 · VND + Limited Edition (1.5đ) ─────────
  { nhom: 'f4', moTa: 'Price in VND format: Vans Old Skool 899 ⇒ "899,000 VND"', url: COL, kiem: 'text', selector: '.sneaker-card', tatCa: false, khop: 'Vans Old Skool[\\s\\S]*899,000 VND' },
  { nhom: 'f4', an: true, moTa: 'Every card shows a price ending in ",000 VND"', url: COL, kiem: 'text', selector: '.sneaker-card', khop: '\\d{3},000 VND' },
  { nhom: 'f4', moTa: 'Exactly the 4 limited sneakers show "Limited Edition"', url: COL, kiem: 'so-luong', selector: '.limited-badge', giaTri: 4 },
  { nhom: 'f4', an: true, moTa: 'Badge text is "Limited Edition"', url: COL, kiem: 'text', selector: '.limited-badge', khop: '^Limited Edition$' },

  // ───────── f5 — Task 3 · Bảng quản lý (1.5đ) ─────────
  { nhom: 'f5', moTa: 'Management table has 10 rows', url: MAN, kiem: 'so-luong', selector: '.sneaker-row', giaTri: 10 },
  { nhom: 'f5', moTa: 'Rows sorted by id ascending as NUMBERS (1 … 10, not 1, 10, 2)', url: MAN, kiem: 'danh-sach-text', selector: '.sneaker-id', mongDoi: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] },
  { nhom: 'f5', moTa: 'Row 2 shows name, brand, category', url: MAN, kiem: 'text', selector: '#sneaker-row-2', khop: 'Adidas OwnTheGame 3\\.0[\\s\\S]*Adidas Performance[\\s\\S]*Basketball' },
  { nhom: 'f5', moTa: 'Image rendered as a 70 × 70 thumbnail', url: MAN, kiem: 'thuoc-tinh', selector: '#sneaker-row-1 img', thuocTinh: 'width', khop: '^70(px)?$' },
  { nhom: 'f5', an: true, moTa: 'Thumbnail height is 70', url: MAN, kiem: 'thuoc-tinh', selector: '#sneaker-row-1 img', thuocTinh: 'height', khop: '^70(px)?$' },
  { nhom: 'f5', moTa: 'Every row has an Edit link and a Delete button', url: MAN, kiem: 'so-luong', selector: '.sneaker-row .edit-link, .sneaker-row .delete-btn', giaTri: 20 },

  // ───────── f6 — Task 3 · Xoá (1.0đ) ─────────
  { nhom: 'f6', moTa: 'Confirmed ⇒ DELETE /sneakers/10 and the list reloads (9 rows)', url: MAN, kiem: 'so-luong', selector: '.sneaker-row', giaTri: 9, truoc: XOA() },
  { nhom: 'f6', an: true, moTa: 'Confirmed ⇒ the record is gone on the server', url: MAN, kiem: 'du-lieu-server', bang: 'sneakers', doDai: 9, truoc: XOA() },
  { nhom: 'f6', moTa: 'Confirmed ⇒ a success notice (.success-msg) is shown', url: MAN, kiem: 'ton-tai', selector: '.success-msg', truoc: XOA() },
  { nhom: 'f6', moTa: 'Delete asks for confirmation first: cancelling it ⇒ no DELETE request', url: MAN, confirm: false, kiem: 'goi-fetch', khop: '^DELETE', min: 0, max: 0, truoc: XOA() },

  // ───────── f7 — Task 3 · Form thêm + kiểm hợp lệ (2.0đ) ─────────
  { nhom: 'f7', moTa: '"Add Sneaker" (#add-sneaker) leads to /se123456/add-sneaker', url: MAN, kiem: 'duong-dan', giaTri: ADD, truoc: [cho(300), click('#add-sneaker'), cho(200)] },
  { nhom: 'f7', moTa: 'Category select: empty default + the 5 categories', url: ADD, kiem: 'danh-sach-text', selector: '#sneakerCategory option', mongDoi: ['-- Select a category --', 'Running', 'Basketball', 'Lifestyle', 'Skateboarding', 'Training'] },
  { nhom: 'f7', an: true, moTa: 'Category default value is empty', url: ADD, kiem: 'thuoc-tinh-js', selector: '#sneakerCategory', thuocTinh: 'value', giaTri: '' },
  { nhom: 'f7', moTa: 'isLimitedEdition is a switch, unchecked by default', url: ADD, kiem: 'thuoc-tinh-js', selector: '#isLimitedEdition', thuocTinh: 'checked', giaTri: false },
  { nhom: 'f7', an: true, moTa: 'The switch is rendered as a Bootstrap form-switch', url: ADD, kiem: 'ton-tai', selector: '.form-switch #isLimitedEdition' },
  { nhom: 'f7', moTa: 'Invalid data ⇒ all 5 inputs marked invalid (name 1 char, brand 1 word, no category, bad URL, price 1000)', url: ADD, kiem: 'so-luong', selector: '#sneakerName.is-invalid, #brandName.is-invalid, #sneakerCategory.is-invalid, #sneakerImageUrl.is-invalid, #retailPriceK.is-invalid', giaTri: 5, truoc: SAI },
  { nhom: 'f7', an: true, moTa: 'Invalid data ⇒ no POST', url: ADD, kiem: 'goi-fetch', khop: '^POST', min: 0, max: 0, truoc: SAI },
  { nhom: 'f7', an: true, moTa: 'Price "0" is rejected (must be positive)', url: ADD, kiem: 'ton-tai', selector: '#retailPriceK.is-invalid', truoc: [cho(300), nhap('#retailPriceK', '0'), LUU, cho(200)] },
  { nhom: 'f7', an: true, moTa: 'Price "12.5" is rejected (must be an integer)', url: ADD, kiem: 'ton-tai', selector: '#retailPriceK.is-invalid', truoc: [cho(300), nhap('#retailPriceK', '12.5'), LUU, cho(200)] },
  { nhom: 'f7', moTa: 'Valid data ⇒ POST /sneakers with typed values (price Number, limited Boolean)', url: ADD, kiem: 'du-lieu-server', bang: 'sneakers', chua: { sneakerName: 'Nike Pegasus 41', brandName: 'Nike Running', sneakerCategory: 'Running', retailPriceK: 990, isLimitedEdition: true }, chat: true, truoc: DUNG },
  { nhom: 'f7', an: true, moTa: 'After adding ⇒ back on Sneaker Management', url: ADD, kiem: 'duong-dan', giaTri: MAN, truoc: DUNG },

  // ───────── f8 — Task 3 · Sửa (1.0đ) ─────────
  { nhom: 'f8', moTa: 'Edit link of row 1 ⇒ /se123456/edit-sneaker/1', url: MAN, kiem: 'duong-dan', giaTri: EDIT(1), truoc: [cho(400), click('#sneaker-row-1 .edit-link'), cho(200)] },
  { nhom: 'f8', moTa: 'Edit form pre-filled (sneakerName = Nike Revolution 7)', url: EDIT(1), kiem: 'thuoc-tinh-js', selector: '#sneakerName', thuocTinh: 'value', giaTri: 'Nike Revolution 7', truoc: [cho(500)] },
  { nhom: 'f8', an: true, moTa: 'Edit form pre-fills category + price', url: EDIT(1), kiem: 'thuoc-tinh-js', selector: '#sneakerCategory', thuocTinh: 'value', giaTri: 'Running', truoc: [cho(500)] },
  { nhom: 'f8', an: true, moTa: 'Edit applies the same validation (brand "Nike" rejected)', url: EDIT(1), kiem: 'ton-tai', selector: '#brandName.is-invalid', truoc: [cho(500), nhap('#brandName', 'Nike'), LUU, cho(200)] },
  { nhom: 'f8', moTa: 'Saving ⇒ PUT updates the server record (price 959)', url: EDIT(1), kiem: 'du-lieu-server', bang: 'sneakers', chua: { id: '1', retailPriceK: 959, sneakerName: 'Nike Revolution 7' }, truoc: SUA },
  { nhom: 'f8', an: true, moTa: 'The update request is PUT/PATCH /sneakers/1', url: EDIT(1), kiem: 'goi-fetch', khop: `^(PUT|PATCH) ${API}/1$`, min: 1, max: 1, truoc: SUA },
];

const THANG_DIEM = [
  ['T1 · API URL stored in .env', 0.5],
  ['T2 · Navbar + routes + fetch', 1.0],
  ['T2 · Card grid sorted by sneakerName (desc) with all fields', 1.5],
  ['T2 · VND price format + "Limited Edition" label', 1.5],
  ['T3 · Management table (id asc, 70×70 thumbnail, Edit/Delete)', 1.5],
  ['T3 · Delete with confirmation + notice + reload', 1.0],
  ['T3 · Add Sneaker form + validation + POST', 2.0],
  ['T3 · Edit Sneaker (pre-fill + validation + PUT)', 1.0],
].map(([ten, diem], i) => ({ ma: `f${i + 1}`, ten: `${i + 1}. ${ten}`, diem }));
const THANG_VI = [
  'T1 · URL API lưu trong .env',
  'T2 · Navbar + route + lấy dữ liệu',
  'T2 · Lưới thẻ xếp sneakerName giảm dần, đủ trường',
  'T2 · Giá dạng VND + nhãn "Limited Edition"',
  'T3 · Bảng quản lý (id tăng dần, ảnh 70×70, Edit/Delete)',
  'T3 · Xoá có xác nhận + thông báo + tải lại',
  'T3 · Form Add Sneaker + kiểm hợp lệ + POST',
  'T3 · Sửa (điền sẵn + kiểm hợp lệ + PUT)',
];

// ═════════════════════════════════════ ĐỀ ═════════════════════════════════════
const img = (ten, alt) => `<p><img src="${anh(ten)}" alt="${alt}" style="max-width:100%;height:auto;border:1px solid #d1d5db;border-radius:4px"></p>`;
const PRE_DB = `<pre>${esc(JSON.stringify(DB.sneakers.slice(0, 2), null, 2))}\n… (10 records — the full file is in the starter's mock API)</pre>`;
const SCHEMA = `<table><thead><tr><th>Field</th><th>Type</th></tr></thead><tbody>${[['id', 'Object ID'], ['sneakerName', 'String'], ['brandName', 'String'], ['sneakerCategory', 'String'], ['sneakerImageUrl', 'String'], ['retailPriceK', 'Number'], ['isLimitedEdition', 'Boolean']].map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join('')}</tbody></table>`;

const DE_EN = `<h1>PRACTICAL EXAMINATION</h1>
<p class="bi-phu">FER202 · SU26 PE — paper code FER202_PE_20060701 — Sneaker Collection (same paper as the Exam Room's PE17). Duration: 85 minutes.</p>
<p><b>INSTRUCTIONS:</b> You must not use any device to share data with other people. Use Visual Studio Code. Your work receives <b>0 points</b> if your code contains anything unrelated to the test, or if your code <b>does not store the API URL in the .env file</b>. You must use either Bootstrap or React-Bootstrap for UI styling (otherwise invalid, 0 points).</p>
<p><b>Project Setup</b> — create the app with <code>npx create-react-app</code> or <code>npm create vite@latest</code>, named after your roll number (e.g. se123456). The sneaker resource follows this schema:</p>
${SCHEMA}
<h3>Task 1 (0.5 point)</h3>
<p>The data must be taken from the given JSON file (sneaker_collection.json, 10 records) and stored on the mockapi tool; the API URL is stored in <code>.env</code>.</p>
${PRE_DB}
<h3>Task 2. Create the Sneaker Collection Page (4 points)</h3>
<ul>
  <li>Build a Navbar containing links to the following routes: Sneaker Collection, Sneaker Management.</li>
  <li>Implement the Sneaker Collection page at <code>/rollnumber/sneaker-collection</code> (e.g. <code>/se123456/sneaker-collection</code>): fetch all sneakers from the API and display them.</li>
  <li>Sort the sneaker list in <b>descending</b> alphabetical order by <code>sneakerName</code>.</li>
  <li>Present the sneakers in a card grid. Every card displays sneakerImageUrl, sneakerName, brandName, sneakerCategory, isLimitedEdition and retailPriceK.</li>
  <li><code>retailPriceK</code> holds the price in thousands of VND. Show it in VND format (e.g. 189 → <b>189,000 VND</b>).</li>
  <li>When <code>isLimitedEdition</code> is true, display the label "Limited Edition".</li>
</ul>
${img('fig1-collection', 'Sneaker Collection — Z→A by name')}
<h3>Task 3. Implement Sneaker Management (5.5 points)</h3>
<ul>
  <li>Sneaker Management page at <code>/rollnumber/sneaker-management</code>: show every sneaker record in a data table, sorted in <b>ascending</b> order by <code>id</code>.</li>
  <li>Each row displays id, sneakerName, brandName, sneakerCategory and sneakerImageUrl rendered as a <b>70 × 70</b> pixel thumbnail; provide an Edit link/icon and a Delete link/icon in each row.</li>
  <li>When the user clicks Delete, display a confirmation prompt before the sneaker is removed. After a successful delete request, notify the user and reload the list.</li>
  <li>An <b>Add Sneaker</b> button/link leads to <code>/rollnumber/add-sneaker</code>. Validate every input: all fields are mandatory; sneakerName ≥ 2 characters; brandName ≥ 2 words; sneakerImageUrl a valid URL; retailPriceK a positive integer of at most 3 digits; isLimitedEdition a <b>switch</b> (default false); sneakerCategory a select box with Running, Basketball, Lifestyle, Skateboarding, Training — default value <b>empty</b>.</li>
  <li><b>Edit</b> navigates to <code>/rollnumber/edit-sneaker/:id</code>; pre-fill the form with the current data; apply the same validation rules; after a successful update show the updated data in the Sneaker Management table.</li>
</ul>
${img('fig2-management', 'Sneaker Management — id ascending, 70×70 thumbnails')}
${img('fig3-add-errors', 'Add Sneaker — validation errors')}`;

const DE_VI = `<h1>BÀI THI THỰC HÀNH</h1>
<p class="bi-phu">FER202 · PE SU26 — mã đề FER202_PE_20060701 — Sneaker Collection (cùng đề PE17 ở Phòng thi). Thời gian: 85 phút.</p>
<p><b>QUY ĐỊNH:</b> không dùng thiết bị chia sẻ dữ liệu; dùng VS Code. <b>0 điểm</b> nếu mã có thứ không liên quan đề, hoặc <b>không lưu URL API trong tệp .env</b>. Bắt buộc dùng Bootstrap hoặc React-Bootstrap (không ⇒ 0 điểm).</p>
<p><b>Dựng project</b> bằng <code>npx create-react-app</code> hoặc <code>npm create vite@latest</code>, đặt tên theo MSSV (vd se123456). Lược đồ resource sneaker:</p>
${SCHEMA}
<h3>Task 1 (0,5 điểm)</h3>
<p>Lấy dữ liệu từ tệp JSON được phát (sneaker_collection.json, 10 bản ghi) đưa lên mockapi; URL API lưu trong <code>.env</code>.</p>
${PRE_DB}
<h3>Task 2. Trang Sneaker Collection (4 điểm)</h3>
<ul>
  <li>Navbar có link tới Sneaker Collection và Sneaker Management.</li>
  <li>Trang <code>/rollnumber/sneaker-collection</code> (vd <code>/se123456/sneaker-collection</code>): lấy mọi sneaker từ API và hiển thị.</li>
  <li>Xếp theo <code>sneakerName</code> <b>giảm dần</b> (Z → A).</li>
  <li>Lưới thẻ; mỗi thẻ có ảnh sneakerImageUrl, sneakerName, brandName, sneakerCategory, isLimitedEdition, retailPriceK.</li>
  <li><code>retailPriceK</code> là giá theo nghìn đồng — hiện dạng VND (189 → <b>189,000 VND</b>).</li>
  <li><code>isLimitedEdition</code> = true ⇒ hiện nhãn "Limited Edition".</li>
</ul>
${img('fig1-collection', 'Sneaker Collection')}
<h3>Task 3. Sneaker Management (5,5 điểm)</h3>
<ul>
  <li>Trang <code>/rollnumber/sneaker-management</code>: bảng mọi bản ghi, xếp <code>id</code> <b>tăng dần</b>; mỗi dòng có id, sneakerName, brandName, sneakerCategory, ảnh thu nhỏ <b>70 × 70</b>; mỗi dòng có Edit và Delete.</li>
  <li>Bấm Delete ⇒ hỏi xác nhận trước khi xoá; xoá xong báo người dùng và tải lại danh sách.</li>
  <li>Nút <b>Add Sneaker</b> tới <code>/rollnumber/add-sneaker</code>. Kiểm mọi ô: bắt buộc hết; sneakerName ≥ 2 ký tự; brandName ≥ 2 từ; sneakerImageUrl là URL hợp lệ; retailPriceK số nguyên dương tối đa 3 chữ số; isLimitedEdition là <b>switch</b> mặc định false; sneakerCategory là select 5 lựa chọn Running, Basketball, Lifestyle, Skateboarding, Training, mặc định <b>rỗng</b>.</li>
  <li><b>Edit</b> tới <code>/rollnumber/edit-sneaker/:id</code>; điền sẵn dữ liệu hiện tại; cùng luật kiểm; cập nhật xong bảng hiện dữ liệu mới.</li>
</ul>
${img('fig2-management', 'Sneaker Management')}
${img('fig3-add-errors', 'Add Sneaker — lỗi kiểm hợp lệ')}`;

const SEL = [
  ['.env · REACT_APP_API_URL', 'given in the starter: <code>REACT_APP_API_URL=http://localhost:9999/sneakers</code> — read it with <code>process.env.REACT_APP_API_URL</code>', 'cho sẵn trong starter: <code>REACT_APP_API_URL=http://localhost:9999/sneakers</code> — đọc bằng <code>process.env.REACT_APP_API_URL</code>'],
  ['/se123456/…', 'use the roll number <code>se123456</code> in every route', 'dùng MSSV <code>se123456</code> trong mọi route'],
  ['nav a[href]', 'navbar links are real <code>&lt;a href&gt;</code> (React Router <code>Link</code>/<code>NavLink</code> inside <code>&lt;nav&gt;</code>)', 'link navbar là <code>&lt;a href&gt;</code> thật (Link/NavLink của React Router trong <code>&lt;nav&gt;</code>)'],
  ['.sneaker-card · .sneaker-name · .limited-badge', 'one card per sneaker; the name element; the "Limited Edition" label', 'mỗi sneaker một thẻ; phần tử tên; nhãn "Limited Edition"'],
  ['.sneaker-row · #sneaker-row-&lt;id&gt; · .sneaker-id', 'one table row per sneaker (id = <code>sneaker-row-</code> + id); the id cell', 'mỗi sneaker một dòng (id = <code>sneaker-row-</code> + id); ô id'],
  ['.edit-link · .delete-btn · .success-msg · #add-sneaker', 'Edit link, Delete button, the delete notice, the Add Sneaker button/link', 'link Edit, nút Delete, thông báo đã xoá, nút/link Add Sneaker'],
  ['#sneakerName · #brandName · #sneakerCategory · #sneakerImageUrl · #retailPriceK · #isLimitedEdition · #save-sneaker', 'form inputs (Add + Edit) and the submit button; an invalid input gets the Bootstrap class <code>is-invalid</code> (React-Bootstrap <code>isInvalid</code>)', 'các ô form (Add + Edit) và nút gửi; ô sai mang class Bootstrap <code>is-invalid</code> (<code>isInvalid</code> của React-Bootstrap)'],
];
const codeLab = (lang) => {
  const vi = lang === 'vi';
  const r = (en, v) => (vi ? v : en);
  return `<hr>
<h2>${r('Code Lab — auto-grader notes (not part of the paper)', 'Code Lab — ghi chú cho máy chấm (KHÔNG thuộc tờ đề)')}</h2>
<p class="bi-chu-y">${r('In the exam the data lives on mockapi.io. Here the grader serves the same 10 records at <code>http://localhost:9999/sneakers</code> (ids are strings, like mockapi). The sandbox blocks external images (placehold.co), so the pictures may appear broken here — the grader checks the <code>&lt;img&gt;</code> elements, not the pixels.', 'Lúc thi dữ liệu nằm trên mockapi.io. Ở đây máy chấm phục vụ đúng 10 bản ghi ở <code>http://localhost:9999/sneakers</code> (id là chuỗi, như mockapi). Khung chạy chặn ảnh ngoài (placehold.co) nên ảnh có thể hiện vỡ — máy chấm kiểm thẻ <code>&lt;img&gt;</code>, không kiểm điểm ảnh.')}</p>
<h3>${r('Element ids / classes used by the auto-grader', 'id / class máy chấm dùng')}</h3>
<table><thead><tr><th>Selector</th><th>${r('Purpose', 'Vai trò')}</th></tr></thead><tbody>${SEL.map(([s, en, v]) => `<tr><td><code>${s}</code></td><td>${r(en, v)}</td></tr>`).join('')}</tbody></table>
<h3>${r('Auto-grader rubric (10 points, Run = sample checks · Submit = full rubric incl. hidden)', 'Thang điểm máy chấm (10 điểm, Chạy thử = kiểm mẫu · Nộp = chấm đủ, có kiểm ẩn)')}</h3>
<table><thead><tr><th>#</th><th>${r('Rubric line', 'Dòng điểm')}</th><th>${r('Marks', 'Điểm')}</th></tr></thead><tbody>${THANG_DIEM.map((t, i) => `<tr><td>${i + 1}</td><td>${esc(vi ? THANG_VI[i] : t.ten.replace(/^\d+\. /, ''))}</td><td>${t.diem}</td></tr>`).join('')}</tbody></table>`;
};

const YEU_CAU = [
  { en: 'The mock API is ready at <code>http://localhost:9999/sneakers</code>; its URL is in the starter\'s <code>.env</code> — never hard-code it.', vi: 'API giả sẵn ở <code>http://localhost:9999/sneakers</code>; URL nằm trong <code>.env</code> của starter — không gõ cứng trong mã.' },
  { en: 'The starter is a bare CRA entry (<code>.env</code>, <code>src/index.js</code>, <code>src/App.js</code>): add Bootstrap CSS, the router and the pages yourself.', vi: 'Starter là CRA trống (<code>.env</code>, <code>src/index.js</code>, <code>src/App.js</code>): tự thêm CSS Bootstrap, router và các trang.' },
  { en: 'Press <b>Run</b> for the sample checks, <b>Submit</b> for the full rubric (hidden checks included). Time yourself: 85 minutes.', vi: 'Bấm <b>Chạy thử</b> để chạy kiểm mẫu, <b>Nộp</b> để chấm đủ (có kiểm ẩn). Tự bấm giờ: 85 phút.' },
];

export default doiDau({
  slug: 'fer202-13-pe-8-sneaker-collection',
  ten: 'PE SU26 — Sneaker Collection (mã đề 20060701)',
  khoa: KHOA,
  baiHoc: 'fer202-pe17-su26-chua-tron-de',
  de: [
    {
      dangBai: 'pe',
      tieuDe: { en: 'PE SU26 — Sneaker Collection & Management (paper 20060701)', vi: 'Đề PE SU26 — Sneaker Collection & Management (mã đề 20060701)' },
      doKho: 'HARD',
      phut: 85,
      diem: 100,
      ngonNgu: 'javascript',
      khaiNiem: ['React Router v6', 'route param (:id)', '.env (REACT_APP_*)', 'axios CRUD', 'sort (localeCompare / numeric id)', 'Intl number format', 'controlled form', 'form validation', 'Form.Check switch', 'window.confirm'],
      tienQuyet: ['useState / useEffect', 'axios', 'React-Bootstrap / Bootstrap classes'],
      the: ['fer202', 'pe', 'router', 'mockapi', 'crud', 'validation'],
      moTa: { en: DE_EN + '\n' + codeLab('en'), vi: DE_VI + '\n' + codeLab('vi') },
      yeuCau: YEU_CAU,
      dauVao: { en: 'A CRA project (React 18, react-router-dom 6, react-bootstrap 2, axios) + .env with the API URL; mock API with the 10 sneakers.', vi: 'Dự án CRA (React 18, react-router-dom 6, react-bootstrap 2, axios) + .env chứa URL API; API giả có 10 sneaker.' },
      dauRa: { en: 'Sneaker Collection (card grid) + Sneaker Management (table, delete, add, edit) passing every rubric line.', vi: 'Sneaker Collection (lưới thẻ) + Sneaker Management (bảng, xoá, thêm, sửa) đạt mọi dòng điểm.' },
      rangBuoc: [
        { en: 'API URL only from <code>.env</code>; Bootstrap or React-Bootstrap for the UI.', vi: 'URL API chỉ lấy từ <code>.env</code>; giao diện bằng Bootstrap hoặc React-Bootstrap.' },
        { en: 'Routes exactly <code>/se123456/sneaker-collection</code>, <code>/se123456/sneaker-management</code>, <code>/se123456/add-sneaker</code>, <code>/se123456/edit-sneaker/:id</code>.', vi: 'Route đúng <code>/se123456/sneaker-collection</code>, <code>/se123456/sneaker-management</code>, <code>/se123456/add-sneaker</code>, <code>/se123456/edit-sneaker/:id</code>.' },
        { en: 'Store <code>retailPriceK</code> as a Number and <code>isLimitedEdition</code> as a Boolean.', vi: 'Lưu <code>retailPriceK</code> kiểu số và <code>isLimitedEdition</code> kiểu boolean.' },
      ],
      viDu: [
        { input: '/se123456/sneaker-collection', output: 'Vans Old Skool · Reebok BB 4000 II · Puma Disperse XT 3 · … (Z → A) — "899,000 VND", 4 "Limited Edition"', explanation: { en: 'Sorted by sneakerName descending; price ×1000 with thousands separators.', vi: 'Xếp sneakerName giảm dần; giá ×1000 có dấu phẩy nghìn.' } },
        { input: '/se123456/sneaker-management', output: 'ids 1, 2, 3, …, 10', explanation: { en: 'ids are strings — sort with Number(a.id) - Number(b.id), otherwise "10" comes right after "1".', vi: 'id là chuỗi — xếp bằng Number(a.id) - Number(b.id), không thì "10" đứng ngay sau "1".' } },
        { input: 'Add: name "A", brand "Nike", no category, URL "not-a-url", price 1000', output: '5 errors, nothing sent', explanation: { en: 'Name < 2 chars, brand 1 word, category empty, invalid URL, price > 3 digits.', vi: 'Tên < 2 ký tự, hãng 1 từ, chưa chọn loại, URL sai, giá > 3 chữ số.' } },
      ],
      goiY: [
        'api.js: const API_URL = process.env.REACT_APP_API_URL (Vite: import.meta.env.VITE_API_URL). Mọi lời gọi axios dùng API_URL và `${API_URL}/${id}`.',
        'Task 2: [...data].sort((a, b) => b.sneakerName.localeCompare(a.sneakerName)); giá: (priceK * 1000).toLocaleString("en-US") + " VND".',
        'Task 3: [...data].sort((a, b) => Number(a.id) - Number(b.id)); ảnh <img width={70} height={70} style={{ objectFit: "cover" }} />.',
        'Delete: if (!window.confirm(...)) return; await axios.delete(...); hiện thông báo; gọi lại hàm tải danh sách.',
        'Một component form cho cả Add và Edit: có :id thì GET rồi setForm (đổi giá thành chuỗi cho ô input), submit thì PUT, không thì POST; xong navigate về trang quản lý.',
        'Kiểm: brand.trim().split(/\\s+/).length >= 2; giá /^[1-9]\\d{0,2}$/; URL: try { new URL(v) } catch { lỗi }. Form.Check type="switch" cho isLimitedEdition.',
      ],
      loiHayGap: [
        'Gõ cứng URL mockapi trong mã ⇒ 0 điểm cả bài; phải để trong <code>.env</code> (CRA cần tiền tố REACT_APP_, Vite cần VITE_, sửa .env phải chạy lại npm start).',
        'Sắp id bằng so chuỗi ⇒ 1, 10, 2, 3…',
        'Hiện giá 899 thay vì "899,000 VND"; hoặc nhân 1000 nhưng không có dấu phẩy nghìn.',
        'Category mặc định là "Running" (đề yêu cầu rỗng) hoặc isLimitedEdition là checkbox thường/radio thay vì switch.',
        'Lưu retailPriceK dạng chuỗi "990" và isLimitedEdition dạng "true".',
        'Xoá không hỏi xác nhận, hoặc xoá xong không tải lại danh sách.',
      ],
      thuatNgu: [
        { en: 'environment variable (.env)', vi: 'biến môi trường — cấu hình nằm ngoài mã' },
        { en: 'mock API (mockapi.io)', vi: 'API giả dựng sẵn để thử front-end' },
        { en: 'thumbnail', vi: 'ảnh thu nhỏ' },
        { en: 'switch control', vi: 'nút gạt bật/tắt (Form.Check type="switch")' },
        { en: 'confirmation prompt', vi: 'hộp hỏi xác nhận trước khi xoá' },
        ...tn('routeParam', 'validate', 'rubric'),
      ],
      giaiThich: {
        en: '<p>All API calls go through one <code>api.js</code> that reads the URL from <code>.env</code>. The collection page sorts a COPY of the data Z→A by name and formats the price in thousands of VND; the management page sorts by numeric id (mockapi ids are strings). Delete is guarded by <code>window.confirm</code>, then shows a notice and re-fetches.</p><p>Add and Edit share one form component: with an <code>:id</code> it loads the record and pre-fills, validates with the same <code>validateSneaker</code>, and sends PUT instead of POST; values are converted back to a Number / Boolean before saving.</p>',
        vi: '<p>Mọi lời gọi API đi qua một <code>api.js</code> đọc URL từ <code>.env</code>. Trang collection xếp một BẢN SAO dữ liệu Z→A theo tên và định dạng giá theo nghìn đồng; trang quản lý xếp theo id dạng số (id của mockapi là chuỗi). Xoá có <code>window.confirm</code> chặn trước, rồi báo và tải lại.</p><p>Add và Edit dùng chung một component form: có <code>:id</code> thì tải bản ghi và điền sẵn, kiểm bằng cùng <code>validateSneaker</code>, gửi PUT thay vì POST; giá trị đổi lại về Number / Boolean trước khi lưu.</p>',
      },
      tests: { loai: 'react', phienBan: 1, tepChinh: 'src/index.js', thuVien: ['react-router-dom', 'react-bootstrap', 'bootstrap'], url: COL, jsonServer: { base: B, db: DB }, thangDiem: THANG_DIEM, kiem: KIEM, loiGiaiSauKhiDat: true },
      khoiDau: KHOI_DAU,
      loiGiai: LOI_GIAI,
      demo: { tepChinh: 'src/index.js', url: COL },
      thamKhao: 'https://create-react-app.dev/docs/adding-custom-environment-variables/',
    },
  ],
});
