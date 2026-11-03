/**
 * Content for /about that is FACT, moved verbatim from the previous page
 * (08/08/2026 rules still apply: nothing here may be invented — every stack
 * entry must exist in package.json / the repo tree, every incident comes from
 * the incident log in CLAUDE.md).
 *
 * `L(vi, en)` keeps the original argument order of the old page so diffs stay
 * readable; the page picks `.en` / `.vi` at render time, which is what makes the
 * language switch instant.
 */
export type Bi = { vi: string; en: string };
export type Txt = string | Bi;
const L = (vi: string, en: string): Bi => ({ vi, en });
export const tx = (v: Txt, lang: 'en' | 'vi'): string => (typeof v === 'string' ? v : v[lang]);

export const TECH_STACK: { group: Txt; accent: string; items: Txt[] }[] = [
  {
    group: L('Backend', 'Backend'),
    accent: '#6366f1',
    items: ['Node.js', 'Express', 'TypeScript', 'Prisma', 'Zod', 'JWT + bcrypt', 'Helmet', 'express-rate-limit', 'Multer', 'node-cron'],
  },
  {
    group: L('Frontend', 'Frontend'),
    accent: '#8b5cf6',
    items: ['Next.js (App Router)', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Zustand', 'TanStack Query', 'TipTap', 'Monaco Editor', 'Recharts', 'Mermaid'],
  },
  {
    group: L('Dữ liệu', 'Data'),
    accent: '#d946ef',
    items: ['PostgreSQL', 'Prisma ORM', 'Redis (ioredis)', 'pgvector', L('Migration có phiên bản', 'Versioned migrations')],
  },
  {
    group: L('Hạ tầng', 'Infrastructure'),
    accent: '#22d3ee',
    items: ['Docker', 'Nginx', L('VPS tự quản', 'Self-managed VPS'), 'GitHub Actions', 'Cloudflare R2 (S3 API)', 'Sentry'],
  },
  {
    group: L('AI', 'AI'),
    accent: '#34d399',
    items: ['LLM adapter (Anthropic / OpenAI-compatible)', 'RAG + pgvector', 'Transformers.js embeddings', L('Chặn prompt injection', 'Prompt-injection screening'), L('Cổng lọc dữ liệu cá nhân', 'PII gate'), L('Cầu dao nhà cung cấp', 'Provider circuit breaker')],
  },
  {
    group: L('Thời gian thực', 'Real-time'),
    accent: '#fbbf24',
    items: ['Socket.IO', L('WebSocket thuần (/device-ws)', 'Raw WebSocket (/device-ws)'), 'Redis adapter'],
  },
  {
    group: L('Media & tài liệu', 'Media & documents'),
    accent: '#f472b6',
    items: ['Sharp', 'FFmpeg', 'pdfkit', 'docx', 'mammoth', 'unpdf', 'music-metadata'],
  },
  {
    group: L('Khác', 'Other'),
    accent: '#a78bfa',
    items: ['Three.js / WebGL', 'ESP32-S3 firmware', 'VNPay', 'Resend', 'Java', 'Spring Boot'],
  },
];

export const INCIDENTS: { accent: string; symptom: Bi; cause: Bi; fix: Bi }[] = [
  {
    accent: '#6366f1',
    symptom: L(
      'Bộ chọn ảnh GIF chết, và các cuộc trò chuyện “biến mất” — đăng nhập lại không ăn thua.',
      'The GIF picker died and chats “disappeared” — re-logging in did nothing.',
    ),
    cause: L(
      'Một lần deploy chỉ đồng bộ mã mà KHÔNG dựng lại image: container vẫn chạy bản dựng cũ chưa hề gắn route GIF. Chat thì chưa từng mất — chỉ bị lọc bởi cờ xoá-riêng-mình.',
      'A deploy that synced code but did NOT rebuild: the container kept serving an old build that never mounted the GIF route. The chats were never lost — a per-viewer delete flag filtered them out.',
    ),
    fix: L(
      'Chẩn đoán route bằng `curl` không kèm token: 401 là đã gắn, 404 là bản dựng cũ. Deploy nay luôn dựng lại và tự kiểm route lõi.',
      'Diagnose routes with an unauthenticated `curl`: 401 means mounted, 404 means stale build. Deploys now always rebuild and smoke-test the core routes.',
    ),
  },
  {
    accent: '#8b5cf6',
    symptom: L(
      'Bật chế độ tối toàn site làm hỏng bộ chuyển ba giao diện riêng của trang ghi chú.',
      'Turning on the site-wide dark theme broke the Notes module’s own three-theme switcher.',
    ),
    cause: L(
      'Lớp `dark` bị gắn lên thẻ `<html>`, kích hoạt cưỡng bức mọi biến thể `dark:` của Tailwind nằm bên trong — kể cả những chỗ có bảng màu riêng.',
      'The `dark` class landed on `<html>`, force-activating every Tailwind `dark:` variant nested inside — including areas with their own palette.',
    ),
    fix: L(
      'Lớp tối toàn site đổi sang tên riêng, `dark:` được giữ độc quyền cho vùng ghi chú, phần còn lại dùng biến CSS theo giao diện.',
      'The global dark class got its own name, `dark:` is reserved for the Notes wrapper, and everything else uses theme CSS variables.',
    ),
  },
  {
    accent: '#d946ef',
    symptom: L(
      'Phiên đăng nhập chết im lặng sau đúng 24 giờ. Cookie vẫn còn, nhưng mọi lệnh gọi cần đăng nhập đều bị từ chối.',
      'Sessions died silently after exactly 24 hours. The cookie was still there, but every authenticated call was rejected.',
    ),
    cause: L(
      'Token hết hạn sau 24 giờ trong khi cookie sống 7 ngày, và đường làm mới token thì gọi tới một endpoint không tồn tại.',
      'The token expired in 24h while the cookie lived 7 days — and the refresh path called an endpoint that did not exist.',
    ),
    fix: L(
      'Thêm endpoint làm mới thật, cộng lớp chặn tự làm mới đúng một lần rồi gọi lại. Phiên tự lành, không phải đổi cấu hình.',
      'A real refresh endpoint plus an interceptor that refreshes once and retries. Sessions self-heal; no config change needed.',
    ),
  },
  {
    accent: '#22d3ee',
    symptom: L(
      'Sân chơi 3D kẹt mãi ở màn hình tải suốt hai phiên làm việc, không một lỗi nào hiện ra.',
      'The 3D playground hung on its loading screen across two sessions, with no error anywhere.',
    ),
    cause: L(
      'Next.js chốt danh sách tệp tĩnh ngay lúc server khởi động. Dựng lại sân chơi làm gói JS đổi tên theo mã băm nội dung, server đang chạy trả 404 cho tệp có thật trên đĩa — không JS nào chạy nên cũng không có lỗi để thấy.',
      'Next.js fixes its static-file list at server start. Rebuilding renamed the JS bundles by content hash, so the running server 404’d files that existed on disk — no JS ran, so nothing surfaced an error.',
    ),
    fix: L(
      'Đổi tệp tĩnh thì phải khởi động lại server, và diệt tiến trình THEO CỔNG (Node đổi tên tiến trình nên diệt theo tên là trượt). Production không dính vì mỗi deploy là một container mới.',
      'Changing static files means restarting the server, and killing it BY PORT (Node renames its process, so killing by name misses). Production was never affected — each deploy is a fresh container.',
    ),
  },
  {
    accent: '#f87171',
    symptom: L(
      '“Sập database, chỉ còn frontend sống.” Nhưng Postgres và backend đều báo healthy, và người dùng khác vẫn vào bình thường.',
      '“The database is down, only the frontend works.” Yet Postgres and the backend both reported healthy, and other users were fine.',
    ),
    cause: L(
      'Không phải sập — là giới hạn tần suất theo IP. Một trang thi bắn 18.297 request trong 10 phút (~32 mỗi giây), mỗi lần tải lên lại toàn bộ file ghi âm. Gốc là một vòng lặp tự nuôi: hết giờ thì effect tự nộp bài; nộp hỏng thì khối catch BUỘC phải gỡ cờ “đã nộp” để nút bấm tay còn dùng được; gỡ xong thì effect lại thấy đúng điều kiện cũ và nộp tiếp — nhanh hết mức đường truyền cho phép. Cái khoá tự mở ra ngay tại điều kiện đã kích hoạt nó.',
      'Not an outage — a per-IP rate limit. One exam page fired 18,297 requests in 10 minutes (~32/s), re-uploading the whole audio recording each time. The root cause was a self-feeding loop: on timeout an effect auto-submits; when the submit fails the catch block MUST clear the “submitted” flag so the manual button still works; once cleared, the effect sees the same condition again and re-submits — as fast as the network allows. The latch released itself at exactly the condition that had tripped it.',
    ),
    fix: L(
      'Một cờ RIÊNG “đã thử tự nộp” không bao giờ được gỡ, tách khỏi cờ của đường bấm tay. Luật rút ra: mọi effect tự hành động dựa trên điều kiện KHÔNG tự biến mất (hết giờ, lỗi mạng, cờ trạng thái) phải có cờ “đã thử” riêng. Truy thủ phạm bằng cách quét khoá rate-limit trong Redis xem cạn quota là một IP hay toàn cục, rồi đếm endpoint trong log nginx của đúng IP đó.',
      'A separate “already attempted” flag that is never cleared, split from the manual path’s flag. The rule: any effect that acts on a condition which does NOT clear itself (a timeout, a network error, a status flag) needs its own attempt latch. Trace it by scanning the Redis rate-limit keys to see whether one IP or the whole bucket is drained, then counting endpoints in that IP’s nginx log lines.',
    ),
  },
  {
    accent: '#fb923c',
    symptom: L(
      'Giới hạn tần suất trông như đang chạy, nhưng một client cố ý có thể gọi API không giới hạn.',
      'Rate limiting looked like it was working, yet a deliberate client could call the API without limit.',
    ),
    cause: L(
      'Hàm sinh khoá lấy phần tử ĐẦU của header X-Forwarded-For. Phần tử đầu là do client gửi lên, nên chỉ cần đổi header mỗi lần gọi là mỗi lần lại được một xô đếm mới — đã chứng minh bằng curl. Trang này cũng không nằm sau Cloudflare, nên tin vào CF-Connecting-IP còn tệ hơn: header đó ai cũng đặt được.',
      'The key generator read the FIRST entry of the X-Forwarded-For header. That entry is client-supplied, so changing it on each call yields a fresh counter bucket every time — proven with curl. The site also does not sit behind Cloudflare, so trusting CF-Connecting-IP would be worse still: anyone can set that header.',
    ),
    fix: L(
      'Đổi sang phần tử CUỐI của X-Forwarded-For — phần tử do chính nginx nối thêm, client không chạm tới được — cho cả bộ giới hạn chung lẫn bộ giới hạn đăng nhập. Kiểm hồi quy bằng curl kèm header giả: sau khi vá thì vẫn phải rơi vào CÙNG một xô; nhận xô mới nghĩa là lỗ hổng quay lại.',
      'Switch to the LAST X-Forwarded-For entry — the one nginx appends itself, which the client cannot touch — for both the general and the auth limiter. Regression check: curl with a forged header must still land in the SAME bucket after the fix; a fresh bucket means the hole is back.',
    ),
  },
  {
    accent: '#facc15',
    symptom: L(
      'Deploy hỏng với “no space left on device”, và mọi endpoint chạm cơ sở dữ liệu trả 500 — trong khi trang chủ vẫn 200 nên nhìn qua tưởng site khoẻ.',
      'A deploy failed with “no space left on device”, and every database-backed endpoint returned 500 — while the home page still returned 200, so at a glance the site looked fine.',
    ),
    cause: L(
      'Đĩa đầy 100%. Postgres không ghi nổi nhật ký ghi-trước nên kẹt trong trạng thái phục hồi: “database system is not yet accepting connections”. Chỗ chiếm đĩa cũng không nằm ở nơi ai cũng nhìn — máy này dùng containerd-snapshotter, nên image thật nằm ở /var/lib/containerd còn /var/lib/docker trông bé tí và đánh lừa.',
      'The disk hit 100%. Postgres could not write its write-ahead log and got stuck in recovery: “database system is not yet accepting connections”. The space was not where you would look either — this host uses the containerd snapshotter, so the real images live under /var/lib/containerd while /var/lib/docker looks deceptively small.',
    ),
    fix: L(
      'Thu hồi bằng chính docker (KHÔNG xoá tay trong containerd, và KHÔNG kèm --volumes vì đó là dữ liệu Postgres), khởi động lại Postgres là nó phục hồi xong trong dưới một phút. Về lâu dài: dọn bộ nhớ đệm dựng ảnh sau mỗi lần deploy, cộng một tác vụ định kỳ hàng tuần thu hồi đĩa. Bài học chẩn đoán: trang tĩnh trả 200 KHÔNG chứng minh được gì — phải gọi một endpoint có chạm cơ sở dữ liệu.',
      'Reclaim through docker itself (never hand-delete inside containerd, and never pass --volumes — that is the Postgres data), then restart Postgres and it finishes recovery in under a minute. Long term: prune the build cache after every deploy, plus a weekly job that reclaims disk. The diagnostic lesson: a static page returning 200 proves nothing — call an endpoint that actually touches the database.',
    ),
  },
  {
    accent: '#38bdf8',
    symptom: L(
      'Deploy dừng ở P3009: “migration failed to apply”. Không migration nào chạy được nữa, kể cả cái hoàn toàn mới và vô hại.',
      'The deploy stopped at P3009: “migration failed to apply”. No migration could run any more, not even a genuinely new and harmless one.',
    ),
    cause: L(
      'Cơ sở dữ liệu đã lệch khỏi lịch sử migration: sáu migration cũ đã áp cấu trúc bảng vào production nhưng KHÔNG được ghi nhận trong bảng lịch sử — có dòng bỏ dở giữa chừng, có dòng chưa từng được chèn. Prisma thấy lịch sử dở dang nên chặn hết, đúng như nó nên làm.',
      'The database had drifted from the migration history: six older migrations had their DDL applied to production but were NOT recorded in the history table — some rows left half-finished, some never inserted at all. Prisma saw a broken history and blocked everything, exactly as it should.',
    ),
    fix: L(
      'Với TỪNG migration, mở psql xác nhận bảng và cột nó tạo ra đã thực sự tồn tại, rồi mới đánh dấu là đã áp; sau đó chạy tiếp migration mới. Đánh dấu nhầm một migration còn thiếu sẽ bỏ qua luôn phần cấu trúc cần thiết và làm hỏng dữ liệu trong im lặng — nên từ đó thành quy tắc: migration hỏng thì DỪNG và báo cáo, không bao giờ tự chữa, và tuyệt đối không vá bằng mấy mẹo ép cho chạy qua.',
      'For EACH migration, confirm in psql that the tables and columns it creates really exist, and only then mark it applied; after that the genuinely new migration runs. Wrongly marking a truly-missing migration skips the DDL you needed and corrupts data silently — which is why the rule is now: a failed migration stops and reports, never auto-resolves, and never gets patched with tricks that force it through.',
    ),
  },
];

/**
 * The real products a skill is used in — keys match `BUILT[].id` in
 * `aboutProducts.ts`, so the "used in" chips deep-link to the real thing and can
 * never drift from the product list.
 */
export type ProductKey = 'ctwork' | 'cuongmini' | 'site' | 'desktop' | 'ios' | 'labflow';

/** The eight skill groups, each coloured by its TECH_STACK accent. */
export type SkillCategoryId =
  | 'backend' | 'frontend' | 'data' | 'infra' | 'ai' | 'realtime' | 'app' | 'creative';

export const SKILL_CATEGORIES: { id: SkillCategoryId; label: Bi; accent: string }[] = [
  { id: 'backend', label: L('Backend', 'Backend'), accent: '#6366f1' },
  { id: 'frontend', label: L('Frontend', 'Frontend'), accent: '#8b5cf6' },
  { id: 'data', label: L('Dữ liệu', 'Data'), accent: '#d946ef' },
  { id: 'infra', label: L('Hạ tầng & DevOps', 'Infra & DevOps'), accent: '#22d3ee' },
  { id: 'ai', label: L('AI', 'AI'), accent: '#34d399' },
  { id: 'realtime', label: L('Thời gian thực', 'Real-time'), accent: '#fbbf24' },
  { id: 'app', label: L('Mobile & Desktop', 'Mobile & Desktop'), accent: '#f472b6' },
  { id: 'creative', label: L('3D & Thiết kế', '3D & Design'), accent: '#a78bfa' },
];

/**
 * Self-assessment by the site owner — NOT a measurement, shown labelled as such.
 * `know` is what he can actually do in that skill; `usedIn` is the real products
 * that use it. Levels are honest and deliberately modest where he is still a
 * learner (Golang, SQL Server, Three.js, Figma).
 */
export interface SelfSkill {
  name: string;
  level: number;
  category: SkillCategoryId;
  know: Bi;
  usedIn: ProductKey[];
}

export const SELF_ASSESSED_SKILLS: SelfSkill[] = [
  // ── Backend ──────────────────────────────────────────────────────────────
  {
    name: 'Java', level: 95, category: 'backend', usedIn: ['labflow'],
    know: L(
      'Ngôn ngữ mình vững nhất: OOP, generics, collections, đa luồng — nền cho Spring Boot.',
      'My strongest language: OOP, generics, collections, concurrency — the base under Spring Boot.',
    ),
  },
  {
    name: 'Spring Boot', level: 90, category: 'backend', usedIn: ['labflow'],
    know: L(
      'REST API, JPA/Hibernate, Spring Security, phân lớp controller–service–repository gọn gàng.',
      'REST APIs, JPA/Hibernate, Spring Security, and a clean controller–service–repository split.',
    ),
  },
  {
    name: 'Node.js', level: 72, category: 'backend', usedIn: ['site', 'ctwork', 'cuongmini'],
    know: L(
      'Express, middleware, xác thực JWT, job nền theo lịch — chạy toàn bộ API của trang này.',
      'Express, middleware, JWT auth, scheduled background jobs — it runs this whole site’s API.',
    ),
  },
  {
    name: 'Golang', level: 60, category: 'backend', usedIn: [],
    know: L(
      'Đang học: goroutine, channel, viết API nhỏ và công cụ dòng lệnh.',
      'Learning it: goroutines, channels, small APIs and command-line tools.',
    ),
  },
  // ── Frontend ─────────────────────────────────────────────────────────────
  {
    name: 'TypeScript', level: 80, category: 'frontend', usedIn: ['site', 'ctwork', 'desktop', 'cuongmini'],
    know: L(
      'Kiểu chặt từ API xuống tới UI, dùng chung giữa backend và frontend.',
      'Types all the way from the API down to the UI, shared between backend and frontend.',
    ),
  },
  {
    name: 'JavaScript', level: 85, category: 'frontend', usedIn: ['site', 'ctwork'],
    know: L(
      'ES hiện đại, bất đồng bộ, DOM — nền tảng trước khi lên TypeScript.',
      'Modern ES, async, the DOM — the ground under the TypeScript.',
    ),
  },
  {
    name: 'React', level: 85, category: 'frontend', usedIn: ['site', 'ctwork', 'desktop'],
    know: L(
      'Hook, state, component tái dùng; Zustand và TanStack Query cho dữ liệu.',
      'Hooks, state, reusable components; Zustand and TanStack Query for data.',
    ),
  },
  {
    name: 'Next.js', level: 80, category: 'frontend', usedIn: ['site', 'ctwork'],
    know: L(
      'App Router, server/client component, SSR và route API — chính trang web này.',
      'App Router, server/client components, SSR and API routes — this very site.',
    ),
  },
  // ── Data ─────────────────────────────────────────────────────────────────
  {
    name: 'PostgreSQL', level: 85, category: 'data', usedIn: ['site', 'ctwork', 'labflow'],
    know: L(
      'Thiết kế lược đồ, chỉ mục, truy vấn, migration có phiên bản; pgvector cho tìm theo ngữ nghĩa.',
      'Schema design, indexes, queries, versioned migrations; pgvector for semantic search.',
    ),
  },
  {
    name: 'Prisma', level: 85, category: 'data', usedIn: ['site', 'ctwork'],
    know: L(
      'ORM chính: mô hình quan hệ, quan hệ ngược, migration, truy vấn an toàn kiểu.',
      'My main ORM: relational models, back-relations, migrations, type-safe queries.',
    ),
  },
  {
    name: 'Redis', level: 75, category: 'data', usedIn: ['site', 'ctwork'],
    know: L(
      'Cache, giới hạn tần suất, adapter cho Socket.IO, hàng đợi nhẹ.',
      'Caching, rate limiting, the Socket.IO adapter, light queues.',
    ),
  },
  {
    name: 'SQL Server', level: 62, category: 'data', usedIn: [],
    know: L(
      'Học ở trường (DBI202): T-SQL, truy vấn và nối bảng; PostgreSQL mới là thứ mình dùng hằng ngày.',
      'From coursework (DBI202): T-SQL, queries and joins; PostgreSQL is my day-to-day.',
    ),
  },
  // ── Infra & DevOps ─────────────────────────────────────────────────────────
  {
    name: 'VPS', level: 90, category: 'infra', usedIn: ['site'],
    know: L(
      'Tự quản máy chủ: người dùng, cổng, tường lửa, chứng chỉ TLS, giám sát đĩa và bộ nhớ.',
      'I run my own server: users, ports, firewall, TLS certs, disk and memory monitoring.',
    ),
  },
  {
    name: 'Linux', level: 88, category: 'infra', usedIn: ['site'],
    know: L(
      'Dòng lệnh, systemd, quyền, log, SSH — môi trường mình làm việc hằng ngày.',
      'Shell, systemd, permissions, logs, SSH — where I work every day.',
    ),
  },
  {
    name: 'Docker', level: 80, category: 'infra', usedIn: ['site', 'ctwork'],
    know: L(
      'Multi-stage build, compose, ảnh gọn, kiểm libc↔engine Prisma trước khi đẩy.',
      'Multi-stage builds, compose, slim images, libc↔engine checks before shipping.',
    ),
  },
  {
    name: 'Nginx', level: 75, category: 'infra', usedIn: ['site'],
    know: L(
      'Reverse proxy, TLS, HTTP/2, header cache, giới hạn tần suất theo IP.',
      'Reverse proxy, TLS, HTTP/2, cache headers, per-IP rate limiting.',
    ),
  },
  {
    name: 'GitHub Actions', level: 78, category: 'infra', usedIn: ['site', 'ctwork', 'desktop'],
    know: L(
      'CI kiểm kiểu và lint, dựng ảnh Docker, phát hành app desktop tự động.',
      'CI type and lint checks, Docker image builds, automated desktop-app releases.',
    ),
  },
  {
    name: 'AWS', level: 65, category: 'infra', usedIn: [],
    know: L(
      'S3 (dùng qua API tương thích của Cloudflare R2), IAM, EC2 ở mức cơ bản.',
      'S3 (via Cloudflare R2’s compatible API), IAM, basic EC2.',
    ),
  },
  // ── AI ───────────────────────────────────────────────────────────────────
  {
    name: 'LLM integration', level: 78, category: 'ai', usedIn: ['site', 'cuongmini', 'ctwork'],
    know: L(
      'Nhiều nhà cung cấp sau một cổng: gọi tool, stream, cầu dao, trần chi phí theo ngày.',
      'Many providers behind one gateway: tool calls, streaming, circuit breakers, daily cost caps.',
    ),
  },
  {
    name: 'RAG + embeddings', level: 68, category: 'ai', usedIn: ['site', 'cuongmini'],
    know: L(
      'pgvector, Transformers.js, tìm theo ngữ nghĩa; chặn prompt injection và cổng lọc dữ liệu cá nhân.',
      'pgvector, Transformers.js, semantic search; prompt-injection screening and a PII gate.',
    ),
  },
  // ── Real-time ──────────────────────────────────────────────────────────────
  {
    name: 'Socket.IO / WebSocket', level: 70, category: 'realtime', usedIn: ['ctwork', 'site'],
    know: L(
      'Chat và cập nhật trực tiếp, phòng, adapter Redis; WebSocket thuần cho thiết bị phần cứng.',
      'Live chat and updates, rooms, a Redis adapter; raw WebSocket for hardware devices.',
    ),
  },
  // ── Mobile & Desktop ─────────────────────────────────────────────────────────
  {
    name: 'SwiftUI / iOS', level: 62, category: 'app', usedIn: ['ctwork', 'ios'],
    know: L(
      'App CT Work native cho iPhone và iPad đã lên App Store: SwiftUI, đồng bộ trực tiếp với web.',
      'The native CT Work iPhone & iPad app is on the App Store: SwiftUI, live-synced with the web.',
    ),
  },
  {
    name: 'Electron', level: 72, category: 'app', usedIn: ['desktop', 'ctwork'],
    know: L(
      'App máy tính cho macOS, Windows và Linux, tự cập nhật từ bản phát hành công khai trên GitHub.',
      'Desktop apps for macOS, Windows and Linux, auto-updating from public GitHub releases.',
    ),
  },
  // ── 3D & Design ────────────────────────────────────────────────────────────
  {
    name: 'Three.js / WebGL', level: 45, category: 'creative', usedIn: ['site'],
    know: L(
      'Đang học: cảnh 3D, nạp tài nguyên, sân chơi 3D trên trang.',
      'Learning it: 3D scenes, asset loading, the 3D playground on the site.',
    ),
  },
  {
    name: 'Figma', level: 55, category: 'creative', usedIn: [],
    know: L(
      'Dựng mẫu giao diện và luồng màn hình trước khi viết code.',
      'Wireframing the UI and screen flows before I write the code.',
    ),
  },
];

/**
 * "How it all runs" — the real system as tiers, top (what people use) to bottom
 * (data & AI), all on one Docker-managed VPS. Product nodes deep-link to the real
 * thing; infra nodes are not links (they have no public page). Accents reuse the
 * TECH_STACK / nav palette. Used by `SystemMap`.
 */
export interface MapNode {
  id: string;
  label: Txt;
  sub: Bi;
  accent: string;
  /** A real internal destination; omit for infra with no public page. */
  href?: string;
}
export interface MapTier {
  id: string;
  label: Bi;
  nodes: MapNode[];
}

export const SYSTEM_MAP: MapTier[] = [
  {
    id: 'products',
    label: L('Thứ mọi người dùng', 'What people use'),
    nodes: [
      { id: 'ctwork', label: 'CT Work', sub: L('Web · máy tính · iOS', 'Web · desktop · iOS'), accent: '#6366f1', href: '/work' },
      { id: 'cuongmini', label: 'CuongMini', sub: L('Trợ lý AI', 'AI assistant'), accent: '#34d399', href: '/chat' },
      { id: 'site', label: 'cuongthai.com', sub: L('Nền tảng học', 'Learning platform'), accent: '#8b5cf6', href: '/' },
      { id: 'labflow', label: 'LabFlow AI', sub: L('Đồ án tốt nghiệp', 'Graduation project'), accent: '#f472b6', href: '/projects/labflow-ai' },
      { id: 'apps', label: L('App máy tính & iOS', 'Desktop & iOS apps'), sub: L('Electron · SwiftUI', 'Electron · SwiftUI'), accent: '#a78bfa', href: '/download' },
    ],
  },
  {
    id: 'edge',
    label: L('Lối vào', 'Edge'),
    nodes: [
      { id: 'nginx', label: 'Nginx', sub: L('Reverse proxy · TLS · HTTP/2', 'Reverse proxy · TLS · HTTP/2'), accent: '#22d3ee' },
    ],
  },
  {
    id: 'app',
    label: L('Ứng dụng', 'Application'),
    nodes: [
      { id: 'next', label: 'Next.js', sub: L('Frontend · SSR', 'Frontend · SSR'), accent: '#8b5cf6' },
      { id: 'node', label: L('Node + Express', 'Node + Express'), sub: L('API · xác thực · job nền', 'API · auth · background jobs'), accent: '#6366f1' },
    ],
  },
  {
    id: 'data',
    label: L('Dữ liệu & AI', 'Data & AI'),
    nodes: [
      { id: 'postgres', label: 'PostgreSQL', sub: L('Prisma · pgvector', 'Prisma · pgvector'), accent: '#d946ef' },
      { id: 'redis', label: 'Redis', sub: L('Cache · hàng đợi · real-time', 'Cache · queues · real-time'), accent: '#f43f5e' },
      { id: 'llm', label: L('Cổng LLM', 'LLM gateway'), sub: L('Nhiều nhà cung cấp', 'Many providers'), accent: '#34d399' },
      { id: 'r2', label: 'Cloudflare R2', sub: L('Lưu trữ media (S3)', 'Media storage (S3)'), accent: '#fbbf24' },
    ],
  },
];
