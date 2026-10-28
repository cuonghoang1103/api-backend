/**
 * SWR302 · DEEP LAB 3 — Elicitation tracker: CRUD gaps (finding missing requirements), user-class coverage, open questions.
 */
import { tn } from './_chung.mjs';
import { deLon } from './_lab.mjs';
import { kiemCa, preJson } from './_deep.mjs';

const ENTITIES = ['Patient', 'Appointment', 'Doctor', 'Prescription', 'Invoice'];
const CRUD = [
  { uc: 'UC-01 Register', entity: 'Patient', ops: 'C' },
  { uc: 'UC-02 Book appointment', entity: 'Appointment', ops: 'C' },
  { uc: 'UC-02 Book appointment', entity: 'Doctor', ops: 'R' },
  { uc: 'UC-03 Cancel appointment', entity: 'Appointment', ops: 'u d' },
  { uc: 'UC-04 View history', entity: 'Patient', ops: 'r' },
  { uc: 'UC-04 View history', entity: 'Prescription', ops: 'R' },
  { uc: 'UC-05 Write prescription', entity: 'Prescription', ops: 'CU' },
  { uc: 'UC-06 Pay', entity: 'Invoice', ops: 'RU' },
  { uc: 'UC-07 Edit profile', entity: 'Patient', ops: 'U' },
  { uc: 'UC-08 Rate doctor', entity: 'Review', ops: 'C' },
];
const USER_CLASSES = ['Patient', 'Doctor', 'Receptionist', 'Pharmacist', 'Clinic manager'];
const SESSIONS = [
  { id: 'S1', technique: 'Interview', participants: [{ name: 'Lan', userClass: 'Patient' }, { name: 'Minh', userClass: 'Patient' }] },
  { id: 'S2', technique: 'Workshop', participants: [{ name: 'Dr. Hoa', userClass: 'Doctor' }, { name: 'Thu', userClass: 'Receptionist' }, { name: 'Lan', userClass: 'Patient' }] },
  { id: 'S3', technique: 'Observation', participants: [{ name: 'Thu', userClass: 'Receptionist' }] },
  { id: 'S4', technique: 'Interview', participants: [{ name: 'Dr. Hoa', userClass: 'Doctor' }, { name: 'Dr. Hoa', userClass: 'Doctor' }] },
  { id: 'S5', technique: 'Questionnaire', participants: [{ name: 'Anon', userClass: 'Visitor' }] },
];
const TOPICS = ['Booking rules', 'Cancellation fee', 'Payment methods', 'Prescription format', 'Reports'];
const NOTES = [
  { session: 'S1', topic: 'Booking rules', status: 'answered' },
  { session: 'S2', topic: 'Cancellation fee', status: 'open' },
  { session: 'S3', topic: 'Cancellation fee', status: 'TBD' },
  { session: 'S2', topic: 'Payment methods', status: 'answered' },
  { session: 'S4', topic: 'Prescription format', status: 'open' },
  { session: 'S4', topic: 'Prescription format', status: 'answered' },
  { session: 'S5', topic: 'Parking', status: 'open' },
];

