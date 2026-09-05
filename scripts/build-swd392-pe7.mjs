/**
 * build-swd392-pe7.mjs — sinh content/exams/SWD392-PE7.mjs.
 *
 * Nguồn thật: "SWD392 - SU26 - PE1 - Paper 1" ("Practical Exam: SWD392
 * –SU26"), nền tảng đặt lịch khám bệnh "MediCare Hub". Không có
 * solution (material_0.zip đính kèm không tìm thấy nội dung liên quan
 * khi kiểm tra — không có gì để tham khảo).
 *
 * Đề yêu cầu chọn nhất quán Layered Architecture HOẶC Microservices +
 * Repository Pattern bắt buộc — đã chọn Layered Architecture (khớp
 * cùng lựa chọn ở PE2, cùng khuôn mẫu đề).
 *
 * Điểm gốc: Q1=4.0 (Class Diagram), Q2=4.0 (Sequence Diagram, alt lồng
 * nhau cho doctor availability VÀ payment success/failure), Q3=3.0
 * (State Diagram vòng đời Appointment, ≥6 transition có tên sự kiện,
 * ≥1 nhánh rẽ đại diện payment failure hoặc cancellation).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/SWD392-PE7.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/SWD392-PE7.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;
const MMD = (src) => `<pre class="mermaid">${src}</pre>`;

const projectContext = B(
  `<div class="pe-system"><b>Business Overview:</b><p>MediCare Hub is an online platform for managing healthcare appointments, supporting patients, doctors, and medical staff in scheduling and managing medical consultations. Patients can look up available doctors, review doctor schedules, and book medical appointments for a specific date and time. Doctors manage their consultation schedules and record appointment outcomes after each visit. Receptionists handle appointment confirmations, check patient attendance, and process payments.</p>
   <p>Every appointment carries a status throughout its lifecycle such as Pending, Confirmed, CheckedIn, Completed, or Cancelled. The system automatically updates doctor availability and appointment status according to the healthcare workflow.</p>
   <p>Students may choose either Layered Architecture or Microservices Architecture, but the chosen architecture must be applied consistently throughout all diagrams — the <b>Repository Pattern is mandatory</b>. These sample answers use <b>Layered Architecture</b> (Presentation → Service → Repository → Domain).</p></div>`,
  `<div class="pe-system"><b>Tổng quan nghiệp vụ:</b><p>MediCare Hub là nền tảng online quản lý lịch khám bệnh, hỗ trợ bệnh nhân, bác sĩ, nhân viên y tế lên lịch và quản lý buổi khám. Bệnh nhân tra cứu bác sĩ có sẵn, xem lịch bác sĩ, đặt lịch khám cho ngày/giờ cụ thể. Bác sĩ quản lý lịch khám và ghi kết quả buổi khám sau mỗi lần khám. Lễ tân xử lý xác nhận lịch hẹn, kiểm tra bệnh nhân có tới, và xử lý thanh toán.</p>
   <p>Mỗi lịch hẹn mang trạng thái xuyên suốt vòng đời như Pending, Confirmed, CheckedIn, Completed, hoặc Cancelled. Hệ thống tự động cập nhật lịch bác sĩ còn trống và trạng thái lịch hẹn theo quy trình y tế.</p>
   <p>Sinh viên chọn nhất quán Layered Architecture hoặc Microservices Architecture cho mọi sơ đồ — <b>Repository Pattern bắt buộc</b>. Các câu trả lời mẫu dưới đây dùng <b>Layered Architecture</b> (Presentation → Service → Repository → Domain).</p></div>`,
);

const instructions = ML(
  `<p><strong>SWD392 – Practical Exam (Summer 2026) — MediCare Hub Healthcare Appointment System</strong>. Duration 85 minutes in the original paper. Students are not required to write source code — all answers are UML diagrams. Diagrams are rendered as Mermaid directly in the exam viewer. Each answer is graded by an AI grader against the rubric shown per question.</p>` + projectContext,
  `<p><strong>SWD392 – Thi thực hành (Summer 2026) — Nền tảng đặt lịch khám MediCare Hub</strong>. Đề gốc 85 phút. Không cần viết mã nguồn — mọi câu trả lời là sơ đồ UML. Sơ đồ hiển thị dạng Mermaid trực tiếp trong trình xem đề. Mỗi câu trả lời được AI chấm theo tiêu chí ghi ở từng câu.</p>` + projectContext,
);

const q1 = {
  kind: 'WRITE', points: 4,
  prompt: B(
    `<p><strong>Question 1 (4.0 points) – Class Diagram:</strong> design a design-level Class Diagram for the Smart Healthcare Appointment System. Requirements: User is a base class; Patient, Doctor, and Receptionist are specialized types of User using inheritance; an Appointment is created by a patient; a doctor can manage multiple appointments; each Appointment has a date, time slot, and status; each Appointment is associated with exactly one Payment; a DoctorSchedule stores doctor availability information; business logic related to appointment booking, payment, and schedule management is handled by service classes; repository classes must implement a generic Repository&lt;T&gt; interface; the service layer depends on repository classes for data access. UML relationships that must be clearly shown: inheritance and interface implementation; association, aggregation, and composition where appropriate; dependency relationships between service and repository layers; clear attributes, methods, and multiplicities.</p>`,
    `<p><strong>Câu 1 (4.0 điểm) – Class Diagram:</strong> thiết kế Class Diagram mức thiết kế cho Smart Healthcare Appointment System. Yêu cầu: User là lớp gốc; Patient, Doctor, Receptionist là loại User chuyên biệt hoá dùng kế thừa; Appointment được tạo bởi patient; 1 doctor có thể quản lý nhiều appointment; mỗi Appointment có ngày, khung giờ, trạng thái; mỗi Appointment gắn với đúng 1 Payment; 1 DoctorSchedule lưu thông tin bác sĩ còn trống; logic nghiệp vụ đặt lịch/thanh toán/quản lý lịch do lớp service xử lý; lớp repository phải triển khai interface Repository&lt;T&gt; generic; tầng service phụ thuộc lớp repository để truy cập dữ liệu. Quan hệ UML phải thể hiện rõ: kế thừa và triển khai interface; association, aggregation, composition khi phù hợp; dependency giữa tầng service và repository; thuộc tính, phương thức, multiplicity rõ ràng.</p>`,
  ),
  sampleSolution: B(
    MMD(`classDiagram
    class User {
        <<abstract>>
        #userId : int
        #name : string
        #email : string
        #passwordHash : string
    }
    class Patient {
    }
    class Doctor {
        -specialty : string
    }
    class Receptionist {
    }
    class Appointment {
        -appointmentId : int
        -date : Date
        -timeSlot : string
        -status : AppointmentStatus
    }
    class Payment {
        -paymentId : int
        -amount : decimal
        -paymentStatus : string
        -paymentDate : DateTime
    }
    class DoctorSchedule {
        -scheduleId : int
        -availableDate : Date
        -availableTimeSlot : string
        -isBooked : bool
    }
    class IRepository~T~ {
        <<interface>>
        +findById(id int) T
        +findAll() List~T~
        +save(entity T) void
    }
    class AppointmentRepository {
        +findById(id int) Appointment
        +findAll() List~Appointment~
        +save(entity Appointment) void
    }
    class PaymentRepository {
        +findById(id int) Payment
        +save(entity Payment) void
    }
    class DoctorScheduleRepository {
        +findById(id int) DoctorSchedule
        +findAll() List~DoctorSchedule~
        +save(entity DoctorSchedule) void
    }
    class AppointmentService {
        -appointmentRepository : IRepository~Appointment~
        -paymentRepository : IRepository~Payment~
        -scheduleRepository : IRepository~DoctorSchedule~
        +bookAppointment(patient Patient, doctorId int, date Date, timeSlot String) Appointment
        +confirmPayment(appointmentId int, amount decimal) Payment
    }

    User <|-- Patient
    User <|-- Doctor
    User <|-- Receptionist
    Patient "1" --> "*" Appointment : creates
    Doctor "1" --> "*" Appointment : manages
    Doctor "1" *-- "*" DoctorSchedule : maintains
    Appointment "1" *-- "1" Payment : requires
    IRepository <|.. AppointmentRepository
    IRepository <|.. PaymentRepository
    IRepository <|.. DoctorScheduleRepository
    AppointmentService ..> IRepository : depends on`),
    MMD(`classDiagram
    class User {
        <<abstract>>
        #userId : int
        #name : string
        #email : string
        #passwordHash : string
    }
    class Patient {
    }
    class Doctor {
        -specialty : string
    }
    class Receptionist {
    }
    class Appointment {
        -appointmentId : int
        -date : Date
        -timeSlot : string
        -status : AppointmentStatus
    }
    class Payment {
        -paymentId : int
        -amount : decimal
        -paymentStatus : string
        -paymentDate : DateTime
    }
    class DoctorSchedule {
        -scheduleId : int
        -availableDate : Date
        -availableTimeSlot : string
        -isBooked : bool
    }
    class IRepository~T~ {
        <<interface>>
        +findById(id int) T
        +findAll() List~T~
        +save(entity T) void
    }
    class AppointmentRepository {
        +findById(id int) Appointment
        +findAll() List~Appointment~
        +save(entity Appointment) void
    }
    class PaymentRepository {
        +findById(id int) Payment
        +save(entity Payment) void
    }
    class DoctorScheduleRepository {
        +findById(id int) DoctorSchedule
        +findAll() List~DoctorSchedule~
        +save(entity DoctorSchedule) void
    }
    class AppointmentService {
        -appointmentRepository : IRepository~Appointment~
        -paymentRepository : IRepository~Payment~
        -scheduleRepository : IRepository~DoctorSchedule~
        +bookAppointment(patient Patient, doctorId int, date Date, timeSlot String) Appointment
        +confirmPayment(appointmentId int, amount decimal) Payment
    }

    User <|-- Patient
    User <|-- Doctor
    User <|-- Receptionist
    Patient "1" --> "*" Appointment : tạo
    Doctor "1" --> "*" Appointment : quản lý
    Doctor "1" *-- "*" DoctorSchedule : duy trì
    Appointment "1" *-- "1" Payment : cần
    IRepository <|.. AppointmentRepository
    IRepository <|.. PaymentRepository
    IRepository <|.. DoctorScheduleRepository
    AppointmentService ..> IRepository : phụ thuộc`) +
    `<p><strong>Brief explanation:</strong> Appointment-Payment is modeled as composition (<code>*--</code>) since an appointment "is associated with exactly one Payment" and that payment record has no independent existence outside its appointment. Doctor-DoctorSchedule is also composition, since a schedule slot only makes sense as part of a specific doctor's own schedule. All 3 repository classes implement the same generic <code>IRepository&lt;T&gt;</code> interface (mandatory Repository Pattern), and AppointmentService depends on the interfaces rather than concrete repository classes.</p>`,
    `<p><strong>Giải thích ngắn:</strong> Appointment-Payment mô hình composition (<code>*--</code>) vì lịch hẹn "gắn với đúng 1 Payment" và bản ghi thanh toán đó không tồn tại độc lập ngoài lịch hẹn của nó. Doctor-DoctorSchedule cũng composition, vì 1 slot lịch chỉ có ý nghĩa như 1 phần của đúng lịch bác sĩ đó. Cả 3 lớp repository đều triển khai cùng interface generic <code>IRepository&lt;T&gt;</code> (Repository Pattern bắt buộc), và AppointmentService phụ thuộc interface thay vì lớp repository cụ thể.</p>`,
  ),
  explanation: B(
    `<p>No source solution existed (material_0.zip attached to this folder had no relevant content to check against).</p>`,
    `<p>Đề không có solution nguồn (material_0.zip đính kèm folder này không có nội dung liên quan để kiểm chứng).</p>`,
  ),
  rubric: [
    { id: 'inheritance_hierarchy', criterion: B('User is a base class specialized by Patient, Doctor, and Receptionist via inheritance.', 'User là lớp gốc, chuyên biệt hoá bởi Patient, Doctor, Receptionist qua kế thừa.'), weight: 1, maxScore: 0.7 },
    { id: 'entities_and_multiplicity', criterion: B('Appointment, Payment, and DoctorSchedule are modeled with correct attributes and multiplicities (a doctor manages many appointments; each appointment has exactly one payment).', 'Appointment, Payment, DoctorSchedule mô hình đúng thuộc tính và multiplicity (1 doctor quản lý nhiều appointment; mỗi appointment đúng 1 payment).'), weight: 1, maxScore: 0.8 },
    { id: 'repository_pattern', criterion: B('Repository classes implement a generic Repository<T> interface, consistent with the mandatory Repository Pattern.', 'Lớp repository triển khai interface Repository<T> generic, đúng Repository Pattern bắt buộc.'), weight: 1, maxScore: 0.8 },
    { id: 'service_depends_on_repo', criterion: B('Service classes show a dependency relationship on repository (interfaces), not a direct concrete coupling, and handle the business logic (booking, payment, schedule management).', 'Lớp service thể hiện quan hệ dependency với repository (interface), không gắn cứng cụ thể, và xử lý logic nghiệp vụ (đặt lịch, thanh toán, quản lý lịch).'), weight: 1, maxScore: 0.9 },
    { id: 'relationship_variety', criterion: B('Shows a genuine variety of relationships (inheritance, interface realization, association/aggregation/composition, dependency), correctly distinguishing composition (Appointment-Payment) from simple association.', 'Thể hiện đa dạng thật các loại quan hệ (kế thừa, interface realization, association/aggregation/composition, dependency), phân biệt đúng composition (Appointment-Payment) với association thường.'), weight: 1, maxScore: 0.8 },
  ],
};

const q2 = {
  kind: 'WRITE', points: 4,
  prompt: B(
    `<p><strong>Question 2 (4.0 points) – Sequence Diagram (Use Case: Book Appointment and Pay Consultation Fee):</strong> the process starts when the patient selects a doctor and requests an appointment for a specific time slot. The system then checks whether the doctor is available during that period. If the doctor is available, an appointment is created and the patient moves on to payment. If the payment succeeds, the appointment is confirmed; otherwise, the appointment is cancelled. Requirements: follow the same architecture consistently (Layered, in these sample answers); the interaction flow must clearly include a user-facing component (UI/Patient Portal), a controller/service component handling business logic, repository components responsible for data access, and domain entities such as Appointment, Doctor, and Payment; Repository Pattern usage must be explicit through repository method calls; conditional behavior must be modeled using alt fragments for (1) doctor availability, and (2) payment success or failure.</p>`,
    `<p><strong>Câu 2 (4.0 điểm) – Sequence Diagram (Use case: Đặt lịch khám và thanh toán):</strong> quy trình bắt đầu khi bệnh nhân chọn bác sĩ và yêu cầu lịch hẹn cho khung giờ cụ thể. Hệ thống kiểm tra bác sĩ có trống khung giờ đó không. Nếu trống, tạo lịch hẹn và bệnh nhân chuyển qua thanh toán. Nếu thanh toán thành công, lịch hẹn được xác nhận; ngược lại, lịch hẹn bị huỷ. Yêu cầu: theo cùng kiến trúc nhất quán (Layered, trong câu trả lời mẫu này); luồng tương tác phải có rõ: component UI/Patient Portal, component controller/service xử lý logic nghiệp vụ, component repository chịu trách nhiệm truy cập dữ liệu, thực thể miền như Appointment, Doctor, Payment; cách dùng Repository Pattern phải tường minh qua lời gọi phương thức repository; hành vi điều kiện phải mô hình bằng alt fragment cho (1) bác sĩ còn trống, và (2) thanh toán thành công hay thất bại.</p>`,
  ),
  sampleSolution: B(
    MMD(`sequenceDiagram
    actor Patient
    participant Portal as PatientPortal
    participant Svc as AppointmentService
    participant SchedRepo as DoctorScheduleRepository
    participant ApptRepo as AppointmentRepository
    participant PayRepo as PaymentRepository

    Patient->>Portal: Select doctor & request appointment(doctorId, date, timeSlot)
    Portal->>Svc: bookAppointment(patientId, doctorId, date, timeSlot)
    Svc->>SchedRepo: checkAvailability(doctorId, date, timeSlot)
    SchedRepo-->>Svc: isAvailable

    alt doctor is available
        Svc->>ApptRepo: save(new Appointment(patientId, doctorId, date, timeSlot, status=Pending))
        ApptRepo-->>Svc: appointment created
        Svc-->>Portal: proceed to payment
        Portal->>Svc: payConsultationFee(appointmentId, amount)
        Svc->>PayRepo: save(new Payment(appointmentId, amount))

        alt payment succeeds
            PayRepo-->>Svc: payment success
            Svc->>ApptRepo: updateStatus(appointmentId, Confirmed)
            ApptRepo-->>Svc: updated
            Svc-->>Portal: appointment confirmed
            Portal-->>Patient: Show confirmation
        else payment fails
            PayRepo-->>Svc: payment failed
            Svc->>ApptRepo: updateStatus(appointmentId, Cancelled)
            ApptRepo-->>Svc: updated
            Svc-->>Portal: appointment cancelled (payment failed)
            Portal-->>Patient: Show payment failure message
        end
    else doctor not available
        Svc-->>Portal: slot unavailable
        Portal-->>Patient: Show "slot unavailable" message
    end`),
    MMD(`sequenceDiagram
    actor Patient
    participant Portal as PatientPortal
    participant Svc as AppointmentService
    participant SchedRepo as DoctorScheduleRepository
    participant ApptRepo as AppointmentRepository
    participant PayRepo as PaymentRepository

    Patient->>Portal: Chọn bác sĩ & yêu cầu lịch hẹn(doctorId, date, timeSlot)
    Portal->>Svc: bookAppointment(patientId, doctorId, date, timeSlot)
    Svc->>SchedRepo: checkAvailability(doctorId, date, timeSlot)
    SchedRepo-->>Svc: isAvailable

    alt bác sĩ còn trống
        Svc->>ApptRepo: save(new Appointment(patientId, doctorId, date, timeSlot, status=Pending))
        ApptRepo-->>Svc: đã tạo lịch hẹn
        Svc-->>Portal: chuyển sang thanh toán
        Portal->>Svc: payConsultationFee(appointmentId, amount)
        Svc->>PayRepo: save(new Payment(appointmentId, amount))

        alt thanh toán thành công
            PayRepo-->>Svc: thanh toán thành công
            Svc->>ApptRepo: updateStatus(appointmentId, Confirmed)
            ApptRepo-->>Svc: đã cập nhật
            Svc-->>Portal: lịch hẹn xác nhận
            Portal-->>Patient: Hiện xác nhận
        else thanh toán thất bại
            PayRepo-->>Svc: thanh toán thất bại
            Svc->>ApptRepo: updateStatus(appointmentId, Cancelled)
            ApptRepo-->>Svc: đã cập nhật
            Svc-->>Portal: lịch hẹn huỷ (thanh toán thất bại)
            Portal-->>Patient: Hiện thông báo thất bại thanh toán
        end
    else bác sĩ không trống
        Svc-->>Portal: khung giờ không còn trống
        Portal-->>Patient: Hiện thông báo "khung giờ không còn trống"
    end`),
  ),
  explanation: B(
    `<p>The payment alt is nested inside the availability alt, because payment only becomes relevant once the appointment has actually been created (an unavailable doctor never reaches the payment step at all) — matching the paper's own described order ("If the doctor is available, an appointment is created and the patient moves on to payment").</p>`,
    `<p>Alt thanh toán lồng bên trong alt còn trống, vì thanh toán chỉ có ý nghĩa khi lịch hẹn đã thực sự được tạo (bác sĩ không trống thì không bao giờ tới bước thanh toán) — khớp đúng thứ tự đề mô tả ("Nếu bác sĩ còn trống, tạo lịch hẹn và bệnh nhân chuyển qua thanh toán").</p>`,
  ),
  rubric: [
    { id: 'four_layer_participants', criterion: B('Includes all required participant types: a UI/Portal component, a service component, repository components, and the domain entities referenced in the flow (Appointment, Doctor availability, Payment).', 'Có đủ các loại tham gia yêu cầu: component UI/Portal, component service, component repository, và thực thể miền xuất hiện trong luồng (Appointment, tình trạng Doctor, Payment).'), weight: 1, maxScore: 0.8 },
    { id: 'repository_calls_explicit', criterion: B('Repository Pattern usage is explicit — the service calls repository methods (checkAvailability, save, updateStatus) rather than accessing data directly.', 'Dùng Repository Pattern tường minh — service gọi phương thức repository (checkAvailability, save, updateStatus) thay vì truy cập dữ liệu trực tiếp.'), weight: 1, maxScore: 0.8 },
    { id: 'nested_alt_fragments', criterion: B('Both required alt fragments are present (doctor availability, payment success/failure), correctly nested so payment is only reached once the doctor is confirmed available.', 'Có đủ 2 alt fragment yêu cầu (bác sĩ còn trống, thanh toán thành công/thất bại), lồng đúng để thanh toán chỉ tới khi bác sĩ đã xác nhận còn trống.'), weight: 1, maxScore: 1.2 },
    { id: 'success_and_failure_paths', criterion: B('Shows a coherent success path (appointment created, paid, confirmed) and both failure paths (slot unavailable, payment failed → cancelled) with an appropriate response to the patient in each case.', 'Thể hiện luồng thành công mạch lạc (tạo lịch hẹn, thanh toán, xác nhận) và cả 2 luồng thất bại (hết chỗ, thanh toán thất bại → huỷ) với phản hồi phù hợp cho bệnh nhân mỗi trường hợp.'), weight: 1, maxScore: 1.2 },
  ],
};

const q3 = {
  kind: 'WRITE', points: 3,
  prompt: B(
    `<p><strong>Question 3 (3.0 points) – State Diagram (Target: Appointment Lifecycle Management):</strong> design a State Diagram for the Appointment entity describing its complete lifecycle. Requirements: a clearly defined initial state and final state; include at least these states (names may vary, meaning must be preserved): Pending (created but not yet confirmed), Confirmed (confirmed successfully), CheckedIn (patient has arrived at the clinic), InConsultation (doctor is examining the patient), Completed (finished successfully); include an alternative termination state such as Cancelled or PaymentFailed; at least six state transitions, each with a clear triggering event, such as createAppointment, paySuccess, payFail, confirmAppointment, checkIn, startConsultation, finishConsultation, cancelAppointment; at least one branching path must represent payment failure or appointment cancellation.</p>`,
    `<p><strong>Câu 3 (3.0 điểm) – State Diagram (Mục tiêu: Quản lý vòng đời Appointment):</strong> thiết kế State Diagram cho thực thể Appointment mô tả đầy đủ vòng đời. Yêu cầu: có trạng thái khởi đầu và kết thúc rõ ràng; gồm ít nhất các trạng thái (tên có thể khác, ý nghĩa phải giữ): Pending (đã tạo chưa xác nhận), Confirmed (đã xác nhận thành công), CheckedIn (bệnh nhân đã tới phòng khám), InConsultation (bác sĩ đang khám), Completed (đã kết thúc thành công); có trạng thái kết thúc thay thế như Cancelled hoặc PaymentFailed; ít nhất 6 chuyển trạng thái, mỗi cái có tên sự kiện kích hoạt rõ, VD createAppointment, paySuccess, payFail, confirmAppointment, checkIn, startConsultation, finishConsultation, cancelAppointment; ít nhất 1 nhánh rẽ đại diện thanh toán thất bại hoặc huỷ lịch hẹn.</p>`,
  ),
  sampleSolution: B(
    MMD(`stateDiagram-v2
    [*] --> Pending : createAppointment
    Pending --> Confirmed : paySuccess
    Pending --> Confirmed : confirmAppointment
    Pending --> PaymentFailed : payFail
    Pending --> Cancelled : cancelAppointment
    Confirmed --> CheckedIn : checkIn
    Confirmed --> Cancelled : cancelAppointment
    CheckedIn --> InConsultation : startConsultation
    InConsultation --> Completed : finishConsultation
    Completed --> [*]
    Cancelled --> [*]
    PaymentFailed --> [*]`),
    MMD(`stateDiagram-v2
    [*] --> Pending : createAppointment
    Pending --> Confirmed : paySuccess
    Pending --> Confirmed : confirmAppointment
    Pending --> PaymentFailed : payFail
    Pending --> Cancelled : cancelAppointment
    Confirmed --> CheckedIn : checkIn
    Confirmed --> Cancelled : cancelAppointment
    CheckedIn --> InConsultation : startConsultation
    InConsultation --> Completed : finishConsultation
    Completed --> [*]
    Cancelled --> [*]
    PaymentFailed --> [*]`),
  ),
  explanation: B(
    `<p>Two distinct routes into Confirmed are modeled: <code>paySuccess</code> for the online-payment flow from Question 2, and <code>confirmAppointment</code> for a receptionist manually confirming after processing an in-person/counter payment — matching the business overview's own line that "Receptionists handle appointment confirmations... and process payments," a separate channel from patient-portal online payment. Included 8 distinct named triggering events, well above the minimum 6 transitions, and two distinct termination branches (PaymentFailed from Pending, Cancelled from both Pending and Confirmed).</p>`,
    `<p>Mô hình 2 đường riêng vào Confirmed: <code>paySuccess</code> cho luồng thanh toán online từ Câu 2, và <code>confirmAppointment</code> cho lễ tân xác nhận thủ công sau khi xử lý thanh toán trực tiếp/tại quầy — khớp đúng dòng của tổng quan nghiệp vụ "Lễ tân xử lý xác nhận lịch hẹn... và xử lý thanh toán," 1 kênh riêng khỏi thanh toán online qua Patient Portal. Đã đưa vào 8 tên sự kiện kích hoạt khác nhau, vượt xa mức tối thiểu 6 chuyển trạng thái, và 2 nhánh kết thúc khác nhau (PaymentFailed từ Pending, Cancelled từ cả Pending và Confirmed).</p>`,
  ),
  rubric: [
    { id: 'initial_final_states', criterion: B('Has a clearly defined initial state (into Pending) and final state(s) (from Completed/Cancelled/PaymentFailed).', 'Có trạng thái khởi đầu rõ (vào Pending) và trạng thái kết thúc (từ Completed/Cancelled/PaymentFailed).'), weight: 1, maxScore: 0.4 },
    { id: 'required_states_present', criterion: B('Includes all 5 required states with preserved meaning: Pending, Confirmed, CheckedIn, InConsultation, Completed.', 'Có đủ 5 trạng thái yêu cầu, giữ đúng ý nghĩa: Pending, Confirmed, CheckedIn, InConsultation, Completed.'), weight: 1, maxScore: 0.8 },
    { id: 'termination_branch', criterion: B('Includes at least one alternative termination branch (Cancelled or PaymentFailed) reachable from a meaningful point in the lifecycle.', 'Có ít nhất 1 nhánh kết thúc thay thế (Cancelled hoặc PaymentFailed) tới được từ điểm có ý nghĩa trong vòng đời.'), weight: 1, maxScore: 0.6 },
    { id: 'six_named_transitions', criterion: B('Shows at least 6 state transitions, each with a clear, distinct triggering event name.', 'Có ít nhất 6 chuyển trạng thái, mỗi cái có tên sự kiện kích hoạt rõ ràng, khác nhau.'), weight: 1, maxScore: 0.8 },
    { id: 'logical_consistency', criterion: B('Transitions are logically consistent with the healthcare workflow (e.g., consultation cannot start before check-in; a completed appointment cannot return to Pending).', 'Chuyển trạng thái nhất quán logic với quy trình y tế (VD không thể bắt đầu khám trước khi check-in; lịch hẹn đã hoàn thành không thể quay lại Pending).'), weight: 1, maxScore: 0.4 },
  ],
};

const spec = {
  course: { courseCode: 'SWD392' },
  exams: [{
    kind: 'PE',
    peType: 'WRITE',
    code: 'PE7',
    title: 'SWD392 – Practical Exam (Summer 2026), MediCare Hub Healthcare Appointment System|||SWD392 – Thi thực hành (Summer 2026), MediCare Hub',
    description: 'SWD392 PE (WRITE): design-level class diagram (Repository Pattern), sequence diagram with nested alt fragments, and Appointment lifecycle state diagram, Mermaid-rendered, AI-graded.|||PE SWD392 (viết): class diagram mức thiết kế (Repository Pattern), sequence diagram có alt lồng nhau, và state diagram vòng đời Appointment, hiển thị Mermaid, chấm AI.',
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
