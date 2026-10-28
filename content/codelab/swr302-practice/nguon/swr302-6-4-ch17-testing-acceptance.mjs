/**
 * SWR302 · 6.4 — Testing the requirements and acceptance criteria (Wiegers Ch.17).
 */
import { tn, kiemTuy } from './_chung.mjs';
import { phanLoai, tracNghiem, baiJs, moDun } from './_bai.mjs';

const E1 = tracNghiem({
  tieuDe: 'Requirement tests 1 — what conceptual tests reveal',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Wiegers: write <b>conceptual tests</b> from the requirements early, without knowing the UI. Each test describes the expected behaviour for a situation. When you cannot write a test, or the test and the requirement disagree, you have found a requirement defect.</p>', vi: '<p>Wiegers: viết <b>test khái niệm</b> từ yêu cầu từ sớm, chưa cần biết giao diện. Không viết được test, hoặc test mâu thuẫn với yêu cầu ⇒ đã tìm ra lỗi yêu cầu.</p>' },
  cau: [
    { en: 'Requirement: "Members get a discount." Writing a test, you ask "how much, and from when?" This reveals…', vi: 'Yêu cầu: "Hội viên được giảm giá." Viết test, bạn hỏi "bao nhiêu, từ khi nào?". Điều này cho thấy…', lc: [['a', 'an incomplete, unverifiable requirement'], ['b', 'a code bug'], ['c', 'nothing'], ['d', 'a UI problem']], dap: 'a', giai: ['Missing values ⇒ incomplete.', 'Thiếu giá trị ⇒ chưa đầy đủ.'] },
    { en: 'Conceptual tests are written…', vi: 'Test khái niệm được viết…', lc: [['a', 'from the requirements, independent of the UI and code'], ['b', 'after the UI is finished'], ['c', 'by copying the code'], ['d', 'only by developers']], dap: 'a', giai: ['They test the requirements themselves.', 'Chúng kiểm chính các yêu cầu.'] },
    { en: 'A test from the use case and a test from the functional requirement give different expected results. You should…', vi: 'Test từ use case và test từ yêu cầu chức năng cho kết quả mong đợi khác nhau. Bạn nên…', lc: [['a', 'investigate — one of the requirements (or models) is wrong'], ['b', 'pick the easier one'], ['c', 'delete both tests'], ['d', 'ignore']], dap: 'a', giai: ['Disagreement reveals a defect.', 'Mâu thuẫn lộ ra lỗi.'] },
  ],
  goiY: ['Không viết được test ⇒ yêu cầu chưa rõ/đủ.', 'Test khái niệm không phụ thuộc giao diện.'],
  loiHayGap: ['Đợi có giao diện mới viết test.', 'Chọn kết quả dễ hơn khi hai nguồn mâu thuẫn.'],
  giaiThich: '<p>Answers: a · a · a.</p>',
  thuatNgu: tn('verifiable', 'validation'),
  khaiNiem: ['testing the requirements'],
});

