/**
 * Bộ khuôn dùng chung cho các đề thi khoá TypeScript (FE, và các PT/PE về sau).
 *
 * Mọi chuỗi hiển thị trong Phòng thi đều song ngữ: hoặc dạng ống "EN|||VI"
 * (prompt, option — client tự tách bằng pickLang), hoặc dạng HTML hai khối
 * `.ml-en` / `.ml-vi` (giải thích, hướng dẫn — client bật/tắt bằng data-ml).
 *
 * ⚠️ MỖI TRƯỜNG CHỈ ĐƯỢC CÓ ĐÚNG MỘT DẤU `|||`. Nếu phần EN hay phần VI tự
 * chứa thêm một dấu ống nữa thì bản tiếng Việt sẽ lòi cả đoạn tiếng Anh ra màn
 * hình. Khoá này đặc biệt dễ dính vì union TypeScript viết bằng đúng ký tự
 * `|` — nên mọi union trong đề phải bọc trong `code()` hoặc `<code>`, và
 * KHÔNG bao giờ gõ ba dấu `|` liền nhau trong nội dung.
 *
 * Vì sao có file này: khoá TypeScript đầy generic (`Map<string, User[]>`,
 * `Partial<T>`) và mọi đoạn mã đều có `<` `>`. `code()` tự thoát `< > &`, nên
 * đoạn mã trong đề luôn hiện đúng nguyên văn thay vì bị trình duyệt nuốt mất.
 *
 * Sao chép từ nodejs-exam-kit.mjs; điểm khác: `sim()` gắn
 * `fromCourse=typescript`, và rubric mô tả ngữ nghĩa TypeScript (kiểu, strict,
 * biên dịch) thay vì Node.
 */

/** Chuỗi song ngữ dạng ống — dùng cho prompt và option. Đúng MỘT dấu ống. */
export const B = (en, vi) => `${en}|||${vi}`;

/** Giải thích song ngữ dạng HTML hai khối. */
export const EX = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const esc = (s) => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

/** Khối mã trong đề — tự thoát ký tự, khỏi phải gõ &lt; bằng tay (đầy generic). */
export const code = (src) => `<pre><code>${esc(src)}</code></pre>`;

/** Mã inline trong một câu văn — cũng tự thoát, dùng cho `T[K]`, `A | B`… */
export const c = (src) => `<code>${esc(src)}</code>`;

/**
 * Link mở kịch bản mô phỏng tương ứng với câu hỏi.
 * Học viên làm sai câu nào thì mở đúng hoạt hình giải thích câu đó, và trang
 * /simulation dựng luôn nút "← Quay lại bài học" nhờ fromCourse/fromLesson.
 */
export const sim = (scenario, lessonSlug, label) =>
  ` <a class="exam-sim-link" href="/simulation?scenario=${encodeURIComponent(scenario)}` +
  `&amp;fromCourse=typescript&amp;fromLesson=${encodeURIComponent(lessonSlug)}">▶ ${esc(label)}</a>`;

/** Rubric dùng lại cho mọi câu lập trình (PT/FE làm tại chỗ và PE nộp .zip). */
export const RUBRIC_CODE = [
  {
    id: 'correct',
    criterion: B(
      'The code compiles under <code>tsc --strict</code> with no errors and produces exactly the expected behaviour, including the edge cases stated in the problem.',
      'Mã biên dịch sạch dưới <code>tsc --strict</code> và cho đúng hành vi kỳ vọng, kể cả các ca biên đã nêu trong đề.',
    ),
    weight: 3,
    maxScore: 4,
  },
  {
    id: 'logic',
    criterion: B(
      'The types are right: no <code>any</code>, no unnecessary assertion, unions narrowed instead of cast, and the type parameters actually relate an input to an output.',
      'Kiểu đặt đúng: không dùng <code>any</code>, không ép kiểu thừa, thu hẹp union thay vì cast, và tham số kiểu thật sự nối một đầu vào với một đầu ra.',
    ),
    weight: 2,
    maxScore: 4,
  },
  {
    id: 'quality',
    criterion: B(
      'Readable code: clear names, types derived from one source rather than hand-copied, no dead code, the given scaffold left untouched.',
      'Mã dễ đọc: đặt tên rõ, kiểu suy ra từ một nguồn thay vì chép tay, không có mã thừa, giữ nguyên phần khung đề cho sẵn.',
    ),
    weight: 1,
    maxScore: 4,
  },
];

/** Hướng dẫn đầu đề cho một bài Progress Test (trắc nghiệm + câu lập trình). */
export const ptInstructions = (n, chapters) =>
  '<div class="ml-en">' +
  `<p><b>Progress Test ${n}</b> covers chapters ${chapters} of the TypeScript course. It mixes two kinds of question:</p>` +
  '<ul>' +
  '<li><b>Multiple choice</b> — auto-graded. Some questions say "choose TWO"; those only count as correct when both are selected.</li>' +
  '<li><b>Coding</b> — write your answer straight into the editor in the exam room. It is graded by AI against the reference solution, the compiler output and a rubric.</li>' +
  '</ul>' +
  '<p>Read the code snippets carefully: several questions turn on whether a line is a compile error or a runtime crash, on a literal type widening to <code>string</code>, or on a missing narrowing check. You can flag a question and come back to it. The timer auto-submits when it ends.</p>' +
  '<p>After you submit, every question shows a bilingual explanation.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  `<p><b>Bài kiểm tra tiến độ ${n}</b> bao phủ chương ${chapters} của khoá TypeScript. Đề có hai loại câu:</p>` +
  '<ul>' +
  '<li><b>Trắc nghiệm</b> — chấm tự động. Một số câu ghi "chọn HAI"; chỉ đúng khi chọn đủ cả hai đáp án.</li>' +
  '<li><b>Lập trình</b> — gõ lời giải thẳng vào ô soạn thảo trong phòng thi. AI chấm dựa trên đáp án mẫu, kết quả trình biên dịch và bộ tiêu chí.</li>' +
  '</ul>' +
  '<p>Hãy đọc kỹ các đoạn mã: nhiều câu ăn thua ở chỗ một dòng là lỗi biên dịch hay là sập lúc chạy, ở chuyện một kiểu literal bị nới rộng thành <code>string</code>, hoặc ở một phép thu hẹp kiểu bị thiếu. Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp.</p>' +
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
export const codeQ = ({ points, prompt, language = 'typescript', starterCode, expectedOutput, sampleSolution, rubric = RUBRIC_CODE }) => ({
  kind: 'CODE',
  points,
  prompt,
  language,
  starterCode,
  expectedOutput,
  sampleSolution,
  rubric,
});
