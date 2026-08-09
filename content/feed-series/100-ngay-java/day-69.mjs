/** "100 Ngày Java với CuongThai" — Ngày 69: Nhận dữ liệu vào.
    Nối đúng chỗ Ngày 68 kết ("API mới biết ĐƯA dữ liệu ra, còn khi client muốn
    GỬI vào thì sao? @PathVariable một mình không đủ").
    Ngày 70 (Spring Data JPA) trỏ ngược về phần kết.

    ⚠ LUẬT 6: thẻ chạy JDK thuần nên chương trình dựng lại nguyên lý tách query
    + parse JSON + kiểm tra; thân bài dạy @RequestParam/@RequestBody/@Valid
    thật. Output là kết quả THẬT của javac/java JDK 21. */
export default {
  day: 69,
  card: 'java-day-69',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'build-a-type-safe-configuration-file-parser',
    title: 'Bộ phân tích cấu hình an toàn kiểu (parse + kiểm tra)',
  },

  content: `📥 100 NGÀY JAVA — NGÀY 69: NHẬN DỮ LIỆU VÀO

API hôm qua mới chỉ biết **đưa** dữ liệu ra. Nhưng người dùng còn muốn **gửi** dữ liệu vào: tạo một đơn hàng mới kèm cả thân JSON, thêm tham số lọc và phân trang. \`@PathVariable\` một mình không đủ.

Hôm nay học ba cửa dữ liệu đi vào — và một bài học sẽ theo bạn suốt sự nghiệp: đừng bao giờ tin client.

━━━━━━━━━━━━━━━━━━━━

🚪 BA NGUỒN DỮ LIỆU, BA MỤC ĐÍCH

Một request HTTP mang dữ liệu vào theo ba đường, mỗi đường một việc:

\`\`\`
GET /don/{ma}         -> @PathVariable   (định danh: đơn NÀO)
GET /don?trangThai=MOI -> @RequestParam  (lọc, tìm, phân trang)
POST /don  body {...}  -> @RequestBody    (dữ liệu tạo/sửa)
\`\`\`

Chọn đúng nguồn làm API tự rõ nghĩa. \`@PathVariable\` (Ngày 68) đã biết rồi; hôm nay thêm hai cái còn lại.

━━━━━━━━━━━━━━━━━━━━

🔗 @RequestParam: THAM SỐ TRÊN URL

Phần sau dấu \`?\` trên URL là các tham số truy vấn — dùng cho những thứ *không định danh* tài nguyên: lọc, sắp xếp, phân trang.

\`\`\`java
@GetMapping("/don")
public List<DonHang> danhSach(
        @RequestParam(required = false) String trangThai,
        @RequestParam(defaultValue = "1") int trang,
        @RequestParam(defaultValue = "20") int co) {
    return dichVu.tim(trangThai, trang, co);
}
\`\`\`

Gọi \`GET /don?trangThai=MOI&trang=2\` thì Spring tách chuỗi truy vấn, ép kiểu, gán vào tham số:

\`\`\`
1) query '?trangThai=MOI&trang=2' -> {trangThai=MOI, trang=2}
2) @RequestParam trang(md=1)=2, co(md=20, thieu)=20
\`\`\`

\`defaultValue\` là chi tiết đáng giá: client không gửi \`co\` thì tự lấy 20, không nổ. Còn \`required = false\` cho phép vắng mặt hẳn. Đây là cách bạn làm **phân trang** — thứ mọi API danh sách đều cần, để không lỡ trả về một triệu dòng trong một lần.

━━━━━━━━━━━━━━━━━━━━

📥 @RequestBody: CẢ THÂN JSON THÀNH ĐỐI TƯỢNG

Khi tạo hay sửa, dữ liệu đi trong **thân** request dưới dạng JSON. \`@RequestBody\` biến cả thân đó thành một đối tượng Java:

\`\`\`java
@PostMapping("/don")
public DonHang tao(@RequestBody DonHang moi) {
    return dichVu.luu(moi);
}
\`\`\`

Client gửi lên:

\`\`\`bash
curl -X POST http://localhost:8080/don \\
  -H "Content-Type: application/json" \\
  -d '{"ma":"DH-9","soTien":500000,"trangThai":"MOI"}'
\`\`\`

Và Spring (Jackson) phân tích JSON thành một \`DonHang\` hoàn chỉnh:

\`\`\`
3) @RequestBody hop le -> DonHang[ma=DH-9, soTien=500000, trangThai=MOI]
4) ep kieu chuoi "350000" -> DonHang[ma=DH-8, soTien=350000, trangThai=MOI]
\`\`\`

Đây đúng là **đảo ngược** của Ngày 68: hôm qua đối tượng → JSON để trả ra, hôm nay JSON → đối tượng khi nhận vào. Cùng một Jackson, hai chiều. Nó còn tự ép kiểu: chuỗi \`"350000"\` thành \`int 350000\` theo đúng kiểu của trường.

━━━━━━━━━━━━━━━━━━━━

🛂 BÀI HỌC LỚN: ĐỪNG TIN CLIENT

Đây là phần quan trọng nhất của bài, và là thứ phân biệt một API đồ chơi với một API dùng được.

**Mọi thứ đến từ client đều đáng nghi** — cho tới khi bạn kiểm tra. Người dùng có thể gõ nhầm, ứng dụng có thể có bug, và kẻ xấu thì cố tình gửi rác để tìm lỗ hổng. Nhắc lại Ngày 63: dữ liệu từ ngoài không bao giờ được tin sẵn.

\`\`\`
5) thieu 'ma' -> 400: thieu truong 'ma'
6) soTien am -> 400: 'soTien' khong duoc am
\`\`\`

Thiếu trường bắt buộc, số tiền âm, chuỗi quá dài, email sai định dạng — tất cả phải bị chặn **ngay ở cửa**, trước khi chạm tới nghiệp vụ hay CSDL. Và trả đúng mã: dữ liệu sai là **lỗi của client (400)**, không phải lỗi server (500).

━━━━━━━━━━━━━━━━━━━━

✅ @Valid: KIỂM TRA KHAI BÁO, KHÔNG VIẾT TAY

Viết tay từng câu \`if (x == null) ...\` cho mọi trường thì rối và dễ sót. Spring cho bạn khai luật kiểm tra ngay trên chính đối tượng, bằng Bean Validation:

\`\`\`java
public record DonHangMoi(
    @NotBlank String ma,
    @Positive int soTien,
    @Size(max = 20) String trangThai
) {}

@PostMapping("/don")
public DonHang tao(@Valid @RequestBody DonHangMoi moi) {   // @Valid bật kiểm tra
    return dichVu.luu(moi);
}
\`\`\`

\`@NotBlank\`, \`@Positive\`, \`@Size\`, \`@Email\`... là các luật đặt thẳng lên trường. Khi có \`@Valid\`, Spring tự kiểm trước khi gọi phương thức; sai thì trả \`400\` kèm mô tả, phương thức của bạn thậm chí không chạy. Luật kiểm tra nằm cạnh dữ liệu, đọc là hiểu.

Cần thêm phụ thuộc \`spring-boot-starter-validation\` (một dòng starter, Ngày 67).

━━━━━━━━━━━━━━━━━━━━

🧩 MỘT LƯU Ý: OBJECT VÀO ≠ OBJECT RA

Một thói quen tốt nên biết sớm: đối tượng *nhận vào* thường không nên trùng đối tượng *lưu trong CSDL*. Client gửi \`DonHangMoi\` (chỉ có mã, số tiền); bên trong bạn mới tạo \`DonHang\` đầy đủ (thêm ngày tạo, trạng thái mặc định, id tự sinh).

Vì sao? Nếu client gửi thẳng vào đối tượng CSDL, họ có thể gán cả những trường không được phép — ví dụ tự đặt \`id\`, tự đặt \`trạng_thái = 'DA_THANH_TOAN'\`. Tách hai loại đối tượng (thường gọi là DTO — Data Transfer Object) chặn đúng loại lỗ hổng đó. Chưa cần làm ngay hôm nay, nhưng nhớ để dành.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Thêm \`@RequestParam\` phân trang (\`trang\`, \`co\`) có \`defaultValue\` cho một endpoint danh sách.
2. Viết \`@PostMapping\` dùng \`@RequestBody\`, thử tạo đơn bằng \`curl -X POST -d '{...}'\`.
3. Gửi JSON thiếu trường bắt buộc — quan sát phản hồi.
4. Thêm \`@NotBlank\`, \`@Positive\` + \`@Valid\`, xác nhận nó trả 400 với mô tả lỗi.
5. Tạo một \`record\` DTO riêng cho dữ liệu vào, khác đối tượng lưu trữ.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Dữ liệu vào một API đi qua ba cửa: \`@PathVariable\` định danh tài nguyên, \`@RequestParam\` cho lọc/phân trang, \`@RequestBody\` cho cả thân JSON khi tạo/sửa. Jackson tự phân tích JSON thành đối tượng. Nhưng luật vàng là **không tin client**: kiểm mọi thứ gửi lên bằng \`@Valid\` + Bean Validation, trả \`400\` khi sai, và tách đối tượng-nhận-vào khỏi đối tượng-lưu-trữ.

Đến đây API của bạn nhận và trả dữ liệu ngon lành. Nhưng nhìn lại tầng dưới: để lưu một đơn hàng, bạn vẫn đang tự viết \`PreparedStatement\`, \`setString\`, \`executeQuery\`, ánh xạ \`ResultSet\` bằng tay như Giai đoạn 8. Cả trăm dòng cho bốn thao tác CRUD của mỗi bảng.

Ngày 70: **Spring Data JPA** — bạn khai một \`interface\` rỗng, và Spring **tự sinh** toàn bộ code CRUD lúc chạy. \`findById\`, \`save\`, \`delete\`, thậm chí \`findByTrangThai\` — không viết một dòng SQL. Đây là lúc mọi thứ về CSDL của Giai đoạn 8 gập lại thành vài dòng. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
