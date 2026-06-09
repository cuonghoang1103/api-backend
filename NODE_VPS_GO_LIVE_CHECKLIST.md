# Node.js VPS Go-Live Checklist for CuongHoangDev

## 1. Mục tiêu đã chốt

Đây là kiến trúc chính thức cho dự án mới:

- Backend chính: `Node.js + TypeScript + Express + Prisma`
- Frontend giữ nguyên: `Next.js`
- Database giữ nguyên: `PostgreSQL`
- Cache: `Redis`
- Reverse proxy: `Nginx`
- File storage production: lưu trực tiếp trên VPS qua local disk, không dùng Supabase, không dùng Cloudinary
- Upload cần hỗ trợ đầy đủ: ảnh, mp3/audio, video, document và các file hợp lệ khác

## 2. Kết luận audit hiện tại

### 2.1 Runtime hiện tại đã là Node.js

Các file đang xác nhận backend chính là Node.js:

- `package.json`
- `src/index.ts`
- `Dockerfile.backend`
- `docker-compose.yml`
- `docker-compose.prod.yml`

Điều này khẳng định hướng runtime mới của dự án là đúng: Node backend đang là nguồn chính cho hệ thống mới.

### 2.2 Java/Spring Boot hiện chỉ là legacy còn sót trong repo

Các phần sau vẫn còn trong repo nhưng phải xem là legacy và không thuộc dự án mới:

- `src/main/java/**`
- `src/main/resources/db/migration/**`
- `pom.xml`
- các tham chiếu Java/Spring trong frontend content/comments/docs
- artifact cũ trong `bin/**`

Các phần này hiện đã bị loại khỏi luồng deploy Node/VPS bằng workflow và exclude rules, nhưng vẫn nên archive hoặc tách repo về lâu dài.

## 3. Những gì đang ổn theo hướng mới

### 3.1 Backend Node đã có nền tảng đủ mạnh

Từ `src/index.ts`, backend Node hiện đã có:

- route health check: `/health`, `/health/live`, `/health/ready`
- CORS
- Helmet
- rate limit
- cookie parser
- static upload serving trong development
- route modules cho auth, profile, blog, course, shop, music, ai, admin, skill, contact, upload, dev-posts, system

### 3.2 Upload local VPS đã có nền tảng thực tế

Từ `src/routes/upload.routes.ts` và `src/services/upload.service.ts`:

- upload single file: `POST /api/v1/files/upload`
- upload multiple files: `POST /api/v1/files/upload/multiple`
- delete file metadata + physical file
- file được ghi trực tiếp vào `UPLOAD_DIR`
- public URL được sinh dạng `/uploads/{category}/{filename}`
- category hiện hỗ trợ logic cho:
  - `images`
  - `audio`
  - `video`
  - `documents`

### 3.3 Streaming nhạc local đã có nền tảng đúng

Từ `src/routes/music.routes.ts` và `src/services/music.service.ts`:

- upload track có hỗ trợ `audio` + `cover`
- stream dùng HTTP Range
- hỗ trợ `206 Partial Content`
- đọc file bằng stream từ local disk, không load full file vào RAM
- phù hợp với hướng lưu file trực tiếp trên VPS

### 3.4 Docker root hiện đã đúng hướng Node

`docker-compose.yml` hiện đang đúng hướng với:

- `postgres`
- `redis`
- `backend` build từ `Dockerfile.backend`
- `frontend`
- `nginx`
- volume `uploads_data` mount local path lên host

Đây nên là một trong các nguồn sự thật chính để chuẩn hóa tiếp.

## 4. Những gì còn sai / còn sót / cần dọn ngay

## 4.1 Legacy Java vẫn đang gây nhiễu lớn

Cần coi các mục sau là ngoài phạm vi hệ thống mới:

- toàn bộ `src/main/java/**`
- toàn bộ `src/main/resources/db/migration/**` nếu migration DB mới đã chuyển sang Prisma/Node
- toàn bộ `vps-deploy/**` hiện còn viết theo Spring Boot
- workflow `.github/workflows/backend-vps.yml` hiện còn trigger cả `pom.xml`

Nếu vẫn giữ các file này trong repo, phải đánh dấu rất rõ là `legacy/archived`, hoặc tách hẳn ra nơi khác.

## 4.2 Frontend còn nhiều mô tả/comment/content nói về Spring Boot

Hiện vẫn còn các dấu vết trong frontend như:

- `frontend/src/lib/auth.ts`
- `frontend/src/lib/api.ts`
- `frontend/src/app/api/auth/login/route.ts`
- `frontend/src/app/api/auth/sync/route.ts`
- `frontend/src/components/layout/Navbar.tsx`
- `frontend/src/app/page.tsx`
- `frontend/src/store/projectStore.ts`
- `frontend/src/components/home/ServicesSection.tsx`
- `frontend/src/lib/ai-static-responses.ts`
- `frontend/src/app/blog/page.tsx`
- `frontend/src/components/blog/CategorySidebar.tsx`
- `frontend/src/store/chatStore.ts`

Lưu ý: một phần trong số này chỉ là content hiển thị hoặc comment, nhưng một phần là mô tả logic auth/proxy. Cần rà để tránh hiểu nhầm kiến trúc mới.

## 4.3 Frontend vẫn còn dấu vết Supabase/Cloudinary

Các dấu vết rõ nhất hiện tại:

- `frontend/src/lib/supabase.ts` vẫn còn tồn tại
- `frontend/next.config.js` vẫn allow:
  - `res.cloudinary.com`
  - `**.supabase.co`
- content/blog/service data vẫn còn nhắc S3/Cloudinary/Supabase ở vài nơi

Điều này mâu thuẫn với mục tiêu mới: tất cả file upload phải lên thẳng VPS.

## 4.4 `vps-deploy/` đã được chuyển sang hướng Node

