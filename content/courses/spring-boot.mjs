/**
 * Spring Boot — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 25/09/2026 (công khai ngay theo cách làm của 11 khoá
 * khung trước — status PUBLISHED, bài chưa soạn hiện "Đang soạn"), chi tiết soạn sau. Nằm trong lộ trình ở
 * ~/Documents/LO-TRINH-HOC.md. Backend Java bên cạnh Node.js/FastAPI đã có. Xem _chung/khung.mjs.
 */
import { khung } from './_chung/khung.mjs';

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
    shortDescription: 'Build production APIs with Spring Boot 3 and Java 21: REST controllers, validation, Spring Data JPA + PostgreSQL, Flyway, Spring Security + JWT, JUnit 5 with Testcontainers, Docker + CI, wired to a React frontend.|||Xây API production với Spring Boot 3 và Java 21: REST controller, validation, Spring Data JPA + PostgreSQL, Flyway, Spring Security + JWT, JUnit 5 với Testcontainers, Docker + CI, nối với frontend React.',
    description: 'Khoá Spring Boot cho người đã biết lập trình hướng đối tượng nhưng chưa quen hệ sinh thái Java/Spring hiện đại. Đi từ Java 17/21 ôn nhanh (record, var, pattern matching, Stream API), lõi Spring (IoC container, dependency injection, bean), REST controller và DTO, validation với Jakarta Bean Validation, Spring Data JPA + PostgreSQL, quản lý migration bằng Flyway, xác thực với Spring Security + JWT, test với JUnit 5, MockMvc và Testcontainers (PostgreSQL thật trong test, không mock), đóng gói Docker và CI, tới kết nối với một frontend React thật (CORS, thiết kế API để frontend dùng thuận tiện). Là lựa chọn thứ hai cho backend bên cạnh khoá Node.js — nhiều công ty enterprise ở Việt Nam vẫn dùng Java/Spring làm nền chính.',
    whatYouLearn: 'Viết Java hiện đại (17/21) gọn và an toàn kiểu hơn Java cũ; hiểu Spring IoC container và dependency injection hoạt động ra sao; thiết kế REST controller có validation và xử lý lỗi nhất quán; làm việc với PostgreSQL qua Spring Data JPA (repository, quan hệ, transaction); quản lý migration bằng Flyway thay vì tự chạy SQL tay; dựng xác thực JWT với Spring Security; viết test thật (không chỉ mock) bằng Testcontainers; đóng gói Docker và chạy CI cho một dự án Spring Boot; và nối API với một frontend React theo đúng chuẩn CORS/thiết kế API hiện đại.',
    requirements: 'Biết lập trình hướng đối tượng cơ bản (class, kế thừa, interface) ở bất kỳ ngôn ngữ nào — Chương 1 ôn lại Java hiện đại từ đó, không dạy Java từ số 0 tuyệt đối. Biết SQL cơ bản. Nên có PostgreSQL chạy được qua Docker (khoá Docker của CuongThai bao phần đó) và biết Git cơ bản. Nếu đã học khoá Node.js, phần lớn khái niệm REST/auth/testing ở đây tương đương — khoá này dạy lại đúng cách làm của thế giới Java.',
    documentsNote: 'Tài liệu chính: spring.io/projects/spring-boot • docs.spring.io/spring-framework/reference • docs.spring.io/spring-security/reference • docs.spring.io/spring-data/jpa/reference • flywaydb.org/documentation • testcontainers.com • docs.oracle.com/en/java (JDK 21).',
  },
  sections: khung('sb', [
    ['Section 0 — Why Spring Boot', 'Mục 0 — Vì sao Spring Boot', 'Spring Boot khác Spring "trần" ở đâu, và vì sao doanh nghiệp lớn vẫn chọn Java.', [
      ['bat-dau-tai-day', 'Start here (1/2) — What Spring Boot is, its history, and why enterprise Vietnam still runs on it', 'Bắt đầu tại đây (1/2) — Spring Boot là gì, lịch sử ra đời, và vì sao doanh nghiệp Việt Nam vẫn chạy trên nó', 'Spring Framework 2003 → Spring Boot 2014: "convention over configuration" · Auto-configuration giải quyết vấn đề XML config địa ngục của Spring cũ · Hệ sinh thái Spring (Data, Security, Cloud) và vì sao ngân hàng/doanh nghiệp lớn chọn nó · Câu hỏi phỏng vấn hay gặp'],
      ['bat-dau-khi-khong-co', 'Start here (2/2) — Boilerplate without Spring, and how to study this course', 'Bắt đầu tại đây (2/2) — Không có Spring thì phải viết bao nhiêu code thừa, và cách học khoá này', 'Servlet thuần và JDBC tay: một endpoint tốn cả trăm dòng · Spring Boot giải quyết bằng auto-configuration + starter · Lộ trình: Java hiện đại → core Spring → REST → dữ liệu → auth → test → deploy'],
      ['cai-dat', 'Installing the JDK and creating a project with Spring Initializr', 'Cài JDK và tạo dự án bằng Spring Initializr', 'JDK 21 LTS · start.spring.io chọn dependency · Maven vs Gradle, dùng cái nào trong khoá này'],
      ['cau-truc-du-an', 'Anatomy of a Spring Boot project', 'Giải phẫu một dự án Spring Boot', '@SpringBootApplication và main method · application.yml/properties · Cấu trúc package theo layer (controller/service/repository)'],
    ]],
    ['Chapter 1 — Modern Java refresher', 'Chương 1 — Ôn nhanh Java hiện đại', 'Java 17/21 khác Java "kiểu cũ" ở những gì bạn sẽ dùng suốt khoá.', [
      ['record-var', 'Records and var', 'Record và var', 'record thay class DTO boilerplate · var suy luận kiểu cục bộ · Khi nào record phù hợp, khi nào cần class thường'],
      ['pattern-matching', 'Pattern matching and switch expressions', 'Pattern matching và switch expression', 'switch dạng biểu thức (Java 14+) · Pattern matching cho instanceof · sealed interface/class cho kiểu đóng'],
      ['stream-api', 'The Stream API', 'Stream API', 'map/filter/reduce trên collection · Optional để tránh null · Collectors thường dùng (toList, groupingBy)'],
      ['exception-java', 'Exceptions: checked vs unchecked', 'Exception: checked vs unchecked', 'Checked exception buộc khai báo throws · Unchecked (RuntimeException) phổ biến hơn trong Spring · try-with-resources cho tài nguyên tự đóng'],
    ]],
    ['Chapter 2 — Spring core', 'Chương 2 — Lõi Spring', 'IoC container, dependency injection, và bean.', [
      ['ioc-container', 'The IoC container and beans', 'IoC container và bean', 'Inversion of Control là gì · Bean là gì, ai tạo và quản lý vòng đời nó · ApplicationContext'],
      ['dependency-injection', 'Dependency injection: constructor vs field', 'Dependency injection: qua constructor hay qua field', '@Autowired trên constructor (khuyến nghị) vs trên field · Vì sao constructor injection dễ test hơn · final field cho dependency bất biến'],
      ['stereotype', 'Stereotype annotations: @Component, @Service, @Repository', 'Annotation phân loại: @Component, @Service, @Repository', 'Khác biệt về ngữ nghĩa, không khác biệt kỹ thuật · Auto-scan component theo package · @Configuration và @Bean khi cần cấu hình thủ công'],
      ['profile-config', 'Profiles and externalized configuration', 'Profile và cấu hình tách rời môi trường', 'application-dev.yml vs application-prod.yml · @Profile("dev") · @ConfigurationProperties cho cấu hình có kiểu'],
    ]],
    ['Chapter 3 — REST controllers', 'Chương 3 — REST controller', 'Endpoint HTTP, DTO, và request mapping.', [
      ['restcontroller', '@RestController and request mapping', '@RestController và request mapping', '@GetMapping/@PostMapping/@PutMapping/@DeleteMapping · @PathVariable và @RequestParam · ResponseEntity để kiểm soát status code'],
      ['dto', 'DTOs: why not expose entities directly', 'DTO: vì sao không trả thẳng entity', 'Entity mang chi tiết DB không nên lộ ra API · Record làm DTO gọn gàng · Mapping entity ↔ DTO (tay hoặc MapStruct)'],
      ['requestbody', '@RequestBody and content negotiation', '@RequestBody và content negotiation', 'Jackson tự serialize/deserialize JSON · Content-Type và Accept header · Tuỳ biến Jackson (naming strategy, ẩn field null)'],
      ['exception-handler-spring', 'Centralized error handling with @ControllerAdvice', 'Xử lý lỗi tập trung với @ControllerAdvice', '@ExceptionHandler cho từng loại lỗi · Định dạng lỗi JSON nhất quán toàn API · Không lộ stack trace ra production'],
    ]],
    ['Chapter 4 — Validation', 'Chương 4 — Validate dữ liệu', 'Jakarta Bean Validation cho input đúng chuẩn trước khi chạm tới logic.', [
      ['bean-validation', 'Jakarta Bean Validation annotations', 'Annotation của Jakarta Bean Validation', '@NotNull, @NotBlank, @Size, @Email · @Valid trên @RequestBody · Validate lồng nhau với @Valid trên field object'],
      ['loi-validation', 'Handling validation errors', 'Xử lý lỗi validate', 'MethodArgumentNotValidException · Gom lỗi từng field vào một response rõ ràng · Không để lỗi validate lộ chi tiết implementation'],
      ['custom-validator', 'Writing a custom validator', 'Tự viết validator tuỳ biến', '@Constraint và ConstraintValidator · Khi nào cần validator tuỳ biến thay vì annotation có sẵn · Validate logic liên trường (ví dụ: ngày kết thúc sau ngày bắt đầu)'],
      ['validation-group', 'Validation groups for create vs update', 'Nhóm validate khác nhau cho tạo mới và cập nhật', 'Interface làm group · Field bắt buộc lúc tạo nhưng optional lúc sửa · Khi nào tách hẳn DTO cho create/update thay vì dùng group'],
    ]],
    ['Chapter 5 — Spring Data JPA + PostgreSQL', 'Chương 5 — Spring Data JPA + PostgreSQL', 'Repository, entity, quan hệ, và transaction.', [
      ['entity-repository', 'Entities and repositories', 'Entity và repository', '@Entity, @Id, @GeneratedValue · JpaRepository có sẵn CRUD · Derived query method (findByEmail)'],
      ['quan-he-jpa', 'Relationships: @OneToMany, @ManyToOne, @ManyToMany', 'Quan hệ: @OneToMany, @ManyToOne, @ManyToMany', 'FetchType.LAZY mặc định nên dùng · Vấn đề N+1 query và cách phát hiện · @JoinColumn và mappedBy'],
      ['jpql-query', 'Custom queries: JPQL and @Query', 'Truy vấn tuỳ biến: JPQL và @Query', '@Query với JPQL · Native query khi JPQL không đủ · Truy vấn có phân trang bằng Pageable'],
      ['transaction', 'Transactions with @Transactional', 'Transaction với @Transactional', 'Phạm vi transaction ở tầng service, không phải controller · Rollback khi có exception · Đọc-chỉ (readOnly) cho truy vấn không ghi'],
    ]],
    ['Chapter 6 — Migrations with Flyway', 'Chương 6 — Migration với Flyway', 'Quản lý thay đổi schema có lịch sử, không dựa vào Hibernate auto-ddl.', [
      ['vi-sao-flyway', 'Why not rely on Hibernate ddl-auto', 'Vì sao không dựa vào Hibernate ddl-auto', 'ddl-auto=update tiện lúc học nhưng nguy hiểm ở production · Flyway cho lịch sử migration có thể review · Tắt ddl-auto khi đã dùng Flyway'],
      ['viet-migration', 'Writing versioned migration scripts', 'Viết migration script có đánh số phiên bản', 'V1__create_table.sql, quy ước đặt tên · Chạy tự động khi ứng dụng khởi động · Không sửa migration đã chạy trên production (giống nguyên tắc ở chính repo web này)'],
      ['seed-data', 'Seeding reference data', 'Nạp dữ liệu tham chiếu ban đầu', 'Migration cho dữ liệu tĩnh (ví dụ danh mục vai trò) · Idempotent: chạy lại không nhân đôi dữ liệu · Tách dữ liệu seed khỏi dữ liệu người dùng thật'],
      ['flyway-ci', 'Running Flyway in CI and production', 'Chạy Flyway trong CI và production', 'flyway migrate trước khi ứng dụng nhận traffic · Kiểm trạng thái migration bằng flyway info · Xử lý khi một migration thất bại giữa chừng — không tự ý sửa, báo cáo trước'],
    ]],
    ['Chapter 7 — Spring Security + JWT', 'Chương 7 — Spring Security + JWT', 'Xác thực và phân quyền theo chuẩn Spring.', [
      ['security-filter-chain', 'The Spring Security filter chain', 'Chuỗi filter của Spring Security', 'SecurityFilterChain thay cho WebSecurityConfigurerAdapter đã lỗi thời · Thứ tự filter xử lý request · Cấu hình route công khai vs cần xác thực'],
      ['jwt-filter', 'A custom JWT authentication filter', 'Filter xác thực JWT tuỳ biến', 'OncePerRequestFilter đọc và verify JWT · Đưa Authentication vào SecurityContext · Xử lý token hết hạn/không hợp lệ'],
      ['password-encoder', 'Password hashing with PasswordEncoder', 'Băm mật khẩu với PasswordEncoder', 'BCryptPasswordEncoder · Đăng ký và đăng nhập dùng chung encoder · Không bao giờ lưu mật khẩu dạng thô'],
      ['phan-quyen-role', 'Method-level authorization with roles', 'Phân quyền theo vai trò ở cấp phương thức', '@PreAuthorize với biểu thức SpEL · hasRole vs hasAuthority · Test phân quyền: user A không gọi được endpoint của admin'],
    ]],
    ['Chapter 8 — Testing', 'Chương 8 — Test', 'JUnit 5, MockMvc, và PostgreSQL thật với Testcontainers.', [
      ['junit5', 'JUnit 5 basics', 'JUnit 5 căn bản', '@Test, @BeforeEach, assertions của AssertJ · @ParameterizedTest cho nhiều trường hợp · Đặt tên test rõ nghĩa bằng @DisplayName'],
      ['mockmvc', 'Testing controllers with MockMvc', 'Test controller bằng MockMvc', '@WebMvcTest cho test tầng controller cô lập · Gửi request giả, kiểm status/body · @MockBean cho service phụ thuộc'],
      ['testcontainers', 'Integration tests with Testcontainers', 'Test tích hợp với Testcontainers', 'PostgreSQL thật trong container cho test, không mock · @SpringBootTest với @Testcontainers · Dữ liệu test cô lập giữa các lượt chạy'],
      ['test-security', 'Testing secured endpoints', 'Test endpoint có bảo mật', '@WithMockUser cho test nhanh không cần JWT thật · Test luồng đăng nhập thật đầu-cuối · Test 401 vs 403 đúng tình huống'],
    ]],
    ['Chapter 9 — Docker and CI', 'Chương 9 — Docker và CI', 'Đóng gói và tự động kiểm tra một dự án Spring Boot.', [
      ['dockerfile-spring', 'A Dockerfile for a Spring Boot app', 'Dockerfile cho ứng dụng Spring Boot', 'Multi-stage build: Maven/Gradle build rồi copy jar sang image nhẹ · Layered jar để cache Docker hiệu quả hơn · Base image JRE, không cần JDK lúc chạy'],
      ['application-properties-docker', 'Externalized config for containers', 'Cấu hình tách biệt cho môi trường container', 'Biến môi trường ghi đè application.yml · Kết nối tới PostgreSQL container qua tên service · Healthcheck bằng Spring Boot Actuator'],
      ['github-actions-spring', 'CI with GitHub Actions: build, test, package', 'CI với GitHub Actions: build, test, đóng gói', 'Cache dependency Maven/Gradle cho nhanh · Chạy test với service container PostgreSQL · Build và đẩy image lên registry'],
      ['checkpoint-9', 'Checkpoint: the whole stack runs with one command', 'Checkpoint: cả hệ thống chạy bằng một lệnh', 'docker compose up dựng Spring Boot + PostgreSQL từ số 0 · Actuator health endpoint trả UP'],
    ]],
    ['Chapter 10 — Connecting to a React frontend', 'Chương 10 — Kết nối với frontend React', 'CORS, thiết kế API, và một API Spring Boot mà frontend dùng thoải mái.', [
      ['cors-spring', 'Configuring CORS correctly', 'Cấu hình CORS đúng cách', 'CorsConfigurationSource thay vì @CrossOrigin rải rác · allowedOrigins cụ thể, không dùng "*" khi có credentials · Preflight OPTIONS cho request có header tuỳ biến'],
      ['thiet-ke-api-fe', 'Designing APIs frontend developers actually enjoy', 'Thiết kế API mà frontend dùng thấy dễ chịu', 'Đặt tên field nhất quán (camelCase cho JSON) · Phân trang, lọc, sắp xếp theo một chuẩn xuyên suốt · Trả đủ dữ liệu để frontend không phải gọi thêm nhiều lần'],
      ['openapi-spring', 'Generating OpenAPI docs with springdoc', 'Sinh tài liệu OpenAPI với springdoc', 'springdoc-openapi tự sinh Swagger UI từ annotation · Tài liệu API giúp frontend làm việc độc lập · Đồng bộ DTO và tài liệu tự động, không viết tay lệch nhau'],
      ['gan-vao-react', 'Wiring a real React page to the API', 'Gắn một trang React thật vào API', 'Gọi API từ React (trỏ lại khoá React trên trang này) · Xử lý lỗi 401/403 nhất quán ở frontend · Kiểm luồng đăng nhập → gọi API bảo vệ → hiển thị dữ liệu, đầu tới cuối'],
    ]],
    ['Chapter 11 — Capstone: a Spring Boot API for a React app', 'Chương 11 — Dự án cuối khoá: API Spring Boot cho một ứng dụng React', 'Ráp toàn bộ: entity, auth, test, Docker, và frontend thật.', [
      ['thiet-ke-capstone', 'Designing the domain: entities and relations', 'Thiết kế domain: entity và quan hệ', 'Chọn một bài toán nhỏ có ít nhất hai entity quan hệ với nhau · Vẽ schema trước khi viết migration Flyway đầu tiên'],
      ['xay-api', 'Building the API: CRUD, validation, auth', 'Xây API: CRUD, validate, xác thực', 'REST controller đầy đủ cho domain đã chọn · Validate input và xử lý lỗi nhất quán · Bảo vệ endpoint bằng Spring Security + JWT'],
      ['test-va-docker', 'Testing it and containerizing it', 'Test và đóng gói Docker', 'Test tích hợp với Testcontainers cho luồng chính · Dockerfile và docker-compose chạy được từ số 0'],
      ['tong-ket', 'Wiring the frontend and the final checklist', 'Gắn frontend và checklist cuối khoá', 'Một trang React gọi API thật, có đăng nhập · Checklist năng lực cả khoá · So sánh nhanh với khoá Node.js: khi nào chọn Spring Boot, khi nào chọn Node'],
    ]],
  ]),
};
