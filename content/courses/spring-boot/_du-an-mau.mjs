/**
 * Spring Boot — khung mẫu CHẠY THẬT cho từng mốc dự án (22/11/2026).
 * Đề tài mẫu "Kho thiết bị CLB" (gearloan): CLB cho thành viên mượn máy ảnh, micro, flycam.
 * Cố ý KHÔNG nằm trong danh sách đề tài gợi ý của _du-an.mjs ⇒ là bộ khung khởi đầu, không phải lời giải.
 *
 * Mọi mã dưới đây trích nguyên văn từ dự án đã chạy (scratchpad agent, máy Mac của người dùng):
 *   Spring Boot 4.1.2 · Spring Security 7.1.2 · Java 21.0.9 (Homebrew OpenJDK) · Maven 3.9.11
 *   PostgreSQL 16 (postgres:16-alpine) · Redis 7 (redis:7-alpine) · MongoDB 7 (mongo:7) · springdoc 3.1.1
 * Output dán nguyên văn; chỉ rút gọn token JWT và bỏ bớt dòng log không liên quan (đánh dấu …).
 * Ba lỗi THẬT gặp khi dựng mẫu được giữ lại làm bài học: Redis "Cannot serialize" (mốc 14), bean CORS sai tên
 * (mốc 13), unique index ném 500 khi hai người mượn cùng lúc (mốc 8); thêm: @EnableCaching ở lớp main làm vỡ
 * @DataJpaTest, lớp *IT không được Surefire chạy (mốc 12), spring.data.mongodb.uri bị Boot 4 bỏ qua (mốc 21).
 *
 * ⚠️ Trong template literal: `${` phải viết \${ (Thymeleaf, @Value, YAML); không gạch chéo ngược nào khác.
 */
import { java, bash, yml, sql, xml, out, js } from './_chung.mjs';

const p = (en, vi) => ({ en: '<p>' + en + '</p>', vi: '<p>' + vi + '</p>' });
const ghep = (...khoi) => ({
  en: khoi.map((k) => (typeof k === 'string' ? k : k.en)).join('\n'),
  vi: khoi.map((k) => (typeof k === 'string' ? k : k.vi)).join('\n'),
});

/* ── Mốc 1 — Mục 0 ── */
const M1_CODE = `
@RestController
class GearController {
    private final GearService service;
    GearController(GearService service) { this.service = service; }

    @GetMapping("/api/gear")
    List<GearService.GearView> list() { return service.list(); }
}

@Service
class GearService {
    record GearView(long id, String name, String category) {}

    List<GearView> list() {            // chưa có CSDL: dữ liệu cứng, đủ để thấy controller → service chạy
        return List.of(new GearView(1, "Canon EOS 200D", "camera"), new GearView(2, "Rode VideoMic", "audio"));
    }
}
`;
const M1_OUT = `
$ curl -s https://start.spring.io/starter.zip -d type=maven-project -d dependencies=web,validation -d javaVersion=21 -d bootVersion=4.1.2 -d groupId=com.example -d artifactId=gearloan -o p.zip && unzip -q p.zip
$ find src -name "*.java" | sort
src/main/java/com/example/gearloan/gear/GearController.java
src/main/java/com/example/gearloan/gear/GearService.java
src/main/java/com/example/gearloan/GearloanApplication.java
src/test/java/com/example/gearloan/GearloanApplicationTests.java
$ ./mvnw -q spring-boot:run
… Tomcat started on port 8092 (http) with context path '/'
… Started GearloanApplication in 0.787 seconds (process running for 0.954)
$ curl -s localhost:8092/api/gear
[{"id":1,"name":"Canon EOS 200D","category":"camera"},{"id":2,"name":"Rode VideoMic","category":"audio"}]
`;

/* ── Mốc 2 — Chương 1 ── */
const M2_CODE = `
record Member(long id, String name) {}
record Gear(long id, String name, String category) {}

sealed interface LoanState permits Active, Overdue, Returned {}
record Active(LocalDate due) implements LoanState {}
record Overdue(LocalDate due, long daysLate) implements LoanState {}
record Returned(LocalDate on) implements LoanState {}

record Loan(Member member, Gear gear, LoanState state) {}

static String label(LoanState s) {
    return switch (s) {                                   // thiếu một nhánh ⇒ KHÔNG biên dịch được
        case Active a -> "due " + a.due();
        case Overdue(var due, var late) when late > 7 -> "LOCK ACCOUNT, " + late + " days late";
        case Overdue o -> o.daysLate() + " days late";
        case Returned r -> "returned " + r.on();
    };
}
`;
const M2_OUT = `
$ java Model.java
An · Canon EOS 200D → due 2026-11-29
An · Rode VideoMic → LOCK ACCOUNT, 12 days late
Binh · Zoom H1n → returned 2026-11-20
distinct gear in set: 1   (record = equals/hashCode theo giá trị)
Gear[id=1, name=Canon EOS 200D, category=camera]

# xoá dòng "case Returned r -> …" rồi chạy lại:
$ java Model.java
Model.java:16: error: the switch expression does not cover all possible input values
        return switch (s) {                                   // thiếu một nhánh ⇒ KHÔNG biên dịch được
               ^
1 error
`;

/* ── Mốc 3 — Chương 2 ── */
const M3_CODE = `
Map<String, Long> perCategory = loans.stream()
        .collect(Collectors.groupingBy(Loan::category, TreeMap::new, Collectors.counting()));
var top = loans.stream().collect(Collectors.groupingBy(Loan::member, Collectors.summingInt(Loan::days)))
        .entrySet().stream().max(Map.Entry.comparingByValue()).orElseThrow();

// 10.000 lượt "mượn" chạy đồng thời trên virtual thread: đếm thường vs đếm atomic
var safe = new AtomicInteger();
try (var pool = Executors.newVirtualThreadPerTaskExecutor()) {
    for (int i = 0; i < 10_000; i++) pool.submit(() -> { unsafeCount++; safe.incrementAndGet(); });
}
System.out.println("unsafe counter = " + unsafeCount + "   atomic counter = " + safe.get());
`;
const M3_OUT = `
$ java Stats.java
loans per category: {audio=2, camera=3, drone=1}
member with most loan-days: Binh=19
unsafe counter = 7625   atomic counter = 10000
$ java Stats.java | tail -1
unsafe counter = 8184   atomic counter = 10000
`;