const G = `function crudGaps(entities, matrix) {
  var have = Object.create(null), known = Object.create(null), unknown = Object.create(null);
  entities.forEach(function (e) { known[e] = true; have[e] = {}; });
  matrix.forEach(function (row) {
    if (!known[row.entity]) { unknown[row.entity] = true; return; }
    String(row.ops || '').toUpperCase().split('').forEach(function (c) { if ('CRUD'.indexOf(c) >= 0) have[row.entity][c] = true; });
  });
  var gaps = [];
  entities.forEach(function (e) {
    var miss = ['C', 'R', 'U', 'D'].filter(function (c) { return !have[e][c]; });
    if (miss.length) gaps.push({ entity: e, missing: miss });
  });
  return { gaps: gaps, unknown: Object.keys(unknown).sort() };
}

function classCoverage(userClasses, sessions) {
  var cls = Object.create(null);
  userClasses.forEach(function (c) { cls[c] = { s: Object.create(null), t: Object.create(null) }; });
  var unknown = Object.create(null);
  sessions.forEach(function (s) {
    (s.participants || []).forEach(function (p) {
      if (!cls[p.userClass]) { unknown[p.userClass] = true; return; }
      cls[p.userClass].s[s.id] = true; cls[p.userClass].t[s.technique] = true;
    });
  });
  var perClass = {}, techniques = {};
  userClasses.forEach(function (c) { perClass[c] = Object.keys(cls[c].s).length; techniques[c] = Object.keys(cls[c].t).sort(); });
  return {
    uncovered: userClasses.filter(function (c) { return perClass[c] === 0; }),
    perClass: perClass, techniques: techniques, unknownClasses: Object.keys(unknown).sort(),
  };
}

function openQuestions(topics, notes) {
  var answered = Object.create(null), open = [];
  notes.forEach(function (n) { if (n.status === 'answered') answered[n.topic] = true; });
  notes.forEach(function (n) {
    if (n.status !== 'answered' && topics.indexOf(n.topic) >= 0 && !answered[n.topic]) open.push(n.topic + ' (' + n.session + ')');
  });
  return { unanswered: topics.filter(function (t) { return !answered[t]; }), open: open };
}
`;
const D = `var ENTITIES = ${JSON.stringify(ENTITIES)}; var CRUD = ${JSON.stringify(CRUD)}; var USER_CLASSES = ${JSON.stringify(USER_CLASSES)}; var SESSIONS = ${JSON.stringify(SESSIONS)}; var TOPICS = ${JSON.stringify(TOPICS)}; var NOTES = ${JSON.stringify(NOTES)};\n`;
const GD = D + G;

const CA = [
  { moTa: { en: 'crudGaps: missing operations per entity (ClinicCare)', vi: 'crudGaps: thao tác còn thiếu mỗi thực thể (ClinicCare)' }, goi: 'crudGaps(ENTITIES, CRUD).gaps', mong: [{ entity: 'Patient', missing: ['D'] }, { entity: 'Appointment', missing: ['R'] }, { entity: 'Doctor', missing: ['C', 'U', 'D'] }, { entity: 'Prescription', missing: ['D'] }, { entity: 'Invoice', missing: ['C', 'D'] }], nhom: 'f1' },
  { moTa: { en: 'crudGaps: a complete entity has no gap', vi: 'crudGaps: thực thể đủ CRUD thì không có lỗ' }, goi: `crudGaps(['Room'], [{ uc: 'a', entity: 'Room', ops: 'cr' }, { uc: 'b', entity: 'Room', ops: 'U,D' }])`, mong: { gaps: [], unknown: [] }, nhom: 'f1' },
  { moTa: { en: 'crudGaps (hidden): letters other than CRUD are ignored, order kept', vi: 'crudGaps (ẩn): ký tự khác CRUD bị bỏ qua, giữ thứ tự' }, goi: `crudGaps(['B', 'A', 'toString'], [{ uc: 'x', entity: 'A', ops: 'Create? no: XRL' }, { uc: 'y', entity: 'B', ops: '' }, { uc: 'z', entity: 'toString', ops: 'CRUD' }])`, nhom: 'f1', an: true },
  { moTa: { en: 'crudGaps: entities used by use cases but not in the model', vi: 'crudGaps: thực thể use case dùng nhưng không có trong mô hình' }, goi: 'crudGaps(ENTITIES, CRUD).unknown', mong: ['Review'], nhom: 'f2' },
  { moTa: { en: 'classCoverage: uncovered user classes', vi: 'classCoverage: lớp người dùng chưa được khai thác' }, goi: 'classCoverage(USER_CLASSES, SESSIONS).uncovered', mong: ['Pharmacist', 'Clinic manager'], nhom: 'f3' },
  { moTa: { en: 'classCoverage: distinct sessions per class', vi: 'classCoverage: số buổi khác nhau mỗi lớp' }, goi: 'classCoverage(USER_CLASSES, SESSIONS).perClass', mong: { Patient: 2, Doctor: 2, Receptionist: 2, Pharmacist: 0, 'Clinic manager': 0 }, nhom: 'f3' },
  { moTa: { en: 'classCoverage: techniques per class and unknown classes', vi: 'classCoverage: kỹ thuật mỗi lớp và lớp lạ' }, goi: '(function () { var r = classCoverage(USER_CLASSES, SESSIONS); return [r.techniques, r.unknownClasses]; })()', nhom: 'f3' },
  { moTa: { en: 'openQuestions: unanswered topics and open notes', vi: 'openQuestions: chủ đề chưa trả lời và ghi chú còn mở' }, goi: 'openQuestions(TOPICS, NOTES)', mong: { unanswered: ['Cancellation fee', 'Reports'], open: ['Cancellation fee (S2)', 'Cancellation fee (S3)'] }, nhom: 'f4' },
  { moTa: { en: 'openQuestions (hidden): an answer in a later session closes earlier open notes', vi: 'openQuestions (ẩn): câu trả lời ở buổi sau đóng ghi chú mở trước đó' }, goi: `openQuestions(['T1', 'T2'], [{ session: 'A', topic: 'T1', status: 'open' }, { session: 'B', topic: 'T2', status: 'TBD' }, { session: 'C', topic: 'T1', status: 'answered' }, { session: 'D', topic: 'T3', status: 'open' }])`, nhom: 'f4', an: true },
  { moTa: { en: 'empty inputs', vi: 'đầu vào rỗng' }, goi: '[crudGaps([], []), classCoverage([], []), openQuestions([], [])]', mong: [{ gaps: [], unknown: [] }, { uncovered: [], perClass: {}, techniques: {}, unknownClasses: [] }, { unanswered: [], open: [] }], nhom: 'f5' },
  { moTa: { en: 'hidden: user class named "constructor" is counted correctly', vi: 'ẩn: lớp tên "constructor" được đếm đúng' }, goi: `classCoverage(['constructor', 'X'], [{ id: 'S', technique: 'Interview', participants: [{ name: 'a', userClass: 'X' }] }])`, nhom: 'f5', an: true },
];
const KIEM = kiemCa(GD, CA);

