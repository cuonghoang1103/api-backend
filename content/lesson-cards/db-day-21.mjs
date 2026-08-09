/**
 * Thẻ "100 Ngày Database" — Ngày 21: Mô hình ER (mở Giai đoạn 3).
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/db-day-21.mjs
 *
 * ⚠ Không có `verify`. `proof.lines` là OUTPUT THẬT của psql.
 * ✅ Đã chạy thật trên PostgreSQL 15.4 (docker cuong_pg_new :5433), DB hoc_db_day21:
 *   ER Lop(1)-(N)HocSinh -> JOIN: An/Binh 12A, Chi 12B ; sĩ số 12A=2, 12B=1
 */
export default {
  series: '100 NGÀY DATABASE',
  day: 21,
  total: 100,
  titleLead: 'DB Day 21:',
  titleAccent: 'Mô hình thực thể–quan hệ',
  subtitle: 'Phác thảo bảng & mối quan hệ TRƯỚC khi gõ CREATE TABLE — mở GĐ3 📐',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. ER = BA THÀNH PHẦN 🧩',
      code: `Thực thể (Entity)   -> đối tượng: Lop, HocSinh
Thuộc tính (Attr.)  -> đặc điểm: ten, ho_ten
Quan hệ (Relation)  -> Lop (1) --- (N) HocSinh`,
      notes: [
        { mark: 'ok', text: 'Vẽ mô hình bằng ngôn ngữ nghiệp vụ trước, chưa cần nghĩ tới SQL' },
      ],
    },
    {
      tone: 'green',
      title: '2. ER → BẢNG 📋',
      code: `thực thể  -> BẢNG
thuộc tính -> CỘT
khoá chính (PK) -> định danh mỗi thực thể`,
      notes: [
        { mark: 'ok', text: 'Mỗi thực thể thành một bảng; mỗi bảng cần một khoá chính' },
      ],
    },
    {
      tone: 'yellow',
      title: '3. QUAN HỆ 1–N: KHOÁ NGOẠI Ở BÊN "NHIỀU" 🔗',
      code: `CREATE TABLE hoc_sinh (
  ..., lop_id INT REFERENCES lop(id)
);  -- 1 lớp có N học sinh`,
      notes: [
        { mark: 'ok', text: 'Quan hệ 1–nhiều: đặt khoá ngoại ở bảng bên "nhiều" (hoc_sinh)' },
      ],
    },
    {
      tone: 'pink',
      title: '4. BẢN SỐ (CARDINALITY) 🔢',
      code: `1–1  : người  --- hồ sơ
1–N  : lớp    --- học sinh
N–N  : học sinh --- môn học (cần bảng nối)`,
      notes: [
        { mark: 'ok', text: 'Xác định "một bên này ứng mấy bên kia" → quyết định đặt khoá ngoại ở đâu' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Công cụ vẽ: dbdiagram.io, pgAdmin (PG), SSMS diagram (SQL Server) — mô hình ER giống nhau mọi hệ' },
        { mark: 'next', text: '**Ngày 22**: khoá — khoá chính, khoá tự nhiên vs khoá thay thế (surrogate)' },
      ],
    },
  ],

  proof: {
    label: 'Đã chạy thật · PostgreSQL 15.4',
    lines: [
      '1) ER Lop(1)-(N)HocSinh hien thuc: JOIN hoc_sinh + lop ->',
      '     An 12A (Co Lan), Binh 12A (Co Lan), Chi 12B (Thay Hung)',
      '2) LEFT JOIN + GROUP BY: si so 12A = 2, 12B = 1',
    ],
  },
};
