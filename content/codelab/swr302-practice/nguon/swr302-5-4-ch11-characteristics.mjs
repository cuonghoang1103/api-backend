/**
 * SWR302 · 5.3 — Characteristics of excellent requirements (Wiegers Ch.11 slides 1–11).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, moDun } from './_bai.mjs';

const E1 = tracNghiem({
  tieuDe: 'Characteristics 1 — of each requirement, or of the set?',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Wiegers: each requirement should be <b>complete, correct, feasible, necessary, prioritized, unambiguous and verifiable</b>; the set of requirements should be <b>complete, consistent, modifiable and traceable</b>.</p>', vi: '<p>Wiegers: mỗi yêu cầu nên <b>đầy đủ, đúng, khả thi, cần thiết, có ưu tiên, không mơ hồ, kiểm chứng được</b>; tập yêu cầu nên <b>đầy đủ, nhất quán, sửa được, truy vết được</b>.</p>' },
  cau: [
    { en: '"Consistent" is a characteristic of…', vi: '"Nhất quán" là đặc tính của…', lc: [['a', 'each requirement'], ['b', 'the set of requirements'], ['c', 'the code'], ['d', 'the test plan']], dap: 'b', giai: ['Consistency is about requirements not conflicting with each other.', 'Nhất quán là các yêu cầu không mâu thuẫn nhau.'] },
    { en: '"Verifiable" means…', vi: '"Kiểm chứng được" nghĩa là…', lc: [['a', 'the customer has signed it'], ['b', 'a test or another method can show whether it is correctly implemented'], ['c', 'it is short'], ['d', 'it has an ID']], dap: 'b', giai: ['If you cannot test it, you cannot prove it is met.', 'Không test được thì không chứng minh được đã đạt.'] },
    { en: '"Necessary" means the requirement…', vi: '"Cần thiết" nghĩa là yêu cầu…', lc: [['a', 'traces to a business need or objective'], ['b', 'is technically easy'], ['c', 'was requested by a developer'], ['d', 'is in the template']], dap: 'a', giai: ['Otherwise it is gold plating.', 'Nếu không, đó là mạ vàng.'] },
    { en: '"Modifiable" refers to the set being…', vi: '"Sửa được" nói tập yêu cầu…', lc: [['a', 'easy to change without side effects: each requirement stated once, well organised, with a history'], ['b', 'written in Word'], ['c', 'always changing'], ['d', 'locked']], dap: 'a', giai: ['No duplication, clear structure, version history.', 'Không trùng lặp, cấu trúc rõ, có lịch sử phiên bản.'] },
  ],
  goiY: ['Nhất quán, sửa được, truy vết được ⇒ của TẬP yêu cầu.', 'Cần thiết = truy về nhu cầu/mục tiêu nghiệp vụ.'],
  loiHayGap: ['Cho rằng "nhất quán" áp cho từng yêu cầu riêng lẻ.', 'Nhầm verifiable với "đã được duyệt".'],
  giaiThich: '<p>Answers: b · b · a · a.</p>',
  thuatNgu: tn('verifiable', 'ambiguous'),
  khaiNiem: ['characteristics of excellent requirements'],
});

const DT = ['Complete', 'Correct', 'Feasible', 'Necessary', 'Prioritized', 'Unambiguous', 'Verifiable', 'Consistent', 'Traceable'];
const E2 = phanLoai({
  tieuDe: 'Characteristics 2 — which characteristic is violated?',
  doKho: 'MEDIUM', phut: 9,
  moTa: { en: '<p>Each requirement from a student-housing app breaks one characteristic. Name it.</p>', vi: '<p>Mỗi yêu cầu của app nhà ở sinh viên vi phạm một đặc tính. Gọi tên nó.</p>' },
  cot: 'Violated', luaChon: DT,
  hang: [
    ['The system shall be user-friendly.', 'Verifiable'],
    ['The system shall show nearby rooms. (Nearby = 500 m? 5 km? by road?)', 'Unambiguous'],
    ['The system shall respond to every request in 1 ms over the mobile network.', 'Feasible'],
    ['The system shall send a refund within 24 hours. (Elsewhere: "refunds are sent within 7 days".)', 'Consistent'],
    ['The system shall show a 3D tour of every room. (No objective or user asked for it.)', 'Necessary'],
    ['The system shall let a tenant pay rent by … (the sentence stops here).', 'Complete'],
    ['The deposit is two months’ rent. (The housing policy says one month.)', 'Correct'],
    ['FR-12 has no link to any user requirement, design element or test.', 'Traceable'],
    ['All 140 requirements are marked "High".', 'Prioritized'],
  ],
  giaiThich: '<p>Vague words ⇒ not verifiable or ambiguous; impossible targets ⇒ infeasible; two statements disagree ⇒ inconsistent; nobody needs it ⇒ unnecessary; cut sentence ⇒ incomplete; contradicts the source ⇒ incorrect; no links ⇒ not traceable; everything High ⇒ not prioritized.</p>',
  goiY: ['Mâu thuẫn với một yêu cầu KHÁC ⇒ consistent; mâu thuẫn với NGUỒN (chính sách) ⇒ correct.', '"Nearby" hiểu nhiều cách ⇒ unambiguous.'],
  loiHayGap: ['Nhầm correct với consistent.', 'Chọn verifiable cho "nearby" — vấn đề gốc là mơ hồ.'],
  thuatNgu: tn('verifiable', 'ambiguous', 'goldPlating'),
  khaiNiem: ['characteristics of excellent requirements'],
});

const E3 = tracNghiem({
  tieuDe: 'Characteristics 3 — choose the better requirement',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>For each pair, choose the requirement that is closer to "excellent".</p>', vi: '<p>Với mỗi cặp, chọn yêu cầu gần với "xuất sắc" hơn.</p>' },
  cau: [
    { en: 'Search', vi: 'Tìm kiếm', lc: [['a', 'Search shall be fast.'], ['b', 'The system shall display the first 20 matching rooms within 2 seconds after the tenant submits a search, for 95% of searches.']], dap: 'b', giai: ['Verifiable and unambiguous.', 'Kiểm chứng được và không mơ hồ.'] },
    { en: 'Notifications', vi: 'Thông báo', lc: [['a', 'The system shall notify the landlord and/or the tenant when appropriate.'], ['b', 'The system shall e-mail the landlord within 5 minutes after a tenant submits a viewing request.']], dap: 'b', giai: ['No "and/or", no "when appropriate".', 'Không "and/or", không "khi phù hợp".'] },
    { en: 'Payments', vi: 'Thanh toán', lc: [['a', 'The system shall use Stripe and store card numbers in table cards.'], ['b', 'The system shall accept rent payments by card through the payment provider selected by the company.']], dap: 'b', giai: ['A need, not a design decision.', 'Một nhu cầu, không phải quyết định thiết kế.'] },
  ],
  goiY: ['Có số, đơn vị, điều kiện ⇒ kiểm chứng được.', 'Tránh chọn sẵn công nghệ/thiết kế trong yêu cầu.'],
  loiHayGap: ['Chọn câu ngắn hơn vì "gọn".', 'Coi tên nhà cung cấp cụ thể là yêu cầu.'],
  giaiThich: '<p>Answers: b · b · b.</p>',
  thuatNgu: tn('verifiable', 'ambiguous'),
  khaiNiem: ['writing excellent requirements'],
});

const E4 = phanLoai({
  tieuDe: 'Characteristics 4 — a property of each requirement or of the set?',
  doKho: 'EASY', phut: 4,
  moTa: { en: '<p>Wiegers: each requirement should be complete, correct, feasible, necessary, prioritized, unambiguous and verifiable; the set of requirements should be complete, consistent, modifiable and traceable. Classify each characteristic as stated in the slides.</p>', vi: '<p>Đặc tính của từng yêu cầu hay của tập yêu cầu?</p>' },
  cot: 'Applies to', luaChon: ['Each requirement', 'The set of requirements'],
  hang: [['Feasible', 'Each requirement'], ['Consistent', 'The set of requirements'], ['Verifiable', 'Each requirement'], ['Modifiable', 'The set of requirements'], ['Prioritized', 'Each requirement'], ['Traceable', 'The set of requirements']],
  giaiThich: '<p>"Complete" appears in both lists: each requirement must be complete in itself, and the set must contain all requirements.</p>',
  goiY: ['Nhất quán, sửa được, truy vết được ⇒ tập.', 'Khả thi, kiểm được, có ưu tiên ⇒ từng yêu cầu.'],
  loiHayGap: ['Xếp "consistent" cho từng yêu cầu.', 'Xếp "prioritized" cho tập.'],
  thuatNgu: tn('verifiable'),
  khaiNiem: ['characteristics of excellent requirements'],
});

export default moDun({
  slug: 'swr302-5-4-ch11-characteristics',
  ten: '5.4 Characteristics of excellent requirements',
  moTaModule: 'Đặc tính của từng yêu cầu (đầy đủ, đúng, khả thi, cần thiết, có ưu tiên, không mơ hồ, kiểm chứng được) và của tập yêu cầu (đầy đủ, nhất quán, sửa được, truy vết được); gọi tên đặc tính bị vi phạm; chọn yêu cầu tốt hơn.',
  de: [E1, E3, E2, E4],
});
