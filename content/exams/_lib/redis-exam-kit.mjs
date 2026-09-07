/**
 * Bộ khuôn dùng chung cho các đề thi khoá Redis (FE, PE, và các PT về sau).
 *
 * Mọi chuỗi hiển thị trong Phòng thi đều song ngữ: hoặc dạng ống "EN|||VI"
 * (prompt, option — client tự tách bằng pickLang), hoặc dạng HTML hai khối
 * `.ml-en` / `.ml-vi` (giải thích, hướng dẫn — client bật/tắt bằng data-ml).
 *
 * ⚠️ MỖI TRƯỜNG CHỈ ĐƯỢC CÓ ĐÚNG MỘT DẤU `|||`. Nếu phần EN hay phần VI tự
 * chứa thêm một dấu ống nữa thì bản tiếng Việt sẽ lòi cả đoạn tiếng Anh ra màn
 * hình. Khoá Redis dễ dính ở chỗ khác khoá TypeScript: `redis-cli` hay in ra
 * `|` trong bảng, và cú pháp `SET key val [NX|XX]` trong tài liệu Redis dùng
 * đúng ký tự ấy — nên mọi cú pháp lệnh phải bọc trong `code()`/`c()`, và KHÔNG
 * bao giờ gõ ba dấu `|` liền nhau trong nội dung.
 *
 * Vì sao có file này: đề Redis đầy transcript `redis-cli` (dấu `>`), đầy
 * `(nil)`, `(integer)`, và đầy Lua có `<` `>`. `code()` tự thoát `< > &` nên
 * transcript trong đề luôn hiện đúng nguyên văn thay vì bị trình duyệt nuốt.
 *
 * Sao chép từ typescript-exam-kit.mjs; điểm khác: `sim()` gắn
 * `fromCourse=redis`, và rubric mô tả ngữ nghĩa Redis (đúng lệnh, đúng ngữ
 * nghĩa nguyên tử, đúng vòng đời khoá) thay vì kiểu TypeScript.
 */

/** Chuỗi song ngữ dạng ống — dùng cho prompt và option. Đúng MỘT dấu ống. */
export const B = (en, vi) => `${en}|||${vi}`;

/** Giải thích song ngữ dạng HTML hai khối. */
export const EX = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const esc = (s) => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

/** Khối mã / transcript redis-cli trong đề — tự thoát ký tự. */
export const code = (src) => `<pre><code>${esc(src)}</code></pre>`;

/** Mã inline trong một câu văn — cũng tự thoát, dùng cho `SET k v NX`, `(nil)`… */
export const c = (src) => `<code>${esc(src)}</code>`;

/**
 * Link mở kịch bản mô phỏng tương ứng với câu hỏi.
 * Học viên làm sai câu nào thì mở đúng hoạt hình giải thích câu đó, và trang
 * /simulation dựng luôn nút "← Quay lại bài học" nhờ fromCourse/fromLesson.
 */
export const sim = (scenario, lessonSlug, label) =>
  ` <a class="exam-sim-link" href="/simulation?scenario=${encodeURIComponent(scenario)}` +
  `&amp;fromCourse=redis&amp;fromLesson=${encodeURIComponent(lessonSlug)}">▶ ${esc(label)}</a>`;

/** Rubric dùng lại cho mọi câu lập trình (PT/FE làm tại chỗ và PE nộp .zip). */
export const RUBRIC_CODE = [
  {
    id: 'correct',
    criterion: B(
      'The program runs under Node 22 with no error and prints exactly the expected lines, including the edge cases stated in the problem.',
      'Chương trình chạy được trên Node 22 không lỗi và in đúng các dòng kỳ vọng, kể cả những ca biên đã nêu trong đề.',
    ),
    weight: 3,
    maxScore: 4,
  },
  {
    id: 'logic',
    criterion: B(
      'The Redis semantics are right: the correct command for the job, return values read the way the server really returns them, and anything that must be indivisible is actually indivisible.',
      'Ngữ nghĩa Redis đúng: chọn đúng lệnh cho việc cần làm, đọc giá trị trả về đúng như máy chủ thật trả, và thứ gì buộc phải không thể chia cắt thì đúng là không thể chia cắt.',
    ),
    weight: 2,
    maxScore: 4,
  },
  {
    id: 'quality',
    criterion: B(
      'Readable code: clear key names with a namespace, no dead code, no round trip that does nothing, the given scaffold left untouched.',
      'Mã dễ đọc: tên khoá rõ ràng và có tiền tố phân vùng, không có mã thừa, không có lượt đi-về vô ích, giữ nguyên phần khung đề cho sẵn.',
    ),
    weight: 1,
    maxScore: 4,
  },
];

/** Hướng dẫn đầu đề cho một bài Progress Test (trắc nghiệm + câu lập trình). */
export const ptInstructions = (n, chapters) =>
  '<div class="ml-en">' +
  `<p><b>Progress Test ${n}</b> covers chapters ${chapters} of the Redis course. It mixes two kinds of question:</p>` +
  '<ul>' +
  '<li><b>Multiple choice</b> — auto-graded. Some questions say "choose TWO"; those only count as correct when both are selected.</li>' +
  '<li><b>Coding</b> — write your answer straight into the editor in the exam room. It is graded by AI against the reference solution, the program output and a rubric.</li>' +
  '</ul>' +
  '<p>Read the transcripts carefully: several questions turn on what a command <em>returns</em> rather than what it does, on whether a TTL survived a write, or on whether two commands were really one indivisible step. You can flag a question and come back to it. The timer auto-submits when it ends.</p>' +
  '<p>After you submit, every question shows a bilingual explanation.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  `<p><b>Bài kiểm tra tiến độ ${n}</b> bao phủ chương ${chapters} của khoá Redis. Đề có hai loại câu:</p>` +
  '<ul>' +
  '<li><b>Trắc nghiệm</b> — chấm tự động. Một số câu ghi "chọn HAI"; chỉ đúng khi chọn đủ cả hai đáp án.</li>' +
  '<li><b>Lập trình</b> — gõ lời giải thẳng vào ô soạn thảo trong phòng thi. AI chấm dựa trên đáp án mẫu, kết quả chương trình in ra và bộ tiêu chí.</li>' +
  '</ul>' +
  '<p>Hãy đọc kỹ các transcript: nhiều câu ăn thua ở chỗ lệnh <em>trả về</em> gì chứ không phải nó làm gì, ở chuyện một TTL có sống sót qua một lần ghi hay không, hoặc ở chuyện hai lệnh có thật sự là một bước không thể chia cắt hay không. Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp.</p>' +
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
