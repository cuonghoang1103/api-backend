/**
 * 2.5 — Dynamic module: forRoot, forFeature, register, ConfigurableModuleBuilder (khoá nestjs, soạn 24/11/2026).
 * Output THẬT: container nst-run-* (Node v22.23.5, Nest 12.6.0) — scratchpad/nst/lab/c2/app/src/b25:
 * tay.ts (StorageModule.register viết tay, hai cấu hình ⇒ hai StorageService), builder.ts (ConfigurableModuleBuilder +
 * forRootAsync + isGlobal; đủ biến / thiếu biến ⇒ từ chối khởi động), feature.ts (bài tập forRoot global + forFeature theo tên).
 * @nestjs/config chưa cài ở lab này — ConfigModule thật dạy ở Chương 5; ở đây dùng EnvService tí hon.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'spring-boot', bai: 'sb-3-7-profile-config', title: 'Spring Boot 3.7 — Profile và cấu hình có kiểu', sub: '@ConfigurationProperties ≈ đối tượng tuỳ chọn mà forRoot nhận.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'NestJS Docs — Dynamic modules', 'register/forRoot/forFeature, ConfigurableModuleBuilder, setExtras, forRootAsync.', 'https://docs.nestjs.com/fundamentals/dynamic-modules'),
  nguon('📘', 'NestJS Docs — Configuration', 'ConfigModule.forRoot — ví dụ dynamic module bạn dùng nhiều nhất (Chương 5).', 'https://docs.nestjs.com/techniques/configuration'),
].join('\n');

const BANG = `register(o)      mỗi lần import một cấu hình riêng      HttpModule.register({ timeout })
forRoot(o)       cấu hình một lần, ở gốc, thường global  ConfigModule.forRoot(), TypeOrmModule.forRoot()
forFeature(x)    module tính năng xin phần của mình     TypeOrmModule.forFeature([Room]), BullModule.registerQueue
…Async({ useFactory, inject, imports })  cấu hình lấy từ provider khác (ConfigService)`;
const MA_TAY = "import 'reflect-metadata';\nimport { Inject, Injectable, Module, type DynamicModule } from '@nestjs/common';\nimport { NestFactory } from '@nestjs/core';\n\n// ── Module có cấu hình, viết tay: một hàm tĩnh trả về DynamicModule ──\nexport interface StorageOptions { thuMuc: string; toiDaMB: number }\nconst STORAGE_OPTIONS = Symbol('STORAGE_OPTIONS');\n\n@Injectable() export class StorageService {\n  constructor(@Inject(STORAGE_OPTIONS) private readonly o: StorageOptions) {}\n  luu(ten: string, mb: number) {\n    return mb > this.o.toiDaMB ? `✗ ${ten}: ${mb} MB > ${this.o.toiDaMB} MB` : `✓ ${this.o.thuMuc}/${ten}`;\n  }\n}\n\n@Module({})\nexport class StorageModule {\n  static register(o: StorageOptions): DynamicModule {\n    return {\n      module: StorageModule,                                  // \"lớp\" của module\n      providers: [{ provide: STORAGE_OPTIONS, useValue: o }, StorageService],\n      exports: [StorageService],\n    };\n  }\n}\n\n// Hai module tính năng, mỗi cái một cấu hình — cùng một StorageModule\n@Injectable() class AvatarService { constructor(readonly s: StorageService) {} }\n@Module({ imports: [StorageModule.register({ thuMuc: '/data/avatar', toiDaMB: 2 })], providers: [AvatarService] })\nclass AvatarModule {}\n@Injectable() class ReportService { constructor(readonly s: StorageService) {} }\n@Module({ imports: [StorageModule.register({ thuMuc: '/data/bao-cao', toiDaMB: 50 })], providers: [ReportService] })\nclass ReportModule {}\n\n@Module({ imports: [AvatarModule, ReportModule] }) class AppModule {}\nconst app = await NestFactory.createApplicationContext(AppModule, { logger: false });\nconst a = app.get(AvatarService), r = app.get(ReportService);\nconsole.log(a.s.luu('cuong.png', 1), '|', a.s.luu('cuong-4k.png', 9));\nconsole.log(r.s.luu('hk6.pdf', 9));\nconsole.log('hai StorageService khác nhau:', a.s !== r.s);\nconst dm = StorageModule.register({ thuMuc: '/x', toiDaMB: 1 });\nconsole.log('DynamicModule chỉ là object:', JSON.stringify({ ...dm, module: dm.module.name, providers: dm.providers!.map((p: any) => p.name ?? String(p.provide)), exports: dm.exports!.map((p: any) => p.name) }));\nawait app.close();";
const OUT_TAY = "✓ /data/avatar/cuong.png | ✗ cuong-4k.png: 9 MB > 2 MB\n✓ /data/bao-cao/hk6.pdf\nhai StorageService khác nhau: true\nDynamicModule chỉ là object: {\"module\":\"StorageModule\",\"providers\":[\"Symbol(STORAGE_OPTIONS)\",\"StorageService\"],\"exports\":[\"StorageService\"]}";
const MA_BU = "import 'reflect-metadata';\nimport { ConfigurableModuleBuilder, Inject, Injectable, Module } from '@nestjs/common';\nimport { NestFactory } from '@nestjs/core';\n\nexport interface MailOptions { host: string; port: number; from: string }\n\n// ── ConfigurableModuleBuilder sinh sẵn forRoot + forRootAsync + token tuỳ chọn ──\nexport const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, OPTIONS_TYPE, ASYNC_OPTIONS_TYPE } =\n  new ConfigurableModuleBuilder<MailOptions>()\n    .setClassMethodName('forRoot')\n    .setExtras({ isGlobal: false }, (def, extras) => ({ ...def, global: extras.isGlobal }))\n    .build();\n\n@Injectable() export class MailService {\n  constructor(@Inject(MODULE_OPTIONS_TOKEN) private readonly o: MailOptions) {}\n  gui(to: string) { return `gửi ${to} qua ${this.o.host}:${this.o.port} từ ${this.o.from}`; }\n}\n@Module({ providers: [MailService], exports: [MailService] })\nexport class MailModule extends ConfigurableModuleClass {}\n\n// Một \"ConfigService\" tí hon để forRootAsync có thứ mà inject\n@Injectable() class EnvService { get(k: string) { return process.env[k]; } }\n@Module({ providers: [EnvService], exports: [EnvService] }) class EnvModule {}\n\n@Injectable() class SignupService { constructor(readonly mail: MailService) {} }\n@Module({ providers: [SignupService] }) class SignupModule {}       // KHÔNG import MailModule — nhờ isGlobal\n\n@Module({\n  imports: [\n    MailModule.forRootAsync({\n      isGlobal: true,\n      imports: [EnvModule],\n      inject: [EnvService],\n      useFactory: async (env: EnvService) => {\n        const port = Number(env.get('SMTP_PORT'));\n        if (!env.get('SMTP_HOST') || !port) throw new Error('thiếu SMTP_HOST/SMTP_PORT — từ chối khởi động');\n        return { host: env.get('SMTP_HOST')!, port, from: 'no-reply@lab.fpt' };\n      },\n    }),\n    SignupModule,\n  ],\n})\nclass AppModule {}\n\ntry {\n  const app = await NestFactory.createApplicationContext(AppModule, { logger: false, abortOnError: false });\n  console.log(app.get(SignupService).mail.gui('sv@fpt.edu.vn'));\n  await app.close();\n} catch (e) { console.log('✗', (e as Error).message); }\nconsole.log('các phương thức tĩnh được sinh:', Object.getOwnPropertyNames(ConfigurableModuleClass).filter((k) => k.startsWith('for')));";
const OUT_BDU = "gửi sv@fpt.edu.vn qua mail.lab:2525 từ no-reply@lab.fpt\ncác phương thức tĩnh được sinh: [ 'forRoot', 'forRootAsync' ]";
const OUT_BTHIEU = "✗ thiếu SMTP_HOST/SMTP_PORT — từ chối khởi động\ncác phương thức tĩnh được sinh: [ 'forRoot', 'forRootAsync' ]";
const MA_BT = "import 'reflect-metadata';\nimport { Inject, Injectable, Module, type DynamicModule } from '@nestjs/common';\nimport { NestFactory } from '@nestjs/core';\n\n// forRoot: cấu hình CHUNG, đăng ký một lần ở AppModule, global\n// forFeature: mỗi module tính năng xin một \"kho con\" theo tên — giống TypeOrmModule.forFeature([Entity])\nconst GOC = Symbol('STORAGE_GOC');\nexport const tokenKho = (ten: string) => `KHO_${ten}`;\n\nclass Kho { constructor(readonly duong: string, readonly toiDaMB: number) {} }\n\n@Module({})\nexport class StorageModule {\n  static forRoot(o: { goc: string; toiDaMB: number }): DynamicModule {\n    return { module: StorageModule, global: true, providers: [{ provide: GOC, useValue: o }], exports: [GOC] };\n  }\n  static forFeature(ten: string): DynamicModule {\n    const p = { provide: tokenKho(ten), useFactory: (g: { goc: string; toiDaMB: number }) => new Kho(`${g.goc}/${ten}`, g.toiDaMB), inject: [GOC] };\n    return { module: StorageModule, providers: [p], exports: [p] };\n  }\n}\n\n@Injectable() class AvatarService { constructor(@Inject(tokenKho('avatar')) readonly kho: Kho) {} }\n@Module({ imports: [StorageModule.forFeature('avatar')], providers: [AvatarService] }) class AvatarModule {}\n@Injectable() class ReportService { constructor(@Inject(tokenKho('bao-cao')) readonly kho: Kho) {} }\n@Module({ imports: [StorageModule.forFeature('bao-cao')], providers: [ReportService] }) class ReportModule {}\n\n@Module({ imports: [StorageModule.forRoot({ goc: '/data', toiDaMB: 20 }), AvatarModule, ReportModule] }) class AppModule {}\nconst app = await NestFactory.createApplicationContext(AppModule, { logger: false });\nconsole.log('avatar  →', app.get(AvatarService).kho);\nconsole.log('bao-cao →', app.get(ReportService).kho);\nawait app.close();";
const OUT_BT = "avatar  → Kho { duong: '/data/avatar', toiDaMB: 20 }\nbao-cao → Kho { duong: '/data/bao-cao', toiDaMB: 20 }";

export default {
  title: '2.5 — Dynamic modules: forRoot, forFeature, register and ConfigurableModuleBuilder|||2.5 — Dynamic module: forRoot, forFeature, register và ConfigurableModuleBuilder',
  slug: 'nst-2-5-dynamic-module',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Vì sao ConfigModule.forRoot() nhận tham số: một DynamicModule chỉ là object { module, providers, exports } do hàm tĩnh trả về. Tự viết StorageModule.register (hai module tính năng, hai cấu hình, hai service), rồi để ConfigurableModuleBuilder sinh forRoot + forRootAsync có isGlobal; forRootAsync với useFactory + inject từ chối khởi động khi thiếu biến môi trường. Quy ước register / forRoot / forFeature để đọc được mọi thư viện Nest.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.5</span>
<h2>2.5 — A module that takes arguments</h2>
<p class="lead">You will write <code>ConfigModule.forRoot()</code>, <code>TypeOrmModule.forFeature([Room])</code>, <code>JwtModule.registerAsync({…})</code> long before you write your own. They look like magic until you see that each is a static method returning a plain object. Build one by hand, then let Nest generate one, and every library's setup line becomes readable.</p>

<h3>Experiment 1 — <code>register</code> by hand</h3>
<pre><code class="language-ts">${esc(MA_TAY)}</code></pre>
<div class="out">${esc(OUT_TAY)}</div>
<p>The last line is the whole secret: <code>{ module, providers, exports }</code> — the same fields as <code>@Module</code>, computed at runtime from your options. Nest merges it with the static <code>@Module({})</code> metadata. Because Avatar and Report call <code>register</code> with different options, Nest treats them as two different modules and builds two <code>StorageService</code>s, each with its own limit. The options travel as a <code>useValue</code> provider under a symbol token — lesson 2.2's recipe ②/③.</p>

<h3>Naming conventions (read any library with this)</h3>
<pre><code>${esc(BANG)}</code></pre>

<h3>Experiment 2 — let <code>ConfigurableModuleBuilder</code> write it</h3>
<pre><code class="language-ts">${esc(MA_BU)}</code></pre>
<p>With both variables set:</p>
<div class="out">${esc(OUT_BDU)}</div>
<p>Without them:</p>
<div class="out">${esc(OUT_BTHIEU)}</div>
<ul>
<li>The builder generated <code>forRoot</code> and <code>forRootAsync</code> plus <code>MODULE_OPTIONS_TOKEN</code>; you wrote zero static methods.</li>
<li><code>forRootAsync</code> takes the same shape as <code>useFactory</code> (lesson 2.2) plus <code>imports</code> — the modules whose exports the factory may inject. That is how <code>JwtModule.registerAsync({ inject: [ConfigService] })</code> works.</li>
<li><code>setExtras({ isGlobal })</code> adds an option that is not part of <code>MailOptions</code> and changes the module definition itself — <code>SignupModule</code> never imported MailModule.</li>
<li>The factory threw ⇒ the application refused to start. A missing SMTP host found at deploy time beats a "password reset email never arrives" ticket two days later. Chapter 5 does this properly with a validated schema.</li>
</ul>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok">
<p>Give <code>StorageModule</code> the <code>forRoot</code> + <code>forFeature</code> pair: <code>forRoot({ goc: '/data', toiDaMB: 20 })</code> once in AppModule (global), and <code>forFeature('avatar')</code> in a feature module provides a "store" at <code>/data/avatar</code> under its own token.</p>
<details><summary>Show the answer</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p>forRoot exports only the root options (global); each forFeature builds a provider from them with a name-derived token. This is the shape of <code>TypeOrmModule</code>: one connection, one repository token per entity.</p>
</details>
</div>

<h3>💼 On the job</h3>
<p>At a company, a home-made dynamic module is usually "the team's shared module": an internal-service client, a mail module, an S3 storage module, packaged as a monorepo library (Chapter 5) used by several services. Its author needs this whole lesson; its users only need to read the <code>forRootAsync</code> line in <code>AppModule</code> and know which factory a startup error came from.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">DynamicModule</span><span class="v">Object <code>{ module, providers, exports, imports, global }</code> returned by a static method.</span></div>
  <div class="kv"><span class="k">forRoot / forFeature</span><span class="v">Configure once at the root / ask for a feature's share.</span></div>
  <div class="kv"><span class="k">…Async</span><span class="v">Options computed by a factory that can inject other providers.</span></div>
  <div class="kv"><span class="k">MODULE_OPTIONS_TOKEN</span><span class="v">Token the builder generates for the options object.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A dynamic module is a static method returning the same fields as <code>@Module</code>.</li>
<li><code>register</code>: per-import config; <code>forRoot</code>: once, often global; <code>forFeature</code>: a feature's slice.</li>
<li><code>ConfigurableModuleBuilder</code> generates the methods, the async variant and the options token.</li>
<li>Throw in the options factory to refuse to start on bad config.</li>
</ul>
${THE}
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.5</span>
<h2>2.5 — Module nhận tham số</h2>
<p class="lead">Bạn sẽ viết <code>ConfigModule.forRoot()</code>, <code>TypeOrmModule.forFeature([Room])</code>, <code>JwtModule.registerAsync({…})</code> từ lâu trước khi tự viết một cái. Chúng trông như phép màu cho tới khi bạn thấy mỗi cái chỉ là một phương thức tĩnh trả về một object thường. Tự dựng một cái bằng tay, rồi để Nest sinh một cái, và dòng cài đặt của mọi thư viện sẽ đọc được.</p>

<h3>Thí nghiệm 1 — <code>register</code> viết tay</h3>
<pre><code class="language-ts">${esc(MA_TAY)}</code></pre>
<div class="out">${esc(OUT_TAY)}</div>
<p>Dòng cuối là toàn bộ bí mật: <code>{ module, providers, exports }</code> — đúng các trường của <code>@Module</code>, nhưng tính lúc chạy từ tuỳ chọn của bạn. Nest gộp nó với metadata tĩnh <code>@Module({})</code>. Vì Avatar và Report gọi <code>register</code> với tuỳ chọn khác nhau, Nest coi đó là hai module khác nhau và tạo hai <code>StorageService</code>, mỗi cái một giới hạn riêng. Tuỳ chọn đi vào dưới dạng provider <code>useValue</code> với token symbol — đúng công thức ②/③ của bài 2.2.</p>

<h3>Quy ước đặt tên (đọc thư viện nào cũng dùng được)</h3>
<pre><code>${esc(BANG)}</code></pre>

<h3>Thí nghiệm 2 — để <code>ConfigurableModuleBuilder</code> viết giúp</h3>
<pre><code class="language-ts">${esc(MA_BU)}</code></pre>
<p>Đủ cả hai biến:</p>
<div class="out">${esc(OUT_BDU)}</div>
<p>Thiếu biến:</p>
<div class="out">${esc(OUT_BTHIEU)}</div>
<ul>
<li>Builder sinh sẵn <code>forRoot</code> và <code>forRootAsync</code> cùng <code>MODULE_OPTIONS_TOKEN</code>; bạn không viết phương thức tĩnh nào.</li>
<li><code>forRootAsync</code> nhận đúng dáng của <code>useFactory</code> (bài 2.2) cộng thêm <code>imports</code> — các module mà factory được tiêm thứ chúng export. <code>JwtModule.registerAsync({ inject: [ConfigService] })</code> chạy đúng như vậy.</li>
<li><code>setExtras({ isGlobal })</code> thêm một tuỳ chọn không thuộc <code>MailOptions</code>, và nó đổi chính định nghĩa module — <code>SignupModule</code> chưa từng import MailModule.</li>
<li>Factory ném lỗi ⇒ ứng dụng từ chối khởi động. Phát hiện thiếu máy chủ SMTP ngay lúc triển khai tốt hơn nhiều so với phiếu báo lỗi "thư đặt lại mật khẩu không bao giờ tới" hai ngày sau. Chương 5 làm việc này đúng cách với một schema có kiểm.</li>
</ul>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p>Cho <code>StorageModule</code> cặp <code>forRoot</code> + <code>forFeature</code>: <code>forRoot({ goc: '/data', toiDaMB: 20 })</code> một lần ở AppModule (global), còn <code>forFeature('avatar')</code> trong một module tính năng cung cấp một "kho" ở <code>/data/avatar</code> dưới token riêng.</p>
<details><summary>Xem đáp án</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p>forRoot chỉ export tuỳ chọn gốc (global); mỗi forFeature dựng một provider từ đó với token suy ra từ tên. Đây đúng là dáng của <code>TypeOrmModule</code>: một kết nối, mỗi entity một token repository.</p>
</details>
</div>

<h3>💼 Đi làm thật</h3>
<p>Ở công ty, dynamic module tự viết thường là "module dùng chung của nhóm": client gọi dịch vụ nội bộ, module gửi thư, module lưu tệp lên S3, đóng gói thành thư viện trong monorepo (Chương 5) để nhiều dịch vụ cùng dùng. Người viết nó cần đúng bài này; người dùng nó chỉ cần đọc được dòng <code>forRootAsync</code> trong <code>AppModule</code> và biết lỗi khởi động đến từ factory nào.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">DynamicModule</span><span class="v">Object <code>{ module, providers, exports, imports, global }</code> do một phương thức tĩnh trả về.</span></div>
  <div class="kv"><span class="k">forRoot / forFeature</span><span class="v">Cấu hình một lần ở gốc / module tính năng xin phần của mình.</span></div>
  <div class="kv"><span class="k">…Async</span><span class="v">Tuỳ chọn tính bởi một factory, được tiêm provider khác.</span></div>
  <div class="kv"><span class="k">MODULE_OPTIONS_TOKEN</span><span class="v">Token builder sinh ra cho object tuỳ chọn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Dynamic module là phương thức tĩnh trả về đúng các trường của <code>@Module</code>.</li>
<li><code>register</code>: mỗi lần import một cấu hình; <code>forRoot</code>: một lần, thường global; <code>forFeature</code>: phần của một tính năng.</li>
<li><code>ConfigurableModuleBuilder</code> sinh phương thức, bản bất đồng bộ và token tuỳ chọn.</li>
<li>Ném lỗi trong factory tuỳ chọn để từ chối khởi động khi cấu hình sai.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
