/**
 * SWR302 · DỰ ÁN ClinicCare — Mốc 3 (chương 4): sơ đồ use case + đặc tả use case "Book Appointment" + Interview corner.
 */
import { tn, jsLit, CU_PHAP } from './_chung.mjs';
import { deLon } from './_lab.mjs';
import { kiemUseCase, kiemDacTaUC } from './_kiemmh.mjs';
import { khoiThamChieu } from './_ve.mjs';
import { BOI_CANH, A, phongVan } from './_cliniccare.mjs';

const BR = [
  ['BR-01', 'An appointment can be cancelled free of charge up to 2 hours before it starts.'],
  ['BR-02', 'A patient with 3 no-shows in the last 90 days must prepay when booking.'],
  ['BR-03', 'A patient may hold at most 2 future appointments.'],
  ['BR-04', 'Visit fee = service fee + 10% VAT.'],
  ['BR-05', 'A slot lasts 15 minutes.'],
];

const GIAI_UC = `
@startuml
left to right direction
actor Patient
actor Doctor
actor Receptionist
actor Pharmacist
actor "Clinic Manager" as CM
actor "VNPay Payment Gateway" as PG
actor "SMS Gateway" as SG
actor "National e-Prescription System" as NE
rectangle "ClinicCare" {
  usecase "Register Account" as UC1
  usecase "Book Appointment" as UC2
  usecase "Prepay Appointment" as UC3
  usecase "Cancel Appointment" as UC4
  usecase "Pay Visit Fee" as UC5
  usecase "View Prescription" as UC6
  usecase "Publish Working Slots" as UC7
  usecase "View Daily Appointment List" as UC8
  usecase "Record Visit Notes" as UC9
  usecase "Write e-Prescription" as UC10
  usecase "Send Prescription to National System" as UC11
  usecase "Check In Patient" as UC12
  usecase "Mark No-show" as UC13
  usecase "Dispense Prescription" as UC14
  usecase "Manage Services and Fees" as UC15
  usecase "View Monthly Report" as UC16
  usecase "Send Appointment Reminder" as UC17
}
Patient --> UC1
Patient --> UC2
Receptionist --> UC2
UC3 ..> UC2 : <<extend>>
UC3 --> PG
Patient --> UC4
Patient --> UC5
UC5 --> PG
Patient --> UC6
Doctor --> UC7
Doctor --> UC8
Doctor --> UC9
Doctor --> UC10
UC10 ..> UC11 : <<include>>
UC11 --> NE
Receptionist --> UC12
Receptionist --> UC13
Pharmacist --> UC14
CM --> UC15
CM --> UC16
UC17 --> SG
@enduml
`;

const GIAI_SPEC = {
  id: 'UC-02',
  name: 'Book Appointment',
  primaryActor: 'Patient',
  secondaryActors: ['VNPay Payment Gateway', 'SMS Gateway'],
  description: 'A signed-in patient books a free 15-minute slot with a chosen doctor; patients with 3 recent no-shows must prepay.',
  trigger: 'The patient chooses Book an appointment in the app.',
  preconditions: ['PRE-1. The patient is signed in to ClinicCare.', 'PRE-2. The chosen doctor has published working slots.'],
  postconditions: ['POST-1. An appointment with status Booked exists for the patient.', 'POST-2. The slot is no longer free and a confirmation SMS has been sent.'],
  normalFlow: [
    '1. Patient selects a service and a doctor.',
    '2. System displays the free slots of that doctor for the next 14 days.',
    '3. Patient selects a slot.',
    '4. System checks that the patient holds fewer than 2 future appointments and whether prepayment is required.',
    '5. System displays the summary with the visit fee and the free-cancellation deadline.',
    '6. Patient confirms the booking.',
    '7. System creates the appointment with status Booked, reserves the slot and sends a confirmation SMS.',
  ],
  alternativeFlows: [
    { id: 'AF1', at: 4, name: 'Prepayment required (3 no-shows in 90 days)', steps: ['4a. System informs the patient that prepayment is required (BR-02).', '4b. Patient pays the visit fee through VNPay.', '4c. VNPay returns a successful payment result; the use case continues at step 7.'] },
  ],
  exceptions: [
    { id: 'E1', at: 4, condition: 'The patient already holds 2 future appointments (BR-03)', steps: ['System shows the existing appointments; no appointment is created.'] },
    { id: 'E2', at: 7, condition: 'The slot was taken by another patient before confirmation', steps: ['System informs the patient and returns to step 2.'] },
    { id: 'E3', at: 4, condition: 'The prepayment is declined or times out after 15 minutes', steps: ['System cancels the booking attempt and releases the slot.'] },
  ],
  priority: 'High',
  frequency: 'About 150 bookings per day after go-live',
  businessRules: ['BR-02', 'BR-03', 'BR-04', 'BR-05'],
  assumptions: ['Doctors publish their slots at least two weeks ahead.'],
};

