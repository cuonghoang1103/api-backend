/**
 * SWR302 · PE luyện 3 — LabEquip University Lab Equipment Lending System (định dạng FA25/SU25: Q4 = ERD khái niệm).
 * Bẫy chính của ERD: phân biệt LOẠI thiết bị (model, catalogue) với TỪNG CHIẾC (unit có số serial), và thực thể kết hợp
 * Loan × Unit mang tình trạng lúc trả. Tình huống MỚI, dạng đề bám SWR302-PE3/PE4/PE5 (FA25, SU25).
 */
import { deThiPE } from './_pe.mjs';
import { jsLit } from './_chung.mjs';

const DU_AN = 'LabEquip Lab Equipment Lending System';

const BOI_CANH = {
  en: `<p>The Faculty of Engineering of an FPT University campus lends laboratory equipment — Arduino kits, oscilloscopes, VR headsets, DSLR cameras — to students for their projects. Today a technician writes every loan in a paper book, and nobody can tell which unit was damaged by whom. The faculty wants <b>LabEquip</b>, a lab equipment lending system.</p>
<p>Users sign in with their university account through the external <b>Campus SSO</b> service. A <b>student</b> browses the equipment catalogue — each equipment <i>model</i> has a name, a category, a description, a value and the number of units available — and submits a loan request for one or more models, for a period of up to 14 days, naming the project it is for. Requests that contain a high-value model (worth more than 5,000,000 VND) must first be approved by the student's <b>project supervisor</b> (a lecturer); other requests go straight to the lab.</p>
<p>When the student comes to the lab, the <b>lab technician</b> hands over specific physical units — each unit has its own serial number and condition — and always scans the QR code of each unit, which records which unit goes out with which loan. One loan can contain several units, and over its life a unit is lent many times. At return, the technician inspects every unit and records its condition at return. A late return or a damaged unit creates a fine; students pay fines online through the university <b>e-wallet</b> (an external payment service). A student with an unpaid fine cannot submit a new request.</p>
<p>The technician also logs maintenance for a unit (date, problem, cost) and marks a unit as retired when it can no longer be repaired. The <b>lab manager</b> manages the catalogue (categories, models, values), the technician accounts, and views reports: the most borrowed models, overdue loans and damage cost per semester. Every evening the system sends reminders for loans due the next day through the university <b>notification service</b>.</p>`,
  vi: `<p>Khoa Kỹ thuật của một cơ sở FPT University cho sinh viên mượn thiết bị phòng lab — bộ Arduino, máy hiện sóng, kính VR, máy ảnh DSLR — để làm dự án. Hiện kỹ thuật viên ghi mọi lượt mượn vào sổ giấy, và không ai biết chiếc nào bị ai làm hỏng. Khoa muốn có <b>LabEquip</b>, hệ thống cho mượn thiết bị lab.</p>
<p>Người dùng đăng nhập bằng tài khoản trường qua dịch vụ <b>Campus SSO</b> bên ngoài. <b>Sinh viên</b> xem danh mục thiết bị — mỗi <i>loại</i> (model) thiết bị có tên, nhóm, mô tả, giá trị và số chiếc đang sẵn — rồi gửi yêu cầu mượn một hoặc nhiều loại, tối đa 14 ngày, ghi rõ cho dự án nào. Yêu cầu có loại giá trị cao (trên 5.000.000 đ) phải được <b>giảng viên hướng dẫn dự án</b> duyệt trước; yêu cầu khác chuyển thẳng xuống lab.</p>
<p>Khi sinh viên tới lab, <b>kỹ thuật viên</b> giao những CHIẾC cụ thể — mỗi chiếc có số serial và tình trạng riêng — và LUÔN quét mã QR của từng chiếc để ghi chiếc nào đi theo lượt mượn nào. Một lượt mượn có thể gồm nhiều chiếc, và suốt đời mình một chiếc được mượn nhiều lần. Khi trả, kỹ thuật viên kiểm tra từng chiếc và ghi tình trạng lúc trả. Trả trễ hoặc làm hỏng sinh ra một khoản phạt; sinh viên đóng phạt trực tuyến qua <b>ví điện tử</b> của trường (dịch vụ thanh toán bên ngoài). Sinh viên còn nợ phạt thì không gửi được yêu cầu mới.</p>
<p>Kỹ thuật viên còn ghi bảo trì cho từng chiếc (ngày, lỗi, chi phí) và đánh dấu chiếc đã thanh lý khi không sửa được nữa. <b>Quản lý lab</b> quản lý danh mục (nhóm, loại, giá trị), tài khoản kỹ thuật viên, và xem báo cáo: loại được mượn nhiều nhất, lượt mượn quá hạn, chi phí hư hỏng mỗi học kỳ. Mỗi tối hệ thống gửi nhắc hạn cho các lượt mượn đến hạn ngày mai qua <b>dịch vụ thông báo</b> của trường.</p>`,
};

