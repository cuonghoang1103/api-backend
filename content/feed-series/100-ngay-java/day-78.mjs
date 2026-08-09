/** "100 Ngày Java với CuongThai" — Ngày 78: JWT (JSON Web Token).
    Nối đúng chỗ Ngày 77 kết ("HTTP không nhớ gì; sau khi đăng nhập một lần, làm
    sao request sau biết vẫn là người này mà không gõ lại mật khẩu?").
    Ngày 79 (Spring Security) trỏ ngược về phần kết.

    ⚠ LUẬT 6: thư viện JWT là ngoài, thẻ chạy JDK thuần nên chương trình dựng
    lại đúng cơ chế (base64url + HMAC-SHA256 chữ ký); thân bài dạy jjwt/Spring
    Security thật. Output là kết quả THẬT của javac/java JDK 21. */
export default {
  day: 78,
  card: 'java-day-78',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'implement-distributed-tracing-with-correlation-ids',
    title: 'Lần vết phân tán bằng correlation id (token qua request)',
  },

  content: `🎫 100 NGÀY JAVA — NGÀY 78: JWT (JSON WEB TOKEN)

Ngày 77 giải quyết "chứng minh bạn là ai" — nhưng mới một nửa. Vì HTTP có một tính chất căn bản: **nó không nhớ gì cả**. Mỗi request là một người lạ hoàn toàn với máy chủ.

Chẳng lẽ bắt người dùng gõ mật khẩu lại ở *mỗi* lần bấm? Sau khi đăng nhập một lần, làm sao các request sau biết "à, vẫn là người này"?

Câu trả lời phổ biến nhất cho API hiện đại: **JWT** — một tấm vé đăng nhập.

━━━━━━━━━━━━━━━━━━━━

🎫 Ý TƯỞNG: TẤM VÉ CÓ ĐÓNG DẤU

Hình dung một buổi hoà nhạc. Bạn đưa vé (đăng nhập bằng mật khẩu) đúng một lần ở cổng, nhận lại một **vòng tay có đóng dấu**. Sau đó ra vào bao nhiêu lần cũng chỉ cần chìa vòng tay — không phải mua vé lại.

JWT chính là cái vòng tay đó. Sau khi bạn đăng nhập thành công, máy chủ phát ra một token; mọi request sau bạn gửi kèm token thay vì gõ lại mật khẩu:

\`\`\`
Authorization: Bearer eyJhbGc...eyJzdWIi...Kf9x...
\`\`\`

━━━━━━━━━━━━━━━━━━━━

🧩 CẤU TRÚC: BA PHẦN NỐI BẰNG DẤU CHẤM

Một JWT gồm ba phần, mã base64url, nối bằng dấu \`.\`:

\`\`\`
1) token = header.payload.chuKy (3 phan), dai 89 ky tu
\`\`\`

- **Header** — thuật toán ký (\`{"alg":"HS256"}\`).
- **Payload** — dữ liệu về bạn: bạn là ai, quyền gì, hết hạn khi nào.
- **Chữ ký (signature)** — con dấu đảm bảo token không bị sửa.

━━━━━━━━━━━━━━━━━━━━

👀 CẢNH BÁO QUAN TRỌNG: PAYLOAD ĐỌC ĐƯỢC

Đây là hiểu lầm nguy hiểm nhất về JWT. Payload chỉ được **mã base64**, KHÔNG mã hoá:

\`\`\`
2) giai payload (base64) -> {"sub":"an","role":"USER"}
\`\`\`

Bất kỳ ai cầm token đều giải ra và đọc được nội dung payload — không cần secret gì cả. Base64 không phải mã hoá, chỉ là cách biểu diễn.

Hệ quả bắt buộc nhớ: **đừng bao giờ để thứ nhạy cảm vào payload** — không mật khẩu, không số thẻ, không dữ liệu riêng tư. Payload chỉ chứa danh tính và quyền hạn (những thứ vốn để dùng), không chứa bí mật.

Vậy JWT bảo vệ cái gì, nếu ai cũng đọc được payload? Nó bảo vệ **tính toàn vẹn** — không cho sửa, chứ không giấu nội dung.

━━━━━━━━━━━━━━━━━━━━

✍️ CHỮ KÝ: VÌ SAO KHÔNG GIẢ MẠO ĐƯỢC

Chữ ký là \`HMAC-SHA256(header + "." + payload, secret)\` — một hàm băm có khoá, chỉ máy chủ biết \`secret\`. Máy chủ xác minh bằng cách **tính lại** chữ ký rồi so:

\`\`\`
3) verify token that (dung secret) -> hop le? true
\`\`\`

Giờ thử vai kẻ tấn công. Đọc được payload rồi, hắn sửa \`"role":"USER"\` thành \`"role":"ADMIN"\` để chiếm quyền admin, giữ nguyên chữ ký cũ:

\`\`\`
4) sua payload role->ADMIN (giu chu ky cu) -> verify false (bi tu choi)
\`\`\`

Bị từ chối. Vì payload đổi thì chữ ký tính lại phải khác, mà chữ ký cũ không khớp nữa. Thế thì hắn tự ký lại một token ADMIN mới? Không được — hắn không có \`secret\` của máy chủ:

\`\`\`
5) ky lai bang secret doan sai -> verify false (khong gia duoc chu ky)
\`\`\`

Đây là toàn bộ sức mạnh của JWT: **đọc thì được, sửa thì không**. Ai giữ được \`secret\` mới ký được vé hợp lệ — nên \`secret\` phải mạnh và nằm trong biến môi trường (Ngày 74), tuyệt đối không lọt ra ngoài.

━━━━━━━━━━━━━━━━━━━━

🗄️ STATELESS: VÌ SAO API HIỆN ĐẠI THÍCH JWT

Cách cũ (session) là: máy chủ lưu một bảng phiên đăng nhập trong bộ nhớ, phát cho client một mã phiên, và tra bảng mỗi request. JWT làm khác hẳn:

\`\`\`
6) stateless: server KHONG luu session, chi tinh lai chu ky HMAC de kiem
\`\`\`

Máy chủ **không lưu gì cả**. Nó chỉ tính lại chữ ký để kiểm token có thật do mình phát không. Ưu điểm lớn: khi bạn có 10 máy chủ sau một bộ cân bằng tải, request rơi vào máy nào cũng xác minh được token — không cần chia sẻ bảng phiên. Đây là lý do JWT hợp với API REST và hệ thống nhiều máy chủ.

Đánh đổi phải biết: vì không lưu trạng thái, **khó thu hồi một token trước khi nó hết hạn**. Cách xử lý:
- Đặt **hạn ngắn** cho token (claim \`exp\`, ví dụ 15 phút) để token lộ cũng sớm vô hiệu.
- Dùng thêm **refresh token** hạn dài hơn để lấy token mới mà không phải đăng nhập lại.
- Cần thu hồi ngay thì giữ một danh sách đen nhỏ — nhưng làm vậy là hi sinh bớt tính stateless.

━━━━━━━━━━━━━━━━━━━━

✅ TRONG SPRING: DÙNG THƯ VIỆN, ĐỪNG TỰ VIẾT

Như mật khẩu, đừng tự cài JWT. Dùng thư viện đã kiểm nghiệm (ví dụ **jjwt**):

\`\`\`java
// Phát token khi đăng nhập
String token = Jwts.builder()
    .subject(user.getUsername())
    .claim("role", user.getRole())
    .expiration(Date.from(Instant.now().plus(15, ChronoUnit.MINUTES)))
    .signWith(secretKey)
    .compact();

// Xác minh ở mỗi request
Claims claims = Jwts.parser().verifyWith(secretKey).build()
    .parseSignedClaims(token).getPayload();
String username = claims.getSubject();
\`\`\`

Thư viện lo phần base64, HMAC, kiểm hạn \`exp\`, và bắt lỗi khi token hỏng — đúng nguyên lý ở trên nhưng an toàn và đầy đủ. Bạn chỉ cần giữ \`secretKey\` cho kỹ.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Dán một JWT bất kỳ vào jwt.io, xem ba phần và giải payload ra đọc.
2. Tự tạo token bằng \`HmacSHA256\` + \`Base64\` như chương trình mẫu.
3. Sửa một ký tự trong payload rồi verify — xác nhận bị từ chối.
4. Thêm claim \`exp\` và thử một token đã hết hạn.
5. Thêm jjwt vào dự án Spring, phát và xác minh một token thật.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

JWT là tấm vé đăng nhập không trạng thái: ba phần \`header.payload.chuKy\`, payload **đọc được** (chỉ base64, đừng để bí mật vào đó), còn **chữ ký HMAC** khiến token không thể sửa hay giả nếu không có \`secret\` của máy chủ. Máy chủ xác minh bằng cách tính lại chữ ký, không lưu phiên — nên dễ mở rộng nhiều máy, đánh đổi bằng việc phải đặt hạn ngắn. Và như mọi thứ mật mã: dùng thư viện, đừng tự viết.

Đến giờ bạn có mật khẩu băm an toàn (77) và tấm vé JWT (78). Nhưng chúng vẫn là những mảnh rời — chưa có gì **kiểm token ở mỗi request** và chặn kẻ chưa đăng nhập trước khi họ chạm tới controller. Chẳng lẽ mỗi controller tự gọi hàm verify JWT ở dòng đầu?

Ngày 79: **Spring Security** — khung bảo mật dựng một *chuỗi bộ lọc* (filter chain) đứng gác **trước** mọi API của bạn: nó chặn request chưa xác thực từ vòng ngoài, đọc JWT, gắn danh tính vào ngữ cảnh, để controller của bạn quay lại chỉ lo nghiệp vụ. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