const E2 = baiJs({
  tieuDe: 'Requirement tests 2 — derive boundary tests from a requirement',
  doKho: 'MEDIUM', phut: 12,
  moTa: { en: '<p>FR-15 (ShopNow): "Orders of at least 500,000 VND and less than 1,000,000 VND get a 5% discount. Orders of at least 1,000,000 VND get a 10% discount. Smaller orders get no discount." Write <code>TESTS</code>: an array of <code>{ total, discountPercent }</code> conceptual tests that cover every boundary: the last value before and the first value of each band (whole VND). Each expected value must be correct according to FR-15. 6 to 10 tests.</p>', vi: '<p>FR-15: "Đơn từ 500.000đ tới dưới 1.000.000đ giảm 5%. Từ 1.000.000đ giảm 10%. Nhỏ hơn không giảm." Viết <code>TESTS</code> gồm các test khái niệm <code>{ total, discountPercent }</code> phủ mọi biên: giá trị cuối trước và giá trị đầu của mỗi khoảng (đồng nguyên). Kết quả mong đợi phải đúng theo FR-15. 6–10 test.</p>' },
  yeuCau: [{ en: 'Boundaries: 499,999 / 500,000 and 999,999 / 1,000,000; also a typical value inside each band.', vi: 'Biên: 499.999 / 500.000 và 999.999 / 1.000.000; thêm một giá trị điển hình trong mỗi khoảng.' }],
  viDu: [{ input: '{ total: 500000, discountPercent: ? }', output: '5', explanation: '"at least 500,000" includes 500,000.|||"at least" bao gồm 500.000.' }],
  tep: { 'tests.js': ["const TESTS = [\n  // { total: 100000, discountPercent: 0 },\n];\n", "const TESTS = [\n  { total: 100000, discountPercent: 0 },\n  { total: 499999, discountPercent: 0 },\n  { total: 500000, discountPercent: 5 },\n  { total: 750000, discountPercent: 5 },\n  { total: 999999, discountPercent: 5 },\n  { total: 1000000, discountPercent: 10 },\n  { total: 2500000, discountPercent: 10 },\n];\n"] },
  kiem: [
    kiemTuy({ en: '6 to 10 well-formed tests', vi: '6–10 test đúng dạng' }, function () {
      if (typeof TESTS === 'undefined' || !Array.isArray(TESTS)) return 'TESTS must be an array';
      if (TESTS.length < 6 || TESTS.length > 10) return 'write 6 to 10 tests (got ' + TESTS.length + ')';
      for (var i = 0; i < TESTS.length; i++) { var t = TESTS[i]; if (!t || typeof t.total !== 'number' || typeof t.discountPercent !== 'number') return 'test ' + i + ' needs numeric total and discountPercent'; }
      return 'OK';
    }),
    kiemTuy({ en: 'every expected value follows FR-15', vi: 'mọi kết quả mong đợi đúng FR-15' }, function () {
      if (typeof TESTS === 'undefined' || !Array.isArray(TESTS)) return 'TESTS must be an array';
      for (var i = 0; i < TESTS.length; i++) {
        var t = TESTS[i], d = t.total >= 1000000 ? 10 : t.total >= 500000 ? 5 : 0;
        if (t.discountPercent !== d) return 'total ' + t.total + ' ⇒ ' + d + '% (got ' + t.discountPercent + '%)';
      }
      return 'OK';
    }),
    kiemTuy({ en: 'covers the 500,000 boundary on both sides', vi: 'phủ biên 500.000 hai phía' }, function () {
      if (typeof TESTS === 'undefined' || !Array.isArray(TESTS)) return 'TESTS must be an array';
      var s = TESTS.map(function (t) { return t.total; });
      return s.indexOf(499999) >= 0 && s.indexOf(500000) >= 0 ? 'OK' : 'test 499,999 and 500,000';
    }),
    kiemTuy({ en: 'covers the 1,000,000 boundary on both sides', vi: 'phủ biên 1.000.000 hai phía' }, function () {
      if (typeof TESTS === 'undefined' || !Array.isArray(TESTS)) return 'TESTS must be an array';
      var s = TESTS.map(function (t) { return t.total; });
      return s.indexOf(999999) >= 0 && s.indexOf(1000000) >= 0 ? 'OK' : 'test 999,999 and 1,000,000';
    }),
    kiemTuy({ en: 'each of the three bands has at least one test', vi: 'mỗi khoảng có ít nhất một test' }, function () {
      if (typeof TESTS === 'undefined' || !Array.isArray(TESTS)) return 'TESTS must be an array';
      var c = [0, 0, 0];
      TESTS.forEach(function (t) { c[t.total >= 1000000 ? 2 : t.total >= 500000 ? 1 : 0]++; });
      return c[0] && c[1] && c[2] ? 'OK' : 'cover all three bands (no discount, 5%, 10%)';
    }),
  ],
  goiY: ['"at least" bao gồm giá trị biên; "less than" thì không.', 'Mỗi biên cần hai test: ngay trước và ngay tại biên.'],
  loiHayGap: ['Chỉ test giá trị giữa khoảng.', 'Ghi 500.000 ⇒ 0%.'],
  giaiThich: '<p>Boundary tests sit on both sides of each edge: 499,999 → 0%, 500,000 → 5%, 999,999 → 5%, 1,000,000 → 10%. Writing them forces the analyst to confirm whether each boundary is inclusive.</p>',
  thuatNgu: [{ en: 'boundary value', vi: 'giá trị biên' }, { en: 'conceptual test', vi: 'test khái niệm — viết từ yêu cầu, chưa phụ thuộc giao diện' }],
  khaiNiem: ['testing the requirements'],
  boYeu: [{ ten: 'chỉ giữa khoảng', tep: { 'tests.js': "const TESTS=[{total:100000,discountPercent:0},{total:200000,discountPercent:0},{total:600000,discountPercent:5},{total:700000,discountPercent:5},{total:1500000,discountPercent:10},{total:3000000,discountPercent:10}];\n" } }],
});

