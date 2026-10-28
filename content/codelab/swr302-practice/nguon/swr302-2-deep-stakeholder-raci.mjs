/**
 * SWR302 · DEEP LAB 2 — Stakeholder analysis tools: power/interest grid, RACI validation, decision rules (Wiegers Ch.2).
 */
import { tn } from './_chung.mjs';
import { deLon } from './_lab.mjs';
import { kiemCa, preJson } from './_deep.mjs';

const STAKEHOLDERS = [
  { name: 'Clinic owner', power: 5, interest: 4 },
  { name: 'Health ministry', power: 5, interest: 2 },
  { name: 'Patients', power: 2, interest: 5 },
  { name: 'Receptionists', power: 3, interest: 5 },
  { name: 'Cleaning staff', power: 1, interest: 1 },
  { name: 'Insurance partner', power: 3, interest: 2 },
  { name: 'Lab supplier', power: 0, interest: 3 },
];
const ACTIVITIES = ['Approve vision', 'Write use cases', 'Review SRS', 'Approve changes', 'Train users'];
const RACI = {
  'Approve vision': { 'Clinic owner': 'A', BA: 'R', 'Head doctor': 'C' },
  'Write use cases': { BA: 'RA', Receptionists: 'C', Patients: 'c' },
  'Review SRS': { BA: 'R', 'Head doctor': 'A', Developers: 'C', Testers: 'C', 'Clinic owner': 'A' },
  'Approve changes': { 'Clinic owner': 'I', BA: 'C', 'Project manager': 'C' },
  Retire: { BA: 'R' },
};

const G = `function grid(stakeholders) {
  var out = { manageClosely: [], keepSatisfied: [], keepInformed: [], monitor: [], invalid: [] };
  function ok(v) { return typeof v === 'number' && v >= 1 && v <= 5 && Math.floor(v) === v; }
  stakeholders.forEach(function (s) {
    if (!ok(s.power) || !ok(s.interest)) { out.invalid.push(s.name); return; }
    var p = s.power >= 3, i = s.interest >= 3;
    (p && i ? out.manageClosely : p ? out.keepSatisfied : i ? out.keepInformed : out.monitor).push(s.name);
  });
  Object.keys(out).forEach(function (k) { out[k].sort(); });
  return out;
}

function checkRaci(activities, matrix) {
  var out = Object.create(null);
  activities.forEach(function (a) {
    if (!Object.prototype.hasOwnProperty.call(matrix, a)) { out['MISSING:' + a] = true; return; }
    var row = matrix[a], nA = 0, nR = 0;
    Object.keys(row).forEach(function (person) {
      var cell = String(row[person]).toUpperCase();
      if (!/^[RACI]+$/.test(cell) || cell.split('').some(function (c, i) { return cell.indexOf(c) !== i; })) { out['BAD_CELL:' + a + '/' + person] = true; return; }
      if (cell.indexOf('A') >= 0) nA++;
      if (cell.indexOf('R') >= 0) nR++;
    });
    if (nA === 0) out['NO_A:' + a] = true;
    if (nA > 1) out['MULTI_A:' + a] = true;
    if (nR === 0) out['NO_R:' + a] = true;
  });
  Object.keys(matrix).forEach(function (a) { if (activities.indexOf(a) < 0) out['EXTRA:' + a] = true; });
  return Object.keys(out).sort();
}

function decide(votes, rule) {
  var cast = votes.filter(function (v) { return v.vote === 'yes' || v.vote === 'no'; });
  var yes = cast.filter(function (v) { return v.vote === 'yes'; }).length, no = cast.length - yes;
  if (rule.type === 'unanimous') return cast.length && no === 0 ? 'approved' : no > 0 ? 'rejected' : 'no decision';
  if (rule.type === 'majority') return yes > no ? 'approved' : no > yes ? 'rejected' : 'no decision';
  if (rule.type === 'leader') {
    var l = votes.filter(function (v) { return v.person === rule.leader; })[0];
    return l && l.vote === 'yes' ? 'approved' : l && l.vote === 'no' ? 'rejected' : 'no decision';
  }
  return 'no decision';
}
`;
const D = `var STAKEHOLDERS = ${JSON.stringify(STAKEHOLDERS)}; var ACTIVITIES = ${JSON.stringify(ACTIVITIES)}; var RACI = ${JSON.stringify(RACI)};\n`;
const GD = D + G;

