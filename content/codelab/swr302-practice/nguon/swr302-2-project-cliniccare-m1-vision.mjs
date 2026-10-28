/**
 * SWR302 · DỰ ÁN ClinicCare — Mốc 1 (chương 2): mục tiêu nghiệp vụ, tầm nhìn (khuôn Moore), phạm vi, sơ đồ ngữ cảnh + Interview corner.
 */
import { tn, kiemTuy, CU_PHAP } from './_chung.mjs';
import { deLon } from './_lab.mjs';
import { kiemNguCanh } from './_kiemmh.mjs';
import { khoiThamChieu } from './_ve.mjs';
import { BOI_CANH, A, phongVan } from './_cliniccare.mjs';

const GIAI_CTX = `
flowchart LR
  S((ClinicCare))
  PT[Patient] -->|appointment request| S
  S -->|appointment confirmation| PT
  DR[Doctor] -->|slot schedule| S
  DR -->|prescription details| S
  S -->|daily appointment list| DR
  RC[Receptionist] -->|patient arrival| S
  S -->|daily schedule| RC
  PH[Pharmacist] -->|dispensed status| S
  S -->|e-prescription| PH
  CM[Clinic Manager] -->|service fees| S
  S -->|monthly report| CM
  PG[VNPay Payment Gateway] -->|payment result| S
  S -->|payment request| PG
  S -->|appointment reminder| SG[SMS Gateway]
  S -->|prescription data| NE[National e-Prescription System]
  NE -->|prescription code| S
`;

