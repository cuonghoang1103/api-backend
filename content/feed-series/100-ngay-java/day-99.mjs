/** "100 Ngày Java với CuongThai" — Ngày 99: Tổng kết dự án Blog API.
    Nối đúng chỗ Ngày 98 kết ("Blog API giờ đầy đủ; lùi lại nhìn toàn cảnh kiến
    trúc, quyết định thiết kế, đánh đổi — để cầm đi phỏng vấn/dự án tiếp").
    Ngày 100 (khép khoá 100 ngày) trỏ ngược về phần kết.

    ⚠ LUẬT 6: "kiến trúc sạch" (phụ thuộc một chiều) dựng bằng JDK thuần, tất
    định; thân bài vẽ bức tranh kiến trúc đầy đủ. Output là kết quả THẬT của
    javac/java JDK 21. */
export default {
  day: 99,
  card: 'java-day-99',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'build-a-dependency-injection-container',
    title: 'Tự viết container DI (nhìn lại lõi kiến trúc Spring)',
  },

  content: `🏛️ 100 NGÀY JAVA — NGÀY 99: TỔNG KẾT DỰ ÁN BLOG API

Và thế là xong. Blog API của bạn — từ trang giấy trắng ở Ngày 82 — giờ đã đầy đủ. Hôm nay lùi lại nhìn toàn cảnh: kiến trúc bạn vừa dựng, những quyết định thiết kế và vì sao, các đánh đổi đã chọn. Đây là thứ bạn cầm đi phỏng vấn hay khởi động dự án tiếp theo.

━━━━━━━━━━━━━━━━━━━━

🏛️ BỐN TẦNG — XƯƠNG SỐNG CỦA MỌI BACKEND

Nhìn từ trên xuống, cả ứng dụng gọn trong bốn tầng, mỗi tầng một trách nhiệm:

\`\`\`
Controller  ── nhận HTTP, trả JSON, kiểm dữ liệu vào    (68, 69)
    │
Service     ── logic nghiệp vụ, giao dịch                (72)
    │
Repository  ── truy cập CSDL (JPA)                       (70, 71)
    │
Entity      ── mô hình dữ liệu                           (70)
\`\`\`

\`\`\`
1) Blog API — 4 tang: Controller > Service > Repository > Entity
\`\`\`

Đây không phải phát minh của bạn — nó là khuôn hình gần như mọi ứng dụng Java doanh nghiệp dùng. Học thuộc bốn tầng này, bạn đọc được kiến trúc của bất kỳ dự án Spring nào.

━━━━━━━━━━━━━━━━━━━━

⬇️ NGUYÊN TẮC VÀNG: PHỤ THUỘC MỘT CHIỀU

Có một luật giữ bốn tầng đó gọn gàng: **phụ thuộc chỉ được đi xuống**. Controller biết Service, Service biết Repository — nhưng không bao giờ ngược lại:

\`\`\`
2) phu thuoc hop le (di xuong): 3/4
3) phu thuoc CAM (di len): [Repository->Controller] -> VI PHAM
4) kiem 4 phu thuoc -> 3 sach, 1 vi pham
\`\`\`

Vì sao quan trọng? Nếu Repository lại phụ thuộc Controller, bạn có một **vòng phụ thuộc** — rối như mì, không test được tầng nào riêng lẻ, đổi một chỗ vỡ cả chuỗi. Giữ phụ thuộc một chiều là giữ mỗi tầng **tách rời và thay được**:

\`\`\`
5) kien truc sach: phu thuoc 1 chieu -> de test, de doi tung tang
\`\`\`

Đây chính là lý do sâu xa của bao nhiêu bài học trước: interface (18) để tầng trên phụ thuộc *hợp đồng* chứ không phụ thuộc *cài đặt*; DI (67) để container nối dây theo một chiều; DAO (64) để đổi ruột lưu trữ không đụng nghiệp vụ. Tất cả phục vụ một điều: **giữ phụ thuộc sạch**.

━━━━━━━━━━━━━━━━━━━━

🧩 BẢN ĐỒ ĐẦY ĐỦ NHỮNG GÌ ĐÃ GHÉP

Trên bộ khung bốn tầng, bạn đã lắp vào từng mảnh — mỗi mảnh là một ngày:

- **Bảo mật** (77-81): băm mật khẩu, JWT, filter, phân quyền — lớp gác trước mọi request.
- **Dữ liệu** (82-86): slug, CRUD bài, phân trang, tìm kiếm, bình luận & thẻ.
- **Tài nguyên & tương tác** (87-91): upload ảnh, rate limit, cache, việc nền, realtime.
- **Chất lượng & vận hành** (92-98): tài liệu API, giám sát, Docker, CI/CD, kiểm thử tích hợp, rà soát bảo mật, tối ưu hiệu năng.

\`\`\`
4) TAT CA MANH: auth · CRUD · phan trang · tim kiem · cache · viec nen
   · realtime · docs · monitor · CI/CD
\`\`\`

Nhìn danh sách này, bạn thấy một sự thật: một backend "thật" không phải là code nghiệp vụ, mà là **nghiệp vụ + hàng chục mối quan tâm quanh nó** — bảo mật, hiệu năng, vận hành, kiểm thử. Phần lớn công sức của một kỹ sư nằm ở "quanh nó".

━━━━━━━━━━━━━━━━━━━━

⚖️ NHỮNG ĐÁNH ĐỔI ĐÃ CHỌN

Mỗi quyết định là một đánh đổi có ý thức — biết *vì sao* mới là hiểu:

- **JWT (stateless) thay session** — dễ mở rộng nhiều máy, đổi lại khó thu hồi token (đặt hạn ngắn).
- **Cache** — nhanh hơn, đổi lại rủi ro dữ liệu cũ (phải xoá đúng lúc).
- **@Async việc nền** — request nhanh, đổi lại việc nền có thể mất khi sập (dùng hàng đợi bền cho việc quan trọng).
- **OFFSET vs cursor** — số trang tiện, cursor nhanh ở trang sâu.

Không có lựa chọn nào "đúng tuyệt đối" — chỉ có lựa chọn *hợp cảnh*. Kỹ sư giỏi là người nêu được đánh đổi, không phải người thuộc lòng một câu trả lời.

━━━━━━━━━━━━━━━━━━━━

🎤 CẦM NÓ ĐI PHỎNG VẤN

Một dự án như thế này là câu trả lời cho câu hỏi phỏng vấn kinh điển "kể về một dự án của bạn". Bạn nói được: kiến trúc bốn tầng, vì sao phụ thuộc một chiều, đã chống SQL injection và IDOR thế nào, đã xử lý N+1 ra sao, vì sao chọn JWT, cache invalidate thế nào. Đó là chiều sâu mà một dự án "to-do list" không cho bạn.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Vẽ sơ đồ bốn tầng của một dự án bạn từng làm, đánh mũi tên phụ thuộc.
2. Tìm xem có phụ thuộc nào "đi lên" (vi phạm) không, và cách gỡ.
3. Với mỗi mảnh (auth, cache, async...), viết một câu "vì sao cần" và "đánh đổi gì".
4. Chuẩn bị một bài kể 3 phút về Blog API để dùng khi phỏng vấn.
5. Chọn một tính năng bạn muốn thêm, phác xem nó nằm ở tầng nào.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Một backend hoàn chỉnh đứng trên **bốn tầng** (Controller → Service → Repository → Entity) với **phụ thuộc một chiều đi xuống** — nền tảng khiến nó dễ test, dễ đổi, dễ bảo trì. Trên khung đó lắp vào hàng chục mối quan tâm (bảo mật, dữ liệu, tương tác, vận hành, chất lượng), mỗi cái một đánh đổi có ý thức. Hiểu bức tranh này, bạn không chỉ *viết* được ứng dụng Java — bạn *đọc* và *giải thích* được bất kỳ dự án nào.

Chín mươi chín ngày. Từ dòng \`System.out.println("Hello, Java!")\` đầu tiên, bạn đã đi qua cú pháp, OOP, collections, đa luồng, JVM, kiểm thử, cơ sở dữ liệu, Spring Boot, bảo mật, và một dự án hoàn chỉnh. Người viết dòng Hello World ngày 1 và người đọc được kiến trúc này hôm nay — là hai người khác nhau.

Ngày 100: **KHÉP KHOÁ** — không có khái niệm mới. Chỉ là nhìn lại trọn vẹn hành trình 100 ngày, điều quan trọng nhất đã học (không phải cú pháp), và tấm bản đồ cho chặng đường tiếp theo của bạn với Java. Hẹn gặp lại ở ngày cuối cùng!

#100NgayJava #Java #HocLapTrinh`,
};
