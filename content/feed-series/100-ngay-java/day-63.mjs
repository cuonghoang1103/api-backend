/** "100 Ngày Java với CuongThai" — Ngày 63: JDBC & SQL injection.
    Nối đúng chỗ Ngày 62 kết ("bạn viết được SQL nhưng gõ trong psql — Java vẫn
    đứng ngoài; và ngay trong bài JDBC là lỗ hổng xoá được cả bảng").
    Ngày 64 (ResultSet → đối tượng + DAO) trỏ ngược về phần kết.

    ⚠ LUẬT 6: thẻ chạy JDK thuần (không driver JDBC) nên chương trình dựng lại
    nguyên lý nối chuỗi vs tham số; thân bài dạy JDBC thật. Ba câu tiêm ĐÃ CHẠY
    THẬT trên PostgreSQL 15.4 gửi từng câu bằng psql -c y như Statement:
      ' OR '1'='1' --            -> 2 rows (đăng nhập được)
      '; DROP TABLE nguoi_dung;  -> DROP TABLE, bảng biến mất thật. */
export default {
  day: 63,
  card: 'java-day-63',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'implement-a-transactional-batch-processor-with-manual-commit-control',
    title: 'Bộ xử lý lô có kiểm soát commit thủ công (JDBC)',
  },

  content: `💉 100 NGÀY JAVA — NGÀY 63: JDBC & SQL INJECTION

Hai ngày qua bạn viết SQL, nhưng gõ trong \`psql\`. Java vẫn đứng ngoài nhìn.

Hôm nay ta bắc cây cầu — và ngay trên cây cầu đó là cái bẫy đã đánh sập vô số website: một người dùng gõ vào ô đăng nhập, và **cả bảng của bạn biến mất**.

Đây có lẽ là bài quan trọng nhất của cả Giai đoạn 8. Đọc kỹ.

━━━━━━━━━━━━━━━━━━━━

🔌 JDBC: BỘ CHUYỂN ĐỔI CHUẨN

JDBC (Java Database Connectivity) là bộ \`interface\` chuẩn để Java nói chuyện với **bất kỳ** CSDL nào. Mỗi CSDL cung cấp một *driver* — lớp cài đặt cụ thể cho những interface đó. Nhớ lại bài Ngày 18: code của bạn phụ thuộc vào interface, đổi CSDL chỉ là đổi driver.

Khai driver vào \`pom.xml\` (Ngày 56):

\`\`\`xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <version>42.7.3</version>
</dependency>
\`\`\`

Kết nối và chạy một truy vấn:

\`\`\`java
String url = "jdbc:postgresql://localhost:5432/hoc_sql";
try (Connection conn = DriverManager.getConnection(url, "postgres", matKhau);
     Statement st = conn.createStatement();
     ResultSet rs = st.executeQuery("SELECT count(*) FROM don_hang")) {
    if (rs.next()) System.out.println("So don: " + rs.getInt(1));
}
\`\`\`

Ba interface cốt lõi: \`Connection\` (một phiên nối tới CSDL), \`Statement\` (một câu lệnh), \`ResultSet\` (bảng kết quả trả về). Cả ba đều là tài nguyên phải đóng — nên nằm trong \`try-with-resources\` của Ngày 23. Ta sẽ quay lại chỗ này.

━━━━━━━━━━━━━━━━━━━━

🚪 CÁI BẪY: NỐI CHUỖI

Giờ tới màn đăng nhập. Cách viết mà ai cũng nghĩ ra đầu tiên:

\`\`\`java
String sql = "SELECT * FROM nguoi_dung WHERE ten='" + ten + "' AND mk='" + mk + "'";
\`\`\`

Người dùng thật gõ sai mật khẩu thì không vào được — đúng như mong đợi:

\`\`\`
1) go sai mat khau -> tim thay 0 nguoi dung
\`\`\`

Nhưng bây giờ kẻ tấn công gõ vào **ô tên đăng nhập** đúng chuỗi này:

\`\`\`
' OR '1'='1' --
\`\`\`

Câu lệnh của bạn biến thành:

\`\`\`sql
SELECT * FROM nguoi_dung WHERE ten='' OR '1'='1' --' AND mk='sai_bet'
\`\`\`

Chạy trên PostgreSQL thật:

\`\`\`
 ten  |      mk
------+--------------
 an   | matkhau_that
 binh | abc123
(2 rows)
\`\`\`

\`\`\`
2) go [' OR '1'='1' --] -> tim thay 2 nguoi dung, dang nhap thanh an
\`\`\`

**Đăng nhập thành công mà không cần mật khẩu.** Hai chuyện xảy ra cùng lúc: \`OR '1'='1'\` luôn đúng nên điều kiện khớp mọi dòng; còn \`--\` mở đầu một dòng chú thích, khiến CSDL **vứt bỏ toàn bộ phần còn lại** — kể cả đoạn kiểm mật khẩu.

Vì sao được? Vì chuỗi người dùng gõ đã **thôi là dữ liệu và trở thành cú pháp**. Đó là toàn bộ bản chất của SQL injection.

━━━━━━━━━━━━━━━━━━━━

💣 TỆ HƠN: XOÁ SẠCH BẢNG

Dấu \`;\` ngăn cách hai câu lệnh. Kẻ tấn công gõ vào ô tên:

\`\`\`
'; DROP TABLE nguoi_dung; --
\`\`\`

Trên PostgreSQL thật, kết quả là:

\`\`\`
DROP TABLE
ERROR:  relation "nguoi_dung" does not exist
\`\`\`

\`\`\`
3) go ['; DROP TABLE ...] -> bi cat thanh 2 cau, cau 2 = DROP TABLE nguoi_dung
\`\`\`

Bảng người dùng **bị xoá thật**. Câu lệnh đếm ngay sau đó báo bảng không còn tồn tại. Không có nút hoàn tác, không ai hỏi lại bạn "có chắc không".

Đây không phải chuyện lý thuyết. Nó nằm hạng nhất trong danh sách lỗ hổng web suốt hai thập kỷ, và vẫn đang làm sập các trang thật hôm nay — gần như luôn luôn vì đúng một dòng nối chuỗi như trên.

━━━━━━━━━━━━━━━━━━━━

🔒 CÁCH CHỮA: \`PreparedStatement\`

Lời giải **không phải** là ngồi lọc dấu nháy, chặn chữ \`DROP\`, hay "làm sạch" chuỗi nhập. Cách đó luôn sót, và bạn sẽ thua trong cuộc đua vô tận với kẻ tấn công.

Lời giải là tách hẳn *câu lệnh* khỏi *dữ liệu*:

\`\`\`java
String sql = "SELECT * FROM nguoi_dung WHERE ten=? AND mk=?";
try (PreparedStatement ps = conn.prepareStatement(sql)) {
    ps.setString(1, ten);     // chỉ số bắt đầu từ 1, không phải 0
    ps.setString(2, mk);
    try (ResultSet rs = ps.executeQuery()) {
        return rs.next();     // có dòng nào khớp không
    }
}
\`\`\`

Cùng cái chuỗi độc ở trên, giờ đi đường tham số:

\`\`\`
5) cung chuoi doc do, nhung la THAM SO -> tim thay 0 nguoi dung
\`\`\`

Không vào được nữa. Vì sao? \`prepareStatement(sql)\` **gửi cấu trúc câu lệnh cho CSDL trước** — với những chỗ trống \`?\` chưa biết giá trị. CSDL phân tích và chốt cứng cấu trúc đó ngay lúc này. Đến khi \`setString\` đưa giá trị vào, nó chỉ được nhét vào ô trống **như một giá trị nguyên khối**, không bao giờ được đọc lại như cú pháp.

Kẻ tấn công có gõ \`' OR '1'='1\` thì đó chỉ là... một cái tên đăng nhập kỳ quặc mà không ai có. Tìm không ra, trả về rỗng.

━━━━━━━━━━━━━━━━━━━━

📌 LUẬT KHÔNG CÓ NGOẠI LỆ

Mọi giá trị đến từ bên ngoài — ô nhập, tham số URL, header, file tải lên — đều đi bằng \`?\`. **Không có ngoại lệ.**

Kể cả khi bạn "chắc chắn nó chỉ là số". Vì bạn không kiểm soát cái người dùng gõ; bạn chỉ kiểm soát cách mình xử lý nó. Còn khi bạn nối chuỗi thứ mình *tưởng* là số, đó chính là lúc lỗ hổng xuất hiện.

Ngoại lệ duy nhất là **tên bảng / tên cột** — chúng không nhét qua \`?\` được (chỉ giá trị mới được). Nếu bắt buộc phải ghép tên bảng động, hãy đối chiếu với một **danh sách trắng** cố định trong code, đừng bao giờ lấy thẳng từ người dùng.

━━━━━━━━━━━━━━━━━━━━

🧹 ĐÓNG TÀI NGUYÊN — VÀ ĐÚNG THỨ TỰ

Mỗi \`Connection\` là một tài nguyên đắt đỏ và có hạn. Quên đóng là **rò rỉ kết nối**: chạy êm vài giờ rồi bỗng nhiên mọi request treo cứng vì hết chỗ nối. Đây là một trong những sự cố production kinh điển nhất.

\`try-with-resources\` (Ngày 23) lo hộ, kể cả khi có exception:

\`\`\`java
try (Connection c = DriverManager.getConnection(url, user, pw);
     PreparedStatement p = c.prepareStatement(sql);
     ResultSet r = p.executeQuery()) {
    // dùng r
}   // đóng tự động, THEO THỨ TỰ NGƯỢC
\`\`\`

\`\`\`
6) try-with-resources tu dong dong: [ResultSet, PreparedStatement, Connection]
\`\`\`

Để ý thứ tự đóng: \`ResultSet\` → \`PreparedStatement\` → \`Connection\`. Ngược với thứ tự mở, và đó là đúng — cái mở sau (phụ thuộc vào cái trước) phải đóng trước. JVM tự lo trật tự này, bạn chỉ cần khai đúng thứ tự mở.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Nối JDBC tới PostgreSQL, chạy \`SELECT count(*)\` và in kết quả.
2. Viết hàm đăng nhập kiểu **nối chuỗi**, tự tay gõ \`' OR '1'='1' --\` cho nó lọt.
3. Viết lại bằng \`PreparedStatement\`, thử lại chuỗi đó — xem nó vô hại.
4. Bọc mọi thứ trong \`try-with-resources\`, cố tình ném lỗi và xác nhận kết nối vẫn đóng.
5. Đọc thử OWASP về SQL injection — nó vẫn ở top lỗ hổng web sau 20 năm.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

JDBC nối Java với CSDL qua ba interface \`Connection\` / \`Statement\` / \`ResultSet\`. Nhưng bài học sống còn là: **nối chuỗi để dựng câu SQL là một lỗ hổng bảo mật, không phải một lựa chọn phong cách.** \`PreparedStatement\` với \`?\` gửi cấu trúc câu lệnh đi trước, nên dữ liệu người dùng vĩnh viễn không thể biến thành cú pháp — và tiện thể, nó thường nhanh hơn vì CSDL biên dịch câu lệnh một lần dùng nhiều lần.

Giờ bạn kết nối được, chạy lệnh được, chống tiêm được. Nhưng cái \`ResultSet\` trả về vẫn còn thô: bạn đang phải gọi \`rs.getString("ten")\`, \`rs.getInt("so_tien")\` rải rác khắp nơi, lẫn lộn code kết nối CSDL với code nghiệp vụ.

Ngày 64: **ResultSet → đối tượng & mẫu DAO** — cách biến từng dòng kết quả thành một đối tượng Java gọn gàng, và gom toàn bộ code chạm CSDL vào một chỗ để phần còn lại của chương trình không cần biết dữ liệu đến từ đâu. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
