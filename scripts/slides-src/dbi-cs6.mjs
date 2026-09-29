/**
 * dbi-cs6.mjs — DBI202 ⭐ Chuyên sâu 6: THIẾT KẾ CSDL THỰC CHIẾN (deck tự dựng, không có trong giáo trình trường).
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/dbi-cs6.mjs --out <dir>
 *
 * Mọi con số / thông báo lỗi trên slide lấy từ kết quả CHẠY THẬT:
 * flm-nguon/_repo/DBI202/gen/sql/cs6/*.sql (SQL Server — Azure SQL Edge, lõi 2019) và *.pg.sql (PostgreSQL 16).
 * SQL do Prisma sinh (slide 22) lấy từ `prisma migrate diff --from-empty --to-schema-datamodel … --script` (Prisma 5.22).
 */
import { lamDeck, code } from './_cs-chung.mjs';

export const deck = { key: 'cs6', code: 'CS6', title: 'Thiết kế CSDL thực chiến', sub: 'DBI202 · ⭐ Chuyên sâu' };

/* ───────────── khối nhỏ ───────────── */
const o = (html, cls = '') => `<div class="o ${cls}">${html}</div>`;
const bang = (rows, head, st = '') => `<table${st ? ` style="${st}"` : ''}><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`;
const pre = (txt, st = '') => `<pre style="margin:0;background:#f7f7f7;border:1.5px solid #d9d9d9;border-radius:8px;padding:9px 13px;font:15px/1.42 Menlo,Consolas,monospace;color:#262626;white-space:pre;overflow:hidden;${st}">${txt}</pre>`;
const loi = (txt) => `<span style="font:16px/1.35 Menlo,Consolas,monospace;color:#c0392b">${txt}</span>`;

/* ───────────── sơ đồ 4 tầng ───────────── */
const tang = (so, ten, y) => `<div style="flex:1;border:2px solid #e08a1e;border-radius:10px;background:#fff7ef;padding:10px 12px;text-align:center">
<div style="font-size:15px;color:#b85a2b;font-weight:700">TẦNG ${so}</div><div style="font-size:22px;font-weight:700;color:#262626">${ten}</div><div style="font-size:17px;color:#666;margin-top:4px">${y}</div></div>`;
const mui = `<div style="align-self:center;font-size:30px;color:#e08a1e">➜</div>`;

/* ───────────── ERD bằng SVG (ký hiệu chân quạ) ───────────── */
const HR = 26; // chiều cao một dòng cột
function hop(x, y, w, ten, cot, hl = false) {
  const h = 34 + cot.length * HR + 8;
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#fff" stroke="${hl ? '#c0392b' : '#b85a2b'}" stroke-width="2"/>`;
  s += `<rect x="${x}" y="${y}" width="${w}" height="34" rx="8" fill="${hl ? '#c0392b' : '#e08a1e'}"/><rect x="${x}" y="${y + 20}" width="${w}" height="14" fill="${hl ? '#c0392b' : '#e08a1e'}"/>`;
  s += `<text x="${x + w / 2}" y="${y + 23}" text-anchor="middle" font-size="18" font-weight="700" fill="#fff">${ten}</text>`;
  cot.forEach(([k, c], i) => {
    const yy = y + 34 + (i + 1) * HR - 7;
    if (k) s += `<text x="${x + 10}" y="${yy}" font-size="13" font-weight="700" fill="${k.startsWith('PK') ? '#c0392b' : '#2f7d4f'}">${k}</text>`;
    s += `<text x="${x + 58}" y="${yy}" font-size="15" fill="#262626">${c}</text>`;
  });
  return s;
}
/** Đường nối ngang/dọc: đầu "một" (hai vạch) ở (x1,y1), đầu "nhiều" (chân quạ) ở (x2,y2). */
function noi(x1, y1, x2, y2, { tuyChon = false } = {}) {
  const ngang = y1 === y2;
  const d = ngang ? Math.sign(x2 - x1) : Math.sign(y2 - y1);
  let s = `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#595959" stroke-width="2"/>`;
  // đầu "một": vạch đứng (hoặc vòng tròn nếu 0..1)
  if (ngang) {
    s += `<line x1="${x1 + d * 10}" y1="${y1 - 9}" x2="${x1 + d * 10}" y2="${y1 + 9}" stroke="#595959" stroke-width="2"/>`;
    s += tuyChon ? `<circle cx="${x1 + d * 20}" cy="${y1}" r="6" fill="#fff" stroke="#595959" stroke-width="2"/>` : `<line x1="${x1 + d * 16}" y1="${y1 - 9}" x2="${x1 + d * 16}" y2="${y1 + 9}" stroke="#595959" stroke-width="2"/>`;
    s += `<line x1="${x2}" y1="${y2 - 11}" x2="${x2 - d * 16}" y2="${y2}" stroke="#595959" stroke-width="2"/><line x1="${x2}" y1="${y2 + 11}" x2="${x2 - d * 16}" y2="${y2}" stroke="#595959" stroke-width="2"/>`;
  } else {
    s += `<line x1="${x1 - 9}" y1="${y1 + d * 10}" x2="${x1 + 9}" y2="${y1 + d * 10}" stroke="#595959" stroke-width="2"/><line x1="${x1 - 9}" y1="${y1 + d * 16}" x2="${x1 + 9}" y2="${y1 + d * 16}" stroke="#595959" stroke-width="2"/>`;
    s += `<line x1="${x2 - 11}" y1="${y2}" x2="${x2}" y2="${y2 - d * 16}" stroke="#595959" stroke-width="2"/><line x1="${x2 + 11}" y1="${y2}" x2="${x2}" y2="${y2 - d * 16}" stroke="#595959" stroke-width="2"/>`;
  }
  return s;
}
const nhanDuong = (x, y, t) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="14" font-style="italic" fill="#7f7f7f">${t}</text>`;

function erd() {
  let s = '';
  s += hop(10, 10, 262, 'khach_hang', [['PK', 'id'], ['', 'ho_ten'], ['UQ*', 'so_dien_thoai'], ['', 'created_at'], ['', 'deleted_at']]);
  s += hop(418, 10, 290, 'lich_hen', [['PK', 'id'], ['FK', 'khach_hang_id'], ['FK', 'nhan_vien_id (NULL)'], ['', 'bat_dau, ket_thuc'], ['', 'trang_thai'], ['', 'created_at']], true);
  s += hop(856, 10, 244, 'nhan_vien', [['PK', 'id'], ['', 'ho_ten'], ['', 'dang_lam']]);
  s += hop(418, 262, 290, 'lich_hen_dich_vu', [['PK FK', 'lich_hen_id'], ['PK FK', 'dich_vu_id'], ['', 'gia_luc_dat']]);
  s += hop(856, 262, 244, 'dich_vu', [['PK', 'id'], ['UQ', 'ten'], ['', 'gia'], ['', 'thoi_luong_phut']]);
  s += hop(10, 262, 262, 'thanh_toan', [['PK', 'id'], ['FK', 'lich_hen_id'], ['', 'so_tien'], ['', 'phuong_thuc'], ['', 'luc_tra']]);
  s += noi(272, 60, 418, 60) + nhanDuong(345, 50, 'đặt');
  s += noi(856, 60, 708, 60, { tuyChon: true }) + nhanDuong(782, 50, 'phục vụ');
  s += noi(563, 212, 563, 262) + nhanDuong(610, 243, 'gồm');
  s += noi(856, 312, 708, 312) + nhanDuong(782, 302, 'được đặt');
  // lich_hen 1 — N thanh_toan: đường gấp khúc
  s += `<polyline points="418,180 345,180 345,312 272,312" fill="none" stroke="#595959" stroke-width="2"/>`;
  s += `<line x1="408" y1="171" x2="408" y2="189" stroke="#595959" stroke-width="2"/><line x1="402" y1="171" x2="402" y2="189" stroke="#595959" stroke-width="2"/>`;
  s += `<line x1="272" y1="301" x2="288" y2="312" stroke="#595959" stroke-width="2"/><line x1="272" y1="323" x2="288" y2="312" stroke="#595959" stroke-width="2"/>`;
  s += nhanDuong(376, 250, 'trả');
  return `<svg viewBox="0 0 1110 440" width="100%" style="max-height:440px" font-family="Arial, sans-serif">${s}</svg>`;
}

/* ───────────── mini ERD n-n ───────────── */
function erdNN() {
  let s = '';
  s += hop(0, 10, 200, 'lich_hen', [['PK', 'id'], ['', 'khach']]);
  s += hop(290, 10, 250, 'lich_hen_dich_vu', [['PK FK', 'lich_hen_id'], ['PK FK', 'dich_vu_id'], ['', 'so_luong'], ['', 'gia_luc_dat']], true);
  s += hop(630, 10, 200, 'dich_vu', [['PK', 'id'], ['', 'ten'], ['', 'gia']]);
  s += noi(200, 60, 290, 60) + noi(630, 60, 540, 60);
  return `<svg viewBox="0 0 840 170" width="100%" style="max-height:170px" font-family="Arial, sans-serif">${s}</svg>`;
}

export const slides = lamDeck('THIẾT KẾ CSDL THỰC CHIẾN', [
  /* 1 */
  { cover: true, t: 'Thiết kế CSDL thực chiến', sub: 'Từ yêu cầu tới CREATE TABLE · khoá · kiểu dữ liệu · xoá mềm · lịch sử<br>ràng buộc · migration &amp; Prisma · một case study trọn vẹn<br>SQL Server &amp; PostgreSQL — mọi kết quả đều chạy thật' },

  /* 2 */
  { t: 'Bốn tầng thiết kế: từ yêu cầu tới đĩa', body: `<div style="display:flex;gap:10px">
