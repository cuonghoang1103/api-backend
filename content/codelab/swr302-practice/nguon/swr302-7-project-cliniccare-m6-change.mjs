/**
 * SWR302 · DỰ ÁN ClinicCare — Mốc 6 (chương 6–7): RTM (chưa test, mồ côi, test thừa), test biên cho BR-01,
 * yêu cầu thay đổi CR-07 (ảnh hưởng, công, quyết định, vòng đời), liên kết nghi vấn + Interview corner.
 */
import { tn, kiemTuy, jsLit, bangHtml } from './_chung.mjs';
import { deLon, kiemTap, kiemSo } from './_lab.mjs';
import { BOI_CANH, phongVan } from './_cliniccare.mjs';

const ITEMS = [
  ['BR-01', 'BR', 1, 'Free cancellation up to 2 hours before'], ['BR-02', 'BR', 1, 'Prepay after 3 no-shows in 90 days'], ['BR-03', 'BR', 2, 'At most 2 future appointments — now "per patient, family members counted separately"'], ['BR-04', 'BR', 1, 'Visit fee = service fee + 10% VAT'],
  ['UC-02', 'UC', 3, 'Book Appointment'], ['UC-11', 'UC', 1, 'Send Prescription to National System'], ['UC-13', 'UC', 1, 'Mark No-show'], ['UC-17', 'UC', 1, 'Send Appointment Reminder'],
  ['FR-1', 'FR', 1, 'Display free slots of a doctor'], ['FR-2', 'FR', 1, 'Refuse a third future appointment'], ['FR-3', 'FR', 1, 'Require prepayment'], ['FR-4', 'FR', 1, 'Fee with VAT'], ['FR-5', 'FR', 1, 'Free cancellation up to 2 hours'],
  ['FR-6', 'FR', 1, 'SMS reminder 24 hours before'], ['FR-7', 'FR', 1, 'No-show after 15 minutes'], ['FR-8', 'FR', 1, 'Store the national prescription code'], ['FR-9', 'FR', 1, 'Show a birthday greeting on the home screen'],
  ['DES-BOOK', 'DES', 1, 'BookingService'], ['DES-PAY', 'DES', 1, 'PaymentService'], ['CODE-BOOK', 'CODE', 1, 'booking.service.ts'], ['CODE-PAY', 'CODE', 1, 'payment.service.ts'],
  ['TC-01', 'TC', 1, 'Free slots listed'], ['TC-02', 'TC', 1, 'Third appointment refused'], ['TC-03', 'TC', 1, 'Prepayment asked'], ['TC-05', 'TC', 1, 'Cancel 3 h before'], ['TC-06', 'TC', 1, 'Reminder sent'], ['TC-07', 'TC', 1, 'No-show marked'], ['TC-09', 'TC', 1, 'Birthday greeting shown'], ['TC-10', 'TC', 1, 'Dark mode colours'],
].map(([id, type, version, title]) => ({ id, type, version, title }));
const LINKS = [
  ['UC-02', 'FR-1', 2], ['UC-02', 'FR-2', 3], ['BR-03', 'FR-2', 1], ['BR-02', 'FR-3', 1], ['BR-04', 'FR-4', 1], ['BR-01', 'FR-5', 1], ['UC-17', 'FR-6', 1], ['UC-13', 'FR-7', 1], ['UC-11', 'FR-8', 1],
  ['FR-1', 'DES-BOOK', 1], ['FR-2', 'DES-BOOK', 1], ['FR-5', 'DES-BOOK', 1], ['FR-3', 'DES-PAY', 1], ['DES-BOOK', 'CODE-BOOK', 1], ['DES-PAY', 'CODE-PAY', 1],
  ['FR-1', 'TC-01', 1], ['FR-2', 'TC-02', 1], ['FR-3', 'TC-03', 1], ['FR-5', 'TC-05', 1], ['FR-6', 'TC-06', 1], ['FR-7', 'TC-07', 1], ['FR-9', 'TC-09', 1],
].map(([from, to, fromVersion]) => ({ from, to, fromVersion }));
const HOURS = { BR: 1, UC: 2, FR: 2, DES: 3, CODE: 6, TC: 2 };
const CAPACITY = 18;