/* ── Mốc 4 — Chương 3 ── */
const M4_CODE = `
/** Luật nghiệp vụ đọc từ application.yml — đổi luật không phải sửa mã. */
@Validated
@ConfigurationProperties(prefix = "gear.loan")
public record LoanRules(@Min(1) @Max(30) int maxDays, @Min(1) @Max(5) int maxActivePerMember) {}

@Service
public class LoanService {
    private final LoanRepository loans;
    private final GearRepository gears;
    private final LoanRules rules;
    // … chỉ tiêm qua constructor, không @Autowired trên field
    LoanService(LoanRepository loans, GearRepository gears, MemberRepository members, LoanRules rules,
                ApplicationEventPublisher events, Clock clock, MeterRegistry meters) { … }
}
`;
const M4_YML = `
gear:
  loan:
    max-days: 14
    max-active-per-member: 3
  jwt.secret: \${JWT_SECRET}
`;
const M4_OUT = `
$ java -jar target/gearloan.jar --gear.loan.max-days=90
APPLICATION FAILED TO START
***************************

Description:

Binding to target com.example.gearloan.config.LoanRules failed:

    Property: gear.loan.maxDays
    Value: "90"
    Origin: "gear.loan.max-days" from property source "commandLineArgs"
    Reason: must be less than or equal to 30

$ JWT_SECRET=short java -jar target/gearloan.jar
… IllegalStateException: gear.jwt.secret must be at least 32 characters
`;

/* ── Mốc 5 — Chương 4 ── */
const M5_CODE = `
@PostMapping
@PreAuthorize("hasRole('STAFF')")
ResponseEntity<GearView> create(@Valid @RequestBody CreateGear in) {
    GearView g = service.create(in);
    var uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(g.id()).toUri();
    return ResponseEntity.created(uri).body(g);
}

public record CreateGear(@NotBlank @Size(max = 80) String name, @NotBlank @Size(max = 40) String category) {}
public record GearView(long id, String name, String category, GearStatus status) {}   // KHÔNG có version, không có entity
`;
const M5_OUT = `
$ curl -s -i -X POST localhost:8090/api/gear -H "Authorization: Bearer $STAFF" -H "Content-Type: application/json" -d '{"name":"GoPro 12","category":"camera"}'
HTTP/1.1 201
Location: http://localhost:8090/api/gear/6
{"id":6,"name":"GoPro 12","category":"camera","status":"AVAILABLE"}
$ curl -s 'localhost:8090/api/gear?category=audio'
{"items":[{"id":2,"name":"Rode VideoMic","category":"audio","status":"LOANED"},{"id":4,"name":"Zoom H1n","category":"audio","status":"AVAILABLE"}]}
`;

/* ── Mốc 6 — Chương 5 ── */
const M6_CODE = `
@RestControllerAdvice(basePackages = "com.example.gearloan")
class ApiErrors {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    ProblemDetail invalid(MethodArgumentNotValidException e) {
        var pd = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Request body is invalid");
        Map<String, String> fields = e.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(f -> f.getField(), f -> f.getDefaultMessage(), (a, b) -> a));
        pd.setProperty("errors", fields);
        return pd;
    }
    @ExceptionHandler({LoanLimitException.class, IllegalArgumentException.class})
    ProblemDetail rule(RuntimeException e) { return ProblemDetail.forStatusAndDetail(HttpStatus.UNPROCESSABLE_CONTENT, e.getMessage()); }
    // + 404 NoSuchElementException, 409 GearNotAvailableException …
}
`;
const M6_OUT = `
$ curl -s -X POST localhost:8090/api/gear -H "Authorization: Bearer $STAFF" -H "Content-Type: application/json" -d '{"name":"","category":"camera"}'
{"detail":"Request body is invalid","instance":"/api/gear","status":400,"title":"Bad Request","errors":{"name":"must not be blank"}}
$ curl -s -X POST localhost:8090/api/loans -H "Authorization: Bearer $BINH" -H "Content-Type: application/json" -d '{"gearId":3,"days":60}'
{"detail":"Request body is invalid","instance":"/api/loans","status":400,"title":"Bad Request","errors":{"days":"must be less than or equal to 30"}}
$ curl -s -X POST localhost:8090/api/loans -H "Authorization: Bearer $AN" -H "Content-Type: application/json" -d '{"gearId":8,"days":2}'
{"detail":"A member may hold at most 3 active loans","instance":"/api/loans","status":422,"title":"Unprocessable Content"}
`;

/* ── Mốc 7 — Chương 6 ── */
const M7_CODE = `
@Entity
public class Loan {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Gear gear;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Member member;
    private Instant borrowedAt;
    private Instant dueAt;
    // …
}

@Transactional
public LoanView borrow(long memberId, CreateLoan in) {
    // … kiểm luật
    var gear = gears.findById(in.gearId()).orElseThrow(() -> new NoSuchElementException("gear " + in.gearId()));
    gear.markLoaned();                    // đổi bảng gear (dirty checking tự UPDATE lúc commit)
    var loan = loans.save(new Loan(gear, members.getReferenceById(memberId), now, now.plus(Duration.ofDays(in.days()))));
    return LoanView.of(loan);             // hai bảng, MỘT giao dịch
}
`;
const M7_OUT = `
$ curl -s -X POST localhost:8090/api/loans -H "Authorization: Bearer $AN" -H "Content-Type: application/json" -d '{"gearId":2,"days":7}'
{"id":1,"gearId":2,"gearName":"Rode VideoMic","memberId":1,"memberName":"An","borrowedAt":"2026-11-22T12:54:33.174375Z","dueAt":"2026-11-29T12:54:33.174375Z","status":"ACTIVE"}
$ curl -s -X POST localhost:8090/api/loans -H "Authorization: Bearer $BINH" -H "Content-Type: application/json" -d '{"gearId":2,"days":3}'
{"detail":"Gear 2 is LOANED","instance":"/api/loans","status":409,"title":"Conflict"}
`;