Hiện `vps-deploy/.env.example`, `vps-deploy/docker-compose.yml`, `vps-deploy/README.md` đã được viết lại theo stack:

- Node.js backend
- Next.js frontend
- PostgreSQL
- Redis
- local VPS uploads

Việc còn lại là thống nhất xem production sẽ dùng `docker-compose.yml` ở root hay `vps-deploy/docker-compose.yml` làm nguồn sự thật cuối cùng.

## 4.5 CI/CD đã được gỡ khỏi Java, nhưng vẫn cần chốt một luồng deploy duy nhất

`.github/workflows/backend-vps.yml` hiện đã được sửa để:

- không còn trigger theo `pom.xml`
- exclude `src/main/java`, `src/main/resources/db/migration`, `bin`, `target`
- deploy từ root compose path thay vì luồng Spring cũ

Việc còn lại là chốt duy nhất một compose production để workflow và tài liệu cùng trỏ về một nơi.

## 4.6 Database migration strategy đã rõ hướng hơn sau khi bỏ Java

Hiện runtime Node backend dùng Prisma từ `prisma/schema.prisma` ở root repo.

Frontend Prisma cũ đã bị loại khỏi build path, nên chỉ còn một schema Prisma runtime cần quản lý.

Điểm còn cần chốt cuối cùng là:

- có tiếp tục giữ `src/main/resources/db/migration/**` như archive lịch sử hay không
- có tạo migration Prisma mới để thay thế hoàn toàn lịch sử Flyway cũ hay không

### Hướng A: Prisma là nguồn sự thật duy nhất

Khi đó cần:

- hoàn thiện `prisma/schema.prisma`
- tạo migration đầy đủ bằng Prisma
- bỏ phụ thuộc vào Java migration cũ
- không để frontend giữ schema Prisma riêng

### Hướng B: Giữ PostgreSQL schema cũ, Node chỉ map lại

Khi đó cần:

- xác nhận `prisma/schema.prisma` đã phản ánh đúng DB hiện có
- xác nhận mọi model Node đang tương thích dữ liệu cũ
- xác nhận auth, blog, shop, music, upload đều chạy được trên schema hiện hữu

Hiện tại đây vẫn là một checkpoint bắt buộc trước khi go-live ổn định.

## 5. Danh sách chi tiết việc cần làm để full web lên internet hoạt động như web cũ

## Phase 1 — Chuẩn hóa nguồn sự thật của dự án mới

### Bước 1. Chốt chính thức runtime production

Phải chốt bằng văn bản trong repo rằng:

- backend production chính là Node.js
- frontend production là Next.js
- database là PostgreSQL
- storage file production là local VPS
- Java/Spring Boot chỉ là legacy archive

### Bước 2. Tách hoặc vô hiệu hóa toàn bộ legacy Java

Việc cần làm:

- di chuyển `src/main/java/**` sang thư mục archive ngoài scope runtime, hoặc repo khác
- di chuyển `src/main/resources/db/migration/**` nếu không còn dùng
- giữ `pom.xml` ngoài phạm vi deploy hoặc archive hẳn
- đảm bảo CI/CD không đọc `pom.xml`
- đảm bảo tài liệu chính không còn mô tả Spring Boot là backend hiện tại
- giữ `.dockerignore` và workflow tiếp tục exclude Java legacy

### Bước 3. Dọn `bin/**`

Cần xác nhận `bin/**` có phải artifact/build/copy cũ không.

Nếu đúng, cần:

- loại khỏi deploy
- loại khỏi rsync
- loại khỏi Docker build context nếu chưa loại
- cân nhắc xóa khỏi repo

## Phase 2 — Chuẩn hóa deploy VPS theo Node.js

### Bước 4. Chọn một compose chính thức

Đã chốt nguồn sự thật production duy nhất:

- `docker-compose.yml` ở root repo

Các file sau chỉ còn giữ vai trò compatibility shim:

- `docker-compose.prod.yml`
- `vps-deploy/docker-compose.yml`

Workflow, tài liệu và hướng dẫn vận hành phải ưu tiên trỏ về `docker-compose.yml` ở root.

### Bước 5. Tạo chuẩn thư mục dữ liệu trên VPS

Cần có trên VPS:

- `/opt/cuonghoangdev/postgres`
- `/opt/cuonghoangdev/redis`
- `/opt/cuonghoangdev/uploads`
- `/opt/cuonghoangdev/nginx`
- `/opt/cuonghoangdev/backups`
- `/opt/cuonghoangdev/app`

Hoặc dùng `/mnt/data/...` nếu bạn muốn tách ổ lưu trữ. Quan trọng là phải thống nhất với compose file.

### Bước 6. Chuẩn hóa mount uploads

Yêu cầu production:

- backend ghi file vào `/app/uploads`
- host VPS mount volume sang thư mục thực trên ổ đĩa
- nginx serve trực tiếp `/uploads/*`
- file phải còn nguyên sau restart/rebuild/redeploy

Checklist:

- `UPLOAD_DIR=/app/uploads`
- volume backend mount đúng
- volume nginx mount đúng
- phân quyền thư mục đúng cho user chạy container

### Bước 7. Chuẩn hóa Nginx cho domain thật

Cần có:

- route frontend qua domain chính
- route API qua `api` subdomain hoặc path rõ ràng
- route static uploads qua `/uploads/`
- bật HTTPS
- redirect HTTP → HTTPS
- tăng `client_max_body_size` đủ lớn cho audio/video upload

Vì bạn cần upload video/audio lớn, Nginx phải tăng giới hạn body rõ ràng.

## Phase 3 — Chuẩn hóa storage local VPS hoàn toàn

### Bước 8. Xóa phụ thuộc Supabase phía frontend

Đã làm:

- đã xóa `frontend/src/lib/supabase.ts`

Cần làm tiếp nếu còn env/config liên quan:

