/**
 * SWT301 · DỰ ÁN LABBOOK — MỐC CHƯƠNG 9 (cuối): acceptance test BDD — viết Gherkin, thư viện bước (do developer giữ) chạy trên
 * LabBook và các bản build lỗi; kèm Góc phỏng vấn 9 (tổng kết nghề tester).
 */
import { doiDau, KHOA, hai, giai, lc, kiemKhoa, preMa, NOP_BAI } from './_chung.mjs';
import { tinhDe, kiemTuy } from './_de.mjs';
import { kiemKichBan, DOT_BIEN_HE_THONG, DOT_BIEN_TICH_HOP } from './_labbook.mjs';

const LIB = String.raw`// Step definitions of the LabBook BDD suite — maintained by the developers. Do not edit.
const BDD_ACCOUNTS = { student1: 'an@fpt.edu.vn', student2: 'binh@fpt.edu.vn', student3: 'chi@fpt.edu.vn', manager: 'manager@fpt.edu.vn', admin: 'admin@fpt.edu.vn' };
const BDD_PASSWORDS = { student1: 'An@12345', student2: 'Binh@123', student3: 'Chi@1234', manager: 'Mgr@1234', admin: 'Adm@1234' };
const BDD_STATUSES = ['CONFIRMED', 'PENDING', 'CANCELLED', 'OPEN', 'CLOSED'];
const A = '(student1|student2|student3|manager|admin)';
const BDD_STEPS = [
  [/^(?:the )?seed data(?: is loaded)?$/, () => null],
  [/^the clock is Monday 2026-11-02 08:00$/, () => null],
  [new RegExp('^' + A + ' books (LAB\\d+) on (\\d{4}-\\d{2}-\\d{2}) at (\\d+) for (\\d+) hours?$'), (m) => ({ as: m[1], call: 'POST /api/bookings', body: { labCode: m[2], date: m[3], startHour: +m[4], duration: +m[5] } })],
  [new RegExp('^' + A + ' cancels (BK\\d{4})$'), (m) => ({ as: m[1], call: 'DELETE /api/bookings/' + m[2] })],
  [new RegExp('^' + A + ' (closes|opens) (LAB\\d+)$'), (m) => ({ as: m[1], call: 'PATCH /api/labs/' + m[3], body: { status: m[2] === 'closes' ? 'CLOSED' : 'OPEN' } })],
  [new RegExp('^' + A + ' logs in with the (right|wrong) password$'), (m) => ({ as: 'guest', call: 'POST /api/auth/login', body: { email: BDD_ACCOUNTS[m[1]], password: m[2] === 'right' ? BDD_PASSWORDS[m[1]] : 'not-my-password' } })],
  [new RegExp('^' + A + ' lists (?:her|his|their) bookings$'), (m) => ({ as: m[1], call: 'GET /api/bookings/me' })],
  [/^the admin (locks|unlocks) (\S+@\S+)$/, (m) => ({ as: 'admin', call: 'POST /api/admin/users/' + m[2] + '/' + (m[1] === 'locks' ? 'lock' : 'unlock'), expect: { status: 200 } })],
  [/^the answer is (\d{3})(?: ([A-Z_]+))?$/, (m) => ({ attach: m[2] ? { status: +m[1], body: BDD_STATUSES.indexOf(m[2]) >= 0 ? { status: m[2] } : { error: m[2] } } : { status: +m[1] } })],
  [/^the list contains (\d+) bookings?$/, (m) => ({ attach: { status: 200, body: { length: +m[1] } } })],
  [/^(BK\d{4}) is (CONFIRMED|PENDING|CANCELLED) in the database$/, (m) => ({ as: 'admin', call: 'GET /test/db/bookings', expect: { status: 200, body: { [Number(m[1].slice(2)) - 1]: { code: m[1], status: m[2] } } } })],
];
function bddParse(text) {
  const out = [];
  let cur = null;
  for (const raw of String(text || '').split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#') || /^Feature:/.test(line)) continue;
    const sc = /^Scenario:\s*(.*)$/.exec(line);
    if (sc) { cur = { name: sc[1], steps: [], undefinedSteps: [] }; out.push(cur); continue; }
    const st = /^(Given|When|Then|And|But)\s+(.*)$/.exec(line);
    if (!st || !cur) continue;
    let made = undefined;
    for (const [re, f] of BDD_STEPS) { const m = re.exec(st[2]); if (m) { made = f(m); break; } }
    if (made === undefined) { cur.undefinedSteps.push(st[2]); cur.steps.push({ as: 'guest', call: 'GET /undefined-step/' + encodeURIComponent(st[2]), expect: { status: 200 } }); continue; }
    if (made === null) continue;
    if (made.attach) { const last = cur.steps[cur.steps.length - 1]; if (last) last.expect = made.attach; else cur.undefinedSteps.push(st[2] + ' (no action before it)'); continue; }
    cur.steps.push(made);
  }
  return out;
}
const BDD_SCENARIOS = bddParse(typeof FEATURE !== 'undefined' ? FEATURE : '');
const TEST_CASES = BDD_SCENARIOS.map((s, i) => ({ id: 'SC-' + (i + 1), description: s.name, precondition: 'Seed data; clock Mon 2026-11-02 08:00', steps: s.steps }));
`;

