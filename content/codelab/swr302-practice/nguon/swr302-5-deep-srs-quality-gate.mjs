/**
 * SWR302 · DEEP LAB 5 — SRS quality gate: requirement linter, label checks, TBD register, release gate.
 */
import { tn } from './_chung.mjs';
import { deLon } from './_lab.mjs';
import { kiemCa, preJson } from './_deep.mjs';

const VAGUE = ['fast', 'quickly', 'user-friendly', 'easy', 'flexible', 'efficient', 'robust', 'appropriate', 'adequate', 'several', 'etc', 'and/or', 'support', 'normally', 'reasonable', 'seamless', 'state-of-the-art'];
const REQS = [
  { id: 'FR-1', type: 'FR', text: 'The system shall let a member borrow up to 5 e-books at the same time.' },
  { id: 'FR-2', type: 'FR', text: 'The system shall renew a loan and shall e-mail the member.' },
  { id: 'FR-3', type: 'FR', text: 'Overdue fines shall be calculated.' },
  { id: 'FR-4', type: 'FR', text: 'The system shall not allow members who have not paid fines to borrow.' },
  { id: 'NFR-1', type: 'NFR', text: 'Search shall be fast.' },
  { id: 'NFR-2', type: 'NFR', text: 'The system shall display search results within 2 seconds for 95% of searches.' },
  { id: 'FR-5', type: 'FR', text: 'The system shall charge a fine of TBD VND per day.' },
  { id: 'NFR-3', type: 'NFR', text: 'The system shall be available between 06:00 and 23:00.' },
  { id: 'FR-2', type: 'FR', text: 'The system shall support reservations.' },
  { id: 'fr_7', type: 'FR', text: 'The system shall export the loan history as CSV.' },
];
const TBDS = [{ reqId: 'FR-5', owner: 'Head librarian', due: '2026-11-15' }];

const G = `var __VAGUE = ${JSON.stringify(VAGUE)};
function __esc(w) { return w.replace(/[.*+?^\${}()|[\\]\\\\\\/-]/g, '\\\\$&'); }

function lint(req) {
  var t = String(req.text || ''), low = t.toLowerCase(), out = [];
  var shall = (t.match(/\\bshall\\b/gi) || []).length;
  if (shall === 0) out.push('NO_SHALL');
  if (shall > 1) out.push('MULTI_SHALL');
  if (__VAGUE.some(function (w) { return new RegExp('(^|[^a-z0-9-])' + __esc(w) + '(?![a-z0-9-])').test(low); })) out.push('VAGUE');
  if (/\\bshall be \\w+(ed|en)\\b/i.test(t)) out.push('PASSIVE');
  if (/\\bshall not\\b/i.test(t)) out.push('NEGATIVE');
  if (/TBD/.test(t)) out.push('TBD');
  if (/\\bbetween\\b/i.test(t)) out.push('BOUNDARY');
  if (req.type === 'NFR' && !/\\d/.test(t)) out.push('NO_NUMBER');
  return out.sort();
}

function gate(reqs, minCleanPct) {
  var seen = Object.create(null), dup = Object.create(null), byId = {}, badIds = [], clean = 0;
  reqs.forEach(function (r) {
    if (seen[r.id]) dup[r.id] = true; seen[r.id] = true;
    if (!/^(FR|NFR)-[1-9][0-9]*$/.test(r.id) || r.id.split('-')[0] !== r.type) { if (badIds.indexOf(r.id) < 0) badIds.push(r.id); }
    var c = lint(r);
    byId[r.id] = (byId[r.id] || []).concat(c).filter(function (x, i, a) { return a.indexOf(x) === i; }).sort();
    if (!c.length) clean++;
  });
  var pct = reqs.length ? Math.round(clean / reqs.length * 1000) / 10 : 100;
  var dups = Object.keys(dup).sort();
  return { byId: byId, duplicateIds: dups, badIds: badIds.sort(), cleanPct: pct, pass: pct >= minCleanPct && dups.length === 0 && badIds.length === 0 };
}

function tbdRegister(reqs, tbds) {
  var reg = Object.create(null), out = [];
  tbds.forEach(function (x) { reg[x.reqId] = x; });
  reqs.forEach(function (r) {
    if (!/TBD/.test(String(r.text || ''))) return;
    var e = reg[r.id];
    if (!e) out.push(r.id + ': not registered');
    else if (!String(e.owner || '').trim()) out.push(r.id + ': no owner');
    else if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(String(e.due || ''))) out.push(r.id + ': no due date');
  });
  return out;
}
`;
const D = `var REQS = ${JSON.stringify(REQS)}; var TBDS = ${JSON.stringify(TBDS)};\n`;
const GD = D + G;

