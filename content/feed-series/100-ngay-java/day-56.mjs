/** "100 Ngày Java với CuongThai" — Ngày 56: Maven.
    Nối chỗ Ngày 55 kết (JUnit/Mockito là thư viện ngoài, tải tay thế nào).
    Ngày 57 (Git & CI) trỏ ngược về phần kết.

    ⚠ Maven là công cụ ngoài, không chạy được trong thẻ (JDK thuần), nên
    thẻ dựng lại nguyên lý cây phụ thuộc + luật "gần nhất thắng"; thân bài
    dạy pom.xml thật. Mọi output là kết quả THẬT của javac/java JDK 21. */
export default {
  day: 56,
  card: 'java-day-56',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'build-a-multi-module-maven-project-with-cicd-pipeline',
    title: 'Dự án Maven nhiều module kèm CI/CD',
  },

  content: `📦 100 NGÀY JAVA — NGÀY 56: MAVEN

Hai bài trước tôi lảng tránh một chuyện: JUnit và Mockito là **thư viện ngoài**. Muốn dùng thì phải có chúng trên máy.

Cách thủ công: lên mạng tải file \`.jar\`, chép vào một thư mục, rồi bảo trình dịch tìm ở đó.

Được — cho tới khi bạn phát hiện JUnit lại cần một thư viện khác. Mà thư viện đó cần thêm hai cái nữa. Rồi đồng nghiệp mở dự án của bạn và thiếu mất ba file. Rồi hai thư viện cùng cần một thư viện thứ ba nhưng khác phiên bản.

Đó là lý do mọi dự án Java đi làm đều dùng Maven (hoặc Gradle).

━━━━━━━━━━━━━━━━━━━━

📌 KHAI BÁO, ĐỪNG TẢI

Toàn bộ việc bạn làm là viết vào \`pom.xml\`:

\`\`\`xml
<dependencies>
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter</artifactId>
        <version>5.10.0</version>
        <scope>test</scope>
    </dependency>
</dependencies>
\`\`\`

Ba dòng \`groupId\` / \`artifactId\` / \`version\` là địa chỉ duy nhất của một thư viện trên đời. Maven tải về, cất vào kho chung \`~/.m2\`, và đưa vào classpath khi biên dịch.

\`<scope>test</scope>\` nghĩa là thư viện này chỉ dùng lúc chạy test, không đóng gói vào sản phẩm cuối — JUnit không nên đi kèm khi giao hàng.

━━━━━━━━━━━━━━━━━━━━

🕸️ PHỤ THUỘC BẮC CẦU — VIỆC NẶNG NHẤT

Đây là phần Maven làm hộ mà bạn ít khi để ý. Khai báo 2 thư viện:

\`\`\`
du-an ─┬─ junit ── opentest
       └─ web ──┬─ json ── log 2.0.7
                └─ log 2.0.9
\`\`\`

Chạy thật thuật toán giải cây phụ thuộc:

\`\`\`
1) khai bao 2 thu vien -> thuc te tai ve 5
2) danh sach -> [json, junit, log, opentest, web]
3) thu vien BAC CAU (khong khai bao) co opentest? true
\`\`\`

Bạn khai 2, máy tải 5. Ba cái kia là *phụ thuộc bắc cầu* — thứ mà thư viện của bạn cần. Làm tay thì bạn phải tự đọc tài liệu từng cái, tự tải, tự kiểm.

━━━━━━━━━━━━━━━━━━━━

⚖️ XUNG ĐỘT PHIÊN BẢN: GẦN NHẤT THẮNG

Để ý cây trên: \`log\` bị hai nhánh cần với hai phiên bản khác nhau.

JVM chỉ nạp được MỘT phiên bản của mỗi class. Vậy chọn cái nào?

\`\`\`
4) log bi khai 2 phien ban -> chon log:2.0.9
5) luat 'gan nhat thang' -> dung 2.0.9? true
\`\`\`

Luật của Maven: **gần gốc hơn thì thắng**. \`web\` ở tầng 1 cần \`log 2.0.9\`, còn \`json\` ở tầng 2 cần \`log 2.0.7\` — nên bản 2.0.9 được chọn.

Đây là nguồn gốc của một loại lỗi khó chịu: \`NoSuchMethodError\` lúc chạy. Code dịch ngon lành (dịch với bản này), nhưng lúc chạy JVM nạp bản khác không có method đó. Hai lệnh cần thuộc để gỡ:

\`\`\`bash
mvn dependency:tree      # xem cả cây, thấy ngay ai kéo cái gì về
mvn dependency:analyze   # tìm thư viện khai mà không dùng, hoặc dùng mà không khai
\`\`\`

Muốn ép một phiên bản cụ thể thì khai thẳng nó trong \`pom.xml\` của bạn — tầng 0, gần gốc nhất, luôn thắng.

━━━━━━━━━━━━━━━━━━━━

🔄 VÒNG ĐỜI BUILD

Maven có một chuỗi pha cố định, và **pha sau luôn kéo theo mọi pha trước**:

\`\`\`
validate → compile → test → package → install → deploy
\`\`\`

\`\`\`
6) chay 'mvn package' -> chay 4 pha: [validate, compile, test, package]
\`\`\`

Nên \`mvn package\` không chỉ đóng gói — nó biên dịch và **chạy test** trước. Test đỏ là dừng, không tạo file \`.jar\`. Đó là ý đồ: đừng bao giờ đóng gói thứ chưa qua kiểm.

Bốn lệnh dùng hằng ngày:

\`\`\`bash
mvn clean          # xoá thư mục target
mvn test           # chạy test (Ngày 53-55)
mvn package        # tạo file .jar
mvn clean install  # cài vào kho ~/.m2 để dự án khác dùng
\`\`\`

━━━━━━━━━━━━━━━━━━━━

📁 CẤU TRÚC THƯ MỤC CHUẨN

Maven theo triết lý "quy ước hơn cấu hình" — cứ đặt đúng chỗ thì không phải khai báo gì:

\`\`\`
du-an/
├── pom.xml
├── src/main/java         mã nguồn
├── src/main/resources    cấu hình, file tĩnh
├── src/test/java         test
└── target/               kết quả build — ĐỪNG commit
\`\`\`

Nghe nhỏ nhặt, nhưng đây là lý do bạn mở bất kỳ dự án Java nào của người lạ cũng biết ngay file nằm ở đâu. Nhớ thêm \`target/\` vào \`.gitignore\`.

━━━━━━━━━━━━━━━━━━━━

🧭 MAVEN HAY GRADLE?

Cả hai đều phổ biến:

- **Maven** — XML, cứng nhắc, dễ đọc, ai nhìn cũng hiểu. Chiếm đa số dự án doanh nghiệp, Spring Boot.
- **Gradle** — Groovy/Kotlin, linh hoạt, build nhanh hơn. Chuẩn của Android.

Học một cái là hiểu cái kia — khái niệm (phụ thuộc, phạm vi, vòng đời, kho) giống hệt nhau, chỉ khác cú pháp. Bắt đầu bằng Maven vì bạn sẽ gặp nó nhiều hơn.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Tạo dự án mới bằng \`mvn archetype:generate\`, xem cấu trúc sinh ra.
2. Thêm JUnit vào \`pom.xml\`, viết một test, chạy \`mvn test\`.
3. Chạy \`mvn dependency:tree\` và đếm số thư viện thật sự được tải.
4. Cố tình để một test đỏ rồi chạy \`mvn package\` — quan sát nó dừng.
5. Thêm hai thư viện cùng cần một thư viện thứ ba khác phiên bản, xem Maven chọn bản nào.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Maven biến "quản lý thư viện" thành một file khai báo: nó tự tải, tự giải phụ thuộc bắc cầu, tự xử xung đột theo luật gần-nhất-thắng, và chạy build theo vòng đời cố định trong đó test là một pha bắt buộc.

Giờ dự án của bạn có test (53–55) và có Maven chạy test (56). Nhưng ai bấm nút chạy?

Thực tế ở công ty: bạn sửa code, quên chạy \`mvn test\`, đẩy lên nhánh chung. Đồng nghiệp kéo về và code hỏng — hoặc tệ hơn, nó lên thẳng production.

Ngày 57: **Git & CI** — cách làm việc trên nhánh, và cách để máy chủ TỰ chạy toàn bộ test mỗi lần có người đẩy code, chặn luôn nhánh nào test đỏ. Từ đây "code của tôi chạy trên máy tôi" không còn là lý do được chấp nhận. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
