/**
 * SWR302 · DEEP LAB 1 — Requirement information model (Wiegers Figure 1-1) as a validator: levels, parents, cycles, gold plating.
 */
import { tn } from './_chung.mjs';
import { deLon } from './_lab.mjs';
import { kiemCa, preJson } from './_deep.mjs';

const RULES = { UR: ['BR'], FR: ['UR', 'SR', 'BRULE', 'NFR'], NFR: ['UR', 'BR'], SR: ['UR', 'BR'] };
const ITEMS = [
  { id: 'BR-1', kind: 'BR', parents: [] },
  { id: 'UR-1', kind: 'UR', parents: ['BR-1'] },
  { id: 'UR-2', kind: 'UR', parents: [] },
  { id: 'BRULE-1', kind: 'BRULE', parents: [] },
  { id: 'NFR-1', kind: 'NFR', parents: ['UR-1'] },
  { id: 'FR-1', kind: 'FR', parents: ['UR-1'] },
  { id: 'FR-2', kind: 'FR', parents: ['UR-1', 'BRULE-1'] },
  { id: 'FR-3', kind: 'FR', parents: ['NFR-1'] },
  { id: 'FR-4', kind: 'FR', parents: ['UR-2'] },
  { id: 'FR-5', kind: 'FR', parents: ['BR-1'] },
  { id: 'FR-6', kind: 'FR', parents: ['UR-9'] },
  { id: 'SR-1', kind: 'SR', parents: ['FR-7'] },
  { id: 'FR-7', kind: 'FR', parents: ['SR-1'] },
  { id: 'CON-1', kind: 'CONSTRAINT', parents: ['UR-1'] },
  { id: 'FR-1', kind: 'FR', parents: ['UR-1'] },
];

const G = `var __RULES = ${JSON.stringify(RULES)};
var __TOP = { BR: true, BRULE: true, CONSTRAINT: true };

function __map(items) { var m = Object.create(null); items.forEach(function (x) { if (!m[x.id]) m[x.id] = x; }); return m; }

function validate(items) {
  var by = __map(items), seen = Object.create(null), out = Object.create(null);
  items.forEach(function (x) { if (seen[x.id]) out['DUP_ID:' + x.id] = true; seen[x.id] = true; });
  Object.keys(by).forEach(function (id) {
    var x = by[id], ps = x.parents || [], allowed = __RULES[x.kind];
    var good = 0;
    ps.forEach(function (p) {
      if (!by[p]) { out['UNKNOWN_PARENT:' + id + '->' + p] = true; return; }
      var ok = allowed ? allowed.indexOf(by[p].kind) >= 0 : by[p].kind === 'BR';
      if (ok) good++; else out['BAD_PARENT:' + id + '->' + p] = true;
    });
    if (allowed && good === 0) out['NO_PARENT:' + id] = true;
  });
  Object.keys(by).forEach(function (id) {
    var stack = (by[id].parents || []).slice(), vis = Object.create(null);
    while (stack.length) {
      var p = stack.pop();
      if (p === id) { out['CYCLE:' + id] = true; break; }
      if (vis[p] || !by[p]) continue;
      vis[p] = true; stack.push.apply(stack, by[p].parents || []);
    }
  });
  return Object.keys(out).sort();
}

function ancestors(items, id) {
  var by = __map(items), vis = Object.create(null), q = by[id] ? (by[id].parents || []).slice() : [];
  while (q.length) {
    var p = q.shift();
    if (vis[p] || p === id || !by[p]) continue;
    vis[p] = true; q.push.apply(q, by[p].parents || []);
  }
  return Object.keys(vis).sort();
}

function goldPlating(items) {
  var by = __map(items);
  return Object.keys(by).filter(function (id) {
    return by[id].kind === 'FR' && !ancestors(items, id).some(function (a) { return by[a].kind === 'BR'; });
  }).sort();
}

function levelReport(items) {
  var by = __map(items), kinds = ['BR', 'UR', 'SR', 'NFR', 'FR', 'BRULE', 'CONSTRAINT'], counts = {};
  kinds.forEach(function (k) { counts[k] = 0; });
  Object.keys(by).forEach(function (id) { if (counts[by[id].kind] !== undefined) counts[by[id].kind]++; });
  var frFromUr = Object.keys(by).filter(function (id) { return by[id].kind === 'FR' && (by[id].parents || []).some(function (p) { return by[p] && by[p].kind === 'UR'; }); }).length;
  return { counts: counts, frPerUr: counts.UR ? Math.round(frFromUr / counts.UR * 10) / 10 : 0 };
}
`;
const D = `var ITEMS = ${JSON.stringify(ITEMS)};\n`;
const GD = D + G;

