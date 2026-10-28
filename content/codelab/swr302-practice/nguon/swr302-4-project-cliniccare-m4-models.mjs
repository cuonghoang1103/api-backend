/**
 * SWR302 · DỰ ÁN ClinicCare — Mốc 4 (chương 4): ERD khái niệm + sơ đồ chuyển trạng thái của Appointment + Interview corner.
 */
import { tn, CU_PHAP } from './_chung.mjs';
import { deLon } from './_lab.mjs';
import { kiemErd, kiemState } from './_kiemmh.mjs';
import { khoiThamChieu } from './_ve.mjs';
import { BOI_CANH, phongVan } from './_cliniccare.mjs';

const GIAI_ERD = `
erDiagram
  PATIENT ||--o{ APPOINTMENT : books
  DOCTOR ||--o{ TIME_SLOT : publishes
  TIME_SLOT ||--o| APPOINTMENT : "is reserved by"
  SERVICE ||--o{ APPOINTMENT : "is requested in"
  APPOINTMENT ||--o{ PAYMENT : "is paid by"
  APPOINTMENT ||--o| PRESCRIPTION : "results in"
  PRESCRIPTION ||--|{ PRESCRIPTION_ITEM : contains
  MEDICINE ||--o{ PRESCRIPTION_ITEM : "is prescribed in"
  PATIENT {
    string patientId PK
    string fullName
    string phone
    date dateOfBirth
  }
  DOCTOR {
    string doctorId PK
    string fullName
    string specialty
  }
  TIME_SLOT {
    string slotId PK
    datetime startTime
    int minutes
  }
  SERVICE {
    string serviceCode PK
    string name
    decimal fee
  }
  APPOINTMENT {
    string appointmentCode PK
    string status
    datetime bookedAt
  }
  PAYMENT {
    string paymentId PK
    decimal amount
    string kind
    datetime paidAt
  }
  PRESCRIPTION {
    string prescriptionId PK
    string nationalCode
    date issuedOn
  }
  PRESCRIPTION_ITEM {
    int lineNo PK
    string dosage
    int quantity
  }
  MEDICINE {
    string medicineId PK
    string name
    string unit
  }
`;

const GIAI_ST = `
stateDiagram-v2
  [*] --> Requested : patient confirms a slot
  Requested --> Booked : [prepayment not required]
  Requested --> AwaitingPayment : [3 no-shows in the last 90 days]
  AwaitingPayment --> Booked : payment succeeded
  AwaitingPayment --> Cancelled : payment failed or 15 minutes elapsed / release slot
  Booked --> Cancelled : patient cancels [at least 2 hours before start] / refund prepayment
  Booked --> CheckedIn : patient arrives / receptionist checks in
  Booked --> NoShow : 15 minutes after start [not checked in] / free the slot
  CheckedIn --> InConsultation : doctor starts the visit
  InConsultation --> Completed : doctor ends the visit / issue prescription
  Completed --> [*]
  Cancelled --> [*]
  NoShow --> [*]
`;
const VI_TRI_ST = { __dau: [40, 60], Requested: [130, 150], Booked: [420, 150], CheckedIn: [700, 150], AwaitingPayment: [130, 340], InConsultation: [700, 340], Cancelled: [230, 530], NoShow: [600, 530], Completed: [870, 530] };
const VI_TRI_ERD = { PATIENT: [140, 110], SERVICE: [140, 340], APPOINTMENT: [470, 230], PAYMENT: [820, 110], TIME_SLOT: [470, 470], DOCTOR: [140, 560], PRESCRIPTION: [820, 340], PRESCRIPTION_ITEM: [820, 560], MEDICINE: [470, 690] };

const P = { patient: ['patient'], doctor: ['doctor|physician'], slot: ['slot|time slot|schedule'], appt: ['appoint|booking|visit'], service: ['service'], pay: ['payment|transaction'], pres: ['^prescription$'], item: ['item|line|detail'], med: ['medicine|drug|medication'] };

