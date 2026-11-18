/**
 * Spring Boot — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 25/09/2026; SOẠN CHI TIẾT từ 17/11/2026 (agent sb, máy nhà)
 * theo lộ trình đi làm Backend Node.js + Spring Boot (chốt 17/11/2026). Mở rộng 12 → 19 mục (~105 bài): thêm ⭐ Java hiện đại
 * (Ch.1–2), JPA chuyên sâu (Ch.7), góc nhìn hacker (Ch.10), Redis (Ch.13), sự kiện/hàng đợi (Ch.14), quan sát (Ch.15),
 * hiệu năng (Ch.16). Đo thật trên Spring Boot 4.1.2 + Java 21 (xem spring-boot/_chung.mjs → PHIEN_BAN).
 *
 * Mục nào đã soạn thì thay phần tử khung bằng tệp chương thật (spring-boot/sNN-*.mjs). Mục 0 GIỮ slug bài đầu
 * (sb-0-8-bat-dau-tai-day) nên seeder cập nhật tại chỗ. Các chương 1–18 ĐÁNH SỐ LẠI so với khung cũ (Ch.1 Java cũ nay là Ch.1–2,
 * Ch.2 lõi Spring cũ nay là Ch.3, …) ⇒ seeder tạo section mới theo slug bài đầu mới; section khung cũ (sb-1-1-record-var,
 * sb-2-1-ioc-container, …) cần gỡ khi deploy — ghi trong báo cáo agent sb.
 */
import { khung } from './_chung/khung.mjs';
import s00 from './spring-boot/s00-bat-dau.mjs';
import s01 from './spring-boot/s01-java-hien-dai-1.mjs';

