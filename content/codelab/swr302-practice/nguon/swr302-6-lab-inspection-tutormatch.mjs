/**
 * SWR302 · LAB 6 — Validation: inspecting the SRS of TutorMatch (Wiegers Ch.17).
 * A. danh sách lỗi (dòng + loại + cách sửa) trên trích đoạn SRS 16 dòng — chấm bằng kiemReview (ghép cặp tối đa, khẳng định sai bị trừ) ·
 * B. các giai đoạn và vai trò của inspection · C. tiêu chí chấp nhận Given/When/Then · D. verification hay validation.
 */
import { tn, kiemTuy, preMa, kiemKhoa } from './_chung.mjs';
import { kiemReview } from '../../swt301-practice/nguon/_chung.mjs';
import { deLon, kiemBang, objDong, objTrong } from './_lab.mjs';

const SRS = [
  'TM-01  The system shall let a student register as a tutor for a subject passed with a grade of at least 8.0.',
  'TM-02  The system shall let a tutee search tutors by subject, campus and available time.',
  'TM-03  Search results shall be displayed quickly.',
  'TM-04  The system shall let a tutee book a 60-minute session with a tutor.',
  'TM-05  A tutee shall be able to book at most 3 sessions per calendar week.',
  'TM-06  The system shall let a tutee book up to 5 sessions per week.',
  'TM-07  The system shall store sessions in a MongoDB collection named "sessions".',
  'TM-08  When a tutor cancels a session less than 12 hours before it starts, the system shall take appropriate action.',
  'TM-09  The system shall pay the tutor 50,000 VND per completed session through the campus e-wallet.',
  'TM-10  Each tutoring session lasts 90 minutes.',
  'TM-11  The system shall let the tutee rate the tutor, the platform and the meeting room after a session.',
  'TM-12  The system shall show a 3D animated mascot on the home page.',
  'TM-13  The system shall remind both participants TBD hours before the session.',
  'TM-14  Only tutors whose average rating is above 4.5 shall appear in search results.',
  'TM-15  The system shall let a tutee book a session with a tutor.',
  'TM-16  The system shall be available 24/7 with zero downtime.',
];
const LOAI = ['AMBIGUOUS', 'UNVERIFIABLE', 'INCOMPLETE', 'INCONSISTENT', 'INCORRECT', 'INFEASIBLE', 'UNNECESSARY', 'DESIGN', 'COMPOUND', 'DUPLICATE'];
const KHOA = [
  { ma: 'k3', dong: [3], loai: ['UNVERIFIABLE', 'AMBIGUOUS'], ten: 'TM-03 "quickly" cannot be tested' },
  { ma: 'k6', dong: [6], loai: ['INCONSISTENT'], ten: 'TM-06 contradicts TM-05 (5 vs 3 sessions per week)', tenVi: 'TM-06 mâu thuẫn TM-05 (5 so với 3 buổi/tuần)', nang: true },
  { ma: 'k7', dong: [7], loai: ['DESIGN'], ten: 'TM-07 states a design decision (MongoDB)' },
  { ma: 'k8', dong: [8], loai: ['INCOMPLETE', 'AMBIGUOUS'], ten: 'TM-08 "appropriate action" — the response is undefined' },
  { ma: 'k10', dong: [10, 4], loai: ['INCONSISTENT'], ten: 'TM-10 90 minutes vs TM-04 60 minutes' },
  { ma: 'k11', dong: [11], loai: ['COMPOUND'], ten: 'TM-11 three ratings in one requirement' },
  { ma: 'k12', dong: [12], loai: ['UNNECESSARY'], ten: 'TM-12 gold plating — traces to no business objective' },
  { ma: 'k13', dong: [13], loai: ['INCOMPLETE'], ten: 'TM-13 TBD left open' },
  { ma: 'k14', dong: [14], loai: ['INCORRECT', 'INCONSISTENT'], ten: 'TM-14 contradicts BR-2 (new tutors without a rating must be listed)', tenVi: 'TM-14 trái BR-2 (gia sư mới chưa có điểm vẫn phải hiện)', nang: true },
  { ma: 'k15', dong: [15], loai: ['DUPLICATE'], ten: 'TM-15 duplicates TM-04' },
  { ma: 'k16', dong: [16], loai: ['INFEASIBLE', 'UNVERIFIABLE'], ten: 'TM-16 zero downtime is infeasible and cannot be verified' },
];
const SAI = [
  { dong: [1], ten: 'TM-01 is a correct requirement (it traces to BR-1)' },
  { dong: [5], ten: 'TM-05 matches BR-3 — the line to change is TM-06' },
  { dong: [2], ten: 'TM-02 is a correct requirement' },
  { dong: [9], ten: 'TM-09 is a correct requirement' },
];
const GIAI_ISSUES = [
  { line: 3, type: 'UNVERIFIABLE', severity: 'Medium', description: '"quickly" has no measure, so no test can pass or fail it.', fix: 'The system shall display search results within 2 seconds for 95% of searches with 300 concurrent users.' },
  { line: 6, type: 'INCONSISTENT', severity: 'High', description: 'TM-06 allows 5 sessions per week while TM-05 allows at most 3.', fix: 'Ask the product owner which limit is right, keep one rule (3 per week, BR-3) and delete TM-06.' },
  { line: 7, type: 'DESIGN', severity: 'Low', description: 'Names the database product and collection — a design decision, not a need.', fix: 'Remove it from the SRS; state only what must be kept (sessions kept for 12 months).' },
  { line: 8, type: 'INCOMPLETE', severity: 'High', description: '"take appropriate action" leaves the system response undefined.', fix: 'State the response: notify the tutee within 1 minute, release the slot and record a late cancellation for the tutor.' },
  { line: 10, type: 'INCONSISTENT', severity: 'Medium', description: 'A session lasts 90 minutes here but 60 minutes in TM-04.', fix: 'Agree on one duration with the stakeholders and update TM-04 or TM-10.' },
  { line: 11, type: 'COMPOUND', severity: 'Low', description: 'Three different ratings packed in one requirement.', fix: 'Split into three requirements, one per thing rated.' },
  { line: 12, type: 'UNNECESSARY', severity: 'Low', description: 'Gold plating: no business objective or user need asks for a mascot.', fix: 'Remove it, or trace it to a stated business objective before keeping it.' },
  { line: 13, type: 'INCOMPLETE', severity: 'Medium', description: 'TBD left in the reminder time.', fix: 'Resolve the TBD with the sponsor: remind both participants 2 hours before the session.' },
  { line: 14, type: 'INCORRECT', severity: 'High', description: 'Contradicts BR-2: new tutors without a rating must appear with the label New.', fix: 'Show tutors with an average rating above 4.5 first and new tutors with the label New, as BR-2 requires.' },
  { line: 15, type: 'DUPLICATE', severity: 'Low', description: 'Repeats TM-04 with less detail.', fix: 'Delete TM-15 and keep TM-04.' },
  { line: 16, type: 'INFEASIBLE', severity: 'Medium', description: 'Zero downtime is impossible to build and to verify.', fix: 'The system shall be available 99.5% of the time between 07:00 and 22:00, measured monthly.' },
];