/* ── Mốc 8 — Chương 7 ── */
const M8_CODE = `
List<Loan> findByStatus(LoanStatus status);                       // N+1 nếu đọc gear/member

@EntityGraph(attributePaths = {"gear", "member"})
@Query("select l from Loan l where l.status = :status order by l.id")
List<Loan> findWithGearAndMember(LoanStatus status);              // một câu SQL có JOIN

/** Lưới cuối: unique index "loan_one_open_per_gear" của CSDL chặn lượt mượn thứ hai ⇒ 409, không phải 500. */
@ExceptionHandler(DataIntegrityViolationException.class)
ProblemDetail duplicate(DataIntegrityViolationException e) {
    return ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, "This gear already has an open loan");
}
`;
const M8_OUT = `
# 5 lượt mượn đang mở · GET /api/loans/active?fetchJoin=false — log org.hibernate.SQL:
select l1_0.id,l1_0.borrowed_at,l1_0.due_at,l1_0.gear_id,l1_0.member_id,l1_0.returned_at,l1_0.status from loan l1_0 where l1_0.status=?
select g1_0.id,g1_0.category,g1_0.name,g1_0.status,g1_0.version from gear g1_0 where g1_0.id=?
select m1_0.id,m1_0.email,m1_0.name,m1_0.password_hash,m1_0.role from member m1_0 where m1_0.id=?
select g1_0.id,g1_0.category,g1_0.name,g1_0.status,g1_0.version from gear g1_0 where g1_0.id=?
select m1_0.id,m1_0.email,m1_0.name,m1_0.password_hash,m1_0.role from member m1_0 where m1_0.id=?
select g1_0.id,g1_0.category,g1_0.name,g1_0.status,g1_0.version from gear g1_0 where g1_0.id=?
select m1_0.id,m1_0.email,m1_0.name,m1_0.password_hash,m1_0.role from member m1_0 where m1_0.id=?
select g1_0.id,g1_0.category,g1_0.name,g1_0.status,g1_0.version from gear g1_0 where g1_0.id=?
select g1_0.id,g1_0.category,g1_0.name,g1_0.status,g1_0.version from gear g1_0 where g1_0.id=?
# = 9 câu (1 + 5 gear + 3 member). Cùng dữ liệu, fetchJoin=true:
select l1_0.id,…,g1_0.id,…,m1_0.id,… from loan l1_0 join gear g1_0 on g1_0.id=l1_0.gear_id join member m1_0 on m1_0.id=l1_0.member_id where l1_0.status=? order by l1_0.id

# An và Bình cùng bấm "Mượn" GoPro (id 6) trong cùng một khoảnh khắc — TRƯỚC khi có handler 409:
{"id":6,"gearId":6,"gearName":"GoPro 12","memberId":1,"memberName":"An",…,"status":"ACTIVE"} [201]
{"timestamp":"2026-11-22T12:56:31.045Z","status":500,"error":"Internal Server Error","path":"/api/loans"} [500]
… DataIntegrityViolationException: could not execute statement [ERROR: duplicate key value violates unique constraint "loan_one_open_per_gear"
# SAU khi ánh xạ DataIntegrityViolationException ⇒ 409, thử lại với món mới (id 7):
created [201]
This gear already has an open loan [409]
`;

/* ── Mốc 9 — Chương 8 ── */
const M9_SQL = `
create table loan (
  id bigserial primary key,
  gear_id bigint not null references gear(id),
  member_id bigint not null references member(id),
  borrowed_at timestamptz not null,
  due_at timestamptz not null,
  returned_at timestamptz,
  status varchar(10) not null check (status in ('ACTIVE','OVERDUE','RETURNED')),
  check (due_at > borrowed_at)
);
-- một món đồ chỉ có một lượt mượn đang mở: chặn ở CSDL, không chỉ ở Java
create unique index loan_one_open_per_gear on loan(gear_id) where status <> 'RETURNED';
`;
const M9_OUT = `
# sửa V2__seed_gear.sql (đã chạy trên CSDL) rồi khởi động lại
Migration checksum mismatch for migration version 2
-> Applied to database : 1838799062
-> Resolved locally    : -564180061
Either revert the changes to the migration, or run repair to update the schema history.

# trả V2 về như cũ, viết V3__loan_note.sql (alter table loan add column note varchar(200)) rồi khởi động:
Successfully validated 3 migrations (execution time 00:00.023s)
Migrating schema "public" to version "3 - loan note"
Successfully applied 1 migration to schema "public", now at version v3 (execution time 00:00.010s)
$ docker exec gl-pg psql -U postgres -d gearloan -c "select version, description, script, success from flyway_schema_history order by installed_rank"
 version | description |      script       | success
---------+-------------+-------------------+---------
 1       | init        | V1__init.sql      | t
 2       | seed gear   | V2__seed_gear.sql | t
 3       | loan note   | V3__loan_note.sql | t
(3 rows)
`;

