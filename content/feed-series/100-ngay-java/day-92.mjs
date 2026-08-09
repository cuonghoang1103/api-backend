/** "100 Ngày Java với CuongThai" — Ngày 92: Tài liệu API (OpenAPI/Swagger).
    Nối đúng chỗ Ngày 91 kết ("người dùng quan trọng chưa phục vụ: lập trình
    viên khác muốn dùng API — cần biết endpoint nào, nhận gì, trả gì").
    Ngày 93 (giám sát & sức khỏe: Actuator) trỏ ngược về phần kết.

    ⚠ LUẬT 1+6: reflection đọc chú thích sinh spec, PHẢI sort (getDeclaredMethods
    không hứa thứ tự) → tất định; thân bài dạy springdoc thật. Output là kết quả
    THẬT của javac/java JDK 21. */
export default {
  day: 92,
  card: 'java-day-92',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'build-a-class-metadata-inspector-utility',
    title: 'Tiện ích soi metadata lớp (reflection — nền cho OpenAPI)',
  },

  content: `📖 100 NGÀY JAVA — NGÀY 92: TÀI LIỆU API

Blog của bạn giờ khá hoàn chỉnh. Nhưng có một người dùng quan trọng chưa được phục vụ: **lập trình viên khác** muốn dùng API của bạn.

Ứng dụng điện thoại, trang frontend, đối tác tích hợp — họ cần biết bạn có những endpoint nào, nhận tham số gì, trả về gì. Chẳng lẽ bắt họ đọc hết mã nguồn, hay nhắn tin hỏi bạn từng cái một?

━━━━━━━━━━━━━━━━━━━━

📝 VẤN ĐỀ CỦA TÀI LIỆU VIẾT TAY

Cách cũ: viết một file tài liệu liệt kê các API. Nghe hợp lý, nhưng nó có một bệnh nan y: **tài liệu và code lệch nhau**.

Bạn thêm một trường vào response, đổi một tham số, xoá một endpoint — và quên cập nhật tài liệu. Ba tháng sau, người tích hợp làm theo tài liệu, gặp lỗi, mất cả buổi mới phát hiện tài liệu **nói dối**. Tài liệu viết tay lỗi thời còn tệ hơn không có tài liệu, vì nó khiến người ta tin nhầm.

━━━━━━━━━━━━━━━━━━━━

🔍 GIẢI PHÁP: SINH TÀI LIỆU TỪ CHÍNH CODE

Nếu tài liệu được **sinh tự động từ code đang chạy**, nó không thể lệch — vì nó *là* code. Đây là ý tưởng của **OpenAPI** (chuẩn mô tả REST API, xưa gọi là Swagger).

Cơ chế bên dưới bạn đã đủ sức hiểu: đọc các chú thích trên controller bằng **reflection** (Ngày 70, 67) rồi dựng ra danh sách endpoint:

\`\`\`
1) quet controller bang reflection -> 4 diem cuoi tu sinh
2) GET /bai-viet (danhSach)
3) POST /bai-viet (tao)
4) DELETE /bai-viet/{slug} (xoa)
5) GET /bai-viet/{slug} (xem)
\`\`\`

Chương trình hôm nay quét một controller, đọc chú thích \`@Route\` (đại diện cho \`@GetMapping\`/\`@PostMapping\` thật) trên từng phương thức, và tự liệt kê đủ 4 điểm cuối — **không ai gõ tay danh sách này**. Thêm một phương thức có chú thích là nó tự xuất hiện:

\`\`\`
6) doc SINH TU CODE -> khong bao gio lech thuc te (them route la spec tu co)
\`\`\`

(Chi tiết kỹ thuật đáng nhớ: \`getDeclaredMethods()\` **không hứa thứ tự** — như \`HashMap\`, thứ tự có thể đổi giữa các lần chạy. Nên phải **sắp xếp** danh sách trước khi dùng nếu cần ổn định — đúng bài học Ngày 25/31.)

━━━━━━━━━━━━━━━━━━━━

🌱 TRONG SPRING: MỘT DÒNG STARTER

Bạn không tự viết bộ quét. Thêm một starter:

\`\`\`xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.6.0</version>
</dependency>
\`\`\`

Và ngay lập tức bạn có:
- **\`/v3/api-docs\`** — bản đặc tả OpenAPI dạng JSON (máy đọc; frontend tự sinh code client từ đây).
- **\`/swagger-ui.html\`** — một trang tài liệu **tương tác**: liệt kê mọi endpoint, tham số, kiểu response, và cho **thử API ngay trên trình duyệt** (bấm "Try it out", điền tham số, xem kết quả thật).

Không viết một dòng tài liệu nào. springdoc đọc controller, các \`record\`/DTO, kiểu trả về của bạn và dựng tất cả.

━━━━━━━━━━━━━━━━━━━━

✍️ MÔ TẢ RÕ HƠN KHI CẦN

Cấu trúc thì tự sinh, nhưng *ý nghĩa* thì bạn thêm vào bằng chú thích khi muốn tài liệu đẹp hơn:

\`\`\`java
@Operation(summary = "Đăng một bài viết mới",
           description = "Tự sinh slug từ tiêu đề, mặc định trạng thái NHÁP")
@ApiResponse(responseCode = "201", description = "Đã tạo, trả về bài kèm slug")
@ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ")
@PostMapping("/bai-viet")
public BaiViet tao(@RequestBody @Valid DangBaiRequest yc) { ... }
\`\`\`

\`@Operation\` mô tả việc, \`@ApiResponse\` mô tả từng mã trạng thái (Ngày 68), \`@Schema\` mô tả từng trường. Những chú thích này **nằm cạnh code** nên khi sửa code bạn thấy chúng ngay — khó quên hơn nhiều so với một file docs tách rời.

━━━━━━━━━━━━━━━━━━━━

⚠️ ĐỪNG PHƠI TÀI LIỆU RA PRODUCTION VÔ TỘI VẠ

Một lưu ý bảo mật: Swagger UI liệt kê **toàn bộ** API của bạn, kể cả các endpoint admin — một tấm bản đồ cho kẻ tấn công. Với API nội bộ, nên:
- Tắt Swagger UI trên production, hoặc
- Đặt nó sau xác thực (Ngày 79), chỉ người có quyền mới xem.

API công khai (cho đối tác) thì tài liệu là điểm cộng; API riêng thì cân nhắc che.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Thêm springdoc, mở \`/swagger-ui.html\`, xem các endpoint tự liệt kê.
2. Bấm "Try it out" gọi thử một endpoint ngay trên trình duyệt.
3. Thêm một endpoint mới, xác nhận nó tự xuất hiện trong tài liệu.
4. Dùng \`@Operation\`/\`@Schema\` mô tả rõ một endpoint và các trường.
5. Cấu hình chỉ bật Swagger UI ở profile \`dev\` (Ngày 74), tắt ở \`prod\`.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Tài liệu API viết tay luôn lệch code và trở thành lời nói dối. OpenAPI/Swagger giải bằng cách **sinh tài liệu từ chính code** — đọc controller bằng reflection, dựng danh sách endpoint, và cho thử ngay trên trình duyệt. Trong Spring chỉ cần một starter springdoc; thêm \`@Operation\`/\`@Schema\` để mô tả rõ. Nhớ che tài liệu của API riêng khỏi con mắt tò mò.

Đến giờ blog của bạn chạy ngon và có tài liệu. Nhưng khi nó chạy trên máy chủ thật, phục vụ người dùng thật, bạn cần biết: nó có **khoẻ** không? CSDL còn kết nối được không? Bộ nhớ sắp đầy chưa? Đã xử lý bao nhiêu request, bao nhiêu lỗi? Không nhìn thấy những con số đó thì bạn vận hành trong bóng tối — chỉ biết hệ thống hỏng khi người dùng phàn nàn.

Ngày 93: **Giám sát & sức khỏe (Actuator)** — endpoint \`/health\` để máy tự kiểm hệ thống còn sống, \`/metrics\` phơi ra số liệu vận hành (request, lỗi, bộ nhớ, thời gian phản hồi), và cách nối chúng vào công cụ theo dõi để bạn thấy vấn đề *trước* khi người dùng thấy. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
