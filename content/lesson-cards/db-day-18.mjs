/**
 * Thẻ "100 Ngày Database" — Ngày 18: Window functions P1 (ROW_NUMBER/RANK/DENSE_RANK/PARTITION).
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/db-day-18.mjs
 *
 * ⚠ Không có `verify`. `proof.lines` là OUTPUT THẬT của psql.
 * ✅ Đã chạy thật trên PostgreSQL 15.4 (docker cuong_pg_new :5433), DB hoc_db_day18:
 *   diem 8.5 hoà: ROW_NUMBER 3,4 (khác) · RANK 3,3 rồi NHẢY 5 · DENSE_RANK 3,3 rồi 4
 *   PARTITION BY lop -> hạng reset trong từng lớp
 */
export default {
  series: '100 NGÀY DATABASE',
  day: 18,
  total: 100,
  titleLead: 'DB Day 18:',
  titleAccent: 'Window: xếp hạng & đánh số',
  subtitle: 'Tính theo nhóm mà KHÔNG gộp mất dòng — ROW_NUMBER/RANK/DENSE_RANK 🏆',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. OVER — GIỮ NGUYÊN MỌI DÒNG 🪟',
      code: `SELECT ten, diem,
  rank() OVER (ORDER BY diem DESC)
FROM hoc_sinh;`,
      notes: [
        { mark: 'ok', text: 'Khác `GROUP BY` (gộp còn 1 dòng/nhóm), window GIỮ mọi dòng + thêm cột tính' },
        { mark: 'dot', text: '`OVER (...)` định nghĩa "cửa sổ" các dòng để tính trên đó' },
      ],
    },
    {
      tone: 'green',
      title: '2. ROW_NUMBER — ĐÁNH SỐ DUY NHẤT 🔢',
      code: `row_number() OVER (ORDER BY diem DESC, ten)
-- 1,2,3,4,5,6 (luôn khác nhau)`,
      notes: [
        { mark: 'ok', text: 'Đánh số thứ tự 1,2,3… — kể cả khi điểm bằng nhau vẫn khác số' },
      ],
    },
    {
      tone: 'yellow',
      title: '3. RANK vs DENSE_RANK — KHI HOÀ ⚖️',
      code: `-- 2 bạn cùng 8.5:
RANK       -> 3, 3, rồi NHẢY 5
DENSE_RANK -> 3, 3, rồi 4 (không nhảy)`,
      notes: [
        { mark: 'ok', text: '`RANK` bỏ số sau khi hoà · `DENSE_RANK` không bỏ — chọn theo ý nghĩa muốn' },
      ],
    },
    {
      tone: 'pink',
      title: '4. PARTITION BY — RESET THEO NHÓM 🧩',
      code: `rank() OVER (PARTITION BY lop ORDER BY diem DESC)
-- 12A: 1,2,2,4   |   12B: 1,2`,
      notes: [
        { mark: 'ok', text: '`PARTITION BY` chia cửa sổ theo nhóm → xếp hạng lại từ đầu mỗi nhóm' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'SQL Server: ROW_NUMBER/RANK/DENSE_RANK + OVER/PARTITION BY y hệt (chuẩn SQL)' },
        { mark: 'next', text: '**Ngày 19**: tổng chạy dồn, LAG/LEAD — nhìn dòng trước/sau trong cửa sổ' },
      ],
    },
  ],

  proof: {
    label: 'Đã chạy thật · PostgreSQL 15.4',
    lines: [
      '1) ORDER BY diem DESC — rn | rnk | drnk:',
      '     Em 9.5 -> 1|1|1 ; An 9.2 -> 2|2|2 ; Binh 8.5 -> 3|3|3 ; Chi 8.5 -> 4|3|3 ;',
      '     Phuc 8.0 -> 5|5|4 ; Dung 7.0 -> 6|6|5   (RANK nhay 5, DENSE_RANK khong)',
      '2) PARTITION BY lop -> 12A: An1, Binh2, Chi2, Dung4 ; 12B: Em1, Phuc2',
    ],
  },
};
