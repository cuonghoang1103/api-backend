/**
 * SWR302 · 7.1 — Change control: policy, CR life cycle, CCB (Wiegers Ch.28).
 */
import { tn, kiemTuy } from './_chung.mjs';
import { phanLoai, tracNghiem, sapXep, baiJs, moDun } from './_bai.mjs';

const E1 = sapXep({
  tieuDe: 'Change control 1 — the normal life of a change request',
  doKho: 'EASY', phut: 4,
  moTa: { en: '<p>Wiegers Figure 28-2: the states of a change request. On the normal (approved) path a request goes through six states. Put them in order.</p>', vi: '<p>Hình 28-2 của Wiegers: trạng thái của yêu cầu thay đổi. Trên đường bình thường (được duyệt) có sáu trạng thái. Sắp đúng thứ tự.</p>' },
  cau: [{ en: 'Order the states', vi: 'Sắp trạng thái', dung: ['Submitted', 'Evaluated', 'Approved', 'Change Made', 'Verified', 'Closed'], hien: [4, 2, 0, 5, 1, 3], giai: ['Rejected and Canceled are the other end states.', 'Rejected và Canceled là các trạng thái kết thúc khác.'] }],
  goiY: ['Phải đánh giá (Evaluated) trước khi CCB quyết.', 'Kiểm (Verified) sau khi sửa (Change Made).'],
  loiHayGap: ['Đặt Approved trước Evaluated.', 'Đóng ngay sau Change Made mà không Verified.'],
  giaiThich: '<p>Submitted → Evaluated → Approved → Change Made → Verified → Closed. A request may also end Rejected (by the CCB) or Canceled (withdrawn at any time).</p>',
  thuatNgu: tn('ccb', 'impactAnalysis'),
  khaiNiem: ['change request states'],
});

const E2 = tracNghiem({
  tieuDe: 'Change control 2 — policy and the CCB',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Wiegers’ change control policy includes: all changes must follow the process; no design or implementation work is done on unapproved changes, except feasibility studies; simply requesting a change does not guarantee it will be made; the contents of the change database are visible to all stakeholders; impact analysis is done for every change; every incorporated change is traceable to an approved change request. The <b>change control board (CCB)</b> decides which proposed changes are approved.</p>', vi: '<p>Chính sách kiểm soát thay đổi của Wiegers, và <b>CCB</b> là nhóm quyết định thay đổi nào được duyệt.</p>' },
  cau: [
    { en: 'A developer adds a "small" field the customer asked for by phone, without a CR. This breaks…', vi: 'Dev thêm một trường "nhỏ" khách xin qua điện thoại, không có CR. Vi phạm…', lc: [['a', '"all changes must follow the process" and traceability to an approved CR'], ['b', 'nothing — it was small'], ['c', 'the coding standard only'], ['d', 'the DoD']], dap: 'a', giai: ['Small unmanaged changes add up to scope creep.', 'Thay đổi nhỏ không quản lý cộng dồn thành phình phạm vi.'] },
    { en: 'Who should sit on a CCB?', vi: 'Ai nên ngồi trong CCB?', lc: [['a', 'Representatives of the groups affected: project management, product owner/BA, development, testing, customers or marketing…'], ['b', 'Only developers'], ['c', 'Only the person requesting the change'], ['d', 'Everyone in the company']], dap: 'a', giai: ['Decision makers representing the affected groups.', 'Người có quyền quyết, đại diện các nhóm bị ảnh hưởng.'] },
    { en: 'Before the CCB decides, the request must have…', vi: 'Trước khi CCB quyết, yêu cầu phải có…', lc: [['a', 'an impact analysis'], ['b', 'working code'], ['c', 'a test report'], ['d', 'nothing']], dap: 'a', giai: ['Decide with cost, schedule and risk in view.', 'Quyết định khi đã thấy chi phí, lịch và rủi ro.'] },
    { en: 'A change request was rejected. The requester should…', vi: 'Yêu cầu thay đổi bị từ chối. Người yêu cầu nên…', lc: [['a', 'be told the decision and its rationale, recorded in the change database'], ['b', 'not be told'], ['c', 'implement it anyway'], ['d', 'resubmit the same request every day']], dap: 'a', giai: ['Decisions and reasons are communicated and recorded.', 'Quyết định và lý do được thông báo và ghi lại.'] },
  ],
  goiY: ['Mọi thay đổi đi qua quy trình, kể cả nhỏ.', 'CCB quyết dựa trên impact analysis.'],
  loiHayGap: ['Cho phép dev tự nhận thay đổi "nhỏ".', 'Không thông báo lý do từ chối.'],
  giaiThich: '<p>Answers: a · a · a · a.</p>',
  thuatNgu: tn('ccb', 'scopeCreep', 'impactAnalysis'),
  khaiNiem: ['change control policy'],
});

