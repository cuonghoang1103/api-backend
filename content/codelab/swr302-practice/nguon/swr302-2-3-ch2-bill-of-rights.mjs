/**
 * SWR302 · 2.2 — The customer’s Requirements Bill of Rights and Bill of Responsibilities; decision makers and agreement (Wiegers Ch.2).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, moDun } from './_bai.mjs';

const QUYEN = ['R1 BAs speak your language', 'R2 BAs learn your business', 'R3 Requirements recorded appropriately', 'R4 Explanations of practices and deliverables', 'R5 Change your requirements', 'R6 Mutual respect', 'R7 Hear ideas and alternatives', 'R8 Describe usability needs', 'R9 Hear about reuse', 'R10 A system that meets your needs'];
const TRACH = ['P1 Educate BAs about your business', 'P2 Dedicate the time', 'P3 Be specific and precise', 'P4 Make timely decisions', 'P5 Respect cost and feasibility assessments', 'P6 Set realistic priorities', 'P7 Review requirements and prototypes', 'P8 Establish acceptance criteria', 'P9 Promptly communicate changes', 'P10 Respect the requirements process'];

const E1 = phanLoai({
  tieuDe: 'Rights and responsibilities 1 — which right?',
  doKho: 'EASY', phut: 7,
  moTa: { en: `<p>The ten rights of a software customer (Wiegers Ch.2): ${QUYEN.join(' · ')}. Which right is at stake in each situation?</p>`, vi: '<p>Mười quyền của khách hàng phần mềm (Wiegers Ch.2) — xem danh sách ở bản tiếng Anh. Quyền nào đang được nói tới trong từng tình huống?</p>' },
  cot: 'Right', luaChon: QUYEN,
  hang: [
    ['The clinic staff ask the BA to stop saying "CRUD" and "actor" in meetings.', 'R1 BAs speak your language'],
    ['The BA spends two days at the front desk watching how bookings are taken.', 'R2 BAs learn your business'],
    ['The owner asks why she must sign off a "baseline" and what it means for later changes.', 'R4 Explanations of practices and deliverables'],
    ['The BA proposes an SMS reminder instead of the phone calls the nurses asked for, explaining the trade-offs.', 'R7 Hear ideas and alternatives'],
    ['Elderly patients ask for large buttons and a one-tap rebooking flow.', 'R8 Describe usability needs'],
    ['Halfway through the project the owner adds online payment, accepting the impact on cost and schedule.', 'R5 Change your requirements'],
  ],
  giaiThich: '<p>Each right describes something the customer may expect from the BA and the developers; the matching responsibility is usually its mirror (e.g. R5 change ↔ P9 communicate changes promptly and P10 respect the process).</p>',
  goiY: ['Quyền = điều khách hàng được KỲ VỌNG từ BA và đội phát triển.', 'Đề xuất phương án khác ⇒ R7; giải thích quy trình/tài liệu ⇒ R4.'],
  loiHayGap: ['Nhầm R2 (BA tìm hiểu nghiệp vụ) với P1 (khách dạy BA về nghiệp vụ).', 'Coi thay đổi yêu cầu là không được phép — đó là một quyền, đi kèm trách nhiệm theo quy trình.'],
  thuatNgu: [{ en: 'Requirements Bill of Rights', vi: 'mười quyền của khách hàng về yêu cầu (Wiegers)' }],
  khaiNiem: ['customer rights'],
});

const E2 = phanLoai({
  tieuDe: 'Rights and responsibilities 2 — which responsibility is not met?',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: `<p>The ten responsibilities of a software customer: ${TRACH.join(' · ')}. In each situation a customer fails one responsibility — which one?</p>`, vi: '<p>Mười trách nhiệm của khách hàng phần mềm (xem bản tiếng Anh). Trong mỗi tình huống, khách hàng không làm tròn một trách nhiệm — trách nhiệm nào?</p>' },
  cot: 'Responsibility', luaChon: TRACH,
  hang: [
    ['The owner cancels three requirement workshops in a row because she is "too busy".', 'P2 Dedicate the time'],
    ['A nurse says "make it work like the old system" and cannot say what that means.', 'P3 Be specific and precise'],
    ['The team waits two weeks for the owner to decide whether walk-ins can book online.', 'P4 Make timely decisions'],
    ['The owner rejects the developers’ 4-week estimate for insurance integration without any reason.', 'P5 Respect cost and feasibility assessments'],
    ['Every feature is labelled "Must" by the owner.', 'P6 Set realistic priorities'],
    ['The receptionists learn about a new pricing rule but tell the BA only after the release.', 'P9 Promptly communicate changes'],
    ['A doctor asks a developer directly to add a feature, skipping the change request process.', 'P10 Respect the requirements process'],
  ],
  giaiThich: '<p>Responsibilities are what the customer must do for the partnership to work: give time and precise input, decide on time, respect estimates, prioritise realistically, communicate changes, follow the process.</p>',
  goiY: ['Trách nhiệm = điều khách hàng PHẢI làm.', 'Mọi thứ "Must" ⇒ không đặt ưu tiên thực tế (P6).'],
  loiHayGap: ['Chọn P10 cho mọi tình huống "khách làm sai".', 'Nhầm P4 (quyết định kịp thời) với P2 (dành thời gian).'],
  thuatNgu: [{ en: 'Requirements Bill of Responsibilities', vi: 'mười trách nhiệm của khách hàng về yêu cầu (Wiegers)' }],
  khaiNiem: ['customer responsibilities'],
});

const E3 = tracNghiem({
  tieuDe: 'Rights and responsibilities 3 — decision makers and reaching agreement',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Wiegers Ch.2 ends with decision making: identify early who decides each kind of requirements issue, agree on a decision rule, and record the agreement as a requirements <b>baseline</b>.</p>', vi: '<p>Wiegers Ch.2 kết thúc bằng việc ra quyết định: xác định sớm ai quyết định từng loại vấn đề yêu cầu, thống nhất luật ra quyết định, và ghi thoả thuận thành <b>baseline</b> yêu cầu.</p>' },
  cau: [
    { en: 'What is a requirements baseline?', vi: 'Baseline yêu cầu là gì?', lc: [['a', 'The first draft of the SRS'], ['b', 'The set of requirements agreed upon, reviewed and approved, that serves as the basis for further work and is then changed only through change control'], ['c', 'The list of all ideas ever proposed'], ['d', 'The test plan']], dap: 'b', giai: ['After baselining, changes go through the change control process.', 'Sau baseline, thay đổi phải qua quy trình kiểm soát thay đổi.'] },
    { en: 'When should the project decide who has the authority to resolve requirements conflicts?', vi: 'Khi nào dự án nên xác định ai có quyền giải quyết xung đột yêu cầu?', lc: [['a', 'When the first conflict blocks the team'], ['b', 'Early, before conflicts arise'], ['c', 'Never — the BA decides everything'], ['d', 'At the end, during acceptance testing']], dap: 'b', giai: ['Identify decision makers and the decision rule early.', 'Xác định người quyết định và luật quyết định từ sớm.'] },
    { en: 'The customers will not sign off the requirements. What does Wiegers suggest?', vi: 'Khách hàng không chịu ký duyệt yêu cầu. Wiegers gợi ý gì?', lc: [['a', 'Start coding anyway and hope'], ['b', 'Treat sign-off as agreement on the baseline, record the assumptions and risks, and track the open issues'], ['c', 'Stop the project'], ['d', 'Let the developers sign instead']], dap: 'b', giai: ['Sign-off means "I agree this is our best understanding today; changes follow the process".', 'Ký duyệt nghĩa là "tôi đồng ý đây là hiểu biết tốt nhất hôm nay; thay đổi theo quy trình".'] },
  ],
  goiY: ['Baseline = bộ yêu cầu đã thống nhất, từ đó thay đổi phải qua kiểm soát.', 'Ai quyết định — xác định TRƯỚC khi có xung đột.'],
  loiHayGap: ['Coi baseline là "đóng băng mãi mãi".', 'Đợi xung đột xảy ra mới hỏi ai có quyền quyết định.'],
  giaiThich: '<p>Answers: b · b · b.</p>',
  thuatNgu: tn('baseline', 'ccb'),
  khaiNiem: ['decision makers', 'requirements baseline'],
});

const E4 = phanLoai({
  tieuDe: 'Rights 4 — which right is not respected?',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: '<p>Each complaint from a customer shows one of the ten rights of Wiegers’ Requirements Bill of Rights not being respected. Name it.</p>', vi: '<p>Mỗi lời phàn nàn của khách cho thấy một trong mười quyền không được tôn trọng. Gọi tên quyền đó.</p>' },
  cot: 'Right', luaChon: ['1 Speak your language', '2 Learn your business and objectives', '3 Record requirements in an appropriate form', '4 Receive explanations of practices and deliverables', '5 Change your requirements', '6 An environment of mutual respect', '7 Hear ideas and alternatives', '8 Describe usability characteristics', '9 Hear about reuse options', '10 Receive a system that meets your needs'],
  hang: [
    ['"The analyst keeps talking about microservices and JSON; I just want to book rooms."', '1 Speak your language'],
    ['"They sent a diagram full of symbols and nobody explained how to read it."', '4 Receive explanations of practices and deliverables'],
    ['"They just automated our old paper process, even the steps we hate."', '7 Hear ideas and alternatives'],
    ['"Nobody asked what ‘easy to use’ means for our staff."', '8 Describe usability characteristics'],
    ['"Our notes are scattered over 40 e-mails; there is no document we can review."', '3 Record requirements in an appropriate form'],
    ['"The team never watched how we work; they assumed they knew."', '2 Learn your business and objectives'],
  ],
  giaiThich: '<p>Rights 1–4 are about communication, 5–9 about the content and its evolution, and 10 is the conditional outcome of all of them.</p>',
  goiY: ['Thuật ngữ kỹ thuật ⇒ quyền #1.', 'Tự động hoá quy trình cũ y nguyên ("paving the cow paths") ⇒ quyền #7.'],
  loiHayGap: ['Nhầm #2 (học nghiệp vụ) với #1 (nói ngôn ngữ của khách).', 'Nhầm #3 (ghi lại) với #4 (giải thích).'],
  thuatNgu: [{ en: 'Bill of Rights', vi: 'Bản quyền lợi của khách hàng về yêu cầu' }],
  khaiNiem: ['customer rights'],
});

export default moDun({
  slug: 'swr302-2-3-ch2-bill-of-rights',
  ten: '2.3 The customer\u2019s Bill of Rights',
  moTaModule: 'Mười quyền và mười trách nhiệm của khách hàng theo Wiegers qua tình huống phòng khám MediBook, người ra quyết định, luật quyết định và baseline yêu cầu.',
  de: [E1, E2, E3, E4],
});