const KIEM = [
  kiemTuy({ en: 'A — at least 3 business objectives, each measurable (a number) with a time frame', vi: 'A — ít nhất 3 mục tiêu nghiệp vụ, mỗi mục đo được (có số) và có mốc thời gian' }, function () {
    if (typeof BUSINESS_OBJECTIVES === 'undefined' || !Array.isArray(BUSINESS_OBJECTIVES)) return 'BUSINESS_OBJECTIVES is missing';
    if (BUSINESS_OBJECTIVES.length < 3) return 'write at least 3 business objectives';
    for (var i = 0; i < BUSINESS_OBJECTIVES.length; i++) {
      var s = String(BUSINESS_OBJECTIVES[i]);
      if (!/\d/.test(s)) return 'objective ' + (i + 1) + ' has no number — make it measurable (e.g. "by 40%")';
      if (!/(month|year|week|day|quarter|within|by (the )?(end|20\d\d|q[1-4])|after)/i.test(s)) return 'objective ' + (i + 1) + ' has no time frame (e.g. "within 6 months of release")';
      if (/\b(improve|better|enhance|optimi[sz]e)\b/i.test(s) && !/\d+\s*%|\d+\s*(calls|minutes|percent)/i.test(s)) return 'objective ' + (i + 1) + ' says "improve" without a target value';
    }
    return 'OK';
  }, { nhom: 'f1' }),
  kiemTuy({ en: 'A — the objectives address the two problems of the case: phone calls and no-shows', vi: 'A — các mục tiêu nhắm đúng hai vấn đề của đề: cuộc gọi và no-show' }, function () {
    if (typeof BUSINESS_OBJECTIVES === 'undefined' || !Array.isArray(BUSINESS_OBJECTIVES)) return 'BUSINESS_OBJECTIVES is missing';
    var t = BUSINESS_OBJECTIVES.join(' | ').toLowerCase();
    if (!/call|phone/.test(t)) return 'no objective about the phone calls to reception';
    if (!/no-show|no show|missed appointment|attend/.test(t)) return 'no objective about the 15% no-shows';
    return 'OK';
  }, { nhom: 'f1' }),
  kiemTuy({ en: 'B — vision statement: every slot of Moore’s template is filled', vi: 'B — tuyên bố tầm nhìn: điền đủ mọi ô của khuôn Moore' }, function () {
    if (typeof VISION === 'undefined' || !VISION) return 'VISION is missing';
    var k = ['forWho', 'who', 'productName', 'isA', 'that', 'unlike', 'ourProduct'];
    for (var i = 0; i < k.length; i++) if (String(VISION[k[i]] || '').trim().split(/\s+/).filter(Boolean).length < (k[i] === 'productName' ? 1 : 3)) return 'VISION.' + k[i] + ' is empty or too short';
    return /cliniccare/i.test(VISION.productName) ? 'OK' : 'productName must be ClinicCare';
  }, { nhom: 'f2' }),
  kiemTuy({ en: 'B — the vision fits the case: the target customers, the key benefit, and the alternative it replaces', vi: 'B — tầm nhìn khớp đề: khách hàng mục tiêu, lợi ích chính, phương án hiện tại bị thay thế' }, function () {
    if (typeof VISION === 'undefined' || !VISION) return 'VISION is missing';
    if (!/patient|clinic/i.test(VISION.forWho)) return 'forWho: who is it for? (patients of Minh An clinic / the clinic)';
    if (!/book|appointment|online|anytime|24/i.test(VISION.that)) return 'that: state the key benefit (book appointments online, any time…)';
    if (!/phone|call|reception/i.test(VISION.unlike)) return 'unlike: name the current alternative (phoning the reception desk)';
    if (/\b(java|react|database|server|cloud|aws|api)\b/i.test([VISION.that, VISION.ourProduct].join(' '))) return 'a vision states the value, not the technology';
    return 'OK';
  }, { nhom: 'f2' }),
  kiemTuy({ en: 'C — scope of release 1: in-scope capabilities of the case', vi: 'C — phạm vi bản 1: các khả năng trong phạm vi' }, function () {
    if (typeof SCOPE === 'undefined' || !SCOPE || !Array.isArray(SCOPE.in)) return 'SCOPE.in is missing';
    var t = SCOPE.in.join(' | ').toLowerCase();
    var need = [['booking', /book/], ['cancellation', /cancel/], ['online payment', /pay/], ['e-prescriptions', /prescri/], ['reminders', /remind|sms/], ['check-in', /check.?in|arriv/], ['reports', /report/]];
    for (var i = 0; i < need.length; i++) if (!need[i][1].test(t)) return 'SCOPE.in: missing ' + need[i][0];
    return 'OK';
  }, { nhom: 'f3' }),
  kiemTuy({ en: 'C — out of scope: the four excluded capabilities, none of them also "in"', vi: 'C — ngoài phạm vi: bốn khả năng bị loại, không cái nào nằm cả trong "in"' }, function () {
    if (typeof SCOPE === 'undefined' || !SCOPE || !Array.isArray(SCOPE.out)) return 'SCOPE.out is missing';
    var t = SCOPE.out.join(' | ').toLowerCase(), i = (SCOPE.in || []).join(' | ').toLowerCase();
    var need = [['video consultation', /video/], ['insurance e-claims', /insur/], ['loyalty programme', /loyal/], ['lab machine integration', /lab/]];
    for (var k = 0; k < need.length; k++) {
      if (!need[k][1].test(t)) return 'SCOPE.out: missing ' + need[k][0];
      if (need[k][1].test(i)) return need[k][0] + ' is listed both in and out of scope';
    }
    return 'OK';
  }, { nhom: 'f3' }),
  ...kiemNguCanh({
    bien: 'CONTEXT_DIAGRAM',
    nhom: { cuPhap: 'f4', thanhPhan: 'f5', luong: 'f6' },
    ngoai: [
      { ...A.patient, can: ['vao', 'ra'] },
      { ...A.doctor, can: ['vao', 'ra'] },
      { ...A.recep, can: ['vao', 'ra'] },
      { ...A.pharm, can: ['vao', 'ra'] },
      { ...A.manager, can: ['vao', 'ra'], luong: [{ ten: 'services and fees', huong: 'vao', khop: ['fee|price|service'] }, { ten: 'monthly report', huong: 'ra', khop: ['report|statistic'] }] },
      { ...A.pay, can: ['vao', 'ra'], luong: [{ ten: 'payment result', huong: 'vao', khop: ['result|confirm|status|receipt'] }] },
      { ...A.sms, can: ['ra'], luong: [{ ten: 'appointment reminder', huong: 'ra', khop: ['remind'] }] },
      { ...A.nep, can: ['vao', 'ra'], luong: [{ ten: 'prescription code', huong: 'vao', khop: ['code|number|id'] }] },
    ],
    cam: [
      { ten: 'Database / app', khop: ['database|\\bdb\\b|mobile app|web app|website|server'], lyDo: 'it is part of ClinicCare', lyDoVi: 'nó là một phần của ClinicCare' },
      { ten: 'Appointment / Schedule / Prescription', khop: ['^appointment|^schedule|^slot|^prescription$'], lyDo: 'that is data inside ClinicCare, not a party', lyDoVi: 'đó là dữ liệu bên trong ClinicCare, không phải một bên' },
    ],
    toiThieuLuong: 14,
  }),
];

