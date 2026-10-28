/**
 * SWR302 · 1.2 — Why requirements engineering matters: the cost of late defects (Boehm), consequences, benefits.
 */
import { tn, kiemTuy } from './_chung.mjs';
import { phanLoai, tracNghiem, sapXep, baiJs, moDun } from './_bai.mjs';

const E1 = sapXep({
  tieuDe: 'Why RE 1 — where a requirement defect costs the most',
  doKho: 'EASY', phut: 4,
  moTa: { en: '<p>The cost of fixing a requirement defect grows with every phase it survives undetected (Boehm’s "1:10:100" observation; the lesson uses ×1 requirements, ×5 design, ×10 coding, ×20 testing, ×100+ production). Order the phases from the cheapest to the most expensive place to fix the same defect.</p>', vi: '<p>Chi phí sửa một lỗi yêu cầu tăng theo mỗi pha nó "sống sót" (quan sát 1:10:100 của Boehm). Sắp các pha từ nơi sửa rẻ nhất tới đắt nhất.</p>' },
  cau: [{ en: 'Cheapest → most expensive', vi: 'Rẻ nhất → đắt nhất', dung: ['Requirements', 'Design', 'Coding', 'Testing', 'Production'], hien: [4, 1, 3, 0, 2], giai: ['Everything built on a wrong requirement must change too.', 'Mọi thứ xây trên yêu cầu sai cũng phải đổi theo.'] }],
  goiY: ['Lỗi càng phát hiện muộn càng nhiều thứ phải làm lại.', 'Sản xuất (production) là đắt nhất: vá nóng, hoàn tiền, mất uy tín.'],
  loiHayGap: ['Cho rằng sửa ở kiểm thử rẻ hơn ở code.', 'Quên chi phí phi kỹ thuật ở production.'],
  giaiThich: '<p>Requirements → Design → Coding → Testing → Production.</p>',
  thuatNgu: [{ en: 'requirements defect', vi: 'lỗi yêu cầu' }, { en: 'rework', vi: 'làm lại' }],
  khaiNiem: ['cost of requirements defects'],
});

