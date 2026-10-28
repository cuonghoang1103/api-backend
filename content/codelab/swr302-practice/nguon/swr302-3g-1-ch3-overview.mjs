/**
 * SWR302 · 3G.1 — How the requirements good practices are organized (Wiegers Ch.3 slides 1–6, Table 3-1).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, sapXep, moDun } from './_bai.mjs';
import { NHOM_TH } from './_thuchanh.mjs';

const E1 = phanLoai({
  tieuDe: 'Good practices 1 — which group does it belong to?',
  doKho: 'EASY', phut: 7,
  moTa: { en: '<p>Wiegers Table 3-1 groups about fifty good practices into seven groups: <b>elicitation, analysis, specification, validation, requirements management, knowledge</b> and <b>project management</b>. Put each practice in its group.</p>', vi: '<p>Bảng 3-1 nhóm khoảng năm mươi thực hành tốt thành bảy nhóm. Xếp mỗi thực hành vào nhóm của nó.</p>' },
  cot: 'Group', luaChon: Object.keys(NHOM_TH),
  hang: [
    ['Observe users performing their jobs', 'Elicitation'],
    ['Create a data dictionary', 'Analysis'],
    ['Uniquely label each requirement', 'Specification'],
    ['Define acceptance criteria', 'Validation'],
    ['Track the status of each requirement', 'Requirements management'],
    ['Create a glossary', 'Knowledge'],
    ['Renegotiate project commitments when requirements change', 'Project management'],
    ['Prioritize the requirements', 'Analysis'],
    ['Record business rules', 'Specification'],
    ['Perform impact analysis on requirements changes', 'Requirements management'],
  ],
  giaiThich: '<p>Note two that surprise students: prioritisation is an <i>analysis</i> practice, and impact analysis is a <i>management</i> practice.</p>',
  goiY: ['Ưu tiên nằm ở nhóm Analysis.', 'Thứ liên quan baseline/thay đổi/trạng thái/truy vết ⇒ Requirements management.'],
  loiHayGap: ['Xếp prioritization vào project management.', 'Xếp glossary vào specification.'],
  thuatNgu: [{ en: 'good practice', vi: 'thực hành tốt' }],
  khaiNiem: ['requirements good practices'],
});

const E2 = tracNghiem({
  tieuDe: 'Good practices 2 — an iterative process',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Requirements development is iterative — elicit, analyse, specify, validate, then loop — throughout development (and throughout the whole project on agile). Table 3-1 is a checklist: you rarely apply all fifty practices, but you consciously choose which to apply and why.</p>', vi: '<p>Phát triển yêu cầu là quá trình lặp; Bảng 3-1 là checklist để chọn có ý thức.</p>' },
  cau: [
    { en: 'Requirements development is best described as…', vi: 'Phát triển yêu cầu được mô tả đúng nhất là…', lc: [['a', 'an iterative loop of elicitation, analysis, specification and validation'], ['b', 'a one-pass phase finished before design'], ['c', 'something only testers do'], ['d', 'writing the SRS once']], dap: 'a', giai: ['It loops.', 'Nó lặp.'] },
    { en: 'How should a team use Table 3-1?', vi: 'Đội nên dùng Bảng 3-1 thế nào?', lc: [['a', 'As a checklist to consciously choose which practices fit the project'], ['b', 'Apply all fifty practices on every project'], ['c', 'Ignore it on small projects'], ['d', 'Only for audits']], dap: 'a', giai: ['Choose, with reasons.', 'Chọn, có lý do.'] },
  ],
  goiY: ['Không có pha "làm một lần là xong".', 'Chọn thực hành có ý thức.'],
  loiHayGap: ['Áp mọi thực hành một cách máy móc.', 'Coi yêu cầu là pha một lần.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: tn('elicitation', 'analysis', 'specification', 'validation'),
  khaiNiem: ['requirements development process'],
});

const E3 = phanLoai({
  tieuDe: 'Good practices 3 — once early, or per iteration?',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>In Wiegers’ representative process, the first steps lay the foundation and are done once early in the project (revisited periodically); the remaining steps are repeated for each release or iteration. Classify each step.</p>', vi: '<p>Trong quy trình đại diện của Wiegers, các bước đầu đặt nền móng (làm một lần, xem lại định kỳ); các bước còn lại lặp mỗi bản phát hành/vòng lặp.</p>' },
  cot: 'When', luaChon: ['Once early (revisited periodically)', 'Repeated per release or iteration'],
  hang: [
    ['Define the business requirements (vision and scope)', 'Once early (revisited periodically)'],
    ['Identify user classes', 'Once early (revisited periodically)'],
    ['Select product champions', 'Once early (revisited periodically)'],
    ['Elicit the user requirements for the next increment', 'Repeated per release or iteration'],
    ['Prioritise the requirements of the increment', 'Repeated per release or iteration'],
    ['Review and validate the requirements of the increment', 'Repeated per release or iteration'],
  ],
  giaiThich: '<p>Set the foundation once, refine per iteration — the shape of most real projects.</p>',
  goiY: ['Tầm nhìn, lớp người dùng, product champion ⇒ nền móng.', 'Khai thác, ưu tiên, thẩm định cho phần kế tiếp ⇒ lặp.'],
  loiHayGap: ['Khai thác toàn bộ yêu cầu một lần đầu dự án.', 'Đổi product champion mỗi sprint.'],
  thuatNgu: tn('visionScope', 'userClass', 'productChampion'),
  khaiNiem: ['representative requirements process'],
});

const E4 = sapXep({
  tieuDe: 'Good practices 4 — the development loop',
  doKho: 'EASY', phut: 3,
  moTa: { en: '<p>Order the four requirements development activities in one pass of the loop (Figure 3-1/3-2).</p>', vi: '<p>Sắp bốn hoạt động phát triển yêu cầu trong một vòng lặp.</p>' },
  cau: [{ en: 'One pass of the loop', vi: 'Một vòng lặp', dung: ['Elicitation', 'Analysis', 'Specification', 'Validation'], hien: [2, 3, 0, 1], giai: ['Then loop back as understanding grows.', 'Rồi quay lại khi hiểu biết tăng lên.'] }],
  goiY: ['Thu thập trước, phân tích, viết, rồi kiểm.', 'Sau thẩm định là quay lại khai thác.'],
  loiHayGap: ['Đặt thẩm định trước đặc tả.', 'Đặt phân tích trước khai thác.'],
  giaiThich: '<p>Elicitation → Analysis → Specification → Validation → (repeat).</p>',
  thuatNgu: tn('elicitation', 'analysis', 'specification', 'validation'),
  khaiNiem: ['requirements development process'],
});

export default moDun({
  slug: 'swr302-3g-1-ch3-overview',
  ten: '2.6 Good practices: how they are organized',
  moTaModule: 'Bảy nhóm thực hành tốt của Wiegers (Bảng 3-1), quy trình phát triển yêu cầu lặp, bước làm một lần vs lặp mỗi vòng.',
  de: [E1, E2, E3, E4],
});