const KIEM = [
  ...kiemErd({
    bien: 'ERD',
    nhom: { cuPhap: 'f1', thanhPhan: 'f2', quanHe: 'f3' },
    tt: [
      { ten: 'Patient', khop: P.patient }, { ten: 'Doctor', khop: P.doctor }, { ten: 'Time slot', khop: P.slot }, { ten: 'Appointment', khop: P.appt },
      { ten: 'Service', khop: P.service }, { ten: 'Payment', khop: P.pay }, { ten: 'Prescription', khop: P.pres }, { ten: 'Prescription item', khop: P.item }, { ten: 'Medicine', khop: P.med },
    ],
    camTt: [
      { ten: 'Status / Fee / Dosage', khop: ['^status|^fee$|^dosage|^price'], lyDo: 'that is an attribute', lyDoVi: 'đó là thuộc tính' },
      { ten: 'ClinicCare / Receptionist / National system', khop: ['cliniccare|^system$|receptionist|national'], lyDo: 'the system, a user role or an external system is not stored data here', lyDoVi: 'hệ thống, vai người dùng hay hệ thống ngoài không phải dữ liệu cần lưu ở đây' },
    ],
    qh: [
      { ten: 'Patient 1 — N Appointment', a: P.patient, b: P.appt, nhieu: 'b' },
      { ten: 'Doctor 1 — N Time slot', a: P.doctor, b: P.slot, nhieu: 'b' },
      { ten: 'Time slot 1 — 1 Appointment (a slot holds at most one appointment)', a: P.slot, b: P.appt, nhieu: 'mot', lyDo: 'a 15-minute slot is reserved by at most one appointment', lyDoVi: 'một slot 15 phút chỉ được giữ bởi tối đa một lịch hẹn' },
      { ten: 'Service 1 — N Appointment', a: P.service, b: P.appt, nhieu: 'b' },
      { ten: 'Appointment 1 — N Payment (prepayment and refund)', a: P.appt, b: P.pay, nhieu: 'b', lyDo: 'an appointment can have a prepayment and a refund', lyDoVi: 'một lịch hẹn có thể có khoản trả trước và khoản hoàn' },
      { ten: 'Appointment 1 — 0..1 Prescription', a: P.appt, b: P.pres, nhieu: 'mot' },
      { ten: 'Prescription 1 — N Prescription item', a: P.pres, b: P.item, nhieu: 'b', minB: 1, lyDo: 'a prescription lists at least one medicine', lyDoVi: 'một đơn có ít nhất một thuốc' },
      { ten: 'Medicine 1 — N Prescription item', a: P.med, b: P.item, nhieu: 'b' },
    ],
    khongTrucTiep: [
      { ten: 'Patient–Doctor goes through Appointment', a: P.patient, b: P.doctor, lyDo: 'a patient meets a doctor through an appointment — no direct relationship', lyDoVi: 'bệnh nhân gặp bác sĩ qua lịch hẹn — không nối thẳng' },
      { ten: 'Prescription–Medicine goes through Prescription item', a: P.pres, b: P.med, lyDo: 'the dosage belongs to each line, so link them through PRESCRIPTION_ITEM', lyDoVi: 'liều dùng thuộc từng dòng — nối qua PRESCRIPTION_ITEM' },
    ],
  }),
  ...kiemState({
    bien: 'STATE_DIAGRAM', tenDoiTuong: 'the appointment', nhom: { cuPhap: 'f4', thanhPhan: 'f5', chuyen: 'f6' },
    toiThieu: 7, guardToiThieu: 2,
    st: [
      { ten: 'Requested', khop: ['request|draft|new|created|pending confirm'] },
      { ten: 'Awaiting payment', khop: ['await|pending pay|unpaid|wait.*pay|payment pending'] },
      { ten: 'Booked', khop: ['^booked|confirmed|scheduled'] },
      { ten: 'Checked in', khop: ['check|arriv'] },
      { ten: 'In consultation', khop: ['consult|in visit|in progress|examin|with doctor'] },
      { ten: 'Completed', khop: ['complet|done|finish|closed'] },
      { ten: 'Cancelled', khop: ['cancel'] },
      { ten: 'No-show', khop: ['no ?show|missed|absent'] },
    ],
    ch: [
      { ten: 'requested → awaiting payment when 3 no-shows in 90 days (guard)', tenVi: 'đã yêu cầu → chờ thanh toán khi có 3 no-show trong 90 ngày (guard)', tu: ['request|draft|new|created|pending confirm'], den: ['await|pending pay|unpaid|wait.*pay|payment pending'], guard: true, lyDo: 'BR-02 decides the branch — write it as a guard', lyDoVi: 'BR-02 quyết định nhánh — ghi thành guard' },
      { ten: 'awaiting payment → booked when the payment succeeds', tenVi: 'chờ thanh toán → đã đặt khi thanh toán thành công', tu: ['await|pending pay|unpaid|wait.*pay|payment pending'], den: ['^booked|confirmed|scheduled'], suKien: ['pay|paid|success'] },
      { ten: 'awaiting payment → cancelled when payment fails or times out', tenVi: 'chờ thanh toán → huỷ khi thanh toán lỗi hoặc quá hạn', tu: ['await|pending pay|unpaid|wait.*pay|payment pending'], den: ['cancel'], suKien: ['fail|declin|timeout|time out|15|elapse|expire'] },
      { ten: 'booked → cancelled only at least 2 hours before (guard)', tenVi: 'đã đặt → huỷ chỉ khi còn ít nhất 2 giờ (guard)', tu: ['^booked|confirmed|scheduled'], den: ['cancel'], guard: true, lyDo: 'BR-01: free cancellation up to 2 hours before — a guard on the cancel transition', lyDoVi: 'BR-01: huỷ miễn phí tới trước 2 giờ — guard trên chuyển huỷ' },
      { ten: 'booked → checked in when the patient arrives', tenVi: 'đã đặt → đã check-in khi bệnh nhân tới', tu: ['^booked|confirmed|scheduled'], den: ['check|arriv'] },
      { ten: 'booked → no-show 15 minutes after the start', tenVi: 'đã đặt → no-show sau giờ bắt đầu 15 phút', tu: ['^booked|confirmed|scheduled'], den: ['no ?show|missed|absent'], suKien: ['15|minute|elapse|after|timeout|late|time'] },
      { ten: 'checked in → in consultation → completed', tenVi: 'đã check-in → đang khám → hoàn tất', tu: ['consult|in visit|in progress|examin|with doctor'], den: ['complet|done|finish|closed'] },
    ],
  }),
];

