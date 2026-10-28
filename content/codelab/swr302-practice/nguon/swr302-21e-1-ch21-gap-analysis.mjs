/**
 * SWR302 · 21E.1 — Enhancement and replacement projects: challenges, business objectives, gap analysis, KPIs (Wiegers Ch.21 slides 1–8).
 */
import { tn, kiemTuy } from './_chung.mjs';
import { phanLoai, tracNghiem, baiJs, moDun } from './_bai.mjs';

const E1 = phanLoai({
  tieuDe: 'Enhancement 1 — enhancement or replacement project?',
  doKho: 'EASY', phut: 4,
  moTa: { en: '<p>An <b>enhancement</b> project adds capabilities to an existing system. A <b>replacement</b> (reengineering) project replaces an existing application with a new custom system, a COTS package, or a hybrid. Classify.</p>', vi: '<p>Dự án nâng cấp hay thay thế?</p>' },
  cot: 'Project type', luaChon: ['Enhancement', 'Replacement'],
  hang: [
    ['Add online payment to the existing clinic booking system.', 'Enhancement'],
    ['Retire the 15-year-old desktop pharmacy system and move to a new web system.', 'Replacement'],
    ['Replace the home-made HR tool with a commercial HR package.', 'Replacement'],
    ['Add an English interface to the current patient app.', 'Enhancement'],
  ],
  giaiThich: '<p>Both differ from greenfield work: a working system — and users’ expectations of it — already exist.</p>',
  goiY: ['Thêm vào hệ thống đang chạy ⇒ nâng cấp.', 'Bỏ hệ thống cũ ⇒ thay thế.'],
  loiHayGap: ['Coi chuyển sang gói thương mại là nâng cấp.', 'Quên kỳ vọng của người dùng hệ thống cũ.'],
  thuatNgu: [{ en: 'enhancement project', vi: 'dự án nâng cấp' }, { en: 'replacement project', vi: 'dự án thay thế' }],
  khaiNiem: ['enhancement and replacement projects'],
});

