/**
 * build-swd392-pe3.mjs — sinh content/exams/SWD392-PE3.mjs.
 *
 * Nguồn thật: "SWD392 - SU25 - PE - 1 - RE" ("Practical Exam", hệ thống
 * quản lý sinh viên đại học). ⚠️ File .rar đính kèm folder này
 * (swd392_su25_pe_2_987143.rar) chứa bài làm .doc của MỘT ĐỀ KHÁC hẳn
 * (hệ thống đặt hoa/Flower Shop, nhắc tới thực thể "Booking" — không hề
 * xuất hiện trong paper.pdf của chính folder này) — đã kiểm bằng
 * textutil trích văn bản, xác nhận lệch đề, KHÔNG dùng nội dung đó.
 * Không có solution thật cho đề Student Management System này.
 *
 * Tách 9 câu theo đúng từng mục con đã có điểm riêng trong đề gốc
 * (Part 1: 1+1+1.5+1.5=5đ; Part 2: 1+2=3đ; Part 3: 0.5+1+0.5=2đ).
 * Sơ đồ dùng Mermaid (ExamRichContent.tsx hỗ trợ sẵn qua pre.mermaid)
 * thay Draw.io như đề gốc yêu cầu.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/SWD392-PE3.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/SWD392-PE3.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;
const MMD = (src) => `<pre class="mermaid">${src}</pre>`;
const CODE = (code, lang) => `<pre><code class="language-${lang}">${code
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;

const projectContext = B(
  `<div class="pe-system"><b>Problem statement:</b><p>To modernize student management operations and improve the user experience, the university plans to develop a new student management system. Users can search for subjects, classes, and students, and view student details such as personal information, subject registrations, attended classes, and grades. The system tracks the class attendance of each student and manages multiple subjects, classes, and students; a student passes a subject when their grade is greater than or equal to 5 points. Notifications are sent to users when they miss a class or fail a subject.</p>
   <p>The system is planned to be developed using a client-server architecture: the client with React; the server as a REST API following the MVC pattern; the database is MS SQL, MySQL, or PostgreSQL; communication via HTTP/JSON.</p></div>`,
  `<div class="pe-system"><b>Đề bài:</b><p>Để hiện đại hoá vận hành quản lý sinh viên và cải thiện trải nghiệm người dùng, trường dự định xây hệ thống quản lý sinh viên mới. Người dùng có thể tìm kiếm môn học, lớp học, sinh viên, xem chi tiết sinh viên (thông tin cá nhân, đăng ký môn, buổi học đã tham dự, điểm số). Hệ thống theo dõi điểm danh của mỗi sinh viên và quản lý nhiều môn học, lớp học, sinh viên; sinh viên qua môn khi điểm ≥ 5. Thông báo gửi cho người dùng khi vắng buổi học hoặc trượt môn.</p>
   <p>Hệ thống dự định xây theo client-server: client React; server REST API theo mẫu MVC; database MS SQL, MySQL, hoặc PostgreSQL; giao tiếp HTTP/JSON.</p></div>`,
);

const instructions = ML(
  `<p><strong>SWD392 – Software Architecture and Design, Practical Exam (Summer 2025, Retake 1)</strong>. This is a written practical exam on data modeling, REST API design, and design patterns. The original paper asks for Draw.io diagrams in a Word file — here, diagrams are rendered as Mermaid directly in the exam viewer. Each answer is graded by an AI grader against the rubric shown per question.</p>` + projectContext,
  `<p><strong>SWD392 – Kiến trúc và Thiết kế Phần mềm, Thi thực hành (Summer 2025, Retake 1)</strong>. Đây là bài thi thực hành về mô hình hoá dữ liệu, thiết kế REST API, và design pattern dạng viết. Đề gốc yêu cầu vẽ Draw.io trong file Word — ở đây sơ đồ hiển thị dạng Mermaid trực tiếp trong trình xem đề. Mỗi câu trả lời được AI chấm theo tiêu chí ghi ở từng câu.</p>` + projectContext,
);

const q1 = {
  kind: 'WRITE', points: 1,
  prompt: B(
    `<p><strong>Part 1.1 (1 point):</strong> based on the problem description, LIST the main entities and their key attributes.</p>`,
    `<p><strong>Phần 1.1 (1 điểm):</strong> dựa vào đề bài, LIỆT KÊ các thực thể chính và thuộc tính chính.</p>`,
  ),
  sampleSolution: B(
    `<ul><li><b>Student</b>: studentId, name, dateOfBirth, email, phone.</li>
     <li><b>Subject</b>: subjectId, subjectName, credits.</li>
     <li><b>Class</b> (a specific offering/section of a subject): classId, className, schedule, room, subjectId.</li>
     <li><b>Enrollment</b> (resolves the many-to-many between Student and Class, and holds the grade): enrollmentId, studentId, classId, grade, passStatus.</li>
     <li><b>Attendance</b> (one record per class session per enrolled student): attendanceId, enrollmentId, sessionDate, status (Present/Absent).</li>
     <li><b>Notification</b>: notificationId, studentId, type (MissedClass/FailedSubject), message, sentDate.</li></ul>`,
    `<ul><li><b>Student</b> (sinh viên): studentId, name, dateOfBirth, email, phone.</li>
     <li><b>Subject</b> (môn học): subjectId, subjectName, credits.</li>
     <li><b>Class</b> (lớp học, 1 lớp cụ thể của 1 môn): classId, className, schedule, room, subjectId.</li>
     <li><b>Enrollment</b> (giải quyết N-N giữa Student và Class, giữ điểm): enrollmentId, studentId, classId, grade, passStatus.</li>
     <li><b>Attendance</b> (1 bản ghi mỗi buổi học cho mỗi sinh viên đã đăng ký): attendanceId, enrollmentId, sessionDate, status (Present/Absent).</li>
     <li><b>Notification</b> (thông báo): notificationId, studentId, type (MissedClass/FailedSubject), message, sentDate.</li></ul>`,
  ),
  explanation: B(
    `<p>No source solution existed (the attached .rar material belongs to a different exam paper about a flower-shop ordering system, verified by text-extracting it and finding no overlap with this paper's Student Management scenario). Enrollment is the key modeling insight: a student can register for multiple classes and a class can have multiple students (M:N), and the grade naturally belongs to that specific student-class pairing, not to Student or Class alone.</p>`,
    `<p>Đề không có solution nguồn (tài liệu .rar đính kèm thuộc về 1 đề khác về hệ thống đặt hoa, đã kiểm bằng trích văn bản và không khớp tình huống Quản lý Sinh viên của đề này). Enrollment là hiểu biết mô hình hoá then chốt: 1 sinh viên đăng ký nhiều lớp và 1 lớp có nhiều sinh viên (N-N), và điểm số tự nhiên thuộc về đúng cặp sinh viên-lớp đó, không thuộc riêng Student hay Class.</p>`,
  ),
  rubric: [
    { id: 'six_entities', criterion: B('Identifies Student, Subject, Class, and a junction entity resolving the Student-Class M:N relationship that carries the grade (Enrollment); Attendance and Notification are also expected given the problem statement.', 'Xác định Student, Subject, Class, và thực thể trung gian giải quyết N-N Student-Class mang điểm số (Enrollment); Attendance và Notification cũng cần có theo đề bài.'), weight: 1, maxScore: 0.6 },
    { id: 'key_attributes', criterion: B('Each entity lists reasonable key attributes matching the problem description (e.g., grade/passStatus on the enrollment, not on Student).', 'Mỗi thực thể liệt kê thuộc tính chính hợp lý khớp đề bài (VD điểm/passStatus ở enrollment, không phải ở Student).'), weight: 1, maxScore: 0.4 },
  ],
};

const q2 = {
  kind: 'WRITE', points: 1,
  prompt: B(
    `<p><strong>Part 1.2 (1 point):</strong> DRAW the conceptual ERD for the system.</p>`,
    `<p><strong>Phần 1.2 (1 điểm):</strong> VẼ ERD mức khái niệm cho hệ thống.</p>`,
  ),
  sampleSolution: B(
    MMD(`erDiagram
    STUDENT }o--o{ CLASS : registers
    CLASS }o--|| SUBJECT : belongsTo
    STUDENT ||--o{ ATTENDANCE : has
    CLASS ||--o{ ATTENDANCE : has
    STUDENT ||--o{ NOTIFICATION : receives`),
    MMD(`erDiagram
    STUDENT }o--o{ CLASS : registers
    CLASS }o--|| SUBJECT : belongsTo
    STUDENT ||--o{ ATTENDANCE : has
    CLASS ||--o{ ATTENDANCE : has
    STUDENT ||--o{ NOTIFICATION : receives`),
  ),
  rubric: [
    { id: 'entities_present', criterion: B('Includes Student, Subject, Class, Attendance, and Notification as distinct entities.', 'Có đủ Student, Subject, Class, Attendance, Notification là thực thể riêng.'), weight: 1, maxScore: 0.5 },
    { id: 'correct_cardinality', criterion: B('Correct cardinalities: Student-Class is M:N (registers); Class-Subject is N:1 (belongs to); Attendance depends on both Student and Class; Notification is 1:N from Student.', 'Cardinality đúng: Student-Class là N:N (đăng ký); Class-Subject là N:1 (thuộc về); Attendance phụ thuộc cả Student và Class; Notification là 1:N từ Student.'), weight: 1, maxScore: 0.5 },
  ],
};

const q3 = {
  kind: 'WRITE', points: 1.5,
  prompt: B(
    `<p><strong>Part 1.3 (1.5 points):</strong> DRAW the logical ERD (with primary/foreign keys and basic data types).</p>`,
    `<p><strong>Phần 1.3 (1.5 điểm):</strong> VẼ ERD mức logic (khoá chính/khoá ngoại và kiểu dữ liệu cơ bản).</p>`,
  ),
  sampleSolution: B(
    MMD(`erDiagram
    STUDENT {
        int studentId PK
        varchar name
        date dateOfBirth
        varchar email
        varchar phone
    }
    SUBJECT {
        int subjectId PK
        varchar subjectName
        int credits
    }
    CLASS {
        int classId PK
        varchar className
        varchar schedule
        varchar room
        int subjectId FK
    }
    ENROLLMENT {
        int enrollmentId PK
        int studentId FK
        int classId FK
        decimal grade
        varchar passStatus
    }
    ATTENDANCE {
        int attendanceId PK
        int enrollmentId FK
        date sessionDate
        varchar status
    }
    NOTIFICATION {
        int notificationId PK
        int studentId FK
        varchar type
        varchar message
        datetime sentDate
    }
    SUBJECT ||--o{ CLASS : has
    STUDENT ||--o{ ENROLLMENT : has
    CLASS ||--o{ ENROLLMENT : has
    ENROLLMENT ||--o{ ATTENDANCE : has
    STUDENT ||--o{ NOTIFICATION : receives`),
    MMD(`erDiagram
    STUDENT {
        int studentId PK
        varchar name
        date dateOfBirth
        varchar email
        varchar phone
    }
    SUBJECT {
        int subjectId PK
        varchar subjectName
        int credits
    }
    CLASS {
        int classId PK
        varchar className
        varchar schedule
        varchar room
        int subjectId FK
    }
    ENROLLMENT {
        int enrollmentId PK
        int studentId FK
        int classId FK
        decimal grade
        varchar passStatus
    }
    ATTENDANCE {
        int attendanceId PK
        int enrollmentId FK
        date sessionDate
        varchar status
    }
    NOTIFICATION {
        int notificationId PK
        int studentId FK
        varchar type
        varchar message
        datetime sentDate
    }
    SUBJECT ||--o{ CLASS : has
    STUDENT ||--o{ ENROLLMENT : has
    CLASS ||--o{ ENROLLMENT : has
    ENROLLMENT ||--o{ ATTENDANCE : has
    STUDENT ||--o{ NOTIFICATION : receives`),
  ),
  explanation: B(
    `<p>Attendance is deliberately keyed off Enrollment (not directly off Student+Class) — an attendance record only makes sense for a student who is actually enrolled in that class, so tying it to the Enrollment row is more correct than a separate Student+Class composite key.</p>`,
    `<p>Attendance cố tình khoá qua Enrollment (không trực tiếp qua Student+Class) — bản ghi điểm danh chỉ có ý nghĩa khi sinh viên thực sự đã đăng ký lớp đó, nên gắn qua dòng Enrollment đúng hơn là khoá ghép Student+Class riêng.</p>`,
  ),
  rubric: [
    { id: 'pk_fk_correct', criterion: B('Every entity has a correctly marked PK, and every FK correctly points to its referenced entity\'s PK.', 'Mỗi thực thể có PK đánh dấu đúng, mỗi FK trỏ đúng PK thực thể tham chiếu.'), weight: 1, maxScore: 0.6 },
    { id: 'enrollment_resolves_mn', criterion: B('Enrollment correctly resolves the Student-Class many-to-many relationship into two 1:N relationships and carries the grade/passStatus.', 'Enrollment giải quyết đúng quan hệ N-N Student-Class thành 2 quan hệ 1:N và mang điểm/passStatus.'), weight: 1, maxScore: 0.6 },
    { id: 'data_types', criterion: B('Attributes have reasonable basic data types (int, varchar, date/datetime, decimal).', 'Thuộc tính có kiểu dữ liệu cơ bản hợp lý (int, varchar, date/datetime, decimal).'), weight: 1, maxScore: 0.3 },
  ],
};

const q4 = {
  kind: 'WRITE', points: 1.5,
  prompt: B(
    `<p><strong>Part 1.4 (1.5 points):</strong> LIST the main states of the Student entity while studying a subject, and DRAW the state diagram for that studying process.</p>`,
    `<p><strong>Phần 1.4 (1.5 điểm):</strong> LIỆT KÊ các trạng thái chính của sinh viên trong quá trình học 1 môn, và VẼ sơ đồ trạng thái cho quá trình đó.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Main states:</strong> Enrolled (registered for the class, sessions haven't started yet) → InProgress (attending sessions, attendance being recorded) → GradedPass (final grade ≥ 5) or GradedFail (final grade &lt; 5). Alternate path: Withdrawn, reachable from InProgress if the student drops the subject before it's graded.</p>
     <p><strong>State diagram:</strong></p>` +
     MMD(`stateDiagram-v2
    [*] --> Enrolled : registerSubject
    Enrolled --> InProgress : classSessionsStart
    InProgress --> InProgress : attendSession
    InProgress --> Withdrawn : withdrawSubject
    InProgress --> GradedFail : finalGrade < 5
    InProgress --> GradedPass : finalGrade >= 5
    GradedPass --> [*]
    GradedFail --> [*]
    Withdrawn --> [*]`),
    `<p><strong>Trạng thái chính:</strong> Enrolled (đã đăng ký lớp, chưa vào buổi học) → InProgress (đang tham dự buổi học, điểm danh được ghi) → GradedPass (điểm cuối ≥ 5) hoặc GradedFail (điểm cuối &lt; 5). Nhánh khác: Withdrawn, tới được từ InProgress nếu sinh viên bỏ môn trước khi có điểm.</p>
     <p><strong>Sơ đồ trạng thái:</strong></p>` +
     MMD(`stateDiagram-v2
    [*] --> Enrolled : registerSubject
    Enrolled --> InProgress : classSessionsStart
    InProgress --> InProgress : attendSession
    InProgress --> Withdrawn : withdrawSubject
    InProgress --> GradedFail : finalGrade < 5
    InProgress --> GradedPass : finalGrade >= 5
    GradedPass --> [*]
    GradedFail --> [*]
    Withdrawn --> [*]`),
  ),
  rubric: [
    { id: 'states_list', criterion: B('Lists a coherent, ordered sequence of states covering the full studying lifecycle (enrolled → in progress → pass/fail), with the pass/fail split correctly tied to the ≥5 grade rule.', 'Liệt kê chuỗi trạng thái mạch lạc, có thứ tự, bao quát toàn vòng đời học môn (đăng ký → đang học → qua/trượt), tách đúng qua/trượt theo luật điểm ≥5.'), weight: 1, maxScore: 0.7 },
    { id: 'state_diagram_valid', criterion: B('Draws a valid state diagram with a start state, a self-loop or repeated transition for attendance, and correctly branching final states (Pass/Fail/Withdrawn).', 'Vẽ sơ đồ trạng thái hợp lệ, có trạng thái bắt đầu, vòng lặp/chuyển lặp cho điểm danh, và rẽ nhánh đúng trạng thái cuối (Pass/Fail/Withdrawn).'), weight: 1, maxScore: 0.8 },
  ],
};

const q5 = {
  kind: 'WRITE', points: 1,
  prompt: B(
    `<p><strong>Part 2.1 (1 point):</strong> for the "register subject" function, DESCRIBE the classes/tables used on the client side, server side (MVC: Controller, Service, Repository), and in the database.</p>`,
    `<p><strong>Phần 2.1 (1 điểm):</strong> cho chức năng "đăng ký môn học", MÔ TẢ class/bảng dùng ở client, server (MVC: Controller, Service, Repository), và database.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Client:</strong> <code>SubjectRegistrationPage</code> (React component listing available classes and submitting a registration) and <code>RegistrationApiService</code> (calls <code>POST /api/enrollments</code> with the student's auth token and chosen classId).</p>
     <p><strong>Server (MVC):</strong> <code>RegistrationController</code> (REST endpoint <code>POST /api/enrollments</code>, verifies authentication/authorization); <code>RegistrationService</code> (business logic — validates the class exists and still has capacity, checks the student isn't already enrolled or double-booked on the same schedule slot, creates the Enrollment record); <code>ClassRepository</code> (read-only lookup for class schedule/capacity); <code>EnrollmentRepository</code> (persists the new Enrollment row and checks the student's existing enrollments for schedule conflicts).</p>
     <p><strong>Database:</strong> <code>Enrollment</code> table (written to), <code>Class</code> and <code>Subject</code> tables (read, for class details and schedule), and <code>Student</code> table (read, via the authenticated user's ID).</p>`,
    `<p><strong>Client:</strong> <code>SubjectRegistrationPage</code> (component React liệt kê lớp có sẵn, gửi đăng ký) và <code>RegistrationApiService</code> (gọi <code>POST /api/enrollments</code> kèm token xác thực sinh viên và classId chọn).</p>
     <p><strong>Server (MVC):</strong> <code>RegistrationController</code> (endpoint REST <code>POST /api/enrollments</code>, xác thực/phân quyền); <code>RegistrationService</code> (logic nghiệp vụ — kiểm tra lớp tồn tại và còn chỗ, kiểm tra sinh viên chưa đăng ký trùng hoặc trùng lịch, tạo bản ghi Enrollment); <code>ClassRepository</code> (tra cứu chỉ đọc lịch/sức chứa lớp); <code>EnrollmentRepository</code> (lưu dòng Enrollment mới và kiểm tra đăng ký hiện có của sinh viên để phát hiện trùng lịch).</p>
     <p><strong>Database:</strong> bảng <code>Enrollment</code> (được ghi), bảng <code>Class</code> và <code>Subject</code> (đọc, lấy chi tiết/lịch lớp), bảng <code>Student</code> (đọc, qua ID người dùng đã xác thực).</p>`,
  ),
  rubric: [
    { id: 'client_classes', criterion: B('Names at least one client-side component/service responsible for triggering and calling the register-subject request.', 'Nêu ít nhất 1 component/service phía client chịu trách nhiệm kích hoạt và gọi request đăng ký môn.'), weight: 1, maxScore: 0.2 },
    { id: 'server_mvc_classes', criterion: B('Correctly names and describes Controller, Service, and Repository classes with distinct, correct responsibilities.', 'Nêu đúng và mô tả Controller, Service, Repository với trách nhiệm rõ ràng, đúng vai trò.'), weight: 1, maxScore: 0.6 },
    { id: 'database_tables', criterion: B('Correctly identifies which tables are written (Enrollment) vs. only read (Class, Subject, Student) for this function.', 'Xác định đúng bảng nào được ghi (Enrollment) và bảng nào chỉ đọc (Class, Subject, Student) cho chức năng này.'), weight: 1, maxScore: 0.2 },
  ],
};

const q6 = {
  kind: 'WRITE', points: 2,
  prompt: B(
    `<p><strong>Part 2.2 (2 points):</strong> DRAW a sequence diagram for the "register subject" function between client and server (REST API), with authentication and authorization.</p>`,
    `<p><strong>Phần 2.2 (2 điểm):</strong> VẼ sequence diagram cho chức năng "đăng ký môn học" giữa client và server (REST API), có xác thực và phân quyền.</p>`,
  ),
  sampleSolution: B(
    MMD(`sequenceDiagram
    actor Student
    participant Client as ReactClient
    participant Ctrl as RegistrationController
    participant Auth as AuthMiddleware
    participant Svc as RegistrationService
    participant ClassRepo as ClassRepository
    participant EnrollRepo as EnrollmentRepository
    participant DB as Database

    Student->>Client: Select class & submit registration
    Client->>Ctrl: POST /api/enrollments (JWT token, classId)
    Ctrl->>Auth: Verify JWT token
    Auth-->>Ctrl: Authenticated (studentId, role=Student)
    Ctrl->>Auth: Check authorization (role must be Student)
    Auth-->>Ctrl: Authorized
    Ctrl->>Svc: registerSubject(studentId, classId)
    Svc->>ClassRepo: findById(classId)
    ClassRepo->>DB: SELECT * FROM Class WHERE classId = ?
    DB-->>ClassRepo: class row (schedule, capacity)
    ClassRepo-->>Svc: class
    Svc->>EnrollRepo: findByStudentId(studentId)
    EnrollRepo->>DB: SELECT * FROM Enrollment WHERE studentId = ?
    DB-->>EnrollRepo: existing enrollments
    EnrollRepo-->>Svc: existing enrollments
    Svc->>Svc: Validate capacity & schedule conflicts
    Svc->>EnrollRepo: save(new Enrollment(studentId, classId))
    EnrollRepo->>DB: INSERT INTO Enrollment
    DB-->>EnrollRepo: new enrollmentId
    EnrollRepo-->>Svc: created Enrollment
    Svc-->>Ctrl: Enrollment confirmation
    Ctrl-->>Client: 201 Created (enrollment JSON)
    Client-->>Student: Show registration confirmation`),
    MMD(`sequenceDiagram
    actor Student
    participant Client as ReactClient
    participant Ctrl as RegistrationController
    participant Auth as AuthMiddleware
    participant Svc as RegistrationService
    participant ClassRepo as ClassRepository
    participant EnrollRepo as EnrollmentRepository
    participant DB as Database

    Student->>Client: Chọn lớp & gửi đăng ký
    Client->>Ctrl: POST /api/enrollments (JWT token, classId)
    Ctrl->>Auth: Xác thực JWT token
    Auth-->>Ctrl: Đã xác thực (studentId, role=Student)
    Ctrl->>Auth: Kiểm tra phân quyền (role phải là Student)
    Auth-->>Ctrl: Đã cấp quyền
    Ctrl->>Svc: registerSubject(studentId, classId)
    Svc->>ClassRepo: findById(classId)
    ClassRepo->>DB: SELECT * FROM Class WHERE classId = ?
    DB-->>ClassRepo: dòng lớp (lịch, sức chứa)
    ClassRepo-->>Svc: class
    Svc->>EnrollRepo: findByStudentId(studentId)
    EnrollRepo->>DB: SELECT * FROM Enrollment WHERE studentId = ?
    DB-->>EnrollRepo: đăng ký hiện có
    EnrollRepo-->>Svc: đăng ký hiện có
    Svc->>Svc: Kiểm tra sức chứa & trùng lịch
    Svc->>EnrollRepo: save(new Enrollment(studentId, classId))
    EnrollRepo->>DB: INSERT INTO Enrollment
    DB-->>EnrollRepo: enrollmentId mới
    EnrollRepo-->>Svc: Enrollment đã tạo
    Svc-->>Ctrl: Xác nhận đăng ký
    Ctrl-->>Client: 201 Created (JSON đăng ký)
    Client-->>Student: Hiện xác nhận đăng ký`),
  ),
  explanation: B(
    `<p>Both authentication (verifying the JWT) and authorization (checking role) are drawn as distinct steps, as the paper explicitly requires. A schedule-conflict/capacity check against the student's existing enrollments is included as realistic business logic before the write, not a blind insert.</p>`,
    `<p>Cả xác thực (kiểm JWT) và phân quyền (kiểm vai trò) vẽ thành bước riêng, đúng yêu cầu rõ của đề. Kiểm tra trùng lịch/sức chứa so đăng ký hiện có của sinh viên được đưa vào như logic nghiệp vụ thật trước khi ghi, không phải chèn dữ liệu mù.</p>`,
  ),
  rubric: [
    { id: 'client_server_flow', criterion: B('Shows the correct client-to-server REST call flow (client request → controller → service → repository → database, and the response flowing back).', 'Thể hiện đúng luồng gọi REST client-tới-server (client gửi → controller → service → repository → database, và phản hồi đi ngược lại).'), weight: 1, maxScore: 0.6 },
    { id: 'auth_authz_present', criterion: B('Explicitly shows BOTH an authentication step AND an authorization step, as distinct steps.', 'Thể hiện rõ CẢ bước xác thực LẪN bước phân quyền, là 2 bước riêng.'), weight: 1, maxScore: 0.8 },
    { id: 'business_logic_steps', criterion: B('Includes a class-lookup and validation step (capacity/schedule) before creating the enrollment, reflecting real business logic.', 'Có bước tra cứu lớp và kiểm tra (sức chứa/trùng lịch) trước khi tạo đăng ký, phản ánh logic nghiệp vụ thật.'), weight: 1, maxScore: 0.6 },
  ],
};

const q7 = {
  kind: 'WRITE', points: 0.5,
  prompt: B(
    `<p><strong>Part 3.1 (0.5 points):</strong> read the explanation of a design pattern: <i>"Here is how it works: imagine that you created an object, but later decided to create a new one. Instead of receiving a fresh object, you get the one you already created."</i> What design pattern is this? Identify its name and pattern family (creational, structural, or behavioral).</p>`,
    `<p><strong>Phần 3.1 (0.5 điểm):</strong> đọc mô tả pattern: <i>"Cách nó hoạt động: tưởng tượng bạn đã tạo 1 đối tượng, nhưng sau đó quyết định tạo 1 cái mới. Thay vì nhận đối tượng mới, bạn nhận lại đúng cái đã tạo trước đó."</i> Đây là design pattern nào? Nêu tên và họ pattern (creational, structural, hay behavioral).</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Pattern:</strong> Singleton. <strong>Family:</strong> Creational.</p>
     <p>The giveaway: "creating a new one" doesn't actually create a new instance — a second creation attempt returns the already-existing instance, which is exactly Singleton's defining behavior (a class that ensures only one instance ever exists, exposed via a shared access point like <code>getInstance()</code>).</p>`,
    `<p><strong>Pattern:</strong> Singleton. <strong>Họ:</strong> Creational (khởi tạo).</p>
     <p>Dấu hiệu: "tạo 1 cái mới" thực ra không tạo instance mới — lần tạo thứ 2 trả về đúng instance đã có sẵn, đúng hành vi đặc trưng của Singleton (1 lớp đảm bảo chỉ tồn tại đúng 1 instance, truy cập qua 1 điểm chung như <code>getInstance()</code>).</p>`,
  ),
  rubric: [
    { id: 'correct_pattern_and_family', criterion: B('Correctly identifies Singleton as the pattern and Creational as its family.', 'Xác định đúng Singleton là pattern và Creational là họ của nó.'), weight: 1, maxScore: 1 },
  ],
};

const q8 = {
  kind: 'WRITE', points: 1,
  prompt: B(
    `<p><strong>Part 3.2 (1 point):</strong> write the pseudo code for this pattern.</p>`,
    `<p><strong>Phần 3.2 (1 điểm):</strong> viết pseudocode cho pattern này.</p>`,
  ),
  sampleSolution: B(
    CODE(`class Singleton {
    private static Singleton instance;

    private Singleton() {
        // private constructor prevents external instantiation
    }

    public static Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}`, 'java'),
    CODE(`class Singleton {
    private static Singleton instance;

    private Singleton() {
        // constructor riêng tư ngăn khởi tạo từ bên ngoài
    }

    public static Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}`, 'java'),
  ),
  rubric: [
    { id: 'private_constructor', criterion: B('Constructor is private, preventing direct external instantiation.', 'Constructor riêng tư (private), ngăn khởi tạo trực tiếp từ bên ngoài.'), weight: 1, maxScore: 0.4 },
    { id: 'static_instance_and_accessor', criterion: B('A static instance field holds the single instance, and a static accessor method (e.g. getInstance) creates it only once (lazily or eagerly) and returns the same instance on every call.', 'Có trường static giữ instance duy nhất, và phương thức truy cập static (VD getInstance) chỉ tạo 1 lần (lazy hoặc eager) và trả về đúng instance đó mọi lần gọi.'), weight: 1, maxScore: 0.6 },
  ],
};

const q9 = {
  kind: 'WRITE', points: 0.5,
  prompt: B(
    `<p><strong>Part 3.3 (0.5 points):</strong> describe a practical situation in software development where this pattern would be appropriate.</p>`,
    `<p><strong>Phần 3.3 (0.5 điểm):</strong> mô tả 1 tình huống thực tế trong phát triển phần mềm mà pattern này phù hợp.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Within this exact system:</strong> a shared <code>DatabaseConnectionPool</code> for the server — every repository (ClassRepository, EnrollmentRepository, etc.) should reuse the same connection-pool instance rather than each opening its own pool, since multiple pools would waste connections and could exceed the database's connection limit under load.</p>
     <p><strong>A different general example:</strong> an application-wide <code>ConfigurationManager</code> or <code>Logger</code> — every part of an application should read from and write to the exact same configuration/log state, so creating a second instance somewhere would silently desynchronize settings or split log output across two unrelated log files.</p>`,
    `<p><strong>Ngay trong hệ thống này:</strong> <code>DatabaseConnectionPool</code> dùng chung cho server — mọi repository (ClassRepository, EnrollmentRepository...) nên dùng lại đúng 1 instance connection pool thay vì mỗi cái tự mở pool riêng, vì nhiều pool sẽ lãng phí kết nối và có thể vượt giới hạn kết nối của database khi tải cao.</p>
     <p><strong>Một ví dụ tổng quát khác:</strong> <code>ConfigurationManager</code> hoặc <code>Logger</code> toàn ứng dụng — mọi phần của ứng dụng nên đọc/ghi đúng cùng 1 trạng thái cấu hình/log, nên tạo instance thứ 2 ở đâu đó sẽ âm thầm làm lệch cấu hình hoặc chia log ra 2 file log không liên quan.</p>`,
  ),
  rubric: [
    { id: 'valid_situation', criterion: B('Describes a genuine situation where exactly one shared instance is required across the application (shared resource, shared state, or global coordination point) — the defining use case for Singleton.', 'Mô tả tình huống thật cần đúng 1 instance dùng chung toàn ứng dụng (tài nguyên chung, trạng thái chung, hoặc điểm điều phối toàn cục) — đúng trường hợp dùng đặc trưng của Singleton.'), weight: 1, maxScore: 1 },
  ],
};

const spec = {
  course: { courseCode: 'SWD392' },
  exams: [{
    kind: 'PE',
    peType: 'WRITE',
    code: 'PE3',
    title: 'SWD392 – Practical Exam (Summer 2025, Retake 1), Student Management System|||SWD392 – Thi thực hành (Summer 2025, Retake 1), Hệ thống quản lý sinh viên',
    description: 'SWD392 PE (WRITE): ERD (conceptual/logical), state diagram, REST API class design, sequence diagram, and Singleton design-pattern analysis — diagrams rendered as Mermaid, AI-graded.|||PE SWD392 (viết): ERD (khái niệm/logic), sơ đồ trạng thái, thiết kế class REST API, sequence diagram, và phân tích design pattern Singleton — sơ đồ hiển thị dạng Mermaid, chấm AI.',
    durationMinutes: 90,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: null,
    attachmentName: null,
    instructions,
    isPublished: true,
    questions: [q1, q2, q3, q4, q5, q6, q7, q8, q9],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/WRITE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
