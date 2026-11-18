/**
 * spring-boot/s03-loi-spring.mjs — Chương 3: Lõi Spring, nhìn từ bên trong (soạn 18/11/2026, agent sb).
 * Mọi output là chạy thật: Spring Boot 4.1.2 / Spring Framework 7.0.10 trên Temurin 21.0.12.1, PostgreSQL 16 (container sb-c3-pg).
 * Mã demo: scratchpad/sb/lab/c3/core (ioc, di, cfg, life, scope, aop, aspect, jdk, prof), lab/c3/sms-starter + auto-app,
 * lab/c3/lab3/{starter,giai}; Java/Node thuần: ~/.rtq-sb/c3/w ; output: ~/.rtq-sb/c3/o.
 * Các hằng MA.. / OUT.. / YML.. sinh bằng scratchpad/sb/tam/s03/build.sh + gen-ma.mjs (chuỗi JSON).
 */
import { java, yml, xml, out, tl, giai } from './_chung.mjs';

// ===== Bài 3.1 =====
const MA31_MINI = java("/** A 50-line IoC container: registers classes, builds each one once, injects through the constructor. */\npublic class MiniContainer {\n    private final Map<Class<?>, Class<?>> definitions = new LinkedHashMap<>(); // type -> implementation\n    private final Map<Class<?>, Object> singletons = new HashMap<>();\n    private final Deque<Class<?>> creating = new ArrayDeque<>();                 // to detect cycles\n\n    void register(Class<?> impl) {\n        if (!impl.isAnnotationPresent(Component.class)) throw new IllegalArgumentException(impl + \" is not a @Component\");\n        definitions.put(impl, impl);\n        for (Class<?> itf : impl.getInterfaces()) definitions.put(itf, impl);   // look up by interface too\n    }\n\n    <T> T getBean(Class<T> type) {\n        Class<?> impl = definitions.get(type);\n        if (impl == null) throw new IllegalStateException(\"No bean of type \" + type.getSimpleName());\n        Object existing = singletons.get(impl);\n        if (existing != null) return type.cast(existing);\n        if (creating.contains(impl)) throw new IllegalStateException(\"Cycle: \" + creating + \" -> \" + impl.getSimpleName());\n        creating.push(impl);\n        try {\n            Constructor<?> ctor = impl.getDeclaredConstructors()[0];           // the one constructor\n            Object[] args = Arrays.stream(ctor.getParameterTypes()).map(this::getBean).toArray();\n            System.out.println(\"  new \" + impl.getSimpleName() + \"(\" + args.length + \" deps)\");\n            Object bean = ctor.newInstance(args);\n            singletons.put(impl, bean);\n            return type.cast(bean);\n        } catch (ReflectiveOperationException e) {\n            throw new IllegalStateException(e);\n        } finally {\n            creating.pop();\n        }\n    }\n\n    public static void main(String[] args) {\n        MiniContainer c = new MiniContainer();\n        for (Class<?> k : List.of(BookingController.class, BookingService.class, JdbcBookingRepo.class, SystemClock.class)) c.register(k);\n        System.out.println(\"getBean(BookingController):\");\n        BookingController ctl = c.getBean(BookingController.class);\n        System.out.println(ctl.book(\"Lab Mạng\"));\n        System.out.println(\"same service? \" + (c.getBean(BookingService.class) == ctl.service()));\n        c.register(Invoice.class); c.register(Payment.class);\n        try { c.getBean(Invoice.class); } catch (IllegalStateException e) { System.out.println(e.getMessage()); }\n    }\n}\n\n@Retention(RetentionPolicy.RUNTIME) @interface Component {}\ninterface BookingRepo { long save(String lab); }\ninterface TimeSource { String now(); }\n\n@Component class SystemClock implements TimeSource { public String now() { return \"2026-11-19T08:00\"; } }\n@Component class JdbcBookingRepo implements BookingRepo {\n    private long seq = 100;\n    public long save(String lab) { return ++seq; }\n}\n@Component class BookingService {\n    private final BookingRepo repo; private final TimeSource clock;\n    BookingService(BookingRepo repo, TimeSource clock) { this.repo = repo; this.clock = clock; }\n    String book(String lab) { return \"booking #\" + repo.save(lab) + \" for \" + lab + \" at \" + clock.now(); }\n}\n@Component record Invoice(Payment p) {}\n@Component record Payment(Invoice i) {}\n@Component record BookingController(BookingService service) {\n    String book(String lab) { return service.book(lab); }\n}");
const OUT31_MINI = out("$ java MiniContainer.java\ngetBean(BookingController):\n  new JdbcBookingRepo(0 deps)\n  new SystemClock(0 deps)\n  new BookingService(2 deps)\n  new BookingController(1 deps)\nbooking #101 for Lab Mạng at 2026-11-19T08:00\nsame service? true\nCycle: [class Payment, class Invoice] -> Invoice");
const MA31_BEANS = java("@Component\nclass SystemClock {\n    SystemClock() { System.out.println(\"   new SystemClock()\"); }\n    String now() { return \"2026-11-19T08:00\"; }\n}\n\n@Repository\nclass JdbcBookingRepo {\n    private final AtomicLong seq = new AtomicLong(100);\n    JdbcBookingRepo() { System.out.println(\"   new JdbcBookingRepo()\"); }\n    long save(String lab) { return seq.incrementAndGet(); }\n}\n\n@Service\nclass BookingService {\n    private final JdbcBookingRepo repo;\n    private final SystemClock clock;\n    BookingService(JdbcBookingRepo repo, SystemClock clock) {\n        System.out.println(\"   new BookingService(repo, clock)\");\n        this.repo = repo;\n        this.clock = clock;\n    }\n    String book(String lab) { return \"booking #\" + repo.save(lab) + \" for \" + lab + \" at \" + clock.now(); }\n}\n\n@Component\n@Lazy\nclass ReportGenerator {\n    ReportGenerator() { System.out.println(\"   new ReportGenerator()  <- only now, because @Lazy\"); }\n    void print() { System.out.println(\"   report printed\"); }\n}");
const MA31_APP = java("@SpringBootApplication\npublic class IocApp {\n    public static void main(String[] args) {\n        System.out.println(\"1) before SpringApplication.run\");\n        ConfigurableApplicationContext ctx = new SpringApplicationBuilder(IocApp.class)\n                .web(WebApplicationType.NONE).logStartupInfo(false).run(args);\n        System.out.println(\"2) context ready: \" + ctx.getClass().getSimpleName());\n\n        var factory = ctx.getBeanFactory();\n        String[] names = ctx.getBeanDefinitionNames();\n        System.out.println(\"   bean definitions: \" + names.length);\n        for (String name : new String[] {\"bookingService\", \"jdbcBookingRepo\", \"systemClock\", \"reportGenerator\"}) {\n            BeanDefinition bd = factory.getBeanDefinition(name);\n            System.out.printf(\"   %-16s scope=%-9s lazy=%-5s class=%s deps=%s%n\", name,\n                    bd.isSingleton() ? \"singleton\" : bd.getScope(), bd.isLazyInit(),\n                    bd.getBeanClassName().replace(\"com.cuongthai.c3.ioc.\", \"\"),\n                    Arrays.toString(factory.getDependenciesForBean(name)));\n        }\n        System.out.println(\"3) \" + ctx.getBean(BookingService.class).book(\"Lab Mạng\"));\n        System.out.println(\"   same instance? \" + (ctx.getBean(BookingService.class) == ctx.getBean(\"bookingService\")));\n        System.out.println(\"4) first getBean(ReportGenerator):\");\n        ctx.getBean(ReportGenerator.class).print();\n        ctx.close();\n    }\n}");
const OUT31_APP = out("$ java … com.cuongthai.c3.ioc.IocApp\n1) before SpringApplication.run\n   new JdbcBookingRepo()\n   new SystemClock()\n   new BookingService(repo, clock)\n2) context ready: AnnotationConfigApplicationContext\n   bean definitions: 122\n   bookingService   scope=singleton lazy=false class=BookingService deps=[jdbcBookingRepo, systemClock]\n   jdbcBookingRepo  scope=singleton lazy=false class=JdbcBookingRepo deps=[]\n   systemClock      scope=singleton lazy=false class=SystemClock deps=[]\n   reportGenerator  scope=singleton lazy=true  class=ReportGenerator deps=[]\n3) booking #101 for Lab Mạng at 2026-11-19T08:00\n   same instance? true\n4) first getBean(ReportGenerator):\n   new ReportGenerator()  <- only now, because @Lazy\n   report printed");

const L31_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>The IoC container and beans</h2>
<p class="lead">Until now every Spring Boot app in this course "just worked": you wrote a class with <code>@Service</code>, asked for it in a constructor, and it arrived. This chapter opens the box. We start by writing a working IoC container ourselves in about 50 lines of plain Java, run it, and then look at what Spring's real container — the <code>ApplicationContext</code> — keeps about every bean: its definition, its scope, its dependencies, and the moment it is created. After this lesson the phrase "Spring manages the bean" will mean something concrete.</p>

<h3>The problem: who calls <code>new</code>?</h3>
<p>A booking service needs a repository and a clock; a controller needs the service. Without a container, somebody has to write <code>new JdbcBookingRepo()</code>, <code>new SystemClock()</code>, <code>new BookingService(repo, clock)</code>, <code>new BookingController(service)</code> — in the right order, exactly once each, and again differently in every test. In a real LabFlow there are dozens of these objects plus the ones Spring Boot itself needs (a connection pool, a JSON mapper, a transaction manager, the web server…). <strong>Inversion of Control</strong> means your classes stop creating their collaborators; they only <em>declare</em> what they need, and a container builds the whole object graph. Martin Fowler's 2004 article named the main technique <strong>dependency injection</strong>; the folk name is the Hollywood principle — "don't call us, we'll call you".</p>

<h3>A 50-line container, running</h3>
<p>The smallest useful container needs three things: a list of <em>definitions</em> (which classes it may build, looked up by class or interface), a <em>cache</em> of already-built singletons, and a recursive <code>getBean</code> that builds constructor arguments first. We also keep a stack of "currently creating" classes, to notice cycles.</p>
${MA31_MINI}
${OUT31_MINI}
<ul>
  <li><strong>Order comes from the graph, not from you.</strong> We asked for the controller; the container walked its constructor, found it needs <code>BookingService</code>, which needs a <code>BookingRepo</code> and a <code>TimeSource</code> — so the repository and the clock were built first. That is a depth-first walk of the dependency graph.</li>
  <li><strong>Interfaces decouple.</strong> <code>BookingService</code> asks for <code>BookingRepo</code>, not <code>JdbcBookingRepo</code>. Swapping in a fake for tests means registering a different class — no edit to the service.</li>
  <li><strong>Singletons by default.</strong> The second <code>getBean(BookingService.class)</code> returned the same object (<code>same service? true</code>). One instance per container is also Spring's default.</li>
  <li><strong>Cycles are detected, not solved.</strong> <code>Invoice</code> needs <code>Payment</code> which needs <code>Invoice</code>: with constructor injection there is no order that works, so the container must refuse. Spring Boot refuses too (lesson 3.2).</li>
</ul>

<h3>What a real container adds</h3>
<p>Our toy proves the core idea. Spring's container is the same idea plus fifteen years of production needs:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">BeanDefinition</span><span class="v">A recipe, not an object: class name, scope, lazy or eager, init/destroy methods, dependencies, where it was declared. Spring reads all recipes first and only then creates objects.</span></div>
  <div class="kv"><span class="k">Component scanning</span><span class="v">Instead of a hand-written <code>register(...)</code> list, Spring scans the package of your <code>@SpringBootApplication</code> class (and sub-packages) for <code>@Component</code> and friends (lesson 3.3).</span></div>
  <div class="kv"><span class="k">Scopes</span><span class="v">singleton (default), prototype (new each time), request, session… (lesson 3.4).</span></div>
  <div class="kv"><span class="k">Lifecycle callbacks</span><span class="v"><code>@PostConstruct</code>, <code>@PreDestroy</code>, <code>SmartLifecycle</code> — open a pool after injection, close it on shutdown (lesson 3.4).</span></div>
  <div class="kv"><span class="k">BeanPostProcessor</span><span class="v">Hooks that may replace a bean by a <strong>proxy</strong> — this is how <code>@Transactional</code>, <code>@Async</code> and method security work (lesson 3.5).</span></div>
  <div class="kv"><span class="k">Conditions and environment</span><span class="v">Create a bean only if a class is on the classpath, a property is set, or a profile is active — the engine of auto-configuration (lessons 3.6–3.7).</span></div>
</div>

<h3>Looking inside Spring Boot's ApplicationContext</h3>
<p>Four small beans — the same shape as our toy, now with Spring annotations. Every constructor prints a line, so we can see <em>when</em> each object is created. <code>ReportGenerator</code> is marked <code>@Lazy</code>.</p>
${MA31_BEANS}
<p>The main class starts Spring without a web server, then asks the context about its recipes:</p>
${MA31_APP}
${OUT31_APP}
<ul>
  <li><strong>Eager singletons.</strong> The three constructors ran <em>inside</em> <code>SpringApplication.run</code>, before line 2 — an <code>ApplicationContext</code> creates every non-lazy singleton during startup. That is deliberate: a missing dependency or a bad configuration crashes the app at deploy time, not on the first customer request at 2 a.m.</li>
  <li><strong>@Lazy</strong> postpones creation to the first <code>getBean</code> (or first use through a proxy). Useful for an expensive bean that is rarely needed; harmful if it hides a startup error until later.</li>
  <li><strong>122 definitions</strong> for 4 classes of ours: the rest are Spring infrastructure and auto-configured beans — a <code>dataSource</code> (HikariCP), <code>jdbcTemplate</code>, <code>transactionManager</code>, the property binder… Lesson 3.6 shows where each one comes from.</li>
  <li><strong>The context knows the graph.</strong> <code>getDependenciesForBean("bookingService")</code> returned <code>[jdbcBookingRepo, systemClock]</code> — Spring recorded the edges while injecting. Bean names are the class name with a lower-case first letter.</li>
  <li><strong>Same instance</strong> whether you ask by type or by name: one <code>BookingService</code> per context.</li>
</ul>

<h3>BeanFactory vs ApplicationContext</h3>
<p><code>BeanFactory</code> is the minimal interface: <code>getBean</code>, creation on demand. <code>ApplicationContext</code> extends it with everything an application needs — eager singleton creation, events, the <code>Environment</code> (properties and profiles), resource loading, internationalised messages. In Spring Boot you always get an <code>ApplicationContext</code>: <code>AnnotationConfigApplicationContext</code> for a non-web app as above, a servlet-web variant that also starts Tomcat when <code>spring-boot-starter-webmvc</code> is present. The interviewer's favourite one-liner: "BeanFactory is lazy and basic; ApplicationContext is eager and full-featured, and it is what we actually use."</p>

<h3>The startup in four phases</h3>
<ol>
  <li><strong>Read recipes.</strong> Scan packages, read <code>@Bean</code> methods and auto-configurations ⇒ a registry of <code>BeanDefinition</code>s. No business object exists yet.</li>
  <li><strong>Edit recipes.</strong> <code>BeanFactoryPostProcessor</code>s may change definitions — e.g. resolve <code>&#36;{…}</code> placeholders in property values.</li>
  <li><strong>Build objects.</strong> For each eager singleton: constructor (dependencies first, as in our toy) ⇒ injection ⇒ init callbacks ⇒ <code>BeanPostProcessor</code>s, which may wrap it in a proxy.</li>
  <li><strong>Ready.</strong> Lifecycle beans start (e.g. the web server begins accepting connections), then <code>ApplicationReadyEvent</code> fires.</li>
</ol>

<h3>In real life and at work</h3>
<p>A restaurant kitchen: the head chef does not go to the market. She writes on the board "I need fish sauce, shallots and a sous-chef"; the manager makes sure they are there before service starts — and if the fish sauce supplier did not deliver, the restaurant does not open, rather than discovering it mid-order. At work, this is why reading the first <code>APPLICATION FAILED TO START</code> block of a Spring log is a daily skill: it is the container telling you, before any user arrives, which recipe it could not complete.</p>

<h3>Compared with Node.js</h3>
<p>Express has no container: you write the composition root yourself (<code>const service = new BookingService(repo, sender)</code> in one file) and pass objects around — perfectly fine for small apps, and lesson 3.2 shows that version running. NestJS added a Spring-style container with <code>@Injectable()</code> and constructor injection, because large Node codebases hit the same wiring problem. A good interview answer: "DI is a pattern; a container is one way to automate it."</p>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"What is Inversion of Control?"</strong> — Objects do not create or look up their dependencies; they declare them and a container (or a composition root) supplies them. DI is the most common form of IoC.</li>
  <li><strong>"What is a bean?"</strong> — An object whose creation, wiring and lifecycle are managed by the Spring container, described by a <code>BeanDefinition</code>.</li>
  <li><strong>"BeanFactory or ApplicationContext?"</strong> — ApplicationContext: eager singletons (fail fast), events, Environment, messages. BeanFactory is the low-level core.</li>
  <li><strong>"When are singleton beans created?"</strong> — During context refresh at startup, unless <code>@Lazy</code>; dependencies are created first.</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
  <li>Extend <code>MiniContainer</code> with <code>&lt;T&gt; List&lt;T&gt; getBeansOfType(Class&lt;T&gt; type)</code> that returns every registered bean assignable to <code>type</code>.</li>
  <li>Register a second <code>TimeSource</code> implementation. What does <code>getBean(TimeSource.class)</code> return now, and why is that dangerous? Make <code>register</code> throw a clear error when an interface gets a second implementation.</li>
  <li>In <code>IocApp</code>, print the names of all bean definitions that contain <code>"transaction"</code>.</li>