const A = {
  student: { ten: 'Student', khop: ['student|borrower'] },
  sup: { ten: 'Project Supervisor', khop: ['supervisor|lecturer|instructor|teacher'] },
  tech: { ten: 'Lab Technician', khop: ['technician|lab staff'] },
  manager: { ten: 'Lab Manager', khop: ['manager|admin'] },
  sso: { ten: 'Campus SSO', khop: ['sso|sign on|single sign|authentication|identity'] },
  wallet: { ten: 'E-wallet (payment service)', khop: ['wallet|payment|pay'] },
  noti: { ten: 'Notification Service', khop: ['notif|mail|message|sms'] },
};

const GIAI_CTX = `
flowchart LR
  S((LabEquip Lab Equipment Lending System))
  ST[Student]
  SV[Project Supervisor]
  LT[Lab Technician]
  LM[Lab Manager]
  SSO[Campus SSO]
  EW[E-wallet]
  NS[Notification Service]
  ST -->|loan request, fine payment request| S
  S -->|equipment catalogue, loan status, fine notice| ST
  S -->|approval request| SV
  SV -->|approval decision| S
  S -->|pick-up list, loan details| LT
  LT -->|scanned unit codes, return inspection, maintenance record| S
  LM -->|catalogue data, technician accounts| S
  S -->|usage, overdue and damage reports| LM
  S -->|sign-in request| SSO
  SSO -->|identity token| S
  S -->|fine payment request| EW
  EW -->|payment result| S
  S -->|due-date reminders| NS
  NS -->|delivery status| S
`;

const GIAI_UC = `
@startuml
left to right direction
actor Student
actor "Project Supervisor" as SV
actor "Lab Technician" as LT
actor "Lab Manager" as LM
actor "Campus SSO" as SSO
actor "E-wallet" as EW
actor "Notification Service" as NS
rectangle "LabEquip Lab Equipment Lending System" {
  usecase "Sign In" as UC1
  usecase "Browse Equipment Catalogue" as UC2
  usecase "Submit Loan Request" as UC3
  usecase "Check Unpaid Fines" as UC4
  usecase "Approve Loan Request" as UC5
  usecase "Hand Over Equipment" as UC6
  usecase "Scan Unit QR Code" as UC7
  usecase "Record Equipment Return" as UC8
  usecase "Issue Fine" as UC9
  usecase "Pay Fine" as UC10
  usecase "Log Unit Maintenance" as UC11
  usecase "Retire Unit" as UC12
  usecase "Manage Equipment Catalogue" as UC13
  usecase "Manage Technician Accounts" as UC14
  usecase "View Lending Reports" as UC15
  usecase "Send Due-Date Reminder" as UC16
}
Student --> UC1
SV --> UC1
LT --> UC1
LM --> UC1
UC1 --> SSO
Student --> UC2
Student --> UC3
UC3 ..> UC4 : <<include>>
SV --> UC5
LT --> UC6
UC6 ..> UC7 : <<include>>
LT --> UC8
UC9 ..> UC8 : <<extend>>
Student --> UC10
UC10 --> EW
LT --> UC11
LT --> UC12
LM --> UC13
LM --> UC14
LM --> UC15
UC16 --> NS
@enduml
`;

