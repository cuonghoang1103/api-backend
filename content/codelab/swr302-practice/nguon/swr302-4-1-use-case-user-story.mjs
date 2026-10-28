/**
 * SWR302 · 4.1 — Use cases and user stories; actors (Wiegers Ch.8 slides 1–11).
 */
import { tn, CU_PHAP } from './_chung.mjs';
import { phanLoai, tracNghiem, baiJs, moDun } from './_bai.mjs';
import { kiemUseCase } from './_kiemmh.mjs';
import { khoiThamChieu } from './_ve.mjs';

const E1 = tracNghiem({
  tieuDe: 'Use cases 1 — use case or user story?',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p>Both are <b>usage-centric</b>: they describe what users need to do with the system. A <b>use case</b> describes a sequence of interactions between an actor and the system that yields a result of value, with normal, alternative and exception flows. A <b>user story</b> is a short statement "As a &lt;role&gt;, I want &lt;goal&gt; so that &lt;benefit&gt;", detailed later through conversation and acceptance criteria.</p>', vi: '<p>Cả hai đều <b>lấy việc sử dụng làm trung tâm</b>. <b>Use case</b> mô tả chuỗi tương tác giữa actor và hệ thống đem lại kết quả có giá trị, gồm luồng chính, luồng thay thế, ngoại lệ. <b>User story</b> là câu ngắn "As a &lt;vai trò&gt;, I want &lt;mục tiêu&gt; so that &lt;lợi ích&gt;", chi tiết hoá sau qua trao đổi và tiêu chí chấp nhận.</p>' },
  cau: [
    { en: 'What does a use case describe?', vi: 'Use case mô tả gì?', lc: [['a', 'A screen of the application'], ['b', 'A sequence of actor–system interactions that gives the actor a result of value'], ['c', 'A database table'], ['d', 'A class of the design']], dap: 'b', giai: ['The value to the actor is what makes it a use case.', 'Giá trị cho actor là thứ làm nên một use case.'] },
    { en: 'Which is a user story?', vi: 'Cái nào là một user story?', lc: [['a', 'UC-05 Book Appointment: normal flow 1…7, alternative flow 4a'], ['b', 'As a patient, I want to book an appointment online so that I do not have to call the clinic.'], ['c', 'The system shall store appointments.'], ['d', 'Appointment: id, date, doctor']], dap: 'b', giai: ['Role, goal, benefit.', 'Vai trò, mục tiêu, lợi ích.'] },
    { en: 'Which name is a good use case name?', vi: 'Tên nào là tên use case tốt?', lc: [['a', 'Appointment'], ['b', 'Book Appointment'], ['c', 'Appointment Screen'], ['d', 'Database Insert']], dap: 'b', giai: ['Verb + object, from the actor’s point of view.', 'Động từ + tân ngữ, từ góc nhìn actor.'] },
    { en: 'Use cases are usually written…', vi: 'Use case thường được viết…', lc: [['a', 'with more structure and detail before development, often on waterfall-style projects'], ['b', 'only on agile projects'], ['c', 'after the code is written'], ['d', 'by the testers only']], dap: 'a', giai: ['User stories are lighter and detailed just in time; use cases carry more structure up front. Both can be used together.', 'User story nhẹ hơn, chi tiết hoá đúng lúc; use case có cấu trúc từ đầu. Có thể dùng cả hai.'] },
  ],
  goiY: ['Use case = tương tác dẫn tới kết quả có giá trị; story = vai trò/mục tiêu/lợi ích.', 'Tên use case: động từ + tân ngữ.'],
  loiHayGap: ['Đặt tên use case bằng danh từ hay tên màn hình.', 'Coi một câu "The system shall…" là user story.'],
  giaiThich: '<p>Answers: b · b · b · a.</p>',
  thuatNgu: tn('useCase', 'userStory', 'actor'),
  khaiNiem: ['use cases', 'user stories'],
});

