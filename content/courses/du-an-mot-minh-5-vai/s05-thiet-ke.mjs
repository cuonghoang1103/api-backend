/**
 * Chương 5 — Thiết kế (mũ Dev lead / kiến trúc) (khoá "Đồ án một mình đóng 5 vai" — du-an-mot-minh-5-vai).
 * Gồm 7 bài kiến thức (5.1–5.7), 1 bài Lab thực hành trên CT Work LF #2 & repo (5.8, dm5-5-lab) và bài kiểm tra 12 câu (5.9, dm5-5-quiz).
 */
import { Q } from './_chung.mjs';
import B1 from './s05/b1-chon-kien-truc.mjs';
import B2 from './s05/b2-modular-monolith.mjs';
import B3 from './s05/b3-thiet-ke-csdl.mjs';
import B4 from './s05/b4-hop-dong-api-openapi.mjs';
import B5 from './s05/b5-thiet-ke-frontend.mjs';
import B6 from './s05/b6-sequence-state-diagram.mjs';
import B7 from './s05/b7-report4-sds-review.mjs';
import B8 from './s05/b8-lab.mjs';

const QUIZ5 = [
  Q('dm5-5-q1',
    'At your Final Defense, a committee member asks: "Why did you choose a Modular Monolith instead of Microservices for LabFlow AI?" Which response is strongest?|||Tại buổi Bảo vệ, một giám khảo hỏi: "Tại sao nhóm chọn Modular Monolith mà không làm Microservices cho LabFlow AI?" Câu trả lời nào thuyết phục nhất?',
    [
      '"Microservices are too hard for students so we skipped them."|||"Microservices khó quá đối với sinh viên nên nhóm bỏ qua ạ."',
      '"By Conway\'s Law, 1–5 devs in 10 weeks gain zero team-scaling payoff from microservices while paying high distributed-systems tax (Segment 2018; Prime Video\'s audio/video monitoring service, 2023). Our Modular Monolith keeps booking+audit+outbox in one ACID transaction, enforces strict module boundaries with ArchUnit (Shopify pattern), and preserves clean seams to extract v2 AI/IoT later."|||"Theo Luật Conway, 1–5 dev trong 10 tuần không hưởng lợi mở rộng tổ chức từ microservices mà phải trả thuế phân tán rất nặng (Segment 2018; dịch vụ giám sát audio/video của Prime Video 2023). Modular Monolith giữ booking+audit+outbox trong một transaction ACID, khoá ranh giới module bằng ArchUnit (kiểu Shopify) và để sẵn đường cắt tách riêng mảng AI/IoT ở v2 khi cần."',
      '"Monoliths never need module boundaries or architecture docs."|||"Monolith không cần ranh giới module hay tài liệu kiến trúc gì cả."',
      '"We didn\'t know Microservices existed until today."|||"Nhóm không biết Microservices tồn tại cho tới hôm nay ạ."'
    ],
    1,
    'A strong defense answer ties Conway\'s Law, real industry evidence (Segment 2018, Prime Video\'s monitoring service 2023, Shopify), ACID booking needs, ArchUnit enforcement, and a concrete extraction path together. Lesson 5.1.|||Câu trả lời bảo vệ thuyết phục kết nối Luật Conway, dẫn chứng thực tế (Segment 2018, dịch vụ giám sát của Prime Video 2023, Shopify), nhu cầu ACID lõi, kiểm ranh giới ArchUnit và lộ trình tách rõ ràng. Bài 5.1.'),

  Q('dm5-5-q2',
    'Why must an Architecture Decision Record (ADR) include an "Alternatives Considered &amp; Why Rejected" section?|||Vì sao một Architecture Decision Record (ADR) bắt buộc phải có mục "Các phương án đã cân nhắc &amp; Lý do bác bỏ"?',
    [
      'To pad the page count of Report 4 SDS|||Để kéo dài số trang cho Report 4 SDS',
      'To prove architectural trade-offs were weighed systematically, prevent future teammates from re-debating settled choices, and answer defense questions with documented evidence|||Để chứng minh mọi đánh đổi đã được cân nhắc bài bản, ngăn đồng đội sau này tranh cãi lại quyết định cũ và trả lời hội đồng bằng bằng chứng văn bản',
      'So you can delete the ADR file once coding starts|||Để xoá file ADR đi ngay khi bắt đầu code',
      'Because Git refuses to commit Markdown files without that heading|||Vì Git từ chối commit file Markdown nếu thiếu tiêu đề đó'
    ],
    1,
    'ADRs (Nygard, 2011) preserve architectural context and rejected alternatives so decisions remain auditable and never get blindly overturned. Lesson 5.1.|||ADR (Nygard, 2011) lưu giữ bối cảnh và các phương án bị bác để mọi quyết định đều kiểm chứng được và không bị lật lại vô căn cứ. Bài 5.1.'),

  Q('dm5-5-q3',
    'Which practice VIOLATES the 5 Modular Monolith Boundary Rules and secretly turns your app into a Big Ball of Mud?|||Thao tác nào dưới đây VI PHẠM 5 Nguyên tắc Ranh giới Modular Monolith và âm thầm biến ứng dụng thành khối bùn rối?',
    [
      '<code>reservation</code> calls <code>CatalogFacade.getActiveLab(labId)</code> returning an immutable DTO|||<code>reservation</code> gọi <code>CatalogFacade.getActiveLab(labId)</code> trả về DTO bất biến',
      '<code>ReservationService</code> directly injects <code>EquipmentRepository</code> from <code>catalog.internal</code> and wraps booking + waitlist promotion + SMTP email sending in ONE <code>@Transactional</code> method|||<code>ReservationService</code> tiêm thẳng <code>EquipmentRepository</code> từ <code>catalog.internal</code> và bọc đặt lịch + đôn waitlist + gửi email SMTP trong CÙNG MỘT hàm <code>@Transactional</code>',
      '<code>reservation</code> publishes <code>ReservationCancelledEvent</code> via Outbox/<code>@TransactionalEventListener(AFTER_COMMIT)</code>|||<code>reservation</code> phát <code>ReservationCancelledEvent</code> qua Outbox/<code>@TransactionalEventListener(AFTER_COMMIT)</code>',
      'Running an ArchUnit test in CI to block cycles and cross-module <code>internal</code> imports|||Chạy bài test ArchUnit trên CI để chặn phụ thuộc vòng tròn và chặn import chéo gói <code>internal</code>'
    ],
    1,
    'Directly injecting another module\'s internal repository and spanning one transaction across multiple modules + external SMTP violates Rules 1, 3, and 4. Lesson 5.2.|||Tiêm thẳng repository nội bộ của module khác và gộp nhiều module + SMTP ngoài vào một transaction phá vỡ Nguyên tắc 1, 3 và 4. Bài 5.2.'),

  Q('dm5-5-q4',
    'How do you guarantee automatically on every Pull Request that no teammate breaks your Modular Monolith package boundaries?|||Làm thế nào để tự động bảo đảm ở mọi Pull Request rằng không ai phá vỡ ranh giới package của Modular Monolith?',
    [
      'Write a polite reminder at the bottom of README.md and hope nobody forgets at 2 AM|||Viết lời nhắc lịch sự cuối tệp README.md và cầu mong lúc 2 giờ sáng không ai quên',
      'Add automated ArchUnit (or Spring Modulith) JUnit tests in CI that inspect compiled bytecode and fail the build on any illegal cross-module import or dependency cycle|||Thêm bài test ArchUnit (hoặc Spring Modulith) chạy trong CI để soi bytecode đã biên dịch và đánh đỏ build ngay khi có import chéo trái phép hoặc phụ thuộc vòng tròn',
      'Move all entities into a single <code>common/</code> package so every module can access everything|||Dồn toàn bộ entity vào một gói <code>common/</code> chung để module nào cũng truy cập được hết',
      'Check imports manually once in Week 10 right before defense|||Kiểm tra import bằng mắt một lần vào Tuần 10 sát ngày bảo vệ'
    ],
    1,
    'ArchUnit / Spring Modulith turns architectural rules into executable CI gates rather than ignored prose. Lesson 5.2.|||ArchUnit / Spring Modulith biến luật kiến trúc thành cổng kiểm tự động trên CI thay vì văn bản dễ bị quên. Bài 5.2.'),

  Q('dm5-5-q5',
    'Why is checking <code>if (!repo.existsOverlap(labId, start, end)) repo.save(...)</code> in Java NOT enough to stop double-booking (and what real-world bug class is this)?|||Vì sao viết <code>if (!repo.existsOverlap(labId, start, end)) repo.save(...)</code> trong Java KHÔNG đủ chặn đặt trùng (và đây là lớp lỗ hổng thực tế nào)?',
    [
      'Java does not support <code>if</code> statements inside <code>@Service</code> classes|||Java không hỗ trợ lệnh <code>if</code> trong lớp <code>@Service</code>',
      'It suffers from a TOCTOU race condition (like the 2015 Starbucks balance bug): two concurrent requests both pass <code>existsOverlap</code> before either commits; only a database-level constraint (PostgreSQL <code>EXCLUDE USING gist</code> on half-open <code>tstzrange</code>, or MySQL discrete <code>UNIQUE</code> slot) guarantees exactly 1 winner|||Nó dính lỗi đua thời gian TOCTOU (giống sự cố số dư Starbucks 2015): hai request song song cùng qua <code>existsOverlap</code> trước khi bên nào kịp commit; chỉ ràng buộc ngay trong CSDL (<code>EXCLUDE USING gist</code> trên <code>tstzrange</code> nửa mở ở PostgreSQL, hoặc <code>UNIQUE</code> slot rời rạc ở MySQL) mới bảo đảm đúng 1 người thắng',
      'H2 in-memory database already prevents all concurrency issues automatically|||CSDL H2 trong RAM tự động chặn hết mọi lỗi đồng thời rồi',
      'PostgreSQL cannot store timestamps with timezones|||PostgreSQL không lưu được thời gian kèm múi giờ'
    ],
    1,
    'TOCTOU check-then-act fails under concurrency; enforcing the exclusion constraint in PostgreSQL (and proving it with 50-thread Testcontainers tests) makes double-booking physically impossible. Lesson 5.3.|||Kiểm rồi mới ghi (TOCTOU) gãy khi chạy đồng thời; khoá bằng exclusion constraint ngay trong PostgreSQL (và chứng minh bằng test 50 luồng trên Testcontainers) làm đặt trùng trở thành bất khả thi. Bài 5.3.'),

  Q('dm5-5-q6',
    'On LabFlow AI, two Lab Managers open the exact same <code>PENDING_APPROVAL</code> reservation at 10:00 and click Approve and Reject 1 second apart. Which database/JPA mechanism prevents silent overwrites?|||Trên LabFlow AI, hai Lab Manager mở cùng một đơn <code>PENDING_APPROVAL</code> lúc 10:00 rồi bấm Duyệt và Từ chối cách nhau 1 giây. Cơ chế CSDL/JPA nào ngăn việc ghi đè âm thầm?',
    [
      'Optimistic locking via an integer <code>version</code> column (<code>@Version</code>) — the second Manager\'s request fails cleanly with HTTP <code>409 Conflict</code> (<code>SM-18</code>) instead of overwriting the first decision|||Khoá lạc quan bằng cột số nguyên <code>version</code> (<code>@Version</code>) — thao tác của Manager bấm sau bị chặn gọn bằng HTTP <code>409 Conflict</code> (<code>SM-18</code>) thay vì âm thầm ghi đè quyết định trước',
      'Hibernate <code>ddl-auto=update</code>|||Cấu hình Hibernate <code>ddl-auto=update</code>',
      'Disabling foreign keys on <code>reservations</code>|||Tắt khoá ngoại trên bảng <code>reservations</code>',
      'Storing dates as <code>VARCHAR</code> strings|||Lưu ngày tháng dưới dạng chuỗi <code>VARCHAR</code>'
    ],
    0,
    'Optimistic locking (<code>@Version</code>) protects concurrent edits on the same record, pairing with Exclusion Constraint (two users, same slot) and <code>idempotency_key</code> (one user double-clicking). Lesson 5.3.|||Khoá lạc quan (<code>@Version</code>) bảo vệ xung đột sửa cùng một bản ghi, bổ sung cho Exclusion Constraint (hai người đua cùng slot) và <code>idempotency_key</code> (một người bấm đúp). Bài 5.3.'),

  Q('dm5-5-q7',
    'What is the core benefit of Contract-First API Design (freezing <code>openapi.yaml</code> BEFORE coding), and which OWASP API vulnerability happens if <code>POST /api/v1/reservations</code> accepts <code>userId</code> and <code>status</code> directly in the request body?|||Lợi ích cốt lõi của Thiết kế Hợp đồng API trước (chốt <code>openapi.yaml</code> TRƯỚC khi code) là gì, và lỗ hổng OWASP API nào xảy ra nếu <code>POST /api/v1/reservations</code> nhận thẳng <code>userId</code> và <code>status</code> trong request body?',
    [
      'Zero benefit; accepting <code>userId</code> and <code>status</code> makes testing faster|||Không có lợi ích gì; nhận sẵn <code>userId</code> và <code>status</code> giúp test nhanh hơn',
      'BE and FE work in parallel (FE uses generated TS types + mock server while BE implements real controllers) with minimal integration drift; accepting body <code>userId</code>/<code>status</code> exposes critical OWASP API1 (BOLA/impersonation) and API3 (Mass Assignment) flaws|||BE và FE làm song song (FE dùng kiểu TS sinh tự động + mock server trong lúc BE dựng controller thật) mà không lệch ngày ghép nối; nhận <code>userId</code>/<code>status</code> từ body tạo lỗ hổng nghiêm trọng OWASP API1 (BOLA/giả danh) và API3 (Mass Assignment)',
      'OpenAPI replaces the need for PostgreSQL migrations|||OpenAPI thay thế hoàn toàn nhu cầu viết migration PostgreSQL',
      'Only GraphQL needs API contracts; REST never needs them|||Chỉ GraphQL mới cần hợp đồng API; REST không cần'
    ],
    1,
    'Contract-First unlocks parallel BE/FE work (avoiding Mars Climate Orbiter-style mismatches) and forces narrow Request DTOs where actor identity comes strictly from the verified JWT. Lesson 5.4.|||Contract-First cho phép BE/FE chạy song song (tránh lệch giao tiếp kiểu Mars Climate Orbiter) và ép dùng Request DTO gọn nơi danh tính người gọi lấy tuyệt đối từ JWT đã xác thực. Bài 5.4.'),

  Q('dm5-5-q8',
    'In a React + TypeScript Frontend Design (Lesson 5.5), where should (A) the fetched list of available labs and (B) search/filter/page query controls on screen <code>S20</code> live?|||Trong Thiết kế Frontend React + TypeScript (Bài 5.5), (A) danh sách phòng lab trống gọi từ API và (B) bộ lọc tìm kiếm/số trang trên màn <code>S20</code> nên đặt ở nhóm State nào?',
    [
      'Put both (A) and (B) inside a giant global Redux store copied via <code>useEffect</code>|||Đổ cả (A) và (B) vào một global Redux store khổng lồ chép qua <code>useEffect</code>',
      '(A) Server State in <strong>TanStack Query</strong> (<code>useQuery</code>) and (B) URL State in <strong>React Router</strong> (<code>useSearchParams</code>) so filters survive F5 refresh and Back navigation|||(A) Server State trong <strong>TanStack Query</strong> (<code>useQuery</code>) và (B) URL State trong <strong>React Router</strong> (<code>useSearchParams</code>) để bộ lọc sống qua F5 và nút Back',
      'Store both inside <code>localStorage</code> alongside the JWT refresh token|||Lưu cả hai vào <code>localStorage</code> chung chỗ với JWT refresh token',
      'Put everything into one <code>window.appState</code> global variable|||Đặt tất cả vào một biến toàn cục <code>window.appState</code>'
    ],
    1,
    'Separating Server State (TanStack Query) from URL State (React Router search params) eliminates manual fetch race conditions and keeps filtered views refreshable and shareable. Lesson 5.5.|||Tách Server State (TanStack Query) khỏi URL State (React Router search params) xoá bỏ lỗi đua fetch tay và giữ bộ lọc không mất khi F5 hay chia sẻ link. Bài 5.5.'),

  Q('dm5-5-q9',
    'Your React app already renders <code>&lt;ProtectedRoute allowedRoles={[\'ADMIN\']} /&gt;</code> around <code>/admin/settings</code> and stores the refresh token in <code>localStorage</code>. What two frontend security mistakes exist here?|||Ứng dụng React của bạn đã bọc <code>&lt;ProtectedRoute allowedRoles={[\'ADMIN\']} /&gt;</code> quanh <code>/admin/settings</code> và lưu refresh token trong <code>localStorage</code>. Có hai lỗi bảo mật frontend nào ở đây?',
    [
      'No mistakes — React Router + <code>localStorage</code> is the gold standard|||Không có lỗi nào — React Router + <code>localStorage</code> là chuẩn vàng rồi',
      '(1) Storing a long-lived refresh token in <code>localStorage</code> lets any XSS snippet steal the session in 1 line (use <code>HttpOnly; Secure; SameSite</code> cookies instead), and (2) treating <code>ProtectedRoute</code> as security rather than UX — Backend <code>@PreAuthorize</code> MUST enforce real access control|||(1) Lưu refresh token dài hạn trong <code>localStorage</code> khiến chỉ 1 dòng XSS cũng đánh cắp phiên ngay (phải dùng cookie <code>HttpOnly; Secure; SameSite</code>), và (2) nhầm <code>ProtectedRoute</code> là chốt bảo mật thay vì UX — Backend <code>@PreAuthorize</code> PHẢI chặn thật',
      'You should use <code>dangerouslySetInnerHTML</code> to encrypt the token|||Bạn nên dùng <code>dangerouslySetInnerHTML</code> để mã hoá token',
      'Only Admin pages need Error Boundaries|||Chỉ trang Admin mới cần Error Boundary'
    ],
    1,
    'Prevent XSS token theft via HttpOnly refresh cookies + zero unsafe HTML injection, and always back UX Route Guards with real Backend authorization. Lesson 5.5.|||Chặn mất token qua XSS bằng cookie HttpOnly + cấm chèn HTML không an toàn, và luôn có phân quyền Backend thật phía sau Route Guard. Bài 5.5.'),

  Q('dm5-5-q10',
    'Which statement about Sequence Diagrams &amp; State Machines in Report 4 SDS is TRUE?|||Nhận định nào sau đây về Sequence Diagram &amp; State Machine trong Report 4 SDS là ĐÚNG?',
    [
      'Draw Sequence Diagrams only for the happy path and skip 409/403 branches so the diagram looks clean|||Chỉ vẽ Sequence Diagram cho đường đẹp và bỏ qua nhánh 409/403 cho hình đỡ rối',
      'Store diagrams as PlantUML text in Git (<code>docs/diagrams/sds/*.puml</code>), keep names 100% synced with code, expose <code>@Transactional</code>/<code>Outbox</code>/<code>alt</code> failure branches, and enforce legal state transitions inside Backend domain methods (never open <code>setStatus()</code>)|||Lưu sơ đồ dạng văn bản PlantUML trong Git (<code>docs/diagrams/sds/*.puml</code>), giữ tên khớp 100% code, lộ rõ <code>@Transactional</code>/<code>Outbox</code>/nhánh lỗi <code>alt</code>, và thực thi chuyển trạng thái hợp lệ ngay trong phương thức miền Backend (không mở <code>setStatus()</code> tự do)',
      'Sending SMTP emails directly inside a <code>@Transactional</code> booking method is best practice|||Gửi email SMTP trực tiếp bên trong hàm <code>@Transactional</code> đặt lịch là cách làm chuẩn nhất',
      'Draw all 25 diagrams in Week 20 from memory without checking the code|||Để tới Tuần 20 ngồi nhớ lại rồi vẽ cả 25 sơ đồ không cần đối chiếu code'
    ],
    1,
    'Versioned PlantUML diagrams showing transactions, outbox, and failure branches — paired with Backend State Machines — prevent Therac-25 (1985–87; Leveson &amp; Turner 1993) concurrency bugs, OWASP A04 state-skipping, and diagram–code drift. Lesson 5.6.|||PlantUML quản lý phiên bản lộ rõ transaction, outbox và nhánh lỗi — đi kèm State Machine ở Backend — ngăn lỗi đồng thời kiểu Therac-25 (1985–87; Leveson &amp; Turner 1993), lỗi nhảy cóc OWASP A04 và lệch sơ đồ–code. Bài 5.6.'),

  Q('dm5-5-q11',
    'What is the #1 Report 4 SDS error lecturers catch most often in SEP490/SWP391 (and how does your <code>RTM</code> sheet stop it automatically)?|||Lỗi Report 4 SDS số 1 mà giảng viên hay bắt nhất ở SEP490/SWP391 là gì (và sheet <code>RTM</code> chặn nó tự động bằng cách nào)?',
    [
      'Using Consolas font for SQL blocks|||Dùng phông chữ Consolas cho các đoạn SQL',
      'Missing Class + Sequence Diagrams for coded functions (or diagram–code mismatch); filtering your <code>RTM</code> sheet via <code>COUNTIFS</code> flags any <code>Coded</code> row with a blank <code>SDS §</code> cell before Package submission|||Thiếu Class + Sequence Diagram cho từng function đã code (hoặc sơ đồ lệch code); lọc sheet <code>RTM</code> bằng công thức <code>COUNTIFS</code> sẽ báo đỏ ngay mọi dòng đã <code>Coded</code> nhưng trống ô <code>SDS §</code> trước khi nộp Package',
      'Renaming §3 Class Specifications groups from .NET (<code>DbContext</code>/<code>Hubs</code>) to Spring Boot (<code>Repositories</code>/<code>Services</code>)|||Đổi tên nhóm mục §3 Đặc tả lớp từ .NET (<code>DbContext</code>/<code>Hubs</code>) sang Spring Boot (<code>Repositories</code>/<code>Services</code>)',
      'Adding a 3-sentence design commentary under each Sequence Diagram|||Viết đoạn bình luận thiết kế 3 câu ngay dưới mỗi Sequence Diagram'
    ],
    1,
    'Every coded function MUST have a matching Class + Sequence Diagram in SDS §2.x; RTM <code>COUNTIFS</code> catches omissions before submission. Lesson 5.7.|||Mọi function đã code PHẢI có Class + Sequence Diagram khớp tên trong SDS §2.x; công thức <code>COUNTIFS</code> trên RTM bắt sót trước khi nộp. Bài 5.7.'),

  Q('dm5-5-q12',
    'You just finished your Report 4 SDS draft at 22:00 under hats C3 + C4. Under the Solo Cross-Hat Design Review Protocol, what MUST happen before you sign off Design Freeze and begin Chapter 6 coding?|||Bạn vừa viết xong bản nháp Report 4 SDS lúc 22:00 dưới mũ C3 + C4. Theo Quy trình Design Review chéo Solo, điều gì BẮT BUỘC diễn ra trước khi ký Chốt Thiết kế và sang lập trình Chương 6?',
    [
      'Immediately approve your own SDS at 22:05 under C3 and start coding right away|||Tự duyệt SDS ngay lúc 22:05 dưới mũ C3 rồi nhảy vào code luôn',
      'Take a cooling-off break (≥ 2h or overnight), switch hats in CT Work <code>reviews</code> (C4/C3 cross-check + C5 QA/6-letter STRIDE security check + C1 PM/RTM check) using the 10-Point Design Review Checklist, resolve all Major defects, and record C1 sign-off|||Nghỉ để đầu óc nguội (≥ 2 giờ hoặc qua đêm), đổi mũ trên trang <code>reviews</code> CT Work (C4/C3 soi chéo + C5 QA/soi đủ 6 chữ STRIDE + C1 PM/RTM) theo Checklist Design Review 10 điểm, sửa sạch mọi lỗi Major và lưu xác nhận ký chốt của C1',
      'Ask AI to generate the entire Spring Boot backend without reviewing the design|||Nhờ AI sinh luôn toàn bộ backend Spring Boot mà khỏi cần review thiết kế',
      'Delete Section 4.5 (PDF Generation) completely even if the template requires keeping the heading|||Xoá luôn tiêu đề Mục 4.5 (Xuất PDF) dù mẫu yêu cầu giữ tiêu đề'
    ],
    1,
    'Cooling-off breaks author blindness; cross-hat review with the 10-Point Checklist + 6-letter STRIDE check catches concurrency, contract, and security flaws when fixes still cost minutes instead of days. Lesson 5.7.|||Nghỉ để đầu óc nguội phá chứng mù tác giả; review chéo bằng Checklist 10 điểm + soi đủ 6 chữ STRIDE bắt gọn lỗi đồng thời, hợp đồng và bảo mật lúc sửa mới tốn vài phút thay vì vài ngày. Bài 5.7.')
];