/* đáp án tính từ dữ liệu */
const by = Object.fromEntries(ITEMS.map((x) => [x.id, x]));
const FRs = ITEMS.filter((x) => x.type === 'FR').map((x) => x.id);
const UNTESTED = FRs.filter((f) => !LINKS.some((l) => l.from === f && by[l.to]?.type === 'TC'));
const ORPHAN = FRs.filter((f) => !LINKS.some((l) => l.to === f && ['UC', 'BR'].includes(by[l.from]?.type)));
const TC_THUA = ITEMS.filter((x) => x.type === 'TC' && !LINKS.some((l) => l.to === x.id)).map((x) => x.id);
const xuoi = (goc) => { const seen = new Set(goc), q = [...goc]; while (q.length) { const c = q.shift(); LINKS.filter((l) => l.from === c).forEach((l) => { if (!seen.has(l.to)) { seen.add(l.to); q.push(l.to); } }); } return [...seen]; };
const AFFECTED = xuoi(['UC-02', 'BR-03']).sort();
const EFFORT = AFFECTED.reduce((s, id) => s + HOURS[by[id].type], 0);
const SUSPECT = LINKS.filter((l) => by[l.from].version > l.fromVersion).map((l) => `${l.from}->${l.to}`).sort();
if (JSON.stringify(UNTESTED) !== '["FR-4","FR-8"]' || JSON.stringify(ORPHAN) !== '["FR-9"]' || EFFORT !== 20 || JSON.stringify(SUSPECT) !== '["BR-03->FR-2","UC-02->FR-1"]') throw new Error(`m6: dữ liệu lệch ${UNTESTED} ${ORPHAN} ${EFFORT} ${SUSPECT}`);

