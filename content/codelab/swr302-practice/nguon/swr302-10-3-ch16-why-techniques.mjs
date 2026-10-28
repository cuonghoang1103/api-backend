/**
 * SWR302 · 10.3 — Why prioritise, pragmatics, games, in-or-out and pairwise comparison (Wiegers Ch.16 · 1–9).
 */
import { tn, kiemTuy } from './_chung.mjs';
import { phanLoai, tracNghiem, baiJs, moDun } from './_bai.mjs';

const E1 = tracNghiem({
  tieuDe: 'Prioritisation 1 — why and when',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Prioritisation (requirements triage) reveals competing goals, resolves conflicts, plans staged deliveries, controls scope creep and supports trade-off decisions. Establish priorities <b>early</b>, when you have the most flexibility, and <b>revisit them periodically</b>. Davis\u2019 pragmatics: customers\u2019 needs, relative importance, timing, predecessors, requirements that must be implemented as a group, and cost.</p>', vi: '<p>Ưu tiên giúp lộ mục tiêu cạnh tranh, giải xung đột, lập kế hoạch giao từng phần, kiểm soát phình phạm vi. Đặt sớm và xem lại định kỳ. Davis: nhu cầu, tầm quan trọng tương đối, thời điểm, yêu cầu tiên quyết, nhóm phải làm cùng, chi phí.</p>' },
  cau: [
    { en: 'When should priorities be set?', vi: 'Khi nào đặt ưu tiên?', lc: [['a', 'Early, and revisited periodically as the project and business change'], ['b', 'Once, at the end of analysis'], ['c', 'Only when late'], ['d', 'Never']], dap: 'a', giai: ['Early = most flexibility.', 'Sớm = linh hoạt nhất.'] },
    { en: 'FR-8 "Export to PDF" cannot work before FR-3 "Generate report". Which pragmatic issue is this?', vi: 'FR-8 "Xuất PDF" không thể chạy trước FR-3 "Tạo báo cáo". Đây là vấn đề nào?', lc: [['a', 'Predecessors (dependencies)'], ['b', 'Cost'], ['c', 'Customer needs'], ['d', 'Timing only']], dap: 'a', giai: ['A predecessor must come first.', 'Yêu cầu tiên quyết phải đi trước.'] },
    { en: 'Is priority the same as importance?', vi: 'Ưu tiên có giống tầm quan trọng không?', lc: [['a', 'No — importance is weighed against timing, dependencies and cost'], ['b', 'Yes'], ['c', 'Only in agile'], ['d', 'Only for NFRs']], dap: 'a', giai: ['Priority is a trade-off.', 'Ưu tiên là một sự đánh đổi.'] },
  ],
  goiY: ['Sớm và xem lại định kỳ.', 'Ưu tiên ≠ chỉ tầm quan trọng.'],
  loiHayGap: ['Đặt ưu tiên một lần rồi khoá.', 'Bỏ qua phụ thuộc giữa các yêu cầu.'],
  giaiThich: '<p>Answers: a · a · a.</p>',
  thuatNgu: tn('moscow', 'scopeCreep'),
  khaiNiem: ['why prioritise'],
});

const E2 = phanLoai({
  tieuDe: 'Prioritisation 2 — games and the questions that expose them',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Avoid <b>decibel prioritisation</b> (the loudest voice wins) and <b>threat prioritisation</b> (whoever holds the most political power wins). Wiegers\u2019 questions to get stakeholders to admit lower priorities: Is there another way to satisfy the need? What are the consequences of omitting or deferring it? What is the effect on the business objectives if it waits several months? Is it worth delaying the release of everything else? Classify each situation or question.</p>', vi: '<p>Tránh <b>ưu tiên theo âm lượng</b> và <b>ưu tiên theo đe doạ/quyền lực</b>. Các câu hỏi để bên liên quan thừa nhận mức ưu tiên thấp hơn.</p>' },
  cot: 'Kind', luaChon: ['Decibel prioritisation', 'Threat prioritisation', 'Good probing question'],
  hang: [
    ['The marketing lead shouts the longest in the meeting, so her feature goes first.', 'Decibel prioritisation'],
    ['"If my report is not High, I\u2019ll ask the CEO to stop funding the project."', 'Threat prioritisation'],
    ['"Is there another way to meet this need for the first release?"', 'Good probing question'],
    ['"What happens to the business objectives if this waits three months?"', 'Good probing question'],
    ['The director\u2019s request is always marked Must because he signs the budget.', 'Threat prioritisation'],
    ['"Is this feature worth delaying all the other features at this priority?"', 'Good probing question'],
  ],
  giaiThich: '<p>Both games replace analysis with pressure; the probing questions bring back the real trade-offs.</p>',
  goiY: ['Ai to tiếng nhất ⇒ decibel.', 'Dựa vào quyền lực/đe doạ ⇒ threat.'],
  loiHayGap: ['Coi ưu tiên của giám đốc là đương nhiên đúng.', 'Nhầm hai loại "trò chơi".'],
  thuatNgu: tn('moscow'),
  khaiNiem: ['games people play with priorities'],
});