${tang(1, 'Yêu cầu', 'nghiệp vụ, quy tắc,<br>câu hỏi cần trả lời')}${mui}
${tang(2, 'ERD khái niệm', 'thực thể, liên kết,<br>bản số (1-N, N-N)')}${mui}
${tang(3, 'Lược đồ logic', 'bảng, khoá, khoá ngoại,<br>chuẩn hoá tới 3NF')}${mui}
${tang(4, 'Vật lý', 'kiểu dữ liệu, index,<br>ràng buộc, engine')}</div>
${bang([
    ['2 → 3', 'Khoá chính tự nhiên hay thay thế? Bảng nối có id riêng không?', '4–7'],
    ['3 → 4', 'Tiền, giờ, chữ tiếng Việt lưu bằng kiểu gì? Tên đặt thế nào?', '8–11'],
    ['Vòng đời dữ liệu', 'Xoá thật hay xoá mềm? Ai sửa, lúc nào, giá cũ bao nhiêu?', '12–14'],
    ['Quan hệ khó', 'N-N có thuộc tính, đa hình, EAV/JSON, phi chuẩn hoá', '15–18'],
    ['Luật &amp; thay đổi', 'Ràng buộc, hành động khoá ngoại, migration, Prisma', '19–22'],
  ], ['Chặng', 'Câu hỏi thầy / người phỏng vấn hay hỏi “vì sao em chọn thế?”', 'Slide'], 'font-size:19px')}
<p class="nho">Xưởng ERD (Chương 3) đã luyện tầng 2–3. Deck này đi tiếp: các quyết định ở tầng 3–4 mà giáo trình không nói tới.</p>` },

  /* 3 */
  { t: 'Đọc yêu cầu: case study “Salon Mây”', body: `${bang([
    ['Khách <b>đặt lịch</b> với một thợ, chọn <b>một hoặc nhiều</b> dịch vụ', 'bảng nối N-N <code>lich_hen_dich_vu</code>', '15'],
    ['Giá dịch vụ <b>đổi theo mùa</b>', 'chốt <code>gia_luc_dat</code> trong bảng nối; lịch sử giá', '14, 15'],
    ['Một thợ <b>không được có hai lịch trùng giờ</b>', 'EXCLUDE (PostgreSQL) / trigger (SQL Server)', '19'],
    ['Thu tiền <b>nhiều lần</b> (cọc + phần còn lại)', 'bảng <code>thanh_toan</code> 1-N, kiểu DECIMAL', '9'],
    ['Khách ở TP.HCM, máy chủ đặt giờ UTC', '<code>timestamptz</code> / <code>datetimeoffset</code>', '10'],
    ['Khách xin xoá tài khoản, <b>doanh thu cũ vẫn phải giữ</b>', 'xoá mềm + unique có lọc', '12'],
    ['Thợ nghỉ việc, lịch cũ vẫn còn', '<code>ON DELETE SET NULL</code>', '20'],
  ], ['Câu trong yêu cầu', 'Quyết định thiết kế', 'Slide'], 'font-size:19px')}