- bỏ env `NEXT_PUBLIC_SUPABASE_URL`
- bỏ env `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- bỏ các logic upload trực tiếp sang external storage nếu còn tồn tại

### Bước 9. Xóa phụ thuộc Cloudinary phía frontend

Cần làm:

- rà mọi component upload/image preview
- bỏ mọi logic signed URL/S3/Cloudinary nếu còn
- dọn `frontend/next.config.js` nếu không cần remote image host cũ nữa

Lưu ý: nếu bài blog/content chỉ nhắc Cloudinary như nội dung bài viết thì không bắt buộc sửa. Nhưng nếu là cấu hình runtime thực tế thì phải dọn.

### Bước 10. Xác nhận category upload đúng cho toàn site

Hiện backend upload service đang dùng category:

- `images`
- `audio`
- `video`
- `documents`

Cần kiểm tra tất cả frontend uploader đang gửi đúng category tương thích, ví dụ:

- avatar → `images`
- thumbnail → `images`
- cover nhạc → `images`
- mp3 → `audio`
- mp4 → `video`
- file tài liệu → `documents`

Nếu frontend đang gửi giá trị khác như `thumbnails`, `covers`, `music-covers`, cần map lại để không lỗi.

### Bước 11. Xác nhận size limit production

Hiện có:

- image: `10MB`
- audio: `100MB`
- video: `500MB`
- documents: `50MB`

Cần đối chiếu với nhu cầu thực tế của web cũ.

Nếu upload track nhạc hoặc video lớn hơn, cần tăng đồng bộ ở:

- `multer` limit
- config env
- nginx `client_max_body_size`
- frontend validation message

## Phase 4 — Chuẩn hóa auth và tích hợp frontend/backend

### Bước 12. Rà toàn bộ comment và logic auth đang gắn nhầm Spring Boot

Các file cần audit kỹ:

- `frontend/src/lib/auth.ts`
- `frontend/src/lib/api.ts`
- `frontend/src/app/api/auth/login/route.ts`
- `frontend/src/app/api/auth/sync/route.ts`

Mục tiêu:

- comment phải đổi từ “Spring Boot backend” sang “Node backend”
- endpoint phải đúng với backend Node hiện tại
- không còn assumptions cũ về Java auth flow

### Bước 13. Chốt base URL production

Cần quy ước rõ:

- frontend domain: ví dụ `https://cuonghoangdev.com`
- backend domain/API: ví dụ `https://api.cuonghoangdev.com`
- hoặc backend đi sau cùng domain qua nginx path `/api`

Sau đó đồng bộ:

- `NEXT_PUBLIC_API_URL`
- `FRONTEND_URL`
- `ALLOWED_ORIGINS`
- NextAuth config
- OAuth callback URLs
- middleware / admin-check / session endpoints

### Bước 14. Test đủ các luồng auth production

Cần test:

- login credentials
- logout
- profile session
- OAuth Google
- OAuth GitHub
- role admin
- middleware protect route admin
- cookie `backend_token`
- session refresh

## Phase 5 — Chuẩn hóa database sau migration khỏi Java

### Bước 15. Chốt schema hiện dùng cho Node

Phải xác minh:

- Prisma schema hiện đã đầy đủ chưa
- model nào đang dùng trong Node runtime
- có bảng nào backend Node đang cần nhưng DB chưa có
- có bảng nào còn phụ thuộc Java-era naming/mapping không

### Bước 16. Chốt quy trình migrate production

Production cần có một quy trình duy nhất:

- `prisma generate`
- `prisma migrate deploy` hoặc quy trình tương đương
- seed admin nếu cần

Không nên để production còn phụ thuộc migration từ `src/main/resources/db/migration/**` nếu Java đã bỏ hẳn.

### Bước 17. Kiểm tra tương thích dữ liệu cũ

Cần test dữ liệu cũ của web cũ với hệ Node mới cho các module:

- users
- roles
- posts
- categories
- comments
- products
- orders
- discount codes
- music tracks
- playlists
- uploaded files
- AI document chunks nếu còn dùng

## Phase 6 — Kiểm tra tính năng toàn website

### Bước 18. Smoke test public pages

Cần test:

- home
- login
- profile
- blog list
- blog detail
- projects
- shop list
- product detail
- music list
- music player
- AI/chat nếu public
- contact form

### Bước 19. Smoke test admin pages

Cần test:

- admin dashboard
- admin users
- admin posts
- admin shop
- admin music
- admin stats
- admin upload flows

### Bước 20. Test upload end-to-end

Cần test thực trên VPS:

- upload ảnh
- upload mp3
- upload mp4/video
- upload document
- upload nhiều file cùng lúc
- xóa file
- reload trang và xác nhận file URL còn hoạt động
- restart container và xác nhận file vẫn còn

### Bước 21. Test music streaming end-to-end

Cần test:

- upload track mới
- phát track mới
- tua nhạc bằng Range request
- pause/play
- cover image hiển thị đúng
- file local path tồn tại đúng trên VPS
- stream hoạt động sau restart

## Phase 7 — Bảo mật, backup và monitoring

### Bước 22. Dọn secrets và env cũ

Cần loại khỏi env mọi biến không còn dùng:

- `SUPABASE_*`
- `CLOUDINARY_*`
- `SPRING_*`
- `APP_FILE_STORAGE_PATH` nếu backend Node không dùng tên biến này

Cần giữ và chuẩn hóa:

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `COOKIE_SECRET`
- `REDIS_URL` hoặc `REDIS_HOST`/`REDIS_PORT`
- `FRONTEND_URL`
- `ALLOWED_ORIGINS`
- `UPLOAD_DIR`
- `GEMINI_API_KEY`
- OAuth secrets
- SMTP secrets

### Bước 23. Backup production

Cần có:

- backup PostgreSQL hằng ngày
- backup thư mục uploads hằng ngày
- cơ chế restore test được
- giữ ít nhất 7 đến 14 bản gần nhất

### Bước 24. Monitoring production

