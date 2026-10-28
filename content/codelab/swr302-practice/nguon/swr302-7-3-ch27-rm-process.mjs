/**
 * SWR302 · 7.3 — Requirements management practices: baseline, versions, attributes, status tracking (Wiegers Ch.27).
 */
import { tn, kiemTuy } from './_chung.mjs';
import { phanLoai, tracNghiem, baiJs, moDun } from './_bai.mjs';

const E1 = phanLoai({
  tieuDe: 'RM 1 — which requirements management activity?',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Wiegers Figure 27-1 groups requirements management into four activities: <b>version control</b>, <b>change control</b>, <b>requirements status tracking</b> and <b>requirements tracing</b>. Classify each task.</p>', vi: '<p>Hình 27-1: quản lý yêu cầu gồm bốn hoạt động. Phân loại từng việc.</p>' },
  cot: 'Activity', luaChon: ['Version control', 'Change control', 'Requirements status tracking', 'Requirements tracing'],
  hang: [
    ['Give each SRS release a unique version identifier and keep a revision history.', 'Version control'],
    ['Propose a change and have the CCB approve or reject it.', 'Change control'],
    ['Report that 40 of 60 requirements are Verified.', 'Requirements status tracking'],
    ['Link FR-12 to its use case, design element and test cases.', 'Requirements tracing'],
    ['Analyse the impact of a proposed change before deciding.', 'Change control'],
    ['Define the requirements baseline for release 1.0.', 'Version control'],
    ['Record that FR-30 moved from Approved to Implemented.', 'Requirements status tracking'],
  ],
  giaiThich: '<p>Version control identifies versions and baselines; change control proposes, analyses and decides changes; status tracking records each requirement’s status; tracing links requirements to origins and work products.</p>',
  goiY: ['Baseline gắn với version control.', 'Phân tích ảnh hưởng là một bước của change control.'],
  loiHayGap: ['Xếp baseline vào change control.', 'Nhầm status tracking với tracing.'],
  thuatNgu: tn('baseline', 'ccb', 'rtm'),
  khaiNiem: ['requirements management activities'],
});

const E2 = tracNghiem({
  tieuDe: 'RM 2 — baselines and requirement attributes',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>A <b>requirements baseline</b> is a set of requirements that has been reviewed and agreed upon and serves as the basis for further development; changes to it go through change control. Wiegers suggests storing <b>attributes</b> for each requirement, such as date created, version, author, priority, status, origin, rationale, release number, stakeholders to contact, validation method.</p>', vi: '<p><b>Baseline yêu cầu</b> là tập yêu cầu đã review và thống nhất, làm nền cho phát triển tiếp; thay đổi phải qua kiểm soát thay đổi. Wiegers gợi ý lưu <b>thuộc tính</b> cho mỗi yêu cầu: ngày tạo, phiên bản, tác giả, ưu tiên, trạng thái, nguồn gốc, lý do, bản phát hành, người liên hệ, cách thẩm định.</p>' },
  cau: [
    { en: 'After the baseline, the customer wants to edit a requirement directly in the SRS. Correct?', vi: 'Sau baseline, khách muốn sửa thẳng một yêu cầu trong SRS. Đúng không?', lc: [['a', 'No — submit a change request; the baseline changes only through change control'], ['b', 'Yes, customers own the SRS'], ['c', 'Yes, if it is a small change'], ['d', 'Only on Fridays']], dap: 'a', giai: ['That is the point of a baseline.', 'Đó là ý nghĩa của baseline.'] },
    { en: 'Which attribute helps answer "why do we need this requirement?"', vi: 'Thuộc tính nào trả lời "vì sao cần yêu cầu này?"', lc: [['a', 'Rationale'], ['b', 'Version'], ['c', 'Date created'], ['d', 'Release number']], dap: 'a', giai: ['Rationale records the reason.', 'Rationale ghi lý do.'] },
    { en: 'Which attribute helps decide whom to ask about a requirement?', vi: 'Thuộc tính nào giúp biết hỏi ai về một yêu cầu?', lc: [['a', 'Origin / stakeholders to contact'], ['b', 'Priority'], ['c', 'Status'], ['d', 'Validation method']], dap: 'a', giai: ['Origin points to the source.', 'Nguồn gốc trỏ tới người nêu.'] },
    { en: 'Version identifiers should…', vi: 'Định danh phiên bản nên…', lc: [['a', 'be unique for every revision so people know they read the current one'], ['b', 'stay the same forever'], ['c', 'be optional'], ['d', 'only change for major releases']], dap: 'a', giai: ['Everyone must know which version they read.', 'Ai cũng phải biết đang đọc bản nào.'] },
  ],
  goiY: ['Sau baseline: mọi thay đổi qua CR.', 'Rationale = lý do; origin = nguồn.'],
  loiHayGap: ['Sửa thẳng SRS sau baseline.', 'Nhầm rationale với origin.'],
  giaiThich: '<p>Answers: a · a · a · a.</p>',
  thuatNgu: tn('baseline'),
  khaiNiem: ['baseline', 'requirement attributes'],
});

