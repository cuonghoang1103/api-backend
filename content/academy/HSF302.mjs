/**
 * HSF302 — Working with Spring Framework. Giáo trình FLM. Không slide gốc → soạn
 * từ syllabus (JPA/ORM → Spring IoC/DI → Spring Boot → Spring Data JPA → Spring MVC
 * → Thymeleaf) + kiến thức, song ngữ, code Java/Spring thật, kèm BÀI TẬP. Giữ NGUYÊN slug.
 * ⚠️ code mẫu: KHÔNG backtick; ${ } phải viết \${ (Thymeleaf); không \n literal.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 420, questions } });

const intro = doc('hsf302-0-1-overview', 'Course overview: Working with Spring Framework|||Tổng quan môn: Làm việc với Spring Framework',
  'Mục tiêu, CLO (ORM/JPA; Spring & Spring Boot; Spring Data; Spring MVC; JavaFX CRUD; teamwork), 6-7 chương, và bảng đánh giá (Assignment 10% · Group 25% · Progress 10% · PE 25% · TE 30%).',
  [[
    `<span class="eyebrow">HSF302 · Lesson 0.1 · Overview</span>
<h2>Working with Spring Framework</h2>
<p class="lead">Spring is the dominant framework for building Java back-ends. This course goes from <strong>JPA/ORM</strong> (mapping objects to tables) → the <strong>Spring Framework</strong> core (IoC/DI) → <strong>Spring Boot</strong> (convention over configuration) → <strong>Spring Data JPA</strong> (repositories) → <strong>Spring MVC &amp; Thymeleaf</strong> (web) — ending in a working data-driven application.</p>
<h3>CLOs</h3>
<ul>
<li><strong>CLO1</strong> — ORM basics &amp; how it simplifies database access</li>
<li><strong>CLO2</strong> — Spring Framework &amp; Spring Boot concepts</li>
<li><strong>CLO3</strong> — Spring Data with various data sources</li>
<li><strong>CLO4</strong> — Spring MVC for modern Java web applications</li>
<li><strong>CLO5</strong> — cross-platform CRUD apps (incl. JavaFX)</li>
<li><strong>CLO6</strong> — teamwork &amp; communication (presentation) skills</li>
</ul>
<div class="callout"><span class="badge">★ Nền</span> Cần Java (PRO192/CSD201) và SQL (DBI202). Spring giấu rất nhiều "ống nước" (boilerplate) để bạn tập trung vào nghiệp vụ.</div>`,
    `<span class="eyebrow">HSF302 · Bài 0.1 · Tổng quan</span>
<h2>Làm việc với Spring Framework</h2>
<p class="lead">Spring là framework thống trị để xây back-end Java. Môn này đi từ <strong>JPA/ORM</strong> (ánh xạ đối tượng ↔ bảng) → lõi <strong>Spring Framework</strong> (IoC/DI) → <strong>Spring Boot</strong> (quy ước hơn cấu hình) → <strong>Spring Data JPA</strong> (repository) → <strong>Spring MVC &amp; Thymeleaf</strong> (web) — kết bằng một ứng dụng hướng dữ liệu chạy được.</p>
<h3>CLO</h3>
<ul>
<li><strong>CLO1</strong> — cơ bản ORM &amp; cách nó đơn giản hoá truy cập DB</li>
<li><strong>CLO2</strong> — khái niệm Spring Framework &amp; Spring Boot</li>
<li><strong>CLO3</strong> — Spring Data với nhiều nguồn dữ liệu</li>
<li><strong>CLO4</strong> — Spring MVC cho ứng dụng web Java hiện đại</li>
<li><strong>CLO5</strong> — ứng dụng CRUD đa nền tảng (kể cả JavaFX)</li>
<li><strong>CLO6</strong> — kỹ năng làm nhóm &amp; giao tiếp (thuyết trình)</li>
</ul>
<div class="callout"><span class="badge">★ Nền</span> Cần Java (PRO192/CSD201) và SQL (DBI202). Spring giấu rất nhiều "ống nước" (boilerplate) để bạn tập trung vào nghiệp vụ.</div>`,
  ]]);

const c1 = doc('hsf302-1-1-jpa', '1.1 — JPA & ORM: entity mapping|||1.1 — JPA & ORM: ánh xạ entity',
  'ORM & JPA/Hibernate, @Entity/@Id/@GeneratedValue, ánh xạ cột, và quan hệ (@OneToMany/@ManyToOne/@ManyToMany); vì sao ORM giảm SQL thủ công.',
  [[
    `<span class="eyebrow">HSF302 · Chapter 1 · Lesson 1.1</span>
<h2>JPA &amp; ORM</h2>
<p class="lead"><strong>JPA</strong> (Java Persistence API, implemented by Hibernate) is an <strong>ORM</strong>: it maps Java classes to database tables so you work with objects, not SQL. Annotations declare the mapping.</p>
<pre><code class="language-java">import jakarta.persistence.*;

@Entity
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    private double price;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;      // many products → one category
    // getters/setters...
}
</code></pre>
<p><code>@Entity</code> maps the class to a table; <code>@Id</code> + <code>@GeneratedValue</code> is the auto primary key; <code>@Column</code> tunes a column. Relationships: <code>@ManyToOne</code>/<code>@OneToMany</code> (one category, many products), <code>@ManyToMany</code>. Hibernate generates the SQL for you — the value of ORM is <strong>less boilerplate and fewer SQL bugs</strong>.</p>`,
    `<span class="eyebrow">HSF302 · Chương 1 · Bài 1.1</span>
<h2>JPA &amp; ORM</h2>
<p class="lead"><strong>JPA</strong> (Java Persistence API, hiện thực bởi Hibernate) là một <strong>ORM</strong>: ánh xạ class Java tới bảng database để bạn làm việc bằng đối tượng, không phải SQL. Annotation khai báo ánh xạ.</p>
<pre><code class="language-java">import jakarta.persistence.*;

@Entity
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    private double price;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;      // nhiều product → một category
    // getter/setter...
}
</code></pre>
<p><code>@Entity</code> ánh xạ class tới bảng; <code>@Id</code> + <code>@GeneratedValue</code> là khoá chính tự sinh; <code>@Column</code> tinh chỉnh cột. Quan hệ: <code>@ManyToOne</code>/<code>@OneToMany</code> (một category, nhiều product), <code>@ManyToMany</code>. Hibernate sinh SQL giúp bạn — giá trị của ORM là <strong>ít boilerplate và ít bug SQL</strong>.</p>`,
  ]]);

const c1q = quiz('hsf302-quiz-1', 'Quiz 1 — JPA & ORM|||Quiz 1 — JPA & ORM', [
  { id: 'q1', question: 'Annotation nào đánh dấu class là một bảng?', options: ['@Table only', '@Entity', '@Id', '@Component'], correctIndex: 1, explanation: '@Entity ánh xạ class tới bảng; @Table tuỳ chỉnh tên bảng.' },
  { id: 'q2', question: '@ManyToOne trên field category nghĩa là?', options: ['Một product một category, một category nhiều product', 'Product không có category', 'Nhiều category một product', 'Quan hệ nhiều-nhiều'], correctIndex: 0, explanation: 'Nhiều product trỏ về một category (phía "many").' },
  { id: 'q3', question: 'Lợi ích chính của ORM/JPA?', options: ['Chạy nhanh hơn SQL', 'Làm việc bằng đối tượng, ít boilerplate & bug SQL', 'Không cần database', 'Bắt buộc bởi Java'], correctIndex: 1, explanation: 'ORM sinh SQL, giảm code lặp và lỗi khi thao tác DB.' },
]);

const c2 = doc('hsf302-2-1-ioc-di', '2.1 — Spring core: IoC & Dependency Injection|||2.1 — Lõi Spring: IoC & Dependency Injection',
  'Inversion of Control & container Spring, bean, DI qua constructor (@Component/@Service/@Repository, @Autowired), và vì sao loose coupling + dễ test.',
  [[
    `<span class="eyebrow">HSF302 · Chapter 2 · Lesson 2.1</span>
<h2>Spring core: IoC &amp; Dependency Injection</h2>
<p class="lead">Spring's heart is the <strong>IoC container</strong>: instead of your code creating its dependencies, Spring creates and <strong>injects</strong> them. Objects it manages are <strong>beans</strong>.</p>
<pre><code class="language-java">@Service                                   // a bean
public class ProductService {
    private final ProductRepository repo;

    public ProductService(ProductRepository repo) {   // constructor injection
        this.repo = repo;                              // Spring supplies it
    }
    public List&lt;Product&gt; findCheap() { return repo.findByPriceLessThan(200000); }
}
</code></pre>
<p>Stereotype annotations register beans: <code>@Component</code> (generic), <code>@Service</code> (business logic), <code>@Repository</code> (data access), <code>@Controller</code> (web). Spring wires them by type. <strong>Prefer constructor injection</strong> (as above) — it makes dependencies explicit, final, and easy to unit-test by passing a mock. This is Dependency Inversion made automatic.</p>`,
    `<span class="eyebrow">HSF302 · Chương 2 · Bài 2.1</span>
<h2>Lõi Spring: IoC &amp; Dependency Injection</h2>
<p class="lead">Trái tim Spring là <strong>IoC container</strong>: thay vì code của bạn tự tạo phụ thuộc, Spring tạo và <strong>tiêm</strong> chúng. Đối tượng Spring quản là <strong>bean</strong>.</p>
<pre><code class="language-java">@Service                                   // một bean
public class ProductService {
    private final ProductRepository repo;

    public ProductService(ProductRepository repo) {   // constructor injection
        this.repo = repo;                              // Spring cấp
    }
    public List&lt;Product&gt; findCheap() { return repo.findByPriceLessThan(200000); }
}
</code></pre>
<p>Annotation stereotype đăng ký bean: <code>@Component</code> (chung), <code>@Service</code> (nghiệp vụ), <code>@Repository</code> (truy cập dữ liệu), <code>@Controller</code> (web). Spring nối chúng theo kiểu. <strong>Ưu tiên constructor injection</strong> (như trên) — làm phụ thuộc tường minh, final, và dễ unit-test bằng cách truyền mock. Đây là Dependency Inversion tự động hoá.</p>`,
  ]]);

const c2q = quiz('hsf302-quiz-2', 'Quiz 2 — IoC & DI|||Quiz 2 — IoC & DI', [
  { id: 'q1', question: 'IoC container của Spring làm gì?', options: ['Chạy SQL', 'Tạo & tiêm các phụ thuộc (bean)', 'Vẽ UI', 'Nén dữ liệu'], correctIndex: 1, explanation: 'IoC: Spring tạo bean và inject phụ thuộc thay cho code của bạn.' },
  { id: 'q2', question: 'Annotation cho lớp nghiệp vụ (service)?', options: ['@Repository', '@Service', '@Entity', '@Controller'], correctIndex: 1, explanation: '@Service cho tầng nghiệp vụ; @Repository cho DAO; @Controller cho web.' },
  { id: 'q3', question: 'Vì sao ưu tiên constructor injection?', options: ['Ngắn hơn', 'Phụ thuộc tường minh, final, dễ test (mock)', 'Bắt buộc bởi Spring', 'Chạy nhanh hơn'], correctIndex: 1, explanation: 'Constructor injection làm rõ phụ thuộc và dễ mock khi test.' },
]);

const c3 = doc('hsf302-3-1-spring-boot', '3.1 — Spring Boot: auto-config & starters|||3.1 — Spring Boot: auto-config & starter',
  'Spring Boot là gì (convention over configuration), starter dependency, @SpringBootApplication, application.properties, và chạy embedded server.',
  [[
    `<span class="eyebrow">HSF302 · Chapter 3 · Lesson 3.1</span>
<h2>Spring Boot</h2>
<p class="lead">Plain Spring needs a lot of configuration. <strong>Spring Boot</strong> applies <em>convention over configuration</em>: sensible defaults, <strong>auto-configuration</strong>, <strong>starter</strong> dependencies, and an <strong>embedded server</strong> — so you run a web app with one <code>main</code> method.</p>
<pre><code class="language-java">@SpringBootApplication      // = @Configuration + @EnableAutoConfiguration + @ComponentScan
public class ShopApplication {
    public static void main(String[] args) {
        SpringApplication.run(ShopApplication.class, args);   // starts embedded Tomcat
    }
}
</code></pre>
<pre><code class="language-text"># application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/shop
spring.jpa.hibernate.ddl-auto=update
server.port=8080
</code></pre>
<p><strong>Starters</strong> (e.g. <code>spring-boot-starter-web</code>, <code>spring-boot-starter-data-jpa</code>) pull in a curated set of dependencies. <strong>Auto-configuration</strong> sees a JPA + MySQL driver on the classpath and configures the DataSource for you. Configure via <code>application.properties</code>/<code>.yml</code>.</p>`,
    `<span class="eyebrow">HSF302 · Chương 3 · Bài 3.1</span>
<h2>Spring Boot</h2>
<p class="lead">Spring thuần cần nhiều cấu hình. <strong>Spring Boot</strong> áp <em>quy ước hơn cấu hình</em>: mặc định hợp lý, <strong>auto-configuration</strong>, dependency <strong>starter</strong>, và <strong>server nhúng</strong> — nên bạn chạy một web app chỉ với một hàm <code>main</code>.</p>
<pre><code class="language-java">@SpringBootApplication      // = @Configuration + @EnableAutoConfiguration + @ComponentScan
public class ShopApplication {
    public static void main(String[] args) {
        SpringApplication.run(ShopApplication.class, args);   // khởi động Tomcat nhúng
    }
}
</code></pre>
<pre><code class="language-text"># application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/shop
spring.jpa.hibernate.ddl-auto=update
server.port=8080
</code></pre>
<p><strong>Starter</strong> (vd <code>spring-boot-starter-web</code>, <code>spring-boot-starter-data-jpa</code>) kéo vào một bộ dependency chọn lọc. <strong>Auto-configuration</strong> thấy JPA + driver MySQL trên classpath và cấu hình DataSource giúp bạn. Cấu hình qua <code>application.properties</code>/<code>.yml</code>.</p>`,
  ]]);

const c3q = quiz('hsf302-quiz-3', 'Quiz 3 — Spring Boot|||Quiz 3 — Spring Boot', [
  { id: 'q1', question: 'Triết lý của Spring Boot là?', options: ['Cấu hình mọi thứ bằng tay', 'Convention over configuration (quy ước hơn cấu hình)', 'Không dùng Spring', 'Chỉ chạy Windows'], correctIndex: 1, explanation: 'Boot dùng mặc định hợp lý + auto-config để giảm cấu hình.' },
  { id: 'q2', question: '@SpringBootApplication gộp những gì?', options: ['@Entity + @Id', '@Configuration + @EnableAutoConfiguration + @ComponentScan', '@Service + @Repository', 'Không gì'], correctIndex: 1, explanation: 'Nó là annotation tổng hợp bật auto-config + component scan.' },
  { id: 'q3', question: 'File cấu hình chính của Spring Boot?', options: ['pom.xml', 'application.properties/.yml', 'web.xml', 'index.html'], correctIndex: 1, explanation: 'application.properties/.yml chứa cấu hình runtime (datasource, port…).' },
]);

const c4 = doc('hsf302-4-1-spring-data', '4.1 — Spring Data JPA: repositories|||4.1 — Spring Data JPA: repository',
  'JpaRepository/CrudRepository cho CRUD sẵn, derived query (findByName…), @Query tuỳ chỉnh, phân trang/sắp xếp; không cần viết SQL.',
  [[
    `<span class="eyebrow">HSF302 · Chapter 4 · Lesson 4.1</span>
<h2>Spring Data JPA</h2>
<p class="lead"><strong>Spring Data JPA</strong> removes DAO boilerplate: declare an <strong>interface</strong> extending <code>JpaRepository</code> and Spring generates the implementation — CRUD, paging and derived queries — at runtime.</p>
<pre><code class="language-java">public interface ProductRepository extends JpaRepository&lt;Product, Long&gt; {
    // derived query — Spring parses the method name into SQL
    List&lt;Product&gt; findByPriceLessThan(double max);
    List&lt;Product&gt; findByNameContainingIgnoreCase(String kw);

    // custom JPQL when names aren't enough
    @Query("select p from Product p where p.category.name = :cat")
    List&lt;Product&gt; inCategory(@Param("cat") String cat);
}
</code></pre>
<p>Out of the box you get <code>save</code>, <code>findById</code>, <code>findAll</code>, <code>deleteById</code>, plus <code>findAll(Pageable)</code> for pagination/sorting. <strong>Derived queries</strong> turn a method name (<code>findByPriceLessThan</code>) into SQL automatically; use <code>@Query</code> (JPQL) for anything custom. You write almost no SQL.</p>`,
    `<span class="eyebrow">HSF302 · Chương 4 · Bài 4.1</span>
<h2>Spring Data JPA</h2>
<p class="lead"><strong>Spring Data JPA</strong> bỏ boilerplate DAO: khai một <strong>interface</strong> kế thừa <code>JpaRepository</code> và Spring sinh hiện thực — CRUD, phân trang và derived query — lúc chạy.</p>
<pre><code class="language-java">public interface ProductRepository extends JpaRepository&lt;Product, Long&gt; {
    // derived query — Spring phân tích tên method thành SQL
    List&lt;Product&gt; findByPriceLessThan(double max);
    List&lt;Product&gt; findByNameContainingIgnoreCase(String kw);

    // JPQL tuỳ chỉnh khi tên không đủ
    @Query("select p from Product p where p.category.name = :cat")
    List&lt;Product&gt; inCategory(@Param("cat") String cat);
}
</code></pre>
<p>Có sẵn <code>save</code>, <code>findById</code>, <code>findAll</code>, <code>deleteById</code>, cộng <code>findAll(Pageable)</code> cho phân trang/sắp xếp. <strong>Derived query</strong> biến tên method (<code>findByPriceLessThan</code>) thành SQL tự động; dùng <code>@Query</code> (JPQL) cho cái tuỳ chỉnh. Bạn gần như không viết SQL.</p>`,
  ]]);

const c4e = doc('hsf302-4-2-exercise', 'Exercise 1 — a repository & service|||Bài tập 1 — repository & service',
  'Bài tập: viết ProductRepository (tìm theo khoảng giá) và ProductService dùng nó qua DI; kèm lời giải.',
  [[
    `<span class="eyebrow">HSF302 · Chapter 4 · Exercise</span>
<h2>Exercise 1 — repository + service</h2>
<div class="callout"><span class="badge">Đề</span> Write a repository method to find products with price in a range, and a service that returns them sorted by price (ascending), injecting the repo via the constructor.</div>
<h3>Worked solution</h3>
<pre><code class="language-java">public interface ProductRepository extends JpaRepository&lt;Product, Long&gt; {
    List&lt;Product&gt; findByPriceBetweenOrderByPriceAsc(double min, double max);
}

@Service
public class ProductService {
    private final ProductRepository repo;
    public ProductService(ProductRepository repo) { this.repo = repo; }

    public List&lt;Product&gt; inPriceRange(double min, double max) {
        return repo.findByPriceBetweenOrderByPriceAsc(min, max);
    }
}
</code></pre>
<p><strong>Why:</strong> the derived method name <code>findByPriceBetweenOrderByPriceAsc</code> encodes both the filter (<code>BETWEEN</code>) and the sort — Spring writes the SQL. The service depends only on the repository interface (injected), so it's decoupled and unit-testable with a mock repo.</p>`,
    `<span class="eyebrow">HSF302 · Chương 4 · Bài tập</span>
<h2>Bài tập 1 — repository + service</h2>
<div class="callout"><span class="badge">Đề</span> Viết method repository tìm product có giá trong một khoảng, và một service trả về chúng sắp theo giá tăng, tiêm repo qua constructor.</div>
<h3>Lời giải</h3>
<pre><code class="language-java">public interface ProductRepository extends JpaRepository&lt;Product, Long&gt; {
    List&lt;Product&gt; findByPriceBetweenOrderByPriceAsc(double min, double max);
}

@Service
public class ProductService {
    private final ProductRepository repo;
    public ProductService(ProductRepository repo) { this.repo = repo; }

    public List&lt;Product&gt; inPriceRange(double min, double max) {
        return repo.findByPriceBetweenOrderByPriceAsc(min, max);
    }
}
</code></pre>
<p><strong>Vì sao:</strong> tên method derived <code>findByPriceBetweenOrderByPriceAsc</code> mã hoá cả bộ lọc (<code>BETWEEN</code>) và sắp xếp — Spring tự viết SQL. Service chỉ phụ thuộc interface repository (được tiêm) nên tách rời và test được bằng mock repo.</p>`,
  ]]);

const c4q = quiz('hsf302-quiz-4', 'Quiz 4 — Spring Data JPA|||Quiz 4 — Spring Data JPA', [
  { id: 'q1', question: 'Kế thừa JpaRepository<Product,Long> cho sẵn?', options: ['Chỉ save', 'CRUD + phân trang + derived query (Spring sinh hiện thực)', 'Chỉ findAll', 'Không gì'], correctIndex: 1, explanation: 'Spring Data sinh CRUD/paging/derived query từ interface.' },
  { id: 'q2', question: 'findByNameContainingIgnoreCase là loại?', options: ['SQL thô', 'Derived query (Spring dịch tên method → SQL)', '@Query bắt buộc', 'Stored procedure'], correctIndex: 1, explanation: 'Tên method được Spring phân tích thành truy vấn.' },
  { id: 'q3', question: 'Khi tên method không đủ, dùng?', options: ['@Entity', '@Query (JPQL)', '@Service', '@Column'], correctIndex: 1, explanation: '@Query cho viết JPQL/SQL tuỳ chỉnh.' },
]);

const c5 = doc('hsf302-5-1-spring-mvc', '5.1 — Spring MVC & REST controllers|||5.1 — Spring MVC & REST controller',
  '@RestController vs @Controller, @GetMapping/@PostMapping, @PathVariable/@RequestBody, trả JSON & status code (ResponseEntity), validation; dựng REST API CRUD.',
  [[
    `<span class="eyebrow">HSF302 · Chapter 5 · Lesson 5.1</span>
<h2>Spring MVC &amp; REST controllers</h2>
<p class="lead">Spring MVC maps HTTP requests to controller methods. <code>@RestController</code> returns data (JSON) for APIs; <code>@Controller</code> returns view names (Thymeleaf, next chapter).</p>
<pre><code class="language-java">@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService service;
    public ProductController(ProductService service) { this.service = service; }

    @GetMapping                                  // GET /api/products
    public List&lt;Product&gt; all() { return service.findAll(); }

    @GetMapping("/{id}")                          // GET /api/products/5
    public ResponseEntity&lt;Product&gt; one(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping                                 // POST body → object
    public ResponseEntity&lt;Product&gt; create(@Valid @RequestBody Product p) {
        Product saved = service.save(p);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
</code></pre>
<p><code>@PathVariable</code> binds URL parts, <code>@RequestBody</code> binds the JSON body, <code>@Valid</code> triggers validation; <code>ResponseEntity</code> lets you set the status code (200/201/404). This is the same REST design as PRN232, done the Spring/Java way.</p>`,
    `<span class="eyebrow">HSF302 · Chương 5 · Bài 5.1</span>
<h2>Spring MVC &amp; REST controller</h2>
<p class="lead">Spring MVC ánh xạ request HTTP tới method controller. <code>@RestController</code> trả dữ liệu (JSON) cho API; <code>@Controller</code> trả tên view (Thymeleaf, chương sau).</p>
<pre><code class="language-java">@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService service;
    public ProductController(ProductService service) { this.service = service; }

    @GetMapping                                  // GET /api/products
    public List&lt;Product&gt; all() { return service.findAll(); }

    @GetMapping("/{id}")                          // GET /api/products/5
    public ResponseEntity&lt;Product&gt; one(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping                                 // POST body → object
    public ResponseEntity&lt;Product&gt; create(@Valid @RequestBody Product p) {
        Product saved = service.save(p);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
</code></pre>
<p><code>@PathVariable</code> bind phần URL, <code>@RequestBody</code> bind body JSON, <code>@Valid</code> kích hoạt validation; <code>ResponseEntity</code> cho đặt status code (200/201/404). Cùng thiết kế REST như PRN232, làm theo cách Spring/Java.</p>`,
  ]]);

const c5q = quiz('hsf302-quiz-5', 'Quiz 5 — Spring MVC|||Quiz 5 — Spring MVC', [
  { id: 'q1', question: '@RestController khác @Controller ở?', options: ['Không khác', '@RestController trả dữ liệu (JSON); @Controller trả tên view', 'Chỉ @Controller có DI', '@RestController chỉ GET', 'Không dùng được'], correctIndex: 1, explanation: '@RestController = @Controller + @ResponseBody → trả body (JSON).' },
  { id: 'q2', question: '@RequestBody dùng để?', options: ['Bind phần URL', 'Bind body JSON của request thành object', 'Trả status', 'Route'], correctIndex: 1, explanation: '@RequestBody deserialize JSON body vào tham số.' },
  { id: 'q3', question: 'ResponseEntity cho phép?', options: ['Chỉ trả 200', 'Đặt status code + body (200/201/404)', 'Chỉ JSON', 'Kết nối DB'], correctIndex: 1, explanation: 'ResponseEntity kiểm soát status + header + body.' },
]);

const c6 = doc('hsf302-6-1-thymeleaf', '6.1 — Server-side web with Thymeleaf|||6.1 — Web phía server với Thymeleaf',
  'Thymeleaf là gì (template server-side), @Controller trả view + Model, cú pháp th:text/th:each/th:if, form binding; dựng trang danh sách & form CRUD.',
  [[
    `<span class="eyebrow">HSF302 · Chapter 6 · Lesson 6.1</span>
<h2>Server-side web with Thymeleaf</h2>
<p class="lead"><strong>Thymeleaf</strong> is a server-side HTML template engine. A <code>@Controller</code> puts data into a <code>Model</code> and returns a template name; Thymeleaf renders HTML with that data.</p>
<pre><code class="language-java">@Controller
public class ProductViewController {
    private final ProductService service;
    public ProductViewController(ProductService s) { this.service = s; }

    @GetMapping("/products")
    public String list(Model model) {
        model.addAttribute("products", service.findAll());
        return "products";        // renders templates/products.html
    }
}
</code></pre>
<pre><code class="language-html">&lt;!-- templates/products.html --&gt;
&lt;table&gt;
  &lt;tr th:each="p : \${products}"&gt;
    &lt;td th:text="\${p.name}"&gt;name&lt;/td&gt;
    &lt;td th:text="\${p.price}"&gt;0&lt;/td&gt;
  &lt;/tr&gt;
&lt;/table&gt;
</code></pre>
<p>Thymeleaf attributes: <code>th:text</code> (set text), <code>th:each</code> (loop), <code>th:if</code> (conditional), <code>th:href</code>. Expressions use <code>\${...}</code> to read model attributes. Bind a form to an object with <code>th:object</code> + <code>th:field</code> for CRUD pages. (CLO5 also covers <strong>JavaFX</strong> for desktop CRUD — a different UI over the same Spring services.)</p>`,
    `<span class="eyebrow">HSF302 · Chương 6 · Bài 6.1</span>
<h2>Web phía server với Thymeleaf</h2>
<p class="lead"><strong>Thymeleaf</strong> là engine template HTML phía server. Một <code>@Controller</code> đưa dữ liệu vào một <code>Model</code> và trả tên template; Thymeleaf render HTML với dữ liệu đó.</p>
<pre><code class="language-java">@Controller
public class ProductViewController {
    private final ProductService service;
    public ProductViewController(ProductService s) { this.service = s; }

    @GetMapping("/products")
    public String list(Model model) {
        model.addAttribute("products", service.findAll());
        return "products";        // render templates/products.html
    }
}
</code></pre>
<pre><code class="language-html">&lt;!-- templates/products.html --&gt;
&lt;table&gt;
  &lt;tr th:each="p : \${products}"&gt;
    &lt;td th:text="\${p.name}"&gt;name&lt;/td&gt;
    &lt;td th:text="\${p.price}"&gt;0&lt;/td&gt;
  &lt;/tr&gt;
&lt;/table&gt;
</code></pre>
<p>Thuộc tính Thymeleaf: <code>th:text</code> (đặt text), <code>th:each</code> (lặp), <code>th:if</code> (điều kiện), <code>th:href</code>. Biểu thức dùng <code>\${...}</code> để đọc thuộc tính model. Bind form vào object bằng <code>th:object</code> + <code>th:field</code> cho trang CRUD. (CLO5 còn có <strong>JavaFX</strong> cho CRUD desktop — một UI khác trên cùng service Spring.)</p>`,
  ]]);

const c6q = quiz('hsf302-quiz-6', 'Quiz 6 — Thymeleaf|||Quiz 6 — Thymeleaf', [
  { id: 'q1', question: '@Controller (không Rest) trả về?', options: ['JSON', 'Tên view (template Thymeleaf)', 'Status code', 'SQL'], correctIndex: 1, explanation: '@Controller trả tên template; @RestController trả dữ liệu.' },
  { id: 'q2', question: 'th:each dùng để?', options: ['Đặt text', 'Lặp qua một collection', 'Điều kiện', 'Route'], correctIndex: 1, explanation: 'th:each lặp render một phần tử cho mỗi item.' },
  { id: 'q3', question: 'Dữ liệu truyền từ controller sang view qua?', options: ['ResponseEntity', 'Model (addAttribute)', '@RequestBody', 'application.properties'], correctIndex: 1, explanation: 'Model.addAttribute đưa dữ liệu để template đọc bằng ${...}.' },
]);

// Mục "Tài liệu tham khảo" — nội dung GỐC do mình soạn: trích dẫn sách + link
// nguồn chính thức miễn phí + trỏ giáo trình/slide đầy đủ trên FLM. KHÔNG upload
// PDF có bản quyền lên CDN công khai.
const taiLieu = doc('hsf302-0-0-tai-lieu', '📚 Materials & resource hub|||📚 Trung tâm tài liệu môn học',
  'Trung tâm tài liệu: giáo trình & slide chính thức (FLM), sách (kèm link), tài liệu chính thức miễn phí, video YouTube, công cụ học/thực hành, và lộ trình tự học đầy đủ (trường + nâng cao thực tế).',
  [[
    `<span class="eyebrow">HSF302 · Resource hub</span>
<h2>Materials &amp; resource hub</h2>
<p class="lead">Everything to master Spring in one place — enough to pass the exam with a high score AND to use Spring confidently at work. The full official FPTU slides &amp; textbook are on FLM; below is a curated, legal, mostly-free resource set.</p>
<h3>📘 Official course textbook &amp; slides</h3>
<p>Sign in to <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> with your FPTU account → the HSF302 giáo trình + full lecture slides are there (official source for exam scope).</p>
<h3>📗 Reference books (with links)</h3>
<ul>
<li><em>Spring Start Here</em> — Laurentiu Spilca (Manning): <a href="https://www.manning.com/books/spring-start-here" target="_blank" rel="noopener">manning.com/books/spring-start-here</a> — best for beginners.</li>
<li><em>Spring in Action</em> (6th ed.) — Craig Walls (Manning): <a href="https://www.manning.com/books/spring-in-action-sixth-edition" target="_blank" rel="noopener">manning.com/books/spring-in-action-sixth-edition</a> — the classic.</li>
</ul>
<h3>🌐 Official docs (free)</h3>
<ul>
<li>Spring Boot reference — <a href="https://spring.io/projects/spring-boot" target="_blank" rel="noopener">spring.io/projects/spring-boot</a></li>
<li>Spring Framework reference — <a href="https://docs.spring.io/spring-framework/reference/" target="_blank" rel="noopener">docs.spring.io/spring-framework/reference</a></li>
<li>Spring Data JPA — <a href="https://spring.io/projects/spring-data-jpa" target="_blank" rel="noopener">spring.io/projects/spring-data-jpa</a></li>
<li>Spring Guides (hands-on) — <a href="https://spring.io/guides" target="_blank" rel="noopener">spring.io/guides</a></li>
<li>Baeldung tutorials — <a href="https://www.baeldung.com/spring-tutorial" target="_blank" rel="noopener">baeldung.com/spring-tutorial</a></li>
</ul>
<h3>▶️ Learn on YouTube</h3>
<ul>
<li>Spring Developer (official) — <a href="https://www.youtube.com/@SpringSourceDev" target="_blank" rel="noopener">youtube.com/@SpringSourceDev</a></li>
<li>Amigoscode — <a href="https://www.youtube.com/@amigoscode" target="_blank" rel="noopener">youtube.com/@amigoscode</a></li>
<li>Java Brains — <a href="https://www.youtube.com/@Java.Brains" target="_blank" rel="noopener">youtube.com/@Java.Brains</a></li>
<li>Telusko — <a href="https://www.youtube.com/@Telusko" target="_blank" rel="noopener">youtube.com/@Telusko</a></li>
</ul>
<h3>🛠️ Tools for study &amp; practice</h3>
<ul>
<li>Spring Initializr (bootstrap a project) — <a href="https://start.spring.io" target="_blank" rel="noopener">start.spring.io</a></li>
<li>IntelliJ IDEA (IDE) — <a href="https://www.jetbrains.com/idea/" target="_blank" rel="noopener">jetbrains.com/idea</a></li>
<li>Postman (test REST APIs) — <a href="https://www.postman.com/downloads/" target="_blank" rel="noopener">postman.com/downloads</a></li>
<li>DBeaver (database client) — <a href="https://dbeaver.io" target="_blank" rel="noopener">dbeaver.io</a></li>
</ul>
<h3>🎯 Self-study roadmap (school → job)</h3>
<ol>
<li><strong>Foundation (exam core):</strong> JPA/ORM entity mapping &amp; relationships → IoC/DI &amp; beans → Spring Boot auto-config → Spring Data JPA repositories → Spring MVC/REST → Thymeleaf. This is the assessed scope — master it for a high grade.</li>
<li><strong>Practice:</strong> build ONE CRUD app end-to-end (entity → repository → service → REST controller → Thymeleaf page). Repetition is what makes Spring click.</li>
<li><strong>Go deeper (real world):</strong> validation &amp; exception handling, DTO/mapping, pagination &amp; sorting, transactions (@Transactional), Spring Security (auth/JWT), testing (JUnit + MockMvc), and connecting a real DB (MySQL/PostgreSQL).</li>
<li><strong>Job-ready:</strong> package with Maven/Gradle, profiles &amp; application.yml, Docker, deploy; understand REST best practices &amp; API docs (Swagger/OpenAPI).</li>
</ol>
<div class="callout"><span class="badge">Tip</span> Follow the official docs + one YouTube series while building the CRUD app; use Baeldung as a per-topic reference. That combo covers both the exam and practical skills.</div>`,
    `<span class="eyebrow">HSF302 · Trung tâm tài liệu</span>
<h2>Trung tâm tài liệu môn học</h2>
<p class="lead">Gom mọi thứ để học chắc Spring — đủ để thi điểm cao VÀ dùng được khi đi làm. Giáo trình &amp; slide chính thức đầy đủ nằm trên FLM; bên dưới là bộ tài liệu chọn lọc, hợp pháp, phần lớn miễn phí.</p>
<h3>📘 Giáo trình &amp; slide chính thức</h3>
<p>Đăng nhập <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> bằng tài khoản FPTU → có giáo trình HSF302 + slide bài giảng đầy đủ (nguồn chính thức, đúng phạm vi thi).</p>
<h3>📗 Sách tham khảo (kèm link)</h3>
<ul>
<li><em>Spring Start Here</em> — Laurentiu Spilca (Manning): <a href="https://www.manning.com/books/spring-start-here" target="_blank" rel="noopener">manning.com/books/spring-start-here</a> — hợp người mới.</li>
<li><em>Spring in Action</em> (bản 6) — Craig Walls (Manning): <a href="https://www.manning.com/books/spring-in-action-sixth-edition" target="_blank" rel="noopener">manning.com/books/spring-in-action-sixth-edition</a> — kinh điển.</li>
</ul>
<h3>🌐 Tài liệu chính thức (miễn phí)</h3>
<ul>
<li>Spring Boot — <a href="https://spring.io/projects/spring-boot" target="_blank" rel="noopener">spring.io/projects/spring-boot</a></li>
<li>Spring Framework reference — <a href="https://docs.spring.io/spring-framework/reference/" target="_blank" rel="noopener">docs.spring.io/spring-framework/reference</a></li>
<li>Spring Data JPA — <a href="https://spring.io/projects/spring-data-jpa" target="_blank" rel="noopener">spring.io/projects/spring-data-jpa</a></li>
<li>Spring Guides (thực hành) — <a href="https://spring.io/guides" target="_blank" rel="noopener">spring.io/guides</a></li>
<li>Baeldung — <a href="https://www.baeldung.com/spring-tutorial" target="_blank" rel="noopener">baeldung.com/spring-tutorial</a></li>
</ul>
<h3>▶️ Học qua YouTube</h3>
<ul>
<li>Spring Developer (chính thức) — <a href="https://www.youtube.com/@SpringSourceDev" target="_blank" rel="noopener">youtube.com/@SpringSourceDev</a></li>
<li>Amigoscode — <a href="https://www.youtube.com/@amigoscode" target="_blank" rel="noopener">youtube.com/@amigoscode</a></li>
<li>Java Brains — <a href="https://www.youtube.com/@Java.Brains" target="_blank" rel="noopener">youtube.com/@Java.Brains</a></li>
<li>Telusko — <a href="https://www.youtube.com/@Telusko" target="_blank" rel="noopener">youtube.com/@Telusko</a></li>
</ul>
<h3>🛠️ Công cụ học &amp; thực hành</h3>
<ul>
<li>Spring Initializr (tạo project) — <a href="https://start.spring.io" target="_blank" rel="noopener">start.spring.io</a></li>
<li>IntelliJ IDEA (IDE) — <a href="https://www.jetbrains.com/idea/" target="_blank" rel="noopener">jetbrains.com/idea</a></li>
<li>Postman (test REST API) — <a href="https://www.postman.com/downloads/" target="_blank" rel="noopener">postman.com/downloads</a></li>
<li>DBeaver (client CSDL) — <a href="https://dbeaver.io" target="_blank" rel="noopener">dbeaver.io</a></li>
</ul>
<h3>🎯 Lộ trình tự học (trường → đi làm)</h3>
<ol>
<li><strong>Nền tảng (lõi thi):</strong> JPA/ORM ánh xạ entity &amp; quan hệ → IoC/DI &amp; bean → Spring Boot auto-config → Spring Data JPA repository → Spring MVC/REST → Thymeleaf. Đây là phạm vi được chấm — nắm chắc để điểm cao.</li>
<li><strong>Luyện tập:</strong> dựng MỘT app CRUD trọn vẹn (entity → repository → service → REST controller → trang Thymeleaf). Lặp lại là cách Spring "sáng" ra.</li>
<li><strong>Đào sâu (thực tế):</strong> validation &amp; xử lý ngoại lệ, DTO/mapping, phân trang &amp; sắp xếp, giao dịch (@Transactional), Spring Security (auth/JWT), kiểm thử (JUnit + MockMvc), nối DB thật (MySQL/PostgreSQL).</li>
<li><strong>Sẵn sàng đi làm:</strong> đóng gói Maven/Gradle, profile &amp; application.yml, Docker, triển khai; hiểu chuẩn REST &amp; tài liệu API (Swagger/OpenAPI).</li>
</ol>
<div class="callout"><span class="badge">Mẹo</span> Vừa xem tài liệu chính thức + một series YouTube vừa dựng app CRUD; dùng Baeldung tra theo chủ đề. Bộ ba đó phủ cả bài thi lẫn kỹ năng thực tế.</div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'HSF302',
    slug: 'hsf302-working-with-spring-framework',
    title: 'Working with Spring Framework',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/HSF302.webp',
    shortDescription: 'Build Java back-ends with Spring — JPA/ORM, IoC & DI, Spring Boot, Spring Data JPA repositories, Spring MVC/REST & Thymeleaf. Bilingual, with Java/Spring code & exercises.|||Xây back-end Java với Spring — JPA/ORM, IoC & DI, Spring Boot, repository Spring Data JPA, Spring MVC/REST & Thymeleaf. Song ngữ, code Java/Spring & bài tập.',
    description: 'Môn <strong>HSF302 — Làm việc với Spring Framework</strong> (ngành Kỹ thuật phần mềm, kỳ 5). Đi từ <strong>JPA/ORM</strong> (ánh xạ entity) → lõi <strong>Spring (IoC/DI)</strong> → <strong>Spring Boot</strong> (auto-config, starter) → <strong>Spring Data JPA</strong> (repository, derived query) → <strong>Spring MVC/REST</strong> → <strong>Thymeleaf</strong> (web phía server), hướng tới ứng dụng CRUD hoàn chỉnh (kể cả JavaFX). Bám giáo trình FLM, song ngữ, code Java/Spring chạy được và bài tập kèm lời giải.',
    whatYouLearn: 'JPA/ORM & Hibernate (@Entity/@Id/quan hệ); Spring IoC & DI (bean, @Service/@Repository, constructor injection); Spring Boot (@SpringBootApplication, starter, application.properties); Spring Data JPA (JpaRepository, derived query, @Query, paging); Spring MVC & REST (@RestController, @GetMapping/@PostMapping, @PathVariable/@RequestBody, ResponseEntity, validation); Thymeleaf (th:text/th:each, form binding); giới thiệu JavaFX CRUD.',
    requirements: 'Đã học Java (PRO192/CSD201) và SQL/CSDL (DBI202). Cần JDK 17+, Maven/Gradle, một IDE (IntelliJ IDEA / Eclipse / VS Code) và một database (MySQL/H2).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, lộ trình tự học.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao Spring, CLO, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — JPA & ORM|||Chapter 1 — JPA & ORM', description: 'Entity mapping, quan hệ.', lessons: [c1, c1q] },
    { title: 'Chương 2 — IoC & DI|||Chapter 2 — IoC & DI', description: 'Bean, stereotype, constructor injection.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Spring Boot|||Chapter 3 — Spring Boot', description: 'Auto-config, starter, properties.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Spring Data JPA|||Chapter 4 — Spring Data JPA', description: 'JpaRepository, derived query, @Query.', lessons: [c4, c4e, c4q] },
    { title: 'Chương 5 — Spring MVC & REST|||Chapter 5 — Spring MVC & REST', description: '@RestController, mapping, ResponseEntity.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Thymeleaf|||Chapter 6 — Thymeleaf', description: 'View server-side, th:each/th:text, form.', lessons: [c6, c6q] },
  ],
};
