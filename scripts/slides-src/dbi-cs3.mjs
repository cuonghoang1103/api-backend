/**
 * dbi-cs3.mjs — DBI202 ⭐ Chuyên sâu 3: CHỈ MỤC CHUYÊN SÂU (deck tự dựng, không có trong giáo trình trường).
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/dbi-cs3.mjs --out <dir>
 *
 * Mọi con số trên slide (số trang, số lần đọc, Seek/Scan/Lookup) lấy từ kế hoạch CHẠY THẬT:
 * flm-nguon/_repo/DBI202/gen/sql/cs3/*.sql (SQL Server — Azure SQL Edge, lõi 2019) và *.pg.sql (PostgreSQL 16).
 */
import { lamDeck, code } from './_cs-chung.mjs';

export const deck = { key: 'cs3', code: 'CS3', title: 'Chỉ mục chuyên sâu', sub: 'DBI202 · ⭐ Chuyên sâu' };

/* ───────────── sơ đồ cây B+ bằng SVG ───────────── */
const CW = 46, CH = 38;
const MAU = { vien: '#8c8c8c', nen: '#ffffff', la: '#fff7ef', do: '#e02020', xanh: '#2f7d4f', cam: '#e08a1e' };

/** Một nút: các ô khoá liền nhau. hl = tô viền đỏ cả nút; mark = { khoá: 'do' | 'xanh' } tô nền từng ô. */
function nut(x, y, keys, { hl = false, la = false, mark = {}, mo = false } = {}) {
  let s = '';
  keys.forEach((k, i) => {
    const m = mark[k];
    const fill = m === 'do' ? '#fde2e2' : m === 'xanh' ? '#dff3e6' : la ? MAU.la : MAU.nen;
    s += `<rect x="${x + i * CW}" y="${y}" width="${CW}" height="${CH}" fill="${fill}" stroke="${hl ? MAU.do : MAU.vien}" stroke-width="${hl ? 3 : 1.5}"/>`;
    const col = m === 'do' ? MAU.do : m === 'xanh' ? MAU.xanh : '#262626';
    s += `<text x="${x + i * CW + CW / 2}" y="${y + CH / 2 + 7}" text-anchor="middle" font-size="19" font-weight="${m ? 800 : 600}" fill="${col}">${k}</text>`;
  });
  if (mo) s = `<g opacity="0.45">${s}</g>`;
  return s;
}
const canh = (x1, y1, x2, y2, hl, mau = MAU.do) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${hl ? mau : '#a6a6a6'}" stroke-width="${hl ? 3.5 : 1.6}"/>`;
const noiLa = (x1, x2, y, hl, mau = MAU.xanh) =>
  `<line x1="${x1}" y1="${y}" x2="${x2 - 4}" y2="${y}" stroke="${hl ? mau : MAU.cam}" stroke-width="${hl ? 3.5 : 2}" marker-end="url(#mt${hl ? 'h' : ''})"/>`;
const defs = `<defs>
<marker id="mt" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="${MAU.cam}"/></marker>
<marker id="mth" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="${MAU.xanh}"/></marker>
</defs>`;

/** Cây 3 tầng dùng chung cho slide 4–6. opt: { duong: [chỉ số cạnh tô đỏ], nutDo: [...], laMark, laNoi: [i…], nhan } */
const LA = [[3, 8, 12], [15, 20, 24], [28, 31, 36], [40, 44, 50], [55, 61, 66], [70, 77, 85]];
function cay({ goc = false, trong = [], la = [], mark = {}, noi = [], nhan = true, conTro = false } = {}) {
  const lx = (i) => 10 + i * 182, LY = 232, TY = 124, GY = 20;
  const TX = [215, 761], GX = 511;
  let s = defs;
  // cạnh gốc → nút trong
  s += canh(GX, GY + CH, TX[0] + 46, TY, goc && trong.includes(0));
  s += canh(GX + CW, GY + CH, TX[1] + 46, TY, goc && trong.includes(1));
  // cạnh nút trong → lá
  for (let t = 0; t < 2; t++) for (let p = 0; p < 3; p++) {
    const li = t * 3 + p;
    s += canh(TX[t] + p * CW, TY + CH, lx(li) + 69, LY, trong.includes(t) && la.includes(li));
  }
  // lá nối nhau
  for (let i = 0; i < 5; i++) s += noiLa(lx(i) + 138, lx(i + 1), LY + CH / 2, noi.includes(i));
  s += nut(GX, GY, [40], { hl: goc });
  s += nut(TX[0], TY, [15, 28], { hl: trong.includes(0) });
  s += nut(TX[1], TY, [55, 70], { hl: trong.includes(1) });
  LA.forEach((k, i) => { s += nut(lx(i), LY, k, { la: true, hl: la.includes(i), mark }); });
  if (conTro) LA.forEach((k, i) => k.forEach((_, j) => {
    const x = lx(i) + j * CW + CW / 2;
    s += `<line x1="${x}" y1="${LY + CH}" x2="${x}" y2="${LY + CH + 16}" stroke="#7f7f7f" stroke-width="1.5" stroke-dasharray="3 2"/>`;
  }));
  if (nhan) {
    s += `<text x="10" y="45" font-size="17" fill="#b85a2b" font-weight="700">Gốc (root)</text>`;
    s += `<text x="10" y="149" font-size="17" fill="#b85a2b" font-weight="700">Nút trong</text>`;
    s += `<text x="10" y="168" font-size="15" fill="#8c8c8c">(internal)</text>`;
    if (conTro) s += `<text x="10" y="306" font-size="16" fill="#b85a2b" font-weight="700">Lá (leaf)<tspan fill="#7f7f7f" font-weight="400"> — nét đứt: con trỏ tới dòng dữ liệu · mũi tên cam: lá nối lá</tspan></text>`;
  }
  return `<svg viewBox="0 0 1070 ${conTro ? 312 : 280}" width="100%" font-family="Arial, sans-serif">${s}</svg>`;
}

