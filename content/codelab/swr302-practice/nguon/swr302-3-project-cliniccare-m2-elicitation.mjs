/**
 * SWR302 · DỰ ÁN ClinicCare — Mốc 2 (chương 3): phân loại đầu vào khách hàng (9 nhóm Wiegers), kế hoạch khai thác, câu hỏi làm rõ + Interview corner.
 */
import { tn, kiemTuy, bangHtml } from './_chung.mjs';
import { deLon, kiemBang, objDong, objTrong } from './_lab.mjs';
import { BOI_CANH, phongVan } from './_cliniccare.mjs';

const NHOM = ['Business requirement', 'User requirement', 'Business rule', 'Functional requirement', 'Quality attribute', 'External interface requirement', 'Constraint', 'Data definition', 'Solution idea'];
const CAU = [
  ['T1', 'Owner', 'I want the phone calls to the desk cut by half before Tết.', 'Business requirement'],
  ['T2', 'Receptionist', 'I need to see at a glance which patients have arrived and who is late.', 'User requirement'],
  ['T3', 'Owner', 'A patient who missed three appointments in 90 days has to pay before booking.', 'Business rule'],
  ['T4', 'Receptionist', 'When I mark a no-show, the system should free that slot for a walk-in patient.', 'Functional requirement'],
  ['T5', 'Receptionist', 'The check-in screen must open in under two seconds — there is always a queue.', 'Quality attribute'],
  ['T6', 'Pharmacist', 'Every prescription has to go to the national e-prescription system in their XML format.', 'External interface requirement'],
  ['T7', 'IT contractor', 'It has to run on the Windows 10 PCs we already have at the desk.', 'Constraint'],
  ['T8', 'Receptionist', 'A booking code is the letter M followed by six digits.', 'Data definition'],
  ['T9', 'Doctor', 'Maybe put a big drop-down with all our photos at the top of the page?', 'Solution idea'],
  ['T10', 'Doctor', 'A doctor never sees more than 32 patients in one day.', 'Business rule'],
  ['T11', 'Patient', 'I want to book for my children too, not only for myself.', 'User requirement'],
  ['T12', 'Manager', 'Each month I need the number of visits per doctor and the revenue per service.', 'User requirement'],
];
const DAP = Object.fromEntries(CAU.map((x) => [x[0], x[3]]));
const LOP = ['Patient', 'Doctor', 'Receptionist', 'Pharmacist', 'Clinic Manager'];
const MO_HO = [
  ['V1', 'Patients want to book quickly.', ['how long|how many|minutes|seconds|steps|taps|clicks']],
  ['V2', 'Reminders should be sent in good time.', ['when|how many hours|how long before|hours']],
  ['V3', 'Some services need a deposit.', ['which|what services|how much|amount']],
  ['V4', 'Late patients may lose their slot.', ['how late|how many minutes|minutes|what happens']],
];