const H = [
  { id: 'BR-A', kind: 'BR', parents: ['UR-A'] }, { id: 'UR-A', kind: 'UR', parents: ['BR-A'] },
  { id: 'NFR-A', kind: 'NFR', parents: ['BR-A'] }, { id: 'FR-A', kind: 'FR', parents: ['NFR-A', 'FR-B'] },
  { id: 'FR-B', kind: 'FR', parents: ['toString'] }, { id: 'constructor', kind: 'UR', parents: ['BR-A'] }, { id: 'FR-C', kind: 'FR', parents: ['constructor'] },
];

const CA = [
  { moTa: { en: 'validate: missing and unknown parents', vi: 'validate: thiếu cha và cha lạ' }, goi: `validate(ITEMS).filter(function (c) { return /^(NO_PARENT|UNKNOWN_PARENT)/.test(c); })`, mong: ['NO_PARENT:FR-5', 'NO_PARENT:FR-6', 'NO_PARENT:SR-1', 'NO_PARENT:UR-2', 'UNKNOWN_PARENT:FR-6->UR-9'], nhom: 'f1' },
  { moTa: { en: 'validate: parents of the wrong level', vi: 'validate: cha sai cấp' }, goi: `validate(ITEMS).filter(function (c) { return /^BAD_PARENT/.test(c); })`, mong: ['BAD_PARENT:CON-1->UR-1', 'BAD_PARENT:FR-5->BR-1', 'BAD_PARENT:SR-1->FR-7'], nhom: 'f1' },
  { moTa: { en: 'validate: duplicate ids and cycles', vi: 'validate: trùng id và chu trình' }, goi: `validate(ITEMS).filter(function (c) { return /^(DUP_ID|CYCLE)/.test(c); })`, mong: ['CYCLE:FR-7', 'CYCLE:SR-1', 'DUP_ID:FR-1'], nhom: 'f2' },
  { moTa: { en: 'validate (hidden): mixed problems, tricky ids', vi: 'validate (ẩn): lỗi trộn, id đánh lừa' }, goi: `validate(${JSON.stringify(H)})`, nhom: 'f2', an: true },
  { moTa: { en: 'levelReport: counts and FRs per user requirement', vi: 'levelReport: số lượng và FR trên mỗi UR' }, goi: 'levelReport(ITEMS)', mong: { counts: { BR: 1, UR: 2, SR: 1, NFR: 1, FR: 7, BRULE: 1, CONSTRAINT: 1 }, frPerUr: 1.5 }, nhom: 'f3' },
  { moTa: { en: 'goldPlating: FRs that never reach a business requirement', vi: 'goldPlating: FR không bao giờ truy tới yêu cầu nghiệp vụ' }, goi: 'goldPlating(ITEMS)', mong: ['FR-4', 'FR-6', 'FR-7'], nhom: 'f4' },
  { moTa: { en: 'goldPlating (hidden): through NFRs, cycles, odd ids', vi: 'goldPlating (ẩn): qua NFR, chu trình, id lạ' }, goi: `goldPlating(${JSON.stringify(H)})`, nhom: 'f4', an: true },
  { moTa: { en: 'ancestors: everything above FR-3', vi: 'ancestors: mọi thứ phía trên FR-3' }, goi: `ancestors(ITEMS, 'FR-3')`, mong: ['BR-1', 'NFR-1', 'UR-1'], nhom: 'f5' },
  { moTa: { en: 'ancestors (hidden): cycles terminate', vi: 'ancestors (ẩn): chu trình vẫn dừng' }, goi: `[ancestors(ITEMS, 'FR-7'), ancestors(${JSON.stringify(H)}, 'FR-A')]`, nhom: 'f5', an: true },
  { moTa: { en: 'empty model', vi: 'mô hình rỗng' }, goi: '[validate([]), goldPlating([]), ancestors([], "X"), levelReport([]).frPerUr]', mong: [[], [], [], 0], nhom: 'f6' },
];
const KIEM = kiemCa(GD, CA);

