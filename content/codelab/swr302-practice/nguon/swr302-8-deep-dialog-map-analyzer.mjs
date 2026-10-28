/**
 * SWR302 · DEEP LAB 8 — Dialog map analyser: unreachable screens, dead ends, shortest click paths, task checks.
 */
import { tn } from './_chung.mjs';
import { deLon } from './_lab.mjs';
import { kiemCa, preJson } from './_deep.mjs';

const MAP = {
  start: 'Home',
  ends: ['Booked', 'LoggedOut'],
  screens: ['Home', 'Login', 'Search', 'DoctorProfile', 'SlotPicker', 'Confirm', 'Booked', 'MyAppointments', 'CancelDialog', 'Help', 'LoggedOut', 'OldPromo'],
  transitions: [
    { from: 'Home', to: 'Login', action: 'tap Log in' },
    { from: 'Login', to: 'Home', action: 'submit valid login' },
    { from: 'Home', to: 'Search', action: 'tap Find a doctor' },
    { from: 'Search', to: 'DoctorProfile', action: 'select doctor' },
    { from: 'DoctorProfile', to: 'SlotPicker', action: 'tap Book' },
    { from: 'Search', to: 'SlotPicker', action: 'tap Earliest slot' },
    { from: 'SlotPicker', to: 'Confirm', action: 'select slot' },
    { from: 'Confirm', to: 'Booked', action: 'tap Confirm' },
    { from: 'Confirm', to: 'SlotPicker', action: 'tap Back' },
    { from: 'Home', to: 'MyAppointments', action: 'tap My appointments' },
    { from: 'MyAppointments', to: 'CancelDialog', action: 'tap Cancel' },
    { from: 'Home', to: 'Help', action: 'tap Help' },
    { from: 'Home', to: 'LoggedOut', action: 'tap Log out' },
    { from: 'OldPromo', to: 'Search', action: 'tap banner' },
    { from: 'Booked', to: 'Receipt', action: 'tap Receipt' },
  ],
};
const TASKS = [
  { name: 'Book the earliest slot', target: 'Booked', maxClicks: 4 },
  { name: 'Cancel an appointment', target: 'CancelDialog', maxClicks: 2 },
  { name: 'Read help', target: 'Help', maxClicks: 1 },
  { name: 'Open an old promotion', target: 'OldPromo', maxClicks: 3 },
];

const G = `function __ke(map) {
  var ok = Object.create(null), next = Object.create(null);
  map.screens.forEach(function (s) { ok[s] = true; next[s] = []; });
  map.transitions.forEach(function (t) { if (ok[t.from] && ok[t.to]) next[t.from].push(t); });
  return { ok: ok, next: next };
}
function __bfs(map) {
  var k = __ke(map), dist = Object.create(null), via = Object.create(null), q = [];
  if (k.ok[map.start]) { dist[map.start] = 0; q.push(map.start); }
  while (q.length) {
    var cur = q.shift();
    k.next[cur].forEach(function (t) {
      if (t.to in dist) return;
      dist[t.to] = dist[cur] + 1; via[t.to] = t; q.push(t.to);
    });
  }
  return { dist: dist, via: via, k: k };
}

function analyze(map) {
  var b = __bfs(map), ends = Object.create(null);
  (map.ends || []).forEach(function (e) { ends[e] = true; });
  var unknown = map.transitions.filter(function (t) { return !b.k.ok[t.from] || !b.k.ok[t.to]; })
    .map(function (t) { return t.from + '->' + t.to; }).sort();
  return {
    unreachable: map.screens.filter(function (s) { return !(s in b.dist); }).sort(),
    deadEnds: map.screens.filter(function (s) { return (s in b.dist) && !ends[s] && b.k.next[s].length === 0; }).sort(),
    unknown: unknown,
  };
}

function clicks(map, target) {
  var b = __bfs(map);
  return target in b.dist ? b.dist[target] : -1;
}

function path(map, target) {
  var b = __bfs(map);
  if (!(target in b.dist)) return null;
  var out = [], cur = target;
  while (cur !== map.start) { out.unshift(b.via[cur].action); cur = b.via[cur].from; }
  return out;
}

function taskCheck(map, tasks) {
  return tasks.map(function (t) { return { name: t.name, clicks: clicks(map, t.target), ok: clicks(map, t.target) >= 0 && clicks(map, t.target) <= t.maxClicks }; })
    .filter(function (r) { return !r.ok; })
    .map(function (r) { return r.name + ': ' + (r.clicks < 0 ? 'unreachable' : r.clicks + ' clicks'); });
}
`;
const D = `var MAP = ${JSON.stringify(MAP)}; var TASKS = ${JSON.stringify(TASKS)};\n`;
const GD = D + G;

