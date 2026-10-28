/**
 * SWT301 · 7.4 — Configuration management (SWT5 slide 74–78, LO-5.4.1) + bốn hoạt động CM của bộ slide 2023.
 */
import { doiDau, KHOA, hai, giai, lc } from './_chung.mjs';
import { tinhDe, jsDe, kiemTuy } from './_de.mjs';

const E1 = tinhDe({
  tieuDe: 'Configuration management 1 — How CM supports testing (K2)',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p>A test result means nothing unless you can say exactly what was tested. Five questions on what configuration management must ensure and why testers need it.</p>', vi: '<p>Kết quả test vô nghĩa nếu không nói được chính xác cái gì đã được test. Năm câu về những gì quản lý cấu hình phải bảo đảm và vì sao tester cần nó.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('What is the purpose of configuration management in testing?', 'Mục đích của quản lý cấu hình trong kiểm thử là gì?'), luaChon: lc(['a', 'To speed up test execution'], ['b', 'To establish and maintain the integrity of the component or system, the testware and their relationships throughout the lifecycle'], ['c', 'To manage the test team'], ['d', 'To write the test plan']), dapAn: ['b'], giaiThich: giai('Integrity of items, testware and their relationships.', 'Toàn vẹn của hạng mục, testware và mối liên kết giữa chúng.') },
    { ma: 'q2', de: hai('A tester cannot reproduce a failure reported last month. Which CM weakness is the most likely cause?', 'Tester không tái hiện được failure báo tháng trước. Điểm yếu CM nào có khả năng nhất?'), luaChon: lc(['a', 'Too many testers'], ['b', 'The report does not say which build, configuration and test data were used'], ['c', 'The test was automated'], ['d', 'The defect was severe']), dapAn: ['b'], giaiThich: giai('Test item + version + environment must be referenced unambiguously.', 'Hạng mục test + phiên bản + môi trường phải được tham chiếu rõ ràng.') },
    { ma: 'q3', de: hai('Which must be under configuration management?', 'Thứ gì phải được quản lý cấu hình?'), luaChon: lc(['a', 'Only the source code'], ['b', 'Test items AND testware: test cases, scripts, test data, expected results, environment set-up'], ['c', 'Only the test plan'], ['d', 'Only defect reports']), dapAn: ['b'], giaiThich: giai('All items of testware are uniquely identified, version controlled, tracked for changes and related to each other and to the test items.', 'Mọi thành phần testware được định danh duy nhất, quản lý phiên bản, theo dõi thay đổi và liên kết với nhau và với hạng mục test.') },
    { ma: 'q4', de: hai('When should configuration management procedures and infrastructure be identified and implemented?', 'Khi nào nên xác định và dựng quy trình, hạ tầng quản lý cấu hình?'), luaChon: lc(['a', 'After the first release'], ['b', 'During test planning'], ['c', 'Only when a defect cannot be reproduced'], ['d', 'Never — Git does it automatically']), dapAn: ['b'], giaiThich: giai('Planned early, as part of test planning.', 'Lập sớm, trong test planning.') },
    { ma: 'q5', de: hai('Why does a defect report need “test item and version”?', 'Vì sao defect report cần “hạng mục test và phiên bản”?'), luaChon: lc(['a', 'For the reporter’s statistics'], ['b', 'So that the developer debugs exactly the build that failed, and confirmation testing uses a build that contains the fix'], ['c', 'It does not need it'], ['d', 'For billing']), dapAn: ['b'], giaiThich: giai('This ties defect management to CM (lesson 7.6).', 'Đây là chỗ nối quản lý lỗi với CM (bài 7.6).') },
  ],
  goiY: ['CM trả lời câu “ta đã test phiên bản nào?”.', 'Cả testware cũng phải có phiên bản.'],
  loiHayGap: ['Cho rằng chỉ mã nguồn cần quản lý cấu hình.', 'Để việc dựng CM tới khi có sự cố.'],
  giaiThich: '<p>Answers: b · b · b · b · b.</p>',
  thuatNgu: [{ en: 'configuration management (CM)', vi: 'quản lý cấu hình' }, { en: 'configuration item', vi: 'hạng mục cấu hình' }, { en: 'baseline', vi: 'mốc cấu hình đã chốt' }],
  khaiNiem: ['configuration management'],
});

