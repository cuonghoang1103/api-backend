/** "100 Ngày Java với CuongThai" — Ngày 87: Upload ảnh bìa (Blog API).
    Nối đúng chỗ Ngày 86 kết ("bài viết chỉ có chữ; blog thật cần ảnh — file
    vài MB, không nhét cột TEXT, phải lưu đâu đó rồi phục vụ lại").
    Ngày 88 (lượt xem & chống spam) trỏ ngược về phần kết.

    ⚠ LUẬT 6: bảo mật upload dựng bằng JDK thuần (magic bytes, kích thước, path
    traversal); thân bài dạy MultipartFile thật. Output là kết quả THẬT của
    javac/java JDK 21. */
export default {
  day: 87,
  card: 'java-day-87',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'generic-csv-file-parser-with-custom-exception-handling',
    title: 'Bộ đọc file có xử lý ngoại lệ (nền cho nhận file)',
  },

  content: `📤 100 NGÀY JAVA — NGÀY 87: UPLOAD ẢNH BÌA

Bài viết của bạn giờ vẫn chỉ có chữ. Một blog thật cần **ảnh** — ảnh bìa, ảnh chèn trong bài. Mà ảnh khác hẳn chữ: nó là file, có khi vài MB, không nhét vào cột \`TEXT\` được, và phải lưu ở đâu đó rồi phục vụ lại cho trình duyệt.

Hôm nay nhận file. Và đây là một trong những chỗ **nguy hiểm nhất** của web — nơi kẻ tấn công tải mã độc lên máy chủ của bạn nếu bạn cả tin.

━━━━━━━━━━━━━━━━━━━━

📤 NHẬN FILE: MultipartFile

File tới trong một request \`multipart/form-data\` — khác request JSON thường. Spring gói nó vào \`MultipartFile\`:

\`\`\`java
@PostMapping("/bai-viet/{slug}/anh")
public Map<String,String> uploadAnh(
        @PathVariable String slug,
        @RequestParam("file") MultipartFile file) {
    String duongDan = anhService.luu(file);
    return Map.of("url", duongDan);
}
\`\`\`

\`MultipartFile\` cho bạn \`getOriginalFilename()\`, \`getContentType()\`, \`getSize()\`, \`getBytes()\`. Nghe tiện. Nhưng đây là chỗ phải dừng lại: **cả ba thứ đầu đều do client gửi** — tên file, loại, thậm chí phần mở rộng, tất cả kẻ tấn công đặt được tuỳ ý. Nhớ lại luật vàng Ngày 69: **đừng tin client.**

━━━━━━━━━━━━━━━━━━━━

🔬 KIỂM LOẠI THẬT BẰNG MAGIC BYTES

Cách kiểm ngây thơ: xem đuôi tên \`.jpg\` hoặc \`getContentType()\` nói \`image/jpeg\`. Cả hai đều **vô dụng về mặt bảo mật** — đổi tên file và giả content-type là chuyện một dòng.

Kẻ tấn công đổi \`virus.exe\` thành \`anh.jpg\`, khai content-type \`image/jpeg\`, và tải lên. Nếu bạn chỉ xem đuôi tên, nó lọt.

Cách đúng: nhìn vào **magic bytes** — vài byte đầu tiên của file, thứ không đổi được nếu file vẫn là chính nó:

\`\`\`
1) 'anh.jpg' magic JPG, 200KB -> /uploads/anh.jpg
2) file that la EXE doi ten '.jpg' -> TU CHOI: loai that 'EXE' khong phai anh
3) khai 'image/jpeg' nhung magic PNG -> nhan dien theo magic = PNG
\`\`\`

Mỗi loại file có một chữ ký ở đầu:
- JPG bắt đầu bằng \`FF D8 FF\`
- PNG bắt đầu bằng \`89 50 4E 47\` ("‰PNG")
- PDF bắt đầu bằng \`25 50 44 46\` ("%PDF")
- File thực thi Windows bắt đầu bằng \`4D 5A\` ("MZ")

Dòng 2 cho thấy file EXE đội lốt \`.jpg\` bị lộ ngay vì magic là \`4D 5A\`, không phải ảnh. Dòng 3: content-type client khai \`image/jpeg\` nhưng magic là PNG — ta tin **magic**, không tin lời khai. (Ở thật, thư viện như Apache Tika đọc magic giùm bạn chính xác hơn.)

━━━━━━━━━━━━━━━━━━━━

🚧 GIỚI HẠN KÍCH THƯỚC & DANH SÁCH TRẮNG

Hai lớp chặn nữa, đơn giản mà quan trọng:

\`\`\`
4) file 12MB JPG > 5MB -> TU CHOI: 12MB > 5MB
6) file PDF (magic %PDF) -> TU CHOI: loai that 'PDF' khong phai anh
\`\`\`

- **Giới hạn cỡ.** Không chặn thì ai đó tải lên file 10GB làm đầy đĩa/hết RAM (một kiểu tấn công từ chối dịch vụ). Spring có sẵn: \`spring.servlet.multipart.max-file-size=5MB\`.
- **Danh sách trắng** loại cho phép. Ảnh bìa thì chỉ nhận JPG/PNG/WebP — kể cả file PDF hợp lệ (magic \`%PDF\` thật) cũng từ chối, vì nó không phải ảnh. Whitelist ("chỉ cho những cái này") an toàn hơn blacklist ("cấm những cái kia") — blacklist luôn sót.

━━━━━━━━━━━━━━━━━━━━

🛡️ LÀM SẠCH TÊN: CHỐNG PATH TRAVERSAL

Cái bẫy tinh vi nhất. Nếu bạn lưu file bằng đúng tên client gửi, kẻ tấn công đặt tên:

\`\`\`
../../etc/passwd
\`\`\`

và nếu bạn ghép thẳng vào đường dẫn lưu, file của họ **ghi đè file hệ thống**. Đây là **path traversal** — dùng \`../\` để thoát khỏi thư mục upload.

\`\`\`
5) ten '../../etc/passwd.jpg' -> lam sach -> 'passwd.jpg'
\`\`\`

Cách chặn: bỏ mọi thành phần đường dẫn, chỉ giữ tên cuối. Và tốt hơn nữa — **đừng dùng tên client gửi để lưu chút nào**. Ở thật, sinh một tên **ngẫu nhiên** (UUID) hoặc dùng mã băm nội dung (như Git, Ngày 57):

\`\`\`java
String tenLuu = UUID.randomUUID() + "." + duoiHopLe;   // ví dụ 3f9a....jpg
\`\`\`

Tên ngẫu nhiên tránh được ba chuyện cùng lúc: path traversal, trùng tên (hai người upload "anh.jpg"), và lộ thông tin qua tên file.

━━━━━━━━━━━━━━━━━━━━

☁️ LƯU Ở ĐÂU? ĐỪNG NHÉT VÀO DB

Câu hỏi cuối: lưu bytes ảnh ở đâu? **Không** phải trong CSDL. Nhét file nhị phân vào cột DB làm CSDL phình to, sao lưu chậm, truy vấn nặng.

Đúng cách: lưu file ra một **kho lưu trữ đối tượng** — đĩa (đơn giản) hoặc dịch vụ như **AWS S3 / Cloudflare R2 / MinIO** (cho thật, có CDN, sao lưu, mở rộng). CSDL **chỉ giữ đường dẫn**:

\`\`\`
bai_viet.anh_bia = "https://cdn.example.com/uploads/3f9a....jpg"
\`\`\`

Trình duyệt tải ảnh thẳng từ CDN, không qua máy chủ Java của bạn — nhanh và nhẹ tải. Đây đúng là mô hình của hầu hết ứng dụng thật.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Viết endpoint nhận \`MultipartFile\`, in ra tên, loại khai, kích thước.
2. Đọc vài byte đầu, nhận diện JPG/PNG bằng magic bytes — từ chối file khác.
3. Thêm giới hạn 5MB và danh sách trắng loại ảnh.
4. Thử upload một file \`.exe\` đổi tên \`.jpg\`, xác nhận bị chặn nhờ magic.
5. Sinh tên lưu bằng \`UUID\`, lưu ra một thư mục và trả về đường dẫn.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Nhận file qua \`MultipartFile\`, nhưng **đừng tin một chữ nào client khai**: kiểm loại thật bằng **magic bytes** (không phải đuôi tên hay content-type), giới hạn **kích thước**, chỉ nhận loại trong **danh sách trắng**, và **làm sạch tên** (tốt nhất là đặt tên ngẫu nhiên) để chống path traversal. Lưu bytes ra kho đối tượng (S3/R2), CSDL chỉ giữ đường dẫn. Đây là chỗ web dễ thủng nhất — cẩn thận đáng giá.

Blog giờ có bài, ảnh, bình luận, thẻ, tìm kiếm. Nó bắt đầu có người đọc thật. Nhưng "người đọc thật" kéo theo hai vấn đề mới: bạn muốn **đếm** xem bài nào được xem nhiều (để biết viết gì tiếp), và bạn phải **chống** kẻ spam bình luận hàng trăm lần một phút hay dò mật khẩu liên tục.

Ngày 88: **Lượt xem & chống spam** — đếm view sao cho không làm chậm mỗi request (và không đếm gian lận), cùng **rate limiting**: giới hạn số request mỗi người trong một khoảng thời gian, thuật toán "gàu rò" (token bucket) đứng sau nó. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
