/**
 * SWR302 · DEEP LAB 10 — Prioritisation engine: Wiegers Table 16-1 as code, release packing, weight sensitivity.
 * priorityTable(features, weights) · planRelease(features, weights, capacity, musts) · sensitivity(features, weights, field, values)
 */
import { tn } from './_chung.mjs';
import { deLon } from './_lab.mjs';
import { kiemCa, preJson } from './_deep.mjs';

const FEATURES = [
  { id: 'F1', name: 'Online booking', benefit: 9, penalty: 9, cost: 6, risk: 4 },
  { id: 'F2', name: 'SMS reminders', benefit: 6, penalty: 5, cost: 2, risk: 1 },
  { id: 'F3', name: 'Video consultation', benefit: 7, penalty: 3, cost: 9, risk: 8 },
  { id: 'F4', name: 'Online payment', benefit: 7, penalty: 6, cost: 5, risk: 6 },
  { id: 'F5', name: 'Lab results portal', benefit: 8, penalty: 4, cost: 4, risk: 3 },
  { id: 'F6', name: 'Family accounts', benefit: 4, penalty: 2, cost: 3, risk: 2 },
  { id: 'F7', name: 'Doctor ratings', benefit: 3, penalty: 1, cost: 2, risk: 5 },
  { id: 'F8', name: 'Insurance e-claims', benefit: 6, penalty: 7, cost: 7, risk: 7 },
];
const WEIGHTS = { benefit: 2, penalty: 1, cost: 1, risk: 0.5 };

const G_TABLE = `function __hopLe(f) {
  return ['benefit', 'penalty', 'cost', 'risk'].every(function (k) { var v = f[k]; return typeof v === 'number' && v >= 1 && v <= 9 && Math.floor(v) === v; });
}
function __r(x, n) { var m = Math.pow(10, n); return Math.round(x * m) / m; }

function priorityTable(features, weights) {
  var ok = [], invalid = [];
  features.forEach(function (f) { (__hopLe(f) ? ok : invalid).push(f); });
  var vals = ok.map(function (f) { return weights.benefit * f.benefit + weights.penalty * f.penalty; });
  var tv = vals.reduce(function (s, x) { return s + x; }, 0);
  var tc = ok.reduce(function (s, f) { return s + f.cost; }, 0);
  var tr = ok.reduce(function (s, f) { return s + f.risk; }, 0);
  var rows = ok.map(function (f, i) {
    var vp = tv ? vals[i] / tv * 100 : 0, cp = tc ? f.cost / tc * 100 : 0, rp = tr ? f.risk / tr * 100 : 0;
    var den = cp * weights.cost + rp * weights.risk;
    return { id: f.id, value: vals[i], valuePct: __r(vp, 2), costPct: __r(cp, 2), riskPct: __r(rp, 2), priority: __r(den ? vp / den : 0, 3), __p: den ? vp / den : 0 };
  });
  rows.sort(function (a, b) { return b.__p - a.__p || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0); });
  rows.forEach(function (r) { delete r.__p; });
  return { rows: rows, invalid: invalid.map(function (f) { return f.id; }).sort() };
}
`;

const G_PLAN = `function planRelease(features, weights, capacity, musts) {
  var t = priorityTable(features, weights);
  var cost = {};
  features.forEach(function (f) { cost['#' + f.id] = f.cost; });
  var known = t.rows.map(function (r) { return r.id; });
  var mustIds = known.filter(function (id) { return (musts || []).indexOf(id) >= 0; });
  var used = mustIds.reduce(function (s, id) { return s + cost['#' + id]; }, 0);
  if (used > capacity) return { ok: false, release: mustIds, used: used, slack: capacity - used };
  var release = mustIds.slice();
  known.forEach(function (id) {
    if (release.indexOf(id) >= 0) return;
    if (used + cost['#' + id] <= capacity) { release.push(id); used += cost['#' + id]; }
  });
  return { ok: true, release: release, used: used, slack: capacity - used };
}
`;

