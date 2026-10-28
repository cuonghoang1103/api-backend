/**
 * SWR302 · LAB 4A — Use cases: GymPass Campus Fitness Centre.
 * A. sơ đồ use case (PlantUML) · B. bảng Actor + Use case · C. đặc tả use case "Book a Class" theo template (Wiegers Ch.8) ·
 * D. phân loại 6 business rule (5 loại, Ch.9) + rút yêu cầu chức năng "The system shall…" từ đặc tả.
 */
import { CU_PHAP, tn, jsLit, kiemTuy } from './_chung.mjs';
import { deLon, kiemBang, objDong, objTrong } from './_lab.mjs';
import { kiemUseCase, kiemBangUC, kiemDacTaUC } from './_kiemmh.mjs';
import { khoiThamChieu } from './_ve.mjs';

const BOI_CANH = {
  en: `<p>The university fitness centre is replacing its paper sign-up sheets with <b>GymPass</b>. <b>Members</b> (students and staff) buy a membership plan online — monthly, semester or yearly — and pay through the campus <b>e-wallet</b>. With an active plan, a member books a seat in a group class (yoga, spinning, boxing); every class has a limited number of seats. When a class is full the member may join its waitlist; when a seat is freed, the first person on the waitlist gets it automatically. A member can cancel a booking free of charge up to 2 hours before the class starts.</p>
<p>At the entrance the member scans a personal QR code at the turnstile; the <b>turnstile controller</b> (an external device) sends the scanned code to GymPass, which answers "open" or "refuse". <b>Trainers</b> publish their class schedule for the coming week and record the attendance of each class. <b>Front-desk staff</b> sell day passes to walk-in guests (a guest never uses GymPass personally) and replace lost membership cards. The <b>manager</b> sets plan and day-pass prices and views occupancy reports. Reminders one hour before each class are sent through the university <b>notification service</b>.</p>`,
  vi: `<p>Trung tâm thể hình của trường thay tờ đăng ký giấy bằng <b>GymPass</b>. <b>Hội viên (member)</b> — sinh viên và cán bộ — mua gói hội viên trực tuyến (tháng, học kỳ, năm) và trả qua <b>ví điện tử</b> của trường. Có gói còn hạn, hội viên đặt chỗ trong lớp nhóm (yoga, đạp xe, boxing); mỗi lớp có số chỗ giới hạn. Lớp đầy thì hội viên CÓ THỂ vào danh sách chờ; khi có chỗ trống, người đầu danh sách chờ tự động được chỗ. Hội viên huỷ đặt chỗ miễn phí tới 2 giờ trước giờ học.</p>
<p>Ở cửa vào, hội viên quét mã QR cá nhân tại cổng xoay; <b>bộ điều khiển cổng (turnstile controller)</b> — thiết bị bên ngoài — gửi mã quét được tới GymPass, GymPass trả lời "mở" hoặc "từ chối". <b>Huấn luyện viên (trainer)</b> công bố lịch lớp tuần tới và điểm danh mỗi lớp. <b>Nhân viên quầy (front-desk staff)</b> bán vé ngày cho khách vãng lai (khách không tự dùng GymPass) và cấp lại thẻ hội viên bị mất. <b>Quản lý (manager)</b> đặt giá gói, giá vé ngày và xem báo cáo công suất. Nhắc lịch một giờ trước mỗi lớp được gửi qua <b>dịch vụ thông báo</b> của trường.</p>`,
};

const QUY_TAC = [
  ['BR-01', 'A member may not hold two bookings whose class times overlap.'],
  ['BR-02', 'If a member does not show up for 3 booked classes in one calendar month, the member cannot book any class for the next 7 days.'],
  ['BR-03', 'A booking can be cancelled free of charge until 2 hours before the class starts.'],
  ['BR-04', 'The price of a day pass bought for a member’s guest is 50% of the standard day-pass price.'],
  ['BR-05', 'Every group class takes place in one room, and the capacity of the class is the capacity of that room.'],
  ['BR-06', 'A member who checks in more than 15 minutes after the class has started is counted as a no-show.'],
];
const LOAI_BR = ['Fact', 'Constraint', 'Action enabler', 'Inference', 'Computation'];
const DAP_BR = { 'BR-01': 'Constraint', 'BR-02': 'Action enabler', 'BR-03': 'Constraint', 'BR-04': 'Computation', 'BR-05': 'Fact', 'BR-06': 'Inference' };

const A = {
  member: { ten: 'Member', khop: ['member|student'] },
  trainer: { ten: 'Trainer', khop: ['trainer|coach|instructor'] },
  desk: { ten: 'Front-desk Staff', khop: ['front|desk|reception|staff'] },
  manager: { ten: 'Manager', khop: ['manager|admin'] },
  wallet: { ten: 'E-wallet', khop: ['wallet|payment'] },
  gate: { ten: 'Turnstile Controller', khop: ['turnstile|gate|door|controller'] },
  noti: { ten: 'Notification Service', khop: ['notif|mail|message|sms'] },
};

