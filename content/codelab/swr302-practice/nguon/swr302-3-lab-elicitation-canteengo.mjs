/**
 * SWR302 · LAB 3 — Elicitation: CanteenGo pre-order canteen (Wiegers Ch.7).
 * A. chọn kỹ thuật khai thác · B. việc nào thuộc pha chuẩn bị / thực hiện / theo dõi · C. phân loại 12 câu đầu vào khách hàng
 * (9 loại) · D. câu hỏi mở / đóng / dẫn dắt · E. dấu hiệu khai thác đã gần xong.
 */
import { tn, kiemKhoa } from './_chung.mjs';
import { deLon, kiemBang, objDong, objTrong } from './_lab.mjs';

const KT = ['Interview', 'Workshop', 'Focus group', 'Observation', 'Questionnaire', 'System interface analysis', 'User interface analysis', 'Document analysis', 'Prototyping'];
const TINH_HUONG = [
  ['S1', 'Learn how the 12 cooks really work during the lunch rush — when asked, they only say "we just do it".', 'Observation'],
  ['S2', 'Collect the preferences of 6,000 students about payment methods and pick-up times.', 'Questionnaire'],
  ['S3', 'CanteenGo must exchange menus and stock levels with the supplier ordering system, whose API is documented.', 'System interface analysis'],
  ['S4', 'Students cannot describe what a good pre-order screen looks like; they need something to react to.', 'Prototyping'],
  ['S5', 'Get the canteen manager, the finance officer, IT and two student representatives to agree on the scope of release 1 in one day.', 'Workshop'],
  ['S6', 'The university food-safety regulation (40 pages) defines how allergens must be labelled.', 'Document analysis'],
  ['S7', 'Eight international students discuss together what they expect from halal and vegetarian menus.', 'Focus group'],
  ['S8', 'Understand in depth the goals of the canteen manager and what goes wrong with today’s cash system.', 'Interview'],
  ['S9', 'The current cashier app has refund screens that nobody ever documented.', 'User interface analysis'],
];
const PHA = ['PREPARE', 'PERFORM', 'FOLLOW_UP'];
const VIEC = [
  ['T1', 'Define the scope and the agenda of the session', 'PREPARE'],
  ['T2', 'Learn about the participants and prepare the questions and a straw-man model', 'PREPARE'],
  ['T3', 'Keep the discussion inside the scope of the session and park off-topic ideas', 'PERFORM'],
  ['T4', 'Take notes of what is said, decided and left open', 'PERFORM'],
  ['T5', 'Organise and share the notes with the participants within a day', 'FOLLOW_UP'],
  ['T6', 'Record open issues (TBDs) with an owner and a due date', 'FOLLOW_UP'],
  ['T7', 'Classify the customer input into requirement types', 'FOLLOW_UP'],
  ['T8', 'Send the invitation with the goal of the session and the materials to read', 'PREPARE'],
];
const LOAI = ['Business requirement', 'User requirement', 'Business rule', 'Functional requirement', 'Quality attribute', 'External interface', 'Constraint', 'Data requirement', 'Solution idea'];
const CAU = [
  ['C1', 'Manager: "We want to cut the lunch-time queue by half before the end of the semester."', 'Business requirement'],
  ['C2', 'Student: "I need to order my lunch before class and pick it up at 12:10."', 'User requirement'],
  ['C3', 'Manager: "Any dish containing peanuts must carry an allergen warning — that is the university food-safety rule."', 'Business rule'],
  ['C4', 'Cook: "When an order is paid, the kitchen screen shows it in the queue of its pick-up time."', 'Functional requirement'],
  ['C5', 'IT: "The menu page has to load in under 2 seconds even when 1,000 students open it at 11:55."', 'Quality attribute'],
  ['C6', 'Finance: "It must take payments from the campus e-wallet through the wallet’s existing API."', 'External interface'],
  ['C7', 'IT: "Everything has to run on the university’s Azure tenancy."', 'Constraint'],
  ['C8', 'Cook: "Each order line has a dish, a quantity from 1 to 5 and an optional note of at most 100 characters."', 'Data requirement'],
  ['C9', 'Student: "Put a big red Pay now button at the top of every screen."', 'Solution idea'],
  ['C10', 'Manager: "A student who does not pick up an order three times loses pre-ordering for a week."', 'Business rule'],
  ['C11', 'Student: "I want to see which dishes are sold out before I choose."', 'User requirement'],
  ['C12', 'Finance: "We expect canteen revenue to grow 15% once students stop buying from the shops outside the gate."', 'Business requirement'],
];
const HOI = [
  ['Q1', 'What happens in the kitchen during the lunch rush?', 'OPEN'],
  ['Q2', 'Do students pay by cash or by card?', 'CLOSED'],
  ['Q3', 'You would like a mobile app, wouldn’t you?', 'LEADING'],
  ['Q4', 'Can you walk me through how you handle a refund today?', 'OPEN'],
  ['Q5', 'Isn’t the cash register the real reason for the queue?', 'LEADING'],
  ['Q6', 'How many orders do you serve between 12:00 and 12:15?', 'CLOSED'],
];
const DAU_HIEU = [
  ['a', 'The users cannot think of any more use cases.'],
  ['b', 'The project has used all of its elicitation budget.'],
  ['c', 'New scenarios turn out to be variations of use cases already captured.'],
  ['d', 'The sponsor says the deadline is close.'],
  ['e', 'New ideas raised are out of scope or have low priority and could come in a later release.'],
  ['f', 'The SRS template has a requirement in every section.'],
];
const DUNG_DH = ['a', 'c', 'e'];

