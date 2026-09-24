/**
 * Bảo mật Web — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 24/09/2026 (status DRAFT), chi tiết soạn sau theo
 * quy trình khoá Docker (content/courses/docker/_HOP-DONG.md). Xem _chung/khung.mjs.
 * ⚠️ Khi soạn chi tiết: mọi demo tấn công chỉ chạy trên ứng dụng thử CỐ Ý có lỗ (tự dựng, cục bộ) — không nhắm vào hệ thống thật.
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'backend', name: 'Backend', icon: 'Server', sortOrder: 1 },
  course: {
    slug: 'web-security',
    title: 'Web Security',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'DRAFT',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/web-security.png?v=1',
    shortDescription: 'The OWASP Top 10 from the defender’s side: see each hole in a deliberately broken local app, then fix it in real Node/Next.js code: injection, XSS, access control, secrets, SSRF.|||OWASP Top 10 từ phía người phòng thủ: thấy từng lỗ hổng trên app thử cố ý có lỗ chạy cục bộ, rồi vá bằng code Node/Next.js thật: injection, XSS, phân quyền, bí mật, SSRF.',
    description: 'Khoá bảo mật web cho lập trình viên (không phải khoá hack). Mỗi chương: hiểu lỗ hổng, thấy nó xảy ra trên ứng dụng thử cố ý có lỗ chạy trong Docker trên máy mình, rồi vá bằng code Node/Express/Next.js thật và viết test chặn nó quay lại. Phủ OWASP Top 10 (2021/2025), bảo mật API, quản lý bí mật, header bảo mật, chuỗi cung ứng npm, và quy trình rà soát bảo mật cho đồ án/dự án.',
    whatYouLearn: 'Nhận ra và vá SQL/NoSQL injection, XSS, CSRF, SSRF, IDOR/BOLA; lưu mật khẩu đúng cách; quản lý phiên và token an toàn; cấu hình CSP và header bảo mật; giữ bí mật ngoài mã nguồn; kiểm dependency; và trả lời tự tin câu hỏi bảo mật khi phỏng vấn.',
    requirements: 'Biết Node.js/Express và HTML/JavaScript cơ bản. Nên học trước khoá Authentication, Docker (để chạy app thử) và Git.',
    documentsNote: 'Tài liệu chính: owasp.org/Top10 • OWASP Cheat Sheet Series • OWASP API Security Top 10 • PortSwigger Web Security Academy • MDN Web Security.',
  },
  sections: khung('sec', [
    ['Section 0 — Security as a developer skill', 'Mục 0 — Bảo mật là kỹ năng của lập trình viên', 'Tư duy bảo mật và phòng thí nghiệm an toàn để học.', [
      ['bat-dau-tai-day', 'Start here (1/2) — What web security is, and why every developer owns it', 'Bắt đầu tại đây (1/2) — Bảo mật web là gì, và vì sao lập trình viên nào cũng phải biết', 'Bảo mật bằng hình ảnh đời thường · OWASP và Top 10 ra đời thế nào · Bảo mật trong phỏng vấn · Đạo đức: chỉ thử trên hệ thống của mình'],
      ['bat-dau-khi-khong-co', 'Start here (2/2) — Real breaches, and how to study without getting lost', 'Bắt đầu tại đây (2/2) — Những vụ lộ lọt thật, và cách học không lạc hướng', 'Vụ lộ lọt có nguồn (Equifax 2017, lộ khoá trên GitHub…) · Sai lầm của sinh viên · Lộ trình học'],
      ['phong-thi-nghiem', 'A safe lab: a deliberately vulnerable app in Docker', 'Phòng thí nghiệm an toàn: app cố ý có lỗ trong Docker', 'Dựng app thử cục bộ · OWASP Juice Shop · Luật chơi an toàn'],
      ['mo-hinh-de-doa', 'Threat modelling in 20 minutes', 'Mô hình hoá mối đe doạ trong 20 phút', 'Tài sản · Kẻ tấn công · Bề mặt tấn công · STRIDE nhập môn'],
    ]],
    ['Chapter 1 — Injection', 'Chương 1 — Injection', 'SQL, NoSQL, lệnh hệ thống và template.', [
      ['sql', 'SQL injection, seen and fixed', 'SQL injection, thấy tận mắt và vá', 'Nối chuỗi SQL · Truy vấn tham số hoá · Prisma raw query an toàn'],
      ['nosql', 'NoSQL and ORM injection', 'Injection trên NoSQL và ORM', 'Toán tử $ne trong Mongo · Truyền object từ request'],
      ['lenh', 'Command injection and path traversal', 'Chạy lệnh hệ thống và đi ngược thư mục', 'child_process · ../../etc/passwd · Danh sách trắng'],
      ['phong-thu', 'Defence in depth for input', 'Phòng thủ nhiều lớp cho dữ liệu vào', 'Validate · Encode · Quyền tối thiểu cho user CSDL'],
    ]],
    ['Chapter 2 — Cross-site scripting (XSS)', 'Chương 2 — Cross-site scripting (XSS)', 'Stored, reflected, DOM XSS và CSP.', [
      ['cac-loai', 'Three kinds of XSS', 'Ba loại XSS', 'Stored · Reflected · DOM · Hậu quả thật'],
      ['react', 'XSS in React and Next.js', 'XSS trong React và Next.js', 'Tự escape · dangerouslySetInnerHTML · href javascript:'],
      ['sanitize', 'Sanitising HTML and Markdown', 'Làm sạch HTML và Markdown', 'DOMPurify · sanitize-html · Markdown từ người dùng'],
      ['csp', 'Content Security Policy', 'Content Security Policy', 'Nonce/hash · Report-only · Triển khai dần'],
    ]],
    ['Chapter 3 — Broken access control', 'Chương 3 — Phân quyền hỏng', 'Lỗi số 1 của OWASP Top 10.', [
      ['idor', 'IDOR / BOLA: reading someone else’s data', 'IDOR / BOLA: đọc dữ liệu của người khác', 'Đổi id trên URL · Kiểm quyền từng bản ghi'],
      ['vai-tro', 'Roles and permissions that hold', 'Vai trò và quyền hạn đứng vững', 'RBAC · Kiểm ở server không ở UI · Ẩn nút không phải chặn'],
      ['mass-assignment', 'Mass assignment', 'Gán hàng loạt', 'Gửi thêm role=admin · Danh sách trường cho phép'],
      ['test-quyen', 'Testing authorisation automatically', 'Tự động test phân quyền', 'Ma trận vai trò × endpoint · Test trong CI'],
    ]],
    ['Chapter 4 — Authentication and sessions', 'Chương 4 — Xác thực và phiên đăng nhập', 'Mật khẩu, phiên, token và đăng nhập nhiều lớp.', [
      ['mat-khau', 'Storing passwords (bcrypt, argon2)', 'Lưu mật khẩu (bcrypt, argon2)', 'Băm + salt · Chi phí · Rò rỉ cơ sở dữ liệu'],
      ['phien', 'Sessions and cookies done safely', 'Phiên và cookie làm cho an toàn', 'HttpOnly · Secure · SameSite · Hết hạn · Đăng xuất thật'],
      ['jwt', 'JWT pitfalls', 'Những cái bẫy của JWT', 'alg none · Không thu hồi được · Lưu ở đâu'],
      ['brute-force', 'Brute force, credential stuffing and MFA', 'Dò mật khẩu, nhồi thông tin đăng nhập và MFA', 'Rate limit đăng nhập · Khoá mềm · TOTP/passkey'],
    ]],
    ['Chapter 5 — CSRF, CORS and clickjacking', 'Chương 5 — CSRF, CORS và clickjacking', 'Trình duyệt giúp gì và không giúp gì.', [
      ['csrf', 'CSRF, and why SameSite changed the game', 'CSRF, và vì sao SameSite đổi cuộc chơi', 'Form giả · Token CSRF · SameSite=Lax'],
      ['cors', 'CORS misconfigurations', 'Cấu hình CORS sai', 'Origin * với credentials · Phản chiếu Origin'],
      ['clickjacking', 'Clickjacking and framing', 'Clickjacking và nhúng khung', 'X-Frame-Options · frame-ancestors'],
      ['header', 'Security headers checklist', 'Checklist header bảo mật', 'HSTS · nosniff · Referrer-Policy · Kiểm bằng curl'],
    ]],
    ['Chapter 6 — Server-side request forgery and file uploads', 'Chương 6 — SSRF và tải file lên', 'Server của bạn gọi hộ kẻ xấu.', [
      ['ssrf', 'SSRF: when your server fetches for attackers', 'SSRF: khi server đi lấy dữ liệu hộ kẻ tấn công', 'Metadata cloud 169.254.169.254 · Mạng nội bộ · Danh sách trắng'],
      ['upload', 'Safe file uploads', 'Tải file lên an toàn', 'Kiểu file thật · Kích thước · Lưu R2/S3 · Không chạy file tải lên'],
      ['xml-deser', 'Dangerous parsing: XML, YAML, deserialisation', 'Phân tích nguy hiểm: XML, YAML, deserialize', 'XXE · Prototype pollution'],
      ['redos', 'Denial of service in your own code', 'Tự gây từ chối dịch vụ trong code của mình', 'ReDoS · Payload khổng lồ · Giới hạn kích thước'],
    ]],
    ['Chapter 7 — Secrets and configuration', 'Chương 7 — Bí mật và cấu hình', 'Khoá API, .env, và lộ bí mật qua Git/Docker/CI.', [
      ['env', 'Where secrets live, and where they must not', 'Bí mật sống ở đâu, và không được ở đâu', '.env · Biến môi trường · Secret manager'],
      ['git', 'Leaked secrets in Git history', 'Bí mật lộ trong lịch sử Git', 'gitleaks · Xoay khoá ngay · Trỏ khoá Git'],
      ['docker-ci', 'Secrets in Docker images and CI logs', 'Bí mật trong ảnh Docker và log CI', 'Tầng ảnh · Build secret · Che log · Trỏ khoá Docker, GitHub Actions'],
      ['frontend', 'What must never ship to the browser', 'Thứ không bao giờ được gửi xuống trình duyệt', 'NEXT_PUBLIC_* · Proxy backend cho API bên thứ ba'],
    ]],
    ['Chapter 8 — Supply chain and dependencies', 'Chương 8 — Chuỗi cung ứng và thư viện phụ thuộc', 'npm, lockfile, và gói độc.', [
      ['npm-audit', 'npm audit and reading advisories', 'npm audit và đọc cảnh báo bảo mật', 'Mức độ · Có thực sự ảnh hưởng không · Cập nhật an toàn'],
      ['goi-doc', 'Malicious packages and typosquatting', 'Gói độc và giả tên', 'Sự cố thật có nguồn · postinstall · Khoá phiên bản'],
      ['dependabot', 'Dependabot, Renovate and SBOM', 'Dependabot, Renovate và SBOM', 'Tự động cập nhật · SBOM · Trỏ khoá GitHub Actions Ch14'],
      ['it-phu-thuoc', 'Fewer dependencies, fewer problems', 'Ít phụ thuộc, ít rắc rối', 'Đánh giá gói trước khi thêm · Tự viết khi nào'],
    ]],
    ['Chapter 9 — Logging, monitoring and incident response', 'Chương 9 — Log, giám sát và xử lý sự cố', 'Phát hiện và phản ứng khi bị tấn công.', [
      ['log', 'Security logging without leaking data', 'Ghi log bảo mật mà không làm lộ dữ liệu', 'Log gì · Không log mật khẩu/token · Định danh request'],
      ['phat-hien', 'Detecting attacks', 'Phát hiện tấn công', 'Tăng đột biến 401/403 · Quét đường dẫn · Cảnh báo'],
      ['ung-pho', 'Incident response for a small team', 'Xử lý sự cố cho đội nhỏ', 'Xoay khoá · Cách ly · Thông báo · Rút kinh nghiệm'],
      ['sao-luu', 'Backups and ransomware thinking', 'Sao lưu và tư duy chống mã độc tống tiền', 'Bản sao ngoại tuyến · Diễn tập khôi phục'],
    ]],
    ['Chapter 10 — Security review for your project', 'Chương 10 — Rà soát bảo mật cho dự án của bạn', 'Tự rà soát đồ án/dự án và trả lời phỏng vấn.', [
      ['checklist', 'A security checklist for Node + Next.js apps', 'Checklist bảo mật cho ứng dụng Node + Next.js', 'Từng mục có lệnh kiểm'],
      ['cong-cu', 'Scanners: ZAP, Semgrep, CodeQL', 'Công cụ quét: ZAP, Semgrep, CodeQL', 'Chạy trên app thử · Đọc kết quả · Dương tính giả'],
      ['ra-soat', 'Reviewing a real codebase', 'Rà soát một codebase thật', 'Đi theo luồng dữ liệu · Tìm chỗ tin client'],
      ['phong-van', 'Security interview questions', 'Câu hỏi phỏng vấn bảo mật', 'Câu hay gặp và ý trả lời'],
    ]],
    ['Chapter 11 — Capstone: break and fix an app', 'Chương 11 — Dự án cuối khoá: phá rồi vá một ứng dụng', 'App "Đặt lịch phòng khám" có 10 lỗ hổng cài sẵn.', [
      ['tim-lo', 'Finding the ten vulnerabilities', 'Tìm mười lỗ hổng', 'Dùng mọi kỹ thuật trong khoá trên app thử'],
      ['va', 'Fixing them properly', 'Vá cho đúng', 'Sửa tận gốc · Không vá tạm'],
      ['test', 'Regression tests so they never return', 'Test hồi quy để lỗ không quay lại', 'Test bảo mật trong CI'],
      ['bao-cao', 'Writing the security report', 'Viết báo cáo bảo mật', 'Mức độ · Bằng chứng · Khuyến nghị · Checklist cả khoá'],
    ]],
  ]),
};
