# Liên kết chéo Academy (SDN302 · PRJ301 · SWR302) ↔ API Design

Deep link: `/courses/<slug-khoá>/learn?lessonSlug=<slug-bài>`. Academy: SDN302 = `server-side-development-nodejs-express-mongodb`, PRJ301 = `java-web-application-development`, SWR302 = `software-requirements`. Courses: `api-design`. Khối `<a class="link-card lien-ket-cheo">` cuối `ml-en` và `ml-vi`, HAI CHIỀU (thẻ ở cả bài Academy lẫn bài Courses). Đợt mẫu 31/10/2026: chỉ Mục 0 + Chương 1 của api-design.

| Academy | Courses (api-design) | Giống | Courses sâu thêm |
|---|---|---|---|
| `sdn302-1-2-http-server` | `api-0-1-http` | các phần của request/response, server dựng bằng module http của Node | máy chủ "tấm gương" đọc HTTP trần, curl -i / -v từng dòng, năm phần của URL, stateless, bẫy thiếu Content-Type |
| `prj301-http-servlet` | `api-0-1-http` | vòng request–response, GET với POST, mã trạng thái (góc nhìn Servlet) | HTTP trần bằng curl, header mà API dựa vào, stateless, thiếu Content-Type làm mất body |
| `swr302-4-2-domain-model-dfd` | `api-1-1-tai-nguyen` | tìm thực thể nghiệp vụ và quan hệ trong yêu cầu | biến thực thể thành tài nguyên/URL, bộ sưu tập–phần tử, lồng một tầng, URL lồng hay bộ lọc, hành động huỷ |
| `sdn302-2-1-express-routing` | `api-1-2-phuong-thuc` | mỗi tài nguyên một router, get/post/put/delete | safe/idempotent, vì sao không gửi lại POST mù quáng, PUT vs PATCH (JSON Merge Patch), 405 + Allow — chạy thật |
| `sdn302-4-1-rest-mvc` | `api-1-3-status` | bảng 200/201/400/401/403/404/500, không trả 200 cho lỗi | 201 + Location, 400 vs 422, 409 xung đột trạng thái, 410, 415, 500 không lộ stack trace, thứ tự câu hỏi chọn mã |
| `sdn302-2-2-middleware` | `api-2-1-problem-details` | middleware xử lý lỗi bốn tham số đặt sau mọi route | định dạng lỗi chuẩn RFC 9457 (problem+json, type/title/detail/instance), lỗi từng trường kèm JSON Pointer, bug 413 thành 500 của bộ xử lý tự chế (đợt Ch2, 01/11/2026) |
| `sdn302-8-2-production` | `api-2-2-validation` | validation mạnh bằng Zod/Joi, kiểm ở cửa trước tầng service | tấn công API thật đo sáu request lọt, object strict chống mass assignment, 415/413 ở cửa, bẫy ép kiểu, siết luật sau phát hành là thay đổi phá vỡ (đợt Ch2) |

Không cặp (đợt này): `api-0-8-bat-dau-tai-day`, `api-0-9-bat-dau-khi-khong-co` (giới thiệu khoá), `api-0-2-bo-cong-cu` (SDN302 không dạy curl/HTTPie/Bruno), `api-0-3-du-an-labflow` (dựng dự án riêng), `api-1-4-dat-ten` (ngày giờ/tiền/id — SDN302/PRJ301 không có bài tương ứng), lab và quiz.
Không cặp (Ch2): `api-2-3-envelope`, `api-2-4-i18n` (SDN302/PRJ301/SWR302 không có bài tương ứng), lab và quiz.
Ứng viên cho các chương sau: SDN302 `sdn302-5-2-jwt-cors` ↔ Ch6; `sdn302-8-2-production` (rate limit) ↔ Ch5 (validate đã cặp với 2.2); PRJ301 `prj301-pagination` ↔ Ch3; SWR302 `swr302-7-1-change-control` ↔ Ch4.
