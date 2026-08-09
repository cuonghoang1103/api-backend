/** "100 Ngày Java với CuongThai" — Ngày 82: Mở dự án cuối (Blog API).
    Nối đúng chỗ Ngày 81 kết ("hết chặng học kỹ thuật; 19 ngày cuối ta XÂY một
    ứng dụng thật từ số 0").
    Ngày 83 (bài viết CRUD đầy đủ) trỏ ngược về phần kết.

    ⚠ LUẬT 6: viên gạch đầu (sinh slug) chạy JDK thuần, tất định; thân bài phác
    kiến trúc + khung dự án Spring thật. Output là kết quả THẬT của javac/java
    JDK 21. */
export default {
  day: 82,
  card: 'java-day-82',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'build-an-inverted-index-for-document-search',
    title: 'Chỉ mục ngược cho tìm kiếm (nền cho tìm bài viết)',
  },

  content: `🧱 100 NGÀY JAVA — NGÀY 82: MỞ DỰ ÁN CUỐI

Tám mươi mốt ngày qua, bạn học từng mảnh: cú pháp, OOP, collections, đa luồng, JVM, test, CSDL, Spring Boot, bảo mật. Chín mươi phần trăm kiến thức đi làm nằm phía sau.

Nhưng biết từng mảnh và **dựng được một sản phẩm hoàn chỉnh từ số 0** là hai chuyện khác nhau. Mười chín ngày cuối, ta không học khái niệm mới nữa — ta **xây**.

━━━━━━━━━━━━━━━━━━━━

📋 CHỌN ĐỀ: BLOG API "NHẬT KÝ LẬP TRÌNH"

Ta sẽ dựng backend cho một trang blog: nơi tác giả đăng bài, người đọc bình luận, bài có thẻ (tag), có tìm kiếm, có lượt xem. Vì sao chọn đề này? Vì nó **chạm vào mọi thứ đã học**:

- Người dùng + đăng nhập → bảo mật (Giai đoạn 10)
- Bài viết, bình luận, thẻ → JPA + quan hệ (70, 71)
- Đăng/sửa/xoá bài → CRUD + giao dịch (76, 72)
- Tìm kiếm, phân trang, sắp xếp → truy vấn (62, 66)
- Ảnh bìa, chống spam, thống kê → những mảnh mới, thực tế

Một đề đủ rộng để 19 ngày mỗi ngày làm một tính năng thật, mà không quá lớn để lạc.

━━━━━━━━━━━━━━━━━━━━

📐 PHÁC KIẾN TRÚC TRƯỚC KHI GÕ

Một kỹ sư thật không mở IDE gõ ngay. Họ phác trước: có những **thực thể** gì, quan hệ ra sao?

\`\`\`
NguoiDung 1 ─── * BaiViet * ─── * The (tag)
                    │
                    * BinhLuan
\`\`\`

- Một **NguoiDung** viết nhiều **BaiViet** (một-nhiều, Ngày 71).
- Một **BaiViet** có nhiều **BinhLuan**.
- **BaiViet** và **The** là nhiều-nhiều (một bài nhiều thẻ, một thẻ nhiều bài).

Phác xong mô hình dữ liệu là đã đi được nửa đường — phần lớn lỗi thiết kế nằm ở chỗ mối quan hệ sai, không phải ở code.

━━━━━━━━━━━━━━━━━━━━

🏛️ DỰNG KHUNG THEO TẦNG

Cấu trúc thư mục phản ánh đúng ba tầng của Ngày 64, gom theo tính năng:

\`\`\`
blog-api/
├── src/main/java/com/cuongthai/blog/
│   ├── baiviet/
│   │   ├── BaiVietController.java   REST (Ngày 68)
│   │   ├── BaiVietService.java      nghiệp vụ + @Transactional (72)
│   │   ├── BaiViet.java             @Entity (70)
│   │   └── BaiVietRepository.java   JpaRepository (70)
│   ├── nguoidung/  ...
│   ├── config/     SecurityFilterChain (79)
│   └── BlogApplication.java         @SpringBootApplication (67)
├── src/main/resources/application.yml   cấu hình (74)
└── pom.xml         starter: web, data-jpa, security (56, 67)
\`\`\`

Gom theo **tính năng** (baiviet/, nguoidung/) thay vì theo **loại** (tất cả controller một chỗ) — cách này giúp mỗi tính năng tự chứa, dễ tìm, dễ tách sau này. Một quyết định nhỏ nhưng đáng giá khi dự án lớn dần.

━━━━━━━━━━━━━━━━━━━━

🧱 VIÊN GẠCH ĐẦU: SINH SLUG

Trước khi làm CRUD bài viết (mai), ta cần một viên gạch nhỏ mà mọi blog đều dùng: biến **tiêu đề** thành **đường dẫn** (slug). \`/bai-viet/bai-viet-dau-tien\` đẹp và dễ nhớ hơn \`/bai-viet/42\`.

\`\`\`
1) 'Bai Viet Dau Tien!' -> 'bai-viet-dau-tien'
2) bo dau: 'Lap Trinh Java' -> 'lap-trinh-java'
3) d/D -> d: 'Duong Dan' -> 'duong-dan'
\`\`\`

Thuật toán: chuyển thường → bỏ dấu tiếng Việt → thay ký tự lạ bằng gạch nối. Chỗ khó là **bỏ dấu**: dùng \`java.text.Normalizer\` tách dấu ra khỏi chữ (dạng NFD) rồi xoá:

\`\`\`java
String s = tieuDe.toLowerCase()
    .replace('đ', 'd');                              // Normalizer không tách 'đ'
s = Normalizer.normalize(s, Normalizer.Form.NFD)     // "ậ" -> "a" + dấu
    .replaceAll("\\p{M}+", "")                        // xoá các dấu kết hợp
    .replaceAll("[^a-z0-9]+", "-")                    // ký tự lạ -> gạch
    .replaceAll("^-+|-+$", "");                       // bỏ gạch hai đầu
\`\`\`

Và làm sạch các trường hợp biên:

\`\`\`
4) ky tu la + khoang trang -> gop: 'A  B---C!!' -> 'a-b-c'
6) tieu de toan ky tu la '!!!@@@' -> 'bai-viet' (fallback)
\`\`\`

Nhiều ký tự lạ liền nhau gộp thành một gạch; tiêu đề toàn ký tự lạ (ra chuỗi rỗng) thì lấy giá trị mặc định thay vì trả slug rỗng.

━━━━━━━━━━━━━━━━━━━━

🔑 SLUG PHẢI DUY NHẤT

Hai bài cùng tên "Bài Viết" thì không thể cùng đường dẫn. Trùng thì thêm hậu tố:

\`\`\`
5) trung slug 'bai-viet' -> 'bai-viet-2'
\`\`\`

Kiểm slug đã tồn tại chưa (hỏi repository), trùng thì thử \`-2\`, \`-3\`... Và như Ngày 61, đừng chỉ dựa vào code: đặt luôn ràng buộc \`UNIQUE\` trên cột \`slug\` ở CSDL, để dù hai request chạy song song (Ngày 41) cũng không tạo ra hai slug trùng.

━━━━━━━━━━━━━━━━━━━━

🧭 QUY TRÌNH KHỞI ĐỘNG MỘT DỰ ÁN

Nhìn lại những gì vừa làm — đây là đúng quy trình một kỹ sư dùng khi nhận dự án mới:

1. **Hiểu đề** — sản phẩm làm gì, cho ai.
2. **Phác mô hình dữ liệu** — thực thể và quan hệ, trước khi gõ dòng nào.
3. **Dựng khung** — cấu trúc thư mục theo tầng, \`pom.xml\` với starter cần thiết.
4. **Một tính năng chạy được** — không cố làm hết; làm một viên gạch nhỏ (slug) cho chắc rồi mở rộng.

Đừng bắt đầu bằng cách viết cả 20 file rỗng. Bắt đầu bằng một thứ **chạy được**, rồi lớn dần.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Tạo dự án Spring Boot mới (start.spring.io) với starter web, data-jpa, security.
2. Phác mô hình dữ liệu blog trên giấy: thực thể + quan hệ.
3. Dựng cấu trúc thư mục gom theo tính năng (\`baiviet/\`, \`nguoidung/\`).
4. Viết hàm \`taoSlug\` bằng \`Normalizer\`, test với tiêu đề tiếng Việt có dấu.
5. Thêm logic bảo đảm slug duy nhất, và ràng buộc \`UNIQUE\` ở entity.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Mở một dự án không phải là gõ code ngay, mà là: hiểu đề → phác mô hình dữ liệu (thực thể + quan hệ) → dựng khung theo tầng → làm một viên gạch chạy được. Hôm nay viên gạch đó là **sinh slug** — biến tiêu đề tiếng Việt thành đường dẫn sạch, duy nhất, bằng \`Normalizer\` của JDK. Nhỏ, nhưng chạy được, và là nền cho mọi bài viết sắp tới.

Khung đã dựng, slug đã có. Giờ tới phần thịt: **bài viết**. Đăng một bài mới (tự sinh slug), sửa nó, xoá nó, đọc lại — nhưng lần này không phải bài tập rời rạc, mà là tính năng thật trong một dự án thật, có tác giả, có thời điểm, có trạng thái nháp/đã đăng.

Ngày 83: **CRUD bài viết đầy đủ** — thực thể \`BaiViet\` hoàn chỉnh, service tự sinh slug khi đăng, phân biệt bài nháp và bài công khai, và bộ endpoint đầu tiên của Blog API chạy được bằng \`curl\`. Miếng thịt đầu tiên của dự án. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
