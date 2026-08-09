/**
 * Thẻ "100 Ngày Database" — Ngày 20: Set operations (khép Giai đoạn 2).
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/db-day-20.mjs
 *
 * ⚠ Không có `verify`. `proof.lines` là OUTPUT THẬT của psql.
 * ✅ Đã chạy thật trên PostgreSQL 15.4 (docker cuong_pg_new :5433), DB hoc_db_day20:
 *   UNION -> 5 (bỏ trùng) ; UNION ALL -> 7 (giữ trùng)
 *   INTERSECT -> Binh, Chi ; EXCEPT (2025-2026) -> An ; (2026-2025) -> Dung, Em
 */
export default {
  series: '100 NGÀY DATABASE',
  day: 20,
  total: 100,
  titleLead: 'DB Day 20:',
  titleAccent: 'UNION / INTERSECT / EXCEPT',
  subtitle: 'Gộp, giao, trừ hai tập kết quả — khép Giai đoạn 2 (Truy vấn) 🎯',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. UNION vs UNION ALL ➕',
      code: `SELECT ten FROM mua_2025
UNION      SELECT ten FROM mua_2026;  -- 5 (bỏ trùng)
UNION ALL  ...                        -- 7 (giữ trùng)`,
      notes: [
        { mark: 'ok', text: '`UNION` gộp rồi BỎ trùng · `UNION ALL` gộp GIỮ trùng (nhanh hơn, không phải lọc)' },
      ],
    },
    {
      tone: 'green',
      title: '2. INTERSECT — PHẦN CHUNG 🔗',
      code: `SELECT ten FROM mua_2025
INTERSECT SELECT ten FROM mua_2026;
-- -> Binh, Chi  (mua CẢ hai năm)`,
      notes: [
        { mark: 'ok', text: '`INTERSECT` giữ dòng CÓ ở CẢ hai tập — trả lời "vừa… vừa…"' },
      ],
    },
    {
      tone: 'yellow',
      title: '3. EXCEPT — PHẦN RIÊNG ➖',
      code: `2025 EXCEPT 2026 -> An     (đã rời bỏ)
2026 EXCEPT 2025 -> Dung, Em (khách mới)`,
      notes: [
        { mark: 'ok', text: '`EXCEPT` = có ở tập trái, KHÔNG ở tập phải — phân tích "mất/mới"' },
      ],
    },
    {
      tone: 'pink',
      title: '4. LUẬT + ✅ KHÉP GIAI ĐOẠN 2',
      code: `-- cùng SỐ CỘT + kiểu hợp nhau; tên cột lấy theo câu ĐẦU
JOIN·GROUP BY·subquery·CTE·window·set ops`,
      notes: [
        { mark: 'ok', text: 'GĐ2 xong: bạn truy vấn xuyên bảng, tổng hợp, lồng, đệ quy, phân tích & hợp tập' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'SQL Server: UNION/UNION ALL/INTERSECT/EXCEPT y hệt (Oracle mới dùng MINUS thay EXCEPT)' },
        { mark: 'next', text: '**Ngày 21 (mở GĐ3)**: mô hình ER — thiết kế lược đồ trước khi gõ SQL' },
      ],
    },
  ],

  proof: {
    label: 'Đã chạy thật · PostgreSQL 15.4',
    lines: [
      '1) UNION -> An, Binh, Chi, Dung, Em (5, bo trung)',
      '2) UNION ALL -> An, Binh, Binh, Chi, Chi, Dung, Em (7, giu trung)',
      '3) INTERSECT -> Binh, Chi  (mua ca 2 nam)',
      '4) mua_2025 EXCEPT mua_2026 -> An  (roi bo)',
      '5) mua_2026 EXCEPT mua_2025 -> Dung, Em  (khach moi)',
    ],
  },
};