const KIEM = [
  kiemTap('UNTESTED_FR', UNTESTED, { en: 'A — functional requirements without a test case', vi: 'A — yêu cầu chức năng chưa có test case' }, { nhom: 'f1' }),
  kiemTap('ORPHAN_FR', ORPHAN, { en: 'A — functional requirements with no use case or business rule behind them', vi: 'A — yêu cầu chức năng không có use case/luật phía sau' }, { nhom: 'f1' }),
  kiemTap('TESTS_WITHOUT_REQUIREMENT', TC_THUA, { en: 'A — test cases that verify no requirement', vi: 'A — test case không kiểm yêu cầu nào' }, { nhom: 'f1', an: true }),
  kiemTuy({ en: 'B — at least 5 conceptual tests for FR-5, each expected result correct', vi: 'B — ít nhất 5 test khái niệm cho FR-5, mọi kết quả mong đợi đúng' }, function () {
    if (typeof CANCEL_TESTS === 'undefined' || !Array.isArray(CANCEL_TESTS)) return 'CANCEL_TESTS is missing';
    if (CANCEL_TESTS.length < 5) return 'write at least 5 tests';
    for (var i = 0; i < CANCEL_TESTS.length; i++) {
      var t = CANCEL_TESTS[i] || {};
      if (typeof t.hoursBefore !== 'number') return 'test ' + (i + 1) + ': hoursBefore must be a number';
      var e = t.hoursBefore >= 2 ? 'free' : 'refused';
      if (t.expected !== e) return 'hoursBefore ' + t.hoursBefore + ' ⇒ "' + e + '" (BR-01: free up to 2 hours before)';
    }
    return 'OK';
  }, { nhom: 'f2' }),
  kiemTuy({ en: 'B — the tests sit on both sides of the 2-hour boundary and include an appointment already started', vi: 'B — test nằm hai phía biên 2 giờ và có trường hợp lịch đã bắt đầu' }, function () {
    if (typeof CANCEL_TESTS === 'undefined' || !Array.isArray(CANCEL_TESTS)) return 'CANCEL_TESTS is missing';
    var h = CANCEL_TESTS.map(function (t) { return t.hoursBefore; });
    if (h.indexOf(2) < 0) return 'test exactly 2 hours before (the boundary itself)';
    if (!h.some(function (x) { return x < 2 && x >= 1.5; })) return 'test just under the boundary (e.g. 1.9 or 1.99 hours)';
    if (!h.some(function (x) { return x > 2 && x <= 2.5; })) return 'test just over the boundary (e.g. 2.1 hours)';
    return h.some(function (x) { return x <= 0; }) ? 'OK' : 'test an appointment that has already started (0 or negative hours)';
  }, { nhom: 'f2' }),
  kiemTap('CR07_AFFECTED', AFFECTED, { en: 'C — CR-07: every item to review (UC-02, BR-03 and everything downstream)', vi: 'C — CR-07: mọi mục phải rà (UC-02, BR-03 và mọi thứ phía sau)' }, { nhom: 'f3' }),
  kiemSo('CR07_EFFORT_HOURS', EFFORT, { en: 'C — CR-07 effort estimate in hours', vi: 'C — ước lượng công CR-07 (giờ)' }, { nhom: 'f4', saiSo: 0 }),
  kiemTuy({ en: 'C — CR-07 decision: defer, with reasons (capacity and release objective)', vi: 'C — quyết định CR-07: hoãn, có lý do (năng lực và mục tiêu bản phát hành)' }, function () {
    if (typeof CR07_DECISION === 'undefined' || !CR07_DECISION) return 'CR07_DECISION is missing';
    if (!/^defer/i.test(String(CR07_DECISION.decision || '').trim())) return 'with ' + 18 + ' hours left the CR does not fit — the CCB should defer it, not approve or reject a useful change';
    var r = String(CR07_DECISION.rationale || '').toLowerCase();
    if (!/(hour|capacity|effort|time|20|18)/.test(r)) return 'rationale: compare the effort with the remaining capacity';
    return /(release 2|next release|later release|release two)/.test(r) ? 'OK' : 'rationale: say when it will be reconsidered (release 2)';
  }, { nhom: 'f5' }),
  kiemTuy({ en: 'C — the life of an approved change request, in order', vi: 'C — vòng đời một yêu cầu thay đổi được duyệt, đúng thứ tự' }, function () {
    if (typeof CR_LIFECYCLE === 'undefined' || !Array.isArray(CR_LIFECYCLE)) return 'CR_LIFECYCLE is missing';
    var want = ['submitted', 'evaluated', 'approved', 'change made', 'verified', 'closed'];
    var got = CR_LIFECYCLE.map(function (s) { return String(s).toLowerCase().replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim(); });
    return JSON.stringify(got) === JSON.stringify(want) ? 'OK' : 'Wiegers: Submitted → Evaluated → Approved → Change Made → Verified → Closed';
  }, { nhom: 'f6' }),
  kiemTap('SUSPECT_LINKS', SUSPECT, { en: 'D — suspect links after BR-03 v2 and UC-02 v3', vi: 'D — liên kết nghi vấn sau BR-03 v2 và UC-02 v3' }, { nhom: 'f7' }),
];

