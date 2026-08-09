/**
 * Thẻ "100 Ngày Database" — Ngày 19: Window P2 (running total, LAG/LEAD).
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/db-day-19.mjs
 *
 * ⚠ Không có `verify`. `proof.lines` là OUTPUT THẬT của psql.
 * ✅ Đã chạy thật trên PostgreSQL 15.4 (docker cuong_pg_new :5433), DB hoc_db_day19:
 *   sum() OVER (ORDER BY thang) -> 100,250,370,570,750
 *   lag/lead + chênh lệch tháng: +50, -30, +80, -20
 */
export default {
  series: '100 NGÀY DATABASE',
  day: 19,
  total: 100,
  titleLead: 'DB Day 19:',
  titleAccent: 'Window: cộng dồn & LAG/LEAD',
  subtitle: 'Tổng chạy dồn, so tháng này với tháng trước — phân tích chuỗi 📈',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. SUM() OVER — TỔNG CHẠY DỒN 📊',
      code: `SELECT thang, tien,
  sum(tien) OVER (ORDER BY thang) AS cong_don
FROM doanh_thu;`,
      notes: [
        { mark: 'ok', text: 'Hàm gộp + `OVER (ORDER BY ...)` = tổng tích luỹ tới từng dòng' },
      ],
    },
    {
      tone: 'green',
      title: '2. KẾT QUẢ CỘNG DỒN 🧮',
      code: `thang tien  cong_don
  1   100   100
  2   150   250
  3   120   370
  4   200   570  ...`,
      notes: [
        { mark: 'ok', text: 'Mỗi dòng = tổng của nó và tất cả dòng trước (theo thứ tự đã nêu)' },
      ],
    },
    {
      tone: 'yellow',
      title: '3. LAG / LEAD — DÒNG TRƯỚC / SAU 👀',
      code: `lag(tien)  OVER (ORDER BY thang)  -- tháng TRƯỚC
lead(tien) OVER (ORDER BY thang)  -- tháng SAU
-- đầu/cuối không có -> (null)`,
      notes: [
        { mark: 'ok', text: '`LAG` lấy giá trị dòng phía trước, `LEAD` phía sau — không cần self-join' },
      ],
    },
    {
      tone: 'pink',
      title: '4. SO VỚI THÁNG TRƯỚC 📉',
      code: `tien - lag(tien) OVER (ORDER BY thang)
-- +50, -30, +80, -20  (chênh lệch tháng)`,
      notes: [
        { mark: 'ok', text: 'Kết hợp phép trừ với LAG → tăng/giảm so kỳ trước, nền của mọi biểu đồ xu hướng' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'SQL Server: SUM() OVER, LAG, LEAD y hệt. Còn "khung cửa sổ" (`ROWS BETWEEN…`) cho trung bình trượt' },
        { mark: 'next', text: '**Ngày 20**: set operations UNION/INTERSECT/EXCEPT — khép Giai đoạn 2' },
      ],
    },
  ],

  proof: {
    label: 'Đã chạy thật · PostgreSQL 15.4',
    lines: [
      '1) sum(tien) OVER (ORDER BY thang) -> 100, 250, 370, 570, 750  (cong don)',
      '2) lag/lead: thang1 truoc=(null) sau=150 ; thang3 truoc=150 sau=200 ; thang5 truoc=200 sau=(null)',
      '3) tien - lag(tien) -> thang1 (null) ; +50 ; -30 ; +80 ; -20',
    ],
  },
};
