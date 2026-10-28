/**
 * SWR302 · LAB 5 — Specification: the SRS of MedQueue (hospital outpatient queue).
 * A. đặt 13 phát biểu vào mục của template SRS Wiegers (Hình 10-2) · B. chẩn đoán + viết lại 8 yêu cầu tồi (Ch.11) ·
 * C. thuộc tính chất lượng (Ch.14) · D. viết 3 NFR đo được · E. một yêu cầu bằng Planguage (TAG/AMBITION/SCALE/METER/GOAL/STRETCH/WISH).
 */
import { tn, kiemKhoa, kiemTuy } from './_chung.mjs';
import { deLon, kiemBang, objDong, objTrong } from './_lab.mjs';

const MUC = [
  ['1.1', 'Purpose'], ['1.2', 'Document conventions'], ['1.3', 'Project scope'], ['1.4', 'References'],
  ['2.1', 'Product perspective'], ['2.2', 'User classes and characteristics'], ['2.3', 'Operating environment'], ['2.4', 'Design and implementation constraints'], ['2.5', 'Assumptions and dependencies'],
  ['3', 'System features'], ['4', 'Data requirements'],
  ['5.1', 'User interfaces'], ['5.2', 'Software interfaces'], ['5.3', 'Hardware interfaces'], ['5.4', 'Communications interfaces'],
  ['6', 'Quality attributes'], ['7', 'Internationalization and localization requirements'], ['8', 'Other requirements'],
  ['A', 'Appendix A: Glossary'], ['B', 'Appendix B: Analysis models'],
];
const PHAT_BIEU = [
  ['R1', 'The kiosk prints the queue ticket on a 58-mm thermal printer connected by USB.', ['5.3']],
  ['R2', 'MedQueue retrieves the patient\u2019s appointment from the hospital information system (HIS) through its HL7 FHIR REST API.', ['5.2']],
  ['R3', 'Every screen shall be available in Vietnamese and English, and dates shall be shown as dd/mm/yyyy.', ['7']],
  ['R4', 'MedQueue shall run on the hospital\u2019s on-premise Ubuntu 22.04 servers.', ['2.4']],
  ['R5', 'Nurses use shared desktop PCs at the triage desks; doctors use tablets in the consulting rooms.', ['2.3']],
  ['R6', 'Patients, nurses, doctors and the clinic manager use MedQueue; many patients are elderly and have poor eyesight.', ['2.2']],
  ['R7', 'MedQueue replaces the paper number dispenser and is one part of the hospital\u2019s digital front-door programme.', ['2.1']],
  ['R8', 'When a doctor presses Call next, the system shall assign the first waiting patient of that room and show the number on the hall screen.', ['3']],
  ['R9', 'A queue entry consists of the ticket number, patient ID, department, priority class and issue time.', ['4']],
  ['R10', '95% of queue-status refreshes shall complete within 1 second with 500 concurrent users.', ['6']],
  ['R11', 'The HIS team will expose the appointment API before go-live.', ['2.5']],
  ['R12', 'Triage: the nurse\u2019s assessment of urgency that decides a patient\u2019s priority class.', ['A']],
  ['R13', 'SMS messages to patients are sent to the hospital SMS gateway over HTTPS.', ['5.4', '5.2']],
];

