/**
 * SWR302 · DEEP LAB 7 — Traceability engine: RTM rows, coverage, suspect links after a change, impact, clearing a suspect link.
 */
import { tn } from './_chung.mjs';
import { deLon } from './_lab.mjs';
import { kiemCa, preJson } from './_deep.mjs';

const ITEMS = [
  { id: 'BR-1', type: 'BR', version: 1, title: 'Cut reception phone calls by 40%' },
  { id: 'UR-1', type: 'UR', version: 2, title: 'Patient books an appointment online' },
  { id: 'UR-2', type: 'UR', version: 1, title: 'Patient cancels an appointment online' },
  { id: 'FR-10', type: 'FR', version: 3, title: 'Show free slots of a doctor' },
  { id: 'FR-11', type: 'FR', version: 1, title: 'Reserve a slot' },
  { id: 'FR-12', type: 'FR', version: 2, title: 'Cancel up to 2 hours before' },
  { id: 'FR-13', type: 'FR', version: 1, title: 'Export bookings to Excel' },
  { id: 'NFR-1', type: 'NFR', version: 1, title: 'Slots appear within 2 s' },
  { id: 'DES-4', type: 'DES', version: 1, title: 'SlotService' },
  { id: 'DES-5', type: 'DES', version: 1, title: 'BookingService' },
  { id: 'CODE-7', type: 'CODE', version: 4, title: 'slot.controller.ts' },
  { id: 'CODE-8', type: 'CODE', version: 2, title: 'booking.controller.ts' },
  { id: 'TC-20', type: 'TEST', version: 1, title: 'free slots listed' },
  { id: 'TC-21', type: 'TEST', version: 1, title: 'reserve a free slot' },
  { id: 'TC-22', type: 'TEST', version: 2, title: 'cancel 3 h before' },
  { id: 'TC-23', type: 'TEST', version: 1, title: 'slots within 2 s' },
];
const LINKS = [
  { from: 'BR-1', to: 'UR-1', fromVersion: 1 }, { from: 'BR-1', to: 'UR-2', fromVersion: 1 },
  { from: 'UR-1', to: 'FR-10', fromVersion: 1 }, { from: 'UR-1', to: 'FR-11', fromVersion: 2 }, { from: 'UR-2', to: 'FR-12', fromVersion: 1 },
  { from: 'UR-1', to: 'NFR-1', fromVersion: 2 },
  { from: 'FR-10', to: 'DES-4', fromVersion: 3 }, { from: 'FR-11', to: 'DES-5', fromVersion: 1 }, { from: 'FR-12', to: 'DES-5', fromVersion: 1 },
  { from: 'DES-4', to: 'CODE-7', fromVersion: 1 }, { from: 'DES-5', to: 'CODE-8', fromVersion: 1 },
  { from: 'FR-10', to: 'TC-20', fromVersion: 2 }, { from: 'FR-11', to: 'TC-21', fromVersion: 1 }, { from: 'FR-12', to: 'TC-22', fromVersion: 2 },
  { from: 'NFR-1', to: 'TC-23', fromVersion: 1 },
  { from: 'FR-13', to: 'CODE-9', fromVersion: 1 },
];