${o('Gạch chân <b>danh từ</b> → thực thể; <b>động từ</b> → liên kết; mỗi câu “<b>không được</b> / <b>phải</b>” → một <span class="do">ràng buộc</span>. Chỗ mơ hồ thì <b>hỏi lại</b>: huỷ lịch có tính phí không? một lịch có nhiều thợ không?')}` },

  /* 4 */
  { t: 'Khoá tự nhiên hay khoá thay thế?', body: `<div class="hai"><div>${bang([
    ['Ví dụ', 'SĐT, email, CCCD, mã SV', '<code>id</code> tự tăng / UUID'],
    ['Có nghĩa ngoài đời', 'có', 'không'],
    ['Có thể <b>đổi</b>', '<span class="do">có</span> (đổi số, đổi email)', 'không bao giờ'],
    ['Độ rộng', 'thường dài (VARCHAR)', '4–16 byte'],
    ['Lộ thông tin qua URL', 'có', 'id tăng dần: lộ số lượng'],
  ], ['', 'Tự nhiên (natural)', 'Thay thế (surrogate)'], 'font-size:19px')}</div>
<div>${code(`-- PK = so_dien_thoai, lich_hen tham chiếu nó
UPDATE khach_hang SET so_dien_thoai = '0987654321'
WHERE so_dien_thoai = '0901111111';`, 'sql')}
<ul style="font-size:20px;margin-top:10px">
<li>SQL Server: ${loi('Msg 547 … REFERENCE constraint "fk_lich_hen_khach_hang"')} — khách <b>không đổi được số</b></li>
<li>PostgreSQL + <code>ON UPDATE CASCADE</code>: được, nhưng <b>ghi lại mọi dòng con</b> (2 lịch hẹn)</li>
</ul></div></div>
${o('Quy tắc thực chiến: <b>khoá chính = khoá thay thế</b>; khoá tự nhiên vẫn giữ, nhưng làm <code>UNIQUE NOT NULL</code>. Khoá tự nhiên chỉ hợp khi giá trị <b>thật sự bất biến</b> (mã tiền tệ <code>VND</code>, mã quốc gia).', 'xanh')}` },

  /* 5 */
  { t: 'IDENTITY, SEQUENCE hay UUID?', body: `${bang([
    ['Tự tăng trong bảng', '<code>INT IDENTITY(1,1)</code>', '<code>GENERATED ALWAYS AS IDENTITY</code> (bản 10+) — <code>SERIAL</code> là kiểu cũ'],
    ['Bộ đếm dùng chung', '<code>CREATE SEQUENCE</code> (2012+)', '<code>CREATE SEQUENCE</code>, <code>nextval()</code>'],
    ['UUID ngẫu nhiên (v4)', '<code>NEWID()</code>', '<code>gen_random_uuid()</code> (bản 13+)'],
    ['UUID tăng dần', '<code>NEWSEQUENTIALID()</code> — chỉ dùng trong DEFAULT', '<code>uuidv7()</code> (bản 18)'],
  ], ['Nhu cầu', 'SQL Server', 'PostgreSQL'], 'font-size:19px')}
<div class="hai"><ul style="font-size:21px">
<li>Kích thước đo thật: <b>INT 4</b> · <b>BIGINT 8</b> · <b>UUID 16</b> byte</li>
<li>Chèn 3 dòng, <code>ROLLBACK</code> dòng thứ 3, chèn tiếp ⇒ id <b class="do">1, 2, 4</b> trên <b>cả hai</b> hệ: số đã cấp không trả lại</li>
<li>⇒ đừng dùng id làm <b>số hoá đơn liên tục</b></li>
</ul><ul style="font-size:21px">
<li>Chọn <b>UUID</b> khi: sinh id ở client/offline, gộp dữ liệu nhiều nguồn, không muốn lộ <code>/orders/1043</code></li>
<li>Chọn <b>INT/BIGINT</b> khi: bảng nội bộ, cần nhỏ và nhanh</li>
<li><code>ALWAYS</code> chặn tự gõ id: ${loi('cannot insert a non-DEFAULT value into column "id"')}</li>
</ul></div>` },

  /* 6 */
  { t: 'UUID v4 hay v7: thứ tự khoá quyết định index', body: `<ul style="font-size:21px">
<li><b>v4</b>: 122 bit ngẫu nhiên ⇒ khoá mới rơi vào <b>giữa</b> cây B+ ⇒ tách trang liên tục (CS.3 slide 20)</li>
<li><b>v7</b> (RFC 9562, 2024): <b>48 bit đầu = mốc thời gian mili-giây</b> + phần ngẫu nhiên ⇒ khoá mới luôn ở <b>cuối</b> cây. ULID: cùng ý tưởng, 26 ký tự</li>
</ul>
<div class="hai">${bang([
    ['INT IDENTITY', '282', '0,4%', '99,0%'],
    ['NEWSEQUENTIALID()', '313', '0,3%', '98,7%'],
    ['UUID v4', '<b class="do">456</b>', '<b class="do">98,5%</b>', '67,7%'],
    ['UUID v7 (từ ứng dụng)', '<b class="do">456</b>', '<b class="do">98,5%</b>', '67,7%'],
  ], ['SQL Server · 20.000 dòng', 'Trang lá', 'Phân mảnh', 'Độ đầy'], 'font-size:18px')}
${bang([
    ['INT', '55', '0%', '89,5%'],
    ['UUID v4', '<b class="do">92</b>', '<b class="do">46,7%</b>', '75,1%'],
    ['UUID v7', '77', '0%', '89,6%'],
  ], ['PostgreSQL · index PK', 'Trang lá', 'Phân mảnh', 'Độ đầy'], 'font-size:18px')}</div>