const VAN_DE = ['AMBIGUOUS', 'UNVERIFIABLE', 'COMPOUND', 'DESIGN', 'INCOMPLETE', 'INCONSISTENT'];
const XAU = [
  ['B1', 'The system shall show the estimated waiting time quickly.', ['UNVERIFIABLE', 'AMBIGUOUS']],
  ['B2', 'The system shall send the call SMS to the patient and/or the guardian.', ['AMBIGUOUS']],
  ['B3', 'The system shall let the doctor call the next patient, print the daily report and export statistics to Excel.', ['COMPOUND']],
  ['B4', 'Queue numbers shall be stored in a MySQL table named q_numbers with an auto-increment key.', ['DESIGN']],
  ['B5', 'If the patient is not in the hall when called, the system shall handle it.', ['INCOMPLETE']],
  ['B6', 'The kiosk should be user-friendly for elderly patients.', ['UNVERIFIABLE', 'AMBIGUOUS']],
  ['B7', 'The system shall call Emergency-class patients before all other patients. (Compare with R8.)', ['INCONSISTENT']],
  ['B8', 'The system shall support up to TBD patients per day.', ['INCOMPLETE']],
];
const DAP_VD = Object.fromEntries(XAU.map(([k, , v]) => [k, v]));
const GIAI_VIET = {
  B1: 'The system shall display the estimated waiting time of a ticket within 2 seconds after the ticket is issued.',
  B2: 'The system shall send the call SMS to the mobile number registered for the patient; when the patient is under 16, it shall send it to the registered guardian instead.',
  B3: [
    'The system shall let a doctor call the next waiting patient of the doctor\u2019s room.',
    'The system shall let the clinic manager print the daily queue report.',
    'The system shall let the clinic manager export the monthly queue statistics as an .xlsx file.',
  ],
  B4: 'The system shall keep every issued queue number for 90 days and shall never issue the same number twice in one day.',
  B5: 'If the patient does not reach the room within 3 minutes after the third call, the system shall mark the ticket as No-show and call the next waiting patient.',
  B6: 'At least 90% of patients aged 65 or older shall obtain a ticket at the kiosk within 60 seconds without help, measured in the acceptance usability test.',
  B7: 'When a doctor presses Call next, the system shall assign the waiting patient with the highest priority class (Emergency, then Priority, then Normal) and, within the same class, the earliest issue time.',
  B8: 'The system shall be able to issue at least 3,000 tickets per day.',
};

const THUOC_TINH = ['Availability', 'Installability', 'Integrity', 'Interoperability', 'Performance', 'Reliability', 'Robustness', 'Safety', 'Security', 'Usability', 'Efficiency', 'Modifiability', 'Portability', 'Reusability', 'Scalability', 'Verifiability'];
const NFR_CHO = [
  ['Q1', 'MedQueue shall be available 99.5% of the time between 06:00 and 20:00 on working days.', 'Availability'],
  ['Q2', 'Only the nurses and doctors of a department shall see the names of that department\u2019s waiting patients.', 'Security'],
  ['Q3', 'A first-time patient shall obtain a ticket at the kiosk within 60 seconds without help in 90% of attempts.', 'Usability'],
  ['Q4', 'If the HIS is unreachable, the kiosk shall keep issuing tickets and shall synchronise them within 5 minutes after the HIS is back.', 'Robustness'],
  ['Q5', 'MedQueue shall exchange appointments with the HIS using HL7 FHIR R4 resources.', 'Interoperability'],
  ['Q6', 'MedQueue shall serve 3,000 patients per day in 2027 by adding servers, without changing the software.', 'Scalability'],
  ['Q7', 'An administrator shall be able to configure a new department in under 30 minutes without any code change.', 'Modifiability'],
  ['Q8', 'Ticket numbers of one department shall never repeat or skip within one day.', ['Integrity', 'Reliability']],
];
const DAP_QA = Object.fromEntries(NFR_CHO.map(([k, , v]) => [k, v]));

const GIAI_NFRS = [
  { attribute: 'Performance', requirement: 'The hall screen shall show a newly called number within 2 seconds after the doctor presses Call next, in 95% of calls with 500 concurrent users.' },
  { attribute: 'Availability', requirement: 'The kiosks shall be able to issue tickets 99.9% of the time between 06:00 and 18:00 on working days, measured monthly.' },
  { attribute: 'Security', requirement: 'The system shall lock a staff account for 15 minutes after 5 consecutive failed sign-in attempts.' },
];
const GIAI_PL = {
  tag: 'Performance.CallDisplay',
  ambition: 'Patients see their number on the hall screen almost as soon as the doctor calls them.',
  scale: 'Seconds from the doctor pressing Call next until the number appears on the hall screen.',
  meter: 'Timestamps logged by the server and the screen client during 1,000 calls of the load test with 500 concurrent users; 95th percentile.',
  goal: '2 seconds',
  stretch: '1 second',
  wish: '0.5 seconds',
  defined: 'Hall screen: the 55-inch display in each waiting hall.',
};