Cần theo dõi:

- dung lượng ổ đĩa uploads
- RAM container backend/frontend/postgres/redis
- lỗi 5xx từ nginx/backend
- failed login rate
- upload failure rate
- database health

## Phase 8 — CI/CD và vận hành

### Bước 25. Sửa workflow GitHub Actions theo Node mới

Cần sửa hoặc thay mới workflow để:

- không còn phụ thuộc `pom.xml`
- không dùng Spring-specific deploy path
- build đúng Node backend image
- build đúng frontend image nếu frontend cũng deploy từ repo này
- rsync/exclude đúng các artifact cũ
- deploy đúng compose Node mới

### Bước 26. Exclude legacy khỏi deploy

Trong rsync, Docker context và workflow cần exclude:

- `bin/`
- `src/main/java/`
- `target/`
- file/tài liệu deploy cũ nếu không dùng

## 6. Danh sách P0 / P1 / P2 rõ ràng

## P0 — Bắt buộc trước khi go-live

- chốt nguồn sự thật deploy Node
- vô hiệu hóa/tách toàn bộ Java legacy khỏi luồng deploy
- chốt schema DB cho Node
- chốt upload local VPS hoàn toàn
- dọn env và config cũ Supabase/Cloudinary/Spring
- test login/profile/admin/upload/music streaming trên VPS thật
- cấu hình nginx + HTTPS + body size upload
- xác nhận volume uploads persist sau restart

Trạng thái hiện tại:

- source of truth production đã chốt là `docker-compose.yml` ở root
- workflow và compatibility compose đã được đồng bộ theo hướng này
- frontend Prisma cũ đã bị loại khỏi build path

## P1 — Nên làm ngay sau P0

- dọn comment/content kỹ thuật gây nhầm trong frontend
- dọn `bin/**`
- dọn `frontend/src/lib/supabase.ts`
- sửa GitHub Actions theo Node mới
- viết lại tài liệu deploy production chính thức

## P2 — Tối ưu sau khi đã live ổn

- log rotation tốt hơn
- monitoring/alerting
- backup automation nâng cao
- CDN cho static public assets nếu traffic tăng lớn

## 6. Runtime mismatches phát hiện khi đối chiếu frontend ↔ backend Node

### 6.1 Auth / Profile

- `frontend/src/app/profile/page.tsx` gọi `POST /auth/change-password` nhưng trước đó chỉ gửi:
  - `currentPassword`
  - `newPassword`
- Backend `src/routes/auth.routes.ts` validate thêm `confirmPassword` bắt buộc.
- Trạng thái: đã sửa payload frontend để gửi đủ `confirmPassword`.

- `frontend/src/store/authStore.ts` trước đó vẫn ghi `token` vào `localStorage` trong `setAuth()` dù comment bên dưới nói JWT không nên persist vào localStorage.
- Trạng thái: đã bỏ persist token vào `localStorage`; auth production giờ ưu tiên `backend_token` httpOnly cookie.

- `frontend/src/hooks/useChatSSE.ts` trước đó còn tự đọc `localStorage.getItem('token')` để gắn `Authorization` header.
- Trạng thái: đã bỏ dependency này để đồng bộ với cookie-based auth hiện tại.

### 6.2 Admin Users

- `frontend/src/app/admin/users/page.tsx` trước đó giả định backend trả page object trong `data.content`.
- Backend `src/routes/admin.routes.ts` thực tế trả:
  - `data: users[]`
  - `pagination: { ... }`
- Trạng thái: đã sửa frontend parse theo đúng response shape hiện tại.

- Frontend gửi query `provider` cho `/api/v1/admin/users`.
- Backend trước đó chưa xử lý `provider` filter trong `src/routes/admin.routes.ts`.
- Trạng thái: đã thêm filter `provider`, gồm cả case `credentials -> provider: null`.

### 6.3 Blog / Admin Posts

- `frontend/src/app/admin/posts/page.tsx` trước đó gọi public route `GET /blog/posts`.
- Public backend route `src/routes/blog.routes.ts` hardcode `status: 'PUBLISHED'`, nên admin không thể xem đầy đủ draft/scheduled.
- Trạng thái: đã thêm root-fix bằng admin route riêng `GET /api/v1/admin/posts` trong `src/routes/admin.routes.ts`.
- Route mới hỗ trợ:
  - `page`
  - `size`
  - `keyword`
  - `status`
- Đồng thời trả đúng shape `data: posts[]` + `pagination` cho admin UI.

- `frontend/src/app/admin/posts/page.tsx` đã được trỏ sang `/admin/posts`.
- `frontend/src/app/admin/page.tsx` cũng đã dùng admin posts route cho recent posts dashboard.

- Trạng thái mới: CRUD cơ bản cho admin blog đã có backend thật.
- Đã thêm:
  - `POST /api/v1/admin/posts`
  - `PUT /api/v1/admin/posts/:id`
  - `DELETE /api/v1/admin/posts/:id`
- Logic hiện tại:
  - tự tạo category nếu admin nhập category mới
  - tự tạo/upsert tags theo tên
  - tự generate slug unique
  - tự set `publishedAt` theo `status`

- `frontend/src/app/admin/posts/page.tsx` đã nối modal create/edit/delete vào API thật, thay cho placeholder toast.
- Phần còn lại nếu muốn polish thêm sau go-live:
  - category dropdown thay vì free text
  - featured/sourceUrl/toggle publish controls
  - validation sâu hơn cho scheduled time và slug strategy

### 6.4 Courses / Academy

- Một số màn courses vẫn còn parse theo shape Spring cũ `data.content` / `data.totalPages`.
- Backend Node ở `src/routes/course.routes.ts` thực tế dùng chuẩn:
  - `data: courses[]`
  - `pagination: { page, limit, total, totalPages }`
- Trạng thái: đã sửa các màn chính để parse đúng shape mới.