const GIAI_ACTORS = [
  ['Student', 'A student who browses the catalogue, requests equipment for a project, collects and returns units and pays fines.'],
  ['Project Supervisor', 'The lecturer supervising the project, who approves or rejects requests that contain a high-value model.'],
  ['Lab Technician', 'Lab staff who hand over and receive units, scan their QR codes, inspect returns and log maintenance.'],
  ['Lab Manager', 'Manages categories, models and values, technician accounts, and reads the lending reports.'],
  ['Campus SSO', 'External university sign-on service that authenticates users and returns their identity.'],
  ['E-wallet', 'External university payment service that executes fine payments and returns the result.'],
  ['Notification Service', 'External university service that delivers the reminders and notices sent by LabEquip.'],
].map(([name, description]) => ({ name, description }));

const GIAI_UCS = [
  ['UC-01', 'Sign In', ['Student', 'Project Supervisor', 'Lab Technician', 'Lab Manager', 'Campus SSO'], 'Any user signs in with the university account; Campus SSO authenticates the user and returns the identity.'],
  ['UC-02', 'Browse Equipment Catalogue', ['Student'], 'The student searches the models by category and sees description, value and available units.'],
  ['UC-03', 'Submit Loan Request', ['Student'], 'The student requests one or more models for up to 14 days and names the project they are for.'],
  ['UC-04', 'Check Unpaid Fines', [], 'Included in every request: a student with an unpaid fine is blocked from submitting a new request.'],
  ['UC-05', 'Approve Loan Request', ['Project Supervisor'], 'The supervisor approves or rejects a request that contains a model worth more than 5,000,000 VND.'],
  ['UC-06', 'Hand Over Equipment', ['Lab Technician'], 'The technician gives the student specific units for an approved request and records the loan.'],
  ['UC-07', 'Scan Unit QR Code', [], 'Included in every handover: scanning a unit links that serial-numbered unit to the loan.'],
  ['UC-08', 'Record Equipment Return', ['Lab Technician'], 'The technician inspects every returned unit and records its condition at return.'],
  ['UC-09', 'Issue Fine', [], 'Extension of the return: a fine is created only when the return is late or a unit is damaged.'],
  ['UC-10', 'Pay Fine', ['Student', 'E-wallet'], 'The student pays an outstanding fine online and the e-wallet returns the payment result.'],
  ['UC-11', 'Log Unit Maintenance', ['Lab Technician'], 'The technician records a maintenance job of a unit with its date, problem and cost.'],
  ['UC-12', 'Retire Unit', ['Lab Technician'], 'The technician marks a unit that can no longer be repaired as retired so it is never lent again.'],
  ['UC-13', 'Manage Equipment Catalogue', ['Lab Manager'], 'The manager maintains categories, models, descriptions and values of the equipment.'],
  ['UC-14', 'Manage Technician Accounts', ['Lab Manager'], 'The manager creates, updates and deactivates the accounts of lab technicians.'],
  ['UC-15', 'View Lending Reports', ['Lab Manager'], 'The manager reads the most borrowed models, overdue loans and damage cost per semester.'],
  ['UC-16', 'Send Due-Date Reminder', ['Notification Service'], 'Every evening the borrowers of loans due tomorrow are reminded through the notification service.'],
].map(([id, name, actors, description]) => ({ id, name, actors, description }));