const FEATURE = `Feature: LabBook booking rules (acceptance tests of release 2.0)

  Scenario: A student only sees her own bookings
    Given the seed data is loaded
    When student1 books LAB01 on 2026-11-04 at 9 for 1 hour
    Then the answer is 201 CONFIRMED
    When student2 lists her bookings
    Then the list contains 0 bookings

  Scenario: Two bookings at the same time are refused even in different labs
    Given the seed data is loaded
    When student1 books LAB01 on 2026-11-04 at 9 for 2 hours
    Then the answer is 201 CONFIRMED
    When student1 books LAB02 on 2026-11-04 at 10 for 1 hour
    Then the answer is 409 OVERLAP

  Scenario: The booking window is 14 days
    Given the clock is Monday 2026-11-02 08:00
    When student1 books LAB01 on 2026-11-16 at 9 for 1 hour
    Then the answer is 201 CONFIRMED
    When student1 books LAB01 on 2026-11-17 at 9 for 1 hour
    Then the answer is 422 OUT_OF_WINDOW

  Scenario: A locked student is logged out at once
    Given the seed data is loaded
    When student1 lists her bookings
    Then the answer is 200
    When the admin locks an@fpt.edu.vn
    And student1 lists her bookings
    Then the answer is 401 UNAUTHENTICATED

  Scenario: A booking that starts in less than 2 hours cannot be cancelled
    Given the clock is Monday 2026-11-02 08:00
    When student1 books LAB01 on 2026-11-02 at 9 for 1 hour
    Then the answer is 201 CONFIRMED
    When student1 cancels BK0001
    Then the answer is 409 TOO_LATE

  Scenario: Only a manager can close a lab
    Given the seed data is loaded
    When student1 closes LAB01
    Then the answer is 403 FORBIDDEN
    When manager closes LAB01
    Then the answer is 200

  Scenario: More than 6 hours a week is refused with a clear error
    Given the seed data is loaded
    When student1 books LAB01 on 2026-11-04 at 9 for 3 hours
    Then the answer is 201 CONFIRMED
    When student1 books LAB01 on 2026-11-05 at 9 for 3 hours
    Then the answer is 201 CONFIRMED
    When student1 books LAB01 on 2026-11-06 at 9 for 1 hour
    Then the answer is 422 WEEKLY_LIMIT

  Scenario: A re-opened lab accepts bookings again
    Given the seed data is loaded
    When manager opens LAB03
    Then the answer is 200
    When student1 books LAB03 on 2026-11-04 at 9 for 1 hour
    Then the answer is 201 CONFIRMED
`;

