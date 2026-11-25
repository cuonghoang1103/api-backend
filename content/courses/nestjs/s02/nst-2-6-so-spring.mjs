/**
 * 2.6 — Nest và Spring IoC: bảng dịch (khoá nestjs, soạn 24/11/2026).
 * Output THẬT: Spring Framework 7.0.9 (spring-context jar trần từ ~/.m2, không Boot) trên OpenJDK 25.0.3, máy nhà —
 * scratchpad/nst/lab/c2/spring/src/SoSanh.java (cùng thí nghiệm 2.2: interface + @Bean, @Qualifier, Optional, prototype,
 * @PostConstruct/@PreDestroy, vòng qua constructor ⇒ BeanCurrentlyInCreationException, thiếu bean ⇒ NoSuchBeanDefinitionException;
 * đã lược 2 dòng tiêu đề cảnh báo JUL "Nov 24, 2026 … refresh"). Phía Nest: lab/c2/app/src/b26/vong.ts (CircularDependencyException) + output 2.2.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'spring-boot', bai: 'sb-3-1-ioc-container', title: 'Spring Boot 3.1 — IoC container và bean', sub: 'ApplicationContext, bean, quét component.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'spring-boot', bai: 'sb-3-3-stereotype', title: 'Spring Boot 3.3 — @Configuration và @Bean', sub: 'Phía Java của useFactory.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'spring-boot', bai: 'sb-3-4-bean-lifecycle', title: 'Spring Boot 3.4 — Vòng đời bean và scope', sub: 'Phía Java của bài 2.4.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'Spring Framework Reference — The IoC Container', 'Bean, scope, @Bean, @Qualifier, vòng phụ thuộc qua constructor.', 'https://docs.spring.io/spring-framework/reference/core/beans.html'),
  nguon('📘', 'Spring Boot 2.6 Release Notes — Circular References Prohibited by Default', 'Từ Boot 2.6 (11/2021) vòng phụ thuộc bị cấm mặc định.', 'https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.6-Release-Notes'),
  nguon('📘', 'NestJS Docs — Custom providers', 'Phía Nest của bảng dịch.', 'https://docs.nestjs.com/fundamentals/custom-providers'),
].join('\n');
const MA_JAVA = "import jakarta.annotation.PostConstruct;\nimport jakarta.annotation.PreDestroy;\nimport java.util.*;\nimport org.springframework.beans.factory.annotation.Qualifier;\nimport org.springframework.context.annotation.*;\nimport org.springframework.stereotype.Service;\n\npublic class SoSanh {\n  // ≈ abstract class PaymentGateway của Nest — ở Java dùng interface, vì Java giữ kiểu lúc chạy\n  interface PaymentGateway { String charge(long vnd); }\n  static class VnpayGateway implements PaymentGateway {\n    public String charge(long vnd) { return \"VNPAY đã trừ \" + vnd + \"đ\"; }\n  }\n  record CauHinh(long phiDichVu) {}\n\n  @Service static class CheckoutService {\n    private final PaymentGateway gw; private final CauHinh cfg; private final Optional<String> km;\n    CheckoutService(PaymentGateway gw, @Qualifier(\"cauHinh\") CauHinh cfg, Optional<String> km) {  // ≈ @Inject(token), @Optional\n      this.gw = gw; this.cfg = cfg; this.km = km;\n      System.out.println(\"  tạo CheckoutService\");\n    }\n    String thanhToan(long vnd) { return gw.charge(vnd + cfg.phiDichVu()) + \", khuyến mãi: \" + km.orElse(\"không có\"); }\n    @PostConstruct void init() { System.out.println(\"  @PostConstruct ≈ onModuleInit\"); }\n    @PreDestroy void huy() { System.out.println(\"  @PreDestroy ≈ onModuleDestroy\"); }\n  }\n\n  @Configuration @ComponentScan(basePackageClasses = SoSanh.class, useDefaultFilters = false,\n      includeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = CheckoutService.class))\n  static class AppConfig {                                               // ≈ @Module\n    @Bean PaymentGateway gateway() { return new VnpayGateway(); }        // ≈ { provide: PaymentGateway, useClass }\n    @Bean CauHinh cauHinh() { return new CauHinh(2000); }                // ≈ useValue + token\n    @Bean @Scope(\"prototype\") StringBuilder nhap() { return new StringBuilder(); }  // ≈ Scope.TRANSIENT\n  }\n\n  // vòng phụ thuộc qua constructor\n  @Service static class A { A(B b) {} }\n  @Service static class B { B(A a) {} }\n  @Configuration @Import({A.class, B.class}) static class VongConfig {}\n\n  // thiếu bean\n  @Service static class NotifyService { NotifyService(Runnable mailer) {} }\n\n  public static void main(String[] a) {\n    System.out.println(\"## Spring 7.0.9 — cùng thí nghiệm 2.2\");\n    var ctx = new AnnotationConfigApplicationContext(AppConfig.class);\n    System.out.println(\"  \" + ctx.getBean(CheckoutService.class).thanhToan(150_000));\n    System.out.println(\"  singleton: \" + (ctx.getBean(CheckoutService.class) == ctx.getBean(CheckoutService.class))\n        + \" | prototype: \" + (ctx.getBean(\"nhap\") == ctx.getBean(\"nhap\")));\n    ctx.close();\n    for (Class<?> c : List.of(VongConfig.class, NotifyService.class)) {\n      System.out.println(\"## \" + c.getSimpleName());\n      try { new AnnotationConfigApplicationContext(c); }\n      catch (Exception e) { Throwable r = e; while (r.getCause() != null) r = r.getCause();\n        System.out.println(\"  ✗ \" + e.getClass().getSimpleName() + \"\\n    gốc: \" + r.getClass().getSimpleName() + \": \" + r.getMessage().lines().findFirst().orElse(\"\")); }\n    }\n  }\n}";
const OUT_JAVA = "## Spring 7.0.9 — cùng thí nghiệm 2.2\n  tạo CheckoutService\n  @PostConstruct ≈ onModuleInit\n  VNPAY đã trừ 152000đ, khuyến mãi: không có\n  singleton: true | prototype: false\n  @PreDestroy ≈ onModuleDestroy\n## VongConfig\n  ✗ UnsatisfiedDependencyException\n    gốc: BeanCurrentlyInCreationException: Error creating bean with name 'SoSanh$A': Requested bean is currently in creation: Is there an unresolvable circular reference or an asynchronous initialization dependency?\n## NotifyService\n  ✗ UnsatisfiedDependencyException\n    gốc: NoSuchBeanDefinitionException: No qualifying bean of type 'java.lang.Runnable' available: expected at least 1 bean which qualifies as autowire candidate. Dependency annotations: {}";
const MA_NVONG = "import 'reflect-metadata';\nimport { Inject, Injectable, Module } from '@nestjs/common';\nimport { NestFactory } from '@nestjs/core';\n@Injectable() class A { constructor(@Inject('B') readonly b: unknown) {} }\n@Injectable() class B { constructor(@Inject('A') readonly a: unknown) {} }\n@Module({ providers: [{ provide: 'A', useClass: A }, { provide: 'B', useClass: B }] }) class M {}\nawait NestFactory.createApplicationContext(M, { logger: false, abortOnError: false })\n  .then(() => console.log('chạy được'), (e) => console.log(e.constructor.name + ': ' + String(e.message).split('\\n').slice(0, 3).join('\\n')));";
const OUT_NVONG = "CircularDependencyException: A circular dependency has been detected inside \"A\". Please, make sure that each side of a bidirectional relationships are decorated with \"forwardRef()\". Note that circular relationships between custom providers (e.g., factories) are not supported since functions cannot be called more than once.";
const OUT_NEST22 = "  [factory] đã kết nối postgres://lab/booking sau 300 ms\n{\n  gw: 'VNPAY đã trừ 152.000₫',\n  luc: '2026-11-24T08:00:00.000Z',\n  db: 'rows(INSERT payment)',\n  aliasCungMotBan: true,\n  khuyenMai: 'không có (@Optional ⇒ undefined)'\n}\ngateway thực là: VnpayGateway";

const DICH = (en) => `<table>
<thead><tr><th>${en ? 'Idea' : 'Ý tưởng'}</th><th>NestJS</th><th>Spring</th><th>${en ? 'Note' : 'Ghi chú'}</th></tr></thead>
<tbody>
<tr><td>${en ? 'container' : 'container'}</td><td><code>NestFactory.create(AppModule)</code></td><td><code>ApplicationContext</code></td><td>${en ? 'both build the graph at startup and fail fast' : 'cả hai dựng đồ thị lúc khởi động và lỗi sớm'}</td></tr>
<tr><td>${en ? 'unit of configuration' : 'đơn vị cấu hình'}</td><td><code>@Module</code></td><td><code>@Configuration</code></td><td>${en ? 'Nest modules are also visibility walls; Spring configs are not' : 'module Nest còn là bức tường nhìn thấy; @Configuration thì không'}</td></tr>
<tr><td>${en ? 'a managed class' : 'class được quản lý'}</td><td><code>@Injectable()</code> + ${en ? 'listed in' : 'khai trong'} <code>providers</code></td><td><code>@Component</code>/<code>@Service</code>/<code>@Repository</code></td><td>${en ? 'Spring finds them by classpath scanning; Nest only knows what you list' : 'Spring tự quét classpath; Nest chỉ biết thứ bạn liệt kê'}</td></tr>
<tr><td>${en ? 'factory' : 'factory'}</td><td><code>useFactory</code> + <code>inject</code></td><td>${en ? 'a' : 'phương thức'} <code>@Bean</code> ${en ? 'method' : ''}</td><td>${en ? 'parameters of a @Bean method are injected like inject: […]' : 'tham số của phương thức @Bean được tiêm như inject: […]'}</td></tr>
<tr><td>${en ? 'a ready value' : 'giá trị có sẵn'}</td><td><code>useValue</code></td><td><code>@Bean</code> ${en ? 'returning a constant' : 'trả hằng'}, <code>@Value</code></td><td></td></tr>
<tr><td>${en ? 'choose among several' : 'chọn trong nhiều bản'}</td><td>${en ? 'string/symbol token' : 'token chuỗi/symbol'} + <code>@Inject(TOKEN)</code></td><td><code>@Qualifier("ten")</code>, <code>@Primary</code></td><td>${en ? 'Java keeps interface types at runtime; TypeScript erases them' : 'Java giữ kiểu interface lúc chạy; TypeScript xoá nó'}</td></tr>
<tr><td>${en ? 'contract as token' : 'hợp đồng làm token'}</td><td>abstract class</td><td>interface</td><td>${en ? 'the single biggest translation difference' : 'khác biệt dịch quan trọng nhất'}</td></tr>
<tr><td>${en ? 'optional dependency' : 'phụ thuộc tuỳ chọn'}</td><td><code>@Optional()</code></td><td><code>Optional&lt;T&gt;</code>, <code>ObjectProvider</code></td><td></td></tr>
<tr><td>alias</td><td><code>useExisting</code></td><td><code>@Bean(name = {"a", "b"})</code>, <code>@AliasFor</code></td><td></td></tr>
<tr><td>scope</td><td>DEFAULT / REQUEST / TRANSIENT</td><td>singleton / request / prototype</td><td>${en ? 'Spring injects a scoped proxy into singletons; Nest rebuilds the chain (lesson 2.4)' : 'Spring tiêm scoped proxy vào singleton; Nest tạo lại cả chuỗi (bài 2.4)'}</td></tr>
<tr><td>${en ? 'init / destroy' : 'khởi tạo / huỷ'}</td><td><code>onModuleInit</code> / <code>onModuleDestroy</code></td><td><code>@PostConstruct</code> / <code>@PreDestroy</code></td><td>${en ? 'Nest hooks may be async and are awaited' : 'hook Nest được phép bất đồng bộ và được chờ'}</td></tr>
<tr><td>${en ? 'configurable module' : 'module có cấu hình'}</td><td><code>forRoot</code>/<code>forRootAsync</code></td><td>auto-configuration + <code>@ConfigurationProperties</code></td><td>${en ? 'Boot reacts to what is on the classpath; Nest does nothing you did not import' : 'Boot phản ứng theo thứ có trên classpath; Nest không làm gì bạn không import'}</td></tr>
<tr><td>${en ? 'test override' : 'thay khi test'}</td><td><code>overrideProvider</code></td><td><code>@MockitoBean</code>, <code>@TestConfiguration</code></td><td></td></tr>
<tr><td>${en ? 'cycle' : 'vòng'}</td><td><code>forwardRef</code> (${en ? 'discouraged' : 'không khuyến khích'})</td><td>${en ? 'forbidden by default since Boot 2.6' : 'cấm mặc định từ Boot 2.6'}; <code>@Lazy</code></td><td>${en ? 'both say: fix the design' : 'cả hai cùng nói: sửa thiết kế'}</td></tr>
</tbody>
</table>`;

export default {
  title: '2.6 — Nest vs Spring IoC: a translation table for Java developers|||2.6 — Nest và Spring IoC: bảng dịch cho người biết Java',
  slug: 'nst-2-6-so-spring',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Cùng thí nghiệm thanh toán của bài 2.2 viết lại bằng Spring Framework 7.0.9 và chạy thật trên JDK 25: interface + @Bean, @Qualifier, Optional, prototype, @PostConstruct/@PreDestroy, rồi hai lỗi khởi động đặt cạnh lỗi tương ứng của Nest (vòng phụ thuộc, thiếu bean). Bảng dịch 14 dòng Nest ↔ Spring, ba khác biệt thật sự (quét classpath, module là bức tường, interface bị xoá), và câu "DI là gì" trong phỏng vấn trả lời cho cả hai phía.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.6</span>
<h2>2.6 — Same ideas, two dialects</h2>
<p class="lead">You are learning Spring Boot and NestJS in the same year, and OJT interviews often ask both. Good news: the container idea is identical — Nest borrowed it from Angular, which borrowed it from the Java world. This lesson runs the exact checkout experiment of lesson 2.2 in plain Spring (no Boot), puts the errors side by side, and gives you a translation table to keep.</p>

<h3>The Spring version of lesson 2.2</h3>
<pre><code class="language-java">${esc(MA_JAVA)}</code></pre>
<div class="out">${esc(OUT_JAVA)}</div>
<p>The Nest output of lesson 2.2, for comparison:</p>
<div class="out">${esc(OUT_NEST22)}</div>

<h3>Same cycle, two messages</h3>
<p>Nest's own cycle detection (string tokens, so ESM metadata does not crash first):</p>
<pre><code class="language-ts">${esc(MA_NVONG)}</code></pre>
<div class="out">${esc(OUT_NVONG)}</div>
<p>Spring said <code>BeanCurrentlyInCreationException … currently in creation</code> — the same "still in the path" check you wrote in lesson 2.1, step ⑦. Spring Boot has forbidden such cycles by default since 2.6 (November 2021); Nest allows them only through <code>forwardRef</code>. Both teams are telling you the same thing.</p>

<h3>The translation table</h3>
${DICH(true)}

<h3>Three differences that actually matter</h3>
<ol>
<li><strong>Scanning versus listing.</strong> Spring finds <code>@Service</code> classes on the classpath (our example had to <em>limit</em> scanning with a filter). Nest only knows providers you list in a module. Nest startup errors are therefore about "not listed / not exported"; Spring's about "two candidates, no qualifier".</li>
<li><strong>Modules are walls.</strong> A Spring bean is visible to the whole context. A Nest provider is private to its module unless exported (lesson 2.3) — closer to Java modules (<code>module-info.java</code>) than to <code>@Configuration</code>.</li>
<li><strong>Types at runtime.</strong> Java keeps interfaces, generics aside, so <code>PaymentGateway</code> as an interface is a perfectly good lookup key. TypeScript erases interfaces, so Nest uses abstract classes or tokens. Translate "<code>interface</code> + <code>@Qualifier</code>" into "abstract class or <code>@Inject(TOKEN)</code>".</li>
</ol>

<h3>🎤 Interview: "What is dependency injection?"</h3>
<div class="callout ok">
<p>Try a 60-second answer before opening.</p>
<details><summary>A model answer</summary>
<p>"A class receives what it depends on instead of creating it — usually through its constructor. It makes the class testable, because a test can pass fakes, and it moves the wiring to one place: the container. In Spring that is the ApplicationContext, which finds beans by scanning and builds them at startup; in Nest it is the module tree, where I list providers and export what other modules may use. Both build singletons by default, fail at startup when something is missing, and treat circular dependencies as a design smell. The main difference I hit in Nest is that TypeScript interfaces disappear at runtime, so I use an abstract class or a token where Java would use an interface."</p>
</details>
</div>

<h3>💼 On the job</h3>
<p>Many projects at FPT Software and other outsourcing companies have both sides: the client's core services in Spring Boot plus a BFF or side service in NestJS. The person who can read both containers — who knows that a <code>@Qualifier</code> here is a token there — is the one pulled in to fix integration bugs. Keep the table above in your own notes.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">bean</span><span class="v">Spring's word for a provider instance.</span></div>
  <div class="kv"><span class="k">@Qualifier</span><span class="v">Picks one bean among several of the same type ≈ Nest token.</span></div>
  <div class="kv"><span class="k">prototype</span><span class="v">Spring's transient.</span></div>
  <div class="kv"><span class="k">component scanning</span><span class="v">Spring finds managed classes on the classpath; Nest has no equivalent.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Same container model: constructor injection, singletons by default, fail fast.</li>
<li><code>@Module</code> ≈ <code>@Configuration</code> + a visibility wall; <code>useFactory</code> ≈ <code>@Bean</code>; token ≈ <code>@Qualifier</code>.</li>
<li>Java interface ⇒ Nest abstract class or token.</li>
<li>Both frameworks say the same about cycles: redesign.</li>
</ul>
${THE}
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.6</span>
<h2>2.6 — Cùng ý tưởng, hai phương ngữ</h2>
<p class="lead">Bạn học Spring Boot và NestJS trong cùng một năm, và phỏng vấn OJT hay hỏi cả hai. Tin vui: ý tưởng container giống hệt nhau — Nest mượn nó từ Angular, còn Angular mượn từ thế giới Java. Bài này chạy lại đúng thí nghiệm thanh toán của bài 2.2 bằng Spring thuần (không Boot), đặt các lỗi cạnh nhau, và cho bạn một bảng dịch để giữ bên mình.</p>

<h3>Bản Spring của bài 2.2</h3>
<pre><code class="language-java">${esc(MA_JAVA)}</code></pre>
<div class="out">${esc(OUT_JAVA)}</div>
<p>Output Nest của bài 2.2, để so:</p>
<div class="out">${esc(OUT_NEST22)}</div>

<h3>Cùng một vòng, hai thông báo</h3>
<p>Nest tự bắt vòng (dùng token chuỗi, để metadata ESM không sập trước):</p>
<pre><code class="language-ts">${esc(MA_NVONG)}</code></pre>
<div class="out">${esc(OUT_NVONG)}</div>
<p>Spring nói <code>BeanCurrentlyInCreationException … currently in creation</code> — chính phép kiểm "vẫn còn trong đường đi" bạn tự viết ở bài 2.1, bước ⑦. Spring Boot cấm vòng kiểu này theo mặc định từ bản 2.6 (tháng 11/2021); Nest chỉ cho qua bằng <code>forwardRef</code>. Hai đội phát triển đang nói với bạn cùng một điều.</p>

<h3>Bảng dịch</h3>
${DICH(false)}

<h3>Ba khác biệt thật sự quan trọng</h3>
<ol>
<li><strong>Quét hay liệt kê.</strong> Spring tự tìm class <code>@Service</code> trên classpath (ví dụ của ta còn phải <em>giới hạn</em> việc quét bằng bộ lọc). Nest chỉ biết provider bạn liệt kê trong module. Vì thế lỗi khởi động của Nest thường là "chưa khai / chưa export"; của Spring thường là "hai ứng viên, không có qualifier".</li>
<li><strong>Module là bức tường.</strong> Bean của Spring hiện với cả context. Provider của Nest là của riêng module trừ khi được export (bài 2.3) — gần với Java module (<code>module-info.java</code>) hơn là <code>@Configuration</code>.</li>
<li><strong>Kiểu lúc chạy.</strong> Java giữ interface (trừ tham số generic), nên interface <code>PaymentGateway</code> là khoá tra hoàn toàn hợp lệ. TypeScript xoá interface, nên Nest dùng abstract class hoặc token. Dịch "<code>interface</code> + <code>@Qualifier</code>" thành "abstract class hoặc <code>@Inject(TOKEN)</code>".</li>
</ol>

<h3>🎤 Phỏng vấn: "Dependency injection là gì?"</h3>
<div class="callout ok">
<p>Thử tự trả lời trong 60 giây trước khi mở.</p>
<details><summary>Một câu trả lời mẫu</summary>
<p>"Một class nhận thứ nó phụ thuộc thay vì tự tạo — thường qua constructor. Nhờ vậy class test được, vì test đưa bản giả vào, và việc nối các đối tượng dồn về một chỗ: container. Ở Spring đó là ApplicationContext, tự quét để tìm bean và tạo chúng lúc khởi động; ở Nest đó là cây module, nơi em liệt kê provider và export thứ module khác được dùng. Cả hai mặc định tạo singleton, báo lỗi ngay lúc khởi động nếu thiếu thứ gì, và coi phụ thuộc vòng là dấu hiệu thiết kế có vấn đề. Khác biệt chính em gặp ở Nest là interface của TypeScript biến mất lúc chạy, nên em dùng abstract class hoặc token ở chỗ Java dùng interface."</p>
</details>
</div>

<h3>💼 Đi làm thật</h3>
<p>Nhiều dự án ở FPT Software và các công ty outsourcing có cả hai phía: dịch vụ lõi Spring Boot của khách, cộng một lớp BFF hay dịch vụ phụ bằng NestJS. Người đọc được cả hai container — biết <code>@Qualifier</code> bên này là token bên kia — sẽ là người được kéo vào sửa lỗi tích hợp. Hãy giữ bảng dịch trên trong sổ tay cá nhân.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">bean</span><span class="v">Từ của Spring cho một bản provider.</span></div>
  <div class="kv"><span class="k">@Qualifier</span><span class="v">Chọn một bean trong nhiều bean cùng kiểu ≈ token của Nest.</span></div>
  <div class="kv"><span class="k">prototype</span><span class="v">Transient của Spring.</span></div>
  <div class="kv"><span class="k">quét component</span><span class="v">Spring tự tìm class được quản lý trên classpath; Nest không có tương đương.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Cùng mô hình container: tiêm qua constructor, mặc định singleton, lỗi sớm.</li>
<li><code>@Module</code> ≈ <code>@Configuration</code> + bức tường nhìn thấy; <code>useFactory</code> ≈ <code>@Bean</code>; token ≈ <code>@Qualifier</code>.</li>
<li>Interface của Java ⇒ abstract class hoặc token ở Nest.</li>
<li>Hai framework nói cùng một điều về vòng: thiết kế lại.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
