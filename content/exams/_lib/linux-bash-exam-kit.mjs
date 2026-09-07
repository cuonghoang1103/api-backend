/**
 * Bộ khuôn dùng chung cho các đề thi khoá Linux & Bash (FE, PE, và PT về sau).
 *
 * Mọi chuỗi hiển thị trong Phòng thi đều song ngữ: hoặc dạng ống "EN|||VI"
 * (prompt, option — client tự tách bằng pickLang), hoặc dạng HTML hai khối
 * `.ml-en` / `.ml-vi` (giải thích, hướng dẫn — client bật/tắt bằng data-ml).
 *
 * ⚠️ MỖI TRƯỜNG CHỈ ĐƯỢC CÓ ĐÚNG MỘT DẤU `|||`. Khoá này dễ dính hơn khoá
 * TypeScript một bậc, vì ký tự `|` chính là ống dẫn của shell — `a | b`, `a || b`,
 * `[[ $x == a ]] || echo` đều hợp lệ trong đề. Luật đơn giản: KHÔNG bao giờ để
 * ba dấu `|` liền nhau xuất hiện trong nội dung, và mọi đoạn lệnh phải nằm trong
 * `code()` hoặc `c()`.
 *
 * Vì sao có file này: khoá Linux đầy `<`, `>`, `&` (chuyển hướng, `2>&1`,
 * `<(cmd)`, `&&`). `code()` tự thoát `< > &`, nên đoạn lệnh trong đề luôn hiện
 * đúng nguyên văn thay vì bị trình duyệt nuốt mất — gõ `&lt;` bằng tay ở một
 * khoá toàn dấu chuyển hướng là cách chắc chắn để sót một chỗ.
 *
 * Sao chép từ typescript-exam-kit.mjs; điểm khác: `sim()` gắn
 * `fromCourse=linux-bash`, và `RUBRIC_CODE` mô tả ngữ nghĩa shell (chạy đúng,
 * nháy đúng, mã thoát, dọn dẹp) thay vì kiểu TypeScript.
 */

/** Chuỗi song ngữ dạng ống — dùng cho prompt và option. Đúng MỘT dấu ống. */
export const B = (en, vi) => `${en}|||${vi}`;

/** Giải thích song ngữ dạng HTML hai khối. */
export const EX = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const esc = (s) => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

/** Khối lệnh trong đề — tự thoát ký tự, khỏi phải gõ &amp;lt; bằng tay. */
export const code = (src) => `<pre><code>${esc(src)}</code></pre>`;

/** Lệnh inline trong một câu văn — cũng tự thoát, dùng cho `2>&1`, `<(cmd)`… */
export const c = (src) => `<code>${esc(src)}</code>`;

/**
 * Link mở kịch bản mô phỏng tương ứng với câu hỏi.
 * Học viên làm sai câu nào thì mở đúng hoạt hình giải thích câu đó, và trang
 * /simulation dựng luôn nút "← Quay lại bài học" nhờ fromCourse/fromLesson.
 */
export const sim = (scenario, lessonSlug, label) =>
  ` <a class="exam-sim-link" href="/simulation?scenario=${encodeURIComponent(scenario)}` +
  `&amp;fromCourse=linux-bash&amp;fromLesson=${encodeURIComponent(lessonSlug)}">▶ ${esc(label)}</a>`;

/** Rubric dùng lại cho mọi câu lập trình (PT/FE làm tại chỗ và PE nộp .zip). */
export const RUBRIC_CODE = [
  {
    id: 'correct',
    criterion: B(
      'The script runs under <code>bash</code> with no syntax error and produces exactly the expected output, including the edge cases stated in the problem.',
      'Script chạy được bằng <code>bash</code>, không lỗi cú pháp, và cho đúng kết quả kỳ vọng, kể cả các ca biên đã nêu trong đề.',
    ),
    weight: 3,
    maxScore: 4,
  },
  {
    id: 'logic',
    criterion: B(
      'Shell hygiene: every expansion quoted, <code>[[ ]]</code> for tests, numeric comparison with <code>-gt</code> or <code>(( ))</code>, exit codes checked rather than assumed.',
      'Vệ sinh shell: mọi phép khai triển đều đặt trong nháy, dùng <code>[[ ]]</code> để kiểm, so sánh số bằng <code>-gt</code> hoặc <code>(( ))</code>, mã thoát được kiểm chứ không phải đoán.',
    ),
    weight: 2,
    maxScore: 4,
  },
  {
    id: 'quality',
    criterion: B(
      'Readable script: clear names, no dead code, no useless <code>cat</code> or subshell, the given scaffold left untouched.',
      'Script dễ đọc: đặt tên rõ, không có mã thừa, không có <code>cat</code> hay shell con vô ích, giữ nguyên phần khung đề cho sẵn.',
    ),
    weight: 1,
    maxScore: 4,
  },
];

/** Hướng dẫn đầu đề cho một bài Progress Test (trắc nghiệm + câu lập trình). */
export const ptInstructions = (n, chapters) =>
  '<div class="ml-en">' +
  `<p><b>Progress Test ${n}</b> covers chapters ${chapters} of the Linux &amp; Bash course. It mixes two kinds of question:</p>` +
  '<ul>' +
  '<li><b>Multiple choice</b> — auto-graded. Some questions say "choose TWO"; those only count as correct when both are selected.</li>' +
  '<li><b>Scripting</b> — write your answer straight into the editor in the exam room. It is graded by AI against the reference solution, the actual output and a rubric.</li>' +
  '</ul>' +
  '<p>Read the snippets carefully: several questions turn on what the <em>shell</em> did to the line before the command ever started — a glob expanded, a variable split into words, a redirection applied in the wrong order. The timer auto-submits when it ends.</p>' +
  '<p>After you submit, every question shows a bilingual explanation.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  `<p><b>Bài kiểm tra tiến độ ${n}</b> bao phủ chương ${chapters} của khoá Linux &amp; Bash. Đề có hai loại câu:</p>` +
  '<ul>' +
  '<li><b>Trắc nghiệm</b> — chấm tự động. Một số câu ghi "chọn HAI"; chỉ đúng khi chọn đủ cả hai đáp án.</li>' +
  '<li><b>Viết script</b> — gõ lời giải thẳng vào ô soạn thảo trong phòng thi. AI chấm dựa trên đáp án mẫu, kết quả chạy thật và bộ tiêu chí.</li>' +
  '</ul>' +
  '<p>Hãy đọc kỹ các đoạn lệnh: nhiều câu ăn thua ở chỗ <em>shell</em> đã làm gì với dòng lệnh trước khi chương trình kịp khởi động — một glob được khai triển, một biến bị cắt thành nhiều từ, một phép chuyển hướng đặt sai thứ tự. Hết giờ hệ thống tự nộp.</p>' +
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