const HT = (ma) => DOT_BIEN_HE_THONG.find((m) => m.ma === ma);
const TH = (ma) => DOT_BIEN_TICH_HOP.find((m) => m.ma === ma);
const KIEM = [
  kiemTuy({ en: 'Every step of FEATURE matches a step definition', vi: 'Mọi bước của FEATURE đều khớp một định nghĩa bước' }, () => {
    if (typeof FEATURE !== 'string' || !FEATURE.trim()) return 'declare const FEATURE = `Feature: …`';
    const u = BDD_SCENARIOS.flatMap((s) => s.undefinedSteps.map((t) => s.name + ': ' + t));
    return u.length ? 'undefined step(s): ' + u.slice(0, 3).join(' | ') : 'OK';
  }, { nhom: 'f1' }),
  kiemTuy({ en: 'At least 6 scenarios, each with a Then step that checks something', vi: 'Ít nhất 6 kịch bản, mỗi kịch bản có bước Then kiểm một điều gì đó' }, () => {
    const L = BDD_SCENARIOS;
    if (L.length < 6) return 'only ' + L.length + ' scenario(s)';
    const bad = L.filter((s) => !s.steps.some((x) => x && x.expect));
    return bad.length ? 'scenario “' + bad[0].name + '” checks nothing — add a Then step' : 'OK';
  }, { nhom: 'f1' }),
  ...kiemKichBan({
    bien: 'TEST_CASES', minCa: 6, nhomCauTruc: 'f1',
    can: [{ ma: 'GET /api/bookings/me 200', ten: 'a student lists her bookings', tenVi: 'sinh viên xem booking của mình', nhom: 'f1' }],
    dotBien: [TH('I7'), TH('I8'), HT('S6'), HT('S1'), HT('S5'), TH('I3'), { ...TH('I1'), an: true }, { ...HT('S8'), an: true }],
    nhomDotBien: 'f2',
  }),
  ...kiemKhoa([
    { moTa: { en: 'B — who writes the Gherkin scenarios', vi: 'B — ai viết kịch bản Gherkin' }, bieuThuc: 'BDD.scenariosWrittenBy', chap: ['The three amigos (business, developer, tester)'], nhom: 'f3' },
    { moTa: { en: 'B — when they are written', vi: 'B — viết khi nào' }, bieuThuc: 'BDD.writtenWhen', chap: ['Before coding, in the specification workshop'], nhom: 'f3' },
    { moTa: { en: 'B — testing quadrant of these tests', vi: 'B — góc kiểm thử của các test này' }, bieuThuc: 'BDD.quadrant', chap: ['Q2'], nhom: 'f3' },
    { moTa: { en: 'B — what else the team still needs', vi: 'B — đội còn cần gì nữa' }, bieuThuc: 'BDD.stillNeeded', chap: ['Exploratory, usability and performance testing (Q3, Q4)'], nhom: 'f3' },
  ]),
];