const KIEM = [
  ...kiemUseCase({
    bien: 'USE_CASE_DIAGRAM',
    nhom: { cuPhap: 'f1', actor: 'f2', ucs: 'f3', quanHe: 'f3' },
    actors: [A.patient, A.doctor, A.recep, A.pharm, A.manager, A.pay, A.sms, A.nep],
    camActor: [
      { ten: 'Appointment / Slot / Database / ClinicCare', khop: ['^appointment|^slot|database|cliniccare|schedule$'], lyDo: 'that is data or the system itself', lyDoVi: 'đó là dữ liệu hoặc chính hệ thống' },
      { ten: 'Walk-in patient / Caller', khop: ['walk in|caller|phone'], lyDo: 'patients who phone are served by the Receptionist actor', lyDoVi: 'bệnh nhân gọi điện được phục vụ qua actor Receptionist' },
    ],
    ucs: [
      { ten: 'Register account', khop: ['register|sign up|create account'], actor: [A.patient] },
      { ten: 'Book appointment', khop: ['^book|book appoint|make appoint'], actor: [A.patient, A.recep] },
      { ten: 'Cancel appointment', khop: ['cancel'], actor: [A.patient] },
      { ten: 'Pay visit fee online', khop: ['(^| )pay (visit|fee|bill|online)|visit fee|pay fee'], actor: [A.patient, A.pay] },
      { ten: 'View prescription', khop: ['view prescri|read prescri|see prescri|my prescri'], actor: [A.patient] },
      { ten: 'Publish working slots', khop: ['publish|working slot|schedule slot|set slot'], actor: [A.doctor] },
      { ten: 'View daily appointment list', khop: ['daily|appointment list|today'], actor: [A.doctor] },
      { ten: 'Record visit notes', khop: ['visit note|record visit|notes'], actor: [A.doctor] },
      { ten: 'Write e-prescription', khop: ['write|prescribe|create prescri|issue prescri'], actor: [A.doctor] },
      { ten: 'Check in patient', khop: ['check ?in|arriv'], actor: [A.recep] },
      { ten: 'Mark no-show', khop: ['no ?show'], actor: [A.recep] },
      { ten: 'Dispense prescription', khop: ['dispens'], actor: [A.pharm] },
      { ten: 'Manage services and fees', khop: ['manage service|services|service and fee|price list|tariff|set fee'], actor: [A.manager] },
      { ten: 'View monthly report', khop: ['report'], actor: [A.manager] },
      { ten: 'Send appointment reminder', khop: ['remind'], actor: [A.sms] },
      { ten: 'Send prescription to the national system', khop: ['send prescri|submit prescri|national|transmit prescri'], actor: [A.nep] },
    ],
    quanHe: [
      { loai: 'extend', ten: 'Prepay Appointment «extend» Book Appointment', tu: ['prepay|pay in advance|deposit|advance payment'], den: ['^book|book appoint|make appoint'], lyDo: 'only patients with 3 no-shows prepay — optional, conditional behaviour', lyDoVi: 'chỉ bệnh nhân có 3 lần no-show mới trả trước — hành vi tuỳ chọn, có điều kiện' },
      { loai: 'include', ten: 'Write e-Prescription «include» Send Prescription to National System', tu: ['write|prescribe|create prescri|issue prescri'], den: ['send prescri|submit prescri|national|transmit prescri'], lyDo: 'by law every prescription is sent — it always happens', lyDoVi: 'luật bắt buộc gửi mọi đơn — luôn xảy ra' },
    ],
    toiThieuUC: 15,
  }),
  ...kiemDacTaUC({
    bien: 'UC_SPEC', bienBR: 'BUSINESS_RULES',
    nhom: { cauTruc: 'f4', dieuKien: 'f5', luong: 'f6', ngoaiLe: 'f7' },
    actorChinh: A.patient,
    tienDK: [{ ten: 'the patient is signed in', khop: ['sign|log'] }, { ten: 'the doctor has published slots', khop: ['publish|slot|schedule'] }],
    hauDK: [{ ten: 'an appointment with status Booked exists', khop: ['appointment|booked'] }, { ten: 'the slot is no longer free', khop: ['slot'] }],
    luongChinh: {
      toiThieu: 6,
      su: [
        { ten: 'select doctor / service', khop: ['doctor|service'] },
        { ten: 'show free slots', khop: ['slot'] },
        { ten: 'check the rules (2 future appointments / prepayment)', khop: ['check|verif|validat'] },
        { ten: 'patient confirms', khop: ['confirm'] },
        { ten: 'system creates the appointment', khop: ['creat|record|save|store|reserv'] },
      ],
    },
    thayThe: [{ ten: 'prepayment required ⇒ pay through VNPay', khop: ['prepay|pay|deposit|vnpay'] }],
    ngoaiLe: [{ ten: 'already 2 future appointments', khop: ['2 future|two future|already|limit|maximum|at most'] }, { ten: 'slot taken meanwhile', khop: ['taken|no longer|another patient|unavailable|not free'] }],
  }),
];

