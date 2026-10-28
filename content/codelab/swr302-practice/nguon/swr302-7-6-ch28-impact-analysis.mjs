/**
 * SWR302 · 7.4 — Change impact analysis (Wiegers Ch.28: checklists, finding affected items, estimating effort).
 */
import { tn, kiemTuy } from './_chung.mjs';
import { tracNghiem, phanLoai, baiJs, moDun } from './_bai.mjs';

const E1 = tracNghiem({
  tieuDe: 'Impact 1 — the questions to ask',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p>Wiegers gives a checklist of questions for impact analysis: Does the change conflict with existing requirements? Does it affect performance or other quality requirements? Is it technically feasible? Does it need more resources (people, hardware, licences)? Which other requirements, designs, code, tests, help screens, documents and user training are affected? What is the effect on schedule and cost? What happens if we do NOT make it?</p>', vi: '<p>Checklist câu hỏi phân tích ảnh hưởng của Wiegers.</p>' },
  cau: [
    { en: 'Which question is part of an impact analysis?', vi: 'Câu nào thuộc phân tích ảnh hưởng?', lc: [['a', 'Which tests and help screens must be updated?'], ['b', 'Who wrote the original code?'], ['c', 'What colour is the logo?'], ['d', 'How many lines does the SRS have?']], dap: 'a', giai: ['Find all affected work products.', 'Tìm mọi sản phẩm bị ảnh hưởng.'] },
    { en: 'Why ask "what happens if we don’t make the change?"', vi: 'Vì sao hỏi "nếu KHÔNG thay đổi thì sao?"', lc: [['a', 'To weigh the cost of the change against the cost of not changing'], ['b', 'To delay the CCB'], ['c', 'It is not a useful question'], ['d', 'To find the author']], dap: 'a', giai: ['Both options have consequences.', 'Cả hai lựa chọn đều có hệ quả.'] },
    { en: 'The impact analysis is used mainly by…', vi: 'Kết quả phân tích ảnh hưởng chủ yếu dùng cho…', lc: [['a', 'the CCB, to make an informed decision'], ['b', 'marketing only'], ['c', 'the end users'], ['d', 'nobody']], dap: 'a', giai: ['It is input to the decision.', 'Nó là đầu vào cho quyết định.'] },
  ],
  goiY: ['Liệt kê MỌI sản phẩm bị ảnh hưởng, không chỉ code.', 'Cân nhắc cả phương án không làm.'],
  loiHayGap: ['Chỉ tính công sửa code.', 'Quên tài liệu và đào tạo người dùng.'],
  giaiThich: '<p>Answers: a · a · a.</p>',
  thuatNgu: tn('impactAnalysis', 'ccb'),
  khaiNiem: ['impact analysis checklist'],
});

const E2 = phanLoai({
  tieuDe: 'Impact 2 — affected or not?',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Change request CR-14 (PetCare): "Allow cancelling up to <b>4 hours</b> before the appointment instead of 2." For each work product, decide whether it is affected.</p>', vi: '<p>CR-14 (PetCare): "Cho huỷ tới trước <b>4 giờ</b> thay vì 2 giờ." Với mỗi sản phẩm, xác định có bị ảnh hưởng không.</p>' },
  cot: 'Affected?', luaChon: ['Affected', 'Not affected'],
  hang: [
    ['Business rule BR-07 "Cancellation deadline"', 'Affected'],
    ['UC-05 Cancel Appointment — exception flow "too late"', 'Affected'],
    ['Acceptance tests for cancellation at 1 h, 2 h and 3 h before', 'Affected'],
    ['Error message E-12 "…only up to 2 hours before"', 'Affected'],
    ['Help page "How to cancel"', 'Affected'],
    ['UC-02 Register Pet', 'Not affected'],
    ['Monthly revenue report layout', 'Not affected'],
    ['Reminder SMS sent 24 hours before (it mentions the cancellation deadline)', 'Affected'],
  ],
  giaiThich: '<p>Follow the trace links from BR-07: the use case, tests, messages, help and notifications that mention the deadline. Unrelated use cases and reports are not affected.</p>',
  goiY: ['Mọi chỗ nhắc tới "2 giờ" đều phải xem lại.', 'Đi theo liên kết truy vết từ luật nghiệp vụ.'],
  loiHayGap: ['Bỏ sót thông báo lỗi và trang trợ giúp.', 'Đánh dấu mọi thứ là bị ảnh hưởng.'],
  thuatNgu: tn('impactAnalysis', 'businessRule'),
  khaiNiem: ['finding affected work products'],
});

const LINKS = [
  ['BR-07', 'FR-21'], ['BR-07', 'FR-22'], ['FR-21', 'UC-05'], ['FR-22', 'MSG-E12'],
  ['FR-21', 'TC-31'], ['FR-21', 'TC-32'], ['FR-22', 'TC-33'], ['UC-05', 'HELP-04'],
  ['FR-30', 'TC-40'], ['UC-02', 'TC-10'],
];

