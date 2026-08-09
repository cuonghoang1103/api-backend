/** "100 Ngày Database với CuongThai" — Ngày 7: Ghi dữ liệu an toàn.
    INSERT nhiều dòng + RETURNING; UPDATE/DELETE có WHERE (và hiểm hoạ quên
    WHERE); dùng giá trị hiện tại; RETURNING làm bằng chứng.

    ⚠ proof.lines trong thẻ là OUTPUT THẬT của psql (PostgreSQL 15.4, DB
    hoc_db_day07). Ghi chú SQL Server (OUTPUT thay RETURNING). */
export default {
  day: 7,
  card: 'db-day-07',
  category: 'Database',
  hashtags: ['100NgayDatabase', 'Database', 'PostgreSQL', 'SQL'],
  codeLab: {
    track: 'postgresql',
    slug: 'insert-rows-and-see-constraints-work',
    title: 'Chèn dòng & thấy ràng buộc hoạt động',
  },

  content: `🗄️ 100 NGÀY DATABASE — NGÀY 7: GHI DỮ LIỆU AN TOÀN

Ngày 2 bạn đã \`INSERT\`/\`UPDATE\`/\`DELETE\` lần đầu. Hôm nay ta làm chủ chúng thật sự — chèn nhiều dòng một lúc, thấy ngay kết quả bằng \`RETURNING\`, sửa dựa trên chính giá trị cũ, và quan trọng nhất: **khắc cốt luật \`WHERE\`** để không bao giờ phá cả bảng chỉ vì quên một chữ.

Ba lệnh này là phía "ghi" của mọi ứng dụng: đăng ký tài khoản (\`INSERT\`), đổi mật khẩu (\`UPDATE\`), xoá bài viết (\`DELETE\`). Làm đúng thì êm, làm ẩu thì mất dữ liệu thật. Mọi kết quả dưới đây là thật từ psql.

━━━━━━━━━━━━━━━━━━━━

📥 INSERT NHIỀU DÒNG — VÀ RETURNING ĐỂ THẤY NGAY

Không cần một câu \`INSERT\` cho mỗi dòng — gộp lại:

\`\`\`sql
INSERT INTO san_pham (ten, gia, ton_kho) VALUES
  ('Ban phim', 890000, 10),
  ('Chuot',    550000, 20),
  ('Tai nghe', 1200000, 5)
RETURNING id, ten;
\`\`\`

\`\`\`
 id |   ten
----+----------
  1 | Ban phim
  2 | Chuot
  3 | Tai nghe
(3 rows)
\`\`\`

Mệnh đề \`RETURNING\` là món quà của PostgreSQL: nó **trả lại chính những dòng vừa ghi**, kể cả các giá trị máy tự sinh như \`id\`. Nhờ vậy ứng dụng biết ngay id của bản ghi mới mà không phải truy vấn lại — cực kỳ tiện.

━━━━━━━━━━━━━━━━━━━━

🔧 UPDATE — SỬA ĐÚNG DÒNG, DÙNG ĐƯỢC GIÁ TRỊ CŨ

Giảm giá "Tai nghe" 10%, và xem kết quả:

\`\`\`sql
UPDATE san_pham SET gia = gia * 9 / 10 WHERE ten = 'Tai nghe'
RETURNING ten, gia;
\`\`\`

\`\`\`
   ten    |   gia
----------+---------
 Tai nghe | 1080000
(1 row)
\`\`\`

Để ý \`gia = gia * 9 / 10\`: vế phải dùng **chính giá trị hiện tại** của \`gia\`. Đây là mẫu cực phổ biến — tăng/giảm dựa trên giá trị cũ. Ví dụ khác, nhập thêm 100 con chuột vào kho:

\`\`\`sql
UPDATE san_pham SET ton_kho = ton_kho + 100 WHERE ten = 'Chuot';
-- ton_kho: 20 -> 120
\`\`\`

━━━━━━━━━━━━━━━━━━━━

🗑️ DELETE — XOÁ ĐÚNG DÒNG, CÓ BẰNG CHỨNG

Bỏ những mặt hàng sắp hết (tồn kho dưới 10):

\`\`\`sql
DELETE FROM san_pham WHERE ton_kho < 10 RETURNING ten, ton_kho;
\`\`\`

\`\`\`
   ten    | ton_kho
----------+---------
 Tai nghe |       5
(1 row)
\`\`\`

\`RETURNING\` lại chứng minh **đúng thứ vừa biến mất** — Tai nghe (tồn 5). Bảng còn lại:

\`\`\`sql
SELECT id, ten, gia, ton_kho FROM san_pham ORDER BY id;
-- -> Ban phim (890000, 10), Chuot (550000, 120)
\`\`\`

━━━━━━━━━━━━━━━━━━━━

⚠️ LUẬT SỐNG CÒN: QUÊN WHERE = ĐỔI/XOÁ TẤT CẢ

Đây là bài học mà nhiều dev học được bằng nước mắt. \`UPDATE\` và \`DELETE\` **không bắt buộc** có \`WHERE\` — và nếu thiếu, chúng tác động lên **mọi dòng**. Xem trên một bảng nháp:

\`\`\`sql
CREATE TABLE nhap (id INT, gia INT);
INSERT INTO nhap VALUES (1,100), (2,200), (3,300);
UPDATE nhap SET gia = 0;            -- KHÔNG có WHERE!
\`\`\`

\`\`\`
UPDATE 3
 id | gia
----+-----
  1 |   0
  2 |   0
  3 |   0
(3 rows)
\`\`\`

Chỉ một câu, **cả ba dòng** về 0. Trên bảng thật với hàng triệu bản ghi, \`DELETE FROM don_hang;\` (quên WHERE) xoá sạch mọi đơn hàng trong một nốt nhạc. Ba thói quen tự bảo vệ:

1. **Viết \`WHERE\` trước.** Gõ điều kiện lọc trước khi gõ phần \`SET\`/hành động.
2. **\`SELECT\` thử trước.** Chạy \`SELECT * FROM ... WHERE <đk>\` để xem *đúng* những dòng sắp bị đổi, rồi mới đổi \`SELECT\` thành \`UPDATE\`/\`DELETE\`.
3. **Bọc trong giao dịch** khi thao tác quan trọng: \`BEGIN; ... ; \` kiểm tra rồi \`COMMIT\` (hoặc \`ROLLBACK\` nếu sai). Ta sẽ học kỹ giao dịch ở giai đoạn sau — nó là chiếc "nút hoàn tác".

━━━━━━━━━━━━━━━━━━━━

🔄 POSTGRESQL vs SQL SERVER

- **Xem thứ vừa ghi:** \`RETURNING\` là của PostgreSQL. SQL Server dùng mệnh đề \`OUTPUT\`: \`INSERT ... OUTPUT inserted.id ...\`, \`DELETE ... OUTPUT deleted.*\`. Ý tưởng như nhau, cú pháp khác.
- **INSERT nhiều dòng \`VALUES (...), (...)\`, UPDATE/DELETE + WHERE, dùng giá trị hiện tại:** giống hệt ở cả hai.
- **Luật WHERE:** giống hệt — và hiểm hoạ quên WHERE cũng giống hệt. (SQL Server Management Studio có tuỳ chọn chặn \`UPDATE\`/\`DELETE\` không \`WHERE\` — nên bật.)

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Chèn 2 sản phẩm mới bằng một câu \`INSERT\`, lấy về \`id\` bằng \`RETURNING\`.
2. Tăng giá mọi sản phẩm 5% — viết câu \`UPDATE\` đúng (và nghĩ xem có cần \`WHERE\` không).
3. Trước khi \`DELETE\` hàng tồn < 10, hãy \`SELECT\` thử để chắc bạn xoá đúng dòng.
4. Vì sao bọc thao tác nguy hiểm trong \`BEGIN; ... ROLLBACK;\` lại an toàn để "thử"?

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Phía ghi của SQL gọn mà mạnh: \`INSERT\` nhiều dòng một lúc, \`RETURNING\` cho bằng chứng tức thì, \`UPDATE\`/\`DELETE\` sửa–xoá đúng dòng và dùng được cả giá trị cũ. Nhưng quyền lực đi kèm trách nhiệm: **luôn nghĩ \`WHERE\` trước**, \`SELECT\` thử, và bọc thao tác quan trọng trong giao dịch. Nhớ vậy, bạn sẽ không bao giờ có buổi chiều "xoá nhầm cả bảng".

Ta đã đọc và ghi khá vững. Từ ngày mai, ta quay lại phía *đọc* và làm nó thật sắc bén — bắt đầu từ nghệ thuật **lọc**: hỏi đúng những dòng mình cần giữa cả biển dữ liệu.

Ngày 8: **Lọc dữ liệu** — \`WHERE\` với \`AND\`/\`OR\`/\`NOT\`, danh sách \`IN\`, khoảng \`BETWEEN\`, và tìm theo mẫu \`LIKE\`. Hẹn gặp lại!

#100NgayDatabase #Database #PostgreSQL`,
};