/* ── Mốc 10 — Chương 9 ── */
const M10_CODE = `
@Bean @Order(2)
SecurityFilterChain api(HttpSecurity http) throws Exception {
    http.securityMatcher("/api/**")
        .csrf(c -> c.disable())
        .cors(Customizer.withDefaults())
        .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(a -> a
            .requestMatchers("/api/auth/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/gear/**").permitAll()
            .anyRequest().authenticated())
        .oauth2ResourceServer(o -> o.jwt(j -> j.jwtAuthenticationConverter(jwt -> {
            var auth = List.of(new SimpleGrantedAuthority("ROLE_" + jwt.getClaimAsString("role")));
            return new JwtAuthenticationToken(jwt, auth, jwt.getSubject());
        })));
    return http.build();
}
`;
const M10_OUT = `
$ curl -s -X POST localhost:8090/api/auth/login -H "Content-Type: application/json" -d '{"email":"an@club.test","password":"an-pass-123"}' | jq -c '{expiresIn, accessToken: (.accessToken[0:24] + "…")}'
{"expiresIn":900,"accessToken":"eyJhbGciOiJIUzI1NiJ9.eyJ…"}
$ curl -s -o /dev/null -w "%{http_code}" -X POST localhost:8090/api/auth/login -H "Content-Type: application/json" -d '{"email":"an@club.test","password":"wrong"}'
401
# POST /api/gear chỉ dành cho STAFF — không token / token thành viên thường:
no token -> 401
member   -> 403
# token bị đổi ký tự cuối:
$ curl -s -o /dev/null -w "%{http_code}" localhost:8090/api/loans/1 -H "Authorization: Bearer \${AN%?}x"
401
$ docker exec gl-pg psql -U postgres -d gearloan -tc "select email, left(password_hash, 8) from member order by id"
 an@club.test   | {bcrypt}
 binh@club.test | {bcrypt}
 chi@club.test  | {bcrypt}
`;

/* ── Mốc 11 — Chương 10 ── */
const M11_CODE = `
record Register(@NotBlank @Size(max = 60) String name, @Email @NotBlank String email, @Size(min = 8, max = 72) String password) {}
// DTO không có trường role ⇒ gửi "role":"STAFF" vô tác dụng

@Transactional(readOnly = true)
public LoanView get(long id, long callerId, boolean staff) {
    var loan = loans.findById(id).orElseThrow(() -> new NoSuchElementException("loan " + id));
    if (!staff && !loan.getMember().getId().equals(callerId)) throw new NoSuchElementException("loan " + id); // chống IDOR: 404, không lộ là có tồn tại
    return LoanView.of(loan);
}
`;
const M11_OUT = `
# mass assignment: tự xin vai trò STAFF khi đăng ký
$ curl -s -X POST localhost:8090/api/auth/register -H "Content-Type: application/json" -d '{"name":"An","email":"an@club.test","password":"an-pass-123","role":"STAFF"}'
{"role":"MEMBER","id":1}
# IDOR: Bình đọc rồi trả lượt mượn số 1 của An
$ curl -s localhost:8090/api/loans/1 -H "Authorization: Bearer $BINH"
{"detail":"loan 1","instance":"/api/loans/1","status":404,"title":"Not Found"} [404]
$ curl -s -X POST localhost:8090/api/loans/1/return -H "Authorization: Bearer $BINH"
 [403]
# CORS từ một origin lạ
$ curl -s -i -X OPTIONS localhost:8090/api/loans -H "Origin: https://evil.example" -H "Access-Control-Request-Method: POST"
HTTP/1.1 403
Invalid CORS request
# Actuator: chỉ health + prometheus công khai
$ curl -s -o /dev/null -w "%{http_code}" localhost:8090/actuator/env
403
`;

/* ── Mốc 12 — Chương 11 ── */
const M12_CODE = `
@DataJpaTest(properties = "spring.flyway.enabled=true")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
class LoanRepositoryTest {
    @Container @ServiceConnection
    static PostgreSQLContainer pg = new PostgreSQLContainer("postgres:16-alpine");

    @Autowired LoanRepository loans; @Autowired GearRepository gears; @Autowired MemberRepository members;

    @Test
    void databaseRefusesASecondOpenLoanForTheSameGear() {
        var gear = gears.save(new Gear("Tripod", "camera"));
        var a = members.save(new Member("A", "a@x.test", "{noop}x"));
        var b = members.save(new Member("B", "b@x.test", "{noop}x"));
        var now = Instant.now();
        loans.saveAndFlush(new Loan(gear, a, now, now.plus(Duration.ofDays(2))));
        assertThatThrownBy(() -> loans.saveAndFlush(new Loan(gear, b, now, now.plus(Duration.ofDays(2)))))
                .isInstanceOf(DataIntegrityViolationException.class)
                .hasMessageContaining("loan_one_open_per_gear");
    }
}
`;
const M12_OUT = `
# lượt 1: lớp tên LoanRepositoryIT — Surefire KHÔNG chạy nó, mà build vẫn xanh
$ ./mvnw test
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0 -- in com.example.gearloan.loan.LoanServiceTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0 -- in com.example.gearloan.GearTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
# lượt 2: đổi tên thành LoanRepositoryTest — nó chạy, và đỏ vì @EnableCaching nằm ở lớp main
Caused by: org.springframework.beans.factory.NoSuchBeanDefinitionException: No qualifying bean of type 'org.springframework.cache.CacheManager' available …
[ERROR] Tests run: 4, Failures: 0, Errors: 1, Skipped: 0
# lượt 3: chuyển @EnableCaching/@EnableAsync/@EnableScheduling sang lớp @Configuration
… Container postgres:16-alpine started in PT1.034652S
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0 -- in com.example.gearloan.LoanRepositoryTest
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
`;

/* ── Mốc 13 — Chương 12 ── */
const M13_CODE = `
@Bean   // ⚠️ TÊN hàm phải là corsConfigurationSource — cors(Customizer.withDefaults()) tìm bean theo tên đó
CorsConfigurationSource corsConfigurationSource(@Value("\${gear.cors.origins}") List<String> origins) {
    var c = new CorsConfiguration();
    c.setAllowedOrigins(origins);                                   // danh sách cụ thể, KHÔNG "*"
    c.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE"));
    c.setAllowedHeaders(List.of("Authorization", "Content-Type"));
    c.setMaxAge(3600L);
    var src = new UrlBasedCorsConfigurationSource();
    src.registerCorsConfiguration("/api/**", c);
    return src;
}
`;
const M13_OUT = `
$ curl -s localhost:8090/v3/api-docs | jq -r ".paths | keys[]"
/api/audit/loans/{loanId}
/api/auth/login
/api/auth/register
/api/gear
/api/gear/{id}
/api/loans
/api/loans/active
/api/loans/{id}
/api/loans/{id}/return
# lượt đầu, hàm @Bean tên "cors": preflight 200 nhưng KHÔNG có header CORS nào ⇒ trình duyệt sẽ chặn
$ curl -s -i -X OPTIONS localhost:8090/api/loans -H "Origin: http://localhost:5173" -H "Access-Control-Request-Method: POST"
HTTP/1.1 200
# đổi tên hàm thành corsConfigurationSource:
HTTP/1.1 200
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET,POST,PUT,PATCH,DELETE
Access-Control-Allow-Headers: authorization, content-type
Access-Control-Max-Age: 3600
`;

