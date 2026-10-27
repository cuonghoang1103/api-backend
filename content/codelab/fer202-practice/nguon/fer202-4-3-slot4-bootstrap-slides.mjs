/**
 * FER202 · 4.2 — Slide check: Bootstrap layout & components (Slot 4–5). Trắc nghiệm.
 */
import { doiDau, KHOA, lc, tinh } from './_chung.mjs';

const q = (ma, de, luaChon, dapAn, giaiThich, nhieu) => ({ ma, de, luaChon: lc(...luaChon), dapAn, giaiThich, ...(nhieu ? { nhieu: true } : {}) });

export default doiDau({
  slug: 'fer202-4-3-slot4-bootstrap-slides',
  ten: '4.2 Slide check — Bootstrap layout & components',
  khoa: KHOA,
  baiHoc: 'fer202-4-3-slot4-bootstrap-slides',
  de: [
    tinh({
      tieuDe: 'Slide check: Bootstrap grid and components',
      doKho: 'EASY', phut: 12,
      khaiNiem: ['grid', 'container', 'breakpoints', 'components'], the: ['bootstrap', 'quiz'],
      moTa: {
        en: '<p>Ten questions on the Bootstrap 5 grid and components — the kind that appear in the FE multiple-choice exam.</p>',
        vi: '<p>Mười câu về lưới và component Bootstrap 5 — đúng dạng câu hỏi trong đề trắc nghiệm FE.</p>',
      },
      goiY: ['Mọi câu về số cột: tổng tối đa 12 mỗi hàng.', 'Class có mốc (col-md-6) áp từ mốc đó TRỞ LÊN.'],
      loiHayGap: ['Nhầm <code>.container</code> (bề rộng cố định theo mốc) với <code>.container-fluid</code> (100%).', 'Nhầm tên class Bootstrap 4 (ml-, mr-, float-left) với Bootstrap 5 (ms-, me-, float-start).'],
      giaiThich: '<p>Xem giải thích từng câu sau khi nộp.</p>',
      thuatNgu: [{ en: 'fluid', vi: 'co giãn 100% bề rộng' }, { en: 'offset', vi: 'dịch cột sang phải bằng số cột trống' }],
      cauHoi: [
        q('q1', 'How many columns does the Bootstrap grid have per row?', [['a', '10'], ['b', '12'], ['c', '16'], ['d', '24']], ['b'], 'A row is divided into 12 columns.|||Một hàng chia 12 cột.'),
        q('q2', '<code>.container-fluid</code> is…', [['a', 'fixed 1140px'], ['b', '100% wide at every breakpoint'], ['c', 'hidden on mobile'], ['d', 'a flex column']], ['b'], '<code>.container</code> has a max-width per breakpoint; <code>.container-fluid</code> is always 100%.|||.container có max-width theo mốc; .container-fluid luôn 100%.'),
        q('q3', '<code>&lt;div class="col-12 col-md-6"&gt;</code> on a 1000px screen is…', [['a', '12 columns wide'], ['b', '6 columns wide'], ['c', 'hidden'], ['d', 'auto width']], ['b'], '1000px ≥ md (768px) so <code>col-md-6</code> applies.|||1000px ≥ md (768px) nên col-md-6 có hiệu lực.'),
        q('q4', 'Which class centers a 6-column block in a row?', [['a', '<code>col-6 center</code>'], ['b', '<code>col-6 offset-3</code>'], ['c', '<code>col-6 mx-6</code>'], ['d', '<code>col-6 offset-6</code>']], ['b'], '3 empty columns + 6 + 3 = 12 → centered.|||3 cột trống + 6 + 3 = 12 → ở giữa.'),
        q('q5', 'What is the breakpoint of <code>lg</code>?', [['a', '≥ 576px'], ['b', '≥ 768px'], ['c', '≥ 992px'], ['d', '≥ 1200px']], ['c'], 'sm 576 · md 768 · lg 992 · xl 1200 · xxl 1400.|||sm 576 · md 768 · lg 992 · xl 1200 · xxl 1400.'),
        q('q6', 'Which class adds space BETWEEN columns of a row?', [['a', '<code>g-3</code> on the row'], ['b', '<code>p-3</code> on the container'], ['c', '<code>space-3</code>'], ['d', '<code>gap-row</code>']], ['a'], 'Gutters (<code>g-*</code>, <code>gx-*</code>, <code>gy-*</code>) control spacing between columns.|||Gutter (g-*, gx-*, gy-*) điều khiển khoảng cách giữa các cột.'),
        q('q7', 'Bootstrap 5 replaced <code>ml-3</code> with…', [['a', '<code>left-3</code>'], ['b', '<code>ms-3</code>'], ['c', '<code>ml-3</code> still works'], ['d', '<code>mx-3</code>']], ['b'], 'start/end (<code>ms</code>/<code>me</code>) supports right-to-left languages.|||start/end (ms/me) hỗ trợ ngôn ngữ viết từ phải sang trái.'),
        q('q8', 'A green alert box is created with…', [['a', '<code>alert alert-success</code>'], ['b', '<code>alert-green</code>'], ['c', '<code>box success</code>'], ['d', '<code>alert bg-success-alert</code>']], ['a'], 'Contextual classes: alert-primary, -success, -danger, -warning, -info…|||Class ngữ cảnh: alert-primary, -success, -danger, -warning, -info…'),
        q('q9', 'Which components exist in Bootstrap 5? (choose all)', [['a', 'Card'], ['b', 'Jumbotron'], ['c', 'Accordion'], ['d', 'Offcanvas']], [['a', 'c', 'd']], 'Jumbotron was removed in v5 (use utilities instead); Accordion and Offcanvas are new.|||Jumbotron bị bỏ ở v5 (thay bằng tiện ích); Accordion và Offcanvas là mới.', true),
        q('q10', '<code>&lt;div class="d-none d-lg-block"&gt;</code> is visible on…', [['a', 'phones only'], ['b', 'large screens and up'], ['c', 'every screen'], ['d', 'no screen']], ['b'], 'Hidden by default, shown as block from lg upward.|||Mặc định ẩn, hiện dạng block từ lg trở lên.'),
      ],
    }),
  ],
});
