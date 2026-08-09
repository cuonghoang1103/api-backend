/**
 * Thẻ "100 Ngày Database" — Ngày 2: Cài PostgreSQL & câu SQL đầu tiên.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/db-day-02.mjs
 *
 * ⚠ Thẻ Database KHÔNG có `verify`. `proof.lines` là OUTPUT THẬT của psql.
 * ✅ Đã chạy thật trên PostgreSQL 15.4 (docker cuong_pg_new :5433), DB hoc_db_day02:
 *   SELECT 2+3, 7/2, 7%2  -> 5 | 3 | 1
 *   INSERT x2 -> INSERT 0 1; id SERIAL tự sinh 1,2; xong mặc định = f
 *   UPDATE id=1 -> UPDATE 1 (xong=t); DELETE id=2 -> DELETE 1; con_lai = 1
 */
export default {
  series: '100 NGÀY DATABASE',
  day: 2,
  total: 100,
  titleLead: 'DB Day 2:',
  titleAccent: 'Cài PostgreSQL & câu SQL đầu tiên',
  subtitle: 'Một dòng Docker, rồi tự tay CREATE → INSERT → SELECT 🚀',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. CÀI TRONG 1 DÒNG (DOCKER) 🐳',
      code: `docker run --name pg \\
  -e POSTGRES_PASSWORD=123456 \\
  -p 5432:5432 -d postgres:15`,
      notes: [
        { mark: 'ok', text: 'Không cài lằng nhằng — một container là có server chạy' },
        { mark: 'dot', text: '`-p 5432:5432` mở cổng · mật khẩu đặt bằng biến môi trường' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. KẾT NỐI BẰNG psql 🔌',
      code: `docker exec -it pg psql -U postgres
-- hoặc từ máy:  psql -h localhost -U postgres
\\dt   -- liệt kê bảng
\\q    -- thoát`,
      notes: [
        { mark: 'ok', text: '`psql` = trình dòng lệnh chính thức để gõ SQL' },
        { mark: 'dot', text: 'Lệnh bắt đầu bằng `\\` là của psql, không phải SQL' },
      ],
    },
    {
      tone: 'green',
      title: '3. CÂU SQL ĐẦU TIÊN 🎯',
      code: `SELECT 'Xin chào, PostgreSQL!' AS loi_chao;
SELECT 2 + 3 AS tong, 7 / 2 AS chia_nguyen;
-- -> 5 | 3   (7/2 = 3: chia NGUYÊN!)`,
      notes: [
        { mark: 'ok', text: 'SELECT không cần bảng — chạy được ngay như máy tính bỏ túi' },
        { mark: 'dot', text: 'Số nguyên chia số nguyên ra số nguyên: `7/2 = 3`, không phải 3.5' },
      ],
    },
    {
      tone: 'pink',
      title: '4. VÒNG ĐỜI DỮ LIỆU 🔄',
      code: `CREATE TABLE viec_can_lam (
  id SERIAL PRIMARY KEY,
  noi_dung TEXT NOT NULL,
  xong BOOLEAN DEFAULT false);
INSERT -> SELECT -> UPDATE -> DELETE`,
      notes: [
        { mark: 'ok', text: '`SERIAL` = id tự tăng (1, 2, 3…) — không cần tự đánh số' },
        { mark: 'dot', text: 'CRUD = 4 việc cốt lõi: Tạo, Đọc, Sửa, Xoá' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'SQL Server: cài bằng installer/Docker `mssql`, kết nối bằng `sqlcmd`/SSMS — SQL gần như y hệt' },
        { mark: 'next', text: '**Ngày 3**: SELECT sâu hơn — chọn cột, đặt tên, cột tính toán, DISTINCT' },
      ],
    },
  ],

  /* Output THẬT của psql (hoc_db_day02) — không viết tay. */
  proof: {
    label: 'Đã chạy thật · PostgreSQL 15.4',
    lines: [
      '1) SELECT loi_chao -> Xin chào, PostgreSQL!',
      '2) SELECT 2+3, 7/2, 7%2 -> 5 | 3 | 1  (chia nguyen + phan du)',
      '3) CREATE TABLE viec_can_lam(id SERIAL, noi_dung, xong) -> OK',
      '4) INSERT 2 dong -> INSERT 0 1 (x2); id tu sinh 1, 2; xong = f',
      '5) UPDATE xong=true WHERE id=1 -> UPDATE 1; dong 1 xong = t',
      '6) DELETE WHERE id=2 -> DELETE 1; con_lai = 1',
    ],
  },
};
