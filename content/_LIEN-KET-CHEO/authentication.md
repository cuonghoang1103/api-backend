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