${o('Bẫy riêng của SQL Server: <code>uniqueidentifier</code> được sắp theo <b>6 byte CUỐI</b> trước ⇒ UUID v7 sinh ở ứng dụng <b>vẫn phân mảnh như v4</b>. Trên SQL Server dùng <code>NEWSEQUENTIALID()</code> hoặc INT/BIGINT; trên PostgreSQL v7 tốt gần bằng INT.', 'do2')}` },

  /* 7 */
  { t: 'Khoá ghép (composite key)', body: `<div class="hai"><div>${code(`CREATE TABLE lich_hen_dv_b (
  lich_hen_id INT NOT NULL,
  dich_vu_id  INT NOT NULL,
  CONSTRAINT pk_lich_hen_dv_b
    PRIMARY KEY (lich_hen_id, dich_vu_id)
);`, 'sql')}
${bang([['A: chỉ có <code>id</code> tự tăng', '(1,7) chèn 2 lần — <b class="do">nhận cả hai</b>'], ['B: PK ghép', loi('Msg 2627 … duplicate key value is (1, 7)')]], ['Thiết kế', 'Chèn cặp (1, 7) hai lần'], 'margin-top:12px;font-size:19px')}</div>
<ul style="font-size:21px">
<li>Hợp với: <b>bảng nối N-N</b>, <b>thực thể yếu</b> (khoá cha + số thứ tự)</li>
<li>Bảng nối <b>có id riêng</b> khi bị bảng khác tham chiếu, hoặc ORM/URL cần một id — khi đó <span class="do">vẫn phải</span> <code>UNIQUE(a, b)</code></li>
<li>PK <code>(a, b)</code> tìm nhanh theo <code>a</code>, <b>không</b> theo <code>b</code> (tiền tố trái) ⇒ thêm index <code>(b)</code></li>
<li>Khoá ngoại tới khoá ghép phải mang <b>đủ các cột</b></li>
<li>Prisma: <code>@@id([lichHenId, dichVuId])</code> · <code>@@unique([a, b])</code></li>
</ul></div>` },

  /* 8 */
  { t: 'Quy ước đặt tên', body: `${bang([
    ['Bảng số ít / số nhiều', '<code>khach_hang</code> · <code>users</code>', 'Chọn <b>một</b> kiểu cho cả CSDL (deck này: số ít, giống tên thực thể)'],
    ['snake_case / PascalCase', '<code>khach_hang</code> · <code>KhachHang</code>', 'PostgreSQL: <b>snake_case</b> (tên không ngoặc bị hạ chữ thường)'],
    ['Tên ràng buộc', '<code>pk_</code> <code>fk_con_cha</code> <code>uq_</code> <code>ck_</code> <code>ix_</code> <code>df_</code>', '<b>Luôn đặt tên</b> — nó hiện ra trong thông báo lỗi'],
    ['Cột khoá ngoại', '<code>khach_hang_id</code>', '<code>&lt;bảng cha&gt;_id</code>, cùng kiểu với khoá cha'],
  ], ['Quyết định', 'Ví dụ', 'Khuyên'], 'font-size:18px')}
<div class="hai"><div>${pre(`CREATE TABLE "KhachHang" ("maKH" INT PRIMARY KEY);
SELECT maKH FROM KhachHang;`)}
<p style="font-size:18px;margin-top:6px">${loi('ERROR: relation "khachhang" does not exist')}<br><span class="nho">⇒ tạo bằng ngoặc kép thì phải gõ ngoặc kép mãi mãi</span></p></div>
<div><p style="font-size:19px">SQL Server, CHECK không tên:</p>${loi('CK__don_a__tong_tien__3E379993')}
<p style="font-size:19px;margin-top:6px">CHECK có tên:</p>${loi('ck_don_b_tong_tien_khong_am')}
<p class="nho" style="margin-top:6px">Prisma: <code>model KhachHang</code> + <code>@@map("khach_hang")</code>, <code>hoTen @map("ho_ten")</code></p></div></div>` },

  /* 9 */
  { t: 'Tiền: DECIMAL, không bao giờ FLOAT', body: `<div class="hai"><div>${bang([
    ['Cộng 10 lần 0,1 (FLOAT)', '<b class="do">0.9999999999999999</b>', '≠ 1'],
    ['Cộng 10 lần 0,1 (DECIMAL)', '<b>1.00</b>', '= 1'],
    ['0,1 + 0,2 (FLOAT)', '<b class="do">0.30000000000000004</b>', 'cả hai hệ'],
    ['MONEY: 1 / 3 × 3', '0.9999', 'SQL Server'],
    ['100.000 / 3 (làm tròn) × 3', '99999', 'thiếu 1 đồng'],
  ], ['Phép tính (chạy thật)', 'Kết quả', ''], 'font-size:19px')}</div>
<ul style="font-size:21px">
<li><b>FLOAT</b> = số nhị phân <b>xấp xỉ</b> (IEEE 754): 0,1 không biểu diễn đúng được</li>
<li><b>DECIMAL(p, s)</b> = NUMERIC: thập phân <b>chính xác</b></li>
<li>VND không có số lẻ: <code>DECIMAL(12,0)</code>–<code>(15,0)</code> hoặc BIGINT; ngoại tệ: <code>DECIMAL(19,4)</code></li>
<li>Chia tiền phải <b>quy định</b> ai chịu phần lẻ</li>
<li>Tránh cả <code>MONEY</code> (SQL Server) và <code>money</code> (PostgreSQL, phụ thuộc <code>lc_monetary</code>)</li>
</ul></div>
${o('Prisma: <code>Decimal @db.Decimal(12, 0)</code> ⇒ JavaScript nhận đối tượng <b>Decimal</b>, không phải <code>number</code> — đừng ép sang <code>number</code> rồi cộng.', 'xanh')}` },

  /* 10 */
  { t: 'Thời gian &amp; múi giờ', body: `<div class="hai"><div>${bang([
    ['Asia/Ho_Chi_Minh', '09:00:00', '09:00:00<b>+07</b>'],
    ['UTC', '<b class="do">09:00:00</b>', '02:00:00+00'],
    ['America/New_York', '<b class="do">09:00:00</b>', '14/03 22:00:00-04'],
  ], ['Múi giờ phiên (PostgreSQL)', '<code>timestamp</code>', '<code>timestamptz</code>'], 'font-size:18px')}
<p class="nho" style="margin-top:6px">Cùng một lịch hẹn “09:00 giờ VN”. <code>timestamp</code> <b>vứt</b> phần +07 ⇒ đọc ở đâu cũng ra 09:00 — sai ở mọi nơi khác VN.</p></div>
<div>${bang([
    ['<code>DATETIME</code> (cũ)', "'…23:59:59.999' ⇒ <b class=\"do\">2025-01-01 00:00:00</b>"],
    ['<code>DATETIME2</code>', '23:59:59.9990000'],
    ['<code>DATETIMEOFFSET</code>', "'09:00 +07:00' <b>=</b> '02:00 +00:00'"],
  ], ['SQL Server', 'Đo thật'], 'font-size:18px')}</div></div>
