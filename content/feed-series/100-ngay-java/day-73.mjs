/** "100 Ngày Java với CuongThai" — Ngày 73: Xử lý lỗi gọn gàng.
    Nối đúng chỗ Ngày 72 kết ("mỗi chỗ ném một kiểu exception, client nhận 500
    xấu xí kèm stack trace, vừa khó dùng vừa lộ thông tin nội bộ").
    Ngày 74 (cấu hình & hồ sơ) trỏ ngược về phần kết.

    ⚠ LUẬT 6: thẻ chạy JDK thuần nên chương trình dựng lại nguyên lý sổ tra cứu
    exception→phản hồi + khớp lớp cha; thân bài dạy @ControllerAdvice/
    @ExceptionHandler thật. Output là kết quả THẬT của javac/java JDK 21. */
export default {
  day: 73,
  card: 'java-day-73',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'generic-configuration-file-validator',
    title: 'Bộ kiểm tra cấu hình (ném lỗi có ý nghĩa)',
  },

  content: `🧯 100 NGÀY JAVA — NGÀY 73: XỬ LÝ LỖI GỌN GÀNG

Ứng dụng của bạn giờ nhận request, kiểm dữ liệu, chạy nghiệp vụ trong giao dịch, lưu CSDL. Nhưng khi có lỗi thì sao?

Hiện tại: mỗi chỗ ném một kiểu exception, và client nhận về một trang \`500 Internal Server Error\` xấu xí kèm cả stack trace. Vừa khó dùng cho người gọi API, vừa **lộ cấu trúc bên trong** của bạn cho bất kỳ ai.

Hôm nay dọn sạch chuyện đó — và cách làm gọn đến mức gần như không tốn dòng nào.

━━━━━━━━━━━━━━━━━━━━

🚨 VÌ SAO LỖI THÔ LÀ MỘT VẤN ĐỀ

Xem chuyện gì xảy ra khi một exception lọt ra ngoài không được xử lý:

\`\`\`
1) khong advice: client nhan 500, than lo: KhongTimThay: khong co don DH-404
\`\`\`

Ba cái sai cùng lúc:

- **Sai mã trạng thái.** "Không tìm thấy đơn" rõ ràng là \`404\`, nhưng client nhận \`500\` — làm họ tưởng server hỏng.
- **Lộ thông tin nội bộ.** Stack trace phơi ra tên lớp, tên package, thậm chí dòng code — món quà cho kẻ tấn công (nhớ Ngày 63).
- **Khó dùng.** Ứng dụng gọi API không thể phân biệt "dữ liệu tôi gửi sai" với "server bạn hỏng" nếu mọi lỗi đều là 500.

━━━━━━━━━━━━━━━━━━━━

💥 BƯỚC 1: NÉM EXCEPTION CÓ Ý NGHĨA

Trước khi xử lý lỗi, phải có lỗi *đáng xử lý*. Đừng ném \`RuntimeException\` chung chung; tạo exception mang ý nghĩa nghiệp vụ:

\`\`\`java
public class KhongTimThayException extends RuntimeException {
    public KhongTimThayException(String msg) { super(msg); }
}

public class DuLieuSaiException extends RuntimeException {
    public DuLieuSaiException(String msg) { super(msg); }
}
\`\`\`

Rồi service ném chúng một cách tự nhiên, không cần \`try/catch\`:

\`\`\`java
public DonHang timTheoMa(String ma) {
    return khoDon.findById(ma)
        .orElseThrow(() -> new KhongTimThayException("khong co don " + ma));
}
\`\`\`

Cách này giữ service sạch: nó chỉ nói "không tìm thấy", không cần biết điều đó dịch ra mã HTTP nào. Việc dịch để chỗ khác lo.

━━━━━━━━━━━━━━━━━━━━

🧯 BƯỚC 2: @ControllerAdvice — MỘT CHỖ CHO MỌI LỖI

Đây là mấu chốt. Thay vì \`try/catch\` trong từng controller, bạn khai một lớp duy nhất bắt mọi lỗi cho toàn ứng dụng:

\`\`\`java
@RestControllerAdvice
public class BoXuLyLoi {

    @ExceptionHandler(KhongTimThayException.class)
    public ResponseEntity<?> xuLy(KhongTimThayException e) {
        return ResponseEntity.status(404).body(Map.of("loi", e.getMessage()));
    }

    @ExceptionHandler(DuLieuSaiException.class)
    public ResponseEntity<?> xuLy(DuLieuSaiException e) {
        return ResponseEntity.status(400).body(Map.of("loi", e.getMessage()));
    }
}
\`\`\`

\`@RestControllerAdvice\` nói với Spring "lớp này xử lý exception cho **mọi** controller". Mỗi \`@ExceptionHandler\` khai "gặp loại lỗi này thì trả phản hồi này". Kết quả:

\`\`\`
2) @ControllerAdvice: KhongTimThay->404, DuLieuSai->400
3) nem KhongTimThay -> HTTP 404 {"loi":"khong co don DH-404"}
4) nem DuLieuSai -> HTTP 400 {"loi":"soTien khong duoc am"}
\`\`\`

Client giờ nhận JSON sạch với đúng mã trạng thái. Controller ném lỗi tự nhiên, không một dòng \`try/catch\` — bộ xử lý trung tâm lo hết.

━━━━━━━━━━━━━━━━━━━━

🧬 BƯỚC 3: KHỚP THEO LỚP CHA — ĐA HÌNH LẠI XUẤT HIỆN

Điểm tinh tế đáng giá. Một \`@ExceptionHandler\` cho lớp cha bắt luôn **mọi lớp con** của nó:

\`\`\`java
public class ThieuTruongException extends DuLieuSaiException { ... }
\`\`\`

\`\`\`
6) ThieuTruong (con cua DuLieuSai) -> HTTP 400 (khop theo lop cha)
\`\`\`

Ném \`ThieuTruongException\` mà không có handler riêng cho nó → Spring đi ngược chuỗi lớp cha, tìm thấy handler của \`DuLieuSaiException\`, dùng luôn. Đây chính là **đa hình** của Ngày 16, áp vào xử lý lỗi: bắt lớp cha là bắt được cả họ.

Nhờ đó bạn đặt được một **lưới cuối cùng** cho mọi lỗi chưa lường trước:

\`\`\`java
@ExceptionHandler(Exception.class)
public ResponseEntity<?> xuLyChung(Exception e) {
    log.error("loi khong luong truoc", e);          // ghi log nội bộ (Ngày 58)
    return ResponseEntity.status(500)
        .body(Map.of("loi", "loi he thong"));       // nhưng client chỉ thấy thế này
}
\`\`\`

\`\`\`
5) exception la chua dang ky -> HTTP 500 {"loi":"loi he thong"}
\`\`\`

Lỗi lạ vẫn về 500, nhưng thân đã được dọn: **stack trace ghi vào log để bạn đọc, client chỉ nhận một câu chung chung**. Đây là cân bằng đúng — bạn có đủ thông tin gỡ lỗi, kẻ tấn công không có gì.

━━━━━━━━━━━━━━━━━━━━

📋 MỘT THÂN LỖI NHẤT QUÁN

API tốt trả lỗi theo **cùng một hình dạng** ở mọi nơi, để client xử lý một kiểu:

\`\`\`json
{
  "thoiDiem": "2026-08-09T10:30:00Z",
  "ma": 400,
  "loi": "Bad Request",
  "thongDiep": "soTien khong duoc am",
  "duongDan": "/don"
}
\`\`\`

Tạo một \`record\` cho hình dạng này và trả nó từ mọi handler. Client nhìn vào là biết chỗ đọc thông điệp, chỗ đọc mã — không phải đoán mỗi endpoint một kiểu.

Với lỗi từ \`@Valid\` (Ngày 69), Spring còn cho bạn gộp danh sách mọi trường sai vào một phản hồi, thay vì bắt người dùng sửa từng lỗi một.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Tạo \`KhongTimThayException\` và \`DuLieuSaiException\` kế thừa \`RuntimeException\`.
2. Cho service ném chúng, xác nhận (chưa có advice) client nhận 500 kèm stack trace.
3. Viết \`@RestControllerAdvice\` ánh xạ hai lỗi đó sang 404 và 400.
4. Thêm một exception con và xác nhận nó khớp handler của lớp cha.
5. Thêm handler \`Exception.class\` làm lưới cuối, ghi log nhưng chỉ trả thông điệp chung.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Ném exception mang ý nghĩa nghiệp vụ, rồi gom mọi xử lý về một \`@RestControllerAdvice\`: mỗi \`@ExceptionHandler\` dịch một loại lỗi thành phản hồi JSON sạch với đúng mã trạng thái. Khớp theo lớp cha (đa hình của Ngày 16) cho phép một handler bắt cả họ, và một lưới \`Exception.class\` cuối cùng đảm bảo không lỗi nào lọt ra ngoài dưới dạng stack trace.

Đến giờ ứng dụng đã hoàn chỉnh về mặt xử lý: nhận, kiểm, chạy nghiệp vụ, lưu, và báo lỗi tử tế. Nhưng nó vẫn đang **chạy trên máy bạn** với mật khẩu CSDL viết thẳng trong \`application.properties\`. Đem lên production thì mật khẩu đó không thể nằm trong code, cổng và URL phải khác máy dev, và bạn cần bật/tắt cấu hình theo môi trường.

Ngày 74: **Cấu hình & hồ sơ (profiles)** — \`application.yml\`, \`@Value\`, tách cấu hình dev/prod, và vì sao bí mật (mật khẩu, khoá API) phải đến từ **biến môi trường** chứ tuyệt đối không nằm trong code hay Git (nhớ \`.gitignore\` của Ngày 57). Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