const E2 = baiJs({
  tieuDe: 'Why RE 2 — put a number on late defects',
  doKho: 'MEDIUM', phut: 10,
  moTa: { en: '<p>Use the multipliers of the lesson: requirements ×1, design ×5, coding ×10, testing ×20, production ×100. Fixing a defect during requirements costs <b>0.5 hour</b>. Write <code>function cost(foundIn)</code> that returns the hours to fix one requirement defect found in a phase (lower-case phase names; unknown phase ⇒ <code>null</code>), and <code>function totalCost(defects)</code> where <code>defects</code> is an object <code>{ phase: count }</code>; unknown phases are ignored.</p><p>Then set <code>SAVED_BY_REVIEW</code> to the hours saved if a 2-hour requirements review had found, during requirements, the 6 defects that a project later found in testing (4) and production (2) — review time included.</p>', vi: '<p>Hệ số: requirements ×1, design ×5, coding ×10, testing ×20, production ×100; sửa ở pha yêu cầu tốn 0,5 giờ. Viết <code>cost(foundIn)</code> và <code>totalCost(defects)</code>; rồi tính <code>SAVED_BY_REVIEW</code>: số giờ tiết kiệm nếu một buổi review 2 giờ đã bắt ngay ở pha yêu cầu 6 lỗi mà dự án về sau mới thấy ở kiểm thử (4) và production (2) — đã trừ 2 giờ review.</p>' },
  yeuCau: [{ en: 'cost("testing") = 10; totalCost({ coding: 2, production: 1 }) = 60.', vi: 'cost("testing") = 10; totalCost({ coding: 2, production: 1 }) = 60.' }],
  viDu: [{ input: "cost('production')", output: '50', explanation: '0.5 × 100|||0,5 × 100' }],
  tep: { 'cost.js': ["function cost(foundIn) {\n  return null;\n}\nfunction totalCost(defects) {\n  return 0;\n}\nconst SAVED_BY_REVIEW = 0;\n", "var MULT = { requirements: 1, design: 5, coding: 10, testing: 20, production: 100 };\nfunction cost(foundIn) {\n  return Object.prototype.hasOwnProperty.call(MULT, foundIn) ? 0.5 * MULT[foundIn] : null;\n}\nfunction totalCost(defects) {\n  return Object.keys(defects).reduce(function (s, p) { var c = cost(p); return c === null ? s : s + c * defects[p]; }, 0);\n}\n// Later: 4 × 10 + 2 × 50 = 140 h. With the review: 2 h + 6 × 0.5 h = 5 h. Saved: 135 h.\nconst SAVED_BY_REVIEW = totalCost({ testing: 4, production: 2 }) - (2 + totalCost({ requirements: 6 }));\n"] },
  kiem: [
    kiemTuy({ en: 'cost() for every phase', vi: 'cost() cho mọi pha' }, function () {
      if (typeof cost !== 'function') return 'cost is not a function';
      var c = [['requirements', 0.5], ['design', 2.5], ['coding', 5], ['testing', 10], ['production', 50]];
      for (var i = 0; i < c.length; i++) if (cost(c[i][0]) !== c[i][1]) return 'cost("' + c[i][0] + '") should be ' + c[i][1];
      return 'OK';
    }),
    kiemTuy({ en: 'cost() of an unknown phase is null', vi: 'cost() của pha lạ là null' }, function () {
      if (typeof cost !== 'function') return 'cost is not a function';
      return cost('maintenance') === null && cost('toString') === null ? 'OK' : 'unknown phases (even "toString") ⇒ null';
    }, { an: true }),
    kiemTuy({ en: 'totalCost() sums by phase', vi: 'totalCost() cộng theo pha' }, function () {
      if (typeof totalCost !== 'function') return 'totalCost is not a function';
      if (totalCost({ coding: 2, production: 1 }) !== 60) return 'totalCost({ coding: 2, production: 1 }) should be 60';
      return totalCost({ requirements: 4, alien: 3 }) === 2 ? 'OK' : 'ignore unknown phases';
    }),
    kiemTuy({ en: 'SAVED_BY_REVIEW', vi: 'SAVED_BY_REVIEW' }, function () {
      if (typeof SAVED_BY_REVIEW === 'undefined') return 'SAVED_BY_REVIEW is missing';
      return SAVED_BY_REVIEW === 135 ? 'OK' : 'later: 4 × 10 + 2 × 50 hours; with the review: 2 + 6 × 0.5 hours — got ' + SAVED_BY_REVIEW;
    }),
  ],
  goiY: ['Lập bảng hệ số; cost = 0,5 × hệ số.', 'Tiết kiệm = chi phí về sau − (giờ review + chi phí sửa ngay ở pha yêu cầu).'],
  loiHayGap: ['Quên trừ 2 giờ review.', 'Dùng MULT[foundIn] mà không kiểm hasOwnProperty.'],
  giaiThich: '<p>140 hours later versus 5 hours early: the review pays for itself 28 times. This is the economic argument for the whole discipline.</p>',
  thuatNgu: [{ en: 'cost of quality', vi: 'chi phí chất lượng' }],
  khaiNiem: ['cost of requirements defects'],
  boYeu: [{ ten: 'quên trừ review', tep: { 'cost.js': "function cost(p){ return 0.5*({requirements:1,design:5,coding:10,testing:20,production:100}[p]||0); }\nfunction totalCost(d){ var s=0; for (var k in d) s+=cost(k)*d[k]; return s; }\nconst SAVED_BY_REVIEW = 140;\n" } }],
});