const TEP = {
  'data/rtm.js': [
    `// Given — the ClinicCare traceability data (read only). A link means "to was derived from from@fromVersion".\nconst ITEMS = ${jsLit(ITEMS)};\nconst LINKS = ${jsLit(LINKS)};\nconst HOURS_PER_ITEM = ${JSON.stringify(HOURS)};\nconst REMAINING_CAPACITY_HOURS = ${CAPACITY};\n`,
    `// Given — the ClinicCare traceability data (read only). A link means "to was derived from from@fromVersion".\nconst ITEMS = ${jsLit(ITEMS)};\nconst LINKS = ${jsLit(LINKS)};\nconst HOURS_PER_ITEM = ${JSON.stringify(HOURS)};\nconst REMAINING_CAPACITY_HOURS = ${CAPACITY};\n`,
  ],
  'answers/a-rtm.js': [
    "// A. Read the RTM (ids, sorted or not).\nconst UNTESTED_FR = [];\nconst ORPHAN_FR = [];\nconst TESTS_WITHOUT_REQUIREMENT = [];\n",
    `// A. Follow the links: FR → TC (tested?), UC/BR → FR (source?), FR → TC reversed (what does a test verify?).\nconst UNTESTED_FR = ${JSON.stringify(UNTESTED)};\nconst ORPHAN_FR = ${JSON.stringify(ORPHAN)};   // a birthday greeting nobody asked for: gold plating\nconst TESTS_WITHOUT_REQUIREMENT = ${JSON.stringify(TC_THUA)};   // dark mode is not a requirement of release 1\n`,
  ],
  'answers/b-tests.js': [
    "// B. Conceptual tests for FR-5 (BR-01): { hoursBefore, expected: 'free' | 'refused' }\nconst CANCEL_TESTS = [];\n",
    "// B. Both sides of the boundary, the boundary itself, and an appointment already started.\nconst CANCEL_TESTS = [\n  { hoursBefore: 24, expected: 'free' },\n  { hoursBefore: 2.1, expected: 'free' },\n  { hoursBefore: 2, expected: 'free' },\n  { hoursBefore: 1.9, expected: 'refused' },\n  { hoursBefore: 0.5, expected: 'refused' },\n  { hoursBefore: -0.25, expected: 'refused' },\n];\n",
  ],
  'answers/c-change.js': [
    "// C. CR-07 \"Book for a family member\".\nconst CR07_AFFECTED = [];\nconst CR07_EFFORT_HOURS = 0;\nconst CR07_DECISION = { decision: '', rationale: '' };\nconst CR_LIFECYCLE = [];\n",
    `// C. Impact = the changed items + everything downstream; effort = sum of HOURS_PER_ITEM by type.\nconst CR07_AFFECTED = ${JSON.stringify(AFFECTED)};\nconst CR07_EFFORT_HOURS = ${EFFORT};\nconst CR07_DECISION = {\n  decision: 'Defer',\n  rationale: 'The impact is ${EFFORT} hours but only ${CAPACITY} hours of capacity remain before release 1, and family booking does not serve a release 1 objective; reconsider it for release 2.',\n};\nconst CR_LIFECYCLE = ['Submitted', 'Evaluated', 'Approved', 'Change Made', 'Verified', 'Closed'];\n`,
  ],
  'answers/d-suspect.js': [
    "// D. Links whose upstream item now has a newer version than when the link was recorded.\nconst SUSPECT_LINKS = [];   // e.g. 'BR-03->FR-2'\n",
    `// D. BR-03 is at v2 (link recorded at v1); UC-02 is at v3 (FR-1 link recorded at v2, FR-2 link already at v3).\nconst SUSPECT_LINKS = ${JSON.stringify(SUSPECT)};\n`,
  ],
};