const MO_HO = '/\\b(quickly|fast|user[- ]friendly|easy|easily|simple|efficient|flexible|robust|adequate|appropriate|several|some|many|as much as possible|and\\/or|etc|tbd|support)\\b/i';
const kiemViet = Object.keys(GIAI_VIET).map((k, i) => kiemTuy({ en: `B — the rewrite of ${k} is a good requirement`, vi: `B — bản viết lại của ${k} là yêu cầu tốt` }, new Function(`
  if (typeof FIXES === 'undefined' || !FIXES || !FIXES['${k}']) return 'FIXES.${k} is missing';
  var r = FIXES['${k}'].rewrite;
  var ds = Array.isArray(r) ? r : [r];
  ${k === 'B3' ? "if (ds.length < 3) return 'B3 holds three requirements — split it into three statements (an array)';" : "if (ds.length !== 1) return 'one requirement per statement';"}
  for (var i = 0; i < ds.length; i++) {
    var t = String(ds[i] || '').trim();
    if (!/\\bshall\\b/i.test(t)) return 'use "shall" — VI: dùng "shall"';
    if (${MO_HO}.test(t)) return 'still ambiguous (quickly, easy, user-friendly, and/or, TBD, support…) — VI: vẫn còn từ mơ hồ';
    if (t.split(/\\s+/).length < 7) return 'too short to be verifiable';
    if ((t.match(/\\bshall\\b/gi) || []).length > 2) return 'more than one requirement in one statement';
  }
  var all = ds.join(' ');
  ${{
    B1: "if (!/\\d/.test(all) || !/second|ms|minute/i.test(all)) return 'state the response time with a number and a unit';",
    B2: "if (!/guardian/i.test(all) || !/patient/i.test(all)) return 'say exactly WHO gets the SMS (patient or guardian) and when';",
    B3: "",
    B4: "if (/mysql|table|auto[- ]?increment|sql/i.test(all)) return 'still a design decision — state the NEED (keep numbers, never duplicate), not the database';",
    B5: "if (!/no[- ]?show|next|end of the queue|re-?call|skip/i.test(all) || !/\\d/.test(all)) return 'say what the system DOES and after how long / how many calls';",
    B6: "if (!/\\d/.test(all)) return 'make it measurable: who, which task, how fast, what success rate';",
    B7: "if (!/priority|emergency/i.test(all) || !/call next|next/i.test(all)) return 'merge R8 and B7 into one consistent rule for Call next';",
    B8: "if (!/\\d/.test(all) || /tbd/i.test(all)) return 'replace TBD with a number';",
  }[k]}
  return 'OK';`), { nhom: 'f3', ...(i >= 6 ? { an: true } : {}) }));