const G = `function __bang(items) { var m = Object.create(null); items.forEach(function (x) { m[x.id] = x; }); return m; }
function __sx(a) { return a.slice().sort(); }

function buildRtm(items, links) {
  var by = __bang(items);
  return items.filter(function (x) { return x.type === 'FR' || x.type === 'NFR'; }).map(function (r) {
    var row = { id: r.id, sources: [], design: [], code: [], tests: [] };
    links.forEach(function (l) {
      if (l.to === r.id && by[l.from] && (by[l.from].type === 'UR' || by[l.from].type === 'BR')) row.sources.push(l.from);
      if (l.from === r.id && by[l.to]) {
        var t = by[l.to].type;
        if (t === 'DES') row.design.push(l.to); else if (t === 'CODE') row.code.push(l.to); else if (t === 'TEST') row.tests.push(l.to);
      }
    });
    row.sources = __sx(row.sources); row.design = __sx(row.design); row.code = __sx(row.code); row.tests = __sx(row.tests);
    return row;
  }).sort(function (a, b) { return a.id < b.id ? -1 : a.id > b.id ? 1 : 0; });
}

function coverage(items, links) {
  var rows = buildRtm(items, links);
  var tested = rows.filter(function (r) { return r.tests.length > 0; });
  return {
    total: rows.length,
    tested: tested.length,
    pct: rows.length ? Math.round(tested.length / rows.length * 1000) / 10 : 0,
    untested: rows.filter(function (r) { return !r.tests.length; }).map(function (r) { return r.id; }),
    orphans: rows.filter(function (r) { return !r.sources.length; }).map(function (r) { return r.id; }),
  };
}

function suspect(items, links) {
  var by = __bang(items);
  return links.filter(function (l) { return by[l.from] && by[l.from].version > l.fromVersion; })
    .map(function (l) { return l.from + '->' + l.to; }).sort();
}

function impactOf(items, links, changedId) {
  var by = __bang(items), seen = Object.create(null), q = [changedId], out = Object.create(null);
  seen[changedId] = true;
  while (q.length) {
    var cur = q.shift();
    links.forEach(function (l) {
      if (l.from !== cur || seen[l.to]) return;
      seen[l.to] = true; q.push(l.to);
      var t = by[l.to] ? by[l.to].type : 'UNKNOWN';
      (out[t] = out[t] || []).push(l.to);
    });
  }
  var res = {};
  Object.keys(out).sort().forEach(function (t) { res[t] = out[t].sort(); });
  return res;
}

function clearSuspect(items, links, from, to) {
  var by = __bang(items);
  return links.map(function (l) {
    if (l.from === from && l.to === to && by[from]) return { from: l.from, to: l.to, fromVersion: by[from].version };
    return { from: l.from, to: l.to, fromVersion: l.fromVersion };
  });
}
`;
const D = `var ITEMS = ${JSON.stringify(ITEMS)}; var LINKS = ${JSON.stringify(LINKS)};\n`;
const GD = D + G;

const H_ITEMS = [
  { id: 'A', type: 'UR', version: 5 }, { id: 'B', type: 'FR', version: 1 }, { id: 'C', type: 'FR', version: 2 }, { id: 'D', type: 'TEST', version: 1 },
  { id: 'E', type: 'DES', version: 1 }, { id: 'toString', type: 'NFR', version: 1 }, { id: 'F', type: 'BR', version: 2 },
];
const H_LINKS = [
  { from: 'A', to: 'B', fromVersion: 5 }, { from: 'B', to: 'C', fromVersion: 1 }, { from: 'C', to: 'D', fromVersion: 1 }, { from: 'C', to: 'B', fromVersion: 2 },
  { from: 'B', to: 'E', fromVersion: 0 }, { from: 'F', to: 'toString', fromVersion: 2 }, { from: 'D', to: 'B', fromVersion: 1 }, { from: 'X', to: 'C', fromVersion: 1 },
];

