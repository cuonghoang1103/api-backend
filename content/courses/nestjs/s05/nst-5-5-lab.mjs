/**
 * 5.5 — Lab: Một bản build, ba môi trường (khoá nestjs, soạn 24/11/2026).
 * Output THẬT: scratchpad/nst/lab/c5/lab55 (API thông báo nhỏ, Nest 12.6.0 + @nestjs/config 12.1.1 + nestjs-pino 5.3.2 + zod 4.6.7):
 * xem.sh trong container nst-run-* — nest build MỘT lần, chạy development (pino-pretty, debug, /docs 200), test (silent), production
 * (JSON, /docs 404, x-api-key bị che), production sai (3 lỗi một lần, thoát mã 1, lỗi khởi động in dạng văn bản của ConsoleLogger);
 * env.schema.spec.ts 6/6 xanh (Vitest 4.1.12 trên máy nhà).
 */
import { lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'docker', bai: 'dk-4-4-arg-env', title: 'Docker 4.4 — ARG và ENV: lúc dựng so với lúc chạy', sub: 'Chương 11 đóng gói đúng bản build này vào image và truyền biến bằng -e / --env-file.', cta: 'Mở bài →' }),
].join('\n');
const MA_SCHEMA = "// env.schema.ts — MỘT nơi khai mọi biến môi trường của ứng dụng (kiểu + luật + mặc định)\nimport { z } from 'zod';\n\nconst coDung = z.enum(['true', 'false']).transform((v) => v === 'true');\n\nexport const EnvSchema = z.object({\n  NODE_ENV: z.enum(['development', 'test', 'production']),\n  PORT: z.coerce.number().int().min(1).max(65535).default(3000),\n  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'silent']).default('info'),\n  API_KEYS: z.string().transform((s) => s.split(',').map((x) => x.trim()).filter(Boolean)).pipe(z.array(z.string().min(16)).min(1)),\n  SWAGGER: coDung.default(false),\n  CORS_ORIGINS: z.string().default('').transform((s) => s.split(',').map((x) => x.trim()).filter(Boolean)).pipe(z.array(z.url())),\n}).superRefine((e, ctx) => {                                          // luật GIỮA các biến: production chặt hơn\n  if (e.NODE_ENV === 'production' && e.SWAGGER) ctx.addIssue({ code: 'custom', path: ['SWAGGER'], message: 'không bật /docs ở production' });\n  if (e.NODE_ENV === 'production' && e.LOG_LEVEL === 'debug') ctx.addIssue({ code: 'custom', path: ['LOG_LEVEL'], message: 'debug ở production ghi quá nhiều (và dễ lộ dữ liệu)' });\n});\nexport type Env = z.infer<typeof EnvSchema>;";
const MA_CFG = "// config.module.ts — production chỉ đọc biến THẬT của tiến trình; dev/test đọc thêm tệp .env.<môi trường>\nimport { Module } from '@nestjs/common';\nimport { ConfigModule } from '@nestjs/config';\nimport { EnvSchema } from './env.schema.js';\n\nconst moiTruong = process.env.NODE_ENV ?? 'development';   // đọc ở đây là CHỦ Ý: chọn tệp trước khi nạp\n@Module({\n  imports: [ConfigModule.forRoot({\n    isGlobal: true,\n    cache: true,\n    ignoreEnvFile: moiTruong === 'production',\n    envFilePath: [`.env.${moiTruong}.local`, `.env.${moiTruong}`],\n    validationSchema: EnvSchema,\n    skipProcessEnv: true,\n  })],\n})\nexport class AppConfigModule {}";
const MA_APP = "    LoggerModule.forRootAsync({\n      inject: [ConfigService],\n      useFactory: (c: ConfigService<Env, true>) => ({\n        pinoHttp: {\n          level: c.get('LOG_LEVEL', { infer: true }),\n          transport: c.get('NODE_ENV', { infer: true }) === 'development'\n            ? { target: 'pino-pretty', options: { singleLine: true, colorize: false, ignore: 'time,pid,hostname,req,res' } } : undefined,\n          redact: ['req.headers[\"x-api-key\"]', 'req.headers.authorization'],\n          base: undefined,\n          timestamp: process.env.LOG_TIME_CO_DINH ? () => ',\"time\":\"<thời điểm>\"' : undefined,   // chỉ để output bài cố định\n        },\n      }),\n    }),";
const MA_MAIN = "import { NestFactory } from '@nestjs/core';\nimport { ConfigService } from '@nestjs/config';\nimport { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';\nimport { Logger } from 'nestjs-pino';\nimport { AppModule } from './app.module.js';\nimport type { Env } from './config/env.schema.js';\n\nconst app = await NestFactory.create(AppModule, { bufferLogs: true });\napp.useLogger(app.get(Logger));\nconst c: ConfigService<Env, true> = app.get(ConfigService);\nconst origins = c.get('CORS_ORIGINS', { infer: true });\nif (origins.length) app.enableCors({ origin: origins });\nif (c.get('SWAGGER', { infer: true })) {\n  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, new DocumentBuilder().setTitle('notices').build()));\n}\napp.enableShutdownHooks();\nawait app.listen(c.get('PORT', { infer: true }));\napp.get(Logger).log({ msg: 'khởi động xong', env: c.get('NODE_ENV', { infer: true }), port: c.get('PORT', { infer: true }), swagger: c.get('SWAGGER', { infer: true }), cors: origins });";
const ENV_EX = "NODE_ENV=\nPORT=3000\nLOG_LEVEL=info\nAPI_KEYS=\nSWAGGER=false\nCORS_ORIGINS=";
const ENV_DEV = "NODE_ENV=development\nAPI_KEYS=dev-key-0000000000001\nLOG_LEVEL=debug\nSWAGGER=true\nCORS_ORIGINS=http://localhost:5173";
const MA_SPEC = "// env.schema.spec.ts — test cấu hình như test mã: mỗi luật một ca\nimport { describe, expect, test } from 'vitest';\nimport { EnvSchema } from './env.schema.js';\n\nconst prod = { NODE_ENV: 'production', API_KEYS: 'prod-7f3a91c2e5b8d4f6' };\nconst loi = (env: object) => {\n  const r = EnvSchema.safeParse(env);\n  return r.success ? [] : r.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);\n};\n\ndescribe('EnvSchema', () => {\n  test('production tối thiểu: chỉ cần NODE_ENV + API_KEYS, còn lại có mặc định an toàn', () => {\n    expect(EnvSchema.parse(prod)).toEqual({ NODE_ENV: 'production', PORT: 3000, LOG_LEVEL: 'info', API_KEYS: ['prod-7f3a91c2e5b8d4f6'], SWAGGER: false, CORS_ORIGINS: [] });\n  });\n  test('thiếu NODE_ENV và API_KEYS ⇒ báo cả hai', () => {\n    expect(loi({})).toEqual(['NODE_ENV: Invalid option: expected one of \"development\"|\"test\"|\"production\"', 'API_KEYS: Invalid input: expected string, received undefined']);\n  });\n  test('\"false\" là false, \"no\" bị từ chối (không dùng z.coerce.boolean)', () => {\n    expect(EnvSchema.parse({ ...prod, SWAGGER: 'false' }).SWAGGER).toBe(false);\n    expect(loi({ ...prod, SWAGGER: 'no' })).toHaveLength(1);\n  });\n  test('production cấm /docs và log debug', () => {\n    expect(loi({ ...prod, SWAGGER: 'true', LOG_LEVEL: 'debug' })).toEqual(['SWAGGER: không bật /docs ở production', 'LOG_LEVEL: debug ở production ghi quá nhiều (và dễ lộ dữ liệu)']);\n  });\n  test('dev được bật cả hai', () => {\n    expect(loi({ NODE_ENV: 'development', API_KEYS: 'dev-key-0000000000001', SWAGGER: 'true', LOG_LEVEL: 'debug' })).toEqual([]);\n  });\n  test('CORS_ORIGINS tách dấu phẩy và phải là URL', () => {\n    expect(EnvSchema.parse({ ...prod, CORS_ORIGINS: 'https://lab.fpt.test, http://localhost:5173' }).CORS_ORIGINS).toEqual(['https://lab.fpt.test', 'http://localhost:5173']);\n    expect(loi({ ...prod, CORS_ORIGINS: 'lab.fpt.test' })).toEqual(['CORS_ORIGINS.0: Invalid URL']);\n  });\n});";
const OUT_55 = "$ ls dist   # build một lần: nest build\napp.module.d.ts app.module.js app.module.js.map config main.d.ts main.js main.js.map notices \n\n$ NODE_ENV=development node dist/main.js\n  GET /notices → 200   GET /docs → 200\n  │ INFO: Starting Nest application... {\"context\":\"NestFactory\"}\n  │ INFO: Nest application successfully started {\"context\":\"NestApplication\"}\n  │ INFO: khởi động xong {\"env\":\"development\",\"port\":3000,\"swagger\":true,\"cors\":[\"http://localhost:5173\"]}\n  │ DEBUG: đọc danh sách thông báo {\"context\":\"NoticesController\",\"n\":2}\n  │ INFO: request completed {\"responseTime\":5}\n\n$ NODE_ENV=test node dist/main.js\n  GET /notices → 200   GET /docs → 404\n\n$ NODE_ENV=production API_KEYS=prod-7f3a91c2e5b8d4f6 PORT=3000 node dist/main.js\n  GET /notices → 200   GET /docs → 404\n  │ {\"level\":30,\"time\":\"<thời điểm>\",\"context\":\"NestFactory\",\"msg\":\"Starting Nest application...\"}\n  │ {\"level\":30,\"time\":\"<thời điểm>\",\"context\":\"NestApplication\",\"msg\":\"Nest application successfully started\"}\n  │ {\"level\":30,\"time\":\"<thời điểm>\",\"msg\":\"khởi động xong\",\"env\":\"production\",\"port\":3000,\"swagger\":false,\"cors\":[]}\n  │ {\"level\":30,\"time\":\"<thời điểm>\",\"req\":{\"id\":1,\"method\":\"GET\",\"url\":\"/notices\",\"query\":{},\"params\":{\"splat\":[\"notices\"]},\"headers\":{\"host\":\"localhost:3000\",\"user-agent\":\"curl/8.23.0\",\"accept\":\"*/*\",\"x-api-key\":\"[Redacted]\"},\"remoteAddress\":\"::1\",\"remotePort\":45946},\"res\":{\"statusCode\":200,\"headers\":{\"x-powered-by\":\"Express\",\"content-type\":\"application/json; charset=utf-8\",\"content-length\":\"98\",\"etag\":\"W/\\\"62-MNZxhr1gw9tYHm59Y/PetvrCrUI\\\"\"}},\"responseTime\":4,\"msg\":\"request completed\"}\n  │ {\"level\":30,\"time\":\"<thời điểm>\",\"req\":{\"id\":2,\"method\":\"GET\",\"url\":\"/docs\",\"query\":{},\"params\":{\"splat\":[\"docs\"]},\"headers\":{\"host\":\"localhost:3000\",\"user-agent\":\"curl/8.23.0\",\"accept\":\"*/*\"},\"remoteAddress\":\"::1\",\"remotePort\":45958},\"res\":{\"statusCode\":404,\"headers\":{\"x-powered-by\":\"Express\",\"content-type\":\"application/json; charset=utf-8\",\"content-length\":\"67\",\"etag\":\"W/\\\"43-WjVzNHiVleAe8h0X/Jxc7Qy7LuQ\\\"\"}},\"responseTime\":1,\"msg\":\"request completed\"}\n\n$ NODE_ENV=production SWAGGER=true LOG_LEVEL=debug API_KEYS=abc node dist/main.js\n  (tiến trình thoát, mã 1)\n  │ [Nest] LOG [NestFactory] Starting Nest application...\n  │ [Nest] ERROR [ExceptionHandler] Error: Config validation error: API_KEYS.0: Too small: expected string to have >=16 characters\n  │ SWAGGER: không bật /docs ở production\n  │ LOG_LEVEL: debug ở production ghi quá nhiều (và dễ lộ dữ liệu)";
const OUT_TEST = "$ npx vitest run --reporter verbose\n ✓ src/config/env.schema.spec.ts > EnvSchema > production tối thiểu: chỉ cần NODE_ENV + API_KEYS, còn lại có mặc định an toàn\n ✓ src/config/env.schema.spec.ts > EnvSchema > thiếu NODE_ENV và API_KEYS ⇒ báo cả hai\n ✓ src/config/env.schema.spec.ts > EnvSchema > \"false\" là false, \"no\" bị từ chối (không dùng z.coerce.boolean)\n ✓ src/config/env.schema.spec.ts > EnvSchema > production cấm /docs và log debug\n ✓ src/config/env.schema.spec.ts > EnvSchema > dev được bật cả hai\n ✓ src/config/env.schema.spec.ts > EnvSchema > CORS_ORIGINS tách dấu phẩy và phải là URL\n Test Files  1 passed (1)\n Tests  6 passed (6)";

