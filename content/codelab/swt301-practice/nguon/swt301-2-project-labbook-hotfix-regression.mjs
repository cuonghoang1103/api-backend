/**
 * SWT301 · DỰ ÁN LABBOOK — MỐC CHƯƠNG 2: bản sửa khẩn 1.0.1 (luật huỷ trước 2 giờ) — viết ca CONFIRMATION + bộ REGRESSION chạy
 * thật trên LabBook (bắt các bản build lỗi), cộng chiến lược cấp test; kèm Góc phỏng vấn 2.
 */
import { doiDau, KHOA, hai, giai, lc, jsLit, kiemKhoa, NOP_BAI, tn } from './_chung.mjs';
import { tinhDe, kiemTuy } from './_de.mjs';
import { kiemKichBan, LABBOOK_API, DOT_BIEN_HE_THONG, DOT_BIEN_TICH_HOP } from './_labbook.mjs';

const b = (as, call, body, expect) => ({ as, call, ...(body !== undefined ? { body } : {}), ...(expect !== undefined ? { expect } : {}) });
const book = (as, labCode, date, startHour, duration, expect) => b(as, 'POST /api/bookings', { labCode, date, startHour, duration }, expect);
const huy = (as, code, expect) => b(as, `DELETE /api/bookings/${code}`, undefined, expect);
const ca = (id, kind, description, steps) => ({ id, kind, description, precondition: 'Seed data; clock Mon 2026-11-02 08:00; build 1.0.1', steps });

const GIAI = [
  ca('CF-01', 'CONFIRMATION', 'DEF-12: a booking that starts in less than 2 hours can no longer be cancelled', [
    book('student1', 'LAB01', '2026-11-02', 9, 1, { status: 201, body: { code: 'BK0001', status: 'CONFIRMED' } }),
    huy('student1', 'BK0001', { status: 409, body: { error: 'TOO_LATE' } }),
  ]),
  ca('CF-02', 'CONFIRMATION', 'DEF-12 boundary: exactly 2 hours before the start the cancellation is still allowed', [
    book('student1', 'LAB01', '2026-11-02', 10, 1, { status: 201 }),
    huy('student1', 'BK0001', { status: 200, body: { status: 'CANCELLED' } }),
  ]),
  ca('RG-01', 'REGRESSION', 'cancelling a future booking is stored in the database, not only answered', [
    book('student1', 'LAB01', '2026-11-04', 9, 2, { status: 201 }),
    huy('student1', 'BK0001', { status: 200, body: { status: 'CANCELLED' } }),
    b('student1', 'GET /test/db/bookings', undefined, { status: 200, body: [{ code: 'BK0001', status: 'CANCELLED' }] }),
  ]),
  ca('RG-02', 'REGRESSION', 'promotion after a cancellation: first come, first served, and the promoted student is e-mailed', [
    book('student1', 'LAB02', '2026-11-04', 9, 1, { status: 201, body: { status: 'CONFIRMED' } }),
    book('student2', 'LAB02', '2026-11-04', 9, 1, { status: 201, body: { status: 'PENDING' } }),
    book('student3', 'LAB02', '2026-11-04', 9, 1, { status: 201, body: { status: 'PENDING' } }),
    huy('student1', 'BK0001', { status: 200 }),
    b('student2', 'GET /api/bookings/me', undefined, { status: 200, body: [{ code: 'BK0002', status: 'CONFIRMED' }] }),
    b('student3', 'GET /api/bookings/me', undefined, { status: 200, body: [{ code: 'BK0003', status: 'PENDING' }] }),
    b('admin', 'GET /test/outbox', undefined, { status: 200, body: [{}, {}, {}, { to: 'binh@fpt.edu.vn', subject: 'Booking confirmed', ref: 'BK0002' }] }),
  ]),
  ca('RG-03', 'REGRESSION', 'only the owner can cancel', [
    book('student1', 'LAB01', '2026-11-04', 9, 1, { status: 201 }),
    huy('student2', 'BK0001', { status: 403, body: { error: 'NOT_OWNER' } }),
  ]),
  ca('RG-04', 'REGRESSION', 'a cancelled booking cannot be cancelled again; an unknown code is not found', [
    book('student1', 'LAB01', '2026-11-04', 9, 1, { status: 201 }),
    huy('student1', 'BK0001', { status: 200 }),
    huy('student1', 'BK0001', { status: 409, body: { error: 'ALREADY_CANCELLED' } }),
    huy('student1', 'BK9999', { status: 404, body: { error: 'BOOKING_NOT_FOUND' } }),
  ]),
  ca('RG-05', 'REGRESSION', 'cancelled hours no longer count toward the weekly 6-hour limit', [
    book('student1', 'LAB01', '2026-11-04', 9, 3, { status: 201 }),
    book('student1', 'LAB01', '2026-11-05', 9, 3, { status: 201 }),
    book('student1', 'LAB01', '2026-11-06', 9, 1, { status: 422, body: { error: 'WEEKLY_LIMIT' } }),
    huy('student1', 'BK0002', { status: 200 }),
    book('student1', 'LAB01', '2026-11-06', 9, 1, { status: 201 }),
  ]),
  ca('RG-06', 'REGRESSION', 'cancelling a PENDING booking does not promote anybody', [
    book('student1', 'LAB02', '2026-11-04', 9, 1, { status: 201, body: { status: 'CONFIRMED' } }),
    book('student2', 'LAB02', '2026-11-04', 9, 1, { status: 201, body: { status: 'PENDING' } }),
    huy('student2', 'BK0002', { status: 200, body: { status: 'CANCELLED' } }),
    b('student1', 'GET /api/bookings/me', undefined, { status: 200, body: [{ code: 'BK0001', status: 'CONFIRMED' }] }),
  ]),
];

