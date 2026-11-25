/**
 * 11.7 — Kiểm tra Chương 11 (khoá nestjs, soạn 24/11/2026). 10 câu; đáp án đối chiếu output chạy thật (scratchpad/nst/lab/c11/o):
 * câu 1 111-Dockerfile-migrate-cuoi, câu 2 111-npm-ls + 111-sau, câu 3 111-sigterm-debian, câu 4 112 (lập luận + 112-pg-chet),
 * câu 5 112-song-lo, câu 6 112-tat-D, câu 7 113-ci-thieu-generate, câu 8 114-cache-lo, câu 9 115-throttle-hai-ban, câu 10 114-nang-sau-node24 + 114-nang-node24-co.
 * Phân bố đáp án: A3 B2 C3 D2.
 */
export default {
  title: '11.7 — Chapter 11 quiz|||11.7 — Kiểm tra Chương 11',
  slug: 'nst-11-7-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống về Chương 11: target mặc định của docker build, devOptional và --omit, CMD dạng shell với SIGTERM, liveness có nên hỏi DB, attempt() của terminus làm lộ dữ liệu, đóng pool sai hook, CI thiếu prisma generate, CacheInterceptor toàn cục, throttler khi có hai bản, Nest 12 + Jest trên Node 24. Câu nào cũng đối chiếu output chạy thật.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations, each checked against real output from this chapter (Docker BuildKit, node:22 / node:22-alpine, Nest 12.6, @nestjs/terminus 12.2, @nestjs/throttler 6.8, @nestjs/cache-manager 12.0, Prisma 7.10, nginx 1.29, HAProxy 3.2, Jest 30.5).</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can write a four-stage Dockerfile for a Nest + Prisma project and explain every <code>--omit</code> flag.</li>
<li>I know who PID 1 is in my container and what happens on <code>docker stop</code>.</li>
<li>I can write liveness and readiness correctly and know the order of shutdown hooks.</li>
<li>I can read a red CI run and name the cause from the first error.</li>
<li>I know which "quick wins" (global cache, <code>audit fix --force</code>, adapter switch) are traps.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống, câu nào cũng đã đối chiếu với output chạy thật trong chương (Docker BuildKit, node:22 / node:22-alpine, Nest 12.6, @nestjs/terminus 12.2, @nestjs/throttler 6.8, @nestjs/cache-manager 12.0, Prisma 7.10, nginx 1.29, HAProxy 3.2, Jest 30.5).</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi viết được Dockerfile bốn tầng cho dự án Nest + Prisma và giải thích được từng cờ <code>--omit</code>.</li>
<li>Tôi biết ai là PID 1 trong container của mình và chuyện gì xảy ra khi <code>docker stop</code>.</li>
<li>Tôi viết đúng liveness và readiness, và biết thứ tự các hook lúc tắt.</li>
<li>Tôi đọc được một lượt CI đỏ và gọi tên nguyên nhân từ lỗi đầu tiên.</li>
<li>Tôi biết "mẹo nhanh" nào (cache toàn cục, <code>audit fix --force</code>, đổi adapter) là bẫy.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'A Dockerfile defines stages deps, build, prod-deps, runtime and then migrate (last). CI runs `docker build -t api .` and deploys the result. What is deployed?|||Một Dockerfile có các tầng deps, build, prod-deps, runtime rồi migrate (cuối cùng). CI chạy `docker build -t api .` và deploy kết quả. Thứ được deploy là gì?',
        options: [
          'The runtime stage — Docker always picks the stage named runtime|||Tầng runtime — Docker luôn chọn tầng tên runtime',
          'The first stage, deps|||Tầng đầu tiên, deps',
          'The migrate stage — without --target Docker builds the last stage (measured: a 1.01 GB image with devDependencies and the Prisma CLI)|||Tầng migrate — không có --target thì Docker dựng tầng cuối (đo được: ảnh 1,01 GB chứa devDependency và Prisma CLI)',
          'An error: a Dockerfile with several final stages needs --target|||Lỗi: Dockerfile có nhiều tầng cuối thì bắt buộc --target',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Lesson 11.1, trap 1. Keep runtime last or always pass --target runtime.|||VI: Bài 11.1, bẫy 1. Giữ runtime ở cuối hoặc luôn truyền --target runtime.',
      },
      {
        question: 'The runtime stage uses `npm ci --omit=dev`, yet `npm ls prisma` inside the image shows prisma and typescript under @prisma/client (464 MB of node_modules). Why, and what removes them?|||Tầng runtime dùng `npm ci --omit=dev`, vậy mà `npm ls prisma` trong ảnh vẫn thấy prisma và typescript dưới @prisma/client (node_modules 464 MB). Vì sao, và cái gì gỡ được chúng?',
        options: [
          'They are optional peers of @prisma/client and also devDependencies, so the lockfile marks them devOptional; npm drops them only with --omit=dev --omit=optional (measured: 192 MB)|||Chúng là peer tuỳ chọn của @prisma/client đồng thời là devDependency, nên lockfile ghi devOptional; npm chỉ bỏ khi --omit=dev --omit=optional (đo được: 192 MB)',
          'npm ci ignores --omit; use npm install --production|||npm ci bỏ qua --omit; dùng npm install --production',
          'They are required at runtime by the generated Prisma client|||Prisma client sinh ra cần chúng lúc chạy',
          '--omit=peer removes them (measured: 456 MB)|||--omit=peer gỡ được (đo được: 456 MB)',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lesson 11.1, trap 3: --omit=peer only went 464 → 456 MB; --omit=optional reached 192 MB and the app still runs (Prisma 7 + adapter-pg needs no CLI).|||VI: Bài 11.1, bẫy 3: --omit=peer chỉ giảm 464 → 456 MB; --omit=optional xuống 192 MB và ứng dụng vẫn chạy (Prisma 7 + adapter-pg không cần CLI).',
      },
      {
        question: 'Image node:22 (Debian), `CMD npm run start:prod` (shell form), main.ts calls enableShutdownHooks(). What does `docker stop` do?|||Ảnh node:22 (Debian), `CMD npm run start:prod` (dạng shell), main.ts có gọi enableShutdownHooks(). `docker stop` làm gì?',
        options: [
          'Stops in about 0.2 s with exit code 0 — enableShutdownHooks handles SIGTERM|||Dừng trong khoảng 0,2 giây với mã 0 — enableShutdownHooks xử lý SIGTERM',
          'Waits about 10 s and SIGKILLs (exit 137): /bin/sh is PID 1 and does not forward SIGTERM, so the hooks never run|||Chờ khoảng 10 giây rồi SIGKILL (mã 137): /bin/sh là PID 1 và không chuyển SIGTERM, nên hook không bao giờ chạy',
          'Stops immediately with exit 1 because npm reports an error|||Dừng ngay với mã 1 vì npm báo lỗi',
          'Same as on node:22-alpine|||Giống hệt trên node:22-alpine',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 11.1, section 5: 10.4 s, ExitCode 137 on Debian. On Alpine busybox sh execs the last command, so the same line looks fine — a trap when the base image changes. Exec form ["node","dist/main.js"]: 0.2 s, 0.|||VI: Bài 11.1, mục 5: 10,4 giây, ExitCode 137 trên Debian. Trên Alpine, sh của busybox exec luôn lệnh cuối nên cùng dòng đó trông ổn — bẫy khi đổi ảnh nền. Dạng exec ["node","dist/main.js"]: 0,2 giây, mã 0.',
      },
      {
        question: 'A teammate adds a database ping to /health/live "so Kubernetes knows when we are broken". PostgreSQL goes down for 5 minutes. What happens?|||Một bạn cùng nhóm thêm ping DB vào /health/live "để Kubernetes biết khi mình hỏng". PostgreSQL sập 5 phút. Chuyện gì xảy ra?',
        options: [
          'Nothing changes — liveness and readiness are treated the same|||Không có gì khác — liveness và readiness được xử lý như nhau',
          'Traffic is moved to healthy replicas — exactly what we want|||Request được chuyển sang các bản khoẻ — đúng điều ta muốn',
          'Only new deployments are blocked|||Chỉ các lần deploy mới bị chặn',
          'Every replica fails liveness and is restarted in a loop; restarts cannot fix the DB and add load. Dependencies belong in readiness only|||Mọi bản trượt liveness và bị khởi động lại liên tục; khởi động lại không chữa được DB và còn thêm tải. Phụ thuộc chỉ thuộc về readiness',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 11.2, section 1. All replicas share the same DB, so "move traffic to healthy replicas" is impossible — there are none.|||VI: Bài 11.2, mục 1. Mọi bản dùng chung một DB nên "chuyển sang bản khoẻ" là không thể — chẳng còn bản nào khoẻ.',
      },
      {
        question: 'With @nestjs/terminus 12.2 a readiness indicator is written `this.hi.check("db").attempt(() => this.pool.query("SELECT 1"))`. What does GET /health/ready return?|||Với @nestjs/terminus 12.2, một indicator readiness viết `this.hi.check("db").attempt(() => this.pool.query("SELECT 1"))`. GET /health/ready trả gì?',
        options: [
          'The whole pg result object (fields, parsers, type tables) inside details.db, plus a deprecation warning in the log — return nothing from attempt() or use withSuccessData()|||Nguyên object kết quả của pg (fields, parser, bảng kiểu) trong details.db, kèm cảnh báo deprecated trong log — đừng trả gì từ attempt() hoặc dùng withSuccessData()',
          '{ db: { status: "up" } } — terminus ignores the return value|||{ db: { status: "up" } } — terminus bỏ qua giá trị trả về',
          'A 500, because attempt() must return a boolean|||Lỗi 500, vì attempt() phải trả boolean',
          'Only the number of rows|||Chỉ số dòng trả về',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lesson 11.2, trap 1 (112-song-lo).|||VI: Bài 11.2, bẫy 1 (112-song-lo).',
      },
      {
        question: 'TerminusModule has gracefulShutdownTimeoutMs: 1500. A provider closes the pg pool in onModuleDestroy. During the 1.5 s after SIGTERM, requests that touch the DB get…|||TerminusModule đặt gracefulShutdownTimeoutMs: 1500. Một provider đóng pool pg ở onModuleDestroy. Trong 1,5 giây sau SIGTERM, request chạm DB nhận…',
        options: [
          'Normal 200 responses — the grace period runs before any hook|||200 bình thường — thời gian chờ chạy trước mọi hook',
          'ECONNREFUSED — the HTTP server is already closed|||ECONNREFUSED — server HTTP đã đóng',
          '500 "Cannot use a pool after calling end on the pool": onModuleDestroy runs before beforeApplicationShutdown (where terminus waits), so the app serves with a closed pool|||500 "Cannot use a pool after calling end on the pool": onModuleDestroy chạy trước beforeApplicationShutdown (nơi terminus chờ), nên ứng dụng phục vụ với pool đã đóng',
          '503 from every route, set by terminus|||503 ở mọi route, do terminus đặt',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Lesson 11.2, config D. Close pools in onApplicationShutdown, which runs after the HTTP server is closed.|||VI: Bài 11.2, cấu hình D. Đóng pool ở onApplicationShutdown, hook chạy sau khi server HTTP đã đóng.',
      },
      {
        question: 'CI on a fresh checkout fails at `npm run typecheck` with "Property \'booking\' does not exist on type \'PrismaService\'" and TS2307 for ./generated/prisma/client.js. Locally everything compiles. Most likely cause?|||CI trên bản checkout mới đỏ ở `npm run typecheck` với "Property \'booking\' does not exist on type \'PrismaService\'" và TS2307 cho ./generated/prisma/client.js. Ở máy thì biên dịch được hết. Nguyên nhân khả dĩ nhất?',
        options: [
          'TypeScript version differs between CI and the laptop|||Phiên bản TypeScript khác nhau giữa CI và laptop',
          'The job has no `prisma generate` step; src/generated is in .gitignore, so only the laptop has it|||Job không có bước `prisma generate`; src/generated nằm trong .gitignore nên chỉ laptop có',
          'PostgreSQL service is not healthy yet|||Service PostgreSQL chưa healthy',
          'oxlint changed the source files|||oxlint đã sửa tệp nguồn',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 11.3, red run #2. Typecheck does not touch the DB, so service health is irrelevant here.|||VI: Bài 11.3, lần đỏ thứ hai. Typecheck không chạm DB nên sức khoẻ service không liên quan.',
      },
      {
        question: 'To speed up the API someone registers CacheInterceptor as APP_INTERCEPTOR. GET /bookings/mine returns the caller\'s own bookings based on the Authorization header. What happens?|||Để API nhanh hơn, ai đó đăng ký CacheInterceptor làm APP_INTERCEPTOR. GET /bookings/mine trả lịch của chính người gọi dựa trên header Authorization. Chuyện gì xảy ra?',
        options: [
          'Nothing — CacheInterceptor skips requests with an Authorization header|||Không sao — CacheInterceptor tự bỏ qua request có header Authorization',
          'Only POST requests are cached, so GET is safe|||Chỉ POST được cache, nên GET an toàn',
          'Each replica caches separately, so at worst users see their own stale data|||Mỗi bản cache riêng, nên tệ nhất người dùng thấy dữ liệu cũ của chính mình',
          'The cache key is the URL, so the second user receives the first user\'s bookings (measured: binh got an\'s data). Cache public GETs only, or override trackBy|||Khoá cache là URL, nên người thứ hai nhận lịch của người đầu (đo được: binh nhận dữ liệu của an). Chỉ cache GET công khai, hoặc ghi đè trackBy',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 11.4, section 2 (114-cache-lo / 114-cache-sua).|||VI: Bài 11.4, mục 2 (114-cache-lo / 114-cache-sua).',
      },
      {
        question: 'lab-booking runs two API replicas behind nginx with ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]) and the default storage. One client hammers GET /rooms for a minute. How many requests pass?|||lab-booking chạy hai bản API sau nginx với ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]) và kho mặc định. Một client dội GET /rooms trong một phút. Bao nhiêu request lọt qua?',
        options: [
          '100 — the limit is per client, wherever the request lands|||100 — giới hạn theo client, request rơi vào đâu cũng vậy',
          '50 — the limit is split between replicas|||50 — giới hạn được chia cho các bản',
          'About 200 (measured 199): each process counts in its own memory. A shared store (Redis) makes it one limit|||Khoảng 200 (đo được 199): mỗi tiến trình đếm trong bộ nhớ riêng. Kho dùng chung (Redis) mới thành một giới hạn',
          'Unlimited — throttling does not work behind a proxy|||Không giới hạn — throttler không chạy sau proxy',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Lesson 11.5, finding 1; milestone 11.6 adds RedisThrottlerStorage and a test (request 101 ⇒ 429 on either replica).|||VI: Bài 11.5, phát hiện 1; mốc 11.6 thêm RedisThrottlerStorage và một test (request thứ 101 ⇒ 429 ở bản nào cũng vậy).',
      },
      {
        question: 'A Nest 11 CommonJS project with Jest is upgraded to Nest 12. On Node 22 Jest says "Must use import to load ES Module … Use Node v24.9+". On Node 24.22 it still fails the same way. What is missing?|||Một dự án Nest 11 CommonJS dùng Jest được nâng lên Nest 12. Trên Node 22, Jest báo "Must use import to load ES Module … Use Node v24.9+". Trên Node 24.22 vẫn hỏng y vậy. Còn thiếu gì?',
        options: [
          'NODE_OPTIONS=--experimental-vm-modules — Jest uses require(esm) only when vm.SourceTextModule exists, which needs that flag (measured: 4/4 green with it)|||NODE_OPTIONS=--experimental-vm-modules — Jest chỉ dùng require(esm) khi có vm.SourceTextModule, thứ cần cờ đó (đo được: có cờ thì 4/4 xanh)',
          'A transformIgnorePatterns entry for @nestjs|||Một mục transformIgnorePatterns cho @nestjs',
          'Node 26 — 24.22 is too old|||Node 26 — 24.22 vẫn quá cũ',
          'Changing "module" to "nodenext" in tsconfig|||Đổi "module" thành "nodenext" trong tsconfig',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lesson 11.4, section 4 (jest-runtime checks vm.SourceTextModule.prototype.hasAsyncGraph, Node 24.9+ behind --experimental-vm-modules). Node 22 with the flag still fails.|||VI: Bài 11.4, mục 4 (jest-runtime kiểm vm.SourceTextModule.prototype.hasAsyncGraph, có từ Node 24.9 sau cờ --experimental-vm-modules). Node 22 bật cờ vẫn hỏng.',
      },
    ],
  },
};
