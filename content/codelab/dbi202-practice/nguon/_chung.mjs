/**
 * DBI202 · bộ luyện SQL — tiện ích soạn đề (29/10/2026). Đọc content/codelab/README.md mục "SQL" trước.
 *
 * Mỗi đề SQL = một câu hỏi + LỜI GIẢI chạy được trên CẢ SQL Server lẫn PostgreSQL (tập con ANSI chung —
 * bộ xuất từ chối lời giải có cú pháp riêng một hệ). `mongDoi` của mọi kiểm do bộ xuất DỰNG bằng cách chạy lời
 * giải (scripts/codelab-sql-node.mjs) — đừng chép tay bảng kết quả.
 *
 *   sql({ tieuDe, doKho, phut, moTa:{en,vi}, yeuCau:{en:[],vi:[]}, giai, kiem:[kq(), kqAn(), sau(), chan(), duoc(), ma()], … })
 *
 * Kiểm ẩn nên ĐỔI DỮ LIỆU (`themCsdl`: thêm vài dòng sau dữ liệu mẫu) — bắt lời giải "chép cứng" kết quả.
 */
import { doiDau } from '../../web-foundations-practice/nguon/_luoc-do.mjs';
import { FUH, LUOC_DO_FUH } from './_fuh.mjs';

export { doiDau, FUH, LUOC_DO_FUH };
export const KHOA = 'introduction-to-databases';
export const TEP = 'query.sql';

const KHOI_DAU_MAC_DINH = `-- Write ONE standard SQL statement below (it must run on SQL Server AND PostgreSQL).
-- Viết MỘT câu SQL chuẩn bên dưới (chạy được trên cả SQL Server lẫn PostgreSQL).
-- Ctrl/⌘ + Enter: run sample checks · + Shift: submit.

`;

/** Kiểm "bảng kết quả của câu SELECT". */
export const kq = (moTa, tuy = {}) => ({ kiem: 'ket-qua', moTa, ...tuy });
/** Kiểm ẩn, đổi dữ liệu: `themCsdl` chạy sau dữ liệu mẫu. */
export const kqAn = (moTa, themCsdl, tuy = {}) => ({ kiem: 'ket-qua', moTa, an: true, ...(themCsdl ? { themCsdl } : {}), ...tuy });
/** Kiểm sau lệnh DML/DDL: chạy bài rồi `kiemTra` (truy vấn của đề). */
export const sau = (moTa, kiemTra, tuy = {}) => ({ kiem: 'sau-lenh', moTa, kiemTra, ...tuy });
/** Câu thử phải BỊ CHẶN (vi phạm ràng buộc). maLoi: '23505' trùng khoá · '23503' khoá ngoại · '23502' NOT NULL · '23514' CHECK. */
export const chan = (moTa, thu, maLoi, tuy = {}) => ({ kiem: 'bi-chan', moTa, thu, ...(maLoi ? { maLoi } : {}), ...tuy });
/** Câu thử hợp lệ phải chạy được. */
export const duoc = (moTa, thu, tuy = {}) => ({ kiem: 'chay-duoc', moTa, thu, ...tuy });
/** Regex trên mã (đã bỏ chú thích) của tệp bài. */
export const ma = (moTa, khop, phuDinh = false, tuy = {}) => ({ kiem: 'ma-nguon', moTa, khop, tep: tuy.tep ?? TEP, ...(phuDinh ? { phuDinh: true } : {}), ...tuy });

const tepThamChieu = (ten, csdl) => `-- ${ten}: sample schema + data of this task (READ ONLY — the grader loads it by itself; editing this tab changes nothing).
-- ${ten}: lược đồ + dữ liệu mẫu của bài (CHỈ ĐỂ ĐỌC — máy chấm tự nạp; sửa tab này không ảnh hưởng gì).
-- Written in SQL Server syntax, like the PE's DBscript.sql — runs as-is in SSMS.
${csdl.trim()}
`;

/**
 * Một đề SQL nhỏ (thẻ kiểu LeetCode). Trường giống README mục 2; thêm:
 *   giai: lời giải (một chuỗi SQL) · khoiDau?: mã khởi đầu · csdl? (mặc định FUH) · tenCsdl? · luocDo? ({en,vi} HTML)
 *   tep? (mặc định query.sql) · kiem: [...] · tuy?: tuỳ chọn chung của tests (timeoutMs…)
 */
export function sql({ giai, khoiDau, csdl = FUH, tenCsdl = 'FUHCompany', luocDo, tep = TEP, kiem, moTa, tuy = {}, ...rest }) {
  const ld = luocDo === null ? null : luocDo ?? (csdl === FUH ? LUOC_DO_FUH : null);
  const them = (lang) => (ld ? `\n${ld[lang]}` : '');
  const thamChieu = csdl ? { [`${tenCsdl}.sql`]: tepThamChieu(`${tenCsdl}.sql`, csdl) } : {};
  return {
    ...rest,
    ngonNgu: 'sql',
    moTa: { en: `${moTa.en}${them('en')}`, vi: `${moTa.vi}${them('vi')}` },
    khoiDau: { [tep]: khoiDau ?? KHOI_DAU_MAC_DINH, ...thamChieu },
    loiGiai: { [tep]: giai, ...thamChieu },
    tests: { loai: 'sql', phuongNgu: 'ansi-sqlserver', csdl: csdl ?? '', tepChinh: tep, ...tuy, kiem },
  };
}

