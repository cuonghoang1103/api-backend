/**
 * SWR302 · DEEP LAB 4 — Model consistency checker: DFD balancing, DFD rules, decision-table completeness.
 * Người học viết ba hàm: balance(context, level0) · dfdRules(dfd) · checkTable(conditions, rules); chấm trên mẫu MediLab + dữ liệu ẩn.
 */
import { tn } from './_chung.mjs';
import { deLon } from './_lab.mjs';
import { kiemCa, preJson } from './_deep.mjs';

const CONTEXT = {
  system: 'MediLab',
  entities: ['Doctor', 'Patient', 'Lab Analyzer', 'Insurer'],
  flows: [
    { from: 'Doctor', to: 'MediLab', label: 'test order' },
    { from: 'MediLab', to: 'Doctor', label: 'test result' },
    { from: 'Patient', to: 'MediLab', label: 'sample' },
    { from: 'MediLab', to: 'Patient', label: 'result notification' },
    { from: 'MediLab', to: 'Lab Analyzer', label: 'analysis request' },
    { from: 'Lab Analyzer', to: 'MediLab', label: 'measurement' },
    { from: 'MediLab', to: 'Insurer', label: 'claim' },
  ],
};
const LEVEL0 = {
  entities: ['Doctor', 'Patient', 'Lab Analyzer', 'Insurer'],
  processes: [{ id: 'P1', name: 'Register order' }, { id: 'P2', name: 'Run analysis' }, { id: 'P3', name: 'Report results' }, { id: 'P4', name: 'Bill insurer' }, { id: 'P5', name: 'Archive samples' }],
  stores: [{ id: 'D1', name: 'Orders' }, { id: 'D2', name: 'Results' }, { id: 'D3', name: 'Price list' }],
  flows: [
    { from: 'Doctor', to: 'P1', label: 'test order' },
    { from: 'P1', to: 'D1', label: 'order' },
    { from: 'Patient', to: 'P2', label: 'sample' },
    { from: 'D1', to: 'P2', label: 'order' },
    { from: 'P2', to: 'Lab Analyzer', label: 'analysis request' },
    { from: 'Lab Analyzer', to: 'P2', label: 'Measurement' },
    { from: 'P2', to: 'D2', label: 'result' },
    { from: 'D2', to: 'P3', label: 'result' },
    { from: 'P3', to: 'Doctor', label: 'test  result' },
    { from: 'P3', to: 'Patient', label: 'SMS' },
    { from: 'D1', to: 'P4', label: 'order' },
    { from: 'P4', to: 'Insurer', label: 'claim' },
    { from: 'Insurer', to: 'P4', label: 'claim decision' },
    { from: 'Patient', to: 'P5', label: 'sample' },
    { from: 'Doctor', to: 'D1', label: 'order note' },
    { from: 'D3', to: 'D1', label: '' },
  ],
};
const CONDITIONS = [
  { name: 'Member', values: ['Y', 'N'] },
  { name: 'Total', values: ['<500k', '500k-1M', '>1M'] },
  { name: 'Coupon', values: ['Y', 'N'] },
];
const RULES = [
  { id: 'R1', when: { Member: 'Y', Total: '>1M' }, action: '10% off' },
  { id: 'R2', when: { Member: 'Y', Total: '500k-1M' }, action: '5% off' },
  { id: 'R3', when: { Member: 'N', Coupon: 'Y' }, action: '3% off' },
  { id: 'R4', when: { Member: 'N', Total: '>1M', Coupon: 'Y' }, action: '5% off' },
  { id: 'R5', when: { Member: 'N', Total: '<500k', Coupon: 'N' }, action: 'no discount' },
  { id: 'R6', when: { Member: 'Y', Total: '>1M', Coupon: 'Y' }, action: '10% off' },
  { id: 'R7', when: { Member: 'Maybe' }, action: 'ask' },
];

const G_BAL = `function __nhan(s) { return String(s == null ? '' : s).trim().replace(/\\s+/g, ' ').toLowerCase(); }

function balance(context, level0) {
  var sys = context.system;
  var ctxFlows = [], l0Flows = [];
  (context.flows || []).forEach(function (f) {
    if (f.to === sys && f.from !== sys) ctxFlows.push('IN ' + String(f.from).trim() + ': ' + __nhan(f.label));
    else if (f.from === sys && f.to !== sys) ctxFlows.push('OUT ' + String(f.to).trim() + ': ' + __nhan(f.label));
  });
  var ent = {}, pro = {};
  (level0.entities || []).forEach(function (e) { ent['#' + e] = true; });
  (level0.processes || []).forEach(function (p) { pro['#' + p.id] = true; });
  (level0.flows || []).forEach(function (f) {
    if (ent['#' + f.from] && pro['#' + f.to]) l0Flows.push('IN ' + String(f.from).trim() + ': ' + __nhan(f.label));
    else if (pro['#' + f.from] && ent['#' + f.to]) l0Flows.push('OUT ' + String(f.to).trim() + ': ' + __nhan(f.label));
  });
  function tru(a, b) {
    var con = b.slice(), out = [];
    a.forEach(function (x) { var i = con.indexOf(x); if (i >= 0) con.splice(i, 1); else out.push(x); });
    return out.sort();
  }
  var missing = tru(ctxFlows, l0Flows), extra = tru(l0Flows, ctxFlows);
  return { balanced: missing.length === 0 && extra.length === 0, missing: missing, extra: extra };
}
`;

