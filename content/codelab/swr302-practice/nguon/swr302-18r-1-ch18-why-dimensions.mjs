/**
 * SWR302 · 18R.1 — Why reuse requirements, and the three dimensions of reuse (Wiegers Ch.18 slides 1–9).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, moDun } from './_bai.mjs';

const E1 = phanLoai({
  tieuDe: 'Reuse 1 — which dimension of reuse?',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Wiegers Table 18-1 describes any reuse situation along three dimensions: the <b>extent of reuse</b> (how much material: one requirement, with its attributes, or with associated artefacts), the <b>extent of modification</b> (unchanged, attributes changed, or the requirement tweaked) and the <b>reuse mechanism</b> (copy vs reference). Which dimension does each statement describe?</p>', vi: '<p>Ba chiều của tái sử dụng: mức độ tái dùng, mức độ sửa đổi, cơ chế (sao chép vs tham chiếu).</p>' },
  cot: 'Dimension', luaChon: ['Extent of reuse', 'Extent of modification', 'Reuse mechanism'],
  hang: [
    ['We take the password requirements together with their acceptance tests and business rules.', 'Extent of reuse'],
    ['The requirement text stays the same, but its priority is High in the new system.', 'Extent of modification'],
    ['The SRS points to requirement SEC-04 in the shared library instead of pasting it.', 'Reuse mechanism'],
    ['We reuse just one functional requirement about printing receipts.', 'Extent of reuse'],
    ['The kiosk and the website share identical check-in requirements.', 'Extent of modification'],
    ['The BA copies three requirements from last year’s Word file.', 'Reuse mechanism'],
  ],
  giaiThich: '<p>How much, how changed, and by copy or by reference — together these describe any reuse.</p>',
  goiY: ['"Lấy cùng test và luật" ⇒ mức độ tái dùng.', '"Trỏ tới thư viện chung" vs "chép" ⇒ cơ chế.'],
  loiHayGap: ['Nhầm "giữ nguyên văn" (mức sửa đổi) với cơ chế.', 'Coi chép–dán là cơ chế tốt nhất.'],
  thuatNgu: [{ en: 'requirements reuse', vi: 'tái sử dụng yêu cầu' }],
  khaiNiem: ['dimensions of reuse'],
});

const E2 = tracNghiem({
  tieuDe: 'Reuse 2 — copy or reference?',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>Copy-and-paste is the crudest reuse: no history of origin, the copies can be edited independently, and copying within a project bloats the specification. Reuse by reference is usually better: collect reusable items in a shared location, give each a unique id, and insert the id (and a link) in your document. The master must be accessible and persistent.</p>', vi: '<p>Sao chép thô sơ nhất; tham chiếu thường tốt hơn nhưng bản gốc phải truy cập được và bền vững.</p>' },
  cau: [
    { en: 'Why is copy-and-paste risky?', vi: 'Vì sao chép–dán rủi ro?', lc: [['a', 'Copies drift apart when one is edited, and nobody knows where they came from'], ['b', 'It is too slow'], ['c', 'It uses too much paper'], ['d', 'It is illegal']], dap: 'a', giai: ['Divergence and lost origin.', 'Lệch nhau và mất nguồn gốc.'] },
    { en: 'What does reuse by reference require?', vi: 'Tái sử dụng bằng tham chiếu cần gì?', lc: [['a', 'A shared, persistent repository where each reusable item has a unique id'], ['b', 'Nothing'], ['c', 'Printing the master'], ['d', 'A new tool for every project']], dap: 'a', giai: ['Accessible, persistent master.', 'Bản gốc truy cập được, bền vững.'] },
  ],
  goiY: ['Bản sao trôi dạt khỏi nhau.', 'Tham chiếu cần kho chung có id.'],
  loiHayGap: ['Chép cùng một yêu cầu vào nhiều chỗ trong một SRS.', 'Tham chiếu tới tệp sẽ bị xoá.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: [{ en: 'reuse by reference', vi: 'tái sử dụng bằng tham chiếu' }],
  khaiNiem: ['reuse mechanisms'],
});

const E3 = tracNghiem({
  tieuDe: 'Reuse 3 — benefits of reuse',
  doKho: 'EASY', phut: 4,
  moTa: { en: '<p>Benefits of reusing requirements: faster delivery, lower cost, consistency within and across applications, higher productivity, fewer defects and less rework; trusted requirements save review and test time and improve estimation; users see consistent functionality.</p>', vi: '<p>Lợi ích của tái sử dụng yêu cầu.</p>' },
  cau: [
    { en: 'Which is a benefit of reusing a well-tested requirement set?', vi: 'Đâu là lợi ích khi tái dùng bộ yêu cầu đã được kiểm kỹ?', lc: [['a', 'Less review and testing effort, and better estimates from past data'], ['b', 'No need to talk to users ever again'], ['c', 'Guaranteed zero defects'], ['d', 'Longer documents']], dap: 'a', giai: ['Trusted requirements save time.', 'Yêu cầu đáng tin tiết kiệm thời gian.'] },
    { en: 'From the user’s point of view, reuse mainly brings…', vi: 'Từ góc người dùng, tái sử dụng chủ yếu đem lại…', lc: [['a', 'consistent behaviour across the organisation’s applications'], ['b', 'more screens'], ['c', 'higher prices'], ['d', 'nothing']], dap: 'a', giai: ['Consistency.', 'Nhất quán.'] },
  ],
  goiY: ['Ít review/test lại, ước lượng tốt hơn.', 'Người dùng thấy hành vi nhất quán.'],
  loiHayGap: ['Nghĩ tái dùng thay được khai thác.', 'Nghĩ tái dùng bảo đảm không lỗi.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: [{ en: 'requirements reuse', vi: 'tái sử dụng yêu cầu' }],
  khaiNiem: ['benefits of reuse'],
});

const E4 = phanLoai({
  tieuDe: 'Reuse 4 — what can be reused?',
  doKho: 'EASY', phut: 4,
  moTa: { en: '<p>Table 18-2: reusable requirements information goes far beyond functional requirements — user-class descriptions, glossary and data-dictionary entries, business rules, quality attributes, constraints, use cases, acceptance tests and analysis models. Is each item a good reuse candidate for another project in the same organisation?</p>', vi: '<p>Thông tin yêu cầu có thể tái dùng rộng hơn yêu cầu chức năng.</p>' },
  cot: 'Reuse candidate?', luaChon: ['Good candidate', 'Poor candidate'],
  hang: [
    ['The glossary of hospital terms', 'Good candidate'],
    ['The accessibility requirements mandated by law', 'Good candidate'],
    ['The user-class description of "pharmacist"', 'Good candidate'],
    ['A sprint burndown of last year’s project', 'Poor candidate'],
    ['The meeting minutes of one project’s kick-off', 'Poor candidate'],
  ],
  giaiThich: '<p>The most reusable assets are often the supporting ones — glossaries, rules, user classes — not only the functional requirements.</p>',
  goiY: ['Thông tin ổn định giữa các dự án ⇒ ứng viên tốt.', 'Thông tin chỉ thuộc một dự án ⇒ kém.'],
  loiHayGap: ['Chỉ nghĩ tới yêu cầu chức năng.', 'Tái dùng biên bản họp.'],
  thuatNgu: tn('dataDictionary', 'businessRule'),
  khaiNiem: ['reusable requirements information'],
});

export default moDun({
  slug: 'swr302-18r-1-ch18-why-dimensions',
  ten: '7.9 Requirements reuse: why, and its three dimensions',
  moTaModule: 'Ba chiều của tái sử dụng (mức độ, sửa đổi, cơ chế), sao chép vs tham chiếu, lợi ích, loại thông tin yêu cầu nên tái dùng.',
  de: [E1, E2, E3, E4],
});
