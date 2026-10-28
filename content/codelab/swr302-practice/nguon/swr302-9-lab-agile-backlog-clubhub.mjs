/**
 * SWR302 · LAB 9 — Requirements on agile projects: the ClubHub product backlog (Wiegers Ch.20).
 * A. viết 5 user story (khuôn, vai trò, lợi ích, phủ đề) · B. vi phạm INVEST · C. tiêu chí chấp nhận Given/When/Then ·
 * D. Definition of Ready vs Definition of Done · E. đúng/sai về yêu cầu trong agile.
 */
import { tn, kiemTuy } from './_chung.mjs';
import { deLon, kiemBang, objDong, objTrong } from './_lab.mjs';

const INVEST = ['INDEPENDENT', 'NEGOTIABLE', 'VALUABLE', 'ESTIMABLE', 'SMALL', 'TESTABLE'];
const XAU = [
  ['B1', 'As a member, I want the whole club management system so that I can manage my clubs.', 'SMALL'],
  ['B2', 'As a developer, I want to rename the database tables in camelCase so that the code looks tidier.', 'VALUABLE'],
  ['B3', 'As a club leader, I want the event page to look nice so that members like it.', 'TESTABLE'],
  ['B4', 'As a member, I want to pay my yearly fee on the payment screen that story #12 must build first, so that I can join a club.', 'INDEPENDENT'],
  ['B5', 'As a treasurer, I want the expense report as a 3-column CSV with Arial 10 pt headers exactly as in mock-up v7, with no change allowed, so that I can file it.', 'NEGOTIABLE'],
  ['B6', 'As a club leader, I want an AI to predict which future events will be popular so that I plan better — nobody on the team has done this before and there is no data yet.', 'ESTIMABLE'],
];
const DO_RD = [
  ['D1', 'Acceptance criteria are written and agreed with the product owner.', 'DOR'],
  ['D2', 'The code is reviewed and merged into the main branch.', 'DOD'],
  ['D3', 'The team has estimated the story.', 'DOR'],
  ['D4', 'All acceptance tests of the story pass.', 'DOD'],
  ['D5', 'The story is small enough to finish within one sprint.', 'DOR'],
  ['D6', 'The product owner accepted the story at the sprint review.', 'DOD'],
];
const DUNG_SAI = [
  ['T1', 'Agile projects skip requirements documentation entirely.', 'FALSE'],
  ['T2', 'The product owner decides the order of the product backlog.', 'TRUE'],
  ['T3', 'Details of a story are elaborated just in time, shortly before the iteration that implements it.', 'TRUE'],
  ['T4', 'An epic is planned so that it is finished inside a single sprint.', 'FALSE'],
  ['T5', 'Acceptance tests are a form of requirements in agile projects.', 'TRUE'],
  ['T6', 'A well-written user story removes the need to talk with the users.', 'FALSE'],
];
const GIAI_STORIES = [
  'As a student, I want to pay a club\'s yearly fee online so that I become a member without queuing at the club desk.',
  'As a member, I want to register for an event so that a seat is kept for me.',
  'As a member, I want to join the waitlist of a full event so that I get a seat if someone cancels.',
  'As a club leader, I want to post an announcement to all members of my club so that they learn about events in time.',
  'As a treasurer, I want to submit an expense claim with a photo of the receipt so that the club is reimbursed.',
  'As a student affairs officer, I want to approve or reject expense claims above 2,000,000 VND so that club money is spent according to the rules.',
];
const GIAI_AC = [
  { given: 'an event with 50 seats has 49 registrations and starts in 3 days', when: 'a member registers for it', then: 'the registration is confirmed and the event shows 0 seats left' },
  { given: 'an event with 50 seats already has 50 registrations', when: 'a member tries to register', then: 'the registration is refused and the member is offered the waitlist' },
  { given: 'an event starts in 20 hours', when: 'a member tries to register', then: 'the registration is refused with the message "Registration closed 24 hours before the event"' },
];