const G_DFD = `function dfdRules(dfd) {
  var kind = {};
  (dfd.entities || []).forEach(function (e) { kind['#' + e] = 'E'; });
  (dfd.processes || []).forEach(function (p) { kind['#' + p.id] = 'P'; });
  (dfd.stores || []).forEach(function (s) { kind['#' + s.id] = 'S'; });
  var out = {}, vao = {}, ra = {};
  function add(c) { out[c] = true; }
  (dfd.flows || []).forEach(function (f) {
    var a = kind['#' + f.from], b = kind['#' + f.to], ten = f.from + '->' + f.to;
    if (!String(f.label == null ? '' : f.label).trim()) add('UNLABELED:' + ten);
    if (!a) add('UNKNOWN:' + f.from);
    if (!b) add('UNKNOWN:' + f.to);
    if (a === 'E' && b === 'E') add('ENTITY_TO_ENTITY:' + ten);
    if ((a === 'E' && b === 'S') || (a === 'S' && b === 'E')) add('ENTITY_STORE:' + ten);
    if (a === 'S' && b === 'S') add('STORE_TO_STORE:' + ten);
    ra['#' + f.from] = (ra['#' + f.from] || 0) + 1;
    vao['#' + f.to] = (vao['#' + f.to] || 0) + 1;
  });
  (dfd.processes || []).forEach(function (p) {
    var i = vao['#' + p.id] || 0, o = ra['#' + p.id] || 0;
    if (i && !o) add('BLACK_HOLE:' + p.id);
    if (o && !i) add('MIRACLE:' + p.id);
    if (!i && !o) add('ISOLATED:' + p.id);
  });
  (dfd.stores || []).forEach(function (s) {
    var i = vao['#' + s.id] || 0, o = ra['#' + s.id] || 0;
    if (i && !o) add('WRITE_ONLY:' + s.id);
    if (o && !i) add('READ_ONLY:' + s.id);
    if (!i && !o) add('ISOLATED:' + s.id);
  });
  return Object.keys(out).sort();
}
`;

const G_DT = `function checkTable(conditions, rules) {
  var invalid = [], ok = [];
  (rules || []).forEach(function (r) {
    var w = r.when || {}, bad = false;
    Object.keys(w).forEach(function (k) {
      var c = conditions.filter(function (x) { return x.name === k; })[0];
      if (!c || (w[k] !== '-' && c.values.indexOf(w[k]) < 0)) bad = true;
    });
    if (bad) invalid.push(r.id); else ok.push(r);
  });
  var combos = conditions.length ? [[]] : [];
  conditions.forEach(function (c) {
    var next = [];
    combos.forEach(function (p) { c.values.forEach(function (v) { next.push(p.concat([v])); }); });
    combos = next;
  });
  var missing = [], conflicts = [], redundant = [];
  combos.forEach(function (combo) {
    var hit = ok.filter(function (r) {
      return conditions.every(function (c, i) { var v = (r.when || {})[c.name]; return v === undefined || v === '-' || v === combo[i]; });
    });
    var ten = conditions.map(function (c, i) { return c.name + '=' + combo[i]; }).join(', ');
    if (!hit.length) missing.push(ten);
    else if (hit.length > 1) {
      var acts = {};
      hit.forEach(function (r) { acts['#' + r.action] = true; });
      (Object.keys(acts).length > 1 ? conflicts : redundant).push(ten);
    }
  });
  return { missing: missing, conflicts: conflicts, redundant: redundant, invalid: invalid.sort() };
}
`;

const GIAI = G_BAL + G_DFD + G_DT;
const D = `var CONTEXT = ${JSON.stringify(CONTEXT)}; var LEVEL0 = ${JSON.stringify(LEVEL0)}; var CONDITIONS = ${JSON.stringify(CONDITIONS)}; var RULES = ${JSON.stringify(RULES)};\n`;
const GIAI_D = D + GIAI;