/** Cây con cho slide tách nút. */
function cayCon(trong, las, { markLa = {}, hlTrong = false, hlLa = [] } = {}) {
  const lx = (i) => 30 + i * 200, LY = 86, TX = 30 + ((las.length - 1) * 200 + 138) / 2 - (trong.length * CW) / 2;
  let s = defs;
  las.forEach((_, i) => { s += canh(TX + i * CW, 10 + CH, lx(i) + 69, LY, hlTrong && hlLa.includes(i)); });
  for (let i = 0; i < las.length - 1; i++) s += noiLa(lx(i) + las[i].length * CW, lx(i + 1), LY + CH / 2, false);
  s += nut(TX, 10, trong, { hl: hlTrong, mark: markLa });
  las.forEach((k, i) => { s += nut(lx(i), LY, k, { la: true, hl: hlLa.includes(i), mark: markLa }); });
  return `<svg viewBox="0 0 840 130" width="100%" style="max-height:130px" font-family="Arial, sans-serif">${s}</svg>`;
}

/* ───────────── khối nhỏ ───────────── */
const o = (html, cls = '') => `<div class="o ${cls}">${html}</div>`;
const bang = (rows, head, st = '') => `<table${st ? ` style="${st}"` : ''}><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`;
const plan = (txt) => `<pre style="margin:0;background:#f7f7f7;border:1.5px solid #d9d9d9;border-radius:8px;padding:10px 14px;font:16px/1.45 Menlo,Consolas,monospace;color:#262626;white-space:pre;overflow:hidden">${txt}</pre>`;