const dap = (ds) => Object.fromEntries(ds.map((x) => [x[0], x[2]]));
const KIEM = [
  ...kiemBang('TECHNIQUES', dap(TINH_HUONG), { nhom: 'f1', an: ['S9'], ten: (k) => `A — technique for ${k}`, tenVi: (k) => `A — kỹ thuật cho ${k}`, goiY: { S1: 'people cannot always explain what they do — watch them', S3: 'look at the other system, not at people', S9: 'the evidence is in an existing screen' } }),
  ...kiemBang('PHASES', dap(VIEC), { nhom: 'f2', an: ['T8'], ten: (k) => `B — phase of ${k}`, tenVi: (k) => `B — pha của ${k}` }),
  ...kiemBang('INPUT_TYPES', { ...dap(CAU) }, { nhom: 'f3', an: ['C11', 'C12'], ten: (k) => `C — type of ${k}`, tenVi: (k) => `C — loại của ${k}`, goiY: { C1: 'WHY the organisation wants the system', C4: 'what the SYSTEM does in a condition', C7: 'it limits the design choices', C9: 'a design idea hiding a real need', C10: 'a policy that exists outside the software' } }),
  ...kiemBang('QUESTIONS', dap(HOI), { nhom: 'f4', ten: (k) => `D — kind of question ${k}`, tenVi: (k) => `D — loại câu hỏi ${k}` }),
  ...kiemKhoa([
    { moTa: { en: 'E — the signals that elicitation is nearly done', vi: 'E — các dấu hiệu khai thác sắp xong' }, bieuThuc: '(DONE_SIGNALS || []).map(String)', chap: [DUNG_DH], kieu: 'tap', nhom: 'f5', goiY: 'budget and deadline are project pressures, not evidence of completeness' },
    { moTa: { en: 'E — the real need behind C9 (the "big red Pay now button")', vi: 'E — nhu cầu thật sau C9 ("nút Pay now đỏ to")' }, bieuThuc: 'REAL_NEED_C9', chap: ['PAY_QUICKLY'], nhom: 'f5', an: true, goiY: 'ask "why?" — what does the student want to achieve with that button?' },
  ]),
];

