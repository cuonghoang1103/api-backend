# Liên kết chéo Node.js Chương 8 (xác thực & phân quyền) ↔ khoá Authentication ↔ khoá API Design

Đợt 7 video Node.js, 01/11/2026. Deep link: `/courses/<slug-khoá>/learn?lessonSlug=<slug-bài>` (Courses: `nodejs`, `authentication`, `api-design`).
Khối `<a class="link-card lien-ket-cheo">` cuối `ml-en` và cuối `ml-vi`, HAI CHIỀU. Thẻ ở bài Node nói "Bạn đã học phần này ở khoá …"; thẻ ở bài kia nói "Áp vào Node.js — bài 8.x".
Mọi bài đích viết tay (không có header FILE SINH TỰ ĐỘNG). Lời video (`src/bai/node-8-*/kichban.ts`) nhắc cùng các bài ở đúng cảnh và ghi trong `LIEN_KET`.
Chỗ API Design đã đo thì Node dẫn sang, không đo lại; số giữ nhất quán: access token 15 phút (900 s), lần đoán sai thứ 6 ⇒ 429 (Node: Retry-After 60, API Design: 180 — hai cấu hình khác nhau, nói rõ trong bài).

| Node.js | Bài kia | Giống | Node.js thêm (đo thật, Node 22.23.3 + Express 5.3.0 + PostgreSQL 17) |
|---|---|---|---|
| `nodejs-8-1-mat-khau-va-bam` | `authentication/auth-2-1-da-co-csdl` | mối đe doạ = bảng user bị chép, băm nhanh là sai công cụ | SHA-256 2.010.039/s vs bcrypt 12 ≈ 3,6/s, bảng cầu vồng 1 triệu mục 1.059 ms, muối trên dòng thật |
| `nodejs-8-1-mat-khau-va-bam` | `authentication/auth-2-2-chon-va-chinh` | argon2id trước, bcrypt/scrypt dự phòng, chuỗi tự mô tả, chỉnh bằng đo | 64 đăng nhập song song (RSS bị thread pool chặn), hashSync đóng băng server (/health 2.784 ms), bẫy 72 byte với câu tiếng Việt, rò thời gian 27,4× → 1,0× |
| `nodejs-8-2-jwt-access-refresh` | `authentication/auth-4-2-truong-alg` | alg nằm trong tay kẻ tấn công, máy chủ chốt thuật toán | jsonwebtoken 9.0.3 chặn cả hai đòn, bộ kiểm tự viết ra admin, decode vs verify, 48.103 verify/s |
| `nodejs-8-2-jwt-access-refresh` | `authentication/auth-5-2-xoay-vong` | refresh dùng một lần theo họ, tái dùng ⇒ thu hồi cả họ | REUSE_DETECTED/REFRESH_REVOKED trên PostgreSQL, hai tab refresh cùng lúc, sự cố token 3 s trong cookie 30 ngày |
| `nodejs-8-2-jwt-access-refresh` | `api-design/api-6-1-xac-thuc` | HS256 15 phút, token giả / alg none bị từ chối | mổ token tay, issuer/audience, refresh xoay vòng lưu SHA-256 |
| `nodejs-8-3-requireauth-phan-quyen` | `api-design/api-6-2-phan-quyen` | đổi id đọc đồ người khác (BOLA/IDOR), một quy tắc + 404 | sáu lần từ chối có mã, tra user 0,026 → 0,664 ms, thứ tự middleware chạy thật, canTouch |
| `nodejs-8-3-requireauth-phan-quyen` | `authentication/auth-9-5-dat-phep-kiem-o-dau` | phép kiểm ở một chỗ để không thể quên | actor tham số đầu, IDOR chạy thật rồi đóng, test quy tắc không cần HTTP |
| `nodejs-8-4-cookie-csrf-thu-hoi` | `authentication/auth-3-4-csrf` | CSRF, ba lớp phòng theo thứ tự | ma trận SameSite trong Chromium 149 (không khai SameSite: POST chéo trang vẫn kèm cookie trong 2 phút đầu), bốn endpoint ngân hàng, HttpOnly |
| `nodejs-8-4-cookie-csrf-thu-hoi` | `api-design/api-6-4-cors` | trình duyệt tự gửi gì / cho đọc gì; Bearer không có CSRF | phía cookie: HttpOnly vs localStorage, double submit, tokenVersion |
| `nodejs-8-4-cookie-csrf-thu-hoi` | `api-design/api-6-1-xac-thuc` | lần sai thứ 6 ⇒ 429 + Retry-After | khoá IP + email, đếm trước khi kiểm, trust proxy + X-Forwarded-For giả |
| `nodejs-8-4-cookie-csrf-thu-hoi` | `api-design/api-8-3-mo-rong` | bộ đếm trong RAM một tiến trình hết là giới hạn khi có hai bản chạy | chính bộ chặn Map + 429, thu hồi bằng tokenVersion |
| `nodejs-8-4-cookie-csrf-thu-hoi` | `authentication/auth-11-3-gioi-han-tan-suat` | bộ chặn đăng nhập theo khoá, 429 + Retry-After | bộ chặn nhỏ trong Express tấn công thật, header RateLimit-* |

Đã có từ trước (không thêm): SDN302 5.1/5.2 ↔ Node 8.x (`sdn302-nodejs.md`), SDN302 ↔ API Design (`sdn302-api-design.md`).
Chỉ nhắc trong lời video, CHƯA đặt thẻ web (đã có thẻ gần nghĩa hơn): Authentication 2.3, 2.5, 3.1, 3.2, 3.3, 4.1, 4.5, 5.1, 5.5, 6.3, 9.2.