const TEP = {
  'answers/a-erd.js': [
    "// A. Conceptual ERD (Mermaid erDiagram) — entities, identifiers, verb-labelled relationships, crow's-foot cardinality, NO foreign keys.\nconst ERD = ´\nerDiagram\n  PATIENT ||--o{ APPOINTMENT : books\n  PATIENT {\n    string patientId PK\n  }\n  APPOINTMENT {\n    string appointmentCode PK\n  }\n´;\n",
    `// A. Nine entities; APPOINTMENT links patient, slot and service; PRESCRIPTION_ITEM carries the dosage.\nconst ERD = ´${GIAI_ERD.replace(/\s+$/, '')}\n´;\n`,
  ],
  'answers/b-state.js': [
    "// B. State diagram of an Appointment (Mermaid stateDiagram-v2): event [guard] / action.\nconst STATE_DIAGRAM = ´\nstateDiagram-v2\n  [*] --> Requested : patient confirms a slot\n´;\n",
    `// B. Eight states; BR-01 and BR-02 become guards; time events for the no-show and the payment timeout.\nconst STATE_DIAGRAM = ´${GIAI_ST.replace(/\s+$/, '')}\n´;\n`,
  ],
};

const mod = deLon({
  slug: 'swr302-4-project-cliniccare-m4-models',
  ten: 'ClinicCare project — Milestone 4: Data and behaviour models',
  moTaModule: 'Dự án ClinicCare, mốc 4 (chương 4): ERD khái niệm 9 thực thể (slot 1–1 lịch hẹn, dòng đơn thuốc mang liều dùng, không khoá ngoại) và sơ đồ chuyển trạng thái của lịch hẹn với guard từ BR-01/BR-02 và sự kiện thời gian — chấm bằng máy đọc Mermaid; kèm Góc phỏng vấn.',
  baiHoc: 'swr302-4-10-ch13-data-models',
  dangBai: 'project',
  tieuDe: 'ClinicCare project — Milestone 4: Conceptual ERD and appointment state diagram',
  phu: { en: 'Running project · milestone 4 of 7 · data and behaviour · 10 marks', vi: 'Dự án xuyên suốt · mốc 4/7 · dữ liệu và hành vi · 10 điểm' },
  moTa: {
    en: `${BOI_CANH.en}<p>Extra facts gathered in Milestone 2: each appointment is for one <b>service</b> (general check-up, vaccination…, each with a fee); a slot is reserved by at most one appointment; an appointment may have a prepayment and later a refund; a prescription lists one or more medicines, each with its own dosage and quantity; the national system returns a code for each prescription.</p>
<p><b>A.</b> Draw the <b>conceptual ERD</b> of ClinicCare (no foreign keys).</p>
<p><b>B.</b> Draw the <b>state diagram of an Appointment</b> from the moment the patient confirms a slot until it is completed, cancelled or missed. Show BR-01 and BR-02 as guards, the 15-minute payment timeout and the no-show 15 minutes after the start as time events, and the actions the system performs.</p>${CU_PHAP.erd.en}${CU_PHAP.state.en}`,
    vi: `${BOI_CANH.vi}<p>Thông tin thêm từ mốc 2: mỗi lịch hẹn cho một <b>dịch vụ</b> (có phí); một slot được giữ bởi tối đa một lịch hẹn; một lịch hẹn có thể có khoản trả trước và về sau khoản hoàn; đơn thuốc có một hay nhiều thuốc, mỗi thuốc có liều và số lượng riêng; hệ thống quốc gia trả mã cho mỗi đơn.</p><p><b>A.</b> Vẽ <b>ERD khái niệm</b> (không khoá ngoại). <b>B.</b> Vẽ <b>sơ đồ trạng thái của Appointment</b> từ lúc bệnh nhân xác nhận slot tới khi hoàn tất, bị huỷ hoặc bỏ lỡ; BR-01, BR-02 thành guard; hết hạn thanh toán 15 phút và no-show sau 15 phút là sự kiện thời gian; ghi hành động của hệ thống.</p>${CU_PHAP.erd.vi}${CU_PHAP.state.vi}`,
  },
  chucNangChinh: [{ en: 'A. Conceptual ERD.', vi: 'A. ERD khái niệm.' }, { en: 'B. Appointment state diagram.', vi: 'B. Sơ đồ trạng thái lịch hẹn.' }],
  yeuCauChung: [{ en: 'Mermaid subsets shown above; entity names in UPPER_CASE, states in CamelCase.', vi: 'Tập con Mermaid ở trên; tên thực thể IN_HOA, trạng thái CamelCase.' }],
  cayThuMuc: `answers/
├── a-erd.js     ← const ERD = \`erDiagram …\`
└── b-state.js   ← const STATE_DIAGRAM = \`stateDiagram-v2 …\``,
  moHinh: { ten: 'Answer records', truong: [['ERD', 'Mermaid erDiagram string', { en: 'PK only, no FK', vi: 'chỉ PK, không FK' }], ['STATE_DIAGRAM', 'Mermaid stateDiagram-v2 string', { en: 'event [guard] / action', vi: 'sự kiện [guard] / hành động' }]] },
  chucNang: [
    { ten: { en: 'A1. ERD notation', vi: 'A1. Ký hiệu ERD' }, diem: 1, yeuCau: [{ en: 'Identifiers, verb labels, no FK.', vi: 'Định danh, nhãn động từ, không FK.' }], hook: ['conceptual ERD'] },
    { ten: { en: 'A2. Entities', vi: 'A2. Thực thể' }, diem: 1.5, yeuCau: [{ en: 'Nine entities, no attributes as entities.', vi: 'Chín thực thể, không biến thuộc tính thành thực thể.' }], hook: ['entities'] },
    { ten: { en: 'A3. Relationships', vi: 'A3. Quan hệ' }, diem: 2.5, yeuCau: [{ en: 'Cardinality on the right side; associative entities.', vi: 'Bản số đúng phía; thực thể kết hợp.' }], hook: ['cardinality'] },
    { ten: { en: 'B1. State diagram notation', vi: 'B1. Ký hiệu sơ đồ trạng thái' }, diem: 1, yeuCau: [{ en: 'One initial, final states, labelled transitions.', vi: 'Một trạng thái đầu, có trạng thái cuối, chuyển có nhãn.' }], hook: ['state diagram'] },
    { ten: { en: 'B2. States', vi: 'B2. Trạng thái' }, diem: 1.5, yeuCau: [{ en: 'Eight business states.', vi: 'Tám trạng thái nghiệp vụ.' }], hook: ['states'] },
    { ten: { en: 'B3. Transitions', vi: 'B3. Chuyển trạng thái' }, diem: 2.5, yeuCau: [{ en: 'Guards from the rules, time events.', vi: 'Guard từ luật, sự kiện thời gian.' }], hook: ['guard conditions'] },
  ],
  idBatBuoc: [['ERD', 'answers/a-erd.js'], ['STATE_DIAGRAM', 'answers/b-state.js']],
  truDiem: [
    { en: 'Linking PATIENT directly to DOCTOR: they meet through an appointment.', vi: 'Nối thẳng PATIENT với DOCTOR: họ gặp nhau qua lịch hẹn.' },
    { en: 'Putting the dosage on MEDICINE — it differs for every prescription line.', vi: 'Đặt liều dùng ở MEDICINE — mỗi dòng đơn một liều khác.' },
    { en: 'A cancel transition without the 2-hour guard: BR-01 would not be enforced.', vi: 'Chuyển huỷ thiếu guard 2 giờ: BR-01 không được thực thi.' },
  ],
  goiY: [
    'A: "một slot giữ tối đa một lịch hẹn" ⇒ TIME_SLOT ||--o| APPOINTMENT; "đơn có một hay nhiều thuốc, mỗi thuốc liều riêng" ⇒ thực thể PRESCRIPTION_ITEM.',
    'B: BR-02 rẽ nhánh từ Requested sang AwaitingPayment bằng guard; "15 phút sau giờ bắt đầu mà chưa check-in" là sự kiện thời gian + guard.',
  ],
  loiHayGap: ['Ghi slotId FK trong APPOINTMENT.', 'Thiếu trạng thái AwaitingPayment.', 'Coi "check in" là trạng thái đích của chuyển huỷ.'],
  giaiThich: {
    en: `<p>Reference ERD:</p>${khoiThamChieu('erd', GIAI_ERD, 'Conceptual ERD — ClinicCare', VI_TRI_ERD)}<p>Reference state diagram of an appointment:</p>${khoiThamChieu('state', GIAI_ST, 'Appointment — state diagram', VI_TRI_ST)}<p>The models must agree with Milestone 3: every state change corresponds to a step of a use case (book, prepay, cancel, check in, mark no-show, record the visit), and every entity is created, read, updated or deleted by some use case.</p>`,
    vi: `<p>ERD và sơ đồ trạng thái tham chiếu ở trên (bản tiếng Anh). Các mô hình phải khớp mốc 3: mỗi thay đổi trạng thái ứng với một bước của use case (đặt, trả trước, huỷ, check-in, đánh dấu no-show, ghi lần khám), và mỗi thực thể đều được một use case nào đó tạo/đọc/sửa/xoá.</p>`,
  },
  khaiNiem: ['conceptual ERD', 'state transition diagram'],
  tienQuyet: ['Milestone 3', 'SWR302 lessons 4.6, 4.8'],
  thuatNgu: tn('erd', 'cardinality', 'associativeEntity', 'stateDiagram', 'guard'),
  moTaNgan: 'Dự án ClinicCare mốc 4: ERD khái niệm và sơ đồ trạng thái lịch hẹn.',
  phut: 75,
  tep: TEP,
  kiem: KIEM,
  boYeu: [{ ten: 'nối thẳng bệnh nhân–bác sĩ, có FK, huỷ không guard', tep: {
    'answers/a-erd.js': "const ERD = `\nerDiagram\n  PATIENT }o--o{ DOCTOR : visits\n  PATIENT ||--o{ APPOINTMENT : books\n  MEDICINE }o--o{ PRESCRIPTION : contains\n  PATIENT {\n    string patientId PK\n  }\n  DOCTOR {\n    string doctorId PK\n  }\n  APPOINTMENT {\n    string appointmentCode PK\n    string patientId FK\n  }\n  MEDICINE {\n    string medicineId PK\n    string dosage\n  }\n  PRESCRIPTION {\n    string prescriptionId PK\n  }\n`;\n",
    'answers/b-state.js': "const STATE_DIAGRAM = `\nstateDiagram-v2\n  [*] --> Booked : book\n  Booked --> Cancelled : cancel\n  Booked --> Completed : visit\n  Completed --> [*]\n  Cancelled --> [*]\n`;\n",
  } }],
});