<ul style="font-size:21px">
<li><b>Thời điểm</b> (lịch hẹn, thanh toán): <code>timestamptz</code> / <code>datetimeoffset</code> (hoặc <code>datetime2</code> quy ước <b>luôn UTC</b>)</li>
<li><b>Ngày thuần</b> (sinh nhật): <code>DATE</code> · không dùng <code>DATETIME</code> cho bảng mới (làm tròn 1/300 giây)</li>
<li>Prisma: <code>DateTime</code> mặc định là <code>timestamp(3)</code> <span class="do">không múi giờ</span> ⇒ thêm <code>@db.Timestamptz(3)</code></li>
<li><code>AT TIME ZONE</code> có từ SQL Server 2016, nhưng <b>Azure SQL Edge</b> (bản dùng ở đây) không chạy được — thiếu CLR</li>
</ul>` },

  /* 11 */
  { t: 'Chuỗi Unicode: tiếng Việt không được thành “?”', body: `${bang([
    ["<code>VARCHAR</code> (bảng mã 1252)", "N'Nguyễn Thị Ánh'", '<b class="do">Nguy?n Th? Ánh</b>', '—'],
    ['<code>NVARCHAR</code> (UTF-16)', "N'Nguyễn Thị Ánh'", 'Nguyễn Thị Ánh', '28 byte'],
    ['<code>NVARCHAR</code>', "'Nguyễn Thị Ánh' <b>(quên N)</b>", '<b class="do">Nguy?n Th? Ánh</b>', '—'],
    ['<code>VARCHAR … _UTF8</code> (2019+)', "N'Nguyễn Thị Ánh'", 'Nguyễn Thị Ánh', '19 byte'],
    ['PostgreSQL <code>text</code>/<code>varchar</code>', "'Nguyễn Thị Ánh'", 'Nguyễn Thị Ánh', '19 byte, 14 ký tự'],
  ], ['Cột (SQL Server trừ dòng cuối)', 'Giá trị chèn', 'Đọc ra', 'Dung lượng'], 'font-size:18px')}
<div class="hai"><ul style="font-size:21px">
<li>SQL Server: <b>NVARCHAR</b> + chữ <b>N'…'</b> — thiếu một trong hai là mất dấu, <span class="do">không báo lỗi</span></li>
<li>Dấu “?” đã ghi vào đĩa thì <b>không</b> khôi phục được</li>
</ul><ul style="font-size:21px">
<li><code>VARCHAR(n)</code> SQL Server: n = <b>byte</b>; <code>NVARCHAR(n)</code>: n = cặp byte</li>
<li>PostgreSQL: mọi chuỗi là UTF-8, <code>varchar(n)</code> đếm <b>ký tự</b> (<code>'Nguyễn'::varchar(6)</code> vừa khít)</li>
</ul></div>` },

  /* 12 */
  { t: 'Xoá mềm (soft delete) và cái giá của nó', body: `<div class="hai"><div>${code(`-- cột deleted_at DATETIME2(0) NULL: NULL = còn sống
-- "xoá" = đóng dấu giờ, dòng vẫn còn
UPDATE khach_hang SET deleted_at = SYSUTCDATETIME()
WHERE id = 1;
-- unique CHỈ trong các dòng còn sống
CREATE UNIQUE INDEX uq_khach_hang_email_con
  ON khach_hang(email) WHERE deleted_at IS NULL;`, 'sql')}
${bang([
    ['UNIQUE thường', loi('Msg 2601 … duplicate (an@mail.vn)')],
    ['Unique có lọc', 'đăng ký lại <b>được</b>; 2 dòng còn sống vẫn bị chặn'],
  ], ['Xoá mềm rồi đăng ký lại', 'Kết quả'], 'margin-top:10px;font-size:18px')}</div>
<ul style="font-size:21px">
<li>Vì sao: giữ doanh thu/lịch sử, khôi phục khi xoá nhầm, khoá ngoại không gãy</li>
<li>Giá 1: <b>mọi</b> truy vấn phải nhớ <code>WHERE deleted_at IS NULL</code> ⇒ tạo <b>view</b> <code>khach_hang_con</code></li>
<li>Giá 2: UNIQUE phải thành <b>filtered</b> (SQL Server) / <b>partial</b> (PostgreSQL) index</li>
<li>Giá 3: bảng phình, index to dần; khoá ngoại vẫn trỏ vào dòng “đã xoá”</li>
<li>Giá 4: luật về dữ liệu cá nhân có thể đòi <b>xoá thật</b> hoặc ẩn danh hoá</li>
<li>Prisma 5.22 không khai được partial index ⇒ viết tay trong <code>migration.sql</code></li>
</ul></div>` },

  /* 13 */
  { t: 'created_at, updated_at: ai điền, lúc nào?', body: `<div class="hai"><div>${code(`-- PostgreSQL: hàm trigger + trigger BEFORE
CREATE FUNCTION dat_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END $$;
CREATE TRIGGER trg_dich_vu_updated_at
  BEFORE UPDATE ON dich_vu
  FOR EACH ROW EXECUTE FUNCTION dat_updated_at();`, 'sql')}</div>
<div>${bang([
    ['<code>created_at</code>', '<code>DEFAULT SYSUTCDATETIME()</code>', '<code>DEFAULT now()</code>'],
    ['<code>updated_at</code>', 'trigger <b>AFTER UPDATE</b> JOIN <code>inserted</code>', 'trigger <b>BEFORE UPDATE</b> sửa <code>NEW</code>'],
  ], ['Cột', 'SQL Server', 'PostgreSQL'], 'font-size:18px')}
${bang([['Cắt tóc (vừa sửa giá)', 'updated_at <b>mới hơn</b>'], ['Gội đầu (không sửa)', 'updated_at = created_at']], ['Dòng', 'Đo thật, cả hai hệ'], 'margin-top:10px;font-size:18px')}
<ul style="font-size:19px;margin-top:8px">
<li>Prisma <code>@updatedAt</code>: <b>Prisma Client</b> điền, cột <span class="do">không có DEFAULT</span> trong CSDL ⇒ SQL tay/app khác không cập nhật</li>
<li><code>now()</code> của PostgreSQL = giờ <b>bắt đầu giao dịch</b></li>
</ul></div></div>` },

  /* 14 */
  { t: 'Lịch sử thay đổi: temporal table &amp; bảng lịch sử', body: `<div class="hai"><div>${code(`CREATE TABLE dbo.dich_vu (
  id  INT PRIMARY KEY, ten NVARCHAR(100), gia DECIMAL(12,0),
  hieu_luc_tu  DATETIME2 GENERATED ALWAYS AS ROW START,
  hieu_luc_den DATETIME2 GENERATED ALWAYS AS ROW END,
  PERIOD FOR SYSTEM_TIME (hieu_luc_tu, hieu_luc_den)
) WITH (SYSTEM_VERSIONING = ON
       (HISTORY_TABLE = dbo.dich_vu_lich_su));`, 'sql')}