/** Thuật ngữ hay dùng (ghép vào `thuatNgu` của từng đề). */
export const TN = {
  select: { en: 'SELECT … FROM …', vi: 'chọn cột từ bảng', giaiThich: 'Danh sách cột (projection) lấy từ một hay nhiều bảng.' },
  where: { en: 'WHERE', vi: 'điều kiện lọc dòng', giaiThich: 'Lọc TỪNG DÒNG trước khi gộp nhóm.' },
  orderBy: { en: 'ORDER BY', vi: 'sắp xếp kết quả', giaiThich: 'Không có ORDER BY thì thứ tự dòng là KHÔNG xác định.' },
  alias: { en: 'alias (AS)', vi: 'bí danh', giaiThich: 'Tên tạm cho cột/bảng: e.empName AS FullName.' },
  join: { en: 'INNER JOIN', vi: 'nối trong', giaiThich: 'Chỉ giữ cặp dòng thoả điều kiện ON ở cả hai bảng.' },
  leftJoin: { en: 'LEFT (OUTER) JOIN', vi: 'nối ngoài trái', giaiThich: 'Giữ MỌI dòng bảng trái; không có cặp ⇒ cột bảng phải là NULL.' },
  selfJoin: { en: 'self-join', vi: 'tự nối', giaiThich: 'Nối một bảng với chính nó qua hai bí danh (nhân viên ↔ người giám sát).' },
  aggregate: { en: 'aggregate function', vi: 'hàm gộp', giaiThich: 'COUNT, SUM, AVG, MIN, MAX — biến nhiều dòng thành một giá trị.' },
  groupBy: { en: 'GROUP BY', vi: 'gộp nhóm', giaiThich: 'Mỗi nhóm giá trị giống nhau ⇒ một dòng kết quả.' },
  having: { en: 'HAVING', vi: 'điều kiện trên nhóm', giaiThich: 'Lọc NHÓM sau khi gộp (dùng được hàm gộp); WHERE lọc dòng trước khi gộp.' },
  subquery: { en: 'subquery', vi: 'truy vấn con', giaiThich: 'Câu SELECT lồng trong câu khác (trong WHERE, FROM hoặc SELECT).' },
  correlated: { en: 'correlated subquery', vi: 'truy vấn con tương quan', giaiThich: 'Truy vấn con tham chiếu cột của câu ngoài ⇒ chạy lại cho từng dòng ngoài.' },
  exists: { en: 'EXISTS / NOT EXISTS', vi: 'có tồn tại / không tồn tại', giaiThich: 'Đúng khi truy vấn con trả ≥ 1 dòng; an toàn với NULL hơn NOT IN.' },
  null: { en: 'NULL', vi: 'giá trị chưa biết', giaiThich: 'So sánh với NULL bằng = cho UNKNOWN ⇒ dòng bị loại. Dùng IS NULL / IS NOT NULL.' },
  setOp: { en: 'UNION / INTERSECT / EXCEPT', vi: 'hợp / giao / hiệu', giaiThich: 'Phép tập hợp trên hai câu SELECT cùng số cột, kiểu tương thích; mặc định bỏ dòng trùng.' },
  dml: { en: 'DML', vi: 'ngôn ngữ thao tác dữ liệu', giaiThich: 'INSERT, UPDATE, DELETE.' },
  ddl: { en: 'DDL', vi: 'ngôn ngữ định nghĩa dữ liệu', giaiThich: 'CREATE, ALTER, DROP bảng/view/ràng buộc.' },
  pk: { en: 'PRIMARY KEY', vi: 'khoá chính', giaiThich: 'Định danh duy nhất mỗi dòng: UNIQUE + NOT NULL.' },
  fk: { en: 'FOREIGN KEY', vi: 'khoá ngoại', giaiThich: 'Giá trị phải có ở cột khoá của bảng được tham chiếu (toàn vẹn tham chiếu).' },
  check: { en: 'CHECK constraint', vi: 'ràng buộc kiểm tra', giaiThich: 'Điều kiện mọi dòng phải thoả (vd salary > 0).' },
  view: { en: 'VIEW', vi: 'bảng ảo', giaiThich: 'Câu SELECT được đặt tên, dùng như một bảng; không lưu dữ liệu riêng.' },
  ansi: { en: 'ANSI/ISO SQL', vi: 'SQL chuẩn', giaiThich: 'Phần cú pháp chung mà SQL Server, PostgreSQL… đều hiểu.' },
};

/**
 * ĐỀ LỚN SQL ("bản in" — Lab chương / PE luyện): mỗi câu một tệp Q1.sql … Qn.sql như quy định nộp bài PE thật.
 *   deLonSql({ tieuDe, phu, moTa, chucNangChinh?, yeuCauChung, csdl, tenCsdl, moHinh: [{ ten, truong }], duLieuMau?,
 *              cau: [{ ten, diem, moTa, yeuCau, giai, kiem: [...], saiMau? }], truDiem, nopBai, thuMuc, dangBai, … })
 * Kiểm của câu i tự gắn tep 'Qi.sql' + nhom 'fi' (thang điểm theo câu, như bảng điểm PE). Câu cần CSDL riêng
 * (vd Q1 dựng bảng từ ERD) ⇒ đặt `csdl: ''` hay CSDL khác trên từng kiểm.
 */
