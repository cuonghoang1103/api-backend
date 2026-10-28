/**
 * SWR302 · LAB 2 — The customer, vision and scope: ParkSmart campus parking (Wiegers Ch.2, 5, 6).
 * A. mục của tài liệu Vision & Scope · B. mục tiêu nghiệp vụ SMART · C. tuyên bố tầm nhìn (khuôn Moore) ·
 * D. lưới quyền lực–quan tâm + lớp người dùng ưu tiên/không mong muốn/bỏ qua · E. quyền & trách nhiệm của khách hàng.
 */
import { tn, kiemTuy, kiemKhoa, bangHtml } from './_chung.mjs';
import { deLon, kiemBang, objDong, objTrong } from './_lab.mjs';

const MUC_VS = [
  ['1.1', 'Background'], ['1.2', 'Business opportunity'], ['1.3', 'Business objectives'], ['1.4', 'Success metrics'], ['1.5', 'Vision statement'],
  ['1.6', 'Business risks'], ['1.7', 'Business assumptions and dependencies'], ['2.1', 'Major features'], ['2.2', 'Scope of initial release'],
  ['2.3', 'Scope of subsequent releases'], ['2.4', 'Limitations and exclusions'], ['3.1', 'Stakeholder profiles'], ['3.2', 'Project priorities'], ['3.3', 'Deployment considerations'],
];
const CAU = [
  ['S1', 'At 8 am drivers spend 12 minutes on average looking for a space, and guards check 4,000 paper permits by hand.', '1.1'],
  ['S2', 'Occupancy sensors and plate cameras have become cheap enough to equip all 1,200 spaces for about 2 billion VND.', '1.2'],
  ['S3', 'Reduce the average time to find a space at 8 am from 12 to 4 minutes by June 2027.', '1.3'],
  ['S4', 'In the first semester, 70% of permit holders open the app at least three times per week.', '1.4'],
  ['S5', 'Heavy rain may disturb the sensors and make the occupancy data unreliable.', '1.6'],
  ['S6', 'University IT will provide single sign-on before go-live.', '1.7'],
  ['S7', 'Real-time free-space map; space reservation for staff; plate-based access instead of paper permits; online permit payment.', '2.1'],
  ['S8', 'Release 1: the free-space map and plate-based access for car parks A and B.', '2.2'],
  ['S9', 'Release 2 adds reservation for staff and the four remaining car parks.', '2.3'],
  ['S10', 'ParkSmart will not handle motorbike parking, which stays with the current card system.', '2.4'],
  ['S11', 'The Rector cares mainly about the public image and expects no complaints in the press.', '3.1'],
  ['S12', 'The go-live date before the 2027 intake is fixed; the set of features is the degree of freedom.', '3.2'],
  ['S13', 'Sensors must be installed during the summer break, when the car parks are empty.', '3.3'],
];
const MUC_TIEU = [
  ['a', 'Improve the parking experience on campus.'],
  ['b', 'Make parking smarter with AI.'],
  ['c', 'Reduce the average time to find a space at 8 am from 12 to 4 minutes by June 2027.'],
  ['d', 'Use the latest IoT occupancy sensors in every car park.'],
];
const BEN = [
  ['K1', 'Director of Facilities (the sponsor)', 5, 5, 'MANAGE_CLOSELY'],
  ['K2', 'University Rector', 5, 2, 'KEEP_SATISFIED'],
  ['K3', 'Students with a parking permit', 2, 5, 'KEEP_INFORMED'],
  ['K4', 'Campus security guards', 2, 4, 'KEEP_INFORMED'],
  ['K5', 'City traffic police', 4, 1, 'KEEP_SATISFIED'],
  ['K6', 'Delivery drivers of the canteen suppliers', 1, 2, 'MONITOR'],
  ['K7', 'Sensor vendor', 3, 4, 'KEEP_INFORMED'],
];
const LOP = [
  ['U1', 'Staff and students with a valid permit — the product exists for them.', 'FAVORED'],
  ['U2', 'Drivers who try to enter with a cloned or borrowed permit.', 'DISFAVORED'],
  ['U3', 'Tourists who drive onto campus on open days — the university decided to build nothing for them in release 1.', 'IGNORED'],
];
const QUYEN = [
  ['E1', 'The BA keeps using UML jargon with the facilities staff, who ask to be spoken to in their own terms.', 'RIGHT_1'],
  ['E2', 'The facilities team takes three weeks to decide whether visitors may reserve spaces, and development is blocked.', 'RESP_4'],
  ['E3', 'The sponsor insists that every feature is "high priority".', 'RESP_6'],
  ['E4', 'Developers estimate plate recognition at 6 weeks; the sponsor says, without a reason, that it cannot take more than 3 days.', 'RESP_5'],
  ['E5', 'The guards ask why the BA wants them to review the SRS and what they will get out of it.', 'RIGHT_4'],
  ['E6', 'The BA proposes to reuse the university’s existing permit-payment module to deliver release 1 sooner.', 'RIGHT_9'],
  ['E7', 'A student says "the first screen must show the free spaces of my car park" instead of "make it easy".', 'RESP_3'],
  ['E8', 'The product champion reviews the SRS draft and tries the clickable prototype before the baseline.', 'RESP_7'],
];
const QUYEN_DS = ['RIGHT_1 speak your language', 'RIGHT_2 learn your business', 'RIGHT_3 record requirements appropriately', 'RIGHT_4 explanations of practices & deliverables', 'RIGHT_5 change your requirements', 'RIGHT_6 mutual respect', 'RIGHT_7 hear ideas & alternatives', 'RIGHT_8 describe usability characteristics', 'RIGHT_9 hear reuse options', 'RIGHT_10 a system that meets your needs'];
const TRACH_DS = ['RESP_1 educate BAs about your business', 'RESP_2 dedicate the time', 'RESP_3 be specific and precise', 'RESP_4 make timely decisions', 'RESP_5 respect cost & feasibility assessments', 'RESP_6 set realistic priorities', 'RESP_7 review requirements & evaluate prototypes', 'RESP_8 establish acceptance criteria', 'RESP_9 promptly communicate changes', 'RESP_10 respect the requirements process'];

