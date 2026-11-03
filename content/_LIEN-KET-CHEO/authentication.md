# Liên kết chéo khoá Authentication (Courses) ↔ Courses khác ↔ Academy

Đợt mẫu Mục 0 + Chương 1, 01/11/2026 — 12 cặp hai chiều (11 mới + 1 có sẵn: nodejs 9.4 ↔ 1.3) + 1 một chiều; api-design 6.1 có hai thẻ sang auth (1.1 và 1.4). Deep link `/courses/<slug-khoá>/learn?lessonSlug=<slug-bài>`. Khối `<a class="link-card lien-ket-cheo">`
cuối `ml-en` VÀ cuối `ml-vi` của đúng bài, HAI CHIỀU (trừ web-security — khoá còn là khung, chỉ trỏ tới trang khoá).
Phía Authentication dùng `lienKet({ khoa, bai, … })` của `authentication/_slides.mjs`; phía kia chèn HTML thẳng (script mẫu: `chen-the.py`
trong scratch của phiên soạn — tìm bài theo slug, chèn trước `</div>` đóng ml-en và ml-vi, bỏ qua nếu href đã có).
Mọi tệp đích là tệp viết tay (đã kiểm header "FILE SINH TỰ ĐỘNG": SDN302.mjs, PRJ301.mjs không có; `prj301/chuyen-sau.mjs` thì CÓ — không đụng).

| Authentication | Bài kia | Giống | Authentication thêm (đo thật, Node 22.23.3) |
|---|---|---|---|
| `auth-0-1-giao-thuc-quen` | Academy PRJ301 `prj301-cookie-session` | HTTP không nhớ; server giữ phiên, trình duyệt mang id (JSESSIONID) | thử nhớ theo IP (Bình thành An; An đổi sang 127.0.0.1 thành người lạ) và theo kết nối TCP, rồi thẻ mang theo |
| `auth-0-2-ba-bai-toan` | `api-design/api-6-2-phan-quyen` | đổi id đọc đồ người khác (BOLA/IDOR), sửa trong phép tra + 404 | ba cổng tách bạch: X-User-Id tự khai, quét usr_1…usr_4, ma trận 401/403/404 bốn người gọi |
| `auth-0-3-dang-nhap-sai` | Academy SDN302 `sdn302-5-1-passwords-sessions` | không lưu mật khẩu thô, không tin client | v0 không có lớp bảo vệ nào, tấn công thật: dump JSON, dò email, đoán phiên 4,37 s, 10.001 mật khẩu không giới hạn |
| `auth-1-2-ngau-nhien` | `api-design/api-11-2-rut-gon-link` | nghịch lý ngày sinh cho mã ngẫu nhiên | cận ngày sinh cho token (128 bit: 2,17e19), Math.random đoán từ 4 số, sai lệch modulo |
| `auth-1-3-so-sanh-hang-thoi-gian` | `nodejs/nodejs-9-4-bi-mat-va-phu-thuoc` (đã có từ trước, cả hai chiều) | === rò thời gian; timingSafeEqual cần cùng độ dài | đo trong/ngoài tiến trình, bẫy phép đo, webhook |
| `auth-1-3-so-sanh-hang-thoi-gian` | `api-design/api-10-4-nhan-webhook` | chữ ký trên thân gốc, hằng thời gian, dung sai 300 s | vì sao phải hằng thời gian (4,61 → 6,56 ns; 38,05 ns ở 1.024), safeEqual, tra digest |
| `auth-1-4-bam-mac-chu-ky` | `api-design/api-6-1-xac-thuc` | HS256 = HMAC-SHA256 với bí mật của server | length extension thật, khoá HMAC dùng chung ⇒ ai kiểm cũng phát token (Ed25519), CTR lật bit / GCM từ chối |
| `auth-1-5-bi-mat-ro-o-dau` | `nodejs/nodejs-9-4-bi-mat-va-phu-thuoc` | bí mật tới tiến trình lúc chạy; biến build front-end công khai; gitleaks | log/pino deny-list sót, lỗi axios chứa khoá 5 lần (9.771 byte), .env còn trong lịch sử, VITE_ trong bundle |
| `auth-1-7-lab-bo-cong-cu` | `testing/tst-5-2-xac-thuc` | tiêm đồng hồ, test hết hạn đúng biên (mốc exp đã là hết hạn) | dựng chính phía ký (giá trị có ký + kid + hạn, safeEqual, CSPRNG) và máy chấm hành vi tấn công nó |
| `auth-0-1-giao-thuc-quen` | `api-design/api-0-1-http` | mỗi request HTTP đứng một mình, server chỉ thấy method/đường dẫn/header | hệ quả với danh tính: nhớ theo IP và theo kết nối đều hỏng trên request thật |
| `auth-0-3-dang-nhap-sai` | `api-design/api-0-3-du-an-labflow` | cùng thế giới LabFlow (An/Bình/Cô Lan, Node 22, Express 5) | LabFlow ID — dịch vụ danh tính của nền tảng, tới Ch8 là OIDC provider cho LabFlow API |
| `auth-1-1-tin-vat-mang-theo` | `api-design/api-6-1-xac-thuc` | JWT/API key/phiên đều là bearer; access token 15 phút | token chép sang máy khác vẫn chạy, token trong URL vào access log, Referrer-Policy nào rò sang bên thứ ba (Chromium 156) |
| `auth-1-1-tin-vat-mang-theo` | `/courses/web-security` (một chiều, trang khoá) | XSS đọc được token trong storage | — (đổi thành hai chiều khi web-security có bài) |