const E2 = tracNghiem({
  tieuDe: 'Enhancement 2 — expected challenges',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Expected challenges: changes that degrade performance users are used to; little or no documentation of the existing system; users who dislike changes; unknowingly omitting functionality vital to some stakeholders; stakeholders using the opportunity to request many new features. Counter gold plating and scope creep by tracing requirements to business objectives and implementing the highest-impact features first.</p>', vi: '<p>Thách thức thường gặp và cách chống mạ vàng / phình phạm vi.</p>' },
  cau: [
    { en: '"Since we are rebuilding anyway, let’s add everything we ever wanted." The BA should…', vi: '"Đằng nào cũng làm lại, thêm hết mọi thứ ta từng muốn." BA nên…', lc: [['a', 'trace each proposed feature to a business objective and prioritise the highest-impact ones'], ['b', 'accept every request'], ['c', 'refuse all new features'], ['d', 'let developers choose']], dap: 'a', giai: ['Business objectives guard the scope.', 'Mục tiêu nghiệp vụ giữ phạm vi.'] },
    { en: 'After go-live, the pharmacy team finds the new system no longer prints controlled-drug labels. This illustrates…', vi: 'Sau khi chạy, nhóm dược thấy hệ thống mới không còn in nhãn thuốc kiểm soát. Điều này minh hoạ…', lc: [['a', 'unknowingly omitting functionality vital to a stakeholder group'], ['b', 'gold plating'], ['c', 'good performance'], ['d', 'a usability improvement']], dap: 'a', giai: ['Hidden functionality of the old system.', 'Chức năng ẩn của hệ thống cũ.'] },
  ],
  goiY: ['Mọi tính năng phải truy về mục tiêu.', 'Chức năng "ai cũng quên" của hệ thống cũ.'],
  loiHayGap: ['Thêm mọi thứ vì "đằng nào cũng làm lại".', 'Không kiểm kê chức năng hệ thống cũ.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: tn('goldPlating', 'scopeCreep'),
  khaiNiem: ['challenges of replacement projects'],
});

const CU = ['Search patient', 'Book appointment', 'Print controlled-drug label', 'Export to fax', 'Monthly report'];
const MOI = ['Search patient', 'Book appointment', 'Online payment', 'Monthly report', 'SMS reminder'];
const E3 = baiJs({
  tieuDe: 'Enhancement 3 — a gap analysis',
  doKho: 'MEDIUM', phut: 10,
  moTa: { en: '<p>Gap analysis compares the functionality of the existing system with the desired new one (Figure 21-1). Write <code>function gap(existing, desired, retire)</code> returning <code>{ keep, add, missing }</code>: <code>keep</code> = in both; <code>add</code> = only in desired (new capabilities); <code>missing</code> = in existing, not in desired, and <b>not</b> listed in <code>retire</code> — functionality that may be lost by mistake and must be confirmed with stakeholders. Compare names case-insensitively, trimmed; keep the original spelling of the first list that contains the item; each list sorted alphabetically (case-insensitive).</p>', vi: '<p>Viết <code>gap(existing, desired, retire)</code> trả keep / add / missing (chức năng cũ có thể mất mà chưa được quyết định bỏ).</p>' },
  yeuCau: [{ en: 'On the sample with retire = ["export to fax"], missing = ["Print controlled-drug label"].', vi: 'Với retire = ["export to fax"], missing = ["Print controlled-drug label"].' }],
  viDu: [{ input: 'gap(EXISTING, DESIRED, ["export to fax"]).add', output: '["Online payment", "SMS reminder"]', explanation: '|||' }],
  tep: { 'gap.js': [`const EXISTING = ${JSON.stringify(CU)};\nconst DESIRED = ${JSON.stringify(MOI)};\nfunction gap(existing, desired, retire) {\n  return { keep: [], add: [], missing: [] };\n}\n`, `const EXISTING = ${JSON.stringify(CU)};\nconst DESIRED = ${JSON.stringify(MOI)};\nfunction gap(existing, desired, retire) {\n  function k(s) { return String(s).trim().toLowerCase(); }\n  function has(list, s) { return list.some(function (x) { return k(x) === k(s); }); }\n  function sx(a) { return a.slice().sort(function (x, y) { return k(x) < k(y) ? -1 : k(x) > k(y) ? 1 : 0; }); }\n  var keep = existing.filter(function (x) { return has(desired, x); });\n  var add = desired.filter(function (x) { return !has(existing, x); });\n  var missing = existing.filter(function (x) { return !has(desired, x) && !has(retire || [], x); });\n  return { keep: sx(keep).map(function (s) { return String(s).trim(); }), add: sx(add).map(function (s) { return String(s).trim(); }), missing: sx(missing).map(function (s) { return String(s).trim(); }) };\n}\n`] },
  kiem: [
    kiemTuy({ en: 'sample: keep and add', vi: 'mẫu: keep và add' }, function () {
      if (typeof gap !== 'function') return 'gap is not a function';
      var r = gap(EXISTING, DESIRED, ['export to fax']);
      if (JSON.stringify(r.keep) !== '["Book appointment","Monthly report","Search patient"]') return 'keep: got ' + JSON.stringify(r.keep);
      return JSON.stringify(r.add) === '["Online payment","SMS reminder"]' ? 'OK' : 'add: got ' + JSON.stringify(r.add);
    }),
    kiemTuy({ en: 'sample: missing functionality not explicitly retired', vi: 'mẫu: chức năng có thể mất mà chưa quyết định bỏ' }, function () {
      if (typeof gap !== 'function') return 'gap is not a function';
      var r = gap(EXISTING, DESIRED, ['export to fax']);
      return JSON.stringify(r.missing) === '["Print controlled-drug label"]' ? 'OK' : 'missing: got ' + JSON.stringify(r.missing);
    }),
    kiemTuy({ en: 'hidden: case, spaces, no retire list', vi: 'ẩn: hoa thường, khoảng trắng, không có danh sách bỏ' }, function () {
      if (typeof gap !== 'function') return 'gap is not a function';
      var r = gap([' Login ', 'b-Report', 'Archive'], ['login', 'Chat'], undefined);
      return JSON.stringify(r) === '{"keep":["Login"],"add":["Chat"],"missing":["Archive","b-Report"]}' ? 'OK' : 'got ' + JSON.stringify(r);
    }, { an: true }),
  ],
  goiY: ['So sánh sau khi trim + toLowerCase.', 'missing = cũ, không có trong mới, không nằm trong danh sách bỏ.'],
  loiHayGap: ['Coi mọi chức năng cũ không có trong mới là "cố ý bỏ".', 'So sánh phân biệt hoa thường.'],
  giaiThich: '<p>The dangerous column is <i>missing</i>: functionality nobody decided to retire, which some stakeholder may depend on — like the controlled-drug label.</p>',
  thuatNgu: [{ en: 'gap analysis', vi: 'phân tích khoảng trống' }],
  khaiNiem: ['gap analysis'],
  boYeu: [{ ten: 'không xét danh sách bỏ, phân biệt hoa thường', tep: { 'gap.js': `const EXISTING = ${JSON.stringify(CU)};\nconst DESIRED = ${JSON.stringify(MOI)};\nfunction gap(e,d,r){ return { keep:e.filter(function(x){return d.indexOf(x)>=0;}).sort(), add:d.filter(function(x){return e.indexOf(x)<0;}).sort(), missing:e.filter(function(x){return d.indexOf(x)<0;}).sort() }; }\n` } }],
});

const E4 = tracNghiem({
  tieuDe: 'Enhancement 4 — keeping performance levels (KPIs)',
  doKho: 'MEDIUM', phut: 4,
  moTa: { en: '<p>Existing systems set expectations for performance and throughput; stakeholders have KPIs for existing processes they want maintained. A key performance indicator model (KPIM) identifies these metrics so stakeholders see the new system will perform at least as well.</p>', vi: '<p>Giữ các chỉ số hiệu năng (KPI) của quy trình hiện tại.</p>' },
  cau: [
    { en: 'Today a receptionist checks in a patient in 40 seconds. For the replacement system you should…', vi: 'Hiện lễ tân check-in một bệnh nhân trong 40 giây. Với hệ thống thay thế bạn nên…', lc: [['a', 'record this KPI and specify that the new check-in takes at most 40 seconds'], ['b', 'ignore it — the new system is modern'], ['c', 'measure it after go-live only'], ['d', 'double it']], dap: 'a', giai: ['Preserve existing KPIs.', 'Giữ KPI hiện có.'] },
  ],
  goiY: ['KPI cũ ⇒ yêu cầu chất lượng mới.', 'Đo trước khi thay.'],
  loiHayGap: ['Cho rằng hệ thống mới tự nhiên nhanh hơn.', 'Chỉ đo sau khi chạy.'],
  giaiThich: '<p>Answers: a.</p>',
  thuatNgu: [{ en: 'KPI', vi: 'chỉ số hiệu suất chính' }],
  khaiNiem: ['KPIs'],
});

export default moDun({
  slug: 'swr302-21e-1-ch21-gap-analysis',
  ten: '12.1 Enhancement and replacement projects: gap analysis',
  moTaModule: 'Dự án nâng cấp vs thay thế, thách thức thường gặp, chống mạ vàng bằng mục tiêu nghiệp vụ, tự viết phân tích khoảng trống (keep/add/missing) có chấm, giữ KPI của hệ thống cũ.',
  de: [E1, E2, E3, E4],
});
