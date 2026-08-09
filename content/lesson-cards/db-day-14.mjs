/**
 * Thẻ "100 Ngày Database" — Ngày 14: Subquery (truy vấn lồng).
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/db-day-14.mjs
 *
 * ⚠ Không có `verify`. `proof.lines` là OUTPUT THẬT của psql.
 * ✅ Đã chạy thật trên PostgreSQL 15.4 (docker cuong_pg_new :5433), DB hoc_db_day14:
 *   WHERE tong_tien > (SELECT avg) [487500] -> id3 900000, id1 500000
 *   id IN (SELECT ... >=500k) -> An, Binh ; id NOT IN (...) -> Dung
 *   FROM (SELECT ... GROUP BY khach_id) -> tb_moi_khach = 650000
 */
export default {
  series: '100 NGÀY DATABASE',
  day: 14,
  total: 100,
  titleLead: 'DB Day 14:',
  titleAccent: 'Subquery — truy vấn lồng',
  subtitle: 'Dùng kết quả câu này làm đầu vào cho câu kia 🪆',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. SCALAR — TRẢ 1 GIÁ TRỊ 🎯',
      code: `SELECT id, tong_tien FROM don_hang
WHERE tong_tien > (SELECT avg(tong_tien) FROM don_hang);
-- avg = 487500 -> id 3 (900k), id 1 (500k)`,
      notes: [
        { mark: 'ok', text: 'Subquery trả MỘT giá trị → so sánh trực tiếp (`>`, `=`, `<`…)' },
        { mark: 'dot', text: 'Câu trong ngoặc chạy trước, cho ra số, rồi câu ngoài dùng số đó' },
      ],
    },
    {
      tone: 'green',
      title: '2. IN — THUỘC DANH SÁCH ĐỘNG 📋',
      code: `SELECT ten FROM khach_hang
WHERE id IN (SELECT khach_id FROM don_hang
             WHERE tong_tien >= 500000);
-- -> An, Binh`,
      notes: [
        { mark: 'ok', text: 'Subquery trả một CỘT → `IN` kiểm "có nằm trong danh sách đó không"' },
      ],
    },
    {
      tone: 'yellow',
      title: '3. NOT IN — ⚠️ BẪY NULL',
      code: `WHERE id NOT IN (SELECT khach_id FROM don_hang);
-- -> Dung (chưa có đơn)
-- ⚠ nếu subquery có NULL, NOT IN ra RỖNG!`,
      notes: [
        { mark: 'ok', text: '`NOT IN` mà danh sách chứa NULL → toàn bộ ra rỗng. Dùng `NOT EXISTS` cho an toàn (Ngày 15)' },
      ],
    },
    {
      tone: 'pink',
      title: '4. SUBQUERY TRONG FROM 🪆',
      code: `SELECT round(avg(tong)) FROM (
  SELECT khach_id, sum(tong_tien) AS tong
  FROM don_hang GROUP BY khach_id
) AS per_khach;   -- -> 650000`,
      notes: [
        { mark: 'ok', text: 'Bảng DẪN XUẤT: kết quả một câu làm "bảng tạm" cho câu ngoài (phải có bí danh)' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'SQL Server: subquery/IN/NOT IN/derived table y hệt — cùng bẫy NULL của NOT IN' },
        { mark: 'next', text: '**Ngày 15**: correlated subquery & EXISTS — subquery "nhìn" từng dòng ngoài' },
      ],
    },
  ],

  proof: {
    label: 'Đã chạy thật · PostgreSQL 15.4',
    lines: [
      '1) WHERE tong_tien > (SELECT avg(tong_tien)) [=487500] -> id3 900000, id1 500000',
      '2) id IN (SELECT khach_id ... tong_tien>=500000) -> An, Binh',
      '3) id NOT IN (SELECT khach_id FROM don_hang) -> Dung  (chua co don)',
      '4) FROM (SELECT khach_id, sum(tong_tien) GROUP BY khach_id) -> tb_moi_khach = 650000',
    ],
  },
};