const E2 = phanLoai({
  tieuDe: 'Use cases 2 — actor or not?',
  doKho: 'EASY', phut: 7,
  moTa: { en: '<p>An <b>actor</b> is a person (playing a role), another software system or a hardware device that interacts with the system to achieve a goal. It is always OUTSIDE the system. Decide for each element of <b>ClinicCare</b>, an appointment system for a private clinic: <b>Actor</b>, or <b>Not an actor</b> (a part of the system, data, or someone who never interacts with it).</p>', vi: '<p><b>Actor</b> là người (đóng một vai trò), hệ thống phần mềm khác hoặc thiết bị phần cứng tương tác với hệ thống để đạt mục tiêu. Luôn ở NGOÀI hệ thống. Với mỗi thành phần của <b>ClinicCare</b> (hệ thống đặt lịch phòng khám tư): <b>Actor</b> hay <b>Not an actor</b> (một phần hệ thống, dữ liệu, hoặc người không bao giờ tương tác).</p>' },
  cot: 'Actor?', luaChon: ['Actor', 'Not an actor'],
  hang: [
    ['Patient who books online', 'Actor'],
    ['Receptionist', 'Actor'],
    ['The appointment database', 'Not an actor'],
    ['The insurance company’s claims API', 'Actor'],
    ['The SMS gateway that delivers reminders', 'Actor'],
    ['The booking confirmation screen', 'Not an actor'],
    ['A patient’s relative who only accompanies the patient to the clinic', 'Not an actor'],
    ['The queue-number display in the waiting room (a device that receives numbers to show)', 'Actor'],
  ],
  giaiThich: '<p>Roles, external systems and devices that exchange data with ClinicCare are actors. The database and screens are part of the system; someone who never interacts with it is not an actor.</p>',
  goiY: ['Actor ở NGOÀI hệ thống và TƯƠNG TÁC với nó.', 'Thiết bị và hệ thống ngoài cũng có thể là actor.'],
  loiHayGap: ['Vẽ CSDL thành actor.', 'Vẽ người thân đi cùng thành actor dù họ không dùng hệ thống.'],
  thuatNgu: tn('actor', 'systemBoundary'),
  khaiNiem: ['actors'],
});

const GIAI = `
@startuml
left to right direction
actor Patient
actor Receptionist
actor Doctor
actor "SMS Gateway" as SMS
rectangle "ClinicCare" {
  usecase "Book Appointment" as UC1
  usecase "Cancel Appointment" as UC2
  usecase "Check In Patient" as UC3
  usecase "View Day Schedule" as UC4
  usecase "Send Reminder" as UC5
}
Patient --> UC1
Patient --> UC2
Receptionist --> UC1
Receptionist --> UC3
Doctor --> UC4
UC5 --> SMS
@enduml
`;
const E3 = baiJs({
  tieuDe: 'Use cases 3 — draw a first use case diagram',
  doKho: 'MEDIUM', phut: 12,
  moTa: { en: `<p><b>ClinicCare</b>: a <b>patient</b> books and cancels appointments online; the <b>receptionist</b> can also book for patients who phone in, and checks patients in when they arrive; a <b>doctor</b> views the schedule of the day. The day before each appointment ClinicCare sends a reminder through the <b>SMS gateway</b>. Draw the use case diagram.</p><p>${CU_PHAP.usecase.en}</p>`, vi: `<p><b>ClinicCare</b>: <b>bệnh nhân</b> đặt và huỷ lịch trực tuyến; <b>lễ tân</b> cũng đặt hộ người gọi điện và check-in bệnh nhân khi tới; <b>bác sĩ</b> xem lịch trong ngày. Một ngày trước mỗi lịch hẹn, ClinicCare gửi nhắc qua <b>cổng SMS</b>. Vẽ sơ đồ use case.</p><p>${CU_PHAP.usecase.vi}</p>` },
  yeuCau: [{ en: 'One boundary, four actors, five use cases named verb + object, every actor linked.', vi: 'Một biên, bốn actor, năm use case tên động từ + tân ngữ, actor nào cũng được nối.' }],
  viDu: [{ input: 'Patient --> UC1', output: 'the patient takes part in Book Appointment', explanation: 'An association line.|||Đường liên kết.' }],
  tep: { 'usecase.js': ['const USE_CASE_DIAGRAM = ´\n@startuml\nactor Patient\nrectangle "ClinicCare" {\n}\n@enduml\n´;\n', `// The SMS gateway is a secondary actor of the reminder (a temporal use case with no human starter).\nconst USE_CASE_DIAGRAM = ´${GIAI.replace(/\s+$/, '')}\n´;\n`] },
  kiem: kiemUseCase({
    bien: 'USE_CASE_DIAGRAM',
    actors: [{ ten: 'Patient', khop: ['patient'] }, { ten: 'Receptionist', khop: ['reception|front desk'] }, { ten: 'Doctor', khop: ['doctor|physician'] }, { ten: 'SMS Gateway', khop: ['sms|message|notif'] }],
    camActor: [{ ten: 'Database / System', khop: ['database|^system$|cliniccare|scheduler|timer'], lyDo: 'it is part of ClinicCare', lyDoVi: 'nó là một phần của ClinicCare' }],
    ucs: [
      { ten: 'Book Appointment (patient and receptionist)', khop: ['book'], actor: [{ ten: 'Patient', khop: ['patient'] }, { ten: 'Receptionist', khop: ['reception|front desk'] }] },
      { ten: 'Cancel Appointment', khop: ['cancel'], actor: [{ ten: 'Patient', khop: ['patient'] }] },
      { ten: 'Check In Patient', khop: ['check ?in|arriv|register arrival'], actor: [{ ten: 'Receptionist', khop: ['reception|front desk'] }] },
      { ten: 'View Day Schedule', khop: ['schedule|view'], actor: [{ ten: 'Doctor', khop: ['doctor|physician'] }] },
      { ten: 'Send Reminder', khop: ['remind'], actor: [{ ten: 'SMS Gateway', khop: ['sms|message|notif'] }] },
    ],
    moiKiemUC: 2,
  }),
  goiY: ['Bốn actor: Patient, Receptionist, Doctor, SMS Gateway.', 'Book Appointment nối với CẢ Patient và Receptionist.'],
  loiHayGap: ['Đặt use case ngoài khung rectangle.', 'Thêm actor "Scheduler" cho việc gửi nhắc — đó là sự kiện thời gian trong hệ thống.'],
  giaiThich: `<p>Four actors, five use cases; the receptionist shares Book Appointment with the patient.</p>${khoiThamChieu('uc', GIAI, 'Use case diagram — ClinicCare (first cut)')}`,
  thuatNgu: tn('useCase', 'actor', 'systemBoundary'),
  khaiNiem: ['use case diagram'],
  boYeu: [{ ten: 'UC ngoài biên + actor Database', tep: { 'usecase.js': 'const USE_CASE_DIAGRAM = `\n@startuml\nactor Patient\nactor Database\nusecase "Book Appointment" as UC1\nPatient --> UC1\nUC1 --> Database\n@enduml\n`;\n' } }],
});

