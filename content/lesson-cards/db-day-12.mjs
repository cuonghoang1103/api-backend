/**
 * Thẻ "100 Ngày Database" — Ngày 12: Nối 3+ bảng & self-join.
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/db-day-12.mjs
 *
 * ⚠ Không có `verify`. `proof.lines` là OUTPUT THẬT của psql.
 * ✅ Đã chạy thật trên PostgreSQL 15.4 (docker cuong_pg_new :5433), DB hoc_db_day12:
 *   JOIN 4 bảng -> An:Ban phim×1, An:Chuot×2, Binh:Man hinh×1
 *   self-join nhan_vien -> Binh/Chi quản lý bởi An; Dung bởi Binh; An là sếp tổng (null)
 */
export default {
  series: '100 NGÀY DATABASE',
  day: 12,
  total: 100,
  titleLead: 'DB Day 12:',
  titleAccent: 'Nối 3+ bảng & self-join',
  subtitle: 'Chuỗi khách→đơn→chi tiết→sản phẩm, và bảng tự nối chính nó 🔗',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. NỐI CHUỖI NHIỀU BẢNG ⛓️',
      code: `FROM khach_hang k
JOIN don_hang d      ON d.khach_id = k.id
JOIN chi_tiet_don ct ON ct.don_id = d.id
JOIN san_pham s      ON s.id = ct.san_pham_id`,
      notes: [
        { mark: 'ok', text: 'Mỗi `JOIN` thêm một bảng + một `ON`; nối bao nhiêu bảng cũng được' },
      ],
    },
    {
      tone: 'green',
      title: '2. KHÁCH NÀO MUA GÌ, MẤY CÁI 🛒',
      code: `SELECT k.ten, s.ten AS san_pham, ct.so_luong ...
-- An  | Ban phim | 1
-- An  | Chuot    | 2
-- Binh| Man hinh | 1`,
      notes: [
        { mark: 'ok', text: 'Dữ liệu tách 4 bảng, ghép lại thành một câu trả lời đọc được' },
      ],
    },
    {
      tone: 'yellow',
      title: '3. SELF-JOIN — BẢNG TỰ NỐI 🪞',
      code: `-- nhan_vien(id, ten, quan_ly_id -> nhan_vien.id)
FROM nhan_vien nv
LEFT JOIN nhan_vien sep ON sep.id = nv.quan_ly_id`,
      notes: [
        { mark: 'ok', text: 'Cùng một bảng, HAI bí danh (`nv` nhân viên, `sep` sếp) → tự nối chính nó' },
        { mark: 'dot', text: 'Dùng cho quan hệ phân cấp: nhân viên–quản lý, danh mục–danh mục cha' },
      ],
    },
    {
      tone: 'pink',
      title: '4. AI LÀ SẾP CỦA AI 👔',
      code: `nhan_vien | quan_ly
----------+---------
An        | (null)    -- sếp tổng
Binh, Chi | An
Dung      | Binh`,
      notes: [
        { mark: 'ok', text: '`LEFT JOIN` để giữ cả sếp tổng (không có quản lý → NULL)' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'SQL Server: nối chuỗi & self-join y hệt — chỉ cần bí danh khác nhau cho mỗi lần dùng bảng' },
        { mark: 'next', text: '**Ngày 13**: GROUP BY & HAVING — gộp nhóm và tính tổng/đếm/trung bình' },
      ],
    },
  ],

  proof: {
    label: 'Đã chạy thật · PostgreSQL 15.4',
    lines: [
      '1) JOIN 4 bang (khach->don->chi_tiet->san_pham):',
      '     An | Ban phim | 1 ;  An | Chuot | 2 ;  Binh | Man hinh | 1',
      '2) self-join nhan_vien (nv LEFT JOIN nhan_vien sep ON sep.id = nv.quan_ly_id):',
      '     An -> (null) [sep tong] ; Binh -> An ; Chi -> An ; Dung -> Binh',
    ],
  },
};