const E3 = baiJs({
  tieuDe: 'Prioritisation 3 — pairwise comparison and rank ordering',
  doKho: 'HARD', phut: 15,
  moTa: { en: '<p>In <b>pairwise comparison</b>, stakeholders judge, for each pair of features, which is more important; ranking by number of "wins" gives an order. It works for a small set (features, quality attributes) but becomes unwieldy beyond a couple of dozen items (n(n−1)/2 comparisons). Write:</p><ul><li><code>function pairs(n)</code> — how many comparisons are needed for n items.</li><li><code>function rankPairwise(items, judgements)</code> — <code>judgements</code> is an array of <code>[winner, loser]</code>. Return the item ids sorted by number of wins (most first); ties keep the order of <code>items</code>. Ignore judgements that mention unknown items or compare an item with itself; if the same pair is judged more than once, only the <b>last</b> judgement counts.</li></ul>', vi: '<p><b>So sánh từng cặp</b>: với mỗi cặp, chọn cái quan trọng hơn; xếp theo số lần thắng. Viết <code>pairs(n)</code> (số phép so sánh) và <code>rankPairwise(items, judgements)</code>: sắp theo số thắng giảm dần, hoà giữ thứ tự items; bỏ phán xét có mục lạ hoặc tự so với mình; cùng một cặp phán xét nhiều lần ⇒ chỉ lần <b>cuối</b> tính.</p>' },
  yeuCau: [{ en: 'pairs(20) = 190 — why the method does not scale to hundreds of requirements.', vi: 'pairs(20) = 190 — vì sao không dùng được cho hàng trăm yêu cầu.' }],
  viDu: [{ input: "rankPairwise(['A','B','C'], [['A','B'],['C','A'],['C','B']])", output: "['C','A','B']", explanation: 'C 2 wins, A 1, B 0.|||C thắng 2, A 1, B 0.' }],
  tep: { 'pairwise.js': ["function pairs(n) {\n  return 0;\n}\n\nfunction rankPairwise(items, judgements) {\n  return [];\n}\n", "function pairs(n) {\n  return n > 1 ? n * (n - 1) / 2 : 0;\n}\n\nfunction rankPairwise(items, judgements) {\n  var known = {};\n  items.forEach(function (x) { known['#' + x] = true; });\n  var last = {};\n  judgements.forEach(function (j) {\n    var w = j[0], l = j[1];\n    if (!known['#' + w] || !known['#' + l] || w === l) return;\n    var key = [w, l].sort().join('\\u0000');\n    last[key] = w;\n  });\n  var wins = {};\n  items.forEach(function (x) { wins['#' + x] = 0; });\n  Object.keys(last).forEach(function (k) { wins['#' + last[k]]++; });\n  return items\n    .map(function (x, i) { return { x: x, i: i, w: wins['#' + x] }; })\n    .sort(function (a, b) { return b.w - a.w || a.i - b.i; })\n    .map(function (o) { return o.x; });\n}\n"] },
  kiem: [
    kiemTuy({ en: 'pairs(n)', vi: 'pairs(n)' }, function () {
      if (typeof pairs !== 'function') return 'pairs is not a function';
      var c = [[0, 0], [1, 0], [2, 1], [5, 10], [20, 190], [100, 4950]];
      for (var i = 0; i < c.length; i++) if (pairs(c[i][0]) !== c[i][1]) return 'pairs(' + c[i][0] + ') should be ' + c[i][1];
      return 'OK';
    }),
    kiemTuy({ en: 'ranking by wins', vi: 'xếp theo số thắng' }, function () {
      if (typeof rankPairwise !== 'function') return 'rankPairwise is not a function';
      var r = rankPairwise(['A', 'B', 'C'], [['A', 'B'], ['C', 'A'], ['C', 'B']]);
      return JSON.stringify(r) === '["C","A","B"]' ? 'OK' : 'expected ["C","A","B"], got ' + JSON.stringify(r);
    }),
    kiemTuy({ en: 'ties keep the items order', vi: 'hoà giữ thứ tự items' }, function () {
      if (typeof rankPairwise !== 'function') return 'rankPairwise is not a function';
      var r = rankPairwise(['P', 'Q', 'R', 'S'], [['Q', 'P'], ['S', 'R']]);
      return JSON.stringify(r) === '["Q","S","P","R"]' ? 'OK' : 'expected ["Q","S","P","R"], got ' + JSON.stringify(r);
    }),
    kiemTuy({ en: 'hidden: repeated pairs — the last judgement wins', vi: 'ẩn: cặp lặp — phán xét cuối thắng' }, function () {
      if (typeof rankPairwise !== 'function') return 'rankPairwise is not a function';
      var r = rankPairwise(['A', 'B', 'C'], [['A', 'B'], ['A', 'B'], ['B', 'A'], ['C', 'A']]);
      return JSON.stringify(r) === '["B","C","A"]' ? 'OK' : 'A–B judged 3 times, last says B ⇒ expected ["B","C","A"], got ' + JSON.stringify(r);
    }, { an: true }),
    kiemTuy({ en: 'hidden: unknown items and self-comparisons are ignored', vi: 'ẩn: mục lạ và tự so sánh bị bỏ qua' }, function () {
      if (typeof rankPairwise !== 'function') return 'rankPairwise is not a function';
      var r = rankPairwise(['x', 'y', 'constructor'], [['z', 'x'], ['x', 'x'], ['y', 'x'], ['constructor', 'y'], ['toString', 'y']]);
      return JSON.stringify(r) === '["y","constructor","x"]' ? 'OK' : 'expected ["y","constructor","x"], got ' + JSON.stringify(r);
    }, { an: true }),
  ],
  goiY: ['n(n−1)/2.', 'Dùng khoá cặp đã sắp ("A|B") để phán xét sau ghi đè phán xét trước.'],
  loiHayGap: ['Cộng mọi phán xét lặp lại.', 'Dùng obj[x] với id "constructor" ⇒ sai.'],
  giaiThich: '<p>Pairwise comparison gives a full ranking for a handful of items, but 190 comparisons for 20 items and 4,950 for 100 show why Wiegers calls full rank ordering overkill: requirements are delivered in batches per release, so grouping them is enough.</p>',
  thuatNgu: [{ en: 'pairwise comparison', vi: 'so sánh từng cặp' }, { en: 'rank ordering', vi: 'xếp hạng duy nhất từng mục' }],
  khaiNiem: ['pairwise comparison'],
  boYeu: [{ ten: 'cộng mọi phán xét, không kiểm mục lạ', tep: { 'pairwise.js': "function pairs(n){ return n*(n-1)/2; }\nfunction rankPairwise(items,js){ var w={}; items.forEach(function(x){w[x]=0;}); js.forEach(function(j){ w[j[0]]=(w[j[0]]||0)+1; }); return items.slice().sort(function(a,b){ return w[b]-w[a]; }); }\n" } }],
});