const GIAI_UC = `
@startuml
left to right direction
actor Member
actor Trainer
actor "Front-desk Staff" as FD
actor Manager
actor "E-wallet" as EW
actor "Turnstile Controller" as TC
actor "Notification Service" as NS
rectangle "GymPass" {
  usecase "Buy Membership Plan" as UC1
  usecase "Make Payment" as UC2
  usecase "Book a Class" as UC3
  usecase "Join Class Waitlist" as UC4
  usecase "Cancel Booking" as UC5
  usecase "Check In at Entrance" as UC6
  usecase "Publish Class Schedule" as UC7
  usecase "Record Attendance" as UC8
  usecase "Sell Day Pass" as UC9
  usecase "Replace Lost Card" as UC10
  usecase "Set Prices" as UC11
  usecase "View Occupancy Reports" as UC12
  usecase "Send Class Reminder" as UC13
}
Member --> UC1
UC1 ..> UC2 : <<include>>
UC2 --> EW
Member --> UC3
UC4 ..> UC3 : <<extend>>
Member --> UC5
Member --> UC6
UC6 --> TC
Trainer --> UC7
Trainer --> UC8
FD --> UC9
FD --> UC10
Manager --> UC11
Manager --> UC12
UC13 --> NS
@enduml
`;
const GIAI_ACTORS = [
  ['Member', 'A student or staff member with a GymPass account who buys plans, books classes and checks in at the entrance.'],
  ['Trainer', 'A fitness trainer who publishes the weekly class schedule and records the attendance of each class.'],
  ['Front-desk Staff', 'Staff at the reception desk who sell day passes to walk-in guests and replace lost cards.'],
  ['Manager', 'The fitness centre manager who sets plan and day-pass prices and reads occupancy reports.'],
  ['E-wallet', 'External campus payment service that executes plan payments and returns the payment result.'],
  ['Turnstile Controller', 'External device at the entrance that sends scanned QR codes and opens the turnstile on GymPass approval.'],
  ['Notification Service', 'External university service that delivers the class reminders sent by GymPass.'],
].map(([name, description]) => ({ name, description }));
const GIAI_UCS = [
  ['UC-01', 'Buy Membership Plan', ['Member'], 'The member chooses a monthly, semester or yearly plan and buys it online.'],
  ['UC-02', 'Make Payment', ['E-wallet'], 'Included in buying a plan: the amount is charged through the e-wallet and the result recorded.'],
  ['UC-03', 'Book a Class', ['Member'], 'A member with an active plan reserves a seat in a scheduled group class.'],
  ['UC-04', 'Join Class Waitlist', [], 'Optional extension of booking: when the class is full the member joins its waitlist.'],
  ['UC-05', 'Cancel Booking', ['Member'], 'The member cancels a booking free of charge until two hours before the class.'],
  ['UC-06', 'Check In at Entrance', ['Member', 'Turnstile Controller'], 'The member scans a QR code at the turnstile and GymPass answers open or refuse.'],
  ['UC-07', 'Publish Class Schedule', ['Trainer'], 'The trainer publishes the classes of the coming week with room, time and capacity.'],
  ['UC-08', 'Record Attendance', ['Trainer'], 'The trainer marks which booked members attended a class and which did not show up.'],
  ['UC-09', 'Sell Day Pass', ['Front-desk Staff'], 'Front-desk staff sell a one-day pass to a walk-in guest at the reception desk.'],
  ['UC-10', 'Replace Lost Card', ['Front-desk Staff'], 'Front-desk staff block a lost membership card and issue a new card to the member.'],
  ['UC-11', 'Set Prices', ['Manager'], 'The manager sets the prices of membership plans and of the day pass.'],
  ['UC-12', 'View Occupancy Reports', ['Manager'], 'The manager reads how full classes and the gym floor were per day and per week.'],
  ['UC-13', 'Send Class Reminder', ['Notification Service'], 'One hour before a class, every booked member is reminded through the notification service.'],
].map(([id, name, actors, description]) => ({ id, name, actors, description }));