/* dữ liệu ẩn */
const H_CTX = { system: 'Shop', entities: ['Customer', 'Bank', 'constructor'], flows: [
  { from: 'Customer', to: 'Shop', label: 'order' }, { from: 'Customer', to: 'Shop', label: 'order' },
  { from: 'Shop', to: 'Bank', label: 'Payment  Request' }, { from: 'Bank', to: 'Customer', label: 'statement' },
  { from: 'constructor', to: 'Shop', label: 'x' },
] };
const H_L0 = { entities: ['Customer', 'Bank', 'constructor'], processes: [{ id: 'P1', name: 'a' }, { id: 'P2', name: 'b' }], stores: [{ id: 'D1', name: 's' }], flows: [
  { from: 'Customer', to: 'P1', label: ' Order' }, { from: 'P2', to: 'Bank', label: 'payment request' },
  { from: 'Customer', to: 'D1', label: 'order' }, { from: 'constructor', to: 'P2', label: 'X' }, { from: 'P1', to: 'P2', label: 'order' },
] };
const H_DFD = { entities: ['A', 'B'], processes: [{ id: 'P1' }, { id: 'P2' }, { id: 'P3' }, { id: 'toString' }], stores: [{ id: 'S1' }, { id: 'S2' }], flows: [
  { from: 'A', to: 'B', label: 'note' }, { from: 'A', to: 'P1', label: 'in' }, { from: 'P1', to: 'S1', label: 'w' },
  { from: 'S2', to: 'P2', label: 'r' }, { from: 'P2', to: 'A', label: 'out' }, { from: 'P2', to: 'Z9', label: 'ghost' },
  { from: 'S1', to: 'S2', label: '   ' },
] };
const H_COND = [{ name: 'A', values: ['1', '2'] }, { name: 'B', values: ['x', 'y'] }];
const H_RULES = [{ id: 'Q2', when: { A: '1', B: '-' }, action: 'go' }, { id: 'Q1', when: { A: '1', B: 'x' }, action: 'go' }, { id: 'Q3', when: { A: '2', B: 'y' }, action: 'stop' }, { id: 'Q4', when: { B: 'y' }, action: 'wait' }, { id: 'Q0', when: { C: '1' }, action: 'go' }];

