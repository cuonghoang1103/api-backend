/**
 * SWR302 · 8.3 — Throwaway vs evolutionary, paper vs electronic, working with prototypes, evaluation (Wiegers Ch.15 · 9–17).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, sapXep, moDun } from './_bai.mjs';

const E1 = phanLoai({
  tieuDe: 'Prototype types 1 — throwaway or evolutionary?',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>A <b>throwaway</b> prototype answers questions, resolves uncertainties and improves requirements quality, then is discarded (a wireframe is a common example). An <b>evolutionary</b> prototype provides a solid architectural foundation and grows into the product; agile development is a form of evolutionary prototyping.</p>', vi: '<p><b>Throwaway</b>: trả lời câu hỏi rồi bỏ (wireframe là ví dụ). <b>Evolutionary</b>: nền kiến trúc vững, lớn dần thành sản phẩm; agile là một dạng evolutionary.</p>' },
  cot: 'Future use', luaChon: ['Throwaway', 'Evolutionary'],
  hang: [
    ['A wireframe of the website home page made in an afternoon.', 'Throwaway'],
    ['Sprint 1 delivers a working, tested booking core that later sprints extend.', 'Evolutionary'],
    ['A quick script with hard-coded data to show managers a report idea.', 'Throwaway'],
    ['Code written with full error handling and unit tests, intended to be kept.', 'Evolutionary'],
    ['Sticky-note screens on a whiteboard to explore the checkout steps.', 'Throwaway'],
  ],
  giaiThich: '<p>Throwaways are built fast, ignoring quality, and must be discarded; evolutionary prototypes are built with production quality from the start.</p>',
  goiY: ['Viết nhanh, dữ liệu giả ⇒ throwaway.', 'Có test, xử lý lỗi, giữ lại ⇒ evolutionary.'],
  loiHayGap: ['Cho rằng wireframe có thể lớn dần thành sản phẩm.', 'Viết evolutionary bằng mã "nháp".'],
  thuatNgu: tn('prototype', 'wireframe'),
  khaiNiem: ['throwaway vs evolutionary'],
});

const E2 = phanLoai({
  tieuDe: 'Prototype types 2 — paper or electronic?',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p><b>Paper</b> (low-fidelity) prototypes are cheap, fast and low-tech — paper, index cards, sticky notes, whiteboards — good for testing shared understanding early. <b>Electronic</b> prototypes use drawing, wireframing or prototyping tools and look real; they are better for flow and feel, and required for evolutionary prototypes.</p>', vi: '<p><b>Giấy</b>: rẻ, nhanh, công nghệ thấp; kiểm hiểu biết chung từ sớm. <b>Điện tử</b>: công cụ vẽ/wireframe/prototype, trông thật; tốt cho luồng và cảm giác, bắt buộc cho evolutionary.</p>' },
  cot: 'Best form', luaChon: ['Paper', 'Electronic'],
  hang: [
    ['First workshop: 8 users sketch and rearrange screens together in 30 minutes.', 'Paper'],
    ['Usability test of the animation and timing of the scanning flow on a phone.', 'Electronic'],
    ['An evolutionary prototype that will become the release.', 'Electronic'],
    ['Quickly trying three layouts before choosing one to draw properly.', 'Paper'],
    ['Remote users in three cities must try the flow on their own devices.', 'Electronic'],
  ],
  giaiThich: '<p>Paper wins on speed and cost early; electronic wins when interaction details, remote evaluation or evolution matter.</p>',
  goiY: ['Cần nhanh, nhiều phương án, cùng phòng ⇒ giấy.', 'Cần cảm giác tương tác, từ xa, hay giữ lại ⇒ điện tử.'],
  loiHayGap: ['Dùng giấy để kiểm thời gian hiệu ứng.', 'Dựng điện tử cầu kỳ cho buổi phác thảo đầu.'],
  thuatNgu: tn('prototype'),
  khaiNiem: ['paper vs electronic'],
});

const E3 = sapXep({
  tieuDe: 'Prototype types 3 — from use case to UI design',
  doKho: 'MEDIUM', phut: 4,
  moTa: { en: '<p>Wiegers Figure 15-2: a sequence from use cases to a detailed UI design through a throwaway prototype. Put the steps in order. (In practice you iterate among them.)</p>', vi: '<p>Hình 15-2: trình tự từ use case tới thiết kế UI chi tiết qua prototype throwaway. Sắp thứ tự (thực tế lặp qua lại).</p>' },
  cau: [{ en: 'Order the steps', vi: 'Sắp các bước', dung: ['Use case (actor actions and system responses)', 'Dialog map (possible UI architecture)', 'Throwaway prototype / wireframe (specific screens)', 'Detailed, usability-optimised UI design'], hien: [2, 0, 3, 1], giai: ['Use case → dialog map → wireframe → optimised UI.', 'Use case → dialog map → wireframe → UI tối ưu.'] }],
  goiY: ['Dialog map đứng giữa use case và màn hình cụ thể.', 'Tối ưu khả dụng là bước cuối.'],
  loiHayGap: ['Vẽ màn hình chi tiết trước dialog map.', 'Bỏ qua use case.'],
  giaiThich: '<p>Use case → dialog map → throwaway prototype / wireframe → detailed UI design; iterate across the three early steps until users agree.</p>',
  thuatNgu: tn('dialogMap', 'wireframe', 'useCase'),
  khaiNiem: ['working with prototypes'],
});

const E4 = tracNghiem({
  tieuDe: 'Prototype types 4 — evaluating a prototype',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Questions to ask evaluators: Does it implement the functionality as you expected? What is missing? Are there error conditions it doesn’t address? Are any functions unnecessary? Is the navigation logical and complete? Are tasks too complex (too many steps)? Watch users perform tasks rather than only asking opinions, and choose evaluators who represent the user classes.</p>', vi: '<p>Câu hỏi khi đánh giá prototype và cách tổ chức đánh giá.</p>' },
  cau: [
    { en: 'Which is a good evaluation question?', vi: 'Câu hỏi đánh giá nào tốt?', lc: [['a', '"What would you need to do here that this screen does not let you do?"'], ['b', '"Do you like it?"'], ['c', '"Is blue nice?"'], ['d', '"Is this done?"']], dap: 'a', giai: ['Look for missing functionality.', 'Tìm chức năng còn thiếu.'] },
    { en: 'Who should evaluate the prototype?', vi: 'Ai nên đánh giá prototype?', lc: [['a', 'Representatives of the different user classes'], ['b', 'Only the developers who built it'], ['c', 'Only managers'], ['d', 'Nobody']], dap: 'a', giai: ['Each user class has different needs.', 'Mỗi lớp người dùng có nhu cầu khác.'] },
    { en: 'Best way to learn whether the flow works?', vi: 'Cách tốt nhất biết luồng có ổn không?', lc: [['a', 'Watch users perform real tasks with it'], ['b', 'Send a screenshot by e-mail'], ['c', 'Ask "is it OK?"'], ['d', 'Read the code']], dap: 'a', giai: ['Observation reveals what opinions hide.', 'Quan sát lộ ra điều ý kiến che giấu.'] },
  ],
  goiY: ['Hỏi điều còn thiếu và lỗi chưa xử lý.', 'Quan sát người dùng làm việc thật.'],
  loiHayGap: ['Hỏi "có thích không?".', 'Để chính dev tự đánh giá.'],
  giaiThich: '<p>Answers: a · a · a.</p>',
  thuatNgu: tn('prototype', 'userClass'),
  khaiNiem: ['prototype evaluation'],
});

export default moDun({
  slug: 'swr302-8-3-ch15-types',
  ten: '8.3 Throwaway vs evolutionary, paper vs electronic',
  moTaModule: 'Phân biệt throwaway/evolutionary và giấy/điện tử theo tình huống, trình tự use case → dialog map → wireframe → UI tối ưu (Hình 15-2), cách đánh giá prototype.',
  de: [E1, E2, E3, E4],
});
