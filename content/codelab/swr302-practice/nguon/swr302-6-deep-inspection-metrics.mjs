/**
 * SWR302 · DEEP LAB 6 — Inspection data: consolidate the inspectors' logs, compute inspection metrics, decide the exit.
 */
import { tn } from './_chung.mjs';
import { deLon } from './_lab.mjs';
import { kiemCa, preJson } from './_deep.mjs';

const LOGS = [
  { inspector: 'An', issues: [{ line: 4, type: 'Ambiguous', severity: 'Minor' }, { line: 9, type: 'Incorrect', severity: 'Major' }, { line: 12, type: 'Missing', severity: 'Major' }] },
  { inspector: 'Binh', issues: [{ line: 9, type: 'Incorrect', severity: 'Minor' }, { line: 15, type: 'Ambiguous', severity: 'Minor' }, { line: 4, type: 'ambiguous', severity: 'Major' }] },
  { inspector: 'Chi', issues: [{ line: 12, type: 'Missing', severity: 'Major' }, { line: 20, type: 'Infeasible', severity: 'Major' }, { line: 9, type: 'Incorrect', severity: 'Major' }] },
  { inspector: 'Dung', issues: [] },
];
const MEETING = { pages: 12, prepHours: { An: 2, Binh: 1.5, Chi: 2.5, Dung: 0 }, meetingHours: 1.5, reworkHours: 6 };

const G = `var __SEV = { Minor: 1, Major: 2 };
function __cap(s) { s = String(s || '').trim().toLowerCase(); return s.charAt(0).toUpperCase() + s.slice(1); }

function consolidate(logs) {
  var m = Object.create(null);
  logs.forEach(function (lg) {
    (lg.issues || []).forEach(function (i) {
      var type = __cap(i.type), key = i.line + '|' + type;
      var sev = __SEV[__cap(i.severity)] ? __cap(i.severity) : 'Minor';
      if (!m[key]) m[key] = { line: i.line, type: type, severity: sev, foundBy: [] };
      if (__SEV[sev] > __SEV[m[key].severity]) m[key].severity = sev;
      if (m[key].foundBy.indexOf(lg.inspector) < 0) m[key].foundBy.push(lg.inspector);
    });
  });
  return Object.keys(m).map(function (k) { m[k].foundBy.sort(); return m[k]; })
    .sort(function (a, b) { return a.line - b.line || (a.type < b.type ? -1 : a.type > b.type ? 1 : 0); });
}

function metrics(logs, meeting) {
  var issues = consolidate(logs);
  var names = Object.keys(meeting.prepHours);
  var prep = names.reduce(function (s, n) { return s + meeting.prepHours[n]; }, 0);
  var prepared = names.filter(function (n) { return meeting.prepHours[n] > 0; });
  var effort = prep + meeting.meetingHours * names.length + meeting.reworkHours;
  var major = issues.filter(function (i) { return i.severity === 'Major'; }).length;
  function r2(x) { return Math.round(x * 100) / 100; }
  return {
    defects: issues.length,
    major: major,
    density: meeting.pages ? r2(issues.length / meeting.pages) : 0,
    avgPrepPagesPerHour: prepared.length ? r2(meeting.pages / (prep / prepared.length)) : 0,
    effortHours: r2(effort),
    hoursPerMajor: major ? r2(effort / major) : null,
    unprepared: names.filter(function (n) { return !(meeting.prepHours[n] > 0); }).sort(),
  };
}

function exitDecision(issues, closedKeys, maxOpenMinor) {
  var closed = Object.create(null);
  closedKeys.forEach(function (k) { closed[k] = true; });
  var openMajor = [], openMinor = 0;
  issues.forEach(function (i) {
    var key = i.line + ':' + i.type;
    if (closed[key]) return;
    if (i.severity === 'Major') openMajor.push(key); else openMinor++;
  });
  return { exit: openMajor.length === 0 && openMinor <= maxOpenMinor, openMajor: openMajor, openMinor: openMinor };
}
`;
const D = `var LOGS = ${JSON.stringify(LOGS)}; var MEETING = ${JSON.stringify(MEETING)};\n`;
const GD = D + G;

const H_LOGS = [
  { inspector: 'Z', issues: [{ line: 3, type: 'missing', severity: 'minor' }, { line: 3, type: 'Missing', severity: 'MAJOR' }, { line: 1, type: 'Wrong', severity: 'Critical' }] },
  { inspector: 'Y', issues: [{ line: 3, type: ' MISSING ', severity: 'Minor' }, { line: 10, type: 'Ambiguous', severity: 'Minor' }, { line: 2, type: 'Ambiguous', severity: 'Minor' }] },
];