Đã có từ trước, KHÔNG thêm lại: `nodejs-ch8-auth-apidesign.md` (Node 8.x ↔ auth 2.1/2.2/3.4/4.2/5.2/9.5/11.3), `nodejs-ch9-bao-mat.md`
(Node 9.4 ↔ auth 1.3/11.1; Node 9.2 ↔ auth 4.5), `prj301-nodejs-auth-postgresql.md` (PRJ301/SDN302 ↔ auth 3.2).
Ứng viên cho chương sau (ghi ở `_HOP-DONG.md` §11): SDN302 5.2 ↔ Ch4, testing 5.2 ↔ Ch4/Ch9, nodejs 8.1 ↔ Ch2 (đã có), api-design 6.1 ↔ Ch4/Ch10.

## Chương 2 (01/11/2026) — 3 cặp hai chiều mới + 2 cặp có sẵn giữ nguyên

| Authentication | Bài kia | Giống | Authentication thêm (đo thật, Node 22.23.3 + PostgreSQL 17.11) |
|---|---|---|---|
| `auth-2-3-luong-dang-nhap` | `api-design/api-6-1-xac-thuc` | mật khẩu chỉ băm, một endpoint đăng nhập | đo chính route đăng nhập rò gì: cùng 401 mà 37–39× → băm giả 1,0×; NFC; thân 8 kB ⇒ 413, logger trước bộ đọc; pepper (bài kia dùng scryptSync mặc định của Node) |
| `auth-2-4-chinh-sach` | `nodejs/nodejs-8-1-mat-khau-va-bam` | không luật pha trộn, không đổi định kỳ, HIBP k-ẩn danh | NIST 800-63B-4 (2025): tối thiểu 15 khi là yếu tố duy nhất (bài kia: 8–12 theo bản trước); 756/1.000 qua "viết hoa + 1!", Password1! 584.516 lần, HIBP gọi thật + treo ⇒ chọn mở |
| `auth-2-5-chuyen-doi` | `nodejs/nodejs-8-1-mat-khau-va-bam` | tham số trong chuỗi lưu ⇒ băm lại khi đăng nhập; bcrypt → argon2 | bọc 1.003 dòng MD5 ngay (17,1 s, không cần mật khẩu), xoá cột cũ cùng UPDATE, Ashley Madison 2015 (MD5 sót ⇒ 11 triệu) |

