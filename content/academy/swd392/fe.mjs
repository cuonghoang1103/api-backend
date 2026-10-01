/**
 * SWD392 · Thi cuối kỳ — đề TE 20 câu.
 * Quiz viết lại (20 câu, giữ slug swd392-final-exam-fe).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/SWD392/gen/gen.mjs từ gen/src/**, gen/java/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node SWD392/gen/gen.mjs`.
 */

import { bi } from './_slides.mjs';

/* ───────── 🎯 PE practice — 85-minute mock exam: Campus Clinic (5 questions as in the school template, solutions, marking guide) ───────── */
const L_x_luyen_pe = {
  title: '🎯 PE practice — 85-minute mock exam: Campus Clinic (5 questions as in the school template, solutions, marking guide)|||🎯 Luyện PE — đề mô phỏng 85 phút: Phòng khám trường (5 câu đúng khuôn đề mẫu, lời giải, barem chấm)',
  slug: 'swd392-luyen-pe',
  type: 'VIDEO',
  description: 'Một đề thi thực hành (PE, 20%, 85 phút) hoàn chỉnh theo đúng cấu trúc PE_template SU25 của trường — 5 câu 3.0/3.0/2.0/1.0/1.0 — trên case mới "FU Campus Clinic": class diagram mức entity (hợp thành, kết tập, tổng quát hoá, bội số), sequence diagram có stereotype và hai khung alt lồng nhau (kèm bản communication diagram nếu đề đổi), statechart của Appointment có sự kiện/điều kiện canh/hành động, đề xuất kiến trúc client/service nhiều tầng kèm một ưu một nhược, và nhận diện Chain of Responsibility có Java chạy thật. Có bảng chia giờ, lời giải từng câu bằng PlantUML dựng thật, barem tự chấm, lỗi mất điểm hay gặp, checklist trước khi nộp và cách quản lý 85 phút.',
  content: [
    bi(`<span class="eyebrow">Final exam · Practical Exam (PE) · Mock paper</span>
<h2>🎯 A full PE paper, built exactly like the school's template — do it with a timer first</h2>
<p class="lead">The PE is 20% of the subject, 85 minutes, and has its own pass gate (≥ 4). It is a <strong>design</strong> exam: you draw diagrams in a UML tool, write short justifications, and submit everything in one document. The school's sample paper (PE_template, SU25) has five questions on one scenario: a class diagram (3.0), a sequence or communication diagram (3.0), a statechart (2.0), an architecture proposal (1.0) and a design pattern (1.0). This page gives you one more paper with the same five questions on a new scenario, then a full solution, a marking guide and the mistakes that cost marks.</p>
<div class="callout"><strong>How to use this page.</strong>
<ol>
<li>Read only the exam paper below. Set a timer for 85 minutes. Do all five questions in the tool you will use in the exam room (PlantUML, Visual Paradigm, draw.io…) and paste them into one document.</li>
<li>Stop when the timer rings, even if you are not finished — the real exam will not wait either.</li>
<li>Mark yourself with the marking guide of each question. Write down every point you lost and why.</li>
<li>Re-draw only the lost parts the next day, without looking. Then try the other papers: the school sample (library), and the cinema paper in lesson 2.3.</li>
</ol></div>
<table>
<thead><tr><th>Question</th><th>Points</th><th>What it tests</th><th>Where it is taught</th></tr></thead>
<tbody>
<tr><td>Q1 class diagram, entity level</td><td>3.0</td><td>composition, aggregation, generalization, association, multiplicity</td><td>2.D–2.F (school Ch.7)</td></tr>
<tr><td>Q2 sequence or communication diagram</td><td>3.0</td><td>choosing the diagram, «boundary» «control» «entity» «service», alternatives</td><td>2.I–2.O (Ch.8–9)</td></tr>
<tr><td>Q3 statechart</td><td>2.0</td><td>states, events, guards, actions</td><td>2.P–2.S (Ch.10)</td></tr>
<tr><td>Q4 software architecture</td><td>1.0</td><td>naming a style, why, one advantage, one disadvantage</td><td>Chapter 3 (Ch.12–16, 20)</td></tr>
<tr><td>Q5 design pattern</td><td>1.0</td><td>recognising a GoF pattern from its intent, why it fits</td><td>Chapter 4 (patterns appendix)</td></tr>
</tbody>
</table>
<div class="pitfall">The two answers that fail most often are not the hard ones: Q4 and Q5 are worth 2.0 points together and need about 12 minutes — but students who spend 40 minutes on Q1 never reach them. Keep to the time plan below.</div>`,
    `<span class="eyebrow">Thi cuối kỳ · Practical Exam (PE) · Đề mô phỏng</span>
<h2>🎯 Một đề PE trọn vẹn, dựng đúng như khuôn đề mẫu của trường — làm có bấm giờ trước đã</h2>
<p class="lead">PE (thi thực hành) chiếm 20% môn, 85 phút, và có cổng qua riêng (≥ 4 điểm). Đây là bài thi <strong>thiết kế</strong>: bạn vẽ sơ đồ bằng công cụ UML, viết lập luận ngắn, rồi nộp tất cả trong một tài liệu. Đề mẫu của trường (PE_template, SU25) có năm câu trên một tình huống: class diagram (3.0), sequence hoặc communication diagram (3.0), statechart (2.0), đề xuất kiến trúc (1.0) và design pattern (1.0). Trang này cho bạn thêm một đề với đúng năm câu đó trên một tình huống mới, rồi lời giải đầy đủ, barem chấm và những lỗi làm mất điểm.</p>
<div class="callout"><strong>Cách dùng trang này.</strong>
<ol>
<li>Chỉ đọc phần đề thi bên dưới. Đặt đồng hồ 85 phút. Làm đủ năm câu bằng đúng công cụ bạn sẽ dùng trong phòng thi (PlantUML, Visual Paradigm, draw.io…) và dán vào một tài liệu.</li>
<li>Chuông reo thì dừng, kể cả khi chưa xong — đề thật cũng không chờ bạn.</li>
<li>Tự chấm bằng barem của từng câu. Ghi lại mọi điểm bị mất và lý do.</li>
<li>Hôm sau vẽ lại đúng những phần bị mất, không nhìn đáp án. Sau đó làm các đề khác: chính đề mẫu của trường (thư viện), và đề rạp phim ở bài 2.3.</li>
</ol></div>
<table>
<thead><tr><th>Câu</th><th>Điểm</th><th>Kiểm tra gì</th><th>Học ở đâu</th></tr></thead>
<tbody>
<tr><td>Q1 class diagram mức entity</td><td>3.0</td><td>hợp thành, kết tập, tổng quát hoá, liên kết, bội số</td><td>2.D–2.F (trường Ch.7)</td></tr>
<tr><td>Q2 sequence hoặc communication diagram</td><td>3.0</td><td>chọn đúng sơ đồ, «boundary» «control» «entity» «service», nhánh phụ</td><td>2.I–2.O (Ch.8–9)</td></tr>
<tr><td>Q3 statechart</td><td>2.0</td><td>trạng thái, sự kiện, điều kiện canh, hành động</td><td>2.P–2.S (Ch.10)</td></tr>
<tr><td>Q4 kiến trúc phần mềm</td><td>1.0</td><td>gọi tên kiểu kiến trúc, vì sao, một ưu, một nhược</td><td>Chương 3 (Ch.12–16, 20)</td></tr>
<tr><td>Q5 design pattern</td><td>1.0</td><td>nhận ra pattern GoF từ mục đích (intent) của nó, vì sao hợp</td><td>Chương 4 (phụ lục patterns)</td></tr>
</tbody>
</table>
<div class="pitfall">Hai câu hay trượt nhất lại không phải câu khó: Q4 và Q5 cộng lại 2.0 điểm và chỉ cần khoảng 12 phút — nhưng ai tiêu 40 phút cho Q1 thì không bao giờ tới được chúng. Giữ đúng kế hoạch thời gian bên dưới.</div>`),
    bi(`<h2>📝 The exam paper (85 minutes)</h2>
<pre><code class="language-plaintext">Practical Exam: SWD392 — mock paper                     Duration: 85 minutes
Instructions:
You are a software engineer at "Cyber AI FPTx" company. Your project is to build a new
Campus Clinic Management System for the university. Students book appointments in a mobile
app, doctors and nurses use a web app, and the counter staff use a desktop app. The system
must exchange data with the National Health Insurance System and with the university's
Student Information System.
Use your knowledge and provide real-world assumptions where needed.
Draw all diagrams using a UML tool. Submit your diagrams and written answers in a single document.

Question 1 (3.0 points)
Business Scenario: The Clinic is made up of Departments (General, Dental, Eye). Each Department
is a physical part of the clinic and cannot exist without it. A Department has one or more
ConsultationRooms, which also cannot exist without their department. A Department has a team of
Doctors; a doctor can be moved to another department, or work without a department during
training, and still works for the clinic. Patients can be either StudentPatient or StaffPatient
types, which have different attributes for insurance. Each Appointment is made by exactly one
Patient and is attended by exactly one Doctor; a patient or a doctor may have many appointments.
Task: Draw a Class Diagram at the entity level (showing only class names, no attributes).
Your diagram must show the relationships between Clinic, Department, ConsultationRoom, Doctor,
Patient, StudentPatient, StaffPatient and Appointment.
You must correctly show aggregation, composition, generalization and association relationships,
including multiplicities.

Question 2 (3.0 points)
Business Scenario: A student books a medical appointment in the ClinicApp (a boundary object).
The app calls an AppointmentController (a control object). The controller first checks the
student's health insurance with the InsuranceService (a service object). If the insurance is
valid, the controller asks the DoctorSchedule (an entity object) for a free slot in the chosen
department on the chosen date. If a slot is free, the controller reserves it and creates an
Appointment (an entity object), and the app shows the appointment code. If no slot is free, the
app shows the next available days. If the insurance is not valid, the app tells the student to
pay the full price at the counter.
Task: Choose the best UML diagram (Sequence or Communication) to clearly show the step-by-step,
time-ordered flow of messages for this process. Draw the diagram you have chosen. You must label
each object with its correct application logic stereotype («boundary», «control», etc.).

Question 3 (2.0 points)
Business Scenario: An appointment has a lifecycle. When it is created it is in the Booked state
and a confirmation is sent. One day before the visit the system sends a reminder; the appointment
stays Booked. If the patient cancels at least 2 hours before the visit, it becomes Cancelled and
the slot is released. If the patient has not checked in 15 minutes after the visit time, it
becomes NoShow, the slot is released and the patient's no-show count is increased. When the
patient checks in at the counter, it becomes Waiting and a queue number is given. When the doctor
calls the patient in, it becomes InConsultation and the medical record is opened. When the doctor
finishes and saves the prescription, it becomes Completed.
Task: Draw a Statechart Diagram for an Appointment object.
Your diagram must show all the states: Booked, Waiting, InConsultation, Completed, Cancelled, NoShow.
Clearly label the events that trigger the state changes and the actions that occur.

Question 4 (1.0 point)
Task: Propose a suitable software architecture for the Campus Clinic Management System.
Name the architecture you choose.
Explain why this architecture is a good choice for this project. Then, list one key advantage
and one key disadvantage.

Question 5 (1.0 point)
Business Scenario: A request for medicine from the clinic stock must be approved. A Nurse can
approve up to 10 units, a Doctor up to 50 units, and the Clinic Head any amount. The screen that
sends the request must not know who will approve it, and new approval levels (for example a
Pharmacist) will be added later without changing the sending code.
Task: Identify and name a specific Design Pattern that avoids coupling the sender of a request to
its receiver by giving more than one object a chance to handle the request, passing the request
along a chain until an object handles it. Explain why this pattern is the best solution for this
specific problem.

END OF EXAMINATION</code></pre>
<table>
<thead><tr><th>Minutes</th><th>Do this</th></tr></thead>
<tbody>
<tr><td>0–5</td><td>Read all five questions once. Underline: "cannot exist without" / "physical part" (composition), "can be moved … still" (aggregation), "either … types" (generalization), every "exactly one" / "many", every stereotype in Q2, every state, event, condition and action in Q3.</td></tr>
<tr><td>5–27</td><td>Q1 (3.0). List the 8 classes, then draw one relationship per sentence of the scenario. Check every diamond end and every multiplicity before moving on.</td></tr>
<tr><td>27–50</td><td>Q2 (3.0). Write "Sequence diagram — because the task asks for a time-ordered flow" first. Lifelines with stereotypes, numbered messages, two alt fragments.</td></tr>
<tr><td>50–65</td><td>Q3 (2.0). Six states, initial and final states, then one arrow per sentence: event [guard] / action.</td></tr>
<tr><td>65–72</td><td>Q4 (1.0). Four short sentences: name, why, one advantage, one disadvantage.</td></tr>
<tr><td>72–78</td><td>Q5 (1.0). Pattern name, its roles mapped to this problem, why it fits (the scenario's own words).</td></tr>
<tr><td>78–85</td><td>Checklist at the end of this page; export the diagrams as images into the one document and save it.</td></tr>
</tbody>
</table>`,
    `<h2>📝 Đề thi (85 phút)</h2>
<p>Đề viết bằng tiếng Anh giống đề thật (đề trường ghi rõ "the language level of this exam is designed to be clear and simple" — mức tiếng Anh rõ ràng, đơn giản). Tóm nghĩa từng câu ở ngay dưới khung đề.</p>
<pre><code class="language-plaintext">Practical Exam: SWD392 — mock paper                     Duration: 85 minutes
Instructions:
You are a software engineer at "Cyber AI FPTx" company. Your project is to build a new
Campus Clinic Management System for the university. Students book appointments in a mobile
app, doctors and nurses use a web app, and the counter staff use a desktop app. The system
must exchange data with the National Health Insurance System and with the university's
Student Information System.
Use your knowledge and provide real-world assumptions where needed.
Draw all diagrams using a UML tool. Submit your diagrams and written answers in a single document.

Question 1 (3.0 points)
Business Scenario: The Clinic is made up of Departments (General, Dental, Eye). Each Department
is a physical part of the clinic and cannot exist without it. A Department has one or more
ConsultationRooms, which also cannot exist without their department. A Department has a team of
Doctors; a doctor can be moved to another department, or work without a department during
training, and still works for the clinic. Patients can be either StudentPatient or StaffPatient
types, which have different attributes for insurance. Each Appointment is made by exactly one
Patient and is attended by exactly one Doctor; a patient or a doctor may have many appointments.
Task: Draw a Class Diagram at the entity level (showing only class names, no attributes).
Your diagram must show the relationships between Clinic, Department, ConsultationRoom, Doctor,
Patient, StudentPatient, StaffPatient and Appointment.
You must correctly show aggregation, composition, generalization and association relationships,
including multiplicities.

Question 2 (3.0 points)
Business Scenario: A student books a medical appointment in the ClinicApp (a boundary object).
The app calls an AppointmentController (a control object). The controller first checks the
student's health insurance with the InsuranceService (a service object). If the insurance is
valid, the controller asks the DoctorSchedule (an entity object) for a free slot in the chosen
department on the chosen date. If a slot is free, the controller reserves it and creates an
Appointment (an entity object), and the app shows the appointment code. If no slot is free, the
app shows the next available days. If the insurance is not valid, the app tells the student to
pay the full price at the counter.
Task: Choose the best UML diagram (Sequence or Communication) to clearly show the step-by-step,
time-ordered flow of messages for this process. Draw the diagram you have chosen. You must label
each object with its correct application logic stereotype («boundary», «control», etc.).

Question 3 (2.0 points)
Business Scenario: An appointment has a lifecycle. When it is created it is in the Booked state
and a confirmation is sent. One day before the visit the system sends a reminder; the appointment
stays Booked. If the patient cancels at least 2 hours before the visit, it becomes Cancelled and
the slot is released. If the patient has not checked in 15 minutes after the visit time, it
becomes NoShow, the slot is released and the patient's no-show count is increased. When the
patient checks in at the counter, it becomes Waiting and a queue number is given. When the doctor
calls the patient in, it becomes InConsultation and the medical record is opened. When the doctor
finishes and saves the prescription, it becomes Completed.
Task: Draw a Statechart Diagram for an Appointment object.
Your diagram must show all the states: Booked, Waiting, InConsultation, Completed, Cancelled, NoShow.
Clearly label the events that trigger the state changes and the actions that occur.

Question 4 (1.0 point)
Task: Propose a suitable software architecture for the Campus Clinic Management System.
Name the architecture you choose.
Explain why this architecture is a good choice for this project. Then, list one key advantage
and one key disadvantage.

Question 5 (1.0 point)
Business Scenario: A request for medicine from the clinic stock must be approved. A Nurse can
approve up to 10 units, a Doctor up to 50 units, and the Clinic Head any amount. The screen that
sends the request must not know who will approve it, and new approval levels (for example a
Pharmacist) will be added later without changing the sending code.
Task: Identify and name a specific Design Pattern that avoids coupling the sender of a request to
its receiver by giving more than one object a chance to handle the request, passing the request
along a chain until an object handles it. Explain why this pattern is the best solution for this
specific problem.

END OF EXAMINATION</code></pre>
<p><em>Tóm nghĩa đề.</em> <strong>Bối cảnh</strong>: xây hệ thống quản lý phòng khám của trường; sinh viên đặt lịch trên app điện thoại, bác sĩ và y tá dùng web, quầy tiếp đón dùng app máy tính; hệ thống trao đổi dữ liệu với Bảo hiểm y tế quốc gia và hệ thống thông tin sinh viên của trường. <strong>Câu 1</strong> — phòng khám gồm các khoa (bộ phận vật lý, không tồn tại nếu không có phòng khám); khoa có một hoặc nhiều phòng khám bệnh (cũng không tồn tại nếu không có khoa); khoa có một nhóm bác sĩ, bác sĩ có thể chuyển khoa hoặc không thuộc khoa nào khi đang tập huấn mà vẫn làm cho phòng khám; bệnh nhân có hai loại (sinh viên, cán bộ); mỗi lịch hẹn do đúng một bệnh nhân đặt và đúng một bác sĩ khám, một bệnh nhân hay một bác sĩ có thể có nhiều lịch hẹn — vẽ class diagram mức entity (chỉ tên lớp). <strong>Câu 2</strong> — sinh viên đặt lịch: kiểm tra bảo hiểm; hợp lệ thì tìm giờ trống, có thì giữ giờ, tạo lịch hẹn, hiện mã; không có thì hiện các ngày còn trống; bảo hiểm không hợp lệ thì báo trả đủ tiền ở quầy — chọn sequence hay communication, vẽ, ghi stereotype. <strong>Câu 3</strong> — vòng đời lịch hẹn qua sáu trạng thái — vẽ statechart, ghi rõ sự kiện và hành động. <strong>Câu 4</strong> — đề xuất kiến trúc, lý do, một ưu, một nhược. <strong>Câu 5</strong> — yêu cầu xuất thuốc phải được duyệt theo cấp (y tá ≤ 10, bác sĩ ≤ 50, trưởng phòng khám không giới hạn), màn hình gửi không được biết ai duyệt, sau này thêm cấp mới (dược sĩ) mà không sửa code gửi — gọi tên pattern "chuyền yêu cầu dọc một chuỗi tới khi có đối tượng xử lý" và giải thích.</p>
<table>
<thead><tr><th>Phút</th><th>Làm gì</th></tr></thead>
<tbody>
<tr><td>0–5</td><td>Đọc cả năm câu một lượt. Gạch chân: "cannot exist without" / "physical part" (hợp thành), "can be moved … still" (kết tập), "either … types" (tổng quát hoá), mọi "exactly one" / "many", mọi stereotype ở Q2, mọi trạng thái, sự kiện, điều kiện, hành động ở Q3.</td></tr>
<tr><td>5–27</td><td>Q1 (3.0). Liệt kê 8 lớp, rồi mỗi câu của tình huống vẽ một quan hệ. Soát từng đầu hình thoi và từng bội số trước khi sang câu sau.</td></tr>
<tr><td>27–50</td><td>Q2 (3.0). Viết trước câu "Sequence diagram — vì đề yêu cầu luồng theo thứ tự thời gian". Đường đời có stereotype, thông điệp đánh số, hai khung alt.</td></tr>
<tr><td>50–65</td><td>Q3 (2.0). Sáu trạng thái, trạng thái đầu và cuối, rồi mỗi câu một mũi tên: event [guard] / action.</td></tr>
<tr><td>65–72</td><td>Q4 (1.0). Bốn câu ngắn: tên, vì sao, một ưu, một nhược.</td></tr>
<tr><td>72–78</td><td>Q5 (1.0). Tên pattern, các vai của nó gán vào bài toán này, vì sao hợp (dùng chính chữ của đề).</td></tr>
<tr><td>78–85</td><td>Checklist cuối trang; xuất sơ đồ thành ảnh vào một tài liệu và lưu lại.</td></tr>
</tbody>
</table>`),
    bi(`<h3>✅ Question 1 — class diagram (3.0 points)</h3>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/aa52ee8a6b44257c80d75a28fb9ecd0663169a4b.svg" alt="PE mock Q1 — Campus Clinic class diagram (entity level)" loading="lazy" /><p class="chu-thich">🧩 PE mock Q1 — Campus Clinic class diagram (entity level)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' PE mock, question 1 solution — entity-level class diagram (names only): composition, aggregation, generalization, plain association, all multiplicities
title PE mock Q1 — Campus Clinic class diagram (entity level)
hide circle
hide empty members
class Clinic
class Department
class ConsultationRoom
class Doctor
class Patient
class StudentPatient
class StaffPatient
class Appointment
Clinic "1" *-- "1..*" Department : is made up of &gt;
Department "1" *-- "1..*" ConsultationRoom : has &gt;
Department "0..1" o-right- "1..*" Doctor : has team of &gt;
Appointment "0..*" -down- "1" Patient : made by &gt;
Doctor "1" -down- "0..*" Appointment : attends &gt;
StudentPatient -up-|&gt; Patient
StaffPatient -up-|&gt; Patient
@enduml</code></pre></details>
<p><strong>From sentence to relationship.</strong> Read the scenario one sentence at a time; each sentence gives exactly one line of the diagram.</p>
<table>
<thead><tr><th>Sentence in the scenario</th><th>Relationship</th><th>Multiplicity (whole … part)</th></tr></thead>
<tbody>
<tr><td>"Clinic is made up of Departments … physical part … cannot exist without it"</td><td>composition, filled diamond at Clinic</td><td>1 … 1..*</td></tr>
<tr><td>"A Department has one or more ConsultationRooms, which also cannot exist without their department"</td><td>composition, filled diamond at Department</td><td>1 … 1..* ("one or more")</td></tr>
<tr><td>"A Department has a team of Doctors; a doctor can be moved … or work without a department … and still works"</td><td>aggregation, hollow diamond at Department</td><td>0..1 … 1..* ("without a department" ⇒ 0)</td></tr>
<tr><td>"Patients can be either StudentPatient or StaffPatient types"</td><td>generalization, hollow triangle at Patient</td><td>none (generalization has no multiplicity)</td></tr>
<tr><td>"Each Appointment is made by exactly one Patient … a patient may have many"</td><td>association</td><td>Patient 1 … 0..* Appointment</td></tr>
<tr><td>"… attended by exactly one Doctor … a doctor may have many"</td><td>association</td><td>Doctor 1 … 0..* Appointment</td></tr>
</tbody>
</table>
<p><strong>Why Appointment is a plain association, not a part.</strong> An appointment is not a physical part of a patient or of a doctor; it links the two. Drawing a diamond on it is a common way to lose the "association" mark. Why 0..* and not 1..*: a newly registered patient has no appointment yet.</p>
<p class="nhan">Marking guide (self-made, for self-assessment — the school does not publish its PE marking scheme)</p>
<table>
<thead><tr><th>Item</th><th>Points</th></tr></thead>
<tbody>
<tr><td>Clinic ◆— Department, diamond at Clinic, 1 / 1..*</td><td>0.5</td></tr>
<tr><td>Department ◆— ConsultationRoom, diamond at Department, 1 / 1..*</td><td>0.5</td></tr>
<tr><td>Department ◇— Doctor, hollow diamond at Department, 0..1 / 1..*</td><td>0.5</td></tr>
<tr><td>StudentPatient and StaffPatient → Patient, one hollow triangle each, at Patient</td><td>0.5</td></tr>
<tr><td>Patient 1 — 0..* Appointment and Doctor 1 — 0..* Appointment, plain lines</td><td>0.5</td></tr>
<tr><td>Entity level respected (names only), all eight classes present, every association end has a multiplicity</td><td>0.5</td></tr>
</tbody>
</table>
<div class="pitfall"><strong>Where Q1 loses marks</strong>: the diamond drawn at the part end (it always sits at the whole); composition used for Doctor because "a department has doctors" — the words "can be moved … still works" make it aggregation; 1 instead of 0..1 at the Department end of the aggregation; generalization arrows pointing down to the subclasses; attributes written although "no attributes" was asked; missing multiplicities on the two associations.</div>`,
    `<h3>✅ Câu 1 — class diagram (3.0 điểm)</h3>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/aa52ee8a6b44257c80d75a28fb9ecd0663169a4b.svg" alt="PE mock Q1 — Campus Clinic class diagram (entity level)" loading="lazy" /><p class="chu-thich">🧩 PE mock Q1 — Campus Clinic class diagram (entity level)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Đề luyện PE, lời giải câu 1 — class diagram mức entity (chỉ tên lớp): hợp thành, kết tập, tổng quát hoá, liên kết thường, đủ bội số
title PE mock Q1 — Campus Clinic class diagram (entity level)
hide circle
hide empty members
class Clinic
class Department
class ConsultationRoom
class Doctor
class Patient
class StudentPatient
class StaffPatient
class Appointment
Clinic "1" *-- "1..*" Department : is made up of &gt;
Department "1" *-- "1..*" ConsultationRoom : has &gt;
Department "0..1" o-right- "1..*" Doctor : has team of &gt;
Appointment "0..*" -down- "1" Patient : made by &gt;
Doctor "1" -down- "0..*" Appointment : attends &gt;
StudentPatient -up-|&gt; Patient
StaffPatient -up-|&gt; Patient
@enduml</code></pre></details>
<p><strong>Từ câu chữ sang quan hệ.</strong> Đọc tình huống từng câu một; mỗi câu cho đúng một đường trên sơ đồ.</p>
<table>
<thead><tr><th>Câu trong tình huống</th><th>Quan hệ</th><th>Bội số (tổng thể … bộ phận)</th></tr></thead>
<tbody>
<tr><td>"Clinic is made up of Departments … physical part … cannot exist without it" (là bộ phận vật lý, không tồn tại nếu thiếu phòng khám)</td><td>hợp thành (composition), thoi đặc ở Clinic</td><td>1 … 1..*</td></tr>
<tr><td>"A Department has one or more ConsultationRooms, which also cannot exist without their department"</td><td>hợp thành, thoi đặc ở Department</td><td>1 … 1..* ("một hoặc nhiều")</td></tr>
<tr><td>"A Department has a team of Doctors; a doctor can be moved … or work without a department … and still works" (chuyển khoa được, không thuộc khoa nào vẫn làm việc)</td><td>kết tập (aggregation), thoi rỗng ở Department</td><td>0..1 … 1..* ("không thuộc khoa nào" ⇒ 0)</td></tr>
<tr><td>"Patients can be either StudentPatient or StaffPatient types" (hai loại bệnh nhân)</td><td>tổng quát hoá (generalization), tam giác rỗng ở Patient</td><td>không có (tổng quát hoá không ghi bội số)</td></tr>
<tr><td>"Each Appointment is made by exactly one Patient … a patient may have many"</td><td>liên kết (association)</td><td>Patient 1 … 0..* Appointment</td></tr>
<tr><td>"… attended by exactly one Doctor … a doctor may have many"</td><td>liên kết</td><td>Doctor 1 … 0..* Appointment</td></tr>
</tbody>
</table>
<p><strong>Vì sao Appointment là liên kết thường, không phải bộ phận.</strong> Lịch hẹn không phải bộ phận vật lý của bệnh nhân hay bác sĩ; nó nối hai bên lại. Vẽ hình thoi lên nó là cách hay gặp để mất điểm "association". Vì sao 0..* mà không 1..*: bệnh nhân vừa đăng ký thì chưa có lịch hẹn nào.</p>
<p class="nhan">Barem chấm (tự soạn để tự chấm — trường không công bố barem PE)</p>
<table>
<thead><tr><th>Mục</th><th>Điểm</th></tr></thead>
<tbody>
<tr><td>Clinic ◆— Department, thoi ở Clinic, 1 / 1..*</td><td>0.5</td></tr>
<tr><td>Department ◆— ConsultationRoom, thoi ở Department, 1 / 1..*</td><td>0.5</td></tr>
<tr><td>Department ◇— Doctor, thoi rỗng ở Department, 0..1 / 1..*</td><td>0.5</td></tr>
<tr><td>StudentPatient và StaffPatient → Patient, mỗi lớp một tam giác rỗng, đặt ở Patient</td><td>0.5</td></tr>
<tr><td>Patient 1 — 0..* Appointment và Doctor 1 — 0..* Appointment, nét liền thường</td><td>0.5</td></tr>
<tr><td>Đúng mức entity (chỉ tên), đủ tám lớp, đầu nào của liên kết cũng có bội số</td><td>0.5</td></tr>
</tbody>
</table>
<div class="pitfall"><strong>Chỗ Q1 hay mất điểm</strong>: hình thoi vẽ ở phía bộ phận (thoi luôn nằm ở phía tổng thể); dùng hợp thành cho Doctor vì "khoa có bác sĩ" — cụm "can be moved … still works" biến nó thành kết tập; ghi 1 thay vì 0..1 ở đầu Department của quan hệ kết tập; mũi tên tổng quát hoá chĩa xuống lớp con; ghi thuộc tính dù đề bảo "no attributes"; thiếu bội số trên hai liên kết.</div>`),
    bi(`<h3>✅ Question 2 — sequence diagram (3.0 points)</h3>
<p><strong>First sentence of your answer</strong>: "I choose a <em>sequence diagram</em>, because the task asks for the step-by-step, time-ordered flow of messages: time runs down the page, so the order is visible without reading numbers." A communication diagram shows the same messages but emphasises which objects are linked; its order exists only in the numbers.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/136ceb443b477b46e719de5a8d79679cda6ff213.svg" alt="PE mock Q2 — Book Appointment sequence diagram" loading="lazy" /><p class="chu-thich">🧩 PE mock Q2 — Book Appointment sequence diagram</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' PE mock, question 2 solution — sequence diagram; every object carries the stereotype given in the scenario; two nested alt fragments
title PE mock Q2 — Book Appointment sequence diagram
actor Student
boundary ":ClinicApp" as APP &lt;&lt;boundary&gt;&gt;
control ":AppointmentController" as C &lt;&lt;control&gt;&gt;
participant ":InsuranceService" as INS &lt;&lt;service&gt;&gt;
entity ":DoctorSchedule" as DS &lt;&lt;entity&gt;&gt;
entity ":Appointment" as AP &lt;&lt;entity&gt;&gt;
Student -&gt; APP : 1: request appointment(department, date)
APP -&gt; C : 2: bookAppointment(studentId, department, date)
C -&gt; INS : 3: checkInsurance(studentId)
INS --&gt; C : 4: insuranceStatus
alt insurance valid
  C -&gt; DS : 5: findFreeSlot(department, date)
  DS --&gt; C : 6: slot (or none)
  alt free slot found
    C -&gt; DS : 7: reserve(slot)
    C -&gt; AP ** : 8: create(studentId, doctor, slot)
    C --&gt; APP : 9: appointmentCode
    APP --&gt; Student : 10: show appointment code
  else no free slot
    C -&gt; DS : 7a: nextAvailableDays(department)
    DS --&gt; C : 8a: days
    C --&gt; APP : 9a: days
    APP --&gt; Student : 10a: show next available days
  end
else insurance not valid
  C --&gt; APP : 5b: insuranceInvalid
  APP --&gt; Student : 6b: ask to pay full price at the counter
end
@enduml</code></pre></details>
<p><strong>How it was built.</strong></p>
<ol>
<li>Lifelines in the order they first act: the actor Student, then <code>:ClinicApp «boundary»</code>, <code>:AppointmentController «control»</code>, <code>:InsuranceService «service»</code>, <code>:DoctorSchedule «entity»</code>, <code>:Appointment «entity»</code>. The stereotypes are given in the scenario — copy them exactly; the question says you <em>must</em> label them.</li>
<li>One message per verb of the scenario: request → book → checkInsurance → findFreeSlot → reserve → create → show.</li>
<li>Two conditions in the text ("if the insurance is valid", "if a slot is free") ⇒ two <code>alt</code> fragments, the second nested inside the first branch. Each operand has a guard in brackets.</li>
<li>The Appointment lifeline starts at the <code>create</code> message (it does not exist before), and only in the "free slot found" branch.</li>
<li>Numbering: 1, 2, 3… on the main path; 7a, 8a… for the "no free slot" alternative; 5b, 6b for "insurance not valid" — the same convention as the use case alternative sequences in Ch.9.</li>
</ol>
<p class="nhan">If the paper had asked for a communication diagram</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/cf743afab40ed8b9c28e4b4d939eeb1f970d3ee7.svg" alt="PE mock Q2 (variant) — Book Appointment communication diagram (main path)" loading="lazy" /><p class="chu-thich">🧩 PE mock Q2 (variant) — Book Appointment communication diagram (main path)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' PE mock, question 2 variant — the same main success path as a communication diagram (PlantUML has no such type: objects are rectangles, the arrow in each label gives the direction)
title PE mock Q2 (variant) — Book Appointment communication diagram (main path)
left to right direction
actor Student as S
rectangle ":ClinicApp\\n&lt;&lt;boundary&gt;&gt;" as APP
rectangle ":AppointmentController\\n&lt;&lt;control&gt;&gt;" as C
rectangle ":InsuranceService\\n&lt;&lt;service&gt;&gt;" as INS
rectangle ":DoctorSchedule\\n&lt;&lt;entity&gt;&gt;" as DS
rectangle ":Appointment\\n&lt;&lt;entity&gt;&gt;" as AP
S -- APP : "1: request appointment ▶\\n◀ 10: appointment code"
APP -- C : "2: bookAppointment ▶\\n◀ 9: appointmentCode"
C -- INS : "3: checkInsurance ▶\\n◀ 4: valid"
C -- DS : "5: findFreeSlot ▶\\n◀ 6: slot\\n7: reserve ▶"
C -- AP : "8: create ▶"
@enduml</code></pre></details>
<p>Same objects and stereotypes, drawn as boxes joined by links; each link carries its numbered messages with a direction arrow. Use it when the question stresses "which objects collaborate" (structure). Alternatives are shown by the a/b numbers, not by fragments — which is exactly why it is the weaker choice for this question.</p>
<p class="nhan">Marking guide (self-made)</p>
<table>
<thead><tr><th>Item</th><th>Points</th></tr></thead>
<tbody>
<tr><td>Chooses sequence and gives the reason (time-ordered)</td><td>0.5</td></tr>
<tr><td>Six participants with the correct stereotypes (actor, «boundary», «control», «service», «entity» × 2)</td><td>0.75</td></tr>
<tr><td>Main-path messages in the scenario's order, named and numbered</td><td>0.75</td></tr>
<tr><td>Both conditions shown as alt fragments with guards (nested correctly)</td><td>0.5</td></tr>
<tr><td>Appointment created only in the success branch; replies shown; slot reserved before creation</td><td>0.5</td></tr>
</tbody>
</table>
<div class="pitfall"><strong>Where Q2 loses marks</strong>: choosing communication although the task says "time-ordered"; no stereotypes, or «entity» on the controller; the student talking directly to the controller (the boundary is skipped); drawing only the happy path — the two "if" sentences are worth a quarter of the question; using <code>opt</code> for a two-way choice (opt has one branch; "valid / not valid" needs <code>alt</code>); Appointment drawn from the top as if it already existed.</div>
<div class="callout">🧭 <strong>Apply it to LabFlow</strong> (illustration): "Reserve Equipment" has the same shape — <code>ReservationController</code> («control») checks the member with a service, asks the schedule entity for a free slot, then either creates a <code>Reservation</code> or offers the waitlist. Drawing it once as a sequence diagram gives you the method list of your Spring <code>ReservationService</code>.</div>`,
    `<h3>✅ Câu 2 — sequence diagram (3.0 điểm)</h3>
<p><strong>Câu đầu tiên của bài làm</strong>: "Tôi chọn <em>sequence diagram</em> (sơ đồ tuần tự), vì đề yêu cầu luồng thông điệp từng bước, theo thứ tự thời gian: thời gian chạy từ trên xuống, nên thấy ngay thứ tự mà không cần đọc số." Communication diagram (sơ đồ giao tiếp) cho thấy cùng các thông điệp nhưng nhấn vào việc đối tượng nào nối với đối tượng nào; thứ tự chỉ nằm trong các con số.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/136ceb443b477b46e719de5a8d79679cda6ff213.svg" alt="PE mock Q2 — Book Appointment sequence diagram" loading="lazy" /><p class="chu-thich">🧩 PE mock Q2 — Book Appointment sequence diagram</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Đề luyện PE, lời giải câu 2 — sequence diagram; mọi đối tượng mang stereotype đề cho; hai khung alt lồng nhau
title PE mock Q2 — Book Appointment sequence diagram
actor Student
boundary ":ClinicApp" as APP &lt;&lt;boundary&gt;&gt;
control ":AppointmentController" as C &lt;&lt;control&gt;&gt;
participant ":InsuranceService" as INS &lt;&lt;service&gt;&gt;
entity ":DoctorSchedule" as DS &lt;&lt;entity&gt;&gt;
entity ":Appointment" as AP &lt;&lt;entity&gt;&gt;
Student -&gt; APP : 1: request appointment(department, date)
APP -&gt; C : 2: bookAppointment(studentId, department, date)
C -&gt; INS : 3: checkInsurance(studentId)
INS --&gt; C : 4: insuranceStatus
alt insurance valid
  C -&gt; DS : 5: findFreeSlot(department, date)
  DS --&gt; C : 6: slot (or none)
  alt free slot found
    C -&gt; DS : 7: reserve(slot)
    C -&gt; AP ** : 8: create(studentId, doctor, slot)
    C --&gt; APP : 9: appointmentCode
    APP --&gt; Student : 10: show appointment code
  else no free slot
    C -&gt; DS : 7a: nextAvailableDays(department)
    DS --&gt; C : 8a: days
    C --&gt; APP : 9a: days
    APP --&gt; Student : 10a: show next available days
  end
else insurance not valid
  C --&gt; APP : 5b: insuranceInvalid
  APP --&gt; Student : 6b: ask to pay full price at the counter
end
@enduml</code></pre></details>
<p><strong>Dựng thế nào.</strong></p>
<ol>
<li>Đường đời (lifeline) theo thứ tự xuất hiện: tác nhân Student, rồi <code>:ClinicApp «boundary»</code>, <code>:AppointmentController «control»</code>, <code>:InsuranceService «service»</code>, <code>:DoctorSchedule «entity»</code>, <code>:Appointment «entity»</code>. Stereotype đã cho sẵn trong đề — chép đúng; đề nói bạn <em>must</em> (bắt buộc) ghi chúng.</li>
<li>Mỗi động từ trong tình huống là một thông điệp: request → book → checkInsurance → findFreeSlot → reserve → create → show.</li>
<li>Hai điều kiện trong đề ("if the insurance is valid", "if a slot is free") ⇒ hai khung <code>alt</code>, khung thứ hai lồng trong nhánh đầu của khung thứ nhất. Mỗi nhánh có điều kiện canh trong ngoặc vuông.</li>
<li>Đường đời Appointment bắt đầu tại thông điệp <code>create</code> (trước đó nó chưa tồn tại), và chỉ ở nhánh "free slot found".</li>
<li>Đánh số: 1, 2, 3… cho luồng chính; 7a, 8a… cho nhánh "không còn giờ trống"; 5b, 6b cho "bảo hiểm không hợp lệ" — đúng quy ước luồng phụ của use case ở Ch.9.</li>
</ol>
<p class="nhan">Nếu đề yêu cầu communication diagram</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/cf743afab40ed8b9c28e4b4d939eeb1f970d3ee7.svg" alt="PE mock Q2 (variant) — Book Appointment communication diagram (main path)" loading="lazy" /><p class="chu-thich">🧩 PE mock Q2 (variant) — Book Appointment communication diagram (main path)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Đề luyện PE, biến thể câu 2 — cùng luồng thành công chính dưới dạng communication diagram (PlantUML không có loại này: đối tượng là hình chữ nhật, mũi tên trong nhãn chỉ chiều)
title PE mock Q2 (variant) — Book Appointment communication diagram (main path)
left to right direction
actor Student as S
rectangle ":ClinicApp\\n&lt;&lt;boundary&gt;&gt;" as APP
rectangle ":AppointmentController\\n&lt;&lt;control&gt;&gt;" as C
rectangle ":InsuranceService\\n&lt;&lt;service&gt;&gt;" as INS
rectangle ":DoctorSchedule\\n&lt;&lt;entity&gt;&gt;" as DS
rectangle ":Appointment\\n&lt;&lt;entity&gt;&gt;" as AP
S -- APP : "1: request appointment ▶\\n◀ 10: appointment code"
APP -- C : "2: bookAppointment ▶\\n◀ 9: appointmentCode"
C -- INS : "3: checkInsurance ▶\\n◀ 4: valid"
C -- DS : "5: findFreeSlot ▶\\n◀ 6: slot\\n7: reserve ▶"
C -- AP : "8: create ▶"
@enduml</code></pre></details>
<p>Cùng đối tượng và stereotype, vẽ thành các hộp nối bằng đường liên kết; mỗi đường mang các thông điệp có số kèm mũi tên chỉ chiều. Dùng nó khi đề nhấn vào "đối tượng nào cộng tác với nhau" (cấu trúc). Nhánh phụ thể hiện bằng số a/b chứ không bằng khung — chính vì thế nó là lựa chọn yếu hơn cho câu này.</p>
<p class="nhan">Barem chấm (tự soạn)</p>
<table>
<thead><tr><th>Mục</th><th>Điểm</th></tr></thead>
<tbody>
<tr><td>Chọn sequence và nêu lý do (theo thứ tự thời gian)</td><td>0.5</td></tr>
<tr><td>Sáu thành phần với stereotype đúng (actor, «boundary», «control», «service», «entity» × 2)</td><td>0.75</td></tr>
<tr><td>Thông điệp luồng chính đúng thứ tự của đề, có tên và số</td><td>0.75</td></tr>
<tr><td>Cả hai điều kiện thể hiện bằng khung alt có điều kiện canh (lồng đúng)</td><td>0.5</td></tr>
<tr><td>Appointment chỉ được tạo ở nhánh thành công; có thông điệp trả về; giữ giờ trước khi tạo</td><td>0.5</td></tr>
</tbody>
</table>
<div class="pitfall"><strong>Chỗ Q2 hay mất điểm</strong>: chọn communication dù đề nói "time-ordered"; không ghi stereotype, hoặc ghi «entity» cho controller; sinh viên nói thẳng với controller (bỏ qua boundary); chỉ vẽ luồng suôn sẻ — hai câu "if" đáng một phần tư số điểm; dùng <code>opt</code> cho lựa chọn hai ngả (opt chỉ có một nhánh; "hợp lệ / không hợp lệ" cần <code>alt</code>); vẽ Appointment từ đầu sơ đồ như thể nó đã có sẵn.</div>
<div class="callout">🧭 <strong>Áp vào LabFlow</strong> (ví dụ minh hoạ): "Reserve Equipment" có đúng hình dạng này — <code>ReservationController</code> («control») kiểm tra thành viên qua một service, hỏi entity lịch xem còn giờ trống, rồi hoặc tạo <code>Reservation</code> hoặc đưa vào danh sách chờ (waitlist). Vẽ nó một lần thành sequence diagram là có ngay danh sách hàm cho <code>ReservationService</code> của Spring.</div>`),
    bi(`<h3>✅ Question 3 — statechart (2.0 points)</h3>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/f508e1dedbaf96b808c9ff25904764487ee78b9d.svg" alt="PE mock Q3 — Appointment statechart" loading="lazy" /><p class="chu-thich">🧩 PE mock Q3 — Appointment statechart</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' PE mock, question 3 solution — Appointment statechart: one arrow per sentence of the scenario, event [guard] / action
title PE mock Q3 — Appointment statechart
hide empty description
[*] --&gt; Booked : appointment_created / send confirmation
Booked --&gt; Booked : reminder_time\\n(1 day before visit)\\n/ send reminder
Booked --&gt; Cancelled : patient_cancels\\n[at least 2 h before visit]\\n/ release slot
Booked --&gt; NoShow : check_in_deadline_passes\\n(visit time + 15 min)\\n/ release slot,\\nincrease no-show count
Booked --&gt; Waiting : patient_checks_in\\n/ give queue number
Waiting --&gt; InConsultation : doctor_calls_patient\\n/ open medical record
InConsultation --&gt; Completed : consultation_finished\\n/ save prescription
Completed --&gt; [*]
Cancelled --&gt; [*]
NoShow --&gt; [*]
@enduml</code></pre></details>
<p><strong>Method: list, then one arrow per sentence.</strong> First write the six states the task names, plus the initial state (black dot) and the final state (bull's-eye) — Completed, Cancelled and NoShow end the lifecycle. Then turn each sentence into one transition labelled <code>event [guard] / action</code>:</p>
<table>
<thead><tr><th>Sentence</th><th>Transition</th></tr></thead>
<tbody>
<tr><td>"When it is created it is in Booked … a confirmation is sent"</td><td>● → Booked : appointment_created / send confirmation</td></tr>
<tr><td>"One day before the visit the system sends a reminder; it stays Booked"</td><td>Booked → Booked (self-transition) : reminder_time / send reminder — a time event, raised 1 day before the visit</td></tr>
<tr><td>"cancels at least 2 hours before the visit … Cancelled … slot released"</td><td>Booked → Cancelled : patient_cancels [at least 2 h before visit] / release slot</td></tr>
<tr><td>"not checked in 15 minutes after the visit time … NoShow … count increased"</td><td>Booked → NoShow : check_in_deadline_passes / release slot, increase no-show count — a time event at visit time + 15 min</td></tr>
<tr><td>"checks in at the counter … Waiting … queue number"</td><td>Booked → Waiting : patient_checks_in / give queue number</td></tr>
<tr><td>"doctor calls the patient in … InConsultation … record opened"</td><td>Waiting → InConsultation : doctor_calls_patient / open medical record</td></tr>
<tr><td>"finishes and saves the prescription … Completed"</td><td>InConsultation → Completed : consultation_finished / save prescription</td></tr>
</tbody>
</table>
<p><strong>Two details that separate 1.5 from 2.0.</strong> The reminder does not change the state, so it is a <em>self-transition</em> (or an internal transition written inside Booked) — leaving it out loses a sentence of the scenario. And tell <em>events</em> from <em>guards</em>: "15 minutes after the visit time" and "one day before the visit" are <em>time events</em> — a timer raises them (Ch.10), so they are written as the event; "at least 2 hours before the visit" is a <em>guard</em> — the event is the patient's cancel, and the condition is checked in brackets when that event arrives.</p>
<p class="nhan">Marking guide (self-made)</p>
<table>
<thead><tr><th>Item</th><th>Points</th></tr></thead>
<tbody>
<tr><td>Six named states + initial and final states</td><td>0.5</td></tr>
<tr><td>Seven transitions in the right places with event names</td><td>0.75</td></tr>
<tr><td>Guard [at least 2 h before visit] on cancel; the two time events named as events</td><td>0.25</td></tr>
<tr><td>Actions after the slash on the transitions that have them</td><td>0.5</td></tr>
</tbody>
</table>
<div class="pitfall"><strong>Where Q3 loses marks</strong>: drawing an activity diagram (boxes of actions joined by arrows) instead of states; arrows with no event, or an action written as the event ("send reminder" alone); forgetting the self-transition; writing "15 min after visit time" as a guard on an arrow with no event; a transition from Waiting back to Booked that the scenario never mentions — never invent behaviour; no final state, so the lifecycle never ends.</div>`,
    `<h3>✅ Câu 3 — statechart (2.0 điểm)</h3>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/f508e1dedbaf96b808c9ff25904764487ee78b9d.svg" alt="PE mock Q3 — Appointment statechart" loading="lazy" /><p class="chu-thich">🧩 PE mock Q3 — Appointment statechart</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Đề luyện PE, lời giải câu 3 — statechart của Appointment: mỗi câu của tình huống một mũi tên, event [guard] / action
title PE mock Q3 — Appointment statechart
hide empty description
[*] --&gt; Booked : appointment_created / send confirmation
Booked --&gt; Booked : reminder_time\\n(1 day before visit)\\n/ send reminder
Booked --&gt; Cancelled : patient_cancels\\n[at least 2 h before visit]\\n/ release slot
Booked --&gt; NoShow : check_in_deadline_passes\\n(visit time + 15 min)\\n/ release slot,\\nincrease no-show count
Booked --&gt; Waiting : patient_checks_in\\n/ give queue number
Waiting --&gt; InConsultation : doctor_calls_patient\\n/ open medical record
InConsultation --&gt; Completed : consultation_finished\\n/ save prescription
Completed --&gt; [*]
Cancelled --&gt; [*]
NoShow --&gt; [*]
@enduml</code></pre></details>
<p><strong>Cách làm: liệt kê trước, rồi mỗi câu một mũi tên.</strong> Đầu tiên ghi sáu trạng thái mà đề nêu tên, cộng trạng thái đầu (chấm đen) và trạng thái cuối (hồng tâm) — Completed, Cancelled và NoShow kết thúc vòng đời. Sau đó biến mỗi câu thành một chuyển trạng thái ghi <code>event [guard] / action</code> (sự kiện [điều kiện canh] / hành động):</p>
<table>
<thead><tr><th>Câu trong đề</th><th>Chuyển trạng thái</th></tr></thead>
<tbody>
<tr><td>"When it is created it is in Booked … a confirmation is sent" (tạo ra thì ở Booked, gửi xác nhận)</td><td>● → Booked : appointment_created / send confirmation</td></tr>
<tr><td>"One day before the visit the system sends a reminder; it stays Booked" (trước một ngày gửi nhắc, vẫn Booked)</td><td>Booked → Booked (chuyển về chính nó) : reminder_time / send reminder — sự kiện thời gian, phát ra trước buổi khám 1 ngày</td></tr>
<tr><td>"cancels at least 2 hours before the visit … Cancelled … slot released" (huỷ trước ít nhất 2 giờ)</td><td>Booked → Cancelled : patient_cancels [at least 2 h before visit] / release slot</td></tr>
<tr><td>"not checked in 15 minutes after the visit time … NoShow … count increased" (quá 15 phút chưa tới)</td><td>Booked → NoShow : check_in_deadline_passes / release slot, increase no-show count — sự kiện thời gian lúc giờ hẹn + 15 phút</td></tr>
<tr><td>"checks in at the counter … Waiting … queue number" (đến quầy làm thủ tục)</td><td>Booked → Waiting : patient_checks_in / give queue number</td></tr>
<tr><td>"doctor calls the patient in … InConsultation … record opened" (bác sĩ gọi vào khám)</td><td>Waiting → InConsultation : doctor_calls_patient / open medical record</td></tr>
<tr><td>"finishes and saves the prescription … Completed" (khám xong, lưu đơn thuốc)</td><td>InConsultation → Completed : consultation_finished / save prescription</td></tr>
</tbody>
</table>
<p><strong>Hai chi tiết phân biệt 1.5 với 2.0.</strong> Việc nhắc lịch không đổi trạng thái, nên nó là <em>self-transition</em> (chuyển về chính trạng thái đó — hoặc internal transition ghi bên trong ô Booked) — bỏ nó đi là bỏ mất một câu của đề. Và phân biệt <em>sự kiện</em> với <em>điều kiện canh</em>: "15 minutes after the visit time" và "one day before the visit" là <em>time event</em> (sự kiện thời gian) — bộ hẹn giờ phát ra chúng (Ch.10), nên ghi vào chỗ sự kiện; còn "at least 2 hours before the visit" là <em>guard</em> (điều kiện canh) — sự kiện là việc bệnh nhân huỷ, và điều kiện được kiểm tra trong ngoặc vuông khi sự kiện đó tới.</p>
<p class="nhan">Barem chấm (tự soạn)</p>
<table>
<thead><tr><th>Mục</th><th>Điểm</th></tr></thead>
<tbody>
<tr><td>Sáu trạng thái có tên + trạng thái đầu và cuối</td><td>0.5</td></tr>
<tr><td>Bảy chuyển trạng thái đúng chỗ, có tên sự kiện</td><td>0.75</td></tr>
<tr><td>Điều kiện canh [at least 2 h before visit] trên mũi tên huỷ; hai sự kiện thời gian ghi đúng vào chỗ sự kiện</td><td>0.25</td></tr>
<tr><td>Hành động sau dấu gạch chéo ở những chuyển trạng thái có hành động</td><td>0.5</td></tr>
</tbody>
</table>
<div class="pitfall"><strong>Chỗ Q3 hay mất điểm</strong>: vẽ activity diagram (các hộp hành động nối mũi tên) thay vì trạng thái; mũi tên không có sự kiện, hoặc viết hành động vào chỗ sự kiện (chỉ ghi "send reminder"); quên self-transition; ghi "15 phút sau giờ hẹn" thành điều kiện canh trên một mũi tên không có sự kiện; tự thêm chuyển từ Waiting về Booked mà đề không hề nói — đừng bao giờ bịa hành vi; thiếu trạng thái cuối, nên vòng đời không bao giờ kết thúc.</div>`),
    bi(`<h3>✅ Question 4 — software architecture (1.0 point)</h3>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/92ddfa6e9d17a8e68930efc4fe74e22f768cc84e.svg" alt="PE mock Q4 — multi-tier client/service architecture (Campus Clinic)" loading="lazy" /><p class="chu-thich">🧩 PE mock Q4 — multi-tier client/service architecture (Campus Clinic)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' PE mock, question 4 — multi-tier client/service architecture; external systems reached through proxy objects in the service tier
title PE mock Q4 — multi-tier client/service architecture (Campus Clinic)
package "Client tier (user interaction subsystems)" {
  component "Student Mobile App" as M
  component "Doctor / Nurse Web App" as W
  component "Counter Desktop App" as K
}
package "Service tier (clinic server)" {
  component "Appointment Service" as AS
  component "Medical Record Service" as MR
  component "Pharmacy Service" as PH
  component "Insurance Proxy" as IP
  component "Student Info Proxy" as SP
}
package "Data tier" {
  database "Clinic DB" as DB
}
rectangle "National Health\\nInsurance System\\n&lt;&lt;external system&gt;&gt;" as NHI
rectangle "University Student\\nInformation System\\n&lt;&lt;external system&gt;&gt;" as SIS
M --&gt; AS
W --&gt; AS
W --&gt; MR
W --&gt; PH
K --&gt; AS
AS --&gt; IP
AS --&gt; SP
AS --&gt; DB
MR --&gt; DB
PH --&gt; DB
IP --&gt; NHI
SP --&gt; SIS
@enduml</code></pre></details>
<p><strong>Model answer (four sentences are enough).</strong></p>
<ol>
<li><strong>Name</strong>: a <em>multi-tier client/service architecture</em> (layered: client tier, service tier, data tier) — Gomaa's Multiple Client / Multiple Service and Multi-tier Client/Service patterns (Ch.15).</li>
<li><strong>Why</strong>: three kinds of clients (mobile, web, desktop) must share the same booking rules and the same medical data, so the rules live once in the service tier; the two external systems are reached through proxy objects in that tier, so no client depends on their protocols.</li>
<li><strong>Advantage</strong>: separation of concerns and maintainability — a new client (for example a kiosk) is added without changing the services or the database, and the insurance interface can change by editing only its proxy.</li>
<li><strong>Disadvantage</strong>: every request crosses the network and several tiers, adding latency, and the central server and database are a single point of failure unless they are replicated.</li>
</ol>
<p>Also accepted when the reason is tied to the scenario: <strong>layered (3-layer)</strong> architecture; <strong>service-oriented</strong> architecture, if you argue from the integration with the two external systems (Ch.16). <strong>Microservices</strong> named without a reason, or "MVC" alone (it structures one application's UI, not the whole distributed system), usually earns only the naming mark.</p>
<p class="nhan">Marking guide (self-made)</p>
<table>
<thead><tr><th>Item</th><th>Points</th></tr></thead>
<tbody>
<tr><td>Names a recognised architecture</td><td>0.25</td></tr>
<tr><td>Why it fits — uses facts of this scenario (several clients, shared rules, external systems)</td><td>0.25</td></tr>
<tr><td>One real advantage</td><td>0.25</td></tr>
<tr><td>One real disadvantage (not "none", not the opposite of the advantage)</td><td>0.25</td></tr>
</tbody>
</table>
<div class="callout">🧭 <strong>Apply it to LabFlow</strong> (illustration): LabFlow is the same shape — React web client, Spring Boot service tier split into Controller / Service / Repository, PostgreSQL data tier, and an external AI service behind its own client class (a proxy). Your SEP490 Report 4 can reuse this answer almost word for word.</div>`,
    `<h3>✅ Câu 4 — kiến trúc phần mềm (1.0 điểm)</h3>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/92ddfa6e9d17a8e68930efc4fe74e22f768cc84e.svg" alt="PE mock Q4 — multi-tier client/service architecture (Campus Clinic)" loading="lazy" /><p class="chu-thich">🧩 PE mock Q4 — multi-tier client/service architecture (Campus Clinic)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Đề luyện PE, câu 4 — kiến trúc client/service nhiều tầng; hệ thống bên ngoài được gọi qua đối tượng proxy ở tầng dịch vụ
title PE mock Q4 — multi-tier client/service architecture (Campus Clinic)
package "Client tier (user interaction subsystems)" {
  component "Student Mobile App" as M
  component "Doctor / Nurse Web App" as W
  component "Counter Desktop App" as K
}
package "Service tier (clinic server)" {
  component "Appointment Service" as AS
  component "Medical Record Service" as MR
  component "Pharmacy Service" as PH
  component "Insurance Proxy" as IP
  component "Student Info Proxy" as SP
}
package "Data tier" {
  database "Clinic DB" as DB
}
rectangle "National Health\\nInsurance System\\n&lt;&lt;external system&gt;&gt;" as NHI
rectangle "University Student\\nInformation System\\n&lt;&lt;external system&gt;&gt;" as SIS
M --&gt; AS
W --&gt; AS
W --&gt; MR
W --&gt; PH
K --&gt; AS
AS --&gt; IP
AS --&gt; SP
AS --&gt; DB
MR --&gt; DB
PH --&gt; DB
IP --&gt; NHI
SP --&gt; SIS
@enduml</code></pre></details>
<p><strong>Bài mẫu (bốn câu là đủ).</strong></p>
<ol>
<li><strong>Tên</strong>: <em>kiến trúc client/service nhiều tầng</em> (multi-tier client/service — phân tầng: tầng client, tầng dịch vụ, tầng dữ liệu) — các mẫu Multiple Client / Multiple Service và Multi-tier Client/Service của Gomaa (Ch.15).</li>
<li><strong>Vì sao</strong>: ba loại client (điện thoại, web, máy tính quầy) phải dùng chung luật đặt lịch và chung dữ liệu y tế, nên luật nằm một chỗ ở tầng dịch vụ; hai hệ thống bên ngoài được gọi qua các đối tượng proxy (đại diện) ở tầng đó, nên không client nào phụ thuộc giao thức của chúng.</li>
<li><strong>Ưu điểm</strong>: tách biệt mối quan tâm và dễ bảo trì — thêm client mới (ví dụ ki-ốt) mà không sửa dịch vụ hay CSDL; giao tiếp bảo hiểm thay đổi thì chỉ sửa proxy của nó.</li>
<li><strong>Nhược điểm</strong>: mọi yêu cầu phải đi qua mạng và qua nhiều tầng, thêm độ trễ; máy chủ trung tâm và CSDL là điểm hỏng duy nhất nếu không nhân bản.</li>
</ol>
<p>Cũng được chấp nhận khi lý do gắn với tình huống: kiến trúc <strong>phân tầng (3 lớp)</strong>; kiến trúc <strong>hướng dịch vụ (SOA)</strong>, nếu bạn lập luận từ việc tích hợp với hai hệ thống bên ngoài (Ch.16). Ghi <strong>microservices</strong> mà không có lý do, hoặc chỉ ghi "MVC" (nó tổ chức giao diện của một ứng dụng, không phải cả hệ thống phân tán), thường chỉ được điểm gọi tên.</p>
<p class="nhan">Barem chấm (tự soạn)</p>
<table>
<thead><tr><th>Mục</th><th>Điểm</th></tr></thead>
<tbody>
<tr><td>Gọi đúng tên một kiến trúc được công nhận</td><td>0.25</td></tr>
<tr><td>Vì sao hợp — dùng dữ kiện của chính tình huống (nhiều client, luật dùng chung, hệ thống ngoài)</td><td>0.25</td></tr>
<tr><td>Một ưu điểm thật</td><td>0.25</td></tr>
<tr><td>Một nhược điểm thật (không phải "không có", không phải mặt trái của ưu điểm)</td><td>0.25</td></tr>
</tbody>
</table>
<div class="callout">🧭 <strong>Áp vào LabFlow</strong> (ví dụ minh hoạ): LabFlow có đúng hình dạng này — client web React, tầng dịch vụ Spring Boot chia Controller / Service / Repository, tầng dữ liệu PostgreSQL, và dịch vụ AI bên ngoài nấp sau một lớp client riêng (một proxy). Report 4 của SEP490 có thể dùng lại câu trả lời này gần như nguyên văn.</div>`),
    bi(`<h3>✅ Question 5 — design pattern (1.0 point)</h3>
<p><strong>Model answer.</strong> <em>Chain of Responsibility</em> (behavioural pattern). Each approver — Nurse, Doctor, ClinicHead — is a <em>handler</em> with the same interface and a link to the <em>next</em> handler. The screen (the <em>client</em>) sends the request only to the first handler; a handler approves it if it is within its limit, otherwise it passes it on. It is the best solution here because (1) the sender does not know who will approve — exactly the requirement; (2) the approval order is set by how the chain is linked, not by if/else in the screen; (3) a Pharmacist level is added by writing one new handler class and linking it in — the sending code and the other approvers do not change (open/closed).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/e745e705192ace5fe7b03ba2394011c22c8ff6d8.svg" alt="PE mock Q5 — Chain of Responsibility for medicine approval" loading="lazy" /><p class="chu-thich">🧩 PE mock Q5 — Chain of Responsibility for medicine approval</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' PE mock, question 5 — Chain of Responsibility: the client knows only the first handler; each handler approves or passes the request to its successor
title PE mock Q5 — Chain of Responsibility for medicine approval
hide circle
class StockRequestScreen &lt;&lt;client&gt;&gt;
abstract class Approver {
  - next : Approver
  + linkWith(next : Approver) : Approver
  + approve(r : MedicineRequest) : String
  # canApprove(r : MedicineRequest) : boolean
}
class Nurse {
  # canApprove(r) : units &lt;= 10
}
class Pharmacist {
  # canApprove(r) : units &lt;= 20
}
class Doctor {
  # canApprove(r) : units &lt;= 50
}
class ClinicHead {
  # canApprove(r) : always
}
class MedicineRequest {
  + medicine : String
  + units : int
}
StockRequestScreen --&gt; Approver : first handler &gt;
Approver --&gt; "0..1" Approver : next
Nurse -up-|&gt; Approver
Pharmacist -up-|&gt; Approver
Doctor -up-|&gt; Approver
ClinicHead -up-|&gt; Approver
Approver ..&gt; MedicineRequest : uses
note right of Pharmacist
  added later:
  no change to the client
  or to the other handlers
end note
@enduml</code></pre></details>
<p>The diagram and the code are not required for 1.0 point, but they prove you know the roles. Running it twice shows the extension: the same three requests, then the same chain with a Pharmacist inserted.</p>
<pre class="trich"><code class="language-java">record MedicineRequest(String medicine, int units) {}

static abstract class Approver {                       // Handler
    private Approver next;                             // the successor in the chain

    Approver linkWith(Approver next) {                 // returns next, so links can be chained
        this.next = next;
        return next;
    }

    final String approve(MedicineRequest r) {
        if (canApprove(r)) return name() + " approves " + r.units() + " x " + r.medicine();
        if (next == null) return "nobody can approve " + r.medicine();
        return next.approve(r);                        // pass it on — the sender never knows who answered
    }

    abstract boolean canApprove(MedicineRequest r);
    abstract String name();
}

static class Nurse extends Approver {
    boolean canApprove(MedicineRequest r) { return r.units() &lt;= 10; }
    String name() { return "Nurse"; }
}

static class Doctor extends Approver {
    boolean canApprove(MedicineRequest r) { return r.units() &lt;= 50; }
    String name() { return "Doctor"; }
}

static class ClinicHead extends Approver {
    boolean canApprove(MedicineRequest r) { return true; }
    String name() { return "ClinicHead"; }
}

// a new level added later: one new class, no change to the sender or to the other approvers
static class Pharmacist extends Approver {
    boolean canApprove(MedicineRequest r) { return r.units() &lt;= 20; }
    String name() { return "Pharmacist"; }
}</code></pre>
<pre class="trich"><code class="language-java">MedicineRequest[] requests = {
    new MedicineRequest("paracetamol", 5),
    new MedicineRequest("amoxicillin", 15),
    new MedicineRequest("vitamin C", 120)
};

Approver chain = new Nurse();                       // the sender only knows the first link
chain.linkWith(new Doctor()).linkWith(new ClinicHead());
System.out.println("-- chain: Nurse &gt; Doctor &gt; ClinicHead");
for (MedicineRequest r : requests) System.out.println(chain.approve(r));

Approver chain2 = new Nurse();
chain2.linkWith(new Pharmacist()).linkWith(new Doctor()).linkWith(new ClinicHead());
System.out.println("-- chain: Nurse &gt; Pharmacist &gt; Doctor &gt; ClinicHead");
for (MedicineRequest r : requests) System.out.println(chain2.approve(r));</code></pre>
<div class="out">-- chain: Nurse &gt; Doctor &gt; ClinicHead<br>
Nurse approves 5 x paracetamol<br>
Doctor approves 15 x amoxicillin<br>
ClinicHead approves 120 x vitamin C<br>
-- chain: Nurse &gt; Pharmacist &gt; Doctor &gt; ClinicHead<br>
Nurse approves 5 x paracetamol<br>
Pharmacist approves 15 x amoxicillin<br>
ClinicHead approves 120 x vitamin C</div>
<table>
<thead><tr><th>Tempting wrong answer</th><th>Why it is not this one</th></tr></thead>
<tbody>
<tr><td>Strategy</td><td>the client chooses ONE algorithm and calls it; here nobody chooses — the request travels until someone accepts it</td></tr>
<tr><td>Decorator</td><td>every wrapper adds behaviour and ALWAYS calls the next; in a chain, a handler that approves stops the request</td></tr>
<tr><td>Observer</td><td>a subject notifies ALL observers; here exactly one approver handles the request</td></tr>
<tr><td>Command</td><td>wraps a request as an object (queue, undo); it says nothing about who handles it</td></tr>
</tbody>
</table>
<p class="nhan">Marking guide (self-made)</p>
<table>
<thead><tr><th>Item</th><th>Points</th></tr></thead>
<tbody>
<tr><td>Correct pattern name</td><td>0.5</td></tr>
<tr><td>Why it fits, using this scenario: sender decoupled from approver, the chain decides, new level added without changing the sender</td><td>0.5</td></tr>
</tbody>
</table>
<div class="pitfall"><strong>Where Q5 loses marks</strong>: copying the GoF intent from the question back as the explanation — the mark is for applying it to nurses, doctors and the pharmacist; naming the category only ("a behavioural pattern"); answering "if/else by amount" — that is exactly the coupling the question forbids.</div>`,
    `<h3>✅ Câu 5 — design pattern (1.0 điểm)</h3>
<p><strong>Bài mẫu.</strong> <em>Chain of Responsibility</em> (chuỗi trách nhiệm — nhóm behavioural, hành vi). Mỗi người duyệt — Nurse, Doctor, ClinicHead — là một <em>handler</em> (bộ xử lý) có chung interface và giữ liên kết tới handler <em>kế tiếp</em>. Màn hình (<em>client</em>) chỉ gửi yêu cầu cho handler đầu tiên; handler nào trong hạn mức thì duyệt, không thì chuyền tiếp. Đây là giải pháp tốt nhất vì (1) bên gửi không biết ai sẽ duyệt — đúng yêu cầu của đề; (2) thứ tự duyệt do cách nối chuỗi quyết định, không phải do if/else trong màn hình; (3) thêm cấp Pharmacist (dược sĩ) chỉ cần viết một lớp handler mới và nối vào chuỗi — code gửi và các cấp duyệt khác không đổi (nguyên lý mở/đóng).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/e745e705192ace5fe7b03ba2394011c22c8ff6d8.svg" alt="PE mock Q5 — Chain of Responsibility for medicine approval" loading="lazy" /><p class="chu-thich">🧩 PE mock Q5 — Chain of Responsibility for medicine approval</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Đề luyện PE, câu 5 — Chain of Responsibility: client chỉ biết handler đầu tiên; mỗi handler duyệt hoặc chuyển yêu cầu cho handler kế tiếp
title PE mock Q5 — Chain of Responsibility for medicine approval
hide circle
class StockRequestScreen &lt;&lt;client&gt;&gt;
abstract class Approver {
  - next : Approver
  + linkWith(next : Approver) : Approver
  + approve(r : MedicineRequest) : String
  # canApprove(r : MedicineRequest) : boolean
}
class Nurse {
  # canApprove(r) : units &lt;= 10
}
class Pharmacist {
  # canApprove(r) : units &lt;= 20
}
class Doctor {
  # canApprove(r) : units &lt;= 50
}
class ClinicHead {
  # canApprove(r) : always
}
class MedicineRequest {
  + medicine : String
  + units : int
}
StockRequestScreen --&gt; Approver : first handler &gt;
Approver --&gt; "0..1" Approver : next
Nurse -up-|&gt; Approver
Pharmacist -up-|&gt; Approver
Doctor -up-|&gt; Approver
ClinicHead -up-|&gt; Approver
Approver ..&gt; MedicineRequest : uses
note right of Pharmacist
  added later:
  no change to the client
  or to the other handlers
end note
@enduml</code></pre></details>
<p>Sơ đồ và code không bắt buộc để được 1.0 điểm, nhưng chúng chứng minh bạn hiểu các vai. Chạy hai lần cho thấy việc mở rộng: cùng ba yêu cầu, rồi cùng chuỗi đó có chèn thêm Pharmacist.</p>
<pre class="trich"><code class="language-java">record MedicineRequest(String medicine, int units) {}

static abstract class Approver {                       // Handler (bộ xử lý)
    private Approver next;                             // mắt xích kế tiếp

    Approver linkWith(Approver next) {                 // trả về next để nối liền một dòng
        this.next = next;
        return next;
    }

    final String approve(MedicineRequest r) {
        if (canApprove(r)) return name() + " approves " + r.units() + " x " + r.medicine();
        if (next == null) return "nobody can approve " + r.medicine();
        return next.approve(r);                        // chuyền tiếp — bên gửi không biết ai trả lời
    }

    abstract boolean canApprove(MedicineRequest r);
    abstract String name();
}

static class Nurse extends Approver {
    boolean canApprove(MedicineRequest r) { return r.units() &lt;= 10; }
    String name() { return "Nurse"; }
}

static class Doctor extends Approver {
    boolean canApprove(MedicineRequest r) { return r.units() &lt;= 50; }
    String name() { return "Doctor"; }
}

static class ClinicHead extends Approver {
    boolean canApprove(MedicineRequest r) { return true; }
    String name() { return "ClinicHead"; }
}

// một cấp mới thêm sau: một lớp mới, không sửa bên gửi lẫn các cấp khác
static class Pharmacist extends Approver {
    boolean canApprove(MedicineRequest r) { return r.units() &lt;= 20; }
    String name() { return "Pharmacist"; }
}</code></pre>
<pre class="trich"><code class="language-java">MedicineRequest[] requests = {
    new MedicineRequest("paracetamol", 5),
    new MedicineRequest("amoxicillin", 15),
    new MedicineRequest("vitamin C", 120)
};

Approver chain = new Nurse();                       // bên gửi chỉ biết mắt xích đầu
chain.linkWith(new Doctor()).linkWith(new ClinicHead());
System.out.println("-- chain: Nurse &gt; Doctor &gt; ClinicHead");
for (MedicineRequest r : requests) System.out.println(chain.approve(r));

Approver chain2 = new Nurse();
chain2.linkWith(new Pharmacist()).linkWith(new Doctor()).linkWith(new ClinicHead());
System.out.println("-- chain: Nurse &gt; Pharmacist &gt; Doctor &gt; ClinicHead");
for (MedicineRequest r : requests) System.out.println(chain2.approve(r));</code></pre>
<div class="out">-- chain: Nurse &gt; Doctor &gt; ClinicHead<br>
Nurse approves 5 x paracetamol<br>
Doctor approves 15 x amoxicillin<br>
ClinicHead approves 120 x vitamin C<br>
-- chain: Nurse &gt; Pharmacist &gt; Doctor &gt; ClinicHead<br>
Nurse approves 5 x paracetamol<br>
Pharmacist approves 15 x amoxicillin<br>
ClinicHead approves 120 x vitamin C</div>
<table>
<thead><tr><th>Đáp án sai dễ chọn</th><th>Vì sao không phải nó</th></tr></thead>
<tbody>
<tr><td>Strategy</td><td>client chọn MỘT thuật toán rồi gọi nó; ở đây không ai chọn — yêu cầu tự đi tới khi có người nhận</td></tr>
<tr><td>Decorator</td><td>mỗi lớp bọc thêm hành vi và LUÔN gọi lớp kế; trong chuỗi trách nhiệm, handler nào duyệt thì dừng yêu cầu lại</td></tr>
<tr><td>Observer</td><td>chủ thể báo cho TẤT CẢ observer; ở đây đúng một người duyệt xử lý yêu cầu</td></tr>
<tr><td>Command</td><td>gói yêu cầu thành một đối tượng (xếp hàng, hoàn tác); nó không nói gì về việc ai xử lý</td></tr>
</tbody>
</table>
<p class="nhan">Barem chấm (tự soạn)</p>
<table>
<thead><tr><th>Mục</th><th>Điểm</th></tr></thead>
<tbody>
<tr><td>Gọi đúng tên pattern</td><td>0.5</td></tr>
<tr><td>Vì sao hợp, dùng chính tình huống: bên gửi tách khỏi người duyệt, chuỗi tự quyết, thêm cấp mới không sửa bên gửi</td><td>0.5</td></tr>
</tbody>
</table>
<div class="pitfall"><strong>Chỗ Q5 hay mất điểm</strong>: chép lại câu intent GoF trong đề làm phần giải thích — điểm nằm ở việc áp nó vào y tá, bác sĩ và dược sĩ; chỉ gọi tên nhóm ("một pattern hành vi"); trả lời "if/else theo số lượng" — đó chính là sự phụ thuộc mà đề cấm.</div>
<div class="callout">🧭 <strong>Áp vào LabFlow</strong> (ví dụ minh hoạ): duyệt mượn thiết bị đắt tiền theo cấp (trợ giảng → trưởng lab → trưởng khoa) là cùng một chuỗi. Trong Spring, chính <code>SecurityFilterChain</code> và các <code>HandlerInterceptor</code> cũng chạy theo kiểu chuỗi: mỗi mắt xích xử lý hoặc chuyền tiếp yêu cầu.</div>`),
    bi(`<h2>✅ Before you submit — checklist (last 7 minutes)</h2>
<ol>
<li><strong>One document</strong> with the five answers in order, each under its question number; every diagram exported as an image that is readable at 100% zoom; the file saved where the proctor said.</li>
<li><strong>Q1</strong>: every diamond at the whole; filled = cannot exist without, hollow = can exist alone; triangle at the superclass; a multiplicity on every association end; no attributes.</li>
<li><strong>Q2</strong>: the choice and its reason written in words; every object has <code>name : Class</code> and the stereotype from the scenario; every "if" of the scenario is an alt with guards; messages numbered.</li>
<li><strong>Q3</strong>: every state named in the task is on the diagram, spelled the same; every arrow has an event; guards in brackets; actions after "/"; initial and final states.</li>
<li><strong>Q4</strong>: four things — name, why, one advantage, one disadvantage.</li>
<li><strong>Q5</strong>: the pattern name plus at least two sentences that use the scenario's own nouns.</li>
<li><strong>Consistency pass</strong>: the class names in Q2 and Q3 match Q1 (Appointment, not Booking in one and Appointment in another).</li>
</ol>
<h3>⏱ Managing the 85 minutes</h3>
<table>
<thead><tr><th>Situation</th><th>What to do</th></tr></thead>
<tbody>
<tr><td>You are past the time box of a question</td><td>Stop, write one line "to finish: …" under it, move on. Partial diagrams earn partial marks; blank questions earn nothing.</td></tr>
<tr><td>A sentence of the scenario is ambiguous</td><td>Write the assumption in one line under the diagram ("Assumption: a doctor has one department at a time") — the paper explicitly allows real-world assumptions.</td></tr>
<tr><td>The tool fights you (layout, crossing lines)</td><td>Accept an ugly but correct diagram. Markers check notation and content, not beauty. In PlantUML, the direction keywords <code>-up-</code>, <code>-right-</code> fix most layouts in seconds.</td></tr>
<tr><td>You finish early</td><td>Re-read each scenario sentence and tick where it appears in your answer — that is how missing alternatives and self-transitions are found.</td></tr>
</tbody>
</table>
<p><strong>Tool tip.</strong> Before the exam, keep five tiny templates in your head (class with composition, sequence with alt, state with guard, component layers, pattern class diagram) — see lesson ⭐ "Installing UML tools" for PlantUML basics. Check with the proctor which tools are allowed in the exam room and practise in that tool.</p>
<h3>📌 Remember</h3>
<ul>
<li>Five questions, 3/3/2/1/1 points; Q4 + Q5 = 2 points for about 12 minutes — never skip them.</li>
<li>Q1: one sentence = one relationship; "cannot exist without" = composition, "can be moved … still" = aggregation, "either … types" = generalization.</li>
<li>Q2: "time-ordered" ⇒ sequence; stereotypes are copied from the scenario; every "if" is an alt.</li>
<li>Q3: states first, then <code>event [guard] / action</code> per sentence; a "stays in the same state" sentence is a self-transition.</li>
<li>Q4: name + why (from the scenario) + one advantage + one disadvantage.</li>
<li>Q5: the question quotes the GoF intent — match it to the name, then explain with the scenario's nouns.</li>
</ul>`,
    `<h2>✅ Trước khi nộp — checklist (7 phút cuối)</h2>
<ol>
<li><strong>Một tài liệu</strong> chứa năm câu trả lời theo thứ tự, mỗi câu dưới số câu của nó; mọi sơ đồ xuất thành ảnh đọc được ở mức phóng 100%; file lưu đúng chỗ giám thị dặn.</li>
<li><strong>Q1</strong>: mọi hình thoi ở phía tổng thể; thoi đặc = không tồn tại nếu thiếu tổng thể, thoi rỗng = tồn tại riêng được; tam giác ở lớp cha; đầu liên kết nào cũng có bội số; không ghi thuộc tính.</li>
<li><strong>Q2</strong>: lựa chọn và lý do viết thành chữ; mọi đối tượng có <code>name : Class</code> và stereotype lấy từ đề; mọi chữ "if" của đề là một khung alt có điều kiện canh; thông điệp có đánh số.</li>
<li><strong>Q3</strong>: mọi trạng thái đề nêu tên đều có trên sơ đồ, viết đúng chính tả; mũi tên nào cũng có sự kiện; điều kiện canh trong ngoặc vuông; hành động sau dấu "/"; có trạng thái đầu và cuối.</li>
<li><strong>Q4</strong>: đủ bốn thứ — tên, vì sao, một ưu, một nhược.</li>
<li><strong>Q5</strong>: tên pattern cộng ít nhất hai câu dùng chính danh từ của đề.</li>
<li><strong>Soát nhất quán</strong>: tên lớp ở Q2 và Q3 khớp với Q1 (Appointment, không phải chỗ này Booking chỗ kia Appointment).</li>
</ol>
<h3>⏱ Quản lý 85 phút</h3>
<table>
<thead><tr><th>Tình huống</th><th>Làm gì</th></tr></thead>
<tbody>
<tr><td>Đã quá khung giờ của một câu</td><td>Dừng lại, ghi một dòng "còn thiếu: …" dưới câu đó, sang câu sau. Sơ đồ dở vẫn có điểm từng phần; bỏ trắng thì không có gì.</td></tr>
<tr><td>Một câu trong đề mơ hồ</td><td>Ghi giả định thành một dòng dưới sơ đồ ("Assumption: a doctor has one department at a time" — giả định: mỗi lúc bác sĩ thuộc một khoa) — đề cho phép rõ ràng việc đưa giả định thực tế.</td></tr>
<tr><td>Công cụ "cãi" bạn (bố cục, đường chéo nhau)</td><td>Chấp nhận sơ đồ xấu mà đúng. Người chấm xem ký hiệu và nội dung, không chấm đẹp. Trong PlantUML, từ khoá hướng <code>-up-</code>, <code>-right-</code> sửa gần hết bố cục trong vài giây.</td></tr>
<tr><td>Làm xong sớm</td><td>Đọc lại từng câu của mỗi tình huống và đánh dấu chỗ nó xuất hiện trong bài — đó là cách tìm ra nhánh phụ và self-transition bị sót.</td></tr>
</tbody>
</table>
<p><strong>Mẹo công cụ.</strong> Trước khi thi, thuộc năm khuôn nhỏ (class có hợp thành, sequence có alt, state có điều kiện canh, các tầng component, class diagram của pattern) — xem bài ⭐ "Cài công cụ UML" để nắm PlantUML cơ bản. Hỏi giám thị/giảng viên xem phòng thi cho dùng công cụ nào và luyện đúng công cụ đó.</p>
<h3>📌 Ghi nhớ</h3>
<ul>
<li>Năm câu, 3/3/2/1/1 điểm; Q4 + Q5 = 2 điểm cho khoảng 12 phút — đừng bao giờ bỏ.</li>
<li>Q1: một câu = một quan hệ; "cannot exist without" = hợp thành, "can be moved … still" = kết tập, "either … types" = tổng quát hoá.</li>
<li>Q2: "time-ordered" ⇒ sequence; stereotype chép từ đề; mỗi "if" là một khung alt.</li>
<li>Q3: trạng thái trước, rồi mỗi câu một <code>event [guard] / action</code>; câu "vẫn ở trạng thái cũ" là self-transition.</li>
<li>Q4: tên + vì sao (lấy từ tình huống) + một ưu + một nhược.</li>
<li>Q5: đề đã trích intent GoF — khớp nó với tên pattern, rồi giải thích bằng danh từ của chính tình huống.</li>
</ul>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>composition</strong></td><td>hợp thành</td><td>A strong whole/part relationship: the part belongs to one whole and is created and destroyed with it; filled diamond at the whole.</td></tr>
<tr><td><strong>aggregation</strong></td><td>kết tập</td><td>A weaker whole/part relationship: the part can exist without the whole or move to another; hollow diamond at the whole.</td></tr>
<tr><td><strong>generalization</strong></td><td>tổng quát hoá</td><td>An "is a kind of" relationship between a superclass and its subclasses; hollow triangle at the superclass.</td></tr>
<tr><td><strong>multiplicity</strong></td><td>bội số</td><td>How many objects at one end of an association relate to one object at the other end, such as 1, 0..1, 1..*.</td></tr>
<tr><td><strong>entity level</strong></td><td>mức thực thể</td><td>A class diagram that shows only the domain classes and their relationships, without attributes or operations.</td></tr>
<tr><td><strong>application logic stereotype</strong></td><td>stereotype logic ứng dụng</td><td>The label that classifies an object as «boundary», «control», «entity», «service» and so on.</td></tr>
<tr><td><strong>alt fragment</strong></td><td>khung lựa chọn alt</td><td>A sequence diagram frame with two or more guarded operands, of which exactly one runs.</td></tr>
<tr><td><strong>self-transition</strong></td><td>chuyển về chính nó</td><td>A transition that leaves a state and enters the same state, used when an event causes an action but no change of state.</td></tr>
<tr><td><strong>time event</strong></td><td>sự kiện thời gian</td><td>An event raised when a moment arrives or a time limit passes, usually by a timer.</td></tr>
<tr><td><strong>multi-tier client/service</strong></td><td>client/service nhiều tầng</td><td>An architecture in which clients call services that may themselves call lower-tier services or data stores.</td></tr>
<tr><td><strong>proxy object</strong></td><td>đối tượng đại diện</td><td>An object that stands in for an external system and hides its communication protocol.</td></tr>
<tr><td><strong>Chain of Responsibility</strong></td><td>chuỗi trách nhiệm</td><td>A behavioural pattern that passes a request along a chain of handlers until one of them handles it.</td></tr>
<tr><td><strong>handler / successor</strong></td><td>bộ xử lý / mắt xích kế</td><td>In Chain of Responsibility, an object that may handle the request, and the next object it passes the request to.</td></tr>
<tr><td><strong>assumption</strong></td><td>giả định</td><td>A short written statement that fixes an ambiguous point of the scenario, allowed by the PE instructions.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>composition</strong></td><td>hợp thành</td><td>Quan hệ tổng thể/bộ phận mạnh: bộ phận thuộc một tổng thể, sinh ra và mất đi cùng nó; thoi đặc ở phía tổng thể.</td></tr>
<tr><td><strong>aggregation</strong></td><td>kết tập</td><td>Quan hệ tổng thể/bộ phận yếu hơn: bộ phận tồn tại được khi không có tổng thể hoặc chuyển sang tổng thể khác; thoi rỗng ở phía tổng thể.</td></tr>
<tr><td><strong>generalization</strong></td><td>tổng quát hoá</td><td>Quan hệ "là một loại của" giữa lớp cha và các lớp con; tam giác rỗng ở phía lớp cha.</td></tr>
<tr><td><strong>multiplicity</strong></td><td>bội số</td><td>Số đối tượng ở một đầu liên kết ứng với một đối tượng ở đầu kia, như 1, 0..1, 1..*.</td></tr>
<tr><td><strong>entity level</strong></td><td>mức thực thể</td><td>Class diagram chỉ thể hiện các lớp miền bài toán và quan hệ, không có thuộc tính hay thao tác.</td></tr>
<tr><td><strong>application logic stereotype</strong></td><td>stereotype logic ứng dụng</td><td>Nhãn phân loại một đối tượng là «boundary», «control», «entity», «service»…</td></tr>
<tr><td><strong>alt fragment</strong></td><td>khung lựa chọn alt</td><td>Khung trong sequence diagram có hai nhánh trở lên kèm điều kiện canh, chỉ đúng một nhánh chạy.</td></tr>
<tr><td><strong>self-transition</strong></td><td>chuyển về chính nó</td><td>Chuyển trạng thái rời một trạng thái rồi vào lại chính nó, dùng khi sự kiện gây ra hành động mà không đổi trạng thái.</td></tr>
<tr><td><strong>time event</strong></td><td>sự kiện thời gian</td><td>Sự kiện phát ra khi tới một thời điểm hoặc hết một khoảng thời gian, thường do bộ hẹn giờ.</td></tr>
<tr><td><strong>multi-tier client/service</strong></td><td>client/service nhiều tầng</td><td>Kiến trúc trong đó client gọi dịch vụ, và dịch vụ có thể gọi tiếp dịch vụ hoặc kho dữ liệu ở tầng dưới.</td></tr>
<tr><td><strong>proxy object</strong></td><td>đối tượng đại diện</td><td>Đối tượng đứng thay cho một hệ thống bên ngoài và giấu giao thức giao tiếp của nó.</td></tr>
<tr><td><strong>Chain of Responsibility</strong></td><td>chuỗi trách nhiệm</td><td>Mẫu hành vi chuyền một yêu cầu dọc chuỗi các handler cho tới khi một handler xử lý nó.</td></tr>
<tr><td><strong>handler / successor</strong></td><td>bộ xử lý / mắt xích kế</td><td>Trong chuỗi trách nhiệm, đối tượng có thể xử lý yêu cầu, và đối tượng kế tiếp mà nó chuyền yêu cầu tới.</td></tr>
<tr><td><strong>assumption</strong></td><td>giả định</td><td>Một câu viết ngắn chốt lại điểm mơ hồ của tình huống, được đề PE cho phép.</td></tr>
</tbody>
</table>`),
  ].join('\n'),
};