const TEP = {
  'answers/a-techniques.js': [`// A. Allowed values: ${KT.join(' | ')}\n${objTrong('TECHNIQUES', dap(TINH_HUONG))}`, `// A. Watch what people cannot explain; ask many people the same thing with a questionnaire; read systems and documents.\n${objDong('TECHNIQUES', dap(TINH_HUONG))}`],
  'answers/b-phases.js': [`// B. Allowed values: ${PHA.join(' | ')}\n${objTrong('PHASES', dap(VIEC))}`, `// B. Prepare (scope, agenda, participants, questions, invitation) → perform (facilitate, stay in scope, take notes) → follow up (notes, open issues, classify input).\n${objDong('PHASES', dap(VIEC))}`],
  'answers/c-input-types.js': [`// C. Allowed values: ${LOAI.join(' | ')}\n${objTrong('INPUT_TYPES', dap(CAU))}`, `// C. Wiegers Ch.7 "classifying customer input" — the nine buckets.\n${objDong('INPUT_TYPES', dap(CAU), { C1: 'business objective (why)', C2: 'a user task', C3: 'a policy outside the software', C4: 'system behaviour', C5: 'performance — measurable', C6: 'connection to another system', C7: 'limits design choices', C8: 'data definition', C9: 'design idea — ask why', C10: 'policy', C11: 'a user goal', C12: 'business objective' })}`],
  'answers/d-questions.js': [`// D. Allowed values: OPEN | CLOSED | LEADING\n${objTrong('QUESTIONS', dap(HOI))}`, `// D. Open = invites a description; closed = a fact or a choice; leading = suggests the answer the BA wants to hear.\n${objDong('QUESTIONS', dap(HOI))}`],
  'answers/e-done.js': [
    "// E. Letters of the signals that elicitation is nearly done; the real need behind C9.\nconst DONE_SIGNALS = [];\n// PAY_QUICKLY | RED_COLOUR | MORE_BUTTONS | BIGGER_SCREEN\nconst REAL_NEED_C9 = '';\n",
    "// E. Wiegers: no new use cases, new scenarios are variations, new ideas are out of scope or low priority. Budget and deadline are not evidence.\nconst DONE_SIGNALS = ['a', 'c', 'e'];\n// The button is a solution idea; the need is to pay quickly from any screen.\nconst REAL_NEED_C9 = 'PAY_QUICKLY';\n",
  ],
};

const ds = (xs) => `<ul>${xs.map((x) => `<li><b>${x[0]}</b> — ${x[1]}</li>`).join('')}</ul>`;

