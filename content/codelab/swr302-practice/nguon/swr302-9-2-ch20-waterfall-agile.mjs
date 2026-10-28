/**
 * SWR302 · 9.2 — Limitations of the waterfall and the agile approach (Wiegers Ch.20 · 1–7).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, moDun } from './_bai.mjs';

const E1 = phanLoai({
  tieuDe: 'Waterfall vs agile 1 — which approach?',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Waterfall: a linear sequence — fully specify requirements, then design, code and test. Agile: iterative and incremental development in short iterations (sprints of one week to a month), each adding a small set of functionality, tested and validated against acceptance criteria, with ongoing customer participation. Which approach does each statement describe?</p>', vi: '<p>Waterfall: tuần tự — đặc tả đủ yêu cầu rồi thiết kế, code, test. Agile: lặp và tăng dần theo vòng ngắn, mỗi vòng thêm một ít chức năng, có khách tham gia liên tục.</p>' },
  cot: 'Approach', luaChon: ['Waterfall', 'Agile'],
  hang: [
    ['The full requirements set is signed off before design begins.', 'Waterfall'],
    ['Every two weeks the team demonstrates working features to the product owner.', 'Agile'],
    ['Customers are heavily involved at the start and again at user acceptance testing.', 'Waterfall'],
    ['Requirement details are clarified during the iteration that implements them.', 'Agile'],
    ['A long time passes between writing a requirement and customers seeing software built from it.', 'Waterfall'],
    ['Priorities are revisited before every iteration.', 'Agile'],
  ],
  giaiThich: '<p>The key differentiator is the time between creating a requirement and delivering software based on it: long for waterfall, short for agile.</p>',
  goiY: ['Ký duyệt toàn bộ trước ⇒ waterfall.', 'Demo định kỳ, làm rõ trong vòng ⇒ agile.'],
  loiHayGap: ['Cho rằng agile không có tiêu chí chấp nhận.', 'Nghĩ waterfall không có khách hàng tham gia.'],
  thuatNgu: tn('userStory', 'backlog'),
  khaiNiem: ['waterfall vs agile'],
});

const E2 = tracNghiem({
  tieuDe: 'Waterfall vs agile 2 — why the waterfall struggles',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Wiegers: large waterfall projects are often delivered late, lack needed features and miss expectations, because of the layers of dependency built on the requirements, and because stakeholders <b>will</b> change requirements — they do not know precisely what they want at the start.</p>', vi: '<p>Wiegers: dự án waterfall lớn thường trễ, thiếu tính năng, không đạt kỳ vọng vì nhiều lớp phụ thuộc xây trên yêu cầu, và vì khách <b>sẽ</b> đổi yêu cầu.</p>' },
  cau: [
    { en: 'The main advantage claimed for the waterfall is…', vi: 'Ưu điểm chính được nêu của waterfall là…', lc: [['a', 'catching flaws early, when fixing is cheaper'], ['b', 'no documentation'], ['c', 'no planning'], ['d', 'customers never change their minds']], dap: 'a', giai: ['Early, complete requirements in theory reduce later rework.', 'Về lý thuyết, yêu cầu đầy đủ sớm giảm làm lại.'] },
    { en: 'Why does feedback come late in a waterfall project?', vi: 'Vì sao phản hồi đến muộn trong waterfall?', lc: [['a', 'Customers see working software only near the end'], ['b', 'Testers are lazy'], ['c', 'The SRS is too short'], ['d', 'Feedback is forbidden']], dap: 'a', giai: ['So requirement errors surface at their most expensive.', 'Nên lỗi yêu cầu lộ ra lúc đắt nhất.'] },
    { en: 'Agile fits best when…', vi: 'Agile hợp nhất khi…', lc: [['a', 'requirements are uncertain or expected to evolve and customers can be continuously available'], ['b', 'requirements are fixed by contract and the customer is unavailable'], ['c', 'there is no customer'], ['d', 'the team never meets']], dap: 'a', giai: ['Uncertainty + available customers + value from early delivery.', 'Bất định + khách luôn sẵn + giá trị từ giao sớm.'] },
  ],
  goiY: ['Phản hồi muộn ⇒ lỗi yêu cầu đắt.', 'Agile cần khách tham gia liên tục.'],
  loiHayGap: ['Cho rằng agile = không kế hoạch.', 'Nghĩ waterfall không có ưu điểm nào.'],
  giaiThich: '<p>Answers: a · a · a.</p>',
  thuatNgu: tn('backlog'),
  khaiNiem: ['limitations of the waterfall'],
});

const E3 = phanLoai({
  tieuDe: 'Waterfall vs agile 3 — choose an approach for the project',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Choose the more suitable approach for each project: <b>more predictive (waterfall-like)</b>, or <b>adaptive (agile)</b>. Think about how stable the requirements are, how available the customer is, and the value of early delivery.</p>', vi: '<p>Chọn cách tiếp cận phù hợp hơn: <b>dự đoán (kiểu waterfall)</b> hay <b>thích ứng (agile)</b>.</p>' },
  cot: 'Approach', luaChon: ['More predictive (waterfall-like)', 'Adaptive (agile)'],
  hang: [
    ['A start-up app; the founders keep learning what users want from weekly feedback.', 'Adaptive (agile)'],
    ['Replacing a payroll module whose rules are fixed by law, with a fixed-price contract and a customer available only at milestones.', 'More predictive (waterfall-like)'],
    ['A new student portal; the product owner sits with the team every day and wants features released early.', 'Adaptive (agile)'],
    ['Firmware for a certified medical pump with strict, stable regulatory requirements.', 'More predictive (waterfall-like)'],
  ],
  giaiThich: '<p>Stable, regulated, contract-fixed requirements with little customer availability favour a predictive approach; evolving needs with an engaged product owner favour agile. Many real projects are hybrids.</p>',
  goiY: ['Yêu cầu ổn định + khách ít gặp ⇒ dự đoán.', 'Yêu cầu thay đổi + PO luôn có mặt ⇒ agile.'],
  loiHayGap: ['Chọn agile cho mọi dự án.', 'Bỏ qua mức sẵn sàng của khách hàng.'],
  thuatNgu: tn('backlog'),
  khaiNiem: ['choosing an approach'],
});

export default moDun({
  slug: 'swr302-9-2-ch20-waterfall-agile',
  ten: '9.2 Waterfall limits and the agile approach',
  moTaModule: 'Đặc điểm waterfall và agile, vì sao waterfall gặp khó (phản hồi muộn, yêu cầu thay đổi), khi nào agile phù hợp, chọn cách tiếp cận cho 4 dự án.',
  de: [E1, E2, E3],
});
