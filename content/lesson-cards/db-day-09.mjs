/**
 * Thẻ "100 Ngày Database" — Ngày 9: Sắp xếp & phân trang (ORDER BY, LIMIT/OFFSET).
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/db-day-09.mjs
 *
 * ⚠ Không có `verify`. `proof.lines` là OUTPUT THẬT của psql.
 * ✅ Đã chạy thật trên PostgreSQL 15.4 (docker cuong_pg_new :5433), DB hoc_db_day09:
 *   ORDER BY diem DESC -> NULL lên ĐẦU (mặc định PG); NULLS LAST -> đẩy xuống cuối
 *   LIMIT 3 OFFSET 3 -> trang 2: Binh, Phuc, Dung
 */
export default {
  series: '100 NGÀY DATABASE',
  day: 9,
  total: 100,
  titleLead: 'DB Day 9:',
  titleAccent: 'Sắp xếp & phân trang',
  subtitle: 'ORDER BY, vị trí của NULL, LIMIT/OFFSET (vs TOP) 📑',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. ORDER BY — TĂNG/GIẢM, NHIỀU CỘT ↕️',
      code: `SELECT ten, diem FROM hoc_sinh
ORDER BY diem DESC;          -- cao -> thấp (ASC là mặc định)
ORDER BY lop ASC, diem DESC; -- lớp trước, trong lớp xếp điểm`,
      notes: [
        { mark: 'ok', text: '`ASC` (mặc định) tăng dần, `DESC` giảm dần · nhiều cột = phân hạng nhiều tầng' },
        { mark: 'dot', text: 'Thêm cột cuối (vd `, ten`) làm "phân giải hoà" cho thứ tự ổn định' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. NULL SẮP Ở ĐÂU? 🕳️',
      code: `ORDER BY diem DESC            -- PG: NULL lên ĐẦU
ORDER BY diem DESC NULLS LAST -- đẩy NULL xuống cuối`,
      notes: [
        { mark: 'ok', text: 'PostgreSQL coi NULL "lớn nhất" → DESC thì NULL đầu, ASC thì NULL cuối' },
        { mark: 'dot', text: 'Chủ động với `NULLS FIRST` / `NULLS LAST`' },
      ],
    },
    {
      tone: 'green',
      title: '3. LIMIT & OFFSET — PHÂN TRANG 📄',
      code: `... ORDER BY diem DESC NULLS LAST LIMIT 3;
-- top 3
... LIMIT 3 OFFSET 3;   -- trang 2 (bỏ 3 dòng đầu)`,
      notes: [
        { mark: 'ok', text: '`LIMIT n` lấy n dòng đầu · `OFFSET k` bỏ k dòng → ghép lại thành từng trang' },
      ],
    },
    {
      tone: 'pink',
      title: '4. ⚠️ KHÔNG ORDER BY = KHÔNG ĐẢM BẢO',
      code: `SELECT ... LIMIT 10;   -- KHÔNG ORDER BY
-- Postgres KHÔNG hứa thứ tự -> "10 dòng bất kỳ"`,
      notes: [
        { mark: 'ok', text: 'Muốn phân trang đúng, `LIMIT/OFFSET` PHẢI đi kèm `ORDER BY` xác định' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'SQL Server: `LIMIT n` → `TOP n` hoặc `OFFSET k ROWS FETCH NEXT n ROWS ONLY`; KHÔNG có `NULLS LAST` (mặc định NULL nhỏ nhất — ngược PG!)' },
        { mark: 'next', text: '**Ngày 10**: khoá ngoại & quan hệ — nối bảng, tổng kết Giai đoạn 1' },
      ],
    },
  ],

  proof: {
    label: 'Đã chạy thật · PostgreSQL 15.4',
    lines: [
      '1) ORDER BY diem DESC -> NULL len DAU (Dung, Giang), roi 9.5 9.2 8.8 7.5 6.0',
      '2) ORDER BY diem DESC NULLS LAST -> Hoa 9.5 .. Phuc 6.0, roi NULL cuoi',
      '3) ORDER BY lop, diem DESC -> 12A (An 9.2..NULL) roi 12B (Hoa 9.5..Phuc)',
      '4) ... NULLS LAST LIMIT 3 -> Hoa, An, Chi  (top 3)',
      '5) ... LIMIT 3 OFFSET 3 -> Binh, Phuc, Dung  (trang 2)',
    ],
  },
};