export function deLonSql({ tieuDe, phu, moTa, chucNangChinh, yeuCauChung, csdl, tenCsdl = 'DBscript', moHinh, duLieuMau, cau, truDiem, nopBai, thuMuc, ...rest }) {
  const tep = (i) => `Q${i + 1}.sql`;
  const thamChieu = csdl ? { [`${tenCsdl}.sql`]: tepThamChieu(`${tenCsdl}.sql`, csdl) } : {};
  const khoiDau = Object.fromEntries(cau.map((c, i) => [tep(i), `-- Q${i + 1}. ${typeof c.ten === 'string' ? c.ten : c.ten.en}\n-- Write only the statement(s) that answer this question (no USE, no GO, no test commands).\n-- Chỉ viết (các) lệnh trả lời câu này (không USE, không GO, không lệnh chạy thử).\n\n`]));
  const loiGiai = Object.fromEntries(cau.map((c, i) => [tep(i), c.giai]));
  const kiem = cau.flatMap((c, i) => c.kiem.map((k) => ({ ...k, tep: tep(i), nhom: `f${i + 1}` })));
  const saiMau = cau.flatMap((c, i) => (c.saiMau || []).map((s) => ({ [tep(i)]: s })));
  const cay = `${thuMuc}/\n${cau.map((c, i) => `├── ${tep(i)}    -- ${typeof c.ten === 'string' ? c.ten : c.ten.en} (${c.diem} ${c.diem === 1 ? 'mark' : 'marks'})`).join('\n')}`;
  return {
    ...rest,
    tieuDe: typeof tieuDe === 'string' ? tieuDe : tieuDe.en,
    ngonNgu: 'sql',
    dauVao: { en: `The database built by ${tenCsdl}.sql (schema below; full script in the ${tenCsdl}.sql tab).`, vi: `CSDL dựng bởi ${tenCsdl}.sql (lược đồ bên dưới; script đầy đủ ở tab ${tenCsdl}.sql).` },
    dauRa: { en: 'One file per question (Q1.sql … Qn.sql) containing only the statement(s) that answer it; each question is graded independently.', vi: 'Mỗi câu một tệp (Q1.sql … Qn.sql) chỉ chứa (các) lệnh trả lời câu đó; mỗi câu chấm độc lập.' },
    banIn: {
      tieuDe, phu, moTa, chucNangChinh, yeuCauChung,
      tieuDeCay: { en: 'Submission files', vi: 'Tệp nộp bài' },
      cayThuMuc: cay,
      moHinh,
      duLieuMau,
      chucNang: cau.map((c) => ({ ten: c.ten, diem: c.diem, moTa: c.moTa, yeuCau: c.yeuCau })),
      truDiem,
      nopBai,
    },
    khoiDau: { ...khoiDau, ...thamChieu },
    loiGiai: { ...loiGiai, ...thamChieu },
    tests: { loai: 'sql', phuongNgu: 'ansi-sqlserver', csdl: csdl ?? '', tepChinh: tep(0), kiem },
    saiMau,
  };
}

/* ═════════════════════════════════════════════════════════════════════════════════════════════════════
 * MỞ RỘNG 01/11/2026 — phủ MỌI bài học của khoá (xem _TIEN-DO.md). Ba lối soạn mới, cùng ra một đề:
 *   de({ t, k, p, en, vi, yc:[[en,vi]], giai, kiem, sai, gy, lhg, gt, tn, csdl?, tenCsdl?, ld?, khoi?, tuy? })  — SQL chấm trong trình duyệt
 *   cs({ t, k, p, en, vi, cau | bang, loai: 'choice'|'order'|'table', gy, lhg, tn?, kn? })                     — đại số, ERD, FD, chuẩn hoá…
 *   tsql({ t, k, p, en, vi, yc, setup, khoi, giai, kiem:[ck(…)], saiTay:[…], gy, lhg, gt, tn })              — T-SQL chạy TRÊN MÁY người học
 * T-SQL thuần (procedure, function, trigger, cursor, biến, TRY/CATCH, BEGIN TRAN/COMMIT, IDENTITY, TOP, CLUSTERED…) KHÔNG chấm được
 * trong trình duyệt (PGlite ≠ SQL Server) ⇒ tsql(): tệp setup.sql + solution.sql + check.sql (check in PASS/FAIL), chạy trên SQL
 * Server / Azure SQL Edge của người học. Kiểm lời giải/khởi đầu/sai mẫu trên SQL Server thật: node nguon/_kiem-tay.mjs (đọc đầu tệp).
 * ═════════════════════════════════════════════════════════════════════════════════════════════════════ */