const CAN = [
  { ma: 'DELETE /api/bookings/:code 409 TOO_LATE', ten: 'the fixed rule: cancel less than 2 h before → 409 TOO_LATE', tenVi: 'luật vừa sửa: huỷ khi còn dưới 2 giờ → 409 TOO_LATE', nhom: 'f1' },
  { ma: 'DELETE /api/bookings/:code 200 CANCELLED', ten: 'a successful cancellation', tenVi: 'huỷ thành công', nhom: 'f2' },
  { ma: 'TRANS PENDING->CONFIRMED', ten: 'a waitlisted booking is promoted', tenVi: 'booking chờ được nâng hạng', nhom: 'f2' },
  { ma: 'DELETE /api/bookings/:code 403 NOT_OWNER', ten: 'cancel by a non-owner', tenVi: 'người không phải chủ huỷ', nhom: 'f2' },
  { ma: 'DELETE /api/bookings/:code 409 ALREADY_CANCELLED', ten: 'cancel twice', tenVi: 'huỷ hai lần', nhom: 'f2', an: true },
];

const KIEM = [
  ...kiemKichBan({
    bien: 'TEST_CASES', minCa: 7, can: CAN, nhomCauTruc: 'f1',
    dotBien: [
      { ...DOT_BIEN_HE_THONG.find((m) => m.ma === 'S5'), nhom: 'f1' },
      DOT_BIEN_TICH_HOP.find((m) => m.ma === 'I6'), DOT_BIEN_TICH_HOP.find((m) => m.ma === 'I4'), DOT_BIEN_HE_THONG.find((m) => m.ma === 'S7'),
      { ...DOT_BIEN_HE_THONG.find((m) => m.ma === 'S3'), an: true },
    ], nhomDotBien: 'f2',
  }),
  kiemTuy({ en: 'Every case has kind CONFIRMATION or REGRESSION; ≥ 1 confirmation and ≥ 5 regression cases', vi: 'Mỗi ca có kind CONFIRMATION hoặc REGRESSION; ≥ 1 confirmation và ≥ 5 regression' }, () => {
    if (typeof TEST_CASES === 'undefined' || !Array.isArray(TEST_CASES)) return 'TEST_CASES is missing';
    const k = TEST_CASES.map((c) => String(c && c.kind).toUpperCase());
    if (k.some((x) => x !== 'CONFIRMATION' && x !== 'REGRESSION')) return 'kind must be CONFIRMATION or REGRESSION';
    const nc = k.filter((x) => x === 'CONFIRMATION').length, nr = k.filter((x) => x === 'REGRESSION').length;
    return nc >= 1 && nr >= 5 ? 'OK' : 'found ' + nc + ' confirmation and ' + nr + ' regression case(s)';
  }, { nhom: 'f1' }),
  kiemTuy({ en: 'A CONFIRMATION case re-tests the fixed defect (expects TOO_LATE on a DELETE)', vi: 'Một ca CONFIRMATION test lại đúng lỗi vừa sửa (mong đợi TOO_LATE ở một lệnh DELETE)' }, () => {
    const L = typeof TEST_CASES !== 'undefined' && Array.isArray(TEST_CASES) ? TEST_CASES : [];
    const ok = L.some((c) => String(c && c.kind).toUpperCase() === 'CONFIRMATION' && Array.isArray(c.steps) && c.steps.some((s) => s && /^DELETE /.test(String(s.call)) && s.expect && s.expect.body && s.expect.body.error === 'TOO_LATE'));
    return ok ? 'OK' : 'confirmation testing re-runs the test of the FIXED defect — label that case CONFIRMATION';
  }, { nhom: 'f1' }),
  kiemTuy({ en: 'No REGRESSION case only repeats the fix (regression looks at the unchanged areas around it)', vi: 'Không ca REGRESSION nào chỉ lặp lại bản sửa (regression nhìn vùng không đổi xung quanh)' }, () => {
    const L = typeof TEST_CASES !== 'undefined' && Array.isArray(TEST_CASES) ? TEST_CASES : [];
    const sai = L.filter((c) => String(c && c.kind).toUpperCase() === 'REGRESSION' && Array.isArray(c.steps) && c.steps.some((s) => s && s.expect && s.expect.body && s.expect.body.error === 'TOO_LATE'));
    return sai.length ? sai.map((c) => c.id).join(', ') + ' re-tests the fix — label it CONFIRMATION' : 'OK';
  }, { nhom: 'f2', an: true }),
  ...kiemKhoa([
    { moTa: { en: 'C — maintenance trigger of 1.0.1', vi: 'C — tác nhân bảo trì của 1.0.1' }, bieuThuc: 'STRATEGY.trigger', chap: ['Modification'], nhom: 'f3' },
    { moTa: { en: 'C — test level of these cases', vi: 'C — cấp test của các ca này' }, bieuThuc: 'STRATEGY.level', chap: ['System testing'], nhom: 'f3' },
    { moTa: { en: 'C — test type family', vi: 'C — họ loại test' }, bieuThuc: 'STRATEGY.type', chap: ['Change-related testing'], nhom: 'f3' },
    { moTa: { en: 'C — which part to automate first', vi: 'C — phần nào tự động hoá trước' }, bieuThuc: 'STRATEGY.automateFirst', chap: ['REGRESSION'], nhom: 'f3' },
    { moTa: { en: 'C — what decides how much to regression-test', vi: 'C — điều gì quyết định hồi quy bao nhiêu' }, bieuThuc: 'STRATEGY.depthDecidedBy', chap: ['Impact analysis and risk'], nhom: 'f3' },
  ]),
];