const H = { start: 'A', ends: ['E'], screens: ['A', 'B', 'C', 'D', 'E', 'F', 'constructor'], transitions: [
  { from: 'A', to: 'B', action: 'b1' }, { from: 'A', to: 'C', action: 'c1' }, { from: 'B', to: 'D', action: 'd-from-b' }, { from: 'C', to: 'D', action: 'd-from-c' },
  { from: 'D', to: 'E', action: 'e' }, { from: 'D', to: 'A', action: 'home' }, { from: 'F', to: 'F', action: 'loop' }, { from: 'C', to: 'constructor', action: 'k' }, { from: 'toString', to: 'A', action: 'x' },
] };

const CA = [
  { moTa: { en: 'analyze: unreachable screens', vi: 'analyze: màn hình không tới được' }, goi: 'analyze(MAP).unreachable', mong: ['OldPromo'], nhom: 'f1' },
  { moTa: { en: 'analyze: transitions to or from unknown screens', vi: 'analyze: chuyển tới/từ màn hình lạ' }, goi: 'analyze(MAP).unknown', mong: ['Booked->Receipt'], nhom: 'f1' },
  { moTa: { en: 'analyze: dead ends (reachable, not an end screen, no way out)', vi: 'analyze: ngõ cụt (tới được, không phải màn kết thúc, không lối ra)' }, goi: 'analyze(MAP).deadEnds', mong: ['CancelDialog', 'Help'], nhom: 'f2' },
  { moTa: { en: 'analyze (hidden): self-loops, tricky names', vi: 'analyze (ẩn): vòng tự thân, tên đánh lừa' }, goi: `analyze(${JSON.stringify(H)})`, nhom: 'f2', an: true },
  { moTa: { en: 'clicks: minimum number of transitions', vi: 'clicks: số chuyển tối thiểu' }, goi: `[clicks(MAP, 'Booked'), clicks(MAP, 'Home'), clicks(MAP, 'OldPromo'), clicks(MAP, 'Nowhere')]`, mong: [4, 0, -1, -1], nhom: 'f3' },
  { moTa: { en: 'clicks (hidden)', vi: 'clicks (ẩn)' }, goi: `[clicks(${JSON.stringify(H)}, 'E'), clicks(${JSON.stringify(H)}, 'constructor'), clicks(${JSON.stringify(H)}, 'F')]`, nhom: 'f3', an: true },
  { moTa: { en: 'path: the shortest action sequence to Booked', vi: 'path: chuỗi hành động ngắn nhất tới Booked' }, goi: `path(MAP, 'Booked')`, mong: ['tap Find a doctor', 'tap Earliest slot', 'select slot', 'tap Confirm'], nhom: 'f4' },
  { moTa: { en: 'path: start screen ⇒ [], unreachable ⇒ null', vi: 'path: màn bắt đầu ⇒ [], không tới được ⇒ null' }, goi: `[path(MAP, 'Home'), path(MAP, 'OldPromo')]`, mong: [[], null], nhom: 'f4' },
  { moTa: { en: 'path (hidden): ties resolved by transition order', vi: 'path (ẩn): hoà thì theo thứ tự chuyển' }, goi: `path(${JSON.stringify(H)}, 'E')`, nhom: 'f4', an: true },
  { moTa: { en: 'taskCheck: tasks that fail their click budget', vi: 'taskCheck: tác vụ vượt ngân sách click' }, goi: 'taskCheck(MAP, TASKS)', mong: ['Open an old promotion: unreachable'], nhom: 'f5' },
  { moTa: { en: 'hidden: taskCheck with a tight budget', vi: 'ẩn: taskCheck với ngân sách chặt' }, goi: `taskCheck(MAP, [{ name: 'Book', target: 'Booked', maxClicks: 3 }, { name: 'Help', target: 'Help', maxClicks: 1 }])`, nhom: 'f5', an: true },
  { moTa: { en: 'the map is not modified', vi: 'không sửa bản đồ' }, goi: `(function () { var a = JSON.stringify(MAP); analyze(MAP); path(MAP, 'Booked'); taskCheck(MAP, TASKS); return a === JSON.stringify(MAP); })()`, mong: true, nhom: 'f6' },
];
const KIEM = kiemCa(GD, CA);

