/**
 * 5.3 — Log trong Nest: Logger, log JSON, tham số có cấu trúc và pino (khoá nestjs, soạn 24/11/2026).
 * Output THẬT: container nst-run-* (Node 22, Nest 12.6.0, nestjs-pino 5.3.2, pino 10.4.0, pino-http 11.0.0, pino-pretty 13.2.0) —
 * scratchpad/nst/lab/c5/app/src/b53: log.ts (ConsoleLogger văn bản/json/flattenParams/redact, NEST_LOG_LEVEL, log injection bằng "\n"),
 * pino.ts (request id giữ/sinh, che header, log trong service tự mang req), do.ts (200.000 dòng: ConsoleLogger json ~550 ms, pino ~360 ms,
 * ~1,6×), bt.ts (forRootAsync + ConfigService; lỗi thật khi quên isGlobal). Đã đọc console-logger.service.d.ts bản 12 (structuredParams
 * mặc định bật, flattenParams, redact, NEST_LOG_LEVEL). Sự cố: Twitter 05/2018, Facebook 03/2019 (mật khẩu trong log nội bộ).
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'nodejs', bai: 'nodejs-15-1-log-co-cau-truc', title: 'Node.js 15.1 — Ba trụ cột, và điểm dừng của console.log', sub: 'Log, metric, trace — vì sao cần log có cấu trúc, nền chung cho mọi framework.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-1-4-dinh-dang', title: 'Log từ A đến Z 1.4 — Định dạng log', sub: 'Văn bản thường, syslog, JSON lines, logfmt — so sánh các định dạng.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-2-4-jq', title: 'Log từ A đến Z 2.4 — jq', sub: 'Lọc log JSON bằng jq: tìm mọi dòng của một request id.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'NestJS Docs — Logger', 'ConsoleLogger, json, mức log, logger riêng, bufferLogs.', 'https://docs.nestjs.com/techniques/logger'),
  nguon('📘', 'nestjs-pino (GitHub)', 'LoggerModule, pinoHttp, PinoLogger, request id qua AsyncLocalStorage.', 'https://github.com/iamolegga/nestjs-pino'),
  nguon('📘', 'pino — Redaction', 'Cú pháp đường dẫn redact và censor.', 'https://getpino.io/#/docs/redaction'),
  nguon('📰', 'TechCrunch — Twitter password bug (03/05/2018)', 'Lỗi ghi mật khẩu vào log nội bộ trước khi băm; Twitter khuyên mọi người đổi mật khẩu.', 'https://techcrunch.com/2018/05/03/twitter-password-bug/'),
  nguon('📰', 'KrebsOnSecurity — Facebook stored passwords in plain text (21/03/2019)', 'Hàng trăm triệu mật khẩu dạng chữ thường trong hệ thống nội bộ, nhân viên tìm được.', 'https://krebsonsecurity.com/2019/03/facebook-stored-hundreds-of-millions-of-user-passwords-in-plain-text-for-years/'),
  nguon('📘', 'OWASP — Logging Cheat Sheet', 'Không ghi gì, log injection, mã hoá ký tự xuống dòng.', 'https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html'),
].join('\n');
const MA_LOG = "// log.ts — Logger có sẵn của Nest 12 (ConsoleLogger). KICH chọn cấu hình; mỗi lần một tiến trình mới.\nimport { ConsoleLogger, Logger } from '@nestjs/common';\n\nconst KICH = process.env.KICH ?? 'text';\nconst tuyChon = {\n  text: {},\n  json: { json: true },\n  flat: { json: true, flattenParams: true },\n  redact: { json: true, redact: ['password', 'authorization', 'user.cccd'] },\n}[KICH]!;\nLogger.overrideLogger(new ConsoleLogger({ ...tuyChon, timestamp: false }));\n\nconst log = new Logger('Bookings');\nlog.log('Đã tạo lịch đặt', { bookingId: 42, roomId: 3 });                 // tham số có cấu trúc (structuredParams, mặc định bật ở Nest 12)\nlog.debug('Kiểm trùng xong', { ms: 3 });\nlog.warn('Phòng sắp kín', { roomId: 3, conLai: 1 });\nlog.error('Không gửi được email', new Error('SMTP timeout').stack, { bookingId: 42 });\nlog.log({ msg: 'đăng nhập', user: { id: 7, cccd: '001203004567' }, password: 'hunter2', headers: { authorization: 'Bearer eyJhbGc…' } });\nconst tenNhap = 'an\\n[Nest] 1  - LOG [Auth] admin đăng nhập thành công';  // người dùng gõ vào ô \"tên\"\nnew Logger('Auth').warn(`Đăng nhập sai cho tài khoản ${tenNhap}`);";
const OUT_LOG = "## KICH=text\n[Nest] LOG [Bookings] Đã tạo lịch đặt { bookingId: 42, roomId: 3 }\n[Nest] DEBUG [Bookings] Kiểm trùng xong { ms: 3 }\n[Nest] WARN [Bookings] Phòng sắp kín { roomId: 3, conLai: 1 }\n[Nest] ERROR [Bookings] Không gửi được email { bookingId: 42 }\nError: SMTP timeout\n[Nest] LOG [Bookings] Object(4) {\n  msg: 'đăng nhập',\n  user: {\n    id: 7,\n    cccd: '001203004567'\n  },\n  password: 'hunter2',\n  headers: {\n    authorization: 'Bearer eyJhbGc…'\n  }\n}\n[Nest] WARN [Auth] Đăng nhập sai cho tài khoản an\n[Nest] 1  - LOG [Auth] admin đăng nhập thành công\n\n## KICH=json\n{\"level\":\"log\",\"pid\":24,\"timestamp\":1795475333802,\"message\":\"Đã tạo lịch đặt\",\"context\":\"Bookings\",\"params\":{\"bookingId\":42,\"roomId\":3}}\n{\"level\":\"debug\",\"pid\":24,\"timestamp\":1795475333802,\"message\":\"Kiểm trùng xong\",\"context\":\"Bookings\",\"params\":{\"ms\":3}}\n{\"level\":\"warn\",\"pid\":24,\"timestamp\":1795475333803,\"message\":\"Phòng sắp kín\",\"context\":\"Bookings\",\"params\":{\"roomId\":3,\"conLai\":1}}\n{\"level\":\"error\",\"pid\":24,\"timestamp\":1795475333803,\"message\":\"Không gửi được email\",\"context\":\"Bookings\",\"stack\":\"Error: SMTP timeout\\n    at file:///app/c5/app/dist/b53/log.js:14:35\\n    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)\\n    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)\\n    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)\",\"params\":{\"bookingId\":42}}\n{\"level\":\"log\",\"pid\":24,\"timestamp\":1795475333803,\"message\":{\"msg\":\"đăng nhập\",\"user\":{\"id\":7,\"cccd\":\"001203004567\"},\"password\":\"hunter2\",\"headers\":{\"authorization\":\"Bearer eyJhbGc…\"}},\"context\":\"Bookings\"}\n{\"level\":\"warn\",\"pid\":24,\"timestamp\":1795475333803,\"message\":\"Đăng nhập sai cho tài khoản an\\n[Nest] 1  - LOG [Auth] admin đăng nhập thành công\",\"context\":\"Auth\"}\n\n## KICH=flat\n{\"level\":\"log\",\"pid\":32,\"timestamp\":1795475333934,\"message\":\"Đã tạo lịch đặt\",\"context\":\"Bookings\",\"bookingId\":42,\"roomId\":3}\n{\"level\":\"debug\",\"pid\":32,\"timestamp\":1795475333934,\"message\":\"Kiểm trùng xong\",\"context\":\"Bookings\",\"ms\":3}\n{\"level\":\"warn\",\"pid\":32,\"timestamp\":1795475333934,\"message\":\"Phòng sắp kín\",\"context\":\"Bookings\",\"roomId\":3,\"conLai\":1}\n{\"level\":\"error\",\"pid\":32,\"timestamp\":1795475333935,\"message\":\"Không gửi được email\",\"context\":\"Bookings\",\"stack\":\"Error: SMTP timeout\\n    at file:///app/c5/app/dist/b53/log.js:14:35\\n    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)\\n    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)\\n    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)\",\"bookingId\":42}\n{\"level\":\"log\",\"pid\":32,\"timestamp\":1795475333935,\"message\":{\"msg\":\"đăng nhập\",\"user\":{\"id\":7,\"cccd\":\"001203004567\"},\"password\":\"hunter2\",\"headers\":{\"authorization\":\"Bearer eyJhbGc…\"}},\"context\":\"Bookings\"}\n{\"level\":\"warn\",\"pid\":32,\"timestamp\":1795475333935,\"message\":\"Đăng nhập sai cho tài khoản an\\n[Nest] 1  - LOG [Auth] admin đăng nhập thành công\",\"context\":\"Auth\"}\n\n## KICH=redact\n{\"level\":\"log\",\"pid\":40,\"timestamp\":1795475334075,\"message\":\"Đã tạo lịch đặt\",\"context\":\"Bookings\",\"params\":{\"bookingId\":42,\"roomId\":3}}\n{\"level\":\"debug\",\"pid\":40,\"timestamp\":1795475334075,\"message\":\"Kiểm trùng xong\",\"context\":\"Bookings\",\"params\":{\"ms\":3}}\n{\"level\":\"warn\",\"pid\":40,\"timestamp\":1795475334076,\"message\":\"Phòng sắp kín\",\"context\":\"Bookings\",\"params\":{\"roomId\":3,\"conLai\":1}}\n{\"level\":\"error\",\"pid\":40,\"timestamp\":1795475334076,\"message\":\"Không gửi được email\",\"context\":\"Bookings\",\"stack\":\"Error: SMTP timeout\\n    at file:///app/c5/app/dist/b53/log.js:14:35\\n    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)\\n    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)\\n    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)\",\"params\":{\"bookingId\":42}}\n{\"level\":\"log\",\"pid\":40,\"timestamp\":1795475334076,\"message\":{\"msg\":\"đăng nhập\",\"user\":{\"id\":7,\"cccd\":\"[REDACTED]\"},\"password\":\"[REDACTED]\",\"headers\":{\"authorization\":\"[REDACTED]\"}},\"context\":\"Bookings\"}\n{\"level\":\"warn\",\"pid\":40,\"timestamp\":1795475334076,\"message\":\"Đăng nhập sai cho tài khoản an\\n[Nest] 1  - LOG [Auth] admin đăng nhập thành công\",\"context\":\"Auth\"}\n\n## NEST_LOG_LEVEL=warn (Nest 12 đọc biến này khi logLevels không đặt)\n[Nest] WARN [Bookings] Phòng sắp kín { roomId: 3, conLai: 1 }\n[Nest] ERROR [Bookings] Không gửi được email { bookingId: 42 }\nError: SMTP timeout\n[Nest] WARN [Auth] Đăng nhập sai cho tài khoản an\n[Nest] 1  - LOG [Auth] admin đăng nhập thành công";
const MA_PINO = "@Module({\n  imports: [LoggerModule.forRoot({\n    pinoHttp: {\n      level: process.env.LOG_LEVEL ?? 'info',\n      genReqId: (req, res) => {                                  // giữ id client gửi (nếu hợp lệ), không thì sinh mới\n        const h = req.headers['x-request-id'];\n        const id = typeof h === 'string' && /^[\\w-]{8,64}$/.test(h) ? h : randomUUID();\n        res.setHeader('x-request-id', id);\n        return id;\n      },\n      redact: { paths: ['req.headers.authorization', 'req.headers[\"x-api-key\"]', 'req.headers.cookie'], censor: '[che]' },\n      serializers: {                                              // chọn trường cho gọn bài; mặc định pino ghi đủ header + stack\n        req: (r) => ({ id: r.id, method: r.method, url: r.url,\n          headers: Object.fromEntries(['authorization', 'x-api-key', 'x-request-id'].filter((k) => k in r.headers).map((k) => [k, r.headers[k]])) }),\n        res: (r) => ({ statusCode: r.statusCode }),\n        err: (e) => ({ type: e.type, message: e.message }),\n      },\n      customProps: () => ({ service: 'lab-booking' }),\n      timestamp: () => ',\"time\":\"<thời điểm>\"',                 // cố định để output bài đọc được; thật thì bỏ dòng này\n      base: undefined,                                            // bỏ pid/hostname cho gọn bài\n    },\n  })],\n  controllers: [RoomsController], providers: [RoomsService],\n})\nclass AppModule {}\n\nconst app = await NestFactory.create(AppModule, { bufferLogs: true });   // giữ log khởi động tới khi có pino\napp.useLogger(app.get(PinoNestLogger));\nawait app.listen(3000);";
const MA_SVC = "@Injectable()\nclass RoomsService {\n  private readonly log = new Logger(RoomsService.name);       // vẫn dùng Logger của Nest — nestjs-pino đứng sau\n  find(id: number) {\n    this.log.log({ roomId: id }, 'tra phòng');                  // pino: object trước, chuỗi sau\n    if (id > 9) throw new Error(`phòng ${id} hỏng cảm biến`);\n    return { id, ten: `Lab ${id}` };\n  }\n}";
const OUT_PINO = "{\"level\":30,\"time\":\"<thời điểm>\",\"context\":\"NestFactory\",\"msg\":\"Starting Nest application...\"}\n{\"level\":30,\"time\":\"<thời điểm>\",\"context\":\"NestApplication\",\"msg\":\"Nest application successfully started\"}\n{\"level\":30,\"time\":\"<thời điểm>\",\"req\":{\"id\":\"fe-7f3a91c2\",\"method\":\"GET\",\"url\":\"/rooms/3\",\"headers\":{\"authorization\":\"[che]\",\"x-request-id\":\"fe-7f3a91c2\"}},\"service\":\"lab-booking\",\"context\":\"RoomsService\",\"roomId\":3,\"msg\":\"tra phòng\"}\n{\"level\":30,\"time\":\"<thời điểm>\",\"req\":{\"id\":\"fe-7f3a91c2\",\"method\":\"GET\",\"url\":\"/rooms/3\",\"headers\":{\"authorization\":\"[che]\",\"x-request-id\":\"fe-7f3a91c2\"}},\"service\":\"lab-booking\",\"res\":{\"statusCode\":200},\"responseTime\":4,\"msg\":\"request completed\"}\n# client: 200 x-request-id=fe-7f3a91c2\n{\"level\":30,\"time\":\"<thời điểm>\",\"req\":{\"id\":\"40be8ccc-a3d9-49cd-aa2b-2a3595964664\",\"method\":\"GET\",\"url\":\"/rooms/12\",\"headers\":{\"x-api-key\":\"[che]\"}},\"service\":\"lab-booking\",\"context\":\"RoomsService\",\"roomId\":12,\"msg\":\"tra phòng\"}\n{\"level\":50,\"time\":\"<thời điểm>\",\"req\":{\"id\":\"40be8ccc-a3d9-49cd-aa2b-2a3595964664\",\"method\":\"GET\",\"url\":\"/rooms/12\",\"headers\":{\"x-api-key\":\"[che]\"}},\"service\":\"lab-booking\",\"context\":\"ExceptionsHandler\",\"err\":{\"type\":\"Error\",\"message\":\"phòng 12 hỏng cảm biến\"},\"msg\":\"phòng 12 hỏng cảm biến\"}\n{\"level\":30,\"time\":\"<thời điểm>\",\"req\":{\"id\":\"40be8ccc-a3d9-49cd-aa2b-2a3595964664\",\"method\":\"GET\",\"url\":\"/rooms/12\",\"headers\":{\"x-api-key\":\"[che]\"}},\"service\":\"lab-booking\",\"res\":{\"statusCode\":500},\"err\":{\"type\":\"Error\",\"message\":\"failed with status code 500\"},\"responseTime\":1,\"msg\":\"request errored\"}\n# client: 500 x-request-id=40be8ccc-a3d9-49cd-aa2b-2a3595964664\n{\"level\":30,\"time\":\"<thời điểm>\",\"req\":{\"id\":\"d7f31537-594f-4f82-b922-ba4e2fb0f98e\",\"method\":\"GET\",\"url\":\"/rooms/3\",\"headers\":{\"x-request-id\":\"<script>alert(1)</script>\"}},\"service\":\"lab-booking\",\"context\":\"RoomsService\",\"roomId\":3,\"msg\":\"tra phòng\"}\n{\"level\":30,\"time\":\"<thời điểm>\",\"req\":{\"id\":\"d7f31537-594f-4f82-b922-ba4e2fb0f98e\",\"method\":\"GET\",\"url\":\"/rooms/3\",\"headers\":{\"x-request-id\":\"<script>alert(1)</script>\"}},\"service\":\"lab-booking\",\"res\":{\"statusCode\":200},\"responseTime\":0,\"msg\":\"request completed\"}\n# client: 200 x-request-id=d7f31537-594f-4f82-b922-ba4e2fb0f98e";
const OUT_DO = "lần 1: ConsoleLogger json 554 ms · pino 356 ms (1.6×)\nlần 2: ConsoleLogger json 551 ms · pino 354 ms (1.6×)\nlần 3: ConsoleLogger json 565 ms · pino 387 ms (1.5×)";
const MA_BT = "@Module({\n  imports: [\n    ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true, validationSchema: Env }),   // isGlobal: thiếu ⇒ LoggerModule không thấy ConfigService\n    LoggerModule.forRootAsync({\n      inject: [ConfigService],\n      useFactory: (c: ConfigService) => {\n        const dev = c.get('NODE_ENV') === 'development';\n        return { pinoHttp: {\n          level: c.get('LOG_LEVEL') ?? (dev ? 'debug' : 'info'),\n          base: undefined,\n          transport: dev ? { target: 'pino-pretty', options: { singleLine: true, colorize: false, translateTime: false, ignore: 'time' } } : undefined,\n          timestamp: dev ? undefined : () => ',\"time\":\"<thời điểm>\"',\n        } };\n      },\n    }),\n  ],\n  providers: [Job],\n})\nclass M {}";
const OUT_BT_LOI = "[Nest] ERROR [ExceptionHandler] UnknownDependenciesException [Error]: Nest can't resolve dependencies of the pino-params (?). Please make sure that the argument ConfigService at index [0] is available in the LoggerModule module.";
const OUT_BT = "$ NODE_ENV=development node dist/b53/bt.js\nDEBUG: chi tiết {\"context\":\"Job\"}\nINFO: chạy xong {\"context\":\"Job\"}\nWARN: chậm 2,3 s {\"context\":\"Job\"}\n$ NODE_ENV=production node dist/b53/bt.js\n{\"level\":30,\"time\":\"<thời điểm>\",\"context\":\"Job\",\"msg\":\"chạy xong\"}\n{\"level\":40,\"time\":\"<thời điểm>\",\"context\":\"Job\",\"msg\":\"chậm 2,3 s\"}\n$ NODE_ENV=production LOG_LEVEL=warn node dist/b53/bt.js\n{\"level\":40,\"time\":\"<thời điểm>\",\"context\":\"Job\",\"msg\":\"chậm 2,3 s\"}";
const MA_Q9 = "const body = { email: 'an@fpt.edu.vn', password: 'hunter2' };\nnew Logger('Auth').log(`login ${JSON.stringify(body)}`);\nnew Logger('Auth').log('login', body);";
const OUT_Q9 = "{\"level\":\"log\",\"pid\":16,\"timestamp\":1795476627173,\"message\":\"login {\\\"email\\\":\\\"an@fpt.edu.vn\\\",\\\"password\\\":\\\"hunter2\\\"}\",\"context\":\"Auth\"}\n{\"level\":\"log\",\"pid\":16,\"timestamp\":1795476627174,\"message\":\"login\",\"context\":\"Auth\",\"params\":{\"email\":\"an@fpt.edu.vn\",\"password\":\"[REDACTED]\"}}";

export default {
  title: '5.3 — Logging in Nest: Logger, JSON logs, structured params and pino|||5.3 — Log trong Nest: Logger, log JSON, tham số có cấu trúc và pino',
  slug: 'nst-5-3-logger',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Log là thứ duy nhất bạn có khi production hỏng lúc 2 giờ sáng. Chạy thật Logger của Nest 12: văn bản và JSON, tham số có cấu trúc, redact che password/authorization, NEST_LOG_LEVEL; log injection: tên người dùng chứa "\\n" giả được cả một dòng log ở chế độ văn bản, JSON thì không. nestjs-pino: một dòng mỗi request, request id giữ từ client hoặc tự sinh, log trong service tự mang id. Đo: pino nhanh ~1,6×. Sự cố Twitter 2018, Facebook 2019. Bài tập: log theo môi trường.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>5.3 — Logs you can search at 2 a.m.</h2>
<p class="lead">When production fails you cannot attach a debugger. You have logs — and only the logs you wrote before the failure. Good logs answer three questions fast: <em>what happened</em>, <em>to which request</em>, <em>with what data</em> — without containing passwords or tokens. This lesson starts with Nest's built-in <code>Logger</code> (much better in Nest 12 than its reputation), breaks it with a log injection, then moves to <code>nestjs-pino</code>, the de-facto choice in companies.</p>

<h3>Everyday analogy: the ship's logbook</h3>
<p>A ship's officer does not write "things went fine". Each entry has the time, position, event and who was on watch, in a fixed format, so an investigator can rebuild the voyage later. And nobody writes the safe's combination in the logbook, because many people read it. JSON logs are the fixed format; the request id is "who was on watch"; redaction keeps the combination out.</p>

<h3>Experiment 1 — Nest's ConsoleLogger in four configurations</h3>
<pre><code class="language-ts">${esc(MA_LOG)}</code></pre>
<div class="out">${esc(OUT_LOG)}</div>
<p>(The date/pid prefix of text mode is trimmed in the output to save space.)</p>

<h4>1. Text mode is for humans — and breaks for machines</h4>
<p>The object logged in text mode spans 11 lines, and the error stack adds one line per frame (trimmed above); a log collector that splits on newlines turns one event into many unrelated records. Still the right choice when you watch <code>npm run start:dev</code>.</p>
<h4>2. <code>json: true</code> — one event, one line</h4>
<p>Every call becomes a single JSON object with <code>level</code>, <code>pid</code>, <code>timestamp</code>, <code>context</code>. In Nest 12, plain objects passed after the message become <code>params</code> (<code>structuredParams</code>, on by default) instead of separate messages, so <code>log('Đã tạo lịch đặt', { bookingId: 42 })</code> is searchable as <code>params.bookingId = 42</code>. <code>flattenParams: true</code> puts them at the root (<code>"bookingId":42</code>), which most log tools index more easily.</p>
<h4>3. Passwords, tokens and national ID numbers in logs</h4>
<p>Without redaction the object was printed with <code>password: 'hunter2'</code>, the bearer token and the citizen ID (<code>cccd</code>). With <code>redact: ['password', 'authorization', 'user.cccd']</code> all three became <code>"[REDACTED]"</code>. Note what redaction does <em>not</em> cover (from the type definitions): string messages, error messages and stacks are printed as is. <code>log(\`login \${JSON.stringify(body)}\`)</code> leaks the password no matter what you configure. Pass data as objects, never interpolated — checked:</p>
<pre><code class="language-ts">${esc(MA_Q9)}</code></pre>
<div class="out">${esc(OUT_Q9)}</div>
<h4>4. Log injection</h4>
<p>The user typed a "name" containing a newline followed by a fake log line. In text mode the log shows two lines, the second one saying <code>admin đăng nhập thành công</code> — an attacker can plant entries that mislead the person investigating an incident (a real attacker would also forge the date prefix). In JSON mode the newline is escaped as <code>\\n</code> inside the <code>message</code> string: one record, impossible to confuse. OWASP's logging cheat sheet lists this as a reason to encode output.</p>
<h4>5. <code>NEST_LOG_LEVEL</code></h4>
<p>Nest 12 reads <code>NEST_LOG_LEVEL</code> (<code>warn</code>, <code>&gt;=debug</code>, <code>warn,error</code>) when <code>logLevels</code> is not set: only WARN and ERROR remained. Production usually runs at <code>info</code>; turning on <code>debug</code> for ten minutes is a configuration change, not a code change.</p>

<h3>Experiment 2 — nestjs-pino: request logs with an id</h3>
<pre><code class="language-ts">${esc(MA_PINO)}</code></pre>
<pre><code class="language-ts">${esc(MA_SVC)}</code></pre>
<div class="out">${esc(OUT_PINO)}</div>
<h4>What you got without writing a middleware</h4>
<ul>
<li><strong>One "request completed" line per request</strong> with method, URL, status and <code>responseTime</code> — pino-http writes it when the response finishes, and "request errored" for 5xx.</li>
<li><strong>The request id flows into the service log</strong>. <code>RoomsService</code> uses the normal Nest <code>Logger</code>, yet its line contains <code>req.id = fe-7f3a91c2</code>. nestjs-pino stores the request's child logger in <code>AsyncLocalStorage</code> for the duration of the request, so any log call inside it is tagged. Filter by that id and you see the whole story of one request.</li>
<li><strong>The client's id is kept if it is clean</strong> (<code>fe-7f3a91c2</code> from the frontend), replaced by a UUID if it is missing or dirty (<code>&lt;script&gt;…</code>), and returned in <code>x-request-id</code> — the support team asks the user for that value.</li>
<li><strong>Secrets in headers are censored</strong>: <code>authorization</code> and <code>x-api-key</code> show <code>[che]</code>.</li>
<li><strong><code>bufferLogs: true</code></strong> keeps Nest's startup lines until <code>app.useLogger(app.get(Logger))</code> runs, so even "Starting Nest application…" is JSON.</li>
</ul>
<p>For readability the serializers here keep only three headers and drop the error stack. The defaults log all headers and the full stack — keep the stack in real projects, it is the most useful field when something breaks.</p>

<h3>Experiment 3 — is pino really faster?</h3>
<div class="out">${esc(OUT_DO)}</div>
<p>200,000 JSON lines written synchronously to <code>/dev/null</code>, three runs after warm-up: pino about <strong>1.6×</strong> faster than <code>ConsoleLogger({ json: true })</code> — roughly 1.8 µs versus 2.8 µs per line. That is real but not dramatic; the stronger reasons to choose pino are the request integration, redaction paths, child loggers and transports. Do not choose a logger for a 1 µs difference; do avoid logging inside tight loops.</p>

<h3>🕵️ Real incidents — passwords in internal logs</h3>
<p><strong>Twitter, May 2018.</strong> Twitter announced that a bug wrote users' passwords to an internal log <em>before</em> the hashing step. It found the bug itself, deleted the logs, said it saw no misuse, and still asked all users (more than 330 million accounts at the time) to consider changing their passwords (TechCrunch, 03/05/2018). <strong>Facebook, March 2019.</strong> KrebsOnSecurity reported that hundreds of millions of passwords had been stored in plain text in internal systems for years, searchable by thousands of employees; Facebook confirmed the issue and said it found no abuse. Ireland's Data Protection Commission later fined Meta €91 million over it (September 2024). Both were logging bugs, not hacks — a log statement that included a request body. That is exactly what <code>redact</code> and "objects, not interpolated strings" prevent.</p>

<h3>🧪 Exercise (20 min) — logging per environment</h3>
<p>Configure nestjs-pino from <code>ConfigService</code>: development ⇒ <code>pino-pretty</code>, level <code>debug</code>; production ⇒ JSON, level <code>info</code>; <code>LOG_LEVEL</code> overrides both.</p>
<details><summary>Show solution</summary>
<p>First attempt, with <code>ConfigModule.forRoot</code> not global — a real error:</p>
<div class="out">${esc(OUT_BT_LOI)}</div>
<p><code>LoggerModule.forRootAsync</code> builds its options inside its own module, which does not import <code>ConfigModule</code> (Lesson 2.3: providers are visible only through imports). Fix with <code>isGlobal: true</code> or <code>imports: [ConfigModule]</code> in <code>forRootAsync</code>:</p>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p><code>pino-pretty</code> runs in a worker thread (a pino <em>transport</em>), so the main thread does not pay for formatting; the example waits 300 ms before closing so the worker can flush. In production, write JSON to stdout and let Docker or the platform ship it — no transport needed.</p>
</details>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>Why JSON logs in production?</strong> One event per line, fields searchable and aggregable; multi-line text breaks collectors and allows log injection.</li>
<li><strong>How do you trace one request across log lines?</strong> A request id: accept a clean incoming <code>x-request-id</code> or generate one, attach it to every log (AsyncLocalStorage in nestjs-pino), return it in the response.</li>
<li><strong>What must never be logged?</strong> Passwords, tokens, keys, full card numbers, national ID numbers; redact by path, and pass data as objects so redaction can work.</li>
<li><strong>Built-in Logger or pino?</strong> Nest 12's ConsoleLogger with <code>json</code> + <code>redact</code> is fine for small services; pino adds request logging, child loggers, transports and about 1.6× throughput.</li>
</ol>

<h3>💼 On the job</h3>
<p>Customer environments usually ship container stdout to ELK, Grafana Loki, Datadog or CloudWatch. Before go-live, the customer's SRE often asks for a "log format agreement": field names (<code>level</code>, <code>time</code>, <code>req.id</code>, <code>service</code>), levels, and a list of fields that are masked. Having <code>logger.config.ts</code> as one file makes that meeting short. When a bug report arrives with an <code>x-request-id</code>, the first command is a log search for that id — Log từ A đến Z 2.4 shows it with jq.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ConsoleLogger({ json })</span><span class="v">Nest's built-in logger printing one JSON object per call.</span></div>
  <div class="kv"><span class="k">structuredParams / flattenParams</span><span class="v">Nest 12: objects after the message become fields (under params, or at the root).</span></div>
  <div class="kv"><span class="k">redact</span><span class="v">Replace values at given keys/paths with a censor; does not touch string messages.</span></div>
  <div class="kv"><span class="k">Log injection</span><span class="v">User input containing newlines forges log records in text logs.</span></div>
  <div class="kv"><span class="k">Request id</span><span class="v">Identifier attached to every log of one request and returned to the client.</span></div>
  <div class="kv"><span class="k">bufferLogs</span><span class="v">Hold startup logs until the real logger is installed with app.useLogger.</span></div>
  <div class="kv"><span class="k">Transport (pino)</span><span class="v">Formatting/shipping in a worker thread, e.g. pino-pretty in development.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Text logs for your terminal, JSON logs for every shared environment.</li>
<li>Pass data as objects; configure <code>redact</code> for passwords, tokens and personal IDs.</li>
<li>Every request gets an id that is in every log line and in the response header.</li>
<li>nestjs-pino gives request logs, AsyncLocalStorage context and ~1.6× throughput for one module import.</li>
<li>Logger options come from <code>ConfigService</code> via <code>forRootAsync</code> — remember <code>isGlobal</code>.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>5.3 — Log tra được lúc 2 giờ sáng</h2>
<p class="lead">Khi production hỏng, bạn không gắn debugger được. Bạn chỉ có log — và chỉ những dòng log bạn đã viết từ trước khi hỏng. Log tốt trả lời nhanh ba câu: <em>chuyện gì xảy ra</em>, <em>ở request nào</em>, <em>với dữ liệu gì</em> — mà không chứa mật khẩu hay token. Bài này bắt đầu với <code>Logger</code> có sẵn của Nest (ở Nest 12 tốt hơn nhiều so với tiếng tăm của nó), phá nó bằng một vụ log injection, rồi chuyển sang <code>nestjs-pino</code> — lựa chọn gần như mặc định ở các công ty.</p>

<h3>Liên hệ đời thường: nhật ký hàng hải</h3>
<p>Sĩ quan trên tàu không ghi "mọi việc ổn". Mỗi dòng có giờ, vị trí, sự kiện và ai đang trực, theo một mẫu cố định, để người điều tra dựng lại cả chuyến đi sau này. Và không ai ghi mã két sắt vào nhật ký, vì nhiều người đọc nó. Log JSON là mẫu cố định; request id là "ai đang trực"; redact giữ mã két sắt ngoài nhật ký.</p>

<h3>Thí nghiệm 1 — ConsoleLogger của Nest với bốn cấu hình</h3>
<pre><code class="language-ts">${esc(MA_LOG)}</code></pre>
<div class="out">${esc(OUT_LOG)}</div>
<p>(Phần ngày giờ/pid đầu dòng ở chế độ văn bản đã được cắt trong output cho gọn.)</p>

<h4>1. Chế độ văn bản dành cho người — và hỏng với máy</h4>
<p>Object in ở chế độ văn bản chiếm 11 dòng, còn stack lỗi thêm mỗi khung một dòng (đã cắt ở trên); trình thu log tách theo dấu xuống dòng biến một sự kiện thành nhiều bản ghi rời rạc. Dù vậy đây vẫn là lựa chọn đúng khi bạn ngồi nhìn <code>npm run start:dev</code>.</p>
<h4>2. <code>json: true</code> — một sự kiện, một dòng</h4>
<p>Mỗi lần gọi thành đúng một object JSON có <code>level</code>, <code>pid</code>, <code>timestamp</code>, <code>context</code>. Ở Nest 12, object thường truyền sau thông điệp trở thành <code>params</code> (<code>structuredParams</code>, mặc định bật) thay vì thành các thông điệp riêng, nên <code>log('Đã tạo lịch đặt', { bookingId: 42 })</code> tìm được bằng <code>params.bookingId = 42</code>. <code>flattenParams: true</code> đưa chúng lên gốc (<code>"bookingId":42</code>), dạng mà đa số công cụ log đánh chỉ mục dễ hơn.</p>
<h4>3. Mật khẩu, token và số căn cước trong log</h4>
<p>Không redact, object được in ra với <code>password: 'hunter2'</code>, token bearer và số căn cước (<code>cccd</code>). Với <code>redact: ['password', 'authorization', 'user.cccd']</code> cả ba thành <code>"[REDACTED]"</code>. Để ý thứ redact <em>không</em> che (theo tệp định nghĩa kiểu): thông điệp dạng chuỗi, thông điệp lỗi và stack được in nguyên. <code>log(\`login \${JSON.stringify(body)}\`)</code> làm lộ mật khẩu dù bạn cấu hình gì đi nữa. Truyền dữ liệu dạng object, không bao giờ nhét vào chuỗi — đã thử:</p>
<pre><code class="language-ts">${esc(MA_Q9)}</code></pre>
<div class="out">${esc(OUT_Q9)}</div>
<h4>4. Log injection</h4>
<p>Người dùng gõ một "tên" có dấu xuống dòng, theo sau là một dòng log giả. Ở chế độ văn bản, log hiện hai dòng, dòng thứ hai nói <code>admin đăng nhập thành công</code> — kẻ tấn công cài được những dòng đánh lừa người điều tra sự cố (kẻ tấn công thật còn giả luôn phần ngày giờ đầu dòng). Ở chế độ JSON, dấu xuống dòng được mã hoá thành <code>\\n</code> bên trong chuỗi <code>message</code>: một bản ghi duy nhất, không thể nhầm. Bảng hướng dẫn logging của OWASP nêu đúng lý do này để mã hoá output.</p>
<h4>5. <code>NEST_LOG_LEVEL</code></h4>
<p>Nest 12 đọc <code>NEST_LOG_LEVEL</code> (<code>warn</code>, <code>&gt;=debug</code>, <code>warn,error</code>) khi không đặt <code>logLevels</code>: chỉ còn WARN và ERROR. Production thường chạy mức <code>info</code>; bật <code>debug</code> mười phút là đổi cấu hình, không phải sửa mã.</p>

<h3>Thí nghiệm 2 — nestjs-pino: log request kèm id</h3>
<pre><code class="language-ts">${esc(MA_PINO)}</code></pre>
<pre><code class="language-ts">${esc(MA_SVC)}</code></pre>
<div class="out">${esc(OUT_PINO)}</div>
<h4>Những gì bạn có mà không viết middleware nào</h4>
<ul>
<li><strong>Mỗi request một dòng "request completed"</strong> có phương thức, URL, mã trạng thái và <code>responseTime</code> — pino-http ghi khi phản hồi kết thúc, và "request errored" với lỗi 5xx.</li>
<li><strong>Request id chảy vào log của service</strong>. <code>RoomsService</code> dùng <code>Logger</code> bình thường của Nest, vậy mà dòng của nó có <code>req.id = fe-7f3a91c2</code>. nestjs-pino cất logger con của request vào <code>AsyncLocalStorage</code> suốt thời gian request, nên mọi lệnh log bên trong đều được gắn nhãn. Lọc theo id đó là thấy trọn câu chuyện của một request.</li>
<li><strong>Id của client được giữ nếu sạch</strong> (<code>fe-7f3a91c2</code> từ frontend), bị thay bằng UUID nếu thiếu hoặc bẩn (<code>&lt;script&gt;…</code>), và được trả lại ở <code>x-request-id</code> — đội hỗ trợ hỏi người dùng đúng giá trị đó.</li>
<li><strong>Bí mật trong header bị che</strong>: <code>authorization</code> và <code>x-api-key</code> hiện <code>[che]</code>.</li>
<li><strong><code>bufferLogs: true</code></strong> giữ các dòng khởi động của Nest tới khi <code>app.useLogger(app.get(Logger))</code> chạy, nên cả "Starting Nest application…" cũng là JSON.</li>
</ul>
<p>Để dễ đọc, serializer ở đây chỉ giữ ba header và bỏ stack lỗi. Mặc định pino ghi mọi header và đủ stack — ở dự án thật hãy giữ stack, đó là trường hữu ích nhất khi có sự cố.</p>

<h3>Thí nghiệm 3 — pino có thật sự nhanh hơn?</h3>
<div class="out">${esc(OUT_DO)}</div>
<p>200.000 dòng JSON ghi đồng bộ ra <code>/dev/null</code>, ba lần sau khi làm nóng: pino nhanh hơn <code>ConsoleLogger({ json: true })</code> khoảng <strong>1,6×</strong> — cỡ 1,8 µs so với 2,8 µs mỗi dòng. Có thật nhưng không ghê gớm; lý do mạnh hơn để chọn pino là tích hợp request, đường dẫn redact, logger con và transport. Đừng chọn logger vì chênh 1 µs; hãy tránh log trong vòng lặp nóng.</p>

<h3>🕵️ Sự cố thật — mật khẩu trong log nội bộ</h3>
<p><strong>Twitter, tháng 5/2018.</strong> Twitter thông báo một lỗi đã ghi mật khẩu người dùng vào log nội bộ <em>trước</em> bước băm. Họ tự phát hiện, xoá log, nói không thấy dấu hiệu lạm dụng, và vẫn khuyên toàn bộ người dùng (khi đó hơn 330 triệu tài khoản) cân nhắc đổi mật khẩu (TechCrunch, 03/05/2018). <strong>Facebook, tháng 3/2019.</strong> KrebsOnSecurity đưa tin hàng trăm triệu mật khẩu đã nằm dạng chữ thường trong hệ thống nội bộ suốt nhiều năm, hàng nghìn nhân viên tìm kiếm được; Facebook xác nhận và nói không thấy lạm dụng. Ủy ban Bảo vệ Dữ liệu Ireland sau đó phạt Meta 91 triệu euro vì việc này (tháng 9/2024). Cả hai đều là lỗi ghi log, không phải bị hack — một lệnh log có kèm thân request. Đó đúng là thứ <code>redact</code> và "object, không nhét vào chuỗi" ngăn được.</p>

<h3>🧪 Bài tập (20 phút) — log theo môi trường</h3>
<p>Cấu hình nestjs-pino từ <code>ConfigService</code>: development ⇒ <code>pino-pretty</code>, mức <code>debug</code>; production ⇒ JSON, mức <code>info</code>; <code>LOG_LEVEL</code> ghi đè cả hai.</p>
<details><summary>Xem lời giải</summary>
<p>Lần thử đầu, với <code>ConfigModule.forRoot</code> không global — lỗi thật:</p>
<div class="out">${esc(OUT_BT_LOI)}</div>
<p><code>LoggerModule.forRootAsync</code> dựng tuỳ chọn bên trong module riêng của nó, mà module đó không import <code>ConfigModule</code> (Bài 2.3: provider chỉ thấy được qua imports). Sửa bằng <code>isGlobal: true</code> hoặc <code>imports: [ConfigModule]</code> trong <code>forRootAsync</code>:</p>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p><code>pino-pretty</code> chạy trong worker thread (một <em>transport</em> của pino), nên luồng chính không tốn công định dạng; ví dụ chờ 300 ms trước khi đóng để worker ghi hết. Trên production, ghi JSON ra stdout và để Docker hoặc nền tảng chuyển đi — không cần transport.</p>
</details>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>Vì sao production dùng log JSON?</strong> Mỗi sự kiện một dòng, trường tìm được và gộp được; văn bản nhiều dòng làm hỏng trình thu log và cho phép log injection.</li>
<li><strong>Lần theo một request qua nhiều dòng log thế nào?</strong> Request id: nhận <code>x-request-id</code> sạch từ phía trước hoặc tự sinh, gắn vào mọi dòng log (AsyncLocalStorage trong nestjs-pino), trả lại trong phản hồi.</li>
<li><strong>Thứ gì không bao giờ được ghi log?</strong> Mật khẩu, token, khoá, số thẻ đầy đủ, số căn cước; redact theo đường dẫn, và truyền dữ liệu dạng object để redact hoạt động.</li>
<li><strong>Logger có sẵn hay pino?</strong> ConsoleLogger của Nest 12 với <code>json</code> + <code>redact</code> đủ cho dịch vụ nhỏ; pino thêm log request, logger con, transport và thông lượng khoảng 1,6×.</li>
</ol>

<h3>💼 Tình huống đi làm</h3>
<p>Môi trường của khách thường chuyển stdout của container sang ELK, Grafana Loki, Datadog hoặc CloudWatch. Trước khi go-live, SRE phía khách hay đòi một "thoả thuận định dạng log": tên trường (<code>level</code>, <code>time</code>, <code>req.id</code>, <code>service</code>), các mức, và danh sách trường bị che. Có sẵn <code>logger.config.ts</code> trong một tệp thì cuộc họp đó rất ngắn. Khi báo lỗi tới kèm <code>x-request-id</code>, lệnh đầu tiên là tìm log theo id đó — Log từ A đến Z 2.4 chỉ cách làm bằng jq.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ConsoleLogger({ json })</span><span class="v">Logger có sẵn của Nest, in một object JSON mỗi lần gọi.</span></div>
  <div class="kv"><span class="k">structuredParams / flattenParams</span><span class="v">Nest 12: object sau thông điệp thành trường (trong params, hoặc ở gốc).</span></div>
  <div class="kv"><span class="k">redact</span><span class="v">Thay giá trị ở khoá/đường dẫn chỉ định bằng chữ che; không đụng tới thông điệp dạng chuỗi.</span></div>
  <div class="kv"><span class="k">Log injection</span><span class="v">Dữ liệu người dùng có dấu xuống dòng giả được bản ghi trong log văn bản.</span></div>
  <div class="kv"><span class="k">Request id</span><span class="v">Mã gắn vào mọi dòng log của một request và trả lại cho client.</span></div>
  <div class="kv"><span class="k">bufferLogs</span><span class="v">Giữ log khởi động tới khi logger thật được cài bằng app.useLogger.</span></div>
  <div class="kv"><span class="k">Transport (pino)</span><span class="v">Định dạng/chuyển log trong worker thread, ví dụ pino-pretty khi phát triển.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Log văn bản cho terminal của bạn, log JSON cho mọi môi trường dùng chung.</li>
<li>Truyền dữ liệu dạng object; cấu hình <code>redact</code> cho mật khẩu, token và số định danh cá nhân.</li>
<li>Mỗi request có một id nằm trong mọi dòng log và trong header phản hồi.</li>
<li>nestjs-pino cho log request, ngữ cảnh AsyncLocalStorage và thông lượng ~1,6× chỉ với một lần import module.</li>
<li>Tuỳ chọn logger lấy từ <code>ConfigService</code> qua <code>forRootAsync</code> — nhớ <code>isGlobal</code>.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
