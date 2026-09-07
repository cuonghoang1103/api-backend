/**
 * Bộ khuôn dùng chung cho các đề thi khoá PostgreSQL (FE, PE, và PT về sau).
 *
 * Mọi chuỗi hiển thị trong Phòng thi đều song ngữ: hoặc dạng ống "EN|||VI"
 * (prompt, option — client tự tách bằng pickLang), hoặc dạng HTML hai khối
 * `.ml-en` / `.ml-vi` (giải thích, hướng dẫn — client bật/tắt bằng data-ml).
 *
 * ⚠️ MỖI TRƯỜNG CHỈ ĐƯỢC CÓ ĐÚNG MỘT DẤU `|||`. Khoá này dễ dính vì SQL dùng
 * `|` cho toán tử nối `||`, cho `?|` của jsonb, và vì psql vẽ bảng kết quả bằng
 * cột `|`. Bất cứ bảng kết quả nào, bất cứ `a || b` nào cũng PHẢI nằm trong
 * `code()` hoặc `<code>` — và tuyệt đối không gõ ba dấu `|` liền nhau trong nội
 * dung. Một bảng psql ba cột dán thẳng vào prompt là đủ để bản tiếng Việt lòi cả
 * đoạn tiếng Anh ra màn hình.
 *
 * Vì sao có file này: khoá PostgreSQL đầy toán tử `<`, `>`, `<>`, `->>`, `@>`,
 * `<->` và những kế hoạch `EXPLAIN` vẽ bằng `->`. `code()` tự thoát `< > &`, nên
 * đoạn SQL và bảng kế hoạch trong đề luôn hiện đúng nguyên văn thay vì bị trình
 * duyệt nuốt mất một nửa.
 *
 * Sao chép từ typescript-exam-kit.mjs; điểm khác: `sim()` gắn
 * `fromCourse=postgresql`, và rubric mô tả ngữ nghĩa SQL (đúng tập kết quả,
 * đúng grain, dùng đúng công cụ của Postgres) thay vì kiểu TypeScript.
 */

/** Chuỗi song ngữ dạng ống — dùng cho prompt và option. Đúng MỘT dấu ống. */
export const B = (en, vi) => `${en}|||${vi}`;

/** Giải thích song ngữ dạng HTML hai khối. */
export const EX = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const esc = (s) => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

/** Khối mã/SQL/kế hoạch trong đề — tự thoát ký tự, khỏi phải gõ &lt; bằng tay. */
export const code = (src) => `<pre><code>${esc(src)}</code></pre>`;

/** Mã inline trong một câu văn — cũng tự thoát, dùng cho `->>`, `@>`, `<>`… */
export const c = (src) => `<code>${esc(src)}</code>`;

/**
 * Link mở kịch bản mô phỏng tương ứng với câu hỏi.
 * Học viên làm sai câu nào thì mở đúng hoạt hình giải thích câu đó, và trang
 * /simulation dựng luôn nút "← Quay lại bài học" nhờ fromCourse/fromLesson.
 */
export const sim = (scenario, lessonSlug, label) =>
  ` <a class="exam-sim-link" href="/simulation?scenario=${encodeURIComponent(scenario)}` +
  `&amp;fromCourse=postgresql&amp;fromLesson=${encodeURIComponent(lessonSlug)}">▶ ${esc(label)}</a>`;

/** Rubric dùng lại cho mọi câu viết SQL (PT/FE làm tại chỗ và PE nộp .zip). */
export const RUBRIC_CODE = [
  {
    id: 'correct',
    criterion: B(
      'The statement runs on PostgreSQL without error and returns exactly the expected rows, in the expected order, including the edge cases named in the problem.',
      'Câu lệnh chạy được trên PostgreSQL không lỗi và trả về đúng tập dòng kỳ vọng, đúng thứ tự, kể cả các ca biên đã nêu trong đề.',
    ),
    weight: 3,
    maxScore: 4,
  },
  {
    id: 'logic',
    criterion: B(
      'The query works at the right grain: no fan-out inflating an aggregate, no filter on the optional side of an OUTER JOIN sitting in <code>WHERE</code>, and NULLs handled with <code>IS NULL</code> / <code>IS DISTINCT FROM</code> rather than assumed away.',
      'Truy vấn làm việc ở đúng grain: không để fan-out thổi phồng số tổng hợp, không đặt điều kiện lọc của phía tuỳ chọn trong OUTER JOIN vào <code>WHERE</code>, và xử lý NULL bằng <code>IS NULL</code> / <code>IS DISTINCT FROM</code> chứ không mặc định là không có.',
    ),
    weight: 2,
    maxScore: 4,
  },
  {
    id: 'quality',
    criterion: B(
      'Readable SQL: table aliases, one step per CTE where it helps, the work left to the database instead of pulled into a loop, and the given schema left untouched.',
      'SQL dễ đọc: có alias bảng, tách bước bằng CTE ở chỗ đáng tách, để cơ sở dữ liệu làm việc thay vì kéo dữ liệu ra vòng lặp, và giữ nguyên lược đồ đề cho sẵn.',
    ),
    weight: 1,
    maxScore: 4,
  },
];

/** Hướng dẫn đầu đề cho một bài Progress Test (trắc nghiệm + câu viết SQL). */
export const ptInstructions = (n, chapters) =>
  '<div class="ml-en">' +
  `<p><b>Progress Test ${n}</b> covers chapters ${chapters} of the PostgreSQL course. It mixes two kinds of question:</p>` +
  '<ul>' +
  '<li><b>Multiple choice</b> — auto-graded. Some questions say "choose TWO"; those only count as correct when both are selected.</li>' +
  '<li><b>SQL</b> — write your answer straight into the editor in the exam room. It is graded by AI against the reference solution, the expected result set and a rubric.</li>' +
  '</ul>' +
  '<p>Read the snippets carefully: several questions turn on whether a row is dropped by a NULL comparison, on which side of an OUTER JOIN a condition sits, or on whether the planner can use an index at all. You can flag a question and come back to it. The timer auto-submits when it ends.</p>' +
  '<p>After you submit, every question shows a bilingual explanation.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  `<p><b>Bài kiểm tra tiến độ ${n}</b> bao phủ chương ${chapters} của khoá PostgreSQL. Đề có hai loại câu:</p>` +
  '<ul>' +
  '<li><b>Trắc nghiệm</b> — chấm tự động. Một số câu ghi "chọn HAI"; chỉ đúng khi chọn đủ cả hai đáp án.</li>' +
  '<li><b>SQL</b> — gõ lời giải thẳng vào ô soạn thảo trong phòng thi. AI chấm dựa trên đáp án mẫu, tập kết quả mong đợi và bộ tiêu chí.</li>' +
  '</ul>' +
  '<p>Hãy đọc kỹ các đoạn mã: nhiều câu ăn thua ở chỗ một dòng bị loại vì phép so sánh với NULL, ở chuyện một điều kiện nằm bên nào của OUTER JOIN, hoặc ở chuyện bộ lập kế hoạch có dùng nổi chỉ mục hay không. Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp.</p>' +
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

/** Một câu viết SQL (PE nộp .zip, hoặc PT/FE làm ngay trong phòng thi). */
export const codeQ = ({ points, prompt, language = 'sql', starterCode, expectedOutput, sampleSolution, rubric = RUBRIC_CODE }) => ({
  kind: 'CODE',
  points,
  prompt,
  language,
  starterCode,
  expectedOutput,
  sampleSolution,
  rubric,
});