const KIEM = [
  ...kiemBang('INPUT_TYPES', DAP, { nhom: 'f1', an: ['T10', 'T11', 'T12'], ten: (k) => `A — category of ${k}`, tenVi: (k) => `A — nhóm của ${k}`, goiY: { T6: 'it describes the connection to another system', T7: 'it limits the developers’ choices', T9: 'the doctor proposes a design, the need behind it is still unknown', T2: 'a task the user needs to do — not yet a system behaviour' } }),
  kiemTuy({ en: 'B — the plan covers all five user classes', vi: 'B — kế hoạch phủ đủ năm lớp người dùng' }, function () {
    if (typeof ELICITATION_PLAN === 'undefined' || !Array.isArray(ELICITATION_PLAN)) return 'ELICITATION_PLAN must be an array of sessions';
    var need = ['patient', 'doctor', 'reception', 'pharmac', 'manager'];
    var t = ELICITATION_PLAN.map(function (s) { return String(s.userClass || '').toLowerCase(); }).join(' | ');
    for (var i = 0; i < need.length; i++) if (t.indexOf(need[i]) < 0) return 'no session for the user class "' + need[i] + '…"';
    return 'OK';
  }, { nhom: 'f2' }),
  kiemTuy({ en: 'B — at least three different techniques, including observation of the reception desk', vi: 'B — ít nhất ba kỹ thuật khác nhau, có quan sát quầy lễ tân' }, function () {
    if (typeof ELICITATION_PLAN === 'undefined' || !Array.isArray(ELICITATION_PLAN)) return 'ELICITATION_PLAN is missing';
    var ok = ['interview', 'workshop', 'focus group', 'observation', 'questionnaire', 'survey', 'document analysis', 'system interface analysis', 'user interface analysis', 'prototype'];
    var used = {};
    for (var i = 0; i < ELICITATION_PLAN.length; i++) {
      var t = String(ELICITATION_PLAN[i].technique || '').toLowerCase().trim();
      var k = ok.filter(function (x) { return t.indexOf(x) >= 0; })[0];
      if (!k) return 'session ' + (i + 1) + ': "' + ELICITATION_PLAN[i].technique + '" is not one of Wiegers’ elicitation techniques';
      used[k === 'survey' ? 'questionnaire' : k] = true;
    }
    if (Object.keys(used).length < 3) return 'use at least three different techniques';
    var obs = ELICITATION_PLAN.some(function (s) { return /observ/i.test(s.technique) && /reception/i.test(s.userClass); });
    return obs ? 'OK' : 'observe the receptionists at work — they cannot describe the phone rush accurately in an interview';
  }, { nhom: 'f2' }),
  kiemTuy({ en: 'B — each session has an objective and at least three questions', vi: 'B — mỗi buổi có mục tiêu và ít nhất ba câu hỏi' }, function () {
    if (typeof ELICITATION_PLAN === 'undefined' || !Array.isArray(ELICITATION_PLAN)) return 'ELICITATION_PLAN is missing';
    for (var i = 0; i < ELICITATION_PLAN.length; i++) {
      var s = ELICITATION_PLAN[i];
      if (String(s.objective || '').trim().split(/\s+/).length < 4) return 'session ' + (i + 1) + ': write its objective';
      if (!Array.isArray(s.questions) || s.questions.length < 3) return 'session ' + (i + 1) + ': at least 3 questions';
    }
    return 'OK';
  }, { nhom: 'f3' }),
  kiemTuy({ en: 'B — questions are open-ended and do not push a solution', vi: 'B — câu hỏi mở, không gợi sẵn giải pháp' }, function () {
    if (typeof ELICITATION_PLAN === 'undefined' || !Array.isArray(ELICITATION_PLAN)) return 'ELICITATION_PLAN is missing';
    for (var i = 0; i < ELICITATION_PLAN.length; i++) {
      var q = ELICITATION_PLAN[i].questions || [];
      for (var j = 0; j < q.length; j++) {
        var s = String(q[j]).trim();
        if (!/\?$/.test(s)) return 'session ' + (i + 1) + ', question ' + (j + 1) + ': end with "?"';
        if (/^(do|does|did|is|are|was|were|can|could|will|would|should|have|has)\b/i.test(s)) return 'session ' + (i + 1) + ': "' + s.slice(0, 50) + '…" is a yes/no question — ask "what / how / when / tell me about…"';
        if (/\b(app|button|drop-?down|screen|database|website)\b/i.test(s) && /\b(want|like|prefer|need)\b/i.test(s)) return 'session ' + (i + 1) + ': "' + s.slice(0, 50) + '…" proposes a solution — ask about the need';
      }
    }
    return 'OK';
  }, { nhom: 'f3' }),
  ...MO_HO.map(([k, cau, khop], i) => kiemTuy({ en: `C — follow-up question for ${k}: "${cau}"`, vi: `C — câu hỏi làm rõ cho ${k}: "${cau}"` }, new Function(`
    if (typeof FOLLOW_UPS === 'undefined' || !FOLLOW_UPS) return 'FOLLOW_UPS is missing';
    var s = String(FOLLOW_UPS[${JSON.stringify(k)}] || '').trim();
    if (!/\\?$/.test(s) || s.split(/\\s+/).length < 5) return 'write a full question ending with "?"';
    if (/^(do|does|is|are|can|will|would|should)\\b/i.test(s)) return 'make it open (what / how many / how long / when / which), not yes/no';
    return new RegExp(${JSON.stringify(khop[0])}, 'i').test(s) ? 'OK' : 'ask for the missing number or condition (e.g. how many, how long, when, which)';`), { nhom: 'f4', ...(i >= 2 ? { an: true } : {}) })),
];

