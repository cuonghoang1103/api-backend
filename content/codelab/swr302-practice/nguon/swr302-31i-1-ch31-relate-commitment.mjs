/**
 * SWR302 · 31I.1 — How requirements relate to other processes; gaining commitment to change (Wiegers Ch.31 slides 1–10).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, moDun } from './_bai.mjs';

const E1 = phanLoai({
  tieuDe: 'Improvement 1 — which process do requirements feed?',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Figure 31-1: requirements are at the heart of a project and feed planning, tracking and control, change control, acceptance and system testing, construction, and user documentation. Which process does each effect describe?</p>', vi: '<p>Yêu cầu nuôi các quy trình khác của dự án.</p>' },
  cot: 'Process', luaChon: ['Project planning', 'Project tracking and control', 'Change control', 'Acceptance and system testing', 'Construction', 'User documentation'],
  hang: [
    ['Estimates show the full feature set cannot fit, so the release is staged.', 'Project planning'],
    ['Counting verified requirements shows the project is behind.', 'Project tracking and control'],
    ['After the baseline, a new requirement goes through the CCB.', 'Change control'],
    ['User requirements become the basis of the acceptance tests.', 'Acceptance and system testing'],
    ['Developers implement the functional requirements of the sprint.', 'Construction'],
    ['Late UI changes force the technical writer to redo the help pages.', 'User documentation'],
  ],
  giaiThich: '<p>Because requirements touch every process, changing how you do requirements always changes how other groups work — expect reactions.</p>',
  goiY: ['Ước lượng, chia đợt ⇒ planning.', 'Viết tài liệu người dùng "cuối chuỗi thức ăn" ⇒ user documentation.'],
  loiHayGap: ['Nghĩ cải tiến yêu cầu không ảnh hưởng nhóm khác.', 'Nhầm tracking với planning.'],
  thuatNgu: tn('ccb'),
  khaiNiem: ['requirements and other processes'],
});

const E2 = tracNghiem({
  tieuDe: 'Improvement 2 — understanding resistance',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>Changing requirements processes changes how stakeholder groups interact, and people dislike being pushed out of their comfort zone. Much resistance comes from fear of the unknown: communicate the rationale and the benefits each group will gain. People ask "What’s in it for me?" — the pay-off (less rework, lower support costs, more customer value) may not be immediate.</p>', vi: '<p>Hiểu nguồn gốc kháng cự; trả lời "tôi được gì?".</p>' },
  cau: [
    { en: 'Developers resist writing acceptance criteria with the BA. Best first step?', vi: 'Dev kháng cự việc viết tiêu chí chấp nhận cùng BA. Bước đầu tốt nhất?', lc: [['a', 'Explain the rationale and what they gain (less rework, fewer late surprises)'], ['b', 'Force it by management order only'], ['c', 'Give up'], ['d', 'Write them secretly']], dap: 'a', giai: ['Address "what’s in it for me".', 'Trả lời "tôi được gì".'] },
    { en: 'Most resistance to process change comes from…', vi: 'Phần lớn kháng cự với thay đổi quy trình đến từ…', lc: [['a', 'fear of the unknown'], ['b', 'laziness only'], ['c', 'the tools'], ['d', 'nothing — people love change']], dap: 'a', giai: ['Communicate to reduce the unknown.', 'Giao tiếp để giảm điều chưa biết.'] },
  ],
  goiY: ['Giải thích lý do và lợi ích.', 'Sợ điều chưa biết.'],
  loiHayGap: ['Chỉ dùng mệnh lệnh.', 'Coi kháng cự là lười biếng.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: [{ en: 'software process improvement (SPI)', vi: 'cải tiến quy trình phần mềm' }],
  khaiNiem: ['gaining commitment'],
});

const E3 = phanLoai({
  tieuDe: 'Improvement 3 — real management commitment?',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>Figure 31-3: commitment is what management does, not what it says — funding training and review time, protecting requirements activities from schedule pressure, taking part in prioritisation, holding people accountable for following the process. Which behaviours show real commitment?</p>', vi: '<p>Cam kết là điều quản lý làm, không phải điều quản lý nói.</p>' },
  cot: 'Behaviour', luaChon: ['Real commitment', 'Lip service'],
  hang: [
    ['The director funds two days of requirements training for every BA.', 'Real commitment'],
    ['A "Quality first" poster is hung in the corridor.', 'Lip service'],
    ['When the deadline is tight, the manager keeps the time for the SRS inspection.', 'Real commitment'],
    ['The manager praises the new process but approves skipping reviews every sprint.', 'Lip service'],
    ['Managers attend the prioritisation workshop and make the trade-off decisions.', 'Real commitment'],
  ],
  giaiThich: '<p>Watch what happens under schedule pressure — that reveals the real commitment.</p>',
  goiY: ['Bỏ tiền, giữ thời gian review khi gấp ⇒ cam kết thật.', 'Khẩu hiệu ⇒ nói suông.'],
  loiHayGap: ['Coi khẩu hiệu là cam kết.', 'Bỏ review khi gấp mà vẫn nói ủng hộ.'],
  thuatNgu: [{ en: 'management commitment', vi: 'cam kết của quản lý' }],
  khaiNiem: ['commitment behaviours'],
});

const E4 = tracNghiem({
  tieuDe: 'Improvement 4 — the end of the food chain',
  doKho: 'EASY', phut: 3,
  moTa: { en: '<p>A technical writer explained her long hours: "We’re at the end of the food chain — we have to respond to the final UI changes and to features dropped or added at the last minute." Poorly written or late-changing requirements hurt every group downstream.</p>', vi: '<p>Người viết tài liệu ở "cuối chuỗi thức ăn".</p>' },
  cau: [
    { en: 'Which improvement helps the documentation team most?', vi: 'Cải tiến nào giúp nhóm viết tài liệu nhiều nhất?', lc: [['a', 'Stable, baselined requirements with controlled, communicated changes'], ['b', 'More last-minute features'], ['c', 'Skipping the user guide'], ['d', 'Hiring more writers only']], dap: 'a', giai: ['Downstream groups need stability.', 'Nhóm phía sau cần ổn định.'] },
  ],
  goiY: ['Ổn định + thay đổi có kiểm soát.', 'Thông báo thay đổi kịp thời.'],
  loiHayGap: ['Thêm người thay vì sửa quy trình.', 'Bỏ tài liệu người dùng.'],
  giaiThich: '<p>Answers: a.</p>',
  thuatNgu: tn('baseline'),
  khaiNiem: ['requirements and documentation'],
});

export default moDun({
  slug: 'swr302-31i-1-ch31-relate-commitment',
  ten: '12.7 Requirements and other processes; gaining commitment',
  moTaModule: 'Yêu cầu nuôi lập kế hoạch, theo dõi, kiểm soát thay đổi, kiểm thử, xây dựng, tài liệu người dùng; hiểu kháng cự ("tôi được gì?"); cam kết thật của quản lý vs nói suông.',
  de: [E1, E2, E3, E4],
});
