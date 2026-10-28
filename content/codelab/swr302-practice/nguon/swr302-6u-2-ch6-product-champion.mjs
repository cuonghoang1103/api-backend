/**
 * SWR302 · 6U.2 — Connecting with users and the product champion (Wiegers Ch.6 slides 10–19).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, moDun } from './_bai.mjs';

const E1 = tracNghiem({
  tieuDe: 'Product champion 1 — who makes a good champion?',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p>A product champion is the primary interface between one user class and the BA — ideally an <b>actual user</b>, not a surrogate (sponsor, marketing, a manager, or a developer imagining being a user). Good champions have a clear vision of the system, are enthusiastic, respected by their peers, and have time and authority to decide at the user-requirements level.</p>', vi: '<p>Product champion là cầu nối giữa một lớp người dùng và BA — lý tưởng là người dùng thật.</p>' },
  cau: [
    { en: 'Best champion for the "pharmacist" user class of a hospital app?', vi: 'Champion tốt nhất cho lớp "dược sĩ"?', lc: [['a', 'An experienced pharmacist respected by colleagues, with time allocated to the project'], ['b', 'The hospital director'], ['c', 'A developer who once worked in a pharmacy for a week'], ['d', 'The marketing manager']], dap: 'a', giai: ['A real, respected user with time.', 'Người dùng thật, được tôn trọng, có thời gian.'] },
    { en: 'Who writes the requirements documents when champions are used?', vi: 'Khi có champion, ai viết tài liệu yêu cầu?', lc: [['a', 'The BA — champions gather and reconcile input from their user class'], ['b', 'Each champion writes their own SRS'], ['c', 'The developers'], ['d', 'Nobody']], dap: 'a', giai: ['Shared development, BA documents.', 'Cùng phát triển, BA viết tài liệu.'] },
    { en: 'At which level do champions make decisions?', vi: 'Champion ra quyết định ở cấp nào?', lc: [['a', 'User requirements, within the scope set by the business requirements'], ['b', 'Budget and schedule'], ['c', 'Architecture'], ['d', 'Hiring']], dap: 'a', giai: ['The sponsor keeps vision, scope, priorities, schedule, budget.', 'Nhà tài trợ giữ tầm nhìn, phạm vi, ưu tiên, lịch, ngân sách.'] },
  ],
  goiY: ['Người dùng thật, không phải người đại diện thay.', 'Champion quyết ở cấp yêu cầu người dùng.'],
  loiHayGap: ['Chọn quản lý làm champion.', 'Để champion quyết ngân sách.'],
  giaiThich: '<p>Answers: a · a · a.</p>',
  thuatNgu: tn('productChampion', 'userClass'),
  khaiNiem: ['product champion'],
});

const E2 = phanLoai({
  tieuDe: 'Product champion 2 — trap or healthy practice?',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Traps: managers overriding a duly authorised champion; a champion pushing only personal requirements; a champion without vision who defers everything to the BA; a senior user nominating a junior and then back-seat driving; anyone claiming to speak for a user class without really representing it. Classify each situation.</p>', vi: '<p>Bẫy khi dùng product champion. Phân loại từng tình huống.</p>' },
  cot: 'Situation', luaChon: ['Trap', 'Healthy practice'],
  hang: [
    ['The department head overrules every decision of the nurses’ champion.', 'Trap'],
    ['The champion asks five colleagues on other wards before deciding.', 'Healthy practice'],
    ['The champion answers every question with "whatever you think".', 'Trap'],
    ['Champion responsibilities are written down and agreed with each champion.', 'Healthy practice'],
    ['A senior pharmacist names a junior as champion, then re-decides everything behind the scenes.', 'Trap'],
    ['When the champions disagree, the BA brings the conflict to the agreed decision makers.', 'Healthy practice'],
  ],
  giaiThich: '<p>The model works when champions understand their duties, have authority at the user-requirements level, and have time.</p>',
  goiY: ['Bị cấp trên lấn quyền ⇒ bẫy.', 'Ghi rõ kỳ vọng với champion ⇒ thực hành tốt.'],
  loiHayGap: ['Coi champion "dễ tính" là tốt.', 'Bỏ qua việc champion hỏi đồng nghiệp.'],
  thuatNgu: tn('productChampion'),
  khaiNiem: ['product champion traps'],
});

const E3 = tracNghiem({
  tieuDe: 'Product champion 3 — external and multiple champions',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>For commercial software, outside champions are hard to find: use close corporate customers, beta sites or internal SMEs. With a diverse customer base, first find the core requirements common to all, then add those specific to segments or user classes. One person rarely covers all users: set up a team of champions, possibly with backup teams (Don the chemist built a backup team of five chemists).</p>', vi: '<p>Champion bên ngoài và nhiều champion.</p>' },
  cau: [
    { en: 'With external champions from three big customers, what do you do first?', vi: 'Có champion từ ba khách hàng lớn, bạn làm gì trước?', lc: [['a', 'Find the core requirements common to all, then add customer-specific ones'], ['b', 'Build each customer’s wish list separately'], ['c', 'Follow the largest customer only'], ['d', 'Ignore their input']], dap: 'a', giai: ['Common core first.', 'Lõi chung trước.'] },
    { en: 'A user class has 400 users in 6 locations. How do you engage them without huge workshops?', vi: 'Một lớp người dùng có 400 người ở 6 nơi. Thu hút họ thế nào mà không cần workshop khổng lồ?', lc: [['a', 'A champion with a small backup team of users from other locations'], ['b', 'One workshop with all 400'], ['c', 'Only e-mail the manager'], ['d', 'Skip them']], dap: 'a', giai: ['Hierarchical champions.', 'Champion theo tầng.'] },
  ],
  goiY: ['Lõi chung trước.', 'Champion + nhóm dự phòng.'],
  loiHayGap: ['Chạy theo khách lớn nhất.', 'Mời cả 400 người vào một phòng.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: tn('productChampion'),
  khaiNiem: ['external and multiple champions'],
});

const E4 = tracNghiem({
  tieuDe: 'Product champion 4 — communication pathways',
  doKho: 'EASY', phut: 4,
  moTa: { en: '<p>The most direct path from user to developer is a developer talking to users — workable only on very small projects. Every intervening layer adds miscommunication and delay, but a skilled BA adds value by collecting, evaluating, refining and organising input. Goal: as few, and as high-value, layers as possible. User representatives must be involved throughout the life cycle, not only at the start.</p>', vi: '<p>Đường giao tiếp từ người dùng tới dev: càng ít tầng và tầng càng giá trị càng tốt.</p>' },
  cau: [
    { en: 'Requests pass user → supervisor → department manager → IT liaison → BA → developer. The risk is…', vi: 'Yêu cầu đi qua người dùng → tổ trưởng → trưởng phòng → liên lạc IT → BA → dev. Rủi ro là…', lc: [['a', 'distortion and delay at every layer'], ['b', 'none'], ['c', 'too much testing'], ['d', 'the code gets faster']], dap: 'a', giai: ['Fewer, higher-value layers.', 'Ít tầng hơn, tầng có giá trị hơn.'] },
    { en: 'When should user representatives be involved?', vi: 'Khi nào cần đại diện người dùng tham gia?', lc: [['a', 'Throughout the life cycle'], ['b', 'Only at the kick-off'], ['c', 'Only at acceptance testing'], ['d', 'Never']], dap: 'a', giai: ['Continuous involvement.', 'Tham gia liên tục.'] },
  ],
  goiY: ['Mỗi tầng trung gian là một chỗ méo thông tin.', 'Tham gia suốt vòng đời.'],
  loiHayGap: ['Nghĩ thêm tầng là thêm kiểm soát.', 'Chỉ mời người dùng lúc đầu.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: tn('userClass'),
  khaiNiem: ['user representatives'],
});

export default moDun({
  slug: 'swr302-6u-2-ch6-product-champion',
  ten: '2.20 Connecting with users: the product champion',
  moTaModule: 'Chọn product champion tốt, ai viết tài liệu, quyền quyết định ở cấp yêu cầu người dùng, bẫy cần tránh, champion bên ngoài và nhiều champion, đường giao tiếp người dùng → dev.',
  de: [E1, E2, E3, E4],
});
