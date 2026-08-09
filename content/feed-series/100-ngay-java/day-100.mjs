/** "100 Ngày Java với CuongThai" — Ngày 100: KHÉP KHOÁ.
    Ngày cuối cùng. Nối chỗ Ngày 99 kết ("nhìn lại trọn hành trình, điều quan
    trọng nhất đã học — không phải cú pháp — và bản đồ chặng đường tiếp theo").
    Không trỏ tới ngày nào nữa: đây là ngày cuối.

    ⚠ LUẬT 6: chương trình tính tổng 10 giai đoạn = 100 ngày, tất định. Output
    là kết quả THẬT của javac/java JDK 21. */
export default {
  day: 100,
  card: 'java-day-100',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'capstone-build-an-encapsulated-inventory',
    title: 'Đồ án tổng hợp — tự tay dựng lại từ đầu',
  },

  content: `🎉 100 NGÀY JAVA — NGÀY 100: KHÉP KHOÁ

Chúng ta đến rồi. Ngày thứ một trăm.

Hôm nay không có khái niệm mới, không có \`@Annotation\` nào để học. Chỉ có ba việc: nhìn lại trọn vẹn hành trình, gọi tên điều quan trọng nhất bạn thật sự học được, và vẽ tấm bản đồ cho chặng đường phía trước. Ngồi xuống, pha một tách cà phê, và cùng nhìn lại.

━━━━━━━━━━━━━━━━━━━━

🗺️ MỘT TRĂM NGÀY, MƯỜI GIAI ĐOẠN

\`\`\`
1) 10 giai doan, cong lai 100 ngay
2) GD1-5 nen tang ngon ngu (Ngay 1-40): cu phap, OOP, collections, hien dai
3) GD6-8 he thong (Ngay 41-66): da luong, JVM/test/build, CSDL
4) GD9-10 ung dung that (Ngay 67-100): Spring Boot, bao mat, du an Blog API
5) kiem: tong 100 ngay = dung 100, khong sot
\`\`\`

Nhìn lại con đường:
- **Bốn mươi ngày đầu** — bạn học *ngôn ngữ*: biến, vòng lặp, lớp, kế thừa, đa hình, collections, generics, lambda, stream. Xây nền.
- **Từ 41 tới 66** — bạn học *hệ thống*: đa luồng, bên trong JVM, kiểm thử, build, và cơ sở dữ liệu. Hiểu máy chạy code của mình thế nào.
- **Từ 67 tới 100** — bạn *dựng ứng dụng thật*: Spring Boot, bảo mật, và một Blog API hoàn chỉnh từ trang giấy trắng.

Mỗi ngày chỉ là một viên gạch nhỏ. Nhưng một trăm viên gạch, xếp đúng thứ tự, thành một toà nhà.

━━━━━━━━━━━━━━━━━━━━

💡 ĐIỀU QUAN TRỌNG NHẤT — KHÔNG PHẢI CÚ PHÁP

Đây là điều tôi muốn bạn mang theo hơn tất cả. Cú pháp — cách viết một vòng lặp, tên một phương thức — thì Google 30 giây là ra, và bạn sẽ quên rồi tra lại cả nghìn lần trong sự nghiệp. Nó không phải thứ quý nhất bạn học được.

Thứ quý nhất là **cách nghĩ như một kỹ sư**, mà cả trăm ngày qua đã âm thầm rèn:

- **Đo trước khi sửa** — đừng đoán chỗ nào chậm (59, 98).
- **Đừng tin dữ liệu từ ngoài** — mọi thứ client gửi đều đáng nghi (63, 69, 80, 87).
- **Mọi quyết định là một đánh đổi** — không có "đúng tuyệt đối", chỉ có "hợp cảnh" (99).
- **Viết code cho người đọc**, không chỉ cho máy chạy — vì tháng sau chính bạn phải đọc lại.
- **Chạy thử mới tin** — không có gì thay được việc biên dịch và chạy thật.

Những nguyên tắc này không thuộc riêng Java. Bạn mang chúng sang bất kỳ ngôn ngữ, bất kỳ dự án nào. Đó mới là thứ khoá học thật sự dạy.

━━━━━━━━━━━━━━━━━━━━

⭕ MỘT VÒNG TRÒN

\`\`\`
6) tu Hello World (Ngay 1) den backend hoan chinh (Ngay 100): MOT VONG TRON
\`\`\`

Ngày 1, bạn gõ \`System.out.println("Hello, Java!")\` và chưa chắc hiểu \`public static void main\` nghĩa là gì. Hôm nay bạn đọc được kiến trúc bốn tầng, giải thích được vì sao dùng JWT, chống được SQL injection, và dựng được một dịch vụ web thật.

Người viết dòng Hello World ngày ấy và người đang đọc những dòng này — là hai người khác nhau. Bạn đã thay đổi. Đó là điều một trăm ngày kiên trì làm được.

━━━━━━━━━━━━━━━━━━━━

🚀 CHẶNG ĐƯỜNG TIẾP THEO

Nền đã chắc. Giờ là lúc chọn hướng và đi sâu:

- **Đào sâu backend** — microservice, hàng đợi tin nhắn (Kafka/RabbitMQ), Kubernetes, kiến trúc phân tán.
- **Mở rộng chiều ngang** — Spring Security nâng cao, GraphQL, reactive (WebFlux), Kotlin.
- **Đọc mã nguồn mở** — mở một dự án Spring thật trên GitHub, đọc cách người ta tổ chức. Giờ bạn đọc hiểu được.
- **Xây dự án của riêng bạn** — đây là cách học nhanh nhất. Lấy Blog API làm khung, biến nó thành thứ *bạn* muốn.
- **Đừng ngừng học** — Java ra bản mới đều đặn, hệ sinh thái luôn động. Người kỹ sư giỏi là người học cả đời.

Và một lời khuyên thật lòng: **đừng học thêm 100 ngày lý thuyết nữa**. Bạn đã đủ nền. Hãy đi *làm* — một dự án thật, dù nhỏ, dạy bạn nhiều hơn mười khoá học.

━━━━━━━━━━━━━━━━━━━━

🙏 CẢM ƠN BẠN

Kiên trì một trăm ngày là điều hiếm. Rất nhiều người bắt đầu, rất ít người đi hết. Bạn đã đi hết. Dù bạn theo trọn từ Ngày 1, hay nhảy vào giữa chừng, hay đọc ngược lại — cảm ơn bạn đã đồng hành.

Loạt bài này viết ra với một niềm tin: rằng ai cũng học lập trình được, nếu được dẫn từng bước một cách tử tế, và nếu mỗi khái niệm được *chạy thật* để thấy nó sống. Mong nó đã giúp được bạn.

Giờ thì đóng bài viết này lại, mở IDE lên, và viết dòng code tiếp theo của bạn. Hành trình thật sự chỉ vừa bắt đầu.

Chúc bạn viết nên những điều tuyệt vời. 💚

— CuongThai

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT — 100/100

Một trăm ngày, từ \`Hello, Java!\` tới một backend hoàn chỉnh. Bạn không chỉ học một ngôn ngữ — bạn học cách nghĩ như một kỹ sư: đo trước khi sửa, không tin dữ liệu ngoài, cân nhắc đánh đổi, và luôn chạy thử để tin. Cú pháp rồi quên; tư duy đó ở lại suốt sự nghiệp.

Nền đã chắc rồi. Đi làm dự án thật đi — đó là chặng đường tiếp theo, và nó là của riêng bạn.

Cảm ơn vì đã đi trọn 100 ngày. Hẹn gặp ở những dòng code tiếp theo. 🏁

#100NgayJava #Java #HocLapTrinh`,
};