const E4 = phanLoai({
  tieuDe: 'Use cases 4 — is it a good use case?',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Classic mistakes in student use case diagrams: a use case that is only a step of another one, a use case named after a screen or a CRUD operation, a use case that gives no value to any actor. Decide whether each candidate for ClinicCare is a <b>Good use case</b> or <b>Not a use case</b>.</p>', vi: '<p>Lỗi kinh điển trong sơ đồ use case của sinh viên: use case chỉ là một bước của use case khác, đặt tên theo màn hình hay thao tác CRUD, use case không đem lại giá trị cho actor nào. Với mỗi ứng viên của ClinicCare: <b>Good use case</b> hay <b>Not a use case</b>.</p>' },
  cot: 'Verdict', luaChon: ['Good use case', 'Not a use case'],
  hang: [
    ['Book Appointment', 'Good use case'],
    ['Click "Next" button', 'Not a use case'],
    ['Appointment Table Insert', 'Not a use case'],
    ['View Day Schedule', 'Good use case'],
    ['Validate Phone Number Format', 'Not a use case'],
    ['Pay Consultation Fee', 'Good use case'],
    ['Home Page', 'Not a use case'],
  ],
  giaiThich: '<p>A use case is a goal of an actor with a result of value. UI actions, screens, database operations and validation steps are parts of use cases, not use cases.</p>',
  goiY: ['Hỏi: actor có "đạt được một điều có giá trị" sau use case này không?', 'Một bước kiểm tra hay một nút bấm chỉ là một bước bên trong use case.'],
  loiHayGap: ['Mỗi màn hình một use case.', 'Tách "Validate…" thành use case riêng.'],
  thuatNgu: tn('useCase'),
  khaiNiem: ['use case granularity'],
});

export default moDun({
  slug: 'swr302-4-1-use-case-user-story',
  ten: '4.1 Use cases, user stories and actors',
  moTaModule: 'Use case và user story, actor là gì (người, hệ thống, thiết bị ngoài), tự vẽ sơ đồ use case đầu tiên của ClinicCare bằng PlantUML có chấm, nhận ra "không phải use case" (màn hình, CRUD, bước kiểm tra).',
  de: [E1, E2, E4, E3],
});
