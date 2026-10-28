/**
 * SWR302 · LAB 1 — Essentials of software requirements: StudyHub course portal (Wiegers Ch.1).
 * A. loại của 14 phát biểu (Hình 1-1) · B. tài liệu chứa từng loại · C. yêu cầu sản phẩm vs dự án ·
 * D. hoạt động phát triển / quản lý yêu cầu · E. sáu vấn đề "when bad requirements happen to good people".
 */
import { tn, kiemKhoa } from './_chung.mjs';
import { deLon, kiemBang, objDong, objTrong } from './_lab.mjs';

const LOAI = ['Business requirement', 'User requirement', 'Functional requirement', 'Business rule', 'Quality attribute', 'External interface', 'Constraint'];
const CAU = [
  ['A1', 'The faculty wants to cut paper handouts by 80% within one year.', 'Business requirement'],
  ['A2', 'A lecturer needs to publish the weekly quiz before Monday’s class.', 'User requirement'],
  ['A3', 'The system shall e-mail a reminder 24 hours before a quiz deadline to every student who has not opened the quiz.', 'Functional requirement'],
  ['A4', 'A student may attempt a quiz at most twice; the higher score counts.', 'Business rule'],
  ['A5', 'The quiz page shall load in under 1.5 seconds for 95% of requests during exam week.', 'Quality attribute'],
  ['A6', 'StudyHub shall read class lists from the Academic Information System through its REST API.', 'External interface'],
  ['A7', 'StudyHub must be developed in Java 21 with Spring Boot, the standard of the university IT office.', 'Constraint'],
  ['A8', 'Students want to see all their deadlines of the week on one page.', 'User requirement'],
  ['A9', 'Grades are rounded to one decimal place, as the university regulation requires.', 'Business rule'],
  ['A10', 'When a lecturer closes a quiz, the system shall compute the score of every attempt.', 'Functional requirement'],
  ['A11', 'Reduce the time lecturers spend grading quizzes by 30%.', 'Business requirement'],
  ['A12', 'Only the lecturers of a course shall see the individual scores of its students.', 'Quality attribute'],
  ['A13', 'All personal data must be stored in the university’s own data centre in Vietnam.', 'Constraint'],
  ['A14', 'StudyHub shall print certificates on the faculty’s A4 laser printers.', 'External interface'],
];
const TAI_LIEU = ['VISION_SCOPE', 'USER_REQUIREMENTS', 'SRS', 'BUSINESS_RULES_CATALOG'];
const DAP_TL = { 'Business requirement': 'VISION_SCOPE', 'User requirement': 'USER_REQUIREMENTS', 'Functional requirement': 'SRS', 'Business rule': 'BUSINESS_RULES_CATALOG', 'Quality attribute': 'SRS' };
const SP_DA = [
  ['P1', 'Train 40 lecturers to create quizzes.', 'PROJECT'],
  ['P2', 'Write the user guide for students.', 'PROJECT'],
  ['P3', 'The system shall export the grade book as a CSV file.', 'PRODUCT'],
  ['P4', 'Buy 5 tablets to test the mobile app.', 'PROJECT'],
  ['P5', 'The quiz timer shall keep running if the student’s connection drops.', 'PRODUCT'],
  ['P6', 'Agree a service level: support answers within 4 working hours.', 'PROJECT'],
];
const HD = ['ELICITATION', 'ANALYSIS', 'SPECIFICATION', 'VALIDATION', 'MANAGEMENT'];
const VIEC = [
  ['D1', 'Run a workshop with five lecturers about how they build quizzes.', 'ELICITATION'],
  ['D2', 'Draw the state diagram of a quiz attempt to find missing cases.', 'ANALYSIS'],
  ['D3', 'Write the quiz requirements in the SRS with unique IDs.', 'SPECIFICATION'],
  ['D4', 'Review the SRS with lecturers and students to confirm it describes what they need.', 'VALIDATION'],
  ['D5', 'Baseline the SRS and route every change request to the change control board.', 'MANAGEMENT'],
  ['D6', 'Negotiate the priorities of the features between the faculty and the IT office.', 'ANALYSIS'],
  ['D7', 'Write acceptance criteria that will confirm the product meets the business objectives.', 'VALIDATION'],
  ['D8', 'Trace each requirement to its tests and track its status.', 'MANAGEMENT'],
];
const VAN_DE = ['INSUFFICIENT_USER_INVOLVEMENT', 'INACCURATE_PLANNING', 'CREEPING_REQUIREMENTS', 'AMBIGUOUS_REQUIREMENTS', 'GOLD_PLATING', 'OVERLOOKED_STAKEHOLDERS'];
const SU_CO = [
  ['E1', 'Lecturers were never asked; the BA wrote the requirements from the opinions of the IT office.', 'INSUFFICIENT_USER_INVOLVEMENT'],
  ['E2', 'Every week the faculty added "one small feature"; release 1 slipped by three months.', 'CREEPING_REQUIREMENTS'],
  ['E3', '"The system shall support many question types": the team built 3, the faculty expected 12.', 'AMBIGUOUS_REQUIREMENTS'],
  ['E4', 'A developer added animated confetti after every quiz because he thought students would like it.', 'GOLD_PLATING'],
  ['E5', 'Nobody talked to the examination office, which must approve how final grades are stored.', 'OVERLOOKED_STAKEHOLDERS'],
  ['E6', 'The schedule was promised before the requirements were understood, and the estimate was 50% too low.', 'INACCURATE_PLANNING'],
];

