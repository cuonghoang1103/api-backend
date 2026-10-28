/**
 * SWR302 · 10.4 — Three-level scale (importance × urgency), multipass, MoSCoW critique, $100, value/cost/risk (Wiegers Ch.16 · 10–15).
 */
import { tn, kiemTuy } from './_chung.mjs';
import { phanLoai, tracNghiem, baiJs, moDun } from './_bai.mjs';

const E1 = phanLoai({
  tieuDe: 'Scales 1 — importance × urgency',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Wiegers Figure 16-1: <b>High</b> = important and urgent; <b>Medium</b> = important but not urgent; <b>Low</b> = neither important nor urgent; and the fourth quadrant — urgent to some stakeholder but <b>not important</b> to the business objectives — <b>don’t do it</b>. Classify the requirements for the next ClinicCare release.</p>', vi: '<p>Hình 16-1: High = quan trọng + gấp; Medium = quan trọng, không gấp; Low = không quan trọng, không gấp; ô thứ tư — gấp với ai đó nhưng không quan trọng với mục tiêu — đừng làm.</p>' },
  cot: 'Priority', luaChon: ['High', 'Medium', 'Low', "Don't do"],
  hang: [
    ['Online booking — the core objective, needed in the next release.', 'High'],
    ['Multi-language UI — important for the 2027 expansion, not needed now.', 'Medium'],
    ['Seasonal greeting banners — neither important nor needed soon.', 'Low'],
    ['A manager wants a custom export for tomorrow’s meeting; it serves no business objective.', "Don't do"],
    ['Fix: double bookings for the same slot — breaks the core objective, must ship now.', 'High'],
  ],
  giaiThich: '<p>Two dimensions: importance to the business objectives and urgency for the next release. Urgent-but-unimportant requests are the trap.</p>',
  goiY: ['Hỏi hai câu: có quan trọng với mục tiêu? có cần ngay bản tới?', 'Gấp mà không quan trọng ⇒ đừng làm.'],
  loiHayGap: ['Đánh High cho mọi việc gấp.', 'Quên ô thứ tư.'],
  thuatNgu: [{ en: 'three-level scale', vi: 'thang ba mức (cao/vừa/thấp)' }],
  khaiNiem: ['three-level scale'],
});

const E2 = tracNghiem({
  tieuDe: 'Scales 2 — multipass, MoSCoW and $100',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Multipass (Figure 16-2): if too many requirements are High, partition the Highs again into high / higher / highest; the "highest" become the new top, the rest fold into Medium. MoSCoW turns three levels into four but gives no rationale for rating and is ambiguous about timing ("Won’t" — this release or ever?) — the book prefers the importance × urgency scale. $100: each participant spends 100 imaginary dollars; it makes people think about limited resources but is easy to game and ignores implementation cost.</p>', vi: '<p>Nhiều lượt, MoSCoW và $100 theo Wiegers.</p>' },
  cau: [
    { en: '70 of 90 requirements are High. Wiegers suggests…', vi: '70/90 yêu cầu là High. Wiegers gợi ý…', lc: [['a', 'Partition the Highs again (high/higher/highest); only "highest" stays top'], ['b', 'Accept it'], ['c', 'Make all of them Medium'], ['d', 'Delete 70 requirements']], dap: 'a', giai: ['Figure 16-2.', 'Hình 16-2.'] },
    { en: 'The book’s main criticism of MoSCoW is that…', vi: 'Phê phán chính của sách về MoSCoW là…', lc: [['a', 'it gives no rationale for rating and "Won’t" is ambiguous about timing'], ['b', 'it has too few levels'], ['c', 'it is too mathematical'], ['d', 'it is only for waterfall']], dap: 'a', giai: ['Prefer importance × urgency.', 'Ưu tiên thang quan trọng × gấp.'] },
    { en: 'In a $100 exercise one stakeholder puts all $100 on his pet feature. This shows…', vi: 'Trong bài $100, một người dồn cả $100 cho tính năng yêu thích. Điều này cho thấy…', lc: [['a', 'the technique can be gamed'], ['b', 'the feature is the only one needed'], ['c', 'the technique is perfect'], ['d', 'costs were included']], dap: 'a', giai: ['Davis: easy to game, ignores cost.', 'Davis: dễ bị lách, bỏ qua chi phí.'] },
    { en: 'Where should each requirement’s priority be stored?', vi: 'Lưu ưu tiên của mỗi yêu cầu ở đâu?', lc: [['a', 'As an attribute of the requirement (SRS, database), with a convention about inheritance from parent requirements'], ['b', 'In the developer’s memory'], ['c', 'Only in the meeting minutes'], ['d', 'Nowhere']], dap: 'a', giai: ['Priority is a requirement attribute.', 'Ưu tiên là một thuộc tính của yêu cầu.'] },
  ],
  goiY: ['Quá nhiều High ⇒ chia lại các High.', '$100 dễ bị lách, không tính chi phí.'],
  loiHayGap: ['Cho rằng sách khuyên dùng MoSCoW.', 'Tin kết quả $100 tuyệt đối.'],
  giaiThich: '<p>Answers: a · a · a · a.</p>',
  thuatNgu: tn('moscow'),
  khaiNiem: ['multipass prioritisation', 'MoSCoW', '$100'],
});

