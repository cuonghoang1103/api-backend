/**
 * 5.1 — @nestjs/config: .env, kiểm biến môi trường, namespace và truy cập có kiểu (khoá nestjs, soạn 24/11/2026).
 * Output THẬT: container nst-run-* (Node 22, Nest 12.6.0, @nestjs/config 12.1.1, dotenv 18.0.3, zod 4.6.7) — scratchpad/nst/lab/c5/app/src/b51:
 * cfg1.ts (get trả chuỗi, getOrThrow, HOME lọt qua, biến tiến trình thắng .env, thứ tự envFilePath), mail.module.ts + mail-dung.ts
 * (đọc process.env lúc nạp tệp ⇒ undefined), node --env-file, cfg4.ts (schema Zod: ép số, skipProcessEnv, 4 lỗi một lần, exit 1),
 * cfg5.ts (registerAs + ConfigType), bt.ts (danh sách + bẫy z.coerce.boolean). Đã đọc config.module.js: forRoot là async ở bản 12,
 * validationSchema nhận Standard Schema (không còn Joi), validatePredefined mặc định true.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'docker', bai: 'dk-4-4-arg-env', title: 'Docker 4.4 — ARG và ENV: lúc dựng so với lúc chạy', sub: 'Biến môi trường đi vào container từ đâu — phần nền của bài này.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'typescript', bai: 'typescript-13-1-boundary-zod', title: 'TypeScript 13.1 — Vấn đề tại biên & Zod', sub: 'Zod từ số 0: schema, coerce, transform, safeParse.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'NestJS Docs — Configuration', 'ConfigModule, envFilePath, validationSchema, registerAs, ConfigType.', 'https://docs.nestjs.com/techniques/configuration'),
  nguon('📘', 'The Twelve-Factor App — III. Config', 'Cấu hình nằm ở biến môi trường, tách khỏi mã.', 'https://12factor.net/config'),
  nguon('📘', 'Node.js — --env-file', 'Node 20.6+ tự đọc tệp .env, không cần thư viện.', 'https://nodejs.org/api/cli.html#--env-fileconfig'),
  nguon('📘', 'Standard Schema', 'Giao diện chung mà Zod, Valibot, ArkType cùng hiện thực — Nest 12 dùng nó để kiểm cấu hình.', 'https://standardschema.dev/'),
].join('\n');
const MA_MAIL = "// mail.module.ts — đọc process.env NGAY LÚC NẠP TỆP (lỗi hay gặp)\nimport { Injectable, Module } from '@nestjs/common';\n\nconst SMTP_HOST = process.env.SMTP_HOST;            // chạy khi tệp được import — trước ConfigModule.forRoot()\n\n@Injectable()\nexport class MailService {\n  hostLucNap = SMTP_HOST;\n  hostLucGoi() { return process.env.SMTP_HOST; }   // đọc lúc gọi — khi đó .env đã nạp\n}\n@Module({ providers: [MailService], exports: [MailService] })\nexport class MailModule {}";
const MA_MAIL_DUNG = "@Injectable()\nclass MailService {\n  readonly host: string;\n  constructor(c: ConfigService) { this.host = c.getOrThrow<string>('SMTP_HOST'); }   // chạy khi container tạo provider\n}\n@Module({ providers: [MailService], exports: [MailService] })\nclass MailModule {}";
const MA_C1 = "// 1–3: không schema\n@Module({ imports: [ConfigModule.forRoot({ envFilePath: ['.env.local', '.env'] }), MailModule] })\nclass M1 {}";
const MA_C4 = "// 4: schema Zod (Standard Schema) — thiếu/sai biến ⇒ không khởi động\nconst Env = z.object({\n  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),\n  PORT: z.coerce.number().int().min(1).max(65535).default(3000),\n  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),\n  JWT_SECRET: z.string().min(32),\n});\ntype Env = z.infer<typeof Env>;\n@Module({ imports: [ConfigModule.forRoot({ envFilePath: process.env.ENVF ?? '.env', validationSchema: Env, skipProcessEnv: true })] })\nclass M4 {}";
const MA_C4B = "      const c: ConfigService<Env, true> = app.get(ConfigService);\n      const port = c.get('PORT', { infer: true });\n      console.log('PORT =', port, typeof port, '| NODE_ENV =', c.get('NODE_ENV', { infer: true }));";
const MA_C5 = "// 5: namespace bằng registerAs + tiêm có kiểu\nconst dbConfig = registerAs('db', () => ({\n  url: process.env.DATABASE_URL!,\n  poolMax: Number(process.env.DB_POOL_MAX ?? 10),\n}));\n@Injectable()\nclass Repo {\n  constructor(@Inject(dbConfig.KEY) private db: ConfigType<typeof dbConfig>) {}\n  moTa() { return `pool ${this.db.poolMax} → ${this.db.url.replace(/:[^:@]+@/, ':***@')}`; }\n}\n@Module({ imports: [ConfigModule.forRoot({ envFilePath: '.env', load: [dbConfig] })], providers: [Repo] })\nclass M5 {}";
const OUT_51 = "$ cat .env\nAPP_NAME=lab-booking\nPORT=3000\nSMTP_HOST=smtp.fpt.test\nDATABASE_URL=postgres://app:s3cret-pw@db:5432/lab\nJWT_SECRET=doi-toi-ngay-khi-len-production-0123456789\nDB_POOL_MAX=20\n$ cat .env.local\nPORT=3100\n\n## 1. ConfigModule.forRoot({ envFilePath: [\".env.local\", \".env\"] })\nget(\"PORT\")        = \"3100\" string\nget(\"APP_NAME\")    = lab-booking\nget(\"KHONG_CO\")    = undefined\nget(\"KHONG_CO\", 5) = 5\ngetOrThrow        ⇒ TypeError: Configuration key \"KHONG_CO\" does not exist\nget(\"HOME\")        = /tmp  ← biến của cả tiến trình cũng đọc được\n\n## 1b. Biến đặt sẵn ở tiến trình thắng tệp .env\n$ PORT=8080 node dist/b51/cfg1.js\nget(\"PORT\")        = \"8080\" string\n\n## 2. Đọc process.env lúc nạp tệp\nSMTP_HOST đọc lúc nạp tệp : undefined\nSMTP_HOST đọc lúc gọi     : smtp.fpt.test\n-- sửa: tiêm ConfigService\nSMTP_HOST qua ConfigService: smtp.fpt.test\n\n## 3. Node 22 tự đọc .env (không cần thư viện)\n$ node --env-file=.env -p process.env.APP_NAME\nlab-booking\n\n## 4. Schema Zod — .env đủ\nPORT = 3000 number | NODE_ENV = development\nget(\"HOME\") = undefined  ← skipProcessEnv: chỉ trả biến có trong schema\n\n## 4b. Schema Zod — .env sai\n$ cat .env.sai\nPORT=80800\nDATABASE_URL=mysql://app@db/lab\nJWT_SECRET=123456\nNODE_ENV=prod\n[Nest] ERROR [ExceptionHandler] Error: Config validation error: NODE_ENV: Invalid option: expected one of \"development\"|\"test\"|\"production\"\nPORT: Too big: expected number to be <=65535\nDATABASE_URL: Invalid URL\nJWT_SECRET: Too small: expected string to have >=32 characters\n    at ConfigModule.loadEnv (file:///app/nst-esm/node_modules/@nestjs/config/dist/config.module.js:140:23)\n    at async ConfigModule.forRoot (file:///app/nst-esm/node_modules/@nestjs/config/dist/config.module.js:51:25)\nexit=1\n\n## 5. registerAs(\"db\") + @Inject(dbConfig.KEY)\npool 20 → postgres://app:***@db:5432/lab\nget(\"db.poolMax\") = 20";
const MA_BT = "// bt.ts — đáp án bài tập 5.1: danh sách và cờ bật/tắt từ biến môi trường (bẫy z.coerce.boolean)\nimport 'reflect-metadata';\nimport { Module } from '@nestjs/common';\nimport { NestFactory } from '@nestjs/core';\nimport { ConfigModule, ConfigService } from '@nestjs/config';\nimport { z } from 'zod';\n\nconst coDung = z.enum(['true', 'false', '1', '0']).transform((v) => v === 'true' || v === '1');\nconst Env = z.object({\n  CORS_ORIGINS: z.string().transform((s) => s.split(',').map((x) => x.trim()).filter(Boolean))\n    .pipe(z.array(z.url()).min(1)),\n  SWAGGER_SAI: z.coerce.boolean(),              // SAI: Boolean(\"false\") === true\n  SWAGGER: coDung.default(false),               // ĐÚNG: chỉ nhận true/false/1/0\n});\n@Module({ imports: [ConfigModule.forRoot({ ignoreEnvFile: true, validationSchema: Env })] })\nclass M {}\nconst app = await NestFactory.createApplicationContext(M, { logger: ['error'] });\nconst c = app.get(ConfigService);\nfor (const k of ['CORS_ORIGINS', 'SWAGGER_SAI', 'SWAGGER']) console.log(k.padEnd(12), '=', JSON.stringify(c.get(k)));\nawait app.close();";
const OUT_BT = "$ CORS_ORIGINS=\"https://lab.fpt.test, http://localhost:5173\" SWAGGER_SAI=false SWAGGER=false node dist/b51/bt.js\nCORS_ORIGINS = [\"https://lab.fpt.test\",\"http://localhost:5173\"]\nSWAGGER_SAI  = true\nSWAGGER      = false\n$ ... SWAGGER=no\n[Nest] ERROR [ExceptionHandler] Error: Config validation error: SWAGGER: Invalid option: expected one of \"0\"|\"1\"|\"true\"|\"false\"";

export default {
  title: '5.1 — @nestjs/config: .env, validated environment, namespaces and typed access|||5.1 — @nestjs/config: .env, kiểm biến môi trường, namespace và truy cập có kiểu',
  slug: 'nst-5-1-config',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Cấu hình nằm ở biến môi trường, không nằm trong mã. Chạy thật @nestjs/config 12.1: get trả chuỗi "3100" chứ không phải số, biến của tiến trình thắng tệp .env, đọc process.env ở đầu tệp ra undefined, schema Zod ép kiểu và báo cả 4 biến sai một lần rồi thoát mã 1, skipProcessEnv chặn đọc biến lạ, registerAs + ConfigType cho truy cập có kiểu. Bài tập: danh sách từ chuỗi và bẫy z.coerce.boolean biến "false" thành true.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>5.1 — Configuration lives outside the code</h2>
<p class="lead">The same build must run on your laptop, in CI and in production. What changes between them — database address, port, keys, log level — is <strong>configuration</strong>, and the Twelve-Factor rule is simple: keep it in environment variables, not in the source. Nest's <code>@nestjs/config</code> loads those variables, validates them at startup and hands them to providers through DI. This lesson runs every part of it and shows the four mistakes that make configuration bugs appear only in production.</p>

<h3>Everyday analogy: the recipe and the shopping list</h3>
<p>A restaurant chain uses one recipe book in every branch. Each branch's kitchen manager writes a short sheet: which supplier, which oven temperature for this oven, how many portions. Nobody rewrites the recipe book per branch. Code is the recipe book; environment variables are the sheet. And a good manager checks the sheet <em>before</em> opening — not when the first customer orders.</p>

<h3>Experiment 1 — what <code>ConfigService</code> really returns</h3>
<pre><code class="language-ts">${esc(MA_C1)}</code></pre>
<p>All experiments run as separate Node processes (one <code>forRoot</code> each — see the warning at the end of the lesson). Output:</p>
<div class="out">${esc(OUT_51)}</div>

<h4>1. Every value is a string</h4>
<p><code>get('PORT')</code> returned <code>"3100"</code>, type <code>string</code>. Environment variables are text; nothing converts them unless you ask. <code>port + 1</code> would be <code>"31001"</code>, and <code>if (process.env.DEBUG)</code> is true for <code>DEBUG=false</code>. Section 4 fixes this with a schema.</p>
<h4>2. Missing keys and defaults</h4>
<p>Missing keys give <code>undefined</code>; <code>get(key, default)</code> supplies a fallback; <code>getOrThrow</code> throws <code>TypeError: Configuration key "KHONG_CO" does not exist</code>. Prefer <code>getOrThrow</code> for anything the app cannot work without — but a schema is better still, because it fails at startup instead of at the first request.</p>
<h4>3. Precedence: process beats file, first file beats later files</h4>
<p>With <code>envFilePath: ['.env.local', '.env']</code>, <code>PORT</code> came from <code>.env.local</code> (3100): the first file that defines a key wins. And <code>PORT=8080 node …</code> beat both files: a variable already set in the process is never overwritten (unless <code>override: true</code>). That is what you want — Docker, Kubernetes and CI set real variables; the files are only a convenience for development.</p>
<h4>4. <code>HOME</code> leaked through</h4>
<p><code>get('HOME')</code> returned <code>/tmp</code>: without a schema, <code>ConfigService</code> reads <em>every</em> variable of the process. That is how a config dump endpoint ends up printing <code>AWS_SECRET_ACCESS_KEY</code> that nobody meant to use. <code>skipProcessEnv: true</code> (section 4) limits it to declared keys.</p>

<h3>Experiment 2 — the bug that only exists in some files: reading <code>process.env</code> too early</h3>
<pre><code class="language-ts">${esc(MA_MAIL)}</code></pre>
<p>Output above, section 2: <code>SMTP_HOST</code> read at file load is <code>undefined</code>; read at call time it is <code>smtp.fpt.test</code>. Why: ES modules evaluate imports <em>first</em>. <code>app.module.ts</code> imports <code>mail.module.ts</code>, so its top-level line runs before the <code>@Module({ imports: [ConfigModule.forRoot()] })</code> decorator of the importing file is even evaluated — the <code>.env</code> file has not been loaded yet. In production the variable comes from Docker, so it works there and fails on every developer laptop (or the other way round). The same trap hides in <code>JwtModule.register({ secret: process.env.JWT_SECRET })</code> written in a feature module: the secret is <code>undefined</code>, and the error only shows up when the first token is signed — or, worse, never in production.</p>
<p>The fix is to let DI give you configuration when the provider is created:</p>
<pre><code class="language-ts">${esc(MA_MAIL_DUNG)}</code></pre>
<p>For third-party modules use their <code>forRootAsync</code>/<code>registerAsync</code> with <code>inject: [ConfigService]</code> (Lesson 2.5) — Lesson 5.3 does exactly that for the logger.</p>

<h3>Experiment 3 — Node can read .env by itself</h3>
<p>Section 3: <code>node --env-file=.env</code> (Node 20.6+) loads the file without any package. For plain scripts that is enough. <code>@nestjs/config</code> adds what Node does not: several files with precedence, variable expansion, validation, typed namespaces and injection.</p>

<h3>Experiment 4 — a schema: refuse to start with bad configuration</h3>
<pre><code class="language-ts">${esc(MA_C4)}</code></pre>
<pre><code class="language-ts">${esc(MA_C4B)}</code></pre>
<p>Output sections 4 and 4b. With a valid file, <code>PORT</code> is the <em>number</em> 3000 (<code>z.coerce.number()</code>), <code>NODE_ENV</code> got its default, and <code>HOME</code> is now <code>undefined</code> because <code>skipProcessEnv</code> serves only declared keys. With the broken file the app printed all four problems in one message — the enum, the port above 65535, the MySQL URL where Postgres was required, the 6-character JWT secret — and exited with code 1 before listening on any port. That is the behaviour you want in a deployment: the new version never becomes healthy, the old one keeps serving, and the log says exactly which variable to fix.</p>
<p>Nest 12 detail (checked in <code>config.module.js</code>): <code>validationSchema</code> now accepts any <strong>Standard Schema</strong> (Zod, Valibot, ArkType); older tutorials show Joi, which this version no longer uses for that option. <code>forRoot()</code> is also <code>async</code> now — <code>imports</code> accepts the promise. If you prefer class-validator, the <code>validate</code> option takes a function and you can call <code>validateSync</code> yourself.</p>
<p>Typed access: <code>ConfigService&lt;Env, true&gt;</code> plus <code>get('PORT', { infer: true })</code> returns <code>number</code> in the editor too, and a typo like <code>get('PROT', { infer: true })</code> is a compile error.</p>

<h3>Experiment 5 — namespaces with <code>registerAs</code></h3>
<pre><code class="language-ts">${esc(MA_C5)}</code></pre>
<p>Output section 5: <code>pool 20 → postgres://app:***@db:5432/lab</code>, and the same value is reachable as <code>get('db.poolMax')</code>. A namespace groups related settings (database, mail, auth) into one typed object. <code>@Inject(dbConfig.KEY)</code> with <code>ConfigType&lt;typeof dbConfig&gt;</code> means the repository depends only on its own slice, and a unit test can pass <code>{ url: '…', poolMax: 1 }</code> with no environment at all. Note: the factory reads <code>process.env</code>, but it runs when the container builds the provider — after the files are loaded — so it does not have the problem of experiment 2.</p>

<h3>Warning: one <code>forRoot</code>, early</h3>
<p>While writing this lesson the first version put two modules with two <code>forRoot</code> calls in one file — and the second one reported <code>PORT = 3100</code> from the first one's <code>.env.local</code>. <code>forRoot</code> copies loaded values into <code>process.env</code>, and later calls treat them as variables of the process. Call <code>ConfigModule.forRoot({ isGlobal: true })</code> once, in the root module; feature modules use <code>ConfigModule.forFeature(namespace)</code> or simply inject <code>ConfigService</code>.</p>

<h3>🧪 Exercise (20 min) — lists and on/off switches</h3>
<p>Add <code>CORS_ORIGINS</code> (comma-separated URLs ⇒ array, at least one) and <code>SWAGGER</code> (on/off). Make <code>SWAGGER=false</code> really mean false and reject values like <code>no</code>.</p>
<details><summary>Show solution</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p><code>z.coerce.boolean()</code> runs <code>Boolean("false")</code>, which is <code>true</code> — the same trap as <code>enableImplicitConversion</code> in Lesson 4.2. Accept an explicit list of words and transform. The URL list is split, trimmed and every item validated, so a typo like <code>lab.fpt.test</code> (no scheme) stops the app instead of silently breaking CORS.</p>
</details>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>Where should configuration live, and why?</strong> In the environment, outside the build (Twelve-Factor III): one artifact runs everywhere, secrets stay out of the repository, ops can change a value without a rebuild.</li>
<li><strong>What happens if a required variable is missing?</strong> With a schema: the app refuses to start and lists every problem. Without one: it starts and fails at the first request that needs the value — often hours later.</li>
<li><strong>Why is <code>process.env.X</code> at the top of a module file a bug?</strong> ESM evaluates imports first, so the line runs before <code>ConfigModule</code> loads <code>.env</code>. Inject <code>ConfigService</code> or use <code>forRootAsync</code>.</li>
<li><strong>How do you make configuration type-safe?</strong> A schema that coerces and validates (Zod/Standard Schema), <code>ConfigService&lt;Env, true&gt;</code> with <code>infer: true</code>, or <code>registerAs</code> + <code>ConfigType</code>.</li>
</ol>

<h3>💼 On the job</h3>
<p>On outsourcing projects the customer's ops team deploys your build into environments you never see. The first question in a hand-over is "which variables does it need?". A schema file plus <code>.env.example</code> answers it exactly, and the startup error answers it again when they forget one. Teams also add a CI step that starts the app with production-like variables and checks it reaches "successfully started" — Lesson 5.5 does that by hand.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ConfigModule.forRoot</span><span class="v">Loads .env files into process.env, validates, registers ConfigService. Call once in the root module.</span></div>
  <div class="kv"><span class="k">envFilePath</span><span class="v">One or more files; the first file that defines a key wins; process variables beat all files.</span></div>
  <div class="kv"><span class="k">validationSchema</span><span class="v">Nest 12: a Standard Schema (Zod…). Invalid ⇒ "Config validation error" listing every key, exit 1.</span></div>
  <div class="kv"><span class="k">skipProcessEnv</span><span class="v">ConfigService serves only declared/loaded keys, not every variable of the process.</span></div>
  <div class="kv"><span class="k">registerAs / ConfigType</span><span class="v">A named, typed slice of configuration injected with @Inject(x.KEY).</span></div>
  <div class="kv"><span class="k">getOrThrow</span><span class="v">Throws TypeError if the key does not exist instead of returning undefined.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Environment values are strings; coerce and validate them with a schema at startup.</li>
<li>Process variables beat .env files; the first listed file wins — files are for development only.</li>
<li>Never read <code>process.env</code> at the top of a module file; inject <code>ConfigService</code> or use <code>…Async</code> registration.</li>
<li><code>skipProcessEnv</code> stops ConfigService from exposing every variable of the machine.</li>
<li>One <code>forRoot({ isGlobal: true })</code>; namespaces with <code>registerAs</code> for typed slices.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>5.1 — Cấu hình nằm ngoài mã nguồn</h2>
<p class="lead">Cùng một bản build phải chạy được trên laptop của bạn, trong CI và trên production. Thứ thay đổi giữa các nơi đó — địa chỉ cơ sở dữ liệu, cổng, khoá, mức log — là <strong>cấu hình</strong>, và luật Twelve-Factor rất đơn giản: để nó trong biến môi trường, không để trong mã. <code>@nestjs/config</code> của Nest nạp các biến đó, kiểm chúng lúc khởi động và đưa cho provider qua DI. Bài này chạy thật từng phần và chỉ ra bốn lỗi khiến lỗi cấu hình chỉ hiện ra trên production.</p>

<h3>Liên hệ đời thường: sách công thức và tờ ghi chú của bếp trưởng</h3>
<p>Một chuỗi nhà hàng dùng chung một cuốn sách công thức ở mọi chi nhánh. Bếp trưởng mỗi chi nhánh ghi một tờ ngắn: nhập hàng của ai, lò này nướng bao nhiêu độ, bao nhiêu suất. Không ai viết lại sách công thức cho từng chi nhánh. Mã nguồn là sách công thức; biến môi trường là tờ ghi chú. Và bếp trưởng giỏi đọc tờ ghi chú <em>trước</em> giờ mở cửa — không đợi khách đầu tiên gọi món.</p>

<h3>Thí nghiệm 1 — <code>ConfigService</code> thực sự trả về gì</h3>
<pre><code class="language-ts">${esc(MA_C1)}</code></pre>
<p>Mỗi thí nghiệm chạy trong một tiến trình Node riêng (mỗi tiến trình một <code>forRoot</code> — xem cảnh báo cuối bài). Output:</p>
<div class="out">${esc(OUT_51)}</div>

<h4>1. Giá trị nào cũng là chuỗi</h4>
<p><code>get('PORT')</code> trả <code>"3100"</code>, kiểu <code>string</code>. Biến môi trường là văn bản; không ai đổi kiểu nếu bạn không yêu cầu. <code>port + 1</code> sẽ thành <code>"31001"</code>, còn <code>if (process.env.DEBUG)</code> đúng cả khi <code>DEBUG=false</code>. Phần 4 sửa chuyện này bằng schema.</p>
<h4>2. Khoá thiếu và giá trị mặc định</h4>
<p>Khoá thiếu cho <code>undefined</code>; <code>get(khoá, mặc_định)</code> cho giá trị dự phòng; <code>getOrThrow</code> ném <code>TypeError: Configuration key "KHONG_CO" does not exist</code>. Dùng <code>getOrThrow</code> cho thứ ứng dụng không thể thiếu — nhưng schema còn tốt hơn, vì nó hỏng ngay lúc khởi động thay vì lúc request đầu tiên.</p>
<h4>3. Thứ tự ưu tiên: tiến trình thắng tệp, tệp đầu thắng tệp sau</h4>
<p>Với <code>envFilePath: ['.env.local', '.env']</code>, <code>PORT</code> lấy từ <code>.env.local</code> (3100): tệp đầu tiên có khoá đó thắng. Còn <code>PORT=8080 node …</code> thắng cả hai tệp: biến đã có sẵn trong tiến trình không bao giờ bị ghi đè (trừ khi <code>override: true</code>). Đó đúng là điều bạn muốn — Docker, Kubernetes và CI đặt biến thật; các tệp chỉ là tiện lợi khi phát triển.</p>
<h4>4. <code>HOME</code> lọt qua</h4>
<p><code>get('HOME')</code> trả <code>/tmp</code>: không có schema, <code>ConfigService</code> đọc <em>mọi</em> biến của tiến trình. Đó là cách một endpoint "xem cấu hình" in ra cả <code>AWS_SECRET_ACCESS_KEY</code> mà không ai định dùng. <code>skipProcessEnv: true</code> (phần 4) giới hạn lại chỉ những khoá đã khai.</p>

<h3>Thí nghiệm 2 — lỗi chỉ có ở vài tệp: đọc <code>process.env</code> quá sớm</h3>
<pre><code class="language-ts">${esc(MA_MAIL)}</code></pre>
<p>Output ở trên, phần 2: <code>SMTP_HOST</code> đọc lúc nạp tệp là <code>undefined</code>; đọc lúc gọi thì là <code>smtp.fpt.test</code>. Vì sao: ES module chạy các import <em>trước</em>. <code>app.module.ts</code> import <code>mail.module.ts</code>, nên dòng cấp cao nhất của nó chạy trước cả khi decorator <code>@Module({ imports: [ConfigModule.forRoot()] })</code> của tệp import được tính — tệp <code>.env</code> chưa được nạp. Trên production biến đến từ Docker nên ở đó chạy được, còn trên máy mọi lập trình viên thì hỏng (hoặc ngược lại). Cùng cái bẫy nằm trong <code>JwtModule.register({ secret: process.env.JWT_SECRET })</code> viết ở module tính năng: secret là <code>undefined</code>, và lỗi chỉ lộ ra khi ký token đầu tiên — hoặc tệ hơn, không bao giờ lộ trên production.</p>
<p>Cách sửa là để DI đưa cấu hình cho bạn lúc provider được tạo:</p>
<pre><code class="language-ts">${esc(MA_MAIL_DUNG)}</code></pre>
<p>Với module của bên thứ ba, dùng <code>forRootAsync</code>/<code>registerAsync</code> với <code>inject: [ConfigService]</code> (Bài 2.5) — Bài 5.3 làm đúng như vậy cho logger.</p>

<h3>Thí nghiệm 3 — Node tự đọc được .env</h3>
<p>Phần 3: <code>node --env-file=.env</code> (Node 20.6+) nạp tệp mà không cần gói nào. Với script đơn giản như vậy là đủ. <code>@nestjs/config</code> thêm những thứ Node không có: nhiều tệp có thứ tự ưu tiên, mở rộng biến, kiểm hợp lệ, namespace có kiểu và tiêm qua DI.</p>

<h3>Thí nghiệm 4 — schema: từ chối khởi động khi cấu hình sai</h3>
<pre><code class="language-ts">${esc(MA_C4)}</code></pre>
<pre><code class="language-ts">${esc(MA_C4B)}</code></pre>
<p>Output phần 4 và 4b. Với tệp đúng, <code>PORT</code> là <em>số</em> 3000 (<code>z.coerce.number()</code>), <code>NODE_ENV</code> nhận giá trị mặc định, còn <code>HOME</code> giờ là <code>undefined</code> vì <code>skipProcessEnv</code> chỉ trả khoá đã khai. Với tệp sai, ứng dụng in cả bốn lỗi trong một thông báo — enum sai, cổng quá 65535, URL MySQL trong khi cần Postgres, JWT secret 6 ký tự — rồi thoát mã 1 trước khi nghe cổng nào. Đó là hành vi bạn muốn khi triển khai: bản mới không bao giờ "khoẻ", bản cũ vẫn phục vụ, và log nói đúng biến nào cần sửa.</p>
<p>Chi tiết Nest 12 (đã đọc trong <code>config.module.js</code>): <code>validationSchema</code> giờ nhận mọi <strong>Standard Schema</strong> (Zod, Valibot, ArkType); hướng dẫn cũ dùng Joi, bản này không còn dùng Joi cho tuỳ chọn đó. <code>forRoot()</code> cũng đã thành <code>async</code> — <code>imports</code> nhận luôn promise. Nếu thích class-validator, tuỳ chọn <code>validate</code> nhận một hàm và bạn tự gọi <code>validateSync</code>.</p>
<p>Truy cập có kiểu: <code>ConfigService&lt;Env, true&gt;</code> cùng <code>get('PORT', { infer: true })</code> trả <code>number</code> ngay trong trình soạn thảo, còn gõ nhầm <code>get('PROT', { infer: true })</code> là lỗi biên dịch.</p>

<h3>Thí nghiệm 5 — namespace bằng <code>registerAs</code></h3>
<pre><code class="language-ts">${esc(MA_C5)}</code></pre>
<p>Output phần 5: <code>pool 20 → postgres://app:***@db:5432/lab</code>, và cùng giá trị đọc được bằng <code>get('db.poolMax')</code>. Namespace gom các thiết lập liên quan (cơ sở dữ liệu, mail, xác thực) thành một object có kiểu. <code>@Inject(dbConfig.KEY)</code> với <code>ConfigType&lt;typeof dbConfig&gt;</code> nghĩa là repository chỉ phụ thuộc đúng phần của nó, và test đơn vị truyền được <code>{ url: '…', poolMax: 1 }</code> mà không cần biến môi trường nào. Lưu ý: hàm factory đọc <code>process.env</code>, nhưng nó chạy lúc container dựng provider — sau khi tệp đã nạp — nên không mắc lỗi của thí nghiệm 2.</p>

<h3>Cảnh báo: một <code>forRoot</code>, gọi sớm</h3>
<p>Lúc soạn bài này, bản đầu đặt hai module với hai lần <code>forRoot</code> trong cùng một tệp — và lần thứ hai báo <code>PORT = 3100</code> lấy từ <code>.env.local</code> của lần thứ nhất. <code>forRoot</code> chép giá trị đã nạp vào <code>process.env</code>, và các lần gọi sau coi chúng là biến của tiến trình. Gọi <code>ConfigModule.forRoot({ isGlobal: true })</code> đúng một lần, ở module gốc; module tính năng dùng <code>ConfigModule.forFeature(namespace)</code> hoặc đơn giản là tiêm <code>ConfigService</code>.</p>

<h3>🧪 Bài tập (20 phút) — danh sách và công tắc bật/tắt</h3>
<p>Thêm <code>CORS_ORIGINS</code> (các URL cách nhau dấu phẩy ⇒ mảng, ít nhất một) và <code>SWAGGER</code> (bật/tắt). Làm cho <code>SWAGGER=false</code> thật sự là false và từ chối giá trị kiểu <code>no</code>.</p>
<details><summary>Xem lời giải</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p><code>z.coerce.boolean()</code> chạy <code>Boolean("false")</code>, kết quả là <code>true</code> — cùng cái bẫy với <code>enableImplicitConversion</code> ở Bài 4.2. Hãy nhận một danh sách từ rõ ràng rồi biến đổi. Danh sách URL được tách, bỏ khoảng trắng và kiểm từng phần tử, nên gõ nhầm <code>lab.fpt.test</code> (thiếu scheme) sẽ chặn ứng dụng khởi động thay vì làm hỏng CORS trong im lặng.</p>
</details>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>Cấu hình nên nằm ở đâu, vì sao?</strong> Trong môi trường, ngoài bản build (Twelve-Factor III): một bản build chạy mọi nơi, bí mật không vào kho mã, bên vận hành đổi giá trị không cần build lại.</li>
<li><strong>Thiếu một biến bắt buộc thì sao?</strong> Có schema: ứng dụng từ chối khởi động và liệt kê mọi lỗi. Không có: nó chạy lên rồi hỏng ở request đầu tiên cần giá trị đó — thường là vài giờ sau.</li>
<li><strong>Vì sao <code>process.env.X</code> ở đầu tệp module là lỗi?</strong> ESM chạy import trước, nên dòng đó chạy trước khi <code>ConfigModule</code> nạp <code>.env</code>. Tiêm <code>ConfigService</code> hoặc dùng <code>forRootAsync</code>.</li>
<li><strong>Làm cấu hình an toàn kiểu thế nào?</strong> Schema vừa ép kiểu vừa kiểm (Zod/Standard Schema), <code>ConfigService&lt;Env, true&gt;</code> với <code>infer: true</code>, hoặc <code>registerAs</code> + <code>ConfigType</code>.</li>
</ol>

<h3>💼 Tình huống đi làm</h3>
<p>Ở dự án outsourcing, đội vận hành của khách triển khai bản build của bạn vào những môi trường bạn không bao giờ thấy. Câu hỏi đầu tiên khi bàn giao là "nó cần những biến nào?". Tệp schema cộng <code>.env.example</code> trả lời chính xác, và thông báo lỗi khởi động trả lời lần nữa khi họ quên một biến. Nhiều đội còn thêm một bước CI khởi động ứng dụng với biến giống production và kiểm nó tới được dòng "successfully started" — Bài 5.5 làm việc đó bằng tay.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ConfigModule.forRoot</span><span class="v">Nạp tệp .env vào process.env, kiểm hợp lệ, đăng ký ConfigService. Gọi một lần ở module gốc.</span></div>
  <div class="kv"><span class="k">envFilePath</span><span class="v">Một hoặc nhiều tệp; tệp đầu có khoá thì thắng; biến tiến trình thắng mọi tệp.</span></div>
  <div class="kv"><span class="k">validationSchema</span><span class="v">Nest 12: một Standard Schema (Zod…). Sai ⇒ "Config validation error" liệt kê mọi khoá, thoát mã 1.</span></div>
  <div class="kv"><span class="k">skipProcessEnv</span><span class="v">ConfigService chỉ trả khoá đã khai/đã nạp, không trả mọi biến của tiến trình.</span></div>
  <div class="kv"><span class="k">registerAs / ConfigType</span><span class="v">Một phần cấu hình có tên, có kiểu, tiêm bằng @Inject(x.KEY).</span></div>
  <div class="kv"><span class="k">getOrThrow</span><span class="v">Ném TypeError nếu khoá không tồn tại, thay vì trả undefined.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Giá trị môi trường là chuỗi; ép kiểu và kiểm bằng schema ngay lúc khởi động.</li>
<li>Biến tiến trình thắng tệp .env; tệp đứng đầu danh sách thắng — tệp chỉ dùng khi phát triển.</li>
<li>Không đọc <code>process.env</code> ở đầu tệp module; tiêm <code>ConfigService</code> hoặc đăng ký kiểu <code>…Async</code>.</li>
<li><code>skipProcessEnv</code> ngăn ConfigService lộ mọi biến của máy.</li>
<li>Một <code>forRoot({ isGlobal: true })</code>; namespace bằng <code>registerAs</code> cho từng phần có kiểu.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
