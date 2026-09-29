/**
 * dbi-cs2.mjs — DBI202 ⭐ Chuyên sâu 2: BÊN TRONG MỘT DBMS (deck tự dựng, không phải slide trường).
 * Mọi con số trên slide (37 dòng/trang, 67 byte trống, lower 156 / upper 272, logical reads 28, hit=2048…)
 * lấy từ output THẬT của các file flm-nguon/DBI202/gen/sql/cs2/*.sql chạy trên Azure SQL Edge + PostgreSQL 16.
 * Render: node scripts/_render-slides.mjs --deck scripts/slides-src/dbi-cs2.mjs --out <dir>
 */
import { lamDeck, code } from './_cs-chung.mjs';

export const deck = { key: 'cs2', code: 'CS2', title: 'Bên trong một DBMS', sub: 'DBI202 · ⭐ Chuyên sâu' };

/* ── màu dùng chung cho sơ đồ svg ── */
const C = { cam: '#e08a1e', nau: '#b85a2b', xam: '#404040', nhat: '#fff7ef', xanh: '#2f7d4f', xnhat: '#f1f9f4', lam: '#1b5fa8', lnhat: '#eef5fc', do: '#e02020' };
const box = (x, y, w, h, txt, { fill = '#fff', stroke = C.cam, color = C.xam, fs = 17, bold = true, rx = 8 } = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>` +
  txt.split('\n').map((t, i, a) => `<text x="${x + w / 2}" y="${y + h / 2 + (i - (a.length - 1) / 2) * (fs + 3) + fs * 0.35}" text-anchor="middle" font-size="${fs}" font-weight="${bold ? 700 : 400}" fill="${color}">${t}</text>`).join('');
const arrow = (x1, y1, x2, y2, color = C.nau) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2.5" marker-end="url(#mui)"/>`;
const svg = (w, h, inner) =>
  `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="font-family:Arial,sans-serif;display:block;margin:0 auto">` +
  `<defs><marker id="mui" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${C.nau}"/></marker></defs>${inner}</svg>`;

/* ── Slide 3: kiến trúc tổng thể ── */
const kienTruc = svg(1100, 440, [
  box(10, 55, 132, 140, 'Client\n(SSMS, psql,\napp Node/Java)', { fill: C.lnhat, stroke: C.lam, fs: 15 }),
  arrow(142, 95, 218, 95),
  arrow(210, 170, 145, 170, C.lam),
  // query processor
  `<rect x="210" y="10" width="562" height="200" rx="12" fill="${C.nhat}" stroke="${C.cam}" stroke-width="2" stroke-dasharray="6 4"/>`,
  `<text x="491" y="34" text-anchor="middle" font-size="17" font-weight="700" fill="${C.nau}">BỘ XỬ LÝ TRUY VẤN (query processor)</text>`,
  box(222, 60, 110, 70, 'Parser\ncú pháp', { fs: 15 }),
  arrow(332, 95, 346, 95),
  box(348, 60, 120, 70, 'Binder\ntên · kiểu', { fs: 15 }),
  arrow(468, 95, 482, 95),
  box(484, 60, 135, 70, 'Optimizer\nchọn kế hoạch', { fs: 15, fill: '#fff4e6' }),
  arrow(619, 95, 633, 95),
  box(635, 60, 125, 70, 'Executor\nchạy kế hoạch', { fs: 15 }),
  box(380, 150, 240, 44, 'Plan cache · Statistics', { fs: 15, fill: '#fff', stroke: '#999' }),
  // storage engine
  `<rect x="210" y="240" width="562" height="190" rx="12" fill="${C.xnhat}" stroke="${C.xanh}" stroke-width="2" stroke-dasharray="6 4"/>`,
  `<text x="491" y="264" text-anchor="middle" font-size="17" font-weight="700" fill="${C.xanh}">BỘ MÁY LƯU TRỮ (storage engine)</text>`,
  box(225, 285, 230, 60, 'Access methods\nheap, B-tree', { fs: 15, stroke: C.xanh }),
  box(470, 285, 285, 60, 'Buffer manager\n(buffer pool)', { fs: 15, stroke: C.xanh, fill: '#e3f3e8' }),
  box(225, 360, 230, 55, 'Transaction manager\nkhoá · MVCC', { fs: 15, stroke: C.xanh }),
  box(470, 360, 285, 55, 'Log manager\nnhật ký (WAL)', { fs: 15, stroke: C.xanh }),
  arrow(697, 130, 697, 283, C.nau),
  // disk
  `<text x="960" y="262" text-anchor="middle" font-size="16" font-weight="700" fill="#555">ĐĨA (SSD/HDD)</text>`,
  box(830, 280, 260, 70, 'File dữ liệu\n.mdf  |  base/…', { fill: '#f4f4f4', stroke: '#777', fs: 17 }),
  box(830, 360, 260, 60, 'File nhật ký\n.ldf  |  pg_wal/', { fill: '#f4f4f4', stroke: '#777', fs: 17 }),
  arrow(755, 315, 827, 315, C.xanh),
  arrow(755, 390, 827, 390, C.xanh),
  `<text x="176" y="84" text-anchor="middle" font-size="13" fill="#666">câu SQL</text>`,
  `<text x="176" y="192" text-anchor="middle" font-size="13" fill="#666">kết quả</text>`,
].join(''));

/* ── Slide 9: bố cục trang ── */
const trangSS = svg(520, 300, [
  `<text x="260" y="20" text-anchor="middle" font-size="18" font-weight="700" fill="${C.xam}">SQL Server — 8192 byte</text>`,
  box(10, 32, 500, 36, 'Header 96 byte (page id, loại trang, số slot…)', { fill: '#fbe9dc', fs: 15 }),
  box(10, 72, 500, 30, 'Dòng 0', { fs: 15, bold: false }),
  box(10, 104, 500, 30, 'Dòng 1', { fs: 15, bold: false }),
  box(10, 136, 500, 30, 'Dòng 2   → dòng mới ghi TIẾP xuống dưới', { fs: 15, bold: false }),
  box(10, 170, 500, 64, 'khoảng trống (free space)', { fill: '#fafafa', stroke: '#bbb', fs: 15, bold: false, color: '#888' }),
  box(10, 238, 500, 36, '… slot 2 | slot 1 | slot 0   ← mảng slot ở CUỐI trang', { fill: '#fff4e6', fs: 15 }),
  `<text x="260" y="294" text-anchor="middle" font-size="14" fill="#666">mỗi slot 2 byte = vị trí (offset) của một dòng</text>`,
].join(''));
const trangPG = svg(520, 300, [
  `<text x="260" y="20" text-anchor="middle" font-size="18" font-weight="700" fill="${C.xam}">PostgreSQL — 8192 byte</text>`,
  box(10, 32, 500, 36, 'Header 24 byte (lower, upper, LSN…)', { fill: C.lnhat, stroke: C.lam, fs: 15 }),
  box(10, 72, 500, 32, 'lp1 | lp2 | lp3 …  → con trỏ dòng, 4 byte/cái', { fill: '#e8f1fb', stroke: C.lam, fs: 15 }),
  `<text x="500" y="118" text-anchor="end" font-size="13" fill="${C.lam}">↑ lower</text>`,
  box(10, 124, 500, 64, 'khoảng trống (free space)', { fill: '#fafafa', stroke: '#bbb', fs: 15, bold: false, color: '#888' }),
  `<text x="500" y="203" text-anchor="end" font-size="13" fill="${C.lam}">↓ upper</text>`,
  box(10, 208, 500, 30, '… tuple 3   ← dòng mới ghi NGƯỢC từ cuối lên', { stroke: C.lam, fs: 15, bold: false }),
  box(10, 240, 500, 30, 'tuple 2 | tuple 1', { stroke: C.lam, fs: 15, bold: false }),
  `<text x="260" y="294" text-anchor="middle" font-size="14" fill="#666">ctid (0,3) = trang 0, con trỏ số 3</text>`,
].join(''));

/* ── Slide 15: buffer pool ── */
const bufferPool = svg(1100, 300, [
  box(20, 110, 200, 80, 'Executor cần\ntrang (1:312)', { fill: C.nhat, fs: 17 }),
  arrow(220, 150, 300, 150),
  `<rect x="305" y="30" width="470" height="240" rx="12" fill="${C.xnhat}" stroke="${C.xanh}" stroke-width="2"/>`,
  `<text x="540" y="56" text-anchor="middle" font-size="18" font-weight="700" fill="${C.xanh}">RAM: buffer pool / shared_buffers</text>`,
  ...Array.from({ length: 12 }, (_, i) => box(325 + (i % 6) * 73, 75 + Math.floor(i / 6) * 60, 62, 48, i === 4 ? '1:312' : '', { fill: i === 4 ? '#c9ecd5' : '#fff', stroke: C.xanh, fs: 14 })),
  `<text x="540" y="215" text-anchor="middle" font-size="16" fill="${C.xam}">có sẵn ⇒ <tspan font-weight="700" fill="${C.xanh}">logical read / shared hit</tspan></text>`,
  `<text x="540" y="245" text-anchor="middle" font-size="16" fill="${C.xam}">chưa có ⇒ đọc đĩa rồi chép vào một ô trống</text>`,
  arrow(775, 150, 860, 150, C.xanh),
  box(865, 100, 215, 100, 'ĐĨA\nphysical read\n/ shared read', { fill: '#f4f4f4', stroke: '#777', fs: 17 }),
].join(''));

/* ── Slide 18: ghi nhật ký trước ── */
const walSvg = svg(1100, 250, [
  box(10, 20, 230, 70, '① UPDATE đổi trang\ntrong RAM (trang "bẩn")', { fill: C.nhat, fs: 16 }),
  `<text x="20" y="150" font-size="14" fill="#666">trang bẩn nằm chờ trong RAM</text>`,
  arrow(240, 55, 290, 55),
  box(295, 20, 250, 70, '② đồng thời sinh bản ghi\nnhật ký trong log buffer', { fill: C.nhat, fs: 16 }),
  arrow(545, 55, 595, 55),
  box(600, 20, 230, 70, '③ COMMIT ⇒ ÉP log\nxuống đĩa (flush)', { fill: '#fdf0ee', stroke: '#c0392b', fs: 16 }),
  arrow(830, 55, 880, 55),
  box(885, 20, 205, 70, '④ báo "xong"\ncho client', { fill: C.xnhat, stroke: C.xanh, fs: 16 }),
  box(300, 140, 520, 80, '⑤ RẤT LÂU SAU: checkpoint / tiến trình nền\nmới ghi trang dữ liệu bẩn xuống file dữ liệu', { fill: '#f4f4f4', stroke: '#777', fs: 16 }),
  arrow(125, 90, 300, 175, '#777'),
].join(''));

/* ── Slide 22: luồng một câu SELECT ── */
const buoc = (n, t, d) => `<div style="display:flex;gap:12px;align-items:flex-start"><span style="flex:0 0 34px;height:34px;border-radius:50%;background:${C.cam};color:#fff;font-weight:700;font-size:19px;display:flex;align-items:center;justify-content:center">${n}</span><div style="font-size:20px;line-height:1.3"><b>${t}</b> <span style="color:#555">${d}</span></div></div>`;

export const slides = lamDeck('BÊN TRONG MỘT DBMS', [
  /* 1 */ { cover: true, t: 'Bên trong một DBMS', sub: 'Trang 8 KB · buffer pool · nhật ký giao dịch · optimizer — nhìn tận mắt bằng lệnh chạy thật' },

  /* 2 */ { t: 'Vì sao phải mở "hộp đen" DBMS?', body: `
<ul>
<li>Tới giờ ta chỉ <b>gõ SQL và nhận kết quả</b> — DBMS là một hộp đen.</li>
<li>Nhưng câu hỏi thật khi đi làm: <span class="do">vì sao câu này chậm? vì sao lần 2 nhanh hơn? sập điện có mất dữ liệu không?</span></li>
<li>Trả lời được phải biết: dữ liệu nằm trên đĩa <b>thế nào</b>, được đọc vào RAM <b>ra sao</b>, và DBMS <b>ghi nhớ</b> thay đổi bằng cách nào.</li>
<li>Deck này: kiến trúc → trang & dòng → dòng dài → buffer pool → nhật ký (WAL) → thống kê → luồng một câu SELECT → cache kế hoạch.</li>
</ul>
<div class="o xanh">Mỗi khẳng định đều <b>chạy lệnh thật để thấy</b> trên SQL Server (Azure SQL Edge) và PostgreSQL 16.</div>` },

  /* 3 */ { t: 'Kiến trúc tổng thể', body: kienTruc },

  /* 4 */ { t: 'Cùng một kiến trúc, khác tên gọi', body: `
<table style="font-size:19px">
<tr><th>Thành phần</th><th>SQL Server</th><th>PostgreSQL</th></tr>
<tr><td>Mô hình tiến trình</td><td>1 tiến trình, nhiều luồng (thread)</td><td>1 tiến trình (process) mỗi kết nối</td></tr>
<tr><td>Vùng nhớ đệm trang</td><td>buffer pool</td><td>shared_buffers (+ bộ đệm của hệ điều hành)</td></tr>
<tr><td>File dữ liệu</td><td>.mdf / .ndf</td><td>base/&lt;oid CSDL&gt;/&lt;relfilenode&gt;, mỗi đoạn ≤ 1 GB</td></tr>
<tr><td>Nhật ký</td><td>transaction log (.ldf)</td><td>WAL (thư mục pg_wal)</td></tr>
<tr><td>Cache kế hoạch</td><td>plan cache dùng chung mọi phiên</td><td>không có cache chung — chỉ PREPARE trong một phiên</td></tr>
<tr><td>Bản cũ của dòng (MVCC)</td><td>version store trong tempdb (khi bật)</td><td>nằm ngay trong bảng (tuple cũ)</td></tr>
</table>
<div class="nho">Chi tiết từng dòng của bảng: các slide sau. MVCC học kỹ ở ⭐ CS4.</div>` },

  /* 5 */ { t: 'Trang (page) 8 KB — đơn vị đọc/ghi nhỏ nhất', body: `
<ul>
<li>DBMS <b>không đọc từng dòng</b> từ đĩa: nó đọc/ghi cả <span class="do">trang 8 KB = 8192 byte</span>.</li>
<li>Cả <b>SQL Server</b> lẫn <b>PostgreSQL</b> đều dùng trang 8 KB (PostgreSQL: đổi được lúc biên dịch, gần như không ai đổi).</li>
<li>Muốn lấy 1 dòng 200 byte ⇒ vẫn phải đọc <b>cả trang</b> chứa nó.</li>
<li>Vì thế "chi phí" một truy vấn được đo bằng <b>số trang đọc</b>, không phải số dòng.</li>
</ul>
<div class="hai">
${code(`-- PostgreSQL\nSHOW block_size;      -- 8192`, 'sql')}
${code(`-- SQL Server: cột size tính bằng TRANG\nSELECT type_desc, size, size * 8 AS KB\nFROM sys.database_files;  -- ROWS 1024 8192`, 'sql')}
</div>` },

  /* 6 */ { t: 'SQL Server: extent, IAM và heap', body: `
<ul>
<li><b>Extent</b> = 8 trang liền nhau = 64 KB — SQL Server cấp chỗ theo extent.</li>
<li><b>IAM page</b> (Index Allocation Map) ghi bảng này đang sở hữu những extent nào.</li>
<li><b>Heap</b> = bảng <span class="do">không có clustered index</span>: dòng nằm đâu cũng được, không theo thứ tự.</li>
</ul>
${code(`SELECT page_type_desc, COUNT(*) AS so_trang, COUNT(DISTINCT extent_page_id) AS so_extent
FROM sys.dm_db_database_page_allocations(DB_ID(), OBJECT_ID('dbo.SinhVien'), NULL, NULL, 'DETAILED')
GROUP BY page_type_desc;
-- DATA_PAGE  28 trang, 4 extent   ·   IAM_PAGE  1 trang`, 'sql')}
<div class="nho">DMV này và <b>DBCC IND</b> là công cụ <i>không có tài liệu chính thức</i> — dùng để học/chẩn đoán, không dùng trong ứng dụng.</div>` },

  /* 7 */ { t: 'Mỗi dòng nằm ở đâu? — địa chỉ vật lý', body: `
<div class="hai">
<div>
<p><b>SQL Server</b> — (file : trang : slot)</p>
${code(`SELECT TOP 3
  sys.fn_PhysLocFormatter(%%physloc%%)
    AS vi_tri, id
FROM dbo.SinhVien ORDER BY id;
-- (1:312:0) 1
-- (1:312:1) 2
-- (1:312:2) 3`, 'sql')}
</div>
<div>
<p><b>PostgreSQL</b> — ctid = (trang, con trỏ)</p>
${code(`SELECT ctid, id FROM sinh_vien
ORDER BY id LIMIT 3;
-- (0,1) 1
-- (0,2) 2
-- (0,3) 3`, 'sql')}
</div>
</div>
<div class="o do2"><b>ctid không phải khoá!</b> UPDATE/VACUUM FULL làm nó đổi. Đừng lưu ctid để tìm lại dòng.</div>` },

  /* 8 */ { t: 'PostgreSQL: mỗi bảng là một file', body: `
<ul>
<li>Mỗi bảng/chỉ mục = một file riêng trong thư mục dữ liệu; file lớn hơn 1 GB thì tự cắt thành nhiều đoạn 1 GB.</li>
<li>Kèm hai "nhánh" phụ: <b>FSM</b> (bản đồ chỗ trống) và <b>VM</b> (bản đồ trang toàn dòng thấy được).</li>
<li>Không có khái niệm extent như SQL Server — file lớn dần từng trang.</li>
</ul>
${code(`SELECT pg_relation_size('sinh_vien')        AS bytes,  -- 253952
       pg_relation_size('sinh_vien') / 8192 AS trang,  -- 31
       pg_relation_filepath('sinh_vien')    AS file;   -- base/<oid>/<số>`, 'sql')}
<div class="nho">Cùng 1000 dòng, PostgreSQL cần 31 trang, SQL Server 28 — vì đầu mỗi dòng của PostgreSQL to hơn (slide 12).</div>` },

  /* 9 */ { t: 'Bên trong một trang: slotted page', body: `<div class="hai">${trangSS}${trangPG}</div>
<div class="o" style="font-size:20px">Cả hai đều dùng <b>mảng con trỏ</b>: dòng dời chỗ trong trang thì chỉ sửa con trỏ, địa chỉ (trang, slot) bên ngoài vẫn đúng.</div>` },

  /* 10 */ { t: 'Đo thật một trang SQL Server', body: `
${code(`SELECT slot_count, free_bytes
FROM sys.dm_db_page_info(DB_ID(), 1, 312, 'DETAILED');   -- 37 | 67`, 'sql')}
<table style="font-size:20px">
<tr><th>Phép tính</th><th>Byte</th></tr>
<tr><td>Một dòng: 4 (id) + 200 (CHAR(200)) + 4 (diem) + 7 byte đầu dòng</td><td>215</td></tr>
<tr><td>+ 2 byte slot trong mảng slot</td><td>217</td></tr>
<tr><td>Chỗ cho dữ liệu: 8192 − 96 (header)</td><td>8096</td></tr>
<tr><td>37 dòng × 217</td><td>8029</td></tr>
<tr><td>Còn trống: 8096 − 8029 — <span class="do">không đủ cho dòng thứ 38</span></td><td>67</td></tr>
</table>` },

  /* 11 */ { t: 'Đo thật một trang PostgreSQL (pageinspect)', body: `
${code(`CREATE EXTENSION pageinspect;
SELECT lower, upper FROM page_header(get_raw_page('sinh_vien', 0));      -- 156 | 272
SELECT lp, lp_off, lp_len FROM heap_page_items(get_raw_page('sinh_vien', 0)) LIMIT 2;
-- 1 | 7952 | 236      2 | 7712 | 236`, 'sql')}
<ul style="font-size:22px">
<li><b>lower</b> 156 = 24 byte header + 33 con trỏ × 4 byte ⇒ trang chứa <span class="do">33 dòng</span>.</li>
<li><b>upper</b> 272 = 8192 − 33 × 240 (mỗi dòng 236 byte, làm tròn lên bội số 8).</li>
<li>Chỗ trống = upper − lower = 116 byte &lt; 240 ⇒ trang đầy.</li>
</ul>` },

  /* 12 */ { t: 'Định dạng một dòng (row format)', body: `
<table style="font-size:19px">
<tr><th></th><th>SQL Server (FixedVar)</th><th>PostgreSQL (heap tuple)</th></tr>
<tr><td>Đầu dòng</td><td>4 byte: bit trạng thái + vị trí cuối phần cố định</td><td><b>23 byte</b>: xmin, xmax (giao dịch tạo/xoá), ctid, cờ…</td></tr>
<tr><td>Cột cố định</td><td>xếp liền nhau (INT, CHAR…)</td><td>xếp theo thứ tự cột, có <b>đệm căn lề</b></td></tr>
<tr><td>NULL</td><td>số cột (2 byte) + bitmap NULL</td><td>bitmap NULL (chỉ khi có NULL)</td></tr>
<tr><td>Cột độ dài thay đổi</td><td>bảng vị trí 2 byte/cột + dữ liệu</td><td>đầu 1 hoặc 4 byte mỗi giá trị</td></tr>
<tr><td>Trần một dòng</td><td><span class="do">8060 byte</span> trong trang</td><td>≈ 2 KB thì bắt đầu đẩy ra TOAST</td></tr>
</table>
<div class="o" style="font-size:20px">Đo thật bảng <b>1 cột INT</b>: SQL Server <b>11 byte</b>/dòng, 588 dòng/trang · PostgreSQL <b>28 byte</b>/dòng, 226 dòng/trang. xmin/xmax trong từng dòng là giá của MVCC (⭐ CS4).</div>` },

  /* 13 */ { t: 'Dòng quá dài: SQL Server', body: `
${code(`CREATE TABLE dbo.Qua (a CHAR(5000), b CHAR(5000));
-- Msg 1701: ... minimum row size would be 10007 ... maximum allowable table row size of 8060 bytes.`, 'sql')}
<ul>
<li>Cột <b>cố định</b> cộng lại &gt; 8060 ⇒ <span class="do">từ chối ngay lúc CREATE TABLE</span>.</li>
<li>Cột <b>VARCHAR(n)</b> vượt trang ⇒ đẩy sang trang <b>ROW_OVERFLOW_DATA</b>, trong dòng chỉ giữ con trỏ 24 byte.</li>
<li><b>VARCHAR(MAX)</b> lớn ⇒ nằm ở trang <b>LOB_DATA</b>.</li>
</ul>
${code(`-- 1 dòng: a = 5000 ký tự, b = 5000 ký tự, c VARCHAR(MAX) = 20000 ký tự
-- IN_ROW_DATA 1 trang · ROW_OVERFLOW_DATA 1 trang · LOB_DATA 3 trang`, 'sql')}` },

  /* 14 */ { t: 'Dòng quá dài: TOAST của PostgreSQL', body: `
<ul>
<li><b>TOAST</b> (The Oversized-Attribute Storage Technique): dòng vượt ≈ 2 KB ⇒ PostgreSQL <b>nén</b> giá trị dài, còn dài thì <b>cắt thành mảnh ≈ 2 KB</b> cất vào bảng phụ <code>pg_toast_&lt;oid&gt;</code>.</li>
<li>Tự động, trong suốt: SELECT vẫn thấy nguyên chuỗi.</li>
<li>Lợi: bảng chính gọn ⇒ quét nhanh khi <b>không</b> SELECT cột dài.</li>
</ul>
${code(`-- noi_dung = 9600 ký tự hex (nén không lợi)
SELECT pg_relation_size(c.oid)           AS bang_chinh,  -- 8192  (1 trang)
       pg_relation_size(c.reltoastrelid) AS bang_toast   -- 16384 (2 trang)
FROM pg_class c WHERE c.relname = 'bai_viet';`, 'sql')}
<div class="nho">Bẫy hiệu năng: <code>SELECT *</code> kéo theo mọi mảnh TOAST — chỉ lấy cột cần.</div>` },

  /* 15 */ { t: 'Buffer pool / shared buffers', body: `${bufferPool}
<ul style="font-size:22px">
<li>Đọc RAM nhanh hơn đọc đĩa rất nhiều lần ⇒ DBMS giữ trang vừa dùng trong một vùng nhớ đệm.</li>
<li>Đầy thì đuổi trang <b>lâu không dùng</b> ra; trang đã sửa ("bẩn") phải ghi xuống đĩa trước khi bị đuổi.</li>
<li><span class="do">Lần chạy thứ hai nhanh hơn</span> vì trang đã nằm sẵn trong RAM.</li>
</ul>` },

  /* 16 */ { t: 'SQL Server: SET STATISTICS IO ON', body: `
${code(`-- CHỈ trên máy thử: đuổi trang khỏi buffer pool
CHECKPOINT; DBCC DROPCLEANBUFFERS;
SET STATISTICS IO ON;
SELECT COUNT(*) FROM dbo.SinhVien;   -- lần 1
SELECT COUNT(*) FROM dbo.SinhVien;   -- lần 2`, 'sql')}
<table style="font-size:19px">
<tr><th></th><th>logical reads</th><th>physical reads</th><th>read-ahead reads</th></tr>
<tr><td>Lần 1 (RAM trống)</td><td>28</td><td>0</td><td class="do">28</td></tr>
<tr><td>Lần 2</td><td>28</td><td>0</td><td>0</td></tr>
</table>
<ul style="font-size:20px">
<li><b>logical</b> = số trang lấy từ buffer pool (mọi trang đều qua đây) · <b>physical</b> = đọc đĩa rồi chờ · <b>read-ahead</b> = đọc đĩa trước, đón đầu.</li>
<li>Đếm trang của bảng trong RAM (<code>sys.dm_os_buffer_descriptors</code>): trước <b>0</b> → sau <b>29</b> (28 trang dữ liệu + 1 IAM).</li>
</ul>` },

  /* 17 */ { t: 'PostgreSQL: EXPLAIN (ANALYZE, BUFFERS)', body: `
${code(`EXPLAIN (ANALYZE, BUFFERS, TIMING OFF, SUMMARY OFF, COSTS OFF)
SELECT count(*) FROM lon;     -- bảng 5504 trang (43 MB)`, 'sql')}
<table style="font-size:19px">
<tr><th>Bảng</th><th>Lần 1</th><th>Lần 2</th></tr>
<tr><td>nho — 1000 dòng</td><td>shared hit=128</td><td>shared hit=128</td></tr>
<tr><td>lon — 60000 dòng, 43 MB</td><td>hit=2048 <span class="do">read=3456</span></td><td>hit=2080 <span class="do">read=3424</span></td></tr>
</table>
<ul style="font-size:20px">
<li>Trước khi đo, <code>pg_buffercache</code> cho thấy: nho có 128/128 trang trong RAM, lon chỉ 2048/5504 (CREATE TABLE AS ghi qua vòng đệm 16 MB).</li>
<li><b>shared hit</b> = trang có sẵn trong shared_buffers · <b>read</b> = phải xin hệ điều hành (có thể từ cache của OS, không chắc là đĩa).</li>
<li>Bảng lớn hơn ¼ shared_buffers (128 MB mặc định) ⇒ quét tuần tự dùng <b>vòng đệm 256 KB</b> để không đuổi hết trang khác ⇒ lần 2 <span class="do">vẫn read</span>.</li>
</ul>` },

  /* 18 */ { t: 'Nhật ký giao dịch & "ghi nhật ký trước"', body: `${walSvg}
<ul style="font-size:21px">
<li><b>Luật WAL</b> (write-ahead logging): bản ghi nhật ký của một thay đổi phải <span class="do">xuống đĩa TRƯỚC</span> trang dữ liệu của nó.</li>
<li>COMMIT chỉ cần ghi <b>nhật ký tuần tự</b> (nhanh) — không phải ghi rải rác mọi trang dữ liệu.</li>
</ul>` },

  /* 19 */ { t: 'Sập máy thì sao? — khôi phục (recovery)', body: `
<div class="hai">
<div class="o"><b>SQL Server</b> (theo mô hình ARIES)<br>
① <b>Analysis</b>: đọc log từ checkpoint, tìm giao dịch dở<br>
② <b>Redo</b>: làm lại mọi thay đổi đã ghi log<br>
③ <b>Undo</b>: lùi giao dịch chưa COMMIT</div>
<div class="o xanh"><b>PostgreSQL</b><br>
① <b>Redo</b> WAL từ điểm checkpoint cuối<br>
② Không cần undo: dòng của giao dịch chưa commit vẫn nằm đó nhưng bị đánh dấu <b>không ai thấy</b> (nhờ xmin/xmax) — VACUUM dọn sau</div>
</div>
<ul>
<li><b>Checkpoint</b> định kỳ ghi trang bẩn xuống file dữ liệu ⇒ lần khôi phục sau chỉ phải đọc log từ đó.</li>
<li>Kết quả: đã COMMIT thì <span class="do">không mất</span> (Durability), chưa COMMIT thì <span class="do">như chưa từng xảy ra</span> (Atomicity).</li>
</ul>` },

  /* 20 */ { t: 'Nhìn tận mắt nhật ký', body: `
<div class="hai">
<div>
<p><b>SQL Server</b> — fn_dblog</p>
${code(`BEGIN TRAN;
INSERT ... 3 dòng;
UPDATE ... 1 dòng;
SELECT Operation, COUNT(*)
FROM fn_dblog(NULL, NULL)
WHERE [Transaction ID] = @tid
GROUP BY Operation;
-- LOP_BEGIN_XACT  1
-- LOP_INSERT_ROWS 3
-- LOP_MODIFY_ROW  1
-- LOP_COMMIT_XACT 1`, 'sql')}
</div>
<div>
<p><b>PostgreSQL</b> — pg_walinspect</p>
${code(`SELECT resource_manager,
       record_type, count(*)
FROM pg_get_wal_records_info(
       lsn_truoc, lsn_sau)
WHERE xid = ... GROUP BY 1, 2;
-- Heap  INSERT+INIT 1, INSERT 2
-- Heap  HOT_UPDATE 1
-- Btree NEWROOT 1, INSERT_LEAF 3
-- Transaction COMMIT 1`, 'sql')}
</div>
</div>
<div class="nho">Mỗi dòng INSERT = một bản ghi nhật ký; UPDATE ghi phần đổi; chỉ mục (khoá chính của bảng PostgreSQL) sinh bản ghi riêng. fn_dblog không có tài liệu chính thức.</div>` },

  /* 21 */ { t: 'Thống kê (statistics) — optimizer "đoán" số dòng', body: `
<ul style="font-size:21px;gap:4px">
<li>Optimizer chọn kế hoạch theo <b>chi phí ước lượng</b> ⇒ phải đoán mỗi bước ra <b>bao nhiêu dòng</b> (cardinality).</li>
<li>Nó đoán nhờ <b>thống kê</b>: số dòng, số giá trị khác nhau, <b>histogram</b>, giá trị hay gặp.</li>
<li>Thống kê cũ/sai ⇒ đoán sai ⇒ <span class="do">chọn sai kế hoạch</span> (quét cả bảng thay vì seek, join sai kiểu).</li>
</ul>
<div class="hai">
${code(`-- SQL Server
DBCC SHOW_STATISTICS ('dbo.DonHang',
  ix_donhang_tt) WITH HISTOGRAM;`, 'sql')}
${code(`-- PostgreSQL
ANALYZE don_hang;
SELECT most_common_vals, most_common_freqs
FROM pg_stats WHERE attname = 'trang_thai';`, 'sql')}
</div>
<table style="font-size:18px">
<tr><th>10 000 đơn: WHERE trạng thái =</th><th>Ước lượng</th><th>SQL Server chọn</th><th>PostgreSQL chọn</th></tr>
<tr><td>'LOI' (50 đơn)</td><td>50</td><td>Index Seek + Key Lookup</td><td>Index Scan</td></tr>
<tr><td>'GIAO_XONG' (9950 đơn)</td><td>9950</td><td>Clustered Index Scan</td><td>Seq Scan</td></tr>
</table>` },

  /* 22 */ { t: 'Hành trình một câu SELECT', body: `
<div style="display:flex;flex-direction:column;gap:9px">
${buoc(1, 'Gửi', 'client gửi chữ SQL qua mạng (giao thức TDS / giao thức của PostgreSQL)')}
${buoc(2, 'Parse', 'kiểm cú pháp — sai ⇒ Msg 102 / "syntax error"')}
${buoc(3, 'Bind', 'bảng, cột có thật không? kiểu gì? có quyền không? — sai ⇒ Msg 207 "Invalid column name"')}
${buoc(4, 'Tìm cache', 'SQL Server: câu này đã có kế hoạch trong plan cache chưa? có ⇒ bỏ qua bước 5')}
${buoc(5, 'Optimize', 'thử nhiều kế hoạch, dùng thống kê ước lượng chi phí, chọn cái rẻ nhất')}
${buoc(6, 'Execute', 'chạy cây toán tử; cần trang nào thì xin buffer manager (hit hoặc đọc đĩa)')}
${buoc(7, 'Trả kết quả', 'dòng được gửi dần về client')}
</div>` },

  /* 23 */ { t: 'Cache kế hoạch (plan cache)', body: `
<div class="hai">
<div>
<p><b>SQL Server</b>: dùng chung mọi phiên</p>
${code(`SELECT cp.objtype, cp.usecounts, st.text
FROM sys.dm_exec_cached_plans cp
CROSS APPLY sys.dm_exec_sql_text
            (cp.plan_handle) st ...;
-- Adhoc    1  ... ten = N'An'
-- Adhoc    1  ... ten = N'Bình'
-- Prepared 2  (@1 nvarchar(4000)) ...
-- Prepared 2  (@ten NVARCHAR(50)) ...`, 'sql')}
</div>
<div>
<p><b>PostgreSQL</b>: chỉ trong một phiên</p>
${code(`PREPARE lay(text) AS
  SELECT ten FROM sinh_vien
  WHERE ten = $1;
-- EXECUTE lay(...) 7 lần
SELECT generic_plans, custom_plans
FROM pg_prepared_statements;
-- 2 | 5`, 'sql')}
</div>
</div>
<div class="o">Câu có <b>tham số</b> (sp_executesql, ORM, PreparedStatement) ⇒ <span class="do">một kế hoạch dùng lại nhiều lần</span>; ghép chuỗi giá trị vào SQL ⇒ mỗi giá trị một kế hoạch + nguy cơ SQL injection.</div>` },

  /* 24 */ { t: 'Tóm tắt & câu hỏi phỏng vấn hay gặp', body: `
<ul style="font-size:22px">
<li>Đơn vị I/O là <b>trang 8 KB</b>; chi phí truy vấn ≈ <b>số trang đọc</b> (logical reads / shared hit + read).</li>
<li>Heap = bảng không clustered index; địa chỉ dòng = (file:trang:slot) / ctid (trang, con trỏ).</li>
<li>Dòng dài: SQL Server trần 8060 byte + ROW_OVERFLOW/LOB; PostgreSQL TOAST.</li>
<li>Lần 2 nhanh vì <b>buffer pool / shared_buffers</b> giữ trang trong RAM.</li>
<li><b>WAL</b>: nhật ký xuống đĩa trước dữ liệu ⇒ COMMIT nhanh + khôi phục được sau sập.</li>
<li>Optimizer dựa vào <b>thống kê</b>; kế hoạch được <b>cache</b> — nên dùng câu có tham số.</li>
</ul>
<div class="o xanh" style="font-size:20px">❓ "Vì sao COMMIT nhanh dù chưa ghi dữ liệu xuống file?" · "logical vs physical read?" · "TOAST là gì?" · "Vì sao thống kê cũ làm query chậm?"</div>` },
]);
