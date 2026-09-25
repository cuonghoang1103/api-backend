/**
 * Full-Stack Project — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 25/09/2026 (công khai ngay theo cách làm của 11 khoá
 * khung trước — status PUBLISHED, bài chưa soạn hiện "Đang soạn"), chi tiết soạn sau. Nằm trong lộ trình ở
 * ~/Documents/LO-TRINH-HOC.md. Xem _chung/khung.mjs.
 *
 * Khác các khoá khung khác: đây là khoá DỰ ÁN — người học tự gõ 100% một ứng dụng full-stack từ số 0 (React +
 * Node/Express + PostgreSQL/Prisma), mỗi chương là một chặng có checkpoint tự kiểm ở cuối chương; lời giải mẫu sẽ
 * thêm sau khi soạn chi tiết.
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'backend', name: 'Backend', icon: 'Server', sortOrder: 1 },
  course: {
    slug: 'fullstack-project',
    title: 'Build a Full-Stack App from Scratch',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/fullstack-project.png?v=1',
    shortDescription: 'Type every line yourself: React + Node/Express + PostgreSQL/Prisma, auth, image uploads, comments, light realtime, tests, Docker, CI and a real VPS deploy — one project, one checkpoint per chapter.|||Tự gõ từng dòng: React + Node/Express + PostgreSQL/Prisma, xác thực, upload ảnh, bình luận, realtime nhẹ, test, Docker, CI và deploy VPS thật — một dự án, mỗi chương một checkpoint.',
    description: 'Khoá KHÔNG có video giảng lý thuyết dài dòng — đây là một dự án bạn tự gõ 100% từ dòng lệnh đầu tiên tới lúc production trả lời trên một tên miền thật. Ứng dụng đích: một mạng chia sẻ bài viết nhỏ — đăng ký/đăng nhập, bài viết kèm ảnh (lưu trên Cloudflare R2/S3), bình luận, thông báo realtime nhẹ bằng Socket.IO — được test, đóng gói Docker, chạy CI trên GitHub Actions và deploy lên VPS. Mỗi chương là một chặng khép kín, kết thúc bằng một checkpoint bạn tự chấm được (một lệnh curl, một dòng log, một trang chạy được) trước khi sang chương sau. Lời giải mẫu từng chương sẽ được thêm sau, để bạn tự làm trước khi so.',
    whatYouLearn: 'Lên kế hoạch và thiết kế schema cho một sản phẩm nhỏ trước khi viết dòng code đầu tiên; dựng backend Express/TypeScript + PostgreSQL/Prisma từ hai lệnh init; làm xác thực JWT có refresh, upload ảnh lên object storage, phân trang và validate dữ liệu đúng chuẩn; nối một frontend React gọi API thật; thêm realtime nhẹ; viết test (unit, integration với DB thật, API); đóng gói Docker cho cả hai dịch vụ; dựng pipeline GitHub Actions chặn merge khi test đỏ; và tự deploy lên VPS có domain + HTTPS — rồi biết cách tự kiểm mỗi bước bằng checkpoint thay vì đoán.',
    requirements: 'Đã học (hoặc học song song) các khoá nền: React, Node.js, PostgreSQL/Prisma ORM, Git. Nên biết Docker và GitHub Actions trước khi tới Chương 9–10, nhưng khoá này nhắc lại đủ để không bị kẹt. Đây KHÔNG phải khoá học khái niệm — nó giả định bạn đã học khái niệm ở các khoá kia và giờ ráp chúng lại thành một sản phẩm thật.',
    documentsNote: 'Tài liệu chính: đối chiếu lại với các khoá React, Node.js, PostgreSQL, Prisma ORM, Docker và GitHub Actions trên chính trang này — dự án này là bài tập lớn dùng chung kiến thức của cả sáu khoá đó, không dạy lại từ đầu.',
  },
  sections: khung('fp', [
    ['Section 0 — Why build a whole project', 'Mục 0 — Vì sao tự dựng một dự án trọn vẹn', 'Cách học bằng dự án, và cách dùng checkpoint để tự kiểm mà không cần thầy đứng cạnh.', [
      ['bat-dau-tai-day', 'Start here (1/2) — Why one finished project beats ten tutorials', 'Bắt đầu tại đây (1/2) — Vì sao một dự án xong việc hơn mười tutorial dở dang', 'Học bằng tutorial vs học bằng dự án · "Tutorial hell" là gì · Vì sao nhà tuyển dụng hỏi "cho xem một dự án" · Cách khoá này khác các khoá khái niệm khác trên trang'],
      ['bat-dau-khi-khong-co', 'Start here (2/2) — How to use the checkpoints, and what to do when you get stuck', 'Bắt đầu tại đây (2/2) — Dùng checkpoint thế nào, và làm gì khi bị kẹt', 'Checkpoint là gì, tự chấm bằng gì · Kẹt quá 30 phút thì làm gì trước khi hỏi AI · Commit sau mỗi checkpoint · Lời giải mẫu ra sau, đừng nhìn trước'],
      ['ung-dung-dich', 'The target app: a small post-sharing network', 'Ứng dụng đích: mạng chia sẻ bài viết nhỏ', 'Danh sách tính năng cuối cùng · Những gì CỐ TÌNH bỏ ra để dự án làm xong được · Ảnh chụp giao diện đích'],
      ['ke-hoach-hoc', 'How the 11 chapters are structured', 'Cấu trúc 11 chương', '4 bài mỗi chương, bài cuối luôn là checkpoint · Backend trước, frontend sau, hạ tầng cuối · Nhánh git gợi ý cho từng chương'],
    ]],
    ['Chapter 1 — Planning and scaffolding', 'Chương 1 — Lên kế hoạch và dựng khung dự án', 'Thiết kế trước khi gõ: tính năng, schema, cấu trúc repo.', [
      ['pham-vi', 'Scoping the project: what "done" means', 'Xác định phạm vi: "xong" nghĩa là gì', 'User story tối thiểu · Cắt tính năng thừa · Viết README trước khi viết code'],
      ['thiet-ke-schema', 'Designing the data model on paper', 'Thiết kế mô hình dữ liệu trên giấy', 'User, Post, Comment, quan hệ 1-n và n-n · Vẽ ERD nhanh · Đặt tên bảng/cột nhất quán'],
      ['dung-khung', 'Scaffolding the repo and tooling', 'Dựng khung repo và công cụ', 'Một repo hay hai repo · TypeScript, ESLint, Prettier cho cả backend/frontend · .env.example từ ngày đầu'],
      ['checkpoint-1', 'Checkpoint 1: the repo runs and the plan is written down', 'Checkpoint 1: repo chạy được và kế hoạch đã viết ra giấy', 'npm install && npm run dev không lỗi · README có schema và danh sách tính năng · Commit đầu tiên'],
    ]],
    ['Chapter 2 — Backend foundation', 'Chương 2 — Nền backend', 'Express + TypeScript + PostgreSQL/Prisma chạy được, có một route sống.', [
      ['express-ts', 'Express + TypeScript project skeleton', 'Khung dự án Express + TypeScript', 'Cấu trúc thư mục routes/controllers/services · tsconfig cho Node 22 · nodemon/tsx cho dev'],
      ['prisma-ket-noi', 'Connecting Prisma and the first migration', 'Kết nối Prisma và migration đầu tiên', 'schema.prisma · npx prisma migrate dev · Prisma Client sinh ra ở đâu'],
      ['user-model', 'The User model and a health-check API', 'Model User và API health-check', 'Model User tối thiểu · GET /health trả 200 · Middleware log request cơ bản'],
      ['checkpoint-2', 'Checkpoint 2: migration applies, /health returns 200', 'Checkpoint 2: migration chạy được, /health trả 200', 'npx prisma migrate dev không lỗi · curl /health ra JSON · Prisma Studio mở xem được bảng'],
    ]],
    ['Chapter 3 — Authentication', 'Chương 3 — Xác thực', 'Đăng ký, đăng nhập, JWT có refresh, route được bảo vệ.', [
      ['dang-ky', 'Password hashing and the register endpoint', 'Băm mật khẩu và endpoint đăng ký', 'bcrypt/argon2 · Validate email/password bằng Zod · Không lộ email đã tồn tại qua thông báo lỗi'],
      ['dang-nhap-jwt', 'Login, JWT and refresh token rotation', 'Đăng nhập, JWT và xoay vòng refresh token', 'Access token ngắn hạn · Refresh token lưu ở đâu · Xoay vòng khi refresh (rotation)'],
      ['middleware-bao-ve', 'Auth middleware and protected routes', 'Middleware xác thực và route được bảo vệ', 'Middleware verify JWT · req.user · 401 vs 403'],
      ['checkpoint-3', 'Checkpoint 3: register → login → call a protected route with curl', 'Checkpoint 3: đăng ký → đăng nhập → gọi route bảo vệ bằng curl', 'Ba lệnh curl liên tiếp chạy đúng · Token hết hạn trả 401 đúng · Refresh token cấp lại access token mới'],
    ]],
    ['Chapter 4 — Posts with image upload', 'Chương 4 — Bài viết kèm ảnh', 'CRUD bài viết và upload ảnh lên object storage.', [
      ['post-crud', 'Post model and CRUD endpoints', 'Model Post và endpoint CRUD', 'Tạo/sửa/xoá/lấy bài viết · Chỉ tác giả mới sửa/xoá được bài của mình · Trạng thái draft/published'],
      ['upload-r2', 'Uploading images to R2/S3 with presigned URLs', 'Upload ảnh lên R2/S3 bằng presigned URL', 'Vì sao không upload qua backend trực tiếp · Tạo presigned PUT URL · Lưu key ảnh trong DB, không lưu URL đầy đủ'],
      ['phuc-vu-anh', 'Serving and validating uploaded media', 'Phục vụ và kiểm tra ảnh đã upload', 'Giới hạn kích thước và định dạng file · Kiểm ảnh tồn tại trước khi lưu record · Base URL CDN'],
      ['checkpoint-4', 'Checkpoint 4: create a post with a real image end to end', 'Checkpoint 4: tạo một bài viết kèm ảnh thật từ đầu tới cuối', 'Upload ảnh, tạo bài viết, GET lại thấy đúng URL ảnh · Xoá bài thì ảnh cũng dọn (hoặc ghi log để dọn sau)'],
    ]],
    ['Chapter 5 — Comments, relations and pagination', 'Chương 5 — Bình luận, quan hệ và phân trang', 'Comment lồng quan hệ, feed phân trang, validate nhất quán.', [
      ['comment-model', 'Comment model and nested relations', 'Model Comment và quan hệ lồng nhau', 'Comment thuộc Post và User · Đếm số bình luận hiệu quả · Xoá bài thì bình luận theo cascade'],
      ['phan-trang', 'Cursor-based pagination for the feed', 'Phân trang kiểu cursor cho feed', 'Vì sao cursor tốt hơn offset khi dữ liệu tăng · Trả nextCursor · Sắp xếp ổn định (id phụ)'],
      ['validation-nhat-quan', 'Validation and a consistent error shape', 'Validate dữ liệu và hình dạng lỗi nhất quán', 'Zod schema dùng chung request/response · Một định dạng lỗi cho toàn bộ API · Middleware bắt lỗi tập trung'],
      ['checkpoint-5', 'Checkpoint 5: a paginated feed with comment counts', 'Checkpoint 5: feed phân trang kèm số bình luận', 'GET /posts?cursor=… trả đúng trang tiếp theo · Mỗi bài có commentCount đúng · Gửi request sai dữ liệu trả lỗi rõ ràng'],
    ]],
    ['Chapter 6 — Frontend foundation', 'Chương 6 — Nền frontend', 'React gọi API thật, đăng nhập, đăng bài từ giao diện.', [
      ['react-goi-api', 'React project setup and calling the API', 'Dựng dự án React và gọi API', 'Vite + TypeScript · Lớp gọi API (fetch wrapper) · Biến môi trường cho base URL'],
      ['auth-frontend', 'Auth in the frontend: tokens and protected pages', 'Xác thực ở frontend: lưu token và trang được bảo vệ', 'Lưu access token ở đâu cho an toàn vừa đủ · Interceptor tự refresh khi 401 · Route riêng cho trang cần đăng nhập'],
      ['form-dang-bai', 'Forms: creating a post with an image preview', 'Form: tạo bài viết kèm xem trước ảnh', 'Input file + preview trước khi upload · Trạng thái đang gửi/lỗi · Gọi đúng thứ tự: upload ảnh rồi mới tạo bài'],
      ['checkpoint-6', 'Checkpoint 6: log in, create a post, see it in the feed', 'Checkpoint 6: đăng nhập, tạo bài, thấy ngay trong feed', 'Luồng đăng nhập → tạo bài → quay lại feed thấy bài mới, không cần F5'],
    ]],
    ['Chapter 7 — Light realtime', 'Chương 7 — Realtime nhẹ', 'Thông báo và cập nhật tức thời bằng Socket.IO, không quá phức tạp.', [
      ['vi-sao-realtime', 'Why realtime, and picking the light option', 'Vì sao cần realtime, và chọn phương án nhẹ', 'Polling vs WebSocket · Socket.IO cho một tính năng nhỏ · Chỗ nào KHÔNG cần realtime'],
      ['cap-nhat-song', 'Live comment and like updates', 'Cập nhật bình luận và lượt thích tức thời', 'Phòng theo postId · Phát sự kiện khi có bình luận mới · Cập nhật UI không cần tải lại'],
      ['ket-noi-that-bai', 'Connection state, reconnects and scaling notes', 'Trạng thái kết nối, tự nối lại, và ghi chú khi mở rộng', 'Xử lý mất kết nối · Reconnect tự động · Vì sao nhiều instance cần Redis adapter (chỉ ghi chú, không bắt buộc làm)'],
      ['checkpoint-7', 'Checkpoint 7: two browser tabs see the same comment instantly', 'Checkpoint 7: hai tab trình duyệt thấy cùng một bình luận ngay lập tức', 'Mở hai tab, bình luận ở tab A hiện ngay ở tab B không F5'],
    ]],
    ['Chapter 8 — Testing the stack', 'Chương 8 — Test cả hệ thống', 'Unit, integration với DB thật, và test API.', [
      ['unit-service', 'Unit tests for services', 'Unit test cho tầng service', 'Tách logic khỏi Express để test dễ · Vitest/Jest cơ bản · Mock những gì cần mock'],
      ['integration-db', 'Integration tests against a real Postgres', 'Test tích hợp với PostgreSQL thật', 'Postgres dùng một lần trong Docker cho test · Dọn dữ liệu giữa các test · Chạy được cả local lẫn CI'],
      ['api-supertest', 'API tests with Supertest', 'Test API bằng Supertest', 'Gửi request không cần bật server thật · Test luồng đăng ký/đăng nhập/tạo bài đầu-cuối'],
      ['checkpoint-8', 'Checkpoint 8: npm test is green with meaningful coverage', 'Checkpoint 8: npm test chạy xanh với độ phủ có ý nghĩa', 'Toàn bộ luồng chính (auth, post, comment) có ít nhất một test · Không có test giả vờ (test rỗng luôn xanh)'],
    ]],
    ['Chapter 9 — Docker for the whole stack', 'Chương 9 — Docker cho cả hệ thống', 'Backend, frontend và database chạy được bằng một lệnh.', [
      ['dockerfile-backend', 'A Dockerfile for the backend', 'Dockerfile cho backend', 'Multi-stage build · Chỉ copy những gì cần chạy · Biến môi trường lúc build vs lúc chạy'],
      ['dockerfile-frontend', 'A Dockerfile for the frontend', 'Dockerfile cho frontend', 'Build tĩnh rồi phục vụ bằng Nginx · Biến môi trường build-time của Vite/React'],
      ['docker-compose', 'docker-compose for backend + frontend + db', 'docker-compose cho backend + frontend + db', 'Ba service trong một file · Volume cho Postgres · Mạng nội bộ giữa các service'],
      ['checkpoint-9', 'Checkpoint 9: docker compose up boots everything from zero', 'Checkpoint 9: docker compose up dựng cả hệ thống từ số 0', 'Máy sạch, chưa cài gì ngoài Docker, chạy một lệnh là có app sống'],
    ]],
    ['Chapter 10 — CI with GitHub Actions', 'Chương 10 — CI với GitHub Actions', 'Kiểm tự động mỗi lần push, chặn merge khi đỏ.', [
      ['ci-co-ban', 'Lint, typecheck and test on every push', 'Lint, kiểm kiểu và test mỗi lần push', 'Workflow YAML tối thiểu · Cache npm cho nhanh · Service container Postgres cho integration test'],
      ['build-image-ci', 'Building and pushing Docker images in CI', 'Dựng và đẩy image Docker trong CI', 'docker/build-push-action · Đẩy lên GitHub Container Registry · Tag theo commit SHA'],
      ['bat-buoc-check', 'Required checks and branch protection', 'Check bắt buộc và bảo vệ nhánh', 'Bật branch protection trên main · Không cho merge khi check đỏ'],
      ['checkpoint-10', 'Checkpoint 10: a failing test actually blocks the PR', 'Checkpoint 10: một test lỗi thật sự chặn được PR', 'Cố tình làm hỏng một test, push, thấy PR bị chặn merge'],
    ]],
    ['Chapter 11 — Deploy and capstone wrap-up', 'Chương 11 — Deploy và tổng kết dự án', 'Đưa ứng dụng lên một VPS thật, có domain và HTTPS.', [
      ['chuan-bi-vps', 'Preparing a VPS (or a free-tier cloud option)', 'Chuẩn bị VPS (hoặc phương án cloud miễn phí)', 'Yêu cầu tối thiểu · Cài Docker trên VPS · SSH key thay vì mật khẩu'],
      ['deploy-domain', 'Deploying the containers and wiring domain + HTTPS', 'Deploy container và gắn domain + HTTPS', 'Nginx làm reverse proxy · Certbot/Let’s Encrypt cho HTTPS · Trỏ DNS về VPS'],
      ['smoke-rollback', 'Smoke-testing production and a rollback plan', 'Kiểm nhanh production và kế hoạch rollback', 'curl vài route chính sau deploy · Ghi lại cách quay về bản chạy trước · Log ở đâu khi có lỗi'],
      ['tong-ket', 'Capstone checklist: what "done" looks like', 'Checklist tổng kết: "xong" trông như thế nào', 'Danh sách năng lực đã có sau cả khoá · Việc tiếp theo nếu muốn mở rộng dự án · Nơi lời giải mẫu sẽ xuất hiện'],
    ]],
  ]),
};
