/**
 * Bộ khuôn dùng chung cho các đề thi khoá Node.js (PT1–PT3, FE, 10 đề PE).
 *
 * Mọi chuỗi hiển thị trong Phòng thi đều song ngữ: hoặc dạng ống "EN|||VI"
 * (prompt, option — client tự tách bằng pickLang), hoặc dạng HTML hai khối
 * `.ml-en` / `.ml-vi` (giải thích, hướng dẫn — client bật/tắt bằng data-ml).
 *
 * Vì sao có file này: viết tay 4 đề × ~35 câu × 2 ngôn ngữ thì lỗi thoát ký tự
 * HTML là chuyện chắc chắn xảy ra. `code()` tự thoát `< > &`, nên đoạn mã trong
 * đề luôn hiện đúng nguyên văn.
 */

/** Chuỗi song ngữ dạng ống — dùng cho prompt và option. */
export const B = (en, vi) => `${en}|||${vi}`;

/** Giải thích song ngữ dạng HTML hai khối. */
export const EX = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const esc = (s) => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

/** Khối mã trong đề — tự thoát ký tự, khỏi phải gõ &lt; bằng tay. */
export const code = (src) => `<pre><code>${esc(src)}</code></pre>`;

/**
 * Link mở kịch bản mô phỏng tương ứng với câu hỏi.
 * Học viên làm sai câu nào thì mở đúng hoạt hình giải thích câu đó, và trang
 * /simulation dựng luôn nút "← Quay lại bài học" nhờ fromCourse/fromLesson.
 */
export const sim = (scenario, lessonSlug, label) =>
  ` <a class="exam-sim-link" href="/simulation?scenario=${encodeURIComponent(scenario)}` +
  `&amp;fromCourse=nodejs&amp;fromLesson=${encodeURIComponent(lessonSlug)}">▶ ${esc(label)}</a>`;

/** Rubric dùng lại cho mọi câu lập trình (PT/FE làm tại chỗ và PE nộp .zip). */
export const RUBRIC_CODE = [
  {
    id: 'correct',
    criterion: B(
      'The program runs and produces exactly the expected output, including the edge cases stated in the problem.',
      'Chương trình chạy được và cho đúng kết quả kỳ vọng, kể cả các ca biên đã nêu trong đề.',
    ),
    weight: 3,
    maxScore: 4,
  },
  {
    id: 'logic',
    criterion: B(
      'The approach is right: correct Node/JavaScript semantics, no accidental sequential await, no mutation of the given data, errors handled where the spec requires it.',
      'Cách làm đúng: dùng đúng ngữ nghĩa Node/JavaScript, không vô tình await tuần tự, không sửa dữ liệu cho sẵn, xử lý lỗi ở đúng chỗ đề yêu cầu.',
    ),
    weight: 2,
    maxScore: 4,
  },
  {
    id: 'quality',
    criterion: B(
      'Readable code: clear names, no dead code, no unnecessary library, the given scaffold left untouched.',
      'Mã dễ đọc: đặt tên rõ, không có mã thừa, không dùng thư viện không cần thiết, giữ nguyên phần khung đề cho sẵn.',
    ),
    weight: 1,
    maxScore: 4,
  },
];

/** Hướng dẫn đầu đề cho một bài Progress Test (trắc nghiệm + câu lập trình). */
export const ptInstructions = (n, chapters) =>
  '<div class="ml-en">' +
  `<p><b>Progress Test ${n}</b> covers chapters ${chapters} of the Node.js course. It mixes two kinds of question:</p>` +
  '<ul>' +
  '<li><b>Multiple choice</b> — auto-graded. Some questions say "choose TWO"; those only count as correct when both are selected.</li>' +
  '<li><b>Coding</b> — write your answer straight into the editor in the exam room. It is graded by AI against the reference solution, the expected output and a rubric.</li>' +
  '</ul>' +
  '<p>Read the code snippets carefully: several questions turn on execution order, on a value being a string rather than a number, or on a missing <code>return</code>. You can flag a question and come back to it. The timer auto-submits when it ends.</p>' +
  '<p>After you submit, every question shows a bilingual explanation — and where a simulation exists, a link to the animation that demonstrates it.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  `<p><b>Bài kiểm tra tiến độ ${n}</b> bao phủ chương ${chapters} của khoá Node.js. Đề có hai loại câu:</p>` +
  '<ul>' +
  '<li><b>Trắc nghiệm</b> — chấm tự động. Một số câu ghi "chọn HAI"; chỉ đúng khi chọn đủ cả hai đáp án.</li>' +
  '<li><b>Lập trình</b> — gõ lời giải thẳng vào ô soạn thảo trong phòng thi. AI chấm dựa trên đáp án mẫu, kết quả mong đợi và bộ tiêu chí.</li>' +
  '</ul>' +
  '<p>Hãy đọc kỹ các đoạn mã: nhiều câu ăn thua ở thứ tự thực thi, ở chuyện một giá trị là chuỗi chứ không phải số, hoặc ở một chữ <code>return</code> bị thiếu. Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp.</p>' +
  '<p>Nộp bài xong, mỗi câu đều có lời giải thích song ngữ — và nếu có mô phỏng thì kèm luôn link tới hoạt hình minh hoạ.</p>' +
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

/** Một câu lập trình làm ngay trong phòng thi (không nộp .zip). */
export const codeQ = ({ points, prompt, language = 'javascript', starterCode, expectedOutput, sampleSolution, rubric = RUBRIC_CODE }) => ({
  kind: 'CODE',
  points,
  prompt,
  language,
  starterCode,
  expectedOutput,
  sampleSolution,
  rubric,
});