const CHUONG = [
  ['Section 0 — Why Spring Boot', 'Mục 0 — Vì sao Spring Boot', '(đã soạn — spring-boot/s00-bat-dau.mjs)', [['bat-dau-tai-day', '-', '-', '-']]],
  ['Chapter 1 — ⭐ Modern Java (1): types and data modelling', 'Chương 1 — ⭐ Java hiện đại (1): kiểu dữ liệu và mô hình hoá', 'Java 17/21 bạn sẽ dùng suốt khoá: record, sealed, pattern matching, generics, lambda, exception, collections.', [
    ['record-var', 'Records, var and immutability', 'Record, var và tính bất biến', 'record thay class DTO dài dòng · var suy luận kiểu cục bộ · Bất biến: vì sao đối tượng không đổi an toàn khi nhiều luồng · Khi nào record không hợp (entity JPA)'],
    ['pattern-matching', 'Sealed types, pattern matching and switch expressions', 'Sealed, pattern matching và switch expression', 'sealed interface/class cho tập kiểu đóng · instanceof có pattern · switch biểu thức + record pattern (Java 21) · Mô hình hoá trạng thái lượt đặt LabFlow'],
    ['generics-lambda', 'Generics, functional interfaces and lambdas', 'Generics, interface hàm và lambda', 'Generics và wildcard (? extends/? super) · Function, Supplier, Predicate · Method reference · Vì sao Spring dùng lambda khắp nơi'],
    ['exception-java', 'Exceptions: checked vs unchecked', 'Exception: checked vs unchecked', 'Checked buộc khai báo throws · Unchecked (RuntimeException) phổ biến trong Spring · try-with-resources · Exception riêng của nghiệp vụ · Đọc stack trace từ dưới lên'],
    ['collections', 'Collections: choosing List, Set, Map — and equals/hashCode', 'Collections: chọn đúng List, Set, Map — và equals/hashCode', 'ArrayList vs LinkedList đo thật · HashMap bên trong (bucket, treeify) · equals/hashCode hỏng thì Set nhân đôi · TreeMap, LinkedHashMap, List.of bất biến · Câu phỏng vấn HashMap'],
    ['lab-1', 'Chapter 1 lab + interview questions', 'Lab chương 1 + câu hỏi phỏng vấn', 'Mô hình hoá LabFlow bằng record + sealed · Rubric · 5 câu phỏng vấn Java core hay gặp'],
  ]],
  ['Chapter 2 — ⭐ Modern Java (2): streams, concurrency and the JVM', 'Chương 2 — ⭐ Java hiện đại (2): Stream, đồng thời và JVM', 'Stream/Optional, luồng, virtual thread, bộ nhớ JVM và GC — đủ để trả lời phỏng vấn và hiểu server Spring.', [
    ['stream-api', 'The Stream API', 'Stream API', 'map/filter/reduce · Collectors (toList, groupingBy, toMap) · Stream lười và một lần · Khi nào vòng for dễ đọc hơn'],
    ['optional', 'Optional and null safety', 'Optional và an toàn null', 'Optional thay null ở kiểu trả về · orElseThrow trong service · Đừng dùng Optional làm field/tham số · JSpecify @Nullable của Spring 7'],
    ['thread-executor', 'Threads, ExecutorService and CompletableFuture', 'Thread, ExecutorService và CompletableFuture', 'Thread vs Runnable · Pool luồng · CompletableFuture nối việc bất đồng bộ · Pool Tomcat 200 luồng trong Spring'],
    ['race-condition', 'Race conditions, locks and atomic types', 'Tranh chấp dữ liệu, khoá và kiểu atomic', 'count++ mất cập nhật (đo thật) · synchronized, ReentrantLock · AtomicInteger, ConcurrentHashMap · Deadlock và cách đọc thread dump'],
    ['virtual-threads', 'Virtual threads (Java 21)', 'Virtual thread (Java 21)', 'Luồng nền tảng vs virtual thread · 10.000 request chờ I/O đo thật · Pinning và synchronized · spring.threads.virtual.enabled'],
    ['jvm-gc', 'JVM memory and garbage collection', 'Bộ nhớ JVM và thu gom rác', 'Heap, stack, metaspace · GC thế hệ, G1 vs ZGC · OutOfMemoryError tái hiện thật · -Xmx trong container · JFR và jcmd'],
    ['lab-2', 'Chapter 2 lab + interview questions', 'Lab chương 2 + câu hỏi phỏng vấn', 'Thống kê lượt đặt bằng Stream + chạy song song an toàn · Rubric · Câu phỏng vấn đồng thời và GC'],
  ]],
  ['Chapter 3 — Spring core, from the inside', 'Chương 3 — Lõi Spring, nhìn từ bên trong', 'IoC container, dependency injection, vòng đời bean, proxy, auto-configuration và profile.', [
    ['ioc-container', 'The IoC container and beans', 'IoC container và bean', 'Inversion of Control là gì · Tự viết một container 50 dòng · ApplicationContext · BeanDefinition'],
    ['dependency-injection', 'Dependency injection: constructor vs field', 'Dependency injection: qua constructor hay qua field', 'Constructor injection (khuyến nghị) · Field injection và vì sao khó test · Nhiều bean cùng kiểu: @Primary, @Qualifier · Vòng phụ thuộc'],
    ['stereotype', 'Stereotypes, @Configuration and @Bean', 'Annotation phân loại, @Configuration và @Bean', '@Component, @Service, @Repository, @Controller · @Bean cho class thư viện · @Configuration proxyBeanMethods'],
    ['bean-lifecycle', 'Bean lifecycle and scopes', 'Vòng đời bean và scope', 'Khởi tạo → tiêm → @PostConstruct → dùng → @PreDestroy · BeanPostProcessor · singleton, prototype, request · Singleton có trạng thái = lỗi đa luồng'],
    ['proxy-aop', 'Proxies and AOP: how @Transactional really works', 'Proxy và AOP: @Transactional thật sự chạy thế nào', 'JDK proxy vs CGLIB · Tự gọi trong cùng class không qua proxy · @Aspect đo thời gian · Bẫy final/private'],
    ['auto-configuration', 'Auto-configuration from the inside', 'Auto-configuration từ bên trong', '@Conditional* · AutoConfiguration.imports · Tự viết một starter nhỏ · Ghi đè bean mặc định'],
    ['profile-config', 'Profiles and type-safe configuration', 'Profile và cấu hình có kiểu', 'application-dev.yml vs application-prod.yml · @Profile · @ConfigurationProperties + validation · Bí mật qua biến môi trường'],
    ['lab-3', 'Chapter 3 lab + interview questions', 'Lab chương 3 + câu hỏi phỏng vấn', 'Truy vết vòng đời bean và proxy của LabFlow · Rubric · Câu phỏng vấn IoC/DI/AOP'],
  ]],
  ['Chapter 4 — REST controllers', 'Chương 4 — REST controller', 'Endpoint HTTP, DTO, Jackson và đường đi của một request.', [
    ['restcontroller', '@RestController and request mapping', '@RestController và request mapping', '@GetMapping/@PostMapping/@PutMapping/@PatchMapping/@DeleteMapping · @PathVariable, @RequestParam · ResponseEntity và mã trạng thái · So với Express'],
    ['dto', 'DTOs: why not expose entities directly', 'DTO: vì sao không trả thẳng entity', 'Entity lộ chi tiết DB · Record làm DTO · Ánh xạ tay hay MapStruct · Hợp đồng API ổn định'],
    ['requestbody', '@RequestBody, Jackson 3 and content negotiation', '@RequestBody, Jackson 3 và content negotiation', 'JSON ↔ đối tượng · Content-Type và Accept · Ngày giờ ISO-8601 và múi giờ · Tuỳ biến Jackson'],
    ['dispatcher-servlet', 'The request pipeline: DispatcherServlet, filters and interceptors', 'Đường đi của request: DispatcherServlet, filter và interceptor', 'Filter vs HandlerInterceptor vs @ControllerAdvice · Log mã request · Luồng Tomcat xử lý request'],
    ['thiet-ke-rest', 'REST design: status codes, pagination, idempotency', 'Thiết kế REST: mã trạng thái, phân trang, idempotency', '201 + Location, 204, 409 · Phân trang và sắp xếp · Idempotency-Key cho POST đặt lịch'],
    ['lab-4', 'Chapter 4 lab + interview questions', 'Lab chương 4 + câu hỏi phỏng vấn', 'CRUD labs/devices bằng DTO · Rubric · Câu phỏng vấn REST'],
  ]],
  ['Chapter 5 — Validation and error handling', 'Chương 5 — Validate dữ liệu và xử lý lỗi', 'Jakarta Bean Validation và lỗi chuẩn RFC 9457 (ProblemDetail).', [
    ['bean-validation', 'Jakarta Bean Validation', 'Jakarta Bean Validation', '@NotNull, @NotBlank, @Size, @Email, @Future · @Valid trên @RequestBody · Validate lồng nhau · Validate tham số đường dẫn'],
    ['exception-handler-spring', 'Centralized error handling with ProblemDetail', 'Xử lý lỗi tập trung với ProblemDetail', '@RestControllerAdvice + @ExceptionHandler · RFC 9457 application/problem+json · Lỗi validate từng trường · Không lộ stack trace'],
    ['custom-validator', 'Custom and cross-field validators', 'Validator tuỳ biến và liên trường', '@Constraint + ConstraintValidator · Giờ kết thúc sau giờ bắt đầu · Validate cần DB thì để service'],
    ['validation-group', 'Create vs update: groups or separate DTOs', 'Tạo mới vs cập nhật: group hay tách DTO', 'Validation group · PATCH từng phần · Khi nào tách hẳn DTO'],
    ['lab-5', 'Chapter 5 lab + interview questions', 'Lab chương 5 + câu hỏi phỏng vấn', 'API đặt lịch có validate + lỗi chuẩn · Rubric · Câu phỏng vấn'],
  ]],
  ['Chapter 6 — Spring Data JPA + PostgreSQL', 'Chương 6 — Spring Data JPA + PostgreSQL', 'Entity, repository, persistence context, quan hệ, truy vấn và giao dịch.', [
    ['entity-repository', 'Entities and repositories', 'Entity và repository', '@Entity, @Id, @GeneratedValue · JpaRepository · Derived query (findByEmail) · Xem SQL Hibernate sinh ra'],
    ['persistence-context', 'The persistence context: entity states and dirty checking', 'Persistence context: trạng thái entity và dirty checking', 'transient/managed/detached/removed · Dirty checking tự UPDATE · flush · Cache cấp 1'],
    ['quan-he-jpa', 'Relationships: @ManyToOne, @OneToMany, @ManyToMany', 'Quan hệ: @ManyToOne, @OneToMany, @ManyToMany', '@JoinColumn và mappedBy · Hai chiều và đồng bộ · cascade, orphanRemoval · LAZY mặc định nên dùng'],
    ['jpql-query', 'Queries: JPQL, @Query, projections and paging', 'Truy vấn: JPQL, @Query, projection và phân trang', '@Query JPQL và native · Projection bằng record · Pageable · Specification cho bộ lọc động'],
    ['transaction', 'Transactions with @Transactional', 'Giao dịch với @Transactional', 'Phạm vi ở service · Rollback với RuntimeException vs checked · readOnly · Xem BEGIN/COMMIT thật trong log PostgreSQL'],
    ['lab-6', 'Chapter 6 lab + interview questions', 'Lab chương 6 + câu hỏi phỏng vấn', 'Tầng dữ liệu LabFlow bằng JPA · Rubric · Câu phỏng vấn JPA'],
  ]],
  ['Chapter 7 — JPA in depth: performance and concurrency', 'Chương 7 — JPA chuyên sâu: hiệu năng và đồng thời', 'N+1, lazy/eager, propagation, isolation, khoá lạc quan và bi quan.', [
    ['n-cong-1', 'The N+1 problem: detect and fix', 'Vấn đề N+1: phát hiện và sửa', 'Đếm câu SQL thật · JOIN FETCH · @EntityGraph · batch size · DTO projection'],
    ['lazy-eager', 'Lazy vs eager, LazyInitializationException and open-in-view', 'Lazy vs eager, LazyInitializationException và open-in-view', 'EAGER kéo cả bảng · LazyInitializationException ngoài giao dịch · spring.jpa.open-in-view và vì sao tắt'],
    ['propagation', 'Transaction propagation', 'Lan truyền giao dịch (propagation)', 'REQUIRED, REQUIRES_NEW, NESTED · Ghi nhật ký kiểm toán không bị rollback · Bẫy UnexpectedRollbackException'],
    ['isolation', 'Isolation levels in PostgreSQL', 'Mức cô lập trong PostgreSQL', 'Dirty/non-repeatable/phantom read · READ COMMITTED vs REPEATABLE READ vs SERIALIZABLE tái hiện thật · Lỗi serialization và thử lại'],
    ['khoa-lac-quan', 'Optimistic and pessimistic locking', 'Khoá lạc quan và bi quan', '@Version và OptimisticLockException → 409 · SELECT … FOR UPDATE · Hai người đặt cùng khung giờ · Ràng buộc exclusion của PostgreSQL'],
    ['lab-7', 'Chapter 7 lab + interview questions', 'Lab chương 7 + câu hỏi phỏng vấn', 'Chống đặt trùng lịch dưới tải đồng thời · Rubric · Câu phỏng vấn giao dịch'],
  ]],
  ['Chapter 8 — Migrations with Flyway', 'Chương 8 — Migration với Flyway', 'Quản lý thay đổi schema có lịch sử, không dựa vào Hibernate ddl-auto.', [
    ['vi-sao-flyway', 'Why not rely on Hibernate ddl-auto', 'Vì sao không dựa vào Hibernate ddl-auto', 'ddl-auto=update nguy hiểm ở production · Lịch sử migration review được · validate thay update'],
    ['viet-migration', 'Writing versioned migration scripts', 'Viết migration script có đánh số phiên bản', 'V1__create_table.sql · flyway_schema_history · Checksum: không sửa migration đã chạy'],
    ['seed-data', 'Seeding reference data', 'Nạp dữ liệu tham chiếu ban đầu', 'Migration cho dữ liệu tĩnh · Idempotent · Repeatable migration R__'],
    ['flyway-ci', 'Flyway in CI and zero-downtime changes', 'Flyway trong CI và đổi schema không downtime', 'flyway info/validate · Migration lỗi giữa chừng · Expand/contract khi đổi tên cột'],
    ['lab-8', 'Chapter 8 lab + interview questions', 'Lab chương 8 + câu hỏi phỏng vấn', 'Chuyển LabFlow sang Flyway từ V1 · Rubric · Câu phỏng vấn'],
  ]],
  ['Chapter 9 — Spring Security + JWT', 'Chương 9 — Spring Security + JWT', 'Xác thực và phân quyền theo chuẩn Spring Security 7.', [
    ['security-filter-chain', 'The Spring Security filter chain', 'Chuỗi filter của Spring Security', 'SecurityFilterChain (WebSecurityConfigurerAdapter đã bị gỡ) · In thứ tự filter thật · Route công khai vs cần xác thực'],
    ['password-encoder', 'Password hashing with PasswordEncoder', 'Băm mật khẩu với PasswordEncoder', 'BCrypt, cost và thời gian đo thật · DelegatingPasswordEncoder · Không bao giờ lưu mật khẩu thô'],
    ['dang-nhap-jwt', 'Login and issuing JWTs', 'Đăng nhập và phát JWT', 'Cấu trúc JWT · Ký HS256/RS256 · OAuth2 Resource Server của Spring · Hạn token'],
    ['jwt-filter', 'Verifying JWTs on every request', 'Kiểm JWT trên mọi request', 'BearerTokenAuthenticationFilter · SecurityContext · 401 vs 403 · Token hết hạn/sai chữ ký'],
    ['refresh-token', 'Refresh tokens and logout', 'Refresh token và đăng xuất', 'Xoay vòng refresh token · Thu hồi · Lưu ở cookie httpOnly hay bộ nhớ'],
    ['phan-quyen-role', 'Roles and method-level authorization', 'Vai trò và phân quyền cấp phương thức', '@PreAuthorize với SpEL · hasRole vs hasAuthority · Chỉ chủ lượt đặt mới huỷ được'],
    ['lab-9', 'Chapter 9 lab + interview questions', 'Lab chương 9 + câu hỏi phỏng vấn', 'Đăng ký/đăng nhập/phân quyền LabFlow · Rubric · Câu phỏng vấn bảo mật'],
  ]],
  ['Chapter 10 — The hacker\'s view: securing a Spring API', 'Chương 10 — Góc nhìn hacker: bảo vệ API Spring', 'Tấn công thật vào LabFlow rồi vá: OWASP API Top 10 trên Spring Boot.', [
    ['mass-assignment', 'Mass assignment', 'Mass assignment', 'Gửi "role":"ADMIN" khi đăng ký · Vụ GitHub 2012 · DTO + allow-list'],
    ['idor', 'IDOR and broken object-level authorization', 'IDOR và phân quyền cấp đối tượng', 'Đổi id xem lượt đặt người khác · Kiểm quyền sở hữu ở service · Test tự động chặn'],
    ['injection-jpql', 'Injection in JPQL and native queries', 'Injection trong JPQL và native query', 'Nối chuỗi JPQL vẫn dính · ORDER BY động · Tham số có tên và allow-list cột'],
    ['cors-csrf', 'CORS and CSRF for a JWT API', 'CORS và CSRF cho API dùng JWT', 'Preflight thật · allowedOrigins cụ thể · Khi nào cần CSRF (cookie) và khi nào không'],
    ['rate-limit-secret', 'Rate limiting, secrets and Actuator exposure', 'Giới hạn tần suất, bí mật và lộ Actuator', 'Dò mật khẩu bị chặn · Bucket4j · heapdump lộ bí mật · Quét bí mật trong Git'],
    ['lab-10', 'Chapter 10 lab + interview questions', 'Lab chương 10 + câu hỏi phỏng vấn', 'Pentest LabFlow theo danh sách + vá · Rubric · Câu phỏng vấn'],
  ]],
  ['Chapter 11 — Testing', 'Chương 11 — Kiểm thử', 'JUnit 5, Mockito, @WebMvcTest, @DataJpaTest và PostgreSQL thật với Testcontainers.', [
    ['junit5', 'JUnit 5 and AssertJ', 'JUnit 5 và AssertJ', '@Test, @BeforeEach, @Nested · @ParameterizedTest · AssertJ · Đặt tên test'],
    ['mockito', 'Mockito: unit-testing services', 'Mockito: test đơn vị cho service', '@Mock, @InjectMocks · when/thenReturn, verify · Khi nào KHÔNG nên mock'],
    ['mockmvc', 'Testing controllers with @WebMvcTest', 'Test controller bằng @WebMvcTest', 'MockMvc / MockMvcTester · @MockitoBean · Kiểm JSON và ProblemDetail'],
    ['testcontainers', 'Integration tests with Testcontainers', 'Test tích hợp với Testcontainers', 'PostgreSQL thật trong test · @ServiceConnection · @DataJpaTest vs @SpringBootTest · Dữ liệu cô lập'],
    ['test-security', 'Testing secured endpoints', 'Test endpoint có bảo mật', '@WithMockUser · JWT thật đầu-cuối · 401 vs 403 · Test IDOR'],
    ['lab-11', 'Chapter 11 lab + interview questions', 'Lab chương 11 + câu hỏi phỏng vấn', 'Bộ test LabFlow ≥ 80% luồng chính · Rubric · Câu phỏng vấn'],
  ]],
  ['Chapter 12 — An API frontends love: OpenAPI and React', 'Chương 12 — API mà frontend thích: OpenAPI và React', 'Tài liệu OpenAPI tự sinh, thiết kế API cho frontend, CORS và một trang React thật.', [
    ['openapi-spring', 'OpenAPI docs with springdoc', 'Tài liệu OpenAPI với springdoc', 'Swagger UI tự sinh · Mô tả lỗi và bảo mật · Sinh client TypeScript'],
    ['thiet-ke-api-fe', 'Designing APIs frontend developers enjoy', 'Thiết kế API mà frontend dùng thấy dễ chịu', 'Tên trường nhất quán · Phân trang/lọc/sắp xếp một chuẩn · Tránh gọi nhiều lần'],
    ['cors-spring', 'CORS configured correctly', 'Cấu hình CORS đúng cách', 'CorsConfigurationSource · Không "*" khi có credentials · Preflight'],
    ['gan-vao-react', 'Wiring a real React page to the API', 'Gắn một trang React thật vào API', 'Gọi API có JWT · Xử lý 401/403 · Đăng nhập → gọi API → hiển thị'],
    ['lab-12', 'Chapter 12 lab + interview questions', 'Lab chương 12 + câu hỏi phỏng vấn', 'Trang đặt lịch React dùng API LabFlow · Rubric · Câu phỏng vấn'],
  ]],
  ['Chapter 13 — Caching with Redis', 'Chương 13 — Cache với Redis', 'Spring Cache, Redis, vô hiệu hoá cache và giới hạn tần suất.', [
    ['cache-abstraction', 'Spring Cache abstraction', 'Lớp trừu tượng Spring Cache', '@Cacheable, @CacheEvict, @CachePut · Bẫy tự gọi qua proxy · Đo thời gian trước/sau'],
    ['redis-cache', 'Redis as the cache: TTL and serialization', 'Redis làm cache: TTL và tuần tự hoá', 'RedisCacheManager · TTL theo cache · JSON vs JDK serialization · Nhiều instance dùng chung'],
    ['cache-invalidation', 'Invalidation, stampede and consistency', 'Vô hiệu hoá cache, bùng tải và nhất quán', 'Cache-aside · Dữ liệu cũ khi cập nhật · Stampede và khoá · Khi nào không nên cache'],
    ['lab-13', 'Chapter 13 lab + interview questions', 'Lab chương 13 + câu hỏi phỏng vấn', 'Cache danh sách lab + giới hạn đặt lịch bằng Redis · Rubric · Câu phỏng vấn'],
  ]],
  ['Chapter 14 — Background work: async, scheduling, events and queues', 'Chương 14 — Việc nền: async, hẹn giờ, sự kiện và hàng đợi', '@Async, @Scheduled, sự kiện ứng dụng, outbox và RabbitMQ.', [
    ['async', '@Async and executors', '@Async và executor', 'Chạy nền gửi email · Cấu hình pool · Lỗi trong @Async đi đâu · Virtual thread'],
    ['scheduled', '@Scheduled jobs', 'Tác vụ hẹn giờ @Scheduled', 'cron, fixedRate, fixedDelay · Tự huỷ lượt đặt quá hạn · Chạy nhiều instance: ShedLock'],
    ['application-event', 'Application events and @TransactionalEventListener', 'Sự kiện ứng dụng và @TransactionalEventListener', 'Tách module bằng sự kiện · AFTER_COMMIT · Sự kiện mất khi rollback'],
    ['outbox', 'The transactional outbox', 'Mẫu transactional outbox', 'Ghi DB + gửi tin không nhất quán · Bảng outbox · Đọc và đẩy đi'],
    ['rabbitmq', 'Message queues with RabbitMQ', 'Hàng đợi tin nhắn với RabbitMQ', 'Producer/consumer · ack, retry, dead-letter · Idempotent consumer · So với BullMQ của Node'],
    ['lab-14', 'Chapter 14 lab + interview questions', 'Lab chương 14 + câu hỏi phỏng vấn', 'Thông báo duyệt lượt đặt qua hàng đợi · Rubric · Câu phỏng vấn'],
  ]],
  ['Chapter 15 — Observability: Actuator, metrics and logs', 'Chương 15 — Quan sát hệ thống: Actuator, số đo và log', 'Thấy được ứng dụng đang chạy: health, Micrometer/Prometheus, log có cấu trúc và tracing.', [
    ['actuator', 'Spring Boot Actuator, safely', 'Spring Boot Actuator, an toàn', 'health, readiness/liveness · Chỉ mở endpoint cần thiết · Bảo vệ bằng Security'],
    ['micrometer-prometheus', 'Metrics with Micrometer and Prometheus', 'Số đo với Micrometer và Prometheus', 'http.server.requests · Số đo nghiệp vụ tự định nghĩa · Grafana đọc p95'],
    ['logging-traceid', 'Structured logs and tracing', 'Log có cấu trúc và tracing', 'Log JSON có sẵn của Boot · MDC mã request · traceId với Micrometer Tracing'],
    ['lab-15', 'Chapter 15 lab + interview questions', 'Lab chương 15 + câu hỏi phỏng vấn', 'Bảng điều khiển LabFlow · Rubric · Câu phỏng vấn'],
  ]],
  ['Chapter 16 — Performance and load testing', 'Chương 16 — Hiệu năng và đo tải', 'Đo trước khi tối ưu: pool kết nối, virtual thread, đo tải, profiling, so với Node.js.', [
    ['hikari-pool', 'Connection pool sizing with HikariCP', 'Kích thước pool kết nối với HikariCP', 'Pool cạn đo thật · Công thức kích thước · Timeout và số đo của pool'],
    ['virtual-threads-tomcat', 'Virtual threads in a Spring Boot server', 'Virtual thread trong server Spring Boot', 'Bật virtual thread · Đo thông lượng khi chờ I/O · Khi nào không giúp'],
    ['do-tai', 'Load testing and profiling', 'Đo tải và profiling', 'k6/wrk · p50/p95/p99 · JFR + flame graph · Tìm điểm nghẽn thật'],
    ['spring-vs-node', 'Spring Boot vs Node.js under load', 'Spring Boot vs Node.js dưới tải', 'Cùng endpoint LabFlow, cùng máy · Việc I/O vs việc CPU · Khởi động, bộ nhớ, GraalVM native'],
    ['lab-16', 'Chapter 16 lab + interview questions', 'Lab chương 16 + câu hỏi phỏng vấn', 'Tối ưu endpoint chậm nhất có số đo trước/sau · Rubric · Câu phỏng vấn'],
  ]],
  ['Chapter 17 — Docker and CI', 'Chương 17 — Docker và CI', 'Đóng gói và tự động kiểm tra một dự án Spring Boot.', [
    ['dockerfile-spring', 'A Dockerfile for a Spring Boot app', 'Dockerfile cho ứng dụng Spring Boot', 'Multi-stage build · Layered jar · JRE base image, user không phải root · Buildpacks'],
    ['application-properties-docker', 'Configuration for containers', 'Cấu hình cho môi trường container', 'Biến môi trường ghi đè · Kết nối PostgreSQL qua tên service · Healthcheck bằng Actuator · Bộ nhớ JVM trong container'],
    ['github-actions-spring', 'CI with GitHub Actions', 'CI với GitHub Actions', 'Cache Maven · Test với Testcontainers trong CI · Build và đẩy image · Dependabot'],
    ['checkpoint-9', 'Checkpoint: the whole stack with one command', 'Checkpoint: cả hệ thống chạy bằng một lệnh', 'docker compose up dựng Spring Boot + PostgreSQL + Redis từ số 0 · health UP'],
    ['lab-17', 'Chapter 17 lab + interview questions', 'Lab chương 17 + câu hỏi phỏng vấn', 'Pipeline CI xanh cho LabFlow · Rubric · Câu phỏng vấn'],
  ]],
  ['Chapter 18 — Capstone: the LabFlow booking API', 'Chương 18 — Dự án cuối khoá: API đặt lịch phòng lab LabFlow', 'Ráp toàn bộ: đặc tả như việc thật, rubric, bài thi thực hành có giờ.', [
    ['thiet-ke-capstone', 'Specification and domain design', 'Đặc tả và thiết kế domain', 'User story, ràng buộc · Schema và migration đầu tiên · Hợp đồng OpenAPI trước khi viết mã'],
    ['xay-api', 'Building the API: CRUD, rules, auth', 'Xây API: CRUD, quy tắc, xác thực', 'Đặt lịch chống trùng · Duyệt lượt đặt theo vai trò · Lỗi chuẩn'],
    ['test-va-docker', 'Tests, Docker and CI', 'Test, Docker và CI', 'Test tích hợp luồng chính · Image + compose · Pipeline xanh'],
    ['tong-ket', 'Frontend, final checklist and Node.js comparison', 'Gắn frontend, checklist cuối khoá và so sánh Node.js', 'Trang React thật · Checklist năng lực · Khi nào chọn Spring Boot, khi nào chọn Node'],
    ['thi-thuc-hanh', 'Timed practical exam', 'Bài thi thực hành có giờ', 'Đề kiểu PE 3 giờ · Rubric chấm · Bài chữa'],
  ]],
];

