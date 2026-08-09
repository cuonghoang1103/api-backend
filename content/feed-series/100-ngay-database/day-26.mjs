/** "100 Ngày Database với CuongThai" — Ngày 26: Dạng chuẩn 3 (3NF).
    2NF + không phụ thuộc bắc cầu: cột không-khoá không phụ thuộc cột không-khoá
    khác. Câu thần chú "khoá, toàn khoá, không gì ngoài khoá".

    ⚠ proof.lines trong thẻ là OUTPUT THẬT của psql (PostgreSQL 15.4, DB
    hoc_db_day26). 3NF là nguyên tắc thiết kế — hệ nào cũng vậy. */
export default {
  day: 26,
  card: 'db-day-26',
  category: 'Database',
  hashtags: ['100NgayDatabase', 'Database', 'PostgreSQL', 'SQL'],
  codeLab: {
    track: 'sql',
    slug: 'enforce-unique-emails-and-sensible-defaults-on-a-users-table',
    title: 'Ràng buộc email duy nhất & mặc định hợp lý',
  },

  content: `🗄️ 100 NGÀY DATABASE — NGÀY 26: DẠNG CHUẨN 3 (3NF) — BỎ PHỤ THUỘC BẮC CẦU

Ta đã qua 1NF (ô nguyên tử) và 2NF (không phụ thuộc bộ phận). Còn một loại phụ thuộc lén lút nữa — xảy ra *ngay cả với khoá đơn*: một cột không-khoá phụ thuộc vào **một cột không-khoá khác**, chỉ *gián tiếp* liên hệ với khoá. Dọn nó là **3NF (Third Normal Form)** — và đây là dạng chuẩn mà **hầu hết hệ thống thực tế nhắm tới**. Đạt 3NF là dữ liệu của bạn đã sạch cho phần lớn nhu cầu. Kết quả bên dưới là thật từ psql.

━━━━━━━━━━━━━━━━━━━━

🔗 PHỤ THUỘC BẮC CẦU LÀ GÌ?

Xét bảng nhân viên với khoá chính đơn \`id\`, nhưng nhét kèm tên phòng ban:

\`\`\`
 id | ten  | phong_ban_id | phong_ban_ten
----+------+--------------+---------------
  1 | An   |           10 | Ky thuat
  2 | Binh |           10 | Ky thuat        <- lặp!
  3 | Chi  |           20 | Kinh doanh
\`\`\`

Chuỗi phụ thuộc là: \`id → phong_ban_id → phong_ban_ten\`. Nghĩa là \`phong_ban_ten\` *không* phụ thuộc trực tiếp vào khoá \`id\`, mà phụ thuộc vào \`phong_ban_id\` (một cột **không-khoá**), rồi cột đó mới liên hệ với \`id\`. Đây là **phụ thuộc bắc cầu (transitive dependency)** — "A phụ thuộc B, B phụ thuộc khoá, nên A phụ thuộc khoá *gián tiếp*". Bảng này đã ở 2NF (khoá đơn nên không có phụ thuộc bộ phận), nhưng vẫn dư thừa: tên "Ky thuat" chép lại ở mọi nhân viên cùng phòng.

━━━━━━━━━━━━━━━━━━━━

⚠️ VÀ LẠI SINH DỊ THƯỜNG

Đổi tên phòng 10, lỡ sót một nhân viên:

\`\`\`sql
UPDATE nhan_vien_xau SET phong_ban_ten = 'Cong nghe' WHERE id = 1;   -- sót Binh (id 2)
SELECT DISTINCT phong_ban_id, phong_ban_ten FROM nhan_vien_xau WHERE phong_ban_id = 10;
\`\`\`

\`\`\`
 phong_ban_id | phong_ban_ten
--------------+---------------
           10 | Cong nghe
           10 | Ky thuat
(2 rows)
\`\`\`

Phòng 10 giờ có hai tên. Bản chất là thông tin về "phòng ban" đang sống ký sinh trong bảng "nhân viên" — sai chỗ, nên đổi một lần là sót.

━━━━━━━━━━━━━━━━━━━━

✅ SỬA 3NF: TÁCH THỰC THỂ RA BẢNG RIÊNG

Luật sửa: **nhóm cột phụ thuộc bắc cầu mô tả một thực thể khác → cho nó một bảng riêng.** \`phong_ban_ten\` mô tả *phòng ban*, không phải *nhân viên* → tạo bảng \`phong_ban\`:

\`\`\`sql
CREATE TABLE phong_ban (id INT PRIMARY KEY, ten TEXT NOT NULL);   -- tên phòng MỘT chỗ
CREATE TABLE nhan_vien (
  id INT PRIMARY KEY, ten TEXT, phong_ban_id INT REFERENCES phong_ban(id)
);
\`\`\`

Đổi tên một lần, mọi nhân viên đều đồng nhất:

\`\`\`sql
UPDATE phong_ban SET ten = 'Cong nghe' WHERE id = 10;
SELECT nv.id, nv.ten, pb.ten AS phong_ban
FROM nhan_vien nv JOIN phong_ban pb ON pb.id = nv.phong_ban_id ORDER BY nv.id;
\`\`\`

\`\`\`
 id | ten  | phong_ban
----+------+------------
  1 | An   | Cong nghe
  2 | Binh | Cong nghe
  3 | Chi  | Kinh doanh
(3 rows)
\`\`\`

An và Binh đều thấy "Cong nghe" — vì tên phòng chỉ tồn tại một chỗ. Đây chính là cấu trúc \`nhan_vien → phong_ban\` chuẩn mực.

━━━━━━━━━━━━━━━━━━━━

🔑 CÂU THẦN CHÚ CỦA CHUẨN HOÁ

Ba dạng chuẩn đầu tóm gọn trong một câu nổi tiếng — mọi cột không-khoá phải phụ thuộc vào:

> **"Khoá, toàn khoá, và không gì ngoài khoá."**

- **Khoá** (the key) → 1NF: có khoá, mỗi ô nguyên tử.
- **Toàn khoá** (the whole key) → 2NF: không phụ thuộc bộ phận.
- **Không gì ngoài khoá** (nothing but the key) → 3NF: không phụ thuộc bắc cầu.

Nhớ câu này là nhớ được cả cốt lõi của chuẩn hoá. **Đạt 3NF là mục tiêu thực tế của gần như mọi thiết kế** — dữ liệu sạch, ít dư thừa, dễ bảo trì, mà chưa bị tách vụn quá mức.

━━━━━━━━━━━━━━━━━━━━

🔄 POSTGRESQL vs SQL SERVER

3NF là nguyên tắc thiết kế, giống nhau mọi hệ. Trong thực tế, "chuẩn hoá tới 3NF" là câu nói cửa miệng của dân thiết kế database, dù họ dùng PostgreSQL, SQL Server hay MySQL. Các dạng chuẩn cao hơn (BCNF, 4NF, 5NF) tồn tại nhưng ít khi phải nghĩ tới — ta xem BCNF ngày mai để trọn bức tranh.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Trong bảng \`san_pham(id, ten, danh_muc_id, danh_muc_ten)\` — chỉ ra phụ thuộc bắc cầu và sửa về 3NF.
2. Bảng \`don_hang(id, khach_id, khach_ten, khach_thanh_pho)\` vi phạm 3NF ở đâu?
3. Đọc thuộc câu "khoá, toàn khoá, không gì ngoài khoá" và giải thích mỗi vế ứng dạng chuẩn nào.
4. Vì sao phụ thuộc bắc cầu vẫn xảy ra dù bảng có khoá đơn (đã ở 2NF)?

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

3NF xây trên 2NF và loại **phụ thuộc bắc cầu**: cột không-khoá không được phụ thuộc vào cột không-khoá khác — mọi cột phải phụ thuộc *trực tiếp* vào khoá. Khi một nhóm cột thực chất mô tả một thực thể khác, hãy tách nó ra bảng riêng. Gói gọn trong câu "khoá, toàn khoá, và không gì ngoài khoá", đây là mục tiêu thiết kế của hầu hết hệ thống thật.

3NF đúng cho *gần như* mọi trường hợp. Nhưng có một số tình huống hiếm mà 3NF vẫn để lọt một chút dư thừa — khi bảng có nhiều khoá ứng viên chồng lấn. Dạng chuẩn chặt hơn xử lý nốt điều đó là BCNF, và là bài ngày mai.

Ngày 27: **BCNF (Boyce–Codd)** — bản "3NF nghiêm khắc": mọi yếu tố xác định (determinant) đều phải là một khoá ứng viên. Khi nào 3NF chưa đủ và BCNF ra tay. Hẹn gặp lại!

#100NgayDatabase #Database #PostgreSQL`,
};