const GIAI_DOAN = ['PLANNING', 'PREPARATION', 'INSPECTION_MEETING', 'REWORK', 'FOLLOW_UP'];
const VAI = [
  ['P1', 'Reads the SRS aloud during the meeting, paraphrasing each requirement in their own words.', 'Reader'],
  ['P2', 'Plans the inspection with the author, chooses the inspectors and leads the meeting.', 'Moderator'],
  ['P3', 'Writes down every defect raised in the meeting and its classification.', 'Recorder'],
  ['P4', 'Wrote the SRS; listens, answers questions without debating, and fixes the defects afterwards.', 'Author'],
  ['P5', 'Examines the document for defects before the meeting and raises them during it.', 'Inspector'],
];
const HOAT_DONG = [
  ['V1', 'Checking that every requirement has a unique ID and the SRS follows the template.', 'VERIFICATION'],
  ['V2', 'Asking tutees whether booking through TutorMatch would really replace their Facebook groups.', 'VALIDATION'],
  ['V3', 'Looking for requirements that contradict each other.', 'VERIFICATION'],
  ['V4', 'Showing a clickable prototype of the booking flow to five tutors and watching them use it.', 'VALIDATION'],
  ['V5', 'Tracing every requirement back to a business objective in the vision document.', 'VALIDATION'],
  ['V6', 'Checking that every requirement is written so a test can pass or fail it.', 'VERIFICATION'],
];

