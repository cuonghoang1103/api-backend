/** "100 Ngày Java với CuongThai" — Ngày 64: ResultSet → đối tượng & mẫu DAO.
    Nối đúng chỗ Ngày 63 kết ("ResultSet còn thô, getString/getInt rải khắp
    nơi, lẫn code CSDL với code nghiệp vụ").
    Ngày 65 (giao dịch/transaction) trỏ ngược về phần kết.

    ⚠ LUẬT 6: thẻ chạy JDK thuần nên chương trình dựng lại nguyên lý (ResultSet
    giả + ánh xạ + interface DAO đổi ruột được); thân bài dạy JDBC + DAO thật.
    Mọi output là kết quả THẬT của javac/java JDK 21. */
export default {
  day: 64,
  card: 'java-day-64',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'implement-atomic-order-processing-with-transactions-and-batch-operations',
    title: 'Xử lý đơn hàng nguyên tử với giao dịch (JDBC)',
  },

  content: `🗃️ 100 NGÀY JAVA — NGÀY 64: RESULTSET → ĐỐI TƯỢNG & MẪU DAO

Hôm qua bạn kết nối được CSDL và chống được SQL injection. Nhưng cái \`ResultSet\` trả về vẫn còn thô: \`rs.getString("ma")\`, \`rs.getInt("so_tien")\` nằm rải rác khắp chương trình, code kết nối CSDL trộn lẫn với code nghiệp vụ.

Hôm nay ta dọn dẹp. Đây là bài về **cấu trúc code**, và nó sẽ trả nợ trực tiếp cho những bài học OOP của Giai đoạn 2.

━━━━━━━━━━━━━━━━━━━━

🔄 BƯỚC 1: MỘT HÀNG THÀNH MỘT ĐỐI TƯỢNG

\`ResultSet\` là một cái con trỏ chạy trên các hàng. Việc đầu tiên là biến mỗi hàng thành một đối tượng Java tử tế — thứ mà phần còn lại của chương trình đã quen làm việc cùng suốt 60 ngày.

Dùng \`record\` (Ngày 38) cho gọn:

\`\`\`java
public record DonHang(String ma, int soTien, String trangThai) {}
\`\`\`

Rồi một hàm **ánh xạ** duy nhất, biết đọc một hàng:

\`\`\`java
private DonHang anXa(ResultSet rs) throws SQLException {
    return new DonHang(
        rs.getString("ma"),
        rs.getInt("so_tien"),
        rs.getString("trang_thai"));
}
\`\`\`

\`\`\`
1) ResultSet -> doi tuong: DonHang[ma=DH-2, soTien=350000, trangThai=DA_GIAO]
\`\`\`

Điểm mấu chốt: đây là **chỗ duy nhất** trong toàn bộ chương trình biết tên các cột. Mai đổi cột \`so_tien\` thành \`tong_tien\` thì bạn sửa đúng một dòng ở đây, không phải đi lùng khắp nơi.

━━━━━━━━━━━━━━━━━━━━

🔁 BƯỚC 2: VÒNG \`next()\` — CÁI BẪY OFF-BY-ONE

Con trỏ của \`ResultSet\` bắt đầu **trước** hàng đầu tiên. \`rs.next()\` làm hai việc cùng lúc: tiến tới hàng kế, và trả về \`false\` khi hết hàng.

\`\`\`java
List<DonHang> ket = new ArrayList<>();
while (rs.next()) {
    ket.add(anXa(rs));
}
\`\`\`

\`\`\`
3) tim theo trang thai 'MOI' -> 2 don: [DH-1, DH-3]
\`\`\`

Người mới hay quên: nếu chỉ mong một dòng, vẫn phải gọi \`rs.next()\` một lần trước khi đọc — bỏ qua nó là lỗi \`ResultSet not positioned\` ngay lập tức.

Và khi không tìm thấy gì, đừng trả \`null\` (Ngày 40). Trả \`Optional\`:

\`\`\`java
return rs.next() ? Optional.of(anXa(rs)) : Optional.empty();
\`\`\`

\`\`\`
2) tim ma khong co -> Optional.empty
\`\`\`

\`Optional\` buộc người gọi phải xử lý trường hợp "không có" — thay vì quên, rồi ăn \`NullPointerException\` ba tuần sau.

━━━━━━━━━━━━━━━━━━━━

🗃️ BƯỚC 3: DAO — MỘT CHỖ CHO MỌI THỨ CHẠM CSDL

Giờ tới ý tưởng lớn của bài. **DAO** (Data Access Object) là một \`interface\` gom toàn bộ thao tác CSDL của một loại dữ liệu vào một chỗ:

\`\`\`java
public interface DonHangDAO {
    void them(DonHang d);
    Optional<DonHang> timTheoMa(String ma);
    List<DonHang> timTheoTrangThai(String trangThai);
    boolean xoa(String ma);
}
\`\`\`

Để ý interface này **không hề nhắc tới SQL, JDBC, hay \`Connection\`**. Nó chỉ nói *làm được gì*, không nói *làm bằng cách nào*. Đây đúng là bài học interface của Ngày 18, giờ áp vào việc thật.

Bản cài đặt mới giấu hết chuyện JDBC vào bên trong:

\`\`\`java
public class DonHangDaoJdbc implements DonHangDAO {
    private final Connection conn;
    public DonHangDaoJdbc(Connection conn) { this.conn = conn; }

    public List<DonHang> timTheoTrangThai(String tt) {
        String sql = "SELECT * FROM don_hang WHERE trang_thai = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {   // Ngày 63
            ps.setString(1, tt);
            try (ResultSet rs = ps.executeQuery()) {
                List<DonHang> ket = new ArrayList<>();
                while (rs.next()) ket.add(anXa(rs));
                return ket;
            }
        } catch (SQLException e) {
            throw new RuntimeException("loi truy van don theo trang thai", e);
        }
    }
    // ... them, timTheoMa, xoa tương tự
}
\`\`\`

━━━━━━━━━━━━━━━━━━━━

🔌 BƯỚC 4: PHẦN THƯỞNG — ĐỔI RUỘT KHÔNG AI HAY

Vì nghiệp vụ chỉ phụ thuộc vào \`interface\`, bạn có thể thay hoàn toàn nơi lưu trữ mà không ai bên ngoài phải sửa. Viết một bản chạy trong bộ nhớ:

\`\`\`java
public class DonHangDaoBoNho implements DonHangDAO {
    private final Map<String, DonHang> map = new LinkedHashMap<>();
    public void them(DonHang d) { map.put(d.ma(), d); }
    public Optional<DonHang> timTheoMa(String ma) {
        return Optional.ofNullable(map.get(ma));
    }
    // ...
}
\`\`\`

Cùng một hàm nghiệp vụ, chạy trên hai bản lưu trữ khác nhau:

\`\`\`
4) nghiep vu dem don chua giao -> 2
5) doi sang DAO bo nho, cung ham nghiep vu -> chua giao 1
\`\`\`

Hàm \`demChuaGiao(DonHangDAO dao)\` không biết — và không cần biết — nó đang chạy trên PostgreSQL hay trên một cái \`HashMap\`. Đây là lý do DAO đáng giá:

- **Test không cần CSDL thật.** Bản bộ nhớ chạy trong mili-giây, không cần Docker (Ngày 53).
- **Đổi CSDL là đổi một lớp.** Từ PostgreSQL sang MySQL: viết \`DonHangDaoMysql\`, phần còn lại y nguyên.
- **Code nghiệp vụ sạch.** Không một dòng SQL nào lọt ra ngoài tầng DAO.

━━━━━━━━━━━━━━━━━━━━

🧭 BA TẦNG, MỖI TẦNG MỘT VIỆC

Đến đây chương trình của bạn tự nhiên tách thành ba tầng — kiến trúc mà gần như mọi ứng dụng Java đi làm đều dùng:

\`\`\`
Tầng nghiệp vụ (Service)   "đơn chưa giao quá 3 ngày thì nhắc"
        │  gọi qua interface
Tầng truy cập (DAO)        "SELECT ... WHERE trang_thai = ?"
        │  JDBC
Cơ sở dữ liệu              bảng, khoá, chỉ mục
\`\`\`

Mỗi tầng chỉ nói chuyện với tầng ngay dưới, qua interface. Tầng nghiệp vụ không biết SQL; tầng DAO không biết luật nghiệp vụ. Sửa một tầng không làm vỡ tầng kia — đúng tinh thần bài Ngày 60.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Tạo \`record DonHang\` và hàm \`anXa(ResultSet)\` đọc một hàng.
2. Viết \`DonHangDAO\` interface với 4 phương thức như trên.
3. Cài \`DonHangDaoJdbc\` dùng \`PreparedStatement\` cho mọi truy vấn.
4. Cài \`DonHangDaoBoNho\` bằng \`HashMap\`, viết test cho nghiệp vụ mà không cần CSDL.
5. Viết một hàm nghiệp vụ nhận \`DonHangDAO\`, chạy nó trên cả hai bản.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Ánh xạ \`ResultSet\` thành đối tượng ở **một** chỗ, gom mọi thao tác CSDL vào tầng **DAO** sau một \`interface\`, và tự nhiên chương trình tách thành ba tầng sạch sẽ. Phần thưởng là code nghiệp vụ không dính một dòng SQL, test chạy được mà không cần CSDL thật, và đổi CSDL chỉ là viết thêm một lớp.

Nhưng còn một tình huống DAO một mình không giải nổi. Hãy tưởng tượng: chuyển tiền từ tài khoản A sang B. Bạn gọi \`dao.tru(A)\` — xong. Rồi gọi \`dao.cong(B)\` — và ngay lúc đó mất điện.

Tiền đã trừ của A. Chưa cộng cho B. Nó **bốc hơi**.

Ngày 65: **Giao dịch (Transaction)** — cách bắt nhiều thao tác phải "cùng thành công, hoặc cùng như chưa từng xảy ra", \`commit\` và \`rollback\`, và vì sao \`setAutoCommit(false)\` là dòng code cứu những hệ thống có dính tới tiền. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