const KIEM = [
  kiemTuy({ en: 'A — at least 5 stories in the form "As a <role>, I want <goal> so that <benefit>"', vi: 'A — ít nhất 5 story dạng "As a <vai trò>, I want <mục tiêu> so that <lợi ích>"' }, function () {
    if (typeof STORIES === 'undefined' || !Array.isArray(STORIES)) return 'STORIES is missing';
    if (STORIES.length < 5) return 'write at least 5 stories';
    for (var i = 0; i < STORIES.length; i++) {
      var s = String(STORIES[i]).trim();
      var m = /^as an? (.+?),? i (?:want|need|would like) (.+?),? so that (.+)$/i.exec(s);
      if (!m) return 'STORIES[' + i + '] is not "As a <role>, I want <goal> so that <benefit>"';
      if (/system|developer|programmer|database|team|admin of the server/i.test(m[1])) return 'STORIES[' + i + ']: the role is "' + m[1] + '" — stories are written from the point of view of a USER of the case';
      if (m[3].trim().split(/\s+/).length < 3) return 'STORIES[' + i + ']: the "so that" part must state a real benefit';
      if (s.split(/\s+/).length > 45) return 'STORIES[' + i + '] is too long — keep a story short; details go to acceptance criteria';
    }
    return 'OK';
  }, { nhom: 'f1' }),
  kiemTuy({ en: 'A — the roles are the roles of the case', vi: 'A — vai trò là vai trò trong đề' }, function () {
    if (typeof STORIES === 'undefined' || !Array.isArray(STORIES)) return 'STORIES is missing';
    var vai = STORIES.map(function (s) { var m = /^as an? (.+?),? i /i.exec(String(s).trim()); return m ? m[1].toLowerCase() : ''; });
    var la = vai.filter(function (v) { return !/student|member|club leader|leader|treasurer|officer/.test(v); });
    if (la.length) return 'unknown role "' + la[0] + '" — use student, member, club leader, treasurer, student affairs officer';
    var khac = {}; vai.forEach(function (v) { khac[v.replace(/^(the|a|an) /, '')] = 1; });
    return Object.keys(khac).length >= 3 ? 'OK' : 'the backlog serves at least three different roles of the case';
  }, { nhom: 'f1' }),
  kiemTuy({ en: 'A — the stories cover the case: events, waitlist, announcements, expenses, approval', vi: 'A — các story phủ đề: sự kiện, danh sách chờ, thông báo, chi phí, phê duyệt' }, function () {
    if (typeof STORIES === 'undefined' || !Array.isArray(STORIES)) return 'STORIES is missing';
    var t = STORIES.join(' | ').toLowerCase();
    var can = [['event', /event/], ['waitlist', /wait ?list|waiting list/], ['announcement', /announce|post|notify/], ['expense claim', /expense|claim|reimburs|receipt/], ['approval of large claims', /approv/]];
    var thieu = can.filter(function (c) { return !c[1].test(t); });
    return thieu.length ? 'no story about: ' + thieu.map(function (c) { return c[0]; }).join(', ') : 'OK';
  }, { nhom: 'f1' }),
  kiemTuy({ en: 'A — goals are testable (no vague words such as easy, nice, fast, user-friendly)', vi: 'A — mục tiêu kiểm chứng được (không easy, nice, fast, user-friendly…)' }, function () {
    if (typeof STORIES === 'undefined' || !Array.isArray(STORIES)) return 'STORIES is missing';
    var x = STORIES.filter(function (s) { return /\b(easy|easily|nice|nicer|beautiful|fast|quickly|user[- ]friendly|better|good|etc)\b/i.test(String(s).split(/so that/i)[0]); });
    return x.length ? 'vague goal in: "' + String(x[0]).slice(0, 60) + '…"' : 'OK';
  }, { nhom: 'f1', an: true }),
  ...kiemBang('INVEST_VIOLATIONS', Object.fromEntries(XAU.map((x) => [x[0], x[2]])), { nhom: 'f2', an: ['B6'], ten: (k) => `B — INVEST criterion broken by ${k}`, tenVi: (k) => `B — tiêu chí INVEST bị vi phạm ở ${k}`, goiY: { B1: 'it is an epic', B4: 'it cannot be done before another story', B5: 'a contract, not a conversation' } }),
  kiemTuy({ en: 'C — acceptance criteria: at least 3 scenarios, each with given, when and then', vi: 'C — tiêu chí chấp nhận: ít nhất 3 kịch bản, mỗi cái có given, when, then' }, function () {
    if (typeof ACCEPTANCE === 'undefined' || !Array.isArray(ACCEPTANCE)) return 'ACCEPTANCE is missing';
    if (ACCEPTANCE.length < 3) return 'write at least 3 scenarios: success, full event, registration closed';
    for (var i = 0; i < ACCEPTANCE.length; i++) { var s = ACCEPTANCE[i] || {}; if (!String(s.given || '').trim() || !String(s.when || '').trim() || !String(s.then || '').trim()) return 'scenario ' + (i + 1) + ' needs given, when and then'; }
    return 'OK';
  }, { nhom: 'f3' }),
  kiemTuy({ en: 'C — the scenarios test the rules: capacity reached ⇒ waitlist; less than 24 hours ⇒ closed', vi: 'C — kịch bản kiểm các luật: hết chỗ ⇒ danh sách chờ; còn dưới 24 giờ ⇒ đóng' }, function () {
    if (typeof ACCEPTANCE === 'undefined' || !Array.isArray(ACCEPTANCE)) return 'ACCEPTANCE is missing';
    var t = ACCEPTANCE.map(function (s) { return [s.given, s.when, s.then].join(' ').toLowerCase(); });
    if (!t.some(function (x) { return /full|all \d+ seats|capacity|\b(\d+) registrations/.test(x) && /wait ?list|waiting list/.test(x); })) return 'one scenario: the event is full ⇒ the member is offered the waitlist';
    if (!t.some(function (x) { return /24|twenty-four/.test(x) && /refus|closed|cannot|reject|not allowed/.test(x); })) return 'one scenario: less than 24 hours before the event ⇒ registration refused';
    if (!t.some(function (x) { return /confirm|registered|success|kept|reserved/.test(x) && !/refus|reject/.test(x); })) return 'one scenario: the successful registration';
    return 'OK';
  }, { nhom: 'f3' }),
  ...kiemBang('READY_OR_DONE', Object.fromEntries(DO_RD.map((x) => [x[0], x[2]])), { nhom: 'f4', ten: (k) => `D — ${k}: Definition of Ready or Done`, tenVi: (k) => `D — ${k}: Definition of Ready hay Done` }),
  ...kiemBang('AGILE_TRUTHS', Object.fromEntries(DUNG_SAI.map((x) => [x[0], x[2]])), { nhom: 'f5', ten: (k) => `E — statement ${k}`, tenVi: (k) => `E — phát biểu ${k}` }),
];