export default {
  title: '5.5 — Lab: One build, three environments|||5.5 — Lab: Một bản build, ba môi trường',
  slug: 'nst-5-5-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab ghép cả chương: một API thông báo nhỏ, build một lần bằng nest build rồi chạy thật ba cấu hình. Development: log pino-pretty mức debug, /docs mở. Test: im lặng. Production: chỉ đọc biến của tiến trình, log JSON, /docs 404, x-api-key bị che. Production sai: báo cả ba lỗi rồi thoát mã 1 trước khi nghe cổng. Schema có luật giữa các biến (production cấm Swagger và debug) và 6 test đơn vị. Có tiêu chí đạt, lời giải che sẵn và phần thử phá.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lab</span>
<h2>5.5 — Lab: one build, three environments</h2>
<p class="lead">The goal of the chapter in one exercise: a single <code>dist/</code> folder that behaves correctly in development, in tests and in production, controlled only by environment variables — and that refuses to start when production is misconfigured. You build a tiny "notices" API (two endpoints), because the point is the wiring, not the business logic.</p>

<h3>Requirements</h3>
<ol>
<li>All variables declared in one Zod schema: <code>NODE_ENV</code> (required), <code>PORT</code>, <code>LOG_LEVEL</code>, <code>API_KEYS</code> (list, each ≥ 16 characters, at least one), <code>SWAGGER</code> (true/false only), <code>CORS_ORIGINS</code> (list of URLs).</li>
<li>Rules <em>between</em> variables: in production, <code>SWAGGER=true</code> and <code>LOG_LEVEL=debug</code> are rejected.</li>
<li>Development and test may read <code>.env.&lt;env&gt;.local</code> and <code>.env.&lt;env&gt;</code>; production reads <strong>only</strong> process variables.</li>
<li>Logs: development = <code>pino-pretty</code>; everything else = JSON on stdout; <code>x-api-key</code> and <code>authorization</code> censored.</li>
<li>Swagger and CORS switched by configuration, not by <code>if (NODE_ENV …)</code> spread through the code.</li>
<li>Unit tests for the schema; a script that builds once and runs the three environments plus one broken production configuration.</li>
</ol>

<h3>Pass criteria</h3>
<ul>
<li><code>ls dist</code> is produced once; the same files run in every scenario.</li>
<li>Development: <code>/docs</code> 200, debug lines visible, readable one-line logs.</li>
<li>Test: no log output at all.</li>
<li>Production: <code>/docs</code> 404, every line is JSON, the API key never appears in logs.</li>
<li>Broken production: process exits with a non-zero code, <em>all</em> problems listed in one message.</li>
<li>Schema tests green, including the "<code>"false"</code> is false" case.</li>
</ul>

<p>Try it yourself first (45–60 minutes). The solution below is the version that produced the output.</p>

<details><summary>Show solution — schema and configuration module</summary>
<pre><code class="language-ts">${esc(MA_SCHEMA)}</code></pre>
<pre><code class="language-ts">${esc(MA_CFG)}</code></pre>
<p>Reading <code>process.env.NODE_ENV</code> at the top of <code>config.module.ts</code> is the one deliberate exception to Lesson 5.1: it only chooses <em>which files</em> to load, and it must happen before loading. Everything else goes through <code>ConfigService</code>.</p>
</details>

<details><summary>Show solution — logger, main.ts, env files</summary>
<pre><code class="language-ts">${esc(MA_APP)}</code></pre>
<pre><code class="language-ts">${esc(MA_MAIN)}</code></pre>
<p><code>.env.example</code> (committed) and <code>.env.development</code> (ignored by <code>.env*</code> + <code>!.env.example</code>):</p>
<pre><code class="language-bash">${esc(ENV_EX)}</code></pre>
<pre><code class="language-bash">${esc(ENV_DEV)}</code></pre>
</details>

<details><summary>Show solution — tests and the run</summary>
<pre><code class="language-ts">${esc(MA_SPEC)}</code></pre>
<div class="out">${esc(OUT_TEST)}</div>
<p>Build once, run four configurations (script <code>xem.sh</code> in the lab folder):</p>
<div class="out">${esc(OUT_55)}</div>
</details>

<h3>Reading the run</h3>
<ul>
<li><strong>Development</strong>: one-line pretty logs, the debug line from the controller, the startup summary (<code>env</code>, <code>port</code>, <code>swagger</code>, <code>cors</code>) — a habit worth keeping: the first log line tells you which configuration is running.</li>
<li><strong>Test</strong>: <code>LOG_LEVEL=silent</code> from <code>.env.test</code>; <code>/docs</code> 404 because <code>SWAGGER</code> defaults to false.</li>
<li><strong>Production</strong>: JSON from the first line (thanks to <code>bufferLogs</code>). The default pino serializers log a lot per request — remote port, all headers, etag. That is fine for a start; Milestone 5 trims it. The second request sent <code>x-api-key</code>, which shows as <code>[Redacted]</code>.</li>
<li><strong>Broken production</strong>: three problems in one message, exit code 1. Notice that this error is printed in <em>text</em>, not JSON: validation happens while modules load, before pino exists, so Nest's default <code>ConsoleLogger</code> prints it. If your log platform only parses JSON, also watch the container's exit code or set <code>NestFactory.create(…, { bufferLogs: true, logger: new ConsoleLogger({ json: true }) })</code> in production — we tried it: the same error then comes out as <code>{"level":"error",…,"message":"Config validation error: …","context":"ExceptionHandler"}</code>.</li>
</ul>

<h3>Break it (10 min)</h3>
<ol>
<li>Replace <code>coDung</code> with <code>z.coerce.boolean()</code>: the "<code>"false"</code> is false" test fails (real run: <code>Tests 1 failed | 5 passed (6)</code>) — and in production <code>SWAGGER=false</code> would open <code>/docs</code>.</li>
<li>Remove <code>ignoreEnvFile</code> for production and put a stray <code>.env.production</code> with <code>LOG_LEVEL=debug</code> on the server: the superRefine rule still catches it (real run: <code>Config validation error: LOG_LEVEL: debug ở production…</code>, exit 1) — the schema protects you even from files you forgot.</li>
<li>Remove <code>skipProcessEnv</code> and add an endpoint returning <code>ConfigService</code> internals: you will see every variable of the container, exactly as <code>get('HOME')</code> leaked in Lesson 5.1. Never ship a "show config" endpoint without an allow-list.</li>
</ol>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>Why build once instead of once per environment?</strong> What you tested is exactly what you deploy; differences between environments are data, visible and reviewable.</li>
<li><strong>Why should production ignore .env files?</strong> The platform (Docker, Kubernetes, CI) is the source of truth; a forgotten file on a server silently overriding nothing — or everything — is a classic incident.</li>
<li><strong>How do you validate relations between variables?</strong> A refinement on the whole object (<code>superRefine</code>), tested like any business rule.</li>
</ol>
${THE}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Lab</span>
<h2>5.5 — Lab: một bản build, ba môi trường</h2>
<p class="lead">Mục tiêu của cả chương trong một bài: một thư mục <code>dist/</code> duy nhất chạy đúng ở development, trong test và trên production, chỉ điều khiển bằng biến môi trường — và từ chối khởi động khi production cấu hình sai. Bạn dựng một API "thông báo" tí hon (hai endpoint), vì trọng tâm là cách nối dây, không phải nghiệp vụ.</p>

<h3>Yêu cầu</h3>
<ol>
<li>Mọi biến khai trong một schema Zod: <code>NODE_ENV</code> (bắt buộc), <code>PORT</code>, <code>LOG_LEVEL</code>, <code>API_KEYS</code> (danh sách, mỗi khoá ≥ 16 ký tự, ít nhất một), <code>SWAGGER</code> (chỉ true/false), <code>CORS_ORIGINS</code> (danh sách URL).</li>
<li>Luật <em>giữa</em> các biến: ở production, <code>SWAGGER=true</code> và <code>LOG_LEVEL=debug</code> bị từ chối.</li>
<li>Development và test được đọc <code>.env.&lt;môi trường&gt;.local</code> và <code>.env.&lt;môi trường&gt;</code>; production <strong>chỉ</strong> đọc biến của tiến trình.</li>
<li>Log: development dùng <code>pino-pretty</code>; mọi nơi khác là JSON ra stdout; <code>x-api-key</code> và <code>authorization</code> bị che.</li>
<li>Swagger và CORS bật/tắt bằng cấu hình, không bằng <code>if (NODE_ENV …)</code> rải khắp mã.</li>
<li>Test đơn vị cho schema; một script build một lần rồi chạy ba môi trường cộng một cấu hình production hỏng.</li>
</ol>

<h3>Tiêu chí đạt</h3>
<ul>
<li><code>ls dist</code> sinh ra một lần; cùng các tệp đó chạy ở mọi kịch bản.</li>
<li>Development: <code>/docs</code> 200, thấy dòng debug, log một dòng dễ đọc.</li>
<li>Test: không in log nào.</li>
<li>Production: <code>/docs</code> 404, mọi dòng là JSON, khoá API không bao giờ xuất hiện trong log.</li>
<li>Production hỏng: tiến trình thoát mã khác 0, <em>mọi</em> lỗi liệt kê trong một thông báo.</li>
<li>Test schema xanh, có cả ca "<code>"false"</code> là false".</li>
</ul>

<p>Tự làm trước (45–60 phút). Lời giải bên dưới là đúng phiên bản đã tạo ra output.</p>

<details><summary>Xem lời giải — schema và module cấu hình</summary>
<pre><code class="language-ts">${esc(MA_SCHEMA)}</code></pre>
<pre><code class="language-ts">${esc(MA_CFG)}</code></pre>
<p>Đọc <code>process.env.NODE_ENV</code> ở đầu <code>config.module.ts</code> là ngoại lệ có chủ ý duy nhất so với Bài 5.1: nó chỉ chọn <em>tệp nào</em> sẽ nạp, và phải xảy ra trước khi nạp. Mọi thứ khác đi qua <code>ConfigService</code>.</p>
</details>

<details><summary>Xem lời giải — logger, main.ts, các tệp env</summary>
<pre><code class="language-ts">${esc(MA_APP)}</code></pre>
<pre><code class="language-ts">${esc(MA_MAIN)}</code></pre>
<p><code>.env.example</code> (được commit) và <code>.env.development</code> (bị ignore bởi <code>.env*</code> + <code>!.env.example</code>):</p>
<pre><code class="language-bash">${esc(ENV_EX)}</code></pre>
<pre><code class="language-bash">${esc(ENV_DEV)}</code></pre>
</details>

<details><summary>Xem lời giải — test và lần chạy</summary>
<pre><code class="language-ts">${esc(MA_SPEC)}</code></pre>
<div class="out">${esc(OUT_TEST)}</div>
<p>Build một lần, chạy bốn cấu hình (script <code>xem.sh</code> trong thư mục lab):</p>
<div class="out">${esc(OUT_55)}</div>
</details>

<h3>Đọc kết quả</h3>
<ul>
<li><strong>Development</strong>: log đẹp một dòng, dòng debug từ controller, dòng tóm tắt khởi động (<code>env</code>, <code>port</code>, <code>swagger</code>, <code>cors</code>) — thói quen nên giữ: dòng log đầu tiên cho biết cấu hình nào đang chạy.</li>
<li><strong>Test</strong>: <code>LOG_LEVEL=silent</code> từ <code>.env.test</code>; <code>/docs</code> 404 vì <code>SWAGGER</code> mặc định là false.</li>
<li><strong>Production</strong>: JSON ngay từ dòng đầu (nhờ <code>bufferLogs</code>). Serializer mặc định của pino ghi khá nhiều mỗi request — cổng phía client, mọi header, etag. Lúc đầu như vậy là được; Mốc 5 sẽ gọt lại. Request thứ hai gửi <code>x-api-key</code>, và nó hiện là <code>[Redacted]</code>.</li>
<li><strong>Production hỏng</strong>: ba lỗi trong một thông báo, thoát mã 1. Để ý lỗi này in dạng <em>văn bản</em>, không phải JSON: việc kiểm diễn ra lúc nạp module, trước khi pino tồn tại, nên <code>ConsoleLogger</code> mặc định của Nest in nó. Nếu nền tảng log chỉ đọc JSON, hãy theo dõi thêm mã thoát của container hoặc đặt <code>NestFactory.create(…, { bufferLogs: true, logger: new ConsoleLogger({ json: true }) })</code> ở production — đã thử: lỗi y hệt khi đó ra dạng <code>{"level":"error",…,"message":"Config validation error: …","context":"ExceptionHandler"}</code>.</li>
</ul>

<h3>Thử phá (10 phút)</h3>
<ol>
<li>Thay <code>coDung</code> bằng <code>z.coerce.boolean()</code>: test "<code>"false"</code> là false" đỏ (chạy thật: <code>Tests 1 failed | 5 passed (6)</code>) — và trên production <code>SWAGGER=false</code> sẽ mở <code>/docs</code>.</li>
<li>Bỏ <code>ignoreEnvFile</code> ở production và để sót một tệp <code>.env.production</code> có <code>LOG_LEVEL=debug</code> trên máy chủ: luật superRefine vẫn bắt được (chạy thật: <code>Config validation error: LOG_LEVEL: debug ở production…</code>, thoát mã 1) — schema bảo vệ bạn cả trước những tệp bạn quên mất.</li>
<li>Bỏ <code>skipProcessEnv</code> và thêm một endpoint trả về nội tình <code>ConfigService</code>: bạn sẽ thấy mọi biến của container, đúng như <code>get('HOME')</code> đã lọt ra ở Bài 5.1. Đừng bao giờ đưa lên một endpoint "xem cấu hình" mà không có danh sách cho phép.</li>
</ol>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>Vì sao build một lần thay vì mỗi môi trường một lần?</strong> Thứ bạn đã test chính là thứ bạn triển khai; khác biệt giữa các môi trường là dữ liệu, nhìn thấy được và review được.</li>
<li><strong>Vì sao production nên bỏ qua tệp .env?</strong> Nền tảng (Docker, Kubernetes, CI) là nguồn sự thật; một tệp bị quên trên máy chủ âm thầm ghi đè — hoặc không ghi đè — là một sự cố kinh điển.</li>
<li><strong>Kiểm quan hệ giữa các biến thế nào?</strong> Một luật tinh chỉnh trên cả object (<code>superRefine</code>), được test như mọi luật nghiệp vụ.</li>
</ol>
${THE}
</div>
`,
};