const GIAI_SPEC = {
  id: 'UC-03',
  name: 'Book a Class',
  primaryActor: 'Member',
  secondaryActors: ['Notification Service'],
  description: 'A member with an active membership plan reserves a seat in a scheduled group class, or joins its waitlist when the class is full.',
  trigger: 'The member chooses Book on a class of the weekly schedule.',
  preconditions: ['PRE-1. The member is signed in to GymPass.', 'PRE-2. The member has an active membership plan.'],
  postconditions: ['POST-1. A booking with status Confirmed exists for the member and the class has one free seat less.', 'POST-2. A booking confirmation has been sent to the member.'],
  normalFlow: [
    '1. Member opens the class schedule and selects a date.',
    '2. System displays the classes of that date with trainer, room, time and number of free seats.',
    '3. Member selects a class and chooses Book.',
    '4. System checks that the member is not blocked, holds no overlapping booking and that a seat is free.',
    '5. System displays the booking summary and the free-cancellation deadline.',
    '6. Member confirms the booking.',
    '7. System creates the booking, decreases the free seats and sends a confirmation through the Notification Service.',
  ],
  alternativeFlows: [
    { id: 'AF1', at: 4, name: 'Class is full - join the waitlist', steps: ['4a. System reports that no seat is free and offers the waitlist.', '4b. Member chooses Join Waitlist.', '4c. System adds the member at the end of the waitlist and shows the position; the use case ends.'] },
  ],
  exceptions: [
    { id: 'E1', at: 4, condition: 'The member is blocked after 3 no-shows in the month (BR-02)', steps: ['System shows the date when the block ends; no booking is created.'] },
    { id: 'E2', at: 4, condition: 'The member already holds a booking that overlaps the class time (BR-01)', steps: ['System shows the overlapping booking; no booking is created.'] },
    { id: 'E3', at: 7, condition: 'The last seat was taken by another member before confirmation', steps: ['System informs the member and continues with AF1 from step 4a.'] },
  ],
  priority: 'High',
  frequency: 'About 400 bookings per day in peak weeks',
  businessRules: ['BR-01', 'BR-02', 'BR-03', 'BR-05'],
  assumptions: ['Class schedules for the week are published by Sunday evening.'],
};

const GIAI_FRS = [
  'The system shall display, for a selected date, every class with its trainer, room, start time and number of free seats.',
  'The system shall refuse a booking from a member who is blocked because of 3 no-shows in the calendar month and shall show the date when the block ends.',
  'The system shall refuse a booking whose class time overlaps another booking of the same member.',
  'The system shall create a confirmed booking and decrease the free seats of the class by one when a member confirms a booking.',
  'The system shall offer to place the member on the waitlist of a class that has no free seat.',
  'The system shall give a freed seat to the first member on the waitlist of that class.',
  'The system shall allow a member to cancel a booking free of charge until 2 hours before the class starts.',
  'The system shall send a booking confirmation to the member through the Notification Service.',
];

const kiemFR = [
  kiemTuy({ en: 'D2 — at least 6 functional requirements, each "The system shall …", one requirement per statement', vi: 'D2 — ít nhất 6 yêu cầu chức năng, mỗi câu "The system shall …", mỗi câu một yêu cầu' }, function () {
    if (typeof FRS === 'undefined' || !Array.isArray(FRS)) return 'FRS is missing';
    if (FRS.length < 6) return 'only ' + FRS.length + ' requirements — derive at least 6 from the specification';
    for (var i = 0; i < FRS.length; i++) {
      var r = String(FRS[i]).trim();
      if (!/^the system shall\b/i.test(r)) return 'FRS[' + i + '] must start with "The system shall" (system perspective)';
      if ((r.match(/\bshall\b/gi) || []).length > 2) return 'FRS[' + i + '] packs several requirements — split it';
      if (/\b(and\/or|etc|user[- ]friendly|fast|quickly|easy|easily|efficient|flexible|as appropriate|several|some)\b/i.test(r)) return 'FRS[' + i + '] uses an ambiguous word (fast, easy, and/or, etc., several…) — VI: dùng từ mơ hồ';
      if (r.split(/\s+/).length < 8) return 'FRS[' + i + '] is too short to be verifiable';
    }
    return 'OK';
  }, { nhom: 'f10' }),
  kiemTuy({ en: 'D2 — the requirements cover the rules of the specification (block after no-shows, overlap, waitlist)', vi: 'D2 — các yêu cầu phủ luật của đặc tả (khoá sau vắng mặt, trùng giờ, danh sách chờ)' }, function () {
    if (typeof FRS === 'undefined' || !Array.isArray(FRS)) return 'FRS is missing';
    var t = FRS.join(' | ').toLowerCase();
    if (!/block|no-show|no show/.test(t)) return 'no requirement for the block after 3 no-shows (BR-02)';
    if (!/overlap|same time|conflict|clash/.test(t)) return 'no requirement for overlapping bookings (BR-01)';
    if (!/waitlist|wait list|waiting list/.test(t)) return 'no requirement for the waitlist';
    return 'OK';
  }, { nhom: 'f10' }),
  kiemTuy({ en: 'D2 — the free-cancellation rule is stated with its exact limit', vi: 'D2 — luật huỷ miễn phí có ghi đúng mốc' }, function () {
    if (typeof FRS === 'undefined' || !Array.isArray(FRS)) return 'FRS is missing';
    var t = FRS.join(' | ').toLowerCase();
    return /cancel/.test(t) && /2 hours|two hours|120 minutes/.test(t) ? 'OK' : 'state the cancellation rule with its limit (2 hours before the class)';
  }, { nhom: 'f10', an: true }),
];