const G_SENS = `function sensitivity(features, weights, field, values) {
  var rankings = {}, tops = [];
  values.forEach(function (v) {
    var w = {}; Object.keys(weights).forEach(function (k) { w[k] = weights[k]; });
    w[field] = v;
    var ids = priorityTable(features, w).rows.map(function (r) { return r.id; });
    rankings[String(v)] = ids;
    tops.push(ids.slice(0, 3).join(','));
  });
  return { rankings: rankings, stableTop3: tops.every(function (x) { return x === tops[0]; }) };
}
`;

const GIAI = G_TABLE + G_PLAN + G_SENS;
const D = `var FEATURES = ${JSON.stringify(FEATURES)}; var WEIGHTS = ${JSON.stringify(WEIGHTS)};\n`;
const GD = D + GIAI;

const TWO = [{ id: 'A', benefit: 2, penalty: 1, cost: 1, risk: 1 }, { id: 'B', benefit: 1, penalty: 1, cost: 1, risk: 1 }];
const H_BAD = [...FEATURES.slice(0, 4), { id: 'X1', benefit: 10, penalty: 1, cost: 1, risk: 1 }, { id: 'X2', benefit: 5, penalty: 2.5, cost: 3, risk: 3 }, { id: 'X0', benefit: 5, penalty: 2, cost: 0, risk: 3 }];
const H_TIE = [{ id: 'K2', benefit: 4, penalty: 2, cost: 3, risk: 3 }, { id: 'K1', benefit: 4, penalty: 2, cost: 3, risk: 3 }, { id: 'K3', benefit: 1, penalty: 1, cost: 1, risk: 1 }];

