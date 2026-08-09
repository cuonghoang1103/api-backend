/** "100 Ngày Database với CuongThai" — Ngày 14: Subquery (truy vấn lồng).
    Scalar subquery (so với trung bình), IN/NOT IN (danh sách động, bẫy NULL của
    NOT IN), subquery trong FROM (bảng dẫn xuất).

    ⚠ proof.lines trong thẻ là OUTPUT THẬT của psql (PostgreSQL 15.4, DB
    hoc_db_day14). Chuẩn SQL — SQL Server y hệt (cùng bẫy NOT IN + NULL). */
export default {
  day: 14,
  card: 'db-day-14',
  category: 'Database',
  hashtags: ['100NgayDatabase', 'Database', 'PostgreSQL', 'SQL'],
  codeLab: {
    track: 'postgresql',
    slug: 'compare-against-a-subquery-in-where',
    title: 'So sánh với một subquery trong WHERE',
  },

  content: `🗄️ 100 NGÀY DATABASE — NGÀY 14: SUBQUERY — TRUY VẤN LỒNG

Ngày 13 ta tính được trung bình, tổng, đếm. Nhưng làm sao hỏi "đơn nào **trên mức trung bình**?" — câu này cần *hai bước*: trước tiên tính trung bình, rồi so từng đơn với nó. \`subquery\` (truy vấn con) cho phép gói cả hai bước vào **một câu**: một truy vấn nằm *bên trong* truy vấn khác, kết quả của câu trong thành đầu vào cho câu ngoài. Đây là công cụ mở ra cả một tầng câu hỏi mới. Mọi kết quả là thật từ psql.

━━━━━━━━━━━━━━━━━━━━

🎯 SCALAR SUBQUERY — TRẢ VỀ MỘT GIÁ TRỊ

Loại đơn giản nhất: subquery trả về **đúng một giá trị** (một hàng, một cột), rồi bạn so sánh trực tiếp với nó:

\`\`\`sql
SELECT id, tong_tien FROM don_hang
WHERE tong_tien > (SELECT avg(tong_tien) FROM don_hang)
ORDER BY tong_tien DESC;
\`\`\`

\`\`\`
 id | tong_tien
----+-----------
  3 |    900000
  1 |    500000
(2 rows)
\`\`\`

Đọc từ trong ra ngoài: câu \`(SELECT avg(tong_tien) FROM don_hang)\` chạy trước, cho ra \`487500\`; rồi câu ngoài trở thành \`WHERE tong_tien > 487500\`. Điều bạn *không thể* làm nếu không có subquery: viết thẳng \`WHERE tong_tien > avg(tong_tien)\` sẽ lỗi (không được trộn hàm gộp vào WHERE — nhớ Ngày 13). Subquery giải đúng nút thắt đó.

━━━━━━━━━━━━━━━━━━━━

📋 IN — KIỂM TRA THUỘC MỘT DANH SÁCH ĐỘNG

Ngày 8 bạn dùng \`IN ('a','b','c')\` với danh sách *cố định*. Sức mạnh mới: danh sách đó có thể là **kết quả một truy vấn**:

\`\`\`sql
SELECT ten FROM khach_hang
WHERE id IN (SELECT khach_id FROM don_hang WHERE tong_tien >= 500000)
ORDER BY ten;
\`\`\`

\`\`\`
 ten
------
 An
 Binh
(2 rows)
\`\`\`

Subquery trả về một *cột* các \`khach_id\` (những người có đơn ≥ 500k), và \`IN\` kiểm mỗi khách có nằm trong danh sách đó không. Kết quả: An và Binh. Đây là cách trả lời "khách nào từng làm X" mà không cần \`JOIN\`.

━━━━━━━━━━━━━━━━━━━━

⚠️ NOT IN — HỮU ÍCH, NHƯNG CÓ BẪY NULL

Đảo lại bằng \`NOT IN\` để tìm "khách **chưa** có đơn nào":

\`\`\`sql
SELECT ten FROM khach_hang
WHERE id NOT IN (SELECT khach_id FROM don_hang)
ORDER BY ten;
-- -> Dung
\`\`\`

Chạy đúng vì \`khach_id\` ở đây không bao giờ NULL. Nhưng đây là **một trong những bẫy nguy hiểm nhất của SQL**: nếu subquery trả về *dù chỉ một* giá trị NULL, thì \`NOT IN\` trả về **rỗng** — không dòng nào cả! Lý do là logic ba giá trị của Ngày 6: \`x NOT IN (1, NULL)\` tương đương \`x <> 1 AND x <> NULL\`, mà \`x <> NULL\` luôn là UNKNOWN → cả biểu thức không bao giờ TRUE. Vì vậy: **khi cột trong subquery có thể NULL, đừng dùng \`NOT IN\` — dùng \`NOT EXISTS\`** (bài ngày mai), an toàn tuyệt đối.

━━━━━━━━━━━━━━━━━━━━

🪆 SUBQUERY TRONG FROM — "BẢNG TẠM"

Subquery còn đứng được ở vị trí \`FROM\`, đóng vai một **bảng dẫn xuất** (derived table) — kết quả một truy vấn trở thành bảng đầu vào cho truy vấn ngoài:

\`\`\`sql
SELECT round(avg(tong)) AS tb_moi_khach
FROM (
  SELECT khach_id, sum(tong_tien) AS tong
  FROM don_hang GROUP BY khach_id
) AS per_khach;
\`\`\`

\`\`\`
 tb_moi_khach
--------------
       650000
(1 row)
\`\`\`

Câu trong tính **tổng chi của mỗi khách** (An 800k, Binh 900k, Chi 250k), tạo thành một bảng tạm \`per_khach\`; câu ngoài lấy **trung bình các tổng đó** → 650.000. Đây là cách làm "gộp trên kết quả đã gộp" — hai tầng \`GROUP BY\`/\`avg\` không thể viết trong một câu phẳng. Lưu ý bảng dẫn xuất **bắt buộc có bí danh** (\`AS per_khach\`).

━━━━━━━━━━━━━━━━━━━━

🔄 POSTGRESQL vs SQL SERVER

**Giống hệt** ở cả hai hệ: scalar subquery, \`IN\`/\`NOT IN\` với subquery, và bảng dẫn xuất trong \`FROM\` (đều bắt buộc bí danh). Và **bẫy NULL của \`NOT IN\` cũng y như nhau** — đây là chuẩn SQL, không phải đặc thù PostgreSQL. Lời khuyên "ưu tiên \`NOT EXISTS\`" đúng cho cả hai.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Tìm các đơn có giá trị **bằng đúng đơn lớn nhất** (dùng \`= (SELECT max(tong_tien) ...)\`).
2. Liệt kê khách **chưa từng** có đơn ≥ 500k (kết hợp NOT IN với điều kiện — cẩn thận NULL).
3. Dùng bảng dẫn xuất để tìm **khách có tổng chi cao nhất**.
4. Vì sao \`WHERE tong_tien > avg(tong_tien)\` báo lỗi, còn bản subquery thì chạy?

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Subquery cho phép một truy vấn *dùng kết quả* của truy vấn khác: scalar (một giá trị để so sánh), \`IN\`/\`NOT IN\` (danh sách động), và bảng dẫn xuất trong \`FROM\` (gộp trên kết quả đã gộp). Nhớ đời cái bẫy \`NOT IN\` + NULL — và giải pháp \`NOT EXISTS\`.

Các subquery hôm nay đều **độc lập** — chúng chạy một lần, không quan tâm câu ngoài đang xét dòng nào. Nhưng có một loại subquery mạnh hơn: nó **nhìn vào từng dòng của câu ngoài** để quyết định, mở ra những câu hỏi như "khách nào có đơn lớn hơn *đơn trung bình của chính họ*". Đó là correlated subquery và \`EXISTS\`, chủ đề ngày mai.

Ngày 15: **Correlated subquery & EXISTS** — subquery tham chiếu tới dòng của câu ngoài, và \`EXISTS\`/\`NOT EXISTS\` — cách kiểm "có tồn tại hay không" nhanh và an toàn với NULL. Hẹn gặp lại!

#100NgayDatabase #Database #PostgreSQL`,
};