</ol>
<p><strong>Done when:</strong> registering two <code>TimeSource</code>s fails with a message naming both classes, and step 3 prints at least <code>transactionManager</code>.</p></div>
${giai('Show one solution', `${java(`
void register(Class<?> impl) {
    // …
    for (Class<?> itf : impl.getInterfaces()) {
        Class<?> old = definitions.putIfAbsent(itf, impl);
        if (old != null && old != impl)
            throw new IllegalStateException(itf.getSimpleName() + " has two implementations: "
                    + old.getSimpleName() + ", " + impl.getSimpleName());
    }
}

<T> List<T> getBeansOfType(Class<T> type) {
    return definitions.values().stream().distinct()
            .filter(type::isAssignableFrom)
            .map(impl -> type.cast(getBean(impl)))
            .toList();
}

// IocApp
Arrays.stream(ctx.getBeanDefinitionNames()).filter(n -> n.contains("transaction")).forEach(System.out::println);`)}
<p>Without the check, the map silently keeps the <em>last</em> registered class — the behaviour then depends on the order of a list somewhere. Spring takes the safe side: two candidates for one injection point is a startup error unless you say which one wins (<code>@Primary</code>/<code>@Qualifier</code>, lesson 3.2).</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">IoC (Inversion of Control)</span><span class="v">The framework, not your code, creates objects and calls into them.</span></div>
  <div class="kv"><span class="k">Bean</span><span class="v">An object managed by the Spring container.</span></div>
  <div class="kv"><span class="k">BeanDefinition</span><span class="v">The recipe for a bean: class, scope, laziness, callbacks, dependencies.</span></div>
  <div class="kv"><span class="k">ApplicationContext</span><span class="v">Spring's full container: BeanFactory + eager singletons, events, Environment, resources.</span></div>
  <div class="kv"><span class="k">@Lazy</span><span class="v">Create the bean on first use instead of at startup.</span></div>
  <div class="kv"><span class="k">Composition root</span><span class="v">The single place where an application without a container wires its objects by hand.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>A container = definitions + a singleton cache + recursive construction of dependencies. We wrote one in ~50 lines.</li>
  <li>Spring separates recipes (<code>BeanDefinition</code>) from objects, then builds eager singletons at startup — errors surface at deploy time.</li>
  <li>The context records the dependency graph and returns one instance per singleton bean.</li>
  <li>Use <code>ApplicationContext</code>; <code>@Lazy</code> only with a reason.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.spring.io/spring-framework/reference/core/beans/introduction.html', '🌱', 'Spring Framework — The IoC Container', 'Official introduction to BeanFactory, ApplicationContext and bean definitions.')}
${tl('https://martinfowler.com/articles/injection.html', '📄', 'Martin Fowler — Inversion of Control Containers and the Dependency Injection pattern (2004)', 'The article that named dependency injection.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: MiniContainer on Temurin 21.0.12.1; IocApp on Spring Boot 4.1.2 / Spring Framework 7.0.10, PostgreSQL 16 for the auto-configured DataSource (18/11/2026).</li>
  <li>Spring Framework reference, "The IoC Container": <a href="https://docs.spring.io/spring-framework/reference/core/beans.html" target="_blank" rel="noopener">docs.spring.io/spring-framework/reference/core/beans.html</a></li>
</ul>
</div>
`;

const L31_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>IoC container và bean</h2>
<p class="lead">Tới giờ mọi ứng dụng Spring Boot trong khoá đều "tự chạy": bạn viết một class có <code>@Service</code>, xin nó trong constructor, và nó tới. Chương này mở chiếc hộp ra. Ta bắt đầu bằng việc tự viết một IoC container chạy được, khoảng 50 dòng Java thuần, chạy thật, rồi nhìn vào container thật của Spring — <code>ApplicationContext</code> — xem nó lưu gì về từng bean: công thức, scope, phụ thuộc, và thời điểm được tạo. Học xong bài này, câu "Spring quản lý bean" sẽ có nghĩa cụ thể.</p>

<h3>Vấn đề: ai gọi <code>new</code>?</h3>
<p>Service đặt lịch cần một repository và một đồng hồ; controller cần service. Không có container thì phải có người viết <code>new JdbcBookingRepo()</code>, <code>new SystemClock()</code>, <code>new BookingService(repo, clock)</code>, <code>new BookingController(service)</code> — đúng thứ tự, mỗi thứ đúng một lần, và viết lại kiểu khác trong mỗi bài test. LabFlow thật có hàng chục đối tượng như vậy, cộng thêm những thứ chính Spring Boot cần (pool kết nối, bộ chuyển JSON, bộ quản lý giao dịch, web server…). <strong>Đảo ngược điều khiển (Inversion of Control)</strong> nghĩa là class của bạn thôi tự tạo đối tượng mình cần; nó chỉ <em>khai báo</em> cần gì, còn container dựng cả đồ thị đối tượng. Bài viết năm 2004 của Martin Fowler đặt tên cho kỹ thuật chính là <strong>dependency injection</strong> (tiêm phụ thuộc); tên dân gian là nguyên tắc Hollywood — "đừng gọi chúng tôi, chúng tôi sẽ gọi bạn".</p>

<h3>Một container 50 dòng, chạy thật</h3>
<p>Container nhỏ nhất dùng được cần ba thứ: danh sách <em>định nghĩa</em> (được phép dựng class nào, tra theo class hoặc interface), một <em>bộ nhớ đệm</em> các singleton đã dựng, và hàm <code>getBean</code> đệ quy — dựng tham số constructor trước. Thêm một ngăn xếp "đang dựng dở" để phát hiện vòng.</p>
${MA31_MINI}
${OUT31_MINI}
<ul>
  <li><strong>Thứ tự đến từ đồ thị, không phải từ bạn.</strong> Ta xin controller; container xem constructor của nó, thấy cần <code>BookingService</code>, cái này lại cần <code>BookingRepo</code> và <code>TimeSource</code> — nên repository và đồng hồ được dựng trước. Đó là duyệt theo chiều sâu đồ thị phụ thuộc.</li>
  <li><strong>Interface tách rời.</strong> <code>BookingService</code> xin <code>BookingRepo</code>, không xin <code>JdbcBookingRepo</code>. Muốn thay bằng bản giả khi test chỉ cần đăng ký class khác — không sửa service.</li>
  <li><strong>Mặc định là singleton.</strong> Lần <code>getBean(BookingService.class)</code> thứ hai trả đúng đối tượng cũ (<code>same service? true</code>). Một thể hiện mỗi container cũng là mặc định của Spring.</li>
  <li><strong>Vòng chỉ phát hiện được, không gỡ được.</strong> <code>Invoice</code> cần <code>Payment</code>, <code>Payment</code> lại cần <code>Invoice</code>: với tiêm qua constructor thì không có thứ tự nào đúng, container phải từ chối. Spring Boot cũng từ chối (bài 3.2).</li>
</ul>

<h3>Container thật thêm gì</h3>
<p>Bản đồ chơi chứng minh ý tưởng lõi. Container của Spring là cùng ý tưởng đó cộng với mười mấy năm nhu cầu production:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">BeanDefinition</span><span class="v">Một công thức, không phải đối tượng: tên class, scope, tạo sớm hay muộn, hàm khởi tạo/huỷ, phụ thuộc, khai báo ở đâu. Spring đọc hết công thức trước rồi mới tạo đối tượng.</span></div>
  <div class="kv"><span class="k">Quét component</span><span class="v">Thay vì tự viết danh sách <code>register(...)</code>, Spring quét package của class <code>@SpringBootApplication</code> (và package con) tìm <code>@Component</code> cùng họ hàng (bài 3.3).</span></div>
  <div class="kv"><span class="k">Scope</span><span class="v">singleton (mặc định), prototype (mỗi lần một cái mới), request, session… (bài 3.4).</span></div>
  <div class="kv"><span class="k">Callback vòng đời</span><span class="v"><code>@PostConstruct</code>, <code>@PreDestroy</code>, <code>SmartLifecycle</code> — mở pool sau khi tiêm, đóng khi tắt (bài 3.4).</span></div>
  <div class="kv"><span class="k">BeanPostProcessor</span><span class="v">Móc có thể thay bean bằng một <strong>proxy</strong> — đây là cách <code>@Transactional</code>, <code>@Async</code> và phân quyền cấp phương thức hoạt động (bài 3.5).</span></div>
  <div class="kv"><span class="k">Điều kiện và môi trường</span><span class="v">Chỉ tạo bean khi có class trên classpath, có thuộc tính, hoặc profile đang bật — động cơ của auto-configuration (bài 3.6–3.7).</span></div>
</div>

<h3>Nhìn vào ApplicationContext của Spring Boot</h3>
<p>Bốn bean nhỏ — cùng hình dạng với bản đồ chơi, giờ dùng annotation của Spring. Constructor nào cũng in một dòng để ta thấy <em>lúc nào</em> đối tượng được tạo. <code>ReportGenerator</code> có <code>@Lazy</code>.</p>
${MA31_BEANS}
<p>Class main khởi động Spring không kèm web server, rồi hỏi context về các công thức:</p>
${MA31_APP}
${OUT31_APP}
<ul>
  <li><strong>Singleton tạo sớm.</strong> Ba constructor chạy <em>bên trong</em> <code>SpringApplication.run</code>, trước dòng 2 — <code>ApplicationContext</code> tạo mọi singleton không lazy ngay lúc khởi động. Cố ý như vậy: thiếu phụ thuộc hay cấu hình sai thì ứng dụng sập lúc triển khai, không phải lúc khách đầu tiên gọi lúc 2 giờ sáng.</li>
  <li><strong>@Lazy</strong> hoãn việc tạo tới lần <code>getBean</code> đầu tiên (hoặc lần dùng đầu qua proxy). Có ích cho bean đắt mà hiếm khi cần; có hại nếu nó giấu lỗi khởi động tới tận lúc sau.</li>
  <li><strong>122 định nghĩa</strong> cho 4 class của ta: phần còn lại là hạ tầng Spring và bean tự cấu hình — <code>dataSource</code> (HikariCP), <code>jdbcTemplate</code>, <code>transactionManager</code>, bộ gắn thuộc tính… Bài 3.6 chỉ ra từng cái từ đâu tới.</li>
  <li><strong>Context biết đồ thị.</strong> <code>getDependenciesForBean("bookingService")</code> trả <code>[jdbcBookingRepo, systemClock]</code> — Spring ghi lại các cạnh trong lúc tiêm. Tên bean là tên class với chữ đầu viết thường.</li>
  <li><strong>Cùng một thể hiện</strong> dù xin theo kiểu hay theo tên: mỗi context một <code>BookingService</code>.</li>
</ul>

<h3>BeanFactory và ApplicationContext</h3>
<p><code>BeanFactory</code> là interface tối thiểu: <code>getBean</code>, tạo khi được xin. <code>ApplicationContext</code> mở rộng nó với mọi thứ một ứng dụng cần — tạo singleton sớm, sự kiện, <code>Environment</code> (thuộc tính và profile), nạp tài nguyên, thông điệp đa ngôn ngữ. Trong Spring Boot bạn luôn nhận một <code>ApplicationContext</code>: <code>AnnotationConfigApplicationContext</code> cho ứng dụng không web như trên, một biến thể servlet-web khởi động thêm Tomcat khi có <code>spring-boot-starter-webmvc</code>. Câu một dòng phỏng vấn viên thích: "BeanFactory lười và cơ bản; ApplicationContext tạo sớm và đủ tính năng, và đó là thứ ta thực sự dùng."</p>

<h3>Khởi động qua bốn pha</h3>
<ol>
  <li><strong>Đọc công thức.</strong> Quét package, đọc các hàm <code>@Bean</code> và auto-configuration ⇒ một sổ đăng ký <code>BeanDefinition</code>. Chưa có đối tượng nghiệp vụ nào.</li>
  <li><strong>Sửa công thức.</strong> Các <code>BeanFactoryPostProcessor</code> được sửa định nghĩa — ví dụ thay chỗ giữ <code>&#36;{…}</code> trong giá trị thuộc tính.</li>
  <li><strong>Dựng đối tượng.</strong> Với mỗi singleton tạo sớm: constructor (phụ thuộc trước, như bản đồ chơi) ⇒ tiêm ⇒ callback khởi tạo ⇒ <code>BeanPostProcessor</code>, có thể bọc nó trong proxy.</li>
  <li><strong>Sẵn sàng.</strong> Các bean vòng đời khởi chạy (ví dụ web server bắt đầu nhận kết nối), rồi phát <code>ApplicationReadyEvent</code>.</li>
</ol>

<h3>Đời thường và đi làm</h3>
<p>Một bếp nhà hàng: bếp trưởng không tự đi chợ. Chị ghi lên bảng "cần nước mắm, hành tím và một phụ bếp"; quản lý lo cho đủ trước giờ mở bán — và nếu nhà cung cấp nước mắm không giao, nhà hàng không mở cửa, chứ không phải giữa lúc khách gọi món mới phát hiện. Đi làm, đây là lý do đọc khối <code>APPLICATION FAILED TO START</code> đầu tiên trong log Spring là kỹ năng hằng ngày: đó là container báo cho bạn, trước khi có người dùng nào, công thức nào nó không hoàn thành được.</p>

<h3>So với Node.js</h3>
<p>Express không có container: bạn tự viết composition root (<code>const service = new BookingService(repo, sender)</code> trong một tệp) rồi truyền đối tượng đi — hoàn toàn ổn với ứng dụng nhỏ, bài 3.2 chạy thật bản đó. NestJS thêm một container kiểu Spring với <code>@Injectable()</code> và tiêm qua constructor, vì codebase Node lớn cũng gặp đúng bài toán nối dây. Câu trả lời phỏng vấn tốt: "DI là một mẫu thiết kế; container là một cách tự động hoá nó."</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Inversion of Control là gì?"</strong> — Đối tượng không tự tạo hay tự đi tìm phụ thuộc; nó khai báo, còn container (hoặc composition root) cung cấp. DI là dạng IoC phổ biến nhất.</li>
  <li><strong>"Bean là gì?"</strong> — Một đối tượng mà việc tạo, nối phụ thuộc và vòng đời do container Spring quản lý, được mô tả bằng một <code>BeanDefinition</code>.</li>
  <li><strong>"BeanFactory hay ApplicationContext?"</strong> — ApplicationContext: singleton tạo sớm (lỗi lộ sớm), sự kiện, Environment, thông điệp. BeanFactory là lõi cấp thấp.</li>
  <li><strong>"Singleton bean được tạo khi nào?"</strong> — Trong lúc refresh context khi khởi động, trừ khi có <code>@Lazy</code>; phụ thuộc được tạo trước.</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Thêm vào <code>MiniContainer</code> hàm <code>&lt;T&gt; List&lt;T&gt; getBeansOfType(Class&lt;T&gt; type)</code> trả về mọi bean đã đăng ký gán được cho <code>type</code>.</li>
  <li>Đăng ký thêm một class thứ hai cài <code>TimeSource</code>. <code>getBean(TimeSource.class)</code> giờ trả gì, và vì sao điều đó nguy hiểm? Sửa <code>register</code> để ném lỗi rõ ràng khi một interface có cài đặt thứ hai.</li>
  <li>Trong <code>IocApp</code>, in tên mọi định nghĩa bean có chứa <code>"transaction"</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> đăng ký hai <code>TimeSource</code> thì báo lỗi nêu tên cả hai class, và bước 3 in ít nhất <code>transactionManager</code>.</p></div>
${giai('Xem một lời giải', `${java(`
void register(Class<?> impl) {
    // …
    for (Class<?> itf : impl.getInterfaces()) {
        Class<?> old = definitions.putIfAbsent(itf, impl);
        if (old != null && old != impl)
            throw new IllegalStateException(itf.getSimpleName() + " has two implementations: "
                    + old.getSimpleName() + ", " + impl.getSimpleName());
    }
}

<T> List<T> getBeansOfType(Class<T> type) {
    return definitions.values().stream().distinct()
            .filter(type::isAssignableFrom)
            .map(impl -> type.cast(getBean(impl)))
            .toList();
}

// IocApp
Arrays.stream(ctx.getBeanDefinitionNames()).filter(n -> n.contains("transaction")).forEach(System.out::println);`)}
<p>Không kiểm thì map lặng lẽ giữ class đăng ký <em>sau cùng</em> — hành vi phụ thuộc vào thứ tự một danh sách nào đó. Spring chọn phía an toàn: hai ứng viên cho một chỗ tiêm là lỗi khởi động, trừ khi bạn nói rõ ai thắng (<code>@Primary</code>/<code>@Qualifier</code>, bài 3.2).</p>`)}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">IoC (đảo ngược điều khiển)</span><span class="v">Framework, không phải mã của bạn, tạo đối tượng và gọi vào chúng.</span></div>
  <div class="kv"><span class="k">Bean</span><span class="v">Đối tượng do container Spring quản lý.</span></div>
  <div class="kv"><span class="k">BeanDefinition</span><span class="v">Công thức của một bean: class, scope, tạo muộn hay không, callback, phụ thuộc.</span></div>
  <div class="kv"><span class="k">ApplicationContext</span><span class="v">Container đầy đủ của Spring: BeanFactory + singleton tạo sớm, sự kiện, Environment, tài nguyên.</span></div>
  <div class="kv"><span class="k">@Lazy</span><span class="v">Tạo bean ở lần dùng đầu thay vì lúc khởi động.</span></div>
  <div class="kv"><span class="k">Composition root</span><span class="v">Nơi duy nhất mà ứng dụng không có container tự tay nối các đối tượng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Container = định nghĩa + bộ đệm singleton + dựng phụ thuộc đệ quy. Ta đã viết một cái ~50 dòng.</li>
  <li>Spring tách công thức (<code>BeanDefinition</code>) khỏi đối tượng, rồi dựng singleton tạo sớm lúc khởi động — lỗi lộ ra lúc triển khai.</li>
  <li>Context ghi lại đồ thị phụ thuộc và trả một thể hiện cho mỗi singleton bean.</li>
  <li>Dùng <code>ApplicationContext</code>; chỉ dùng <code>@Lazy</code> khi có lý do.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.spring.io/spring-framework/reference/core/beans/introduction.html', '🌱', 'Spring Framework — The IoC Container', 'Giới thiệu chính thức về BeanFactory, ApplicationContext và định nghĩa bean.')}
${tl('https://martinfowler.com/articles/injection.html', '📄', 'Martin Fowler — Inversion of Control Containers and the Dependency Injection pattern (2004)', 'Bài viết đặt tên cho dependency injection.')}

<h3>Nguồn</h3>
<ul>
  <li>Output ở trên: MiniContainer trên Temurin 21.0.12.1; IocApp trên Spring Boot 4.1.2 / Spring Framework 7.0.10, PostgreSQL 16 cho DataSource tự cấu hình (18/11/2026).</li>
  <li>Spring Framework reference, "The IoC Container": <a href="https://docs.spring.io/spring-framework/reference/core/beans.html" target="_blank" rel="noopener">docs.spring.io/spring-framework/reference/core/beans.html</a></li>
</ul>
</div>
`;

// ===== Bài 3.2 =====
const MA32_DI = java("@SpringBootApplication\npublic class DiApp {\n    public static void main(String[] args) {\n        var ctx = new SpringApplicationBuilder(DiApp.class).web(WebApplicationType.NONE).logStartupInfo(false).run(args);\n        ctx.getBean(BookingNotifier.class).confirm(\"an\", 42);\n        System.out.println(\"--- a 'unit test' that builds the field-injected class with new:\");\n        try {\n            new LegacyNotifier().confirm(\"binh\", 43);\n        } catch (NullPointerException e) {\n            System.out.println(e.getClass().getSimpleName() + \": \" + e.getMessage());\n        }\n        System.out.println(\"--- the constructor-injected class needs no Spring in a test:\");\n        new BookingNotifier(new SmsSender(), List.of(new SmsSender()), Map.of()).confirm(\"chi\", 44);\n        ctx.close();\n    }\n}\n\ninterface NotificationSender { String send(String to, String text); }\n\n@Component @Primary @Order(2)\nclass EmailSender implements NotificationSender {\n    public String send(String to, String text) { return \"email to \" + to + \": \" + text; }\n}\n\n@Component(\"sms\") @Order(1)\nclass SmsSender implements NotificationSender {\n    public String send(String to, String text) { return \"sms to \" + to + \": \" + text; }\n}\n\n@Component @Order(3)\nclass ZaloSender implements NotificationSender {\n    public String send(String to, String text) { return \"zalo to \" + to + \": \" + text; }\n}\n\n@Service\nclass BookingNotifier {\n    private final NotificationSender urgent;          // which one? @Qualifier decides\n    private final List<NotificationSender> all;       // every bean of the type, sorted by @Order\n    private final Map<String, NotificationSender> byName;\n\n    BookingNotifier(@Qualifier(\"sms\") NotificationSender urgent, List<NotificationSender> all,\n                    Map<String, NotificationSender> byName) {\n        this.urgent = urgent;\n        this.all = all;\n        this.byName = byName;\n    }\n\n    void confirm(String student, long bookingId) {\n        System.out.println(urgent.send(student, \"booking #\" + bookingId + \" confirmed\"));\n        System.out.println(\"all senders (by @Order): \" + all.stream().map(s -> s.getClass().getSimpleName()).toList());\n        System.out.println(\"map keys = bean names:   \" + byName.keySet());\n    }\n}\n\n@Service\nclass LegacyNotifier {\n    @Autowired private NotificationSender sender;     // field injection: no constructor, no final\n    void confirm(String student, long bookingId) {\n        System.out.println(sender.send(student, \"booking #\" + bookingId + \" confirmed\"));\n    }\n}");
const MA32_REM = java("/** Plain injection by type picks the @Primary bean. */\n@Component\nclass Reminder {\n    Reminder(NotificationSender sender) {\n        System.out.println(\"Reminder got \" + sender.getClass().getSimpleName() + \" (the @Primary one)\");\n    }\n}");
const OUT32_DI = out("$ java … DiApp\nReminder got EmailSender (the @Primary one)\nsms to an: booking #42 confirmed\nall senders (by @Order): [SmsSender, EmailSender, ZaloSender]\nmap keys = bean names:   [emailSender, sms, zaloSender]\n--- a 'unit test' that builds the field-injected class with new:\nNullPointerException: Cannot invoke \"com.cuongthai.c3.di.ok.NotificationSender.send(String, String)\" because \"this.sender\" is null\n--- the constructor-injected class needs no Spring in a test:\nsms to chi: booking #44 confirmed\nall senders (by @Order): [SmsSender]\nmap keys = bean names:   []");
const MA32_DUP = java("");
const OUT32_DUP = out("$ java … DupApp\n***************************\nAPPLICATION FAILED TO START\n***************************\n\nDescription:\n\nParameter 0 of constructor in com.cuongthai.c3.di.dup.BookingNotifier required a single bean, but 2 were found:\n\t- emailSender: defined in file [/w/target/classes/com/cuongthai/c3/di/dup/EmailSender.class]\n\t- smsSender: defined in file [/w/target/classes/com/cuongthai/c3/di/dup/SmsSender.class]\n\nThis may be due to missing parameter name information\n\nAction:\n\nConsider marking one of the beans as @Primary, updating the consumer to accept multiple beans, or using @Qualifier to identify the bean that should be consumed\n\nEnsure that your compiler is configured to use the '-parameters' flag.\nYou may need to update both your build tool settings as well as your IDE.\n(See https://github.com/spring-projects/spring-framework/wiki/Spring-Framework-6.1-Release-Notes#parameter-name-retention)");
const OUT32_BYNAME = out("$ java … ByNameApp      # same two beans, constructor parameter renamed to smsSender\ngot sms -- matched by parameter name");
const MA32_CYCLE = java("@Service\nclass BookingService {\n    BookingService(InvoiceService invoices) { }   // booking needs invoices…\n}\n\n@Service\nclass InvoiceService {\n    InvoiceService(BookingService bookings) { }   // …and invoices need bookings\n}");
const OUT32_CYCLE = out("$ java … CycleApp\n***************************\nAPPLICATION FAILED TO START\n***************************\n\nDescription:\n\nThe dependencies of some of the beans in the application context form a cycle:\n\n┌─────┐\n|  bookingService defined in file [/w/target/classes/com/cuongthai/c3/di/cycle/BookingService.class]\n↑     ↓\n|  invoiceService defined in file [/w/target/classes/com/cuongthai/c3/di/cycle/InvoiceService.class]\n└─────┘\n\nAction:\n\nRelying upon circular references is discouraged and they are prohibited by default. Update your application to remove the dependency cycle between beans. As a last resort, it may be possible to break the cycle automatically by setting spring.main.allow-circular-references to true.");
const OUT32_NODE = out("$ node wiring.mjs\nsms to an: booking #101 for Lab Mạng\nFAKE binh: booking #1 for Lab IoT");

const L32_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Dependency injection: constructor vs field</h2>
<p class="lead">Spring can hand a dependency to your bean in three ways: through the constructor, through a setter, or by writing straight into a field. All three compile, all three "work" in the running app — and only one of them keeps working when you write a unit test, refactor, or add a second implementation. This lesson runs each case for real: the NullPointerException that field injection hides, the startup error when two beans match, the cycle report, and the ways to tell Spring which bean you meant.</p>

<h3>Three injection styles</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Constructor (recommended)</span><span class="v"><code>BookingNotifier(NotificationSender urgent, …)</code>. Fields can be <code>final</code>; the object is complete the moment it exists; with a single constructor no <code>@Autowired</code> is needed (since Spring 4.3).</span></div>
  <div class="kv"><span class="k">Setter</span><span class="v"><code>@Autowired void setPhoneBook(PhoneBook p)</code>. For genuinely optional or re-configurable dependencies. The object exists for a moment without it.</span></div>
  <div class="kv"><span class="k">Field</span><span class="v"><code>@Autowired private NotificationSender sender;</code>. Shortest to write; Spring sets a private field by reflection. Nobody else can — including your tests.</span></div>
</div>

<h3>One program, every case</h3>
<p>Three implementations of <code>NotificationSender</code> (email, SMS, Zalo). <code>EmailSender</code> is <code>@Primary</code>; <code>SmsSender</code> has the explicit bean name <code>"sms"</code>; <code>@Order</code> fixes their order in lists. <code>BookingNotifier</code> uses constructor injection; <code>LegacyNotifier</code> uses field injection.</p>
${MA32_DI}
${MA32_REM}
${OUT32_DI}
<ul>
  <li><strong>Plain injection by type</strong> (<code>Reminder</code>) found three candidates and took the <code>@Primary</code> one.</li>
  <li><strong>@Qualifier("sms")</strong> overrides <code>@Primary</code> for that one parameter.</li>
  <li><strong><code>List&lt;NotificationSender&gt;</code></strong> receives <em>all</em> beans of the type, sorted by <code>@Order</code> (SMS 1, email 2, Zalo 3). This is the clean way to build "send through every channel" or a chain of rules without an <code>if</code> per channel.</li>
  <li><strong><code>Map&lt;String, NotificationSender&gt;</code></strong> is keyed by bean name — handy for "pick the channel the user chose" (<code>byName.get(user.channel())</code>).</li>
  <li><strong>Field injection broke the "unit test".</strong> <code>new LegacyNotifier()</code> compiles, but the field is <code>null</code> because only Spring knew how to fill it. The helpful NPE (lesson 2.2) names <code>this.sender</code>. To test it you must either start Spring or use reflection tricks.</li>
  <li><strong>Constructor injection needs no framework in tests.</strong> <code>new BookingNotifier(new SmsSender(), List.of(...), Map.of())</code> — any fake can be passed in. The compiler also refuses to build the object without its dependencies.</li>
</ul>

<h3>Why teams require constructor injection</h3>
<ol>
  <li><strong>Immutability:</strong> <code>final</code> fields, safe to share between request threads (lesson 2.4).</li>
  <li><strong>No half-built objects:</strong> a field-injected object exists in an invalid state until Spring fills it.</li>
  <li><strong>Honest size:</strong> a constructor with eight parameters is a visible smell — the class does too much. Eight <code>@Autowired</code> fields hide the same smell.</li>
  <li><strong>Cycles fail fast</strong> (below) instead of being silently patched.</li>
</ol>
<p>In Vietnamese companies you will often see Lombok's <code>@RequiredArgsConstructor</code> on services: it generates exactly this constructor for all <code>final</code> fields, so the class body stays short. It is still constructor injection.</p>

<h3>Two candidates, no hint: the startup refuses</h3>
${MA32_DUP}
${OUT32_DUP}
<p>Read the <em>Action</em> section: Spring lists the three fixes we just used — <code>@Primary</code>, accepting several beans (a <code>List</code>), or <code>@Qualifier</code>. The line about "parameter name information" points to a fourth, hidden rule: if the parameter name equals a bean name, Spring picks that bean.</p>
${OUT32_BYNAME}
<p>It works because the Spring Boot Maven parent compiles with <code>-parameters</code>. It is fragile: an IDE rename of the parameter changes which bean you get, with no compile error. Prefer an explicit <code>@Qualifier</code>.</p>

<h3>Circular dependencies</h3>
${MA32_CYCLE}
${OUT32_CYCLE}
<p>Since Spring Boot 2.6 circular references are <strong>prohibited by default</strong>. With constructors there is no possible creation order (exactly what our MiniContainer found in lesson 3.1). Fixes, best first:</p>
<ol>
  <li><strong>Redesign:</strong> usually both services share a piece of logic — move it into a third bean that both depend on (e.g. <code>PricingRules</code>).</li>
  <li><strong>Events:</strong> instead of <code>InvoiceService</code> calling <code>BookingService</code> back, publish a <code>BookingConfirmed</code> event (Chapter 14).</li>
  <li><strong>Last resort:</strong> <code>@Lazy</code> on one constructor parameter injects a proxy that resolves the real bean on first call. <code>spring.main.allow-circular-references=true</code> brings back the old behaviour for the whole app — the error message itself calls it a last resort.</li>
</ol>

<h3>Optional dependencies</h3>
<p>If a bean may legitimately be absent (a Slack notifier only configured in production), inject <code>ObjectProvider&lt;SlackClient&gt;</code> and call <code>getIfAvailable()</code>, or use an empty <code>List</code>. Do not use <code>@Autowired(required = false)</code> fields that silently stay <code>null</code>.</p>

<h3>Compared with Node.js</h3>
<p>In Express you are the container. The idea — dependencies come in through the constructor — is identical and just as testable:</p>
${OUT32_NODE}
<p>What the Spring container saves you is the composition root: ordering, single instances, choosing between implementations, and failing fast when something is missing. Interview phrasing: "Constructor injection is good design in any language; Spring automates the wiring."</p>

<h3>In real life and at work</h3>
<p>Constructor injection is a laptop that leaves the factory with its battery and charger in the box — you cannot even buy it incomplete. Field injection is a laptop shipped empty with a note "the shop will install the battery": fine if you always buy from that shop, a surprise the day you test it at home. At work, code review in most Spring teams rejects new <code>@Autowired</code> fields; when you inherit old code full of them, converting a class to constructor injection is the first step before writing its unit test (Chapter 11).</p>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"Constructor or field injection, and why?"</strong> — Constructor: final fields, complete objects, testable with plain <code>new</code>, cycles detected, too many dependencies are visible.</li>
  <li><strong>"Two beans implement the same interface — what happens and how do you fix it?"</strong> — Startup fails with "expected single matching bean but found 2". Fix with <code>@Primary</code>, <code>@Qualifier</code>, or inject <code>List</code>/<code>Map</code> of all.</li>
  <li><strong>"@Primary vs @Qualifier?"</strong> — <code>@Primary</code> sets the default for everyone; <code>@Qualifier</code> chooses at one injection point and wins over <code>@Primary</code>.</li>
  <li><strong>"How does Spring handle circular dependencies?"</strong> — Since Boot 2.6 they are an error by default; constructor cycles can never be resolved. Break the cycle by redesign or events; <code>@Lazy</code> as last resort.</li>
</ol>

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok"><ol>
  <li>Add a <code>PushSender</code> with <code>@Order(0)</code>. Without touching <code>BookingNotifier</code>, make the list print it first.</li>
  <li>Write <code>NotificationRouter</code> that receives <code>Map&lt;String, NotificationSender&gt;</code> and sends through the channel named by a parameter, throwing <code>IllegalArgumentException</code> for an unknown channel.</li>
  <li>Convert <code>LegacyNotifier</code> to constructor injection and write a <code>main</code>-based "test" that passes a lambda as the sender.</li>
</ol>
<p><strong>Done when:</strong> the list starts with <code>PushSender</code>, <code>route("zaloSender", …)</code> sends via Zalo, <code>route("fax", …)</code> throws, and the converted class runs without Spring.</p></div>
${giai('Show one solution', `${java(`
@Component @Order(0)
class PushSender implements NotificationSender {
    public String send(String to, String text) { return "push to " + to + ": " + text; }
}

@Service
class NotificationRouter {
    private final Map<String, NotificationSender> byName;
    NotificationRouter(Map<String, NotificationSender> byName) { this.byName = byName; }

    String route(String channel, String to, String text) {
        NotificationSender s = byName.get(channel);
        if (s == null) throw new IllegalArgumentException("unknown channel " + channel + ", known: " + byName.keySet());
        return s.send(to, text);
    }
}

@Service
class LegacyNotifier {
    private final NotificationSender sender;
    LegacyNotifier(NotificationSender sender) { this.sender = sender; }   // @Primary EmailSender in the app
    void confirm(String student, long id) { System.out.println(sender.send(student, "booking #" + id + " confirmed")); }
}

// "test" without Spring:
new LegacyNotifier((to, text) -> "fake to " + to + ": " + text).confirm("an", 1);`)}
<p>The <code>Map</code> keys are bean names, so the channel names are <code>emailSender</code>, <code>sms</code>, <code>zaloSender</code>, <code>pushSender</code> — give beans explicit names (<code>@Component("zalo")</code>) if the names are part of your API.</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Dependency injection</span><span class="v">Supplying an object's collaborators from outside instead of creating them inside.</span></div>
  <div class="kv"><span class="k">Constructor injection</span><span class="v">Dependencies are constructor parameters; fields can be final.</span></div>
  <div class="kv"><span class="k">@Primary</span><span class="v">The default bean when several match a type.</span></div>
  <div class="kv"><span class="k">@Qualifier</span><span class="v">Selects a bean by name/qualifier at one injection point.</span></div>
  <div class="kv"><span class="k">@Order</span><span class="v">Order of beans inside an injected List.</span></div>
  <div class="kv"><span class="k">Circular dependency</span><span class="v">A needs B and B needs A; an error by default since Spring Boot 2.6.</span></div>
  <div class="kv"><span class="k">ObjectProvider</span><span class="v">Lazy, optional access to a bean: <code>getIfAvailable()</code>, <code>getObject()</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Use constructor injection with <code>final</code> fields; one constructor needs no <code>@Autowired</code>.</li>
  <li>Field injection hides dependencies and breaks plain unit tests (real NPE above).</li>
  <li>Several candidates ⇒ <code>@Primary</code>, <code>@Qualifier</code>, or inject a <code>List</code>/<code>Map</code>; avoid relying on parameter names.</li>
  <li>Circular dependencies fail at startup: fix the design, not the flag.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html', '🌱', 'Spring Framework — Dependency Injection', 'Constructor vs setter injection and the official recommendation.')}
${tl('https://docs.spring.io/spring-framework/reference/core/beans/annotation-config/autowired-qualifiers.html', '🌱', 'Fine-tuning annotation-based autowiring with qualifiers', '@Primary, @Qualifier, collections and maps of beans.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: DiApp, DupApp, ByNameApp, CycleApp on Spring Boot 4.1.2; wiring.mjs on Node.js 22.22.2 (18/11/2026).</li>
  <li>Spring Boot 2.6 release notes, "Circular References Prohibited by Default": <a href="https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.6-Release-Notes" target="_blank" rel="noopener">github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.6-Release-Notes</a></li>
</ul>
</div>
`;

const L32_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Dependency injection: qua constructor hay qua field</h2>
<p class="lead">Spring có ba cách đưa phụ thuộc vào bean: qua constructor, qua setter, hoặc ghi thẳng vào field. Cả ba đều biên dịch được, cả ba đều "chạy" khi ứng dụng đang sống — và chỉ một cách còn chạy khi bạn viết unit test, đổi tên, hay thêm cài đặt thứ hai. Bài này chạy thật từng trường hợp: NullPointerException mà tiêm qua field che giấu, lỗi khởi động khi hai bean cùng khớp, báo cáo vòng phụ thuộc, và các cách nói cho Spring biết bạn muốn bean nào.</p>

<h3>Ba kiểu tiêm</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Constructor (khuyên dùng)</span><span class="v"><code>BookingNotifier(NotificationSender urgent, …)</code>. Field để <code>final</code> được; đối tượng đầy đủ ngay khi tồn tại; chỉ một constructor thì không cần <code>@Autowired</code> (từ Spring 4.3).</span></div>
  <div class="kv"><span class="k">Setter</span><span class="v"><code>@Autowired void setPhoneBook(PhoneBook p)</code>. Cho phụ thuộc thật sự tuỳ chọn hoặc cấu hình lại được. Đối tượng có một khoảnh khắc tồn tại mà chưa có nó.</span></div>
  <div class="kv"><span class="k">Field</span><span class="v"><code>@Autowired private NotificationSender sender;</code>. Viết ngắn nhất; Spring đặt field private bằng reflection. Không ai khác làm được — kể cả bài test của bạn.</span></div>
</div>

<h3>Một chương trình, đủ mọi trường hợp</h3>
<p>Ba cài đặt của <code>NotificationSender</code> (email, SMS, Zalo). <code>EmailSender</code> có <code>@Primary</code>; <code>SmsSender</code> có tên bean đặt rõ là <code>"sms"</code>; <code>@Order</code> cố định thứ tự trong danh sách. <code>BookingNotifier</code> tiêm qua constructor; <code>LegacyNotifier</code> tiêm qua field.</p>
${MA32_DI}
${MA32_REM}
${OUT32_DI}
<ul>
  <li><strong>Tiêm theo kiểu thông thường</strong> (<code>Reminder</code>) gặp ba ứng viên và lấy cái <code>@Primary</code>.</li>
  <li><strong>@Qualifier("sms")</strong> thắng <code>@Primary</code> tại đúng tham số đó.</li>
  <li><strong><code>List&lt;NotificationSender&gt;</code></strong> nhận <em>mọi</em> bean cùng kiểu, xếp theo <code>@Order</code> (SMS 1, email 2, Zalo 3). Đây là cách gọn để "gửi qua mọi kênh" hay dựng chuỗi luật mà không cần một <code>if</code> cho mỗi kênh.</li>
  <li><strong><code>Map&lt;String, NotificationSender&gt;</code></strong> có khoá là tên bean — tiện cho "chọn kênh người dùng đã chọn" (<code>byName.get(user.channel())</code>).</li>
  <li><strong>Tiêm qua field làm hỏng "unit test".</strong> <code>new LegacyNotifier()</code> biên dịch được, nhưng field là <code>null</code> vì chỉ Spring biết cách điền nó. NPE biết nói (bài 2.2) nêu đúng <code>this.sender</code>. Muốn test phải khởi động Spring hoặc dùng mẹo reflection.</li>
  <li><strong>Tiêm qua constructor không cần framework khi test.</strong> <code>new BookingNotifier(new SmsSender(), List.of(...), Map.of())</code> — đưa bản giả nào cũng được. Trình biên dịch cũng không cho tạo đối tượng thiếu phụ thuộc.</li>
</ul>

<h3>Vì sao các nhóm bắt buộc tiêm qua constructor</h3>
<ol>
  <li><strong>Bất biến:</strong> field <code>final</code>, dùng chung giữa các luồng request an toàn (bài 2.4).</li>
  <li><strong>Không có đối tượng dựng dở:</strong> đối tượng tiêm qua field tồn tại ở trạng thái sai cho tới khi Spring điền xong.</li>
  <li><strong>Lộ đúng kích thước:</strong> constructor tám tham số là mùi dễ thấy — class làm quá nhiều việc. Tám field <code>@Autowired</code> giấu đúng mùi đó.</li>
  <li><strong>Vòng phụ thuộc lộ sớm</strong> (bên dưới) thay vì bị vá lặng lẽ.</li>
</ol>
<p>Ở các công ty Việt Nam bạn sẽ hay thấy <code>@RequiredArgsConstructor</code> của Lombok trên service: nó sinh đúng constructor này cho mọi field <code>final</code>, thân class vẫn ngắn. Vẫn là tiêm qua constructor.</p>

<h3>Hai ứng viên, không gợi ý: khởi động từ chối</h3>
${MA32_DUP}
${OUT32_DUP}
<p>Đọc phần <em>Action</em>: Spring liệt kê ba cách sửa ta vừa dùng — <code>@Primary</code>, nhận nhiều bean (một <code>List</code>), hoặc <code>@Qualifier</code>. Dòng nói về "parameter name information" trỏ tới luật thứ tư, ẩn: nếu tên tham số trùng tên bean, Spring chọn bean đó.</p>
${OUT32_BYNAME}
<p>Nó chạy vì Maven parent của Spring Boot biên dịch với <code>-parameters</code>. Nhưng mong manh: IDE đổi tên tham số là đổi luôn bean bạn nhận, không có lỗi biên dịch nào. Nên dùng <code>@Qualifier</code> rõ ràng.</p>

<h3>Vòng phụ thuộc</h3>
${MA32_CYCLE}
${OUT32_CYCLE}
<p>Từ Spring Boot 2.6, tham chiếu vòng <strong>bị cấm mặc định</strong>. Với constructor thì không có thứ tự tạo nào khả thi (đúng điều MiniContainer của ta gặp ở bài 3.1). Cách sửa, tốt nhất trước:</p>
<ol>
  <li><strong>Thiết kế lại:</strong> thường hai service dùng chung một mẩu logic — chuyển nó sang bean thứ ba mà cả hai cùng phụ thuộc (ví dụ <code>PricingRules</code>).</li>
  <li><strong>Sự kiện:</strong> thay vì <code>InvoiceService</code> gọi ngược <code>BookingService</code>, phát sự kiện <code>BookingConfirmed</code> (Chương 14).</li>
  <li><strong>Đường cùng:</strong> <code>@Lazy</code> trên một tham số constructor tiêm vào một proxy, proxy tìm bean thật ở lần gọi đầu. <code>spring.main.allow-circular-references=true</code> mang lại hành vi cũ cho cả ứng dụng — chính thông báo lỗi gọi nó là đường cùng.</li>
</ol>

<h3>Phụ thuộc tuỳ chọn</h3>
<p>Nếu một bean có thể vắng mặt chính đáng (bộ báo Slack chỉ cấu hình ở production), tiêm <code>ObjectProvider&lt;SlackClient&gt;</code> rồi gọi <code>getIfAvailable()</code>, hoặc dùng <code>List</code> rỗng. Đừng dùng field <code>@Autowired(required = false)</code> lặng lẽ để <code>null</code>.</p>

<h3>So với Node.js</h3>
<p>Trong Express, bạn là container. Ý tưởng — phụ thuộc đi vào qua constructor — y hệt và test dễ như vậy:</p>
${OUT32_NODE}
<p>Thứ container Spring tiết kiệm cho bạn là composition root: thứ tự, một thể hiện duy nhất, chọn giữa các cài đặt, và báo lỗi sớm khi thiếu. Cách nói khi phỏng vấn: "Tiêm qua constructor là thiết kế tốt ở mọi ngôn ngữ; Spring tự động hoá việc nối dây."</p>

<h3>Đời thường và đi làm</h3>
<p>Tiêm qua constructor là chiếc laptop rời nhà máy với pin và sạc trong hộp — bạn không thể mua nó thiếu. Tiêm qua field là laptop gửi đi rỗng kèm tờ giấy "cửa hàng sẽ lắp pin": ổn nếu bạn luôn mua ở cửa hàng đó, bất ngờ vào ngày bạn thử nó ở nhà. Đi làm, review mã ở hầu hết nhóm Spring từ chối field <code>@Autowired</code> mới; khi tiếp quản mã cũ đầy chúng, đổi một class sang tiêm qua constructor là bước đầu tiên trước khi viết unit test cho nó (Chương 11).</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Tiêm qua constructor hay field, vì sao?"</strong> — Constructor: field final, đối tượng đầy đủ, test bằng <code>new</code> thường, vòng bị phát hiện, quá nhiều phụ thuộc thì lộ ra.</li>
  <li><strong>"Hai bean cài cùng interface — chuyện gì xảy ra, sửa thế nào?"</strong> — Khởi động lỗi "expected single matching bean but found 2". Sửa bằng <code>@Primary</code>, <code>@Qualifier</code>, hoặc tiêm <code>List</code>/<code>Map</code> của tất cả.</li>
  <li><strong>"@Primary khác @Qualifier thế nào?"</strong> — <code>@Primary</code> đặt mặc định cho mọi nơi; <code>@Qualifier</code> chọn tại một chỗ tiêm và thắng <code>@Primary</code>.</li>
  <li><strong>"Spring xử lý vòng phụ thuộc thế nào?"</strong> — Từ Boot 2.6 mặc định là lỗi; vòng qua constructor không bao giờ gỡ được. Phá vòng bằng thiết kế lại hoặc sự kiện; <code>@Lazy</code> là đường cùng.</li>
</ol>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
  <li>Thêm <code>PushSender</code> có <code>@Order(0)</code>. Không sửa <code>BookingNotifier</code>, làm cho danh sách in nó đầu tiên.</li>
  <li>Viết <code>NotificationRouter</code> nhận <code>Map&lt;String, NotificationSender&gt;</code> và gửi qua kênh có tên theo tham số, ném <code>IllegalArgumentException</code> với kênh lạ.</li>
  <li>Đổi <code>LegacyNotifier</code> sang tiêm qua constructor và viết một "test" bằng <code>main</code> truyền một lambda làm bộ gửi.</li>
</ol>
<p><strong>Đạt khi:</strong> danh sách bắt đầu bằng <code>PushSender</code>, <code>route("zaloSender", …)</code> gửi qua Zalo, <code>route("fax", …)</code> ném lỗi, và class đã đổi chạy được không cần Spring.</p></div>
${giai('Xem một lời giải', `${java(`
@Component @Order(0)
class PushSender implements NotificationSender {
    public String send(String to, String text) { return "push to " + to + ": " + text; }
}

@Service
class NotificationRouter {
    private final Map<String, NotificationSender> byName;
    NotificationRouter(Map<String, NotificationSender> byName) { this.byName = byName; }

    String route(String channel, String to, String text) {
        NotificationSender s = byName.get(channel);
        if (s == null) throw new IllegalArgumentException("unknown channel " + channel + ", known: " + byName.keySet());
        return s.send(to, text);
    }
}

@Service
class LegacyNotifier {
    private final NotificationSender sender;
    LegacyNotifier(NotificationSender sender) { this.sender = sender; }   // @Primary EmailSender in the app
    void confirm(String student, long id) { System.out.println(sender.send(student, "booking #" + id + " confirmed")); }
}

// "test" without Spring:
new LegacyNotifier((to, text) -> "fake to " + to + ": " + text).confirm("an", 1);`)}
<p>Khoá của <code>Map</code> là tên bean, nên tên kênh là <code>emailSender</code>, <code>sms</code>, <code>zaloSender</code>, <code>pushSender</code> — hãy đặt tên bean rõ ràng (<code>@Component("zalo")</code>) nếu tên là một phần API của bạn.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Dependency injection</span><span class="v">Cung cấp các đối tượng cộng tác từ bên ngoài thay vì tự tạo bên trong.</span></div>
  <div class="kv"><span class="k">Tiêm qua constructor</span><span class="v">Phụ thuộc là tham số constructor; field để final được.</span></div>
  <div class="kv"><span class="k">@Primary</span><span class="v">Bean mặc định khi nhiều bean cùng khớp một kiểu.</span></div>
  <div class="kv"><span class="k">@Qualifier</span><span class="v">Chọn bean theo tên/qualifier tại một chỗ tiêm.</span></div>
  <div class="kv"><span class="k">@Order</span><span class="v">Thứ tự các bean trong một List được tiêm.</span></div>
  <div class="kv"><span class="k">Vòng phụ thuộc</span><span class="v">A cần B và B cần A; là lỗi mặc định từ Spring Boot 2.6.</span></div>
  <div class="kv"><span class="k">ObjectProvider</span><span class="v">Truy cập bean muộn, tuỳ chọn: <code>getIfAvailable()</code>, <code>getObject()</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Tiêm qua constructor với field <code>final</code>; một constructor thì không cần <code>@Autowired</code>.</li>
  <li>Tiêm qua field giấu phụ thuộc và làm hỏng unit test thường (NPE thật ở trên).</li>
  <li>Nhiều ứng viên ⇒ <code>@Primary</code>, <code>@Qualifier</code>, hoặc tiêm <code>List</code>/<code>Map</code>; đừng dựa vào tên tham số.</li>
  <li>Vòng phụ thuộc lỗi ngay lúc khởi động: sửa thiết kế, đừng sửa cờ.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html', '🌱', 'Spring Framework — Dependency Injection', 'Tiêm qua constructor vs setter và khuyến nghị chính thức.')}
${tl('https://docs.spring.io/spring-framework/reference/core/beans/annotation-config/autowired-qualifiers.html', '🌱', 'Fine-tuning annotation-based autowiring with qualifiers', '@Primary, @Qualifier, tập hợp và map các bean.')}

<h3>Nguồn</h3>
<ul>
  <li>Output ở trên: DiApp, DupApp, ByNameApp, CycleApp trên Spring Boot 4.1.2; wiring.mjs trên Node.js 22.22.2 (18/11/2026).</li>
  <li>Spring Boot 2.6 release notes, "Circular References Prohibited by Default": <a href="https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.6-Release-Notes" target="_blank" rel="noopener">github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.6-Release-Notes</a></li>
</ul>
</div>
`;

// ===== Bài 3.3 =====
const MA33_CFG = java("@SpringBootApplication\npublic class CfgApp {\n    public static void main(String[] args) {\n        var ctx = new SpringApplicationBuilder(CfgApp.class).web(WebApplicationType.NONE).logStartupInfo(false).run(args);\n        for (var a : java.util.List.of(Service.class, Repository.class, Controller.class, Configuration.class))\n            System.out.println(\"@\" + a.getSimpleName() + \" is meta-annotated with @Component? \" + a.isAnnotationPresent(Component.class));\n        System.out.println(\"full config class: \" + ctx.getBean(FullConfig.class).getClass().getSimpleName());\n        System.out.println(\"lite config class: \" + ctx.getBean(LiteConfig.class).getClass().getSimpleName());\n        System.out.println(\"full: policy and audit share one Clock? \" + (ctx.getBean(Policy.class).clock() == ctx.getBean(Audit.class).clock()));\n        System.out.println(\"lite: policy and audit share one Clock? \" + (ctx.getBean(LitePolicy.class).clock() == ctx.getBean(LiteAudit.class).clock()));\n        System.out.println(\"clock bean says: \" + ctx.getBean(\"clock\", Clock.class).instant());\n        ctx.close();\n    }\n}\n\nrecord Policy(Clock clock) {}\nrecord Audit(Clock clock) {}\nrecord LitePolicy(Clock clock) {}\nrecord LiteAudit(Clock clock) {}\n\n@Configuration                          // proxyBeanMethods = true (default)\nclass FullConfig {\n    @Bean Clock clock() {               // a library class: we cannot put @Component on java.time.Clock\n        System.out.println(\"  FullConfig.clock() body runs\");\n        return Clock.fixed(Instant.parse(\"2026-11-19T01:00:00Z\"), ZoneId.of(\"Asia/Ho_Chi_Minh\"));\n    }\n    @Bean Policy policy() { return new Policy(clock()); }   // intercepted: returns the existing bean\n    @Bean Audit audit()   { return new Audit(clock()); }\n}\n\n@Configuration(proxyBeanMethods = false)\nclass LiteConfig {\n    @Bean Clock liteClock() {\n        System.out.println(\"  LiteConfig.liteClock() body runs\");\n        return Clock.fixed(Instant.parse(\"2026-11-19T01:00:00Z\"), ZoneId.of(\"UTC\"));\n    }\n    @Bean LitePolicy litePolicy() { return new LitePolicy(liteClock()); }   // a plain Java call: new Clock each time\n    @Bean LiteAudit liteAudit()   { return new LiteAudit(liteClock()); }\n}");
const OUT33_CFG = out("$ java … CfgApp\n  FullConfig.clock() body runs\n  LiteConfig.liteClock() body runs\n  LiteConfig.liteClock() body runs\n  LiteConfig.liteClock() body runs\n@Service is meta-annotated with @Component? true\n@Repository is meta-annotated with @Component? true\n@Controller is meta-annotated with @Component? true\n@Configuration is meta-annotated with @Component? true\nfull config class: FullConfig$$SpringCGLIB$$0\nlite config class: LiteConfig\nfull: policy and audit share one Clock? true\nlite: policy and audit share one Clock? false\nclock bean says: 2026-11-19T01:00:00Z");

const L33_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>Stereotypes, @Configuration and @Bean</h2>
<p class="lead">There are two ways to put an object into the Spring container: annotate <em>your own</em> class (<code>@Component</code>, <code>@Service</code>, <code>@Repository</code>, <code>@Controller</code>), or write a <code>@Bean</code> method that returns an object — the only way for classes you cannot edit, such as <code>java.time.Clock</code> or a library's HTTP client. This lesson shows what each stereotype really adds, and runs the one detail of <code>@Configuration</code> that interviewers love: why calling a <code>@Bean</code> method twice returns the same object in one class and two different objects in another.</p>

<h3>The stereotype family</h3>
<p>The first four lines of the program below ask Java whether each annotation is itself annotated with <code>@Component</code>:</p>
${OUT33_CFG}
<p>All of them are. To the scanner they are the same thing — "make a bean of this class". What differs is what <em>other</em> parts of Spring do with them:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">@Component</span><span class="v">Generic bean. Use it for helpers that are neither services nor repositories (a clock wrapper, a mapper).</span></div>
  <div class="kv"><span class="k">@Service</span><span class="v">No extra behaviour — it documents "business logic lives here" and lets you target the layer in pointcuts or architecture tests.</span></div>
  <div class="kv"><span class="k">@Repository</span><span class="v">Data access. When a <code>PersistenceExceptionTranslator</code> exists (JPA, Chapter 6), Spring wraps <code>@Repository</code> beans in a proxy that converts vendor exceptions into Spring's <code>DataAccessException</code> hierarchy, so the service layer never depends on Hibernate or PostgreSQL exception classes.</span></div>
  <div class="kv"><span class="k">@Controller / @RestController</span><span class="v">Spring MVC registers their <code>@GetMapping</code>… methods as request handlers. <code>@RestController</code> = <code>@Controller</code> + <code>@ResponseBody</code> (Chapter 4).</span></div>
  <div class="kv"><span class="k">@Configuration</span><span class="v">A class whose purpose is to declare <code>@Bean</code> methods; by default Spring subclasses it with CGLIB (below).</span></div>
</div>
<p>Scanning starts at the package of the <code>@SpringBootApplication</code> class and goes down into sub-packages. A class in a sibling package is simply never seen — the controller-outside-the-package 404 from lesson 0.2. Keep the main class at the root package (<code>com.cuongthai.labflow</code>) and everything else below it.</p>

<h3>@Bean: objects you cannot annotate</h3>
<p>You cannot put <code>@Component</code> on <code>java.time.Clock</code>. Instead a configuration method builds it, and the method's return value becomes a bean named after the method:</p>
${MA33_CFG}
<ul>
  <li><strong>Why a Clock bean at all?</strong> Booking rules ("no booking in the past", "cancel at least 2 hours before") depend on <em>now</em>. If services call <code>LocalDateTime.now()</code>, tests cannot control time. With a <code>Clock</code> bean, production uses the system clock and tests inject <code>Clock.fixed(...)</code> — the output shows the fixed instant <code>2026-11-19T01:00:00Z</code>.</li>
  <li><strong>Other typical @Bean uses:</strong> one configured <code>RestClient</code> per external API (different base URL and timeouts — two beans of the same class), a <code>PasswordEncoder</code> (Chapter 9), choosing an implementation with code (<code>if</code> on a property).</li>
</ul>

<h3>Full vs lite configuration — the output explained</h3>
<ul>
  <li><strong>Full mode</strong> (<code>@Configuration</code>, <code>proxyBeanMethods = true</code> by default): the container uses a generated subclass, <code>FullConfig$$SpringCGLIB$$0</code>. Its <code>clock()</code> is overridden: the first call creates the bean, later calls return the existing one. That is why <code>FullConfig.clock() body runs</code> appears <strong>once</strong> although <code>clock()</code> is called three times (by the container, by <code>policy()</code>, by <code>audit()</code>), and policy and audit share one Clock.</li>
  <li><strong>Lite mode</strong> (<code>proxyBeanMethods = false</code>, or <code>@Bean</code> methods inside a plain <code>@Component</code>): no subclass, <code>liteClock()</code> is an ordinary Java method. Its body ran <strong>three times</strong>; <code>LitePolicy</code> and <code>LiteAudit</code> each received their own Clock that is <em>not</em> the <code>liteClock</code> bean — two hidden, unmanaged objects.</li>
</ul>
<div class="callout warn"><p><strong>A trap we hit while preparing this lesson:</strong> the first version of <code>liteClock()</code> returned <code>Clock.systemUTC()</code>, and the output said "share one Clock? true" even in lite mode. <code>Clock.systemUTC()</code> returns a cached constant, so the bug was invisible. With anything that builds a new object — a connection pool, an HTTP client — lite mode really creates duplicates. Test with objects you control.</p></div>
<p>The correct style in lite mode is to <strong>receive the bean as a parameter</strong> instead of calling the method: <code>@Bean LitePolicy litePolicy(Clock liteClock) { return new LitePolicy(liteClock); }</code>. Spring Boot's own auto-configurations are all <code>proxyBeanMethods = false</code> written this way: no CGLIB subclass to generate, faster startup, and it works in GraalVM native images.</p>

<h3>Two small rules</h3>
<ul>
  <li><strong>Declare <code>BeanPostProcessor</code> and <code>BeanFactoryPostProcessor</code> beans as <code>static</code> @Bean methods</strong> — they must exist before the configuration class itself is processed (you will see one in lesson 3.4).</li>
  <li><strong>Bean names:</strong> <code>@Component</code> ⇒ class name with lower-case first letter; <code>@Bean</code> ⇒ method name; both can be set explicitly (<code>@Component("sms")</code>, <code>@Bean("utcClock")</code>).</li>
</ul>

<h3>In real life and at work</h3>
<p>Everyone in a company is an employee (<code>@Component</code>); job titles — accountant, security guard — tell other departments how to treat them. A temp worker from an agency (<code>@Bean</code>) is not on your payroll, but HR still registers them so the building lets them in. At work you will meet LabFlow-style code where a test fails "only after midnight" or "only on the 31st": the cure is almost always a <code>Clock</code> bean instead of <code>now()</code> scattered through services.</p>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"@Component vs @Service vs @Repository?"</strong> — All are <code>@Component</code> for scanning; <code>@Repository</code> adds persistence exception translation; <code>@Service</code> is semantic; controllers are registered by MVC.</li>
  <li><strong>"When do you use @Bean instead of @Component?"</strong> — For classes you do not own, several configured instances of one class, or creation logic that needs code.</li>
  <li><strong>"What does proxyBeanMethods do?"</strong> — With <code>true</code>, a CGLIB subclass makes inter-<code>@Bean</code> method calls return the container's singleton; with <code>false</code> they are plain calls that create new objects, so you inject beans as method parameters instead.</li>
</ol>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok"><ol>
  <li>Rewrite <code>LiteConfig</code> so that <code>litePolicy</code> and <code>liteAudit</code> receive the clock as a parameter. Run: the body must run once and the answer must be <code>true</code>.</li>
  <li>Add <code>@Bean Clock utcClock()</code> to <code>FullConfig</code>. What happens to a bean that asks for a <code>Clock</code> by type now? Fix it two different ways.</li>
</ol>
<p><strong>Done when:</strong> both configs print "share one Clock? true" with a single body line each.</p></div>
${giai('Show one solution', `${java(`
@Configuration(proxyBeanMethods = false)
class LiteConfig {
    @Bean Clock liteClock() { return Clock.fixed(Instant.parse("2026-11-19T01:00:00Z"), ZoneId.of("UTC")); }
    @Bean LitePolicy litePolicy(Clock liteClock) { return new LitePolicy(liteClock); }   // parameter, not a call
    @Bean LiteAudit liteAudit(Clock liteClock)   { return new LiteAudit(liteClock); }
}`)}
<p>Here the parameter name <code>liteClock</code> also matches the bean name — the parameter-name rule of lesson 3.2 is what saves this injection, because there are already two <code>Clock</code> beans. For question 2: a third Clock makes every by-type injection ambiguous; mark the production clock <code>@Primary</code>, or add <code>@Qualifier("utcClock")</code> at the injection points that want it.</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Stereotype annotation</span><span class="v"><code>@Component</code> and its specialisations that mark a class for scanning.</span></div>
  <div class="kv"><span class="k">@Bean</span><span class="v">A factory method whose return value is registered as a bean.</span></div>
  <div class="kv"><span class="k">@Configuration</span><span class="v">A class of <code>@Bean</code> methods; full mode by default.</span></div>
  <div class="kv"><span class="k">proxyBeanMethods</span><span class="v">Whether <code>@Bean</code> method calls inside the class are intercepted by a CGLIB subclass.</span></div>
  <div class="kv"><span class="k">Exception translation</span><span class="v">Converting vendor persistence exceptions into <code>DataAccessException</code> on <code>@Repository</code> beans.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>All stereotypes are <code>@Component</code>; their difference is what other Spring modules do with them.</li>
  <li><code>@Bean</code> for classes you do not own or several configured instances; a <code>Clock</code> bean makes time testable.</li>
  <li>Full <code>@Configuration</code> intercepts <code>@Bean</code> calls (one object); lite mode does not — inject parameters instead.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.spring.io/spring-framework/reference/core/beans/java/basic-concepts.html', '🌱', 'Spring Framework — @Bean and @Configuration', 'Full vs lite mode explained by the reference documentation.')}

<h3>Sources</h3>
<ul>
  <li>Output above: CfgApp on Spring Boot 4.1.2 / Spring Framework 7.0.10, Temurin 21.0.12.1 (18/11/2026).</li>
  <li>Spring Framework Javadoc, <code>Configuration#proxyBeanMethods</code>: <a href="https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/annotation/Configuration.html" target="_blank" rel="noopener">docs.spring.io</a></li>
</ul>
</div>
`;

const L33_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Annotation phân loại, @Configuration và @Bean</h2>
<p class="lead">Có hai cách đưa một đối tượng vào container Spring: gắn annotation lên class <em>của bạn</em> (<code>@Component</code>, <code>@Service</code>, <code>@Repository</code>, <code>@Controller</code>), hoặc viết một hàm <code>@Bean</code> trả về đối tượng — cách duy nhất cho class bạn không sửa được, như <code>java.time.Clock</code> hay HTTP client của một thư viện. Bài này chỉ ra mỗi annotation phân loại thật sự thêm gì, và chạy thật chi tiết của <code>@Configuration</code> mà phỏng vấn viên rất thích: vì sao gọi một hàm <code>@Bean</code> hai lần trả cùng một đối tượng ở class này, mà hai đối tượng khác nhau ở class kia.</p>

<h3>Họ annotation phân loại</h3>
<p>Bốn dòng đầu của chương trình bên dưới hỏi Java xem mỗi annotation có được gắn <code>@Component</code> bên trên không:</p>
${OUT33_CFG}
<p>Tất cả đều có. Với bộ quét chúng là một — "tạo bean từ class này". Cái khác là các phần <em>khác</em> của Spring làm gì với chúng:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">@Component</span><span class="v">Bean chung. Dùng cho thứ trợ giúp không phải service hay repository (vỏ bọc đồng hồ, bộ ánh xạ).</span></div>
  <div class="kv"><span class="k">@Service</span><span class="v">Không thêm hành vi — nó ghi chú "logic nghiệp vụ ở đây" và cho phép nhắm đúng tầng trong pointcut hay test kiến trúc.</span></div>
  <div class="kv"><span class="k">@Repository</span><span class="v">Truy cập dữ liệu. Khi có <code>PersistenceExceptionTranslator</code> (JPA, Chương 6), Spring bọc bean <code>@Repository</code> trong proxy đổi exception riêng của nhà cung cấp thành họ <code>DataAccessException</code> của Spring, nên tầng service không bao giờ phụ thuộc class exception của Hibernate hay PostgreSQL.</span></div>
  <div class="kv"><span class="k">@Controller / @RestController</span><span class="v">Spring MVC đăng ký các hàm <code>@GetMapping</code>… của chúng làm bộ xử lý request. <code>@RestController</code> = <code>@Controller</code> + <code>@ResponseBody</code> (Chương 4).</span></div>
  <div class="kv"><span class="k">@Configuration</span><span class="v">Class sinh ra để khai báo hàm <code>@Bean</code>; mặc định Spring tạo lớp con của nó bằng CGLIB (bên dưới).</span></div>
</div>
<p>Việc quét bắt đầu từ package của class <code>@SpringBootApplication</code> và đi xuống các package con. Class ở package ngang hàng đơn giản là không bao giờ được thấy — lỗi 404 do controller nằm ngoài package ở bài 0.2. Giữ class main ở package gốc (<code>com.cuongthai.labflow</code>) và mọi thứ khác nằm dưới nó.</p>

<h3>@Bean: đối tượng bạn không gắn annotation được</h3>
<p>Bạn không thể gắn <code>@Component</code> lên <code>java.time.Clock</code>. Thay vào đó một hàm cấu hình dựng nó, và giá trị trả về trở thành bean mang tên của hàm:</p>
${MA33_CFG}
<ul>
  <li><strong>Sao lại cần bean Clock?</strong> Luật đặt lịch ("không đặt vào quá khứ", "huỷ trước ít nhất 2 giờ") phụ thuộc <em>bây giờ</em>. Nếu service gọi <code>LocalDateTime.now()</code>, test không điều khiển được thời gian. Có bean <code>Clock</code>, production dùng đồng hồ hệ thống còn test tiêm <code>Clock.fixed(...)</code> — output cho thấy thời điểm cố định <code>2026-11-19T01:00:00Z</code>.</li>
  <li><strong>Các chỗ khác hay dùng @Bean:</strong> mỗi API bên ngoài một <code>RestClient</code> đã cấu hình (URL gốc và timeout khác nhau — hai bean cùng class), một <code>PasswordEncoder</code> (Chương 9), chọn cài đặt bằng mã (<code>if</code> theo một thuộc tính).</li>
</ul>

<h3>Cấu hình full và lite — giải thích output</h3>
<ul>
  <li><strong>Chế độ full</strong> (<code>@Configuration</code>, mặc định <code>proxyBeanMethods = true</code>): container dùng lớp con sinh ra, <code>FullConfig$$SpringCGLIB$$0</code>. Hàm <code>clock()</code> của nó bị ghi đè: lần gọi đầu tạo bean, các lần sau trả bean đã có. Vì vậy <code>FullConfig.clock() body runs</code> xuất hiện <strong>một lần</strong> dù <code>clock()</code> bị gọi ba lần (bởi container, bởi <code>policy()</code>, bởi <code>audit()</code>), và policy với audit dùng chung một Clock.</li>
  <li><strong>Chế độ lite</strong> (<code>proxyBeanMethods = false</code>, hoặc hàm <code>@Bean</code> trong một <code>@Component</code> thường): không có lớp con, <code>liteClock()</code> là hàm Java bình thường. Thân hàm chạy <strong>ba lần</strong>; <code>LitePolicy</code> và <code>LiteAudit</code> mỗi cái nhận một Clock riêng <em>không phải</em> bean <code>liteClock</code> — hai đối tượng ẩn, không ai quản lý.</li>
</ul>
<div class="callout warn"><p><strong>Một cái bẫy ta gặp khi soạn bài này:</strong> bản đầu của <code>liteClock()</code> trả <code>Clock.systemUTC()</code>, và output báo "share one Clock? true" ngay cả ở chế độ lite. <code>Clock.systemUTC()</code> trả một hằng đã lưu sẵn, nên lỗi vô hình. Với thứ gì tạo đối tượng mới — pool kết nối, HTTP client — chế độ lite thật sự tạo bản trùng. Hãy thử bằng đối tượng bạn kiểm soát.</p></div>
<p>Cách viết đúng ở chế độ lite là <strong>nhận bean qua tham số</strong> thay vì gọi hàm: <code>@Bean LitePolicy litePolicy(Clock liteClock) { return new LitePolicy(liteClock); }</code>. Mọi auto-configuration của chính Spring Boot đều là <code>proxyBeanMethods = false</code> viết theo cách này: không phải sinh lớp con CGLIB, khởi động nhanh hơn, và chạy được trong ảnh GraalVM native.</p>

<h3>Hai luật nhỏ</h3>
<ul>
  <li><strong>Khai báo bean <code>BeanPostProcessor</code> và <code>BeanFactoryPostProcessor</code> bằng hàm @Bean <code>static</code></strong> — chúng phải tồn tại trước khi chính class cấu hình được xử lý (bạn sẽ thấy một cái ở bài 3.4).</li>
  <li><strong>Tên bean:</strong> <code>@Component</code> ⇒ tên class với chữ đầu viết thường; <code>@Bean</code> ⇒ tên hàm; cả hai đặt rõ được (<code>@Component("sms")</code>, <code>@Bean("utcClock")</code>).</li>
</ul>

<h3>Đời thường và đi làm</h3>
<p>Mọi người trong công ty đều là nhân viên (<code>@Component</code>); chức danh — kế toán, bảo vệ — cho các phòng khác biết cách làm việc với họ. Người làm thời vụ từ công ty cung ứng (<code>@Bean</code>) không nằm trong bảng lương của bạn, nhưng phòng nhân sự vẫn đăng ký để toà nhà cho họ vào. Đi làm bạn sẽ gặp mã kiểu LabFlow có test hỏng "chỉ sau nửa đêm" hay "chỉ vào ngày 31": cách chữa gần như luôn là một bean <code>Clock</code> thay cho <code>now()</code> rải khắp các service.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"@Component, @Service, @Repository khác nhau gì?"</strong> — Đều là <code>@Component</code> khi quét; <code>@Repository</code> thêm chuyển đổi exception tầng dữ liệu; <code>@Service</code> mang nghĩa; controller được MVC đăng ký.</li>
  <li><strong>"Khi nào dùng @Bean thay vì @Component?"</strong> — Với class bạn không sở hữu, nhiều thể hiện đã cấu hình của cùng một class, hoặc logic tạo cần viết mã.</li>
  <li><strong>"proxyBeanMethods làm gì?"</strong> — Với <code>true</code>, lớp con CGLIB làm cho lời gọi giữa các hàm <code>@Bean</code> trả singleton của container; với <code>false</code> chúng là lời gọi thường tạo đối tượng mới, nên phải tiêm bean qua tham số hàm.</li>
</ol>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok"><ol>
  <li>Viết lại <code>LiteConfig</code> để <code>litePolicy</code> và <code>liteAudit</code> nhận đồng hồ qua tham số. Chạy: thân hàm phải chạy một lần và câu trả lời phải là <code>true</code>.</li>
  <li>Thêm <code>@Bean Clock utcClock()</code> vào <code>FullConfig</code>. Bean nào xin <code>Clock</code> theo kiểu giờ sẽ ra sao? Sửa bằng hai cách khác nhau.</li>
</ol>
<p><strong>Đạt khi:</strong> cả hai cấu hình in "share one Clock? true" và mỗi cái chỉ có một dòng thân hàm.</p></div>
${giai('Xem một lời giải', `${java(`
@Configuration(proxyBeanMethods = false)
class LiteConfig {
    @Bean Clock liteClock() { return Clock.fixed(Instant.parse("2026-11-19T01:00:00Z"), ZoneId.of("UTC")); }
    @Bean LitePolicy litePolicy(Clock liteClock) { return new LitePolicy(liteClock); }   // parameter, not a call
    @Bean LiteAudit liteAudit(Clock liteClock)   { return new LiteAudit(liteClock); }
}`)}
<p>Ở đây tên tham số <code>liteClock</code> cũng trùng tên bean — chính luật tên tham số của bài 3.2 cứu lần tiêm này, vì đã có hai bean <code>Clock</code>. Câu 2: Clock thứ ba làm mọi lần tiêm theo kiểu bị nhập nhằng; đánh dấu đồng hồ production là <code>@Primary</code>, hoặc thêm <code>@Qualifier("utcClock")</code> ở những chỗ tiêm cần nó.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Annotation phân loại (stereotype)</span><span class="v"><code>@Component</code> và các dạng chuyên biệt của nó, đánh dấu class để quét.</span></div>
  <div class="kv"><span class="k">@Bean</span><span class="v">Hàm nhà máy có giá trị trả về được đăng ký làm bean.</span></div>
  <div class="kv"><span class="k">@Configuration</span><span class="v">Class chứa các hàm <code>@Bean</code>; mặc định ở chế độ full.</span></div>
  <div class="kv"><span class="k">proxyBeanMethods</span><span class="v">Lời gọi hàm <code>@Bean</code> bên trong class có bị lớp con CGLIB chặn lại hay không.</span></div>
  <div class="kv"><span class="k">Chuyển đổi exception</span><span class="v">Đổi exception tầng lưu trữ của nhà cung cấp thành <code>DataAccessException</code> trên bean <code>@Repository</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Mọi annotation phân loại đều là <code>@Component</code>; khác nhau ở chỗ các module Spring khác làm gì với chúng.</li>
  <li><code>@Bean</code> cho class không thuộc về bạn hoặc nhiều thể hiện đã cấu hình; bean <code>Clock</code> giúp test được thời gian.</li>
  <li><code>@Configuration</code> full chặn lời gọi <code>@Bean</code> (một đối tượng); chế độ lite thì không — hãy tiêm qua tham số.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.spring.io/spring-framework/reference/core/beans/java/basic-concepts.html', '🌱', 'Spring Framework — @Bean and @Configuration', 'Tài liệu chính thức giải thích chế độ full và lite.')}

<h3>Nguồn</h3>
<ul>
  <li>Output ở trên: CfgApp trên Spring Boot 4.1.2 / Spring Framework 7.0.10, Temurin 21.0.12.1 (18/11/2026).</li>
  <li>Javadoc Spring Framework, <code>Configuration#proxyBeanMethods</code>: <a href="https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/annotation/Configuration.html" target="_blank" rel="noopener">docs.spring.io</a></li>
</ul>
</div>
`;

// ===== Bài 3.4 =====
const MA34_LIFE = java("@SpringBootApplication\npublic class LifeApp {\n    public static void main(String[] args) {\n        var ctx = new SpringApplicationBuilder(LifeApp.class).web(WebApplicationType.NONE).logStartupInfo(false).run(args);\n        System.out.println(\"---- using the beans\");\n        var holder = ctx.getBean(CartHolder.class);\n        System.out.println(\"prototype injected into singleton: \" + holder.injected().id() + \", \" + holder.injected().id());\n        System.out.println(\"prototype via ObjectProvider:      \" + holder.fresh().id() + \", \" + holder.fresh().id());\n        System.out.println(\"---- ctx.close()\");\n        ctx.close();\n    }\n\n    @Bean(initMethod = \"openPool\", destroyMethod = \"closePool\")\n    static SmsGateway smsGateway() { return new SmsGateway(); }\n\n    @Bean\n    static BeanPostProcessor tracer() {             // static: created before other beans\n        return new BeanPostProcessor() {\n            public Object postProcessBeforeInitialization(Object bean, String name) {\n                if (bean instanceof SmsGateway) System.out.println(\" 4. BeanPostProcessor BEFORE init (\" + name + \")\");\n                return bean;\n            }\n            public Object postProcessAfterInitialization(Object bean, String name) {\n                if (bean instanceof SmsGateway) System.out.println(\" 8. BeanPostProcessor AFTER init  <- proxies are made here\");\n                return bean;\n            }\n        };\n    }\n}\n\nclass SmsGateway implements BeanNameAware, InitializingBean, DisposableBean, SmartLifecycle {\n    private PhoneBook phoneBook;\n    private volatile boolean running;\n    SmsGateway()                            { System.out.println(\" 1. constructor\"); }\n    @Autowired void setPhoneBook(PhoneBook p) { this.phoneBook = p; System.out.println(\" 2. @Autowired setter (dependencies injected)\"); }\n    public void setBeanName(String name)    { System.out.println(\" 3. BeanNameAware.setBeanName(\\\"\" + name + \"\\\")\"); }\n    @PostConstruct void postConstruct()     { System.out.println(\" 5. @PostConstruct\"); }\n    public void afterPropertiesSet()        { System.out.println(\" 6. InitializingBean.afterPropertiesSet()\"); }\n    void openPool()                         { System.out.println(\" 7. @Bean(initMethod = \\\"openPool\\\")\"); }\n    public void start()                     { running = true; System.out.println(\" 9. SmartLifecycle.start()  (after ALL singletons exist)\"); }\n    @EventListener(ApplicationReadyEvent.class)\n    void ready()                            { System.out.println(\"10. ApplicationReadyEvent: app is ready\"); }\n    public void stop()                      { running = false; System.out.println(\"11. SmartLifecycle.stop()\"); }\n    public boolean isRunning()              { return running; }\n    @PreDestroy void preDestroy()           { System.out.println(\"12. @PreDestroy\"); }\n    public void destroy()                   { System.out.println(\"13. DisposableBean.destroy()\"); }\n    void closePool()                        { System.out.println(\"14. @Bean(destroyMethod = \\\"closePool\\\")\"); }\n}\n\n@Component\nclass PhoneBook {\n    PhoneBook() { System.out.println(\" 0. (dependency PhoneBook created first)\"); }\n}\n\n@Component\n@Scope(\"prototype\")\nclass Cart {\n    private static final AtomicInteger SEQ = new AtomicInteger();\n    private final int id = SEQ.incrementAndGet();\n    int id() { return id; }\n    @PreDestroy void bye() { System.out.println(\"    Cart \" + id + \" @PreDestroy\"); }   // never printed: prototypes are not destroyed by the container\n}\n\n@Component\nclass CartHolder {\n    private final Cart cart;                       // injected ONCE, when CartHolder is built\n    private final ObjectProvider<Cart> carts;      // asks the container every time\n    CartHolder(Cart cart, ObjectProvider<Cart> carts) { this.cart = cart; this.carts = carts; }\n    Cart injected() { return cart; }\n    Cart fresh() { return carts.getObject(); }\n}");
const OUT34_LIFE = out("$ java … LifeApp\n 0. (dependency PhoneBook created first)\n 1. constructor\n 2. @Autowired setter (dependencies injected)\n 3. BeanNameAware.setBeanName(\"smsGateway\")\n 4. BeanPostProcessor BEFORE init (smsGateway)\n 5. @PostConstruct\n 6. InitializingBean.afterPropertiesSet()\n 7. @Bean(initMethod = \"openPool\")\n 8. BeanPostProcessor AFTER init  <- proxies are made here\n 9. SmartLifecycle.start()  (after ALL singletons exist)\n10. ApplicationReadyEvent: app is ready\n---- using the beans\nprototype injected into singleton: 1, 1\nprototype via ObjectProvider:      2, 3\n---- ctx.close()\n11. SmartLifecycle.stop()\n12. @PreDestroy\n13. DisposableBean.destroy()\n14. @Bean(destroyMethod = \"closePool\")");
const MA34_SCOPE = java("@SpringBootApplication\npublic class ScopeApp {\n    public static void main(String[] args) { SpringApplication.run(ScopeApp.class, args); }\n}\n\n@Component\n@RequestScope                       // one instance per HTTP request; injected as a scoped proxy\nclass RequestInfo {\n    private static final AtomicInteger SEQ = new AtomicInteger();\n    private final int id = SEQ.incrementAndGet();\n    int id() { return id; }\n}\n\n@RestController\nclass ScopeController {\n    private final RequestInfo info;              // a proxy that finds \"this request's\" RequestInfo\n    ScopeController(RequestInfo info) { this.info = info; }\n\n    @GetMapping(\"/scope\")\n    String scope() {\n        return \"controller=\" + System.identityHashCode(this) + \" injected=\" + info.getClass().getSimpleName()\n                + \" requestInfo.id=\" + info.id() + \",\" + info.id() + \"\\n\";\n    }\n}\n\n@RestController\nclass ProfileController {\n    private String currentStudent;               // BUG: state in a singleton, shared by all request threads\n\n    @GetMapping(\"/me/buggy\")\n    String buggy(@RequestHeader(\"X-Student\") String student) throws InterruptedException {\n        currentStudent = student;\n        Thread.sleep(50);                        // load the profile from the DB…\n        return student + \" -> profile of \" + currentStudent + \"\\n\";\n    }\n\n    @GetMapping(\"/me/fixed\")\n    String fixed(@RequestHeader(\"X-Student\") String student) throws InterruptedException {\n        String current = student;                // local variable: lives on this thread's stack\n        Thread.sleep(50);\n        return student + \" -> profile of \" + current + \"\\n\";\n    }\n}");
const OUT34_LEAK = out("$ ./leak.sh buggy   # 200 requests, 50 at a time, 20 different students\nwrong profile: 182 / 200\nsv6 -> profile of sv10\nsv7 -> profile of sv10\nsv5 -> profile of sv10\n$ ./leak.sh fixed   # 200 requests, 50 at a time, 20 different students\nwrong profile: 0 / 200\n$ ./leak.sh buggy   # 200 requests, 50 at a time, 20 different students");
const OUT34_NODE = out("$ node profile-leak.mjs     # Node.js 22.22.2\nbuggy: wrong profile 19/20 [ 'sv0 -> profile of sv19', 'sv1 -> profile of sv19' ]\nfixed: wrong profile 0/20 []");

const L34_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.4</span>
<h2>Bean lifecycle and scopes</h2>
<p class="lead">A bean is born, wired, initialised, possibly wrapped in a proxy, used for hours or days, and finally destroyed when the application shuts down. Knowing the exact order of those steps tells you where to open a connection pool, where a proxy appears, and why a <code>@PreDestroy</code> sometimes never runs. The second half of the lesson is about <strong>scope</strong> — how many instances exist — and ends with the most expensive beginner bug in Spring web apps: state stored in a singleton, which we measure leaking one student's profile to another in 182 of 200 requests.</p>

<h3>The lifecycle, printed step by step</h3>
<p><code>SmsGateway</code> implements every callback Spring offers, and a <code>BeanPostProcessor</code> reports when it touches this bean. A prototype <code>Cart</code> is used at the end.</p>
${MA34_LIFE}
${OUT34_LIFE}
<div class="kv-grid">
  <div class="kv"><span class="k">0–2 · construct and inject</span><span class="v">Dependencies first (<code>PhoneBook</code>), then the constructor, then setter/field injection. With constructor injection, steps 1 and 2 are the same step.</span></div>
  <div class="kv"><span class="k">3 · Aware callbacks</span><span class="v"><code>BeanNameAware</code>, <code>ApplicationContextAware</code>… hand the bean pieces of the container. Rarely needed in application code.</span></div>
  <div class="kv"><span class="k">4 and 8 · BeanPostProcessor</span><span class="v">Runs around initialisation for <em>every</em> bean. The "after" hook may return a <strong>different object</strong> — this is where Spring substitutes a proxy for <code>@Transactional</code>, <code>@Async</code>, <code>@Cacheable</code> (lesson 3.5). From step 8 on, other beans receive the proxy, not your object.</span></div>
  <div class="kv"><span class="k">5–7 · init callbacks</span><span class="v">Order: <code>@PostConstruct</code> ⇒ <code>InitializingBean.afterPropertiesSet()</code> ⇒ <code>@Bean(initMethod)</code>. Use <code>@PostConstruct</code> in your classes; <code>initMethod</code> for library classes you cannot annotate; avoid <code>InitializingBean</code> (it ties your class to Spring).</span></div>
  <div class="kv"><span class="k">9 · SmartLifecycle.start()</span><span class="v">Runs after <strong>all</strong> singletons exist — the right place to start something that runs: a message consumer, a scheduler, the embedded web server itself.</span></div>
  <div class="kv"><span class="k">10 · ApplicationReadyEvent</span><span class="v">The app is fully up. Good for warm-up work (load a cache) that should not delay or break startup.</span></div>
  <div class="kv"><span class="k">11–14 · shutdown</span><span class="v">Reverse order: stop running work, then <code>@PreDestroy</code> ⇒ <code>DisposableBean.destroy()</code> ⇒ <code>destroyMethod</code>. Close pools, flush buffers.</span></div>
</div>
<ul>
  <li><strong>An exception in <code>@PostConstruct</code> aborts startup.</strong> That is good for "config file missing", bad for "call a remote API that is sometimes slow" — put the latter in <code>ApplicationReadyEvent</code> with a timeout.</li>
  <li><strong>Destroy callbacks need a graceful shutdown.</strong> <code>ctx.close()</code>, Ctrl+C and <code>docker stop</code> (SIGTERM) run them; <code>kill -9</code> or an out-of-memory kill (exit 137, lesson 2.6) does not. Never rely on <code>@PreDestroy</code> alone to save important data.</li>
</ul>

<h3>Scopes: how many instances?</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">singleton (default)</span><span class="v">One per container, shared by every thread. 95% of beans: services, repositories, controllers.</span></div>
  <div class="kv"><span class="k">prototype</span><span class="v">A new instance for every injection or <code>getBean</code>. Spring creates and initialises it, then forgets it: <strong>no destroy callbacks</strong>. In the output, <code>Cart</code>'s <code>@PreDestroy</code> line never appears.</span></div>
  <div class="kv"><span class="k">request</span><span class="v">One per HTTP request (web apps only).</span></div>
  <div class="kv"><span class="k">session</span><span class="v">One per HTTP session — rare in token-based REST APIs.</span></div>
  <div class="kv"><span class="k">application / websocket</span><span class="v">One per <code>ServletContext</code> / per WebSocket session.</span></div>
</div>

<h3>The prototype-in-singleton trap</h3>
<p>The output line <code>prototype injected into singleton: 1, 1</code> surprises everyone once. <code>CartHolder</code> is a singleton, built once, so its constructor received <em>one</em> <code>Cart</code> — forever. "Prototype" only means the container makes a new one <em>each time it is asked</em>, and it was asked only once. Ask the container on every use instead: <code>ObjectProvider&lt;Cart&gt;.getObject()</code> returned 2, then 3. (Alternatives: a <code>@Lookup</code> method, or a scoped proxy as below.)</p>

<h3>Request scope through a proxy</h3>
<p>How can a singleton controller hold a request-scoped bean when the request does not exist yet at startup? Spring injects a <strong>scoped proxy</strong>: a stand-in that, on every method call, finds the instance belonging to the current request.</p>
${MA34_SCOPE}
${out(`$ for i in 1 2 3; do curl -s localhost:8080/scope; done
controller=1714049382 injected=RequestInfo$$SpringCGLIB$$0 requestInfo.id=1,1
controller=1714049382 injected=RequestInfo$$SpringCGLIB$$0 requestInfo.id=2,2
controller=1714049382 injected=RequestInfo$$SpringCGLIB$$0 requestInfo.id=3,3`)}
<p>Same controller object every time; the field holds a CGLIB proxy; within one request both calls reach instance 1, the next request gets instance 2. <code>@RequestScope</code> already sets <code>proxyMode = TARGET_CLASS</code> for you.</p>

<h3>⚠️ State in a singleton: measured</h3>
<p><code>ProfileController</code> (in the code above) stores the student from the header in a field, "loads the profile" for 50 ms, then answers. We fire 200 requests, 50 at a time, for 20 different students:</p>
${OUT34_LEAK}
<p>182 of 200 students received someone else's profile (192 and 188 in two more runs); the fixed version, using a local variable, was wrong 0 times in all three. Tomcat serves requests on up to 200 threads, and they all share the one controller object — the field is a single whiteboard every receptionist writes on. Local variables live on each thread's own stack. The rule: <strong>singleton beans hold only dependencies and configuration (final fields), never per-request or per-user data.</strong> Per-request data goes in parameters, local variables, or a request-scoped bean.</p>
<p>Node.js developers are not immune. One thread, but every <code>await</code> lets other requests run in between — a module-level variable behaves exactly like the singleton field:</p>
${OUT34_NODE}

<h3>🕵️ Real incident — Steam, 25 December 2015</h3>
<div class="callout warn"><p>On Christmas Day 2015, while Steam was under a DoS attack, a new <strong>caching configuration</strong> was deployed that wrongly cached pages generated for logged-in users. For about an hour and a half (11:50–13:20 PST), users who opened account pages could be served a page built for <em>another</em> user — Valve estimated about <strong>34,000</strong> users' pages were shown to others, with billing and email addresses and partial card digits; full card numbers and passwords were not exposed. It was not a Spring bean, but it is the same bug class as our measurement: per-user data stored in a place shared by everyone.</p>
<p><strong>How to prevent it:</strong> keep singletons stateless (fields <code>final</code>, injected once); never store "current user" outside the request; when you cache (Chapter 13), put the user in the cache key and mark user-specific responses <code>Cache-Control: private, no-store</code>; add a concurrent test like ours to code review checklists for anything that touches per-user data.</p></div>

<h3>In real life and at work</h3>
<p>A clinic with one shared clipboard at reception: each receptionist writes "now serving: <em>name</em>", walks to the back for the file, comes back and reads the clipboard — which another receptionist has overwritten meanwhile. Each receptionist needs her own notepad (a local variable). At work, this bug passes every manual test (one tester, one request at a time) and appears only under real traffic — which is why code review in Spring teams treats a non-final field in a <code>@Service</code> or <code>@RestController</code> as a red flag.</p>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"Describe the bean lifecycle."</strong> — Instantiate ⇒ inject ⇒ Aware ⇒ BeanPostProcessor before ⇒ @PostConstruct / afterPropertiesSet / init-method ⇒ BeanPostProcessor after (proxy) ⇒ in use ⇒ @PreDestroy / destroy / destroy-method on close.</li>
  <li><strong>"What is the default scope, and is a singleton bean thread-safe?"</strong> — Singleton. It is thread-safe only if it is stateless or its state is immutable/synchronised; Spring does not make it safe.</li>
  <li><strong>"You inject a prototype bean into a singleton. What happens?"</strong> — You get one instance forever; use <code>ObjectProvider</code>, <code>@Lookup</code> or a scoped proxy to get a new one per use.</li>
  <li><strong>"Is @PreDestroy called for prototypes? On kill -9?"</strong> — No and no.</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
  <li>Add a <code>@RequestScope</code> bean <code>CurrentStudent</code> with <code>set/get</code>, inject it into <code>ProfileController</code>, and write <code>/me/scoped</code> that stores the header there instead of in a field.</li>
  <li>Run the 200-request test against <code>/me/scoped</code> three times.</li>
  <li>Explain in two sentences why this works although the controller is still a singleton.</li>
</ol>
<p><strong>Done when:</strong> <code>/me/scoped</code> reports <code>wrong profile: 0 / 200</code> in three runs.</p></div>
${giai('Show one solution', `${java(`
@Component
@RequestScope
class CurrentStudent {
    private String name;
    void set(String name) { this.name = name; }
    String get() { return name; }
}

@RestController
class ScopedProfileController {
    private final CurrentStudent current;               // a proxy, resolved per request
    ScopedProfileController(CurrentStudent current) { this.current = current; }

    @GetMapping("/me/scoped")
    String scoped(@RequestHeader("X-Student") String student) throws InterruptedException {
        current.set(student);
        Thread.sleep(50);
        return student + " -> profile of " + current.get() + "\\n";
    }
}`)}
${out(`$ ./leak.sh scoped   # 3 runs
wrong profile: 0 / 200
wrong profile: 0 / 200
wrong profile: 0 / 200`)}
<p>The field holds a proxy, not a <code>CurrentStudent</code>; each call on the proxy looks up the instance stored in the current request's attributes, and each request thread has its own request. The shared object is only the proxy, which has no state of its own.</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">@PostConstruct / @PreDestroy</span><span class="v">Jakarta annotations for init after injection and cleanup before destruction.</span></div>
  <div class="kv"><span class="k">BeanPostProcessor</span><span class="v">A hook around every bean's initialisation; may return a proxy.</span></div>
  <div class="kv"><span class="k">SmartLifecycle</span><span class="v">start/stop for components that run, ordered by phase, after all singletons exist.</span></div>
  <div class="kv"><span class="k">Scope</span><span class="v">How many instances of a bean exist and for how long.</span></div>
  <div class="kv"><span class="k">Scoped proxy</span><span class="v">A stand-in injected into longer-lived beans that resolves the shorter-lived instance on each call.</span></div>
  <div class="kv"><span class="k">Stateless bean</span><span class="v">Holds only final dependencies/configuration; safe to share between threads.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Order: construct ⇒ inject ⇒ Aware ⇒ BPP before ⇒ init callbacks ⇒ BPP after (proxy) ⇒ lifecycle start ⇒ ready ⇒ … ⇒ destroy callbacks.</li>
  <li><code>@PostConstruct</code> for setup, <code>ApplicationReadyEvent</code> for slow warm-up, destroy callbacks only on graceful shutdown.</li>
  <li>Prototype into singleton = one instance; use <code>ObjectProvider</code>.</li>
  <li>Never keep per-request data in a singleton: 182/200 wrong profiles measured; Steam 2015 is the same bug class.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.spring.io/spring-framework/reference/core/beans/factory-nature.html', '🌱', 'Spring Framework — Customizing the Nature of a Bean', 'Lifecycle callbacks, Aware interfaces and SmartLifecycle.')}
${tl('https://docs.spring.io/spring-framework/reference/core/beans/factory-scopes.html', '🌱', 'Spring Framework — Bean Scopes', 'Singleton, prototype, web scopes and scoped proxies.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: LifeApp, ScopeApp (Tomcat 11.0.27, curl from a second container, 3 runs of the 200-request test) on Spring Boot 4.1.2; profile-leak.mjs on Node.js 22.22.2 (18/11/2026).</li>
  <li>Valve, "Steam Store Christmas issue" (30/12/2015): <a href="https://store.steampowered.com/oldnews/19852" target="_blank" rel="noopener">store.steampowered.com/oldnews/19852</a>; Engadget, "Steam's Christmas privacy issues affected 34,000 users": <a href="https://www.engadget.com/2015/12/30/steams-christmas-privacy-issues-affected-34-000-users/" target="_blank" rel="noopener">engadget.com</a></li>
</ul>
</div>
`;

const L34_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>Vòng đời bean và scope</h2>
<p class="lead">Một bean được sinh ra, được nối phụ thuộc, được khởi tạo, có thể bị bọc trong proxy, được dùng hàng giờ hay hàng ngày, và cuối cùng bị huỷ khi ứng dụng tắt. Biết đúng thứ tự các bước đó cho bạn biết nên mở pool kết nối ở đâu, proxy xuất hiện ở đâu, và vì sao <code>@PreDestroy</code> đôi khi không bao giờ chạy. Nửa sau bài nói về <strong>scope</strong> — có bao nhiêu thể hiện — và kết thúc bằng lỗi tốn kém nhất của người mới làm web Spring: trạng thái cất trong singleton, ta đo được nó làm lộ hồ sơ sinh viên này cho sinh viên khác ở 182 trên 200 request.</p>

<h3>Vòng đời, in từng bước</h3>
<p><code>SmsGateway</code> cài mọi callback mà Spring có, và một <code>BeanPostProcessor</code> báo lúc nó chạm vào bean này. Cuối chương trình dùng một <code>Cart</code> scope prototype.</p>
${MA34_LIFE}
${OUT34_LIFE}
<div class="kv-grid">
  <div class="kv"><span class="k">0–2 · tạo và tiêm</span><span class="v">Phụ thuộc trước (<code>PhoneBook</code>), rồi constructor, rồi tiêm qua setter/field. Với tiêm qua constructor, bước 1 và 2 là một.</span></div>
  <div class="kv"><span class="k">3 · callback Aware</span><span class="v"><code>BeanNameAware</code>, <code>ApplicationContextAware</code>… đưa cho bean các mảnh của container. Hiếm khi cần trong mã ứng dụng.</span></div>
  <div class="kv"><span class="k">4 và 8 · BeanPostProcessor</span><span class="v">Chạy quanh bước khởi tạo của <em>mọi</em> bean. Móc "after" được phép trả về <strong>một đối tượng khác</strong> — đây là chỗ Spring thay bằng proxy cho <code>@Transactional</code>, <code>@Async</code>, <code>@Cacheable</code> (bài 3.5). Từ bước 8, bean khác nhận proxy, không nhận đối tượng của bạn.</span></div>
  <div class="kv"><span class="k">5–7 · callback khởi tạo</span><span class="v">Thứ tự: <code>@PostConstruct</code> ⇒ <code>InitializingBean.afterPropertiesSet()</code> ⇒ <code>@Bean(initMethod)</code>. Dùng <code>@PostConstruct</code> trong class của bạn; <code>initMethod</code> cho class thư viện không gắn annotation được; tránh <code>InitializingBean</code> (nó trói class vào Spring).</span></div>
  <div class="kv"><span class="k">9 · SmartLifecycle.start()</span><span class="v">Chạy sau khi <strong>mọi</strong> singleton đã có — đúng chỗ để khởi chạy thứ gì đó chạy liên tục: bộ tiêu thụ tin nhắn, bộ hẹn giờ, chính web server nhúng.</span></div>
  <div class="kv"><span class="k">10 · ApplicationReadyEvent</span><span class="v">Ứng dụng đã lên hẳn. Hợp cho việc làm nóng (nạp cache) không nên làm chậm hay làm hỏng việc khởi động.</span></div>
  <div class="kv"><span class="k">11–14 · tắt</span><span class="v">Thứ tự ngược: dừng việc đang chạy, rồi <code>@PreDestroy</code> ⇒ <code>DisposableBean.destroy()</code> ⇒ <code>destroyMethod</code>. Đóng pool, xả bộ đệm.</span></div>
</div>
<ul>
  <li><strong>Exception trong <code>@PostConstruct</code> làm hỏng khởi động.</strong> Tốt cho "thiếu tệp cấu hình", xấu cho "gọi một API ngoài đôi khi chậm" — việc sau nên để ở <code>ApplicationReadyEvent</code> kèm timeout.</li>
  <li><strong>Callback huỷ cần tắt êm.</strong> <code>ctx.close()</code>, Ctrl+C và <code>docker stop</code> (SIGTERM) chạy chúng; <code>kill -9</code> hay bị giết vì hết bộ nhớ (exit 137, bài 2.6) thì không. Đừng bao giờ chỉ dựa vào <code>@PreDestroy</code> để lưu dữ liệu quan trọng.</li>
</ul>

<h3>Scope: bao nhiêu thể hiện?</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">singleton (mặc định)</span><span class="v">Một cái mỗi container, mọi luồng dùng chung. 95% bean: service, repository, controller.</span></div>
  <div class="kv"><span class="k">prototype</span><span class="v">Một thể hiện mới cho mỗi lần tiêm hay <code>getBean</code>. Spring tạo và khởi tạo nó rồi quên luôn: <strong>không có callback huỷ</strong>. Trong output, dòng <code>@PreDestroy</code> của <code>Cart</code> không bao giờ xuất hiện.</span></div>
  <div class="kv"><span class="k">request</span><span class="v">Một cái mỗi request HTTP (chỉ ứng dụng web).</span></div>
  <div class="kv"><span class="k">session</span><span class="v">Một cái mỗi phiên HTTP — hiếm gặp trong API REST dùng token.</span></div>
  <div class="kv"><span class="k">application / websocket</span><span class="v">Một cái mỗi <code>ServletContext</code> / mỗi phiên WebSocket.</span></div>
</div>

<h3>Bẫy prototype trong singleton</h3>
<p>Dòng output <code>prototype injected into singleton: 1, 1</code> làm ai cũng bất ngờ một lần. <code>CartHolder</code> là singleton, dựng một lần, nên constructor của nó nhận <em>một</em> <code>Cart</code> — mãi mãi. "Prototype" chỉ có nghĩa container tạo cái mới <em>mỗi lần được hỏi</em>, và nó chỉ được hỏi một lần. Hãy hỏi container ở mỗi lần dùng: <code>ObjectProvider&lt;Cart&gt;.getObject()</code> trả 2, rồi 3. (Cách khác: hàm <code>@Lookup</code>, hoặc scoped proxy như dưới đây.)</p>

<h3>Scope request qua proxy</h3>
<p>Làm sao một controller singleton giữ được bean scope request khi lúc khởi động chưa có request nào? Spring tiêm một <strong>scoped proxy</strong>: kẻ đứng thay, ở mỗi lần gọi hàm sẽ tìm thể hiện thuộc về request hiện tại.</p>
${MA34_SCOPE}
${out(`$ for i in 1 2 3; do curl -s localhost:8080/scope; done
controller=1714049382 injected=RequestInfo$$SpringCGLIB$$0 requestInfo.id=1,1
controller=1714049382 injected=RequestInfo$$SpringCGLIB$$0 requestInfo.id=2,2
controller=1714049382 injected=RequestInfo$$SpringCGLIB$$0 requestInfo.id=3,3`)}
<p>Lần nào cũng cùng một đối tượng controller; field giữ một proxy CGLIB; trong một request cả hai lời gọi tới thể hiện 1, request sau nhận thể hiện 2. <code>@RequestScope</code> đã đặt sẵn <code>proxyMode = TARGET_CLASS</code> cho bạn.</p>

<h3>⚠️ Trạng thái trong singleton: đo thật</h3>
<p><code>ProfileController</code> (trong mã ở trên) cất tên sinh viên lấy từ header vào một field, "nạp hồ sơ" 50 ms, rồi trả lời. Ta bắn 200 request, mỗi lúc 50 cái, cho 20 sinh viên khác nhau:</p>
${OUT34_LEAK}
<p>182 trên 200 sinh viên nhận hồ sơ của người khác (hai lần chạy nữa: 192 và 188); bản đã sửa, dùng biến cục bộ, sai 0 lần trong cả ba. Tomcat phục vụ request trên tối đa 200 luồng, và tất cả dùng chung một đối tượng controller — field là một tấm bảng duy nhất mà mọi lễ tân cùng viết lên. Biến cục bộ nằm trên stack riêng của từng luồng. Luật: <strong>bean singleton chỉ giữ phụ thuộc và cấu hình (field final), không bao giờ giữ dữ liệu của từng request hay từng người dùng.</strong> Dữ liệu theo request đi qua tham số, biến cục bộ, hoặc bean scope request.</p>
<p>Lập trình viên Node.js cũng không miễn nhiễm. Chỉ một luồng, nhưng mỗi <code>await</code> cho request khác chạy xen vào — biến cấp module cư xử y như field của singleton:</p>
${OUT34_NODE}

<h3>🕵️ Sự cố thật — Steam, 25/12/2015</h3>
<div class="callout warn"><p>Ngày Giáng sinh 2015, khi Steam đang bị tấn công từ chối dịch vụ, một <strong>cấu hình cache</strong> mới được triển khai và cache nhầm các trang tạo cho người dùng đã đăng nhập. Trong khoảng một tiếng rưỡi (11:50–13:20 giờ Thái Bình Dương), người mở trang tài khoản có thể nhận trang dựng cho <em>người khác</em> — Valve ước tính trang của khoảng <strong>34 000</strong> người dùng bị hiện cho người khác, có địa chỉ thanh toán, email và vài số cuối thẻ; số thẻ đầy đủ và mật khẩu không bị lộ. Đó không phải bean Spring, nhưng cùng loại lỗi với phép đo của ta: dữ liệu riêng từng người cất ở chỗ mọi người dùng chung.</p>
<p><strong>Cách phòng:</strong> giữ singleton không trạng thái (field <code>final</code>, tiêm một lần); không bao giờ cất "người dùng hiện tại" ra ngoài request; khi cache (Chương 13), đưa người dùng vào khoá cache và đánh dấu phản hồi riêng tư <code>Cache-Control: private, no-store</code>; thêm một bài test đồng thời như của ta vào danh sách review cho mọi thứ chạm dữ liệu riêng từng người.</p></div>

<h3>Đời thường và đi làm</h3>
<p>Một phòng khám chỉ có một tấm bảng kẹp giấy chung ở quầy lễ tân: mỗi lễ tân ghi "đang phục vụ: <em>tên</em>", đi ra sau lấy hồ sơ, quay lại đọc tấm bảng — mà lễ tân khác vừa ghi đè lên. Mỗi lễ tân cần cuốn sổ tay riêng (biến cục bộ). Đi làm, lỗi này qua mọi bài test thủ công (một người thử, mỗi lần một request) và chỉ hiện ra dưới tải thật — vì vậy review mã ở các nhóm Spring coi field không final trong <code>@Service</code> hay <code>@RestController</code> là cờ đỏ.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Mô tả vòng đời bean."</strong> — Tạo ⇒ tiêm ⇒ Aware ⇒ BeanPostProcessor before ⇒ @PostConstruct / afterPropertiesSet / init-method ⇒ BeanPostProcessor after (proxy) ⇒ dùng ⇒ @PreDestroy / destroy / destroy-method khi đóng.</li>
  <li><strong>"Scope mặc định là gì, bean singleton có an toàn luồng không?"</strong> — Singleton. Chỉ an toàn luồng nếu nó không trạng thái hoặc trạng thái bất biến/được đồng bộ; Spring không làm nó an toàn hộ.</li>
  <li><strong>"Tiêm bean prototype vào singleton thì sao?"</strong> — Nhận đúng một thể hiện mãi mãi; dùng <code>ObjectProvider</code>, <code>@Lookup</code> hoặc scoped proxy để mỗi lần dùng có cái mới.</li>
  <li><strong>"@PreDestroy có được gọi cho prototype không? Khi kill -9?"</strong> — Không, và không.</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Thêm bean <code>@RequestScope</code> tên <code>CurrentStudent</code> có <code>set/get</code>, tiêm vào một controller, và viết <code>/me/scoped</code> cất header vào đó thay vì vào field.</li>
  <li>Chạy bài test 200 request với <code>/me/scoped</code> ba lần.</li>
  <li>Giải thích trong hai câu vì sao cách này đúng dù controller vẫn là singleton.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>/me/scoped</code> báo <code>wrong profile: 0 / 200</code> trong ba lần chạy.</p></div>
${giai('Xem một lời giải', `${java(`
@Component
@RequestScope
class CurrentStudent {
    private String name;
    void set(String name) { this.name = name; }
    String get() { return name; }
}

@RestController
class ScopedProfileController {
    private final CurrentStudent current;               // a proxy, resolved per request
    ScopedProfileController(CurrentStudent current) { this.current = current; }

    @GetMapping("/me/scoped")
    String scoped(@RequestHeader("X-Student") String student) throws InterruptedException {
        current.set(student);
        Thread.sleep(50);
        return student + " -> profile of " + current.get() + "\\n";
    }
}`)}
${out(`$ ./leak.sh scoped   # 3 runs
wrong profile: 0 / 200
wrong profile: 0 / 200
wrong profile: 0 / 200`)}
<p>Field giữ một proxy, không phải một <code>CurrentStudent</code>; mỗi lời gọi trên proxy tìm thể hiện cất trong thuộc tính của request hiện tại, và mỗi luồng request có request riêng. Thứ dùng chung chỉ là proxy, mà proxy không có trạng thái riêng.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">@PostConstruct / @PreDestroy</span><span class="v">Annotation Jakarta cho khởi tạo sau khi tiêm và dọn dẹp trước khi huỷ.</span></div>
  <div class="kv"><span class="k">BeanPostProcessor</span><span class="v">Móc quanh bước khởi tạo của mọi bean; có thể trả về proxy.</span></div>
  <div class="kv"><span class="k">SmartLifecycle</span><span class="v">start/stop cho thành phần chạy liên tục, xếp theo phase, sau khi mọi singleton đã có.</span></div>
  <div class="kv"><span class="k">Scope</span><span class="v">Có bao nhiêu thể hiện của một bean và chúng sống bao lâu.</span></div>
  <div class="kv"><span class="k">Scoped proxy</span><span class="v">Kẻ đứng thay được tiêm vào bean sống lâu hơn, ở mỗi lời gọi tìm thể hiện sống ngắn hơn.</span></div>
  <div class="kv"><span class="k">Bean không trạng thái</span><span class="v">Chỉ giữ phụ thuộc/cấu hình final; dùng chung giữa các luồng an toàn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Thứ tự: tạo ⇒ tiêm ⇒ Aware ⇒ BPP before ⇒ callback khởi tạo ⇒ BPP after (proxy) ⇒ lifecycle start ⇒ sẵn sàng ⇒ … ⇒ callback huỷ.</li>
  <li><code>@PostConstruct</code> cho thiết lập, <code>ApplicationReadyEvent</code> cho làm nóng chậm, callback huỷ chỉ chạy khi tắt êm.</li>
  <li>Prototype trong singleton = một thể hiện; dùng <code>ObjectProvider</code>.</li>
  <li>Không bao giờ giữ dữ liệu theo request trong singleton: đo được 182/200 hồ sơ sai; Steam 2015 là cùng loại lỗi.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.spring.io/spring-framework/reference/core/beans/factory-nature.html', '🌱', 'Spring Framework — Customizing the Nature of a Bean', 'Callback vòng đời, interface Aware và SmartLifecycle.')}
${tl('https://docs.spring.io/spring-framework/reference/core/beans/factory-scopes.html', '🌱', 'Spring Framework — Bean Scopes', 'Singleton, prototype, scope web và scoped proxy.')}

<h3>Nguồn</h3>
<ul>
  <li>Output ở trên: LifeApp, ScopeApp (Tomcat 11.0.27, curl từ container thứ hai, 3 lần chạy bài test 200 request) trên Spring Boot 4.1.2; profile-leak.mjs trên Node.js 22.22.2 (18/11/2026).</li>
  <li>Valve, "Steam Store Christmas issue" (30/12/2015): <a href="https://store.steampowered.com/oldnews/19852" target="_blank" rel="noopener">store.steampowered.com/oldnews/19852</a>; Engadget, "Steam's Christmas privacy issues affected 34,000 users": <a href="https://www.engadget.com/2015/12/30/steams-christmas-privacy-issues-affected-34-000-users/" target="_blank" rel="noopener">engadget.com</a></li>
</ul>
</div>
`;

// ===== Bài 3.5 =====
const MA35_HAND = java("/** What Spring does for @Transactional, written by hand with a JDK dynamic proxy. */\npublic class HandProxy {\n    interface BookingService { void book(String student); String ping(); }\n\n    static class RealBookingService implements BookingService {\n        public void book(String student) {\n            System.out.println(\"    INSERT booking for \" + student);\n            if (student.isBlank()) throw new IllegalArgumentException(\"student is blank\");\n        }\n        public String ping() { return \"pong\"; }\n    }\n\n    public static void main(String[] args) {\n        BookingService target = new RealBookingService();\n        InvocationHandler tx = (proxy, method, a) -> {\n            if (!method.getName().equals(\"book\")) return method.invoke(target, a);   // not \"transactional\"\n            System.out.println(\"  BEGIN\");\n            try {\n                Object result = method.invoke(target, a);\n                System.out.println(\"  COMMIT\");\n                return result;\n            } catch (InvocationTargetException e) {\n                System.out.println(\"  ROLLBACK (\" + e.getCause().getMessage() + \")\");\n                throw e.getCause();\n            }\n        };\n        BookingService svc = (BookingService) Proxy.newProxyInstance(\n                BookingService.class.getClassLoader(), new Class<?>[] {BookingService.class}, tx);\n\n        System.out.println(\"class of svc: \" + svc.getClass().getName() + \", is a RealBookingService? \" + (svc instanceof RealBookingService));\n        svc.book(\"an\");\n        try { svc.book(\" \"); } catch (IllegalArgumentException e) { System.out.println(\"caller sees: \" + e.getMessage()); }\n        System.out.println(\"ping -> \" + svc.ping());\n    }\n}");
const OUT35_HAND = out("$ java HandProxy.java\nclass of svc: $Proxy0, is a RealBookingService? false\n  BEGIN\n    INSERT booking for an\n  COMMIT\n  BEGIN\n    INSERT booking for  \n  ROLLBACK (student is blank)\ncaller sees: student is blank\nping -> pong");
const MA35_SVC = java("@Service\npublic class BookingService {\n    private final JdbcClient db;\n    public BookingService(JdbcClient db) { this.db = db; }\n\n    @Transactional\n    public void book(String student, String lab, boolean fail) {\n        db.sql(\"INSERT INTO booking(student, lab) VALUES (?, ?)\").params(student, lab).update();\n        System.out.println(\"   inserted \" + student + \"; transaction active? \"\n                + TransactionSynchronizationManager.isActualTransactionActive());\n        if (fail) throw new IllegalStateException(\"lab is full\");\n    }\n\n    public void bookTwice(String student, String lab) {      // no @Transactional here\n        book(student, lab, false);                            // this.book(...) — the proxy is NOT involved\n        book(student, lab, true);\n    }\n\n    @Transactional\n    public void importCsv(String student) throws IOException {\n        db.sql(\"INSERT INTO booking(student, lab) VALUES (?, 'Lab CSV')\").param(student).update();\n        throw new IOException(\"bad line 7\");\n    }\n\n    public final long countFinal() {                          // CGLIB cannot override a final method\n        return db.sql(\"SELECT count(*) FROM booking\").query(Long.class).single();\n    }\n}");
const OUT35_TX = out("$ java … AopApp --logging.level.org.springframework.jdbc.support.JdbcTransactionManager=debug\nbean class: BookingService$$SpringCGLIB$$0 | AOP proxy? true | CGLIB? true | target: BookingService\nA) external call to @Transactional book() that throws\n  [tx] Creating new transaction with name [com.cuongthai.c3.aop.BookingService.book]: PROPAGATION_REQUIRED,ISOLATION_DEFAULT\n  [tx] Acquired Connection [HikariProxyConnection … PgConnection] for JDBC transaction\n  [tx] Switching JDBC Connection [HikariProxyConnection … PgConnection] to manual commit\n   inserted an; transaction active? true\n  [tx] Initiating transaction rollback\n  [tx] Rolling back JDBC transaction on Connection [HikariProxyConnection … PgConnection]\n  [tx] Releasing JDBC Connection [HikariProxyConnection … PgConnection] after transaction\n   -> IllegalStateException: lab is full\n   rows in booking: 0\nB) bookTwice() calls this.book() twice (self-invocation)\n   inserted binh; transaction active? false\n   inserted binh; transaction active? false\n   -> IllegalStateException: lab is full\n   rows in booking: 2\nC) @Transactional method throws a CHECKED exception\n  [tx] Creating new transaction with name [com.cuongthai.c3.aop.BookingService.importCsv]: PROPAGATION_REQUIRED,ISOLATION_DEFAULT\n  [tx] Acquired Connection [HikariProxyConnection … PgConnection] for JDBC transaction\n  [tx] Switching JDBC Connection [HikariProxyConnection … PgConnection] to manual commit\n  [tx] Initiating transaction commit\n  [tx] Committing JDBC transaction on Connection [HikariProxyConnection … PgConnection]\n  [tx] Releasing JDBC Connection [HikariProxyConnection … PgConnection] after transaction\n   -> IOException: bad line 7\n   rows in booking: 3\nD) final method on the proxy\n   -> NullPointerException: Cannot invoke \"org.springframework.jdbc.core.simple.JdbcClient.sql(String)\" because \"this.db\" is null");
const OUT35_JDK = out("$ java … JdkApp \nby interface: com.cuongthai.c3.jdk.JdbcLabService$$SpringCGLIB$$0\nby class:     com.cuongthai.c3.jdk.JdbcLabService$$SpringCGLIB$$0\n$ java … JdkApp --spring.aop.proxy-target-class=false\nby interface: com.cuongthai.c3.jdk.$Proxy53\nby class:     NoSuchBeanDefinitionException: No qualifying bean of type 'com.cuongthai.c3.jdk.JdbcLabService' available");
const MA35_ASPECT_MAIN = java("@SpringBootApplication\npublic class AspectApp {\n    public static void main(String[] args) {\n        var ctx = new SpringApplicationBuilder(AspectApp.class).web(WebApplicationType.NONE).logStartupInfo(false).run(args);\n        LabAdminService svc = ctx.getBean(LabAdminService.class);\n        CurrentUser.set(\"an (STUDENT)\");\n        System.out.println(\"1) student calls report():\");\n        System.out.println(\"   \" + svc.report());\n        System.out.println(\"2) student calls deleteLab(7) directly:\");\n        try { svc.deleteLab(7); } catch (SecurityException e) { System.out.println(\"   blocked: \" + e.getMessage()); }\n        System.out.println(\"3) student calls cleanup(), which calls this.deleteLab(7) inside:\");\n        svc.cleanup();\n        ctx.close();\n    }\n}");
const MA35_ASPECT = java("@Retention(RetentionPolicy.RUNTIME) @Target(ElementType.METHOD) @interface Timed {}\n@Retention(RetentionPolicy.RUNTIME) @Target(ElementType.METHOD) @interface AdminOnly {}\n\nfinal class CurrentUser {                         // stands in for Spring Security's SecurityContext (Chapter 9)\n    private static final ThreadLocal<String> USER = new ThreadLocal<>();\n    static void set(String u) { USER.set(u); }\n    static String get() { return USER.get(); }\n}\n\n@Aspect\n@Component\nclass TimingAspect {\n    @Around(\"@annotation(com.cuongthai.c3.aspect.Timed)\")\n    Object time(ProceedingJoinPoint jp) throws Throwable {\n        long t0 = System.nanoTime();\n        try { return jp.proceed(); }\n        finally { System.out.printf(\"   [timed] %s took %d ms%n\", jp.getSignature().toShortString(), (System.nanoTime() - t0) / 1_000_000); }\n    }\n}\n\n@Aspect\n@Component\nclass AdminOnlyAspect {\n    @Before(\"@annotation(com.cuongthai.c3.aspect.AdminOnly)\")\n    void check() {\n        if (!CurrentUser.get().contains(\"ADMIN\")) throw new SecurityException(CurrentUser.get() + \" is not ADMIN\");\n    }\n}\n\n@Service\nclass LabAdminService {\n    @Timed\n    public String report() {\n        try { Thread.sleep(120); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }\n        return \"report: 3 labs, 41 bookings\";\n    }\n\n    @AdminOnly\n    public void deleteLab(long id) { System.out.println(\"   !!! DELETE FROM lab WHERE id = \" + id + \"  (ran as \" + CurrentUser.get() + \")\"); }\n\n    public void cleanup() { deleteLab(7); }        // self-invocation: the aspect never sees this call\n}");
const OUT35_ASPECT = out("$ java … AspectApp\n1) student calls report():\n   [timed] LabAdminService.report() took 121 ms\n   report: 3 labs, 41 bookings\n2) student calls deleteLab(7) directly:\n   blocked: an (STUDENT) is not ADMIN\n3) student calls cleanup(), which calls this.deleteLab(7) inside:\n   !!! DELETE FROM lab WHERE id = 7  (ran as an (STUDENT))");
const MA35_FIX = java("@Service\nclass BookingService {\n    private final JdbcClient db;\n    BookingService(JdbcClient db) { this.db = db; }\n\n    @Transactional\n    public void book(String student, String lab) {\n        if (student.isBlank()) throw new IllegalArgumentException(\"student is blank\");\n        db.sql(\"INSERT INTO booking(student, lab) VALUES (?, ?)\").params(student, lab).update();\n    }\n\n    @Transactional(rollbackFor = Exception.class)           // checked exceptions roll back too\n    public void importCsv(String student) throws IOException {\n        db.sql(\"INSERT INTO booking(student, lab) VALUES (?, 'Lab CSV')\").param(student).update();\n        throw new IOException(\"bad line 7\");\n    }\n}\n\n@Service\nclass BatchService {\n    private final BookingService bookings;                  // another bean => calls go through its proxy\n    BatchService(BookingService bookings) { this.bookings = bookings; }\n\n    @Transactional                                          // one transaction around the whole batch\n    public void bookAll(List<String> students, String lab) {\n        for (String s : students) bookings.book(s, lab);    // REQUIRED: joins the outer transaction\n    }\n}");
const OUT35_FIX = out("$ java … FixApp\nB') bookAll failed: student is blank\n   rows in booking: 0\nC') importCsv failed: bad line 7\n   rows in booking: 0");
const OUT35_TXBEANS = out("$ java … TxNames      # bean names containing \"transaction\", without the long class-named ones\ntransactionExecutionListeners\nspring.transaction-org.springframework.boot.transaction.autoconfigure.TransactionProperties\ntransactionManager\ntransactionInterceptor\ntransactionAttributeSource\ntransactionTemplate");

const L35_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.5</span>
<h2>Proxies and AOP: how @Transactional really works</h2>
<p class="lead"><code>@Transactional</code>, <code>@Async</code>, <code>@Cacheable</code>, <code>@PreAuthorize</code> — none of them changes your method. Spring places a <strong>proxy</strong> in front of your bean, and the proxy does the extra work before and after forwarding the call. Once you see that, four famous bugs explain themselves: a method calling another method of the same class skips the transaction, a checked exception commits, a <code>final</code> method crashes with a null field, and a security check is bypassed from inside. We run all four against PostgreSQL, after first writing a proxy by hand.</p>

<h3>A transaction proxy by hand</h3>
<p>The JDK can create, at runtime, an object that implements an interface and routes every call to an <code>InvocationHandler</code>. Our handler prints BEGIN, calls the real service, then COMMIT or ROLLBACK:</p>
${MA35_HAND}
${OUT35_HAND}
<ul>
  <li>The caller holds <code>$Proxy0</code>, a class generated at runtime. It implements <code>BookingService</code> but is <strong>not</strong> a <code>RealBookingService</code>.</li>
  <li>The real object never knows: it just inserts. Begin/commit/rollback live in one place for every method — that is the point of AOP (aspect-oriented programming): cross-cutting concerns (transactions, timing, security, caching) written once, applied to many methods.</li>
  <li><code>ping</code> was forwarded untouched — like a method without <code>@Transactional</code>.</li>
</ul>

<h3>JDK proxy vs CGLIB</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">JDK dynamic proxy</span><span class="v">Implements the bean's <strong>interfaces</strong>. Requires an interface; the proxy cannot be cast to the class.</span></div>
  <div class="kv"><span class="k">CGLIB proxy</span><span class="v">Generates a <strong>subclass</strong> of the bean's class (<code>BookingService$$SpringCGLIB$$0</code>) and overrides its methods. Works without interfaces; cannot override <code>final</code>/<code>private</code>/<code>static</code> methods.</span></div>
</div>
<p>Spring Boot defaults to CGLIB for everything (<code>spring.aop.proxy-target-class=true</code>), precisely so that injecting by class always works. Switching it off shows the difference:</p>
${OUT35_JDK}

<h3>@Transactional against a real database — four cases</h3>
${MA35_SVC}
${OUT35_TX}
<p>What sits in front of the bean is a <code>TransactionInterceptor</code> bean registered by auto-configuration — the "advice" that our hand-written handler imitated:</p>
${OUT35_TXBEANS}
<div class="kv-grid">
  <div class="kv"><span class="k">A · works</span><span class="v">The call came from outside, through the proxy: the log shows <em>Creating new transaction … PROPAGATION_REQUIRED</em>, the insert, <em>Rolling back</em>. 0 rows. Exactly our hand-made proxy.</span></div>
  <div class="kv"><span class="k">B · self-invocation</span><span class="v"><code>bookTwice()</code> has no annotation, so the proxy just forwards it. Inside, <code>book(...)</code> means <code>this.book(...)</code> — <code>this</code> is the real object, not the proxy. No transaction at all ("transaction active? false"): the first insert committed on its own, the second failed. <strong>2 rows of half-done work</strong>, no error log about transactions.</span></div>
  <div class="kv"><span class="k">C · checked exception</span><span class="v">By default Spring rolls back only on <code>RuntimeException</code> and <code>Error</code> (the rule from lesson 1.4). <code>IOException</code> is checked ⇒ <em>Initiating transaction commit</em> ⇒ the row stayed. Use <code>@Transactional(rollbackFor = Exception.class)</code> or throw an unchecked exception.</span></div>
  <div class="kv"><span class="k">D · final method</span><span class="v">CGLIB cannot override <code>countFinal()</code>, so the call runs on the <strong>proxy object itself</strong>. The proxy is created without running your constructor, so its <code>db</code> field is <code>null</code> ⇒ NPE. In Kotlin, where classes are final by default, this is why the <code>kotlin-spring</code> plugin opens them.</span></div>
</div>
<p>Other rules that follow from "it is a proxy": <code>private</code> and <code>static</code> methods are never intercepted; the annotation is ignored when the object was created with <code>new</code> rather than by Spring; and the proxy only exists after step 8 of the lifecycle, so a call from the bean's own <code>@PostConstruct</code> has no transaction.</p>

<h3>Fixing self-invocation</h3>
<ol>
  <li><strong>Put the transaction on the outer method</strong> — usually what you meant: the whole batch is one unit.</li>
  <li><strong>Move the inner method to another bean</strong>, so the call crosses a proxy (solution below).</li>
  <li><strong>Programmatic:</strong> <code>TransactionTemplate.executeWithoutResult(status -&gt; …)</code> when you need a transaction around just a few lines.</li>
  <li>Injecting the bean into itself (<code>@Lazy</code> self) or AspectJ compile-time weaving also work, but are rarely worth the confusion.</li>
</ol>

<h3>Writing your own aspect</h3>
<p>The AOP vocabulary in one line each: an <strong>aspect</strong> is a class of cross-cutting logic; an <strong>advice</strong> is one of its methods and says <em>when</em> (<code>@Before</code>, <code>@AfterReturning</code>, <code>@AfterThrowing</code>, <code>@After</code>, <code>@Around</code>); a <strong>pointcut</strong> says <em>where</em> (here: methods annotated <code>@Timed</code> or <code>@AdminOnly</code>); a <strong>join point</strong> is one actual method execution. Spring applies aspects by proxy at runtime ("weaving"). Below: a timing aspect, and a toy admin check that stands in for Spring Security's <code>@PreAuthorize</code> (Chapter 9).</p>
${MA35_ASPECT}
${MA35_ASPECT_MAIN}
${OUT35_ASPECT}
<p>Case 3 is the dangerous one: the check ran when <code>deleteLab</code> was called from outside, and was <strong>silently skipped</strong> when a public method of the same class called it. A student deleted a lab. Spring Security's method security (<code>@PreAuthorize</code>, <code>@Secured</code>) is implemented with the same proxies and has the same rule.</p>

<h3>🕵️ Real incident — CVE-2025-41248, Spring Security, September 2025</h3>
<div class="callout warn"><p>On 15 September 2025 the Spring team published <strong>CVE-2025-41248</strong> (severity HIGH): "authorization bypass for method security annotations on parameterized types". When <code>@PreAuthorize</code> sat on a method declared in a <strong>generic superclass or interface</strong> (for example <code>BaseService&lt;T&gt;</code>), the annotation detection could fail to find it — so the security proxy did not apply the check, and the method ran for anyone. Affected: Spring Security 6.4.0–6.4.10 and 6.5.0–6.5.4; fixed in 6.4.11 and 6.5.5 (with a related Spring Framework fix, CVE-2025-41249). Like our case 3, nothing failed loudly: the method simply executed.</p>
<p><strong>How to prevent it:</strong> do not rely on one layer — protect URLs in the security filter chain <em>and</em> methods; write tests that call each protected method as the wrong role and expect 403 (Chapter 11); never let a public method reach a protected one by self-invocation; keep Spring Boot patch versions up to date (the fix was a patch release).</p></div>

<h3>Compared with Node.js</h3>
<p>Express middleware is AOP for routes: <code>app.use(timing)</code> or <code>router.delete('/labs/:id', requireAdmin, handler)</code> wraps a request, not a method. Inside services, Node code usually wraps functions by hand (<code>withTransaction(async (tx) =&gt; …)</code>), which avoids the self-invocation trap because the wrapping is visible at the call site. The trade-off you can state in an interview: Spring's proxies are invisible and declarative — less code, but you must know the proxy rules.</p>

<h3>In real life and at work</h3>
<p>A director's secretary is a proxy: every outside call goes through her — she logs it, checks the caller is allowed, and keeps the calendar consistent. But when the director walks to the next office and talks to a colleague directly, the secretary never hears about it (self-invocation). At work, "the data is half saved but there was an exception" is the classic symptom of case B; the first thing a senior asks is "which method has <code>@Transactional</code>, and was it called from outside the bean?"</p>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"How does @Transactional work?"</strong> — A BeanPostProcessor wraps the bean in a proxy; the <code>TransactionInterceptor</code> opens a transaction before the call and commits or rolls back after it, based on the exception.</li>
  <li><strong>"Why does @Transactional not work when I call the method from the same class?"</strong> — The call uses <code>this</code>, not the proxy. Move it to another bean, annotate the outer method, or use <code>TransactionTemplate</code>.</li>
  <li><strong>"JDK dynamic proxy vs CGLIB?"</strong> — Interface-based vs subclass-based; CGLIB cannot intercept final/private methods; Spring Boot uses CGLIB by default.</li>
  <li><strong>"Does a checked exception roll back?"</strong> — Not by default; set <code>rollbackFor</code>.</li>
  <li><strong>"Explain aspect, advice, pointcut, join point."</strong> — Module of cross-cutting logic; the action and its timing; the expression that selects where; one concrete method execution.</li>
</ol>

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok"><ol>
  <li>Make "book several students" all-or-nothing by moving the loop into a new <code>BatchService</code> bean.</li>
  <li>Make <code>importCsv</code> roll back on <code>IOException</code>.</li>
  <li>Run both against PostgreSQL and print the row count after each.</li>
</ol>
<p><strong>Done when:</strong> both failures leave <code>rows in booking: 0</code>.</p></div>
${giai('Show one solution', `${MA35_FIX}
${OUT35_FIX}
<p><code>BatchService.bookAll</code> opens the transaction; each <code>bookings.book(...)</code> goes through the <code>BookingService</code> proxy and, with the default propagation <code>REQUIRED</code>, joins the existing transaction instead of creating its own (Chapter 7 covers the other propagations). The exception from the third student marks it rollback-only and the whole batch disappears.</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Proxy</span><span class="v">An object standing in front of the real bean, adding behaviour around calls.</span></div>
  <div class="kv"><span class="k">CGLIB</span><span class="v">Bytecode library that generates subclasses; Spring Boot's default proxy type.</span></div>
  <div class="kv"><span class="k">Self-invocation</span><span class="v">A method calling another method of the same object via <code>this</code> — bypasses the proxy.</span></div>
  <div class="kv"><span class="k">Advice / pointcut / join point</span><span class="v">What runs and when / where it applies / one actual method execution.</span></div>
  <div class="kv"><span class="k">TransactionInterceptor</span><span class="v">The advice behind <code>@Transactional</code>.</span></div>
  <div class="kv"><span class="k">rollbackFor</span><span class="v">Extra exception types that must cause a rollback (checked ones are not included by default).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Annotations like <code>@Transactional</code> work only on calls that pass through the proxy.</li>
  <li>Self-invocation, <code>final</code>/<code>private</code> methods and checked exceptions are the four classic traps — all measured above.</li>
  <li>Aspects package cross-cutting code; security aspects bypassed from inside are a real vulnerability class (CVE-2025-41248).</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.spring.io/spring-framework/reference/core/aop/proxying.html', '🌱', 'Spring Framework — Proxying Mechanisms', 'JDK vs CGLIB proxies and the self-invocation problem, from the reference.')}
${tl('https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html', '🌱', 'Using @Transactional', 'Rollback rules, proxy mode and visibility rules.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: HandProxy on Temurin 21.0.12.1; AopApp, FixApp, JdkApp, AspectApp, TxNames on Spring Boot 4.1.2 with PostgreSQL 16 (18/11/2026).</li>
  <li>Spring Security advisory CVE-2025-41248 (15/09/2025): <a href="https://spring.io/security/cve-2025-41248" target="_blank" rel="noopener">spring.io/security/cve-2025-41248</a>; related Spring Framework advisory: <a href="https://spring.io/security/cve-2025-41249" target="_blank" rel="noopener">spring.io/security/cve-2025-41249</a></li>
</ul>
</div>
`;

const L35_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.5</span>
<h2>Proxy và AOP: @Transactional thật sự chạy thế nào</h2>
<p class="lead"><code>@Transactional</code>, <code>@Async</code>, <code>@Cacheable</code>, <code>@PreAuthorize</code> — không cái nào sửa hàm của bạn. Spring đặt một <strong>proxy</strong> đứng trước bean, và proxy làm phần việc thêm trước và sau khi chuyển tiếp lời gọi. Thấy được điều đó, bốn lỗi nổi tiếng tự giải thích: một hàm gọi hàm khác cùng class thì bỏ qua giao dịch, exception checked thì commit, hàm <code>final</code> sập vì field null, và một lần kiểm quyền bị vượt từ bên trong. Ta chạy cả bốn với PostgreSQL, sau khi tự tay viết một proxy.</p>

<h3>Tự viết một proxy giao dịch</h3>
<p>JDK có thể tạo lúc chạy một đối tượng cài một interface và chuyển mọi lời gọi tới một <code>InvocationHandler</code>. Handler của ta in BEGIN, gọi service thật, rồi COMMIT hoặc ROLLBACK:</p>
${MA35_HAND}
${OUT35_HAND}
<ul>
  <li>Bên gọi cầm <code>$Proxy0</code>, một class sinh ra lúc chạy. Nó cài <code>BookingService</code> nhưng <strong>không phải</strong> <code>RealBookingService</code>.</li>
  <li>Đối tượng thật không hề biết: nó chỉ insert. Begin/commit/rollback nằm ở một chỗ cho mọi hàm — đó là mục đích của AOP (lập trình hướng khía cạnh): các mối quan tâm cắt ngang (giao dịch, đo giờ, bảo mật, cache) viết một lần, áp cho nhiều hàm.</li>
  <li><code>ping</code> được chuyển tiếp nguyên vẹn — như một hàm không có <code>@Transactional</code>.</li>
</ul>

<h3>JDK proxy và CGLIB</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">JDK dynamic proxy</span><span class="v">Cài các <strong>interface</strong> của bean. Bắt buộc có interface; proxy không ép kiểu sang class được.</span></div>
  <div class="kv"><span class="k">Proxy CGLIB</span><span class="v">Sinh một <strong>lớp con</strong> của class bean (<code>BookingService$$SpringCGLIB$$0</code>) và ghi đè các hàm. Chạy được không cần interface; không ghi đè được hàm <code>final</code>/<code>private</code>/<code>static</code>.</span></div>
</div>
<p>Spring Boot mặc định dùng CGLIB cho mọi thứ (<code>spring.aop.proxy-target-class=true</code>), chính là để tiêm theo class luôn chạy. Tắt nó đi sẽ thấy khác biệt:</p>
${OUT35_JDK}

<h3>@Transactional với cơ sở dữ liệu thật — bốn trường hợp</h3>
${MA35_SVC}
${OUT35_TX}
<p>Thứ đứng trước bean là bean <code>TransactionInterceptor</code> do auto-configuration đăng ký — "advice" mà handler tự viết của ta bắt chước:</p>
${OUT35_TXBEANS}
<div class="kv-grid">
  <div class="kv"><span class="k">A · chạy đúng</span><span class="v">Lời gọi từ bên ngoài, đi qua proxy: log hiện <em>Creating new transaction … PROPAGATION_REQUIRED</em>, lệnh insert, <em>Rolling back</em>. 0 dòng. Y như proxy tự viết.</span></div>
  <div class="kv"><span class="k">B · tự gọi</span><span class="v"><code>bookTwice()</code> không có annotation, proxy chỉ chuyển tiếp. Bên trong, <code>book(...)</code> nghĩa là <code>this.book(...)</code> — <code>this</code> là đối tượng thật, không phải proxy. Không có giao dịch nào ("transaction active? false"): lần insert đầu tự commit, lần hai lỗi. <strong>2 dòng việc làm dở</strong>, không có dòng log nào về giao dịch.</span></div>
  <div class="kv"><span class="k">C · exception checked</span><span class="v">Mặc định Spring chỉ rollback với <code>RuntimeException</code> và <code>Error</code> (luật ở bài 1.4). <code>IOException</code> là checked ⇒ <em>Initiating transaction commit</em> ⇒ dòng vẫn còn. Dùng <code>@Transactional(rollbackFor = Exception.class)</code> hoặc ném exception unchecked.</span></div>
  <div class="kv"><span class="k">D · hàm final</span><span class="v">CGLIB không ghi đè được <code>countFinal()</code>, nên lời gọi chạy trên <strong>chính đối tượng proxy</strong>. Proxy được tạo mà không chạy constructor của bạn, nên field <code>db</code> của nó là <code>null</code> ⇒ NPE. Trong Kotlin, class mặc định là final, đó là lý do plugin <code>kotlin-spring</code> mở chúng ra.</span></div>
</div>
<p>Các luật khác suy ra từ "nó là proxy": hàm <code>private</code> và <code>static</code> không bao giờ bị chặn; annotation bị bỏ qua khi đối tượng tạo bằng <code>new</code> thay vì do Spring; và proxy chỉ có từ bước 8 của vòng đời, nên gọi từ <code>@PostConstruct</code> của chính bean thì không có giao dịch.</p>

<h3>Sửa lỗi tự gọi</h3>
<ol>
  <li><strong>Đặt giao dịch lên hàm bên ngoài</strong> — thường là điều bạn muốn: cả lô là một đơn vị.</li>
  <li><strong>Chuyển hàm bên trong sang bean khác</strong>, để lời gọi đi qua proxy (lời giải bên dưới).</li>
  <li><strong>Viết bằng mã:</strong> <code>TransactionTemplate.executeWithoutResult(status -&gt; …)</code> khi chỉ cần giao dịch quanh vài dòng.</li>
  <li>Tự tiêm bean vào chính nó (<code>@Lazy</code> self) hay dệt AspectJ lúc biên dịch cũng được, nhưng hiếm khi đáng sự rối rắm.</li>
</ol>

<h3>Tự viết một aspect</h3>
<p>Từ vựng AOP, mỗi từ một dòng: <strong>aspect</strong> là class chứa logic cắt ngang; <strong>advice</strong> là một hàm của nó và nói <em>khi nào</em> (<code>@Before</code>, <code>@AfterReturning</code>, <code>@AfterThrowing</code>, <code>@After</code>, <code>@Around</code>); <strong>pointcut</strong> nói <em>ở đâu</em> (ở đây: các hàm gắn <code>@Timed</code> hay <code>@AdminOnly</code>); <strong>join point</strong> là một lần thực thi hàm cụ thể. Spring áp aspect bằng proxy lúc chạy ("dệt"). Bên dưới: một aspect đo giờ, và một bộ kiểm admin đồ chơi đứng thay cho <code>@PreAuthorize</code> của Spring Security (Chương 9).</p>
${MA35_ASPECT}
${MA35_ASPECT_MAIN}
${OUT35_ASPECT}
<p>Trường hợp 3 là cái nguy hiểm: bộ kiểm chạy khi <code>deleteLab</code> được gọi từ bên ngoài, và bị <strong>bỏ qua lặng lẽ</strong> khi một hàm public cùng class gọi nó. Một sinh viên đã xoá một phòng lab. Phân quyền cấp phương thức của Spring Security (<code>@PreAuthorize</code>, <code>@Secured</code>) dựng bằng đúng các proxy này và chịu đúng luật này.</p>

<h3>🕵️ Sự cố thật — CVE-2025-41248, Spring Security, tháng 9/2025</h3>
<div class="callout warn"><p>Ngày 15/9/2025 nhóm Spring công bố <strong>CVE-2025-41248</strong> (mức HIGH): "vượt phân quyền với annotation bảo mật cấp phương thức trên kiểu có tham số". Khi <code>@PreAuthorize</code> nằm trên một hàm khai báo trong <strong>lớp cha hay interface generic</strong> (ví dụ <code>BaseService&lt;T&gt;</code>), cơ chế dò annotation có thể không tìm thấy nó — nên proxy bảo mật không áp bộ kiểm, và hàm chạy cho bất kỳ ai. Ảnh hưởng: Spring Security 6.4.0–6.4.10 và 6.5.0–6.5.4; sửa ở 6.4.11 và 6.5.5 (kèm một bản sửa Spring Framework liên quan, CVE-2025-41249). Như trường hợp 3 của ta, không có gì báo lỗi ầm ĩ: hàm cứ thế chạy.</p>
<p><strong>Cách phòng:</strong> đừng dựa vào một lớp — bảo vệ URL trong chuỗi filter bảo mật <em>và</em> bảo vệ hàm; viết test gọi từng hàm được bảo vệ bằng vai trò sai và chờ 403 (Chương 11); không bao giờ để hàm public chạm tới hàm được bảo vệ bằng cách tự gọi; cập nhật bản vá Spring Boot kịp thời (bản sửa là một bản vá nhỏ).</p></div>

<h3>So với Node.js</h3>
<p>Middleware của Express là AOP cho route: <code>app.use(timing)</code> hay <code>router.delete('/labs/:id', requireAdmin, handler)</code> bọc một request, không bọc một hàm. Bên trong service, mã Node thường tự bọc hàm (<code>withTransaction(async (tx) =&gt; …)</code>), nên tránh được bẫy tự gọi vì việc bọc hiện ngay ở chỗ gọi. Sự đánh đổi có thể nói khi phỏng vấn: proxy của Spring vô hình và khai báo — ít mã hơn, nhưng bạn phải thuộc luật của proxy.</p>

<h3>Đời thường và đi làm</h3>
<p>Thư ký của giám đốc là một proxy: mọi cuộc gọi từ ngoài đều qua chị — chị ghi sổ, kiểm người gọi có được phép không, và giữ lịch cho khớp. Nhưng khi giám đốc đi sang phòng bên nói chuyện thẳng với đồng nghiệp, thư ký không hề biết (tự gọi). Đi làm, "dữ liệu lưu được một nửa mà có exception" là triệu chứng kinh điển của trường hợp B; câu đầu tiên người có kinh nghiệm hỏi là "hàm nào có <code>@Transactional</code>, và nó có được gọi từ ngoài bean không?"</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"@Transactional hoạt động thế nào?"</strong> — Một BeanPostProcessor bọc bean trong proxy; <code>TransactionInterceptor</code> mở giao dịch trước lời gọi và commit hay rollback sau đó, tuỳ exception.</li>
  <li><strong>"Sao @Transactional không chạy khi tôi gọi hàm từ cùng class?"</strong> — Lời gọi dùng <code>this</code>, không qua proxy. Chuyển sang bean khác, gắn lên hàm ngoài, hoặc dùng <code>TransactionTemplate</code>.</li>
  <li><strong>"JDK dynamic proxy khác CGLIB?"</strong> — Dựa trên interface và dựa trên lớp con; CGLIB không chặn được hàm final/private; Spring Boot mặc định dùng CGLIB.</li>
  <li><strong>"Exception checked có rollback không?"</strong> — Mặc định không; đặt <code>rollbackFor</code>.</li>
  <li><strong>"Giải thích aspect, advice, pointcut, join point."</strong> — Module logic cắt ngang; hành động và thời điểm; biểu thức chọn chỗ áp; một lần thực thi hàm cụ thể.</li>
</ol>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
  <li>Làm cho "đặt cho nhiều sinh viên" thành được-cả-hoặc-không bằng cách chuyển vòng lặp sang một bean mới <code>BatchService</code>.</li>
  <li>Làm cho <code>importCsv</code> rollback khi gặp <code>IOException</code>.</li>
  <li>Chạy cả hai với PostgreSQL và in số dòng sau mỗi lần.</li>
</ol>
<p><strong>Đạt khi:</strong> cả hai lần lỗi đều để lại <code>rows in booking: 0</code>.</p></div>
${giai('Xem một lời giải', `${MA35_FIX}
${OUT35_FIX}
<p><code>BatchService.bookAll</code> mở giao dịch; mỗi <code>bookings.book(...)</code> đi qua proxy của <code>BookingService</code> và, với propagation mặc định <code>REQUIRED</code>, tham gia giao dịch đang có thay vì mở giao dịch riêng (Chương 7 nói các propagation khác). Exception ở sinh viên thứ ba đánh dấu nó chỉ-được-rollback và cả lô biến mất.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Proxy</span><span class="v">Đối tượng đứng trước bean thật, thêm hành vi quanh lời gọi.</span></div>
  <div class="kv"><span class="k">CGLIB</span><span class="v">Thư viện bytecode sinh lớp con; kiểu proxy mặc định của Spring Boot.</span></div>
  <div class="kv"><span class="k">Tự gọi (self-invocation)</span><span class="v">Một hàm gọi hàm khác của cùng đối tượng qua <code>this</code> — đi vòng qua proxy.</span></div>
  <div class="kv"><span class="k">Advice / pointcut / join point</span><span class="v">Chạy gì và khi nào / áp ở đâu / một lần thực thi hàm cụ thể.</span></div>
  <div class="kv"><span class="k">TransactionInterceptor</span><span class="v">Advice đứng sau <code>@Transactional</code>.</span></div>
  <div class="kv"><span class="k">rollbackFor</span><span class="v">Thêm các loại exception phải gây rollback (mặc định không gồm exception checked).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Annotation như <code>@Transactional</code> chỉ có tác dụng với lời gọi đi qua proxy.</li>
  <li>Tự gọi, hàm <code>final</code>/<code>private</code> và exception checked là bốn bẫy kinh điển — đều đo thật ở trên.</li>
  <li>Aspect đóng gói mã cắt ngang; aspect bảo mật bị vượt từ bên trong là một loại lỗ hổng có thật (CVE-2025-41248).</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.spring.io/spring-framework/reference/core/aop/proxying.html', '🌱', 'Spring Framework — Proxying Mechanisms', 'JDK proxy vs CGLIB và vấn đề tự gọi, từ tài liệu chính thức.')}
${tl('https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html', '🌱', 'Using @Transactional', 'Luật rollback, chế độ proxy và luật về độ hiển thị của hàm.')}

<h3>Nguồn</h3>
<ul>
  <li>Output ở trên: HandProxy trên Temurin 21.0.12.1; AopApp, FixApp, JdkApp, AspectApp, TxNames trên Spring Boot 4.1.2 với PostgreSQL 16 (18/11/2026).</li>
  <li>Bản tin bảo mật Spring Security CVE-2025-41248 (15/09/2025): <a href="https://spring.io/security/cve-2025-41248" target="_blank" rel="noopener">spring.io/security/cve-2025-41248</a>; bản tin Spring Framework liên quan: <a href="https://spring.io/security/cve-2025-41249" target="_blank" rel="noopener">spring.io/security/cve-2025-41249</a></li>
</ul>
</div>
`;

// ===== Bài 3.6 =====
const OUT36_DEBUG = out("$ java … IocApp --debug\n============================\nCONDITIONS EVALUATION REPORT\n============================\n\nPositive matches:\n-----------------\n   DataSourceAutoConfiguration matched:\n      - @ConditionalOnClass found required classes 'javax.sql.DataSource', 'org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType' (OnClassCondition)\n      - @ConditionalOnMissingBean (types: io.r2dbc.spi.ConnectionFactory; SearchStrategy: all) did not find any beans (OnBeanCondition)\n\n   …\nNegative matches:\n-----------------\n   AopAutoConfiguration.AspectJAutoProxyingConfiguration.JdkDynamicAutoProxyConfiguration:\n      Did not match:\n         - @ConditionalOnBooleanProperty (spring.aop.proxy-target-class=false) did not find property 'spring.aop.proxy-target-class' (OnPropertyCondition)\n\n   DataSourceCheckpointRestoreConfiguration:\n      Did not match:\n         - @ConditionalOnClass did not find required class 'org.crac.Resource' (OnClassCondition)\n   …");
const OUT36_IMPORTS = out("$ for j in target/dep/*.jar; do unzip -p $j META-INF/spring/…AutoConfiguration.imports | grep -vc \"^#\"; done\n12 spring-boot-autoconfigure-4.1.2.jar\n9 spring-boot-jdbc-4.1.2.jar\n6 spring-boot-webmvc-4.1.2.jar\n5 spring-boot-tomcat-4.1.2.jar\n5 spring-boot-servlet-4.1.2.jar\n3 spring-boot-transaction-4.1.2.jar\n1 spring-boot-validation-4.1.2.jar\n1 spring-boot-persistence-4.1.2.jar\n1 spring-boot-jackson-4.1.2.jar\n1 spring-boot-http-converter-4.1.2.jar\nTOTAL 44 auto-configuration classes in 10 jars");
const MA36_PROPS = java("/** labflow.sms.sender-name, labflow.sms.audit — with defaults. */\n@ConfigurationProperties(\"labflow.sms\")\npublic record SmsProperties(String senderName, boolean audit) {\n    public SmsProperties {\n        if (senderName == null) senderName = \"LabFlow\";\n    }\n}");
const MA36_AUTO = java("@AutoConfiguration\n@EnableConfigurationProperties(SmsProperties.class)\npublic class SmsAutoConfiguration {\n\n    @Bean\n    @ConditionalOnMissingBean            // back off if the application defines its own SmsSender\n    public SmsSender smsSender(SmsProperties props) {\n        return (phone, text) -> \"[\" + props.senderName() + \" -> \" + phone + \"] \" + text + \"  (default console sender)\";\n    }\n\n    @Bean\n    @ConditionalOnProperty(prefix = \"labflow.sms\", name = \"audit\", havingValue = \"true\")\n    public SmsAudit smsAudit() {\n        return new SmsAudit();\n    }\n\n    public static class SmsAudit {\n        public SmsAudit() { System.out.println(\"SmsAudit created (labflow.sms.audit=true)\"); }\n    }\n}");
const OUT36_IMPFILE = out("$ cat src/main/resources/META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports\ncom.cuongthai.sms.SmsAutoConfiguration");
const MA36_APP = java("@SpringBootApplication\npublic class AutoApp {\n    public static void main(String[] args) {\n        var ctx = SpringApplication.run(AutoApp.class, args);\n        System.out.println(ctx.getBean(SmsSender.class).send(\"0901234567\", \"Booking #42 approved\"));\n        System.out.println(\"SmsSender beans: \" + String.join(\", \", ctx.getBeanNamesForType(SmsSender.class)));\n        ctx.close();\n    }\n\n    @Bean\n    @Profile(\"zalo\")                       // our own bean: the starter's default backs off\n    SmsSender zaloSender() {\n        return (phone, text) -> \"[Zalo OA -> \" + phone + \"] \" + text + \"  (our bean)\";\n    }\n}");
const OUT36_APP = out("$ java … AutoApp\n[LabFlow -> 0901234567] Booking #42 approved  (default console sender)\nSmsSender beans: smsSender\n\n$ java … AutoApp --labflow.sms.sender-name=FPTU-Lab --labflow.sms.audit=true\nSmsAudit created (labflow.sms.audit=true)\n[FPTU-Lab -> 0901234567] Booking #42 approved  (default console sender)\nSmsSender beans: smsSender\n\n$ java … AutoApp --spring.profiles.active=zalo\n[Zalo OA -> 0901234567] Booking #42 approved  (our bean)\nSmsSender beans: zaloSender");
const OUT36_APPDEBUG = out("$ java … AutoApp --debug\n   SmsAutoConfiguration#smsSender matched:\n      - @ConditionalOnMissingBean (types: com.cuongthai.sms.SmsSender; SearchStrategy: all) did not find any beans (OnBeanCondition)\n\n   SmsAutoConfiguration#smsAudit:\n      Did not match:\n         - @ConditionalOnProperty (labflow.sms.audit=true) did not find property 'audit' (OnPropertyCondition)\n\n$ java … AutoApp --debug --spring.profiles.active=zalo\n   SmsAutoConfiguration#smsSender:\n      Did not match:\n         - @ConditionalOnMissingBean (types: com.cuongthai.sms.SmsSender; SearchStrategy: all) found beans of type 'com.cuongthai.sms.SmsSender' zaloSender (OnBeanCondition)");
const OUT36_PRAC = out("$ java … AutoApp --labflow.sms.enabled=false\nException in thread \"main\" org.springframework.beans.factory.NoSuchBeanDefinitionException: No qualifying bean of type 'com.cuongthai.sms.SmsSender' available\n\tat com.cuongthai.app.AutoApp.main(AutoApp.java:13)\n\n$ java … AutoApp --labflow.sms.enabled=false --spring.profiles.active=zalo\n[Zalo OA -> 0901234567] Booking #42 approved  (our bean)\nSmsSender beans: zaloSender");

const L36_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.6</span>
<h2>Auto-configuration from the inside</h2>
<p class="lead">You added <code>spring-boot-starter-jdbc</code> and a database URL, and a connection pool, a <code>JdbcTemplate</code> and a transaction manager appeared — 118 of the 122 beans in lesson 3.1 were not yours. That is auto-configuration: ordinary <code>@Configuration</code> classes shipped inside Spring Boot's jars, each guarded by conditions. In this lesson we read Spring Boot's own decision report, count the auto-configurations on our classpath, and then write a small starter of our own that behaves exactly like the official ones: on by default, configurable by properties, and backing off the moment the application defines its own bean.</p>

<h3>Three annotations in one</h3>
<p><code>@SpringBootApplication</code> = <code>@SpringBootConfiguration</code> (this class is a configuration) + <code>@ComponentScan</code> (scan this package and below, lesson 3.3) + <code>@EnableAutoConfiguration</code>. The last one loads every class listed in <code>META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports</code> of every jar on the classpath, and evaluates their conditions <em>after</em> your own configuration has been read.</p>
${OUT36_IMPORTS}
<p>Spring Boot 4 split auto-configuration into per-technology modules: the JDBC ones live in <code>spring-boot-jdbc</code>, the MVC ones in <code>spring-boot-webmvc</code>, and the old central <code>spring-boot-autoconfigure</code> jar now holds only 12 general ones. On this project's classpath there are 44 candidates. A starter you do not add brings no auto-configuration at all.</p>

<h3>Conditions decide</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">@ConditionalOnClass / OnMissingClass</span><span class="v">Only if a class is (not) on the classpath — "is the PostgreSQL driver / AspectJ here?". This is why adding a dependency changes behaviour.</span></div>
  <div class="kv"><span class="k">@ConditionalOnMissingBean</span><span class="v">Only if the application has not defined a bean of this type — <strong>the back-off rule</strong> that lets you override any default.</span></div>
  <div class="kv"><span class="k">@ConditionalOnProperty / OnBooleanProperty</span><span class="v">Only if a property has a value (<code>spring.aop.proxy-target-class=false</code>, <code>labflow.sms.audit=true</code>).</span></div>
  <div class="kv"><span class="k">@ConditionalOnWebApplication, OnSingleCandidate, OnResource…</span><span class="v">Web or not, exactly one candidate bean, a file exists.</span></div>
</div>
<p>Run any Boot app with <code>--debug</code> and it prints the <strong>conditions evaluation report</strong> — why each auto-configuration did or did not apply:</p>
${OUT36_DEBUG}
<ul>
  <li><code>DataSourceAutoConfiguration</code> applied because <code>javax.sql.DataSource</code> is on the classpath and nobody defined an R2DBC <code>ConnectionFactory</code>.</li>
  <li>The JDK-proxy configuration was skipped because <code>spring.aop.proxy-target-class=false</code> is not set — the switch we flipped in lesson 3.5.</li>
  <li>CRaC checkpoint support was skipped because <code>org.crac.Resource</code> is not on the classpath.</li>
</ul>
<p>The report has three more sections: <em>Exclusions</em> (what you excluded by hand) and <em>Unconditional classes</em>. When a bean you expected is missing — or one you did not expect is there — this report is the first place to look.</p>

<h3>Writing a starter: <code>labflow-sms-spring-boot-starter</code></h3>
<p>Goal: any LabFlow service that adds this dependency gets an <code>SmsSender</code> bean for free, configurable with <code>labflow.sms.*</code>, replaceable by its own bean. Three files.</p>
<p><strong>1. Typed properties</strong> (lesson 3.7 goes deeper):</p>
${MA36_PROPS}
<p><strong>2. The auto-configuration</strong> — a normal configuration class with conditions:</p>
${MA36_AUTO}
<p><strong>3. The registration file</strong> — without it Spring Boot never looks at the class (component scanning does not reach into library packages):</p>
${OUT36_IMPFILE}
<p>The application just depends on the jar and asks for an <code>SmsSender</code>. Its own <code>zaloSender</code> bean exists only under the <code>zalo</code> profile:</p>
${MA36_APP}
${OUT36_APP}
<p>Default bean; then the same bean reconfigured by two properties (and the audit bean switched on); then the application's own bean — and the starter's default <strong>disappeared</strong>: only <code>zaloSender</code> exists. The debug report says exactly why:</p>
${OUT36_APPDEBUG}
<p>This is the whole contract of Spring Boot: "sensible default, override by defining your own bean". When you define your own <code>DataSource</code>, <code>ObjectMapper</code> or <code>SecurityFilterChain</code>, the official auto-configurations back off in the same way.</p>

<h3>Turning things off</h3>
<ul>
  <li>Exclude a whole auto-configuration: <code>@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)</code> (used in lesson 3.7's demo, which needs no database) or <code>spring.autoconfigure.exclude=…</code>.</li>
  <li>Prefer defining your own bean over excluding, when you only want a different implementation.</li>
  <li>Naming: official starters are <code>spring-boot-starter-*</code>; third-party ones must be <code>*-spring-boot-starter</code>, like ours.</li>
</ul>

<h3>🕵️ Real incident — the H2 console, CVE-2021-42392 (January 2022)</h3>
<div class="callout warn"><p>Auto-configuration makes features appear because a jar and a property are present — including features that should never reach production. Spring Boot registers the <strong>H2 database web console</strong> when H2 is on the classpath and <code>spring.h2.console.enabled=true</code>, a line many tutorials tell you to add. On 6 January 2022 JFrog published <strong>CVE-2021-42392</strong>: the console's login form passed the attacker's driver class and URL to a JNDI lookup <em>before</em> checking any password, so a console reachable over the network meant remote code execution without credentials — the same JNDI technique as Log4Shell ("Start here, part 2"). JFrog credited a researcher who showed Spring Boot applications were exploitable in a non-default configuration (console exposed to other hosts). Fixed in H2 2.0.206.</p>
<p><strong>How to prevent it:</strong> development-only tools (H2 console, DevTools, Actuator endpoints such as <code>heapdump</code> — the Cariad case of lesson 2.6) must be enabled only in a dev profile (lesson 3.7); before every release, run with <code>--debug</code> or check <code>/actuator/conditions</code> internally and read what got switched on; keep <code>spring.h2.console.settings.web-allow-others</code> false; update dependencies.</p></div>

<h3>Compared with Node.js</h3>
<p>Express has no auto-configuration: installing <code>pg</code> does nothing until you write the pool code. NestJS modules (<code>TypeOrmModule.forRoot(...)</code>) are the closest analogue, but you still import them explicitly. The interview contrast: Spring Boot is "convention over configuration" driven by the classpath; Node favours explicit wiring. Both are fine — but in Spring you must know how to ask the framework what it did (<code>--debug</code>).</p>

<h3>In real life and at work</h3>
<p>A smart-home hub: plug in a light bulb and it is detected and set up with sensible defaults; plug in your own preferred bulb controller and the hub steps back. At work, two classics come from auto-configuration: "I added a library and the app suddenly wants a database URL" (the library pulled in JDBC ⇒ <code>DataSourceAutoConfiguration</code> woke up), and "my <code>ObjectMapper</code> settings are ignored" (you created a second mapper instead of customising the auto-configured one). Both are answered by reading the conditions report.</p>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"How does Spring Boot auto-configuration work?"</strong> — <code>@EnableAutoConfiguration</code> loads classes listed in <code>AutoConfiguration.imports</code> files; each is a <code>@Configuration</code> guarded by <code>@Conditional…</code> annotations evaluated after user configuration.</li>
  <li><strong>"How do you override an auto-configured bean?"</strong> — Define your own bean of that type; <code>@ConditionalOnMissingBean</code> makes the default back off. Or exclude the auto-configuration.</li>
  <li><strong>"How do you find out why a bean was or was not created?"</strong> — Run with <code>--debug</code> (conditions report) or the Actuator <code>conditions</code> endpoint.</li>
  <li><strong>"How would you write your own starter?"</strong> — An auto-configuration class with conditions, a <code>@ConfigurationProperties</code> class, and the imports file; name it <code>xxx-spring-boot-starter</code>.</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
  <li>Add a master switch: when <code>labflow.sms.enabled=false</code>, the starter must create nothing at all; when the property is absent it must behave as before.</li>
  <li>Run the app with the switch off, with and without the <code>zalo</code> profile, and explain both outputs.</li>
</ol>
<p><strong>Done when:</strong> without the property, output is unchanged; with <code>false</code> and no profile there is no <code>SmsSender</code>; with <code>false</code> and <code>zalo</code> the app's own bean is used.</p></div>
${giai('Show one solution', `${java(`
@AutoConfiguration
@ConditionalOnProperty(prefix = "labflow.sms", name = "enabled", havingValue = "true", matchIfMissing = true)
@EnableConfigurationProperties(SmsProperties.class)
public class SmsAutoConfiguration { /* … unchanged … */ }`)}
${OUT36_PRAC}
<p><code>matchIfMissing = true</code> keeps the starter on by default. With the switch off, the whole class is skipped, so <code>getBean(SmsSender.class)</code> fails — in a real service that would be a startup error at the injection point, which is what you want: switching SMS off must be a conscious decision with a replacement bean.</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Auto-configuration</span><span class="v">A conditional <code>@Configuration</code> shipped in a library and listed in <code>AutoConfiguration.imports</code>.</span></div>
  <div class="kv"><span class="k">@ConditionalOnMissingBean</span><span class="v">Create the default only if the application did not define one — the back-off rule.</span></div>
  <div class="kv"><span class="k">Conditions evaluation report</span><span class="v">The <code>--debug</code> output listing positive and negative matches with reasons.</span></div>
  <div class="kv"><span class="k">Starter</span><span class="v">A dependency that brings libraries plus their auto-configuration.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Auto-configurations are ordinary configuration classes with conditions, registered through an imports file; Boot 4 splits them per technology.</li>
  <li><code>--debug</code> tells you exactly what applied and why.</li>
  <li>Defining your own bean makes the default back off; a starter is three small files.</li>
  <li>Auto-configured developer tools are an attack surface (H2 console CVE-2021-42392): gate them by profile.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.spring.io/spring-boot/reference/features/developing-auto-configuration.html', '🍃', 'Spring Boot — Creating Your Own Auto-configuration', 'Conditions, ordering, naming and testing a custom starter.')}
${tl('https://jfrog.com/blog/the-jndi-strikes-back-unauthenticated-rce-in-h2-database-console/', '🕵️', 'JFrog — The JNDI Strikes Back: Unauthenticated RCE in H2 Database Console', 'The CVE-2021-42392 write-up.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: IocApp --debug, AutoApp (sms-starter 0.0.1 and a 0.0.2 variant for the practice) on Spring Boot 4.1.2; imports count from the jars of this project (18/11/2026).</li>
  <li>JFrog, CVE-2021-42392 (06/01/2022): <a href="https://jfrog.com/blog/the-jndi-strikes-back-unauthenticated-rce-in-h2-database-console/" target="_blank" rel="noopener">jfrog.com/blog</a></li>
</ul>
</div>
`;

const L36_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.6</span>
<h2>Auto-configuration từ bên trong</h2>
<p class="lead">Bạn thêm <code>spring-boot-starter-jdbc</code> và một URL cơ sở dữ liệu, thế là có pool kết nối, <code>JdbcTemplate</code> và bộ quản lý giao dịch — 118 trên 122 bean ở bài 3.1 không phải của bạn. Đó là auto-configuration: các class <code>@Configuration</code> bình thường nằm sẵn trong jar của Spring Boot, mỗi cái được canh bằng điều kiện. Bài này đọc báo cáo quyết định của chính Spring Boot, đếm số auto-configuration trên classpath của ta, rồi tự viết một starter nhỏ cư xử đúng như bản chính thức: bật sẵn, chỉnh bằng thuộc tính, và lùi lại ngay khi ứng dụng tự định nghĩa bean của mình.</p>

<h3>Ba annotation trong một</h3>
<p><code>@SpringBootApplication</code> = <code>@SpringBootConfiguration</code> (class này là cấu hình) + <code>@ComponentScan</code> (quét package này trở xuống, bài 3.3) + <code>@EnableAutoConfiguration</code>. Cái cuối nạp mọi class liệt kê trong <code>META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports</code> của mọi jar trên classpath, và xét điều kiện của chúng <em>sau khi</em> cấu hình của bạn đã được đọc.</p>
${OUT36_IMPORTS}
<p>Spring Boot 4 tách auto-configuration thành module theo từng công nghệ: phần JDBC nằm trong <code>spring-boot-jdbc</code>, phần MVC trong <code>spring-boot-webmvc</code>, còn jar trung tâm cũ <code>spring-boot-autoconfigure</code> giờ chỉ giữ 12 cái chung. Trên classpath dự án này có 44 ứng viên. Starter nào bạn không thêm thì không mang auto-configuration nào vào.</p>

<h3>Điều kiện quyết định</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">@ConditionalOnClass / OnMissingClass</span><span class="v">Chỉ khi một class có (không có) trên classpath — "driver PostgreSQL / AspectJ có ở đây không?". Vì thế thêm một dependency là đổi hành vi.</span></div>
  <div class="kv"><span class="k">@ConditionalOnMissingBean</span><span class="v">Chỉ khi ứng dụng chưa định nghĩa bean kiểu này — <strong>luật lùi lại</strong> cho phép bạn ghi đè mọi mặc định.</span></div>
  <div class="kv"><span class="k">@ConditionalOnProperty / OnBooleanProperty</span><span class="v">Chỉ khi một thuộc tính có giá trị (<code>spring.aop.proxy-target-class=false</code>, <code>labflow.sms.audit=true</code>).</span></div>
  <div class="kv"><span class="k">@ConditionalOnWebApplication, OnSingleCandidate, OnResource…</span><span class="v">Có phải web không, đúng một bean ứng viên, có tệp nào đó.</span></div>
</div>
<p>Chạy bất kỳ ứng dụng Boot nào với <code>--debug</code> là nó in <strong>báo cáo xét điều kiện</strong> — vì sao từng auto-configuration được hay không được áp:</p>
${OUT36_DEBUG}
<ul>
  <li><code>DataSourceAutoConfiguration</code> được áp vì có <code>javax.sql.DataSource</code> trên classpath và không ai định nghĩa <code>ConnectionFactory</code> của R2DBC.</li>
  <li>Cấu hình JDK proxy bị bỏ vì chưa đặt <code>spring.aop.proxy-target-class=false</code> — đúng công tắc ta bật ở bài 3.5.</li>
  <li>Hỗ trợ checkpoint CRaC bị bỏ vì không có <code>org.crac.Resource</code> trên classpath.</li>
</ul>
<p>Báo cáo còn các phần <em>Exclusions</em> (những gì bạn tự loại) và <em>Unconditional classes</em>. Khi thiếu một bean bạn chờ — hoặc có một bean bạn không chờ — báo cáo này là chỗ xem đầu tiên.</p>

<h3>Viết một starter: <code>labflow-sms-spring-boot-starter</code></h3>
<p>Mục tiêu: service LabFlow nào thêm dependency này là có ngay bean <code>SmsSender</code>, chỉnh bằng <code>labflow.sms.*</code>, thay được bằng bean của chính nó. Ba tệp.</p>
<p><strong>1. Thuộc tính có kiểu</strong> (bài 3.7 nói sâu hơn):</p>
${MA36_PROPS}
<p><strong>2. Auto-configuration</strong> — một class cấu hình bình thường có điều kiện:</p>
${MA36_AUTO}
<p><strong>3. Tệp đăng ký</strong> — thiếu nó Spring Boot không bao giờ nhìn tới class (quét component không đi vào package của thư viện):</p>
${OUT36_IMPFILE}
<p>Ứng dụng chỉ cần phụ thuộc vào jar và xin một <code>SmsSender</code>. Bean <code>zaloSender</code> của nó chỉ có khi bật profile <code>zalo</code>:</p>
${MA36_APP}
${OUT36_APP}
<p>Bean mặc định; rồi chính bean đó được chỉnh bằng hai thuộc tính (và bean audit được bật); rồi bean riêng của ứng dụng — và mặc định của starter <strong>biến mất</strong>: chỉ còn <code>zaloSender</code>. Báo cáo debug nói rõ vì sao:</p>
${OUT36_APPDEBUG}
<p>Đây là toàn bộ giao kèo của Spring Boot: "mặc định hợp lý, ghi đè bằng cách tự định nghĩa bean". Khi bạn tự định nghĩa <code>DataSource</code>, <code>ObjectMapper</code> hay <code>SecurityFilterChain</code>, các auto-configuration chính thức lùi lại đúng như thế.</p>

<h3>Tắt đi</h3>
<ul>
  <li>Loại cả một auto-configuration: <code>@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)</code> (demo bài 3.7 dùng, vì không cần cơ sở dữ liệu) hoặc <code>spring.autoconfigure.exclude=…</code>.</li>
  <li>Nếu chỉ muốn một cài đặt khác, nên tự định nghĩa bean hơn là loại bỏ.</li>
  <li>Đặt tên: starter chính thức là <code>spring-boot-starter-*</code>; của bên thứ ba phải là <code>*-spring-boot-starter</code>, như của ta.</li>
</ul>

<h3>🕵️ Sự cố thật — H2 console, CVE-2021-42392 (tháng 1/2022)</h3>
<div class="callout warn"><p>Auto-configuration làm tính năng xuất hiện chỉ vì có một jar và một thuộc tính — kể cả tính năng không bao giờ nên lên production. Spring Boot đăng ký <strong>trang web quản trị của cơ sở dữ liệu H2</strong> khi có H2 trên classpath và <code>spring.h2.console.enabled=true</code>, một dòng mà nhiều bài hướng dẫn bảo bạn thêm. Ngày 6/1/2022 JFrog công bố <strong>CVE-2021-42392</strong>: form đăng nhập của console chuyển class driver và URL do kẻ tấn công đưa vào một lần tra JNDI <em>trước</em> khi kiểm mật khẩu, nên console mà truy cập được qua mạng nghĩa là chạy mã từ xa không cần đăng nhập — cùng kỹ thuật JNDI với Log4Shell (bài "Bắt đầu tại đây (2/2)"). JFrog ghi công một nhà nghiên cứu đã chỉ ra ứng dụng Spring Boot bị khai thác được ở cấu hình không mặc định (console mở cho máy khác). Đã sửa ở H2 2.0.206.</p>
<p><strong>Cách phòng:</strong> công cụ chỉ dành cho phát triển (H2 console, DevTools, endpoint Actuator như <code>heapdump</code> — vụ Cariad ở bài 2.6) chỉ được bật trong profile dev (bài 3.7); trước mỗi lần phát hành, chạy với <code>--debug</code> hoặc xem <code>/actuator/conditions</code> nội bộ và đọc những gì đã được bật; giữ <code>spring.h2.console.settings.web-allow-others</code> là false; cập nhật dependency.</p></div>

<h3>So với Node.js</h3>
<p>Express không có auto-configuration: cài <code>pg</code> xong không có gì xảy ra cho tới khi bạn viết mã tạo pool. Module của NestJS (<code>TypeOrmModule.forRoot(...)</code>) là thứ gần nhất, nhưng vẫn phải import rõ ràng. Đối chiếu khi phỏng vấn: Spring Boot là "quy ước hơn cấu hình" dựa trên classpath; Node chuộng nối dây tường minh. Cả hai đều ổn — nhưng với Spring bạn phải biết cách hỏi framework nó đã làm gì (<code>--debug</code>).</p>

<h3>Đời thường và đi làm</h3>
<p>Bộ điều khiển nhà thông minh: cắm một bóng đèn vào là nó nhận ra và cài sẵn mặc định hợp lý; cắm bộ điều khiển đèn bạn thích hơn là nó lùi lại. Đi làm, hai chuyện kinh điển đến từ auto-configuration: "tôi thêm một thư viện và ứng dụng bỗng đòi URL cơ sở dữ liệu" (thư viện kéo theo JDBC ⇒ <code>DataSourceAutoConfiguration</code> thức dậy), và "thiết lập <code>ObjectMapper</code> của tôi bị bỏ qua" (bạn tạo mapper thứ hai thay vì tuỳ biến cái đã tự cấu hình). Cả hai đều được trả lời bằng cách đọc báo cáo điều kiện.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Auto-configuration của Spring Boot hoạt động thế nào?"</strong> — <code>@EnableAutoConfiguration</code> nạp các class liệt kê trong tệp <code>AutoConfiguration.imports</code>; mỗi cái là một <code>@Configuration</code> được canh bằng annotation <code>@Conditional…</code>, xét sau cấu hình của người dùng.</li>
  <li><strong>"Ghi đè một bean tự cấu hình thế nào?"</strong> — Tự định nghĩa bean cùng kiểu; <code>@ConditionalOnMissingBean</code> làm mặc định lùi lại. Hoặc loại auto-configuration đó.</li>
  <li><strong>"Làm sao biết vì sao một bean được hay không được tạo?"</strong> — Chạy với <code>--debug</code> (báo cáo điều kiện) hoặc endpoint <code>conditions</code> của Actuator.</li>
  <li><strong>"Bạn tự viết starter thế nào?"</strong> — Một class auto-configuration có điều kiện, một class <code>@ConfigurationProperties</code>, và tệp imports; đặt tên <code>xxx-spring-boot-starter</code>.</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Thêm công tắc tổng: khi <code>labflow.sms.enabled=false</code>, starter không tạo gì cả; khi không có thuộc tính thì cư xử như cũ.</li>
  <li>Chạy ứng dụng với công tắc tắt, có và không có profile <code>zalo</code>, và giải thích cả hai output.</li>
</ol>
<p><strong>Đạt khi:</strong> không có thuộc tính thì output không đổi; <code>false</code> và không profile thì không có <code>SmsSender</code>; <code>false</code> và <code>zalo</code> thì dùng bean riêng của ứng dụng.</p></div>
${giai('Xem một lời giải', `${java(`
@AutoConfiguration
@ConditionalOnProperty(prefix = "labflow.sms", name = "enabled", havingValue = "true", matchIfMissing = true)
@EnableConfigurationProperties(SmsProperties.class)
public class SmsAutoConfiguration { /* … unchanged … */ }`)}
${OUT36_PRAC}
<p><code>matchIfMissing = true</code> giữ starter bật mặc định. Công tắc tắt thì cả class bị bỏ qua, nên <code>getBean(SmsSender.class)</code> lỗi — trong service thật đó sẽ là lỗi khởi động ở chỗ tiêm, đúng điều bạn muốn: tắt SMS phải là quyết định có ý thức kèm một bean thay thế.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Auto-configuration</span><span class="v">Một <code>@Configuration</code> có điều kiện, nằm trong thư viện và được liệt kê trong <code>AutoConfiguration.imports</code>.</span></div>
  <div class="kv"><span class="k">@ConditionalOnMissingBean</span><span class="v">Chỉ tạo mặc định khi ứng dụng chưa định nghĩa — luật lùi lại.</span></div>
  <div class="kv"><span class="k">Báo cáo xét điều kiện</span><span class="v">Output của <code>--debug</code> liệt kê các khớp và không khớp kèm lý do.</span></div>
  <div class="kv"><span class="k">Starter</span><span class="v">Một dependency mang theo thư viện cùng auto-configuration của chúng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Auto-configuration là class cấu hình bình thường có điều kiện, đăng ký qua một tệp imports; Boot 4 tách chúng theo công nghệ.</li>
  <li><code>--debug</code> cho biết chính xác cái gì được áp và vì sao.</li>
  <li>Tự định nghĩa bean làm mặc định lùi lại; một starter là ba tệp nhỏ.</li>
  <li>Công cụ phát triển được tự cấu hình là bề mặt tấn công (H2 console CVE-2021-42392): khoá chúng theo profile.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.spring.io/spring-boot/reference/features/developing-auto-configuration.html', '🍃', 'Spring Boot — Creating Your Own Auto-configuration', 'Điều kiện, thứ tự, đặt tên và kiểm thử một starter tự viết.')}
${tl('https://jfrog.com/blog/the-jndi-strikes-back-unauthenticated-rce-in-h2-database-console/', '🕵️', 'JFrog — The JNDI Strikes Back: Unauthenticated RCE in H2 Database Console', 'Bài phân tích CVE-2021-42392.')}

<h3>Nguồn</h3>
<ul>
  <li>Output ở trên: IocApp --debug, AutoApp (sms-starter 0.0.1 và biến thể 0.0.2 cho phần thực hành) trên Spring Boot 4.1.2; số imports đếm từ jar của dự án này (18/11/2026).</li>
  <li>JFrog, CVE-2021-42392 (06/01/2022): <a href="https://jfrog.com/blog/the-jndi-strikes-back-unauthenticated-rce-in-h2-database-console/" target="_blank" rel="noopener">jfrog.com/blog</a></li>
</ul>
</div>
`;

// ===== Bài 3.7 =====
const YML37_BASE = yml("spring:\n  main:\n    banner-mode: \"off\"\nlogging:\n  level:\n    root: warn\nlabflow:\n  booking:\n    max-hours: 4\n    open-at: \"07:00\"\n    hold-time: 15m\n    labs: [Lab Mạng, Lab IoT, Lab AI]\n  db:\n    password: ${LABFLOW_DB_PASSWORD:dev-only}");
const YML37_DEV = yml("labflow:\n  booking:\n    max-hours: 8          # dev: relax the limit to test faster");
const YML37_PROD = yml("labflow:\n  booking:\n    hold-time: 5m\n  db:\n    password: ${LABFLOW_DB_PASSWORD}   # prod: no default — must come from the environment");
const MA37_APP = java("@ConfigurationPropertiesScan\npublic class ProfApp {\n    public static void main(String[] args) {\n        var ctx = new SpringApplicationBuilder(ProfApp.class).web(WebApplicationType.NONE).logStartupInfo(false)\n                .properties(\"spring.config.name=labflow\").run(args);\n        System.out.println(\"active profiles: \" + java.util.Arrays.toString(ctx.getEnvironment().getActiveProfiles()));\n        System.out.println(ctx.getBean(BookingProps.class));\n        System.out.println(\"mailer: \" + ctx.getBean(Mailer.class).getClass().getSimpleName());\n        System.out.println(\"db password length: \" + ctx.getBean(DbSettings.class).password().length());\n        ctx.close();\n    }\n}\n\n@ConfigurationProperties(\"labflow.booking\")\n@Validated\nrecord BookingProps(@Min(1) @Max(8) int maxHours, @NotBlank String openAt, Duration holdTime, @NotEmpty List<String> labs) {}\n\n@Component\nrecord DbSettings(@Value(\"${labflow.db.password}\") String password) {}\n\ninterface Mailer {}\n@Component @Profile(\"!prod\") class ConsoleMailer implements Mailer {}   // dev/test: print mails to the console\n@Component @Profile(\"prod\")  class SmtpMailer implements Mailer {}      // prod: real SMTP server");
const OUT37_APP = out("$ java ProfApp\nactive profiles: []\nBookingProps[maxHours=4, openAt=07:00, holdTime=PT15M, labs=[Lab Mạng, Lab IoT, Lab AI]]\nmailer: ConsoleMailer\ndb password length: 8\n\n$ java ProfApp --spring.profiles.active=dev\nactive profiles: [dev]\nBookingProps[maxHours=8, openAt=07:00, holdTime=PT15M, labs=[Lab Mạng, Lab IoT, Lab AI]]\nmailer: ConsoleMailer\ndb password length: 8\n\n$ java ProfApp --spring.profiles.active=prod\nError creating bean with name 'dbSettings' …\nCaused by: org.springframework.util.PlaceholderResolutionException: Could not resolve placeholder 'LABFLOW_DB_PASSWORD' in value \"${LABFLOW_DB_PASSWORD}\" <-- \"${labflow.db.password}\"\n\n$ LABFLOW_DB_PASSWORD=s3cr3t-from-vault java ProfApp --spring.profiles.active=prod\nactive profiles: [prod]\nBookingProps[maxHours=4, openAt=07:00, holdTime=PT5M, labs=[Lab Mạng, Lab IoT, Lab AI]]\nmailer: SmtpMailer\ndb password length: 17\n\n$ LABFLOW_BOOKING_MAXHOURS=12 java ProfApp\n***************************\nAPPLICATION FAILED TO START\n***************************\nDescription:\nBinding to target com.cuongthai.c3.prof.BookingProps failed:\n    Property: labflow.booking.maxHours\n    Value: \"12\"\n    Origin: System Environment Property \"LABFLOW_BOOKING_MAXHOURS\"\n    Reason: must be less than or equal to 8");
const OUT37_GIT = out("$ git init -q && git commit … (add application.yml with the real password)\n$ cat application.yml\nspring:\n  datasource:\n    password: ${DB_PASSWORD}\n$ git log --oneline\n<hash> move password to env var\n<hash> add db config\n$ git log -p | grep password\n    move password to env var\n-    password: Pg#Prod-2026!\n+    password: ${DB_PASSWORD}\n+    password: Pg#Prod-2026!");
const OUT37_PRAC = out("$ java ProfApp\nBinding to target com.cuongthai.c3.prof.BookingProps failed:\n    Property: labflow.booking.cancelBefore\n    Value: \"null\"\n    Reason: must not be null\n\n# after adding cancel-before: 2h (base) and 24h (prod)\n$ java ProfApp\nBookingProps[maxHours=4, openAt=07:00, holdTime=PT15M, labs=[Lab Mạng, Lab IoT, Lab AI], cancelBefore=PT2H]\n\n$ LABFLOW_DB_PASSWORD=x java ProfApp --spring.profiles.active=prod\nBookingProps[maxHours=4, openAt=07:00, holdTime=PT5M, labs=[Lab Mạng, Lab IoT, Lab AI], cancelBefore=PT24H]");

const L37_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.7</span>
<h2>Profiles and type-safe configuration</h2>
<p class="lead">The same jar must run on your laptop, in the test pipeline and in production — with different databases, different limits and different mail servers, and with the production password never written in the code. Spring Boot answers with three tools: <strong>profiles</strong> (named sets of configuration and beans), <strong><code>@ConfigurationProperties</code></strong> (configuration bound into a typed, validated object), and <strong>placeholders</strong> that pull secrets from the environment. We run one small app five ways — including the two failures you want to see at startup rather than at 2 a.m. — and end with a secret that stays in Git history after it was "deleted".</p>

<h3>One base file, one file per profile</h3>
<p>The demo app reads <code>labflow.yml</code> (we renamed it from <code>application.yml</code> with <code>spring.config.name</code> so it does not collide with other demos). A profile file is merged <em>on top</em> of the base: it only lists what differs.</p>
${YML37_BASE}
${YML37_DEV}
${YML37_PROD}
<p><code>&#36;{LABFLOW_DB_PASSWORD:dev-only}</code> means "the value of that property or environment variable, otherwise <code>dev-only</code>". In the prod file there is deliberately <strong>no default</strong>.</p>

<h3>Configuration as a typed, validated object</h3>
${MA37_APP}
${OUT37_APP}
<div class="kv-grid">
  <div class="kv"><span class="k">no profile</span><span class="v">Base values; <code>15m</code> became a real <code>Duration</code> (<code>PT15M</code>), the YAML list became a <code>List&lt;String&gt;</code>; <code>ConsoleMailer</code> because <code>@Profile("!prod")</code> matches.</span></div>
  <div class="kv"><span class="k">dev</span><span class="v">Only <code>max-hours</code> changed (8); everything else inherited.</span></div>
  <div class="kv"><span class="k">prod, secret missing</span><span class="v">Startup stops: "Could not resolve placeholder 'LABFLOW_DB_PASSWORD'". Better than starting with an empty password and failing on the first query.</span></div>
  <div class="kv"><span class="k">prod, secret from the environment</span><span class="v"><code>SmtpMailer</code>, <code>holdTime</code> 5 minutes, password of length 17 from the variable — the value is never printed.</span></div>
  <div class="kv"><span class="k">env override = 12</span><span class="v">The environment variable <code>LABFLOW_BOOKING_MAXHOURS</code> overrode the file (environment beats files), and <code>@Max(8)</code> rejected it with the exact property, value, <strong>origin</strong> and reason.</span></div>
</div>

<h3>@ConfigurationProperties vs @Value</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">@ConfigurationProperties</span><span class="v">A group of related settings under one prefix, bound into a record; type conversion (<code>Duration</code>, <code>DataSize</code>, lists, maps); <code>@Validated</code> with Bean Validation; relaxed names; IDE auto-completion with the configuration processor. Use it for anything your code depends on.</span></div>
  <div class="kv"><span class="k">@Value("&#36;{…}")</span><span class="v">One value, injected where needed; supports SpEL; no validation, no grouping. Fine for a one-off (we used it for the password); a dozen <code>@Value</code>s scattered through services is a smell.</span></div>
</div>
<p><strong>Relaxed binding</strong> lets one property be written many ways: <code>labflow.booking.max-hours</code> in YAML, <code>maxHours</code> in Java, <code>LABFLOW_BOOKING_MAXHOURS</code> as an environment variable (dots become underscores, dashes are removed, upper case). In our test on 4.1.2, <code>LABFLOW_BOOKING_MAX_HOURS</code> was bound to the same property too, but the documented canonical form is without the extra underscore — stick to it.</p>

<h3>Where values come from (higher wins)</h3>
<ol>
  <li>Command-line arguments: <code>--labflow.booking.max-hours=6</code></li>
  <li>Environment variables: <code>LABFLOW_BOOKING_MAXHOURS=6</code>, <code>SPRING_PROFILES_ACTIVE=prod</code></li>
  <li>Profile files: <code>application-prod.yml</code> (or <code>labflow-prod.yml</code> here)</li>
  <li>Base file: <code>application.yml</code></li>
  <li>Defaults in code</li>
</ol>
<p>(The full list has more levels — lesson 0.2 ran the three main ones.) This order is the twelve-factor rule "config in the environment": the artifact is identical everywhere; only the environment changes.</p>

<h3>Profiles on beans — and when not to use them</h3>
<p><code>@Profile("prod")</code> / <code>@Profile("!prod")</code> choose implementations: a console mailer in dev, SMTP in prod; an in-memory fake payment gateway in tests. Activate with <code>--spring.profiles.active=prod</code> or <code>SPRING_PROFILES_ACTIVE=prod</code>. Keep profiles for <em>environments</em>. Do not create a profile per customer or per feature flag — that multiplies untested combinations; use properties for that.</p>

<h3>Secrets: never in the repository</h3>
<p>Deleting a password from <code>application.yml</code> in a new commit does not remove it from Git:</p>
${OUT37_GIT}
<p>Anyone who clones the repository — or a fork of it — can read the old line. Once a secret has been pushed, the only fix is to <strong>rotate it</strong> (change the password/key at the source), then optionally rewrite history. Prevention: secrets come from environment variables, Docker/Kubernetes secrets or a secret manager (Vault, AWS Secrets Manager); <code>.env</code> files are in <code>.gitignore</code>; a scanner (gitleaks, GitHub push protection) runs before commits; prod config has no defaults for secrets, so a missing one fails startup as shown above. Spring Boot helps a little: since Boot 3 the Actuator <code>/env</code> endpoint masks all values by default.</p>

<h3>🕵️ Real incident — Toyota T-Connect, disclosed October 2022</h3>
<div class="callout warn"><p>In December 2017 a subcontractor published part of the source code of Toyota's T-Connect website to a <strong>public GitHub repository</strong>. The code contained an <strong>access key to the customer-data server</strong>. It stayed public for almost five years, until access to the repository was closed on 15 September 2022; Toyota changed the key two days later and announced in October that the email addresses and customer management numbers of <strong>296,019</strong> customers could have been accessed, warning them about phishing.</p>
<p><strong>How to prevent it:</strong> the same list as above — no secrets in code or config files, secret scanning on every push (including contractors' repositories), keys with the smallest possible permissions, and rotation as the immediate response when one leaks. The demo above is how it happens: one commit "move password to env var" feels like a fix, but history keeps the old line.</p></div>

<h3>Compared with Node.js</h3>
<p>Node apps read <code>process.env</code>, usually loaded from a <code>.env</code> file by <code>dotenv</code> in development; there are no profiles, so teams use <code>NODE_ENV</code> plus separate files. The equivalent of <code>@Validated @ConfigurationProperties</code> is validating the environment at startup with a schema (zod, envalid) — without it, a missing variable is just <code>undefined</code> and fails later. Interview phrasing: "In both stacks: one artifact, configuration from the environment, validated at startup, secrets never committed."</p>

<h3>In real life and at work</h3>
<p>A café chain: headquarters writes one recipe book (base file); each branch keeps a single page of differences — "Đà Lạt branch: less ice" (profile file); the safe code is never printed in the recipe book, the manager receives it separately (environment secret). At work, a common first ticket is "the app works locally but not in staging": the answer is usually a profile that is not active, or an environment variable spelled with the wrong mapping — the startup failure report and <code>--debug</code> tell you which.</p>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"How do you manage configuration for dev, test and prod?"</strong> — One artifact; base <code>application.yml</code> + profile files; environment variables for anything environment-specific; secrets from a secret store; validated <code>@ConfigurationProperties</code>.</li>
  <li><strong>"@Value or @ConfigurationProperties?"</strong> — <code>@ConfigurationProperties</code> for groups: typed, validated, relaxed binding; <code>@Value</code> for a one-off.</li>
  <li><strong>"Order of property sources?"</strong> — Command line &gt; environment &gt; profile file &gt; base file &gt; defaults (simplified).</li>
  <li><strong>"A developer committed a database password. What do you do?"</strong> — Rotate the password immediately, then remove it from history, add secret scanning, move the value to the environment.</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
  <li>Add <code>@NotNull Duration cancelBefore</code> to <code>BookingProps</code> and run without changing any file: read the error.</li>
  <li>Set <code>cancel-before: 2h</code> in the base file and <code>24h</code> in the prod file.</li>
</ol>
<p><strong>Done when:</strong> default prints <code>cancelBefore=PT2H</code>, prod prints <code>cancelBefore=PT24H</code>.</p></div>
${giai('Show one solution', `${java(`
@ConfigurationProperties("labflow.booking")
@Validated
record BookingProps(@Min(1) @Max(8) int maxHours, @NotBlank String openAt, Duration holdTime, @NotEmpty List<String> labs,
                    @NotNull Duration cancelBefore) {}`)}
${yml(`
# labflow.yml (base), under labflow.booking:
    cancel-before: 2h
# labflow-prod.yml, under labflow.booking:
    cancel-before: 24h`)}
${OUT37_PRAC}
<p>The first run fails at startup with the property name — exactly the behaviour you want when someone forgets a new setting in one environment.</p>`)}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Profile</span><span class="v">A named set of configuration files and beans, activated per environment.</span></div>
  <div class="kv"><span class="k">@ConfigurationProperties</span><span class="v">Binds a prefix of configuration into a typed object.</span></div>
  <div class="kv"><span class="k">@Validated</span><span class="v">Validates bound properties at startup with Bean Validation.</span></div>
  <div class="kv"><span class="k">Relaxed binding</span><span class="v">One property accepted as kebab-case, camelCase or UPPER_SNAKE environment variable.</span></div>
  <div class="kv"><span class="k">Placeholder</span><span class="v"><code>&#36;{NAME:default}</code> — a value resolved from properties or the environment.</span></div>
  <div class="kv"><span class="k">Secret rotation</span><span class="v">Replacing a leaked credential at its source so the old one stops working.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Base file + small profile files; environment and command line override files.</li>
  <li>Bind configuration into validated records; bad values stop startup with their origin.</li>
  <li>Prod secrets have no defaults and come from the environment; a committed secret must be rotated (Toyota 2017–2022).</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.spring.io/spring-boot/reference/features/external-config.html', '🍃', 'Spring Boot — Externalized Configuration', 'Property source order, relaxed binding, @ConfigurationProperties validation.')}
${tl('https://12factor.net/config', '📄', 'The Twelve-Factor App — Config', 'Why configuration belongs in the environment.')}

<h3>Sources</h3>
<ul>
  <li>Outputs above: ProfApp on Spring Boot 4.1.2 (five runs, plus the practice); Git 2.55.0 on the host (18/11/2026).</li>
  <li>Toyota T-Connect: TechCrunch, "Toyota says customer email addresses were exposed…" (12/10/2022): <a href="https://techcrunch.com/2022/10/12/toyota-customer-email-addresses-exposed/" target="_blank" rel="noopener">techcrunch.com</a>; The Register (11/10/2022): <a href="https://www.theregister.com/2022/10/11/toyota_source_code_email_leak/" target="_blank" rel="noopener">theregister.com</a></li>
</ul>
</div>
`;

const L37_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.7</span>
<h2>Profile và cấu hình có kiểu</h2>
<p class="lead">Cùng một tệp jar phải chạy trên laptop của bạn, trong luồng test và trên production — với cơ sở dữ liệu khác, giới hạn khác, máy chủ thư khác, và mật khẩu production không bao giờ được viết trong mã. Spring Boot trả lời bằng ba công cụ: <strong>profile</strong> (các bộ cấu hình và bean có tên), <strong><code>@ConfigurationProperties</code></strong> (cấu hình gắn vào một đối tượng có kiểu, có kiểm tra), và <strong>chỗ giữ giá trị</strong> lấy bí mật từ môi trường. Ta chạy một ứng dụng nhỏ theo năm cách — kể cả hai lần lỗi mà bạn muốn thấy lúc khởi động hơn là lúc 2 giờ sáng — và kết thúc bằng một bí mật vẫn nằm trong lịch sử Git sau khi đã "xoá".</p>

<h3>Một tệp gốc, mỗi profile một tệp</h3>
<p>Ứng dụng demo đọc <code>labflow.yml</code> (đổi tên từ <code>application.yml</code> bằng <code>spring.config.name</code> để không đụng các demo khác). Tệp profile được trộn <em>đè lên</em> tệp gốc: nó chỉ ghi những gì khác.</p>
${YML37_BASE}
${YML37_DEV}
${YML37_PROD}
<p><code>&#36;{LABFLOW_DB_PASSWORD:dev-only}</code> nghĩa là "giá trị của thuộc tính hay biến môi trường đó, nếu không có thì <code>dev-only</code>". Trong tệp prod cố ý <strong>không có mặc định</strong>.</p>

<h3>Cấu hình là một đối tượng có kiểu, có kiểm tra</h3>
${MA37_APP}
${OUT37_APP}
<div class="kv-grid">
  <div class="kv"><span class="k">không profile</span><span class="v">Giá trị gốc; <code>15m</code> thành <code>Duration</code> thật (<code>PT15M</code>), danh sách YAML thành <code>List&lt;String&gt;</code>; <code>ConsoleMailer</code> vì <code>@Profile("!prod")</code> khớp.</span></div>
  <div class="kv"><span class="k">dev</span><span class="v">Chỉ <code>max-hours</code> đổi (8); mọi thứ khác thừa hưởng.</span></div>
  <div class="kv"><span class="k">prod, thiếu bí mật</span><span class="v">Khởi động dừng: "Could not resolve placeholder 'LABFLOW_DB_PASSWORD'". Tốt hơn là khởi động với mật khẩu rỗng rồi lỗi ở truy vấn đầu tiên.</span></div>
  <div class="kv"><span class="k">prod, bí mật từ môi trường</span><span class="v"><code>SmtpMailer</code>, <code>holdTime</code> 5 phút, mật khẩu dài 17 lấy từ biến — giá trị không bao giờ được in ra.</span></div>
  <div class="kv"><span class="k">biến môi trường = 12</span><span class="v">Biến <code>LABFLOW_BOOKING_MAXHOURS</code> đè tệp (môi trường thắng tệp), và <code>@Max(8)</code> từ chối, nêu đúng thuộc tính, giá trị, <strong>nguồn gốc</strong> và lý do.</span></div>
</div>

<h3>@ConfigurationProperties và @Value</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">@ConfigurationProperties</span><span class="v">Một nhóm thiết lập liên quan dưới một tiền tố, gắn vào một record; tự đổi kiểu (<code>Duration</code>, <code>DataSize</code>, list, map); <code>@Validated</code> với Bean Validation; tên linh hoạt; IDE gợi ý nhờ configuration processor. Dùng cho mọi thứ mã của bạn phụ thuộc.</span></div>
  <div class="kv"><span class="k">@Value("&#36;{…}")</span><span class="v">Một giá trị, tiêm vào chỗ cần; hỗ trợ SpEL; không kiểm tra, không gom nhóm. Ổn cho trường hợp lẻ (ta dùng cho mật khẩu); cả chục <code>@Value</code> rải khắp service là mùi xấu.</span></div>
</div>
<p><strong>Gắn linh hoạt (relaxed binding)</strong> cho một thuộc tính được viết nhiều kiểu: <code>labflow.booking.max-hours</code> trong YAML, <code>maxHours</code> trong Java, <code>LABFLOW_BOOKING_MAXHOURS</code> làm biến môi trường (dấu chấm thành gạch dưới, bỏ gạch ngang, viết hoa). Trong lần thử trên 4.1.2, <code>LABFLOW_BOOKING_MAX_HOURS</code> cũng được gắn vào cùng thuộc tính, nhưng dạng chuẩn theo tài liệu là không có gạch dưới thừa — hãy theo dạng đó.</p>

<h3>Giá trị đến từ đâu (cao hơn thắng)</h3>
<ol>
  <li>Đối số dòng lệnh: <code>--labflow.booking.max-hours=6</code></li>
  <li>Biến môi trường: <code>LABFLOW_BOOKING_MAXHOURS=6</code>, <code>SPRING_PROFILES_ACTIVE=prod</code></li>
  <li>Tệp profile: <code>application-prod.yml</code> (ở đây là <code>labflow-prod.yml</code>)</li>
  <li>Tệp gốc: <code>application.yml</code></li>
  <li>Mặc định trong mã</li>
</ol>
<p>(Danh sách đầy đủ còn nhiều tầng hơn — bài 0.2 đã chạy ba tầng chính.) Thứ tự này là luật mười hai yếu tố "cấu hình nằm trong môi trường": sản phẩm build giống hệt ở mọi nơi; chỉ môi trường thay đổi.</p>

<h3>Profile trên bean — và khi nào đừng dùng</h3>
<p><code>@Profile("prod")</code> / <code>@Profile("!prod")</code> chọn cài đặt: mailer in ra màn hình ở dev, SMTP ở prod; cổng thanh toán giả trong bộ nhớ khi test. Bật bằng <code>--spring.profiles.active=prod</code> hoặc <code>SPRING_PROFILES_ACTIVE=prod</code>. Giữ profile cho <em>môi trường</em>. Đừng tạo profile cho từng khách hàng hay từng cờ tính năng — số tổ hợp chưa test sẽ nhân lên; dùng thuộc tính cho việc đó.</p>

<h3>Bí mật: không bao giờ nằm trong kho mã</h3>
<p>Xoá mật khẩu khỏi <code>application.yml</code> trong một commit mới không xoá nó khỏi Git:</p>
${OUT37_GIT}
<p>Ai clone kho — hay một bản fork của nó — đều đọc được dòng cũ. Một khi bí mật đã được đẩy lên, cách sửa duy nhất là <strong>xoay vòng nó</strong> (đổi mật khẩu/khoá tại gốc), sau đó mới tuỳ chọn viết lại lịch sử. Phòng ngừa: bí mật đến từ biến môi trường, secret của Docker/Kubernetes hoặc trình quản lý bí mật (Vault, AWS Secrets Manager); tệp <code>.env</code> nằm trong <code>.gitignore</code>; một bộ quét (gitleaks, push protection của GitHub) chạy trước khi commit; cấu hình prod không có mặc định cho bí mật, nên thiếu là khởi động lỗi như ở trên. Spring Boot giúp một chút: từ Boot 3, endpoint <code>/env</code> của Actuator che mọi giá trị theo mặc định.</p>

<h3>🕵️ Sự cố thật — Toyota T-Connect, công bố tháng 10/2022</h3>
<div class="callout warn"><p>Tháng 12/2017 một nhà thầu phụ đưa một phần mã nguồn website T-Connect của Toyota lên một <strong>kho GitHub công khai</strong>. Mã có chứa <strong>khoá truy cập vào máy chủ dữ liệu khách hàng</strong>. Nó công khai gần năm năm, tới khi truy cập vào kho bị đóng ngày 15/9/2022; Toyota đổi khoá hai ngày sau và tháng 10 thông báo địa chỉ email và mã quản lý khách hàng của <strong>296 019</strong> khách có thể đã bị truy cập, cảnh báo họ về lừa đảo qua email.</p>
<p><strong>Cách phòng:</strong> đúng danh sách ở trên — không bí mật trong mã hay tệp cấu hình, quét bí mật ở mỗi lần push (kể cả kho của nhà thầu), khoá chỉ có quyền nhỏ nhất có thể, và xoay vòng là phản ứng tức thì khi lộ. Demo ở trên là cách nó xảy ra: một commit "chuyển mật khẩu sang biến môi trường" có cảm giác đã sửa, nhưng lịch sử vẫn giữ dòng cũ.</p></div>

<h3>So với Node.js</h3>
<p>Ứng dụng Node đọc <code>process.env</code>, thường được <code>dotenv</code> nạp từ tệp <code>.env</code> khi phát triển; không có profile, nên các nhóm dùng <code>NODE_ENV</code> cộng các tệp riêng. Tương đương của <code>@Validated @ConfigurationProperties</code> là kiểm môi trường lúc khởi động bằng một schema (zod, envalid) — không có nó, biến thiếu chỉ là <code>undefined</code> và lỗi về sau. Cách nói khi phỏng vấn: "Ở cả hai stack: một sản phẩm build, cấu hình từ môi trường, kiểm lúc khởi động, bí mật không bao giờ được commit."</p>

<h3>Đời thường và đi làm</h3>
<p>Một chuỗi cà phê: trụ sở viết một cuốn công thức (tệp gốc); mỗi chi nhánh giữ một trang ghi khác biệt — "chi nhánh Đà Lạt: ít đá" (tệp profile); mã két sắt không bao giờ in trong cuốn công thức, quản lý nhận riêng (bí mật trong môi trường). Đi làm, việc đầu tiên hay gặp là "ứng dụng chạy ở máy tôi mà không chạy trên staging": câu trả lời thường là một profile chưa bật, hoặc một biến môi trường viết sai cách ánh xạ — báo cáo lỗi khởi động và <code>--debug</code> cho bạn biết cái nào.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Bạn quản lý cấu hình cho dev, test, prod thế nào?"</strong> — Một sản phẩm build; <code>application.yml</code> gốc + tệp profile; biến môi trường cho mọi thứ phụ thuộc môi trường; bí mật từ kho bí mật; <code>@ConfigurationProperties</code> có kiểm tra.</li>
  <li><strong>"@Value hay @ConfigurationProperties?"</strong> — <code>@ConfigurationProperties</code> cho nhóm: có kiểu, có kiểm tra, gắn linh hoạt; <code>@Value</code> cho trường hợp lẻ.</li>
  <li><strong>"Thứ tự các nguồn thuộc tính?"</strong> — Dòng lệnh &gt; môi trường &gt; tệp profile &gt; tệp gốc &gt; mặc định (giản lược).</li>
  <li><strong>"Một lập trình viên commit mật khẩu cơ sở dữ liệu. Bạn làm gì?"</strong> — Xoay vòng mật khẩu ngay, rồi xoá khỏi lịch sử, thêm quét bí mật, chuyển giá trị sang môi trường.</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Thêm <code>@NotNull Duration cancelBefore</code> vào <code>BookingProps</code> và chạy mà không sửa tệp nào: đọc lỗi.</li>
  <li>Đặt <code>cancel-before: 2h</code> trong tệp gốc và <code>24h</code> trong tệp prod.</li>
</ol>
<p><strong>Đạt khi:</strong> mặc định in <code>cancelBefore=PT2H</code>, prod in <code>cancelBefore=PT24H</code>.</p></div>
${giai('Xem một lời giải', `${java(`
@ConfigurationProperties("labflow.booking")
@Validated
record BookingProps(@Min(1) @Max(8) int maxHours, @NotBlank String openAt, Duration holdTime, @NotEmpty List<String> labs,
                    @NotNull Duration cancelBefore) {}`)}
${yml(`
# labflow.yml (base), under labflow.booking:
    cancel-before: 2h
# labflow-prod.yml, under labflow.booking:
    cancel-before: 24h`)}
${OUT37_PRAC}
<p>Lần chạy đầu lỗi ngay khi khởi động kèm tên thuộc tính — đúng hành vi bạn muốn khi ai đó quên một thiết lập mới ở một môi trường.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Profile</span><span class="v">Một bộ tệp cấu hình và bean có tên, bật theo môi trường.</span></div>
  <div class="kv"><span class="k">@ConfigurationProperties</span><span class="v">Gắn một tiền tố cấu hình vào một đối tượng có kiểu.</span></div>
  <div class="kv"><span class="k">@Validated</span><span class="v">Kiểm các thuộc tính đã gắn lúc khởi động bằng Bean Validation.</span></div>
  <div class="kv"><span class="k">Gắn linh hoạt</span><span class="v">Một thuộc tính được nhận ở dạng kebab-case, camelCase hay biến môi trường viết HOA_GẠCH_DƯỚI.</span></div>
  <div class="kv"><span class="k">Chỗ giữ giá trị (placeholder)</span><span class="v"><code>&#36;{TÊN:mặc định}</code> — giá trị lấy từ thuộc tính hoặc môi trường.</span></div>
  <div class="kv"><span class="k">Xoay vòng bí mật</span><span class="v">Thay thông tin đăng nhập bị lộ tại gốc để cái cũ hết tác dụng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Tệp gốc + tệp profile nhỏ; môi trường và dòng lệnh đè tệp.</li>
  <li>Gắn cấu hình vào record có kiểm tra; giá trị sai dừng khởi động và nêu nguồn gốc.</li>
  <li>Bí mật prod không có mặc định và đến từ môi trường; bí mật đã commit phải xoay vòng (Toyota 2017–2022).</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.spring.io/spring-boot/reference/features/external-config.html', '🍃', 'Spring Boot — Externalized Configuration', 'Thứ tự nguồn thuộc tính, gắn linh hoạt, kiểm @ConfigurationProperties.')}
${tl('https://12factor.net/config', '📄', 'The Twelve-Factor App — Config', 'Vì sao cấu hình thuộc về môi trường.')}

<h3>Nguồn</h3>
<ul>
  <li>Output ở trên: ProfApp trên Spring Boot 4.1.2 (năm lần chạy, cộng phần thực hành); Git 2.55.0 trên máy (18/11/2026).</li>
  <li>Toyota T-Connect: TechCrunch (12/10/2022): <a href="https://techcrunch.com/2022/10/12/toyota-customer-email-addresses-exposed/" target="_blank" rel="noopener">techcrunch.com</a>; The Register (11/10/2022): <a href="https://www.theregister.com/2022/10/11/toyota_source_code_email_leak/" target="_blank" rel="noopener">theregister.com</a></li>
</ul>
</div>
`;

// ===== Bài 3.8 =====
const MA38_SVC = java("/** Task 1 (SAMPLE, already done): constructor injection, final field. */\n@Service\npublic class BookingService {\n    private final JdbcClient db;\n\n    public BookingService(JdbcClient db) { this.db = db; }\n\n    /** Task 2: all three bookings or none. Today the 3rd one fails and the first two stay in the table. */\n    public void bookBatch(List<String> students, String lab) {\n        for (String s : students) bookOne(s, lab);\n    }\n\n    @Transactional\n    public void bookOne(String student, String lab) {\n        if (student.isBlank()) throw new IllegalArgumentException(\"student is blank\");\n        db.sql(\"INSERT INTO booking(student, lab) VALUES (?, ?)\").params(student, lab).update();\n    }\n\n    /** Task 6: should be measured by a @Timed aspect that calls Timings.record(...). */\n    @Timed\n    public long count() {\n        return db.sql(\"SELECT count(*) FROM booking\").query(Long.class).single();\n    }\n}");
const MA38_GREET = java("/** Task 3: called by many request threads at once. Each student must get their own greeting. */\n@Component\npublic class GreetingController {\n    private String student;\n\n    public String greet(String student) throws InterruptedException {\n        this.student = student;\n        Thread.sleep(20);                       // pretend to load the profile\n        return \"Xin chào \" + this.student;\n    }\n}");
const MA38_DRAFT = java("/** A booking form being filled in: each call to DraftService.newDraft() must return a NEW one. */\n@Component\n@Scope(\"prototype\")\nclass BookingDraft {\n    private static final AtomicInteger SEQ = new AtomicInteger();\n    final int id = SEQ.incrementAndGet();\n}\n\n/** Task 4: today newDraft() always returns the same draft. */\n@Service\npublic class DraftService {\n    private final BookingDraft draft;\n    public DraftService(BookingDraft draft) { this.draft = draft; }\n    public int newDraft() { return draft.id; }\n}");
const MA38_LIMITS = java("/** Task 5: replace with a validated @ConfigurationProperties record (labflow.booking.max-hours, 1..8). */\n@Component\npublic class BookingLimits {\n    @Value(\"${labflow.booking.max-hours}\")\n    int maxHours;\n\n    public int maxHours() { return maxHours; }\n}");
const MA38_SUPPORT = java("/** Marks a method whose duration must be recorded (task 6). */\n@Retention(RetentionPolicy.RUNTIME)\n@Target(ElementType.METHOD)\n@interface Timed {}\n\n/** Where your aspect writes: Timings.record(\"BookingService.count()\", ms). Do not change. */\nfinal class Timings {\n    static final Map<String, Long> LAST = new ConcurrentHashMap<>();\n    static void record(String method, long ms) { LAST.put(method, ms); }\n}");
const OUT38_START = out("$ mvn -q spring-boot:run -Dspring-boot.run.main-class=labflow.Check\nPASS 1. BookingService: constructor injection, final fields\nFAIL 2. bookBatch is all-or-nothing  -- rows left after a failed batch = 2\nFAIL 3. GreetingController is safe under 20 threads  -- 19/20 got someone else's name\nFAIL 4. newDraft() returns a new draft each time  -- ids 1, 1\nFAIL 5. labflow.booking is @ConfigurationProperties, max-hours=12 fails at startup  -- properties bean found=false, max-hours=12 starts\nFAIL 6. @Timed aspect records BookingService.count()  -- Timings = {}\nSCORE 1/6");
const OUT38_GIAI = out("$ mvn -q spring-boot:run -Dspring-boot.run.main-class=labflow.Check\nPASS 1. BookingService: constructor injection, final fields\nPASS 2. bookBatch is all-or-nothing\nPASS 3. GreetingController is safe under 20 threads\nPASS 4. newDraft() returns a new draft each time\n  ***************************\n  APPLICATION FAILED TO START\n  ***************************\n  Description:\n  Binding to target labflow.BookingLimits failed:\n      Property: labflow.booking.maxHours\n      Value: \"12\"\n      Origin: \"labflow.booking.max-hours\" from property source \"commandLineArgs\"\n      Reason: must be less than or equal to 8\nPASS 5. labflow.booking is @ConfigurationProperties, max-hours=12 fails at startup\nPASS 6. @Timed aspect records BookingService.count()\nSCORE 6/6");
const MA38_G_GREET = java("/** Task 3: called by many request threads at once. Each student must get their own greeting. */\n@Component\npublic class GreetingController {\n    public String greet(String student) throws InterruptedException {\n        String current = student;               // a local variable lives on each thread's own stack\n        Thread.sleep(20);                       // pretend to load the profile\n        return \"Xin chào \" + current;\n    }\n}");
const MA38_G_DRAFT = java("/** Task 4: today newDraft() always returns the same draft. */\n@Service\npublic class DraftService {\n    private final ObjectProvider<BookingDraft> drafts;\n    public DraftService(ObjectProvider<BookingDraft> drafts) { this.drafts = drafts; }\n    public int newDraft() { return drafts.getObject().id; }\n}");
const MA38_G_LIMITS = java("/** labflow.booking.max-hours, checked at startup: 12 stops the application before it serves anyone. */\n@ConfigurationProperties(\"labflow.booking\")\n@Validated\npublic record BookingLimits(@Min(1) @Max(8) int maxHours) {}");
const MA38_G_ASPECT = java("@Aspect\n@Component\nclass TimedAspect {\n    @Around(\"@annotation(labflow.Timed)\")\n    Object time(ProceedingJoinPoint jp) throws Throwable {\n        long t0 = System.nanoTime();\n        try {\n            return jp.proceed();\n        } finally {\n            Timings.record(jp.getSignature().toShortString(), (System.nanoTime() - t0) / 1_000_000);\n        }\n    }\n}");
const MA38_APP = java("@SpringBootApplication\npublic class LabflowApp {\n    public static ConfigurableApplicationContext start(String... args) {\n        return new SpringApplicationBuilder(LabflowApp.class).web(WebApplicationType.NONE).logStartupInfo(false).run(args);\n    }\n    public static void main(String[] args) { start(args).close(); }\n}");
const MA38_CHECK = java("/** Grader for lab 3 — do not edit. Run: java -cp … labflow.Check */\npublic class Check {\n    static int pass;\n\n    public static void main(String[] args) throws Exception {\n        var ctx = LabflowApp.start();\n        var db = ctx.getBean(JdbcClient.class);\n        db.sql(\"DROP TABLE IF EXISTS booking\").update();\n        db.sql(\"CREATE TABLE booking (id serial PRIMARY KEY, student text NOT NULL, lab text NOT NULL)\").update();\n\n        // 1. constructor injection\n        var fields = AopUtils.getTargetClass(ctx.getBean(BookingService.class)).getDeclaredFields();\n        check(1, \"BookingService: constructor injection, final fields\",\n                Arrays.stream(fields).allMatch(f -> Modifier.isFinal(f.getModifiers()) && !f.isAnnotationPresent(Autowired.class)), \"\");\n\n        // 2. all-or-nothing batch\n        var svc = ctx.getBean(BookingService.class);\n        try { svc.bookBatch(List.of(\"an\", \"binh\", \" \"), \"Lab Mạng\"); } catch (RuntimeException expected) { }\n        long rows = db.sql(\"SELECT count(*) FROM booking\").query(Long.class).single();\n        check(2, \"bookBatch is all-or-nothing\", rows == 0, \"rows left after a failed batch = \" + rows);\n\n        // 3. no shared state between request threads\n        var greet = ctx.getBean(GreetingController.class);\n        int wrong = 0;\n        try (var pool = Executors.newFixedThreadPool(20)) {\n            List<Future<String>> fs = new ArrayList<>();\n            for (int i = 0; i < 20; i++) { String s = \"sv\" + i; fs.add(pool.submit(() -> greet.greet(s))); }\n            for (int i = 0; i < 20; i++) if (!fs.get(i).get().equals(\"Xin chào sv\" + i)) wrong++;\n        }\n        check(3, \"GreetingController is safe under 20 threads\", wrong == 0, wrong + \"/20 got someone else's name\");\n\n        // 4. a new prototype each call\n        var drafts = ctx.getBean(DraftService.class);\n        int a = drafts.newDraft(), b = drafts.newDraft();\n        check(4, \"newDraft() returns a new draft each time\", a != b, \"ids \" + a + \", \" + b);\n\n        // 5. validated @ConfigurationProperties\n        boolean bound = ctx.getBeansWithAnnotation(ConfigurationProperties.class).values().stream()\n                .map(o -> AopUtils.getTargetClass(o).getAnnotation(ConfigurationProperties.class))\n                .anyMatch(cp -> cp != null && \"labflow.booking\".equals(cp.value()));\n        String bad = \"starts\";\n        try { LabflowApp.start(\"--labflow.booking.max-hours=12\").close(); } catch (Exception e) { bad = \"fails\"; }\n        check(5, \"labflow.booking is @ConfigurationProperties, max-hours=12 fails at startup\", bound && bad.equals(\"fails\"),\n                \"properties bean found=\" + bound + \", max-hours=12 \" + bad);\n\n        // 6. @Timed aspect\n        Timings.LAST.clear();\n        svc.count();\n        check(6, \"@Timed aspect records BookingService.count()\", Timings.LAST.keySet().stream().anyMatch(k -> k.contains(\"count\")),\n                \"Timings = \" + Timings.LAST);\n\n        System.out.println(\"SCORE \" + pass + \"/6\");\n        ctx.close();\n    }\n\n    static void check(int n, String name, boolean ok, String why) {\n        if (ok) pass++;\n        System.out.printf(\"%s %d. %s%s%n\", ok ? \"PASS\" : \"FAIL\", n, name, ok ? \"\" : \"  -- \" + why);\n    }\n}");
const YML38 = yml("spring:\n  main:\n    banner-mode: \"off\"\n  datasource:\n    url: jdbc:postgresql://localhost:5432/labflow\n    username: postgres\n    password: ${DB_PASSWORD:sb}\nlogging:\n  level:\n    root: warn\nlabflow:\n  booking:\n    max-hours: 4");
const XML38_DEPS = xml("  <dependencies>\n    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-jdbc</artifactId></dependency>\n    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-validation</artifactId></dependency>\n    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-aspectj</artifactId></dependency>\n    <dependency><groupId>org.postgresql</groupId><artifactId>postgresql</artifactId><scope>runtime</scope></dependency>\n  </dependencies>");
const MA38_G_SVC = java("    /** Task 2: all three bookings or none. Today the 3rd one fails and the first two stay in the table. */\n    @Transactional                         // the proxy wraps the OUTER call: one transaction for the batch\n    public void bookBatch(List<String> students, String lab) {\n        for (String s : students) bookOne(s, lab);\n    }");

const L38_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.8 — Lab</span>
<h2>Chapter 3 lab: repair the LabFlow core</h2>
<p class="lead">A teammate wrote the core of LabFlow's booking module before learning this chapter. It compiles, it "works" when one person clicks through it — and it hides five container bugs you have now seen running: a batch that saves half its work, a singleton that mixes up students under load, a "new" draft that is always the same draft, a limit that nobody validates, and a <code>@Timed</code> annotation that measures nothing. A grader starts the real Spring context against PostgreSQL and prints PASS/FAIL for six items; the starter scores 1/6.</p>

<h3>Setup</h3>
<ul>
  <li>Java 21, Maven, Docker. Start PostgreSQL: <code>docker run -d --name labflow-pg -e POSTGRES_PASSWORD=sb -e POSTGRES_DB=labflow -p 5432:5432 postgres:16</code>.</li>
  <li>Create a Maven project with the parent <code>spring-boot-starter-parent</code> 4.1.2, the dependencies below, and the <code>spring-boot-maven-plugin</code>; package <code>labflow</code> under <code>src/main/java</code>.</li>
  <li>Run the grader: <code>mvn -q spring-boot:run -Dspring-boot.run.main-class=labflow.Check</code>. It recreates the <code>booking</code> table on every run.</li>
  <li>Item 1 is already done, as an example of the style expected. Items 2–6 are yours. Do not edit <code>Check.java</code>, <code>Support.java</code> or the test data.</li>
</ul>
${XML38_DEPS}
${YML38}
<p>The application class (unchanged by you) and the five files you will work on:</p>
${MA38_APP}
${MA38_SVC}
${MA38_GREET}
${MA38_DRAFT}
${MA38_LIMITS}
${MA38_SUPPORT}
${giai('The grader — Check.java (read it, do not change it)', MA38_CHECK)}
<p>Running the starter as it is:</p>
${OUT38_START}

<h3>The six items</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">1 · constructor injection (example)</span><span class="v"><code>BookingService</code> receives <code>JdbcClient</code> in its constructor and keeps it in a <code>final</code> field — lesson 3.2.</span></div>
  <div class="kv"><span class="k">2 · all-or-nothing batch</span><span class="v">If any student in <code>bookBatch</code> fails, no row of that batch may remain. Today 2 rows stay. Think about which call actually passes through the proxy — lesson 3.5.</span></div>
  <div class="kv"><span class="k">3 · no shared state</span><span class="v">20 threads call <code>greet</code> at once; each must get its own name. Today 19/20 are wrong — lesson 3.4. A fix that makes the 20 calls wait for each other is not accepted.</span></div>
  <div class="kv"><span class="k">4 · a new draft each time</span><span class="v"><code>BookingDraft</code> is a prototype, but <code>newDraft()</code> returns id 1 forever. Make each call return a fresh draft — lesson 3.4.</span></div>
  <div class="kv"><span class="k">5 · validated configuration</span><span class="v">Replace the <code>@Value</code> field with a <code>@ConfigurationProperties("labflow.booking")</code> type whose <code>max-hours</code> must be 1..8, so that starting with <code>--labflow.booking.max-hours=12</code> fails — lesson 3.7. (Remember the class must be registered as configuration properties.)</span></div>
  <div class="kv"><span class="k">6 · @Timed aspect</span><span class="v">Write an aspect so that every method annotated <code>@Timed</code> records its duration with <code>Timings.record(signature, ms)</code> — lesson 3.5. The aspect starter is already on the classpath.</span></div>
</div>

<h3>Done when</h3>
<p>The grader prints <code>SCORE 6/6</code> in three consecutive runs (item 3 is concurrent: one lucky pass is not enough), and:</p>
<ul>
  <li>no <code>synchronized</code>, lock or <code>Thread.sleep</code> was added to make item 3 pass;</li>
  <li>no field in any singleton bean you touched is non-<code>final</code>;</li>
  <li><code>spring.main.allow-circular-references</code> and <code>@Lazy</code> are not used.</li>
</ul>

<h3>Rubric (10 points)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Correctness — 5 pts</span><span class="v">One point per PASS for items 2–6, confirmed in three runs.</span></div>
  <div class="kv"><span class="k">Proxy reasoning — 2 pts</span><span class="v">A two-sentence comment above your item 2 fix explains why the original <code>@Transactional</code> on <code>bookOne</code> did nothing for the batch.</span></div>
  <div class="kv"><span class="k">Statelessness — 1 pt</span><span class="v">Item 3 fixed without serialising the threads (the 20 calls still take about 20 ms in total, not 400 ms).</span></div>
  <div class="kv"><span class="k">Configuration quality — 1 pt</span><span class="v">Item 5 uses a record and Bean Validation annotations, no manual <code>if</code> checks.</span></div>
  <div class="kv"><span class="k">Aspect hygiene — 1 pt</span><span class="v">Item 6 uses <code>@Around</code> with <code>try/finally</code>, so a method that throws is still timed and its exception still reaches the caller.</span></div>
</div>

<h3>Traps we saw while testing the lab</h3>
<ul>
  <li>Putting <code>@Transactional</code> on a <code>private</code> helper — never intercepted, still FAIL 2.</li>
  <li>Making <code>greet</code> <code>synchronized</code> — PASS 3, but every request now waits for the previous one: the rubric point is lost.</li>
  <li>Annotating the record but forgetting to register it (<code>@ConfigurationPropertiesScan</code> or <code>@EnableConfigurationProperties</code>) — the grader finds no properties bean.</li>
</ul>

<h3>Stretch (optional)</h3>
<ul>
  <li>Add a <code>BeanPostProcessor</code> that logs the class of every bean in package <code>labflow</code> after initialisation. Which ones are proxies after your fixes, and why exactly those?</li>
  <li>Run with <code>--debug</code> and find the line that explains why <code>AopAutoConfiguration</code> chose CGLIB.</li>
</ul>

${giai('Show one solution (try for at least 45 minutes first)', `${MA38_G_SVC}
${MA38_G_GREET}
${MA38_G_DRAFT}
${MA38_G_LIMITS}
<p>…plus <code>@ConfigurationPropertiesScan</code> on <code>LabflowApp</code>, and the aspect:</p>
${MA38_G_ASPECT}
${OUT38_GIAI}
<p>Notes: item 2 — <code>bookBatch</code> called <code>this.bookOne(...)</code>, which never crosses the proxy; annotating the outer method gives one transaction around the whole loop (moving the loop into another bean, as in lesson 3.5, is equally correct). Item 3 — a local variable lives on each thread's stack. Item 4 — <code>ObjectProvider.getObject()</code> asks the container on every call. Item 5 — the startup failure shown inside the output is the grader's deliberate second start with <code>max-hours=12</code>. The same result was obtained in three runs.</p>`)}

<h3>🎤 Chapter 3 — what the interviewer will ask</h3>
<ol>
  <li><strong>"What is the difference between IoC and DI?"</strong> — IoC is the principle (the framework controls creation and calls your code); DI is the technique (dependencies are passed in, preferably through the constructor). Spring's ApplicationContext is an IoC container that performs DI.</li>
  <li><strong>"Walk me through what happens when a Spring Boot app starts."</strong> — Read bean definitions (scan + <code>@Bean</code> + auto-configurations filtered by conditions), post-process definitions, create eager singletons dependencies-first, run init callbacks and BeanPostProcessors (proxies), start lifecycle beans (web server), publish ApplicationReadyEvent.</li>
  <li><strong>"Why might @Transactional silently not work?"</strong> — Self-invocation, private/final method, object not created by Spring, checked exception without <code>rollbackFor</code>, or calling from <code>@PostConstruct</code>.</li>
  <li><strong>"Are Spring beans thread-safe?"</strong> — Singletons are shared by all request threads; they are safe only if stateless. Per-request data belongs in parameters, locals, or request-scoped beans.</li>
  <li><strong>"How does Spring Boot decide which beans to create for you, and how do you override one?"</strong> — Auto-configuration classes with <code>@Conditional…</code>; define your own bean (<code>@ConditionalOnMissingBean</code> backs off) or exclude; inspect with <code>--debug</code>.</li>
</ol>
<p>Answer each in under a minute, and back it with something you ran: "I measured 182 of 200 requests getting the wrong profile with a field in a controller" is worth more than any definition.</p>

<h3>Sources</h3>
<ul>
  <li>Starter and solution run on Spring Boot 4.1.2 / Temurin 21.0.12.1 with PostgreSQL 16 (container), 18/11/2026 — starter 1/6, solution 6/6 in three runs, both via <code>mvn spring-boot:run</code> and a plain <code>java -cp</code> launch.</li>
</ul>
</div>
`;

const L38_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.8 — Lab</span>
<h2>Lab chương 3: sửa phần lõi LabFlow</h2>
<p class="lead">Một đồng đội đã viết phần lõi module đặt lịch của LabFlow trước khi học chương này. Nó biên dịch được, nó "chạy" khi một người bấm thử — và nó giấu năm lỗi container mà bạn đã thấy chạy thật: một lô lưu được nửa việc, một singleton trộn lẫn sinh viên khi có tải, một bản nháp "mới" luôn là bản cũ, một giới hạn không ai kiểm, và một annotation <code>@Timed</code> không đo gì cả. Bộ chấm khởi động context Spring thật với PostgreSQL và in PASS/FAIL cho sáu mục; tệp khởi đầu được 1/6.</p>

<h3>Chuẩn bị</h3>
<ul>
  <li>Java 21, Maven, Docker. Chạy PostgreSQL: <code>docker run -d --name labflow-pg -e POSTGRES_PASSWORD=sb -e POSTGRES_DB=labflow -p 5432:5432 postgres:16</code>.</li>
  <li>Tạo dự án Maven với parent <code>spring-boot-starter-parent</code> 4.1.2, các dependency bên dưới, và <code>spring-boot-maven-plugin</code>; package <code>labflow</code> trong <code>src/main/java</code>.</li>
  <li>Chạy bộ chấm: <code>mvn -q spring-boot:run -Dspring-boot.run.main-class=labflow.Check</code>. Mỗi lần chạy nó tạo lại bảng <code>booking</code>.</li>
  <li>Mục 1 đã làm sẵn, làm mẫu cho cách viết mong đợi. Mục 2–6 là của bạn. Không sửa <code>Check.java</code>, <code>Support.java</code> hay dữ liệu thử.</li>
</ul>
${XML38_DEPS}
${YML38}
<p>Class ứng dụng (bạn không sửa) và năm tệp bạn sẽ làm việc:</p>
${MA38_APP}
${MA38_SVC}
${MA38_GREET}
${MA38_DRAFT}
${MA38_LIMITS}
${MA38_SUPPORT}
${giai('Bộ chấm — Check.java (đọc, đừng sửa)', MA38_CHECK)}
<p>Chạy nguyên tệp khởi đầu:</p>
${OUT38_START}

<h3>Sáu mục</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">1 · tiêm qua constructor (mẫu)</span><span class="v"><code>BookingService</code> nhận <code>JdbcClient</code> qua constructor và giữ trong field <code>final</code> — bài 3.2.</span></div>
  <div class="kv"><span class="k">2 · lô được-cả-hoặc-không</span><span class="v">Nếu một sinh viên bất kỳ trong <code>bookBatch</code> lỗi, không dòng nào của lô đó được ở lại. Hiện còn 2 dòng. Hãy nghĩ xem lời gọi nào thật sự đi qua proxy — bài 3.5.</span></div>
  <div class="kv"><span class="k">3 · không trạng thái dùng chung</span><span class="v">20 luồng gọi <code>greet</code> cùng lúc; mỗi luồng phải nhận đúng tên mình. Hiện sai 19/20 — bài 3.4. Cách sửa bắt 20 lời gọi chờ nhau không được chấp nhận.</span></div>
  <div class="kv"><span class="k">4 · mỗi lần một bản nháp mới</span><span class="v"><code>BookingDraft</code> là prototype, nhưng <code>newDraft()</code> trả id 1 mãi. Làm cho mỗi lần gọi trả một bản nháp mới — bài 3.4.</span></div>
  <div class="kv"><span class="k">5 · cấu hình có kiểm tra</span><span class="v">Thay field <code>@Value</code> bằng một kiểu <code>@ConfigurationProperties("labflow.booking")</code> có <code>max-hours</code> phải trong 1..8, để khởi động với <code>--labflow.booking.max-hours=12</code> thì lỗi — bài 3.7. (Nhớ là class phải được đăng ký làm configuration properties.)</span></div>
  <div class="kv"><span class="k">6 · aspect @Timed</span><span class="v">Viết một aspect để mọi hàm gắn <code>@Timed</code> ghi thời gian chạy bằng <code>Timings.record(signature, ms)</code> — bài 3.5. Starter aspect đã có sẵn trên classpath.</span></div>
</div>

<h3>Đạt khi</h3>
<p>Bộ chấm in <code>SCORE 6/6</code> trong ba lần chạy liên tiếp (mục 3 chạy đồng thời: một lần may mắn qua là chưa đủ), và:</p>
<ul>
  <li>không thêm <code>synchronized</code>, khoá hay <code>Thread.sleep</code> nào để mục 3 qua;</li>
  <li>không field nào trong bean singleton bạn đã sửa là không <code>final</code>;</li>
  <li>không dùng <code>spring.main.allow-circular-references</code> và <code>@Lazy</code>.</li>
</ul>

<h3>Thang điểm (10 điểm)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Đúng — 5 điểm</span><span class="v">Mỗi PASS của mục 2–6 một điểm, xác nhận qua ba lần chạy.</span></div>
  <div class="kv"><span class="k">Lập luận về proxy — 2 điểm</span><span class="v">Một chú thích hai câu phía trên cách sửa mục 2 giải thích vì sao <code>@Transactional</code> ban đầu trên <code>bookOne</code> không có tác dụng gì với cả lô.</span></div>
  <div class="kv"><span class="k">Không trạng thái — 1 điểm</span><span class="v">Mục 3 sửa mà không bắt các luồng xếp hàng (20 lời gọi vẫn mất tổng cộng khoảng 20 ms, không phải 400 ms).</span></div>
  <div class="kv"><span class="k">Chất lượng cấu hình — 1 điểm</span><span class="v">Mục 5 dùng record và annotation Bean Validation, không tự viết <code>if</code> kiểm tra.</span></div>
  <div class="kv"><span class="k">Aspect sạch — 1 điểm</span><span class="v">Mục 6 dùng <code>@Around</code> với <code>try/finally</code>, để hàm ném lỗi vẫn được đo và exception vẫn tới được bên gọi.</span></div>
</div>

<h3>Bẫy ta gặp khi thử lab</h3>
<ul>
  <li>Đặt <code>@Transactional</code> lên một hàm phụ <code>private</code> — không bao giờ bị chặn, vẫn FAIL 2.</li>
  <li>Cho <code>greet</code> là <code>synchronized</code> — PASS 3, nhưng mỗi request giờ phải chờ request trước: mất điểm thang chấm.</li>
  <li>Gắn annotation lên record nhưng quên đăng ký (<code>@ConfigurationPropertiesScan</code> hoặc <code>@EnableConfigurationProperties</code>) — bộ chấm không tìm thấy bean thuộc tính.</li>
</ul>

<h3>Nâng cao (không bắt buộc)</h3>
<ul>
  <li>Thêm một <code>BeanPostProcessor</code> ghi log class của mọi bean trong package <code>labflow</code> sau khởi tạo. Sau khi sửa, những bean nào là proxy, và vì sao đúng những bean đó?</li>
  <li>Chạy với <code>--debug</code> và tìm dòng giải thích vì sao <code>AopAutoConfiguration</code> chọn CGLIB.</li>
</ul>

${giai('Xem một lời giải (hãy thử ít nhất 45 phút trước)', `${MA38_G_SVC}
${MA38_G_GREET}
${MA38_G_DRAFT}
${MA38_G_LIMITS}
<p>…thêm <code>@ConfigurationPropertiesScan</code> trên <code>LabflowApp</code>, và aspect:</p>
${MA38_G_ASPECT}
${OUT38_GIAI}
<p>Ghi chú: mục 2 — <code>bookBatch</code> gọi <code>this.bookOne(...)</code>, không bao giờ đi qua proxy; gắn lên hàm bên ngoài cho một giao dịch bao cả vòng lặp (chuyển vòng lặp sang bean khác, như bài 3.5, cũng đúng như vậy). Mục 3 — biến cục bộ nằm trên stack của từng luồng. Mục 4 — <code>ObjectProvider.getObject()</code> hỏi container ở mỗi lần gọi. Mục 5 — lỗi khởi động hiện trong output là lần khởi động thứ hai cố ý của bộ chấm với <code>max-hours=12</code>. Ba lần chạy cho cùng kết quả.</p>`)}

<h3>🎤 Chương 3 — phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"IoC khác DI thế nào?"</strong> — IoC là nguyên tắc (framework điều khiển việc tạo và gọi mã của bạn); DI là kỹ thuật (phụ thuộc được truyền vào, tốt nhất qua constructor). ApplicationContext của Spring là một IoC container thực hiện DI.</li>
  <li><strong>"Kể xem chuyện gì xảy ra khi một ứng dụng Spring Boot khởi động."</strong> — Đọc định nghĩa bean (quét + <code>@Bean</code> + auto-configuration lọc theo điều kiện), xử lý hậu kỳ định nghĩa, tạo singleton tạo sớm theo thứ tự phụ thuộc trước, chạy callback khởi tạo và BeanPostProcessor (proxy), khởi chạy bean vòng đời (web server), phát ApplicationReadyEvent.</li>
  <li><strong>"Vì sao @Transactional có thể lặng lẽ không có tác dụng?"</strong> — Tự gọi, hàm private/final, đối tượng không do Spring tạo, exception checked thiếu <code>rollbackFor</code>, hoặc gọi từ <code>@PostConstruct</code>.</li>
  <li><strong>"Bean Spring có an toàn luồng không?"</strong> — Singleton được mọi luồng request dùng chung; chỉ an toàn nếu không trạng thái. Dữ liệu theo request thuộc về tham số, biến cục bộ, hoặc bean scope request.</li>
  <li><strong>"Spring Boot quyết định tạo bean nào cho bạn thế nào, và bạn ghi đè một bean ra sao?"</strong> — Các class auto-configuration với <code>@Conditional…</code>; tự định nghĩa bean (<code>@ConditionalOnMissingBean</code> lùi lại) hoặc loại bỏ; xem bằng <code>--debug</code>.</li>
</ol>
<p>Trả lời mỗi câu dưới một phút, và dựa vào thứ bạn đã chạy: "tôi đo được 182 trên 200 request nhận sai hồ sơ khi controller có một field" đáng giá hơn mọi định nghĩa.</p>

<h3>Nguồn</h3>
<ul>
  <li>Tệp khởi đầu và lời giải chạy trên Spring Boot 4.1.2 / Temurin 21.0.12.1 với PostgreSQL 16 (container), 18/11/2026 — khởi đầu 1/6, lời giải 6/6 trong ba lần, cả qua <code>mvn spring-boot:run</code> lẫn chạy <code>java -cp</code> thường.</li>
</ul>
</div>
`;

const Q = (question, options, correctIndex) => ({ question, options, correctIndex, points: 1 });
const QUIZ3 = [
  Q('When does an ApplicationContext create a singleton bean that is not marked @Lazy?|||ApplicationContext tạo một singleton bean không có @Lazy vào lúc nào?', [
    'On the first getBean call|||Ở lần gọi getBean đầu tiên',
    'During context startup, after its dependencies have been created|||Trong lúc khởi động context, sau khi các phụ thuộc của nó đã được tạo',
    'On the first HTTP request|||Ở request HTTP đầu tiên',
    'Only when another bean injects it|||Chỉ khi có bean khác tiêm nó',
  ], 1),
  Q('A class uses @Autowired on a private field. In a plain unit test you write new LegacyNotifier().confirm(...). What happens?|||Một class dùng @Autowired trên field private. Trong unit test thường bạn viết new LegacyNotifier().confirm(...). Chuyện gì xảy ra?', [
    'Spring injects the field automatically|||Spring tự tiêm field',
    'Compilation error|||Lỗi biên dịch',
    'NullPointerException, because only Spring knew how to fill the field|||NullPointerException, vì chỉ Spring biết cách điền field',
    'The @Primary bean is used|||Bean @Primary được dùng',
  ], 2),
  Q('Two beans implement NotificationSender, neither is @Primary, and a constructor parameter named sender asks for one. Result?|||Hai bean cài NotificationSender, không cái nào @Primary, và một tham số constructor tên sender xin một cái. Kết quả?', [
    'Spring picks the first one alphabetically|||Spring chọn cái đứng đầu theo bảng chữ cái',
    'Startup fails: expected single matching bean but found 2|||Khởi động lỗi: expected single matching bean but found 2',
    'Spring injects a List automatically|||Spring tự tiêm một List',
    'The parameter receives null|||Tham số nhận null',
  ], 1),
  Q('FullConfig is @Configuration (default). policy() and audit() both call clock(). How many times does the body of clock() run?|||FullConfig là @Configuration (mặc định). policy() và audit() đều gọi clock(). Thân hàm clock() chạy bao nhiêu lần?', [
    'Once — the CGLIB subclass returns the existing bean|||Một lần — lớp con CGLIB trả bean đã có',
    'Twice|||Hai lần',
    'Three times|||Ba lần',
    'Never, @Bean methods are not executed|||Không lần nào, hàm @Bean không được chạy',
  ], 0),
  Q('A singleton CartHolder receives a prototype Cart in its constructor. It calls cart.id() twice, on two different days. What does it see?|||Singleton CartHolder nhận một Cart prototype qua constructor. Nó gọi cart.id() hai lần, ở hai ngày khác nhau. Nó thấy gì?', [
    'Two different ids|||Hai id khác nhau',
    'The same id — the prototype was created once, when CartHolder was built|||Cùng một id — prototype chỉ được tạo một lần, lúc dựng CartHolder',
    'An exception: prototypes cannot be injected into singletons|||Exception: không thể tiêm prototype vào singleton',
    'null the second time|||null ở lần thứ hai',
  ], 1),
  Q('A @RestController stores the X-Student header in an instance field, sleeps 50 ms and returns the field. 200 concurrent requests for 20 students. What did we measure?|||Một @RestController cất header X-Student vào field, ngủ 50 ms rồi trả field. 200 request đồng thời cho 20 sinh viên. Ta đo được gì?', [
    'All 200 correct — Spring creates one controller per request|||Đúng cả 200 — Spring tạo mỗi request một controller',
    'A compile warning|||Một cảnh báo biên dịch',
    'Most responses carried another student\'s profile (182/200 in one run)|||Phần lớn phản hồi mang hồ sơ sinh viên khác (182/200 ở một lần chạy)',
    'Tomcat rejects concurrent requests to the same controller|||Tomcat từ chối request đồng thời vào cùng controller',
  ], 2),
  Q('bookTwice() (no annotation) calls this.book(), which is @Transactional and throws on the second call. Rows left?|||bookTwice() (không annotation) gọi this.book(), hàm có @Transactional và ném lỗi ở lần gọi thứ hai. Còn lại bao nhiêu dòng?', [
    '0 — everything rolled back|||0 — mọi thứ đã rollback',
    '1 — only the failing call rolled back|||1 — chỉ lần gọi lỗi bị rollback',
    '2 — the self-invocation bypassed the proxy, so there was no transaction at all|||2 — tự gọi đi vòng qua proxy, nên không có giao dịch nào cả',
    'It depends on the isolation level|||Tuỳ mức cô lập',
  ], 2),
  Q('A @Transactional method inserts a row and then throws IOException. With default settings…|||Một hàm @Transactional insert một dòng rồi ném IOException. Với thiết lập mặc định…', [
    'the transaction rolls back|||giao dịch rollback',
    'the transaction commits, because checked exceptions do not trigger rollback unless rollbackFor says so|||giao dịch commit, vì exception checked không gây rollback trừ khi rollbackFor chỉ định',
    'Spring wraps it in DataAccessException and rolls back|||Spring bọc nó trong DataAccessException và rollback',
    'the application stops|||ứng dụng dừng',
  ], 1),
  Q('Your starter declares @Bean @ConditionalOnMissingBean SmsSender. The application defines its own SmsSender bean. What happens?|||Starter của bạn khai báo @Bean @ConditionalOnMissingBean SmsSender. Ứng dụng tự định nghĩa bean SmsSender. Chuyện gì xảy ra?', [
    'Startup fails with two candidates|||Khởi động lỗi vì có hai ứng viên',
    'The starter\'s bean wins because auto-configuration runs last|||Bean của starter thắng vì auto-configuration chạy sau cùng',
    'The starter\'s bean is not created; the application\'s bean is used|||Bean của starter không được tạo; bean của ứng dụng được dùng',
    'Both exist and the starter\'s is @Primary|||Cả hai cùng tồn tại và cái của starter là @Primary',
  ], 2),
  Q('labflow-prod.yml contains password: ${LABFLOW_DB_PASSWORD} with no default, and the variable is not set. Starting with the prod profile…|||labflow-prod.yml có password: ${LABFLOW_DB_PASSWORD} không có mặc định, và biến chưa được đặt. Khởi động với profile prod…', [
    'starts with an empty password|||khởi động với mật khẩu rỗng',
    'fails at startup: Could not resolve placeholder \'LABFLOW_DB_PASSWORD\'|||lỗi khi khởi động: Could not resolve placeholder \'LABFLOW_DB_PASSWORD\'',
    'uses the value from the base file|||dùng giá trị trong tệp gốc',
    'prints the literal text ${LABFLOW_DB_PASSWORD}|||in nguyên chữ ${LABFLOW_DB_PASSWORD}',
  ], 1),
];

const L = (n, slug, en, vi, description, content) => ({
  title: `3.${n} — ${en}|||3.${n} — ${vi}`, slug, type: 'LESSON', isFreePreview: false, description, content,
});

export default {
  title: 'Chapter 3 — Spring core, from the inside|||Chương 3 — Lõi Spring, nhìn từ bên trong',
  description: 'IoC container tự viết 50 dòng, ApplicationContext và BeanDefinition, tiêm qua constructor, @Primary/@Qualifier/vòng phụ thuộc, @Configuration full vs lite, vòng đời bean và scope (đo 182/200 hồ sơ sai), proxy và bốn bẫy @Transactional, aspect, auto-configuration + tự viết starter, profile và @ConfigurationProperties — chạy thật trên Spring Boot 4.1.2 + PostgreSQL, lab sửa lõi LabFlow và câu hỏi phỏng vấn.',
  lessons: [
    L(1, 'sb-3-1-ioc-container', 'The IoC container and beans', 'IoC container và bean',
      'Tự viết một IoC container 50 dòng chạy thật (đồ thị phụ thuộc, singleton, phát hiện vòng), BeanDefinition, singleton tạo sớm và @Lazy, 122 định nghĩa bean, BeanFactory vs ApplicationContext, bốn pha khởi động, so với Express/NestJS.',
      L31_EN + L31_VI),
    L(2, 'sb-3-2-dependency-injection', 'Dependency injection: constructor vs field', 'Dependency injection: qua constructor hay qua field',
      'Ba kiểu tiêm, NPE của tiêm qua field, @Primary/@Qualifier/@Order, tiêm List và Map, lỗi hai ứng viên, chọn theo tên tham số, vòng phụ thuộc bị cấm từ Boot 2.6, ObjectProvider, composition root của Node.',
      L32_EN + L32_VI),
    L(3, 'sb-3-3-stereotype', 'Stereotypes, @Configuration and @Bean', 'Annotation phân loại, @Configuration và @Bean',
      'Họ @Component và khác biệt thật của @Repository/@Controller, phạm vi quét, @Bean cho class thư viện (bean Clock để test thời gian), @Configuration full vs lite đo thật, bẫy Clock.systemUTC().',
      L33_EN + L33_VI),
    L(4, 'sb-3-4-bean-lifecycle', 'Bean lifecycle and scopes', 'Vòng đời bean và scope',
      'Vòng đời 14 bước in thật, BeanPostProcessor và chỗ sinh proxy, SmartLifecycle, ApplicationReadyEvent, scope singleton/prototype/request, bẫy prototype trong singleton, scoped proxy, singleton có trạng thái làm lộ 182/200 hồ sơ, Steam 2015.',
      L34_EN + L34_VI),
    L(5, 'sb-3-5-proxy-aop', 'Proxies and AOP: how @Transactional really works', 'Proxy và AOP: @Transactional thật sự chạy thế nào',
      'Tự viết proxy giao dịch bằng JDK, JDK proxy vs CGLIB, bốn bẫy @Transactional với PostgreSQL (tự gọi, exception checked, hàm final, private), aspect đo giờ và kiểm quyền bị vượt khi tự gọi, CVE-2025-41248.',
      L35_EN + L35_VI),
    L(6, 'sb-3-6-auto-configuration', 'Auto-configuration from the inside', 'Auto-configuration từ bên trong',
      'AutoConfiguration.imports và 44 auto-configuration trên classpath Boot 4, @Conditional*, báo cáo --debug, tự viết labflow-sms-spring-boot-starter (thuộc tính, lùi lại khi có bean riêng), loại bỏ, H2 console CVE-2021-42392.',
      L36_EN + L36_VI),
    L(7, 'sb-3-7-profile-config', 'Profiles and type-safe configuration', 'Profile và cấu hình có kiểu',
      'Tệp gốc + tệp profile, @ConfigurationProperties có @Validated (lỗi nêu nguồn gốc), @Value, gắn linh hoạt biến môi trường, @Profile trên bean, bí mật không mặc định, mật khẩu còn trong lịch sử Git, Toyota T-Connect 2022.',
      L37_EN + L37_VI),
    L(8, 'sb-3-8-lab-3', 'Chapter 3 lab + interview questions', 'Lab chương 3 + câu hỏi phỏng vấn',
      'Sửa lõi LabFlow: lô được-cả-hoặc-không, controller không trạng thái, prototype qua ObjectProvider, cấu hình có kiểm tra, aspect @Timed; bộ chấm 6 mục chạy với PostgreSQL (khởi đầu 1/6), thang điểm, lời giải ẩn, 5 câu phỏng vấn chương 3.',
      L38_EN + L38_VI),
    {
      title: '3.9 — Chapter 3 quiz|||3.9 — Kiểm tra chương 3',
      slug: 'sb-3-9-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về singleton tạo sớm, tiêm qua field, hai ứng viên, @Configuration full, prototype trong singleton, singleton có trạng thái, tự gọi @Transactional, exception checked, @ConditionalOnMissingBean và bí mật thiếu ở prod.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every question comes from a program you saw running in this chapter — a container refusing to start, a proxy skipping a transaction, a controller mixing up students. If you miss one, rerun the demo from that lesson and read its output again.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Câu nào cũng lấy từ một chương trình bạn đã thấy chạy thật trong chương — một container từ chối khởi động, một proxy bỏ qua giao dịch, một controller trộn lẫn sinh viên. Sai câu nào thì chạy lại demo của bài đó và đọc lại output.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ3 },
    },
  ],
};
