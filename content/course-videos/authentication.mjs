/**
 * Curated YouTube track for the "Authentication" course.
 * ─────────────────────────────────────────────────────────────────────────────
 * One entry per non-quiz lesson slug → the third-party lecture shown on the YT
 * pill of the learn page, until the Vietnamese/English recordings are made.
 *
 * ⚠️ CREDIT ĐỂ TRỐNG LÀ CỐ Ý — CHƯA XÁC MINH ĐƯỢC TỪ MÁY DỰNG.
 * Mọi id lấy từ kết quả tìm kiếm SỐNG (25/08/2026), kèm tiêu đề mong đợi ghi ở
 * chú thích cuối dòng. Máy dựng khoá bị chặn ra youtube.com nên KHÔNG gọi được
 * oEmbed ⇒ không đọc được tên kênh, không biết video có cho nhúng hay không.
 * verify coi credit rỗng là HỢP LỆ; --fix-credits điền đúng "Kênh — Tiêu đề".
 *
 * CHẠY HAI LỆNH NÀY THEO ĐÚNG THỨ TỰ:
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/authentication.mjs --fix-credits
 *   node scripts/course-video-seed.mjs --file ./content/course-videos/authentication.mjs --apply
 *
 * Lệnh đầu in ra link nào đã chết (✗) — thay link đó rồi chạy lại. Lệnh sau sẽ
 * TỪ CHỐI --apply khi còn credit rỗng. Credit thật lệch hẳn tiêu đề mong đợi ở
 * chú thích cùng dòng ⇒ id trỏ nhầm video, báo lại để đổi.
 *
 * QUIZ lessons are deliberately absent — they have no video frame.
 */