const GIAI_VISION = {
  forWho: 'staff and students who drive to campus',
  who: 'waste time every morning looking for a free parking space',
  productName: 'ParkSmart',
  isA: 'campus parking app and access system',
  that: 'shows free spaces in real time and lets permit holders enter by their licence plate',
  unlike: 'today’s practice of driving around the car parks and showing paper permits to guards',
  ourProduct: 'uses occupancy sensors and plate cameras to guide each driver straight to a free space',
};

const KIEM = [
  ...kiemBang('VS_SECTIONS', Object.fromEntries(CAU.map((x) => [x[0], x[2]])), { nhom: 'f1', an: ['S12', 'S13'], ten: (k) => `A — Vision & Scope section of ${k}`, tenVi: (k) => `A — mục Vision & Scope của ${k}`, goiY: { S2: 'why NOW is the moment to build it', S4: 'how we will know the objective is reached, in numbers', S5: 'something that could make the project fail', S12: 'which of schedule, features, cost, quality is fixed and which is free' } }),
  ...kiemKhoa([
    { moTa: { en: 'B — the best-written business objective', vi: 'B — mục tiêu nghiệp vụ viết tốt nhất' }, bieuThuc: 'OBJECTIVES.best', chap: ['c'], nhom: 'f2', goiY: 'Specific, Measurable, Attainable, Relevant, Time-bound' },
    { moTa: { en: 'B — the candidate that is a solution, not an objective', vi: 'B — phương án là giải pháp, không phải mục tiêu' }, bieuThuc: 'OBJECTIVES.solutionNotObjective', chap: ['d'], nhom: 'f2' },
  ]),
  kiemTuy({ en: 'C — the vision statement fills every part of the Moore template', vi: 'C — tuyên bố tầm nhìn điền đủ mọi phần của khuôn Moore' }, function () {
    if (typeof VISION === 'undefined' || !VISION) return 'VISION is missing';
    var can = ['forWho', 'who', 'productName', 'isA', 'that', 'unlike', 'ourProduct'];
    for (var i = 0; i < can.length; i++) if (String(VISION[can[i]] || '').trim().split(/\s+/).length < (can[i] === 'productName' ? 1 : 3)) return 'part "' + can[i] + '" is empty or too short';
    return String(VISION.productName).trim().toLowerCase() === 'parksmart' ? 'OK' : 'productName is the name of the product: ParkSmart';
  }, { nhom: 'f3' }),
  kiemTuy({ en: 'C — the parts say the right things: target users, their need, the key benefit, today’s alternative, the difference', vi: 'C — các phần nói đúng: người dùng đích, nhu cầu, lợi ích chính, phương án hiện tại, khác biệt' }, function () {
    if (typeof VISION === 'undefined' || !VISION) return 'VISION is missing';
    var t = function (k) { return String(VISION[k] || '').toLowerCase(); };
    if (!/staff|student|driver|permit holder/.test(t('forWho'))) return 'forWho: the target customers — staff and students who drive to campus';
    if (!/space|park|time|minute|search|look/.test(t('who'))) return 'who: their need or opportunity — finding a parking space';
    if (!/free|real[- ]time|available|space/.test(t('that'))) return 'that: the key benefit — free spaces shown in real time';
    if (!/paper|guard|driv|circl|today|current|manual/.test(t('unlike'))) return 'unlike: the current alternative — driving around, paper permits checked by guards';
    if (!/sensor|camera|plate|real[- ]time|guide/.test(t('ourProduct'))) return 'ourProduct: the primary differentiation — sensors and plate cameras';
    return 'OK';
  }, { nhom: 'f3' }),
  ...kiemBang('STAKEHOLDER_GRID', Object.fromEntries(BEN.map((x) => [x[0], x[4]])), { nhom: 'f4', an: ['K7'], ten: (k) => `D — grid quadrant of ${k}`, tenVi: (k) => `D — ô lưới của ${k}`, goiY: { K7: 'power 3 is NOT high (high = 4 or 5)' } }),
  ...kiemBang('USER_CLASSES', Object.fromEntries(LOP.map((x) => [x[0], x[2]])), { nhom: 'f4', ten: (k) => `D — kind of user class ${k}`, tenVi: (k) => `D — loại lớp người dùng ${k}` }),
  ...kiemBang('RIGHTS', Object.fromEntries(QUYEN.map((x) => [x[0], x[2]])), { nhom: 'f5', an: ['E8'], ten: (k) => `E — right or responsibility in ${k}`, tenVi: (k) => `E — quyền hay trách nhiệm trong ${k}` }),
];

