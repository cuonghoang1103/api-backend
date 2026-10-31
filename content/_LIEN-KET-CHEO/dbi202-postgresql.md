# Liên kết chéo DBI202 (Academy) ↔ PostgreSQL

Deep link: `/courses/<slug-khoá>/learn?lessonSlug=<slug-bài>`. Academy: `introduction-to-databases`. Khối `<a class="link-card lien-ket-cheo">` cuối `ml-vi` và `ml-en`.

| DBI202 | Courses | Giống | Courses sâu thêm |
|---|---|---|---|
| `dbi202-kieu-du-lieu` | `postgresql/postgresql-2-1-so` | đừng lưu tiền bằng số thực dấu phẩy động mà dùng kiểu thập phân chính xác, và khoá tự tăng bằng IDENTITY | họ số nguyên và cách chọn kiểu số, vì sao dùng IDENTITY chứ không dùng serial, luật tiền bạc numeric vs float |
| `dbi202-kieu-du-lieu` | `postgresql/postgresql-2-3-ngay-gio` | ngày giờ — mỗi ý nghĩa một kiểu | timestamp khác timestamptz ở đâu, now()/age()/interval, hai kiểu thời gian duy nhất bạn cần |
| `dbi202-rang-buoc-sql` | `postgresql/postgresql-3-3-rang-buoc-cot` | viết luật dữ liệu thành ràng buộc để dữ liệu sai không thể vào bảng, và đặt tên ràng buộc cho rõ | cột sinh (tính tự động, không bao giờ lệch), UNIQUE tổ hợp và vì sao cái tên quan trọng, luật nên sống ở đâu |
| `dbi202-rang-buoc-sql` | `postgresql/postgresql-3-4-alter-chuan-hoa` | sửa một bảng đã có dữ liệu bằng ALTER TABLE | lệnh ALTER nào khoá bảng và cách làm cho an toàn, thiết kế sao cho ít phải đổi |
| `dbi202-chuan-hoa-vi-du` | `postgresql/postgresql-3-4-alter-chuan-hoa` | một sự thật chỉ nằm ở một chỗ | chuẩn hoá đi cùng ALTER TABLE trên bảng đã có dữ liệu, và phần thưởng của chuẩn hoá là JOIN (bài 5.1) |
| `dbi202-join-day-du` | `postgresql/postgresql-5-2-outer-join` | LEFT JOIN giữ mọi dòng bên trái, khuôn phản nối "ai không có gì?", RIGHT và FULL | bốn hình dạng đặt cạnh nhau; xung quanh nó còn máy chủ thật sự làm gì khi join (bài 5.1), cạm bẫy join (bài 5.4) và chiến lược Nested Loop/Hash/Merge (bài 10.2) |
| `dbi202-group-by-subquery` | `postgresql/postgresql-6-2-group-by` | GROUP BY và hàm tổng hợp | luật ai cũng dính (mọi cột chọn phải được gom hoặc tổng hợp), luật về độ mịn, gom theo nhiều cột; các bài sau có HAVING vs WHERE và FILTER (6.3), tổng hợp trên JOIN và fan-out (6.4) |
| `dbi202-truy-van-long` | `postgresql/postgresql-7-2-correlated-exists` | subquery tương quan, EXISTS/NOT EXISTS và bẫy NOT IN khi gặp NULL | câu hỏi duy nhất cần hỏi — có tương quan hay không; bài 7.3 thêm CTE (WITH) để viết truy vấn theo bước, bài 7.4 CTE đệ quy |
| `dbi202-cap-nhat-du-lieu` | `postgresql/postgresql-4-4-update-delete` | tai hoạ thiếu mệnh đề WHERE và cách tự bảo vệ | UPDATE/DELETE ... RETURNING cho thấy ngay dòng nào bị đổi, hình dạng của một lệnh ghi an toàn; bài 4.1 thêm INSERT nhiều dòng, RETURNING và UPSERT |
| `dbi202-view` | `postgresql/postgresql-12-3-view` | view là truy vấn được lưu, có view cập nhật được và WITH CHECK OPTION bịt lối thoát | đặt tên cho truy vấn để chỉ viết một lần; bài 12.4 materialized view: đánh đổi độ tươi lấy tốc độ |
| `dbi202-proc-function` | `postgresql/postgresql-12-1-ham` | đặt logic ngay cạnh dữ liệu bằng hàm và thủ tục | hàm SQL đơn giản, PL/pgSQL khi cần biến và rẽ nhánh, volatility — khai báo quyết định hàm chạy bao nhiêu lần |
| `dbi202-trigger-cursor` | `postgresql/postgresql-12-2-trigger` | trigger chạy tự động khi dữ liệu đổi, bất kể ứng dụng có nhớ hay không | trigger cập nhật updated_at, nhật ký kiểm toán chỉ ghi thay đổi thật, cái bẫy BEFORE trigger trả về NULL |
| `dbi202-chi-muc` | `postgresql/postgresql-9-1-chi-muc-la-gi` | chỉ mục như mục lục sách làm truy vấn nhanh | không có chỉ mục thì Seq Scan, thêm chỉ mục thì Index Scan, vì sao là B-tree; các bài sau còn chỉ mục tổ hợp, covering, khi chỉ mục KHÔNG được dùng và các loại GIN/BRIN/GiST |
| `dbi202-execution-plan` | `postgresql/postgresql-10-1-doc-explain` | đọc kế hoạch thực thi để biết chỉ mục có được dùng không | EXPLAIN trơn (ước lượng) so với EXPLAIN ANALYZE (chạy thật), đọc plan từ trong ra; bài sau có BUFFERS và quy trình tinh chỉnh |
| `dbi202-execution-plan` | `postgresql/postgresql-9-2-to-hop-covering` | chỉ mục ghép nhiều cột và thứ tự cột trong chỉ mục | chọn cột nào để đánh chỉ mục, chỉ mục tổ hợp và covering index trên PostgreSQL |
| `dbi202-transaction-acid` | `postgresql/postgresql-1-2-acid` | ACID, mỗi chữ một bảo đảm | từng bảo đảm ACID được chứng minh trên PostgreSQL thật |
| `dbi202-transaction-acid` | `postgresql/postgresql-11-3-muc-co-lap` | các mức cô lập và hiện tượng mỗi mức ngăn được | Read Committed (mặc định), Repeatable Read — một ảnh chụp cho cả giao dịch, Serializable, cách chọn trong thực tế; bài 11.2 giải thích MVCC: người đọc không chặn người ghi |
| `dbi202-transaction-acid` | `postgresql/postgresql-11-4-khoa-deadlock` | khoá chết (deadlock) | khoá dòng, lost update và hai cách sửa (không đọc rồi ghi lại; SELECT … FOR UPDATE), NOWAIT/lock_timeout, SKIP LOCKED, và deadlock |

Không cặp: Ch1–3 (mô hình quan hệ, đại số quan hệ, ER — Courses PostgreSQL không dạy đại số/ER chặt như DBI202), 4.2/4.3 (luật Armstrong, phân rã), các bài ôn thi/CS/chữa đề. Academy dùng SQL Server, Courses dùng PostgreSQL — mỗi thẻ ghi rõ điều đó.
