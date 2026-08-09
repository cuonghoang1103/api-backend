/** "100 Ngày Database với CuongThai" — Ngày 1: CSDL là gì? (mở khoá)
    Bài mở đầu: vì sao cần CSDL (không phải Excel/file), một chút lịch sử
    (Codd/SQL/PostgreSQL/SQL Server), và SQL đầu tiên chạy thật.

    ⚠ proof.lines trong thẻ là OUTPUT THẬT của psql (PostgreSQL 15.4). Loạt bài
    lấy PostgreSQL làm nền (khớp dự án user), ghi chú khác biệt SQL Server ở
    những chỗ liên quan. */
export default {
  day: 1,
  card: 'db-day-01',
  // Cloudflare đã cache bản 404 cho db-day-01.webp (lần kiểm GET trước khi ảnh
  // kịp lên R2). Bump sang URL mới db-day-01-v2.webp để né 404-cache. Xem
  // [[feedback_cdn_caches_404_too]].
  cardRev: 2,
  category: 'Database',
  hashtags: ['100NgayDatabase', 'Database', 'PostgreSQL', 'SQL'],
  codeLab: {
    track: 'postgresql',
    slug: 'your-first-query-select-every-column',
    title: 'Câu truy vấn đầu tiên: SELECT mọi cột',
  },

  content: `🗄️ 100 NGÀY DATABASE — NGÀY 1: CSDL LÀ GÌ?

Chào mừng bạn đến với hành trình 100 ngày. Đây là ngày đầu tiên, nên ta bắt đầu từ câu hỏi gốc rễ nhất — thứ mà rất nhiều người dùng cơ sở dữ liệu hằng ngày vẫn chưa trả lời rõ ràng: **cơ sở dữ liệu là gì, và vì sao cần nó?**

Nếu bạn từng thấy database "khó" và "mông lung", phần lớn là vì học nhảy vào cú pháp trước khi hiểu *vì sao*. Trăm ngày này ta đi ngược lại: hiểu bản chất trước, cú pháp theo sau. Và mỗi câu SQL trong loạt bài đều được **chạy thật trên PostgreSQL** rồi mới đưa lên — không có gì là lý thuyết suông.

━━━━━━━━━━━━━━━━━━━━

📊 "THÌ DÙNG EXCEL LÀ ĐƯỢC CHỨ GÌ?"

Đây là phản ứng tự nhiên. Excel (hay Google Sheets, hay một file văn bản) cũng lưu được dữ liệu dạng bảng: mỗi hàng một bản ghi, mỗi cột một thuộc tính. Vậy khác gì?

Khác ở bốn chỗ chí mạng, mà bạn sẽ đụng ngay khi làm thật:

1. **Không có luật.** Trong Excel, ô "điểm" gõ chữ "giỏi" cũng vào, ô "ngày sinh" gõ "hôm qua" cũng lọt. Không ai chặn. Ba tháng sau dữ liệu là một mớ hỗn độn không tin được.
2. **Chậm khi lớn.** Excel vài nghìn dòng đã ì ạch; một triệu dòng là bất khả thi. Cơ sở dữ liệu thật xử lý hàng trăm triệu dòng bình thường.
3. **Không dùng chung được.** Hai người mở cùng file Excel để sửa là hỏng — ghi đè lên nhau. Ứng dụng thật có hàng nghìn người dùng *cùng lúc*.
4. **Tìm kiếm thủ công.** Trong Excel bạn cuộn, lọc bằng tay. Với dữ liệu thật, bạn cần *hỏi*: "cho tôi mọi sinh viên điểm trên 8, sắp theo điểm giảm dần" — và có câu trả lời tức thì.

Cơ sở dữ liệu (CSDL) sinh ra để giải đúng bốn vấn đề đó. Nó không phải "file xịn hơn" — nó là một **chương trình luôn chạy**, giữ dữ liệu, cưỡng chế luật, và phục vụ nhiều người cùng lúc.

━━━━━━━━━━━━━━━━━━━━

📜 MỘT CHÚT LỊCH SỬ — ĐỂ HIỂU VÌ SAO NÓ NHƯ VẬY

Năm **1970**, một nhà khoa học của IBM tên **Edgar F. Codd** công bố một bài báo đổi đời ngành: *"A Relational Model of Data for Large Shared Data Banks"*. Ý tưởng của ông: đừng lưu dữ liệu theo cách máy tính tiện, hãy lưu theo **các bảng và quan hệ giữa chúng** — dựa trên toán học (đại số quan hệ) để truy vấn chặt chẽ. Đó là khai sinh của **cơ sở dữ liệu quan hệ** (relational database).

Vài năm sau, cũng tại IBM, **Donald Chamberlin** và **Raymond Boyce** tạo ra một ngôn ngữ để "nói chuyện" với CSDL quan hệ — ban đầu tên SEQUEL, sau rút gọn thành **SQL** (Structured Query Language). SQL trở thành ngôn ngữ chuẩn mà gần như mọi CSDL quan hệ đến nay vẫn dùng.

Từ nền tảng đó mọc lên các hệ CSDL bạn nghe hằng ngày:
- **PostgreSQL** — bắt nguồn từ dự án POSTGRES của giáo sư **Michael Stonebraker** tại Đại học Berkeley (1986), mã nguồn mở, mạnh mẽ, chuẩn mực. Đây là thứ **dự án của bạn đang dùng**, và là nền của loạt bài này.
- **SQL Server** — của Microsoft (khởi đầu hợp tác với Sybase, cuối thập niên 1980), thứ **bạn học trên lớp**.
- Cùng với MySQL, Oracle, SQLite...

Điểm mấu chốt: tất cả đều dựng trên **cùng một mô hình quan hệ của Codd** và **cùng ngôn ngữ SQL**. Nên học cái này là hiểu cái kia — điều ta sẽ nói ngay dưới đây.

━━━━━━━━━━━━━━━━━━━━

🧪 CHẠM THẬT: MỘT BẢNG, VÀI DÒNG SQL

Đủ lý thuyết. Xem CSDL làm việc. Đầu tiên, **tạo một bảng** — khai báo dữ liệu có hình dạng gì:

\`\`\`sql
CREATE TABLE sinh_vien (
    ma_sv    VARCHAR(10)  PRIMARY KEY,
    ho_ten   VARCHAR(50)  NOT NULL,
    diem_tb  NUMERIC(3,1) NOT NULL
);
\`\`\`

Mỗi cột có một **kiểu** cố định (\`ma_sv\` là chuỗi, \`diem_tb\` là số), và \`PRIMARY KEY\` nói \`ma_sv\` là định danh duy nhất. Đây đã là điểm khác Excel căn bản: dữ liệu có **hình dạng** được khai báo trước.

Thêm vài dòng và hỏi lại:

\`\`\`
2) INSERT 3 sinh vien hop le -> INSERT 0 3
3) SELECT diem_tb >= 8 ORDER BY DESC -> Chi 9.2, An 8.5 (2 dong)
\`\`\`

Câu \`SELECT\` là trái tim của SQL — bạn **tả thứ mình muốn** ("sinh viên điểm ≥ 8, sắp giảm dần"), CSDL tự lo cách tìm. Không cuộn, không lọc tay.

━━━━━━━━━━━━━━━━━━━━

🛡️ VÀ ĐÂY LÀ CHỖ CSDL TỎ RA VƯỢT TRỘI

Thử làm điều mà Excel cho phép: nhét chữ vào ô số, và tạo hai sinh viên trùng mã.

\`\`\`
4) chen diem_tb = 'gioi' -> ERROR: invalid input syntax for type numeric
5) chen ma_sv 'SV01' trung -> ERROR: duplicate key (sinh_vien_pkey)
\`\`\`

**Cả hai bị chặn thẳng.** Không phải vì bạn viết dòng code nào để kiểm — bạn chưa viết gì cả. **CSDL tự từ chối** dữ liệu vi phạm luật (sai kiểu, trùng khoá). Đây là khác biệt sống còn: trong file, dữ liệu sai vào êm rồi nổ ba tháng sau; trong CSDL, nó **không vào được ngay từ đầu**.

Đó chính là điều dòng cuối tấm thẻ nói: CSDL cưỡng chế **kiểu + khoá + ràng buộc**, còn Excel/file thì không.

━━━━━━━━━━━━━━━━━━━━

🔄 POSTGRESQL (DỰ ÁN) vs SQL SERVER (TRÊN LỚP) — CÓ SAO KHÔNG?

Đây là câu nhiều bạn lo, nên nói rõ luôn từ Ngày 1: **không sao cả, thậm chí là điểm cộng.**

Cả hai đều là CSDL quan hệ, đều dùng SQL, đều dựa trên mô hình của Codd. **Khoảng 90% kiến thức chuyển thẳng qua nhau** — chuẩn hoá, khoá, JOIN, GROUP BY, chỉ mục, giao dịch... giống hệt. Khác nhau chỉ ở **phương ngữ** (vài cú pháp, vài hàm). Ví dụ:

- Giới hạn dòng: PostgreSQL \`LIMIT 10\` · SQL Server \`SELECT TOP 10\`.
- Tự tăng ID: PostgreSQL \`SERIAL\` · SQL Server \`IDENTITY\`.
- Thay NULL: PostgreSQL \`COALESCE(x,y)\` · SQL Server có thêm \`ISNULL(x,y)\`.
- Phân biệt hoa/thường: PostgreSQL mặc định **có**, SQL Server mặc định **không**.

Loạt bài này lấy **PostgreSQL làm nền** (để khớp dự án bạn đang làm và chạy được thật), nhưng ở mỗi chỗ có khác biệt, tôi sẽ **ghi chú "SQL Server thế này"** để bạn dùng được cả hai. Học xong, bạn tự tin cả trên lớp lẫn trong dự án.

━━━━━━━━━━━━━━━━━━━━

🗺️ 100 NGÀY TỚI SẼ ĐI ĐÂU

Để bạn hình dung chặng đường: 10 giai đoạn, từ gốc tới sâu.

- **Nền tảng** (bảng, kiểu, SQL căn bản) → **Truy vấn** (WHERE, JOIN, GROUP BY, subquery, window function).
- **Thiết kế & chuẩn hoá** (mô hình ER, 1NF→BCNF) → **Kiểu dữ liệu sâu** (JSON, mảng, ngày giờ, NULL).
- **Chỉ mục & hiệu năng** (EXPLAIN, query planner) → **Giao dịch & đồng thời** (ACID, MVCC, khoá).
- **Nâng cao** (view, function, trigger) → **Vận hành** (backup, replication, bảo mật).
- **Thực chiến & tổng kết** (tối ưu thật, migration, so sánh sâu).

Mỗi ngày một viên gạch nhỏ, chạy thật, có bài luyện tập chấm tự động. Cộng lại, bạn sẽ *nắm chắc* database — không còn "khó" và "mông lung" nữa.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Nghĩ về một dữ liệu bạn từng lưu bằng Excel — liệt kê 3 vấn đề bạn từng gặp.
2. Với bảng \`sinh_vien\` ở trên, thử hình dung: kiểu nào cho "ngày sinh"? cho "đã tốt nghiệp"?
3. Đọc thử tên bài báo 1970 của Codd — nền móng của mọi thứ bạn sắp học.
4. Cài sẵn tâm thế: mỗi ngày *gõ thật*, đừng chỉ đọc.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Cơ sở dữ liệu không phải "Excel xịn" — nó là một hệ thống cho **dữ liệu có luật** (kiểu, khoá, ràng buộc — sai là chặn ngay), **truy vấn được** (tả cái muốn, máy đi tìm), **nhanh ở quy mô lớn**, và **nhiều người dùng cùng lúc**. Nền tảng của nó là mô hình quan hệ (Codd, 1970) và ngôn ngữ SQL, chung cho cả PostgreSQL lẫn SQL Server — nên học một là hiểu hai.

Hôm nay ta mới nhìn CSDL "từ xa". Ngày mai, bạn tự tay cài PostgreSQL trên máy và gõ câu SQL đầu tiên của chính mình — nhanh hơn bạn tưởng.

Ngày 2: **Cài PostgreSQL & câu SQL đầu tiên trong 5 phút** — cài bằng Docker (một dòng lệnh), kết nối bằng \`psql\`, và tự tay \`CREATE TABLE\` → \`INSERT\` → \`SELECT\` để thấy vòng đời dữ liệu chạy trước mắt. Hẹn gặp lại!

#100NgayDatabase #Database #PostgreSQL`,
};