const dap = (xs) => Object.fromEntries(xs.map((x) => [x[0], x[2]]));
const KIEM = [
  ...kiemBang('TYPES', dap(CAU), { nhom: 'f1', an: ['A13', 'A14'], ten: (k) => `A — type of ${k}`, tenVi: (k) => `A — loại của ${k}`, goiY: { A1: 'WHY the organisation wants it', A2: 'a task a user must be able to do', A4: 'a policy that exists outside the software', A7: 'it restricts the choices of the developers', A12: 'a property (security), not a behaviour' } }),
  ...kiemBang('DOCUMENTS', DAP_TL, { nhom: 'f2', ten: (k) => `B — document for ${k}`, tenVi: (k) => `B — tài liệu chứa ${k}` }),
  ...kiemBang('PRODUCT_OR_PROJECT', dap(SP_DA), { nhom: 'f3', ten: (k) => `C — ${k}: product or project requirement`, tenVi: (k) => `C — ${k}: yêu cầu sản phẩm hay dự án` }),
  ...kiemBang('ACTIVITIES', dap(VIEC), { nhom: 'f4', an: ['D6', 'D7'], ten: (k) => `D — RE activity of ${k}`, tenVi: (k) => `D — hoạt động RE của ${k}` }),
  ...kiemBang('PROBLEMS', dap(SU_CO), { nhom: 'f5', ten: (k) => `E — requirements problem in ${k}`, tenVi: (k) => `E — vấn đề yêu cầu trong ${k}` }),
];

const TEP = {
  'answers/a-types.js': [`// A. ${LOAI.join(' | ')}\n${objTrong('TYPES', dap(CAU))}`, `// A. Wiegers Fig. 1-1: why (business) · what users do (user) · what the system does (functional) · rules from outside · properties · interfaces · limits.\n${objDong('TYPES', dap(CAU))}`],
  'answers/b-documents.js': [`// B. ${TAI_LIEU.join(' | ')}\n${objTrong('DOCUMENTS', DAP_TL)}`, `// B. Business requirements live in the vision and scope document; user requirements in use cases/user stories; functional and nonfunctional requirements in the SRS; business rules in their own catalogue.\n${objDong('DOCUMENTS', DAP_TL)}`],
  'answers/c-product-project.js': [`// C. PRODUCT | PROJECT\n${objTrong('PRODUCT_OR_PROJECT', dap(SP_DA))}`, `// C. Product requirements describe the software; project requirements are the other work the project needs (training, documentation, hardware, SLAs…).\n${objDong('PRODUCT_OR_PROJECT', dap(SP_DA))}`],
  'answers/d-activities.js': [`// D. ${HD.join(' | ')}\n${objTrong('ACTIVITIES', dap(VIEC))}`, `// D. Development = elicitation, analysis (incl. modelling and negotiating priorities), specification, validation (incl. acceptance criteria); management = baseline, change control, tracing, status.\n${objDong('ACTIVITIES', dap(VIEC))}`],
  'answers/e-problems.js': [`// E. ${VAN_DE.join(' | ')}\n${objTrong('PROBLEMS', dap(SU_CO))}`, `// E. Wiegers Ch.1 "When bad requirements happen to good people".\n${objDong('PROBLEMS', dap(SU_CO))}`],
};