/* ── Mốc 14 — Chương 13 ── */
const M14_CODE = `
@Configuration
@EnableCaching          // đặt ở đây, KHÔNG ở lớp main: test lát cắt (@DataJpaTest) không kéo cache theo
class CacheConfig {
    /** Cache "gear-list" lưu JSON có kiểu cố định (không dùng JDK serialization, không bật default typing). */
    @Bean
    RedisCacheManagerBuilderCustomizer gearListCache() {
        var json = new JacksonJsonRedisSerializer<>(GearPage.class);
        return b -> b.withCacheConfiguration("gear-list", RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofSeconds(60))
                .serializeValuesWith(SerializationPair.fromSerializer(json)));
    }
}

@Transactional(readOnly = true)
@Cacheable(cacheNames = "gear-list", key = "#category + ':' + #page")
public GearPage list(String category, int page) { … }
`;
const M14_OUT = `
# lượt đầu (chưa có CacheConfig): bộ tuần tự JDK mặc định gặp record không Serializable
… SerializationException: Cannot serialize
$ docker exec gl-redis redis-cli --scan --pattern "gear-list*"
gear-list::camera:0
$ docker exec gl-redis redis-cli ttl "gear-list::camera:0"
60
# Bình mượn máy ảnh id 1, rồi xem lại danh sách (cache) và chi tiết (không cache)
borrow -> 201
{"id":1,"name":"Canon EOS 200D","category":"camera","status":"AVAILABLE"}
{"id":1,"name":"Canon EOS 200D","category":"camera","status":"LOANED"}
# ⇒ danh sách NÓI DỐI tới 60 giây: borrow() đổi status mà không xoá "gear-list" — thêm @CacheEvict ở đó
`;

/* ── Mốc 15 — Chương 14 ── */
const M15_CODE = `
@Async
@TransactionalEventListener                                     // mặc định AFTER_COMMIT: rollback thì không ghi
void on(LoanCreated e) {
    events.save(new LoanEvent(null, "LOAN_CREATED", e.loanId(), Instant.now(),
            Map.of("gearId", e.gearId(), "memberId", e.memberId(), "dueAt", e.dueAt().toString())));
    log.info("audit saved for loan {} on thread {}", e.loanId(), Thread.currentThread().getName());
}

@Scheduled(cron = "\${gear.overdue-cron:0 */5 * * * *}")
@Transactional
public void markOverdue() {
    var late = loans.findByStatusAndDueAtBefore(Loan.LoanStatus.ACTIVE, clock.instant());
    late.forEach(Loan::markOverdue);                            // chạy lại lần hai: danh sách rỗng ⇒ idempotent
    log.info("overdue job: {} loan(s) marked OVERDUE", late.size());
}
`;
const M15_OUT = `
… LoanAuditListener : audit saved for loan 8 on thread task-1
$ java -jar target/gearloan.jar '--gear.overdue-cron=*/10 * * * * *'
# thử "lùi" hạn trả bằng SQL — ràng buộc CHECK của chính mình chặn lại:
ERROR:  new row for relation "loan" violates check constraint "loan_check"
$ docker exec gl-pg psql … -c "update loan set borrowed_at = now() - interval '9 days', due_at = now() - interval '2 days' where id = 1"
UPDATE 1
[   scheduling-4] com.example.gearloan.loan.OverdueJob     : overdue job: 1 loan(s) marked OVERDUE
[   scheduling-5] com.example.gearloan.loan.OverdueJob     : overdue job: 0 loan(s) marked OVERDUE
[   scheduling-6] com.example.gearloan.loan.OverdueJob     : overdue job: 0 loan(s) marked OVERDUE
 id | status
----+---------
  1 | OVERDUE
`;

/* ── Mốc 16 — Chương 15 ── */
const M16_YML = `
management:
  endpoints.web.exposure.include: health,prometheus
  endpoint.health.probes.enabled: true
`;
const M16_CODE = `
this.created = Counter.builder("gearloan.loans.created").description("Loans created").register(meters);
// … trong borrow(): created.increment();
`;
const M16_OUT = `
$ curl -s localhost:8090/actuator/health
{"groups":["liveness","readiness"],"status":"UP"}
# tìm theo tên đã đặt — không thấy gì:
$ curl -s localhost:8090/actuator/prometheus | grep loans_created
$ curl -s localhost:8090/actuator/prometheus | grep -iE "# HELP gearloan"
# HELP gearloan_loans_total Loans created
# sau một lượt mượn thành công:
gearloan_loans_total 1.0
http_server_requests_seconds_count{error="none",exception="none",method="POST",outcome="SUCCESS",status="201",uri="/api/loans"} 1
http_server_requests_seconds_count{error="none",exception="none",method="POST",outcome="CLIENT_ERROR",status="409",uri="/api/loans"} 1
hikaricp_connections_active{pool="HikariPool-1"} 0.0
hikaricp_connections_max{pool="HikariPool-1"} 10.0
`;

/* ── Mốc 17 — Chương 16 ── */
const M17_OUT = `
# làm nóng: ab -q -n 2000 -c 50 …, rồi đo GET /api/gear/1 (đọc một dòng PostgreSQL):
$ ab -n 5000 -c 100 http://127.0.0.1:8090/api/gear/1
== spring.threads.virtual.enabled=true
Failed requests:        0
Requests per second:    3989.85 [#/sec] (mean)
  95%     70
  99%    105
== spring.threads.virtual.enabled=false
Failed requests:        0
Requests per second:    3753.94 [#/sec] (mean)
  95%     53
  99%     78
`;