const TEP = {
  'answers/a-vs-sections.js': [`// A. Section numbers of the Vision & Scope template: ${MUC_VS.map((m) => m[0]).join(' | ')}\n${objTrong('VS_SECTIONS', Object.fromEntries(CAU.map((x) => [x[0], ''])))}`, `// A. 1 = business requirements, 2 = scope and limitations, 3 = business context.\n${objDong('VS_SECTIONS', Object.fromEntries(CAU.map((x) => [x[0], x[2]])))}`],
  'answers/b-objectives.js': ["// B. Letters a–d.\nconst OBJECTIVES = { best: '', solutionNotObjective: '' };\n", "// B. (c) is specific, measurable, time-bound; (d) names a technology, not a business outcome.\nconst OBJECTIVES = { best: 'c', solutionNotObjective: 'd' };\n"],
  'answers/c-vision.js': [
    "// C. Moore template: For <forWho> who <who>, the <productName> is a <isA> that <that>. Unlike <unlike>, our product <ourProduct>.\nconst VISION = { forWho: '', who: '', productName: '', isA: '', that: '', unlike: '', ourProduct: '' };\n",
    `// C. "For staff and students who drive to campus who waste time … , the ParkSmart is a campus parking app … that … . Unlike …, our product …"\n${objDong('VISION', GIAI_VISION)}`,
  ],
  'answers/d-stakeholders.js': [
    `// D. Grid: MANAGE_CLOSELY | KEEP_SATISFIED | KEEP_INFORMED | MONITOR — user classes: FAVORED | DISFAVORED | IGNORED\n${objTrong('STAKEHOLDER_GRID', Object.fromEntries(BEN.map((x) => [x[0], ''])))}${objTrong('USER_CLASSES', Object.fromEntries(LOP.map((x) => [x[0], ''])))}`,
    `// D. High = 4 or 5. High power + high interest = manage closely; high power only = keep satisfied; high interest only = keep informed.\n${objDong('STAKEHOLDER_GRID', Object.fromEntries(BEN.map((x) => [x[0], x[4]])))}${objDong('USER_CLASSES', Object.fromEntries(LOP.map((x) => [x[0], x[2]])))}`,
  ],
  'answers/e-rights.js': [`// E. RIGHT_1 … RIGHT_10 | RESP_1 … RESP_10 (see the lists in the brief)\n${objTrong('RIGHTS', Object.fromEntries(QUYEN.map((x) => [x[0], ''])))}`, `// E. Wiegers Ch.2: the customer's Requirements Bill of Rights and Bill of Responsibilities.\n${objDong('RIGHTS', Object.fromEntries(QUYEN.map((x) => [x[0], x[2]])))}`],
};