const KIEM = [
  ...kiemUseCase({
    bien: 'USE_CASE_DIAGRAM',
    nhom: { cuPhap: 'f1', actor: 'f2', ucs: 'f3', quanHe: 'f3' },
    actors: Object.values(A),
    camActor: [
      { ten: 'Guest', khop: ['guest|visitor|walk in'], lyDo: 'the guest never uses GymPass — the Front-desk Staff sells the pass', lyDoVi: 'khách không tự dùng GymPass — nhân viên quầy bán vé' },
      { ten: 'QR code / Waitlist / Scheduler', khop: ['^qr|waitlist|scheduler|timer|database'], lyDo: 'that is data or a function inside the system', lyDoVi: 'đó là dữ liệu hoặc chức năng bên trong hệ thống' },
    ],
    ucs: [
      { ten: 'Buy a membership plan', khop: ['membership|plan|subscribe'], actor: [A.member] },
      { ten: 'Pay through the e-wallet', khop: ['pay'], actor: [A.wallet] },
      { ten: 'Book a class', khop: ['book'], actor: [A.member] },
      { ten: 'Cancel a booking', khop: ['cancel'], actor: [A.member] },
      { ten: 'Check in at the turnstile', khop: ['check ?in|enter|scan|access'], actor: [A.member, A.gate] },
      { ten: 'Publish the class schedule', khop: ['schedule|publish'], actor: [A.trainer] },
      { ten: 'Record attendance', khop: ['attendance|mark attend|take attend'], actor: [A.trainer] },
      { ten: 'Sell a day pass to a walk-in guest', khop: ['day pass|guest|walk in'], actor: [A.desk] },
      { ten: 'Replace a lost card', khop: ['card|replace'], actor: [A.desk] },
      { ten: 'Set prices', khop: ['price|pricing'], actor: [A.manager] },
      { ten: 'View occupancy reports', khop: ['report|occupancy|statistic'], actor: [A.manager] },
      { ten: 'Send class reminders', khop: ['remind|notif'], actor: [A.noti] },
    ],
    quanHe: [
      { loai: 'extend', ten: 'Join Class Waitlist «extend» Book a Class', tu: ['waitlist|wait list|waiting list'], den: ['^book|book a class|book class'], lyDo: 'the member MAY join the waitlist, only when the class is full', lyDoVi: 'hội viên CÓ THỂ vào danh sách chờ, chỉ khi lớp đầy' },
      { loai: 'include', ten: 'Buy Membership Plan «include» Make Payment', tu: ['membership|plan|subscribe'], den: ['pay'], lyDo: 'every plan purchase is paid — it always happens', lyDoVi: 'mua gói nào cũng phải trả tiền — luôn xảy ra' },
    ],
    toiThieuUC: 11,
  }),
  ...kiemBangUC({ bien: 'USE_CASE_DIAGRAM', nhom: { bang: 'f4' } }),
  ...kiemDacTaUC({
    bien: 'UC_SPEC', bienBR: 'BUSINESS_RULES',
    nhom: { cauTruc: 'f5', dieuKien: 'f6', luong: 'f7', ngoaiLe: 'f8' },
    actorChinh: A.member,
    tienDK: [{ ten: 'the member is signed in', khop: ['sign|log'] }, { ten: 'the member has an active (valid) plan', khop: ['active|valid|plan|membership'] }],
    hauDK: [{ ten: 'a confirmed booking exists', khop: ['booking|booked|reserved'] }, { ten: 'the class has one free seat less', khop: ['seat'] }],
    luongChinh: {
      toiThieu: 6,
      su: [
        { ten: 'view the classes / schedule', khop: ['schedule|classes|list'] },
        { ten: 'select a class', khop: ['select|choose|pick'] },
        { ten: 'check eligibility and free seats', khop: ['check|verif|validat'] },
        { ten: 'member confirms', khop: ['confirm'] },
        { ten: 'system creates the booking', khop: ['creat|record|save|store'] },
      ],
    },
    thayThe: [{ ten: 'class full ⇒ waitlist', khop: ['waitlist|wait list|waiting list'] }],
    ngoaiLe: [{ ten: 'member blocked after 3 no-shows', khop: ['block|no show|no-show'] }, { ten: 'overlapping booking', khop: ['overlap|same time|conflict|clash'] }],
  }),
  ...kiemBang('BR_TYPES', DAP_BR, { nhom: 'f9', an: ['BR-06'], ten: (k) => `D1 — type of ${k}`, tenVi: (k) => `D1 — loại của ${k}`, goiY: { 'BR-02': 'it makes the system DO something when a condition holds', 'BR-06': 'it derives new knowledge (a no-show) from existing facts', 'BR-04': 'it is a formula' } }),
  ...kiemFR,
];