/* ── Mốc 18 — Chương 17 ── */
const M18_DOCKER = `
# Giai đoạn 1: build bằng JDK + Maven (không đi vào image cuối)
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /src
COPY pom.xml .
RUN mvn -q -B dependency:go-offline           # tầng này chỉ đổi khi pom.xml đổi
COPY src ./src
RUN mvn -q -B -DskipTests package && java -Djarmode=tools -jar target/gearloan-0.0.1-SNAPSHOT.jar extract --layers --launcher --destination /out

# Giai đoạn 2: chỉ JRE + các tầng của jar, chạy bằng user thường
FROM eclipse-temurin:21-jre
RUN useradd --system --uid 10001 app
WORKDIR /app
COPY --from=build /out/dependencies/ ./
COPY --from=build /out/spring-boot-loader/ ./
COPY --from=build /out/snapshot-dependencies/ ./
COPY --from=build /out/application/ ./
USER app
EXPOSE 8090
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75"
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]
`;
const M18_OUT = `
$ time docker build -q -t gearloan:0.1 .
sha256:fa25f04109dac4bb6afd37f9e3a389efa2d00e339a06c3a01bc7446f7eae4c0e
… 8:20.12 total          # lần đầu, tải cả image Maven + mọi thư viện
$ docker images gearloan:0.1
IMAGE          ID             DISK USAGE   CONTENT SIZE
gearloan:0.1   fa25f04109da        644MB          192MB
$ docker run --rm --entrypoint sh gearloan:0.1 -c 'which javac || echo "no javac"; ls /app'
no javac
BOOT-INF
META-INF
org
$ docker run -d --name gl-app -p 8091:8090 -e DB_URL=jdbc:postgresql://host.docker.internal:55432/gearloan -e DB_PASSWORD=… -e JWT_SECRET=… gearloan:0.1
$ docker ps --filter name=gl-app --format '{{.Names}}  {{.Status}}'
gl-app  Up 10 seconds (healthy)
$ docker exec gl-app id
uid=10001(app) gid=999(app) groups=999(app)
Picked up JAVA_TOOL_OPTIONS: -XX:MaxRAMPercentage=75
… Started GearloanApplication in 6.597 seconds (process running for 7.351)
`;

/* ── Mốc 19 — Chương 18 ── */
const M19_SH = `
#!/usr/bin/env bash
# smoke.sh BASE_URL — kiểm "đã gắn, với tới được", không kiểm từng luật. Thoát 1 nếu có FAIL.
B=\${1:-http://localhost:8090}; fail=0
check() { local want=$1 got; shift; got=$(curl -s -o /dev/null -w "%{http_code}" "$@"); if [ "$got" = "$want" ]; then echo "PASS $want \${*: -1}"; else echo "FAIL want $want got $got \${*: -1}"; fail=1; fi; }
check 200 "$B/actuator/health/readiness"
check 200 "$B/api/gear"
check 401 -X POST -H 'Content-Type: application/json' -d '{"name":"x","category":"y"}' "$B/api/gear"
check 200 "$B/v3/api-docs"
check 302 "$B/admin/gear"
T=$(curl -s -X POST -H 'Content-Type: application/json' -d '{"email":"binh@club.test","password":"binh-pass-123"}' "$B/api/auth/login" | sed -n 's/.*"accessToken":"\\([^"]*\\)".*/\\1/p')
[ -n "$T" ] && echo "PASS login returns a token" || { echo "FAIL login"; fail=1; }
check 403 -H "Authorization: Bearer $T" "$B/api/loans/active"
exit $fail
`;
const M19_OUT = `
$ ./smoke.sh http://localhost:8091          # chạy với container của mốc 18
PASS 200 http://localhost:8091/actuator/health/readiness
PASS 200 http://localhost:8091/api/gear
PASS 401 http://localhost:8091/api/gear
PASS 200 http://localhost:8091/v3/api-docs
PASS 302 http://localhost:8091/admin/gear
PASS login returns a token
PASS 403 http://localhost:8091/api/loans/active
exit=0
`;

/* ── Mốc 20 — Chương 19 (Thymeleaf) ── */
const M20_CODE = `
@PostMapping("/admin/gear")
String create(@Valid @ModelAttribute("form") CreateGear form, BindingResult errors, Model model, RedirectAttributes flash) {
    if (errors.hasErrors()) {                                       // ở lại trang, hiện lỗi cạnh ô nhập
        model.addAttribute("items", gears.list(null, 0).items());
        return "admin/gear-list";
    }
    var g = gears.create(form);                                     // CÙNG service với REST API
    flash.addFlashAttribute("msg", "Added " + g.name());
    return "redirect:/admin/gear";                                  // Post/Redirect/Get: F5 không gửi lại form
}
`;
const M20_HTML = `
<form th:action="@{/admin/gear}" th:object="\${form}" method="post">
  <input th:field="*{name}" placeholder="Name">
  <span class="error" th:if="\${#fields.hasErrors('name')}" th:errors="*{name}">error</span>
  <input th:field="*{category}" placeholder="Category">
  <span class="error" th:if="\${#fields.hasErrors('category')}" th:errors="*{category}">error</span>
  <button>Add</button>
</form>
`;
const M20_OUT = `
$ curl -s -o /dev/null -w "%{http_code} %{redirect_url}" localhost:8090/admin/gear
302 http://localhost:8090/login
# lấy _csrf từ form đăng nhập rồi đăng nhập bằng tài khoản STAFF
POST /login -> 302 http://localhost:8090/admin/gear
$ curl -s -b cookies localhost:8090/admin/gear | sed -n '/<table>/,/<\\/table>/p'
<table>
  <tr><th>#</th><th>Name</th><th>Category</th><th>Status</th></tr>
  <tr>
    <td>1</td><td>Canon EOS 200D</td>
    <td>camera</td><td>LOANED</td>
  </tr>
  …
# gửi form thiếu tên ⇒ ở lại trang, lỗi hiện cạnh ô nhập, ô category giữ giá trị
  <span class="error">must not be blank</span>
  <input placeholder="Category" id="category" name="category" value="audio">
# gửi form hợp lệ ⇒ 302 về danh sách (Post/Redirect/Get)
302 http://localhost:8090/admin/gear
# cùng form đó nhưng KHÔNG có _csrf (trang lạ dụ admin bấm)
403
`;

