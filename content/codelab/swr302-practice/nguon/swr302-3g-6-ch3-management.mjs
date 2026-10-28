/**
 * SWR302 · 3G.6 — Requirements management good practices (Wiegers Ch.3 slides 41–49).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, sapXep, moDun } from './_bai.mjs';
import { NHOM_TH } from './_thuchanh.mjs';

const E1 = phanLoai({
  tieuDe: 'Management practices 1 — which practice?',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Eight requirements management practices. Which one does each action apply?</p>', vi: '<p>Tám thực hành quản lý yêu cầu. Mỗi hành động áp dụng thực hành nào?</p>' },
  cot: 'Practice', luaChon: NHOM_TH['Requirements management'],
  hang: [
    ['A CCB meets weekly to decide on proposed changes.', 'Establish a change control process'],
    ['Before deciding, the team lists the design, code and tests a change would touch and estimates 30 hours.', 'Perform impact analysis on requirements changes'],
    ['The approved SRS for release 1 is tagged "v1.0-baseline".', 'Establish baselines and control versions of requirements sets'],
    ['For FR-12 the tool records who changed it, when, what and why.', 'Maintain a history of requirements changes'],
    ['A dashboard shows 40 requirements Approved, 25 Implemented, 15 Verified.', 'Track the status of each requirement'],
    ['Every open question has one owner and a due date in the issue tracker.', 'Track requirements issues'],
    ['Each functional requirement is linked to its design, code and tests.', 'Maintain a requirements traceability matrix'],
    ['The team stores all requirements and their attributes in Jira with an RM plug-in.', 'Use a requirements management tool'],
  ],
  giaiThich: '<p>Change control decides; impact analysis informs the decision; baselines, history, status, issues and traceability keep the agreed set under control; a tool automates much of it.</p>',
  goiY: ['Quyết định thay đổi ⇒ change control; ước lượng ảnh hưởng ⇒ impact analysis.', 'Ai/khi nào/cái gì/vì sao ⇒ change history.'],
  loiHayGap: ['Nhầm change history với version control.', 'Nhầm status tracking với issue tracking.'],
  thuatNgu: tn('ccb', 'impactAnalysis', 'baseline', 'rtm'),
  khaiNiem: ['requirements management practices'],
});

const E2 = sapXep({
  tieuDe: 'Management practices 2 — the life of a requirement’s status',
  doKho: 'EASY', phut: 3,
  moTa: { en: '<p>"Track the status of each requirement": store a status attribute (proposed, approved, implemented, verified). Put the normal progression in order.</p>', vi: '<p>Sắp tiến trình trạng thái bình thường của một yêu cầu.</p>' },
  cau: [{ en: 'Normal status progression', vi: 'Tiến trình trạng thái', dung: ['Proposed', 'Approved', 'Implemented', 'Verified'], hien: [2, 0, 3, 1], giai: ['Counting requirements by status shows real progress.', 'Đếm yêu cầu theo trạng thái cho thấy tiến độ thật.'] }],
  goiY: ['Được duyệt trước khi làm.', 'Kiểm chứng sau khi hiện thực.'],
  loiHayGap: ['Đặt Verified trước Implemented.', 'Bỏ qua Approved.'],
  giaiThich: '<p>Proposed → Approved → Implemented → Verified (Deleted and Rejected are the other possible statuses).</p>',
  thuatNgu: [{ en: 'requirement status', vi: 'trạng thái yêu cầu' }],
  khaiNiem: ['status tracking'],
});

const E3 = tracNghiem({
  tieuDe: 'Management practices 3 — baselines, history and the RTM',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>A baseline is an agreed set of requirements (usually for a release); after it, change only through the change process; give every version a unique identifier. Keep each requirement’s change history. Populate the traceability matrix during development, not at the end.</p>', vi: '<p>Baseline, lịch sử thay đổi, RTM điền dần trong quá trình phát triển.</p>' },
  cau: [
    { en: 'Two teams argue about which SRS is current. Which practice was missing?', vi: 'Hai nhóm cãi nhau SRS nào là bản hiện hành. Thiếu thực hành nào?', lc: [['a', 'Baselines and unique version identifiers'], ['b', 'Focus groups'], ['c', 'Prototyping'], ['d', 'Glossary']], dap: 'a', giai: ['Version control of requirements sets.', 'Kiểm soát phiên bản tập yêu cầu.'] },
    { en: 'When should the traceability matrix be filled in?', vi: 'Khi nào điền ma trận truy vết?', lc: [['a', 'During development, as work products are created'], ['b', 'At the end of the project'], ['c', 'Only before audits'], ['d', 'Never']], dap: 'a', giai: ['Late tracing is costly and inaccurate.', 'Truy vết muộn tốn và thiếu chính xác.'] },
    { en: 'A requirement must be reverted to its earlier form. What makes this possible?', vi: 'Cần đưa một yêu cầu về dạng cũ. Điều gì giúp làm được?', lc: [['a', 'A history of requirements changes'], ['b', 'A product champion'], ['c', 'A questionnaire'], ['d', 'A prototype']], dap: 'a', giai: ['Change history.', 'Lịch sử thay đổi.'] },
  ],
  goiY: ['Bản nào hiện hành ⇒ baseline + định danh phiên bản.', 'Quay lại bản cũ ⇒ lịch sử thay đổi.'],
  loiHayGap: ['Điền RTM vào cuối dự án.', 'Lưu SRS không đánh phiên bản.'],
  giaiThich: '<p>Answers: a · a · a.</p>',
  thuatNgu: tn('baseline', 'rtm'),
  khaiNiem: ['baselines', 'traceability'],
});

const E4 = tracNghiem({
  tieuDe: 'Management practices 4 — issues and the CCB',
  doKho: 'EASY', phut: 4,
  moTa: { en: '<p>On complex projects open questions, gaps and review findings are easily lost: track them with one owner per issue. A Change Control Board of stakeholders decides which changes to accept and sets their priority and target release.</p>', vi: '<p>Theo dõi vấn đề với một người phụ trách mỗi vấn đề; CCB quyết thay đổi nào được nhận.</p>' },
  cau: [
    { en: 'How many owners should each requirements issue have?', vi: 'Mỗi vấn đề yêu cầu nên có mấy người phụ trách?', lc: [['a', 'Exactly one'], ['b', 'The whole team'], ['c', 'None'], ['d', 'Two, to be safe']], dap: 'a', giai: ['Shared ownership is no ownership.', 'Ai cũng phụ trách là không ai phụ trách.'] },
    { en: 'Who decides whether a proposed change is accepted and in which release?', vi: 'Ai quyết thay đổi đề xuất có được nhận và vào bản nào?', lc: [['a', 'The Change Control Board'], ['b', 'The developer who receives the e-mail'], ['c', 'The tester'], ['d', 'Whoever asks first']], dap: 'a', giai: ['The CCB.', 'CCB.'] },
  ],
  goiY: ['Một vấn đề — một người.', 'CCB quyết.'],
  loiHayGap: ['Để vấn đề không ai phụ trách.', 'Để dev tự quyết thay đổi.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: tn('ccb'),
  khaiNiem: ['issue tracking', 'change control'],
});

export default moDun({
  slug: 'swr302-3g-6-ch3-management',
  ten: '2.11 Good practices: requirements management',
  moTaModule: 'Tám thực hành quản lý yêu cầu (kiểm soát thay đổi, phân tích ảnh hưởng, baseline, lịch sử, trạng thái, vấn đề, RTM, công cụ), tiến trình trạng thái, khi nào điền RTM, CCB.',
  de: [E1, E2, E3, E4],
});