const TEP = {
  'answers/a-stories.js': ["// A. At least 5 user stories: 'As a <role>, I want <goal> so that <benefit>'.\nconst STORIES = [\n  'As a …, I want … so that …',\n];\n", `// A. Roles of the case, one goal per story, a real benefit, no vague words.\nconst STORIES = [\n${GIAI_STORIES.map((s) => `  '${s.replace(/'/g, "\\'")}',`).join('\n')}\n];\n`],
  'answers/b-invest.js': [`// B. ${INVEST.join(' | ')}\n${objTrong('INVEST_VIOLATIONS', Object.fromEntries(XAU.map((x) => [x[0], ''])))}`, `// B. Independent · Negotiable · Valuable · Estimable · Small · Testable.\n${objDong('INVEST_VIOLATIONS', Object.fromEntries(XAU.map((x) => [x[0], x[2]])))}`],
  'answers/c-acceptance.js': ["// C. Acceptance criteria of 'As a member, I want to register for an event so that a seat is kept for me'.\nconst ACCEPTANCE = [\n  { given: '', when: '', then: '' },\n];\n", `// C. Success, full event (⇒ waitlist), closed 24 hours before.\nconst ACCEPTANCE = [\n${GIAI_AC.map((s) => `  { given: '${s.given}', when: '${s.when}', then: '${s.then.replace(/'/g, "\\'")}' },`).join('\n')}\n];\n`],
  'answers/d-ready-done.js': [`// D. DOR | DOD\n${objTrong('READY_OR_DONE', Object.fromEntries(DO_RD.map((x) => [x[0], ''])))}`, `// D. Ready = the story can enter a sprint; Done = the story can be shipped.\n${objDong('READY_OR_DONE', Object.fromEntries(DO_RD.map((x) => [x[0], x[2]])))}`],
  'answers/e-truths.js': [`// E. TRUE | FALSE\n${objTrong('AGILE_TRUTHS', Object.fromEntries(DUNG_SAI.map((x) => [x[0], ''])))}`, `// E. Wiegers Ch.20 — agile changes WHEN and HOW MUCH you write, not WHETHER.\n${objDong('AGILE_TRUTHS', Object.fromEntries(DUNG_SAI.map((x) => [x[0], x[2]])))}`],
};