const TEP = {
  'data/business-rules.js': [
    `// Given — business rules of ClinicCare (read only).\nconst BUSINESS_RULES = ${jsLit(BR.map(([id, statement]) => ({ id, statement })))};\n`,
    `// Given — business rules of ClinicCare (read only).\nconst BUSINESS_RULES = ${jsLit(BR.map(([id, statement]) => ({ id, statement })))};\n`,
  ],
  'answers/a-use-case-diagram.js': [
    "// A. Use case diagram (PlantUML subset).\nconst USE_CASE_DIAGRAM = ´\n@startuml\nleft to right direction\nactor Patient\nrectangle \"ClinicCare\" {\n  usecase \"Book Appointment\" as UC1\n}\nPatient --> UC1\n@enduml\n´;\n",
    `// A. 8 actors (5 user roles + 3 external systems), 17 use cases; «extend» = optional, «include» = always.\nconst USE_CASE_DIAGRAM = ´${GIAI_UC.replace(/\s+$/, '')}\n´;\n`,
  ],
  'answers/b-uc-spec.js': [
    `// B. Use case specification "Book Appointment" — Wiegers template.
const UC_SPEC = {
  id: 'UC-02', name: 'Book Appointment', primaryActor: '', secondaryActors: [], description: '', trigger: '',
  preconditions: [], postconditions: [],
  normalFlow: ['1. Patient …', '2. System …'],
  alternativeFlows: [ /* { id: 'AF1', at: <step>, name: '…', steps: ['…'] } */ ],
  exceptions: [ /* { id: 'E1', at: <step>, condition: '…', steps: ['…'] } */ ],
  priority: '', frequency: '', businessRules: [], assumptions: [],
};
`,
    `// B. Normal flow alternates actor / system; the prepayment branch is an alternative flow; rule violations are exceptions.\nconst UC_SPEC = ${jsLit(GIAI_SPEC)};\n`,
  ],
};

