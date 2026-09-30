/**
 * dbi-cs8.mjs — DBI202 ⭐ Chuyên sâu 8: PHỎNG VẤN DATABASE (deck tổng kết cả môn). Deck tự dựng, không phải slide trường.
 * Cách trả lời (khung 3 bước, viết SQL trước mặt người phỏng vấn) · ngân hàng 66 câu lý thuyết theo 12 chủ đề ·
 * 33 bài SQL kinh điển (9 khuôn mẫu) · thiết kế CSDL trong 15 phút + bài mẫu đặt vé xem phim · checklist + 10 câu hỏi ngược.
 * Mọi con số / bảng trên slide lấy từ output THẬT của flm-nguon/DBI202/gen/sql/cs8/*.sql
 * (Azure SQL Edge 15.0 = lõi SQL Server 2019 + PostgreSQL 16).
 * Render: node scripts/_render-slides.mjs --deck scripts/slides-src/dbi-cs8.mjs --out <dir>
 */
import { lamDeck, code } from './_cs-chung.mjs';

export const deck = { key: 'cs8', code: 'CS8', title: 'Phỏng vấn database', sub: 'DBI202 · ⭐ Chuyên sâu' };

const C = { cam: '#e08a1e', nau: '#b85a2b', xam: '#404040', nhat: '#fff7ef', xanh: '#2f7d4f', xnhat: '#f1f9f4', lam: '#1b5fa8', lnhat: '#eef5fc', do: '#e02020' };
const sm = (src) => code(src, 'sql', 'sm');

/* Bảng câu hỏi: [số, câu hỏi, ý chính] */
const bangCH = (rows, fs = 17) => `<table style="font-size:${fs}px">
<tr><th style="width:44px">#</th><th style="width:42%">Câu hỏi</th><th>Ý chính cần nói</th></tr>
${rows.map(([n, q, y]) => `<tr><td><b>${n}</b></td><td>${q}</td><td>${y}</td></tr>`).join('\n')}
</table>`;
const hoc = (t) => `<div class="nho" style="margin-top:-4px">📚 Đã học: ${t}</div>`;

/* ── Slide 3: khung 3 bước ── */
const buoc = (so, t, d, mau) => `<div style="flex:1;border:2px solid ${mau};border-radius:12px;padding:10px 14px;background:#fff">
<div style="font-size:30px;font-weight:700;color:${mau}">${so}</div><div style="font-weight:700;font-size:23px;color:${C.xam}">${t}</div>
<div style="font-size:19px;color:#555;margin-top:4px">${d}</div></div>`;
const khung3 = `<div style="display:flex;gap:14px;align-items:stretch">
${buoc('①', 'Định nghĩa', 'một câu, đúng thuật ngữ', C.cam)}
<div style="align-self:center;font-size:30px;color:#bbb">→</div>
${buoc('②', 'Ví dụ', 'lấy từ đồ án hoặc đời thường, có số', C.lam)}
<div style="align-self:center;font-size:30px;color:#bbb">→</div>
${buoc('③', 'Đánh đổi', 'cái giá, và khi nào KHÔNG nên dùng', C.xanh)}
</div>`;

/* ── Slide 21: dòng thời gian 15 phút ── */
const moc = [['①', 'Hỏi yêu cầu', '2′', 'ai dùng? làm gì? bao nhiêu dữ liệu?'], ['②', 'Thực thể', '3′', 'danh từ trong yêu cầu'],
  ['③', 'Quan hệ', '3′', '1-1 · 1-N · N-N, lực lượng'], ['④', 'Khoá & ràng buộc', '3′', 'PK, FK, UNIQUE, CHECK'],
  ['⑤', 'Index', '2′', 'theo 3 truy vấn chính'], ['⑥', 'Mở rộng', '2′', 'cache, partition, replica']];
const dongTG = `<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:8px">${moc.map(([s, t, p, d], i) => `<div style="border-top:8px solid ${i % 2 ? C.nau : C.cam};background:${C.nhat};border-radius:0 0 10px 10px;padding:8px 10px;min-height:150px">
<div style="font-size:24px;font-weight:700;color:${C.nau}">${s} <span style="font-size:17px;color:#777">${p}</span></div>
<div style="font-weight:700;font-size:20px;color:${C.xam};margin:2px 0 4px">${t}</div><div style="font-size:16px;color:#555">${d}</div></div>`).join('')}</div>`;

