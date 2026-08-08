/**
 * Bộ khuôn dùng chung cho các đề thi khoá Next.js & React
 * (PT1–PT3, 5 đề FE, 10 đề PE).
 *
 * Mọi chuỗi hiển thị trong Phòng thi đều song ngữ: hoặc dạng ống "EN|||VI"
 * (prompt, option — client tự tách bằng pickLang), hoặc dạng HTML hai khối
 * `.ml-en` / `.ml-vi` (giải thích, hướng dẫn — client bật/tắt bằng data-ml).
 *
 * Vì sao có file này: viết tay 3 PT + 5 FE + 10 PE × song ngữ thì lỗi thoát ký
 * tự HTML là chuyện chắc chắn xảy ra. `code()` tự thoát `< > &`, nên đoạn mã
 * (kể cả JSX) trong đề luôn hiện đúng nguyên văn.
 *
 * Sao chép từ nodejs-exam-kit.mjs; điểm khác duy nhất là `sim()` gắn
 * `fromCourse=nextjs`, và rubric mô tả ngữ nghĩa React/Next thay vì Node.
 */

/** Chuỗi song ngữ dạng ống — dùng cho prompt và option. */
export const B = (en, vi) => `${en}|||${vi}`;

/** Giải thích song ngữ dạng HTML hai khối. */
export const EX = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const esc = (s) => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

/** Khối mã trong đề — tự thoát ký tự, khỏi phải gõ &lt; bằng tay (kể cả JSX). */
export const code = (src) => `<pre><code>${esc(src)}</code></pre>`;

/**
 * Link mở kịch bản mô phỏng tương ứng với câu hỏi.
 * Học viên làm sai câu nào thì mở đúng hoạt hình giải thích câu đó, và trang
 * /simulation dựng luôn nút "← Quay lại bài học" nhờ fromCourse/fromLesson.
 */
export const sim = (scenario, lessonSlug, label) =>
  ` <a class="exam-sim-link" href="/simulation?scenario=${encodeURIComponent(scenario)}` +
  `&amp;fromCourse=nextjs&amp;fromLesson=${encodeURIComponent(lessonSlug)}">▶ ${esc(label)}</a>`;

/** Rubric dùng lại cho mọi câu lập trình (PT/FE làm tại chỗ và PE nộp .zip). */
export const RUBRIC_CODE = [
  {
    id: 'correct',
    criterion: B(
      'The component/function renders or returns exactly the expected result, including the edge cases stated in the problem.',
      'Component/hàm render hoặc trả về đúng kết quả kỳ vọng, kể cả các ca biên đã nêu trong đề.',
    ),
    weight: 3,
    maxScore: 4,
  },
  {
    id: 'logic',
    criterion: B(
      'The approach is idiomatic React/Next: correct hook rules, no state mutation, effect dependencies right, the Server/Client boundary respected, keys stable.',
      'Cách làm đúng chất React/Next: theo đúng luật hook, không mutate state, mảng phụ thuộc của effect chính xác, tôn trọng ranh giới Server/Client, key ổn định.',
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
  `<p><b>Progress Test ${n}</b> covers chapters ${chapters} of the Next.js &amp; React course. It mixes two kinds of question:</p>` +
  '<ul>' +
  '<li><b>Multiple choice</b> — auto-graded. Some questions say "choose TWO"; those only count as correct when both are selected.</li>' +
  '<li><b>Coding</b> — write your answer straight into the editor in the exam room. It is graded by AI against the reference solution, the expected result and a rubric.</li>' +
  '</ul>' +
  '<p>Read the code carefully: several questions turn on whether a component re-renders, on a stale closure inside an effect, on the Server/Client boundary, or on a missing <code>key</code>. You can flag a question and come back to it. The timer auto-submits when it ends.</p>' +
  '<p>After you submit, every question shows a bilingual explanation.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  `<p><b>Bài kiểm tra tiến độ ${n}</b> bao phủ chương ${chapters} của khoá Next.js &amp; React. Đề có hai loại câu:</p>` +
  '<ul>' +
  '<li><b>Trắc nghiệm</b> — chấm tự động. Một số câu ghi "chọn HAI"; chỉ đúng khi chọn đủ cả hai đáp án.</li>' +
  '<li><b>Lập trình</b> — gõ lời giải thẳng vào ô soạn thảo trong phòng thi. AI chấm dựa trên đáp án mẫu, kết quả mong đợi và bộ tiêu chí.</li>' +
  '</ul>' +
  '<p>Hãy đọc kỹ đoạn mã: nhiều câu ăn thua ở chuyện component có render lại hay không, ở một closure cũ kẹt trong effect, ở ranh giới Server/Client, hoặc ở một chữ <code>key</code> bị thiếu. Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp.</p>' +
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
