/**
 * Thẻ "100 Ngày Database" — Ngày 7: Ghi dữ liệu an toàn (INSERT/UPDATE/DELETE + RETURNING).
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/db-day-07.mjs
 *
 * ⚠ Không có `verify`. `proof.lines` là OUTPUT THẬT của psql.
 * ✅ Đã chạy thật trên PostgreSQL 15.4 (docker cuong_pg_new :5433), DB hoc_db_day07:
 *   UPDATE gia*9/10 WHERE Tai nghe -> 1080000
 *   DELETE WHERE ton_kho<10 -> xoá Tai nghe (5)
 *   UPDATE nhap SET gia=0 KHÔNG WHERE -> UPDATE 3 (mọi dòng!)
 */
export default {
  series: '100 NGÀY DATABASE',
  day: 7,
  total: 100,
  titleLead: 'DB Day 7:',
  titleAccent: 'Ghi dữ liệu an toàn',
  subtitle: 'INSERT / UPDATE / DELETE, RETURNING, và luật WHERE sống còn ✍️',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. INSERT NHIỀU DÒNG + RETURNING 📥',
      code: `INSERT INTO san_pham (ten, gia, ton_kho) VALUES
  ('Ban phim', 890000, 10),
  ('Chuot',    550000, 20),
  ('Tai nghe', 1200000, 5)
RETURNING id, ten;   -- -> 1,2,3 (id tự sinh)`,
      notes: [
        { mark: 'ok', text: 'Một câu chèn nhiều dòng · `RETURNING` cho xem ngay id vừa tạo' },
      ],
    },
    {
      tone: 'green',
      title: '2. UPDATE CÓ WHERE + RETURNING 🔧',
      code: `UPDATE san_pham SET gia = gia * 9 / 10
WHERE ten = 'Tai nghe' RETURNING ten, gia;
-- -> Tai nghe 1080000 (giảm 10%)
UPDATE san_pham SET ton_kho = ton_kho + 100
WHERE ten = 'Chuot';   -- dùng chính giá trị cũ`,
      notes: [
        { mark: 'ok', text: 'Sửa được bằng biểu thức trên giá trị hiện tại (tồn kho += 100)' },
      ],
    },
    {
      tone: 'pink',
      title: '3. DELETE CÓ WHERE + RETURNING 🗑️',
      code: `DELETE FROM san_pham WHERE ton_kho < 10
RETURNING ten, ton_kho;
-- -> Tai nghe (5) bị xoá`,
      notes: [
        { mark: 'ok', text: '`RETURNING` cho thấy đúng dòng vừa xoá — bằng chứng, không đoán' },
      ],
    },
    {
      tone: 'yellow',
      title: '4. ⚠️ LUẬT WHERE SỐNG CÒN',
      code: `UPDATE nhap SET gia = 0;   -- QUÊN WHERE!
-- -> UPDATE 3 : MỌI dòng thành 0
-- (thói quen: SELECT ... WHERE trước, rồi mới sửa)`,
      notes: [
        { mark: 'ok', text: 'UPDATE/DELETE không WHERE tác động TOÀN BẢNG. Nghĩ WHERE trước khi Enter' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'SQL Server: `RETURNING` → dùng mệnh đề `OUTPUT inserted.id` / `OUTPUT deleted.*`' },
        { mark: 'next', text: '**Ngày 8**: lọc dữ liệu — WHERE, AND/OR/NOT, IN, BETWEEN, LIKE' },
      ],
    },
  ],

  proof: {
    label: 'Đã chạy thật · PostgreSQL 15.4',
    lines: [
      '1) INSERT 3 dong RETURNING id -> 1 Ban phim, 2 Chuot, 3 Tai nghe',
      '2) UPDATE gia*9/10 WHERE Tai nghe -> 1080000 (giam 10%)',
      '3) UPDATE ton_kho = ton_kho + 100 WHERE Chuot -> 120',
      '4) DELETE WHERE ton_kho < 10 -> xoa Tai nghe (ton_kho=5)',
      '5) con lai: Ban phim(10), Chuot(120)  (2 dong)',
      '6) UPDATE nhap SET gia=0 (KHONG WHERE) -> UPDATE 3 : moi dong = 0!',
    ],
  },
};
