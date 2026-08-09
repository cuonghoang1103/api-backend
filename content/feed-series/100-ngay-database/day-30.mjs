/** "100 Ngày Database với CuongThai" — Ngày 30: Ràng buộc nâng cao + thiết kế
    trọn một schema (khép Giai đoạn 3). Named CHECK, CHECK IN, composite PK,
    ON DELETE CASCADE/RESTRICT — ghép thành một lược đồ hoàn chỉnh.

    ⚠ proof.lines trong thẻ là OUTPUT THẬT của psql (PostgreSQL 15.4, DB
    hoc_db_day30), gồm tên constraint thật. */
export default {
  day: 30,
  card: 'db-day-30',
  category: 'Database',
  hashtags: ['100NgayDatabase', 'Database', 'PostgreSQL', 'SQL'],
  codeLab: {
    track: 'sql',
    slug: 'design-the-complete-schema-for-a-lending-library',
    title: 'Thiết kế trọn schema cho thư viện',
  },

  content: `🗄️ 100 NGÀY DATABASE — NGÀY 30: RÀNG BUỘC NÂNG CAO & THIẾT KẾ TRỌN MỘT SCHEMA

Đây là ngày cuối của Giai đoạn 3. Ta sẽ gom mọi thứ đã học — mô hình ER, khoá, chuẩn hoá, quan hệ — cộng thêm vài loại ràng buộc nâng cao, để **thiết kế trọn một lược đồ (schema)** từ đầu tới cuối, rồi xem các ràng buộc bảo vệ dữ liệu ra sao. Một bài thực hành tổng hợp đúng nghĩa. Kết quả là thật từ psql.

━━━━━━━━━━━━━━━━━━━━

🏛️ MỘT LƯỢC ĐỒ HOÀN CHỈNH

Ta dựng một cửa hàng nhỏ: khách hàng đặt đơn, mỗi đơn có nhiều dòng chi tiết trỏ tới sản phẩm. Bốn bảng, chuẩn hoá tới 3NF, ràng buộc đầy đủ:

\`\`\`sql
CREATE TABLE khach_hang (
  id    SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,          -- khoá tự nhiên (Ngày 22)
  ten   TEXT NOT NULL
);
CREATE TABLE san_pham (
  id      SERIAL PRIMARY KEY,
  ma_sku  TEXT NOT NULL UNIQUE,
  ten     TEXT NOT NULL,
  gia     INT  NOT NULL CONSTRAINT sp_gia_duong CHECK (gia > 0),   -- CHECK có TÊN
  ton_kho INT  NOT NULL DEFAULT 0 CHECK (ton_kho >= 0)
);
CREATE TABLE don_hang (
  id         SERIAL PRIMARY KEY,
  khach_id   INT NOT NULL REFERENCES khach_hang(id) ON DELETE RESTRICT,
  ngay       DATE NOT NULL DEFAULT CURRENT_DATE,
  trang_thai TEXT NOT NULL DEFAULT 'moi'
             CONSTRAINT dh_trang_thai CHECK (trang_thai IN ('moi','dang_giao','hoan_thanh','huy'))
);
CREATE TABLE chi_tiet_don (
  don_id      INT REFERENCES don_hang(id) ON DELETE CASCADE,
  san_pham_id INT REFERENCES san_pham(id) ON DELETE RESTRICT,
  so_luong    INT NOT NULL CHECK (so_luong > 0),
  PRIMARY KEY (don_id, san_pham_id)     -- bảng nối, khoá tổng hợp (Ngày 28)
);
\`\`\`

Đọc lại schema này là ôn cả Giai đoạn 3: khoá thay thế + tự nhiên, quan hệ 1–N, bảng nối nhiều–nhiều, và một loạt ràng buộc. Giờ xem chúng làm việc.

━━━━━━━━━━━━━━━━━━━━

✅ CHECK NÂNG CAO — CƯỠNG CHẾ LUẬT NGHIỆP VỤ

**\`CHECK\` có tên** giúp bắt lỗi rõ ràng trong ứng dụng. Giá phải dương:

\`\`\`sql
INSERT INTO san_pham (ma_sku, ten, gia) VALUES ('SKU3','Loi',-5);
-- ERROR: new row for relation "san_pham" violates check constraint "sp_gia_duong"
\`\`\`

**\`CHECK ... IN (...)\`** giới hạn một cột vào tập giá trị hợp lệ — như một "enum" nhẹ. Trạng thái lạ bị chặn:

\`\`\`sql
INSERT INTO don_hang (khach_id, ngay, trang_thai) VALUES (1, DATE '2026-08-02', 'xyz');
-- ERROR: new row for relation "don_hang" violates check constraint "dh_trang_thai"
\`\`\`

Nhờ đặt tên (\`sp_gia_duong\`, \`dh_trang_thai\`), ứng dụng biết *chính xác* luật nào bị vi phạm để hiện thông báo phù hợp — thay vì một lỗi khó hiểu.

━━━━━━━━━━━━━━━━━━━━

🔗 KHOÁ TỔNG HỢP & ON DELETE — TOÀN VẸN TỰ ĐỘNG

Khoá chính tổng hợp của bảng nối chặn trùng cặp:

\`\`\`sql
INSERT INTO chi_tiet_don (don_id, san_pham_id, so_luong) VALUES (1,1,5);
-- ERROR: duplicate key value violates unique constraint "chi_tiet_don_pkey"
\`\`\`

Và hai chính sách xoá khác nhau, chọn theo nghiệp vụ (Ngày 10):
- \`don_hang.khach_id ... ON DELETE RESTRICT\` — **không** cho xoá khách còn đơn:

\`\`\`sql
DELETE FROM khach_hang WHERE id = 1;
-- ERROR: ... violates foreign key constraint ... Key (id)=(1) is still referenced
\`\`\`

- \`chi_tiet_don.don_id ... ON DELETE CASCADE\` — xoá đơn thì các dòng chi tiết **tự xoá theo**:

\`\`\`sql
DELETE FROM don_hang WHERE id = 1;
SELECT count(*) AS chi_tiet_con_lai FROM chi_tiet_don;   -- -> 0
\`\`\`

Mỗi khoá ngoại chọn hành vi *đúng* với ý nghĩa của nó: giữ khách an toàn (RESTRICT), nhưng dọn chi tiết theo đơn (CASCADE). Toàn bộ được CSDL cưỡng chế, không cần một dòng code ứng dụng nào.

━━━━━━━━━━━━━━━━━━━━

✅ KHÉP GIAI ĐOẠN 3 — BẠN ĐÃ CÓ GÌ

Mười ngày qua, bạn học *cách thiết kế database cho đúng*:
- **Ngày 21–22:** mô hình ER; chọn khoá (tự nhiên vs thay thế, tổng hợp).
- **Ngày 23:** dị thường — vì sao cần chuẩn hoá.
- **Ngày 24–27:** 1NF → 2NF → 3NF → BCNF, chuỗi dạng chuẩn.
- **Ngày 28:** quan hệ nhiều–nhiều & bảng nối.
- **Ngày 29:** phi chuẩn hoá có chủ ý.
- **Ngày 30:** ràng buộc nâng cao & lược đồ hoàn chỉnh.

Giờ bạn không chỉ *dùng* được database — bạn *thiết kế* được một cái đúng đắn, sạch dư thừa, tự bảo vệ toàn vẹn. Đây là kỹ năng phân biệt người viết SQL với người làm chủ database.

━━━━━━━━━━━━━━━━━━━━

🔄 POSTGRESQL vs SQL SERVER

Mọi ràng buộc ở đây là **chuẩn SQL**: \`CHECK\` (có tên), \`CHECK ... IN\`, \`UNIQUE\`, khoá tổng hợp, \`ON DELETE CASCADE/RESTRICT\` — viết y như nhau ở PostgreSQL và SQL Server. Khác biệt duy nhất đã biết: sinh khoá (\`SERIAL\` vs \`IDENTITY\`) và mặc định ngày (\`CURRENT_DATE\` — cả hai đều có). Một schema chuẩn hoá tốt gần như *bê nguyên* được giữa hai hệ.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Thêm ràng buộc \`CHECK (email LIKE '%@%')\` vào \`khach_hang\` — đặt tên cho nó.
2. Thiết kế trọn schema cho một **thư viện** (sách, độc giả, lượt mượn) với đầy đủ khoá + ràng buộc.
3. Với \`chi_tiet_don\`, nên \`ON DELETE\` gì cho \`san_pham_id\`? Vì sao RESTRICT hợp lý hơn CASCADE?
4. Vì sao đặt tên cho ràng buộc lại hữu ích khi xử lý lỗi trong ứng dụng?

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Ràng buộc nâng cao — \`CHECK\` có tên, \`CHECK ... IN\`, khoá tổng hợp, các chính sách \`ON DELETE\` — là công cụ để một lược đồ **tự bảo vệ** luật nghiệp vụ. Ghép chúng với ER, khoá và chuẩn hoá, bạn thiết kế được một database hoàn chỉnh, sạch và bền. **Giai đoạn 3 — Thiết kế & Chuẩn hoá — chính thức khép lại.** Bạn đã đi từ "biết truy vấn" tới "biết thiết kế".

Ba giai đoạn qua, ta chủ yếu dùng các kiểu cơ bản (số, chuỗi, ngày). Nhưng PostgreSQL có cả một thế giới kiểu dữ liệu mạnh mẽ mà ít người khai thác hết — ngày–giờ với múi giờ, JSON, mảng, enum, UUID… Làm chủ chúng mở ra những thiết kế gọn và mạnh hơn nhiều. Đó là Giai đoạn 4.

Ngày 31 (mở Giai đoạn 4 — Kiểu dữ liệu sâu): **Ngày, giờ & múi giờ (timezone)** — \`DATE\`, \`TIMESTAMP\`, \`TIMESTAMPTZ\`, và vì sao lưu sai múi giờ là nguồn bug kinh điển. Hẹn gặp lại ở chặng đường mới!

#100NgayDatabase #Database #PostgreSQL`,
};
