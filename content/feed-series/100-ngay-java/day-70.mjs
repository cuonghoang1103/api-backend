/** "100 Ngày Java với CuongThai" — Ngày 70: Spring Data JPA.
    Nối đúng chỗ Ngày 69 kết ("vẫn tự viết PreparedStatement/ResultSet như GĐ8 —
    cả trăm dòng cho 4 thao tác CRUD mỗi bảng").
    Ngày 71 (quan hệ JPA: @OneToMany/@ManyToOne) trỏ ngược về phần kết.

    ⚠ LUẬT 6: thẻ chạy JDK thuần nên chương trình dựng lại đúng cơ chế thật của
    Spring Data (dynamic Proxy + phân tích tên hàm); thân bài dạy @Entity/
    JpaRepository thật. Output là kết quả THẬT của javac/java JDK 21. */
export default {
  day: 70,
  card: 'java-day-70',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'build-a-generic-shopping-cart-with-file-persistence-and-custom-exceptions',
    title: 'Giỏ hàng có lưu trữ bền (nền cho repository)',
  },

  content: `🪄 100 NGÀY JAVA — NGÀY 70: SPRING DATA JPA

Nhìn lại Giai đoạn 8 một chút. Để lưu và đọc một đơn hàng, bạn đã phải viết \`prepareStatement\`, \`setString\`, \`executeQuery\`, \`while (rs.next())\`, \`rs.getString\`, đóng ba tài nguyên — rồi lặp lại toàn bộ cho \`findById\`, \`findAll\`, \`save\`, \`delete\`. Cả trăm dòng cho bốn thao tác CRUD của **mỗi** bảng.

Hôm nay, tất cả gập lại thành **một interface rỗng**.

━━━━━━━━━━━━━━━━━━━━

🗂️ BƯỚC 1: @Entity — LỚP GẮN VỚI BẢNG

JPA (Jakarta Persistence API) là chuẩn để ánh xạ **đối tượng Java ↔ hàng trong bảng**. Bạn dán nhãn lên lớp:

\`\`\`java
@Entity
@Table(name = "don_hang")
public class DonHang {
    @Id
    private String ma;              // khoá chính (Ngày 61)
    private int soTien;
    private String trangThai;
    // getter/setter, constructor...
}
\`\`\`

- \`@Entity\` — "lớp này tương ứng một bảng".
- \`@Id\` — trường này là khoá chính.
- \`@Table\`, \`@Column\` — chỉnh tên bảng/cột khi khác quy ước.

Đây chính là việc bạn làm bằng tay ở Ngày 64 (ánh xạ \`ResultSet\` → đối tượng), giờ khai báo một lần và JPA lo cả hai chiều.

━━━━━━━━━━━━━━━━━━━━

🪄 BƯỚC 2: INTERFACE RỖNG, CRUD ĐẦY ĐỦ

Đây là phần làm người mới sững lại. Bạn khai một interface **không có thân hàm nào**:

\`\`\`java
public interface KhoDonHang extends JpaRepository<DonHang, String> {
}
\`\`\`

\`JpaRepository<DonHang, String>\` nghĩa là "kho cho \`DonHang\`, khoá kiểu \`String\`". Và chỉ với dòng đó, bạn đã có sẵn:

\`\`\`java
kho.save(don);            // INSERT hoặc UPDATE
kho.findById("DH-2");     // SELECT ... WHERE ma = ?
kho.findAll();            // SELECT *
kho.deleteById("DH-1");   // DELETE
kho.count();              // SELECT count(*)
\`\`\`

\`\`\`
1) khai interface rong -> framework sinh ban cai dat luc chay, count()=3
2) save + findById('DH-2') -> DonHang[ma=DH-2, soTien=350000, trangThai=DA_GIAO]
\`\`\`

Không một dòng SQL. Không \`PreparedStatement\`. Spring **tự sinh** bản cài đặt lúc chạy.

━━━━━━━━━━━━━━━━━━━━

🔤 BƯỚC 3: PHÉP MÀU KHÔNG PHẢI PHÉP MÀU

Khi cần truy vấn riêng, bạn chỉ **đặt tên phương thức** theo quy ước — và Spring dựng câu truy vấn từ chính cái tên:

\`\`\`java
List<DonHang> findByTrangThai(String trangThai);
List<DonHang> findBySoTienGreaterThan(int nguong);
List<DonHang> findByTrangThaiOrderBySoTienDesc(String tt);
\`\`\`

\`\`\`
3) findByTrangThai('MOI') -> [DH-1, DH-3]
4) findBySoTienGreaterThan(200000) -> [DH-2, DH-3]
5) phan tich ten ham -> truong 'soTien' + phep 'GreaterThan'
\`\`\`

Nhìn có vẻ ma thuật, nhưng nó **không** ma thuật — và bạn đủ trình để hiểu bên dưới rồi. Spring dùng đúng hai thứ đã học:

- **Dynamic Proxy** (Ngày 67 nói về phản chiếu): interface không có thân, nên Spring tạo một đối tượng đại diện chặn mọi lời gọi phương thức.
- **Phân tích tên hàm**: cắt \`findBy\`, tách \`SoTien\` + \`GreaterThan\`, đối chiếu \`SoTien\` với trường của \`@Entity\` bằng phản chiếu, dựng ra điều kiện \`WHERE so_tien > ?\`.

Chương trình kiểm chứng hôm nay làm **đúng cơ chế đó** bằng JDK thuần: một \`Proxy\` chặn lời gọi, một hàm phân tích tên. Dòng 5 cho thấy nó thật sự đọc \`findBySoTienGreaterThan\` ra thành *trường \`soTien\` + phép \`GreaterThan\`*. Hiểu điều này thì "phép màu" của Spring thành ra rất dễ chịu — nó chỉ là code, và là code bạn đã biết viết.

\`\`\`
6) so dong SQL minh tu viet tay: 0
\`\`\`

━━━━━━━━━━━━━━━━━━━━

✍️ KHI TÊN HÀM KHÔNG ĐỦ: @Query

Có truy vấn phức tạp quá cho việc đặt tên (\`findByTrangThaiAndSoTienGreaterThanAndNgayTaoBefore...\` thì dài kinh khủng). Lúc đó viết thẳng câu truy vấn:

\`\`\`java
@Query("SELECT d FROM DonHang d WHERE d.soTien > :muc AND d.trangThai = :tt")
List<DonHang> timDonLon(@Param("muc") int muc, @Param("tt") String tt);
\`\`\`

Lưu ý đây là **JPQL** — truy vấn theo *đối tượng* (\`DonHang\`, \`d.soTien\`), không phải theo bảng/cột. Và tham số vẫn đi bằng \`:tên\` — chính là \`PreparedStatement\` chống SQL injection của Ngày 63, JPA lo giúp.

━━━━━━━━━━━━━━━━━━━━

⚙️ CẤU HÌNH: VÀI DÒNG application.yml

Để JPA nối được CSDL, khai trong \`application.properties\` (hoặc \`.yml\`):

\`\`\`properties
spring.datasource.url=jdbc:postgresql://localhost:5432/hoc_sql
spring.datasource.username=postgres
spring.datasource.password=\${DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=validate
\`\`\`

Thêm hai starter vào \`pom.xml\`: \`spring-boot-starter-data-jpa\` và driver \`postgresql\`. Xong — không cần \`DriverManager.getConnection\`, không quản lý \`Connection\` bằng tay nữa.

Một cảnh báo thật lòng về \`ddl-auto\`: đặt \`update\`/\`create\` để JPA tự đổi bảng thì tiện lúc học, nhưng **đừng bao giờ dùng trên production** — nó có thể âm thầm đổi lược đồ và mất dữ liệu. Ở thật, dùng \`validate\` (chỉ kiểm khớp) và quản lý thay đổi bảng bằng công cụ migration riêng, đúng tinh thần kỷ luật migration.

━━━━━━━━━━━━━━━━━━━━

⚠️ TIỆN NHƯNG ĐỪNG QUÊN GIAI ĐOẠN 8

JPA giấu SQL đi, nhưng SQL vẫn chạy bên dưới. Người dùng JPA mà quên điều đó sẽ gặp lại đúng những bài của Giai đoạn 8:

- **Chỉ mục vẫn cần** (Ngày 66): \`findByEmail\` chậm như rùa nếu cột \`email\` chưa có index.
- **Truy vấn N+1**: lặp qua 100 đơn rồi mỗi đơn lại hỏi CSDL một câu → 101 câu truy vấn. Đây là bẫy JPA kinh điển, sẽ gặp ở Ngày 71.
- **Giao dịch vẫn là giao dịch** (Ngày 65): JPA có \`@Transactional\`, ta học ở Ngày 72.

JPA làm bạn viết ít hơn, không làm bạn được phép hiểu ít hơn.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Thêm \`spring-boot-starter-data-jpa\` + driver, cấu hình \`application.properties\`.
2. Tạo một \`@Entity\` với \`@Id\`, và một interface \`extends JpaRepository\`.
3. Gọi \`save\`, \`findById\`, \`findAll\`, \`count\` — không viết SQL, xác nhận nó chạy.
4. Thêm \`findByTrangThai\` và \`findBySoTienGreaterThan\` chỉ bằng cách đặt tên.
5. Bật log SQL (\`spring.jpa.show-sql=true\`) và xem câu SQL Spring sinh ra cho mỗi lời gọi.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Spring Data JPA biến cả tầng dữ liệu của Giai đoạn 8 thành \`@Entity\` + một interface \`extends JpaRepository\`. CRUD có sẵn, truy vấn riêng chỉ cần đặt tên phương thức đúng quy ước, phức tạp hơn thì \`@Query\`. Bên dưới là Dynamic Proxy và phản chiếu — cơ chế bạn đã đủ sức hiểu, không phải phép màu. Nhưng SQL vẫn chạy, nên mọi bài về chỉ mục và giao dịch vẫn còn nguyên giá trị.

Đến giờ mỗi \`@Entity\` vẫn đứng một mình. Nhưng dữ liệu thật thì nối nhau: một khách có nhiều đơn, một đơn có nhiều dòng hàng. Ở Giai đoạn 8 bạn nối chúng bằng khoá ngoại và \`JOIN\` viết tay (Ngày 62). JPA làm được chuyện đó thế nào — và làm sao để một \`khach.getDonHang()\` trả về đúng danh sách đơn mà không nổ tung số lượng truy vấn?

Ngày 71: **Quan hệ trong JPA** — \`@OneToMany\`, \`@ManyToOne\`, cách JPA biến khoá ngoại thành liên kết đối tượng, và bẫy truy vấn N+1 nổi tiếng khiến một trang tưởng nhanh bỗng gọi CSDL cả trăm lần. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