const CA = [
  { moTa: { en: 'buildRtm: the row of FR-10', vi: 'buildRtm: dòng của FR-10' }, goi: `buildRtm(ITEMS, LINKS).filter(function (r) { return r.id === 'FR-10'; })[0]`, mong: { id: 'FR-10', sources: ['UR-1'], design: ['DES-4'], code: [], tests: ['TC-20'] }, nhom: 'f1' },
  { moTa: { en: 'buildRtm: all rows, sorted by id', vi: 'buildRtm: mọi dòng, sắp theo id' }, goi: 'buildRtm(ITEMS, LINKS)', nhom: 'f1' },
  { moTa: { en: 'buildRtm (hidden): only UR/BR count as sources; unknown items ignored', vi: 'buildRtm (ẩn): chỉ UR/BR là nguồn; mục lạ bỏ qua' }, goi: `buildRtm(${JSON.stringify(H_ITEMS)}, ${JSON.stringify(H_LINKS)})`, nhom: 'f1', an: true },
  { moTa: { en: 'coverage on the sample', vi: 'coverage trên mẫu' }, goi: 'coverage(ITEMS, LINKS)', mong: { total: 5, tested: 4, pct: 80, untested: ['FR-13'], orphans: ['FR-13'] }, nhom: 'f2' },
  { moTa: { en: 'coverage of an empty project', vi: 'coverage của dự án rỗng' }, goi: 'coverage([], [])', mong: { total: 0, tested: 0, pct: 0, untested: [], orphans: [] }, nhom: 'f2' },
  { moTa: { en: 'coverage (hidden): one decimal, tricky ids', vi: 'coverage (ẩn): một chữ số thập phân, id đánh lừa' }, goi: `coverage(${JSON.stringify(H_ITEMS)}, ${JSON.stringify(H_LINKS)})`, nhom: 'f2', an: true },
  { moTa: { en: 'suspect links after UR-1 v2 and FR-10 v3', vi: 'liên kết nghi vấn sau UR-1 v2 và FR-10 v3' }, goi: 'suspect(ITEMS, LINKS)', mong: ['FR-10->TC-20', 'FR-12->DES-5', 'UR-1->FR-10'], nhom: 'f3' },
  { moTa: { en: 'suspect (hidden): links from unknown items are not suspect', vi: 'suspect (ẩn): liên kết từ mục lạ không nghi vấn' }, goi: `suspect(${JSON.stringify(H_ITEMS)}, ${JSON.stringify(H_LINKS)})`, nhom: 'f3', an: true },
  { moTa: { en: 'impactOf UR-1, grouped by type', vi: 'impactOf UR-1, nhóm theo loại' }, goi: `impactOf(ITEMS, LINKS, 'UR-1')`, mong: { CODE: ['CODE-7', 'CODE-8'], DES: ['DES-4', 'DES-5'], FR: ['FR-10', 'FR-11'], NFR: ['NFR-1'], TEST: ['TC-20', 'TC-21', 'TC-23'] }, nhom: 'f4' },
  { moTa: { en: 'impactOf FR-13: unknown downstream items are reported as UNKNOWN', vi: 'impactOf FR-13: mục lạ phía sau ghi là UNKNOWN' }, goi: `impactOf(ITEMS, LINKS, 'FR-13')`, mong: { UNKNOWN: ['CODE-9'] }, nhom: 'f4' },
  { moTa: { en: 'impactOf (hidden): cycles do not loop and the changed item is excluded', vi: 'impactOf (ẩn): chu trình không lặp, không gồm mục bị đổi' }, goi: `impactOf(${JSON.stringify(H_ITEMS)}, ${JSON.stringify(H_LINKS)}, 'A')`, nhom: 'f4', an: true },
  { moTa: { en: 'clearSuspect: UR-1->FR-10 is no longer suspect', vi: 'clearSuspect: UR-1->FR-10 hết nghi vấn' }, goi: `suspect(ITEMS, clearSuspect(ITEMS, LINKS, 'UR-1', 'FR-10'))`, nhom: 'f5' },
  { moTa: { en: 'clearSuspect does not modify LINKS', vi: 'clearSuspect không sửa LINKS' }, goi: `(function () { var a = JSON.stringify(LINKS); clearSuspect(ITEMS, LINKS, 'UR-1', 'FR-10'); return a === JSON.stringify(LINKS); })()`, mong: true, nhom: 'f5' },
  { moTa: { en: 'hidden: clearing a link that does not exist changes nothing', vi: 'ẩn: xoá nghi vấn cho liên kết không có thì không đổi gì' }, goi: `JSON.stringify(clearSuspect(ITEMS, LINKS, 'UR-9', 'FR-10')) === JSON.stringify(LINKS)`, mong: true, nhom: 'f5', an: true },
];
const KIEM = kiemCa(GD, CA);