const TEP = {
  'answers/a-objectives.js': [
    "// A. Business objectives — measurable (number) and time-bound.\nconst BUSINESS_OBJECTIVES = [\n  '',\n];\n",
    "// A. Each objective: what changes, by how much, by when.\nconst BUSINESS_OBJECTIVES = [\n  'Reduce phone calls to the reception desk from about 120 to at most 70 per day within 6 months after release 1.',\n  'Reduce the no-show rate from 15% to below 7% within 6 months after release 1.',\n  'Have at least 60% of all appointments booked online within 9 months after release 1.',\n];\n",
  ],
  'answers/b-vision.js': [
    "// B. Vision statement — Geoffrey Moore's template.\nconst VISION = {\n  forWho: '',       // For <target customer>\n  who: '',          // Who <statement of the need or opportunity>\n  productName: '',  // The <product name>\n  isA: '',          // is <a product category>\n  that: '',         // that <key benefit, reason to buy>\n  unlike: '',       // Unlike <primary competitive alternative>\n  ourProduct: '',   // our product <statement of primary differentiation>\n};\n",
    "// B. Vision statement — Moore's template (value, not technology).\nconst VISION = {\n  forWho: 'patients of Minh An Family Clinic and its staff',\n  who: 'want to book, change and pay for a visit without waiting on the phone',\n  productName: 'ClinicCare',\n  isA: 'web and mobile appointment and clinic workflow system',\n  that: 'lets patients book an appointment online any time and reminds them before the visit',\n  unlike: 'phoning the busy reception desk during opening hours',\n  ourProduct: 'connects booking, payment, the doctor’s visit and the e-prescription in one place',\n};\n",
  ],
  'answers/c-scope.js': [
    "// C. Scope of release 1.\nconst SCOPE = {\n  in: [],\n  out: [],\n};\n",
    "// C. Scope of release 1 — what is explicitly out is as important as what is in.\nconst SCOPE = {\n  in: ['Patient registration and online booking', 'Cancellation up to 2 hours before', 'Online payment through VNPay', 'Check-in and no-show marking by reception', 'Visit notes and e-prescriptions sent to the national system', 'SMS reminders 24 hours before', 'Services, fees and monthly reports for the manager'],\n  out: ['Video consultation', 'Insurance e-claims', 'Loyalty programme', 'Integration with the lab machines'],\n};\n",
  ],
  'answers/d-context.js': [
    "// D. Context diagram (Mermaid flowchart) — ONE circle for ClinicCare, rectangles for external entities, one labelled arrow per direction.\nconst CONTEXT_DIAGRAM = ´\nflowchart LR\n  S((ClinicCare))\n  PT[Patient] -->|appointment request| S\n´;\n",
    `// D. Eight external entities; data (not actions) on every arrow.\nconst CONTEXT_DIAGRAM = ´${GIAI_CTX.replace(/\s+$/, '')}\n´;\n`,
  ],
};