const E3 = baiJs({
  tieuDe: 'Change control 3 — implement the CR state machine',
  doKho: 'HARD', phut: 15,
  moTa: { en: '<p>Write <code>function canMove(from, to)</code> for a change-tracking tool, following Wiegers’ CR life cycle: Submitted → Evaluated; Evaluated → Approved or Rejected; Approved → Change Made; Change Made → Verified; Verified → Closed; and a request can become <b>Canceled</b> from any state that is not final. <b>Closed</b>, <b>Rejected</b> and <b>Canceled</b> are final. No other transitions are allowed (no skipping, no going back). Return <code>true</code>/<code>false</code>. Unknown state names return <code>false</code>. Tested on all pairs.</p>', vi: '<p>Viết <code>canMove(from, to)</code> theo vòng đời CR của Wiegers: Submitted → Evaluated; Evaluated → Approved hoặc Rejected; Approved → Change Made; Change Made → Verified; Verified → Closed; và từ mọi trạng thái chưa kết thúc có thể sang <b>Canceled</b>. Closed, Rejected, Canceled là kết thúc. Chỉ các chuyển trên là hợp lệ. Tên trạng thái lạ ⇒ false. Kiểm trên mọi cặp.</p>' },
  yeuCau: [{ en: 'State names exactly: "Submitted", "Evaluated", "Approved", "Rejected", "Change Made", "Verified", "Closed", "Canceled".', vi: 'Tên trạng thái đúng chính tả như trên.' }],
  viDu: [{ input: 'canMove("Approved", "Canceled")', output: 'true', explanation: 'Not final ⇒ can be canceled.|||Chưa kết thúc ⇒ huỷ được.' }, { input: 'canMove("Closed", "Canceled")', output: 'false', explanation: 'Closed is final.|||Closed là kết thúc.' }],
  tep: { 'cr.js': ["function canMove(from, to) {\n  // TODO\n  return false;\n}\n", "var NEXT = {\n  'Submitted': ['Evaluated'],\n  'Evaluated': ['Approved', 'Rejected'],\n  'Approved': ['Change Made'],\n  'Change Made': ['Verified'],\n  'Verified': ['Closed'],\n  'Rejected': [], 'Closed': [], 'Canceled': [],\n};\nvar FINAL = ['Rejected', 'Closed', 'Canceled'];\n\nfunction canMove(from, to) {\n  if (!NEXT.hasOwnProperty(from) || !NEXT.hasOwnProperty(to)) return false;\n  if (to === 'Canceled') return FINAL.indexOf(from) < 0;\n  return NEXT[from].indexOf(to) >= 0;\n}\n"] },
  kiem: (function () {
    var S = ['Submitted', 'Evaluated', 'Approved', 'Rejected', 'Change Made', 'Verified', 'Closed', 'Canceled'];
    var ok = { 'Submitted>Evaluated': 1, 'Evaluated>Approved': 1, 'Evaluated>Rejected': 1, 'Approved>Change Made': 1, 'Change Made>Verified': 1, 'Verified>Closed': 1, 'Submitted>Canceled': 1, 'Evaluated>Canceled': 1, 'Approved>Canceled': 1, 'Change Made>Canceled': 1, 'Verified>Canceled': 1 };
    function bo(moTa, loc, ex) {
      var ca = [];
      S.forEach(function (a) { S.forEach(function (b) { if (loc(a, b)) ca.push([a, b, !!ok[a + '>' + b]]); }); });
      return kiemTuy(moTa, new Function('var ca = ' + JSON.stringify(ca) + ";\nif (typeof canMove !== 'function') return 'canMove is not a function';\nfor (var i = 0; i < ca.length; i++) { var r = canMove(ca[i][0], ca[i][1]); if (r !== ca[i][2]) return 'canMove(\"' + ca[i][0] + '\", \"' + ca[i][1] + '\") should be ' + ca[i][2] + ', got ' + r; }\nreturn 'OK';"), ex);
    }
    return [
      bo({ en: 'the normal path moves forward', vi: 'đường bình thường đi tiếp được' }, function (a, b) { return !!ok[a + '>' + b] && b !== 'Canceled'; }),
      bo({ en: 'no skipping or going backwards on the normal path', vi: 'không nhảy cóc, không lùi trên đường bình thường' }, function (a, b) { return ['Submitted', 'Evaluated', 'Approved', 'Change Made', 'Verified', 'Closed'].indexOf(a) >= 0 && ['Submitted', 'Evaluated', 'Approved', 'Change Made', 'Verified', 'Closed'].indexOf(b) >= 0; }),
      bo({ en: 'Canceled from any non-final state', vi: 'Canceled từ mọi trạng thái chưa kết thúc' }, function (a, b) { return b === 'Canceled'; }),
      bo({ en: 'final states never move', vi: 'trạng thái kết thúc không đi đâu' }, function (a) { return a === 'Closed' || a === 'Rejected' || a === 'Canceled'; }, { an: true }),
      kiemTuy({ en: 'unknown states return false', vi: 'trạng thái lạ trả false' }, function () {
        if (typeof canMove !== 'function') return 'canMove is not a function';
        if (canMove('Draft', 'Submitted') !== false || canMove('Submitted', 'Done') !== false || canMove('submitted', 'evaluated') !== false || canMove('toString', 'Canceled') !== false) return 'unknown state names must return false';
        return 'OK';
      }, { an: true }),
    ];
  })(),
  goiY: ['Dùng một bảng NEXT[from] = [các trạng thái kế].', 'Canceled: cho phép nếu from chưa phải trạng thái kết thúc.'],
  loiHayGap: ['Cho Closed → Canceled.', 'Dùng obj[from] mà không kiểm hasOwnProperty ⇒ "toString" lọt qua.'],
  giaiThich: '<p>A table of allowed next states plus one rule for Canceled is all the tool needs. Enforcing it stops changes being implemented before they are approved, and stops closed requests being reopened silently.</p>',
  thuatNgu: tn('ccb'),
  khaiNiem: ['change request states'],
  boYeu: [{ ten: 'huỷ cả trạng thái kết thúc', tep: { 'cr.js': "var N={'Submitted':['Evaluated'],'Evaluated':['Approved','Rejected'],'Approved':['Change Made'],'Change Made':['Verified'],'Verified':['Closed']};\nfunction canMove(a,b){ if(b==='Canceled') return true; return !!(N[a]&&N[a].indexOf(b)>=0); }\n" } }],
});

