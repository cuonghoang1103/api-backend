/**
 * SWR302 · 9.3 — Agile essentials 1: customer involvement, documentation detail, backlog & prioritization (Wiegers Ch.20 · 8–11).
 */
import { tn, kiemTuy } from './_chung.mjs';
import { phanLoai, tracNghiem, baiJs, moDun } from './_bai.mjs';

const E1 = tracNghiem({
  tieuDe: 'Agile essentials 1 — customer involvement',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Wiegers: on waterfall projects customers invest heavily up front and again at acceptance testing, but little during construction. On agile projects customers — or a <b>product owner</b> representing them — are engaged continuously: they help identify and prioritise stories, clarify details during iterations, and test and give feedback on new features.</p>', vi: '<p>Waterfall: khách đầu tư nhiều lúc đầu và lúc nghiệm thu. Agile: khách hoặc <b>product owner</b> tham gia liên tục.</p>' },
  cau: [
    { en: 'During an iteration a developer has a question about a story. Who answers?', vi: 'Trong vòng, dev có câu hỏi về một story. Ai trả lời?', lc: [['a', 'The product owner / customer representative, right away'], ['b', 'Nobody until the next release'], ['c', 'The developer guesses'], ['d', 'The SRS only']], dap: 'a', giai: ['Stories are less detailed, so the PO must be available.', 'Story ít chi tiết nên PO phải sẵn sàng.'] },
    { en: 'Why must customers stay available on agile projects?', vi: 'Vì sao khách phải luôn sẵn sàng trong agile?', lc: [['a', 'Stories are less detailed than traditional requirements; details come from conversations'], ['b', 'To write code'], ['c', 'To approve every commit'], ['d', 'They need not']], dap: 'a', giai: ['Conversation replaces part of the written detail.', 'Trao đổi thay một phần chi tiết viết.'] },
  ],
  goiY: ['Story ít chi tiết ⇒ cần trao đổi.', 'PO đại diện khách hàng.'],
  loiHayGap: ['Đợi tới bản phát hành mới hỏi khách.', 'Để dev tự đoán.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: tn('userStory', 'backlog'),
  khaiNiem: ['customer involvement'],
});

const E2 = phanLoai({
  tieuDe: 'Agile essentials 2 — needed documentation or waste?',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Agile encourages the <b>minimum documentation needed to accurately guide developers and testers</b>, plus whatever regulations or standards require. Anything beyond that is wasted effort. Decide for a hospital scheduling product built with Scrum.</p>', vi: '<p>Agile khuyến khích <b>tài liệu tối thiểu đủ để dẫn dắt dev và tester</b>, cộng với những gì luật/chuẩn yêu cầu. Thêm nữa là lãng phí.</p>' },
  cot: 'Decision', luaChon: ['Needed', 'Waste'],
  hang: [
    ['Acceptance criteria for each story in the next sprint.', 'Needed'],
    ['A 40-page detailed specification of features planned for next year.', 'Waste'],
    ['The data-retention rules required by the health ministry.', 'Needed'],
    ['Business rules for the cancellation fee, which developers and testers both use.', 'Needed'],
    ['Copying every chat message into a Word document "for the record".', 'Waste'],
    ['Pixel-perfect mock-ups for all screens of epics nobody has prioritised.', 'Waste'],
  ],
  giaiThich: '<p>Write what guides the current work and what regulation demands; detailing far-future work that may change is waste.</p>',
  goiY: ['Có người dùng ngay (dev/tester) hoặc luật bắt ⇒ cần.', 'Chi tiết hoá việc xa chưa ưu tiên ⇒ lãng phí.'],
  loiHayGap: ['Cho rằng agile không viết gì.', 'Viết đặc tả chi tiết cho cả năm sau.'],
  thuatNgu: tn('acceptanceCriteria', 'businessRule'),
  khaiNiem: ['documentation detail'],
});

const BL = [
  { id: 'B1', title: 'Book appointment', points: 5, rank: 1, after: [] },
  { id: 'B2', title: 'Cancel appointment', points: 3, rank: 2, after: ['B1'] },
  { id: 'B3', title: 'SMS reminder', points: 3, rank: 3, after: ['B1'] },
  { id: 'B4', title: 'Doctor schedule view', points: 8, rank: 4, after: [] },
  { id: 'B5', title: 'Online payment', points: 5, rank: 5, after: ['B1'] },
  { id: 'B6', title: 'Fix: wrong time zone', points: 1, rank: 6, after: [] },
];

const E3 = baiJs({
  tieuDe: 'Agile essentials 3 — plan the next iteration from the backlog',
  doKho: 'HARD', phut: 18,
  moTa: { en: '<p>The backlog is a single ordered list (stories and defects together). Write <code>function plan(backlog, capacity, done)</code> that selects items for the next iteration:</p><ul><li>Go through items in order of <code>rank</code> (1 = highest).</li><li>Skip an item if any id in its <code>after</code> list is neither already <code>done</code> (array of ids) nor selected earlier in this plan.</li><li>Skip an item that does not fit in the remaining capacity, but keep going — a smaller lower-ranked item may still fit.</li><li>Skip items whose id is already in <code>done</code>.</li><li>Return the selected ids in the order they were selected.</li></ul>', vi: '<p>Backlog là một danh sách duy nhất (story và lỗi chung). Viết <code>plan(backlog, capacity, done)</code>: đi theo <code>rank</code>; bỏ mục có phụ thuộc chưa xong và chưa được chọn trước; bỏ mục không vừa sức chứa còn lại nhưng vẫn xét tiếp; bỏ mục đã có trong <code>done</code>; trả id theo thứ tự chọn.</p>' },
  yeuCau: [{ en: 'plan(BACKLOG, 13, []) on the sample ⇒ ["B1","B2","B3","B6"].', vi: 'Với dữ liệu mẫu, plan(BACKLOG, 13, []) ⇒ ["B1","B2","B3","B6"].' }],
  viDu: [{ input: 'plan(BACKLOG, 13, [])', output: '["B1","B2","B3","B6"]', explanation: 'B4 (8) and B5 (5) do not fit after 11 points; B6 (1) does.|||Sau 11 điểm, B4 (8) và B5 (5) không vừa; B6 (1) vừa.' }],
  tep: {
    'backlog.js': [`const BACKLOG = ${JSON.stringify(BL, null, 1)};\n`, `const BACKLOG = ${JSON.stringify(BL, null, 1)};\n`],
    'plan.js': ["function plan(backlog, capacity, done) {\n  // TODO\n  return [];\n}\n", "function plan(backlog, capacity, done) {\n  var items = backlog.slice().sort(function (a, b) { return a.rank - b.rank; });\n  var ok = {};\n  (done || []).forEach(function (id) { ok[id] = true; });\n  var left = capacity, out = [];\n  items.forEach(function (it) {\n    var ready = (it.after || []).every(function (d) { return ok[d] === true; });\n    if (ok[it.id] === true || !ready || it.points > left) return;\n    out.push(it.id); ok[it.id] = true; left -= it.points;\n  });\n  return out;\n}\n"],
  },
  kiem: (function () {
    function bo(moTa, args, mong, ex) {
      return kiemTuy(moTa, new Function('var a = ' + JSON.stringify(args) + ', m = ' + JSON.stringify(mong) + ";\nif (typeof plan !== 'function') return 'plan is not a function';\nvar r = plan(a[0], a[1], a[2]);\nreturn JSON.stringify(r) === JSON.stringify(m) ? 'OK' : 'expected ' + JSON.stringify(m) + ', got ' + JSON.stringify(r);"), ex);
    }
    var H = [
      { id: 'X3', title: 'c', points: 2, rank: 3, after: ['X9'] },
      { id: 'X1', title: 'a', points: 4, rank: 1, after: ['X2'] },
      { id: 'X2', title: 'b', points: 3, rank: 2, after: [] },
      { id: 'X4', title: 'd', points: 2, rank: 4, after: ['X2'] },
      { id: 'X5', title: 'e', points: 6, rank: 5, after: [] },
      { id: 'X6', title: 'f', points: 1, rank: 6, after: ['X1'] },
    ];
    return [
      bo({ en: 'sample backlog, capacity 13', vi: 'backlog mẫu, sức chứa 13' }, [BL, 13, []], ['B1', 'B2', 'B3', 'B6']),
      bo({ en: 'dependencies already done', vi: 'phụ thuộc đã xong từ trước' }, [BL, 10, ['B1']], ['B2', 'B3', 'B6']),
      bo({ en: 'items are taken by rank, not by array order', vi: 'chọn theo rank, không theo thứ tự mảng' }, [H, 20, ['X9']], ['X2', 'X3', 'X4', 'X5']),
      bo({ en: 'hidden: a dependency selected later does not count', vi: 'ẩn: phụ thuộc được chọn SAU không tính' }, [H, 9, []], ['X2', 'X4'], { an: true }),
      bo({ en: 'hidden: zero capacity, missing "done"', vi: 'ẩn: sức chứa 0, thiếu "done"' }, [BL, 0], [], { an: true }),
      bo({ en: 'hidden: unknown dependency blocks the item', vi: 'ẩn: phụ thuộc không tồn tại chặn mục' }, [[{ id: 'Q1', points: 1, rank: 1, after: ['toString'] }, { id: 'Q2', points: 1, rank: 2 }], 5, []], ['Q2'], { an: true }),
    ];
  })(),
  goiY: ['Sắp theo rank trước; giữ một tập "đã xong hoặc đã chọn".', 'Mục không vừa thì bỏ qua và xét tiếp (không dừng).'],
  loiHayGap: ['Dừng ngay khi gặp mục không vừa.', 'Dùng obj[d] với d = "toString" ⇒ tưởng đã xong.'],
  giaiThich: '<p>One ordered backlog, dependencies respected, capacity filled greedily: a simple model of how the PO and team pick the next iteration. Priorities only need to hold for the next iteration — they are revisited every time.</p>',
  thuatNgu: tn('backlog'),
  khaiNiem: ['backlog and prioritization'],
  boYeu: [{ ten: 'dừng khi không vừa, bỏ qua phụ thuộc', tep: { 'plan.js': "function plan(b,c,d){ var r=[],l=c; var s=b.slice().sort(function(x,y){return x.rank-y.rank;}); for(var i=0;i<s.length;i++){ if(s[i].points>l) break; r.push(s[i].id); l-=s[i].points; } return r; }\n" } }],
});

export default moDun({
  slug: 'swr302-9-3-ch20-essentials-1',
  ten: '9.3 Agile essentials: customer, documentation and backlog',
  moTaModule: 'Khách hàng/PO tham gia liên tục, tài liệu tối thiểu đủ dùng vs lãng phí, tự viết hàm lập kế hoạch vòng lặp từ backlog (rank, phụ thuộc, sức chứa) chấm dữ liệu ẩn.',
  de: [E1, E2, E3],
});
