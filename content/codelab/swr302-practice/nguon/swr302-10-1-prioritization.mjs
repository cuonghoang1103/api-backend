/**
 * SWR302 · 10.1 — Setting requirement priorities: why, MoSCoW, value ÷ (cost + risk), games people play.
 */
import { tn, kiemTuy } from './_chung.mjs';
import { phanLoai, tracNghiem, baiJs, moDun } from './_bai.mjs';

const E1 = phanLoai({
  tieuDe: 'Priorities 1 — MoSCoW',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>MoSCoW: <b>Must</b> — the release fails without it; <b>Should</b> — important, painful to omit, but there is a workaround; <b>Could</b> — nice to have, first to be cut; <b>Won’t</b> (this time) — explicitly out of scope for now, recorded. Classify the requirements for release 1 of a food-delivery app.</p>', vi: '<p>MoSCoW cho bản 1 của app giao đồ ăn.</p>' },
  cot: 'MoSCoW', luaChon: ['Must', 'Should', 'Could', "Won't"],
  hang: [
    ['Customers can place an order and pay.', 'Must'],
    ['Restaurants receive new orders.', 'Must'],
    ['Customers can re-order a previous order with one tap (they can still order manually).', 'Should'],
    ['Animated confetti when the order is delivered.', 'Could'],
    ['Drone delivery.', "Won't"],
    ['Customers can rate the driver (feedback can still come by e-mail).', 'Should'],
  ],
  giaiThich: '<p>Musts are what makes the release usable at all; Shoulds hurt to omit but have workarounds; Coulds are first to go; Won’t is recorded out of scope.</p>',
  goiY: ['Không có thì bản phát hành vô dụng ⇒ Must.', 'Có cách làm tạm ⇒ Should.'],
  loiHayGap: ['Đánh Must cho mọi thứ.', 'Xoá hẳn mục Won’t thay vì ghi lại.'],
  thuatNgu: tn('moscow'),
  khaiNiem: ['MoSCoW'],
});

const FEAT = [
  { id: 'F1', name: 'Guest checkout', value: 9, cost: 3, risk: 2 },
  { id: 'F2', name: 'Coupon codes', value: 6, cost: 4, risk: 2 },
  { id: 'F3', name: 'Crypto payment', value: 4, cost: 8, risk: 9 },
  { id: 'F4', name: 'Dark mode', value: 3, cost: 2, risk: 1 },
];

const E2 = baiJs({
  tieuDe: 'Priorities 2 — rank by value ÷ (cost + risk)',
  doKho: 'MEDIUM', phut: 12,
  moTa: { en: '<p>Lesson 10.1 scores each feature 1–9 on <b>value</b> (higher is better), <b>cost</b> and <b>risk</b> (higher is worse), and computes <code>priority = value / (cost + risk)</code>. Write <code>function rank(features)</code> returning a new array of <code>{ id, priority }</code> sorted by priority (highest first), priority rounded to 2 decimals. Ties keep the input order. Features with any score outside 1–9 are left out. Do not modify the input.</p>', vi: '<p>Chấm mỗi tính năng 1–9 theo value, cost, risk; <code>priority = value / (cost + risk)</code>. Viết <code>rank(features)</code> trả mảng mới <code>{ id, priority }</code> giảm dần, làm tròn 2 chữ số; hoà giữ thứ tự đầu vào; bỏ tính năng có điểm ngoài 1–9; không sửa đầu vào.</p>' },
  yeuCau: [{ en: 'rank(FEATURES) ⇒ F1 1.8, F2 1, F4 1, F3 0.24.', vi: 'rank(FEATURES) ⇒ F1 1.8, F2 1, F4 1, F3 0.24.' }],
  viDu: [{ input: 'Guest checkout V9 C3 R2', output: '9 / 5 = 1.8', explanation: 'Do it first.|||Làm trước.' }],
  tep: {
    'features.js': [`const FEATURES = ${JSON.stringify(FEAT, null, 1)};\n`, `const FEATURES = ${JSON.stringify(FEAT, null, 1)};\n`],
    'rank.js': ["function rank(features) {\n  // TODO\n  return [];\n}\n", "function rank(features) {\n  function ok(n) { return typeof n === 'number' && n >= 1 && n <= 9; }\n  return features\n    .filter(function (f) { return ok(f.value) && ok(f.cost) && ok(f.risk); })\n    .map(function (f, i) { return { id: f.id, priority: Math.round(f.value / (f.cost + f.risk) * 100) / 100, i: i }; })\n    .sort(function (a, b) { return b.priority - a.priority || a.i - b.i; })\n    .map(function (x) { return { id: x.id, priority: x.priority }; });\n}\n"],
  },
  kiem: (function () {
    function bo(moTa, data, mong, ex) {
      return kiemTuy(moTa, new Function('var d = ' + JSON.stringify(data) + ', m = ' + JSON.stringify(mong) + ";\nif (typeof rank !== 'function') return 'rank is not a function';\nvar truoc = JSON.stringify(d); var r = rank(d); if (JSON.stringify(d) !== truoc) return 'do not modify the input array';\nreturn JSON.stringify(r) === JSON.stringify(m) ? 'OK' : 'expected ' + JSON.stringify(m) + ', got ' + JSON.stringify(r);"), ex);
    }
    return [
      bo({ en: 'sample features', vi: 'tính năng mẫu' }, FEAT, [{ id: 'F1', priority: 1.8 }, { id: 'F2', priority: 1 }, { id: 'F4', priority: 1 }, { id: 'F3', priority: 0.24 }]),
      bo({ en: 'rounding to 2 decimals', vi: 'làm tròn 2 chữ số' }, [{ id: 'A', value: 2, cost: 2, risk: 1 }, { id: 'B', value: 5, cost: 3, risk: 3 }], [{ id: 'B', priority: 0.83 }, { id: 'A', priority: 0.67 }]),
      bo({ en: 'hidden: invalid scores are left out', vi: 'ẩn: điểm ngoài 1–9 bị loại' }, [{ id: 'X', value: 10, cost: 1, risk: 1 }, { id: 'Y', value: 4, cost: 0, risk: 2 }, { id: 'Z', value: 4, cost: 2, risk: 2 }], [{ id: 'Z', priority: 1 }], { an: true }),
      bo({ en: 'hidden: ties keep input order', vi: 'ẩn: hoà giữ thứ tự đầu vào' }, [{ id: 'P', value: 2, cost: 1, risk: 1 }, { id: 'Q', value: 9, cost: 9, risk: 9 }, { id: 'R', value: 4, cost: 1, risk: 3 }], [{ id: 'P', priority: 1 }, { id: 'R', priority: 1 }, { id: 'Q', priority: 0.5 }], { an: true }),
    ];
  })(),
  goiY: ['Lọc trước, rồi tính, rồi sắp; giữ chỉ số gốc để phá hoà.', 'Math.round(x * 100) / 100.'],
  loiHayGap: ['Dùng features.sort trực tiếp (sửa đầu vào).', 'Không loại điểm 0 hay 10.'],
  giaiThich: '<p>The formula surfaces quick wins (high value, low cost and risk). It turns a political argument into a defensible ranking — but the numbers are relative estimates; the conversation they provoke matters as much as the result.</p>',
  thuatNgu: tn('valueCostRisk'),
  khaiNiem: ['value, cost and risk'],
  boYeu: [{ ten: 'sắp tại chỗ, không lọc', tep: { 'rank.js': "function rank(f){ return f.sort(function(a,b){ return b.value/(b.cost+b.risk)-a.value/(a.cost+a.risk); }).map(function(x){ return {id:x.id,priority:Math.round(x.value/(x.cost+x.risk)*100)/100}; }); }\n" } }],
});