const CA = [
  { moTa: { en: 'consolidate: duplicates merged, highest severity kept', vi: 'consolidate: gộp trùng, giữ mức nặng nhất' }, goi: 'consolidate(LOGS)', mong: [
    { line: 4, type: 'Ambiguous', severity: 'Major', foundBy: ['An', 'Binh'] },
    { line: 9, type: 'Incorrect', severity: 'Major', foundBy: ['An', 'Binh', 'Chi'] },
    { line: 12, type: 'Missing', severity: 'Major', foundBy: ['An', 'Chi'] },
    { line: 15, type: 'Ambiguous', severity: 'Minor', foundBy: ['Binh'] },
    { line: 20, type: 'Infeasible', severity: 'Major', foundBy: ['Chi'] },
  ], nhom: 'f1' },
  { moTa: { en: 'consolidate (hidden): normalised types, unknown severity = Minor, sorting', vi: 'consolidate (ẩn): chuẩn hoá loại, mức lạ = Minor, sắp xếp' }, goi: `consolidate(${JSON.stringify(H_LOGS)})`, nhom: 'f1', an: true },
  { moTa: { en: 'metrics: defects, majors, density', vi: 'metrics: số lỗi, lỗi nặng, mật độ' }, goi: '(function () { var m = metrics(LOGS, MEETING); return [m.defects, m.major, m.density]; })()', mong: [5, 4, 0.42], nhom: 'f2' },
  { moTa: { en: 'metrics: preparation rate and the unprepared inspector', vi: 'metrics: tốc độ chuẩn bị và người không chuẩn bị' }, goi: '(function () { var m = metrics(LOGS, MEETING); return [m.avgPrepPagesPerHour, m.unprepared]; })()', mong: [6, ['Dung']], nhom: 'f2' },
  { moTa: { en: 'metrics: total effort and hours per major defect', vi: 'metrics: tổng công và giờ cho mỗi lỗi nặng' }, goi: '(function () { var m = metrics(LOGS, MEETING); return [m.effortHours, m.hoursPerMajor]; })()', mong: [18, 4.5], nhom: 'f3' },
  { moTa: { en: 'metrics (hidden): no majors ⇒ hoursPerMajor null; nobody prepared ⇒ rate 0', vi: 'metrics (ẩn): không lỗi nặng ⇒ null; không ai chuẩn bị ⇒ 0' }, goi: `metrics([{ inspector: 'Q', issues: [{ line: 1, type: 'Typo', severity: 'Minor' }] }], { pages: 3, prepHours: { Q: 0, R: 0 }, meetingHours: 1, reworkHours: 0.5 })`, nhom: 'f3', an: true },
  { moTa: { en: 'exitDecision: two majors still open ⇒ no exit', vi: 'exitDecision: còn hai lỗi nặng ⇒ chưa được ra' }, goi: `exitDecision(consolidate(LOGS), ['4:Ambiguous', '9:Incorrect'], 1)`, mong: { exit: false, openMajor: ['12:Missing', '20:Infeasible'], openMinor: 1 }, nhom: 'f4' },
  { moTa: { en: 'exitDecision: all majors closed, minors within the limit ⇒ exit', vi: 'exitDecision: đóng hết lỗi nặng, lỗi nhẹ trong giới hạn ⇒ ra' }, goi: `exitDecision(consolidate(LOGS), ['4:Ambiguous', '9:Incorrect', '12:Missing', '20:Infeasible'], 1)`, mong: { exit: true, openMajor: [], openMinor: 1 }, nhom: 'f4' },
  { moTa: { en: 'exitDecision (hidden): too many open minors', vi: 'exitDecision (ẩn): quá nhiều lỗi nhẹ còn mở' }, goi: `exitDecision(consolidate(${JSON.stringify(H_LOGS)}), ['3:Missing'], 1)`, nhom: 'f4', an: true },
  { moTa: { en: 'logs are not modified', vi: 'không sửa nhật ký' }, goi: '(function () { var a = JSON.stringify(LOGS); consolidate(LOGS); metrics(LOGS, MEETING); return a === JSON.stringify(LOGS); })()', mong: true, nhom: 'f5' },
];
const KIEM = kiemCa(GD, CA);

const DATA = `// Sample data (read-only) — inspection of 12 pages of the PetCare SRS.\nconst LOGS = ${JSON.stringify(LOGS, null, 1)};\nconst MEETING = ${JSON.stringify(MEETING, null, 1)};\n`;
const TEP = {
  'answers/sample-data.js': [DATA, DATA],
  'answers/inspection.js': ["function consolidate(logs) { return []; }\nfunction metrics(logs, meeting) { return {}; }\nfunction exitDecision(issues, closedKeys, maxOpenMinor) { return { exit: false, openMajor: [], openMinor: 0 }; }\n", G],
};