const E4 = phanLoai({
  tieuDe: 'Prioritisation 4 — in or out for release 1',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>The simplest technique: stakeholders go down the list and decide <b>in</b> or <b>out</b> for the first release, constantly referring to the business objectives, paring the list to the bare minimum. Business objective of ClinicCare release 1: "<i>Let patients book and cancel appointments online to cut phone calls to reception by 40% within 6 months.</i>"</p>', vi: '<p>Kỹ thuật đơn giản nhất: quyết <b>vào</b> hay <b>ra</b> cho bản đầu, luôn bám mục tiêu nghiệp vụ, rút tới mức tối thiểu.</p>' },
  cot: 'Release 1', luaChon: ['In', 'Out'],
  hang: [
    ['Patients book an appointment online.', 'In'],
    ['Patients cancel an appointment online.', 'In'],
    ['SMS confirmation of a booking.', 'In'],
    ['Video consultation.', 'Out'],
    ['Loyalty points for regular patients.', 'Out'],
    ['Doctors publish their available slots.', 'In'],
    ['AI symptom checker.', 'Out'],
  ],
  giaiThich: '<p>Only what directly serves "book and cancel online, fewer calls" stays in; everything else is revisited for the next release.</p>',
  goiY: ['Mỗi mục: có trực tiếp phục vụ mục tiêu bản 1 không?', 'Bác sĩ phải công bố lịch thì bệnh nhân mới đặt được.'],
  loiHayGap: ['Giữ tính năng "hay" nhưng không phục vụ mục tiêu.', 'Bỏ chức năng tiên quyết (lịch bác sĩ).'],
  thuatNgu: tn('businessReq', 'scope'),
  khaiNiem: ['in or out'],
});

export default moDun({
  slug: 'swr302-10-3-ch16-why-techniques',
  ten: '10.3 Why prioritise, games and first techniques',
  moTaModule: 'Vì sao và khi nào ưu tiên, sáu vấn đề thực tiễn của Davis, trò chơi decibel/threat và câu hỏi vạch trần, in-or-out theo mục tiêu nghiệp vụ, tự viết so sánh từng cặp (số phép so sánh, xếp hạng theo số thắng) chấm dữ liệu ẩn.',
  de: [E1, E2, E4, E3],
});