export default {
  title: 'Chapter 5 — System Design (Dev Lead / Architect Hat)|||Chương 5 — Thiết kế (mũ Dev lead / kiến trúc)',
  description: 'Trọn bộ quy trình Thiết kế Hệ thống chuẩn doanh nghiệp và SEP490/SWP391 dưới mũ Dev Lead / Kiến trúc sư (C3 BE + C4 FE + C1/C5 review): Chọn kiến trúc có lập luận (Monolith thường · Modular Monolith · Microservices, Luật Conway 1968, dẫn chứng Segment 2018 / dịch vụ giám sát audio/video Amazon Prime Video 2023 / Shopify 2019 & viết ADR); Modular Monolith làm đúng với 5 Nguyên tắc Ranh giới, package-by-feature & kiểm tự động ArchUnit; Thiết kế CSDL vật lý ERD → Flyway, bảng 7 cột SDS §1.3 & 3 lá chắn chống đặt trùng (PostgreSQL EXCLUDE USING gist + idempotency_key + @Version, bài học TOCTOU Starbucks 2015); Hợp đồng API OpenAPI 3.1 trước khi code để BE & FE chạy song song (bài học Mars Climate Orbiter 1999, OWASP API1 BOLA & API3); Thiết kế Frontend React+TS với Cây Component, 4 nhóm State, Route Guard & bảo mật frontend (chống script lạ, XSS & lưu token an toàn); Sequence & State Diagram bằng PlantUML trong Git (bài học Therac-25 1985–87; Leveson & Turner 1993, OWASP A04); Report 4 SDS tăng dần v1.0–v1.3 & Design Review chéo 10 điểm + 6 chữ STRIDE (bài học Healthcare.gov 2013); Lab trọn gói 120 phút làm việc thực trên CT Work LF #2 và Kiểm tra 12 câu.',
  lessons: [
    B1,
    B2,
    B3,
    B4,
    B5,
    B6,
    B7,
    B8,
    {
      title: '5.9 — Chapter 5 Quiz|||5.9 — Kiểm tra Chương 5',
      slug: 'dm5-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười hai câu hỏi tình huống bao trọn Chương 5: bảo vệ lựa chọn Modular Monolith theo Luật Conway & dẫn chứng thật, vai trò của ADR, 5 Nguyên tắc Ranh giới & ArchUnit, lỗi TOCTOU & PostgreSQL Exclusion Constraint + @Version, Contract-First OpenAPI & BOLA/Mass Assignment, phân loại 4 nhóm State React & bảo mật cookie HttpOnly/Route Guard, PlantUML Sequence/State Machine chặn nhảy cóc, bẫy số 1 của Report 4 SDS + RTM COUNTIFS và Quy trình Design Review chéo sau khi nghỉ để đầu óc nguội.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Quiz</span>
<h2>5.9 — Check your mastery of System Design (Dev Lead / Architect Hat)</h2>
<p class="lead">Twelve scenario-based questions covering Lessons 5.1–5.8. Aim for at least 10/12 before moving to Chapter 6 (Engineering Foundation, Git Flow, CI, Docker &amp; Self Code Review). Every explanation links directly to the lesson to revisit.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Kiểm tra</span>
<h2>5.9 — Kiểm tra độ nắm vững Thiết kế Hệ thống (mũ Dev lead / kiến trúc)</h2>
<p class="lead">Mười hai câu hỏi tình huống bao trọn Bài 5.1–5.8. Hãy đặt mục tiêu đạt tối thiểu 10/12 trước khi bước sang Chương 6 (Nền kỹ thuật, Git Flow, CI, Docker &amp; Tự Review Code). Mỗi lời giải đều chỉ rõ bài cần đọc lại.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ5 },
    },
  ],
};
