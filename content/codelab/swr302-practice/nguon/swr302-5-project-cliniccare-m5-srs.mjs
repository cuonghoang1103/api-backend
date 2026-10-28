/**
 * SWR302 · DỰ ÁN ClinicCare — Mốc 5 (chương 5): yêu cầu chức năng có nguồn, yêu cầu chất lượng đo được, Planguage,
 * data dictionary của đơn thuốc, xếp phát biểu vào mục SRS + Interview corner.
 */
import { tn, kiemTuy, jsLit, bangHtml } from './_chung.mjs';
import { deLon, kiemBang, objDong, objTrong } from './_lab.mjs';
import { BOI_CANH, phongVan } from './_cliniccare.mjs';

const DD_DOC = function () {
  if (typeof DATA_DICTIONARY === 'undefined' || !Array.isArray(DATA_DICTIONARY) || !DATA_DICTIONARY.length) return { loi: 'DATA_DICTIONARY is missing' };
  var n = function (s) { return String(s == null ? '' : s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); };
  var ten = {}; DATA_DICTIONARY.forEach(function (e) { if (e && e.element) ten[n(e.element)] = e; });
  function tach(c) {
    var out = [], ps = String(c || '').split('+');
    for (var i = 0; i < ps.length; i++) {
      var t = ps[i].trim(), m;
      if ((m = /^\(\s*([^(){}]+?)\s*\)$/.exec(t))) out.push({ ten: m[1], tuyChon: true });
      else if ((m = /^(\d+)\s*:\s*(\d+|n)\s*\{\s*([^(){}]+?)\s*\}$/i.exec(t))) out.push({ ten: m[3], lap: [Number(m[1]), m[2]] });
      else if (/^[A-Za-z][\w .'-]*$/.test(t)) out.push({ ten: t });
      else return 'cannot read "' + t + '"';
    }
    return out;
  }
  return { n: n, ten: ten, tach: tach };
}.toString();

const MUC = ['1.1 Purpose', '1.3 Project scope', '2.2 User classes and characteristics', '2.3 Operating environment', '2.4 Design and implementation constraints', '2.5 Assumptions and dependencies', '3 System features', '4 Data requirements', '5.2 Software interfaces', '6 Quality attributes'];
const PB = [
  ['S1', 'Users are patients (mostly on phones), three doctors, two receptionists, a pharmacist and a manager; some older patients never use apps.', '2.2 User classes and characteristics'],
  ['S2', 'Reception PCs run Windows 10 with Chrome; patients use Android 12+ or iOS 16+ phones.', '2.3 Operating environment'],
  ['S3', 'Prescriptions must follow the Ministry of Health format for electronic prescriptions.', '2.4 Design and implementation constraints'],
  ['S4', 'We assume the national e-prescription service remains free of charge for clinics.', '2.5 Assumptions and dependencies'],
  ['S5', 'The system shall send each prescription to the National e-Prescription System and store the code it returns.', '5.2 Software interfaces'],
  ['S6', 'The system shall display the free slots of a doctor within 2 seconds for 95% of requests.', '6 Quality attributes'],
  ['S7', 'Appointment = Appointment Code + Patient ID + Doctor ID + Slot Start + Service Code + Status.', '4 Data requirements'],
  ['S8', '3.2 Online booking — description, priority and FR-1 to FR-6.', '3 System features'],
  ['S9', 'Release 1 covers booking, payment, visits and e-prescriptions; video consultation is excluded.', '1.3 Project scope'],
];

const GIAI_FRS = [
  { id: 'FR-1', source: 'UC-02', text: 'The system shall display the free 15-minute slots of a selected doctor for the next 14 days.' },
  { id: 'FR-2', source: 'BR-03', text: 'The system shall refuse a booking from a patient who already holds 2 future appointments.' },
  { id: 'FR-3', source: 'BR-02', text: 'The system shall require prepayment through VNPay when the patient has 3 no-shows in the last 90 days.' },
  { id: 'FR-4', source: 'BR-04', text: 'The system shall calculate the visit fee as the service fee plus 10% VAT.' },
  { id: 'FR-5', source: 'BR-01', text: 'The system shall allow a patient to cancel an appointment free of charge up to 2 hours before it starts.' },
  { id: 'FR-6', source: 'UC-17', text: 'The system shall send an SMS reminder to the patient 24 hours before each appointment.' },
  { id: 'FR-7', source: 'UC-13', text: 'The system shall mark an appointment as a no-show when the patient has not checked in 15 minutes after its start.' },
  { id: 'FR-8', source: 'UC-11', text: 'The system shall store the prescription code returned by the National e-Prescription System with each prescription.' },
  { id: 'FR-9', source: 'UC-12', text: 'The system shall let a receptionist record the arrival time of a patient with a booked appointment.' },
];
const GIAI_NFR = {
  performance: 'The system shall display the free slots of a doctor within 2 seconds for 95% of requests with 200 concurrent users.',
  availability: 'The system shall be available 99.5% of the time between 06:00 and 22:00 every day, excluding announced maintenance.',
  security: 'The system shall allow only the doctor of an appointment and the patient to view its visit notes, and shall lock an account for 15 minutes after 5 failed login attempts.',
  usability: 'The system shall let 90% of first-time patients complete a booking within 3 minutes without help.',
};
const GIAI_PL = { TAG: 'Booking.Usability', AMBITION: 'First-time patients book without help.', SCALE: 'Minutes from opening the app to the confirmation screen for a first-time patient.', METER: 'Usability test with 20 first-time patients aged 18–70, 90th percentile.', GOAL: '3 minutes', STRETCH: '2 minutes' };
const GIAI_DD = [
  { element: 'Prescription', type: 'structure', composition: 'Prescription ID + Appointment Code + National Code + Issue Date + 1:n{Prescription Item}', description: 'An e-prescription written by the doctor at the end of a visit.' },
  { element: 'Prescription Item', type: 'structure', composition: 'Medicine ID + Dosage + Quantity + (Doctor Note)', description: 'One medicine of a prescription with its own dosage.' },
  { element: 'Prescription ID', type: 'primitive', dataType: 'alphanumeric', length: 10, values: '"RX" followed by 8 digits', description: 'Identifier inside ClinicCare.' },
  { element: 'Appointment Code', type: 'primitive', dataType: 'alphanumeric', length: 7, values: '"M" followed by 6 digits', description: 'The visit the prescription belongs to.' },
  { element: 'National Code', type: 'primitive', dataType: 'alphanumeric', length: 14, values: 'code returned by the National e-Prescription System', description: 'Proof that the prescription was registered nationally.' },
  { element: 'Issue Date', type: 'primitive', dataType: 'date', length: 10, values: 'yyyy-mm-dd', description: 'Date of the prescription.' },
  { element: 'Medicine ID', type: 'primitive', dataType: 'alphanumeric', length: 8, values: 'code of the clinic medicine list', description: 'The prescribed medicine.' },
  { element: 'Dosage', type: 'primitive', dataType: 'text', length: 60, values: 'e.g. "1 tablet, 3 times a day after meals"', description: 'How to take the medicine.' },
  { element: 'Quantity', type: 'primitive', dataType: 'integer', length: 3, values: '1–999', description: 'Number of units dispensed.' },
  { element: 'Doctor Note', type: 'primitive', dataType: 'text', length: 200, values: 'any text, at most 200 characters', description: 'Optional instruction for this line.' },
];

const KIEM = [
  kiemTuy({ en: 'A — at least 8 functional requirements, well formed, with unique ids and a source (UC-nn or BR-nn)', vi: 'A — ít nhất 8 yêu cầu chức năng, đúng dạng, id không trùng, có nguồn (UC-nn hoặc BR-nn)' }, function () {
    if (typeof FRS === 'undefined' || !Array.isArray(FRS)) return 'FRS is missing';
    if (FRS.length < 8) return 'only ' + FRS.length + ' requirements — write at least 8';
    var seen = {};
    for (var i = 0; i < FRS.length; i++) {
      var r = FRS[i] || {};
      if (!/^FR-[1-9]\d*$/.test(String(r.id))) return 'FRS[' + i + '].id must look like FR-1';
      if (seen[r.id]) return 'duplicate id ' + r.id; seen[r.id] = 1;
      if (!/^(UC|BR)-\d{2}$/.test(String(r.source))) return r.id + ': source must be a use case (UC-02) or a business rule (BR-03)';
    }
    return 'OK';
  }, { nhom: 'f2' }),
  kiemTuy({ en: 'A — each requirement: "The system shall", one shall, no vague word, verifiable length', vi: 'A — mỗi yêu cầu: "The system shall", một shall, không từ mơ hồ, đủ cụ thể' }, function () {
    if (typeof FRS === 'undefined' || !Array.isArray(FRS)) return 'FRS is missing';
    for (var i = 0; i < FRS.length; i++) {
      var t = String((FRS[i] || {}).text || '').trim(), id = (FRS[i] || {}).id;
      if (!/^the system shall\b/i.test(t)) return id + ': start with "The system shall"';
      if ((t.match(/\bshall\b/gi) || []).length !== 1) return id + ': one requirement per statement (exactly one "shall")';
      if (/\b(fast|quickly|user[- ]friendly|easy|easily|efficient|flexible|appropriate|several|some|etc|and\/or|support|robust)\b/i.test(t)) return id + ': remove the vague word';
      if (t.split(/\s+/).length < 9) return id + ': too short to be verifiable';
    }
    return 'OK';
  }, { nhom: 'f2' }),
  ...[
    ['the 2-future-appointment limit (BR-03)', '/(2|two) future|at most 2|more than 2|already holds 2/', 'f1'],
    ['prepayment after 3 no-shows (BR-02)', '/prepay|pay in advance|deposit/', 'f1'],
    ['free cancellation up to 2 hours before (BR-01)', '/cancel/.test(t) && /2 hours|two hours|120 minutes/', 'f1'],
    ['the visit fee with 10% VAT (BR-04)', '/vat|10\\s*%/', 'f1'],
    ['the SMS reminder 24 hours before', '/remind/.test(t) && /24 hours|one day|a day/', 'f1'],
    ['the national prescription code', '/national/.test(t) && /code/', 'f1'],
    ['the no-show 15 minutes after the start', '/no-show|no show/.test(t) && /15 minutes|fifteen minutes/', 'f1'],
  ].map(([ten, bt, nhom], i) => kiemTuy({ en: `A — covers ${ten}`, vi: `A — có yêu cầu cho ${ten}` }, new Function(`
    if (typeof FRS === 'undefined' || !Array.isArray(FRS)) return 'FRS is missing';
    var ok = FRS.some(function (r) { var t = String((r || {}).text || '').toLowerCase(); return ${bt}.test(t); });
    return ok ? 'OK' : ${JSON.stringify(`no requirement for ${ten}`)};`), { nhom, ...(i >= 5 ? { an: true } : {}) })),
  kiemTuy({ en: 'B — four quality requirements, each a measurable "shall" statement without vague words', vi: 'B — bốn yêu cầu chất lượng, mỗi câu "shall" đo được, không từ mơ hồ' }, function () {
    if (typeof NFRS === 'undefined' || !NFRS) return 'NFRS is missing';
    var k = ['performance', 'availability', 'security', 'usability'];
    for (var i = 0; i < k.length; i++) {
      var t = String(NFRS[k[i]] || '');
      if (!/^the system shall\b/i.test(t)) return k[i] + ': start with "The system shall"';
      if (/\b(fast|quickly|user[- ]friendly|easy|easily|efficient|secure|securely|robust|intuitive)\b/i.test(t)) return k[i] + ': remove the vague word';
      if (!/\d/.test(t)) return k[i] + ': add a number';
    }
    return 'OK';
  }, { nhom: 'f3' }),
  kiemTuy({ en: 'B — each quality requirement uses a measure that fits its attribute', vi: 'B — mỗi yêu cầu chất lượng dùng thước đo hợp thuộc tính' }, function () {
    if (typeof NFRS === 'undefined' || !NFRS) return 'NFRS is missing';
    if (!/(second|ms\b|millisecond)/i.test(NFRS.performance) || !/%/.test(NFRS.performance)) return 'performance: a time with a percentile (e.g. within 2 seconds for 95% of requests)';
    if (!/%/.test(NFRS.availability) || !/(\d{1,2}:\d{2}|hour|day|week|month)/i.test(NFRS.availability)) return 'availability: a percentage over a stated period';
    if (!/(only|role|authori|authenti|password|login|log in|lock|encrypt)/i.test(NFRS.security)) return 'security: who may access what, or a concrete protection mechanism';
    if (!/(minute|second|%|first-time|first time|without help|error)/i.test(NFRS.usability)) return 'usability: a task, a user group and a target (time, % success)';
    return 'OK';
  }, { nhom: 'f3' }),
  kiemTuy({ en: 'C — one Planguage requirement with TAG, AMBITION, SCALE, METER and a numeric GOAL', vi: 'C — một yêu cầu Planguage có TAG, AMBITION, SCALE, METER và GOAL có số' }, function () {
    if (typeof PLANGUAGE === 'undefined' || !PLANGUAGE) return 'PLANGUAGE is missing';
    var k = ['TAG', 'AMBITION', 'SCALE', 'METER', 'GOAL'];
    for (var i = 0; i < k.length; i++) if (String(PLANGUAGE[k[i]] || '').trim().length < 3) return k[i] + ' is empty';
    if (/\s/.test(String(PLANGUAGE.TAG).trim())) return 'TAG: one identifier, e.g. Booking.Usability';
    if (!/\d/.test(PLANGUAGE.GOAL)) return 'GOAL needs a number';
    if (!/(test|monitor|log|measure|survey|analytics|tool|sample|percentile)/i.test(PLANGUAGE.METER)) return 'METER: how is it measured?';
    return 'OK';
  }, { nhom: 'f4' }),
  kiemTuy({ en: 'D — the prescription dictionary is closed and well formed', vi: 'D — từ điển đơn thuốc khép kín và đúng dạng' }, new Function(`var d = (${DD_DOC})(); if (d.loi) return d.loi;
    for (var i = 0; i < DATA_DICTIONARY.length; i++) {
      var e = DATA_DICTIONARY[i] || {};
      if (e.type === 'structure') { var t = d.tach(e.composition); if (typeof t === 'string') return e.element + ': ' + t; for (var j = 0; j < t.length; j++) if (!d.ten[d.n(t[j].ten)]) return '"' + t[j].ten + '" is used in ' + e.element + ' but not defined'; }
      else if (e.type === 'primitive') { if (!e.dataType || (!e.length && !e.values)) return e.element + ': give dataType and length or values'; }
      else return e.element + ': type must be primitive or structure';
    }
    return 'OK';`), { nhom: 'f5' }),
  kiemTuy({ en: 'D — a prescription has one or more items; each item carries medicine, dosage and quantity', vi: 'D — đơn có một hay nhiều dòng; mỗi dòng có thuốc, liều, số lượng' }, new Function(`var d = (${DD_DOC})(); if (d.loi) return d.loi;
    var p = d.ten['prescription']; if (!p) return 'define "Prescription"';
    var t = d.tach(p.composition); if (typeof t === 'string') return t;
    var it = t.filter(function (x) { return x.lap; })[0];
    if (!it) return 'the items repeat: write 1:n{Prescription Item}';
    if (it.lap[0] !== 1) return 'a prescription has at least one item ⇒ lower bound 1';
    var item = d.ten[d.n(it.ten)]; if (!item || item.type !== 'structure') return 'define the repeated element as a structure';
    var ti = d.tach(item.composition); if (typeof ti === 'string') return ti;
    var s = ti.map(function (x) { return d.n(x.ten); }).join(' | ');
    return /medicine|drug/.test(s) && /dosage|dose/.test(s) && /quantity|qty/.test(s) ? 'OK' : 'the item needs the medicine, the dosage and the quantity';`), { nhom: 'f5' }),
  kiemTuy({ en: 'D — the national code is part of the prescription; the doctor’s note is optional', vi: 'D — mã quốc gia thuộc đơn; ghi chú của bác sĩ là tuỳ chọn' }, new Function(`var d = (${DD_DOC})(); if (d.loi) return d.loi;
    var p = d.ten['prescription']; if (!p) return 'define "Prescription"';
    var t = d.tach(p.composition); if (typeof t === 'string') return t;
    if (!t.some(function (x) { return /national|code/.test(d.n(x.ten)) && !/appointment/.test(d.n(x.ten)); })) return 'store the code returned by the national system in the prescription';
    var all = DATA_DICTIONARY.filter(function (e) { return e.type === 'structure'; }).map(function (e) { return d.tach(e.composition); }).filter(function (x) { return typeof x !== 'string'; });
    var note = [].concat.apply([], all).filter(function (x) { return /note|instruction|comment/.test(d.n(x.ten)); })[0];
    return note && note.tuyChon ? 'OK' : 'the doctor may add a note to a line ⇒ (Doctor Note) is optional';`), { nhom: 'f5', an: true }),
  ...kiemBang('SRS_SECTION', Object.fromEntries(PB.map((x) => [x[0], x[2]])), { nhom: 'f6', an: ['S8', 'S9'], ten: (k) => `E — SRS section of ${k}`, tenVi: (k) => `E — mục SRS của ${k}`, goiY: { S3: 'it limits how the product may be built', S5: 'it is the connection to another software system', S4: 'something the project relies on but does not control' } }),
];

const TEP = {
  'answers/a-functional.js': [
    "// A. Functional requirements — { id: 'FR-n', source: 'UC-nn' | 'BR-nn', text: 'The system shall …' }\nconst FRS = [\n  { id: 'FR-1', source: 'UC-02', text: '' },\n];\n",
    `// A. One requirement per statement, each traced to its source.\nconst FRS = ${jsLit(GIAI_FRS)};\n`,
  ],
  'answers/b-quality.js': [
    "// B. Quality attributes — measurable \"shall\" statements.\nconst NFRS = { performance: '', availability: '', security: '', usability: '' };\n",
    `// B. Each one: action, measure, unit, conditions.\n${objDong('NFRS', GIAI_NFR)}`,
  ],
  'answers/c-planguage.js': [
    "// C. One quality requirement in Planguage.\nconst PLANGUAGE = { TAG: '', AMBITION: '', SCALE: '', METER: '', GOAL: '', STRETCH: '' };\n",
    `// C. Planguage for the usability requirement.\n${objDong('PLANGUAGE', GIAI_PL)}`,
  ],
  'answers/d-dictionary.js': [
    "// D. Data dictionary of a prescription — Wiegers notation: + composition · m:n{ } repetition · ( ) optional.\nconst DATA_DICTIONARY = [\n  { element: 'Prescription', type: 'structure', composition: 'Prescription ID + …', description: '' },\n];\n",
    `// D. Two structures, eight primitives; 1:n{ } and ( ) carry the rules.\nconst DATA_DICTIONARY = ${jsLit(GIAI_DD)};\n`,
  ],
  'answers/e-sections.js': [
    `// E. One of: ${MUC.join(' | ')}\n${objTrong('SRS_SECTION', Object.fromEntries(PB.map((x) => [x[0], ''])))}`,
    `// E. Context in section 2, features in 3, data in 4, interfaces in 5, quality in 6.\n${objDong('SRS_SECTION', Object.fromEntries(PB.map((x) => [x[0], x[2]])))}`,
  ],
};

const mod = deLon({
  slug: 'swr302-5-project-cliniccare-m5-srs',
  ten: 'ClinicCare project — Milestone 5: The SRS',
  moTaModule: 'Dự án ClinicCare, mốc 5 (chương 5): ≥ 8 yêu cầu chức năng có nguồn (UC/BR) và phủ đủ luật, 4 yêu cầu chất lượng đo được, một yêu cầu Planguage, data dictionary của đơn thuốc, xếp 9 phát biểu vào đúng mục SRS; kèm Góc phỏng vấn.',
  baiHoc: 'swr302-5-1-srs-ieee-830',
  dangBai: 'project',
  tieuDe: 'ClinicCare project — Milestone 5: Software requirements specification',
  phu: { en: 'Running project · milestone 5 of 7 · requirements you can test · 10 marks', vi: 'Dự án xuyên suốt · mốc 5/7 · yêu cầu kiểm được · 10 điểm' },
  moTa: {
    en: `${BOI_CANH.en}<p>Use your use cases (Milestone 3) and models (Milestone 4). Extra fact: the doctor may add a short note to any line of a prescription.</p>
<ol>
<li><b>A.</b> At least 8 functional requirements <code>{ id, source, text }</code>, each traced to a use case (UC-02, UC-11…) or a business rule (BR-01…), together covering BR-01 to BR-04, the 24-hour SMS reminder, the national prescription code and the 15-minute no-show.</li>
<li><b>B.</b> Four quality requirements — performance, availability, security, usability — each measurable.</li>
<li><b>C.</b> One of them rewritten in Planguage.</li>
<li><b>D.</b> The data dictionary of a <b>prescription</b> (structures and primitives, Wiegers notation).</li>
<li><b>E.</b> The SRS section (Wiegers template) for each statement:</li>
</ol>${bangHtml(['#', 'Statement'], PB.map((x) => [x[0], x[1]]))}`,
    vi: `${BOI_CANH.vi}<p>Dùng use case (mốc 3) và mô hình (mốc 4). Thêm: bác sĩ có thể ghi chú ngắn cho từng dòng đơn.</p><ol><li>A. ≥ 8 yêu cầu chức năng có nguồn (UC/BR), phủ BR-01…BR-04, nhắc SMS 24 giờ, mã đơn quốc gia, no-show 15 phút.</li><li>B. Bốn yêu cầu chất lượng đo được.</li><li>C. Một yêu cầu viết lại bằng Planguage.</li><li>D. Data dictionary của <b>đơn thuốc</b>.</li><li>E. Mục SRS cho từng phát biểu (bảng ở bản tiếng Anh).</li></ol>`,
  },
  chucNangChinh: [{ en: 'A. Functional requirements.', vi: 'A. Yêu cầu chức năng.' }, { en: 'B. Quality requirements.', vi: 'B. Yêu cầu chất lượng.' }, { en: 'C. Planguage.', vi: 'C. Planguage.' }, { en: 'D. Data dictionary.', vi: 'D. Data dictionary.' }, { en: 'E. SRS sections.', vi: 'E. Mục SRS.' }],
  yeuCauChung: [{ en: 'Every requirement verifiable; every functional requirement traced to its source.', vi: 'Mọi yêu cầu kiểm được; mọi yêu cầu chức năng truy được về nguồn.' }],
  cayThuMuc: `answers/
├── a-functional.js   ← const FRS = [ { id, source, text }, … ]
├── b-quality.js      ← const NFRS = { performance, availability, security, usability }
├── c-planguage.js    ← const PLANGUAGE = { TAG, AMBITION, SCALE, METER, GOAL, STRETCH }
├── d-dictionary.js   ← const DATA_DICTIONARY = [ { element, type, composition | dataType+length+values, description } ]
└── e-sections.js     ← const SRS_SECTION = { S1: '…', … }`,
  moHinh: { ten: 'Answer records', truong: [
    ['FRS[i]', "{ id: 'FR-n', source: 'UC-nn' | 'BR-nn', text }", { en: 'one "shall" each', vi: 'mỗi câu một "shall"' }],
    ['NFRS', '{ performance, availability, security, usability }', { en: 'numbers and units', vi: 'có số và đơn vị' }],
    ['DATA_DICTIONARY[i]', '{ element, type: structure | primitive, … }', { en: 'closed: every name used is defined', vi: 'khép kín: tên nào dùng cũng được định nghĩa' }],
  ] },
  chucNang: [
    { ten: { en: 'A1. Coverage of the rules', vi: 'A1. Phủ các luật' }, diem: 2, yeuCau: [{ en: 'BR-01…04, reminder, national code, no-show.', vi: 'BR-01…04, nhắc lịch, mã quốc gia, no-show.' }], hook: ['functional requirements'] },
    { ten: { en: 'A2. Quality of the statements', vi: 'A2. Chất lượng câu' }, diem: 1.5, yeuCau: [{ en: 'Ids, sources, one shall, no vague words.', vi: 'Id, nguồn, một shall, không từ mơ hồ.' }], hook: ['writing requirements'] },
    { ten: { en: 'B. Quality requirements', vi: 'B. Yêu cầu chất lượng' }, diem: 1.5, yeuCau: [{ en: 'Measurable, right measure.', vi: 'Đo được, đúng thước đo.' }], hook: ['quality attributes'] },
    { ten: { en: 'C. Planguage', vi: 'C. Planguage' }, diem: 1, yeuCau: [{ en: 'Scale, meter, numeric goal.', vi: 'Scale, meter, goal có số.' }], hook: ['Planguage'] },
    { ten: { en: 'D. Data dictionary', vi: 'D. Data dictionary' }, diem: 2, yeuCau: [{ en: 'Closed; repetition and optional elements.', vi: 'Khép kín; lặp và tuỳ chọn.' }], hook: ['data dictionary'] },
    { ten: { en: 'E. SRS sections', vi: 'E. Mục SRS' }, diem: 2, yeuCau: [{ en: 'Wiegers template.', vi: 'Template Wiegers.' }], hook: ['SRS template'] },
  ],
  idBatBuoc: [['FRS', 'answers/a-functional.js'], ['NFRS', 'answers/b-quality.js'], ['PLANGUAGE', 'answers/c-planguage.js'], ['DATA_DICTIONARY', 'answers/d-dictionary.js'], ['SRS_SECTION', 'answers/e-sections.js']],
  truDiem: [
    { en: 'A requirement with no source — nobody can tell why it exists (gold plating risk).', vi: 'Yêu cầu không nguồn — không ai biết vì sao có nó (nguy cơ mạ vàng).' },
    { en: '"The system shall be secure." — not verifiable.', vi: '"The system shall be secure." — không kiểm được.' },
    { en: '"Prescription = … + Prescription Items" without 1:n{ } — the repetition and its lower bound are business rules.', vi: '"Prescription = … + Prescription Items" thiếu 1:n{ } — sự lặp và cận dưới là luật nghiệp vụ.' },
  ],
  goiY: [
    'A: đi từng luật BR-01…BR-04 và từng bước use case, mỗi thứ ra một câu "The system shall …" có nguồn.',
    'B: hiệu năng = thời gian + phân vị + tải; sẵn sàng = % trong khung giờ; bảo mật = ai được xem gì / cơ chế; khả dụng = nhóm người dùng + tác vụ + mục tiêu.',
    'E: phần 2 là bối cảnh (người dùng, môi trường, ràng buộc, giả định); 5.2 là giao diện phần mềm.',
  ],
  loiHayGap: ['Gộp hai luật vào một câu (hai "shall").', 'Xếp S3 (định dạng của Bộ Y tế) vào quality attributes.', 'Quên định nghĩa primitive đã dùng trong structure.'],
  giaiThich: {
    en: '<p>A slice of a real SRS: functional requirements derived from use cases and rules and traced back to them; quality requirements with numbers; one in Planguage; a closed data dictionary where the repetition (1:n items) and the optional note encode business facts; and the statements of the case filed in the right sections of the Wiegers template. The reference solution is in the answer files.</p>',
    vi: '<p>Một lát cắt SRS thật: yêu cầu chức năng suy từ use case và luật, truy ngược được; yêu cầu chất lượng có số; một yêu cầu bằng Planguage; data dictionary khép kín trong đó sự lặp (1:n dòng) và ghi chú tuỳ chọn mã hoá sự thật nghiệp vụ; các phát biểu của đề nằm đúng mục template Wiegers. Lời giải tham chiếu ở các tệp đáp án.</p>',
  },
  khaiNiem: ['SRS', 'functional requirements', 'quality attributes', 'Planguage', 'data dictionary'],
  tienQuyet: ['Milestones 3–4', 'SWR302 lessons 5.1–5.8'],
  thuatNgu: tn('srs', 'functionalReq', 'nfr', 'qualityAttr', 'planguage', 'dataDictionary', 'verifiable'),
  moTaNgan: 'Dự án ClinicCare mốc 5: yêu cầu chức năng, chất lượng, Planguage, data dictionary, mục SRS.',
  phut: 80,
  tep: TEP,
  kiem: KIEM,
  boYeu: [{ ten: 'yêu cầu mơ hồ, không nguồn, NFR không số', tep: {
    'answers/a-functional.js': "const FRS = [1,2,3,4,5,6,7,8].map(function (i) { return { id: 'FR-' + i, source: '', text: 'The system shall support booking and cancellation of appointments easily for patients.' }; });\n",
    'answers/b-quality.js': "const NFRS = { performance: 'The system shall be fast.', availability: 'The system shall always be available.', security: 'The system shall be secure.', usability: 'The system shall be user-friendly.' };\n",
  } }],
});

mod.de.push(phongVan({
  moc: 'the SRS',
  khaiNiem: ['SRS', 'verifiable requirements'],
  thuatNgu: tn('srs', 'verifiable', 'nfr'),
  cau: [
    { en: '"What makes a requirement testable?"', vi: '"Điều gì làm một yêu cầu kiểm thử được?"', lc: [['a', '"It states one behaviour or quality with concrete values and conditions, so a tester can write a pass/fail test — ‘free slots appear within 2 seconds for 95% of requests’, not ‘search is fast’."'], ['b', '"It is approved by the manager."'], ['c', '"It is written in bold."'], ['d', '"It mentions a test tool."']], dap: 'a', giai: ['Concrete values and conditions ⇒ pass/fail.', 'Giá trị và điều kiện cụ thể ⇒ đạt/trượt.'] },
    { en: '"How do you handle a non-functional requirement like ‘the system must be secure’?"', vi: '"Bạn xử lý yêu cầu phi chức năng kiểu ‘hệ thống phải an toàn’ thế nào?"', lc: [['a', '"I ask what is being protected, from whom, and what would be unacceptable, then write specific requirements: who may see visit notes, account lock-out after failed logins, encryption of personal data — each verifiable."'], ['b', '"I copy it into the SRS as it is."'], ['c', '"I leave it to the developers."'], ['d', '"I delete it because it cannot be tested."']], dap: 'a', giai: ['Elicit and decompose into specific, verifiable statements.', 'Khai thác và tách thành câu cụ thể, kiểm được.'] },
    { en: '"Why trace every functional requirement to a source?"', vi: '"Vì sao truy mỗi yêu cầu chức năng về nguồn?"', lc: [['a', '"So we know why it exists, who to ask about it, what to change when the source changes, and to spot gold plating — a requirement with no source."'], ['b', '"Because the template has a column for it."'], ['c', '"To make the document longer."'], ['d', '"Only auditors care."']], dap: 'a', giai: ['Rationale, change impact, gold plating.', 'Lý do, ảnh hưởng thay đổi, mạ vàng.'] },
    { en: '"Does an agile team need an SRS?"', vi: '"Đội agile có cần SRS không?"', lc: [['a', '"Not necessarily as one big document, but the same information must exist somewhere — stories with acceptance criteria, quality requirements, rules and data definitions — at the level of detail the team and any regulator need."'], ['b', '"No, agile has no requirements."'], ['c', '"Yes, always 100 pages before coding."'], ['d', '"Only for the testers."']], dap: 'a', giai: ['Content matters, not the format.', 'Quan trọng là nội dung, không phải hình thức.'] },
  ],
}));

export default mod;