const kiemNfr = [
  kiemTuy({ en: 'D — three measurable NFRs for three different quality attributes', vi: 'D — ba NFR đo được cho ba thuộc tính chất lượng khác nhau' }, new Function(`
    if (typeof NFRS === 'undefined' || !Array.isArray(NFRS)) return 'NFRS is missing';
    if (NFRS.length < 3) return 'write 3 NFRs';
    var DS = ${JSON.stringify(THUOC_TINH)}.map(function (x) { return x.toLowerCase(); }), seen = {};
    for (var i = 0; i < NFRS.length; i++) {
      var r = NFRS[i] || {}, a = String(r.attribute || '').toLowerCase().trim(), t = String(r.requirement || '');
      if (DS.indexOf(a) < 0) return 'NFRS[' + i + '].attribute must be a quality attribute of Wiegers Ch.14';
      if (seen[a]) return 'use three DIFFERENT attributes'; seen[a] = 1;
      if (!/\\bshall\\b/i.test(t)) return 'NFRS[' + i + ']: use "shall"';
      if (!/\\d/.test(t)) return 'NFRS[' + i + '] is not measurable — add a number (time, %, count, minutes…)';
      if (${MO_HO}.test(t)) return 'NFRS[' + i + '] contains an ambiguous word';
      if (!/medqueue|kiosk|ticket|queue|patient|hall|screen|nurse|doctor|his|sms|staff/i.test(t)) return 'NFRS[' + i + '] must be about MedQueue, not a generic sentence';
    }
    return 'OK';`), { nhom: 'f5' }),
  kiemTuy({ en: 'D — each NFR states the condition under which it is measured', vi: 'D — mỗi NFR nêu điều kiện đo' }, new Function(`
    if (typeof NFRS === 'undefined' || !Array.isArray(NFRS) || !NFRS.length) return 'NFRS is missing';
    for (var i = 0; i < NFRS.length; i++) if (!/\\b(with|when|during|between|after|under|for|in|per|within|while)\\b/i.test(String((NFRS[i] || {}).requirement))) return 'NFRS[' + i + ']: under which condition (load, time window, event)?';
    return 'OK';`), { nhom: 'f5', an: true }),
];
const kiemPl = [
  kiemTuy({ en: 'E — Planguage: TAG, AMBITION, SCALE, METER, GOAL, STRETCH, WISH, DEFINED all present', vi: 'E — Planguage: đủ TAG, AMBITION, SCALE, METER, GOAL, STRETCH, WISH, DEFINED' }, function () {
    if (typeof PLANGUAGE === 'undefined' || !PLANGUAGE) return 'PLANGUAGE is missing';
    var can = ['tag', 'ambition', 'scale', 'meter', 'goal', 'stretch', 'wish', 'defined'];
    for (var i = 0; i < can.length; i++) if (!String(PLANGUAGE[can[i]] || '').trim()) return 'keyword ' + can[i].toUpperCase() + ' is empty';
    if (!/^[A-Za-z]+\.[A-Za-z]+/.test(String(PLANGUAGE.tag))) return 'TAG is a hierarchical name, e.g. Performance.CallDisplay';
    return 'OK';
  }, { nhom: 'f6' }),
  kiemTuy({ en: 'E — SCALE has a unit, METER says how it is measured, GOAL < STRETCH < WISH in difficulty', vi: 'E — SCALE có đơn vị, METER nói cách đo, GOAL < STRETCH < WISH về độ khó' }, function () {
    if (typeof PLANGUAGE === 'undefined' || !PLANGUAGE) return 'PLANGUAGE is missing';
    if (!/second|ms|minute|percent|%|count|number/i.test(String(PLANGUAGE.scale))) return 'SCALE needs a unit (seconds, %, …)';
    if (!/test|log|measur|monitor|stopwatch|timestamp|percentile|sample/i.test(String(PLANGUAGE.meter))) return 'METER must say HOW the value is measured';
    var n = function (s) { var m = /([\d.]+)/.exec(String(s)); return m ? Number(m[1]) : NaN; };
    var g = n(PLANGUAGE.goal), s = n(PLANGUAGE.stretch), w = n(PLANGUAGE.wish);
    if (isNaN(g) || isNaN(s) || isNaN(w)) return 'GOAL, STRETCH and WISH need numbers';
    var tang = /percent|%|availability|rate/i.test(String(PLANGUAGE.scale));
    var ok = tang ? (g < s && s < w) : (g > s && s > w);
    return ok ? 'OK' : 'GOAL is the target to reach, STRETCH is better, WISH is better still — check the order';
  }, { nhom: 'f6' }),
];

const KIEM = [
  ...kiemBang('SECTIONS', Object.fromEntries(PHAT_BIEU.map(([k, , v]) => [k, v])), { nhom: 'f1', an: ['R12', 'R13'], ten: (k) => `A — SRS section of ${k}`, tenVi: (k) => `A — mục SRS của ${k}`, goiY: { R4: 'it limits the design choices of the team', R7: 'how the product fits in its bigger world', R11: 'something the project counts on that may turn out false' } }),
  ...kiemKhoa(XAU.map(([k, , v], i) => ({ moTa: { en: `B — main problem of ${k}`, vi: `B — vấn đề chính của ${k}` }, bieuThuc: `(FIXES['${k}'] || {}).problem`, chap: v, nhom: 'f2', ...(i >= 6 ? { an: true } : {}) }))),
  ...kiemViet,
  ...kiemBang('ATTRIBUTES', DAP_QA, { nhom: 'f4', an: ['Q8'], ten: (k) => `C — quality attribute of ${k}`, tenVi: (k) => `C — thuộc tính chất lượng của ${k}` }),
  ...kiemNfr,
  ...kiemPl,
];