${bang([['<code>FOR SYSTEM_TIME ALL</code>', '100000 · 120000 · <b>150000</b> (hiện tại)'], ['<code>FOR SYSTEM_TIME AS OF @moc</code>', '<b>120000</b> — giá lúc đó'], ['<code>DELETE</code> bảng lịch sử', loi('Msg 13560 Cannot delete rows…')]], ['SQL Server (đo thật)', 'Kết quả'], 'margin-top:8px;font-size:17px')}</div>
<div><ul style="font-size:20px">
<li><b>Temporal table</b> (chuẩn SQL:2011, SQL Server 2016+): engine tự chép dòng cũ sang bảng lịch sử — chạy được trên Azure SQL Edge</li>
<li>PostgreSQL chưa có sẵn ⇒ <b>trigger</b> ghi <code>to_jsonb(OLD)</code> vào bảng lịch sử:</li>
</ul>${bang([['1', 'UPDATE', '{"gia":100000,…}'], ['2', 'UPDATE', '{"gia":120000,…}'], ['3', 'DELETE', '{"gia":150000,…}']], ['id', 'thao_tac', 'du_lieu_cu'], 'font-size:17px;margin-top:8px')}
${o('Audit = <b>ai</b> sửa, <b>lúc nào</b>, <b>giá trị cũ</b>. Hỏi trước: có cần tra “giá tại ngày X” không? Nếu có — lưu lịch sử ngay từ đầu, không bù lại được.', 'xanh')}</div></div>` },

  /* 15 */
  { t: 'Quan hệ N-N có thuộc tính', body: `${erdNN()}