const CA = [
  { moTa: { en: 'priorityTable: hand-checked two-feature table', vi: 'priorityTable: bảng hai tính năng tính tay' }, goi: `priorityTable(${JSON.stringify(TWO)}, { benefit: 2, penalty: 1, cost: 1, risk: 0.5 })`, mong: { rows: [{ id: 'A', value: 5, valuePct: 62.5, costPct: 50, riskPct: 50, priority: 0.833 }, { id: 'B', value: 3, valuePct: 37.5, costPct: 50, riskPct: 50, priority: 0.5 }], invalid: [] }, nhom: 'f1' },
  { moTa: { en: 'priorityTable: value and percentages on the ClinicCare sample', vi: 'priorityTable: value và phần trăm trên mẫu ClinicCare' }, goi: `priorityTable(FEATURES, WEIGHTS).rows.map(function (r) { return [r.id, r.value, r.valuePct, r.costPct, r.riskPct]; }).sort()`, nhom: 'f1', goiY: 'value = 2·benefit + 1·penalty; each % uses the totals of the valid features' },
  { moTa: { en: 'priorityTable: priorities on the sample', vi: 'priorityTable: priority trên mẫu' }, goi: `priorityTable(FEATURES, WEIGHTS).rows.map(function (r) { return [r.id, r.priority]; }).sort()`, nhom: 'f2', goiY: 'priority = value% ÷ (cost%·cost weight + risk%·risk weight), computed from unrounded percentages' },
  { moTa: { en: 'priorityTable: ranking order on the sample', vi: 'priorityTable: thứ tự xếp hạng trên mẫu' }, goi: `priorityTable(FEATURES, WEIGHTS).rows.map(function (r) { return r.id; })`, nhom: 'f2' },
  { moTa: { en: 'priorityTable (hidden): ties broken by id', vi: 'priorityTable (ẩn): hoà thì theo id' }, goi: `priorityTable(${JSON.stringify(H_TIE)}, { benefit: 2, penalty: 1, cost: 1, risk: 0.5 }).rows.map(function (r) { return r.id; })`, nhom: 'f2', an: true },
  { moTa: { en: 'priorityTable: invalid scores are excluded from the totals', vi: 'priorityTable: điểm sai bị loại khỏi tổng' }, goi: `priorityTable(${JSON.stringify(H_BAD)}, { benefit: 2, penalty: 1, cost: 1, risk: 0.5 }).invalid`, mong: ['X0', 'X1', 'X2'], nhom: 'f3' },
  { moTa: { en: 'priorityTable (hidden): totals ignore invalid features', vi: 'priorityTable (ẩn): tổng bỏ qua tính năng sai' }, goi: `priorityTable(${JSON.stringify(H_BAD)}, { benefit: 2, penalty: 1, cost: 1, risk: 0.5 }).rows`, nhom: 'f3', an: true },
  { moTa: { en: 'planRelease: capacity 20 with Musts F1 and F4', vi: 'planRelease: năng lực 20, Must F1 và F4' }, goi: `planRelease(FEATURES, WEIGHTS, 20, ['F1', 'F4'])`, nhom: 'f4' },
  { moTa: { en: 'planRelease: Musts that do not fit ⇒ ok = false', vi: 'planRelease: Must không vừa ⇒ ok = false' }, goi: `planRelease(FEATURES, WEIGHTS, 10, ['F1', 'F3'])`, mong: { ok: false, release: ['F1', 'F3'], used: 15, slack: -5 }, nhom: 'f4' },
  { moTa: { en: 'planRelease (hidden): no Musts, skip what does not fit and keep going', vi: 'planRelease (ẩn): không Must, bỏ mục không vừa và xét tiếp' }, goi: `planRelease(FEATURES, WEIGHTS, 9, [])`, nhom: 'f4', an: true },
  { moTa: { en: 'planRelease (hidden): unknown Must ids are ignored', vi: 'planRelease (ẩn): id Must lạ bị bỏ qua' }, goi: `planRelease(FEATURES, WEIGHTS, 12, ['F9', 'F2'])`, nhom: 'f4', an: true },
  { moTa: { en: 'sensitivity: risk weight 0, 0.5, 1', vi: 'sensitivity: trọng số risk 0, 0.5, 1' }, goi: `sensitivity(FEATURES, WEIGHTS, 'risk', [0, 0.5, 1])`, nhom: 'f5' },
  { moTa: { en: 'sensitivity (hidden): benefit weight 1 vs 3', vi: 'sensitivity (ẩn): trọng số benefit 1 vs 3' }, goi: `sensitivity(FEATURES, WEIGHTS, 'benefit', [1, 3])`, nhom: 'f5', an: true },
  { moTa: { en: 'sensitivity does not change the weights object', vi: 'sensitivity không sửa object trọng số' }, goi: `(function () { var w = { benefit: 2, penalty: 1, cost: 1, risk: 0.5 }; sensitivity(FEATURES, w, 'cost', [3]); return w; })()`, mong: { benefit: 2, penalty: 1, cost: 1, risk: 0.5 }, nhom: 'f6' },
  { moTa: { en: 'empty list ⇒ empty table and empty release', vi: 'danh sách rỗng ⇒ bảng rỗng, bản phát hành rỗng' }, goi: `[priorityTable([], WEIGHTS), planRelease([], WEIGHTS, 5, [])]`, mong: [{ rows: [], invalid: [] }, { ok: true, release: [], used: 0, slack: 5 }], nhom: 'f6' },
  { moTa: { en: 'hidden: input features are not modified', vi: 'ẩn: không sửa danh sách tính năng' }, goi: `(function () { var a = JSON.stringify(FEATURES); priorityTable(FEATURES, WEIGHTS); planRelease(FEATURES, WEIGHTS, 20, ['F1']); return a === JSON.stringify(FEATURES); })()`, mong: true, nhom: 'f6', an: true },
];
const KIEM = kiemCa(GD, CA);

const DATA = `// Sample data (read-only). The grader also uses hidden feature lists.\nconst FEATURES = ${JSON.stringify(FEATURES, null, 1)};\nconst WEIGHTS = ${JSON.stringify(WEIGHTS)};\n`;
const TEP = {
  'answers/sample-data.js': [DATA, DATA],
  'answers/priority-table.js': ["// A–C. Wiegers Table 16-1 as a function.\nfunction priorityTable(features, weights) {\n  // TODO: { rows: [{ id, value, valuePct, costPct, riskPct, priority }], invalid: [ids] }\n  return { rows: [], invalid: [] };\n}\n", G_TABLE],
  'answers/plan-release.js': ["// D. Musts first, then by priority while the cost fits.\nfunction planRelease(features, weights, capacity, musts) {\n  // TODO: { ok, release, used, slack }\n  return { ok: false, release: [], used: 0, slack: capacity };\n}\n", G_PLAN],
  'answers/sensitivity.js': ["// E. How does the ranking react when one weight changes?\nfunction sensitivity(features, weights, field, values) {\n  // TODO: { rankings: { '<value>': [ids] }, stableTop3 }\n  return { rankings: {}, stableTop3: false };\n}\n", G_SENS],
};

