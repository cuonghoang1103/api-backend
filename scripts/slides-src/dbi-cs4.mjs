/**
 * dbi-cs4.mjs — DBI202 ⭐ Chuyên sâu 4: GIAO DỊCH & ĐỒNG THỜI (deck tự dựng, không có trong giáo trình trường).
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/dbi-cs4.mjs --out <dir>
 *
 * Mọi dòng thời gian "hai phiên" trên slide là kết quả CHẠY THẬT hai phiên thật:
 *   - SQL Server (Azure SQL Edge, lõi 2019): phiên B là thủ tục do Service Broker kích hoạt chạy nền
 *     (một session khác hẳn), hai phiên đồng bộ bằng SEQUENCE — flm-nguon/_repo/DBI202/gen/sql/cs4/*.sql
 *   - PostgreSQL 16: phiên A, B mở bằng dblink — sql/cs4/*.pg.sql
 */
import { lamDeck, code } from './_cs-chung.mjs';

export const deck = { key: 'cs4', code: 'CS4', title: 'Giao dịch & đồng thời', sub: 'DBI202 · ⭐ Chuyên sâu' };

/* ── màu + helper svg (cùng bộ màu với khuôn) ── */
const C = { cam: '#e08a1e', nau: '#b85a2b', xam: '#404040', nhat: '#fff7ef', xanh: '#2f7d4f', xnhat: '#f1f9f4', lam: '#1b5fa8', lnhat: '#eef5fc', do: '#e02020', dnhat: '#fdf0ee' };
const box = (x, y, w, h, txt, { fill = '#fff', stroke = C.cam, color = C.xam, fs = 17, bold = true, rx = 8 } = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>` +
  txt.split('\n').map((t, i, a) => `<text x="${x + w / 2}" y="${y + h / 2 + (i - (a.length - 1) / 2) * (fs + 3) + fs * 0.35}" text-anchor="middle" font-size="${fs}" font-weight="${bold ? 700 : 400}" fill="${color}">${t}</text>`).join('');
const arrow = (x1, y1, x2, y2, color = C.nau, id = 'mui') =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2.5" marker-end="url(#${id})"/>`;
const txt = (x, y, s, { fs = 16, color = C.xam, bold = false, anchor = 'middle' } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${fs}" font-weight="${bold ? 700 : 400}" fill="${color}">${s}</text>`;
const svg = (w, h, inner) =>
  `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="font-family:Arial,sans-serif;display:block;margin:0 auto">` +
  `<defs><marker id="mui" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${C.nau}"/></marker>` +
  `<marker id="muido" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${C.do}"/></marker>` +
  `<marker id="muixanh" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${C.xanh}"/></marker></defs>${inner}</svg>`;

/* ── Slide 3: hai lịch trình — xen kẽ tuỳ ý vs khả tuần tự ── */
const lichTrinh = (() => {
  const o = (x, y, w, t, mau) => box(x, y, w, 40, t, { fill: mau === 'a' ? C.lnhat : C.xnhat, stroke: mau === 'a' ? C.lam : C.xanh, fs: 15 });
  return svg(1100, 300, [
    txt(10, 28, 'Chạy lần lượt (serial) — luôn đúng', { anchor: 'start', bold: true, fs: 18, color: C.xanh }),
    txt(40, 72, 'A', { bold: true, fs: 20, color: C.lam }), txt(40, 122, 'B', { bold: true, fs: 20, color: C.xanh }),
    o(70, 50, 170, 'A đọc 100', 'a'), o(250, 50, 190, 'A ghi 100−30=70', 'a'),
    o(450, 100, 170, 'B đọc 70', 'b'), o(630, 100, 190, 'B ghi 70−50=20', 'b'),
    txt(870, 128, 'kết quả 20 ✓', { bold: true, fs: 20, color: C.xanh, anchor: 'start' }),
    `<line x1="10" y1="160" x2="1090" y2="160" stroke="#ccc" stroke-width="1.5" stroke-dasharray="6 4"/>`,
    txt(10, 190, 'Xen kẽ (interleaved) — nhanh hơn, nhưng có thể SAI', { anchor: 'start', bold: true, fs: 18, color: C.do }),
    txt(40, 232, 'A', { bold: true, fs: 20, color: C.lam }), txt(40, 282, 'B', { bold: true, fs: 20, color: C.xanh }),
    o(70, 210, 170, 'A đọc 100', 'a'), o(250, 260, 170, 'B đọc 100', 'b'), o(430, 260, 190, 'B ghi 100−50=50', 'b'),
    o(630, 210, 190, 'A ghi 100−30=70', 'a'),
    txt(870, 238, 'kết quả 70 ✗', { bold: true, fs: 20, color: C.do, anchor: 'start' }),
    txt(870, 262, '(mất 50 của B)', { fs: 16, color: C.do, anchor: 'start' }),
  ].join(''));
})();

/* ── Slide 13: một trang heap PostgreSQL chứa hai phiên bản ── */
const haiPhienBan = svg(1100, 250, [
  `<rect x="10" y="10" width="640" height="230" rx="10" fill="#fafafa" stroke="#999" stroke-width="2"/>`,
  txt(340, 36, 'Trang 0 của bảng tk (heap)', { bold: true, fs: 17 }),
  box(80, 55, 550, 70, 'lp 1 · so_du = 100 · xmin = gd nạp · xmax = gd A\nt_ctid → (0,2): "bản mới ở lp 2"', { fill: C.dnhat, stroke: C.do, fs: 16 }),
  box(80, 150, 550, 70, 'lp 2 · so_du = 70 · xmin = gd A · xmax = 0\nt_ctid → (0,2): chính nó = bản mới nhất', { fill: C.xnhat, stroke: C.xanh, fs: 16 }),
  `<path d="M 80 105 C 30 115, 30 165, 76 177" fill="none" stroke="${C.nau}" stroke-width="2.5" marker-end="url(#mui)"/>`,
  txt(48, 146, 'ctid', { fs: 14, color: C.nau, bold: true, anchor: 'start' }),
  box(710, 40, 380, 80, 'Phiên B (A chưa commit)\nđọc ctid (0,1): so_du = 100', { fill: C.lnhat, stroke: C.lam, fs: 16 }),
  box(710, 150, 380, 80, 'Phiên A (chính người sửa)\nđọc ctid (0,2): so_du = 70', { fill: C.xnhat, stroke: C.xanh, fs: 16 }),
  arrow(710, 80, 634, 90, C.lam), arrow(710, 190, 634, 185, C.xanh),
].join(''));

/* ── Slide 17: vòng chờ deadlock ── */
const vongCho = svg(1000, 250, [
  box(60, 80, 220, 90, 'Phiên A\ngiữ khoá dòng 1', { fill: C.lnhat, stroke: C.lam, fs: 19 }),
  box(720, 80, 220, 90, 'Phiên B\ngiữ khoá dòng 2', { fill: C.xnhat, stroke: C.xanh, fs: 19 }),
  `<path d="M 280 100 C 430 20, 570 20, 720 100" fill="none" stroke="${C.do}" stroke-width="3" marker-end="url(#muido)"/>`,
  txt(500, 40, 'A xin dòng 2 → CHỜ B', { bold: true, fs: 18, color: C.do }),
  `<path d="M 720 150 C 570 230, 430 230, 280 150" fill="none" stroke="${C.do}" stroke-width="3" marker-end="url(#muido)"/>`,
  txt(500, 235, 'B xin dòng 1 → CHỜ A', { bold: true, fs: 18, color: C.do }),
  txt(500, 132, 'vòng tròn ⇒ không ai tự thoát', { bold: true, fs: 20, color: C.xam }),
].join(''));

const tl = (rows, head = ['Bước', 'Phiên A', 'Phiên B', 'Kết quả']) =>
  `<table style="font-size:18px"><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr>` +
  rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('') + `</table>`;

export const slides = lamDeck('GIAO DỊCH & ĐỒNG THỜI', [
  /* 1 */ { cover: true, t: 'Giao dịch & đồng thời', sub: 'Khi nhiều người cùng ghi: bất thường, mức cô lập, khoá, MVCC, deadlock — hai phiên chạy thật' },

  /* 2 */ { t: 'Chương 7 đã dạy gì — deck này đi sâu gì', body: `
<div class="hai">
<div class="o">📘 <b>Slide trường (Chapter 7)</b><ul style="font-size:21px">
<li>Giao dịch, BEGIN / COMMIT / ROLLBACK</li>
<li>Bốn tính chất ACID</li>
<li>Dirty read — một ví dụ</li>
<li>Tên bốn mức cô lập</li></ul></div>
<div class="o xanh">⭐ <b>Deck này</b><ul style="font-size:21px">
<li>5 bất thường, mỗi cái một <b>dòng thời gian hai phiên chạy thật</b></li>
<li>Ma trận mức cô lập × bất thường</li>
<li>Khoá (2PL) vs <b>MVCC</b> — SQL Server khác PostgreSQL</li>
<li>Deadlock, FOR UPDATE/UPDLOCK, rowversion, thử lại</li></ul></div>
</div>
<div class="o do2">Mọi bảng "Phiên A / Phiên B" dưới đây là <b>kết quả thật</b> của hai kết nối thật chạy xen kẽ — không phải minh hoạ.</div>` },

  /* 3 */ { t: 'Vì sao đồng thời khó: lịch trình xen kẽ', body: `
${lichTrinh}
<ul style="font-size:22px">
<li>DBMS cho nhiều giao dịch chạy <b>xen kẽ</b> (interleave) để nhanh — nhưng kết quả phải giống <b>một thứ tự lần lượt nào đó</b>.</li>
<li>Tính chất đó gọi là <span class="do">khả tuần tự (serializable)</span>. Mọi "bất thường" dưới đây là cách lịch trình xen kẽ phá nó.</li>
</ul>` },

  /* 4 */ { t: 'Bất thường 1 — Đọc bẩn (dirty read)', body: `
<p style="font-size:22px">Chuyển tiền: A trừ tài khoản còn 70 rồi <b>đổi ý ROLLBACK</b>. B đọc đúng lúc đó.</p>
${tl([
  ['1', 'BEGIN TRAN; UPDATE so_du = 70', '', 'chưa commit'],
  ['2', '', '(READ UNCOMMITTED) SELECT', '<span class="do">70 — số "ma"</span>'],
  ['3', '', '(READ COMMITTED) SELECT', '⏳ chờ khoá (LCK_M_S)'],
  ['4', 'ROLLBACK', '', 'trở lại 100'],
  ['5', '', '↳ SELECT ở bước 3 xong', '100'],
])}
<div class="o"><b>SQL Server</b>: READ COMMITTED mặc định dùng khoá ⇒ người đọc <b>bị chặn</b> chờ người ghi. <b>PostgreSQL</b>: đọc bẩn là <span class="do">không thể</span> — kể cả khi xin READ UNCOMMITTED, B vẫn thấy 100 và không phải chờ.</div>` },

  /* 5 */ { t: 'Bất thường 2 — Đọc không lặp lại', body: `
<p style="font-size:22px"><b>Non-repeatable read</b>: khách xem giá vé hai lần trong <b>cùng một giao dịch</b>; hãng đổi giá ở giữa.</p>
${tl([
  ['1', '(READ COMMITTED) SELECT gia', '', '100'],
  ['2', '', 'UPDATE gia = 120 (commit)', 'xong ngay'],
  ['3', 'SELECT gia lần 2', '', '<span class="do">120 — đổi giữa chừng</span>'],
  ['4–5', '(REPEATABLE READ) SELECT gia', 'UPDATE gia = 150', '120 · B ⏳ chờ (LCK_M_X)'],
  ['6–8', 'SELECT lần 2 → COMMIT', '↳ UPDATE chạy xong', '120 · sau COMMIT, B mới ghi được'],
])}
<div class="o">SQL Server REPEATABLE READ <b>giữ khoá S tới COMMIT</b> ⇒ chặn người ghi. PostgreSQL REPEATABLE READ <b>giữ ảnh chụp (snapshot)</b> ⇒ A vẫn thấy 120, còn B ghi <b>không phải chờ</b>.</div>` },

  /* 6 */ { t: 'Bất thường 3 — Dòng ma (phantom)', body: `
<p style="font-size:22px">Đếm ghế trống của chuyến VN123; hãng mở bán thêm ghế ở giữa.</p>
${tl([
  ['1', '(REPEATABLE READ) đếm ghế trống', '', '2'],
  ['2', '', 'INSERT ghế 2A (trống)', 'xong ngay'],
  ['3', 'đếm lại', '', '<span class="do">3 — dòng ma</span>'],
  ['4–5', '(SERIALIZABLE) đếm ghế trống', 'INSERT ghế 2B', '3 · B ⏳ chờ (LCK_M_RIn_NL)'],
  ['6–8', 'đếm lại → COMMIT', '↳ INSERT chạy xong', '3 · sau COMMIT, B mới chèn được'],
])}
<ul style="font-size:21px">
<li>Khoá dòng không chặn được dòng <b>chưa tồn tại</b> ⇒ SERIALIZABLE của SQL Server khoá cả <b>khoảng khoá (key-range)</b>.</li>
<li>PostgreSQL REPEATABLE READ đã <b>không có dòng ma</b> (đếm lại vẫn 2) — chặt hơn chuẩn yêu cầu.</li>
</ul>` },

  /* 7 */ { t: 'Bất thường 4 — Mất cập nhật (lost update)', body: `
<p style="font-size:22px">Tài khoản 100. A rút 30, B rút 50 — đúng phải còn <b>20</b>. Ứng dụng <b>đọc → tự tính → ghi đè</b>:</p>
${tl([
  ['1', 'SELECT so_du', '', '100'],
  ['2', '', 'SELECT so_du', '100'],
  ['3', '', 'UPDATE so_du = 100 − 50; COMMIT', '50'],
  ['4', 'UPDATE so_du = 100 − 30; COMMIT', '', '70'],
  ['5', 'SELECT (sau cùng)', '', '<span class="do">70 — mất 50 của B</span>'],
])}
<div class="o do2">Xảy ra thật ở <b>READ COMMITTED</b> — mặc định của <b>cả hai</b> hệ. PostgreSQL REPEATABLE READ thì từ chối người ghi sau: <span class="do">40001 could not serialize access due to concurrent update</span>.</div>` },

  /* 8 */ { t: 'Bất thường 5 — Lệch ghi (write skew): trực ca bác sĩ', body: `
<p style="font-size:22px">Luật: luôn còn <b>ít nhất 1</b> bác sĩ trực. An và Bình cùng xin nghỉ, mỗi người <b>sửa dòng của chính mình</b>:</p>
${tl([
  ['1–2', '(SNAPSHOT) An đếm: 2', '(SNAPSHOT) Bình đếm: 2', 'cả hai thấy "còn 2 người"'],
  ['3', 'còn ≥ 2 ⇒ An nghỉ; COMMIT', '', 'thành công'],
  ['4', '', 'còn ≥ 2 ⇒ Bình nghỉ; COMMIT', 'thành công'],
  ['5', 'đếm lại', '', '<span class="do">0 người trực</span>'],
])}
<ul style="font-size:21px">
<li>Hai người sửa <b>hai dòng khác nhau</b> ⇒ không ai chạm ai, snapshot không phát hiện được.</li>
<li>Chặn được: SQL Server <b>UPDLOCK, HOLDLOCK</b> khi đếm · PostgreSQL <b>SERIALIZABLE</b> ⇒ người commit sau nhận <span class="do">40001</span>.</li>
</ul>` },

  /* 9 */ { t: 'Ma trận: mức cô lập × bất thường', body: `
<style>.cs .nd td.c{color:#2f7d4f;font-weight:700}.cs .nd td.k{color:#e02020;font-weight:700}</style><table style="font-size:18px">
<tr><th>Hệ · mức cô lập</th><th>Đọc bẩn</th><th>Không lặp lại</th><th>Dòng ma</th><th>Mất cập nhật</th><th>Lệch ghi</th></tr>
<tr><td>SS · READ UNCOMMITTED</td><td class="k">✗</td><td class="k">✗</td><td class="k">✗</td><td class="k">✗</td><td class="k">✗</td></tr>
<tr><td>SS · READ COMMITTED (khoá) — <b>mặc định</b></td><td class="c">✓</td><td class="k">✗</td><td class="k">✗</td><td class="k">✗</td><td class="k">✗</td></tr>
<tr><td>SS · RCSI (READ COMMITTED + phiên bản)</td><td class="c">✓</td><td class="k">✗</td><td class="k">✗</td><td class="k">✗</td><td class="k">✗</td></tr>
<tr><td>SS · REPEATABLE READ</td><td class="c">✓</td><td class="c">✓</td><td class="k">✗</td><td class="c">✓ <span class="nho">(deadlock)</span></td><td class="k">✗*</td></tr>
<tr><td>SS · SNAPSHOT</td><td class="c">✓</td><td class="c">✓</td><td class="c">✓</td><td class="c">✓ <span class="nho">(lỗi 3960)</span></td><td class="k">✗</td></tr>
<tr><td>SS · SERIALIZABLE</td><td class="c">✓</td><td class="c">✓</td><td class="c">✓</td><td class="c">✓</td><td class="c">✓</td></tr>
<tr><td>PG · READ COMMITTED — <b>mặc định</b></td><td class="c">✓</td><td class="k">✗</td><td class="k">✗</td><td class="k">✗</td><td class="k">✗</td></tr>
<tr><td>PG · REPEATABLE READ (snapshot)</td><td class="c">✓</td><td class="c">✓</td><td class="c">✓</td><td class="c">✓ <span class="nho">(40001)</span></td><td class="k">✗</td></tr>
<tr><td>PG · SERIALIZABLE (SSI)</td><td class="c">✓</td><td class="c">✓</td><td class="c">✓</td><td class="c">✓</td><td class="c">✓ <span class="nho">(40001)</span></td></tr>
</table>
<p class="nho" style="font-size:16px;line-height:1.35">✓ = chặn được · ✗ = có thể xảy ra · SS = SQL Server, PG = PostgreSQL · *chặn được khi hai bên đọc cùng các dòng rồi sửa (thành deadlock), không chặn khi lệch ghi đi qua INSERT dòng mới. Chuẩn SQL-92 chỉ định nghĩa 3 cột đầu; "mất cập nhật", "lệch ghi" do Berenson và cộng sự (1995) phân tích thêm.</p>` },

  /* 10 */ { t: 'Hai trường phái cài đặt: khoá vs nhiều phiên bản', body: `
<table style="font-size:20px">
<tr><th></th><th>Khoá — two-phase locking (2PL)</th><th>MVCC — nhiều phiên bản dòng</th></tr>
<tr><td>Ý tưởng</td><td>Đọc xin khoá S, ghi xin khoá X; xung đột thì <b>chờ</b></td><td>Ghi tạo <b>bản mới</b>, người đọc xem <b>bản cũ</b> đã commit</td></tr>
<tr><td>Người đọc ↔ người ghi</td><td class="do">chặn nhau</td><td>không chặn nhau</td></tr>
<tr><td>Người ghi ↔ người ghi (cùng dòng)</td><td>chặn nhau</td><td>vẫn chặn nhau (khoá dòng)</td></tr>
<tr><td>Cái giá</td><td>chờ đợi, deadlock</td><td>chỗ chứa bản cũ + dọn rác (VACUUM / version store)</td></tr>
<tr><td>Ai dùng</td><td>SQL Server <b>mặc định</b></td><td>PostgreSQL (luôn luôn), Oracle; SQL Server khi bật RCSI / SNAPSHOT</td></tr>
</table>
<div class="o xanh">🧠 Câu thần chú MVCC: <b>"người đọc không chặn người ghi, người ghi không chặn người đọc"</b> (readers don't block writers, writers don't block readers).</div>` },

  /* 11 */ { t: 'Khoá S, U, X — và khoá hai pha (2PL)', body: `
<div class="hai">
<div>
<table style="font-size:19px">
<tr><th>Đang giữ → / Xin ↓</th><th>S</th><th>U</th><th>X</th></tr>
<tr><td><b>S</b> (shared — đọc)</td><td>✓</td><td>✓</td><td class="do">chờ</td></tr>
<tr><td><b>U</b> (update — đọc để sửa)</td><td>✓</td><td class="do">chờ</td><td class="do">chờ</td></tr>
<tr><td><b>X</b> (exclusive — ghi)</td><td class="do">chờ</td><td class="do">chờ</td><td class="do">chờ</td></tr>
</table>
<p class="nho">Khoá U (SQL Server): nhiều người đọc được, nhưng chỉ <b>một</b> người "giữ chỗ để sửa" ⇒ tránh deadlock kiểu "cùng đọc rồi cùng nâng lên X".</p>
</div>
<div>
<ul style="font-size:20px">
<li><b>2PL</b>: giai đoạn <b>xin</b> khoá, rồi giai đoạn <b>nhả</b> — đã nhả thì không xin thêm.</li>
<li><b>2PL nghiêm (strict)</b>: giữ khoá X tới COMMIT/ROLLBACK — cách mọi DBMS thật làm.</li>
</ul>
<table style="font-size:17px;margin-top:12px">
<tr><th>Đo thật (sys.dm_tran_locks)</th><th>Khoá đang giữ</th></tr>
<tr><td>UPDATE 1 dòng, giao dịch còn mở</td><td><b>KEY X</b> · PAGE IX · OBJECT IX</td></tr>
<tr><td>READ COMMITTED: SELECT 2 dòng xong</td><td>0 khoá (S nhả ngay)</td></tr>
<tr><td>REPEATABLE READ: SELECT 2 dòng xong</td><td><b>2 × KEY S</b> · PAGE IS · OBJECT IS</td></tr>
</table>
</div>
</div>` },

  /* 12 */ { t: 'Độ hạt khoá & leo thang khoá (lock escalation)', body: `
<ul style="font-size:21px">
<li>SQL Server khoá theo tầng: <b>KEY/RID</b> (dòng) → <b>PAGE</b> → <b>OBJECT</b> (bảng); tầng trên đặt <b>khoá ý định</b> IS/IX (intent) để báo "bên dưới có người khoá".</li>
<li>Mỗi khoá tốn bộ nhớ ⇒ khi <b>một câu lệnh</b> giữ khoảng <span class="do">≥ 5.000 khoá</span> trên một bảng, SQL Server <b>leo thang</b> thành một khoá cả bảng.</li>
</ul>
<table style="font-size:19px">
<tr><th>Đo thật trên bảng 10.000 dòng</th><th>KEY X</th><th>PAGE IX</th><th>OBJECT</th></tr>
<tr><td>UPDATE 3.000 dòng</td><td>3.000</td><td>7</td><td>IX</td></tr>
<tr><td>UPDATE 8.000 dòng</td><td>0</td><td>0</td><td class="do">X — cả bảng bị khoá</td></tr>
<tr><td>8.000 dòng + <code>LOCK_ESCALATION = DISABLE</code></td><td>8.000</td><td>17</td><td>IX</td></tr>
</table>
<div class="o">PostgreSQL <b>không leo thang</b>: khoá dòng ghi thẳng vào chính dòng (xmax) — khoá 8.000 dòng vẫn chỉ 4 mục trong <code>pg_locks</code>; <code>pgrowlocks</code> đếm được đủ 8.000.</div>` },

  /* 13 */ { t: 'MVCC trong PostgreSQL: xmin, xmax, ctid', body: `
${haiPhienBan}
<ul style="font-size:21px">
<li><b>UPDATE = đánh dấu bản cũ chết (ghi xmax) + chèn bản mới (xmin = giao dịch sửa)</b>. Đo thật bằng <code>pageinspect</code>: trang có <b>2 bản</b> của cùng một dòng.</li>
<li>Mỗi câu lệnh có một <b>ảnh chụp (snapshot)</b>: danh sách giao dịch đã commit ⇒ tự chọn bản nhìn thấy được. A COMMIT xong, B đọc lại thấy (0,2) = 70.</li>
<li>Xem nhanh không cần extension: <code>SELECT xmin, xmax, ctid, * FROM tk;</code></li>
</ul>` },

  /* 14 */ { t: 'Mặt trái MVCC: VACUUM và giao dịch "ngồi lì"', body: `
<ul style="font-size:21px">
<li>Bản cũ ("xác" — dead tuple) nằm lại trong bảng tới khi <b>VACUUM</b> dọn (autovacuum chạy nền tự động).</li>
<li>VACUUM chỉ dọn được bản mà <span class="do">không còn ảnh chụp nào cần</span> ⇒ một giao dịch mở lâu giữ chân mọi bản cũ.</li>
</ul>
<table style="font-size:19px">
<tr><th>Đo thật: bảng 10.000 dòng, UPDATE cả bảng</th><th>sống</th><th>chết (dead)</th></tr>
<tr><td>VACUUM khi phiên A đang mở giao dịch REPEATABLE READ</td><td>10.000</td><td class="do">10.000 — không dọn được</td></tr>
<tr><td>A COMMIT, VACUUM lại</td><td>10.000</td><td>0</td></tr>
</table>
<div class="o do2">Hệ quả: bảng <b>phình (bloat)</b>, chậm dần. Phòng: không để giao dịch treo — <code>idle_in_transaction_session_timeout</code>, theo dõi <code>pg_stat_activity</code> trạng thái <b>idle in transaction</b>.</div>` },

  /* 15 */ { t: 'MVCC trong SQL Server: RCSI & SNAPSHOT', body: `
<table style="font-size:19px">
<tr><th></th><th>RCSI (READ_COMMITTED_SNAPSHOT ON)</th><th>SNAPSHOT (ALLOW_SNAPSHOT_ISOLATION ON)</th></tr>
<tr><td>Bật thế nào</td><td>tuỳ chọn CSDL — READ COMMITTED <b>tự đổi</b> sang đọc phiên bản</td><td>tuỳ chọn CSDL + mỗi phiên <code>SET TRANSACTION ISOLATION LEVEL SNAPSHOT</code></td></tr>
<tr><td>Ảnh chụp</td><td>mỗi <b>câu lệnh</b></td><td>cả <b>giao dịch</b></td></tr>
<tr><td>Hai người ghi cùng dòng</td><td>người sau chờ rồi ghi đè (vẫn có lost update)</td><td>người sau nhận <span class="do">Msg 3960</span> (update conflict)</td></tr>
</table>
<ul style="font-size:20px">
<li>Đo thật khi bật RCSI: A đang giữ UPDATE chưa commit, B đọc được <b>100 ngay</b> — không chờ; version store vừa có thêm <b>1</b> bản cũ.</li>
<li>Đo thật SNAPSHOT: A đọc 100 · B trừ 50 và commit · A đọc lại <b>vẫn 100</b> · A UPDATE → <span class="do">Msg 3960</span>, XACT_STATE() = −1.</li>
<li>Bản cũ nằm trong <b>version store của tempdb</b> (từ SQL Server 2019, nếu bật ADR thì nằm trong chính CSDL).</li>
</ul>` },

  /* 16 */ { t: 'Mặc định của mỗi hệ — và hệ quả thật', body: `
<table style="font-size:19px">
<tr><th>Hệ</th><th>Mặc định</th><th>Người đọc gặp người đang ghi</th></tr>
<tr><td>SQL Server (cài đặt thường, Azure SQL Edge)</td><td>READ COMMITTED <b>dùng khoá</b> (RCSI OFF — đo thật)</td><td class="do">bị chặn, chờ</td></tr>
<tr><td>Azure SQL Database</td><td>READ COMMITTED + <b>RCSI ON</b> sẵn</td><td>đọc bản cũ</td></tr>
<tr><td>PostgreSQL</td><td>READ COMMITTED, MVCC (đo thật)</td><td>đọc bản cũ</td></tr>
<tr><td>MySQL (InnoDB)</td><td>REPEATABLE READ</td><td>đọc bản cũ</td></tr>
</table>
<ul style="font-size:20px">
<li>Chuyển app từ PostgreSQL sang SQL Server: báo cáo chạy lâu <b>bắt đầu chặn</b> người ghi ⇒ cân nhắc bật RCSI.</li>
<li>Ngược lại, đừng tưởng MVCC là "an toàn tuyệt đối": <b>lost update, write skew vẫn xảy ra ở mức mặc định</b>.</li>
</ul>` },

  /* 17 */ { t: 'Deadlock — khi hai giao dịch chờ nhau', body: `
${vongCho}
<ul style="font-size:21px">
<li>Chuyển tiền A→B khoá dòng 1 trước, chuyển B→A khoá dòng 2 trước ⇒ mỗi bên giữ đúng thứ bên kia cần.</li>
<li>Không ai tự thoát được ⇒ DBMS phải <b>chọn một nạn nhân (victim)</b> và huỷ nó. Đo thật (SQL Server): A bị huỷ, B chạy tiếp và COMMIT — dòng 1 = 110, dòng 2 = 90.</li>
</ul>` },

  /* 18 */ { t: 'Hệ tự gỡ deadlock thế nào — và cách tránh', body: `
<div class="hai">
<div class="o"><b>SQL Server</b><ul style="font-size:19px">
<li>Luồng lock monitor dò mặc định <b>mỗi 5 giây</b> (dò dày hơn khi đang có deadlock).</li>
<li>Nạn nhân: <code>DEADLOCK_PRIORITY</code> thấp hơn, bằng nhau thì bên <b>rẻ rollback hơn</b>.</li>
<li>Đo thật: <span class="do">Msg 1205</span> … chosen as the deadlock victim. Rerun the transaction.</li></ul></div>
<div class="o xanh"><b>PostgreSQL</b><ul style="font-size:19px">
<li>Chờ khoá quá <code>deadlock_timeout</code> (mặc định <b>1s</b>) thì phiên đó tự dò vòng chờ.</li>
<li>Bên nào bị huỷ: tài liệu nói <b>không nên trông cậy</b> đoán trước.</li>
<li>Đo thật: <span class="do">40P01 deadlock detected</span>.</li></ul></div>
</div>
<div class="o do2"><b>Cách tránh</b>: khoá theo <b>một thứ tự nhất quán</b> (vd. luôn id nhỏ trước) · giao dịch <b>ngắn</b> · có index cho điều kiện UPDATE · ứng dụng <b>thử lại</b> khi gặp 1205 / 40P01.</div>` },

  /* 19 */ { t: 'Khoá chủ động: FOR UPDATE ↔ UPDLOCK', body: `
<div class="hai">
${code(`-- PostgreSQL
BEGIN;
SELECT so_du FROM tk
WHERE id = 1 FOR UPDATE;
UPDATE tk SET so_du = 70 WHERE id = 1;
COMMIT;`, 'sql')}
${code(`-- SQL Server
BEGIN TRAN;
SELECT so_du FROM tk WITH (UPDLOCK, ROWLOCK)
WHERE id = 1;
UPDATE tk SET so_du = 70 WHERE id = 1;
COMMIT;`, 'sql')}
</div>
<ul style="font-size:20px">
<li>"Đọc <b>và</b> giữ chỗ" (pessimistic): người thứ hai đọc cùng dòng phải <b>chờ</b> ⇒ đọc được số mới. Đo thật cả hai hệ: 100 − 30 − 50 = <b>20 đúng</b>.</li>
<li>Không muốn chờ: PostgreSQL <code>FOR UPDATE NOWAIT</code> → <span class="do">55P03</span> · SQL Server <code>SET LOCK_TIMEOUT 0</code> → <span class="do">Msg 1222</span> (cả hai đo thật).</li>
<li>Khoá U (UPDLOCK) thay vì S: hai người cùng "đọc để sửa" <b>không</b> thể cùng giữ ⇒ không deadlock kiểu nâng S lên X.</li>
</ul>` },

  /* 20 */ { t: 'Hàng đợi việc: SKIP LOCKED ↔ READPAST', body: `
<div class="hai">
${code(`-- PostgreSQL
SELECT id FROM viec
WHERE trang_thai = 'cho'
ORDER BY id LIMIT 1
FOR UPDATE SKIP LOCKED;`, 'sql')}
${code(`-- SQL Server
SELECT TOP (1) id
FROM viec WITH (UPDLOCK, READPAST, ROWLOCK)
WHERE trang_thai = 'cho'
ORDER BY id;`, 'sql')}
</div>
<ul style="font-size:21px">
<li>Nhiều worker cùng lấy việc: dòng đang bị người khác khoá thì <b>bỏ qua</b>, lấy dòng kế — không ai phải chờ ai.</li>
<li>Đo thật: A nhận <b>việc 1</b> (chưa commit), B nhận ngay <b>việc 2</b>, việc 3 còn chờ.</li>
<li>Dùng cho: gửi email hàng loạt, xử lý đơn hàng, hàng đợi tác vụ nền — thay cho một hệ hàng đợi riêng khi quy mô vừa.</li>
</ul>` },

  /* 21 */ { t: 'Optimistic concurrency: cột version / rowversion', body: `
<ul style="font-size:21px">
<li>Không khoá lúc đọc. Lúc lưu thì kiểm: <b>"dòng còn đúng như lúc tôi đọc không?"</b></li>
</ul>
${code(`UPDATE sp SET gia = 90
WHERE id = 1 AND rv = @rv_luc_doc;      -- SQL Server: cột ROWVERSION tự đổi mỗi lần UPDATE
-- PostgreSQL: ... SET gia = 90, phien_ban = phien_ban + 1 WHERE id = 1 AND phien_ban = 1`, 'sql')}
<table style="font-size:19px">
<tr><th></th><th>Pessimistic (FOR UPDATE / UPDLOCK)</th><th>Optimistic (version)</th></tr>
<tr><td>Khi xung đột</td><td>người sau <b>chờ</b></td><td>người sau nhận <b>0 dòng</b> → tải lại, hỏi người dùng</td></tr>
<tr><td>Hợp với</td><td>tranh chấp cao, giao dịch ngắn (rút tiền, giữ ghế)</td><td>ít tranh chấp, người dùng sửa form lâu (web, ORM)</td></tr>
</table>
<div class="o xanh">Đo thật: người khác lưu trước ⇒ rowversion <b>đã đổi</b> · lần lưu mang rv cũ ⇒ <b>0 dòng</b> · tải lại rv mới, lưu lại ⇒ <b>1 dòng</b>, giá = 90.</div>` },

  /* 22 */ { t: 'Lỗi giữa giao dịch: SET XACT_ABORT ON', body: `
<table style="font-size:19px">
<tr><th>Chuyển 50: trừ tài khoản 1, rồi ghi lịch sử tới tài khoản 99 (không tồn tại)</th><th>Sau cùng</th></tr>
<tr><td>SQL Server, <b>XACT_ABORT OFF</b> (mặc định): lỗi Msg 547 chỉ huỷ <b>câu đó</b>, COMMIT vẫn chạy</td><td class="do">TK1 = 50, không có lịch sử</td></tr>
<tr><td>SQL Server, <b>XACT_ABORT ON</b>: lỗi huỷ <b>cả giao dịch</b>, dừng batch</td><td>TK1 = 100, @@TRANCOUNT = 0</td></tr>
<tr><td>PostgreSQL: lỗi 23503 ⇒ mọi câu sau báo <b>25P02</b>, COMMIT trả lời <b>ROLLBACK</b></td><td>TK1 = 100</td></tr>
</table>
${code(`SET XACT_ABORT ON;
BEGIN TRY
  BEGIN TRAN;  /* ... các câu lệnh ... */  COMMIT;
END TRY
BEGIN CATCH
  IF XACT_STATE() <> 0 ROLLBACK;
  THROW;          -- báo lỗi lên ứng dụng, đừng nuốt
END CATCH`, 'sql')}` },

  /* 23 */ { t: 'Thử lại khi xung đột (retry)', body: `
<table style="font-size:19px">
<tr><th>Mã lỗi</th><th>Nghĩa</th><th>Thử lại cả giao dịch?</th></tr>
<tr><td>PG <b>40001</b> serialization_failure</td><td>REPEATABLE READ / SERIALIZABLE xung đột</td><td>✓</td></tr>
<tr><td>PG <b>40P01</b> · SS <b>1205</b></td><td>bị chọn làm nạn nhân deadlock</td><td>✓</td></tr>
<tr><td>SS <b>3960</b></td><td>SNAPSHOT: update conflict</td><td>✓</td></tr>
<tr><td>SS <b>1222</b> · PG <b>55P03</b></td><td>hết thời gian chờ khoá / NOWAIT</td><td>tuỳ nghiệp vụ</td></tr>
</table>
<ul style="font-size:20px">
<li>Chạy lại <b>từ BEGIN</b> (đọc lại dữ liệu mới), không chỉ câu lỗi · giới hạn số lần (vd. 3) · nghỉ ngắn giữa các lần.</li>
<li>Đo thật cả hai hệ: lần 1 gặp xung đột (B chen ngang), lần 2 đọc 50 → ghi 20 → <b>thành công</b>.</li>
</ul>` },

  /* 24 */ { t: 'Giao dịch dài — hậu quả và quy tắc', body: `
<div class="hai">
<div>
<p style="font-size:20px"><b>Đo thật</b> khi A "quên" COMMIT:</p>
<table style="font-size:17px">
<tr><th>Hệ</th><th>Thấy gì</th></tr>
<tr><td>SQL Server</td><td>B: wait_type <b>LCK_M_S</b>, blocking = A; khoá KEY S của B: <b>WAIT</b></td></tr>
<tr><td>PostgreSQL</td><td>A: <b>idle in transaction</b>; B: Lock / transactionid, bị A chặn</td></tr>
</table>
</div>
<div>
<ul style="font-size:19px">
<li>Chặn dây chuyền: một người giữ khoá, cả hàng người chờ.</li>
<li>Log / version store / bản chết không dọn được.</li>
<li>Deadlock dễ xảy ra hơn.</li>
</ul>
</div>
</div>
<div class="o do2"><b>Quy tắc</b>: không chờ người dùng bấm nút <b>bên trong</b> giao dịch · không gọi API ngoài trong giao dịch · làm việc nặng (đọc báo cáo) ngoài giao dịch ghi · đặt <code>lock_timeout</code> / <code>SET LOCK_TIMEOUT</code> và <code>idle_in_transaction_session_timeout</code>.</div>` },

  /* 25 */ { t: 'Tóm tắt — chọn gì khi nào', body: `
<table style="font-size:19px">
<tr><th>Tình huống</th><th>Cách làm</th></tr>
<tr><td>Trừ / cộng một con số (tồn kho, số dư)</td><td><code>UPDATE … SET x = x − 30 WHERE … AND x >= 30</code> — một câu, nguyên tử</td></tr>
<tr><td>Đọc rồi mới quyết định ghi, tranh chấp cao</td><td><code>FOR UPDATE</code> / <code>UPDLOCK</code>, giao dịch ngắn</td></tr>
<tr><td>Người dùng sửa form lâu</td><td>optimistic: cột version / rowversion</td></tr>
<tr><td>Luật trải trên nhiều dòng (trực ca, đặt phòng)</td><td>PG SERIALIZABLE + thử lại · SS UPDLOCK, HOLDLOCK hoặc SERIALIZABLE</td></tr>
<tr><td>Báo cáo đọc lâu trên SQL Server</td><td>bật RCSI (hoặc SNAPSHOT), đừng rải <code>NOLOCK</code></td></tr>
<tr><td>Nhiều worker lấy việc</td><td><code>SKIP LOCKED</code> / <code>READPAST</code></td></tr>
</table>
<div class="o xanh">🧠 Nhớ: mức mặc định của cả hai hệ <b>không</b> chặn lost update và write skew — đó là việc của <b>bạn</b>.</div>` },
]);