const CA = [
  // f1 balance
  { moTa: { en: 'balance: MediLab sample — missing flows', vi: 'balance: mẫu MediLab — luồng thiếu' }, goi: 'balance(CONTEXT, LEVEL0).missing', mong: ['OUT Patient: result notification'], nhom: 'f1' },
  { moTa: { en: 'balance: MediLab sample — extra flows', vi: 'balance: mẫu MediLab — luồng thừa' }, goi: 'balance(CONTEXT, LEVEL0).extra', mong: ['IN Insurer: claim decision', 'IN Patient: sample', 'OUT Patient: sms'], nhom: 'f1', goiY: 'labels are compared trimmed, spaces collapsed, lower case; flows are a multiset — the sample also goes into P5' },
  { moTa: { en: 'balance: a balanced pair returns balanced = true', vi: 'balance: cặp cân bằng ⇒ balanced = true' }, goi: `balance({ system: 'S', flows: [{ from: 'U', to: 'S', label: 'a' }, { from: 'S', to: 'U', label: 'b' }] }, { entities: ['U'], processes: [{ id: 'P1' }, { id: 'P2' }], flows: [{ from: 'U', to: 'P1', label: 'A ' }, { from: 'P2', to: 'U', label: 'b' }, { from: 'P1', to: 'P2', label: 'x' }] })`, mong: { balanced: true, missing: [], extra: [] }, nhom: 'f1' },
  { moTa: { en: 'balance (hidden): duplicates count, entity–store flows ignored, tricky names', vi: 'balance (ẩn): luồng lặp được đếm, luồng thực thể–kho bỏ qua, tên đánh lừa' }, goi: `balance(${JSON.stringify(H_CTX)}, ${JSON.stringify(H_L0)})`, nhom: 'f1', an: true },
  // f2 dfdRules
  { moTa: { en: 'dfdRules: MediLab level 0 — process problems', vi: 'dfdRules: mức 0 MediLab — lỗi tiến trình' }, goi: `dfdRules(LEVEL0).filter(function (c) { return /^(BLACK_HOLE|MIRACLE|ISOLATED):P/.test(c); })`, mong: ['BLACK_HOLE:P5'], nhom: 'f2' },
  { moTa: { en: 'dfdRules: MediLab level 0 — illegal flows', vi: 'dfdRules: mức 0 MediLab — luồng sai luật' }, goi: `dfdRules(LEVEL0).filter(function (c) { return /^(ENTITY_TO_ENTITY|ENTITY_STORE|STORE_TO_STORE)/.test(c); })`, mong: ['ENTITY_STORE:Doctor->D1', 'STORE_TO_STORE:D3->D1'], nhom: 'f2' },
  { moTa: { en: 'dfdRules: MediLab level 0 — stores and labels', vi: 'dfdRules: mức 0 MediLab — kho và nhãn' }, goi: `dfdRules(LEVEL0).filter(function (c) { return /^(WRITE_ONLY|READ_ONLY|ISOLATED:D|UNLABELED)/.test(c); })`, mong: ['READ_ONLY:D3', 'UNLABELED:D3->D1'], nhom: 'f2' },
  { moTa: { en: 'dfdRules: full sorted list for MediLab', vi: 'dfdRules: danh sách đầy đủ đã sắp cho MediLab' }, goi: 'dfdRules(LEVEL0)', nhom: 'f2' },
  { moTa: { en: 'dfdRules (hidden): unknown endpoints, isolated items, whitespace labels', vi: 'dfdRules (ẩn): điểm lạ, mục cô lập, nhãn toàn khoảng trắng' }, goi: `dfdRules(${JSON.stringify(H_DFD)})`, nhom: 'f2', an: true },
  // f3 checkTable missing
  { moTa: { en: 'checkTable: missing combinations (enumeration order)', vi: 'checkTable: tổ hợp còn thiếu (đúng thứ tự liệt kê)' }, goi: 'checkTable(CONDITIONS, RULES).missing', mong: ['Member=Y, Total=<500k, Coupon=Y', 'Member=Y, Total=<500k, Coupon=N', 'Member=N, Total=500k-1M, Coupon=N', 'Member=N, Total=>1M, Coupon=N'], nhom: 'f3' },
  { moTa: { en: 'checkTable: a complete table has no gaps', vi: 'checkTable: bảng đủ không có lỗ' }, goi: `checkTable([{ name: 'X', values: ['Y', 'N'] }], [{ id: 'A', when: { X: 'Y' }, action: 'a' }, { id: 'B', when: { X: 'N' }, action: 'b' }])`, mong: { missing: [], conflicts: [], redundant: [], invalid: [] }, nhom: 'f3' },
  { moTa: { en: 'checkTable (hidden): "-" and absent conditions mean "any value"', vi: 'checkTable (ẩn): "-" và điều kiện vắng nghĩa là "mọi giá trị"' }, goi: `checkTable(${JSON.stringify(H_COND)}, ${JSON.stringify(H_RULES)}).missing`, nhom: 'f3', an: true },
  // f4 conflicts/redundant/invalid
  { moTa: { en: 'checkTable: conflicting combinations', vi: 'checkTable: tổ hợp mâu thuẫn' }, goi: 'checkTable(CONDITIONS, RULES).conflicts', mong: ['Member=N, Total=>1M, Coupon=Y'], nhom: 'f4' },
  { moTa: { en: 'checkTable: redundant combinations and invalid rules', vi: 'checkTable: tổ hợp trùng và luật không hợp lệ' }, goi: '(function () { var r = checkTable(CONDITIONS, RULES); return { redundant: r.redundant, invalid: r.invalid }; })()', mong: { redundant: ['Member=Y, Total=>1M, Coupon=Y'], invalid: ['R7'] }, nhom: 'f4' },
  { moTa: { en: 'checkTable (hidden): conflicts vs redundancy, unknown condition names', vi: 'checkTable (ẩn): mâu thuẫn vs trùng, tên điều kiện lạ' }, goi: `checkTable(${JSON.stringify(H_COND)}, ${JSON.stringify(H_RULES)})`, nhom: 'f4', an: true },
  // f5 robustness
  { moTa: { en: 'empty models do not crash', vi: 'mô hình rỗng không làm hỏng hàm' }, goi: `[balance({ system: 'S', flows: [] }, { entities: [], processes: [], flows: [] }), dfdRules({ entities: [], processes: [], stores: [], flows: [] }), checkTable([], [])]`, mong: [{ balanced: true, missing: [], extra: [] }, [], { missing: [], conflicts: [], redundant: [], invalid: [] }], nhom: 'f5' },
  { moTa: { en: 'inputs are not modified', vi: 'không sửa dữ liệu đầu vào' }, goi: `(function () { var a = JSON.stringify([CONTEXT, LEVEL0, CONDITIONS, RULES]); balance(CONTEXT, LEVEL0); dfdRules(LEVEL0); checkTable(CONDITIONS, RULES); return a === JSON.stringify([CONTEXT, LEVEL0, CONDITIONS, RULES]); })()`, mong: true, nhom: 'f5' },
  { moTa: { en: 'hidden: names like "toString" / "constructor" are handled', vi: 'ẩn: tên như "toString" / "constructor" được xử lý đúng' }, goi: `[dfdRules({ entities: ['constructor'], processes: [{ id: 'P1' }], stores: [], flows: [{ from: 'constructor', to: 'P1', label: 'a' }, { from: 'P1', to: 'hasOwnProperty', label: 'b' }] }), checkTable([{ name: 'toString', values: ['a'] }], [{ id: 'T', when: { toString: 'a' }, action: 'x' }])]`, nhom: 'f5', an: true },
];

