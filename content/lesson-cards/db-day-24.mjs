/**
 * Thẻ "100 Ngày Database" — Ngày 24: 1NF (dạng chuẩn 1).
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/db-day-24.mjs
 *
 * ⚠ Không có `verify`. `proof.lines` là OUTPUT THẬT của psql.
 * ✅ Đã chạy thật trên PostgreSQL 15.4 (docker cuong_pg_new :5433), DB hoc_db_day24:
 *   '0901, 0902' trong 1 ô: WHERE = '0902' -> 0 dòng; LIKE '%0902%' bắt nhầm Binh(09021)
 *   1NF (mỗi số 1 dòng): WHERE = '0902' -> An (chính xác)
 */
export default {
  series: '100 NGÀY DATABASE',
  day: 24,
  total: 100,
  titleLead: 'DB Day 24:',
  titleAccent: '1NF — mỗi ô một giá trị',
  subtitle: 'Dạng chuẩn 1: không nhồi danh sách vào một cột, không nhóm cột lặp 📦',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'pink',
      title: '1. VI PHẠM 1NF: DANH SÁCH TRONG 1 Ô 🚫',
      code: `ten  | dien_thoai
An   | '0901, 0902'   <- hai số nhồi một ô
Binh | '09021'`,
      notes: [
        { mark: 'ok', text: '1NF: mỗi ô chứa ĐÚNG MỘT giá trị nguyên tử — không danh sách' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. HẬU QUẢ: TRUY VẤN SAI ⚠️',
      code: `WHERE dien_thoai = '0902'   -> 0 dòng (không khớp!)
WHERE dien_thoai LIKE '%0902%' -> An VÀ Binh
                              (09021 bị bắt nhầm)`,
      notes: [
        { mark: 'ok', text: 'So khớp chính xác trượt, buộc dùng LIKE mờ → bắt nhầm, đếm/gộp/JOIN đều hỏng' },
      ],
    },
    {
      tone: 'green',
      title: '3. ĐÚNG 1NF: MỖI SỐ MỘT DÒNG ✅',
      code: `An   | 0901
An   | 0902     <- tách thành nhiều DÒNG
Binh | 09021
-- WHERE = '0902' -> An (chính xác)`,
      notes: [
        { mark: 'ok', text: 'Tách giá trị lặp thành các DÒNG → truy vấn, đếm, JOIN đều chính xác' },
      ],
    },
    {
      tone: 'blue',
      title: '4. 1NF CŨNG CẤM NHÓM CỘT LẶP 🔁',
      code: `-- XẤU: san_pham_1, san_pham_2, san_pham_3
-- ĐÚNG: mỗi sản phẩm một DÒNG (bảng chi tiết)`,
      notes: [
        { mark: 'ok', text: 'Cột đánh số (sp1, sp2, sp3…) cũng vi phạm 1NF — chuyển thành dòng' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'PG có kiểu array/JSON lưu được danh sách — nhưng đó là phi-chuẩn CÓ CHỦ Ý, không cho dữ liệu cần truy vấn quan hệ' },
        { mark: 'next', text: '**Ngày 25**: 2NF — bỏ phụ thuộc bộ phận vào một phần khoá tổng hợp' },
      ],
    },
  ],

  proof: {
    label: 'Đã chạy thật · PostgreSQL 15.4',
    lines: [
      "1) VI PHAM 1NF (An='0901, 0902'): WHERE dien_thoai='0902' -> 0 dong (khong khop)",
      "2) buoc dung LIKE '%0902%' -> An VA Binh  (Binh '09021' bi bat nham!)",
      "3) DUNG 1NF (moi so 1 dong): WHERE dien_thoai='0902' -> An  (chinh xac)",
      '4) GROUP BY ten -> An 2, Binh 1, Chi 1  (dem/gop de dang)',
    ],
  },
};