export default deLon({
  slug: 'swr302-10-deep-priority-engine',
  ten: 'Deep Lab 10 — Prioritisation engine',
  moTaModule: 'Deep Lab chương 10: tự viết bảng value/cost/risk của Wiegers thành hàm (loại điểm sai, làm tròn, hoà theo id), lập phạm vi bản phát hành (Must trước, rồi theo priority, báo vượt năng lực) và phân tích độ nhạy trọng số — chấm mẫu ClinicCare + dữ liệu ẩn.',
  baiHoc: 'swr302-10-4-ch16-scales-matrix',
  dangBai: 'deep-lab',
  tieuDe: 'Deep Lab 10 — Prioritisation engine (value, cost, risk)',
  phu: { en: 'Chapter 10 deep lab · Table 16-1 as code, release packing, sensitivity · 10 marks · hidden data on Submit', vi: 'Deep lab chương 10 · bảng 16-1 thành mã, xếp bản phát hành, độ nhạy · 10 điểm · dữ liệu ẩn khi Nộp' },
  moTa: {
    en: `<p>In Lab 10 you filled Wiegers’ prioritisation spreadsheet by hand. Here you build it as an engine the ClinicCare team can rerun every time a score changes — and you test how much the result depends on the weights.</p>
<p><b>A–C. <code>priorityTable(features, weights)</code></b>. Each feature has integer scores 1–9 for <code>benefit</code>, <code>penalty</code>, <code>cost</code> and <code>risk</code>. A feature with any score that is not an integer from 1 to 9 is <b>invalid</b>: list its id in <code>invalid</code> (sorted) and leave it out of everything else, including the totals. For valid features: <code>value = weights.benefit·benefit + weights.penalty·penalty</code>; <code>valuePct = value ÷ total value × 100</code>; <code>costPct</code> and <code>riskPct</code> likewise; <code>priority = valuePct ÷ (costPct·weights.cost + riskPct·weights.risk)</code>. Round the percentages to 2 decimals and the priority to 3 <b>for output only</b> (compute from unrounded numbers). Return <code>{ rows, invalid }</code>, rows sorted by priority (highest first), ties by id.</p>
<p><b>D. <code>planRelease(features, weights, capacity, musts)</code></b>. All valid Musts go in first (in ranking order). If they already exceed the capacity return <code>{ ok: false, release: musts, used, slack }</code> (slack negative). Otherwise walk the ranking and add each remaining feature whose cost still fits — skipping, not stopping, when one does not fit. Unknown or invalid ids in <code>musts</code> are ignored. Return <code>{ ok, release, used, slack }</code>.</p>
<p><b>E. <code>sensitivity(features, weights, field, values)</code></b>. For each value, copy the weights, replace <code>weights[field]</code>, and record the ranking (ids). Return <code>{ rankings: { '&lt;value&gt;': [ids] }, stableTop3 }</code> where <code>stableTop3</code> is true when the first three ids are the same, in the same order, for every value. Never modify the caller’s objects.</p>
<p><b>Sample data</b> (ClinicCare release 2):</p>${preJson('FEATURES', FEATURES)}${preJson('WEIGHTS', WEIGHTS)}`,
    vi: `<p>Ở Lab 10 bạn điền bảng ưu tiên bằng tay. Ở đây bạn dựng nó thành "động cơ" để đội ClinicCare chạy lại mỗi khi điểm thay đổi — và kiểm kết quả phụ thuộc trọng số tới đâu.</p>
<p><b>A–C. <code>priorityTable</code></b>: điểm nguyên 1–9; tính năng có điểm sai ⇒ <code>invalid</code> (sắp xếp) và bị loại khỏi mọi phép tính kể cả tổng. value = w.benefit·benefit + w.penalty·penalty; các % theo tổng; priority = value% ÷ (cost%·w.cost + risk%·w.risk). Làm tròn % 2 chữ số, priority 3 chữ số <b>chỉ khi xuất</b>. rows giảm dần theo priority, hoà theo id.</p>
<p><b>D. <code>planRelease</code></b>: Must hợp lệ vào trước (theo thứ tự xếp hạng); Must vượt năng lực ⇒ <code>ok: false</code>, slack âm; còn lại đi theo xếp hạng, mục không vừa thì bỏ qua và xét tiếp; id Must lạ bị bỏ qua.</p>
<p><b>E. <code>sensitivity</code></b>: với mỗi giá trị, sao chép trọng số, thay <code>weights[field]</code>, ghi xếp hạng; <code>stableTop3</code> = ba id đầu giống nhau ở mọi giá trị. Không sửa object của người gọi.</p>`,
  },
  chucNangChinh: [
    { en: 'A. Value and percentages.', vi: 'A. Value và phần trăm.' },
    { en: 'B. Priority and ranking.', vi: 'B. Priority và xếp hạng.' },
    { en: 'C. Invalid scores.', vi: 'C. Điểm không hợp lệ.' },
    { en: 'D. Release packing.', vi: 'D. Xếp bản phát hành.' },
    { en: 'E. Weight sensitivity.', vi: 'E. Độ nhạy trọng số.' },
    { en: 'F. Robustness.', vi: 'F. Độ bền.' },
  ],
  yeuCauChung: [{ en: 'Pure functions; round only for output; ties by id.', vi: 'Hàm thuần; chỉ làm tròn khi xuất; hoà theo id.' }],
  cayThuMuc: `answers/
├── sample-data.js        ← FEATURES, WEIGHTS (read-only)
├── priority-table.js     ← function priorityTable(features, weights)
├── plan-release.js       ← function planRelease(features, weights, capacity, musts)
└── sensitivity.js        ← function sensitivity(features, weights, field, values)`,
  moHinh: {
    ten: 'Data shapes',
    truong: [
      ['feature', '{ id, name, benefit, penalty, cost, risk }', { en: 'integers 1–9', vi: 'số nguyên 1–9' }],
      ['weights', '{ benefit, penalty, cost, risk }', { en: 'Wiegers default 2, 1, 1, 0.5', vi: 'mặc định Wiegers 2, 1, 1, 0.5' }],
      ['row', '{ id, value, valuePct, costPct, riskPct, priority }', { en: '2 / 2 / 2 / 3 decimals', vi: '2 / 2 / 2 / 3 chữ số' }],
    ],
  },
  chucNang: [
    { ten: { en: 'A. Value and %', vi: 'A. Value và %' }, diem: 2, yeuCau: [{ en: 'Weighted value; % of valid totals.', vi: 'Value có trọng số; % trên tổng hợp lệ.' }], hook: ['Wiegers Table 16-1'] },
    { ten: { en: 'B. Priority and ranking', vi: 'B. Priority và xếp hạng' }, diem: 2, yeuCau: [{ en: 'From unrounded numbers; ties by id.', vi: 'Tính từ số chưa làm tròn; hoà theo id.' }], hook: ['priority formula'] },
    { ten: { en: 'C. Invalid scores', vi: 'C. Điểm sai' }, diem: 1, yeuCau: [{ en: 'Excluded from totals.', vi: 'Loại khỏi tổng.' }], hook: ['validation'] },
    { ten: { en: 'D. planRelease', vi: 'D. planRelease' }, diem: 2.5, yeuCau: [{ en: 'Musts first; skip-and-continue; over-capacity report.', vi: 'Must trước; bỏ qua và xét tiếp; báo vượt năng lực.' }], hook: ['release planning'] },
    { ten: { en: 'E. sensitivity', vi: 'E. sensitivity' }, diem: 1.5, yeuCau: [{ en: 'Rankings per weight value; stable top 3.', vi: 'Xếp hạng theo từng trọng số; top 3 ổn định.' }], hook: ['sensitivity analysis'] },
    { ten: { en: 'F. Robustness', vi: 'F. Độ bền' }, diem: 1, yeuCau: [{ en: 'Empty input; no mutation.', vi: 'Đầu vào rỗng; không sửa đầu vào.' }], hook: ['defensive code'] },
  ],
  idBatBuoc: [['priorityTable', 'answers/priority-table.js'], ['planRelease', 'answers/plan-release.js'], ['sensitivity', 'answers/sensitivity.js']],
  truDiem: [
    { en: 'Rounding the percentages before computing the priority — the ranking can change.', vi: 'Làm tròn % trước khi tính priority — xếp hạng có thể đổi.' },
    { en: 'Stopping the release at the first feature that does not fit.', vi: 'Dừng xếp bản phát hành ở tính năng đầu tiên không vừa.' },
    { en: 'Changing weights[field] in place inside sensitivity().', vi: 'Sửa trực tiếp weights[field] trong sensitivity().' },
  ],
  goiY: [
    'A: lọc hợp lệ trước, tính tổng trên danh sách đã lọc; giữ priority chưa làm tròn trong một trường tạm để sắp.',
    'D: dùng lại priorityTable để lấy thứ tự; bảng cost theo "#"+id.',
    'E: sao chép trọng số bằng vòng lặp/Object.assign({}, weights) trước khi thay.',
  ],
  loiHayGap: ['Tính tổng cost/risk cả tính năng sai.', 'Dùng giá trị đã làm tròn để sắp.', 'Đưa id Must lạ vào release.'],
  giaiThich: {
    en: '<p>The reference solution is in the answer files. On the sample, F2 (SMS reminders) and F5 (lab results portal) lead: modest value but cheap and low-risk; F1 (online booking) has the highest value but is expensive. With capacity 20 and Musts F1 and F4 (11 points), the engine adds F2, F5 and F6 in ranking order while they fit. The sensitivity check shows whether the top three survive a change of the risk weight — if not, the team must discuss risk explicitly before committing.</p>',
    vi: '<p>Lời giải tham chiếu ở các tệp đáp án. Trên mẫu, F2 (nhắc lịch SMS) và F5 (cổng kết quả xét nghiệm) dẫn đầu: value vừa phải nhưng rẻ và ít rủi ro; F1 value cao nhất nhưng tốn kém. Năng lực 20 với Must F1, F4 (11 điểm), động cơ thêm F2, F5, F6 theo xếp hạng khi còn vừa. Phân tích độ nhạy cho biết top 3 có giữ nguyên khi đổi trọng số rủi ro không — nếu không, đội phải bàn rõ về rủi ro trước khi chốt.</p>',
  },
  khaiNiem: ['value/cost/risk prioritization', 'release planning', 'sensitivity analysis'],
  tienQuyet: ['Lab 10', 'SWR302 lessons 10.1 and 10.4'],
  thuatNgu: [...tn('valueCostRisk', 'moscow'), { en: 'sensitivity analysis', vi: 'phân tích độ nhạy — kết quả đổi thế nào khi một tham số đổi' }],
  moTaNgan: 'Deep lab chương 10: động cơ ưu tiên Wiegers, xếp bản phát hành, độ nhạy — chấm dữ liệu ẩn.',
  phut: 90,
  tep: TEP,
  kiem: KIEM,
  boYeu: [
    { ten: 'làm tròn trước, dừng khi không vừa', tep: {
      'answers/priority-table.js': "function priorityTable(fs,w){ var tv=0,tc=0,tr=0; fs.forEach(function(f){ tv+=w.benefit*f.benefit+w.penalty*f.penalty; tc+=f.cost; tr+=f.risk; }); var rows=fs.map(function(f){ var v=w.benefit*f.benefit+w.penalty*f.penalty; var vp=Math.round(v/tv*10000)/100, cp=Math.round(f.cost/tc*10000)/100, rp=Math.round(f.risk/tr*10000)/100; return {id:f.id,value:v,valuePct:vp,costPct:cp,riskPct:rp,priority:Math.round(vp/(cp*w.cost+rp*w.risk)*1000)/1000}; }); rows.sort(function(a,b){return b.priority-a.priority;}); return {rows:rows,invalid:[]}; }\n",
      'answers/plan-release.js': "function planRelease(fs,w,cap,musts){ var t=priorityTable(fs,w), c={}; fs.forEach(function(f){c[f.id]=f.cost;}); var r=musts.slice(), u=0; r.forEach(function(id){u+=c[id]||0;}); for(var i=0;i<t.rows.length;i++){ var id=t.rows[i].id; if(r.indexOf(id)>=0) continue; if(u+c[id]>cap) break; r.push(id); u+=c[id]; } return {ok:u<=cap,release:r,used:u,slack:cap-u}; }\n",
    } },
  ],
});
