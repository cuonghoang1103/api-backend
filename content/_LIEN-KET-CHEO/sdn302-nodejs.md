# Liên kết chéo SDN302 (Academy) ↔ Node.js + Authentication

Deep link: `/courses/<slug-khoá>/learn?lessonSlug=<slug-bài>`. Academy: `server-side-development-nodejs-express-mongodb`. Khối `<a class="link-card lien-ket-cheo">` cuối `ml-vi` và `ml-en`.

| SDN302 | Courses | Giống | Courses sâu thêm |
|---|---|---|---|
| `sdn302-1-1-node-event-loop` | `nodejs/nodejs-2-2-event-loop` | event loop và vì sao Node không bị chặn khi chờ I/O | sáu pha, tự chứng minh thứ tự chạy, setTimeout(0) so với setImmediate, vì sao timer không bao giờ chính xác; bài 2.4 còn đo chuyện chặn event loop bằng số thật |
| `sdn302-1-2-http-server` | `nodejs/nodejs-3-5-http-server` | dựng server bằng module http thuần của Node | những chỗ bắt bạn tự làm tay, trả phản hồi theo dòng chảy, module http trần bắt bạn tự làm những gì |
| `sdn302-2-1-express-routing` | `nodejs/nodejs-5-2-dinh-tuyen` | định tuyến Express và tổ chức route bằng Router | giải phẫu một route, tham số trên đường dẫn, bug thứ tự route xem tận mắt, query string, ký tự đại diện và thay đổi ở Express 5 |
| `sdn302-2-2-middleware` | `nodejs/nodejs-5-3-middleware` | middleware, tự viết một logger và thứ tự khai báo quyết định thứ tự chạy | dây chuyền theo đúng thứ tự chạy, những middleware có sẵn dùng thật, middleware theo phạm vi — hình dạng của mọi chốt chặn |
| `sdn302-2-2-middleware` | `nodejs/nodejs-5-4-xu-ly-loi` | error handler là middleware nhận bốn tham số | lỗi throw trong code async (Express 5 bắt được, Express 4 thì không, kèm bằng chứng), lớp lỗi mang mã HTTP, 404 dạng JSON, hai loại lỗi vẫn giết được tiến trình |
| `sdn302-4-1-rest-mvc` | `nodejs/nodejs-6-2-ma-trang-thai` | bảng mã trạng thái 200/201/400/401/403/404 và một hình dạng phản hồi nhất quán | 204 và 409/422, ba chỗ hay nhầm (như 401 với 403), trả 201 kèm header Location, quy ước đặt trường chốt sớm |
| `sdn302-4-1-rest-mvc` | `nodejs/nodejs-18-1-tang-va-trach-nhiem` | phân lớp route – controller/service – dữ liệu để API lớn dần vẫn dễ sửa | mỗi tầng được phép biết gì (và không được biết gì), vì sao service không biết mình được gọi qua HTTP thì dùng lại được cho worker và test |
| `sdn302-5-1-passwords-sessions` | `nodejs/nodejs-8-1-mat-khau-va-bam` | băm mật khẩu bằng bcrypt thay vì lưu thô | bốn cách thua, "nhanh" là nhanh cỡ nào, dựng bảng cầu vồng tại chỗ, muối, chi phí băm khi có tải, nâng chi phí mà không bắt ai đổi mật khẩu |
| `sdn302-5-1-passwords-sessions` | `authentication/auth-3-2-thuoc-tinh-cookie` | session đi kèm cookie | HttpOnly chặn việc token bị đọc nhưng không chặn việc nó bị dùng, và các thuộc tính khác chặn cú tấn công nào; kèm cả chương về bảng phiên và CSRF |
| `sdn302-5-2-jwt-cors` | `nodejs/nodejs-8-2-jwt-access-refresh` | luồng JWT: phát token khi đăng nhập, verify ở mỗi request | mổ một JWT bằng tay, ba đòn tấn công (sửa payload, dùng decode thay vì verify, nói dối về thuật toán), refresh token không phải JWT, xoay vòng và vì sao "dùng lại" nghĩa là bị trộm |
| `sdn302-5-2-jwt-cors` | `nodejs/nodejs-9-1-header-csp-cors` | CORS cho phép app React gọi API | helmet thật sự làm gì, năm header quan trọng, đọc CSP từng chỉ thị, điều không ai nói về CORS, header Vary |
| `sdn302-5-2-jwt-cors` | `nodejs/nodejs-10-1-nhan-file-multipart` | nhận file upload bằng Multer | multipart thật ra trông thế nào, base64 không miễn phí, so memoryStorage với diskStorage bằng RSS, giới hạn kích cỡ; các bài sau còn object storage và URL ký sẵn, kiểm file thật |
| `sdn302-8-2-production` | `nodejs/nodejs-6-3-validate-schema` | validate đầu vào bằng Zod/Joi thay vì chuỗi if | một lược đồ thay cả bức tường if, output thật, bài toán query string, đòn tấn công mà lược đồ lặng lẽ chặn đứng |
| `sdn302-8-2-production` | `nodejs/nodejs-12-4-nguyen-tu-rate-limit-lock` | giới hạn số request để chặn lạm dụng | ba thuật toán (cửa sổ cố định và lỗ ở ranh giới, cửa sổ trượt, token bucket), con bug INCR rồi EXPIRE, khoá phân tán |
| `sdn302-6-1-react-deploy` | `nodejs/nodejs-17-4-bi-mat-cau-hinh` | bí mật và cấu hình đi qua biến môi trường, không hard-code | docker history lộ token dù đã xoá, ENV ghi mật khẩu vào Config của ảnh, cách đúng là gắn bí mật lúc build |
| `sdn302-6-1-react-deploy` | `nodejs/nodejs-17-6-deploy-hong-quay-lui` | "chạy local nhưng lỗi ở production" gần như luôn là chuyện deploy | vì sao health check xanh mà tính năng vẫn mất, curl không xác thực để phân biệt 401 với 404, smoke test và quay lui |

Không cặp: Ch3 MongoDB/Mongoose (khoá nodejs dùng PostgreSQL/Prisma, không có Mongo), 4.2 EJS/Handlebars, 8.1 NestJS/Hono, các bài thi/quiz. Passport không có ở Courses (Courses tự viết requireAuth).