/* ── Mốc 21 — Chương 20 (MongoDB) ── */
const M21_CODE = `
/** Nhật ký sự kiện: mỗi sự kiện một document, hình dạng data khác nhau tuỳ loại ⇒ hợp với MongoDB. */
@Document("loan_events")
public record LoanEvent(@Id String id, String type, long loanId, Instant at, Map<String, Object> data) {}

public interface LoanEventRepository extends MongoRepository<LoanEvent, String> {
    List<LoanEvent> findByLoanIdOrderByAtAsc(long loanId);
}
`;
const M21_YML = `
spring:
  mongodb.uri: \${MONGO_URI:mongodb://localhost:57017/gearloan}   # Boot 4: spring.mongodb.*, không còn spring.data.mongodb.*
`;
const M21_OUT = `
# lượt đầu ghi spring.data.mongodb.uri — Boot 4 bỏ qua, driver đi thẳng tới cổng mặc định:
$ grep -o "localhost:[0-9]*" app.log | sort | uniq -c
   7 localhost:27017
   2 localhost:55432
… Caused by: java.net.ConnectException: Connection refused
# image mongo:8 trên máy dựng mẫu từ chối khởi động — đọc dòng fatal đầu tiên:
"msg":"MongoDB cannot start: Linux kernel versions 6.19.0 through 7.0.13 have a known incompatibility with this version of MongoDB. …"
# đổi sang mongo:7 + spring.mongodb.uri, mượn một món, rồi:
$ docker exec gl-mongo mongosh gearloan --quiet --eval "db.loan_events.find({}, {_id:0, _class:0}).sort({at:-1}).limit(1)"
[
  {
    type: 'LOAN_CREATED',
    loanId: Long('8'),
    at: ISODate('2026-11-22T12:57:05.246Z'),
    data: {
      dueAt: '2026-11-24T12:57:05.229648Z',
      gearId: Long('7'),
      memberId: Long('1')
    }
  }
]
`;

/* ── Mốc 22 — Chương 21 (React ↔ Spring) ── */
const M22_JS = `
// Bản rút gọn của src/api.js trong app React: token giữ trong bộ nhớ, 401 ⇒ về trang đăng nhập.
const BASE = 'http://localhost:8090/api';
let token = null;
async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401) { token = null; return { redirect: '/login', status: 401 }; }
  const data = res.status === 204 ? null : await res.json();
  if (!res.ok) throw Object.assign(new Error(data.detail), { status: res.status, errors: data.errors });
  return data;
}
`;
const M22_OUT = `
$ node apiClient.mjs
GET /loans/1 before login → { redirect: '/login', status: 401 }
logged in, token length 168
gear: Rode VideoMic (LOANED), Zoom H1n (LOANED), Shure SM58 (AVAILABLE)
form error 400 { name: 'must not be blank' }
# preflight của trình duyệt từ origin của app React (Vite, cổng 5173):
HTTP/1.1 200
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Headers: authorization, content-type
`;

