export default {
  "course": {
    "courseCode": "SWD392"
  },
  "exams": [
    {
      "kind": "PE",
      "peType": "WRITE",
      "code": "PE6",
      "title": "SWD392 – Practical Exam (Summer 2025, Retake), Student Management Administration Portal|||SWD392 – Thi thực hành (Summer 2025, Retake), Student Management Administration Portal",
      "description": "SWD392 PE (WRITE): class diagram with an association class, sequence diagram with UML analysis stereotypes, statechart diagram, software-architecture selection, and Observer design-pattern justification — diagrams rendered as Mermaid, AI-graded.|||PE SWD392 (viết): class diagram có association class, sequence diagram với stereotype phân tích UML, statechart diagram, chọn kiến trúc phần mềm, và lý giải design pattern Observer — sơ đồ hiển thị dạng Mermaid, chấm AI.",
      "durationMinutes": 90,
      "totalPoints": 10,
      "passMark": 5,
      "source": "FUOverflow",
      "attachmentUrl": null,
      "attachmentName": null,
      "instructions": "<div class=\"ml-en\"><p><strong>SWD392 – Practical Exam (Summer 2025, Retake) — Student Management Administration Portal, \"Cyber AI FPTx\"</strong>. You work as a software engineer continuing to develop features for this portal. UML tools (offline mode) may be used; the diagrams here are rendered as Mermaid directly in the exam viewer. This is a written practical exam — each answer is graded by an AI grader against the rubric shown per question.</p></div><div class=\"ml-vi\"><p><strong>SWD392 – Thi thực hành (Summer 2025, Retake) — Student Management Administration Portal, \"Cyber AI FPTx\"</strong>. Bạn là kỹ sư phần mềm tiếp tục phát triển tính năng cho cổng thông tin này. Có thể dùng công cụ UML (chế độ offline); sơ đồ ở đây hiển thị dạng Mermaid trực tiếp trong trình xem đề. Đây là bài thi thực hành dạng viết — mỗi câu trả lời được AI chấm theo tiêu chí ghi ở từng câu.</p></div>",
      "isPublished": true,
      "questions": [
        {
          "kind": "WRITE",
          "points": 3,
          "prompt": "<p><strong>Question 1 (3.0 points):</strong> Business Scenario: the system must capture how students, courses, and their grades relate to one another. A Student may enroll in many Courses, and each Course may have many enrolled Students. Whenever a Student finishes a Course, a GradeReport is created. This GradeReport is associated with exactly one Student and one Course, and it holds the final grade (e.g., '5.0', '6.0', '7.0', '8.0'). A GradeReport cannot exist unless both a Student and a Course are present. Task: create a Class Diagram that accurately represents this scenario — must include Student, Course, and GradeReport; give careful thought to the nature of the Student-Course relationship; GradeReport must be correctly modeled as an <b>Association Class</b>, with its connections and attributes displayed.</p>|||<p><strong>Câu 1 (3.0 điểm):</strong> Tình huống: hệ thống phải thể hiện quan hệ sinh viên, môn học, và điểm số. 1 Student có thể đăng ký nhiều Course, mỗi Course có thể có nhiều Student đăng ký. Khi Student hoàn tất 1 Course, 1 GradeReport được tạo. GradeReport gắn với đúng 1 Student và 1 Course, giữ điểm cuối (VD '5.0', '6.0', '7.0', '8.0'). GradeReport không thể tồn tại nếu thiếu 1 trong 2. Nhiệm vụ: tạo Class Diagram thể hiện đúng tình huống — phải có Student, Course, GradeReport; cân nhắc kỹ bản chất quan hệ Student-Course; GradeReport phải mô hình đúng là <b>Association Class</b>, có đủ kết nối và thuộc tính.</p>",
          "sampleSolution": "<pre class=\"mermaid\">classDiagram\n    class Student {\n        -studentId : int\n        -name : string\n    }\n    class Course {\n        -courseId : int\n        -courseName : string\n    }\n    class GradeReport {\n        <<AssociationClass>>\n        -gradeReportId : int\n        -finalGrade : string\n        -studentId : int\n        -courseId : int\n    }\n    Student \"1\" -- \"*\" Course : enrolls\n    Student \"1\" -- \"*\" GradeReport\n    Course \"1\" -- \"*\" GradeReport</pre>|||<pre class=\"mermaid\">classDiagram\n    class Student {\n        -studentId : int\n        -name : string\n    }\n    class Course {\n        -courseId : int\n        -courseName : string\n    }\n    class GradeReport {\n        <<AssociationClass>>\n        -gradeReportId : int\n        -finalGrade : string\n        -studentId : int\n        -courseId : int\n    }\n    Student \"1\" -- \"*\" Course : đăng ký\n    Student \"1\" -- \"*\" GradeReport\n    Course \"1\" -- \"*\" GradeReport</pre>",
          "explanation": "<p>Student-Course is fundamentally many-to-many (a student enrolls in many courses; a course has many students). Mermaid's classDiagram syntax has no native rendering for the standard UML \"association class\" connector (a dashed line from the association edge to the class box), so the <code>&lt;&lt;AssociationClass&gt;&gt;</code> stereotype plus explicit foreign-key-style attributes (studentId, courseId) on GradeReport is used as the standard textual workaround — semantically, GradeReport represents exactly one Student-Course pairing, which is the defining property of an association class (as opposed to an ordinary independent entity).</p>|||<p>Student-Course về bản chất là N-N (1 sinh viên đăng ký nhiều môn; 1 môn có nhiều sinh viên). Cú pháp classDiagram của Mermaid không có cách vẽ đường nối \"association class\" chuẩn UML (đường đứt nét từ cạnh quan hệ tới hộp class), nên dùng stereotype <code>&lt;&lt;AssociationClass&gt;&gt;</code> cộng thuộc tính kiểu khoá ngoại tường minh (studentId, courseId) trên GradeReport làm cách thay thế văn bản chuẩn — về ý nghĩa, GradeReport đại diện đúng 1 cặp Student-Course, đúng tính chất đặc trưng của association class (khác thực thể độc lập thông thường).</p>",
          "rubric": [
            {
              "id": "three_classes",
              "criterion": "Includes Student, Course, and GradeReport as classes.|||Có đủ Student, Course, GradeReport là các class.",
              "weight": 1,
              "maxScore": 0.6
            },
            {
              "id": "many_to_many_relationship",
              "criterion": "Correctly identifies and models the Student-Course relationship as many-to-many.|||Xác định và mô hình đúng quan hệ Student-Course là N-N.",
              "weight": 1,
              "maxScore": 0.8
            },
            {
              "id": "gradereport_as_association_class",
              "criterion": "GradeReport is correctly represented as (or clearly marked as functioning as) an association class tied to exactly one Student and one Course, holding the finalGrade attribute — not modeled as an unrelated independent entity.|||GradeReport được thể hiện đúng (hoặc đánh dấu rõ đóng vai trò) là association class gắn đúng 1 Student và 1 Course, giữ thuộc tính finalGrade — không mô hình như thực thể độc lập không liên quan.",
              "weight": 1,
              "maxScore": 1.6
            }
          ]
        },
        {
          "kind": "WRITE",
          "points": 3,
          "prompt": "<p><strong>Question 2 (3.0 points):</strong> Business Scenario: a student wishes to sign up for a new course through the portal. The student works with a <code>CourseRegistrationView</code> (boundary object), which forwards the chosen course ID to a <code>RegistrationController</code> (control object). Before proceeding, the controller verifies the student's eligibility (e.g., whether prerequisites have been met) by invoking a <code>PrerequisiteService</code> (service object). If the student is eligible, the controller then creates a new enrollment record using an <code>EnrollmentRepository</code> (entity object). Task: pick the most suitable UML diagram (Sequence or Communication) for clearly presenting the step-by-step, time-ordered flow of messages in this registration process, then draw your chosen diagram. Every object must be labeled with its correct application logic stereotype («boundary», «control», etc.).</p>|||<p><strong>Câu 2 (3.0 điểm):</strong> Tình huống: 1 sinh viên muốn đăng ký môn mới qua cổng. Sinh viên thao tác với <code>CourseRegistrationView</code> (boundary object), chuyển courseId đã chọn tới <code>RegistrationController</code> (control object). Trước khi tiếp tục, controller kiểm tra điều kiện sinh viên (VD đã đủ tiên quyết chưa) qua gọi <code>PrerequisiteService</code> (service object). Nếu đủ điều kiện, controller tạo bản ghi đăng ký mới qua <code>EnrollmentRepository</code> (entity object). Nhiệm vụ: chọn sơ đồ UML phù hợp nhất (Sequence hoặc Communication) để trình bày rõ luồng thông điệp theo thứ tự thời gian, rồi vẽ sơ đồ đã chọn. Mọi đối tượng phải gắn đúng stereotype logic ứng dụng («boundary», «control», v.v.).</p>",
          "sampleSolution": "<p><strong>Diagram chosen: Sequence Diagram</strong> — it is the more suitable choice here because the scenario is explicitly described as a step-by-step, time-ordered flow (the controller must check eligibility BEFORE creating the enrollment); a Sequence diagram makes this strict temporal ordering and the conditional branch (eligible vs. not) visually explicit via a vertical timeline and an alt fragment, which a Communication diagram (which emphasizes object links/topology over strict time-order) would present less clearly.</p><pre class=\"mermaid\">sequenceDiagram\n    actor Student\n    participant View as \"CourseRegistrationView «boundary»\"\n    participant Ctrl as \"RegistrationController «control»\"\n    participant Prereq as \"PrerequisiteService «control»\"\n    participant Repo as \"EnrollmentRepository «entity»\"\n\n    Student->>View: Select course (courseId)\n    View->>Ctrl: registerForCourse(studentId, courseId)\n    Ctrl->>Prereq: checkEligibility(studentId, courseId)\n    Prereq-->>Ctrl: eligible (true/false)\n\n    alt eligible\n        Ctrl->>Repo: createEnrollment(studentId, courseId)\n        Repo-->>Ctrl: enrollment created\n        Ctrl-->>View: registration confirmed\n        View-->>Student: Show confirmation\n    else not eligible\n        Ctrl-->>View: registration rejected (prerequisites not met)\n        View-->>Student: Show rejection message\n    end</pre>|||<p><strong>Sơ đồ chọn: Sequence Diagram</strong> — phù hợp hơn ở đây vì tình huống được mô tả rõ là luồng theo thứ tự thời gian từng bước (controller phải kiểm điều kiện TRƯỚC KHI tạo đăng ký); Sequence diagram thể hiện rõ ràng thứ tự thời gian nghiêm ngặt đó và nhánh điều kiện (đủ/không đủ) qua trục dọc thời gian và alt fragment, trong khi Communication diagram (nhấn mạnh liên kết/cấu trúc đối tượng hơn thứ tự thời gian nghiêm ngặt) sẽ trình bày kém rõ ràng hơn.</p><pre class=\"mermaid\">sequenceDiagram\n    actor Student\n    participant View as \"CourseRegistrationView «boundary»\"\n    participant Ctrl as \"RegistrationController «control»\"\n    participant Prereq as \"PrerequisiteService «control»\"\n    participant Repo as \"EnrollmentRepository «entity»\"\n\n    Student->>View: Chọn môn (courseId)\n    View->>Ctrl: registerForCourse(studentId, courseId)\n    Ctrl->>Prereq: checkEligibility(studentId, courseId)\n    Prereq-->>Ctrl: đủ điều kiện (true/false)\n\n    alt đủ điều kiện\n        Ctrl->>Repo: createEnrollment(studentId, courseId)\n        Repo-->>Ctrl: đã tạo đăng ký\n        Ctrl-->>View: đăng ký xác nhận\n        View-->>Student: Hiện xác nhận\n    else không đủ điều kiện\n        Ctrl-->>View: đăng ký bị từ chối (chưa đủ tiên quyết)\n        View-->>Student: Hiện thông báo từ chối\n    end</pre>",
          "explanation": "<p>PrerequisiteService is labeled «control» rather than a nonstandard stereotype: the 3 canonical analysis-level stereotypes are boundary/control/entity, and a \"service\" object performing business-rule logic (not raw data access, not UI) fits «control» — the same category as RegistrationController, just a delegate control object the main controller invokes.</p>|||<p>PrerequisiteService gắn «control» thay vì 1 stereotype không chuẩn: 3 stereotype mức phân tích chuẩn là boundary/control/entity, và 1 object \"service\" xử lý logic nghiệp vụ (không phải truy cập dữ liệu thô, không phải UI) khớp «control» — cùng nhóm với RegistrationController, chỉ là control object phụ mà controller chính gọi tới.</p>",
          "rubric": [
            {
              "id": "appropriate_diagram_chosen",
              "criterion": "Chooses Sequence Diagram (or gives a coherent, defensible justification if Communication is chosen) and explains the choice.|||Chọn Sequence Diagram (hoặc lý giải mạch lạc, hợp lý nếu chọn Communication) và giải thích lựa chọn.",
              "weight": 1,
              "maxScore": 0.4
            },
            {
              "id": "correct_stereotypes",
              "criterion": "All 4 objects (CourseRegistrationView, RegistrationController, PrerequisiteService, EnrollmentRepository) are labeled with the correct stereotype: boundary, control, control, and entity respectively.|||Cả 4 object (CourseRegistrationView, RegistrationController, PrerequisiteService, EnrollmentRepository) gắn đúng stereotype: boundary, control, control, entity tương ứng.",
              "weight": 1,
              "maxScore": 1
            },
            {
              "id": "correct_time_ordered_flow",
              "criterion": "Shows the correct step-by-step order: view forwards to controller, controller checks eligibility via the service BEFORE creating the enrollment via the repository, with a conditional branch for the ineligible case.|||Thể hiện đúng thứ tự từng bước: view chuyển cho controller, controller kiểm điều kiện qua service TRƯỚC KHI tạo đăng ký qua repository, có nhánh điều kiện cho trường hợp không đủ điều kiện.",
              "weight": 1,
              "maxScore": 1.6
            }
          ]
        },
        {
          "kind": "WRITE",
          "points": 2,
          "prompt": "<p><strong>Question 3 (2.0 points):</strong> Business Scenario: a student's academic standing (học lực) goes through a lifecycle driven by their GPA. A new student begins in the GoodStanding state. At the end of every semester, the GPA is recomputed. If the GPA drops below a certain threshold (e.g., 5.0), the student's status changes to AcademicWarning. When a student on AcademicWarning still has a GPA below the threshold in the following semester, they move to the AcademicProbation state. From either Warning or Probation, a GPA that climbs above the threshold brings the student back to the GoodStanding state. A student on Probation who fails to improve eventually reaches the final state of Dismissed. Task: draw a Statechart Diagram for the StudentAcademicStatus object — must show all 4 states (GoodStanding, AcademicWarning, AcademicProbation, Dismissed), and clearly label the events (e.g., gpaRecalculated) and guard conditions (e.g., [GPA &lt; 5.0]) that trigger the state changes.</p>|||<p><strong>Câu 3 (2.0 điểm):</strong> Tình huống: học lực sinh viên trải qua vòng đời theo GPA. Sinh viên mới bắt đầu ở GoodStanding. Cuối mỗi học kỳ, GPA được tính lại. Nếu GPA dưới ngưỡng (VD 5.0), trạng thái đổi thành AcademicWarning. Khi sinh viên đang AcademicWarning mà kỳ sau vẫn dưới ngưỡng, chuyển sang AcademicProbation. Từ Warning hoặc Probation, GPA vượt lên trên ngưỡng đưa sinh viên về lại GoodStanding. Sinh viên ở Probation không cải thiện cuối cùng tới trạng thái cuối Dismissed. Nhiệm vụ: vẽ Statechart Diagram cho đối tượng StudentAcademicStatus — phải có đủ 4 trạng thái (GoodStanding, AcademicWarning, AcademicProbation, Dismissed), gắn rõ sự kiện (VD gpaRecalculated) và điều kiện bảo vệ (VD [GPA &lt; 5.0]) kích hoạt chuyển trạng thái.</p>",
          "sampleSolution": "<pre class=\"mermaid\">stateDiagram-v2\n    [*] --> GoodStanding\n    GoodStanding --> AcademicWarning : gpaRecalculated [GPA < 5.0]\n    AcademicWarning --> GoodStanding : gpaRecalculated [GPA >= 5.0]\n    AcademicWarning --> AcademicProbation : gpaRecalculated [GPA < 5.0]\n    AcademicProbation --> GoodStanding : gpaRecalculated [GPA >= 5.0]\n    AcademicProbation --> Dismissed : gpaRecalculated [GPA < 5.0]\n    Dismissed --> [*]</pre>|||<pre class=\"mermaid\">stateDiagram-v2\n    [*] --> GoodStanding\n    GoodStanding --> AcademicWarning : gpaRecalculated [GPA < 5.0]\n    AcademicWarning --> GoodStanding : gpaRecalculated [GPA >= 5.0]\n    AcademicWarning --> AcademicProbation : gpaRecalculated [GPA < 5.0]\n    AcademicProbation --> GoodStanding : gpaRecalculated [GPA >= 5.0]\n    AcademicProbation --> Dismissed : gpaRecalculated [GPA < 5.0]\n    Dismissed --> [*]</pre>",
          "explanation": "<p>Every transition is triggered by the same event (<code>gpaRecalculated</code>, happening once per semester) but the guard condition and CURRENT state together determine the outcome: being already in AcademicWarning and still failing the threshold escalates to Probation (not a repeat of Warning), while being in GoodStanding and newly failing enters Warning for the first time — the state machine encodes \"how many consecutive semesters below threshold\" purely through which state the transition originates from, without needing an explicit counter attribute.</p>|||<p>Mọi chuyển trạng thái đều do cùng 1 sự kiện (<code>gpaRecalculated</code>, xảy ra 1 lần/học kỳ) nhưng điều kiện bảo vệ CỘNG trạng thái HIỆN TẠI cùng quyết định kết quả: đã ở AcademicWarning mà vẫn dưới ngưỡng thì lên Probation (không lặp lại Warning), còn đang GoodStanding mà mới dưới ngưỡng lần đầu thì vào Warning lần đầu — máy trạng thái mã hoá \"bao nhiêu kỳ liên tiếp dưới ngưỡng\" hoàn toàn qua việc chuyển tiếp bắt đầu từ trạng thái nào, không cần thuộc tính đếm tường minh.</p>",
          "rubric": [
            {
              "id": "all_four_states",
              "criterion": "Includes all 4 required states: GoodStanding, AcademicWarning, AcademicProbation, Dismissed, with Dismissed as a final state.|||Có đủ 4 trạng thái yêu cầu: GoodStanding, AcademicWarning, AcademicProbation, Dismissed, Dismissed là trạng thái cuối.",
              "weight": 1,
              "maxScore": 0.6
            },
            {
              "id": "events_and_guards_labeled",
              "criterion": "Every transition is labeled with the triggering event (gpaRecalculated) and the correct guard condition ([GPA < 5.0] or [GPA >= 5.0]).|||Mọi chuyển trạng thái gắn đúng sự kiện kích hoạt (gpaRecalculated) và điều kiện bảo vệ đúng ([GPA < 5.0] hoặc [GPA >= 5.0]).",
              "weight": 1,
              "maxScore": 0.8
            },
            {
              "id": "escalation_logic_correct",
              "criterion": "Correctly models the escalation logic: failing while already in Warning leads to Probation (not back to Warning), and failing while already in Probation leads to Dismissed — the \"still below threshold in the following semester\" progression.|||Mô hình đúng logic leo thang: trượt khi đã ở Warning thì lên Probation (không lặp Warning), trượt khi đã ở Probation thì tới Dismissed — đúng tiến trình \"vẫn dưới ngưỡng ở kỳ sau\".",
              "weight": 1,
              "maxScore": 0.6
            }
          ]
        },
        {
          "kind": "WRITE",
          "points": 1,
          "prompt": "<p><strong>Question 4 (1.0 point):</strong> the Student Management Portal is a typical web-based application. Its key requirements are a clear separation of concerns, easy maintainability, and the ability for different teams (UI designers, backend developers, database administrators) to work in parallel. The system should also be organized so that new developers can understand it quickly and get onboarded easily. Task: suggest a well-known, appropriate software architecture that best fits a traditional web application with these requirements. Name the architecture you select and explain why its structure is a good choice for this project. List one key advantage and one key disadvantage.</p>|||<p><strong>Câu 4 (1.0 điểm):</strong> Student Management Portal là ứng dụng web điển hình. Yêu cầu chính: tách biệt rõ mối quan tâm, dễ bảo trì, các nhóm khác nhau (thiết kế UI, backend, quản trị database) làm việc song song được. Hệ thống cũng cần tổ chức để dev mới hiểu nhanh và onboard dễ dàng. Nhiệm vụ: đề xuất 1 kiến trúc phần mềm nổi tiếng, phù hợp cho ứng dụng web truyền thống với các yêu cầu này. Nêu tên kiến trúc chọn và giải thích tại sao cấu trúc của nó là lựa chọn tốt cho dự án. Liệt kê 1 ưu điểm chính và 1 nhược điểm chính.</p>",
          "sampleSolution": "<p><strong>Architecture selected: Layered (N-tier) Architecture</strong> — presentation layer (UI), business logic layer (services/controllers), and data access layer (repositories/database), each with a clearly defined boundary.</p>\n     <p><strong>Why it fits:</strong> the layers map directly onto the team split described (UI designers own presentation, backend developers own the business logic layer, DB administrators own the data access layer), so each team can work largely independently as long as the interfaces between layers stay stable. It's also the most widely taught, most widely documented architecture for traditional web apps, so a new developer joining the team already has a strong mental model of where any given piece of code should live, speeding up onboarding.</p>\n     <p><strong>Advantage:</strong> clear separation of concerns makes the codebase easier to test and maintain — a change to the database schema, for example, is contained within the data access layer and shouldn't require touching the presentation layer.</p>\n     <p><strong>Disadvantage:</strong> a single business change can still ripple through multiple layers (e.g., adding one new field often means touching the entity, the repository, the service, and the UI form), and without discipline the layers can gradually blur into a tightly-coupled monolith rather than staying cleanly separated.</p>|||<p><strong>Kiến trúc chọn: Layered (N-tier) Architecture</strong> — tầng trình bày (UI), tầng logic nghiệp vụ (service/controller), và tầng truy cập dữ liệu (repository/database), mỗi tầng có ranh giới rõ ràng.</p>\n     <p><strong>Tại sao phù hợp:</strong> các tầng khớp trực tiếp với phân chia nhóm đề mô tả (nhóm UI phụ trách trình bày, backend phụ trách tầng logic nghiệp vụ, quản trị DB phụ trách tầng truy cập dữ liệu), nên mỗi nhóm làm việc phần lớn độc lập miễn interface giữa các tầng ổn định. Đây cũng là kiến trúc được dạy và tài liệu hoá rộng rãi nhất cho ứng dụng web truyền thống, nên dev mới gia nhập đã có mô hình tư duy vững về việc mã nào nên nằm ở đâu, giúp onboard nhanh hơn.</p>\n     <p><strong>Ưu điểm:</strong> tách biệt rõ mối quan tâm giúp codebase dễ test và bảo trì hơn — VD thay đổi schema database chỉ nằm trong tầng truy cập dữ liệu, không cần đụng tầng trình bày.</p>\n     <p><strong>Nhược điểm:</strong> 1 thay đổi nghiệp vụ vẫn có thể lan qua nhiều tầng (VD thêm 1 trường mới thường phải sửa entity, repository, service, và form UI), và nếu không kỷ luật thì các tầng dần mờ ranh giới thành monolith gắn chặt thay vì tách biệt sạch.</p>",
          "rubric": [
            {
              "id": "named_architecture_appropriate",
              "criterion": "Names a well-known architecture genuinely suited to a traditional web app with the stated requirements (Layered/N-tier is the natural fit; other well-justified choices like MVC can also be accepted).|||Nêu tên 1 kiến trúc nổi tiếng thực sự phù hợp ứng dụng web truyền thống với yêu cầu đề nêu (Layered/N-tier là khớp tự nhiên nhất; lựa chọn khác có lý giải tốt như MVC cũng chấp nhận được).",
              "weight": 1,
              "maxScore": 0.4
            },
            {
              "id": "explanation_ties_to_requirements",
              "criterion": "Explains why the chosen structure specifically supports separation of concerns, parallel team work, and fast onboarding — not a generic definition disconnected from the stated requirements.|||Giải thích tại sao cấu trúc chọn cụ thể hỗ trợ tách mối quan tâm, làm việc song song theo nhóm, và onboard nhanh — không phải định nghĩa chung chung tách rời yêu cầu đề nêu.",
              "weight": 1,
              "maxScore": 0.3
            },
            {
              "id": "advantage_and_disadvantage",
              "criterion": "Lists one genuine key advantage and one genuine key disadvantage of the chosen architecture.|||Nêu đủ 1 ưu điểm chính và 1 nhược điểm chính thật của kiến trúc chọn.",
              "weight": 1,
              "maxScore": 0.3
            }
          ]
        },
        {
          "kind": "WRITE",
          "points": 1,
          "prompt": "<p><strong>Question 5 (1.0 point):</strong> Business Scenario: imagine a specific course, \"SWD392\", which has a limited number of available seats. Many students are interested in this course. When a registered student drops the course, a seat becomes available. The system needs to immediately notify all students who are on the waiting list for this course, so they can try to register for the newly opened spot. The core Course object, which manages the available seats, should not need to know the specific details of which students are on the waiting list or how to contact them. It should simply \"announce\" that a seat has opened up. Task: identify and name a specific Behavioral Design Pattern that allows an object (the Course) to notify a list of dependent objects (the Students on the waiting list) of any state changes, without the Course object needing to know who its dependents are. Explain why this pattern is the best solution for this specific problem.</p>|||<p><strong>Câu 5 (1.0 điểm):</strong> Tình huống: 1 môn cụ thể, \"SWD392\", có số ghế trống giới hạn. Nhiều sinh viên quan tâm môn này. Khi 1 sinh viên đã đăng ký huỷ môn, 1 ghế trống ra. Hệ thống cần báo ngay cho mọi sinh viên trong danh sách chờ của môn này, để họ thử đăng ký suất vừa mở. Đối tượng Course cốt lõi, quản lý ghế trống, không nên cần biết chi tiết cụ thể sinh viên nào trong danh sách chờ hay cách liên hệ họ. Nó chỉ nên đơn giản \"thông báo\" rằng 1 ghế đã mở. Nhiệm vụ: xác định và nêu tên 1 Behavioral Design Pattern cụ thể cho phép 1 đối tượng (Course) báo cho danh sách đối tượng phụ thuộc (sinh viên trong danh sách chờ) về bất kỳ thay đổi trạng thái nào, mà Course không cần biết các đối tượng phụ thuộc là ai. Giải thích tại sao pattern này là giải pháp tốt nhất cho vấn đề cụ thể này.</p>",
          "sampleSolution": "<p><strong>Pattern:</strong> Observer.</p>\n     <p><strong>Why it's the best fit:</strong> Observer defines a one-to-many dependency where a subject (here, Course) maintains a list of observers through a common interface (e.g., <code>WaitlistObserver</code> with an <code>onSeatAvailable()</code> method) and, when its state changes (a seat opens), simply loops through that list calling the interface method — it never needs to know how many students are waiting, who they are, or how each one prefers to be contacted (email, SMS, in-app notification). Any student can subscribe or unsubscribe from the waiting list at runtime, and new notification channels can be added later just by adding a new class that implements the observer interface, without ever touching the Course class itself. This directly matches every constraint in the scenario: the Course only \"announces,\" and stays completely decoupled from its dependents' identities and contact details.</p>|||<p><strong>Pattern:</strong> Observer.</p>\n     <p><strong>Tại sao là lựa chọn tốt nhất:</strong> Observer định nghĩa quan hệ phụ thuộc 1-nhiều, nơi subject (ở đây, Course) giữ danh sách observer qua 1 interface chung (VD <code>WaitlistObserver</code> với phương thức <code>onSeatAvailable()</code>) và, khi trạng thái đổi (1 ghế mở), chỉ đơn giản lặp qua danh sách đó gọi phương thức interface — nó không bao giờ cần biết có bao nhiêu sinh viên đang chờ, họ là ai, hay mỗi người muốn được liên hệ thế nào (email, SMS, thông báo trong app). Bất kỳ sinh viên nào cũng có thể đăng ký/huỷ đăng ký danh sách chờ tại runtime, và kênh thông báo mới có thể thêm sau chỉ bằng cách thêm 1 class mới triển khai interface observer, không bao giờ đụng tới chính class Course. Điều này khớp trực tiếp mọi ràng buộc của tình huống: Course chỉ \"thông báo,\" và hoàn toàn tách biệt khỏi danh tính/chi tiết liên hệ của các đối tượng phụ thuộc.</p>",
          "rubric": [
            {
              "id": "correct_pattern_named",
              "criterion": "Correctly identifies Observer as the pattern.|||Xác định đúng Observer là pattern.",
              "weight": 1,
              "maxScore": 0.5
            },
            {
              "id": "why_explanation",
              "criterion": "Explains why Observer fits specifically because it decouples the subject (Course) from needing to know the identity/contact details of its dependents (waiting-list students), addressing the scenario's explicit constraint.|||Giải thích tại sao Observer phù hợp cụ thể vì nó tách subject (Course) khỏi việc cần biết danh tính/chi tiết liên hệ của các đối tượng phụ thuộc (sinh viên chờ), đúng ràng buộc rõ của tình huống.",
              "weight": 1,
              "maxScore": 0.5
            }
          ]
        }
      ]
    }
  ]
};
