/**
 * SWR302 · 9.1 — Agile requirements: the product backlog, user story mapping, refinement, DoD.
 */
import { tn, kiemTuy } from './_chung.mjs';
import { phanLoai, tracNghiem, sapXep, baiJs, moDun } from './_bai.mjs';

const E1 = phanLoai({
  tieuDe: 'Agile 1 — where does it sit in the backlog?',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>A product backlog is refined progressively: items at the <b>top</b> are small, detailed, estimated and testable (ready); items in the <b>middle</b> are coarser stories being refined; items at the <b>bottom</b> are epics or themes, big and vague. Place each item.</p>', vi: '<p>Backlog được làm rõ dần: <b>đỉnh</b> là story nhỏ, chi tiết, đã ước lượng, test được; <b>giữa</b> là story thô đang làm rõ; <b>đáy</b> là epic/chủ đề lớn, mơ hồ.</p>' },
  cot: 'Position', luaChon: ['Top — ready', 'Middle — being refined', 'Bottom — epic/theme'],
  hang: [
    ['"As a patient, I want to cancel an appointment up to 2 h before so the slot is freed." 3 points, 4 acceptance criteria.', 'Top — ready'],
    ['"Telemedicine for remote patients."', 'Bottom — epic/theme'],
    ['"As a doctor, I want to see a patient’s history" — not estimated, criteria still being discussed.', 'Middle — being refined'],
    ['"As a receptionist, I want to print today’s schedule." 2 points, criteria agreed, no open questions.', 'Top — ready'],
    ['"Loyalty programme."', 'Bottom — epic/theme'],
  ],
  giaiThich: '<p>Detail is added just in time: ready stories at the top, refining in the middle, big ideas at the bottom.</p>',
  goiY: ['Có ước lượng + tiêu chí chấp nhận + nhỏ ⇒ sẵn sàng.', 'Một cụm từ chung chung ⇒ epic.'],
  loiHayGap: ['Đưa epic lên đỉnh backlog.', 'Coi story chưa ước lượng là sẵn sàng.'],
  thuatNgu: tn('backlog', 'epic', 'userStory'),
  khaiNiem: ['product backlog'],
});

const E2 = sapXep({
  tieuDe: 'Agile 2 — the backbone of a story map',
  doKho: 'EASY', phut: 4,
  moTa: { en: '<p>User story mapping (Jeff Patton): the <b>backbone</b> across the top is the user’s journey — activities in the order the user does them; detailed stories hang below each step, ordered by priority. Put the backbone of a patient using ClinicCare in order.</p>', vi: '<p>Story map: <b>xương sống</b> là hành trình người dùng theo thứ tự; story chi tiết treo bên dưới mỗi bước. Sắp xương sống của bệnh nhân dùng ClinicCare.</p>' },
  cau: [{ en: 'Order the activities', vi: 'Sắp các hoạt động', dung: ['Find a doctor', 'Book a slot', 'Check in at the clinic', 'See the doctor', 'Pay', 'Follow up (results, re-visit)'], hien: [3, 5, 1, 4, 0, 2], giai: ['The journey from first need to after-care.', 'Hành trình từ nhu cầu đầu tới chăm sóc sau.'] }],
  goiY: ['Theo thứ tự người dùng thực sự làm.', 'Thanh toán sau khi khám.'],
  loiHayGap: ['Xếp theo thứ tự ưu tiên thay vì thứ tự hành trình.', 'Đặt Follow up trước Pay.'],
  giaiThich: '<p>Find a doctor → Book a slot → Check in → See the doctor → Pay → Follow up.</p>',
  thuatNgu: [{ en: 'story map', vi: 'bản đồ story — xương sống hành trình + story bên dưới' }, { en: 'walking skeleton', vi: 'bộ xương biết đi — lát mỏng chạy trọn hành trình' }],
  khaiNiem: ['user story mapping'],
});

const MAP = {
  backbone: ['Browse', 'Select', 'Checkout', 'Pay', 'Track'],
  stories: [
    { id: 'S1', step: 'Browse', title: 'List products by category', priority: 'Must' },
    { id: 'S2', step: 'Browse', title: 'Search by keyword', priority: 'Should' },
    { id: 'S3', step: 'Select', title: 'Add to cart', priority: 'Must' },
    { id: 'S4', step: 'Checkout', title: 'Apply coupon', priority: 'Should' },
    { id: 'S5', step: 'Checkout', title: 'Guest checkout', priority: 'Must' },
    { id: 'S6', step: 'Pay', title: 'Pay by card', priority: 'Must' },
    { id: 'S7', step: 'Track', title: 'E-mail order status', priority: 'Could' },
    { id: 'S8', step: 'Track', title: 'Live courier map', priority: 'Could' },
  ],
};

