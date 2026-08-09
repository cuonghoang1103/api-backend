/**
 * Thẻ bài học "100 Ngày Database" — Ngày 1: CSDL là gì? (mở khoá)
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/db-day-01.mjs
 *
 * ⚠ THẺ DATABASE KHÔNG có `verify` (không chạy Java). `proof.lines` là OUTPUT
 * THẬT của psql — người soạn CHẠY SQL trên PostgreSQL rồi dán vào. Kỷ luật
 * "không nói dối về hành vi" y như bên Java, chỉ khác bước kiểm là chạy tay.
 *
 * ✅ Đã chạy thật trên PostgreSQL 15.4 (docker cuong_pg_new :5433):
 *   INSERT diem_tb='gioi'  -> ERROR: invalid input syntax for type numeric: "gioi"
 *   INSERT ma_sv='SV01' 2  -> ERROR: duplicate key ... "sinh_vien_pkey"
 */
export default {
  series: '100 NGÀY DATABASE',
  day: 1,
  total: 100,
  titleLead: 'DB Day 1:',
  titleAccent: 'CSDL là gì?',
  subtitle: 'Vì sao lập trình viên không lưu dữ liệu bằng Excel 🗄️',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. BẢNG CÓ LƯỢC ĐỒ + KIỂU 📋',
      code: `CREATE TABLE sinh_vien (
  ma_sv    VARCHAR(10) PRIMARY KEY,
  ho_ten   VARCHAR(50) NOT NULL,
  diem_tb  NUMERIC(3,1) NOT NULL
);`,
      notes: [
        { mark: 'ok', text: 'Mỗi cột có KIỂU cố định — khác ô Excel gõ gì cũng được' },
        { mark: 'dot', text: '`PRIMARY KEY` = định danh duy nhất mỗi dòng' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. HỎI DỮ LIỆU BẰNG SQL 🔍',
      code: `SELECT ma_sv, ho_ten, diem_tb
FROM sinh_vien
WHERE diem_tb >= 8
ORDER BY diem_tb DESC;
-- -> Chi 9.2, An 8.5`,
      notes: [
        { mark: 'ok', text: 'Tả THỨ MÌNH MUỐN, máy tự đi tìm — không cần cuộn tay tìm dòng' },
      ],
    },
    {
      tone: 'pink',
      title: '3. CSDL BẢO VỆ DỮ LIỆU 🛡️',
      code: `INSERT ... diem_tb = 'gioi'
-> ERROR: invalid input syntax for numeric

INSERT ... ma_sv = 'SV01' (trung)
-> ERROR: duplicate key (sinh_vien_pkey)`,
      notes: [
        { mark: 'ok', text: 'Dữ liệu sai bị CHẶN ngay lúc ghi — Excel thì lọt hết' },
        { mark: 'dot', text: 'Kiểu sai, khoá trùng, để trống ô bắt buộc → từ chối' },
      ],
    },
    {
      tone: 'green',
      title: '4. VÌ SAO KHÔNG PHẢI EXCEL 📊',
      code: `Excel/file:  ai cũng sửa, gõ gì cũng vào,
             triệu dòng là lag, 2 người = hỏng
CSDL:        có kiểu, tìm nhanh, nhiều người,
             giao dịch an toàn`,
      notes: [
        { mark: 'ok', text: 'CSDL = kho dữ liệu có luật, tìm nhanh, nhiều người dùng cùng lúc' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'PostgreSQL (dự án) & SQL Server (trên lớp) đều làm được — cú pháp ~90% giống' },
        { mark: 'next', text: '**Ngày 2**: cài PostgreSQL & gõ câu SQL đầu tiên trong 5 phút' },
      ],
    },
  ],

  /* Output THẬT của psql trên PostgreSQL 15.4 — không phải viết tay. */
  proof: {
    label: 'Đã chạy thật · PostgreSQL 15.4',
    lines: [
      '1) CREATE TABLE sinh_vien(ma_sv, ho_ten, diem_tb, con_hoc) -> luoc do co kieu',
      '2) INSERT 3 sinh vien hop le -> INSERT 0 3',
      '3) SELECT diem_tb >= 8 ORDER BY DESC -> Chi 9.2, An 8.5 (2 dong)',
      '4) chen diem_tb = \'gioi\' -> ERROR: invalid input syntax for type numeric',
      '5) chen ma_sv \'SV01\' trung -> ERROR: duplicate key (sinh_vien_pkey)',
      '6) CSDL ep KIEU + KHOA + rang buoc; Excel/file thi khong',
    ],
  },
};