const HDCM = ['Configuration identification', 'Configuration control', 'Status accounting', 'Configuration audit'];
const E2 = tinhDe({
  tieuDe: 'Configuration management 2 — The four classic CM activities (2023 deck)',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>The 2023 SWT5 deck lists four classic CM activities: <b>identification</b> (what is a configuration item, how it is named and versioned), <b>control</b> (how changes are requested, approved and released), <b>status accounting</b> (recording and reporting the state of items and changes), <b>audit</b> (checking that what is delivered matches the records). Classify each LabBook practice.</p>', vi: '<p>Bộ slide SWT5 2023 nêu bốn hoạt động CM kinh điển: <b>identification</b> (cái gì là hạng mục cấu hình, đặt tên và phiên bản ra sao), <b>control</b> (yêu cầu, duyệt, phát hành thay đổi thế nào), <b>status accounting</b> (ghi nhận và báo cáo trạng thái hạng mục và thay đổi), <b>audit</b> (kiểm tra thứ được giao khớp với hồ sơ). Phân loại từng việc của LabBook.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Practice → activity', 'Việc → hoạt động'),
    cot: [{ ma: 'p', ten: 'Practice' }, { ma: 'a', ten: 'Activity', luaChon: HDCM }],
    hang: [
      'Every build is tagged labbook-<major>.<minor>.<patch>+<CI number>; test data sets are named D1, D2… with a version',
      'A change to the booking rules needs an approved change request before it is merged into the release branch',
      'A dashboard shows which build is on each environment and which change requests are included',
      'Before go-live, QA checks that the package on the server contains exactly the components listed in the release notes',
      'The Postman collection, its environment file and the seed data are stored in the repository and versioned with the code',
      'The change control board rejects a last-minute UI change for release 2.1',
    ].map((p, i) => ({ ma: `r${i}`, o: { p } })),
    dapAn: { 'r0.a': HDCM[0], 'r1.a': HDCM[1], 'r2.a': HDCM[2], 'r3.a': HDCM[3], 'r4.a': HDCM[0], 'r5.a': HDCM[1] },
    giaiThich: giai('Naming and versioning items = identification; approving changes = control; reporting the state = status accounting; verifying the delivered configuration = audit.', 'Đặt tên, phiên bản = identification; duyệt thay đổi = control; báo trạng thái = status accounting; kiểm tra cấu hình được giao = audit.'),
  }],
  goiY: ['“Ai duyệt thay đổi” ⇒ control; “báo cáo trạng thái” ⇒ status accounting.', '“So thứ được giao với hồ sơ” ⇒ audit.'],
  loiHayGap: ['Nhầm status accounting với audit.', 'Cho rằng testware không phải hạng mục cấu hình.'],
  giaiThich: '<p>Identification · Control · Status accounting · Audit · Identification · Control.</p>',
  thuatNgu: [{ en: 'change control board', vi: 'hội đồng duyệt thay đổi' }, { en: 'release notes', vi: 'ghi chú phát hành' }],
  khaiNiem: ['configuration management'],
});