const mod = deLon({
  slug: 'swr302-2-project-cliniccare-m1-vision',
  ten: 'ClinicCare project — Milestone 1: Vision, scope and context',
  moTaModule: 'Dự án xuyên suốt ClinicCare, mốc 1 (chương 2): mục tiêu nghiệp vụ đo được, tuyên bố tầm nhìn theo khuôn Moore, phạm vi trong/ngoài bản 1, sơ đồ ngữ cảnh 8 thực thể ngoài — chấm bằng máy đọc Mermaid; kèm Góc phỏng vấn.',
  baiHoc: 'swr302-5v-1-ch5-business-req-vision',
  dangBai: 'project',
  tieuDe: 'ClinicCare project — Milestone 1: Vision, scope and context diagram',
  phu: { en: 'Running project · milestone 1 of 7 · vision & scope document essentials · 10 marks', vi: 'Dự án xuyên suốt · mốc 1/7 · cốt lõi tài liệu Vision & Scope · 10 điểm' },
  moTa: {
    en: `<p>You are the business analyst of <b>ClinicCare</b> for the whole course. Each milestone builds on the previous one: vision → elicitation → use cases → models → SRS → change & traceability → prioritisation. Keep your answers — later milestones reuse the same story.</p>${BOI_CANH.en}
<p><b>Milestone 1 — the core of the Vision & Scope document:</b></p>
<ol><li><b>A.</b> At least three business objectives, each measurable and time-bound, addressing the problems of the case.</li>
<li><b>B.</b> A vision statement with Geoffrey Moore’s template (For … who … the … is a … that … unlike … our product …).</li>
<li><b>C.</b> The scope of release 1: what is in and what is explicitly out.</li>
<li><b>D.</b> The context diagram.</li></ol>
${CU_PHAP.context.en}`,
    vi: `<p>Bạn là BA của <b>ClinicCare</b> suốt khoá học. Mỗi mốc dựa trên mốc trước: tầm nhìn → khai thác → use case → mô hình → SRS → thay đổi & truy vết → ưu tiên.</p>${BOI_CANH.vi}
<p><b>Mốc 1 — cốt lõi tài liệu Vision & Scope:</b> A. ≥ 3 mục tiêu nghiệp vụ đo được, có thời hạn · B. tuyên bố tầm nhìn theo khuôn Moore · C. phạm vi bản 1 (trong / ngoài) · D. sơ đồ ngữ cảnh.</p>${CU_PHAP.context.vi}`,
  },
  chucNangChinh: [
    { en: 'A. Business objectives.', vi: 'A. Mục tiêu nghiệp vụ.' }, { en: 'B. Vision statement.', vi: 'B. Tuyên bố tầm nhìn.' },
    { en: 'C. Scope of release 1.', vi: 'C. Phạm vi bản 1.' }, { en: 'D. Context diagram.', vi: 'D. Sơ đồ ngữ cảnh.' },
  ],
  yeuCauChung: [{ en: 'Use the names of the case; the context diagram follows the Mermaid subset shown above.', vi: 'Dùng tên trong đề; sơ đồ ngữ cảnh theo tập con Mermaid ở trên.' }],
  cayThuMuc: `answers/
├── a-objectives.js   ← const BUSINESS_OBJECTIVES = [ '…', … ]
├── b-vision.js       ← const VISION = { forWho, who, productName, isA, that, unlike, ourProduct }
├── c-scope.js        ← const SCOPE = { in: [ … ], out: [ … ] }
└── d-context.js      ← const CONTEXT_DIAGRAM = \`flowchart LR …\``,
  moHinh: { ten: 'Answer records', truong: [
    ['BUSINESS_OBJECTIVES', 'string[]', { en: 'number + time frame each', vi: 'mỗi câu có số + thời hạn' }],
    ['VISION', '{ forWho, who, productName, isA, that, unlike, ourProduct }', { en: 'Moore template', vi: 'khuôn Moore' }],
    ['SCOPE', '{ in: string[], out: string[] }', { en: '', vi: '' }],
    ['CONTEXT_DIAGRAM', 'Mermaid flowchart string', { en: 'one circle, rectangles, labelled arrows', vi: 'một hình tròn, chữ nhật, mũi tên có nhãn' }],
  ] },
  chucNang: [
    { ten: { en: 'A. Business objectives', vi: 'A. Mục tiêu nghiệp vụ' }, diem: 1.5, yeuCau: [{ en: 'SMART; calls and no-shows.', vi: 'SMART; cuộc gọi và no-show.' }], hook: ['business objectives'] },
    { ten: { en: 'B. Vision statement', vi: 'B. Tầm nhìn' }, diem: 1.5, yeuCau: [{ en: 'All Moore slots; fits the case.', vi: 'Đủ ô Moore; khớp đề.' }], hook: ['vision statement'] },
    { ten: { en: 'C. Scope', vi: 'C. Phạm vi' }, diem: 1.5, yeuCau: [{ en: 'In and out lists.', vi: 'Danh sách trong và ngoài.' }], hook: ['scope'] },
    { ten: { en: 'D1. Context diagram — notation', vi: 'D1. Sơ đồ ngữ cảnh — ký hiệu' }, diem: 1.5, yeuCau: [{ en: 'One process, rectangles, labelled data flows.', vi: 'Một process, chữ nhật, luồng dữ liệu có nhãn.' }], hook: ['context diagram'] },
    { ten: { en: 'D2. Context diagram — entities', vi: 'D2. Sơ đồ ngữ cảnh — thực thể' }, diem: 1.5, yeuCau: [{ en: 'All eight; nothing internal.', vi: 'Đủ tám; không vẽ thứ bên trong.' }], hook: ['external entities'] },
    { ten: { en: 'D3. Context diagram — flows', vi: 'D3. Sơ đồ ngữ cảnh — luồng' }, diem: 2.5, yeuCau: [{ en: 'Directions and key flows of each entity.', vi: 'Chiều và luồng chính của từng thực thể.' }], hook: ['data flows'] },
  ],
  idBatBuoc: [['BUSINESS_OBJECTIVES', 'answers/a-objectives.js'], ['VISION', 'answers/b-vision.js'], ['SCOPE', 'answers/c-scope.js'], ['CONTEXT_DIAGRAM', 'answers/d-context.js']],
  truDiem: [
    { en: 'Objectives such as "improve customer satisfaction" — no number, no date, not testable.', vi: 'Mục tiêu kiểu "nâng cao sự hài lòng" — không số, không ngày, không kiểm được.' },
    { en: 'Drawing the database or "Appointment" as an external entity.', vi: 'Vẽ cơ sở dữ liệu hay "Appointment" thành thực thể ngoài.' },
    { en: 'Forgetting the National e-Prescription System, required by law.', vi: 'Quên Hệ thống Đơn thuốc Quốc gia — luật bắt buộc.' },
  ],
  goiY: [
    'A: lấy số trong đề (120 cuộc/ngày, 15% no-show) làm mốc gốc rồi đặt mục tiêu + thời hạn.',
    'B: khuôn Moore — For (ai) / who (nhu cầu) / the (tên) / is a (loại sản phẩm) / that (lợi ích chính) / Unlike (phương án hiện tại) / our product (khác biệt).',
    'D: tám thực thể ngoài — năm vai người dùng và ba hệ thống ngoài; SMS gateway chỉ nhận dữ liệu.',
  ],
  loiHayGap: ['Ghi công nghệ (React, MySQL) trong tầm nhìn.', 'Nhãn luồng là động từ ("check in", "book").', 'Thiếu chiều ngược (mã đơn thuốc trả về, kết quả thanh toán).'],
  giaiThich: {
    en: `<p>The objectives turn the two pains of the case into measurable targets; the vision says who benefits and why, not how it is built; the out-of-scope list prevents scope creep later (Milestone 6 will test it). Reference context diagram:</p>${khoiThamChieu('luong', GIAI_CTX, 'Context diagram — ClinicCare')}`,
    vi: `<p>Mục tiêu biến hai "nỗi đau" của đề thành chỉ tiêu đo được; tầm nhìn nói ai được lợi và vì sao, không nói làm bằng gì; danh sách ngoài phạm vi chặn phình phạm vi về sau (mốc 6 sẽ thử điều này). Sơ đồ ngữ cảnh tham chiếu:</p>${khoiThamChieu('luong', GIAI_CTX, 'Sơ đồ ngữ cảnh — ClinicCare')}`,
  },
  khaiNiem: ['business objectives', 'vision statement', 'scope', 'context diagram'],
  tienQuyet: ['SWR302 lessons 2.4–2.6 (Ch.5)'],
  thuatNgu: tn('businessReq', 'visionScope', 'scope', 'contextDiagram', 'externalEntity', 'dataFlow'),
  moTaNgan: 'Dự án ClinicCare mốc 1: mục tiêu, tầm nhìn, phạm vi, sơ đồ ngữ cảnh.',
  phut: 60,
  tep: TEP,
  kiem: KIEM,
  boYeu: [{ ten: 'mục tiêu mơ hồ, thiếu thực thể, vẽ DB', tep: {
    'answers/a-objectives.js': "const BUSINESS_OBJECTIVES = ['Improve patient satisfaction.', 'Make booking easier for everyone.', 'Reduce no-shows a lot.'];\n",
    'answers/d-context.js': "const CONTEXT_DIAGRAM = `\nflowchart LR\n  S((ClinicCare))\n  DB[(Database)]\n  PT[Patient] -->|book appointment| S\n  S -->|confirmation| PT\n  DR[Doctor] -->|slot schedule| S\n  S --> DB\n`;\n",
  } }],
});

