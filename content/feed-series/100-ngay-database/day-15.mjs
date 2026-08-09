/** "100 Ngày Database với CuongThai" — Ngày 15: Correlated subquery & EXISTS.
    Subquery tham chiếu dòng câu ngoài (correlated); EXISTS/NOT EXISTS (NOT
    EXISTS an toàn NULL, vá bẫy NOT IN của Ngày 14); so mỗi dòng với nhóm riêng.

    ⚠ proof.lines trong thẻ là OUTPUT THẬT của psql (PostgreSQL 15.4, DB
    hoc_db_day15). Chuẩn SQL — SQL Server y hệt. */
export default {
  day: 15,
  card: 'db-day-15',
  category: 'Database',
  hashtags: ['100NgayDatabase', 'Database', 'PostgreSQL', 'SQL'],
  codeLab: {
    track: 'postgresql',
    slug: 'correlated-subquery-with-exists',
    title: 'Correlated subquery với EXISTS',
  },

  content: `🗄️ 100 NGÀY DATABASE — NGÀY 15: CORRELATED SUBQUERY & EXISTS

Các subquery hôm qua đều **độc lập**: chúng chạy một lần, cho một kết quả, xong. Hôm nay ta gặp loại mạnh hơn — subquery **tương quan** (correlated): nó *nhìn vào từng dòng của câu ngoài* để quyết định, như thể chạy đi chạy lại một lần cho mỗi dòng. Kèm theo là \`EXISTS\`/\`NOT EXISTS\` — cách hỏi "có tồn tại hay không" vừa nhanh vừa **an toàn với NULL** (vá đúng cái bẫy \`NOT IN\` của Ngày 14). Mọi kết quả là thật từ psql.

━━━━━━━━━━━━━━━━━━━━

🔗 EXISTS — HỎI "CÓ TỒN TẠI KHÔNG"

\`EXISTS\` nhận một subquery và trả \`TRUE\` ngay khi subquery đó có **ít nhất một dòng**. "Khách nào có đơn hàng?":

\`\`\`sql
SELECT ten FROM khach_hang k
WHERE EXISTS (SELECT 1 FROM don_hang d WHERE d.khach_id = k.id)
ORDER BY ten;
\`\`\`

\`\`\`
 ten
------
 An
 Binh
(2 rows)
\`\`\`

Điểm mấu chốt nằm ở \`WHERE d.khach_id = k.id\`: subquery tham chiếu \`k.id\` — cột của câu **ngoài**. Đây là **sự tương quan**. Hình dung máy duyệt từng khách \`k\`, và với mỗi người, chạy subquery hỏi "có đơn nào của *người này* không?". An và Binh có → giữ; Chi không → loại.

Vì \`EXISTS\` chỉ quan tâm "có hay không", nội dung \`SELECT\` bên trong không quan trọng — người ta quen viết \`SELECT 1\` (khỏi bận tâm cột nào).

━━━━━━━━━━━━━━━━━━━━

🛡️ NOT EXISTS — GIẢI PHÁP CHO BẪY NOT IN

Đảo lại bằng \`NOT EXISTS\` để tìm "khách **chưa** có đơn":

\`\`\`sql
SELECT ten FROM khach_hang k
WHERE NOT EXISTS (SELECT 1 FROM don_hang d WHERE d.khach_id = k.id)
ORDER BY ten;
-- -> Chi
\`\`\`

Đây là lý do lớn để yêu \`EXISTS\`: nhớ Ngày 14, \`NOT IN\` với một danh sách chứa NULL sẽ trả về **rỗng** một cách âm thầm. \`NOT EXISTS\` **không dính bẫy đó** — nó chỉ hỏi "có dòng khớp không", NULL hay không NULL đều xử lý đúng. **Quy tắc: khi cần "cái chưa có cặp" và cột có thể NULL, dùng \`NOT EXISTS\`, đừng dùng \`NOT IN\`.** \`EXISTS\` cũng thường nhanh: máy dừng ngay khi tìm thấy dòng đầu tiên, không cần quét hết.

━━━━━━━━━━━━━━━━━━━━

🪞 SỨC MẠNH THẬT: SO MỖI DÒNG VỚI "NHÓM CỦA CHÍNH NÓ"

Correlated subquery giải được những câu mà JOIN phẳng rất chật vật. Ví dụ kinh điển: "đơn nào **lớn hơn trung bình của chính khách đặt nó**?" (không phải trung bình toàn bảng — mà trung bình *riêng từng khách*):

\`\`\`sql
SELECT d.id, d.khach_id, d.tong_tien
FROM don_hang d
WHERE d.tong_tien > (
  SELECT avg(d2.tong_tien) FROM don_hang d2 WHERE d2.khach_id = d.khach_id
)
ORDER BY d.khach_id, d.id;
\`\`\`

\`\`\`
 id | khach_id | tong_tien
----+----------+-----------
  2 |        1 |    800000
  3 |        2 |    900000
(2 rows)
\`\`\`

Với mỗi đơn \`d\`, subquery tính trung bình các đơn của **cùng khách** (\`d2.khach_id = d.khach_id\`), rồi so. An có hai đơn (200k, 800k) → trung bình 500k → chỉ đơn 800k vượt. Binh có ba đơn → trung bình 500k → chỉ đơn 900k vượt. Mỗi dòng được so với một mốc *khác nhau*, tính riêng cho nhóm của nó. Đó là điều correlated subquery làm rất tự nhiên.

━━━━━━━━━━━━━━━━━━━━

🔄 POSTGRESQL vs SQL SERVER

**Giống hệt** ở cả hai hệ: \`EXISTS\`/\`NOT EXISTS\`, subquery tương quan, và mẹo \`SELECT 1\`. Quan trọng: **\`NOT EXISTS\` an toàn với NULL ở cả hai** — lời khuyên "ưu tiên NOT EXISTS hơn NOT IN" đúng cho PostgreSQL lẫn SQL Server. Cả hai bộ tối ưu cũng thường chạy \`EXISTS\` hiệu quả (biến thành semi-join).

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Viết lại truy vấn "khách có đơn ≥ 500k" của Ngày 14 bằng \`EXISTS\` thay cho \`IN\`.
2. Tìm sản phẩm **chưa từng** xuất hiện trong đơn nào (bảng \`chi_tiet_don\`) bằng \`NOT EXISTS\`.
3. Tìm đơn có giá trị **bằng đúng đơn lớn nhất của khách đó** (correlated + \`max\`).
4. Vì sao \`NOT EXISTS\` an toàn với NULL còn \`NOT IN\` thì không?

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Correlated subquery tham chiếu tới từng dòng câu ngoài, cho phép so mỗi dòng với "nhóm riêng của nó" — thứ JOIN phẳng khó diễn đạt. \`EXISTS\`/\`NOT EXISTS\` hỏi "có tồn tại hay không" một cách nhanh và, quan trọng nhất, **\`NOT EXISTS\` an toàn với NULL** — hãy chọn nó thay \`NOT IN\`. Bạn giờ có đủ bộ subquery để tấn công gần như mọi câu hỏi.

Nhưng khi truy vấn phức tạp lên — nhiều subquery lồng nhau, cùng một subquery lặp lại vài lần — câu SQL bắt đầu rối như tơ vò. Có một cách làm nó *dễ đọc như từng bước*: đặt tên cho các subquery. Đó là CTE, chủ đề ngày mai.

Ngày 16: **CTE (\`WITH\`)** — đặt tên cho một truy vấn con và tái dùng nó, biến câu SQL lồng nhau chằng chịt thành các bước rõ ràng, đọc từ trên xuống. Hẹn gặp lại!

#100NgayDatabase #Database #PostgreSQL`,
};