<div class="hai"><ul style="font-size:21px">
<li><code>so_luong</code>, <code>gia_luc_dat</code> thuộc về <b>cặp</b> (lịch hẹn, dịch vụ) — không thuộc riêng bên nào</li>
<li><code>gia_luc_dat</code> không phải dư thừa: nó là <b>một sự thật khác</b> — giá tại thời điểm giao dịch</li>
<li>Prisma: quan hệ N-N <b>ngầm</b> (bảng <code>_AToB</code> chỉ có 2 cột) <span class="do">không chứa được thuộc tính</span> ⇒ khai bảng nối <b>tường minh</b></li>
</ul><div>${bang([['Theo <code>gia_luc_dat</code>', '<b>150000</b>'], ['JOIN giá hiện tại', '<b class="do">180000</b>']], ['Tổng lịch hẹn 10, sau khi tăng giá 20%', 'Kết quả'], 'font-size:19px')}
${o('Hoá đơn cũ tự “tăng giá” theo bảng giá mới = lỗi thiết kế thật, và rất khó phát hiện.', 'do2')}</div></div>` },

  /* 16 */
  { t: 'Quan hệ đa hình (polymorphic): vì sao nên tránh', body: `<div class="hai" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr)"><div>${code(`CREATE TABLE binh_luan (
  id             INT IDENTITY PRIMARY KEY,
  -- 'bai_viet' hoặc 'san_pham'
  doi_tuong_loai VARCHAR(20) NOT NULL,
  doi_tuong_id   INT NOT NULL  -- trỏ "đâu đó"
);`, 'sql')}
${bang([['bai_viet', '1', 'ok'], ['san_pham', '999', '<b class="do">MỒ CÔI</b>'], ['san_phm', '1', '<b class="do">MỒ CÔI</b>']], ['doi_tuong_loai', 'doi_tuong_id', 'Kiểm bằng LEFT JOIN'], 'margin-top:8px;font-size:18px')}
<p class="nho">Cả 3 dòng đều được nhận: <b>không thể</b> đặt khoá ngoại trỏ tới “bảng tuỳ theo cột khác”.</p></div>
<div>${bang([
    ['<b>Cung loại trừ</b> (exclusive arc): mỗi cha một FK NULL + CHECK “đúng một”', 'FK thật, dễ JOIN'],
    ['<b>Bảng riêng</b> cho từng cha: <code>binh_luan_bai_viet</code>, …', 'đơn giản nhất'],
    ['<b>Bảng cha chung</b> (supertype) — như lớp con ở Chương 3', 'nhiều loại cha'],
  ], ['Thay thế', 'Khi nào'], 'font-size:18px')}
${code(`-- PostgreSQL: đúng một cha
CHECK (num_nonnulls(bai_viet_id,
                    san_pham_id) = 1)`, 'sql')}
<p style="font-size:18px;margin-top:6px">SQL Server dùng <code>CASE</code> cộng lại = 1. Mồ côi ⇒ ${loi('Msg 547 FOREIGN KEY')}; hai cha ⇒ ${loi('Msg 547 CHECK')}</p></div></div>` },

  /* 17 */
  { t: 'EAV và cột JSON: khi nào dùng, khi nào KHÔNG', body: `${bang([
    ['Kiểu dữ liệu', 'mọi giá trị là chữ — <code>dung_tich_ml = \'khoảng 100\'</code> <b class="do">vẫn được nhận</b>', 'kiểu của JSON (số, chuỗi…), không ép theo cột', 'đúng kiểu'],
    ['Ràng buộc / FK', 'gần như không', 'CHECK hợp lệ JSON (<code>ISJSON</code>)', 'đủ'],
    ['Truy vấn', 'xoay bảng bằng <code>MAX(CASE …)</code>', '<code>JSON_VALUE</code> / <code>-&gt;&gt;</code>, <code>@&gt;</code>', 'SQL thường'],
    ['Index', 'khó', 'PostgreSQL <code>jsonb</code> + GIN', 'B-tree'],
  ], ['', 'EAV (thực thể–thuộc tính–giá trị)', 'Cột JSON', 'Cột thật'], 'font-size:17px')}
<div class="hai"><ul style="font-size:20px">
<li><b>Cột thật</b> cho mọi thứ bạn <b>lọc, JOIN, ràng buộc, tính tiền</b></li>
<li><b>JSON</b> cho thuộc tính khác nhau theo loại sản phẩm, đọc/ghi nguyên cụm (thông số, cấu hình)</li>
<li><b>EAV</b>: hầu như không; chỉ khi người dùng <b>tự định nghĩa</b> trường</li>
</ul><div>${code(`-- PostgreSQL
CREATE INDEX ix_san_pham_thong_so
  ON san_pham USING GIN (thong_so);
SELECT ten FROM san_pham
WHERE thong_so @> '{"mau": "đen"}';`, 'sql')}
<p class="nho" style="margin-top:4px">SQL Server: JSON nằm trong <code>NVARCHAR(MAX)</code>, hàm JSON từ bản 2016.</p></div></div>` },

  /* 18 */
  { t: 'Phi chuẩn hoá có chủ đích', body: `<div class="hai"><div><ul style="font-size:21px">
<li>Lưu <b>dữ liệu suy ra được</b> để đọc nhanh: cột đếm (<code>so_lich_hen</code>), cột tổng (<code>tong_tien</code>), bảng tổng hợp</li>
<li>Chỉ làm khi đã đo: đọc <b>nhiều hơn hẳn</b> ghi, và <code>COUNT</code>/<code>SUM</code> thật sự chậm</li>
<li>Giữ đồng bộ trong <b>cùng giao dịch</b> (trigger) + <b>truy vấn đối soát</b> định kỳ</li>
<li>Bảng tổng hợp: <b>materialized view</b> (PostgreSQL, phải <code>REFRESH</code>) · <b>indexed view</b> (SQL Server, tự cập nhật)</li>
</ul></div>
<div>${bang([
    ['An', '2', '2', 'khớp'],
    ['Bình', '<b class="do">1</b>', '<b>3</b>', '<b class="do">lệch</b>'],
  ], ['Khách', 'Đã lưu', 'Đếm lại', ''], 'font-size:19px')}
<p class="nho" style="margin:6px 0 10px">SQL Server: trigger giữ đúng số, tới khi một “đường tắt” (<code>DISABLE TRIGGER</code>, nhập hàng loạt) chèn 2 lịch cho Bình.</p>
${code(`-- sửa lại từ nguồn sự thật
UPDATE k SET so_lich_hen =
  (SELECT COUNT(*) FROM lich_hen l
   WHERE l.khach_hang_id = k.id)
FROM khach_hang AS k;`, 'sql')}</div></div>
${o('Một nguồn sự thật: bảng <code>lich_hen</code>. Cột đếm chỉ là <b>bản sao để đọc nhanh</b> — luôn tính lại được, và phải ghi rõ trong tài liệu.', 'xanh')}` },

  /* 19 */
  { t: 'Ràng buộc là tài liệu sống', body: `<div class="hai"><div>${code(`CONSTRAINT ck_lich_hen_khoang_gio
  CHECK (ket_thuc > bat_dau),
CONSTRAINT ck_lich_hen_trang_thai
  CHECK (trang_thai IN ('DAT','XONG','HUY')),
-- PostgreSQL: không trùng giờ cùng thợ
CONSTRAINT ex_lich_hen_khong_trung
  EXCLUDE USING gist (
    nhan_vien_id WITH =,
    tstzrange(bat_dau, ket_thuc) WITH &&
  ) WHERE (trang_thai <> 'HUY')`, 'sql')}</div>
<div>${bang([
    ['Kết thúc trước bắt đầu', loi('Msg 547 CHECK "ck_lich_hen_khoang_gio"')],
    ["Trạng thái 'DONE'", loi('Msg 547 CHECK "ck_lich_hen_trang_thai"')],
    ['Trùng giờ (PostgreSQL)', loi('violates exclusion constraint "ex_lich_hen_khong_trung"')],
    ['Trùng giờ (SQL Server)', 'không có EXCLUDE ⇒ trigger + <code>THROW 50001</code>'],
  ], ['Thử chèn', 'Kết quả thật'], 'font-size:17px')}
<ul style="font-size:20px;margin-top:8px">
<li>Ràng buộc chặn <b>mọi</b> đường ghi: app, script, người sửa tay; <code>if</code> trong code chỉ chặn một đường</li>
<li>Đọc <code>CREATE TABLE</code> là biết luật nghiệp vụ</li>
<li>Trigger kiểm trùng có thể <b>lọt</b> khi hai phiên chèn cùng lúc (CS.4); EXCLUDE thì không</li>
</ul></div></div>` },

  /* 20 */
  { t: 'Khoá ngoại: CASCADE, RESTRICT, SET NULL', body: `${bang([
    ['<b>NO ACTION</b> (mặc định) / <b>RESTRICT</b>', 'chặn nếu còn con', 'xoá khách còn lịch hẹn', loi('Msg 547 / ERROR … violates foreign key')],
    ['<b>CASCADE</b>', 'xoá luôn các dòng con', 'xoá lịch hẹn ⇒ các dòng dịch vụ', 'lịch 100: 2 dòng con biến mất'],
    ['<b>SET NULL</b>', 'giữ con, FK về NULL', 'thợ nghỉ việc, lịch cũ còn', 'lịch 101: <code>nhan_vien_id</code> = NULL'],
  ], ['Hành động <code>ON DELETE</code>', 'Làm gì', 'Dùng cho', 'Đo thật (cả hai hệ)'], 'font-size:18px')}
<div class="hai" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr)"><div>${code(`-- tin nhắn: HAI khoá ngoại cùng tới nguoi_dung
nguoi_gui  INT REFERENCES nguoi_dung(id)
                ON DELETE CASCADE,
nguoi_nhan INT REFERENCES nguoi_dung(id)
                ON DELETE CASCADE`, 'sql')}
<p style="font-size:17px;margin-top:6px">SQL Server: ${loi('Msg 1785 … may cause cycles or multiple cascade paths')} — PostgreSQL: chạy được.</p></div>
<ul style="font-size:20px">
<li>CASCADE chỉ cho dòng con là <b>một phần</b> của cha; đừng CASCADE từ khách hàng xuống thanh toán</li>
<li>SQL Server không có từ khoá <code>RESTRICT</code>; PostgreSQL có cả hai (<code>NO ACTION</code> hoãn được tới cuối giao dịch)</li>
<li>Prisma: <code>onDelete: Cascade | Restrict | SetNull</code>; quan hệ bắt buộc mặc định <b>Restrict</b>, kèm <code>ON UPDATE CASCADE</code></li>
</ul></div>` },

  /* 21 */
  { t: 'Migration không gián đoạn: mở rộng → thu gọn', body: `<div class="hai"><div>${code(`-- 1. mở rộng: cột cho phép NULL (tức thì)
ALTER TABLE khach_hang ADD so_dien_thoai VARCHAR(15) NULL;
-- 2. điền dữ liệu (bảng lớn: chia lô)
UPDATE khach_hang SET so_dien_thoai = …
WHERE so_dien_thoai IS NULL;
-- 3. thu gọn: siết NOT NULL
ALTER TABLE khach_hang
  ALTER COLUMN so_dien_thoai VARCHAR(15) NOT NULL;`, 'sql')}
<p style="font-size:17px;margin-top:6px">Một bước <code>ADD … NOT NULL</code> trên bảng có dòng: ${loi('Msg 4901')} / ${loi('ERROR: column … contains null values')}</p></div>
<div><p style="font-size:20px"><b>Đổi tên cột</b> <code>ten</code> → <code>ho_ten</code> tại chỗ:</p>
${bang([['SQL Server <code>sp_rename</code>', 'view cũ gãy: ' + loi("Msg 207 Invalid column name 'ten'")], ['PostgreSQL <code>RENAME COLUMN</code>', 'view vẫn chạy (tự thành <code>ho_ten AS ten</code>)']], ['Hệ', 'Đo thật'], 'font-size:17px')}
<p style="font-size:20px;margin-top:8px">Nhưng <b>code ứng dụng</b> còn gọi <code>ten</code> thì gãy ở cả hai. An toàn:</p>
<ol style="font-size:19px"><li>thêm cột mới, ghi <b>cả hai</b> cột</li><li>chép dữ liệu cũ sang</li><li>đổi mọi chỗ đọc sang cột mới</li><li>xoá cột cũ ở <b>lần deploy sau</b></li></ol></div></div>` },

  /* 22 */
  { t: 'Prisma: schema.prisma ↔ bảng SQL', body: `<div class="hai"><div>${pre(`model LichHen {
  id          Int      @id @default(autoincrement())
  khachHangId Int      @map("khach_hang_id")
  batDau      DateTime @map("bat_dau") @db.Timestamptz(0)
  updatedAt   DateTime @updatedAt @map("updated_at")
  khachHang   KhachHang @relation(fields: [khachHangId],
                references: [id], onDelete: Restrict)
  @@index([khachHangId, batDau])
  @@map("lich_hen")
}`, 'font-size:14px')}
${pre(`"id" SERIAL NOT NULL,
"updated_at" TIMESTAMPTZ(3) NOT NULL,      -- không DEFAULT
… FOREIGN KEY ("khach_hang_id") REFERENCES "khach_hang"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;`, 'font-size:14px;margin-top:8px')}
<p class="nho">SQL thật do <code>prisma migrate diff</code> (Prisma 5.22) sinh ra.</p></div>
${bang([
    ['<code>@id @default(autoincrement())</code>', '<code>SERIAL</code> (không phải IDENTITY)'],
    ['<code>@relation(fields, references)</code>', 'khoá ngoại + <code>ON UPDATE CASCADE</code>'],
    ['<code>@@id</code> / <code>@@unique</code> / <code>@@index</code>', 'PK ghép / UNIQUE / INDEX'],
    ['FK <code>dich_vu_id</code> không khai <code>@@index</code>', '<b class="do">không có index</b>'],
    ['<code>@updatedAt</code>', 'Prisma Client điền'],
    ['partial index, CHECK, EXCLUDE', '<code>migrate dev --create-only</code> rồi viết tay vào <code>migration.sql</code>'],
  ], ['schema.prisma', 'CSDL nhận được'], 'font-size:17px')}</div>` },

  /* 23 */
  { t: 'Case study: ERD “Salon Mây”', body: `${erd()}
<p class="nho">UQ* = unique có lọc (<code>WHERE deleted_at IS NULL</code>). Vòng tròn = 0..1 (lịch hẹn có thể chưa/không còn thợ). Bảng đỏ là trung tâm nghiệp vụ.</p>` },

  /* 24 */
  { t: 'Case study: index và truy vấn nghiệp vụ', body: `<div class="hai"><div>${bang([
    ['<code>lich_hen(nhan_vien_id, bat_dau)</code>', 'lịch của thợ trong ngày, kiểm trùng giờ'],
    ['<code>lich_hen(khach_hang_id, bat_dau)</code>', 'lịch sử một khách, lần đến cuối, FK'],
    ['<code>lich_hen_dich_vu(dich_vu_id)</code>', 'doanh thu theo dịch vụ, FK'],
    ['<code>thanh_toan(lich_hen_id)</code>', 'FK, tiền của một lịch'],
    ['<code>thanh_toan(luc_tra)</code>', 'doanh thu theo khoảng thời gian'],
    ['unique có lọc <code>so_dien_thoai</code>', 'tìm khách khi gọi điện đặt lịch'],
  ], ['Index', 'Phục vụ'], 'font-size:16px')}
<p class="nho" style="margin-top:6px">PostgreSQL: index đầu tiên chính là index GiST của ràng buộc EXCLUDE.</p></div>
<div>${bang([['2024-09', '170.000', '<b class="do">370.000</b>'], ['2024-10', '1.330.000', '<b class="do">1.130.000</b>']], ['Tháng', 'Doanh thu giờ VN', 'Nếu gom theo UTC'], 'font-size:17px')}
<p style="font-size:18px;margin:6px 0 10px">Tiền cọc 200.000 lúc <b>06:30 ngày 01/10</b> giờ VN = 23:30 ngày 30/09 UTC ⇒ gom sai tháng.</p>
${bang([['Uốn', '1', '600.000'], ['Nhuộm', '1', '450.000'], ['Cắt tóc', '3', '300.000'], ['Gội dưỡng sinh', '2', '150.000']], ['Dịch vụ (lịch XONG)', 'Lần', 'Doanh thu'], 'font-size:17px')}
<p class="nho" style="margin-top:4px">Gội 150.000 = 80.000 + <b>70.000</b> (giá cũ, nhờ <code>gia_luc_dat</code>). Khách lâu chưa quay lại: Lê An (10/09).</p></div></div>` },

  /* 25 */
  { t: 'Checklist trước khi viết migration', body: `<ol style="font-size:21px;gap:6px">
<li>Mỗi câu “phải / không được” trong yêu cầu đã thành <b>ràng buộc</b> (NOT NULL, UNIQUE, CHECK, FK, EXCLUDE)?</li>
<li>Khoá chính là <b>khoá thay thế</b>; khoá tự nhiên là <code>UNIQUE</code>? UUID thì <b>tăng dần</b>?</li>
<li>Tên <b>snake_case</b>, nhất quán số ít/số nhiều, <b>mọi ràng buộc có tên</b>?</li>
<li>Tiền <code>DECIMAL</code>; thời điểm <code>timestamptz</code>/<code>datetimeoffset</code>; chữ <code>NVARCHAR</code>/UTF-8?</li>
<li>Xoá thật hay xoá mềm? Nếu mềm: unique có lọc + view “còn sống”</li>
<li>Có cần lịch sử / audit? Giá nào phải <b>chốt tại thời điểm giao dịch</b>?</li>
<li>Không có quan hệ đa hình, không EAV; JSON chỉ cho dữ liệu không lọc/ràng buộc</li>
<li>Mỗi cột dư thừa có <b>nguồn sự thật</b> + trigger/đối soát?</li>
<li>Mỗi khoá ngoại: chọn <code>ON DELETE</code> có lý do, và <b>có index</b>?</li>
<li>Thay đổi lược đồ đi theo <b>mở rộng → chuyển → thu gọn</b>; đã đọc <code>migration.sql</code> Prisma sinh ra?</li>
</ol>` },
]);