const DATA = `// Sample data (read-only) — ClinicCare elicitation so far.\nconst ENTITIES = ${JSON.stringify(ENTITIES)};\nconst CRUD = ${JSON.stringify(CRUD, null, 1)};\nconst USER_CLASSES = ${JSON.stringify(USER_CLASSES)};\nconst SESSIONS = ${JSON.stringify(SESSIONS, null, 1)};\nconst TOPICS = ${JSON.stringify(TOPICS)};\nconst NOTES = ${JSON.stringify(NOTES, null, 1)};\n`;
const TEP = {
  'answers/sample-data.js': [DATA, DATA],
  'answers/tracker.js': ["function crudGaps(entities, matrix) { return { gaps: [], unknown: [] }; }\nfunction classCoverage(userClasses, sessions) { return { uncovered: [], perClass: {}, techniques: {}, unknownClasses: [] }; }\nfunction openQuestions(topics, notes) { return { unanswered: [], open: [] }; }\n", G],
};

export default deLon({
  slug: 'swr302-3-deep-elicitation-tracker',
  ten: 'Deep Lab 3 — Elicitation tracker',
  moTaModule: 'Deep Lab chương 3: tự viết bộ theo dõi khai thác — ma trận CRUD tìm yêu cầu còn thiếu (Wiegers Ch.7), độ phủ lớp người dùng theo buổi và kỹ thuật, câu hỏi còn mở/TBD theo chủ đề — chấm mẫu ClinicCare + dữ liệu ẩn.',
  baiHoc: 'swr302-3-6-ch7-done-missing',
  dangBai: 'deep-lab',
  tieuDe: 'Deep Lab 3 — Elicitation tracker (CRUD gaps, class coverage, open questions)',
  phu: { en: 'Chapter 3 deep lab · knowing when you are done, finding missing requirements · 10 marks · hidden data on Submit', vi: 'Deep lab chương 3 · biết khi nào xong, tìm yêu cầu còn thiếu · 10 điểm · dữ liệu ẩn khi Nộp' },
  moTa: {
    en: `<p>Wiegers (Ch.7): you are never sure elicitation is finished, but you can look for signs — every user class heard from, every data object created, read, updated and deleted somewhere, no open questions left. Build three checks for the <b>ClinicCare</b> analyst.</p>
<ul>
<li><b>A/B. <code>crudGaps(entities, matrix)</code></b> — the CRUD matrix lists which use case creates (C), reads (R), updates (U) or deletes (D) which entity; <code>ops</code> is free text (case-insensitive; any character other than C, R, U, D is ignored). Return <code>{ gaps, unknown }</code>: for each entity <b>in the given order</b> that lacks any operation, <code>{ entity, missing }</code> with the missing letters in CRUD order; <code>unknown</code>: sorted, unique entity names used in the matrix but not in the model.</li>
<li><b>C. <code>classCoverage(userClasses, sessions)</code></b> — return <code>{ uncovered, perClass, techniques, unknownClasses }</code>: classes (in order) with no participant; number of <b>distinct sessions</b> per class; sorted unique techniques per class; sorted classes of participants not in the list.</li>
<li><b>D. <code>openQuestions(topics, notes)</code></b> — a topic is answered when any note has status "answered". Return <code>{ unanswered, open }</code>: topics (in order) not answered; and, in note order, <code>"&lt;topic&gt; (&lt;session&gt;)"</code> for every non-answered note of a listed topic that is still unanswered.</li>
</ul>
<p><b>Sample data</b>:</p>${preJson('ENTITIES', ENTITIES)}${preJson('CRUD', CRUD)}${preJson('USER_CLASSES', USER_CLASSES)}${preJson('SESSIONS', SESSIONS)}${preJson('TOPICS', TOPICS)}${preJson('NOTES', NOTES)}`,
    vi: `<p>Wiegers (Ch.7): không bao giờ chắc đã khai thác xong, nhưng có dấu hiệu — đã nghe mọi lớp người dùng, mỗi đối tượng dữ liệu đều được tạo/đọc/sửa/xoá ở đâu đó, không còn câu hỏi mở. Viết ba phép kiểm cho BA của ClinicCare.</p>
<ul><li>A/B. <code>crudGaps</code> — với mỗi thực thể (đúng thứ tự) thiếu thao tác nào; thực thể lạ trong ma trận.</li><li>C. <code>classCoverage</code> — lớp chưa có ai tham gia; số buổi KHÁC NHAU mỗi lớp; kỹ thuật mỗi lớp; lớp lạ.</li><li>D. <code>openQuestions</code> — chủ đề chưa có câu trả lời; ghi chú chưa trả lời của chủ đề vẫn còn mở.</li></ul>`,
  },
  chucNangChinh: [
    { en: 'A. CRUD gaps.', vi: 'A. Lỗ hổng CRUD.' }, { en: 'B. Unknown entities.', vi: 'B. Thực thể lạ.' },
    { en: 'C. User-class coverage.', vi: 'C. Độ phủ lớp người dùng.' }, { en: 'D. Open questions.', vi: 'D. Câu hỏi còn mở.' }, { en: 'E. Robustness.', vi: 'E. Độ bền.' },
  ],
  yeuCauChung: [{ en: 'Pure functions; keep the given orders where stated; names such as "constructor" must work.', vi: 'Hàm thuần; giữ thứ tự khi đề yêu cầu; tên như "constructor" phải chạy đúng.' }],
  cayThuMuc: `answers/
├── sample-data.js   ← ENTITIES, CRUD, USER_CLASSES, SESSIONS, TOPICS, NOTES
└── tracker.js       ← crudGaps, classCoverage, openQuestions`,
  moHinh: { ten: 'Data shapes', truong: [
    ['matrix row', '{ uc, entity, ops }', { en: 'ops: free text with C R U D', vi: 'ops: chuỗi tự do chứa C R U D' }],
    ['session', '{ id, technique, participants[{ name, userClass }] }', { en: 'a person may be listed twice', vi: 'một người có thể bị liệt kê hai lần' }],
    ['note', "{ session, topic, status: 'answered' | 'open' | 'TBD' }", { en: '', vi: '' }],
  ] },
  chucNang: [
    { ten: { en: 'A. crudGaps — gaps', vi: 'A. crudGaps — lỗ hổng' }, diem: 3, yeuCau: [{ en: 'Missing letters in CRUD order, entities in model order.', vi: 'Chữ thiếu theo thứ tự CRUD, thực thể theo thứ tự mô hình.' }], hook: ['CRUD matrix'] },
    { ten: { en: 'B. crudGaps — unknown', vi: 'B. crudGaps — thực thể lạ' }, diem: 1, yeuCau: [{ en: 'Sorted, unique.', vi: 'Sắp xếp, không trùng.' }], hook: ['data model'] },
    { ten: { en: 'C. classCoverage', vi: 'C. classCoverage' }, diem: 3, yeuCau: [{ en: 'Distinct sessions; techniques; unknown classes.', vi: 'Số buổi khác nhau; kỹ thuật; lớp lạ.' }], hook: ['user classes'] },
    { ten: { en: 'D. openQuestions', vi: 'D. openQuestions' }, diem: 2, yeuCau: [{ en: 'Any answer closes the topic.', vi: 'Có một câu trả lời là đóng chủ đề.' }], hook: ['issue tracking'] },
    { ten: { en: 'E. Robustness', vi: 'E. Độ bền' }, diem: 1, yeuCau: [{ en: 'Empty inputs; tricky names.', vi: 'Đầu vào rỗng; tên đánh lừa.' }], hook: ['defensive code'] },
  ],
  idBatBuoc: [['crudGaps · classCoverage · openQuestions', 'answers/tracker.js']],
  truDiem: [
    { en: 'Counting the same session twice for a class because two of its people attended.', vi: 'Đếm một buổi hai lần cho một lớp vì có hai người tham dự.' },
    { en: 'Treating "u d" as unknown because of the space or lower case.', vi: 'Coi "u d" là sai vì có khoảng trắng hoặc chữ thường.' },
  ],
  goiY: ['CRUD: toUpperCase() rồi xét từng ký tự.', 'Số buổi khác nhau: lưu id buổi vào một tập theo lớp.', 'Câu hỏi: duyệt một lượt để biết chủ đề nào đã có câu trả lời, lượt hai để liệt kê ghi chú mở.'],
  loiHayGap: ['Liệt kê thực thể lạ (Review) như một lỗ hổng.', 'Đếm số người thay vì số buổi.'],
  giaiThich: {
    en: '<p>The CRUD gaps are leads for missing requirements: nobody can delete a patient (data-retention rule?), nobody reads appointments outside booking (a schedule view is missing), doctors are never created or updated (who maintains the doctor list?), invoices are never created (where do they come from?). "Review" is used but not modelled. Pharmacists and the clinic manager were never heard from, and the cancellation fee is still open — elicitation is not done yet.</p>',
    vi: '<p>Lỗ hổng CRUD là manh mối cho yêu cầu còn thiếu: không ai xoá bệnh nhân (luật lưu trữ?), không ai đọc lịch hẹn ngoài lúc đặt (thiếu màn hình lịch), bác sĩ không bao giờ được tạo/sửa (ai quản lý danh sách bác sĩ?), hoá đơn không được tạo (từ đâu ra?). "Review" được dùng nhưng chưa có trong mô hình. Chưa nghe dược sĩ và quản lý phòng khám, phí huỷ vẫn còn mở — khai thác chưa xong.</p>',
  },
  khaiNiem: ['CRUD matrix', 'finding missing requirements', 'user class coverage'],
  tienQuyet: ['Lab 3', 'SWR302 lesson 3.6'],
  thuatNgu: [...tn('crud', 'userClass', 'elicitation', 'tbd')],
  moTaNgan: 'Deep lab chương 3: bộ theo dõi khai thác — CRUD, lớp người dùng, câu hỏi mở.',
  phut: 70,
  tep: TEP,
  kiem: KIEM,
  boYeu: [{ ten: 'đếm người, phân biệt hoa thường', tep: { 'answers/tracker.js': "function crudGaps(es,m){ var h={}; es.forEach(function(e){h[e]='';}); var u=[]; m.forEach(function(r){ if(!(r.entity in h)){ if(u.indexOf(r.entity)<0) u.push(r.entity); return;} h[r.entity]+=r.ops; }); var g=[]; es.forEach(function(e){ var mi=['C','R','U','D'].filter(function(c){return h[e].indexOf(c)<0;}); if(mi.length) g.push({entity:e,missing:mi}); }); return {gaps:g,unknown:u.sort()}; }\nfunction classCoverage(cs,ss){ var p={},t={}; cs.forEach(function(c){p[c]=0;t[c]=[];}); ss.forEach(function(s){ s.participants.forEach(function(x){ if(x.userClass in p){ p[x.userClass]++; if(t[x.userClass].indexOf(s.technique)<0) t[x.userClass].push(s.technique);} }); }); return {uncovered:cs.filter(function(c){return !p[c];}),perClass:p,techniques:t,unknownClasses:[]}; }\nfunction openQuestions(ts,ns){ return {unanswered:ts.filter(function(t){ return !ns.some(function(n){return n.topic===t&&n.status==='answered';}); }), open:ns.filter(function(n){return n.status!=='answered';}).map(function(n){return n.topic+' ('+n.session+')';})}; }\n" } }],
});
