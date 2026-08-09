/** "100 Ngày Java với CuongThai" — Ngày 66: Chỉ mục (Index). KHÉP GIAI ĐOẠN 8.
    Nối đúng chỗ Ngày 65 kết ("JOIN 10 000 khách x 1 triệu đơn tốn 10 tỉ phép so
    sánh — sao vẫn chạy trong tích tắc?"). Ngày 67 mở Giai đoạn 9 (Spring Boot).

    ⚠ LUẬT 5+6: đếm phép so sánh, không đo mili-giây; thẻ mô phỏng B-tree bằng
    tìm nhị phân. EXPLAIN + CREATE INDEX trong bài ĐÃ CHẠY THẬT trên PostgreSQL
    15.4, bảng 1 triệu dòng — mọi plan (Seq Scan / Index Scan) là output nguyên
    văn của psql. */
export default {
  day: 66,
  card: 'java-day-66',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'implement-a-batch-transaction-processor-with-connection-pooling-and-rollback',
    title: 'Bộ xử lý giao dịch theo lô + pool kết nối (JDBC)',
  },

  content: `🚀 100 NGÀY JAVA — NGÀY 66: CHỈ MỤC (INDEX) — KHÉP GIAI ĐOẠN 8

Ngày 62 để lại một câu hỏi treo: khi \`JOIN\` 10.000 khách với 1 triệu đơn tốn tới **mười tỉ** phép so sánh, làm sao hệ thống thật vẫn trả kết quả trong tích tắc?

Hôm nay là câu trả lời. Và nó là một trong những thứ đáng tiền nhất bạn học được về CSDL: thêm **một dòng lệnh**, truy vấn nhanh lên hàng vạn lần.

━━━━━━━━━━━━━━━━━━━━

🔎 TRƯỚC HẾT: NHÌN CSDL ĐANG LÀM GÌ

Đừng đoán truy vấn nhanh hay chậm. \`EXPLAIN\` cho bạn thấy kế hoạch CSDL định dùng — đây là "profiler" của bài Ngày 59, phiên bản dành cho CSDL:

\`\`\`sql
EXPLAIN SELECT * FROM nguoi WHERE email = 'u777777@mail.com';
\`\`\`

Trên một bảng 1 triệu dòng **chưa có chỉ mục**, PostgreSQL thật trả về:

\`\`\`
Gather  (cost=1000.00..13224.67 rows=4353 ...)
  Workers Planned: 2
  ->  Parallel Seq Scan on nguoi  (cost=0.00..11789.38 ...)
        Filter: (email = 'u777777@mail.com')
\`\`\`

Hai chữ cần chú ý: **Seq Scan** — *sequential scan*, quét tuần tự. CSDL đọc **từng dòng một** trong cả triệu dòng để tìm cái khớp. Đó chính là vòng \`for\` của bài Ngày 59, chỉ là chạy bên trong CSDL.

\`\`\`
1) khong chi muc, tim trong 1000000 dong -> 777778 phep so sanh (Seq Scan)
\`\`\`

━━━━━━━━━━━━━━━━━━━━

🚀 CHỈ MỤC: MỤC LỤC CỦA CUỐN SÁCH

Tưởng tượng phải tìm một từ trong cuốn từ điển 1000 trang **không có vần**: bạn lật từng trang. Đó là Seq Scan. Chỉ mục chính là phần vần A-Z ở gáy sách — nhảy thẳng tới đúng chỗ.

Tạo nó bằng một dòng:

\`\`\`sql
CREATE INDEX idx_nguoi_email ON nguoi(email);
\`\`\`

Chạy lại \`EXPLAIN\` đúng câu truy vấn cũ:

\`\`\`
Index Scan using idx_nguoi_email on nguoi  (cost=0.42..8.44 rows=1 ...)
  Index Cond: (email = 'u777777@mail.com')
\`\`\`

**Index Scan.** Chi phí ước tính rơi từ ~13.000 xuống ~8. CSDL không quét cả bảng nữa; nó đi thẳng qua cây chỉ mục tới đúng dòng cần.

\`\`\`
2) co chi muc B-tree -> 20 phep so sanh (Index Scan)
3) nhanh hon 38888 lan; log2(1 trieu) ~ 20 buoc
\`\`\`

━━━━━━━━━━━━━━━━━━━━

🌲 VÌ SAO CHỈ 20 BƯỚC?

Chỉ mục mặc định là một cây **B-tree** — dữ liệu được giữ *đã sắp xếp*. Tìm trên tập đã sắp thì mỗi bước loại bỏ **một nửa** số ứng viên còn lại, đúng như tìm nhị phân.

Một triệu dòng cần bao nhiêu lần chia đôi để còn một? \`log₂(1.000.000) ≈ 20\`. Hai mươi bước, so với gần tám trăm nghìn.

Và con số này lớn lên rất chậm: một **tỉ** dòng cũng chỉ khoảng 30 bước. Đó là sức mạnh thật sự của \`O(log n)\` mà Ngày 59 đã nói — ở đây bạn thấy nó cứu một hệ thống thật.

Đây cũng là lời giải cho câu hỏi treo từ Ngày 62: \`JOIN\` không thật sự thử mọi cặp. Với chỉ mục trên cột khoá ngoại, mỗi dòng bên này *tra* thẳng sang bên kia trong ~20 bước, nên mười tỉ tụt xuống còn vài chục triệu.

━━━━━━━━━━━━━━━━━━━━

💰 NHƯNG CHỈ MỤC KHÔNG MIỄN PHÍ

Nếu chỉ mục chỉ có lợi, CSDL đã tự đánh cho mọi cột. Nó không, vì có cái giá:

\`\`\`
4) 1 lan INSERT khi co 3 chi muc -> 4 lan ghi (1 bang + 3 chi muc)
\`\`\`

Mỗi chỉ mục là một cây phải giữ luôn đúng thứ tự. Nên **mỗi lần \`INSERT\`/\`UPDATE\`/\`DELETE\`, CSDL phải cập nhật tất cả các chỉ mục** liên quan. Một bảng có 8 chỉ mục thì mỗi lần ghi là ghi 9 chỗ.

Hệ quả thực tế:
- **Đánh chỉ mục làm truy vấn nhanh nhưng ghi chậm.** Bảng ghi nhiều, đọc ít thì đừng đánh bừa.
- Chỉ mục **tốn đĩa** — nó là bản sao đã sắp của cột.
- Cột **ít giá trị khác nhau** (ví dụ \`gioi_tinh\` chỉ 2 giá trị) đánh chỉ mục gần như vô ích.

Nguyên tắc: đánh chỉ mục cho cột hay xuất hiện trong \`WHERE\`, \`JOIN\`, \`ORDER BY\` — và đo bằng \`EXPLAIN\`, đừng đoán.

━━━━━━━━━━━━━━━━━━━━

⚠️ CHỈ MỤC CÓ THỂ BỊ "VÔ HIỆU"

Cái bẫy khiến nhiều người tưởng đã đánh chỉ mục là xong: có những truy vấn **không dùng được** chỉ mục dù nó tồn tại.

\`\`\`sql
EXPLAIN SELECT * FROM nguoi WHERE email LIKE '%mail.com';
\`\`\`

Kết quả thật: quay lại **Seq Scan**. Vì chỉ mục sắp theo *đầu* chuỗi, mà \`LIKE '%...'\` lại tìm theo *đuôi* — cây B-tree bó tay.

\`\`\`
5) chi muc dung duoc cho '=': true; cho LIKE '%...': false (van Seq Scan)
\`\`\`

Những kiểu làm chỉ mục "ngủ quên" hay gặp:
- \`LIKE '%x'\` mở đầu bằng \`%\`
- Bọc hàm quanh cột: \`WHERE lower(email) = ...\` (chỉ mục nằm trên \`email\`, không trên \`lower(email)\`)
- Ép kiểu ngầm: so cột số với chuỗi

Khi nghi ngờ, luôn có một cách kiểm chắc chắn: chạy \`EXPLAIN\` và tìm xem nó ghi \`Index Scan\` hay \`Seq Scan\`.

━━━━━━━━━━━━━━━━━━━━

🔑 MỘT TIN VUI NHỎ

Bạn đã dùng chỉ mục suốt hai tuần qua mà không biết: **\`PRIMARY KEY\` tự động tạo một chỉ mục.** Đó là lý do \`WHERE ma = 'DH-1'\` luôn nhanh ngay từ Ngày 61 — khoá chính có sẵn cây B-tree của riêng nó.

\`\`\`
6) PRIMARY KEY tu tao chi muc -> tim theo khoa chinh luon nhanh
\`\`\`

Ràng buộc \`UNIQUE\` cũng vậy. Nên hai thứ đó vừa giữ đúng đắn (Ngày 61), vừa cho tốc độ miễn phí.

━━━━━━━━━━━━━━━━━━━━

🧭 KHÉP GIAI ĐOẠN 8

Sáu ngày, một tầng dữ liệu hoàn chỉnh:

- **61** — bảng, kiểu, ràng buộc, SQL căn bản
- **62** — tách bảng, khoá ngoại, JOIN, GROUP BY
- **63** — JDBC nối Java với CSDL, và chống SQL injection
- **64** — ResultSet → đối tượng, mẫu DAO, ba tầng
- **65** — giao dịch: nguyên tử, commit/rollback, ACID
- **66** — chỉ mục: nhanh vạn lần, và cái giá của nó

Bạn đã đi từ "dữ liệu chết khi tắt máy" tới một tầng lưu trữ đúng đắn, an toàn và nhanh. Đây là nền của mọi ứng dụng thật.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Tạo bảng 1 triệu dòng bằng \`generate_series\`, chạy \`EXPLAIN\` một truy vấn — thấy \`Seq Scan\`.
2. \`CREATE INDEX\`, chạy lại \`EXPLAIN\` — thấy nó đổi sang \`Index Scan\`.
3. Thử \`WHERE email LIKE '%x'\` và xác nhận chỉ mục bị bỏ qua.
4. Đếm số phép so sánh của tìm tuyến tính vs tìm nhị phân trên 1 triệu phần tử.
5. Nghĩ xem bảng nào trong dự án của bạn ghi nhiều hơn đọc — cân nhắc bớt chỉ mục.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Chỉ mục là một cây B-tree đã sắp, biến việc tìm từ \`O(n)\` (quét cả bảng) thành \`O(log n)\` (khoảng 20 bước cho 1 triệu dòng) — nhanh hàng vạn lần chỉ nhờ một dòng \`CREATE INDEX\`. Nhưng nó không miễn phí: mỗi lần ghi phải cập nhật mọi chỉ mục, và có những truy vấn làm chỉ mục ngủ quên. Công cụ để luôn biết sự thật là \`EXPLAIN\`.

Đến đây Giai đoạn 8 khép lại, và bạn có một sự thật hơi... mệt mỏi: suốt bốn ngày qua, để đọc một dòng đơn hàng ra đối tượng, bạn phải viết \`prepareStatement\`, \`setString(1, ...)\`, \`executeQuery\`, \`while (rs.next())\`, \`rs.getString\`, rồi đóng ba tài nguyên. Cả trăm dòng lặp đi lặp lại cho mỗi bảng.

Chẳng lẽ không ai làm hộ được chuyện máy móc đó?

Ngày 67 mở **Giai đoạn 9: Spring Boot** — framework thống trị thế giới Java doanh nghiệp. Nó tự lo kết nối CSDL, tự dựng máy chủ web, tự ghép mọi mảnh lại, để bạn quay về viết đúng thứ quan trọng: logic nghiệp vụ. Mười lăm ngày tới, mọi thứ bạn học suốt 66 ngày sẽ hợp lại thành một ứng dụng web thật. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