const GIAI_PLAN = [
  { userClass: 'Receptionist', technique: 'Observation', objective: 'See how the morning phone rush, check-in and walk-ins are really handled today.', questions: ['What do you do when two lines ring while a patient is at the desk?', 'How do you decide who gets a free slot when a patient does not come?', 'Which information do you look for most often during check-in?'] },
  { userClass: 'Patient', technique: 'Questionnaire', objective: 'Learn how patients book today and what makes them miss appointments.', questions: ['How do you usually book a visit today?', 'What made you miss an appointment in the past?', 'When would you like to be reminded before a visit?'] },
  { userClass: 'Doctor', technique: 'Interview', objective: 'Understand how doctors plan their slots and write prescriptions.', questions: ['How do you plan your working hours for a week?', 'What information do you need before a patient enters the room?', 'Which steps of writing a prescription take you the most time?'] },
  { userClass: 'Pharmacist', technique: 'Interview', objective: 'Understand how prescriptions reach the pharmacy and are dispensed.', questions: ['How do prescriptions reach you today?', 'What happens when a medicine is out of stock?', 'Which details of a prescription must you check before dispensing?'] },
  { userClass: 'Clinic Manager', technique: 'Document analysis', objective: 'Study the current fee list and monthly reports to find the data the system must keep.', questions: ['Which figures do you look at first in the monthly report?', 'How often do service fees change, and who approves the change?', 'What decisions do you make from the no-show numbers?'] },
];
const GIAI_FU = {
  V1: 'How many steps or how many seconds would feel quick enough to book a visit on your phone?',
  V2: 'How many hours before the appointment should the reminder arrive, and by which channel?',
  V3: 'Which services need a deposit, and how much is it for each?',
  V4: 'How many minutes late can a patient be before the slot is given away, and what happens to the fee?',
};

const TEP = {
  'answers/a-input-types.js': [
    `// A. One of: ${NHOM.join(' | ')}\n${objTrong('INPUT_TYPES', DAP)}`,
    `// A. Wiegers Ch.7 — classify what the customer said, then record it in the right place.\n${objDong('INPUT_TYPES', DAP)}`,
  ],
  'answers/b-plan.js': [
    "// B. Elicitation plan — one object per session.\nconst ELICITATION_PLAN = [\n  { userClass: '', technique: '', objective: '', questions: [] },\n];\n",
    `// B. Five user classes, four techniques; open questions about needs, not solutions.\nconst ELICITATION_PLAN = ${JSON.stringify(GIAI_PLAN, null, 2)};\n`,
  ],
  'answers/c-follow-ups.js': [
    `// C. One open follow-up question per vague statement.\n${objTrong('FOLLOW_UPS', Object.fromEntries(MO_HO.map((x) => [x[0], ''])))}`,
    `// C. Each question asks for the missing number or condition.\n${objDong('FOLLOW_UPS', GIAI_FU)}`,
  ],
};

const BANG_CAU = bangHtml(['#', 'Who', 'What they said'], CAU.map((x) => [x[0], x[1], x[2]]));
const BANG_MO = bangHtml(['#', 'Vague statement'], MO_HO.map((x) => [x[0], x[1]]));

