/**
 * Thẻ "100 Ngày Database" — Ngày 17: Recursive CTE (duyệt cây phân cấp).
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/db-day-17.mjs
 *
 * ⚠ Không có `verify`. `proof.lines` là OUTPUT THẬT của psql.
 * ✅ Đã chạy thật trên PostgreSQL 15.4 (docker cuong_pg_new :5433), DB hoc_db_day17:
 *   duyệt cây org: cap1 An; cap2 Binh, Chi; cap3 Dung; cap4 Em
 *   path: An > Binh > Dung > Em ...
 */
export default {
  series: '100 NGÀY DATABASE',
  day: 17,
  total: 100,
  titleLead: 'DB Day 17:',
  titleAccent: 'Recursive CTE — duyệt cây',
  subtitle: 'CTE tự gọi chính nó, đi hết sơ đồ tổ chức đến độ sâu bất kỳ 🌳',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. WITH RECURSIVE — HAI PHẦN 🔁',
      code: `WITH RECURSIVE cay AS (
  <ANCHOR>          -- điểm bắt đầu
  UNION ALL
  <ĐỆ QUY>          -- tự nối vào "cay"
)`,
      notes: [
        { mark: 'ok', text: 'Đệ quy = phần dưới tham chiếu chính CTE (`cay`), lặp tới khi không thêm dòng mới' },
      ],
    },
    {
      tone: 'green',
      title: '2. ANCHOR — GỐC CỦA CÂY 🌱',
      code: `SELECT id, ten, 1 AS cap
FROM nhan_vien WHERE quan_ly_id IS NULL;
-- -> An (sếp tổng, cấp 1)`,
      notes: [
        { mark: 'ok', text: 'Phần đầu chạy MỘT lần, cho hàng xuất phát (gốc)' },
      ],
    },
    {
      tone: 'yellow',
      title: '3. ĐỆ QUY — NỐI CON VÀO CÂY 🌿',
      code: `SELECT nv.*, c.cap + 1
FROM nhan_vien nv JOIN cay c ON nv.quan_ly_id = c.id;
-- cap2 Binh, Chi -> cap3 Dung -> cap4 Em`,
      notes: [
        { mark: 'ok', text: 'Mỗi vòng lấy con của hàng vừa thêm, `cap + 1` → đi xuống từng tầng' },
      ],
    },
    {
      tone: 'pink',
      title: '4. XÂY ĐƯỜNG DẪN 🧭',
      code: `d.path || ' > ' || nv.ten
-- An
-- An > Binh > Dung > Em
-- An > Chi`,
      notes: [
        { mark: 'ok', text: 'Cộng dồn chuỗi qua mỗi tầng → đường đi từ gốc tới từng nút' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'SQL Server: chỉ viết `WITH` (KHÔNG có từ khoá `RECURSIVE`) — nó tự nhận ra đệ quy' },
        { mark: 'next', text: '**Ngày 18**: window functions — xếp hạng/đánh số mà KHÔNG gộp mất dòng' },
      ],
    },
  ],

  proof: {
    label: 'Đã chạy thật · PostgreSQL 15.4',
    lines: [
      '1) WITH RECURSIVE cay (anchor quan_ly_id IS NULL + UNION ALL cap+1):',
      '     cap 1 An ; cap 2 Binh, Chi ; cap 3 Dung ; cap 4 Em',
      '2) xay path (d.path || \' > \' || nv.ten):',
      '     An ; An > Binh ; An > Binh > Dung ; An > Binh > Dung > Em ; An > Chi',
    ],
  },
};