const E3 = baiJs({
  tieuDe: 'Requirement tests 3 — acceptance criteria in Given/When/Then',
  doKho: 'HARD', phut: 15,
  moTa: { en: '<p>User story: "As a <b>pet owner</b>, I want to <b>cancel an appointment</b> so that <b>the slot can be given to someone else</b>." Business rule: cancellation is allowed up to 2 hours before the appointment; later cancellations are refused with a message. Write <code>CRITERIA</code>: an array of at least 3 scenarios, each <code>{ title, given, when, then }</code>. Include the success scenario, the "too late" scenario (refused), and one more (for example the freed slot becoming bookable or a notification to the clinic).</p>', vi: '<p>Story: chủ thú cưng huỷ lịch hẹn để nhường slot. Luật: được huỷ tới trước 2 giờ; trễ hơn thì từ chối kèm thông báo. Viết <code>CRITERIA</code> ít nhất 3 kịch bản <code>{ title, given, when, then }</code>: thành công, "quá muộn" (bị từ chối), và một kịch bản nữa.</p>' },
  yeuCau: [{ en: 'Given = state, When = one action, Then = observable result; numbers where the rule has numbers.', vi: 'Given = trạng thái, When = một hành động, Then = kết quả quan sát được; có số khi luật có số.' }],
  viDu: [{ input: 'success', output: 'Given an appointment 5 hours from now / When the owner cancels it / Then the appointment is cancelled and the slot becomes available', explanation: '|||' }],
  tep: { 'criteria.js': ["const CRITERIA = [\n  // { title: '', given: '', when: '', then: '' },\n];\n", "const CRITERIA = [\n  { title: 'Cancel in time', given: 'an owner has an appointment 5 hours from now', when: 'the owner cancels the appointment', then: 'the appointment is cancelled and the owner sees a confirmation' },\n  { title: 'Too late to cancel', given: 'an owner has an appointment 1 hour from now', when: 'the owner tries to cancel the appointment', then: 'the cancellation is refused and the message \"Appointments can only be cancelled up to 2 hours before\" is shown' },\n  { title: 'Exactly at the limit', given: 'an owner has an appointment exactly 2 hours from now', when: 'the owner cancels the appointment', then: 'the appointment is cancelled' },\n  { title: 'Slot freed', given: 'an appointment at 10:00 was cancelled', when: 'another owner searches for free slots that day', then: 'the 10:00 slot is shown as available' },\n];\n"] },
  kiem: [
    kiemTuy({ en: 'at least 3 complete scenarios', vi: 'ít nhất 3 kịch bản đầy đủ' }, function () {
      if (typeof CRITERIA === 'undefined' || !Array.isArray(CRITERIA)) return 'CRITERIA must be an array';
      if (CRITERIA.length < 3) return 'at least 3 scenarios';
      for (var i = 0; i < CRITERIA.length; i++) { var c = CRITERIA[i] || {}; var k = ['title', 'given', 'when', 'then']; for (var j = 0; j < 4; j++) if (String(c[k[j]] || '').trim().length < 5) return 'scenario ' + i + ': "' + k[j] + '" is empty or too short'; }
      return 'OK';
    }),
    kiemTuy({ en: 'When is one action; Then is an observable result', vi: 'When là một hành động; Then là kết quả quan sát được' }, function () {
      if (typeof CRITERIA === 'undefined' || !Array.isArray(CRITERIA)) return 'CRITERIA must be an array';
      for (var i = 0; i < CRITERIA.length; i++) {
        var c = CRITERIA[i] || {};
        if (/\bthen\b/i.test(c.when) || (String(c.when).match(/\band\b/gi) || []).length > 1) return 'scenario ' + i + ': keep "when" to a single action';
        if (/\b(works|is ok|is fine|correctly|properly|as expected)\b/i.test(c.then)) return 'scenario ' + i + ': "then" must say what is observed, not "works correctly"';
      }
      return 'OK';
    }),
    kiemTuy({ en: 'includes a successful cancellation', vi: 'có kịch bản huỷ thành công' }, function () {
      if (typeof CRITERIA === 'undefined' || !Array.isArray(CRITERIA)) return 'CRITERIA must be an array';
      return CRITERIA.some(function (c) { return /cancel/i.test(c.when) && /cancel(l)?ed|confirm/i.test(c.then) && !/refus|reject|not allowed|denied|cannot/i.test(c.then); }) ? 'OK' : 'add the success scenario (the appointment is cancelled)';
    }),
    kiemTuy({ en: 'includes the "too late" scenario with the 2-hour rule', vi: 'có kịch bản "quá muộn" với luật 2 giờ' }, function () {
      if (typeof CRITERIA === 'undefined' || !Array.isArray(CRITERIA)) return 'CRITERIA must be an array';
      var c = CRITERIA.filter(function (x) { return /refus|reject|not allowed|denied|cannot|blocked/i.test(x.then); });
      if (!c.length) return 'add the scenario where cancellation is refused';
      return c.some(function (x) { var g = String(x.given); var m = g.match(/(\d+(?:\.\d+)?)\s*(minute|hour)/i); if (!m) return false; var h = parseFloat(m[1]) / (/minute/i.test(m[2]) ? 60 : 1); return h < 2; }) ? 'OK' : 'the refused scenario must start less than 2 hours before the appointment (e.g. "1 hour from now")';
    }),
  ],
  goiY: ['Given chứa số giờ cụ thể (vd 1 hour from now).', 'Then nói người dùng THẤY gì (thông báo, trạng thái).'],
  loiHayGap: ['Viết Then = "it works correctly".', 'Chỉ viết đường thuận.'],
  giaiThich: '<p>Good acceptance criteria cover the normal path, the rule violations and the boundaries, each as an observable result. Here the boundary "exactly 2 hours" is worth a scenario too.</p>',
  thuatNgu: tn('acceptanceCriteria', 'userStory'),
  khaiNiem: ['acceptance criteria'],
  boYeu: [{ ten: 'chỉ đường thuận, then mơ hồ', tep: { 'criteria.js': "const CRITERIA=[{title:'Cancel',given:'an owner has an appointment',when:'the owner cancels',then:'it works correctly'},{title:'Cancel 2',given:'an owner has an appointment tomorrow',when:'the owner cancels',then:'the appointment is cancelled'},{title:'Late',given:'an owner has an appointment 3 hours from now',when:'the owner cancels',then:'the cancellation is refused'}];\n" } }],
});

