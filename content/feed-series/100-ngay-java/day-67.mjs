/** "100 Ngày Java với CuongThai" — Ngày 67: Spring Boot. MỞ GIAI ĐOẠN 9.
    Nối đúng chỗ Ngày 66 kết ("cả trăm dòng JDBC lặp đi lặp lại — chẳng lẽ
    không ai làm hộ chuyện máy móc đó?").
    Ngày 68 (REST API đầu tiên) trỏ ngược về phần kết.

    ⚠ LUẬT 6: Spring là framework ngoài, thẻ chạy JDK thuần nên chương trình
    kiểm chứng dựng lại nguyên lý IoC/DI bằng container reflection; thân bài dạy
    @Component/@Autowired/@SpringBootApplication thật. Output là kết quả THẬT
    của javac/java JDK 21.

    Lịch sử trong bài đã kiểm: Rod Johnson (sách 2002, Spring 1.0 năm 2004,
    phản ứng với EJB nặng nề); Spring Boot ra 2014 (auto-config, embedded
    Tomcat, starter). */
export default {
  day: 67,
  card: 'java-day-67',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'build-a-dependency-injection-container',
    title: 'Tự viết một container Dependency Injection',
  },

  content: `🌱 100 NGÀY JAVA — NGÀY 67: SPRING BOOT — MỞ GIAI ĐOẠN 9

Ngày 66 kết bằng một nỗi mệt mỏi rất thật: để đọc một dòng đơn hàng ra đối tượng, bạn phải viết \`prepareStatement\`, \`setString\`, \`executeQuery\`, \`while (rs.next())\`, rồi đóng ba tài nguyên. Cả trăm dòng máy móc lặp lại cho mỗi bảng.

Hôm nay ta gặp thứ đã giải quyết chuyện đó cho cả thế giới Java doanh nghiệp: **Spring**.

━━━━━━━━━━━━━━━━━━━━

📜 MỘT CHÚT LỊCH SỬ — VÌ SAO SPRING RA ĐỜI

Đầu những năm 2000, cách "chuẩn" để viết ứng dụng Java doanh nghiệp là **EJB** (Enterprise JavaBeans). Nó nặng nề đến mức nổi tiếng: mỗi thành phần kéo theo hàng đống file XML, nhiều interface bắt buộc, và gần như không thể viết test đơn giản.

Năm 2002, **Rod Johnson** viết một cuốn sách phân tích cái sai đó, kèm theo mã nguồn mẫu cho một cách làm nhẹ hơn: dùng đối tượng Java thường (POJO) và để một "container" lo việc lắp ráp. Mã đó lớn dần thành **Spring Framework 1.0, phát hành năm 2004**. Triết lý: trả lập trình viên về với code nghiệp vụ, framework lo phần hạ tầng.

Spring mạnh nhưng vẫn cần khá nhiều cấu hình. Nên năm **2014, đội Spring tại Pivotal ra Spring Boot** — một lớp bọc quanh Spring với ba lời hứa:

- **Auto-configuration** — tự đoán cấu hình hợp lý, bạn chỉ chỉnh khi cần khác.
- **Máy chủ web nhúng sẵn** — Tomcat nằm ngay trong file \`.jar\`, chạy \`java -jar\` là có web, không phải cài server riêng.
- **Starter** — mỗi tính năng gói thành một phụ thuộc duy nhất trong \`pom.xml\` (Ngày 56).

Ngày nay đại đa số microservice và ứng dụng Java đi làm đều chạy trên Spring Boot. Học nó là học ngôn ngữ chung của nghề.

📎 Tài liệu chính thức: spring.io/projects/spring-boot · Tạo dự án mới trong 30 giây: start.spring.io (Spring Initializr).

━━━━━━━━━━━━━━━━━━━━

🔄 Ý TƯỞNG CỐT LÕI: ĐẢO NGƯỢC QUYỀN TẠO (IoC)

Trước khi gõ một dòng Spring, phải hiểu ý tưởng nền — vì đây là thứ khiến người mới bối rối nhất.

Suốt 66 ngày, khi cần một đối tượng bạn tự \`new\` nó, rồi tự nối dây phụ thuộc:

\`\`\`java
KhoDonHang kho = new KhoDonHangJdbc(conn);
DichVuDonHang dv = new DichVuDonHang(kho);
\`\`\`

Với vài lớp thì ổn. Nhưng ứng dụng thật có hàng trăm lớp phụ thuộc chằng chịt — tự nối dây tất cả là một mớ bòng bong.

Spring lật ngược: **bạn không tạo đối tượng nữa; một *container* tạo hộ và tự "tiêm" phụ thuộc vào.** Đó là *Inversion of Control* (IoC) — đảo ngược quyền điều khiển việc tạo đối tượng — thực hiện bằng *Dependency Injection* (DI).

Bản chất của cái container đó không huyền bí. Nó đọc constructor của mỗi lớp, tự tìm phụ thuộc, tạo theo đúng thứ tự. Đây là một container tí hon viết bằng JDK thuần, chạy thật:

\`\`\`
1) dang ky 2 bean vao container
2) lay DichVuDonHang -> container tu tiem kho 'JDBC', khong ai goi new
5) code nghiep vu tu goi new: 0 lan; container tao ho: 2 bean
6) thu tu container tao: [KhoDonHangJdbc, DichVuDonHang]
\`\`\`

Để ý dòng 6: container tạo \`KhoDonHangJdbc\` **trước**, rồi mới tạo \`DichVuDonHang\` và đưa cái kho vào. Nó tự sắp thứ tự theo phụ thuộc — bạn chỉ khai "tôi cần gì", không khai "tạo theo thứ tự nào".

━━━━━━━━━━━━━━━━━━━━

💉 TRONG SPRING THẬT: BA CÁI NHÃN

Bạn không tự viết container — chỉ cần dán nhãn cho Spring biết lớp nào là bean:

\`\`\`java
@Repository                         // tầng truy cập dữ liệu (Ngày 64)
public class KhoDonHangJdbc implements KhoDonHang { ... }

@Service                            // tầng nghiệp vụ
public class DichVuDonHang {
    private final KhoDonHang kho;

    public DichVuDonHang(KhoDonHang kho) {   // Spring TỰ tiêm vào đây
        this.kho = kho;
    }
}
\`\`\`

\`@Component\` là nhãn gốc "đây là một bean"; \`@Service\` và \`@Repository\` là hai biến thể của nó, chỉ khác ở chỗ nói rõ vai trò để code dễ đọc. Khi khởi động, Spring quét các nhãn này, tạo mỗi lớp một lần, và tự ghép chúng lại.

Cách tiêm nên dùng là **qua constructor** như trên: phụ thuộc là \`final\`, không thể quên, và test thì chỉ việc \`new DichVuDonHang(khoGia)\` — đúng mẫu DAO của Ngày 64. (Bạn sẽ gặp \`@Autowired\` đặt thẳng trên trường trong code cũ; constructor injection được khuyến nghị hơn.)

━━━━━━━━━━━━━━━━━━━━

1️⃣ BEAN LÀ SINGLETON — VÀ HỆ QUẢ

Mặc định mỗi bean chỉ được tạo **một lần**, dùng chung cho cả ứng dụng:

\`\`\`
3) singleton: lay 2 lan -> cung mot the hien? true
\`\`\`

Điều này tiết kiệm, nhưng kéo theo một luật quan trọng: **bean không được giữ trạng thái riêng của một request**. Vì mọi request dùng chung một thể hiện, và chúng chạy song song trên nhiều luồng (nhớ lại Ngày 41) — một biến thành viên đổi theo request là công thức cho dữ liệu của người này lẫn sang người kia. Bean giữ *cấu hình* và *phụ thuộc*, không giữ *dữ liệu đang xử lý*.

━━━━━━━━━━━━━━━━━━━━

🔌 PHẦN THƯỞNG QUEN THUỘC: ĐỔI RUỘT KHÔNG SỬA NGƯỜI DÙNG

Vì service chỉ phụ thuộc vào **interface** \`KhoDonHang\`, đổi bản cài đặt chỉ là đổi bean nào được đăng ký:

\`\`\`
4) doi binding sang BoNho -> service dung nguon 'BoNho', DichVuDonHang y nguyen
\`\`\`

Đây chính là bài Ngày 18 và Ngày 64, giờ được framework tự động hoá: test dùng bản bộ nhớ (chạy nhanh, không cần CSDL), production dùng bản JDBC — cùng một \`DichVuDonHang\`, không sửa một dòng. Spring quản lý việc chọn bản nào qua cấu hình.

━━━━━━━━━━━━━━━━━━━━

🚀 KHỞI ĐỘNG: ĐÚNG MỘT LỚP

Toàn bộ ứng dụng Spring Boot bắt đầu từ một lớp bé xíu:

\`\`\`java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
\`\`\`

\`@SpringBootApplication\` gộp ba việc: bật auto-configuration, bật quét component (tìm mọi \`@Service\`, \`@Repository\`...), và đánh dấu đây là điểm khởi đầu. Dòng \`SpringApplication.run\` dựng container, tạo mọi bean, khởi động Tomcat nhúng. Chạy \`java -jar\` là có một web server đang sống.

Còn phụ thuộc? Chỉ một dòng starter trong \`pom.xml\`:

\`\`\`xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
\`\`\`

Một dòng đó kéo về Spring, Tomcat, thư viện JSON — tất cả bản tương thích với nhau. Đây là lý do người ta yêu Spring Boot: nó dọn sạch phần cấu hình để bạn quay lại viết nghiệp vụ.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Vào start.spring.io, tạo một dự án với starter "Spring Web", tải về mở bằng IDE.
2. Đọc lớp \`@SpringBootApplication\` sinh sẵn, chạy nó, xem log Tomcat khởi động.
3. Tạo một \`@Service\` phụ thuộc một \`@Repository\` qua constructor.
4. In ra \`hashCode\` của bean ở hai chỗ khác nhau — xác nhận cùng một thể hiện (singleton).
5. Tự viết một container DI 30 dòng bằng reflection (link Code Lab) để hiểu Spring làm gì bên trong.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Spring Boot đứng trên một ý tưởng duy nhất: **Inversion of Control** — bạn thôi tự \`new\` và nối dây đối tượng, để một container làm việc đó qua **Dependency Injection**. Bạn dán nhãn \`@Service\`/\`@Repository\`, khai phụ thuộc qua constructor, và framework lo phần lắp ráp, vòng đời, cùng cả một máy chủ web nhúng. Nhờ vậy bạn viết ít code hạ tầng hơn và nhiều nghiệp vụ hơn.

Nhưng nãy giờ vẫn chỉ là "cỗ máy đã nổ nhưng chưa chở ai". Một web server đang chạy mà chưa trả lời một địa chỉ nào thì cũng chưa để làm gì.

Ngày 68: **REST API đầu tiên** — \`@RestController\`, \`@GetMapping\`, và cách biến một phương thức Java thành một địa chỉ web trả JSON. Bạn sẽ dựng một API chạy được, gọi bằng trình duyệt, trong khoảng hai mươi dòng. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