- Đã sửa frontend tại:
  - `frontend/src/app/admin/courses/page.tsx`
  - `frontend/src/app/courses/page.tsx`
  - `frontend/src/components/academy/CourseDetailClient.tsx`
- Kết quả:
  - admin courses list/filter/pagination hoạt động theo response Node hiện tại
  - public courses list/filter/pagination hoạt động theo response Node hiện tại
  - related courses ở course detail không còn phụ thuộc `data.content`

- `frontend/src/app/admin/courses/page.tsx` trước đó load detail để edit bằng cách gọi list endpoint rồi lọc `keyword: course.slug`.
- Cách này dễ lệch dữ liệu và không đảm bảo có sections/lessons đầy đủ.
- Trạng thái mới: đã thêm admin detail endpoint thật `GET /api/v1/courses/admin/:id` và frontend edit course đã dùng endpoint này.

- Đã thêm backend admin routes trong `src/routes/course.routes.ts`:
  - `GET /api/v1/courses/admin/all`
  - `GET /api/v1/courses/admin/:id`
- Đồng thời chuẩn hóa serialize course để frontend nhận được field đầy đủ hơn:
  - category/instructor/semester
  - tags
  - sections + lessons
  - rating/student counters
  - numeric price / discountPrice / avgRating

- Phần đã tốt hơn rõ rệt:
  - admin courses listing
  - admin course edit data loading
  - public courses listing
  - academy course detail related content loading

- Phần chưa thể coi là production-complete trong batch này:
  - sync đầy đủ nested sections/lessons/documents khi update course
  - verify enroll/progress/learn/review end-to-end runtime
  - verify purchase/academy integration nếu course paid đi qua cart/order flow

### 6.5 Music

- Music backend routes trước đó đã có nền tảng khá tốt cho upload + stream, nhưng public frontend đang làm rơi thông tin playback source.
- Root issue phát hiện trong batch này:
  - backend trả track có thể dùng `localPath`
  - frontend public page chỉ giữ `audioUrl`
  - khi `audioUrl` rỗng, player coi track là hỏng dù backend stream thật vẫn có thể chạy qua `/api/v1/music/stream/:id`

- Đã sửa các điểm chính:
  - `frontend/src/types/index.ts`
  - `frontend/src/app/music/page.tsx`
  - `frontend/src/components/music/MusicAudioController.tsx`

- Trạng thái mới:
  - `Track` type đã chứa thêm `durationSeconds`, `localPath`, `fileSize`, `active`, `createdAt`
  - public music page khi map API sẽ ưu tiên playback URL theo thứ tự:
    - `audioUrl` nếu backend có sẵn
    - `/uploads/<localPath>` nếu có local file path
    - fallback `/api/v1/music/stream/:id`
  - audio controller đã chấp nhận cả URL dạng:
    - `/api/v1/music/stream/:id`
    - `/uploads/...`
    - `http/https` public URLs

- Ý nghĩa production:
  - public music/player không còn phụ thuộc cứng vào `audioUrl` remote
  - luồng local VPS uploads + Node streaming trở nên khớp hơn với cách backend hiện tại hoạt động
  - giảm nguy cơ danh sách track hiện ra nhưng bấm phát không chạy

- Admin music hiện đã có backend thật cho:
  - list tracks
  - create track (audio + cover upload)
  - update metadata
  - delete track
- Batch này chưa thay đổi lớn ở admin music vì phần public playback contract là chỗ rủi ro hơn.

- Phần vẫn cần verify runtime trước khi coi là go-live safe:
  - upload track thật từ admin `/admin/music`
  - phát nhạc trên `/music`
  - seek/tua nhạc với `Range` request
  - fallback giữa `/uploads/...` và `/api/v1/music/stream/:id` trên VPS thật
  - Nginx serve uploads volume ổn sau restart/redeploy

### 6.6 Shop

- Đã phát hiện shop hiện tại trước đó lệch không chỉ response shape mà cả route contract.
- `frontend/src/lib/api/shop.ts` đang gọi nhiều endpoint không tồn tại hoặc sai prefix so với backend Node thực tế.
- Trạng thái mới: đã bổ sung backend shop routes thật trong `src/routes/shop.routes.ts` và đồng bộ lại helper frontend theo cùng contract.

- Đã thêm / chuẩn hóa backend routes:
  - `GET /api/v1/shop/categories`
  - `GET /api/v1/shop/products`
  - `GET /api/v1/shop/products/featured`
  - `GET /api/v1/shop/products/:slug`
  - `GET /api/v1/shop/discount/:code`
  - `POST /api/v1/shop/orders`
  - `GET /api/v1/shop/admin/products`
  - `POST /api/v1/shop/admin/products`
  - `PUT /api/v1/shop/admin/products/:id`
  - `DELETE /api/v1/shop/admin/products/:id`
  - `GET /api/v1/shop/admin/orders`
  - `PUT /api/v1/shop/admin/orders/:id/status`
  - `GET /api/v1/shop/admin/discounts`
  - `POST /api/v1/shop/admin/discounts`
  - `PUT /api/v1/shop/admin/discounts/:id`
  - `DELETE /api/v1/shop/admin/discounts/:id`

- `frontend/src/lib/api/shop.ts` đã được đồng bộ lại với prefix `/shop/*` và shape `data + pagination` hiện tại.
- Đã sửa các helper quan trọng:
  - products list
  - featured products
  - discount validate
  - create order
  - admin orders
  - admin discounts

- `frontend/src/app/admin/shop/page.tsx` trước đó toàn bộ create/edit/delete/toggle chỉ là placeholder toast.
- Trạng thái mới: admin product CRUD cơ bản đã được nối vào backend thật.
- Hiện có thể:
  - tạo product
  - sửa product
  - xóa product
  - toggle featured / hot / new
  - upload file số qua upload route hiện có rồi lưu `fileUrl`