Có sẵn từ trước, giữ nguyên thẻ ở cả hai phía (sổ `nodejs-ch8-auth-apidesign.md`): `auth-2-1-da-co-csdl` ↔ `nodejs-8-1-mat-khau-va-bam`,
`auth-2-2-chon-va-chinh` ↔ `nodejs-8-1-mat-khau-va-bam`. Lab 2 (`auth-2-7-lab-luu-mat-khau`) chưa có cặp — SDN302 5.1 đã có 4 thẻ mỗi ngôn ngữ, không chèn thêm.

## Chương 3 (01/11/2026) — 4 cặp hai chiều mới + 3 cặp có sẵn giữ nguyên

| Authentication | Bài kia | Giống | Authentication thêm (đo thật, Chromium 156 + PostgreSQL 17.11 + Redis 7.4.9) |
|---|---|---|---|
| `auth-3-1-bang-phien` | `nodejs/nodejs-8-4-cookie-csrf-thu-hoi` | cookie trình duyệt tự gửi, nhu cầu thu hồi | phiên là một dòng ⇒ thu hồi = DELETE (đăng xuất mọi nơi ended 3); nhàn rỗi 30 phút/tuyệt đối 12 giờ bằng đồng hồ giả; 1.000 UPDATE → 0 khi chạm mỗi phút |
| `auth-3-3-tai-sinh-phien` | Academy PRJ301 `prj301-cookie-session` | cấp session id mới khi đăng nhập (changeSessionId) | session fixation chạy thật trong Chromium: bản ngây thơ trao tài khoản An, v0.3 trả 401; đổi mật khẩu kết thúc 2 phiên khác |
| `auth-3-4-csrf` | `api-design/api-6-4-cors` | trình duyệt tự gửi gì / cho đọc gì | 5 cấu hình bị tấn công từ site khác: fetch no-cors vẫn đổi email (CORS không chống CSRF), Lax 401, Fetch Metadata/token 403, same-site cũng bị từ chối |
| `auth-3-5-phien-song-o-dau` | `api-design/api-8-3-mo-rong` | trạng thái trong một tiến trình hỏng khi có hai bản chạy | PG ~470 µs / Redis ~360 µs / cookie có ký 5 µs; sau "đăng xuất mọi nơi" chỉ cookie có ký còn hợp lệ |

Có sẵn, giữ nguyên ở cả hai phía: `auth-3-2-thuoc-tinh-cookie` ↔ PRJ301 `prj301-cookie-session` và ↔ SDN302 `sdn302-5-1-passwords-sessions`
(sổ `prj301-nodejs-auth-postgresql.md`), `auth-3-4-csrf` ↔ `nodejs-8-4-cookie-csrf-thu-hoi` (sổ `nodejs-ch8-auth-apidesign.md`).
Lab 3 (`auth-3-7-lab-phien-cookie`) chưa có cặp. `nodejs/s12-redis.mjs` đang có thay đổi chưa commit của phiên khác ⇒ KHÔNG chèn thẻ cho 3.5 ở đó.

## Chương 4 (03/11/2026) — 1 cặp hai chiều mới + các cặp có sẵn giữ nguyên

| Authentication | Bài kia | Giống | Authentication thêm (đo thật, Node 22.23.3 + jose 6.1.0 + Chromium 156) |
|---|---|---|---|
| `auth-4-2-truong-alg` | `api-design/api-6-1-xac-thuc` | HS256 = HMAC-SHA256 với bí mật máy chủ, dựng tay, bearer token | lấy alg từ KHOÁ (không từ header): alg:none + nhầm lẫn HS/RS ⇒ ALG_MISMATCH; chuyển sang EdDSA + JWKS để dịch vụ khác xác minh không cần bí mật |

Thẻ hai chiều: `auth-4-2` → `api-6-1-xac-thuc` (trong bài, `lienKet`), và thêm thẻ ngược `api-6-1-xac-thuc` → `auth-4-2` ở `content/courses/api-design/s06-bao-mat.mjs` (ml-en + ml-vi, sau thẻ auth-2-3).