export const MAU = {
  1: ghep(java(M1_CODE), out(M1_OUT),
    p('One feature package, controller → service, no database yet. Your skeleton looks like this with your own package names; the start-up line and the curl answer are your proof.',
      'Một package theo tính năng, controller → service, chưa có CSDL. Bộ khung của bạn trông như vậy với tên package của riêng bạn; dòng khởi động và câu trả lời của curl là bằng chứng.')),
  2: ghep(java(M2_CODE), out(M2_OUT),
    p('The sealed interface is the list of states; the compiler refuses a switch that forgets one. Do the same for the life cycle of your own main object.',
      'Sealed interface là danh sách trạng thái; trình biên dịch từ chối switch quên một trạng thái. Làm y vậy cho vòng đời đối tượng chính của đề tài bạn.')),
  3: ghep(java(M3_CODE), out(M3_OUT),
    p('Two runs, two different wrong numbers — that is what a race looks like. In the real app the same race happens when two members borrow the last camera; milestone 8 solves it in the database.',
      'Hai lần chạy, hai con số sai khác nhau — đó là hình dạng của một cuộc tranh chấp. Trong app thật, chuyện y hệt xảy ra khi hai thành viên cùng mượn chiếc máy ảnh cuối; mốc 8 giải nó ở CSDL.')),
  4: ghep(java(M4_CODE), yml(M4_YML), out(M4_OUT),
    p('Wrong configuration dies at start-up with the exact property name. That is the behaviour your rules record should have.',
      'Cấu hình sai chết ngay lúc khởi động và nêu đúng tên thuộc tính. Record luật của bạn nên hành xử như vậy.')),
  5: ghep(java(M5_CODE), out(M5_OUT),
    p('201 + Location, and the response is a DTO: the entity’s version column never leaves the server.',
      '201 + Location, và phản hồi là DTO: cột version của entity không bao giờ rời khỏi server.')),
  6: ghep(java(M6_CODE), out(M6_OUT),
    p('Three different problems, one shape. 400 = malformed input, 422 = a business rule (here: at most 3 active loans).',
      'Ba lỗi khác nhau, một hình dạng. 400 = dữ liệu sai dạng, 422 = luật nghiệp vụ (ở đây: tối đa 3 lượt mượn đang mở).')),
  7: ghep(java(M7_CODE), out(M7_OUT),
    p('Gear and loan change in one transaction; the second borrower sees the gear already LOANED.',
      'Gear và loan đổi trong một giao dịch; người mượn thứ hai thấy món đồ đã LOANED.')),
  8: ghep(java(M8_CODE), out(M8_OUT),
    p('Two real findings. First, 9 queries became 1 with an entity graph. Second, the Java check “is it available?” lost the race — both requests read AVAILABLE — and only the partial unique index stopped the double loan; without a handler that correct refusal reached the user as a 500.',
      'Hai phát hiện thật. Một, 9 câu truy vấn còn 1 nhờ entity graph. Hai, phép kiểm “còn trống không?” ở Java thua cuộc đua — cả hai request đều đọc AVAILABLE — và chỉ partial unique index chặn được lượt mượn đôi; thiếu handler thì lời từ chối đúng đắn đó tới người dùng dưới dạng lỗi 500.')),
  9: ghep(sql(M9_SQL), out(M9_OUT),
    p('Rules live in the schema (CHECK, partial unique index), and an edited migration refuses to start. Milestone 15 will show the CHECK catching a mistake of our own.',
      'Luật nằm trong schema (CHECK, partial unique index), và migration bị sửa thì app không chịu khởi động. Mốc 15 sẽ cho thấy CHECK bắt được một lỗi của chính chúng ta.')),
  10: ghep(java(M10_CODE), out(M10_OUT),
    p('401 = we do not know who you are (or the signature is wrong); 403 = we know, and you may not. The hash prefix shows the delegating encoder chose BCrypt.',
      '401 = không biết bạn là ai (hoặc chữ ký sai); 403 = biết, nhưng bạn không được phép. Tiền tố của mã băm cho thấy delegating encoder đã chọn BCrypt.')),
  11: ghep(java(M11_CODE), out(M11_OUT),
    p('Each line is one row of SECURITY.md: the attack, the command, the result after the fix.',
      'Mỗi khối là một dòng của SECURITY.md: đòn tấn công, lệnh, kết quả sau khi vá.')),
  12: ghep(java(M12_CODE), out(M12_OUT),
    p('Read the test count, not only BUILD SUCCESS: the first green run silently skipped the only database test.',
      'Đọc số lượng test, không chỉ BUILD SUCCESS: lượt xanh đầu tiên đã lặng lẽ bỏ qua đúng test CSDL duy nhất.')),
  13: ghep(java(M13_CODE), out(M13_OUT),
    p('A preflight that answers 200 without Access-Control-Allow-Origin still fails in the browser — always look at the headers, not the status.',
      'Preflight trả 200 mà không có Access-Control-Allow-Origin thì trình duyệt vẫn chặn — luôn nhìn header, đừng chỉ nhìn mã trạng thái.')),
  14: ghep(java(M14_CODE), out(M14_OUT),
    p('The cache works and then lies: borrowing changed the status but the list kept the old copy for its TTL. Every write path that touches cached data must evict it.',
      'Cache chạy rồi nói dối: mượn đồ đã đổi trạng thái nhưng danh sách giữ bản cũ suốt TTL. Mọi đường ghi chạm vào dữ liệu được cache đều phải xoá cache.')),
  15: ghep(java(M15_CODE), out(M15_OUT),
    p('The handler runs on task-1 after the commit; the job marks one loan and then finds nothing more to do — idempotent.',
      'Handler chạy trên task-1 sau commit; job đánh dấu một lượt rồi không còn gì để làm — idempotent.')),
  16: ghep(yml(M16_YML), java(M16_CODE), out(M16_OUT),
    p('The meter named gearloan.loans.created is exported as gearloan_loans_total — grep for what is really there before you build a dashboard on a name.',
      'Meter tên gearloan.loans.created được xuất thành gearloan_loans_total — grep thứ thật sự có trước khi dựng dashboard trên một cái tên.')),
  17: ghep(out(M17_OUT),
    p('An honest result: on a fast endpoint virtual threads changed throughput by about 6% and made p95/p99 worse. Measured, written down, not kept as “an optimisation” for this endpoint.',
      'Một kết quả thật thà: ở endpoint nhanh, virtual thread đổi thông lượng khoảng 6% và làm p95/p99 tệ hơn. Đã đo, đã ghi lại, và không giữ làm “tối ưu” cho endpoint này.')),
  18: ghep(bash(M18_DOCKER), out(M18_OUT),
    p('The runtime image has no compiler and no source, runs as uid 10001, and the JVM sizes its heap from the container limit.',
      'Image chạy không có trình biên dịch, không có mã nguồn, chạy bằng uid 10001, và JVM tính heap theo giới hạn của container.')),
  19: ghep(bash(M19_SH), out(M19_OUT),
    p('Seven checks in under a second: health, a public route, a protected route, docs, the admin redirect, login, and a role check.',
      'Bảy phép kiểm trong chưa tới một giây: health, một tuyến công khai, một tuyến bảo vệ, tài liệu, chuyển hướng trang quản trị, đăng nhập và một phép kiểm vai trò.')),
  20: ghep(java(M20_CODE), xml(M20_HTML), out(M20_OUT),
    p('Same service as the API, a second filter chain with sessions and CSRF, errors next to the field, Post/Redirect/Get — and the forged POST without _csrf is refused.',
      'Cùng service với API, chuỗi filter thứ hai có session và CSRF, lỗi cạnh ô nhập, Post/Redirect/Get — và lệnh POST giả không có _csrf bị từ chối.')),
  21: ghep(java(M21_CODE), yml(M21_YML), out(M21_OUT),
    p('Two real start-up problems before the first document: a property renamed in Boot 4, and an image that refused the host kernel. Both were found by reading the first error line, not by guessing.',
      'Hai sự cố khởi động thật trước document đầu tiên: một thuộc tính đổi tên ở Boot 4, và một image từ chối kernel của máy. Cả hai đều tìm ra bằng cách đọc dòng lỗi đầu tiên, không phải bằng đoán.')),
  22: ghep(js(M22_JS), out(M22_OUT),
    p('This is the core of the React side: one place that adds the token, one place that handles 401, and ProblemDetail errors passed to the form. The full version adds a refresh-token cookie (Chapter 21).',
      'Đây là lõi phía React: một chỗ gắn token, một chỗ xử lý 401, và lỗi ProblemDetail được chuyển cho form. Bản đầy đủ thêm cookie refresh token (Chương 21).')),
};