const mod = deLon({
  slug: 'swr302-7-project-cliniccare-m6-change',
  ten: 'ClinicCare project — Milestone 6: Validation, change and traceability',
  moTaModule: 'Dự án ClinicCare, mốc 6 (chương 6–7): đọc RTM tìm yêu cầu chưa test / mồ côi / test thừa, viết test biên cho luật huỷ 2 giờ, phân tích ảnh hưởng và công của CR-07, quyết định CCB, vòng đời CR, liên kết nghi vấn sau khi luật và use case đổi phiên bản; kèm Góc phỏng vấn.',
  baiHoc: 'swr302-7-1-change-control',
  dangBai: 'project',
  tieuDe: 'ClinicCare project — Milestone 6: Validation, change control and traceability',
  phu: { en: 'Running project · milestone 6 of 7 · keep the requirements under control · 10 marks', vi: 'Dự án xuyên suốt · mốc 6/7 · giữ yêu cầu trong tầm kiểm soát · 10 điểm' },
  moTa: {
    en: `${BOI_CANH.en}<p>The SRS is baselined and the team is building. The traceability data is in <code>data/rtm.js</code>:</p>${bangHtml(['Link', 'Recorded at version of "from"'], LINKS.map((l) => [`${l.from} → ${l.to}`, String(l.fromVersion)]))}
<ol>
<li><b>A.</b> From the RTM: functional requirements without a test; functional requirements with no use case or business rule behind them; test cases that verify no requirement.</li>
<li><b>B.</b> Write at least five conceptual tests <code>{ hoursBefore, expected: 'free' | 'refused' }</code> for FR-5 (BR-01).</li>
<li><b>C.</b> Three weeks before release, the owner submits <b>CR-07</b>: "<i>Patients can book for a family member (a child) from their own account.</i>" It changes UC-02 and BR-03. List every item to review (the two changed items and everything downstream of them), estimate the effort with <code>HOURS_PER_ITEM</code>, and give the CCB decision with its rationale (remaining capacity: <b>${CAPACITY} hours</b>). Then list the states an <i>approved</i> change request goes through until it is closed.</li>
<li><b>D.</b> BR-03 has been updated to version 2 and UC-02 to version 3. Which trace links are now suspect?</li>
</ol>`,
    vi: `${BOI_CANH.vi}<p>SRS đã baseline, đội đang làm. Dữ liệu truy vết ở <code>data/rtm.js</code>.</p><ol><li>A. Từ RTM: FR chưa có test; FR không có use case/luật phía sau; test không kiểm yêu cầu nào.</li><li>B. ≥ 5 test khái niệm cho FR-5 (BR-01).</li><li>C. Ba tuần trước phát hành, CR-07 "đặt lịch cho người nhà": liệt kê mọi mục phải rà (UC-02, BR-03 và mọi thứ phía sau), ước lượng công theo HOURS_PER_ITEM, quyết định của CCB và lý do (còn ${CAPACITY} giờ); rồi liệt kê các trạng thái của một CR <i>được duyệt</i> tới khi đóng.</li><li>D. BR-03 lên v2, UC-02 lên v3: liên kết nào thành nghi vấn?</li></ol>`,
  },
  chucNangChinh: [{ en: 'A. Read the RTM.', vi: 'A. Đọc RTM.' }, { en: 'B. Boundary tests.', vi: 'B. Test biên.' }, { en: 'C. Change request CR-07.', vi: 'C. Yêu cầu thay đổi CR-07.' }, { en: 'D. Suspect links.', vi: 'D. Liên kết nghi vấn.' }],
  yeuCauChung: [{ en: 'Use the ids exactly as in data/rtm.js.', vi: 'Dùng đúng id trong data/rtm.js.' }],
  cayThuMuc: `data/rtm.js             ← ITEMS, LINKS, HOURS_PER_ITEM, REMAINING_CAPACITY_HOURS (given)
answers/
├── a-rtm.js            ← UNTESTED_FR, ORPHAN_FR, TESTS_WITHOUT_REQUIREMENT
├── b-tests.js          ← CANCEL_TESTS
├── c-change.js         ← CR07_AFFECTED, CR07_EFFORT_HOURS, CR07_DECISION, CR_LIFECYCLE
└── d-suspect.js        ← SUSPECT_LINKS`,
  moHinh: { ten: 'Answer records', truong: [['id lists', 'string[]', { en: 'any order', vi: 'thứ tự tuỳ ý' }], ['CANCEL_TESTS[i]', "{ hoursBefore: number, expected: 'free' | 'refused' }", { en: '', vi: '' }], ['CR07_DECISION', "{ decision: 'Approve' | 'Defer' | 'Reject', rationale }", { en: '', vi: '' }]] },
  chucNang: [
    { ten: { en: 'A. RTM gaps', vi: 'A. Lỗ hổng RTM' }, diem: 2, yeuCau: [{ en: 'Untested, orphan, unattached tests.', vi: 'Chưa test, mồ côi, test thừa.' }], hook: ['RTM'] },
    { ten: { en: 'B. Boundary tests', vi: 'B. Test biên' }, diem: 2, yeuCau: [{ en: 'Both sides of 2 hours; started appointment.', vi: 'Hai phía 2 giờ; lịch đã bắt đầu.' }], hook: ['testing requirements'] },
    { ten: { en: 'C1. Impact', vi: 'C1. Ảnh hưởng' }, diem: 2, yeuCau: [{ en: 'Changed items and downstream.', vi: 'Mục đổi và phía sau.' }], hook: ['impact analysis'] },
    { ten: { en: 'C2. Effort', vi: 'C2. Công' }, diem: 1, yeuCau: [{ en: 'Sum of hours by type.', vi: 'Tổng giờ theo loại.' }], hook: ['estimation'] },
    { ten: { en: 'C3. CCB decision', vi: 'C3. Quyết định CCB' }, diem: 1, yeuCau: [{ en: 'Decision with rationale.', vi: 'Quyết định kèm lý do.' }], hook: ['CCB'] },
    { ten: { en: 'C4. CR life cycle', vi: 'C4. Vòng đời CR' }, diem: 1, yeuCau: [{ en: 'Wiegers states in order.', vi: 'Trạng thái Wiegers đúng thứ tự.' }], hook: ['change control'] },
    { ten: { en: 'D. Suspect links', vi: 'D. Liên kết nghi vấn' }, diem: 1, yeuCau: [{ en: 'Newer upstream versions.', vi: 'Phiên bản phía trên mới hơn.' }], hook: ['suspect links'] },
  ],
  idBatBuoc: [['UNTESTED_FR · ORPHAN_FR · TESTS_WITHOUT_REQUIREMENT', 'answers/a-rtm.js'], ['CANCEL_TESTS', 'answers/b-tests.js'], ['CR07_*', 'answers/c-change.js'], ['SUSPECT_LINKS', 'answers/d-suspect.js']],
  truDiem: [
    { en: 'Approving CR-07 because "the owner asked" although it does not fit — that is how releases slip.', vi: 'Duyệt CR-07 vì "chủ phòng khám muốn" dù không vừa — bản phát hành trễ từ đó.' },
    { en: 'Listing only the direct children of UC-02 — code and tests further down are affected too.', vi: 'Chỉ liệt kê con trực tiếp của UC-02 — code và test phía sau cũng bị ảnh hưởng.' },
    { en: 'Marking UC-02 → FR-2 suspect: it was recorded at version 3 already.', vi: 'Đánh dấu UC-02 → FR-2 nghi vấn: liên kết đó ghi ở phiên bản 3 rồi.' },
  ],
  goiY: [
    'A: FR không có liên kết sang TC ⇒ chưa test; FR không có liên kết từ UC/BR ⇒ mồ côi; TC không có liên kết vào ⇒ test thừa.',
    'C: duyệt BFS từ UC-02 và BR-03; công = Σ HOURS_PER_ITEM[loại] của mọi mục (kể cả UC-02, BR-03).',
    'D: so version hiện tại của mục "from" với fromVersion của từng liên kết.',
  ],
  loiHayGap: ['Quên FR-8 chưa có test.', 'Không tính chính UC-02 và BR-03 vào công.', 'Coi "Deferred" là một trạng thái của vòng đời chuẩn.'],
  giaiThich: {
    en: `<p>The RTM shows FR-4 (VAT) and FR-8 (national code) untested — two legal requirements; FR-9 (birthday greeting) has no source — gold plating; TC-10 tests something nobody required. CR-07 touches ${AFFECTED.length} items for ${EFFORT} hours against ${CAPACITY} hours of capacity, so the CCB defers it to release 2 and records the decision. After BR-03 and UC-02 changed, ${SUSPECT.join(' and ')} must be re-checked.</p>`,
    vi: `<p>RTM cho thấy FR-4 (VAT) và FR-8 (mã quốc gia) chưa có test — hai yêu cầu pháp lý; FR-9 (chúc mừng sinh nhật) không có nguồn — mạ vàng; TC-10 kiểm thứ không ai yêu cầu. CR-07 chạm ${AFFECTED.length} mục, ${EFFORT} giờ so với ${CAPACITY} giờ còn lại ⇒ CCB hoãn sang bản 2 và ghi lại quyết định. Sau khi BR-03 và UC-02 đổi, phải rà lại ${SUSPECT.join(' và ')}.</p>`,
  },
  khaiNiem: ['RTM', 'testing the requirements', 'change control', 'impact analysis', 'suspect links'],
  tienQuyet: ['Milestone 5', 'SWR302 lessons 6.4, 7.1–7.4'],
  thuatNgu: tn('rtm', 'ccb', 'impactAnalysis', 'baseline', 'goldPlating', 'acceptanceCriteria'),
  moTaNgan: 'Dự án ClinicCare mốc 6: RTM, test biên, CR-07, liên kết nghi vấn.',
  phut: 70,
  tep: TEP,
  kiem: KIEM,
  boYeu: [{ ten: 'chỉ con trực tiếp, duyệt CR, test không có biên', tep: {
    'answers/b-tests.js': "const CANCEL_TESTS = [{ hoursBefore: 24, expected: 'free' }, { hoursBefore: 10, expected: 'free' }, { hoursBefore: 5, expected: 'free' }, { hoursBefore: 1, expected: 'refused' }, { hoursBefore: 0.5, expected: 'refused' }];\n",
    'answers/c-change.js': "const CR07_AFFECTED = ['UC-02', 'FR-1', 'FR-2'];\nconst CR07_EFFORT_HOURS = 6;\nconst CR07_DECISION = { decision: 'Approve', rationale: 'The owner wants it.' };\nconst CR_LIFECYCLE = ['Submitted', 'Approved', 'Change Made', 'Closed'];\n",
  } }],
});

