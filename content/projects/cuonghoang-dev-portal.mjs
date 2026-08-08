/**
 * Case-study #1 — cuongthai.com, dự án chính của chính portfolio này.
 *
 * Prose dài nằm ở file .md cạnh đây (lý do: nhiều khối code + 3 sơ đồ mermaid,
 * cùng lý do content/deepdives/*.mjs tách .md riêng — xem project-seed.mjs).
 *
 * NGUỒN DỮ KIỆN: mọi số liệu/đường dẫn/hành vi mô tả trong .md và trong
 * milestones/features bên dưới đến từ khảo sát trực tiếp mã nguồn (đọc file,
 * grep, đếm bằng lệnh thật) chạy trong phiên soạn bài viết này — KHÔNG suy
 * đoán từ tên biến. Ngày các milestone lấy từ `git log --format=%ad` thật,
 * không bịa. Những chỗ không thể xác minh từ trong repo (crontab VPS thật,
 * tường lửa thật) được văn bản ghi rõ là "chưa xác minh" thay vì khẳng định.
 *
 * Giữ nguyên `slug` khi tái seed để không làm mất `viewCount`/`likeCount` đã
 * tích luỹ — xem cơ chế idempotent trong project-seed.mjs.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./cuonghoang-dev-portal.md', import.meta.url),
  'utf8',
);
const bodyMdxEn = fs.readFileSync(
  new URL('./cuonghoang-dev-portal.en.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'cuonghoang-dev-portal',
  title: 'cuongthai.com (Portfolio web)',
  titleEn: 'cuongthai.com (Portfolio web)',
  description:
    'Nền tảng học tập + mạng xã hội full-stack: 248 model Prisma, 63 router backend, 180 trang frontend, 46 module tính năng — từ Messenger, Phòng thi chấm bằng AI, Xưởng mô phỏng tới Sân chơi 3D. Xây một mình trong hơn 50 ngày, 1.672 commit.',
  descriptionEn:
    'A full-stack learning platform and social network: 248 Prisma models, 63 backend routers, 180 frontend pages, 46 feature modules — from Messenger and an AI-graded Exam Room to a Simulation Studio and a 3D Playground. Built solo across just over 50 days and 1,672 commits.',
  techStack: [
    'Next.js 15 (App Router)', 'TypeScript', 'Express', 'Prisma', 'PostgreSQL + PostGIS',
    'Redis', 'Socket.IO', 'Cloudflare R2', 'Docker', 'Nginx',
    'Anthropic-compatible gateway', 'Groq', 'Three.js (WebGPU/TSL)',
  ],
  role: 'Full-stack Developer (một người)',
  duration: 'Từ 06/2026 — đang tiếp tục',
  status: 'IN_PROGRESS',
  category: 'Web',
  difficulty: 'ADVANCED',
  thumbnailUrl: 'https://media.cuongthai.com/images/projects/cuonghoang-dev-portal.webp',
  projectUrl: 'https://cuongthai.com',
  githubUrl: 'https://github.com/cuonghoang/cuonghoang-dev-portal',
  startDate: '2026-06-08',
  endDate: null,
  isFeatured: true,
  isPublished: true,

  schemaCode: `// Phân quyền là quan hệ nhiều-nhiều, không phải enum tĩnh —
// và roleVersion là cơ chế vô hiệu hoá token khi đổi mật khẩu.

model Role {
  id    Int        @id @default(autoincrement())
  name  String     @unique @db.VarChar(50)   // "ROLE_ADMIN" | "ROLE_USER"
  users UserRole[]
  @@map("roles")
}

model UserRole {
  userId Int
  roleId Int
  user   User @relation(fields: [userId], references: [id], onDelete: Cascade)
  role   Role @relation(fields: [roleId], references: [id], onDelete: Cascade)
  @@id([userId, roleId], map: "pk_user_roles")
  @@map("user_roles")
}

model User {
  id          Int        @id @default(autoincrement())
  username    String     @unique @db.VarChar(50)
  email       String     @unique @db.VarChar(255)
  password    String?    @db.VarChar(255)   // null = tài khoản OAuth
  enabled     Boolean    @default(true)
  accountNonLocked Boolean @default(true)
  failedLoginCount Int   @default(0)
  lockoutUntil DateTime?
  // ++ mỗi lần đổi mật khẩu — Socket.IO so cột này với token
  // lúc bắt tay để đá token cũ ra khỏi phiên; middleware HTTP
  // hiện CHƯA so — bất đối xứng này được ghi trong bài viết.
  roleVersion BigInt     @default(0) @map("role_version")
  roles       UserRole[]
  @@map("users")
}`,
  schemaLang: 'prisma',

  milestones: [
    {
      phase: 'IDEATION',
      title: 'Khởi tạo backend, và một ngày đầu toàn fix',
      titleEn: "Backend initialised, and a first day of nothing but fixes",
      date: '2026-06-08',
      description:
        'Commit đầu tiên dựng backend Node.js + hạ tầng pgvector cho VPS. Bảy commit tiếp theo trong cùng 24 giờ đó toàn là fix: build path lệch tsconfig, Docker build fail, rsync xoá nhầm volume dữ liệu. Không có giai đoạn "thiết kế" tách biệt khỏi "vận hành" — kiến trúc bị bẻ cong theo từng lần deploy thất bại ngay từ ngày đầu tiên.',
      descriptionEn:
        "The first commit stands up a Node.js backend with pgvector infrastructure for the VPS. The next seven commits, all within 24 hours, are every one of them a fix: a build path disagreeing with tsconfig, a failing Docker build, an rsync deleting a data volume. There was no \"design\" phase separate from \"operations\" — the architecture was bent by each failed deployment from day one.",
      codeBlock:
        '2026-06-08  feat: init optimized nodejs backend with pgvector infrastructure for VPS\n'
        + '2026-06-08  fix: align build path with tsconfig output\n'
        + '2026-06-08  fix: force tsconfig to commonjs\n'
        + '2026-06-08  fix: align backend runtime and Docker build\n'
        + '2026-06-08  fix: stabilize frontend Docker build\n'
        + '2026-06-09  fix: resolve critical bugs across all flows for 100% operation\n'
        + '2026-06-09  fix: remove pgvector shared_preload (not available in postgis image)\n'
        + '2026-06-09  fix: exclude postgres/redis/uploads from rsync, preserve docker data dirs',
      codeLang: 'plaintext',
    },
    {
      phase: 'BACKEND',
      title: 'Messenger full-stack: presence, read receipt, upload file',
      titleEn: "Messenger full-stack: presence, read receipts, file upload",
      date: '2026-06-15',
      description:
        'Nhắn tin thời gian thực đầu tiên: trạng thái đang hoạt động, đã xem, gửi file đính kèm. Đây là nền móng cho toàn bộ tầng Socket.IO dùng lại về sau ở Feed, Notification, và Music Listen Together — cùng một socket singleton, cùng quy ước phòng theo user/thread.',
      descriptionEn:
        "The first realtime messaging: online status, seen markers, file attachments. This became the foundation of the whole Socket.IO layer reused later by Feed, Notifications and Music Listen Together — the same socket singleton, the same per-user and per-thread room conventions.",
    },
    {
      phase: 'FRONTEND',
      title: 'Video player, trả lời tin nhắn, chat đính kèm ảnh/GIF',
      titleEn: "Video player, message replies, image and GIF attachments",
      date: '2026-06-22',
      description:
        'Nhắn tin có reply-quote, đính kèm ảnh/GIF/sticker; feed có trình phát video riêng, thumbnail YouTube. Bắt đầu hình thành các mẫu UI (composer, media picker, reaction) được tái sử dụng xuyên suốt các module xã hội khác.',
      descriptionEn:
        "Messaging gains reply quoting and image, GIF and sticker attachments; the feed gains its own video player and YouTube thumbnails. The UI patterns recurring across every other social module — composer, media picker, reactions — start taking shape here.",
    },
    {
      phase: 'DEVOPS',
      title: 'Chặn OOM: build tuần tự, bỏ tải sharp từ GitHub',
      titleEn: "Stopping OOM: sequential builds, dropping sharp downloads from GitHub",
      date: '2026-07-06',
      description:
        'Build song song backend + frontend trên VPS 8GB từng làm kernel OOM-kill tiến trình next build (exit 137) — cache Docker bị dọn sạch sau mỗi deploy nên mọi build đều là build nguội, hai build nguội cùng lúc vượt RAM. Chuyển sang build tuần tự (backend xong mới build frontend), đồng thời đổi nguồn tải binary của sharp sang npmmirror thay vì GitHub — GitHub timeout đã từng làm hỏng 4 lần deploy liên tiếp.',
      descriptionEn:
        "Building backend and frontend in parallel on an 8GB VPS had the kernel OOM-kill the next build process (exit 137) — the Docker cache is pruned after every deployment, so every build is cold, and two cold builds at once exceed RAM. The fix was sequential builds plus switching sharp binary downloads to npmmirror instead of GitHub, whose timeouts had broken four consecutive deployments.",
      codeBlock:
        '# Step 2a — build TUẦN TỰ, không song song (OOM guard)\n'
        + '$DC build backend    # xong mới build tiếp\n'
        + '$DC build frontend\n\n'
        + '# Step 2b — swap nguyên tử, KHÔNG kèm --build\n'
        + '# (kèm --build thì Compose dựng lại CẢ HAI image song song\n'
        + '#  ngay tại đây, phá đúng hàng rào vừa dựng ở bước 2a)\n'
        + '$DC up -d --force-recreate --remove-orphans',
      codeLang: 'bash',
    },
    {
      phase: 'SECURITY',
      title: '3 ngày vá lỗ hổng: MIME allowlist, SSRF, rate-limit Redis',
      titleEn: "Three days of security patching: MIME allowlist, SSRF, Redis rate limiting",
      date: '2026-07-10',
      description:
        'Một đợt vá bảo mật tập trung trong 3 ngày: chặn MIME nguy hiểm khi upload (SVG/HTML/JS giả dạng ảnh), guard SSRF cho DNS resolve, chuyển rate limiter sang backing bằng Redis với cơ chế fail-open, khoá route nội bộ /auth/role, và xác thực lại quyền xem bài viết/story + quyền xoá media theo đúng chủ sở hữu.',
      descriptionEn:
        "A focused three-day security pass: blocking dangerous upload MIME types (SVG, HTML and JS disguised as images), an SSRF guard on DNS resolution, moving the rate limiter onto Redis with fail-open behaviour, locking the internal /auth/role route, and re-verifying post and story visibility plus media deletion against actual ownership.",
      codeBlock:
        '// fail-open: lỗi ở tầng rate-limit KHÔNG được phép hạ cả site\n'
        + 'async function failOpen(limiter) {\n'
        + '  return (req, res, next) => {\n'
        + '    limiter(req, res, (err) => {\n'
        + '      if (err) { logger.warn(\'rate limiter store error — failing open\'); return next(); }\n'
        + '      next();\n'
        + '    });\n'
        + '  };\n'
        + '}',
      codeLang: 'typescript',
    },
    {
      phase: 'TESTING',
      title: 'Phòng thi: FE/PE với chấm bằng AI',
      titleEn: "Exam Room: FE and PE with AI grading",
      date: '2026-07-25',
      description:
        'Ra mắt Phòng thi: câu hỏi trắc nghiệm chấm deterministic (so set đáp án server-side), bài thực hành (PE) chấm bằng AI qua zip code, bài luận, và audio nói (Whisper). Ba ngày sau, 62 kịch bản của Xưởng mô phỏng được nối hai chiều vào từng bài học Academy — mở bài học từ kịch bản, và ngược lại.',
      descriptionEn:
        "The Exam Room launches: multiple choice graded deterministically through server-side answer-set comparison, and practical exams graded by AI across zipped code, essays and spoken audio via Whisper. Three days later the Simulation Studio's 62 scenarios were wired bidirectionally into individual Academy lessons — open a lesson from a scenario and back again.",
    },
    {
      phase: 'LAUNCH',
      title: 'Sân chơi 3D — và dự án vẫn đang tiếp tục',
      titleEn: "3D Playground — and the project continues",
      date: '2026-07-30',
      description:
        'Fork một dự án lái xe 3D mã nguồn mở (WebGPU + TSL + Rapier physics), dựng riêng khu Đại học FPT hoàn toàn bằng code — không dùng file .glb — và sinh câu hỏi thi thật ngay trong thế giới 3D, lấy trực tiếp từ content/exams. Dự án chưa "xong" theo nghĩa cổ điển: vẫn còn nợ kỹ thuật đã biết (xem phần cuối bài viết) và vẫn thêm module mỗi tuần.',
      descriptionEn:
        "Forking an open-source 3D driving project (WebGPU + TSL + Rapier physics), building the FPT University campus entirely in code with no .glb files, and generating real exam questions inside the 3D world straight from content/exams. The project is not \"finished\" in the classical sense: known technical debt remains and modules are still added weekly.",
    },
  ],

  features: [
    { title: 'Xác thực JWT + cookie httpOnly + refresh token', titleEn: 'JWT auth with httpOnly cookies and refresh tokens', description: 'Access token 24h, refresh verify bỏ qua hạn rồi tra lại DB, roleVersion vô hiệu token khi đổi mật khẩu (đã bật ở WebSocket).', descriptionEn: 'A 24-hour access token; refresh verifies ignoring expiry then re-checks the database; roleVersion invalidates tokens on password change (enforced on WebSocket).', status: 'DONE' },
    { title: 'Rate limiting Redis với cơ chế fail-open', titleEn: 'Redis rate limiting that fails open', description: '3 limiter theo prefix riêng, chống giả mạo X-Forwarded-For, Redis chết vẫn không kéo sập toàn site.', descriptionEn: 'Three limiters under separate prefixes, XFF spoofing defence, and a dead Redis that does not take the site down.', status: 'DONE' },
    { title: 'Upload 3 đường: multipart, signed URL nội bộ, presigned R2', titleEn: 'Three upload paths: multipart, internal signed URLs, presigned R2', description: 'MIME allowlist theo đuôi file, kiểm size thật sau khi upload xong, tự trích thumbnail cho video.', descriptionEn: 'A MIME allowlist by file extension, real size verification after upload, and automatic video thumbnails.', status: 'DONE' },
    { title: 'Realtime: Messenger, Feed, Notification qua Socket.IO', titleEn: 'Realtime Messenger, Feed and Notifications over Socket.IO', description: 'Redis adapter chạy đa tiến trình, phòng theo user/thread/post, chấm "đang hoạt động" nhắm đúng đối tượng thay vì broadcast toàn cục.', descriptionEn: 'A Redis adapter for multi-process operation, rooms per user, thread and post, and presence targeted at the right audience rather than broadcast globally.', status: 'DONE' },
    { title: 'Phòng thi: chấm trắc nghiệm deterministic + thực hành bằng AI', titleEn: 'Exam Room: deterministic MCQ grading plus AI practical grading', description: 'Câu hỏi FE so set đáp án phía server; bài PE chấm code/luận/audio qua 3 grader AI khác nhau.', descriptionEn: 'FE questions compare answer sets server-side; PE submissions grade code, essays and audio through three different AI graders.', status: 'DONE' },
    { title: 'Xưởng mô phỏng: 62 kịch bản + xuất video MP4', titleEn: 'Simulation Studio: 62 scenarios with MP4 export', description: 'Canvas 2D deterministic, ghi hình tương tác hoặc dựng hàng loạt bằng Playwright điều khiển đồng hồ ảo.', descriptionEn: 'Deterministic Canvas 2D, recorded interactively or batch-rendered by Playwright driving a virtual clock.', status: 'DONE' },
    { title: 'Finance: lịch trả nợ với 4 mô hình lãi suất', titleEn: 'Finance: repayment schedules across four interest models', description: 'Flat theo tháng, dư nợ giảm dần kiểu EMI, theo ngày, không lãi — toàn bộ tính bằng Decimal, không dùng số thực JavaScript.', descriptionEn: 'Flat monthly, reducing-balance EMI, daily, and interest-free — all computed in Decimal, never JavaScript floats.', status: 'DONE' },
    { title: 'Deploy zero-downtime chống stale-build', titleEn: 'Zero-downtime deployment guarding against stale builds', description: '7 lớp phòng thủ: build tuần tự, force-recreate không kèm build, smoke-test 29 route, kiểm hash gói JS của /playground.', descriptionEn: 'Seven defensive layers: sequential builds, force-recreate without build, a 29-route smoke test, and /playground bundle hash verification.', status: 'DONE' },
    { title: '3 stack LLM song song + circuit breaker theo tính năng', titleEn: 'Three parallel LLM stacks with per-feature circuit breakers', description: 'Circuit breaker chia giỏ riêng cho từng module, sau sự cố 1.840 lời gọi nền thất bại từng làm sập luôn tính năng chat.', descriptionEn: 'Breakers bucketed per module, after an incident where 1,840 failed background calls took down interactive chat.', status: 'DONE' },
    { title: 'CV Builder: rules-engine miễn phí + AI critique có evidence-gating', titleEn: 'CV Builder: a free rules engine plus evidence-gated AI critique', description: 'Chấm miễn phí bằng luật trước, AI chỉ là tầng cộng thêm — và không được phép bịa số liệu người dùng chưa cung cấp.', descriptionEn: 'Rule-based grading first at no cost, with AI as an added layer — and never permitted to invent figures the user did not supply.', status: 'DONE' },
    { title: 'Sân chơi 3D: khu Đại học FPT dựng hoàn toàn bằng code', titleEn: '3D Playground: an FPT University campus built entirely in code', description: 'Three.js WebGPU/TSL + Rapier physics, câu hỏi thi thật lấy trực tiếp từ content/exams, CSP riêng cho toàn bộ khu vực.', descriptionEn: 'Three.js WebGPU/TSL with Rapier physics, real exam questions taken straight from content/exams, and its own CSP for the whole area.', status: 'DONE' },
    { title: 'Algorithm Visualizer: 80 thuật toán trong Web Worker sandbox', titleEn: 'Algorithm Visualizer: 80 algorithms in a Web Worker sandbox', description: 'Code người dùng chạy cách ly, có timeout cứng — 100% client-side, không backend nào tham gia.', descriptionEn: 'User code runs isolated with a hard timeout — entirely client-side, with no backend involved.', status: 'DONE' },
    { title: 'Sandbox chạy code thật cho Code Lab', titleEn: 'A real execution sandbox for Code Lab', description: 'Hiện chỉ eval JavaScript ngay trong realm của trang, không sandbox, không timeout — cần cách ly kiểu Web Worker như Algorithm Visualizer đã làm đúng.', descriptionEn: 'Currently it only evals JavaScript inside the page realm, unsandboxed and untimed — it needs the Web Worker isolation Algorithm Visualizer already gets right.', status: 'IN_PROGRESS' },
    { title: 'Semantic search cho Interview knowledge base', titleEn: 'Semantic search for the Interview knowledge base', description: 'Đang lexical-only bằng tsvector của Postgres, vì image Postgres production chưa có pgvector dù gói đã khai trong package.json.', descriptionEn: 'Currently lexical-only through Postgres tsvector, because the production Postgres image lacks pgvector despite the package being declared.', status: 'IN_PROGRESS' },
    { title: 'Gắn route cho tính năng Story', titleEn: 'Attach a route to the Stories feature', description: 'Backend đủ 13 endpoint + component frontend 623 dòng đã viết xong, nhưng chưa nơi nào trong app import nó vào một route thật.', descriptionEn: 'Thirteen backend endpoints and a 623-line frontend component are finished, but nothing in the app imports them into a real route.', status: 'PLANNED' },
    { title: 'Thống nhất hàm băm địa chỉ IP', titleEn: 'Consolidate the IP hashing helpers', description: 'Gộp cách băm HMAC-SHA256 đúng chuẩn (đang dùng cho lượt thích project) và hàm băm 32-bit yếu (đang dùng cho snippet) thành một hàm dùng chung.', descriptionEn: 'Merge the proper HMAC-SHA256 hashing (used for project likes) and the weak 32-bit hash (used for snippets) into one shared function.', status: 'PLANNED' },
  ],

  resources: [
    { title: 'Mã nguồn (GitHub)', titleEn: 'Source code (GitHub)', url: 'https://github.com/cuonghoang/cuonghoang-dev-portal', type: 'REPO', description: 'Monorepo: Next.js frontend + Express/Prisma backend.', descriptionEn: 'A monorepo: Next.js frontend plus an Express/Prisma backend.' },
    { title: 'Mô phỏng: Nginx & sự cố mất IP dẫn tới 429 hàng loạt', titleEn: 'Simulation: Nginx and the lost-IP incident causing mass 429s', url: '/simulation?scenario=nginx-proxy', type: 'LINK', description: 'Tái hiện đúng sự cố thật đã xảy ra: qua proxy mọi người dùng chung một IP, rate limiter gộp cả site vào một bộ đếm.', descriptionEn: 'Reproducing the real incident: behind a proxy every user shares one IP, so the rate limiter buckets the entire site together.' },
    { title: 'Mô phỏng: đường deploy zero-downtime thật', titleEn: 'Simulation: the real zero-downtime deployment path', url: '/simulation?scenario=deploy-pipeline', type: 'LINK', description: 'Từng bước rsync → build tuần tự → swap nguyên tử → migrate → seed → smoke-test.', descriptionEn: 'Step by step: rsync → sequential builds → atomic swap → migrate → seed → smoke test.' },
    { title: 'Mô phỏng: bộ nhớ VPS 8GB dưới tải build', titleEn: 'Simulation: 8GB VPS memory under build load', url: '/simulation?scenario=vps-memory', type: 'LINK', description: 'Vì sao build song song từng làm kernel OOM-kill tiến trình next build.', descriptionEn: 'Why parallel builds once had the kernel OOM-kill the next build process.' },
    { title: 'Mô phỏng: 5 container Docker Compose', titleEn: 'Simulation: five Docker Compose containers', url: '/simulation?scenario=docker-compose', type: 'LINK', description: 'Mạng bridge, healthcheck, phụ thuộc khởi động giữa 5 service.', descriptionEn: 'The bridge network, health checks, and startup dependencies across five services.' },
    { title: 'Mô phỏng: rate limit Redis & cơ chế fail-open', titleEn: 'Simulation: Redis rate limiting and failing open', url: '/simulation?scenario=rate-limit', type: 'LINK', description: 'Vì sao lỗi ở tầng rate-limit không được phép hạ cả site.', descriptionEn: 'Why a fault in the rate-limiting layer must never take the whole site down.' },
    { title: 'Mô phỏng: pipeline CI/CD thủ công có chủ đích', titleEn: 'Simulation: a deliberately manual CI/CD pipeline', url: '/simulation?scenario=cicd-pipeline', type: 'LINK', description: 'Vì sao chỉ 1/10 workflow của repo chạy tự động khi push.', descriptionEn: 'Why only one of the repository\'s ten workflows runs automatically on push.' },
  ],

  coreKnowledge: [
    { vi: 'Next.js App Router: SSR, Route Handler làm proxy, cache-control theo từng route', en: 'Next.js App Router: SSR, Route Handlers as proxies, per-route cache control' },
    { vi: 'Express + TypeScript ở quy mô 63 router, 248 model Prisma không vỡ quan hệ', en: 'Express and TypeScript at the scale of 63 routers and 248 Prisma models without relationships breaking' },
    { vi: 'Prisma migrate deploy ở production — không db push, có lịch sử migration để audit', en: 'Prisma migrate deploy in production — never db push, with an auditable migration history' },
    { vi: 'Redis đa vai trò: cache read-through, rate-limit store, quota, OTP, Socket.IO adapter', en: 'Redis in several roles: read-through cache, rate-limit store, quotas, OTP, Socket.IO adapter' },
    { vi: 'JWT + cookie httpOnly + refresh token + vô hiệu hoá theo roleVersion', en: 'JWT with httpOnly cookies, refresh tokens, and roleVersion-based invalidation' },
    { vi: 'Socket.IO với Redis adapter cho realtime chạy đa tiến trình', en: 'Socket.IO with a Redis adapter for multi-process realtime' },
    { vi: 'Docker multi-stage build + Nginx reverse proxy + Let\'s Encrypt', en: 'Multi-stage Docker builds, an Nginx reverse proxy, and Let\'s Encrypt' },
    { vi: 'Cloudflare R2 (S3-compatible): presigned PUT/GET, không multipart thật', en: 'Cloudflare R2 (S3-compatible): presigned PUT/GET, with no true multipart' },
    { vi: '3 stack LLM song song (Anthropic-compatible, Groq, OpenRouter) với circuit breaker riêng', en: 'Three parallel LLM stacks (Anthropic-compatible, Groq, OpenRouter) with separate circuit breakers' },
    { vi: 'Embedding cục bộ bằng ONNX (Xenova/all-MiniLM-L6-v2) cho RAG, không tốn API', en: 'Local ONNX embeddings (Xenova/all-MiniLM-L6-v2) for RAG, costing no API calls' },
  ],
  portfolioBonus: [
    { vi: 'Renderer Markdown tự viết (unified): callout, heading-id, và giờ có cả sơ đồ Mermaid', en: 'A hand-written Markdown renderer (unified): callouts, heading ids, and now Mermaid diagrams' },
    { vi: 'Xưởng mô phỏng: dựng video giáo trình bằng canvas 2D deterministic + Playwright headless', en: 'Simulation Studio: rendering lesson videos from deterministic Canvas 2D with headless Playwright' },
    { vi: 'Sân chơi 3D: Three.js WebGPU/TSL + Rapier physics, CSP riêng biệt với phần còn lại của site', en: '3D Playground: Three.js WebGPU/TSL with Rapier physics, under a CSP separate from the rest of the site' },
    { vi: 'Algorithm Visualizer: 80 thuật toán chạy an toàn trong Web Worker sandbox', en: 'Algorithm Visualizer: 80 algorithms running safely inside a Web Worker sandbox' },
    { vi: 'Deploy chống stale-build 7 lớp: build tuần tự, force-recreate, smoke-test, kiểm hash asset', en: 'Seven-layer stale-build defence: sequential builds, force-recreate, smoke tests, asset hash checks' },
    { vi: 'Log chi phí LLM theo từng request (Decimal, bảng giá theo model, không âm thầm về 0)', en: 'Per-request LLM cost logging (Decimal, per-model pricing, never quietly falling to zero)' },
    { vi: 'Cơ chế "fail open" nhất quán: rate limiter và Socket.IO adapter đều ưu tiên sống sót hơn đúng tuyệt đối', en: 'A consistent fail-open stance: both the rate limiter and the Socket.IO adapter favour survival over absolute correctness' },
  ],
  completionOutcomes: [
    { vi: 'Thiết kế schema quan hệ ở quy mô lớn (248 model) không vỡ khi mở rộng', en: 'Design relational schemas at scale (248 models) that survive extension' },
    { vi: 'Vá bảo mật thực chiến: MIME allowlist, SSRF guard, chống giả mạo XFF, rate-limit bypass', en: 'Patch security in the field: MIME allowlists, SSRF guards, XFF spoofing, rate-limit bypasses' },
    { vi: 'Vận hành production một mình: deploy, backup, cron, giám sát, và cả rollback', en: 'Operate production single-handed: deployment, backups, cron, monitoring and rollback' },
    { vi: 'Đọc log sự cố thật rồi viết lại quy trình để không lặp lại lần thứ hai', en: 'Read real incident logs and rewrite the process so it does not happen twice' },
    { vi: 'Biết rõ và ghi công khai nợ kỹ thuật ở đâu, thay vì để nó tự lộ ra thành sự cố', en: 'Know and publish where the technical debt is, rather than letting it surface as an incident' },
  ],

  bodyMdx,
  bodyMdxEn,
};