const mod = deLon({
  slug: 'swr302-3-project-cliniccare-m2-elicitation',
  ten: 'ClinicCare project — Milestone 2: Elicitation',
  moTaModule: 'Dự án ClinicCare, mốc 2 (chương 3): phân loại 12 câu nói của bên liên quan vào 9 nhóm đầu vào của Wiegers, lập kế hoạch khai thác cho 5 lớp người dùng (kỹ thuật, mục tiêu, câu hỏi mở), viết câu hỏi làm rõ cho phát biểu mơ hồ; kèm Góc phỏng vấn.',
  baiHoc: 'swr302-3-5-ch7-classifying-input',
  dangBai: 'project',
  tieuDe: 'ClinicCare project — Milestone 2: Elicitation',
  phu: { en: 'Running project · milestone 2 of 7 · classify, plan, ask · 10 marks', vi: 'Dự án xuyên suốt · mốc 2/7 · phân loại, lập kế hoạch, hỏi · 10 điểm' },
  moTa: {
    en: `${BOI_CANH.en}<p><b>A.</b> The first round of conversations produced these statements. Classify each one into Wiegers’ nine categories of customer input (${NHOM.join(', ')}):</p>${BANG_CAU}
<p><b>B.</b> Plan the next round: one session per user class (Patient, Doctor, Receptionist, Pharmacist, Clinic Manager) with <code>{ userClass, technique, objective, questions }</code>. Use at least three different techniques from Wiegers Ch.7, observe the receptionists at work, and write at least three open questions per session that ask about needs, not solutions.</p>
<p><b>C.</b> Write one open follow-up question for each vague statement:</p>${BANG_MO}`,
    vi: `${BOI_CANH.vi}<p><b>A.</b> Phân loại 12 câu nói (bảng ở bản tiếng Anh) vào 9 nhóm đầu vào của Wiegers. <b>B.</b> Lập kế hoạch vòng khai thác tiếp: mỗi lớp người dùng một buổi <code>{ userClass, technique, objective, questions }</code>; ít nhất ba kỹ thuật khác nhau, có quan sát lễ tân, mỗi buổi ≥ 3 câu hỏi mở về nhu cầu (không gợi giải pháp). <b>C.</b> Viết một câu hỏi làm rõ (mở) cho mỗi phát biểu mơ hồ.</p>`,
  },
  chucNangChinh: [{ en: 'A. Classify customer input.', vi: 'A. Phân loại đầu vào khách hàng.' }, { en: 'B. Elicitation plan.', vi: 'B. Kế hoạch khai thác.' }, { en: 'C. Follow-up questions.', vi: 'C. Câu hỏi làm rõ.' }],
  yeuCauChung: [{ en: 'Category names exactly as listed.', vi: 'Tên nhóm đúng như danh sách.' }],
  cayThuMuc: `answers/
├── a-input-types.js   ← const INPUT_TYPES = { T1: '…', … }
├── b-plan.js          ← const ELICITATION_PLAN = [ { userClass, technique, objective, questions }, … ]
└── c-follow-ups.js    ← const FOLLOW_UPS = { V1: '…?', … }`,
  moHinh: { ten: 'Answer records', truong: [
    ['INPUT_TYPES.Tn', 'string', { en: 'one of the nine categories', vi: 'một trong chín nhóm' }],
    ['session', '{ userClass, technique, objective, questions[] }', { en: 'technique from Wiegers Ch.7', vi: 'kỹ thuật theo Wiegers Ch.7' }],
    ['FOLLOW_UPS.Vn', 'string ending with "?"', { en: 'open question', vi: 'câu hỏi mở' }],
  ] },
  chucNang: [
    { ten: { en: 'A. Classification', vi: 'A. Phân loại' }, diem: 4, yeuCau: [{ en: 'Twelve statements.', vi: 'Mười hai câu.' }], hook: ['classifying customer input'] },
    { ten: { en: 'B1. Coverage and techniques', vi: 'B1. Độ phủ và kỹ thuật' }, diem: 2, yeuCau: [{ en: 'All user classes; ≥ 3 techniques; observation.', vi: 'Đủ lớp người dùng; ≥ 3 kỹ thuật; quan sát.' }], hook: ['elicitation techniques'] },
    { ten: { en: 'B2. Objectives and questions', vi: 'B2. Mục tiêu và câu hỏi' }, diem: 2, yeuCau: [{ en: 'Open, need-oriented questions.', vi: 'Câu hỏi mở, hướng nhu cầu.' }], hook: ['planning elicitation'] },
    { ten: { en: 'C. Follow-up questions', vi: 'C. Câu hỏi làm rõ' }, diem: 2, yeuCau: [{ en: 'Ask for the missing number or condition.', vi: 'Hỏi con số / điều kiện còn thiếu.' }], hook: ['ambiguity'] },
  ],
  idBatBuoc: [['INPUT_TYPES', 'answers/a-input-types.js'], ['ELICITATION_PLAN', 'answers/b-plan.js'], ['FOLLOW_UPS', 'answers/c-follow-ups.js']],
  truDiem: [
    { en: 'Recording the doctor’s drop-down idea as a requirement — find the need behind it first.', vi: 'Ghi ý tưởng drop-down của bác sĩ thành yêu cầu — phải tìm nhu cầu phía sau trước.' },
    { en: 'Questions such as "Would you like an app to book?" — leading and yes/no.', vi: 'Câu hỏi kiểu "Bạn có muốn app để đặt lịch không?" — dẫn dắt và có/không.' },
  ],
  goiY: [
    'A: "phải chạy trên Windows 10 sẵn có" giới hạn lựa chọn ⇒ Constraint; "gửi sang hệ thống quốc gia theo XML" ⇒ External interface.',
    'B: quan sát (observation) hợp với việc mà người làm khó tự mô tả (giờ cao điểm ở quầy).',
    'C: hỏi "bao nhiêu / bao lâu / khi nào / cái nào".',
  ],
  loiHayGap: ['Xếp T2 vào Functional requirement — đó là nhu cầu của người dùng, chưa phải hành vi hệ thống.', 'Chỉ dùng phỏng vấn cho mọi lớp người dùng.'],
  giaiThich: {
    en: '<p>Classifying input tells you where it goes: business requirements into the vision document, user requirements into use cases or stories, business rules into the rules catalogue, functional and quality requirements into the SRS, solution ideas back into a conversation about the real need. Observation catches what interviews miss: receptionists juggling phones and a queue rarely describe their work accurately from memory.</p>',
    vi: '<p>Phân loại cho biết thông tin đi về đâu: yêu cầu nghiệp vụ vào tài liệu tầm nhìn, yêu cầu người dùng vào use case/story, luật nghiệp vụ vào danh mục luật, yêu cầu chức năng và chất lượng vào SRS, ý tưởng giải pháp quay lại thành câu hỏi về nhu cầu thật. Quan sát bắt được điều phỏng vấn bỏ sót: lễ tân vừa nghe điện vừa xếp hàng hiếm khi tả lại chính xác công việc của mình.</p>',
  },
  khaiNiem: ['classifying customer input', 'elicitation planning', 'elicitation techniques'],
  tienQuyet: ['Milestone 1', 'SWR302 lessons 3.1–3.3'],
  thuatNgu: tn('elicitation', 'userClass', 'businessRule', 'constraint', 'externalInterface', 'qualityAttr'),
  moTaNgan: 'Dự án ClinicCare mốc 2: phân loại đầu vào, kế hoạch khai thác, câu hỏi làm rõ.',
  phut: 60,
  tep: TEP,
  kiem: KIEM,
  boYeu: [{ ten: 'câu hỏi có/không, chỉ phỏng vấn', tep: {
    'answers/b-plan.js': "const ELICITATION_PLAN = ['Patient','Doctor','Receptionist','Pharmacist','Clinic Manager'].map(function (c) { return { userClass: c, technique: 'Interview', objective: 'Ask them what they want.', questions: ['Do you want an app?', 'Is booking hard?', 'Would you like a button to book?'] }; });\n",
    'answers/c-follow-ups.js': "const FOLLOW_UPS = { V1: 'Is fast important?', V2: 'Should reminders be sent?', V3: 'Do some services need it?', V4: 'Can late patients lose it?' };\n",
  } }],
});

