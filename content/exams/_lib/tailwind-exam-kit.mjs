/**
 * Bộ khuôn dùng chung cho các đề thi khoá Tailwind CSS (FE, PE, và các PT về sau).
 *
 * Mọi chuỗi hiển thị trong Phòng thi đều song ngữ: hoặc dạng ống "EN|||VI"
 * (prompt, option — client tự tách bằng pickLang), hoặc dạng HTML hai khối
 * `.ml-en` / `.ml-vi` (giải thích, hướng dẫn — client bật/tắt bằng data-ml).
 *
 * ⚠️ MỖI TRƯỜNG CHỈ ĐƯỢC CÓ ĐÚNG MỘT DẤU `|||`. Nếu phần EN hay phần VI tự
 * chứa thêm một dấu ống nữa thì bản tiếng Việt sẽ lòi cả đoạn tiếng Anh ra màn
 * hình. Khoá này ÍT dính hơn khoá Docker (không có Go template, không có
 * `2>&1`), nhưng vẫn có chỗ nguy: selector CSS kiểu `[&>svg]:` và cú pháp
 * `@media not all and (...)` thì vô hại, còn ba dấu `|` liền nhau thì KHÔNG
 * bao giờ được gõ, kể cả trong khối mã.
 *
 * Vì sao có file này: đề Tailwind đầy selector đã thoát của chính trình sinh
 * (`.mt-0\.5`, `.\!mt-4`, `.\[\&\>svg\]\:size-4>svg`, `.hover\:md\:p-8`), đầy
 * khối `@media`, và đầy đoạn HTML `class="..."`. `code()` tự thoát `< > &`, nên
 * `<div class="…">` trong đề hiện đúng nguyên văn thay vì bị trình duyệt nuốt
 * mất một nửa — chuyện xảy ra NGAY câu đầu tiên nếu không có nó.
 *
 * Sao chép từ docker-exam-kit.mjs; hai điểm khác:
 *   • `sim()` gắn `fromCourse=tailwind-css`.
 *   • `RUBRIC_CODE` mô tả ngữ nghĩa Tailwind (quy tắc có được PHÁT SINH không,
 *     ai thắng khi xung đột, thang giá trị, biến CSS, khả năng tiếp cận) thay
 *     vì ngữ nghĩa Docker (ảnh dựng được, container chạy được, tầng ảnh).
 */

/** Chuỗi song ngữ dạng ống — dùng cho prompt và option. Đúng MỘT dấu ống. */
export const B = (en, vi) => `${en}|||${vi}`;

/** Giải thích song ngữ dạng HTML hai khối. */
export const EX = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const esc = (s) => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

/** Khối mã trong đề — tự thoát ký tự, khỏi phải gõ &lt; bằng tay. */
export const code = (src) => `<pre><code>${esc(src)}</code></pre>`;

/** Mã inline trong một câu văn — cũng tự thoát, dùng cho `<div class="p-4">`… */
export const c = (src) => `<code>${esc(src)}</code>`;

/**
 * Link mở kịch bản mô phỏng tương ứng với câu hỏi.
 * Học viên làm sai câu nào thì mở đúng hoạt hình giải thích câu đó, và trang
 * /simulation dựng luôn nút "← Quay lại bài học" nhờ fromCourse/fromLesson.
 */
export const sim = (scenario, lessonSlug, label) =>
  ` <a class="exam-sim-link" href="/simulation?scenario=${encodeURIComponent(scenario)}` +
  `&amp;fromCourse=tailwind-css&amp;fromLesson=${encodeURIComponent(lessonSlug)}">▶ ${esc(label)}</a>`;

/**
 * Rubric dùng lại cho mọi câu lập trình (PT/FE làm tại chỗ và PE nộp .zip).
 *
 * Ba tiêu chí bám đúng ba câu hỏi mà cả khoá xoay quanh:
 *   1. Quy tắc CÓ ĐƯỢC PHÁT SINH không — Tailwind là một trình SINH, nên hiện
 *      vật chỉ tồn tại khi lớp xuất hiện nguyên văn ở chỗ `content` quét tới.
 *   2. Khi hai quy tắc cùng đặt một thuộc tính thì AI THẮNG — và người viết có
 *      chủ động quyết định điều đó (`cn()`, `@layer`, độ đặc hiệu) hay phó mặc
 *      cho thứ tự phát sinh.
 *   3. Hiện vật có dùng ĐÚNG cơ chế của Tailwind không — thang giá trị thay vì
 *      giá trị tuỳ ý rời rạc, biến CSS thay vì bảng-màu-cặp, vòng focus và
 *      tương phản còn nguyên.
 */