const E3 = baiJs({
  tieuDe: 'Agile 3 — slice a walking skeleton from a story map',
  doKho: 'HARD', phut: 15,
  moTa: { en: '<p>A <b>walking skeleton</b> is a thin first release that touches every step of the backbone. Write <code>function skeleton(map)</code>: for each backbone step <i>in backbone order</i>, choose ONE story — the best priority (Must &gt; Should &gt; Could &gt; Won’t), and among equal priorities the one listed first. Ignore stories whose step is not in the backbone; a step with no stories is reported in <code>gaps</code>. Return <code>{ release1: [ids…], gaps: [steps…] }</code>. Stories with priority "Won’t" never go into release 1 (their step becomes a gap if nothing else is there).</p>', vi: '<p><b>Walking skeleton</b>: bản đầu mỏng chạm mọi bước của xương sống. Viết <code>skeleton(map)</code>: mỗi bước (theo thứ tự xương sống) chọn MỘT story ưu tiên cao nhất (Must &gt; Should &gt; Could), bằng nhau thì lấy cái liệt kê trước; bỏ qua story có bước không thuộc xương sống; bước không có story nào ⇒ đưa vào <code>gaps</code>; story "Won’t" không bao giờ vào bản 1.</p>' },
  yeuCau: [{ en: 'On the sample map: release1 = S1, S3, S5, S6, S7; gaps = [].', vi: 'Với bản đồ mẫu: release1 = S1, S3, S5, S6, S7; gaps = [].' }],
  viDu: [{ input: 'skeleton(MAP)', output: "{ release1: ['S1','S3','S5','S6','S7'], gaps: [] }", explanation: 'Checkout: S5 (Must) beats S4 (Should).|||Checkout: S5 (Must) thắng S4 (Should).' }],
  tep: {
    'map.js': [`const MAP = ${JSON.stringify(MAP, null, 1)};\n`, `const MAP = ${JSON.stringify(MAP, null, 1)};\n`],
    'skeleton.js': ["function skeleton(map) {\n  // TODO\n  return { release1: [], gaps: [] };\n}\n", "var RANK = { 'Must': 0, 'Should': 1, 'Could': 2 };\n\nfunction skeleton(map) {\n  var release1 = [], gaps = [];\n  map.backbone.forEach(function (step) {\n    var best = null;\n    map.stories.forEach(function (s) {\n      if (s.step !== step || !Object.prototype.hasOwnProperty.call(RANK, s.priority)) return;\n      if (!best || RANK[s.priority] < RANK[best.priority]) best = s;\n    });\n    if (best) release1.push(best.id); else gaps.push(step);\n  });\n  return { release1: release1, gaps: gaps };\n}\n"],
  },
  kiem: (function () {
    function bo(moTa, data, mong, ex) {
      return kiemTuy(moTa, new Function('var d = ' + JSON.stringify(data) + ', m = ' + JSON.stringify(mong) + ";\nif (typeof skeleton !== 'function') return 'skeleton is not a function';\nvar r = skeleton(d); if (!r) return 'return { release1, gaps }';\nif (JSON.stringify(r.release1) !== JSON.stringify(m.release1)) return 'release1 should be ' + JSON.stringify(m.release1) + ', got ' + JSON.stringify(r.release1);\nif (JSON.stringify(r.gaps) !== JSON.stringify(m.gaps)) return 'gaps should be ' + JSON.stringify(m.gaps) + ', got ' + JSON.stringify(r.gaps);\nreturn 'OK';"), ex);
    }
    var H1 = { backbone: ['Register', 'Book', 'Remind', 'Pay'], stories: [
      { id: 'P9', step: 'Pay', title: 'Cash at desk', priority: 'Could' },
      { id: 'P1', step: 'Book', title: 'Pick slot', priority: 'Should' },
      { id: 'P2', step: 'Book', title: 'Pick doctor', priority: 'Must' },
      { id: 'P3', step: 'Book', title: 'Pick room', priority: 'Must' },
      { id: 'P4', step: 'Remind', title: 'Push', priority: "Won't" },
      { id: 'P5', step: 'Admin', title: 'Reports', priority: 'Must' },
      { id: 'P6', step: 'Pay', title: 'Card', priority: 'Should' },
    ] };
    return [
      bo({ en: 'sample map', vi: 'bản đồ mẫu' }, MAP, { release1: ['S1', 'S3', 'S5', 'S6', 'S7'], gaps: [] }),
      bo({ en: 'one story per step, in backbone order', vi: 'mỗi bước một story, theo thứ tự xương sống' }, { backbone: ['B', 'A'], stories: [{ id: 'a1', step: 'A', priority: 'Must' }, { id: 'b1', step: 'B', priority: 'Could' }, { id: 'b2', step: 'B', priority: 'Could' }] }, { release1: ['b1', 'a1'], gaps: [] }),
      bo({ en: 'hidden: ties, Won’t, unknown steps, gaps', vi: 'ẩn: hoà ưu tiên, Won’t, bước lạ, khoảng trống' }, H1, { release1: ['P2', 'P6'], gaps: ['Register', 'Remind'] }, { an: true }),
      bo({ en: 'hidden: empty story list', vi: 'ẩn: không có story nào' }, { backbone: ['X', 'Y'], stories: [] }, { release1: [], gaps: ['X', 'Y'] }, { an: true }),
    ];
  })(),
  goiY: ['Duyệt backbone theo thứ tự; với mỗi bước tìm story có hạng nhỏ nhất (Must = 0).', 'So sánh "<" (không "<=") để giữ story liệt kê trước khi hoà.'],
  loiHayGap: ['Sắp tất cả story theo ưu tiên rồi lấy đầu — mất thứ tự xương sống.', 'Đưa story "Won’t" vào bản 1.'],
  giaiThich: '<p>The skeleton gives an end-to-end usable product as early as possible; later releases deepen each step with the remaining stories.</p>',
  thuatNgu: [{ en: 'walking skeleton', vi: 'bộ xương biết đi — lát mỏng chạy trọn hành trình' }, ...tn('moscow')],
  khaiNiem: ['user story mapping'],
  boYeu: [{ ten: 'lấy story đầu tiên mỗi bước, không xét ưu tiên', tep: { 'skeleton.js': "function skeleton(map){ var r=[],g=[]; map.backbone.forEach(function(st){ var s=map.stories.filter(function(x){return x.step===st;})[0]; if(s) r.push(s.id); else g.push(st); }); return {release1:r,gaps:g}; }\n" } }],
});