import { xaoCauHoi, xaoThuTu, loiGiaiTracNghiem } from '../../_chung/tracNghiem.mjs';

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/** mã nội dòng (escape) */
export const c = (s) => `<code>${esc(s)}</code>`;
/** khối mã (escape) */
export const pre = (s) => `<pre>${esc(Array.isArray(s) ? s.join('\n') : s)}</pre>`;
/** [en, vi] | {en, vi} | chuỗi ⇒ "EN|||VI" */
export const hk = (x) => (Array.isArray(x) ? `${x[0]}|||${x[1]}` : x && typeof x === 'object' ? `${x.en}|||${x.vi}` : x);
const bv = (x) => (Array.isArray(x) ? { en: x[0], vi: x[1] } : x);
export const tn = (en, vi, giaiThich) => ({ en, vi, ...(giaiThich ? { giaiThich } : {}) });

/** Đề SQL gọn (chấm trong trình duyệt, chế độ SQL Server). `moTa` của kiểm nhận [en, vi]. */
export function de(o) {
  const hoa = (k) => ({ ...k, moTa: hk(k.moTa) });
  return sql({
    tieuDe: o.t, doKho: o.k, phut: o.p, khaiNiem: o.kn || [], the: ['dbi202', ...(o.tag || [])],
    ...(o.tq ? { tienQuyet: o.tq } : {}), ...(o.dangBai ? { dangBai: o.dangBai } : {}), ...(o.diem ? { diem: o.diem } : {}),
    moTa: { en: o.en, vi: o.vi },
    yeuCau: { en: o.yc.map((x) => x[0]), vi: o.yc.map((x) => x[1]) },
    giai: o.giai, ...(o.khoi ? { khoiDau: o.khoi } : {}),
    ...(o.csdl !== undefined ? { csdl: o.csdl } : {}), ...(o.tenCsdl ? { tenCsdl: o.tenCsdl } : {}),
    ...(o.ld !== undefined ? { luocDo: o.ld } : {}),
    kiem: o.kiem.map(hoa), ...(o.sai ? { saiMau: o.sai } : {}), ...(o.tuy ? { tuy: o.tuy } : {}),
    goiY: o.gy.map(bv), loiHayGap: o.lhg.map(bv),
    giaiThich: bv(o.gt), thuatNgu: o.tn || [],
  });
}

