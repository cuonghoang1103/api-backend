/**
 * Bộ khuôn dùng chung cho các đề thi khoá Git & GitHub (FE, PE, và các PT về sau).
 *
 * Mọi chuỗi hiển thị trong Phòng thi đều song ngữ: hoặc dạng ống "EN|||VI"
 * (prompt, option — client tự tách bằng pickLang), hoặc dạng HTML hai khối
 * `.ml-en` / `.ml-vi` (giải thích, hướng dẫn — client bật/tắt bằng data-ml).
 *
 * ⚠️ MỖI TRƯỜNG CHỈ ĐƯỢC CÓ ĐÚNG MỘT DẤU `|||`. Nếu phần EN hay phần VI tự
 * chứa thêm một dấu ống nữa thì bản tiếng Việt sẽ lòi cả đoạn tiếng Anh ra màn
 * hình. Khoá Git dễ dính vì đường ống shell viết bằng đúng ký tự `|` — nên mọi
 * lệnh có `|` phải bọc trong `code()` hoặc `<code>`, và KHÔNG bao giờ gõ ba dấu
 * `|` liền nhau trong nội dung.
 *
 * Vì sao có file này: output của Git đầy `<` `>` (dấu xung đột `<<<<<<< HEAD`,
 * `<file>`, `HEAD -> main`, `<url>`). `code()` tự thoát `< > &`, nên đoạn mã và
 * output trong đề luôn hiện đúng nguyên văn thay vì bị trình duyệt nuốt mất.
 *
 * Sao chép từ typescript-exam-kit.mjs; điểm khác: `sim()` gắn `fromCourse=git`,
 * và rubric mô tả ngữ nghĩa Git (lệnh chạy được, trạng thái kho, lịch sử) thay
 * vì trình biên dịch TypeScript.
 */

/** Chuỗi song ngữ dạng ống — dùng cho prompt và option. Đúng MỘT dấu ống. */
export const B = (en, vi) => `${en}|||${vi}`;

/** Giải thích song ngữ dạng HTML hai khối. */
export const EX = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const esc = (s) => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

/** Khối mã/output trong đề — tự thoát ký tự, khỏi phải gõ &lt; bằng tay. */
export const code = (src) => `<pre><code>${esc(src)}</code></pre>`;

/** Mã inline trong một câu văn — cũng tự thoát, dùng cho `HEAD~2`, `origin/main`… */
export const c = (src) => `<code>${esc(src)}</code>`;

/**
 * Link mở kịch bản mô phỏng tương ứng với câu hỏi.
 * Học viên làm sai câu nào thì mở đúng hoạt hình giải thích câu đó, và trang
 * /simulation dựng luôn nút "← Quay lại bài học" nhờ fromCourse/fromLesson.
 */
export const sim = (scenario, lessonSlug, label) =>
  ` <a class="exam-sim-link" href="/simulation?scenario=${encodeURIComponent(scenario)}` +
  `&amp;fromCourse=git&amp;fromLesson=${encodeURIComponent(lessonSlug)}">▶ ${esc(label)}</a>`;

/** Rubric dùng lại cho mọi câu thực hành (PT/FE làm tại chỗ và PE nộp .zip). */
export const RUBRIC_CODE = [
  {
    id: 'correct',
    criterion: B(
      'The script runs from an empty directory to the end with no error, and the repository is left in exactly the state the question describes.',
      'Kịch bản chạy từ một thư mục rỗng tới hết mà không lỗi, và kho mã còn lại đúng trạng thái mà đề mô tả.',
    ),
    weight: 3,
    maxScore: 4,
  },
  {
    id: 'logic',
    criterion: B(
      'The right command was chosen for the situation: a shared branch is undone with <code>revert</code> rather than <code>reset</code>, history is rewritten only where it is private, and nothing destructive is used where a safe command exists.',
      'Chọn đúng lệnh cho tình huống: nhánh dùng chung thì hoàn tác bằng <code>revert</code> chứ không phải <code>reset</code>, chỉ viết lại lịch sử ở chỗ riêng tư, và không dùng lệnh phá huỷ khi đã có lệnh an toàn.',
    ),
    weight: 2,
    maxScore: 4,
  },
  {
    id: 'quality',
    criterion: B(
      'Readable work: commit messages that say why, no stray files committed, the given scaffold left untouched, and no command that only appears to work because of an interactive editor.',
      'Bài làm dễ đọc: lời nhắn commit nói được vì sao, không commit nhầm file thừa, giữ nguyên phần khung đề cho sẵn, và không dùng lệnh chỉ chạy được nhờ mở trình soạn thảo tương tác.',
    ),
    weight: 1,
    maxScore: 4,
  },
];

/** Hướng dẫn đầu đề cho một bài Progress Test (trắc nghiệm + câu thực hành). */
export const ptInstructions = (n, chapters) =>
  '<div class="ml-en">' +
  `<p><b>Progress Test ${n}</b> covers chapters ${chapters} of the Git course. It mixes two kinds of question:</p>` +
  '<ul>' +
  '<li><b>Multiple choice</b> — auto-graded. Some questions say "choose TWO"; those only count as correct when both are selected.</li>' +
  '<li><b>Practical</b> — write the commands straight into the editor in the exam room. It is graded by AI against the reference solution, the resulting repository state and a rubric.</li>' +
  '</ul>' +
  '<p>Read the command sequences carefully: several questions turn on whether a command moves a pointer or rewrites a file, on which of the three trees is touched, or on whether a hash survives an operation. You can flag a question and come back to it. The timer auto-submits when it ends.</p>' +
  '<p>After you submit, every question shows a bilingual explanation.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  `<p><b>Bài kiểm tra tiến độ ${n}</b> bao phủ chương ${chapters} của khoá Git. Đề có hai loại câu:</p>` +
  '<ul>' +
  '<li><b>Trắc nghiệm</b> — chấm tự động. Một số câu ghi "chọn HAI"; chỉ đúng khi chọn đủ cả hai đáp án.</li>' +
  '<li><b>Thực hành</b> — gõ thẳng chuỗi lệnh vào ô soạn thảo trong phòng thi. AI chấm dựa trên đáp án mẫu, trạng thái kho mã thu được và bộ tiêu chí.</li>' +
  '</ul>' +
  '<p>Hãy đọc kỹ các chuỗi lệnh: nhiều câu ăn thua ở chỗ một lệnh dời con trỏ hay viết lại file, ở chỗ nó đụng vào cây nào trong ba cây, hoặc ở chuyện một mã băm có sống sót qua thao tác đó không. Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp.</p>' +
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

/** Một câu thực hành làm ngay trong phòng thi (không nộp .zip). */
export const codeQ = ({ points, prompt, language = 'bash', starterCode, expectedOutput, sampleSolution, rubric = RUBRIC_CODE }) => ({
  kind: 'CODE',
  points,
  prompt,
  language,
  starterCode,
  expectedOutput,
  sampleSolution,
  rubric,
});