/* ── Slide 22: ERD đặt vé ── */
const hop = (x, y, w, ten, cot, fill = '#fff') => {
  const h = 30 + cot.length * 19;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${fill}" stroke="${C.cam}" stroke-width="2"/>` +
    `<rect x="${x}" y="${y}" width="${w}" height="26" rx="8" fill="${C.cam}"/><rect x="${x}" y="${y + 16}" width="${w}" height="10" fill="${C.cam}"/>` +
    `<text x="${x + w / 2}" y="${y + 19}" text-anchor="middle" font-size="16" font-weight="700" fill="#fff">${ten}</text>` +
    cot.map((c, i) => `<text x="${x + 8}" y="${y + 44 + i * 19}" font-size="14" fill="${C.xam}">${c}</text>`).join('');
};
const ln = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#999" stroke-width="2"/>`;
const nh = (x, y, t) => `<text x="${x}" y="${y}" font-size="16" font-weight="700" fill="${C.nau}">${t}</text>`;
const erd = `<svg width="1110" height="360" viewBox="0 0 1110 360" xmlns="http://www.w3.org/2000/svg" style="font-family:Arial,sans-serif;display:block;margin:0 auto">
${ln(190, 60, 400, 60)}${nh(198, 52, '1')}${nh(382, 52, 'N')}
${ln(880, 60, 630, 60)}${nh(862, 52, '1')}${nh(638, 52, 'N')}
${ln(985, 87, 995, 215)}${nh(993, 108, '1')}${nh(1003, 208, 'N')}
${ln(515, 125, 680, 215)}${nh(526, 148, '1')}${nh(652, 208, 'N')}
${ln(905, 270, 865, 270)}${nh(888, 262, '1')}${nh(868, 262, 'N')}
${ln(170, 280, 270, 280)}${nh(176, 272, '1')}${nh(254, 272, 'N')}
${ln(490, 280, 560, 280)}${nh(494, 272, '1')}${nh(544, 272, 'N')}
${hop(20, 20, 170, 'Phim', ['🔑 phim_id', 'ten, thoi_luong'])}
${hop(400, 20, 230, 'SuatChieu', ['🔑 suat_id', 'phim_id FK, phong_id FK', 'bat_dau, ket_thuc', 'gia'])}
${hop(880, 20, 210, 'PhongChieu', ['🔑 phong_id', 'rap, ten (UNIQUE)'])}
${hop(20, 230, 150, 'KhachHang', ['🔑 khach_id', 'email (UNIQUE)'])}
${hop(270, 230, 220, 'DonDatVe', ['🔑 don_id', 'khach_id FK', 'tao_luc, trang_thai'])}
${hop(560, 215, 305, 'Ve', ['🔑 ve_id · don_id FK', '(suat_id, phong_id) FK', '(ghe_id, phong_id) FK', 'gia (chụp lúc đặt) · da_huy'], '#ffe2b8')}
${hop(905, 215, 185, 'Ghe', ['🔑 ghe_id', 'phong_id FK', 'hang, so (UNIQUE)', 'loai'])}
</svg>`;