export const slides = lamDeck('CHỈ MỤC CHUYÊN SÂU', [
  /* 1 */
  { cover: true, t: 'Chỉ mục chuyên sâu', sub: 'B+tree · clustered &amp; heap · index ghép · SARGable · đọc kế hoạch thực thi<br>SQL Server &amp; PostgreSQL — mọi con số đều đo thật' },

  /* 2 */
  { t: 'Vì sao quét toàn bảng chậm?', body: `<div class="hai"><ul>
<li>Dữ liệu nằm trong các <b>trang (page) 8 KB</b> — đơn vị đọc/ghi nhỏ nhất</li>
<li>Không có index ⇒ phải đọc <b>mọi trang</b>, kiểm từng dòng: quét toàn bảng (<i>full scan</i>)</li>
<li>Bảng 50.000 đơn hàng = <b>657 trang</b> (SQL Server), <b>770 trang</b> (PostgreSQL)</li>
<li>Bảng to gấp 10 ⇒ quét lâu gấp ~10: chi phí tăng <span class="do">tuyến tính</span></li>
</ul><div>${bang([
    ['<code>WHERE khachHangId = 42</code><br><span class="nho">không có index</span>', '<b class="do">661</b>'],
    ['<code>WHERE id = 777</code><br><span class="nho">id là khoá clustered</span>', '<b>3</b>'],
  ], ['Truy vấn (SQL Server)', 'Số trang đọc'])}
${o('Cùng một bảng, cùng trả 1–10 dòng: <b>661</b> trang so với <b>3</b> trang. Index tồn tại để biến “đọc hết” thành “đi thẳng tới”.', 'xanh')}</div></div>
<p class="nho">Đo bằng <code>SET STATISTICS IO ON</code> (logical reads) — file <code>cs3/s02-quet-toan-bang</code>.</p>` },

  /* 3 */
  { t: 'Từ cây nhị phân tới B-tree', body: `<ul>
<li>Cây nhị phân: mỗi nút <b>1 khoá, 2 nhánh</b> ⇒ 1 triệu khoá cần ~20 tầng ⇒ ~20 lần đọc đĩa</li>
<li><b>Rudolf Bayer &amp; Edward McCreight</b> (Boeing, 1970; bài báo 1972): <b>B-tree</b> — mỗi nút là <b>cả một trang</b>, chứa hàng trăm khoá</li>
<li>Nhánh rộng (<i>fan-out</i>) vài trăm ⇒ cây rất <b>thấp</b>, và luôn <b>cân bằng</b> (mọi lá cùng độ sâu)</li>
<li><b>B+tree</b>: khoá thật chỉ ở tầng <b>lá</b>, các lá <b>nối nhau</b> ⇒ quét một khoảng rất rẻ</li>
</ul>
${bang([['Cây nhị phân', '2', '≈ 20 tầng'], ['B+tree (khoá INT, trang 8 KB)', '≈ 400–600', '<b class="do">3 tầng</b> (đo thật, slide 8)']], ['Cấu trúc', 'Nhánh mỗi nút', '1 triệu khoá'])}
<p class="nho">Index mặc định của SQL Server, PostgreSQL, MySQL (InnoDB), Oracle đều thuộc họ B-tree/B+tree. Chữ “B” chưa từng được tác giả giải thích (Comer, “The Ubiquitous B-Tree”, 1979).</p>` },

  /* 4 */
  { t: 'Cấu trúc một cây B+ (B+tree)', body: `${cay({ conTro: true })}
<div class="hai" style="gap:18px"><ul style="font-size:21px">
<li><b>Gốc / nút trong</b>: chỉ chứa <b>khoá phân cách</b> + con trỏ xuống trang con</li>
<li>Khoá 40 ở gốc: nhánh trái &lt; 40 ≤ nhánh phải</li>
</ul><ul style="font-size:21px">
<li><b>Lá</b>: đủ mọi khoá, xếp tăng dần, mỗi khoá kèm <b>con trỏ tới dòng</b> (nét đứt)</li>
<li>Lá <b>nối nhau</b> (mũi tên cam) ⇒ đi ngang được</li>
</ul></div>` },

  /* 5 */
  { t: 'Tìm một khoá: khoá = 44', body: `${cay({ goc: true, trong: [1], la: [3], mark: { 44: 'do' }, nhan: false })}
${o(`<b>①</b> Gốc [40]: 44 ≥ 40 → nhánh phải &nbsp; <b>②</b> Nút trong [55|70]: 44 &lt; 55 → nhánh trái &nbsp; <b>③</b> Lá: thấy <span class="do">44</span>`)}
<p>Mỗi tầng = <b>đọc 1 trang</b> ⇒ độ cao cây = số trang phải đọc (ở đây 3). Kế hoạch thực thi gọi đây là <b>Index Seek</b> (SQL Server) / <b>Index Scan</b> có <code>Index Cond</code> (PostgreSQL).</p>` },

  /* 6 */
  { t: 'Tìm một khoảng: 20 ≤ khoá ≤ 45', body: `${cay({ goc: true, trong: [0], la: [1, 2, 3], noi: [1, 2], mark: { 20: 'xanh', 24: 'xanh', 28: 'xanh', 31: 'xanh', 36: 'xanh', 40: 'xanh', 44: 'xanh', 50: 'do' }, nhan: false })}
${o(`<b>①</b> Đi xuống như tìm một khoá, tới lá chứa <b>20</b> &nbsp; <b>②</b> Đi <b>ngang</b> theo liên kết lá (mũi tên xanh) &nbsp; <b>③</b> Gặp <span class="do">50 &gt; 45</span> ⇒ dừng`)}
<p>Không phải quay lên gốc: nhờ lá nối nhau, <code>BETWEEN</code>, <code>&gt;</code>, <code>LIKE 'DH42%'</code> và <code>ORDER BY</code> theo khoá index đều rẻ. Chi phí = độ cao cây + số trang lá đi qua.</p>` },

  /* 7 */
  { t: 'Chèn 47 vào lá đã đầy: tách nút (page split)', body: `<div style="display:grid;grid-template-columns:90px 1fr;align-items:center;gap:4px 10px">
<b style="color:#b85a2b">Trước</b>${cayCon([55, 70], [[40, 44, 50], [55, 61, 66], [70, 77, 85]], { hlLa: [0] })}
<b style="color:#b85a2b">Sau</b>${cayCon([47, 55, 70], [[40, 44], [47, 50], [55, 61, 66], [70, 77, 85]], { hlTrong: true, hlLa: [0, 1], markLa: { 47: 'do' } })}
</div><ul style="font-size:22px">
<li>Lá chỉ chứa tối đa 3 khoá (ví dụ) ⇒ <b>chia đôi</b> thành 2 trang; khoá đầu của trang mới (<span class="do">47</span>) được <b>chép lên cha</b></li>
<li>Cha đầy thì cha cũng tách; <b>gốc tách ⇒ cây cao thêm 1 tầng</b> — cây mọc từ gốc lên nên luôn cân bằng</li>
<li>Cái giá: ghi thêm trang, hai trang chỉ đầy ~một nửa ⇒ <b>phân mảnh</b> (slide 20)</li>
</ul>` },

  /* 8 */
  { t: 'Độ cao cây: vì sao 3–4 lần đọc là đủ', body: `<div class="hai"><div>${bang([
    ['2 (gốc)', '1', '4'], ['1', '4', '1.731'], ['0 (lá)', '1.731', '1.000.000'],
  ], ['Tầng', 'Số trang', 'Số mục (record)'])}
<p class="nho" style="margin-top:10px">SQL Server, index <code>ix_so_k</code> trên 1.000.000 khoá INT (<code>sys.dm_db_index_physical_stats</code>). Tìm <code>k = 777777</code>: <b class="do">3 logical reads</b>. PostgreSQL: <code>tree_level = 2</code> ⇒ cũng <b>3 tầng</b> (11 trang trong, 2.733 lá).</p></div>
<div><ul style="font-size:23px">
<li>Một trang lá chứa ~<b>580</b> khoá INT; một trang trong trỏ tới vài trăm trang con</li>
<li>3 tầng ≈ 500 × 500 × 580 ⇒ <b>cỡ trăm triệu</b> khoá</li>
<li>4 tầng ⇒ <b>hàng chục tỉ</b></li>
<li>Khoá <b>rộng</b> (CHAR(200), GUID…) ⇒ ít khoá mỗi trang ⇒ cây <b>cao hơn</b></li>
</ul>${o('Tầng gốc và tầng trong thường nằm sẵn trong RAM (buffer pool) ⇒ thực tế thường chỉ 1 lần đọc đĩa cho tầng lá.', 'xanh')}</div></div>` },

  /* 9 */
  { t: 'SQL Server: heap, clustered, nonclustered', body: `${bang([
    ['<b>Heap</b> (<code>index_id = 0</code>)', 'Dòng nằm không theo thứ tự nào', 'Index phụ trỏ bằng <b>RID</b> (file:trang:ô) ⇒ <b>RID Lookup</b>'],
    ['<b>Clustered</b> (<code>index_id = 1</code>)', 'Bảng <b>chính là</b> cây B+: lá = dòng dữ liệu, xếp theo khoá. <span class="do">Tối đa 1</span>', '—'],
    ['<b>Nonclustered</b> (<code>index_id ≥ 2</code>)', 'Cây B+ riêng, lá = khoá index + con trỏ', 'Trên bảng clustered: con trỏ = <b>khoá clustered</b> ⇒ <b>Key Lookup</b>'],
  ], ['Loại', 'Lưu thế nào', 'Index phụ tìm về dòng bằng'])}
<ul style="font-size:22px">
<li><code>PRIMARY KEY</code> mặc định tạo <b>clustered index</b> (nếu bảng chưa có); bảng không có clustered index là <b>heap</b></li>
<li>Đo thật: cùng câu <code>WHERE ten = 'KH42'</code> ⇒ heap: <code>Index Seek</code> + <code>RID Lookup</code>; bảng clustered: <code>Index Seek</code> + <code>Clustered Index Seek … LOOKUP</code></li>
<li>Khoá clustered nằm trong <b>mọi</b> index phụ ⇒ nên chọn khoá <b>nhỏ, tăng dần, ít đổi</b> (INT IDENTITY)</li>
</ul>` },

  /* 10 */
  { t: 'PostgreSQL: chỉ có heap + index riêng', body: `<div class="hai"><ul style="font-size:23px">
<li><b>Mọi bảng là heap</b>; mọi index (kể cả <code>PRIMARY KEY</code>) là cấu trúc <b>riêng</b></li>
<li>Index trỏ tới dòng bằng <b>ctid</b> = (trang, ô)</li>
<li><span class="do">Không có clustered index</span></li>
<li><code>CLUSTER bang USING idx</code> viết lại bảng theo index <b>MỘT LẦN</b> — không tự duy trì, và khoá bảng (ACCESS EXCLUSIVE) trong lúc chạy</li>
</ul><div>${bang([
    ['Chèn 10000 → 1', '(54,10)', '(54,9)'],
    ['Sau <code>CLUSTER</code>', '(0,1)', '(0,2)'],
    ['Chèn thêm id = 0', 'id 0 ở <b class="do">(54,9)</b>', 'id 1 vẫn (0,1)'],
  ], ['Bước', 'ctid của id 1', 'ctid của id 2'])}
${o('Dòng mới chèn sau <code>CLUSTER</code> vào chỗ trống ở <b>cuối</b> bảng, không vào đúng thứ tự khoá.', 'do2')}</div></div>` },

  /* 11 */
  { t: 'Key Lookup / RID Lookup (bookmark lookup)', body: `<div class="hai"><div><ul style="font-size:22px">
<li>Index <code>ix_dh_kh(khachHangId)</code> chỉ có <code>khachHangId</code> + <code>id</code></li>
<li><code>SELECT *</code> cần thêm cột ⇒ với <b>mỗi</b> dòng tìm được, tra ngược vào clustered index ⇒ <b>Nested Loops</b> + <b>Key Lookup</b></li>
<li>Tên cũ (SQL Server 2000): <i>Bookmark Lookup</i></li>
</ul>${bang([['<code>SELECT *</code>', 'Seek + Key Lookup ×10', '<b class="do">32</b>'], ['<code>SELECT id</code>', 'Index Seek', '<b>2</b>']], ['Truy vấn (khách 42)', 'Kế hoạch', 'Trang'], 'margin-top:12px')}</div>
<div>${plan(`Nested Loops
 |--Index Seek(ix_dh_kh)
 |--Clustered Index Seek(pk_donhang)
       LOOKUP`)}
<ul style="font-size:21px;margin-top:10px">
<li>PostgreSQL: <b>Index Scan</b> = tìm trong index <b>và</b> đọc heap trong cùng một nút</li>
<li>Index có đủ cột ⇒ <b>Index Only Scan</b></li>
<li>Index phụ PostgreSQL <b>không</b> chứa khoá chính ⇒ <code>SELECT id</code> vẫn phải đọc heap</li>
</ul></div></div>` },

  /* 12 */
  { t: 'Độ chọn lọc (selectivity): khi nào optimizer bỏ index', body: `<div class="hai"><div>${bang([
    ['46 (0,09%)', 'Seek + Key Lookup'], ['184 (0,37%)', 'Seek + Key Lookup'], ['322 (0,64%)', '<b class="do">Clustered Index Scan</b>'],
  ], ['Số dòng khớp', 'SQL Server (index ngayDat)'])}
${bang([['46', 'Bitmap Heap Scan'], ['500 (1%)', 'Index Scan'], ['45.000 (90%)', '<b class="do">Seq Scan</b>']], ['Số dòng khớp', 'PostgreSQL'], 'margin-top:14px')}</div>
<ul style="font-size:22px">
<li><b>Độ chọn lọc</b> = tỉ lệ dòng khớp; càng nhỏ index càng lợi</li>
<li>Mỗi lookup = vài trang đọc <b>nhảy cóc</b>; quá nhiều lookup ⇒ quét tuần tự 657 trang <b>rẻ hơn</b></li>
<li>Điểm đổi (<i>tipping point</i>) ở đây chỉ <b>&lt; 1%</b> số dòng — thấp hơn người mới tưởng</li>
<li>Optimizer ước số dòng nhờ <b>thống kê</b> (statistics, histogram) ⇒ thống kê cũ = kế hoạch sai</li>
<li>PostgreSQL có đường giữa: <b>Bitmap</b> — gom địa chỉ rồi đọc trang theo thứ tự</li>
</ul></div>` },

  /* 13 */
  { t: 'Index ghép: quy tắc tiền tố trái', body: `<p>Index <code>(khachHangId, ngayDat)</code> xếp như danh bạ: theo <b>họ</b> trước, trong cùng họ mới theo <b>tên</b>.</p>
${bang([
    ['<code>khachHangId = 42</code>', 'cột 1', '<b>Index Seek</b>'],
    ["<code>khachHangId = 42 AND ngayDat &gt;= '2024-01-01'</code>", 'cột 1 + 2', '<b>Index Seek</b> (cả 2 cột trong SEEK)'],
    ["<code>ngayDat = '2024-03-15'</code>", 'chỉ cột 2', '<b class="do">Index Scan</b> — đọc hết index'],
  ], ['WHERE', 'Tiền tố dùng được', 'SQL Server (đo thật)'])}
<ul style="font-size:22px">
<li>Chỉ “nhảy thẳng” được khi điều kiện chứa cột <b>đầu tiên</b> (rồi cột 2, cột 3… liền nhau)</li>
<li>PostgreSQL 16 với “chỉ cột 2”: kế hoạch vẫn ghi <code>Index Cond</code> nhưng đọc <b>138 trang</b> index — tức cả index, không phải tìm</li>
<li>PostgreSQL 18 (2025) thêm <b>skip scan</b> cho index B-tree nhiều cột — vẫn chỉ hiệu quả khi cột đầu có ít giá trị khác nhau</li>
</ul>` },

  /* 14 */
  { t: 'Thứ tự cột: so bằng trước, so khoảng sau', body: `<p>Truy vấn: <code style="font-size:21px">WHERE khachHangId = 42 AND ngayDat BETWEEN '2024-01-01' AND '2024-06-30'</code></p>
<div class="hai"><div>${bang([
    ['<code>(ngayDat, khachHangId)</code>', '<b class="do">20</b>', '28'],
    ['<code>(khachHangId, ngayDat)</code>', '<b>2</b>', '5'],
  ], ['Index', 'SQL Server<br><span class="nho">logical reads</span>', 'PostgreSQL<br><span class="nho">buffers</span>'])}
<p class="nho">Cả hai đều “Index Seek” / “Index Cond” — chỉ số trang mới lộ ra khác biệt.</p></div>
<ul style="font-size:22px">
<li>Khoảng đứng trước: phải đi qua <b>mọi</b> mục của 6 tháng (≈ 8.300 mục), rồi lọc <code>khachHangId</code></li>
<li>Bằng đứng trước: 10 đơn của khách 42 nằm <b>liền nhau</b>, đã xếp theo ngày ⇒ lấy đúng 3 mục</li>
<li>Quy tắc: <b>cột so bằng</b> → <b>cột so khoảng</b> → cột <code>ORDER BY</code></li>
<li>“Cột chọn lọc nhất lên đầu” chỉ là mẹo phụ</li>
</ul></div>` },

  /* 15 */
  { t: 'Covering index &amp; INCLUDE', body: `<div class="hai"><div>${code(`CREATE INDEX ix_kh_inc
  ON dbo.DonHang(khachHangId)       -- cột khoá
  INCLUDE (ngayDat, tongTien);      -- chỉ nằm ở lá`, 'sql')}
${bang([['chỉ <code>ix_kh</code>', 'Seek + Key Lookup'], ['<code>ix_kh_inc</code>', '<b>Index Seek</b> — hết Lookup'], ['<code>… ORDER BY tongTien</code>', 'Seek + <b class="do">Sort</b>']], ['SELECT ngayDat, tongTien …', 'SQL Server'])}</div>
<ul style="font-size:22px">
<li><b>Covering index</b>: index chứa <b>mọi cột</b> truy vấn cần ⇒ không phải về bảng</li>
<li><code>INCLUDE</code> (SQL Server 2005, PostgreSQL 11): cột chỉ ở tầng lá — <b>không</b> dùng để tìm, <b>không</b> được sắp</li>
<li>PostgreSQL: <b>Index Only Scan</b>; dòng <code>Heap Fetches</code> = số lần vẫn phải hỏi heap vì <b>visibility map</b> chưa đánh dấu trang “mọi dòng đều thấy được” — sau <code>VACUUM</code> về 0</li>
<li>Đừng nhét cả bảng vào INCLUDE: index to = ghi chậm</li>
</ul></div>` },

  /* 16 */
  { t: 'Filtered index ↔ partial index', body: `${code(`CREATE INDEX ix_cho ON DonHang(ngayDat) WHERE trangThai = 'CHO';   -- giống hệt ở cả hai hệ`, 'sql')}
<div class="hai"><div>${bang([['<code>ix_ngay</code> (đủ)', '50.000', '83', '46'], ['<code>ix_cho</code>', '500', '<b>2</b>', '<b>4</b>']], ['Index', 'Dòng', 'Trang SQL Server', 'Trang PG'])}</div>
${bang([
    ["<code>trangThai = 'CHO'</code> (chữ)", 'Seek <code>ix_cho</code>'],
    ['<code>trangThai = @tt</code> (biến)', '<b class="do">Clustered Index Scan</b>'],
    ['PG, kế hoạch riêng (custom)', 'dùng <code>ix_cho</code>'],
    ['PG, kế hoạch chung (generic)', '<b class="do">không</b> dùng <code>ix_cho</code>'],
  ], ['Điều kiện', 'Kế hoạch (đo thật)'])}</div>
${o('Kế hoạch dùng lại cho <b>mọi</b> giá trị của tham số thì không được phép dựa vào index chỉ đúng khi tham số = <code>\'CHO\'</code>. Điều kiện lọc nên viết <b>bằng chữ</b> trong câu truy vấn.', 'do2')}` },

  /* 17 */
  { t: 'SARGable và không SARGable', body: `<p><b>SARG</b> = <i>Search ARGument</i>: điều kiện để <b>cột trơn</b> một bên, hằng số bên kia ⇒ tìm được trong cây.</p>
${bang([
    ['<code>YEAR(ngayDat) = 2024 AND MONTH(ngayDat) = 3</code>', '<b class="do">Index Scan</b>', '<b class="do">Seq Scan</b>'],
    ["<code>ngayDat &gt;= '2024-03-01' AND ngayDat &lt; '2024-04-01'</code>", '<b>Index Seek</b>', 'Bitmap Index Scan'],
    ["<code>maDon LIKE '%4242'</code>", '<b class="do">Index Scan</b>', '<b class="do">Seq Scan</b>'],
    ["<code>maDon LIKE 'DH4242%'</code>", '<b>Index Seek</b>', '<b class="do">Seq Scan</b> ⚠'],
    ["<code>maDon = N'DH4242'</code> (cột VARCHAR)", '<b class="do">Index Scan</b> ⚠', '—'],
    ['<code>id = 4242.0</code> (cột INT)', 'Seek', '<b class="do">Seq Scan</b> ⚠'],
  ], ['Điều kiện', 'SQL Server', 'PostgreSQL'])}
<p class="nho">⚠ = bẫy theo từng hệ: PostgreSQL với collation <code>en_US.utf8</code> không dùng B-tree thường cho <code>LIKE 'x%'</code>; SQL Server ép cột VARCHAR lên NVARCHAR (<code>CONVERT_IMPLICIT</code>) với collation SQL mặc định; PostgreSQL ép cột INT lên numeric.</p>` },

  /* 18 */
  { t: 'Sửa cho SARGable', body: `<ol style="font-size:22px">
<li><b>Viết lại điều kiện</b>: <code>YEAR(d) = 2024</code> → <code>d &gt;= '2024-01-01' AND d &lt; '2025-01-01'</code></li>
<li><b>Đúng kiểu dữ liệu</b>: tham số cùng kiểu với cột (nhiều driver gửi chuỗi dạng Unicode/NVARCHAR mặc định)</li>
<li><b>SQL Server</b>: cột tính toán + index — optimizer tự khớp <code>YEAR(ngayDat)</code> ⇒ <b>Index Seek</b></li>
<li><b>PostgreSQL</b>: index biểu thức, và <code>varchar_pattern_ops</code> cho <code>LIKE 'tiền tố%'</code></li>
</ol>
<div class="hai">${code(`ALTER TABLE DonHang ADD namDat AS YEAR(ngayDat);
CREATE INDEX ix_namdat ON DonHang(namDat);
-- WHERE YEAR(ngayDat) = 2024  →  Index Seek`, 'sql')}${code(`CREATE INDEX ON donhang (upper(ma_don));
CREATE INDEX ON donhang
  (ma_don varchar_pattern_ops);
-- cả hai → Index Scan (tìm được)`, 'sql')}</div>
<p class="nho"><code>LIKE '%x%'</code> không B-tree nào cứu được — cần GIN + <code>pg_trgm</code> (slide 21) hoặc full-text.</p>` },

  /* 19 */
  { t: 'Index cho khoá ngoại &amp; JOIN', body: `<ul style="font-size:22px">
<li><span class="do">Cả SQL Server lẫn PostgreSQL đều KHÔNG tự tạo index cho cột khoá ngoại</span> (chỉ khoá chính / UNIQUE mới có index)</li>
<li>Thiếu index ⇒ JOIN từ bảng cha sang bảng con phải <b>quét cả bảng con</b>; <code>DELETE</code> một dòng cha cũng quét bảng con để kiểm ràng buộc</li>
</ul>
${bang([
    ['Chưa có <code>ix(donHangId)</code>', 'Hash Match + <b class="do">Clustered Index Scan</b> — 468 trang', 'Assert + <b class="do">Scan</b> bảng con', 'Hash Join + <b class="do">Seq Scan</b> 100.000 dòng'],
    ['Có index', 'Nested Loops + <b>Index Seek</b> — 60 trang', 'Assert + <b>Index Seek</b>', 'Nested Loop + <b>Index Scan</b> (loops=10)'],
  ], ['ChiTietDon (100.000 dòng)', 'JOIN — SQL Server', 'DELETE đơn — SQL Server', 'JOIN — PostgreSQL'])}
${o('Thói quen: tạo khoá ngoại xong thì tạo luôn index cho cột đó — trừ khi chắc chắn không bao giờ JOIN hay xoá từ phía cha.', 'xanh')}` },

  /* 20 */
  { t: 'Cái giá của index: ghi chậm, tốn chỗ, phân mảnh', body: `<div class="hai"><div>${bang([
    ['INSERT 1 dòng', '2 trang', '<b class="do">10 trang</b>'],
    ['Dung lượng (20.000 dòng)', '74 trang', '<b class="do">296 trang</b>'],
  ], ['SQL Server', 'Bảng + 1 index', 'Bảng + 5 index'])}
${bang([['Tuần tự 1→20.000', '527', '0,2%', '99,8%'], ['Xen kẽ 20 lượt', '<b class="do">789</b>', '<b class="do">99,5%</b>', '66,7%'], ['Sau <code>REBUILD</code>', '527', '0%', '99,8%']], ['Chèn khoá', 'Trang', 'Phân mảnh', 'Độ đầy'], 'margin-top:14px')}</div>
<ul style="font-size:22px">
<li>Mỗi index là một cây phải <b>cập nhật</b> ở mọi INSERT/UPDATE/DELETE chạm cột của nó</li>
<li>Chèn khoá <b>không tăng dần</b> (GUID ngẫu nhiên, mã tự nhiên) ⇒ tách trang liên tục ⇒ trang đầy ~2/3, thứ tự vật lý lộn xộn</li>
<li>PostgreSQL cùng thí nghiệm: 75 lá, mật độ 65,7% so với 55 lá, 89,5%; <code>REINDEX</code> đưa về 55</li>
<li>Xoá index không ai dùng: <code>sys.dm_db_index_usage_stats</code> / <code>pg_stat_user_indexes</code></li>
</ul></div>` },

  /* 21 */
  { t: 'Các loại index khác ở PostgreSQL', body: `${bang([
    ['<b>B-tree</b> (mặc định)', '<code>= &lt; &gt; BETWEEN</code>, <code>ORDER BY</code>, <code>LIKE \'x%\'</code> (pattern_ops)', 'hầu hết mọi cột'],
    ['<b>Hash</b>', 'chỉ <code>=</code>', 'khoá dài chỉ so bằng; an toàn khi sập từ bản 10'],
    ['<b>GIN</b>', 'một ô chứa nhiều giá trị', 'mảng, JSONB, full-text, <code>pg_trgm</code> cho <code>LIKE \'%x%\'</code>'],
    ['<b>GiST</b>', 'chồng lấn <code>&amp;&amp;</code>, gần nhất', 'khoảng thời gian (đặt phòng), hình học, PostGIS'],
    ['<b>BRIN</b>', 'tóm tắt min/max cho mỗi dải khối', 'bảng rất lớn, dữ liệu tăng dần theo vị trí (log, thời gian)'],
  ], ['Loại', 'Hỗ trợ', 'Dùng khi'])}
<div class="hai" style="margin-top:4px">${o('Đo thật: 200.000 dòng nhật ký — B-tree <b>551 trang</b>, BRIN <b class="do">3 trang</b> (đổi lại phải đọc thêm và lọc lại: <code>Rows Removed by Index Recheck</code>).', 'xanh')}
${o('<code>LIKE \'%4242%\'</code> + GIN <code>gin_trgm_ops</code> ⇒ <b>Bitmap Index Scan</b> thay vì Seq Scan. SQL Server có loại riêng khác: columnstore, full-text, spatial, XML.')}</div>` },

  /* 22 */
  { t: 'Đọc kế hoạch thực thi — SQL Server', body: `<div class="hai"><div>${plan(`Compute Scalar
 |--Stream Aggregate(GROUP BY khachHangId)
    |--Nested Loops(ORDERED PREFETCH)
       |--Sort(ORDER BY khachHangId)
       |  |--Nested Loops
       |     |--<b style="color:#e02020">Index Seek(ix_ngay)</b>      ①
       |     |--Clustered Index Seek LOOKUP ②
       |--Index Seek(ix_chitiet_donhang) ③`)}
<p class="nho" style="margin-top:8px">JOIN + GROUP BY các đơn ngày 15/03/2024 (<code>SET SHOWPLAN_TEXT ON</code>, rút gọn).</p></div>
<ul style="font-size:21px">
<li><b>Ước tính</b> (không chạy): <code>SET SHOWPLAN_TEXT ON</code>, SSMS <b>Ctrl+L</b></li>
<li><b>Thật</b> (có chạy, số dòng thật): <code>SET STATISTICS PROFILE ON</code>, SSMS <b>Ctrl+M</b></li>
<li><code>SET STATISTICS IO ON</code>: số trang đọc mỗi bảng</li>
<li>Đọc từ nút <b>thụt sâu nhất</b> đi lên (đồ hoạ: phải → trái); nhánh trên của Nested Loops chạy trước, nhánh dưới chạy <b>mỗi dòng một lần</b></li>
<li>Tìm: <b>Scan</b> trên bảng lớn, <b>Lookup</b> lặp nhiều, <b>Sort</b>, ước tính lệch xa số thật</li>
</ul></div>` },

  /* 23 */
  { t: 'Đọc kế hoạch thực thi — PostgreSQL &amp; bảng đối chiếu', body: `<div class="hai"><div>${plan(`GroupAggregate
  -&gt;  Sort
        -&gt;  Nested Loop
              -&gt;  Bitmap Heap Scan on donhang d
                    -&gt;  <b style="color:#e02020">Bitmap Index Scan on ix_ngay</b>
              -&gt;  Index Only Scan using ix_chitiet_dh
                    (actual rows=2 <b>loops=46</b>)`)}<p class="nho">Cùng truy vấn trên PostgreSQL (<code>EXPLAIN ANALYZE</code>, rút gọn).</p>
<ul style="font-size:20px;margin-top:8px">
<li><code>EXPLAIN</code> = ước tính; <code>EXPLAIN ANALYZE</code> = chạy thật (<code>actual rows</code>, <code>loops</code>); thêm <code>BUFFERS</code> = số trang</li>
<li>Đọc từ dòng thụt sâu nhất; <code>rows × loops</code> = tổng thật</li>
</ul></div>
${bang([
    ['Clustered Index Scan / Table Scan', 'Seq Scan'],
    ['Index Seek', 'Index Scan / Bitmap Index Scan'],
    ['Seek + Key Lookup', 'Index Scan (tự đọc heap)'],
    ['Seek trên covering index', 'Index Only Scan'],
    ['Nested Loops / Hash Match / Merge Join', 'Nested Loop / Hash Join / Merge Join'],
    ['Stream / Hash Aggregate', 'GroupAggregate / HashAggregate'],
  ], ['SQL Server', 'PostgreSQL'])}</div>` },

  /* 24 */
  { t: 'Quy trình chẩn đoán một truy vấn chậm', body: `<ol style="font-size:22px">
<li><b>Đo</b> trước khi sửa: <code>STATISTICS IO</code> / <code>EXPLAIN (ANALYZE, BUFFERS)</code> — ghi lại số trang</li>
<li><b>Đọc kế hoạch</b>: Scan trên bảng lớn? Lookup lặp nhiều? Sort? Ước tính lệch thật?</li>
<li><b>Soát điều kiện</b>: có hàm bọc cột, <code>LIKE '%…'</code>, lệch kiểu không? ⇒ viết lại cho SARGable</li>
<li><b>Thiết kế index</b>: cột so bằng → cột so khoảng → cột <code>ORDER BY</code>; <code>INCLUDE</code> cột trong <code>SELECT</code></li>
<li><b>Đo lại</b> và so; kiểm Sort đã biến mất chưa</li>
<li><b>Tính cái giá</b>: bảng ghi nhiều không? có index cũ trùng việc để xoá không?</li>
</ol>
${o('Bài tập cuối deck làm trọn quy trình này: <code>YEAR(ngayDat) = 2025</code> + <code>ORDER BY ngayDat DESC</code> — từ <b class="do">661 trang</b> + Sort xuống <b>2 trang</b>, không Sort (<code>ORDERED BACKWARD</code>).', 'xanh')}` },

  /* 25 */
  { t: 'Tóm tắt', body: `<ul style="font-size:22px">
<li>B+tree: nút = trang 8 KB, fan-out vài trăm ⇒ <b>3–4 tầng</b> cho hàng triệu–hàng tỉ dòng; lá nối nhau ⇒ quét khoảng rẻ</li>
<li>SQL Server: <b>clustered</b> (bảng = cây, tối đa 1) / <b>heap</b>; index phụ tìm về dòng bằng khoá clustered hoặc RID</li>
<li>PostgreSQL: mọi bảng là heap; <code>CLUSTER</code> chỉ sắp <b>một lần</b></li>
<li><b>Lookup</b> mỗi dòng một lần ⇒ vài trăm dòng là optimizer bỏ index; sửa bằng <b>covering index / INCLUDE</b></li>
<li>Index ghép: <b>tiền tố trái</b>; so bằng trước, so khoảng sau</li>
<li>Filtered / partial index: nhỏ, nhưng điều kiện phải là <b>hằng số</b> trong câu</li>
<li><b>SARGable</b>: cột trơn, đúng kiểu, không <code>%</code> đầu — nếu không, index vô dụng</li>
<li>Index cho <b>khoá ngoại</b>; mỗi index làm <b>ghi chậm</b>, tốn chỗ, phân mảnh — đo rồi mới tin</li>
</ul>` },
]);
