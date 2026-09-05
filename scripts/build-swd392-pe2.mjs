/**
 * build-swd392-pe2.mjs — sinh content/exams/SWD392-PE2.mjs.
 *
 * Nguồn thật: "SWD392 - PE3 - SP26" ("Practical Exam: SWD392 – SP26"),
 * hệ thống quản lý sự kiện đại học "Event Management System (EMS)".
 * material_0.zip chỉ chứa 1 file .docx là KHUNG TRẢ LỜI TRỐNG (mẫu nộp
 * bài, không phải solution) — đã kiểm bằng cách trích text XML, xác
 * nhận trống ("Your Class Diagram: ... Brief Explanation: ...").
 * Không có solution thật.
 *
 * Đề yêu cầu chọn nhất quán Layered Architecture HOẶC Microservices +
 * Repository Pattern bắt buộc — đã chọn Layered Architecture (đơn giản
 * hơn để trình bày nhất quán qua cả 3 sơ đồ). Sơ đồ vẽ bằng Mermaid
 * (được ExamRichContent.tsx hỗ trợ sẵn qua pre.mermaid) thay cho
 * Draw.io/Visio như đề gốc yêu cầu.
 *
 * Điểm gốc: Q1=3.0 (Class Diagram), Q2=4.0 (Sequence Diagram, có alt
 * lồng nhau cho event open/closed VÀ capacity available/full), Q3=3.0
 * (State Diagram vòng đời Event, ≥6 transition có tên sự kiện rõ).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/SWD392-PE2.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/SWD392-PE2.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;
const MMD = (src) => `<pre class="mermaid">${src}</pre>`;

const projectContext = B(
  `<div class="pe-system"><b>Business Overview:</b><p>FPT University regularly hosts a range of academic and extracurricular activities, including seminars, workshops, technology talks, student competitions, and orientation programs. To support event planning and execution, an <b>Event Management System (EMS)</b> has been developed. Through this system, organizers can create and manage events, register participants, assign staff members, and track event status.</p>
   <p>Students and lecturers may register to attend events, while event organizers and administrators are responsible for approving events, managing registrations, and monitoring event execution. Each event has a defined schedule, location, and capacity. The system automatically tracks participant registration status and updates event states throughout its lifecycle.</p>
   <p>Students may choose either Layered Architecture or Microservices Architecture, but the chosen architecture must be applied consistently throughout all diagrams — the <b>Repository Pattern is mandatory</b>. These sample answers use <b>Layered Architecture</b> (Presentation → Service → Repository → Domain).</p></div>`,
  `<div class="pe-system"><b>Tổng quan nghiệp vụ:</b><p>FPT University thường xuyên tổ chức nhiều hoạt động học thuật và ngoại khóa: hội thảo, workshop, tech talk, cuộc thi sinh viên, chương trình định hướng. Để hỗ trợ lên kế hoạch và thực thi sự kiện, hệ thống <b>Event Management System (EMS)</b> đã được phát triển. Qua đó, ban tổ chức tạo/quản lý sự kiện, đăng ký người tham dự, phân công nhân sự, theo dõi trạng thái sự kiện.</p>
   <p>Sinh viên và giảng viên có thể đăng ký tham dự sự kiện, còn ban tổ chức và quản trị viên chịu trách nhiệm duyệt sự kiện, quản lý đăng ký, giám sát thực thi sự kiện. Mỗi sự kiện có lịch, địa điểm, sức chứa xác định. Hệ thống tự động theo dõi trạng thái đăng ký người tham dự và cập nhật trạng thái sự kiện xuyên suốt vòng đời.</p>
   <p>Sinh viên chọn nhất quán Layered Architecture hoặc Microservices Architecture cho mọi sơ đồ — <b>Repository Pattern bắt buộc</b>. Các câu trả lời mẫu dưới đây dùng <b>Layered Architecture</b> (Presentation → Service → Repository → Domain).</p></div>`,
);

const instructions = ML(
  `<p><strong>SWD392 – Practical Exam (Spring 2026) — Event Management System (EMS)</strong>. Duration 85 minutes in the original paper. Students are not required to write source code — all answers are UML diagrams. The original paper asks for offline UML tools (Visio/Draw.io) — here, diagrams are rendered as Mermaid directly in the exam viewer. Each answer is graded by an AI grader against the rubric shown per question.</p>` + projectContext,
  `<p><strong>SWD392 – Thi thực hành (Spring 2026) — Event Management System (EMS)</strong>. Đề gốc 85 phút. Không cần viết mã nguồn — mọi câu trả lời là sơ đồ UML. Đề gốc yêu cầu công cụ UML offline (Visio/Draw.io) — ở đây sơ đồ hiển thị dạng Mermaid trực tiếp trong trình xem đề. Mỗi câu trả lời được AI chấm theo tiêu chí ghi ở từng câu.</p>` + projectContext,
);

const q1 = {
  kind: 'WRITE', points: 3,
  prompt: B(
    `<p><strong>Question 1 (3.0 points) – Class Diagram:</strong> design a design-level Class Diagram for the University Event Management System EMS. Requirements: User is a base class; Student, Lecturer, Organizer, and Admin are specialized types of User using inheritance; an Event represents a university-organized activity; a Registration represents a user's participation in an event; a user can register for multiple events; each event can have multiple registrations but has a limited capacity; each event has a status (Planned, OpenForRegistration, Ongoing, Completed, Cancelled); business logic is handled by service classes; repository classes must implement a generic Repository interface; the service layer depends on repository classes for data access. The following UML relationships must be shown clearly: inheritance and interface implementation; association, aggregation, and composition where appropriate; dependency relationships between service and repository layers; clearly defined attributes, methods, and multiplicities.</p>`,
    `<p><strong>Câu 1 (3.0 điểm) – Class Diagram:</strong> thiết kế Class Diagram mức thiết kế cho hệ thống Event Management System EMS của trường đại học. Yêu cầu: User là lớp gốc; Student, Lecturer, Organizer, Admin là các loại User chuyên biệt hoá dùng kế thừa; Event đại diện 1 hoạt động do trường tổ chức; Registration đại diện việc 1 người dùng tham gia 1 sự kiện; 1 người dùng có thể đăng ký nhiều sự kiện; mỗi sự kiện có thể có nhiều đăng ký nhưng có sức chứa giới hạn; mỗi sự kiện có trạng thái (Planned, OpenForRegistration, Ongoing, Completed, Cancelled); logic nghiệp vụ do lớp service xử lý; lớp repository phải triển khai 1 interface Repository generic; tầng service phụ thuộc lớp repository để truy cập dữ liệu. Các quan hệ UML sau phải thể hiện rõ: kế thừa và triển khai interface; association, aggregation, composition khi phù hợp; quan hệ dependency giữa tầng service và repository; thuộc tính, phương thức, multiplicity rõ ràng.</p>`,
  ),
  sampleSolution: B(
    MMD(`classDiagram
    class User {
        <<abstract>>
        #userId : int
        #name : string
        #email : string
        #passwordHash : string
        +getProfile() UserProfile
    }
    class Student {
        -studentCode : string
    }
    class Lecturer {
        -department : string
    }
    class Organizer {
        -organizerTitle : string
    }
    class Admin {
        +approveEvent(eventId) void
        +rejectEvent(eventId) void
    }
    class Event {
        -eventId : int
        -title : string
        -description : string
        -schedule : DateTime
        -location : string
        -capacity : int
        -status : EventStatus
        +isFull() bool
        +isOpenForRegistration() bool
    }
    class Registration {
        -registrationId : int
        -registrationDate : DateTime
        -status : RegistrationStatus
    }
    class IRepository~T~ {
        <<interface>>
        +findById(id int) T
        +findAll() List~T~
        +save(entity T) void
        +delete(id int) void
    }
    class EventRepository {
        +findById(id int) Event
        +findAll() List~Event~
        +save(entity Event) void
        +delete(id int) void
    }
    class RegistrationRepository {
        +findById(id int) Registration
        +findAll() List~Registration~
        +save(entity Registration) void
        +delete(id int) void
    }
    class EventService {
        -eventRepository : IRepository~Event~
        -registrationRepository : IRepository~Registration~
        +createEvent(organizer Organizer, details EventDetails) Event
        +approveEvent(eventId int) void
        +openRegistration(eventId int) void
    }
    class RegistrationService {
        -registrationRepository : IRepository~Registration~
        -eventRepository : IRepository~Event~
        +registerForEvent(user User, eventId int) Registration
    }

    User <|-- Student
    User <|-- Lecturer
    User <|-- Organizer
    User <|-- Admin
    Organizer "1" --> "*" Event : creates
    User "1" --> "*" Registration : submits
    Event "1" *-- "*" Registration : has
    IRepository <|.. EventRepository
    IRepository <|.. RegistrationRepository
    EventService ..> IRepository : depends on
    RegistrationService ..> IRepository : depends on`),
    MMD(`classDiagram
    class User {
        <<abstract>>
        #userId : int
        #name : string
        #email : string
        #passwordHash : string
        +getProfile() UserProfile
    }
    class Student {
        -studentCode : string
    }
    class Lecturer {
        -department : string
    }
    class Organizer {
        -organizerTitle : string
    }
    class Admin {
        +approveEvent(eventId) void
        +rejectEvent(eventId) void
    }
    class Event {
        -eventId : int
        -title : string
        -description : string
        -schedule : DateTime
        -location : string
        -capacity : int
        -status : EventStatus
        +isFull() bool
        +isOpenForRegistration() bool
    }
    class Registration {
        -registrationId : int
        -registrationDate : DateTime
        -status : RegistrationStatus
    }
    class IRepository~T~ {
        <<interface>>
        +findById(id int) T
        +findAll() List~T~
        +save(entity T) void
        +delete(id int) void
    }
    class EventRepository {
        +findById(id int) Event
        +findAll() List~Event~
        +save(entity Event) void
        +delete(id int) void
    }
    class RegistrationRepository {
        +findById(id int) Registration
        +findAll() List~Registration~
        +save(entity Registration) void
        +delete(id int) void
    }
    class EventService {
        -eventRepository : IRepository~Event~
        -registrationRepository : IRepository~Registration~
        +createEvent(organizer Organizer, details EventDetails) Event
        +approveEvent(eventId int) void
        +openRegistration(eventId int) void
    }
    class RegistrationService {
        -registrationRepository : IRepository~Registration~
        -eventRepository : IRepository~Event~
        +registerForEvent(user User, eventId int) Registration
    }

    User <|-- Student
    User <|-- Lecturer
    User <|-- Organizer
    User <|-- Admin
    Organizer "1" --> "*" Event : tạo
    User "1" --> "*" Registration : nộp
    Event "1" *-- "*" Registration : có
    IRepository <|.. EventRepository
    IRepository <|.. RegistrationRepository
    EventService ..> IRepository : phụ thuộc
    RegistrationService ..> IRepository : phụ thuộc`) +
    `<p><strong>Brief explanation:</strong> User is an abstract base class specialized by Student/Lecturer/Organizer/Admin (inheritance). Composition (Event <code>*--</code> Registration) reflects that a Registration cannot exist independently of its Event — deleting the Event removes its registrations. EventRepository and RegistrationRepository both implement the same generic <code>IRepository&lt;T&gt;</code> interface (Repository Pattern, mandatory per the assignment), each bound to a specific entity type (T=Event, T=Registration respectively). EventService and RegistrationService depend on the repository interfaces (not concrete repository classes) for data access, keeping the service layer decoupled from persistence details.</p>`,
    `<p><strong>Giải thích ngắn:</strong> User là lớp gốc trừu tượng, chuyên biệt hoá bởi Student/Lecturer/Organizer/Admin (kế thừa). Composition (Event <code>*--</code> Registration) phản ánh Registration không thể tồn tại độc lập với Event của nó — xoá Event thì xoá luôn các đăng ký. EventRepository và RegistrationRepository đều triển khai cùng interface generic <code>IRepository&lt;T&gt;</code> (Repository Pattern, bắt buộc theo đề), mỗi cái gắn với 1 kiểu thực thể cụ thể (T=Event, T=Registration tương ứng). EventService và RegistrationService phụ thuộc interface repository (không phải lớp repository cụ thể) để truy cập dữ liệu, giữ tầng service tách biệt khỏi chi tiết lưu trữ.</p>`,
  ),
  explanation: B(
    `<p>No source solution existed (the exam material contains only a blank answer-sheet template). Designed from the requirement checklist directly.</p>`,
    `<p>Đề không có solution nguồn (tài liệu đính kèm chỉ là khung trả lời trống). Thiết kế trực tiếp từ danh sách yêu cầu.</p>`,
  ),
  rubric: [
    { id: 'inheritance_hierarchy', criterion: B('User is a base class specialized by Student, Lecturer, Organizer, and Admin via inheritance.', 'User là lớp gốc, chuyên biệt hoá bởi Student, Lecturer, Organizer, Admin qua kế thừa.'), weight: 1, maxScore: 0.5 },
    { id: 'entities_and_multiplicity', criterion: B('Event and Registration are modeled with correct attributes and correct multiplicities (a user can register for many events; an event can have many registrations but a limited capacity attribute).', 'Event và Registration mô hình đúng thuộc tính và multiplicity đúng (1 người dùng đăng ký nhiều sự kiện; 1 sự kiện có nhiều đăng ký nhưng có thuộc tính sức chứa giới hạn).'), weight: 1, maxScore: 0.6 },
    { id: 'repository_pattern', criterion: B('Repository classes implement a generic Repository interface (interface realization), consistent with the mandatory Repository Pattern.', 'Lớp repository triển khai interface Repository generic (interface realization), đúng Repository Pattern bắt buộc.'), weight: 1, maxScore: 0.6 },
    { id: 'service_depends_on_repo', criterion: B('Service classes show a dependency relationship on repository (interfaces), not a direct concrete coupling, and handle the business logic (event creation, registration, management).', 'Lớp service thể hiện quan hệ dependency với repository (interface), không gắn cứng cụ thể, và xử lý logic nghiệp vụ (tạo sự kiện, đăng ký, quản lý).'), weight: 1, maxScore: 0.7 },
    { id: 'relationship_variety', criterion: B('Shows a genuine variety of relationships (inheritance, interface realization, association/aggregation/composition, dependency) rather than only one type used everywhere.', 'Thể hiện đa dạng thật các loại quan hệ (kế thừa, interface realization, association/aggregation/composition, dependency), không chỉ dùng 1 loại cho mọi chỗ.'), weight: 1, maxScore: 0.6 },
  ],
};

const q2 = {
  kind: 'WRITE', points: 4,
  prompt: B(
    `<p><strong>Question 2 (4.0 points) – Sequence Diagram (Use Case: Register for Event):</strong> the process starts when the user selects an event and submits a registration request. The system then checks whether the event is open for registration and whether capacity is still available. If the registration conditions are satisfied, the system creates a registration record and confirms participation; otherwise, the registration is rejected. Requirements: follow the same architecture consistently (Layered, in these sample answers); the interaction flow must clearly include a user-facing component (UI/boundary, e.g., Student Portal), a controller/service component handling business logic, repository components responsible for data access, and domain entities such as Event and Registration; Repository Pattern usage must be explicit through repository method calls; conditional behavior must be modeled using alt fragments for (1) event open or closed, and (2) event capacity available or full.</p>`,
    `<p><strong>Câu 2 (4.0 điểm) – Sequence Diagram (Use case: Đăng ký sự kiện):</strong> quy trình bắt đầu khi người dùng chọn sự kiện và gửi yêu cầu đăng ký. Hệ thống kiểm tra sự kiện có đang mở đăng ký không và còn sức chứa không. Nếu đủ điều kiện, hệ thống tạo bản ghi đăng ký và xác nhận tham gia; ngược lại đăng ký bị từ chối. Yêu cầu: theo cùng kiến trúc nhất quán (Layered, trong câu trả lời mẫu này); luồng tương tác phải có rõ: component giao diện người dùng (UI/boundary, VD Student Portal), component controller/service xử lý logic nghiệp vụ, component repository chịu trách nhiệm truy cập dữ liệu, thực thể miền như Event và Registration; cách dùng Repository Pattern phải tường minh qua lời gọi phương thức repository; hành vi điều kiện phải mô hình bằng alt fragment cho (1) sự kiện mở hay đóng, và (2) sức chứa còn hay đầy.</p>`,
  ),
  sampleSolution: B(
    MMD(`sequenceDiagram
    actor Student
    participant Portal as StudentPortal
    participant Svc as RegistrationService
    participant EventRepo as EventRepository
    participant RegRepo as RegistrationRepository

    Student->>Portal: Select event & submit registration
    Portal->>Svc: registerForEvent(studentId, eventId)
    Svc->>EventRepo: findById(eventId)
    EventRepo-->>Svc: event

    alt event.status == OpenForRegistration
        alt event.registrationCount < event.capacity
            Svc->>RegRepo: save(new Registration(studentId, eventId))
            RegRepo-->>Svc: registration
            Svc-->>Portal: registration confirmed
            Portal-->>Student: Show confirmation
        else capacity full
            Svc-->>Portal: registration rejected (event full)
            Portal-->>Student: Show "event full" message
        end
    else event not open (Draft/Approved/Ongoing/Completed/Cancelled)
        Svc-->>Portal: registration rejected (event closed)
        Portal-->>Student: Show "event closed" message
    end`),
    MMD(`sequenceDiagram
    actor Student
    participant Portal as StudentPortal
    participant Svc as RegistrationService
    participant EventRepo as EventRepository
    participant RegRepo as RegistrationRepository

    Student->>Portal: Chọn sự kiện & gửi đăng ký
    Portal->>Svc: registerForEvent(studentId, eventId)
    Svc->>EventRepo: findById(eventId)
    EventRepo-->>Svc: event

    alt event.status == OpenForRegistration
        alt event.registrationCount < event.capacity
            Svc->>RegRepo: save(new Registration(studentId, eventId))
            RegRepo-->>Svc: registration
            Svc-->>Portal: đăng ký xác nhận
            Portal-->>Student: Hiện xác nhận
        else hết sức chứa
            Svc-->>Portal: đăng ký bị từ chối (sự kiện đầy)
            Portal-->>Student: Hiện thông báo "sự kiện đầy"
        end
    else sự kiện chưa/không mở (Draft/Approved/Ongoing/Completed/Cancelled)
        Svc-->>Portal: đăng ký bị từ chối (sự kiện đã đóng)
        Portal-->>Student: Hiện thông báo "sự kiện đã đóng"
    end`),
  ),
  explanation: B(
    `<p>No source solution existed. The two required alt fragments are nested (event-open check wraps the capacity check) because capacity only matters once the event is confirmed open — checking capacity first would be logically backwards (a closed event's capacity is irrelevant).</p>`,
    `<p>Đề không có solution nguồn. Hai alt fragment yêu cầu được lồng nhau (kiểm tra mở sự kiện bọc ngoài kiểm tra sức chứa) vì sức chứa chỉ có ý nghĩa khi sự kiện đã xác nhận đang mở — kiểm tra sức chứa trước sẽ ngược logic (sự kiện đã đóng thì sức chứa không còn ý nghĩa).</p>`,
  ),
  rubric: [
    { id: 'four_layer_participants', criterion: B('Includes all 4 required participant types: a UI/boundary component, a service component, a repository component, and domain entities referenced in the flow (Event, Registration).', 'Có đủ 4 loại tham gia yêu cầu: component UI/boundary, component service, component repository, và thực thể miền xuất hiện trong luồng (Event, Registration).'), weight: 1, maxScore: 0.8 },
    { id: 'repository_calls_explicit', criterion: B('Repository Pattern usage is explicit — the service calls repository methods (e.g., findById, save) rather than accessing data directly.', 'Dùng Repository Pattern tường minh — service gọi phương thức repository (findById, save) thay vì truy cập dữ liệu trực tiếp.'), weight: 1, maxScore: 0.8 },
    { id: 'nested_alt_fragments', criterion: B('Both required alt fragments are present (event open/closed, capacity available/full), correctly nested so capacity is only checked once the event is confirmed open.', 'Có đủ 2 alt fragment yêu cầu (sự kiện mở/đóng, sức chứa còn/đầy), lồng đúng để sức chứa chỉ kiểm khi sự kiện đã xác nhận mở.'), weight: 1, maxScore: 1.2 },
    { id: 'success_and_failure_paths', criterion: B('Shows a coherent success path (registration created and confirmed) and both failure paths (event closed, capacity full) with an appropriate response to the student in each case.', 'Thể hiện luồng thành công mạch lạc (tạo và xác nhận đăng ký) và cả 2 luồng thất bại (sự kiện đóng, hết sức chứa) với phản hồi phù hợp cho sinh viên mỗi trường hợp.'), weight: 1, maxScore: 1.2 },
  ],
};

const q3 = {
  kind: 'WRITE', points: 3,
  prompt: B(
    `<p><strong>Question 3 (3.0 points) – State Diagram (Target: Event Lifecycle Management):</strong> design a State Diagram for the Event entity describing its complete lifecycle. Requirements: a clearly defined initial state and final state; include at least these states (names may vary, meaning must be preserved): Draft (created but not yet published), Approved (approved by an administrator), OpenForRegistration (participants can register), Full (maximum capacity reached), Ongoing (currently taking place), Completed (ended successfully); include an alternative termination state such as Cancelled or Rejected; at least six state transitions, each with a clear triggering event, such as submitEvent, approveEvent, openRegistration, registerParticipant, startEvent, finishEvent, cancelEvent; at least one branching path must represent event cancellation or rejection.</p>`,
    `<p><strong>Câu 3 (3.0 điểm) – State Diagram (Mục tiêu: Quản lý vòng đời Event):</strong> thiết kế State Diagram cho thực thể Event mô tả đầy đủ vòng đời. Yêu cầu: có trạng thái khởi đầu và kết thúc rõ ràng; gồm ít nhất các trạng thái (tên có thể khác, ý nghĩa phải giữ): Draft (đã tạo chưa công bố), Approved (đã được quản trị viên duyệt), OpenForRegistration (người tham dự đăng ký được), Full (đạt sức chứa tối đa), Ongoing (đang diễn ra), Completed (đã kết thúc thành công); có trạng thái kết thúc thay thế như Cancelled hoặc Rejected; ít nhất 6 chuyển trạng thái, mỗi cái có tên sự kiện kích hoạt rõ, VD submitEvent, approveEvent, openRegistration, registerParticipant, startEvent, finishEvent, cancelEvent; ít nhất 1 nhánh rẽ đại diện huỷ hoặc từ chối sự kiện.</p>`,
  ),
  sampleSolution: B(
    MMD(`stateDiagram-v2
    [*] --> Draft : submitEvent
    Draft --> Approved : approveEvent
    Draft --> Rejected : rejectEvent
    Approved --> OpenForRegistration : openRegistration
    Approved --> Cancelled : cancelEvent
    OpenForRegistration --> OpenForRegistration : registerParticipant [capacity available]
    OpenForRegistration --> Full : registerParticipant [last slot filled]
    Full --> OpenForRegistration : cancelRegistration [slot freed]
    OpenForRegistration --> Ongoing : startEvent
    Full --> Ongoing : startEvent
    OpenForRegistration --> Cancelled : cancelEvent
    Full --> Cancelled : cancelEvent
    Ongoing --> Completed : finishEvent
    Completed --> [*]
    Cancelled --> [*]
    Rejected --> [*]`),
    MMD(`stateDiagram-v2
    [*] --> Draft : submitEvent
    Draft --> Approved : approveEvent
    Draft --> Rejected : rejectEvent
    Approved --> OpenForRegistration : openRegistration
    Approved --> Cancelled : cancelEvent
    OpenForRegistration --> OpenForRegistration : registerParticipant [còn sức chứa]
    OpenForRegistration --> Full : registerParticipant [đủ chỗ cuối]
    Full --> OpenForRegistration : cancelRegistration [có chỗ trống lại]
    OpenForRegistration --> Ongoing : startEvent
    Full --> Ongoing : startEvent
    OpenForRegistration --> Cancelled : cancelEvent
    Full --> Cancelled : cancelEvent
    Ongoing --> Completed : finishEvent
    Completed --> [*]
    Cancelled --> [*]
    Rejected --> [*]`),
  ),
  explanation: B(
    `<p>No source solution existed. Included 8 distinct named triggering events (submitEvent, approveEvent, rejectEvent, openRegistration, registerParticipant, cancelRegistration, startEvent, finishEvent, cancelEvent — actually 9), well above the minimum 6 transitions, and two distinct termination branches (Rejected from Draft, Cancelled from Approved/OpenForRegistration/Full) satisfying "at least one branching path must represent event cancellation or rejection" with margin.</p>`,
    `<p>Đề không có solution nguồn. Đã đưa vào 9 tên sự kiện kích hoạt khác nhau (submitEvent, approveEvent, rejectEvent, openRegistration, registerParticipant, cancelRegistration, startEvent, finishEvent, cancelEvent), vượt xa mức tối thiểu 6 chuyển trạng thái, và 2 nhánh kết thúc khác nhau (Rejected từ Draft, Cancelled từ Approved/OpenForRegistration/Full) thoả yêu cầu "ít nhất 1 nhánh rẽ đại diện huỷ hoặc từ chối" có dư.</p>`,
  ),
  rubric: [
    { id: 'initial_final_states', criterion: B('Has a clearly defined initial state (into Draft) and final state(s) (from Completed/Cancelled/Rejected).', 'Có trạng thái khởi đầu rõ (vào Draft) và trạng thái kết thúc (từ Completed/Cancelled/Rejected).'), weight: 1, maxScore: 0.4 },
    { id: 'required_states_present', criterion: B('Includes all 6 required states with preserved meaning: Draft, Approved, OpenForRegistration, Full, Ongoing, Completed.', 'Có đủ 6 trạng thái yêu cầu, giữ đúng ý nghĩa: Draft, Approved, OpenForRegistration, Full, Ongoing, Completed.'), weight: 1, maxScore: 0.8 },
    { id: 'termination_branch', criterion: B('Includes at least one alternative termination branch (Cancelled or Rejected) reachable from a meaningful point in the lifecycle.', 'Có ít nhất 1 nhánh kết thúc thay thế (Cancelled hoặc Rejected) tới được từ điểm có ý nghĩa trong vòng đời.'), weight: 1, maxScore: 0.6 },
    { id: 'six_named_transitions', criterion: B('Shows at least 6 state transitions, each with a clear, distinct triggering event name.', 'Có ít nhất 6 chuyển trạng thái, mỗi cái có tên sự kiện kích hoạt rõ ràng, khác nhau.'), weight: 1, maxScore: 0.8 },
    { id: 'logical_consistency', criterion: B('Transitions are logically consistent (e.g., an event cannot go from Completed back to OpenForRegistration; Full can transition to Ongoing since a full event can still start).', 'Chuyển trạng thái nhất quán logic (VD Event không thể từ Completed quay lại OpenForRegistration; Full có thể chuyển sang Ongoing vì sự kiện đầy vẫn có thể bắt đầu).'), weight: 1, maxScore: 0.4 },
  ],
};

const spec = {
  course: { courseCode: 'SWD392' },
  exams: [{
    kind: 'PE',
    peType: 'WRITE',
    code: 'PE2',
    title: 'SWD392 – Practical Exam (Spring 2026), University Event Management System (EMS)|||SWD392 – Thi thực hành (Spring 2026), Event Management System (EMS)',
    description: 'SWD392 PE (WRITE): design-level class diagram (Repository Pattern), sequence diagram with nested alt fragments, and Event lifecycle state diagram, Mermaid-rendered, AI-graded.|||PE SWD392 (viết): class diagram mức thiết kế (Repository Pattern), sequence diagram có alt lồng nhau, và state diagram vòng đời Event, hiển thị Mermaid, chấm AI.',
    durationMinutes: 85,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: null,
    attachmentName: null,
    instructions,
    isPublished: true,
    questions: [q1, q2, q3],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/WRITE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