export default {
  courseSlug: 'authentication',
  defaultVideoTrack: 'YT',
  lessons: {
    /* ── Mục 0 — Bài toán, và một bộ khung chạy được ── */
    'auth-0-1-giao-thuc-quen': { yt: '2PPSXonhIck', credit: 'Code Realm — Authentication on the Web (Sessions, Cookies, JWT, localStorage, and more)' }, // Authentication on the Web (Sessions, Cookies, JWT, localStorage, and more)
    'auth-0-2-ba-bai-toan': { yt: 'z9-_YQWxwJ4', credit: 'TechStack Journey — Cookies vs Sessions vs JWT Authentication Explained | Web Security Simplified' },    // Cookies vs Sessions vs JWT Authentication Explained | Web Security Simplified
    'auth-0-3-dang-nhap-sai': { yt: 'ZKM5IiBmqO4', credit: 'Technical MotaBhai — OWASP TOP 10 - Broken Authentication and Session Managment' },  // OWASP TOP 10 - Broken Authentication and Session Management

    /* ── Chương 1 — Tín vật, và những nguyên thuỷ bên dưới ── */
    'auth-1-1-tin-vat-mang-theo': { yt: 'AYXvbe6vd2g', credit: 'Glabay — Why JWT? Sessions vs Stateless Auth Breakdown' },        // Why JWT? Sessions vs Stateless Auth Breakdown
    'auth-1-2-ngau-nhien': { yt: '-8JHxAKJ3Cw', credit: 'procademy — Hashing Password with Salt Using Bcrypt | Complete Node JS + Express Course with MongoDB | Part #149' },               // Hashing Password with Salt Using Bcrypt | Complete Node JS
    'auth-1-3-so-sanh-hang-thoi-gian': { yt: 'Y4joeekt5Ew', credit: 'Learning Software — jwt signature and validation explained' },   // jwt signature and validation explained
    'auth-1-4-bam-mac-chu-ky': { yt: 'PG9_lJsOShM', credit: 'Sudipto Kumar Mukherjee — JWT Token Explained in Depth | Header, Payload, Signature | HS256 | .NET & Web API Interview Guide' },           // JWT Token Explained in Depth | Header, Payload, Signature | HS256
    'auth-1-5-bi-mat-ro-o-dau': { yt: 'O3YktuvsYDk', credit: 'Luke Briner — OWASP Top 10 2017 - A2 Broken Authentication' },          // OWASP Top 10 2017 - A2 Broken Authentication

    /* ── Chương 2 — Mật khẩu ── */
    'auth-2-1-da-co-csdl': { yt: 'ro1WmoP4CZs', credit: 'Coding With Chaim — Bcrypt Tutorial in Nodejs | Understand Hashing, Salt, Rainbow Tables and Bcrypt' },      // Bcrypt Tutorial in Nodejs | Understand Hashing, Salt, Rainbow Tables and Bcrypt
    'auth-2-2-chon-va-chinh': { yt: 'QfIjU7l7OcE', credit: 'Thapa Technical — Bcrypt vs Argon2 – Which is the Best Password Hashing Algorithm?' },   // Bcrypt vs Argon2 – Which is the Best Password Hashing Algorithm?
    'auth-2-3-luong-dang-nhap': { yt: 'A6f1zYX2BCk', credit: 'Code Realm — Authentication in Node.js - #6 Password Security' }, // Authentication in Node.js - #6 Password Security
    'auth-2-4-chinh-sach': { yt: 'dtBNNV6PzPA', credit: 'Jadi — How to Use BCrypt to Store Passwords Securely: A Guide to Hashing Best Practices' },      // How to Use BCrypt to Store Passwords Securely: A Guide to Hashing Best Practices
    'auth-2-5-chuyen-doi': { yt: 'qliCp4U-NxY', credit: 'Oppkey — 05 Python Password Hashing Explained (bcrypt, Passlib, Argon2)' },      // 05 Python Password Hashing Explained (bcrypt, Passlib, Argon2)

    /* ── Chương 3 — Phiên và cookie ── */
    'auth-3-1-bang-phien': { yt: 'FVmxtmzyrSw', credit: 'CoderOne — Stop using JSON Web Tokens. Use Cookies & Server Sessions instead' },        // Stop using JSON Web Tokens. Use Cookies & Server Sessions instead
    'auth-3-2-thuoc-tinh-cookie': { yt: '3asMiTut9x4', credit: 'CodeLucky — 🔒 PHP Cookie Security: Secure, HttpOnly & SameSite Explained!' }, // PHP Cookie Security: Secure, HttpOnly & SameSite Explained!
    'auth-3-3-tai-sinh-phien': { yt: '98qu0k1KPLs', credit: 'Dev Academy — Sessions vs Tokens 🧪 COOKIES vs JWT [Authentication]' },    // Sessions vs Tokens — COOKIES vs JWT [Authentication]
    'auth-3-4-csrf': { yt: 'kT1SVkkgE6k', credit: 'CyberSecurityTV — Can you prevent CSRF with Same-Site?' },              // Can you prevent CSRF with Same-Site?
    'auth-3-5-phien-song-o-dau': { yt: '01TfhmfzFUw', credit: 'dhandrohit — CookieSession Vs JWT' },  // CookieSession Vs JWT

    /* ── Chương 4 — Token: JWT nhìn từ bên trong ── */
    'auth-4-1-giai-ma-bang-tay': { yt: 'G3DtePAR7Fc', credit: 'average:dev — JSON Web Tokens (JWT) Explained in 1 Minute' },  // JSON Web Tokens (JWT) Explained in 1 Minute
    'auth-4-2-truong-alg': { yt: 'd-X9CmpnJdE', credit: 'Intigriti — JWT Authentication Bypass via Algorithm Confusion' },        // JWT Authentication Bypass via Algorithm Confusion
    'auth-4-3-cac-claim': { yt: 'xrj3zzaqODw', credit: 'Chai aur Code — What is JWT token and JWT vs Sessions' },         // What is JWT token and JWT vs Sessions
    'auth-4-4-khoa-va-jwks': { yt: '78FIFrOi4Os', credit: 'Intigriti — JWT Authentication Bypass via kid Header Path Traversal' },      // JWT Authentication Bypass via kid Header Path Traversal
    'auth-4-5-cat-token-o-dau': { yt: 'Qm64zinOVpc', credit: 'Code Maze — How to Use HttpOnly Cookie to Secure JSON Web Tokens (JWT) in ASP.NET Core Web API' },   // How to Use HttpOnly Cookie to Secure JSON Web Tokens (JWT) in ASP.NET Core Web API

    /* ── Chương 5 — Làm mới, xoay vòng và thu hồi ── */
    'auth-5-1-hai-token': { yt: 'HJ09m-xFvTk', credit: 'Deeecode — Why exactly are refresh tokens so important?' },            // Why exactly are refresh tokens so important?
    'auth-5-2-xoay-vong': { yt: 's-4k5TcGKHg', credit: 'Dave Gray — Refresh Token Rotation and Reuse Detection in Node.js JWT Authentication' },            // Refresh Token Rotation and Reuse Detection in Node.js JWT Authentication
    'auth-5-3-nam-su-kien': { yt: 'No_4N6o8e7k', credit: 'Scalable Scripts — NodeJS Revoke JWT Tokens' },          // NodeJS Revoke JWT Tokens
    'auth-5-4-danh-sach-thiet-bi': { yt: 'pkKn8q5AvsY', credit: 'Sheryians Coding School — Complete Authentication System | JWT, Refresh Token, OTP, Logout All Devices' },   // Complete Authentication System | JWT, Refresh Token, OTP, Logout All Devices
    'auth-5-5-cuoc-dua-refresh': { yt: 'KzJKziZd6dg', credit: 'Thapa Technical — Refreshing Access Token When It Expires (Session + JWT)' },     // Refreshing Access Token When It Expires (Session + JWT)

    /* ── Chương 6 — Vòng đời tài khoản ── */
    'auth-6-1-dang-ky': { yt: '72h76ufOXeE', credit: 'Desi Programmer — Node JS Auth | Reset Password , Verify Account , Send Email and Other Features' },           // Node JS Auth | Reset Password, Verify Account, Send Email and Other Features
    'auth-6-2-xac-minh-email': { yt: 'CEim3tZsp1Y', credit: 'Awais Mirza — Email Account Verification - Node and Express' },    // Email Account Verification - Node and Express
    'auth-6-3-dat-lai-mat-khau': { yt: 'jtBg55vN2l0', credit: 'JB WEBDEVELOPER — EP 10 Building Forgot Password, Verify Token, and Reset Password Endpoints - Node.js API Development' },  // EP 10 Building Forgot Password, Verify Token, and Reset Password Endpoints
    'auth-6-4-do-tai-khoan': { yt: 'YXjORp170Lg', credit: 'Code With Yousaf — Forgot Password and Reset Password in MERN Stack | MERN Stack Authentication Tutorial' },      // Forgot Password and Reset Password in MERN Stack | MERN Stack Authentication Tutorial
    'auth-6-5-doi-email-va-xoa': { yt: 'kfw61IxDgW8', credit: 'Awais Mirza — Forget Password and Reset Password in Node and Express' },  // Forget Password and Reset Password in Node and Express

    /* ── Chương 7 — Yếu tố thứ hai, và passkey ── */
    'auth-7-1-yeu-to-thu-hai': { yt: 'whSBD8YbVlc', credit: 'Cooptonian — Authentik - Implementing 2FA/MFA (TOTP & Duo Push)' },          // Authentik - Implementing 2FA/MFA (TOTP & Duo Push)
    'auth-7-2-totp': { yt: 'S_crOiB_MXw', credit: 'BasselTech — Python 2FA: TOTP in Minutes' },                    // Python 2FA: TOTP in Minutes
    'auth-7-3-dang-ky-va-khoi-phuc': { yt: '61PuyaIvk54', credit: 'Mobile Jon — Setting up and Using FIDO2 Passkeys in Microsoft Entra' },    // Setting up and Using FIDO2 Passkeys in Microsoft Entra
    'auth-7-4-passkey': { yt: 'KRlyv9mftTo', credit: 'FIDO Alliance — Passkeys 101: Technical Principles of FIDO' },                 // Passkeys 101: Technical Principles of FIDO
    'auth-7-5-trien-khai-passkey': { yt: 'hxmFNUuu8qg', credit: 'Conf42 — Implementing FIDO2 and WebAuthn for a Secure Future | Sairam Durgaraju | Conf42 Python 2025' },      // Implementing FIDO2 and WebAuthn for a Secure Future | Sairam Durgaraju | Conf42 Python 2025

    /* ── Chương 8 — OAuth 2.1 và OpenID Connect ── */
    'auth-8-1-oauth-la-gi': { yt: 'u9dxjB0KgPg', credit: 'José Cruz (IT Architect) — OAuth 2.0 Authorization Code Flow & OpenID Connect – Complete Walkthrough' },          // OAuth 2.0 Authorization Code Flow & OpenID Connect – Complete Walkthrough
    'auth-8-2-luong-code-pkce': { yt: '7JlIQ6Wwu4k', credit: 'Network Technician — OAuth 2.0 Authorization Code Flow with PKCE: Complete Implementation Guide' },      // OAuth 2.0 Authorization Code Flow with PKCE: Complete Implementation Guide
    'auth-8-3-state-nonce-redirect': { yt: '8y76W9FdHjE', credit: 'Auth0 — Demystifying OAuth Security: State vs. Nonce vs. PKCE' }, // Demystifying OAuth Security: State vs. Nonce vs. PKCE
    'auth-8-4-id-token': { yt: 'IW15Q68V50E', credit: 'hexaDefence — Keycloak Authorization Code Flow | OpenID Connect' },             // Keycloak Authorization Code Flow | OpenID Connect
    'auth-8-5-lam-client-that': { yt: 'TfQZqhhWxVs', credit: 'Tech Journey With Ankit — Unlock the Power of OAuth 2.0 🔐 | Authorization Code Flow + Step-by-Step Demo #salesforce' },      // Unlock the Power of OAuth 2.0 | Authorization Code Flow + Step-by-Step Demo

    /* ── Chương 9 — Các mô hình phân quyền ── */
    'auth-9-1-phan-quyen-la-gi': { yt: 'qprypVZ6Pxo', credit: 'Descope — Authorization 101 For Developers | RBAC, ReBAC, and ABAC' },      // Authorization 101 For Developers | RBAC, ReBAC, and ABAC
    'auth-9-2-rbac': { yt: 'HHuiV841g_w', credit: 'Dipesh Malvia — Node.js & Express Role-Based Authorization Tutorial | How to Manage User Roles and Permission' },                  // Node.js & Express Role-Based Authorization Tutorial | How to Manage User Roles and Permission
    'auth-9-3-abac-rebac': { yt: 'zFQHn1nk-uw', credit: 'Dipesh Malvia — Node js & Express Attribute Based Authorization Tutorial | How to Manage User Roles and Permission' },            // Node js & Express Attribute Based Authorization Tutorial
    'auth-9-4-nhieu-tenant': { yt: '7HHohzuh5Bs', credit: 'Djamware Tutorial — Authentication Role Permission API using Node Express MySQL' },          // Authentication Role Permission API using Node Express MySQL
    'auth-9-5-dat-phep-kiem-o-dau': { yt: 'tNnXLE1l9PI', credit: 'Evoqys — Node.js Admin Middleware: Role-Based Access Control with Prisma ORM | Mastering Authorization' },   // Node.js Admin Middleware: Role-Based Access Control

    /* ── Chương 10 — Các đòn tấn công, theo thứ tự hay gặp ── */
    'auth-10-1-nhoi-tin-vat': { yt: 'DFANIs0CugI', credit: 'Imperva, a Thales Company — OWASP Automated Threats Explained - Credential Cracking | Credential Stuffing' },         // OWASP Automated Threats Explained - Credential Cracking | Credential Stuffing
    'auth-10-2-lua-dao': { yt: 'fhkCV9i698U', credit: 'Nate Hutchinson — How to stop AiTM token phishing in Microsoft 365' },              // How to stop AiTM token phishing in Microsoft 365
    'auth-10-3-cap-phien': { yt: 'G-d1cZosd9M', credit: 'Huntress — How Adversary-in-the-Middle (AitM) Attacks Steal Session Tokens & Bypass MFA' },            // How Adversary-in-the-Middle (AitM) Attacks Steal Session Tokens & Bypass MFA
    'auth-10-4-tang-con-nguoi': { yt: 'tnTtx2qJkOc', credit: 'Keytos Security — What is MFA Fatigue Attack' },       // What is MFA Fatigue Attack
    'auth-10-5-chiem-truoc-va-dua': { yt: 'pOBRbC7rbMU', credit: 'SC Media - A CRA Resource — Browser Security Explained: How Attackers Steal Sessions, Bypass MFA & Phish Users' },   // Browser Security Explained: How Attackers Steal Sessions, Bypass MFA & Phish Users

    /* ── Chương 11 — Vận hành ── */
    'auth-11-1-bi-mat': { yt: 'DIVQdzgWEiY', credit: 'dotenvx — 10x your .env security with encryption to .env.vault files' },              // 10x your .env security with encryption to .env.vault files
    'auth-11-2-xoay-khoa': { yt: '4ebOexB3GHE', credit: 'Merge Ready — Secrets Management: Vault vs AWS Secrets Manager (Rotation & CI/CD)' },           // Secrets Management: Vault vs AWS Secrets Manager (Rotation & CI/CD)
    'auth-11-3-gioi-han-tan-suat': { yt: 'sdYcxzTjdbo', credit: 'Josh tried upstash — Protect Your API With Rate Limiting | Full Guide (2024)' },   // Protect Your API With Rate Limiting | Full Guide (2024)
    'auth-11-4-nhat-ky-kiem-toan': { yt: 'IGZyF-fWybQ', credit: 'ThreatLocker — MFA is Not Enough: How to Stop Phishing and Session Hijacking Attacks' },   // MFA is Not Enough: How to Stop Phishing and Session Hijacking Attacks
    'auth-11-5-giam-sat': { yt: 'n9zMCr9ROW0', credit: 'T-Minus365 — Why Your MFA Can Still Be Hacked (How I’d Implement MFA in 2026)' },            // Why Your MFA Can Still Be Hacked (How I'd Implement MFA in 2026)

    /* ── Chương 12 — Chẩn đoán, và bắt đầu từ đâu ── */
    'auth-12-1-nam-phut-dau': { yt: '-Wi4klZ01tQ', credit: 'ASP.NET MVC — Fix: ASP.NET core JWT authentication always throwing 401 unauthorized after token generated' },   // Fix: ASP.NET core JWT authentication always throwing 401 unauthorized after token generated
    'auth-12-2-tam-hinh-dang': { yt: 'RSQGADU3SLA', credit: 'EvilTester - Software Testing — API Testing Challenges 29 - How To - authentication failed 401' },  // API Testing Challenges 29 - How To - authentication failed 401
    'auth-12-3-hop-do-nghe': { yt: '3KaBzxLIgCo', credit: 'Train To Code — Ultimate Guide To CORS' },    // Ultimate Guide To CORS
    'auth-12-4-soat-kho-ma': { yt: 'AJudDioDqew', credit: 'cdruc — Debugging Laravel Sanctum 401 response' },    // Debugging Laravel Sanctum 401 response
    'auth-12-5-loi-ket': { yt: 'PEJXK_ku89s', credit: 'Good Morning Developers — Web Token vs. Cookie Authentication: Explained In 10 Minutes' },        // Web Token vs. Cookie Authentication: Explained In 10 Minutes
  },
};