const DATA = `// Sample dialog map (read-only) — ClinicCare mobile booking.\nconst MAP = ${JSON.stringify(MAP, null, 1)};\nconst TASKS = ${JSON.stringify(TASKS, null, 1)};\n`;
const TEP = {
  'answers/sample-data.js': [DATA, DATA],
  'answers/dialog-map.js': ["function analyze(map) { return { unreachable: [], deadEnds: [], unknown: [] }; }\nfunction clicks(map, target) { return -1; }\nfunction path(map, target) { return null; }\nfunction taskCheck(map, tasks) { return []; }\n", G],
};

export default deLon({
  slug: 'swr302-8-deep-dialog-map-analyzer',
  ten: 'Deep Lab 8 — Dialog map analyser',
  moTaModule: 'Deep Lab chương 8: tự viết bộ phân tích dialog map — màn hình không tới được, ngõ cụt, chuyển tới màn lạ, số click tối thiểu (BFS), đường đi ngắn nhất theo hành động, kiểm ngân sách click của tác vụ — chấm mẫu ClinicCare + dữ liệu ẩn.',
  baiHoc: 'swr302-8-3-ch15-types',
  dangBai: 'deep-lab',
  tieuDe: 'Deep Lab 8 — Dialog map analyser (reachability, dead ends, click paths)',
  phu: { en: 'Chapter 8 deep lab · evaluate a UI architecture before drawing screens · 10 marks · hidden maps on Submit', vi: 'Deep lab chương 8 · đánh giá kiến trúc giao diện trước khi vẽ màn hình · 10 điểm · bản đồ ẩn khi Nộp' },
  moTa: {
    en: `<p>A dialog map (Wiegers Ch.12/15) models the UI as screens (states) and navigations (transitions). Before anybody draws wireframes you can already ask: can users reach every screen? Do they get stuck? How many taps does a key task take? Build an analyser for the <b>ClinicCare</b> mobile booking map.</p>
<ul>
<li><b>A/B. <code>analyze(map)</code></b> — <code>{ unreachable, deadEnds, unknown }</code>: screens not reachable from <code>map.start</code>; reachable screens that are not in <code>map.ends</code> and have no outgoing transition; <code>"from-&gt;to"</code> for transitions whose either end is not a listed screen (such transitions are ignored everywhere else). All sorted.</li>
<li><b>C. <code>clicks(map, target)</code></b> — the minimum number of transitions from the start to <code>target</code>; 0 for the start itself; −1 if unreachable or unknown.</li>
<li><b>D. <code>path(map, target)</code></b> — the actions of one shortest path; when several shortest paths exist, explore transitions in their listed order (breadth-first search) and keep the first found. <code>[]</code> for the start, <code>null</code> if unreachable.</li>
<li><b>E. <code>taskCheck(map, tasks)</code></b> — for each task in order whose target is unreachable or needs more than <code>maxClicks</code>, the string <code>"&lt;name&gt;: unreachable"</code> or <code>"&lt;name&gt;: N clicks"</code>.</li>
</ul>
<p><b>Sample data</b>:</p>${preJson('MAP', MAP)}${preJson('TASKS', TASKS)}`,
    vi: `<p>Dialog map mô hình hoá giao diện thành màn hình (trạng thái) và điều hướng (chuyển). Trước khi vẽ wireframe đã có thể hỏi: người dùng tới được mọi màn không? Có bị kẹt không? Tác vụ chính mất mấy lần chạm? Viết bộ phân tích cho bản đồ đặt lịch ClinicCare.</p>
<ul><li>A/B. <code>analyze</code> — màn không tới được; ngõ cụt (tới được, không thuộc ends, không lối ra); chuyển dính màn lạ (bị bỏ qua ở mọi chỗ khác).</li><li>C. <code>clicks</code> — số chuyển tối thiểu; −1 nếu không tới được.</li><li>D. <code>path</code> — hành động của một đường ngắn nhất (BFS theo thứ tự chuyển); [] cho màn bắt đầu, null nếu không tới được.</li><li>E. <code>taskCheck</code> — tác vụ vượt ngân sách click hoặc không tới được.</li></ul>`,
  },
  chucNangChinh: [
    { en: 'A. Reachability and unknown transitions.', vi: 'A. Khả năng tới và chuyển lạ.' }, { en: 'B. Dead ends.', vi: 'B. Ngõ cụt.' },
    { en: 'C. Minimum clicks.', vi: 'C. Số click tối thiểu.' }, { en: 'D. Shortest path.', vi: 'D. Đường ngắn nhất.' },
    { en: 'E. Task budgets.', vi: 'E. Ngân sách click.' }, { en: 'F. Map untouched.', vi: 'F. Không sửa bản đồ.' },
  ],
  yeuCauChung: [{ en: 'Pure functions; deterministic tie-breaking by transition order.', vi: 'Hàm thuần; phá hoà theo thứ tự chuyển.' }],
  cayThuMuc: `answers/
├── sample-data.js   ← MAP, TASKS
└── dialog-map.js    ← analyze, clicks, path, taskCheck`,
  moHinh: { ten: 'Data shapes', truong: [
    ['map', '{ start, ends[], screens[], transitions[{ from, to, action }] }', { en: 'ends: screens where stopping is fine', vi: 'ends: màn dừng lại là hợp lệ' }],
    ['task', '{ name, target, maxClicks }', { en: '', vi: '' }],
  ] },
  chucNang: [
    { ten: { en: 'A. Reachability', vi: 'A. Khả năng tới' }, diem: 2, yeuCau: [{ en: 'Unreachable screens; unknown transitions.', vi: 'Màn không tới được; chuyển lạ.' }], hook: ['dialog map'] },
    { ten: { en: 'B. Dead ends', vi: 'B. Ngõ cụt' }, diem: 2, yeuCau: [{ en: 'Reachable, not an end, no exit.', vi: 'Tới được, không phải kết thúc, không lối ra.' }], hook: ['navigation'] },
    { ten: { en: 'C. clicks', vi: 'C. clicks' }, diem: 2, yeuCau: [{ en: 'Breadth-first search.', vi: 'Tìm kiếm theo chiều rộng.' }], hook: ['BFS'] },
    { ten: { en: 'D. path', vi: 'D. path' }, diem: 2, yeuCau: [{ en: 'Actions of the first shortest path.', vi: 'Hành động của đường ngắn nhất đầu tiên.' }], hook: ['BFS'] },
    { ten: { en: 'E. taskCheck', vi: 'E. taskCheck' }, diem: 1.5, yeuCau: [{ en: 'Failing tasks, in order.', vi: 'Tác vụ không đạt, theo thứ tự.' }], hook: ['usability'] },
    { ten: { en: 'F. Map untouched', vi: 'F. Không sửa bản đồ' }, diem: 0.5, yeuCau: [{ en: 'No mutation.', vi: 'Không sửa đầu vào.' }], hook: ['immutability'] },
  ],
  idBatBuoc: [['analyze · clicks · path · taskCheck', 'answers/dialog-map.js']],
  truDiem: [
    { en: 'Using depth-first search: it finds a path, not the shortest one.', vi: 'Dùng tìm kiếm theo chiều sâu: ra một đường, không phải đường ngắn nhất.' },
    { en: 'Reporting the end screens (Booked, LoggedOut) as dead ends.', vi: 'Báo màn kết thúc (Booked, LoggedOut) là ngõ cụt.' },
  ],
  goiY: ['BFS từ start, lưu khoảng cách và chuyển dẫn tới mỗi màn; đường đi dựng ngược từ đích.', 'Ngõ cụt: tới được + không thuộc ends + không có chuyển ra hợp lệ.'],
  loiHayGap: ['Đếm cả chuyển tới màn lạ (Receipt) là lối ra.', 'Trả 0 thay vì −1 cho màn không tới được.'],
  giaiThich: {
    en: '<p>The analyser finds three design issues before any wireframe exists: the cancel dialog and the help screen have no way back (users must kill the app), the old promotion screen is unreachable (dead code or a missing entry point), and the Receipt screen is referenced but not designed. Booking takes 4 taps via "Earliest slot" — within the budget.</p>',
    vi: '<p>Bộ phân tích lộ ra ba vấn đề thiết kế trước khi có wireframe: hộp thoại huỷ và màn trợ giúp không có đường quay lại (người dùng phải tắt app), màn khuyến mãi cũ không tới được (mã chết hoặc thiếu lối vào), màn Receipt được trỏ tới nhưng chưa thiết kế. Đặt lịch mất 4 lần chạm qua "Earliest slot" — trong ngân sách.</p>',
  },
  khaiNiem: ['dialog map', 'navigation analysis'],
  tienQuyet: ['Lab 8', 'SWR302 lessons 4.8 and 8.3'],
  thuatNgu: [...tn('dialogMap', 'wireframe', 'prototype'), { en: 'breadth-first search', vi: 'tìm kiếm theo chiều rộng (BFS)' }],
  moTaNgan: 'Deep lab chương 8: phân tích dialog map — khả năng tới, ngõ cụt, đường ngắn nhất.',
  phut: 70,
  tep: TEP,
  kiem: KIEM,
  boYeu: [{ ten: 'DFS, ends là ngõ cụt', tep: { 'answers/dialog-map.js': "function analyze(m){ var seen={}; (function go(s){ if(seen[s]) return; seen[s]=1; m.transitions.forEach(function(t){ if(t.from===s) go(t.to); }); })(m.start); return {unreachable:m.screens.filter(function(s){return !seen[s];}).sort(), deadEnds:m.screens.filter(function(s){ return seen[s]&&!m.transitions.some(function(t){return t.from===s;}); }).sort(), unknown:[]}; }\nfunction path(m,target){ var best=null; (function go(s,acc,vis){ if(s===target){ if(!best) best=acc; return; } m.transitions.forEach(function(t){ if(t.from===s&&!vis[t.to]){ var v=Object.assign({},vis); v[t.to]=1; go(t.to,acc.concat([t.action]),v);} }); })(m.start,[],{}); return best; }\nfunction clicks(m,t){ var p=path(m,t); return p?p.length:-1; }\nfunction taskCheck(m,ts){ return ts.filter(function(t){ var c=clicks(m,t.target); return c<0||c>t.maxClicks; }).map(function(t){ var c=clicks(m,t.target); return t.name+': '+(c<0?'unreachable':c+' clicks'); }); }\n" } }],
});
