/** "100 Ngày Database với CuongThai" — Ngày 21: Mô hình ER (mở Giai đoạn 3).
    Thực thể/thuộc tính/quan hệ, bản số (cardinality), từ ER sang bảng. Phác
    thảo thiết kế trước khi CREATE TABLE.

    ⚠ proof.lines trong thẻ là OUTPUT THẬT của psql (PostgreSQL 15.4, DB
    hoc_db_day21). ER là mô hình hoá — tool-agnostic, giống mọi hệ. */
export default {
  day: 21,
  card: 'db-day-21',
  category: 'Database',
  hashtags: ['100NgayDatabase', 'Database', 'PostgreSQL', 'SQL'],
  codeLab: {
    track: 'sql',
    slug: 'create-a-products-catalog-table-with-the-right-types',
    title: 'Thiết kế bảng danh mục với kiểu đúng',
  },

  content: `🗄️ 100 NGÀY DATABASE — NGÀY 21: MÔ HÌNH THỰC THỂ–QUAN HỆ (MỞ GIAI ĐOẠN 3)

Chào mừng đến **Giai đoạn 3 — Thiết kế & Chuẩn hoá**. Hai giai đoạn đầu, ta *dùng* các bảng có sẵn. Nhưng có một sự thật đã lởn vởn suốt: **một truy vấn hay chỉ tốt bằng thiết kế bảng bên dưới nó**. Bảng thiết kế sai — dữ liệu lặp, mâu thuẫn, khó sửa — thì không câu SQL nào cứu nổi. Vậy thiết kế *đúng* là thế nào? Bắt đầu từ đây: **mô hình thực thể–quan hệ (ER)** — cách phác thảo dữ liệu *trước khi* gõ dòng \`CREATE TABLE\` đầu tiên. Kết quả SQL bên dưới là thật từ psql.

━━━━━━━━━━━━━━━━━━━━

🧩 BA THÀNH PHẦN CỦA MỘT MÔ HÌNH ER

Thiết kế database bắt đầu bằng suy nghĩ *về nghiệp vụ*, không phải về SQL. Ba khối xây dựng:

- **Thực thể (entity)** — một "loại đối tượng" bạn cần lưu: \`Lop\`, \`HocSinh\`, \`SanPham\`, \`DonHang\`. Mỗi thực thể sẽ thành **một bảng**.
- **Thuộc tính (attribute)** — đặc điểm của thực thể: lớp có \`ten\`, \`gv_chu_nhiem\`; học sinh có \`ho_ten\`. Mỗi thuộc tính thành **một cột**.
- **Quan hệ (relationship)** — thực thể liên hệ với nhau ra sao: "một *lớp* có nhiều *học sinh*".

Vẽ một sơ đồ ER đơn giản cho ví dụ trường học:

\`\`\`
┌──────────────┐               ┌───────────────┐
│     LOP      │ 1           N │   HOC_SINH    │
├──────────────┤──────────────<├───────────────┤
│ id  (PK)     │               │ id  (PK)      │
│ ten          │               │ ho_ten        │
│ gv_chu_nhiem │               │ lop_id  (FK)  │
└──────────────┘               └───────────────┘
\`\`\`

Ký hiệu \`1 ─────< N\` nghĩa là "một lớp ứng với nhiều học sinh". PK = khoá chính (định danh), FK = khoá ngoại (mối nối). Sơ đồ này là *bản thiết kế* — ai cũng đọc hiểu, kể cả người không biết SQL.

━━━━━━━━━━━━━━━━━━━━

📋 TỪ ER SANG BẢNG — DỊCH SƠ ĐỒ THÀNH SQL

Quy tắc dịch rất thẳng: **thực thể → bảng, thuộc tính → cột, khoá chính định danh mỗi thực thể**:

\`\`\`sql
CREATE TABLE lop (
  id           SERIAL PRIMARY KEY,   -- định danh thực thể Lop
  ten          TEXT NOT NULL,
  gv_chu_nhiem TEXT
);
CREATE TABLE hoc_sinh (
  id     SERIAL PRIMARY KEY,
  ho_ten TEXT NOT NULL,
  lop_id INT NOT NULL REFERENCES lop(id)   -- mối quan hệ
);
\`\`\`

Mô hình này *chạy được* — thêm dữ liệu rồi đi theo quan hệ để hỏi "mỗi học sinh thuộc lớp nào":

\`\`\`sql
SELECT h.ho_ten, l.ten AS lop, l.gv_chu_nhiem
FROM hoc_sinh h JOIN lop l ON l.id = h.lop_id ORDER BY h.ho_ten;
\`\`\`

\`\`\`
 ho_ten | lop | gv_chu_nhiem
--------+-----+--------------
 An     | 12A | Co Lan
 Binh   | 12A | Co Lan
 Chi    | 12B | Thay Hung
(3 rows)
\`\`\`

Và "sĩ số mỗi lớp" (bên "1" gom bên "nhiều"):

\`\`\`sql
SELECT l.ten AS lop, count(h.id) AS si_so
FROM lop l LEFT JOIN hoc_sinh h ON h.lop_id = l.id GROUP BY l.ten ORDER BY l.ten;
-- -> 12A: 2,  12B: 1
\`\`\`

Thiết kế tốt = truy vấn tự nhiên. Nếu một câu hỏi nghiệp vụ thường gặp lại khó viết, đó là dấu hiệu mô hình cần xem lại.

━━━━━━━━━━━━━━━━━━━━

🔢 BẢN SỐ (CARDINALITY) — "MỘT BÊN NÀY ỨNG MẤY BÊN KIA"

Xác định *loại* quan hệ quyết định bạn đặt khoá ngoại ở đâu:

- **1–1** (một–một): mỗi người có đúng một hồ sơ. Hiếm; thường gộp chung một bảng, hoặc tách khi cần bảo mật/hiệu năng.
- **1–N** (một–nhiều): một lớp có nhiều học sinh. **Phổ biến nhất.** Khoá ngoại đặt ở bảng bên **"nhiều"** (\`hoc_sinh.lop_id\`) — vì mỗi học sinh chỉ thuộc một lớp.
- **N–N** (nhiều–nhiều): một học sinh học nhiều môn, một môn có nhiều học sinh. **Không** thể đặt khoá ngoại trực tiếp — phải có một **bảng nối** ở giữa (ta đã thấy \`chi_tiet_don\` ở Ngày 12, và sẽ đào sâu ở Ngày 28).

Đặt khoá ngoại đúng bên là một trong những quyết định thiết kế cốt lõi — sai bên thì mô hình không diễn tả đúng thực tế.

━━━━━━━━━━━━━━━━━━━━

🔄 POSTGRESQL vs SQL SERVER

Mô hình ER là **tư duy thiết kế**, không phụ thuộc hệ nào — thực thể/thuộc tính/quan hệ/bản số giống hệt cho PostgreSQL, SQL Server, hay bất kỳ CSDL quan hệ nào. Chỉ **công cụ vẽ** khác: dbdiagram.io (chung), pgAdmin cho PostgreSQL, hay trình "Database Diagram" trong SSMS cho SQL Server. Bản dịch ER → \`CREATE TABLE\` cũng là SQL chuẩn, gần như y hệt hai bên.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Vẽ ER cho một blog: \`TacGia\`, \`BaiViet\`, \`BinhLuan\` — xác định bản số giữa chúng.
2. Trong quan hệ 1–N "khách hàng — đơn hàng", khoá ngoại đặt ở bảng nào? Vì sao?
3. Liệt kê 3 thực thể của một hệ thống thư viện và thuộc tính chính của mỗi cái.
4. Quan hệ "sinh viên — môn học" là loại nào? Cần thêm gì để mô hình hoá?

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Mô hình ER là bước đầu tiên của thiết kế database: phác thảo **thực thể** (→ bảng), **thuộc tính** (→ cột), **quan hệ** và **bản số** (→ đặt khoá ngoại đúng chỗ) — bằng ngôn ngữ nghiệp vụ, trước khi chạm tới SQL. Một sơ đồ ER tốt làm các truy vấn sau này trở nên tự nhiên, và là bản đồ chung cho cả đội.

Nhưng ta đã dùng \`SERIAL id\` làm khoá chính mà chưa hỏi: *đó có phải lựa chọn đúng không?* Khi nào nên dùng một mã có sẵn (số CMND, mã sản phẩm) làm khoá, khi nào nên tự sinh id? Câu hỏi tưởng nhỏ này ảnh hưởng lớn tới cả hệ thống — và là bài ngày mai.

Ngày 22: **Khoá** — khoá chính, khoá ứng viên, **khoá tự nhiên vs khoá thay thế (surrogate)**, và khoá tổng hợp: chọn định danh cho bảng sao cho đúng và bền. Hẹn gặp lại!

#100NgayDatabase #Database #PostgreSQL`,
};
