/**
 * SWR302 · DEEP LAB 9 — Agile release forecast: velocity, sprint plan from the backlog, burndown, release date.
 */
import { tn } from './_chung.mjs';
import { deLon } from './_lab.mjs';
import { kiemCa, preJson } from './_deep.mjs';

const HISTORY = [18, 22, 15, 20, 25];
const BACKLOG = [
  { id: 'S1', points: 5 }, { id: 'S2', points: 8 }, { id: 'S3', points: 3 }, { id: 'S4', points: 13 },
  { id: 'S5', points: 2 }, { id: 'S6', points: 21 }, { id: 'S7', points: 8 }, { id: 'S8', points: 5 }, { id: 'S9', points: 1 },
];

const G = `function velocity(history, n) {
  var h = history.slice(-n);
  if (!h.length || n <= 0) return 0;
  return Math.round(h.reduce(function (s, x) { return s + x; }, 0) / h.length * 10) / 10;
}

function forecast(backlog, vel) {
  var plan = [], tooBig = [], cur = null;
  backlog.forEach(function (it) {
    if (it.points > vel) { tooBig.push(it.id); return; }
    if (!cur || cur.points + it.points > vel) { cur = { sprint: plan.length + 1, items: [], points: 0 }; plan.push(cur); }
    cur.items.push(it.id); cur.points += it.points;
  });
  return { plan: plan, tooBig: tooBig };
}

function burndown(total, done) {
  var left = total, out = [];
  done.forEach(function (d) { left = Math.max(0, left - d); out.push(left); });
  return out;
}

function releaseDate(plan, startDate, sprintDays, targetId) {
  var s = plan.filter(function (p) { return p.items.indexOf(targetId) >= 0; })[0];
  if (!s) return null;
  var p = startDate.split('-').map(Number);
  var t = Date.UTC(p[0], p[1] - 1, p[2]) + (s.sprint * sprintDays - 1) * 86400000;
  return new Date(t).toISOString().slice(0, 10);
}
`;
const D = `var HISTORY = ${JSON.stringify(HISTORY)}; var BACKLOG = ${JSON.stringify(BACKLOG)};\n`;
const GD = D + G;

const CA = [
  { moTa: { en: 'velocity: average of the last 3 sprints', vi: 'velocity: trung bình 3 sprint gần nhất' }, goi: '[velocity(HISTORY, 3), velocity(HISTORY, 10), velocity([], 3)]', mong: [20, 20, 0], nhom: 'f1' },
  { moTa: { en: 'velocity (hidden): rounding to 1 decimal', vi: 'velocity (ẩn): làm tròn 1 chữ số' }, goi: '[velocity([10, 11, 11], 3), velocity([7], 2), velocity([5, 6], 0)]', nhom: 'f1', an: true },
  { moTa: { en: 'forecast: sprints at velocity 20 (order is kept)', vi: 'forecast: các sprint với velocity 20 (giữ thứ tự)' }, goi: 'forecast(BACKLOG, 20).plan', mong: [{ sprint: 1, items: ['S1', 'S2', 'S3'], points: 16 }, { sprint: 2, items: ['S4', 'S5'], points: 15 }, { sprint: 3, items: ['S7', 'S8', 'S9'], points: 14 }], nhom: 'f2' },
  { moTa: { en: 'forecast: stories bigger than the velocity must be split', vi: 'forecast: story lớn hơn velocity phải tách' }, goi: 'forecast(BACKLOG, 20).tooBig', mong: ['S6'], nhom: 'f3' },
  { moTa: { en: 'forecast (hidden): exact fits and a low velocity', vi: 'forecast (ẩn): vừa khít và velocity thấp' }, goi: `[forecast([{ id: 'a', points: 4 }, { id: 'b', points: 6 }, { id: 'c', points: 10 }, { id: 'd', points: 1 }], 10), forecast(BACKLOG, 8)]`, nhom: 'f2', an: true },
  { moTa: { en: 'burndown: remaining points never below zero', vi: 'burndown: điểm còn lại không âm' }, goi: 'burndown(66, [16, 15, 14, 30])', mong: [50, 35, 21, 0], nhom: 'f4' },
  { moTa: { en: 'releaseDate: last day of the sprint that holds S8', vi: 'releaseDate: ngày cuối của sprint chứa S8' }, goi: `releaseDate(forecast(BACKLOG, 20).plan, '2026-11-02', 14, 'S8')`, mong: '2026-12-13', nhom: 'f5' },
  { moTa: { en: 'releaseDate (hidden): month/year boundaries, missing stories', vi: 'releaseDate (ẩn): qua tháng/năm, story không có' }, goi: `[releaseDate(forecast(BACKLOG, 20).plan, '2026-12-21', 7, 'S4'), releaseDate(forecast(BACKLOG, 20).plan, '2026-11-02', 14, 'S6'), releaseDate([{ sprint: 1, items: ['x'], points: 1 }], '2028-02-28', 2, 'x')]`, nhom: 'f5', an: true },
  { moTa: { en: 'inputs are not modified', vi: 'không sửa đầu vào' }, goi: '(function () { var a = JSON.stringify([HISTORY, BACKLOG]); velocity(HISTORY, 3); forecast(BACKLOG, 20); return a === JSON.stringify([HISTORY, BACKLOG]); })()', mong: true, nhom: 'f6' },
];
const KIEM = kiemCa(GD, CA);