const DATA = `// Sample data (read-only). links: "to" was derived from "from" when "from" had version fromVersion.\nconst ITEMS = ${JSON.stringify(ITEMS, null, 1)};\nconst LINKS = ${JSON.stringify(LINKS, null, 1)};\n`;
const TEP = {
  'answers/sample-data.js': [DATA, DATA],
  'answers/rtm.js': [`// Write all five functions here.
function buildRtm(items, links) { return []; }
function coverage(items, links) { return { total: 0, tested: 0, pct: 0, untested: [], orphans: [] }; }
function suspect(items, links) { return []; }
function impactOf(items, links, changedId) { return {}; }
function clearSuspect(items, links, from, to) { return links; }
`, G],
};

export default deLon({
  slug: 'swr302-7-deep-rtm-engine',
  ten: 'Deep Lab 7 — Traceability engine with suspect links',
  moTaModule: 'Deep Lab chương 7: tự viết động cơ truy vết — dựng RTM cho FR/NFR, độ phủ test và yêu cầu mồ côi, liên kết nghi vấn (suspect) khi mục phía trên đổi phiên bản, phân tích ảnh hưởng nhóm theo loại (có chu trình), xoá nghi vấn sau khi rà — chấm mẫu ClinicCare + dữ liệu ẩn.',
  baiHoc: 'swr302-7-2-traceability',
  dangBai: 'deep-lab',
  tieuDe: 'Deep Lab 7 — Traceability engine with suspect links',
  phu: { en: 'Chapter 7 deep lab · RTM, coverage, suspect links, impact · 10 marks · hidden data on Submit', vi: 'Deep lab chương 7 · RTM, độ phủ, liên kết nghi vấn, ảnh hưởng · 10 điểm · dữ liệu ẩn khi Nộp' },
  moTa: {
    en: `<p>Requirements management tools mark a trace link <b>suspect</b> when the item at its upstream end changes after the link was recorded: someone must check whether the downstream item (design, code, test) still fits. You build that engine for <b>ClinicCare</b>.</p>
<p>Each item has <code>{ id, type, version }</code>, type one of BR, UR, FR, NFR, DES, CODE, TEST. Each link <code>{ from, to, fromVersion }</code> means "<i>to</i> was derived from <i>from</i> when <i>from</i> had version <i>fromVersion</i>". Links may point to ids that are not in the item list.</p>
<ul>
<li><b>A. <code>buildRtm(items, links)</code></b> — one row per FR and NFR, sorted by id: <code>{ id, sources, design, code, tests }</code>. <code>sources</code>: ids of UR or BR items linked <i>into</i> the row; <code>design</code>/<code>code</code>/<code>tests</code>: ids of DES/CODE/TEST items linked <i>out of</i> it (direct links only, unknown items ignored). Each list sorted.</li>
<li><b>B. <code>coverage(items, links)</code></b> — <code>{ total, tested, pct, untested, orphans }</code> over the RTM rows; <code>pct</code> = tested ÷ total × 100 rounded to 1 decimal (0 when there are no rows); <code>orphans</code> = rows with no source.</li>
<li><b>C. <code>suspect(items, links)</code></b> — sorted <code>"from-&gt;to"</code> strings for links whose upstream item exists and now has a version greater than <code>fromVersion</code>.</li>
<li><b>D. <code>impactOf(items, links, changedId)</code></b> — every item reachable downstream from <code>changedId</code>, grouped by type (<code>UNKNOWN</code> for ids not in the item list), each group sorted, groups in alphabetical order, the changed item excluded, cycles handled.</li>
<li><b>E. <code>clearSuspect(items, links, from, to)</code></b> — after the review, return a <b>new</b> links array where that link’s <code>fromVersion</code> is the current version of <code>from</code>. Do not modify the input.</li>
</ul>
<p><b>Sample data</b> — UR-1, FR-10 and FR-12 have new versions; some links were recorded before the change:</p>${preJson('ITEMS', ITEMS)}${preJson('LINKS', LINKS)}`,
    vi: `<p>Công cụ quản lý yêu cầu đánh dấu liên kết truy vết là <b>suspect</b> khi mục phía trên thay đổi sau khi liên kết được ghi: phải có người kiểm mục phía dưới còn phù hợp không. Bạn dựng động cơ đó cho ClinicCare. Mục <code>{ id, type, version }</code>; liên kết <code>{ from, to, fromVersion }</code> = "to được suy ra từ from khi from ở phiên bản fromVersion".</p>
<ul><li>A. buildRtm — mỗi FR/NFR một dòng: nguồn UR/BR, design, code, tests (liên kết trực tiếp, sắp xếp).</li><li>B. coverage — tổng, số có test, % (1 chữ số), chưa test, mồ côi.</li><li>C. suspect — liên kết có mục phía trên tồn tại và version hiện tại > fromVersion.</li><li>D. impactOf — mọi mục phía dưới, nhóm theo loại (UNKNOWN cho id lạ), không gồm mục bị đổi, xử lý chu trình.</li><li>E. clearSuspect — trả mảng liên kết MỚI với fromVersion cập nhật; không sửa đầu vào.</li></ul>`,
  },
  chucNangChinh: [
    { en: 'A. RTM rows.', vi: 'A. Các dòng RTM.' }, { en: 'B. Coverage and orphans.', vi: 'B. Độ phủ và mồ côi.' },
    { en: 'C. Suspect links.', vi: 'C. Liên kết nghi vấn.' }, { en: 'D. Impact analysis.', vi: 'D. Phân tích ảnh hưởng.' },
    { en: 'E. Clearing a suspect link.', vi: 'E. Xoá nghi vấn.' },
  ],
  yeuCauChung: [{ en: 'Pure functions; ids such as "toString" must work.', vi: 'Hàm thuần; id như "toString" phải chạy đúng.' }],
  cayThuMuc: `answers/
├── sample-data.js   ← ITEMS, LINKS (read-only)
└── rtm.js           ← buildRtm, coverage, suspect, impactOf, clearSuspect`,
  moHinh: {
    ten: 'Data shapes',
    truong: [
      ['item', '{ id, type, version, title }', { en: 'type: BR UR FR NFR DES CODE TEST', vi: 'loại: BR UR FR NFR DES CODE TEST' }],
      ['link', '{ from, to, fromVersion }', { en: 'to derived from from@fromVersion', vi: 'to suy ra từ from@fromVersion' }],
    ],
  },
  chucNang: [
    { ten: { en: 'A. buildRtm', vi: 'A. buildRtm' }, diem: 2, yeuCau: [{ en: 'Direct links, typed columns, sorted.', vi: 'Liên kết trực tiếp, cột theo loại, sắp xếp.' }], hook: ['RTM'] },
    { ten: { en: 'B. coverage', vi: 'B. coverage' }, diem: 2, yeuCau: [{ en: 'Untested and orphan requirements.', vi: 'Yêu cầu chưa test và mồ côi.' }], hook: ['coverage'] },
    { ten: { en: 'C. suspect', vi: 'C. suspect' }, diem: 2, yeuCau: [{ en: 'Version newer than the link.', vi: 'Phiên bản mới hơn liên kết.' }], hook: ['suspect links'] },
    { ten: { en: 'D. impactOf', vi: 'D. impactOf' }, diem: 2.5, yeuCau: [{ en: 'Transitive, grouped, cycle-safe.', vi: 'Bắc cầu, nhóm, an toàn với chu trình.' }], hook: ['impact analysis'] },
    { ten: { en: 'E. clearSuspect', vi: 'E. clearSuspect' }, diem: 1.5, yeuCau: [{ en: 'New array, input untouched.', vi: 'Mảng mới, đầu vào giữ nguyên.' }], hook: ['immutability'] },
  ],
  idBatBuoc: [['buildRtm · coverage · suspect · impactOf · clearSuspect', 'answers/rtm.js']],
  truDiem: [
    { en: 'Counting an FR → FR link as a source: sources are UR or BR only.', vi: 'Coi liên kết FR → FR là nguồn: nguồn chỉ là UR hoặc BR.' },
    { en: 'Marking every link from a changed item suspect even when it was recorded at the current version.', vi: 'Đánh dấu nghi vấn mọi liên kết từ mục đã đổi, kể cả liên kết ghi ở phiên bản hiện tại.' },
    { en: 'Mutating the link in clearSuspect().', vi: 'Sửa trực tiếp liên kết trong clearSuspect().' },
  ],
  goiY: [
    'Dựng bảng id → mục bằng Object.create(null).',
    'Suspect: so version hiện tại của mục "from" với fromVersion của liên kết.',
    'Impact: BFS theo from → to với tập "đã thăm" chứa sẵn changedId.',
  ],
  loiHayGap: ['Chỉ lấy con trực tiếp ở impactOf.', 'Quên UNKNOWN cho id không có trong danh sách.', 'Sửa liên kết gốc khi xoá nghi vấn.'],
  giaiThich: {
    en: '<p>On the sample, the change of UR-1 to version 2 makes UR-1 → FR-10 suspect (recorded at v1) but not UR-1 → FR-11 or UR-1 → NFR-1 (recorded at v2). FR-10 v3 makes its test link suspect (recorded at v2) but not its design link; FR-12 v2 makes FR-12 → DES-5 suspect. FR-13 has no source and no test — a gold-plating candidate whose code points to an unknown item. The reference solution is in <code>answers/rtm.js</code>.</p>',
    vi: '<p>Trên mẫu, UR-1 lên v2 làm UR-1 → FR-10 thành nghi vấn (ghi ở v1) nhưng không ảnh hưởng UR-1 → FR-11 hay UR-1 → NFR-1 (ghi ở v2). FR-10 v3 làm liên kết tới test thành nghi vấn (ghi ở v2) nhưng không ảnh hưởng liên kết tới thiết kế; FR-12 v2 làm FR-12 → DES-5 thành nghi vấn. FR-13 không có nguồn và không có test — ứng viên mạ vàng, code trỏ tới mục lạ. Lời giải ở <code>answers/rtm.js</code>.</p>',
  },
  khaiNiem: ['requirements traceability matrix', 'suspect links', 'impact analysis'],
  tienQuyet: ['Lab 7', 'SWR302 lessons 7.2 and 7.4'],
  thuatNgu: [...tn('rtm', 'impactAnalysis', 'goldPlating'), { en: 'suspect link', vi: 'liên kết nghi vấn — mục phía trên đã đổi sau khi liên kết được ghi' }],
  moTaNgan: 'Deep lab chương 7: động cơ RTM với liên kết nghi vấn — chấm dữ liệu ẩn.',
  phut: 80,
  tep: TEP,
  kiem: KIEM,
  boYeu: [{ ten: 'nghi vấn mọi liên kết từ mục có version > 1, impact chỉ một tầng', tep: { 'answers/rtm.js': `${G.split('function suspect')[0]}function suspect(items, links) { var by = {}; items.forEach(function (x) { by[x.id] = x; }); return links.filter(function (l) { return by[l.from] && by[l.from].version > 1; }).map(function (l) { return l.from + '->' + l.to; }).sort(); }
function impactOf(items, links, id) { var by = {}; items.forEach(function (x) { by[x.id] = x; }); var o = {}; links.forEach(function (l) { if (l.from === id) { var t = by[l.to] ? by[l.to].type : 'UNKNOWN'; (o[t] = o[t] || []).push(l.to); } }); return o; }
function clearSuspect(items, links, from, to) { links.forEach(function (l) { if (l.from === from && l.to === to) l.fromVersion = 99; }); return links; }
` } }],
});