const KIEM = [
  ...kiemReview({ bien: 'ISSUES', khoa: KHOA, sai: SAI, toiThieu: 8, nhom: 'f1', nhomNang: 'f2', nhomSua: 'f3', loaiHopLe: LOAI })
    .map((k) => (/No false claims/.test(k.moTa.en) ? { ...k, moTa: { en: 'No false claims (a correct requirement reported as a defect)', vi: 'Không báo sai (báo lỗi cho một yêu cầu đúng)' } } : k)),
  ...kiemKhoa([{ moTa: { en: 'B — the five stages of an inspection, in order', vi: 'B — năm giai đoạn của inspection, đúng thứ tự' }, bieuThuc: '(INSPECTION.stages || []).map(String)', chap: [GIAI_DOAN], kieu: 'json', nhom: 'f4', goiY: 'planning → preparation → inspection meeting → rework → follow-up' }]),
  ...kiemBang('INSPECTION_ROLES', Object.fromEntries(VAI.map((x) => [x[0], x[2]])), { nhom: 'f4', ten: (k) => `B — role of ${k}`, tenVi: (k) => `B — vai trò của ${k}` }),
  kiemTuy({ en: 'C — acceptance criteria of TM-05 in Given/When/Then: a success and a refusal at the limit', vi: 'C — tiêu chí chấp nhận của TM-05 dạng Given/When/Then: một ca thành công và một ca bị từ chối ở giới hạn' }, function () {
    if (typeof ACCEPTANCE === 'undefined' || !Array.isArray(ACCEPTANCE)) return 'ACCEPTANCE is missing';
    if (ACCEPTANCE.length < 2) return 'write at least two scenarios';
    for (var i = 0; i < ACCEPTANCE.length; i++) {
      var s = ACCEPTANCE[i] || {};
      if (!String(s.given || '').trim() || !String(s.when || '').trim() || !String(s.then || '').trim()) return 'scenario ' + (i + 1) + ' needs given, when and then';
    }
    var t = ACCEPTANCE.map(function (s) { return [s.given, s.when, s.then].join(' '); });
    var tuChoi = t.some(function (x) { return /\b3\b|three/i.test(x) && /refus|reject|not allow|denied|cannot|error|block/i.test(x); });
    var thanhCong = t.some(function (x) { return /\b2\b|two/i.test(x) && /confirm|booked|created|success|accept/i.test(x); });
    if (!tuChoi) return 'one scenario must show the 4th booking refused when 3 sessions are already booked in the week';
    if (!thanhCong) return 'one scenario must show the 3rd booking accepted when 2 sessions are booked';
    return 'OK';
  }, { nhom: 'f5' }),
  kiemTuy({ en: 'C — the refusal scenario says what the tutee sees', vi: 'C — ca bị từ chối nói rõ người học thấy gì' }, function () {
    if (typeof ACCEPTANCE === 'undefined' || !Array.isArray(ACCEPTANCE)) return 'ACCEPTANCE is missing';
    var r = ACCEPTANCE.filter(function (s) { return /refus|reject|not allow|denied|cannot|error|block/i.test(String(s && s.then)); })[0];
    if (!r) return 'no "then" with a refusal';
    return /message|show|display|tell|inform|see/i.test(String(r.then)) ? 'OK' : 'the "then" must say what the tutee is shown (a message)';
  }, { nhom: 'f5', an: true }),
  ...kiemBang('V_OR_V', Object.fromEntries(HOAT_DONG.map((x) => [x[0], x[2]])), { nhom: 'f6', ten: (k) => `D — ${k}: verification or validation`, tenVi: (k) => `D — ${k}: verification hay validation` }),
];