const E3 = baiJs({
  tieuDe: 'Impact 3 — find everything a change touches',
  doKho: 'HARD', phut: 18,
  moTa: { en: '<p>Trace links are stored as pairs <code>[from, to]</code> meaning "<i>to</i> depends on <i>from</i>" (a change to <i>from</i> may require a change to <i>to</i>). Write <code>function impacted(links, changed)</code> returning the sorted list of every item reachable from <code>changed</code> (an id or an array of ids) by following links, <b>not</b> including the changed items themselves. Handle cycles. Then write <code>function effort(items, hours)</code> that sums <code>hours[prefix]</code> for each item, where the prefix is the text before the first "-" (e.g. "TC-31" ⇒ "TC"); unknown prefixes count 1 hour.</p>', vi: '<p>Liên kết lưu dạng cặp <code>[from, to]</code>: "to phụ thuộc from". Viết <code>impacted(links, changed)</code> trả danh sách đã sắp xếp mọi mục tới được từ <code>changed</code> (một id hoặc mảng id) theo liên kết, KHÔNG gồm chính các mục bị đổi; xử lý chu trình. Rồi viết <code>effort(items, hours)</code> cộng <code>hours[tiền tố]</code> cho từng mục (tiền tố là phần trước dấu "-" đầu tiên); tiền tố lạ tính 1 giờ.</p>' },
  yeuCau: [{ en: 'impacted(LINKS, "BR-07") on the sample gives FR-21, FR-22, HELP-04, MSG-E12, TC-31, TC-32, TC-33, UC-05.', vi: 'Với dữ liệu mẫu, impacted(LINKS, "BR-07") cho 8 mục như trên.' }],
  viDu: [{ input: 'effort(["TC-31","UC-05","X-1"], { TC: 2, UC: 3 })', output: '6', explanation: '2 + 3 + 1|||2 + 3 + 1' }],
  tep: {
    'links.js': [`const LINKS = ${JSON.stringify(LINKS)};\n`, `const LINKS = ${JSON.stringify(LINKS)};\n`],
    'impact.js': ["function impacted(links, changed) {\n  // TODO\n  return [];\n}\n\nfunction effort(items, hours) {\n  // TODO\n  return 0;\n}\n", "function impacted(links, changed) {\n  var start = Array.isArray(changed) ? changed : [changed];\n  var next = Object.create(null);\n  links.forEach(function (l) { (next[l[0]] = next[l[0]] || []).push(l[1]); });\n  var seen = Object.create(null), queue = start.slice();\n  start.forEach(function (s) { seen[s] = true; });\n  var out = [];\n  while (queue.length) {\n    var cur = queue.shift();\n    (next[cur] || []).forEach(function (n) {\n      if (seen[n]) return;\n      seen[n] = true; out.push(n); queue.push(n);\n    });\n  }\n  return out.sort();\n}\n\nfunction effort(items, hours) {\n  return items.reduce(function (s, id) {\n    var p = String(id).split('-')[0];\n    return s + (Object.prototype.hasOwnProperty.call(hours, p) ? hours[p] : 1);\n  }, 0);\n}\n"],
  },
  kiem: [
    kiemTuy({ en: 'sample: everything affected by BR-07', vi: 'mẫu: mọi thứ bị ảnh hưởng bởi BR-07' }, function () {
      if (typeof impacted !== 'function') return 'impacted is not a function';
      var r = impacted(LINKS, 'BR-07');
      var m = ['FR-21', 'FR-22', 'HELP-04', 'MSG-E12', 'TC-31', 'TC-32', 'TC-33', 'UC-05'];
      return JSON.stringify(r) === JSON.stringify(m) ? 'OK' : 'expected ' + JSON.stringify(m) + ', got ' + JSON.stringify(r);
    }),
    kiemTuy({ en: 'an array of changed items, excluding themselves', vi: 'mảng các mục bị đổi, không gồm chính chúng' }, function () {
      if (typeof impacted !== 'function') return 'impacted is not a function';
      var r = impacted(LINKS, ['FR-22', 'UC-02']);
      var m = ['MSG-E12', 'TC-10', 'TC-33'];
      return JSON.stringify(r) === JSON.stringify(m) ? 'OK' : 'expected ' + JSON.stringify(m) + ', got ' + JSON.stringify(r);
    }),
    kiemTuy({ en: 'effort() sums by prefix', vi: 'effort() cộng theo tiền tố' }, function () {
      if (typeof effort !== 'function') return 'effort is not a function';
      var r = effort(['TC-31', 'UC-05', 'X-1'], { TC: 2, UC: 3 });
      if (r !== 6) return 'expected 6, got ' + r;
      return effort([], { TC: 2 }) === 0 ? 'OK' : 'no items ⇒ 0';
    }),
    kiemTuy({ en: 'hidden: cycles and shared descendants', vi: 'ẩn: chu trình và nút con chung' }, function () {
      if (typeof impacted !== 'function') return 'impacted is not a function';
      var L = [['A-1', 'B-1'], ['B-1', 'C-1'], ['C-1', 'A-1'], ['B-1', 'D-1'], ['A-1', 'D-1'], ['E-1', 'F-1']];
      var r = impacted(L, 'A-1');
      return JSON.stringify(r) === JSON.stringify(['B-1', 'C-1', 'D-1']) ? 'OK' : 'cycle A→B→C→A: expected ["B-1","C-1","D-1"], got ' + JSON.stringify(r);
    }, { an: true }),
    kiemTuy({ en: 'hidden: unknown ids and tricky names', vi: 'ẩn: id lạ và tên đánh lừa' }, function () {
      if (typeof impacted !== 'function' || typeof effort !== 'function') return 'functions missing';
      if (JSON.stringify(impacted(LINKS, 'ZZ-9')) !== '[]') return 'an id with no links ⇒ []';
      if (JSON.stringify(impacted([['toString', 'Q-1']], 'constructor')) !== '[]') return '"constructor" has no links ⇒ []';
      var e = effort(['constructor-1', 'TC-1'], { TC: 2 });
      return e === 3 ? 'OK' : 'unknown prefix "constructor" counts 1 hour ⇒ 3, got ' + e;
    }, { an: true }),
  ],
  goiY: ['Duyệt BFS/DFS với tập "đã thăm" để không lặp vô hạn.', 'Dùng Object.create(null) hoặc hasOwnProperty cho bảng tra (id "toString", "constructor").'],
  loiHayGap: ['Chỉ lấy con trực tiếp, bỏ cháu.', 'Đưa chính mục bị đổi vào kết quả.'],
  giaiThich: '<p>Impact analysis on a trace graph is a reachability search. The effort estimate per affected item type (Wiegers’ impact-analysis worksheet does this task by task) turns the list into hours for the CCB.</p>',
  thuatNgu: tn('impactAnalysis', 'rtm'),
  khaiNiem: ['impact analysis'],
  boYeu: [{ ten: 'chỉ con trực tiếp', tep: { 'impact.js': "function impacted(links, c){ var s=Array.isArray(c)?c:[c]; var o=[]; links.forEach(function(l){ if(s.indexOf(l[0])>=0&&o.indexOf(l[1])<0) o.push(l[1]); }); return o.sort(); }\nfunction effort(items,h){ return items.reduce(function(s,i){ return s+(h[i.split('-')[0]]||1); },0); }\n" } }],
});

