/**
 * Thẻ "100 Ngày Database" — Ngày 5: Ràng buộc (PK/NOT NULL/UNIQUE/CHECK/DEFAULT).
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/db-day-05.mjs
 *
 * ⚠ Không có `verify`. `proof.lines` là OUTPUT THẬT của psql.
 * ✅ Đã chạy thật trên PostgreSQL 15.4 (docker cuong_pg_new :5433), DB hoc_db_day05:
 *   thiếu email  -> null value ... violates not-null constraint
 *   email trùng  -> duplicate key ... unique constraint "tai_khoan_email_key"
 *   tuoi=200     -> violates check constraint "tai_khoan_tuoi_check"
 *   diem=11      -> violates check constraint "tai_khoan_diem_check"
 */
export default {
  series: '100 NGÀY DATABASE',
  day: 5,
  total: 100,
  titleLead: 'DB Day 5:',
  titleAccent: 'Ràng buộc — luật của bảng',
  subtitle: 'Biến quy tắc nghiệp vụ thành luật CSDL tự cưỡng chế 🛡️',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. NĂM RÀNG BUỘC CỐT LÕI 🧱',
      code: `id      SERIAL PRIMARY KEY          -- định danh duy nhất
email   TEXT NOT NULL UNIQUE       -- bắt buộc + không trùng
tuoi    INT  CHECK (tuoi BETWEEN 0 AND 150)
vai_tro TEXT NOT NULL DEFAULT 'user'
diem    NUMERIC(3,1) DEFAULT 0
          CHECK (diem >= 0 AND diem <= 10)`,
      notes: [
        { mark: 'ok', text: 'Luật viết MỘT LẦN trong bảng — mọi INSERT/UPDATE tự bị kiểm' },
      ],
    },
    {
      tone: 'green',
      title: '2. DEFAULT — GIÁ TRỊ MẶC ĐỊNH ✍️',
      code: `INSERT INTO tai_khoan (email, tuoi)
VALUES ('an@example.com', 20);
-- -> vai_tro = 'user', diem = 0.0 (tự điền)`,
      notes: [
        { mark: 'ok', text: 'Không nêu cột → CSDL điền giá trị mặc định, đỡ quên & đồng nhất' },
      ],
    },
    {
      tone: 'pink',
      title: '3. NOT NULL & UNIQUE CHẶN 🚫',
      code: `thiếu email -> null value ... violates
              not-null constraint
email trùng -> duplicate key ... unique
              constraint "tai_khoan_email_key"`,
      notes: [
        { mark: 'ok', text: '`NOT NULL` = phải có · `UNIQUE` = không hai dòng cùng giá trị' },
      ],
    },
    {
      tone: 'yellow',
      title: '4. CHECK — LUẬT NGHIỆP VỤ ✅',
      code: `tuoi = 200 -> violates check constraint
              "tai_khoan_tuoi_check"
diem = 11  -> violates check constraint
              "tai_khoan_diem_check"`,
      notes: [
        { mark: 'ok', text: '`CHECK` cưỡng chế miền giá trị: 0≤tuoi≤150, 0≤diem≤10 — sai là chặn' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'SQL Server: y hệt PK/NOT NULL/UNIQUE/CHECK/DEFAULT — chỉ khác `IDENTITY` thay `SERIAL`' },
        { mark: 'next', text: '**Ngày 6**: NULL — "chưa biết", và logic ba giá trị dễ gài bẫy' },
      ],
    },
  ],

  proof: {
    label: 'Đã chạy thật · PostgreSQL 15.4',
    lines: [
      '1) INSERT (email, tuoi) hop le -> id=1, vai_tro=user, diem=0.0 (DEFAULT)',
      '2) thieu email -> ERROR: null value in column "email" violates not-null constraint',
      '3) email trung -> ERROR: duplicate key ... unique constraint "tai_khoan_email_key"',
      '4) tuoi=200 -> ERROR: violates check constraint "tai_khoan_tuoi_check"',
      '5) diem=11  -> ERROR: violates check constraint "tai_khoan_diem_check"',
      '6) count(*) -> 1  (chi dong hop le ton tai)',
    ],
  },
};