const mod = deLon({
  slug: 'swr302-4-project-cliniccare-m3-use-cases',
  ten: 'ClinicCare project — Milestone 3: Use cases',
  moTaModule: 'Dự án ClinicCare, mốc 3 (chương 4): sơ đồ use case 8 actor / 17 use case với «extend» trả trước và «include» gửi đơn thuốc quốc gia, đặc tả đầy đủ use case "Book Appointment" theo template Wiegers — chấm bằng máy đọc PlantUML; kèm Góc phỏng vấn.',
  baiHoc: 'swr302-4-6-ch8-template',
  dangBai: 'project',
  tieuDe: 'ClinicCare project — Milestone 3: Use case diagram and specification',
  phu: { en: 'Running project · milestone 3 of 7 · use cases · 10 marks', vi: 'Dự án xuyên suốt · mốc 3/7 · use case · 10 điểm' },
  moTa: {
    en: `${BOI_CANH.en}<p><b>A.</b> Draw the use case diagram of ClinicCare release 1: every user role and external system that interacts with the system, every use case of the case, with «extend» for the prepayment that only some patients make and «include» for sending every prescription to the national system.</p>
<p><b>B.</b> Write the full specification of <b>Book Appointment</b> with Wiegers’ template: actors, trigger, pre- and postconditions, a numbered normal flow alternating patient and system, the prepayment as an alternative flow, rule violations as exceptions, and the business rules it uses (catalogue in <code>data/business-rules.js</code>).</p>${CU_PHAP.usecase.en}`,
    vi: `${BOI_CANH.vi}<p><b>A.</b> Vẽ sơ đồ use case bản 1: mọi vai người dùng và hệ thống ngoài, mọi use case của đề; «extend» cho việc trả trước (chỉ một số bệnh nhân), «include» cho việc gửi mọi đơn thuốc lên hệ thống quốc gia. <b>B.</b> Viết đặc tả đầy đủ <b>Book Appointment</b> theo template Wiegers.</p>${CU_PHAP.usecase.vi}`,
  },
  chucNangChinh: [{ en: 'A. Use case diagram.', vi: 'A. Sơ đồ use case.' }, { en: 'B. Use case specification.', vi: 'B. Đặc tả use case.' }],
  yeuCauChung: [{ en: 'Use case names: verb + object; actors outside the boundary.', vi: 'Tên use case: động từ + đối tượng; actor nằm ngoài biên.' }],
  cayThuMuc: `data/business-rules.js      ← BUSINESS_RULES (given)
answers/
├── a-use-case-diagram.js   ← const USE_CASE_DIAGRAM = \`@startuml …\`
└── b-uc-spec.js            ← const UC_SPEC = { … }`,
  moHinh: { ten: 'Answer records', truong: [
    ['USE_CASE_DIAGRAM', 'PlantUML string', { en: 'actor / usecase / rectangle / --> / ..> : <<include>>', vi: '' }],
    ['UC_SPEC', '{ id, name, primaryActor, …, normalFlow[], alternativeFlows[{ id, at, name, steps }], exceptions[{ id, at, condition, steps }] }', { en: 'Wiegers template', vi: 'template Wiegers' }],
  ] },
  chucNang: [
    { ten: { en: 'A1. Diagram syntax and boundary', vi: 'A1. Cú pháp và biên' }, diem: 1, yeuCau: [{ en: 'Valid PlantUML subset.', vi: 'Đúng tập con PlantUML.' }], hook: ['use case diagram'] },
    { ten: { en: 'A2. Actors', vi: 'A2. Actor' }, diem: 1.5, yeuCau: [{ en: 'Eight actors, nothing internal.', vi: 'Tám actor, không có thứ bên trong.' }], hook: ['actors'] },
    { ten: { en: 'A3. Use cases and relationships', vi: 'A3. Use case và quan hệ' }, diem: 2.5, yeuCau: [{ en: 'All use cases with the right actors; extend/include direction.', vi: 'Đủ use case đúng actor; chiều extend/include.' }], hook: ['include', 'extend'] },
    { ten: { en: 'B1. Template structure', vi: 'B1. Cấu trúc template' }, diem: 1, yeuCau: [{ en: 'Every field.', vi: 'Đủ trường.' }], hook: ['use case template'] },
    { ten: { en: 'B2. Conditions', vi: 'B2. Điều kiện' }, diem: 1, yeuCau: [{ en: 'Pre- and postconditions.', vi: 'Tiền và hậu điều kiện.' }], hook: ['preconditions'] },
    { ten: { en: 'B3. Normal flow', vi: 'B3. Luồng chính' }, diem: 1.5, yeuCau: [{ en: 'Ordered steps, actor ↔ system.', vi: 'Bước có thứ tự, actor ↔ hệ thống.' }], hook: ['normal flow'] },
    { ten: { en: 'B4. Alternatives and exceptions', vi: 'B4. Luồng thay thế và ngoại lệ' }, diem: 1.5, yeuCau: [{ en: 'Branch points that exist; rules referenced.', vi: 'Điểm rẽ tồn tại; có tham chiếu luật.' }], hook: ['exceptions'] },
  ],
  idBatBuoc: [['USE_CASE_DIAGRAM', 'answers/a-use-case-diagram.js'], ['UC_SPEC', 'answers/b-uc-spec.js']],
  truDiem: [
    { en: 'Drawing «include» from Book Appointment to Prepay: prepayment does not always happen — it extends booking.', vi: 'Vẽ «include» từ Book Appointment sang Prepay: trả trước không luôn xảy ra — nó extend việc đặt lịch.' },
    { en: 'Making "Appointment" or "Database" an actor.', vi: 'Biến "Appointment" hay "Database" thành actor.' },
    { en: 'Writing the 2-appointment limit as an alternative flow — a rule violation that stops the goal is an exception.', vi: 'Viết giới hạn 2 lịch hẹn thành luồng thay thế — vi phạm luật làm dừng mục tiêu là ngoại lệ.' },
  ],
  goiY: [
    'A: «extend» vẽ TỪ use case mở rộng TỚI use case gốc (Prepay ..> Book); «include» vẽ TỪ use case gốc TỚI phần luôn chạy (Write ..> Send).',
    'B: luồng thay thế vẫn đạt mục tiêu (trả trước xong thì đặt được); ngoại lệ làm dừng mục tiêu.',
  ],
  loiHayGap: ['Thiếu Receptionist ở Book Appointment (đặt hộ người gọi điện).', 'Quên SMS Gateway và hệ thống quốc gia.', 'Điểm rẽ "at" trỏ tới bước không tồn tại.'],
  giaiThich: {
    en: `<p>Reference diagram:</p>${khoiThamChieu('uc', GIAI_UC, 'Use case diagram — ClinicCare release 1')}<p>The specification keeps the normal flow short and testable; the prepayment is an alternative path that still reaches the goal; the two-appointment limit and the lost slot are exceptions. Each business rule appears once in the catalogue and is referenced by id.</p>`,
    vi: `<p>Sơ đồ tham chiếu ở trên (bản tiếng Anh). Đặc tả giữ luồng chính ngắn, kiểm được; trả trước là đường thay thế vẫn đạt mục tiêu; giới hạn hai lịch hẹn và slot bị lấy mất là ngoại lệ. Mỗi luật nghiệp vụ nằm một lần trong danh mục và được tham chiếu theo mã.</p>`,
  },
  khaiNiem: ['use case diagram', 'use case specification', 'include', 'extend'],
  tienQuyet: ['Milestones 1–2', 'SWR302 lessons 4.1–4.4'],
  thuatNgu: tn('useCase', 'actor', 'include', 'extend', 'normalFlow', 'altFlow', 'exception', 'precondition'),
  moTaNgan: 'Dự án ClinicCare mốc 3: sơ đồ use case và đặc tả Book Appointment.',
  phut: 75,
  tep: TEP,
  kiem: KIEM,
  boYeu: [{ ten: 'include sai chiều, thiếu actor ngoài, ngoại lệ thành luồng thay thế', tep: {
    'answers/a-use-case-diagram.js': "const USE_CASE_DIAGRAM = `\n@startuml\nleft to right direction\nactor Patient\nactor Doctor\nactor Database\nrectangle \"ClinicCare\" {\n  usecase \"Book Appointment\" as UC1\n  usecase \"Prepay Appointment\" as UC2\n  usecase \"Cancel Appointment\" as UC3\n}\nPatient --> UC1\nUC1 ..> UC2 : <<include>>\nPatient --> UC3\nDatabase --> UC1\n@enduml\n`;\n",
  } }],
});

