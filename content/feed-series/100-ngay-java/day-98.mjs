/** "100 Ngày Java với CuongThai" — Ngày 98: Tối ưu hiệu năng cuối (Blog API).
    Nối đúng chỗ Ngày 97 kết ("bảo mật xong; nó có NHANH không? nhiều mảnh hiệu
    năng rải rác — đo (59), chỉ mục (66), N+1 (71), cache (89); một vòng tối ưu
    có phương pháp"). Ngày 99 (tổng kết Blog API) trỏ ngược về phần kết.

    ⚠ LUẬT 5+6: đếm SỐ TRUY VẤN / SỐ PHÉP SO SÁNH (cố định), không đo thời gian;
    thân bài dạy JFR/EXPLAIN thật. Output là kết quả THẬT của javac/java JDK 21. */
export default {
  day: 98,
  card: 'java-day-98',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'build-a-jit-compilation-log-analyzer',
    title: 'Phân tích log biên dịch JIT (đo hiệu năng JVM)',
  },

  content: `📈 100 NGÀY JAVA — NGÀY 98: TỐI ƯU HIỆU NĂNG CUỐI

Bảo mật xong (Ngày 97), còn một câu hỏi cuối về chất lượng: blog của bạn có **nhanh** không?

Suốt series ta học nhiều mảnh hiệu năng — đo đạc (59), chỉ mục (66), N+1 (71), cache (89). Cũng rải rác. Một lần trước khi giao hàng, nên chạy một **vòng tối ưu có phương pháp**: tìm chỗ chậm thật sự và sửa đúng chỗ đó. Hôm nay gom lại thành một quy trình.

━━━━━━━━━━━━━━━━━━━━

📏 BƯỚC 1: ĐO, ĐỪNG ĐOÁN

Nhắc lại bài học lớn nhất của Ngày 59: **trực giác về hiệu năng gần như luôn sai**. Đừng mở code ra đoán "chắc chỗ này chậm". Đo:

\`\`\`
1) DO: trang chu 4 truy van, trang bai 21 truy van -> diem nong = trang bai
\`\`\`

Bật log SQL, dùng profiler (JFR — Ngày 59), hoặc metrics độ trễ (Ngày 93) để tìm **điểm nóng thật**. Ở đây: trang bài chạy 21 truy vấn, gấp năm lần trang chủ — đó là chỗ đáng sửa, không phải cái vòng lặp trông nặng mà bạn nghi.

━━━━━━━━━━━━━━━━━━━━

🕳️ BƯỚC 2: SOÁT N+1 (THỦ PHẠM SỐ MỘT)

Với ứng dụng dùng JPA, nguyên nhân chậm phổ biến nhất là **N+1** (Ngày 71). 21 truy vấn cho một trang là dấu hiệu kinh điển:

\`\`\`
2) N+1: 21 = 1+20 -> JOIN FETCH -> con 1 truy van
\`\`\`

Một câu lấy 20 bài, rồi mỗi bài một câu lấy bình luận → 1+20. Chữa bằng \`JOIN FETCH\`/\`@EntityGraph\` để gom về một câu. Từ 21 xuống 1 — chỉ riêng chỗ này đã nhanh hơn nhiều lần.

━━━━━━━━━━━━━━━━━━━━

🚀 BƯỚC 3: CHỈ MỤC THIẾU

Tìm theo một cột không có chỉ mục là quét cả bảng (Ngày 66). Chạy \`EXPLAIN\` trên các truy vấn hay dùng, thấy \`Seq Scan\` thì thêm chỉ mục:

\`\`\`
3) chi muc: tim 1 trieu dong 1000000 -> them index -> 20 phep so sanh
\`\`\`

Một triệu phép so sánh xuống còn hai chục. Chú ý những cột hay nằm trong \`WHERE\`, \`JOIN\`, \`ORDER BY\` — đó là ứng viên chỉ mục.

━━━━━━━━━━━━━━━━━━━━

⚡ BƯỚC 4: CACHE THỨ ĐỌC-NHIỀU-ĐỔI-ÍT

Với thứ tính đi tính lại mà ít đổi (trang chủ, số lượt xem), thêm cache (Ngày 89):

\`\`\`
4) cache trang chu: 100 luot -> 1 lan tinh that (doc nhieu doi it)
\`\`\`

Nhưng nhớ: cache là bước **sau cùng**, không phải đầu tiên. Sửa N+1 và chỉ mục trước — đó là sửa *nguyên nhân*; cache chỉ *che* cái chậm. Cache một truy vấn N+1 là giấu rác dưới thảm.

━━━━━━━━━━━━━━━━━━━━

📏 BƯỚC 5: ĐO LẠI — BƯỚC HAY BỊ BỎ

Đây là bước quan trọng nhất và hay bị quên nhất (Ngày 59):

\`\`\`
5) DO LAI sau sua: trang bai 1 truy van (21 -> 1)
\`\`\`

Sau khi sửa, **đo lại** để xác nhận thật sự nhanh hơn — chứ không phải bạn vừa làm code xấu đi mà chẳng cải thiện gì. Không đo lại thì bạn chỉ đang *đoán* rằng mình đã tối ưu. Con số 21 → 1 mới là bằng chứng.

━━━━━━━━━━━━━━━━━━━━

🛑 BIẾT KHI NÀO DỪNG

Và một bài học ngược đời nhưng quan trọng: **đủ nhanh thì dừng lại**.

Tối ưu quá đà làm code khó đọc, khó bảo trì, dễ sinh bug — để đổi lấy vài mili-giây không ai cảm nhận được. Nếu trang tải trong 100ms và mục tiêu là dưới 300ms, thì **dừng** — đừng đánh đổi sự trong sáng của code lấy tốc độ không cần thiết.

Quy trình gọn lại: **đo → tìm điểm nóng → sửa nguyên nhân → đo lại → đủ nhanh thì dừng.** Áp đúng thứ tự này thì tối ưu là việc có phương pháp, không phải đoán mò.

Ngoài ra, vài mục hiệu năng khác đáng soi một lượt: nối chuỗi trong vòng lặp (Ngày 09/59 — dùng \`StringBuilder\`), tải dữ liệu thừa (chỉ \`SELECT\` cột cần), rò rỉ kết nối (Ngày 63), và pool luồng/kết nối đủ lớn.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Bật \`show-sql\`, đếm số truy vấn của trang danh sách — tìm N+1.
2. Sửa N+1 bằng \`JOIN FETCH\`, đếm lại, xác nhận giảm.
3. Chạy \`EXPLAIN\` một truy vấn tìm kiếm, thêm chỉ mục nếu thấy Seq Scan.
4. Thêm cache cho trang chủ, đo số lần chạy truy vấn trước/sau.
5. Với một trang đã "đủ nhanh", thử KHÔNG tối ưu thêm — luyện biết dừng.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Tối ưu hiệu năng là một quy trình có phương pháp, không phải đoán: **đo** để tìm điểm nóng thật (đừng đoán — Ngày 59), soát **N+1** (71) và **chỉ mục thiếu** (66) — sửa *nguyên nhân* trước, **cache** (89) thứ đọc-nhiều-đổi-ít sau, rồi **đo lại** để chứng minh, và **dừng** khi đã đủ nhanh. Gom mọi bài hiệu năng rải rác thành đúng năm bước này.

Và thế là xong. Blog API của bạn — từ trang giấy trắng ở Ngày 82 — giờ đã đầy đủ: bài viết, ảnh, bình luận, thẻ, tìm kiếm, cache, việc nền, realtime, tài liệu, giám sát, đóng gói, CI/CD, kiểm thử tích hợp, bảo mật, và hiệu năng. Một backend thật sự đi làm được.

Ngày 99: **Tổng kết dự án Blog API** — lùi lại nhìn toàn cảnh kiến trúc bạn vừa dựng, những quyết định thiết kế và vì sao, các đánh đổi đã chọn, và bản đồ đầy đủ của một ứng dụng Java hiện đại — để bạn cầm nó đi phỏng vấn hay khởi động dự án tiếp theo. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