const TEP = {
  'answers/a-issues.js': [
    `// A. One object per defect. type: ${LOAI.join(' | ')}\nconst ISSUES = [\n  { line: 3, type: '', severity: 'Medium', description: '', fix: '' },\n];\n`,
    `// A. Eleven defects; TM-01, TM-02, TM-04, TM-05 and TM-09 are fine. line = the line number in the excerpt.\nconst ISSUES = [\n${GIAI_ISSUES.map((x) => `  { line: ${x.line}, type: '${x.type}', severity: '${x.severity}', description: '${x.description.replace(/'/g, "\\'")}', fix: '${x.fix.replace(/'/g, "\\'")}' },`).join('\n')}\n];\n`,
  ],
  'answers/b-inspection.js': [
    `// B. stages: PLANNING | PREPARATION | INSPECTION_MEETING | REWORK | FOLLOW_UP · roles: Author | Moderator | Reader | Recorder | Inspector\nconst INSPECTION = { stages: [] };\n${objTrong('INSPECTION_ROLES', Object.fromEntries(VAI.map((x) => [x[0], x[2]])))}`,
    `// B. Wiegers Fig. 17-2 and the inspection roles.\nconst INSPECTION = { stages: ['PLANNING', 'PREPARATION', 'INSPECTION_MEETING', 'REWORK', 'FOLLOW_UP'] };\n${objDong('INSPECTION_ROLES', Object.fromEntries(VAI.map((x) => [x[0], x[2]])))}`,
  ],
  'answers/c-acceptance.js': [
    "// C. Acceptance criteria of TM-05 — one object per scenario.\nconst ACCEPTANCE = [\n  { given: '', when: '', then: '' },\n];\n",
    `// C. Test both sides of the limit: the 3rd booking passes, the 4th is refused with a message.
const ACCEPTANCE = [
  { given: 'a tutee has 2 confirmed sessions in the current calendar week', when: 'the tutee books another session in the same week', then: 'the booking is confirmed and the tutee now has 3 sessions that week' },
  { given: 'a tutee already has 3 confirmed sessions in the current calendar week', when: 'the tutee tries to book a 4th session in the same week', then: 'the booking is refused and the tutee is shown the message "Weekly limit of 3 sessions reached"' },
  { given: 'a tutee has 3 confirmed sessions this week', when: 'the tutee books a session for next week', then: 'the booking is confirmed because the limit applies per calendar week' },
];
`,
  ],
  'answers/d-v-or-v.js': [`// D. VERIFICATION (are the requirements written right?) | VALIDATION (are they the right requirements?)\n${objTrong('V_OR_V', Object.fromEntries(HOAT_DONG.map((x) => [x[0], ''])))}`, `// D. Verification checks the document against its rules; validation checks it against the real needs.\n${objDong('V_OR_V', Object.fromEntries(HOAT_DONG.map((x) => [x[0], x[2]])))}`],
};

const ds = (xs) => `<ul>${xs.map((x) => `<li><b>${x[0]}</b> — ${x[1]}</li>`).join('')}</ul>`;

export default deLon({
  slug: 'swr302-6-lab-inspection-tutormatch',
  ten: 'Lab 6 — Validation: Inspecting the SRS of TutorMatch',
  moTaModule: 'Lab chương 6: thanh tra trích đoạn SRS 16 dòng của TutorMatch — liệt kê lỗi (dòng, loại, mức, cách sửa) chấm theo ghép cặp, có lỗi nghiêm trọng bắt buộc và trừ khẳng định sai; năm giai đoạn và vai trò inspection; tiêu chí chấp nhận Given/When/Then; verification hay validation.',
  baiHoc: 'swr302-6-1-tham-dinh',
  tieuDe: 'Lab 6 — Validation: Inspecting the SRS of TutorMatch',
  phu: { en: 'Chapter 6 lab · requirements inspection, defect checklist, acceptance criteria, verification vs validation · 10 marks', vi: 'Lab chương 6 · thanh tra yêu cầu, checklist lỗi, tiêu chí chấp nhận, verification vs validation · 10 điểm' },
  moTa: {
    en: `<p><b>TutorMatch</b> lets FPT University students who did well in a subject tutor younger students for a fee paid by the university. Business rules: <b>BR-1</b> a tutor must have passed the subject with at least 8.0; <b>BR-2</b> new tutors without a rating yet are listed in search with the label "New"; <b>BR-3</b> a tutee may book at most 3 sessions per calendar week. The business objective is "raise the pass rate of first-year students by 10% in two semesters".</p>
<p>You are an inspector. This is the excerpt under inspection (line numbers on the left):</p>${preMa(SRS.map((s, i) => `${String(i + 1).padStart(2)}  ${s}`).join('\n'))}
<p><b>B. Inspection roles</b>:</p>${ds(VAI)}
<p><b>C.</b> Write the acceptance criteria of TM-05 as Given/When/Then scenarios.</p>
<p><b>D. Activities to classify</b>:</p>${ds(HOAT_DONG)}`,
    vi: `<p><b>TutorMatch</b> cho sinh viên FPT University học tốt một môn làm gia sư cho sinh viên khoá dưới, trường trả phí. Business rule: <b>BR-1</b> gia sư phải qua môn với điểm từ 8.0; <b>BR-2</b> gia sư mới chưa có điểm đánh giá vẫn hiện trong tìm kiếm với nhãn "New"; <b>BR-3</b> người học đặt tối đa 3 buổi mỗi tuần lịch. Mục tiêu nghiệp vụ: "tăng tỉ lệ qua môn của sinh viên năm nhất 10% trong hai học kỳ".</p>
<p>Bạn là inspector. Trích đoạn cần thanh tra ở bản tiếng Anh (số dòng bên trái). <b>A.</b> Liệt kê lỗi. <b>B.</b> Năm giai đoạn và vai trò P1–P5. <b>C.</b> Tiêu chí chấp nhận của TM-05 dạng Given/When/Then. <b>D.</b> Sáu hoạt động V1–V6: verification hay validation?</p>`,
  },
  chucNangChinh: [
    { en: 'A. Inspect the excerpt: at least 8 real defects with line, type, severity and fix.', vi: 'A. Thanh tra trích đoạn: ít nhất 8 lỗi thật kèm dòng, loại, mức độ và cách sửa.' },
    { en: 'B. The inspection process and its roles.', vi: 'B. Quy trình inspection và các vai trò.' },
    { en: 'C. Acceptance criteria for a business rule.', vi: 'C. Tiêu chí chấp nhận cho một business rule.' },
    { en: 'D. Verification or validation?', vi: 'D. Verification hay validation?' },
  ],
  yeuCauChung: [
    { en: 'An issue counts when its line AND its type match a real defect. Reporting a correct requirement as a defect costs marks.', vi: 'Một lỗi được tính khi đúng dòng VÀ đúng loại. Báo lỗi cho yêu cầu đúng bị trừ điểm.' },
    { en: 'For a conflict between two lines, report the line that should change.', vi: 'Với mâu thuẫn giữa hai dòng, báo dòng cần sửa.' },
  ],
  cayThuMuc: `answers/
├── a-issues.js       ← const ISSUES = [ { line, type, severity, description, fix } ]
├── b-inspection.js   ← const INSPECTION = { stages: [...] }; const INSPECTION_ROLES = { P1: '…' }
├── c-acceptance.js   ← const ACCEPTANCE = [ { given, when, then } ]
└── d-v-or-v.js       ← const V_OR_V = { V1: '…' }`,
  moHinh: {
    ten: 'Allowed values',
    truong: [
      ['ISSUES[i].type', 'string', { en: `${LOAI.join(' · ')}`, vi: `${LOAI.join(' · ')}` }],
      ['ISSUES[i].severity · description · fix', 'string', { en: 'High / Medium / Low · what is wrong and why · the concrete change', vi: 'High / Medium / Low · sai gì, vì sao · sửa cụ thể' }],
      ['INSPECTION.stages', 'string[]', { en: GIAI_DOAN.join(' → '), vi: 'đúng thứ tự' }],
      ['INSPECTION_ROLES.*', 'string', { en: 'Author · Moderator · Reader · Recorder · Inspector', vi: 'Author · Moderator · Reader · Recorder · Inspector' }],
      ['ACCEPTANCE[i]', '{ given, when, then }', { en: 'one scenario per object', vi: 'mỗi object một kịch bản' }],
      ['V_OR_V.*', 'string', { en: 'VERIFICATION · VALIDATION', vi: 'VERIFICATION · VALIDATION' }],
    ],
  },
  chucNang: [
    { ten: { en: 'A1. Defects found', vi: 'A1. Lỗi tìm được' }, diem: 3, yeuCau: [{ en: 'At least 8 distinct real defects, right line and right type.', vi: 'Ít nhất 8 lỗi thật khác nhau, đúng dòng và đúng loại.' }], hook: ['defect checklist'] },
    { ten: { en: 'A2. The two critical defects', vi: 'A2. Hai lỗi nghiêm trọng' }, diem: 1, yeuCau: [{ en: 'The conflict between two requirements and the requirement that breaks a business rule.', vi: 'Mâu thuẫn giữa hai yêu cầu và yêu cầu vi phạm business rule.' }], hook: ['inconsistent', 'incorrect'] },
    { ten: { en: 'A3. Fixes and no false claims', vi: 'A3. Cách sửa và không báo sai' }, diem: 1, yeuCau: [{ en: 'A concrete fix for each defect; no correct requirement reported.', vi: 'Mỗi lỗi một cách sửa cụ thể; không báo lỗi cho yêu cầu đúng.' }], hook: ['rework'] },
    { ten: { en: 'B. Inspection process and roles', vi: 'B. Quy trình và vai trò inspection' }, diem: 2, yeuCau: [{ en: 'Five stages in order; five roles.', vi: 'Năm giai đoạn đúng thứ tự; năm vai trò.' }], hook: ['inspection'] },
    { ten: { en: 'C. Acceptance criteria', vi: 'C. Tiêu chí chấp nhận' }, diem: 1.5, yeuCau: [{ en: 'Given/When/Then on both sides of the limit.', vi: 'Given/When/Then ở hai phía giới hạn.' }], hook: ['acceptance criteria'] },
    { ten: { en: 'D. Verification vs validation', vi: 'D. Verification vs validation' }, diem: 1.5, yeuCau: [{ en: 'Right document vs right requirements.', vi: 'Viết đúng vs đúng nhu cầu.' }], hook: ['verification', 'validation'] },
  ],
  idBatBuoc: [['ISSUES', 'answers/a-issues.js'], ['INSPECTION · INSPECTION_ROLES', 'answers/b-inspection.js'], ['ACCEPTANCE', 'answers/c-acceptance.js'], ['V_OR_V', 'answers/d-v-or-v.js']],
  truDiem: [
    { en: 'Calling TM-05 a defect because it conflicts with TM-06: TM-05 matches BR-3, the line to change is TM-06.', vi: 'Coi TM-05 là lỗi vì mâu thuẫn với TM-06: TM-05 khớp BR-3, dòng cần sửa là TM-06.' },
    { en: 'Missing TM-14: it reads well but breaks BR-2 — check every requirement against the business rules.', vi: 'Bỏ sót TM-14: đọc thì trơn nhưng phạm BR-2 — đối chiếu mọi yêu cầu với business rule.' },
    { en: 'Fixes like "make it better" or "rewrite it".', vi: 'Cách sửa kiểu "làm tốt hơn", "viết lại".' },
  ],
  goiY: [
    'A: đi theo checklist Wiegers — rõ ràng (mơ hồ?), kiểm chứng được, đầy đủ (TBD? phản hồi chưa định?), nhất quán (hai dòng nói khác nhau?), đúng (trái business rule?), khả thi, cần thiết (truy về mục tiêu?), không thiết kế, một yêu cầu một câu, không trùng.',
    'A: có hai cặp mâu thuẫn số liệu (số buổi/tuần, độ dài buổi) và một yêu cầu trùng.',
    'C: test cả hai phía giới hạn: đang có 2 buổi ⇒ đặt được; đang có 3 buổi ⇒ bị từ chối kèm thông báo.',
  ],
  loiHayGap: [
    'Ghi type "WRONG" hay "ERROR" chung chung — dùng đúng loại trong danh sách.',
    'Đảo giai đoạn: rework trước inspection meeting.',
    'Nhầm Reader với Recorder: Reader diễn giải từng yêu cầu, Recorder ghi lỗi.',
    'Xếp V5 (truy về mục tiêu nghiệp vụ) là verification — nó hỏi "có đúng thứ cần không" ⇒ validation.',
  ],
  giaiThich: {
    en: '<p><b>A.</b> Defects on lines 3, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16 — see the solution file; lines 1, 2, 4, 5 and 9 are fine. The two that matter most are the 5-vs-3 conflict and TM-14 breaking BR-2. <b>B.</b> Planning → preparation → inspection meeting → rework → follow-up; Reader, Moderator, Recorder, Author, Inspector. <b>C.</b> Two scenarios around the limit, the refusal with its message. <b>D.</b> V1, V3, V6 verification (the document is written right); V2, V4, V5 validation (it describes the right thing).</p>',
    vi: '<p><b>A.</b> Lỗi ở các dòng 3, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16 — xem tệp lời giải; dòng 1, 2, 4, 5, 9 đúng. Hai lỗi quan trọng nhất là mâu thuẫn 5 với 3 buổi và TM-14 phạm BR-2. <b>B.</b> Planning → preparation → inspection meeting → rework → follow-up; Reader, Moderator, Recorder, Author, Inspector. <b>C.</b> Hai kịch bản quanh giới hạn, ca từ chối có thông báo. <b>D.</b> V1, V3, V6 verification (tài liệu viết đúng); V2, V4, V5 validation (mô tả đúng thứ cần).</p>',
  },
  khaiNiem: ['requirements inspection', 'defect checklist', 'acceptance criteria', 'verification vs validation'],
  tienQuyet: ['SWR302 lessons 6.1–6.4 (validation)'],
  thuatNgu: [...tn('inspection', 'acceptanceCriteria', 'verification', 'validation', 'goldPlating', 'verifiable', 'ambiguous', 'tbd'), { en: 'moderator / reader / recorder / author', vi: 'người điều phối / người đọc diễn giải / thư ký ghi lỗi / tác giả' }],
  moTaNgan: 'Lab chương 6: TutorMatch — inspection, vai trò, acceptance criteria, V&V.',
  phut: 60,
  tep: TEP,
  kiem: KIEM,
  boYeu: [
    { ten: 'báo lỗi dòng đúng + bỏ sót TM-14 + sửa hời hợt', tep: { 'answers/a-issues.js': `const ISSUES = [\n${GIAI_ISSUES.filter((x) => x.line !== 14).map((x) => `  { line: ${x.line}, type: '${x.type}', severity: 'Low', description: 'wrong', fix: 'fix' },`).join('\n')}\n  { line: 5, type: 'INCONSISTENT', severity: 'High', description: 'conflicts with TM-06', fix: 'change it to 5' },\n  { line: 2, type: 'AMBIGUOUS', severity: 'Low', description: 'unclear', fix: 'clarify' },\n];\n` }, phaiTruot: ['critical defect: TM-14', 'No false claims', 'concrete fix'] },
    { ten: 'chỉ ca thành công', tep: { 'answers/c-acceptance.js': "const ACCEPTANCE = [\n  { given: 'a tutee is signed in', when: 'the tutee books a session', then: 'the booking is confirmed' },\n  { given: 'a tutee has 2 sessions', when: 'the tutee books a session', then: 'it is created' },\n];\n" }, phaiTruot: ['acceptance criteria of TM-05'] },
  ],
});