const GIAI_ERD = `
erDiagram
  CATEGORY ||--o{ EQUIPMENT_MODEL : groups
  EQUIPMENT_MODEL ||--o{ EQUIPMENT_UNIT : "is realised by"
  STUDENT ||--o{ LOAN : submits
  LECTURER |o--o{ LOAN : approves
  LOAN ||--|{ LOAN_ITEM : includes
  EQUIPMENT_UNIT ||--o{ LOAN_ITEM : "is lent in"
  LOAN ||--o{ FINE : incurs
  FINE ||--o| PAYMENT : "is settled by"
  EQUIPMENT_UNIT ||--o{ MAINTENANCE_RECORD : has
  CATEGORY {
    string categoryId PK
    string name
  }
  EQUIPMENT_MODEL {
    string modelId PK
    string name
    string description
    decimal value
  }
  EQUIPMENT_UNIT {
    string serialNumber PK
    string condition
    string status
  }
  STUDENT {
    string studentId PK
    string fullName
    string email
  }
  LECTURER {
    string lecturerId PK
    string fullName
  }
  LOAN {
    string loanId PK
    string projectName
    date startDate
    date dueDate
    string status
  }
  LOAN_ITEM {
    string loanItemId PK
    string conditionAtReturn
    datetime returnedAt
  }
  FINE {
    string fineId PK
    decimal amount
    string reason
  }
  PAYMENT {
    string paymentId PK
    datetime paidAt
    decimal amount
  }
  MAINTENANCE_RECORD {
    string recordId PK
    date maintenanceDate
    string problem
    decimal cost
  }
`;

const GIAI_ENTITIES = [
  ['CATEGORY', 'A group of equipment models such as microcontrollers, measurement or imaging.', ['categoryId', 'name']],
  ['EQUIPMENT_MODEL', 'A kind of equipment in the catalogue, with its description and value; it is what students request.', ['modelId', 'name', 'description', 'value']],
  ['EQUIPMENT_UNIT', 'One physical device of a model, identified by its serial number, with its own condition and status.', ['serialNumber', 'condition', 'status']],
  ['STUDENT', 'A student who borrows equipment for a project and may owe fines.', ['studentId', 'fullName', 'email']],
  ['LECTURER', 'A project supervisor who approves requests containing high-value models.', ['lecturerId', 'fullName']],
  ['LOAN', 'One borrowing of one or more units by a student for a project, with its period and status.', ['loanId', 'projectName', 'startDate', 'dueDate', 'status']],
  ['LOAN_ITEM', 'One unit lent in one loan, with the condition recorded when that unit came back.', ['loanItemId', 'conditionAtReturn', 'returnedAt']],
  ['FINE', 'An amount owed because a loan was returned late or a unit was damaged.', ['fineId', 'amount', 'reason']],
  ['PAYMENT', 'The online e-wallet payment that settles one fine.', ['paymentId', 'paidAt', 'amount']],
  ['MAINTENANCE_RECORD', 'One maintenance job done on a unit with its date, problem and cost.', ['recordId', 'maintenanceDate', 'problem', 'cost']],
].map(([name, description, attributes]) => ({ name, description, attributes }));