const H_REQS = [
  { id: 'NFR-9', type: 'NFR', text: 'The page shall load in under 3 seconds, normally.' },
  { id: 'FR-10', type: 'FR', text: 'The system shall handle supported formats.' },
  { id: 'FR-11', type: 'FR', text: 'The receipt shall be written to the log and shall be signed.' },
  { id: 'NFR-10', type: 'NFR', text: 'The UI shall be state-of-the-art.' },
  { id: 'FR-12', type: 'FR', text: 'Reservations TBD.' },
  { id: 'FR-13', type: 'FR', text: 'The system SHALL e-mail the member, etc.' },
];

const CA = [
  { moTa: { en: 'lint: clean, compound and passive requirements', vi: 'lint: yêu cầu sạch, ghép và bị động' }, goi: 'REQS.slice(0, 3).map(lint)', mong: [[], ['MULTI_SHALL'], ['PASSIVE']], nhom: 'f1' },
  { moTa: { en: 'lint: negative, vague, number-less NFR', vi: 'lint: phủ định, mơ hồ, NFR không số' }, goi: '[lint(REQS[3]), lint(REQS[4]), lint(REQS[5])]', mong: [['NEGATIVE'], ['NO_NUMBER', 'VAGUE'], []], nhom: 'f1' },
  { moTa: { en: 'lint: TBD, boundary, support', vi: 'lint: TBD, biên, support' }, goi: '[lint(REQS[6]), lint(REQS[7]), lint(REQS[8])]', mong: [['TBD'], ['BOUNDARY'], ['VAGUE']], nhom: 'f2' },
  { moTa: { en: 'lint: no shall, passive, compound', vi: 'lint: không shall, bị động, ghép' }, goi: `[lint({ id: 'X', type: 'FR', text: 'The invoice shall be generated and shall be sent.' }), lint({ id: 'Y', type: 'FR', text: 'Members can renew loans.' })]`, mong: [['MULTI_SHALL', 'PASSIVE'], ['NO_SHALL']], nhom: 'f2' },
  { moTa: { en: 'lint (hidden): whole words, case, several problems', vi: 'lint (ẩn): nguyên từ, hoa thường, nhiều lỗi' }, goi: `${JSON.stringify(H_REQS)}.map(lint)`, nhom: 'f2', an: true },
  { moTa: { en: 'gate: duplicate and badly formed ids', vi: 'gate: id trùng và id sai định dạng' }, goi: '(function () { var g = gate(REQS, 80); return [g.duplicateIds, g.badIds]; })()', mong: [['FR-2'], ['fr_7']], nhom: 'f3' },
  { moTa: { en: 'gate: findings merged per id, clean %, decision', vi: 'gate: gộp lỗi theo id, % sạch, quyết định' }, goi: '(function () { var g = gate(REQS, 30); return [g.byId["FR-2"], g.cleanPct, g.pass]; })()', mong: [['MULTI_SHALL', 'VAGUE'], 30, false], nhom: 'f3' },
  { moTa: { en: 'gate (hidden): passes only when clean enough and ids are sound', vi: 'gate (ẩn): chỉ qua khi đủ sạch và id hợp lệ' }, goi: `[gate([{ id: 'FR-1', type: 'FR', text: 'The system shall print a receipt.' }, { id: 'NFR-1', type: 'NFR', text: 'The system shall print within 5 seconds.' }], 100).pass, gate([{ id: 'NFR-01', type: 'NFR', text: 'The system shall respond in 1 second.' }], 0).badIds, gate([{ id: 'FR-3', type: 'NFR', text: 'The system shall respond in 1 second.' }], 0).badIds, gate([], 90)]`, nhom: 'f3', an: true },
  { moTa: { en: 'tbdRegister: registered TBDs pass, others are listed', vi: 'tbdRegister: TBD đã đăng ký thì qua, còn lại liệt kê' }, goi: `[tbdRegister(REQS, TBDS), tbdRegister(REQS, [])]`, mong: [[], ['FR-5: not registered']], nhom: 'f4' },
  { moTa: { en: 'tbdRegister (hidden): owner and due date required', vi: 'tbdRegister (ẩn): bắt buộc người phụ trách và hạn' }, goi: `tbdRegister([{ id: 'A', text: 'x TBD' }, { id: 'B', text: 'TBD' }, { id: 'C', text: 'tbd' }, { id: 'D', text: 'y TBD' }], [{ reqId: 'A', owner: ' ', due: '2026-01-01' }, { reqId: 'B', owner: 'Lan', due: 'next week' }, { reqId: 'D', owner: 'Minh', due: '2026-12-01' }])`, nhom: 'f4', an: true },
  { moTa: { en: 'inputs are not modified', vi: 'không sửa đầu vào' }, goi: '(function () { var a = JSON.stringify(REQS); gate(REQS, 50); tbdRegister(REQS, TBDS); return a === JSON.stringify(REQS); })()', mong: true, nhom: 'f5' },
];
const KIEM = kiemCa(GD, CA);