const VOTES = [{ person: 'Owner', vote: 'no' }, { person: 'BA', vote: 'yes' }, { person: 'Doctor', vote: 'yes' }, { person: 'IT', vote: 'abstain' }];

const CA = [
  { moTa: { en: 'grid: the four quadrants', vi: 'grid: bốn ô' }, goi: 'grid(STAKEHOLDERS)', mong: { manageClosely: ['Clinic owner', 'Receptionists'], keepSatisfied: ['Health ministry', 'Insurance partner'], keepInformed: ['Patients'], monitor: ['Cleaning staff'], invalid: ['Lab supplier'] }, nhom: 'f1' },
  { moTa: { en: 'grid (hidden): boundaries at 3, non-integer scores', vi: 'grid (ẩn): biên ở 3, điểm không nguyên' }, goi: `grid([{ name: 'b', power: 3, interest: 3 }, { name: 'a', power: 2, interest: 3 }, { name: 'c', power: 3, interest: 2.5 }, { name: 'd', power: '5', interest: 5 }, { name: 'e', power: 1, interest: 2 }])`, nhom: 'f1', an: true },
  { moTa: { en: 'checkRaci: ClinicCare matrix', vi: 'checkRaci: ma trận ClinicCare' }, goi: 'checkRaci(ACTIVITIES, RACI)', mong: ['EXTRA:Retire', 'MISSING:Train users', 'MULTI_A:Review SRS', 'NO_A:Approve changes', 'NO_R:Approve changes'], nhom: 'f2' },
  { moTa: { en: 'checkRaci: a correct row has no problem; "RA" counts as both', vi: 'checkRaci: dòng đúng không lỗi; "RA" tính cả hai' }, goi: `checkRaci(['X'], { X: { p: 'RA', q: 'i', r: 'C' } })`, mong: [], nhom: 'f2' },
  { moTa: { en: 'checkRaci (hidden): bad cells, repeated letters, tricky names', vi: 'checkRaci (ẩn): ô sai, chữ lặp, tên đánh lừa' }, goi: `checkRaci(['toString', 'Y'], { toString: { a: 'R', b: 'AA', c: 'X' }, Y: { d: 'A', e: '' } })`, nhom: 'f2', an: true },
  { moTa: { en: 'decide: majority, unanimous and leader rules', vi: 'decide: quy tắc đa số, nhất trí, trưởng nhóm' }, goi: `[decide(${JSON.stringify(VOTES)}, { type: 'majority' }), decide(${JSON.stringify(VOTES)}, { type: 'unanimous' }), decide(${JSON.stringify(VOTES)}, { type: 'leader', leader: 'Owner' })]`, mong: ['approved', 'rejected', 'rejected'], nhom: 'f3' },
  { moTa: { en: 'decide (hidden): ties, abstentions, absent leader', vi: 'decide (ẩn): hoà, phiếu trắng, trưởng nhóm vắng' }, goi: `[decide([{ person: 'a', vote: 'yes' }, { person: 'b', vote: 'no' }], { type: 'majority' }), decide([{ person: 'a', vote: 'abstain' }], { type: 'unanimous' }), decide([{ person: 'a', vote: 'yes' }], { type: 'leader', leader: 'z' }), decide([], { type: 'vote-by-loudness' })]`, nhom: 'f3', an: true },
  { moTa: { en: 'inputs are not modified', vi: 'không sửa đầu vào' }, goi: `(function () { var a = JSON.stringify([STAKEHOLDERS, RACI]); grid(STAKEHOLDERS); checkRaci(ACTIVITIES, RACI); return a === JSON.stringify([STAKEHOLDERS, RACI]); })()`, mong: true, nhom: 'f4' },
];
const KIEM = kiemCa(GD, CA);

const DATA = `// Sample data (read-only) — ClinicCare.\nconst STAKEHOLDERS = ${JSON.stringify(STAKEHOLDERS, null, 1)};\nconst ACTIVITIES = ${JSON.stringify(ACTIVITIES)};\nconst RACI = ${JSON.stringify(RACI, null, 1)};\n`;
const TEP = {
  'answers/sample-data.js': [DATA, DATA],
  'answers/stakeholders.js': ["function grid(stakeholders) { return { manageClosely: [], keepSatisfied: [], keepInformed: [], monitor: [], invalid: [] }; }\nfunction checkRaci(activities, matrix) { return []; }\nfunction decide(votes, rule) { return 'no decision'; }\n", G],
};

