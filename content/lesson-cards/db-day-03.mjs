/**
 * Thẻ "100 Ngày Database" — Ngày 3: SELECT sâu hơn (cột, alias, tính toán, DISTINCT).
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/db-day-03.mjs
 *
 * ⚠ Không có `verify`. `proof.lines` là OUTPUT THẬT của psql.
 * ✅ Đã chạy thật trên PostgreSQL 15.4 (docker cuong_pg_new :5433), DB hoc_db_day03:
 *   SELECT gia*so_luong AS thanh_tien ORDER BY DESC -> Man hinh 24 = 16800000 (cao nhất)
 *   SELECT DISTINCT danh_muc -> Man hinh, Phu kien (2 từ 5 dòng)
 */
export default {
  series: '100 NGÀY DATABASE',
  day: 3,
  total: 100,
  titleLead: 'DB Day 3:',
  titleAccent: 'SELECT — lấy đúng thứ cần',
  subtitle: 'Chọn cột, đặt tên lại, tính toán ngay trong câu hỏi 🔍',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. CHỌN ĐÚNG CỘT, ĐỪNG * 📋',
      code: `SELECT ten, gia FROM san_pham;
-- thay vì SELECT * (lấy mọi cột)`,
      notes: [
        { mark: 'ok', text: 'Nêu tên cột cần lấy — rõ ràng, nhanh, ổn định khi bảng đổi' },
        { mark: 'dot', text: '`SELECT *` tiện lúc thử, nhưng code thật nên chọn cột cụ thể' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. AS — ĐẶT TÊN LẠI CỘT 🏷️',
      code: `SELECT ten AS san_pham, gia AS don_gia
FROM san_pham;`,
      notes: [
        { mark: 'ok', text: '`AS` đổi tên cột KẾT QUẢ cho dễ đọc — không đụng dữ liệu gốc' },
        { mark: 'dot', text: 'Tên có dấu cách/hoa: bọc `"nháy kép"` — "Đơn giá"' },
      ],
    },
    {
      tone: 'green',
      title: '3. CỘT TÍNH TOÁN 🧮',
      code: `SELECT ten, gia * so_luong AS thanh_tien
FROM san_pham
ORDER BY thanh_tien DESC;
-- -> Man hinh 24 = 16800000 (cao nhất)`,
      notes: [
        { mark: 'ok', text: 'SELECT tính được biểu thức: nhân, cộng, hàm… ra cột mới' },
        { mark: 'dot', text: 'Sắp xếp được theo chính cột tính toán vừa đặt tên' },
      ],
    },
    {
      tone: 'pink',
      title: '4. GHÉP CHUỖI & LỌC TRÙNG 🔗',
      code: `SELECT ten || ' (' || danh_muc || ')' AS nhan
FROM san_pham;
SELECT DISTINCT danh_muc FROM san_pham;
-- -> Man hinh, Phu kien (2 từ 5 dòng)`,
      notes: [
        { mark: 'ok', text: '`||` nối chuỗi · `DISTINCT` bỏ giá trị trùng, chỉ giữ mỗi loại một lần' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'SQL Server: nối chuỗi bằng `+` hoặc `CONCAT()` (không có `||` mặc định); DISTINCT/AS y hệt' },
        { mark: 'next', text: '**Ngày 4**: kiểu dữ liệu — chọn INT, TEXT, NUMERIC, BOOLEAN, DATE cho đúng' },
      ],
    },
  ],

  proof: {
    label: 'Đã chạy thật · PostgreSQL 15.4',
    lines: [
      '1) SELECT ten, gia (chon dung cot) -> 5 dong',
      '2) gia * so_luong AS thanh_tien, ORDER BY DESC ->',
      '     Man hinh 24 = 16800000, Man hinh 27 = 8400000, ...',
      '3) ten || \' (\' || danh_muc || \')\' -> Ban phim co (Phu kien), ...',
      '4) SELECT DISTINCT danh_muc -> Man hinh, Phu kien (2 tu 5 dong)',
    ],
  },
};