mod.de.push(phongVan({
  moc: 'elicitation',
  khaiNiem: ['elicitation techniques', 'classifying customer input'],
  thuatNgu: tn('elicitation', 'userClass'),
  cau: [
    { en: '"A user tells you exactly which screen layout she wants. What do you do?"', vi: '"Người dùng nói chính xác cô ấy muốn bố cục màn hình nào. Bạn làm gì?"', lc: [['a', '"I note it as a solution idea and ask why — what she is trying to achieve — then record the underlying need; the layout may still be a good design input."'], ['b', '"I write it into the SRS as a requirement."'], ['c', '"I ignore it."'], ['d', '"I ask the developers to build it straight away."']], dap: 'a', giai: ['Find the need behind the solution.', 'Tìm nhu cầu phía sau giải pháp.'] },
    { en: '"When would you choose observation over an interview?"', vi: '"Khi nào bạn chọn quan sát thay vì phỏng vấn?"', lc: [['a', '"When the work is routine or fast and people cannot describe it well — like ClinicCare’s receptionists handling phones and a queue at the same time."'], ['b', '"Never, interviews are always better."'], ['c', '"Only when the user refuses to talk."'], ['d', '"Only for managers."']], dap: 'a', giai: ['Observation reveals tacit, routine work.', 'Quan sát lộ ra việc thường ngày, khó diễn đạt.'] },
    { en: '"How do you know you are done eliciting?"', vi: '"Làm sao biết đã khai thác xong?"', lc: [['a', '"You never know for sure, but there are signs: users cannot think of new use cases, new input repeats earlier topics, every user class was heard, and open questions are closed."'], ['b', '"When the deadline arrives."'], ['c', '"When the SRS reaches 50 pages."'], ['d', '"After the first interview."']], dap: 'a', giai: ['Wiegers Ch.7 "knowing when you’re done".', 'Wiegers Ch.7.'] },
    { en: '"Give an example of a bad elicitation question."', vi: '"Cho ví dụ một câu hỏi khai thác tồi."', lc: [['a', '"‘You want online booking, right?’ — it is leading and yes/no. Better: ‘Tell me how a patient books a visit today.’"'], ['b', '"‘What happens when a patient is late?’"'], ['c', '"‘How many calls do you get in the morning?’"'], ['d', '"‘Which report do you read first?’"']], dap: 'a', giai: ['Leading, closed questions bias the answer.', 'Câu hỏi dẫn dắt, đóng làm lệch câu trả lời.'] },
  ],
}));

export default mod;