const E3 = tracNghiem({
  tieuDe: 'Priorities 3 — why prioritise, and the games',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Prioritisation delivers the most value earliest, manages scope against fixed deadlines and attacks high-risk items early. A common game: every stakeholder marks their request "Must". Counter it: cap the Musts (e.g. ≤ 60% of the effort), require each Must to trace to a business objective, and make trade-offs visible ("if this is a Must, which Must drops?").</p>', vi: '<p>Ưu tiên giúp giao giá trị sớm, quản lý phạm vi theo hạn cố định, xử lý rủi ro sớm. Trò thường gặp: ai cũng đánh "Must". Cách chống: giới hạn Must, Must phải truy về mục tiêu nghiệp vụ, đánh đổi minh bạch.</p>' },
  cau: [
    { en: '85% of the requirements are Must. What do you do?', vi: '85% yêu cầu là Must. Làm gì?', lc: [['a', 'Cap the Musts and ask which Must drops for each new Must; trace Musts to objectives'], ['b', 'Accept and work overtime'], ['c', 'Remove all Coulds and be done'], ['d', 'Let the developers decide alone']], dap: 'a', giai: ['Make trade-offs explicit.', 'Làm đánh đổi minh bạch.'] },
    { en: 'Why attack high-risk items early?', vi: 'Vì sao xử lý mục rủi ro cao sớm?', lc: [['a', 'So there is still time to react if they fail'], ['b', 'Because they are easy'], ['c', 'To impress the customer'], ['d', 'It does not matter']], dap: 'a', giai: ['Late failures leave no room.', 'Thất bại muộn không còn đường lùi.'] },
    { en: 'Who should decide priorities?', vi: 'Ai quyết định ưu tiên?', lc: [['a', 'Customer representatives together with the team, which estimates cost and risk'], ['b', 'Only developers'], ['c', 'Whoever shouts loudest'], ['d', 'The most senior manager alone']], dap: 'a', giai: ['Value from customers, cost and risk from the team.', 'Giá trị từ khách, chi phí và rủi ro từ đội.'] },
  ],
  goiY: ['Must phải truy về mục tiêu nghiệp vụ.', 'Khách cho giá trị; đội cho chi phí và rủi ro.'],
  loiHayGap: ['Để người nói to nhất quyết.', 'Chấp nhận mọi thứ là Must.'],
  giaiThich: '<p>Answers: a · a · a.</p>',
  thuatNgu: tn('moscow', 'valueCostRisk'),
  khaiNiem: ['why prioritise'],
});

export default moDun({
  slug: 'swr302-10-1-prioritization',
  ten: '10.1 Setting priorities: MoSCoW and value ÷ (cost + risk)',
  moTaModule: 'MoSCoW cho app giao đồ ăn, tự viết hàm xếp hạng value ÷ (cost + risk) (lọc điểm sai, hoà, không sửa đầu vào) chấm dữ liệu ẩn, vì sao ưu tiên và cách chống "mọi thứ đều Must".',
  de: [E1, E3, E2],
});