const E4 = phanLoai({
  tieuDe: 'Requirement tests 4 — acceptance criteria, acceptance test or Definition of Done?',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p><b>Acceptance criteria</b>: conditions a specific story or release must satisfy to be accepted. <b>Acceptance test</b>: a concrete test (data, steps, expected result) that checks the criteria. <b>Definition of Done</b>: a team-wide checklist that applies to every story.</p>', vi: '<p><b>Tiêu chí chấp nhận</b>: điều kiện một story/bản phát hành phải thoả. <b>Acceptance test</b>: test cụ thể (dữ liệu, bước, kết quả). <b>Definition of Done</b>: checklist chung cho mọi story.</p>' },
  cot: 'Kind', luaChon: ['Acceptance criteria', 'Acceptance test', 'Definition of Done'],
  hang: [
    ['A cancelled slot becomes available to other owners.', 'Acceptance criteria'],
    ['Log in as owner01, open appointment #A-17 (at 15:00), cancel it at 12:00, expect status "Cancelled".', 'Acceptance test'],
    ['Code reviewed, unit tests pass, documentation updated.', 'Definition of Done'],
    ['Owners cannot cancel less than 2 hours before an appointment.', 'Acceptance criteria'],
    ['Every story is deployed to the staging server before the sprint review.', 'Definition of Done'],
    ['With appointment at 10:00 and current time 09:15, press Cancel ⇒ message E-12 is shown.', 'Acceptance test'],
  ],
  giaiThich: '<p>Criteria are statements; tests are concrete executions with data; the DoD is the same for every story.</p>',
  goiY: ['Có dữ liệu + bước cụ thể ⇒ acceptance test.', 'Áp cho mọi story ⇒ DoD.'],
  loiHayGap: ['Coi DoD là tiêu chí riêng của một story.', 'Nhầm tiêu chí với test cụ thể.'],
  thuatNgu: tn('acceptanceCriteria'),
  khaiNiem: ['acceptance criteria'],
});

export default moDun({
  slug: 'swr302-6-4-ch17-testing-acceptance',
  ten: '6.4 Testing the requirements and acceptance criteria',
  moTaModule: 'Test khái niệm lộ ra lỗi yêu cầu, tự suy ra test biên từ yêu cầu giảm giá, viết tiêu chí chấp nhận Given/When/Then có kịch bản từ chối, phân biệt tiêu chí chấp nhận / acceptance test / DoD.',
  de: [E1, E4, E2, E3],
});