const E3 = jsDe({
  tieuDe: 'Configuration management 3 — Compare two baselines',
  doKho: 'MEDIUM', phut: 14,
  moTa: { en: `<p>A <b>baseline</b> is a frozen set of configuration items with their versions, e.g. <code>{ 'booking-service': '2.3.1', 'seed-data': 'D7', 'postman-suite': 'v12' }</code>. When a failure appears on build B but not on build A, the first question is: <i>what changed?</i></p>
<p>Write <code>diffBaselines(a, b)</code> returning <code>{ added, removed, changed }</code>: <code>added</code> = items only in b, <code>removed</code> = items only in a (both sorted A→Z), <code>changed</code> = <code>[{ item, from, to }]</code> for items whose version differs, sorted by item. Then write <code>sameTestedConfiguration(log, baseline)</code> — <code>log</code> is <code>{ item: version }</code> recorded in a test log: return <code>true</code> only if every item of the log exists in the baseline with exactly that version.</p>`, vi: `<p><b>Baseline</b> là một tập hạng mục cấu hình đã chốt kèm phiên bản. Khi failure xuất hiện trên build B mà không có trên build A, câu hỏi đầu tiên là: <i>cái gì đã đổi?</i> Viết <code>diffBaselines(a, b)</code> trả <code>{ added, removed, changed }</code> như bản tiếng Anh, và <code>sameTestedConfiguration(log, baseline)</code> trả <code>true</code> chỉ khi mọi hạng mục ghi trong test log có trong baseline với đúng phiên bản đó.</p>` },
  yeuCau: [{ en: 'Do not modify the inputs.', vi: 'Không sửa đầu vào.' }],
  viDu: [{ input: "diffBaselines({ api: '2.3.0', data: 'D7' }, { api: '2.3.1', data: 'D7', mail: '1.0' })", output: "{ added: ['mail'], removed: [], changed: [{ item: 'api', from: '2.3.0', to: '2.3.1' }] }", explanation: 'api changed, mail is new.|||api đổi, mail mới thêm.' }],
  goiY: ['Duyệt khoá của a và b; dùng Object.keys và kiểm `in`.', 'sameTestedConfiguration: Object.entries(log).every(...)'],
  loiHayGap: ['Quên sắp kết quả.', 'Coi hạng mục có trong log mà không có trong baseline là khớp.'],
  giaiThich: '<p>Comparing baselines is the everyday use of CM in testing: it narrows the search for the cause of a new failure and proves which configuration a test log refers to.</p>',
  thuatNgu: [{ en: 'baseline', vi: 'mốc cấu hình đã chốt' }, { en: 'test log', vi: 'nhật ký chạy test' }],
  khaiNiem: ['configuration management'],
  tep: {
    'baseline.js': [
      'function diffBaselines(a, b) {\n  return { added: [], removed: [], changed: [] };\n}\n\nfunction sameTestedConfiguration(log, baseline) {\n  return true;\n}\n',
      'function diffBaselines(a, b) {\n  const added = Object.keys(b).filter((k) => !(k in a)).sort();\n  const removed = Object.keys(a).filter((k) => !(k in b)).sort();\n  const changed = Object.keys(a).filter((k) => k in b && a[k] !== b[k]).sort().map((item) => ({ item, from: a[item], to: b[item] }));\n  return { added, removed, changed };\n}\n\nfunction sameTestedConfiguration(log, baseline) {\n  return Object.entries(log).every(([k, v]) => k in baseline && baseline[k] === v);\n}\n',
    ],
  },
  kiem: [
    kiemTuy({ en: 'diffBaselines — the example', vi: 'diffBaselines — ví dụ' }, () => { const r = diffBaselines({ api: '2.3.0', data: 'D7' }, { api: '2.3.1', data: 'D7', mail: '1.0' }); return JSON.stringify(r) === '{"added":["mail"],"removed":[],"changed":[{"item":"api","from":"2.3.0","to":"2.3.1"}]}' ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'diffBaselines — removed and several changes, sorted', vi: 'diffBaselines — bị xoá và nhiều thay đổi, đã sắp' }, () => { const r = diffBaselines({ z: '1', b: '1', a: '1', old: 'x' }, { z: '2', b: '1', a: '3' }); return JSON.stringify(r) === '{"added":[],"removed":["old"],"changed":[{"item":"a","from":"1","to":"3"},{"item":"z","from":"1","to":"2"}]}' ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'sameTestedConfiguration — match and version mismatch', vi: 'sameTestedConfiguration — khớp và lệch phiên bản' }, () => { const B = { api: '2.3.1', data: 'D7', suite: 'v12' }; return sameTestedConfiguration({ api: '2.3.1', data: 'D7' }, B) === true && sameTestedConfiguration({ api: '2.3.0' }, B) === false ? 'OK' : 'expected true then false'; }),
    kiemTuy({ en: 'sameTestedConfiguration — item missing from the baseline', vi: 'sameTestedConfiguration — hạng mục không có trong baseline' }, () => (sameTestedConfiguration({ mail: '1.0' }, { api: '2.3.1' }) === false ? 'OK' : 'an item that is not in the baseline cannot match')),
    kiemTuy({ en: 'identical baselines ⇒ nothing changed', vi: 'baseline giống hệt ⇒ không đổi gì' }, () => { const r = diffBaselines({ a: '1' }, { a: '1' }); return JSON.stringify(r) === '{"added":[],"removed":[],"changed":[]}' ? 'OK' : 'got ' + JSON.stringify(r); }, { an: true }),
  ],
});