export default deLon({
  slug: 'swr302-3-lab-elicitation-canteengo',
  ten: 'Lab 3 — Elicitation: CanteenGo Pre-Order Canteen',
  moTaModule: 'Lab chương 3: chọn kỹ thuật khai thác cho 9 tình huống, xếp việc vào pha chuẩn bị/thực hiện/theo dõi, phân loại 12 câu đầu vào khách hàng vào 9 loại của Wiegers, câu hỏi mở/đóng/dẫn dắt, dấu hiệu khai thác đã gần đủ.',
  baiHoc: 'swr302-3-1-ky-thuat-elicitation',
  tieuDe: 'Lab 3 — Elicitation: CanteenGo Pre-Order Canteen',
  phu: { en: 'Chapter 3 lab · elicitation techniques, the session lifecycle, classifying customer input, question types, knowing when you are done · 10 marks', vi: 'Lab chương 3 · kỹ thuật khai thác, vòng đời buổi khai thác, phân loại đầu vào khách hàng, loại câu hỏi, biết khi nào đủ · 10 điểm' },
  moTa: {
    en: `<p>The university canteen wants <b>CanteenGo</b>: students pre-order lunch, pay with the campus e-wallet and pick it up at a chosen time. You are the business analyst and must plan and run the elicitation.</p>
<p><b>A. Situations</b> — choose the most suitable technique for each:</p>${ds(TINH_HUONG)}
<p><b>B. Activities of one elicitation session</b>:</p>${ds(VIEC)}
<p><b>C. Notes from the first interviews</b> — classify each sentence:</p>${ds(CAU)}
<p><b>D. Questions the junior BA wrote</b>:</p>${ds(HOI)}
<p><b>E. Possible signals that elicitation is nearly done</b>:</p>${ds(DAU_HIEU)}`,
    vi: `<p>Căng-tin trường muốn có <b>CanteenGo</b>: sinh viên đặt trước bữa trưa, trả bằng ví điện tử của trường và nhận đồ ăn đúng giờ đã chọn. Bạn là BA, phải lập kế hoạch và tiến hành khai thác yêu cầu.</p>
<p><b>A.</b> Chín tình huống S1–S9 (bản tiếng Anh ở trên): quan sát đầu bếp giờ cao điểm · ý kiến 6.000 sinh viên · trao đổi dữ liệu với hệ thống đặt hàng của nhà cung cấp có API · sinh viên không tả được màn hình đặt trước · đưa quản lý, tài chính, IT, đại diện sinh viên đi tới thống nhất phạm vi trong một ngày · quy định an toàn thực phẩm 40 trang · 8 sinh viên quốc tế cùng bàn về thực đơn halal/chay · hiểu sâu mục tiêu của quản lý căng-tin · màn hình hoàn tiền của app thu ngân chưa ai viết tài liệu.</p>
<p><b>B.</b> Tám việc T1–T8 của một buổi khai thác — xếp vào pha CHUẨN BỊ / THỰC HIỆN / THEO DÕI.</p>
<p><b>C.</b> Mười hai câu C1–C12 từ các buổi phỏng vấn đầu — phân loại vào 9 loại đầu vào khách hàng (Wiegers Ch.7).</p>
<p><b>D.</b> Sáu câu hỏi Q1–Q6 BA mới viết — mở, đóng hay dẫn dắt?</p>
<p><b>E.</b> Sáu dấu hiệu a–f — dấu hiệu nào thật sự cho thấy khai thác sắp xong?</p>`,
  },
  chucNangChinh: [
    { en: 'A. Technique for each of 9 situations.', vi: 'A. Kỹ thuật cho 9 tình huống.' },
    { en: 'B. Phase of 8 session activities.', vi: 'B. Pha của 8 việc trong buổi khai thác.' },
    { en: 'C. Type of 12 pieces of customer input.', vi: 'C. Loại của 12 câu đầu vào khách hàng.' },
    { en: 'D. Kind of 6 questions.', vi: 'D. Loại của 6 câu hỏi.' },
    { en: 'E. Signals of completeness; the need behind a solution idea.', vi: 'E. Dấu hiệu đã đủ; nhu cầu thật sau một ý tưởng giải pháp.' },
  ],
  yeuCauChung: [{ en: 'Use exactly the allowed values listed in the data model (spelling matters, case does not).', vi: 'Dùng đúng giá trị cho phép trong mô hình dữ liệu (đúng chính tả, không phân biệt hoa thường).' }],
  cayThuMuc: `answers/
├── a-techniques.js    ← const TECHNIQUES = { S1: '…', … }
├── b-phases.js        ← const PHASES = { T1: '…', … }
├── c-input-types.js   ← const INPUT_TYPES = { C1: '…', … }
├── d-questions.js     ← const QUESTIONS = { Q1: '…', … }
└── e-done.js          ← const DONE_SIGNALS = ['…']; const REAL_NEED_C9 = '…'`,
  moHinh: {
    ten: 'Allowed values',
    truong: [
      ['TECHNIQUES.*', 'string', { en: KT.join(' · '), vi: KT.join(' · ') }],
      ['PHASES.*', 'string', { en: PHA.join(' · '), vi: 'PREPARE (chuẩn bị) · PERFORM (thực hiện) · FOLLOW_UP (theo dõi)' }],
      ['INPUT_TYPES.*', 'string', { en: LOAI.join(' · '), vi: LOAI.join(' · ') }],
      ['QUESTIONS.*', 'string', { en: 'OPEN · CLOSED · LEADING', vi: 'OPEN (mở) · CLOSED (đóng) · LEADING (dẫn dắt)' }],
      ['DONE_SIGNALS · REAL_NEED_C9', 'string[] · string', { en: 'letters a–f · PAY_QUICKLY | RED_COLOUR | MORE_BUTTONS | BIGGER_SCREEN', vi: 'chữ a–f · một mã' }],
    ],
  },
  chucNang: [
    { ten: { en: 'A. Elicitation techniques', vi: 'A. Kỹ thuật khai thác' }, diem: 2.5, yeuCau: [{ en: 'The technique that fits who holds the knowledge and how many people there are.', vi: 'Kỹ thuật hợp với ai nắm tri thức và có bao nhiêu người.' }], hook: ['interview', 'workshop', 'observation', 'questionnaire', 'interface analysis'] },
    { ten: { en: 'B. Session lifecycle', vi: 'B. Vòng đời buổi khai thác' }, diem: 1.5, yeuCau: [{ en: 'Prepare → perform → follow up.', vi: 'Chuẩn bị → thực hiện → theo dõi.' }], hook: ['elicitation plan'] },
    { ten: { en: 'C. Classifying customer input', vi: 'C. Phân loại đầu vào khách hàng' }, diem: 3, yeuCau: [{ en: 'The nine buckets of Wiegers Ch.7.', vi: 'Chín nhóm của Wiegers Ch.7.' }], hook: ['business requirement', 'business rule', 'solution idea'] },
    { ten: { en: 'D. Question types', vi: 'D. Loại câu hỏi' }, diem: 1.5, yeuCau: [{ en: 'Open, closed, leading.', vi: 'Mở, đóng, dẫn dắt.' }], hook: ['interview questions'] },
    { ten: { en: 'E. Knowing when you are done', vi: 'E. Biết khi nào đủ' }, diem: 1.5, yeuCau: [{ en: 'Evidence of completeness, not project pressure; the need behind a solution idea.', vi: 'Bằng chứng đã đủ, không phải áp lực dự án; nhu cầu sau một ý tưởng giải pháp.' }], hook: ['finding missing requirements'] },
  ],
  idBatBuoc: [['TECHNIQUES', 'answers/a-techniques.js'], ['PHASES', 'answers/b-phases.js'], ['INPUT_TYPES', 'answers/c-input-types.js'], ['QUESTIONS', 'answers/d-questions.js'], ['DONE_SIGNALS · REAL_NEED_C9', 'answers/e-done.js']],
  truDiem: [
    { en: 'Interviewing the cooks about their own routine (S1): people describe what they think they do — observe instead.', vi: 'Phỏng vấn đầu bếp về thói quen của chính họ (S1): người ta tả cái họ NGHĨ mình làm — hãy quan sát.' },
    { en: 'C4 as a user requirement because a cook says it: it describes system behaviour in a condition ⇒ functional requirement.', vi: 'Xếp C4 là user requirement vì đầu bếp nói: nó tả hành vi hệ thống trong một điều kiện ⇒ functional requirement.' },
    { en: 'C9 as a functional requirement — it is a solution idea; ask "why" to find the need.', vi: 'Xếp C9 là functional requirement — đó là ý tưởng giải pháp; hỏi "vì sao" để tìm nhu cầu.' },
  ],
  goiY: [
    'A: tự hỏi "tri thức nằm ở đâu?" — trong đầu người (interview/workshop/focus group), trong việc họ làm (observation), trong hệ thống/tài liệu có sẵn (interface/document analysis), hay chưa ai biết cho tới khi thấy (prototyping).',
    'C: VÌ SAO tổ chức muốn (business) · NGƯỜI DÙNG cần làm gì (user) · HỆ THỐNG làm gì (functional) · chính sách ngoài phần mềm (business rule) · đo được (quality) · nối hệ thống khác (interface) · giới hạn thiết kế (constraint) · dữ liệu (data) · cách làm cụ thể (solution idea).',
  ],
  loiHayGap: [
    'Chọn Questionnaire cho S5 vì có nhiều người — S5 cần cả nhóm TỰ THỐNG NHẤT, đó là workshop.',
    'Xếp C5 là functional — có con số đo được ⇒ quality attribute (performance).',
    'Xếp C7 là quality attribute — "phải chạy trên Azure" giới hạn lựa chọn thiết kế ⇒ constraint.',
    'Chọn "đã hết ngân sách" làm dấu hiệu đủ yêu cầu.',
  ],
  giaiThich: {
    en: '<p><b>A.</b> Observation · Questionnaire · System interface analysis · Prototyping · Workshop · Document analysis · Focus group · Interview · User interface analysis. <b>B.</b> T1, T2, T8 prepare · T3, T4 perform · T5, T6, T7 follow up. <b>C.</b> Business · User · Business rule · Functional · Quality attribute · External interface · Constraint · Data · Solution idea · Business rule · User · Business. <b>D.</b> Open · Closed · Leading · Open · Leading · Closed. <b>E.</b> a, c, e — budget, deadline and a filled template say nothing about completeness; the red button hides the need to pay quickly from anywhere.</p>',
    vi: '<p><b>A.</b> Quan sát · Bảng hỏi · Phân tích giao diện hệ thống · Prototype · Workshop · Phân tích tài liệu · Focus group · Phỏng vấn · Phân tích giao diện người dùng. <b>B.</b> T1, T2, T8 chuẩn bị · T3, T4 thực hiện · T5, T6, T7 theo dõi. <b>C.</b> như bảng trên. <b>D.</b> Mở · Đóng · Dẫn dắt · Mở · Dẫn dắt · Đóng. <b>E.</b> a, c, e — ngân sách, hạn chót hay template đầy chữ không nói gì về độ đủ; nút đỏ che giấu nhu cầu trả tiền nhanh ở mọi nơi.</p>',
  },
  khaiNiem: ['elicitation techniques', 'classifying customer input', 'open vs closed questions', 'knowing when you are done'],
  tienQuyet: ['SWR302 lessons 3.1–3.6 (elicitation)'],
  thuatNgu: [...tn('elicitation', 'businessReq', 'userReq', 'functionalReq', 'qualityAttr', 'externalInterface', 'constraint', 'businessRule', 'tbd'), { en: 'solution idea', vi: 'ý tưởng giải pháp — người dùng nói CÁCH làm; BA phải hỏi "vì sao" để tìm nhu cầu thật' }, { en: 'leading question', vi: 'câu hỏi dẫn dắt — gợi sẵn câu trả lời BA muốn nghe' }, { en: 'straw-man model', vi: 'mô hình nháp đưa ra để người khác góp ý, sửa' }],
  moTaNgan: 'Lab chương 3: CanteenGo — kỹ thuật khai thác, pha, phân loại đầu vào, loại câu hỏi, dấu hiệu đủ.',
  phut: 45,
  tep: TEP,
  kiem: KIEM,
  boYeu: [
    { ten: 'phỏng vấn mọi thứ + nút đỏ là FR', tep: { 'answers/a-techniques.js': objDong('TECHNIQUES', Object.fromEntries(TINH_HUONG.map((x) => [x[0], 'Interview']))), 'answers/c-input-types.js': objDong('INPUT_TYPES', { ...dap(CAU), C9: 'Functional requirement', C7: 'Quality attribute' }) }, phaiTruot: ['technique for S1', 'type of C9', 'type of C7'] },
    { ten: 'chọn ngân sách/hạn chót làm dấu hiệu đủ', tep: { 'answers/e-done.js': "const DONE_SIGNALS = ['b', 'd', 'f'];\nconst REAL_NEED_C9 = 'RED_COLOUR';\n" }, phaiTruot: ['signals that elicitation is nearly done'] },
  ],
});
