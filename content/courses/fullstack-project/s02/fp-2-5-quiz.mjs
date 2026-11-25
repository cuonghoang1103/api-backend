/**
 * 2.5 — Kiểm tra Chương 2 (soạn 24/11/2026, agent fsp). BÀI THÊM (không có trong khung), slug mới fp-2-5-quiz.
 * 10 câu; đáp án dựa trên output chạy thật của bài 2.1–2.4 (Express 5.3.0, Prisma 7.10.1, PostgreSQL 18.7, Node 22.22.2).
 * Phân bố đáp án: A2 B3 C3 D2.
 */
export default {
  title: '2.5 — Chapter 2 quiz|||2.5 — Kiểm tra Chương 2',
  slug: 'fp-2-5-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống: middleware lỗi 3 tham số, lỗi async ở Express 5, dist-tag latest của prisma, prisma init tự thêm tệp, env() làm hỏng generate, sửa migration đã chạy, CHECK viết tay, omit toàn cục, health check treo khi CSDL bị pause, log bằng close.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations taken from what actually happened while building ChiaSe's backend foundation. Read every explanation, including for the questions you got right.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can say which layer (route, controller, service) a given line of code belongs to.</li>
<li>I can explain every line of migration.sql that Prisma generated, and the one I wrote by hand.</li>
<li>I know which Prisma commands need a database and which do not.</li>
<li>I can make my health check fail in two different ways and explain both results.</li>
<li>My Checkpoint 2 passes on a clean clone with a new database.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống lấy từ chính những gì đã xảy ra khi dựng nền backend của ChiaSe. Đọc mọi phần giải thích, kể cả câu bạn làm đúng.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi nói được một dòng mã cho trước thuộc lớp nào (route, controller, service).</li>
<li>Tôi giải thích được từng dòng migration.sql Prisma sinh ra, và dòng tôi tự viết tay.</li>
<li>Tôi biết lệnh Prisma nào cần CSDL, lệnh nào không.</li>
<li>Tôi làm health check hỏng được theo hai cách khác nhau và giải thích được cả hai kết quả.</li>
<li>Checkpoint 2 của tôi đạt trên bản clone sạch với CSDL mới.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'A linter removed the unused `_next` parameter from `errorHandler(err, req, res, _next)`. A route then throws. What does the client get?|||Công cụ lint xoá tham số không dùng `_next` khỏi `errorHandler(err, req, res, _next)`. Sau đó một route ném lỗi. Client nhận được gì?',
        options: [
          'The same 500 JSON as before — Express matches handlers by name|||Vẫn 500 JSON như cũ — Express nhận handler theo tên',
          'A 404 JSON from notFound|||404 JSON từ notFound',
          'Express\'s default HTML error page with the stack trace and the file path on the server|||Trang lỗi HTML mặc định của Express, kèm stack trace và đường dẫn tệp trên máy chủ',
          'Nothing — the request hangs|||Không gì cả — request treo',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Express recognises error middleware only by having four parameters. With three it is skipped for errors, and the built-in handler answered with HTML including the stack and /home/…/chiase/apps/api/src/… — we reproduced it in 2.1. Keep the parameter, prefix it with _.|||VI: Express chỉ nhận ra middleware lỗi nhờ đủ bốn tham số. Ba tham số thì nó bị bỏ qua khi có lỗi, và handler có sẵn trả HTML kèm stack và /home/…/chiase/apps/api/src/… — đã tái hiện ở 2.1. Giữ tham số, thêm tiền tố _.',
      },
      {
        question: 'In Express 5, an `async` handler throws after an `await`, with no try/catch. What happens?|||Ở Express 5, một handler `async` ném lỗi sau một `await`, không có try/catch. Chuyện gì xảy ra?',
        options: [
          'The rejected promise is forwarded to the error middleware, which returns its 500 JSON|||Promise bị reject được chuyển tới middleware lỗi, nó trả 500 JSON',
          'The process crashes with an unhandled rejection|||Tiến trình sập vì unhandled rejection',
          'The request hangs until the client times out|||Request treo tới khi client hết giờ chờ',
          'Express retries the handler once|||Express chạy lại handler một lần',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Express 5 handles promises returned by handlers. Hanging (option C) is the Express 4 behaviour that made people wrap every handler in try/catch or use express-async-errors.|||VI: Express 5 xử lý promise mà handler trả về. Treo (phương án C) là hành vi của Express 4, lý do người ta bọc mọi handler bằng try/catch hoặc dùng express-async-errors.',
      },
      {
        question: 'You run `npm install -D prisma && npm install @prisma/client` without versions on 24/11/2026. What does `npm ls` show?|||Bạn chạy `npm install -D prisma && npm install @prisma/client` không ghi phiên bản vào ngày 24/11/2026. `npm ls` hiện gì?',
        options: [
          'Both 7.10.1|||Cả hai là 7.10.1',
          'prisma 8.0.0-rc.35 and @prisma/client 7.10.1 — different majors|||prisma 8.0.0-rc.35 và @prisma/client 7.10.1 — khác phiên bản lớn',
          'Both 8.0.0-rc.35|||Cả hai là 8.0.0-rc.35',
          'An ERESOLVE error|||Lỗi ERESOLVE',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: The dist-tag latest of prisma pointed to a release candidate while @prisma/client\'s latest was 7.10.1. npm did not complain. Pin all three packages to the same exact version with --save-exact.|||VI: Dist-tag latest của prisma trỏ vào bản thử nghiệm, còn latest của @prisma/client là 7.10.1. npm không hề kêu. Ghim cả ba gói cùng một phiên bản chính xác bằng --save-exact.',
      },
      {
        question: 'Your prisma.config.ts uses `url: env(\'DATABASE_URL\')`. The CI job runs `npm ci` (postinstall: prisma generate) with no DATABASE_URL. Result?|||prisma.config.ts của bạn dùng `url: env(\'DATABASE_URL\')`. Job CI chạy `npm ci` (postinstall: prisma generate) mà không có DATABASE_URL. Kết quả?',
        options: [
          'Works — generate does not read the config|||Chạy được — generate không đọc tệp cấu hình',
          'Works, but with a warning|||Chạy được, kèm một cảnh báo',
          'Generate connects to localhost:5432 by default|||Generate tự nối vào localhost:5432',
          'Fails: PrismaConfigEnvError: Cannot resolve environment variable: DATABASE_URL|||Hỏng: PrismaConfigEnvError: Cannot resolve environment variable: DATABASE_URL',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: env() throws while the config file loads, even for commands that never touch the database. We switched to process.env.DATABASE_URL; generate worked without it, while migrate deploy still failed clearly.|||VI: env() ném lỗi ngay lúc nạp tệp cấu hình, kể cả với lệnh không bao giờ chạm CSDL. Chúng tôi đổi sang process.env.DATABASE_URL; generate chạy được khi thiếu biến, còn migrate deploy vẫn báo lỗi rõ ràng.',
      },
      {
        question: 'You change VARCHAR(50) to VARCHAR(80) directly inside the already-applied init migration and run `prisma migrate dev`. What does Prisma do?|||Bạn sửa VARCHAR(50) thành VARCHAR(80) ngay trong migration init đã áp dụng rồi chạy `prisma migrate dev`. Prisma làm gì?',
        options: [
          'Applies the change silently|||Lặng lẽ áp dụng thay đổi',
          'Creates a new migration that alters the column|||Tạo migration mới đổi cột',
          'Reports the migration was modified after it was applied, detects drift, and says it needs to reset the schema|||Báo migration bị sửa sau khi đã áp dụng, phát hiện trôi dạt, và nói cần reset schema',
          'Ignores the file because it is old|||Bỏ qua tệp vì nó cũ',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Applied migrations are checksummed. Editing one means "reset = drop everything". Change the schema with a new migration instead — and never run dev tools against shared or production databases (GitLab 2017).|||VI: Migration đã áp dụng có checksum. Sửa nó nghĩa là "reset = xoá hết". Hãy đổi lược đồ bằng migration mới — và đừng bao giờ chạy công cụ dev vào CSDL dùng chung hay production (GitLab 2017).',
      },
      {
        question: 'Why did ChiaSe add `CHECK ("email" = lower("email"))` by hand in a `--create-only` migration?|||Vì sao ChiaSe tự viết `CHECK ("email" = lower("email"))` trong một migration `--create-only`?',
        options: [
          'Because Prisma removes CHECK constraints unless they are hand-written|||Vì Prisma xoá CHECK trừ khi viết tay',
          'Because schema.prisma cannot express CHECK constraints, and the database must refuse mixed-case emails even if a code path forgets to lowercase|||Vì schema.prisma không diễn tả được CHECK, và CSDL phải từ chối email lẫn chữ hoa kể cả khi một đường mã quên chuyển chữ thường',
          'Because PostgreSQL compares text case-insensitively by default|||Vì PostgreSQL mặc định so sánh chữ không phân biệt hoa thường',
          'To make findUnique faster|||Để findUnique nhanh hơn',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Before the fix, An@Mail.com and an@mail.com were both inserted. Prisma does not model CHECK, so it left ours alone ("Already in sync"). PostgreSQL text comparison is case-sensitive — that is the whole problem.|||VI: Trước khi sửa, An@Mail.com và an@mail.com đều được chèn. Prisma không mô hình hoá CHECK nên để yên CHECK của ta ("Already in sync"). So sánh chữ của PostgreSQL có phân biệt hoa thường — đó chính là vấn đề.',
      },
      {
        question: 'The client is created with `omit: { user: { passwordHash: true } }`. Which call returns the hash?|||Client được tạo với `omit: { user: { passwordHash: true } }`. Lời gọi nào trả về mã băm?',
        options: [
          'prisma.user.findUnique({ where: { email }, omit: { passwordHash: false } })|||prisma.user.findUnique({ where: { email }, omit: { passwordHash: false } })',
          'prisma.user.findUnique({ where: { email } })|||prisma.user.findUnique({ where: { email } })',
          'prisma.user.findMany()|||prisma.user.findMany()',
          'None — the field is deleted from the database|||Không lời gọi nào — trường bị xoá khỏi CSDL',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Global omit hides the field by default; only an explicit per-query omit: { passwordHash: false } brings it back — used only by the login service. The column still exists (Prisma Studio shows it).|||VI: Omit toàn cục giấu trường theo mặc định; chỉ khi truy vấn ghi rõ omit: { passwordHash: false } mới lấy lại — chỉ service đăng nhập dùng. Cột vẫn tồn tại (Prisma Studio vẫn hiện).',
      },
      {
        question: 'The pool has `connectionTimeoutMillis: 3000`. After `docker pause` on Postgres, the first health check version hung 30 s. Why didn\'t the 3 s timeout fire?|||Pool có `connectionTimeoutMillis: 3000`. Sau `docker pause` Postgres, health check bản đầu treo 30 giây. Vì sao thời hạn 3 giây không kích hoạt?',
        options: [
          'Docker ignores timeouts of paused containers|||Docker bỏ qua thời hạn của container bị pause',
          'The value is in seconds, not milliseconds|||Giá trị tính bằng giây, không phải mili giây',
          'Prisma 7 disables pg timeouts|||Prisma 7 tắt thời hạn của pg',
          'It only limits opening a NEW connection; the pool reused an open one and the query itself waited forever|||Nó chỉ giới hạn việc mở kết nối MỚI; pool dùng lại kết nối đang mở và chính truy vấn chờ mãi',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Connection timeout ≠ query timeout. The fix was a deadline around the check (Promise.race, 2 s): the paused DB now gives 503 after 2.009 s.|||VI: Thời hạn kết nối ≠ thời hạn truy vấn. Cách sửa là đặt hạn chót quanh phép kiểm (Promise.race, 2 giây): CSDL bị pause giờ cho 503 sau 2,009 giây.',
      },
      {
        question: 'The request logger listened to `res.on(\'finish\')`. A client gave up after 1 s while the DB was paused. What did the log show for that request?|||Logger request nghe `res.on(\'finish\')`. Một client bỏ đi sau 1 giây khi CSDL đang bị pause. Log ghi gì cho request đó?',
        options: [
          'A line with status 499|||Một dòng với mã 499',
          'Nothing at all — finish never fires when the response is not fully sent|||Không gì cả — finish không bao giờ bắn khi response không được gửi trọn',
          'A line with status 503|||Một dòng với mã 503',
          'A line with status 200|||Một dòng với mã 200',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Switching to \'close\' + res.writableFinished produced "GET /api/health CLIENT_BO_DI 1002.6ms". The abandoned slow requests are the ones you most need to see.|||VI: Đổi sang \'close\' + res.writableFinished cho ra "GET /api/health CLIENT_BO_DI 1002.6ms". Những request chậm bị bỏ dở là thứ bạn cần thấy nhất.',
      },
      {
        question: 'npm audit reports 3 high vulnerabilities via effect ← @prisma/config ← prisma and suggests `npm audit fix --force` ("Will install prisma@6.12.0"). Best action?|||npm audit báo 3 lỗ hổng high qua effect ← @prisma/config ← prisma và gợi ý `npm audit fix --force` ("Will install prisma@6.12.0"). Làm gì là tốt nhất?',
        options: [
          'Run it — security first|||Chạy luôn — bảo mật trên hết',
          'Ignore npm audit forever|||Bỏ qua npm audit mãi mãi',
          'Override effect to a patched version, run npm update effect, verify Prisma commands, document why|||Override effect lên bản đã vá, chạy npm update effect, kiểm lại các lệnh Prisma, ghi lý do',
          'Delete package-lock.json and reinstall|||Xoá package-lock.json rồi cài lại',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: --force would downgrade Prisma a whole major and break the project. A targeted override (effect 3.22.5) gave "found 0 vulnerabilities"; note that npm install alone kept 3.20.0 (ELSPROBLEMS) until npm update effect.|||VI: --force sẽ hạ Prisma cả một phiên bản lớn và làm hỏng dự án. Override đúng chỗ (effect 3.22.5) cho ra "found 0 vulnerabilities"; lưu ý chỉ npm install thì vẫn giữ 3.20.0 (ELSPROBLEMS) cho tới khi chạy npm update effect.',
      },
    ],
  },
};