const KIEM = kiemCa(GIAI_D, CA);

const DAU = {
  'answers/balance.js': "// A. DFD balancing: compare the external flows of the context diagram with those of level 0.\n// Flow key: 'IN <Entity>: <label>' or 'OUT <Entity>: <label>' — label trimmed, spaces collapsed, lower case.\nfunction balance(context, level0) {\n  // TODO\n  return { balanced: false, missing: [], extra: [] };\n}\n",
  'answers/dfd-rules.js': "// B. DFD rule checker — return the sorted list of problem codes.\nfunction dfdRules(dfd) {\n  // TODO\n  return [];\n}\n",
  'answers/decision-table.js': "// C. Decision-table completeness: missing, conflicting and redundant combinations, invalid rules.\nfunction checkTable(conditions, rules) {\n  // TODO\n  return { missing: [], conflicts: [], redundant: [], invalid: [] };\n}\n",
  'answers/sample-data.js': `// Sample models (read-only). The grader also runs your functions on hidden models.\nconst CONTEXT = ${JSON.stringify(CONTEXT, null, 1)};\nconst LEVEL0 = ${JSON.stringify(LEVEL0, null, 1)};\nconst CONDITIONS = ${JSON.stringify(CONDITIONS, null, 1)};\nconst RULES = ${JSON.stringify(RULES, null, 1)};\n`,
};
const TEP = {
  'answers/sample-data.js': [DAU['answers/sample-data.js'], DAU['answers/sample-data.js']],
  'answers/balance.js': [DAU['answers/balance.js'], G_BAL],
  'answers/dfd-rules.js': [DAU['answers/dfd-rules.js'], G_DFD],
  'answers/decision-table.js': [DAU['answers/decision-table.js'], G_DT],
};