const ds = (xs) => `<ul>${xs.map((x) => `<li><b>${x[0]}</b> — ${x[1]}</li>`).join('')}</ul>`;

export default deLon({
  slug: 'swr302-9-lab-agile-backlog-clubhub',
  ten: 'Lab 9 — Agile Requirements: the ClubHub Backlog',
  moTaModule: 'Lab chương 9: viết 5 user story đúng khuôn, đúng vai trò, phủ đề; vi phạm INVEST của 6 story tồi; tiêu chí chấp nhận Given/When/Then kiểm luật sức chứa và hạn 24 giờ; Definition of Ready vs Done; đúng/sai về yêu cầu trong agile.',
  baiHoc: 'swr302-9-1-agile-requirements',
  tieuDe: 'Lab 9 — Agile Requirements: the ClubHub Backlog',
  phu: { en: 'Chapter 9 lab · user stories, INVEST, acceptance criteria, Definition of Ready and Done, agile requirements · 10 marks', vi: 'Lab chương 9 · user story, INVEST, tiêu chí chấp nhận, Definition of Ready và Done, yêu cầu agile · 10 điểm' },
  moTa: {
    en: `<p><b>ClubHub</b> manages the student clubs of the university. A <b>student</b> joins a club and pays its yearly fee online, becoming a <b>member</b>. A <b>club leader</b> creates events with a maximum number of seats and posts announcements to the members. A member registers for an event; registration closes 24 hours before the event, and when an event is full the member can join its waitlist. A <b>treasurer</b> submits expense claims with a photo of the receipt; the <b>student affairs officer</b> approves the club budgets and every expense claim above 2,000,000 VND. The team works in two-week sprints with a product owner from the student affairs office.</p>
<p><b>A.</b> Write at least five user stories for the product backlog.</p>
<p><b>B. Stories that break INVEST</b>:</p>${ds(XAU)}
<p><b>C.</b> Write the acceptance criteria of the story <i>"As a member, I want to register for an event so that a seat is kept for me."</i></p>
<p><b>D. Checklist items</b> — Definition of Ready or Definition of Done?</p>${ds(DO_RD)}
<p><b>E. Statements</b>:</p>${ds(DUNG_SAI)}`,
    vi: `<p><b>ClubHub</b> quản lý câu lạc bộ sinh viên. <b>Sinh viên</b> tham gia CLB và đóng phí năm trực tuyến, trở thành <b>thành viên</b>. <b>Trưởng CLB</b> tạo sự kiện có số chỗ tối đa và đăng thông báo cho thành viên. Thành viên đăng ký sự kiện; đăng ký đóng 24 giờ trước sự kiện, sự kiện đầy thì thành viên vào danh sách chờ. <b>Thủ quỹ</b> gửi đề nghị thanh toán chi phí kèm ảnh hoá đơn; <b>cán bộ công tác sinh viên</b> duyệt ngân sách CLB và mọi đề nghị trên 2.000.000 đ. Đội làm sprint hai tuần với product owner từ phòng công tác sinh viên.</p>
<p><b>A.</b> Viết ít nhất năm user story. <b>B.</b> Sáu story B1–B6 vi phạm tiêu chí INVEST nào? <b>C.</b> Viết tiêu chí chấp nhận cho story đăng ký sự kiện. <b>D.</b> Sáu mục D1–D6: Definition of Ready hay Done? <b>E.</b> Sáu phát biểu T1–T6: đúng hay sai?</p>`,
  },
  chucNangChinh: [
    { en: 'A. Five user stories.', vi: 'A. Năm user story.' },
    { en: 'B. INVEST violations.', vi: 'B. Vi phạm INVEST.' },
    { en: 'C. Acceptance criteria.', vi: 'C. Tiêu chí chấp nhận.' },
    { en: 'D. Definition of Ready vs Done.', vi: 'D. Definition of Ready vs Done.' },
    { en: 'E. Requirements on agile projects.', vi: 'E. Yêu cầu trong dự án agile.' },
  ],
  yeuCauChung: [{ en: 'Stories are written from the point of view of a user role of the case — never "As the system" or "As a developer".', vi: 'Story viết từ góc nhìn một vai người dùng trong đề — không bao giờ "As the system" hay "As a developer".' }],
  cayThuMuc: `answers/
├── a-stories.js      ← const STORIES = ['As a …, I want … so that …', …]
├── b-invest.js       ← const INVEST_VIOLATIONS = { B1: '…', … }
├── c-acceptance.js   ← const ACCEPTANCE = [ { given, when, then } ]
├── d-ready-done.js   ← const READY_OR_DONE = { D1: 'DOR' | 'DOD', … }
└── e-truths.js       ← const AGILE_TRUTHS = { T1: 'TRUE' | 'FALSE', … }`,
  moHinh: {
    ten: 'Allowed values',
    truong: [
      ['STORIES[i]', 'string', { en: '"As a <role>, I want <goal> so that <benefit>"', vi: '"As a <vai trò>, I want <mục tiêu> so that <lợi ích>"' }],
      ['INVEST_VIOLATIONS.*', 'string', { en: INVEST.join(' · '), vi: INVEST.join(' · ') }],
      ['ACCEPTANCE[i]', '{ given, when, then }', { en: 'one scenario per object', vi: 'mỗi object một kịch bản' }],
    ],
  },
  chucNang: [
    { ten: { en: 'A. User stories', vi: 'A. User story' }, diem: 3, yeuCau: [{ en: 'Form, roles of the case, a benefit, testable goals, coverage of the case.', vi: 'Đúng khuôn, vai trò trong đề, có lợi ích, mục tiêu kiểm chứng được, phủ đề.' }], hook: ['user story'] },
    { ten: { en: 'B. INVEST', vi: 'B. INVEST' }, diem: 2, yeuCau: [{ en: 'The criterion each bad story breaks.', vi: 'Tiêu chí mỗi story tồi vi phạm.' }], hook: ['INVEST'] },
    { ten: { en: 'C. Acceptance criteria', vi: 'C. Tiêu chí chấp nhận' }, diem: 2, yeuCau: [{ en: 'Success, full event, closed registration — each as Given/When/Then.', vi: 'Thành công, sự kiện đầy, hết hạn đăng ký — mỗi cái dạng Given/When/Then.' }], hook: ['Given/When/Then'] },
    { ten: { en: 'D. Ready and Done', vi: 'D. Ready và Done' }, diem: 1.5, yeuCau: [{ en: 'Before entering a sprint vs before shipping.', vi: 'Trước khi vào sprint vs trước khi giao.' }], hook: ['Definition of Done'] },
    { ten: { en: 'E. Agile requirements', vi: 'E. Yêu cầu agile' }, diem: 1.5, yeuCau: [{ en: 'What agile changes and what it does not.', vi: 'Agile thay đổi gì và không thay đổi gì.' }], hook: ['product backlog'] },
  ],
  idBatBuoc: [['STORIES', 'answers/a-stories.js'], ['INVEST_VIOLATIONS', 'answers/b-invest.js'], ['ACCEPTANCE', 'answers/c-acceptance.js'], ['READY_OR_DONE', 'answers/d-ready-done.js'], ['AGILE_TRUTHS', 'answers/e-truths.js']],
  truDiem: [
    { en: '"As the system, I want to send reminders…" — the system is not a user role.', vi: '"As the system, I want to send reminders…" — hệ thống không phải vai người dùng.' },
    { en: 'A story with "and" joining two goals, or with UI details that belong in acceptance criteria.', vi: 'Story nối hai mục tiêu bằng "and", hoặc chứa chi tiết giao diện thuộc về tiêu chí chấp nhận.' },
    { en: 'Acceptance criteria that only cover the happy path.', vi: 'Tiêu chí chấp nhận chỉ có đường thuận.' },
  ],
  goiY: [
    'A: lấy vai trò từ đề (student, member, club leader, treasurer, student affairs officer); mỗi việc đề nêu là một story.',
    'B: epic ⇒ Small; không có giá trị cho người dùng ⇒ Valuable; "nice" ⇒ Testable; phụ thuộc story khác ⇒ Independent; cố định tới từng chi tiết ⇒ Negotiable; không ai ước lượng nổi ⇒ Estimable.',
    'C: luật nằm trong đề — số chỗ tối đa (đầy ⇒ danh sách chờ) và đóng đăng ký 24 giờ trước.',
  ],
  loiHayGap: [
    'Viết story "As a user" chung chung — đề có năm vai khác nhau.',
    'Phần "so that" lặp lại mục tiêu thay vì nêu lợi ích.',
    'Xếp "story đã ước lượng" vào Definition of Done.',
  ],
  giaiThich: {
    en: `<p><b>B.</b> ${XAU.map((x) => `${x[0]} ${x[2]}`).join(' · ')}. <b>D.</b> ${DO_RD.map((x) => `${x[0]} ${x[2]}`).join(' · ')}. <b>E.</b> ${DUNG_SAI.map((x) => `${x[0]} ${x[2]}`).join(' · ')}. Stories and acceptance criteria: see the solution files — the stories use the five roles of the case; the acceptance criteria test both rules (capacity ⇒ waitlist, 24 hours ⇒ closed) and the success path.</p>`,
    vi: `<p><b>B.</b> ${XAU.map((x) => `${x[0]} ${x[2]}`).join(' · ')}. <b>D.</b> ${DO_RD.map((x) => `${x[0]} ${x[2]}`).join(' · ')}. <b>E.</b> ${DUNG_SAI.map((x) => `${x[0]} ${x[2]}`).join(' · ')}. Story và tiêu chí chấp nhận: xem tệp lời giải — story dùng năm vai trong đề; tiêu chí kiểm cả hai luật (hết chỗ ⇒ chờ, 24 giờ ⇒ đóng) và đường thành công.</p>`,
  },
  khaiNiem: ['user story', 'INVEST', 'acceptance criteria', 'Definition of Ready', 'Definition of Done', 'product backlog'],
  tienQuyet: ['SWR302 Chapter 9 (agile requirements)'],
  thuatNgu: [...tn('userStory', 'invest', 'epic', 'backlog', 'acceptanceCriteria'), { en: 'Definition of Ready / Done', vi: 'điều kiện để story được đưa vào sprint / được coi là xong' }, { en: 'product owner', vi: 'người chịu trách nhiệm thứ tự backlog và nghiệm thu story' }],
  moTaNgan: 'Lab chương 9: ClubHub — user story, INVEST, acceptance criteria, DoR/DoD.',
  phut: 45,
  tep: TEP,
  kiem: KIEM,
  boYeu: [
    { ten: 'story vai hệ thống, thiếu lợi ích, không phủ đề', tep: { 'answers/a-stories.js': "const STORIES = [\n  'As the system, I want to send reminders so that it works.',\n  'As a user, I want an easy event page so that it is nice.',\n  'As a member, I want events.',\n  'As a user, I want to login so that I can login.',\n  'As a user, I want fast pages so that it is fast.',\n];\n" }, phaiTruot: ['at least 5 stories in the form', 'the roles are the roles of the case', 'the stories cover the case'] },
    { ten: 'tiêu chí chỉ đường thuận', tep: { 'answers/c-acceptance.js': "const ACCEPTANCE = [\n  { given: 'a member', when: 'the member registers', then: 'the registration is confirmed' },\n  { given: 'a member', when: 'the member registers again', then: 'it is confirmed' },\n  { given: 'a member', when: 'registers', then: 'success' },\n];\n" }, phaiTruot: ['the scenarios test the rules'] },
  ],
});
