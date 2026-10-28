/**
 * SWR302 · 6U.3 — User representation on agile projects and resolving conflicting requirements (Wiegers Ch.6 slides 20–21).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, moDun } from './_bai.mjs';

const E1 = tracNghiem({
  tieuDe: 'Agile users 1 — product owner vs product champion',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>Some agile methods put a single <b>product owner</b> on the team as the voice of the customer: they define the vision and develop and prioritise the product backlog. Unlike a product champion (one user class, user-requirements level), the product owner spans all three requirement levels — business, user and functional — straddling the champion and BA roles.</p>', vi: '<p>Product owner trải cả ba cấp yêu cầu; product champion đại diện một lớp người dùng ở cấp yêu cầu người dùng.</p>' },
  cau: [
    { en: 'The key difference between a product owner and a product champion is that the product owner…', vi: 'Khác biệt chính: product owner…', lc: [['a', 'spans business, user and functional requirements and prioritises the whole backlog'], ['b', 'only tests the product'], ['c', 'represents one user class only'], ['d', 'writes the code']], dap: 'a', giai: ['Three levels, whole backlog.', 'Ba cấp, cả backlog.'] },
    { en: 'On a Scrum team, who prioritises the product backlog?', vi: 'Trong Scrum, ai xếp ưu tiên product backlog?', lc: [['a', 'The product owner'], ['b', 'The Scrum Master'], ['c', 'The testers'], ['d', 'Each developer']], dap: 'a', giai: ['The PO owns the backlog.', 'PO sở hữu backlog.'] },
  ],
  goiY: ['PO = cả ba cấp + backlog.', 'Champion = một lớp người dùng.'],
  loiHayGap: ['Nghĩ Scrum Master xếp ưu tiên.', 'Coi PO chỉ là champion đổi tên.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: tn('productChampion', 'backlog'),
  khaiNiem: ['product owner'],
});

const E2 = phanLoai({
  tieuDe: 'Agile users 2 — who decides?',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Separate business from user requirements: the product champion decides at the user-requirements level within the scope set by the business requirements; the sponsor keeps authority over vision, scope, priorities, schedule and budget. Who decides each question?</p>', vi: '<p>Champion quyết ở cấp yêu cầu người dùng; nhà tài trợ giữ tầm nhìn, phạm vi, ưu tiên, lịch, ngân sách. Ai quyết từng câu hỏi?</p>' },
  cot: 'Decides', luaChon: ['Product champion of the user class', 'Executive sponsor'],
  hang: [
    ['Which fields the nurses need on the medication screen.', 'Product champion of the user class'],
    ['Whether the pharmacy module is in release 1 or release 2.', 'Executive sponsor'],
    ['The order of steps when a nurse records a dose.', 'Product champion of the user class'],
    ['Whether to add two months to the schedule.', 'Executive sponsor'],
    ['Which report formats the pharmacists find useful.', 'Product champion of the user class'],
    ['The budget for an extra integration.', 'Executive sponsor'],
  ],
  giaiThich: '<p>Clear decision rights make the champion model acceptable to management.</p>',
  goiY: ['Nội dung nhiệm vụ của người dùng ⇒ champion.', 'Phạm vi, lịch, tiền ⇒ nhà tài trợ.'],
  loiHayGap: ['Để champion quyết phạm vi bản phát hành.', 'Để nhà tài trợ quyết thứ tự các bước của y tá.'],
  thuatNgu: tn('productChampion', 'businessReq', 'userReq'),
  khaiNiem: ['decision rights'],
});

const E3 = tracNghiem({
  tieuDe: 'Agile users 3 — resolving conflicting requirements',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>When representatives of different user classes disagree, the decision makers resolve it, guided by the business objectives and the <b>favored user classes</b>. Document the resolution and its rationale so it is not re-argued.</p>', vi: '<p>Xung đột giữa các lớp người dùng được giải theo mục tiêu nghiệp vụ và lớp người dùng được ưu tiên; ghi lại quyết định và lý do.</p>' },
  cau: [
    { en: 'Doctors want a detailed screen; receptionists want a fast simple one. The business objective is shorter waiting times at the desk; receptionists are the favored class for check-in. Decision?', vi: 'Bác sĩ muốn màn hình chi tiết; lễ tân muốn màn hình nhanh, đơn giản. Mục tiêu: giảm chờ ở quầy; lễ tân là lớp được ưu tiên cho check-in. Quyết định?', lc: [['a', 'A fast, simple check-in screen for receptionists; details available elsewhere for doctors'], ['b', 'The doctors’ version everywhere'], ['c', 'Flip a coin'], ['d', 'Postpone forever']], dap: 'a', giai: ['Objectives and favored classes guide the decision.', 'Mục tiêu và lớp ưu tiên dẫn dắt quyết định.'] },
    { en: 'After the decision, the BA should…', vi: 'Sau quyết định, BA nên…', lc: [['a', 'record the decision and its rationale'], ['b', 'keep it in her head'], ['c', 'reopen it at every meeting'], ['d', 'tell only the developers']], dap: 'a', giai: ['Avoid re-litigating.', 'Tránh tranh cãi lại.'] },
  ],
  goiY: ['Mục tiêu nghiệp vụ + lớp được ưu tiên.', 'Ghi lại lý do.'],
  loiHayGap: ['Chiều theo người có chức vụ cao nhất.', 'Không ghi lại quyết định.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: tn('userClass'),
  khaiNiem: ['resolving conflicts'],
});

const E4 = phanLoai({
  tieuDe: 'Agile users 4 — favored, disfavored or ignored?',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>User classes differ in importance: <b>favored</b> classes (their satisfaction aligns most with the business objectives) win conflicts; <b>disfavored</b> classes should not use the product (for legal, security or safety reasons — you may add features to block them); <b>ignored</b> classes may use it but you do not build specifically for them. Classify for an online pharmacy.</p>', vi: '<p>Lớp người dùng được ưu tiên, không mong muốn, bị bỏ qua. Phân loại cho nhà thuốc trực tuyến.</p>' },
  cot: 'Class', luaChon: ['Favored', 'Disfavored', 'Ignored'],
  hang: [
    ['Patients ordering their prescribed medicines', 'Favored'],
    ['People trying to buy prescription-only drugs without a prescription', 'Disfavored'],
    ['Students who browse the catalogue for a school project', 'Ignored'],
    ['Bots scraping prices', 'Disfavored'],
  ],
  giaiThich: '<p>Disfavored classes generate requirements too — to keep them out.</p>',
  goiY: ['Mua thuốc kê đơn không có đơn ⇒ không mong muốn (luật).', 'Dùng được nhưng không thiết kế cho họ ⇒ bị bỏ qua.'],
  loiHayGap: ['Coi lớp không mong muốn là không liên quan tới yêu cầu.', 'Coi mọi người dùng như nhau.'],
  thuatNgu: tn('userClass'),
  khaiNiem: ['favored user classes'],
});

export default moDun({
  slug: 'swr302-6u-3-ch6-agile-conflicts',
  ten: '2.21 Users on agile projects and resolving conflicts',
  moTaModule: 'Product owner vs product champion, quyền quyết định của champion và nhà tài trợ, giải xung đột theo mục tiêu nghiệp vụ và lớp ưu tiên, lớp người dùng được ưu tiên/không mong muốn/bị bỏ qua.',
  de: [E1, E2, E3, E4],
});