const ST = '<style>.cs .nd :not(pre)>code{font-size:.84em}</style>';
export const slides = lamDeck('PHỎNG VẤN DATABASE', [
  /* 1 */ { cover: true, t: 'Phỏng vấn database', sub: 'Tổng kết cả môn · 66 câu lý thuyết · 33 bài SQL chạy thật · thiết kế CSDL trong 15 phút · checklist' },

  /* 2 */ { t: 'Phỏng vấn fresher backend hỏi gì về CSDL?', body: `
<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
<div class="o"><b>① Lý thuyết</b> — ACID, chỉ mục, JOIN, chuẩn hoá, mức cô lập… <span class="nho">(slide 3, 5–12: 66 câu)</span></div>
<div class="o xanh"><b>② Viết SQL</b> — trên giấy / màn hình chia sẻ, 10–20 phút một bài <span class="nho">(slide 4, 13–20: 33 bài)</span></div>
<div class="o" style="border-color:${C.lam};background:${C.lnhat}"><b>③ Thiết kế</b> — "vẽ CSDL cho một app quen" <span class="nho">(slide 21–24)</span></div>
<div class="o do2"><b>④ Kinh nghiệm</b> — đồ án: bảng nào, vì sao, từng sai gì <span class="nho">(slide 25: checklist)</span></div>
</div>
<ul>
<li>Họ chấm <b>cách nghĩ</b> nhiều hơn đáp án thuộc lòng: hỏi lại yêu cầu, nói ra đánh đổi, tự bắt lỗi mình.</li>
<li>Deck này là <b>ôn tổng</b>: mỗi câu dẫn về bài đã học — Ch.1–Ch.8 (giáo trình) và ⭐ CS.1–CS.7.</li>
<li>Mọi câu SQL ở đây <b>chạy thật</b> trên SQL Server (Azure SQL Edge) <b>và</b> PostgreSQL 16.</li>
</ul>
<div class="nho">Số vòng và thứ tự khác nhau tuỳ công ty — bốn loại câu hỏi trên thì gần như luôn có mặt.</div>` },

  /* 3 */ { t: 'Khung trả lời lý thuyết: 3 bước', body: `${khung3}
<div class="hai">
<div class="o do2" style="font-size:19px"><b>✗ Trả lời cụt</b><br>"Index giúp truy vấn nhanh hơn."</div>
<div class="o xanh" style="font-size:19px"><b>✓ Đủ 3 bước</b><br>① Cấu trúc phụ (thường là cây B+) để tìm dòng theo khoá mà không quét cả bảng. ② Đồ án em: tìm đơn theo <code>user_id</code> từ quét 200 nghìn dòng thành vài trang. ③ Đổi lại ghi chậm hơn, tốn chỗ; cột ít giá trị khác nhau (giới tính) thì gần như vô ích.</div>
</div>
<ul style="font-size:21px">
<li>Nói <b>30–60 giây</b> rồi dừng — để người phỏng vấn chọn đào sâu chỗ nào.</li>
<li>Không biết thì nói <b>"em chưa làm, nhưng em đoán…"</b> + lập luận — tốt hơn bịa.</li>
</ul>` },

  /* 4 */ { t: 'Viết SQL trước mặt người phỏng vấn', body: `
<ol style="font-size:22px;gap:6px">
<li><b>Hỏi lại yêu cầu</b> trước khi gõ chữ nào (khung đỏ bên dưới).</li>
<li><b>Nói to kế hoạch</b>: "em lọc trước, gom theo phòng, rồi xếp hạng trong CTE".</li>
<li><b>Viết từng bước</b> bằng CTE có tên — dễ đọc, dễ sửa khi bị hỏi vặn.</li>
<li><b>Chạy tay</b> trên 3–4 dòng mẫu, cố tình thử ca biên (NULL, trùng, rỗng).</li>
<li><b>Nói cách thứ hai</b> và chỉ mục cần có — đây là "điểm cộng".</li>
</ol>
<div class="o do2" style="font-size:20px"><b>Câu hỏi làm rõ nên hỏi:</b> Có NULL không? · Trùng thì tính thế nào? · Đồng hạng giữ hết hay cắt? · Không có kết quả thì trả NULL hay 0 dòng? · Sắp theo gì? · Bảng lớn cỡ nào?</div>` },

  /* 5 */ { t: 'Câu 1–6 · Khái niệm &amp; DBMS', body: `${bangCH([
    [1, 'CSDL, DBMS, RDBMS khác nhau thế nào?', 'dữ liệu ≠ phần mềm quản lý; RDBMS = bảng + khoá + SQL'],
    [2, 'Sao không lưu bằng file / Excel?', 'đồng thời, ràng buộc, giao dịch, phân quyền, truy vấn'],
    [3, 'DDL · DML · DCL · TCL là gì?', 'CREATE/ALTER · SELECT/INSERT · GRANT · COMMIT/ROLLBACK'],
    [4, 'OLTP khác OLAP?', 'nhiều giao dịch nhỏ vs quét tổng hợp lớn; lưu theo dòng vs theo cột'],
    [5, 'Thứ tự thực thi logic của SELECT?', 'FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY'],
    [6, 'NULL là gì? NULL = NULL ra gì?', 'giá trị chưa biết · logic 3 trị · UNKNOWN · dùng IS NULL'],
  ], 19)}
${hoc('Ch.1 Cơ sở dữ liệu &amp; DBMS · Ch.6 Truy vấn SQL · ⭐ CS.1 Lịch sử · ⭐ CS.2 Bên trong DBMS')}
<div class="o" style="font-size:19px">Chạy thật: <code>WHERE luong_nam &gt; …</code> (bí danh từ SELECT) → <span class="do">Msg 207 Invalid column name</span> / PostgreSQL <span class="do">column does not exist</span>; <code>NULL = NULL</code> → không TRUE; <code>= NULL</code> đếm 0, <code>IS NULL</code> đếm 1.</div>` },

  /* 6 */ { t: 'Câu 7–12 · Khoá &amp; ràng buộc', body: `${bangCH([
    [7, 'PRIMARY KEY khác UNIQUE?', 'PK: một, không NULL · UNIQUE: nhiều, cho NULL'],
    [8, 'Siêu khoá, khoá ứng viên, khoá chính?', 'xác định duy nhất · tối thiểu · được chọn'],
    [9, 'Khoá ngoại, ON DELETE có những kiểu nào?', 'NO ACTION/RESTRICT · CASCADE · SET NULL · SET DEFAULT'],
    [10, 'Khoá tự nhiên hay khoá thay thế?', 'email/CCCD đổi được ⇒ id thay thế + UNIQUE nghiệp vụ'],
    [11, 'CHECK, DEFAULT, NOT NULL để làm gì?', 'luật nằm ở CSDL: mọi app, mọi script đều bị chặn'],
    [12, 'IDENTITY, SEQUENCE hay UUID?', 'tự tăng không liền mạch · UUID v4 phân mảnh index, v7 có thứ tự'],
  ], 19)}
${hoc('Ch.2 Mô hình quan hệ · Ch.5 SQL DDL · ⭐ CS.6 Thiết kế CSDL thực chiến')}
<div class="o do2" style="font-size:19px">Chạy thật — cột UNIQUE, chèn NULL lần 2: SQL Server <span class="do">Msg 2627 … duplicate key value is (&lt;NULL&gt;)</span> · PostgreSQL chèn được 3 NULL (15+: <code>NULLS NOT DISTINCT</code> mới chặn).</div>` },

  /* 7 */ { t: 'Câu 13–22 · Chuẩn hoá &amp; thiết kế ERD', body: `${bangCH([
    [13, 'Chuẩn hoá để làm gì?', 'bỏ dư thừa ⇒ hết dị thường chèn / sửa / xoá'],
    [14, 'Phân biệt 1NF, 2NF, 3NF', 'giá trị nguyên tố · hết phụ thuộc bộ phận · hết bắc cầu'],
    [15, 'BCNF khác 3NF ở đâu?', 'mọi X → Y không tầm thường: X là siêu khoá'],
    [16, 'Phụ thuộc hàm, bao đóng X⁺ dùng làm gì?', 'tìm khoá, kiểm dạng chuẩn, phân rã'],
    [17, 'Khi nào phi chuẩn hoá?', 'đo thấy đọc chậm; chấp nhận giữ đồng bộ'],
    [18, 'Thực thể, thuộc tính, liên kết, lực lượng?', '1-1 · 1-N · N-N; tham gia bắt buộc / tuỳ chọn'],
    [19, 'Chuyển N-N thành bảng thế nào?', 'bảng nối, khoá ghép 2 FK, thuộc tính của quan hệ'],
    [20, 'Thực thể yếu là gì?', 'khoá mượn của chủ: (empSSN, depName)'],
    [21, 'Kiểu cho tiền và thời gian?', 'DECIMAL không FLOAT · lưu UTC / timestamptz'],
    [22, 'Xoá mềm, lịch sử thay đổi?', 'deleted_at + index lọc · bảng audit / temporal'],
  ], 16)}
${hoc('Ch.3 Mô hình ER · Ch.4 Phụ thuộc hàm &amp; Chuẩn hoá · ⭐ CS.6 Thiết kế CSDL thực chiến')}` },

  /* 8 */ { t: 'Câu 23–30 · JOIN &amp; truy vấn', body: `${bangCH([
    [23, 'Các loại JOIN?', 'INNER · LEFT/RIGHT · FULL · CROSS · tự nối'],
    [24, 'WHERE khác HAVING?', 'lọc dòng trước khi gom / lọc nhóm sau khi gom'],
    [25, 'UNION khác UNION ALL?', 'bỏ trùng (tốn sắp/băm) / giữ nguyên, nhanh hơn'],
    [26, 'DELETE, TRUNCATE, DROP?', 'từng dòng · giải phóng trang · xoá cả bảng'],
    [27, 'COUNT(*), COUNT(cột), COUNT(DISTINCT)?', 'đếm dòng · bỏ NULL · đếm giá trị khác nhau'],
    [28, 'IN, EXISTS hay JOIN?', 'có/không ⇒ EXISTS · cần cột ⇒ JOIN · NOT IN + NULL = rỗng'],
    [29, 'CTE, bảng tạm, view?', 'một câu · một phiên, có index · lưu lâu dài'],
    [30, 'Hàm cửa sổ khác GROUP BY?', 'tính trên nhóm nhưng giữ từng dòng'],
  ], 18)}
${hoc('Ch.2 Đại số quan hệ · Ch.6 Truy vấn SQL · ⭐ CS.5 SQL nâng cao')}
<div class="o" style="font-size:18px">Chạy thật (FUHCompany): COUNT(*) = <b>14</b>, COUNT(empAddress) = <b>13</b>, COUNT(DISTINCT depNum) = <b>5</b> · UNION <b>5</b> dòng, UNION ALL <b>20</b> · TRUNCATE trong giao dịch <b>ROLLBACK được</b> trên cả hai hệ.</div>` },

  /* 9 */ { t: 'Câu 31–37 · Chỉ mục (index)', body: `${bangCH([
    [31, 'Chỉ mục là gì, hoạt động ra sao?', 'cây B+: tìm theo khoá O(log n) thay vì quét'],
    [32, 'Clustered khác nonclustered?', 'bảng chính là cây (1 cái) / cây riêng trỏ về dòng'],
    [33, 'Khi nào có index mà không dùng?', 'hàm trên cột, LIKE \'%x\', ép kiểu, lọc ra quá nhiều dòng'],
    [34, 'Index nhiều cột: thứ tự cột?', 'tiền tố trái; cột so bằng trước, cột khoảng sau'],
    [35, 'Covering index, INCLUDE?', 'đủ cột trong index ⇒ khỏi quay về bảng (key lookup)'],
    [36, 'Nhược điểm của index?', 'ghi chậm hơn, tốn chỗ, phải bảo trì / thống kê'],
    [37, 'Truy vấn chậm — em làm gì?', 'đo → xem plan → seek hay scan → sửa → đo lại'],
  ], 18)}
${hoc('Ch.8 Chỉ mục &amp; Tối ưu · ⭐ CS.2 Bên trong DBMS · ⭐ CS.3 Chỉ mục chuyên sâu')}
<div class="o" style="font-size:18px">Chạy thật: SQL Server — PRIMARY KEY mặc định là <b>CLUSTERED</b>, ghi <code>NONCLUSTERED</code> thì bảng thành <b>HEAP</b>. PostgreSQL — bảng nào cũng là heap, khoá chính chỉ là một <code>btree</code> riêng.</div>` },

  /* 10 */ { t: 'Câu 38–47 · Giao dịch, cô lập, khoá, deadlock', body: `${bangCH([
    [38, 'Giao dịch là gì? ACID?', 'Nguyên tử · Nhất quán · Cô lập · Bền vững'],
    [39, 'Dirty, non-repeatable, phantom, lost update?', 'đọc chưa commit · đọc lại khác · thêm dòng · ghi đè'],
    [40, 'Bốn mức cô lập của chuẩn SQL?', 'RU · RC · RR · SERIALIZABLE — chặn dần các hiện tượng'],
    [41, 'Mặc định của SQL Server và PostgreSQL?', 'đều READ COMMITTED; SQL Server khoá, PG ảnh chụp'],
    [42, 'MVCC là gì?', 'nhiều phiên bản dòng: đọc không chờ ghi'],
    [43, 'Durability nhờ đâu?', 'ghi nhật ký trước (WAL / transaction log) rồi mới báo xong'],
    [44, 'Khoá S và X? Blocking?', 'đọc chung được, ghi độc quyền; phiên sau phải chờ'],
    [45, 'Deadlock là gì, xử lý sao?', 'chờ vòng tròn; DBMS huỷ một nạn nhân; khoá theo cùng thứ tự'],
    [46, 'Khoá lạc quan hay bi quan?', 'cột version + kiểm khi ghi / FOR UPDATE, UPDLOCK'],
    [47, 'Giao dịch dài có hại gì?', 'giữ khoá lâu, log/phiên bản cũ phình, dễ deadlock'],
  ], 16)}
${hoc('Ch.8 (giao dịch) · ⭐ CS.4 Giao dịch &amp; đồng thời')}` },

  /* 11 */ { t: 'Câu 48–56 · View, procedure, trigger · SQL vs NoSQL', body: `${bangCH([
    [48, 'View là gì? View cập nhật được?', 'câu truy vấn có tên · một bảng gốc, không gộp · materialized'],
    [49, 'Stored procedure khác function?', 'proc: làm việc, có giao dịch · function: trả giá trị, dùng trong SELECT'],
    [50, 'Trigger nên dùng khi nào?', 'audit, ràng buộc chéo bảng · tránh logic nghiệp vụ ẩn'],
    [51, 'Logic đặt trong CSDL hay trong app?', 'toàn vẹn ở CSDL · quy trình nghiệp vụ ở app'],
    [52, 'Cursor hay tập hợp (set-based)?', 'một câu trên cả tập nhanh hơn vòng lặp từng dòng'],
    [53, 'SQL khác NoSQL, chọn khi nào?', 'lược đồ + JOIN + ACID / linh hoạt, mở rộng ngang'],
    [54, 'Định lý CAP nói gì?', 'khi mạng bị chia cắt: chọn nhất quán hay sẵn sàng'],
    [55, 'MongoDB hay jsonb của PostgreSQL?', 'tài liệu linh hoạt · jsonb + GIN trong CSDL quan hệ'],
    [56, 'Redis làm cache: rủi ro gì?', 'dữ liệu cũ · cache-aside, TTL, xoá khi ghi'],
  ], 16)}
${hoc('Ch.7 Lập trình: View, Procedure, Trigger · ⭐ CS.1 NoSQL &amp; NewSQL · ⭐ CS.5 JSON')}` },

  /* 12 */ { t: 'Câu 57–66 · Bảo mật · sao lưu · mở rộng', body: `${bangCH([
    [57, 'SQL injection là gì, chống ra sao?', 'nối chuỗi thành lệnh · tham số hoá / ORM'],
    [58, 'Phân quyền thế nào cho đúng?', 'quyền tối thiểu, role, app không dùng sa/postgres'],
    [59, 'Lưu mật khẩu người dùng thế nào?', 'băm chậm có muối (bcrypt/Argon2), không mã hoá 2 chiều'],
    [60, 'Bảo vệ dữ liệu cá nhân?', 'TLS khi truyền, mã hoá khi lưu, che dữ liệu, nhật ký truy cập'],
    [61, 'Sao lưu: full / diff / log, RPO / RTO?', 'mất tối đa bao lâu · khôi phục mất bao lâu · thử restore'],
    [62, 'Nhân bản (replication) để làm gì?', 'bản sao chỉ đọc, chuyển dự phòng; đồng bộ vs trễ'],
    [63, 'Scale up hay scale out?', 'máy to hơn / nhiều máy: replica đọc, shard ghi'],
    [64, 'Partitioning khác sharding?', 'chia bảng trong 1 máy / chia dữ liệu ra nhiều máy'],
    [65, 'Vì sao cần connection pool?', 'mở kết nối đắt; dùng lại một nhóm kết nối'],
    [66, 'Lỗi N+1 truy vấn là gì?', '1 câu lấy danh sách + N câu lấy con ⇒ JOIN / include'],
  ], 16)}
${hoc('⭐ CS.7 Bảo mật &amp; vận hành · khoá PostgreSQL phần 14–15')}` },

  /* 13 */ { t: '33 bài SQL phỏng vấn — 9 khuôn mẫu', body: `
<table style="font-size:17px">
<tr><th>Khuôn mẫu</th><th style="width:210px">Bài</th><th>Công cụ chính · bẫy hay gặp</th></tr>
<tr><td><b>Xếp hạng, thứ N</b></td><td>1 · 2 · 8 · 27</td><td>DENSE_RANK, OFFSET + DISTINCT, WITH TIES · <span class="do">đồng hạng</span></td></tr>
<tr><td><b>Trùng lặp</b></td><td>3 · 4 · 30</td><td>GROUP BY chuẩn hoá, ROW_NUMBER · <span class="do">NULL, hoa thường</span></td></tr>
<tr><td><b>Tự nối, loại trừ, chia</b></td><td>5 · 6 · 7 · 20 · 24 · 26</td><td>self-join, NOT EXISTS · <span class="do">NOT IN + NULL, COUNT(*)</span></td></tr>
<tr><td><b>Cửa sổ, tỷ lệ</b></td><td>9 · 10 · 16</td><td>SUM OVER + ROWS, trung vị · <span class="do">chia nguyên</span></td></tr>
<tr><td><b>Chuỗi liên tiếp, lỗ hổng</b></td><td>11 · 12 · 21 · 28</td><td>ngày − ROW_NUMBER, LAG · <span class="do">trùng ngày, qua năm</span></td></tr>
<tr><td><b>Thời gian, báo cáo</b></td><td>13 · 14 · 15 · 22 · 25</td><td>bảng lịch, cùng kỳ, pivot · <span class="do">ON hay WHERE</span></td></tr>
<tr><td><b>JOIN đếm đúng</b></td><td>19 · 31</td><td>gộp từng bảng con trước · <span class="do">fan-out</span></td></tr>
<tr><td><b>Cây, chuỗi ký tự</b></td><td>17 · 32</td><td>CTE đệ quy, tách chuỗi · <span class="do">kiểu cột, LIKE '%sql%'</span></td></tr>
<tr><td><b>Ghi dữ liệu an toàn</b></td><td>18 · 23 · 29 · 33</td><td>UPSERT, UPDATE CASE, giao dịch · <span class="do">XACT_ABORT</span></td></tr>
</table>
<div class="nho">Lời giải đủ 5 bước (đề → cách nghĩ → lời giải chạy thật → bẫy → cách thứ hai) ở bài tập <b>⭐ CS.8 — 🧪</b>. Chủ đề trùng ⭐ CS.5 thì đã đổi dữ liệu / biến thể.</div>` },

  /* 14 */ { t: 'Lương cao thứ N — và bẫy đồng hạng', body: `
<div class="hai" style="grid-template-columns:1.25fr 1fr">
${sm(`-- thứ N theo MỨC lương (không theo người)
SELECT MAX(luong) FROM (
  SELECT luong,
    DENSE_RANK() OVER (ORDER BY luong DESC) AS h
  FROM L) x
WHERE h = @N;        -- không có ⇒ NULL

-- ✗ bỏ qua N-1 DÒNG, không phải N-1 mức
SELECT luong FROM L ORDER BY luong DESC
OFFSET @N - 1 ROWS FETCH NEXT 1 ROWS ONLY;`)}
<div><table style="font-size:20px">
<tr><th>N</th><th>DENSE_RANK ✓</th><th>OFFSET ✗</th></tr>
<tr><td>1</td><td>300</td><td>300</td></tr>
<tr><td>2</td><td>250</td><td class="do">300</td></tr>
<tr><td>3</td><td>200</td><td class="do">250</td></tr>
<tr><td>4</td><td>NULL</td><td class="do">250</td></tr>
</table><div class="nho">Lương 300, 300, 250, 250, 200 — chạy thật cả hai hệ</div></div>
</div>
<ul style="font-size:21px">
<li>Hỏi lại: <b>"thứ 2 là mức lương thứ 2 hay người thứ 2?"</b> — hai đáp án khác nhau.</li>
<li>Cách khác: <code>MAX(...) WHERE luong &lt; MAX</code> (chỉ N = 2) · đếm số mức lớn hơn = N − 1 · <code>DISTINCT</code> rồi mới OFFSET.</li>
</ul>` },

  /* 15 */ { t: 'Trùng lặp: tìm, xem trước, rồi mới xoá', body: `
${sm(`WITH x AS (SELECT *, ROW_NUMBER() OVER (PARTITION BY email, khoa
                          ORDER BY tao_luc DESC, id DESC) AS rn   -- giữ bản MỚI nhất
           FROM DangKy)
SELECT * FROM x WHERE rn > 1;      -- ① xem những dòng sắp xoá   ② rồi mới DELETE`)}
<table style="font-size:19px">
<tr><th>Việc</th><th>SQL Server</th><th>PostgreSQL</th></tr>
<tr><td>Xoá qua CTE</td><td><code>WITH x AS (…) DELETE FROM x WHERE rn &gt; 1</code></td><td class="do">không được</td></tr>
<tr><td>Xoá "có dòng mới hơn"</td><td><code>DELETE … WHERE EXISTS (…)</code></td><td><code>DELETE … USING</code> (tự nối)</td></tr>
<tr><td>Bảng không có khoá</td><td>CTE + ROW_NUMBER vẫn được</td><td>so cột ẩn <code>ctid</code></td></tr>
<tr><td><code>GROUP BY email</code> (thô)</td><td>3 nhóm: gộp <code>'an@…'</code> với <code>'AN@… '</code></td><td>2 nhóm: phân biệt hoa thường</td></tr>
</table>
<div class="o do2" style="font-size:19px">Bẫy: NULL gộp thành một nhóm "trùng" · hai dòng cùng <code>tao_luc</code> ⇒ cần tiêu chí phụ <code>id</code> · chuẩn hoá bằng <code>LOWER(TRIM(email))</code>.</div>` },

  /* 16 */ { t: 'Tự nối &amp; phép nối loại trừ', body: `
<div class="hai">
<div>${sm(`SELECT e.empName, m.empName AS quan_ly
FROM tblEmployee e
JOIN tblEmployee m
  ON m.empSSN = e.supervisorSSN
WHERE e.empSalary > m.empSalary;`)}
<div class="nho">→ Đặng Tuấn Anh 105 000 &gt; Phạm Quốc Bảo 95 000</div></div>
<div><table style="font-size:18px">
<tr><th>phòng</th><th>COUNT(*)</th><th>COUNT(e.empSSN)</th></tr>
<tr><td>6 (mới)</td><td class="do">1</td><td>0</td></tr>
<tr><td>7 (mới)</td><td class="do">1</td><td>0</td></tr>
</table><div class="nho">LEFT JOIN phòng → nhân viên: dòng đệm NULL vẫn là 1 dòng</div></div>
</div>
<table style="font-size:18px">
<tr><th>Đề</th><th>Cách sai</th><th>Cách đúng</th></tr>
<tr><td>Khách chưa từng mua (có đơn NULL)</td><td><code>NOT IN</code> → <span class="do">0 người</span></td><td><code>NOT EXISTS</code> → Bình, Dũng</td></tr>
<tr><td>Ai mua đủ mọi cuốn sách?</td><td><code>COUNT(*)</code> → <span class="do">An, Bình, Chi</span></td><td><code>COUNT(DISTINCT)</code> / 2 lần NOT EXISTS → An, Chi</td></tr>
<tr><td>Hai lượt đặt phòng chồng nhau</td><td><code>BETWEEN</code> → <span class="do">tính cả cặp chỉ chạm nhau</span></td><td><code>a.tu &lt; b.den AND b.tu &lt; a.den</code></td></tr>
</table>` },

  /* 17 */ { t: 'Hàm cửa sổ: luỹ kế, tỷ trọng, trung vị', body: `
<table style="font-size:18px">
<tr><th>Dự án 3</th><th>giờ</th><th>hạng</th><th>% dự án</th><th>luỹ kế</th></tr>
<tr><td>Hồ Ngọc Hân</td><td>30.0</td><td>1</td><td>37.5</td><td>30.0</td></tr>
<tr><td>Mai Duy An</td><td>25.0</td><td>2</td><td>31.3</td><td>55.0</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>15.0</td><td>3</td><td>18.8</td><td>70.0</td></tr>
<tr><td>Võ Việt Anh</td><td>10.0</td><td>4</td><td>12.5</td><td>80.0</td></tr>
</table>
<div class="hai" style="grid-template-columns:1fr 1fr 1fr;gap:12px">
<div class="o do2" style="font-size:17px"><b>Luỹ kế trùng giờ</b><br>ORDER BY luc (RANGE mặc định): hai giao dịch cùng giây cùng số dư <b>500</b> · đúng: <code>ORDER BY luc, id ROWS …</code> ⇒ 600 rồi 500</div>
<div class="o do2" style="font-size:17px"><b>Chia nguyên</b><br><code>tien / SUM(tien) OVER (…) * 100</code> ⇒ <b>0</b> ở cả hai hệ · viết <code>100.0 * tien / …</code></div>
<div class="o" style="font-size:17px"><b>Trung vị ≠ trung bình</b><br>Phòng 1: trung vị <b>75 000</b>, trung bình 86 250 · <code>PERCENTILE_CONT</code>: SQL Server là hàm cửa sổ, PostgreSQL là hàm gộp</div>
</div>` },

  /* 18 */ { t: 'Chuỗi thời gian: ngày 0, cùng kỳ, liên tiếp', body: `
<div class="hai" style="grid-template-columns:1fr 1.3fr">
<table style="font-size:17px">
<tr><th>ngày</th><th>doanh thu</th><th>so hôm trước</th></tr>
<tr><td>21/09</td><td>200</td><td>NULL</td></tr>
<tr><td>22/09</td><td>150</td><td>−50</td></tr>
<tr><td class="do">23/09</td><td class="do">0</td><td>−150</td></tr>
<tr><td>24/09</td><td>90</td><td>90</td></tr>
<tr><td>25/09</td><td>60</td><td>−30</td></tr>
<tr><td class="do">26/09</td><td class="do">0</td><td>−60</td></tr>
<tr><td>27/09</td><td>200</td><td>200</td></tr>
</table>
<ul style="font-size:19px;gap:6px">
<li><b>Ngày / tháng 0</b>: dựng bảng lịch (CTE đệ quy · <code>generate_series</code>) rồi LEFT JOIN.</li>
<li><span class="do">Điều kiện của bảng phải để trong ON</span> — để ở WHERE thì 6 tháng còn 4.</li>
<li><b>Cùng kỳ</b>: <code>LAG(tien, 12)</code> sai khi thiếu một tháng ⇒ nối theo <code>thang − 1 năm</code>.</li>
<li><b>Ngày liên tiếp</b>: <code>DISTINCT</code> ngày trước, rồi ngày − ROW_NUMBER.</li>
<li><b>Tháng liên tiếp</b>: năm × 12 + tháng (11, 12, 1 mới liền nhau).</li>
<li><b>Phiên truy cập</b>: LAG &gt; 30 phút ⇒ cờ 1, SUM luỹ kế = số phiên.</li>
</ul></div>` },

  /* 19 */ { t: 'Bẫy fan-out: JOIN hai bảng con rồi SUM', body: `
<div style="display:flex;gap:14px;align-items:center;justify-content:center;font-size:21px">
<div class="o">Khách <b>An</b></div><div>→</div><div class="o">2 đơn × 200</div><div>×</div><div class="o">3 lần trả 150 · 150 · 100</div><div>=</div><div class="o do2"><b>6 dòng</b></div></div>
<table style="font-size:19px">
<tr><th>An</th><th>số dòng</th><th>tổng đơn</th><th>đã trả</th><th>SUM(DISTINCT đơn)</th></tr>
<tr><td>JOIN cả hai rồi SUM ✗</td><td class="do">6</td><td class="do">1 200</td><td class="do">800</td><td class="do">200</td></tr>
<tr><td>Gộp từng bảng trước ✓</td><td>1</td><td>400</td><td>400</td><td>—</td></tr>
</table>
${sm(`LEFT JOIN (SELECT ma_khach, SUM(tien) AS tong FROM DonHang   GROUP BY ma_khach) d ON …
LEFT JOIN (SELECT ma_khach, SUM(tien) AS tong FROM ThanhToan GROUP BY ma_khach) t ON …`)}
<div class="o" style="font-size:18px">Trên FUHCompany: nối thêm người phụ thuộc làm giờ dự án của Trần Minh Quang từ <b>10</b> thành <b class="do">20</b> (ông có 2 người phụ thuộc). <code>DISTINCT</code> không phải thuốc chữa: hai đơn cùng 200 bị gộp còn 200.</div>` },

  /* 20 */ { t: 'Ghi dữ liệu an toàn', body: `
<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
<div class="o"><b>UPSERT tồn kho</b><br>Gộp lô nhập theo mã trước (P1 xuất hiện 2 lần). SQL Server: <code>MERGE … WITH (HOLDLOCK)</code>. PostgreSQL: <code>ON CONFLICT … DO UPDATE</code> — quên gộp ⇒ <span class="do">cannot affect row a second time</span>.</div>
<div class="o"><b>Đổi M ↔ F</b><br>Hai câu UPDATE nối tiếp ⇒ <span class="do">cả 4 người thành 'M'</span>. Một câu <code>UPDATE … SET gt = CASE …</code>: mọi dòng đọc giá trị CŨ.</div>
<div class="o do2"><b>Chuyển 300 từ A (200) sang B (100)</b><br>Không <code>XACT_ABORT</code>: lệnh trừ lỗi 547, lệnh cộng vẫn COMMIT ⇒ B = <b>400</b>, tiền tự sinh ra. Đúng: <code>SET XACT_ABORT ON</code> + TRY/CATCH ⇒ 200 / 100.</div>
<div class="o xanh"><b>Số tự tăng có lỗ</b><br>Chèn A1, chèn A2 rồi ROLLBACK, chèn A3 ⇒ id <b>1, 3</b> trên cả hai hệ. Đừng dùng IDENTITY làm "số hoá đơn liên tục".</div>
</div>` },

  /* 21 */ { t: 'Câu hỏi thiết kế: vẽ CSDL trong 15 phút', body: `${dongTG}
<div class="hai">
<div class="o" style="font-size:19px"><b>Hỏi yêu cầu (bước ①)</b><br>Ai dùng, làm được gì? · Một đơn nhiều shop? · Có huỷ, hoàn tiền? · Giá đổi thì đơn cũ ra sao? · Bao nhiêu người dùng, đọc nhiều hay ghi nhiều?</div>
<div class="o xanh" style="font-size:19px"><b>Người phỏng vấn muốn thấy</b><br>Khoá &amp; ràng buộc chặn dữ liệu sai · bảng nối cho N-N · chụp giá lúc mua · index theo truy vấn thật · biết mình đang đánh đổi gì.</div>
</div>` },

  /* 22 */ { t: 'Bài mẫu: đặt vé xem phim — ERD', body: `${erd}
<div class="nho" style="text-align:center">7 bảng, chạy thật trên SQL Server và PostgreSQL · Ve giữ <b>phong_id</b> để hai khoá ngoại ghép bắt "ghế phải thuộc đúng phòng của suất"</div>` },

  /* 23 */ { t: 'Đặt vé: để CSDL chặn đặt trùng ghế', body: `
${sm(`-- mỗi (suất, ghế) chỉ MỘT vé còn hiệu lực — vé huỷ trả ghế lại
CREATE UNIQUE INDEX ux_ve_suat_ghe ON Ve (suat_id, ghe_id) WHERE da_huy = 0;
-- ghế phải thuộc phòng của suất
CONSTRAINT fk_ve_suat FOREIGN KEY (suat_id, phong_id) REFERENCES SuatChieu(suat_id, phong_id),
CONSTRAINT fk_ve_ghe  FOREIGN KEY (ghe_id,  phong_id) REFERENCES Ghe(ghe_id, phong_id)
-- PostgreSQL: không hai suất cùng phòng chồng giờ
EXCLUDE USING gist (phong_id WITH =, tstzrange(bat_dau, ket_thuc) WITH &&)`)}
<div class="hai" style="grid-template-columns:1.3fr 1fr">
<ul style="font-size:18px;gap:4px">
<li>Bình giành ghế A2 đã bán ⇒ <span class="do">Msg 2601 … ux_ve_suat_ghe</span></li>
<li>Ghế phòng P2 cho suất phòng P1 ⇒ <span class="do">Msg 547 … fk_ve_ghe</span></li>
<li>Suất 20:30 chồng suất 19:00–21:05 ⇒ <span class="do">violates exclusion constraint</span></li>
<li>An huỷ A2 ⇒ Bình đặt được</li>
</ul>
<table style="font-size:18px"><tr><th>ghế</th><th>loại</th><th>người giữ</th></tr>
<tr><td>A1</td><td>THUONG</td><td>An</td></tr><tr><td>A2</td><td>THUONG</td><td>Bình</td></tr><tr><td>A3</td><td>VIP</td><td>trống</td></tr></table>
</div>` },

  /* 24 */ { t: 'Shopee · Grab · Facebook mini: thực thể &amp; chỗ hiểm', body: `
<table style="font-size:18px">
<tr><th style="width:150px">App</th><th>Thực thể chính</th><th>Chỗ người phỏng vấn hay hỏi vặn</th></tr>
<tr><td><b>Shopee mini</b></td><td>NguoiDung · Shop · SanPham · <b>BienThe</b> (SKU, giá, tồn) · GioHang · DonHang · ChiTietDon</td><td>đơn tách theo shop · chụp <code>don_gia</code> · trừ tồn kho không âm khi hai người mua cùng lúc</td></tr>
<tr><td><b>Grab mini</b></td><td>NguoiDung · TaiXe · Xe · Chuyen · ViTri (nhiều, theo thời gian) · ThanhToan · DanhGia</td><td>trạng thái chuyến là máy trạng thái · một tài xế một chuyến đang chạy · vị trí ghi rất nhiều</td></tr>
<tr><td><b>Facebook mini</b></td><td>NguoiDung · BanBe (N-N tự nối) · BaiViet · BinhLuan (cây) · CamXuc</td><td>cặp bạn bè lưu một hay hai chiều · đếm like: đếm thật hay cột đếm sẵn · bảng tin phân trang keyset</td></tr>
<tr><td><b>Đặt vé phim</b></td><td>Phim · PhongChieu · Ghe · SuatChieu · DonDatVe · Ve</td><td>chặn đặt trùng ghế · giữ ghế 10 phút · suất chồng giờ</td></tr>
</table>
<div class="nho">Bài tập ⭐ CS.8 có lược đồ "Shopee mini" chạy thật (7 bảng) và bước trừ tồn kho nguyên tử trên PostgreSQL.</div>` },

  /* 25 */ { t: 'Checklist trước buổi phỏng vấn · 10 câu hỏi ngược', body: `
<div class="hai" style="grid-template-columns:1fr 1.15fr">
<div class="o xanh" style="font-size:17px"><b>Checklist</b><ul style="gap:3px;margin-top:4px">
<li>Nói to 66 câu, ghi âm, nghe lại</li>
<li>Tự gõ lại 10 bài SQL không nhìn lời giải</li>
<li>Một câu chuyện đồ án: ERD in sẵn, 1 lỗi từng sửa</li>
<li>Biết mình dùng hệ nào, phiên bản nào</li>
<li>Ôn cú pháp khác nhau: TOP/LIMIT, IDENTITY…</li>
<li>Đọc mô tả công việc: CSDL gì, ORM gì</li>
<li>Máy có sẵn psql / SSMS và CSDL mẫu</li>
</ul></div>
<div class="o" style="font-size:16.5px"><b>Hỏi lại nhà tuyển dụng</b><ol style="gap:1px;margin-top:4px">
<li>Dùng CSDL gì, tự quản hay dịch vụ cloud?</li>
<li>Migration được review, triển khai ra sao?</li>
<li>Bảng lớn nhất cỡ nào? Có partition?</li>
<li>Lần gần nhất thử khôi phục bản sao lưu?</li>
<li>Có read replica? Xử lý độ trễ thế nào?</li>
<li>Phát hiện truy vấn chậm bằng gì?</li>
<li>ORM hay SQL tay? Ai review truy vấn?</li>
<li>Có DBA riêng hay backend tự lo?</li>
<li>Dev truy cập dữ liệu production thế nào?</li>
<li>Sự cố CSDL gần nhất, rút ra điều gì?</li>
</ol></div>
</div>` },
].map((it) => (it.body ? { ...it, body: ST + it.body } : it)));