const DATA = `// Sample model (read-only). Allowed parent kinds:\n// UR ← BR · FR ← UR, SR, BRULE, NFR · NFR ← UR, BR · SR ← UR, BR · BR, BRULE, CONSTRAINT: no parent needed (if present it must be BR)\nconst ITEMS = ${JSON.stringify(ITEMS, null, 1)};\n`;
const TEP = {
  'answers/sample-data.js': [DATA, DATA],
  'answers/hierarchy.js': ["function validate(items) { return []; }\nfunction ancestors(items, id) { return []; }\nfunction goldPlating(items) { return []; }\nfunction levelReport(items) { return { counts: {}, frPerUr: 0 }; }\n", G],
};

export default deLon({
  slug: 'swr302-1-deep-requirement-hierarchy',
  ten: 'Deep Lab 1 — Requirement information model validator',
  moTaModule: 'Deep Lab chương 1: biến Hình 1-1 của Wiegers thành bộ kiểm — cấp và loại yêu cầu, cha hợp lệ theo cấp, trùng id, chu trình, tổ tiên, FR "mạ vàng" không truy được tới yêu cầu nghiệp vụ, thống kê theo cấp — chấm dữ liệu mẫu + ẩn.',
  baiHoc: 'swr302-1-4-ch1-levels-types',
  dangBai: 'deep-lab',
  tieuDe: 'Deep Lab 1 — Requirement information model validator',
  phu: { en: 'Chapter 1 deep lab · Figure 1-1 as code · 10 marks · hidden data on Submit', vi: 'Deep lab chương 1 · Hình 1-1 thành mã · 10 điểm · dữ liệu ẩn khi Nộp' },
  moTa: {
    en: `<p>Wiegers’ Figure 1-1 links the levels of requirements: business requirements (BR) lead to user requirements (UR); functional requirements (FR) come from user requirements, system requirements (SR), business rules (BRULE) and quality attributes (NFR). Encode it as a validator. Allowed parent kinds:</p>
<ul><li>UR ← BR · FR ← UR, SR, BRULE, NFR · NFR ← UR, BR · SR ← UR, BR;</li><li>BR, BRULE and CONSTRAINT need no parent; if they have parents, those must be BR.</li></ul>
<ul>
<li><b>A/B. <code>validate(items)</code></b> — sorted, unique codes: <code>NO_PARENT:id</code> (a kind that needs a parent has no parent of an allowed kind), <code>BAD_PARENT:id-&gt;p</code>, <code>UNKNOWN_PARENT:id-&gt;p</code>, <code>DUP_ID:id</code> (id listed more than once — use the first occurrence everywhere), <code>CYCLE:id</code> (the item is its own ancestor).</li>
<li><b>C. <code>levelReport(items)</code></b> — <code>{ counts: { BR, UR, SR, NFR, FR, BRULE, CONSTRAINT }, frPerUr }</code>: number of distinct ids per kind; FRs that have at least one UR parent divided by the number of URs, 1 decimal (0 if no UR).</li>
<li><b>D. <code>goldPlating(items)</code></b> — sorted FR ids whose ancestors (following parents transitively, any kinds, unknown ids ignored) contain no BR: nobody can say which business objective they serve.</li>
<li><b>E. <code>ancestors(items, id)</code></b> — sorted ids of every known ancestor, never the item itself, terminating on cycles.</li>
</ul>
<p><b>Sample data</b> (StudyHub):</p>${preJson('ITEMS', ITEMS)}`,
    vi: `<p>Hình 1-1 nối các cấp yêu cầu. Mã hoá nó thành bộ kiểm với bảng cha hợp lệ: UR ← BR; FR ← UR, SR, BRULE, NFR; NFR ← UR, BR; SR ← UR, BR; BR/BRULE/CONSTRAINT không cần cha (nếu có thì phải là BR).</p>
<ul><li>A/B. <code>validate</code> — NO_PARENT, BAD_PARENT, UNKNOWN_PARENT, DUP_ID (dùng bản đầu tiên), CYCLE.</li><li>C. <code>levelReport</code> — đếm theo loại; số FR có cha UR chia số UR.</li><li>D. <code>goldPlating</code> — FR mà tổ tiên không có BR nào.</li><li>E. <code>ancestors</code> — mọi tổ tiên đã biết, dừng được khi có chu trình.</li></ul>`,
  },
  chucNangChinh: [
    { en: 'A. Parent rules.', vi: 'A. Luật cha.' }, { en: 'B. Duplicates and cycles.', vi: 'B. Trùng và chu trình.' },
    { en: 'C. Level report.', vi: 'C. Thống kê theo cấp.' }, { en: 'D. Gold plating.', vi: 'D. Mạ vàng.' }, { en: 'E. Ancestors.', vi: 'E. Tổ tiên.' }, { en: 'F. Empty model.', vi: 'F. Mô hình rỗng.' },
  ],
  yeuCauChung: [{ en: 'Pure functions; first occurrence wins for duplicate ids; ids such as "constructor" must work.', vi: 'Hàm thuần; id trùng lấy bản đầu; id như "constructor" phải chạy đúng.' }],
  cayThuMuc: `answers/
├── sample-data.js   ← ITEMS
└── hierarchy.js     ← validate, ancestors, goldPlating, levelReport`,
  moHinh: { ten: 'Data shapes', truong: [['item', '{ id, kind, parents[] }', { en: 'kind: BR UR SR NFR FR BRULE CONSTRAINT', vi: 'loại: BR UR SR NFR FR BRULE CONSTRAINT' }]] },
  chucNang: [
    { ten: { en: 'A. Parent rules', vi: 'A. Luật cha' }, diem: 2.5, yeuCau: [{ en: 'NO_PARENT, BAD_PARENT, UNKNOWN_PARENT.', vi: 'NO_PARENT, BAD_PARENT, UNKNOWN_PARENT.' }], hook: ['Figure 1-1'] },
    { ten: { en: 'B. Duplicates and cycles', vi: 'B. Trùng và chu trình' }, diem: 2, yeuCau: [{ en: 'DUP_ID, CYCLE.', vi: 'DUP_ID, CYCLE.' }], hook: ['graph'] },
    { ten: { en: 'C. levelReport', vi: 'C. levelReport' }, diem: 1.5, yeuCau: [{ en: 'Distinct ids per kind; FR per UR.', vi: 'Id khác nhau theo loại; FR/UR.' }], hook: ['levels'] },
    { ten: { en: 'D. goldPlating', vi: 'D. goldPlating' }, diem: 2, yeuCau: [{ en: 'No BR among the ancestors.', vi: 'Không có BR trong tổ tiên.' }], hook: ['gold plating'] },
    { ten: { en: 'E. ancestors', vi: 'E. ancestors' }, diem: 1.5, yeuCau: [{ en: 'Transitive, cycle-safe.', vi: 'Bắc cầu, an toàn chu trình.' }], hook: ['traceability'] },
    { ten: { en: 'F. Empty model', vi: 'F. Mô hình rỗng' }, diem: 0.5, yeuCau: [{ en: 'No crash.', vi: 'Không lỗi.' }], hook: ['defensive code'] },
  ],
  idBatBuoc: [['validate · ancestors · goldPlating · levelReport', 'answers/hierarchy.js']],
  truDiem: [
    { en: 'Accepting an FR whose only parent is a BR — it skips the user level (BAD_PARENT and NO_PARENT).', vi: 'Chấp nhận FR chỉ có cha BR — bỏ qua cấp người dùng (BAD_PARENT và NO_PARENT).' },
    { en: 'Looping forever on SR-1 ↔ FR-7.', vi: 'Lặp vô hạn ở SR-1 ↔ FR-7.' },
  ],
  goiY: ['Lập bảng id → mục bằng Object.create(null), giữ bản xuất hiện đầu.', 'Chu trình: duyệt tổ tiên từ id, nếu gặp lại chính id ⇒ CYCLE.', 'goldPlating dùng lại ancestors.'],
  loiHayGap: ['Coi CONSTRAINT có cha UR là hợp lệ.', 'Đếm FR-1 hai lần trong levelReport.'],
  giaiThich: {
    en: '<p>On StudyHub: UR-2 has no business requirement, so FR-4 below it is gold plating; FR-5 jumps straight from a business requirement (missing user level); FR-6 points to a requirement that no longer exists; SR-1 and FR-7 justify each other — a classic circular justification with no business reason. FR-3, derived from a quality attribute, is fine: it reaches BR-1 through NFR-1 and UR-1.</p>',
    vi: '<p>Trên StudyHub: UR-2 không có yêu cầu nghiệp vụ nên FR-4 bên dưới là mạ vàng; FR-5 nhảy thẳng từ yêu cầu nghiệp vụ (thiếu cấp người dùng); FR-6 trỏ tới yêu cầu không còn tồn tại; SR-1 và FR-7 biện minh cho nhau — vòng tròn không có lý do nghiệp vụ. FR-3 suy ra từ thuộc tính chất lượng là hợp lệ: nó truy tới BR-1 qua NFR-1 và UR-1.</p>',
  },
  khaiNiem: ['levels and types of requirements', 'gold plating'],
  tienQuyet: ['Lab 1', 'SWR302 lesson 1.2 (1.4 slides)'],
  thuatNgu: [...tn('businessReq', 'userReq', 'functionalReq', 'nfr', 'businessRule', 'constraint', 'goldPlating')],
  moTaNgan: 'Deep lab chương 1: bộ kiểm mô hình thông tin yêu cầu (Hình 1-1).',
  phut: 70,
  tep: TEP,
  kiem: KIEM,
  boYeu: [{ ten: 'không kiểm cấp cha, đệ quy không chặn chu trình', tep: { 'answers/hierarchy.js': "function validate(items){ var ids={},o=[]; items.forEach(function(x){ids[x.id]=1;}); items.forEach(function(x){ x.parents.forEach(function(p){ if(!ids[p]) o.push('UNKNOWN_PARENT:'+x.id+'->'+p); }); if(x.kind!=='BR'&&x.kind!=='BRULE'&&x.kind!=='CONSTRAINT'&&!x.parents.length) o.push('NO_PARENT:'+x.id); }); return o.sort(); }\nfunction ancestors(items,id){ var by={}; items.forEach(function(x){by[x.id]=x;}); var o=[]; (by[id]?by[id].parents:[]).forEach(function(p){ if(by[p]&&o.indexOf(p)<0) o.push(p); }); return o.sort(); }\nfunction goldPlating(items){ return items.filter(function(x){ return x.kind==='FR'&&!x.parents.length; }).map(function(x){return x.id;}); }\nfunction levelReport(items){ var c={BR:0,UR:0,SR:0,NFR:0,FR:0,BRULE:0,CONSTRAINT:0}; items.forEach(function(x){c[x.kind]++;}); return {counts:c,frPerUr:c.UR?Math.round(c.FR/c.UR*10)/10:0}; }\n" } }],
});