mod.de.push(phongVan({
  moc: 'use cases',
  khaiNiem: ['use cases', 'include', 'extend'],
  thuatNgu: tn('useCase', 'include', 'extend', 'userStory'),
  cau: [
    { en: '"Explain include versus extend with an example from your project."', vi: '"Giải thích include và extend bằng ví dụ trong dự án của bạn."', lc: [['a', '"Include is behaviour that always happens as part of the base use case — writing a prescription always sends it to the national system. Extend is optional or conditional — only patients with three no-shows prepay when they book."'], ['b', '"Include is optional and extend is mandatory."'], ['c', '"They are the same; it is a drawing preference."'], ['d', '"Include links actors; extend links systems."']], dap: 'a', giai: ['Always vs. sometimes, with a concrete example.', 'Luôn luôn vs. đôi khi, kèm ví dụ cụ thể.'] },
    { en: '"Use cases or user stories — which do you prefer?"', vi: '"Use case hay user story — bạn chọn cái nào?"', lc: [['a', '"It depends on the project: stories suit an agile team with a product owner nearby; use cases give more structure for complex flows and exceptions. I often start with use cases to understand the flow and split them into stories for the backlog."'], ['b', '"Always use cases — stories are not real requirements."'], ['c', '"Always stories — use cases are obsolete."'], ['d', '"Neither, I write code directly."']], dap: 'a', giai: ['Context-dependent answer with a reason.', 'Trả lời theo ngữ cảnh, có lý do.'] },
    { en: '"Is the database an actor?"', vi: '"Cơ sở dữ liệu có phải actor không?"', lc: [['a', '"No — the database is inside the system boundary. Actors are people or external systems that interact with the system, like the VNPay gateway."'], ['b', '"Yes, it stores the data."'], ['c', '"Only in large systems."'], ['d', '"Yes, if it is on another server."']], dap: 'a', giai: ['Actors are outside the boundary.', 'Actor nằm ngoài biên hệ thống.'] },
    { en: '"How do you find exceptions in a use case?"', vi: '"Bạn tìm ngoại lệ của một use case thế nào?"', lc: [['a', '"I walk each step of the normal flow and ask what can go wrong — invalid input, rule violations, an external system failing, a race such as a slot taken meanwhile — then decide how the system responds."'], ['b', '"I wait for testers to find them."'], ['c', '"There are no exceptions in a good design."'], ['d', '"I copy them from another project."']], dap: 'a', giai: ['Systematic step-by-step questioning.', 'Hỏi có hệ thống theo từng bước.'] },
  ],
}));

export default mod;