const BAN_IN = {
  tieuDe: 'LabBook Project · Milestone 2 — Hot-fix 1.0.1: Confirmation and Regression Testing',
  phu: { en: 'Running project · chapter 2 · maintenance testing executed on LabBook · 10 marks', vi: 'Dự án xuyên suốt · chương 2 · kiểm thử bảo trì chạy thật trên LabBook · 10 điểm' },
  moTa: {
    en: `<p>LabBook 1.0 is in production. Students found <b>DEF-12</b>: a booking could be cancelled even when it started in less than 2 hours, leaving seats empty. Hot-fix <b>1.0.1</b> changes the cancellation code (and only that). Before 1.0.1 goes live you must show two things: the fix works (<b>confirmation testing</b>) and nothing around the cancellation broke (<b>regression testing</b> — promotion, the database, the e-mails, ownership, the weekly limit).</p>
<p>Write executable system test cases in <code>TEST_CASES</code>. The grader logs in with the seed accounts, runs every step on LabBook 1.0.1 and then on <b>faulty builds</b> — each a defect the change could have introduced or left behind.</p>${LABBOOK_API.en}
<p>Step format: <code>{ as: 'student1', call: 'DELETE /api/bookings/BK0001', expect: { status: 409, body: { error: 'TOO_LATE' } } }</code>. Every case also has <code>kind: 'CONFIRMATION' | 'REGRESSION'</code>.</p>`,
    vi: `<p>LabBook 1.0 đang chạy thật. Sinh viên phát hiện <b>DEF-12</b>: vẫn huỷ được booking dù chỉ còn dưới 2 giờ là bắt đầu, khiến chỗ bỏ trống. Bản sửa khẩn <b>1.0.1</b> chỉ đổi mã huỷ. Trước khi 1.0.1 lên production bạn phải chứng minh hai điều: bản sửa đúng (<b>confirmation testing</b>) và không có gì quanh việc huỷ bị hỏng (<b>regression testing</b> — nâng hạng, CSDL, thư, quyền chủ, giới hạn tuần).</p>
<p>Viết các ca system test chạy được trong <code>TEST_CASES</code>. Máy chấm đăng nhập bằng tài khoản mẫu, chạy từng bước trên LabBook 1.0.1 rồi trên các <b>bản build lỗi</b> — mỗi bản là một lỗi mà thay đổi có thể gây ra hoặc để sót.</p>${LABBOOK_API.vi}
<p>Mỗi ca có thêm <code>kind: 'CONFIRMATION' | 'REGRESSION'</code>.</p>`,
  },
  chucNangChinh: [
    { en: 'A. Confirmation cases for DEF-12 (and its boundary).', vi: 'A. Ca confirmation cho DEF-12 (và biên của nó).' },
    { en: 'B. A regression suite around the cancellation that detects faulty builds.', vi: 'B. Bộ regression quanh việc huỷ, bắt được các bản build lỗi.' },
    { en: 'C. Name the trigger, level, type family, automation priority and what decides the depth.', vi: 'C. Gọi tên tác nhân, cấp, họ loại test, ưu tiên tự động hoá và điều quyết định độ sâu.' },
  ],
  yeuCauChung: [{ en: 'Every case must PASS on 1.0.1. A faulty build is detected when one of your passing cases fails on it.', vi: 'Mọi ca phải ĐẠT trên 1.0.1. Bản lỗi bị bắt khi một ca đạt của bạn trượt trên nó.' }],
  cayThuMuc: `answers/
├── hotfix-tests.js  ← const TEST_CASES = [ { id, kind, description, precondition, steps } ]
└── strategy.js      ← const STRATEGY = { trigger, level, type, automateFirst, depthDecidedBy }`,
  moHinh: {
    ten: 'STRATEGY — allowed values',
    truong: [
      ['trigger', 'string', { en: 'Modification · Migration · Retirement', vi: 'Modification · Migration · Retirement' }],
      ['level', 'string', { en: 'Component testing · Integration testing · System testing · Acceptance testing', vi: 'Component testing · Integration testing · System testing · Acceptance testing' }],
      ['type', 'string', { en: 'Functional testing · Non-functional testing · White-box testing · Change-related testing', vi: 'Functional testing · Non-functional testing · White-box testing · Change-related testing' }],
      ['automateFirst', 'string', { en: 'CONFIRMATION · REGRESSION', vi: 'CONFIRMATION · REGRESSION' }],
      ['depthDecidedBy', 'string', { en: 'Impact analysis and risk · The number of testers · The deadline only', vi: 'Impact analysis and risk · The number of testers · The deadline only' }],
    ],
  },
  chucNang: [
    { ten: { en: 'A. Confirmation', vi: 'A. Confirmation' }, diem: 3, yeuCau: [{ en: 'Valid, labelled cases; the fixed rule re-tested; the build without the fix (S5) is detected.', vi: 'Ca hợp lệ, có nhãn; test lại đúng luật vừa sửa; bắt được bản chưa sửa (S5).' }], hook: ['confirmation testing'] },
    { ten: { en: 'B. Regression', vi: 'B. Regression' }, diem: 5, yeuCau: [{ en: 'Successful cancel, promotion, non-owner, cancel twice; detect: DB not updated (I6), promoted student not e-mailed (I4), last-come-first-served (S7) and one hidden build.', vi: 'Huỷ thành công, nâng hạng, không phải chủ, huỷ hai lần; bắt: CSDL không cập nhật (I6), người được nâng không nhận thư (I4), người đến sau lên trước (S7) và một bản ẩn.' }], hook: ['regression testing'] },
    { ten: { en: 'C. Strategy', vi: 'C. Chiến lược' }, diem: 2, yeuCau: [{ en: 'Five values.', vi: 'Năm giá trị.' }], hook: ['maintenance testing'] },
  ],
  idBatBuoc: [['TEST_CASES', 'answers/hotfix-tests.js'], ['STRATEGY', 'answers/strategy.js']],
  truDiem: [
    { en: 'Checking only the HTTP answer of DELETE — build I6 answers 200 CANCELLED and keeps the old row.', vi: 'Chỉ kiểm câu trả lời HTTP của DELETE — bản I6 trả 200 CANCELLED nhưng giữ dòng cũ.' },
    { en: 'A promotion test with only ONE waiting student cannot tell first-come-first-served from last-come-first-served.', vi: 'Test nâng hạng chỉ có MỘT người chờ thì không phân biệt được ai đến trước/ai đến sau.' },
  ],
  nopBai: NOP_BAI,
};

