# Liên kết chéo Node.js Chương 9 (bảo mật ứng dụng) ↔ API Design ↔ Authentication (+ Web Security một chiều)

Đợt 8 video Node.js, 01/11/2026. Deep link: `/courses/<slug-khoá>/learn?lessonSlug=<slug-bài>` (Courses: `nodejs`, `api-design`, `authentication`).
Khối `<a class="link-card lien-ket-cheo">` cuối `ml-en` và cuối `ml-vi`, HAI CHIỀU (trừ Web Security). Thẻ ở bài Node nói "Bạn đã học phần này ở khoá …"; thẻ ở bài kia nói "Áp vào Node.js — bài 9.x".
Mọi bài đích viết tay (không có header FILE SINH TỰ ĐỘNG). Lời video (`src/bai/node-9-*/kichban.ts`) nhắc cùng các bài ở đúng cảnh và ghi trong `LIEN_KET`.
Chỗ API Design đã đo thì Node dẫn sang, không đo lại: CORS trong Chromium thật (6.4), safeFetch đầy đủ (6.3).

| Node.js | Bài kia | Giống | Node.js thêm (đo thật, Node 22.23.3 + Express 5.3.0 + Chromium 149) |
|---|---|---|---|
| `nodejs-9-1-header-csp-cors` | `api-design/api-6-4-cors` | CORS chỉ quyết định ai được ĐỌC; danh sách trắng + Vary, không phản chiếu kèm credentials | header thật của 4 cấu hình cors (origin bị từ chối vẫn 204 ở preflight), POST chuyển tiền trên server không CORS, cache dùng chung trả nhầm origin khi thiếu Vary, 12 header helmet |
| `nodejs-9-2-xss-va-sanitize` | `authentication/auth-4-5-cat-token-o-dau` | lỗ XSS thật sự mang lại gì: script chạy trong phiên dù đọc được token hay không | stored XSS đầu-cuối trong Chromium (cookie bay; httpOnly vẫn bị xoá dữ liệu; sanitize/CSP chặn), 9 payload do trình duyệt phán, giá sanitize |
| `nodejs-9-3-dau-vao-doc-hai` | `api-design/api-6-3-owasp-api` | SSRF và cách chặn: https, kiểm IP sau phân giải, không theo chuyển hướng mù | bí mật nội bộ qua route xem trước, allow-list bị cú 302 đi vòng, kiểm từng chặng, new URL() chuẩn hoá; + ReDoS, ô nhiễm nguyên mẫu, giới hạn thân request |
| `nodejs-9-4-bi-mat-va-phu-thuoc` | `authentication/auth-1-3-so-sanh-hang-thoi-gian` | === rò thời gian; timingSafeEqual ném lỗi khi khác độ dài; so bản băm | bí mật JWT yếu bẻ từ một token (HMAC thô ~880k/s/nhân), lỗi 500 khai gì, dependency lấy env lúc chạy |
| `nodejs-9-4-bi-mat-va-phu-thuoc` | `authentication/auth-11-1-bi-mat` | bí mật tới tiến trình lúc chạy, sinh bằng máy, xoay được | vì sao 32 byte (tốc độ bẻ đo thật), NEXT_PUBLIC_* công khai, gitleaks ngoại lệ hẹp, quyền tối thiểu |

**Một chiều:** `nodejs-9-1-header-csp-cors` ⇒ `/courses/web-security` (trang khoá, KHÔNG lessonSlug) — khoá `web-security.mjs` mới là khung, chưa có bài nào (01/11/2026). Khi khoá có bài: đổi thẻ này thành thẻ hai chiều theo đúng bài (CSP, XSS, clickjacking).
Đã có từ trước: SDN302 5.2 ↔ Node 9.1 (`sdn302-nodejs.md`).
Chỉ nhắc trong lời video, CHƯA đặt thẻ web: Media Processing 2.1 (SVG chạy JavaScript — hợp với Ch10), Object Storage 5.2 (preflight của bucket — Ch10), Node 2.4, 4.2, 4.3, 6.3, 8.2, 8.4.
