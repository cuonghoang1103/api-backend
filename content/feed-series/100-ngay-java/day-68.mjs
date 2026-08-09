/** "100 Ngày Java với CuongThai" — Ngày 68: REST API đầu tiên.
    Nối đúng chỗ Ngày 67 kết ("cỗ máy đã nổ nhưng chưa chở ai — web server chạy
    mà chưa trả lời địa chỉ nào").
    Ngày 69 (nhận dữ liệu vào: @RequestBody/@PathVariable/@RequestParam) trỏ
    ngược về phần kết.

    ⚠ LUẬT 6: Spring MVC là framework ngoài, thẻ chạy JDK thuần nên chương trình
    dựng lại nguyên lý bảng tuyến + JSON; thân bài dạy @RestController thật.
    Output là kết quả THẬT của javac/java JDK 21. */
export default {
  day: 68,
  card: 'java-day-68',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'capstone-build-an-encapsulated-inventory',
    title: 'Mô hình hoá kho hàng đóng gói (tài nguyên cho REST)',
  },

  content: `🌐 100 NGÀY JAVA — NGÀY 68: REST API ĐẦU TIÊN

Hôm qua bạn có một cỗ máy Spring Boot đã nổ: container tạo bean, Tomcat nhúng chạy. Nhưng nó chưa chở ai — một web server đang sống mà chưa trả lời một địa chỉ nào thì cũng chưa để làm gì.

Hôm nay ta cho nó trả lời. Kết thúc bài này, bạn có một API gọi được bằng trình duyệt, trả về JSON, trong khoảng hai mươi dòng.

━━━━━━━━━━━━━━━━━━━━

🤔 REST LÀ GÌ, NÓI CHO GỌN

Trước khi code, một phút khái niệm. Web bạn duyệt hằng ngày trả về **trang HTML** để người đọc. Nhưng khi một ứng dụng điện thoại hay một trang React cần dữ liệu, nó không muốn HTML — nó muốn **dữ liệu thuần** để tự vẽ giao diện.

**REST API** là kiểu web server trả về *dữ liệu* (thường là JSON) thay vì trang. Nó dựa trên một quy ước đơn giản và rất nhất quán:

- Mỗi **thứ** có một địa chỉ: đơn hàng nằm ở \`/don\`, đơn số DH-2 nằm ở \`/don/DH-2\`.
- **Động từ HTTP** nói bạn muốn làm gì với thứ đó: \`GET\` để đọc, \`POST\` để tạo, \`PUT\` để sửa, \`DELETE\` để xoá.

Cùng một địa chỉ \`/don\`, \`GET\` là "cho tôi xem danh sách", \`POST\` là "tạo đơn mới". Địa chỉ chỉ *cái gì*, động từ chỉ *hành động*.

━━━━━━━━━━━━━━━━━━━━

🗺️ CONTROLLER: HÀM JAVA THÀNH ĐỊA CHỈ WEB

Đây là toàn bộ một API đọc được, không lược bớt dòng nào:

\`\`\`java
@RestController
public class DonController {

    private final DichVuDonHang dichVu;

    public DonController(DichVuDonHang dichVu) {   // DI của Ngày 67
        this.dichVu = dichVu;
    }

    @GetMapping("/don")
    public List<DonHang> danhSach() {
        return dichVu.timTatCa();
    }

    @GetMapping("/don/{ma}")
    public DonHang xem(@PathVariable String ma) {
        return dichVu.timTheoMa(ma);
    }
}
\`\`\`

Đọc từng nhãn:
- \`@RestController\` — nói với Spring "lớp này chứa các điểm cuối REST, thứ chúng trả về là dữ liệu".
- \`@GetMapping("/don/{ma}")\` — nối phương thức Java này với \`GET /don/<gì đó>\`.
- \`@PathVariable String ma\` — lấy phần \`<gì đó>\` trong đường dẫn nhét vào tham số \`ma\`.

Bên dưới, Spring giữ một **bảng tuyến**: mỗi cặp *(động từ + mẫu đường dẫn)* trỏ tới một phương thức. Khi một request tới, nó dò bảng tìm mẫu khớp, rút biến đường dẫn, rồi gọi hàm của bạn. Container tí hon chạy thật cho thấy đúng cơ chế đó:

\`\`\`
1) dang ky 3 route: GET /don, GET /don/{ma}, POST /don
2) GET /don/DH-2 -> khop 'GET /don/{ma}', HTTP 200
\`\`\`

Để ý \`GET /don/DH-2\` khớp mẫu \`GET /don/{ma}\` và rút ra \`ma = DH-2\` — đúng thứ \`@PathVariable\` làm.

━━━━━━━━━━━━━━━━━━━━

📦 TRẢ VỀ OBJECT, NHẬN VỀ JSON

Đây là chỗ Spring làm bạn bất ngờ lần đầu. Phương thức \`xem\` trả về một \`DonHang\` — một đối tượng Java. Nhưng client nhận được:

\`\`\`
3) than JSON tra ve: {"ma":"DH-2","soTien":350000,"trangThai":"DA_GIAO"}
\`\`\`

Bạn **không** tự nối chuỗi JSON. Spring dùng thư viện Jackson tự động chuyển đối tượng thành JSON (và ngược lại). Trả về \`record\`, \`List\`, \`Map\` — tất cả tự thành JSON đúng cấu trúc.

Đây là lý do REST + Java hợp nhau: bạn làm việc với đối tượng như suốt 67 ngày qua, việc biến đổi qua lại với JSON là chuyện của framework.

━━━━━━━━━━━━━━━━━━━━

🚦 MÃ TRẠNG THÁI: TRẢ LỜI TRƯỚC CẢ KHI ĐỌC THÂN

Mỗi phản hồi HTTP mang một **mã trạng thái** ba chữ số. Client đọc nó để biết chuyện gì xảy ra trước cả khi ngó vào thân:

\`\`\`
4) GET /don/DH-404 -> khong co don -> HTTP 404
5) DELETE /don/DH-1 -> khong route nao khop -> HTTP 404
6) POST /don -> tao moi -> HTTP 201, kho co 3 don
\`\`\`

Những mã đáng thuộc, gom theo nhóm:

- **2xx thành công:** \`200 OK\`, \`201 Created\` (vừa tạo xong), \`204 No Content\` (xong, không có gì trả).
- **4xx lỗi phía client:** \`400 Bad Request\` (dữ liệu gửi sai), \`401\`/\`403\` (chưa/không có quyền), \`404 Not Found\`.
- **5xx lỗi phía server:** \`500 Internal Server Error\` (code bạn ném exception).

Nhóm chữ số đầu là điều quan trọng nhất: 2 là ổn, 4 là "bạn gửi sai", 5 là "tôi hỏng". Trả đúng mã là phép lịch sự tối thiểu với người dùng API của bạn.

Trong Spring, muốn kiểm soát mã trạng thái thì trả \`ResponseEntity\`:

\`\`\`java
@GetMapping("/don/{ma}")
public ResponseEntity<DonHang> xem(@PathVariable String ma) {
    DonHang d = dichVu.timTheoMa(ma);
    return d == null
        ? ResponseEntity.notFound().build()          // 404
        : ResponseEntity.ok(d);                       // 200
}

@PostMapping("/don")
public ResponseEntity<DonHang> tao(@RequestBody DonHang moi) {
    return ResponseEntity.status(201).body(dichVu.luu(moi));   // 201
}
\`\`\`

━━━━━━━━━━━━━━━━━━━━

🧪 THỬ NGAY, KHÔNG CẦN VIẾT GIAO DIỆN

Cái hay của REST là bạn thử được ngay bằng công cụ dòng lệnh:

\`\`\`bash
curl http://localhost:8080/don           # danh sách
curl http://localhost:8080/don/DH-2       # một đơn
curl -i http://localhost:8080/don/DH-404  # -i để thấy cả mã trạng thái
\`\`\`

\`GET\` thì gõ thẳng vào trình duyệt cũng ra JSON. Đây là lý do bạn tách được backend và frontend: API chạy và test độc lập, giao diện lắp sau.

━━━━━━━━━━━━━━━━━━━━

📐 MỘT VÀI QUY ƯỚC ĐẶT ĐỊA CHỈ

REST có quy ước đặt tên khá thống nhất, theo là code của bạn dễ đoán với người khác:

- Dùng **danh từ số nhiều** cho tài nguyên: \`/don-hang\`, \`/khach-hang\` — không phải \`/layDonHang\`.
- Để **động từ HTTP** mang hành động, đừng nhét vào đường dẫn: \`DELETE /don/DH-2\`, không phải \`GET /xoaDon?ma=DH-2\`.
- Lồng nhau thể hiện quan hệ: \`/khach/K-1/don\` = "các đơn của khách K-1".

Một đường dẫn tốt tự mô tả nó làm gì — người khác đọc là hiểu, không cần tài liệu.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Tạo \`@RestController\` với \`@GetMapping("/xin-chao")\` trả về chuỗi, chạy thử bằng trình duyệt.
2. Thêm \`@GetMapping("/don/{ma}")\` dùng \`@PathVariable\`, trả về một \`record\` — xem nó thành JSON.
3. Trả \`ResponseEntity\` để phân biệt 200 và 404 khi không tìm thấy.
4. Thêm \`@PostMapping\` trả 201, thử bằng \`curl -X POST\`.
5. Dùng \`curl -i\` quan sát mã trạng thái của cả trường hợp đúng lẫn sai.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

REST API trả **dữ liệu** thay vì trang: mỗi tài nguyên một đường dẫn, mỗi động từ HTTP một hành động. Trong Spring, \`@RestController\` + \`@GetMapping\` biến một phương thức Java thành một địa chỉ web, \`@PathVariable\` rút biến từ đường dẫn, đối tượng trả về tự thành JSON nhờ Jackson, và mã trạng thái nói cho client biết kết quả. Hai mươi dòng, một API chạy được.

Nhưng để ý API hôm nay chỉ mới biết **đưa** dữ liệu ra. Còn khi người dùng muốn **gửi** dữ liệu vào — tạo một đơn hàng mới, kèm cả một thân JSON, thêm mấy tham số lọc và tìm kiếm — thì sao? \`@PathVariable\` một mình không đủ.

Ngày 69: **Nhận dữ liệu vào** — \`@RequestBody\` để đọc cả một thân JSON thành đối tượng, \`@RequestParam\` cho tham số lọc/phân trang trên URL, và vì sao mọi thứ client gửi lên đều phải bị nghi ngờ cho tới khi kiểm tra. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