mod.de.push(phongVan({
  moc: 'vision and scope',
  khaiNiem: ['business objectives', 'scope'],
  thuatNgu: tn('businessReq', 'scopeCreep', 'contextDiagram'),
  cau: [
    { en: 'Interviewer: "How do you write a good business objective?" Best answer:', vi: 'Nhà tuyển dụng: "Bạn viết mục tiêu nghiệp vụ tốt thế nào?" Trả lời tốt nhất:', lc: [['a', '"I make it measurable and time-bound from a baseline — on ClinicCare: cut reception calls from about 120 to 70 a day within 6 months — so we can tell after release whether the project paid off."'], ['b', '"I write what the customer wants, for example a modern app."'], ['c', '"I list all the features."'], ['d', '"Business objectives are the manager’s job, not the BA’s."']], dap: 'a', giai: ['Baseline + target + deadline, tied to a real problem.', 'Mốc gốc + chỉ tiêu + thời hạn, gắn với vấn đề thật.'] },
    { en: '"In the kick-off the owner adds: ‘and video consultation too’. What do you do?"', vi: '"Buổi kick-off chủ phòng khám thêm: ‘có cả khám video nữa’. Bạn làm gì?"', lc: [['a', '"I check it against the objectives and the agreed scope; I record it and ask the sponsor to decide — in release 1, defer to a later release, or out — and update the scope document."'], ['b', '"I add it immediately — the customer is always right."'], ['c', '"I refuse — it is not in my document."'], ['d', '"I let the developers decide."']], dap: 'a', giai: ['Scope decisions are explicit, documented and made by the right person.', 'Quyết định phạm vi phải tường minh, có ghi lại, do đúng người quyết.'] },
    { en: '"Why draw a context diagram early?"', vi: '"Vì sao vẽ sơ đồ ngữ cảnh từ sớm?"', lc: [['a', '"It fixes the system boundary and shows every external party and interface — on ClinicCare it revealed the national e-prescription system, which we must integrate by law."'], ['b', '"Because the template has a page for it."'], ['c', '"To design the database."'], ['d', '"To show the internal modules."']], dap: 'a', giai: ['Boundary + external interfaces + missing parties.', 'Biên hệ thống + giao diện ngoài + bên còn thiếu.'] },
    { en: '"Who is ‘the customer’ on this project?"', vi: '"Ai là ‘khách hàng’ trong dự án này?"', lc: [['a', '"Several stakeholders: the owner as sponsor who decides, and user classes — patients, doctors, receptionists, pharmacist, manager — each represented by a product champion."'], ['b', '"Only the person who pays."'], ['c', '"Only the patients."'], ['d', '"The development team."']], dap: 'a', giai: ['Sponsor + user classes + product champions (Wiegers Ch.2, Ch.6).', 'Nhà tài trợ + lớp người dùng + product champion.'] },
  ],
}));

export default mod;
