/**
 * SWR302 · 31I.3 — The improvement cycle, process assets and the road map (Wiegers Ch.31 slides 16–25).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, sapXep, moDun } from './_bai.mjs';

const E1 = sapXep({
  tieuDe: 'Improvement cycle 1 — the four steps',
  doKho: 'EASY', phut: 3,
  moTa: { en: '<p>Figure 31-5: the process improvement cycle. Order its steps.</p>', vi: '<p>Hình 31-5: chu trình cải tiến quy trình. Sắp các bước.</p>' },
  cau: [{ en: 'Order the steps', vi: 'Sắp các bước', dung: ['Assess current practices', 'Plan improvement actions', 'Create, pilot and roll out processes', 'Evaluate results'], hien: [2, 0, 3, 1], giai: ['Know where you are, chart the course, try it, learn.', 'Biết mình ở đâu, vạch đường, thử, rút kinh nghiệm.'] }],
  goiY: ['Đánh giá hiện trạng trước.', 'Đánh giá kết quả sau cùng.'],
  loiHayGap: ['Triển khai trước khi đánh giá hiện trạng.', 'Bỏ bước đánh giá kết quả.'],
  giaiThich: '<p>Assess → Plan → Create/pilot/roll out → Evaluate (and repeat).</p>',
  thuatNgu: [{ en: 'process improvement cycle', vi: 'chu trình cải tiến quy trình' }],
  khaiNiem: ['improvement cycle'],
});

const E2 = phanLoai({
  tieuDe: 'Improvement cycle 2 — which step?',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>Which step of the cycle is each activity? Assessment can use the troubleshooting guide, questionnaires, interviews; action plans hold at most about ten items, each finishable in 2–3 months; new procedures are piloted on a small scale before roll-out; evaluation checks how the pilots and roll-out went and whether goals were met.</p>', vi: '<p>Mỗi hoạt động thuộc bước nào của chu trình?</p>' },
  cot: 'Step', luaChon: ['Assess current practices', 'Plan improvement actions', 'Create, pilot and roll out processes', 'Evaluate results'],
  hang: [
    ['BAs fill a questionnaire on how they elicit and prioritise today.', 'Assess current practices'],
    ['An action plan lists 8 items with owners, to finish in 10 weeks.', 'Plan improvement actions'],
    ['One team tries the new change-request form for a month.', 'Create, pilot and roll out processes'],
    ['The team checks whether rework from requirements fell as targeted.', 'Evaluate results'],
  ],
  giaiThich: '<p>Pilots reveal what to adjust before everyone is asked to change.</p>',
  goiY: ['Bảng hỏi hiện trạng ⇒ assess.', 'Một đội thử ⇒ pilot.'],
  loiHayGap: ['Kế hoạch 40 việc kéo dài một năm.', 'Tung ra toàn công ty không thí điểm.'],
  thuatNgu: [{ en: 'action plan', vi: 'kế hoạch hành động' }],
  khaiNiem: ['improvement cycle'],
});

const E3 = tracNghiem({
  tieuDe: 'Improvement cycle 3 — the valley of despair',
  doKho: 'MEDIUM', phut: 4,
  moTa: { en: '<p>Figure 31-7: the learning curve — a short-term productivity drop as people assimilate new ways of working, the "valley of despair". It is part of the investment, not a sign of failure; abandoning the effort in the valley yields a zero return.</p>', vi: '<p>"Thung lũng tuyệt vọng" của đường cong học tập.</p>' },
  cau: [
    { en: 'One month into the new inspection process, productivity drops. The manager wants to stop. Advice?', vi: 'Một tháng sau khi áp quy trình inspection mới, năng suất giảm. Quản lý muốn dừng. Lời khuyên?', lc: [['a', 'Expect the dip; keep going, support the team, and evaluate after the learning period'], ['b', 'Stop immediately'], ['c', 'Add three more new processes'], ['d', 'Blame the team']], dap: 'a', giai: ['Do not abandon in the valley.', 'Đừng bỏ cuộc giữa thung lũng.'] },
  ],
  goiY: ['Năng suất giảm tạm thời là dự kiến.', 'Đánh giá sau giai đoạn học.'],
  loiHayGap: ['Dừng giữa chừng.', 'Thêm nhiều thay đổi cùng lúc.'],
  giaiThich: '<p>Answers: a.</p>',
  thuatNgu: [{ en: 'learning curve', vi: 'đường cong học tập' }],
  khaiNiem: ['learning curve'],
});

const E4 = phanLoai({
  tieuDe: 'Improvement cycle 4 — process assets',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Requirements process assets (Figure 31-8) capture "how we do requirements here": <b>templates</b> (vision and scope, SRS, use case), <b>procedures</b> (elicitation, status tracking, change control), <b>checklists</b> (defect checklist, impact analysis checklist) and <b>examples</b>. Classify each asset.</p>', vi: '<p>Tài sản quy trình yêu cầu: template, thủ tục, checklist, ví dụ.</p>' },
  cot: 'Asset type', luaChon: ['Template', 'Procedure', 'Checklist', 'Example'],
  hang: [
    ['The SRS outline with section headings and guidance', 'Template'],
    ['Steps for submitting and deciding a change request', 'Procedure'],
    ['Questions to ask when inspecting requirements for defects', 'Checklist'],
    ['A well-written use case from a past project', 'Example'],
    ['The vision and scope document outline', 'Template'],
  ],
  giaiThich: '<p>Keep assets no larger than needed; they need not be separate documents, and they improve with experience.</p>',
  goiY: ['Khung có mục ⇒ template.', 'Các bước ⇒ procedure.'],
  loiHayGap: ['Nhầm checklist với procedure.', 'Tạo tài sản quá dày.'],
  thuatNgu: [{ en: 'process asset', vi: 'tài sản quy trình' }],
  khaiNiem: ['process assets'],
});

export default moDun({
  slug: 'swr302-31i-3-ch31-cycle-roadmap',
  ten: '12.9 The improvement cycle, process assets and road map',
  moTaModule: 'Bốn bước chu trình cải tiến, xếp hoạt động vào bước, "thung lũng tuyệt vọng" của đường cong học tập, các loại tài sản quy trình yêu cầu.',
  de: [E1, E2, E3, E4],
});