export default deThiPE({
  so: 3,
  slug: 'swr302-11-pe-3-labequip-lending',
  ten: 'PE Practice 3 — LabEquip Equipment Lending (context · use case · ERD)',
  tieuDe: 'PE Practice 3 — LabEquip Lab Equipment Lending System',
  moTaModule: 'PE luyện định dạng FA25/SU25: trang bìa SRS, context diagram, use case + hai bảng, ERD khái niệm với bẫy loại thiết bị ↔ từng chiếc (serial), thực thể kết hợp Loan × Unit mang tình trạng lúc trả, bảo trì theo từng chiếc.',
  maDe: 'SWR302_PE_Practice_3',
  duAn: DU_AN,
  phu: { en: 'FA25 / SU25 format · 90 minutes · 10 points · Q4 = conceptual ERD (type vs instance)', vi: 'Định dạng FA25 / SU25 · 90 phút · 10 điểm · Câu 4 = ERD khái niệm (loại vs từng chiếc)' },
  boiCanh: BOI_CANH,
  moTaNgan: 'PE luyện 3 (FA25/SU25): LabEquip — context, use case + 2 bảng, ERD khái niệm (model vs unit, Loan × Unit).',
  q2: {
    giai: GIAI_CTX,
    cfg: {
      ngoai: [
        { ...A.student, can: ['vao', 'ra'], luong: [{ huong: 'vao', ten: 'loan request', khop: ['loan|request|borrow'] }, { huong: 'ra', ten: 'loan status / fine notice', khop: ['status|fine|notice|catalog'] }] },
        { ...A.sup, can: ['vao', 'ra'], luong: [{ huong: 'vao', ten: 'approval decision', khop: ['approv|decision'] }] },
        { ...A.tech, can: ['vao', 'ra'], luong: [{ huong: 'vao', ten: 'return inspection / scanned units', khop: ['return|inspect|scan|condition|handover'] }] },
        { ...A.manager, can: ['vao', 'ra'], luong: [{ huong: 'ra', ten: 'reports', khop: ['report|statistic'] }] },
        { ...A.sso, can: ['vao', 'ra'] },
        { ...A.wallet, can: ['vao', 'ra'], luong: [{ huong: 'vao', ten: 'payment result', khop: ['result|status|confirm|receipt'] }] },
        { ...A.noti, can: ['ra'], luong: [{ huong: 'ra', ten: 'due-date reminders', khop: ['remind|due|notif|message'] }] },
      ],
      cam: [
        { ten: 'Equipment / Unit / QR code', khop: ['^equipment|unit|qr|catalog|database|\\bdb\\b|paper book|^loan'], lyDo: 'that is data or a thing the system records, not someone exchanging data with it', lyDoVi: 'đó là dữ liệu hay đồ vật hệ thống ghi nhận, không phải ai đó trao đổi dữ liệu với nó' },
        { ten: 'Scheduler', khop: ['scheduler|timer|cron|clock'], lyDo: 'the evening reminder is a temporal event inside the system', lyDoVi: 'việc nhắc hạn buổi tối là sự kiện thời gian bên trong hệ thống' },
      ],
      toiThieuLuong: 12,
    },
  },
  q3: {
    giaiUC: GIAI_UC, giaiActors: GIAI_ACTORS, giaiUCs: GIAI_UCS,
    cfg: {
      actors: Object.values(A),
      camActor: [
        { ten: 'QR scanner / Equipment', khop: ['scanner|qr|equipment|unit|device'], lyDo: 'the scanner is a device the technician uses — the actor is the Lab Technician', lyDoVi: 'máy quét là thiết bị kỹ thuật viên dùng — actor là Lab Technician' },
        { ten: 'Scheduler / Timer', khop: ['scheduler|timer|cron|clock|time'], lyDo: 'the evening reminder is a temporal event inside the system', lyDoVi: 'nhắc hạn buổi tối là sự kiện thời gian bên trong hệ thống' },
      ],
      ucs: [
        { ten: 'Sign in through Campus SSO', khop: ['sign in|log ?in|authenticat'], actor: [A.sso] },
        { ten: 'Browse the equipment catalogue', khop: ['browse|search|view catalog|view equipment'], actor: [A.student] },
        { ten: 'Submit a loan request', khop: ['loan request|request loan|borrow|submit request|request equipment'], actor: [A.student] },
        { ten: 'Approve a high-value request', khop: ['approv'], actor: [A.sup] },
        { ten: 'Hand over equipment', khop: ['hand ?over|issue equipment|lend|check ?out|release equipment'], actor: [A.tech] },
        { ten: 'Record the return', khop: ['return|check ?in|receive equipment'], actor: [A.tech] },
        { ten: 'Pay a fine through the e-wallet', khop: ['pay'], actor: [A.student, A.wallet] },
        { ten: 'Log unit maintenance', khop: ['maint|repair'], actor: [A.tech] },
        { ten: 'Retire a unit', khop: ['retire|dispose|write off|decommission'], actor: [A.tech] },
        { ten: 'Manage the equipment catalogue', khop: ['catalog|manage equipment|manage model|categor'], actor: [A.manager] },
        { ten: 'View lending reports', khop: ['report|statistic'], actor: [A.manager] },
        { ten: 'Send due-date reminders', khop: ['remind|notif'], actor: [A.noti] },
      ],
      quanHe: [
        { loai: 'include', ten: 'Hand Over Equipment «include» Scan Unit QR Code', tu: ['hand ?over|issue equipment|lend|check ?out'], den: ['scan|qr'], lyDo: 'the technician ALWAYS scans each unit at handover', lyDoVi: 'kỹ thuật viên LUÔN quét từng chiếc khi giao' },
        { loai: 'extend', ten: 'Issue Fine «extend» Record Equipment Return', tu: ['fine'], den: ['return|check ?in'], lyDo: 'a fine is created only when the return is late or a unit is damaged — conditional behaviour', lyDoVi: 'phạt chỉ sinh ra khi trả trễ hoặc làm hỏng — hành vi có điều kiện' },
      ],
      toiThieuUC: 12,
    },
  },
  q4: {
    loai: 'erd',
    de: { en: 'draw a <b>conceptual ERD</b> for LabEquip and briefly describe every entity (and its key attributes) in the entity table. Pay attention to the difference between an equipment model and a physical unit.', vi: 'vẽ <b>ERD mức khái niệm</b> cho LabEquip và mô tả ngắn mọi thực thể (kèm thuộc tính chính) trong bảng thực thể. Chú ý khác biệt giữa loại thiết bị và từng chiếc thiết bị.' },
    giai: GIAI_ERD, giaiBang: GIAI_ENTITIES,
    viTri: { CATEGORY: [120, 90], EQUIPMENT_MODEL: [120, 300], EQUIPMENT_UNIT: [120, 530], MAINTENANCE_RECORD: [120, 770], LOAN_ITEM: [430, 530], LOAN: [740, 530], STUDENT: [580, 300], LECTURER: [870, 300], FINE: [740, 770], PAYMENT: [430, 770] },
    cfg: {
      tt: [
        { ten: 'Student', khop: ['student|borrower'] },
        { ten: 'Equipment model (catalogue item)', khop: ['model|equipment type|^equipment$|catalog|kind'] },
        { ten: 'Equipment unit (physical, serial number)', khop: ['unit|device|asset|physical|serial|copy'] },
        { ten: 'Loan', khop: ['^loan$|^borrow|^lending$|loan request|^rental$'] },
        { ten: 'Loan item (loan × unit)', khop: ['loan (item|line|detail|unit|equipment)|borrow(ed)? (item|unit)|lending (item|unit)'] },
        { ten: 'Fine', khop: ['fine|penalt'] },
        { ten: 'Maintenance record', khop: ['maint|repair'] },
      ],
      camTt: [
        { ten: 'QR code / serial number / condition', khop: ['^qr|^serial|^condition|due date|^status$|^value$'], lyDo: 'that is an attribute of the unit or of the loan, not an entity', lyDoVi: 'đó là thuộc tính của unit hoặc của lượt mượn, không phải thực thể' },
        { ten: 'E-wallet / Campus SSO / Report', khop: ['wallet|sso|notification|report'], lyDo: 'external systems are actors and reports are outputs — neither is data the system stores as an entity', lyDoVi: 'hệ thống ngoài là actor, báo cáo là đầu ra — không cái nào là thực thể hệ thống lưu' },
      ],
      qh: [
        { ten: 'Equipment model 1 — N units', tenVi: 'Một loại — nhiều chiếc', a: ['model|equipment type|^equipment$|catalog|kind'], b: ['unit|device|asset|physical|serial|copy'], nhieu: 'b', lyDo: 'a model (e.g. "Rigol DS1054Z") has many physical units, each with its own serial number', lyDoVi: 'một loại (vd "Rigol DS1054Z") có nhiều chiếc, mỗi chiếc một số serial' },
        { ten: 'Student 1 — N Loan', tenVi: 'Student 1 — N Loan', a: ['student|borrower'], b: ['^loan$|^borrow|^lending$|loan request|^rental$'], nhieu: 'b' },
        { ten: 'Loan 1 — N loan items (one or more)', tenVi: 'Loan 1 — N loan item (một hoặc nhiều)', a: ['^loan$|^borrow|^lending$|loan request|^rental$'], b: ['loan (item|line|detail|unit|equipment)|borrow(ed)? (item|unit)|lending (item|unit)'], nhieu: 'b', minB: 1, lyDo: 'a loan contains at least one unit', lyDoVi: 'một lượt mượn có ít nhất một chiếc' },
        { ten: 'Unit 1 — N loan items over its life', tenVi: 'Unit 1 — N loan item suốt đời chiếc máy', a: ['unit|device|asset|physical|serial|copy'], b: ['loan (item|line|detail|unit|equipment)|borrow(ed)? (item|unit)|lending (item|unit)'], nhieu: 'b' },
        { ten: 'Loan (or loan item) 1 — N Fine', tenVi: 'Loan (hoặc loan item) 1 — N Fine', a: ['loan'], b: ['fine|penalt'], nhieu: 'b' },
        { ten: 'Unit 1 — N maintenance records', tenVi: 'Unit 1 — N bản ghi bảo trì', a: ['unit|device|asset|physical|serial|copy'], b: ['maint|repair'], nhieu: 'b', lyDo: 'maintenance is logged per physical unit, not per model', lyDoVi: 'bảo trì ghi theo từng chiếc, không theo loại' },
      ],
      khongTrucTiep: [
        { ten: 'Loan–Unit is split by a loan item entity', tenVi: 'Loan–Unit được tách bằng thực thể loan item', a: ['^loan$|^borrow|^lending$|loan request|^rental$'], b: ['unit|device|asset|physical|serial|copy|^equipment$|model'], lyDo: 'Loan–Unit is many-to-many AND each pair has its own data (condition at return) — put an associative entity such as LOAN_ITEM between them', lyDoVi: 'Loan–Unit là nhiều–nhiều VÀ mỗi cặp có dữ liệu riêng (tình trạng lúc trả) — đặt thực thể kết hợp như LOAN_ITEM ở giữa' },
      ],
    },
  },
  truDiem: [
    { en: 'One entity "Equipment" for both the catalogue model and the physical unit: then you cannot say which unit was damaged, nor how many units a model has.', vi: 'Một thực thể "Equipment" cho cả loại lẫn từng chiếc: khi đó không nói được chiếc nào bị hỏng, hay một loại có bao nhiêu chiếc.' },
    { en: 'Loan linked straight to Unit: the condition at return belongs to the pair (this unit in this loan), so it needs LOAN_ITEM.', vi: 'Nối thẳng Loan với Unit: tình trạng lúc trả thuộc về cặp (chiếc này trong lượt này), nên cần LOAN_ITEM.' },
    { en: 'Maintenance attached to the model — the paper logs maintenance for a unit.', vi: 'Gắn bảo trì vào loại — đề ghi bảo trì cho từng chiếc.' },
    { en: '«include» for the fine: a fine happens only when the return is late or damaged ⇒ «extend» from Issue Fine to Record Equipment Return.', vi: '«include» cho phạt: phạt chỉ xảy ra khi trả trễ hoặc hỏng ⇒ «extend» từ Issue Fine tới Record Equipment Return.' },
  ],
  goiY: [
    'Tách hai câu: "each equipment MODEL has … the number of units available" và "specific physical UNITS — each unit has its own serial number" ⇒ hai thực thể, quan hệ 1 loại — N chiếc.',
    '"One loan can contain several units, and a unit is lent many times" ⇒ Loan–Unit nhiều–nhiều; "records its condition at return" là dữ liệu của CẶP ⇒ thực thể kết hợp LOAN_ITEM.',
    'Use case: "always scans" ⇒ «include»; "a late return or a damaged unit creates a fine" ⇒ có điều kiện ⇒ «extend». "A student with an unpaid fine cannot submit" ⇒ kiểm luôn xảy ra khi gửi yêu cầu (include hoặc tiền điều kiện).',
  ],
  loiHayGap: [
    'Vẽ "QR Scanner" thành actor — người dùng máy quét là Lab Technician.',
    'Quên Project Supervisor vì chỉ duyệt yêu cầu giá trị cao — vẫn là một actor trao đổi dữ liệu với hệ thống.',
    'Gắn số serial, tình trạng, mã QR thành thực thể — chúng là thuộc tính.',
    'Thiếu E-wallet trong sơ đồ ngữ cảnh: đóng phạt trực tuyến qua dịch vụ thanh toán bên ngoài.',
  ],
  giaiThich: {
    en: '<p><b>How to read the paper.</b> Seven parties exchange data with LabEquip: student, project supervisor, lab technician, lab manager, and three external services (Campus SSO, the e-wallet, the notification service). The ERD is about one distinction: a <i>model</i> is what the catalogue lists and what a student requests; a <i>unit</i> is the physical device with a serial number that is handed over, damaged, repaired and retired. Loan × Unit is many-to-many with its own data (the condition at return), hence LOAN_ITEM. The supervisor approves only some loans, so the LECTURER end of "approves" is optional (|o).</p>',
    vi: '<p><b>Cách đọc đề.</b> Bảy bên trao đổi dữ liệu với LabEquip: sinh viên, giảng viên hướng dẫn, kỹ thuật viên, quản lý lab, và ba dịch vụ ngoài (Campus SSO, ví điện tử, dịch vụ thông báo). ERD xoay quanh một phân biệt: <i>loại</i> (model) là thứ danh mục liệt kê và sinh viên yêu cầu; <i>chiếc</i> (unit) là thiết bị vật lý có số serial được giao, bị hỏng, được sửa và thanh lý. Loan × Unit là nhiều–nhiều có dữ liệu riêng (tình trạng lúc trả) nên cần LOAN_ITEM. Giảng viên chỉ duyệt một số lượt mượn nên đầu LECTURER của "approves" là tuỳ chọn (|o).</p>',
  },
  boYeu: [
    { ten: 'gộp model/unit thành EQUIPMENT, nối thẳng Loan–Equipment, bảo trì theo model', tep: { 'answers/q4-erd.js': `const ERD = \`
erDiagram
  STUDENT ||--o{ LOAN : submits
  LOAN }o--o{ EQUIPMENT : contains
  EQUIPMENT ||--o{ MAINTENANCE_RECORD : has
  LOAN ||--o{ FINE : incurs
  STUDENT {
    string studentId PK
  }
  LOAN {
    string loanId PK
  }
  EQUIPMENT {
    string equipmentId PK
    string serialNumber
  }
  MAINTENANCE_RECORD {
    string recordId PK
  }
  FINE {
    string fineId PK
  }
\`;
const ENTITIES = ${jsLit(GIAI_ENTITIES)};
` }, phaiTruot: ['every core entity of the case is present', 'Loan–Unit is split'] },
    { ten: 'QR scanner là actor + fine dùng include', tep: { 'answers/q3-usecases.js': `const USE_CASE_DIAGRAM = \`${GIAI_UC.replace('UC9 ..> UC8 : <<extend>>', 'UC8 ..> UC9 : <<include>>').replace('actor Student', 'actor Student\nactor "QR Scanner" as QR\nQR --> UC7')}\`;\nconst ACTORS = ${jsLit(GIAI_ACTORS)};\nconst USE_CASES = ${jsLit(GIAI_UCS)};\n` }, phaiTruot: ['no internal component modelled as an actor', 'Issue Fine «extend»'] },
  ],
});
