/** "100 Ngày Java với CuongThai" — Ngày 97: Rà soát bảo mật cuối (OWASP).
    Nối đúng chỗ Ngày 96 kết ("bảo mật đã chạm nhiều mảnh rải rác — SQL injection,
    băm mật khẩu, IDOR, upload, rate limit; cần một lần rà soát CÓ DANH SÁCH").
    Ngày 98 (tối ưu hiệu năng cuối) trỏ ngược về phần kết.

    ⚠ LUẬT 6: checklist dựng bằng JDK thuần, tất định; thân bài dạy OWASP Top 10
    + cấu hình bảo mật thật. Output là kết quả THẬT của javac/java JDK 21. */
export default {
  day: 97,
  card: 'java-day-97',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'build-a-secure-audit-logger-with-log-injection-protection',
    title: 'Nhật ký kiểm toán chống log injection (bảo mật)',
  },

  content: `🔒 100 NGÀY JAVA — NGÀY 97: RÀ SOÁT BẢO MẬT CUỐI

Blog của bạn giờ đủ: tính năng, hiệu năng, vận hành, kiểm thử. Nhưng còn một góc chưa ai soi kỹ một cách **có hệ thống**: bảo mật.

Suốt series ta đã chạm nhiều mảnh — SQL injection (63), băm mật khẩu (77), phân quyền và IDOR (80), upload an toàn (87), rate limit (88). Nhưng rải rác. Một hệ thống thật cần một lần rà soát **có danh sách**, đi qua từng loại lỗ hổng và tự hỏi "chỗ mình có dính không?".

━━━━━━━━━━━━━━━━━━━━

📋 VÌ SAO CẦN CHECKLIST

Bảo mật thất bại không phải vì bạn không biết cách chống — mà vì bạn **quên** kiểm một chỗ. Trí nhớ lộn xộn luôn sót; một danh sách thì không:

\`\`\`
1) checklist bao mat: 8 muc (gom bai hoc rai rac)
6) ra soat co DANH SACH -> khong bo sot, tu kiem duoc moi du an
\`\`\`

Danh sách chuẩn nhất là **OWASP Top 10** — mười loại lỗ hổng web phổ biến và nguy hiểm nhất, do một tổ chức bảo mật tổng hợp và cập nhật. Đi qua từng mục, đối chiếu với hệ thống của mình.

━━━━━━━━━━━━━━━━━━━━

✅ NHỮNG GÌ SERIES ĐÃ CHE PHỦ

Gom lại, bạn đã học cách chống phần lớn các lỗ hổng lớn — chỉ là rải rác qua nhiều ngày:

\`\`\`
2) da co: 6/8 (SQL inj, bam mk, JWT, IDOR, upload, rate limit)
\`\`\`

Ánh xạ sang OWASP Top 10:
- **Injection** (SQL injection) → \`PreparedStatement\`, tham số hoá (Ngày 63).
- **Cryptographic Failures** (lộ mật khẩu) → băm BCrypt, không lưu nguyên bản (Ngày 77).
- **Broken Access Control** (IDOR, vượt quyền) → kiểm vai + sở hữu (Ngày 80).
- **Identification & Auth Failures** → JWT + rate limit chống dò mật khẩu (78, 88).
- **Security Misconfiguration** (upload lung tung) → magic bytes, giới hạn, làm sạch tên (Ngày 87).

Nhìn gom lại thế này, bức tranh bảo mật của cả series hiện ra rõ ràng.

━━━━━━━━━━━━━━━━━━━━

⚠️ CÒN THIẾU → VIỆC PHẢI LÀM

Giá trị lớn nhất của rà soát là **lộ ra chỗ chưa làm** — trước khi kẻ tấn công tìm thấy:

\`\`\`
3) con thieu: 2 muc phai bo sung
4) - Buoc HTTPS (token khong bay tran) (Ngay 81)
5) - Che Actuator/Swagger nhay cam (Ngay 93)
\`\`\`

- **Bắt buộc HTTPS.** Token JWT (Ngày 78) bay trong header; không có HTTPS thì ai trên đường truyền cũng đọc và cướp được phiên. Đây là điều dễ quên vì "trên máy mình chạy HTTP vẫn được".
- **Che các endpoint nội bộ.** Actuator (93) và Swagger (92) phơi thông tin hệ thống — phải giấu sau xác thực hoặc chỉ mở trong mạng nội bộ.

━━━━━━━━━━━━━━━━━━━━

🔍 VÀI MỤC OWASP KHÁC ĐÁNG SOI

Danh sách đầy đủ còn nhiều; vài mục hay bị bỏ quên:

- **Kiểm mọi đầu vào** (Ngày 69) — không tin client, validate ở cửa. Đây là gốc của rất nhiều lỗ hổng.
- **Lỗi không lộ thông tin** (Ngày 73) — trả thông báo chung cho client, stack trace chỉ vào log; đừng để lỗi phơi cấu trúc nội bộ.
- **Cập nhật thư viện** — một thư viện cũ có lỗ hổng đã công bố (CVE) là cửa mở sẵn. Dùng công cụ quét phụ thuộc (Dependabot, OWASP Dependency-Check) để biết cái nào cần vá.
- **Đừng log dữ liệu nhạy cảm** (Ngày 58) — mật khẩu, token, số thẻ không được vào log.
- **Header bảo mật** — \`Content-Security-Policy\`, \`X-Content-Type-Options\`... chặn một số kiểu tấn công phía trình duyệt.

━━━━━━━━━━━━━━━━━━━━

🧭 BẢO MẬT LÀ THÓI QUEN, KHÔNG PHẢI SỰ KIỆN

Điều quan trọng nhất của bài hôm nay không phải danh sách cụ thể, mà là **tư duy**: bảo mật không phải làm một lần rồi xong. Thư viện có lỗ hổng mới mỗi tuần, tính năng mới mở ra bề mặt tấn công mới, và cấu hình vô tình đổi.

Nên rà soát **định kỳ** (mỗi kỳ phát hành, hoặc theo lịch), và biến checklist thành một phần của quy trình — chèn bước quét bảo mật vào CI/CD (Ngày 95) để máy tự nhắc. Một lỗ hổng bắt được trong lúc rà soát rẻ hơn nghìn lần một lỗ hổng bị khai thác trên production.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Mở OWASP Top 10, đối chiếu từng mục với Blog API của bạn.
2. Tự lập một checklist bảo mật cho dự án, đánh dấu đã-có / còn-thiếu.
3. Bật HTTPS (dù chỉ chứng chỉ tự ký lúc dev) và chuyển hướng HTTP → HTTPS.
4. Che \`/actuator/**\` và Swagger sau xác thực hoặc tắt ở production.
5. Chạy một công cụ quét phụ thuộc, xem có thư viện nào dính CVE.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Bảo mật rải rác qua cả series giờ gom lại thành một **checklist** — dựa trên OWASP Top 10 — để đi qua từng loại lỗ hổng mà không bỏ sót. Bạn đã che phủ phần lớn (injection, băm mật khẩu, phân quyền, upload, rate limit); rà soát để lộ ra chỗ còn thiếu (HTTPS, che endpoint nội bộ) và những mục hay quên (validate đầu vào, không lộ lỗi, vá thư viện). Quan trọng nhất: bảo mật là **thói quen rà soát định kỳ**, không phải làm một lần.

Bảo mật xong, còn một câu hỏi cuối về chất lượng: nó có **nhanh** không? Suốt series ta học nhiều mảnh hiệu năng — đo đạc (59), chỉ mục (66), N+1 (71), cache (89). Cũng rải rác. Một lần trước khi giao hàng, nên chạy một vòng tối ưu có phương pháp: tìm chỗ chậm thật sự và sửa đúng chỗ đó.

Ngày 98: **Tối ưu hiệu năng cuối** — một quy trình rà soát hiệu năng có hệ thống cho cả ứng dụng: đo để tìm điểm nóng (đừng đoán — Ngày 59), soát N+1 và chỉ mục thiếu, kiểm cache đúng chỗ, và biết khi nào thì "đủ nhanh rồi, dừng lại". Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