- Phần public/frontend đã đỡ lệch hơn rõ rệt:
  - product store fetch từ backend đúng hơn
  - product detail lấy sản phẩm bằng slug từ backend thật
  - checkout gọi đúng `POST /api/v1/shop/orders`
  - admin orders và admin discounts có backend route thật để bám vào

- Phần vẫn cần verify runtime trước khi coi là go-live safe:
  - discount validate UX + số tiền giảm thực tế
  - order success flow + `my-orders` / tra cứu order nếu còn dùng route cũ khác
  - product categories slug/name mapping khi dữ liệu production không đồng nhất
  - revalidate public `/shop` sau khi admin mutate
  - file download/delivery flow sau mua hàng

### 6.7 Pagination / data shape general issue

Có pattern mismatch lặp lại trong repo:

- backend Node thường trả `data: []` + `pagination: {}`
- nhiều trang frontend admin/public lại đang đọc `data.content`

Trạng thái đã sửa trong batch hiện tại:

- `frontend/src/app/page.tsx`
- `frontend/src/app/admin/page.tsx`
- `frontend/src/app/admin/posts/page.tsx`
- `frontend/src/app/blog/page.tsx`
- `frontend/src/app/blog/[slug]/page.tsx`
- `frontend/src/app/admin/users/page.tsx`

Cần rà tiếp có kiểm soát các màn sau vì chúng có thể dùng helper/route khác:

- skills pages
- courses pages
- admin courses detail loading
- projects pages nếu response shape thay đổi theo route

### 6.8 Orders / My Orders

- Sau khi nối lại shop routes, phát hiện phần orders phía frontend vẫn còn dùng contract cũ:
  - `getOrderByCode()` gọi `/orders/:code`
  - `getMyOrders()` gọi `/orders/my`
- Trong khi backend batch trước mới có `POST /api/v1/shop/orders` và admin orders routes.

- Trạng thái mới: đã bổ sung backend public orders routes trong `src/routes/shop.routes.ts`:
  - `GET /api/v1/shop/orders/:code`
  - `GET /api/v1/shop/orders/my`

- `frontend/src/lib/api/shop.ts` đã được đồng bộ sang đúng prefix `/shop/orders/*`.

- `frontend/src/app/my-orders/page.tsx` đã được sửa theo thứ tự ưu tiên hợp lý:
  - nếu user đã đăng nhập, ưu tiên lấy danh sách bằng `GET /api/v1/shop/orders/my`
  - nếu chưa có dữ liệu backend nhưng local store còn order code, fallback lookup từng order qua `GET /api/v1/shop/orders/:code`
  - khi map order backend, giữ cả `id` nội bộ và `orderCode` hiển thị để tránh lẫn lộn giữa numeric DB id và mã đơn `ORD-*`

- Ý nghĩa production:
  - `/my-orders` không còn phụ thuộc route cũ không tồn tại
  - order lookup khớp hơn với flow checkout hiện đang lưu `orderCode`
  - trải nghiệm sau checkout ổn định hơn khi user refresh trang hoặc mở lại sau đó

- Phần vẫn cần verify runtime:
  - checkout thành công → redirect `/my-orders`
  - refresh `/my-orders` vẫn thấy đơn
  - login user thật rồi xem `GET /shop/orders/my` có trả đúng dữ liệu mong đợi
  - order items sau khi load lại vẫn hiển thị đủ thumbnail / price / quantity

### 6.9 Admin orders status mapping

- Trong quá trình rà tiếp shop/orders, phát hiện thêm một lỗi logic quan trọng ở admin orders:
  - UI map `Order.id = orderCode`
  - nhưng API `PUT /api/v1/shop/admin/orders/:id/status` cần numeric DB id
- Hệ quả trước khi sửa:
  - đổi trạng thái order từ admin có thể không cập nhật đúng record
  - search/filter dễ lẫn giữa internal id và `ORD-*`

- Đã sửa tại `frontend/src/app/admin/orders/page.tsx`:
  - `id` giữ đúng backend numeric id dưới dạng string
  - `orderCode` giữ riêng cho hiển thị/search
  - optimistic update status dùng đúng internal id
  - khi set `COMPLETED`, UI cũng cập nhật `completedAt` hợp lý hơn

- Ý nghĩa production:
  - admin orders thao tác ổn định hơn
  - giảm nguy cơ đổi trạng thái thất bại âm thầm hoặc cập nhật sai đơn

## 7. Checklist xác nhận cuối cùng trước khi public internet

### 7.1 Cách test local trước

- Mục tiêu của vòng local:
  - bắt lỗi route mismatch
  - bắt lỗi payload/response shape
  - bắt lỗi UI flow
  - bắt lỗi auth cookie / admin guard cơ bản
- Chạy local stack rồi mới test theo từng cụm dưới đây.

#### 7.1.1 Local — Auth/Admin

- [x] Đăng nhập admin qua backend local (`POST /api/v1/auth/login`) thành công
- [x] Xác nhận admin token dùng được với route admin protected (`/api/v1/academy/*`)
- [x] Rà code flow UI `/login` → `/admin` và guard middleware/layout khớp nhau
- [x] Xác nhận middleware `/admin` luôn verify lại với `/api/auth/admin-check`
- [x] Xác nhận login proxy set `backend_token` httpOnly cookie cho admin flow
- [x] Rà code các trang chính `/admin/posts`, `/admin/users`, `/admin/shop`, `/admin/music`, `/admin/orders`
- [ ] Mở trang login và đăng nhập bằng tài khoản admin thật trên UI
- [ ] Sau login, vào `/admin`
- [ ] Reload trang `/admin` để chắc cookie/session không bị rớt
- [ ] Mở nhanh các trang:
  - [ ] `/admin/posts`
  - [ ] `/admin/users`
  - [ ] `/admin/shop`
  - [ ] `/admin/music`
  - [ ] `/admin/orders`
