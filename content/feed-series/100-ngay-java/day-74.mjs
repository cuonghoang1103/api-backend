/** "100 Ngày Java với CuongThai" — Ngày 74: Cấu hình & hồ sơ (profiles).
    Nối đúng chỗ Ngày 73 kết ("vẫn chạy trên máy bạn với mật khẩu viết thẳng
    trong application.properties; lên prod thì mật khẩu không thể nằm trong code").
    Ngày 75 (kiểm thử Spring) trỏ ngược về phần kết.

    ⚠ LUẬT 6: thẻ chạy JDK thuần nên chương trình dựng lại nguyên lý cấu hình
    nhiều tầng + bí mật từ env; thân bài dạy application.yml/@Value/profiles
    thật. Output là kết quả THẬT của javac/java JDK 21. */
export default {
  day: 74,
  card: 'java-day-74',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'build-a-thread-safe-configuration-cache-with-read-write-lock-optimization',
    title: 'Bộ nhớ đệm cấu hình an toàn luồng',
  },

  content: `🔧 100 NGÀY JAVA — NGÀY 74: CẤU HÌNH & HỒ SƠ (PROFILES)

Ứng dụng của bạn đến giờ xử lý mọi thứ rất gọn. Nhưng nó vẫn đang **chạy trên máy bạn**, với mật khẩu CSDL gõ thẳng vào \`application.properties\`, cổng \`8080\`, URL \`localhost\`.

Đem lên production thì cả ba thứ đó phải khác — và cái mật khẩu kia **tuyệt đối không được** đi cùng code lên Git. Hôm nay học cách một mã nguồn chạy được ở mọi môi trường.

━━━━━━━━━━━━━━━━━━━━

📄 application.yml: MỌI CẤU HÌNH MỘT CHỖ

Spring Boot đọc cấu hình từ \`application.properties\` hoặc \`application.yml\` (cùng cây khoá, chỉ khác cú pháp). YAML dễ đọc hơn khi lồng nhau:

\`\`\`yaml
server:
  port: 8080
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/hoc_sql
    username: postgres
app:
  ten: CuongThai
  so-don-moi-trang: 20
\`\`\`

Lấy giá trị ra dùng bằng \`@Value\`:

\`\`\`java
@Value("\${app.ten}")
private String tenUngDung;

@Value("\${app.so-don-moi-trang:10}")   // :10 = mặc định nếu thiếu
private int soDonMoiTrang;
\`\`\`

Với một nhóm cấu hình liên quan, gom vào một lớp \`@ConfigurationProperties\` sạch hơn là rải \`@Value\` khắp nơi — nhưng nguyên tắc thì một.

━━━━━━━━━━━━━━━━━━━━

🎚️ NHIỀU TẦNG, TẦNG SAU THẮNG

Đây là cơ chế cốt lõi. Spring không đọc cấu hình từ *một* nguồn — nó xếp chồng **nhiều tầng**, tầng ưu tiên cao ghi đè tầng thấp:

\`\`\`
mặc-định  <  application.yml  <  profile  <  BIẾN MÔI TRƯỜNG
(thấp nhất)                                    (cao nhất)
\`\`\`

Cùng một khoá \`server.port\` đi qua các tầng:

\`\`\`
2) doc 'server.port' (moi co file) -> 8080
3) profile 'prod' ghi de -> server.port=80
4) BIEN MOI TRUONG ghi de tat ca -> server.port=9000
\`\`\`

File cho \`8080\`, profile prod ghi đè thành \`80\`, và biến môi trường ghi đè tất cả thành \`9000\`. Đây chính là thứ cho phép **đổi cấu hình production mà không đụng vào code hay file trong Git** — chỉ cần đặt một biến môi trường trên máy chủ.

━━━━━━━━━━━━━━━━━━━━

🌓 PROFILE: DEV KHÁC PROD

Máy dev nối CSDL local; production nối CSDL thật. Thay vì sửa qua sửa lại một file, tách ra theo **profile**:

\`\`\`
application.yml         # cấu hình chung
application-dev.yml     # riêng cho dev
application-prod.yml    # riêng cho prod
\`\`\`

\`\`\`yaml
# application-prod.yml
server:
  port: 80
spring:
  jpa:
    show-sql: false        # prod không log SQL (Ngày 71)
\`\`\`

Chọn profile khi chạy, thường bằng biến môi trường:

\`\`\`bash
SPRING_PROFILES_ACTIVE=prod java -jar app.jar
\`\`\`

Profile được chọn sẽ **chồng lên** cấu hình chung, chỉ ghi đè phần khác biệt. Một mã nguồn, một file \`.jar\`, chạy mọi môi trường — khác nhau chỉ ở profile đang bật.

━━━━━━━━━━━━━━━━━━━━

🔐 BÍ MẬT: TỪ BIẾN MÔI TRƯỜNG, KHÔNG VÀO GIT

Đây là phần nghiêm túc nhất của bài. Mật khẩu CSDL, khoá API, JWT secret — **không bao giờ** được viết giá trị thật vào file cấu hình, vì file đó đi vào Git (nhớ \`.gitignore\` của Ngày 57).

Thay vào đó, trong file bạn chỉ *tham chiếu* tới biến môi trường:

\`\`\`yaml
spring:
  datasource:
    password: \${DB_PASSWORD}     # lấy từ biến môi trường, không phải giá trị thật
app:
  jwt-secret: \${JWT_SECRET}
\`\`\`

Giá trị thật đặt ở môi trường máy chủ, ngoài tầm với của Git:

\`\`\`
5) db.password co gia tri? true, nguon: bien-moi-truong
\`\`\`

\`db.password\` không hề nằm trong file nào — nó đến từ tầng biến môi trường. Đây đúng là kỷ luật env-var: **cấu trúc cấu hình sống trong code, giá trị bí mật sống ngoài code.**

━━━━━━━━━━━━━━━━━━━━

🛑 THIẾU BÍ MẬT THÌ DỪNG, ĐỪNG CHẠY BỪA

Một sai lầm nguy hiểm: thiếu cấu hình bắt buộc mà ứng dụng vẫn khởi động với giá trị rỗng — rồi chạy sai âm thầm, hoặc tệ hơn, chạy với một mật khẩu rỗng.

\`\`\`
6) doc 'jwt.secret' (khong o dau) -> thieu cau hinh bat buoc: jwt.secret
\`\`\`

Cấu hình bắt buộc mà không có ở đâu thì **dừng ngay lúc khởi động** với thông báo rõ ràng, tốt hơn nhiều so với chạy tiếp rồi hỏng ở một chỗ khó lần. Spring hỗ trợ đánh dấu thuộc tính bắt buộc để nó "fail fast" như vậy.

━━━━━━━━━━━━━━━━━━━━

⚠️ MỘT LƯU Ý DÀNH RIÊNG CHO NGƯỜI ĐI LÀM

Thứ tự ưu tiên tầng cấu hình giải thích một loại sự cố deploy kinh điển: bạn đổi một giá trị trong \`application.yml\`, deploy, mà production **không đổi** — vì trên máy chủ có một biến môi trường cùng tên đang ghi đè nó ở tầng cao hơn. Khi cấu hình "không chịu đổi", việc đầu tiên là hỏi: *có tầng nào ưu tiên cao hơn đang ghi đè không?*

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Chuyển vài giá trị cứng trong code sang \`application.yml\`, đọc bằng \`@Value\`.
2. Tạo \`application-dev.yml\` và \`application-prod.yml\` với cổng khác nhau, chạy thử từng profile.
3. Đặt \`password: \${DB_PASSWORD}\`, chạy với và không có biến môi trường đó.
4. Gom một nhóm cấu hình vào một lớp \`@ConfigurationProperties\`.
5. Đặt một biến môi trường ghi đè giá trị trong file, xác nhận giá trị nào thắng.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Cấu hình Spring Boot xếp chồng nhiều tầng (mặc-định < file < profile < biến môi trường), nên một mã nguồn chạy được mọi môi trường bằng cách đổi profile hoặc biến môi trường — không sửa code. Bí mật (mật khẩu, khoá) đến từ biến môi trường, cấu trúc ở trong code còn giá trị thì ở ngoài Git. Và thiếu cấu hình bắt buộc thì dừng ngay, đừng chạy với giá trị rỗng.

Ứng dụng của bạn giờ đủ để đem lên máy chủ thật. Nhưng khoan — trước khi giao cho người dùng, làm sao bạn **biết chắc** nó chạy đúng? Suốt Giai đoạn 7 bạn học viết test, nhưng đó là test cho hàm Java thuần. Còn một controller có chạy đúng khi nhận request HTTP không? Một repository có lưu đúng vào CSDL không? Cả cái container Spring có ghép bean đúng không?

Ngày 75: **Kiểm thử trong Spring** — \`@SpringBootTest\` dựng cả ứng dụng để test, \`MockMvc\` gọi API mà không cần server thật, \`@DataJpaTest\` kiểm repository trên một CSDL trong bộ nhớ. Đưa cái lưới an toàn của Giai đoạn 7 lên tầm một ứng dụng web hoàn chỉnh. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