const E3 = baiJs({
  tieuDe: 'Scales 3 — run a $100 vote and spot gaming',
  doKho: 'HARD', phut: 15,
  moTa: { en: '<p>Each participant spends exactly $100 across the features. Write <code>function hundredDollar(ballots)</code> where <code>ballots</code> is an array of <code>{ voter, alloc: { featureId: dollars } }</code>. Return <code>{ totals, ranking, invalid, gamed }</code>:</p><ul><li><code>invalid</code>: voters whose allocation does not sum to exactly 100, or contains a negative or non-integer amount — their ballots are <b>not</b> counted.</li><li><code>totals</code>: dollars per feature from valid ballots.</li><li><code>ranking</code>: feature ids by total (highest first); ties alphabetical.</li><li><code>gamed</code>: valid voters who put more than $60 on a single feature (a warning, they are still counted).</li></ul><p><code>invalid</code> and <code>gamed</code> keep the ballot order.</p>', vi: '<p>Mỗi người chi đúng $100. Viết <code>hundredDollar(ballots)</code> trả <code>{ totals, ranking, invalid, gamed }</code>: phiếu không đủ đúng 100, có số âm hoặc không nguyên ⇒ invalid và không tính; totals theo tính năng; ranking giảm dần, hoà theo bảng chữ cái; gamed = người dồn hơn $60 vào một tính năng (vẫn được tính).</p>' },
  yeuCau: [{ en: 'Davis: the $100 method is easy to game — flag it, do not silently trust it.', vi: 'Davis: $100 dễ bị lách — cần cảnh báo, đừng tin mù quáng.' }],
  viDu: [{ input: "[{voter:'An', alloc:{A:50,B:50}}, {voter:'Binh', alloc:{A:100}}]", output: "totals {A:150,B:50}, ranking [A,B], invalid [], gamed ['Binh']", explanation: '|||' }],
  tep: { 'vote.js': ["function hundredDollar(ballots) {\n  // TODO\n  return { totals: {}, ranking: [], invalid: [], gamed: [] };\n}\n", "function hundredDollar(ballots) {\n  var totals = {}, invalid = [], gamed = [];\n  ballots.forEach(function (b) {\n    var vals = Object.keys(b.alloc || {}).map(function (k) { return b.alloc[k]; });\n    var bad = vals.some(function (v) { return typeof v !== 'number' || v < 0 || Math.floor(v) !== v; });\n    var sum = vals.reduce(function (s, v) { return s + (typeof v === 'number' ? v : 0); }, 0);\n    if (bad || sum !== 100) { invalid.push(b.voter); return; }\n    Object.keys(b.alloc).forEach(function (k) { totals[k] = (totals[k] || 0) + b.alloc[k]; });\n    if (vals.some(function (v) { return v > 60; })) gamed.push(b.voter);\n  });\n  var ranking = Object.keys(totals).sort(function (a, b) { return totals[b] - totals[a] || (a < b ? -1 : a > b ? 1 : 0); });\n  return { totals: totals, ranking: ranking, invalid: invalid, gamed: gamed };\n}\n"] },
  kiem: (function () {
    function bo(moTa, data, fnKiem, ex) {
      return kiemTuy(moTa, new Function('var d = ' + JSON.stringify(data) + ";\nif (typeof hundredDollar !== 'function') return 'hundredDollar is not a function';\nvar r = hundredDollar(d); if (!r) return 'return { totals, ranking, invalid, gamed }';\n" + fnKiem), ex);
    }
    var D1 = [{ voter: 'An', alloc: { A: 50, B: 50 } }, { voter: 'Binh', alloc: { A: 100 } }];
    var D2 = [
      { voter: 'Chi', alloc: { Booking: 40, Reminder: 30, Payment: 30 } },
      { voter: 'Dung', alloc: { Booking: 30, Payment: 40, Reports: 30 } },
      { voter: 'Em', alloc: { Booking: 50, Reports: 60 } },
      { voter: 'Giang', alloc: { Reports: 61, Reminder: 39 } },
      { voter: 'Hai', alloc: { Booking: 120, Payment: -20 } },
      { voter: 'Khoa', alloc: { Booking: 33.5, Payment: 66.5 } },
    ];
    return [
      bo({ en: 'totals and ranking', vi: 'tổng và xếp hạng' }, D1, "return JSON.stringify(r.totals) === '{\"A\":150,\"B\":50}' && JSON.stringify(r.ranking) === '[\"A\",\"B\"]' ? 'OK' : 'expected totals {A:150,B:50}, ranking [A,B]; got ' + JSON.stringify(r.totals) + ' ' + JSON.stringify(r.ranking);"),
      bo({ en: 'flags gaming (> $60 on one feature)', vi: 'cảnh báo dồn phiếu (> $60 một tính năng)' }, D1, "return JSON.stringify(r.gamed) === '[\"Binh\"]' && JSON.stringify(r.invalid) === '[]' ? 'OK' : 'expected gamed [Binh], invalid []; got ' + JSON.stringify(r.gamed) + ' / ' + JSON.stringify(r.invalid);"),
      bo({ en: 'hidden: invalid ballots are not counted', vi: 'ẩn: phiếu không hợp lệ không được tính' }, D2, "if (JSON.stringify(r.invalid) !== '[\"Em\",\"Hai\",\"Khoa\"]') return 'invalid should be [Em, Hai, Khoa] (sum 110, negative, non-integer); got ' + JSON.stringify(r.invalid); return r.totals.Booking === 70 && r.totals.Payment === 70 && r.totals.Reports === 91 && r.totals.Reminder === 69 ? 'OK' : 'totals wrong: ' + JSON.stringify(r.totals);", { an: true }),
      bo({ en: 'hidden: ties alphabetical, gamed only among valid', vi: 'ẩn: hoà theo chữ cái, gamed chỉ trong phiếu hợp lệ' }, D2, "if (JSON.stringify(r.ranking) !== '[\"Reports\",\"Booking\",\"Payment\",\"Reminder\"]') return 'ranking should be [Reports, Booking, Payment, Reminder]; got ' + JSON.stringify(r.ranking); return JSON.stringify(r.gamed) === '[\"Giang\"]' ? 'OK' : 'gamed should be [Giang]; got ' + JSON.stringify(r.gamed);", { an: true }),
    ];
  })(),
  goiY: ['Kiểm phiếu trước (tổng đúng 100, số nguyên không âm), rồi mới cộng.', 'Hoà: so sánh chuỗi id.'],
  loiHayGap: ['Cộng cả phiếu sai vào tổng.', 'Coi người dồn phiếu là không hợp lệ (chỉ cảnh báo).'],
  giaiThich: '<p>The $100 method gets people thinking about scarce resources, but its results need guarding: validate ballots and flag concentration. It still ignores implementation cost — combine it with cost and risk before deciding.</p>',
  thuatNgu: [{ en: '$100 (cumulative voting)', vi: 'bỏ phiếu tích luỹ $100' }],
  khaiNiem: ['$100 technique'],
  boYeu: [{ ten: 'không kiểm phiếu', tep: { 'vote.js': "function hundredDollar(bs){ var t={},g=[]; bs.forEach(function(b){ Object.keys(b.alloc).forEach(function(k){ t[k]=(t[k]||0)+b.alloc[k]; if(b.alloc[k]>60&&g.indexOf(b.voter)<0) g.push(b.voter); }); }); return {totals:t,ranking:Object.keys(t).sort(function(a,b){return t[b]-t[a];}),invalid:[],gamed:g}; }\n" } }],
});

export default moDun({
  slug: 'swr302-10-4-ch16-scales-matrix',
  ten: '10.4 Three-level scale, MoSCoW, $100 and value/cost/risk',
  moTaModule: 'Thang quan trọng × gấp (Hình 16-1, ô "đừng làm"), ưu tiên nhiều lượt (Hình 16-2), phê phán MoSCoW, tự viết bộ đếm phiếu $100 có kiểm phiếu và cảnh báo dồn phiếu chấm dữ liệu ẩn.',
  de: [E1, E2, E3],
});