const E4 = phanLoai({
  tieuDe: 'Change control 4 — what should the CCB decide?',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Change requests for <b>PetCare</b> release 2 (two weeks before the release). For each, choose the most reasonable CCB decision: <b>Approve for this release</b>, <b>Defer to a later release</b> or <b>Reject</b>.</p>', vi: '<p>Yêu cầu thay đổi cho PetCare bản 2 (còn hai tuần tới ngày phát hành). Chọn quyết định CCB hợp lý nhất.</p>' },
  cot: 'Decision', luaChon: ['Approve for this release', 'Defer to a later release', 'Reject'],
  hang: [
    ['Law change: invoices must show the new 8% VAT from next month; 4 hours of work.', 'Approve for this release'],
    ['Add a loyalty-points programme; 3 weeks of work; not in the vision.', 'Defer to a later release'],
    ['Make the "Book" button purple because the developer likes purple.', 'Reject'],
    ['Defect: a booking can be made for a date in the past; 2 hours to fix.', 'Approve for this release'],
    ['Integrate with a pet-insurance partner that has not signed a contract yet.', 'Defer to a later release'],
    ['Remove the audit log to make saving faster; violates the clinic’s data-retention rule.', 'Reject'],
  ],
  giaiThich: '<p>Mandatory, small or defect-fixing changes fit; large or not-yet-ready features are deferred; changes without business value or that break rules are rejected.</p>',
  goiY: ['Luật bắt buộc + công nhỏ ⇒ duyệt.', 'Lớn, chưa sẵn sàng ⇒ hoãn; vô giá trị hoặc phạm luật ⇒ từ chối.'],
  loiHayGap: ['Duyệt mọi thứ khách xin.', 'Từ chối tính năng tốt thay vì hoãn.'],
  thuatNgu: tn('ccb', 'scopeCreep'),
  khaiNiem: ['CCB decisions'],
});

export default moDun({
  slug: 'swr302-7-1-change-control',
  ten: '7.1 Change control and the CCB',
  moTaModule: 'Vòng đời yêu cầu thay đổi (Submitted → … → Closed, Rejected, Canceled), chính sách kiểm soát thay đổi và CCB, tự cài máy trạng thái CR chấm trên mọi cặp, ra quyết định CCB cho 6 CR.',
  de: [E1, E2, E4, E3],
});