const PHONG_VAN = tinhDe({
  tieuDe: 'LabBook Interview corner 2 — Talking about levels, types and regression',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: '<p><b>Interview corner.</b> Questions about test levels, regression and maintenance that interviewers use to see whether you have tested a real product. Choose the answer that shows practice, not only definitions.</p>', vi: '<p><b>Góc phỏng vấn.</b> Câu hỏi về cấp test, hồi quy và bảo trì mà người phỏng vấn dùng để xem bạn đã test sản phẩm thật chưa. Chọn câu thể hiện thực hành, không chỉ định nghĩa.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('“What is the difference between retesting and regression testing?”', '“Retest khác regression test thế nào?”'), luaChon: lc(['a', '“They are the same.”'], ['b', '“Retesting (confirmation) re-runs the test that failed to confirm the fix; regression re-runs tests of the unchanged areas to find side effects. In LabBook’s hot-fix I retested the 2-hour rule and regression-tested promotion, e-mails and the weekly limit.”'], ['c', '“Regression is only for performance.”'], ['d', '“Retesting is done by developers.”']), dapAn: ['b'], giaiThich: giai('Definition + example + what you covered.', 'Định nghĩa + ví dụ + những gì đã phủ.') },
    { ma: 'q2', de: hai('“A hot-fix must go live tonight. You have one hour. What do you test?”', '“Bản sửa khẩn phải lên tối nay. Bạn có một giờ. Bạn test gì?”'), luaChon: lc(['a', 'Everything, as fast as possible'], ['b', 'The fix itself, then a risk-based regression of the impacted area found by impact analysis, plus a smoke test of the critical flows; report what was NOT tested'], ['c', 'Nothing — it is only a small change'], ['d', 'Only the UI']), dapAn: ['b'], giaiThich: giai('Exhaustive testing is impossible; prioritise by impact and risk and be transparent.', 'Không thể test hết; ưu tiên theo tác động và rủi ro, và minh bạch phần chưa test.') },
    { ma: 'q3', de: hai('“Who should write unit tests?”', '“Ai nên viết unit test?”'), luaChon: lc(['a', 'Only testers'], ['b', 'Usually the developers who write the code (often test-first); testers help with techniques and review, and own higher levels'], ['c', 'Nobody — system tests are enough'], ['d', 'The customer']), dapAn: ['b'], giaiThich: giai('Component testing is typically done by developers.', 'Component testing thường do developer làm.') },
    { ma: 'q4', de: hai('“Which tests would you automate first?”', '“Bạn tự động hoá test nào trước?”'), luaChon: lc(['a', 'Exploratory tests'], ['b', 'Stable, frequently run regression tests of high-risk flows (e.g. booking and cancellation)'], ['c', 'Tests that run once'], ['d', 'Usability tests']), dapAn: ['b'], giaiThich: giai('Regression suites are the prime candidate for automation.', 'Bộ regression là ứng viên số một cho tự động hoá.') },
    { ma: 'q5', de: hai('“What is UAT and who does it?”', '“UAT là gì và ai làm?”'), luaChon: lc(['a', '“Unit testing by developers.”'], ['b', '“User acceptance testing: real users check that the system supports their business process before they accept it — e.g. the lab department trying LabBook for a week.”'], ['c', '“Testing by testers on the UI.”'], ['d', '“A performance test.”']), dapAn: ['b'], giaiThich: giai('Acceptance by the business, with a concrete example.', 'Nghiệm thu bởi nghiệp vụ, kèm ví dụ cụ thể.') },
    { ma: 'q6', de: hai('“How do you decide the regression scope after a change?”', '“Bạn quyết định phạm vi regression sau thay đổi thế nào?”'), luaChon: lc(['a', 'Always run everything'], ['b', 'Impact analysis (dependencies, traceability) to find what the change could affect, then risk to decide how deep'], ['c', 'Ask the developer which test to run'], ['d', 'Run only the failed tests']), dapAn: ['b'], giaiThich: giai('Impact analysis + risk — “it depends”.', 'Phân tích tác động + rủi ro — “tuỳ”.') },
  ],
  goiY: ['Trả lời có cấu trúc: định nghĩa → ví dụ dự án → kết quả.', 'Nhắc tới rủi ro và phân tích tác động khi nói về phạm vi.'],
  loiHayGap: ['Nói “test hết” khi thời gian có hạn.', 'Đồng nhất retest với regression.'],
  giaiThich: '<p>All answers: b.</p>',
  thuatNgu: [{ en: 'retesting', vi: 'test lại — confirmation testing' }, { en: 'smoke test', vi: 'test khói — kiểm nhanh luồng chính' }],
  khaiNiem: ['interview'],
});