const E4 = tracNghiem({
  tieuDe: 'Impact 4 — measuring change activity',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>Measuring change activity helps judge requirements stability: count change requests by status, by origin and over time; track how many changes affect baselined requirements; and watch the trend — many late changes signal unstable or poorly elicited requirements. Tools track requests, but the policy and the CCB make the decisions.</p>', vi: '<p>Đo hoạt động thay đổi để đánh giá độ ổn định của yêu cầu.</p>' },
  cau: [
    { en: 'The number of change requests on baselined requirements keeps rising near the release. This suggests…', vi: 'Số yêu cầu thay đổi trên yêu cầu đã baseline tăng dần gần ngày phát hành. Điều này gợi ý…', lc: [['a', 'unstable requirements — elicitation or validation was not thorough enough'], ['b', 'the team is very productive'], ['c', 'nothing'], ['d', 'the tool is broken']], dap: 'a', giai: ['Late churn is a warning sign.', 'Thay đổi muộn là dấu hiệu cảnh báo.'] },
    { en: 'A change-tracking tool…', vi: 'Công cụ theo dõi thay đổi…', lc: [['a', 'records and routes requests; people still decide through the CCB and the policy'], ['b', 'decides which changes to accept'], ['c', 'replaces impact analysis'], ['d', 'is not useful']], dap: 'a', giai: ['Tools support, people decide.', 'Công cụ hỗ trợ, con người quyết.'] },
  ],
  goiY: ['Thay đổi muộn tăng ⇒ yêu cầu chưa ổn định.', 'Công cụ không quyết định.'],
  loiHayGap: ['Coi nhiều thay đổi là năng suất cao.', 'Để công cụ tự quyết.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: tn('ccb', 'baseline'),
  khaiNiem: ['measuring change activity'],
});

export default moDun({
  slug: 'swr302-7-6-ch28-impact-analysis',
  ten: '7.6 Change impact analysis',
  moTaModule: 'Checklist câu hỏi phân tích ảnh hưởng, xác định sản phẩm bị ảnh hưởng bởi CR-14 (PetCare), tự viết hàm tìm mọi mục bị ảnh hưởng trên đồ thị truy vết (có chu trình) và ước lượng công.',
  de: [E1, E2, E3, E4],
});