const ds = (xs) => `<ul>${xs.map((x) => `<li><b>${x[0]}</b> — ${x[1]}</li>`).join('')}</ul>`;

export default deLon({
  slug: 'swr302-2-lab-vision-scope-parksmart',
  ten: 'Lab 2 — Customer, Vision & Scope: ParkSmart Campus Parking',
  moTaModule: 'Lab chương 2: xếp 13 phát biểu vào mục tài liệu Vision & Scope, chọn mục tiêu nghiệp vụ SMART, viết tuyên bố tầm nhìn theo khuôn Moore, lưới quyền lực–quan tâm và lớp người dùng ưu tiên/không mong muốn/bỏ qua, quyền và trách nhiệm của khách hàng.',
  baiHoc: 'swr302-2-1-stakeholder-user-class',
  tieuDe: 'Lab 2 — Customer, Vision & Scope: ParkSmart Campus Parking',
  phu: { en: 'Chapter 2 lab · vision and scope document, business objectives, vision statement, stakeholders and user classes, customer rights and responsibilities · 10 marks', vi: 'Lab chương 2 · tài liệu tầm nhìn & phạm vi, mục tiêu nghiệp vụ, tuyên bố tầm nhìn, bên liên quan và lớp người dùng, quyền & trách nhiệm khách hàng · 10 điểm' },
  moTa: {
    en: `<p>The campus has 1,200 parking spaces for 4,000 permit holders. The Director of Facilities sponsors <b>ParkSmart</b>: occupancy sensors on every space, a real-time free-space map in an app, staff reservation, licence-plate cameras instead of paper permits, and online payment of permits. You are drafting the Vision &amp; Scope document.</p>
<p><b>A. Statements to place</b> (template sections: ${MUC_VS.map((m) => `<code>${m[0]}</code> ${m[1]}`).join(' · ')}):</p>${ds(CAU)}
<p><b>B. Candidate business objectives</b>:</p>${ds(MUC_TIEU)}
<p><b>C.</b> Write the vision statement of ParkSmart with Geoffrey Moore's template: <i>For</i> [target customers] <i>who</i> [need or opportunity], <i>the</i> [product name] <i>is a</i> [product category] <i>that</i> [key benefit]. <i>Unlike</i> [current alternative], <i>our product</i> [primary differentiation].</p>
<p><b>D. Stakeholders</b> (power, interest from 1 to 5; high = 4 or 5):</p>${bangHtml(['ID', 'Stakeholder', 'Power', 'Interest'], BEN.map((x) => [x[0], x[1], String(x[2]), String(x[3])]))}<p>User classes:</p>${ds(LOP)}
<p><b>E. Situations</b> — which customer right or responsibility (Wiegers Ch.2) is at stake?</p>${ds(QUYEN)}<p>Rights: ${QUYEN_DS.join(' · ')}.<br>Responsibilities: ${TRACH_DS.join(' · ')}.</p>`,
    vi: `<p>Khuôn viên có 1.200 chỗ đỗ cho 4.000 người có thẻ gửi xe. Giám đốc Cơ sở vật chất tài trợ <b>ParkSmart</b>: cảm biến ở từng chỗ, bản đồ chỗ trống thời gian thực trong app, cán bộ đặt chỗ trước, camera biển số thay thẻ giấy, trả phí thẻ trực tuyến. Bạn đang soạn tài liệu Vision &amp; Scope.</p>
<p><b>A.</b> Xếp 13 phát biểu S1–S13 vào mục của template. <b>B.</b> Bốn mục tiêu ứng viên a–d. <b>C.</b> Viết tuyên bố tầm nhìn theo khuôn Moore. <b>D.</b> Bảy bên liên quan trên lưới quyền lực–quan tâm (cao = 4 hoặc 5) và ba lớp người dùng. <b>E.</b> Tám tình huống E1–E8: quyền hay trách nhiệm nào của khách hàng (danh sách ở bản tiếng Anh)?</p>`,
  },
  chucNangChinh: [
    { en: 'A. Vision & Scope sections of 13 statements.', vi: 'A. Mục Vision & Scope của 13 phát biểu.' },
    { en: 'B. The SMART business objective.', vi: 'B. Mục tiêu nghiệp vụ SMART.' },
    { en: 'C. The vision statement.', vi: 'C. Tuyên bố tầm nhìn.' },
    { en: 'D. Stakeholder grid and user classes.', vi: 'D. Lưới bên liên quan và lớp người dùng.' },
    { en: 'E. Customer rights and responsibilities.', vi: 'E. Quyền và trách nhiệm của khách hàng.' },
  ],
  yeuCauChung: [{ en: 'Use exactly the allowed values listed in the data model.', vi: 'Dùng đúng giá trị cho phép trong mô hình dữ liệu.' }],
  cayThuMuc: `answers/
├── a-vs-sections.js    ← const VS_SECTIONS = { S1: '1.1', … }
├── b-objectives.js     ← const OBJECTIVES = { best, solutionNotObjective }
├── c-vision.js         ← const VISION = { forWho, who, productName, isA, that, unlike, ourProduct }
├── d-stakeholders.js   ← const STAKEHOLDER_GRID = { K1: '…' }; const USER_CLASSES = { U1: '…' }
└── e-rights.js         ← const RIGHTS = { E1: 'RIGHT_1' | 'RESP_4' | … }`,
  moHinh: {
    ten: 'Allowed values',
    truong: [
      ['VS_SECTIONS.*', 'string', { en: MUC_VS.map((m) => `${m[0]} ${m[1]}`).join(' · '), vi: 'số mục của template Vision & Scope' }],
      ['STAKEHOLDER_GRID.*', 'string', { en: 'MANAGE_CLOSELY · KEEP_SATISFIED · KEEP_INFORMED · MONITOR', vi: 'MANAGE_CLOSELY (quản lý sát) · KEEP_SATISFIED (giữ hài lòng) · KEEP_INFORMED (giữ thông tin) · MONITOR (theo dõi)' }],
      ['USER_CLASSES.*', 'string', { en: 'FAVORED · DISFAVORED · IGNORED', vi: 'FAVORED (ưu tiên) · DISFAVORED (không mong muốn) · IGNORED (bỏ qua)' }],
      ['RIGHTS.*', 'string', { en: 'RIGHT_1…RIGHT_10 · RESP_1…RESP_10', vi: 'RIGHT_1…RIGHT_10 · RESP_1…RESP_10' }],
    ],
  },
  chucNang: [
    { ten: { en: 'A. Vision & Scope template', vi: 'A. Template Vision & Scope' }, diem: 3, yeuCau: [{ en: 'Business requirements (1.x), scope and limitations (2.x), business context (3.x).', vi: 'Yêu cầu nghiệp vụ (1.x), phạm vi và giới hạn (2.x), bối cảnh nghiệp vụ (3.x).' }], hook: ['vision and scope document'] },
    { ten: { en: 'B. Business objectives', vi: 'B. Mục tiêu nghiệp vụ' }, diem: 1, yeuCau: [{ en: 'SMART; an objective is not a solution.', vi: 'SMART; mục tiêu không phải giải pháp.' }], hook: ['SMART'] },
    { ten: { en: 'C. Vision statement', vi: 'C. Tuyên bố tầm nhìn' }, diem: 2, yeuCau: [{ en: 'Every part of the Moore template, about ParkSmart.', vi: 'Đủ mọi phần khuôn Moore, nói về ParkSmart.' }], hook: ['vision statement'] },
    { ten: { en: 'D. Stakeholders and user classes', vi: 'D. Bên liên quan và lớp người dùng' }, diem: 2, yeuCau: [{ en: 'Power/interest quadrant; favored, disfavored, ignored user classes.', vi: 'Ô lưới quyền lực/quan tâm; lớp ưu tiên, không mong muốn, bỏ qua.' }], hook: ['stakeholder analysis', 'user class'] },
    { ten: { en: 'E. Rights and responsibilities', vi: 'E. Quyền và trách nhiệm' }, diem: 2, yeuCau: [{ en: 'The right or responsibility of the customer in each situation.', vi: 'Quyền hay trách nhiệm của khách hàng trong từng tình huống.' }], hook: ['Bill of Rights', 'Bill of Responsibilities'] },
  ],
  idBatBuoc: [['VS_SECTIONS', 'answers/a-vs-sections.js'], ['OBJECTIVES', 'answers/b-objectives.js'], ['VISION', 'answers/c-vision.js'], ['STAKEHOLDER_GRID · USER_CLASSES', 'answers/d-stakeholders.js'], ['RIGHTS', 'answers/e-rights.js']],
  truDiem: [
    { en: 'S4 placed under business objectives: it is a success metric — how we will know an objective is reached.', vi: 'Xếp S4 vào mục tiêu nghiệp vụ: nó là chỉ số thành công — cách biết mục tiêu đã đạt.' },
    { en: 'S6 (single sign-on from IT) placed under risks: it is something the project counts on — an assumption/dependency.', vi: 'Xếp S6 (SSO do IT cung cấp) vào rủi ro: đó là điều dự án trông cậy — giả định/phụ thuộc.' },
    { en: 'A vision statement listing features instead of the benefit and the difference.', vi: 'Tuyên bố tầm nhìn liệt kê tính năng thay vì lợi ích và khác biệt.' },
  ],
  goiY: [
    'A: phần 1 trả lời VÌ SAO (bối cảnh, cơ hội, mục tiêu, chỉ số, tầm nhìn, rủi ro, giả định); phần 2 trả lời LÀM GÌ, KHÔNG LÀM GÌ, theo bản nào; phần 3 nói về NGƯỜI, ƯU TIÊN dự án và TRIỂN KHAI.',
    'D: "cao" = 4 hoặc 5. Quyền lực cao + quan tâm cao ⇒ quản lý sát; chỉ quyền lực cao ⇒ giữ hài lòng; chỉ quan tâm cao ⇒ giữ thông tin; cả hai thấp ⇒ theo dõi.',
    'E: quyền (RIGHT_x) là điều khách hàng được KỲ VỌNG từ BA/đội; trách nhiệm (RESP_x) là điều khách hàng PHẢI làm.',
  ],
  loiHayGap: [
    'Coi "Use the latest IoT sensors" là mục tiêu nghiệp vụ.',
    'Xếp K7 (quyền lực 3) vào KEEP_SATISFIED/MANAGE_CLOSELY — 3 chưa phải cao.',
    'Coi E6 là RIGHT_7 (ý tưởng và phương án): E6 nói cụ thể về TÁI SỬ DỤNG để giao nhanh hơn ⇒ RIGHT_9.',
  ],
  giaiThich: {
    en: `<p><b>A.</b> ${CAU.map((x) => `${x[0]} ${x[2]}`).join(' · ')}. <b>B.</b> (c) is specific, measurable and time-bound; (d) names a technology. <b>C.</b> See the solution file — target users, their need, the key benefit, today's alternative and the difference, all about ParkSmart. <b>D.</b> ${BEN.map((x) => `${x[0]} ${x[4]}`).join(' · ')}; ${LOP.map((x) => `${x[0]} ${x[2]}`).join(' · ')}. <b>E.</b> ${QUYEN.map((x) => `${x[0]} ${x[2]}`).join(' · ')}.</p>`,
    vi: `<p><b>A.</b> ${CAU.map((x) => `${x[0]} ${x[2]}`).join(' · ')}. <b>B.</b> (c) cụ thể, đo được, có hạn; (d) nêu một công nghệ. <b>C.</b> Xem tệp lời giải. <b>D.</b> ${BEN.map((x) => `${x[0]} ${x[4]}`).join(' · ')}; ${LOP.map((x) => `${x[0]} ${x[2]}`).join(' · ')}. <b>E.</b> ${QUYEN.map((x) => `${x[0]} ${x[2]}`).join(' · ')}.</p>`,
  },
  khaiNiem: ['vision and scope', 'business objectives', 'vision statement', 'stakeholder analysis', 'user classes', 'customer rights and responsibilities'],
  tienQuyet: ['SWR302 Chapter 2, book Ch.5–6'],
  thuatNgu: [...tn('visionScope', 'businessReq', 'scope', 'stakeholder', 'userClass', 'productChampion'), { en: 'success metric', vi: 'chỉ số thành công — số đo cho biết mục tiêu đã đạt' }, { en: 'business risk / assumption', vi: 'rủi ro nghiệp vụ / giả định (điều dự án trông cậy là đúng)' }, { en: 'SMART', vi: 'Specific · Measurable · Attainable · Relevant · Time-bound' }],
  moTaNgan: 'Lab chương 2: ParkSmart — Vision & Scope, SMART, tuyên bố tầm nhìn, bên liên quan, quyền & trách nhiệm.',
  phut: 50,
  tep: TEP,
  kiem: KIEM,
  boYeu: [
    { ten: 'tầm nhìn liệt kê tính năng', tep: { 'answers/c-vision.js': "const VISION = { forWho: 'everyone in the world', who: 'like technology a lot', productName: 'Smart Parking App', isA: 'mobile app with AI', that: 'has a map, reservation, payment and cameras', unlike: 'other apps on the store', ourProduct: 'has many features and AI' };\n" }, phaiTruot: ['vision statement fills every part', 'the parts say the right things'] },
    { ten: 'S4 là mục tiêu, S6 là rủi ro, K7 giữ hài lòng', tep: { 'answers/a-vs-sections.js': objDong('VS_SECTIONS', { ...Object.fromEntries(CAU.map((x) => [x[0], x[2]])), S4: '1.3', S6: '1.6' }), 'answers/d-stakeholders.js': `${objDong('STAKEHOLDER_GRID', { ...Object.fromEntries(BEN.map((x) => [x[0], x[4]])), K7: 'KEEP_SATISFIED' })}${objDong('USER_CLASSES', Object.fromEntries(LOP.map((x) => [x[0], x[2]])))}` }, phaiTruot: ['section of S4', 'section of S6', 'quadrant of K7'] },
  ],
});
