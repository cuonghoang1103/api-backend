/**
 * Thẻ "100 Ngày Database" — Ngày 4: Kiểu dữ liệu (INT/TEXT/NUMERIC/BOOL/DATE).
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/db-day-04.mjs
 *
 * ⚠ Không có `verify`. `proof.lines` là OUTPUT THẬT của psql.
 * ✅ Đã chạy thật trên PostgreSQL 15.4 (docker cuong_pg_new :5433), DB hoc_db_day04:
 *   0.1+0.2 (float8) -> 0.30000000000000004 ; (numeric) -> 0.3
 *   chen 'bon hai' vào INTEGER -> ERROR invalid input syntax
 *   chen chuỗi > 20 ký tự vào VARCHAR(20) -> ERROR value too long
 *   DATE '2026-12-31' - DATE '2026-08-09' -> 144
 */
export default {
  series: '100 NGÀY DATABASE',
  day: 4,
  total: 100,
  titleLead: 'DB Day 4:',
  titleAccent: 'Chọn đúng kiểu dữ liệu',
  subtitle: 'Và vì sao TIỀN không bao giờ dùng số thực (float) 💰',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. NĂM KIỂU HAY DÙNG NHẤT 🧱',
      code: `so_nguyen INTEGER          -- 42
chuoi     TEXT / VARCHAR(20) -- 'xin chao'
tien      NUMERIC(12,2)      -- 199000.50
co_that   BOOLEAN            -- true / false
ngay      DATE               -- 2026-08-09`,
      notes: [
        { mark: 'ok', text: 'Mỗi cột một kiểu — đó là "luật" giúp CSDL chặn dữ liệu rác' },
      ],
    },
    {
      tone: 'pink',
      title: '2. BẪY TIỀN: FLOAT SAI! 💸',
      code: `SELECT 0.1::float8  + 0.2::float8;   -- 0.30000000000000004 ❌
SELECT 0.1::numeric + 0.2::numeric;  -- 0.3 ✅`,
      notes: [
        { mark: 'ok', text: 'Số thực (float) LÀM TRÒN nhị phân → lệch xu. Tiền LUÔN dùng `NUMERIC`' },
        { mark: 'dot', text: '`NUMERIC(12,2)` = tối đa 12 chữ số, 2 số sau dấu phẩy' },
      ],
    },
    {
      tone: 'green',
      title: '3. KIỂU TỰ BẢO VỆ 🛡️',
      code: `INSERT ... so_nguyen = 'bon hai'
-> ERROR: invalid input syntax for type integer
INSERT ... chuoi(21 ky tu) vao VARCHAR(20)
-> ERROR: value too long`,
      notes: [
        { mark: 'ok', text: 'Sai kiểu, quá dài → bị chặn NGAY lúc ghi, không lọt vào bảng' },
      ],
    },
    {
      tone: 'yellow',
      title: '4. NGÀY LÀM TOÁN ĐƯỢC 📅',
      code: `SELECT DATE '2026-12-31' - DATE '2026-08-09';
-- -> 144  (số ngày)`,
      notes: [
        { mark: 'ok', text: 'Kiểu DATE hiểu lịch — trừ hai ngày ra số ngày, cộng khoảng thời gian…' },
        { mark: 'dot', text: 'Đừng lưu ngày dạng TEXT — mất khả năng tính & so sánh đúng' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'SQL Server: `INT`, `VARCHAR`, `DECIMAL(12,2)` (≡ NUMERIC), `BIT` (thay BOOLEAN), `DATE` — ý niệm y hệt' },
        { mark: 'next', text: '**Ngày 5**: ràng buộc — PRIMARY KEY, NOT NULL, UNIQUE, CHECK, DEFAULT' },
      ],
    },
  ],

  proof: {
    label: 'Đã chạy thật · PostgreSQL 15.4',
    lines: [
      '1) 0.1+0.2 (float8) -> 0.30000000000000004  (SAI so voi 0.3)',
      '   0.1+0.2 (numeric) -> 0.3  (DUNG)',
      '2) INSERT (42, xin chao, 199000.5, true, 2026-08-09)',
      '   -> tien = 199000.50 ; co_that = t ; ngay = 2026-08-09',
      '3) chen "bon hai" vao INTEGER -> ERROR: invalid input syntax for type integer',
      '4) chen chuoi 42 ky tu vao VARCHAR(20) -> ERROR: value too long',
      '5) DATE 2026-12-31 - DATE 2026-08-09 -> 144',
    ],
  },
};