const BAN_IN = {
  tieuDe: 'LabBook Project · Milestone 9 — BDD Acceptance Tests for Release 2.0',
  phu: { en: 'Running project · final milestone · Gherkin acceptance tests executed on LabBook and faulty builds · 10 marks', vi: 'Dự án xuyên suốt · mốc cuối · acceptance test Gherkin chạy trên LabBook và bản build lỗi · 10 điểm' },
  moTa: {
    en: `<p>Last milestone. For release 2.0 the three amigos turn the booking rules into <b>executable acceptance tests in Gherkin</b>. The developers already wrote the step definitions (<code>lib/steps.js</code>, read-only); you write <code>FEATURE</code>. Supported steps:</p>${preMa(`Given the seed data is loaded              |  Given the clock is Monday 2026-11-02 08:00
When <actor> books <LAB> on <YYYY-MM-DD> at <hour> for <n> hour(s)
When <actor> cancels <BKnnnn>              |  When <actor> closes <LAB>  /  opens <LAB>
When <actor> logs in with the right / wrong password
When <actor> lists her / his / their bookings
When the admin locks <e-mail>  /  unlocks <e-mail>
Then the answer is <status> [CONFIRMED | PENDING | CANCELLED | OPEN | CLOSED | <ERROR_CODE>]   (checks the previous action)
Then the list contains <n> booking(s)        (checks the previous list)
Then <BKnnnn> is <CONFIRMED | PENDING | CANCELLED> in the database
actors: student1, student2, student3, manager, admin   ·   And / But continue the previous keyword`)}
<p>Each scenario starts from the LabBook seed data (LAB01 2 seats, LAB02 1 seat, LAB03 closed; codes BK0001… in creation order; clock Monday 2026-11-02 08:00). The rules are those of the LabBook API of chapters 2–8: own bookings only, no overlapping bookings in any lab, a 14-day window, locked accounts lose their tokens, no cancellation less than 2 hours before the start, only managers change labs, at most 6 hours a week (422 WEEKLY_LIMIT), re-opened labs accept bookings.</p>
<p><b>A.</b> Write at least 6 scenarios. The grader runs them on LabBook and on <b>8 faulty builds</b> (6 listed, 2 hidden). <b>B.</b> Describe your BDD practice in <code>BDD</code>.</p>`,
    vi: `<p>Mốc cuối. Cho bản 2.0, ba người (nghiệp vụ, developer, tester) biến các luật đặt chỗ thành <b>acceptance test chạy được bằng Gherkin</b>. Developer đã viết sẵn định nghĩa bước (<code>lib/steps.js</code>, chỉ đọc); bạn viết <code>FEATURE</code> với các bước được hỗ trợ ở khối trên. Mỗi kịch bản bắt đầu từ dữ liệu mẫu LabBook; luật là các luật của API LabBook từ chương 2–8. <b>A.</b> Viết ít nhất 6 kịch bản; máy chấm chạy trên LabBook và <b>8 bản build lỗi</b> (6 công khai, 2 ẩn). <b>B.</b> Mô tả cách làm BDD trong <code>BDD</code>.</p>`,
  },
  chucNangChinh: [
    { en: 'A. A Gherkin feature of at least 6 scenarios that passes on LabBook and catches the faulty builds.', vi: 'A. Một feature Gherkin ít nhất 6 kịch bản, đạt trên LabBook và bắt được các bản build lỗi.' },
    { en: 'B. Who, when, which quadrant, what else.', vi: 'B. Ai, khi nào, góc nào, còn cần gì.' },
  ],
  yeuCauChung: [{ en: 'Write the expected behaviour from the rules, not from what you think the build does.', vi: 'Viết hành vi mong đợi theo luật, không theo điều bạn nghĩ bản build đang làm.' }],
  cayThuMuc: `answers/
├── booking.feature.js   ← const FEATURE = \`Feature: … Scenario: … Given … When … Then …\`
├── bdd.js               ← const BDD = { scenariosWrittenBy, writtenWhen, quadrant, stillNeeded }
lib/
└── steps.js             ← step definitions (read-only)`,
  moHinh: {
    ten: 'BDD — allowed values',
    truong: [
      ['scenariosWrittenBy', 'string', { en: 'The three amigos (business, developer, tester) · The tester alone · The customer alone', vi: 'The three amigos (business, developer, tester) · The tester alone · The customer alone' }],
      ['writtenWhen', 'string', { en: 'Before coding, in the specification workshop · After the release · During UAT', vi: 'Before coding, in the specification workshop · After the release · During UAT' }],
      ['quadrant', 'string', { en: 'Q1 · Q2 · Q3 · Q4', vi: 'Q1 · Q2 · Q3 · Q4' }],
      ['stillNeeded', 'string', { en: 'Exploratory, usability and performance testing (Q3, Q4) · Nothing — BDD covers everything · Only more unit tests', vi: 'như bản tiếng Anh' }],
    ],
  },
  chucNang: [
    { ten: { en: 'A1 A valid feature', vi: 'A1 Feature hợp lệ' }, diem: 3, yeuCau: [{ en: 'No undefined step, ≥ 6 scenarios each with a check, all passing on LabBook.', vi: 'Không bước nào thiếu định nghĩa, ≥ 6 kịch bản đều có kiểm, đạt hết trên LabBook.' }], hook: ['BDD'] },
    { ten: { en: 'A2 Acceptance power', vi: 'A2 Sức bắt của acceptance test' }, diem: 5, yeuCau: [{ en: 'Catch the faulty builds (6 listed, 2 hidden).', vi: 'Bắt các bản build lỗi (6 công khai, 2 ẩn).' }], hook: ['ATDD'] },
    { ten: { en: 'B. BDD practice', vi: 'B. Cách làm BDD' }, diem: 2, yeuCau: [{ en: 'Four values.', vi: 'Bốn giá trị.' }], hook: ['testing quadrants'] },
  ],
  idBatBuoc: [['FEATURE', 'answers/booking.feature.js'], ['BDD', 'answers/bdd.js']],
  truDiem: [
    { en: 'A “Then” with no action before it — it checks nothing.', vi: 'Bước “Then” không có hành động phía trước — không kiểm được gì.' },
    { en: 'Testing overlap only in the same lab — the rule says any lab.', vi: 'Chỉ test trùng giờ trong cùng phòng — luật nói mọi phòng.' },
  ],
  nopBai: NOP_BAI,
};

