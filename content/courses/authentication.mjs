/**
 * Authentication — khoá học CuongThai (Courses, academyType=GENERAL, KHÔNG thuộc kỳ Academy).
 * Giáo trình tự soạn: 13 mục (Mục 0 + Chương 1–12), zero → vận hành xác thực production, song ngữ EN/VI.
 * Sections tách theo file trong ./authentication/ cho dễ soạn; seeder chỉ đọc file này.
 *
 * KHÔNG trùng Node.js Chương 8 (Authentication & authorization) và Chương 9 (Application
 * security): hai chương đó dạy DỰNG xác thực cho Notes API bằng Express. Khoá này dạy
 * CHÍNH bài toán danh tính — mật khẩu và hàm băm, phiên đối lại token, JWT từ bên trong,
 * xoay vòng và thu hồi, vòng đời tài khoản, đa yếu tố và passkey, OAuth 2.1/OIDC, phân
 * quyền, các kiểu tấn công, vận hành và chẩn đoán.
 *
 * Kiểm trước khi seed:
 *   node scripts/course-content-check.mjs ./content/courses/authentication.mjs
 *   node scripts/course-depth-audit.mjs   ./content/courses/authentication.mjs
 * Seed: node scripts/course-seed.mjs --file ./content/courses/authentication.mjs --apply
 */

import s00 from './authentication/s00-intro.mjs';
import s01 from './authentication/s01-tin-vat.mjs';
import s02 from './authentication/s02-mat-khau.mjs';
import s03 from './authentication/s03-phien-cookie.mjs';
import s04 from './authentication/s04-jwt.mjs';
import s05 from './authentication/s05-refresh.mjs';
import s06 from './authentication/s06-vong-doi-tai-khoan.mjs';
import s07 from './authentication/s07-mfa-passkey.mjs';
import s08 from './authentication/s08-oauth-oidc.mjs';
import s09 from './authentication/s09-phan-quyen.mjs';
import s10 from './authentication/s10-tan-cong.mjs';
import s11 from './authentication/s11-van-hanh.mjs';
import s12 from './authentication/s12-chan-doan.mjs';

export default {
  category: { slug: 'backend', name: 'Backend', icon: 'Server', sortOrder: 1 },
  course: {
    slug: 'authentication',
    title: 'Authentication',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: true,
    // Sinh bằng scripts/course-cover.mjs (logo Simple Icons chính thức trên nền
    // bìa dùng chung của CuongThai). Sinh lại, KHÔNG sửa tay:
    //   docker exec cuonghoangdev_backend node scripts/course-cover.mjs \
    //     --slug authentication --icon openid --color F78C40 \
    //     --title "Authentication" --subtitle "Login → Production"
    // (Nếu slug "openid" trả 404 ở Simple Icons thì lùi về --icon auth0 --color EB5424.)
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/authentication.png?v=3',
    shortDescription: 'Proving who someone is, over a protocol that forgets: how to store a password, why a session and a token are the same problem with different failure modes, and how every account recovery flow becomes the weakest link.|||Chứng minh một người là ai, qua một giao thức vốn không nhớ gì: cất mật khẩu thế nào cho đúng, vì sao phiên và token là cùng một bài toán với hai kiểu hỏng khác nhau, và vì sao mọi đường khôi phục tài khoản đều thành mắt xích yếu nhất.',
    description: 'Khoá Authentication từ số 0 tới mức vận hành được hệ xác thực cho một sản phẩm thật, do CuongThai tự biên soạn. 13 mục đi từ ba bài toán bị gộp làm một (danh tính, xác thực, phân quyền), qua mật khẩu và hàm băm chậm, phiên với cookie, JWT mổ từ bên trong, refresh token có xoay vòng và phát hiện tái dùng, vòng đời tài khoản (xác minh email, đặt lại mật khẩu, khôi phục), đa yếu tố TOTP và passkey WebAuthn, OAuth 2.1 với OpenID Connect, phân quyền RBAC/ABAC/ReBAC, các kiểu tấn công theo tần suất thật, cho tới vận hành và một sách công thức chẩn đoán. Mọi ví dụ chạy thật trên Node.js 22 + Express + PostgreSQL.',
    whatYouLearn: 'Cất mật khẩu bằng Argon2id với tham số chọn theo số đo chứ không theo bài blog; biết chính xác một phiên và một JWT khác nhau ở đâu và cái nào phù hợp với sản phẩm của bạn; đọc được một token bằng tay và nhận ra tấn công alg confusion; dựng refresh token có xoay vòng và phát hiện tái dùng cả họ token; thiết kế đường đặt lại mật khẩu không rò danh sách người dùng; cài TOTP đúng RFC 6238 và hiểu vì sao passkey làm phishing bất khả thi; đi hết luồng OAuth 2.1 authorization code + PKCE và biết vì sao implicit đã chết; chọn giữa RBAC, ABAC và ReBAC bằng câu hỏi của sản phẩm; và chẩn đoán một sự cố xác thực bằng nhật ký kiểm toán thay vì bằng phỏng đoán.',
    requirements: 'Biết một ngôn ngữ lập trình ở mức viết được hàm và đọc được mã (ví dụ dùng JavaScript/TypeScript trên Node.js). Biết HTTP ở mức request/response, header và status code — khoá Nền tảng Lập trình Web của CuongThai đủ cho phần đó. KHÔNG cần biết bảo mật trước: Mục 0 dựng lại từ đầu. Có Node.js 22 và một PostgreSQL chạy được (Docker là nhanh nhất) để làm theo phần thực hành.',
    documentsNote: 'Tài liệu tham chiếu chính: OWASP Cheat Sheet Series (Authentication, Session Management, Password Storage — đọc trước mọi thứ khác) • RFC 6749 + RFC 9700 (OAuth 2.0 và bản thực hành bảo mật hiện hành) • OpenID Connect Core 1.0 • RFC 7519 và RFC 8725 (JWT và JWT BCP) • RFC 6238 (TOTP) • W3C WebAuthn Level 3 • NIST SP 800-63B (Digital Identity Guidelines). Phần thực hành đi kèm: track "Authentication" trên Code Lab.',
  },
  sections: [
    s00,
    s01,
    s02,
    s03,
    s04,
    s05,
    s06,
    s07,
    s08,
    s09,
    s10,
    s11,
    s12,
  ],
};