- [ ] Xác nhận không có trang nào bị đá về login sai hoặc trắng màn hình

Ghi chú xác nhận hiện tại:
- Đã smoke test backend local bằng admin login thật và dùng token gọi route protected thành công.
- Đã rà code của `frontend/src/middleware.ts`, `frontend/src/app/api/auth/login/route.ts`, `frontend/src/app/api/auth/admin-check/route.ts`, `frontend/src/app/admin/layout.tsx`, `frontend/src/app/(auth)/login/page.tsx`; flow guard hiện tại nhất quán.
- Đã rà thêm code các trang admin chính:
  - `/admin/posts`: rủi ro thấp, đang dùng `GET /api/v1/admin/posts` + CRUD thật, có fallback toast khi lỗi.
  - `/admin/users`: rủi ro thấp-vừa, list/filter/toggle/delete bám admin API thật; phần edit role hiện mới là placeholder thông báo, không phải crash risk.
  - `/admin/shop`: rủi ro vừa, CRUD/toggle đã nối backend thật và có gọi revalidate; vẫn nên click tay để chắc upload + refresh list ổn.
  - `/admin/music`: đã bỏ đọc token phía client và bỏ direct browser fallback sang backend URL; upload giờ phải đi qua same-origin proxy nhất quán hơn.
  - `/admin/orders`: rủi ro thấp, đã map tách `id` nội bộ với `orderCode`; update status dùng numeric id đúng.
- Đã vá generic proxy `frontend/src/app/api/v1/[[...path]]/route.ts` để không vỡ khi backend trả text / body rỗng / JSON lỗi, giúp các action submit như checkout lộ đúng lỗi backend hơn.
- Chưa verify lại flow UI browser/cookie/session persistence của `/admin` trong trình duyệt sau batch vá mới nhất.

#### 7.1.2 Local — Courses / Academy

- [ ] Vào `/admin/courses`
- [ ] Xác nhận list course hiện đúng
- [ ] Tìm kiếm / filter / pagination còn hoạt động
- [ ] Chọn 1 course có sẵn để edit
- [x] Xác nhận backend admin course detail load đúng qua `GET /api/v1/academy/courses/1`
- [x] Xác nhận backend submissions list load đúng qua `GET /api/v1/academy/assignments/1/submissions`
- [x] Xác nhận backend grading flow chạy end-to-end qua `POST /api/v1/academy/assignments/grade`
- [ ] Xác nhận sections / lessons load ra đúng trên UI edit course
- [ ] Vào public `/courses`
- [ ] Vào 1 trang detail `/courses/<slug>` hoặc route course public tương ứng
- [ ] Xác nhận list/detail không bị lỗi data shape kiểu `content` vs `data`

Ghi chú xác nhận hiện tại:
- Đã verify backend local thật cho `semesters`, `courses/semester/:id`, admin course detail, submissions list, và grading update.
- Đã vá route grading để trả `404` sạch khi `submissionId` không tồn tại thay vì lộ raw Prisma error.
- Chưa verify trực tiếp UI browser của `/admin/courses` và public `/courses` trong vòng này.

#### 7.1.3 Local — Shop public

- [ ] Vào `/shop`
- [ ] Xác nhận product list hiện đúng
- [ ] Test search/filter/category nếu có UI
- [ ] Mở 1 product detail `/shop/<slug>`
- [ ] Xác nhận thumbnail / price / description / file info hiện đúng

#### 7.1.4 Local — Shop admin CRUD

- [ ] Vào `/admin/shop`
- [ ] Tạo 1 product mới với dữ liệu tối thiểu
- [ ] Nếu product là digital, upload file thật qua luồng upload hiện tại
- [ ] Sau khi tạo xong, refresh `/admin/shop` xem record còn đó
- [ ] Sửa product vừa tạo
- [ ] Toggle `featured`
- [ ] Toggle `hot`
- [ ] Toggle `new`
- [ ] Xóa product test nếu không cần giữ lại
- [ ] Mở lại `/shop` để xem public list có phản ánh thay đổi không

#### 7.1.5 Local — Discounts

- [ ] Vào `/admin/discounts`
- [ ] Tạo 1 discount code test
- [ ] Ghi lại code đó
- [ ] Vào `/checkout`
- [ ] Apply code
- [ ] Xác nhận UI báo hợp lệ
- [ ] Xác nhận số tiền giảm khớp kỳ vọng
- [ ] Thử 1 code sai để chắc lỗi hiển thị đúng

#### 7.1.6 Local — Checkout / Orders

- [ ] Thêm ít nhất 1 product shop vào cart
- [ ] Vào `/checkout`
- [ ] Điền buyer info hợp lệ
- [ ] Hoàn tất payment flow hiện tại
- [ ] Xác nhận xuất hiện `orderCode`
- [ ] Bấm sang `/my-orders`
- [ ] Xác nhận đơn vừa tạo xuất hiện
- [ ] Reload `/my-orders`
- [ ] Xác nhận đơn vẫn còn sau refresh
- [ ] Nếu đã đăng nhập, logout rồi login lại và kiểm tra `/my-orders` thêm lần nữa
- [ ] Vào `/admin/orders`
- [ ] Xác nhận admin nhìn thấy order mới
- [ ] Đổi trạng thái order sang `COMPLETED`
- [ ] Quay lại `/my-orders` xem trạng thái có cập nhật không

#### 7.1.7 Local — Music

- [x] Rà code end-to-end admin music flow (`page` + proxy upload + backend controller/service)
- [x] Sửa route mismatch chính trong admin music page/proxy
- [ ] Vào `/admin/music`
- [ ] Upload 1 file audio thật
- [ ] Upload cover nếu có
- [ ] Xác nhận track mới xuất hiện trong admin list
- [ ] Vào `/music`
- [ ] Bấm play
- [ ] Bấm pause
- [ ] Tua giữa bài
- [ ] Next/previous nếu UI có
- [ ] Reload `/music` rồi phát lại
- [ ] Xác nhận không rơi vào tình trạng có track nhưng không play được