const CM = ['Under configuration management', 'Not needed under CM'];
const E4 = tinhDe({
  tieuDe: 'Configuration management 4 — What belongs under CM?',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>The 2023 deck asks what is — and is not — put under CM in testing. Decide for each LabBook item.</p>', vi: '<p>Bộ slide 2023 hỏi cái gì được — và không cần — đặt dưới CM trong kiểm thử. Quyết định cho từng hạng mục LabBook.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Item → CM?', 'Hạng mục → CM?'),
    cot: [{ ma: 'i', ten: 'Item' }, { ma: 'c', ten: 'Decision', luaChon: CM }],
    hang: ['The system test cases of release 2.1', 'The seed data set D7 used by the regression suite', 'The Docker file that builds the test environment', 'The expected results of the refund tests', 'A tester’s scratch notes made while thinking about a charter', 'The JUnit tests of BookingService', 'The coffee machine schedule of the test room'].map((i, k) => ({ ma: `r${k}`, o: { i } })),
    dapAn: { 'r0.c': CM[0], 'r1.c': CM[0], 'r2.c': CM[0], 'r3.c': CM[0], 'r4.c': CM[1], 'r5.c': CM[0], 'r6.c': CM[1] },
    giaiThich: giai('Everything needed to repeat a test exactly — cases, data, expected results, environment set-up, automated tests — is testware under CM. Personal scratch notes and unrelated items are not.', 'Mọi thứ cần để chạy lại một test y hệt — case, dữ liệu, kết quả mong đợi, cách dựng môi trường, test tự động — là testware dưới CM. Ghi chú nháp cá nhân và thứ không liên quan thì không.'),
  }],
  goiY: ['Hỏi: thiếu nó thì có chạy lại được test y hệt không?', 'Môi trường test cũng là cấu hình.'],
  loiHayGap: ['Bỏ môi trường test ra khỏi CM.', 'Đưa ghi chú nháp cá nhân vào CM (phiếu phiên đã nộp thì khác — nó là sản phẩm).'],
  giaiThich: '<p>CM · CM · CM · CM · Not · CM · Not.</p>',
  thuatNgu: [{ en: 'testware', vi: 'mọi sản phẩm của việc test' }],
  khaiNiem: ['configuration management'],
});

export default doiDau({
  slug: 'swt301-configuration-management',
  ten: '7.4 Configuration management',
  moTaModule: 'CM hỗ trợ kiểm thử thế nào, bốn hoạt động CM (identification, control, status accounting, audit), viết code so hai baseline và kiểm test log khớp cấu hình, cái gì thuộc CM.',
  khoa: KHOA,
  baiHoc: 'swt301-configuration-management',
  de: [E1, E2, E3, E4],
});