const DATA = `// Sample data (read-only) — LibraNet SRS draft.\nconst VAGUE_WORDS = ${JSON.stringify(VAGUE)};\nconst REQS = ${JSON.stringify(REQS, null, 1)};\nconst TBDS = ${JSON.stringify(TBDS, null, 1)};\n`;
const TEP = {
  'answers/sample-data.js': [DATA, DATA],
  'answers/quality-gate.js': ["function lint(req) { return []; }\nfunction gate(reqs, minCleanPct) { return { byId: {}, duplicateIds: [], badIds: [], cleanPct: 0, pass: false }; }\nfunction tbdRegister(reqs, tbds) { return []; }\n", G],
};

export default deLon({
  slug: 'swr302-5-deep-srs-quality-gate',
  ten: 'Deep Lab 5 — SRS quality gate',
  moTaModule: 'Deep Lab chương 5: tự viết cổng chất lượng SRS — linter yêu cầu (không shall, nhiều shall, từ mơ hồ, bị động, phủ định, TBD, biên "between", NFR không số), kiểm nhãn (trùng, sai định dạng/loại), sổ TBD (người phụ trách, hạn) và quyết định qua cổng — chấm mẫu LibraNet + dữ liệu ẩn.',
  baiHoc: 'swr302-5-6-ch11-ambiguity',
  dangBai: 'deep-lab',
  tieuDe: 'Deep Lab 5 — SRS quality gate (linter, labels, TBD register)',
  phu: { en: 'Chapter 5 deep lab · automate the mechanical part of an SRS review · 10 marks · hidden data on Submit', vi: 'Deep lab chương 5 · tự động hoá phần máy móc của review SRS · 10 điểm · dữ liệu ẩn khi Nộp' },
  moTa: {
    en: `<p>Before a human inspection, the <b>LibraNet</b> team runs a quality gate on the SRS draft. Build it.</p>
<ul>
<li><b>A/B. <code>lint(req)</code></b> — sorted codes for one requirement <code>{ id, type, text }</code>: <code>NO_SHALL</code> (no whole word "shall", case-insensitive), <code>MULTI_SHALL</code> (more than one), <code>VAGUE</code> (any word of <code>VAGUE_WORDS</code> as a whole word, case-insensitive — a letter, digit or hyphen next to it means it is part of another word), <code>PASSIVE</code> ("shall be" + a word ending in -ed or -en), <code>NEGATIVE</code> ("shall not"), <code>TBD</code> (upper-case TBD), <code>BOUNDARY</code> (the word "between" — say whether endpoints are included), <code>NO_NUMBER</code> (an NFR without any digit).</li>
<li><b>C. <code>gate(reqs, minCleanPct)</code></b> — <code>{ byId, duplicateIds, badIds, cleanPct, pass }</code>: <code>byId[id]</code> = sorted, unique codes (merged when an id repeats); <code>duplicateIds</code> sorted; <code>badIds</code> = sorted ids not of the form <code>FR-n</code>/<code>NFR-n</code> (n a positive integer without leading zero) or whose prefix differs from the type; <code>cleanPct</code> = share of requirements (entries) with no code, 1 decimal (100 when empty); <code>pass</code> = cleanPct ≥ minCleanPct and no duplicate and no bad id.</li>
<li><b>D. <code>tbdRegister(reqs, tbds)</code></b> — every requirement whose text contains "TBD" needs a register entry with an owner (non-blank) and a due date (YYYY-MM-DD). In requirement order, report <code>"id: not registered"</code>, <code>"id: no owner"</code> or <code>"id: no due date"</code> (first problem only).</li>
</ul>
<p><b>Sample data</b>:</p>${preJson('VAGUE_WORDS', VAGUE)}${preJson('REQS', REQS)}${preJson('TBDS', TBDS)}`,
    vi: `<p>Trước buổi inspection, đội LibraNet chạy cổng chất lượng cho bản nháp SRS. Hãy viết nó.</p><ul><li>A/B. <code>lint</code> — NO_SHALL, MULTI_SHALL, VAGUE (nguyên từ), PASSIVE, NEGATIVE, TBD, BOUNDARY ("between"), NO_NUMBER (NFR không có chữ số).</li><li>C. <code>gate</code> — gộp lỗi theo id, id trùng, id sai định dạng/loại, % sạch, quyết định qua cổng.</li><li>D. <code>tbdRegister</code> — mỗi TBD phải được đăng ký với người phụ trách và hạn.</li></ul>`,
  },
  chucNangChinh: [{ en: 'A. Wording checks.', vi: 'A. Kiểm câu chữ.' }, { en: 'B. More wording checks.', vi: 'B. Kiểm câu chữ (tiếp).' }, { en: 'C. Label checks and the gate.', vi: 'C. Kiểm nhãn và cổng.' }, { en: 'D. TBD register.', vi: 'D. Sổ TBD.' }, { en: 'E. Inputs untouched.', vi: 'E. Không sửa đầu vào.' }],
  yeuCauChung: [{ en: 'Pure functions; whole-word matching.', vi: 'Hàm thuần; so nguyên từ.' }],
  cayThuMuc: `answers/
├── sample-data.js     ← VAGUE_WORDS, REQS, TBDS
└── quality-gate.js    ← lint, gate, tbdRegister`,
  moHinh: { ten: 'Data shapes', truong: [['requirement', "{ id, type: 'FR' | 'NFR', text }", { en: '', vi: '' }], ['TBD entry', '{ reqId, owner, due: "YYYY-MM-DD" }', { en: '', vi: '' }]] },
  chucNang: [
    { ten: { en: 'A. lint — shall, vague, NFR numbers', vi: 'A. lint — shall, mơ hồ, số của NFR' }, diem: 2.5, yeuCau: [{ en: 'NO_SHALL, MULTI_SHALL, VAGUE, NEGATIVE, NO_NUMBER.', vi: 'NO_SHALL, MULTI_SHALL, VAGUE, NEGATIVE, NO_NUMBER.' }], hook: ['writing requirements'] },
    { ten: { en: 'B. lint — TBD, boundary, passive', vi: 'B. lint — TBD, biên, bị động' }, diem: 2.5, yeuCau: [{ en: 'Whole-word matching.', vi: 'So nguyên từ.' }], hook: ['ambiguity'] },
    { ten: { en: 'C. gate', vi: 'C. gate' }, diem: 2.5, yeuCau: [{ en: 'Labels, duplicates, clean %, decision.', vi: 'Nhãn, trùng, % sạch, quyết định.' }], hook: ['labeling requirements'] },
    { ten: { en: 'D. tbdRegister', vi: 'D. tbdRegister' }, diem: 2, yeuCau: [{ en: 'Owner and due date.', vi: 'Người phụ trách và hạn.' }], hook: ['TBD'] },
    { ten: { en: 'E. Inputs untouched', vi: 'E. Không sửa đầu vào' }, diem: 0.5, yeuCau: [{ en: 'No mutation.', vi: 'Không sửa đầu vào.' }], hook: ['immutability'] },
  ],
  idBatBuoc: [['lint · gate · tbdRegister', 'answers/quality-gate.js']],
  truDiem: [
    { en: 'Using includes("support"): "supported formats" is not vague.', vi: 'Dùng includes("support"): "supported formats" không mơ hồ.' },
    { en: 'Counting the duplicate FR-2 once in cleanPct — the gate measures entries.', vi: 'Đếm FR-2 trùng một lần trong cleanPct — cổng đo theo dòng.' },
  ],
  goiY: ['Tạo RegExp cho từng từ mơ hồ với ranh giới tự định nghĩa (không chữ, số, gạch nối hai bên).', 'Nhãn: /^(FR|NFR)-[1-9][0-9]*$/ và tiền tố phải bằng type.'],
  loiHayGap: ['"state-of-the-art" không khớp vì \\b cắt ở dấu gạch nối.', 'Báo NO_NUMBER cho FR.'],
  giaiThich: {
    en: '<p>Only 3 of 10 entries are clean; FR-2 is used twice; "fr_7" breaks the labeling scheme; FR-5\u2019s TBD is properly registered with an owner and a due date. A gate like this does not replace the inspection — it clears the mechanical defects so that inspectors can focus on correctness and completeness.</p>',
    vi: '<p>Chỉ 3/10 dòng sạch; FR-2 dùng hai lần; "fr_7" sai quy tắc nhãn; TBD của FR-5 đã đăng ký đủ người phụ trách và hạn. Cổng này không thay inspection — nó dọn lỗi máy móc để inspector tập trung vào tính đúng và đủ.</p>',
  },
  khaiNiem: ['writing requirements', 'labeling requirements', 'TBD'],
  tienQuyet: ['Lab 5', 'SWR302 lessons 5.2–5.5'],
  thuatNgu: [...tn('ambiguous', 'tbd', 'verifiable', 'nfr')],
  moTaNgan: 'Deep lab chương 5: cổng chất lượng SRS — linter, nhãn, sổ TBD.',
  phut: 70,
  tep: TEP,
  kiem: KIEM,
  boYeu: [{ ten: 'includes thô, không kiểm nhãn', tep: { 'answers/quality-gate.js': "function lint(r){ var t=r.text.toLowerCase(), o=[]; var n=t.split('shall').length-1; if(!n) o.push('NO_SHALL'); if(n>1) o.push('MULTI_SHALL'); if(VAGUE_WORDS.some(function(w){return t.indexOf(w)>=0;})) o.push('VAGUE'); if(/shall be \\w+ed/.test(t)) o.push('PASSIVE'); if(t.indexOf('shall not')>=0) o.push('NEGATIVE'); if(r.text.indexOf('TBD')>=0) o.push('TBD'); if(t.indexOf('between')>=0) o.push('BOUNDARY'); if(r.type==='NFR'&&!/\\d/.test(t)) o.push('NO_NUMBER'); return o.sort(); }\nfunction gate(rs,m){ var b={},c=0; rs.forEach(function(r){ b[r.id]=lint(r); if(!b[r.id].length) c++; }); var p=rs.length?Math.round(c/rs.length*1000)/10:100; return {byId:b,duplicateIds:[],badIds:[],cleanPct:p,pass:p>=m}; }\nfunction tbdRegister(rs,ts){ return rs.filter(function(r){ return /TBD/.test(r.text)&&!ts.some(function(t){return t.reqId===r.id;}); }).map(function(r){return r.id+': not registered';}); }\n" } }],
});
