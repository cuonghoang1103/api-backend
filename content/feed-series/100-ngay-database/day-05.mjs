/** "100 Ngày Database với CuongThai" — Ngày 5: Ràng buộc.
    PRIMARY KEY, NOT NULL, UNIQUE, CHECK, DEFAULT — biến quy tắc nghiệp vụ
    thành luật CSDL tự cưỡng chế. Mỗi ràng buộc chặn một loại dữ liệu sai.

    ⚠ proof.lines trong thẻ là OUTPUT THẬT của psql (PostgreSQL 15.4, DB
    hoc_db_day05), gồm tên constraint thật (tai_khoan_email_key, ...). */
export default {
  day: 5,
  card: 'db-day-05',
  category: 'Database',
  hashtags: ['100NgayDatabase', 'Database', 'PostgreSQL', 'SQL'],
  codeLab: {
    track: 'postgresql',
    slug: 'enforce-values-with-check-constraints',
    title: 'Cưỡng chế giá trị bằng CHECK',
  },

  content: `🗄️ 100 NGÀY DATABASE — NGÀY 5: RÀNG BUỘC — LUẬT CỦA BẢNG

Ngày 4, kiểu dữ liệu bảo vệ *một ô* (ô số không nhận chữ). Nhưng nhiều luật quan trọng nằm ở mức cao hơn: "mỗi email chỉ được đăng ký một lần", "điểm phải từ 0 đến 10", "cột này không được bỏ trống". Đó là **ràng buộc** (constraint) — bạn khai báo luật *một lần* trong bảng, và CSDL tự cưỡng chế nó với **mọi** thao tác ghi, mãi mãi.

Đây chính là siêu năng lực làm CSDL khác một file: dữ liệu không chỉ được lưu, mà được **giữ đúng**. Ta gặp năm ràng buộc cốt lõi, và xem tận mắt từng cái chặn dữ liệu sai (kết quả thật từ psql).

━━━━━━━━━━━━━━━━━━━━

🧱 KHAI BÁO LUẬT NGAY TRONG BẢNG

\`\`\`sql
CREATE TABLE tai_khoan (
  id      SERIAL PRIMARY KEY,
  email   TEXT NOT NULL UNIQUE,
  tuoi    INT  CHECK (tuoi >= 0 AND tuoi <= 150),
  vai_tro TEXT NOT NULL DEFAULT 'user',
  diem    NUMERIC(3,1) NOT NULL DEFAULT 0 CHECK (diem >= 0 AND diem <= 10)
);
\`\`\`

Đọc bảng này như một bản hợp đồng:
- **PRIMARY KEY** (\`id\`) — định danh duy nhất mỗi dòng; ngầm hiểu là \`NOT NULL\` + \`UNIQUE\`. Mỗi bảng có đúng một khoá chính.
- **NOT NULL** (\`email\`, \`vai_tro\`, \`diem\`) — bắt buộc phải có giá trị.
- **UNIQUE** (\`email\`) — không hai dòng nào trùng nhau ở cột này.
- **CHECK** (\`tuoi\`, \`diem\`) — giá trị phải thoả một điều kiện logic.
- **DEFAULT** (\`vai_tro\`, \`diem\`) — nếu không nêu, tự điền giá trị này.

━━━━━━━━━━━━━━━━━━━━

✍️ DEFAULT — ĐỠ QUÊN, ĐỒNG NHẤT

Thêm một tài khoản, chỉ nêu \`email\` và \`tuoi\`:

\`\`\`sql
INSERT INTO tai_khoan (email, tuoi) VALUES ('an@example.com', 20);
SELECT id, email, tuoi, vai_tro, diem FROM tai_khoan;
\`\`\`

\`\`\`
 id |     email      | tuoi | vai_tro | diem
----+----------------+------+---------+------
  1 | an@example.com |   20 | user    |  0.0
(1 row)
\`\`\`

\`vai_tro\` tự thành \`'user'\` và \`diem\` tự thành \`0.0\` — dù ta không hề nhập. \`DEFAULT\` giúp dữ liệu đồng nhất và tránh lỗi "quên điền".

━━━━━━━━━━━━━━━━━━━━

🚫 NOT NULL & UNIQUE — CHẶN THIẾU VÀ TRÙNG

Thiếu \`email\` (\`NOT NULL\`):

\`\`\`sql
INSERT INTO tai_khoan (tuoi) VALUES (30);
\`\`\`

\`\`\`
ERROR:  null value in column "email" of relation "tai_khoan" violates not-null constraint
DETAIL:  Failing row contains (2, null, 30, user, 0.0).
\`\`\`

Đăng ký lại \`email\` đã tồn tại (\`UNIQUE\`):

\`\`\`sql
INSERT INTO tai_khoan (email, tuoi) VALUES ('an@example.com', 25);
\`\`\`

\`\`\`
ERROR:  duplicate key value violates unique constraint "tai_khoan_email_key"
DETAIL:  Key (email)=(an@example.com) already exists.
\`\`\`

CSDL còn **đặt tên** cho ràng buộc (\`tai_khoan_email_key\`) — cực hữu ích khi bắt lỗi trong ứng dụng: bạn biết chính xác luật nào bị vi phạm để hiện thông báo phù hợp ("Email này đã được dùng").

━━━━━━━━━━━━━━━━━━━━

✅ CHECK — CƯỠNG CHẾ LUẬT NGHIỆP VỤ

\`CHECK\` biến quy tắc kinh doanh thành luật dữ liệu. Tuổi 200 và điểm 11 đều vô lý:

\`\`\`sql
INSERT INTO tai_khoan (email, tuoi) VALUES ('binh@example.com', 200);
-- ERROR:  new row ... violates check constraint "tai_khoan_tuoi_check"

INSERT INTO tai_khoan (email, diem) VALUES ('chi@example.com', 11);
-- ERROR:  new row ... violates check constraint "tai_khoan_diem_check"
\`\`\`

Cả hai bị chặn. Điều tuyệt vời: luật này đúng **bất kể ai ghi** — ứng dụng web, script nhập liệu, hay một bạn dev gõ tay trong \`psql\` lúc nửa đêm. Không thể lách. Sau tất cả, chỉ dòng hợp lệ đầu tiên tồn tại:

\`\`\`sql
SELECT count(*) AS so_dong FROM tai_khoan;   -- -> 1
\`\`\`

*(Ghi chú nhỏ: \`id\` của các dòng lỗi vẫn "ngốn" số thứ tự của SERIAL, nên sau này id có thể có khoảng trống — điều bình thường, ta sẽ hiểu vì sao ở phần giao dịch.)*

━━━━━━━━━━━━━━━━━━━━

🔄 POSTGRESQL vs SQL SERVER

Tin vui: **ràng buộc gần như giống hệt** ở hai hệ — \`PRIMARY KEY\`, \`NOT NULL\`, \`UNIQUE\`, \`CHECK\`, \`DEFAULT\` đều là chuẩn SQL.
- Khác biệt chính đã gặp: tự tăng khoá là \`SERIAL\` (PostgreSQL) vs \`IDENTITY(1,1)\` (SQL Server).
- Cách đặt tên ràng buộc tự sinh khác nhau (PostgreSQL: \`bang_cot_key\`/\`bang_cot_check\`), nhưng bạn nên **tự đặt tên** cho ràng buộc quan trọng: \`CONSTRAINT diem_hop_le CHECK (diem BETWEEN 0 AND 10)\` — chạy y nhau ở cả hai.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Thêm ràng buộc \`CHECK (email LIKE '%@%')\` cho cột email — thử chèn \`'sai-email'\` xem lỗi gì.
2. Vì sao \`PRIMARY KEY\` không cần viết thêm \`NOT NULL\`?
3. Đặt \`DEFAULT\` cho một cột \`ngay_tao\` là ngày hiện tại (gợi ý: \`DEFAULT CURRENT_DATE\`).
4. \`UNIQUE\` trên \`email\` và \`UNIQUE\` trên \`(ho, ten)\` khác nhau thế nào?

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Ràng buộc là nơi bạn dạy CSDL các *luật* của thế giới mình: khoá chính định danh, \`NOT NULL\` bắt buộc, \`UNIQUE\` chống trùng, \`CHECK\` cưỡng chế miền giá trị, \`DEFAULT\` điền sẵn. Khai báo một lần, cưỡng chế mãi mãi, không ai lách được. Dữ liệu của bạn từ nay *không thể* rơi vào trạng thái vô lý.

Nhưng có một giá trị đặc biệt cứ luồn lách qua các luật này một cách tinh vi: \`NULL\` — nghĩa là "chưa biết". Nó hành xử khác mọi giá trị khác và là cái bẫy logic kinh điển của SQL.

Ngày 6: **NULL & logic ba giá trị** — vì sao \`NULL = NULL\` lại KHÔNG đúng, phải dùng \`IS NULL\`, và những cú lừa của \`NULL\` trong phép so sánh, \`COUNT\`, và \`WHERE\`. Hẹn gặp lại!

#100NgayDatabase #Database #PostgreSQL`,
};