Ghi chú xác nhận hiện tại:
- Đã sửa ở `frontend/src/app/admin/music/page.tsx`:
  - list admin dùng `GET /api/v1/music/admin/tracks`
  - update/delete đi qua base admin route `/api/v1/music/admin/*`
  - payload update dùng field `coverImageUrl` để khớp `MusicUploadRequest`
- Đã sửa ở `frontend/src/app/api/v1/music/admin/upload/route.ts`:
  - proxy upload multipart giờ forward sang backend admin endpoint `POST /api/v1/music/admin/upload` thay vì route create public cũ
- Đã sửa ở `frontend/src/app/api/v1/music/admin/upload/audio/raw/route.ts`:
  - route compat raw-binary giờ tự đóng gói bytes thành `multipart/form-data` field `file` để khớp backend `PUT /api/v1/music/admin/upload/audio/raw`
- Kết luận hiện tại: blocker code-level chính của `admin/music` đã được gỡ, bước còn lại là test runtime thật.

#### 7.1.8 Local — Upload persistence basic

- [ ] Upload ít nhất 1 ảnh và 1 file/audio qua admin flow liên quan
- [ ] Refresh lại trang chứa tài nguyên đó
- [ ] Xác nhận file vẫn truy cập được
- [ ] Restart local containers/app nếu đang dùng docker
- [ ] Mở lại tài nguyên để chắc volume local không bị mất file

### 7.2 Cách test web / VPS sau khi local ổn

- Mục tiêu của vòng web/VPS:
  - bắt lỗi env production
  - bắt lỗi domain / SSL / reverse proxy
  - bắt lỗi uploads volume
  - bắt lỗi cookie auth production
  - bắt lỗi stream/download qua Nginx

#### 7.2.1 VPS — Smoke test toàn site

- [ ] Mở domain public bằng HTTPS
- [ ] Xác nhận không có mixed-content / SSL warning
- [ ] Vào homepage
- [ ] Vào blog
- [ ] Vào shop
- [ ] Vào music
- [ ] Vào login
- [ ] Xác nhận các route cơ bản đều render được

#### 7.2.2 VPS — Auth/Admin

- [ ] Login admin trên domain thật
- [ ] Reload `/admin`
- [ ] Mở `/admin/shop`, `/admin/music`, `/admin/orders`
- [ ] Xác nhận cookie auth production hoạt động ổn sau reload

#### 7.2.3 VPS — Uploads / Files

- [ ] Upload 1 thumbnail ảnh từ admin
- [ ] Upload 1 digital file từ admin shop
- [ ] Upload 1 audio file từ admin music
- [ ] Mở trực tiếp URL file nếu UI cho phép
- [ ] Xác nhận file truy cập được qua domain production
- [ ] Redeploy hoặc restart service
- [ ] Mở lại file URL cũ
- [ ] Xác nhận file không biến mất sau restart/redeploy

#### 7.2.4 VPS — Shop / Checkout / Orders

- [ ] Tạo 1 đơn test trên domain thật
- [ ] Apply discount code test
- [ ] Hoàn tất checkout flow
- [ ] Xác nhận `/my-orders` hiện đơn ngay
- [ ] Reload `/my-orders`
- [ ] Logout/login lại rồi kiểm tra `/my-orders`
- [ ] Vào `/admin/orders` đổi trạng thái đơn
- [ ] Refresh `/my-orders` để chắc trạng thái đồng bộ production

#### 7.2.5 VPS — Music streaming

- [ ] Vào `/music` trên domain thật
- [ ] Phát 1 track uploaded mới
- [ ] Tua giữa bài
- [ ] Kéo gần cuối bài
- [ ] Reload trang và phát lại
- [ ] Mở DevTools Network kiểm tra request stream trả `200/206` hợp lý
- [ ] Xác nhận `/uploads/...` hoặc `/api/v1/music/stream/:id` thực sự hoạt động sau Nginx proxy

#### 7.2.6 VPS — Post-deploy stability

- [ ] Restart container backend
- [ ] Restart container frontend
- [ ] Nếu có Nginx/container riêng thì restart luôn
- [ ] Kiểm tra lại login
- [ ] Kiểm tra lại 1 file upload cũ
- [ ] Kiểm tra lại 1 track music cũ
- [ ] Kiểm tra lại `/my-orders`

### 7.3 Khi test lỗi thì ghi lại đúng format này

- URL:
- Hành động vừa làm:
- Kết quả mong đợi:
- Kết quả thực tế:
- Console error:
- Network request bị lỗi (nếu có):
- Screenshot (nếu cần):

Chỉ nên coi là hoàn tất khi tất cả mục dưới đây đều đạt:

- backend Node chạy ổn trong production container
- frontend Next.js gọi đúng backend Node production
- PostgreSQL production đã migrate đúng schema cần dùng
- Redis hoạt động
- domain + SSL hoạt động
- admin login hoạt động
- public pages hoạt động
- upload ảnh/mp3/video/document hoạt động
- file được lưu thật trên VPS
- file vẫn còn sau restart/redeploy
- music streaming hoạt động với seek
- không còn dependency runtime vào Supabase/Cloudinary/Spring
- CI/CD không còn deploy nhầm stack cũ

## 8. Kết luận thực tế

Dự án mới của bạn hoàn toàn có thể chạy theo hướng:

- `Next.js frontend`
- `Node.js backend`
- `PostgreSQL`
- `Redis`
- `local VPS uploads`
- `Nginx`

Nhưng để full web lên internet hoạt động trọn vẹn như web cũ, repo hiện tại vẫn cần một vòng cleanup lớn để xóa ảnh hưởng của Java legacy, dọn dấu vết Supabase/Cloudinary, chốt DB migration strategy và chuẩn hóa đúng một luồng deploy production.