const E4 = tracNghiem({
  tieuDe: 'Agile 4 — refinement, acceptance criteria and DoD',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>Backlog refinement (grooming) is the ongoing elicitation, analysis and validation of agile projects: the team keeps the top items ready. Acceptance criteria are per story; the Definition of Done is the same for every story.</p>', vi: '<p>Refinement là khai thác–phân tích–thẩm định liên tục trong agile. Tiêu chí chấp nhận là của từng story; DoD áp cho mọi story.</p>' },
  cau: [
    { en: '"We’re agile, so we don’t do requirements." This is…', vi: '"Chúng tôi agile nên không làm yêu cầu." Câu này…', lc: [['a', 'a myth — agile does requirements continuously, in small batches'], ['b', 'correct'], ['c', 'correct for small teams'], ['d', 'required by Scrum']], dap: 'a', giai: ['Agile removes the big document, not the thinking.', 'Agile bỏ tài liệu lớn, không bỏ tư duy.'] },
    { en: 'Who owns the product backlog?', vi: 'Ai sở hữu product backlog?', lc: [['a', 'The product owner'], ['b', 'The tester'], ['c', 'The CEO'], ['d', 'Each developer']], dap: 'a', giai: ['The PO orders it and represents the customers.', 'PO sắp xếp và đại diện khách hàng.'] },
    { en: 'Refinement mainly aims to…', vi: 'Refinement chủ yếu nhằm…', lc: [['a', 'keep the top of the backlog ready (small, clear, estimated, testable)'], ['b', 'write the whole SRS'], ['c', 'assign blame'], ['d', 'deploy the release']], dap: 'a', giai: ['Ready items enter the next iterations.', 'Mục sẵn sàng vào các vòng tới.'] },
  ],
  goiY: ['Agile vẫn làm yêu cầu, chỉ là liên tục và nhỏ.', 'PO sở hữu backlog.'],
  loiHayGap: ['Cho rằng agile không cần tiêu chí chấp nhận.', 'Nghĩ dev sở hữu backlog.'],
  giaiThich: '<p>Answers: a · a · a.</p>',
  thuatNgu: tn('backlog', 'acceptanceCriteria'),
  khaiNiem: ['backlog refinement'],
});

export default moDun({
  slug: 'swr302-9-1-agile-requirements',
  ten: '9.1 Agile requirements: backlog, story mapping and DoD',
  moTaModule: 'Vị trí mục trong backlog (sẵn sàng / đang làm rõ / epic), xương sống story map, tự viết hàm cắt walking skeleton từ story map (ưu tiên MoSCoW, khoảng trống) chấm dữ liệu ẩn, refinement và DoD.',
  de: [E1, E2, E4, E3],
});