const sections = khung('sb', CHUONG);
sections[0] = s00;
sections[1] = s01;

export default {
  category: { slug: 'backend', name: 'Backend', icon: 'Server', sortOrder: 1 },
  course: {
    slug: 'spring-boot',
    title: 'Spring Boot',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/spring-boot.png?v=1',
    shortDescription: 'Production APIs with Spring Boot 4 + Java 21: modern Java, Spring internals, REST, JPA + PostgreSQL without N+1, Flyway, Security + JWT, Testcontainers, Redis, observability, Docker + CI.|||API production với Spring Boot 4 + Java 21: Java hiện đại, Spring từ bên trong, REST, JPA + PostgreSQL không N+1, Flyway, Security + JWT, Testcontainers, Redis, quan sát hệ thống, Docker + CI.',
    description: 'Khoá Spring Boot từ số 0 tới production cho người đã biết lập trình hướng đối tượng. 19 mục: ⭐ Java hiện đại cho backend (record, sealed, pattern matching, Stream, Optional, collections, đồng thời, virtual thread, JVM và GC), lõi Spring nhìn từ bên trong (IoC, DI, vòng đời bean, proxy, auto-configuration), REST controller, validation và lỗi chuẩn RFC 9457, Spring Data JPA + PostgreSQL (persistence context, N+1, lazy/eager, propagation, isolation, khoá lạc quan), Flyway, Spring Security + JWT, góc nhìn hacker (mass assignment, IDOR, injection), kiểm thử (JUnit 5, Mockito, @WebMvcTest, Testcontainers), OpenAPI + React, Redis, việc nền và hàng đợi, Actuator/Micrometer, đo tải, Docker + CI, và dự án cuối khoá LabFlow (API đặt lịch phòng lab, cùng đề với khoá Node.js). Mọi ví dụ chạy thật trên Spring Boot 4.1.2 + Java 21, có lab chạy thật, câu hỏi phỏng vấn cuối mỗi chương và so sánh với Node.js/Express ở chỗ người phỏng vấn hay hỏi.',
    whatYouLearn: 'Viết Java 21 hiện đại và trả lời được câu hỏi phỏng vấn về collections, đồng thời, JVM/GC; hiểu container Spring tới tận bên trong (bean, vòng đời, proxy, auto-configuration); thiết kế REST API có validation và lỗi chuẩn ProblemDetail; làm chủ Spring Data JPA với PostgreSQL — không N+1, đúng giao dịch, chống đặt trùng bằng khoá; quản lý schema bằng Flyway; dựng xác thực JWT và phân quyền với Spring Security; tự tấn công và vá các lỗ hổng API phổ biến; viết test thật với Testcontainers; cache Redis, việc nền, hàng đợi; quan sát và đo tải ứng dụng; đóng gói Docker và CI; hoàn thành dự án LabFlow để đưa vào CV.',
    requirements: 'Biết lập trình hướng đối tượng cơ bản (class, kế thừa, interface) ở bất kỳ ngôn ngữ nào — học xong PRO192 là đủ; Chương 1–2 dựng lại Java hiện đại từ đó. Biết SQL cơ bản. Máy chạy được Docker (cho PostgreSQL) và biết Git cơ bản. Không cần PRJ301 hay khoá Node.js — nếu đã học thì phần REST/auth/test ở đây sẽ quen và có so sánh trực tiếp.',
    documentsNote: 'Tài liệu chính: docs.spring.io/spring-boot/reference • docs.spring.io/spring-framework/reference • docs.spring.io/spring-security/reference • docs.spring.io/spring-data/jpa/reference • documentation.red-gate.com/flyway • java.testcontainers.org • docs.oracle.com/en/java/javase/21.',
  },
  sections,
};