export default deLon({
  slug: 'swr302-6-deep-inspection-metrics',
  ten: 'Deep Lab 6 — Inspection log and metrics',
  moTaModule: 'Deep Lab chương 6: tự viết công cụ của moderator — gộp nhật ký lỗi của các inspector (trùng dòng + loại, giữ mức nặng nhất, ai tìm ra), số đo inspection (mật độ lỗi, tốc độ chuẩn bị, tổng công, giờ/lỗi nặng, người không chuẩn bị) và quyết định tiêu chí ra — chấm mẫu PetCare + dữ liệu ẩn.',
  baiHoc: 'swr302-6-2-ch17-inspection',
  dangBai: 'deep-lab',
  tieuDe: 'Deep Lab 6 — Inspection log and metrics',
  phu: { en: 'Chapter 6 deep lab · the moderator’s tools · 10 marks · hidden data on Submit', vi: 'Deep lab chương 6 · công cụ của moderator · 10 điểm · dữ liệu ẩn khi Nộp' },
  moTa: {
    en: `<p>After an inspection the moderator merges the inspectors’ issue lists, measures the inspection, and decides whether the exit criteria are met. Build those tools for the inspection of 12 pages of the <b>PetCare</b> SRS.</p>
<ul>
<li><b>A. <code>consolidate(logs)</code></b> — merge issues with the same line and type. Normalise the type (trim, first letter upper case, rest lower case) and the severity the same way; a severity other than Minor or Major counts as Minor. Keep the highest severity (Major &gt; Minor) and the sorted list of inspectors who found it (<code>foundBy</code>). Sort by line, then type.</li>
<li><b>B/C. <code>metrics(logs, meeting)</code></b> — return <code>{ defects, major, density, avgPrepPagesPerHour, effortHours, hoursPerMajor, unprepared }</code> on the consolidated list: <code>density</code> = defects ÷ pages; <code>avgPrepPagesPerHour</code> = pages ÷ (average preparation hours of the inspectors who prepared, i.e. hours &gt; 0) — 0 if nobody prepared; <code>effortHours</code> = all preparation + meeting hours × number of inspectors in <code>prepHours</code> + rework; <code>hoursPerMajor</code> = effort ÷ majors (null if none); <code>unprepared</code> = sorted names with 0 preparation hours. Round numbers to 2 decimals.</li>
<li><b>D. <code>exitDecision(issues, closedKeys, maxOpenMinor)</code></b> — issues are consolidated; a closed issue has its key <code>"line:Type"</code> in <code>closedKeys</code>. Exit only when no Major is open and at most <code>maxOpenMinor</code> Minor issues are open. Return <code>{ exit, openMajor: [keys in issue order], openMinor }</code>.</li>
</ul>
<p><b>Sample data</b>:</p>${preJson('LOGS', LOGS)}${preJson('MEETING', MEETING)}`,
    vi: `<p>Sau buổi inspection, moderator gộp danh sách lỗi của các inspector, đo inspection và quyết định đã đạt tiêu chí ra chưa. Viết các công cụ đó cho buổi inspection 12 trang SRS PetCare.</p>
<ul><li>A. <code>consolidate</code> — gộp lỗi cùng dòng + loại (chuẩn hoá chữ), giữ mức nặng nhất, danh sách người tìm ra; mức lạ = Minor.</li><li>B/C. <code>metrics</code> — số lỗi, lỗi nặng, mật độ, tốc độ chuẩn bị (chỉ tính người có chuẩn bị), tổng công, giờ/lỗi nặng, người không chuẩn bị.</li><li>D. <code>exitDecision</code> — chỉ được ra khi không còn lỗi Major mở và lỗi Minor mở ≤ giới hạn.</li></ul>`,
  },
  chucNangChinh: [
    { en: 'A. Consolidated issue log.', vi: 'A. Nhật ký lỗi đã gộp.' }, { en: 'B. Defect metrics.', vi: 'B. Số đo lỗi.' },
    { en: 'C. Effort metrics.', vi: 'C. Số đo công sức.' }, { en: 'D. Exit decision.', vi: 'D. Quyết định tiêu chí ra.' }, { en: 'E. Inputs untouched.', vi: 'E. Không sửa đầu vào.' },
  ],
  yeuCauChung: [{ en: 'Round to 2 decimals for output only.', vi: 'Chỉ làm tròn 2 chữ số khi xuất.' }],
  cayThuMuc: `answers/
├── sample-data.js   ← LOGS, MEETING
└── inspection.js    ← consolidate, metrics, exitDecision`,
  moHinh: { ten: 'Data shapes', truong: [
    ['log', '{ inspector, issues[{ line, type, severity }] }', { en: 'raw, un-normalised', vi: 'thô, chưa chuẩn hoá' }],
    ['meeting', '{ pages, prepHours: { name: h }, meetingHours, reworkHours }', { en: '', vi: '' }],
    ['issue (consolidated)', '{ line, type, severity, foundBy[] }', { en: 'key "line:Type"', vi: 'khoá "dòng:Loại"' }],
  ] },
  chucNang: [
    { ten: { en: 'A. consolidate', vi: 'A. consolidate' }, diem: 3, yeuCau: [{ en: 'Merge, normalise, highest severity, sorted.', vi: 'Gộp, chuẩn hoá, mức nặng nhất, sắp xếp.' }], hook: ['issue log'] },
    { ten: { en: 'B. Defect metrics', vi: 'B. Số đo lỗi' }, diem: 2, yeuCau: [{ en: 'Density, preparation rate, unprepared.', vi: 'Mật độ, tốc độ chuẩn bị, người không chuẩn bị.' }], hook: ['inspection metrics'] },
    { ten: { en: 'C. Effort metrics', vi: 'C. Số đo công' }, diem: 2, yeuCau: [{ en: 'Effort and hours per major.', vi: 'Tổng công và giờ/lỗi nặng.' }], hook: ['inspection metrics'] },
    { ten: { en: 'D. exitDecision', vi: 'D. exitDecision' }, diem: 2.5, yeuCau: [{ en: 'No open Major; Minor within limit.', vi: 'Không còn Major; Minor trong giới hạn.' }], hook: ['exit criteria'] },
    { ten: { en: 'E. Inputs untouched', vi: 'E. Không sửa đầu vào' }, diem: 0.5, yeuCau: [{ en: 'No mutation of logs.', vi: 'Không sửa nhật ký.' }], hook: ['immutability'] },
  ],
  idBatBuoc: [['consolidate · metrics · exitDecision', 'answers/inspection.js']],
  truDiem: [
    { en: 'Keeping the first severity seen instead of the highest.', vi: 'Giữ mức gặp đầu tiên thay vì mức nặng nhất.' },
    { en: 'Averaging preparation over inspectors who did not prepare — an unprepared reviewer is a process problem to report, not a zero to average.', vi: 'Tính trung bình cả người không chuẩn bị — đó là vấn đề quy trình cần báo, không phải số 0 để chia.' },
  ],
  goiY: ['Khoá gộp: dòng + "|" + loại đã chuẩn hoá.', 'Tốc độ chuẩn bị: pages ÷ (tổng giờ ÷ số người có giờ > 0).', 'Tiêu chí ra: duyệt danh sách đã gộp, bỏ qua khoá đã đóng.'],
  loiHayGap: ['Không chuẩn hoá "ambiguous" và "Ambiguous" ⇒ hai lỗi.', 'Quên nhân giờ họp với số người.'],
  giaiThich: {
    en: '<p>On the sample: 9 raw reports become 5 distinct defects (4 Major), density 0.42 per page; Dung did not prepare — the moderator should have postponed or replaced him. Effort = 6 h preparation + 1.5 h × 4 people + 6 h rework = 18 h, i.e. 4.5 h per major defect found, far cheaper than finding those defects in testing.</p>',
    vi: '<p>Trên mẫu: 9 báo cáo thô gộp lại còn 5 lỗi (4 Major), mật độ 0,42 lỗi/trang; Dung không chuẩn bị — moderator lẽ ra phải hoãn hoặc thay người. Công = 6 giờ chuẩn bị + 1,5 giờ × 4 người + 6 giờ sửa = 18 giờ, tức 4,5 giờ cho mỗi lỗi nặng — rẻ hơn nhiều so với tìm ra chúng lúc kiểm thử.</p>',
  },
  khaiNiem: ['inspection metrics', 'exit criteria'],
  tienQuyet: ['Lab 6', 'SWR302 lesson 6.2'],
  thuatNgu: [...tn('inspection'), { en: 'defect density', vi: 'mật độ lỗi — lỗi trên mỗi trang' }, { en: 'exit criteria', vi: 'tiêu chí ra' }],
  moTaNgan: 'Deep lab chương 6: gộp nhật ký inspection, số đo, tiêu chí ra.',
  phut: 70,
  tep: TEP,
  kiem: KIEM,
  boYeu: [{ ten: 'giữ mức đầu tiên, chia cả người không chuẩn bị', tep: { 'answers/inspection.js': `function consolidate(logs){ var m={},o=[]; logs.forEach(function(l){ l.issues.forEach(function(i){ var k=i.line+'|'+i.type.toLowerCase(); if(!m[k]){ m[k]={line:i.line,type:i.type,severity:i.severity,foundBy:[]}; o.push(m[k]); } m[k].foundBy.push(l.inspector); }); }); return o.sort(function(a,b){return a.line-b.line;}); }
${G.split('function metrics')[1] ? 'function metrics' + G.split('function metrics')[1].replace("var prepared = names.filter(function (n) { return meeting.prepHours[n] > 0; });", 'var prepared = names;') : ''}` } }],
});