const E3 = phanLoai({
  tieuDe: 'Why RE 3 — when bad requirements happen to good people',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Wiegers lists what happens when requirements are neglected. Name the consequence each story shows.</p>', vi: '<p>Wiegers liệt kê hậu quả khi coi nhẹ yêu cầu. Gọi tên hậu quả trong từng câu chuyện.</p>' },
  cot: 'Consequence', luaChon: ['Scope creep and rework', 'Wrong product', 'Schedule and budget overrun', 'Frustrated users and a mistrustful client'],
  hang: [
    ['The app does exactly what the SRS says, but nurses needed something different and refuse to use it.', 'Wrong product'],
    ['"Just one more report" is added every week; the team keeps rebuilding the dashboard.', 'Scope creep and rework'],
    ['The 4-month project is in month 7 and 40% over budget.', 'Schedule and budget overrun'],
    ['At the final demo the client sees the gap for the first time and stops trusting the team.', 'Frustrated users and a mistrustful client'],
  ],
  giaiThich: '<p>All four come from requirements nobody agreed on, checked, or managed.</p>',
  goiY: ['"Đúng như tài liệu nhưng sai nhu cầu" ⇒ sai sản phẩm.', '"Thêm một chút mỗi tuần" ⇒ phình phạm vi.'],
  loiHayGap: ['Gọi mọi trễ hạn là phình phạm vi.', 'Không phân biệt sai sản phẩm với lỗi code.'],
  thuatNgu: tn('scopeCreep'),
  khaiNiem: ['consequences of poor requirements'],
});

const E4 = tracNghiem({
  tieuDe: 'Why RE 4 — benefits and evidence',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>Benefits of a high-quality requirements process: fewer defects, less rework, more accurate estimates, shared understanding between customer and team, and a baseline to test against. Industry studies (e.g. Standish CHAOS) consistently rank incomplete requirements, lack of user involvement and changing requirements among the top causes of project failure.</p>', vi: '<p>Lợi ích của quy trình yêu cầu tốt và bằng chứng từ ngành.</p>' },
  cau: [
    { en: 'A manager says "requirements work slows us down". Best reply?', vi: 'Quản lý nói "làm yêu cầu làm chậm dự án". Trả lời tốt nhất?', lc: [['a', 'Skipping it slows you down later: defects found late cost many times more and cause rework.'], ['b', 'Yes, skip it.'], ['c', 'Only for big projects.'], ['d', 'Only testers need requirements.']], dap: 'a', giai: ['Rework is the hidden cost.', 'Làm lại là chi phí ẩn.'] },
    { en: 'Which is NOT a benefit of good requirements practices?', vi: 'Đâu KHÔNG phải lợi ích của thực hành yêu cầu tốt?', lc: [['a', 'Guaranteed zero defects'], ['b', 'More accurate estimates'], ['c', 'Less rework'], ['d', 'A baseline to test against']], dap: 'a', giai: ['They reduce defects, they do not eliminate them.', 'Giảm lỗi, không xoá hết lỗi.'] },
    { en: 'Industry studies rank which causes of project failure highest?', vi: 'Nghiên cứu ngành xếp nguyên nhân thất bại nào cao nhất?', lc: [['a', 'Incomplete requirements, lack of user involvement, changing requirements'], ['b', 'The programming language'], ['c', 'The office location'], ['d', 'The colour of the UI']], dap: 'a', giai: ['Fuzzy problems kill more projects than hard solutions.', 'Vấn đề mơ hồ giết nhiều dự án hơn lời giải khó.'] },
  ],
  goiY: ['RE không làm chậm — bỏ qua RE mới làm chậm.', 'Không có quy trình nào bảo đảm 0 lỗi.'],
  loiHayGap: ['Tin rằng RE tốt bảo đảm không lỗi.', 'Đổ lỗi thất bại cho công nghệ.'],
  giaiThich: '<p>Answers: a · a · a.</p>',
  thuatNgu: tn('requirement'),
  khaiNiem: ['benefits of requirements engineering'],
});

export default moDun({
  slug: 'swr302-1-2-vi-sao-re-quan-trong',
  ten: '1.2 Why requirements engineering matters',
  moTaModule: 'Chi phí sửa lỗi yêu cầu tăng theo pha (1:10:100), tự tính chi phí và số giờ tiết kiệm nhờ review, bốn hậu quả khi coi nhẹ yêu cầu, lợi ích và bằng chứng từ ngành.',
  de: [E1, E3, E2, E4],
});