mod.de.push(phongVan({
  moc: 'change and traceability',
  khaiNiem: ['change control', 'traceability'],
  thuatNgu: tn('ccb', 'rtm', 'impactAnalysis', 'scopeCreep'),
  cau: [
    { en: '"The client asks for a ‘small’ change two weeks before release. What do you do?"', vi: '"Khách xin một thay đổi ‘nhỏ’ hai tuần trước phát hành. Bạn làm gì?"', lc: [['a', '"I log it as a change request, run an impact analysis with the RTM — requirements, design, code, tests, documents — estimate the effort and let the change control board decide against the remaining capacity. Small-looking changes often are not small."'], ['b', '"I just do it, it is small."'], ['c', '"I refuse all changes after the baseline."'], ['d', '"I ask the developers to fit it in overtime."']], dap: 'a', giai: ['Process, impact, decision by the right people.', 'Quy trình, ảnh hưởng, đúng người quyết.'] },
    { en: '"What is a requirements traceability matrix good for?"', vi: '"Ma trận truy vết yêu cầu dùng để làm gì?"', lc: [['a', '"To prove every requirement is designed, built and tested, to find gold plating and missing tests, and to find everything a change affects."'], ['b', '"To list the team members."'], ['c', '"To schedule the sprints."'], ['d', '"It is only for audits."']], dap: 'a', giai: ['Coverage, gold plating, impact.', 'Độ phủ, mạ vàng, ảnh hưởng.'] },
    { en: '"What is a baseline?"', vi: '"Baseline là gì?"', lc: [['a', '"A reviewed, agreed set of requirements that development is based on; after it, changes go through change control."'], ['b', '"The first draft of the SRS."'], ['c', '"The minimum number of requirements."'], ['d', '"The database schema."']], dap: 'a', giai: ['Agreed + controlled.', 'Đã thống nhất + có kiểm soát.'] },
    { en: '"A requirement changed. How do you know which tests to re-run?"', vi: '"Một yêu cầu đã đổi. Làm sao biết phải chạy lại test nào?"', lc: [['a', '"I follow its trace links forward: every link from the changed item becomes suspect, and the tests (and design, code) at the other end must be reviewed and re-run."'], ['b', '"I re-run every test, always."'], ['c', '"I ask the tester to guess."'], ['d', '"None — the tests were already passing."']], dap: 'a', giai: ['Suspect links drive regression scope.', 'Liên kết nghi vấn xác định phạm vi kiểm lại.'] },
  ],
}));

export default mod;
