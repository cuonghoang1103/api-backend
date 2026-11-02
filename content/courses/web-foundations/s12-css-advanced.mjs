/**
 * Web Foundations — Chương 12: CSS nâng cao (position & stacking context,
 * transition/animation, kiến trúc CSS, biến & theme). Song ngữ EN/VI.
 * ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${` trong code escape thành \${.
 */

import { gallery, galleryGiang } from './_slides.mjs';
import L124 from './s12/wf-12-4-tokens-theming.mjs';
import L123 from './s12/wf-12-3-css-architecture.mjs';
import L122 from './s12/wf-12-2-transition-animation.mjs';
import L121 from './s12/wf-12-1-position-stacking.mjs';

export default {
  title: 'Chapter 12 — Advanced CSS|||Chương 12 — CSS nâng cao',
  description: 'Chương 3 cho bạn dàn được trang. Chương này cho bạn kiểm soát nó: phần tử chồng lên nhau theo luật nào, chuyển động mượt mà không giật, đặt tên class để sáu tháng sau còn sửa được, và làm chế độ sáng/tối tử tế.',
  lessons: [
    /* ─────────────────── 12.0 slide bài giảng ─────────────────── */
    {
      title: '12.0 — Advanced CSS in 12 slides|||12.0 — CSS nâng cao trong 12 slide',
      slug: 'wf-12-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Position, ngữ cảnh xếp chồng, transition/animation, BEM và token — 12 slide.',
      content: `
<div class="ml-en"><h2>📑 Advanced CSS in 12 slides</h2>
<p>Slide 4 explains why z-index: 9999 can still lose. It is the single most confusing CSS behaviour there is.</p>
<p>Skim before the chapter to see what is coming, then come back afterwards to revise. If a slide still does not make sense, the lesson that teaches it is right below.</p></div>
<div class="ml-vi"><h2>📑 CSS nâng cao trong 12 slide</h2>
<p>Slide 4 giải thích vì sao z-index: 9999 vẫn có thể thua. Đó là hành vi khó hiểu nhất của cả CSS.</p>
<p>Lướt trước khi học chương để biết sắp học gì, rồi quay lại ôn sau. Slide nào còn chưa hiểu thì bài dạy nó nằm ngay bên dưới.</p></div>
${galleryGiang('wf-css2', [
  [1, "Bìa"],
  [2, "Nội dung chương"],
  [3, "Năm giá trị của position"],
  [4, "Vì sao z-index: 9999 vẫn thua"],
  [5, "Thang z-index có tên"],
  [6, "Transition"],
  [7, "Chỉ HAI thuộc tính rẻ để làm động ⭐"],
  [8, "BEM — Block, Element, Modifier"],
  [9, "Ba cách cô lập CSS"],
  [10, "Token thiết kế — hai tầng"],
  [11, "Chế độ tối làm cho tử tế"],
  [12, "Tự luyện"],
])}
`,
    },

    L121,

    L122,

    L123,

    L124,

    {
      title: '12.5 — Chapter 12 quiz|||12.5 — Kiểm tra chương 12',
      slug: 'wf-12-5-quiz',
      type: 'QUIZ',
      description: 'Sáu câu về position, stacking context, hiệu năng hoạt hình, BEM và token.',
      content: `
<div class="ml-en"><p class="lead">Six questions on positioning, stacking contexts, animation performance, naming and theming.</p>
<h3>The chapter in four points</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">absolute needs an anchor</span><span class="lz-t">position: relative on the parent</span><span class="lz-d">No positioned ancestor means it anchors to the document — that is the element flying to the page corner.</span></div>
<div class="lz-node"><span class="lz-k">z-index is scoped</span><span class="lz-t">to its stacking context</span><span class="lz-d">opacity, transform and filter create contexts silently. Look at ancestors, not the element.</span></div>
<div class="lz-node"><span class="lz-k">Animate transform and opacity</span><span class="lz-t">never width, height or left</span><span class="lz-d">Layout properties force a recalculation every frame; the compositor handles the other two for free.</span></div>
<div class="lz-node"><span class="lz-k">Global names collide</span><span class="lz-t">scope them or namespace them</span><span class="lz-d">.card and button at global scope will fight your CSS framework, on pages you never touched.</span></div>
</div></div>
<div class="ml-vi"><p class="lead">Sáu câu về định vị, ngữ cảnh xếp chồng, hiệu năng hoạt hình, đặt tên và token.</p>
<h3>Cả chương trong bốn ý</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">absolute cần một cái neo</span><span class="lz-t">position: relative ở cha</span><span class="lz-d">Không có tổ tiên nào được định vị thì nó neo vào cả tài liệu — đó là phần tử bay ra góc trang.</span></div>
<div class="lz-node"><span class="lz-k">z-index có phạm vi</span><span class="lz-t">trong ngữ cảnh xếp chồng của nó</span><span class="lz-d">opacity, transform và filter tạo ngữ cảnh một cách âm thầm. Soi tổ tiên, đừng soi phần tử.</span></div>
<div class="lz-node"><span class="lz-k">Làm động transform và opacity</span><span class="lz-t">đừng bao giờ width, height hay left</span><span class="lz-d">Thuộc tính bố cục buộc tính lại mỗi khung hình; hai cái kia bộ hợp thành lo miễn phí.</span></div>
<div class="lz-node"><span class="lz-k">Tên toàn cục sẽ đụng nhau</span><span class="lz-t">khoanh vùng hoặc gắn tiền tố</span><span class="lz-d">.card và button ở phạm vi toàn cục sẽ đánh nhau với framework CSS, trên những trang bạn chưa từng đụng tới.</span></div>
</div></div>
`,
      quiz: {
        timeLimitSeconds: 480,
        questions: [
          {
            question: 'An element with position: absolute jumps to the top-left of the page. Why?|||Một phần tử position: absolute bay lên góc trên bên trái của trang. Vì sao?',
            options: [
              'No ancestor has a position other than static|||Không tổ tiên nào có position khác static',
              'It is missing a z-index|||Nó thiếu z-index',
              'The parent has display: flex|||Cha đang để display: flex',
              'absolute always anchors to the page|||absolute luôn neo vào cả trang',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'z-index: 9999 on a modal still renders behind another element. Most likely cause?|||Modal để z-index: 9999 mà vẫn nằm dưới phần tử khác. Nguyên nhân thường gặp nhất?',
            options: [
              'An ancestor created its own stacking context|||Một tổ tiên đã tạo ngữ cảnh xếp chồng riêng',
              'z-index only accepts values up to 100|||z-index chỉ nhận giá trị tới 100',
              'The modal needs position: static|||Modal cần position: static',
              'Two elements cannot share a z-index|||Hai phần tử không thể trùng z-index',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which pair is cheap to animate at 60fps?|||Cặp thuộc tính nào rẻ để làm động ở 60fps?',
            options: [
              'transform and opacity|||transform và opacity',
              'width and height|||width và height',
              'top and left|||top và left',
              'margin and padding|||margin và padding',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why avoid transition: all?|||Vì sao nên tránh transition: all?',
            options: [
              'It animates properties you did not intend, including layout ones|||Nó làm động cả thuộc tính bạn không định, kể cả thuộc tính bố cục',
              'It is not supported in Chrome|||Chrome không hỗ trợ',
              'It only works with keyframes|||Nó chỉ chạy cùng keyframes',
              'It disables hover states|||Nó tắt trạng thái hover',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'In BEM, what does .card__title--large mean?|||Trong BEM, .card__title--large nghĩa là gì?',
            options: [
              'The title element of the card block, in its large variant|||Phần tử title của block card, ở biến thể large',
              'Three separate classes that must all match|||Ba class riêng biệt phải khớp cả ba',
              'A card inside a title inside a large box|||Một card trong title trong hộp large',
              'A deprecated syntax|||Một cú pháp đã bị bỏ',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is the cleanest way to implement dark mode with CSS variables?|||Cách sạch nhất để làm chế độ tối bằng biến CSS là gì?',
            options: [
              'Redefine the semantic token values under a dark selector|||Khai lại GIÁ TRỊ của các token ngữ nghĩa dưới một bộ chọn dark',
              'Duplicate every rule with dark colours|||Chép lại mọi quy tắc với màu tối',
              'Add !important to every dark rule|||Thêm !important vào mọi quy tắc tối',
              'Use a separate stylesheet loaded by JavaScript|||Dùng một file CSS riêng do JavaScript nạp',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
