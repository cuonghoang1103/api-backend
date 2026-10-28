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