const TEP = {
  'data/business-rules.js': [
    `// Given — the business rules catalogue of GymPass (read only).\nconst BUSINESS_RULES = ${jsLit(QUY_TAC.map(([id, statement]) => ({ id, statement })))};\n`,
    `// Given — the business rules catalogue of GymPass (read only).\nconst BUSINESS_RULES = ${jsLit(QUY_TAC.map(([id, statement]) => ({ id, statement })))};\n`,
  ],
  'answers/a-use-case-diagram.js': [
    `// A. Use case diagram of GymPass (PlantUML).\nconst USE_CASE_DIAGRAM = ´\n@startuml\nleft to right direction\nactor Member\nrectangle "GymPass" {\n  usecase "Book a Class" as UC1\n}\nMember --> UC1\n@enduml\n´;\n`,
    `// A. Use case diagram — 7 actors, 13 use cases; «include» = always, «extend» = optional/conditional.\nconst USE_CASE_DIAGRAM = ´${GIAI_UC.replace(/\s+$/, '')}\n´;\n`,
  ],
  'answers/b-tables.js': [
    `// B. Actor table and use case table (names exactly as in the diagram).\nconst ACTORS = [\n  { name: 'Member', description: '' },\n];\nconst USE_CASES = [\n  { id: 'UC-01', name: 'Book a Class', actors: ['Member'], description: '' },\n];\n`,
    `// B. Actor table and use case table.\nconst ACTORS = ${jsLit(GIAI_ACTORS)};\nconst USE_CASES = ${jsLit(GIAI_UCS)};\n`,
  ],
  'answers/c-uc-spec.js': [
    `// C. Use case specification of "Book a Class" — every field of the template.
const UC_SPEC = {
  id: 'UC-03',
  name: 'Book a Class',
  primaryActor: '',
  secondaryActors: [],
  description: '',
  trigger: '',
  preconditions: [],
  postconditions: [],
  normalFlow: [
    '1. Member …',
    '2. System …',
  ],
  alternativeFlows: [ /* { id: 'AF1', at: <step>, name: '…', steps: ['…'] } */ ],
  exceptions: [ /* { id: 'E1', at: <step>, condition: '…', steps: ['…'] } */ ],
  priority: '',
  frequency: '',
  businessRules: [],   // ids from data/business-rules.js
  assumptions: [],
};
`,
    `// C. "Book a Class" — numbered actor/System dialogue, one alternative flow (waitlist), three exceptions.\nconst UC_SPEC = ${jsLit(GIAI_SPEC)};\n`,
  ],
  'answers/d-rules-and-frs.js': [
    `// D1. Type of each business rule: ${LOAI_BR.join(' | ')}\n${objTrong('BR_TYPES', DAP_BR)}\n// D2. Functional requirements derived from the specification.\nconst FRS = [\n  'The system shall …',\n];\n`,
    `// D1. Wiegers' five types: Fact · Constraint · Action enabler · Inference · Computation.\n${objDong('BR_TYPES', DAP_BR, { 'BR-01': 'restricts what may happen', 'BR-02': 'IF condition THEN the system acts (blocks)', 'BR-04': 'a formula', 'BR-05': 'a statement that is simply true', 'BR-06': 'IF … THEN a new fact (no-show) is derived' })}\n// D2. One requirement per statement, system perspective, no ambiguous words, every rule of the spec covered.\nconst FRS = ${jsLit(GIAI_FRS)};\n`,
  ],
};