/* ─── đề tĩnh: choice / order / table ─── */
export const hai = (en, vi) => `<p>${en}</p>${vi ? `<p style="opacity:.75;font-size:.92em"><i>${vi}</i></p>` : ''}`;
export const giaiHai = (en, vi) => `<p>${en}</p>${vi ? `<p><i>VI: ${vi}</i></p>` : ''}`;
const lc = (...ds) => ds.map(([m, noiDung]) => ({ ma: m, noiDung }));
const chu = (h) => String(h || '').replace(/<\/?[a-zA-Z][^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const MAC_DINH_YC = [
  { en: 'Answer every question in the answer panel, then press <b>Submit</b>.', vi: 'Trả lời mọi câu trong khung trả lời rồi bấm <b>Nộp</b>.' },
  { en: 'All answers must be correct to get <b>Accepted</b>; the explanation of every question appears after you submit.', vi: 'Đúng hết mới được <b>Accepted</b>; giải thích từng câu hiện sau khi nộp.' },
];
const MAC_DINH_VIDU = [{ input: 'Question → choose / fill', output: 'Correct / Incorrect + explanation after Submit|||Đúng / Sai + giải thích sau khi Nộp', explanation: 'Each question (or table cell) is one check.|||Mỗi câu (hoặc ô) là một kiểm.' }];

function tinh(q0) {
  const q = { ...q0 };
  const loai = q.loai || 'choice';
  if (loai === 'choice') { q.cauHoi = xaoCauHoi(q.cauHoi); q.giaiThich = loiGiaiTracNghiem(q.cauHoi, q.giaiThich); }
  if (loai === 'order') { q.cauHoi = q.cauHoi.map(xaoThuTu); if (!q.giaiThich) q.giaiThich = q.cauHoi.map((x) => x.giaiThich).join(''); }
  if (loai === 'table' && !q.giaiThich) q.giaiThich = q.bang.map((b) => b.giaiThich).join('');
  const ds = loai === 'table' ? q.bang : q.cauHoi;
  const deChu = ds.map((x, i) => `${i + 1}. ${chu(x.de)}`).join('\n');
  let dap;
  if (loai === 'table') {
    dap = ds.map((b, i) => `${i + 1}. ${chu(b.de)}\n${Object.entries(b.dapAn).map(([o, v]) => `   - ${o}: ${Array.isArray(v) ? v.join(' / ') : v}`).join('\n')}\n   ${chu(b.giaiThich)}`).join('\n\n');
  } else {
    dap = ds.map((x, i) => {
      const d = Array.isArray(x.dapAn) ? (Array.isArray(x.dapAn[0]) ? x.dapAn[0] : x.dapAn) : [x.dapAn];
      const muc = x.luaChon || x.muc || [];
      const ten = d.map((m) => `${m}) ${chu(muc.find((y) => y.ma === m)?.noiDung)}`).join(loai === 'order' ? '  →  ' : ' + ');
      return `${i + 1}. ${chu(x.de)}\n   Answer: ${ten}\n   ${chu(x.giaiThich)}`;
    }).join('\n\n');
  }
  const tests = loai === 'table' ? { loai, bang: q.bang } : { loai, cauHoi: q.cauHoi };
  const { cauHoi: _c, bang: _b, loai: _l, ...rest } = q;
  void _c; void _b; void _l;
  const tieu = typeof q.tieuDe === 'string' ? q.tieuDe : q.tieuDe.en;
  const dem = ds.length;
  const them = {
    en: `<p><i>This set has ${dem} ${loai === 'table' ? (dem > 1 ? 'tables' : 'table') : (dem > 1 ? 'questions' : 'question')}. There is nothing to run: answer in the panel on the right and press Submit. Work each one out yourself first (on paper, or in SSMS on your own SQL Server), then check — every explanation after Submit says why the tempting wrong answer is wrong.</i></p>`,
    vi: `<p><i>Bộ này có ${dem} ${loai === 'table' ? 'bảng' : 'câu'}. Không có gì để chạy: trả lời trong khung bên phải rồi bấm Nộp. Hãy tự giải trước (ra giấy, hoặc chạy trong SSMS trên SQL Server của bạn) rồi mới kiểm — giải thích sau khi Nộp nói rõ vì sao phương án "trông đúng" lại sai.</i></p>`,
  };
  const moTa = { en: q.moTa.en + them.en, vi: (q.moTa.vi || q.moTa.en) + them.vi };
  return {
    ngonNgu: 'text', the: ['dbi202'], dangBai: 'practice', yeuCau: MAC_DINH_YC, viDu: MAC_DINH_VIDU, thuatNgu: [],
    ...rest, moTa, tests,
    khoiDau: { 'answers.md': `# ${tieu}\n\nAnswer in the answer panel (no code needed).\n\n${deChu}\n` },
    loiGiai: { 'answers.md': `# ${tieu} — answer key\n\n${dap}\n` },
  };
}
/** Một câu trắc nghiệm: đáp án đúng là phương án ĐẦU trong `opts` (tinh() xáo theo nội dung). de/gt = [en, vi]. */
export function q(m, deCau, opts, gt) {
  return { ma: m, de: hai(deCau[0], deCau[1]), luaChon: lc(...opts.map((t, i) => ['abcdef'[i], t])), dapAn: ['a'], giaiThich: giaiHai(gt[0], gt[1]) };
}
/** Trắc nghiệm nhiều đáp án: `dung` = chỉ số (0-based) các phương án đúng. */
export function qn(m, deCau, opts, dung, gt) {
  return { ma: m, de: hai(deCau[0], deCau[1]), luaChon: lc(...opts.map((t, i) => ['abcdef'[i], t])), dapAn: [dung.map((i) => 'abcdef'[i]).sort()], nhieu: true, giaiThich: giaiHai(gt[0], gt[1]) };
}
/** Sắp thứ tự: các bước viết ĐÚNG thứ tự; tinh() xáo và đổi mã. */
export function ord(m, deCau, steps, gt) {
  return { ma: m, de: hai(deCau[0], deCau[1]), muc: steps.map((n, i) => ({ ma: `s${i + 1}`, noiDung: n })), dapAn: steps.map((_, i) => `s${i + 1}`), giaiThich: giaiHai(gt[0], gt[1]) };
}
/** Một bảng: bang1(ma, [en,vi], cot:[{ma,ten,luaChon?}], hang:[{o:{cột:'cho sẵn'}, a:{cột:'đáp án'|[các dạng]}}], [giải en, vi]) */
export function bang1(m, deCau, cot, hang, gt) {
  const dapAn = {};
  hang.forEach((h, i) => { for (const [k, v] of Object.entries(h.a)) dapAn[`r${i + 1}.${k}`] = v; });
  return { ma: m, de: hai(deCau[0], deCau[1]), cot, hang: hang.map((h, i) => ({ ma: `r${i + 1}`, o: h.o })), dapAn, giaiThich: giaiHai(gt[0], gt[1]) };
}
/** Bộ tĩnh: cs({ t, k, p, en, vi, cau | bang, loai?, gy, lhg, tn?, kn?, tag? }) — gy/lhg là [[en, vi]…]. */
export function cs({ t, k, p, en, vi, cau, bang, loai = 'choice', gy, lhg, tn: thuat = [], kn = [], tag = [], dangBai }) {
  return tinh({
    tieuDe: t, doKho: k, phut: p, moTa: { en, vi }, loai, ...(loai === 'table' ? { bang } : { cauHoi: cau }),
    goiY: gy.map(bv), loiHayGap: lhg.map(bv), thuatNgu: thuat, khaiNiem: kn, the: ['dbi202', ...tag], ...(dangBai ? { dangBai } : {}),
  });
}

/* ─── T-SQL chạy TRÊN MÁY người học: setup.sql + solution.sql + check.sql ─── */
export const CSDL_TAY = 'DBI202_CL';
const sq = (s) => String(s).replace(/'/g, "''");
/**
 * Một kiểm của check.sql. `than` là T-SQL chạy trong sp_executesql với hai tham số OUTPUT: @ok BIT (đặt 1 = đạt) và
 * @info NVARCHAR(4000) (lời nhắn khi trượt). Thân nên tự BEGIN TRAN … ROLLBACK để kiểm sau không thấy dữ liệu kiểm trước.
 * Lỗi bất kỳ (kể cả "Could not find stored procedure") ⇒ TRƯỢT kèm thông báo lỗi; check.sql luôn tự ROLLBACK phần dở.
 */
export const ck = (ten, than) => ({ ten, than });

function dungCheck(tieu, kiem) {
  const dong = [];
  dong.push(`-- check.sql — self-check for: ${tieu}`);
  dong.push('-- Generated with the exercise — DO NOT EDIT. Run it AFTER setup.sql and your solution.sql (see the task text).');
  dong.push('-- Tự kiểm cho bài này — sinh kèm đề, ĐỪNG SỬA. Chạy SAU setup.sql và solution.sql của bạn (xem đề).');
  dong.push(`USE ${CSDL_TAY};`, 'GO', 'SET NOCOUNT ON;', 'DECLARE @ok BIT, @info NVARCHAR(4000), @pass INT = 0, @fail INT = 0;', `PRINT N'────────── check.sql: ${kiem.length} checks ──────────';`);
  kiem.forEach((k, i) => {
    const [en, vi] = Array.isArray(k.ten) ? k.ten : [k.ten, k.ten];
    const nhan = `${i + 1}. ${en} | ${vi}`;
    dong.push('', `-- CHECK ${i + 1}: ${en}`, 'SELECT @ok = 0, @info = NULL;', 'BEGIN TRY');
    dong.push(`  EXEC sp_executesql N'${sq(k.than.trim())}',`);
    dong.push("    N'@ok BIT OUTPUT, @info NVARCHAR(4000) OUTPUT', @ok = @ok OUTPUT, @info = @info OUTPUT;");
    dong.push('END TRY', 'BEGIN CATCH', "  SELECT @ok = 0, @info = CONCAT(N'error ', ERROR_NUMBER(), N': ', ERROR_MESSAGE());", 'END CATCH;');
    dong.push('WHILE @@TRANCOUNT > 0 ROLLBACK;');
    dong.push(`IF @ok = 1 BEGIN SET @pass += 1; PRINT N'PASS ${sq(nhan)}'; END`);
    dong.push(`ELSE BEGIN SET @fail += 1; PRINT CONCAT(N'FAIL ${sq(nhan)}', CASE WHEN @info IS NULL THEN N'' ELSE CONCAT(N'  ⇒  ', @info) END); END`);
  });
  dong.push('', "PRINT N'──────────────────────────────────────';");
  dong.push(`IF @fail = 0 PRINT CONCAT(N'ALL ', @pass, N' CHECKS PASSED — go back to Code Lab and press "Mark as solved".');`);
  dong.push(`ELSE PRINT CONCAT(@pass, N' passed, ', @fail, N' FAILED — fix solution.sql, then run setup.sql, solution.sql, check.sql again.');`);
  dong.push(`SELECT CASE WHEN @fail = 0 THEN N'ALL CHECKS PASSED' ELSE N'NOT YET' END AS Result, @pass AS Passed, @fail AS Failed;`);
  dong.push("IF @fail > 0 RAISERROR(N'%d check(s) failed', 16, 1, @fail);");
  return dong.join('\n') + '\n';
}

function dungSetup(tieu, setup) {
  return `-- setup.sql — sample database for: ${tieu}
-- Drops and re-creates the database ${CSDL_TAY} (a scratch database used only by Code Lab exercises), then the tables + rows.
-- Xoá và tạo lại CSDL ${CSDL_TAY} (CSDL nháp chỉ dùng cho bài Code Lab), rồi tạo bảng + dữ liệu. Chạy lại bất cứ lúc nào để làm sạch.
USE master;
GO
IF DB_ID(N'${CSDL_TAY}') IS NOT NULL
BEGIN
    ALTER DATABASE ${CSDL_TAY} SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE ${CSDL_TAY};
END
GO
CREATE DATABASE ${CSDL_TAY};
GO
USE ${CSDL_TAY};
GO
${setup.trim()}
GO
PRINT N'setup.sql: database ${CSDL_TAY} ready.';
`;
}

const LENH = {
  en: (n) => `<h4>How to run it (Windows or macOS)</h4>
<p>Press <b>Tải .zip</b> (download) above the code and unzip it. The folder has three files: <code>setup.sql</code> (re-creates a scratch database <code>${CSDL_TAY}</code> with the sample tables), <code>solution.sql</code> (YOUR answer — edit only this one) and <code>check.sql</code> (${n} checks; prints <code>PASS</code>/<code>FAIL</code> for each and ends with <b>ALL ${n} CHECKS PASSED</b>). Always run them in this order: <b>setup → solution → check</b>.</p>
<ul>
<li><b>Windows + SSMS</b> (the course setup, lesson 0.3): open <code>setup.sql</code> → <b>F5</b>; open <code>solution.sql</code> → <b>F5</b>; open <code>check.sql</code> → <b>F5</b>, then read the <i>Messages</i> tab. Or in a terminal inside the folder (sqlcmd ships with SQL Server; otherwise <code>winget install sqlcmd</code>):<br><code>sqlcmd -S localhost -E -C -i setup.sql,solution.sql,check.sql</code> (use <code>-U sa -P "&lt;password&gt;"</code> instead of <code>-E</code> for a SQL login).</li>
<li><b>macOS</b> (SQL Server in Docker, as in lesson 0.3 — Apple Silicon: <code>mcr.microsoft.com/azure-sql-edge</code>, Intel: <code>mcr.microsoft.com/mssql/server:2022-latest</code>):<br><code>docker run -d --name dbi202-sql -e ACCEPT_EULA=Y -e "MSSQL_SA_PASSWORD=Dbi202#Lab" -p 1433:1433 mcr.microsoft.com/azure-sql-edge</code><br>then install the command-line client once with <code>brew install sqlcmd</code> and, inside the folder:<br><code>sqlcmd -S localhost,1433 -U sa -P "Dbi202#Lab" -C -i setup.sql,solution.sql,check.sql</code><br>(or open the three files in VS Code with the <i>SQL Server (mssql)</i> extension and run them in the same order).</li>
</ul>
<p>Use <code>CREATE OR ALTER</code> for procedures, functions, triggers and views so that you can run <code>solution.sql</code> again and again. In the real PE you submit only the <code>CREATE …</code> statement, without <code>GO</code> or test commands.</p>`,
  vi: (n) => `<h4>Cách chạy (Windows hoặc macOS)</h4>
<p>Bấm <b>Tải .zip</b> ở khung code rồi giải nén. Thư mục có ba tệp: <code>setup.sql</code> (tạo lại CSDL nháp <code>${CSDL_TAY}</code> với các bảng mẫu), <code>solution.sql</code> (bài làm CỦA BẠN — chỉ sửa tệp này) và <code>check.sql</code> (${n} kiểm; in <code>PASS</code>/<code>FAIL</code> từng kiểm và kết thúc bằng <b>ALL ${n} CHECKS PASSED</b>). Luôn chạy đúng thứ tự: <b>setup → solution → check</b>.</p>
<ul>
<li><b>Windows + SSMS</b> (cài như bài 0.3): mở <code>setup.sql</code> → <b>F5</b>; mở <code>solution.sql</code> → <b>F5</b>; mở <code>check.sql</code> → <b>F5</b>, rồi đọc tab <i>Messages</i>. Hoặc mở terminal trong thư mục (sqlcmd đi kèm SQL Server; chưa có thì <code>winget install sqlcmd</code>):<br><code>sqlcmd -S localhost -E -C -i setup.sql,solution.sql,check.sql</code> (đăng nhập SQL thì thay <code>-E</code> bằng <code>-U sa -P "&lt;mật khẩu&gt;"</code>).</li>
<li><b>macOS</b> (SQL Server trong Docker như bài 0.3 — Apple Silicon: <code>mcr.microsoft.com/azure-sql-edge</code>, Intel: <code>mcr.microsoft.com/mssql/server:2022-latest</code>):<br><code>docker run -d --name dbi202-sql -e ACCEPT_EULA=Y -e "MSSQL_SA_PASSWORD=Dbi202#Lab" -p 1433:1433 mcr.microsoft.com/azure-sql-edge</code><br>rồi cài trình dòng lệnh một lần bằng <code>brew install sqlcmd</code> và, trong thư mục bài:<br><code>sqlcmd -S localhost,1433 -U sa -P "Dbi202#Lab" -C -i setup.sql,solution.sql,check.sql</code><br>(hoặc mở ba tệp trong VS Code có extension <i>SQL Server (mssql)</i> và chạy đúng thứ tự đó).</li>
</ul>
<p>Viết procedure, function, trigger, view bằng <code>CREATE OR ALTER</code> để chạy lại <code>solution.sql</code> bao nhiêu lần cũng được. Khi thi PE thật chỉ nộp lệnh <code>CREATE …</code>, không <code>GO</code>, không lệnh chạy thử.</p>`,
};

const LY_DO_MAC_DINH = [
  'The in-browser grader runs PostgreSQL (WASM) in a SQL Server–like mode and can only check portable SQL; this task needs T-SQL that only a real SQL Server runs (stored procedures, functions, triggers, variables, TRY/CATCH, transactions…).',
  'Máy chấm trong trình duyệt chạy PostgreSQL (WASM) ở chế độ giống SQL Server nên chỉ chấm được SQL chung; bài này cần T-SQL mà chỉ SQL Server thật chạy được (stored procedure, function, trigger, biến, TRY/CATCH, giao dịch…).',
];

/**
 * tsql({ t, k, p, en, vi, yc:[[en,vi]], setup (T-SQL, có GO), khoi (solution.sql khởi đầu), giai (solution.sql lời giải),
 *        kiem:[ck([en,vi], than)], saiTay:[solution.sql sai mẫu…], lyDo?:[en,vi], gy, lhg, gt, tn, kn, tag })
 * ⇒ tests { loai: 'manual', chayTaiMay } — web hiện "Tự đánh dấu đã giải"; _kiem-tay.mjs chạy trên SQL Server thật:
 *   lời giải ⇒ ALL PASSED · khởi đầu ⇒ ≥ 1 FAIL · mỗi sai mẫu ⇒ ≥ 1 FAIL.
 */
export function tsql({ t, k, p, en, vi, yc, setup, khoi, giai, kiem, saiTay = [], lyDo = LY_DO_MAC_DINH, gy, lhg, gt, tn: thuat = [], kn = [], tag = [], dangBai, diem }) {
  const n = kiem.length;
  const ghi = {
    en: `<p class="callout warn"><b>Runs on YOUR SQL Server, not in the browser.</b> ${lyDo[0]} Nothing here is graded automatically: run the self-check <code>check.sql</code> on your machine and, when it prints <b>ALL ${n} CHECKS PASSED</b>, press <b>Mark as solved</b>.</p>${LENH.en(n)}`,
    vi: `<p class="callout warn"><b>Chạy trên SQL SERVER CỦA BẠN, không chạy trong trình duyệt.</b> ${lyDo[1]} Trang này không tự chấm: chạy tệp tự kiểm <code>check.sql</code> trên máy bạn, khi nó in <b>ALL ${n} CHECKS PASSED</b> thì bấm <b>Tự đánh dấu đã giải</b>.</p>${LENH.vi(n)}`,
  };
  const dauSol = `-- solution.sql — YOUR answer for: ${t}
-- Bài làm CỦA BẠN. Run order / thứ tự chạy: setup.sql → solution.sql → check.sql
USE ${CSDL_TAY};
GO
`;
  const tepSetup = dungSetup(t, setup);
  const tepCheck = dungCheck(t, kiem);
  const cacKiem = kiem.map((x, i) => `${i + 1}. ${Array.isArray(x.ten) ? x.ten[0] : x.ten}`);
  return {
    tieuDe: t, doKho: k, phut: p, khaiNiem: kn, the: ['dbi202', 'tsql', 'chay-tai-may', ...tag], ngonNgu: 'sql',
    ...(dangBai ? { dangBai } : {}), ...(diem ? { diem } : {}),
    moTa: { en: en + ghi.en, vi: vi + ghi.vi },
    yeuCau: { en: yc.map((x) => x[0]), vi: yc.map((x) => x[1]) },
    viDu: [{
      input: hk(['setup.sql → solution.sql → check.sql (SSMS, sqlcmd or VS Code)', 'setup.sql → solution.sql → check.sql (SSMS, sqlcmd hoặc VS Code)']),
      output: `${cacKiem.map((x) => `PASS ${x}`).join('\n')}\nALL ${n} CHECKS PASSED`,
      explanation: hk(['Each line of check.sql is one check; a FAIL line says what was expected.', 'Mỗi dòng của check.sql là một kiểm; dòng FAIL nói rõ điều mong đợi.']),
    }],
    goiY: gy.map(bv), loiHayGap: lhg.map(bv), giaiThich: bv(gt), thuatNgu: thuat,
    khoiDau: { 'solution.sql': dauSol + khoi.trim() + '\n', 'setup.sql': tepSetup, 'check.sql': tepCheck },
    loiGiai: { 'solution.sql': dauSol + giai.trim() + '\n', 'setup.sql': tepSetup, 'check.sql': tepCheck },
    tests: { loai: 'manual', chayTaiMay: { lenh: 'sqlcmd -i setup.sql,solution.sql,check.sql', lyDo: hk(lyDo), runner: 'sqlserver', tep: ['setup.sql', 'solution.sql', 'check.sql'], kiem: cacKiem } },
    loaiKiem: 'manual',
    // chỉ cho _kiem-tay.mjs (bộ xuất không ghi trường lạ vào JSON)
    __tay: { setup: tepSetup, check: tepCheck, giai: dauSol + giai.trim() + '\n', khoi: dauSol + khoi.trim() + '\n', sai: saiTay.map((s) => dauSol + s.trim() + '\n') },
  };
}

/** Một module = một bài học (slug = slug bài học ⇒ thẻ "🏋️ Luyện tập" dưới video bài đó tự hiện). */
export const mod = (slug, ten, deDs, baiHoc = slug) => doiDau({ slug, ten, khoa: KHOA, baiHoc, de: deDs });

/** Truy vấn cấu trúc (dùng trong `sau`): mọi cột của các bảng `ds` — tên bảng, tên cột, kiểu (tên kiểu PostgreSQL: integer,
 *  character varying, character, numeric, date…). Không phụ thuộc thứ tự cột người học viết. */
export const cot = (ds) => `SELECT lower(table_name) AS tbl, lower(column_name) AS col, lower(data_type) AS type FROM information_schema.columns WHERE table_schema NOT IN ('pg_catalog', 'information_schema') AND lower(table_name) IN (${ds.map((t) => `'${t.toLowerCase()}'`).join(', ')})`;
/** Câu nhắc chung cho đề DDL chấm trong trình duyệt: VARCHAR thay NVARCHAR, DATE thay DATETIME. */
export const YC_DDL = ['Use <code>VARCHAR(n)</code> / <code>CHAR(n)</code> for text and <code>DATE</code> for dates here — the in-browser grader flags NVARCHAR/DATETIME as SQL Server–only. In the real PE on SQL Server write NVARCHAR for Vietnamese text.', 'Ở đây dùng <code>VARCHAR(n)</code> / <code>CHAR(n)</code> cho chữ và <code>DATE</code> cho ngày — máy chấm trình duyệt báo NVARCHAR/DATETIME là cú pháp riêng SQL Server. Thi PE thật trên SQL Server thì chữ tiếng Việt dùng NVARCHAR.'];