export default deLon({
  slug: 'swr302-4-deep-model-checker',
  ten: 'Deep Lab 4 — Model consistency checker',
  moTaModule: 'Deep Lab chương 4: tự viết công cụ kiểm mô hình — cân bằng DFD (context ↔ mức 0, so như đa tập), luật DFD (hố đen, phép màu, luồng sai luật, kho chỉ ghi/chỉ đọc, thiếu nhãn) và độ đầy đủ bảng quyết định (tổ hợp thiếu, mâu thuẫn, trùng) — chấm trên mẫu MediLab và dữ liệu ẩn.',
  baiHoc: 'swr302-4-8-ch12-flow-models',
  dangBai: 'deep-lab',
  tieuDe: 'Deep Lab 4 — Model consistency checker (DFD balancing, DFD rules, decision tables)',
  phu: { en: 'Chapter 4 deep lab · build the checks a modelling tool runs · 10 marks · hidden models on Submit', vi: 'Deep lab chương 4 · tự viết bộ kiểm mà công cụ mô hình hoá chạy · 10 điểm · mô hình ẩn khi Nộp' },
  moTa: {
    en: `<p>Analysis models are only useful when they are consistent. In this deep lab you build the checks a requirements-modelling tool runs automatically, then run them on <b>MediLab</b>, a hospital laboratory system. The grader runs your functions on the sample below <b>and on hidden models</b>.</p>
<p><b>A. <code>balance(context, level0)</code></b> — Wiegers: a level-0 DFD must be <i>balanced</i> with its context diagram: the flows between external entities and the system must be the same. Turn every context flow that enters the system into the key <code>'IN &lt;Entity&gt;: &lt;label&gt;'</code> and every flow leaving it into <code>'OUT &lt;Entity&gt;: &lt;label&gt;'</code>; do the same for level-0 flows between an external entity and a <b>process</b> (ignore every other flow). Labels are trimmed, inner spaces collapsed to one, lower-cased. Compare the two lists as <b>multisets</b> (a flow listed twice must appear twice). Return <code>{ balanced, missing, extra }</code> — <code>missing</code>: in the context but not in level 0; <code>extra</code>: the other way; both sorted.</p>
<p><b>B. <code>dfdRules(dfd)</code></b> — return the <b>sorted, duplicate-free</b> list of problem codes:</p>
<ul><li><code>UNLABELED:from-&gt;to</code> — a flow whose label is empty or only spaces;</li><li><code>UNKNOWN:name</code> — an endpoint that is not an entity, process id or store id;</li><li><code>ENTITY_TO_ENTITY:from-&gt;to</code>, <code>ENTITY_STORE:from-&gt;to</code> (either direction), <code>STORE_TO_STORE:from-&gt;to</code> — data must pass through a process;</li><li>for each process: <code>BLACK_HOLE:id</code> (inputs, no outputs), <code>MIRACLE:id</code> (outputs, no inputs), <code>ISOLATED:id</code> (neither);</li><li>for each store: <code>WRITE_ONLY:id</code>, <code>READ_ONLY:id</code>, <code>ISOLATED:id</code>.</li></ul>
<p>Count every flow (legal or not) when deciding inputs and outputs.</p>
<p><b>C/D. <code>checkTable(conditions, rules)</code></b> — a decision table is complete when every combination of condition values is covered by exactly one rule. Enumerate the combinations with the first condition varying slowest and values in listed order; name a combination <code>'Member=Y, Total=&lt;500k, Coupon=Y'</code>. A rule matches a combination when each condition in its <code>when</code> equals the value, is <code>'-'</code>, or is absent. A rule that names an unknown condition or an unknown value is <b>invalid</b> (listed by id, sorted, and ignored). Return <code>{ missing, conflicts, redundant, invalid }</code>: combinations with no rule; with two or more rules giving different actions; with two or more rules giving the same action. With no conditions there are no combinations.</p>
<p><b>Sample data</b> (also in <code>answers/sample-data.js</code>):</p>${preJson('CONTEXT', CONTEXT)}${preJson('LEVEL0', LEVEL0)}${preJson('CONDITIONS', CONDITIONS)}${preJson('RULES', RULES)}`,
    vi: `<p>Mô hình phân tích chỉ hữu ích khi nhất quán. Deep lab này: tự viết các phép kiểm mà công cụ mô hình hoá chạy, rồi chạy trên <b>MediLab</b> (phòng xét nghiệm bệnh viện). Máy chấm chạy hàm của bạn trên dữ liệu mẫu <b>và mô hình ẩn</b>.</p>
<p><b>A. <code>balance(context, level0)</code></b> — DFD mức 0 phải <i>cân bằng</i> với sơ đồ ngữ cảnh. Mỗi luồng vào hệ thống thành khoá <code>'IN &lt;Thực thể&gt;: &lt;nhãn&gt;'</code>, luồng ra thành <code>'OUT …'</code>; làm tương tự với luồng mức 0 giữa thực thể ngoài và <b>tiến trình</b> (bỏ qua luồng khác). Nhãn: cắt khoảng trắng hai đầu, gộp khoảng trắng giữa, chữ thường. So như <b>đa tập</b>. Trả <code>{ balanced, missing, extra }</code> (đã sắp).</p>
<p><b>B. <code>dfdRules(dfd)</code></b> — danh sách mã lỗi đã sắp, không trùng: UNLABELED, UNKNOWN, ENTITY_TO_ENTITY, ENTITY_STORE, STORE_TO_STORE, BLACK_HOLE / MIRACLE / ISOLATED cho tiến trình, WRITE_ONLY / READ_ONLY / ISOLATED cho kho. Đếm mọi luồng (kể cả sai luật) khi xét vào/ra.</p>
<p><b>C/D. <code>checkTable(conditions, rules)</code></b> — liệt kê mọi tổ hợp (điều kiện đầu thay đổi chậm nhất, giá trị theo thứ tự khai báo); luật khớp khi mỗi điều kiện bằng giá trị, là <code>'-'</code> hoặc vắng; luật có điều kiện/giá trị lạ là <b>invalid</b> (bị bỏ qua); không có điều kiện nào ⇒ không có tổ hợp nào. Trả <code>{ missing, conflicts, redundant, invalid }</code>.</p>`,
  },
  chucNangChinh: [
    { en: 'A. DFD balancing between the context diagram and level 0.', vi: 'A. Cân bằng DFD giữa sơ đồ ngữ cảnh và mức 0.' },
    { en: 'B. DFD rule checker.', vi: 'B. Bộ kiểm luật DFD.' },
    { en: 'C. Decision-table gaps.', vi: 'C. Lỗ hổng của bảng quyết định.' },
    { en: 'D. Decision-table conflicts, redundancy and invalid rules.', vi: 'D. Mâu thuẫn, trùng lặp và luật không hợp lệ.' },
    { en: 'E. Robustness: empty models, untouched inputs, tricky names.', vi: 'E. Độ bền: mô hình rỗng, không sửa đầu vào, tên đánh lừa.' },
  ],
  yeuCauChung: [
    { en: 'Pure functions: do not modify the inputs; do not rely on the sample data inside your functions.', vi: 'Hàm thuần: không sửa đầu vào; không dựa vào dữ liệu mẫu bên trong hàm.' },
    { en: 'Ids such as "constructor" or "toString" must work — use Object.create(null), a prefix, or hasOwnProperty.', vi: 'Id như "constructor" hay "toString" phải chạy đúng — dùng Object.create(null), tiền tố, hoặc hasOwnProperty.' },
  ],
  cayThuMuc: `answers/
├── sample-data.js      ← CONTEXT, LEVEL0, CONDITIONS, RULES (read-only)
├── balance.js          ← function balance(context, level0)
├── dfd-rules.js        ← function dfdRules(dfd)
└── decision-table.js   ← function checkTable(conditions, rules)`,
  moHinh: {
    ten: 'Data shapes',
    truong: [
      ['context', '{ system, entities[], flows[{from,to,label}] }', { en: 'flows touch the system name', vi: 'luồng nối với tên hệ thống' }],
      ['level0 / dfd', '{ entities[], processes[{id}], stores[{id}], flows[] }', { en: 'flows use entity names and ids', vi: 'luồng dùng tên thực thể và id' }],
      ['conditions', '[{ name, values[] }]', { en: 'order matters for enumeration', vi: 'thứ tự quyết định cách liệt kê' }],
      ['rules', "[{ id, when: { cond: value | '-' }, action }]", { en: 'absent condition = any value', vi: 'vắng điều kiện = mọi giá trị' }],
    ],
  },
  chucNang: [
    { ten: { en: 'A. balance()', vi: 'A. balance()' }, diem: 2.5, yeuCau: [{ en: 'Multiset comparison of normalised external flows.', vi: 'So đa tập các luồng ngoài đã chuẩn hoá.' }], hook: ['DFD balancing'] },
    { ten: { en: 'B. dfdRules()', vi: 'B. dfdRules()' }, diem: 3, yeuCau: [{ en: 'All rule codes, sorted, no duplicates.', vi: 'Đủ mã lỗi, đã sắp, không trùng.' }], hook: ['DFD rules'] },
    { ten: { en: 'C. Gaps', vi: 'C. Lỗ hổng' }, diem: 2, yeuCau: [{ en: 'Every uncovered combination, in enumeration order.', vi: 'Mọi tổ hợp chưa phủ, đúng thứ tự.' }], hook: ['decision table'] },
    { ten: { en: 'D. Conflicts, redundancy, invalid', vi: 'D. Mâu thuẫn, trùng, không hợp lệ' }, diem: 1.5, yeuCau: [{ en: 'Different actions ⇒ conflict; same action ⇒ redundant.', vi: 'Khác hành động ⇒ mâu thuẫn; cùng hành động ⇒ trùng.' }], hook: ['decision table'] },
    { ten: { en: 'E. Robustness', vi: 'E. Độ bền' }, diem: 1, yeuCau: [{ en: 'Empty inputs, no mutation, tricky ids.', vi: 'Đầu vào rỗng, không sửa đầu vào, id đánh lừa.' }], hook: ['defensive code'] },
  ],
  idBatBuoc: [['balance', 'answers/balance.js'], ['dfdRules', 'answers/dfd-rules.js'], ['checkTable', 'answers/decision-table.js']],
  truDiem: [
    { en: 'Comparing flows as sets: a flow drawn twice in the context but once in level 0 is still a balancing error.', vi: 'So như tập: luồng vẽ hai lần ở ngữ cảnh mà một lần ở mức 0 vẫn là lỗi cân bằng.' },
    { en: 'Counting only legal flows when deciding black holes — the rules are independent.', vi: 'Chỉ đếm luồng hợp lệ khi xét hố đen — các luật độc lập nhau.' },
    { en: 'Treating "-" as a literal value instead of "any value".', vi: 'Coi "-" là một giá trị thay vì "mọi giá trị".' },
  ],
  goiY: [
    'A: dựng hai mảng khoá rồi "trừ đa tập": với mỗi khoá của mảng này, xoá một bản khớp ở mảng kia (indexOf + splice).',
    'B: lập bảng loại (E/P/S) theo tiền tố "#"+id để id "constructor" không đụng Object.prototype; đếm vào/ra cho mọi luồng.',
    'C/D: sinh tổ hợp bằng vòng lặp lồng (bắt đầu [[]], mỗi điều kiện nhân với các giá trị); với mỗi tổ hợp lọc luật khớp.',
  ],
  loiHayGap: [
    'Không chuẩn hoá nhãn ⇒ "Measurement" và "measurement" bị coi là khác.',
    'Coi luồng Doctor → D1 là đầu vào hợp lệ cho cân bằng (chỉ luồng thực thể ↔ tiến trình).',
    'Báo luật R7 (Member = Maybe) là mâu thuẫn thay vì invalid.',
  ],
  giaiThich: {
    en: '<p><b>MediLab findings.</b> Balancing: "result notification" to the Patient was renamed "SMS" in level 0, level 0 invented "claim decision" from the Insurer, and the sample now enters level 0 twice (P2 and P5) although the context shows it once — each must be fixed in one of the diagrams. DFD rules: P5 <i>Archive samples</i> is a black hole; the Doctor writes straight into D1 (entity → store) and D3 feeds D1 directly (store → store, unlabeled); D3 is read-only (no process ever maintains the price list). Decision table: four combinations have no rule (e.g. members under 500k); a non-member with a coupon over 1M is covered by R3 (3%) and R4 (5%) — a conflict; R1 and R6 overlap with the same action — redundant; R7 uses an unknown value. The reference solution is in the answer files.</p>',
    vi: '<p><b>Kết quả MediLab.</b> Cân bằng: "result notification" tới bệnh nhân bị đổi thành "SMS" ở mức 0, mức 0 tự thêm "claim decision" từ Insurer, và mẫu bệnh phẩm vào mức 0 hai lần (P2 và P5) trong khi ngữ cảnh chỉ có một — phải sửa ở một trong hai sơ đồ. Luật DFD: P5 là hố đen; Doctor ghi thẳng vào D1 (thực thể → kho), D3 đổ thẳng vào D1 (kho → kho, thiếu nhãn); D3 chỉ đọc (không tiến trình nào cập nhật bảng giá). Bảng quyết định: bốn tổ hợp chưa có luật; khách không phải hội viên có coupon trên 1M bị R3 (3%) và R4 (5%) cùng phủ — mâu thuẫn; R1 và R6 trùng cùng hành động; R7 dùng giá trị lạ. Lời giải tham chiếu ở các tệp đáp án.</p>',
  },
  khaiNiem: ['DFD balancing', 'DFD rules', 'decision table completeness'],
  tienQuyet: ['SWR302 lessons 4.8 (flow models) and 4.9 (decision models)'],
  thuatNgu: [...tn('dfd', 'balancing', 'blackHole', 'dataStore', 'decisionTable', 'contextDiagram'), { en: 'multiset', vi: 'đa tập — tập cho phép phần tử lặp' }],
  moTaNgan: 'Deep lab chương 4: bộ kiểm cân bằng DFD, luật DFD và bảng quyết định — chấm dữ liệu ẩn.',
  phut: 90,
  tep: TEP,
  kiem: KIEM,
  boYeu: [
    { ten: 'so như tập, không chuẩn hoá', tep: { 'answers/balance.js': "function balance(c,l){ var a={},b={}; c.flows.forEach(function(f){ if(f.to===c.system) a['IN '+f.from+': '+f.label]=1; else if(f.from===c.system) a['OUT '+f.to+': '+f.label]=1; }); var P={}; l.processes.forEach(function(p){P[p.id]=1;}); l.flows.forEach(function(f){ if(P[f.to]&&l.entities.indexOf(f.from)>=0) b['IN '+f.from+': '+f.label]=1; else if(P[f.from]&&l.entities.indexOf(f.to)>=0) b['OUT '+f.to+': '+f.label]=1; }); var m=Object.keys(a).filter(function(k){return !b[k];}).sort(), e=Object.keys(b).filter(function(k){return !a[k];}).sort(); return {balanced:!m.length&&!e.length,missing:m,extra:e}; }\n" }, phaiTruot: ['balance: MediLab sample'] },
    { ten: '"-" là giá trị thường', tep: { 'answers/decision-table.js': "function checkTable(conds, rules){ var combos=[[]]; conds.forEach(function(c){ var n=[]; combos.forEach(function(p){ c.values.forEach(function(v){ n.push(p.concat([v])); }); }); combos=n; }); var miss=[],con=[],red=[]; combos.forEach(function(cb){ var hit=rules.filter(function(r){ return conds.every(function(c,i){ var v=r.when[c.name]; return v===undefined||v===cb[i]; }); }); var t=conds.map(function(c,i){return c.name+'='+cb[i];}).join(', '); if(!hit.length) miss.push(t); else if(hit.length>1) con.push(t); }); return {missing:miss,conflicts:con,redundant:red,invalid:[]}; }\n" } },
  ],
});