export default deLon({
  slug: 'swr302-4-lab-use-cases-gympass',
  ten: 'Lab 4A — Use Cases: GymPass Campus Fitness Centre',
  baiHoc: 'swr302-4-1-use-case-user-story',
  tieuDe: 'Lab 4A — Use Cases: GymPass Campus Fitness Centre',
  phu: { en: 'Chapter 4 lab · use case diagram, actor & use case tables, a full use case specification, business rules and derived functional requirements · 10 marks', vi: 'Lab chương 4 · sơ đồ use case, bảng actor & use case, một đặc tả use case đầy đủ, business rule và yêu cầu chức năng rút ra · 10 điểm' },
  moTa: {
    en: `${BOI_CANH.en}<p><b>Business rules catalogue</b> (file <code>data/business-rules.js</code>):</p><ul>${QUY_TAC.map(([i, t]) => `<li><b>${i}</b> — ${t}</li>`).join('')}</ul>`,
    vi: `${BOI_CANH.vi}<p><b>Danh mục business rule</b> (tệp <code>data/business-rules.js</code>, bản tiếng Anh ở trên): BR-01 không giữ hai lượt đặt trùng giờ · BR-02 vắng mặt 3 lớp đã đặt trong một tháng ⇒ không được đặt lớp nào trong 7 ngày · BR-03 huỷ miễn phí tới 2 giờ trước giờ học · BR-04 vé ngày mua cho khách của hội viên = 50% giá vé ngày chuẩn · BR-05 mỗi lớp diễn ra ở một phòng, sĩ số lớp = sức chứa phòng · BR-06 điểm danh trễ quá 15 phút sau giờ bắt đầu bị tính là vắng mặt.</p>`,
  },
  chucNangChinh: [
    { en: 'A. Draw the use case diagram of GymPass.', vi: 'A. Vẽ sơ đồ use case của GymPass.' },
    { en: 'B. Fill the actor table and the use case table.', vi: 'B. Điền bảng actor và bảng use case.' },
    { en: 'C. Write the full specification of the use case <b>Book a Class</b> in the template of Wiegers Ch.8.', vi: 'C. Viết đặc tả đầy đủ của use case <b>Book a Class</b> theo template Wiegers Ch.8.' },
    { en: 'D. Classify the six business rules and derive the functional requirements of Book a Class.', vi: 'D. Phân loại sáu business rule và rút các yêu cầu chức năng của Book a Class.' },
  ],
  yeuCauChung: [
    { en: 'Use the role names of the case. A guest is not an actor: someone else operates the system for them.', vi: 'Dùng tên vai trò trong đề. Khách không phải actor: người khác thao tác hệ thống thay họ.' },
    { en: 'In the specification, number every normal-flow step and alternate "Member …" / "System …" steps.', vi: 'Trong đặc tả, đánh số mọi bước luồng chính và xen kẽ bước "Member …" / "System …".' },
  ],
  cayThuMuc: `data/
└── business-rules.js      ← given: const BUSINESS_RULES = [ { id, statement } ]
answers/
├── a-use-case-diagram.js  ← const USE_CASE_DIAGRAM = ´@startuml …´
├── b-tables.js            ← const ACTORS = [ … ]; const USE_CASES = [ … ]
├── c-uc-spec.js           ← const UC_SPEC = { id, name, primaryActor, …, normalFlow, alternativeFlows, exceptions, … }
└── d-rules-and-frs.js     ← const BR_TYPES = { 'BR-01': '…' }; const FRS = [ 'The system shall …' ]`,
  moHinh: {
    ten: 'Answer records',
    truong: [
      ['USE_CASE_DIAGRAM', 'string', CU_PHAP.usecase],
      ['ACTORS[i] · USE_CASES[i]', 'object', { en: '{ name, description } · { id: "UC-01", name, actors: [], description }', vi: '{ name, description } · { id: "UC-01", name, actors: [], description }' }],
      ['UC_SPEC', 'object', { en: 'id, name, primaryActor, secondaryActors[], description, trigger, preconditions[], postconditions[], normalFlow[] ("1. Member …"), alternativeFlows[{ id, at, name, steps[] }], exceptions[{ id, at, condition, steps[] }], priority, frequency, businessRules[], assumptions[] — "at" = the normal-flow step where it branches', vi: 'các trường của template; "at" = số bước luồng chính nơi rẽ nhánh' }],
      ['BR_TYPES', '{ "BR-01": type }', { en: LOAI_BR.join(' · '), vi: LOAI_BR.join(' · ') }],
      ['FRS', 'string[]', { en: '"The system shall …" — one verifiable requirement per string', vi: '"The system shall …" — mỗi chuỗi một yêu cầu kiểm chứng được' }],
    ],
  },
  chucNang: [
    { ten: { en: 'A1. Diagram notation', vi: 'A1. Ký pháp sơ đồ' }, diem: 1, moTa: CU_PHAP.usecase, yeuCau: [{ en: 'One boundary, actors outside, legal links, verb-object names, every actor and use case connected.', vi: 'Một biên, actor ở ngoài, liên kết hợp lệ, tên động từ + tân ngữ, actor/use case nào cũng được nối.' }], hook: ['use case diagram'] },
    { ten: { en: 'A2. Actors', vi: 'A2. Actor' }, diem: 0.5, yeuCau: [{ en: 'Every role and external system that interacts directly with GymPass.', vi: 'Mọi vai trò và hệ thống ngoài tương tác TRỰC TIẾP với GymPass.' }], hook: ['primary / secondary actor'] },
    { ten: { en: 'A3. Use cases and relationships', vi: 'A3. Use case và quan hệ' }, diem: 1.5, yeuCau: [{ en: 'A use case for every goal in the case, linked to the right actor; «include» for what always happens, «extend» for what is optional.', vi: 'Mỗi mục tiêu trong đề một use case, nối đúng actor; «include» cho điều luôn xảy ra, «extend» cho điều tuỳ chọn.' }], hook: ['«include»', '«extend»'] },
    { ten: { en: 'B. Actor and use case tables', vi: 'B. Bảng actor và use case' }, diem: 1, yeuCau: [{ en: 'One row per element, names identical to the diagram, Actors column consistent with the associations.', vi: 'Mỗi phần tử một dòng, tên giống sơ đồ, cột Actors nhất quán với liên kết.' }], hook: ['traceability'] },
    { ten: { en: 'C1. Template complete', vi: 'C1. Đủ template' }, diem: 1, yeuCau: [{ en: 'Every field filled, no placeholders.', vi: 'Điền đủ mọi trường, không chữ mẫu.' }], hook: ['use case template'] },
    { ten: { en: 'C2. Actors, trigger, pre- and postconditions', vi: 'C2. Actor, trigger, tiền và hậu điều kiện' }, diem: 1, yeuCau: [{ en: 'Preconditions that must hold before; postconditions that hold after success.', vi: 'Tiền điều kiện đúng trước khi bắt đầu; hậu điều kiện đúng sau khi thành công.' }], hook: ['precondition', 'postcondition'] },
    { ten: { en: 'C3. Normal flow', vi: 'C3. Luồng chính' }, diem: 1, yeuCau: [{ en: 'A numbered dialogue Member ↔ System in the order of the case, cites the business rules it enforces.', vi: 'Đối thoại Member ↔ System đánh số theo thứ tự đề, trích business rule áp dụng.' }], hook: ['normal flow'] },
    { ten: { en: 'C4. Alternative flows and exceptions', vi: 'C4. Luồng thay thế và ngoại lệ' }, diem: 1, yeuCau: [{ en: 'The waitlist branch; the blocked member and the overlapping booking — each attached to the step where it branches.', vi: 'Nhánh danh sách chờ; hội viên bị khoá và lượt đặt trùng giờ — mỗi cái gắn với bước nơi rẽ nhánh.' }], hook: ['alternative flow', 'exception'] },
    { ten: { en: 'D1. Business rule types', vi: 'D1. Loại business rule' }, diem: 1, yeuCau: [{ en: 'Fact, constraint, action enabler, inference or computation for each rule.', vi: 'Fact, constraint, action enabler, inference hay computation cho từng rule.' }], hook: ['business rules taxonomy'] },
    { ten: { en: 'D2. Derived functional requirements', vi: 'D2. Yêu cầu chức năng rút ra' }, diem: 1, yeuCau: [{ en: '"The system shall …", one per statement, verifiable, covering the rules of the use case.', vi: '"The system shall …", mỗi câu một yêu cầu, kiểm chứng được, phủ các luật của use case.' }], hook: ['functional requirement'] },
  ],
  idBatBuoc: [['USE_CASE_DIAGRAM', 'answers/a-use-case-diagram.js'], ['ACTORS · USE_CASES', 'answers/b-tables.js'], ['UC_SPEC', 'answers/c-uc-spec.js'], ['BR_TYPES · FRS', 'answers/d-rules-and-frs.js']],
  truDiem: [
    { en: 'A "Guest" actor: the guest never touches GymPass.', vi: 'Actor "Guest": khách không bao giờ dùng GymPass.' },
    { en: 'Join Waitlist as «include» of Book a Class — it only happens when the class is full.', vi: 'Join Waitlist là «include» của Book a Class — nó chỉ xảy ra khi lớp đầy.' },
    { en: 'A normal flow made only of System steps, or with UI details ("click the blue button").', vi: 'Luồng chính chỉ có bước System, hoặc đầy chi tiết giao diện ("bấm nút xanh").' },
    { en: 'Exceptions not attached to a step ("at"), or a precondition repeated as an exception.', vi: 'Ngoại lệ không gắn với bước nào ("at"), hoặc lặp tiền điều kiện thành ngoại lệ.' },
    { en: 'BR-02 classified as a constraint: it makes the system act (block) when a condition holds — an action enabler.', vi: 'Xếp BR-02 là constraint: nó khiến hệ thống hành động (khoá) khi điều kiện đúng — action enabler.' },
  ],
  goiY: [
    'A: gạch chân mọi vai trò tương tác TRỰC TIẾP với GymPass (7: Member, Trainer, Front-desk Staff, Manager, E-wallet, Turnstile Controller, Notification Service). Khách vãng lai không phải actor.',
    'C: luồng chính kết thúc ở thành công; mọi "khi lớp đầy / bị khoá / trùng giờ" là nhánh rẽ ở bước kiểm tra — ghi "at" = số bước đó.',
    'D1: Fact = điều luôn đúng; Constraint = hạn chế điều được phép; Action enabler = NẾU … THÌ hệ thống làm gì; Inference = NẾU … THÌ suy ra một sự thật mới; Computation = công thức.',
  ],
  loiHayGap: [
    'Vẽ Turnstile Controller thành use case "Open Turnstile" thay vì actor — nó là thiết bị bên ngoài trao đổi dữ liệu với hệ thống.',
    'Viết luồng chính như kịch bản giao diện ("Member clicks button Book, popup appears…").',
    'Postcondition chỉ ghi "success" — phải nói trạng thái thật: lượt đặt Confirmed, lớp giảm một chỗ.',
    'Yêu cầu chức năng ghép nhiều ý bằng "and" hoặc dùng từ mơ hồ ("quickly", "user-friendly").',
  ],
  giaiThich: {
    en: `<p><b>Why this answer.</b> Seven parties interact directly with GymPass; the walk-in guest does not (the front-desk staff operates the system for them), so the guest is not an actor. Buying a plan always involves a payment ⇒ «include»; joining the waitlist only happens when the class is full ⇒ «extend» (arrow from Join Class Waitlist to Book a Class). In the specification the normal flow is the success path; full class, block and overlap are branches at step 4, where the system checks. BR-02 makes the system act ⇒ action enabler; BR-06 derives a new fact (no-show) ⇒ inference; BR-04 is a formula ⇒ computation.</p>${khoiThamChieu('uc', GIAI_UC, 'Use case diagram — GymPass')}`,
    vi: `<p><b>Vì sao đáp án như vậy.</b> Bảy bên tương tác trực tiếp với GymPass; khách vãng lai thì không (nhân viên quầy thao tác thay) nên khách không phải actor. Mua gói luôn kèm thanh toán ⇒ «include»; vào danh sách chờ chỉ xảy ra khi lớp đầy ⇒ «extend» (mũi tên từ Join Class Waitlist tới Book a Class). Trong đặc tả, luồng chính là đường thành công; lớp đầy, bị khoá, trùng giờ là nhánh rẽ ở bước 4 — nơi hệ thống kiểm tra. BR-02 khiến hệ thống hành động ⇒ action enabler; BR-06 suy ra một sự thật mới (vắng mặt) ⇒ inference; BR-04 là công thức ⇒ computation.</p>${khoiThamChieu('uc', GIAI_UC, 'Use case diagram — GymPass')}`,
  },
  khaiNiem: ['use case diagram', 'use case specification', 'actor', '«include»', '«extend»', 'business rules taxonomy', 'functional requirement'],
  tienQuyet: ['SWR302 lessons 4.1, 4.4–4.6 (use cases)', 'Business rules (book Ch.9)'],
  thuatNgu: [...tn('useCase', 'actor', 'primaryActor', 'include', 'extend', 'systemBoundary', 'normalFlow', 'altFlow', 'exception', 'precondition', 'trigger', 'businessRule', 'functionalReq')],
  moTaNgan: 'Lab chương 4A: use case GymPass — sơ đồ, hai bảng, đặc tả Book a Class, business rule, FR.',
  phut: 75,
  tep: TEP,
  kiem: KIEM,
  boYeu: [
    { ten: 'đặc tả hời hợt: thiếu ngoại lệ, luồng toàn System', tep: { 'answers/c-uc-spec.js': `const UC_SPEC = ${jsLit({ ...GIAI_SPEC, normalFlow: ['1. System shows classes.', '2. System books the class.', '3. System sends confirmation.', '4. System updates seats.', '5. System logs it.', '6. System ends.'], exceptions: [{ id: 'E1', at: 9, condition: 'error', steps: ['System shows error.'] }] })};\n` }, phaiTruot: ['normal flow is a numbered actor', 'alternative flows and exceptions'] },
    { ten: 'BR-02 là Constraint, FR mơ hồ', tep: { 'answers/d-rules-and-frs.js': `${objDong('BR_TYPES', { ...DAP_BR, 'BR-02': 'Constraint' })}\nconst FRS = ['The system shall be fast and user-friendly.', 'The system shall allow booking.', 'The system shall handle waitlist and/or cancellation.', 'Users can cancel.', 'The system shall block members.', 'The system shall send emails etc.'];\n` }, phaiTruot: ['type of BR-02', 'at least 6 functional requirements'] },
  ],
});