mod.de.push(phongVan({
  moc: 'data and behaviour models',
  khaiNiem: ['ERD', 'state diagram'],
  thuatNgu: tn('erd', 'stateDiagram', 'guard'),
  cau: [
    { en: '"Why does a BA draw a conceptual ERD if developers design the database anyway?"', vi: '"Vì sao BA vẽ ERD khái niệm khi dev đằng nào cũng thiết kế CSDL?"', lc: [['a', '"To agree with the business on the information the system must keep and the rules between those things — for example that one slot can hold only one appointment. It is a requirement model, not a database design."'], ['b', '"To choose the database product."'], ['c', '"To write the SQL for the developers."'], ['d', '"It is not needed."']], dap: 'a', giai: ['Requirements level: what information and which business rules.', 'Mức yêu cầu: thông tin gì và luật nghiệp vụ nào.'] },
    { en: '"When is a state diagram worth drawing?"', vi: '"Khi nào đáng vẽ sơ đồ trạng thái?"', lc: [['a', '"When an object has a life cycle with rules about what may happen in each state — like an appointment that can be cancelled only while Booked and at least 2 hours before. It reveals missing transitions and forbidden ones."'], ['b', '"For every class in the system."'], ['c', '"Only for user interfaces."'], ['d', '"Never in requirements, only in code."']], dap: 'a', giai: ['Objects with a meaningful life cycle.', 'Đối tượng có vòng đời có ý nghĩa.'] },
    { en: '"What is a guard condition? Give an example."', vi: '"Guard condition là gì? Cho ví dụ."', lc: [['a', '"A boolean condition that must be true for the transition to fire: Booked → Cancelled only [at least 2 hours before start]."'], ['b', '"The action executed after the transition."'], ['c', '"The name of the event."'], ['d', '"A security login."']], dap: 'a', giai: ['Guard = condition in square brackets.', 'Guard = điều kiện trong ngoặc vuông.'] },
    { en: '"How do you know your ERD and your use cases are consistent?"', vi: '"Làm sao biết ERD và use case nhất quán?"', lc: [['a', '"With a CRUD matrix: every entity must be created, read, updated and deleted (or archived) by some use case; an empty row or column points to a missing use case or an unnecessary entity."'], ['b', '"If both are drawn in the same tool."'], ['c', '"If the developers say so."'], ['d', '"They do not need to be consistent."']], dap: 'a', giai: ['CRUD analysis links data and processes.', 'Phân tích CRUD nối dữ liệu và quy trình.'] },
  ],
}));

export default mod;