**Thẻ ngược CÓ SẴN trỏ tới Ch4 (slug giữ nguyên, vẫn đúng với bài mới — KHÔNG thêm lại):** `nodejs-8-2-jwt-access-refresh` → `auth-4-2-truong-alg`
(sổ `nodejs/s08-auth.mjs` đã có từ bản cũ; nay là hai chiều với `auth-4-3` → `nodejs-8-2-jwt-access-refresh` phía auth).

**Một chiều "đọc thêm" (bên kia đã có cặp Ch3 riêng, không chèn ngược):** `auth-4-4-khoa-va-jwks` → `api-design/api-8-3-mo-rong`
(cùng bài toán trạng thái qua nhiều tiến trình; api-8-3 đã hai chiều với auth-3-5), `auth-4-5-cat-token-o-dau` → `nodejs/nodejs-8-4-cookie-csrf-thu-hoi`
(đánh đổi XSS↔CSRF nhìn từ phía cookie; nodejs-8-4 đã hai chiều với auth-3-1), `auth-4-1-giai-ma-bang-tay` → `api-design/api-6-1-xac-thuc` (thêm một thẻ tới cùng api-6-1).
Academy ứng viên chưa chèn: SDN302 5.2 (`sdn302-5-2-jwt-cors` đã trỏ auth-4-2 từ phía nodejs; phía auth để Ch5/Ch8), testing 5.2 ↔ Lab 4.

## Chương 5 (03/11/2026) — thẻ ngược CÓ SẴN (slug giữ) đã là hai chiều; +4 một chiều "đọc thêm/so sánh"

Cặp hai chiều của hợp đồng §11 (**nodejs 8.2 ↔ Ch5**) ĐÃ hai chiều sẵn: `nodejs/s08-auth.mjs` (bài `nodejs-8-2-jwt-access-refresh`)
có thẻ ngược trỏ `auth-5-2-xoay-vong` (và `auth-4-2`) từ bản cũ — slug giữ nên vẫn đúng với bài mới. Phía auth: `auth-5-1-hai-token`
và `auth-5-2-xoay-vong` đều `lienKet` tới `nodejs-8-2-jwt-access-refresh`. KHÔNG thêm lại thẻ ngược.

Thẻ một chiều "đọc thêm / so sánh" phía auth (bên kia đã có cặp hai chiều Ch3/Mục 0 riêng, không chèn ngược):
| Authentication | Bài kia | Giống | Authentication thêm (đo thật, Node 22.23.3 + PostgreSQL 17.11) |
|---|---|---|---|
| `auth-5-3-nam-su-kien` | `nodejs/nodejs-8-4-cookie-csrf-thu-hoi` | làm sao thật sự kết thúc một phiên | năm sự kiện thu hồi họ refresh ở máy chủ; đo cửa sổ access token còn lại ≤ 15 phút (nodejs thu hồi JWT bằng tokenVersion) |
| `auth-5-4-danh-sach-thiet-bi` | `api-design/api-6-2-phan-quyen` | kiểm sở hữu cấp đối tượng (BOLA/IDOR) | thu hồi thiết bị phải xác minh họ thuộc người gọi; trang thiết bị = GROUP BY family |
| `auth-5-5-cuoc-dua-refresh` | `api-design/api-8-3-mo-rong` | trạng thái một tiến trình hỏng khi có nhiều bản chạy | cache cửa sổ ân hạn phải dùng chung (Redis) khi >1 tiến trình; cảnh báo giả giết cả tính năng |

Nguồn chuẩn mới dùng ở Ch5: **RFC 9700** (BCP 240, OAuth 2.0 Security BCP) §2.2.2/§4.14 — refresh token phải ràng theo người gửi hoặc
XOAY VÒNG, và tái dùng một token đã xoay phải vô hiệu cả chuỗi (phát hiện tái dùng); OWASP Session Management Cheat Sheet.
