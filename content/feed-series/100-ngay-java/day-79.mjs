/** "100 Ngày Java với CuongThai" — Ngày 79: Spring Security (filter chain).
    Nối đúng chỗ Ngày 78 kết ("mật khẩu băm + JWT vẫn là mảnh rời; chẳng lẽ mỗi
    controller tự gọi verify JWT ở dòng đầu?").
    Ngày 80 (phân quyền chi tiết: roles, @PreAuthorize) trỏ ngược về phần kết.

    ⚠ LUẬT 6: Spring Security là framework ngoài, thẻ chạy JDK thuần nên chương
    trình dựng lại nguyên lý chuỗi bộ lọc; thân bài dạy SecurityFilterChain thật.
    Output là kết quả THẬT của javac/java JDK 21. */
export default {
  day: 79,
  card: 'java-day-79',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'secure-audit-logging-system-with-role-based-access-control',
    title: 'Hệ ghi nhật ký có phân quyền theo vai trò (RBAC)',
  },

  content: `🛡️ 100 NGÀY JAVA — NGÀY 79: SPRING SECURITY

Hai ngày qua bạn có mật khẩu băm an toàn (77) và tấm vé JWT (78). Nhưng chúng vẫn là những mảnh rời. Chưa có gì **kiểm token ở mỗi request** và chặn kẻ chưa đăng nhập trước khi họ chạm tới controller.

Chẳng lẽ mỗi controller tự gọi hàm verify JWT ở dòng đầu tiên? Rải kiểm tra bảo mật khắp nơi là công thức của lỗ hổng: chỉ cần quên một chỗ là thủng.

Spring Security giải quyết bằng một ý tưởng gọn: **một lớp gác đứng trước tất cả**.

━━━━━━━━━━━━━━━━━━━━

🛡️ Ý TƯỞNG CỐT LÕI: CHUỖI BỘ LỌC

Spring Security đặt một **chuỗi bộ lọc** (filter chain) đứng *trước* mọi controller. Mỗi request phải đi qua chuỗi này trước khi tới được code nghiệp vụ của bạn:

\`\`\`
request → [Bộ lọc Xác thực] → [Bộ lọc Phân quyền] → controller
\`\`\`

\`\`\`
1) chuoi bo loc: [XacThuc, PhanQuyen] -> controller
\`\`\`

Mỗi bộ lọc kiểm một điều và có quyền **chặn ngay** — nếu chặn, request dừng lại, không bao giờ tới controller. Đây là mẫu *Chain of Responsibility*: một chuỗi các trạm gác, trạm nào thấy sai thì trả về ngay.

Cái lợi lớn nhất: **controller của bạn quay lại chỉ lo nghiệp vụ**. Nó không tự kiểm token, không tự kiểm quyền — vì tới được nó nghĩa là đã qua hết lớp gác. Bảo mật gom về một chỗ, không rải rác.

━━━━━━━━━━━━━━━━━━━━

🚪 KHAI RÕ ĐƯỜNG CÔNG KHAI

Vài đường không cần đăng nhập: trang chủ, \`/login\`, \`/register\`. Bạn khai chúng công khai, phần còn lại mặc định phải xác thực:

\`\`\`
2) GET /public khong token -> 200 (bo loc cho qua)
\`\`\`

Nguyên tắc an toàn: **mặc định là khoá, mở ra từng đường một**. Ngược lại — mặc định mở, khoá từng đường — là cách bạn sẽ quên khoá một endpoint nào đó và để lộ.

━━━━━━━━━━━━━━━━━━━━

🔒 401 vs 403 — HAI CON SỐ HAY BỊ LẪN

Đây là điểm bài học quan trọng nhất, và cũng hay nhầm nhất. Hai bộ lọc, hai loại từ chối:

**Bộ lọc xác thực → 401 khi chưa đăng nhập:**

\`\`\`
3) GET /don khong token -> 401 (chua dang nhap)
4) GET /don token USER hop le -> 200 (qua het)
\`\`\`

Không có token (hoặc token sai/hết hạn) → \`401 Unauthorized\`. Bộ lọc này đọc JWT (Ngày 78), xác minh chữ ký, và nếu hợp lệ thì gắn danh tính người dùng vào *ngữ cảnh bảo mật* để các bước sau dùng.

**Bộ lọc phân quyền → 403 khi thiếu quyền:**

\`\`\`
5) DELETE /admin/users token USER -> 403 (thieu quyen)
6) DELETE /admin/users token ADMIN -> 200 (qua het)
\`\`\`

Người dùng USER *đã đăng nhập* (token hợp lệ, qua được bộ lọc xác thực) nhưng không đủ quyền xoá ở khu \`/admin\` → \`403 Forbidden\`. Chỉ ADMIN mới qua.

Nhớ gọn:
- **401 Unauthorized** — "tôi không biết bạn là ai" (chưa/sai đăng nhập).
- **403 Forbidden** — "tôi biết bạn là ai, nhưng bạn không được phép".

Và để ý thứ tự: xác thực **trước**, phân quyền **sau** — đúng như Ngày 77 đã nói. Bạn không thể hỏi "được làm gì" khi còn chưa biết "là ai".

━━━━━━━━━━━━━━━━━━━━

✅ TRONG SPRING: CẤU HÌNH MỘT CHỖ

Bạn không tự viết chuỗi bộ lọc — chỉ khai một \`SecurityFilterChain\`:

\`\`\`java
@Configuration
@EnableWebSecurity
public class CauHinhBaoMat {

    @Bean
    SecurityFilterChain chuoiBaoMat(HttpSecurity http) throws Exception {
        http
          .csrf(csrf -> csrf.disable())                 // API stateless dùng JWT
          .authorizeHttpRequests(auth -> auth
              .requestMatchers("/public/**", "/login").permitAll()   // công khai
              .requestMatchers("/admin/**").hasRole("ADMIN")          // chỉ ADMIN
              .anyRequest().authenticated())                          // còn lại: phải đăng nhập
          .sessionManagement(s -> s
              .sessionCreationPolicy(SessionCreationPolicy.STATELESS))   // không lưu phiên (Ngày 78)
          .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
\`\`\`

Đọc từ trên xuống chính là mô tả cái chuỗi ở trên: đường nào công khai, đường nào cần quyền gì, không lưu phiên, và cắm bộ lọc JWT của bạn vào chuỗi. \`jwtFilter\` là nơi bạn đọc header \`Authorization: Bearer ...\`, verify token, gắn danh tính.

━━━━━━━━━━━━━━━━━━━━

⚠️ VÀI ĐIỀU NGƯỜI MỚI HAY VẤP

- **Mặc định Spring Security khoá HẾT.** Thêm starter security vào là mọi endpoint bỗng đòi đăng nhập — đó là *tính năng*, không phải lỗi. Bạn phải chủ động mở đường công khai.
- **CSRF với API JWT thường tắt.** CSRF bảo vệ cơ chế cookie/phiên; API stateless dùng token trong header thì không cần, nên hay tắt (nhưng phải hiểu vì sao trước khi tắt).
- **Thứ tự bộ lọc quan trọng.** Bộ lọc JWT phải chạy *trước* bước xác thực mặc định, để danh tính có sẵn khi phân quyền.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Thêm \`spring-boot-starter-security\`, chạy app — thấy mọi endpoint bỗng đòi đăng nhập.
2. Khai một \`SecurityFilterChain\`: mở \`/public/**\`, còn lại \`authenticated()\`.
3. Viết một bộ lọc đọc header \`Authorization\`, verify JWT (Ngày 78), gắn danh tính.
4. Gọi một API không token → 401; có token hợp lệ → 200.
5. Đặt \`/admin/**\` cần \`hasRole("ADMIN")\`, thử bằng token USER (403) và ADMIN (200).

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Spring Security dựng một **chuỗi bộ lọc** đứng gác trước mọi controller: request phải qua hết chuỗi mới tới nghiệp vụ, bộ lọc nào thấy sai thì chặn ngay. Xác thực thất bại trả **401** (chưa biết bạn là ai), phân quyền thất bại trả **403** (biết rồi nhưng không đủ quyền) — theo đúng thứ tự authN trước authZ. Bạn gom tất cả vào một \`SecurityFilterChain\`, và controller quay lại sạch sẽ chỉ lo nghiệp vụ.

Hôm nay ta mới phân quyền thô: cả khu \`/admin\` cần ADMIN. Nhưng thực tế tinh vi hơn nhiều: một user được sửa *đơn của chính mình* nhưng không được sửa đơn người khác; một biên tập viên xoá được bài nhưng không xoá được tài khoản. Quyền không chỉ theo *khu vực*, mà theo *vai trò* và cả *quan hệ sở hữu*.

Ngày 80: **Phân quyền chi tiết** — vai trò (roles) và quyền (authorities), \`@PreAuthorize\` để gắn luật quyền ngay trên từng phương thức, và cách kiểm "đây có đúng là đồ của bạn không". Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