const GIAI_STRATEGY = "const STRATEGY = {\n  trigger: 'Modification',\n  level: 'System testing',\n  type: 'Change-related testing',\n  automateFirst: 'REGRESSION',\n  depthDecidedBy: 'Impact analysis and risk',\n};\n";

export default doiDau({
  slug: 'swt301-2-project-labbook-hotfix-regression',
  ten: 'LabBook Project 2 — Hot-fix 1.0.1: Confirmation and Regression Testing',
  moTaModule: 'Dự án LabBook — mốc chương 2: bản sửa khẩn luật huỷ 2 giờ — viết ca confirmation + bộ regression chạy thật (CSDL, thư, nâng hạng FIFO, quyền chủ, giới hạn tuần) bắt các bản build lỗi; chiến lược bảo trì; kèm góc phỏng vấn 2.',
  khoa: KHOA,
  baiHoc: 'swt301-maintenance-test-plan',
  de: [
    {
      dangBai: 'project',
      tieuDe: 'LabBook Milestone 2 — Hot-fix 1.0.1: Confirmation and Regression Testing',
      doKho: 'HARD', phut: 75, diem: 100, ngonNgu: 'javascript',
      viDu: [{ input: "book today 09:00 (now 08:00) → DELETE /api/bookings/BK0001", output: '409 TOO_LATE on 1.0.1 · 200 on the faulty build S5', explanation: 'The confirmation test of DEF-12.|||Test confirmation của DEF-12.' }],
      khaiNiem: ['maintenance testing', 'confirmation testing', 'regression testing', 'impact analysis', 'system testing'],
      tienQuyet: ['SWT301 chapter 2', 'LabBook API'],
      the: ['swt301', 'project', 'labbook', 'regression'],
      banIn: BAN_IN,
      thuatNgu: [...tn('confirmation'), { en: 'hot-fix', vi: 'bản sửa khẩn' }, { en: 'faulty build', vi: 'bản build có lỗi' }, { en: 'test hook', vi: 'cổng riêng cho test nhìn CSDL / hộp thư' }],
      goiY: [
        'A: đồng hồ là 08:00 thứ Hai — đặt hôm nay 09:00 rồi huỷ ⇒ TOO_LATE; đặt 10:00 rồi huỷ ⇒ còn đúng 2 giờ ⇒ được.',
        'B: sau khi huỷ, nhìn thẳng CSDL bằng GET /test/db/bookings và hộp thư bằng GET /test/outbox.',
        'Nâng hạng FIFO cần HAI người chờ (LAB02 chỉ 1 chỗ).',
        'Giới hạn tuần: 3 + 3 giờ, thêm 1 bị từ chối; huỷ một booking rồi đặt lại phải được.',
      ],
      loiHayGap: ['Chỉ kiểm status của DELETE.', 'Gắn nhãn REGRESSION cho ca test lại luật vừa sửa.', 'Quên rằng mọi ca bắt đầu từ dữ liệu mẫu — mã booking luôn bắt đầu từ BK0001.'],
      moTaNgan: 'Mốc 2 dự án LabBook: confirmation + regression cho bản sửa khẩn.',
      giaiThich: {
        en: '<p>Confirmation: TOO_LATE at 1 h before and the boundary at exactly 2 h. Regression: the database row (I6), FIFO promotion with two waiting students (S7) and its e-mail (I4), ownership, cancel twice / unknown code, weekly limit after a cancellation (S3), and cancelling a PENDING booking. Strategy: modification · system testing · change-related · automate the regression suite · impact analysis and risk decide the depth.</p>',
        vi: '<p>Confirmation: TOO_LATE ở 1 giờ trước và biên đúng 2 giờ. Regression: dòng CSDL (I6), nâng hạng FIFO với hai người chờ (S7) và thư (I4), quyền chủ, huỷ hai lần / mã lạ, giới hạn tuần sau khi huỷ (S3), huỷ booking PENDING. Chiến lược: modification · system testing · change-related · tự động hoá bộ regression · phân tích tác động và rủi ro quyết định độ sâu.</p>',
      },
      loaiKiem: 'js',
      tests: { loai: 'js', phienBan: 1, tepNap: ['answers/hotfix-tests.js', 'answers/strategy.js'], kiem: KIEM },
      khoiDau: {
        'answers/hotfix-tests.js': `// kind: 'CONFIRMATION' (re-tests the fixed defect) | 'REGRESSION' (unchanged areas around the change)\nconst TEST_CASES = [\n${jsLit(GIAI[0], '  ').replace(/^/, '  ')},\n];\n`,
        'answers/strategy.js': "const STRATEGY = { trigger: '', level: '', type: '', automateFirst: '', depthDecidedBy: '' };\n",
      },
      loiGiai: {
        'answers/hotfix-tests.js': `// LabBook 1.0.1 — confirmation of DEF-12 and regression around the cancellation, executed.\nconst TEST_CASES = ${jsLit(GIAI)};\n`,
        'answers/strategy.js': GIAI_STRATEGY,
      },
      thamKhao: 'https://istqb-glossary.page/regression-testing/',
      boYeu: [
        { ten: 'không có ca giới hạn tuần sau khi huỷ', tep: { 'answers/hotfix-tests.js': `const TEST_CASES = ${jsLit(GIAI.filter((c) => c.id !== 'RG-05'))};\n` }, phaiTruot: ['Hidden faulty build S3'] },
        { ten: 'nâng hạng chỉ một người chờ', tep: { 'answers/hotfix-tests.js': `const TEST_CASES = ${jsLit(GIAI.filter((c) => c.id !== 'RG-02'))};\n` }, phaiTruot: ['Detects faulty build S7', 'Detects faulty build I4'] },
      ],
    },
    PHONG_VAN,
  ],
});