export const RUBRIC_CODE = [
  {
    id: 'correct',
    criterion: B(
      'The artifact does what the question asks, and it is <em>generated</em>: every class named appears verbatim somewhere <code>content</code> scans, so the rule really exists in the built CSS — not only in the markup.',
      'Hiện vật làm đúng thứ đề yêu cầu, và nó ĐƯỢC PHÁT SINH: mọi lớp được nhắc đến đều xuất hiện nguyên văn ở chỗ <code>content</code> quét tới, nên quy tắc thật sự có trong CSS đầu ra — không chỉ có trong mã đánh dấu.',
    ),
    weight: 3,
    maxScore: 4,
  },
  {
    id: 'logic',
    criterion: B(
      'Conflicts are decided on purpose, not by accident: classes composed at runtime go through a merge, the caller\'s <code>className</code> is applied last, and anything that must beat a utility does so by layer or specificity rather than by hoping about emit order.',
      'Xung đột được quyết định CÓ CHỦ Ý chứ không do tình cờ: lớp soạn lúc chạy đi qua một bước hợp nhất, <code>className</code> của người gọi được áp SAU CÙNG, và thứ gì phải thắng một tiện ích thì thắng bằng layer hoặc độ đặc hiệu chứ không bằng cách hy vọng vào thứ tự phát sinh.',
    ),
    weight: 2,
    maxScore: 4,
  },
  {
    id: 'quality',
    criterion: B(
      'Idiomatic and accessible: the scale before arbitrary values, config or CSS variables before hand-tuned hex, no class name built by string interpolation, no <code>!important</code> reflex, focus rings and contrast left intact, and the scaffold given in the question untouched.',
      'Đúng lối và tiếp cận được: dùng thang giá trị trước khi dùng giá trị tuỳ ý, dùng config hoặc biến CSS trước khi dán mã hex chỉnh tay, không có tên lớp nào ghép bằng nội suy chuỗi, không có phản xạ <code>!important</code>, vòng focus và tương phản còn nguyên, và giữ nguyên phần khung đề cho sẵn.',
    ),
    weight: 1,
    maxScore: 4,
  },
];

/** Hướng dẫn đầu đề cho một bài Progress Test (trắc nghiệm + câu thực hành). */
export const ptInstructions = (n, chapters) =>
  '<div class="ml-en">' +
  `<p><b>Progress Test ${n}</b> covers chapters ${chapters} of the Tailwind CSS course. It mixes two kinds of question:</p>` +
  '<ul>' +
  '<li><b>Multiple choice</b> — auto-graded. Some questions say "choose TWO"; those only count as correct when both are selected.</li>' +
  '<li><b>Practical</b> — write the config, the CSS file or the component straight into the editor in the exam room. It is graded by AI against the reference answer and a rubric.</li>' +
  '</ul>' +
  '<p>Read the generated CSS carefully: several questions turn on the difference between a class you wrote and a rule that was actually emitted, on which of two colliding utilities appears later in the output file, or on what a variant prefix compiles into. You can flag a question and come back to it. The timer auto-submits when it ends.</p>' +
  '<p>After you submit, every question shows a bilingual explanation.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  `<p><b>Bài kiểm tra tiến độ ${n}</b> bao phủ chương ${chapters} của khoá Tailwind CSS. Đề có hai loại câu:</p>` +
  '<ul>' +
  '<li><b>Trắc nghiệm</b> — chấm tự động. Một số câu ghi "chọn HAI"; chỉ đúng khi chọn đủ cả hai đáp án.</li>' +
  '<li><b>Thực hành</b> — gõ thẳng file cấu hình, file CSS hay component vào ô soạn thảo trong phòng thi. AI chấm dựa trên đáp án mẫu và bộ tiêu chí.</li>' +
  '</ul>' +
  '<p>Hãy đọc kỹ phần CSS được phát sinh: nhiều câu ăn thua ở chỗ phân biệt một lớp bạn VIẾT với một quy tắc thật sự ĐƯỢC SINH RA, ở chỗ trong hai tiện ích đụng nhau thì cái nào nằm sau hơn trong file đầu ra, hoặc ở chỗ một tiền tố biến thể biên dịch ra cái gì. Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp.</p>' +
  '<p>Nộp bài xong, mỗi câu đều có lời giải thích song ngữ.</p>' +
  '</div>';

/** Một câu trắc nghiệm. `correct` là số hoặc mảng số (câu chọn nhiều đáp án). */
export const mcq = ({ prompt, options, correct, explanation, points = 1 }) => ({
  kind: 'MCQ',
  points,
  prompt,
  options: options.map((text) => ({ text })),
  correctIndexes: Array.isArray(correct) ? correct : [correct],
  explanation,
});

/** Một câu thực hành: viết config / CSS / component / script đo đạc. */
// `khongChayDuoc`: lý do bằng chữ vì sao scripts/exam-check.mjs KHÔNG chạy được
// lời giải câu này (cần Tailwind CLI, cần trình duyệt để quan sát, lời giải là
// một gói nhiều file…). Chỉ dùng khi ngôn ngữ vốn CHẠY ĐƯỢC — ngôn ngữ không
// chạy được thì bộ kiểm tự nhận ra qua nhãn. Khoá này dùng nó nhiều hơn khoá
// Docker vì `css`, `js` và `tsx` đều là nhãn mà bộ kiểm SẼ đưa cho node, nên
// một file cấu hình Tailwind hay một component React phải nói rõ lý do được
// miễn thay vì im lặng trả về SyntaxError.
// Seeder chọn field tường minh nên field này không vào DB.
export const codeQ = ({ points, prompt, language = 'css', starterCode, expectedOutput, sampleSolution, rubric = RUBRIC_CODE, khongChayDuoc }) => ({
  kind: 'CODE',
  points,
  prompt,
  language,
  starterCode,
  expectedOutput,
  sampleSolution,
  rubric,
  ...(khongChayDuoc ? { khongChayDuoc } : {}),
});
