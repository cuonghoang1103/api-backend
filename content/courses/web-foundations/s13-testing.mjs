/**
 * Web Foundations — Chương 13: Kiểm thử (unit test, Vitest/Jest, Testing
 * Library, mocking, CI). Song ngữ EN/VI.
 * ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${` trong code escape thành \${.
 */

import { gallery, galleryGiang } from './_slides.mjs';
import L134 from './s13/wf-13-4-mocking-ci.mjs';
import L133 from './s13/wf-13-3-testing-library.mjs';
import L132 from './s13/wf-13-2-unit-tests.mjs';
import L131 from './s13/wf-13-1-why-test.mjs';

export default {
  title: 'Chapter 13 — Testing|||Chương 13 — Kiểm thử',
  description: 'Chương duy nhất phân biệt người học nghề với người làm nghề. Viết phép kiểm tự động để biết mã còn chạy đúng sau mỗi lần sửa — unit test, kiểm thử giao diện, giả lập mạng, và chạy tất cả trong CI.',
  lessons: [
    /* ─────────────────── 13.0 slide bài giảng ─────────────────── */
    {
      title: '13.0 — Testing in 12 slides|||13.0 — Kiểm thử trong 12 slide',
      slug: 'wf-13-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Tháp ba tầng, Arrange/Act/Assert, Testing Library, giả lập và CI — 12 slide.',
      content: `
<div class="ml-en"><h2>📑 Testing in 12 slides</h2>
<p>Slide 12 is the rule that matters most: break the code on purpose and prove the test goes red.</p>
<p>Skim before the chapter to see what is coming, then come back afterwards to revise. If a slide still does not make sense, the lesson that teaches it is right below.</p></div>
<div class="ml-vi"><h2>📑 Kiểm thử trong 12 slide</h2>
<p>Slide 12 là luật quan trọng nhất: cố ý làm hỏng mã và chứng minh test biết chuyển đỏ.</p>
<p>Lướt trước khi học chương để biết sắp học gì, rồi quay lại ôn sau. Slide nào còn chưa hiểu thì bài dạy nó nằm ngay bên dưới.</p></div>
${galleryGiang('wf-test', [
  [1, "Bìa"],
  [2, "Nội dung chương"],
  [3, "Vì sao kiểm bằng tay thất bại"],
  [4, "Tháp ba tầng"],
  [5, "Arrange · Act · Assert"],
  [6, "Matcher chiếm 95% nhu cầu"],
  [7, "Tìm phần tử như một CON NGƯỜI ⭐⭐"],
  [8, "get · query · find"],
  [9, "Giả lập mạng — và nhánh HỎNG"],
  [10, "Điều khiển thời gian, chạy trong CI"],
  [11, "Kiểm BỘ KIỂM trước khi tin nó"],
  [12, "Tự luyện"],
])}
`,
    },

    L131,

    L132,

    L133,

    L134,

    {
      title: '13.5 — Chapter 13 quiz|||13.5 — Kiểm tra chương 13',
      slug: 'wf-13-5-quiz',
      type: 'QUIZ',
      description: 'Sáu câu về tháp kiểm thử, matcher, Testing Library, mocking và CI.',
      content: `
<div class="ml-en"><p class="lead">Six questions on the test pyramid, matchers, queries, mocking and CI.</p>
<h3>The chapter in four points</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">Many unit, few end-to-end</span><span class="lz-t">the pyramid, not the ice cream cone</span><span class="lz-d">Fast tests get run; slow flaky ones get ignored, then deleted.</span></div>
<div class="lz-node"><span class="lz-k">toEqual for objects</span><span class="lz-t">toBe is ===</span><span class="lz-d">Two separate objects are never ===, no matter how identical their contents.</span></div>
<div class="lz-node"><span class="lz-k">Query by role and label</span><span class="lz-t">never by CSS class</span><span class="lz-d">A renamed class should not turn a working button into a failing test.</span></div>
<div class="lz-node"><span class="lz-k">Break it on purpose</span><span class="lz-t">to prove the test can fail</span><span class="lz-d">A test that passes on broken code is worse than none — it sells you confidence you did not earn.</span></div>
</div></div>
<div class="ml-vi"><p class="lead">Sáu câu về tháp kiểm thử, matcher, cách tìm phần tử, giả lập và CI.</p>
<h3>Cả chương trong bốn ý</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">Nhiều unit, ít E2E</span><span class="lz-t">kim tự tháp, không phải cây kem ốc quế</span><span class="lz-d">Test nhanh thì người ta chạy; test chậm và chập chờn thì bị bỏ qua, rồi bị xoá.</span></div>
<div class="lz-node"><span class="lz-k">toEqual cho object</span><span class="lz-t">toBe là ===</span><span class="lz-d">Hai object riêng biệt không bao giờ ===, dù ruột giống hệt nhau.</span></div>
<div class="lz-node"><span class="lz-k">Tìm theo role và label</span><span class="lz-t">đừng bao giờ theo class CSS</span><span class="lz-d">Đổi tên một class không nên biến cái nút đang chạy tốt thành một test đỏ.</span></div>
<div class="lz-node"><span class="lz-k">Cố ý làm hỏng</span><span class="lz-t">để chứng minh test BIẾT đỏ</span><span class="lz-d">Test xanh trên mã hỏng còn tệ hơn không có — nó bán cho bạn sự yên tâm bạn chưa xứng đáng có.</span></div>
</div></div>
`,
      quiz: {
        timeLimitSeconds: 480,
        questions: [
          {
            question: 'Which level should you have the MOST of?|||Tầng nào nên có NHIỀU NHẤT?',
            options: ['Unit|||Unit', 'Integration|||Tích hợp', 'End-to-end|||Đầu-cuối (E2E)', 'Manual|||Kiểm bằng tay'],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'expect({ a: 1 }).toBe({ a: 1 }) — what happens?|||expect({ a: 1 }).toBe({ a: 1 }) — chuyện gì xảy ra?',
            options: [
              'It fails — two objects are never ===, use toEqual|||Trượt — hai object không bao giờ ===, phải dùng toEqual',
              'It passes — the contents match|||Đạt — ruột giống nhau',
              'It throws a syntax error|||Ném lỗi cú pháp',
              'It passes only in Vitest|||Chỉ đạt trong Vitest',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which query should you prefer in Testing Library?|||Trong Testing Library nên ưu tiên cách tìm nào?',
            options: [
              'getByRole|||getByRole',
              'querySelector with a CSS class|||querySelector theo class CSS',
              'getByTestId|||getByTestId',
              'Searching the HTML string|||Tìm trong chuỗi HTML',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You need to assert something is NOT on the page. Which query?|||Bạn cần khẳng định một thứ KHÔNG có trên trang. Dùng cách nào?',
            options: ['queryBy...|||queryBy...', 'getBy...|||getBy...', 'findBy...|||findBy...', 'renderBy...|||renderBy...'],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why mock fetch in a test?|||Vì sao phải giả lập fetch trong test?',
            options: [
              'So the test is fast and does not depend on the network or someone else data|||Để test nhanh và không phụ thuộc mạng hay dữ liệu của người khác',
              'Because fetch does not exist in Node|||Vì Node không có fetch',
              'To increase the coverage number|||Để tăng con số độ phủ',
              'Mocking is only needed for POST requests|||Chỉ cần giả lập cho request POST',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Your whole suite is green. What still needs checking before you ship?|||Cả bộ test đều xanh. Trước khi ship còn phải kiểm gì nữa?',
            options: [
              'That the build passes, and that the tests actually fail on broken code|||Bản dựng có xanh không, và test có THẬT SỰ đỏ khi mã hỏng không',
              'Nothing — green tests mean it is ready|||Không gì cả — test xanh là xong',
              'Only the coverage percentage|||Chỉ cần xem phần trăm độ phủ',
              'That every file has at least one test|||Mọi file đều có ít nhất một test',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