const E3 = baiJs({
  tieuDe: 'RM 3 — a requirements status report',
  doKho: 'HARD', phut: 15,
  moTa: { en: '<p>Wiegers’ requirement statuses: <b>Proposed</b>, <b>Approved</b>, <b>Implemented</b>, <b>Verified</b>, <b>Deleted</b>, <b>Rejected</b>. Write <code>function statusReport(reqs)</code> where <code>reqs</code> is an array of <code>{ id, status }</code>. Return <code>{ counts, percentDone, invalid }</code>:</p><ul><li><code>counts</code>: an object with all six statuses as keys (0 when absent).</li><li><code>percentDone</code>: Verified ÷ (all valid requirements except Deleted and Rejected) × 100, rounded to the nearest whole number; 0 when the denominator is 0.</li><li><code>invalid</code>: sorted ids whose status is not one of the six (they are not counted elsewhere).</li></ul>', vi: '<p>Trạng thái yêu cầu của Wiegers: Proposed, Approved, Implemented, Verified, Deleted, Rejected. Viết <code>statusReport(reqs)</code> trả <code>{ counts, percentDone, invalid }</code>: counts có đủ sáu khoá; percentDone = Verified ÷ (yêu cầu hợp lệ trừ Deleted và Rejected) × 100, làm tròn; 0 nếu mẫu bằng 0; invalid = id có trạng thái lạ (sắp xếp).</p>' },
  yeuCau: [{ en: 'Status names are case-sensitive.', vi: 'Tên trạng thái phân biệt hoa thường.' }],
  viDu: [{ input: '[{id:"A",status:"Verified"},{id:"B",status:"Approved"},{id:"C",status:"Deleted"}]', output: '{ counts: {Proposed:0, Approved:1, Implemented:0, Verified:1, Deleted:1, Rejected:0}, percentDone: 50, invalid: [] }', explanation: '1 of 2 active.|||1 trên 2 yêu cầu còn hiệu lực.' }],
  tep: { 'status.js': ["function statusReport(reqs) {\n  // TODO\n  return { counts: {}, percentDone: 0, invalid: [] };\n}\n", "var STATUSES = ['Proposed', 'Approved', 'Implemented', 'Verified', 'Deleted', 'Rejected'];\n\nfunction statusReport(reqs) {\n  var counts = {};\n  STATUSES.forEach(function (s) { counts[s] = 0; });\n  var invalid = [];\n  reqs.forEach(function (r) {\n    if (STATUSES.indexOf(r.status) >= 0) counts[r.status]++;\n    else invalid.push(r.id);\n  });\n  var active = counts.Proposed + counts.Approved + counts.Implemented + counts.Verified;\n  var percentDone = active ? Math.round(counts.Verified * 100 / active) : 0;\n  return { counts: counts, percentDone: percentDone, invalid: invalid.sort() };\n}\n"] },
  kiem: (function () {
    function bo(moTa, data, fnKiem, ex) {
      return kiemTuy(moTa, new Function('var d = ' + JSON.stringify(data) + ";\nif (typeof statusReport !== 'function') return 'statusReport is not a function';\nvar r = statusReport(d); if (!r || !r.counts) return 'return { counts, percentDone, invalid }';\n" + fnKiem), ex);
    }
    var D1 = [{ id: 'A', status: 'Verified' }, { id: 'B', status: 'Approved' }, { id: 'C', status: 'Deleted' }];
    var D2 = [{ id: 'R7', status: 'Verified' }, { id: 'R1', status: 'Implemented' }, { id: 'R2', status: 'Verified' }, { id: 'R3', status: 'Rejected' }, { id: 'R9', status: 'done' }, { id: 'R4', status: 'Proposed' }, { id: 'R5', status: 'verified' }, { id: 'R6', status: 'Verified' }];
    return [
      bo({ en: 'counts include all six statuses', vi: 'counts có đủ sáu trạng thái' }, D1, "var k = ['Proposed','Approved','Implemented','Verified','Deleted','Rejected']; for (var i = 0; i < 6; i++) if (r.counts[k[i]] !== [0,1,0,1,1,0][i]) return 'counts.' + k[i] + ' should be ' + [0,1,0,1,1,0][i]; return 'OK';"),
      bo({ en: 'percentDone excludes Deleted and Rejected', vi: 'percentDone bỏ Deleted và Rejected' }, D1, "return r.percentDone === 50 ? 'OK' : 'percentDone should be 50, got ' + r.percentDone;"),
      bo({ en: 'empty list ⇒ 0%, no crash', vi: 'danh sách rỗng ⇒ 0%, không lỗi' }, [], "return r.percentDone === 0 && r.invalid.length === 0 ? 'OK' : 'empty input ⇒ percentDone 0, invalid []';"),
      bo({ en: 'hidden: invalid statuses (case-sensitive), sorted', vi: 'ẩn: trạng thái lạ (phân biệt hoa thường), sắp xếp' }, D2, "return JSON.stringify(r.invalid) === JSON.stringify(['R5','R9']) ? 'OK' : 'invalid should be [\"R5\",\"R9\"], got ' + JSON.stringify(r.invalid);", { an: true }),
      bo({ en: 'hidden: percentDone rounding', vi: 'ẩn: làm tròn percentDone' }, D2, "return r.percentDone === 60 && r.counts.Verified === 3 ? 'OK' : 'expected Verified 3 of 5 active ⇒ 60%, got ' + r.percentDone + '% (Verified ' + r.counts.Verified + ')';", { an: true }),
    ];
  })(),
  goiY: ['Khởi tạo counts với sáu khoá = 0 trước.', 'Mẫu số = Proposed + Approved + Implemented + Verified.'],
  loiHayGap: ['Tính cả Deleted/Rejected vào mẫu số.', 'Đếm "verified" (chữ thường) như Verified.'],
  giaiThich: '<p>Status tracking gives an honest view of progress: "percent verified" is more meaningful than "percent coded". Deleted and Rejected requirements are kept for history but excluded from progress.</p>',
  thuatNgu: [{ en: 'requirement status', vi: 'trạng thái yêu cầu' }],
  khaiNiem: ['requirements status tracking'],
  boYeu: [{ ten: 'mẫu số tính cả Deleted', tep: { 'status.js': "function statusReport(reqs){ var c={Proposed:0,Approved:0,Implemented:0,Verified:0,Deleted:0,Rejected:0}, inv=[]; reqs.forEach(function(r){ var s=r.status.charAt(0).toUpperCase()+r.status.slice(1); if(c.hasOwnProperty(s)) c[s]++; else inv.push(r.id); }); return {counts:c, percentDone: reqs.length? Math.round(c.Verified*100/reqs.length):0, invalid:inv.sort()}; }\n" } }],
});

export default moDun({
  slug: 'swr302-7-3-ch27-rm-process',
  ten: '7.3 Requirements management practices',
  moTaModule: 'Bốn hoạt động quản lý yêu cầu (version control, change control, status tracking, tracing), baseline và thuộc tính yêu cầu, tự viết báo cáo trạng thái yêu cầu (Proposed…Rejected) chấm trên dữ liệu ẩn.',
  de: [E1, E2, E3],
});