export default deLon({
  slug: 'swr302-2-deep-stakeholder-raci',
  ten: 'Deep Lab 2 — Stakeholder grid, RACI and decision rules',
  moTaModule: 'Deep Lab chương 2: tự viết công cụ phân tích bên liên quan — lưới quyền lực/quan tâm, kiểm ma trận RACI (đúng một A, ít nhất một R, ô sai, hoạt động thiếu/thừa) và áp quy tắc ra quyết định (nhất trí, đa số, trưởng nhóm) — chấm mẫu ClinicCare + dữ liệu ẩn.',
  baiHoc: 'swr302-2-5-ch2-agreement',
  dangBai: 'deep-lab',
  tieuDe: 'Deep Lab 2 — Stakeholder grid, RACI and decision rules',
  phu: { en: 'Chapter 2 deep lab · who to involve and who decides · 10 marks · hidden data on Submit', vi: 'Deep lab chương 2 · ai tham gia và ai quyết · 10 điểm · dữ liệu ẩn khi Nộp' },
  moTa: {
    en: `<p>Wiegers Ch.2: identify the decision makers and agree on a decision rule <i>before</i> conflicts arise. Build three small tools for the <b>ClinicCare</b> BA.</p>
<ul>
<li><b>A. <code>grid(stakeholders)</code></b> — power and interest are integers 1–5; "high" means ≥ 3. Return <code>{ manageClosely, keepSatisfied, keepInformed, monitor, invalid }</code> (high/high, high power, high interest, low/low; invalid scores), each sorted.</li>
<li><b>B. <code>checkRaci(activities, matrix)</code></b> — <code>matrix[activity][person]</code> is a cell of letters from R, A, C, I (case-insensitive, each letter at most once, e.g. "RA"). Sorted, unique codes: <code>MISSING:act</code> (activity without a row), <code>EXTRA:act</code> (row for an unlisted activity), <code>BAD_CELL:act/person</code> (empty, other letters or repeated letters — the cell is then ignored), <code>NO_A:act</code>, <code>MULTI_A:act</code> (exactly one person must be Accountable), <code>NO_R:act</code> (someone must be Responsible).</li>
<li><b>C. <code>decide(votes, rule)</code></b> — votes are "yes", "no" or "abstain" (abstentions ignored). <code>unanimous</code>: approved if at least one yes and no "no", rejected if any "no", otherwise no decision; <code>majority</code>: more yes than no ⇒ approved, more no ⇒ rejected, tie ⇒ no decision; <code>leader</code>: the leader’s vote decides (abstain or absent ⇒ no decision); unknown rule ⇒ no decision.</li>
</ul>
<p><b>Sample data</b>:</p>${preJson('STAKEHOLDERS', STAKEHOLDERS)}${preJson('ACTIVITIES', ACTIVITIES)}${preJson('RACI', RACI)}`,
    vi: `<p>Wiegers Ch.2: xác định người quyết định và thống nhất quy tắc ra quyết định <i>trước</i> khi có xung đột. Viết ba công cụ cho BA của ClinicCare.</p>
<ul><li>A. <code>grid</code> — lưới quyền lực/quan tâm ("cao" ≥ 3), điểm sai ⇒ invalid.</li><li>B. <code>checkRaci</code> — MISSING, EXTRA, BAD_CELL, NO_A, MULTI_A, NO_R.</li><li>C. <code>decide</code> — nhất trí, đa số, trưởng nhóm; phiếu trắng bị bỏ qua.</li></ul>`,
  },
  chucNangChinh: [{ en: 'A. Power/interest grid.', vi: 'A. Lưới quyền lực/quan tâm.' }, { en: 'B. RACI validation.', vi: 'B. Kiểm RACI.' }, { en: 'C. Decision rules.', vi: 'C. Quy tắc ra quyết định.' }, { en: 'D. Inputs untouched.', vi: 'D. Không sửa đầu vào.' }],
  yeuCauChung: [{ en: 'Pure functions; activity names such as "toString" must work.', vi: 'Hàm thuần; tên hoạt động như "toString" phải chạy đúng.' }],
  cayThuMuc: `answers/
├── sample-data.js     ← STAKEHOLDERS, ACTIVITIES, RACI
└── stakeholders.js    ← grid, checkRaci, decide`,
  moHinh: { ten: 'Data shapes', truong: [
    ['stakeholder', '{ name, power, interest }', { en: 'integers 1–5', vi: 'số nguyên 1–5' }],
    ['RACI', '{ activity: { person: "R" | "A" | "C" | "I" | "RA" … } }', { en: 'case-insensitive', vi: 'không phân biệt hoa thường' }],
    ['vote / rule', "{ person, vote } / { type: 'unanimous' | 'majority' | 'leader', leader? }", { en: '', vi: '' }],
  ] },
  chucNang: [
    { ten: { en: 'A. grid', vi: 'A. grid' }, diem: 2.5, yeuCau: [{ en: 'Four quadrants and invalid scores.', vi: 'Bốn ô và điểm sai.' }], hook: ['stakeholder analysis'] },
    { ten: { en: 'B. checkRaci', vi: 'B. checkRaci' }, diem: 4, yeuCau: [{ en: 'All problem codes.', vi: 'Đủ mã lỗi.' }], hook: ['RACI'] },
    { ten: { en: 'C. decide', vi: 'C. decide' }, diem: 3, yeuCau: [{ en: 'Three decision rules.', vi: 'Ba quy tắc ra quyết định.' }], hook: ['decision rules'] },
    { ten: { en: 'D. Inputs untouched', vi: 'D. Không sửa đầu vào' }, diem: 0.5, yeuCau: [{ en: 'No mutation.', vi: 'Không sửa đầu vào.' }], hook: ['immutability'] },
  ],
  idBatBuoc: [['grid · checkRaci · decide', 'answers/stakeholders.js']],
  truDiem: [
    { en: 'Allowing two Accountable people — accountability that is shared is accountability nobody has.', vi: 'Cho hai người Accountable — trách nhiệm chia đôi là không ai chịu trách nhiệm.' },
    { en: 'Counting abstentions as "no".', vi: 'Coi phiếu trắng là "no".' },
  ],
  goiY: ['RACI: kiểm ô bằng /^[RACI]+$/ sau khi viết hoa, và không có chữ lặp.', 'Đa số: chỉ đếm yes/no.'],
  loiHayGap: ['Đọc matrix["toString"] mà không dùng hasOwnProperty.', 'Bỏ sót hoạt động "Train users" không có dòng.'],
  giaiThich: {
    en: '<p>On ClinicCare: the clinic owner and receptionists must be managed closely; the ministry and the insurer kept satisfied. In the RACI, "Review SRS" has two accountable people, "Approve changes" has nobody responsible or accountable (the owner is only informed — a recipe for change requests nobody approves), "Train users" is missing and "Retire" is not a listed activity.</p>',
    vi: '<p>Trên ClinicCare: chủ phòng khám và lễ tân cần quản lý sát; bộ y tế và đối tác bảo hiểm cần giữ hài lòng. Trong RACI, "Review SRS" có hai người Accountable, "Approve changes" không ai R hay A (chủ phòng khám chỉ được thông báo — CR sẽ không ai duyệt), thiếu "Train users" và thừa "Retire".</p>',
  },
  khaiNiem: ['stakeholder analysis', 'RACI', 'decision rules'],
  tienQuyet: ['Lab 2', 'SWR302 lessons 2.1 and 2.5'],
  thuatNgu: [...tn('stakeholder', 'raci')],
  moTaNgan: 'Deep lab chương 2: lưới bên liên quan, RACI, quy tắc quyết định.',
  phut: 60,
  tep: TEP,
  kiem: KIEM,
  boYeu: [{ ten: 'cho nhiều A, phiếu trắng = no', tep: { 'answers/stakeholders.js': `${G.split('function checkRaci')[0]}function checkRaci(acts, m){ var o=[]; acts.forEach(function(a){ if(!m[a]){ o.push('MISSING:'+a); return; } var hasA=false, hasR=false; Object.keys(m[a]).forEach(function(p){ var c=m[a][p].toUpperCase(); if(c.indexOf('A')>=0) hasA=true; if(c.indexOf('R')>=0) hasR=true; }); if(!hasA) o.push('NO_A:'+a); if(!hasR) o.push('NO_R:'+a); }); return o.sort(); }
function decide(v, r){ var y=v.filter(function(x){return x.vote==='yes';}).length, n=v.length-y; if(r.type==='majority') return y>n?'approved':n>y?'rejected':'no decision'; if(r.type==='unanimous') return n===0&&y>0?'approved':'rejected'; var l=v.filter(function(x){return x.person===r.leader;})[0]; return l?(l.vote==='yes'?'approved':'rejected'):'no decision'; }
` } }],
});