/* ───────── Quiz (swd392-final-exam-fe) — 20 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 1800,
  questions: [
    { id: 'q1',
      question: 'In the Unified Process (school Ch.3), in which phase is the software architecture mainly defined and validated, so that a stable architecture baseline exists before most of the code is written?|||Trong Unified Process (slide trường Ch.3), kiến trúc phần mềm chủ yếu được xác định và kiểm chứng ở pha nào, để có một nền kiến trúc ổn định trước khi phần lớn code được viết?',
      options: ['Inception|||Inception (khởi đầu)', 'Elaboration|||Elaboration (chi tiết hoá)', 'Construction|||Construction (xây dựng)', 'Transition|||Transition (chuyển giao)'],
      correctIndex: 1,
      points: 1,
      explanation: 'The slides define the four phases in one line each: Inception develops the seed idea far enough to justify going on, Elaboration "defines the software architecture", Construction builds the software until it is ready for release, Transition hands it to the users. Construction is the tempting answer because most code is written there — but it builds on the architecture fixed in Elaboration.|||Slide định nghĩa bốn pha, mỗi pha một dòng: Inception phát triển ý tưởng ban đầu đủ để quyết định đi tiếp, Elaboration "xác định kiến trúc phần mềm", Construction xây phần mềm tới khi sẵn sàng phát hành, Transition giao cho người dùng. Construction là bẫy vì phần lớn code được viết ở đó — nhưng nó dựng trên kiến trúc đã chốt ở Elaboration.' },
    { id: 'q2',
      question: 'Dormitory system: both "Book Bed" and "Renew Contract" must run the same "Check Tuition Debt" steps every time. When no bed is free, "Book Bed" may additionally offer "Join Waiting List". Which set of relationships models this correctly?|||Hệ thống ký túc xá: cả "Book Bed" lẫn "Renew Contract" lần nào cũng phải chạy cùng các bước "Check Tuition Debt". Khi hết giường trống, "Book Bed" có thể đưa thêm "Join Waiting List". Bộ quan hệ nào mô hình hoá đúng?',
      options: ['Check Tuition Debt --«extend»--> Book Bed and Check Tuition Debt --«extend»--> Renew Contract; Book Bed --«include»--> Join Waiting List|||Check Tuition Debt --«extend»--> Book Bed và Check Tuition Debt --«extend»--> Renew Contract; Book Bed --«include»--> Join Waiting List', 'Book Bed --«include»--> Check Tuition Debt and Renew Contract --«include»--> Check Tuition Debt; Book Bed --«extend»--> Join Waiting List|||Book Bed --«include»--> Check Tuition Debt và Renew Contract --«include»--> Check Tuition Debt; Book Bed --«extend»--> Join Waiting List', 'Check Tuition Debt is a generalization of Book Bed and Renew Contract; Join Waiting List --«include»--> Book Bed|||Check Tuition Debt là tổng quát hoá của Book Bed và Renew Contract; Join Waiting List --«include»--> Book Bed', 'Book Bed --«include»--> Check Tuition Debt and Renew Contract --«include»--> Check Tuition Debt; Join Waiting List --«extend»--> Book Bed|||Book Bed --«include»--> Check Tuition Debt và Renew Contract --«include»--> Check Tuition Debt; Join Waiting List --«extend»--> Book Bed'],
      correctIndex: 3,
      points: 1,
      explanation: 'Steps shared by several use cases and run every time are an inclusion use case: the arrow goes from each base (Book Bed, Renew Contract) to the included one. Behaviour added only under a condition (no free bed) is an extension: the arrow goes from the extension (Join Waiting List) to the base, which names the extension point. B has the right include arrows but draws extend in the include direction — the classic way to lose this mark. A swaps the meanings; C uses generalization, which means "is a kind of", not "reuses steps of".|||Các bước dùng chung cho nhiều use case và lần nào cũng chạy là use case bao gồm (inclusion): mũi tên đi từ mỗi use case gốc (Book Bed, Renew Contract) tới use case được include. Hành vi chỉ thêm vào khi có điều kiện (hết giường) là mở rộng (extension): mũi tên đi từ use case mở rộng (Join Waiting List) tới use case gốc, và use case gốc ghi điểm mở rộng. B đúng mũi tên include nhưng vẽ extend theo chiều của include — cách mất điểm kinh điển. A đảo nghĩa hai quan hệ; C dùng tổng quát hoá, nghĩa là "là một loại của", không phải "dùng lại các bước của".' },
    { id: 'q3',
      question: 'Every night at 00:00 the dormitory system suspends the contracts whose monthly fee is more than 30 days overdue. In the use case model, who is the primary actor of the use case "Suspend Overdue Contracts"?|||Mỗi đêm lúc 00:00, hệ thống ký túc xá tạm khoá các hợp đồng có phí tháng quá hạn hơn 30 ngày. Trong mô hình use case, ai là tác nhân chính (primary actor) của use case "Suspend Overdue Contracts"?',
      options: ['A timer actor (Clock) that starts the use case at the scheduled time|||Một tác nhân hẹn giờ (timer actor, Clock) khởi động use case vào giờ định sẵn', 'The Dormitory Manager, because the manager is responsible for suspensions|||Quản lý ký túc xá, vì quản lý chịu trách nhiệm việc khoá hợp đồng', 'The database, because the overdue contracts are stored there|||Cơ sở dữ liệu, vì các hợp đồng quá hạn được lưu ở đó', 'There is no actor; a use case started by the system itself is not modeled|||Không có actor; use case do chính hệ thống khởi động thì không được mô hình hoá'],
      correctIndex: 0,
      points: 1,
      explanation: 'The school slide Ch.6 says an actor is very often a human, but it can also be an external system, an I/O device or a timer. Here nothing outside the system except the passing of time starts the use case, so the primary actor is a timer actor. B is tempting, but the manager does not start this run; C is wrong because the database is inside the system, and an actor is always outside it.|||Slide trường Ch.6 nói actor thường là người, nhưng cũng có thể là hệ thống bên ngoài, thiết bị vào/ra hoặc bộ hẹn giờ (timer). Ở đây không có gì bên ngoài khởi động use case ngoài thời gian trôi qua, nên tác nhân chính là timer actor. B hấp dẫn, nhưng quản lý không khởi động lần chạy này; C sai vì cơ sở dữ liệu nằm trong hệ thống, còn actor luôn ở bên ngoài.' },
    { id: 'q4',
      question: 'Read this class diagram fragment. Which statement is correct?|||Đọc đoạn class diagram này. Phát biểu nào đúng?',
      code: `class Room
class Student
Room "0..1" o-- "0..8" Student : houses >`,
      codeLang: 'plantuml',
      options: ['A student may live in up to 8 rooms at the same time|||Một sinh viên có thể ở tối đa 8 phòng cùng lúc', 'Every student must live in exactly one room, and deleting a room deletes its students|||Mọi sinh viên phải ở đúng một phòng, và xoá phòng thì xoá luôn sinh viên của phòng đó', 'A room houses at most 8 students, and a student lives in at most one room — possibly none — and continues to exist without it|||Một phòng chứa tối đa 8 sinh viên, và một sinh viên ở tối đa một phòng — có thể không ở phòng nào — và vẫn tồn tại khi không có phòng', 'A room must house at least one student, otherwise it cannot exist|||Một phòng phải có ít nhất một sinh viên, nếu không thì phòng không tồn tại được'],
      correctIndex: 2,
      points: 1,
      explanation: 'A multiplicity is read at the FAR end: "0..8" next to Student says how many students one room has; "0..1" next to Room says how many rooms one student has — so at most one, and zero is allowed. The hollow diamond is aggregation: the parts live on without the whole. A reads the multiplicity at the wrong end; B describes "1" plus composition (filled diamond); D ignores the lower bound 0 of "0..8".|||Bội số (multiplicity) đọc ở đầu BÊN KIA: "0..8" cạnh Student cho biết một phòng có bao nhiêu sinh viên; "0..1" cạnh Room cho biết một sinh viên có bao nhiêu phòng — tức tối đa một, và được phép bằng không. Thoi rỗng là kết tập (aggregation): bộ phận vẫn sống khi không có tổng thể. A đọc bội số ở sai đầu; B mô tả "1" cộng với hợp thành (thoi đặc); D bỏ qua cận dưới 0 của "0..8".' },
    { id: 'q5',
      question: 'Building ◆— Room is a composition. Which statement about this composition is FALSE?|||Building ◆— Room là quan hệ hợp thành (composition). Phát biểu nào về quan hệ này là SAI?',
      options: ['A Room object belongs to only one Building at a time|||Một đối tượng Room chỉ thuộc về một Building tại một thời điểm', 'When a Building is deleted, its Rooms are deleted with it|||Khi xoá một Building, các Room của nó bị xoá theo', 'The filled diamond is drawn at the Building (whole) end|||Thoi đặc được vẽ ở đầu Building (tổng thể)', 'The multiplicity at the Building end may be 0..*, so a room can be shared by several buildings|||Bội số ở đầu Building có thể là 0..*, nên một phòng có thể dùng chung cho nhiều toà nhà'],
      correctIndex: 3,
      points: 1,
      explanation: 'The school slide Ch.7 says the parts of a composition "are created, live, and die together with the whole" and "the part object can belong to only one whole". So the multiplicity at the whole end is 1 (or at most 0..1), never 0..* — D is the false statement. A, B and C are the three defining facts of composition; students who pick C usually think the diamond goes at the part, which is the most common drawing error.|||Slide trường Ch.7 nói bộ phận của hợp thành "được tạo ra, sống và chết cùng tổng thể" và "đối tượng bộ phận chỉ thuộc về một tổng thể". Nên bội số ở đầu tổng thể là 1 (hoặc nhiều nhất 0..1), không bao giờ là 0..* — D là phát biểu sai. A, B, C là ba đặc điểm định nghĩa hợp thành; ai chọn C thường nghĩ thoi đặt ở phía bộ phận, đó là lỗi vẽ hay gặp nhất.' },
    { id: 'q6',
      question: 'In the dormitory analysis model, FeeCalculator applies the fee rules (scholarship students pay 50%; late payment adds 5% per week). It stores no long-lived data and is called by the RoomBookingCoordinator. In COMET object structuring, FeeCalculator is a(n)…|||Trong analysis model của ký túc xá, FeeCalculator áp các luật tính phí (sinh viên học bổng trả 50%; nộp trễ cộng 5% mỗi tuần). Nó không lưu dữ liệu lâu dài và được RoomBookingCoordinator gọi. Theo cấu trúc hoá đối tượng COMET, FeeCalculator là…',
      options: ['«entity» object, because it is about fees|||đối tượng «entity», vì nó nói về tiền phí', '«business logic» object (an application logic object)|||đối tượng «business logic» (một loại đối tượng logic ứng dụng)', '«coordinator» object, because it computes the result of the use case|||đối tượng «coordinator», vì nó tính ra kết quả của use case', '«state dependent control» object, because the fee depends on whether the payment is late|||đối tượng «state dependent control», vì phí tuỳ vào việc nộp có trễ hay không'],
      correctIndex: 1,
      points: 1,
      explanation: 'A business logic object encapsulates business rules and computations, especially when a rule needs data from more than one entity (here Contract and Student). An entity stores long-lived data — FeeCalculator stores none. A coordinator sequences the steps of the use case and calls others, which is the job of RoomBookingCoordinator. D is a trap: "late or not" is an input value, not a state that the object remembers between events.|||Đối tượng business logic gói các luật nghiệp vụ và phép tính, nhất là khi một luật cần dữ liệu từ hơn một entity (ở đây Contract và Student). Entity lưu dữ liệu sống lâu — FeeCalculator không lưu gì. Coordinator (bộ điều phối) sắp xếp các bước của use case và gọi các đối tượng khác, đó là việc của RoomBookingCoordinator. D là bẫy: "trễ hay không" là một giá trị đầu vào, không phải trạng thái mà đối tượng nhớ giữa các sự kiện.' },
    { id: 'q7',
      question: 'In the Contract statechart, state Suspended has "exit / logResume" and state Active has "entry / unlockKeyCard". The transition Suspended → Active is labelled "fee_paid / sendReceipt". When fee_paid arrives in Suspended, in which order are the actions executed?|||Trong statechart của Contract, trạng thái Suspended có "exit / logResume" và trạng thái Active có "entry / unlockKeyCard". Chuyển trạng thái Suspended → Active ghi "fee_paid / sendReceipt". Khi fee_paid tới lúc đang ở Suspended, các hành động chạy theo thứ tự nào?',
      options: ['sendReceipt, logResume, unlockKeyCard|||sendReceipt, logResume, unlockKeyCard', 'unlockKeyCard, sendReceipt, logResume|||unlockKeyCard, sendReceipt, logResume', 'logResume, sendReceipt, unlockKeyCard|||logResume, sendReceipt, unlockKeyCard', 'Only sendReceipt; entry and exit actions run only when the object is created or destroyed|||Chỉ sendReceipt; entry và exit action chỉ chạy khi đối tượng được tạo hoặc huỷ'],
      correctIndex: 2,
      points: 1,
      explanation: 'Leaving a state runs its exit action, then the action on the transition runs, then entering the new state runs its entry action: exit → transition → entry. The school slide Ch.10 defines entry/exit actions as running "upon state entry" / "on state exit" every time, whichever transition is used — so D is wrong. A puts the transition action before leaving the source state, which is impossible: the object is still in Suspended until it exits.|||Rời một trạng thái thì chạy exit action của nó, sau đó chạy hành động ghi trên chuyển trạng thái, rồi vào trạng thái mới thì chạy entry action: exit → transition → entry. Slide trường Ch.10 định nghĩa entry/exit action chạy "khi vào trạng thái" / "khi rời trạng thái" mỗi lần, bất kể đi đường nào — nên D sai. A đặt hành động của chuyển trạng thái trước khi rời trạng thái nguồn, điều không thể xảy ra: đối tượng vẫn ở Suspended cho tới khi nó exit.' },
    { id: 'q8',
      question: 'Which decision belongs to the COMET design model rather than to the analysis model?|||Quyết định nào thuộc design model của COMET chứ không thuộc analysis model?',
      options: ['Deciding whether each message between two subsystems is synchronous or asynchronous, and fixing its exact name and parameters|||Quyết định mỗi thông điệp giữa hai hệ con là đồng bộ hay bất đồng bộ, và chốt tên cùng tham số chính xác của nó', 'Classifying the objects of a use case as boundary, entity, control or application logic|||Phân loại các đối tượng của một use case thành boundary, entity, control hoặc application logic', 'Drawing the statechart of a state-dependent control object|||Vẽ statechart của một đối tượng điều khiển phụ thuộc trạng thái', 'Writing the main and alternative sequences of each use case|||Viết luồng chính và luồng phụ của mỗi use case'],
      correctIndex: 0,
      points: 1,
      explanation: 'The school slide Ch.13 says that in the transition from the analysis model to the design model, the type of message communication between subsystems (synchronous or asynchronous) is decided and each message gets its precise name and parameters. In analysis, messages are simple and untyped. B and C are analysis activities (Ch.8 object structuring, Ch.10 statecharts); D belongs to the requirements model (Ch.6).|||Slide trường Ch.13 nói khi chuyển từ analysis model sang design model, ta quyết định kiểu giao tiếp thông điệp giữa các hệ con (đồng bộ hay bất đồng bộ) và chốt tên, tham số chính xác của từng thông điệp. Ở analysis, thông điệp còn đơn giản và chưa có kiểu. B và C là việc của analysis (Ch.8 cấu trúc hoá đối tượng, Ch.10 statechart); D thuộc requirements model (Ch.6).' },
    { id: 'q9',
      question: 'New requirement: "When the number of resident students doubles next year, capacity must grow by adding more server nodes, not by buying a bigger machine." Which quality attribute is this, and what does Ch.20 say supports it?|||Yêu cầu mới: "Khi số sinh viên ở ký túc xá tăng gấp đôi vào năm sau, năng lực phải tăng bằng cách thêm nút máy chủ, không phải mua máy to hơn." Đây là quality attribute nào, và Ch.20 nói điều gì hỗ trợ nó?',
      options: ['Performance — keep one centralized server and add more CPU, memory and disk|||Performance (hiệu năng) — giữ một máy chủ tập trung và thêm CPU, bộ nhớ, đĩa', 'Availability — plan scheduled maintenance windows when the system is offline|||Availability (sẵn sàng) — lên lịch các khung bảo trì định kỳ khi hệ thống tạm ngừng', 'Scalability — a distributed architecture, which can grow by adding nodes|||Scalability (khả năng mở rộng) — kiến trúc phân tán, có thể lớn lên bằng cách thêm nút', 'Modifiability — encapsulate each state machine in its own class|||Modifiability (dễ sửa đổi) — gói mỗi máy trạng thái vào một lớp riêng'],
      correctIndex: 2,
      points: 1,
      explanation: 'Ch.20 defines scalability as the extent to which a system can grow after deployment, and contrasts the two ways: a centralized system has limited scalability (add memory, disk or CPU), a distributed system scales further by adding nodes. The requirement explicitly rejects "a bigger machine", so A — the centralized option — is exactly what it forbids. D is a real Ch.20 tactic, but for modifiability.|||Ch.20 định nghĩa scalability là mức độ hệ thống có thể lớn lên sau khi triển khai, và đối chiếu hai cách: hệ tập trung mở rộng hạn chế (thêm bộ nhớ, đĩa hoặc CPU), hệ phân tán mở rộng xa hơn bằng cách thêm nút. Yêu cầu đã loại hẳn "máy to hơn", nên A — phương án tập trung — chính là thứ bị cấm. D là một chiến thuật có thật trong Ch.20, nhưng cho modifiability.' },
    { id: 'q10',
      question: 'A subsystem responds to requests from client subsystems but never initiates requests itself; it is usually a composite of coordinator, business logic and entity objects and is often deployed on its own node. Which subsystem structuring criterion (Ch.13) is this?|||Một hệ con trả lời yêu cầu từ các hệ con client nhưng không bao giờ tự khởi phát yêu cầu; nó thường là đối tượng gộp gồm coordinator, business logic và entity, và hay được triển khai trên một nút riêng. Đây là tiêu chí cấu trúc hệ con nào (Ch.13)?',
      options: ['Service subsystem|||Service subsystem (hệ con dịch vụ)', 'Control subsystem|||Control subsystem (hệ con điều khiển)', 'Coordinator subsystem|||Coordinator subsystem (hệ con điều phối)', 'User interaction subsystem|||User interaction subsystem (hệ con tương tác người dùng)'],
      correctIndex: 0,
      points: 1,
      explanation: "That is the slide's definition of a service subsystem, word for word: it provides services, responds but does not initiate, contains entity, coordinator and business logic objects, and usually has its own node. A control subsystem receives inputs from the external environment, produces outputs to it and is often state-dependent; a coordinator subsystem coordinates OTHER subsystems — having coordinator objects inside does not make a subsystem a coordinator subsystem, which is the trap.|||Đó đúng là định nghĩa service subsystem trên slide: cung cấp dịch vụ, chỉ trả lời chứ không khởi phát, chứa đối tượng entity, coordinator và business logic, thường có nút riêng. Control subsystem nhận đầu vào từ môi trường bên ngoài, sinh đầu ra cho nó và hay phụ thuộc trạng thái; coordinator subsystem điều phối CÁC hệ con KHÁC — bên trong có đối tượng coordinator không biến hệ con thành coordinator subsystem, đó là cái bẫy." },
    { id: 'q11',
      question: 'The student portal asks the Document Service to generate a contract PDF, keeps serving the student while it waits, and later receives the finished PDF from the service as the reply to that request. Which client/server communication pattern (Ch.15) is this?|||Cổng sinh viên nhờ Document Service tạo file PDF hợp đồng, vẫn tiếp tục phục vụ sinh viên trong lúc chờ, rồi sau đó nhận file PDF hoàn chỉnh từ dịch vụ như là câu trả lời cho đúng yêu cầu đó. Đây là mẫu giao tiếp client/server nào (Ch.15)?',
      options: ['Synchronous Message Communication with Reply|||Synchronous Message Communication with Reply (thông điệp đồng bộ có trả lời)', 'Broadcast Message Communication|||Broadcast Message Communication (gửi quảng bá)', 'Subscription/Notification Message Communication|||Subscription/Notification Message Communication (đăng ký/thông báo)', 'Asynchronous Message Communication with Callback|||Asynchronous Message Communication with Callback (thông điệp bất đồng bộ có gọi lại)'],
      correctIndex: 3,
      points: 1,
      explanation: 'With callback, the client sends a request and continues without waiting; the service later sends an asynchronous callback as the response to that one request. With synchronous reply (A) the client blocks until the reply arrives — the portal here does not block. C is tempting because a message "comes later", but subscription/notification is group (multicast) communication to every subscriber of a topic, not one reply to one request.|||Với callback, client gửi yêu cầu rồi chạy tiếp không chờ; về sau dịch vụ gửi một callback bất đồng bộ làm câu trả lời cho đúng yêu cầu đó. Với thông điệp đồng bộ có trả lời (A), client bị chặn (block) tới khi có trả lời — ở đây cổng không bị chặn. C hấp dẫn vì có thông điệp "tới sau", nhưng subscription/notification là giao tiếp nhóm (multicast) gửi tới mọi bên đã đăng ký một chủ đề, không phải một câu trả lời cho một yêu cầu.' },
    { id: 'q12',
      question: 'The portal and the Key-Card Service must exchange many messages in one session (issue card, write access rights, confirm). The team wants location transparency, but does not want every one of these messages to pass through the broker. Which broker pattern (Ch.16) fits?|||Cổng sinh viên và Key-Card Service phải trao đổi nhiều thông điệp trong một phiên (cấp thẻ, ghi quyền ra vào, xác nhận). Nhóm muốn có trong suốt vị trí (location transparency), nhưng không muốn mọi thông điệp này đều đi qua broker. Mẫu broker nào (Ch.16) phù hợp?',
      options: ['Broker Forwarding|||Broker Forwarding (broker chuyển tiếp)', 'Broker Handle|||Broker Handle (broker trả về tay nắm)', 'Service Discovery (yellow pages)|||Service Discovery (khám phá dịch vụ — trang vàng)', 'Service Registration|||Service Registration (đăng ký dịch vụ)'],
      correctIndex: 1,
      points: 1,
      explanation: 'In Broker Handle the broker returns a service handle to the client, and the client then talks to the service directly — location transparency is kept while broker traffic drops; the slide says it suits a client and service that exchange several messages or keep a dialog. Broker Forwarding sends EVERY request through the broker, which is what the team wants to avoid. Service Discovery is for a client that knows only the type of service; Service Registration is what the service does, not how the client talks.|||Với Broker Handle, broker trả cho client một "tay nắm" (handle) của dịch vụ, rồi client nói chuyện thẳng với dịch vụ — vẫn giữ trong suốt vị trí mà giảm lưu lượng qua broker; slide nói nó hợp khi client và dịch vụ trao đổi nhiều thông điệp hay giữ một phiên hội thoại. Broker Forwarding đẩy MỌI yêu cầu qua broker, đúng điều nhóm muốn tránh. Service Discovery dành cho client chỉ biết loại dịch vụ; Service Registration là việc dịch vụ làm, không phải cách client giao tiếp.' },
    { id: 'q13',
      question: "A room transfer needs the dormitory manager's approval, which can take up to two days. Keeping both room records locked until the manager decides is unacceptable. Which transaction pattern (Ch.16) solves this?|||Việc chuyển phòng cần quản lý ký túc xá duyệt, có thể mất tới hai ngày. Khoá cả hai bản ghi phòng cho tới khi quản lý quyết định là không chấp nhận được. Mẫu giao dịch nào (Ch.16) giải quyết việc này?",
      options: ['Long-Living Transaction pattern|||Long-Living Transaction (giao dịch sống lâu)', 'Two-Phase Commit Protocol pattern|||Two-Phase Commit Protocol (cam kết hai pha)', 'Compound Transaction pattern|||Compound Transaction (giao dịch gộp)', 'Negotiation pattern|||Negotiation (thương lượng)'],
      correctIndex: 0,
      points: 1,
      explanation: 'The slide defines a long-living transaction as one with human participation whose duration is long or unpredictable; the pattern splits it into two or more smaller transactions with the human decision in between, so no record stays locked while waiting. Two-Phase Commit makes several services commit or abort together and holds locks until then — exactly the problem. Compound Transaction (C) also splits a transaction, but into flat atomic parts that can be rolled back separately; it says nothing about waiting for a person, which is the force here.|||Slide định nghĩa giao dịch sống lâu là giao dịch có người tham gia, thời gian dài hoặc không đoán trước; mẫu này tách nó thành hai hay nhiều giao dịch nhỏ hơn, quyết định của con người nằm ở giữa, nên không bản ghi nào bị khoá trong lúc chờ. Two-Phase Commit bắt nhiều dịch vụ cùng commit hoặc cùng huỷ và giữ khoá tới lúc đó — chính là vấn đề. Compound Transaction (C) cũng tách giao dịch, nhưng thành các phần nguyên tử phẳng có thể rollback riêng; nó không nói gì tới việc chờ một người, mà đó mới là điểm mấu chốt ở đây.' },
    { id: 'q14',
      question: 'In a UML component diagram, component RoomBooking has a socket (half-circle) labelled IPayment, connected to the ball (full circle) of component PaymentGateway. What does this show?|||Trong UML component diagram, component RoomBooking có một ổ cắm (nửa vòng tròn) ghi IPayment, nối với quả cầu (vòng tròn đầy) của component PaymentGateway. Hình này cho biết gì?',
      options: ['RoomBooking provides IPayment, and PaymentGateway calls it|||RoomBooking cung cấp IPayment, và PaymentGateway gọi nó', 'Both components provide IPayment, so either one can be replaced by the other|||Cả hai component cùng cung cấp IPayment, nên cái nào cũng thay được cho cái kia', 'RoomBooking requires IPayment, and PaymentGateway provides it|||RoomBooking cần (required) IPayment, và PaymentGateway cung cấp (provided) nó', 'IPayment is a port that broadcasts payment messages to every component|||IPayment là một cổng (port) phát quảng bá thông điệp thanh toán tới mọi component'],
      correctIndex: 2,
      points: 1,
      explanation: 'The ball is a provided interface — operations the component offers; the socket is a required interface — operations the component needs from another component to work (Ch.17 slides). Ball-in-socket means RoomBooking is the client and PaymentGateway the provider. A swaps the two symbols, the most common error; D confuses an interface with a port and with group communication.|||Quả cầu là provided interface — các thao tác component cung cấp; ổ cắm là required interface — các thao tác component cần từ component khác để chạy được (slide Ch.17). Quả cầu cắm vào ổ nghĩa là RoomBooking là bên dùng (client), PaymentGateway là bên cung cấp. A đảo hai ký hiệu, lỗi hay gặp nhất; D lẫn interface với port và với giao tiếp nhóm.' },
    { id: 'q15',
      question: 'Each dormitory laundry room has a passive humidity sensor that does not generate interrupts; its value must be read every 10 seconds. According to Ch.18 task structuring, the sensor input is handled by a(n)…|||Mỗi phòng giặt của ký túc xá có một cảm biến độ ẩm thụ động, không phát ngắt (interrupt); giá trị của nó phải được đọc mỗi 10 giây. Theo cấu trúc hoá task ở Ch.18, đầu vào cảm biến này do loại task nào xử lý?',
      options: ['Event-driven I/O task|||Event-driven I/O task (task vào/ra hướng sự kiện)', 'Demand-driven I/O task|||Demand-driven I/O task (task vào/ra theo yêu cầu)', 'Control task|||Control task (task điều khiển)', 'Periodic I/O task|||Periodic I/O task (task vào/ra định kỳ)'],
      correctIndex: 3,
      points: 1,
      explanation: 'A periodic I/O task works with a passive device that does not interrupt when data is ready; a timer event activates it and it polls the device at regular intervals. An event-driven I/O task needs an active, interrupt-driven device — the trap, because "sensor" sounds like events. Demand-driven I/O tasks are for passive devices that do not need polling, typically output devices.|||Periodic I/O task làm việc với thiết bị thụ động không phát ngắt khi có dữ liệu; một sự kiện hẹn giờ kích hoạt nó và nó đọc (poll) thiết bị theo chu kỳ. Event-driven I/O task cần thiết bị chủ động, phát ngắt — đó là bẫy, vì chữ "sensor" nghe như có sự kiện. Demand-driven I/O task dành cho thiết bị thụ động không cần đọc định kỳ, thường là thiết bị xuất.' },
    { id: 'q16',
      question: 'Which pattern does this code use, and what does it print?|||Đoạn code này dùng pattern nào, và nó in ra gì?',
      code: `interface Space { int beds(); }

static class Room implements Space {
    private final int beds;
    Room(int beds) { this.beds = beds; }
    public int beds() { return beds; }
}

static class Group implements Space {
    private final List<Space> children = new ArrayList<>();
    Group add(Space s) { children.add(s); return this; }
    public int beds() {
        int sum = 0;
        for (Space s : children) sum += s.beds();
        return sum;
    }
}

public static void main(String[] args) {
    Group floor1 = new Group().add(new Room(4)).add(new Room(6));
    Group floor2 = new Group().add(new Room(8));
    Group building = new Group().add(floor1).add(floor2).add(new Room(2));
    floor2.add(new Room(4));
    System.out.println(building.beds() + " " + floor1.beds());
}`,
      codeLang: 'java',
      options: ['Decorator — 24 10|||Decorator — 24 10', 'Composite — 24 10|||Composite — 24 10', 'Composite — 20 10|||Composite — 20 10', 'Iterator — 22 10|||Iterator — 22 10'],
      correctIndex: 1,
      points: 1,
      explanation: 'Room (leaf) and Group (composite) implement the same Space interface, and Group forwards beds() to all its children, so the client treats one room and a whole building the same way — that is Composite. building holds references, not copies, so the room added to floor2 after building was assembled still counts: 4 + 6 + 8 + 4 + 2 = 24, and floor1 = 10. C forgets that late add (20). A is wrong because a Decorator wraps exactly one object and adds behaviour to it, while Group holds many children.|||Room (lá) và Group (nút gộp) cùng cài interface Space, và Group chuyển lời gọi beds() xuống mọi con, nên client đối xử với một phòng và cả toà nhà như nhau — đó là Composite. building giữ tham chiếu chứ không giữ bản sao, nên phòng thêm vào floor2 sau khi đã lắp building vẫn được tính: 4 + 6 + 8 + 4 + 2 = 24, và floor1 = 10. C quên lần thêm muộn đó (20). A sai vì Decorator bọc đúng một đối tượng và thêm hành vi cho nó, còn Group giữ nhiều con.' },
    { id: 'q17',
      question: 'Which pattern does this code use, and what does it print?|||Đoạn code này dùng pattern nào, và nó in ra gì?',
      code: `static abstract class CheckIn {
    final String run(String who) {
        String s = verify(who);
        if (needsDeposit()) s += "+deposit";
        return s + "+key";
    }
    abstract String verify(String who);
    boolean needsDeposit() { return true; }
}

static class StudentCheckIn extends CheckIn {
    String verify(String who) { return "id:" + who; }
}

static class ExchangeCheckIn extends CheckIn {
    String verify(String who) { return "passport:" + who; }
    boolean needsDeposit() { return false; }
}

public static void main(String[] args) {
    List<String> out = new ArrayList<>();
    for (CheckIn c : List.of(new StudentCheckIn(), new ExchangeCheckIn())) out.add(c.run("An"));
    System.out.println(String.join(" | ", out));
}`,
      codeLang: 'java',
      options: ['Template Method — id:An+deposit+key | passport:An+key|||Template Method — id:An+deposit+key | passport:An+key', 'Strategy — id:An+deposit+key | passport:An+key|||Strategy — id:An+deposit+key | passport:An+key', 'Template Method — id:An+deposit+key | passport:An+deposit+key|||Template Method — id:An+deposit+key | passport:An+deposit+key', 'Factory Method — id:An+key | passport:An+key|||Factory Method — id:An+key | passport:An+key'],
      correctIndex: 0,
      points: 1,
      explanation: 'run() is a final skeleton in the superclass that calls one abstract step (verify) and one hook with a default (needsDeposit); subclasses fill in steps without changing the order — Template Method, which works by inheritance. Strategy (B) would pass an object into the context and work by composition, so the output is right but the name is wrong. C forgets that ExchangeCheckIn overrides the hook to false; D drops the deposit for students, whose hook keeps the default true.|||run() là khung thuật toán final ở lớp cha, gọi một bước trừu tượng (verify) và một hook có mặc định (needsDeposit); lớp con điền các bước mà không đổi thứ tự — đó là Template Method, chạy bằng kế thừa. Strategy (B) sẽ truyền một đối tượng vào context và chạy bằng kết hợp (composition), nên output đúng mà tên sai. C quên rằng ExchangeCheckIn ghi đè hook thành false; D bỏ mất tiền cọc của sinh viên, trong khi hook của họ giữ mặc định true.' },
    { id: 'q18',
      question: 'The check-in screen must call five classes in the right order — ContractService, KeyCardService, InventoryService, NotificationService and AuditLog. The team wants the screen to call one simple operation checkIn(studentId) and know nothing about those five classes. Which pattern fits?|||Màn hình nhận phòng phải gọi năm lớp theo đúng thứ tự — ContractService, KeyCardService, InventoryService, NotificationService và AuditLog. Nhóm muốn màn hình chỉ gọi một thao tác đơn giản checkIn(studentId) và không biết gì về năm lớp đó. Pattern nào phù hợp?',
      options: ['Adapter|||Adapter (bộ chuyển đổi)', 'Proxy|||Proxy (đại diện)', 'Facade|||Facade (mặt tiền)', 'Mediator|||Mediator (trung gian)'],
      correctIndex: 2,
      points: 1,
      explanation: 'Facade provides one unified, simpler interface to a set of interfaces in a subsystem, so the client depends on one class instead of five. Adapter is the tempting answer, but it converts ONE existing interface into the interface a client expects; nothing here has the wrong interface. Proxy stands in for one object to control access; Mediator manages the communication BETWEEN peer objects, while here the screen is the only caller.|||Facade cung cấp một interface thống nhất, đơn giản hơn cho một nhóm interface trong một hệ con, nên client chỉ phụ thuộc một lớp thay vì năm. Adapter là đáp án hấp dẫn, nhưng nó chuyển MỘT interface có sẵn sang interface mà client mong đợi; ở đây không có gì sai interface cả. Proxy đứng thay một đối tượng để kiểm soát truy cập; Mediator quản lý giao tiếp GIỮA các đối tượng ngang hàng, còn ở đây chỉ có màn hình là bên gọi.' },
    { id: 'q19',
      question: 'The dormitory has just opened SUITE rooms. What does this program print, and which principle should guide the fix?|||Ký túc xá vừa mở loại phòng SUITE. Chương trình này in ra gì, và nguyên lý nào nên dẫn đường cho việc sửa?',
      code: `static int monthlyFee(String type, int months) {
    switch (type) {
        case "STANDARD": return 800 * months;
        case "PREMIUM":  return 1500 * months;
        default:         return 0;
    }
}

public static void main(String[] args) {
    // the dormitory has just opened SUITE rooms
    System.out.println(monthlyFee("PREMIUM", 2) + " " + monthlyFee("SUITE", 2));
}`,
      codeLang: 'java',
      options: ['3000 3000 — the default branch reuses the last price, so nothing needs to change|||3000 3000 — nhánh default dùng lại giá gần nhất, nên không cần sửa gì', '1600 0 — Single Responsibility: move the switch into its own class|||1600 0 — trách nhiệm đơn (SRP): chuyển switch sang một lớp riêng', '3000 0 — Liskov Substitution: SUITE cannot replace PREMIUM|||3000 0 — thay thế Liskov (LSP): SUITE không thay được PREMIUM', '3000 0 — Open/Closed: make each room type a class with its own fee, so a new type is added without editing existing code|||3000 0 — mở/đóng (OCP): cho mỗi loại phòng thành một lớp tự tính phí, để thêm loại mới mà không sửa code cũ'],
      correctIndex: 3,
      points: 1,
      explanation: 'PREMIUM for 2 months is 1500 × 2 = 3000; "SUITE" matches no case and falls into default, so it silently costs 0. The root cause is that the class must be edited every time a room type is added — it is not closed for modification, so the Open/Closed Principle is broken; polymorphism (one class per type, or a Strategy) fixes it. C prints the right numbers but names LSP, which is about a subtype breaking the promise of its supertype; there is no subtype here. B gets the arithmetic wrong (800 × 2).|||PREMIUM 2 tháng là 1500 × 2 = 3000; "SUITE" không khớp case nào nên rơi vào default, lặng lẽ thành 0 đồng. Gốc rễ là lớp này phải sửa mỗi khi thêm loại phòng — nó không "đóng với sửa đổi", nên vi phạm nguyên lý mở/đóng (OCP); đa hình (mỗi loại một lớp, hoặc dùng Strategy) sửa được. C in đúng số nhưng gọi tên LSP, nguyên lý nói về kiểu con phá lời hứa của kiểu cha; ở đây không có kiểu con nào. B tính sai (800 × 2).' },
    { id: 'q20',
      question: 'Asked to "recommend the best architecture" for the dormitory system (two developers, one server, about 3,000 users, top priority: easy maintenance), ChatGPT answers "microservices, for scalability". Following the course slides on using AI to select an architecture, what should the designer do?|||Khi được hỏi "đề xuất kiến trúc tốt nhất" cho hệ thống ký túc xá (hai lập trình viên, một máy chủ, khoảng 3.000 người dùng, ưu tiên số một: dễ bảo trì), ChatGPT trả lời "microservices, để mở rộng tốt". Theo slide của môn về dùng AI để chọn kiến trúc, người thiết kế nên làm gì?',
      options: ['Accept it, because microservices are the most modern style and AI has seen many systems|||Chấp nhận, vì microservices là kiểu hiện đại nhất và AI đã thấy rất nhiều hệ thống', 'Give the AI the real constraints and prioritized quality attributes, ask it to compare styles with pros and cons, then review and decide — here a layered client/server design likely fits better|||Đưa cho AI các ràng buộc thật và các quality attribute đã xếp ưu tiên, yêu cầu so sánh các kiểu kiến trúc kèm ưu nhược, rồi tự rà soát và quyết định — ở đây kiến trúc phân tầng client/server nhiều khả năng hợp hơn', 'Ask Copilot instead, because Copilot is the tool the slides assign to choosing architectures|||Hỏi Copilot thay vào đó, vì Copilot là công cụ slide giao cho việc chọn kiến trúc', 'Regenerate the answer until two different AI answers agree, then adopt it|||Sinh lại câu trả lời tới khi hai câu trả lời của AI giống nhau, rồi dùng nó'],
      correctIndex: 1,
      points: 1,
      explanation: 'The slides list the steps: describe the system requirements (including the non-functional ones), use AI to compare styles with pros and cons, ask for a diagram, then review and customize — the designer decides. The answer ignored the stated priority (maintainability) and the size of the team; scalability is not what this system needs, and microservices would add operational cost. C is wrong: the slides assign Copilot to generating code templates (service, DAO, CRUD, pattern code), not to choosing an architecture; D replaces review with luck.|||Slide liệt kê các bước: mô tả yêu cầu hệ thống (kể cả yêu cầu phi chức năng), dùng AI so sánh các kiểu kiến trúc kèm ưu nhược, nhờ vẽ sơ đồ, rồi rà soát và tuỳ chỉnh — người thiết kế quyết định. Câu trả lời đã bỏ qua ưu tiên đã nêu (dễ bảo trì) và quy mô nhóm; hệ thống này không cần scalability, còn microservices thêm chi phí vận hành. C sai: slide giao Copilot việc sinh khung code (service, DAO, CRUD, code pattern), không phải việc chọn kiến trúc; D thay việc rà soát bằng may rủi.' },
  ],
};

export default {
  extrasEnd: [L_x_luyen_pe],
  quiz: QUIZ,
  quizDescription: 'Đề TE luyện thi 20 câu phủ cả môn theo tỷ trọng đề cương — UML/COMET (vòng đời UP, include/extend, timer actor, bội số, composition, business logic, thứ tự action trên statechart, quyết định sync/async), kiến trúc (scalability, service subsystem, async callback, Broker Handle, Long-Living Transaction, required interface, periodic I/O task), patterns + SOLID (Composite, Template Method chạy Java thật, Facade, OCP) và dùng AI chọn kiến trúc — mỗi câu có giải thích song ngữ.',
};