const PHONG_VAN = tinhDe({
  tieuDe: 'LabBook Interview corner 9 — Talking about Agile testing and your project',
  doKho: 'MEDIUM', phut: 10,
  moTa: { en: '<p><b>Interview corner — final.</b> You have tested LabBook from user stories to BDD acceptance tests. These questions are how interviewers check it — answer with your own project.</p>', vi: '<p><b>Góc phỏng vấn — cuối cùng.</b> Bạn đã kiểm thử LabBook từ user story tới acceptance test BDD. Các câu này là cách người phỏng vấn kiểm chứng điều đó — trả lời bằng chính dự án của bạn.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('“What does a tester do in a Scrum team?”', '“Tester làm gì trong đội Scrum?”'), luaChon: lc(['a', '“Waits for the developers to finish.”'], ['b', '“Joins refinement to make stories testable, writes acceptance tests with the three amigos, automates regression in CI, explores each increment, reports status in the stand-up and improves the process in retrospectives.”'], ['c', '“Approves the backlog.”'], ['d', '“Only executes test cases.”']), dapAn: ['b'], giaiThich: giai('The whole role, in one sentence, with verbs.', 'Cả vai trò trong một câu, bằng động từ.') },
    { ma: 'q2', de: hai('“Walk me through a project you tested.”', '“Kể về một dự án bạn đã kiểm thử.”'), luaChon: lc(['a', '“It was a school project.”'], ['b', '“LabBook, a lab-booking system: I reviewed the stories (found 11 requirement defects), designed EP/BVA/decision-table/state tests, wrote white-box and integration tests with mocks, ran system tests with Report 5.3, built a keyword and a BDD regression suite that caught every seeded faulty build.”'], ['c', '“I clicked around.”'], ['d', '“I do not remember.”']), dapAn: ['b'], giaiThich: giai('Structure: context → what you did per level → measurable result.', 'Cấu trúc: bối cảnh → bạn làm gì ở từng cấp → kết quả đo được.') },
    { ma: 'q3', de: hai('“What is BDD and when is it worth it?”', '“BDD là gì và khi nào đáng làm?”'), luaChon: lc(['a', '“A testing tool.”'], ['b', '“Writing behaviour as Given/When/Then examples agreed before coding, then automating them — worth it when business rules are rich and misunderstandings are expensive; not for every small UI tweak.”'], ['c', '“Writing unit tests in English.”'], ['d', '“Always worth it.”']), dapAn: ['b'], giaiThich: giai('Collaboration first, tool second; judgement about cost.', 'Cộng tác trước, công cụ sau; có cân nhắc chi phí.') },
    { ma: 'q4', de: hai('“How do you know when a story is done?”', '“Làm sao biết một story đã xong?”'), luaChon: lc(['a', '“When the developer says so.”'], ['b', '“When it meets the Definition of Done: acceptance tests pass, code reviewed, unit tests and regression green in CI, no open critical defect, exploratory charter done.”'], ['c', '“At the end of the sprint.”'], ['d', '“When the PO is happy.”']), dapAn: ['b'], giaiThich: giai('Exit criteria of an Agile team.', 'Tiêu chí ra của đội Agile.') },
    { ma: 'q5', de: hai('“What will you learn next as a tester?”', '“Tiếp theo bạn sẽ học gì về kiểm thử?”'), luaChon: lc(['a', '“Nothing — I know enough.”'], ['b', '“Deeper automation (API and UI frameworks), performance and security testing, and the ISTQB Agile or Test Automation Engineer syllabus — the code of ethics calls it lifelong learning.”'], ['c', '“Only Excel.”'], ['d', '“Management.”']), dapAn: ['b'], giaiThich: giai('SELF — lifelong learning (lesson 1.5).', 'SELF — học suốt đời (bài 1.5).') },
  ],
  goiY: ['Nói bằng ví dụ LabBook và con số.', 'Kết nối với các chương: review, kỹ thuật, cấp test, tự động hoá, Agile.'],
  loiHayGap: ['Trả lời chung chung không có dự án.', 'Cho rằng tester chỉ chạy test case.'],
  giaiThich: '<p>All answers: b.</p>',
  thuatNgu: [{ en: 'Definition of Done', vi: 'định nghĩa “xong”' }],
  khaiNiem: ['interview', 'Agile testing'],
});

const GIAI_BDD = "const BDD = {\n  scenariosWrittenBy: 'The three amigos (business, developer, tester)',\n  writtenWhen: 'Before coding, in the specification workshop',\n  quadrant: 'Q2',\n  stillNeeded: 'Exploratory, usability and performance testing (Q3, Q4)',\n};\n";
const featureFile = (f) => `// Acceptance tests of LabBook 2.0 (BDD, Gherkin).\nconst FEATURE = \`${f}\`;\n`;