const DATA = `// Sample data (read-only) — ClubHub team.\nconst HISTORY = ${JSON.stringify(HISTORY)};   // completed points of past sprints, oldest first\nconst BACKLOG = ${JSON.stringify(BACKLOG, null, 1)};   // ordered by the product owner\n`;
const TEP = {
  'answers/sample-data.js': [DATA, DATA],
  'answers/forecast.js': ["function velocity(history, n) { return 0; }\nfunction forecast(backlog, vel) { return { plan: [], tooBig: [] }; }\nfunction burndown(total, done) { return []; }\nfunction releaseDate(plan, startDate, sprintDays, targetId) { return null; }\n", G],
};

export default deLon({
  slug: 'swr302-9-deep-release-forecast',
  ten: 'Deep Lab 9 — Release forecast from the backlog',
  moTaModule: 'Deep Lab chương 9: tự viết công cụ dự báo bản phát hành agile — velocity trung bình gần nhất, chia backlog thành sprint theo thứ tự ưu tiên (story quá lớn phải tách), burndown, ngày phát hành của một story — chấm mẫu ClubHub + dữ liệu ẩn.',
  baiHoc: 'swr302-9-3-ch20-essentials-1',
  dangBai: 'deep-lab',
  tieuDe: 'Deep Lab 9 — Release forecast (velocity, sprint plan, burndown)',
  phu: { en: 'Chapter 9 deep lab · when will this story ship? · 10 marks · hidden data on Submit', vi: 'Deep lab chương 9 · khi nào story này lên? · 10 điểm · dữ liệu ẩn khi Nộp' },
  moTa: {
    en: `<p>The <b>ClubHub</b> product owner keeps one ordered backlog and asks: "When will S8 ship?" Build the forecast.</p>
<ul>
<li><b>A. <code>velocity(history, n)</code></b> — the average of the last <code>n</code> values of <code>history</code> (all of them if fewer), 1 decimal; 0 when there is no data or <code>n</code> ≤ 0.</li>
<li><b>B/C. <code>forecast(backlog, vel)</code></b> — fill sprints in backlog order without reordering: an item goes into the current sprint if it fits (sum ≤ <code>vel</code>), otherwise a new sprint starts. An item larger than <code>vel</code> cannot fit any sprint: list it in <code>tooBig</code> (it must be split) and continue. Return <code>{ plan: [{ sprint, items, points }], tooBig }</code>, sprints numbered from 1.</li>
<li><b>D. <code>burndown(total, done)</code></b> — remaining points after each sprint, never below 0.</li>
<li><b>E. <code>releaseDate(plan, startDate, sprintDays, targetId)</code></b> — the last day (YYYY-MM-DD) of the sprint that contains <code>targetId</code>; sprint 1 starts on <code>startDate</code> and every sprint lasts <code>sprintDays</code> calendar days; <code>null</code> if the item is not planned. Use UTC dates.</li>
</ul>
<p><b>Sample data</b>:</p>${preJson('HISTORY', HISTORY)}${preJson('BACKLOG', BACKLOG)}`,
    vi: `<p>PO của ClubHub giữ một backlog có thứ tự và hỏi: "Khi nào S8 lên?" Hãy viết công cụ dự báo.</p><ul><li>A. <code>velocity</code> — trung bình n sprint gần nhất, 1 chữ số.</li><li>B/C. <code>forecast</code> — xếp theo đúng thứ tự backlog; không vừa thì mở sprint mới; story lớn hơn velocity ⇒ tooBig.</li><li>D. <code>burndown</code> — điểm còn lại sau mỗi sprint, không âm.</li><li>E. <code>releaseDate</code> — ngày cuối của sprint chứa story (UTC).</li></ul>`,
  },
  chucNangChinh: [{ en: 'A. Velocity.', vi: 'A. Velocity.' }, { en: 'B. Sprint plan.', vi: 'B. Kế hoạch sprint.' }, { en: 'C. Stories to split.', vi: 'C. Story phải tách.' }, { en: 'D. Burndown.', vi: 'D. Burndown.' }, { en: 'E. Release date.', vi: 'E. Ngày phát hành.' }, { en: 'F. Inputs untouched.', vi: 'F. Không sửa đầu vào.' }],
  yeuCauChung: [{ en: 'Pure functions; UTC dates.', vi: 'Hàm thuần; ngày theo UTC.' }],
  cayThuMuc: `answers/
├── sample-data.js   ← HISTORY, BACKLOG
└── forecast.js      ← velocity, forecast, burndown, releaseDate`,
  moHinh: { ten: 'Data shapes', truong: [['history', 'number[]', { en: 'oldest first', vi: 'cũ nhất trước' }], ['backlog item', '{ id, points }', { en: 'ordered by the PO', vi: 'PO sắp thứ tự' }], ['plan', '[{ sprint, items[], points }]', { en: '', vi: '' }]] },
  chucNang: [
    { ten: { en: 'A. velocity', vi: 'A. velocity' }, diem: 1.5, yeuCau: [{ en: 'Last n, 1 decimal.', vi: 'n gần nhất, 1 chữ số.' }], hook: ['velocity'] },
    { ten: { en: 'B. forecast plan', vi: 'B. forecast — kế hoạch' }, diem: 3, yeuCau: [{ en: 'Backlog order kept.', vi: 'Giữ thứ tự backlog.' }], hook: ['release planning'] },
    { ten: { en: 'C. tooBig', vi: 'C. tooBig' }, diem: 1, yeuCau: [{ en: 'Larger than the velocity.', vi: 'Lớn hơn velocity.' }], hook: ['story splitting'] },
    { ten: { en: 'D. burndown', vi: 'D. burndown' }, diem: 1.5, yeuCau: [{ en: 'Never negative.', vi: 'Không âm.' }], hook: ['burndown'] },
    { ten: { en: 'E. releaseDate', vi: 'E. releaseDate' }, diem: 2.5, yeuCau: [{ en: 'Calendar arithmetic in UTC.', vi: 'Tính ngày theo UTC.' }], hook: ['forecasting'] },
    { ten: { en: 'F. Inputs untouched', vi: 'F. Không sửa đầu vào' }, diem: 0.5, yeuCau: [{ en: 'No mutation.', vi: 'Không sửa đầu vào.' }], hook: ['immutability'] },
  ],
  idBatBuoc: [['velocity · forecast · burndown · releaseDate', 'answers/forecast.js']],
  truDiem: [
    { en: 'Pulling a small later story into an earlier sprint — the product owner’s order is the contract.', vi: 'Kéo story nhỏ phía sau lên sprint trước — thứ tự của PO là cam kết.' },
    { en: 'Off-by-one in the release date: a 14-day sprint starting 2 Nov ends 15 Nov.', vi: 'Lệch một ngày: sprint 14 ngày bắt đầu 2/11 kết thúc 15/11.' },
  ],
  goiY: ['history.slice(-n) lấy n phần tử cuối.', 'Ngày cuối = start + (sprint × sprintDays − 1) ngày, dùng Date.UTC.'],
  loiHayGap: ['Dùng new Date("2026-11-02") rồi getDate() theo giờ địa phương.', 'Bỏ S6 khỏi kế hoạch mà không báo cần tách.'],
  giaiThich: {
    en: '<p>With a velocity of 20 (last three sprints), S6 (21 points) cannot fit any sprint — it is an epic to split before planning. The rest needs three sprints; S8 lands in sprint 3, so with two-week sprints from 2 Nov 2026 it ships on 13 Dec 2026. Forecasts like this are only as good as the backlog order and the story sizes — revisit them every sprint.</p>',
    vi: '<p>Velocity 20 (ba sprint gần nhất) ⇒ S6 (21 điểm) không vừa sprint nào — là epic phải tách trước khi lập kế hoạch. Phần còn lại cần ba sprint; S8 ở sprint 3, nên với sprint hai tuần từ 2/11/2026 sẽ lên ngày 13/12/2026. Dự báo chỉ tốt bằng thứ tự backlog và kích thước story — xem lại mỗi sprint.</p>',
  },
  khaiNiem: ['velocity', 'release planning', 'burndown'],
  tienQuyet: ['Lab 9', 'SWR302 lessons 9.1 and 9.3'],
  thuatNgu: [...tn('backlog', 'epic', 'userStory'), { en: 'velocity', vi: 'vận tốc — số điểm đội hoàn thành mỗi sprint' }, { en: 'burndown', vi: 'biểu đồ điểm còn lại theo thời gian' }],
  moTaNgan: 'Deep lab chương 9: dự báo bản phát hành — velocity, kế hoạch sprint, burndown, ngày lên.',
  phut: 60,
  tep: TEP,
  kiem: KIEM,
  boYeu: [{ ten: 'xếp lại để lấp chỗ, lệch một ngày', tep: { 'answers/forecast.js': "function velocity(h,n){ var x=h.slice(-n); return x.length?x.reduce(function(s,v){return s+v;},0)/x.length:0; }\nfunction forecast(b,v){ var plan=[],big=[]; b.forEach(function(it){ if(it.points>v){big.push(it.id);return;} var s=plan.filter(function(p){return p.points+it.points<=v;})[0]; if(!s){ s={sprint:plan.length+1,items:[],points:0}; plan.push(s);} s.items.push(it.id); s.points+=it.points; }); return {plan:plan,tooBig:big}; }\nfunction burndown(t,d){ var l=t; return d.map(function(x){ l-=x; return l; }); }\nfunction releaseDate(plan,start,days,id){ var s=plan.filter(function(p){return p.items.indexOf(id)>=0;})[0]; if(!s) return null; var d=new Date(start); d.setDate(d.getDate()+s.sprint*days); return d.toISOString().slice(0,10); }\n" } }],
});
