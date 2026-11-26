/**
 * 5.2 — Modular Monolith làm đúng: ranh giới module, 5 nguyên tắc để sau này tách được & kiểm tự động bằng ArchUnit (dm5-5-2-modular-monolith).
 * Nguồn đã kiểm: David L. Parnas, "On the Criteria To Be Used in Decomposing Systems into Modules", Communications of the ACM (12/1972);
 * ArchUnit (archunit.org — kiểm luật kiến trúc bằng JUnit trên bytecode Java);
 * Spring Modulith (docs.spring.io/spring-modulith — xác minh ranh giới module trong Spring Boot).
 * Không lặp chi tiết Spring IoC/Events ở khoá spring-boot hay coupling/cohesion ở SWD392 — dẫn link và dạy 5 luật vận hành Modular Monolith + cầu nối sang Microservices.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, js, out, ac, cs, vo, dm, lf, mu, viecLabflow, apDung } from '../_chung.mjs';

const L52 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 5 · Lesson 5.2', 'Chương 5 · Bài 5.2', `
<h2>${t('5.2 — Modular Monolith Done Right: 5 Boundary Rules, ArchUnit &amp; the Bridge to Microservices', '5.2 — Modular Monolith làm đúng: 5 nguyên tắc ranh giới, ArchUnit &amp; cầu nối sang Microservices')}</h2>
<p class="lead">${t(
    'Calling your Spring Boot project a "Modular Monolith" on slides does NOT make it modular. If <code>ReservationService</code> directly injects <code>EquipmentRepository</code>, runs a 5-table SQL <code>JOIN</code> across four modules, and wraps booking + inventory + email + maintenance in one giant <code>@Transactional</code> method, you did not build a Modular Monolith — you built a <strong>Big Ball of Mud</strong> wearing a fancy nametag. In this lesson, under hat C3 (Dev Lead / Architect), you learn the exact <strong>5 Boundary Rules</strong> that keep modules genuinely decoupled so your codebase stays easy to test today AND cheap to split into Microservices tomorrow — plus how to enforce those rules automatically in CI with <strong>ArchUnit</strong>.',
    'Ghi chữ "Modular Monolith" lên slide KHÔNG làm cho dự án Spring Boot của bạn tự động có tính module. Nếu <code>ReservationService</code> tiêm thẳng <code>EquipmentRepository</code>, chạy câu SQL <code>JOIN</code> 5 bảng xuyên bốn module, và bọc đặt phòng + kho thiết bị + gửi mail + bảo trì trong cùng một hàm <code>@Transactional</code> khổng lồ, bạn không hề làm Modular Monolith — bạn đang làm một <strong>khối bùn rối (Big Ball of Mud)</strong> dán nhãn sang trọng. Trong bài này, dưới mũ C3 (Dev Lead / Kiến trúc sư), bạn học đúng <strong>5 Nguyên tắc Ranh giới</strong> giúp các module thật sự tách bạch để dễ test hôm nay VÀ tách rẻ thành Microservices ngày mai — cộng cách khoá cứng luật đó tự động trên CI bằng <strong>ArchUnit</strong>.')}</p>

<h3>${t('Everyday picture: apartment units with a shared hallway vs. knocking down every wall', 'Liên tưởng đời thường: các căn hộ chung hành lang khác việc đục thông hết tường nhà hàng xóm')}</h3>
<p>${t(
    'Think of a clean apartment building: every unit shares the same building foundation and roof (one deployable app), yet each unit has a locked front door, its own electricity meter, and its own private rooms. If Unit 301 wants to borrow sugar from Unit 302, they ring the doorbell at the front door (a public <strong>Facade/Interface</strong>) or drop a note in the mailbox (an <strong>Event</strong>). Nobody knocks a hole through the bedroom wall to grab things straight out of the neighbor\'s fridge (calling another module\'s internal <code>Repository</code> or <code>JOIN</code>ing its private tables). Because the walls stayed intact, if Unit 302 ever grows into a big family and needs to move to a separate house (extracting a Microservice), they pack up and move cleanly without collapsing Unit 301\'s ceiling!',
    'Hãy tưởng tượng một toà chung cư gọn gàng: các căn hộ dùng chung móng và mái nhà (một bản deploy duy nhất), nhưng mỗi căn đều có cửa chính có khoá, công tơ điện riêng và phòng riêng. Căn 301 muốn hỏi mượn đường căn 302 thì bấm chuông ở cửa trước (<strong>Facade/Interface</strong> công khai) hoặc bỏ giấy nhắn vào hòm thư (<strong>Event</strong>). Không ai đục thủng tường phòng ngủ để thò tay lục thẳng tủ lạnh nhà hàng xóm (tiêm thẳng <code>Repository</code> nội bộ hay <code>JOIN</code> chéo bảng riêng của module khác). Chính vì các bức tường được giữ nguyên vẹn, khi căn 302 sau này đông người cần dọn ra ở nhà riêng (tách thành Microservice), họ đóng thùng dọn đi êm ru mà không làm sập trần nhà căn 301!')}</p>

<h3>${t('1. Why Boundaries Rot Without Discipline (Parnas 1972 &amp; Package-by-Feature)', '1. Vì sao ranh giới tự mục nát nếu thiếu kỷ luật (Parnas 1972 &amp; Package-by-Feature)')} ${mu('C3', en)}</h3>
<p>${t(
    'Back in December 1972, computer scientist David L. Parnas published the foundational paper <em>"On the Criteria To Be Used in Decomposing Systems into Modules"</em> (Communications of the ACM), introducing <strong>information hiding</strong>: each module must hide design decisions likely to change (its tables, entities, and internal helpers) behind a small, stable interface. For the underlying metrics of cohesion, coupling, and layered mapping from COMET to Spring Boot, review ',
    'Từ tháng 12/1972, nhà khoa học máy tính David L. Parnas đã công bố bài báo nền tảng <em>"On the Criteria To Be Used in Decomposing Systems into Modules"</em> (Communications of the ACM), đặt nền móng cho <strong>che giấu thông tin (information hiding)</strong>: mỗi module phải giấu những quyết định dễ thay đổi (bảng dữ liệu, entity và lớp nội bộ) sau một interface nhỏ và ổn định. Về chỉ số đo cohesion, coupling và cách ánh xạ từ COMET sang Spring Boot, xem lại ')}${ac('software-architecture-and-design', 'swd392-1-1-design-concepts', t('SWD392 1.1 — Coupling &amp; Cohesion', 'SWD392 1.1 — Coupling &amp; Cohesion'))}${t(' and ', ' và ')}${ac('software-architecture-and-design', 'swd392-slide-cs4-2', t('SWD392 CS.4 — Module rules &amp; coupling', 'SWD392 CS.4 — Luật module &amp; đo coupling'))}${t(
    '.',
    '.')}</p>
<p>${t(
    'The #1 structural fix comes before writing business logic: organize your backend by <strong>package-by-feature</strong> (e.g. <code>catalog/</code>, <code>reservation/</code>, <code>loan/</code>) rather than <strong>package-by-layer</strong> (<code>controllers/</code>, <code>services/</code>, <code>repositories/</code>). In package-by-layer, every repository must be <code>public</code> so services in another package can call it — which accidentally invites EVERY service in the entire app to call EVERY repository! In package-by-feature, repositories and internal helpers stay inside an <code>internal/</code> subpackage (or package-private), exposing ONLY the module\'s public API.',
    'Biện pháp cấu trúc số 1 phải làm trước khi viết logic nghiệp vụ: tổ chức backend theo <strong>package-by-feature</strong> (vd <code>catalog/</code>, <code>reservation/</code>, <code>loan/</code>) thay vì <strong>package-by-layer</strong> (<code>controllers/</code>, <code>services/</code>, <code>repositories/</code>). Khi chia theo tầng, mọi repository bắt buộc để <code>public</code> để tầng service ở gói khác gọi được — vô tình mở toang cửa cho MỌI service trong cả hệ thống gọi chéo MỌI repository! Còn với package-by-feature, repository và lớp nội bộ nằm gọn trong gói con <code>internal/</code> (hoặc package-private), chỉ lộ ra đúng API công khai của module.')}</p>

<pre><code>${t(`  GOOD: Package-by-Feature (Vertical Module)         BAD: Package-by-Layer (Spaghetti Trap)
  -------------------------------------------        ---------------------------------------
  vn.labflow.reservation/                            vn.labflow/
   |-- api/  (PUBLIC contract for other modules)      |-- controller/ (15 files mixed)
   |    |-- ReservationFacade.java (interface)        |-- service/    (15 files cross-calling)
   |    |-- ReservationSummaryDto.java (record)       |-- repository/ (ALL public! anyone
   |    |-- ReservationCancelledEvent.java            |                can inject any repo!)
   |-- internal/ (PRIVATE — ArchUnit blocks access!)  +-- entity/     (entangled @ManyToOne)
        |-- ReservationController.java
        |-- ReservationServiceImpl.java
        |-- ReservationRepository.java
        +-- ReservationEntity.java`, `  TỐT: Chia theo tính năng (Package-by-Feature)      XẤU: Chia theo tầng (Bẫy code rối)
  -------------------------------------------        ---------------------------------------
  vn.labflow.reservation/                            vn.labflow/
   |-- api/  (Hợp đồng CÔNG KHAI cho module khác)     |-- controller/ (15 file trộn chung)
   |    |-- ReservationFacade.java (interface)        |-- service/    (15 file gọi chéo nhau)
   |    |-- ReservationSummaryDto.java (record)       |-- repository/ (TẤT CẢ đều public —
   |    |-- ReservationCancelledEvent.java            |                ai cũng tiêm chéo được!)
   |-- internal/ (NỘI BỘ — ArchUnit chặn gọi chéo!)   +-- entity/     (@ManyToOne chằng chịt)
        |-- ReservationController.java
        |-- ReservationServiceImpl.java
        |-- ReservationRepository.java
        +-- ReservationEntity.java`)}</code></pre>

<h3>${t('2. The 5 Non-Negotiable Boundary Rules (Your Bridge to Microservices)', '2. Năm nguyên tắc ranh giới bắt buộc (Cầu nối thẳng sang Microservices)')} ${mu('C3', en)}</h3>
<p>${t(
    'Apply these exact 5 rules to ANY Modular Monolith (LabFlow, e-commerce, or enterprise ERP). Notice how every single rule maps 1-to-1 to a clean future Microservice extraction:',
    'Áp dụng đúng 5 nguyên tắc này cho MỌI Modular Monolith (LabFlow, sàn TMĐT hay ERP doanh nghiệp). Để ý từng nguyên tắc đều ánh xạ 1-1 sang đường tách Microservices sạch sau này:')}</p>

${bang(
  [t('#', '#'), t('Boundary Rule', 'Nguyên tắc ranh giới'), t('What is FORBIDDEN (Red Flag)', 'Cấm làm gì (Cờ đỏ)'), t('How to do it RIGHT', 'Cách làm ĐÚNG'), t('How this becomes a Microservice later', 'Sau này tách Microservice ra sao')],
  [
    ['<strong>1</strong>', t('<strong>Facade / Interface only</strong>', '<strong>Chỉ gọi qua Facade / Interface</strong>'), t('<code>reservation</code> imports <code>catalog.internal.LabRepository</code> or <code>LabEntity</code>.', '<code>reservation</code> import thẳng <code>catalog.internal.LabRepository</code> hay <code>LabEntity</code>.'), t('Expose <code>CatalogFacade</code> returning immutable DTO/record (<code>LabInfo</code>).', 'Mở <code>CatalogFacade</code> trả về DTO/record bất biến (<code>LabInfo</code>).'), t('Swap local Spring bean for an HTTP/gRPC client implementing the exact same <code>CatalogFacade</code>!', 'Đổi bean gọi nội bộ thành HTTP/gRPC client cài đặt đúng <code>CatalogFacade</code> đó!')],
    ['<strong>2</strong>', t('<strong>No cross-module SQL JOINs</strong>', '<strong>Không JOIN bảng chéo module</strong>'), t('<code>loan</code> writes a JPA <code>@ManyToOne</code> or SQL <code>JOIN</code> straight into <code>maintenance_tickets</code>.', '<code>loan</code> gắn <code>@ManyToOne</code> hay viết SQL <code>JOIN</code> thẳng vào bảng <code>maintenance_tickets</code>.'), t('Store foreign IDs as plain scalar IDs (<code>Long equipmentId</code>); fetch display data via Facade or read-model query.', 'Lưu khoá chéo bằng ID thuần (<code>Long equipmentId</code>); lấy dữ liệu hiển thị qua Facade hoặc read-model riêng.'), t('Move module tables to a separate database instance with ZERO broken SQL queries.', 'Bê bảng của module sang một CSDL riêng mà KHÔNG vỡ câu SQL nào.')],
    ['<strong>3</strong>', t('<strong>No cross-module <code>@Transactional</code></strong>', '<strong>Không <code>@Transactional</code> bao nhiều module</strong>'), t('One giant transaction updates <code>reservation</code>, promotes <code>waitlist</code>, and sends SMTP email.', 'Một transaction khổng lồ vừa sửa <code>reservation</code>, vừa đôn <code>waitlist</code>, vừa gửi mail SMTP.'), t('Each module commits its OWN state change in its own short transaction.', 'Mỗi module chỉ commit thay đổi trạng thái của RIÊNG mình trong transaction ngắn.'), t('Matches microservice reality where two services never share an ACID transaction.', 'Khớp hoàn toàn thực tế microservices nơi hai dịch vụ không bao giờ chung transaction ACID.')],
    ['<strong>4</strong>', t('<strong>Communicate via Events</strong>', '<strong>Giao tiếp qua sự kiện (Event)</strong>'), t('<code>ReservationService</code> directly calls <code>WaitlistService</code>, <code>NotificationService</code>, and <code>ReportService</code> (tight fan-out + cycles).', '<code>ReservationService</code> gọi trực tiếp <code>WaitlistService</code>, <code>NotificationService</code> và <code>ReportService</code> (rối chằng chịt + vòng tròn).'), t('Publish domain event (<code>ReservationCancelledEvent</code>) using Spring <code>ApplicationEventPublisher</code> + <code>@TransactionalEventListener</code> (or Outbox table for external mail).', 'Phát sự kiện miền (<code>ReservationCancelledEvent</code>) qua <code>ApplicationEventPublisher</code> + <code>@TransactionalEventListener</code> (hoặc bảng Outbox cho email ngoài).'), t('Replace in-process event bus with RabbitMQ/Kafka topic — consumers barely change!', 'Thay bus sự kiện trong bộ nhớ bằng topic RabbitMQ/Kafka — bên nhận gần như không đổi code!')],
    ['<strong>5</strong>', t('<strong>Dedicated Flyway migrations per module</strong>', '<strong>Migration Flyway rạch ròi theo module</strong>'), t('One massive chaotic <code>V1__everything.sql</code> mixed with random <code>ALTER</code> edits across unrelated modules.', 'Một file <code>V1__everything.sql</code> hỗn độn kèm đủ lệnh <code>ALTER</code> sửa chéo bảng của module khác.'), t('Group migrations cleanly by module prefix/folder (or schema per module); only a module\'s owner alters its own tables.', 'Tổ chức file migration rạch ròi theo nhóm/tiền tố module (hoặc schema riêng); chỉ chủ module mới sửa bảng của module đó.'), t('Copy that module\'s migration history straight into the new service\'s database!', 'Chép nguyên lịch sử migration của module đó sang CSDL dịch vụ mới!')]
  ]
)}

<p>${t(
    'For the Spring Boot implementation details of Rule 4 (application events and the transactional outbox pattern), see ',
    'Để xem chi tiết kỹ thuật Spring Boot cho Nguyên tắc 4 (sự kiện ứng dụng và mẫu transactional outbox), xem thêm ')}${cs('spring-boot', 'sb-14-3-application-event', t('Spring Boot 14.3 — Application events', 'Spring Boot 14.3 — Sự kiện ứng dụng'))}${t(' and ', ' và ')}${cs('spring-boot', 'sb-14-4-outbox', t('Spring Boot 14.4 — Transactional outbox', 'Spring Boot 14.4 — Mẫu transactional outbox'))}${t('.', '.')}</p>

<h3>${t('3. Dependency Direction Map on LabFlow AI (Zero Cycles Allowed!)', '3. Bản đồ chiều phụ thuộc một chiều trên LabFlow AI (Cấm vòng tròn!)')} ${mu('C3', en)}</h3>
<p>${t(
    'Draw a directed dependency graph BEFORE coding. Look at ',
    'Hãy vẽ đồ thị mũi tên phụ thuộc có hướng TRƯỚC KHI code. Đối chiếu với ')}${lf(t('LabFlow AI — Repo Structure &amp; One-Way Module Rule', 'LabFlow AI — Cấu trúc repo &amp; Luật một chiều giữa các module'))}${t(
    ': <code>reservation</code> may depend on <code>catalog.api</code> (to check whether a lab is active), but <code>catalog</code> MUST NEVER depend on <code>reservation</code>. Whenever you spot a cycle (A → B → A), break it with a Domain Event!',
    ': <code>reservation</code> được gọi <code>catalog.api</code> (hỏi phòng lab có đang mở không), nhưng <code>catalog</code> TUYỆT ĐỐI KHÔNG BAO GIỜ gọi ngược <code>reservation</code>. Hễ thấy mũi tên tạo vòng tròn (A → B → A), cắt ngay bằng Domain Event!')}</p>

<pre><code>${t(`              [ common ] &lt;--- shared ApiResponse, ErrorCode, TimeRange (depends on NOTHING)
                  ^
                  |
      [ auth / user / security ]  (provides CurrentUser, Role checks)
                  ^
                  |
             [ catalog ]  (buildings, labs, equipment, operating calendar)
              ^       ^
              |       | (calls CatalogFacade ONLY — never CatalogRepository!)
              |       +---------------------------+
              |                                   |
        [ reservation ] ---publishes event---&gt; [ waitlist ] &amp; [ notification (outbox) ]
              ^                                   ^
              |                                   |
         [ checkin ]                          [ loan ] &lt;--event-- [ maintenance ]
                                                                     (locks equipment via
                                                                      event / CatalogFacade)
   RULE: Arrows flow strictly UP/RIGHT (DAG = Directed Acyclic Graph). ZERO cycles!`, `              [ common ] &lt;--- ApiResponse, ErrorCode, TimeRange chung (KHÔNG phụ thuộc ai)
                  ^
                  |
      [ auth / user / security ]  (cung cấp CurrentUser, kiểm tra Role)
                  ^
                  |
             [ catalog ]  (toà nhà, phòng lab, thiết bị, lịch mở cửa)
              ^       ^
              |       | (CHỈ gọi CatalogFacade — tuyệt đối không gọi CatalogRepository!)
              |       +---------------------------+
              |                                   |
        [ reservation ] ---phát sự kiện---&gt; [ waitlist ] &amp; [ notification (outbox) ]
              ^                                   ^
              |                                   |
         [ checkin ]                          [ loan ] &lt;--sự kiện-- [ maintenance ]
                                                                      (khoá thiết bị qua
                                                                       event / CatalogFacade)
   LUẬT: Mũi tên chỉ đi LÊN/SANG PHẢI (DAG = Đồ thị có hướng không vòng). 0 vòng tròn!`)}</code></pre>
<p>${t(
    '<em>Note on <code>maintenance</code> placement:</em> In ',
    '<em>Lưu ý vị trí của <code>maintenance</code>:</em> Trên ')}${lf(t('LabFlow AI', 'LabFlow AI'))}${t(
    ', <code>maintenance</code> is shown as its own module (ideal when equipment ticketing is owned by a dedicated slice), whereas the SEP490 Report 4 SDS 13-package sample groups maintenance tickets inside <code>loan</code>. Both are valid — choose ONE option in your Module Map and keep your Package Diagram and actual folders 100% identical!',
    ', <code>maintenance</code> được tách thành module riêng (rất hợp khi luồng bảo trì đi theo lát cắt dọc riêng), còn trong mẫu Report 4 SDS 13 package của SEP490 thì gộp chung vào <code>loan</code>. Cả hai cách đều hợp lệ — hãy chốt MỘT phương án trong Bản đồ Module và giữ Sơ đồ gói khớp 100% thư mục code thật!')}</p>

<h3>${t('4. Automated Boundary Enforcement: ArchUnit (Because Humans Forget at 2 AM)', '4. Kiểm ranh giới tự động bằng ArchUnit (Vì lúc 2 giờ sáng ai cũng dễ phá luật)')} ${mu('C3', en)} ${mu('C5', en)}</h3>
<p>${t(
    'Written guidelines in a README rot in two weeks when deadlines hit. That is why real Java/Spring teams put <strong>ArchUnit</strong> (<code>archunit.org</code>) or <strong>Spring Modulith</strong> (<code>docs.spring.io/spring-modulith</code>) directly inside <code>./mvnw test</code>. Every time you run tests or open a Pull Request, a 15-line JUnit test inspects compiled <code>.class</code> bytecode and <strong>fails the build immediately</strong> if any class imports another module\'s <code>..internal..</code> package or introduces a circular dependency! Below is a general illustrative snippet (not full project code):',
    'Luật viết bằng chữ trong README sẽ bị phá trong hai tuần khi dí deadline. Đó là lý do các đội Java/Spring thật gắn <strong>ArchUnit</strong> (<code>archunit.org</code>) hoặc <strong>Spring Modulith</strong> (<code>docs.spring.io/spring-modulith</code>) ngay trong lệnh <code>./mvnw test</code>. Mỗi lần chạy test hoặc mở Pull Request, một bài test JUnit dài khoảng 15 dòng sẽ soi thẳng bytecode <code>.class</code> và <strong>đánh đỏ bản build ngay lập tức</strong> nếu bất kỳ lớp nào lỡ import gói <code>..internal..</code> của module khác hoặc tạo phụ thuộc vòng tròn! Dưới đây là đoạn khung minh hoạ tổng quát (không phải code hoàn chỉnh đồ án):')}</p>

${js(`// Illustrative JUnit + ArchUnit test (<= 20 lines, general pattern)
@AnalyzeClasses(packages = "com.example.app")
class ModuleBoundaryArchTest {
  @ArchTest
  static final ArchRule noDirectAccessToOtherModuleInternal =
      noClasses().that().resideInAPackage("..booking..")
          .should().dependOnClassesThat().resideInAPackage("..catalog.internal..");

  @ArchTest
  static final ArchRule modulesMustBeCycleFree =
      slices().matching("com.example.app.(*)..")
          .should().beFreeOfCycles();
}`)}

${cl('tip', `<p><strong>${t('Defense &amp; interview gold:', 'Điểm ăn tiền khi bảo vệ &amp; phỏng vấn:')}</strong> ${t('Imagine a panelist asking: "You claim your monolith is modular — how do you prove module A didn\'t cheat and call module B\'s repository?" You open <code>ModuleBoundaryArchTest</code> and CI logs showing <strong>automated ArchUnit verification passing on every PR</strong>. Very few undergraduate teams ever do this — it instantly signals senior-level engineering discipline.', 'Hãy tưởng tượng giám khảo hỏi: "Em nói monolith của em chia module sạch — lấy gì chứng minh module A không lén gọi repository của module B?" Bạn mở <code>ModuleBoundaryArchTest</code> và log CI cho thấy <strong>bài kiểm ArchUnit chạy tự động xanh ở mọi PR</strong>. Rất ít đồ án sinh viên làm được điều này — nó lập tức thể hiện kỷ luật kỹ sư ở tầm đi làm thật.')}</p>`)}

<h3>🕵️ ${t('The Hacker &amp; Data-Leak Angle: Why Leaky Module Boundaries Become Security Holes', 'Góc kẻ xấu &amp; Rò rỉ dữ liệu: Khi ranh giới module rách trở thành lỗ hổng bảo mật')}</h3>
<p>${t(
    'Leaky module boundaries do not just create messy code — they create <strong>authorization bypasses</strong>. Suppose your <code>user</code> module enforces strict password-hash hiding and role checks inside <code>UserFacade</code>, while another module (<code>report</code> or <code>reservation</code>) bypasses the facade and runs a raw SQL query or <code>UserRepository.findById()</code> directly, serializing the whole <code>UserEntity</code> into a JSON response. Suddenly <code>passwordHash</code>, <code>failedLogins</code>, or private staff fields leak into an API response (OWASP API3:2023 Broken Object Property Level Authorization — Excessive Data Exposure). Enforcing <strong>Rule 1 (Facade + narrow DTOs only)</strong> acts as a built-in security bulkhead: other modules literally cannot see fields they were never authorized to read.',
    'Ranh giới module bị thủng không chỉ làm code rối — nó tạo ra <strong>lỗ hổng vượt quyền</strong>. Giả sử module <code>user</code> kiểm soát chặt việc giấu mã băm mật khẩu và phân quyền bên trong <code>UserFacade</code>, nhưng một module khác (<code>report</code> hoặc <code>reservation</code>) lại đi vòng qua facade, gọi thẳng <code>UserRepository.findById()</code> rồi trả nguyên <code>UserEntity</code> ra JSON. Ngay lập tức <code>passwordHash</code>, <code>failedLogins</code> hay trường nội bộ bị rò ra phản hồi API (OWASP API3:2023 Broken Object Property Level Authorization — Lộ dữ liệu thừa). Siết chặt <strong>Nguyên tắc 1 (chỉ đi qua Facade + DTO gọn)</strong> đóng vai trò vách ngăn bảo mật tự nhiên: module khác về mặt kỹ thuật không thể chạm tới dữ liệu không thuộc quyền đọc.')}</p>

<h3>${t('5. Common Modular Monolith Mistakes — and How to Avoid Them', '5. Lỗi hay gặp khi làm Modular Monolith — và cách tránh')}</h3>
<ul>
<li>${t('<strong>Turning <code>common/</code> into a catch-all dumping ground:</strong> Putting business entities (<code>User</code>, <code>Lab</code>, <code>Reservation</code>) inside <code>common/</code> because "every module needs them" destroys modularity completely. Fix: <code>common/</code> holds ONLY pure technical primitives (<code>ApiResponse</code>, <code>ErrorCode</code>, <code>PageResponse</code>, <code>Clock</code>) — zero domain entities!', '<strong>Biến package <code>common/</code> thành chỗ chứa mọi thứ:</strong> Quăng hết entity nghiệp vụ (<code>User</code>, <code>Lab</code>, <code>Reservation</code>) vào <code>common/</code> vì "module nào cũng cần" sẽ phá sạch tính module. Cách tránh: <code>common/</code> CHỈ chứa thành phần kỹ thuật thuần (<code>ApiResponse</code>, <code>ErrorCode</code>, <code>PageResponse</code>, <code>Clock</code>) — tuyệt đối 0 entity nghiệp vụ!')}</li>
<li>${t('<strong>Over-splitting into 25 tiny modules:</strong> Creating separate modules for <code>building</code>, <code>floor</code>, <code>room</code>, and <code>seat</code> causes endless boilerplate facades. Fix: group cohesive entities that change together (<code>catalog</code> owns building + lab + equipment + operating calendar). Aim for roughly 8–13 coarse-grained modules for a ~46-screen app (matching LabFlow v1/v2\'s module map).', '<strong>Chia vụn quá đà thành 25 module tí hon:</strong> Tách riêng <code>building</code>, <code>floor</code>, <code>room</code>, <code>seat</code> đẻ ra hàng đống facade thừa. Cách tránh: gom các thực thể gắn kết hay đổi cùng nhau vào một module (<code>catalog</code> giữ building + lab + equipment + lịch mở cửa). Ứng dụng ~46 màn chỉ nên có cỡ 8–13 module cỡ vừa (khớp bản đồ module v1/v2 của LabFlow).')}</li>
<li>${t('<strong>Synchronous event trap (breaking Rule 3):</strong> Using Spring\'s default synchronous <code>@EventListener</code> runs the listener INSIDE the publisher\'s transaction — so if email sending throws an error, the whole lab booking rolls back! Fix: use <code>@TransactionalEventListener(phase = AFTER_COMMIT)</code> or write an Outbox row inside the transaction so a background worker delivers it asynchronously.', '<strong>Bẫy sự kiện đồng bộ (phá Nguyên tắc 3):</strong> Dùng <code>@EventListener</code> đồng bộ mặc định của Spring sẽ chạy bên nhận BÊN TRONG transaction của bên gửi — nên nếu gửi email bị lỗi, cả lượt đặt phòng lab bị rollback mất sạch! Cách tránh: dùng <code>@TransactionalEventListener(phase = AFTER_COMMIT)</code> hoặc ghi một dòng vào bảng Outbox trong transaction để worker nền gửi bất đồng bộ.')}</li>
<li>${t('<strong>Skipping the boundary test until Week 9:</strong> Untangling 80 illegal imports in Week 9 is miserable. Fix: write your first 10-line ArchUnit test on Day 1 of coding (Chapter 6) so violations are blocked on the very first bad commit.', '<strong>Để tới Tuần 9 mới kiểm ranh giới:</strong> Gỡ 80 dòng import chéo ở Tuần 9 cực kỳ mệt. Cách tránh: viết bài test ArchUnit 10 dòng ngay Ngày 1 lúc dựng khung (Chương 6) để chặn vi phạm ngay từ commit sai đầu tiên.')}</li>
</ul>

${phongVan([
  [t('"How do you keep a Modular Monolith from slowly decaying into a Big Ball of Mud over 12 months?"', '"Làm sao giữ cho một Modular Monolith không dần mục nát thành khối bùn rối sau 12 tháng?"'), t('Combine four safeguards: (1) Package-by-feature with explicit <code>api/</code> vs. <code>internal/</code> visibility, (2) the 5 Boundary Rules (facade-only calls, no cross-module JOINs, separate transactions, domain events/outbox, module-owned migrations), (3) automated fitness functions in CI using ArchUnit or Spring Modulith that fail any PR violating module boundaries or creating cycles, and (4) module ownership in PR review.', 'Kết hợp bốn lớp chốt: (1) Package-by-feature phân rạch ròi <code>api/</code> và <code>internal/</code>, (2) 5 Nguyên tắc Ranh giới (chỉ gọi facade, không JOIN chéo, transaction tách biệt, sự kiện/outbox, migration riêng module), (3) hàm kiểm tra kiến trúc tự động trên CI bằng ArchUnit hoặc Spring Modulith tự đánh đỏ mọi PR phá ranh giới hay tạo vòng tròn, và (4) phân quyền review PR theo chủ module.')],
  [t('"When a reservation is cancelled, how do you trigger waitlist promotion and email notification without coupling <code>reservation</code> tightly to <code>waitlist</code> and <code>notification</code>?"', '"Khi một lượt đặt bị huỷ, bạn kích hoạt đôn waitlist và gửi email kiểu gì mà không trói chặt module <code>reservation</code> vào <code>waitlist</code> và <code>notification</code>?"'), t('<code>ReservationService.cancel()</code> updates the reservation status and frees the slot inside its own transaction, writes an outbox record or publishes <code>ReservationCancelledEvent</code>, and commits. After commit, <code>waitlist</code> and <code>notification</code> react independently — if the email server is down, the cancellation still succeeds and the outbox retries safely.', '<code>ReservationService.cancel()</code> cập nhật trạng thái huỷ và nhả slot trong transaction của riêng mình, ghi dòng outbox hoặc phát <code>ReservationCancelledEvent</code> rồi commit. Sau khi commit, <code>waitlist</code> và <code>notification</code> tự xử lý độc lập — dù máy chủ email sập, lượt huỷ vẫn thành công và outbox sẽ tự thử gửi lại an toàn.')]
], en)}

${apDung([
  [t('Different topic — Multi-vendor E-commerce Marketplace', 'Đề tài khác — Sàn thương mại điện tử nhiều người bán'), t('Apply the 5 Rules across <code>catalog</code>, <code>inventory</code>, <code>order</code>, <code>payment</code>, and <code>payout</code>: when <code>payment</code> receives a confirmed bank webhook, it commits its own payment record and emits <code>PaymentSucceededEvent</code>; <code>order</code> marks the sub-orders PAID, <code>notification</code> emails the buyer/seller, and <code>payout</code> schedules escrow release — zero cross-module SQL JOINs and zero circular imports.', 'Áp 5 Nguyên tắc cho <code>catalog</code>, <code>inventory</code>, <code>order</code>, <code>payment</code> và <code>payout</code>: khi <code>payment</code> nhận webhook ngân hàng thành công, nó commit bản ghi thanh toán của riêng mình rồi phát <code>PaymentSucceededEvent</code>; <code>order</code> chuyển đơn con sang PAID, <code>notification</code> gửi mail người mua/người bán, và <code>payout</code> lên lịch giải ngân — không JOIN chéo và không import vòng tròn.')],
  [t('Real 5-person team (SEP490 Capstone)', 'Đồ án nhóm thật 5 người (SEP490)'), t('Module boundaries double as <strong>team conflict shields</strong>! Assign each teammate primary ownership of 1–2 feature packages (matching their vertical slice screens). Because teammates only touch their own <code>internal/</code> packages and agree on small <code>api/</code> facades first, Git merge conflicts drop dramatically.', 'Ranh giới module đồng thời là <strong>lá chắn chống xung đột nhóm</strong>! Giao mỗi bạn làm chủ 1–2 package nghiệp vụ (khớp lát cắt dọc màn hình của bạn đó). Vì mỗi người chỉ sửa trong gói <code>internal/</code> của mình và chốt trước các interface <code>api/</code> nhỏ, xung đột merge Git giảm đi rõ rệt.')],
  [t('Large enterprise / outsourcing company (FPT Software, 20–100 people)', 'Công ty lớn / dự án outsourcing (FPT Software, 20–100 người)'), t('Enterprise Java platforms pair Spring Modulith / ArchUnit with GitHub <code>CODEOWNERS</code> per module directory: any PR modifying <code>catalog/api/</code> automatically requires approval from the Catalog Tech Lead because changing a public facade is a breaking contract change across squads.', 'Các nền tảng Java doanh nghiệp ghép Spring Modulith / ArchUnit với tệp <code>CODEOWNERS</code> trên GitHub theo từng thư mục module: bất kỳ PR nào sửa <code>catalog/api/</code> đều tự động yêu cầu duyệt từ Tech Lead module Catalog vì đổi facade công khai là thay đổi hợp đồng xuyên đội.')]
], en)}

${viecLabflow([
  [t('Under <strong>Green (C3 Dev BE Lead)</strong>, create a CT Work <code>docs</code> page <code>05-02-Module-Boundary-Map</code> (and mirror in <code>docs/architecture/modules.md</code>) listing LabFlow\'s v1 modules, each module\'s owned tables, public <code>Facade</code> methods, published Domain Events, and allowed outgoing dependencies (verified 0 cycles).', 'Dưới mũ <strong>Xanh lá (C3 Dev BE Lead)</strong>, tạo trang <code>05-02-Module-Boundary-Map</code> trong <code>docs</code> trên CT Work (và lưu tại <code>docs/architecture/modules.md</code>) liệt kê các module v1 của LabFlow, bảng dữ liệu mỗi module sở hữu, các hàm <code>Facade</code> công khai, các Domain Event phát ra và danh sách phụ thuộc một chiều (kiểm chắc 0 vòng tròn).'), t('Every one of the 15 LabFlow v1 tables belongs to exactly ONE module; zero circular arrows exist; every cross-module interaction specifies either a Facade call or an Event.', 'Mỗi bảng trong 15 bảng v1 của LabFlow thuộc quyền sở hữu của ĐÚNG MỘT module; không có mũi tên vòng tròn; mọi tương tác chéo module đều ghi rõ gọi Facade hay dùng Event.')],
  [t('Add a checklist item on your Chapter 6 CI card on CT Work (<strong>LF #2</strong>): "Add ArchUnit test blocking cross-module <code>internal</code> access and cycles before merging WF2 PRs."', 'Thêm một mục checklist vào thẻ dựng CI Chương 6 trên CT Work (<strong>LF #2</strong>): "Thêm bài test ArchUnit chặn truy cập chéo gói <code>internal</code> và chặn phụ thuộc vòng tròn trước khi merge PR WF2."'), t('Boundary enforcement is planned as an automated CI gate, not a manual hope.', 'Kiểm ranh giới được lên kế hoạch làm cổng CI tự động chứ không chỉ nhắc miệng.')]
], en)}

${thuatNgu([
  ['Package-by-Feature (Chia gói theo nghiệp vụ)', t('Organizing source code by business capability (e.g. <code>reservation/</code>, <code>loan/</code>) instead of technical layers (<code>controller/</code>, <code>service/</code>).', 'Tổ chức mã nguồn theo miền nghiệp vụ (vd <code>reservation/</code>, <code>loan/</code>) thay vì chia theo tầng kỹ thuật (<code>controller/</code>, <code>service/</code>).')],
  ['Module Facade (Cổng giao tiếp module)', t('A small public interface exposing only approved operations and immutable DTOs of a module while hiding its internal entities and repositories.', 'Interface công khai gọn nhẹ chỉ lộ các thao tác và DTO bất biến được phép của module, giấu toàn bộ entity và repository nội bộ.')],
  ['ArchUnit / Spring Modulith (Kiểm kiến trúc tự động)', t('Java testing libraries that inspect compiled bytecode in CI to automatically fail builds violating package boundaries or creating dependency cycles.', 'Thư viện test Java soi bytecode đã biên dịch ngay trên CI để tự đánh đỏ build khi có lớp vi phạm ranh giới package hoặc tạo vòng lặp phụ thuộc.')],
  ['DAG — Directed Acyclic Graph (Đồ thị có hướng không chu trình)', t('A dependency graph where arrows never loop back in a circle (no A → B → A).', 'Đồ thị phụ thuộc nơi các mũi tên không bao giờ khép thành vòng tròn (không có A → B → A).')],
  ['Transactional Outbox (Hộp thư đi trong giao dịch)', t('Pattern of saving an outgoing event/notification in an outbox table inside the same DB transaction, then delivering it asynchronously after commit.', 'Mẫu lưu sự kiện/thông báo vào bảng outbox trong cùng transaction CSDL rồi cho worker nền gửi bất đồng bộ sau khi commit.')]
], en)}

${tomTat([
  t('A Modular Monolith stays clean only through <strong>package-by-feature</strong> (<code>api/</code> vs <code>internal/</code>) and strict information hiding (Parnas, 1972).', 'Modular Monolith chỉ giữ được độ sạch nhờ <strong>package-by-feature</strong> (<code>api/</code> tách <code>internal/</code>) và nguyên lý che giấu thông tin (Parnas, 1972).'),
  t('Follow the <strong>5 Boundary Rules</strong>: Facade-only calls, no cross-module SQL JOINs, no cross-module <code>@Transactional</code>, Event/Outbox for side-effects, and module-owned Flyway migrations.', 'Giữ trọn <strong>5 Nguyên tắc Ranh giới</strong>: chỉ gọi Facade, không JOIN chéo, không <code>@Transactional</code> xuyên module, dùng Event/Outbox cho hệ quả và Flyway rạch ròi theo module.'),
  t('Enforce module boundaries automatically in CI with <strong>ArchUnit</strong> (or Spring Modulith) so architecture rules never decay under deadline pressure.', 'Khoá cứng ranh giới tự động trên CI bằng <strong>ArchUnit</strong> (hoặc Spring Modulith) để luật kiến trúc không bao giờ bị phá lúc chạy deadline.'),
  t('Clean facades also prevent accidental data leaks (OWASP API3) by stopping other modules from exposing raw database entities.', 'Facade sạch còn ngăn lộ dữ liệu ngoài ý muốn (OWASP API3) bằng cách chặn module khác trả thẳng entity CSDL ra ngoài.')
], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${dm('dm5-5-3-thiet-ke-csdl', t('5.3 — Database Design: ERD → Flyway, Normalization &amp; Anti-Double-Booking Constraints', '5.3 — Thiết kế CSDL: ERD → Flyway, chuẩn hoá &amp; ràng buộc chống đặt trùng'))}.</p>
`);
};

export default {
  title: '5.2 — Modular Monolith Done Right: 5 Boundary Rules, ArchUnit & Bridge to Microservices|||5.2 — Modular Monolith làm đúng: 5 nguyên tắc ranh giới, ArchUnit & cầu nối sang Microservices',
  slug: 'dm5-5-2-modular-monolith',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Biến Modular Monolith thành kiến trúc sạch thật sự (không phải khối bùn dán nhãn): nguyên lý che giấu thông tin Parnas (1972), package-by-feature (api vs internal), 5 Nguyên tắc Ranh giới để tách rẻ thành Microservices sau này, bản đồ phụ thuộc DAG của LabFlow, kiểm ranh giới tự động bằng ArchUnit trên CI, góc bảo mật chống lộ entity OWASP API3 và áp sang sàn TMĐT/SEP490/công ty lớn.',
  content: L52(true) + L52(false),
};
