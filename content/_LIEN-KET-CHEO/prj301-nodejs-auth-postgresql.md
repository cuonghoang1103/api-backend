# Liên kết chéo PRJ301 (Academy) ↔ Node.js + Authentication + PostgreSQL

Deep link: `/courses/<slug-khoá>/learn?lessonSlug=<slug-bài>`. Academy: `java-web-application-development`. Khối `<a class="link-card lien-ket-cheo">` cuối `ml-vi` và `ml-en`.

| PRJ301 | Courses | Giống | Courses sâu thêm |
|---|---|---|---|
| `prj301-cookie-session` | `authentication/auth-3-2-thuoc-tinh-cookie` | session sống ở server, cookie chỉ mang id của nó (code ở đó viết bằng Node.js, không phải Java — nhưng ý tưởng dùng được nguyên) | HttpOnly chặn việc token bị đọc nhưng không chặn việc nó bị dùng, và các thuộc tính khác chặn cú tấn công nào; cả chương có thêm bảng phiên, tái sinh phiên, CSRF |
| `prj301-filter` | `nodejs/nodejs-5-3-middleware` | một chuỗi mắt xích đứng trước handler, gọi chain.doFilter() / next() thì request đi tiếp, không gọi thì dừng (code ở đó viết bằng Node.js, không phải Java — nhưng ý tưởng dùng được nguyên) | dây chuyền theo đúng thứ tự chạy, tự viết logger đo thời gian thật, middleware theo phạm vi — hình dạng của mọi chốt chặn |
| `prj301-upload` | `nodejs/nodejs-10-1-nhan-file-multipart` | form upload phải dùng multipart và server phải đọc phần thân dạng multipart (code ở đó viết bằng Node.js, không phải Java — nhưng ý tưởng dùng được nguyên) | multipart thật ra trông thế nào, base64 không miễn phí, so memoryStorage với diskStorage bằng RSS, giới hạn kích cỡ |
| `prj301-upload` | `nodejs/nodejs-10-2-object-storage-presigned` | câu hỏi "lưu file ở đâu cho khỏi mất khi deploy lại" | object storage không phải hệ thống file, bố trí key là quyết định thiết kế, giải phẫu URL ký sẵn, file đi thẳng lên mà không qua máy chủ, Content-Type và kích thước không bị ràng buộc theo mặc định |
| `prj301-mvc` | `nodejs/nodejs-18-1-tang-va-trach-nhiem` | tách trách nhiệm: tầng nào được biết gì (Model không biết gì về web) (code ở đó viết bằng Node.js, không phải Java — nhưng ý tưởng dùng được nguyên) | mỗi tầng được phép biết gì và không được biết gì, vì sao service không biết mình được gọi qua HTTP thì dùng lại được cho worker và test |
| `prj301-transaction-pool` | `postgresql/postgresql-11-1-giao-dich` | commit/rollback để nhóm câu lệnh không xảy ra nửa vời | ROLLBACK hoàn tác sạch, trạng thái aborted gây bối rối, SAVEPOINT, DDL cũng nằm trong giao dịch; các bài sau có MVCC, mức cô lập, khoá dòng và deadlock |
| `prj301-transaction-pool` | `postgresql/postgresql-14-2-pool-pgbouncer` | connection pool: giữ sẵn kết nối và cho mượn | pool nằm trong app và pool đứng trước app (PgBouncer), một kết nối tốn những gì (bài 14.1) |

KHÔNG cặp PRJ301 ↔ spring-boot (và PRO192 ↔ spring-boot): khoá spring-boot, software-architecture, testing, api-design, web-security, system-design, dsa-interview đều còn là khung "Bài này sẽ dạy" (~1000 ký tự/bài). Các cặp ở đây là ý tưởng chung giữa Java web và Node/SQL; phía Courses ghi rõ code là Node.js.