const ds = (xs) => `<ul>${xs.map((x) => `<li><b>${x[0]}</b> — ${x[1]}</li>`).join('')}</ul>`;

export default deLon({
  slug: 'swr302-1-lab-essentials-studyhub',
  ten: 'Lab 1 — Essentials: the Requirements of StudyHub',
  moTaModule: 'Lab chương 1: phân loại 14 phát biểu theo Hình 1-1 của Wiegers, tài liệu chứa từng loại, yêu cầu sản phẩm vs dự án, xếp 8 việc vào năm hoạt động kỹ nghệ yêu cầu, gọi tên sáu vấn đề yêu cầu kinh điển.',
  baiHoc: 'swr302-1-1-yeu-cau-la-gi',
  tieuDe: 'Lab 1 — Essentials: the Requirements of StudyHub',
  phu: { en: 'Chapter 1 lab · levels and types of requirements, where they live, product vs project, the RE process, six classic problems · 10 marks', vi: 'Lab chương 1 · cấp và loại yêu cầu, nơi lưu, sản phẩm vs dự án, quy trình RE, sáu vấn đề kinh điển · 10 điểm' },
  moTa: {
    en: `<p><b>StudyHub</b> is the course portal a faculty is building: lecturers publish materials and quizzes, students take quizzes and follow deadlines, grades go to the examination office. You join as junior BA and receive the notes of the first month.</p>
<p><b>A. Statements</b> — classify each with the types of Wiegers Figure 1-1:</p>${ds(CAU)}
<p><b>B.</b> In which document does each type of requirement normally live?</p>
<p><b>C. Items of the project plan</b>:</p>${ds(SP_DA)}
<p><b>D. Activities of the team</b>:</p>${ds(VIEC)}
<p><b>E. What went wrong on the previous portal</b>:</p>${ds(SU_CO)}`,
    vi: `<p><b>StudyHub</b> là cổng môn học khoa đang xây: giảng viên đăng tài liệu và quiz, sinh viên làm quiz và theo dõi hạn nộp, điểm chuyển cho phòng khảo thí. Bạn vào nhóm làm BA mới và nhận ghi chép của tháng đầu.</p>
<p><b>A.</b> Phân loại 14 phát biểu A1–A14 theo Hình 1-1 của Wiegers. <b>B.</b> Mỗi loại yêu cầu thường nằm trong tài liệu nào? <b>C.</b> Sáu mục P1–P6 của kế hoạch dự án: yêu cầu sản phẩm hay dự án? <b>D.</b> Tám việc D1–D8: hoạt động nào của kỹ nghệ yêu cầu? <b>E.</b> Sáu sự cố E1–E6 của cổng cũ: vấn đề yêu cầu nào?</p>`,
  },
  chucNangChinh: [
    { en: 'A. Type of 14 statements.', vi: 'A. Loại của 14 phát biểu.' },
    { en: 'B. The document of each type.', vi: 'B. Tài liệu của từng loại.' },
    { en: 'C. Product or project requirement.', vi: 'C. Yêu cầu sản phẩm hay dự án.' },
    { en: 'D. RE activity of 8 tasks.', vi: 'D. Hoạt động RE của 8 việc.' },
    { en: 'E. Six classic requirements problems.', vi: 'E. Sáu vấn đề yêu cầu kinh điển.' },
  ],
  yeuCauChung: [{ en: 'Use exactly the allowed values listed in the data model.', vi: 'Dùng đúng giá trị cho phép trong mô hình dữ liệu.' }],
  cayThuMuc: `answers/
├── a-types.js             ← const TYPES = { A1: '…', … }
├── b-documents.js         ← const DOCUMENTS = { 'Business requirement': '…', … }
├── c-product-project.js   ← const PRODUCT_OR_PROJECT = { P1: '…', … }
├── d-activities.js        ← const ACTIVITIES = { D1: '…', … }
└── e-problems.js          ← const PROBLEMS = { E1: '…', … }`,
  moHinh: {
    ten: 'Allowed values',
    truong: [
      ['TYPES.*', 'string', { en: LOAI.join(' · '), vi: LOAI.join(' · ') }],
      ['DOCUMENTS.*', 'string', { en: TAI_LIEU.join(' · '), vi: 'VISION_SCOPE (tầm nhìn & phạm vi) · USER_REQUIREMENTS (use case / user story) · SRS · BUSINESS_RULES_CATALOG (danh mục business rule)' }],
      ['PRODUCT_OR_PROJECT.*', 'string', { en: 'PRODUCT · PROJECT', vi: 'PRODUCT · PROJECT' }],
      ['ACTIVITIES.*', 'string', { en: HD.join(' · '), vi: HD.join(' · ') }],
      ['PROBLEMS.*', 'string', { en: VAN_DE.join(' · '), vi: VAN_DE.join(' · ') }],
    ],
  },
  chucNang: [
    { ten: { en: 'A. Levels and types', vi: 'A. Cấp và loại' }, diem: 3.5, yeuCau: [{ en: 'The type of each statement.', vi: 'Loại của từng phát biểu.' }], hook: ['Wiegers Figure 1-1'] },
    { ten: { en: 'B. Where requirements live', vi: 'B. Yêu cầu nằm ở đâu' }, diem: 1, yeuCau: [{ en: 'Vision and scope, user requirements, SRS, business rules catalogue.', vi: 'Tầm nhìn & phạm vi, yêu cầu người dùng, SRS, danh mục business rule.' }], hook: ['deliverables'] },
    { ten: { en: 'C. Product vs project', vi: 'C. Sản phẩm vs dự án' }, diem: 1.5, yeuCau: [{ en: 'Only product requirements go into the SRS.', vi: 'Chỉ yêu cầu sản phẩm vào SRS.' }], hook: ['project requirements'] },
    { ten: { en: 'D. The RE process', vi: 'D. Quy trình RE' }, diem: 2, yeuCau: [{ en: 'Elicitation, analysis, specification, validation, management.', vi: 'Khai thác, phân tích, đặc tả, thẩm định, quản lý.' }], hook: ['requirements development vs management'] },
    { ten: { en: 'E. Classic problems', vi: 'E. Vấn đề kinh điển' }, diem: 2, yeuCau: [{ en: 'Name the problem behind each incident.', vi: 'Gọi tên vấn đề sau mỗi sự cố.' }], hook: ['gold plating', 'scope creep'] },
  ],
  idBatBuoc: [['TYPES', 'answers/a-types.js'], ['DOCUMENTS', 'answers/b-documents.js'], ['PRODUCT_OR_PROJECT', 'answers/c-product-project.js'], ['ACTIVITIES', 'answers/d-activities.js'], ['PROBLEMS', 'answers/e-problems.js']],
  truDiem: [
    { en: 'A4 and A9 as functional requirements: they are rules that exist outside the software; functional requirements are derived from them.', vi: 'Xếp A4, A9 là yêu cầu chức năng: chúng là luật tồn tại ngoài phần mềm; yêu cầu chức năng được rút ra từ chúng.' },
    { en: 'A12 as a functional requirement: who may see what is a security quality attribute.', vi: 'Xếp A12 là yêu cầu chức năng: ai được xem gì là thuộc tính chất lượng bảo mật.' },
    { en: 'Writing training and documentation into the SRS — they are project requirements.', vi: 'Viết đào tạo và tài liệu vào SRS — đó là yêu cầu dự án.' },
  ],
  goiY: [
    'A: hỏi theo thứ tự — VÌ SAO tổ chức làm (business)? NGƯỜI DÙNG cần làm được gì (user)? HỆ THỐNG làm gì trong điều kiện nào (functional)? Luật/chính sách tồn tại ngoài phần mềm (business rule)? Thuộc tính đo được (quality)? Nối hệ thống/thiết bị khác (interface)? Giới hạn lựa chọn của đội (constraint)?',
    'D: phân tích gồm cả mô hình hoá và thương lượng ưu tiên; thẩm định gồm cả viết tiêu chí chấp nhận.',
  ],
  loiHayGap: [
    'Xếp A2 là functional vì có "publish" — A2 là việc của người dùng (user requirement).',
    'Xếp A11 là quality attribute vì có con số — đó là mục tiêu nghiệp vụ.',
    'Nhầm gold plating (đội tự thêm) với creeping requirements (khách liên tục thêm).',
  ],
  giaiThich: {
    en: `<p><b>A.</b> ${CAU.map((x) => `${x[0]} ${x[2]}`).join(' · ')}. <b>B.</b> Vision and scope · user requirements document · SRS · business rules catalogue · SRS. <b>C.</b> ${SP_DA.map((x) => `${x[0]} ${x[2]}`).join(' · ')}. <b>D.</b> ${VIEC.map((x) => `${x[0]} ${x[2]}`).join(' · ')}. <b>E.</b> ${SU_CO.map((x) => `${x[0]} ${x[2]}`).join(' · ')}.</p>`,
    vi: `<p><b>A.</b> ${CAU.map((x) => `${x[0]} ${x[2]}`).join(' · ')}. <b>B.</b> Tầm nhìn & phạm vi · tài liệu yêu cầu người dùng · SRS · danh mục business rule · SRS. <b>C.</b> ${SP_DA.map((x) => `${x[0]} ${x[2]}`).join(' · ')}. <b>D.</b> ${VIEC.map((x) => `${x[0]} ${x[2]}`).join(' · ')}. <b>E.</b> ${SU_CO.map((x) => `${x[0]} ${x[2]}`).join(' · ')}.</p>`,
  },
  khaiNiem: ['levels of requirements', 'types of requirements', 'product vs project requirements', 'RE process', 'requirements problems'],
  tienQuyet: ['SWR302 Chapter 1'],
  thuatNgu: [...tn('requirement', 'businessReq', 'userReq', 'functionalReq', 'nfr', 'qualityAttr', 'constraint', 'businessRule', 'externalInterface', 'elicitation', 'analysis', 'specification', 'validation', 'goldPlating', 'scopeCreep')],
  moTaNgan: 'Lab chương 1: StudyHub — loại yêu cầu, tài liệu, sản phẩm/dự án, quy trình, vấn đề.',
  phut: 40,
  tep: TEP,
  kiem: KIEM,
  boYeu: [
    { ten: 'luật là FR, bảo mật là FR, mục tiêu là QA', tep: { 'answers/a-types.js': objDong('TYPES', { ...dap(CAU), A4: 'Functional requirement', A12: 'Functional requirement', A11: 'Quality attribute' }) }, phaiTruot: ['type of A4', 'type of A12', 'type of A11'] },
    { ten: 'đào tạo là sản phẩm, gold plating ↔ creeping', tep: { 'answers/c-product-project.js': objDong('PRODUCT_OR_PROJECT', { ...dap(SP_DA), P1: 'PRODUCT', P2: 'PRODUCT' }), 'answers/e-problems.js': objDong('PROBLEMS', { ...dap(SU_CO), E2: 'GOLD_PLATING', E4: 'CREEPING_REQUIREMENTS' }) }, phaiTruot: ['P1: product or project', 'problem in E2'] },
  ],
});
