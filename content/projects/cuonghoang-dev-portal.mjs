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

export default {
  slug: 'cuonghoang-dev-portal',
  title: 'cuongthai.com (Portfolio web)',
  description:
    'Nền tảng học tập + mạng xã hội full-stack: 248 model Prisma, 63 router backend, 180 trang frontend, 46 module tính năng — từ Messenger, Phòng thi chấm bằng AI, Xưởng mô phỏng tới Sân chơi 3D. Xây một mình trong hơn 50 ngày, 1.672 commit.',
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
      date: '2026-06-08',
      description:
        'Commit đầu tiên dựng backend Node.js + hạ tầng pgvector cho VPS. Bảy commit tiếp theo trong cùng 24 giờ đó toàn là fix: build path lệch tsconfig, Docker build fail, rsync xoá nhầm volume dữ liệu. Không có giai đoạn "thiết kế" tách biệt khỏi "vận hành" — kiến trúc bị bẻ cong theo từng lần deploy thất bại ngay từ ngày đầu tiên.',
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
      date: '2026-06-15',
      description:
        'Nhắn tin thời gian thực đầu tiên: trạng thái đang hoạt động, đã xem, gửi file đính kèm. Đây là nền móng cho toàn bộ tầng Socket.IO dùng lại về sau ở Feed, Notification, và Music Listen Together — cùng một socket singleton, cùng quy ước phòng theo user/thread.',
    },
    {
      phase: 'FRONTEND',
      title: 'Video player, trả lời tin nhắn, chat đính kèm ảnh/GIF',
      date: '2026-06-22',
      description:
        'Nhắn tin có reply-quote, đính kèm ảnh/GIF/sticker; feed có trình phát video riêng, thumbnail YouTube. Bắt đầu hình thành các mẫu UI (composer, media picker, reaction) được tái sử dụng xuyên suốt các module xã hội khác.',
    },
    {
      phase: 'DEVOPS',
      title: 'Chặn OOM: build tuần tự, bỏ tải sharp từ GitHub',
      date: '2026-07-06',
      description:
        'Build song song backend + frontend trên VPS 8GB từng làm kernel OOM-kill tiến trình next build (exit 137) — cache Docker bị dọn sạch sau mỗi deploy nên mọi build đều là build nguội, hai build nguội cùng lúc vượt RAM. Chuyển sang build tuần tự (backend xong mới build frontend), đồng thời đổi nguồn tải binary của sharp sang npmmirror thay vì GitHub — GitHub timeout đã từng làm hỏng 4 lần deploy liên tiếp.',
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
      date: '2026-07-10',
      description:
        'Một đợt vá bảo mật tập trung trong 3 ngày: chặn MIME nguy hiểm khi upload (SVG/HTML/JS giả dạng ảnh), guard SSRF cho DNS resolve, chuyển rate limiter sang backing bằng Redis với cơ chế fail-open, khoá route nội bộ /auth/role, và xác thực lại quyền xem bài viết/story + quyền xoá media theo đúng chủ sở hữu.',
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
      date: '2026-07-25',
      description:
        'Ra mắt Phòng thi: câu hỏi trắc nghiệm chấm deterministic (so set đáp án server-side), bài thực hành (PE) chấm bằng AI qua zip code, bài luận, và audio nói (Whisper). Ba ngày sau, 62 kịch bản của Xưởng mô phỏng được nối hai chiều vào từng bài học Academy — mở bài học từ kịch bản, và ngược lại.',
    },
    {
      phase: 'LAUNCH',
      title: 'Sân chơi 3D — và dự án vẫn đang tiếp tục',
      date: '2026-07-30',
      description:
        'Fork một dự án lái xe 3D mã nguồn mở (WebGPU + TSL + Rapier physics), dựng riêng khu Đại học FPT hoàn toàn bằng code — không dùng file .glb — và sinh câu hỏi thi thật ngay trong thế giới 3D, lấy trực tiếp từ content/exams. Dự án chưa "xong" theo nghĩa cổ điển: vẫn còn nợ kỹ thuật đã biết (xem phần cuối bài viết) và vẫn thêm module mỗi tuần.',
    },
  ],

  features: [
    { title: 'Xác thực JWT + cookie httpOnly + refresh token', description: 'Access token 24h, refresh verify bỏ qua hạn rồi tra lại DB, roleVersion vô hiệu token khi đổi mật khẩu (đã bật ở WebSocket).', status: 'DONE' },
    { title: 'Rate limiting Redis với cơ chế fail-open', description: '3 limiter theo prefix riêng, chống giả mạo X-Forwarded-For, Redis chết vẫn không kéo sập toàn site.', status: 'DONE' },
    { title: 'Upload 3 đường: multipart, signed URL nội bộ, presigned R2', description: 'MIME allowlist theo đuôi file, kiểm size thật sau khi upload xong, tự trích thumbnail cho video.', status: 'DONE' },
    { title: 'Realtime: Messenger, Feed, Notification qua Socket.IO', description: 'Redis adapter chạy đa tiến trình, phòng theo user/thread/post, chấm "đang hoạt động" nhắm đúng đối tượng thay vì broadcast toàn cục.', status: 'DONE' },
    { title: 'Phòng thi: chấm trắc nghiệm deterministic + thực hành bằng AI', description: 'Câu hỏi FE so set đáp án phía server; bài PE chấm code/luận/audio qua 3 grader AI khác nhau.', status: 'DONE' },
    { title: 'Xưởng mô phỏng: 62 kịch bản + xuất video MP4', description: 'Canvas 2D deterministic, ghi hình tương tác hoặc dựng hàng loạt bằng Playwright điều khiển đồng hồ ảo.', status: 'DONE' },
    { title: 'Finance: lịch trả nợ với 4 mô hình lãi suất', description: 'Flat theo tháng, dư nợ giảm dần kiểu EMI, theo ngày, không lãi — toàn bộ tính bằng Decimal, không dùng số thực JavaScript.', status: 'DONE' },
    { title: 'Deploy zero-downtime chống stale-build', description: '7 lớp phòng thủ: build tuần tự, force-recreate không kèm build, smoke-test 29 route, kiểm hash gói JS của /playground.', status: 'DONE' },
    { title: '3 stack LLM song song + circuit breaker theo tính năng', description: 'Circuit breaker chia giỏ riêng cho từng module, sau sự cố 1.840 lời gọi nền thất bại từng làm sập luôn tính năng chat.', status: 'DONE' },
    { title: 'CV Builder: rules-engine miễn phí + AI critique có evidence-gating', description: 'Chấm miễn phí bằng luật trước, AI chỉ là tầng cộng thêm — và không được phép bịa số liệu người dùng chưa cung cấp.', status: 'DONE' },
    { title: 'Sân chơi 3D: khu Đại học FPT dựng hoàn toàn bằng code', description: 'Three.js WebGPU/TSL + Rapier physics, câu hỏi thi thật lấy trực tiếp từ content/exams, CSP riêng cho toàn bộ khu vực.', status: 'DONE' },
    { title: 'Algorithm Visualizer: 80 thuật toán trong Web Worker sandbox', description: 'Code người dùng chạy cách ly, có timeout cứng — 100% client-side, không backend nào tham gia.', status: 'DONE' },
    { title: 'Sandbox chạy code thật cho Code Lab', description: 'Hiện chỉ eval JavaScript ngay trong realm của trang, không sandbox, không timeout — cần cách ly kiểu Web Worker như Algorithm Visualizer đã làm đúng.', status: 'IN_PROGRESS' },
    { title: 'Semantic search cho Interview knowledge base', description: 'Đang lexical-only bằng tsvector của Postgres, vì image Postgres production chưa có pgvector dù gói đã khai trong package.json.', status: 'IN_PROGRESS' },
    { title: 'Gắn route cho tính năng Story', description: 'Backend đủ 13 endpoint + component frontend 623 dòng đã viết xong, nhưng chưa nơi nào trong app import nó vào một route thật.', status: 'PLANNED' },
    { title: 'Thống nhất hàm băm địa chỉ IP', description: 'Gộp cách băm HMAC-SHA256 đúng chuẩn (đang dùng cho lượt thích project) và hàm băm 32-bit yếu (đang dùng cho snippet) thành một hàm dùng chung.', status: 'PLANNED' },
  ],

  resources: [
    { title: 'Mã nguồn (GitHub)', url: 'https://github.com/cuonghoang/cuonghoang-dev-portal', type: 'REPO', description: 'Monorepo: Next.js frontend + Express/Prisma backend.' },
    { title: 'Mô phỏng: Nginx & sự cố mất IP dẫn tới 429 hàng loạt', url: '/simulation?scenario=nginx-proxy', type: 'LINK', description: 'Tái hiện đúng sự cố thật đã xảy ra: qua proxy mọi người dùng chung một IP, rate limiter gộp cả site vào một bộ đếm.' },
    { title: 'Mô phỏng: đường deploy zero-downtime thật', url: '/simulation?scenario=deploy-pipeline', type: 'LINK', description: 'Từng bước rsync → build tuần tự → swap nguyên tử → migrate → seed → smoke-test.' },
    { title: 'Mô phỏng: bộ nhớ VPS 8GB dưới tải build', url: '/simulation?scenario=vps-memory', type: 'LINK', description: 'Vì sao build song song từng làm kernel OOM-kill tiến trình next build.' },
    { title: 'Mô phỏng: 5 container Docker Compose', url: '/simulation?scenario=docker-compose', type: 'LINK', description: 'Mạng bridge, healthcheck, phụ thuộc khởi động giữa 5 service.' },
    { title: 'Mô phỏng: rate limit Redis & cơ chế fail-open', url: '/simulation?scenario=rate-limit', type: 'LINK', description: 'Vì sao lỗi ở tầng rate-limit không được phép hạ cả site.' },
    { title: 'Mô phỏng: pipeline CI/CD thủ công có chủ đích', url: '/simulation?scenario=cicd-pipeline', type: 'LINK', description: 'Vì sao chỉ 1/10 workflow của repo chạy tự động khi push.' },
  ],

  coreKnowledge: [
    'Next.js App Router: SSR, Route Handler làm proxy, cache-control theo từng route',
    'Express + TypeScript ở quy mô 63 router, 248 model Prisma không vỡ quan hệ',
    'Prisma migrate deploy ở production — không db push, có lịch sử migration để audit',
    'Redis đa vai trò: cache read-through, rate-limit store, quota, OTP, Socket.IO adapter',
    'JWT + cookie httpOnly + refresh token + vô hiệu hoá theo roleVersion',
    'Socket.IO với Redis adapter cho realtime chạy đa tiến trình',
    'Docker multi-stage build + Nginx reverse proxy + Let\'s Encrypt',
    'Cloudflare R2 (S3-compatible): presigned PUT/GET, không multipart thật',
    '3 stack LLM song song (Anthropic-compatible, Groq, OpenRouter) với circuit breaker riêng',
    'Embedding cục bộ bằng ONNX (Xenova/all-MiniLM-L6-v2) cho RAG, không tốn API',
  ],
  portfolioBonus: [
    'Renderer Markdown tự viết (unified): callout, heading-id, và giờ có cả sơ đồ Mermaid',
    'Xưởng mô phỏng: dựng video giáo trình bằng canvas 2D deterministic + Playwright headless',
    'Sân chơi 3D: Three.js WebGPU/TSL + Rapier physics, CSP riêng biệt với phần còn lại của site',
    'Algorithm Visualizer: 80 thuật toán chạy an toàn trong Web Worker sandbox',
    'Deploy chống stale-build 7 lớp: build tuần tự, force-recreate, smoke-test, kiểm hash asset',
    'Log chi phí LLM theo từng request (Decimal, bảng giá theo model, không âm thầm về 0)',
    'Cơ chế "fail open" nhất quán: rate limiter và Socket.IO adapter đều ưu tiên sống sót hơn đúng tuyệt đối',
  ],
  completionOutcomes: [
    'Thiết kế schema quan hệ ở quy mô lớn (248 model) không vỡ khi mở rộng',
    'Vá bảo mật thực chiến: MIME allowlist, SSRF guard, chống giả mạo XFF, rate-limit bypass',
    'Vận hành production một mình: deploy, backup, cron, giám sát, và cả rollback',
    'Đọc log sự cố thật rồi viết lại quy trình để không lặp lại lần thứ hai',
    'Biết rõ và ghi công khai nợ kỹ thuật ở đâu, thay vì để nó tự lộ ra thành sự cố',
  ],

  bodyMdx,
};