const TEP = {
  'answers/a-sections.js': [`// A. Section number of the Wiegers SRS template: ${MUC.map((m) => m[0]).join(' | ')}\n${objTrong('SECTIONS', Object.fromEntries(PHAT_BIEU.map(([k]) => [k, ''])))}`,
    `// A. Interfaces split by kind (5.2 software, 5.3 hardware, 5.4 communications); limits = 2.4; things we count on = 2.5.\n${objDong('SECTIONS', Object.fromEntries(PHAT_BIEU.map(([k, , v]) => [k, v[0]])))}`],
  'answers/b-fixes.js': [`// B. problem: ${VAN_DE.join(' | ')} · rewrite: a good requirement (B3: an array of statements).\nconst FIXES = {\n${XAU.map(([k]) => `  ${k}: { problem: '', rewrite: '' },`).join('\n')}\n};\n`,
    `// B. Verifiable, one requirement per statement, no design decision, a defined response, consistent with R8.\nconst FIXES = {\n${XAU.map(([k, , v]) => `  ${k}: {\n    problem: '${v[0]}',\n    rewrite: ${Array.isArray(GIAI_VIET[k]) ? `[\n${GIAI_VIET[k].map((x) => `      '${x.replace(/'/g, "\\'")}',`).join('\n')}\n    ]` : `'${GIAI_VIET[k].replace(/'/g, "\\'")}'`},\n  },`).join('\n')}\n};\n`],
  'answers/c-attributes.js': [`// C. ${THUOC_TINH.join(' | ')}\n${objTrong('ATTRIBUTES', DAP_QA)}`, `// C. External quality attributes of Wiegers Ch.14 (+ internal: modifiability, scalability…).\n${objDong('ATTRIBUTES', Object.fromEntries(Object.entries(DAP_QA).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])))}`],
  'answers/d-nfrs.js': [`// D. Three measurable NFRs of MedQueue for three different quality attributes.\nconst NFRS = [\n  { attribute: '', requirement: '' },\n];\n`, `// D. Each: attribute + shall + number + unit + condition, about MedQueue.\nconst NFRS = [\n${GIAI_NFRS.map((r) => `  { attribute: '${r.attribute}', requirement: '${r.requirement.replace(/'/g, "\\'")}' },`).join('\n')}\n];\n`],
  'answers/e-planguage.js': [`// E. One performance requirement in Planguage.\nconst PLANGUAGE = { tag: '', ambition: '', scale: '', meter: '', goal: '', stretch: '', wish: '', defined: '' };\n`, `// E. Gilb's Planguage: a stopwatch can judge it.\n${objDong('PLANGUAGE', GIAI_PL)}`],
};

const ds = (xs) => `<ul>${xs.map((x) => `<li><b>${x[0]}</b> — ${x[1]}</li>`).join('')}</ul>`;

export default deLon({
  slug: 'swr302-5-lab-srs-medqueue',
  ten: 'Lab 5 — Specification: the SRS of MedQueue',
  moTaModule: 'Lab chương 5: đặt 13 phát biểu vào đúng mục template SRS Wiegers, chẩn đoán và viết lại 8 yêu cầu tồi (mơ hồ, không kiểm chứng, ghép, thiết kế, thiếu, mâu thuẫn), 8 thuộc tính chất lượng, viết 3 NFR đo được, một yêu cầu bằng Planguage.',
  baiHoc: 'swr302-5-1-srs-ieee-830',
  tieuDe: 'Lab 5 — Specification: the SRS of MedQueue',
  phu: { en: 'Chapter 5 lab · SRS template, writing and fixing requirements, quality attributes, Planguage · 10 marks', vi: 'Lab chương 5 · template SRS, viết và sửa yêu cầu, thuộc tính chất lượng, Planguage · 10 điểm' },
  moTa: {
    en: `<p>City General Hospital is building <b>MedQueue</b> for its outpatient clinic: patients take a queue ticket at a kiosk or in the app, see their estimated waiting time and receive an SMS when three patients remain before them; nurses triage patients into priority classes; doctors call the next patient from their room; hall screens show the called numbers; appointments come from the hospital information system (HIS). You are reviewing the first draft of the SRS.</p>
<p><b>A. Statements to place in the SRS</b>:</p>${ds(PHAT_BIEU)}
<p>Template sections: ${MUC.map((m) => `<code>${m[0]}</code> ${m[1]}`).join(' · ')}.</p>
<p><b>B. Bad requirements from the draft</b>:</p>${ds(XAU)}
<p><b>C. Nonfunctional requirements to classify</b>:</p>${ds(NFR_CHO)}
<p><b>D.</b> Write three measurable nonfunctional requirements for MedQueue, each for a different quality attribute.</p>
<p><b>E.</b> Write the requirement "the called number appears on the hall screen quickly" in <b>Planguage</b>.</p>`,
    vi: `<p>Bệnh viện Đa khoa Thành phố xây <b>MedQueue</b> cho khoa khám ngoại trú: bệnh nhân lấy số ở kiosk hoặc trong app, xem thời gian chờ ước tính và nhận SMS khi còn ba người trước mình; điều dưỡng phân loại ưu tiên; bác sĩ gọi người tiếp theo từ phòng khám; màn hình sảnh hiện số được gọi; lịch hẹn lấy từ hệ thống thông tin bệnh viện (HIS). Bạn review bản nháp SRS đầu tiên.</p>
<p><b>A.</b> Đặt 13 phát biểu R1–R13 vào mục của template SRS (danh sách mục ở bản tiếng Anh). <b>B.</b> Tám yêu cầu tồi B1–B8: gọi tên vấn đề chính và viết lại. <b>C.</b> Tám NFR Q1–Q8: thuộc tính chất lượng nào? <b>D.</b> Viết ba NFR đo được cho MedQueue, mỗi cái một thuộc tính khác nhau. <b>E.</b> Viết yêu cầu "số được gọi hiện nhanh trên màn hình sảnh" bằng <b>Planguage</b>.</p>`,
  },
  chucNangChinh: [
    { en: 'A. SRS section of 13 statements.', vi: 'A. Mục SRS của 13 phát biểu.' },
    { en: 'B. Problem and rewrite of 8 bad requirements.', vi: 'B. Vấn đề và bản viết lại của 8 yêu cầu tồi.' },
    { en: 'C. Quality attribute of 8 NFRs.', vi: 'C. Thuộc tính chất lượng của 8 NFR.' },
    { en: 'D. Three measurable NFRs.', vi: 'D. Ba NFR đo được.' },
    { en: 'E. One requirement in Planguage.', vi: 'E. Một yêu cầu bằng Planguage.' },
  ],
  yeuCauChung: [
    { en: 'A good requirement: "shall", system perspective, one requirement per statement, verifiable (numbers and units), no design decision, no ambiguous words.', vi: 'Yêu cầu tốt: "shall", góc nhìn hệ thống, mỗi câu một yêu cầu, kiểm chứng được (số và đơn vị), không quyết định thiết kế, không từ mơ hồ.' },
  ],
  cayThuMuc: `answers/
├── a-sections.js    ← const SECTIONS = { R1: '5.3', … }
├── b-fixes.js       ← const FIXES = { B1: { problem, rewrite }, … }      (B3.rewrite = array)
├── c-attributes.js  ← const ATTRIBUTES = { Q1: '…', … }
├── d-nfrs.js        ← const NFRS = [ { attribute, requirement } ×3 ]
└── e-planguage.js   ← const PLANGUAGE = { tag, ambition, scale, meter, goal, stretch, wish, defined }`,
  moHinh: {
    ten: 'Allowed values',
    truong: [
      ['SECTIONS.*', 'string', { en: MUC.map((m) => `${m[0]} = ${m[1]}`).join(' · '), vi: 'số mục của template (vd "2.4", "5.3", "A")' }],
      ['FIXES.*.problem', 'string', { en: VAN_DE.join(' · '), vi: VAN_DE.join(' · ') }],
      ['ATTRIBUTES.* · NFRS[i].attribute', 'string', { en: THUOC_TINH.join(' · '), vi: THUOC_TINH.join(' · ') }],
      ['PLANGUAGE', 'object', { en: 'TAG = hierarchical name · AMBITION = the intent in words · SCALE = unit of measure · METER = how it is measured · GOAL = target · STRETCH = better · WISH = ideal · DEFINED = a term used above', vi: 'TAG = tên phân cấp · AMBITION = ý định · SCALE = đơn vị đo · METER = cách đo · GOAL = mục tiêu · STRETCH = tốt hơn · WISH = lý tưởng · DEFINED = định nghĩa thuật ngữ' }],
    ],
  },
  chucNang: [
    { ten: { en: 'A. SRS template sections', vi: 'A. Mục template SRS' }, diem: 2.5, yeuCau: [{ en: 'The right section for each statement.', vi: 'Đúng mục cho từng phát biểu.' }], hook: ['SRS template (Wiegers Fig. 10-2)'] },
    { ten: { en: 'B1. Diagnosing bad requirements', vi: 'B1. Chẩn đoán yêu cầu tồi' }, diem: 1.5, yeuCau: [{ en: 'The main problem of each statement.', vi: 'Vấn đề chính của từng phát biểu.' }], hook: ['characteristics of excellent requirements'] },
    { ten: { en: 'B2. Rewriting them', vi: 'B2. Viết lại' }, diem: 1.5, yeuCau: [{ en: 'Verifiable, single, no design, defined response, consistent.', vi: 'Kiểm chứng được, đơn, không thiết kế, phản hồi xác định, nhất quán.' }], hook: ['writing guidelines'] },
    { ten: { en: 'C. Quality attributes', vi: 'C. Thuộc tính chất lượng' }, diem: 1.5, yeuCau: [{ en: 'The attribute each NFR is about.', vi: 'Thuộc tính mà mỗi NFR nói tới.' }], hook: ['quality attributes'] },
    { ten: { en: 'D. Measurable NFRs', vi: 'D. NFR đo được' }, diem: 1.5, yeuCau: [{ en: 'Three attributes, numbers and conditions, about MedQueue.', vi: 'Ba thuộc tính, có số và điều kiện, về MedQueue.' }], hook: ['nonfunctional requirement'] },
    { ten: { en: 'E. Planguage', vi: 'E. Planguage' }, diem: 1.5, yeuCau: [{ en: 'Every keyword; a unit; how it is measured; goal < stretch < wish.', vi: 'Đủ từ khoá; có đơn vị; cách đo; goal < stretch < wish.' }], hook: ['Planguage'] },
  ],
  idBatBuoc: [['SECTIONS', 'answers/a-sections.js'], ['FIXES', 'answers/b-fixes.js'], ['ATTRIBUTES', 'answers/c-attributes.js'], ['NFRS', 'answers/d-nfrs.js'], ['PLANGUAGE', 'answers/e-planguage.js']],
  truDiem: [
    { en: 'Putting R4 (Ubuntu servers) in quality attributes — it is a design and implementation constraint (2.4).', vi: 'Đặt R4 (máy chủ Ubuntu) vào thuộc tính chất lượng — đó là ràng buộc thiết kế và hiện thực (2.4).' },
    { en: 'Rewriting B1 as "very quickly" or B6 as "easy to use": still unverifiable.', vi: 'Viết lại B1 thành "rất nhanh" hay B6 thành "dễ dùng": vẫn không kiểm chứng được.' },
    { en: 'Keeping B3 as one sentence with "and": three requirements need three statements.', vi: 'Giữ B3 một câu nối bằng "and": ba yêu cầu cần ba câu.' },
    { en: 'Fixing B4 by naming PostgreSQL instead of MySQL — the problem is stating a design at all.', vi: 'Sửa B4 bằng cách đổi MySQL thành PostgreSQL — vấn đề là việc nêu thiết kế.' },
  ],
  goiY: [
    'A: phần 2 là bối cảnh (sản phẩm nằm ở đâu, ai dùng, chạy ở đâu, giới hạn gì, giả định gì); phần 5 tách theo LOẠI giao diện; định nghĩa thuật ngữ ⇒ Appendix A.',
    'B: tìm từ mơ hồ (quickly, user-friendly, and/or), nhiều ý nối bằng "and", chi tiết thiết kế (MySQL, table), "handle it" (phản hồi chưa xác định), TBD, và câu mâu thuẫn với R8.',
    'E: GOAL là mức phải đạt; STRETCH tốt hơn; WISH lý tưởng. Với thời gian: số càng NHỎ càng tốt.',
  ],
  loiHayGap: [
    'Xếp R9 (thành phần một queue entry) vào System features — đó là định nghĩa dữ liệu ⇒ mục 4.',
    'Xếp R5 vào User classes vì có "nurses", "doctors" — câu này nói về MÁY họ dùng ⇒ Operating environment.',
    'NFR không có điều kiện đo ("in under 2 seconds" — với bao nhiêu người dùng?).',
    'Planguage có GOAL = 1s, STRETCH = 2s (đảo chiều).',
  ],
  giaiThich: {
    en: `<p><b>A.</b> ${PHAT_BIEU.map(([k, , v]) => `${k} ${v[0]}`).join(' · ')}. <b>B.</b> ${XAU.map(([k, , v]) => `${k} ${v[0]}`).join(' · ')} — rewrites in the solution file. <b>C.</b> ${NFR_CHO.map(([k, , v]) => `${k} ${Array.isArray(v) ? v.join('/') : v}`).join(' · ')}. <b>D/E.</b> A requirement a stopwatch can judge: attribute, shall, number, unit, the condition of measurement; in Planguage the METER makes the SCALE measurable.</p>`,
    vi: `<p><b>A.</b> ${PHAT_BIEU.map(([k, , v]) => `${k} ${v[0]}`).join(' · ')}. <b>B.</b> ${XAU.map(([k, , v]) => `${k} ${v[0]}`).join(' · ')} — bản viết lại trong tệp lời giải. <b>C.</b> như trên. <b>D/E.</b> Yêu cầu mà đồng hồ bấm giờ phán được: thuộc tính, shall, con số, đơn vị, điều kiện đo; trong Planguage, METER làm SCALE đo được.</p>`,
  },
  khaiNiem: ['SRS template', 'characteristics of excellent requirements', 'ambiguity', 'quality attributes', 'Planguage'],
  tienQuyet: ['SWR302 lessons 5.1–5.9'],
  thuatNgu: [...tn('srs', 'verifiable', 'ambiguous', 'tbd', 'qualityAttr', 'constraint', 'externalInterface', 'planguage', 'nfr')],
  moTaNgan: 'Lab chương 5: MedQueue — mục SRS, sửa yêu cầu tồi, thuộc tính chất lượng, NFR, Planguage.',
  phut: 70,
  tep: TEP,
  kiem: KIEM,
  boYeu: [
    { ten: 'viết lại vẫn mơ hồ, B3 không tách, B4 đổi sang PostgreSQL', tep: { 'answers/b-fixes.js': `const FIXES = {\n${XAU.map(([k, , v]) => `  ${k}: { problem: '${v[0]}', rewrite: '${{ B1: 'The system shall show the waiting time very quickly.', B3: 'The system shall let the doctor call the next patient and print the daily report and export statistics.', B4: 'Queue numbers shall be stored in a PostgreSQL table.', B6: 'The kiosk shall be easy to use for elderly patients.' }[k] || (Array.isArray(GIAI_VIET[k]) ? GIAI_VIET[k][0] : GIAI_VIET[k]).replace(/'/g, "\\'")}' },`).join('\n')}\n};\n` }, phaiTruot: ['rewrite of B1', 'rewrite of B3', 'rewrite of B4'] },
    { ten: 'NFR chung chung không số + Planguage đảo chiều', tep: { 'answers/d-nfrs.js': "const NFRS = [\n  { attribute: 'Performance', requirement: 'The system shall be fast.' },\n  { attribute: 'Security', requirement: 'The system shall be secure.' },\n  { attribute: 'Usability', requirement: 'The system shall be user-friendly.' },\n];\n", 'answers/e-planguage.js': objDong('PLANGUAGE', { ...GIAI_PL, goal: '0.5 seconds', wish: '2 seconds' }) }, phaiTruot: ['three measurable NFRs', 'GOAL < STRETCH < WISH'] },
  ],
});