export default doiDau({
  slug: 'swt301-9-project-labbook-bdd-acceptance',
  ten: 'LabBook Project 9 — BDD Acceptance Tests for Release 2.0',
  moTaModule: 'Dự án LabBook — mốc cuối: viết acceptance test Gherkin (≥ 6 kịch bản) chạy bằng thư viện bước trên LabBook và 8 bản build lỗi (chỉ xem booking của mình, trùng giờ khác phòng, cửa sổ 14 ngày, khoá tài khoản, huỷ muộn, quyền đóng phòng…), mô tả cách làm BDD; kèm góc phỏng vấn tổng kết.',
  khoa: KHOA,
  baiHoc: 'swt301-tdd-bdd',
  de: [
    {
      dangBai: 'project',
      tieuDe: 'LabBook Milestone 9 — BDD Acceptance Tests for Release 2.0',
      doKho: 'HARD', phut: 80, diem: 100, ngonNgu: 'javascript',
      viDu: [{ input: 'When student2 lists her bookings / Then the list contains 0 bookings', output: 'passes on LabBook · fails on the build that forgets the owner filter', explanation: 'A business-readable acceptance test that catches a privacy defect.|||Acceptance test người nghiệp vụ đọc được, bắt một lỗi lộ dữ liệu.' }],
      khaiNiem: ['BDD', 'ATDD', 'acceptance testing', 'testing quadrants'],
      tienQuyet: ['SWT301 chapter 9', 'LabBook API'],
      the: ['swt301', 'project', 'labbook', 'bdd'],
      banIn: BAN_IN,
      thuatNgu: [{ en: 'feature file', vi: 'tệp Gherkin mô tả một tính năng' }, { en: 'step definitions', vi: 'định nghĩa bước' }],
      goiY: [
        'Mỗi luật một kịch bản: hành động hợp lệ trước (Then 201…), rồi hành động vi phạm (Then mã lỗi).',
        'Trùng giờ: đặt LAB01 9–11 rồi LAB02 lúc 10.',
        'Khoá tài khoản: cho student1 dùng token một lần trước, rồi admin khoá, rồi dùng lại.',
        'Cửa sổ 14 ngày: 2026-11-16 được, 2026-11-17 không.',
      ],
      loiHayGap: ['Bước Then đứng ngay sau Given (không có hành động để kiểm).', 'Gõ sai mẫu bước nên bị undefined.', 'Kiểm danh sách bằng “the answer is 200” — không thấy booking của người khác.'],
      moTaNgan: 'Mốc 9 dự án LabBook: acceptance test BDD.',
      giaiThich: {
        en: '<p>Eight short scenarios, one per business rule, each with the allowed action and the refused one, catch every faulty build. They are Q2 tests (business-facing, supporting the team), written before coding by the three amigos; the team still needs Q3 and Q4 testing — exploratory, usability, performance and security.</p>',
        vi: '<p>Tám kịch bản ngắn, mỗi luật một kịch bản, mỗi kịch bản có hành động được phép và hành động bị từ chối, bắt hết các bản lỗi. Đây là test Q2 (hướng nghiệp vụ, hỗ trợ đội), viết trước khi code bởi ba người; đội vẫn cần Q3 và Q4 — khám phá, khả dụng, hiệu năng, bảo mật.</p>',
      },
      loaiKiem: 'js',
      tests: { loai: 'js', phienBan: 1, tepNap: ['answers/booking.feature.js', 'lib/steps.js', 'answers/bdd.js'], kiem: KIEM },
      khoiDau: {
        'answers/booking.feature.js': featureFile(`Feature: LabBook booking rules (acceptance tests of release 2.0)

  Scenario: Only a manager can close a lab
    Given the seed data is loaded
    When student1 closes LAB01
    Then the answer is 403 FORBIDDEN
`),
        'lib/steps.js': LIB,
        'answers/bdd.js': "const BDD = { scenariosWrittenBy: '', writtenWhen: '', quadrant: '', stillNeeded: '' };\n",
      },
      loiGiai: { 'answers/booking.feature.js': featureFile(FEATURE), 'lib/steps.js': LIB, 'answers/bdd.js': GIAI_BDD },
      thamKhao: 'https://cucumber.io/docs/gherkin/reference/',
      boYeu: [
        { ten: 'trùng giờ chỉ trong cùng phòng', tep: { 'answers/booking.feature.js': featureFile(FEATURE.replace('When student1 books LAB02 on 2026-11-04 at 10 for 1 hour', 'When student1 books LAB01 on 2026-11-04 at 10 for 1 hour')) }, phaiTruot: ['Detects faulty build I8'] },
        { ten: 'kiểm danh sách bằng mã 200', tep: { 'answers/booking.feature.js': featureFile(FEATURE.replace('Then the list contains 0 bookings', 'Then the answer is 200')) }, phaiTruot: ['Detects faulty build I7'] },
      ],
    },
    PHONG_VAN,
  ],
});
